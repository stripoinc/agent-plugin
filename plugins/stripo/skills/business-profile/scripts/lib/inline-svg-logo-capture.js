// Serialize one exact selected inline SVG into safe, self-contained markup.
// This function is self-contained because DevTools serializes it into the page realm.
export function captureSelectedInlineSvgArtwork(suppliedElement, options = {}) {
  const {maxChars = 262144, maxUsePasses = 4, maxDefPasses = 4} = options;
  const SVG_NS = "http://www.w3.org/2000/svg";
  const XLINK_NS = "http://www.w3.org/1999/xlink";
  const SHAPE_TAGS = new Set(["path", "rect", "circle", "ellipse", "line", "polyline", "polygon", "text"]);
  const PAINT_ATTRS = ["fill", "stroke", "stop-color"];
  // Attributes whose value may carry a `url(#id)` funcIRI. `fill` and `stroke`
  // are the PAINT ones — an unresolvable ref there means the shape draws
  // nothing, which is the drop condition.
  const REF_ATTRS = [
    "fill", "stroke", "filter", "clip-path", "mask",
    "marker-start", "marker-mid", "marker-end",
  ];
  const PAINT_REF_PROPS = new Set(["fill", "stroke"]);
  // Non-rendering containers. Their contents are templates and definitions —
  // never removed by the visibility pass below, whatever the computed style of
  // an element the page never paints happens to say.
  const NON_RENDERED = new Set(["defs", "symbol", "clippath", "mask", "marker", "pattern", "lineargradient", "radialgradient", "filter"]);
  // The visibility pass drops from an ALLOW-list, never a deny-list. The SVG UA
  // stylesheet computes `display:none` for `<style>`, `<title>`, `<desc>` and
  // `<metadata>` too, and dropping the internal `<style>` would delete the very
  // rules the paint backfill could not reach (stroke-width, opacity, font on a
  // `<text>` wordmark). Only elements that actually PAINT are droppable — which
  // is exactly what a hidden light/dark variant is.
  const DROPPABLE_WHEN_HIDDEN = new Set([
    "path", "rect", "circle", "ellipse", "line", "polyline", "polygon", "text",
    "g", "image", "svg", "use", "a", "switch", "foreignobject",
  ]);
  // SVG's own initial `fill`. Backfilling it would add noise without changing
  // a single rendered pixel, so it is the one computed value left implicit.
  const DEFAULT_FILL = "rgb(0, 0, 0)";
  const URL_REF_RE = /url\(\s*['"]?#([^)'"\s]+)['"]?\s*\)/g;
  const tagOf = (element) => String(element?.tagName || "").toLowerCase();

  function inNonRenderedContainer(element) {
    let node = element.parentElement;
    while (node) {
      if (NON_RENDERED.has(tagOf(node))) return true;
      node = node.parentElement;
    }
    return false;
  }
  // --- Serialization helpers -------------------------------------------

  // `on*` handlers and `<script>` nodes, over an arbitrary subtree. Applied to
  // the clone in pass 1 AND to every sprite body inlined in pass 2 — an
  // `onclick` inside a `<symbol>` reaches `isPubliclySafeSvgPath` exactly like
  // one written in the logo itself, and suppresses the WHOLE capture.
  const sanitizeSubtree = (root, notes) => {
    for (const element of [root, ...root.querySelectorAll("*")]) {
      for (const attribute of [...element.attributes]) {
        if (/^on/i.test(attribute.name)) {
          element.removeAttribute(attribute.name);
          notes.eventAttrsStripped += 1;
        }
      }
    }
    for (const script of [...root.querySelectorAll("script")]) {
      script.remove();
      notes.scriptsStripped += 1;
    }
    if (tagOf(root) === "script") {
      root.remove();
      notes.scriptsStripped += 1;
    }
  };

  const resolveCurrentColorIn = (root, color) => {
    if (!color) return 0;
    let resolved = 0;
    for (const element of [root, ...root.querySelectorAll("*")]) {
      for (const name of PAINT_ATTRS) {
        const value = element.getAttribute(name);
        if (value && value.trim().toLowerCase() === "currentcolor") {
          element.setAttribute(name, color);
          resolved += 1;
        }
      }
      const style = element.getAttribute("style");
      if (style && /currentcolor/i.test(style)) {
        element.setAttribute("style", style.replace(/currentColor/gi, color));
        resolved += 1;
      }
    }
    return resolved;
  };

  // Every `url(#id)` the subtree references, tagged with whether losing it
  // would cost PAINT (an unfilled shape) or only an effect.
  const funcIriRefsIn = (root) => {
    const refs = [];
    const collect = (value, isPaint) => {
      URL_REF_RE.lastIndex = 0;
      let match = URL_REF_RE.exec(value);
      while (match) {
        refs.push({ id: match[1], paint: isPaint });
        match = URL_REF_RE.exec(value);
      }
    };
    for (const element of [root, ...root.querySelectorAll("*")]) {
      for (const name of REF_ATTRS) {
        const value = element.getAttribute(name);
        if (value && value.includes("url(")) collect(value, PAINT_REF_PROPS.has(name));
      }
      const style = element.getAttribute("style");
      if (style && style.includes("url(")) {
        // Per declaration, so `fill: url(#g)` is a paint ref while
        // `filter: url(#f)` is not.
        for (const declaration of style.split(";")) {
          const separator = declaration.indexOf(":");
          if (separator < 0) continue;
          const property = declaration.slice(0, separator).trim().toLowerCase();
          collect(declaration.slice(separator + 1), PAINT_REF_PROPS.has(property));
        }
      }
      // A gradient chained onto another gradient, a `<textPath>`, an `<mpath>`:
      // a plain fragment href rather than a funcIRI. `<use>` is pass 2's job
      // and is already counted there.
      if (tagOf(element) === "use") continue;
      const href = element.getAttribute("href") || element.getAttributeNS(XLINK_NS, "href") || "";
      if (href.startsWith("#")) refs.push({ id: href.slice(1), paint: false });
    }
    return refs;
  };

  // Turn one live `<svg>` element into a standalone SVG document.
  const serialize = (svgElement) => {
    const notes = {
      currentColorResolved: 0,
      paintBackfilled: 0,
      useRefsInlined: 0,
      unresolvedUseRefs: 0,
      defsInlined: 0,
      unresolvedRefs: 0,
      unresolvedPaintRefs: 0,
      hiddenSubtreesDropped: 0,
      viewBoxSynthesized: false,
      scriptsStripped: 0,
      eventAttrsStripped: 0,
    };
    const clone = svgElement.cloneNode(true);

    // PASS 1 — lockstep over original and clone. `clone` is a deep copy, so
    // `[root, ...querySelectorAll("*")]` yields the same nodes in the same
    // order on both sides. Only ATTRIBUTES change here; removing or adding a
    // node would desynchronise the two walks, so structural edits are queued
    // and applied straight after.
    const originals = [svgElement, ...svgElement.querySelectorAll("*")];
    const clones = [clone, ...clone.querySelectorAll("*")];
    const length = Math.min(originals.length, clones.length);
    const doomed = [];
    // A `<use>` inherits paint and `color` from where IT sits, and the sprite
    // body it pulls in resolves `currentColor` against that — so the value is
    // captured here, while the original is still reachable, and consumed in
    // pass 2.
    const useContext = new Map();

    for (let index = 0; index < length; index += 1) {
      const original = originals[index];
      const copy = clones[index];
      const tag = tagOf(copy);
      const computed = window.getComputedStyle(original);
      const color = computed.color;

      // (d) Event handlers. `\bon\w+\s*=` is one of the patterns
      // `isPubliclySafeSvgPath` refuses outright, so this strip is what keeps
      // an otherwise-good capture from being suppressed to "".
      for (const attribute of [...copy.attributes]) {
        if (/^on/i.test(attribute.name)) {
          copy.removeAttribute(attribute.name);
          notes.eventAttrsStripped += 1;
        }
      }
      if (tag === "script") {
        doomed.push({ node: copy, kind: "script" });
        continue;
      }

      // (f) A subtree the page does not paint. The dual light/dark logo is the
      // reason: both variants sit in the DOM, one is `display:none`, and
      // serializing both paints the later one over the earlier — so a capture
      // that looked right on the page is invisible on half the email bands it
      // might land on. Definitions are exempt: `<defs>`/`<symbol>` contents are
      // never painted in place BY DESIGN, and dropping them would delete the
      // gradients the drawing needs.
      if (index > 0 && DROPPABLE_WHEN_HIDDEN.has(tag) && !inNonRenderedContainer(original)) {
        if (computed.display === "none" || computed.visibility === "hidden") {
          doomed.push({ node: copy, kind: "hidden" });
          continue;
        }
      }

      // (b) `currentColor` written in the markup.
      for (const name of PAINT_ATTRS) {
        const value = copy.getAttribute(name);
        if (value && value.trim().toLowerCase() === "currentcolor") {
          copy.setAttribute(name, color);
          notes.currentColorResolved += 1;
        }
      }
      const inlineStyle = copy.getAttribute("style");
      if (inlineStyle && /currentcolor/i.test(inlineStyle)) {
        copy.setAttribute("style", inlineStyle.replace(/currentColor/gi, color));
        notes.currentColorResolved += 1;
      }

      // (b, second half) Paint that is not in the markup AT ALL because a page
      // stylesheet supplies it (`.header-logo svg path { fill: #fff }`). The
      // measured incident's logo carried no `currentColor` and still rendered
      // white, so resolving the keyword alone would not have saved it. Only
      // shapes are backfilled, and only away from the SVG defaults — a shape
      // that is genuinely black or genuinely unstroked keeps its markup clean.
      if (SHAPE_TAGS.has(tag)) {
        const hasFill = copy.hasAttribute("fill") || /(^|;)\s*fill\s*:/i.test(copy.getAttribute("style") || "");
        if (!hasFill && computed.fill && computed.fill !== DEFAULT_FILL && computed.fill !== "none") {
          copy.setAttribute("fill", computed.fill);
          notes.paintBackfilled += 1;
        }
        const hasStroke = copy.hasAttribute("stroke") || /(^|;)\s*stroke\s*:/i.test(copy.getAttribute("style") || "");
        if (!hasStroke && computed.stroke && computed.stroke !== "none") {
          copy.setAttribute("stroke", computed.stroke);
          notes.paintBackfilled += 1;
        }
      }

      if (tag === "use") {
        useContext.set(copy, { color, fill: computed.fill });
      }
    }

    for (const { node, kind } of doomed) {
      node.remove();
      if (kind === "script") notes.scriptsStripped += 1;
      else notes.hiddenSubtreesDropped += 1;
    }

    // PASS 2 — (a) inline the sprite bodies, REPEATEDLY. A sprite body can
    // itself contain a `<use>`, and iterating one snapshot never visits what
    // the previous round introduced: that shipped a live `<use href="#inner">`
    // pointing at nothing while reporting zero unresolved refs — a partial logo
    // attested as complete. Re-querying each round fixes both; the pass cap is
    // what terminates a cyclic sprite.
    for (let pass = 0; pass < maxUsePasses; pass += 1) {
      const uses = [...clone.querySelectorAll("use")];
      if (uses.length === 0) break;
      let replaced = 0;
      for (const useElement of uses) {
        const reference =
          useElement.getAttribute("href") ||
          useElement.getAttributeNS(XLINK_NS, "href") ||
          useElement.getAttribute("xlink:href") ||
          "";
        // An external sprite (`/static/sprite.svg#logo`) is not reachable from
        // here, and neither is a fragment this document does not define.
        if (!reference.startsWith("#")) continue;
        const target = document.getElementById(reference.slice(1));
        if (!target) continue;

        const targetTag = tagOf(target);
        let node;
        if (targetTag === "symbol" || targetTag === "svg") {
          // A `<use>` on a `<symbol>` establishes a NESTED VIEWPORT: the use's
          // x/y/width/height are the viewport, the symbol's viewBox is the user
          // space inside it, and the browser derives a scale from the pair.
          // Reproducing that as a nested `<svg>` keeps the scale; lifting the
          // children into a `<g>` silently discards it (measured: 5x blowout).
          node = document.createElementNS(SVG_NS, "svg");
          for (const name of ["viewBox", "preserveAspectRatio"]) {
            const value = target.getAttribute(name);
            if (value) node.setAttribute(name, value);
          }
          for (const name of ["x", "y", "width", "height"]) {
            const value = useElement.getAttribute(name);
            if (value) node.setAttribute(name, value);
          }
          // The `<symbol>` element itself never renders — its children are the
          // drawing.
          for (const child of target.children) node.appendChild(child.cloneNode(true));
        } else {
          // Referencing an ordinary element: x/y are a translation, nothing
          // more.
          node = document.createElementNS(SVG_NS, "g");
          const copy = target.cloneNode(true);
          copy.removeAttribute("id");
          node.appendChild(copy);
          const x = Number(useElement.getAttribute("x") || 0);
          const y = Number(useElement.getAttribute("y") || 0);
          if (x || y) node.setAttribute("transform", `translate(${x} ${y})`);
        }

        // Paint carried from the `<use>`, which is where the sprite body
        // inherits from.
        for (const name of ["fill", "stroke", "opacity", "style"]) {
          const value = useElement.getAttribute(name);
          if (value) node.setAttribute(name, value);
        }
        const context = useContext.get(useElement) || {};
        if (!node.hasAttribute("fill") && context.fill && context.fill !== DEFAULT_FILL && context.fill !== "none") {
          node.setAttribute("fill", context.fill);
          notes.paintBackfilled += 1;
        }
        notes.currentColorResolved += resolveCurrentColorIn(node, context.color);
        // The sprite body never went through pass 1, so it carries whatever the
        // sprite author wrote — including handlers that would suppress the
        // whole capture.
        sanitizeSubtree(node, notes);
        // Anything the body brought with it inherits this `<use>`'s context on
        // the next round.
        for (const nested of node.querySelectorAll("use")) useContext.set(nested, context);

        // The use's own `transform` composes OUTSIDE the nested viewport.
        let replacement = node;
        const transform = useElement.getAttribute("transform");
        if (transform) {
          const group = document.createElementNS(SVG_NS, "g");
          group.setAttribute("transform", transform);
          group.appendChild(node);
          replacement = group;
        }
        useElement.replaceWith(replacement);
        notes.useRefsInlined += 1;
        replaced += 1;
      }
      // Everything left is unresolvable; another round would not change that.
      if (replaced === 0) break;
    }
    // Counted from the RESIDUE rather than incremented in the loop, so a
    // survivor is counted exactly once however many rounds saw it — and so a
    // cycle survivor hitting the pass cap is counted too.
    notes.unresolvedUseRefs = clone.querySelectorAll("use").length;

    // PASS 3 — (e) inline the definitions `url(#id)` points at. A gradient in a
    // hidden sprite `<svg>` is the common shape, and the reference survives
    // serialization looking perfectly healthy while resolving to nothing.
    // Repeated because a gradient chains onto another gradient via `href`.
    const definitions = document.createElementNS(SVG_NS, "defs");
    const inlinedIds = new Set();
    let unresolvedPaintRefs = 0;
    let unresolvedRefs = 0;
    const findInClone = (id) => {
      if (clone.getAttribute("id") === id) return clone;
      for (const element of clone.querySelectorAll("[id]")) {
        if (element.getAttribute("id") === id) return element;
      }
      return null;
    };
    for (let pass = 0; pass < maxDefPasses; pass += 1) {
      let added = 0;
      unresolvedPaintRefs = 0;
      unresolvedRefs = 0;
      for (const { id, paint } of funcIriRefsIn(clone)) {
        if (findInClone(id)) continue;
        const target = document.getElementById(id);
        if (!target) {
          unresolvedRefs += 1;
          if (paint) unresolvedPaintRefs += 1;
          continue;
        }
        if (inlinedIds.has(id)) continue;
        const copy = target.cloneNode(true);
        sanitizeSubtree(copy, notes);
        definitions.appendChild(copy);
        inlinedIds.add(id);
        added += 1;
        notes.defsInlined += 1;
        // Appended eagerly so `findInClone` can see it on the next iteration.
        if (definitions.parentNode !== clone) clone.insertBefore(definitions, clone.firstChild);
      }
      if (added === 0) break;
    }
    // Recount from the FINAL clone, after the last allowed insertion. The
    // previous loop counters described the clone at the START of its last
    // pass: when that pass inserted (for example) g3 whose href points at g4,
    // the cap could stop before g4 was visited and falsely report zero. A
    // reference is resolved only when its target actually travels in the
    // standalone clone; its availability elsewhere in `document` is irrelevant
    // once serialization is finished.
    unresolvedPaintRefs = 0;
    unresolvedRefs = 0;
    for (const { id, paint } of funcIriRefsIn(clone)) {
      if (findInClone(id)) continue;
      unresolvedRefs += 1;
      if (paint) unresolvedPaintRefs += 1;
    }
    notes.unresolvedRefs = unresolvedRefs;
    notes.unresolvedPaintRefs = unresolvedPaintRefs;

    // (c) A `viewBox` the page never needed. `getBBox()` is the drawing's own
    // user-space extent — the right box — with the laid-out rect as fallback
    // for a subtree Chromium refuses to measure.
    if (!clone.hasAttribute("viewBox")) {
      let box = null;
      try {
        const bbox = svgElement.getBBox();
        if (bbox && bbox.width > 0 && bbox.height > 0) box = [bbox.x, bbox.y, bbox.width, bbox.height];
      } catch {
        box = null;
      }
      if (!box) {
        const rect = svgElement.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) box = [0, 0, rect.width, rect.height];
      }
      if (box) {
        clone.setAttribute("viewBox", box.map((value) => Math.round(value * 100) / 100).join(" "));
        notes.viewBoxSynthesized = true;
      }
    }

    // The HTML parser gives an inline `<svg>` the SVG namespace implicitly and
    // `outerHTML` does not write it back, so a standalone file made from it
    // would not parse as SVG at all.
    if (!clone.getAttribute("xmlns")) clone.setAttribute("xmlns", SVG_NS);
    const markup = clone.outerHTML;
    if (/xlink:/i.test(markup) && !clone.getAttribute("xmlns:xlink")) {
      clone.setAttribute("xmlns:xlink", XLINK_NS);
      return { markup: clone.outerHTML, notes };
    }
    return { markup, notes };
  };
    let originalSourceMarkup = "";
    const diagnostics = [];
    try {
      originalSourceMarkup = String(suppliedElement.outerHTML || "");
    } catch (error) {
      diagnostics.push({
        reason: "selected-source-read-error",
        detail: String(error?.message || error).slice(0, 300),
      });
    }

    if (originalSourceMarkup.length > maxChars) {
      diagnostics.push({ reason: "selected-source-over-cap", detail: originalSourceMarkup.length });
      originalSourceMarkup = "";
    }
    if (tagOf(suppliedElement) !== "svg") {
      diagnostics.push({ reason: "selected-not-svg", detail: tagOf(suppliedElement) || "unknown" });
      return {
        status: "suppressed",
        originalSourceMarkup,
        completeSvgMarkup: "",
        notes: null,
        diagnostics,
      };
    }

    let serialized;
    try {
      serialized = serialize(suppliedElement);
    } catch (error) {
      diagnostics.push({
        reason: "selected-serialize-error",
        detail: String(error?.message || error).slice(0, 300),
      });
      return {
        status: "suppressed",
        originalSourceMarkup,
        completeSvgMarkup: "",
        notes: null,
        diagnostics,
      };
    }

    if (serialized.notes.unresolvedUseRefs > 0) {
      diagnostics.push({
        reason: "selected-unresolved-use-ref",
        detail: serialized.notes.unresolvedUseRefs,
      });
    }
    if (serialized.notes.unresolvedRefs > 0) {
      diagnostics.push({
        reason: serialized.notes.unresolvedPaintRefs > 0
          ? "selected-unresolved-paint-ref"
          : "selected-unresolved-ref",
        detail: serialized.notes.unresolvedRefs,
      });
    }
    if (serialized.markup.length > maxChars) {
      diagnostics.push({ reason: "selected-derived-over-cap", detail: serialized.markup.length });
    }

    const suppressed = diagnostics.length > 0;
    return {
      status: suppressed ? "suppressed" : "captured",
      originalSourceMarkup,
      completeSvgMarkup: suppressed ? "" : serialized.markup,
      notes: serialized.notes,
      diagnostics,
    };
}

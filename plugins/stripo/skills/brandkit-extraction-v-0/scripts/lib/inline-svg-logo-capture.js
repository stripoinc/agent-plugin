// Keep the logo markup that never crossed the network.
//
// WHY THIS EXISTS. `lib/logo-asset-capture.js` keeps the SVG logo BYTES the
// browser downloaded while rendering. That covers the `<img src=".../logo.svg">`
// shape — a real asset with a public URL — and it is the ONLY shape anything
// downstream can see: `rankLogoCandidates` keys everything by that URL, and
// `brand.logos` is public-URLs-only.
//
// It cannot cover the other common shape: a logo the site ships as INLINE
// `<svg>` markup in the document. Nothing is ever requested for one, so there
// is no response to retain, no candidate URL to rank, and the run ships a
// brandkit whose only logo is a favicon — which the customization run then
// discovers ~40 minutes later, mid-rebrand. Measured on a live retail
// homepage: the header logo was a `div.header-logo` holding 3.1 KB of
// self-contained inline `<svg>` with 8 shape elements and zero `<use>` refs,
// and the extraction found no logo at all.
//
// THE DOM ALREADY HOLDS THE WHOLE FILE — but `outerHTML` is not yet that file.
// A page renders correctly while leaning on six things that do not travel with
// the markup, and EVERY ONE OF THEM FAILS SILENTLY: the capture still has
// shapes, still passes every screen, and still ships. That is what makes them
// worth this much code.
//
//   (a) `<use href="#id">` — the drawing lives in a sprite `<symbol>` elsewhere
//       in the document. Serialized as-is the file renders EMPTY. And inlining
//       it naively is its own defect: a `<use>` on a `<symbol viewBox>` is a
//       NESTED VIEWPORT (the use's width/height scale the symbol's viewBox), so
//       lifting the children into a plain `<g>` drops that scale — measured, a
//       100x100 symbol drawn at 20x20 serialized 5x too big, overflowing the
//       root viewBox and occluding the wordmark.
//   (b) `currentColor`, and paint that lives in a page stylesheet rather than
//       in the markup — the file falls back to SVG's default black, so a white
//       header logo turns invisible on its own dark band.
//   (c) a missing `viewBox` — the page sized the element with CSS, and a
//       standalone raster of it is cropped to a default 300x150 box.
//   (d) `<script>` / `on*=` handlers — page-coupled junk, and two of the
//       patterns `isPubliclySafeSvgPath` refuses outright, so leaving them in
//       throws the capture away.
//   (e) `url(#id)` paint/effect refs — a gradient, filter, clip-path or mask
//       defined in a hidden sprite `<svg>` elsewhere on the page. The reference
//       serializes verbatim and points at nothing: an invisible or black logo
//       with a perfectly healthy shape count.
//   (f) `display:none` subtrees — a dual light/dark logo ships BOTH variants,
//       and with identical geometry the later-painted one wins. A white variant
//       painted over a dark one is invisible on a light band.
//
// Everything here runs INSIDE the page (`page.evaluate`) because every one of
// those needs the live DOM: node identity for the sprite and def lookups,
// computed style for the paint and the visibility, and layout for the box.
// Nothing here opens a socket — the same egress discipline
// `logo-asset-capture.js`'s header states applies, and holds trivially: the
// markup is already in the document.
//
// WHEN IN DOUBT, DROP THE CAPTURE. An unresolvable PAINT reference is not a
// degraded logo, it is an invisible one, and shipping an invisible logo under a
// headline that says the brand was captured is strictly worse than reporting no
// logo at all. The scan therefore refuses rather than degrades on (e), and the
// node side refuses a shapeless capture from (a).
//
// The output feeds the SAME `logo-assets.json` / `candidates.logos[].svgPath`
// channel the downloaded-asset path uses, so nothing downstream changes shape.
//
// KNOWN LIMITS. Reviewed and accepted — each one either degrades LOUDLY (a
// named `skipped[]` row, or an "unknown" the SKILL treats as the honest
// fallback) or costs a cosmetic detail, never a silently-wrong logo:
//
//   * `<text>`-only wordmarks. `svg-path-extract.js`'s shape regex counts
//     geometry elements only, so a wordmark drawn purely with `<text>` reduces
//     to `shapeCount: 0` and is refused as `inline-no-shapes`. Shared with the
//     downloaded path. Widening that regex changes `pathCount`/`shapeCount`/
//     `shapes` there AND the documented stdout contract of
//     `extract-svg-path.js`, so it is its own change.
//   * EXTERNAL funcIRIs. `URL_REF_RE` matches `url(#id)` only, so
//     `url(sprite.svg#id)` is neither inlined nor counted — it serializes
//     verbatim and resolves to nothing. Rare in practice (Chromium itself only
//     honours it for some properties) and not worth widening the drop rule for.
//   * ID-COLLISION SHADOWING. `findInClone` matches on id alone, so a def the
//     capture already carries suppresses the lookup of a same-id def elsewhere
//     in the document. Whichever one the browser used is the one already in the
//     clone in the common case.
//   * GRADIENT CHAINS deeper than `maxDefPasses`. The tail is left unresolved
//     and counted in `unresolvedRefs`; a chain that deep is cosmetic (a stop
//     colour), never the paint's existence, so it does not trip the drop rule.
//   * `opacity: 0` VARIANTS. The visibility pass drops `display:none` and
//     `visibility:hidden` only, so a variant hidden by opacity alone still
//     serializes — visible in the file, invisible on the page.
//   * `<tspan>` / `<textPath>` are absent from `DROPPABLE_WHEN_HIDDEN`, so a
//     hidden one inside a shown `<text>` survives the visibility pass.
//   * The backdrop walk reads `background-color`. A band painted by a SIBLING
//     `<img>` rather than an ancestor style is invisible to it and is only
//     caught when the mark's own container is positioned (see
//     `backgroundClassFor`); otherwise it reports the ancestor colour.
//
// WHAT `svgPath` IS NOT: an email asset. See the note above the inline block in
// `logo-asset-capture.js` — nothing downstream turns a captured `svgPath` into
// a hosted image, and the run has to say so.

// Where a mark may be found. Two arms, and they answer different questions.
//
// THE NAME ARMS (`[class*='logo']`, `[id*='logo']`, header/banner `brand`)
// say the markup called itself a logo. They are the strong evidence, and the
// score below still credits them +6.
//
// THE LANDMARK ARMS (`header`, `[role='banner']`) say only "this is the
// masthead". They are LOAD-BEARING and they are why this list changed.
// Measured on live storefronts: a masthead mark drawn as an anchor-less inline
// `<svg id="Layer_1">`, painted white by a stylesheet, with every class
// CSS-module-obfuscated, matches NO name arm and has no anchor to match a link
// arm either — so the site emitted no logo at all and fell to a favicon. A
// second measured site (a Tailwind storefront, zero semantic names) puts its
// mark inside an ABSOLUTE self-origin home link, which the old literal
// `a[href='/']` arm never matched.
//
// The two literal `header a[href='/']` / `[role='banner'] a[href='/']` arms
// are GONE, and nothing they admitted is lost: every `<svg>` inside
// `header a[href='/']` is by definition inside `header`, so the new arm
// strictly subsumes the old one. (Pinned by "the landmark arm subsumes the
// literal home-link arm it replaced".)
//
// The cost of the landmark arms is that a header full of cart / burger /
// search icons is now admitted for SCORING rather than excluded by the
// container. Three things pay for it: the score floor still applies, the sweep
// below scores EVERY svg in a container rather than handing the container's
// slot to whatever comes first in document order, and the ranker caps a
// no-text-signal admission out of the copy band.
export const INLINE_LOGO_CONTAINER_SELECTORS = [
  "[class*='logo']",
  "[id*='logo']",
  "header",
  "[role='banner']",
  "header [class*='brand']",
  "[role='banner'] [class*='brand']",
];

// A header logo, its alternate mark, and one slot of slack. Two was the
// original reasoning — "more than that and we are collecting icons" — and it
// is wrong about WHICH rows fill the slots, because the sort below breaks
// equal scores by AREA and a tap-target icon out-areas a small mark.
//
// Measured against live Chromium: a nameless, anchorless 46x46 monogram in a
// `<header>` scores header +2, geometry +3, aspect +2 = 7, and so does every
// nameless 48x48 icon beside it. 2304 > 2116, so a search icon and a cart
// icon take BOTH slots and the mark is not captured at all — not emitted, not
// even a `skipped[]` row. Document order does not save it: the fixture puts
// the monogram first and it still loses.
//
// Three is a bound, not a fix: total loss now needs three icons to out-area
// the mark rather than two. The cost is one extra candidate on some sites,
// which the ranker prices at or below 0.75 whenever nothing named it a logo.
// The real fix is to demote a candidate whose same-container siblings share
// its size — a strip-membership rule like the img lane's — and that needs a
// live sweep to size, because a square monogram flanked by two same-sized
// icons is the shape it would wrongly demote.
export const INLINE_LOGO_MAX_CANDIDATES = 3;
// A container-class hit alone scores 6, so this admits "the markup called
// itself a logo" and rejects a bare geometry match.
export const INLINE_LOGO_MIN_SCORE = 6;
// Character ceiling applied IN THE PAGE, purely so a pathological embedded
// illustration is dropped before it is marshalled across the CDP boundary. The
// byte cap that actually bounds what is retained is `LOGO_ASSET_MAX_BYTES`,
// enforced on the node side in `collectLogoAssets`.
export const INLINE_LOGO_MAX_CHARS = 256 * 1024;
// Bound the container sweep on pathological pages (a marketplace whose every
// tile carries a `[class*='logo']` merchant badge).
export const INLINE_LOGO_MAX_CONTAINERS = 40;
// Bound the per-container svg sweep. Every visible non-sprite `<svg>` in a
// container is now scored rather than the first one that clears the floor, and
// a `<header>` is a container now, so this is what stops an infographic page's
// several-hundred-icon masthead from being walked in full. Generous on purpose:
// a real masthead holds a handful of icons, and the cost of a scored-and-
// rejected icon is one `skipped[]` row, not a wrong capture.
export const INLINE_LOGO_MAX_SVGS_PER_CONTAINER = 60;
// Diagnostics must not become the payload — the same lesson `LOGO_ASSET_MAX_
// SKIPPED` records. A page with 240 logo-classed merchant badges would
// otherwise write 240 `inline-score-below-floor` rows into logo-assets.json.
export const INLINE_LOGO_MAX_SKIPPED = 8;
// Sprite bodies can themselves contain `<use>`, and a malformed sprite can
// contain a CYCLE. Both loops re-query after each round rather than iterating a
// stale snapshot (a snapshot never visits what the previous round introduced,
// which shipped a dangling `<use>` while reporting zero unresolved refs), so
// they need a depth cap instead of a termination proof.
export const INLINE_LOGO_MAX_USE_PASSES = 4;
export const INLINE_LOGO_MAX_DEF_PASSES = 4;

// Collect serialized inline `<svg>` logo candidates from the rendered page.
//
// TOTAL, like every other probe in this pass: a page that throws (a detached
// frame, a CSP that broke `getComputedStyle`, a `getBBox` on a display:none
// subtree) degrades to an empty result with a `skipped[]` row, never an
// exception. `homepage-pass.js` already treats the whole logo phase as
// optional, and this must not be the thing that flips it.
export async function collectInlineSvgLogos(page, {
  containerSelectors = INLINE_LOGO_CONTAINER_SELECTORS,
  maxCandidates = INLINE_LOGO_MAX_CANDIDATES,
  minScore = INLINE_LOGO_MIN_SCORE,
  maxChars = INLINE_LOGO_MAX_CHARS,
  maxContainers = INLINE_LOGO_MAX_CONTAINERS,
  maxSvgsPerContainer = INLINE_LOGO_MAX_SVGS_PER_CONTAINER,
  maxSkipped = INLINE_LOGO_MAX_SKIPPED,
  maxUsePasses = INLINE_LOGO_MAX_USE_PASSES,
  maxDefPasses = INLINE_LOGO_MAX_DEF_PASSES,
} = {}) {
  if (!page || typeof page.evaluate !== "function") {
    return { logos: [], skipped: [] };
  }
  try {
    const result = await page.evaluate(inlineSvgLogoScan, {
      containerSelectors,
      maxCandidates,
      minScore,
      maxChars,
      maxContainers,
      maxSvgsPerContainer,
      maxSkipped,
      maxUsePasses,
      maxDefPasses,
    });
    return {
      logos: Array.isArray(result?.logos) ? result.logos : [],
      skipped: Array.isArray(result?.skipped) ? result.skipped : [],
    };
  } catch (error) {
    return {
      logos: [],
      skipped: [{
        reason: "inline-scan-error",
        detail: (error instanceof Error ? error.message : String(error)).slice(0, 300),
      }],
    };
  }
}

// The in-page half. SELF-CONTAINED BY CONTRACT: Playwright ships this function
// as source text, so it may not close over anything in this module — every
// helper and constant it needs is defined inside it or arrives in `options`.
// Exported only so the integration test can drive it directly.
export function inlineSvgLogoScan(options) {
  const {
    containerSelectors = [],
    // Mirrors `INLINE_LOGO_MAX_CANDIDATES`, spelled as a literal because this
    // function may not close over the module (see the contract above). It was
    // left at 2 when that constant went to 3, so a caller that omitted the
    // option -- which is only ever a test driving this half directly; the real
    // caller always passes it -- silently ran one slot short of production.
    maxCandidates = 3,
    minScore = 6,
    maxChars = 262144,
    maxContainers = 40,
    maxSvgsPerContainer = 60,
    maxSkipped = 8,
    maxUsePasses = 4,
    maxDefPasses = 4,
  } = options || {};

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
  // Tokens that mark a mark as somebody ELSE'S. `.payment-logos svg` and
  // `.partner-logos svg` both match the `[class*='logo']` container, score like
  // a header logo on geometry, and are not this brand.
  //
  // The CMP half is measured, not imagined. A live storefront carries a consent
  // vendor's "powered by" wordmark, 87x26, inside a FIXED consent dialog whose
  // wrapper id ends `HeaderLogosWrapper` — a real vendor mark, linking the
  // vendor's own site, sitting where a masthead mark sits. It escapes the
  // `[class*='logo']` / `[id*='logo']` name arm today only because CSS
  // attribute matching is case-SENSITIVE on values (`Logos` never matches
  // `logo`), which is an accident, not a gate. Naming the vendors is the gate.
  const FOREIGN_MARK_RE = /(payment|partner|client|sponsor|badge|award|certificat|affiliat|store-badge|app-badge|cookiebot|onetrust|usercentric|didomi|cookie[-_ ]?consent)/i;
  // SVG's own initial `fill`. Backfilling it would add noise without changing
  // a single rendered pixel, so it is the one computed value left implicit.
  const DEFAULT_FILL = "rgb(0, 0, 0)";
  const URL_REF_RE = /url\(\s*['"]?#([^)'"\s]+)['"]?\s*\)/g;

  const skipped = [];
  const logos = [];
  let skippedOverflow = 0;
  const skip = (reason, detail) => {
    if (skipped.length >= maxSkipped) {
      skippedOverflow += 1;
      return;
    }
    skipped.push({ reason, detail });
  };

  const tagOf = (element) => String(element?.tagName || "").toLowerCase();

  // True when the element renders nothing of its own — the honest definition of
  // "this is a sprite sheet, not a mark". Unknown (a `getBBox` Chromium
  // refuses) is NOT nothing: fail open, and let the score and the serializer
  // decide.
  const paintsNothing = (element) => {
    try {
      const bbox = element.getBBox();
      return Boolean(bbox) && bbox.width <= 0 && bbox.height <= 0;
    } catch {
      return false;
    }
  };

  const isVisible = (element) => {
    const rect = element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return false;
    const style = window.getComputedStyle(element);
    if (style.visibility === "hidden" || style.display === "none") return false;
    return Number(style.opacity || "1") > 0.05;
  };

  // A short, stable description of where the mark sits. Technical evidence
  // only — it never reaches a public field.
  const signatureFor = (element) => {
    const parts = [];
    let node = element;
    for (let depth = 0; node && depth < 4; depth += 1) {
      const classes = String(node.getAttribute?.("class") || node.className?.baseVal || "")
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((name) => `.${name}`)
        .join("");
      const id = node.getAttribute?.("id");
      parts.unshift(`${tagOf(node)}${id ? `#${id}` : ""}${classes}`);
      node = node.parentElement;
    }
    return parts.join(" > ").slice(0, 200);
  };

  // --- The backdrop the mark was legible against -----------------------
  //
  // THIS SCAN IS THE ONLY CODE THAT CAN SEE IT. `brand.logos[].background`
  // tells the downstream email flow which band a mark is safe on, and every
  // other producer hardcodes "unknown" because it is reading a saved artifact.
  // Here the live page is right there. It also closes a hazard the paint
  // backfill above OPENS: resolving a white stylesheet fill is correct and
  // necessary, and it turns a mark that was only ever legible on a dark header
  // into one that is invisible on a light email band unless something records
  // which it was.
  const parseRgb = (value) => {
    const match = String(value || "").match(/rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:[\s,/]+([\d.]+))?/i);
    if (!match) return null;
    const alpha = match[4] === undefined ? 1 : Number(match[4]);
    return { r: Number(match[1]), g: Number(match[2]), b: Number(match[3]), a: Number.isFinite(alpha) ? alpha : 1 };
  };
  const relativeLuminance = ({ r, g, b }) => {
    const channel = (raw) => {
      const value = raw / 255;
      return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  };
  // "unknown" IS AN ANSWER, and often the only honest one. The SKILL teaches
  // the agent to keep a measured value as evidence, which makes a WRONG
  // measurement worse than none: the walk reads `background-color` only, so any
  // paint it cannot read has to stop it rather than be walked past.
  const backgroundClassFor = (element) => {
    let node = element;
    while (node) {
      const style = window.getComputedStyle(node);
      const parsed = parseRgb(style.backgroundColor);
      // An (effectively) opaque layer decides the question — unless an image is
      // painted ON TOP of it, which this walk cannot sample.
      if (parsed && parsed.a >= 0.9) {
        if (style.backgroundImage && style.backgroundImage !== "none") return "unknown";
        // The standard flip point: below it the surface contrasts better with
        // white than with black, i.e. it is a dark band.
        return relativeLuminance(parsed) >= 0.1791 ? "light" : "dark";
      }
      // Transparent here, so the answer is further up — but two things make
      // "further up" the wrong place to look:
      //   * a background IMAGE (a hero photo, a gradient) is the real backdrop
      //     and its lightness is not readable from a computed style;
      //   * a fixed / absolutely positioned band is lifted out of flow, so its
      //     DOM ancestors are NOT what sits visually behind it — the classic
      //     transparent header over a dark hero, whose `body` is light.
      // Both used to classify such a mark "light" while it visibly sat on dark.
      if (style.backgroundImage && style.backgroundImage !== "none") return "unknown";
      if (style.position === "fixed" || style.position === "absolute") return "unknown";
      node = node.parentElement;
    }
    return "unknown";
  };

  // Mirrors `scoreLogoImageCandidate`'s shape in assemble-candidates.js: a
  // couple of naming signals, then geometry as corroboration.
  const scoreFor = (svgElement, signature, rect, placement) => {
    const width = Math.round(rect.width);
    const height = Math.round(rect.height);
    const aspect = height > 0 ? width / height : 0;
    let score = 0;
    if (/logo/i.test(signature)) score += 6;
    if (placement.homeLink) score += 4;
    if (placement.header) score += 2;
    if (width >= 40 && width <= 400 && height >= 12 && height <= 150) score += 3;
    if (aspect >= 0.8 && aspect <= 8) score += 2;
    if (width > 800) score -= 3;
    if (height < 8) score -= 4;
    // A payment / partner / certification strip is a wall of marks that all
    // score like header logos on geometry and belong to other companies.
    if (FOREIGN_MARK_RE.test(signature)) score -= 6;
    return score;
  };

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

  function inNonRenderedContainer(element) {
    let node = element.parentElement;
    while (node) {
      if (NON_RENDERED.has(tagOf(node))) return true;
      node = node.parentElement;
    }
    return false;
  }

  // --- Candidate sweep --------------------------------------------------

  // THE RESOLVED HOME LINK — a LITERAL COPY of the `homeLink` rule in lib.js's
  // `collectPageSignals`, repeated rather than imported because this body runs
  // inside `page.evaluate`, a scope boundary no import crosses. The same idiom
  // that file's keep rule uses, and pinned the same way: a parity test drives
  // both probes over one fixture and asserts they answer identically, per
  // anchor shape.
  //
  // What it replaces: `closest("a[href='/']")`, a LITERAL attribute match that
  // recognised exactly one spelling of "home". Measured on a live Tailwind
  // storefront whose mark sits inside `<a href="https://www.example.com/">` —
  // an absolute self-origin home link, and the literal arm reads it as false.
  //
  // The RAW href is rejected first, BEFORE resolving, because resolving
  // against the current document turns "#" into pathname "/" and would let a
  // dead-linked badge read as a home link.
  //
  // BUT NOTE WHAT THIS DOES NOT FIX. The measured masthead mark that motivated
  // this whole change has NO ANCHOR AT ALL — no arm of this predicate can
  // reach it. The LANDMARK CONTAINER ARM is the load-bearing one; this is the
  // second archetype, not the first.
  const HOME_PATH_PATTERN = /^\/(?:[a-z]{2}(?:[-_][a-z]{2,4})?)?\/?$/;
  const isResolvedHomeLink = (element) => {
    const anchor = element.closest("a[href]");
    const rawHref = anchor ? String(anchor.getAttribute("href") || "").trim() : "";
    if (!rawHref || /^(#|javascript:|mailto:|tel:)/i.test(rawHref)) return false;
    let anchorLocation;
    try {
      anchorLocation = new URL(rawHref, window.location.href);
    } catch {
      return false;
    }
    return anchorLocation.origin === window.location.origin
      && HOME_PATH_PATTERN.test(anchorLocation.pathname);
  };

  const seen = new Set();
  const candidates = [];
  for (const selector of containerSelectors) {
    let containers;
    try {
      containers = document.querySelectorAll(selector);
    } catch {
      continue;
    }
    let examined = 0;
    for (const container of containers) {
      if (examined >= maxContainers) break;
      examined += 1;

      // EVERY `<svg>` in the container, not just the first, AND EVERY ONE OF
      // THEM IS SCORED. Two distinct defects live here, and only one of them
      // used to be fixed.
      //
      // The first: a hidden sprite / `<defs>` svg dumped at the top of a header
      // is extremely common, and `querySelector("svg")` handed it the slot,
      // failed the visibility check, and moved on — a SILENT zero-capture with
      // no `skipped[]` row to show it happened. That is why the loop exists.
      //
      // The second, which the `break` below used to cause: the loop stopped at
      // the FIRST svg that cleared the floor, so the container's single slot
      // went to whatever came first in DOCUMENT ORDER. Measured on a live
      // storefront, a 40x40 burger button won the header that way; the one site
      // where the mark was captured worked only because its mark happened to be
      // first. Document order is not evidence. Score them all and let the sort
      // below decide.
      const svgs = tagOf(container) === "svg" ? [container] : [...container.querySelectorAll("svg")];
      let examinedSvgs = 0;
      for (const element of svgs) {
        // Bounds the sweep on a pathological container — an infographic page
        // whose `<header>` holds hundreds of inline icons. Independent of
        // `maxContainers`, which bounds how many containers are opened, not how
        // deep any one of them goes.
        if (examinedSvgs >= maxSvgsPerContainer) break;
        if (seen.has(element)) continue;
        seen.add(element);
        examinedSvgs += 1;
        if (!isVisible(element)) {
          skip("inline-svg-not-visible", signatureFor(element));
          continue;
        }
        // A sprite sheet is a definition CARRIER: it paints nothing of its own.
        // The test has to be that — what the element renders — and not "does it
        // contain a `<symbol>`", because plenty of perfectly good logos are
        // exported as an internal `<symbol>` plus a `<use>` that draws it, and
        // rejecting those loses a real mark. `getBBox()` measures the rendered
        // content: zero for a carrier, non-zero the moment anything draws.
        if (paintsNothing(element)) {
          skip("inline-svg-is-sprite", signatureFor(element));
          continue;
        }

        const signature = signatureFor(element);
        const rect = element.getBoundingClientRect();
        const placement = {
          homeLink: isResolvedHomeLink(element),
          header: Boolean(element.closest("header, [role='banner']")),
        };
        const score = scoreFor(element, signature, rect, placement);
        if (score < minScore) {
          skip("inline-score-below-floor", score);
          continue;
        }
        // The container's own `aria-label` / `title` describes THE MARK only
        // when the container was selected for being logo-named. A landmark arm
        // container is a `<header>`, whose label describes the header ("Site
        // header", "Main"), so borrowing it would file a landmark's name as the
        // logo's — visible in `brand.logos[].evidence` and in the ranker's
        // `alt=`. The svg's own label is always about the mark and is always
        // taken.
        const containerIsLandmark = tagOf(container) === "header"
          || container.getAttribute("role") === "banner";
        const label = String(
          element.getAttribute("aria-label") ||
            (containerIsLandmark
              ? ""
              : container.getAttribute("aria-label") || container.getAttribute("title")) ||
            "",
        ).slice(0, 120);
        candidates.push({
          svgElement: element,
          signature,
          score,
          // Corroboration that this is THIS brand's mark and not a mark in a
          // strip of them. A high geometry score alone must not buy the
          // confidence band that says "copy it with one check".
          placement: placement.header || placement.homeLink,
          // THE WORDS, as opposed to the place. The name arms are what let an
          // admission price above 0.75 downstream; a landmark-only admission
          // has geometry and a place and NOTHING that says whose mark it is.
          // Withheld on foreign vocabulary for the same reason the img lane
          // withholds its text credits: those words have been read and they
          // say "someone else's mark", which is not weaker evidence for this
          // brand, it is evidence against.
          textSignal: !FOREIGN_MARK_RE.test(`${signature} ${label}`)
            && /logo/i.test(`${signature} ${label}`),
          background: backgroundClassFor(element),
          label,
          widthPx: Math.round(rect.width),
          heightPx: Math.round(rect.height),
          areaPx: Math.round(rect.width) * Math.round(rect.height),
        });
      }
    }
  }

  // AREA IS THE TIE-BREAK, because at equal score the bigger mark is the mark.
  // Measured: a 40x40 header icon and a 179x38 masthead wordmark both score 7
  // (landmark + geometry + aspect), and without this the winner is decided by
  // document order — which put the icon first on a live storefront. A stable
  // sort (spec-required since ES2019) still supplies document order as the
  // final key, so equal-score equal-area candidates come out as they always did.
  candidates.sort((left, right) => (right.score - left.score) || (right.areaPx - left.areaPx));
  // SERIALIZE UNTIL EMITTED, not "serialize the top `maxCandidates`". A refused
  // candidate — an unresolvable paint ref, markup over the cap, a serializer
  // throw — used to CONSUME one of the `maxCandidates` output slots and leave
  // the real mark behind it uncaptured. Refusal is not emission; only emission
  // fills a slot.
  // The loop is bounded by the candidate list, and the `logos.length` test is
  // what stops it early.
  // A page that renders the SAME mark twice (a static masthead plus a sticky
  // header clone) used to emit two byte-identical entries, burning 2 of the 3
  // candidate slots and writing duplicate sidecars. The key is the FULL
  // serialized markup, which IS the sidecar byte content — two instances whose
  // root attributes differ are still both emitted.
  const seenMarkup = new Set();
  for (const candidate of candidates) {
    if (logos.length >= maxCandidates) break;
    let serialized;
    try {
      serialized = serialize(candidate.svgElement);
    } catch (error) {
      skip("inline-serialize-error", String(error?.message || error).slice(0, 300));
      continue;
    }
    // Before the refusals below, because a duplicate is not a refusal of the
    // mark — the first instance already carries it — and it must not consume a
    // `maxCandidates` slot. Candidates are sorted by score then area, so the
    // survivor is the best-scored instance, not the first in document order.
    if (seenMarkup.has(serialized.markup)) {
      skip("inline-duplicate-markup", candidate.signature);
      continue;
    }
    seenMarkup.add(serialized.markup);
    // REFUSE, do not degrade. A shape whose fill points at a gradient that is
    // not in the file draws nothing, and it does so with a healthy shapeCount —
    // so nothing downstream can catch it. An invisible logo shipped under a
    // headline saying the brand was captured is worse than no logo at all.
    if (serialized.notes.unresolvedPaintRefs > 0) {
      skip("inline-unresolved-paint-ref", serialized.notes.unresolvedPaintRefs);
      continue;
    }
    if (serialized.markup.length > maxChars) {
      skip("inline-markup-over-cap", serialized.markup.length);
      continue;
    }
    logos.push({
      markup: serialized.markup,
      selector: candidate.signature,
      label: candidate.label,
      background: candidate.background,
      placement: candidate.placement,
      // Whether anything in the markup NAMED this a logo. Carried all the way
      // to `rankLogoCandidates`, which caps a candidate without it out of the
      // ">=0.85, copy it with one check" band.
      textSignal: candidate.textSignal,
      widthPx: candidate.widthPx,
      heightPx: candidate.heightPx,
      score: candidate.score,
      notes: serialized.notes,
    });
  }

  if (skippedOverflow > 0) skipped.push({ reason: "inline-skipped-truncated", detail: skippedOverflow });
  return { logos, skipped };
}

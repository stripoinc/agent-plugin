import { pathToFileURL } from "node:url";

// Self-contained browser function: serialize into native browser_evaluate.
// Arrays retain the original selector inspection contract. {mode:"capture"}
// performs the neutral whole-page walk used by capture-page.js. Keeping both
// paths here gives targeted and page capture one physical measurement policy.
export function inspectElements(request, nativeTarget = null) {
  const compact = (text) => String(text || "").replace(/\s+/gu, " ").trim();
  const finite = (value) => Number.isFinite(value) ? value : null;
  const box = (rect) => ({
    x: finite(rect?.x), y: finite(rect?.y),
    width: finite(rect?.width), height: finite(rect?.height),
  });
  const rendered = (element) => {
    try {
      return element.checkVisibility({
        checkOpacity: true, checkVisibilityCSS: true, contentVisibilityAuto: true,
      });
    } catch {
      const css = getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return css.display !== "none" && css.visibility !== "hidden" && css.opacity !== "0"
        && rect.width > 0 && rect.height > 0;
    }
  };
  const px = (value) => /^-?\d+(?:\.\d+)?px$/u.test(value) ? Number.parseFloat(value) : null;
  const radius = (value) => {
    const [horizontal = "", vertical = horizontal] = value.trim().split(/\s+/u);
    return { raw: value, horizontalPx: px(horizontal), verticalPx: px(vertical) };
  };
  const properties = [
    "color", "backgroundColor", "backgroundImage", "fontFamily", "fontSize", "fontWeight",
    "fontStyle", "lineHeight", "letterSpacing", "textTransform", "textAlign",
    "textDecorationLine", "borderTopWidth", "borderRightWidth", "borderBottomWidth",
    "borderLeftWidth", "borderTopStyle", "borderRightStyle", "borderBottomStyle",
    "borderLeftStyle", "borderTopColor", "borderRightColor", "borderBottomColor",
    "borderLeftColor", "borderTopLeftRadius", "borderTopRightRadius",
    "borderBottomLeftRadius", "borderBottomRightRadius", "paddingTop", "paddingRight",
    "paddingBottom", "paddingLeft", "marginTop", "marginRight", "marginBottom", "marginLeft",
    "display", "width", "height", "minWidth", "maxWidth", "boxSizing", "alignSelf",
    "justifyContent", "boxShadow", "opacity", "visibility", "contentVisibility", "position",
    "overflowX", "overflowY", "fill", "stroke", "strokeWidth",
  ];
  const measurementCache = new WeakMap();
  const measure = (element, full = true, directHrefOnly = false) => {
    const cached = measurementCache.get(element);
    if (cached) return full ? cached : cached.compact;
    const css = getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const compactMeasurement = {
      tag: element.localName, id: element.id || null, classList: [...element.classList],
      box: box(rect),
      href: directHrefOnly
        ? (element.localName === "a" && element.hasAttribute("href") ? element.href : null)
        : element.closest("a[href]")?.href || null,
      color: css.color || null,
      fontFamily: css.fontFamily || null,
      fontWeight: css.fontWeight || null,
      fontWeightNumber: /^\d+(?:\.\d+)?$/u.test(css.fontWeight) ? Number.parseFloat(css.fontWeight) : null,
      fontStyle: css.fontStyle || null,
      fontSizePx: px(css.fontSize), lineHeightPx: px(css.lineHeight),
      letterSpacingPx: px(css.letterSpacing),
      textTransform: css.textTransform || null,
      textAlign: css.textAlign || null,
      textDecorationLine: css.textDecorationLine || null,
    };
    if (!full) return compactMeasurement;
    const parentRect = element.parentElement?.getBoundingClientRect();
    const width = finite(rect.width);
    const parentWidth = finite(parentRect?.width);
    const side = (name) => ({
      width: css[`border${name}Width`],
      widthPx: px(css[`border${name}Width`]),
      style: css[`border${name}Style`] || null,
      color: css[`border${name}Color`] || null,
    });
    const result = {
      ...compactMeasurement,
      styles: Object.fromEntries(properties.map((property) => [property, css[property]])),
      backgroundColor: css.backgroundColor || null,
      backgroundImage: css.backgroundImage || null,
      boxShadow: css.boxShadow || null,
      paddingPx: {
        top: px(css.paddingTop), right: px(css.paddingRight),
        bottom: px(css.paddingBottom), left: px(css.paddingLeft),
      },
      borders: {
        top: side("Top"), right: side("Right"),
        bottom: side("Bottom"), left: side("Left"),
      },
      borderRadii: {
        topLeft: radius(css.borderTopLeftRadius),
        topRight: radius(css.borderTopRightRadius),
        bottomRight: radius(css.borderBottomRightRadius),
        bottomLeft: radius(css.borderBottomLeftRadius),
      },
      layout: {
        computedWidthPx: width,
        computedHeightPx: finite(rect.height),
        parentWidthPx: parentWidth,
        widthRatioToParent: width !== null && parentWidth !== null && parentWidth > 0
          ? width / parentWidth : null,
        display: css.display || null,
        cssWidth: css.width || null,
        cssHeight: css.height || null,
        cssMinWidth: css.minWidth || null,
        cssMaxWidth: css.maxWidth || null,
        boxSizing: css.boxSizing || null,
        alignSelf: css.alignSelf || null,
        justifyContent: css.justifyContent || null,
        marginTopPx: px(css.marginTop),
        marginRightPx: px(css.marginRight),
        marginBottomPx: px(css.marginBottom),
        marginLeftPx: px(css.marginLeft),
      },
    };
    Object.defineProperty(result, "compact", { value: compactMeasurement, enumerable: false });
    measurementCache.set(element, result);
    return result;
  };
  const collectTextOwners = (root) => {
    const owners = new Map();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      const owner = node.parentElement;
      if (!compact(node.textContent) || owner.closest("script,style,noscript,template") || !rendered(owner)) continue;
      const range = document.createRange();
      range.selectNodeContents(node);
      if (![...range.getClientRects()].some((rect) => rect.width > 0 && rect.height > 0)) continue;
      if (!owners.has(owner)) owners.set(owner, []);
      owners.get(owner).push(node.textContent);
    }
    for (const input of [root, ...root.querySelectorAll("input,textarea")]) {
      const textInput = input.localName === "input"
        && ["text", "search", "tel", "url", "email", "number", "button", "submit", "reset"].includes(input.type);
      if (!(textInput || input.localName === "textarea") || !rendered(input)) continue;
      owners.delete(input);
      if (input.value) owners.set(input, [input.value]);
    }
    return [...owners].map(([owner, fragments]) => ({
      ...measure(owner, false), text: compact(fragments.join("")), isSelectedRoot: owner === root,
    }));
  };
  // Target-only geometry diagnostics, not a visual confidence or action classifier.
  const visualGeometry = (root) => {
    const rect = root.getBoundingClientRect();
    const intersection = {left: Math.max(0, rect.left), top: Math.max(0, rect.top),
      right: Math.min(innerWidth, rect.right), bottom: Math.min(innerHeight, rect.bottom)};
    const clippingAncestors = [];
    for (let parent = root.parentElement; parent; parent = parent.parentElement) {
      const css = getComputedStyle(parent);
      const clipsX = /^(hidden|clip|auto|scroll)$/.test(css.overflowX);
      const clipsY = /^(hidden|clip|auto|scroll)$/.test(css.overflowY);
      if (!clipsX && !clipsY) continue;
      const r = parent.getBoundingClientRect();
      const bounds = {left: r.left + parent.clientLeft, top: r.top + parent.clientTop,
        right: r.left + parent.clientLeft + parent.clientWidth,
        bottom: r.top + parent.clientTop + parent.clientHeight};
      if (clipsX) { intersection.left = Math.max(intersection.left, bounds.left); intersection.right = Math.min(intersection.right, bounds.right); }
      if (clipsY) { intersection.top = Math.max(intersection.top, bounds.top); intersection.bottom = Math.min(intersection.bottom, bounds.bottom); }
      clippingAncestors.push({tag: parent.localName, id: parent.id || null, overflowX: css.overflowX, overflowY: css.overflowY, bounds});
    }
    const width = Math.max(0, intersection.right - intersection.left);
    const height = Math.max(0, intersection.bottom - intersection.top);
    const x = (intersection.left + intersection.right) / 2;
    const y = (intersection.top + intersection.bottom) / 2;
    const hit = width > 0 && height > 0 ? document.elementFromPoint(x, y) : null;
    return {intersection: {x: intersection.left, y: intersection.top, width, height}, clippingAncestors,
      centerHit: hit ? {tag: hit.localName, id: hit.id || null, targetOrDescendant: hit === root || root.contains(hit)} : null,
      scope: 'Approximate axis-aligned viewport/overflow clipping and one pointer hit-test; transforms, masks, pointer-events and image content require visual inspection. Positive area or a hit does not certify painted visibility.'};
  };
  const inspectRoot = (root, selector = null) => ({
    selector, status: "matched", matchCount: 1,
    root: { ...measure(root), rendered: rendered(root), accessibleName: root.getAttribute("aria-label"), visualGeometry: visualGeometry(root) },
    textOwners: collectTextOwners(root),
  });

  if (nativeTarget) {
    return { url: location.href, capturedAt: new Date().toISOString(), selections: [inspectRoot(nativeTarget)] };
  }
  if (Array.isArray(request)) {
    return {
      url: location.href, capturedAt: new Date().toISOString(),
      selections: request.map((selector) => {
        let matches;
        try { matches = document.querySelectorAll(selector); }
        catch { return { selector, status: "invalid-selector" }; }
        if (matches.length !== 1) return {
          selector, status: matches.length ? "ambiguous" : "missing", matchCount: matches.length,
        };
        return inspectRoot(matches[0], selector);
      }),
    };
  }

  if (!request || request.mode !== "capture") throw new Error("Unsupported inspection request.");
  const startedAt = new Date().toISOString();
  const positiveLimit = (value, fallback) => Number.isSafeInteger(value) && value > 0 ? value : fallback;
  const limits = {
    maxElements: positiveLimit(request.limits?.maxElements, 20000),
    maxTextOwners: positiveLimit(request.limits?.maxTextOwners, 20000),
    maxLinks: positiveLimit(request.limits?.maxLinks, 10000),
    maxImages: positiveLimit(request.limits?.maxImages, 10000),
    maxLandmarks: positiveLimit(request.limits?.maxLandmarks, 128),
  };
  const excluded = new Set(["script", "style", "noscript", "template", "meta", "link"]);
  const landmarkTags = new Set(["header", "nav", "main", "aside", "footer", "form"]);
  const landmarkRoles = new Set(["banner", "navigation", "main", "complementary", "contentinfo", "form", "search"]);
  const isLandmark = (element) => landmarkTags.has(element.localName)
    || landmarkRoles.has((element.getAttribute("role") || "").toLowerCase());
  const styleIds = new Map();
  const styles = [];
  const elements = [];
  const textOwners = [];
  const links = [];
  const images = [];
  const landmarks = [];
  const elementIds = new WeakMap();
  const groupByElement = new WeakMap();
  const groupStats = new Map([["document", {
    landmarkId: "document", tag: "document", role: null, parentLandmarkId: null,
    elementCount: 0, omittedElementCount: 0, textOwnerCount: 0, omittedTextOwnerCount: 0,
    linkCount: 0, omittedLinkCount: 0, imageCount: 0, omittedImageCount: 0,
  }]]);
  const counts = {
    visitedElements: 0, capturedElements: 0, omittedElements: 0,
    observedLandmarks: 0, capturedLandmarks: 0, omittedLandmarks: 0,
    observedTextOwners: 0, capturedTextOwners: 0, omittedTextOwners: 0,
    observedLinks: 0, capturedLinks: 0, omittedLinks: 0,
    observedImages: 0, capturedImages: 0, omittedImages: 0,
  };
  const styleFor = (measurement) => {
    const record = {
      ...measurement.styles,
      parsed: {
        fontSizePx: measurement.fontSizePx, fontWeightNumber: measurement.fontWeightNumber,
        lineHeightPx: measurement.lineHeightPx, letterSpacingPx: measurement.letterSpacingPx,
        paddingPx: measurement.paddingPx, borders: measurement.borders,
        borderRadii: measurement.borderRadii,
      },
    };
    const key = JSON.stringify(record);
    if (styleIds.has(key)) return styleIds.get(key);
    const styleId = `s${styles.length + 1}`;
    styleIds.set(key, styleId);
    styles.push({ styleId, ...record });
    return styleId;
  };
  const body = document.body || document.documentElement;
  const root = document.documentElement || body;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
    acceptNode: (node) => excluded.has(node.localName) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT,
  });
  let element = root;
  let domOrder = 0;
  while (element) {
    counts.visitedElements += 1;
    domOrder += 1;
    const parentGroupId = groupByElement.get(element.parentElement) || "document";
    const actualLandmark = isLandmark(element);
    let groupId = parentGroupId;
    let capturedLandmark = false;
    if (actualLandmark) {
      counts.observedLandmarks += 1;
      if (landmarks.length < limits.maxLandmarks) {
        groupId = `l${landmarks.length + 1}`;
        capturedLandmark = true;
        const item = {
          landmarkId: groupId, tag: element.localName,
          role: element.getAttribute("role") || null,
          elementId: null, parentLandmarkId: parentGroupId === "document" ? null : parentGroupId,
          domOrder, id: element.id || null, classList: [...element.classList],
        };
        landmarks.push(item);
        groupStats.set(groupId, {
          ...item, elementCount: 0, omittedElementCount: 0,
          textOwnerCount: 0, omittedTextOwnerCount: 0,
          linkCount: 0, omittedLinkCount: 0, imageCount: 0, omittedImageCount: 0,
        });
        counts.capturedLandmarks += 1;
      } else {
        counts.omittedLandmarks += 1;
      }
    }
    groupByElement.set(element, groupId);
    const group = groupStats.get(groupId) || groupStats.get("document");
    group.elementCount += 1;
    const captureElement = elements.length < limits.maxElements || capturedLandmark;
    let captureId = null;
    if (captureElement) {
      captureId = `n${elements.length + 1}`;
      elementIds.set(element, captureId);
      // The capture traversal already owns parent/link relationships. Avoid a
      // closest() ancestry walk per row on pathologically deep documents.
      const measurement = measure(element, true, true);
      const row = {
        captureId, parentId: elementIds.get(element.parentElement) || null, domOrder, groupId,
        landmarkId: capturedLandmark ? groupId : null,
        tag: element.localName, id: element.id || null, classList: [...element.classList],
        childElementCount: element.childElementCount, box: measurement.box,
        rendered: rendered(element), styleId: styleFor(measurement),
        attributes: {
          role: element.getAttribute("role"), ariaLabel: element.getAttribute("aria-label"),
          ariaLabelledBy: element.getAttribute("aria-labelledby"), title: element.getAttribute("title"),
          alt: element.getAttribute("alt"), type: element.getAttribute("type"),
        },
      };
      if (element.namespaceURI === "http://www.w3.org/2000/svg") {
        row.svgPaint = {
          fillAttribute: element.getAttribute("fill"), strokeAttribute: element.getAttribute("stroke"),
          computedFill: measurement.styles.fill || null, computedStroke: measurement.styles.stroke || null,
          computedStrokeWidth: measurement.styles.strokeWidth || null,
        };
      }
      elements.push(row);
      counts.capturedElements += 1;
      if (capturedLandmark) {
        landmarks[landmarks.length - 1].elementId = captureId;
        groupStats.get(groupId).elementId = captureId;
      }
    } else {
      counts.omittedElements += 1;
      group.omittedElementCount += 1;
    }
    if (element.localName === "a" && element.hasAttribute("href")) {
      counts.observedLinks += 1;
      group.linkCount += 1;
      if (links.length < limits.maxLinks) {
        links.push({
          ownerId: captureId, groupId, domOrder, href: element.href,
          visibleText: compact(element.innerText), ariaLabel: element.getAttribute("aria-label"),
          title: element.getAttribute("title"), rendered: rendered(element),
        });
        counts.capturedLinks += 1;
      } else {
        counts.omittedLinks += 1;
        group.omittedLinkCount += 1;
      }
    }
    if (element.localName === "img") {
      counts.observedImages += 1;
      group.imageCount += 1;
      if (images.length < limits.maxImages) {
        images.push({
          ownerId: captureId, groupId, domOrder, src: element.getAttribute("src"),
          currentSrc: element.currentSrc || null, alt: element.getAttribute("alt"),
          ariaLabel: element.getAttribute("aria-label"), title: element.getAttribute("title"),
          complete: element.complete, naturalWidth: finite(element.naturalWidth),
          naturalHeight: finite(element.naturalHeight), rendered: rendered(element),
        });
        counts.capturedImages += 1;
      } else {
        counts.omittedImages += 1;
        group.omittedImageCount += 1;
      }
    }
    element = walker.nextNode();
  }

  const ownerFragments = new Map();
  const ownerPainted = new Map();
  const ownerSeen = new WeakSet();
  const textWalker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
  for (let node = textWalker.nextNode(); node; node = textWalker.nextNode()) {
    const owner = node.parentElement;
    const text = compact(node.textContent);
    if (!text || excluded.has(owner.localName)) continue;
    const groupId = groupByElement.get(owner) || "document";
    const group = groupStats.get(groupId) || groupStats.get("document");
    if (!ownerSeen.has(owner)) {
      ownerSeen.add(owner);
      counts.observedTextOwners += 1;
      group.textOwnerCount += 1;
      if (!elementIds.has(owner)) {
        counts.omittedTextOwners += 1;
        group.omittedTextOwnerCount += 1;
      }
    }
    if (!elementIds.has(owner)) continue;
    if (!ownerFragments.has(owner)) ownerFragments.set(owner, []);
    ownerFragments.get(owner).push(node.textContent);
    let paints = false;
    if (rendered(owner)) {
      const range = document.createRange();
      range.selectNodeContents(node);
      paints = [...range.getClientRects()].some((rect) => rect.width > 0 && rect.height > 0);
    }
    ownerPainted.set(owner, ownerPainted.get(owner) || paints);
  }
  for (const input of body.querySelectorAll("input,textarea")) {
    const textInput = input.localName === "input"
      && ["text", "search", "tel", "url", "email", "number", "button", "submit", "reset"].includes(input.type);
    if (!(textInput || input.localName === "textarea") || !input.value) continue;
    const groupId = groupByElement.get(input) || "document";
    const group = groupStats.get(groupId) || groupStats.get("document");
    if (!ownerSeen.has(input)) {
      ownerSeen.add(input);
      counts.observedTextOwners += 1;
      group.textOwnerCount += 1;
      if (!elementIds.has(input)) {
        counts.omittedTextOwners += 1;
        group.omittedTextOwnerCount += 1;
      }
    }
    if (elementIds.has(input)) {
      ownerFragments.set(input, [input.value]);
      ownerPainted.set(input, rendered(input));
    }
  }
  for (const [owner, fragments] of ownerFragments) {
    const groupId = groupByElement.get(owner) || "document";
    const group = groupStats.get(groupId) || groupStats.get("document");
    if (textOwners.length < limits.maxTextOwners) {
      const measurement = measure(owner);
      textOwners.push({
        ownerId: elementIds.get(owner), groupId, text: compact(fragments.join("")),
        painted: Boolean(ownerPainted.get(owner)), rendered: rendered(owner),
        styleId: styleFor(measurement), box: measurement.box, tag: owner.localName,
      });
      counts.capturedTextOwners += 1;
    } else {
      counts.omittedTextOwners += 1;
      group.omittedTextOwnerCount += 1;
    }
  }
  const groupRows = [groupStats.get("document"), ...landmarks.map((item) => groupStats.get(item.landmarkId))]
    .map((item) => ({ ...item, coverage: (
      item.omittedElementCount || item.omittedTextOwnerCount || item.omittedLinkCount || item.omittedImageCount
    ) ? "truncated" : "complete" }));
  const incomplete = Object.entries(counts).some(([name, value]) => name.startsWith("omitted") && value > 0);
  return {
    schemaVersion: "brandkit-page-capture/v1",
    identityScope: "Capture-local n-prefixed IDs; these are not native snapshot references.",
    page: {
      url: location.href, title: document.title, language: document.documentElement.lang || null,
      startedAt, capturedAt: new Date().toISOString(), readyState: document.readyState,
      viewport: { width: window.innerWidth, height: window.innerHeight, devicePixelRatio: window.devicePixelRatio },
      scroll: { x: window.scrollX, y: window.scrollY },
      document: {
        width: Math.max(document.documentElement.scrollWidth, body.scrollWidth),
        height: Math.max(document.documentElement.scrollHeight, body.scrollHeight),
      },
    },
    limits,
    counts: { ...counts, distinctStyles: styles.length, groups: groupRows.length },
    incomplete,
    limitations: [
      "Current DOM state only; no scrolling, clicking, hovering, menu opening, or state traversal was performed.",
      "Frames and shadow trees were not traversed; lazy or virtualized content outside the current state may be absent.",
      "Raw paint and ancestry are preserved; transparent or layered backgrounds are not resolved to an email-ready color.",
      "Raster image colors and semantic Brand Kit roles are not inferred.",
    ],
    groups: groupRows, styles, elements, textOwners, links, images,
  };
}

export function inspectionRequest(selectors, filename) {
  if (!Array.isArray(selectors) || !selectors.length || selectors.some((selector) => typeof selector !== "string" || !selector.trim())) {
    throw new Error("Provide a non-empty JSON array of CSS selectors.");
  }
  const output = { function: `() => (${inspectElements.toString()})(${JSON.stringify(selectors)})` };
  if (filename) output.filename = filename;
  return output;
}

export function targetInspectionRequest(target, filename) {
  if (typeof target !== "string" || !target.trim()) throw new Error("Provide a native target reference.");
  const output = { target, function: `(element) => (${inspectElements.toString()})(null, element)` };
  if (filename) output.filename = filename;
  return output;
}

// Prints native browser_evaluate arguments; does not open a browser or fetch a URL.
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    if (process.argv[2] === "--target") {
      console.log(JSON.stringify(targetInspectionRequest(process.argv[3], process.argv[4])));
    } else {
      console.log(JSON.stringify(inspectionRequest(JSON.parse(process.argv[2]), process.argv[3])));
    }
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

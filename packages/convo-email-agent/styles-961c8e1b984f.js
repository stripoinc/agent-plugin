import {
  EmailSdkError,
  LINE_HEIGHT_HINT,
  cloneJson,
  isObject
} from "./errors-3ee69a7e1eb0.js";

// convo-email-agent/src/sdk/styles.ts
var NAMED_COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#FF0000",
  green: "#008000",
  blue: "#0000FF",
  yellow: "#FFFF00",
  orange: "#FFA500",
  purple: "#800080",
  gray: "#808080",
  grey: "#808080",
  pink: "#FFC0CB",
  brown: "#A52A2A",
  cyan: "#00FFFF",
  magenta: "#FF00FF",
  silver: "#C0C0C0",
  gold: "#FFD700",
  navy: "#000080",
  teal: "#008080",
  lime: "#00FF00",
  maroon: "#800000",
  olive: "#808000"
};
var HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/u;
var RGB_COLOR = /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(?:,\s*(?:\d*\.?\d+)\s*)?\)$/u;
function normalizeColor(value, allowTransparent) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new EmailSdkError("Color must be a non-empty string.");
  }
  const raw = value.trim();
  const lower = raw.toLowerCase();
  if (lower === "transparent") {
    if (!allowTransparent) throw new EmailSdkError("Transparent is not allowed for this color field.");
    return "transparent";
  }
  if (HEX_COLOR.test(raw) || RGB_COLOR.test(lower)) return raw;
  const named = NAMED_COLORS[lower];
  if (named !== void 0) return named;
  throw new EmailSdkError(`Unsupported color "${value}". Use hex, rgb(), rgba(), or a common named color.`);
}
var SIDES = ["top", "right", "bottom", "left"];
var CORNERS = ["topLeft", "topRight", "bottomRight", "bottomLeft"];
var BREAKPOINTS = ["desktop", "mobile"];
var NODE_STYLE_SPECS = {
  button: {
    backgroundColor: { property: "backgroundColor", path: ["backgroundColor"], shape: "color" },
    fontColor: { property: "fontColor", path: ["fontColor"], shape: "colorNoTransparent" },
    fontSize: { property: "fontSize", path: ["fontSize"], shape: "sizeResponsive" },
    fontFamily: { property: "fontFamily", path: ["fontFamily"], shape: "fontFamily" },
    bold: { property: "bold", path: ["textStyle", "bold"], shape: "textStyle" },
    italic: { property: "italic", path: ["textStyle", "italic"], shape: "textStyle" },
    textAlign: { property: "textAlign", path: ["alignment"], shape: "alignResponsive" },
    padding: { property: "padding", path: ["padding"], shape: "paddingResponsive" },
    margin: { property: "margin", path: ["margins"], shape: "marginsResponsive" },
    border: { property: "border", path: ["border"], shape: "border" },
    borderRadius: { property: "borderRadius", path: ["borderRadius"], shape: "radiusCorner" }
  },
  image: {
    textAlign: { property: "textAlign", path: ["alignment"], shape: "alignResponsive" },
    margin: { property: "margin", path: ["margins"], shape: "marginsResponsive" },
    borderRadius: { property: "borderRadius", path: ["radius"], shape: "radiusResponsiveCorner" }
  },
  social: {
    backgroundColor: { property: "backgroundColor", path: ["backgroundColor"], shape: "color" },
    textAlign: { property: "textAlign", path: ["alignment"], shape: "alignResponsive" },
    margin: { property: "margin", path: ["margins"], shape: "marginsResponsive" }
  },
  text: {
    fontColor: { property: "fontColor", path: ["fontColor"], shape: "colorNoTransparent" },
    textAlign: { property: "textAlign", path: ["alignment"], shape: "textAlignResponsive" }
  },
  container: {
    backgroundColor: { property: "backgroundColor", path: ["backgroundColor"], shape: "color" },
    padding: { property: "padding", path: ["padding"], shape: "paddingResponsive" },
    border: { property: "border", path: ["border"], shape: "border" },
    borderRadius: { property: "borderRadius", path: ["radius"], shape: "radiusCorner" }
  },
  structure: {
    backgroundColor: { property: "backgroundColor", path: ["backgroundColor"], shape: "color" },
    padding: { property: "padding", path: ["padding"], shape: "paddingResponsive" },
    margin: { property: "margin", path: ["margins"], shape: "marginsResponsive" },
    border: { property: "border", path: ["border"], shape: "border" },
    borderRadius: { property: "borderRadius", path: ["borderRadius"], shape: "radiusCorner" }
  },
  stripe: {
    padding: { property: "padding", path: ["padding"], shape: "paddingMobileOnly" },
    border: { property: "border", path: ["contentBorder"], shape: "border" }
  }
};
var THEME_STYLE_SPECS = {
  lineHeight: {
    shape: "lineHeight",
    path: () => ["settings", "stripes", "lineHeight"]
  },
  fontSize: {
    shape: "sizeResponsive",
    path: (options) => ["settings", "stripes", normalizeStyleArea(options.area), "fontSize"]
  },
  fontFamily: {
    shape: "fontFamily",
    path: () => ["settings", "stripes", "fontFamily"]
  },
  linkColor: {
    shape: "colorNoTransparent",
    path: (options) => ["settings", "stripes", "lightTheme", normalizeStyleArea(options.area), "linkColor"]
  },
  fontColor: {
    shape: "colorNoTransparent",
    path: (options) => ["settings", "stripes", "lightTheme", normalizeStyleArea(options.area), "fontColor"]
  },
  backgroundColor: {
    shape: "color",
    path: (options) => [
      "settings",
      "stripes",
      "lightTheme",
      normalizeStyleArea(options.area),
      normalizeBackgroundTarget(options.backgroundTarget) === "stripe" ? "stripeBackgroundColor" : "contentBackgroundColor"
    ]
  }
};
function normalizeStyleArea(area) {
  if (area === void 0) return "content";
  if (typeof area !== "string" || area.trim() === "") {
    throw new EmailSdkError("Style area must be a non-empty string.");
  }
  return area;
}
function normalizeBreakpoint(breakpoint) {
  if (breakpoint === void 0) return "both";
  if (breakpoint === "desktop" || breakpoint === "mobile" || breakpoint === "both") return breakpoint;
  throw new EmailSdkError(`Style breakpoint must be desktop, mobile, or both; got "${String(breakpoint)}".`);
}
function normalizeBackgroundTarget(target) {
  if (target === void 0) return "content";
  if (target === "content" || target === "stripe") return target;
  throw new EmailSdkError(`backgroundTarget must be content or stripe; got "${String(target)}".`);
}
function checkUnusedStyleOptions(property, options) {
  if (options.backgroundTarget !== void 0 && property !== "backgroundColor") {
    throw new EmailSdkError("backgroundTarget applies only to backgroundColor.");
  }
  normalizeBreakpoint(options.breakpoint);
  if (options.area !== void 0) normalizeStyleArea(options.area);
  if (options.backgroundTarget !== void 0) normalizeBackgroundTarget(options.backgroundTarget);
}
function selectorKeyForEntry(kind, blockType) {
  return kind === "block" ? blockType : kind;
}
function addressableStyleProperties(selectorKey) {
  if (selectorKey === void 0) return [];
  const spec = NODE_STYLE_SPECS[selectorKey];
  if (spec === void 0) return [];
  return [...new Set(Object.values(spec).map((entry) => entry.property))].sort();
}
function nodeStyleSpec(kind, blockType, property, options) {
  if (options.area !== void 0) {
    throw new EmailSdkError("Style area applies only to document-level theme styles.");
  }
  checkUnusedStyleOptions(property, options);
  const selectorKey = selectorKeyForEntry(kind, blockType);
  if (selectorKey === "stripe" && property === "backgroundColor") {
    return {
      property,
      path: [normalizeBackgroundTarget(options.backgroundTarget) === "stripe" ? "stripeBackgroundColor" : "contentBackgroundColor"],
      shape: "color"
    };
  }
  const spec = selectorKey === void 0 ? void 0 : NODE_STYLE_SPECS[selectorKey]?.[property];
  if (spec !== void 0) return spec;
  const valid = addressableStyleProperties(selectorKey);
  const suffix = valid.length > 0 ? ` Valid properties: ${valid.join(", ")}.` : "";
  throw new EmailSdkError(
    `Style property "${property}" is not supported on ${kind ?? "element"}${blockType ? ` type="${blockType}"` : ""}.${suffix}`
  );
}
function themeStyleSpec(property, options) {
  checkUnusedStyleOptions(property, options);
  const spec = THEME_STYLE_SPECS[property];
  if (spec === void 0) {
    throw new EmailSdkError(
      `Style property "${property}" has no document-level theme target. Valid theme properties: ${Object.keys(THEME_STYLE_SPECS).sort().join(", ")}.`
    );
  }
  return { path: spec.path(options), shape: spec.shape };
}
function assertNumber(value, lo, hi, label) {
  if (typeof value !== "number" || Number.isNaN(value) || typeof value === "boolean") {
    throw new EmailSdkError(`${label} must be a number.`);
  }
  if (value < lo || value > hi) {
    throw new EmailSdkError(`${label} must be between ${lo} and ${hi}.`);
  }
  return value;
}
function resolveBreakpoints(breakpoint) {
  if (breakpoint === "both") return [...BREAKPOINTS];
  return [breakpoint];
}
function buildResponsiveScalar(value, existing, breakpoint, lo, hi, label) {
  const base = isObject(existing) ? cloneJson(existing) : {};
  if (isObject(value)) {
    const extras = Object.keys(value).filter((key) => !BREAKPOINTS.includes(key));
    if (extras.length > 0) throw new EmailSdkError(`${label} rejects keys: ${extras.join(", ")}.`);
    if (Object.keys(value).length === 0) throw new EmailSdkError(`${label} object may not be empty.`);
    for (const breakpointKey of BREAKPOINTS) {
      if (Object.hasOwn(value, breakpointKey)) {
        base[breakpointKey] = assertNumber(value[breakpointKey], lo, hi, `${label}.${breakpointKey}`);
      }
    }
  } else {
    const next = assertNumber(value, lo, hi, label);
    for (const breakpointKey of resolveBreakpoints(breakpoint)) base[breakpointKey] = next;
  }
  for (const breakpointKey of BREAKPOINTS) {
    if (base[breakpointKey] === void 0) {
      const present = BREAKPOINTS.map((key) => base[key]).find((candidate) => candidate !== void 0);
      base[breakpointKey] = present ?? lo;
    }
  }
  return base;
}
function buildAlignment(value, existing, breakpoint, allowJustify = false) {
  const allowed = allowJustify ? ["left", "center", "right", "justify"] : ["left", "center", "right"];
  const valid = new Set(allowed);
  const base = isObject(existing) ? cloneJson(existing) : {};
  const check = (candidate, label) => {
    if (typeof candidate !== "string" || !valid.has(candidate)) {
      throw new EmailSdkError(`${label} must be ${allowed.join(", ")}.`);
    }
    return candidate;
  };
  if (isObject(value)) {
    const extras = Object.keys(value).filter((key) => !BREAKPOINTS.includes(key));
    if (extras.length > 0) throw new EmailSdkError(`textAlign rejects keys: ${extras.join(", ")}.`);
    if (Object.keys(value).length === 0) throw new EmailSdkError("textAlign object may not be empty.");
    for (const breakpointKey of BREAKPOINTS) {
      if (Object.hasOwn(value, breakpointKey)) base[breakpointKey] = check(value[breakpointKey], `textAlign.${breakpointKey}`);
    }
  } else {
    const next = check(value, "textAlign");
    for (const breakpointKey of resolveBreakpoints(breakpoint)) base[breakpointKey] = next;
  }
  for (const breakpointKey of BREAKPOINTS) {
    if (base[breakpointKey] === void 0) {
      const present = BREAKPOINTS.map((key) => base[key]).find((candidate) => candidate !== void 0);
      base[breakpointKey] = present ?? "left";
    }
  }
  return base;
}
function buildSides(value, existing) {
  const base = {};
  if (isObject(existing)) {
    for (const side of SIDES) {
      if (typeof existing[side] === "number") base[side] = existing[side];
    }
  }
  if (isObject(value)) {
    const extras = Object.keys(value).filter((key) => !SIDES.includes(key));
    if (extras.length > 0) throw new EmailSdkError(`Side object rejects keys: ${extras.join(", ")}.`);
    if (Object.keys(value).length === 0) throw new EmailSdkError("Side object may not be empty.");
    for (const side of SIDES) {
      if (Object.hasOwn(value, side)) base[side] = assertNumber(value[side], -1e6, 1e6, `side.${side}`);
    }
  } else {
    const next = assertNumber(value, -1e6, 1e6, "spacing");
    for (const side of SIDES) base[side] = next;
  }
  for (const side of SIDES) {
    base[side] ??= 0;
  }
  return base;
}
function buildResponsiveSides(value, existing, breakpoint, allowedBreakpoints, label) {
  const base = isObject(existing) ? cloneJson(existing) : {};
  if (isObject(value) && BREAKPOINTS.some((key) => Object.hasOwn(value, key))) {
    const extras = Object.keys(value).filter((key) => !BREAKPOINTS.includes(key));
    if (extras.length > 0) throw new EmailSdkError(`${label} rejects keys: ${extras.join(", ")}.`);
    for (const breakpointKey of BREAKPOINTS) {
      if (!Object.hasOwn(value, breakpointKey)) continue;
      if (!allowedBreakpoints.includes(breakpointKey)) {
        throw new EmailSdkError(`${label} does not support ${breakpointKey} breakpoint.`);
      }
      base[breakpointKey] = buildSides(value[breakpointKey], base[breakpointKey]);
    }
  } else {
    const targetBreakpoints = breakpoint === "both" ? allowedBreakpoints : allowedBreakpoints.includes(breakpoint) ? [breakpoint] : [];
    if (targetBreakpoints.length === 0) throw new EmailSdkError(`${label} does not support ${breakpoint} breakpoint.`);
    for (const breakpointKey of targetBreakpoints) base[breakpointKey] = buildSides(value, base[breakpointKey]);
  }
  for (const breakpointKey of allowedBreakpoints) {
    if (base[breakpointKey] === void 0) {
      const present = allowedBreakpoints.map((key) => base[key]).find((candidate) => candidate !== void 0);
      base[breakpointKey] = present === void 0 ? buildSides(0, void 0) : cloneJson(present);
    }
  }
  for (const breakpointKey of BREAKPOINTS) {
    if (!allowedBreakpoints.includes(breakpointKey)) delete base[breakpointKey];
  }
  return base;
}
function buildBorder(value, existing) {
  if (!isObject(value)) {
    throw new EmailSdkError("border must be an object.");
  }
  const validStyles = /* @__PURE__ */ new Set(["solid", "dashed", "dotted"]);
  const base = isObject(existing) ? cloneJson(existing) : {};
  const extras = Object.keys(value).filter((key) => !SIDES.includes(key) && !["width", "color", "style"].includes(key));
  if (extras.length > 0) throw new EmailSdkError(`border rejects keys: ${extras.join(", ")}.`);
  const sideDefault = () => ({ width: 0, color: "transparent" });
  const buildSide = (src, current) => {
    if (src !== void 0 && !isObject(src)) throw new EmailSdkError("border side must be an object.");
    const side = isObject(current) ? cloneJson(current) : sideDefault();
    if (isObject(src)) {
      const sideExtras = Object.keys(src).filter((key) => !["width", "color"].includes(key));
      if (sideExtras.length > 0) throw new EmailSdkError(`border side rejects keys: ${sideExtras.join(", ")}.`);
      if (Object.hasOwn(src, "width")) side.width = assertNumber(src.width, 0, 100, "border.width");
      if (Object.hasOwn(src, "color")) side.color = normalizeColor(src.color, true);
    }
    side.width ??= 0;
    side.color ??= "transparent";
    return side;
  };
  if (Object.hasOwn(value, "style")) {
    if (typeof value.style !== "string" || !validStyles.has(value.style)) {
      throw new EmailSdkError("border.style must be solid, dashed, or dotted.");
    }
    base.style = value.style;
  }
  const hasSugar = Object.hasOwn(value, "width") || Object.hasOwn(value, "color");
  const hasPerSide = SIDES.some((side) => Object.hasOwn(value, side));
  if (hasSugar && hasPerSide) {
    throw new EmailSdkError("border accepts either width/color shorthand or per-side values, not both.");
  }
  if (hasSugar) {
    const sideValue = {};
    if (Object.hasOwn(value, "width")) sideValue.width = value.width;
    if (Object.hasOwn(value, "color")) sideValue.color = value.color;
    for (const side of SIDES) base[side] = buildSide(sideValue, base[side]);
  } else if (hasPerSide) {
    for (const side of SIDES) {
      if (Object.hasOwn(value, side)) base[side] = buildSide(value[side], base[side]);
    }
  }
  for (const side of SIDES) {
    if (!isObject(base[side])) base[side] = sideDefault();
  }
  base.style ??= "solid";
  return base;
}
function buildCorner(value, existing) {
  const base = isObject(existing) ? cloneJson(existing) : {};
  if (isObject(value)) {
    const extras = Object.keys(value).filter((key) => !CORNERS.includes(key));
    if (extras.length > 0) throw new EmailSdkError(`borderRadius rejects keys: ${extras.join(", ")}.`);
    if (Object.keys(value).length === 0) throw new EmailSdkError("borderRadius object may not be empty.");
    for (const corner of CORNERS) {
      if (Object.hasOwn(value, corner)) base[corner] = assertNumber(value[corner], 0, 1e3, `borderRadius.${corner}`);
    }
  } else {
    const next = assertNumber(value, 0, 1e3, "borderRadius");
    for (const corner of CORNERS) base[corner] = next;
  }
  for (const corner of CORNERS) {
    base[corner] ??= 0;
  }
  return base;
}
function buildResponsiveCorner(value, existing, breakpoint) {
  const base = isObject(existing) ? cloneJson(existing) : {};
  if (isObject(value) && BREAKPOINTS.some((key) => Object.hasOwn(value, key))) {
    const extras = Object.keys(value).filter((key) => !BREAKPOINTS.includes(key));
    if (extras.length > 0) throw new EmailSdkError(`borderRadius rejects keys: ${extras.join(", ")}.`);
    for (const breakpointKey of BREAKPOINTS) {
      if (Object.hasOwn(value, breakpointKey)) base[breakpointKey] = buildCorner(value[breakpointKey], base[breakpointKey]);
    }
  } else {
    for (const breakpointKey of resolveBreakpoints(breakpoint)) {
      base[breakpointKey] = buildCorner(value, base[breakpointKey]);
    }
  }
  for (const breakpointKey of BREAKPOINTS) {
    if (base[breakpointKey] === void 0) {
      const present = BREAKPOINTS.map((key) => base[key]).find((candidate) => candidate !== void 0);
      base[breakpointKey] = present === void 0 ? buildCorner(0, void 0) : cloneJson(present);
    }
  }
  return base;
}
function buildTextStyle(leaf, value, existing) {
  if (typeof value !== "boolean") throw new EmailSdkError(`${leaf} must be a boolean.`);
  const base = isObject(existing) ? cloneJson(existing) : {};
  base.bold ??= false;
  base.italic ??= false;
  base[leaf] = value;
  return base;
}
function buildStyleValue(shape, value, options, existing, leaf) {
  const breakpoint = normalizeBreakpoint(options.breakpoint);
  switch (shape) {
    case "color":
      return normalizeColor(value, true);
    case "colorNoTransparent":
      return normalizeColor(value, false);
    case "fontFamily":
      if (typeof value !== "string" || value.trim() === "") throw new EmailSdkError("fontFamily must be a non-empty string.");
      return value;
    case "textStyle":
      if (leaf === void 0) throw new EmailSdkError("Internal style error: textStyle leaf is missing.");
      return buildTextStyle(leaf, value, existing);
    case "sizeResponsive":
      return buildResponsiveScalar(value, existing, breakpoint, 8, 72, "fontSize");
    case "lineHeight":
      try {
        return buildResponsiveScalar(value, existing, breakpoint, 0, 5, "lineHeight");
      } catch (error) {
        if (error instanceof EmailSdkError) throw new EmailSdkError(`${error.message} ${LINE_HEIGHT_HINT}`);
        throw error;
      }
    case "alignResponsive":
      return buildAlignment(value, existing, breakpoint);
    case "textAlignResponsive":
      return buildAlignment(value, existing, breakpoint, true);
    case "paddingResponsive":
      return buildResponsiveSides(value, existing, breakpoint, BREAKPOINTS, "padding");
    case "marginsResponsive":
      return buildResponsiveSides(value, existing, breakpoint, BREAKPOINTS, "margin");
    case "paddingMobileOnly":
      return buildResponsiveSides(value, existing, breakpoint, ["mobile"], "stripe padding");
    case "border":
      return buildBorder(value, existing);
    case "radiusCorner":
      return buildCorner(value, existing);
    case "radiusResponsiveCorner":
      return buildResponsiveCorner(value, existing, breakpoint);
  }
}

export {
  NAMED_COLORS,
  HEX_COLOR,
  RGB_COLOR,
  normalizeColor,
  SIDES,
  CORNERS,
  BREAKPOINTS,
  NODE_STYLE_SPECS,
  THEME_STYLE_SPECS,
  normalizeStyleArea,
  normalizeBreakpoint,
  normalizeBackgroundTarget,
  checkUnusedStyleOptions,
  selectorKeyForEntry,
  addressableStyleProperties,
  nodeStyleSpec,
  themeStyleSpec,
  assertNumber,
  resolveBreakpoints,
  buildResponsiveScalar,
  buildAlignment,
  buildSides,
  buildResponsiveSides,
  buildBorder,
  buildCorner,
  buildResponsiveCorner,
  buildTextStyle,
  buildStyleValue
};

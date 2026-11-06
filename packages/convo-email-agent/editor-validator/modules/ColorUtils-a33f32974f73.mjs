import {
  tinycolor
} from "./tinycolor-2bf5fc1acbb7.mjs";

// editor/ui-editor-ui/src/app/tools/ColorUtils.ts
var DEFINED_COLOR_VALUES = ["none", "inherit", "initial", "currentColor", "unset"];
var TRANSPARENT = "transparent";
var clearColor = (color) => !color ? "" : color.replace("!important", "").replace("/", " ").replace(/\s*\(\s*/, "(").replace(/\s*\)\s*/, ")").replace(/\s\s+/g, " ").trim();
function isTransparentColor(color) {
  const normalizedColor = clearColor(color);
  if (normalizedColor === TRANSPARENT) {
    return true;
  }
  if (DEFINED_COLOR_VALUES.includes(normalizedColor)) {
    return false;
  }
  if (isCssGradient(normalizedColor) || splitTopLevelCsv(normalizedColor).length > 1) {
    return false;
  }
  const colorVal = tinycolor(normalizedColor);
  if (!colorVal.isValid()) {
    return false;
  }
  const c = colorVal.toName();
  return c === "transparent" && normalizedColor.length > (normalizedColor?.startsWith("#") ? 5 : 4);
}
function rgb2hex(rgb, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  if (isMergeTagColorToken(rgb, colorMergeTagValues)) {
    return rgb;
  }
  if (!rgb) {
    return rgb;
  }
  if (isTransparentColor(rgb)) {
    return TRANSPARENT;
  }
  if (isHex(rgb)) {
    return rgb;
  }
  const matchRgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!matchRgb) {
    return null;
  }
  return rgbSequence2hex(matchRgb[1], matchRgb[2], matchRgb[3]);
}
function rgbSequence2hex(r, g, b) {
  const red = Number(r);
  const green = Number(g);
  const blue = Number(b);
  const color = tinycolor({ r: red, g: green, b: blue });
  return color.toHexString();
}
function isColorValid(color, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  const colorVal = tinycolor(color ?? "");
  return colorVal.isValid() || isMergeTagColorToken(color, colorMergeTagValues);
}
var isHex = (color) => /^#[0-9A-F]{6}$|#[0-9A-F]{3}$/i.test(color);
var DEFAULT_GRADIENT_ANGLE_MAX = 359;
var DEFAULT_LINEAR_GRADIENT_ANGLE = 180;
function isCssGradient(value) {
  return /gradient\s*\(/i.test(value.trim());
}
function clampGradientPercent(percent) {
  const safePercent = Number.isFinite(+percent) ? +percent : 0;
  return Math.max(0, Math.min(100, safePercent));
}
function clampGradientOpacity(opacity) {
  const safeOpacity = Number.isFinite(+opacity) ? +opacity : 100;
  return Math.max(0, Math.min(100, safeOpacity));
}
function normalizeGradientAngle(angle, maxAngle = DEFAULT_GRADIENT_ANGLE_MAX) {
  const safeAngle = Number.isFinite(+angle) ? Math.round(+angle) : 0;
  return (safeAngle % (maxAngle + 1) + (maxAngle + 1)) % (maxAngle + 1);
}
function splitTopLevelCsv(value, preserveEmptyParts = false) {
  const parts = [];
  let current = "";
  let depth = 0;
  let quote;
  let escaped = false;
  let inComment = false;
  for (let index = 0; index < value.length; index++) {
    const char = value[index];
    const nextChar = value[index + 1];
    current += char;
    if (inComment) {
      if (char === "*" && nextChar === "/") {
        current += nextChar;
        index++;
        inComment = false;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = void 0;
      }
      continue;
    }
    if (char === "/" && nextChar === "*") {
      current += nextChar;
      index++;
      inComment = true;
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === "\\") {
      index++;
      current += value[index] ?? "";
    } else if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
    } else if (char === "," && depth === 0) {
      current = current.slice(0, -1);
      if (current.trim() || preserveEmptyParts) {
        parts.push(current.trim());
      }
      current = "";
      continue;
    }
  }
  if (current.trim() || preserveEmptyParts) {
    parts.push(current.trim());
  }
  return parts;
}
function scanCssFunctionCall(css, match) {
  const openIndex = match.index + match[0].lastIndexOf("(");
  if (openIndex < match.index) {
    return null;
  }
  let depth = 0;
  let quote;
  let escaped = false;
  let inComment = false;
  for (let index = openIndex; index < css.length; index++) {
    const char = css[index];
    const nextChar = css[index + 1];
    if (inComment) {
      if (char === "*" && nextChar === "/") {
        inComment = false;
        index++;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === quote) {
        quote = void 0;
      }
      continue;
    }
    if (char === "\\") {
      index++;
    } else if (char === "/" && nextChar === "*") {
      inComment = true;
      index++;
    } else if (char === '"' || char === "'") {
      quote = char;
    } else if (char === "(") {
      depth++;
    } else if (char === ")") {
      depth--;
      if (depth === 0) {
        return {
          start: match.index,
          contentStart: openIndex + 1,
          end: index + 1
        };
      }
      if (depth < 0) {
        return null;
      }
    }
  }
  return null;
}
function isValidCssVar(value) {
  const trimmedValue = value.trim();
  const match = /^var\(/i.exec(trimmedValue);
  if (!match) {
    return false;
  }
  const range = scanCssFunctionCall(trimmedValue, match);
  if (!range || range.end !== trimmedValue.length) {
    return false;
  }
  const content = trimmedValue.slice(range.contentStart, range.end - 1);
  const fallbackSeparatorIndex = content.indexOf(",");
  const propertyEndIndex = fallbackSeparatorIndex < 0 ? content.length : fallbackSeparatorIndex;
  const propertyName = content.slice(0, propertyEndIndex).trim();
  if (!/^--[\w-]+$/.test(propertyName)) {
    return false;
  }
  return fallbackSeparatorIndex < 0 || !!content.slice(fallbackSeparatorIndex + 1).trim();
}
function isCssColorOrVar(value) {
  const trimmedValue = value.trim();
  return /^var\(/i.test(trimmedValue) ? isValidCssVar(trimmedValue) : tinycolor(trimmedValue).isValid();
}
function isMergeTagColorToken(value, colorMergeTagValues) {
  return typeof value === "string" && colorMergeTagValues.has(value);
}
function normalizeCssColorOrVar(value) {
  const normalizedValue = clearColor(value);
  return normalizedValue && isCssColorOrVar(normalizedValue) ? normalizedValue : void 0;
}
function looksLikeEditableColorStopPart(part) {
  const percentMatch = part.match(/\s+(-?\d+(?:\.\d+)?)\s*%?\s*$/);
  const colorPart = percentMatch ? part.slice(0, percentMatch.index).trim() : part.trim();
  return tinycolor(colorPart).isValid();
}
function parseGradientStopPart(part, index, total) {
  const percentMatch = part.match(/\s+(-?\d+(?:\.\d+)?)\s*%?\s*$/);
  const colorPart = percentMatch ? part.slice(0, percentMatch.index).trim() : part.trim();
  const parsedColor = tinycolor(colorPart);
  if (!parsedColor.isValid()) {
    return null;
  }
  const position = percentMatch ? clampGradientPercent(Number(percentMatch[1])) : clampGradientPercent(total <= 1 ? 0 : index / (total - 1) * 100);
  return {
    position,
    color: parsedColor.toHexString(),
    opacity: clampGradientOpacity(Math.round((parsedColor.getAlpha() ?? 1) * 100))
  };
}
function parseGradientStopParts(parts) {
  if (parts.length < 2) {
    return null;
  }
  const stops = [];
  for (const [index, part] of parts.entries()) {
    const stop = parseGradientStopPart(part, index, parts.length);
    if (!stop) {
      return null;
    }
    stops.push(stop);
  }
  return stops;
}
function parseLinearGradientContent(content) {
  const parts = splitTopLevelCsv(content);
  let angle = DEFAULT_LINEAR_GRADIENT_ANGLE;
  let stopStartIndex = 0;
  if (parts.length && !looksLikeEditableColorStopPart(parts[0])) {
    const angleMatch = parts[0].match(/^(-?\d+(?:\.\d+)?)\s*deg$/i);
    if (!angleMatch) {
      return null;
    }
    angle = normalizeGradientAngle(Number(angleMatch[1]));
    stopStartIndex = 1;
  }
  const gradientItems = parseGradientStopParts(parts.slice(stopStartIndex));
  if (!gradientItems) {
    return null;
  }
  return {
    gradientType: "linear",
    angle,
    gradientItems
  };
}
function parseRadialGradientContent(content) {
  const parts = splitTopLevelCsv(content);
  if (!parts.length || !/^circle$/i.test(parts[0])) {
    return null;
  }
  const gradientItems = parseGradientStopParts(parts.slice(1));
  if (!gradientItems) {
    return null;
  }
  return {
    gradientType: "radial",
    angle: 0,
    gradientItems
  };
}
function isValidGradientSolidFallback(value) {
  return isCssColorOrVar(value);
}
function extractEditableGradientCall(css) {
  const trimmedCss = css.trim();
  const match = /^(linear-gradient|radial-gradient)\s*\(/i.exec(trimmedCss);
  if (!match) {
    return null;
  }
  const range = scanCssFunctionCall(trimmedCss, match);
  if (!range) {
    return null;
  }
  const trailing = trimmedCss.slice(range.end).trim();
  let solidFallback;
  if (trailing) {
    solidFallback = trailing.startsWith(",") ? trailing.slice(1).trim() : void 0;
    if (!solidFallback || !isValidGradientSolidFallback(solidFallback)) {
      return null;
    }
  }
  return {
    name: match[1].toLowerCase(),
    content: trimmedCss.slice(range.contentStart, range.end - 1).trim(),
    solidFallback
  };
}
function analyzeEditableCssGradient(css) {
  const gradientCall = extractEditableGradientCall(css);
  if (!gradientCall) {
    return null;
  }
  const gradient = gradientCall.name === "linear-gradient" ? parseLinearGradientContent(gradientCall.content) : parseRadialGradientContent(gradientCall.content);
  if (!gradient) {
    return null;
  }
  return {
    gradient,
    solidFallback: gradientCall.solidFallback
  };
}
function parseCssGradient(css) {
  return analyzeEditableCssGradient(css)?.gradient ?? null;
}
function isEditableCssGradient(value) {
  return parseCssGradient(value) !== null;
}
function normalizeCopilotDocumentStateColorValue(color, options, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  if (color === null || color === void 0) {
    return void 0;
  }
  if (isMergeTagColorToken(color, colorMergeTagValues)) {
    return color;
  }
  const normalizedColor = clearColor(color);
  if (!normalizedColor) {
    return void 0;
  }
  if (isTransparentColor(normalizedColor)) {
    return options.allowTransparent ? TRANSPARENT : void 0;
  }
  if (!isColorValid(normalizedColor)) {
    return void 0;
  }
  const hexColor = rgb2hex(normalizedColor);
  if (hexColor) {
    return hexColor.toLowerCase();
  }
  return normalizedColor;
}

export {
  splitTopLevelCsv,
  isMergeTagColorToken,
  normalizeCssColorOrVar,
  isEditableCssGradient,
  normalizeCopilotDocumentStateColorValue
};

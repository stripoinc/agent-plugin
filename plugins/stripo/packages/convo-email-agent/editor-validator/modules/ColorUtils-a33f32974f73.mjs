import {
  tinycolor
} from "./tinycolor-2bf5fc1acbb7.mjs";

// editor/ui-editor-ui/src/app/tools/ColorUtils.ts
var BRIGHTNESS_100 = 100;
function getMinRatio(level, size) {
  if (level === "AAA") {
    return size === "large" ? 4.5 : 7;
  }
  return size === "large" ? 3 : 4.5;
}
function passes(bg, fg, minRatio) {
  if (sameColor(bg, fg)) {
    return false;
  }
  return tinycolor.readability(bg, fg) >= minRatio;
}
function sameColor(a, b) {
  return tinycolor(a).toHexString().toLowerCase() === tinycolor(b).toHexString().toLowerCase();
}
function adjustLightnessToMeetContrast(bg, text, minRatio) {
  const t = text.toHsl();
  const bgIsLight = bg.isLight();
  let lo = bgIsLight ? 0 : t.l;
  let hi = bgIsLight ? t.l : 1;
  let best = null;
  for (let i = 0; i < 24; i++) {
    const mid = (lo + hi) / 2;
    const cand = tinycolor({ h: t.h, s: t.s, l: mid, a: 1 });
    if (tinycolor.readability(bg, cand) >= minRatio) {
      best = cand;
      if (bgIsLight) {
        lo = mid;
      } else {
        hi = mid;
      }
    } else if (bgIsLight) {
      hi = mid;
    } else {
      lo = mid;
    }
  }
  return best;
}
function randomNudgeAroundBase(bg, base, maxStepPercent) {
  const bgIsLight = bg.isLight();
  const max = Math.max(0.2, maxStepPercent);
  const step = Math.random() * (max - 0.2) + 0.2;
  const b = base.toHsl();
  const preferred = bgIsLight ? tinycolor(base).darken(step) : tinycolor(base).lighten(step);
  const alternate = bgIsLight ? tinycolor(base).lighten(step) : tinycolor(base).darken(step);
  const preferredHsl = preferred.toHsl();
  const alternateHsl = alternate.toHsl();
  return [
    tinycolor({ h: b.h, s: b.s, l: preferredHsl.l, a: 1 }),
    tinycolor({ h: b.h, s: b.s, l: alternateHsl.l, a: 1 })
  ];
}
function invertColorComponent(component) {
  const maxColorValue = 255;
  return maxColorValue - component;
}
function bringToSameFormat(v) {
  const normalizedValue = v.trim().toLowerCase();
  if (normalizedValue === "transparent") {
    return normalizedValue;
  }
  const valueWithoutPrefix = normalizedValue[0] === "#" ? normalizedValue.slice(1) : normalizedValue;
  switch (valueWithoutPrefix.length) {
    case 3:
      return "#".concat(valueWithoutPrefix[0]).concat(valueWithoutPrefix[0]).concat(valueWithoutPrefix[1]).concat(valueWithoutPrefix[1]).concat(valueWithoutPrefix[2]).concat(valueWithoutPrefix[2]);
    case 4:
      return "#".concat(valueWithoutPrefix[0]).concat(valueWithoutPrefix[0]).concat(valueWithoutPrefix[1]).concat(valueWithoutPrefix[1]).concat(valueWithoutPrefix[2]).concat(valueWithoutPrefix[2]);
    case 6:
      return "#".concat(valueWithoutPrefix);
    case 8:
      return "#".concat(valueWithoutPrefix.slice(0, 6));
  }
  return "#".concat(valueWithoutPrefix);
}
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
  const colorVal = tinycolor(normalizedColor);
  if (!colorVal.isValid()) {
    return false;
  }
  const c = colorVal.toName();
  return c === "transparent" && normalizedColor.length > (normalizedColor?.startsWith("#") ? 5 : 4);
}
function isDark(color) {
  const normalizedColor = clearColor(color);
  if (!normalizedColor || DEFINED_COLOR_VALUES.includes(normalizedColor) || isTransparentColor(normalizedColor)) {
    return false;
  }
  const colorVal = tinycolor(normalizedColor);
  if (!colorVal.isValid()) {
    return false;
  }
  const hexColor = tinycolor(colorVal).toHex();
  const { r, g, b } = tinycolor(hexColor).toRgb();
  const L = (r * 0.299 + g * 0.587 + b * 0.114) / 255;
  return L < 0.5;
}
function areColorsEqual(color1, color2, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  if (isMergeTagColorToken(color1, colorMergeTagValues) || isMergeTagColorToken(color2, colorMergeTagValues)) {
    return color1 === color2;
  }
  return tinycolor.equals(color1, color2);
}
function colorToHsv(color) {
  const normalizedColor = clearColor(color);
  const colorVal = tinycolor(normalizedColor);
  if (!colorVal.isValid()) {
    return null;
  }
  return colorVal.toHsv();
}
function hex(x) {
  return "0".concat(parseInt(x, 10).toString(16)).slice(-2);
}
function hex2rgb(color) {
  const r = parseInt("".concat(color[1]).concat(color[2]), 16);
  const g = parseInt("".concat(color[3]).concat(color[4]), 16);
  const b = parseInt("".concat(color[5]).concat(color[6]), 16);
  return { r, g, b };
}
function rgb2hsl(r, g, b) {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  let lum = (max + min) / 2;
  let hue = 0;
  let sat;
  if (max === min) {
    hue = 0;
    sat = 0;
  } else {
    const c = max - min;
    sat = c / (1 - Math.abs(2 * lum - 1));
    switch (max) {
      case red:
        hue = (green - blue) / c;
        hue = (green - blue) / c % 6;
        hue = (green - blue) / c + (green < blue ? 6 : 0);
        break;
      case green:
        hue = (blue - red) / c + 2;
        break;
      case blue:
        hue = (red - green) / c + 4;
        break;
    }
  }
  hue = Math.round(hue * 60);
  sat = Math.round(sat * 100);
  lum = Math.round(lum * 100);
  return [hue, sat, lum];
}
function invertRGB(r, g, b) {
  return [255 - r, 255 - g, 255 - b];
}
function hsvToHex(h, s, v) {
  const colorVal = tinycolor({ h, s, v });
  if (!colorVal.isValid()) {
    return null;
  }
  return colorVal.toHexString();
}
function hslToHex(h, s, l) {
  const colorVal = tinycolor({ h, s, l });
  if (!colorVal.isValid()) {
    return null;
  }
  return colorVal.toHexString();
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
function colorToRGBSequence(color) {
  const colorVal = tinycolor(color);
  const RGB = colorVal.toRgb();
  return [RGB.r, RGB.g, RGB.b];
}
function transformColorToSystem(color) {
  if (isTransparentColor(color)) {
    return TRANSPARENT;
  }
  return isColorValid(color) ? colorToHexString(color) : color;
}
function colorToHexString(color, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  if (isMergeTagColorToken(color, colorMergeTagValues)) {
    return color;
  }
  return tinycolor(color).toHexString();
}
function colorToHsl(color) {
  return tinycolor(color).toHsl();
}
function isColorValid(color, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  const colorVal = tinycolor(color);
  return colorVal.isValid() || isMergeTagColorToken(color, colorMergeTagValues);
}
var isHex = (color) => /^#[0-9A-F]{6}$|#[0-9A-F]{3}$/i.test(color);
function transformSolidColorToHoverColor(baseColor) {
  if (isTransparentColor(baseColor)) {
    return baseColor;
  }
  if (!isColorValid(baseColor)) {
    return null;
  }
  const hoverCoefficient = 0.03;
  const hslColor = colorToHsl(baseColor);
  return isDark(baseColor) ? hslToHex(hslColor.h, hslColor.s, hslColor.l + hslColor.l * hoverCoefficient) : hslToHex(hslColor.h, hslColor.s, hslColor.l - hslColor.l * hoverCoefficient);
}
function getGradientStopColorForHover(stop) {
  if (stop.opacity <= 0) {
    return TRANSPARENT;
  }
  if (stop.opacity >= 100) {
    return stop.color;
  }
  return tinycolor(stop.color).setAlpha(stop.opacity / 100).toRgbString();
}
function transformColorToHoverColor(baseColor, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  if (isMergeTagColorToken(baseColor, colorMergeTagValues)) {
    return baseColor;
  }
  if (!isCssGradient(baseColor)) {
    return transformSolidColorToHoverColor(baseColor);
  }
  const analysis = analyzeEditableCssGradient(baseColor);
  if (!analysis) {
    return null;
  }
  const firstStop = analysis.gradient.gradientItems[0];
  const fallbackColor = analysis.solidFallback ?? (firstStop ? getGradientStopColorForHover(firstStop) : void 0);
  return fallbackColor ? transformSolidColorToHoverColor(fallbackColor) : null;
}
function invertColor(baseColor) {
  const { r, g, b } = tinycolor(baseColor).toRgb();
  const invertedColor = tinycolor({
    r: invertColorComponent(r),
    g: invertColorComponent(g),
    b: invertColorComponent(b)
  });
  return invertedColor.toHexString();
}
function getContrastedHoveredFontColor(fontColor, backgroundHoverColor, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  if (typeof fontColor === "string" && isMergeTagColorToken(fontColor, colorMergeTagValues) || typeof backgroundHoverColor === "string" && isMergeTagColorToken(backgroundHoverColor, colorMergeTagValues)) {
    return fontColor;
  }
  const isReadable = tinycolor.isReadable(fontColor, backgroundHoverColor, { level: "AAA", size: "small" });
  if (isReadable) {
    return fontColor;
  } else {
    let brightness;
    let readable = false;
    let color = "";
    const f = tinycolor(backgroundHoverColor).isDark() ? "lighten" : "darken";
    for (brightness = 0; brightness < BRIGHTNESS_100; brightness++) {
      color = tinycolor(fontColor)[f](brightness).toString();
      readable = tinycolor.isReadable(color, backgroundHoverColor, { level: "AAA", size: "small" });
      if (readable) {
        break;
      }
    }
    return color;
  }
}
function isHexColor(value, checkFormat = false) {
  if (value?.charAt(0) === "#") {
    if (checkFormat) {
      const shortColorValueLen = 4;
      const minFullColorValueLen = 7;
      return value.length === shortColorValueLen || value.length >= minFullColorValueLen;
    }
    return true;
  }
  return false;
}
function getColorFormat(color) {
  return tinycolor(color).getFormat();
}
function isSameHexColor(color1, color2) {
  if (!color1 || !color2) {
    return false;
  }
  return bringToSameFormat(color1) === bringToSameFormat(color2);
}
function isUsableColor(color) {
  if (!color) {
    return false;
  }
  if (color === TRANSPARENT || color === "rgba(0, 0, 0, 0)") {
    return false;
  }
  return isColorValid(color) && !isTransparentColor(color);
}
function normalizeColorToHex(color) {
  if (!color) {
    return color;
  }
  if (color.startsWith("#")) {
    return color;
  }
  const hexColor = rgb2hex(color);
  return hexColor || color;
}
function normalizeColorForUpdate(color) {
  if (color === null || color === void 0) {
    return void 0;
  }
  const trimmed = color.trim();
  if (!trimmed || trimmed.toLowerCase() === TRANSPARENT || isTransparentColor(trimmed)) {
    return void 0;
  }
  const hex2 = rgb2hex(trimmed);
  if (!hex2) {
    return trimmed;
  }
  return hex2 === TRANSPARENT ? void 0 : hex2;
}
function formatBackgroundColorFormValue(parts) {
  if (parts.gradientColor) {
    return parts.solidColor ? "".concat(parts.gradientColor, ", ").concat(parts.solidColor) : parts.gradientColor;
  }
  return parts.solidColor;
}
var DEFAULT_GRADIENT_ANGLE_MAX = 359;
var DEFAULT_LINEAR_GRADIENT_ANGLE = 180;
function isCssGradient(value) {
  return /gradient\s*\(/i.test(value.trim());
}
function isRadialCssGradient(value) {
  return /radial-gradient\s*\(/i.test(value.trim());
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
function splitTopLevelCsv(value) {
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
      if (current.trim()) {
        parts.push(current.trim());
      }
      current = "";
      continue;
    }
  }
  if (current.trim()) {
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
function extractGradientCallContent(css, gradientName) {
  const pattern = new RegExp("".concat(gradientName, "\\s*\\("), "i");
  const match = pattern.exec(css);
  if (!match) {
    return null;
  }
  const range = scanCssFunctionCall(css, match);
  return range ? css.slice(range.contentStart, range.end - 1).trim() : null;
}
function getGradientCallRange(css) {
  const value = css.trim();
  const match = /^(?:(?:repeating-)?(?:linear|radial|conic))-gradient\s*\(/i.exec(value);
  return match ? scanCssFunctionCall(value, match) : null;
}
function isTopLevelCssGradient(value) {
  const trimmedValue = value.trim();
  const range = getGradientCallRange(trimmedValue);
  if (!range || range.start !== 0) {
    return false;
  }
  const trailing = trimmedValue.slice(range.end).trim();
  return !trailing || /^!\s*important$/i.test(trailing);
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
function normalizeCssColorVarOrMergeTag(value, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  if (typeof value === "string" && isMergeTagColorToken(value, colorMergeTagValues)) {
    return value;
  }
  const normalizedValue = clearColor(value);
  if (!normalizedValue) {
    return void 0;
  }
  return isCssColorOrVar(normalizedValue) || isMergeTagColorToken(normalizedValue, colorMergeTagValues) ? normalizedValue : void 0;
}
function normalizeBackgroundSolidColorValue(value, hasGradientColor = false, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  if (hasGradientColor) {
    return normalizeCssColorVarOrMergeTag(value, colorMergeTagValues);
  }
  return normalizeCopilotDocumentStateColorValue(value, { allowTransparent: true }, colorMergeTagValues) ?? normalizeCssColorVarOrMergeTag(value, colorMergeTagValues);
}
function normalizeColorToOpaqueHex(value) {
  const normalizedValue = clearColor(value);
  if (!normalizedValue) {
    return void 0;
  }
  const parsedColor = tinycolor(normalizedValue);
  if (!parsedColor.isValid() || parsedColor.getAlpha() === 0) {
    return void 0;
  }
  return parsedColor.toHexString().toLowerCase();
}
function isOpaqueCssColor(value) {
  const normalizedValue = clearColor(value);
  if (!normalizedValue) {
    return false;
  }
  const parsedColor = tinycolor(normalizedValue);
  return parsedColor.isValid() && parsedColor.getAlpha() === 1;
}
function resolveGradientSolidFallback(parsedSolidColor, storedSolidColor, materializedDefault, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  const parsedSolid = normalizeCssColorVarOrMergeTag(parsedSolidColor, colorMergeTagValues);
  const storedSolid = normalizeCssColorVarOrMergeTag(storedSolidColor, colorMergeTagValues);
  if (!storedSolid) {
    return parsedSolid;
  }
  if (!parsedSolid) {
    return storedSolid;
  }
  const defaultSolid = normalizeCssColorVarOrMergeTag(materializedDefault, colorMergeTagValues);
  const storedIsMaterializedDefault = !!defaultSolid && (storedSolid === defaultSolid || tinycolor(storedSolid).isValid() && tinycolor(defaultSolid).isValid() && areColorsEqual(storedSolid, defaultSolid));
  return storedIsMaterializedDefault ? parsedSolid : storedSolid;
}
function extractColorFromStopPart(part) {
  const trimmedPart = part.trim();
  if (!trimmedPart) {
    return void 0;
  }
  const percentMatch = trimmedPart.match(/(-?\d+(?:\.\d+)?)\s*%?\s*$/);
  const colorPart = percentMatch ? trimmedPart.slice(0, percentMatch.index).trim() : trimmedPart;
  if (isCssColorOrVar(colorPart)) {
    return colorPart;
  }
  return void 0;
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
function extractFirstGradientStopColor(gradientCss) {
  const value = gradientCss.trim();
  const range = getGradientCallRange(value);
  if (!range) {
    return void 0;
  }
  const content = value.slice(range.contentStart, range.end - 1);
  for (const part of splitTopLevelCsv(content)) {
    const color = extractColorFromStopPart(part);
    if (color) {
      return color;
    }
  }
  return void 0;
}
function resolveBackgroundPartsWithAuthoredFallback(color) {
  const value = color?.trim();
  if (!value) {
    return {
      solidColor: void 0,
      gradientColor: void 0,
      authoredSolidColor: void 0
    };
  }
  if (!isCssGradient(value)) {
    return {
      solidColor: value,
      gradientColor: void 0,
      authoredSolidColor: void 0
    };
  }
  const range = getGradientCallRange(value);
  if (!range) {
    return {
      solidColor: void 0,
      gradientColor: value,
      authoredSolidColor: void 0
    };
  }
  const gradientCall = value.slice(range.start, range.end).trim();
  let gradientColor = gradientCall;
  const trailing = value.slice(range.end).trim();
  let solidColor;
  let authoredSolidColor;
  if (trailing.startsWith(",")) {
    const layeredSolid = trailing.slice(1).trim();
    if (layeredSolid && isValidGradientSolidFallback(layeredSolid)) {
      solidColor = layeredSolid;
      authoredSolidColor = layeredSolid;
    } else {
      gradientColor = value;
    }
  } else if (trailing) {
    gradientColor = value;
  }
  if (!solidColor) {
    solidColor = extractFirstGradientStopColor(gradientCall);
  }
  return { solidColor, gradientColor, authoredSolidColor };
}
function resolveBackgroundParts(color) {
  const { solidColor, gradientColor } = resolveBackgroundPartsWithAuthoredFallback(color);
  return { solidColor, gradientColor };
}
function extractAuthoredGradientSolidFallback(color) {
  return resolveBackgroundPartsWithAuthoredFallback(color).authoredSolidColor;
}
function normalizeBackgroundColorFormValue(value, explicitSolidFallback) {
  const { gradientColor, solidColor, authoredSolidColor } = resolveBackgroundPartsWithAuthoredFallback(value);
  const normalizeRgbTokens = (cssValue) => cssValue?.replace(
    /rgb\(\d+,\s*\d+,\s*\d+\)/gi,
    (token) => rgb2hex(token)?.toLowerCase() ?? token
  );
  const normalizedSolid = normalizeRgbTokens(explicitSolidFallback ?? authoredSolidColor);
  return formatBackgroundColorFormValue({
    gradientColor: normalizeRgbTokens(gradientColor),
    solidColor: gradientColor ? normalizedSolid : normalizeRgbTokens(solidColor)
  });
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
function getContrastRatio(foreground, background) {
  return Number(
    tinycolor.readability(foreground, background).toFixed(3)
  );
}
function getReadableTextColorForA11y(bgColor, currentTextColor, opts = {}) {
  const {
    level = "AA",
    size = "small"
  } = opts;
  const bg = tinycolor(bgColor);
  if (!bg.isValid()) {
    throw new Error("Invalid background color");
  }
  const minRatio = getMinRatio(level, size);
  const cur = currentTextColor !== void 0 && tinycolor(currentTextColor).isValid() ? tinycolor(currentTextColor) : null;
  if (cur && passes(bg, cur, minRatio)) {
    return cur.toHexString();
  }
  const bestReadable = tinycolor.mostReadable(bg, ["#000", "#fff"], {
    level,
    size,
    includeFallbackColors: true
  });
  return bestReadable.toHexString();
}
function fixTextColorForA11yRandom(bgColor, currentTextColor, opts = {}) {
  const {
    level = "AA",
    size = "small",
    maxRandomStep = 1.2,
    attempts = 6
  } = opts;
  const bg = tinycolor(bgColor);
  if (!bg.isValid()) {
    throw new Error("Invalid background color");
  }
  const minRatio = getMinRatio(level, size);
  const cur = currentTextColor !== void 0 && tinycolor(currentTextColor).isValid() ? tinycolor(currentTextColor) : null;
  let base = null;
  if (cur && passes(bg, cur, minRatio)) {
    base = cur;
  } else if (cur) {
    const adjusted = adjustLightnessToMeetContrast(bg, cur, minRatio);
    if (adjusted && passes(bg, adjusted, minRatio)) {
      base = adjusted;
    }
  }
  if (!base) {
    base = tinycolor(getReadableTextColorForA11y(bgColor, currentTextColor, { level, size }));
  }
  for (let i = 0; i < attempts; i++) {
    const candidates = randomNudgeAroundBase(bg, base, maxRandomStep);
    for (const candidate of candidates) {
      if (!sameColor(base, candidate) && passes(bg, candidate, minRatio)) {
        return candidate.toHexString();
      }
    }
  }
  return base.toHexString();
}

export {
  TRANSPARENT,
  clearColor,
  isTransparentColor,
  isDark,
  areColorsEqual,
  colorToHsv,
  hex,
  hex2rgb,
  rgb2hsl,
  invertRGB,
  hsvToHex,
  hslToHex,
  rgb2hex,
  rgbSequence2hex,
  colorToRGBSequence,
  transformColorToSystem,
  colorToHexString,
  colorToHsl,
  isColorValid,
  isHex,
  transformColorToHoverColor,
  invertColor,
  getContrastedHoveredFontColor,
  isHexColor,
  getColorFormat,
  isSameHexColor,
  isUsableColor,
  normalizeColorToHex,
  normalizeColorForUpdate,
  formatBackgroundColorFormValue,
  isCssGradient,
  isRadialCssGradient,
  clampGradientPercent,
  clampGradientOpacity,
  normalizeGradientAngle,
  splitTopLevelCsv,
  extractGradientCallContent,
  isTopLevelCssGradient,
  isMergeTagColorToken,
  normalizeCssColorOrVar,
  normalizeCssColorVarOrMergeTag,
  normalizeBackgroundSolidColorValue,
  normalizeColorToOpaqueHex,
  isOpaqueCssColor,
  resolveGradientSolidFallback,
  parseCssGradient,
  isEditableCssGradient,
  extractFirstGradientStopColor,
  resolveBackgroundParts,
  extractAuthoredGradientSolidFallback,
  normalizeBackgroundColorFormValue,
  normalizeCopilotDocumentStateColorValue,
  getContrastRatio,
  getReadableTextColorForA11y,
  fixTextColorForA11yRandom
};

// convo-email-agent/src/sdk/validator/colors.ts
var UNIT = "(?:[-\\+]?\\d*\\.\\d+%?)|(?:[-\\+]?\\d+%?)";
var MATCH3 = "[\\s|\\(]+(".concat(UNIT, ")[,|\\s]+(").concat(UNIT, ")[,|\\s]+(").concat(UNIT, ")\\s*\\)?");
var MATCH4 = "[\\s|\\(]+(".concat(UNIT, ")[,|\\s]+(").concat(UNIT, ")[,|\\s]+(").concat(UNIT, ")[,|\\s]+(").concat(UNIT, ")\\s*\\)?");
var FUNCTIONS = ["rgb", "hsl", "hsv"].flatMap((name) => [
  { pattern: new RegExp("".concat(name).concat(MATCH3)), alpha: false },
  { pattern: new RegExp("".concat(name, "a").concat(MATCH4)), alpha: true }
]);
var HEX = /^#?(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/;
var NAMED_COLORS = new Set("aliceblue antiquewhite aqua aquamarine azure beige bisque black blanchedalmond blue blueviolet brown burlywood burntsienna cadetblue chartreuse chocolate coral cornflowerblue cornsilk crimson cyan darkblue darkcyan darkgoldenrod darkgray darkgreen darkgrey darkkhaki darkmagenta darkolivegreen darkorange darkorchid darkred darksalmon darkseagreen darkslateblue darkslategray darkslategrey darkturquoise darkviolet deeppink deepskyblue dimgray dimgrey dodgerblue firebrick floralwhite forestgreen fuchsia gainsboro ghostwhite gold goldenrod gray grey green greenyellow honeydew hotpink indianred indigo ivory khaki lavender lavenderblush lawngreen lemonchiffon lightblue lightcoral lightcyan lightgoldenrodyellow lightgray lightgreen lightgrey lightpink lightsalmon lightseagreen lightskyblue lightslategray lightslategrey lightsteelblue lightyellow lime limegreen linen magenta maroon mediumaquamarine mediumblue mediumorchid mediumpurple mediumseagreen mediumslateblue mediumspringgreen mediumturquoise mediumvioletred midnightblue mintcream mistyrose moccasin navajowhite navy oldlace olive olivedrab orange orangered orchid palegoldenrod palegreen paleturquoise palevioletred papayawhip peachpuff peru pink plum powderblue purple rebeccapurple red rosybrown royalblue saddlebrown salmon sandybrown seagreen seashell sienna silver skyblue slateblue slategray slategrey snow springgreen steelblue tan teal thistle tomato turquoise violet wheat white whitesmoke yellow yellowgreen".split(" "));
function clean(value) {
  return value.replace("!important", "").replace("/", " ").replace(/\s*\(\s*/, "(").replace(/\s*\)\s*/, ")").replace(/\s\s+/g, " ").trim();
}
function parse(value) {
  const once = clean(value);
  const transparent = read(clean(once)).transparent;
  return { valid: transparent || read(once).valid, transparent };
}
function read(color) {
  const lower = color.toLowerCase();
  if (!lower) return { valid: false, transparent: false };
  if (lower === "transparent") return { valid: true, transparent: true };
  if (NAMED_COLORS.has(lower)) return { valid: true, transparent: false };
  const long = color.length > (color.startsWith("#") ? 5 : 4);
  if (HEX.test(lower)) {
    const digits = lower.replace("#", "");
    return { valid: true, transparent: long && digits.length === 8 && digits.endsWith("00") };
  }
  const layered = /gradient\s*\(/i.test(color) || splitLayers(color).filter(Boolean).length > 1;
  for (const { pattern, alpha } of FUNCTIONS) {
    const match = pattern.exec(lower);
    if (match) return { valid: true, transparent: !layered && long && alpha && Number.parseFloat(match[4]) === 0 };
  }
  return { valid: false, transparent: false };
}
function isEditorColor(value, allowTransparent) {
  const parsed = parse(value);
  return parsed.valid && (allowTransparent || !parsed.transparent);
}
var DYNAMIC = /\b(?:var\s*\(|currentcolor\b)/i;
var GRADIENT_LAYER = /^(?:(?:repeating-)?(?:linear|radial|conic))-gradient\s*\(/i;
var SYSTEM_COLORS = new Set("accentcolor accentcolortext activeborder activecaption activetext appworkspace background buttonborder buttonface buttonhighlight buttonshadow buttontext canvas canvastext captiontext field fieldtext graytext highlight highlighttext inactiveborder inactivecaption inactivecaptiontext infobackground infotext linktext mark marktext menu menutext scrollbar selecteditem selecteditemtext threeddarkshadow threedface threedhighlight threedlightshadow threedshadow visitedtext window windowframe windowtext".split(" "));
function maskComments(value) {
  if (!value.includes("/*")) return value;
  let result = "", quote = "";
  for (let index = 0; index < value.length; index++) {
    const char = value[index];
    if (char === "\\") {
      result += value.slice(index, index + 2);
      index++;
      continue;
    }
    if (!quote && value.startsWith("/*", index)) {
      const end = value.indexOf("*/", index + 2);
      if (end < 0) return void 0;
      result += " ".repeat(end + 2 - index);
      index = end + 1;
      continue;
    }
    result += char;
    if (quote) {
      if (char === quote) quote = "";
    } else if (char === '"' || char === "'") quote = char;
  }
  return result;
}
function isRuntimeDependent(raw) {
  const value = raw.trim().replace(/\s*!\s*important\s*$/i, "").trim();
  if (DYNAMIC.test(value)) return true;
  for (const [, word, call] of (maskComments(value) ?? value).matchAll(/([^\s,/()'"]+)(\()?/g)) {
    const name = word.toLowerCase();
    if (call ? name === "light-dark" : SYSTEM_COLORS.has(name) || name.startsWith("-")) return true;
  }
  return false;
}
var UNMODELED_SYNTAX = /['"\\]/;
function isColorFunction(syntax) {
  const open = /^(?:rgba?|hsla?)\s*\(/i.exec(syntax)?.[0].length;
  if (open === void 0) return false;
  let depth = 1;
  for (let index = open; index < syntax.length; index++) {
    if (syntax[index] === "(") depth++;
    else if (syntax[index] === ")" && --depth === 0) return index === syntax.length - 1;
  }
  return false;
}
function isStaticThemeColor(value, allowTransparent) {
  const trimmed = value.trim();
  if (UNMODELED_SYNTAX.test(trimmed)) return true;
  if (isRuntimeDependent(trimmed) || GRADIENT_LAYER.test(trimmed)) return false;
  const syntax = maskComments(trimmed)?.trim();
  if (syntax === void 0) return false;
  const shape = /^(?:#[\da-f]{3,4}|#[\da-f]{6}|#[\da-f]{8}|[a-z]+)$/i.test(syntax) || isColorFunction(syntax);
  return shape && isEditorColor(trimmed, allowTransparent);
}
function splitLayers(value) {
  const layers = [];
  let depth = 0, quote = "", comment = false, start = 0;
  for (let index = 0; index < value.length; index++) {
    const char = value[index];
    if (comment) {
      if (char === "*" && value[index + 1] === "/") {
        index++;
        comment = false;
      }
      continue;
    }
    if (quote) {
      if (char === "\\") index++;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === "/" && value[index + 1] === "*") {
      index++;
      comment = true;
    } else if (char === '"' || char === "'") quote = char;
    else if (char === "\\") index++;
    else if (char === "(") depth++;
    else if (char === ")") depth--;
    else if (char === "," && depth === 0) {
      layers.push(value.slice(start, index).trim());
      start = index + 1;
    }
  }
  layers.push(value.slice(start).trim());
  return layers;
}
function isThemeBackground(value) {
  if (UNMODELED_SYNTAX.test(value)) return true;
  if (maskComments(value) === void 0) return false;
  const layers = splitLayers(value);
  if (layers.some((layer) => !layer)) return false;
  if (layers.length === 1) return isStaticThemeColor(layers[0], true);
  return layers.length === 2 && GRADIENT_LAYER.test(layers[0]) && !isRuntimeDependent(layers[0]) && isStaticThemeColor(layers[1], true);
}

export {
  isEditorColor,
  isStaticThemeColor,
  isThemeBackground
};

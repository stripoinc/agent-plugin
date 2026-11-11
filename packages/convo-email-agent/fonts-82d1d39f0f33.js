// convo-email-agent/src/sdk/validator/fonts.ts
function canonicalFontValue(fontValue) {
  if (!fontValue) return fontValue;
  return fontValue.replace(/,\s*/g, ",").replace(/('|"|;)/g, "").toLowerCase();
}
function isAbsoluteHttpUrl(value) {
  try {
    const url = new URL(value);
    return (url.protocol === "http:" || url.protocol === "https:") && Boolean(url.hostname);
  } catch {
    return false;
  }
}
function isFontConnectionUrl(value) {
  return /^https?:\/\//i.test(value) && !/[\s\\]/.test(value) && isAbsoluteHttpUrl(value);
}
var CssSyntaxError = class extends Error {
};
function skipGroup(css, start) {
  const char = css[start];
  if (char === "\\") return Math.min(start + 2, css.length);
  if (char === '"' || char === "'") {
    for (let index = start + 1; index < css.length; index++) {
      if (css[index] === "\\") index++;
      else if (css[index] === char) return index + 1;
    }
    throw new CssSyntaxError("Unclosed string");
  }
  if (css.startsWith("/*", start)) {
    const end = css.indexOf("*/", start + 2);
    if (end < 0) throw new CssSyntaxError("Unclosed comment");
    return end + 2;
  }
  if (char === "(") {
    let depth = 0;
    for (let index = start; index < css.length; ) {
      const current = css[index];
      if (current === "\\") {
        index += 2;
        continue;
      }
      if ((current === '"' || current === "'") && /[(,\s]/.test(css[index - 1])) {
        index = skipGroup(css, index);
        continue;
      }
      if (current === "(") depth++;
      else if (current === ")" && --depth === 0) return index + 1;
      index++;
    }
    throw new CssSyntaxError("Unclosed bracket");
  }
  return start + 1;
}
function hasTopLevel(text, chars) {
  for (let index = 0; index < text.length; index = skipGroup(text, index)) if (chars.includes(text[index])) return true;
  return false;
}
function stripComments(text) {
  let result = "";
  for (let index = 0; index < text.length; ) {
    const next = skipGroup(text, index);
    if (!text.startsWith("/*", index)) result += text.slice(index, next);
    index = next;
  }
  return result;
}
function parseTopLevel(css) {
  const nodes = [];
  let index = 0;
  while (index < css.length) {
    if (/[\s;]/.test(css[index])) {
      index++;
      continue;
    }
    if (css.startsWith("/*", index)) {
      index = skipGroup(css, index);
      nodes.push({ kind: "comment" });
      continue;
    }
    if (css[index] === "}") throw new CssSyntaxError("Unexpected }");
    const start = index;
    let open = -1;
    while (index < css.length && css[index] !== ";" && css[index] !== "{") {
      if (css[index] === "}") throw new CssSyntaxError("Unexpected }");
      index = skipGroup(css, index);
    }
    if (css[index] === "{") {
      open = index;
      let depth = 0;
      for (; index < css.length; index = skipGroup(css, index)) {
        if (css[index] === "{") depth++;
        else if (css[index] === "}" && --depth === 0) break;
      }
      if (depth !== 0) throw new CssSyntaxError("Unclosed block");
    }
    const prelude = stripComments(css.slice(start, open < 0 ? index : open));
    index++;
    const atRule = /^@([^\s{;(/'"]+)\s*([\s\S]*?)\s*$/.exec(prelude);
    if (!atRule && open < 0 && !prelude.includes(":")) throw new CssSyntaxError("Unknown word");
    nodes.push(atRule ? { kind: "atRule", name: atRule[1], params: atRule[2], ...open < 0 ? {} : { body: css.slice(open + 1, index - 1) } } : { kind: "other" });
  }
  return nodes;
}
function declarations(body) {
  const parts = [];
  let start = 0;
  for (let index = 0; index < body.length; index = skipGroup(body, index)) {
    if (body[index] === ";") {
      parts.push(body.slice(start, index));
      start = index + 1;
    }
  }
  parts.push(body.slice(start));
  return parts.map((part) => stripComments(part).trim()).filter(Boolean);
}
function fontFaceCssError(css) {
  let nodes;
  try {
    nodes = parseTopLevel(css);
  } catch (error) {
    if (error instanceof CssSyntaxError) return "Invalid font-face CSS syntax.";
    throw error;
  }
  const flat = nodes.flatMap((node) => node.kind === "atRule" && node.body !== void 0 && !hasTopLevel(node.body, "{}") ? [node.body] : []);
  if (flat.some((body) => declarations(body).some((part) => !part.includes(":")))) return "Invalid font-face CSS syntax.";
  const faces = nodes.filter((node) => node.kind === "atRule" && node.name.toLowerCase() === "font-face");
  if (!faces.length) return "Expected at least one top-level @font-face rule.";
  if (nodes.some((node) => node.kind !== "comment" && !faces.includes(node))) return "Only top-level @font-face rules and comments are supported.";
  for (const face of faces) {
    if (face.kind !== "atRule" || face.body === void 0 || face.params || hasTopLevel(face.body, "{}")) {
      return "Expected @font-face declarations without nested rules.";
    }
    for (const declaration of declarations(face.body)) {
      const colon = declaration.indexOf(":");
      const property = declaration.slice(0, colon).trim(), value = declaration.slice(colon + 1).trim();
      for (const match of value.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi)) {
        const url = match[1] ?? match[2] ?? match[3];
        if (!url || url.includes("\\") || !url.startsWith("data:") && !isFontConnectionUrl(url)) {
          return "Font CSS url() must contain an absolute HTTP/HTTPS or data: URL.";
        }
      }
      if (property.toLowerCase() === "src" && value.includes("\\")) return "Escaped font source URLs are not supported.";
    }
  }
  return void 0;
}
function fontResourceIssues(resources) {
  const issues = [];
  const keys = /* @__PURE__ */ new Set();
  resources.forEach((resource, index) => {
    const entry = resource;
    const add = (field, message) => {
      issues.push({ path: [index, field], message });
    };
    const key = canonicalFontValue(entry.fontFamily.trim());
    if (!key || /[;{}]/.test(entry.fontFamily)) add("fontFamily", "Expected a nonempty CSS font-family value.");
    if (keys.has(key)) add("fontFamily", "Duplicate normalized font-family resource key.");
    keys.add(key);
    if (entry.url !== void 0 && !isFontConnectionUrl(entry.url)) add("url", "Expected an absolute HTTP/HTTPS URL.");
    if (entry.importMethod === "fontFace") {
      const error = fontFaceCssError(entry.css ?? "");
      if (error) add("css", error);
    }
  });
  return issues;
}
var FONT_FAMILY_DECLARATION = /font-family\s*:\s*([^;{}<"]+)/gi;
var FONT_FACE_ATTRIBUTE = /<font[^>]*\sface\s*=\s*["']([^"']+)["']/gi;
var FONT_FAMILY_ATTRIBUTE = /\sfont-family\s*=\s*"([^"]+)"/gi;
var QUOTE_ENTITY = /&(?:quot|apos|#0*34|#0*39);/gi;
function declarationValue(raw) {
  try {
    if (hasTopLevel(raw, "{}")) return raw;
    const [first, ...rest] = declarations("x:".concat(raw));
    if (rest.some((part) => !part.includes(":"))) return raw;
    return (first ?? "x:").slice(2).replace(/\s*!\s*important\s*$/i, "").trim();
  } catch {
    return raw;
  }
}
function collectUsedFontValues(html, declaredValues = []) {
  const body = html ? html.replace(QUOTE_ENTITY, "") : "";
  const declared = body ? [
    ...Array.from(body.matchAll(FONT_FAMILY_DECLARATION)),
    ...Array.from(body.matchAll(FONT_FACE_ATTRIBUTE)),
    ...Array.from(body.matchAll(FONT_FAMILY_ATTRIBUTE))
  ].map((match) => (match[1] || "").trim()) : [];
  const values = [...declared, ...declaredValues].map((value) => canonicalFontValue(declarationValue(String(value ?? "").trim())));
  return [...new Set(values.filter(Boolean))];
}

export {
  canonicalFontValue,
  fontResourceIssues,
  collectUsedFontValues
};

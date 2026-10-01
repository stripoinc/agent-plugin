import {SaxesParser} from "saxes";

// Mirrors Python `SVG_DANGEROUS_PATTERNS`. The `.pattern` attribute on each
// regex is surfaced verbatim in the warning string, exactly like Python's
// `pattern.pattern`.
export const SVG_DANGEROUS_PATTERNS = [
  {
    source : "<\\s*(?:[a-z_][\\w.-]*:)?script\\b",
    regex : /<\s*(?:[a-z_][\w.-]*:)?script\b/i,
  },
  {source : "\\bon\\w+\\s*=", regex : /\bon\w+\s*=/i},
  {source : "javascript\\s*:", regex : /javascript\s*:/i},
  {
    source : "<\\s*(?:[a-z_][\\w.-]*:)?iframe\\b",
    regex : /<\s*(?:[a-z_][\w.-]*:)?iframe\b/i,
  },
  // `@import` inside an SVG's own `<style>` pulls a remote stylesheet at RENDER
  // time, and `<foreignObject>` re-opens the full HTML parser inside the image.
  // Added while the consumer set is still small (the inline-`<svg>` capture is
  // the first producer that can hand us markup a page author wrote for a page
  // rather than for a logo file).
  {source : "@import", regex : /@import/i},
  {
    source : "<\\s*(?:[a-z_][\\w.-]*:)?foreignObject\\b",
    regex : /<\s*(?:[a-z_][\w.-]*:)?foreignobject\b/i,
  },
  {
    source : "<\\s*(?:[a-z_][\\w.-]*:)?meta\\b",
    regex : /<\s*(?:[a-z_][\w.-]*:)?meta\b/i,
  },
  {
    source :
        "xmlns(?:\\s*:\\s*[a-z_][\\w.-]*)?\\s*=\\s*[\\x22\\x27]http://www\\.w3\\.org/1999/xhtml[\\x22\\x27]",
    regex :
        /xmlns(?:\s*:\s*[a-z_][\w.-]*)?\s*=\s*[\x22\x27]http:\/\/www\.w3\.org\/1999\/xhtml[\x22\x27]/i,
  },
  {
    source :
        "(?<![\\w.-])(?:href|xlink:href)\\s*=\\s*(?:\\x22(?!#)|\\x27(?!#)|(?![\\x22\\x27#]))",
    regex :
        /(?<![\w.-])(?:href|xlink:href)\s*=\s*(?:\x22(?!#)|\x27(?!#)|(?![\x22\x27#]))/i,
  },
  {
    source :
        "(?<![\\w.-])(?:[a-z_][\\w.-]*:)?(?:src|srcset|data|poster|background)\\s*=\\s*(?:\\x22(?!#)|\\x27(?!#)|(?![\\x22\\x27#]))",
    regex :
        /(?<![\w.-])(?:[a-z_][\w.-]*:)?(?:src|srcset|data|poster|background)\s*=\s*(?:\x22(?!#)|\x27(?!#)|(?![\x22\x27#]))/i,
  },
  {
    source : "\\burl\\s*\\(\\s*(?:\\x22(?!#)|\\x27(?!#)|(?![\\x22\\x27#]))",
    regex : /\burl\s*\(\s*(?:\x22(?!#)|\x27(?!#)|(?![\x22\x27#]))/i,
  },
  {source : "\\\\", regex : /\\/},
  {
    source : "&(?:#(?:x[0-9a-f]+|[0-9]+)|[a-z][a-z0-9]+);",
    regex : /&(?:#(?:x[0-9a-f]+|[0-9]+)|[a-z][a-z0-9]+);/i,
  },
  {source : "&#", regex : /&#/},
  {
    source : "<\\s*(?:[a-z_][\\w.-]*:)?animate",
    regex : /<\s*(?:[a-z_][\w.-]*:)?animate/i,
  },
  {
    source : "<\\s*(?:[a-z_][\\w.-]*:)?set\\b",
    regex : /<\s*(?:[a-z_][\w.-]*:)?set\b/i,
  },
  {
    source : "(?:-webkit-)?image-set\\s*\\(",
    regex : /(?:-webkit-)?image-set\s*\(/i,
  },
];

const SVG_XML_NAMED_REFERENCES = new Map([
  [ "amp", "&" ],
  [ "lt", "<" ],
  [ "gt", ">" ],
  [ "quot", '"' ],
  [ "apos", "'" ],
]);
const SVG_CHARACTER_REFERENCE_RE =
    /&#(?:x([0-9a-f]+)|([0-9]+));|&([a-z][a-z0-9]+);/gi;

export function canonicalizeSvgForSafetyScan(svg) {
  if (typeof svg !== "string")
    return "";
  let canonical = svg;
  for (let pass = 0; pass < 8; pass += 1) {
    const decoded = canonical.replace(
        SVG_CHARACTER_REFERENCE_RE,
        (whole, hexadecimal, decimal, named) => {
          if (named !== undefined) {
            return SVG_XML_NAMED_REFERENCES.get(named.toLowerCase()) ?? whole;
          }
          const codepoint = Number.parseInt(
              hexadecimal ?? decimal,
              hexadecimal !== undefined ? 16 : 10,
          );
          if (!Number.isInteger(codepoint) || codepoint > 0x10ffff ||
              (codepoint >= 0xd800 && codepoint <= 0xdfff)) {
            return whole;
          }
          return String.fromCodePoint(codepoint);
        },
    );
    if (decoded === canonical)
      break;
    canonical = decoded;
  }
  return canonical;
}

const SVG_FRAGMENT_WRAPPER_START =
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
const SVG_ASCII_XML_NAME_RE = /^[A-Za-z_][A-Za-z0-9_.:-]*$/;

export function svgInnerMarkupIsUnsafe(svg) {
  if (typeof svg !== "string")
    return true;
  let failed = false;
  let unsafeHtmlEmbedding = false;
  const openElements = [];
  const parser = new SaxesParser({xmlns : false});
  parser.on("error", () => { failed = true; });
  parser.on("opentag", (tag) => {
    if (openElements.some((name) => name === "title" || name === "desc")) {
      unsafeHtmlEmbedding = true;
    }
    if (!SVG_ASCII_XML_NAME_RE.test(tag.name) ||
        Object.keys(tag.attributes)
            .some((name) => !SVG_ASCII_XML_NAME_RE.test(name))) {
      failed = true;
    }
    openElements.push(tag.name.toLowerCase());
  });
  parser.on("closetag", () => { openElements.pop(); });
  parser.on("processinginstruction", () => { unsafeHtmlEmbedding = true; });
  parser.on("cdata", () => {
    if (openElements.some((name) => name === "title" || name === "desc")) {
      unsafeHtmlEmbedding = true;
    }
  });
  try {
    parser.write(`${SVG_FRAGMENT_WRAPPER_START}${svg}</svg>`).close();
  } catch {
    return true;
  }
  return failed || unsafeHtmlEmbedding;
}

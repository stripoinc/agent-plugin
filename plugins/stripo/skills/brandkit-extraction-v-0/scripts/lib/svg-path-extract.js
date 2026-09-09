// THE SVG-markup reducer. One definition, two producers:
//
//   - `scripts/extract-svg-path.js` — the agent-facing CLI, which reads a
//     local `.svg` file and prints the payload to stdout;
//   - `scripts/lib/logo-asset-capture.js` — the render-time capture path,
//     which turns bytes the browser already downloaded into a
//     `*.svgpath.json` sidecar of the SAME shape.
//
// Lifted out of `extract-svg-path.js` verbatim so the two producers cannot
// drift. The stdout contract of the CLI (`{svgFile, svgPath, pathCount,
// shapes, shapeCount}`) is depended on by SKILL.md, `references/
// tool-contracts.md`, and the `*.svgpath.json` file convention in
// `lib/load-logo-svg-paths.js` — do not reshape the return value.

// Shape elements the reducer recognises. Matches both the self-closing form
// and the open/close pair (the `\2` backreference names the captured tag).
const SVG_SHAPE_RE =
  /<(path|rect|circle|ellipse|line|polyline|polygon)\b[^>]*\/>|<(path|rect|circle|ellipse|line|polyline|polygon)\b[^>]*>[\s\S]*?<\/\2>/gi;

// GREEDY on purpose. A NESTED `<svg>` is legal and load-bearing — it is how a
// `<use>` on a viewBox'd `<symbol>` reproduces its nested viewport, which is
// what the inline capture emits — and a non-greedy body stopped at the FIRST
// `</svg>`, truncating the document at the inner element: the reduced markup
// lost every shape after it (typically the wordmark) and left the inner `<svg>`
// unclosed. Greedy takes the LAST `</svg>`, which for a single-root SVG
// document is the root's own.
const SVG_ROOT_RE = /<svg\b[^>]*>([\s\S]*)<\/svg>/i;

// Screening for the "200 OK with an HTML error page" answer some CDNs give to
// an image request (Cloudflare / Fastly interstitials, Shopify's 404 page,
// hotlink-protection walls). Without this the reducer happily produces a
// `svgPath` out of whatever `<path>`-looking markup an error page contains.
//
// Two conditions, both required:
//   1. the payload must not open as an HTML document;
//   2. it must contain an `<svg` root element.
//
// Gzipped `.svgz` bytes fail (1) trivially and (2) definitively — they are
// binary — so they degrade to `svgPath: ""`, which is today's behaviour.
export function looksLikeSvgMarkup(markup) {
  if (typeof markup !== "string" || markup.length === 0) return false;
  // Strip a UTF-8 BOM plus leading whitespace, XML prolog, and doctype
  // before deciding what the document opens with.
  const head = markup.replace(/^﻿/, "").trimStart().slice(0, 2048).toLowerCase();
  if (head.startsWith("<!doctype html") || head.startsWith("<html")) return false;
  return /<svg[\s>]/i.test(markup);
}

// Reduce raw SVG markup to the canonical payload. `svgFile` is echoed back
// verbatim (the CLI passes the resolved local path; the capture path passes
// the sidecar's own `.svg` path) — the reducer never touches the filesystem.
export function svgPathPayloadFromMarkup(svg, { svgFile = "" } = {}) {
  const source = typeof svg === "string" ? svg : "";
  const svgInnerMarkup = source.match(SVG_ROOT_RE)?.[1]?.trim() ?? "";
  const shapeMatches = [...source.matchAll(SVG_SHAPE_RE)];

  const shapes = shapeMatches.map((match) => {
    const markup = match[0].trim();
    const tagMatch = markup.match(/^<([a-z0-9:-]+)/i);

    return {
      tag: tagMatch ? tagMatch[1].toLowerCase() : "",
      markup,
    };
  });

  return {
    svgFile,
    svgPath: svgInnerMarkup || shapes.map((shape) => shape.markup).join(" "),
    pathCount: shapes.filter((shape) => shape.tag === "path").length,
    shapes,
    shapeCount: shapes.length,
  };
}

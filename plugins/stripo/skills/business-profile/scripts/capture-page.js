import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { inspectElements } from "./inspect-elements.js";

const DEFAULT_MAX_CHARS = 24000;

export function captureRequest(filename, limits) {
  const options = { mode: "capture" };
  if (limits) options.limits = limits;
  const request = { function: `() => (${inspectElements.toString()})(${JSON.stringify(options)})` };
  if (filename) request.filename = filename;
  return request;
}

function parseTextPayload(text) {
  const candidates = [text.trim()];
  const resultSection = text.match(/### Result\s*\n([\s\S]*?)(?=\n### (?:Ran Playwright code|Page|Warning|Error)|$)/u);
  if (resultSection) candidates.push(resultSection[1].trim());
  for (const match of text.matchAll(/```(?:json)?\s*([\s\S]*?)```/gu)) candidates.push(match[1].trim());
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) candidates.push(text.slice(firstBrace, lastBrace + 1));
  for (const candidate of candidates) {
    if (!candidate) continue;
    try { return JSON.parse(candidate); } catch { /* try the next native wrapper shape */ }
  }
  return null;
}

export function unwrapCapture(value, depth = 0) {
  if (depth > 8 || value === null || value === undefined) return null;
  if (typeof value === "string") {
    const parsed = parseTextPayload(value);
    return parsed === null ? null : unwrapCapture(parsed, depth + 1);
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      const capture = unwrapCapture(item, depth + 1);
      if (capture) return capture;
    }
    return null;
  }
  if (typeof value !== "object") return null;
  if (value.schemaVersion === "brandkit-page-capture/v1") return value;
  for (const key of ["result", "structuredContent", "value", "data", "content", "text"]) {
    if (!(key in value)) continue;
    const capture = unwrapCapture(value[key], depth + 1);
    if (capture) return capture;
  }
  return null;
}

function clip(value, max = 160) {
  const text = String(value || "").replace(/\s+/gu, " ").trim();
  return text.length <= max ? text : `${text.slice(0, Math.max(0, max - 1))}…`;
}

function clipped(value, max = 160) {
  const original = String(value || "").replace(/\s+/gu, " ").trim();
  const text = clip(original, max);
  return { text, shownChars: Math.min(original.length, Math.max(0, max - (original.length > max ? 1 : 0))), totalChars: original.length, omittedChars: Math.max(0, original.length - text.replace(/…$/u, "").length) };
}

function balanced(rows, groupIds, limit) {
  if (!rows.length || limit <= 0) return [];
  const picked = [];
  const used = new Set();
  const firstByGroup = new Map();
  rows.forEach((row, index) => {
    if (!firstByGroup.has(row.groupId)) firstByGroup.set(row.groupId, index);
  });
  for (const groupId of groupIds) {
    const index = firstByGroup.get(groupId) ?? -1;
    if (index >= 0) { picked.push(rows[index]); used.add(index); }
    if (picked.length >= limit) return picked;
  }
  const remaining = Math.min(limit - picked.length, rows.length - used.size);
  for (let slot = 0; slot < remaining; slot += 1) {
    const target = remaining === 1 ? 0 : Math.floor(slot * (rows.length - 1) / (remaining - 1));
    let index = target;
    while (index < rows.length && used.has(index)) index += 1;
    if (index >= rows.length) {
      index = target;
      while (index >= 0 && used.has(index)) index -= 1;
    }
    if (index >= 0 && !used.has(index)) { picked.push(rows[index]); used.add(index); }
  }
  return picked;
}

function section(items, total) {
  return { shown: items.length, total, omitted: Math.max(0, total - items.length), items };
}

function settleRenderedChars(packet) {
  let size = 0;
  for (let attempt = 0; attempt < 6; attempt += 1) {
    packet.renderedChars = size;
    const next = JSON.stringify(packet).length;
    if (next === size) break;
    size = next;
  }
  packet.renderedChars = JSON.stringify(packet).length;
  return JSON.stringify(packet).length;
}

export function buildPreview(capture, artifact = null, maxChars = DEFAULT_MAX_CHARS) {
  if (!capture || capture.schemaVersion !== "brandkit-page-capture/v1") {
    throw new Error("Saved evaluation does not contain a brandkit-page-capture/v1 result.");
  }
  if (!Number.isSafeInteger(maxChars) || maxChars < 2000) throw new Error("maxChars must be an integer of at least 2000.");
  const groupIds = capture.groups.map((group) => group.landmarkId);
  const textByGroup = new Map();
  for (const row of capture.textOwners) {
    if (!textByGroup.has(row.groupId)) textByGroup.set(row.groupId, []);
    textByGroup.get(row.groupId).push(row);
  }
  const groupItems = capture.groups.map((group) => {
    const rows = textByGroup.get(group.landmarkId) || [];
    const examples = rows.length ? [...new Set([
      rows[0], rows[Math.floor((rows.length - 1) / 2)], rows[rows.length - 1],
    ])] : [];
    return {
      id: group.landmarkId,
      element: group.elementId || null,
      parent: group.parentLandmarkId || null,
      domOrder: group.domOrder ?? null,
      identity: [group.tag, group.role || null, group.id || null, clipped((group.classList || []).join(" "), 80)],
      coverage: group.coverage,
      counts: [group.elementCount, group.textOwnerCount, group.linkCount, group.imageCount],
      omitted: [group.omittedElementCount, group.omittedTextOwnerCount, group.omittedLinkCount, group.omittedImageCount],
      examples: examples.map((example) => ({
        ownerId: example.ownerId, styleId: example.styleId,
        painted: example.painted, rendered: example.rendered, text: clipped(example.text),
      })),
    };
  });
  const textSamples = balanced(capture.textOwners, groupIds, 32).map((row) => ({
    ownerId: row.ownerId, groupId: row.groupId, styleId: row.styleId,
    tag: row.tag, painted: row.painted, rendered: row.rendered, text: clipped(row.text),
  }));
  const textSourceByStyle = new Map();
  for (const row of capture.textOwners) if (!textSourceByStyle.has(row.styleId)) textSourceByStyle.set(row.styleId, row);
  const elementSourceByStyle = new Map();
  for (const row of capture.elements) if (!elementSourceByStyle.has(row.styleId)) elementSourceByStyle.set(row.styleId, row);
  const styleEntries = capture.styles.map((style) => {
    const source = textSourceByStyle.get(style.styleId) || elementSourceByStyle.get(style.styleId);
    return { style, source, groupId: source?.groupId || "document" };
  });
  const requiredStyleIds = new Set([
    ...groupItems.flatMap((group) => group.examples.map((example) => example.styleId)),
    ...textSamples.map((row) => row.styleId),
  ].filter(Boolean));
  const requiredStyles = styleEntries.filter((entry) => requiredStyleIds.has(entry.style.styleId));
  const remainingStyles = styleEntries.filter((entry) => !requiredStyleIds.has(entry.style.styleId));
  const selectedStyles = [...requiredStyles, ...balanced(remainingStyles, groupIds, Math.max(0, 32 - requiredStyles.length))];
  const styleSamples = selectedStyles.map(({ style, source }) => {
    const textSource = source && "text" in source;
    return {
      styleId: style.styleId,
      source: source ? {
        ownerId: textSource ? source.ownerId : source.captureId,
        groupId: source.groupId, tag: source.tag, rendered: source.rendered,
        painted: textSource ? source.painted : null,
        parentId: textSource ? undefined : source.parentId,
        box: source.box,
        classList: textSource ? undefined : source.classList,
        text: textSource ? clipped(source.text, 100) : null,
        svgPaint: textSource ? undefined : source.svgPaint,
      } : null,
      tuple: {
        color: style.color, backgroundColor: style.backgroundColor, backgroundImage: style.backgroundImage,
        fontFamily: style.fontFamily, fontSize: style.fontSize, fontWeight: style.fontWeight,
        fontStyle: style.fontStyle, lineHeight: style.lineHeight, letterSpacing: style.letterSpacing,
        textTransform: style.textTransform, textAlign: style.textAlign,
        textDecorationLine: style.textDecorationLine,
        padding: [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft],
        borders: {
          widths: [style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth],
          styles: [style.borderTopStyle, style.borderRightStyle, style.borderBottomStyle, style.borderLeftStyle],
          colors: [style.borderTopColor, style.borderRightColor, style.borderBottomColor, style.borderLeftColor],
        },
        radii: [style.borderTopLeftRadius, style.borderTopRightRadius, style.borderBottomRightRadius, style.borderBottomLeftRadius],
        boxShadow: style.boxShadow, opacity: style.opacity, visibility: style.visibility,
        contentVisibility: style.contentVisibility, display: style.display, position: style.position,
        size: [style.width, style.height, style.minWidth, style.maxWidth, style.boxSizing],
        overflow: [style.overflowX, style.overflowY],
        svg: [style.fill, style.stroke, style.strokeWidth],
      },
    };
  });
  const includedStyleIds = new Set(styleSamples.map((row) => row.styleId));
  for (const group of groupItems) {
    for (const example of group.examples) example.styleIncluded = includedStyleIds.has(example.styleId);
  }
  const elementSamples = balanced(capture.elements, groupIds, 24).map((row) => ({
    captureId: row.captureId, parentId: row.parentId, groupId: row.groupId, domOrder: row.domOrder,
    tag: row.tag, id: row.id, classList: row.classList, rendered: row.rendered,
    styleId: row.styleId, box: row.box, attributes: row.attributes, svgPaint: row.svgPaint,
  }));
  const linkSamples = balanced(capture.links, groupIds, 20).map((row) => ({
    ownerId: row.ownerId, groupId: row.groupId, href: row.href,
    text: clipped(row.visibleText || row.ariaLabel || row.title), rendered: row.rendered,
  }));
  const imageSamples = balanced(capture.images, groupIds, 16).map((row) => ({
    ownerId: row.ownerId, groupId: row.groupId, src: row.currentSrc || row.src,
    alt: clipped(row.alt || row.ariaLabel || row.title), complete: row.complete,
    natural: [row.naturalWidth, row.naturalHeight], rendered: row.rendered,
  }));
  const packet = {
    schemaVersion: "brandkit-page-capture-preview/v1",
    identityScope: capture.identityScope,
    artifact,
    maxChars,
    renderedChars: 0,
    withinBudget: true,
    incomplete: capture.incomplete,
    counts: capture.counts,
    locations: {
      elements: "elements[] by captureId or domOrder",
      textOwners: "textOwners[] by ownerId, groupId, or styleId",
      styles: "styles[] by styleId",
      links: "links[] by ownerId or groupId",
      images: "images[] by ownerId or groupId",
      groups: "groups[] by landmarkId",
    },
    preview: {
      page: capture.page,
      limitations: capture.limitations,
      groups: section(groupItems, 1 + capture.counts.observedLandmarks),
      elements: section(elementSamples, capture.counts.visitedElements),
      styles: section(styleSamples, capture.styles.length),
      textOwners: section(textSamples, capture.counts.observedTextOwners),
      links: section(linkSamples, capture.counts.observedLinks),
      images: section(imageSamples, capture.counts.observedImages),
    },
  };
  const optionalSections = [packet.preview.elements, packet.preview.styles, packet.preview.textOwners, packet.preview.links, packet.preview.images];
  const refreshStyleFlags = () => {
    const retainedStyleIds = new Set(packet.preview.styles.items.map((row) => row.styleId));
    for (const group of packet.preview.groups.items) {
      for (const example of group.examples) example.styleIncluded = retainedStyleIds.has(example.styleId);
    }
    for (const row of packet.preview.textOwners.items) row.styleIncluded = retainedStyleIds.has(row.styleId);
  };
  while (true) {
    refreshStyleFlags();
    packet.withinBudget = true;
    if (settleRenderedChars(packet) <= maxChars) break;
    const nonempty = optionalSections.filter((value) => value.items.length);
    if (nonempty.length) {
      const largest = nonempty.reduce((best, value) => value.items.length > best.items.length ? value : best);
      largest.items.pop();
      largest.shown = largest.items.length;
      largest.omitted = largest.total - largest.shown;
      continue;
    }
    if (packet.preview.groups.items.some((group) => group.examples.length)) {
      for (const group of packet.preview.groups.items) group.examples = [];
      continue;
    }
    packet.withinBudget = false;
    settleRenderedChars(packet);
    break;
  }
  return packet;
}

export function previewFile(filename, maxChars = DEFAULT_MAX_CHARS) {
  let parsed;
  try { parsed = JSON.parse(readFileSync(filename, "utf8")); }
  catch (error) { throw new Error(`Cannot parse saved evaluation ${filename}: ${error.message}`); }
  const capture = unwrapCapture(parsed);
  if (!capture) throw new Error(`Saved evaluation ${filename} does not contain a page capture result.`);
  return buildPreview(capture, filename, maxChars);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const command = process.argv[2];
    if (command === "request") console.log(JSON.stringify(captureRequest(process.argv[3])));
    else if (command === "preview") {
      const rawMax = process.argv[4];
      const maxChars = rawMax === undefined ? DEFAULT_MAX_CHARS : Number(rawMax);
      console.log(JSON.stringify(previewFile(process.argv[3], maxChars)));
    } else throw new Error("Usage: capture-page.js request [filename] | preview FILE [maxChars=24000]");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

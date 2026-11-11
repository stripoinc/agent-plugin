import {
  normalizeColor
} from "./styles-961c8e1b984f.js";
import {
  isElement,
  parseHtml
} from "./parse-html-7b561a99741a.js";
import {
  contextIssues,
  getUnavailableMergeServiceSideEffects
} from "./context-92ea7204ec76.js";
import {
  locationRules
} from "./rules-c9866c302580.js";
import {
  canonicalFontValue
} from "./fonts-82d1d39f0f33.js";
import {
  blockRoot,
  checkValue,
  contractDefaults,
  documentRoot,
  getJsonSchema,
  nodeCapability,
  resolveSchema,
  schemaForValue
} from "./contract-79faab52de2a.js";
import {
  RULE_TABLE
} from "./rule-table-generated-439fbe3342c9.js";
import {
  collectSocialDocumentIssues
} from "./social-f4a8e0da8c68.js";
import {
  EmailSdkError,
  LINE_HEIGHT_HINT,
  cloneJson,
  deepFreeze,
  describeNodeKind,
  isObject,
  objectValue,
  resolveJsonPointer,
  stableJson
} from "./errors-3ee69a7e1eb0.js";

// convo-email-agent/src/sdk/validator/normalize.ts
var ZERO_SIDES = { width: 0, color: "transparent" };
function materializeText(block) {
  if (!isObject(block) || block.type !== "text") return block;
  const defaults = contractDefaults("text");
  if (block.settings === void 0) return { ...block, settings: defaults };
  if (!isObject(block.settings)) return block;
  const settings = { ...block.settings };
  for (const key of ["hideElement", "rightToLeftTextDirection", "padding", "includeInOutput", "backgroundColor"]) {
    if (settings[key] === void 0) settings[key] = defaults[key];
  }
  return { ...block, settings };
}
function materializeStructure(structure) {
  if (!isObject(structure)) return structure;
  const columns = Array.isArray(structure.columns) ? structure.columns.map((column) => isObject(column) && Array.isArray(column.containers) ? { ...column, containers: column.containers.map((container) => isObject(container) && Array.isArray(container.blocks) ? { ...container, blocks: container.blocks.map(materializeText) } : container) } : column) : structure.columns;
  if (!isObject(structure.settings)) return { ...structure, columns };
  const settings = { ...structure.settings };
  delete settings.widthColumns;
  if (settings.backgroundColor === void 0) settings.backgroundColor = "transparent";
  if (settings.border === void 0) {
    settings.border = { top: { ...ZERO_SIDES }, right: { ...ZERO_SIDES }, bottom: { ...ZERO_SIDES }, left: { ...ZERO_SIDES }, style: "solid" };
  }
  if (settings.borderRadius === void 0) settings.borderRadius = { topLeft: 0, topRight: 0, bottomRight: 0, bottomLeft: 0 };
  return { ...structure, columns, settings };
}
function materialize(target, current) {
  if (!isObject(target)) return target;
  const document = Array.isArray(target.stripes) ? { ...target, stripes: target.stripes.map((stripe) => isObject(stripe) && Array.isArray(stripe.structures) ? { ...stripe, structures: stripe.structures.map(materializeStructure) } : stripe) } : { ...target };
  if (!current) return document;
  const before = isObject(current.metadata) ? current.metadata : void 0;
  if (document.metadata === void 0) {
    if (before) document.metadata = cloneJson(before);
  } else if (isObject(document.metadata)) {
    const metadata = { ...document.metadata };
    if (metadata.title === void 0 && before?.title !== void 0) metadata.title = before.title;
    if (metadata.preheader === void 0 && isObject(before?.preheader)) metadata.preheader = { ...before.preheader };
    document.metadata = metadata;
  }
  return document;
}
var TRANSFORMS = {
  backgroundRepeat: (value) => typeof value === "boolean" ? value : ["repeat", "true"].includes(String(value).trim().toLowerCase()),
  backgroundSize: (value) => (typeof value === "string" ? value.trim() : "") || "auto",
  canonicalFontResources: (value) => isObject(value) && Array.isArray(value.fonts) && value.fonts.length ? { fonts: value.fonts.map((font) => ({ ...font, fontFamily: canonicalFontValue(String(font.fontFamily).trim()) })) } : void 0,
  dropUndefinedResources: (value) => {
    if (!isObject(value) || value.resources !== void 0) return value;
    const { resources: _omitted, ...rest } = value;
    return rest;
  }
};
var STEPS = Object.entries(RULE_TABLE.transforms).map(([location, kinds]) => {
  if (location.includes("|")) throw new Error("Transform inside a union branch is not ported: ".concat(location));
  for (const kind of kinds) if (!TRANSFORMS[kind]) throw new Error("Unported validator transform: ".concat(kind));
  return { steps: location.slice(1).match(/\.[^.[]+|\[\]/g) ?? [], kinds };
}).sort((left, right) => right.steps.length - left.steps.length);
function mapAt(value, steps, apply) {
  if (!steps.length) return apply(value);
  const [step, ...rest] = steps;
  if (step === "[]") return Array.isArray(value) ? value.map((item) => mapAt(item, rest, apply)) : value;
  const key = step.slice(1);
  return isObject(value) && value[key] !== void 0 ? { ...value, [key]: mapAt(value[key], rest, apply) } : value;
}
function transformDocument(document) {
  return STEPS.reduce((value, { steps, kinds }) => kinds.reduce((current, kind) => mapAt(current, steps, TRANSFORMS[kind]), value), document);
}

// convo-email-agent/src/sdk/validator/index.ts
function check(root, value) {
  return checkValue(root.node, value, [], root.location, locationRules);
}
function validateDocumentSnapshot(document) {
  const materialized = materialize(document);
  const issues = check(documentRoot(), materialized);
  return issues.length ? { success: false, input: "current", issues } : { success: true, issues: [], documentState: transformDocument(materialized) };
}
function validateDocumentState(target, current) {
  let before = { stripes: [] };
  if (current !== void 0) {
    const parsed = validateDocumentSnapshot(current);
    if (!parsed.success) return parsed;
    before = parsed.documentState;
  }
  const materialized = materialize(target, before);
  const issues = check(documentRoot(), materialized);
  if (issues.length) return { success: false, input: "target", issues };
  const documentState = transformDocument(materialized);
  const context = isObject(documentState) ? contextIssues(documentState, before) : [];
  return context.length ? { success: false, input: "target", issues: context } : { success: true, issues: [], documentState };
}
function validateBlock(block) {
  const issues = check(blockRoot(), block);
  return issues.length ? { success: false, input: "target", issues } : { success: true, issues: [], documentState: block };
}

// convo-email-agent/src/sdk/editor-validator.ts
var ROOT_PATH = "<root>";
function dotPath(segments) {
  return segments.length === 0 ? ROOT_PATH : segments.map(String).join(".");
}
function pointerToPath(pointer) {
  const segments = pointer.split("/").slice(1).map((segment) => segment.replace(/~1/gu, "/").replace(/~0/gu, "~"));
  return dotPath(segments);
}
var LINE_HEIGHT_PATH = /^settings\.(?:stripes|headings\.h[1-6])\.lineHeight(?:\.(?:desktop|mobile))?$/u;
function formatIssue(issue) {
  const path = dotPath(issue.path);
  if (issue.code === "unrecognized_keys" && issue.keys && issue.keys.length > 0) {
    return issue.keys.map((key) => ({ path, code: issue.code, message: "unsupported property ".concat(JSON.stringify(key)) }));
  }
  const missing = issue.message.startsWith("missing required property ");
  const message = !missing && LINE_HEIGHT_PATH.test(path) ? "".concat(issue.message, " ").concat(LINE_HEIGHT_HINT) : issue.message;
  return [{ path, code: issue.code, message }];
}
var LINE_HEIGHT_GROUPS = ["stripes", ...[1, 2, 3, 4, 5, 6].map((level) => "headings/h".concat(level))];
function lineHeightPrecisionIssues(model, current) {
  const issues = [];
  for (const group of LINE_HEIGHT_GROUPS) {
    for (const platform of ["desktop", "mobile"]) {
      const instancePath = "/settings/".concat(group, "/lineHeight/").concat(platform);
      const value = resolveJsonPointer(model, instancePath);
      if (typeof value !== "number" || !Number.isFinite(value) || Math.round(value * 100) / 100 === value) continue;
      if (current !== void 0 && resolveJsonPointer(current, instancePath) === value) continue;
      issues.push({ instancePath, message: "".concat(value, " is stored as a whole percentage and would read back as ").concat(Math.round(value * 100) / 100, ". ").concat(LINE_HEIGHT_HINT) });
    }
  }
  return issues;
}
function validateEmailDocument(model, options = {}) {
  const result = validateDocumentState(model, options.current);
  const rules = [...collectSocialDocumentIssues(model), ...lineHeightPrecisionIssues(model, options.current)].map((rule) => ({ path: pointerToPath(rule.instancePath), code: "editor_rule", message: rule.message }));
  const ruleFor = (issue) => {
    const property = /^(?:unsupported|missing required) property "(.+)"$/u.exec(issue.message)?.[1];
    return property === void 0 ? void 0 : rules.find((rule) => rule.path === "".concat(issue.path, ".").concat(property));
  };
  const issues = [];
  const reported = /* @__PURE__ */ new Set();
  for (const native of result.issues.flatMap(formatIssue)) {
    const issue = ruleFor(native) ?? native;
    if (issue !== native && reported.has(issue.path)) continue;
    reported.add(issue.path);
    issues.push(issue);
  }
  for (const rule of rules) {
    if (reported.has(rule.path)) continue;
    reported.add(rule.path);
    issues.push(rule);
  }
  return issues;
}

// convo-email-agent/src/sdk/selectors.ts
var LIST_KEY_KIND = {
  stripes: "stripe",
  structures: "structure",
  columns: "column",
  containers: "container",
  blocks: "block"
};
function collectNodeIndex(value) {
  const entries = [];
  const hideElementValue = (current) => {
    if (!isObject(current.settings)) return void 0;
    const value2 = current.settings.hideElement;
    return value2 === "no" || value2 === "mobile" || value2 === "desktop" ? value2 : void 0;
  };
  const visibilityFor = (hiddenOn) => {
    if (hiddenOn.has("desktop") && hiddenOn.has("mobile")) return "neither";
    if (hiddenOn.has("desktop")) return "mobile-only";
    if (hiddenOn.has("mobile")) return "desktop-only";
    return "both";
  };
  const visit = (current, kindFromParent, parentChain, messageArea, inheritedModuleId, inheritedHiddenOn, path) => {
    if (Array.isArray(current)) {
      for (const [index, item] of current.entries()) {
        visit(item, kindFromParent, parentChain, messageArea, inheritedModuleId, inheritedHiddenOn, [...path, index]);
      }
      return;
    }
    if (!isObject(current)) return;
    const ownKind = describeNodeKind(current) ?? kindFromParent;
    const ownId = typeof current.id === "string" ? current.id : void 0;
    const settingsArea = isObject(current.settings) && typeof current.settings.messageArea === "string" ? current.settings.messageArea : void 0;
    const ownArea = typeof current.messageArea === "string" ? current.messageArea : settingsArea ?? messageArea;
    const moduleValue = current.moduleId;
    const ownModuleId = typeof moduleValue === "string" || typeof moduleValue === "number" ? moduleValue : inheritedModuleId;
    const ownHideElement = hideElementValue(current);
    const hiddenOn = new Set(inheritedHiddenOn);
    if (ownHideElement === "desktop") hiddenOn.add("desktop");
    if (ownHideElement === "mobile") hiddenOn.add("mobile");
    if (ownId !== void 0 && ownKind !== void 0) {
      entries.push({
        id: ownId,
        kind: ownKind,
        blockType: typeof current.type === "string" ? current.type : void 0,
        messageArea: ownArea,
        ownHideElement,
        effectiveVisibility: visibilityFor(hiddenOn),
        moduleId: ownModuleId,
        parentChain,
        path,
        element: current
      });
    }
    const nextParentChain = ownId === void 0 || ownKind === "block" ? parentChain : [...parentChain, ownId];
    for (const [key, child] of Object.entries(current)) {
      const childKind = LIST_KEY_KIND[key];
      if (childKind !== void 0) {
        visit(child, childKind, nextParentChain, ownArea, ownModuleId, hiddenOn, [...path, key]);
      }
    }
  };
  visit(value, void 0, [], void 0, void 0, /* @__PURE__ */ new Set(), []);
  return entries;
}
function hasLink(element, blockType) {
  const settings = isObject(element.settings) ? element.settings : {};
  if (blockType === "text" && typeof element.content === "string") {
    return /<a\b[^>]*href=/iu.test(element.content);
  }
  if (blockType === "button") {
    const link = settings.link;
    return isObject(link) && (typeof link.value === "string" || typeof link.href === "string");
  }
  if (blockType === "image") {
    const link = settings.link;
    return isObject(link) && typeof link.href === "string" && link.href.length > 0;
  }
  if (blockType === "social" && Array.isArray(settings.networks)) {
    return settings.networks.some(
      (network) => isObject(network) && isObject(network.link) && typeof network.link.href === "string" && network.link.href.length > 0
    );
  }
  return false;
}
function linkHostContains(element, blockType, needle) {
  const lowerNeedle = needle.toLowerCase();
  const settings = isObject(element.settings) ? element.settings : {};
  const urls = [];
  if (blockType === "text" && typeof element.content === "string") {
    for (const match of element.content.matchAll(/<a\b[^>]*href=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/giu)) {
      urls.push(match[1] ?? match[2] ?? match[3] ?? "");
    }
  } else if (blockType === "button" && isObject(settings.link)) {
    if (typeof settings.link.value === "string") urls.push(settings.link.value);
    if (typeof settings.link.href === "string") urls.push(settings.link.href);
  } else if (blockType === "image" && isObject(settings.link) && typeof settings.link.href === "string") {
    urls.push(settings.link.href);
  } else if (blockType === "social" && Array.isArray(settings.networks)) {
    for (const network of settings.networks) {
      if (isObject(network) && isObject(network.link) && typeof network.link.href === "string") {
        urls.push(network.link.href);
      }
    }
  }
  return urls.some((url) => url.toLowerCase().includes(lowerNeedle));
}

// convo-email-agent/src/sdk/lost-keys.ts
var CHILD_ARRAYS = /* @__PURE__ */ new Set(["stripes", "structures", "columns", "containers", "blocks"]);
function acceptsNull(node) {
  const resolved = resolveSchema(node);
  const types = Array.isArray(resolved.type) ? resolved.type : [resolved.type];
  return types.includes("null") || resolved.const === null || [...resolved.anyOf ?? [], ...resolved.oneOf ?? []].some(acceptsNull);
}
function isSupportedThemeReset(pointer) {
  const keys = pointer.split("/").slice(1);
  if (keys[0] !== "settings" || keys.length < 2) return false;
  let node = getJsonSchema();
  for (const key of keys) {
    node = node && resolveSchema(node).properties?.[key];
    if (!node) return false;
  }
  return acceptsNull(node);
}
function findUnintendedLosses(input, output, intent = {}) {
  if (stableJson(input) === stableJson(output)) return [];
  const lost = [];
  const resets = new Set(intent.resetFields ?? []);
  const collections = new Set(intent.replaceCollections ?? []);
  const removals = new Set(intent.removeNodes ?? []);
  const permitted = (pointer) => resets.has(pointer) || [...collections].some((path) => pointer === path || pointer.startsWith(path + "/"));
  const compare = (before2, after2, pointer) => {
    if (stableJson(before2) === stableJson(after2)) return;
    if (Array.isArray(before2)) {
      if (!collections.has(pointer)) lost.push(pointer);
      return;
    }
    if (!isObject(before2)) return;
    if (!isObject(after2)) {
      if (!permitted(pointer)) lost.push(pointer);
      return;
    }
    for (const [key, value] of Object.entries(before2)) {
      const address = "".concat(pointer, "/").concat(key);
      if (!Object.hasOwn(after2, key)) {
        if (!permitted(address)) lost.push(address);
      } else compare(value, after2[key], address);
    }
  };
  const before = objectValue(input);
  const after = objectValue(output);
  for (const key of Object.keys(before)) {
    if (CHILD_ARRAYS.has(key)) continue;
    if (!Object.hasOwn(after, key)) {
      if (!permitted("/".concat(key))) lost.push("/".concat(key));
    } else compare(before[key], after[key], "/".concat(key));
  }
  const remaining = collectNodeIndex(output);
  const occurrences = /* @__PURE__ */ new Map();
  for (const node of collectNodeIndex(input)) {
    const key = "".concat(node.kind, ":").concat(node.id);
    const index = occurrences.get(key) ?? 0;
    occurrences.set(key, index + 1);
    const candidates = remaining.filter((item) => item.id === node.id && item.kind === node.kind);
    const survivor = candidates[index];
    if (!survivor) {
      if (!removals.has(node.id) && !node.parentChain.some((id) => removals.has(id))) lost.push("/".concat(node.id));
      continue;
    }
    const withoutChildren = (item) => Object.fromEntries(
      Object.entries(item).filter(([key2]) => !CHILD_ARRAYS.has(key2))
    );
    compare(withoutChildren(node.element), withoutChildren(survivor.element), "/".concat(node.id));
  }
  return [...new Set(lost)];
}

// convo-email-agent/src/sdk/text-font-color.ts
var RECOLORED_TAGS = /* @__PURE__ */ new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "span"]);
var RGB_FUNCTION = /^rgba?\(\s*(\d{1,3})(?:\s*,\s*|\s+)(\d{1,3})(?:\s*,\s*|\s+)(\d{1,3})(?:\s*[,/]\s*(\d*\.?\d+)(%)?)?\s*\)$/u;
function inlineColor(element) {
  const style = element.attrs.find((attr) => attr.name === "style")?.value ?? "";
  return /(?:^|;)\s*color\s*:\s*([^;!]+)/iu.exec(style)?.[1].trim() || void 0;
}
function collectColors(nodes, found) {
  for (const node of nodes) {
    if (!isElement(node)) continue;
    const color = RECOLORED_TAGS.has(node.tag) ? inlineColor(node) : void 0;
    if (color) found.push(color);
    collectColors(node.children, found);
  }
  return found;
}
function recoloredInlineColors(content) {
  return typeof content === "string" ? collectColors(parseHtml(content), []) : [];
}
function colorKey(color) {
  if (typeof color !== "string") return void 0;
  const value = color.trim().toLowerCase();
  const rgb = RGB_FUNCTION.exec(value);
  let hex;
  if (rgb) {
    const channels = rgb.slice(1, 4).map(Number);
    if (channels.some((channel) => channel > 255)) return void 0;
    const alpha = rgb[4] === void 0 ? 1 : Number(rgb[4]) / (rgb[5] ? 100 : 1);
    hex = "#".concat(channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")) + (alpha >= 1 ? "" : Math.round(alpha * 255).toString(16).padStart(2, "0"));
  } else {
    try {
      hex = normalizeColor(value, true).toLowerCase();
    } catch {
      return void 0;
    }
  }
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/u.exec(hex);
  if (short) hex = "#".concat(short[1]).concat(short[1]).concat(short[2]).concat(short[2]).concat(short[3]).concat(short[3]);
  return /^#[0-9a-f]{6}ff$/u.test(hex) ? hex.slice(0, 7) : hex;
}
var fontColorOf = (block) => isObject(block.settings) ? block.settings.fontColor : void 0;
function hasRecoloredInlineColor(content) {
  return recoloredInlineColors(content).length > 0;
}
function textBlockColors(block) {
  return [fontColorOf(block), ...recoloredInlineColors(block.content)];
}
function overwrittenInlineColors(before, after, inherited = []) {
  const requested = colorKey(fontColorOf(after));
  if (requested === void 0) return [];
  if (before && (after.content === before.content || colorKey(fontColorOf(before)) === requested)) return [];
  const known = new Set((before ? textBlockColors(before) : inherited).map(colorKey));
  const replaced = recoloredInlineColors(after.content).filter((color) => {
    const key = colorKey(color);
    return key !== void 0 && key !== requested && !known.has(key);
  });
  return [...new Set(replaced)];
}
var THEME_COLORED_TAGS = /* @__PURE__ */ new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "a"]);
function hasBlockColoredText(nodes) {
  return nodes.some((node) => !isElement(node) ? node.text.trim() !== "" : !THEME_COLORED_TAGS.has(node.tag) && !inlineColor(node) && hasBlockColoredText(node.children));
}
function releaseCopiedFontColors(value) {
  if (Array.isArray(value)) {
    for (const child of value) releaseCopiedFontColors(child);
    return;
  }
  if (!isObject(value)) return;
  if (value.type === "text" && isObject(value.settings) && overwrittenInlineColors(void 0, value).length && typeof value.content === "string" && !hasBlockColoredText(parseHtml(value.content))) delete value.settings.fontColor;
  for (const child of Object.values(value)) releaseCopiedFontColors(child);
}

// convo-email-agent/src/sdk/content-mutations.ts
var ANCHOR_PATTERN = /<a\b([^>]*)>([\s\S]*?)<\/a>/giu;
var HREF_SCHEME = /^([a-zA-Z][a-zA-Z0-9+.-]*):/u;
var ALLOWED_HREF_SCHEMES = /* @__PURE__ */ new Set(["http", "https", "mailto", "tel"]);
function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}
function stripTags(html) {
  return html.replace(/<[^>]*>/gu, "");
}
function assertSafeHref(href) {
  const trimmed = href.trim();
  const match = HREF_SCHEME.exec(trimmed);
  if (match !== null && !ALLOWED_HREF_SCHEMES.has(match[1].toLowerCase())) {
    throw new EmailSdkError('Unsafe href scheme "'.concat(match[1], '". Allowed schemes: http, https, mailto, tel.'));
  }
}
var ANCHOR_OPEN_TAG = /<a\b([^>]*)>/giu;
function linksWithoutBlankTarget(content, acquired) {
  return [...content.matchAll(ANCHOR_OPEN_TAG)].filter((match) => !acquired.has(match[0]) && attrValue(match[1], "href") !== void 0 && attrValue(match[1], "target")?.trim().toLowerCase() !== "_blank").map((match) => match[0]);
}
function anchorOpenTags(content) {
  return [...content.matchAll(ANCHOR_OPEN_TAG)].map((match) => match[0]);
}
function attrValue(rawAttrs, name) {
  const pattern = new RegExp("".concat(name, "\\s*=\\s*(?:\"([^\"]*)\"|'([^']*)'|([^\\s>]+))"), "iu");
  const match = pattern.exec(rawAttrs);
  return match === null ? void 0 : match[1] ?? match[2] ?? match[3];
}
function setAttr(rawAttrs, name, value) {
  const escaped = value.replaceAll('"', "&quot;");
  const pattern = new RegExp("(".concat(name, "\\s*=\\s*)(?:\"[^\"]*\"|'[^']*'|[^\\s>]+)"), "iu");
  if (pattern.test(rawAttrs)) return rawAttrs.replace(pattern, '$1"'.concat(escaped, '"'));
  return "".concat(rawAttrs, " ").concat(name, '="').concat(escaped, '"');
}
function replaceVisibleText(content, matchText, replace, occurrence = 0) {
  if (!Number.isInteger(occurrence) || occurrence < 0) {
    throw new EmailSdkError("replaceText occurrence must be a non-negative integer.");
  }
  const runs = [];
  const tagPattern = /<[^>]*>/gu;
  let cursor = 0;
  for (const tag of content.matchAll(tagPattern)) {
    const tagStart = tag.index ?? 0;
    if (tagStart > cursor) runs.push({ start: cursor, end: tagStart, text: content.slice(cursor, tagStart) });
    cursor = tagStart + tag[0].length;
  }
  if (cursor < content.length) runs.push({ start: cursor, end: content.length, text: content.slice(cursor) });
  const matches = [];
  for (const run of runs) {
    let offset = run.text.indexOf(matchText);
    while (offset !== -1) {
      matches.push({ start: run.start + offset, end: run.start + offset + matchText.length });
      offset = run.text.indexOf(matchText, offset + Math.max(1, matchText.length));
    }
  }
  if (matches.length === 0) {
    throw new EmailSdkError('Text "'.concat(matchText, '" was not found inside one visible text run.'));
  }
  if (occurrence >= matches.length) {
    throw new EmailSdkError('Text "'.concat(matchText, '" occurrence ').concat(occurrence, " is out of range; found ").concat(matches.length, "."));
  }
  const span = matches[occurrence];
  return "".concat(content.slice(0, span.start)).concat(replace).concat(content.slice(span.end));
}
function mutateAnchor(content, mutation) {
  const candidates = [];
  let ordinal = 0;
  for (const match of content.matchAll(ANCHOR_PATTERN)) {
    const attrs2 = match[1] ?? "";
    const inner2 = match[2] ?? "";
    const href = attrValue(attrs2, "href");
    if (mutation.match.href !== void 0 && href !== mutation.match.href) {
      ordinal += 1;
      continue;
    }
    if (mutation.match.text !== void 0 && normalizeText(stripTags(inner2)) !== normalizeText(mutation.match.text)) {
      ordinal += 1;
      continue;
    }
    const start = match.index ?? 0;
    candidates.push({ index: ordinal, full: match[0], attrs: attrs2, inner: inner2, start, end: start + match[0].length });
    ordinal += 1;
  }
  if (candidates.length === 0) throw new EmailSdkError("No text anchor matched.");
  if (candidates.length > 1) throw new EmailSdkError("Text anchor match is ambiguous: ".concat(candidates.length, " anchors matched."));
  const candidate = candidates[0];
  let attrs = candidate.attrs;
  if (mutation.set.href !== void 0) {
    assertSafeHref(mutation.set.href);
    attrs = setAttr(attrs, "href", mutation.set.href);
  }
  if (mutation.set.target !== void 0) {
    attrs = setAttr(attrs, "target", mutation.set.target);
  }
  const inner = mutation.set.text ?? candidate.inner;
  const next = "<a".concat(attrs, ">").concat(inner, "</a>");
  return "".concat(content.slice(0, candidate.start)).concat(next).concat(content.slice(candidate.end));
}

// convo-email-agent/src/sdk/preparation.ts
var DocumentStateError = class extends Error {
  constructor(issues) {
    super(issues.map((issue) => "".concat(issue.path, ": ").concat(issue.message)).join("; "));
    this.issues = issues;
    this.name = "DocumentStateError";
    this.code = issues[0]?.code ?? "INVALID_DOCUMENT";
    this.stage = issues[0]?.stage;
    this.input = issues[0]?.input;
    this.path = issues[0]?.path;
  }
  issues;
  code;
  stage;
  input;
  path;
};
function normalizedPaths(before, after, path = "") {
  if (stableJson(before) === stableJson(after)) return [];
  if (Array.isArray(before) && Array.isArray(after) && before.length === after.length) {
    return after.flatMap((value, index) => normalizedPaths(before[index], value, path ? "".concat(path, ".").concat(index) : String(index)));
  }
  if (isObject(before) && isObject(after)) return [.../* @__PURE__ */ new Set([...Object.keys(before), ...Object.keys(after)])].flatMap((key) => normalizedPaths(before[key], after[key], path ? "".concat(path, ".").concat(key) : key));
  return [path || "<root>"];
}
function jsonIssues(value, input = "target") {
  const issues = [];
  const ancestors = /* @__PURE__ */ new Set();
  const visit = (item, path) => {
    const fail = (message) => {
      issues.push({ code: "NON_JSON_VALUE", stage: "json", input, path, message });
    };
    if (item === null || typeof item === "string" || typeof item === "boolean") return;
    if (typeof item === "number") {
      if (!Number.isFinite(item)) fail("Expected a finite JSON number.");
      return;
    }
    if (typeof item !== "object") {
      fail("Value of type ".concat(typeof item, " is not JSON."));
      return;
    }
    if (ancestors.has(item)) {
      fail("Cyclic data is not JSON.");
      return;
    }
    if (!Array.isArray(item) && Object.getPrototypeOf(item) !== Object.prototype && Object.getPrototypeOf(item) !== null) {
      fail("Expected a plain JSON object.");
      return;
    }
    if (Object.getOwnPropertySymbols(item).length) fail("Symbol keys are not JSON.");
    ancestors.add(item);
    if (Array.isArray(item)) {
      if (Object.getPrototypeOf(item) !== Array.prototype) fail("Expected a plain JSON array.");
      for (let i = 0; i < item.length; i++) {
        const descriptor = Object.getOwnPropertyDescriptor(item, i);
        if (!descriptor) fail("Sparse array entry at ".concat(i, "."));
        else if (descriptor.get || descriptor.set || !descriptor.enumerable) fail("Array entry ".concat(i, " is not a JSON data property."));
        else visit(descriptor.value, "".concat(path, ".").concat(i));
      }
      if (Object.getOwnPropertyNames(item).some((key) => key !== "length" && (String(Number(key)) !== key || !Number.isInteger(Number(key)) || Number(key) < 0 || Number(key) >= item.length))) fail("Array properties would be discarded.");
    } else for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(item))) {
      if (descriptor.get || descriptor.set || !descriptor.enumerable) fail("Property ".concat(key, " is not a JSON data property."));
      else visit(descriptor.value, path === "<root>" ? key : "".concat(path, ".").concat(key));
    }
    ancestors.delete(item);
  };
  visit(value, "<root>");
  return issues;
}
function unknownIssues(value, input) {
  const issues = [];
  const visit = (value2, rawSchema, path) => {
    const schema = schemaForValue(rawSchema, value2);
    if (Array.isArray(value2)) {
      if (schema.items) value2.forEach((child, i) => visit(child, schema.items, "".concat(path, ".").concat(i)));
      return;
    }
    if (!isObject(value2) || !schema.properties) return;
    for (const [key, child] of Object.entries(value2)) {
      const childPath = path ? "".concat(path, ".").concat(key) : key;
      if (Object.hasOwn(schema.properties, key)) visit(child, schema.properties[key], childPath);
      else if (isObject(schema.additionalProperties)) visit(child, schema.additionalProperties, childPath);
      else issues.push({
        code: key === "containers" && path.includes("structures.") ? "LEGACY_LAYOUT_UNSUPPORTED" : "UNKNOWN_FIELD",
        stage: "json",
        input,
        path: childPath,
        message: "This field is not part of the pinned SDK format."
      });
    }
  };
  visit(value, getJsonSchema(), "");
  return issues;
}
function validateSnapshot(document) {
  const json = jsonIssues(document, "current");
  if (json.length) return { success: false, issues: json };
  const unknown = unknownIssues(document, "current");
  if (unknown.length) return { success: false, issues: unknown };
  const result = validateDocumentSnapshot(document);
  if (!result.success) return { success: false, issues: result.issues.map((issue) => ({
    code: "INVALID_SNAPSHOT",
    stage: "schema",
    input: "current",
    path: issue.path.join(".") || "<root>",
    message: issue.message,
    nativeCode: issue.code
  })) };
  return { success: true, documentState: deepFreeze(cloneJson(result.documentState)), normalizations: [], issues: [], verification: "contract" };
}
function validateChange({ current, target, intent }) {
  const currentResult = current === void 0 ? void 0 : validateSnapshot(current);
  if (currentResult && !currentResult.success) return currentResult;
  const json = jsonIssues(target);
  if (json.length) return { success: false, issues: json };
  const unknown = unknownIssues(target, "target");
  if (unknown.length) return { success: false, issues: unknown };
  const native = validateDocumentState(target, current);
  const validation = validateEmailDocument(target, { current });
  if (!native.success || validation.length) return { success: false, issues: validation.length ? validation.map((issue) => ({ ...issue, nativeCode: issue.code, code: "INVALID_DOCUMENT", stage: "schema", input: native.input ?? "target" })) : native.issues.map((issue) => ({ code: "INVALID_DOCUMENT", nativeCode: issue.code, stage: "schema", input: native.input ?? "target", path: issue.path.join("."), message: issue.message })) };
  const candidate = native.documentState;
  const before = collectNodeIndex(currentResult?.success ? currentResult.documentState : { stripes: [] });
  const after = collectNodeIndex(candidate);
  const issues = [];
  for (const pointer of intent?.resetFields ?? []) {
    const match = /^\/([^/]+)\/settings\/(.+)$/.exec(pointer);
    const node = match && before.find((entry) => entry.id === match[1]);
    const themeReset = isSupportedThemeReset(pointer);
    const supported = themeReset || node && (node.blockType === "image" && match[2] === "link" || node.blockType === "spacer" && ["height", "width", "border", "mobileBorder", "alignment"].includes(match[2]));
    if (!supported) issues.push({ code: "UNSUPPORTED_RESET", stage: "change", input: "target", path: pointer, message: "No reviewed native reset exists for this path." });
    else if (themeReset && resolveJsonPointer(candidate, pointer) === void 0) {
      issues.push({
        code: "UNSUPPORTED_RESET",
        stage: "change",
        input: "target",
        path: pointer,
        message: "A theme reset requires an explicit null; omitting an optional setting leaves its acquired value unchanged."
      });
    }
  }
  for (const pointer of intent?.replaceCollections ?? []) {
    const match = /^\/([^/]+)\/settings\/([^/]+)$/.exec(pointer);
    const node = match && [...after, ...before].find((entry) => entry.id === match[1]);
    const supported = pointer === "/resources/fonts" || node && (node.blockType === "social" && match[2] === "networks" || node.blockType === "menu" && ["items", "itemType", "colors"].includes(match[2]) || ["image", "button"].includes(node.blockType ?? "") && match[2] === "link");
    if (!supported) issues.push({ code: "UNSUPPORTED_COLLECTION_REPLACEMENT", stage: "change", input: "target", path: pointer, message: "No reviewed native atomic replacement exists for this path." });
  }
  for (const entry of before) {
    const survivor = after.find((node) => node.kind === entry.kind && node.id === entry.id);
    if (entry.kind === "block" && survivor && survivor.blockType !== entry.blockType) {
      issues.push({
        code: "BLOCK_TYPE_REPLACEMENT_UNSUPPORTED",
        stage: "change",
        input: "target",
        path: entry.id,
        nodeId: entry.id,
        nodeType: entry.blockType,
        message: "Replacing an existing block type under the same ID is unsupported."
      });
    }
    const capability = nodeCapability(entry.blockType ?? entry.kind);
    const moved = survivor && stableJson(entry.parentChain) !== stableJson(survivor.parentChain);
    if (!survivor && !capability?.actions.DELETE.runtimes.mergeService || moved && !capability?.actions.MOVE.runtimes.mergeService) {
      issues.push({
        code: "UNSUPPORTED_OPERATION",
        stage: "change",
        input: "target",
        path: entry.id,
        nodeId: entry.id,
        nodeType: entry.blockType ?? entry.kind,
        reason: survivor ? "MOVE_UNSUPPORTED" : "DELETE_UNSUPPORTED",
        message: "".concat(survivor ? "Moving" : "Deleting", " this node (including through its parent) is not supported by merge-service.")
      });
    }
    if (survivor) for (const key of capability?.readOnlyProperties ?? []) {
      if (stableJson(entry.element[key]) !== stableJson(survivor.element[key])) issues.push({
        code: "READ_ONLY_FIELD",
        stage: "change",
        input: "target",
        path: "".concat(entry.id, ".").concat(key),
        nodeId: entry.id,
        message: "A read-only field changed."
      });
    }
  }
  const inherited = before.filter((node) => node.blockType === "text").flatMap((node) => textBlockColors(node.element));
  const acquiredLinks = new Set(before.filter((node) => node.blockType === "text" && typeof node.element.content === "string").flatMap((node) => anchorOpenTags(node.element.content)));
  for (const entry of after) if (entry.blockType === "text") {
    const previous = before.find((node) => node.id === entry.id && node.blockType === "text");
    const replaced = overwrittenInlineColors(previous?.element, entry.element, inherited);
    if (replaced.length) issues.push({
      code: "INLINE_COLOR_OVERWRITTEN",
      stage: "change",
      input: "target",
      path: "".concat(entry.id, ".content"),
      nodeId: entry.id,
      nodeType: "text",
      message: previous ? "This write changes both content and fontColor; the editor applies fontColor to every p, h1-h6, li and span, replacing the newly supplied inline colors ".concat(replaced.join(", "), ". Align or remove them, or keep the acquired fontColor for intentional multicolor text.") : "The editor applies a new text block's fontColor to every p, h1-h6, li and span, replacing the inline colors ".concat(replaced.join(", "), ". Omit fontColor to keep the content's colors, or align or remove them.")
    });
    const links = typeof entry.element.content === "string" ? linksWithoutBlankTarget(entry.element.content, acquiredLinks) : [];
    if (links.length) issues.push({
      code: "TEXT_LINK_TARGET_MISSING",
      stage: "change",
      input: "target",
      path: "".concat(entry.id, ".content"),
      nodeId: entry.id,
      nodeType: "text",
      message: 'New or changed text links must open in a new tab; add target="_blank" to '.concat(links.join(", "), ".")
    });
  }
  for (const entry of after) if (!before.some((node) => node.kind === entry.kind && node.id === entry.id)) {
    const capability = nodeCapability(entry.blockType ?? entry.kind);
    if (!capability?.actions.INSERT.runtimes.mergeService) issues.push({
      code: "UNSUPPORTED_OPERATION",
      stage: "change",
      input: "target",
      path: entry.id,
      nodeId: entry.id,
      nodeType: entry.blockType ?? entry.kind,
      reason: "INSERT_UNSUPPORTED",
      message: "Inserting this node is unsupported by merge-service."
    });
    for (const key of capability?.readOnlyProperties ?? []) {
      if (entry.element[key] !== void 0) issues.push({
        code: "READ_ONLY_FIELD",
        stage: "change",
        input: "target",
        path: "".concat(entry.id, ".").concat(key),
        nodeId: entry.id,
        message: "A read-only field cannot be inserted on a new node. Preserve the existing node or create a detached content copy."
      });
    }
  }
  for (const effect of getUnavailableMergeServiceSideEffects(currentResult?.success ? currentResult.documentState : { stripes: [] }, candidate)) {
    for (const id of effect.affectedBlockIds) issues.push({
      code: "SIDE_EFFECT_UNAVAILABLE",
      stage: "change",
      input: "target",
      path: id,
      nodeId: id,
      reason: effect.kind,
      message: "This change requires ".concat(effect.kind, ", unavailable in the mergeService profile.")
    });
  }
  if (current !== void 0) for (const loss of findUnintendedLosses(currentResult?.success ? currentResult.documentState : current, candidate, intent)) {
    issues.push({
      code: "UNINTENDED_DATA_LOSS",
      stage: "preservation",
      input: "target",
      path: loss,
      message: "The candidate drops or replaces data without a matching explicit intent."
    });
  }
  if (issues.length) return { success: false, issues };
  const prepared = stableJson(current) === stableJson(target) ? target : candidate;
  if (stableJson(JSON.parse(JSON.stringify(prepared))) !== stableJson(prepared)) throw new Error("JSON serialization changed the candidate.");
  return {
    success: true,
    documentState: deepFreeze(cloneJson(prepared)),
    normalizations: normalizedPaths(target, prepared),
    issues: [],
    verification: "contract"
  };
}
function requireValid(result) {
  if (!result.success) throw new DocumentStateError(result.issues);
  return result.documentState;
}

export {
  validateBlock,
  ROOT_PATH,
  validateEmailDocument,
  collectNodeIndex,
  hasLink,
  linkHostContains,
  isSupportedThemeReset,
  hasRecoloredInlineColor,
  releaseCopiedFontColors,
  normalizeText,
  stripTags,
  assertSafeHref,
  replaceVisibleText,
  mutateAnchor,
  DocumentStateError,
  jsonIssues,
  validateSnapshot,
  validateChange,
  requireValid
};

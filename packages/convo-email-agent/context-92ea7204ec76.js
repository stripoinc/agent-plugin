import {
  isObject
} from "./errors-3ee69a7e1eb0.js";

// convo-email-agent/src/sdk/validator/context.ts
import catalogData from "./contract-data/catalog.js";
var objects = (value) => Array.isArray(value) ? value.filter(isObject) : [];
var settingsOf = (node) => isObject(node.settings) ? node.settings : {};
var custom = (path, message) => ({ path, code: "custom", message });
var METADATA_TEXT_MAX_LENGTH = 500;
var MOBILE_IMAGE_PREVIEW_WIDTH = 375;
var MEDIA_BLOCKS = /* @__PURE__ */ new Set(["image", "video", "timer"]);
function* entities(document) {
  for (const [stripeIndex, stripe] of objects(document.stripes).entries()) {
    const stripePath = ["stripes", stripeIndex];
    yield { node: stripe, path: stripePath, stripe, id: stripe.id, reference: ["stripe"] };
    for (const [structureIndex, structure] of objects(stripe.structures).entries()) {
      const structurePath = [...stripePath, "structures", structureIndex];
      yield { node: structure, path: structurePath, stripe, id: structure.id, reference: ["structure"] };
      for (const [columnIndex, column] of objects(structure.columns).entries()) {
        const columnPath = [...structurePath, "columns", columnIndex];
        yield { node: column, path: columnPath, stripe, structure, id: column.id, reference: ["column", structure.id] };
        for (const [containerIndex, container] of objects(column.containers).entries()) {
          const containerPath = [...columnPath, "containers", containerIndex];
          yield { node: container, path: containerPath, stripe, structure, column, id: container.id, reference: ["container", column.id] };
          for (const [blockIndex, block] of objects(container.blocks).entries()) {
            yield {
              node: block,
              path: [...containerPath, "blocks", blockIndex],
              stripe,
              structure,
              column,
              container,
              id: block.id,
              reference: ["block", block.type, container.id, column.id]
            };
          }
        }
      }
    }
  }
}
function record(references, id, reference, path) {
  const entity = references.get(id) ?? /* @__PURE__ */ new Map();
  const key = JSON.stringify(reference);
  const usage = entity.get(key) ?? { count: 0, maxSiblingCount: 0, siblings: /* @__PURE__ */ new Map() };
  const collection = JSON.stringify(path.slice(0, -1));
  const siblings = (usage.siblings.get(collection) ?? 0) + 1;
  usage.siblings.set(collection, siblings);
  usage.count++;
  usage.maxSiblingCount = Math.max(usage.maxSiblingCount, siblings);
  entity.set(key, usage);
  references.set(id, entity);
}
function duplicateIdIssues(target, current) {
  const known = /* @__PURE__ */ new Map();
  for (const entity of entities(current)) record(known, entity.id, entity.reference, entity.path);
  const seenReferences = /* @__PURE__ */ new Map();
  const issues = [];
  for (const entity of entities(target)) {
    const seen = seenReferences.get(entity.id);
    record(seenReferences, entity.id, entity.reference, entity.path);
    if (!seen) continue;
    const sharedStructureColumn = seen.size === 2 && seen.get(JSON.stringify(["structure"]))?.count === 1 && seen.get(JSON.stringify(["column", entity.id]))?.count === 1;
    const existing = known.get(entity.id);
    const existingProjection = [...seen].every(([key, usage]) => {
      const before = existing?.get(key);
      return before && usage.count <= before.count && usage.maxSiblingCount <= before.maxSiblingCount;
    });
    if (!sharedStructureColumn && !existingProjection) {
      issues.push(custom([...entity.path, "id"], 'Duplicate document entity ID "'.concat(String(entity.id), '".')));
    }
  }
  return issues;
}
function metadataIssues(target, current) {
  const metadata = isObject(target.metadata) ? target.metadata : {};
  const before = isObject(current.metadata) ? current.metadata : {};
  const issues = [];
  if (typeof metadata.title === "string" && metadata.title !== before.title && metadata.title.length > METADATA_TEXT_MAX_LENGTH) {
    issues.push(custom(["metadata", "title"], "Title cannot exceed ".concat(METADATA_TEXT_MAX_LENGTH, " UTF-16 code units.")));
  }
  const text = isObject(metadata.preheader) ? metadata.preheader.text : void 0;
  const beforeText = isObject(before.preheader) ? before.preheader.text : void 0;
  if (typeof text === "string" && text !== beforeText && text.length > METADATA_TEXT_MAX_LENGTH) {
    issues.push(custom(["metadata", "preheader", "text"], "Preheader cannot exceed ".concat(METADATA_TEXT_MAX_LENGTH, " UTF-16 code units.")));
  }
  return issues;
}
var number = (value) => typeof value === "number" ? value : 0;
var horizontal = (sides) => isObject(sides) ? number(sides.left) + number(sides.right) : 0;
var horizontalBorder = (border) => isObject(border) ? number(isObject(border.left) ? border.left.width : void 0) + number(isObject(border.right) ? border.right.width : void 0) : 0;
var isFullWidth = (size, available) => isObject(size) && size.mode === "width" && available !== void 0 && typeof size.px === "number" && size.px >= available;
var platform = (value, key) => isObject(value) ? value[key] : void 0;
function alignmentLockIssues(target, current) {
  const locks = /* @__PURE__ */ new Map();
  for (const { node, container } of entities(current)) if (container && MEDIA_BLOCKS.has(String(node.type))) locks.set(node.id, settingsOf(node));
  const issues = [];
  for (const { node: block, path, structure, column, container } of entities(target)) {
    if (!container || !MEDIA_BLOCKS.has(String(block.type))) continue;
    const lock = locks.get(block.id);
    if (!lock) continue;
    const settings = settingsOf(block), containerSettings = settingsOf(container);
    const spacing = "paddings" in settings ? settings.paddings : settings.margins;
    const containerWidth = isObject(column?.settings) && typeof column.settings.width === "number" ? column.settings.width : void 0;
    const desktopWidth = containerWidth === void 0 ? void 0 : Math.max(1, containerWidth - horizontalBorder(containerSettings.border) - horizontal(platform(spacing, "desktop")));
    const mobileWidth = Math.max(1, MOBILE_IMAGE_PREVIEW_WIDTH - horizontal(platform(structure ? settingsOf(structure).padding : void 0, "mobile")) - horizontal(platform(containerSettings.padding, "mobile")) - horizontal(platform(spacing, "mobile")));
    for (const [key, available, label] of [["desktop", desktopWidth, "Desktop"], ["mobile", mobileWidth, "Mobile"]]) {
      if (isFullWidth(platform(settings.size, key), available) && platform(settings.alignment, key) !== platform(lock.alignment, key)) {
        issues.push(custom([...path, "settings", "alignment", key], "".concat(label, " image/video alignment cannot be changed while media is full width.")));
      }
    }
  }
  return issues;
}
function contextIssues(target, current) {
  return [...duplicateIdIssues(target, current), ...metadataIssues(target, current), ...alignmentLockIssues(target, current)];
}
var VIDEO_DEFAULTS = catalogData.defaults.DEFAULT_VIDEO_BLOCK_SETTINGS;
var TIMER_PREVIEW_KEYS = [
  "endDate",
  "timeZone",
  "displayDays",
  "separator",
  "labelsLanguage",
  "retinaDisplaySupport",
  "expirationImageSrc",
  "digitsFontFamily",
  "digitsFontSize",
  "digitsFontColor",
  "labelsFontFamily",
  "labelsFontSize",
  "labelsFontColor",
  "separatorFontFamily",
  "separatorFontSize",
  "separatorFontColor",
  "backgroundColor"
];
function blocksById(document) {
  const blocks = /* @__PURE__ */ new Map();
  if (!isObject(document)) return blocks;
  for (const { node, container } of entities(document)) if (container) blocks.set(node.id, node);
  return blocks;
}
function advancedColorsEqual(left, right) {
  if (!isObject(left) || !isObject(right)) return left === right;
  return ["days", "hours", "minutes", "seconds"].every((key) => left[key] === right[key]);
}
function videoPreviewChanged(before, settings) {
  if (before?.type !== "video") {
    return settings.videoLink !== VIDEO_DEFAULTS.videoLink || settings.customThumbnail !== void 0 || settings.playButtonStyle !== VIDEO_DEFAULTS.playButtonStyle;
  }
  const previous = settingsOf(before);
  const thumbnail = (value) => isObject(value.customThumbnail) ? value.customThumbnail.src : void 0;
  return previous.videoLink !== settings.videoLink || thumbnail(previous) !== thumbnail(settings) || previous.playButtonStyle !== settings.playButtonStyle;
}
function timerPreviewChanged(before, settings) {
  if (before?.type !== "timer") return true;
  const previous = settingsOf(before);
  if (TIMER_PREVIEW_KEYS.some((key) => previous[key] !== settings[key])) return true;
  const labels = (value) => value.labelsLetterCase !== void 0;
  return labels(previous) !== labels(settings) || labels(settings) && previous.labelsLetterCase !== settings.labelsLetterCase || !advancedColorsEqual(previous.digitsAdvancedColorSettings, settings.digitsAdvancedColorSettings) || !advancedColorsEqual(previous.labelsAdvancedColorSettings, settings.labelsAdvancedColorSettings);
}
function getUnavailableMergeServiceSideEffects(current, target) {
  const before = blocksById(current);
  const video = [], timer = [];
  for (const [id, block] of blocksById(target)) {
    if (block.type === "video" && videoPreviewChanged(before.get(id), settingsOf(block))) video.push(String(id));
    if (block.type === "timer" && timerPreviewChanged(before.get(id), settingsOf(block))) timer.push(String(id));
  }
  return [
    ...video.length ? [{ kind: "VIDEO_PREVIEW", affectedBlockIds: video }] : [],
    ...timer.length ? [{ kind: "TIMER_PREVIEW", affectedBlockIds: timer }] : []
  ];
}

export {
  contextIssues,
  getUnavailableMergeServiceSideEffects
};

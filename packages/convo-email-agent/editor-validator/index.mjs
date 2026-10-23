/*! Stripo editor validator 9fe0771bd1219868d7053ef7e323dc3406329de3. Editor code is proprietary. See NOTICE.txt. */
import {
  DEFAULT_TEXT_BLOCK_SETTINGS,
  DEFAULT_VIDEO_BLOCK_SETTINGS,
  EMPTY_BORDER_SETTINGS,
  blockSchema,
  createEmailTemplateSetDocumentStateSchema,
  emailTemplateSchema
} from "./modules/AttributeConfigMigration-32d6d41af503.mjs";
import "./modules/time-zones-data-498efe19d3a8.mjs";
import "./modules/_DataView-3f8d51103b9f.mjs";
import "./modules/master-css-6656cf175550.mjs";
import "./modules/Parser-f35812371386.mjs";
import {
  ArrayUtils,
  EMPTY_BORDER_RADIUS,
  clearFontValue,
  parse
} from "./modules/ArrayUtils-759cc5f22881.mjs";
import "./modules/ColorUtils-a33f32974f73.mjs";
import "./modules/master-css-variables-defaults-fd88a551a3d8.mjs";
import "./modules/CSSConverter-608b83714731.mjs";
import "./modules/biesbjerg-ngx-translate-extract-marker-6a26f5bc5c0e.mjs";
import "./modules/master-css-variables-a84902889746.mjs";
import "./modules/ue-proto-87c1854705b4.mjs";
import "./modules/history-keys-1e69b42223b4.mjs";
import "./modules/master-80783f73f1e0.mjs";
import "./modules/coerce-d38c736de753.mjs";
import "./modules/from-json-schema-1979beab5102.mjs";
import "./modules/checks-bd1e5de0ca09.mjs";
import "./modules/index-18e3dd656b20.mjs";
import "./modules/ru-bc4e3a9b0c5d.mjs";
import "./modules/ta-db52cb61dd13.mjs";
import "./modules/th-0b76e62dab96.mjs";
import "./modules/uk-e0f612ccc576.mjs";
import "./modules/ur-d062d4183cb7.mjs";
import "./modules/vi-b05b5337c3b0.mjs";
import "./modules/yo-9342d8b90769.mjs";
import "./modules/ko-27b7a94f5634.mjs";
import "./modules/lt-52aa05368ec0.mjs";
import "./modules/mk-67b5345704f5.mjs";
import "./modules/ne-f804b66c7871.mjs";
import "./modules/pl-0edcc52c11a6.mjs";
import "./modules/ps-57feece82f75.mjs";
import "./modules/pt-BR-4ca29f9ccdf1.mjs";
import "./modules/pt-2b6363a9f827.mjs";
import "./modules/gu-0e230c44f6bd.mjs";
import "./modules/he-3eb1c1845d9e.mjs";
import "./modules/hi-bdb199026ff7.mjs";
import "./modules/hy-a38fb7e4f9ec.mjs";
import "./modules/ja-6478150f8d7a.mjs";
import "./modules/ka-337898cedd2a.mjs";
import "./modules/km-d158ab990ee9.mjs";
import "./modules/kn-ccd0d66753b1.mjs";
import "./modules/be-72979be88390.mjs";
import "./modules/bg-542c84614fee.mjs";
import "./modules/bn-60307a2c0766.mjs";
import "./modules/ckb-ddc82ea9c77a.mjs";
import "./modules/el-d2b74d96868d.mjs";
import "./modules/es-fc2f1ee63cca.mjs";
import "./modules/fa-b54c803455c1.mjs";
import "./modules/fr-4b4663c3d230.mjs";
import "./modules/json-schema-processors-0c244c7c3151.mjs";
import "./modules/to-json-schema-b5fe38b46dc6.mjs";
import "./modules/ar-e1d58fdd0495.mjs";
import "./modules/api-7ec6d993fe84.mjs";
import "./modules/registries-3ceb92ae3dab.mjs";
import "./modules/compile-fe1f1936d44e.mjs";
import "./modules/memoizer-c00f0bc54290.mjs";
import "./modules/doc-85ae2b2bbd32.mjs";
import "./modules/parse-545b503fc4ed.mjs";
import "./modules/checks-f4a190521e0d.mjs";
import "./modules/regexes-d1711c96e64b.mjs";
import "./modules/errors-095a9cd7e5fd.mjs";
import "./modules/core-d6ef11a90708.mjs";
import "./modules/document-13235feeff49.mjs";
import "./modules/map-generator-a34cf548f9d1.mjs";
import "./modules/at-rule-2b1e381bfcd5.mjs";
import "./modules/tokenize-acf2d687b44d.mjs";
import "./modules/tinycolor-2bf5fc1acbb7.mjs";
import "./modules/index-604a083968ff.mjs";
import "./modules/decode-codepoint-de4ce2c8771f.mjs";
import "./modules/decode-data-html-482e5b7a6675.mjs";
import "./modules/index-83a196bff650.mjs";
import "./modules/index-829c7f2491ea.mjs";
import "./modules/parse-8126121d6d62.mjs";
import "./modules/comment-c2c2abaee17f.mjs";
import "./modules/node-909c4f08098c.mjs";
import "./modules/stringifier-5d6259805667.mjs";
import "./modules/url-27db039aa4f6.mjs";
import "./modules/fs-064e509bf2cb.mjs";
import "./modules/terminal-highlight-0f20b1c39b48.mjs";
import "./modules/social-networks-data-4f7cb53fbb33.mjs";
import "./modules/SocialNetworkType-57875c573e3d.mjs";
import "./modules/index-578459128e2e.mjs";
import "./modules/_baseSlice-aae12ccd937b.mjs";
import "./modules/_Hash-6a5a8be86833.mjs";
import "./modules/serviceSelectorPrefix-db24995a76b3.mjs";
import "./modules/builders-6d4dedaf957f.mjs";
import "./modules/index-95be4dc08d9c.mjs";
import "./modules/index-8c9fdc3b457a.mjs";
import "./modules/proto-int64-27d7cd28885a.mjs";
import "./modules/shared-4f53cda18c2b.mjs";

// editor/ui-editor-ui/src/app/core/block-operations-api/text-block/settings/defaults.ts
function materializeIncomingTextBlockSettingsDefaults(block) {
  const settings = block.settings;
  const defaultPadding = DEFAULT_TEXT_BLOCK_SETTINGS.padding;
  if (settings === void 0) {
    const defaultAlignment = DEFAULT_TEXT_BLOCK_SETTINGS.alignment;
    return {
      ...block,
      settings: {
        ...DEFAULT_TEXT_BLOCK_SETTINGS,
        ...defaultAlignment ? { alignment: { ...defaultAlignment } } : {},
        padding: {
          desktop: { ...defaultPadding.desktop },
          mobile: { ...defaultPadding.mobile }
        }
      }
    };
  }
  if (!settings || typeof settings !== "object" || Array.isArray(settings)) {
    return block;
  }
  const rawSettings = settings;
  return {
    ...block,
    settings: {
      ...rawSettings,
      hideElement: rawSettings.hideElement === void 0 ? DEFAULT_TEXT_BLOCK_SETTINGS.hideElement : rawSettings.hideElement,
      rightToLeftTextDirection: rawSettings.rightToLeftTextDirection === void 0 ? DEFAULT_TEXT_BLOCK_SETTINGS.rightToLeftTextDirection : rawSettings.rightToLeftTextDirection,
      padding: rawSettings.padding === void 0 ? {
        desktop: { ...defaultPadding.desktop },
        mobile: { ...defaultPadding.mobile }
      } : rawSettings.padding,
      includeInOutput: rawSettings.includeInOutput === void 0 ? DEFAULT_TEXT_BLOCK_SETTINGS.includeInOutput : rawSettings.includeInOutput,
      backgroundColor: rawSettings.backgroundColor === void 0 ? DEFAULT_TEXT_BLOCK_SETTINGS.backgroundColor : rawSettings.backgroundColor
    }
  };
}

// editor/ui-editor-ui/src/app/core/block-operations-api/video-block/insert-contract.ts
function insertedVideoRequiresPreview(initial) {
  return initial.videoLink !== DEFAULT_VIDEO_BLOCK_SETTINGS.videoLink || initial.customThumbnail !== void 0 || initial.playButtonStyle !== DEFAULT_VIDEO_BLOCK_SETTINGS.playButtonStyle;
}

// convo-email-agent/vendor/editor-validator/side-effects.generated.ts
var TIMER_PREVIEW_SETTING_KEYS = [
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
function collectBlocksById(schema) {
  const blocks = /* @__PURE__ */ new Map();
  const collectContainers = (containers) => {
    containers?.forEach((container) => {
      container.blocks?.forEach((block) => blocks.set(block.id, block));
    });
  };
  schema.stripes?.forEach((stripe) => {
    stripe.structures?.forEach((structure) => {
      structure.columns?.forEach((column) => {
        collectContainers(column.containers);
      });
      collectContainers(structure.containers);
    });
  });
  return blocks;
}
function hasVideoPreviewSettingsChanged(currentBlock, targetBlock) {
  return currentBlock.settings.videoLink !== targetBlock.settings.videoLink || currentBlock.settings.customThumbnail?.src !== targetBlock.settings.customThumbnail?.src || currentBlock.settings.playButtonStyle !== targetBlock.settings.playButtonStyle;
}
function areTimerAdvancedColorsEqual(currentValue, targetValue) {
  if (!currentValue || !targetValue) {
    return currentValue === targetValue;
  }
  return currentValue.days === targetValue.days && currentValue.hours === targetValue.hours && currentValue.minutes === targetValue.minutes && currentValue.seconds === targetValue.seconds;
}
function hasTimerPreviewSettingsChanged(currentBlock, targetBlock) {
  if (TIMER_PREVIEW_SETTING_KEYS.some((key) => currentBlock.settings[key] !== targetBlock.settings[key])) {
    return true;
  }
  const currentLabelsEnabled = currentBlock.settings.labelsLetterCase !== void 0;
  const targetLabelsEnabled = targetBlock.settings.labelsLetterCase !== void 0;
  return currentLabelsEnabled !== targetLabelsEnabled || targetLabelsEnabled && currentBlock.settings.labelsLetterCase !== targetBlock.settings.labelsLetterCase || !areTimerAdvancedColorsEqual(
    currentBlock.settings.digitsAdvancedColorSettings,
    targetBlock.settings.digitsAdvancedColorSettings
  ) || !areTimerAdvancedColorsEqual(
    currentBlock.settings.labelsAdvancedColorSettings,
    targetBlock.settings.labelsAdvancedColorSettings
  );
}
function getUnavailableMergeServiceSideEffects(currentSchema, targetSchema) {
  const currentBlocks = collectBlocksById(currentSchema);
  const targetBlocks = collectBlocksById(targetSchema);
  const changedVideoBlockIds = [];
  const changedTimerBlockIds = [];
  for (const [blockId, targetBlock] of targetBlocks) {
    const currentBlock = currentBlocks.get(blockId);
    if (targetBlock.type === "video") {
      const videoPreviewUnavailable = currentBlock?.type === "video" ? hasVideoPreviewSettingsChanged(currentBlock, targetBlock) : insertedVideoRequiresPreview(targetBlock.settings);
      if (videoPreviewUnavailable) {
        changedVideoBlockIds.push(blockId);
      }
    }
    if (targetBlock.type === "timer" && (currentBlock?.type !== "timer" || hasTimerPreviewSettingsChanged(currentBlock, targetBlock))) {
      changedTimerBlockIds.push(blockId);
    }
  }
  const unavailableSideEffects = [];
  if (changedVideoBlockIds.length > 0) {
    unavailableSideEffects.push({ kind: "VIDEO_PREVIEW", affectedBlockIds: changedVideoBlockIds });
  }
  if (changedTimerBlockIds.length > 0) {
    unavailableSideEffects.push({ kind: "TIMER_PREVIEW", affectedBlockIds: changedTimerBlockIds });
  }
  return unavailableSideEffects;
}

// convo-email-agent/vendor/editor-validator/font-usage.generated.ts
var FONT_FAMILY_DECLARATION_REGEXP = /font-family\s*:\s*([^;{}<"]+)/gi;
var FONT_FACE_ATTR_REGEXP = /<font[^>]*\sface\s*=\s*["']([^"']+)["']/gi;
var QUOTE_ENTITY_REGEXP = /&(?:quot|apos|#0*34|#0*39);/gi;
var FontUtils = class _FontUtils {
  static toUsedFontValues(bodyString, declaredValues = []) {
    return [
      ..._FontUtils.collectDeclaredFontValues(bodyString),
      ...declaredValues
    ].map((value) => {
      const rawValue = String(value ?? "").trim();
      try {
        const declaration = parse("font-family: ".concat(rawValue)).first;
        return _FontUtils.clearFontValue(declaration?.type === "decl" ? declaration.value : rawValue);
      } catch {
        return _FontUtils.clearFontValue(rawValue);
      }
    }).filter(Boolean).filter(ArrayUtils.onlyUnique);
  }
  static collectDeclaredFontValues(bodyString) {
    if (!bodyString) {
      return [];
    }
    const html = bodyString.replace(QUOTE_ENTITY_REGEXP, "");
    return [
      ...Array.from(html.matchAll(FONT_FAMILY_DECLARATION_REGEXP)),
      ...Array.from(html.matchAll(FONT_FACE_ATTR_REGEXP))
    ].map((match) => (match[1] || "").trim());
  }
  static clearFontValue(fontValue) {
    return clearFontValue(fontValue);
  }
};
var collectUsedFontValues = FontUtils.toUsedFontValues;

// convo-email-agent/vendor/editor-validator/entry.ts
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function cloneBorder() {
  return {
    ...EMPTY_BORDER_SETTINGS,
    top: { ...EMPTY_BORDER_SETTINGS.top },
    right: { ...EMPTY_BORDER_SETTINGS.right },
    bottom: { ...EMPTY_BORDER_SETTINGS.bottom },
    left: { ...EMPTY_BORDER_SETTINGS.left }
  };
}
function materializeContainer(container) {
  if (!isObject(container) || !Array.isArray(container.blocks)) {
    return container;
  }
  return {
    ...container,
    blocks: container.blocks.map((block) => isObject(block) && block.type === "text" ? materializeIncomingTextBlockSettingsDefaults(block) : block)
  };
}
function materializeColumn(column) {
  if (!isObject(column) || !Array.isArray(column.containers)) {
    return column;
  }
  return { ...column, containers: column.containers.map(materializeContainer) };
}
function materializeStructure(structure) {
  if (!isObject(structure)) {
    return structure;
  }
  const columns = Array.isArray(structure.columns) ? structure.columns.map(materializeColumn) : structure.columns;
  const settings = structure.settings;
  if (!isObject(settings)) {
    return { ...structure, columns };
  }
  const rawSettings = { ...settings };
  delete rawSettings.widthColumns;
  return {
    ...structure,
    columns,
    settings: {
      ...rawSettings,
      backgroundColor: rawSettings.backgroundColor === void 0 ? "transparent" : rawSettings.backgroundColor,
      border: rawSettings.border === void 0 ? cloneBorder() : rawSettings.border,
      borderRadius: rawSettings.borderRadius === void 0 ? { ...EMPTY_BORDER_RADIUS } : rawSettings.borderRadius
    }
  };
}
function materializeMetadataOmissions(target, current) {
  const currentMetadata = isObject(current?.metadata) ? current.metadata : void 0;
  const rawMetadata = target.metadata;
  if (rawMetadata === void 0) {
    return currentMetadata ? { ...target, metadata: structuredClone(currentMetadata) } : target;
  }
  if (!isObject(rawMetadata)) {
    return target;
  }
  return {
    ...target,
    metadata: {
      ...rawMetadata,
      ...rawMetadata.title === void 0 && currentMetadata?.title !== void 0 ? { title: currentMetadata.title } : {},
      ...rawMetadata.preheader === void 0 && isObject(currentMetadata?.preheader) ? { preheader: { ...currentMetadata.preheader } } : {}
    }
  };
}
function materializeIncomingDocumentState(target, current) {
  if (!isObject(target)) {
    return target;
  }
  const currentDocument = isObject(current) ? current : void 0;
  const withStripes = Array.isArray(target.stripes) ? {
    ...target,
    stripes: target.stripes.map((stripe) => isObject(stripe) && Array.isArray(stripe.structures) ? { ...stripe, structures: stripe.structures.map(materializeStructure) } : stripe)
  } : target;
  return currentDocument ? materializeMetadataOmissions(withStripes, currentDocument) : withStripes;
}
function toIssue(issue) {
  return {
    path: issue.path.map((segment) => typeof segment === "number" ? segment : String(segment)),
    code: issue.code,
    message: issue.message,
    ...issue.keys ? { keys: [...issue.keys] } : {},
    ...typeof issue.expected === "string" ? { expected: issue.expected } : {},
    ...issue.values ? { values: [...issue.values] } : {},
    ...issue.errors && issue.errors.length > 0 ? { branches: issue.errors.map((branch) => branch.map((nested) => toIssue(nested))) } : {}
  };
}
function validateDocumentState(target, current) {
  let currentDocument = { stripes: [] };
  if (current !== void 0) {
    const parsedCurrent = emailTemplateSchema.safeParse(materializeIncomingDocumentState(current));
    if (!parsedCurrent.success) {
      return { success: false, input: "current", issues: parsedCurrent.error.issues.map((issue) => toIssue(issue)) };
    }
    currentDocument = parsedCurrent.data;
  }
  const schema = createEmailTemplateSetDocumentStateSchema(currentDocument);
  const result = schema.safeParse(materializeIncomingDocumentState(target, currentDocument));
  if (result.success) {
    return { success: true, issues: [], documentState: result.data };
  }
  return { success: false, input: "target", issues: result.error.issues.map((issue) => toIssue(issue)) };
}
function validateDocumentSnapshot(document) {
  const result = emailTemplateSchema.safeParse(materializeIncomingDocumentState(document));
  return result.success ? { success: true, issues: [], documentState: result.data } : { success: false, input: "current", issues: result.error.issues.map((issue) => toIssue(issue)) };
}
function validateBlock(block) {
  const result = blockSchema.safeParse(block);
  return result.success ? { success: true, issues: [], documentState: result.data } : { success: false, input: "target", issues: result.error.issues.map((issue) => toIssue(issue)) };
}
export {
  clearFontValue as canonicalFontValue,
  collectUsedFontValues,
  getUnavailableMergeServiceSideEffects,
  validateBlock,
  validateDocumentSnapshot,
  validateDocumentState
};

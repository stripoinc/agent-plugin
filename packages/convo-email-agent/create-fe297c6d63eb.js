import {
  createEmailMutationSdk,
  uniqueUuidFromSeed
} from "./content-mutations-15913d881744.js";
import {
  EditorJsonMutationCore,
  assertValidEmailModel
} from "./model-2461f952bfd9.js";
import {
  DocumentStateError,
  contractDefaults,
  jsonIssues
} from "./contract-c566956db999.js";
import {
  SOCIAL_BLOCK_DEFAULT_SETTINGS,
  buildSocialNetwork,
  completeNativeSocialNetwork,
  normalizeIconSize,
  normalizeSocialAlignment,
  normalizeSpaceBetweenIcons,
  resolveTextCustomization
} from "./social-f4a8e0da8c68.js";
import {
  EmailSdkError,
  assertMetadataTextLimits,
  deepFreeze
} from "./errors-3ee69a7e1eb0.js";

// convo-email-agent/src/sdk/create.ts
import { validateBlock } from "./editor-validator/index.mjs";
var DEFAULT_THEME = {
  contentWidth: 600,
  backgroundColor: "#ffffff",
  contentBackgroundColor: "#ffffff",
  fontFamily: "Arial, sans-serif",
  fontColor: "#333333",
  linkColor: "#1376c8",
  buttonColor: "#1376c8",
  buttonTextColor: "#ffffff"
};
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function cloneJson(value) {
  return structuredClone(value);
}
function mergeJson(base, override) {
  if (override === void 0) return cloneJson(base);
  if (!isObject(override)) throw new EmailSdkError("Email settings must be an object.");
  const result = cloneJson(base);
  for (const [key, value] of Object.entries(override)) {
    if (isObject(result[key]) && isObject(value)) {
      result[key] = mergeJson(result[key], value);
    } else {
      result[key] = cloneJson(value);
    }
  }
  return result;
}
function normalizeTheme(theme) {
  return { ...DEFAULT_THEME, ...theme };
}
function sides(value = 0) {
  return { top: value, right: value, bottom: value, left: value };
}
function responsiveSides(desktop = 0, mobile = desktop) {
  return {
    desktop: sides(desktop),
    mobile: sides(mobile)
  };
}
function border(color = "transparent", width = 0) {
  return {
    top: { color, width },
    right: { color, width },
    bottom: { color, width },
    left: { color, width },
    style: "solid"
  };
}
function radius(value = 0) {
  return {
    topLeft: value,
    topRight: value,
    bottomRight: value,
    bottomLeft: value
  };
}
function responsiveRadius(value = 0) {
  return {
    desktop: radius(value),
    mobile: radius(value)
  };
}
function collectIds(value) {
  const ids = [];
  const stack = [value];
  while (stack.length > 0) {
    const current = stack.pop();
    if (Array.isArray(current)) {
      for (const child of current) stack.push(child);
      continue;
    }
    if (!isObject(current)) continue;
    if (typeof current.id === "string") ids.push(current.id);
    for (const child of Object.values(current)) stack.push(child);
  }
  return ids;
}
function idIssuer(idFactory, initialTaken = []) {
  const issued = new Set(initialTaken);
  return (seed) => {
    const id = idFactory?.(seed, (candidate) => issued.has(candidate)) ?? uniqueUuidFromSeed(`email-builder:${seed}`, (candidate) => issued.has(candidate));
    if (issued.has(id)) {
      throw new EmailSdkError(`idFactory returned duplicate id "${id}" for seed "${seed}".`);
    }
    issued.add(id);
    return id;
  };
}
function assertNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new EmailSdkError(`${label} must be a non-empty string.`);
  }
}
function assertEditorSeed(value) {
  if (!isObject(value)) {
    throw new EmailSdkError("Seed email JSON must be a Stripo editor JSON object.");
  }
  if (typeof value.html === "string" || typeof value.css === "string") {
    throw new EmailSdkError(
      "Campaign export JSON with html/css cannot be used as a builder seed. Pass Stripo editor JSON."
    );
  }
  if (!isObject(value.settings) || !Array.isArray(value.stripes)) {
    throw new EmailSdkError("Seed email JSON must include a top-level settings object and stripes array.");
  }
}
function setPath(target, path, value) {
  if (path.length === 0 || path.some((part) => part === "")) {
    throw new EmailSdkError("Theme path must not be empty.");
  }
  if (path[0] !== "settings") {
    throw new EmailSdkError(`Theme path must start with "settings.", got "${path.join(".")}".`);
  }
  let current = target;
  for (const segment of path.slice(0, -1)) {
    const next = current[segment];
    if (!isObject(next)) {
      current[segment] = {};
    }
    current = current[segment];
  }
  current[path[path.length - 1]] = cloneJson(value);
}
function buttonLink(href) {
  return /^mailto:/iu.test(href) ? { type: "email", value: normalizeMailto(href) } : { type: "site", value: href };
}
function buttonBlock(id, options) {
  return {
    id,
    type: "button",
    settings: {
      alignment: { desktop: "center", mobile: "center" },
      anchorLink: "",
      text: options.text,
      hideElement: "no",
      padding: responsiveSides(12),
      margins: responsiveSides(0),
      includeInOutput: "both",
      backgroundColor: options.theme.buttonColor,
      fontFamily: options.theme.fontFamily,
      fontSize: { desktop: 16, mobile: 16 },
      textStyle: { bold: false, italic: false },
      fitContainer: { desktop: false, mobile: false },
      blockBackgroundColor: "transparent",
      borderRadius: radius(8),
      border: border(options.theme.buttonColor, 0),
      fontColor: options.theme.buttonTextColor,
      link: buttonLink(options.href)
    }
  };
}
function textBlock(id, html, theme = DEFAULT_THEME) {
  return {
    id,
    type: "text",
    content: html,
    settings: {
      backgroundColor: "transparent",
      fontColor: theme.fontColor,
      hideElement: "no",
      includeInOutput: "both",
      padding: responsiveSides(0),
      rightToLeftTextDirection: false
    }
  };
}
function imageBlock(id, options) {
  const settings = {
    src: options.src,
    altText: { addToTitle: true, text: options.alt ?? "" },
    size: {
      // The live Stripo editor requires mobile size to MATCH desktop size when
      // responsiveMobile is enabled (updateSchema VALIDATION_ERROR otherwise).
      desktop: { mode: "width", px: 600 },
      mobile: { mode: "width", px: 600 }
    },
    alignment: { desktop: "center", mobile: "center" },
    radius: responsiveRadius(0),
    hideElement: "no",
    margins: responsiveSides(0),
    includeInOutput: "both",
    anchorLinkName: "",
    responsiveMobile: true
  };
  if (options.href !== void 0) {
    settings.link = { type: "site", href: options.href };
  }
  return {
    id,
    type: "image",
    settings
  };
}
function spacerBlock(id) {
  return {
    id,
    type: "spacer",
    settings: {
      mode: "space",
      height: { desktop: 20, mobile: 20 },
      backgroundColor: "transparent",
      margins: responsiveSides(0),
      anchorLinkName: "",
      includeInOutput: "both",
      hideElement: "no"
    }
  };
}
function socialBlock(id, options) {
  if (!isObject(options) || !Array.isArray(options.networks) || options.networks.length === 0) {
    throw new EmailSdkError("Social block requires a non-empty networks array.");
  }
  const textCustomization = options.textCustomization ?? options.networks.some((network) => isObject(network) && network.alt !== void 0);
  const settings = {
    ...cloneJson(SOCIAL_BLOCK_DEFAULT_SETTINGS),
    networks: options.networks.map((network) => buildSocialNetwork(network, textCustomization)),
    textCustomization
  };
  if (options.style !== void 0) settings.style = options.style;
  if (options.iconSize !== void 0) settings.iconSize = normalizeIconSize(options.iconSize);
  if (options.spaceBetweenIcons !== void 0) settings.spaceBetweenIcons = normalizeSpaceBetweenIcons(options.spaceBetweenIcons);
  if (options.alignment !== void 0) settings.alignment = normalizeSocialAlignment(options.alignment);
  return { id, type: "social", settings };
}
var SPACER_LINE_DEFAULTS = {
  width: {
    desktop: { value: 100, unit: "percent" },
    mobile: { value: 100, unit: "percent" }
  },
  border: { size: 1, style: "solid", color: "#cccccc" },
  alignment: { desktop: "center", mobile: "center" }
};
function stripeSettings(area, theme) {
  return {
    contentBackgroundColor: area === "content" ? theme.contentBackgroundColor : "transparent",
    contentBorder: border(),
    hideElement: "no",
    includeInOutput: "both",
    messageArea: area,
    padding: {
      mobile: sides(0)
    },
    stripeBackgroundColor: area === "content" ? theme.backgroundColor : "transparent"
  };
}
function structureSettings() {
  return {
    backgroundColor: "transparent",
    border: border(),
    borderRadius: radius(0),
    columnsGap: { desktop: 0, mobile: 0 },
    hideElement: "no",
    includeInOutput: "both",
    margins: responsiveSides(0),
    padding: responsiveSides(0),
    responsiveMobileContainersInversion: false
  };
}
function containerSettings(theme) {
  return {
    backgroundColor: "transparent",
    border: border(),
    hideElement: "no",
    includeInOutput: "both",
    padding: responsiveSides(0),
    radius: radius(0)
  };
}
function sectionStripe(ids, area, blocks, theme = DEFAULT_THEME) {
  return {
    id: ids.stripe,
    settings: stripeSettings(area, theme),
    structures: [
      {
        id: ids.structure,
        settings: structureSettings(),
        columns: [
          {
            id: ids.column,
            settings: { width: theme.contentWidth },
            containers: [
              {
                id: ids.container,
                settings: containerSettings(theme),
                blocks
              }
            ]
          }
        ]
      }
    ]
  };
}
function componentStripe(idPrefix, area, blocks) {
  return sectionStripe(
    {
      stripe: `${idPrefix}-stripe`,
      structure: `${idPrefix}-structure`,
      column: `${idPrefix}-column`,
      container: `${idPrefix}-container`
    },
    area,
    blocks
  );
}
var HEADING_LEVELS = ["h1", "h2", "h3", "h4", "h5", "h6"];
function themeBranches(lightTheme) {
  const unset = (value) => isObject(value) ? Object.fromEntries(Object.entries(value).map(([key, child]) => [key, unset(child)])) : null;
  return { lightTheme, darkTheme: unset(lightTheme) };
}
function fourSides(value) {
  return { top: value(), right: value(), bottom: value(), left: value() };
}
function baseSettings(themeInput) {
  const theme = normalizeTheme(themeInput);
  const areaColors = (withStripeBackground) => ({
    ...withStripeBackground ? { stripeBackgroundColor: theme.backgroundColor } : {},
    contentBackgroundColor: theme.contentBackgroundColor,
    fontColor: theme.fontColor,
    linkColor: theme.linkColor,
    linkColorHover: theme.linkColor
  });
  const heading = (desktop, mobile, mobileAlign) => ({
    textAlign: { mobile: mobileAlign },
    textStyle: { italic: false },
    fontWeight: 400,
    fontSize: { desktop, mobile },
    lineHeight: { desktop: 1.2, mobile: 1.2 },
    paragraphBottomSpace: null
  });
  return {
    general: {
      defaultStyles: true,
      hideImageDownloadIcons: false,
      underlineLinks: true,
      responsiveDesign: true,
      messageAlignment: "center",
      messageContentWidth: theme.contentWidth,
      backgroundImage: null,
      rightToLeftTextDirection: false,
      marginsAroundMessage: responsiveSides(0),
      defaultStructurePadding: responsiveSides(0),
      customListStyles: null,
      ...themeBranches({
        backgroundColor: theme.backgroundColor,
        customListStyles: { listMarkerColor: theme.fontColor, listNumberMarkerColor: theme.fontColor }
      })
    },
    stripes: {
      letterSpacing: { unit: "px", value: 0 },
      lineHeight: { desktop: 1.5, mobile: 1.5 },
      fontFamily: theme.fontFamily,
      fontWeight: 400,
      header: { fontSize: { desktop: 14, mobile: 16 }, paragraphBottomSpace: null, backgroundImage: null },
      content: { fontSize: { desktop: 14, mobile: 16 }, paragraphBottomSpace: null },
      footer: { fontSize: { desktop: 12, mobile: 12 }, paragraphBottomSpace: null, backgroundImage: null },
      infoArea: { fontSize: { desktop: 12, mobile: 12 }, paragraphBottomSpace: null },
      ...themeBranches({
        header: areaColors(true),
        content: areaColors(false),
        footer: areaColors(true),
        infoArea: { fontColor: theme.fontColor, linkColor: theme.linkColor, linkColorHover: theme.linkColor }
      })
    },
    headings: {
      letterSpacing: { unit: "px", value: 0 },
      fontFamily: theme.fontFamily,
      h1: heading(32, 30, "left"),
      h2: heading(24, 22, "left"),
      h3: heading(20, 18, "left"),
      h4: heading(18, 18, "left"),
      h5: heading(16, 16, "left"),
      h6: heading(14, 14, "left"),
      ...themeBranches(Object.fromEntries(HEADING_LEVELS.map((level) => [level, { fontColor: theme.fontColor }])))
    },
    buttons: {
      outlookSupport: true,
      textStyle: { bold: false, italic: false },
      textTransform: "none",
      fontFamily: theme.fontFamily,
      letterSpacing: { unit: "px", value: 0 },
      fontSize: { desktop: 16, mobile: 16 },
      borderRadius: radius(8),
      fitContainer: { desktop: false, mobile: false },
      border: { ...fourSides(() => ({ width: 0 })), style: "solid" },
      hoverButtonStyles: false,
      padding: responsiveSides(12),
      ...themeBranches({
        buttonColor: theme.buttonColor,
        fontColor: theme.buttonTextColor,
        hoverButtonStyles: {
          backgroundColor: theme.buttonColor,
          fontColor: theme.buttonTextColor,
          borderColor: fourSides(() => theme.buttonColor)
        },
        borderColor: fourSides(() => theme.buttonColor)
      })
    }
  };
}
function createMinimalEmailSeed(options = {}) {
  const issueId = idIssuer(options.idFactory);
  const theme = normalizeTheme(options.theme);
  const ids = {
    stripe: issueId("seed:content-stripe"),
    structure: issueId("seed:content-structure"),
    column: issueId("seed:content-column"),
    container: issueId("seed:content-container"),
    block: issueId("seed:content-block")
  };
  return {
    settings: baseSettings(options.theme),
    stripes: [
      sectionStripe(ids, "content", [textBlock(ids.block, "<p></p>", theme)], theme)
    ]
  };
}
function assertNonEmptyArray(value, label) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new EmailSdkError(`${label} must be a non-empty array.`);
  }
}
function createEmailFromDraft(options) {
  assertNoSchemaOption(options);
  const inputProblems = [...jsonIssues(options.emailJson), ...options.baselineEmailJson === void 0 ? [] : jsonIssues(options.baselineEmailJson, "current")];
  if (inputProblems.length) throw new DocumentStateError(inputProblems);
  if (!isObject(options.emailJson)) throw new EmailSdkError("emailJson must be a native editor JSON object.");
  if (options.baselineEmailJson !== void 0) {
    assertValidEmailModel(options.baselineEmailJson, { current: options.baselineEmailJson });
  }
  const baseline = isObject(options.baselineEmailJson) ? cloneJson(options.baselineEmailJson) : void 0;
  const draft = { ...baseline, ...cloneJson(options.emailJson) };
  draft.settings = mergeJson(baseSettings(void 0), options.emailJson.settings);
  const globalSettings = draft.settings;
  const lightTheme = (section) => objectValue(objectValue(globalSettings[section], `settings.${section}`).lightTheme, `settings.${section}.lightTheme`);
  const general = lightTheme("general");
  const areas = lightTheme("stripes");
  const buttons = objectValue(globalSettings.buttons, "settings.buttons");
  const buttonColors = lightTheme("buttons");
  const issueId = idIssuer(options.idFactory, collectIds(draft));
  const seenIds = /* @__PURE__ */ new Set();
  function objectValue(value, label) {
    if (!isObject(value)) throw new EmailSdkError(`${label} must be an object.`);
    return value;
  }
  function settingsOf(node, label) {
    return node.settings === void 0 ? {} : objectValue(node.settings, `${label}.settings`);
  }
  function children(node, key, label) {
    const value = node[key];
    assertNonEmptyArray(value, `${label}.${key}`);
    return value.map((child, index) => objectValue(child, `${label}.${key}[${index}]`));
  }
  function fillNode(node, defaults, label) {
    const suppliedId = node.id !== void 0;
    if (!suppliedId) node.id = issueId(label);
    assertNonEmptyString(node.id, `${label}.id`);
    if (seenIds.has(node.id) && options.baselineEmailJson === void 0) throw new EmailSdkError(`Duplicate editor id "${node.id}" at ${label}.`);
    seenIds.add(node.id);
    if (suppliedId && options.regenerateIds) node.id = issueId(label);
    node.settings = mergeJson(defaults, settingsOf(node, label));
  }
  children(draft, "stripes", "emailJson").forEach((stripe, stripeIndex) => {
    const stripePath = `emailJson.stripes[${stripeIndex}]`;
    const area = settingsOf(stripe, stripePath).messageArea ?? "content";
    assertNonEmptyString(area, `${stripePath}.settings.messageArea`);
    const areaSettings = areas[area] === void 0 ? {} : objectValue(areas[area], `settings.stripes.lightTheme.${area}`);
    const stripeDefaults = stripeSettings(area, DEFAULT_THEME);
    stripeDefaults.contentBackgroundColor = areaSettings.contentBackgroundColor ?? DEFAULT_THEME.contentBackgroundColor;
    stripeDefaults.stripeBackgroundColor = areaSettings.stripeBackgroundColor ?? general.backgroundColor;
    fillNode(stripe, stripeDefaults, stripePath);
    children(stripe, "structures", stripePath).forEach((structure, structureIndex) => {
      const structurePath = `${stripePath}.structures[${structureIndex}]`;
      fillNode(structure, structureSettings(), structurePath);
      children(structure, "columns", structurePath).forEach((column, columnIndex) => {
        const columnPath = `${structurePath}.columns[${columnIndex}]`;
        const width = settingsOf(column, columnPath).width;
        if (typeof width !== "number" || !Number.isFinite(width) || width <= 0) {
          throw new EmailSdkError(`${columnPath}.settings.width must be a positive finite column weight.`);
        }
        fillNode(column, {}, columnPath);
        children(column, "containers", columnPath).forEach((container, containerIndex) => {
          const containerPath = `${columnPath}.containers[${containerIndex}]`;
          fillNode(container, containerSettings(DEFAULT_THEME), containerPath);
          children(container, "blocks", containerPath).forEach((block, blockIndex) => {
            const blockPath = `${containerPath}.blocks[${blockIndex}]`;
            const supplied = settingsOf(block, blockPath);
            let defaults;
            switch (block.type) {
              case "text":
                assertNonEmptyString(block.content, `${blockPath}.content`);
                defaults = textBlock("", "").settings;
                defaults.backgroundColor = "transparent";
                defaults.fontColor = areaSettings.fontColor ?? DEFAULT_THEME.fontColor;
                break;
              case "image": {
                assertNonEmptyString(supplied.src, `${blockPath}.settings.src`);
                defaults = imageBlock("", { src: supplied.src, alt: "" }).settings;
                const size = isObject(supplied.size) ? supplied.size : {};
                const desktop = mergeJson({ mode: "width", px: width }, size.desktop);
                defaults.size = { desktop: cloneJson(desktop), mobile: cloneJson(desktop) };
                break;
              }
              case "button": {
                assertNonEmptyString(supplied.text, `${blockPath}.settings.text`);
                const link = objectValue(supplied.link, `${blockPath}.settings.link`);
                if (link.type === "email" && typeof link.value === "string" && link.value !== "") {
                  link.value = normalizeMailto(link.value);
                }
                defaults = buttonBlock("", { text: "", href: "", theme: DEFAULT_THEME }).settings;
                for (const key of Object.keys(defaults)) {
                  if (key !== "border" && Object.hasOwn(buttons, key)) defaults[key] = cloneJson(buttons[key]);
                }
                const borderWidths = objectValue(buttons.border, "settings.buttons.border");
                const borderColors = objectValue(buttonColors.borderColor, "settings.buttons.lightTheme.borderColor");
                defaults.border = {
                  ...Object.fromEntries(["top", "right", "bottom", "left"].map((side) => [side, {
                    width: objectValue(borderWidths[side], `settings.buttons.border.${side}`).width,
                    color: borderColors[side]
                  }])),
                  style: borderWidths.style
                };
                defaults.backgroundColor = buttonColors.buttonColor;
                defaults.fontColor = buttonColors.fontColor;
                delete defaults.text;
                delete defaults.link;
                break;
              }
              case "spacer":
                defaults = spacerBlock("").settings;
                if (supplied.mode === "line") {
                  delete defaults.height;
                  Object.assign(defaults, cloneJson(SPACER_LINE_DEFAULTS));
                }
                break;
              case "social": {
                const networks = supplied.networks;
                assertNonEmptyArray(networks, `${blockPath}.settings.networks`);
                const textCustomization = resolveTextCustomization(supplied, networks);
                supplied.networks = networks.map((network, index) => completeNativeSocialNetwork(objectValue(network, `${blockPath}.settings.networks[${index}]`), textCustomization));
                supplied.textCustomization = textCustomization;
                block.settings = supplied;
                defaults = cloneJson(SOCIAL_BLOCK_DEFAULT_SETTINGS);
                break;
              }
              default:
                assertNonEmptyString(block.type, `${blockPath}.type`);
                defaults = contractDefaults(block.type);
            }
            fillNode(block, block.type === "timer" && validateBlock(block).success ? {} : defaults, blockPath);
          });
        });
      });
    });
  });
  const completed = new EditorJsonMutationCore(draft, void 0, { current: options.baselineEmailJson }).apply(options.intent);
  assertMetadataTextLimits(completed.metadata, options.baselineEmailJson?.metadata);
  return completed;
}
var minimalEmailComponents = Object.freeze({
  "L1/text-section.json": {
    level: "L1",
    node: componentStripe(
      "minimal-text",
      "content",
      [textBlock("minimal-text-body", "<p>Text section</p>")]
    ),
    slots: Object.freeze([{ role: "body", blockType: "text", pointer: "/structures/0/columns/0/containers/0/blocks/0" }])
  },
  "L1/image-section.json": {
    level: "L1",
    node: componentStripe(
      "minimal-image",
      "content",
      [imageBlock("minimal-image-image", { src: "https://example.com/image.png", alt: "Image" })]
    ),
    slots: Object.freeze([{ role: "image", blockType: "image", pointer: "/structures/0/columns/0/containers/0/blocks/0" }])
  },
  "L1/button-section.json": {
    level: "L1",
    node: componentStripe(
      "minimal-button",
      "content",
      [buttonBlock("minimal-button-cta", { text: "Start now", href: "https://example.com", theme: DEFAULT_THEME })]
    ),
    slots: Object.freeze([{ role: "cta", blockType: "button", pointer: "/structures/0/columns/0/containers/0/blocks/0" }])
  },
  "L1/social-section.json": {
    level: "L1",
    node: componentStripe(
      "minimal-social",
      "footer",
      [socialBlock("minimal-social-icons", {
        networks: [
          { type: "facebook", url: "https://www.facebook.com/example" },
          { type: "xcom", url: "https://x.com/example" },
          { type: "instagram", url: "https://www.instagram.com/example" },
          { type: "youtube", url: "https://www.youtube.com/@example" }
        ]
      })]
    ),
    slots: Object.freeze([{ role: "social", blockType: "social", pointer: "/structures/0/columns/0/containers/0/blocks/0" }])
  },
  "L1/footer-section.json": {
    level: "L1",
    node: componentStripe(
      "minimal-footer",
      "footer",
      [
        textBlock("minimal-footer-legal", "<p>You are receiving this email because you subscribed.</p>"),
        textBlock("minimal-footer-unsubscribe", '<p><a href="https://example.com/unsubscribe">Unsubscribe</a></p>')
      ]
    ),
    slots: Object.freeze([
      { role: "legal", blockType: "text", pointer: "/structures/0/columns/0/containers/0/blocks/0" },
      { role: "unsubscribe", blockType: "text", pointer: "/structures/0/columns/0/containers/0/blocks/1" }
    ])
  }
});
function normalizeMailto(value) {
  const match = /^mailto:/iu.exec(value);
  return match ? `mailto:${value.slice(match[0].length)}` : `mailto:${value}`;
}
function assertNoSchemaOption(options) {
  if (Object.hasOwn(options, "schema")) {
    throw new EmailSdkError(
      "Email creation no longer accepts a schema option. Validation runs the editor rules bundled with the SDK; no schema setup is needed."
    );
  }
}
function stripesFromDraft(draft) {
  return Array.isArray(draft.stripes) ? draft.stripes.filter(isObject) : [];
}
function createEmailBuilder(options = {}) {
  assertNoSchemaOption(options);
  const theme = normalizeTheme(options.theme);
  let draft = cloneJson(options.seedEmailJson ?? createMinimalEmailSeed(options));
  assertEditorSeed(draft);
  const seedPlaceholderIds = options.seedEmailJson === void 0 ? new Set(stripesFromDraft(draft).map((stripe) => String(stripe.id))) : /* @__PURE__ */ new Set();
  const issueId = idIssuer(options.idFactory, collectIds(draft));
  const warnings = [];
  let validation = "pending";
  let mutationCount = 0;
  let sectionCount = 0;
  let sealed = false;
  const lastInsertByAnchor = /* @__PURE__ */ new Map();
  function assertNotSealed() {
    if (sealed) throw new EmailSdkError("The builder already finished \u2014 late mutations are not allowed.");
  }
  function stripes() {
    if (!Array.isArray(draft.stripes)) draft.stripes = [];
    return draft.stripes;
  }
  function nextIds(kind) {
    const ordinal = sectionCount + 1;
    return {
      stripe: issueId(`${kind}:${ordinal}:stripe`),
      structure: issueId(`${kind}:${ordinal}:structure`),
      column: issueId(`${kind}:${ordinal}:column`),
      container: issueId(`${kind}:${ordinal}:container`),
      block: issueId(`${kind}:${ordinal}:block`)
    };
  }
  function resolveAfter(after) {
    if (after === void 0) return void 0;
    if (typeof after === "string") return after;
    if (typeof after.id === "string") return after.id;
    throw new EmailSdkError("after must be a section id or a section handle returned by the builder.");
  }
  function insertStripe(stripe, after) {
    const list = stripes();
    const afterId = resolveAfter(after);
    if (afterId !== void 0) {
      const effectiveAfterId = lastInsertByAnchor.get(afterId) ?? afterId;
      const index = list.findIndex((item) => isObject(item) && item.id === effectiveAfterId);
      if (index === -1) throw new EmailSdkError(`after section "${afterId}" was not found.`);
      list.splice(index + 1, 0, stripe);
      lastInsertByAnchor.set(afterId, String(stripe.id));
    } else {
      list.push(stripe);
    }
    sectionCount += 1;
    mutationCount += 1;
    const area = isObject(stripe.settings) && typeof stripe.settings.messageArea === "string" ? stripe.settings.messageArea : "content";
    return Object.freeze({ id: String(stripe.id), area });
  }
  function removeUnusedPlaceholders() {
    draft.stripes = stripes().filter((stripe) => !seedPlaceholderIds.has(String(stripe.id)));
  }
  function validateAndClone(context) {
    try {
      const result = context === "finish" ? new EditorJsonMutationCore(draft).apply() : new EditorJsonMutationCore(draft).snapshot();
      if (context === "finish") validation = "passed";
      return result;
    } catch (error) {
      if (context === "finish") validation = "failed";
      throw error;
    }
  }
  const builder = {
    addTextSection(sectionOptions) {
      assertNotSealed();
      assertNonEmptyString(sectionOptions.html, "Text section html");
      const ids = nextIds("text-section");
      const stripe = sectionStripe(ids, sectionOptions.area ?? "content", [textBlock(ids.block, sectionOptions.html, theme)], theme);
      return insertStripe(stripe, sectionOptions.after);
    },
    addImageSection(sectionOptions) {
      assertNotSealed();
      assertNonEmptyString(sectionOptions.src, "Image src");
      const ids = nextIds("image-section");
      const stripe = sectionStripe(ids, sectionOptions.area ?? "content", [imageBlock(ids.block, sectionOptions)], theme);
      return insertStripe(stripe, sectionOptions.after);
    },
    addButtonSection(sectionOptions) {
      assertNotSealed();
      assertNonEmptyString(sectionOptions.text, "Button text");
      assertNonEmptyString(sectionOptions.href, "Button href");
      const ids = nextIds("button-section");
      const stripe = sectionStripe(ids, sectionOptions.area ?? "content", [
        buttonBlock(ids.block, { text: sectionOptions.text, href: sectionOptions.href, theme })
      ], theme);
      return insertStripe(stripe, sectionOptions.after);
    },
    addSocialSection(sectionOptions) {
      assertNotSealed();
      const ids = nextIds("social-section");
      const stripe = sectionStripe(ids, sectionOptions.area ?? "footer", [socialBlock(ids.block, sectionOptions)], theme);
      return insertStripe(stripe, sectionOptions.after);
    },
    addFooterSection(sectionOptions) {
      assertNotSealed();
      const ids = nextIds("footer-section");
      const blocks = [];
      if (sectionOptions.legalHtml !== void 0) {
        assertNonEmptyString(sectionOptions.legalHtml, "Footer legalHtml");
        blocks.push(textBlock(ids.block, sectionOptions.legalHtml, theme));
      }
      if (sectionOptions.addressHtml !== void 0) {
        assertNonEmptyString(sectionOptions.addressHtml, "Footer addressHtml");
        blocks.push(textBlock(issueId(`footer-section:${sectionCount + 1}:address-block`), sectionOptions.addressHtml, theme));
      }
      if (sectionOptions.unsubscribeHref !== void 0) {
        assertNonEmptyString(sectionOptions.unsubscribeHref, "Footer unsubscribeHref");
        blocks.push(textBlock(
          issueId(`footer-section:${sectionCount + 1}:unsubscribe-block`),
          `<p><a href="${sectionOptions.unsubscribeHref}">Unsubscribe</a></p>`,
          theme
        ));
      }
      if (blocks.length === 0) {
        blocks.push(textBlock(ids.block, "<p>You are receiving this email because you subscribed.</p>", theme));
      }
      const stripe = sectionStripe(ids, sectionOptions.area ?? "footer", blocks, theme);
      return insertStripe(stripe, sectionOptions.after);
    },
    setTheme(path, value) {
      assertNotSealed();
      assertNonEmptyString(path, "Theme path");
      setPath(draft, path.split("."), value);
      mutationCount += 1;
      return builder;
    },
    toJSON() {
      return validateAndClone("snapshot");
    },
    toMutationSdk() {
      return createEmailMutationSdk({
        emailJson: builder.toJSON(),
        idFactory: options.idFactory
      });
    },
    finish() {
      assertNotSealed();
      const previous = cloneJson(draft);
      try {
        removeUnusedPlaceholders();
        const result = deepFreeze(validateAndClone("finish"));
        sealed = true;
        return result;
      } catch (error) {
        draft = previous;
        throw error;
      }
    },
    diagnostics() {
      return {
        mutationCount,
        sectionCount,
        warnings: Object.freeze([...warnings]),
        validation
      };
    }
  };
  return builder;
}

export {
  createMinimalEmailSeed,
  createEmailFromDraft,
  minimalEmailComponents,
  createEmailBuilder
};

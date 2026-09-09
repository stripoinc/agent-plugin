// src/skill-scripts/email-from-reference/create-from-brief.ts
import { randomUUID } from "node:crypto";

// src/skill-scripts/shared/schema-cache.ts
import { statSync } from "node:fs";
function schemaIsFresh(file) {
  try {
    const stat = statSync(file);
    return stat.isFile() && Date.now() - stat.mtimeMs <= 36e5;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

// src/skill-scripts/shared/runtime.ts
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, statSync as statSync2, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function objectValue(value) {
  return isObject(value) ? value : {};
}
function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) throw new Error(`Unexpected argument: ${arg}`);
    const next = argv[index + 1];
    args[arg.slice(2)] = next === void 0 || next.startsWith("--") ? true : next;
    if (next !== void 0 && !next.startsWith("--")) index += 1;
  }
  return args;
}
function requireString(args, key) {
  const value = optionalString(args, key);
  if (value === void 0) throw new Error(`Missing required --${key} argument.`);
  return value;
}
function optionalString(args, key) {
  const value = args[key];
  return typeof value === "string" && value.trim() !== "" ? value : void 0;
}
function readJson(filePath) {
  return JSON.parse(readFileSync(filePath, "utf8"));
}
function writeJson(filePath, value) {
  mkdirSync(path.dirname(filePath), { recursive: true });
  writeFileSync(filePath, `${JSON.stringify(value, null, 2)}
`, "utf8");
}
function compactError(error) {
  const fields = error instanceof Error || isObject(error) ? error : void 0;
  const errors = fields && "errors" in fields && Array.isArray(fields.errors) ? fields.errors : void 0;
  return {
    name: typeof fields?.name === "string" ? fields.name : "Error",
    message: String(fields?.message ?? error).slice(0, 2e3),
    ...errors ? { errors } : {}
  };
}
function resolveSdkDist(startUrl = import.meta.url) {
  const override = process.env.CONVO_EMAIL_AGENT_SDK_PATH;
  let candidate;
  if (override) {
    candidate = path.resolve(override);
  } else {
    const scriptDirectory = path.dirname(fileURLToPath(startUrl));
    const parent = path.dirname(scriptDirectory);
    if (path.basename(scriptDirectory) === "scripts" && path.basename(path.dirname(parent)) === "skills") {
      candidate = path.resolve(scriptDirectory, "../../../packages/convo-email-agent/index.js");
    } else if (path.basename(parent) === "skill-scripts" && path.basename(path.dirname(parent)) === ".build") {
      candidate = path.resolve(scriptDirectory, "../../sdk/index.js");
    }
  }
  if (candidate && existsSync(candidate) && statSync2(candidate).isFile()) return candidate;
  throw new Error(
    `Cannot find the packaged convo-email-agent SDK${candidate ? ` at ${candidate}` : ""}. Install skills/ and packages/ together or set CONVO_EMAIL_AGENT_SDK_PATH to an existing index.js.`
  );
}
async function loadSdk(sdkPath) {
  const sdk = await import(pathToFileURL(sdkPath).href);
  const schemaPath = optionalString(parseArgs(process.argv.slice(2)), "schema") ?? (process.env.PUBLISHER_PROXY_BASE_URL ? execFileSync("python", ["-m", "reteno_agent.email_model_schema"], { encoding: "utf8" }).trim() : process.env.STRIPO_SCHEMA_PATH);
  if (!schemaPath) throw new Error("Supply --schema or STRIPO_SCHEMA_PATH with the downloaded email schema.");
  if (!schemaIsFresh(schemaPath)) throw new Error("Email schema is missing or older than one hour. Refresh it through the host's schema cache before retrying.");
  sdk.setEmailSchema(readJson(schemaPath));
  return sdk;
}
async function validateEditorJson(emailJson, sdkPath) {
  try {
    const sdk = await loadSdk(sdkPath);
    const session = sdk.createEmailMutationSdk({ emailJson });
    session.finish();
    return { valid: true, diagnostics: session.diagnostics() };
  } catch (error) {
    return { valid: false, error: compactError(error) };
  }
}

// src/skill-scripts/shared/inspection.ts
var MAX_ITEMS = 100;
var MAX_SNIPPET = 140;
function truncate(value, limit = MAX_SNIPPET) {
  const text = String(value ?? "").replace(/\s+/g, " ").trim();
  return text.length > limit ? `${text.slice(0, limit)}...` : text;
}
function stripHtml(html) {
  return truncate(String(html ?? "").replace(/<script\b[^>]*>[\s\S]*?<\/script>/giu, " ").replace(/<style\b[^>]*>[\s\S]*?<\/style>/giu, " ").replace(/<[^>]+>/gu, " ").replace(/&nbsp;/giu, " ").replace(/&amp;/giu, "&").replace(/&lt;/giu, "<").replace(/&gt;/giu, ">"));
}
function pushLimited(list, value) {
  if (list.length < MAX_ITEMS) list.push(value);
}
function count(map, key) {
  const safeKey = key || "unknown";
  map[safeKey] = (map[safeKey] ?? 0) + 1;
}
function linkValue(link) {
  if (!isObject(link)) return void 0;
  return typeof link.value === "string" ? link.value : typeof link.href === "string" ? link.href : void 0;
}
function altTextValue(altText) {
  if (typeof altText === "string") return altText;
  if (isObject(altText) && typeof altText.text === "string") return altText.text;
  return void 0;
}
function extractAnchors(html) {
  const anchors = [];
  const re = /<a\b([^>]*)>([\s\S]*?)<\/a>/giu;
  let match;
  while ((match = re.exec(String(html ?? ""))) !== null && anchors.length < 20) {
    const href = /href\s*=\s*["']([^"']+)["']/iu.exec(match[1] ?? "")?.[1];
    anchors.push({ href, text: stripHtml(match[2] ?? "") });
  }
  return anchors;
}
function collectIds(value, counts) {
  if (Array.isArray(value)) {
    for (const item of value) collectIds(item, counts);
    return;
  }
  if (!isObject(value)) return;
  if (typeof value.id === "string") counts.set(value.id, (counts.get(value.id) ?? 0) + 1);
  for (const child of Object.values(value)) collectIds(child, counts);
}
function ownHideElement(node) {
  const value = objectValue(objectValue(node).settings).hideElement;
  return value === "no" || value === "mobile" || value === "desktop" ? value : void 0;
}
function inheritHiddenOn(node, inheritedHiddenOn) {
  const hiddenOn = new Set(inheritedHiddenOn);
  const own = ownHideElement(node);
  if (own === "desktop") hiddenOn.add("desktop");
  if (own === "mobile") hiddenOn.add("mobile");
  return hiddenOn;
}
function effectiveVisibility(hiddenOn) {
  if (hiddenOn.has("desktop") && hiddenOn.has("mobile")) return "neither";
  if (hiddenOn.has("desktop")) return "mobile-only";
  if (hiddenOn.has("mobile")) return "desktop-only";
  return "both";
}
function visibilityFields(node, inheritedHiddenOn) {
  const hiddenOn = inheritHiddenOn(node, inheritedHiddenOn);
  return {
    hiddenOn,
    ownHideElement: ownHideElement(node),
    effectiveVisibility: effectiveVisibility(hiddenOn)
  };
}
function summarizeBlock(block, area, summary, inheritedHiddenOn) {
  if (!isObject(block)) return;
  const id = typeof block.id === "string" ? block.id : void 0;
  const type = typeof block.type === "string" ? block.type : "unknown";
  const settings = isObject(block.settings) ? block.settings : {};
  const visibility = visibilityFields(block, inheritedHiddenOn);
  count(summary.blockTypes, type);
  count(summary.blockVisibility, visibility.effectiveVisibility);
  summary.counts.blocks += 1;
  if (block.moduleId !== void 0) summary.counts.moduleNodes += 1;
  pushLimited(summary.ids.blocks, id);
  if (type === "text") {
    pushLimited(summary.inventories.text, {
      id,
      area,
      ownHideElement: visibility.ownHideElement,
      effectiveVisibility: visibility.effectiveVisibility,
      snippet: stripHtml(block.content),
      anchors: extractAnchors(block.content)
    });
    return;
  }
  if (type === "button") {
    pushLimited(summary.inventories.buttons, {
      id,
      area,
      ownHideElement: visibility.ownHideElement,
      effectiveVisibility: visibility.effectiveVisibility,
      text: truncate(settings.text),
      href: linkValue(settings.link)
    });
    return;
  }
  if (type === "image") {
    pushLimited(summary.inventories.images, {
      id,
      area,
      ownHideElement: visibility.ownHideElement,
      effectiveVisibility: visibility.effectiveVisibility,
      src: settings.src,
      alt: altTextValue(settings.altText),
      href: linkValue(settings.link)
    });
    return;
  }
  if (type === "menu") {
    const items = Array.isArray(settings.items) ? settings.items : [];
    pushLimited(summary.inventories.menus, {
      id,
      area,
      ownHideElement: visibility.ownHideElement,
      effectiveVisibility: visibility.effectiveVisibility,
      sharedLinkColor: isObject(settings.colors) ? settings.colors.link : void 0,
      items: items.slice(0, 20).map((item, index) => ({
        index,
        name: isObject(item) ? truncate(item.name) : void 0,
        href: isObject(item) ? linkValue(item.link) : void 0,
        linkColor: objectValue(objectValue(item).colors).link
      }))
    });
    return;
  }
  if (type === "social") {
    const networks = Array.isArray(settings.networks) ? settings.networks : [];
    pushLimited(summary.inventories.social, {
      id,
      area,
      ownHideElement: visibility.ownHideElement,
      effectiveVisibility: visibility.effectiveVisibility,
      style: settings.style,
      textCustomization: settings.textCustomization,
      networks: networks.slice(0, 20).map((network) => ({
        type: isObject(network) ? network.type : void 0,
        href: isObject(network) ? linkValue(network.link) : void 0,
        title: isObject(network) ? truncate(network.title) : void 0,
        alt: isObject(network) ? truncate(network.alt) : void 0,
        icon: isObject(network) ? network.icon : void 0
      }))
    });
    return;
  }
  if (type === "unknown" || type === "html") {
    pushLimited(summary.limitations.lockedBlocks, {
      id,
      area,
      type,
      ownHideElement: visibility.ownHideElement,
      effectiveVisibility: visibility.effectiveVisibility,
      snippet: stripHtml(block.content)
    });
  }
}
function summarizeContainer(container, area, summary, inheritedHiddenOn) {
  if (!isObject(container)) return;
  const visibility = visibilityFields(container, inheritedHiddenOn);
  summary.counts.containers += 1;
  if (container.moduleId !== void 0) summary.counts.moduleNodes += 1;
  pushLimited(summary.ids.containers, typeof container.id === "string" ? container.id : void 0);
  const blocks = Array.isArray(container.blocks) ? container.blocks : [];
  for (const block of blocks) summarizeBlock(block, area, summary, visibility.hiddenOn);
}
function summarizeEditorJson(value) {
  const emailJson = objectValue(value);
  const settings = objectValue(emailJson.settings);
  const stripesSettings = objectValue(settings.stripes);
  const summary = {
    shape: {
      hasSettings: isObject(emailJson?.settings),
      hasStripes: Array.isArray(emailJson?.stripes),
      hasCompiledHtml: typeof emailJson?.html === "string",
      hasCompiledCss: typeof emailJson?.css === "string"
    },
    metadata: structuredClone(objectValue(emailJson.metadata)),
    theme: {
      contentWidth: objectValue(settings.general).messageContentWidth,
      generalBackgroundColor: objectValue(settings.general).backgroundColor,
      fontFamily: stripesSettings.fontFamily,
      contentLinkColor: objectValue(stripesSettings.content).linkColor,
      buttonColor: objectValue(settings.buttons).buttonColor,
      buttonFontColor: objectValue(settings.buttons).fontColor
    },
    counts: {
      stripes: 0,
      structures: 0,
      columns: 0,
      containers: 0,
      blocks: 0,
      moduleNodes: 0
    },
    ids: {
      stripes: [],
      structures: [],
      columns: [],
      containers: [],
      blocks: [],
      duplicateIds: []
    },
    blockTypes: {},
    blockVisibility: {},
    inventories: {
      text: [],
      buttons: [],
      images: [],
      menus: [],
      social: []
    },
    limitations: {
      lockedBlocks: []
    }
  };
  const idCounts = /* @__PURE__ */ new Map();
  collectIds(emailJson, idCounts);
  summary.ids.duplicateIds = [...idCounts.entries()].filter(([, idCount]) => idCount > 1).map(([id, idCount]) => ({ id, count: idCount })).slice(0, MAX_ITEMS);
  const stripes = Array.isArray(emailJson?.stripes) ? emailJson.stripes : [];
  for (const stripe of stripes) {
    if (!isObject(stripe)) continue;
    const stripeVisibility = visibilityFields(stripe, /* @__PURE__ */ new Set());
    summary.counts.stripes += 1;
    if (stripe.moduleId !== void 0) summary.counts.moduleNodes += 1;
    pushLimited(summary.ids.stripes, typeof stripe.id === "string" ? stripe.id : void 0);
    const messageArea = objectValue(stripe.settings).messageArea;
    const area = typeof messageArea === "string" ? messageArea : void 0;
    const structures = Array.isArray(stripe.structures) ? stripe.structures : [];
    for (const structure of structures) {
      if (!isObject(structure)) continue;
      const structureVisibility = visibilityFields(structure, stripeVisibility.hiddenOn);
      summary.counts.structures += 1;
      if (structure.moduleId !== void 0) summary.counts.moduleNodes += 1;
      pushLimited(summary.ids.structures, typeof structure.id === "string" ? structure.id : void 0);
      const columns = Array.isArray(structure.columns) ? structure.columns : [];
      if (columns.length > 0) {
        for (const column of columns) {
          if (!isObject(column)) continue;
          const columnVisibility = visibilityFields(column, structureVisibility.hiddenOn);
          summary.counts.columns += 1;
          if (column.moduleId !== void 0) summary.counts.moduleNodes += 1;
          pushLimited(summary.ids.columns, typeof column.id === "string" ? column.id : void 0);
          const containers = Array.isArray(column.containers) ? column.containers : [];
          for (const container of containers) summarizeContainer(container, area, summary, columnVisibility.hiddenOn);
        }
        continue;
      }
      const legacyContainers = Array.isArray(structure.containers) ? structure.containers : [];
      for (const container of legacyContainers) summarizeContainer(container, area, summary, structureVisibility.hiddenOn);
    }
  }
  return summary;
}

// src/skill-scripts/email-from-reference/create-from-brief.ts
function isObject2(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function nonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : void 0;
}
var FONT_ROLES = ["body", "headings", "buttons"];
var BUILT_IN_FONT_FAMILIES = /* @__PURE__ */ new Set([
  "arial",
  "helvetica",
  "georgia",
  "times new roman",
  "verdana",
  "tahoma",
  "trebuchet ms",
  "courier new"
]);
function normalizedFontFamily(value) {
  const family = nonEmptyString(value);
  return family?.toLowerCase();
}
function validateFontPlan(message, customFontsEnabled) {
  const findings = [];
  const families = message.font_families;
  const roleFamilies = /* @__PURE__ */ new Map();
  if (!isObject2(families)) {
    findings.push("brief.message.font_families: required object with body, headings, and buttons");
  } else {
    for (const role of FONT_ROLES) {
      const family = nonEmptyString(families[role]);
      if (family === void 0) {
        findings.push(`brief.message.font_families.${role}: required primary family name`);
        continue;
      }
      if (family.includes(",")) {
        findings.push(`brief.message.font_families.${role}: expected one primary family name, not a CSS stack`);
        continue;
      }
      roleFamilies.set(role, family);
    }
  }
  if (!customFontsEnabled) {
    if (Object.hasOwn(message, "fonts")) {
      findings.push(
        "custom_font_creation_disabled: brief.message.fonts must be absent unless PUBLISHER_EMAIL_CUSTOM_FONTS_ENABLED is exactly true"
      );
    }
    for (const [role, family] of roleFamilies) {
      if (!BUILT_IN_FONT_FAMILIES.has(family.toLowerCase())) {
        findings.push(
          `custom_font_creation_disabled: brief.message.font_families.${role} must use a built-in family`
        );
      }
    }
    return findings;
  }
  const fonts = message.fonts;
  const declaredFamilies = /* @__PURE__ */ new Set();
  if (fonts !== void 0 && !Array.isArray(fonts)) {
    findings.push("brief.message.fonts: expected an array when supplied");
  } else if (Array.isArray(fonts)) {
    if (fonts.length > 4) findings.push("brief.message.fonts: at most four fonts are allowed");
    for (const [index, font] of fonts.entries()) {
      if (!isObject2(font)) {
        findings.push(`brief.message.fonts[${index}]: expected an object`);
        continue;
      }
      const unexpected = Object.keys(font).filter((key) => !["family", "weights", "italic"].includes(key));
      if (unexpected.length > 0) {
        findings.push(`brief.message.fonts[${index}]: unsupported keys ${unexpected.join(", ")}`);
      }
      const family = nonEmptyString(font.family);
      if (family === void 0) {
        findings.push(`brief.message.fonts[${index}].family: required non-empty family name`);
      } else {
        const normalized = family.toLowerCase();
        if (declaredFamilies.has(normalized)) {
          findings.push(`brief.message.fonts[${index}].family: duplicate family ${JSON.stringify(family)}`);
        }
        declaredFamilies.add(normalized);
      }
      if (!Array.isArray(font.weights) || font.weights.length === 0) {
        findings.push(`brief.message.fonts[${index}].weights: required non-empty array`);
      } else {
        const weights = font.weights;
        if (new Set(weights).size !== weights.length) {
          findings.push(`brief.message.fonts[${index}].weights: duplicate weights are not allowed`);
        }
        if (weights.some((weight) => !Number.isInteger(weight) || weight < 100 || weight > 900 || weight % 100 !== 0)) {
          findings.push(`brief.message.fonts[${index}].weights: expected 100..900 in 100-step increments`);
        }
      }
      if (typeof font.italic !== "boolean") {
        findings.push(`brief.message.fonts[${index}].italic: required boolean`);
      }
    }
  }
  for (const [role, family] of roleFamilies) {
    const normalized = normalizedFontFamily(family);
    if (normalized !== void 0 && !BUILT_IN_FONT_FAMILIES.has(normalized) && !declaredFamilies.has(normalized)) {
      findings.push(`brief.message.font_families.${role}: custom family ${JSON.stringify(family)} is not declared`);
    }
  }
  return findings;
}
function validateCreationBrief(brief, customFontsEnabled = process.env.PUBLISHER_EMAIL_CUSTOM_FONTS_ENABLED === "true", brand = "reteno") {
  if (!isObject2(brief)) return ["brief: the file must contain a JSON object"];
  const findings = [];
  if (brief.v !== 2) findings.push(`brief.v: expected 2 (native model draft), got ${JSON.stringify(brief.v)}`);
  if (!isObject2(brief.message)) {
    findings.push("brief.message: required metadata object");
  } else if (brand === "stripo") {
    if (nonEmptyString(brief.message.name) === void 0) findings.push("brief.message.name: required non-empty name");
    if (typeof brief.message.name === "string" && brief.message.name.length > 200) findings.push("brief.message.name: maximum 200 characters");
    for (const key of Object.keys(brief.message)) {
      if (!["name", "projectId", "folderId"].includes(key)) findings.push(`brief.message.${key}: unsupported Stripo metadata`);
    }
    for (const key of ["projectId", "folderId"]) {
      const value = brief.message[key];
      if (value !== void 0 && (!Number.isSafeInteger(value) || value < 1)) findings.push(`brief.message.${key}: expected a positive integer`);
    }
  } else if (nonEmptyString(brief.message.subject) === void 0) {
    findings.push("brief.message.subject: required non-empty subject");
  } else {
    if (Object.hasOwn(brief.message, "preheader") || Object.hasOwn(brief.message, "preHeader")) {
      findings.push(
        "preheader_update_unavailable: brief.message.preheader and brief.message.preHeader must be absent"
      );
    }
    findings.push(...validateFontPlan(brief.message, customFontsEnabled));
  }
  if (!isObject2(brief.model)) {
    findings.push("brief.model: required native editor model draft");
  } else if (!Array.isArray(brief.model.stripes) || brief.model.stripes.length === 0) {
    findings.push("brief.model.stripes: required non-empty array");
  }
  for (const key of Object.keys(brief)) {
    if (!["v", "note", "sourceSummary", "message", "model"].includes(key)) {
      findings.push(`brief.${key}: unsupported field; put native editor fields inside brief.model`);
    }
  }
  return findings;
}
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const briefPath = requireString(args, "brief");
  const outputPath = requireString(args, "output");
  const baselinePath = args.baseline === void 0 ? void 0 : requireString(args, "baseline");
  const diagnosticsPath = optionalString(args, "diagnostics") ?? `${outputPath}.diagnostics.json`;
  const sdkPath = resolveSdkDist();
  const brand = optionalString(args, "brand") ?? "reteno";
  const customFontsEnabled = brand === "reteno" && process.env.PUBLISHER_EMAIL_CUSTOM_FONTS_ENABLED === "true";
  try {
    if (brand !== "reteno" && brand !== "stripo") throw new Error(`Unsupported brand: ${brand}`);
    const brief = readJson(briefPath);
    const findings = validateCreationBrief(brief, customFontsEnabled, brand);
    if (findings.length > 0) {
      throw new Error(`Creation brief has ${findings.length} finding(s): ${JSON.stringify(findings)}`);
    }
    const typedBrief = brief;
    const sdk = await loadSdk(sdkPath);
    const emailJson = sdk.createEmailFromDraft({
      emailJson: typedBrief.model,
      baselineEmailJson: baselinePath === void 0 ? void 0 : readJson(baselinePath),
      regenerateIds: true,
      idFactory: () => randomUUID()
    });
    const validation = await validateEditorJson(emailJson, sdkPath);
    if (!validation.valid) {
      throw new Error(`Created model failed native editor schema validation: ${validation.error?.message ?? "unknown error"}`);
    }
    const summary = summarizeEditorJson(emailJson);
    if (brand === "stripo" && summary.counts.blocks === 0) throw new Error("A Stripo email must contain at least one block.");
    writeJson(outputPath, emailJson);
    writeJson(diagnosticsPath, {
      status: "ok",
      briefPath,
      baselinePath,
      outputPath,
      sdkPath,
      message: typedBrief.message,
      fontGate: brand === "reteno" ? {
        customFontsEnabled,
        fontsIncluded: Object.hasOwn(typedBrief.message, "fonts")
      } : void 0,
      summary,
      validation
    });
    console.log(JSON.stringify({
      status: "ok",
      outputPath,
      diagnosticsPath,
      counts: summary.counts
    }));
  } catch (error) {
    writeJson(diagnosticsPath, {
      status: "error",
      briefPath,
      baselinePath,
      outputPath,
      sdkPath,
      fontGate: brand === "reteno" ? { customFontsEnabled } : void 0,
      error: compactError(error)
    });
    throw error;
  }
}
main().catch((error) => {
  console.error(compactError(error).message);
  process.exitCode = 1;
});
export {
  validateCreationBrief
};

// src/skill-scripts/email-from-reference/create-from-brief.ts
import { randomUUID } from "node:crypto";
import { readFileSync as readFileSync2, rmSync as rmSync2 } from "node:fs";
import path2 from "node:path";
import { fileURLToPath as fileURLToPath2 } from "node:url";

// src/skill-scripts/shared/runtime.ts
import { existsSync, mkdirSync, readFileSync, realpathSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
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
function beginOutputs(output, diagnostics, inputs) {
  const canonical = (file) => {
    const absolute = path.resolve(file);
    if (existsSync(absolute)) return realpathSync(absolute);
    const parent = path.dirname(absolute);
    return parent === absolute ? absolute : path.join(canonical(parent), path.basename(absolute));
  };
  const inputPaths = new Set(inputs.filter((value) => value !== void 0).map(canonical));
  if (canonical(output) === canonical(diagnostics) || inputPaths.has(canonical(output)) || inputPaths.has(canonical(diagnostics))) {
    throw new Error("Output and diagnostics must differ from each other and every input.");
  }
  rmSync(output, { force: true });
  rmSync(diagnostics, { force: true });
}
async function prepareOutput(sdk, options) {
  if (!options.runtimeSnapshotPath) {
    const result = options.session?.validate() ?? sdk.validateChange(options);
    if (!result.success) throw new sdk.DocumentStateError(result.issues);
    return { documentState: options.session ? options.session.finish() : result.documentState, verification: { level: "contract", ...sdk.getContract() } };
  }
  const runtimePath = process.env.STRIPO_RUNTIME_PATH;
  if (!runtimePath) throw new Error("STRIPO_RUNTIME_PATH must point to the optional SDK runtime entry.");
  if (!options.session && options.current === void 0) throw new Error("Runtime verification requires an acquired current baseline.");
  const runtime = await import(pathToFileURL(path.resolve(runtimePath)).href);
  const raw = readJson(options.runtimeSnapshotPath);
  if (!isObject(raw) || typeof raw.encodedModel !== "string" || !/^[A-Za-z0-9+/]+={0,2}$/.test(raw.encodedModel)) throw new Error("Runtime snapshot must contain a base64 encodedModel.");
  const session = options.session ?? sdk.createEmailSdk({ emailJson: options.target, current: options.current, intent: options.intent });
  return runtime.prepareDocumentState({ session, snapshot: {
    ...raw,
    encodedModel: new Uint8Array(Buffer.from(raw.encodedModel, "base64"))
  } });
}
function compactError(error) {
  const fields = error instanceof Error || isObject(error) ? error : void 0;
  const errors = fields && "errors" in fields && Array.isArray(fields.errors) ? fields.errors : void 0;
  return {
    name: typeof fields?.name === "string" ? fields.name : "Error",
    message: String(fields?.message ?? error).slice(0, 2e3),
    ...errors ? { errors } : {},
    ...Object.fromEntries(["code", "stage", "input", "path", "issues"].flatMap((key) => fields && key in fields ? [[key, fields[key]]] : []))
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
  if (candidate && existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  throw new Error(
    `Cannot find the packaged convo-email-agent SDK${candidate ? ` at ${candidate}` : ""}. Install skills/ and packages/ together or set CONVO_EMAIL_AGENT_SDK_PATH to an existing index.js.`
  );
}
async function loadSdk(sdkPath) {
  return import(pathToFileURL(sdkPath).href);
}
async function validateEditorJson(emailJson, sdkPath, options = {}) {
  try {
    const sdk = await loadSdk(sdkPath);
    sdk.assertValidEmailModel(emailJson, options);
    return { valid: true };
  } catch (error) {
    return { valid: false, error: compactError(error) };
  }
}

// src/sdk/model-utils.ts
function isObject2(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function objectValue(value) {
  return isObject2(value) ? value : {};
}

// src/sdk/inspection.ts
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
  if (!isObject2(link)) return void 0;
  return typeof link.value === "string" ? link.value : typeof link.href === "string" ? link.href : void 0;
}
function altTextValue(altText) {
  if (typeof altText === "string") return altText;
  if (isObject2(altText) && typeof altText.text === "string") return altText.text;
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
  if (!isObject2(value)) return;
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
  if (!isObject2(block)) return;
  const id = typeof block.id === "string" ? block.id : void 0;
  const type = typeof block.type === "string" ? block.type : "unknown";
  const settings = isObject2(block.settings) ? block.settings : {};
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
      sharedLinkColor: isObject2(settings.colors) ? settings.colors.link : void 0,
      items: items.slice(0, 20).map((item, index) => ({
        index,
        name: isObject2(item) ? truncate(item.name) : void 0,
        href: isObject2(item) ? linkValue(item.link) : void 0,
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
        type: isObject2(network) ? network.type : void 0,
        href: isObject2(network) ? linkValue(network.link) : void 0,
        title: isObject2(network) ? truncate(network.title) : void 0,
        alt: isObject2(network) ? truncate(network.alt) : void 0,
        icon: isObject2(network) ? network.icon : void 0
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
  if (!isObject2(container)) return;
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
      hasSettings: isObject2(emailJson?.settings),
      hasStripes: Array.isArray(emailJson?.stripes),
      hasCompiledHtml: typeof emailJson?.html === "string",
      hasCompiledCss: typeof emailJson?.css === "string"
    },
    metadata: structuredClone(objectValue(emailJson.metadata)),
    theme: {
      contentWidth: objectValue(settings.general).messageContentWidth,
      generalBackgroundColor: objectValue(objectValue(settings.general).lightTheme).backgroundColor,
      fontFamily: stripesSettings.fontFamily,
      contentLinkColor: objectValue(objectValue(stripesSettings.lightTheme).content).linkColor,
      buttonColor: objectValue(objectValue(settings.buttons).lightTheme).buttonColor,
      buttonFontColor: objectValue(objectValue(settings.buttons).lightTheme).fontColor
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
    if (!isObject2(stripe)) continue;
    const stripeVisibility = visibilityFields(stripe, /* @__PURE__ */ new Set());
    summary.counts.stripes += 1;
    if (stripe.moduleId !== void 0) summary.counts.moduleNodes += 1;
    pushLimited(summary.ids.stripes, typeof stripe.id === "string" ? stripe.id : void 0);
    const messageArea = objectValue(stripe.settings).messageArea;
    const area = typeof messageArea === "string" ? messageArea : void 0;
    const structures = Array.isArray(stripe.structures) ? stripe.structures : [];
    for (const structure of structures) {
      if (!isObject2(structure)) continue;
      const structureVisibility = visibilityFields(structure, stripeVisibility.hiddenOn);
      summary.counts.structures += 1;
      if (structure.moduleId !== void 0) summary.counts.moduleNodes += 1;
      pushLimited(summary.ids.structures, typeof structure.id === "string" ? structure.id : void 0);
      const columns = Array.isArray(structure.columns) ? structure.columns : [];
      if (columns.length > 0) {
        for (const column of columns) {
          if (!isObject2(column)) continue;
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
function isObject3(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function nonEmptyString(value) {
  return typeof value === "string" && value.trim() !== "" ? value.trim() : void 0;
}
function detachReferenceModules(model) {
  const detached = [];
  const children = ["stripes", "structures", "columns", "containers", "blocks"];
  const hasBlocks = (node) => children.some((key) => Array.isArray(node[key]) && node[key].some((value) => isObject3(value) && (key === "blocks" || hasBlocks(value))));
  const visit = (node, path3, kind) => {
    if (["stripes", "structures", "containers"].includes(kind) && Object.hasOwn(node, "moduleId")) {
      if (typeof node.moduleId !== "number" || !Number.isFinite(node.moduleId)) {
        throw new Error(`${path3}.moduleId: expected a finite saved-module ID`);
      }
      if (!hasBlocks(node)) {
        throw new Error(`${path3}.moduleId: cannot copy an unresolved saved module; acquire its complete editable content first`);
      }
      detached.push({ path: `${path3}.moduleId`, sourceNodeId: nonEmptyString(node.id), moduleId: node.moduleId });
      delete node.moduleId;
    }
    for (const key of children) {
      const rows = node[key];
      if (Array.isArray(rows)) rows.forEach((value, index) => {
        if (isObject3(value)) visit(value, `${path3}.${key}[${index}]`, key);
      });
    }
  };
  visit(model, "brief.model", "model");
  return detached;
}
function backgroundImageFindings(model, exact) {
  const findings = [];
  const stripes = Array.isArray(model.stripes) ? model.stripes : [];
  const hasBackgroundImage = (value) => {
    if (Array.isArray(value)) return value.some(hasBackgroundImage);
    if (!isObject3(value)) return false;
    if (isObject3(value.backgroundImage) && nonEmptyString(value.backgroundImage.path)) return true;
    return Object.values(value).some(hasBackgroundImage);
  };
  const hasWhiteText = (value) => {
    if (Array.isArray(value)) return value.some(hasWhiteText);
    if (!isObject3(value)) return false;
    if (value.type === "text") {
      const color = isObject3(value.settings) ? value.settings.fontColor : void 0;
      if (typeof color === "string" && /^#(?:fff|ffffff)$/i.test(color)) return true;
      if (typeof value.content === "string" && /\bcolor\s*:\s*#(?:fff|ffffff)\b/i.test(value.content)) return true;
    }
    return Object.values(value).some(hasWhiteText);
  };
  const inspect = (value, path3) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => inspect(item, `${path3}[${index}]`));
    } else if (isObject3(value)) {
      if (isObject3(value.backgroundImage) && value.backgroundImage.sizeX === "cover" && value.backgroundImage.sizeY === "cover") {
        findings.push(`${path3}.backgroundImage.sizeY: use "auto" when sizeX is "cover"; this native combination fails the host document-state SET`);
      }
      for (const [key, child] of Object.entries(value)) inspect(child, `${path3}.${key}`);
    }
  };
  inspect(model.stripes, "brief.model.stripes");
  if (exact) stripes.forEach((value, index) => {
    if (!isObject3(value) || !isObject3(value.settings) || !isObject3(value.settings.backgroundImage) || !nonEmptyString(value.settings.backgroundImage.path)) return;
    if (value.settings.contentBackgroundColor !== "transparent") return;
    if (hasBackgroundImage(value.structures) || !hasWhiteText(value.structures)) return;
    findings.push(`brief.model.stripes[${index}]: white text overlays a stripe-only photo; move the photo to the structure or container background so it appears behind the centered content`);
  });
  return findings;
}
function unbreakableRuleFindings(model) {
  const findings = [];
  const inspect = (value, path3) => {
    if (Array.isArray(value)) {
      value.forEach((item, index) => inspect(item, `${path3}[${index}]`));
    } else if (isObject3(value)) {
      if (value.type === "text" && typeof value.content === "string" && /[━─═]{24,}/u.test(value.content)) {
        findings.push(`${path3}.content: repeated rule glyphs force the mobile table wider than the viewport; use a full-width border-top span instead`);
      }
      for (const [key, child] of Object.entries(value)) inspect(child, `${path3}.${key}`);
    }
  };
  inspect(model.stripes, "brief.model.stripes");
  return findings;
}
function readCreationPolicy() {
  const policyPath = path2.resolve(path2.dirname(fileURLToPath2(import.meta.url)), "../reference/creation-policy.json");
  let policy;
  try {
    policy = JSON.parse(readFileSync2(policyPath, "utf8"));
  } catch {
    throw new Error("reference/creation-policy.json must contain the installed provider's creation validation policy.");
  }
  const strings = (value) => Array.isArray(value) && value.every((item) => typeof item === "string" && item.length > 0);
  if (!isObject3(policy) || !nonEmptyString(policy.provider) || !strings(policy.requiredMessageStrings) || !(policy.allowedMessageFields === null || strings(policy.allowedMessageFields)) || !strings(policy.positiveIntegerMessageFields) || !isObject3(policy.maxMessageLengths) || !Object.values(policy.maxMessageLengths).every((n) => Number.isSafeInteger(n) && n > 0) || ![policy.checkBackgroundImages, policy.checkUnbreakableRules, policy.requireContent].every((v) => typeof v === "boolean")) {
    throw new Error("Invalid creation validation policy in reference/creation-policy.json.");
  }
  return policy;
}
function validateCreationBrief(brief, policy) {
  if (!isObject3(brief)) return ["brief: the file must contain a JSON object"];
  const findings = [];
  if (brief.v !== 2) findings.push(`brief.v: expected 2 (native model draft), got ${JSON.stringify(brief.v)}`);
  if (!isObject3(brief.message)) {
    findings.push("brief.message: required metadata object");
  } else {
    for (const key of policy.requiredMessageStrings) {
      if (nonEmptyString(brief.message[key]) === void 0) findings.push(`brief.message.${key}: required non-empty ${key}`);
    }
    if (policy.allowedMessageFields !== null) for (const key of Object.keys(brief.message)) {
      if (!policy.allowedMessageFields.includes(key)) findings.push(`brief.message.${key}: unsupported ${policy.provider} metadata`);
    }
    for (const [key, maximum] of Object.entries(policy.maxMessageLengths)) {
      const value = brief.message[key];
      if (value !== void 0 && (typeof value !== "string" || value.length > maximum)) {
        findings.push(`brief.message.${key}: expected a string of at most ${maximum} characters`);
      }
    }
    for (const key of policy.positiveIntegerMessageFields) {
      const value = brief.message[key];
      if (value !== void 0 && (!Number.isSafeInteger(value) || value < 1)) findings.push(`brief.message.${key}: expected a positive integer`);
    }
    if (Object.hasOwn(brief.message, "preheader") || Object.hasOwn(brief.message, "preHeader")) {
      findings.push("brief.message.preheader and brief.message.preHeader must be absent; use brief.model.metadata.preheader with text and boolean fillSpace");
    }
  }
  if (isObject3(brief.message) && brief.message.referenceMode !== void 0 && !["exact", "tailored", "creative", "copy-action"].includes(brief.message.referenceMode)) {
    findings.push("brief.message.referenceMode: expected exact, tailored, or creative (legacy copy-action is accepted)");
  }
  if (!isObject3(brief.model)) {
    findings.push("brief.model: required native editor model draft");
  } else if (!Array.isArray(brief.model.stripes) || brief.model.stripes.length === 0) {
    findings.push("brief.model.stripes: required non-empty array");
  } else {
    if (policy.checkBackgroundImages) findings.push(...backgroundImageFindings(brief.model, isObject3(brief.message) && brief.message.referenceMode === "exact"));
    if (policy.checkUnbreakableRules) findings.push(...unbreakableRuleFindings(brief.model));
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
  let sdkPath;
  beginOutputs(outputPath, diagnosticsPath, [briefPath, baselinePath, optionalString(args, "runtime-snapshot")]);
  try {
    sdkPath = resolveSdkDist();
    const policy = readCreationPolicy();
    const requestedBrand = optionalString(args, "brand");
    if (requestedBrand !== void 0 && requestedBrand !== policy.provider) {
      throw new Error(`Unsupported brand: ${requestedBrand}; the installed creation policy selects ${policy.provider}.`);
    }
    const brief = readJson(briefPath);
    const findings = validateCreationBrief(brief, policy);
    if (findings.length > 0) {
      throw new Error(`Creation brief has ${findings.length} finding(s): ${JSON.stringify(findings)}`);
    }
    const typedBrief = brief;
    typedBrief.message.referenceMode = typedBrief.message.referenceMode === "copy-action" ? "tailored" : typedBrief.message.referenceMode ?? "creative";
    const sdk = await loadSdk(sdkPath);
    const baselineEmailJson = baselinePath === void 0 ? void 0 : readJson(baselinePath);
    const baselineStripes = isObject3(baselineEmailJson) && Array.isArray(baselineEmailJson.stripes) ? baselineEmailJson.stripes : [];
    const creationModel = structuredClone(typedBrief.model);
    const detachedModules = detachReferenceModules(creationModel);
    const emailJson = sdk.createEmailFromDraft({
      emailJson: creationModel,
      baselineEmailJson,
      intent: { removeNodes: baselineStripes.filter(isObject3).map((stripe) => String(stripe.id)) },
      regenerateIds: true,
      idFactory: () => randomUUID()
    });
    const validation = await validateEditorJson(emailJson, sdkPath, { current: baselineEmailJson });
    if (!validation.valid) {
      throw new Error(`Created model failed native editor schema validation: ${validation.error?.message ?? "unknown error"}`);
    }
    const prepared = await prepareOutput(sdk, {
      current: baselineEmailJson,
      target: emailJson,
      intent: { removeNodes: baselineStripes.filter(isObject3).map((stripe) => String(stripe.id)) },
      runtimeSnapshotPath: optionalString(args, "runtime-snapshot")
    });
    const summary = summarizeEditorJson(prepared.documentState);
    if (policy.requireContent && summary.counts.blocks === 0) throw new Error("An email must contain at least one block.");
    writeJson(outputPath, prepared.documentState);
    writeJson(diagnosticsPath, {
      status: "ok",
      briefPath,
      baselinePath,
      outputPath,
      sdkPath,
      message: typedBrief.message,
      detachedModules,
      summary,
      validation,
      verification: prepared.verification
    });
    console.log(JSON.stringify({
      status: "ok",
      outputPath,
      diagnosticsPath,
      counts: summary.counts
    }));
  } catch (error) {
    rmSync2(outputPath, { force: true });
    writeJson(diagnosticsPath, {
      status: "error",
      briefPath,
      baselinePath,
      outputPath,
      sdkPath,
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

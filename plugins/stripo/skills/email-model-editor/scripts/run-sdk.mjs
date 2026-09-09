// src/skill-scripts/email-model-editor/run-sdk.ts
import path2 from "node:path";
import { pathToFileURL as pathToFileURL2 } from "node:url";
import { isDeepStrictEqual } from "node:util";

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

// src/skill-scripts/shared/lost-keys.ts
var CHILD_ARRAYS = /* @__PURE__ */ new Set(["stripes", "structures", "columns", "containers", "blocks"]);
var DELIBERATE_ELEMENT_REMOVALS = /* @__PURE__ */ new Set(["link"]);
var CLEARABLE_THEME_KEYS = /* @__PURE__ */ new Set([
  ...["backgroundImage", "customListStyles"].map((key) => `/settings/general/${key}`),
  ...["letterSpacing", "lineHeight"].map((key) => `/settings/stripes/${key}`),
  ...["header", "content", "footer", "infoArea"].flatMap((area) => ["fontSize", "fontColor", "linkColor", "linkColorHover", "paragraphBottomSpace"].map((key) => `/settings/stripes/${area}/${key}`)),
  ...["header", "content", "footer"].map((area) => `/settings/stripes/${area}/contentBackgroundColor`),
  ...["header", "footer"].flatMap((area) => ["stripeBackgroundColor", "backgroundImage"].map((key) => `/settings/stripes/${area}/${key}`)),
  "/settings/headings/letterSpacing",
  ...["h1", "h2", "h3", "h4", "h5", "h6"].flatMap((heading) => ["fontColor", "textAlign", "textStyle", "fontSize", "lineHeight", "paragraphBottomSpace"].map((key) => `/settings/headings/${heading}/${key}`)),
  ...[
    "outlookSupport",
    "fontColor",
    "textStyle",
    "textTransform",
    "buttonColor",
    "letterSpacing",
    "fontSize",
    "borderRadius",
    "fitContainer",
    "hoverButtonStyles",
    "padding"
  ].map((key) => `/settings/buttons/${key}`)
]);
function isSupportedThemeReset(pointer, before) {
  if (CLEARABLE_THEME_KEYS.has(pointer)) return true;
  return /^\/settings\/(?:stripes\/(?:header|content|footer|infoArea)|headings\/h[1-6])$/u.test(pointer) && isObject(before) && Object.keys(before).every((key) => CLEARABLE_THEME_KEYS.has(`${pointer}/${key}`));
}
function indexElements(document) {
  const seen = /* @__PURE__ */ new Map();
  const elements = /* @__PURE__ */ new Map();
  const visit = (value) => {
    if (Array.isArray(value)) {
      for (const item of value) visit(item);
      return;
    }
    if (!isObject(value)) return;
    if (typeof value.id === "string") {
      seen.set(value.id, (seen.get(value.id) ?? 0) + 1);
      elements.set(value.id, value);
    }
    for (const key of CHILD_ARRAYS) visit(value[key]);
  };
  visit(objectValue(document).stripes);
  for (const [id, occurrences] of seen) if (occurrences > 1) elements.delete(id);
  return elements;
}
function collect(before, after, pointer, element, lost, socialNetworksPointer) {
  if (Array.isArray(before)) {
    if (!Array.isArray(after)) {
      lost.push(pointer);
    } else if (pointer === socialNetworksPointer) {
      return;
    } else if (after.length === before.length) {
      before.forEach((item, index) => collect(item, after[index], `${pointer}/${index}`, element, lost, socialNetworksPointer));
    }
    return;
  }
  if (!isObject(before)) return;
  if (!isObject(after)) {
    lost.push(pointer);
    return;
  }
  const replacedSalesforceLink = element && pointer.endsWith("/settings/link") && before.type === "salesforce_mc" && typeof after.type === "string" && after.type !== before.type;
  for (const [key, value] of Object.entries(before)) {
    if (element && CHILD_ARRAYS.has(key)) continue;
    const explicitThemeClear = !element && Object.hasOwn(after, key) && after[key] === void 0 && isSupportedThemeReset(`${pointer}/${key}`, value);
    if (explicitThemeClear) continue;
    if (Object.hasOwn(after, key) && after[key] !== void 0) {
      collect(value, after[key], `${pointer}/${key}`, element, lost, socialNetworksPointer);
    } else if (!(element && DELIBERATE_ELEMENT_REMOVALS.has(key)) && !(replacedSalesforceLink && key === "salesforce")) {
      lost.push(`${pointer}/${key}`);
    }
  }
}
function findLostKeys(input, output) {
  const lost = [];
  const before = objectValue(input);
  const after = objectValue(output);
  for (const key of ["metadata", "settings"]) {
    if (key in before) collect(before[key], after[key], `/${key}`, false, lost);
  }
  const survivors = indexElements(after);
  for (const [id, element] of indexElements(before)) {
    if (!survivors.has(id)) continue;
    const survivor = survivors.get(id);
    const socialNetworksPointer = isObject(element) && element.type === "social" && isObject(survivor) && survivor.type === "social" ? `/${id}/settings/networks` : void 0;
    collect(element, survivor, `/${id}`, true, lost, socialNetworksPointer);
  }
  return lost;
}

// src/skill-scripts/email-model-editor/run-sdk.ts
function isEditorJson(value) {
  return isObject(value) && isObject(value.settings) && (value.stripes === void 0 || Array.isArray(value.stripes));
}
function normalizeDiagnostics(diagnostics) {
  if (!diagnostics) return void 0;
  return {
    mutationCount: diagnostics.mutationCount,
    warnings: Array.isArray(diagnostics.warnings) ? diagnostics.warnings.slice(0, 50) : [],
    selectorMisses: Array.isArray(diagnostics.selectorMisses) ? diagnostics.selectorMisses.slice(0, 50) : [],
    validation: diagnostics.validation
  };
}
async function importFresh(filePath) {
  const url = pathToFileURL2(path2.resolve(filePath));
  url.searchParams.set("t", String(Date.now()));
  return import(url.href);
}
function resolveChangeFunction(module) {
  const candidate = module.default ?? module.mutate ?? module.build;
  if (typeof candidate !== "function") {
    throw new Error("Change script must export a default function, mutate(), or build().");
  }
  return candidate;
}
function resolveResult(returned) {
  if (returned !== void 0) {
    if (isObject(returned) && typeof returned.finish === "function") return returned.finish();
    return returned;
  }
  throw new Error("Create mode script must return native email editor JSON or an SDK builder/session.");
}
function writeFailureDiagnostics({ diagnosticsPath, inputPath, outputPath, sdkPath, mode, error }) {
  if (!diagnosticsPath) return;
  const failure = {
    status: "error",
    mode,
    inputPath,
    outputPath,
    sdkPath,
    error: compactError(error)
  };
  writeJson(diagnosticsPath, failure);
}
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = optionalString(args, "input");
  const scriptPath = requireString(args, "script");
  const outputPath = requireString(args, "output");
  const diagnosticsPath = optionalString(args, "diagnostics") ?? `${outputPath}.diagnostics.json`;
  const mode = inputPath ? "mutate" : "create";
  let sdkPath;
  try {
    for (const key of Object.keys(args)) {
      if (!["input", "script", "output", "diagnostics", "schema"].includes(key)) {
        throw new Error(`Unknown argument: --${key}`);
      }
    }
    sdkPath = resolveSdkDist();
    const sdk = await loadSdk(sdkPath);
    const inputJson = inputPath ? readJson(inputPath) : void 0;
    const inputSummary = inputJson === void 0 ? void 0 : summarizeEditorJson(inputJson);
    const scriptModule = await importFresh(scriptPath);
    const change = resolveChangeFunction(scriptModule);
    const components = scriptModule.components;
    if (components !== void 0 && !isObject(components)) {
      throw new Error("The script's components export must be an object keyed by component name.");
    }
    const session = inputJson === void 0 ? void 0 : sdk.createEmailMutationSdk({
      emailJson: inputJson,
      components
    });
    const changeContext = session ? { email: session.email } : {
      email: void 0,
      session,
      sdk,
      input: inputJson,
      inputPath,
      outputPath,
      diagnosticsPath
    };
    const returned = await change(changeContext);
    if (session && returned !== void 0) {
      throw new Error("Edit scripts must not return a replacement document or value. Mutate email and return nothing.");
    }
    const resultJson = session ? session.finish() : resolveResult(returned);
    if (!isEditorJson(resultJson)) {
      throw new Error("SDK script did not produce native email editor JSON with settings and optional stripes.");
    }
    const validation = await validateEditorJson(resultJson, sdkPath);
    if (!validation.valid) {
      throw new Error(`Output failed native editor schema validation: ${validation.error?.message ?? "unknown error"}`);
    }
    const outputSummary = summarizeEditorJson(resultJson);
    const sdkDiagnostics = normalizeDiagnostics(session?.diagnostics?.());
    if (session) {
      if ((sdkDiagnostics?.mutationCount ?? 0) === 0) {
        throw new Error("Edit script made no SDK mutations.");
      }
      if ((sdkDiagnostics?.selectorMisses.length ?? 0) > 0) {
        throw new Error(`Edit recorded ${sdkDiagnostics?.selectorMisses.length} selector miss(es).`);
      }
      if (inputSummary?.counts.blocks === 0) {
        if (!isDeepStrictEqual(
          { ...inputJson, metadata: void 0 },
          { ...resultJson, metadata: void 0 }
        )) throw new Error("Edits to a model without blocks must only change metadata.");
      } else if (outputSummary.counts.blocks === 0) {
        throw new Error("Edits must leave at least one block.");
      }
      const lostKeys = findLostKeys(inputJson, resultJson);
      if (lostKeys.length > 0) {
        throw new Error(
          `Edit dropped ${lostKeys.length} key(s) the acquired model had, and persistence would delete them: ${lostKeys.slice(0, 8).join(", ")}${lostKeys.length > 8 ? ", \u2026" : ""}. Persist the complete model; use a supported setter to clear optional settings.`
        );
      }
    }
    writeJson(outputPath, resultJson);
    const diagnostics = {
      status: "ok",
      mode,
      inputPath,
      outputPath,
      sdkPath,
      changed: inputJson === void 0 ? true : JSON.stringify(inputJson) !== JSON.stringify(resultJson),
      inputSummary,
      outputSummary,
      sdkDiagnostics,
      validation
    };
    writeJson(diagnosticsPath, diagnostics);
    console.log(JSON.stringify({
      status: "ok",
      mode,
      outputPath,
      diagnosticsPath,
      changed: diagnostics.changed,
      counts: outputSummary.counts
    }));
  } catch (error) {
    writeFailureDiagnostics({ diagnosticsPath, inputPath, outputPath, sdkPath, mode, error });
    console.error(compactError(error).message);
    process.exit(1);
  }
}
main().catch((error) => {
  console.error(compactError(error).message);
  process.exitCode = 1;
});

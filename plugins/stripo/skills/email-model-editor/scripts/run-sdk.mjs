// src/skill-scripts/email-model-editor/run-sdk.ts
import path2 from "node:path";
import { pathToFileURL as pathToFileURL2 } from "node:url";
import { isDeepStrictEqual } from "node:util";
import { rmSync as rmSync2 } from "node:fs";

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
    validation: diagnostics.validation,
    skipped: diagnostics.skipped
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
  beginOutputs(outputPath, diagnosticsPath, [inputPath, scriptPath, optionalString(args, "runtime-snapshot")]);
  try {
    for (const key of Object.keys(args)) {
      if (!["input", "script", "output", "diagnostics", "schema", "runtime-snapshot"].includes(key)) {
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
    const changeContext = session ? { email: session.email, skip: (reason) => session.skip(reason), transaction: (callback) => session.transaction(callback) } : {
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
    const output = await prepareOutput(sdk, {
      current: inputJson,
      target: session ? void 0 : resolveResult(returned),
      session,
      runtimeSnapshotPath: optionalString(args, "runtime-snapshot")
    });
    const resultJson = output.documentState;
    const verification = output.verification;
    if (!isEditorJson(resultJson)) {
      throw new Error("SDK script did not produce native email editor JSON with settings and optional stripes.");
    }
    const validation = await validateEditorJson(resultJson, sdkPath, { current: inputJson });
    if (!validation.valid) {
      throw new Error(`Output failed native editor schema validation: ${validation.error?.message ?? "unknown error"}`);
    }
    const outputSummary = summarizeEditorJson(resultJson);
    const sdkDiagnostics = normalizeDiagnostics(session?.diagnostics?.());
    if (session) {
      if (sdkDiagnostics?.skipped) {
        writeJson(diagnosticsPath, { status: "skipped", reason: sdkDiagnostics.skipped, inputPath, outputPath, sdkDiagnostics });
        console.log(JSON.stringify({ status: "skipped", reason: sdkDiagnostics.skipped, diagnosticsPath }));
        return;
      }
      if ((sdkDiagnostics?.mutationCount ?? 0) === 0) {
        throw new Error("Edit script made no SDK mutations.");
      }
      if ((sdkDiagnostics?.selectorMisses.length ?? 0) > 0) {
        throw new Error(`Edit recorded ${sdkDiagnostics?.selectorMisses.length} selector miss(es).`);
      }
      if (isDeepStrictEqual(inputJson, resultJson)) throw new Error("Requested SDK mutations produced no document change.");
      if (inputSummary?.counts.blocks === 0) {
        if (!isDeepStrictEqual(
          { ...inputJson, metadata: void 0 },
          { ...resultJson, metadata: void 0 }
        )) throw new Error("Edits to a model without blocks must only change metadata.");
      } else if (outputSummary.counts.blocks === 0) {
        throw new Error("Edits must leave at least one block.");
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
      validation,
      verification: verification ?? { level: "contract", ...sdk.getContract() }
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
    rmSync2(outputPath, { force: true });
    writeFailureDiagnostics({ diagnosticsPath, inputPath, outputPath, sdkPath, mode, error });
    console.error(compactError(error).message);
    process.exit(1);
  }
}
main().catch((error) => {
  console.error(compactError(error).message);
  process.exitCode = 1;
});

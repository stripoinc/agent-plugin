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
function optionalString(args, key) {
  const value = args[key];
  return typeof value === "string" && value.trim() !== "" ? value : void 0;
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

// src/skill-scripts/email-from-reference/describe-settings.ts
var GLOBAL_GROUPS = ["general", "stripes", "headings", "buttons"];
var NODE_KINDS = ["stripe", "structure", "column", "container"];
var ENUM_PREVIEW = 30;
async function main() {
  const args = parseArgs(process.argv.slice(2));
  const sdk = await loadSdk(resolveSdkDist(import.meta.url));
  const schema = sdk.getJsonSchema();
  const definitions = schema.definitions;
  const blocks = sdk.getCapabilities().blocks.filter((kind) => kind !== "unknown");
  const targets = [...GLOBAL_GROUPS, ...NODE_KINDS, ...blocks];
  const target = optionalString(args, "target");
  if (!target || !targets.includes(target)) {
    throw new Error(`Use --target with one of: ${targets.join(", ")}.`);
  }
  const full = args.full === true;
  const deref = (node) => {
    let current = isObject(node) ? node : {};
    while (typeof current.$ref === "string") current = definitions[current.$ref.split("/").pop()] ?? {};
    return current;
  };
  const properties = (node) => objectProperties(deref(node));
  const leaf = (node) => {
    if (node.const !== void 0) return JSON.stringify(node.const);
    if (Array.isArray(node.enum)) {
      const values = node.enum.map((value) => JSON.stringify(value));
      return !full && values.length > ENUM_PREVIEW ? `${values.slice(0, ENUM_PREVIEW).join("|")}|\u2026 ${values.length - ENUM_PREVIEW} more (--full)` : values.join("|");
    }
    let text = node.type === "integer" ? "int" : typeof node.type === "string" ? node.type : "any";
    const maximum = typeof node.maximum === "number" && node.maximum < 1e9 ? node.maximum : "";
    if (node.minimum !== void 0 || maximum !== "") text += ` ${node.minimum ?? ""}..${maximum}`;
    return text;
  };
  const rows = [];
  const walk = (input, path2) => {
    const node = deref(input);
    const variants = node.anyOf ?? node.oneOf;
    if (Array.isArray(variants)) {
      const resolved = variants.map(deref);
      const scalars = resolved.filter((variant) => !variant.properties && variant.type !== "array");
      if (scalars.length) rows.push({ path: path2, shape: scalars.map(leaf).join(" | ") });
      for (const variant of resolved.filter((variant2) => variant2.properties || variant2.type === "array")) walk(variant, path2);
      return;
    }
    if (node.properties) {
      for (const [key, child] of Object.entries(objectProperties(node))) walk(child, path2 ? `${path2}.${key}` : key);
      return;
    }
    if (node.type === "array") return walk(node.items, `${path2}[]`);
    rows.push({ path: path2, shape: leaf(node) });
  };
  let heading;
  if (GLOBAL_GROUPS.includes(target)) {
    heading = `model.settings.${target}`;
    walk(properties(schema.properties ? schema.properties.settings : {})[target], "");
  } else if (NODE_KINDS.includes(target)) {
    heading = `${target}.settings`;
    walk(properties(definitions[target]).settings, "");
  } else {
    heading = `${target} block settings (type: "${target}")`;
    walk(properties(definitions[`${target}Block`]).settings, "");
  }
  console.log([
    `# ${heading}; {a,b} lists siblings with the same shape; the builder fills omitted settings`,
    ...compact(rows).map((row) => `${row.path}: ${row.shape}`)
  ].join("\n"));
}
function objectProperties(node) {
  return isObject(node.properties) ? node.properties : {};
}
function compact(rows) {
  const shapes = new Map(rows.map((row) => [row.path, row.shape]));
  const merged = [];
  const consumed = /* @__PURE__ */ new Set();
  for (const row of rows) {
    if (consumed.has(row.path)) continue;
    const twin = row.path.includes(".desktop") ? row.path.replace(".desktop", ".mobile") : void 0;
    if (twin !== void 0 && shapes.get(twin) === row.shape) {
      merged.push({ path: row.path.replace(".desktop", ".{desktop,mobile}"), shape: row.shape });
      consumed.add(twin);
    } else merged.push(row);
  }
  const grouped = [];
  for (const row of merged) {
    const split = row.path.lastIndexOf(".");
    const parent = split < 0 ? "" : row.path.slice(0, split + 1);
    const key = row.path.slice(split + 1);
    const previous = grouped.at(-1);
    const previousSplit = previous ? previous.path.lastIndexOf(".") : -1;
    if (previous && parent && previous.shape === row.shape && previous.path.slice(0, previousSplit + 1) === parent && !key.includes("{")) {
      const keys = previous.path.slice(previousSplit + 1).replace(/^\{|\}$/gu, "");
      previous.path = `${parent}{${keys},${key}}`;
    } else grouped.push({ ...row });
  }
  return grouped;
}
main().catch((error) => {
  console.error(compactError(error).message);
  process.exitCode = 1;
});

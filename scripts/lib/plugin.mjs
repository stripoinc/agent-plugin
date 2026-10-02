import {createHash} from "node:crypto";
import {chmodSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, writeFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import semver from "semver";
import {parseDocument} from "yaml";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const PLUGIN = "plugins/stripo";
export const METADATA = "plugin-metadata.json";
export const SYNCED_ITEMS = ["skills", "packages", "mcp-tools.json", "bundle.json"];

export function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

export function readJson(root, file) {
  return JSON.parse(readFileSync(path.join(root, file), "utf8"));
}

export function json(value) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

export function validVersion(version) {
  return typeof version === "string" && /^\d/u.test(version) && semver.valid(version) !== null;
}

export function requireVersionIncrease(previous, next) {
  requireCondition(validVersion(previous) && validVersion(next), `Invalid semantic version: ${previous} -> ${next}.`);
  requireCondition(semver.gt(next, previous), `Plugin version must increase: ${previous} -> ${next}.`);
}

export function loadMetadata(root = ROOT) {
  const metadata = readJson(root, METADATA);
  requireCondition(metadata.name === "stripo", `${METADATA}: plugin name must remain stripo.`);
  requireCondition(validVersion(metadata.version), `${METADATA}: invalid semantic version.`);
  for (const [label, value] of Object.entries({
    description: metadata.description,
    author: metadata.author?.name,
    marketplaceName: metadata.marketplace?.name,
    marketplaceDescription: metadata.marketplace?.description,
    marketplaceCategory: metadata.marketplace?.category,
    displayName: metadata.codexInterface?.displayName,
    longDescription: metadata.codexInterface?.longDescription,
    codexCategory: metadata.codexInterface?.category,
  })) requireCondition(typeof value === "string" && value.trim().length > 0, `${METADATA}: ${label} is required.`);
  for (const field of ["homepage", "repository"]) {
    requireCondition(typeof metadata[field] === "string" && new URL(metadata[field]).protocol === "https:", `${METADATA}: ${field} must be an HTTPS URL.`);
  }
  requireCondition(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(metadata.marketplace.name), "Invalid marketplace name.");
  for (const [label, values] of Object.entries({
    keywords: metadata.keywords,
    capabilities: metadata.codexInterface.capabilities,
    defaultPrompt: metadata.codexInterface.defaultPrompt,
  })) requireCondition(Array.isArray(values) && values.length > 0 && values.every((value) => typeof value === "string" && value.trim()), `${METADATA}: invalid ${label}.`);
  requireCondition(["AVAILABLE", "INSTALLED_BY_DEFAULT", "NOT_AVAILABLE"].includes(metadata.marketplace.policy?.installation), "Invalid marketplace installation policy.");
  requireCondition(metadata.marketplace.policy?.authentication === "ON_INSTALL", "The Stripo marketplace uses ON_INSTALL authentication.");
  const dependency = metadata.mcpDependency;
  requireCondition(dependency?.type === "mcp" && dependency.value === "stripo-mcp" && typeof dependency.description === "string" && dependency.description.trim(), "Declare the stripo-mcp dependency in plugin-metadata.json.");
  return metadata;
}

export function walkFiles(root, relative) {
  const full = path.join(root, relative);
  const stat = lstatSync(full);
  requireCondition(!stat.isSymbolicLink(), `Packaged files must not be symlinks: ${relative}`);
  if (stat.isFile()) return [relative];
  requireCondition(stat.isDirectory(), `Expected a regular file or directory: ${relative}`);
  return readdirSync(full).sort().flatMap((name) => {
    requireCondition(name !== "node_modules", `Remove node_modules from the distributed bundle: ${relative}`);
    return walkFiles(root, `${relative}/${name}`);
  });
}

export function bundleSkills(root = ROOT) {
  const {skills} = readJson(root, `${PLUGIN}/bundle.json`);
  requireCondition(Array.isArray(skills) && skills.length > 0 && new Set(skills).size === skills.length, "bundle.json must list unique skills.");
  requireCondition(skills.every((skill) => typeof skill === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(skill)), "Invalid skill name in bundle.json.");
  return skills;
}

export function withMcpDependency(source, dependency) {
  const document = parseDocument(source);
  requireCondition(document.errors.length === 0, `Invalid agents/openai.yaml: ${document.errors.map((error) => error.message).join(", ")}`);
  const current = document.toJS();
  requireCondition(current && typeof current === "object" && !Array.isArray(current), "agents/openai.yaml must be a mapping.");
  requireCondition(current.dependencies === undefined || (current.dependencies && typeof current.dependencies === "object" && !Array.isArray(current.dependencies)), "Skill dependencies must be a mapping.");
  const tools = current.dependencies?.tools ?? [];
  requireCondition(Array.isArray(tools), "Skill dependencies.tools must be an array.");
  // Preserve the upstream interface, invocation policy and unrelated dependencies.
  document.setIn(["dependencies", "tools"], [
    ...tools.filter((tool) => !(tool?.type === dependency.type && tool.value === dependency.value)),
    dependency,
  ]);
  return document.toString({defaultStringType: "QUOTE_DOUBLE", defaultKeyType: "PLAIN", lineWidth: 0});
}

export function generatedFiles(root = ROOT, metadata = loadMetadata(root), {fromBundleSync = false} = {}) {
  const {name, version, description, author, homepage, repository, keywords, marketplace, codexInterface} = metadata;
  const shared = {name, version, description, author, homepage, repository, keywords};
  const files = new Map([
    [`${PLUGIN}/.claude-plugin/plugin.json`, json(shared)],
    [`${PLUGIN}/.codex-plugin/plugin.json`, json({
      ...shared,
      skills: "./skills/",
      interface: {...codexInterface, shortDescription: description, developerName: author.name, websiteURL: homepage},
    })],
    [".claude-plugin/marketplace.json", json({
      name: marketplace.name,
      owner: {name: author.name},
      metadata: {description: marketplace.description},
      plugins: [{name, source: `./${PLUGIN}`, description, version, category: marketplace.category, keywords}],
    })],
    [".agents/plugins/marketplace.json", json({
      name: marketplace.name,
      interface: {displayName: codexInterface.displayName},
      plugins: [{name, source: {source: "local", path: `./${PLUGIN}`}, policy: marketplace.policy, category: codexInterface.category}],
    })],
    [`${PLUGIN}/.generated`, "Generated distribution; do not edit packaged files directly.\nSkills, SDK and bundle provenance: convo-email-agent, via scripts/sync-bundle.mjs.\nHost files: host/. Manifests and MCP dependency: plugin-metadata.json.\nRun npm run generate after metadata or host changes. See the root README for releases.\n"],
  ]);
  const skills = bundleSkills(root);
  const hostOverrides = [];
  for (const entry of readdirSync(path.join(root, "host"), {withFileTypes: true})) {
    if (entry.isDirectory()) requireCondition(skills.includes(entry.name), `host/${entry.name} matches no bundled skill.`);
  }
  for (const skill of skills) {
    const skillDir = `${PLUGIN}/skills/${skill}`;
    files.set(`${skillDir}/HOST.md`, readFileSync(path.join(root, "host/HOST.md")));
    const overlay = `host/${skill}`;
    if (existsSync(path.join(root, overlay))) {
      for (const file of walkFiles(root, overlay)) {
        files.set(`${skillDir}/${file.slice(overlay.length + 1)}`, readFileSync(path.join(root, file)));
        hostOverrides.push(file);
      }
    }
    const agentFile = `${skillDir}/agents/openai.yaml`;
    const source = files.get(agentFile)?.toString() ?? readFileSync(path.join(root, agentFile), "utf8");
    files.set(agentFile, withMcpDependency(source, metadata.mcpDependency));
  }
  if (!fromBundleSync && existsSync(path.join(root, "bundle-integrity.json"))) {
    const previous = readJson(root, "bundle-integrity.json").hostOverrides ?? [];
    const removed = previous.filter((file) => !hostOverrides.includes(file));
    requireCondition(removed.length === 0, `Host overrides were removed: ${removed.join(", ")}. Run scripts/sync-bundle.mjs with a clean upstream bundle to restore upstream files and remove obsolete helpers.`);
  }
  const paths = new Set(SYNCED_ITEMS.flatMap((item) => walkFiles(root, `${PLUGIN}/${item}`)));
  for (const file of files.keys()) {
    if (SYNCED_ITEMS.some((item) => file.startsWith(`${PLUGIN}/${item}/`))) paths.add(file);
  }
  const bundle = readJson(root, `${PLUGIN}/bundle.json`);
  files.set("bundle-integrity.json", json({
    sourceRevision: bundle.sourceRevision,
    hostOverrides: hostOverrides.sort(),
    files: Object.fromEntries([...paths].sort().map((file) => [
      file.slice(PLUGIN.length + 1),
      createHash("sha256").update(files.get(file) ?? readFileSync(path.join(root, file))).digest("hex"),
    ])),
  }));
  return files;
}

export function generateMetadata(root = ROOT, {check = false, metadata = loadMetadata(root), fromBundleSync = false} = {}) {
  const files = generatedFiles(root, metadata, {fromBundleSync});
  const stale = [];
  for (const [relative, contents] of files) {
    const destination = path.join(root, relative);
    const overlay = relative.startsWith(`${PLUGIN}/skills/`) ? path.join(root, "host", relative.slice(`${PLUGIN}/skills/`.length)) : null;
    const executable = overlay && existsSync(overlay) ? lstatSync(overlay).mode & 0o111 : null;
    const present = existsSync(destination);
    const sameContent = present && readFileSync(destination).equals(Buffer.from(contents));
    const sameMode = executable === null || (present && (lstatSync(destination).mode & 0o111) === executable);
    if (sameContent && sameMode) continue;
    if (check) stale.push(relative);
    else {
      mkdirSync(path.dirname(destination), {recursive: true});
      writeFileSync(destination, contents);
      if (executable !== null) chmodSync(destination, (lstatSync(destination).mode & ~0o111) | executable);
    }
  }
  // Regeneration re-hashes whatever is on disk, so name the packaged files behind a stale
  // inventory instead of only pointing at the command that would accept them.
  const differences = stale.includes("bundle-integrity.json") ? inventoryDifferences(root, files.get("bundle-integrity.json")) : [];
  const hint = differences.length > 0
    ? `Inventory entries that would change:\n${differences.join("\n")}\nSkill and SDK files change only through scripts/sync-bundle.mjs: restore an unintended edit. After an intended metadata or host change, run npm run generate and review the diff.`
    : "Run npm run generate and review the diff.";
  requireCondition(stale.length === 0, `Generated files are out of date:\n${stale.join("\n")}\n${hint}`);
  return files.size;
}

function inventoryDifferences(root, computed) {
  if (!existsSync(path.join(root, "bundle-integrity.json"))) return [];
  const recorded = readJson(root, "bundle-integrity.json").files ?? {};
  const current = JSON.parse(computed).files;
  return [...new Set([...Object.keys(recorded), ...Object.keys(current)])].sort()
    .filter((file) => recorded[file] !== current[file])
    .map((file) => `${PLUGIN}/${file} (${file in current ? (file in recorded ? "changed" : "not in the inventory") : "missing"})`);
}

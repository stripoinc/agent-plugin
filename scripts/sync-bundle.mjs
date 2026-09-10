#!/usr/bin/env node
/**
 * Sync the Stripo bundle built by convo-email-agent into plugins/stripo.
 *
 *   node scripts/sync-bundle.mjs [--bundle <dir>] [--version <x.y.z>] [--allow-dirty]
 *
 * --bundle       bundle directory; default ../convo-email-agent/dist/convo-email-agent/stripo
 * --version      plugin version to publish; default is the bundle version
 * --allow-dirty  accept a bundle built from an uncommitted checkout (local testing only)
 *
 * The script replaces skills/, packages/, mcp-tools.json and bundle.json under plugins/stripo,
 * adds the host paths paragraph to the SKILL.md files that carry the placeholders, installs the
 * host files beside each skill, checks that the SDK loads from its new location, and writes the
 * version into both plugin manifests and the Claude Code marketplace entry. Nothing else in the
 * repository is touched.
 *
 * Host files come from host/: a skill with a host/<skill>/ directory gets that directory copied
 * over it (HOST.md plus any helper the skill calls by path), and every other skill gets the
 * shared host/HOST.md.
 */
import {cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath, pathToFileURL} from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN = path.join(ROOT, "plugins", "stripo");
const DEFAULT_BUNDLE = path.join(ROOT, "..", "convo-email-agent", "dist", "convo-email-agent", "stripo");
const SYNCED_ITEMS = ["skills", "packages", "mcp-tools.json", "bundle.json"];
const PLUGIN_MANIFESTS = [
  path.join(PLUGIN, ".claude-plugin", "plugin.json"),
  path.join(PLUGIN, ".codex-plugin", "plugin.json"),
];
const CLAUDE_MARKETPLACE = path.join(ROOT, ".claude-plugin", "marketplace.json");
const HOST_ROOT = path.join(ROOT, "host");
const HOST_NOTES = path.join(HOST_ROOT, "HOST.md");
const SDK_ENTRY = path.join(PLUGIN, "packages", "convo-email-agent", "index.js");
const HOST_PARAGRAPH = [
  "Host paths: in Claude Code `<skill-dir>` is `${CLAUDE_SKILL_DIR}` and `<bundle-root>` is",
  "`${CLAUDE_PLUGIN_ROOT}`. In Codex `<skill-dir>` is the directory of this `SKILL.md`. In both",
  "hosts `<bundle-root>` is two levels above `<skill-dir>`. Read `HOST.md` beside this file for",
  "the working directory and file-transfer commands before the first MCP call.",
].join("\n");

function usage() {
  return "Usage: node scripts/sync-bundle.mjs [--bundle <dir>] [--version <x.y.z>] [--allow-dirty]";
}

function fail(message) {
  console.error(`sync-bundle: ${message}`);
  process.exit(1);
}

function parseArgs(argv) {
  const options = {bundle: undefined, version: undefined, allowDirty: false};
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--help" || argument === "-h") {
      console.log(usage());
      process.exit(0);
    }
    if (argument === "--allow-dirty") {
      options.allowDirty = true;
      continue;
    }
    if (argument === "--bundle" || argument === "--version") {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) fail(`Missing value for ${argument}.`);
      options[argument === "--bundle" ? "bundle" : "version"] = value;
      index += 1;
      continue;
    }
    fail(`Unknown argument: ${argument}\n${usage()}`);
  }
  return options;
}

function readJson(file) {
  if (!existsSync(file)) fail(`Missing file: ${file}`);
  return JSON.parse(readFileSync(file, "utf8"));
}

function writeJson(file, value) {
  writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function addHostParagraph(skillFile) {
  const source = readFileSync(skillFile, "utf8");
  // The paragraph resolves `<skill-dir>` and `<bundle-root>`. The brandkit skills use neither
  // placeholder and name their own roots, so adding it there would only contradict them.
  if (!source.includes("<skill-dir>")) return;
  const lines = source.split("\n");
  if (lines[0] !== "---") fail(`${skillFile} has no frontmatter.`);
  const frontmatterEnd = lines.indexOf("---", 1);
  if (frontmatterEnd === -1) fail(`${skillFile} has an unterminated frontmatter block.`);
  const heading = lines.findIndex((line, index) => index > frontmatterEnd && line.startsWith("# "));
  if (heading === -1) fail(`${skillFile} has no top-level heading.`);
  lines.splice(heading + 1, 0, "", HOST_PARAGRAPH);
  writeFileSync(skillFile, lines.join("\n"), "utf8");
}

function installHostFiles(skill) {
  const destination = path.join(PLUGIN, "skills", skill);
  const overlay = path.join(HOST_ROOT, skill);
  if (existsSync(overlay)) {
    // The brandkit skills call host-owned helpers by path, so an overlay carries scripts/
    // beside its HOST.md. cpSync copies the file mode, which keeps the helpers executable.
    cpSync(overlay, destination, {recursive: true});
  } else {
    cpSync(HOST_NOTES, path.join(destination, "HOST.md"));
  }
  if (!existsSync(path.join(destination, "HOST.md"))) fail(`Skill ${skill} has no HOST.md after the host overlay.`);
}

async function checkSdk(skills) {
  const sdk = await import(pathToFileURL(SDK_ENTRY).href);
  if (typeof sdk.setEmailSchema !== "function") fail(`SDK at ${SDK_ENTRY} does not export setEmailSchema.`);
  for (const skill of skills) {
    // The runners resolve the SDK relative to their own scripts/ directory (resolveSdkDist).
    const resolved = path.resolve(PLUGIN, "skills", skill, "scripts", "../../../packages/convo-email-agent/index.js");
    if (resolved !== SDK_ENTRY) fail(`Skill ${skill} cannot reach the SDK: ${resolved}`);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const bundle = path.resolve(options.bundle ?? DEFAULT_BUNDLE);
  for (const file of [...PLUGIN_MANIFESTS, CLAUDE_MARKETPLACE, HOST_NOTES]) {
    if (!existsSync(file)) fail(`Plugin skeleton is incomplete, missing ${file}`);
  }

  const manifest = readJson(path.join(bundle, "bundle.json"));
  if (manifest.brand !== "stripo") fail(`Bundle at ${bundle} is for brand ${JSON.stringify(manifest.brand)}, expected stripo.`);
  if (manifest.sourceDirty !== false && !options.allowDirty) {
    fail("Bundle was built from an uncommitted checkout (sourceDirty is not false). Commit and rebuild, or pass --allow-dirty for a local test.");
  }
  if (!Array.isArray(manifest.skills) || manifest.skills.length === 0) fail("bundle.json lists no skills.");
  for (const item of SYNCED_ITEMS) {
    if (!existsSync(path.join(bundle, item))) fail(`Bundle is missing ${item}.`);
  }
  for (const skill of manifest.skills) {
    const skillDir = path.join(bundle, "skills", skill);
    if (!existsSync(path.join(skillDir, "SKILL.md"))) fail(`Bundle skill ${skill} lacks SKILL.md.`);
    // The brandkit satellites are prompt-only and ship no scripts/ directory.
    const scripts = path.join(skillDir, "scripts");
    if (existsSync(scripts) && !statSync(scripts).isDirectory()) fail(`Bundle skill ${skill} has a scripts/ that is not a directory.`);
  }
  for (const entry of readdirSync(HOST_ROOT, {withFileTypes: true})) {
    if (entry.isDirectory() && !manifest.skills.includes(entry.name)) fail(`host/${entry.name} matches no skill in the bundle.`);
  }

  const version = options.version ?? manifest.version;
  if (!/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/u.test(version)) fail(`Version ${JSON.stringify(version)} is not a semantic version.`);
  const currentVersion = readJson(PLUGIN_MANIFESTS[0]).version;
  if (version === currentVersion) {
    fail(`Plugin version ${version} is unchanged; installed copies would not update. Pass --version <new version>.`);
  }

  for (const item of SYNCED_ITEMS) {
    const destination = path.join(PLUGIN, item);
    rmSync(destination, {recursive: true, force: true});
    cpSync(path.join(bundle, item), destination, {recursive: true});
  }
  for (const skill of manifest.skills) {
    addHostParagraph(path.join(PLUGIN, "skills", skill, "SKILL.md"));
    installHostFiles(skill);
  }
  await checkSdk(manifest.skills.filter((skill) => existsSync(path.join(PLUGIN, "skills", skill, "scripts"))));

  for (const file of PLUGIN_MANIFESTS) {
    const json = readJson(file);
    json.version = version;
    writeJson(file, json);
  }
  const marketplace = readJson(CLAUDE_MARKETPLACE);
  const entry = (marketplace.plugins ?? []).find((plugin) => plugin.name === "stripo");
  if (!entry) fail(`${CLAUDE_MARKETPLACE} has no plugin named stripo.`);
  entry.version = version;
  writeJson(CLAUDE_MARKETPLACE, marketplace);

  console.log(JSON.stringify({
    status: "ok",
    version,
    previousVersion: currentVersion,
    bundleVersion: manifest.version,
    sourceRevision: manifest.sourceRevision,
    skills: manifest.skills,
  }, null, 2));
}

await main();

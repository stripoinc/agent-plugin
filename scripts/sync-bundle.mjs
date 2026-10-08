#!/usr/bin/env node
/**
 * Sync the Stripo bundle built by convo-email-agent into plugins/stripo.
 *
 *   node scripts/sync-bundle.mjs [--bundle <dir>] [--version <x.y.z>] [--base <git-ref>] [--allow-dirty]
 *
 * --bundle       bundle directory; default ../convo-email-agent/dist/convo-email-agent/stripo
 * --version      plugin version to publish; default is the bundle version
 * --base         allow rebuilding an unpublished draft newer than this ancestor
 * --allow-dirty  accept a bundle built from an uncommitted checkout (local testing only)
 *
 * The script replaces skills/, packages/, mcp-tools.json and bundle.json under plugins/stripo,
 * adds the host paths paragraph to the SKILL.md files that carry the placeholders, installs the
 * host files beside each skill, checks that the SDK loads from its new location, and updates
 * plugin-metadata.json. The shared generator refreshes both manifests, both marketplaces,
 * MCP dependency declarations and bundle-integrity.json.
 *
 * Host files come from host/: a skill with a host/<skill>/ directory gets that directory copied
 * over it (HOST.md plus any helper the skill calls by path), and every other skill gets the
 * shared host/HOST.md.
 */
import {cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync} from "node:fs";
import {execFileSync} from 'node:child_process';
import path from "node:path";
import {fileURLToPath, pathToFileURL} from "node:url";
import {generateMetadata, loadMetadata, METADATA, requireVersionIncrease, SYNCED_ITEMS} from "./lib/plugin.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PLUGIN = path.join(ROOT, "plugins", "stripo");
const DEFAULT_BUNDLE = path.join(ROOT, "..", "convo-email-agent", "dist", "convo-email-agent", "stripo");
const HOST_ROOT = path.join(ROOT, "host");
const HOST_NOTES = path.join(HOST_ROOT, "HOST.md");
const SDK_ENTRY = path.join(PLUGIN, "packages", "convo-email-agent", "index.js");
const HOST_PARAGRAPH = [
  "Host paths: in Claude Code `<skill-dir>` is `${CLAUDE_SKILL_DIR}` and `<bundle-root>` is",
  "`${CLAUDE_PLUGIN_ROOT}`. In Codex `<skill-dir>` is the directory of this `SKILL.md`. In both",
  "hosts `<bundle-root>` is two levels above `<skill-dir>`. Read `HOST.md` beside this file for",
  "the working directory and file-transfer commands before local file work or transfers.",
].join("\n");

function usage() {
  return "Usage: node scripts/sync-bundle.mjs [--bundle <dir>] [--version <x.y.z>] [--base <git-ref>] [--allow-dirty]";
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
    if (argument === "--bundle" || argument === "--version" || argument === '--base') {
      const value = argv[index + 1];
      if (!value || value.startsWith("--")) fail(`Missing value for ${argument}.`);
      options[argument.slice(2)] = value;
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
  if (!source.includes("<skill-dir>") || source.includes(HOST_PARAGRAPH)) return;
  const lines = source.split("\n");
  if (lines[0] !== "---") fail(`${skillFile} has no frontmatter.`);
  const frontmatterEnd = lines.indexOf("---", 1);
  if (frontmatterEnd === -1) fail(`${skillFile} has an unterminated frontmatter block.`);
  const heading = lines.findIndex((line, index) => index > frontmatterEnd && line.startsWith("# "));
  if (heading === -1) fail(`${skillFile} has no top-level heading.`);
  lines.splice(heading + 1, 0, "", HOST_PARAGRAPH);
  writeFileSync(skillFile, lines.join("\n"), "utf8");
}

async function checkSdk(skills) {
  const sdk = await import(pathToFileURL(SDK_ENTRY).href);
  for (const name of ["assertValidEmailModel", "validateEmailDocument", "createEmailSdk"]) {
    if (typeof sdk[name] !== "function") fail(`SDK at ${SDK_ENTRY} does not export ${name}.`);
  }
  for (const skill of skills) {
    // The runners resolve the SDK relative to their own scripts/ directory (resolveSdkDist).
    const resolved = path.resolve(PLUGIN, "skills", skill, "scripts", "../../../packages/convo-email-agent/index.js");
    if (resolved !== SDK_ENTRY) fail(`Skill ${skill} cannot reach the SDK: ${resolved}`);
  }
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  const bundle = path.resolve(options.bundle ?? DEFAULT_BUNDLE);
  const metadata = loadMetadata(ROOT);
  if (bundle === PLUGIN || bundle.startsWith(`${PLUGIN}${path.sep}`)) fail("The source bundle must be outside plugins/stripo.");
  for (const file of [path.join(ROOT, METADATA), HOST_NOTES]) {
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
    // A skill may be prompt-only and ship no scripts/ directory.
    const scripts = path.join(skillDir, "scripts");
    if (existsSync(scripts) && !statSync(scripts).isDirectory()) fail(`Bundle skill ${skill} has a scripts/ that is not a directory.`);
  }
  for (const entry of readdirSync(HOST_ROOT, {withFileTypes: true})) {
    if (entry.isDirectory() && !manifest.skills.includes(entry.name)) fail(`host/${entry.name} matches no skill in the bundle.`);
  }

  const version = options.version ?? manifest.version;
  const currentVersion = metadata.version;
  if (version === currentVersion && options.base) {
    // Rebuild an unreleased draft version only relative to an explicit older
    // base. Equality is still rejected for a version already on that base.
    const git = (...args) => execFileSync('git', args, {cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']}).trim();
    const base = git('rev-parse', '--verify', '--end-of-options', `${options.base}^{commit}`);
    git('merge-base', '--is-ancestor', base, 'HEAD');
    const previous = JSON.parse(git('show', `${base}:${METADATA}`)).version;
    requireVersionIncrease(previous, version);
  } else requireVersionIncrease(currentVersion, version);

  for (const item of SYNCED_ITEMS) {
    const destination = path.join(PLUGIN, item);
    rmSync(destination, {recursive: true, force: true});
    cpSync(path.join(bundle, item), destination, {recursive: true});
  }
  for (const skill of manifest.skills) {
    addHostParagraph(path.join(PLUGIN, "skills", skill, "SKILL.md"));
  }
  await checkSdk(manifest.skills.filter((skill) => existsSync(path.join(PLUGIN, "skills", skill, "scripts"))));
  const nextMetadata = {...metadata, version};
  generateMetadata(ROOT, {metadata: nextMetadata, fromBundleSync: true});
  writeJson(path.join(ROOT, METADATA), nextMetadata);

  console.log(JSON.stringify({
    status: "ok",
    version,
    previousVersion: currentVersion,
    bundleVersion: manifest.version,
    sourceRevision: manifest.sourceRevision,
    skills: manifest.skills,
  }, null, 2));
}

try {
  await main();
} catch (error) {
  fail(error.message);
}

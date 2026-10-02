#!/usr/bin/env node
import {spawnSync} from "node:child_process";
import {cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync} from "node:fs";
import {tmpdir} from "node:os";
import path from "node:path";
import {pathToFileURL} from "node:url";
import semver from "semver";
import {parseDocument} from "yaml";
import {ROOT, PLUGIN, bundleSkills, generateMetadata, readJson, requireCondition, walkFiles} from "./lib/plugin.mjs";

// Generated at the plugin root, outside the inventoried bundle items.
const PLUGIN_ROOT_FILES = [".claude-plugin/plugin.json", ".codex-plugin/plugin.json", ".generated"];

function requirePath(root, relative, kind = "file") {
  requireCondition(typeof relative === "string" && relative.startsWith("./"), `Expected a bundle-relative path: ${relative}`);
  const base = path.join(root, PLUGIN);
  const full = path.resolve(base, relative);
  const inside = path.relative(base, full);
  requireCondition(inside !== ".." && !inside.startsWith(`..${path.sep}`) && !path.isAbsolute(inside), `Path leaves the plugin: ${relative}`);
  requireCondition(existsSync(full) && (kind === "directory" ? statSync(full).isDirectory() : statSync(full).isFile()), `Missing packaged ${kind}: ${relative}`);
  return full;
}

function exportPaths(value) {
  if (typeof value === "string") return [value];
  return value && typeof value === "object" ? Object.values(value).flatMap(exportPaths) : [];
}

export function validatePlugin(root = ROOT) {
  generateMetadata(root, {check: true});
  // Hosts load hooks/, .mcp.json, commands/ and agents/ from the plugin root by convention,
  // so the package may hold only the inventoried files and the generated manifests.
  const expected = new Set([...Object.keys(readJson(root, "bundle-integrity.json").files), ...PLUGIN_ROOT_FILES]);
  // .DS_Store is gitignored, so Finder metadata never reaches a release.
  const unexpected = walkFiles(root, PLUGIN).map((file) => file.slice(PLUGIN.length + 1)).filter((file) => !expected.has(file) && path.basename(file) !== ".DS_Store");
  requireCondition(unexpected.length === 0, `Unexpected files in ${PLUGIN} (not in bundle-integrity.json): ${unexpected.join(", ")}`);
  const bundle = readJson(root, `${PLUGIN}/bundle.json`);
  requireCondition(bundle.brand === "stripo" && bundle.sourceDirty === false, "Release bundle must be a clean Stripo build.");
  requireCondition(/^[a-f0-9]{40}$/u.test(bundle.sourceRevision), "Missing bundle source revision.");
  requireCondition(bundle.editorValidator?.editorDirty === false && /^[a-f0-9]{40}$/u.test(bundle.editorValidator.editorRevision) && /^[a-f0-9]{64}$/u.test(bundle.editorValidator.bundleSha256), "Missing clean editor-validator provenance.");
  const skills = bundleSkills(root);
  const directories = readdirSync(path.join(root, PLUGIN, "skills"), {withFileTypes: true}).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  requireCondition(JSON.stringify(directories) === JSON.stringify([...skills].sort()), "Skill directories do not match bundle.json.");
  for (const skill of skills) {
    const entry = requirePath(root, `./skills/${skill}/SKILL.md`);
    requirePath(root, `./skills/${skill}/HOST.md`);
    requirePath(root, `./skills/${skill}/agents/openai.yaml`);
    const frontmatter = readFileSync(entry, "utf8").match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u);
    requireCondition(frontmatter, `${skill}: missing YAML frontmatter.`);
    const document = parseDocument(frontmatter[1]);
    requireCondition(document.errors.length === 0, `${skill}: invalid YAML frontmatter.`);
    const fields = document.toJS();
    requireCondition(fields?.name === skill, `${skill}: frontmatter name must match its directory.`);
    requireCondition(typeof fields.description === "string" && fields.description.trim().length > 0 && fields.description.length <= 1024, `${skill}: description must contain 1-1024 characters.`);
  }
  requirePath(root, bundle.sdk);
  const sdkPackage = readJson(root, `${PLUGIN}/packages/convo-email-agent/package.json`);
  requireCondition(sdkPackage.version === bundle.version, "SDK version differs from bundle.json (the plugin release version is independent).");
  requireCondition(semver.satisfies(process.versions.node, sdkPackage.engines.node), `SDK requires Node.js ${sdkPackage.engines.node}.`);
  for (const file of [sdkPackage.main, sdkPackage.types, ...exportPaths(sdkPackage.exports)]) {
    requireCondition(typeof file === "string" && file.startsWith("./") && !file.split("/").includes(".."), `Invalid SDK export path: ${file}`);
    requirePath(root, `./packages/convo-email-agent/${file.slice(2)}`);
  }
  requirePath(root, bundle.mcpToolMapping);
  const mapping = readJson(root, `${PLUGIN}/${bundle.mcpToolMapping.slice(2)}`);
  const available = new Set([...Object.values(mapping.tools ?? {}), ...Object.values(mapping.auxiliaryTools ?? {})]);
  requireCondition(mapping.brand === "stripo" && Array.isArray(bundle.requiredMcpTools) && bundle.requiredMcpTools.length > 0, "Invalid Stripo MCP tool mapping.");
  for (const tool of bundle.requiredMcpTools) requireCondition(available.has(tool), `Required MCP tool is not mapped: ${tool}`);
  requirePath(root, bundle.brandkit.runtime, "directory");
  requirePath(root, bundle.brandkit.pythonRequirements);
  requirePath(root, bundle.brandkit.nodeProject, "directory");

  // An installed copy must resolve its SDK without the repository's dev dependencies,
  // a private upstream checkout, or an SDK path override in the developer's shell.
  const isolated = mkdtempSync(path.join(tmpdir(), "stripo-plugin-validate-"));
  try {
    cpSync(path.join(root, PLUGIN), path.join(isolated, "plugin"), {recursive: true});
    const env = {...process.env};
    delete env.CONVO_EMAIL_AGENT_SDK_PATH;
    delete env.STRIPO_RUNTIME_PATH;
    // The contract comparison ties bundle.json provenance to the validator the SDK actually carries.
    const code = `const sdk = await import(${JSON.stringify(`./plugin/${bundle.sdk.slice(2)}`)});\nfor (const name of ["assertValidEmailModel", "validateEmailDocument", "createEmailSdk", "getContract"]) { if (typeof sdk[name] !== "function") throw new Error("Missing SDK export: " + name); }\nconst contract = sdk.getContract();\nif (contract.editorRevision !== ${JSON.stringify(bundle.editorValidator.editorRevision)} || contract.validatorSha256 !== ${JSON.stringify(bundle.editorValidator.bundleSha256)}) throw new Error("SDK contract (" + contract.editorRevision + ", " + contract.validatorSha256 + ") differs from bundle.json editorValidator.");`;
    const result = spawnSync(process.execPath, ["--input-type=module", "--eval", code], {cwd: isolated, env, encoding: "utf8"});
    requireCondition(!result.error && result.status === 0, `SDK failed in an isolated installed copy: ${result.error?.message ?? result.stderr}`);
  } finally {
    rmSync(isolated, {recursive: true, force: true});
  }
  return {skills: skills.length, sourceRevision: bundle.sourceRevision};
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const result = validatePlugin();
    console.log(`Validated both manifest formats, package integrity, ${result.skills} skills and isolated SDK loading.`);
  } catch (error) {
    console.error(`validate-plugin: ${error.message}`);
    process.exitCode = 1;
  }
}

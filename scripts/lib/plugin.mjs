import {createHash} from "node:crypto";
import {chmodSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync} from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import semver from "semver";
import {parseDocument} from "yaml";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const PLUGIN = "plugins/stripo";
export const METADATA = "plugin-metadata.json";
export const SYNCED_ITEMS = ["skills", "packages", "mcp-tools.json", "bundle.json"];
// Skills this repository owns (such as connect); packaged beside the bundled skills.
export const REPOSITORY_SKILLS = "skills";
export const USER_CONFIG_TYPES = ["string", "number", "boolean", "directory", "file"];
export const CLAUDE_DIRECTORY_FIELDS = ['icon', 'documentationUrl', 'supportUrl', 'privacyPolicyUrl', 'termsOfServiceUrl'];
// The same listing pages under OpenAI's interface field names.
export const CODEX_LISTING_URLS = {supportUrl: 'supportURL', privacyPolicyUrl: 'privacyPolicyURL', termsOfServiceUrl: 'termsOfServiceURL'};
export const AGENT_PLUGINS_SCHEMA = "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json";
// OpenAI's public submission limits for the listing text.
export const CODEX_TEXT_LIMITS = {displayName: 30, shortDescription: 30, longDescription: 4000};

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
    displayName: metadata.displayName,
    shortDescription: metadata.codexInterface?.shortDescription,
    longDescription: metadata.codexInterface?.longDescription,
    codexCategory: metadata.codexInterface?.category,
  })) requireCondition(typeof value === "string" && value.trim().length > 0, `${METADATA}: ${label} is required.`);
  for (const [field, limit] of Object.entries(CODEX_TEXT_LIMITS)) {
    const value = field === "displayName" ? metadata.displayName : metadata.codexInterface[field];
    requireCondition(value.length <= limit, `${METADATA}: ${field} must be at most ${limit} characters.`);
  }
  // The generator derives these from top-level metadata, so the interface must not repeat them.
  for (const field of ["displayName", "developerName", "websiteURL", ...Object.values(CODEX_LISTING_URLS)]) {
    requireCondition(!(field in metadata.codexInterface), `${METADATA}: codexInterface.${field} is generated; set it at the top level or in claudeDirectory.`);
  }
  for (const field of ["homepage", "repository"]) {
    requireCondition(typeof metadata[field] === "string" && new URL(metadata[field]).protocol === "https:", `${METADATA}: ${field} must be an HTTPS URL.`);
  }
  requireCondition(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(metadata.marketplace.name), "Invalid marketplace name.");
  for (const [label, values] of Object.entries({
    keywords: metadata.keywords,
    capabilities: metadata.codexInterface.capabilities,
    defaultPrompt: metadata.codexInterface.defaultPrompt,
  })) requireCondition(Array.isArray(values) && values.length > 0 && values.every((value) => typeof value === "string" && value.trim()), `${METADATA}: invalid ${label}.`);
  requireCondition(metadata.codexInterface.capabilities.length <= 20 && metadata.codexInterface.capabilities.every((value) => value.length <= 120), `${METADATA}: at most 20 capabilities of up to 120 characters.`);
  requireCondition(metadata.codexInterface.defaultPrompt.length <= 3 && metadata.codexInterface.defaultPrompt.every((value) => value.length <= 128), `${METADATA}: at most 3 default prompts of up to 128 characters.`);
  requireCondition(["AVAILABLE", "INSTALLED_BY_DEFAULT", "NOT_AVAILABLE"].includes(metadata.marketplace.policy?.installation), "Invalid marketplace installation policy.");
  requireCondition(metadata.marketplace.policy?.authentication === "ON_INSTALL", "The Stripo marketplace uses ON_INSTALL authentication.");
  const dependency = metadata.mcpDependency;
  requireCondition(dependency?.type === "mcp" && dependency.value === "stripo-mcp" && typeof dependency.description === "string" && dependency.description.trim(), "Declare the stripo-mcp dependency in plugin-metadata.json.");
  // Stripo authenticates each organization with its own OAuth client ID, which no host can fill
  // into a bundled server entry; the connect skill registers stripo-mcp in the agent instead.
  requireCondition(metadata.mcpServer === undefined, `${METADATA}: the package carries no MCP server entry; the connect skill registers stripo-mcp.`);
  const userConfig = metadata.userConfig ?? {};
  requireCondition(userConfig && typeof userConfig === "object" && !Array.isArray(userConfig), `${METADATA}: userConfig must be an object.`);
  for (const [key, option] of Object.entries(userConfig)) {
    requireCondition(/^[A-Za-z_][A-Za-z0-9_]*$/u.test(key), `${METADATA}: invalid userConfig key ${key}.`);
    requireCondition(USER_CONFIG_TYPES.includes(option?.type) && typeof option.title === "string" && option.title.trim() && typeof option.description === "string" && option.description.trim(), `${METADATA}: userConfig.${key} needs type, title and description.`);
  }
  const onboarding = metadata.onboardingSkill;
  const onboardingSkill = typeof onboarding === "string" ? onboarding.match(/^\.\/skills\/([a-z0-9]+(?:-[a-z0-9]+)*)\/SKILL\.md$/u)?.[1] : undefined;
  requireCondition(onboardingSkill !== undefined && repositorySkills(root).includes(onboardingSkill), `${METADATA}: onboardingSkill must be ./skills/<name>/SKILL.md of a skill in ${REPOSITORY_SKILLS}/.`);
  if (metadata.license !== undefined) requireCondition(typeof metadata.license === 'string' && metadata.license.trim(), 'license must be the owner-approved license identifier.');
  requireCondition(metadata.packageFiles?.['README.md'], 'Declare the packaged README in packageFiles.');
  for (const [destination, source] of Object.entries(metadata.packageFiles)) {
    requireCondition(/^(?:README\.md|LICENSE|assets\/[a-zA-Z0-9_-]+\.(?:png|jpe?g))$/u.test(destination), `Unsupported package file: ${destination}`);
    requireCondition(destination === 'LICENSE' && source === 'LICENSE'
      || typeof source === 'string' && source.startsWith('packaging/') && !source.split('/').includes('..'),
      `Package sources must be inside packaging/ or the canonical root LICENSE: ${source}`);
    walkFiles(root, source);
  }
  for (const [field, value] of Object.entries(metadata.claudeDirectory ?? {})) {
    requireCondition(CLAUDE_DIRECTORY_FIELDS.includes(field), `Unknown Claude directory field: ${field}`);
    if (field === 'icon') requireCondition(typeof value === 'string' && value.startsWith('./') && metadata.packageFiles[value.slice(2)], 'Claude icon must reference an inventoried package file.');
    else requireCondition(typeof value === 'string' && new URL(value).protocol === 'https:', `${field} must be an HTTPS URL.`);
  }
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

export function repositorySkills(root = ROOT) {
  const directory = path.join(root, REPOSITORY_SKILLS);
  if (!existsSync(directory)) return [];
  const names = readdirSync(directory, {withFileTypes: true}).filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
  for (const name of names) {
    requireCondition(/^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(name), `Invalid repository skill name: ${name}`);
    requireCondition(existsSync(path.join(directory, name, "SKILL.md")), `Repository skill ${name} lacks SKILL.md.`);
  }
  return names;
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

function obsoleteRepositorySkillPaths(root, files) {
  const bundled = new Set(bundleSkills(root));
  const inventory = existsSync(path.join(root, "bundle-integrity.json")) ? readJson(root, "bundle-integrity.json") : {};
  // Older inventories have no ownership list; their non-bundled skills were repository-owned.
  const recorded = inventory.repositorySkills ?? [...new Set(Object.keys(inventory.files ?? {})
    .map((file) => file.match(/^skills\/([a-z0-9]+(?:-[a-z0-9]+)*)\//u)?.[1])
    .filter((skill) => skill && !bundled.has(skill)))];
  requireCondition(Array.isArray(recorded) && recorded.every((skill) => typeof skill === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/u.test(skill)), "Invalid repository skill ownership inventory.");
  const owned = new Set([...repositorySkills(root), ...recorded].filter((skill) => !bundled.has(skill)));
  const expected = [...files.keys()];
  const visit = (relative) => {
    const full = path.join(root, relative);
    if (!existsSync(full)) return [];
    const stat = lstatSync(full);
    requireCondition(!stat.isSymbolicLink(), `Packaged files must not be symlinks: ${relative}`);
    if (stat.isDirectory()) {
      if (!expected.some((file) => file.startsWith(`${relative}/`))) return [relative];
      return readdirSync(full).sort().flatMap((name) => visit(`${relative}/${name}`));
    }
    return files.has(relative) ? [] : [relative];
  };
  return [...owned].sort().flatMap((skill) => visit(`${PLUGIN}/skills/${skill}`));
}

export function generatedFiles(root = ROOT, metadata = loadMetadata(root), {fromBundleSync = false} = {}) {
  const {name, displayName, version, description, author, homepage, repository, keywords, marketplace, codexInterface} = metadata;
  const shared = {name, version, description, author, homepage, repository, ...(metadata.license ? {license: metadata.license} : {}), keywords};
  const listingUrls = Object.fromEntries(Object.entries(CODEX_LISTING_URLS)
    .filter(([field]) => metadata.claudeDirectory?.[field]).map(([field, codexField]) => [codexField, metadata.claudeDirectory[field]]));
  const codexListing = {displayName, ...codexInterface, developerName: author.name, websiteURL: homepage, ...listingUrls};
  const files = new Map([
    // Claude Code prompts for userConfig at install; Codex runs the onboarding skill as the plugin's setup step.
    [`${PLUGIN}/.claude-plugin/plugin.json`, json({name, displayName, ...shared, ...metadata.claudeDirectory, userConfig: metadata.userConfig})],
    // The portable Agent Plugins manifest OpenAI recommends; Claude Code reads .claude-plugin/ instead.
    [`${PLUGIN}/plugin.json`, json({
      $schema: AGENT_PLUGINS_SCHEMA,
      ...shared,
      extensions: {"com.openai": {interface: codexListing, onboardingSkill: metadata.onboardingSkill}},
    })],
    // Codex compatibility manifest for clients that predate the portable root manifest.
    [`${PLUGIN}/.codex-plugin/plugin.json`, json({
      ...shared,
      skills: "./skills/",
      extensions: {"com.openai": {onboardingSkill: metadata.onboardingSkill}},
      interface: codexListing,
    })],
    // The version lives only in plugin.json: Claude Code reads it first, and a second copy can drift.
    [".claude-plugin/marketplace.json", json({
      name: marketplace.name,
      owner: {name: author.name},
      metadata: {description: marketplace.description},
      plugins: [{name, source: `./${PLUGIN}`, description, category: marketplace.category, keywords}],
    })],
    [".agents/plugins/marketplace.json", json({
      name: marketplace.name,
      interface: {displayName},
      plugins: [{name, source: {source: "local", path: `./${PLUGIN}`}, policy: marketplace.policy, category: codexInterface.category}],
    })],
    [`${PLUGIN}/.generated`, "Generated distribution; do not edit packaged files directly.\nBundled skills, SDK and bundle provenance: convo-email-agent, via scripts/sync-bundle.mjs.\nRepository skills: skills/. Host files: host/. Manifests (.claude-plugin/, .codex-plugin/ and plugin.json), user configuration, onboarding skill and MCP dependency: plugin-metadata.json.\nRun npm run generate after metadata, skill or host changes. See the root README for releases.\n"],
  ]);
  for (const [destination, source] of Object.entries(metadata.packageFiles)) {
    files.set(`${PLUGIN}/${destination}`, readFileSync(path.join(root, source)));
  }
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
  // Repository skills are packaged as they are: no shared HOST.md and no stripo-mcp dependency.
  const localSkills = repositorySkills(root);
  for (const skill of localSkills) {
    requireCondition(!skills.includes(skill), `${REPOSITORY_SKILLS}/${skill} collides with a bundled skill.`);
    for (const file of walkFiles(root, `${REPOSITORY_SKILLS}/${skill}`)) {
      files.set(`${PLUGIN}/skills/${file.slice(REPOSITORY_SKILLS.length + 1)}`, readFileSync(path.join(root, file)));
    }
  }
  if (!fromBundleSync && existsSync(path.join(root, "bundle-integrity.json"))) {
    const previous = readJson(root, "bundle-integrity.json").hostOverrides ?? [];
    const removed = previous.filter((file) => !hostOverrides.includes(file));
    requireCondition(removed.length === 0, `Host overrides were removed: ${removed.join(", ")}. Run scripts/sync-bundle.mjs with a clean upstream bundle to restore upstream files and remove obsolete helpers.`);
  }
  const obsolete = obsoleteRepositorySkillPaths(root, files);
  const paths = new Set(SYNCED_ITEMS.flatMap((item) => walkFiles(root, `${PLUGIN}/${item}`))
    .filter((file) => !obsolete.some((removed) => file === removed || file.startsWith(`${removed}/`))));
  for (const file of Object.keys(metadata.packageFiles)) paths.add(`${PLUGIN}/${file}`);
  for (const file of files.keys()) {
    if (SYNCED_ITEMS.some((item) => file.startsWith(`${PLUGIN}/${item}/`))) paths.add(file);
  }
  const bundle = readJson(root, `${PLUGIN}/bundle.json`);
  files.set("bundle-integrity.json", json({
    sourceRevision: bundle.sourceRevision,
    hostOverrides: hostOverrides.sort(),
    repositorySkills: localSkills,
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
  for (const relative of obsoleteRepositorySkillPaths(root, files)) {
    if (check) stale.push(`${relative} (obsolete)`);
    else rmSync(path.join(root, relative), {recursive: true, force: true});
  }
  for (const [relative, contents] of files) {
    const destination = path.join(root, relative);
    const skillFile = relative.startsWith(`${PLUGIN}/skills/`) ? relative.slice(`${PLUGIN}/skills/`.length) : null;
    const overlay = skillFile ? [path.join(root, "host", skillFile), path.join(root, REPOSITORY_SKILLS, skillFile)].find((file) => existsSync(file)) : undefined;
    const executable = overlay ? lstatSync(overlay).mode & 0o111 : null;
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
    ? `Inventory entries that would change:\n${differences.join("\n")}\nBundled skill and SDK files change only through scripts/sync-bundle.mjs: restore an unintended edit. After an intended metadata, repository skill or host change, run npm run generate and review the diff.`
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

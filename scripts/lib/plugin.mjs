import {createHash} from 'node:crypto';
import {cpSync, existsSync, lstatSync, mkdirSync, readFileSync, readdirSync, writeFileSync} from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import semver from 'semver';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const RELEASE = 'release.json';
export const SKILLS = ['business-profile', 'connect', 'email-from-reference', 'email-model-editor'];
// Only these files are replaced by sync. All instructions and host integration belong here.
export const IMPORTED_ITEMS = [
  'packages/convo-email-agent',
  'skills/email-model-editor/scripts',
  'skills/email-from-reference/scripts',
  'skills/email-from-reference/reference/creation-brief.schema.json',
  'skills/email-from-reference/examples/prompt-only.creation.json',
];
const PACKAGE_ITEMS = [
  'plugin.json', '.claude-plugin/plugin.json', '.codex-plugin/plugin.json',
  '.claude-plugin/marketplace.json', '.agents/plugins/marketplace.json',
  'README.md', 'LICENSE', 'assets', 'skills', 'packages', 'scripts/doctor.mjs',
];

export function requireCondition(condition, message) {
  if (!condition) throw new Error(message);
}

export const json = value => `${JSON.stringify(value, null, 2)}\n`;
export const readJson = (root, file) => JSON.parse(readFileSync(path.join(root, file), 'utf8'));
export const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export const validVersion = version => typeof version === 'string' && /^\d/u.test(version) && semver.valid(version) !== null;

export function requireVersionIncrease(previous, next) {
  requireCondition(validVersion(previous) && validVersion(next), `Invalid semantic version: ${previous} -> ${next}.`);
  requireCondition(semver.gt(next, previous), `Plugin version must increase: ${previous} -> ${next}.`);
}

export function walkFiles(root, relative) {
  requireCondition(relative && !path.isAbsolute(relative) && !relative.split('/').includes('..'), `Invalid package path: ${relative}`);
  const full = path.join(root, relative);
  const stat = lstatSync(full);
  requireCondition(!stat.isSymbolicLink(), `Packaged files must not be symlinks: ${relative}`);
  if (stat.isFile()) return [relative];
  requireCondition(stat.isDirectory(), `Expected a regular file or directory: ${relative}`);
  return readdirSync(full).sort().flatMap(name => {
    if (name === '.DS_Store') return [];
    requireCondition(!['node_modules', '__pycache__', '.git'].includes(name), `Unexpected packaged directory: ${relative}/${name}`);
    return walkFiles(root, `${relative}/${name}`);
  });
}

export const importedFiles = root => IMPORTED_ITEMS.flatMap(item => walkFiles(root, item)).sort();
export const packageFiles = root => PACKAGE_ITEMS.flatMap(item => walkFiles(root, item)).sort();
export const hashes = (root, files) => Object.fromEntries(files.map(file => [file, hash(readFileSync(path.join(root, file)))]));

export function loadManifest(root = ROOT) {
  const manifest = readJson(root, 'plugin.json');
  requireCondition(manifest.name === 'stripo' && validVersion(manifest.version), 'plugin.json: invalid Stripo identity or version.');
  requireCondition(manifest.$schema === 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json', 'plugin.json: missing portable manifest schema.');
  const openai = manifest.extensions?.['com.openai'];
  for (const field of ['description', 'license']) requireCondition(typeof manifest[field] === 'string' && manifest[field].trim(), `plugin.json: missing ${field}.`);
  requireCondition(typeof manifest.author?.name === 'string' && manifest.author.name.trim(), 'plugin.json: missing author.');
  requireCondition(openai?.onboardingSkill === './skills/connect/SKILL.md', 'plugin.json: onboardingSkill must point to connect.');
  for (const [field, limit] of Object.entries({displayName: 30, shortDescription: 30, longDescription: 4000})) {
    const value = openai.interface?.[field];
    requireCondition(typeof value === 'string' && value.trim() && value.length <= limit, `plugin.json: ${field} must contain 1-${limit} characters.`);
  }
  for (const value of [manifest.homepage, manifest.repository, ...['supportURL', 'privacyPolicyURL', 'termsOfServiceURL'].map(field => openai.interface[field])]) {
    requireCondition(typeof value === 'string' && new URL(value).protocol === 'https:', 'plugin.json: listing URLs must use HTTPS.');
  }
  for (const [field, count, length] of [['defaultPrompt', 3, 128], ['capabilities', 20, 120]]) {
    const values = openai.interface[field];
    requireCondition(Array.isArray(values) && values.length > 0 && values.length <= count
      && values.every(value => typeof value === 'string' && value.trim() && value.length <= length), `plugin.json: invalid ${field}.`);
  }
  return manifest;
}

export function codexManifest(manifest) {
  const {$schema, extensions, ...identity} = manifest;
  const {interface: listing, ...settings} = extensions['com.openai'];
  return {...identity, skills: './skills/', extensions: {'com.openai': settings}, interface: listing};
}

// Regenerating release hashes must never bless an edited or incomplete imported SDK.
// Only sync-bundle may replace this inventory, after validating a staged upstream import.
export function checkImports(root, release) {
  const actual = importedFiles(root);
  requireCondition(JSON.stringify(actual) === JSON.stringify(release.importedFiles), 'Imported file inventory changed; restore it or run scripts/sync-bundle.mjs.');
  const changed = actual.filter(file => hash(readFileSync(path.join(root, file))) !== release.files?.[file]);
  requireCondition(changed.length === 0, `Imported files changed; restore them or run scripts/sync-bundle.mjs:\n${changed.join('\n')}`);
}

export function generateMetadata(root = ROOT, {check = false} = {}) {
  const manifest = loadManifest(root);
  const previous = readJson(root, RELEASE);
  checkImports(root, previous);
  const compatibility = json(codexManifest(manifest));
  const maintained = PACKAGE_ITEMS.filter(item => item !== '.codex-plugin/plugin.json')
    .flatMap(item => walkFiles(root, item));
  const files = hashes(root, maintained);
  files['.codex-plugin/plugin.json'] = hash(compatibility);
  const generated = new Map([
    ['.codex-plugin/plugin.json', compatibility],
    [RELEASE, json({schemaVersion: 1, name: manifest.name, version: manifest.version,
      upstream: previous.upstream, importedFiles: previous.importedFiles,
      files: Object.fromEntries(Object.entries(files).sort(([a], [b]) => a < b ? -1 : a > b ? 1 : 0))})],
  ]);
  const stale = [];
  for (const [file, contents] of generated) {
    if (existsSync(path.join(root, file)) && readFileSync(path.join(root, file), 'utf8') === contents) continue;
    if (check) stale.push(file);
    else {
      mkdirSync(path.dirname(path.join(root, file)), {recursive: true});
      writeFileSync(path.join(root, file), contents);
    }
  }
  requireCondition(stale.length === 0, `Generated files are out of date: ${stale.join(', ')}. Run npm run generate and review the diff.`);
  return generated.size;
}

export function copyPackage(root, destination) {
  requireCondition(!existsSync(destination), `Package destination already exists: ${destination}`);
  const relative = path.relative(path.resolve(root), path.resolve(destination));
  requireCondition(relative && (relative === '..' || relative.startsWith(`..${path.sep}`)
    || path.isAbsolute(relative) || relative.startsWith(`work${path.sep}`)), 'Build packages outside the plugin or under work/.');
  const files = [...packageFiles(root), RELEASE];
  mkdirSync(destination, {recursive: true});
  for (const file of files) {
    mkdirSync(path.dirname(path.join(destination, file)), {recursive: true});
    cpSync(path.join(root, file), path.join(destination, file));
  }
}

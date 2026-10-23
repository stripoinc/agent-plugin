#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import {existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import semver from 'semver';
import {parseDocument} from 'yaml';
import {ROOT, RELEASE, SKILLS, copyPackage, generateMetadata, hash, loadManifest, packageFiles, readJson, requireCondition, walkFiles} from './lib/plugin.mjs';
import {checkDirectoryAssets, checkPackageLimits} from './lib/directory-checks.mjs';

function requirePath(root, relative, kind = 'file') {
  requireCondition(typeof relative === 'string' && relative.startsWith('./') && !relative.split('/').includes('..'), `Invalid plugin path: ${relative}`);
  const full = path.join(root, relative);
  requireCondition(existsSync(full) && (kind === 'directory' ? statSync(full).isDirectory() : statSync(full).isFile()), `Missing packaged ${kind}: ${relative}`);
}

function exportPaths(value) {
  if (typeof value === 'string') return [value];
  return value && typeof value === 'object' ? Object.values(value).flatMap(exportPaths) : [];
}

function yaml(source, file) {
  const document = parseDocument(source);
  requireCondition(document.errors.length === 0, `${file}: invalid YAML.`);
  return document.toJS();
}

export function validatePlugin(root = ROOT, {allowDirty = false} = {}) {
  const manifest = loadManifest(root);
  generateMetadata(root, {check: true});
  // These locations are discovered automatically by hosts, independently of our inventory.
  for (const component of ['.mcp.json', 'mcp.json', '.lsp.json', '.app.json', 'hooks', 'commands', 'agents', 'plugins', 'host', 'packaging']) {
    requireCondition(!existsSync(path.join(root, component)), `Unexpected plugin component: ${component}`);
  }
  const release = readJson(root, RELEASE);
  const {upstream} = release;
  requireCondition(upstream?.brand === 'stripo' && (upstream.sourceDirty === false || allowDirty && upstream.sourceDirty === true), 'Release requires a clean Stripo upstream build.');
  requireCondition(/^[a-f0-9]{40}$/u.test(upstream.sourceRevision), 'Missing upstream source revision.');
  requireCondition(upstream.editorValidator?.editorDirty === false && /^[a-f0-9]{40}$/u.test(upstream.editorValidator.editorRevision)
    && /^[a-f0-9]{64}$/u.test(upstream.editorValidator.bundleSha256), 'Missing clean editor-validator provenance.');
  const claude = readJson(root, '.claude-plugin/plugin.json');
  for (const field of ['name', 'version', 'description', 'author', 'homepage', 'repository', 'license', 'keywords']) {
    requireCondition(JSON.stringify(claude[field]) === JSON.stringify(manifest[field]), `Claude manifest ${field} differs from plugin.json.`);
  }
  const listing = manifest.extensions['com.openai'].interface;
  requireCondition(claude.displayName === listing.displayName, 'Claude displayName differs from plugin.json.');
  for (const [field, other] of Object.entries({supportUrl: 'supportURL', privacyPolicyUrl: 'privacyPolicyURL', termsOfServiceUrl: 'termsOfServiceURL', icon: 'logo'})) {
    requireCondition(claude[field] === listing[other], `Claude ${field} differs from plugin.json.`);
  }
  requireCondition(claude.userConfig?.client_id?.type === 'string', 'Claude must retain the organization Client ID configuration.');
  for (const data of [manifest, claude, readJson(root, '.codex-plugin/plugin.json')]) {
    requireCondition(data.mcpServers === undefined && data.hooks === undefined, 'Stripo connects through the connect skill, without bundled servers or hooks.');
  }
  const marketplaces = [readJson(root, '.claude-plugin/marketplace.json'), readJson(root, '.agents/plugins/marketplace.json')];
  for (const catalog of marketplaces) {
    requireCondition(catalog.name === 'stripo' && catalog.plugins?.length === 1 && catalog.plugins[0].name === 'stripo', 'Marketplace identity must remain stripo@stripo.');
    const source = catalog.plugins[0].source;
    requireCondition(source === './' || source?.source === 'local' && source.path === './', 'Marketplace must install the root plugin.');
    requireCondition(catalog.plugins[0].version === undefined, 'Marketplace must use the manifest version.');
  }
  requireCondition(marketplaces[1].plugins[0].policy?.installation === 'AVAILABLE'
    && marketplaces[1].plugins[0].policy?.authentication === 'ON_INSTALL', 'Invalid Codex marketplace policy.');
  const directories = readdirSync(path.join(root, 'skills'), {withFileTypes: true}).filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
  requireCondition(JSON.stringify(directories) === JSON.stringify(SKILLS), 'Expected the four Stripo skills.');
  requireCondition(JSON.stringify(readdirSync(path.join(root, 'packages')).filter(name => name !== '.DS_Store')) === JSON.stringify(['convo-email-agent']), 'Only the shared email SDK belongs in packages/.');
  for (const skill of SKILLS) {
    const entry = `skills/${skill}/SKILL.md`;
    requirePath(root, `./${entry}`);
    const frontmatter = readFileSync(path.join(root, entry), 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/u);
    requireCondition(frontmatter, `${skill}: missing YAML frontmatter.`);
    const fields = yaml(frontmatter[1], entry);
    requireCondition(fields?.name === skill && typeof fields.description === 'string' && fields.description.trim() && fields.description.length <= 1024, `${skill}: invalid name or description.`);
    const agentFile = `skills/${skill}/agents/openai.yaml`;
    requirePath(root, `./${agentFile}`);
    const agent = yaml(readFileSync(path.join(root, agentFile), 'utf8'), agentFile);
    if (skill !== 'connect') requireCondition(agent.dependencies?.tools?.some(tool => tool.type === 'mcp' && tool.value === 'stripo-mcp'), `${skill}: missing stripo-mcp dependency.`);
  }
  requirePath(root, manifest.extensions['com.openai'].onboardingSkill);
  for (const file of packageFiles(root).filter(file => file.endsWith('.md'))) {
    const source = readFileSync(path.join(root, file), 'utf8');
    for (const match of source.matchAll(/\[[^\]\n]+\]\(([^\s)]+)\)/gu)) {
      const target = match[1].split('#')[0];
      if (!target || /^[a-z]+:/iu.test(target)) continue;
      const resolved = path.relative(root, path.resolve(root, path.dirname(file), target));
      requireCondition(!resolved.startsWith('..') && existsSync(path.join(root, resolved)), `${file}: broken local link ${target}`);
    }
  }
  const validatorRoot = 'packages/convo-email-agent/editor-validator';
  const validator = readJson(root, `${validatorRoot}/manifest.json`);
  requireCondition(validator.format === 'esm-modules-v1' && hash(JSON.stringify(validator.files)) === validator.bundleSha256, 'Invalid editor-validator module inventory.');
  for (const field of ['editorRevision', 'editorDirty', 'bundleSha256']) {
    requireCondition(validator[field] === upstream.editorValidator[field], 'Editor-validator manifest differs from upstream provenance.');
  }
  const validatorFiles = Object.keys(validator.files).sort();
  requireCondition(JSON.stringify(walkFiles(root, validatorRoot).map(file => file.slice(validatorRoot.length + 1)).sort())
    === JSON.stringify([...validatorFiles, 'manifest.json'].sort()), 'Editor-validator files differ from its inventory.');
  for (const file of validatorFiles) {
    requireCondition(!path.isAbsolute(file) && !file.split('/').includes('..'), `Invalid validator path: ${file}`);
    requireCondition(hash(readFileSync(path.join(root, validatorRoot, file))) === validator.files[file], `Editor-validator integrity mismatch: ${file}`);
  }
  const sdk = readJson(root, 'packages/convo-email-agent/package.json');
  requireCondition(sdk.name === upstream.package && sdk.version === upstream.version, 'SDK package differs from upstream provenance.');
  requireCondition(semver.satisfies(process.versions.node, sdk.engines.node), `SDK requires Node.js ${sdk.engines.node}.`);
  for (const file of [sdk.main, sdk.types, ...exportPaths(sdk.exports)]) {
    requireCondition(typeof file === 'string' && file.startsWith('./') && !file.split('/').includes('..'), `Invalid SDK export path: ${file}`);
    requirePath(root, `./packages/convo-email-agent/${file.slice(2)}`);
  }
  const limits = checkPackageLimits(root);
  const pending = checkDirectoryAssets(root, manifest);
  requireCondition(pending.length === 0, `Directory metadata incomplete: ${pending.join('; ')}.`);
  const isolated = mkdtempSync(path.join(tmpdir(), 'stripo-plugin-validate-'));
  try {
    copyPackage(root, path.join(isolated, 'plugin'));
    const env = {...process.env};
    delete env.CONVO_EMAIL_AGENT_SDK_PATH;
    delete env.STRIPO_RUNTIME_PATH;
    delete env.NODE_PATH;
    delete env.NODE_OPTIONS;
    const result = spawnSync(process.execPath, ['scripts/doctor.mjs'], {cwd: path.join(isolated, 'plugin'), env, encoding: 'utf8'});
    requireCondition(!result.error && result.status === 0, `Isolated plugin failed: ${result.error?.message ?? result.stderr ?? result.stdout}\n${result.stdout}`);
  } finally {
    rmSync(isolated, {recursive: true, force: true});
  }
  return {skills: SKILLS.length, sourceRevision: upstream.sourceRevision, ...limits};
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    console.log(JSON.stringify({status: 'ok', ...validatePlugin()}, null, 2));
  } catch (error) {
    console.error(`validate-plugin: ${error.message}`);
    process.exitCode = 1;
  }
}

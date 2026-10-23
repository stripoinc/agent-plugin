#!/usr/bin/env node
// Import the shared SDK and executable helpers. Never overwrite Stripo-owned instructions.
import {execFileSync} from 'node:child_process';
import {cpSync, mkdirSync, mkdtempSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
import {ROOT, RELEASE, IMPORTED_ITEMS, copyPackage, generateMetadata, hashes, importedFiles, json, loadManifest, readJson, requireCondition, requireVersionIncrease, walkFiles} from './lib/plugin.mjs';
import {validatePlugin} from './validate-plugin.mjs';

const USAGE = 'Usage: node scripts/sync-bundle.mjs [--bundle <dir>] --version <x.y.z> [--base <git-ref>] [--allow-dirty]';

function parseArgs(args) {
  const options = {};
  for (let i = 0; i < args.length; i++) {
    const flag = args[i];
    if (flag === '--allow-dirty') options.allowDirty = true;
    else if (['--bundle', '--version', '--base'].includes(flag) && args[i + 1] && !args[i + 1].startsWith('--')) options[flag.slice(2)] = args[++i];
    else throw new Error(USAGE);
  }
  requireCondition(options.version, USAGE);
  return options;
}

export function syncBundle(root = ROOT, options) {
  const bundle = path.resolve(options.bundle ?? path.join(root, '../convo-email-agent/dist/convo-email-agent/stripo'));
  const relative = path.relative(root, bundle);
  requireCondition(relative && (relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)), 'The upstream bundle must be outside the plugin.');
  const source = readJson(bundle, 'bundle.json');
  requireCondition(source.brand === 'stripo', 'Expected a Stripo upstream bundle.');
  requireCondition(source.sourceDirty === false || options.allowDirty && source.sourceDirty === true, 'Bundle is dirty; rebuild from a clean checkout, or use --allow-dirty for local testing.');
  for (const item of IMPORTED_ITEMS) walkFiles(bundle, item);
  const current = loadManifest(root);
  const version = options.version;
  if (version === current.version && options.base) {
    const git = (...args) => execFileSync('git', args, {cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe']}).trim();
    const base = git('rev-parse', '--verify', '--end-of-options', `${options.base}^{commit}`);
    git('merge-base', '--is-ancestor', base, 'HEAD');
    const versionFile = ['plugin.json', 'plugin-metadata.json', 'plugins/stripo/.claude-plugin/plugin.json']
      .find(file => git('ls-tree', '--name-only', base, '--', file));
    requireCondition(versionFile, 'Base has no previous plugin version.');
    requireVersionIncrease(JSON.parse(git('show', `${base}:${versionFile}`)).version, version);
  } else requireVersionIncrease(current.version, version);

  const temporary = mkdtempSync(path.join(tmpdir(), 'stripo-sync-'));
  const staged = path.join(temporary, 'plugin');
  try {
    copyPackage(root, staged);
    for (const item of IMPORTED_ITEMS) {
      const destination = path.join(staged, item);
      rmSync(destination, {recursive: true, force: true});
      mkdirSync(path.dirname(destination), {recursive: true});
      cpSync(path.join(bundle, item), destination, {recursive: true});
    }
    for (const file of ['plugin.json', '.claude-plugin/plugin.json']) {
      writeFileSync(path.join(staged, file), json({...readJson(staged, file), version}));
    }
    const {package: packageName, version: sdkVersion, brand, sourceRevision, sourceDirty, editorValidator} = source;
    const upstream = {package: packageName, version: sdkVersion, brand, sourceRevision, sourceDirty,
      editorValidator: {editorRevision: editorValidator?.editorRevision, editorDirty: editorValidator?.editorDirty, bundleSha256: editorValidator?.bundleSha256}};
    const imported = importedFiles(staged);
    writeFileSync(path.join(staged, RELEASE), json({upstream, importedFiles: imported, files: hashes(staged, imported)}));
    generateMetadata(staged);
    validatePlugin(staged, {allowDirty: options.allowDirty});
    // Invalid candidates never reach the working tree. Keep a rollback copy for filesystem errors.
    const changed = [...IMPORTED_ITEMS, 'plugin.json', '.claude-plugin/plugin.json', '.codex-plugin/plugin.json', RELEASE];
    const backup = path.join(temporary, 'backup');
    for (const item of changed) {
      mkdirSync(path.dirname(path.join(backup, item)), {recursive: true});
      cpSync(path.join(root, item), path.join(backup, item), {recursive: true});
    }
    try {
      for (const item of changed) {
        rmSync(path.join(root, item), {recursive: true, force: true});
        cpSync(path.join(staged, item), path.join(root, item), {recursive: true});
      }
    } catch (error) {
      for (const item of changed) {
        rmSync(path.join(root, item), {recursive: true, force: true});
        cpSync(path.join(backup, item), path.join(root, item), {recursive: true});
      }
      throw error;
    }
    return {version, previousVersion: current.version, upstream, importedFiles: imported.length,
      note: 'Stripo skills and evals preserved. Review upstream workflow documentation for any SDK behavior changes.'};
  } finally {
    rmSync(temporary, {recursive: true, force: true});
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    if (process.argv.includes('--help')) console.log(USAGE);
    else console.log(json(syncBundle(ROOT, parseArgs(process.argv.slice(2)))));
  } catch (error) {
    console.error(`sync-bundle: ${error.message}`);
    process.exitCode = 1;
  }
}

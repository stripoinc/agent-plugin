import assert from 'node:assert/strict';
import {execFileSync, spawnSync} from 'node:child_process';
import {cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {parse} from 'yaml';
import {ROOT, RELEASE, IMPORTED_ITEMS, copyPackage, generateMetadata, hashes, json, packageFiles, readJson, requireVersionIncrease} from '../lib/plugin.mjs';
import {checkVersionBump} from '../check-version-bump.mjs';
import {validatePlugin} from '../validate-plugin.mjs';
import {syncBundle} from '../sync-bundle.mjs';
import {checkDirectoryAssets, checkPackageLimits} from '../lib/directory-checks.mjs';

function fixture(t) {
  const temporary = mkdtempSync(path.join(tmpdir(), 'stripo-packaging-test-'));
  t.after(() => rmSync(temporary, {recursive: true, force: true}));
  const root = path.join(temporary, 'plugin');
  copyPackage(ROOT, root);
  cpSync(path.join(ROOT, 'evals'), path.join(root, 'evals'), {recursive: true, filter: source => path.basename(source) !== 'results'});
  for (const file of ['plugin.json', '.claude-plugin/plugin.json']) {
    writeFileSync(path.join(root, file), json({...readJson(root, file), version: '0.6.1'}));
  }
  generateMetadata(root);
  return root;
}

function upstream(root) {
  const directory = path.join(path.dirname(root), 'upstream');
  for (const item of IMPORTED_ITEMS) {
    mkdirSync(path.dirname(path.join(directory, item)), {recursive: true});
    cpSync(path.join(root, item), path.join(directory, item), {recursive: true});
  }
  const source = readJson(root, RELEASE).upstream;
  writeFileSync(path.join(directory, 'bundle.json'), json({...source,
    editorValidator: readJson(root, 'packages/convo-email-agent/editor-validator/manifest.json')}));
  return directory;
}

function runNode(root, args) {
  const env = {...process.env};
  for (const name of ['NODE_PATH', 'NODE_OPTIONS', 'CONVO_EMAIL_AGENT_SDK_PATH', 'STRIPO_RUNTIME_PATH']) delete env[name];
  return spawnSync(process.execPath, args, {cwd: root, env, encoding: 'utf8'});
}

function expectOk(result) {
  assert.equal(result.status, 0, `${result.stderr}\n${result.stdout}`);
  return result;
}

test('root package is reproducible and installs without development dependencies', t => {
  const root = fixture(t);
  const first = readFileSync(path.join(root, RELEASE));
  generateMetadata(root);
  assert.deepEqual(readFileSync(path.join(root, RELEASE)), first);
  rmSync(path.join(root, '.codex-plugin'), {recursive: true});
  assert.throws(() => generateMetadata(root, {check: true}), /out of date/u);
  assert.equal(existsSync(path.join(root, '.codex-plugin')), false);
  generateMetadata(root);
  assert.deepEqual(readFileSync(path.join(root, RELEASE)), first);
  generateMetadata(root, {check: true});
  const report = validatePlugin(root);
  assert.equal(report.skills, 4);
  assert.ok(report.files <= 512);
  const installed = path.join(path.dirname(root), 'installed');
  copyPackage(root, installed);
  for (const omitted of ['evals', 'node_modules', 'host', 'packaging', 'plugins', 'scripts/sync-bundle.mjs']) assert.equal(existsSync(path.join(installed, omitted)), false, omitted);
  assert.deepEqual(hashes(installed, packageFiles(installed)), readJson(installed, RELEASE).files);
  assert.equal(validatePlugin(installed).skills, 4);
  expectOk(runNode(installed, ['scripts/doctor.mjs']));
  assert.throws(() => copyPackage(root, installed), /already exists/u);
  assert.throws(() => copyPackage(root, path.join(root, 'skills/output')), /outside the plugin or under work/u);
});

test('installed creation, inspection and mutation commands preserve the base and reject invalid edits', t => {
  const root = fixture(t);
  const task = path.join(path.dirname(root), 'task');
  mkdirSync(task);
  const model = path.join(task, 'model.json');
  const candidate = path.join(task, 'candidate.json');
  expectOk(runNode(root, ['skills/email-from-reference/scripts/create-from-brief.mjs', '--brand', 'stripo',
    '--brief', 'skills/email-from-reference/examples/prompt-only.creation.json', '--output', model]));
  const base = readFileSync(model);
  const inspection = path.join(task, 'inspection.json');
  expectOk(runNode(root, ['skills/email-model-editor/scripts/inspect-editor-json.mjs', '--input', model, '--output', inspection]));
  assert.ok(readFileSync(inspection, 'utf8').includes('Reference-based email content.'));
  const change = path.join(task, 'change.mjs');
  writeFileSync(change, `export default ({email}) => { email.one({nodeKind: 'block', type: 'text'}).setContent('<p>Verified Stripo content.</p>'); email.setMetadata({title: 'Refactor smoke test'}); };\n`);
  expectOk(runNode(root, ['skills/email-model-editor/scripts/run-sdk.mjs', '--input', model, '--script', change, '--output', candidate]));
  const updated = readJson(task, 'candidate.json');
  assert.equal(updated.metadata.title, 'Refactor smoke test');
  assert.ok(JSON.stringify(updated).includes('Verified Stripo content.'));
  assert.deepEqual(readFileSync(model), base);
  writeFileSync(change, `export default ({email}) => { email.one({nodeKind: 'block', type: 'text'}).patchSettings({notAnEditorField: true}); };\n`);
  const rejected = runNode(root, ['skills/email-model-editor/scripts/run-sdk.mjs', '--input', model, '--script', change, '--output', candidate]);
  assert.notEqual(rejected.status, 0);
  assert.equal(existsSync(candidate), false, 'A rejected edit must not leave a stale candidate.');
  assert.deepEqual(readFileSync(model), base);
});

test('release hashes detect local edits and generation does not bless altered imported code', t => {
  const root = fixture(t);
  const skill = path.join(root, 'skills/email-model-editor/SKILL.md');
  writeFileSync(skill, `${readFileSync(skill, 'utf8')}\nLocal clarification.\n`);
  assert.throws(() => validatePlugin(root), /out of date/u);
  generateMetadata(root);
  validatePlugin(root);
  const sdk = path.join(root, 'packages/convo-email-agent/index.js');
  writeFileSync(sdk, `${readFileSync(sdk, 'utf8')}\nthrow new Error('changed');\n`);
  assert.throws(() => generateMetadata(root), /Imported files changed/u);
  assert.throws(() => validatePlugin(root), /Imported files changed/u);
});

test('missing imports and symlinks cannot enter an install package', t => {
  const root = fixture(t);
  rmSync(path.join(root, 'packages/convo-email-agent/sdk/document.d.ts'));
  assert.throws(() => generateMetadata(root), /Imported file inventory changed/u);
  const link = path.join(root, 'skills/connect/linked.md');
  symlinkSync(path.join(ROOT, 'README.md'), link);
  assert.throws(() => copyPackage(root, path.join(path.dirname(root), 'linked-copy')), /must not be symlinks/u);
});

test('manifests retain onboarding and root marketplace identity', t => {
  const root = fixture(t);
  const portable = readJson(root, 'plugin.json');
  const codex = readJson(root, '.codex-plugin/plugin.json');
  const claude = readJson(root, '.claude-plugin/plugin.json');
  assert.equal(codex.extensions['com.openai'].onboardingSkill, './skills/connect/SKILL.md');
  assert.deepEqual(codex.interface, portable.extensions['com.openai'].interface);
  assert.equal(claude.userConfig.client_id.type, 'string');
  assert.equal(codex.userConfig, undefined);
  const catalog = readJson(root, '.agents/plugins/marketplace.json');
  catalog.plugins[0].source.path = './plugins/stripo';
  writeFileSync(path.join(root, '.agents/plugins/marketplace.json'), json(catalog));
  generateMetadata(root);
  assert.throws(() => validatePlugin(root), /root plugin/u);
});

test('validation rejects divergent source manifests and incompatible host components', t => {
  const root = fixture(t);
  const claude = readJson(root, '.claude-plugin/plugin.json');
  writeFileSync(path.join(root, '.claude-plugin/plugin.json'), json({...claude, version: '0.6.2'}));
  generateMetadata(root);
  assert.throws(() => validatePlugin(root), /Claude manifest version/u);
  writeFileSync(path.join(root, '.claude-plugin/plugin.json'), json(claude));
  generateMetadata(root);
  for (const component of ['.mcp.json', 'mcp.json', '.lsp.json', '.app.json']) {
    writeFileSync(path.join(root, component), '{}\n');
    assert.throws(() => validatePlugin(root), /Unexpected plugin component/u);
    rmSync(path.join(root, component));
  }
});

test('local reference links and directory limits are checked', t => {
  const root = fixture(t);
  const extra = path.join(root, 'skills/connect/extra.md');
  writeFileSync(extra, '[Missing](missing.md)\n');
  generateMetadata(root);
  assert.throws(() => validatePlugin(root), /broken local link/u);
  writeFileSync(extra, 'x'.repeat(256 * 1024));
  assert.throws(() => checkPackageLimits(root), /smaller than 256 KiB/u);
  rmSync(extra);
  for (let i = 0; i < 513; i++) writeFileSync(`${extra}-${i}.md`, 'test');
  assert.throws(() => checkPackageLimits(root), /limit is 512/u);
});

test('approved license and listing assets remain required', t => {
  const root = fixture(t);
  assert.deepEqual(checkDirectoryAssets(root, readJson(root, 'plugin.json')), []);
  const icon = path.join(root, readJson(root, '.claude-plugin/plugin.json').icon);
  writeFileSync(icon, 'not a JPEG');
  assert.throws(() => checkDirectoryAssets(root, readJson(root, 'plugin.json')), /PNG or JPEG/u);
});

test('sync replaces only shared runtime and preserves Stripo instructions and all evals', t => {
  const root = fixture(t);
  const bundle = upstream(root);
  const local = 'skills/email-model-editor/SKILL.md';
  writeFileSync(path.join(root, local), `${readFileSync(path.join(root, local), 'utf8')}\nStripo-owned clarification.\n`);
  const before = readFileSync(path.join(root, local));
  const evalBefore = readdirSync(path.join(root, 'evals')).sort().map(name => [name, readFileSync(path.join(root, 'evals', name, 'prompt.md'), 'utf8')]);
  writeFileSync(path.join(bundle, local), 'Upstream instructions must not overwrite Stripo.\n');
  mkdirSync(path.join(bundle, 'packages/brandkit-runtime'));
  writeFileSync(path.join(bundle, 'packages/brandkit-runtime/unused.py'), 'raise Exception("unsupported runtime")\n');
  const result = syncBundle(root, {bundle, version: '0.6.2'});
  assert.equal(result.version, '0.6.2');
  assert.deepEqual(readFileSync(path.join(root, local)), before);
  assert.deepEqual(readdirSync(path.join(root, 'evals')).sort().map(name => [name, readFileSync(path.join(root, 'evals', name, 'prompt.md'), 'utf8')]), evalBefore);
  assert.equal(existsSync(path.join(root, 'packages/brandkit-runtime')), false);
  for (const file of ['plugin.json', '.claude-plugin/plugin.json', '.codex-plugin/plugin.json', RELEASE]) assert.equal(readJson(root, file).version, '0.6.2');
  assert.equal(validatePlugin(root).skills, 4);
});

test('sync rejects invalid upstream builds without changing the plugin', t => {
  const root = fixture(t);
  const bundle = upstream(root);
  const before = hashes(root, [...packageFiles(root), RELEASE]);
  const source = readJson(bundle, 'bundle.json');
  for (const changes of [{brand: 'reteno'}, {sourceDirty: true}, {editorValidator: {...source.editorValidator, editorRevision: '0'.repeat(40)}}]) {
    writeFileSync(path.join(bundle, 'bundle.json'), json({...source, ...changes}));
    assert.throws(() => syncBundle(root, {bundle, version: '0.6.2'}));
    assert.deepEqual(hashes(root, [...packageFiles(root), RELEASE]), before);
  }
  writeFileSync(path.join(bundle, 'bundle.json'), json(source));
  writeFileSync(path.join(bundle, 'packages/convo-email-agent/index.js'), "throw new Error('broken upstream');\n");
  assert.throws(() => syncBundle(root, {bundle, version: '0.6.2'}), /Isolated plugin failed/u);
  assert.deepEqual(hashes(root, [...packageFiles(root), RELEASE]), before);
  assert.throws(() => syncBundle(root, {bundle, version: '0.6.0'}), /version must increase/u);
});

test('dirty test imports remain dirty and cannot be packaged as releases', t => {
  const root = fixture(t);
  const bundle = upstream(root);
  writeFileSync(path.join(bundle, 'bundle.json'), json({...readJson(bundle, 'bundle.json'), sourceDirty: true}));
  syncBundle(root, {bundle, version: '0.6.2', allowDirty: true});
  assert.equal(readJson(root, RELEASE).upstream.sourceDirty, true);
  assert.throws(() => validatePlugin(root), /clean Stripo upstream/u);
});

test('validator provenance is checked independently of release inventory generation', t => {
  const root = fixture(t);
  const release = readJson(root, RELEASE);
  release.upstream.editorValidator.editorRevision = '0'.repeat(40);
  writeFileSync(path.join(root, RELEASE), json(release));
  generateMetadata(root);
  assert.throws(() => validatePlugin(root), /differs from upstream provenance/u);
});

test('version guard handles the old nested release and the new root manifest', t => {
  const root = fixture(t);
  const git = (...args) => execFileSync('git', args, {cwd: root, encoding: 'utf8', stdio: 'pipe'}).trim();
  git('init', '--quiet');
  git('config', 'user.name', 'Packaging test');
  git('config', 'user.email', 'packaging-test@example.invalid');
  const manifest = readJson(root, 'plugin.json');
  rmSync(path.join(root, 'plugin.json'));
  writeFileSync(path.join(root, 'plugin-metadata.json'), json({version: '0.6.0'}));
  git('add', '.');
  git('-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'Legacy release');
  const base = git('rev-parse', 'HEAD');
  rmSync(path.join(root, 'plugin-metadata.json'));
  writeFileSync(path.join(root, 'plugin.json'), json(manifest));
  assert.match(checkVersionBump(root, base), /0\.6\.0 -> 0\.6\.1/u);
  const bundle = upstream(root);
  assert.equal(syncBundle(root, {bundle, version: '0.6.1', base}).version, '0.6.1');
  git('add', '.');
  git('-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'Root release');
  writeFileSync(path.join(root, 'skills/connect/local.md'), 'Local change\n');
  assert.throws(() => checkVersionBump(root, 'HEAD'), /version must increase/u);
  assert.throws(() => syncBundle(root, {bundle, version: '0.6.1', base: 'HEAD'}), /version must increase/u);
});

test('semantic version guards reject equality, downgrades and malformed versions', () => {
  for (const [previous, next] of [['0.6.1', '0.6.1'], ['0.6.1', '0.5.9'], ['0.6.1', '0.6.1-rc.1'], ['0.6.1', 'v0.6.2']]) assert.throws(() => requireVersionIncrease(previous, next));
  requireVersionIncrease('0.6.2-rc.9', '0.6.2-rc.10');
  requireVersionIncrease('0.6.2-rc.10', '0.6.2');
});

test('all ten eval cases resolve the root plugin and retain graders and the screenshot fixture', () => {
  const cases = readdirSync(path.join(ROOT, 'evals'), {withFileTypes: true}).filter(entry => entry.isDirectory() && entry.name !== 'results');
  assert.equal(cases.length, 10);
  for (const {name} of cases) {
    const directory = path.join(ROOT, 'evals', name);
    const prompt = readFileSync(path.join(directory, 'prompt.md'), 'utf8');
    const fields = parse(prompt.match(/^---\n([\s\S]*?)\n---/u)[1]);
    assert.deepEqual(fields.plugins.map(relative => path.resolve(directory, relative)), [ROOT]);
    assert.ok(fields.max_turns > 0);
    assert.ok(readdirSync(path.join(directory, 'graders')).some(file => file.endsWith('.md')));
  }
  const screenshot = path.join(ROOT, 'evals/rebuild-from-screenshot');
  const config = parse(readFileSync(path.join(screenshot, 'case.yaml'), 'utf8'));
  assert.ok(existsSync(path.join(screenshot, config.context.scaffold_script)));
});

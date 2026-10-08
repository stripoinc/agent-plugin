import assert from "node:assert/strict";
import {execFileSync, spawnSync} from "node:child_process";
import {chmodSync, cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, symlinkSync, writeFileSync} from "node:fs";
import {tmpdir} from "node:os";
import path from "node:path";
import test from "node:test";
import {deflateSync} from 'node:zlib';
import {parse} from "yaml";
import {ROOT, PLUGIN, generateMetadata, json, readJson, requireVersionIncrease, withMcpDependency} from "../lib/plugin.mjs";
import {checkVersionBump} from "../check-version-bump.mjs";
import {validatePlugin} from "../validate-plugin.mjs";
import {checkDirectoryAssets, checkPackageLimits} from '../lib/directory-checks.mjs';

function testIcon(width = 512, height = 512) {
  const chunk = (type, bytes) => {
    const contents = Buffer.concat([Buffer.from(type), bytes]);
    let crc = 0xffffffff;
    for (const byte of contents) {crc ^= byte; for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);}
    const length = Buffer.alloc(4); length.writeUInt32BE(bytes.length);
    const checksum = Buffer.alloc(4); checksum.writeUInt32BE((crc ^ 0xffffffff) >>> 0);
    return Buffer.concat([length, contents, checksum]);
  };
  const header = Buffer.alloc(13); header.writeUInt32BE(width); header.writeUInt32BE(height, 4); header[8] = 8; header[9] = 2;
  return Buffer.concat([Buffer.from('89504e470d0a1a0a', 'hex'), chunk('IHDR', header),
    chunk('IDAT', deflateSync(Buffer.alloc((width * 3 + 1) * height))), chunk('IEND', Buffer.alloc(0))]);
}

function fixture(t) {
  const root = mkdtempSync(path.join(tmpdir(), "stripo-packaging-test-"));
  t.after(() => rmSync(root, {recursive: true, force: true}));
  for (const entry of ["plugin-metadata.json", "packaging", "plugins", "host", ".agents", ".claude-plugin", "bundle-integrity.json"]) {
    cpSync(path.join(ROOT, entry), path.join(root, entry), {recursive: true});
  }
  // A fixed fixture release keeps these scenarios useful after real plugin version bumps.
  const metadata = readJson(root, "plugin-metadata.json");
  // Test fixtures alone use synthetic approval assets. These never enter the
  // real distribution or stand in for the owner's licensing decision.
  metadata.license = 'LicenseRef-Test-Fixture';
  metadata.packageFiles.LICENSE = 'LICENSE';
  metadata.packageFiles['assets/test-icon.png'] = 'packaging/test-icon.png';
  metadata.claudeDirectory.icon = './assets/test-icon.png';
  writeFileSync(path.join(root, 'LICENSE'), 'Test fixture only; not a distribution license.\n');
  writeFileSync(path.join(root, 'packaging/test-icon.png'), testIcon());
  writeFileSync(path.join(root, "plugin-metadata.json"), json({...metadata, version: "0.6.1"}));
  generateMetadata(root);
  return root;
}

test("generation is repeatable and preserves the complete SDK in an isolated install", (t) => {
  const root = fixture(t);
  generateMetadata(root);
  generateMetadata(root, {check: true});
  assert.equal(validatePlugin(root).skills, readJson(root, `${PLUGIN}/bundle.json`).skills.length);
});

test("packaged email skills expose image tools with matching host and provider contracts", () => {
  const mapping = readJson(ROOT, `${PLUGIN}/mcp-tools.json`);
  const bundle = readJson(ROOT, `${PLUGIN}/bundle.json`);
  const imageTools = {generateImage: "generate_image", editImage: "edit_image", getImageJob: "get_image_job"};
  const host = readFileSync(path.join(ROOT, "host/HOST.md"), "utf8");
  assert.doesNotMatch(host, /no image workflow|no image generation|no.*image-generation tool/u);
  for (const [operation, tool] of Object.entries(imageTools)) {
    assert.equal(mapping.auxiliaryTools[operation], tool);
    assert.ok(bundle.requiredMcpTools.includes(tool));
    assert.ok(host.includes(`\`${tool}\``));
  }
  for (const skill of ["email-from-reference", "email-model-editor"]) {
    const directory = path.join(ROOT, PLUGIN, "skills", skill);
    assert.equal(readFileSync(path.join(directory, "HOST.md"), "utf8"), host);
    const provider = readFileSync(path.join(directory, "PROVIDER.md"), "utf8");
    assert.ok(provider.includes("](reference/stripo-images.md)"));
    const images = readFileSync(path.join(directory, "reference/stripo-images.md"), "utf8");
    for (const tool of Object.values(imageTools)) assert.ok(images.includes(`\`${tool}\``));
    const instructions = readFileSync(path.join(directory, "SKILL.md"), "utf8");
    assert.ok(instructions.includes("](PROVIDER.md)"));
    assert.doesNotMatch(instructions, /Do not generate image|no asset-upload or image-generation tool/u);
  }
});

test("MCP dependency updates preserve upstream metadata, policy and other dependencies", () => {
  const original = {
    interface: {display_name: "Custom upstream name", default_prompt: "Use $example."},
    policy: {allow_implicit_invocation: false},
    dependencies: {tools: [{type: "mcp", value: "other"}, {type: "mcp", value: "stripo-mcp", description: "old"}]},
  };
  const dependency = readJson(ROOT, "plugin-metadata.json").mcpDependency;
  const first = withMcpDependency(json(original), dependency);
  const result = parse(first);
  assert.deepEqual(result.interface, original.interface);
  assert.deepEqual(result.policy, original.policy);
  assert.deepEqual(result.dependencies.tools, [original.dependencies.tools[0], dependency]);
  assert.equal(withMcpDependency(first, dependency), first);
  assert.throws(() => withMcpDependency("dependencies: {tools: broken}\n", dependency), /must be an array/u);
});

test("the bundled MCP server is generated from metadata for both hosts", (t) => {
  const root = fixture(t);
  const metadata = readJson(root, "plugin-metadata.json");
  const file = `${PLUGIN}/.mcp.json`;
  assert.deepEqual(readJson(root, file), {mcpServers: {"stripo-mcp": metadata.mcpServer}});
  assert.equal(readJson(root, `${PLUGIN}/.codex-plugin/plugin.json`).mcpServers, "./.mcp.json");
  writeFileSync(path.join(root, file), json({mcpServers: {"stripo-mcp": {...metadata.mcpServer, url: "https://example.invalid/mcp"}}}));
  assert.throws(() => validatePlugin(root), /Generated files are out of date[\s\S]*\.mcp\.json/u);
  generateMetadata(root);
  validatePlugin(root);
});

test("MCP packages allow a connection-managed client ID or an explicit client ID", (t) => {
  const root = fixture(t);
  const metadata = readJson(root, "plugin-metadata.json");
  assert.equal(metadata.mcpServer.oauth?.clientId, undefined, "The shared package must not pin a host's OAuth client ID.");
  for (const oauth of [undefined, {}, {scopes: "mcp:tools"}, {clientId: "test-client", scopes: "mcp:tools"}]) {
    const server = {...metadata.mcpServer, oauth};
    writeFileSync(path.join(root, "plugin-metadata.json"), json({...metadata, mcpServer: server}));
    generateMetadata(root);
    validatePlugin(root);
    const packaged = readJson(root, `${PLUGIN}/.mcp.json`).mcpServers[metadata.mcpDependency.value];
    assert.deepEqual(packaged.oauth, oauth);
    assert.equal(packaged.url, metadata.mcpServer.url);
    assert.deepEqual(packaged.scopes, metadata.mcpServer.scopes);
  }
});

test("optional MCP OAuth configuration rejects malformed settings and explicit client IDs", (t) => {
  const root = fixture(t);
  const metadata = readJson(root, "plugin-metadata.json");
  for (const oauth of [null, "test-client", []]) {
    writeFileSync(path.join(root, "plugin-metadata.json"), json({...metadata, mcpServer: {...metadata.mcpServer, oauth}}));
    assert.throws(() => generateMetadata(root), /OAuth settings must be an object/u);
  }
  for (const clientId of [null, "", "   ", 42]) {
    writeFileSync(path.join(root, "plugin-metadata.json"), json({...metadata, mcpServer: {...metadata.mcpServer, oauth: {clientId}}}));
    assert.throws(() => generateMetadata(root), /OAuth client ID must be a non-empty string/u);
  }
});

test("validation rejects divergent marketplace metadata and repairs it from the source", (t) => {
  const root = fixture(t);
  const file = ".agents/plugins/marketplace.json";
  const catalog = readJson(root, file);
  catalog.plugins[0].source.path = "./missing-plugin";
  writeFileSync(path.join(root, file), json(catalog));
  assert.throws(() => validatePlugin(root), /Generated files are out of date/u);
  generateMetadata(root);
  assert.equal(readJson(root, file).plugins[0].source.path, `./${PLUGIN}`);
});

test("the integrity inventory detects missing and edited packaged files", (t) => {
  const root = fixture(t);
  const declaration = path.join(root, PLUGIN, "packages/convo-email-agent/sdk/document.d.ts");
  const original = readFileSync(declaration);
  rmSync(declaration);
  assert.throws(() => validatePlugin(root), /bundle-integrity.json[\s\S]*sdk\/document\.d\.ts \(missing\)/u);
  writeFileSync(declaration, original);
  writeFileSync(path.join(root, PLUGIN, "packages/convo-email-agent/index.js"), "throw new Error('broken bundle');\n");
  writeFileSync(path.join(root, PLUGIN, "skills/email-model-editor/extra.md"), "Unlisted\n");
  assert.throws(() => validatePlugin(root), /bundle-integrity.json[\s\S]*convo-email-agent\/index\.js \(changed\)[\s\S]*extra\.md \(not in the inventory\)/u);
  rmSync(path.join(root, PLUGIN, "skills/email-model-editor/extra.md"));
  generateMetadata(root);
  assert.throws(() => validatePlugin(root), /SDK failed in an isolated installed copy/u);
});

test("validation rejects unlisted plugin components and provenance that disagrees with the SDK", (t) => {
  const root = fixture(t);
  for (const file of ["hooks/hooks.json", ".lsp.json"]) {
    const planted = path.join(root, PLUGIN, file);
    mkdirSync(path.dirname(planted), {recursive: true});
    writeFileSync(planted, "{}\n");
    assert.throws(() => validatePlugin(root), (error) => error.message.includes("Unexpected files") && error.message.includes(file));
    rmSync(planted);
  }
  writeFileSync(path.join(root, PLUGIN, ".DS_Store"), "");
  validatePlugin(root);
  const original = readJson(root, `${PLUGIN}/bundle.json`);
  for (const [field, value] of [["bundleSha256", "f".repeat(64)], ["editorRevision", "a".repeat(40)]]) {
    writeFileSync(path.join(root, PLUGIN, "bundle.json"), json({...original, editorValidator: {...original.editorValidator, [field]: value}}));
    generateMetadata(root);
    assert.throws(() => validatePlugin(root), /Packaged editor-validator manifest differs/u);
  }
  writeFileSync(path.join(root, PLUGIN, "bundle.json"), json({...original, editorValidator: {...original.editorValidator, editorRevision: "not-a-sha"}}));
  generateMetadata(root);
  assert.throws(() => validatePlugin(root), /Missing clean editor-validator provenance/u);
});

test('directory metadata and assets survive generation without Claude fields leaking into Codex', t => {
  const root = fixture(t);
  const metadata = readJson(root, 'plugin-metadata.json');
  assert.deepEqual(checkDirectoryAssets(root, metadata), []);
  generateMetadata(root, {check: true});
  const codex = readJson(root, `${PLUGIN}/.codex-plugin/plugin.json`);
  assert.equal(codex.license, metadata.license);
  assert.equal(codex.icon, undefined);
  assert.equal(codex.documentationUrl, undefined);
  assert.equal(readJson(root, `${PLUGIN}/.claude-plugin/plugin.json`).icon, metadata.claudeDirectory.icon);
  assert.ok(readJson(root, 'bundle-integrity.json').files['README.md']);
  assert.ok(readJson(root, 'bundle-integrity.json').files.LICENSE);
  const incomplete = {...metadata, license: undefined, claudeDirectory: {}};
  writeFileSync(path.join(root, 'plugin-metadata.json'), json(incomplete));
  generateMetadata(root);
  assert.equal(checkDirectoryAssets(root, incomplete).length, 2);
  assert.throws(() => validatePlugin(root), /Directory readiness is blocked/u);
});

test('directory checks reject oversized text, too many files, short prose and malformed icons', t => {
  const root = fixture(t);
  const extra = path.join(root, PLUGIN, 'skills/email-model-editor/oversized.md');
  writeFileSync(extra, 'x'.repeat(256 * 1024));
  assert.throws(() => checkPackageLimits(root), /smaller than 256 KiB/u);
  rmSync(extra);
  for (let i = 0; i < 513; i++) writeFileSync(`${extra}-${i}.md`, 'test');
  assert.throws(() => checkPackageLimits(root), /limit is 512/u);
  const metadata = readJson(root, 'plugin-metadata.json');
  const readme = path.join(root, PLUGIN, 'README.md');
  const original = readFileSync(readme);
  writeFileSync(readme, `Short prose\n\n\`\`\`\n${'code '.repeat(80)}\n\`\`\`\n`);
  assert.throws(() => checkDirectoryAssets(root, metadata), /40 words/u);
  writeFileSync(readme, original);
  const icon = path.join(root, PLUGIN, 'assets/test-icon.png');
  writeFileSync(icon, testIcon(511, 512));
  assert.throws(() => checkDirectoryAssets(root, metadata), /square/u);
  writeFileSync(icon, testIcon().subarray(0, 40));
  assert.throws(() => checkDirectoryAssets(root, metadata), /Incomplete PNG/u);
});

test('validator hashes still detect tampering after the outer package inventory is regenerated', t => {
  const root = fixture(t);
  const directory = path.join(root, PLUGIN, 'packages/convo-email-agent/editor-validator');
  const validator = JSON.parse(readFileSync(path.join(directory, 'manifest.json')));
  const file = Object.keys(validator.files).find(file => file.startsWith('modules/'));
  writeFileSync(path.join(directory, file), `${readFileSync(path.join(directory, file), 'utf8')}\n// Unexpected change\n`);
  generateMetadata(root);
  assert.throws(() => validatePlugin(root), /Editor-validator integrity mismatch/u);
});

test("host changes are generated and executable helper permissions are preserved", (t) => {
  const root = fixture(t);
  const source = path.join(root, "host/business-profile/scripts/download_via_proxy.sh");
  const destination = path.join(root, PLUGIN, "skills/business-profile/scripts/download_via_proxy.sh");
  writeFileSync(source, `${readFileSync(source, "utf8")}\n# Host-specific update\n`);
  chmodSync(source, 0o755);
  chmodSync(destination, 0o644);
  assert.throws(() => generateMetadata(root, {check: true}), /download_via_proxy.sh/u);
  generateMetadata(root);
  assert.equal(readFileSync(destination, "utf8"), readFileSync(source, "utf8"));
  assert.equal(statSync(destination).mode & 0o111, 0o111);
  generateMetadata(root, {check: true});
  rmSync(source);
  assert.throws(() => generateMetadata(root), /Host overrides were removed/u);
});

test("version ordering rejects equality, downgrades, invalid versions and prerelease regressions", () => {
  for (const [previous, next] of [["0.6.1", "0.6.1"], ["0.6.1", "0.5.9"], ["0.6.1", "0.6.1-rc.1"], ["0.6.1", "0.6.1+build.2"], ["0.6.1", "v0.6.2"], ["0.6.1", "0.06.2"]]) {
    assert.throws(() => requireVersionIncrease(previous, next));
  }
  requireVersionIncrease("0.6.1", "0.6.2");
  requireVersionIncrease("0.6.2-rc.9", "0.6.2-rc.10");
  requireVersionIncrease("0.6.2-rc.10", "0.6.2");
});

test("Git release gate covers host and packaging changes, skips docs, and supports the legacy version source", (t) => {
  const root = fixture(t);
  const git = (...args) => execFileSync("git", args, {cwd: root, stdio: "pipe", encoding: "utf8"});
  git("init", "--quiet");
  git("config", "user.name", "Packaging test");
  git("config", "user.email", "packaging-test@example.invalid");
  const metadata = readJson(root, "plugin-metadata.json");
  rmSync(path.join(root, "plugin-metadata.json"));
  git("add", ".");
  git("-c", "commit.gpgsign=false", "commit", "--quiet", "-m", "Legacy release");
  writeFileSync(path.join(root, "plugin-metadata.json"), json(metadata));
  assert.throws(() => checkVersionBump(root, "HEAD"), /version must increase/u);
  metadata.version = "0.6.2";
  writeFileSync(path.join(root, "plugin-metadata.json"), json(metadata));
  assert.match(checkVersionBump(root, "HEAD"), /version increased/u);
  git("add", ".");
  git("-c", "commit.gpgsign=false", "commit", "--quiet", "-m", "Canonical metadata");
  writeFileSync(path.join(root, "README.md"), "Documentation only\n");
  assert.match(checkVersionBump(root, "HEAD"), /no version bump required/u);
  writeFileSync(path.join(root, 'LICENSE'), 'Changed license\n');
  assert.throws(() => checkVersionBump(root, 'HEAD'), /version must increase/u);
  git('restore', 'LICENSE');
  writeFileSync(path.join(root, "host/HOST.md"), "Changed host contract\n");
  assert.throws(() => checkVersionBump(root, "HEAD"), /version must increase/u);
  git("restore", "host/HOST.md");
  writeFileSync(path.join(root, "package.json"), "{}\n");
  assert.throws(() => checkVersionBump(root, "HEAD"), /version must increase/u);
  assert.throws(() => checkVersionBump(root, "missing-base-ref"));
  rmSync(path.join(root, "package.json"));
  rmSync(path.join(root, "README.md"));
  const common = git("rev-parse", "HEAD").trim();
  git("checkout", "--quiet", "-b", "newer-target");
  metadata.version = "0.6.4";
  writeFileSync(path.join(root, "plugin-metadata.json"), json(metadata));
  git("add", ".");
  git("-c", "commit.gpgsign=false", "commit", "--quiet", "-m", "Newer target release");
  git("checkout", "--quiet", "--detach", common);
  metadata.version = "0.6.3";
  writeFileSync(path.join(root, "plugin-metadata.json"), json(metadata));
  assert.throws(() => checkVersionBump(root, "newer-target"), /0\.6\.4 -> 0\.6\.3/u);
});

test("release sync regenerates dependency declarations and rejects downgrades before changing files", (t) => {
  const root = fixture(t);
  cpSync(path.join(ROOT, "scripts"), path.join(root, "scripts"), {recursive: true});
  symlinkSync(path.join(ROOT, "node_modules"), path.join(root, "node_modules"), "dir");
  const git = (...args) => execFileSync('git', args, {cwd: root, stdio: 'pipe', encoding: 'utf8'}).trim();
  git('init', '--quiet');
  git('config', 'user.name', 'Packaging test');
  git('config', 'user.email', 'packaging-test@example.invalid');
  git('add', '.');
  git('-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'Released base');
  const base = git('rev-parse', 'HEAD');
  const upstream = path.join(root, "upstream");
  cpSync(path.join(root, PLUGIN), upstream, {recursive: true});
  for (const skill of readJson(root, `${PLUGIN}/bundle.json`).skills) {
    const file = path.join(upstream, "skills", skill, "agents/openai.yaml");
    const fields = parse(readFileSync(file, "utf8"));
    delete fields.dependencies;
    writeFileSync(file, json(fields));
  }
  const before = readFileSync(path.join(root, "plugin-metadata.json"), "utf8");
  const run = (version, extra = []) => spawnSync(process.execPath, [path.join(root, "scripts/sync-bundle.mjs"), "--bundle", upstream, "--version", version, ...extra], {cwd: root, encoding: "utf8"});
  const rejected = run("0.5.0");
  assert.equal(rejected.status, 1);
  assert.match(rejected.stderr, /version must increase/u);
  assert.equal(readFileSync(path.join(root, "plugin-metadata.json"), "utf8"), before);
  const released = run("0.6.2");
  assert.equal(released.status, 0, released.stderr);
  assert.equal(readJson(root, "plugin-metadata.json").version, "0.6.2");
  assert.equal(readJson(root, `${PLUGIN}/.codex-plugin/plugin.json`).version, "0.6.2");
  assert.equal(run('0.6.2').status, 1);
  const rebuilt = run('0.6.2', ['--base', base]);
  assert.equal(rebuilt.status, 0, rebuilt.stderr);
  assert.equal(readFileSync(path.join(root, PLUGIN, 'LICENSE'), 'utf8'), readFileSync(path.join(root, 'LICENSE'), 'utf8'));
  assert.deepEqual(readFileSync(path.join(root, PLUGIN, 'assets/test-icon.png')), testIcon());
  git('add', 'plugin-metadata.json');
  git('-c', 'commit.gpgsign=false', 'commit', '--quiet', '-m', 'Published version');
  assert.equal(run('0.6.2', ['--base', 'HEAD']).status, 1);
  assert.equal(validatePlugin(root).skills, readJson(root, `${PLUGIN}/bundle.json`).skills.length);
  const agent = parse(readFileSync(path.join(root, PLUGIN, "skills/email-model-editor/agents/openai.yaml"), "utf8"));
  assert.equal(agent.dependencies.tools[0].value, "stripo-mcp");
  const skill = readFileSync(path.join(root, PLUGIN, "skills/email-model-editor/SKILL.md"), "utf8");
  assert.equal(skill.split("Host paths: in Claude Code").length - 1, 1);
  const helper = "business-profile/scripts/download_via_proxy.sh";
  const originalHelper = `${readFileSync(path.join(upstream, "skills", helper), "utf8")}\n# Upstream helper\n`;
  writeFileSync(path.join(upstream, "skills", helper), originalHelper);
  rmSync(path.join(root, "host", helper));
  assert.throws(() => generateMetadata(root), /Host overrides were removed/u);
  const restored = run("0.6.3");
  assert.equal(restored.status, 0, restored.stderr);
  assert.equal(readFileSync(path.join(root, PLUGIN, "skills", helper), "utf8"), originalHelper);
  generateMetadata(root, {check: true});
});

#!/usr/bin/env node
// Runtime-only check: no maintenance dependencies, credentials, MCP calls or network requests.
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';

const version = process.versions.node.split('.').map(Number);
const checks = {node: version[0] > 20 || version[0] === 20 && (version[1] > 18 || version[1] === 18 && version[2] >= 1)};
checks.curl = spawnSync('curl', ['--version'], {stdio: 'ignore'}).status === 0;
try {
  const sdk = await import('../packages/convo-email-agent/index.js');
  checks.emailSdk = ['assertValidEmailModel', 'validateEmailDocument', 'createEmailSdk', 'getContract'].every(name => typeof sdk[name] === 'function');
  const release = JSON.parse(readFileSync(new URL('../release.json', import.meta.url), 'utf8'));
  const contract = sdk.getContract();
  checks.editorValidator = contract.editorRevision === release.upstream.editorValidator.editorRevision
    && contract.validatorSha256 === release.upstream.editorValidator.bundleSha256;
} catch (error) {
  checks.emailSdk = false;
  console.error(error.message);
}
const ready = Object.values(checks).every(Boolean);
console.log(JSON.stringify({ready, checks}, null, 2));
process.exitCode = ready ? 0 : 1;

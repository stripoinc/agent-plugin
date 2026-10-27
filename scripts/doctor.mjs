#!/usr/bin/env node
// Runtime-only check: no maintenance dependencies, credentials, MCP calls or network requests.
const version = process.versions.node.split('.').map(Number);
const checks = {node: version[0] > 20 || version[0] === 20 && (version[1] > 18 || version[1] === 18 && version[2] >= 1)};
try {
  const sdk = await import('../packages/convo-email-agent/index.js');
  checks.emailSdk = ['assertValidEmailModel', 'validateEmailDocument', 'createEmailSdk', 'getContract'].every(name => typeof sdk[name] === 'function');
} catch (error) {
  checks.emailSdk = false;
  console.error(error.message);
}

const ready = Object.values(checks).every(Boolean);
console.log(JSON.stringify({ready, checks}, null, 2));
process.exitCode = ready ? 0 : 1;

#!/usr/bin/env node
// Runtime-only check: no maintenance dependencies, credentials, MCP calls or network requests.
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const version = process.versions.node.split('.').map(Number);
const checks = {node: version[0] > 20 || version[0] === 20 && (version[1] > 18 || version[1] === 18 && version[2] >= 1)};
try {
  const sdk = await import('../packages/convo-email-agent/index.js');
  checks.emailSdk = ['assertValidEmailModel', 'validateEmailDocument', 'createEmailSdk', 'getContract'].every(name => typeof sdk[name] === 'function');
} catch (error) {
  checks.emailSdk = false;
  console.error(error.message);
}

// Business Profile finalization imports the packaged Python runtime; the Stripo adapter renders
// SVG logos in an isolated `-I -B` worker that requires resvg-py 0.3.3.
const run = (command, args) => execFileSync(command, args, {encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], timeout: 15000}).trim();
const python = ['python3', 'python'].find(command => {
  try {
    return run(command, ['-c', 'import sys; print(sys.version_info >= (3, 11))']) === 'True';
  } catch {
    return false;
  }
});
const probe = args => {
  if (!python) return null;
  try {
    return run(python, args);
  } catch (error) {
    console.error(error.stderr?.trim().split('\n').at(-1) || error.message);
    return null;
  }
};
const runtime = fileURLToPath(new URL('../packages/brandkit-runtime', import.meta.url));
checks.python311 = Boolean(python);
checks.brandkitRuntime = probe(['-B', '-c', 'import sys; sys.path.insert(0, sys.argv[1]); import brandkit_runtime.__main__, brandkit_runtime.adapters.stripo', runtime]) !== null;
checks.resvgPy = probe(['-I', '-B', '-c', 'import resvg_py; print(resvg_py.__version__)']) === '0.3.3';

const ready = Object.values(checks).every(Boolean);
console.log(JSON.stringify({ready, checks, python: python ?? null}, null, 2));
process.exitCode = ready ? 0 : 1;

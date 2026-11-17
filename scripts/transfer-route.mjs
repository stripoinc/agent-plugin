import {spawn} from 'node:child_process';
import {BlockList, isIP} from 'node:net';
import {execPath} from 'node:process';

// These exact bucket names are controlled by Stripo. Never delegate an arbitrary target
// name to a proxy resolver. Direct connections pin one address from an all-public answer.
const storage = new Set(['live', 'stage', 'dev'].map(stage =>
  'stripo-mcp-content-' + stage + '.s3.eu-west-1.amazonaws.com'));
const blocked = new BlockList();
for (const [address, prefix] of [
  ['0.0.0.0', 8], ['10.0.0.0', 8], ['100.64.0.0', 10], ['127.0.0.0', 8],
  ['169.254.0.0', 16], ['172.16.0.0', 12], ['192.0.0.0', 24], ['192.0.2.0', 24],
  ['192.88.99.0', 24], ['192.168.0.0', 16], ['198.18.0.0', 15], ['198.51.100.0', 24],
  ['203.0.113.0', 24], ['224.0.0.0', 4], ['240.0.0.0', 4],
]) blocked.addSubnet(address, prefix, 'ipv4');
for (const [address, prefix] of [['2001::', 23], ['2001:db8::', 32], ['2002::', 16], ['3fff::', 20]]) {
  blocked.addSubnet(address, prefix, 'ipv6');
}
const globalV6 = new BlockList();
globalV6.addSubnet('2000::', 3, 'ipv6');

export class TransferError extends Error {
  constructor(code, message, details) {
    super(message);
    this.code = code;
    Object.assign(this, details);
  }
}

export function requireValue(condition, code, message) {
  if (!condition) throw new TransferError(code, message);
}

function publicAddress(address) {
  const family = isIP(address);
  return family === 4 ? !blocked.check(address, 'ipv4')
    : family === 6 && globalV6.check(address, 'ipv6') && !blocked.check(address, 'ipv6');
}

function bypassProxy(list, {hostname, port}) {
  return list.toLowerCase().split(/[\s,]+/).some(entry => {
    if (entry === '*') return true;
    const withPort = /^(?:\[([^\]]+)\]|([^:]+)):(\d+)$/.exec(entry);
    if (withPort && Number(withPort[3]) !== Number(port)) return false;
    const pattern = (withPort ? withPort[1] ?? withPort[2] : entry).replace(/^\[|\]$/g, '');
    if (pattern === hostname) return true;
    if (pattern.startsWith('.') || pattern.startsWith('*.')) return hostname.endsWith(pattern.replace(/^\*/, ''));
    const family = isIP(hostname);
    if (!family) return false;
    const parts = pattern.split(/[-/]/);
    const [start, end] = parts;
    if (parts.length !== 2 || isIP(start) !== family || !end) return false;
    const kind = family === 4 ? 'ipv4' : 'ipv6';
    const range = new BlockList();
    try {
      if (pattern.includes('-') && isIP(end) === family) range.addRange(start, end, kind);
      else if (pattern.includes('/') && /^\d+$/.test(end)) range.addSubnet(start, Number(end), kind);
      return range.check(hostname, kind);
    } catch { return false; }
  });
}

export function transferRoute(raw, operation, environment) {
  requireValue(typeof raw === 'string' && !/[\s\x00-\x1f\x7f\\]/u.test(raw), 'INVALID_URL', 'Use the exact HTTPS URL returned by MCP.');
  let url;
  try { url = new URL(raw); } catch { throw new TransferError('INVALID_URL', 'Invalid transfer URL.'); }
  const parts = /^https:\/\/([^/?#]+)([^#]*)$/i.exec(raw);
  requireValue(parts && url.protocol === 'https:' && !parts[1].includes('@') && !url.username && !url.password,
    'INVALID_URL', 'Only HTTPS URLs without credentials or fragments are supported.');
  // Both clients use this validated authority and the original, unnormalized request target.
  const target = {hostname: url.hostname.replace(/^\[|\]$/g, ''), port: Number(url.port || 443),
    path: parts[2].startsWith('/') ? parts[2] : '/' + parts[2]};
  requireValue(target.port > 0, 'INVALID_URL', 'Use a valid HTTPS port.');
  requireValue(/^[\x21-\x7e]+$/.test(target.path), 'INVALID_URL', 'Use a percent-encoded HTTPS request target.');
  const isStorage = storage.has(target.hostname) && target.port === 443;
  requireValue(operation !== 'upload' || isStorage, 'UNSUPPORTED_HOST', 'Uploads require a Stripo storage ticket on port 443.');
  const setting = name => environment[name.toLowerCase()] ?? environment[name];
  const httpProxy = environment.REQUEST_METHOD ? environment.http_proxy : setting('HTTP_PROXY');
  const proxyUrl = setting('HTTPS_PROXY') || httpProxy || setting('ALL_PROXY');
  if (!proxyUrl || bypassProxy(setting('NO_PROXY') ?? '', target)) return {target};
  requireValue(isStorage, 'UNSUPPORTED_HOST', 'Proxy resolution requires an exact Stripo storage host on port 443.');
  let proxy;
  try {
    proxy = new URL(proxyUrl);
    decodeURIComponent(proxy.username);
    decodeURIComponent(proxy.password);
  } catch { throw new TransferError('INVALID_PROXY', 'Invalid configured proxy URL.'); }
  requireValue(['https:', 'http:'].includes(proxy.protocol) && proxy.port !== '0' && proxy.pathname === '/' && !proxy.search && !proxy.hash,
    'INVALID_PROXY', 'A configured HTTP or HTTPS proxy endpoint is required.');
  return {target, proxy};
}

// Child clients receive only OS/resolver settings and the trust variables they use.
// Send the selected proxy and ticket fields only to curl, through its private config input.
export function childEnvironment(environment, extra = []) {
  const names = ['PATH', 'SystemRoot', 'SYSTEMROOT', 'WINDIR', 'TEMP', 'TMP', 'TMPDIR',
    'LOCALDOMAIN', 'RES_OPTIONS', 'HOSTALIASES', ...extra];
  return Object.fromEntries(names.filter(name => environment[name] !== undefined).map(name => [name, environment[name]]));
}

export function runChild(command, args, {environment, signal, input}) {
  signal.throwIfAborted();
  return new Promise((fulfill, reject) => {
    const child = spawn(command, args, {env: environment, stdio: ['pipe', 'pipe', 'ignore'], windowsHide: true});
    let failure, size = 0;
    const chunks = [];
    const kill = () => child.kill('SIGKILL');
    signal.addEventListener('abort', kill, {once: true});
    child.on('error', error => { failure = error; });
    child.stdin.on('error', error => { if (error.code !== 'EPIPE') { failure = error; kill(); } });
    child.stdout.on('data', chunk => {
      size += chunk.length;
      if (size <= 64 * 1024) chunks.push(chunk);
      else { failure = new TransferError('INVALID_RESPONSE', 'Transfer metadata exceeds the limit.'); kill(); }
    });
    child.once('close', status => {
      signal.removeEventListener('abort', kill);
      if (signal.aborted || failure) reject(signal.reason ?? failure);
      else fulfill({status, output: Buffer.concat(chunks).toString('utf8')});
    });
    child.stdin.end(input);
  });
}

// getaddrinfo honors the host resolver (including hosts files) but Node cannot cancel it.
// Isolate that call so the deadline can terminate and reap it even when OS DNS hangs.
const lookupProgram = "require('node:dns').lookup(process.argv[1], {all:true, verbatim:true}, " +
  "(error, addresses) => process.stdout.write(JSON.stringify(error ? {code:error.code} : {addresses})))";

async function systemAddresses(hostname, {signal, environment}) {
  const {status, output} = await runChild(execPath, ['-e', lookupProgram, '--', hostname],
    {signal, environment: childEnvironment(environment)});
  requireValue(status === 0, 'RESOLVER_FAILED', 'The system resolver did not complete.');
  const answer = JSON.parse(output);
  if (answer.code) throw new TransferError(answer.code, 'System DNS lookup failed.');
  return answer.addresses;
}

export async function resolveAddress(hostname, context, publicOnly) {
  const family = isIP(hostname);
  let addresses;
  if (family) addresses = [{address: hostname, family}];
  else if (context.lookup) {
    // Preserve the exported API's lookup injection and also bound a non-cooperative binding.
    const {signal} = context;
    signal.throwIfAborted();
    let abort;
    const cancelled = new Promise((_, reject) => { abort = () => reject(signal.reason); });
    signal.addEventListener('abort', abort, {once: true});
    try { addresses = await Promise.race([context.lookup(hostname, {all: true, verbatim: true}), cancelled]); }
    finally { signal.removeEventListener('abort', abort); }
  } else addresses = await systemAddresses(hostname, context);
  requireValue(addresses.length && addresses.every(({address, family}) => isIP(address) === family && (!publicOnly || publicAddress(address))),
    publicOnly ? 'NON_PUBLIC_HOST' : 'INVALID_PROXY', 'The resolver returned an unusable address for this route.');
  return addresses.find(item => item.family === 4) ?? addresses[0];
}

export function pinnedLookup(address) {
  return (_hostname, options, callback) => options.all ? callback(null, [address]) : callback(null, address.address, address.family);
}

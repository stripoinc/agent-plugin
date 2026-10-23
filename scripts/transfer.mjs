#!/usr/bin/env node
// Transfer exact file bytes using URLs returned by Stripo MCP. OAuth stays with the host.
import {createHash} from 'node:crypto';
import {lookup as resolveHost} from 'node:dns/promises';
import {mkdir, mkdtemp, open, readFile, rename, rm} from 'node:fs/promises';
import {request as httpsRequest} from 'node:https';
import {BlockList, isIP} from 'node:net';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';

const MAX_BYTES = 64 * 1024 * 1024;
const TIMEOUT_MS = 60_000;
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

class TransferError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}
function requireValue(condition, code, message) {
  if (!condition) throw new TransferError(code, message);
}

function targetUrl(raw) {
  requireValue(typeof raw === 'string' && !/[\s\x00-\x1f\x7f\\]/u.test(raw), 'INVALID_URL', 'Use the exact HTTPS URL returned by MCP.');
  let url;
  try { url = new URL(raw); } catch { throw new TransferError('INVALID_URL', 'Invalid transfer URL.'); }
  const parts = /^https:\/\/([^/?#]+)([^#]*)$/i.exec(raw);
  requireValue(parts && url.protocol === 'https:' && !parts[1].includes('@') && !url.username && !url.password,
    'INVALID_URL', 'Only HTTPS URLs without credentials or fragments are supported.');
  const hostname = url.hostname.replace(/^\[|\]$/g, '');
  // Keep the signed path and query byte-for-byte, including escapes and parameter order.
  const path = !parts[2] || parts[2].startsWith('?') ? `/${parts[2]}` : parts[2];
  return {hostname, port: url.port || 443, path};
}

function publicAddress(address) {
  const family = isIP(address);
  return family === 4 ? !blocked.check(address, 'ipv4')
    : family === 6 && globalV6.check(address, 'ipv6') && !blocked.check(address, 'ipv6');
}

function requestHeaders(input, contentType, body) {
  requireValue(input && typeof input === 'object' && !Array.isArray(input), 'INVALID_HEADERS', 'Headers must be a JSON object.');
  const headers = {};
  for (const [key, value] of Object.entries(input)) {
    const name = key.toLowerCase();
    requireValue(/^[!#$%&'*+.^_`|~0-9a-z-]+$/.test(name) && typeof value === 'string' && !/[\r\n\x00]/.test(value),
      'INVALID_HEADERS', 'Invalid transfer header.');
    requireValue(!['authorization', 'proxy-authorization', 'cookie', 'host', 'content-length', 'transfer-encoding',
      'connection', 'upgrade', 'expect', 'te', 'trailer'].includes(name), 'INVALID_HEADERS', 'Authentication and transport headers are not accepted.');
    requireValue(!(name in headers), 'INVALID_HEADERS', 'Duplicate transfer header.');
    headers[name] = value;
  }
  if (body !== undefined) {
    if (contentType !== undefined) {
      requireValue(typeof contentType === 'string' && contentType.length > 0 && !/[\r\n\x00]/.test(contentType),
        'INVALID_HEADERS', 'Invalid content type.');
      requireValue(!headers['content-type'] || headers['content-type'] === contentType,
        'INVALID_HEADERS', 'Content type differs from the ticket headers.');
      headers['content-type'] = contentType;
    }
    headers['content-type'] ??= 'application/json';
    headers['content-length'] = String(body.length);
  }
  return headers;
}

async function responseBytes(response, maxBytes) {
  requireValue(response.statusCode >= 200 && response.statusCode < 300,
    'HTTP_ERROR', `File transfer returned HTTP ${response.statusCode}; no retry was attempted.`);
  const length = response.headers['content-length'];
  requireValue(length === undefined || /^\d+$/.test(length), 'INVALID_RESPONSE', 'Invalid response Content-Length.');
  const expected = length === undefined ? undefined : Number(length);
  requireValue(expected === undefined || (Number.isSafeInteger(expected) && expected <= maxBytes),
    'SIZE_LIMIT', 'Response exceeds the byte limit.');
  const chunks = [];
  let size = 0;
  for await (const chunk of response) {
    size += chunk.length;
    requireValue(size <= maxBytes, 'SIZE_LIMIT', 'Response exceeds the byte limit.');
    chunks.push(chunk);
  }
  requireValue(expected === undefined || size === expected, 'INCOMPLETE_RESPONSE', 'Response length does not match Content-Length.');
  return Buffer.concat(chunks, size);
}

async function exchange(target, method, body, headers, maxBytes, {lookup, request}) {
  const signal = AbortSignal.timeout(TIMEOUT_MS);
  const addresses = isIP(target.hostname) ? [{address: target.hostname, family: isIP(target.hostname)}]
    : await lookup(target.hostname, {all: true, verbatim: true});
  requireValue(addresses.length > 0 && addresses.every(({address}) => publicAddress(address)),
    'NON_PUBLIC_HOST', 'Transfer host must resolve only to public addresses.');
  const address = addresses.find(item => item.family === 4) ?? addresses[0];
  return new Promise((fulfill, reject) => {
    const req = request({
      ...target, method, headers, agent: false, rejectUnauthorized: true, signal,
      family: address.family, autoSelectFamily: false,
      lookup: (_host, options, callback) => options.all ? callback(null, [address]) : callback(null, address.address, address.family),
    }, response => {
      responseBytes(response, maxBytes).then(fulfill, error => { response.destroy(); reject(error); });
    });
    req.on('error', reject);
    req.end(body);
  });
}

async function atomicWrite(destination, bytes) {
  const parent = dirname(resolve(destination));
  await mkdir(parent, {recursive: true});
  const temporary = await mkdtemp(join(parent, '.stripo-transfer-'));
  const file = join(temporary, 'payload');
  try {
    const handle = await open(file, 'wx', 0o600);
    try { await handle.writeFile(bytes); await handle.sync(); } finally { await handle.close(); }
    await rename(file, destination);
  } finally {
    await rm(temporary, {recursive: true, force: true});
  }
}

export async function transferFile(options, {lookup = resolveHost, request = httpsRequest} = {}) {
  const {operation, url, input, output, sha256, contentType, headers = {}} = options;
  requireValue(['download', 'upload'].includes(operation), 'INVALID_ARGUMENT', 'Choose download or upload.');
  const target = targetUrl(url);
  const maxBytes = options.maxBytes ?? MAX_BYTES;
  requireValue(Number.isSafeInteger(maxBytes) && maxBytes > 0 && maxBytes <= MAX_BYTES,
    'INVALID_ARGUMENT', `max-bytes must be between 1 and ${MAX_BYTES}.`);
  const method = options.method ?? (operation === 'download' ? 'GET' : 'PUT');
  requireValue(method === (operation === 'download' ? 'GET' : 'PUT'), 'INVALID_ARGUMENT', 'Downloads require GET; Stripo uploads require PUT.');
  requireValue(sha256 === undefined || (operation === 'download' && /^[a-f0-9]{64}$/i.test(sha256)),
    'INVALID_ARGUMENT', 'sha256 must be a download checksum of 64 hexadecimal characters.');
  let body;
  if (operation === 'upload') {
    requireValue(input && !output && options.maxBytes !== undefined, 'INVALID_ARGUMENT', 'Upload requires --input and the ticket max-bytes; --output is download-only.');
    const handle = await open(input, 'r');
    try {
      const stat = await handle.stat();
      requireValue(stat.isFile() && stat.size > 0 && stat.size <= maxBytes, 'SIZE_LIMIT', 'Upload must be a nonempty file within the ticket byte limit.');
      body = await handle.readFile();
      requireValue(body.length === stat.size, 'FILE_CHANGED', 'The input size changed while reading; inspect it before uploading.');
    } finally { await handle.close(); }
  } else {
    requireValue(output && !input, 'INVALID_ARGUMENT', 'Download requires --output; --input is upload-only.');
  }
  const response = await exchange(target, method, body, requestHeaders(headers, contentType, body), maxBytes, {lookup, request});
  const bytes = body ?? response;
  const digest = createHash('sha256').update(bytes).digest('hex');
  requireValue(!sha256 || digest === sha256.toLowerCase(), 'CHECKSUM_MISMATCH', 'Downloaded file checksum does not match the manifest.');
  if (operation === 'download') {
    await atomicWrite(output, response);
    return {downloaded: true, bytes: bytes.length, sha256: digest};
  }
  // An empty S3 HTTP 200 response is valid. Only the subsequent MCP call saves the entity.
  return {transferred: true, bytes: bytes.length, sha256: digest, persisted: false};
}

async function main() {
  let values, positionals;
  try {
    ({values, positionals} = parseArgs({allowPositionals: true, options: {
      url: {type: 'string'}, input: {type: 'string'}, output: {type: 'string'},
      method: {type: 'string'}, 'content-type': {type: 'string'}, 'max-bytes': {type: 'string'},
      sha256: {type: 'string'}, 'headers-file': {type: 'string'}, help: {type: 'boolean'},
    }}));
  } catch { throw new TransferError('INVALID_ARGUMENT', 'Invalid arguments; use --help.'); }
  if (values.help) {
    console.log('node transfer.mjs download --url <MCP URL> --output <file> [--sha256 <hex>] [--max-bytes <n>]\n'
      + 'node transfer.mjs upload --url <MCP URL> --input <file> --max-bytes <ticket limit> [--content-type <mime>] [--method PUT]\n'
      + 'Optional: --headers-file <JSON object returned by MCP>. HTTPS only; no redirects or automatic retries.');
    return;
  }
  requireValue(positionals.length === 1, 'INVALID_ARGUMENT', 'Choose one operation; use --help.');
  let headers = {};
  if (values['headers-file']) {
    try { headers = JSON.parse(await readFile(values['headers-file'], 'utf8')); }
    catch { throw new TransferError('INVALID_HEADERS', 'Cannot read the ticket headers JSON file.'); }
  }
  const result = await transferFile({
    operation: positionals[0], url: values.url, input: values.input, output: values.output,
    method: values.method, contentType: values['content-type'], sha256: values.sha256, headers,
    maxBytes: values['max-bytes'] === undefined ? undefined : Number(values['max-bytes']),
  });
  console.log(JSON.stringify(result));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch(error => {
    // Network/filesystem error messages can contain signed URLs, paths or upstream bodies.
    const code = error instanceof TransferError ? error.code
      : /^[A-Z][A-Z0-9_]{0,63}$/.test(error.code ?? '') ? error.code : 'TRANSFER_FAILED';
    console.log(JSON.stringify({success: false, code, error: error instanceof TransferError ? error.message
      : 'File transfer failed; inspect network access, TLS trust and local paths. No retry was attempted.'}));
    process.exitCode = 1;
  });
}

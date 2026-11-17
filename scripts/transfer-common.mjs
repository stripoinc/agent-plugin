import {createHash, randomUUID} from 'node:crypto';
import {constants} from 'node:fs';
import {mkdir, open, realpath, rename, rm} from 'node:fs/promises';
import {validateHeaderValue} from 'node:http';
import {tmpdir} from 'node:os';
import {basename, dirname, join, resolve, sep} from 'node:path';
import {env as hostEnvironment} from 'node:process';
import {parseArgs} from 'node:util';
import {requireValue, resolveAddress, TransferError, transferRoute} from './transfer-route.mjs';

const MAX_BYTES = 64 * 1024 * 1024;
const TIMEOUT_MS = 60_000;

// Local files stay under the system temp directory, so an approved transfer cannot read or
// replace files elsewhere.
async function taskRoots() {
  const roots = [];
  for (const directory of new Set([tmpdir(), '/tmp'])) {
    try { roots.push(await realpath(directory)); } catch { /* absent on this platform */ }
  }
  return roots;
}

async function taskFile(file, roots, option) {
  requireValue(typeof file === 'string' && file.length > 0, 'INVALID_ARGUMENT', `${option} requires a file path.`);
  // Resolve the deepest existing ancestor, so symlinks cannot lead outside the temp directory.
  let existing = resolve(file);
  const missing = [];
  for (;;) {
    try { existing = await realpath(existing); break; } catch (error) { if (error.code !== 'ENOENT') throw error; }
    const parent = dirname(existing);
    requireValue(parent !== existing, 'OUTSIDE_TASK_DIR', `${option} must be inside the task directory.`);
    missing.unshift(basename(existing));
    existing = parent;
  }
  const path = join(existing, ...missing);
  requireValue(roots.some(root => path.startsWith(root.endsWith(sep) ? root : root + sep)),
    'OUTSIDE_TASK_DIR', `${option} must be inside the task directory under the system temp directory.`);
  return path;
}

function requestHeaders(input, contentType, body) {
  requireValue(input && typeof input === 'object' && !Array.isArray(input), 'INVALID_HEADERS', 'Headers must be a JSON object.');
  const headers = {};
  for (const [field, value] of Object.entries(input)) {
    const name = field.toLowerCase();
    requireValue(/^[!#$%&'*+.^_`|~0-9a-z-]+$/.test(name) && typeof value === 'string' && !/[\r\n\x00]/.test(value),
      'INVALID_HEADERS', 'Invalid transfer header.');
    requireValue(!['authorization', 'proxy-authorization', 'cookie', 'host', 'content-length', 'transfer-encoding',
      'connection', 'upgrade', 'expect', 'te', 'trailer'].includes(name), 'INVALID_HEADERS', 'Authentication and transport headers are not accepted.');
    try { validateHeaderValue(name, value); }
    catch { throw new TransferError('INVALID_HEADERS', 'Invalid transfer header value.'); }
    requireValue(!(name in headers), 'INVALID_HEADERS', 'Duplicate transfer header.');
    headers[name] = value;
  }
  if (body !== undefined) {
    if (contentType !== undefined) {
      requireValue(typeof contentType === 'string' && contentType.length > 0 && !/[\r\n\x00]/.test(contentType),
        'INVALID_HEADERS', 'Invalid content type.');
      requireValue(!headers['content-type'] || headers['content-type'] === contentType,
        'INVALID_HEADERS', 'Content type differs from the ticket headers.');
      try { validateHeaderValue('content-type', contentType); }
      catch { throw new TransferError('INVALID_HEADERS', 'Invalid content type.'); }
      headers['content-type'] = contentType;
    }
    headers['content-type'] ??= 'application/json';
    headers['content-length'] = String(body.length);
  }
  return headers;
}

async function atomicWrite(destination, bytes, roots, signal) {
  requireValue(await taskFile(destination, roots, '--output') === destination, 'FILE_CHANGED',
    'The destination changed during the transfer.');
  const parent = dirname(resolve(destination));
  await mkdir(parent, {recursive: true});
  const file = join(parent, '.stripo-transfer-' + randomUUID());
  const handle = await open(file, 'wx', 0o600);
  try {
    try { await handle.writeFile(bytes, {signal}); await handle.sync(); } finally { await handle.close(); }
    signal.throwIfAborted();
    // Rename is the commit point. After it succeeds there is no staging cleanup to fail.
    await rename(file, destination);
  } catch (error) {
    await rm(file, {force: true});
    throw error;
  }
}

// Only recognized storage error codes are safe to surface. Bodies, URLs, headers and
// exception messages from the clients can all contain credentials.
const providerCodes = new Set(['AccessDenied', 'RequestExpired', 'ExpiredToken', 'InvalidToken',
  'SignatureDoesNotMatch', 'AuthorizationQueryParametersError', 'InvalidAccessKeyId', 'InvalidRequest',
  'RequestTimeTooSkewed', 'BadDigest', 'NoSuchKey', 'NoSuchBucket', 'SlowDown', 'InternalError', 'ServiceUnavailable']);
export function httpFailure(status, headerCode, sample) {
  const xmlCode = /<Code>([A-Za-z]+)<\/Code>/.exec(sample)?.[1];
  const providerCode = [headerCode, xmlCode].find(code => providerCodes.has(code));
  return new TransferError('HTTP_ERROR', 'File transfer returned HTTP ' + status + '.',
    {httpStatus: status, ...(providerCode && {providerCode})});
}

export function responseLength(status, length, contentRange, maxBytes) {
  requireValue(status !== 206 && !contentRange, 'INCOMPLETE_RESPONSE', 'The server returned only part of the artifact.');
  if (length === undefined) return;
  requireValue(/^\d+$/.test(length), 'INVALID_RESPONSE', 'Invalid response Content-Length.');
  const expected = Number(length);
  requireValue(Number.isSafeInteger(expected) && expected <= maxBytes, 'SIZE_LIMIT', 'Response exceeds the byte limit.');
  return expected;
}

export async function boundedBytes(stream, maxBytes) {
  const chunks = [];
  let size = 0;
  for await (const chunk of stream) {
    size += chunk.length;
    requireValue(size <= maxBytes, 'SIZE_LIMIT', 'File exceeds the byte limit.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks, size);
}

async function readTaskFile(path, maxBytes, signal, nonempty = false) {
  const handle = await open(path, constants.O_RDONLY | (constants.O_NOFOLLOW ?? 0) | (constants.O_NONBLOCK ?? 0));
  try {
    const stat = await handle.stat();
    requireValue(stat.isFile() && (!nonempty || stat.size > 0) && stat.size <= maxBytes, 'SIZE_LIMIT',
      'Use a regular file within the byte limit.');
    const bytes = await boundedBytes(handle.createReadStream({autoClose: false, signal}), maxBytes);
    requireValue(bytes.length === stat.size, 'FILE_CHANGED', 'The local file changed while reading.');
    return bytes;
  } finally { await handle.close(); }
}

function safeError(error) {
  if (error instanceof TransferError) return error;
  const code = /^[A-Z][A-Z0-9_]{0,63}$/.test(error?.code ?? '') ? error.code : 'TRANSFER_FAILED';
  return new TransferError(code, 'File transfer failed. Inspect the reported phase and code.');
}

const alternateCodes = new Set(['ENOTFOUND', 'EAI_AGAIN', 'ECONNRESET', 'ECONNREFUSED', 'ETIMEDOUT',
  'EPIPE', 'ENETUNREACH', 'EHOSTUNREACH', 'ENOSYS', 'ERR_METHOD_NOT_IMPLEMENTED']);

async function prepareFile(options, roots, signal) {
  const {operation, sha256, contentType, headersFile} = options;
  const maxBytes = options.maxBytes ?? MAX_BYTES;
  const method = options.method ?? (operation === 'download' ? 'GET' : 'PUT');
  requireValue(['download', 'upload'].includes(operation), 'INVALID_ARGUMENT', 'Choose download or upload.');
  requireValue(method === (operation === 'download' ? 'GET' : 'PUT'), 'INVALID_ARGUMENT', 'Downloads require GET and uploads require PUT.');
  requireValue(Number.isSafeInteger(maxBytes) && maxBytes > 0 && maxBytes <= MAX_BYTES,
    'INVALID_ARGUMENT', 'max-bytes must be between 1 and ' + MAX_BYTES + '.');
  requireValue(sha256 === undefined || (operation === 'download' && typeof sha256 === 'string' && /^[a-f0-9]{64}$/i.test(sha256)),
    'INVALID_ARGUMENT', 'sha256 must be a download checksum of 64 hexadecimal characters.');
  let {headers = {}} = options;
  if (headersFile !== undefined) {
    const file = await taskFile(headersFile, roots, '--headers-file');
    try {
      const bytes = await readTaskFile(file, MAX_BYTES, signal);
      headers = JSON.parse(bytes.toString('utf8'));
    } catch (error) {
      if (error instanceof TransferError || signal.aborted) throw error;
      throw new TransferError('INVALID_HEADERS', 'Cannot read the ticket headers JSON file.');
    }
  }
  let output, body;
  if (operation === 'upload') {
    requireValue(options.input && options.output === undefined && options.maxBytes !== undefined, 'INVALID_ARGUMENT',
      'Upload requires --input and the ticket max-bytes. --output is download-only.');
    body = await readTaskFile(await taskFile(options.input, roots, '--input'), maxBytes, signal, true);
  } else {
    requireValue(options.output && options.input === undefined, 'INVALID_ARGUMENT', 'Download requires --output. --input is upload-only.');
    output = await taskFile(options.output, roots, '--output');
  }
  return {method, body, output, roots, headers: requestHeaders(headers, contentType, body), maxBytes};
}

async function finishFile(file, response, sha256, context) {
  context.phase = 'verify';
  const bytes = file.body ?? response;
  const digest = createHash('sha256').update(bytes).digest('hex');
  requireValue(!sha256 || digest === sha256.toLowerCase(), 'CHECKSUM_MISMATCH', 'Downloaded file checksum does not match the manifest.');
  if (file.output) {
    context.phase = 'output';
    await atomicWrite(file.output, bytes, file.roots, context.signal);
    return {downloaded: true, bytes: bytes.length, sha256: digest};
  }
  return {transferred: true, bytes: bytes.length, sha256: digest, persisted: false};
}

export async function runTransfer(options, dependencies, clients) {
  const {signal: externalSignal, maxAttempts = 2} = options;
  const environment = dependencies.environment ?? hostEnvironment;
  const timeout = dependencies.timeoutMs ?? TIMEOUT_MS;
  if (![1, 2].includes(maxAttempts)) throw new TransferError('INVALID_ARGUMENT', 'max-attempts must be 1 or 2.',
    {attempts: 0, phase: 'validation'});
  let file, route, previous;
  for (const [index, client] of clients.slice(0, maxAttempts).entries()) {
    const controller = new AbortController();
    const {signal} = controller;
    const cancel = () => controller.abort(new TransferError('ABORT_ERR', 'Transfer cancelled.'));
    if (externalSignal?.aborted) cancel();
    else externalSignal?.addEventListener('abort', cancel, {once: true});
    const timer = setTimeout(() => controller.abort(new TransferError('ETIMEDOUT', 'Transfer deadline exceeded.')), timeout);
    const context = {...dependencies, environment, signal, timeout, phase: 'validation', putStarted: false};
    const details = {attempts: index + 1, transport: client.name, ...(previous && {previous})};
    try {
      signal.throwIfAborted();
      route ??= transferRoute(options.url, options.operation, environment);
      file ??= await prepareFile(options, dependencies.roots ?? await taskRoots(), signal);
      context.route = route;
      if (!route.proxy && !route.address) {
        context.phase = 'dns';
        route.address = await resolveAddress(route.target.hostname, context, true);
      }
      signal.throwIfAborted();
      const response = await client(file, context);
      signal.throwIfAborted();
      const result = await finishFile(file, response, options.sha256, context);
      return {...result, ...details, httpStatus: context.httpStatus};
    } catch (cause) {
      const receivedHttpError = context.httpStatus >= 300;
      const error = receivedHttpError && !externalSignal?.aborted && !['HTTP_ERROR', 'PROXY_HTTP_ERROR'].includes(cause?.code)
        ? httpFailure(context.httpStatus) : safeError(signal.aborted && !receivedHttpError ? signal.reason : cause);
      if (context.phase === 'validation') throw Object.assign(error, {phase: context.phase, attempts: 0});
      Object.assign(error, details, {phase: context.phase});
      // A local capability probe cannot send a request for the resource.
      if (context.phase === 'curl-capability' && error.code === 'CURL_UNAVAILABLE') error.attempts = index;
      if (context.httpStatus) error.httpStatus = context.httpStatus;
      if (context.putStarted && (!receivedHttpError || context.httpStatus >= 500)) error.writeOutcome = 'unknown';
      if (index + 1 >= Math.min(maxAttempts, clients.length) || externalSignal?.aborted ||
          context.httpStatus || context.putStarted || !alternateCodes.has(error.code)) throw error;
      previous = {transport: client.name, code: error.code, phase: context.phase};
    } finally {
      clearTimeout(timer);
      externalSignal?.removeEventListener('abort', cancel);
    }
  }
}

export async function runCli(transferFile) {
  const controller = new AbortController();
  const cancel = () => controller.abort();
  process.once('SIGINT', cancel);
  process.once('SIGTERM', cancel);
  try {
    let args;
    try {
      args = parseArgs({allowPositionals: true, options: {
        url: {type: 'string'}, input: {type: 'string'}, output: {type: 'string'},
        method: {type: 'string'}, 'content-type': {type: 'string'}, 'max-bytes': {type: 'string'},
        sha256: {type: 'string'}, 'headers-file': {type: 'string'}, help: {type: 'boolean'},
        'max-attempts': {type: 'string'},
      }});
    } catch { throw new TransferError('INVALID_ARGUMENT', 'Invalid arguments. Use --help.'); }
    const {values, positionals} = args;
    if (values.help) {
      console.log('download --url <MCP URL> --output <file> [--sha256 <hex>] [--max-bytes <n>]\n'
        + 'upload --url <MCP URL> --input <file> --max-bytes <ticket limit> [--content-type <mime>] [--method PUT]\n'
        + 'Optional: --headers-file <ticket JSON> and --max-attempts <1|2>. HTTPS only, no redirects.');
      return;
    }
    requireValue(positionals.length === 1, 'INVALID_ARGUMENT', 'Choose one operation. Use --help.');
    const result = await transferFile({
      operation: positionals[0], url: values.url, input: values.input, output: values.output, headersFile: values['headers-file'],
      method: values.method, contentType: values['content-type'], sha256: values.sha256, signal: controller.signal,
      maxAttempts: values['max-attempts'] === undefined ? undefined : Number(values['max-attempts']),
      maxBytes: values['max-bytes'] === undefined ? undefined : Number(values['max-bytes']),
    });
    console.log(JSON.stringify(result));
  } catch (cause) {
    const error = safeError(cause);
    console.log(JSON.stringify({success: false, phase: 'validation', attempts: 0, ...error, error: error.message}));
    process.exitCode = 1;
  } finally {
    process.removeListener('SIGINT', cancel);
    process.removeListener('SIGTERM', cancel);
  }
}

#!/usr/bin/env node
// Alternate entry point for the same transfer contract, also called by transfer.mjs.
import {mkdtemp, open, readFile, rm, stat, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join, resolve} from 'node:path';
import * as tls from 'node:tls';
import {fileURLToPath} from 'node:url';
import {httpFailure, responseLength, runCli, runTransfer} from './transfer-common.mjs';
import {childEnvironment, requireValue, runChild, TransferError} from './transfer-route.mjs';

async function checkCurl(context, environment) {
  context.phase = 'curl-capability';
  let result;
  try { result = await runChild('curl', ['--disable', '--version'], {signal: context.signal, environment}); }
  catch (error) {
    if (error.code === 'ENOENT') throw new TransferError('CURL_UNAVAILABLE', 'curl was not found.');
    throw error;
  }
  const version = /^curl (\d+)\.(\d+)\./.exec(result.output);
  const protocols = /^Protocols: (.*)$/mi.exec(result.output)?.[1].split(/\s+/) ?? [];
  const features = /^Features: (.*)$/mi.exec(result.output)?.[1].toLowerCase().split(/\s+/) ?? [];
  // 8.4.0 enforces --max-filesize during chunked and unknown-length responses.
  requireValue(result.status === 0 && version && (+version[1] > 8 || (+version[1] === 8 && +version[2] >= 4))
    && protocols.includes('https') && features.includes('ssl')
    && (context.route.proxy?.protocol !== 'https:' || features.includes('https-proxy')),
    'CURL_UNAVAILABLE', 'curl 8.4+ with HTTPS and support for the configured proxy is required.');
}

function configLine(option, value) {
  return option + ' = "' + value.replaceAll('\\', '\\\\').replaceAll('"', '\\"').replaceAll('\t', '\\t') + '"\n';
}

async function trustOptions({environment, signal, route}, directory) {
  let ca = environment.CURL_CA_BUNDLE || environment.SSL_CERT_FILE;
  if (!ca && environment.NODE_EXTRA_CA_CERTS) {
    // Reuse the effective Node trust store when the runtime exposes it. Older Node
    // versions can safely reuse the operator's explicit PEM without guessing its other CAs.
    if (!tls.getCACertificates) ca = environment.NODE_EXTRA_CA_CERTS;
    else {
      const roots = tls.getCACertificates('default');
      ca = join(directory, 'roots.pem');
      await writeFile(ca, roots.join('\n') + '\n', {mode: 0o600, signal});
    }
  }
  const args = [];
  const caDir = environment.SSL_CERT_DIR;
  if (ca) args.push('--cacert', ca);
  if (caDir) args.push('--capath', caDir);
  if (route.proxy?.protocol === 'https:') {
    if (ca) args.push('--proxy-cacert', ca);
    if (caDir) args.push('--proxy-capath', caDir);
  }
  return args;
}

async function errorSample(path, limit) {
  let file;
  try {
    file = await open(path, 'r');
    const buffer = Buffer.alloc(Math.min(4096, limit));
    const {bytesRead} = await file.read(buffer);
    return buffer.toString('utf8', 0, bytesRead);
  } catch { return ''; }
  finally { await file?.close(); }
}

function curlFailure(exit) {
  const codes = {5: 'ENOTFOUND', 6: 'ENOTFOUND', 7: 'ECONNREFUSED', 18: 'INCOMPLETE_RESPONSE',
    23: 'OUTPUT_ERROR', 28: 'ETIMEDOUT', 35: 'TLS_ERROR', 51: 'TLS_ERROR', 52: 'ECONNRESET', 55: 'EPIPE',
    56: 'ECONNRESET', 58: 'TLS_ERROR', 59: 'TLS_ERROR', 60: 'TLS_ERROR', 63: 'SIZE_LIMIT', 77: 'TLS_ERROR',
    83: 'TLS_ERROR', 90: 'TLS_ERROR', 91: 'TLS_ERROR', 97: 'PROXY_ERROR'};
  return new TransferError(codes[exit] ?? 'CURL_ERROR', 'curl did not complete the transfer.', {clientExit: exit});
}

export async function curl({method, body, headers, maxBytes}, context) {
  const {route: {target, address, proxy}, signal, environment} = context;
  const childEnv = childEnvironment(environment, ['CURL_CA_BUNDLE', 'SSL_CERT_FILE', 'SSL_CERT_DIR']);
  await checkCurl(context, childEnv);
  const directory = await mkdtemp(join(tmpdir(), 'stripo-curl-'));
  try {
    context.phase = 'curl-setup';
    const output = join(directory, 'response');
    const args = ['--disable', '--config', '-', '--silent', '--globoff', '--http1.1', '--proto', '=https',
      '--proto-redir', '=https', '--max-redirs', '0', '--retry', '0', '--max-time', String(context.timeout / 1000),
      '--max-filesize', String(maxBytes), '--output', output, '--noproxy', '', '--request', method,
      '--write-out', '%{response_code}\n%{http_connect}\n%{size_download}\n%header{content-length}\n%header{content-range}\n%header{x-amz-error-code}'];
    args.push(...await trustOptions(context, directory));
    const hostname = target.hostname.includes(':') ? '[' + target.hostname + ']' : target.hostname;
    // Route by the validated authority. Supply the original path and query verbatim, including
    // dot segments, escape case, repeated fields and a bare '?'. Keep them out of argv.
    let proxyUrl = '';
    if (proxy) {
      const auth = proxy.username || proxy.password ? proxy.username + ':' + proxy.password + '@' : '';
      proxyUrl = proxy.protocol + '//' + auth + proxy.hostname + ':' + (proxy.port || (proxy.protocol === 'https:' ? 443 : 80));
    }
    let config = configLine('url', 'https://' + hostname + ':' + target.port + '/')
      + configLine('request-target', target.path) + configLine('proxy', proxyUrl);
    if (!proxy && !address) throw new TransferError('NON_PUBLIC_HOST', 'Direct curl requires a checked address.');
    if (address && hostname !== address.address && hostname !== '[' + address.address + ']') {
      const ip = address.family === 6 ? '[' + address.address + ']' : address.address;
      args.push('--resolve', hostname + ':' + target.port + ':' + ip);
    }
    for (const name of ['accept', 'user-agent', 'expect']) {
      if (!(name in headers)) args.push('--header', name + ':');
    }
    for (const [name, value] of Object.entries(headers)) {
      config += configLine('header', value ? name + ': ' + value : name + ';');
    }
    if (body !== undefined) {
      const input = join(directory, 'upload');
      await writeFile(input, body, {mode: 0o600, signal});
      args.push('--upload-file', input);
    }
    signal.throwIfAborted();
    context.phase = 'connect';
    context.putStarted = body !== undefined;
    const result = await runChild('curl', args, {signal, environment: childEnv, input: Buffer.from(config, 'latin1')});
    const [originText, proxyText, sizeText, length, range, errorCode] = result.output.split('\n');
    const proxyStatus = Number(proxyText);
    if (proxyStatus && proxyStatus !== 200) {
      context.phase = 'proxy-connect';
      context.httpStatus = proxyStatus;
      context.putStarted = false;
      throw new TransferError('PROXY_HTTP_ERROR', 'Proxy returned HTTP ' + proxyStatus + '.');
    }
    const status = Number(originText);
    if (status) {
      context.phase = 'response';
      context.httpStatus = status;
      if (status < 200 || status >= 300) throw httpFailure(status, errorCode, await errorSample(output, maxBytes));
    }
    if (result.status !== 0) {
      const error = curlFailure(result.status);
      if ([5, 6, 7, 35, 60].includes(result.status)) context.putStarted = false;
      if (result.status === 5) context.phase = 'proxy-dns';
      else if (result.status === 6) context.phase = 'dns';
      else if (error.code === 'TLS_ERROR') context.phase = 'tls';
      throw error;
    }
    requireValue(status >= 200 && status < 300, 'INVALID_RESPONSE', 'Missing HTTP success status.');
    const expected = responseLength(status, length || undefined, range, maxBytes);
    const size = (await stat(output)).size;
    requireValue(size <= maxBytes, 'SIZE_LIMIT', 'Response exceeds the byte limit.');
    requireValue(/^\d+$/.test(sizeText) && size === Number(sizeText) && (expected === undefined || expected === size),
      'INCOMPLETE_RESPONSE', 'Response length does not match the completed transfer.');
    return await readFile(output, {signal});
  } finally {
    await rm(directory, {recursive: true, force: true});
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await runCli(options => runTransfer(options, {}, [curl]));
}

#!/usr/bin/env node
// Transfer exact file bytes using URLs returned by Stripo MCP. OAuth stays with the host.
import {request as httpRequest} from 'node:http';
import {Agent, request as httpsRequest} from 'node:https';
import {resolve} from 'node:path';
import {connect as tlsConnect} from 'node:tls';
import {fileURLToPath} from 'node:url';
import {boundedBytes, httpFailure, responseLength, runCli, runTransfer} from './transfer-common.mjs';
import {curl} from './transfer-curl.mjs';
import {pinnedLookup, requireValue, resolveAddress, TransferError} from './transfer-route.mjs';

async function openTunnel(context) {
  const {route: {target, proxy}, signal} = context;
  const hostname = proxy.hostname.replace(/^\[|\]$/g, '');
  context.phase = 'proxy-dns';
  const address = await resolveAddress(hostname, context, false);
  signal.throwIfAborted();
  const authority = target.hostname + ':' + target.port;
  const headers = {host: authority};
  if (proxy.username || proxy.password) {
    const credentials = decodeURIComponent(proxy.username) + ':' + decodeURIComponent(proxy.password);
    headers['Proxy-Authorization'] = 'Basic ' + Buffer.from(credentials).toString('base64');
  }
  context.phase = 'proxy-connect';
  const request = proxy.protocol === 'https:' ? httpsRequest : httpRequest;
  return new Promise((fulfill, reject) => {
    const req = request({hostname, port: proxy.port || (proxy.protocol === 'https:' ? 443 : 80),
      method: 'CONNECT', path: authority, headers, agent: false, signal, rejectUnauthorized: true,
      family: address.family, autoSelectFamily: false, lookup: pinnedLookup(address)});
    req.on('error', reject);
    req.once('connect', (response, socket, head) => {
      if (response.statusCode !== 200 || head.length) {
        socket.destroy();
        if (response.statusCode !== 200) {
          context.httpStatus = response.statusCode;
          reject(new TransferError('PROXY_HTTP_ERROR', 'Proxy returned HTTP ' + response.statusCode + '.'));
        } else reject(new TransferError('INVALID_RESPONSE', 'Unexpected data before tunnel TLS.'));
      } else fulfill(socket);
    });
    req.end();
  });
}

async function readResponse(response, maxBytes, context) {
  const {statusCode: status, headers} = response;
  context.phase = 'response';
  context.httpStatus = status;
  if (status < 200 || status >= 300) {
    // S3 can return its error code in XML. Never retain or print the complete error body.
    const sample = [];
    let remaining = Math.min(4096, maxBytes);
    try {
      for await (const chunk of response) {
        sample.push(chunk.subarray(0, remaining));
        remaining -= sample.at(-1).length;
        if (!remaining) break;
      }
    } catch { /* the received HTTP status still applies */ }
    throw httpFailure(status, headers['x-amz-error-code'], Buffer.concat(sample).toString('utf8'));
  }
  const expected = responseLength(status, headers['content-length'], headers['content-range'], maxBytes);
  let bytes;
  try { bytes = await boundedBytes(response, maxBytes); }
  catch (error) {
    if (response.complete === false && ['ECONNRESET', 'ERR_STREAM_PREMATURE_CLOSE'].includes(error.code))
      throw new TransferError('INCOMPLETE_RESPONSE', 'The HTTP response ended prematurely.');
    throw error;
  }
  requireValue(response.complete !== false && (expected === undefined || bytes.length === expected),
    'INCOMPLETE_RESPONSE', 'The HTTP response was incomplete.');
  return bytes;
}

async function node({method, body, headers, maxBytes}, context) {
  const {route: {target, proxy, address}, signal, request = httpsRequest} = context;
  let tunnel, agent, cancel;
  try {
    let connection;
    if (proxy) {
      tunnel = await openTunnel(context);
      signal.throwIfAborted();
      agent = new Agent();
      agent.createConnection = () => tlsConnect({socket: tunnel, servername: target.hostname, rejectUnauthorized: true});
      connection = {agent};
      context.phase = 'tls';
    } else {
      connection = {agent: false, family: address.family, autoSelectFamily: false, lookup: pinnedLookup(address)};
      context.phase = 'connect';
    }
    return await new Promise((fulfill, reject) => {
      const req = request({...target, ...connection, method, headers, signal, rejectUnauthorized: true}, response => {
        readResponse(response, maxBytes, context).then(fulfill, error => { response.destroy(); reject(error); });
      });
      req.on('error', reject);
      cancel = () => {
        req.destroy?.();
        reject(signal.reason);
      };
      signal.addEventListener('abort', cancel, {once: true});
      if (signal.aborted) return cancel();
      const send = () => {
        context.putStarted = body !== undefined;
        req.end(body);
      };
      req.on('socket', socket => {
        socket.once('connect', () => { context.phase = 'tls'; });
        socket.once('secureConnect', () => {
          context.phase = 'request';
          if (body !== undefined && request === httpsRequest) send();
        });
      });
      // Core allocates a fresh socket before end(). Hold PUT bytes until verified TLS.
      // An injected request binding owns its socket lifecycle, so handing it bytes is final.
      if (body === undefined || request !== httpsRequest) send();
    });
  } finally {
    if (cancel) signal.removeEventListener('abort', cancel);
    agent?.destroy();
    tunnel?.destroy();
  }
}

export function transferFile(options, dependencies = {}) {
  return runTransfer(options, dependencies, [node, curl]);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await runCli(transferFile);

import {Client} from '@modelcontextprotocol/sdk/client/index.js';
import {StdioClientTransport} from '@modelcontextprotocol/sdk/client/stdio.js';
import {Server} from '@modelcontextprotocol/sdk/server/index.js';
import {StdioServerTransport} from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListRootsRequestSchema,
  ListToolsRequestSchema
} from '@modelcontextprotocol/sdk/types.js';
import fs from 'node:fs';
import {createRequire} from 'node:module';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

import {
  composeResult,
  deliverySerializedTextBytes,
  displayedContext,
  formatObserveText
} from './browser-delivery.mjs';
import {captureRequest} from './capture-page.js';
import {inspectElements} from './inspect-elements.js';
import {deliverScreenshot} from './screenshot-delivery.mjs';
import {
  captureSelectedInlineSvgArtwork
} from './lib/inline-svg-logo-capture.js';
import {
  preserveSelectedArtwork,
  selectedArtworkProbe
} from './selected-artwork.js';

const require = createRequire(import.meta.url);
const devtoolsExecutable =
    path.join(path.dirname(require.resolve('chrome-devtools-mcp/package.json')),
              'build/src/bin/chrome-devtools-mcp.js');

// StdioClientTransport 1.30.0 also inherits its fixed OS defaults. Keep that
// same set explicit here, adding only temporary-directory discovery. The
// driver attaches to the host's browser by --ws-endpoint; it needs no browser
// launcher settings, proxy credentials, Node injection flags or API tokens.
const DRIVER_ENV_KEYS = process.platform === 'win32'
    ? ['APPDATA', 'HOMEDRIVE', 'HOMEPATH', 'LOCALAPPDATA', 'PATH',
       'PROCESSOR_ARCHITECTURE', 'SYSTEMDRIVE', 'SYSTEMROOT', 'TEMP',
       'USERNAME', 'USERPROFILE', 'PROGRAMFILES', 'TMP']
    : ['HOME', 'LOGNAME', 'PATH', 'SHELL', 'TERM', 'USER', 'TMPDIR', 'TMP', 'TEMP'];

export function nativeDriverOptions(connectUrl, environment = process.env) {
  const env = {};
  for (const key of DRIVER_ENV_KEYS) {
    const value = environment[key];
    if (typeof value === 'string' && !value.startsWith('()')) env[key] = value;
  }
  return {
    command: process.execPath,
    args: [devtoolsExecutable, `--ws-endpoint=${connectUrl}`,
           '--no-usage-statistics', '--no-performance-crux',
           '--experimental-structured-content'],
    env: {...env, CI: '1', CHROME_DEVTOOLS_MCP_NO_UPDATE_CHECKS: '1'},
    stderr: 'pipe',
  };
}

const NATIVE_REQUEST_TIMEOUT_MS = 65000;
const OPERATION_TIMEOUT_MS = Object.freeze({
  navigate : 120000,
  observe : 90000,
  reveal : 90000,
  click : 90000,
  hover : 90000,
  inspect : 65000,
  snapshot : 65000,
  evaluate : 65000,
});

function deadlineError(message = 'Browser operation deadline exceeded') {
  const error = Error(message);
  error.code = 'browser_operation_deadline';
  return error;
}

function controllerError(error) {
  const stopped = Error(error?.message || 'Native browser controller stopped');
  stopped.code = typeof error?.code === 'string' ? error.code
                                                 : 'browser_controller_stopped';
  return stopped;
}

export function remainingDeadlineMs(deadlineAt, cap = Infinity,
                                    now = performance.now()) {
  return Math.max(0, Math.min(cap, deadlineAt - now));
}

export function selectedNetworkProbeUrl(probe) {
  const supported =
      probe?.kind === 'image-resource' ||
      (probe?.kind === 'css-background-resource' &&
       probe?.status === 'captured');
  return supported && typeof probe.currentSrc === 'string'
             ? probe.currentSrc
             : '';
}

export async function captureActionResult({
  kind,
  act,
  readState,
  capture,
  settle,
  same,
  mismatchReasons,
}) {
  await act();
  let transitionDeadlineAt = kind === 'click' ? performance.now() + 3000
                                               : undefined;
  const stateStarted = performance.now();
  let state = await readState(transitionDeadlineAt);
  const stateProbeMs = performance.now() - stateStarted;
  if (kind === 'click')
    state = await settle(state, transitionDeadlineAt, stateProbeMs);
  let result = await capture(state), recaptured = false;
  if (!same(state, result.after) && kind === 'click') {
    transitionDeadlineAt = performance.now() + 3000;
    state = await settle(result.after, transitionDeadlineAt);
    result = await capture(state);
    recaptured = true;
  }
  if (!same(state, result.after))
    throw Error(`Page identity or URL changed during sequential ${kind} result capture${
        mismatchReasons ? ` (${mismatchReasons(state, result.after).join('; ')})` : ''}`);
  return {...result, recaptured};
}

export function prepareAssemblyFile(
    runRoot, scriptsDirectory = import.meta.dirname) {
  const templateCandidates = [
    // Installed release: skills/business-profile/scripts -> ../assets.
    path.resolve(scriptsDirectory, '../assets/assemble-brandkit.mjs'),
    // Source tree: src/skill-scripts/business-profile -> repository skill.
    path.resolve(scriptsDirectory,
                 '../../../skills/business-profile/assets/assemble-brandkit.mjs'),
  ];
  const template = templateCandidates.find(candidate => {
    try {
      return fs.statSync(candidate).isFile();
    } catch {
      return false;
    }
  });
  if (!template)
    throw Error('Packaged assemble-brandkit.mjs template is unavailable');
  const assemblyFile = path.join(runRoot, 'assemble-brandkit.mjs');
  let created = false;
  try {
    fs.copyFileSync(template, assemblyFile, fs.constants.COPYFILE_EXCL);
    created = true;
  } catch (error) {
    if (error?.code !== 'EEXIST')
      throw error;
  }
  if (created) {
    try {
      fs.chmodSync(assemblyFile, fs.statSync(assemblyFile).mode | 0o200);
    } catch (error) {
      fs.rmSync(assemblyFile, {force : true});
      throw error;
    }
  }
  return assemblyFile;
}

export function browserUrlIsAllowed(value, {
  allowedOrigins = [],
  allowedHosts = [],
  allowBlank = false,
} = {}) {
  let url;
  try {
    url = new URL(value);
  } catch {
    return false;
  }
  if (url.username || url.password)
    return false;
  if (url.href === 'about:blank')
    return allowBlank;
  if (!['http:', 'https:'].includes(url.protocol))
    return false;
  if (new Set(allowedOrigins).has(url.origin))
    return true;
  return !url.port &&
         [...allowedHosts ].some(host => url.hostname === host ||
                                         url.hostname.endsWith(`.${host}`));
}

// These labels are derived from the guard's raw-value comparisons. Never put
// either compared value in a retained error: saved inventories redact URLs.
export function pageStateMismatchReasons(before, after, measuredUrl) {
  const reasons = [];
  const invalid = value => {
    if (typeof value !== 'string' || !value)
      return true;
    try {
      new URL(value);
      return false;
    } catch {
      return true;
    }
  };
  if (before.identity !== after.identity)
    reasons.push(!before.identity || !after.identity
                     ? 'missing or invalid selected-page identity'
                     : 'selected-page identity mismatch');
  if (before.url !== after.url)
    reasons.push(invalid(before.url) || invalid(after.url)
                     ? 'missing or invalid page URL'
                     : 'page URL mismatch');
  // Preserve the existing optional measured-URL predicate, including its
  // treatment of empty values. An absent measured URL alone is not a rejection.
  if (measuredUrl && measuredUrl !== after.url)
    reasons.push(invalid(measuredUrl) ? 'invalid measured page URL'
                                      : 'measured page URL mismatch');
  return reasons;
}

export async function serveNativeBrowser({
  runRoot,
  openSession,
  closeSession,
}) {
  if (!path.isAbsolute(runRoot || ''))
    throw Error('runRoot must be an absolute directory');
  const OUT = fs.realpathSync(runRoot);
  if (!fs.statSync(OUT).isDirectory())
    throw Error('runRoot must be a directory');
  if (typeof openSession !== 'function' || typeof closeSession !== 'function')
    throw Error('openSession and closeSession callbacks are required');
  const assemblyFile = prepareAssemblyFile(OUT);

  const HOST = OUT;
  let seq = 0, inventorySeq = 0, deliverySeq = 0, pageId, ownedPageIdentity;
  let allowedOrigins = new Set();
  let allowedHosts = new Set();
  let client = null;
  let driverTransport = null;
  let sessionOpened = false;
  let sessionClosed = false;
  let connectionSecret = '';
  let initializationPromise = null;
  let shuttingDown = false;
  let controllerFailure = null;
  let controllerStopPromise = null;
  let activeOperation = null;

  const redact = value => {
    let text = String(value instanceof Error ? value.message : value);
    if (connectionSecret)
      text = text.replaceAll(connectionSecret, '[redacted connection]');
    return text.replace(/(?:wss?|https?):\/\/[^\s"'<>]+/g,
                        '[redacted endpoint]');
  };
  const file = n => path.join(OUT, n), publicPath = n => path.join(HOST, n);
  const save = (n, v) => fs.writeFileSync(file(n), JSON.stringify(v, null, 2));
  const loggedArgs = a =>
      Object.fromEntries(Object.entries(a || {}).map(([ k, v ]) => {
        if (k === 'function')
          return [ k, `[function ${String(v).length} chars]` ];
        if (k === 'url') {
          try {
            const u = new URL(v);
            u.username = '';
            u.password = '';
            u.search = '';
            u.hash = '';
            return [ k, u.href ];
          } catch {
            return [ k, '[invalid URL]' ];
          }
        }
        return [ k, typeof v === 'string' ? redact(v) : v ];
      }));
  const safeUrl = value => {
    if (!value)
      return null;
    try {
      const u = new URL(value);
      u.username = '';
      u.password = '';
      u.search = '';
      u.hash = '';
      return u.href;
    } catch {
      return '[unparseable URL]';
    }
  };
  function requireAllowedUrl(value, label = 'URL', {allowBlank = false} = {}) {
    const u = new URL(value);
    if (!browserUrlIsAllowed(u.href, {
          allowedOrigins,
          allowedHosts,
          allowBlank,
        }))
      throw Error(`${label} origin is not allowed`);
    return u;
  }
  const publicState = s => ({identity : s.identity, url : safeUrl(s.url)});

  async function releaseSession() {
    if (!sessionOpened || sessionClosed)
      return;
    sessionClosed = true;
    await closeSession();
  }

  function stoppedError(error = controllerFailure) {
    return controllerError(error);
  }

  function stopController(error) {
    if (!controllerFailure) {
      controllerFailure = stoppedError(error);
      activeOperation?.controller.abort(controllerFailure);
    }
    if (!controllerStopPromise) {
      const closingClient = client;
      client = null;
      controllerStopPromise = (async () => {
        await waitBounded(closingClient?.close(), 5000);
        await waitBounded(releaseSession(), 5000);
      })();
    }
    return controllerStopPromise;
  }

  async function runOperation(name, operation) {
    if (controllerFailure)
      throw stoppedError();
    const timeoutMs = OPERATION_TIMEOUT_MS[name];
    if (!timeoutMs)
      return operation(null);
    const controller = new AbortController(), context = {
      name,
      controller,
      signal : controller.signal,
      deadlineAt : performance.now() + timeoutMs,
    };
    activeOperation = context;
    let timer;
    const timeout = new Promise((_, reject) => {
      timer = setTimeout(() => {
        const error = deadlineError(`${name} exceeded its ${timeoutMs}ms operation deadline`);
        void stopController(error);
        reject(error);
      }, timeoutMs);
    });
    try {
      return await Promise.race([ operation(context), timeout ]);
    } finally {
      clearTimeout(timer);
      if (activeOperation === context)
        activeOperation = null;
    }
  }

  function normalizeAllowedOrigins(values = []) {
    if (!Array.isArray(values))
      throw Error('allowedOrigins must be an array');
    return new Set(values.map(value => {
      const url = new URL(value);
      if (!['http:', 'https:'].includes(url.protocol) || url.username ||
          url.password)
        throw Error('allowedOrigins must contain exact public HTTP(S) origins');
      return url.origin;
    }));
  }

  function normalizeAllowedHosts(values = []) {
    if (!Array.isArray(values))
      throw Error('allowedHosts must be an array');
    return new Set(values.map(value => {
      const host = String(value || '').toLowerCase().replace(/\.$/u, '');
      const parsed = new URL(`http://${host}`);
      if (!host || parsed.hostname !== host || parsed.port || parsed.username ||
          parsed.password || /[/*]/u.test(host))
        throw Error('allowedHosts must contain bare DNS hostnames');
      return host;
    }));
  }

  async function ensureSession(requestedUrl) {
    if (shuttingDown)
      throw Error('Browser server is shutting down');
    if (controllerFailure)
      throw stoppedError();
    if (client)
      return;
    if (initializationPromise)
      return initializationPromise;
    initializationPromise = (async () => {
      const session = await openSession(requestedUrl);
      sessionOpened = true;
      if (shuttingDown || controllerFailure) {
        await waitBounded(releaseSession(), 5000);
        throw controllerFailure ? stoppedError()
                                : Error('Browser server shut down during session creation');
      }
      if (!session || typeof session.connectUrl !== 'string' ||
          !session.connectUrl)
        throw Error('openSession did not return connectUrl');
      connectionSecret = session.connectUrl;
      allowedOrigins = normalizeAllowedOrigins(session.allowedOrigins);
      allowedHosts = normalizeAllowedHosts(session.allowedHosts);
      if (!allowedOrigins.size && !allowedHosts.size)
        throw Error('openSession must return allowedOrigins or allowedHosts');
      requireAllowedUrl(requestedUrl, 'Navigation URL');

      const initializingClient = new Client(
          {name : 'brandkit-native-browser', version : '1'},
          {capabilities : {roots : {listChanged : true}}});
      client = initializingClient;
      initializingClient.setRequestHandler(
          ListRootsRequestSchema,
          async () => ({
            roots : [
              {uri : pathToFileURL(OUT).href, name : 'Brand Kit run artifacts'}
            ]
          }));
      driverTransport = new StdioClientTransport(nativeDriverOptions(session.connectUrl));
      driverTransport.stderr?.on(
          'data', data => fs.appendFileSync(file('driver.log'), redact(data)));
      const connectMs = remainingDeadlineMs(
          activeOperation?.deadlineAt ?? performance.now(),
          NATIVE_REQUEST_TIMEOUT_MS);
      if (!connectMs)
        throw deadlineError('navigate initialization deadline exceeded');
      await initializingClient.connect(driverTransport, {
        timeout : connectMs,
        maxTotalTimeout : connectMs,
        signal : activeOperation?.signal,
      });
      if (shuttingDown || controllerFailure) {
        await waitBounded(initializingClient.close(), 5000);
        if (client === initializingClient)
          client = null;
        await waitBounded(releaseSession(), 5000);
        throw controllerFailure ? stoppedError()
                                : Error('Browser server shut down during driver connection');
      }
      const requestMs = remainingDeadlineMs(
          activeOperation?.deadlineAt ?? performance.now(),
          NATIVE_REQUEST_TIMEOUT_MS);
      if (!requestMs)
        throw deadlineError('navigate initialization deadline exceeded');
      try {
        save('native-tools.json', await initializingClient.listTools({}, {
          timeout : requestMs,
          maxTotalTimeout : requestMs,
          signal : activeOperation?.signal,
        }));
      } catch (error) {
        if (!shuttingDown)
          void stopController(error);
        throw stoppedError(error);
      }
      await pageState({allowBlank : true});
    })();
    try {
      await initializationPromise;
    } catch (error) {
      if (sessionOpened && !shuttingDown && !controllerFailure)
        await stopController(error);
      if (client) {
        try {
          await waitBounded(client.close(), 5000);
        } catch {
          // Preserve the initialization error while still releasing the host.
        }
      }
      client = null;
      await waitBounded(releaseSession(), 5000);
      throw controllerFailure ? stoppedError() : error;
    } finally {
      initializationPromise = null;
    }
  }
  function checkedNativeResult(result, beforeError) {
    beforeError?.(result);
    if (result?.isError)
      throw Error((result.content || [])
                      .filter(x => x.type === 'text')
                      .map(x => x.text)
                      .join('\n'));
    return result;
  }
  async function native(name, a, beforeError, requestDeadlineAt) {
    if (shuttingDown)
      throw Error('Browser server is shutting down');
    if (controllerFailure)
      throw stoppedError();
    if (!client)
      throw Error('Navigate first to open the browser session');
    const deadlineAt = Math.min(activeOperation?.deadlineAt ?? Infinity,
                                requestDeadlineAt ?? Infinity);
    const timeoutMs = remainingDeadlineMs(deadlineAt,
                                          NATIVE_REQUEST_TIMEOUT_MS);
    if (!timeoutMs)
      throw deadlineError('Native browser request deadline exceeded');
    const start = Date.now();
    let r;
    try {
      r = await client.callTool({name, arguments : a}, undefined,
                                {
                                  timeout : timeoutMs,
                                  maxTotalTimeout : timeoutMs,
                                  signal : activeOperation?.signal,
                                });
      return checkedNativeResult(r, beforeError);
    } catch (error) {
      if (!r && !shuttingDown) {
        void stopController(error);
        throw stoppedError(error);
      }
      throw error;
    } finally {
      fs.appendFileSync(file('browser-calls.jsonl'), JSON.stringify({
        at : new Date(start).toISOString(),
        name,
        arguments : loggedArgs(a),
        seconds : (Date.now() - start) / 1000,
        isError : !r || Boolean(r.isError)
      }) + '\n');
    }
  }
  function sanitizedNativeInventoryEnvelope(result, sanitize) {
    const bounded = (value, limit) => {
      const text = String(value ?? '');
      return text.length <= limit ? text
                                  : `${text.slice(0, limit)}\n[truncated ${
                                        text.length - limit} chars]`;
    };
    const shape = value => {
      const text = String(value ?? ''), lines = text.split('\n'),
            summary = {chars : text.length, lines : lines.length};
      try {
        const envelope = JSON.parse(text);
        if (envelope && !Array.isArray(envelope) &&
            typeof envelope === 'object') {
          summary.jsonEnvelopeKeys = Object.keys(envelope).slice(0, 30).map(
              key => bounded(sanitize(key), 80));
          if (typeof envelope.result === 'string') {
            const resultLines = envelope.result.split('\n');
            summary.resultChars = envelope.result.length;
            summary.resultLines = resultLines.length;
            summary.resultTabRowPrefixes =
                resultLines.filter(line => /^- \d+:/.test(line)).length;
          }
        }
      } catch {
        summary.observedSectionLabels =
            lines.filter(line => /^#{1,6} [A-Za-z][A-Za-z ]{0,60}$/.test(line))
                .slice(0, 30);
      }
      return summary;
    };
    const content =
        (result?.content || [])
            .slice(0, 20)
            .map(
                block =>
                    block?.type === 'text'
                        ? {
                            type : 'text',
                            text : bounded(sanitize(block.text), 12000),
                            shape : shape(block.text),
                            redactionIsLossy : true
                          }
                        : {
                            type :
                                typeof block?.type === 'string' ? block.type : 'unknown',
                            omitted : true
                          });
    let structuredContent;
    if (result?.structuredContent !== undefined) {
      try {
        structuredContent =
            bounded(sanitize(JSON.stringify(result.structuredContent)), 12000);
      } catch {
        structuredContent = '[unserializable structuredContent]';
      }
    }
    return {
      isError : Boolean(result?.isError),
      content,
      ...(structuredContent === undefined ? {} : {structuredContent})
    };
  }
  function retainNativeInventoryEnvelope(result) {
    save(`native-page-inventory-${++inventorySeq}.json`, {
      capturedAt : new Date().toISOString(),
      backend : 'devtools',
      tool : 'list_pages',
      ...sanitizedNativeInventoryEnvelope(result, redact)
    });
  }
  function devtoolsPagesFromNativeResult(result) {
    const pages = result?.structuredContent?.pages;
    if (!Array.isArray(pages))
      throw Error('DevTools page inventory lacks structured pages');
    return pages.map(page => {
      if (!Number.isInteger(page?.id) || page.id < 0 ||
          typeof page.url !== 'string' || typeof page.selected !== 'boolean')
        throw Error('Malformed structured DevTools page');
      return {
        id : page.id,
        url : page.url,
        title : typeof page.title === 'string' ? page.title : '',
        selected : page.selected
      };
    });
  }
  function selectOwnedPage(pages, expectedIdentity) {
    if (pages.length !== 1)
      throw Error(`Expected exactly one owned page; found ${pages.length}`);
    const page = pages[0];
    if (!page.selected)
      throw Error('The only owned page is not the native current page');
    const identity = `devtools:${page.id}`;
    if (expectedIdentity && identity !== expectedIdentity)
      throw Error(`Owned page identity changed from ${expectedIdentity} to ${
          identity}`);
    return {identity, url : page.url, id : page.id};
  }
  async function pageState({allowBlank = false, requestDeadlineAt} = {}) {
    const result =
        await native('list_pages', {}, retainNativeInventoryEnvelope,
                     requestDeadlineAt);
    const pages = devtoolsPagesFromNativeResult(result);
    const state = selectOwnedPage(pages, ownedPageIdentity);
    ownedPageIdentity ??= state.identity;
    pageId = state.id;
    requireAllowedUrl(state.url, 'Owned page URL', {allowBlank});
    return {identity : state.identity, url : state.url};
  }
  function parseOutput(raw) {
    try {
      return JSON.parse(raw)
    } catch {
      const m = raw.match(/```(?:json)?\n([\s\S]*?)\n```/);
      if (m)
        return JSON.parse(m[1]);
      throw Error('Unrecognized evaluation file; no evidence returned');
    }
  }
  async function evaluate(fn, name, ref, serialized = false,
                          requestDeadlineAt) {
    const n = `${name}-${++seq}.json`;
    await native('evaluate_script', {
      pageId,
      function : fn,
      ...(ref ? {args : [ ref ]} : {}),
      filePath : file(n),
      waitForStableDom : false
    }, undefined, requestDeadlineAt);
    let v = parseOutput(fs.readFileSync(file(n), 'utf8'));
    save(n, v);
    return {value : v, path : publicPath(n)};
  }
  async function snapshot() {
    const n = `snapshot-${++seq}.txt`;
    await native('take_snapshot', {pageId, filePath : file(n)});
    return {text : fs.readFileSync(file(n), 'utf8'), path : publicPath(n)};
  }
  async function screenshot(ref) {
    const n = `image-${++seq}.png`;
    await native('take_screenshot', {
      pageId,
      filePath : file(n),
      format : 'png',
      ...(ref ? {uid : ref} : {})
    });
    return deliverScreenshot(file(n), {
      signal : activeOperation?.signal,
      deadlineAt : activeOperation?.deadlineAt,
    });
  }
  function requireBareRef(ref) {
    if (typeof ref !== 'string' || !ref.trim())
      throw Error(
          'Malformed ref: pass the bare CURRENT snapshot ref, such as "1_394".');
    if (/^\s*(?:uid|ref)\s*=/i.test(ref))
      throw Error(
          'Malformed ref syntax: pass the bare CURRENT snapshot ref "1_394", without the "uid=" or "ref=" label. This is a syntax error, not a stale-reference error.');
    return ref;
  }
  const text = v => ({type : 'text', text : JSON.stringify(v)});
  function localInspection(el) {
    const root = el.nodeType === Node.TEXT_NODE ? el.parentElement : el;
    const compact = s => String(s || '').replace(/\s+/g, ' ').trim();
    return {
      tag : root.localName,
      text : compact(root.innerText),
      links : [
        ...(root.matches('a[href]') ? [ root ] : []),
        ...root.querySelectorAll('a[href]')
      ].map(a => ({text : compact(a.innerText), href : a.href})),
      images : [
        ...(root.matches('img') ? [ root ] : []),
        ...root.querySelectorAll('img')
      ].map(i => ({
              src : i.currentSrc || i.src,
              alt : i.alt,
              naturalWidth : i.naturalWidth,
              naturalHeight : i.naturalHeight
            })),
      enclosingText : compact(root.parentElement?.innerText),
      enclosingTag : root.parentElement?.localName
    };
  }

  function selectedViewportCoverage(measurement, page) {
    const root = measurement?.selections?.[0]?.root, box = root?.box,
          intersection = root?.visualGeometry?.intersection,
          viewport = page?.viewport;
    const finite = [
      box?.x, box?.y, box?.width, box?.height, viewport?.width, viewport?.height
    ].every(Number.isFinite);
    const oversized =
        finite && (box.width > viewport.width || box.height > viewport.height);
    const entirelyInside = finite && box.x >= 0 && box.y >= 0 &&
                           box.x + box.width <= viewport.width &&
                           box.y + box.height <= viewport.height;
    return {
      basis :
          'reported root geometry versus the viewport after reveal; this is not a visibility or readability certificate',
      viewport : viewport || null,
      rootBox : box || null,
      reportedIntersection : intersection || null,
      oversizedForViewport : finite ? oversized : null,
      entirelyWithinViewportByGeometry : finite ? entirelyInside : null,
      note :
          oversized
              ? 'The selected root is larger than one viewport. The delivered original viewport image can corroborate only the visible portion; reveal a narrower current ref or another view if a consequential claim needs more context.'
              : 'Inspect the delivered original viewport image before making consequential visual claims.'
    };
  }
  function sameState(before, after, measuredUrl) {
    return pageStateMismatchReasons(before, after, measuredUrl).length === 0;
  }
  function stateChangeError(message, before, after, measuredUrl) {
    return Error(`${message} (${pageStateMismatchReasons(
        before, after, measuredUrl).join('; ')})`);
  }

  async function selectedNetworkResource(probe) {
    const selectedUrl = selectedNetworkProbeUrl(probe);
    let url;
    let requestedFile = '';
    try {
      url = new URL(selectedUrl);
    } catch {
      return null;
    }
    if (!['http:', 'https:'].includes(url.protocol))
      return null;

    try {
      const listed = await native('list_network_requests', {
        pageId,
        pageSize : 500,
        pageIdx : 0,
        resourceTypes : [ 'image' ],
        includePreservedRequests : false
      });
      const requests = listed?.structuredContent?.networkRequests;
      if (!Array.isArray(requests))
        return {
          status : 'unavailable',
          url : selectedUrl,
          reason : 'network-list-shape'
        };
      const matches = requests.filter(
          request => request?.url === selectedUrl &&
                     Number.isInteger(request?.requestId) &&
                     /^2\d\d$/u.test(String(request?.status || '')));
      const request = matches.at(-1);
      if (!request)
        return {
          status : 'unavailable',
          url : selectedUrl,
          reason : 'response-not-retained'
        };

      requestedFile = file(`selected-network-${++seq}.network-response`);
      const detailed = await native('get_network_request', {
        pageId,
        reqid : request.requestId,
        responseFilePath : requestedFile
      });
      const response = detailed?.structuredContent?.networkRequest;
      if (response?.url !== selectedUrl ||
          !/^2\d\d$/u.test(String(response?.status || '')))
        return {
          status : 'unavailable',
          url : selectedUrl,
          reason : 'response-mismatch'
        };
      const responseFile = response.responseBodyFilePath;
      if (typeof responseFile !== 'string')
        return {
          status : 'unavailable',
          url : selectedUrl,
          reason : 'response-body-unavailable'
        };
      const resolved = path.resolve(responseFile);
      if (resolved !== requestedFile ||
          !resolved.startsWith(`${OUT}${path.sep}`))
        return {
          status : 'unavailable',
          url : selectedUrl,
          reason : 'response-path-mismatch'
        };
      const size = fs.statSync(resolved).size;
      if (size > 256 * 1024) {
        fs.rmSync(resolved, {force : true});
        return {
          status : 'unavailable',
          url : selectedUrl,
          reason : 'body-over-cap'
        };
      }
      const headers = response.responseHeaders || {};
      const contentType =
          Object.entries(headers)
              .find(([ name ]) => name.toLowerCase() === 'content-type')
              ?.[1] ||
          '';
      const buffer = fs.readFileSync(resolved);
      fs.rmSync(resolved, {force : true});
      return {
        status : 'captured',
        url : selectedUrl,
        contentType : String(contentType).split(';', 1)[0].trim(),
        buffer
      };
    } catch {
      return {
        status : 'unavailable',
        url : selectedUrl,
        reason : 'response-read-failed'
      };
    } finally {
      if (requestedFile)
        fs.rmSync(requestedFile, {force : true});
    }
  }
  async function prepareSelectedRegion(root, deadlineMs = 1500) {
    if (!root?.isConnected)
      throw Error('Selected target is no longer connected');
    const boundedDeadline = Math.min(
              Math.max(Number.isFinite(deadlineMs) ? deadlineMs : 0, 0), 2000),
          requiredStableMs = 200, started = Date.now();
    const state =
        () => [...(root.matches('img') ? [ root ] : []),
               ...root.querySelectorAll('img')]
                  .map(image => ({
                         src : image.src || null,
                         currentSrc : image.currentSrc || null,
                         complete : Boolean(image.complete),
                         naturalWidth : Number.isFinite(image.naturalWidth)
                                            ? image.naturalWidth
                                            : null,
                         naturalHeight : Number.isFinite(image.naturalHeight)
                                             ? image.naturalHeight
                                             : null,
                       }));
    const pending = images =>
        images
            .filter(image => !(image.complete && image.naturalWidth > 0 &&
                               image.naturalHeight > 0))
            .length;
    root.scrollIntoView(
        {block : 'center', inline : 'nearest', behavior : 'instant'});
    let images = state(), initialPendingImageCount = pending(images);
    let sourceStable = images.length === 0,
        stableSince = sourceStable ? started : null,
        lastKey = JSON.stringify(images);
    if (images.length > 0 && boundedDeadline > 0) {
      const remaining = () =>
          Math.max(0, boundedDeadline - (Date.now() - started));
      while (remaining() > 0) {
        await new Promise(resolve =>
                              setTimeout(resolve, Math.min(40, remaining())));
        if (!root.isConnected)
          throw Error('Selected target became disconnected during readiness');
        images = state();
        const key = JSON.stringify(images), now = Date.now();
        if (pending(images) > 0) {
          stableSince = null;
          sourceStable = false;
        } else if (key !== lastKey) {
          stableSince = now;
          sourceStable = false;
        } else {
          stableSince ??= now;
          sourceStable = now - stableSince >= requiredStableMs;
        }
        lastKey = key;
        if (sourceStable)
          break;
      }
    }
    if (!root.isConnected)
      throw Error('Selected target became disconnected during readiness');
    const completed = Date.now(), pendingImageCount = pending(images),
          elapsedMs = completed - started,
          stableForMs = stableSince === null ? 0 : completed - stableSince;
    return {
      status : pendingImageCount === 0 && sourceStable ? 'ready'
                                                       : 'partial-deadline',
      deadlineMs : boundedDeadline,
      elapsedMs,
      scrolledIntoView : true,
      imageCount : images.length,
      initialPendingImageCount,
      pendingImageCount,
      sourceStable,
      requiredStableMs : images.length ? requiredStableMs : 0,
      stableForMs,
      images,
      note :
          'A bounded image-source stability window and intrinsic dimensions do not establish that a product photograph painted correctly; inspect the original viewport image returned by reveal.'
    };
  }
  async function inspect(ref) {
    const before = await pageState();
    const fn = `(el)=>{const root=el.nodeType===Node.TEXT_NODE?el.parentElement:el;return {measurement:(${
        inspectElements.toString()})(null,root),context:(${
        localInspection.toString()})(root),artworkProbe:(${
        selectedArtworkProbe.toString()})(root,(${
        captureSelectedInlineSvgArtwork
            .toString()})),page:{url:location.href,title:document.title,viewport:{width:innerWidth,height:innerHeight,devicePixelRatio},scroll:{x:scrollX,y:scrollY},capturedAt:new Date().toISOString()}}}`;
    const result = await evaluate(fn, 'selected', ref, true);
    if (!result.value?.measurement?.selections?.length)
      throw Error('Invalid selected measurement');
    const artworkProbe = result.value.artworkProbe;
    const artwork = await preserveSelectedArtwork(artworkProbe, {
      runRoot : OUT,
      selectionFile : path.basename(result.path),
      networkResource : await selectedNetworkResource(artworkProbe)
    });
    delete result.value.artworkProbe;
    if (artwork)
      result.value.artwork = artwork;
    save(path.basename(result.path), result.value);
    const after = await pageState(), measuredUrl = result.value.measurement.url;
    if (!sameState(before, after, measuredUrl))
      throw stateChangeError(
          'Page identity or URL changed during sequential selected capture',
          before, after, measuredUrl);
    return {
      content : [ text({
        ref,
        file : result.path,
        state : {
          atomic : false,
          consistencyChecked : 'page identity and URL only',
          sequence : [ 'current-state measurements and context' ],
          hostRequestedMovement : false,
          imageCaptured : false,
          before : publicState(before),
          after : publicState(after),
          measuredUrl : safeUrl(measuredUrl),
          measurementCapturedAt : result.value.page.capturedAt,
          title : redact(result.value.page.title),
          viewport : result.value.page.viewport,
          scroll : result.value.page.scroll
        },
        measurement : result.value.measurement,
        context : displayedContext(result.value.context),
        ...(artwork ? {artwork} : {})
      }) ]
    };
  }
  async function reveal(ref) {
    const before = await pageState();
    const fn = `async (el)=>{const root=el.nodeType===Node.TEXT_NODE?el.parentElement:el;const readiness=await (${
        prepareSelectedRegion
            .toString()})(root,1500);return {readiness,measurement:(${
        inspectElements.toString()})(null,root),context:(${
        localInspection.toString()})(root),artworkProbe:(${
        selectedArtworkProbe.toString()})(root,(${
        captureSelectedInlineSvgArtwork
            .toString()})),page:{url:location.href,title:document.title,viewport:{width:innerWidth,height:innerHeight,devicePixelRatio},scroll:{x:scrollX,y:scrollY},capturedAt:new Date().toISOString()}}}`;
    const result = await evaluate(fn, 'revealed', ref, true);
    if (!result.value?.measurement?.selections?.length)
      throw Error('Invalid revealed measurement');
    const artworkProbe = result.value.artworkProbe;
    const artwork = await preserveSelectedArtwork(artworkProbe, {
      runRoot : OUT,
      selectionFile : path.basename(result.path),
      networkResource : await selectedNetworkResource(artworkProbe)
    });
    delete result.value.artworkProbe;
    if (artwork)
      result.value.artwork = artwork;
    save(path.basename(result.path), result.value);
    const snap = await snapshot(), refsCapturedAt = new Date().toISOString(),
          shot = await screenshot(),
          imageCompletedAt = new Date().toISOString();
    const after = await pageState(), measuredUrl = result.value.measurement.url;
    if (!sameState(before, after, measuredUrl))
      throw stateChangeError(
          'Page identity or URL changed during sequential reveal', before,
          after, measuredUrl);
    return {
      content : [
        text({
          ref,
          file : result.path,
          snapshotFile : snap.path,
          image : shot.path,
          state : {
            atomic : false,
            consistencyChecked : 'page identity and URL only',
            sequence : [
              'scroll and bounded target readiness',
              'selected-root measurements and context',
              'current native snapshot refs', 'original viewport image'
            ],
            before : publicState(before),
            after : publicState(after),
            measuredUrl : safeUrl(measuredUrl),
            measurementCapturedAt : result.value.page.capturedAt,
            refsCapturedAt,
            imageCompletedAt,
            title : redact(result.value.page.title),
            viewport : result.value.page.viewport,
            scroll : result.value.page.scroll
          },
          readiness : result.value.readiness,
          viewportCoverage : selectedViewportCoverage(result.value.measurement,
                                                      result.value.page),
          measurement : result.value.measurement,
          context : displayedContext(result.value.context),
          ...(artwork ? {artwork} : {}),
          refScopes : {
            requestedRef :
                'current native snapshot ref used for this reveal only',
            returnedSnapshot :
                'contains fresh actionable native refs for the resulting state',
            pageCaptureOwnerIds :
                'capture-local source identifiers in observe capture files; not actionable native refs'
          }
        }),
        {type : 'text', text : snap.text}, shot.block
      ]
    };
  }
  async function settleOwnedPage(initialState, until, initialProbeMs = 0) {
    let state = initialState, stableSamples = 0,
        maxProbeMs = initialProbeMs;
    while (remainingDeadlineMs(until) >= Math.max(50, 2 * maxProbeMs)) {
      const beforePauseMs = remainingDeadlineMs(until);
      if (beforePauseMs < Math.min(300, beforePauseMs) +
                              Math.max(50, 2 * maxProbeMs))
        break;
      await new Promise(resolve => setTimeout(
                            resolve, Math.min(300, beforePauseMs)));
      if (remainingDeadlineMs(until) < Math.max(50, 2 * maxProbeMs))
        break;
      const probeStarted = performance.now();
      const next = await pageState({requestDeadlineAt : until});
      maxProbeMs = Math.max(maxProbeMs, performance.now() - probeStarted);
      stableSamples = sameState(state, next) ? stableSamples + 1 : 0;
      state = next;
      if (stableSamples >= 2)
        break;
    }
    return state;
  }
  async function observe(navigation = null) {
    const before = await pageState(), snap = await snapshot(),
          shot = await screenshot(),
          c = await evaluate(captureRequest().function, 'capture', undefined,
                             true),
          v = c.value;
    if (!v || !Array.isArray(v.elements) || !Array.isArray(v.styles) ||
        !Array.isArray(v.textOwners) || !Array.isArray(v.groups) || !v.counts)
      throw Error('Malformed capture shape');
    const after = await pageState();
    if (!sameState(before, after, v.page?.url))
      throw stateChangeError(
          'Page identity or URL changed during sequential page capture', before,
          after, v.page?.url);
    const acceptedNavigation = navigation ?
        {...navigation, actualUrl : after.url} : null;
    if (acceptedNavigation) {
      const sessionMetadata = path.join(OUT, 'browser-session.json');
      if (!fs.existsSync(sessionMetadata)) {
        const temporary = `${sessionMetadata}.${process.pid}.tmp`;
        fs.writeFileSync(temporary, JSON.stringify({
          requestedUrl : acceptedNavigation.requestedUrl,
          landedUrl : after.url,
          createdAt : new Date().toISOString()
        }, null, 2) + '\n');
        fs.renameSync(temporary, sessionMetadata);
      }
    }
    const readiness = {
      status : 'unverified',
      settled : null,
      note :
          'No page-level stability or font-readiness polling was performed. The capture reports current document and image facts only.'
    };
    const formatted = formatObserveText({
      runRoot : OUT,
      assemblyFile,
      ...(acceptedNavigation ? {navigation : acceptedNavigation} : {}),
      captureFile : c.path,
      snapshotFile : snap.path,
      image : shot.path,
      state : {
        atomic : false,
        consistencyChecked : 'page identity and URL only',
        sequence : [ 'native snapshot', 'viewport image', 'page measurements' ],
        before : publicState(before),
        after : publicState(after),
        capturedAt : v.page?.capturedAt
      },
      readiness,
      page : v.page,
      counts : v.counts,
      incomplete : v.incomplete
    },
                                        v, snap.text);
    return {
      content : [
        {type : 'text', text : formatted.metadataText},
        {type : 'text', text : formatted.snapshotText}, shot.block
      ]
    };
  }
  const properties = {
    type : 'object',
    properties : {},
    additionalProperties : false
  };
  const
      tools =
          [
            {
              name : 'navigate',
              description :
                  'Navigate the owned browser to a public URL, returning current state, native refs, bounded preview, actual viewport image, and DOM/style measurements at captureFile. Readiness is unverified. A large snapshot may be an explicitly incomplete inline navigation view; use its full file for concrete omitted context.',
              inputSchema : {
                ...properties,
                properties : {url : {type : 'string'}},
                required : [ 'url' ]
              }
            },
            {
              name : 'observe',
              description :
                  'Capture broad current page evidence for a concrete missing or changed observation: a bounded native snapshot excerpt, actual viewport image and exact source-owned measurements at captureFile. It is not required after every click. Page stability and font readiness are unverified. The response reports exact inline treatment and snapshot omissions; the untouched full snapshot remains at snapshotFile for a concrete missing ref or context. No clicks or automatic role selection.',
              inputSchema : properties
            },
            {
              name : 'reveal',
              description :
                  'Deliberately reveal one exact CURRENT native snapshot ref. Pass only the bare ref, for example "1_394". This returns selected-root measurements/context, fresh current refs or their explicitly incomplete navigation view, the full snapshot path, and the original viewport image. Oversized coverage is not a visibility certificate. No semantic role is selected.',
              inputSchema : {
                ...properties,
                properties : {ref : {type : 'string'}},
                required : [ 'ref' ]
              }
            },
            {
              name : 'inspect',
              description :
                  'Measure one exact CURRENT native snapshot ref in the current state. Pass only the bare ref, for example "1_394". This host requests no scrolling or readiness wait and captures no image. It returns the existing complete selected-root/text-owner measurement envelope and context accepted by readSelection. Use reveal when the view must deliberately change or visual corroboration is needed. No semantic role is selected.',
              inputSchema : {
                ...properties,
                properties : {ref : {type : 'string'}},
                required : [ 'ref' ]
              }
            },
            {
              name : 'click',
              description :
                  'Click an agent-selected CURRENT native reference once and return a current snapshot and image, not new DOM/style measurements. Inspect the result first; measure again only for a relevant changed or missing fact, using its current refs. Pass the bare ref such as "1_394", without the "uid=" or "ref=" label. A malformed label is a syntax error; a bare ref rejected by the native tool may be stale. Do not replay an uncertain click; a terminal controller error stops the run. No automatic consent selection.',
              inputSchema : {
                ...properties,
                properties : {ref : {type : 'string'}},
                required : [ 'ref' ]
              }
            },
            {
              name : 'hover',
              description :
                  'Move the real native pointer to one agent-selected CURRENT card or control target. Pass the bare ref such as "1_394", without the "uid=" or "ref=" label. Returns snapshot and image of the resulting state, not new DOM/style measurements. No automatic traversal; inspect a revealed control afterward.',
              inputSchema : {
                ...properties,
                properties : {ref : {type : 'string'}},
                required : [ 'ref' ]
              }
            },
            {
              name : 'snapshot',
              description :
                  'Read current native refs without repeating full DOM capture. Large results return an explicitly incomplete navigation view plus the full same-run snapshot path.',
              inputSchema : properties
            },
            {
              name : 'evaluate',
              description : 'Run a focused JSON-compatible JavaScript function through the active native backend for a genuine missing fact or current target. When ref is supplied, pass its bare value such as "1_394", without the "uid=" or "ref=" label. Use inspect for ordinary styles. This ordinary native operation is not restricted to side-effect-free JavaScript and does not run another model.',
              inputSchema : {
                ...properties,
                properties :
                    {function : {type : 'string'}, ref : {type : 'string'}},
                required : [ 'function' ]
              }
            }
          ];
  async function handle(name, a) {
    if (shuttingDown)
      throw Error('Browser server is shutting down');
    if (name === 'navigate') {
      const requested = new URL(a.url);
      if (!['http:', 'https:'].includes(requested.protocol) ||
          requested.username || requested.password)
        throw Error(
            'Navigation URL must be public HTTP(S) without credentials');
      await ensureSession(requested.href);
      const u = requireAllowedUrl(requested.href, 'Navigation URL');
      const before = await pageState({allowBlank : true});
      await native('navigate_page',
                   {pageId, type : 'url', url : u.href, timeout : 30000});
      const state = await pageState();
      if (state.url)
        requireAllowedUrl(state.url, 'Final page URL');
      return observe({
        runRoot : OUT,
        requestedUrl : u.href,
        before : publicState(before)
      });
    }
    if (name === 'observe')
      return observe();
    if (name === 'reveal')
      return reveal(requireBareRef(a.ref));
    if (name === 'inspect')
      return inspect(requireBareRef(a.ref));
    if (name === 'snapshot') {
      const before = await pageState(), s = await snapshot(),
            after = await pageState();
      if (!sameState(before, after))
        throw stateChangeError('Snapshot page state changed during capture',
                               before, after);
      return {
        content : [
          text({
            state : {before : publicState(before), after : publicState(after)},
            snapshotFile : s.path
          }),
          {type : 'text', text : s.text}
        ]
      };
    }
    if (name === 'click' || name === 'hover') {
      const ref = requireBareRef(a.ref), before = await pageState();
      const captureResult = async state => {
        const s = await snapshot(), im = await screenshot(),
              after = await pageState();
        return {state, s, im, after};
      };
      const {s, im, after, recaptured} = await captureActionResult({
        kind : name,
        act : () => native(name, {pageId, uid : ref}),
        readState : async requestDeadlineAt => {
          const state = await pageState({requestDeadlineAt});
          if (state.url)
            requireAllowedUrl(
                state.url, `${name === 'click' ? 'Clicked' : 'Hovered'} page URL`);
          return state;
        },
        capture : captureResult,
        settle : (state, deadlineAt, initialProbeMs) =>
            settleOwnedPage(state, deadlineAt, initialProbeMs),
        same : sameState,
        mismatchReasons : pageStateMismatchReasons,
      });
      return {
        content : [
          text({
            state : {
              atomic : false,
              consistencyChecked : 'page identity and URL only',
              sequence : [ 'native snapshot', 'viewport image' ],
              ...(recaptured ? {recapturedAfterNavigation : true} : {}),
              before : publicState(before),
              after : publicState(after)
            },
            snapshotFile : s.path,
            image : im.path
          }),
          {type : 'text', text : s.text}, im.block
        ]
      };
    }
    if (name === 'evaluate') {
      const ref = a.ref === undefined ? undefined : requireBareRef(a.ref),
            before = await pageState(),
            r = await evaluate(a.function, 'focused', ref),
            after = await pageState();
      if (!sameState(before, after))
        throw stateChangeError('Focused evaluation changed the owned page state',
                               before, after);
      return {
        content : [ text({
          file : r.path,
          state : {before : publicState(before), after : publicState(after)},
          value : r.value
        }) ]
      };
    }
    throw Error('Unknown host tool');
  }
  const server = new Server({name : 'brandkit-browser', version : '0.1.0'},
                            {capabilities : {tools : {}}});
  server.setRequestHandler(ListToolsRequestSchema, async () => ({tools}));
  function retainDeliveryResult(result, operation) {
    const n = `delivery-source-${++deliverySeq}-${
        String(operation).replace(/[^a-z0-9_-]+/giu, '-')}.json`;
    save(n, result);
    return publicPath(n);
  }
  function safeHostError(error) {
    const envelope = {error : redact(error)};
    if (typeof error?.code === 'string' &&
        /^[a-z][a-z0-9_]{0,63}$/u.test(error.code))
      envelope.code = error.code;
    if (typeof error?.host === 'string' && error.host.length <= 253 &&
        /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)(?:\.(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?))*$/iu
            .test(error.host))
      envelope.host = error.host.toLowerCase();
    if (Number.isInteger(error?.status) && error.status >= 400 &&
        error.status <= 599)
      envelope.status = error.status;
    return envelope;
  }
  let queue = Promise.resolve();
  server.setRequestHandler(CallToolRequestSchema, request => {
    const work = queue.then(async () => {
      const start = Date.now(), operation = {
        name : request.params.name,
        focusRefs : [ request.params.arguments?.ref ].filter(Boolean)
      };
      let result;
      try {
        result = await runOperation(
            request.params.name,
            () => handle(request.params.name, request.params.arguments || {}));
      } catch (e) {
        result = {isError : true, content : [ text(safeHostError(e)) ]};
      }
      try {
        result = composeResult(
            result, operation,
            full => retainDeliveryResult(full, request.params.name));
      } catch (e) {
        const undeliveredFile = retainDeliveryResult(
                  result, `${request.params.name}-undelivered`),
              failure = {
                isError : true,
                content : [ text({
                  error : 'Host response delivery failed',
                  detail : redact(e),
                  undeliveredResultFile : undeliveredFile
                }) ]
              };
        result =
            composeResult(failure, operation,
                          full => retainDeliveryResult(
                              full, `${request.params.name}-delivery-error`));
      }
      try {
        return result;
      } finally {
        const images =
            (result?.content || []).filter(x => x.type === 'image').length;
        fs.appendFileSync(file('host-calls.jsonl'), JSON.stringify({
          at : new Date(start).toISOString(),
          tool : request.params.name,
          args : loggedArgs(request.params.arguments),
          seconds : (Date.now() - start) / 1000,
          isError : result?.isError || false,
          imagesDelivered : images,
          serializedTextBytes : deliverySerializedTextBytes(result)
        }) + '\n');
      }
    });
    queue = work.catch(() => {});
    return work;
  });
  const serverTransport = new StdioServerTransport();
  let finishLifetime;
  const lifetime = new Promise(resolve => { finishLifetime = resolve; });
  async function waitBounded(promise, timeoutMs = 5000) {
    if (!promise)
      return;
    let timer;
    await Promise.race([
      Promise.resolve(promise).catch(() => {}),
      new Promise(resolve => { timer = setTimeout(resolve, timeoutMs); })
    ]);
    clearTimeout(timer);
  }
  async function shutdown() {
    if (shuttingDown)
      return;
    shuttingDown = true;
    activeOperation?.controller.abort(Error('Browser server is shutting down'));
    try {
      // A consumed SIGTERM does not close inherited stdio. Closing the MCP
      // server removes its data listener and pauses stdin, so the process can
      // finish even when the parent deliberately keeps the pipe open.
      await waitBounded(server.close(), 5000);
      await waitBounded(client?.close(), 5000);
      await waitBounded(
          Promise.allSettled([ initializationPromise, queue ].filter(Boolean)));
    } finally {
      client = null;
      try {
        await waitBounded(releaseSession(), 5000);
      } finally {
        finishLifetime();
      }
    }
  }
  const onSignal = () => { void shutdown(); };
  process.once('SIGTERM', onSignal);
  process.once('SIGINT', onSignal);
  process.stdin.once('end', onSignal);
  process.stdin.once('error', onSignal);
  try {
    await server.connect(serverTransport);
    await lifetime;
  } catch (error) {
    await shutdown();
    throw Error(redact(error));
  } finally {
    process.removeListener('SIGTERM', onSignal);
    process.removeListener('SIGINT', onSignal);
    process.stdin.removeListener('end', onSignal);
    process.stdin.removeListener('error', onSignal);
  }
}

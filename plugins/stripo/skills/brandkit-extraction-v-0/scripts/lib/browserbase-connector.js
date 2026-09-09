// Browserbase connector — managed remote Chromium over CDP.
//
// Background reading:
//   - docs/plans/browserbase-integration-plan.md
//   - docs/research/browserbase-cloudflare-evasion.md
//
// Purpose: provide a single small surface that openPage() in lib.js can
// branch onto when running on a datacenter IP that Cloudflare blocks.
// A REAL BROWSERBASE_API_KEY selects direct mode; BRANDKIT_BROWSERBASE_VIA_PROXY=1
// selects via-proxy mode. With neither, lib.js uses the local
// chromium.launch() path unchanged.
//
// Failure mode: explicit. No silent fallback. Any error here surfaces
// to the probe entrypoint, which records it in the status JSON.
// Error messages are descriptive (what failed) but never prescriptive
// (how to bypass) — the codex-driven agent reads these messages and
// would otherwise act on bypass hints, defeating the design.
//
// Environment variables read here (also forwarded by the controlplane
// via `_RUNTIME_PASSTHROUGH_ENV_VARS` in runtime_client.py):
//   BROWSERBASE_API_KEY            — required when using this connector
//   BROWSERBASE_PROJECT_ID         — optional; SDK infers from key
//   BROWSERBASE_REGION             — default "eu-central-1"
//   BROWSERBASE_USE_PROXIES        — "1" enables residential proxies
//   BROWSERBASE_PROXY_COUNTRY      — ISO-3166-1 alpha-2 (e.g. "UA").
//                                    When set, wins over ccTLD auto-derivation.
//   BROWSERBASE_ADVANCED_STEALTH   — "1" enables Scale-plan stealth (legacy)
//   BROWSERBASE_VERIFIED           — "1" enables Verified sessions (Scale-plan,
//                                    superseded `advancedStealth` in SDK 2.10+)
//   BROWSERBASE_TIMEOUT_SECONDS    — per-session ceiling, default 1200 (20 min).
//                                    Hard cap prevents a hung page.goto from
//                                    burning the project default timeout.
//   BROWSERBASE_BLOCK_ADS          — "0" disables ad-blocking (default: enabled).
//                                    Ads + trackers dominate proxy GB cost.
//
// Via-proxy mode (publisher-runtime, no real BROWSERBASE_API_KEY in the env):
//   BROWSERBASE_CREDENTIALS_PRESENT — set by publisher-runtime to advertise that
//                                    publisher-proxy holds a key + project id.
//                                    Deliberately NOT read here: a presence
//                                    marker must never select a browsing mode,
//                                    which is exactly what went wrong while the
//                                    marker was spelled BROWSERBASE_API_KEY.
//   BRANDKIT_BROWSERBASE_VIA_PROXY — "1" arms proxy mode. Sessions are minted
//                                    by publisher-proxy (which alone holds the
//                                    API key) via POST
//                                    ${PUBLISHER_PROXY_BASE_URL}/browserbase/sessions
//                                    -> {sessionId, connectUrl, replayUrl,
//                                    releaseReceipt} and released via
//                                    .../browserbase/sessions/{id}/release,
//                                    which carries the receipt back in the
//                                    `X-Browserbase-Release-Receipt` header.
//                                    See "Signed release receipts" below.
//   PUBLISHER_PROXY_BASE_URL       — publisher-proxy HTTP base (required).
//   PUBLISHER_BROWSER_PROXY_URL    — http://token:secret@host:port. Supplies
//                                    BOTH the Proxy-Authorization identity the
//                                    mint route checks AND the CONNECT proxy
//                                    the local forwarder tunnels the CDP
//                                    WebSocket through. Playwright 1.60's
//                                    connectOverCDP ignores proxy env vars
//                                    entirely (proven empirically), hence the
//                                    in-process forwarder below.

import net from "node:net";
import tls from "node:tls";

import { chromium } from "playwright";

// THE proxy-URL chain + parser, shared with lib.js and save-logo-asset.js so
// the three clients cannot drift apart again (they had: this file defaulted the
// port to 80 for every scheme, skipped protocol validation, and read only
// PUBLISHER_BROWSER_PROXY_URL with no legacy fallback).
import { defaultBrowserProxyUrl } from "./browser-proxy-refusal.js";
import { parseProxyUrl } from "./browser-proxy-connect-probe.js";

// Two-letter TLDs that are nominally country codes but in practice used
// as generic TLDs. Skip geo-derivation for these — fall back to the
// BROWSERBASE_PROXY_COUNTRY env or Browserbase's default routing.
const _AMBIGUOUS_2L_TLDS = new Set(["io", "co", "me", "tv", "ai", "fm", "ws", "ly", "to"]);

// ccTLDs whose ISO-3166-1 alpha-2 country code differs from the TLD itself.
const _CCTLD_COUNTRY_OVERRIDES = { uk: "GB" };

function _deriveCountryFromTld(targetUrl) {
  if (!targetUrl || typeof targetUrl !== "string") return null;
  let host;
  try {
    host = new URL(targetUrl).hostname.toLowerCase();
  } catch {
    return null;
  }
  const parts = host.split(".");
  if (parts.length < 2) return null;
  const tld = parts[parts.length - 1];
  if (tld.length !== 2) return null;
  if (_AMBIGUOUS_2L_TLDS.has(tld)) return null;
  return _CCTLD_COUNTRY_OVERRIDES[tld] || tld.toUpperCase();
}

function _buildProxiesParam({ useProxies, targetUrl }) {
  if (!useProxies) return false;
  const explicit = (process.env.BROWSERBASE_PROXY_COUNTRY || "").trim().toUpperCase();
  const country = explicit || _deriveCountryFromTld(targetUrl);
  if (country) {
    return [{ type: "browserbase", geolocation: { country } }];
  }
  return true;
}

function _buildUserMetadata(metadata) {
  if (!metadata || typeof metadata !== "object") return undefined;
  const out = {};
  for (const [key, value] of Object.entries(metadata)) {
    if (typeof value !== "string") continue;
    const trimmed = value.trim();
    if (trimmed.length === 0 || trimmed.length > 512) continue;
    out[key] = trimmed;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

function _parsePositiveInt(value, fallback) {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

// Internal factory seam — swapped by unit tests via
// __setBrowserbaseFactory(). Production code goes through
// _resolveBrowserbaseFactory(), which dynamic-imports the SDK so the
// dependency does not load when running in local-Playwright mode.
let _browserbaseFactoryOverride = null;
let _chromiumOverride = null;
let _forwarderStarterOverride = null;

export function __setBrowserbaseFactory(factory) {
  _browserbaseFactoryOverride = factory;
}

export function __setChromiumOverride(value) {
  _chromiumOverride = value;
}

export function __setForwarderStarterOverride(fn) {
  _forwarderStarterOverride = fn;
}

export function __resetTestOverrides() {
  _browserbaseFactoryOverride = null;
  _chromiumOverride = null;
  _forwarderStarterOverride = null;
}

async function _resolveBrowserbaseFactory() {
  if (_browserbaseFactoryOverride) return _browserbaseFactoryOverride;
  const mod = await import("@browserbasehq/sdk");
  // The SDK ships a default export named `Browserbase`.
  return mod.default;
}

function _resolveChromium() {
  return _chromiumOverride || chromium;
}

// Renamed from `BrowserbaseError` to avoid shadowing the SDK's own
// `BrowserbaseError` export — future readers would otherwise wonder
// whether `instanceof BrowserbaseError` checks our class or the SDK's.
// This class is OUR connector-side error wrapper; the SDK's underlying
// error (when present) rides along as `.cause`.
export class BrowserbaseConnectorError extends Error {
  constructor(
    message,
    { code = "browserbase_error", status = null, sessionId = null, host = null, cause = null } = {},
  ) {
    // Forward `cause` via the ES2022 Error options bag so V8 attaches
    // it to the stack trace correctly. Only pass options when a cause
    // is supplied — `new Error(msg)` and `new Error(msg, undefined)`
    // both leave `"cause" in err` false, which downstream JSON
    // serialisers + tests rely on.
    super(message, cause ? { cause } : undefined);
    this.name = "BrowserbaseConnectorError";
    this.code = code;
    this.status = status;
    this.sessionId = sessionId;
    // Set on the one refusal a human can act on, so the host to approve is a
    // field rather than something a caller has to re-parse out of the prose.
    this.host = host;
  }
}

// Legacy value of the runtime's credential-PRESENCE marker. publisher-runtime
// used to advertise "publisher-proxy holds a Browserbase key" by setting
// BROWSERBASE_API_KEY="publisher-proxy" — the exact variable this module reads
// to select DIRECT mode. An inherited env therefore made node dial Browserbase
// with a bogus key and never fall back to local Chromium. The marker is now a
// distinct variable (BROWSERBASE_CREDENTIALS_PRESENT=1) that NOTHING here
// reads; this constant stays only so a container still carrying the old value
// cannot select direct mode either.
const PROXY_PRESENCE_SENTINEL_API_KEY = "publisher-proxy";

// True only when this process holds a REAL Browserbase API key. A presence
// marker is not a key: it must never select direct mode.
export function hasDirectBrowserbaseApiKey(env = process.env) {
  const apiKey = (env.BROWSERBASE_API_KEY || "").trim();
  return apiKey !== "" && apiKey !== PROXY_PRESENCE_SENTINEL_API_KEY;
}

export function isBrowserbaseViaProxyMode(env = process.env) {
  // BRANDKIT_BROWSERBASE_VIA_PROXY arms the mode; the base URL is the
  // endpoint every via-proxy call needs, so arming without it would only
  // guarantee a failure with no local-Chromium fallback.
  return (
    env.BRANDKIT_BROWSERBASE_VIA_PROXY === "1"
    && (env.PUBLISHER_PROXY_BASE_URL || "").trim() !== ""
  );
}

export function isBrowserbaseMode(env = process.env) {
  // Direct mode (a real API key in this process) OR via-proxy mode
  // (publisher-proxy holds the key and this process only ever sees a signed
  // connectUrl). Either way lib.js must NOT fall back to local Chromium on
  // failure.
  return hasDirectBrowserbaseApiKey(env) || isBrowserbaseViaProxyMode(env);
}

function _publisherProxyBaseUrl() {
  return (process.env.PUBLISHER_PROXY_BASE_URL || "").trim().replace(/\/+$/, "");
}

// Parse the browser-proxy URL (http://token:secret@host:port) into the CONNECT
// endpoint + the Basic Proxy-Authorization value. The same credentials serve as
// the thread identity on the publisher-proxy /browserbase routes — an active
// browser-proxy session is the proxy-side proof of an approved website_access
// permission.
//
// Chain and parsing are the SHARED ones (defaultBrowserProxyUrl /
// parseProxyUrl); only the error surface is local, because this client reports
// typed codes the other two do not have.
function _parseBrowserProxyEndpoint() {
  const raw = defaultBrowserProxyUrl();
  if (!raw) {
    throw new BrowserbaseConnectorError(
      "PUBLISHER_BROWSER_PROXY_URL is not set. Website access has not been approved for this thread yet — request the website_access permission first, then retry.",
      { code: "missing_browser_proxy_url" },
    );
  }
  const parsed = parseProxyUrl(raw);
  if (!parsed) {
    throw new BrowserbaseConnectorError(
      "PUBLISHER_BROWSER_PROXY_URL is not a valid URL.",
      { code: "invalid_browser_proxy_url" },
    );
  }
  if (!parsed.authorization) {
    throw new BrowserbaseConnectorError(
      "PUBLISHER_BROWSER_PROXY_URL has no embedded credentials; the browser proxy requires Proxy-Authorization.",
      { code: "missing_browser_proxy_credentials" },
    );
  }
  return {
    host: parsed.hostname,
    port: parsed.port,
    authorization: parsed.authorization,
  };
}

// ---------------------------------------------------------------------
// Signed release receipts
// ---------------------------------------------------------------------
//
// The mint response carries a fourth field, `releaseReceipt`: an opaque
// URL-safe ASCII token that PROVES this thread minted the session. It is the
// only thing that still authorises a release after publisher-proxy restarts
// and loses its in-memory ownership map — the failure mode that made an
// owner's own release 403 while the session burned to its 1200s timeout.
//
// It is held here, keyed by session id, rather than threaded through the
// return value: `browser.close()` teardown releases through
// `releaseBrowserbaseSession(sessionId)` with nothing else in hand, and
// keeping the token out of the returned object keeps it out of the caller's
// logs (lib.js logs sessionId + replayUrl on every run).
//
// It is a bearer credential: never log it, never put it in an error message.
// `_warn` scrubs every field it is handed, so a receipt that finds its way
// into a message string still cannot reach stderr.
const _releaseReceipts = new Map();

// Transport safety only — NOT parsing. A header value containing CR, LF or a
// NUL is a header-injection vector and Node's fetch rejects it outright, so a
// receipt that is not printable ASCII is dropped rather than sent.
const _SAFE_HEADER_VALUE = /^[\x21-\x7e]+$/;

function _rememberReleaseReceipt(sessionId, value) {
  if (!sessionId) return;
  const receipt = typeof value === "string" ? value.trim() : "";
  if (!receipt) return;
  if (!_SAFE_HEADER_VALUE.test(receipt)) {
    _warn("browserbase.release_receipt_unusable", { sessionId, reason: "not-header-safe" });
    return;
  }
  _releaseReceipts.set(sessionId, receipt);
}

function _scrubReceipts(value) {
  let text = String(value ?? "");
  for (const receipt of _releaseReceipts.values()) {
    if (receipt && text.includes(receipt)) {
      text = text.split(receipt).join("[redacted-release-receipt]");
    }
  }
  return text;
}

// Test seam: prove the registry does not grow without bound, and let a suite
// start from a known-empty state. Never exposes a receipt value.
export function __resetReleaseReceipts() {
  _releaseReceipts.clear();
}

export function __releaseReceiptCount() {
  return _releaseReceipts.size;
}

function _warn(event, fields = {}) {
  const safe = {};
  for (const [key, value] of Object.entries(fields)) {
    safe[key] = typeof value === "string" ? _scrubReceipts(value) : value;
  }
  process.stderr.write(JSON.stringify({ level: "warn", event, ...safe }) + "\n");
}

// In-process forwarder that carries Playwright's plaintext CDP WebSocket to
// the Browserbase TLS edge through the publisher browser proxy:
//   connectOverCDP("ws://127.0.0.1:<port><path+query>")
//     -> this listener (buffers the HTTP upgrade head, rewrites Host)
//     -> authenticated CONNECT through the publisher browser proxy
//     -> TLS wrap with the remote's SNI (certificate verification ON)
//     -> wss://connect.browserbase.com CDP endpoint
// Mechanism proven end-to-end in the Phase 2b spike (spike3): the upgrade is
// byte-identical to a direct wss dial once Host names the remote edge.
//
// `tlsOptions` is a TEST-ONLY seam (self-signed stand-in edges). Production
// callers must never pass it; rejectUnauthorized stays true by default.
export function startBrowserbaseForwarder({
  proxyHost,
  proxyPort,
  remoteHost,
  remotePort = 443,
  proxyAuthorization = null,
  tlsOptions = null,
}) {
  const openSockets = new Set();
  const track = (socket) => {
    openSockets.add(socket);
    socket.on("close", () => openSockets.delete(socket));
  };

  // The handle is shared with the per-connection closures below so a
  // CONNECT denial can be recorded on it: connectOverCDP only ever sees
  // "socket hang up" when the tunnel is refused (the denial status line
  // never reaches the wire — socket.destroy(err) emits locally), so the
  // caller consults `lastConnectDenialStatusLine` to tell a proxy 403
  // apart from a generic CDP connect failure.
  const handle = {
    port: 0,
    lastConnectDenialStatusLine: null,
    close: null,
  };

  const server = net.createServer((client) => {
    track(client);
    const proxySocket = net.connect(proxyPort, proxyHost, () => {
      const authLine = proxyAuthorization ? `Proxy-Authorization: ${proxyAuthorization}\r\n` : "";
      proxySocket.write(
        `CONNECT ${remoteHost}:${remotePort} HTTP/1.1\r\n`
        + `Host: ${remoteHost}:${remotePort}\r\n`
        + authLine
        + "\r\n",
      );
    });
    track(proxySocket);

    let connectBuffer = Buffer.alloc(0);
    const onConnectData = (chunk) => {
      connectBuffer = Buffer.concat([connectBuffer, chunk]);
      const headEnd = connectBuffer.indexOf("\r\n\r\n");
      if (headEnd === -1) {
        if (connectBuffer.length > 16 * 1024) {
          _warn("browserbase.forwarder_connect_headers_too_large", { remoteHost });
          client.destroy();
          proxySocket.destroy();
        }
        return;
      }
      proxySocket.removeListener("data", onConnectData);
      const statusLine = connectBuffer.slice(0, headEnd).toString("utf8").split("\r\n")[0];
      if (!/^HTTP\/1\.[01] 200/.test(statusLine)) {
        handle.lastConnectDenialStatusLine = statusLine;
        _warn("browserbase.forwarder_connect_denied", { remoteHost, statusLine });
        client.destroy();
        proxySocket.destroy();
        return;
      }
      const leftover = connectBuffer.slice(headEnd + 4);
      if (leftover.length) {
        // Tunneled bytes that arrived glued to the CONNECT response — hand
        // them back to the stream so the TLS layer sees them.
        proxySocket.unshift(leftover);
      }
      const secure = tls.connect(
        {
          socket: proxySocket,
          servername: remoteHost,
          rejectUnauthorized: true,
          ...(tlsOptions || {}),
        },
        () => {
          let headBuffer = Buffer.alloc(0);
          const onClientHeadData = (data) => {
            headBuffer = Buffer.concat([headBuffer, data]);
            const clientHeadEnd = headBuffer.indexOf("\r\n\r\n");
            if (clientHeadEnd === -1) {
              // Same 16 KB ceiling as the CONNECT-response buffer above:
              // a peer that streams headerless bytes into the loopback
              // listener must not grow the head buffer without bound.
              if (headBuffer.length > 16 * 1024) {
                _warn("browserbase.forwarder_client_headers_too_large", { remoteHost });
                client.destroy();
                secure.destroy();
              }
              return;
            }
            const head = headBuffer.slice(0, clientHeadEnd).toString("utf8");
            const rest = headBuffer.slice(clientHeadEnd);
            // Rewrite Host so the remote edge sees its own name, not
            // 127.0.0.1 — Browserbase routes by Host.
            const rewritten = head.replace(/^Host: .*$/im, `Host: ${remoteHost}`);
            secure.write(Buffer.concat([Buffer.from(rewritten, "utf8"), rest]));
            // Upgrade complete: detach the head accumulator and hand the
            // rest of the stream to pipe() so client→remote gets the same
            // backpressure the remote→client direction already has.
            client.removeListener("data", onClientHeadData);
            client.pipe(secure);
          };
          client.on("data", onClientHeadData);
          secure.pipe(client);
        },
      );
      track(secure);
      secure.on("error", (err) => {
        // Surfaces TLS verification failures and mid-stream resets — the
        // client connection drops and connectOverCDP reports the failure.
        _warn("browserbase.forwarder_tls_error", { remoteHost, error: String((err && err.message) || err) });
        client.destroy();
        proxySocket.destroy();
      });
      client.on("close", () => secure.destroy());
    };
    proxySocket.on("data", onConnectData);
    proxySocket.on("error", (err) => {
      _warn("browserbase.forwarder_proxy_error", { remoteHost, error: String((err && err.message) || err) });
      client.destroy();
    });
    client.on("error", () => proxySocket.destroy());
    client.on("close", () => proxySocket.destroy());
  });

  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => {
      handle.port = server.address().port;
      handle.close = () => new Promise((resolveClose) => {
        for (const socket of openSockets) socket.destroy();
        openSockets.clear();
        server.close(() => resolveClose());
      });
      resolve(handle);
    });
  });
}

async function _safeBodyText(response) {
  try {
    return (await response.text()).trim();
  } catch {
    return "";
  }
}

// Bounded, because an arbitrary upstream body must not become the whole error
// message. The one refusal that carries an INSTRUCTION is exempt below — it is
// read out of the parsed body instead, so the cap never truncates it mid-word.
function _bodyExcerpt(text) {
  return text.length > 240 ? `${text.slice(0, 237)}...` : text;
}

// The publisher-proxy mint route's machine-readable refusal code, and the ONLY
// value of it this connector treats as anything other than a generic failure.
//
// Everything else on this route stays on `session_create_failed`, which is a
// CATCH-ALL: fetch throwing, any non-2xx, a non-JSON body, and — in direct mode
// — every sessions.create error except 402. A bad API key (401), a blown quota
// (429) and a Browserbase outage (5xx) all land in it. So keying the skill's
// ask-a-human branch on `session_create_failed`, or on "any 4xx", would turn
// genuine platform faults into approval cards that cannot help. This code is
// narrow enough to key recovery on instead: the proxy emits it at exactly one
// place, and only for a well-formed public host that a `website_access`
// approval can actually add to this thread's browser-proxy session.
const PROXY_REFUSAL_CODE_TARGET_NOT_APPROVED = "target_not_approved";

// A parsed `{"detail": {"code", "message", "host"}}` refusal, or null for any
// body that is not one — a plain-string `detail` (every other refusal this
// route and its siblings answer, including the uniform pre-auth
// "not available for this thread"), non-JSON, or an unexpected shape. Null
// means "generic failure", never "ask a human".
function _parseProxyRefusalBody(text) {
  if (!text) return null;
  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    return null;
  }
  const detail = parsed && typeof parsed === "object" ? parsed.detail : null;
  if (!detail || typeof detail !== "object" || Array.isArray(detail)) return null;
  const code = typeof detail.code === "string" ? detail.code.trim() : "";
  if (!code) return null;
  return {
    code,
    message: typeof detail.message === "string" ? detail.message.trim() : "",
    host: typeof detail.host === "string" ? detail.host.trim() : "",
  };
}

async function _mintBrowserbaseSessionViaProxy({
  proxyBase,
  endpoint,
  targetUrl,
  metadata,
  blockedFallbackSourceSessionId = null,
}) {
  const body = {
    ...(targetUrl ? { targetUrl } : {}),
    ...(metadata && typeof metadata === "object" && Object.keys(metadata).length ? { metadata } : {}),
  };
  let response;
  try {
    const fallbackPath = blockedFallbackSourceSessionId
      ? `/${encodeURIComponent(blockedFallbackSourceSessionId)}/blocked-fallback`
      : "";
    response = await fetch(`${proxyBase}/browserbase/sessions${fallbackPath}`, {
      method: "POST",
      headers: {
        "proxy-authorization": endpoint.authorization,
        ...(!blockedFallbackSourceSessionId ? { "content-type": "application/json" } : {}),
      },
      // The dedicated fallback route deliberately accepts no caller-controlled
      // target, country, intent or proxy setting.
      ...(!blockedFallbackSourceSessionId ? { body: JSON.stringify(body) } : {}),
    });
  } catch (err) {
    throw new BrowserbaseConnectorError(
      `Browserbase sessions.create via publisher-proxy failed: ${String((err && err.message) || err)}`,
      { code: "session_create_failed", cause: err },
    );
  }
  if (!response.ok) {
    const bodyText = await _safeBodyText(response);
    const refusal = _parseProxyRefusalBody(bodyText);
    if (
      response.status === 403
      && refusal
      && refusal.code === PROXY_REFUSAL_CODE_TARGET_NOT_APPROVED
      && refusal.host
    ) {
      // The ONE Browserbase failure a human click can fix, and the only one
      // that leaves this function with a code of its own. `host` is the
      // proxy's own normalized form, so the approval the agent asks for is
      // byte-identical to what the retry will be matched against; the message
      // is passed through whole rather than excerpted, because it is the
      // agent's instruction and not merely debug context.
      throw new BrowserbaseConnectorError(
        `Browserbase sessions.create via publisher-proxy refused ${refusal.host} `
        + `(HTTP 403, ${refusal.code})${refusal.message ? `: ${refusal.message}` : ""}`,
        { code: PROXY_REFUSAL_CODE_TARGET_NOT_APPROVED, status: response.status, host: refusal.host },
      );
    }
    const excerpt = _bodyExcerpt(bodyText);
    throw new BrowserbaseConnectorError(
      `Browserbase sessions.create via publisher-proxy failed (HTTP ${response.status})${excerpt ? `: ${excerpt}` : ""}`,
      { code: "session_create_failed", status: response.status },
    );
  }
  let payload;
  try {
    payload = await response.json();
  } catch (err) {
    throw new BrowserbaseConnectorError(
      "Browserbase sessions.create via publisher-proxy returned a non-JSON response",
      { code: "session_create_failed", cause: err },
    );
  }
  return payload && typeof payload === "object" ? payload : {};
}

// The mint's `allowedHosts` field, normalized into the shape `openPage`'s
// navigation gate wants: a lowercase, de-duplicated, trailing-dot-free array,
// or NULL for "the mint said nothing".
//
// NULL AND EMPTY MEAN THE SAME THING HERE, deliberately. An empty list can only
// arrive from a wire defect: the mint that produced this body already refused
// unless the target matched one of these hosts
// (`_require_browserbase_target_approved`), so a successful mint cannot have an
// empty list. Enforcing an empty allowlist would abort the very first `goto` —
// which is this PR's own bug, re-armed. The caller turns null into "gate off,
// with a WARN", which is the loud version of doing nothing.
function _normalizeAllowedHosts(value) {
  if (!Array.isArray(value)) return null;
  const hosts = [];
  for (const entry of value) {
    if (typeof entry !== "string") continue;
    const host = entry.trim().toLowerCase().replace(/\.$/, "");
    if (host && !hosts.includes(host)) hosts.push(host);
  }
  return hosts.length ? hosts : null;
}

async function _connectViaProxy({ targetUrl, metadata, blockedFallbackSourceSessionId = null }) {
  const proxyBase = _publisherProxyBaseUrl();
  const endpoint = _parseBrowserProxyEndpoint();
  const minted = await _mintBrowserbaseSessionViaProxy({
    proxyBase,
    endpoint,
    targetUrl,
    metadata,
    blockedFallbackSourceSessionId,
  });
  const sessionId = typeof minted.sessionId === "string" && minted.sessionId ? minted.sessionId : null;
  const connectUrl = typeof minted.connectUrl === "string" && minted.connectUrl ? minted.connectUrl : null;
  if (!sessionId) {
    throw new BrowserbaseConnectorError(
      "Browserbase sessions.create returned no session id",
      { code: "missing_session_id", cause: minted },
    );
  }
  // Register BEFORE any early-exit release below: those releases are exactly
  // the ones a restarted proxy would otherwise refuse.
  _rememberReleaseReceipt(sessionId, minted.releaseReceipt);
  if (!connectUrl) {
    await releaseBrowserbaseSession(sessionId);
    throw new BrowserbaseConnectorError(
      `Browserbase session ${sessionId} created but connectUrl missing`,
      { code: "missing_connect_url", sessionId },
    );
  }
  let parsedConnectUrl;
  try {
    parsedConnectUrl = new URL(connectUrl);
  } catch (err) {
    await releaseBrowserbaseSession(sessionId);
    throw new BrowserbaseConnectorError(
      `Browserbase session ${sessionId} returned an invalid connectUrl`,
      { code: "invalid_connect_url", sessionId, cause: err },
    );
  }
  const remoteHost = parsedConnectUrl.hostname;
  const remotePort = parseInt(parsedConnectUrl.port, 10) || 443;
  const startForwarder = _forwarderStarterOverride || startBrowserbaseForwarder;
  let forwarder;
  try {
    forwarder = await startForwarder({
      proxyHost: endpoint.host,
      proxyPort: endpoint.port,
      proxyAuthorization: endpoint.authorization,
      remoteHost,
      remotePort,
    });
  } catch (err) {
    // The session is already minted (billed) at this point; a listener
    // that fails to start (e.g. fd exhaustion) must not orphan it for
    // the 20-minute session timeout. Release first, then surface.
    await releaseBrowserbaseSession(sessionId);
    throw new BrowserbaseConnectorError(
      `Browserbase forwarder startup failed for session ${sessionId} (session released): ${String((err && err.message) || err)}`,
      { code: "forwarder_start_failed", sessionId, cause: err },
    );
  }
  const localConnectUrl = `ws://127.0.0.1:${forwarder.port}${parsedConnectUrl.pathname}${parsedConnectUrl.search}`;
  const chromiumClient = _resolveChromium();
  let browser;
  try {
    browser = await chromiumClient.connectOverCDP(localConnectUrl);
  } catch (err) {
    // A denied CONNECT never reaches connectOverCDP as anything more
    // specific than "socket hang up" — the forwarder records the proxy's
    // denial status line out-of-band, so consult it here to make a proxy
    // 403 distinguishable from a generic CDP connect failure.
    const denialStatusLine = forwarder.lastConnectDenialStatusLine || null;
    await forwarder.close();
    await releaseBrowserbaseSession(sessionId);
    if (denialStatusLine) {
      throw new BrowserbaseConnectorError(
        `Browserbase connectOverCDP failed for session ${sessionId}: the publisher browser proxy denied the CONNECT tunnel (${denialStatusLine}) (session released).`,
        { code: "proxy_connect_denied", sessionId, cause: err },
      );
    }
    throw new BrowserbaseConnectorError(
      `Browserbase connectOverCDP failed for session ${sessionId} (session released).`,
      { code: "cdp_connect_failed", sessionId, cause: err },
    );
  }
  // Tear the forwarder down with the browser so the loopback listener never
  // outlives the session. lib.js layers its own close() wrap on top for the
  // session release — wrapping composes.
  const originalClose = browser.close.bind(browser);
  browser.close = async (...closeArgs) => {
    try {
      await originalClose(...closeArgs);
    } finally {
      await forwarder.close();
    }
  };
  const replayUrl = typeof minted.replayUrl === "string" && minted.replayUrl
    ? minted.replayUrl
    : `https://browserbase.com/sessions/${sessionId}`;
  // `allowedHosts` is NOT a credential — it is the thread's own declared host
  // list, already logged by the proxy at mint time — so unlike `releaseReceipt`
  // it rides in the return value rather than a module-side registry. The
  // navigation gate in `openPage` is its only consumer.
  return {
    browser,
    sessionId,
    replayUrl,
    allowedHosts: _normalizeAllowedHosts(minted.allowedHosts),
    viaProxy: true,
    proxiesEnabled: minted.proxiesEnabled === true,
    proxyCountry: typeof minted.proxyCountry === "string" && minted.proxyCountry
      ? minted.proxyCountry
      : null,
    residentialFallbackAvailable: minted.residentialFallbackAvailable === true,
  };
}

// The only runtime operation that can ask for a blocked residential fallback.
// Closing the source browser invokes lib.js's wrapped close, which releases the
// source session; the dedicated endpoint is not called unless the proxy
// explicitly answered released:true.
export async function connectViaBrowserbaseBlockedFallback({ sourceBrowser, sourceSessionId }) {
  if (!isBrowserbaseViaProxyMode()) {
    throw new BrowserbaseConnectorError(
      "Browserbase blocked fallback is unavailable outside publisher-proxy mode",
      { code: "fallback_unavailable", sessionId: sourceSessionId },
    );
  }
  if (!sourceBrowser || !sourceSessionId) {
    throw new BrowserbaseConnectorError(
      "Browserbase blocked fallback requires its standard source session",
      { code: "fallback_unavailable", sessionId: sourceSessionId || null },
    );
  }
  const released = await sourceBrowser.close();
  if (released !== true) {
    throw new BrowserbaseConnectorError(
      "Browserbase standard session release was not accepted; residential fallback was not started",
      { code: "fallback_release_failed", sessionId: sourceSessionId },
    );
  }
  return _connectViaProxy({ blockedFallbackSourceSessionId: sourceSessionId });
}

// Connects to a Browserbase-managed Chromium and returns the Playwright
// Browser handle plus the session id, replay URL and `allowedHosts`. Throws
// BrowserbaseConnectorError on any failure; the caller is expected to
// surface the error rather than silently fall back to a local browser.
//
// `allowedHosts` IS NULL ON THE DIRECT PATH, and that is not an oversight.
// There are two paths below and only one of them has a thread behind it:
// via-proxy (publisher-runtime; publisher-proxy mints against the thread's
// browser-proxy session and returns its hosts) and the direct API key (the dev
// rig — no mint, no thread, no host list to return). A dev rig therefore has no
// navigation gate, so `openPage` says so out loud rather than leaving the
// caller to infer it from silence. See `openPage.navigation_gate_disabled`.
//
// Optional opts:
//   targetUrl  — used to auto-derive proxy country from the URL's ccTLD
//                (store-example.ua → UA, shop-example.de → DE). Skipped for generic TLDs
//                (.com, .io, etc.). BROWSERBASE_PROXY_COUNTRY env wins.
//   metadata   — k/v string map forwarded as userMetadata. Lets on-call
//                filter sessions in the Browserbase dashboard by jobId,
//                slug, etc.
export async function connectViaBrowserbase({ targetUrl = null, metadata = null } = {}) {
  if (isBrowserbaseViaProxyMode()) {
    // Publisher-runtime path: the API key never enters this process.
    // publisher-proxy builds the create params (geo proxies, stealth,
    // metadata fallback) server-side and returns only the signed connectUrl.
    return _connectViaProxy({ targetUrl, metadata });
  }
  const apiKey = (process.env.BROWSERBASE_API_KEY || "").trim();
  if (!hasDirectBrowserbaseApiKey()) {
    // Covers both "unset/blank" and "carries only the credential-presence
    // marker" — the latter would otherwise reach the SDK as a real key.
    throw new BrowserbaseConnectorError(
      "BROWSERBASE_API_KEY is empty",
      { code: "missing_api_key" },
    );
  }
  const projectId = (process.env.BROWSERBASE_PROJECT_ID || "").trim();
  const region = (process.env.BROWSERBASE_REGION || "eu-central-1").trim();
  const useProxies = process.env.BROWSERBASE_USE_PROXIES === "1";
  const advancedStealth = process.env.BROWSERBASE_ADVANCED_STEALTH === "1";
  const verified = process.env.BROWSERBASE_VERIFIED === "1";
  // blockAds is a cost-saver for proxy bandwidth (~50-80% of GB on
  // retail homepages is ads/trackers). When proxies are OFF it has no
  // cost benefit and may interfere with the captcha solver's view of
  // hCaptcha / Imperva resources — confirmed regression on shop-example.com
  // (run 01KSQ7MMD838F5M3WMCVH3C2Y7 with blockAds default-true left
  // the page on the Imperva interstitial even though the same site
  // previously cleared the captcha with blockAds disabled).
  // Default: couple to useProxies. Explicit "1"/"0" always wins.
  const blockAdsEnv = process.env.BROWSERBASE_BLOCK_ADS;
  const blockAds = blockAdsEnv === "1" ? true
    : blockAdsEnv === "0" ? false
    : useProxies;
  const timeoutSeconds = _parsePositiveInt(process.env.BROWSERBASE_TIMEOUT_SECONDS, 1200);

  const BrowserbaseCtor = await _resolveBrowserbaseFactory();
  const bb = new BrowserbaseCtor({ apiKey });

  const proxiesParam = _buildProxiesParam({ useProxies, targetUrl });
  const userMetadata = _buildUserMetadata(metadata);

  const createParams = {
    ...(projectId ? { projectId } : {}),
    region,
    proxies: proxiesParam,
    timeout: timeoutSeconds,
    ...(userMetadata ? { userMetadata } : {}),
    browserSettings: {
      viewport: { width: 1920, height: 1080 },
      solveCaptchas: true,
      blockAds,
      ...(advancedStealth ? { advancedStealth: true } : {}),
      ...(verified ? { verified: true } : {}),
    },
  };

  // Best-effort body extraction from the SDK's APIError shape — used
  // in the error message so on-call sees WHAT was wrong (e.g. which
  // metadata field was rejected), not just an HTTP status.
  const _causeBody = (err) => {
    try {
      const body = err?.error ?? err?.body;
      if (!body) return null;
      const compact = typeof body === "string" ? body : JSON.stringify(body);
      return compact.length > 240 ? `${compact.slice(0, 237)}...` : compact;
    } catch {
      return null;
    }
  };

  let session;
  let metadataRejected = false;
  try {
    session = await bb.sessions.create(createParams);
  } catch (err) {
    const status = err?.status ?? null;
    // Defensive retry: a 4xx with userMetadata in the request is most
    // likely metadata-validation failure. Observability metadata must
    // never block the core extraction — retry once without it. This
    // saved a production run on 2026-05-28 where adding `url` to
    // userMetadata caused a 4xx that the codex agent then bypassed by
    // unsetting BROWSERBASE_API_KEY, fatally falling through to local
    // Playwright on a Cloudflare-blocked datacenter IP.
    if (status && status >= 400 && status < 500 && status !== 402 && createParams.userMetadata) {
      process.stderr.write(JSON.stringify({
        level: "warn",
        event: "browserbase.metadata_rejected_retrying_without",
        status,
        body: _causeBody(err),
      }) + "\n");
      metadataRejected = true;
      const { userMetadata, ...paramsWithoutMetadata } = createParams;
      try {
        session = await bb.sessions.create(paramsWithoutMetadata);
      } catch (err2) {
        const status2 = err2?.status ?? null;
        const code2 = status2 === 402 ? "payment_required" : "session_create_failed";
        throw new BrowserbaseConnectorError(
          `Browserbase sessions.create failed${status2 ? ` (HTTP ${status2})` : ""}: ${_causeBody(err2) || "no response body"}`,
          { code: code2, status: status2, cause: err2 },
        );
      }
    } else {
      // 402 Payment Required usually means a paid-only feature
      // (proxies, verified sessions) was requested on a plan that lacks
      // it. Distinct code lets the caller / on-call see the cause
      // without digging into the wrapped APIError body.
      const code = status === 402 ? "payment_required" : "session_create_failed";
      throw new BrowserbaseConnectorError(
        `Browserbase sessions.create failed${status ? ` (HTTP ${status})` : ""}: ${_causeBody(err) || "no response body"}`,
        { code, status, cause: err },
      );
    }
  }

  const sessionId = session && session.id ? session.id : null;
  const connectUrl = session && session.connectUrl ? session.connectUrl : null;

  if (!sessionId) {
    throw new BrowserbaseConnectorError("Browserbase sessions.create returned no session id", {
      code: "missing_session_id",
      cause: session,
    });
  }
  if (!connectUrl) {
    await releaseBrowserbaseSession(sessionId);
    throw new BrowserbaseConnectorError(
      `Browserbase session ${sessionId} created but connectUrl missing`,
      { code: "missing_connect_url", sessionId },
    );
  }

  const chromiumClient = _resolveChromium();
  let browser;
  try {
    browser = await chromiumClient.connectOverCDP(connectUrl);
  } catch (err) {
    await releaseBrowserbaseSession(sessionId);
    throw new BrowserbaseConnectorError(
      `Browserbase connectOverCDP failed for session ${sessionId} (session released).`,
      { code: "cdp_connect_failed", sessionId, cause: err },
    );
  }
  // Live-View / replay URL convention from browserbase/sdk-node examples.
  // Surfacing it in the caller's logs gives on-call one-click access to
  // the session recording when something fails.
  const replayUrl = `https://browserbase.com/sessions/${sessionId}`;
  // Explicit null, not an omitted key: the direct path has no mint and so no
  // thread host list. Written out so a reader of this return does not have to
  // check whether the field is merely missing. See the header.
  return {
    browser,
    sessionId,
    replayUrl,
    allowedHosts: null,
    viaProxy: false,
    proxiesEnabled: useProxies,
    proxyCountry: useProxies ? (_buildProxiesParam({ useProxies, targetUrl })?.[0]?.geolocation?.country || null) : null,
    residentialFallbackAvailable: false,
  };
}

// Best-effort release of a Browserbase session by id. Never throws — a
// stuck release would mask the caller's original error and the session
// will time out on its own. Safe to call multiple times; no-ops when
// the session id is falsy or BROWSERBASE_API_KEY is unset.
export async function releaseBrowserbaseSession(sessionId) {
  if (!sessionId) return false;
  if (isBrowserbaseViaProxyMode()) {
    return _releaseBrowserbaseSessionViaProxy(sessionId);
  }
  if (!hasDirectBrowserbaseApiKey()) return false;
  const apiKey = (process.env.BROWSERBASE_API_KEY || "").trim();
  const projectId = (process.env.BROWSERBASE_PROJECT_ID || "").trim();
  try {
    const BrowserbaseCtor = await _resolveBrowserbaseFactory();
    const bb = new BrowserbaseCtor({ apiKey });
    await bb.sessions.update(sessionId, {
      status: "REQUEST_RELEASE",
      ...(projectId ? { projectId } : {}),
    });
    return true;
  } catch (err) {
    process.stderr.write(
      JSON.stringify({
        level: "warn",
        event: "browserbase.release_failed",
        sessionId,
        error: String((err && err.message) || err),
      }) + "\n",
    );
    return false;
  }
}

// Via-proxy variant of the best-effort release: POST to publisher-proxy's
// release route with the same Proxy-Authorization identity the mint used,
// PLUS the signed receipt the mint handed back. The proxy also accepts a
// matching in-memory ownership record, so omitting the header is not an error
// today — but the record does not survive a proxy restart and the receipt
// does, so sending it is treated as mandatory.
//
// Never throws — the proxy tolerates already-released sessions, and a stuck
// release must not mask the caller's original error.
async function _releaseBrowserbaseSessionViaProxy(sessionId) {
  try {
    const proxyBase = _publisherProxyBaseUrl();
    const endpoint = _parseBrowserProxyEndpoint();
    const receipt = _releaseReceipts.get(sessionId) || null;
    if (!receipt) {
      // Not fatal, but it is the difference between a release that survives a
      // proxy restart and one that 403s while the session burns to its
      // timeout — so it is worth a line in the log.
      _warn("browserbase.release_receipt_missing", { sessionId });
    }
    const url = `${proxyBase}/browserbase/sessions/${encodeURIComponent(sessionId)}/release`;
    const init = {
      method: "POST",
      headers: {
        "proxy-authorization": endpoint.authorization,
        ...(receipt ? { "X-Browserbase-Release-Receipt": receipt } : {}),
      },
    };

    // `200 {"released": false}` now means "the grant is intact, nothing was
    // dropped — it is safe to retry". Retry exactly once: the previous
    // contract (revoke unconditionally) turned one upstream 429/500 into an
    // unrecoverable release, and an unbounded retry would re-create a stuck
    // teardown.
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const response = await fetch(url, init);
      if (!response.ok) {
        _warn("browserbase.release_failed", { sessionId, status: response.status });
        return false;
      }
      let released = null;
      try {
        const payload = await response.json();
        if (payload && typeof payload === "object" && typeof payload.released === "boolean") {
          released = payload.released;
        }
      } catch {
        // A body we cannot read is not evidence that a retry would help.
      }
      if (released === true) {
        _releaseReceipts.delete(sessionId);
        return true;
      }
      if (released === false && attempt === 0) {
        _warn("browserbase.release_not_released_retrying", { sessionId });
      } else if (released === false) {
        _warn("browserbase.release_not_released", { sessionId });
      } else {
        _warn("browserbase.release_response_unconfirmed", { sessionId });
        return false;
      }
    }
  } catch (err) {
    _warn("browserbase.release_failed", { sessionId, error: String((err && err.message) || err) });
  }
  return false;
}

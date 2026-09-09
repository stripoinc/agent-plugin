// Translate a publisher-browser-proxy CONNECT failure into the diagnosis the
// operator can actually act on.
//
// Why this exists: `PUBLISHER_BROWSER_PROXY_URL` is minted for EVERY turn
// regardless of whether the thread holds a website_access approval
// (`ensure_thread_browser_proxy_context` has no approval guard), so the
// "PUBLISHER_BROWSER_PROXY_URL is not set" branch that lib.js and
// save-logo-asset.js both define is unreachable in publisher-runtime. An
// unapproved thread instead gets a working proxy URL, connects fine, and dies
// when the proxy answers the CONNECT with `403 Forbidden` (browser_proxy.py,
// reason `host_not_approved`) — surfacing as a generic transport error the
// agent cannot act on.
//
// WHY WE DO NOT CLASSIFY ON THE BROWSER'S ERROR CODE. Chromium collapses every
// non-200 CONNECT into `ERR_TUNNEL_CONNECTION_FAILED`, but the proxy answers
// five different things (browser_proxy.py `_handle_client`):
//
//   403 — port_not_allowed / host_not_approved / policy error  -> approval
//   407 — missing_proxy_auth / invalid_proxy_auth              -> credentials
//   405 — https_connect_only                                   -> client bug
//   504 — asyncio.TimeoutError connecting to the target        -> target-side
//   502 — `except Exception`, which an ordinary target-side DNS failure
//         produces (resolve_public_targets -> getaddrinfo -> gaierror)
//
// Reading "missing approval" out of the collapsed code told an approved thread
// whose target site was briefly down that its approval was missing: the human
// re-approves, nothing changes, the next turn fails identically. So the status
// is OBTAINED, never inferred — from the error chain when the client preserved
// it, otherwise by probing the proxy's own CONNECT answer.
//
// The two clients garble the failure differently, which is why the chain is
// matched on a list of messages rather than one string:
//
//   Chromium (lib.js, --proxy-server) — status is LOST:
//     "page.goto: net::ERR_TUNNEL_CONNECTION_FAILED at https://acme.example/"
//
//   undici ProxyAgent (save-logo-asset.js) — status is PRESERVED. Verified
//   against undici 7.29.0 for 403, 405, 407, 502 and 504, all identical but
//   for the number:
//     TypeError "fetch failed"
//       cause: DOMException "Request was cancelled."
//         cause: RequestAbortedError (UND_ERR_ABORTED)
//                "Proxy response (403) !== 200 when HTTP Tunneling"
//
// so the useful text sits two `cause` levels below a message that says nothing.
//
// Observed live against a real headless Chromium and a loopback proxy driven
// by production's own `_write_proxy_response` bytes
// (browser-proxy-openpage-integration.test.js): 403, 502 and 504 all arrive as
// ERR_TUNNEL_CONNECTION_FAILED (identical text, three different diagnoses),
// and a 407 without a usable challenge arrives as ERR_PROXY_AUTH_UNSUPPORTED.
//
// THE 407 PRODUCTION ACTUALLY SENDS carries `Proxy-Authenticate: Basic
// realm="publisher-browser-proxy"` (browser_proxy.py always attaches it), and
// real Chromium then re-attempts the CONNECT with credentials until the whole
// navigation budget is gone: measured `page.goto: Timeout 3000ms exceeded.`
// with no proxy marker in the text at all. Gating on timeouts generically
// would recreate exactly the over-broad classification this module exists to
// fix, so the gate is as narrow as the shape: a navigation timeout opens the
// door, and the ONLY verdict reachable through it is 407 with a live
// `Proxy-Authenticate` challenge, read off the proxy by the probe. Any other
// probe answer on that path — 403, 502, 200, unreachable, unavailable —
// passes the timeout through untouched, exactly as before.
//
// The authority (host AND port) is taken from the URL the failure NAMES
// wherever the client preserved one, not from the URL we asked for. After a
// redirect those differ, and the host that must be approved is the one the
// proxy refused.

import { probeProxyConnect } from "./browser-proxy-connect-probe.js";

const CAUSE_CHAIN_MAX_DEPTH = 6;
// A navigation timeout is the failure path's cheapest possible extra probe,
// but it is also the most common unrelated failure, so keep it short.
const TIMEOUT_PATH_PROBE_TIMEOUT_MS = 2000;
const ALLOWED_CONNECT_PORT = 443;

// The publisher runtime's proxy URL, same chain both clients read.
export function defaultBrowserProxyUrl(env = process.env) {
  return (env.PUBLISHER_BROWSER_PROXY_URL || env.BRANDKIT_BROWSER_PROXY_URL || "").trim();
}

// Failures that MIGHT be the proxy refusing the tunnel. This is only a gate:
// matching here starts the classification, it never decides the diagnosis.
// Anything not matching passes through untouched — an unrelated failure must
// never be dressed up as a proxy problem.
const PROXY_TRANSPORT_FAILURE_MARKERS = [
  // Chromium's renderings of a refused / unusable CONNECT. The auth ones are
  // what a 407 actually surfaces as (observed live: ERR_PROXY_AUTH_UNSUPPORTED
  // when the proxy's challenge is not usable, ERR_HTTP_RESPONSE_CODE_FAILURE
  // when it is) — the token-rotation case both clients used to miss entirely.
  /ERR_TUNNEL_CONNECTION_FAILED/i,
  /ERR_PROXY_CONNECTION_FAILED/i,
  /ERR_HTTP_RESPONSE_CODE_FAILURE/i,
  /ERR_PROXY_AUTH_UNSUPPORTED/i,
  /ERR_UNEXPECTED_PROXY_AUTH/i,
  // undici's shape, any status.
  /proxy response \(\d{3}\)/i,
  // A status line in proxy/tunnel/CONNECT context. The qualifier is
  // load-bearing: a bare 403 is what the TARGET site returns for a
  // hotlink-protected asset, a different diagnosis entirely.
  /(?:proxy|tunnel|connect)[^\n]{0,80}\b(?:40[357]|50[24])\b/i,
];

// undici's CONNECTION-level failures, which carry no "Proxy response (nnn)"
// text because the socket to the PROXY never came up. Under a ProxyAgent
// every one of these is the proxy leg, but they are kept in a second list so
// they only ever GATE: the probe still decides, so a target-side reset after
// the tunnel is established (the proxy answers 200) still passes through.
// Without them a dead proxy printed a bare `fetch failed` on this client
// while Chromium reported it correctly.
const UNDICI_OUTER_MESSAGE = /^fetch failed$/i;
const UNDICI_CONNECTION_FAILURE_MARKERS = [
  /\b(ECONNREFUSED|ECONNRESET|EHOSTUNREACH|ENETUNREACH|ENOTFOUND|EAI_AGAIN|EPIPE|ETIMEDOUT)\b/,
  /UND_ERR_CONNECT_TIMEOUT/i,
  /UND_ERR_SOCKET/i,
];

// Playwright's navigation timeout, verbatim. See the header: this is a GATE
// only, and the sole verdict reachable through it is a challenged 407.
const NAVIGATION_TIMEOUT_MARKER = /\bTimeout \d+ms exceeded\b/i;

// Status the client already knows for THIS request. undici preserves it, so
// probing again would only add a second sample of a possibly-changed state.
const PROXY_STATUS_PATTERNS = [
  /proxy response \((\d{3})\)/i,
  /proxy connect failed:\s*HTTP\/\d(?:\.\d)?\s+(\d{3})/i,
];

// The URL a failure names. Chromium/Playwright append it to the error; the
// call log is the only place a bare navigation timeout carries one. AFTER A
// REDIRECT this is the post-redirect URL — the authority the proxy actually
// refused, and the one an approval has to name.
const FAILURE_URL_PATTERNS = [
  /\bat (https?:\/\/\S+)/i,
  /\bnavigating to "(https?:\/\/[^"]+)"/i,
];

// Hosts `browser_proxy.normalize_browser_proxy_host` refuses outright, so a
// 403 for one of them is a policy refusal that no approval can lift.
const UNAPPROVABLE_HOST_SUFFIXES = [
  ".docker",
  ".home",
  ".home.arpa",
  ".internal",
  ".lan",
  ".local",
  ".localdomain",
  ".localhost",
];
const UNAPPROVABLE_HOSTNAMES = new Set([
  "host.docker.internal",
  "localhost",
  "metadata.google.internal",
]);

// Messages from an error and its `cause` ancestry, outermost first. Bounded in
// depth and cycle-safe; tolerates non-Error rejection values.
export function errorMessageChain(error, maxDepth = CAUSE_CHAIN_MAX_DEPTH) {
  const messages = [];
  const seen = new Set();
  let current = error;
  for (let depth = 0; current != null && depth < maxDepth; depth += 1) {
    if (typeof current === "object") {
      if (seen.has(current)) break;
      seen.add(current);
    }
    const raw = typeof current === "string" ? current : (current && current.message);
    const message = String(raw || "").trim();
    if (message) messages.push(message);
    current = typeof current === "object" ? current.cause : null;
  }
  return messages;
}

// The most specific message that looks like a proxy transport failure, or null.
// "fetch failed" tells on-call nothing; the refusal text tells them everything.
// The status-bearing markers are searched FIRST so undici's "Proxy response
// (403)" stays the excerpt even though its outer message also gates.
export function proxyTransportFailureMessage(error) {
  const messages = errorMessageChain(error);
  const matched = messages.find((message) =>
    PROXY_TRANSPORT_FAILURE_MARKERS.some((marker) => marker.test(message)),
  );
  if (matched) return matched;
  return undiciConnectionFailureMessage(messages);
}

// undici's socket-level failure under a ProxyAgent, or null. Anchored on the
// inert outer "fetch failed" so no Chromium text can reach this list.
export function undiciConnectionFailureMessage(errorOrMessages) {
  const messages = Array.isArray(errorOrMessages)
    ? errorOrMessages
    : errorMessageChain(errorOrMessages);
  if (!messages.length || !UNDICI_OUTER_MESSAGE.test(messages[0])) return null;
  return (
    messages
      .slice(1)
      .find((message) =>
        UNDICI_CONNECTION_FAILURE_MARKERS.some((marker) => marker.test(message)),
      ) || null
  );
}

// Playwright's navigation timeout, or null. See NAVIGATION_TIMEOUT_MARKER.
export function navigationTimeoutMessage(error) {
  return (
    errorMessageChain(error).find((message) => NAVIGATION_TIMEOUT_MARKER.test(message)) || null
  );
}

// The proxy's CONNECT status if the client preserved it anywhere in the chain.
export function proxyStatusFromErrorChain(error) {
  for (const message of errorMessageChain(error)) {
    for (const pattern of PROXY_STATUS_PATTERNS) {
      const match = pattern.exec(message);
      if (match) return Number(match[1]);
    }
  }
  return null;
}

function authorityFromUrl(value) {
  let parsed;
  try {
    parsed = new URL(String(value || ""));
  } catch {
    return null;
  }
  if (!parsed.hostname) return null;
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  const port = parsed.port ? Number(parsed.port) : parsed.protocol === "http:" ? 80 : 443;
  if (!Number.isInteger(port) || port <= 0) return null;
  // `URL.hostname` keeps IPv6 brackets off; `host` carries the port only when
  // it is non-default, which is exactly what the operator needs to read.
  return { host: parsed.hostname, port, label: parsed.host };
}

// The host:port the failure is ABOUT. Prefer the URL the failure names — after
// a redirect that is the post-redirect authority the proxy actually refused,
// and probing the pre-redirect one answers 200 and loses the diagnosis
// entirely. Fall back to the URL we asked for when the client preserved none.
export function failureAuthority(message, targetUrl) {
  const text = String(message || "");
  let fromError = null;
  for (const pattern of FAILURE_URL_PATTERNS) {
    const match = pattern.exec(text);
    if (!match) continue;
    fromError = authorityFromUrl(match[1]);
    if (fromError) break;
  }
  const fromTarget = authorityFromUrl(targetUrl);
  const chosen = fromError || fromTarget;
  if (!chosen) {
    return {
      host: "",
      port: ALLOWED_CONNECT_PORT,
      label: String(targetUrl || "").trim() || "the requested host",
      redirectedFrom: null,
    };
  }
  const diverged =
    Boolean(fromError && fromTarget) &&
    (fromError.host !== fromTarget.host || fromError.port !== fromTarget.port);
  return { ...chosen, redirectedFrom: diverged ? fromTarget.label : null };
}

// Why `browser_proxy` would refuse this host no matter who approves what, or
// null. Mirrors `normalize_browser_proxy_host`, which raises
// BrowserProxyPolicyError -> 403 for each of these before any approval is
// consulted.
export function unapprovableHostReason(host) {
  const value = String(host || "").trim().toLowerCase().replace(/\.$/, "");
  if (!value) return null;
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(value) || value.includes(":")) {
    return "IP-literal hosts are refused by policy";
  }
  if (UNAPPROVABLE_HOSTNAMES.has(value)) return "internal hostnames are refused by policy";
  if (UNAPPROVABLE_HOST_SUFFIXES.some((suffix) => value.endsWith(suffix))) {
    return "internal hostnames are refused by policy";
  }
  if (!value.includes(".")) return "single-label hostnames are refused by policy";
  return null;
}

function excerptOf(message) {
  const text = String(message || "").trim();
  return text.length > 200 ? `${text.slice(0, 197)}...` : text;
}

// One sentence per diagnosis. Only ONE branch carries the actionable
// `website_access` wording — that substring is what the operator (and the
// runtime's own docs) search for, so it must appear when, and only when,
// re-requesting the approval is the fix. The bare 403 the proxy answers hides
// three different refusals; production's own decision ORDER separates them
// (`_handle_client` checks the port, then the host, and
// `normalize_browser_proxy_host` raises before either), so the branch is split
// the same way rather than sending every 403 to the approval queue.
export function describeProxyRefusal({
  status,
  outcome,
  reason,
  target,
  excerpt,
  authority = null,
  retriedChallenge = false,
}) {
  const suffix = excerpt ? ` (underlying browser error: ${excerpt})` : "";
  const redirectNote = authority?.redirectedFrom
    ? ` (the navigation redirected there from ${authority.redirectedFrom})`
    : "";
  if (outcome === "unreachable") {
    return (
      `The publisher browser proxy did not answer a CONNECT probe for ${target} (${reason}). `
      + "The proxy itself is unreachable — this is not a missing approval, and re-requesting "
      + `website_access will not change it.${suffix}`
    );
  }
  switch (status) {
    case 403: {
      // Port first, because the proxy checks it first: a non-443 CONNECT can
      // never reach the host check, and `normalize_website_access_resource`
      // rejects registering a non-443 URL, so "go get approval" would be
      // advice that cannot be carried out.
      if (authority && Number.isInteger(authority.port) && authority.port !== ALLOWED_CONNECT_PORT) {
        return (
          `The publisher browser proxy refused the CONNECT tunnel to ${target}${redirectNote} `
          + `because the target port is ${authority.port}. It only tunnels port 443, and an approval `
          + "can only ever be registered for an https URL on port 443 — so this is NOT something an "
          + `approval can grant. Reach the site on its port-443 origin instead.${suffix}`
        );
      }
      const policyReason = authority ? unapprovableHostReason(authority.host) : null;
      if (policyReason) {
        return (
          `The publisher browser proxy refused the CONNECT tunnel to ${target}${redirectNote}: `
          + `${policyReason}. This is the proxy's own host policy, not the thread's approval state, `
          + `so no approval can grant it. Use the site's public hostname instead.${suffix}`
        );
      }
      return (
        `The publisher browser proxy refused the CONNECT tunnel to ${target}${redirectNote}. `
        + "Website access has not been approved for this thread yet — request the website_access "
        + `permission first, then retry.${authority?.host ? ` Approve exactly ${authority.host}.` : ""}`
        + `${suffix}`
      );
    }
    case 407:
      return (
        `The publisher browser proxy rejected our credentials for ${target} (HTTP 407). `
        + "The thread's proxy token was rotated or expired, so this turn is holding a stale one — "
        + "the approval itself is not the problem. Re-read PUBLISHER_BROWSER_PROXY_URL and retry; "
        + `if it keeps happening the thread's proxy context needs to be re-issued.${
          retriedChallenge
            ? " The browser reported only a navigation timeout because the proxy answered with a "
              + "Basic auth challenge and Chromium spent the whole navigation budget re-attempting "
              + "the CONNECT; the 407 above was read back off the proxy directly."
            : ""
        }${suffix}`
      );
    case 405:
      return (
        `The publisher browser proxy rejected the request method for ${target} (HTTP 405). `
        + "It only serves CONNECT tunnels, so this is a client misconfiguration — most often a "
        + `proxy URL pointing at the publisher-proxy REST origin instead of the browser proxy.${suffix}`
      );
    case 502:
    case 504:
      return (
        `The publisher browser proxy could not reach ${target} (HTTP ${status}). `
        + "The tunnel was permitted; the failure is target-side (DNS, refused connection, or a "
        + "timeout on the far end) or upstream of the proxy. This is NOT an approval problem — "
        + `re-requesting website_access will not fix it.${suffix}`
      );
    default:
      return (
        `The publisher browser proxy answered HTTP ${status} for the CONNECT tunnel to ${target}. `
        + `That is neither an approval refusal (403) nor a credentials failure (407).${suffix}`
      );
  }
}

// Returns the diagnosis when `error` is the publisher browser proxy failing a
// tunnel, or null when it is anything else — an unrelated failure must pass
// through untouched rather than be mislabelled.
//
//   browserProxyConfigured — false disables the translation entirely (no proxy
//   in play, e.g. Browserbase mode, where the remote browser owns its egress).
//   proxyUrl / probe / probeTimeoutMs — injection seams for tests.
export async function browserProxyRefusalMessage(
  error,
  {
    targetUrl = "",
    browserProxyConfigured = true,
    proxyUrl = undefined,
    probe = probeProxyConnect,
    probeTimeoutMs = undefined,
  } = {},
) {
  if (!browserProxyConfigured) return null;
  const matched = proxyTransportFailureMessage(error);
  // The narrow second gate. It opens the door and nothing more: below, a
  // timed-out navigation can only ever reach the challenged-407 verdict.
  const timedOut = matched ? null : navigationTimeoutMessage(error);
  if (!matched && !timedOut) return null;
  const gateMessage = matched || timedOut;

  // The authority the failure NAMES, which after a redirect is not the one we
  // asked for — and whose PORT decides whether an approval is even possible.
  const authority = failureAuthority(gateMessage, targetUrl);
  const target = authority.label;
  const excerpt = excerptOf(gateMessage);

  // 1. The client already knows the status (undici). Authoritative for the
  //    request that actually failed — never second-guess it with a probe.
  if (matched) {
    const knownStatus = proxyStatusFromErrorChain(error);
    if (knownStatus !== null) {
      return describeProxyRefusal({
        status: knownStatus,
        outcome: "status",
        target,
        excerpt,
        authority,
      });
    }
  }

  // 2. Chromium collapsed it. Ask the proxy what it answers for this
  //    authority — the same host AND the same port the failure names.
  const resolvedProxyUrl = proxyUrl === undefined ? defaultBrowserProxyUrl() : proxyUrl;
  let result;
  try {
    result = await probe({
      proxyUrl: resolvedProxyUrl,
      host: authority.host,
      port: authority.port,
      ...(probeTimeoutMs === undefined
        ? timedOut
          ? { timeoutMs: TIMEOUT_PATH_PROBE_TIMEOUT_MS }
          : {}
        : { timeoutMs: probeTimeoutMs }),
    });
  } catch (probeError) {
    result = { outcome: "unavailable", reason: probeError?.message || "probe-failed" };
  }

  if (timedOut) {
    // The ONE shape a bare navigation timeout is allowed to diagnose: the
    // proxy is answering 407 AND offering a Basic challenge, which is what
    // makes Chromium retry until the budget is gone. Everything else on this
    // path — including a 403, a 502 or an unreachable proxy — passes the
    // timeout through untouched, because a slow site is overwhelmingly the
    // likelier explanation and a wrong confident diagnosis is the defect this
    // module exists to prevent.
    if (result?.outcome === "status" && result.status === 407 && result.authChallenge) {
      return describeProxyRefusal({
        status: 407,
        outcome: "status",
        target,
        excerpt,
        authority,
        retriedChallenge: true,
      });
    }
    return null;
  }

  if (result?.outcome === "status") {
    // A probe that now succeeds means the tunnel is permitted and the original
    // failure was something else — pass the original error through rather than
    // invent a proxy diagnosis for it.
    if (result.status === 200) return null;
    return describeProxyRefusal({
      status: result.status,
      outcome: "status",
      target,
      excerpt,
      authority,
    });
  }
  if (result?.outcome === "unreachable") {
    return describeProxyRefusal({
      outcome: "unreachable",
      reason: result.reason || "no answer",
      target,
      excerpt,
      authority,
    });
  }

  // 3. Indeterminate (no proxy URL to probe with, or the probe could not run).
  //    Do not guess: an unlabelled transport error is better than a confident
  //    wrong diagnosis, which is the whole finding this branch exists for.
  return null;
}

// Rethrow helper: the diagnosis when this was a proxy tunnel failure,
// otherwise the original error untouched. The original always rides along as
// `cause` so nothing is lost.
export async function rethrowAsBrowserProxyRefusal(err, options) {
  const actionable = await browserProxyRefusalMessage(err, options);
  if (!actionable) throw err;
  throw new Error(actionable, { cause: err });
}

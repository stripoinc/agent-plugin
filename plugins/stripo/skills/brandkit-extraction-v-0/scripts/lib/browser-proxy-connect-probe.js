// Ask the publisher browser proxy directly what it answers for a CONNECT to a
// given host, instead of inferring it from a browser's collapsed error code.
//
// Why this exists: Chromium reports EVERY non-200 CONNECT as
// `ERR_TUNNEL_CONNECTION_FAILED`. The proxy answers 403 for a missing
// approval, 407 for missing/stale proxy credentials, 405 for a non-CONNECT
// method, 504 on a connect timeout to the target, and 502 on `except
// Exception` — which an ordinary target-side DNS failure produces
// (`resolve_public_targets` -> `getaddrinfo` -> gaierror). Reading "missing
// approval" out of that single code tells an already-approved thread whose
// target site is briefly down to go get approval again; the human re-approves,
// nothing changes, and the next turn fails identically.
//
// undici needs no probe — its error chain carries the literal status
// ("Proxy response (403) !== 200 when HTTP Tunneling", verified against undici
// 7.29.0 for 403/405/407/502/504). This module is the Chromium half.
//
// The probe is a plain CONNECT on the failure path only: one short-lived
// socket, bounded by `timeoutMs`, torn down as soon as the status line
// arrives (never completing a tunnel, even on 200).
//
// ONE status is read further than its status line: 407. Production always
// attaches `Proxy-Authenticate: Basic realm="publisher-browser-proxy"`
// (browser_proxy.py `_write_proxy_response`), and that header is what makes
// real Chromium re-attempt the CONNECT with credentials until the whole
// navigation budget is gone — surfacing as a plain `Timeout Nms exceeded`
// with no proxy marker in it anywhere. The classifier cannot recognise that
// shape from the browser's error, so the probe reports the challenge and the
// classifier branches on THAT. Reading a few more bytes on a 407 is free: the
// proxy has already refused, so there is no tunnel to avoid completing.

import net from "node:net";
import tls from "node:tls";

export const DEFAULT_PROBE_TIMEOUT_MS = 5000;
// A 407's header block is one short line past the status line. Cap the wait
// so a proxy that never terminates its headers cannot stall the probe.
const HEADER_BLOCK_LIMIT_BYTES = 4096;

// Outcomes:
//   { outcome: "status", status, statusText, authChallenge } — the proxy
//                                               answered. `authChallenge` is
//                                               the `Proxy-Authenticate`
//                                               value on a 407 (null
//                                               otherwise, and on any other
//                                               status).
//   { outcome: "unreachable", reason }        — no answer (not listening,
//                                               refused, reset, timed out).
//   { outcome: "unavailable", reason }        — we could not even ask (no
//                                               proxy URL, unparseable URL,
//                                               no target host).
export function probeUnavailable(reason) {
  return { outcome: "unavailable", reason };
}

// THE proxy-URL parser for this skill. Every client that has to turn
// `http://token:secret@host:port` into something usable goes through here —
// the CONNECT probe below, lib.js (Playwright `{server, username, password}`),
// save-logo-asset.js (undici `{uri, token}`) and the Browserbase connector
// (`{host, port, authorization}`). They need different SHAPES, so this returns
// every field they collectively need and each one picks; what must never
// diverge again is the PARSING — three hand-rolled copies had already drifted
// on the default port (80 for every scheme instead of 443 for https:) and on
// whether a non-http(s) scheme is rejected at all.
//
// Returns `null` for blank, unparseable, non-http(s) and bad-port URLs, so a
// caller cannot accidentally build a dispatcher out of a nonsense value.
//
//   protocol      "http:" / "https:"
//   hostname      host without port
//   host          host AS WRITTEN (port only when the URL carried one) — the
//                 form Playwright's `proxy.server` and undici's `uri` take
//   port          resolved number (explicit, else 443 for https:, else 80)
//   username      decoded, "" when absent
//   password      decoded, "" when absent
//   authorization "Basic <base64>", "" when there are no credentials
export function parseProxyUrl(proxyUrl) {
  const raw = String(proxyUrl || "").trim();
  if (!raw) return null;
  let parsed;
  try {
    parsed = new URL(raw);
  } catch {
    return null;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return null;
  const port = parsed.port ? Number(parsed.port) : parsed.protocol === "https:" ? 443 : 80;
  if (!Number.isInteger(port) || port <= 0) return null;
  const username = parsed.username ? decodeURIComponent(parsed.username) : "";
  const password = parsed.password ? decodeURIComponent(parsed.password) : "";
  let authorization = "";
  if (parsed.username) {
    // `Buffer.from(s)` is utf8 by default; the explicit "utf8" some call sites
    // used to pass was a no-op, so the encoding is unchanged by consolidation.
    authorization = `Basic ${Buffer.from(`${username}:${password}`).toString("base64")}`;
  }
  return {
    protocol: parsed.protocol,
    hostname: parsed.hostname,
    host: parsed.host,
    port,
    username,
    password,
    authorization,
  };
}

function parseStatusLine(text) {
  const match = /^HTTP\/\d(?:\.\d)?\s+(\d{3})(?:\s+([^\r\n]*))?/i.exec(text);
  if (!match) return null;
  return { status: Number(match[1]), statusText: (match[2] || "").trim() };
}

// The `Proxy-Authenticate` value, or null. Its presence is the difference
// between "Chromium reports ERR_PROXY_AUTH_UNSUPPORTED straight away" and
// "Chromium retries until the navigation budget expires".
function parseAuthChallenge(headerBlock) {
  for (const line of String(headerBlock || "").split("\r\n").slice(1)) {
    const colon = line.indexOf(":");
    if (colon === -1) continue;
    if (line.slice(0, colon).trim().toLowerCase() !== "proxy-authenticate") continue;
    const value = line.slice(colon + 1).trim();
    if (value) return value;
  }
  return null;
}

export async function probeProxyConnect({
  proxyUrl,
  host,
  port = 443,
  timeoutMs = DEFAULT_PROBE_TIMEOUT_MS,
} = {}) {
  const proxy = parseProxyUrl(proxyUrl);
  if (!proxy) return probeUnavailable("no-proxy-url");
  const target = String(host || "").trim();
  if (!target) return probeUnavailable("no-target-host");

  return new Promise((resolve) => {
    let settled = false;
    let buffer = "";
    let socket;
    // Set once a status line has been parsed but we are still waiting for the
    // header block (407 only). A proxy that answers and immediately closes
    // must still yield its status, not "closed-without-status".
    let pendingStatus = null;

    const finish = (value) => {
      if (settled) return;
      settled = true;
      try {
        socket?.destroy();
      } catch {
        // The socket is already gone; the answer is what matters.
      }
      resolve(value);
    };

    try {
      socket =
        proxy.protocol === "https:"
          ? tls.connect({ host: proxy.hostname, port: proxy.port, servername: proxy.hostname })
          : net.connect({ host: proxy.hostname, port: proxy.port });
    } catch (error) {
      finish({ outcome: "unreachable", reason: error?.code || error?.message || "connect-failed" });
      return;
    }

    socket.setTimeout(timeoutMs);
    socket.on("timeout", () =>
      finish(pendingStatus || { outcome: "unreachable", reason: "timeout" }),
    );
    socket.on("error", (error) =>
      finish(
        pendingStatus || {
          outcome: "unreachable",
          reason: error?.code || error?.message || "socket-error",
        },
      ),
    );
    socket.on("close", () =>
      finish(pendingStatus || { outcome: "unreachable", reason: "closed-without-status" }),
    );

    const sendConnect = () => {
      const authority = `${target}:${port}`;
      const headers = [
        `CONNECT ${authority} HTTP/1.1`,
        `Host: ${authority}`,
        proxy.authorization ? `Proxy-Authorization: ${proxy.authorization}` : null,
        "Proxy-Connection: close",
        "",
        "",
      ]
        .filter((line) => line !== null)
        .join("\r\n");
      socket.write(headers);
    };
    socket.once(proxy.protocol === "https:" ? "secureConnect" : "connect", sendConnect);

    socket.on("data", (chunk) => {
      buffer += chunk.toString("latin1");
      const lineEnd = buffer.indexOf("\r\n");
      if (lineEnd === -1 && buffer.length < 512) return;
      const statusLine = parseStatusLine(lineEnd === -1 ? buffer : buffer.slice(0, lineEnd));
      if (!statusLine) {
        finish({ outcome: "unreachable", reason: "unparseable-status-line" });
        return;
      }
      if (statusLine.status === 407) {
        // Keep reading to the end of the header block: whether Chromium will
        // burn the navigation budget on a retry loop is decided by
        // `Proxy-Authenticate`, not by the status. There is no tunnel here to
        // avoid completing — the proxy refused.
        pendingStatus = { outcome: "status", ...statusLine, authChallenge: null };
        const blockEnd = buffer.indexOf("\r\n\r\n");
        if (blockEnd === -1 && buffer.length < HEADER_BLOCK_LIMIT_BYTES) return;
        const headerBlock = blockEnd === -1 ? buffer : buffer.slice(0, blockEnd);
        finish({ ...pendingStatus, authChallenge: parseAuthChallenge(headerBlock) });
        return;
      }
      // Tear down immediately: on a 200 the proxy is now tunnelling, and this
      // probe must never become a second live connection to the target.
      finish({ outcome: "status", ...statusLine, authChallenge: null });
    });
  });
}

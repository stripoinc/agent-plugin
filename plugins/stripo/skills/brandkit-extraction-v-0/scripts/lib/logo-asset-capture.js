// Keep the logo bytes the render already downloaded.
//
// WHY THIS EXISTS. `brand.logos[].svgPath` is a REQUIRED schema field, and the
// only producer today is `save-logo-asset.js`, which re-fetches the logo
// THROUGH the publisher browser proxy. That proxy admits only the hosts the
// thread's egress grant covers, so a logo on a third-party CDN
// (cdn.shopify.com, res.cloudinary.com, ...) is refused and `svgPath` can
// never be filled. In production the page renders in Browserbase mode, where
// the REMOTE browser already downloaded that exact file on Browserbase's own
// network while painting the page. This module keeps those bytes instead of
// throwing them away and re-asking for an authorization we deliberately do
// not grant.
//
// EGRESS DISCIPLINE — the single most important property of this file.
// Nothing here may ever open a socket from THIS process. Specifically:
//
//   * NO `context.request` / APIRequestContext. Under `connectOverCDP` (the
//     Browserbase path) Playwright's request context issues Node http/https
//     from the Playwright *server*, which IS this process — i.e. no egress at
//     all, and in the local path it would bypass the approved proxy.
//   * NO undici / ProxyAgent / fetch. That is `save-logo-asset.js`'s job and
//     it needs the grant this module exists to avoid needing.
//   * NO `page.evaluate(fetch)`. Cross-origin CDN images answer opaque.
//
// Both tiers below get their bytes from the BROWSER:
//   Tier 1 — `offer()` is called from the shared `page.on("response")`
//            handler in `lib.js` with a body thunk that resolves to
//            `Response.body()` (CDP `Network.getResponseBody`).
//   Tier 2 — `fetchSvgViaBrowser()` navigates a scratch page to the URL and
//            reads the navigation response body. The browser performs the
//            fetch, so it goes out over Browserbase's network and CORS does
//            not apply.
//
// BOTH TIERS AWAIT A BODY, AND AN AWAITED BODY NEEDS A DEADLINE. An origin
// that answers with SVG headers and then stalls parks a promise that never
// settles, and no caller above can catch that because a hang is not an error.
// See "Time bounds" below.
//
// TIER 1 IS SVG ONLY. `svgPath` is the only thing a page-response body can
// become on the Tier-1 path, so keeping raster bodies out of the response
// listener costs nothing downstream and keeps the cache's memory bound honest.
//
// TIER 2 ALSO KEEPS RASTER BYTES THE CONSUMER CANNOT USE AS A URL. A logo
// served as `.webp`/`.avif`, or from an extensionless CDN path, is a REAL mark
// with a REAL public URL — and an email client cannot render it. Nothing
// downstream can fix that from the URL alone, so the finalizer converts the
// bytes to PNG and hosts them; that is only possible if the bytes still exist
// when the finalizer runs, which is what these `kind: "raster"` entries are.
// `png/jpg/jpeg/gif` candidates are still skipped untouched: their own URL is
// already email-safe and rewriting it would trade a working asset for a risk.

import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

import {
  canonicalizeSvgForSafetyScan,
  svgInnerMarkupIsUnsafe,
  SVG_DANGEROUS_PATTERNS,
} from "./content-validators.js";
import { findFirstUnsafePublicString } from "./unsafe-public-strings.js";
import { looksLikeSvgMarkup, svgPathPayloadFromMarkup } from "./svg-path-extract.js";

// --- Caps -------------------------------------------------------------
// FIVE of the six are deliberately conservative. A brand logo that does not
// fit in 256 KB is not a logo. Watch `skipped[].reason === "body-over-cap"`
// and `entries[].svgPathSuppressed` on early production runs before relaxing
// any of them — the numbers are reasoned, not measured.
//
// `LOGO_ASSET_MAX_ENTRIES` is NOT one of the five and must not be read as a
// sizing claim: it is a pathology backstop behind `logoBodyKeepRule`, and the
// note on it says why.

// Per-asset ceiling. Enforced against the DELIVERED buffer, the moment it
// arrives — that check is the bound, and it is what keeps an over-cap body
// from being retained (see `retain` below).
//
// `content-length` is ALSO checked before the body thunk runs, but only as a
// cheap optimization that saves a CDP round trip, never as the bound: the
// header carries the COMPRESSED size while `Response.body()` returns
// DECOMPRESSED bytes, and CDN-served SVG is gzip/br at ~5-10x, so a
// content-length under this cap routinely fronts a body several times over
// it. The pre-check is only ever allowed to REJECT (compressed > cap implies
// decompressed > cap); admitting is the delivered buffer's job.
export const LOGO_ASSET_MAX_BYTES = 256 * 1024;
// Whole-run ceiling across every retained body. Also applied at retain time,
// so it bounds RESIDENT memory and not merely `settle()`'s output.
export const LOGO_ASSET_TOTAL_MAX_BYTES = 1024 * 1024;
// A PATHOLOGY BACKSTOP ON PARKED READS, AND NOTHING MORE. It is NOT a claim
// that 512 SVG responses is enough for any page — `logoBodyKeepRule` is what
// makes the collection lossless, and this only bounds a page that defeats it
// (a sprite farm requesting thousands of individual SVG icons).
//
// It never was the memory bound. `LOGO_ASSET_TOTAL_MAX_BYTES` is, and it is
// applied in `retain()` the moment each body arrives: 12 x
// `LOGO_ASSET_MAX_BYTES` was already 3x that ceiling, so the old 12 bounded
// nothing the total-byte cap did not bound first. What it DID do was decide,
// in network arrival order and before any relevance was known, which twelve
// bodies the page got to keep — and `accepted` never decreases, so a logo
// requested thirteenth lost its bytes for good, taking `svgPath` and the
// finalizer-hosted PNG with it.
//
// What this number does bound is `pending[]`: one parked CDP
// `Network.getResponseBody` round trip is issued per admitted URL, whether or
// not `retain()` ends up keeping the body.
export const LOGO_ASSET_MAX_ENTRIES = 512;
// Hard stop on `skipped[]` rows. Diagnostics must not become the payload: a
// 2,000-icon page produced a 240 KB `logo-assets.json` of nothing but
// `entry-cap` rows before this existed. Overflow is reported as a single
// `skipped-truncated` row carrying the count.
export const LOGO_ASSET_MAX_SKIPPED = 64;
// Tier-2 budget. Each miss costs a page open + navigation.
export const LOGO_ASSET_MAX_BROWSER_FETCHES = 3;
// House cap on the emitted `svgPath` string, matching `browser_proxy.py`'s
// body cap and the Browserbase connector's head caps. A logo whose inner
// markup exceeds this is an illustration, not a mark.
export const LOGO_SVG_PATH_MAX_CHARS = 16 * 1024;

const TIER2_NAVIGATION_TIMEOUT_MS = 15_000;

// --- Time bounds ------------------------------------------------------
//
// EVERY AWAITED BODY READ NEEDS ONE. `Response.body()` has no timeout of its
// own — Playwright resolves it only once the response is COMPLETE — so an
// origin that answers a logo-ish request with `content-type: image/svg+xml`
// and then stalls the body parks a promise that never settles. Nothing above
// rescues that: `homepage-pass.js` wraps the phase in try/catch, and A HANG IS
// NOT AN ERROR, so `browser.close()` in the `finally` is never reached,
// `homepage-pass-status.json` stays `running`/`logoAssets` forever, the agent's
// 5-minute staleness rule re-invokes the pass (which hangs again), Chromium
// leaks in the runtime container, and a Browserbase session bills to its 1200s
// ceiling. Ordinary flaky-CDN behaviour produces this; a hostile page produces
// it on purpose. Both tiers await a body, so both tiers are bounded.
//
// TWO CEILINGS, because they bound different things.
//
// PER READ. The bytes are ALREADY IN THE BROWSER when either read is issued:
// Tier 1 fires its thunk from inside `page.on("response")`, and Tier 2 reads a
// navigation that `waitUntil: "commit"` has already resolved. What is being
// timed is therefore one CDP `Network.getResponseBody` round trip for at most
// `LOGO_ASSET_MAX_BYTES` (256 KB) — ~1 ms locally, tens of ms over
// Browserbase's remote websocket. 5s is ~100x headroom, and it is deliberately
// WELL UNDER the 15s navigation convention above: a navigation pays DNS + TCP
// + TLS + first byte, a read of an already-committed response pays none of
// them. A 256 KB SVG that has not finished arriving 5s after its headers did
// is a stalled origin by any measure.
//
// PER PHASE. A per-read bound alone does NOT bound the phase. It does bound
// `settle()` — every parked read was fired in `offer()`, and they are raced
// CONCURRENTLY, so N reads each under a bound of B settle within B and not
// N x B. But `collectLogoAssets`'s Tier-2 loop is SEQUENTIAL: up to
// `LOGO_ASSET_MAX_BROWSER_FETCHES` navigations, each a 15s navigation plus a
// 5s read, is 60s of wall clock on top of the 45s of navigation that was
// already unbounded in aggregate before any of this. 30s caps the whole call
// instead. A healthy run spends ~1s here (settle is microseconds; a real CDN
// answers an SVG in well under a second), so this only bites once two fetches
// have already gone pathological — and it is far below both the 100s+
// `productCardStyles` / `buttonStyles` routinely take and the SKILL's 5-minute
// staleness rule.
export const LOGO_BODY_READ_TIMEOUT_MS = 5_000;
export const LOGO_ASSET_PHASE_BUDGET_MS = 30_000;

// Resolve to `timedOut()`'s value when `ms` elapses before `promise` settles.
//
// `promise` MUST NOT REJECT. The losing arm of a race is abandoned with no
// further handler attached, and an abandoned rejected promise is an unhandled
// rejection — which Node turns into process death, the precise outcome the
// header of this file says is impossible. Both call sites therefore map
// rejection to a VALUE before racing.
//
// `timedOut` MUST NOT THROW, for the same reason `errorText` must not: it runs
// in a timer callback, where a throw is an uncaught exception rather than a
// rejected promise.
//
// THE TIMER IS CLEARED ON EVERY WINNING PATH, including the timer's own. This
// module runs inside CLI scripts, where a live `setTimeout` holds the event
// loop open and delays process exit by up to `ms` after all the work is done.
// And no timer is armed at all unless a read is actually awaited: `offer()`
// parks reads without one, so the eight `openPage` callers that never call
// `settle()` never create one.
function raceWithDeadline(promise, ms, timedOut) {
  if (!Number.isFinite(ms) || ms <= 0) return promise;
  let timer;
  const expiry = new Promise((resolve) => {
    timer = setTimeout(() => resolve(timedOut()), ms);
  });
  return Promise.race([promise, expiry]).then((result) => {
    clearTimeout(timer);
    return result;
  });
}

// --- Screening --------------------------------------------------------

// True when the descriptor looks like an SVG asset.
//
// SCHEME FIRST, ahead of the content-type shortcut. This is the gate at the
// top of `collectLogoAssets`'s per-candidate loop, and every candidate it
// sees is PAGE-CONTROLLED (see `fetchSvgViaBrowser`). Admitting a non-http(s)
// candidate here cannot leak bytes — `fetchSvgViaBrowser` refuses the
// navigation and that is the boundary — but it would still SPEND one of the
// three Tier-2 budget slots per hostile `<img>`, starving the real CDN logo.
// Rejecting here makes such a candidate cost nothing, exactly like a PNG.
// Ordered before the content-type branch so that a supplied content-type can
// never rescue a non-http(s) URL; `contentTypeByUrl` is built from HTTP
// responses, so in practice one never exists for these.
//
// Content-type otherwise wins; the extension is the fallback for CDNs that
// serve extensionless URLs (`res.cloudinary.com/.../image/upload/v1/logo`)
// and the pathname check survives cache-busting query strings
// (`cdn.shopify.com/.../logo.svg?v=1712345678`) because `URL.pathname`
// excludes the query.
// Path extensions whose URL an email client already renders. A candidate with
// one of these is left ENTIRELY alone — no Tier-2 navigation, no bytes, no
// entry — because the URL the page published is already a usable email asset
// and hosting a copy would only add a way for it to go wrong.
const EMAIL_SAFE_RASTER_EXTENSIONS = [".png", ".jpg", ".jpeg", ".gif"];

// Path extensions the sniff below CANNOT accept, whatever the bytes turn out
// to be: `rasterImageExtension` returns a format only for PNG, JPEG, GIF, WebP
// and AVIF, so an icon or a TIFF can only ever come back `not-raster-bytes` —
// after the navigation was spent. Measured on 50 captured runs: 9 of the 20
// Tier-2 navigations went to a `favicon.ico`, and on two of those sites the
// favicon took a slot from a `.webp` that then hit `browser-fetch-budget`.
// This is a BUDGET rule, not a safety one; the outcome for such a URL is the
// `not-svg` skip row a `.png` already gets, so no asset is lost by it.
// `.svgz` cannot reach here (`isSvgAsset` claims it) and is listed for the
// same reason the others are: the sniff has no branch for it.
const NEVER_SNIFFABLE_RASTER_EXTENSIONS = [".ico", ".bmp", ".tif", ".tiff", ".svgz"];

// True when a non-SVG candidate is worth spending Tier-2 budget on: an http(s)
// URL whose path extension is NOT already email-safe and is not one the sniff
// must reject. That is `.webp`, `.avif`, and every extensionless CDN path —
// exactly the set whose bytes the finalizer has to convert because the URL
// cannot be handed to an email client.
//
// SCHEME-GATED for the same reason `isSvgAsset` is: `fetchAssetViaBrowser`
// refuses a non-http(s) navigation, but a candidate admitted here would still
// spend one of the three Tier-2 slots on the way to that refusal.
export function isRasterHostingCandidate({ url = "" } = {}) {
  let parsed;
  try {
    parsed = new URL(String(url));
  } catch {
    return false;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
  const pathname = parsed.pathname.toLowerCase();
  if (NEVER_SNIFFABLE_RASTER_EXTENSIONS.some((extension) => pathname.endsWith(extension))) {
    return false;
  }
  return !EMAIL_SAFE_RASTER_EXTENSIONS.some((extension) => pathname.endsWith(extension));
}

// Magic-byte sniff, because the CONTENT-TYPE IS NOT EVIDENCE HERE. These
// candidates reach Tier 2 precisely because their URL said nothing about the
// format, and a CDN that serves an extensionless transform URL routinely
// answers `application/octet-stream` — or an HTML error page under
// `image/webp`. The finalizer decodes these bytes with Pillow, so admitting a
// non-image body would turn a hotlink-protected 200 into a `convert-failed`
// several minutes later instead of a `not-raster-bytes` row right here.
//
// Returns the canonical file extension for the sniffed format, or "" .
export function rasterImageExtension(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return "";
  if (
    buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47
    && buffer[4] === 0x0d && buffer[5] === 0x0a && buffer[6] === 0x1a && buffer[7] === 0x0a
  ) {
    return "png";
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "jpg";
  if (buffer.subarray(0, 6).toString("latin1") === "GIF87a") return "gif";
  if (buffer.subarray(0, 6).toString("latin1") === "GIF89a") return "gif";
  if (
    buffer.subarray(0, 4).toString("latin1") === "RIFF"
    && buffer.subarray(8, 12).toString("latin1") === "WEBP"
  ) {
    return "webp";
  }
  if (buffer.subarray(4, 8).toString("latin1") === "ftyp") {
    const brand = buffer.subarray(8, 12).toString("latin1");
    if (brand === "avif" || brand === "avis") return "avif";
  }
  return "";
}

export function isSvgAsset({ url = "", contentType = "" } = {}) {
  let parsed;
  try {
    parsed = new URL(String(url));
  } catch {
    return false;
  }
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
  const type = String(contentType || "").split(";")[0].trim().toLowerCase();
  if (type === "image/svg+xml" || type === "image/svg") return true;
  const pathname = parsed.pathname.toLowerCase();
  return pathname.endsWith(".svg") || pathname.endsWith(".svgz");
}

// THE KEEP RULE — the Tier-1 cache's admissibility contract, stated once.
//
// WHY A RULE AND NOT A CAP. `offer()` used to admit the first
// `LOGO_ASSET_MAX_ENTRIES` SVG responses and refuse every later one with
// `entry-cap`. That is network arrival order: a decision taken BEFORE
// anything relevant about the asset is known, and never revisited. Measured
// in production, on unchanged extraction code: a storefront whose logo was
// captured and hosted one week captured nothing eight days later, its own
// `mobile-logo.svg` sitting in `skipped[]` under `entry-cap` — the page had
// simply grown enough other SVGs to fill the twelve slots first.
//
// WHAT THE CONSUMERS CAN USE, which is what this has to be a superset of. A
// retained body reaches nobody except through `collectLogoAssets`, which
// matches it against `rankLogoCandidates`'s own URL list and writes an
// `entries[]` row; from there `svgPathIndexFromLogoAssets` (url-keyed, below)
// feeds the ranker's `svgPath` graft, and the finalizer reads the matched row's
// `localPath` to mint the hosted PNG. Both key on the entry's URL, and
// that URL comes from the DOM — so at `offer()` time, inside
// `page.on("response")` and long before any candidate list exists, NOTHING
// about a response can rule it out except that it is not an SVG the page
// successfully fetched. That is exactly what this predicate says.
//
// Deliberately COARSER than either consumer's own test — it knows nothing of
// the markup, of the safety screen, or of which URLs the ranker will name — so
// it is a strict SUPERSET of what can be used, and refusing here can never
// refuse something a consumer wanted. `logo-asset-capture.test.js` pins that
// direction: every entry a consumer accepts must pass this predicate.
//
// A refusal here is SILENT — no `skipped[]` row. A page serves hundreds of
// non-SVG responses, and one row each would make diagnostics the payload
// (the same failure `LOGO_ASSET_MAX_SKIPPED` exists to bound).
export function logoBodyKeepRule(descriptor) {
  if (!descriptor || typeof descriptor !== "object") return false;
  const url = typeof descriptor.url === "string" ? descriptor.url : "";
  if (!url) return false;
  // Only 2xx/3xx carry a usable body.
  const status = Number(descriptor.status);
  if (!Number.isFinite(status) || status < 200 || status >= 400) return false;
  // A `document` response is the page itself (or a Tier-2 navigation);
  // `script`/`stylesheet`/`fetch`/`xhr` are not how an <img> logo arrives.
  // `other` is kept because headless Chromium reports `<link rel=icon>` and
  // `mask-icon` fetches there.
  const resourceType = String(descriptor.resourceType || "");
  if (resourceType !== "image" && resourceType !== "other") return false;
  return isSvgAsset({ url, contentType: String(descriptor.contentType || "") });
}

// True when the reduced markup is safe to publish as `brand.logos[].svgPath`.
//
// TWO validators, not one, and they carry DIFFERENT consequences downstream:
//   * `SVG_DANGEROUS_PATTERNS` (lib/content-validators.js) → a finalize-time
//     exit-4 content blocker;
//   * `findFirstUnsafePublicString` (lib/unsafe-public-strings.js) → a
//     normalize-time HARD REJECT that fails the whole run.
// A captured logo must never be able to turn an otherwise good extraction
// into a hard failure, so anything either validator dislikes is suppressed to
// `""` — which is exactly what ships today for most runs.
// `enforceCap` is FALSE ONLY where the caller is asking a different question
// than "may this string be published". `LOGO_SVG_PATH_MAX_CHARS` is a cap on
// the PUBLISHED `svgPath` and nothing else; the ORIGINAL document those
// characters were reduced from can still be a perfectly safe 22 KB mark whose
// bytes the finalizer can host as a PNG. Distinguishing "too long to publish"
// from "unsafe" is what `svgPathSuppressionReason` exists for, and it cannot
// be asked without a way to re-run every OTHER check on its own.
export function isPubliclySafeSvgPath(svgPath, { enforceCap = true } = {}) {
  if (typeof svgPath !== "string" || svgPath.length === 0) return false;
  if (enforceCap && svgPath.length > LOGO_SVG_PATH_MAX_CHARS) return false;
  const canonicalSvgPath = canonicalizeSvgForSafetyScan(svgPath);
  for (const pattern of SVG_DANGEROUS_PATTERNS) {
    if (pattern.regex.test(canonicalSvgPath)) return false;
  }
  if (svgInnerMarkupIsUnsafe(svgPath)) return false;
  if (findFirstUnsafePublicString(svgPath) !== null) return false;
  return true;
}

// Screen the COMPLETE standalone document as well as the reduced inner
// `svgPath`. Root attributes disappear during reduction, so checking only the
// payload would miss active markup such as `<svg onload="...">` even though
// the original bytes are retained for finalizer-owned upload.
export function isPubliclySafeSvgDocument(markup, svgPath, { enforceCap = true } = {}) {
  if (!isPubliclySafeSvgPath(svgPath, { enforceCap })) return false;
  if (typeof markup !== "string" || markup.length === 0) return false;
  const canonicalMarkup = canonicalizeSvgForSafetyScan(markup);
  for (const pattern of SVG_DANGEROUS_PATTERNS) {
    if (pattern.regex.test(canonicalMarkup)) return false;
  }

  // `svgInnerMarkupIsUnsafe` parses a fragment inside a trusted SVG wrapper.
  // A standalone XML declaration is legal only at the start of the document,
  // so remove that declaration before treating the complete root as a child.
  const fragment = markup.replace(/^\uFEFF?\s*<\?xml(?:\s[^?]*)?\?>/iu, "");
  if (svgInnerMarkupIsUnsafe(fragment)) return false;
  return true;
}

// WHY a suppression was recorded \u2014 `null` when nothing was suppressed.
//
// ONE BOOLEAN COULD NOT SAY THIS, and the difference decides whether a real
// brand mark reaches the customer's email at all. `svgPathSuppressed: true`
// covers two utterly different facts: "the reduced markup is 22 KB, over the
// house cap on a PUBLISHED string" and "the document contains active markup".
// The first leaves safe bytes on disk that the finalizer can host as a PNG;
// the second must never be uploaded anywhere. Only the producer, standing in
// front of both checks, can tell them apart.
//
// "over-cap" is deliberately the NARROW answer: it is returned only when the
// character cap is the SOLE failing check. Anything else \u2014 a dangerous
// pattern, unsafe inner markup, an unsafe public string, an empty reduction,
// an unsafe root attribute on the complete document \u2014 is "unsafe", including
// when it is ALSO over the cap. A consumer may therefore treat "unsafe" as
// "never host" without re-deriving anything.
export function svgPathSuppressionReason(markup, svgPath) {
  if (isPubliclySafeSvgDocument(markup, svgPath)) return null;
  if (
    typeof svgPath === "string"
    && svgPath.length > LOGO_SVG_PATH_MAX_CHARS
    && isPubliclySafeSvgDocument(markup, svgPath, { enforceCap: false })
  ) {
    return "over-cap";
  }
  return "unsafe";
}

// --- Tier 1: retain bodies the page already fetched -------------------

// A size-bounded cache of SVG response bodies.
//
// `offer()` is the ONLY entry point and it runs inside the shared
// `page.on("response")` handler. Two hard requirements follow from that:
//
//   1. IT MUST BE SYNCHRONOUS. The handler is not awaited; returning a
//      promise would let the page navigate away (evicting the CDP body)
//      before the read is issued. The body thunk is therefore invoked
//      immediately and its promise parked.
//   2. IT MUST NEVER THROW. A single exception out of a `page.on` listener
//      kills the listener for EVERY subsequent response on that page — which
//      would silently take `observedRequests` / `observedAssetUrls` with it.
//      Every failure, including a rejected body promise, lands in `skipped[]`.
//
// AND THE CAPS ARE MEMORY BOUNDS, NOT OUTPUT BOUNDS. They are applied in
// `retain()`, the moment a body arrives, because `pending[]` holds each
// parked read's resolution value for the LIFE OF THE CACHE and 8 of the 9
// `openPage` callers never call `settle()`. Checking the sizes in `settle()`
// would bound only what `settle()` returns while the process still held
// `maxEntries x unbounded` bytes.
export function createLogoBodyCache({
  maxBytes = LOGO_ASSET_MAX_BYTES,
  totalMaxBytes = LOGO_ASSET_TOTAL_MAX_BYTES,
  maxEntries = LOGO_ASSET_MAX_ENTRIES,
  maxSkipped = LOGO_ASSET_MAX_SKIPPED,
  readTimeoutMs = LOGO_BODY_READ_TIMEOUT_MS,
} = {}) {
  // Parked body reads, in offer order. Each element is
  // `{ read, expire }`: `read` already resolves to a settled record and never
  // rejects, and `expire()` is what `settle()`'s deadline calls to give up on
  // it. The deadline lives in `settle()` rather than here so that no timer is
  // armed for a cache nobody settles.
  const pending = [];
  const skipped = [];
  // Every URL this cache has already RULED ON, whether it was admitted or
  // refused. Refusals belong here too: a page that re-requests the same icon
  // 500 times would otherwise append 500 identical `entry-cap` rows.
  const seenUrls = new Set();
  let accepted = 0;
  let skippedOverflow = 0;
  // Running total of bytes actually held, maintained at retain time.
  let totalBytes = 0;

  const skip = (url, reason, detail) => {
    if (skipped.length >= maxSkipped) {
      skippedOverflow += 1;
      return;
    }
    skipped.push(detail === undefined ? { url, reason } : { url, reason, detail });
  };

  // Apply both byte caps to a delivered body and either keep it or DROP IT
  // HERE. Returning without the buffer is the whole point: the resolution
  // value of the parked promise is the only strong reference to those bytes,
  // so an over-cap body becomes collectable immediately instead of sitting in
  // `pending[]` until the process exits.
  const retain = (url, contentType, body) => {
    const buffer = Buffer.isBuffer(body) ? body : Buffer.from(body ?? []);
    // Headers lie, chunked responses carry no length, and a `content-length`
    // that passed the pre-check was the COMPRESSED size. This is the bound.
    if (buffer.length > maxBytes) {
      return { ok: false, url, reason: "body-over-cap", detail: buffer.length };
    }
    if (totalBytes + buffer.length > totalMaxBytes) {
      return { ok: false, url, reason: "total-cap", detail: buffer.length };
    }
    totalBytes += buffer.length;
    return { ok: true, url, contentType, buffer };
  };

  const offer = (descriptor) => {
    try {
      if (!descriptor || typeof descriptor !== "object") return;
      const url = typeof descriptor.url === "string" ? descriptor.url : "";
      if (!url) return;
      const contentType = String(descriptor.contentType || "");

      // THE KEEP RULE, and the ONLY admissibility test this cache applies.
      // Silent on refusal — see `logoBodyKeepRule`. There is exactly one copy
      // of it: `offer` calls the exported function rather than restating it,
      // and the test file pins that the two agree in both directions.
      if (!logoBodyKeepRule(descriptor)) return;
      // One decision per URL, ever — a repeated fetch of the same logo is the
      // same bytes, and re-deciding it would either burn an entry slot or
      // append a duplicate `skipped[]` row.
      if (seenUrls.has(url)) return;

      if (accepted >= maxEntries) {
        // The pathology backstop (see `LOGO_ASSET_MAX_ENTRIES`), never a
        // relevance decision. Marked seen even though it was REFUSED:
        // `accepted` never decreases, so this URL can never become admissible
        // later.
        seenUrls.add(url);
        skip(url, "entry-cap");
        return;
      }
      // `content-length` is checked HERE, before the thunk, purely so an
      // obviously-oversized asset costs zero CDP round trips. It is a
      // one-way optimization — see LOGO_ASSET_MAX_BYTES: the header is the
      // compressed size, so it may only reject, never admit. Absent/NaN and
      // everything it lets through are bounded by `retain()`.
      const contentLength = Number(descriptor.contentLength);
      if (Number.isFinite(contentLength) && contentLength > maxBytes) {
        seenUrls.add(url);
        skip(url, "content-length-over-cap", contentLength);
        return;
      }
      if (typeof descriptor.body !== "function") return;

      seenUrls.add(url);
      accepted += 1;
      // Fire the read NOW (see requirement 1) and neutralise the rejection
      // path immediately, so nothing downstream can see an unhandled
      // rejection even if `settle()` is never called.
      let bodyPromise;
      try {
        bodyPromise = Promise.resolve(descriptor.body());
      } catch (error) {
        // A thunk that throws synchronously is indistinguishable from one
        // that rejects — treat it the same.
        bodyPromise = Promise.reject(error);
      }
      // Latched by `expire()` below, and checked before `retain()` runs. A
      // body that arrives AFTER its deadline must not be retained: `retain()`
      // advances `totalBytes`, so a late arrival would push `retainedBytes`
      // past the figure `settle()` already reported and charge the whole-run
      // cap for bytes no entry ever carries.
      let expired = false;
      const expiredResult = { ok: false, url, reason: "body-timeout", detail: readTimeoutMs };
      pending.push({
        read: bodyPromise
          .then(
            // The caps are applied HERE, not in `settle()`.
            (body) => (expired ? expiredResult : retain(url, contentType, body)),
            (error) => ({ ok: false, url, reason: "body-error", detail: errorText(error) }),
          )
          // Belt and braces for requirement 2. `errorText` no longer throws
          // and `retain` refuses nothing `Buffer.from` accepts, but a handler
          // that throws would reject a promise NOTHING ever attaches a
          // handler to, and Node kills the process on that.
          .catch((error) => ({
            ok: false,
            url,
            reason: "body-error",
            detail: `handler-error: ${errorText(error)}`,
          })),
        // MUST NOT THROW — it runs in a timer callback (see
        // `raceWithDeadline`), where a throw is an uncaught exception.
        expire: () => {
          expired = true;
          return expiredResult;
        },
      });
    } catch (error) {
      // Unreachable by design; present because requirement 2 is absolute.
      try {
        skip(String(descriptor?.url ?? ""), "offer-error", errorText(error));
      } catch {
        // Nothing left to do — swallowing is the whole point.
      }
    }
  };

  // Await every parked read and report what was kept. The byte caps were
  // already applied in `retain()` — this only collects, so calling it is
  // never what makes the cache safe.
  //
  // BOUNDED. `Response.body()` never times out on its own, so a single origin
  // that stalls one logo body used to make this `await` never return: no
  // error, no rejection, nothing for `homepage-pass.js`'s try/catch to catch.
  // Each read is now raced against `readTimeoutMs` and a loser is reported as
  // `body-timeout`, exactly like any other per-asset refusal.
  //
  // ONE ceiling covers all of them because the reads run CONCURRENTLY — every
  // thunk was already fired in `offer()`, so `maxEntries` stalled reads cost
  // `readTimeoutMs` in total, not `maxEntries x readTimeoutMs`.
  //
  // Idempotent, and it moves no counter: the running total and the overflow
  // count are read, never advanced, so a second call returns the first call's
  // answer. (An expired read latches, which is what keeps that true — the
  // late body is dropped rather than retained on the way past.)
  const settle = async () => {
    const results = await Promise.all(
      pending.map((entry) => raceWithDeadline(entry.read, readTimeoutMs, entry.expire)),
    );
    const entries = [];
    const dropped = [];
    // Rows refused at retain time are charged to the SAME budget as the ones
    // refused at offer time, because they land in the same artifact field.
    // The entry cap used to bound them at 12; the backstop that replaced it is
    // far too large to let straight into `logo-assets.json` — a page whose
    // bodies all fail `retain()` would otherwise write one row per parked
    // read. Counted locally, never into `skippedOverflow`, so `settle()` stays
    // idempotent. Offer-time rows win the budget when both compete, which is
    // the right way round: under the keep rule an `entry-cap` row means the
    // page defeated the rule, and that is the rarer and louder fact.
    let droppedOverflow = 0;
    for (const result of results) {
      if (!result.ok) {
        if (skipped.length + dropped.length >= maxSkipped) {
          droppedOverflow += 1;
          continue;
        }
        dropped.push({ url: result.url, reason: result.reason, detail: result.detail });
        continue;
      }
      entries.push({ url: result.url, contentType: result.contentType, buffer: result.buffer });
    }
    // Both halves are bounded by `maxSkipped`, so `rows` is too.
    const rows = [...skipped, ...dropped];
    const truncated = skippedOverflow + droppedOverflow;
    if (truncated > 0) {
      rows.push({ url: "", reason: "skipped-truncated", detail: truncated });
    }
    return { entries, skipped: rows, totalBytes };
  };

  return {
    offer,
    settle,
    // Diagnostics only — never used for control flow.
    get offeredCount() {
      return accepted;
    },
    // Bytes this cache is holding RIGHT NOW, without awaiting anything. The
    // observable form of "the caps bound memory": it is `<= totalMaxBytes`
    // at every instant, whether or not `settle()` is ever called.
    get retainedBytes() {
      return totalBytes;
    },
  };
}

// --- Tier 2: make the browser fetch it --------------------------------

// Navigate a scratch page to `url` and return the navigation response body.
//
// `waitUntil: "commit"` resolves as soon as the response arrives — an SVG has
// no subresources worth waiting for, and `load` would stall on a document
// Chromium renders as an image. The scratch page is ALWAYS closed.
//
// HTTP(S) ONLY, AND THIS CHECK IS THE BOUNDARY. `url` is PAGE-CONTROLLED:
// `collectLogoAssets` is called with `rankLogoCandidates(...)`'s own list,
// which comes from the DOM via `absoluteUrl` (`new URL(value,
// location.href)`) — and that preserves an ABSOLUTE `file://` in an
// `<img src>` verbatim. Without this gate a hostile
// `<img alt="logo" src="file:///...svg">` makes the browser read a LOCAL FILE
// (Chromium's `--proxy-server` does not apply to `file:`, so the egress grant
// is not in the path at all), and `assemble-candidates.js` then copies those
// bytes into `brand.logos[].svgPath`, which is stored to the customer's org.
// The persistent thread workspace survives across runs, so "local file" is
// not a hypothetical corpus.
//
// The refusal is also deliberately EXISTENCE-BLIND: one reason, derived from
// the scheme alone, returned BEFORE any navigation. A refusal that varied
// with whether the path resolved — `navigation-error` vs `not-svg-markup` +
// a byte count, which is what `collectLogoAssets` records — would leave the
// page a file-existence-and-size oracle over every guessable `.svg` path even
// though it could no longer read the bytes.
//
// `timeoutMs` COVERS THE NAVIGATION ONLY. `waitUntil: "commit"` resolves on
// the response HEADERS, and the `Response.body()` that follows has no timeout
// of its own — a `content-type: image/svg+xml` header followed by a stalled
// body left this function hung 20s+ past a `timeoutMs` of 3s, measured. The
// read carries its own `readTimeoutMs`.
// FORMAT-BLIND, and always has been: nothing below inspects the body, so the
// same navigation serves the SVG tier and the raster tier. `fetchSvgViaBrowser`
// remains its name at every existing call site and in the tests that prove the
// Tier-2 premise against a real Chromium; `fetchAssetViaBrowser` is the same
// function under the name the raster caller reads by.
export async function fetchAssetViaBrowser(context, url, {
  timeoutMs = TIER2_NAVIGATION_TIMEOUT_MS,
  readTimeoutMs = LOGO_BODY_READ_TIMEOUT_MS,
} = {}) {
  let protocol;
  try {
    protocol = new URL(String(url)).protocol;
  } catch {
    return { ok: false, reason: "bad-url" };
  }
  if (protocol !== "http:" && protocol !== "https:") {
    return { ok: false, reason: "unsupported-scheme", detail: protocol };
  }
  if (!context || typeof context.newPage !== "function") {
    return { ok: false, reason: "no-context" };
  }
  let scratchPage = null;
  try {
    scratchPage = await context.newPage();
    const response = await scratchPage.goto(url, { waitUntil: "commit", timeout: timeoutMs });
    if (!response) return { ok: false, reason: "no-response" };
    const status = response.status();
    if (status < 200 || status >= 400) {
      return { ok: false, reason: "bad-status", detail: status };
    }
    const headers = typeof response.headers === "function" ? response.headers() : {};
    const contentType = String(headers?.["content-type"] || "").split(";")[0].trim().toLowerCase();
    // Rejection is mapped to a value BEFORE the race, so the arm that loses
    // can never be an abandoned rejected promise (see `raceWithDeadline`).
    // `navigation-error` keeps the reason this rejection has always produced
    // through the outer catch.
    const read = await raceWithDeadline(
      Promise.resolve(response.body()).then(
        (body) => ({ ok: true, buffer: body }),
        (error) => ({ ok: false, reason: "navigation-error", detail: errorText(error) }),
      ),
      readTimeoutMs,
      () => ({ ok: false, reason: "body-timeout", detail: readTimeoutMs }),
    );
    if (!read.ok) return read;
    return { ok: true, status, contentType, buffer: read.buffer };
  } catch (error) {
    return { ok: false, reason: "navigation-error", detail: errorText(error) };
  } finally {
    if (scratchPage) {
      await scratchPage.close().catch(() => {});
    }
  }
}

export const fetchSvgViaBrowser = fetchAssetViaBrowser;

// --- Artifact ---------------------------------------------------------

// The shape written to `<technical>/<slug>/logo-assets.json`. TECHNICAL ONLY.
//
// `entries[].localPath` / `sidecarPath` are worker-local paths and must never
// reach public JSON — `normalize` HARD-REJECTS a worker-local path in a
// public field. `rankLogoCandidates` reads `svgPath` from this file and
// NOTHING else; `brand.logos[].url` keeps coming from the page's own public
// source URLs.
export function emptyLogoAssetsArtifact({ status = "empty", error = "" } = {}) {
  return {
    artifact: "logo-assets",
    version: 1,
    status,
    generatedAtMs: Date.now(),
    entries: [],
    skipped: [],
    counts: { retained: 0, browserFetches: 0, suppressed: 0, inline: 0, raster: 0 },
    error: error || null,
  };
}

// MUST NOT THROW — it runs inside the rejection handler of a parked body
// read, and a throw there rejects the derived promise in `pending[]`, which
// nothing ever attaches a handler to. Node kills the process on that, which
// is precisely the outcome the header of this file says is impossible.
// Reachable whenever the rejection value's `String()` or `.message` getter
// throws, or `.message` is a non-string (`message.slice` -> TypeError).
// Playwright rejects with ordinary `Error`s, so this is defensive.
function errorText(error) {
  try {
    if (!error) return "";
    const raw = error instanceof Error ? error.message : String(error);
    return (typeof raw === "string" ? raw : String(raw)).slice(0, 300);
  } catch {
    return "unprintable-error";
  }
}

function safeAssetBasename(url, index) {
  let stem = "";
  try {
    stem = path.basename(new URL(url).pathname).replace(/\.[^.]*$/, "");
  } catch {
    stem = "";
  }
  const cleaned = String(stem).replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "");
  return `logo-${index}-${cleaned || "asset"}`.slice(0, 80);
}

// Reduce the retained bodies (plus, for the misses, up to
// `maxBrowserFetches` Tier-2 navigations) into the `logo-assets.json`
// artifact and the `logo-assets/` sidecar directory.
//
// DELIBERATE ISOLATION — sidecars go in a SUBDIRECTORY. `lib/load-logo-svg-
// paths.js` does a FLAT readdir of the technical dir, so a `*.svgpath.json`
// written one level down is invisible to it. That is on purpose: wiring these
// sidecars into `logoSvgFillsFromPaths` would feed `synthesizeLogoSvgAccents`
// and the F3 `LOGO_BOOST` in `rankPrimaryButtonCandidates`, moving accent
// colours and primary-button ranking on EVERY site with an SVG logo. That is
// a real improvement and it is its own change with its own eval review — not
// a side effect of keeping bytes.
//
// `candidateUrls` is the ranker's own logo list, so the retained set is
// exactly what the scaffolder will score. `contentTypeByUrl` comes from
// `observedRequests()` and rescues extensionless CDN URLs.
//
// `inlineLogos` is `lib/inline-svg-logo-capture.js`'s output — logos the page
// never downloaded because it ships them as inline `<svg>` markup. They join
// the SAME entries[] / sidecar channel so nothing downstream is special-cased,
// and they carry `url: ""` because there IS no public URL to carry: the file
// only ever existed inside the document.
export async function collectLogoAssets({
  cache = null,
  context = null,
  candidateUrls = [],
  contentTypeByUrl = {},
  inlineLogos = [],
  outDir = "",
  maxBrowserFetches = LOGO_ASSET_MAX_BROWSER_FETCHES,
  readTimeoutMs = LOGO_BODY_READ_TIMEOUT_MS,
  phaseBudgetMs = LOGO_ASSET_PHASE_BUDGET_MS,
} = {}) {
  // Whole-phase deadline. The per-read bound alone caps `settle()` (its reads
  // race concurrently) but NOT the Tier-2 loop below, which is sequential and
  // pays a navigation plus a read per candidate. See LOGO_ASSET_PHASE_BUDGET_MS.
  const deadline = Number.isFinite(phaseBudgetMs) && phaseBudgetMs > 0
    ? Date.now() + phaseBudgetMs
    : Infinity;
  const artifact = emptyLogoAssetsArtifact({ status: "empty" });
  const settled = cache && typeof cache.settle === "function"
    ? await cache.settle()
    : { entries: [], skipped: [], totalBytes: 0 };
  artifact.skipped = [...settled.skipped];

  const byUrl = new Map();
  for (const entry of settled.entries) byUrl.set(entry.url, entry);

  const urls = [];
  const seen = new Set();
  for (const url of Array.isArray(candidateUrls) ? candidateUrls : []) {
    if (typeof url !== "string" || !url || seen.has(url)) continue;
    seen.add(url);
    urls.push(url);
  }

  const assetsDir = outDir ? path.join(outDir, "logo-assets") : "";
  let browserFetches = 0;
  let suppressed = 0;
  let inlineRetained = 0;
  let rasterRetained = 0;
  let wroteDir = false;

  // Reserve one path inside `logo-assets/`, creating it on first use. Returns
  // "" when no `outDir` was supplied (unit tests).
  const assetPathFor = async (filename) => {
    if (!assetsDir) return "";
    if (!wroteDir) {
      await fs.mkdir(assetsDir, { recursive: true });
      wroteDir = true;
    }
    return path.join(assetsDir, filename);
  };

  // Reserve the sidecar paths for one SVG asset.
  const sidecarPathsFor = async (basename) => {
    if (!assetsDir) return { localPath: "", sidecarPath: "" };
    return {
      localPath: await assetPathFor(`${basename}.svg`),
      sidecarPath: await assetPathFor(`${basename}.svgpath.json`),
    };
  };

  // Non-SVG candidates whose URL an email client cannot render, deferred until
  // after the SVG loop. THE ORDER IS THE POINT: both tiers spend the same
  // three-navigation budget and the same 30 s phase budget, and `svgPath` is a
  // required schema field on every logo row while a hosted PNG is a repair for
  // one. A raster candidate must never be able to starve the SVG that the
  // scaffolder is going to read.
  const rasterCandidates = [];

  for (let index = 0; index < urls.length; index += 1) {
    const url = urls[index];
    const observedType = typeof contentTypeByUrl?.[url] === "string" ? contentTypeByUrl[url] : "";
    const cached = byUrl.get(url);
    const contentType = cached?.contentType || observedType;
    // Non-SVG candidates cost NOTHING here: no Tier-2 navigation, no disk
    // write. `og:image` and PNG favicons land here, which is why the coverage
    // table says `svgPath: ""` for them. The webp/avif/extensionless subset is
    // handed to the raster loop below instead of being skipped outright.
    if (!isSvgAsset({ url, contentType })) {
      if (isRasterHostingCandidate({ url })) {
        rasterCandidates.push({ url, index, contentType });
      } else {
        artifact.skipped.push({ url, reason: "not-svg" });
      }
      continue;
    }

    let buffer = cached?.buffer ?? null;
    let source = "page-response";
    let resolvedType = contentType;
    if (!buffer) {
      if (browserFetches >= maxBrowserFetches) {
        artifact.skipped.push({ url, reason: "browser-fetch-budget" });
        continue;
      }
      // The phase deadline is checked BEFORE the navigation and then handed
      // down as this fetch's own ceiling, so the last candidate cannot
      // overshoot the budget by a whole navigation plus a whole read. A
      // candidate refused here is NOT charged to `browserFetches`: nothing was
      // navigated, and the count is the instrumentation for how often Tier 2
      // is actually needed.
      const remainingMs = deadline - Date.now();
      if (remainingMs <= 0) {
        artifact.skipped.push({ url, reason: "phase-budget" });
        continue;
      }
      browserFetches += 1;
      const fetched = await fetchSvgViaBrowser(context, url, {
        timeoutMs: Math.min(TIER2_NAVIGATION_TIMEOUT_MS, remainingMs),
        readTimeoutMs: Math.min(readTimeoutMs, remainingMs),
      });
      if (!fetched.ok) {
        artifact.skipped.push({ url, reason: fetched.reason, detail: fetched.detail });
        continue;
      }
      if (fetched.buffer.length > LOGO_ASSET_MAX_BYTES) {
        artifact.skipped.push({ url, reason: "body-over-cap", detail: fetched.buffer.length });
        continue;
      }
      buffer = fetched.buffer;
      resolvedType = fetched.contentType || contentType;
      source = "browser-navigation";
    }

    const markup = buffer.toString("utf8");
    // A 200 with an HTML error page is the common CDN answer to a
    // hotlink-protected or moved asset. Reducing that markup would emit
    // nonsense as `svgPath`.
    if (!looksLikeSvgMarkup(markup)) {
      artifact.skipped.push({ url, reason: "not-svg-markup", detail: buffer.length });
      continue;
    }

    const { localPath, sidecarPath } = await sidecarPathsFor(safeAssetBasename(url, index));

    const payload = svgPathPayloadFromMarkup(markup, { svgFile: localPath });
    const suppressionReason = svgPathSuppressionReason(markup, payload.svgPath);
    const safe = suppressionReason === null;
    if (!safe) suppressed += 1;

    if (assetsDir) {
      await fs.writeFile(localPath, buffer);
      await fs.writeFile(sidecarPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    }

    artifact.entries.push({
      url,
      // `page-response` vs `browser-navigation` is the instrumentation the
      // plan asks for on early production runs — it is how we learn whether
      // headless Chromium actually fetches `<link rel=icon>` here.
      source,
      kind: "svg",
      contentType: resolvedType || "",
      byteLength: buffer.length,
      localPath,
      sidecarPath,
      svgPath: safe ? payload.svgPath : "",
      svgPathSuppressed: !safe,
      // WHY, not merely WHETHER — see `svgPathSuppressionReason`. A safe mark
      // suppressed for length keeps hostable bytes; an unsafe one never does.
      svgPathSuppressedReason: suppressionReason,
      pathCount: payload.pathCount,
      shapeCount: payload.shapeCount,
    });
  }

  // Raster logos whose OWN URL an email client cannot render. Same navigation,
  // same budgets, same byte cap as the SVG tier — the only differences are that
  // nothing is reduced to markup (there is no `svgPath` to publish) and that
  // the bytes exist solely so the finalizer can convert them to a hosted PNG.
  for (const candidate of rasterCandidates) {
    const { url, index } = candidate;
    if (browserFetches >= maxBrowserFetches) {
      artifact.skipped.push({ url, reason: "browser-fetch-budget" });
      continue;
    }
    const remainingMs = deadline - Date.now();
    if (remainingMs <= 0) {
      artifact.skipped.push({ url, reason: "phase-budget" });
      continue;
    }
    browserFetches += 1;
    const fetched = await fetchAssetViaBrowser(context, url, {
      timeoutMs: Math.min(TIER2_NAVIGATION_TIMEOUT_MS, remainingMs),
      readTimeoutMs: Math.min(readTimeoutMs, remainingMs),
    });
    if (!fetched.ok) {
      artifact.skipped.push({ url, reason: fetched.reason, detail: fetched.detail });
      continue;
    }
    if (fetched.buffer.length > LOGO_ASSET_MAX_BYTES) {
      artifact.skipped.push({ url, reason: "body-over-cap", detail: fetched.buffer.length });
      continue;
    }
    // The magic bytes, not the header — see `rasterImageExtension`.
    const extension = rasterImageExtension(fetched.buffer);
    if (!extension) {
      artifact.skipped.push({ url, reason: "not-raster-bytes", detail: fetched.buffer.length });
      continue;
    }

    const localPath = await assetPathFor(`${safeAssetBasename(url, index)}.${extension}`);
    if (localPath) await fs.writeFile(localPath, fetched.buffer);

    rasterRetained += 1;
    artifact.entries.push({
      url,
      // Always Tier 2: `logoBodyKeepRule` admits SVG only, so a raster body
      // never reaches the Tier-1 cache in the first place.
      source: "browser-navigation",
      kind: "raster",
      contentType: fetched.contentType || candidate.contentType || "",
      byteLength: fetched.buffer.length,
      // The finalizer re-reads these bytes minutes later, in another process,
      // and converts them. This digest is what binds what it reads to what the
      // browser actually delivered.
      sha256: createHash("sha256").update(fetched.buffer).digest("hex"),
      localPath,
      // There is no reduced markup and there never will be: `svgPath` is an
      // SVG concept. Empty rather than absent so the row keeps one shape.
      sidecarPath: "",
      svgPath: "",
      svgPathSuppressed: false,
      pathCount: 0,
      shapeCount: 0,
    });
  }

  // Inline `<svg>` logos. Same reduction, same sidecars, same safety screen —
  // the only differences are that the bytes came from the DOM instead of a
  // response, and that `url` is "" because no public URL exists.
  //
  // AND NOTHING DOWNSTREAM TURNS THAT "" INTO ONE — UNLESS THE FINALIZER MINTED A
  // HOSTED PNG THIS RUN. `svgPathPayloadFromMarkup` emits the svg's INNER
  // markup, so the root element this capture worked so hard to make correct
  // (the synthesized `viewBox`, the `xmlns`) survives only in the worker-local
  // `logo-assets/*.svg` sidecar, which is technical and never published. The
  // customization skill's autonomous SVG->PNG conversion starts from
  // `brand.logos[].url` and never reads `svgPath` at all. The one step that can
  // close the loop is the finalizer, and only because it runs while
  // THESE sidecar bytes still exist: it PUTs `localPath` to an upload session,
  // `upload_image(purpose="logo")` rasterizes server-side, and the hosted
  // `.png` is written into the in-memory `brand.logos[].url`. On every other outcome
  // — unattended run, suppressed markup, missing sidecar, upload or rasterize
  // failure — the old truth stands verbatim: a captured inline logo is REAL
  // EVIDENCE OF THE MARK and NOT a usable email asset, and the run still has to
  // tell the user a logo file or URL is needed before an email can be
  // customized (extraction SKILL.md, "Logo outcome").
  //
  // `inlineLogos` MAY BE A PROMISE, and it is awaited HERE rather than at the
  // top. `cache.settle()` above reads the Tier-1 bodies out of the CDP cache,
  // which the browser can evict, so nothing may be awaited ahead of it — the
  // caller therefore starts the in-page scan and hands the pending result
  // straight in, letting it overlap the settle and the Tier-2 loop.
  const inlineRows = await Promise.resolve(inlineLogos).catch(() => []);
  for (const [index, inline] of (Array.isArray(inlineRows) ? inlineRows : []).entries()) {
    const markup = typeof inline?.markup === "string" ? inline.markup : "";
    if (!looksLikeSvgMarkup(markup)) {
      artifact.skipped.push({ url: "", reason: "inline-not-svg-markup", detail: markup.length });
      continue;
    }
    const buffer = Buffer.from(markup, "utf8");
    if (buffer.length > LOGO_ASSET_MAX_BYTES) {
      artifact.skipped.push({ url: "", reason: "body-over-cap", detail: buffer.length });
      continue;
    }

    const { localPath, sidecarPath } = await sidecarPathsFor(`logo-inline-${index}`);
    const payload = svgPathPayloadFromMarkup(markup, { svgFile: localPath });
    // A capture with no shapes draws nothing. The usual cause is an external
    // sprite `<use>` the page-side pass could not inline (`unresolvedUseRefs`),
    // and shipping it would put an invisible "logo" in the brandkit.
    if (payload.shapeCount === 0) {
      artifact.skipped.push({
        url: "",
        reason: "inline-no-shapes",
        detail: inline?.notes?.unresolvedUseRefs || 0,
      });
      continue;
    }
    const inlineSuppressionReason = svgPathSuppressionReason(markup, payload.svgPath);
    const safe = inlineSuppressionReason === null;
    if (!safe) suppressed += 1;

    if (assetsDir) {
      await fs.writeFile(localPath, buffer);
      await fs.writeFile(sidecarPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
    }

    inlineRetained += 1;
    artifact.entries.push({
      // Empty BY DESIGN — see the header of the inline block above. It also
      // keeps these entries out of `svgPathIndexFromLogoAssets`, which is
      // url-keyed: an inline capture must never be able to graft its markup
      // onto some unrelated candidate's URL.
      url: "",
      source: "inline-svg",
      kind: "svg",
      contentType: "image/svg+xml",
      byteLength: buffer.length,
      localPath,
      sidecarPath,
      svgPath: safe ? payload.svgPath : "",
      svgPathSuppressed: !safe,
      svgPathSuppressedReason: inlineSuppressionReason,
      pathCount: payload.pathCount,
      shapeCount: payload.shapeCount,
      // Technical-only ranking evidence, mirroring what the img scorer records.
      selector: typeof inline?.selector === "string" ? inline.selector : "",
      label: typeof inline?.label === "string" ? inline.label : "",
      // MEASURED on the live page, and nothing else in this pipeline can
      // measure it: the scan is the only code that ever saw the band the mark
      // was legible against. Everything else reads a saved artifact and can
      // only say "unknown".
      background: inline?.background === "light" || inline?.background === "dark" ? inline.background : "unknown",
      // Placement corroboration (header / banner / home link). A mark can score
      // high on geometry alone from inside a payment or partner strip, and that
      // must not buy the confidence band that says "copy it with one check".
      placement: inline?.placement === true,
      // Whether the markup NAMED this a logo (a `logo` token in the element's
      // own signature or aria-label, withheld when the foreign-mark vocabulary
      // says the name belongs to somebody else). The scan is the only code that
      // can read it, and `rankLogoCandidates` is where it is spent: an inline
      // capture with placement but no text signal is capped out of the copy
      // band. Absent on every capture taken before this field existed, which is
      // exactly what `=== true` means here — an old artifact says nothing, and
      // saying nothing is not a text signal.
      textSignal: inline?.textSignal === true,
      widthPx: Number.isFinite(inline?.widthPx) ? inline.widthPx : 0,
      heightPx: Number.isFinite(inline?.heightPx) ? inline.heightPx : 0,
      score: Number.isFinite(inline?.score) ? inline.score : 0,
      notes: inline?.notes && typeof inline.notes === "object" ? inline.notes : {},
    });
  }

  artifact.counts = {
    retained: artifact.entries.length,
    browserFetches,
    suppressed,
    inline: inlineRetained,
    raster: rasterRetained,
  };
  artifact.status = artifact.entries.length > 0 ? "completed" : "empty";
  return artifact;
}

// Index `logo-assets.json` by URL → publishable `svgPath`. Tolerant of every
// malformed shape: a missing / truncated / hand-edited artifact yields an
// empty map, and the ranker then behaves exactly as it does today.
//
// THE READ END SCREENS TOO. `collectLogoAssets` screens what it WRITES, but
// this function is the only thing between a `logo-assets.json` it did not
// write — a hand-repair by the agent, a stale file from a looser version of
// this module — and `brand.logos[].svgPath`, which SKILL.md tells the agent
// to copy verbatim. A worker-local path arriving that way is a normalize HARD
// REJECT that fails the WHOLE RUN. So `isPubliclySafeSvgPath` is applied at
// both ends: producer and consumer. It subsumes the non-empty-string check.
export function svgPathIndexFromLogoAssets(logoAssets) {
  const index = new Map();
  const entries = logoAssets && typeof logoAssets === "object" && Array.isArray(logoAssets.entries)
    ? logoAssets.entries
    : [];
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") continue;
    if (typeof entry.url !== "string" || !entry.url) continue;
    if (!isPubliclySafeSvgPath(entry.svgPath)) continue;
    if (index.has(entry.url)) continue;
    index.set(entry.url, entry.svgPath);
  }
  return index;
}

// The inline half of the same hand-off: the `source: "inline-svg"` entries, in
// descending capture score, each already screened by `isPubliclySafeSvgPath`.
//
// SEPARATE FUNCTION, not a widening of the index above, because the two carry
// different keys and different consequences. The index is url-keyed and its
// output is grafted onto a candidate the ranker built from a PUBLIC URL; these
// rows have no URL at all, so they are candidates in their own right and the
// ranker must decide where they sit. Same read-end screening discipline: a
// hand-repaired or stale `logo-assets.json` cannot smuggle an unsafe string
// into `brand.logos[].svgPath` through this door either.
export function inlineSvgLogosFromLogoAssets(logoAssets) {
  const entries = logoAssets && typeof logoAssets === "object" && Array.isArray(logoAssets.entries)
    ? logoAssets.entries
    : [];
  const inline = [];
  for (const entry of entries) {
    if (!entry || typeof entry !== "object") continue;
    if (entry.source !== "inline-svg") continue;
    if (!isPubliclySafeSvgPath(entry.svgPath)) continue;
    inline.push({
      svgPath: entry.svgPath,
      label: typeof entry.label === "string" ? entry.label : "",
      // Clamped to the schema enum at the read end too — a hand-edited or
      // stale artifact must not be able to put a non-enum value into
      // `brand.logos[].background`.
      background: entry.background === "light" || entry.background === "dark" ? entry.background : "unknown",
      placement: entry.placement === true,
      // TRI-STATE, unlike every other field here, and deliberately so. `null`
      // means "this artifact predates the field", which the ranker must not
      // read as "no text signal": an entry written before it existed cleared a
      // container gate that already demanded a logo NAME or a home-link anchor,
      // so it carries that evidence even though it cannot name it. Coercing to
      // `false` here would quietly re-price every stored capture.
      textSignal: typeof entry.textSignal === "boolean" ? entry.textSignal : null,
      widthPx: Number.isFinite(entry.widthPx) ? entry.widthPx : null,
      heightPx: Number.isFinite(entry.heightPx) ? entry.heightPx : null,
      score: Number.isFinite(entry.score) ? entry.score : 0,
      shapeCount: Number.isFinite(entry.shapeCount) ? entry.shapeCount : 0,
    });
  }
  return inline.sort((left, right) => right.score - left.score);
}

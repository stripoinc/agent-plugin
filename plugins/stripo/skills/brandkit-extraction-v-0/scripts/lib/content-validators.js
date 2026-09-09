// JavaScript twin of the authoritative validators in
// `src/reteno_agent/brandkit_finalize/validation.py`. Keep message strings,
// helper semantics, and orchestrator iteration order in lockstep with that
// Python implementation; both sides share parity coverage in the test suite.
//
// Scope: URL-domain advisories plus the hard factual boundary for identity,
// contacts, socials, logo URLs and unsafe SVG. Styling warnings live in
// ./technical-artifact-warnings.js. Helpers that overlap (URL_PATTERN, SVG
// dangerous patterns) are imported from sibling modules so the public surface
// stays in lockstep across modules.

import path from "node:path";
import crypto from "node:crypto";
import { SaxesParser } from "saxes";
import { getDomain } from "tldts";

import { URL_PATTERN } from "./unsafe-public-strings.js";
import {
  readGateJson,
  TechnicalArtifactUnreadableError,
} from "./technical-artifact-blockers.js";
import { phoneFromTel } from "./contact-facts.js";

// --- Constants (string-for-string parity with Python) ---

// Mirrors Python `PLATFORM_DOMAIN_ALLOWLIST` (validation.py:23). Order matters
// only for SOCIAL_PLATFORM_KEYS derivation; the lookup itself is by key. The
// values are arrays of bare host suffixes (no scheme, no leading dot) that
// each platform accepts.
export const PLATFORM_DOMAIN_ALLOWLIST = {
  facebook: ["facebook.com", "fb.com", "fb.me"],
  youtube: ["youtube.com", "youtu.be"],
  instagram: ["instagram.com"],
  tiktok: ["tiktok.com"],
  twitter: ["twitter.com", "x.com"],
  x: ["x.com", "twitter.com"],
  snapchat: ["snapchat.com"],
  pinterest: ["pinterest.com"],
  linkedin: ["linkedin.com"],
  android: ["play.google.com"],
  apple: ["apps.apple.com", "itunes.apple.com"],
  rss: ["feedburner.com"],
  yelp: ["yelp.com"],
  threads: ["threads.net"],
  discord: ["discord.com", "discordapp.com", "discord.gg"],
  twitch: ["twitch.tv"],
  whatsapp: ["wa.me", "whatsapp.com"],
  viber: ["viber.com"],
  telegram: ["t.me", "telegram.me", "telegram.org", "telegram.dog"],
  messenger: ["m.me", "messenger.com", "facebook.com"],
};

// Mirrors Python `SOCIAL_PLATFORM_KEYS = tuple(PLATFORM_DOMAIN_ALLOWLIST.keys())`.
// JS preserves insertion order on plain objects, so this matches Python.
export const SOCIAL_PLATFORM_KEYS = Object.keys(PLATFORM_DOMAIN_ALLOWLIST);

// Query keys whose removal cannot change the identity of a social profile.
// Keep this list deliberately narrow: every unlisted query component remains
// part of the factual evidence comparison. Mirrored in validation.py.
const GENERIC_SOCIAL_TRACKING_QUERY_KEYS = new Set(["fbclid", "gclid"]);
const SOCIAL_TRACKING_QUERY_KEYS = {
  instagram: new Set(["igshid"]),
};

// Mirrors Python `SVG_DANGEROUS_PATTERNS`. The `.pattern` attribute on each
// regex is surfaced verbatim in the warning string, exactly like Python's
// `pattern.pattern`.
export const SVG_DANGEROUS_PATTERNS = [
  {
    source: "<\\s*(?:[a-z_][\\w.-]*:)?script\\b",
    regex: /<\s*(?:[a-z_][\w.-]*:)?script\b/i,
  },
  { source: "\\bon\\w+\\s*=", regex: /\bon\w+\s*=/i },
  { source: "javascript\\s*:", regex: /javascript\s*:/i },
  {
    source: "<\\s*(?:[a-z_][\\w.-]*:)?iframe\\b",
    regex: /<\s*(?:[a-z_][\w.-]*:)?iframe\b/i,
  },
  // `@import` inside an SVG's own `<style>` pulls a remote stylesheet at RENDER
  // time, and `<foreignObject>` re-opens the full HTML parser inside the image.
  // Added while the consumer set is still small (the inline-`<svg>` capture is
  // the first producer that can hand us markup a page author wrote for a page
  // rather than for a logo file).
  { source: "@import", regex: /@import/i },
  {
    source: "<\\s*(?:[a-z_][\\w.-]*:)?foreignObject\\b",
    regex: /<\s*(?:[a-z_][\w.-]*:)?foreignobject\b/i,
  },
  {
    source: "<\\s*(?:[a-z_][\\w.-]*:)?meta\\b",
    regex: /<\s*(?:[a-z_][\w.-]*:)?meta\b/i,
  },
  {
    source: "xmlns(?:\\s*:\\s*[a-z_][\\w.-]*)?\\s*=\\s*[\\x22\\x27]http://www\\.w3\\.org/1999/xhtml[\\x22\\x27]",
    regex: /xmlns(?:\s*:\s*[a-z_][\w.-]*)?\s*=\s*[\x22\x27]http:\/\/www\.w3\.org\/1999\/xhtml[\x22\x27]/i,
  },
  {
    source: "(?<![\\w.-])(?:href|xlink:href)\\s*=\\s*(?:\\x22(?!#)|\\x27(?!#)|(?![\\x22\\x27#]))",
    regex: /(?<![\w.-])(?:href|xlink:href)\s*=\s*(?:\x22(?!#)|\x27(?!#)|(?![\x22\x27#]))/i,
  },
  {
    source: "(?<![\\w.-])(?:[a-z_][\\w.-]*:)?(?:src|srcset|data|poster|background)\\s*=\\s*(?:\\x22(?!#)|\\x27(?!#)|(?![\\x22\\x27#]))",
    regex: /(?<![\w.-])(?:[a-z_][\w.-]*:)?(?:src|srcset|data|poster|background)\s*=\s*(?:\x22(?!#)|\x27(?!#)|(?![\x22\x27#]))/i,
  },
  {
    source: "\\burl\\s*\\(\\s*(?:\\x22(?!#)|\\x27(?!#)|(?![\\x22\\x27#]))",
    regex: /\burl\s*\(\s*(?:\x22(?!#)|\x27(?!#)|(?![\x22\x27#]))/i,
  },
  { source: "\\\\", regex: /\\/ },
  {
    source: "&(?:#(?:x[0-9a-f]+|[0-9]+)|[a-z][a-z0-9]+);",
    regex: /&(?:#(?:x[0-9a-f]+|[0-9]+)|[a-z][a-z0-9]+);/i,
  },
  { source: "&#", regex: /&#/ },
  {
    source: "<\\s*(?:[a-z_][\\w.-]*:)?animate",
    regex: /<\s*(?:[a-z_][\w.-]*:)?animate/i,
  },
  {
    source: "<\\s*(?:[a-z_][\\w.-]*:)?set\\b",
    regex: /<\s*(?:[a-z_][\w.-]*:)?set\b/i,
  },
  {
    source: "(?:-webkit-)?image-set\\s*\\(",
    regex: /(?:-webkit-)?image-set\s*\(/i,
  },
];

const SVG_XML_NAMED_REFERENCES = new Map([
  ["amp", "&"],
  ["lt", "<"],
  ["gt", ">"],
  ["quot", '"'],
  ["apos", "'"],
]);
const SVG_CHARACTER_REFERENCE_RE = /&#(?:x([0-9a-f]+)|([0-9]+));|&([a-z][a-z0-9]+);/gi;

export function canonicalizeSvgForSafetyScan(svg) {
  if (typeof svg !== "string") return "";
  let canonical = svg;
  for (let pass = 0; pass < 8; pass += 1) {
    const decoded = canonical.replace(
      SVG_CHARACTER_REFERENCE_RE,
      (whole, hexadecimal, decimal, named) => {
        if (named !== undefined) {
          return SVG_XML_NAMED_REFERENCES.get(named.toLowerCase()) ?? whole;
        }
        const codepoint = Number.parseInt(
          hexadecimal ?? decimal,
          hexadecimal !== undefined ? 16 : 10,
        );
        if (
          !Number.isInteger(codepoint)
          || codepoint > 0x10ffff
          || (codepoint >= 0xd800 && codepoint <= 0xdfff)
        ) {
          return whole;
        }
        return String.fromCodePoint(codepoint);
      },
    );
    if (decoded === canonical) break;
    canonical = decoded;
  }
  return canonical;
}

const SVG_FRAGMENT_WRAPPER_START = '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">';
const SVG_ASCII_XML_NAME_RE = /^[A-Za-z_][A-Za-z0-9_.:-]*$/;

export function svgInnerMarkupIsUnsafe(svg) {
  if (typeof svg !== "string") return true;
  let failed = false;
  let unsafeHtmlEmbedding = false;
  const openElements = [];
  const parser = new SaxesParser({ xmlns: false });
  parser.on("error", () => {
    failed = true;
  });
  parser.on("opentag", (tag) => {
    if (openElements.some((name) => name === "title" || name === "desc")) {
      unsafeHtmlEmbedding = true;
    }
    if (
      !SVG_ASCII_XML_NAME_RE.test(tag.name)
      || Object.keys(tag.attributes).some((name) => !SVG_ASCII_XML_NAME_RE.test(name))
    ) {
      failed = true;
    }
    openElements.push(tag.name.toLowerCase());
  });
  parser.on("closetag", () => {
    openElements.pop();
  });
  parser.on("processinginstruction", () => {
    unsafeHtmlEmbedding = true;
  });
  parser.on("cdata", () => {
    if (openElements.some((name) => name === "title" || name === "desc")) {
      unsafeHtmlEmbedding = true;
    }
  });
  try {
    parser.write(`${SVG_FRAGMENT_WRAPPER_START}${svg}</svg>`).close();
  } catch {
    return true;
  }
  return failed || unsafeHtmlEmbedding;
}

export const WRONG_SITE_IDENTITY_BLOCKER =
  "Final brandkit website identifies a different site than this extraction run";
export const INVENTED_CONTACT_BLOCKER =
  "Final brandkit contact is absent from this run's page-signals evidence";
export const INVENTED_SOCIAL_BLOCKER =
  "Final brandkit social URL is absent from this run's page-signals evidence";
export const INVENTED_ASSET_URL_BLOCKER =
  "Final brandkit logo URL is absent from this run's captured asset evidence";
export const UNSAFE_ASSET_URL_BLOCKER = "Final brandkit logo URL is not a safe public asset URL";
export const UNSAFE_SVG_BLOCKER = "Final brandkit logo SVG contains a dangerous pattern";
export const UNBOUND_SVG_BLOCKER =
  "Final brandkit logo SVG is not exactly bound to this run's captured logo evidence";

// --- URL helpers (mirror Python urllib.parse semantics) ---

// Mirrors Python `_normalize_host`. Returns the lowercased hostname with the
// `www.` prefix stripped, or "" if the URL is unparseable / has no hostname.
export function normalizeHost(url) {
  if (typeof url !== "string" || url.length === 0) return "";
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return "";
  }
  const host = (parsed.hostname || "").toLowerCase();
  return host.startsWith("www.") ? host.slice(4) : host;
}

// Mirrors Python `_url_matches_domain`. True iff the URL's normalized host
// equals `targetBase` exactly OR is a subdomain (ends with `.${targetBase}`).
export function urlMatchesDomain(url, targetBase) {
  const host = normalizeHost(url);
  if (!host || !targetBase) return false;
  return host === targetBase || host.endsWith(`.${targetBase}`);
}

// Mirrors Python `_url_matches_allowed_domains`. True iff the URL's normalized
// host matches any entry in the allowlist (exact host or subdomain match).
export function urlMatchesAllowedDomains(url, allowedDomains) {
  const host = normalizeHost(url);
  if (!host) return false;
  if (!Array.isArray(allowedDomains)) return false;
  for (const domain of allowedDomains) {
    if (host === domain || host.endsWith(`.${domain}`)) return true;
  }
  return false;
}

export function socialUrlMatchesPlatform(platform, url) {
  if (urlMatchesAllowedDomains(url, PLATFORM_DOMAIN_ALLOWLIST[platform] || [])) return true;
  const host = normalizeHost(url);
  if ((platform === "pinterest" || platform === "yelp") && host) {
    const registrable = getDomain(host) || "";
    return registrable.split(".", 1)[0] === platform;
  }
  return false;
}

// Mirrors Python `_iter_description_values` generator. Eagerly returns every
// `description` string nested inside `value`, recursing into dicts and lists.
// Order matches the Python generator's depth-first traversal.
export function iterDescriptionValues(value) {
  const out = [];
  walkDescriptions(value, out);
  return out;
}

function walkDescriptions(value, out) {
  if (value !== null && typeof value === "object" && !Array.isArray(value)) {
    for (const [key, child] of Object.entries(value)) {
      if (key === "description" && typeof child === "string") {
        out.push(child);
      } else {
        walkDescriptions(child, out);
      }
    }
  } else if (Array.isArray(value)) {
    for (const item of value) {
      walkDescriptions(item, out);
    }
  }
}

// Mirrors Python `_allowed_text_domains`. Flattens PLATFORM_DOMAIN_ALLOWLIST
// values into a sorted, deduped tuple of bare host suffixes.
export function allowedTextDomains() {
  const set = new Set();
  for (const domains of Object.values(PLATFORM_DOMAIN_ALLOWLIST)) {
    for (const domain of domains) set.add(domain);
  }
  return Array.from(set).sort();
}

// --- isPlainObject helper: matches Python `isinstance(x, dict)` semantics ---

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// --- URL extraction with stable iteration semantics ---

// Mirrors Python `re.findall(URL_PATTERN, value)`. URL_PATTERN is shared with
// unsafe-public-strings.js so any future regex tweak stays single-sourced.
// The shared regex carries the `g` flag, so we MUST clone its lastIndex per
// call (or use String.prototype.matchAll) to avoid stateful cross-call drift.
function findAllUrls(value) {
  if (typeof value !== "string") return [];
  return Array.from(value.matchAll(URL_PATTERN), (match) => match[0]);
}

// Exported so `technical-artifact-warnings.js` can reuse the SAME same-site
// test rather than growing a second registrable-domain implementation; the
// Python twins (`_identity_host` / `_identity_hosts_match`) already live in one
// module, so exporting here is what keeps the two languages in parity.
export function identityHost(value) {
  if (typeof value !== "string" || !value.trim()) return null;
  const raw = value.trim();
  const candidate = raw.startsWith("//") ? `https:${raw}` : raw;
  if (candidate.includes("\\") || !/^https?:\/\//i.test(candidate)) return null;
  let parsed;
  try {
    parsed = new URL(candidate);
  } catch {
    return null;
  }
  const authority = candidate.slice(candidate.indexOf("//") + 2).split(/[/?#]/u, 1)[0];
  if (
    !["http:", "https:"].includes(parsed.protocol)
    || !parsed.hostname
    || parsed.username
    || parsed.password
    || authority.includes("%")
    || /\s/u.test(authority)
  ) {
    return null;
  }
  return normalizeHost(candidate) || null;
}

export function identityHostsMatch(host, target) {
  if (host === target) return true;
  const options = { allowPrivateDomains: true };
  const hostDomain = getDomain(host, options);
  const targetDomain = getDomain(target, options);
  return Boolean(hostDomain && targetDomain && hostDomain === targetDomain);
}

function canonicalFactualUrl(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  let parsed;
  try {
    parsed = new URL(value.trim());
  } catch {
    return "";
  }
  if (!['http:', 'https:'].includes(parsed.protocol) || !parsed.hostname) return "";
  const host = parsed.hostname.toLowerCase().replace(/^www\./, "");
  const authority = parsed.port ? `${host}:${parsed.port}` : host;
  const pathName = parsed.pathname.replace(/\/+$/, "") || "/";
  return `${parsed.protocol}//${authority}${pathName}${parsed.search}`;
}

// Same-workflow asset evidence is a consistency surface for one concrete
// resource URL, not authenticated provenance. Unlike the social-profile
// canonicalizer above, it must not guess that fragments, www/apex hosts, or
// trailing-slash paths identify the same resource. The deterministic producer
// copies candidate URLs verbatim into the extraction, so byte-exact equality is
// both sufficient and the only equivalence this gate can prove. Deliberate
// same-UID artifact forgery is out of scope until capture/rehosting has an
// external trusted boundary.
const ASSET_LOCAL_HOST_SUFFIXES = [".localhost", ".local", ".internal"];

function validAssetPort(value) {
  if (typeof value !== "string" || !/^[0-9]+$/u.test(value)) return false;
  const port = Number.parseInt(value, 10);
  return Number.isInteger(port) && port >= 1 && port <= 65535;
}

function ipv4ToInt(host) {
  if (typeof host !== "string" || !/^[0-9]+(?:\.[0-9]+){3}$/u.test(host)) {
    return null;
  }
  const octets = host.split(".").map((part) => Number.parseInt(part, 10));
  if (octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
    return null;
  }
  return (
    ((octets[0] << 24) >>> 0)
    + (octets[1] << 16)
    + (octets[2] << 8)
    + octets[3]
  ) >>> 0;
}

function ipv4InRange(value, base, bits) {
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return (value & mask) === (base & mask);
}

const NON_GLOBAL_IPV4_RANGES = [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.0.0.0", 24],
  ["192.0.2.0", 24],
  ["192.168.0.0", 16],
  ["198.18.0.0", 15],
  ["198.51.100.0", 24],
  ["203.0.113.0", 24],
  ["224.0.0.0", 4],
  ["240.0.0.0", 4],
].map(([base, bits]) => [ipv4ToInt(base), bits]);

function globalAssetIpv4(host) {
  const value = ipv4ToInt(host);
  if (value === null) return null;
  // The IANA protocol-assignment block has exactly two global exceptions.
  if (value === ipv4ToInt("192.0.0.9") || value === ipv4ToInt("192.0.0.10")) return true;
  return !NON_GLOBAL_IPV4_RANGES.some(([base, bits]) => ipv4InRange(value, base, bits));
}

function ipv4EmbeddedHextets(part) {
  const value = ipv4ToInt(part);
  if (value === null) return null;
  return [(value >>> 16) & 0xffff, value & 0xffff];
}

function ipv6Pieces(section) {
  if (!section) return [];
  const tokens = section.split(":");
  const pieces = [];
  for (const [index, token] of tokens.entries()) {
    if (!token) return null;
    if (token.includes(".")) {
      if (index !== tokens.length - 1) return null;
      const embedded = ipv4EmbeddedHextets(token);
      if (embedded === null) return null;
      pieces.push(...embedded);
      continue;
    }
    if (!/^[0-9a-f]{1,4}$/iu.test(token)) return null;
    pieces.push(Number.parseInt(token, 16));
  }
  return pieces;
}

function ipv6ToBigInt(host) {
  const halves = host.toLowerCase().split("::");
  if (halves.length > 2) return null;
  const left = ipv6Pieces(halves[0]);
  const right = ipv6Pieces(halves.length === 2 ? halves[1] : "");
  if (left === null || right === null) return null;
  const missing = 8 - left.length - right.length;
  if ((halves.length === 2 && missing < 1) || (halves.length === 1 && missing !== 0)) {
    return null;
  }
  const pieces = [...left, ...Array(Math.max(missing, 0)).fill(0), ...right];
  if (pieces.length !== 8) return null;
  return pieces.reduce((acc, piece) => (acc << 16n) + BigInt(piece), 0n);
}

function ipv6InRange(value, base, bits) {
  const mask = ((1n << BigInt(bits)) - 1n) << BigInt(128 - bits);
  return (value & mask) === (base & mask);
}

const GLOBAL_UNICAST_IPV6 = [ipv6ToBigInt("2000::"), 3];
const NON_GLOBAL_IPV6_RANGES = [
  ["2001::", 23],
  ["2001:db8::", 32],
  ["fc00::", 7],
  ["fe80::", 10],
  ["ff00::", 8],
].map(([base, bits]) => [ipv6ToBigInt(base), bits]);

function globalAssetIpv6(host) {
  const value = ipv6ToBigInt(host);
  if (value === null) return null;
  return ipv6InRange(value, GLOBAL_UNICAST_IPV6[0], GLOBAL_UNICAST_IPV6[1])
    && !NON_GLOBAL_IPV6_RANGES.some(([base, bits]) => ipv6InRange(value, base, bits));
}

function validDnsAssetHost(host) {
  const hostWithoutTrailingDot = host.endsWith(".") ? host.slice(0, -1) : host;
  if (!hostWithoutTrailingDot || !hostWithoutTrailingDot.includes(".")) return false;
  let asciiHost = "";
  try {
    asciiHost = new URL(`http://${hostWithoutTrailingDot}/`).hostname.toLowerCase();
  } catch {
    return false;
  }
  if (
    !asciiHost
    || !asciiHost.includes(".")
    || asciiHost === "localhost"
    || ASSET_LOCAL_HOST_SUFFIXES.some((suffix) => asciiHost.endsWith(suffix))
  ) {
    return false;
  }
  const labels = asciiHost.split(".");
  return asciiHost.length <= 253 && labels.every((label) => (
    label.length > 0
    && label.length <= 63
    && /^[a-z0-9-]+$/u.test(label)
    && !label.startsWith("-")
    && !label.endsWith("-")
    // Standalone JS has no IDNA oracle in this import closure. Keep fallback
    // conservative; finalizer-driven validation consumes Python's exact
    // verdict for valid punycode/Unicode DNS labels through logoUrlSafety.
    && !label.startsWith("xn--")
  ));
}

function validAssetAuthority(authority) {
  if (
    typeof authority !== "string"
    || !authority
    || /[%@\\\s\u0000-\u001f\u007f]/u.test(authority)
  ) {
    return false;
  }

  if (authority.startsWith("[")) {
    const bracket = authority.indexOf("]");
    if (bracket <= 1) return false;
    const host = authority.slice(1, bracket);
    const portSuffix = authority.slice(bracket + 1);
    if (portSuffix && !(portSuffix.startsWith(":") && validAssetPort(portSuffix.slice(1)))) {
      return false;
    }
    return globalAssetIpv6(host) === true;
  }

  if (authority.includes("[") || authority.includes("]")) return false;
  if ((authority.match(/:/gu) || []).length > 1) return false;
  let host = authority;
  if (authority.includes(":")) {
    const parts = authority.split(":");
    [host] = parts;
    if (!validAssetPort(parts[1])) return false;
  }
  if (!host) return false;

  const hostWithoutTrailingDot = host.endsWith(".") ? host.slice(0, -1) : host;
  const ipv4Global = globalAssetIpv4(hostWithoutTrailingDot);
  if (ipv4Global !== null) return !host.endsWith(".") && ipv4Global;
  if (/^[0-9]+(?:\.[0-9]+){3}$/u.test(hostWithoutTrailingDot)) return false;
  return validDnsAssetHost(host);
}

function exactPublicAssetUrl(value) {
  if (
    typeof value !== "string"
    || !value
    || value !== value.trim()
    || !(value.startsWith("http://") || value.startsWith("https://"))
    || /[\\\s\u0000-\u001f\u007f]/u.test(value)
  ) {
    return "";
  }
  const scheme = value.startsWith("https://") ? "https:" : "http:";
  const rest = value.slice(scheme.length + 2);
  const authority = rest.split(/[/?#]/u, 1)[0];
  if (!validAssetAuthority(authority)) return "";
  try {
    const parsed = new URL(value);
    if (
      !["http:", "https:"].includes(parsed.protocol)
      || parsed.protocol !== scheme
      || !parsed.hostname
      || parsed.username
      || parsed.password
    ) {
      return "";
    }
  } catch {
    return "";
  }
  return value;
}

function svgMarkupSha256(svg) {
  return crypto.createHash("sha256").update(svg, "utf8").digest("hex");
}

function isSha256Hex(value) {
  return typeof value === "string" && /^[0-9a-f]{64}$/u.test(value);
}

function logoUrlSafetyFromPacket(packet) {
  const logoUrlSafety = new Map();
  if (!isPlainObject(packet)) return logoUrlSafety;
  const rows = Array.isArray(packet.logoUrlSafety) ? packet.logoUrlSafety : [];
  for (const row of rows) {
    if (!Array.isArray(row) || row.length !== 2) continue;
    const [url, verdict] = row;
    if (
      typeof url === "string"
      && (verdict === "safe" || verdict === "unsafe")
      && !logoUrlSafety.has(url)
    ) {
      // Exact final URL string only. Do not canonicalize or let a verdict for
      // one spelling license another spelling of the resource.
      logoUrlSafety.set(url, verdict);
    }
  }
  return logoUrlSafety;
}

function exactPublicAssetUrlWithVerdict(value, logoUrlSafety) {
  if (typeof value === "string") {
    const verdict = logoUrlSafety?.get(value);
    if (verdict === "safe") return value;
    if (verdict === "unsafe") return "";
  }
  return exactPublicAssetUrl(value);
}

function logoEvidenceFromPacket(packet) {
  const authorizedUrls = new Set();
  const authorizedSvgBindings = new Set();
  const authorizedInlineSvgHashes = new Set();
  const logoUrlSafety = logoUrlSafetyFromPacket(packet);
  if (!isPlainObject(packet)) {
    return { authorizedUrls, authorizedSvgBindings, authorizedInlineSvgHashes, logoUrlSafety };
  }
  for (const value of Array.isArray(packet.authorizedUrls) ? packet.authorizedUrls : []) {
    const exact = exactPublicAssetUrlWithVerdict(value, logoUrlSafety);
    if (exact) authorizedUrls.add(exact);
  }
  for (const binding of Array.isArray(packet.authorizedSvgBindings) ? packet.authorizedSvgBindings : []) {
    if (!Array.isArray(binding) || binding.length !== 2) continue;
    const [url, digest] = binding;
    if (!exactPublicAssetUrlWithVerdict(url, logoUrlSafety) || !isSha256Hex(digest)) continue;
    authorizedSvgBindings.add(JSON.stringify([url, digest]));
  }
  for (const digest of Array.isArray(packet.authorizedInlineSvgHashes) ? packet.authorizedInlineSvgHashes : []) {
    if (isSha256Hex(digest)) authorizedInlineSvgHashes.add(digest);
  }
  return { authorizedUrls, authorizedSvgBindings, authorizedInlineSvgHashes, logoUrlSafety };
}

// Mirrors Python `_runtime_bound_logo_url`. TWO ARMS, because a hosted logo
// row can carry markup or carry none.
//
//   * markup present - the (url, digest) pair must match exactly. The digest
//     names the source the URL was minted FROM, which is what rejects a
//     one-character or canonical-equivalent mutation of a minted URL.
//   * `svgPath` EMPTY - there is no digest on the row to pair with, and there
//     never will be: a hosted PNG converted from raster bytes, or from an
//     over-cap SVG whose reduction is unpublishable, has no publishable
//     markup. The URL alone is then the proof, which is sound because the
//     binding set holds ONLY urls the finalizer process received from
//     `upload_image` moments ago - it is not an allowlist and nothing
//     agent-authored reaches it. Without this arm the finalizer's own mint is
//     reported as an invented URL and the run exits 4 on the asset it just
//     created.
//
// The Python twin and this function must agree row for row; the parity cell in
// `content-validators.test.js` drives the same packet through both shapes.
function runtimeBoundLogoUrl(url, svgHash, bindings) {
  if (typeof url !== "string" || !url) return false;
  if (svgHash) return bindings.has(JSON.stringify([url, svgHash]));
  for (const binding of bindings) {
    const parsed = JSON.parse(binding);
    if (parsed[0] === url) return true;
  }
  return false;
}

function runtimeLogoBindings(bindings, logoUrlSafety = null) {
  const exactRuntimeBindings = new Set();
  const rows = bindings instanceof Set || Array.isArray(bindings) ? bindings : [];
  for (const binding of rows) {
    if (!Array.isArray(binding) || binding.length !== 2) continue;
    const [url, digest] = binding;
    if (!exactPublicAssetUrlWithVerdict(url, logoUrlSafety) || !isSha256Hex(digest)) continue;
    exactRuntimeBindings.add(JSON.stringify([url, digest]));
  }
  return exactRuntimeBindings;
}

function canonicalSocialEvidenceUrl(platform, value) {
  const canonical = canonicalFactualUrl(value);
  if (!canonical || !canonical.includes("?")) return canonical;

  const queryStart = canonical.indexOf("?");
  const base = canonical.slice(0, queryStart);
  const rawQuery = canonical.slice(queryStart + 1);
  // `platform` is a key of an agent- or probe-authored JSON object, so it can
  // be an `Object.prototype` name. A plain `[platform]` read then answers
  // `constructor` / `toString` with a FUNCTION, which is truthy, and
  // `.has(...)` on it throws -- the validator dies on a shape it exists to
  // judge. Every sibling doing this lookup is already guarded
  // (`technical-artifact-warnings.js` twice, with `hasOwnProperty.call`) and
  // the Python twin uses `dict.get`; this one was the exception.
  const platformKeys = Object.hasOwn(SOCIAL_TRACKING_QUERY_KEYS, platform)
    ? SOCIAL_TRACKING_QUERY_KEYS[platform]
    : new Set();
  const substantive = rawQuery.split("&").filter((component) => {
    const key = component.split("=", 1)[0].toLowerCase();
    return !(
      platformKeys.has(key)
      || GENERIC_SOCIAL_TRACKING_QUERY_KEYS.has(key)
      || key.startsWith("utm_")
    );
  });
  return substantive.length ? `${base}?${substantive.join("&")}` : base;
}

function canonicalContact(value, channel) {
  if (typeof value !== "string") return "";
  let text = value.split(/\s+/u).filter(Boolean).join(" ").trim();
  if (!text) return "";
  if (channel === "emails") {
    if (text.toLowerCase().startsWith("mailto:")) {
      text = text.slice(7).split("?", 1)[0];
      try {
        text = decodeURIComponent(text);
      } catch {
        // The capture probe also keeps a malformed-but-readable raw target.
      }
    }
    return text.match(/[^\s<>@]+@[^\s<>@]+/u)?.[0]?.toLowerCase() || "";
  }
  if (channel === "phones") {
    if (text.toLowerCase().startsWith("tel:")) text = phoneFromTel(text);
    return Array.from(text).filter((character) => /\p{Nd}/u.test(character)).join("");
  }
  return text.toLowerCase();
}

function normalizedContactText(value) {
  return typeof value === "string"
    ? value.split(/\s+/u).filter(Boolean).join(" ").trim().toLowerCase()
    : "";
}

function contactValueIsStrictFact(value, channel) {
  if (typeof value !== "string") return false;
  const canonical = canonicalContact(value, channel);
  const trimmedLower = value.trim().toLowerCase();
  if (channel === "emails") {
    return Boolean(
      canonical
      && (trimmedLower === canonical || trimmedLower === `mailto:${canonical}`)
    );
  }
  if (channel === "phones") {
    return Boolean(canonical && /^(?:tel:)?[+()\-.\s\p{Nd}]+$/u.test(trimmedLower));
  }
  return Boolean(normalizedContactText(value));
}

function contactEvidenceValues(rows, channel) {
  if (!Array.isArray(rows)) return new Set();
  const values = new Set();
  for (const row of rows) {
    if (channel === "addresses") {
      const candidates = typeof row === "string"
        ? [row]
        : isPlainObject(row)
          ? ["address", "text", "value"]
            .map((key) => row[key])
            .filter((value) => typeof value === "string")
          : [];
      for (const candidate of candidates) {
        const text = normalizedContactText(candidate);
        if (text) values.add(text);
      }
      continue;
    }

    const typedKey = channel === "emails" ? "email" : "phone";
    const trustedCandidates = isPlainObject(row)
      ? [typedKey, "url"]
        .map((key) => row[key])
        .filter((value) => typeof value === "string")
      : [];
    const literalCandidates = typeof row === "string"
      ? [row]
      : isPlainObject(row)
        ? ["text", "value"]
          .map((key) => row[key])
          .filter((value) => typeof value === "string")
        : [];
    for (const candidate of trustedCandidates) {
      const canonical = canonicalContact(candidate, channel);
      if (canonical) values.add(canonical);
    }
    for (const candidate of literalCandidates) {
      if (!contactValueIsStrictFact(candidate, channel)) continue;
      const canonical = canonicalContact(candidate, channel);
      if (canonical) values.add(canonical);
    }
  }
  return values;
}

export function detectBrandkitContentBlockers({
  brandkit,
  technicalDir,
  targetUrl,
  runtimeAssetBindings = null,
  logoEvidencePacket = null,
}) {
  const blockers = [];
  const website = isPlainObject(brandkit?.brand?.organization)
    ? brandkit.brand.organization.website
    : "";
  if (typeof website === "string" && website.trim()) {
    const websiteHost = identityHost(website);
    const targetHost = identityHost(targetUrl);
    if (!websiteHost || !targetHost || !identityHostsMatch(websiteHost, targetHost)) {
      blockers.push(
        `${WRONG_SITE_IDENTITY_BLOCKER}: ${website} (run target: ${targetUrl}).`,
      );
    }
  }

  const gateObject = (filename) => {
    const filePath = path.join(technicalDir, filename);
    const value = readGateJson(filePath);
    if (value !== null && !isPlainObject(value)) {
      throw new TechnicalArtifactUnreadableError(
        `Blocker gate requires technical artifact ${filePath} to be a JSON object. `
        + "A wrong-shaped current-run artifact cannot be treated as absent evidence.",
        { filePath },
      );
    }
    return value;
  };
  const pageSignals = gateObject("page-signals.json");
  const capture = gateObject("capture.json");
  const logoAssets = gateObject("logo-assets.json");

  const wrongShape = (filename, field) => {
    const filePath = path.join(technicalDir, filename);
    throw new TechnicalArtifactUnreadableError(
      `Blocker gate requires ${filePath}:${field} to have its producer-defined JSON shape. `
      + "A wrong-shaped current-run evidence field cannot be treated as absent evidence.",
      { filePath },
    );
  };
  if (pageSignals) {
    if (Object.hasOwn(pageSignals, "contacts") && !isPlainObject(pageSignals.contacts)) {
      wrongShape("page-signals.json", "contacts");
    }
    for (const channel of ["emails", "phones", "addresses"]) {
      if (isPlainObject(pageSignals.contacts) && Object.hasOwn(pageSignals.contacts, channel)
        && !Array.isArray(pageSignals.contacts[channel])) {
        wrongShape("page-signals.json", `contacts.${channel}`);
      }
    }
    if (Object.hasOwn(pageSignals, "socials") && !Array.isArray(pageSignals.socials)) {
      wrongShape("page-signals.json", "socials");
    }
    if (Object.hasOwn(pageSignals, "socialsForBrandkit") && !isPlainObject(pageSignals.socialsForBrandkit)) {
      wrongShape("page-signals.json", "socialsForBrandkit");
    }
    if (Object.hasOwn(pageSignals, "logoCandidates") && !Array.isArray(pageSignals.logoCandidates)) {
      wrongShape("page-signals.json", "logoCandidates");
    }
  }
  if (capture && Object.hasOwn(capture, "observedAssetUrls") && !Array.isArray(capture.observedAssetUrls)) {
    wrongShape("capture.json", "observedAssetUrls");
  }
  if (logoAssets && Object.hasOwn(logoAssets, "entries") && !Array.isArray(logoAssets.entries)) {
    wrongShape("logo-assets.json", "entries");
  }
  const contacts = isPlainObject(pageSignals?.contacts) ? pageSignals.contacts : null;
  const finalContacts = isPlainObject(brandkit?.contacts) ? brandkit.contacts : null;
  for (const channel of ["emails", "phones", "addresses"]) {
    const evidence = contactEvidenceValues(contacts?.[channel], channel);
    const finalValues = finalContacts?.[channel];
    for (const value of Array.isArray(finalValues) ? finalValues : []) {
      const canonical = canonicalContact(value, channel);
      const accepted = channel === "emails"
        ? contactValueIsStrictFact(value, channel) && evidence.has(canonical)
        : channel === "phones"
          ? contactValueIsStrictFact(value, channel) && evidence.has(canonical)
          : evidence.has(normalizedContactText(value));
      if (!accepted) {
        blockers.push(`${INVENTED_CONTACT_BLOCKER}: contacts.${channel} contains ${value}.`);
      }
    }
  }

  const socialEvidence = isPlainObject(pageSignals?.socialsForBrandkit)
    ? pageSignals.socialsForBrandkit
    : null;
  const rawSocialEvidence = Array.isArray(pageSignals?.socials) ? pageSignals.socials : null;
  const socialUrlsByPlatform = Object.fromEntries(
    SOCIAL_PLATFORM_KEYS.map((platform) => [platform, new Set()]),
  );
  if (socialEvidence) {
    for (const [platform, value] of Object.entries(socialEvidence)) {
      const canonical = canonicalSocialEvidenceUrl(platform, value);
      if (canonical && Object.hasOwn(socialUrlsByPlatform, platform)) {
        socialUrlsByPlatform[platform].add(canonical);
      }
    }
  }
  if (rawSocialEvidence) {
    for (const row of rawSocialEvidence) {
      if (!isPlainObject(row) || !Object.hasOwn(socialUrlsByPlatform, row.platform)) continue;
      const canonical = canonicalSocialEvidenceUrl(row.platform, row.url);
      if (canonical) socialUrlsByPlatform[row.platform].add(canonical);
    }
  }
  // Mirrors Python `detect_brandkit_content_blockers`: a social URL whose host
  // is neither the platform's nor the brand's own is NOT a blocker. The Brand
  // Kit write stores any http(s) URL whatever its host, so once the evidence
  // gate below has established the value is real, a host that merely is not
  // the platform's is a shape finding on a real value -- a warning
  // (`validateBrandkitContent`), like every other shape mismatch. Refusing the
  // run over one persisted a whole kit's worth of nothing.
  const finalSocials = isPlainObject(brandkit?.socials) ? brandkit.socials : null;
  if (finalSocials) {
    for (const [platform, value] of Object.entries(finalSocials)) {
      if (typeof value !== "string" || !value.trim()) continue;
      const canonicalValue = canonicalSocialEvidenceUrl(platform, value);
      const expectedValues = Object.hasOwn(socialUrlsByPlatform, platform)
        ? socialUrlsByPlatform[platform]
        : new Set();
      if (!canonicalValue || !expectedValues.has(canonicalValue)) {
        blockers.push(`${INVENTED_SOCIAL_BLOCKER}: socials.${platform} contains ${value}.`);
      }
    }
  }

  const evidence = logoEvidenceFromPacket(logoEvidencePacket);
  const exactRuntimeBindings = runtimeLogoBindings(runtimeAssetBindings, evidence.logoUrlSafety);

  const logos = Array.isArray(brandkit?.brand?.logos) ? brandkit.brand.logos : [];
  for (const [index, logo] of logos.entries()) {
    if (!isPlainObject(logo)) continue;
    const url = logo.url;
    const svg = logo.svgPath;
    const svgHash = typeof svg === "string" && svg ? svgMarkupSha256(svg) : "";
    const pairKey = JSON.stringify([url, svgHash]);
    const runtimeBound = exactRuntimeBindings.has(pairKey);
    if (typeof url === "string" && url.trim()) {
      const safeUrl = exactPublicAssetUrlWithVerdict(url, evidence.logoUrlSafety);
      // The URL arm accepts a markup-less hosted row; the svgPath arm below
      // keeps requiring the exact pair, and cannot reach the widened arm
      // because it only runs when `svg` is non-empty.
      const urlRuntimeBound = runtimeBoundLogoUrl(url, svgHash, exactRuntimeBindings);
      if (!safeUrl) {
        blockers.push(`${UNSAFE_ASSET_URL_BLOCKER}: brand.logos[${index}].url contains ${url}.`);
      } else if (!evidence.authorizedUrls.has(url) && !urlRuntimeBound) {
        blockers.push(`${INVENTED_ASSET_URL_BLOCKER}: brand.logos[${index}].url contains ${url}.`);
      }
    }
    if (typeof svg === "string" && svg) {
      const canonicalSvg = canonicalizeSvgForSafetyScan(svg);
      for (const pattern of SVG_DANGEROUS_PATTERNS) {
        if (pattern.regex.test(canonicalSvg)) {
          blockers.push(
            `${UNSAFE_SVG_BLOCKER}: brand.logos[${index}].svgPath matches ${pattern.source}.`,
          );
        }
      }
      if (svgInnerMarkupIsUnsafe(svg)) {
        blockers.push(
          `${UNSAFE_SVG_BLOCKER}: brand.logos[${index}].svgPath is not safe well-formed inner markup.`,
        );
      }
      if (!(
        evidence.authorizedSvgBindings.has(pairKey)
        || (url === "" && evidence.authorizedInlineSvgHashes.has(svgHash))
        || runtimeBound
      )) {
        blockers.push(
          `${UNBOUND_SVG_BLOCKER}: brand.logos[${index}].svgPath has no exact URL/SVG or inline-SVG evidence binding.`,
        );
      }
    }
  }
  return Array.from(new Set(blockers));
}

// Mirrors Python `_collect_unknown_text_urls`. Recursively scans strings,
// arrays, and dicts; flags any extracted URL whose normalized host is not the
// target site, not in the social allowlist, and not in the observed asset set.
// Returns warnings in traversal order with no dedupe (the public orchestrator
// dedupes once at the end).
export function collectUnknownTextUrls(value, { targetBase, observedAssetUrls }) {
  const warnings = [];
  walkForUrls(value, { targetBase, observedAssetUrls, warnings });
  return warnings;
}

function walkForUrls(value, ctx) {
  if (typeof value === "string") {
    const allowedDomains = allowedTextDomains();
    for (const match of findAllUrls(value)) {
      if (
        urlMatchesDomain(match, ctx.targetBase) ||
        urlMatchesAllowedDomains(match, allowedDomains) ||
        ctx.observedAssetUrls.has(match)
      ) {
        continue;
      }
      ctx.warnings.push(`Text field contains URL to unexpected domain: ${match}`);
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) walkForUrls(item, ctx);
    return;
  }
  if (isPlainObject(value)) {
    for (const child of Object.values(value)) walkForUrls(child, ctx);
  }
}

// --- Public orchestrator ---

// Mirrors Python `validate_brandkit_content(brandkit, *, target_url, observed_asset_urls=None)`.
//
// Iteration order (must match Python exactly so dedupe ordering stays stable):
//   1. Walk `brand.logos[]`:
//        a. emit "Logo URL points to unexpected domain" when the logo URL is
//           neither on the target site nor in the observed/current-runtime
//           exact asset sets.
//        b. emit "SVG path contains dangerous pattern: <pattern.source>" once
//           per matching dangerous pattern in `svgPath`.
//   2. Walk `socials`:
//        - skip blank values;
//        - skip when the URL already matches the target site;
//        - skip when the platform key is not in PLATFORM_DOMAIN_ALLOWLIST
//          (Python's `allowed_domains is None` early-out);
//        - emit a warning for each remaining mismatch.
//   3. Walk `importantLinks[]` and emit a warning when the URL is off-domain.
//   4. Recurse into `brand.*` description fields and emit unknown-URL warnings.
//   5. Recurse into `brand.brandVoice` and `brand.businessContext` and emit
//      unknown-URL warnings.
// Warnings are deduped at the end via `dict.fromkeys(...)` semantics (set order).
export function validateBrandkitContent({
  brandkit,
  targetUrl,
  observedAssetUrls = null,
  runtimeAssetBindings = null,
  logoEvidencePacket = null,
}) {
  const warnings = [];
  const evidence = logoEvidenceFromPacket(logoEvidencePacket);
  const observedRows =
    observedAssetUrls instanceof Set || Array.isArray(observedAssetUrls)
      ? observedAssetUrls
      : [];
  const observedSet = new Set(
    Array.from(
      observedRows,
      (value) => exactPublicAssetUrlWithVerdict(value, evidence.logoUrlSafety),
    ).filter(Boolean),
  );
  const runtimeBindings = runtimeLogoBindings(runtimeAssetBindings, evidence.logoUrlSafety);
  const targetBase = normalizeHost(typeof targetUrl === "string" ? targetUrl : "");

  const brand = isPlainObject(brandkit?.brand) ? brandkit.brand : {};
  const logos = Array.isArray(brand.logos) ? brand.logos : [];
  for (const logo of logos) {
    if (!isPlainObject(logo)) continue;
    const url = typeof logo.url === "string" ? logo.url : "";
    const svg = typeof logo.svgPath === "string" ? logo.svgPath : "";
    const svgHash = svg ? svgMarkupSha256(svg) : "";
    const runtimeBound = runtimeBoundLogoUrl(url, svgHash, runtimeBindings);
    if (
      url &&
      !(
        urlMatchesDomain(url, targetBase) ||
        observedSet.has(url) ||
        runtimeBound
      )
    ) {
      warnings.push(`Logo URL points to unexpected domain: ${url}`);
    }
    if (svg) {
      const canonicalSvg = canonicalizeSvgForSafetyScan(svg);
      for (const pattern of SVG_DANGEROUS_PATTERNS) {
        if (pattern.regex.test(canonicalSvg)) {
          warnings.push(`SVG path contains dangerous pattern: ${pattern.source}`);
        }
      }
      if (svgInnerMarkupIsUnsafe(svg)) {
        warnings.push("SVG path is not safe well-formed inner markup");
      }
    }
  }

  const socials = brandkit?.socials;
  if (isPlainObject(socials)) {
    for (const [platform, url] of Object.entries(socials)) {
      if (typeof url !== "string" || url.trim().length === 0) continue;
      const allowedDomains = PLATFORM_DOMAIN_ALLOWLIST[platform];
      if (urlMatchesDomain(url, targetBase)) continue;
      if (allowedDomains === undefined) continue;
      if (!socialUrlMatchesPlatform(platform, url)) {
        warnings.push(`Social URL '${platform}' points to unexpected domain: ${url}`);
      }
    }
  }

  const importantLinks = Array.isArray(brandkit?.importantLinks) ? brandkit.importantLinks : [];
  for (const link of importantLinks) {
    if (!isPlainObject(link)) continue;
    const url = typeof link.url === "string" ? link.url : "";
    if (url && !urlMatchesDomain(url, targetBase)) {
      warnings.push(`Important link points to unexpected domain: ${url}`);
    }
  }

  for (const description of iterDescriptionValues(brand)) {
    warnings.push(...collectUnknownTextUrls(description, { targetBase, observedAssetUrls: observedSet }));
  }

  warnings.push(
    ...collectUnknownTextUrls(brand.brandVoice ?? {}, { targetBase, observedAssetUrls: observedSet }),
  );

  warnings.push(
    ...collectUnknownTextUrls(brand.businessContext ?? {}, {
      targetBase,
      observedAssetUrls: observedSet,
    }),
  );

  return Array.from(new Set(warnings));
}

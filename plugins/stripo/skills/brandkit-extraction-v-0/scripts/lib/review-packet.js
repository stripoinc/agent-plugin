// The scaffold-time REVIEW PACKET (WP-A2).
//
// After `--mode scaffold` the agent has to decide six things: the
// organisation name, the logo rows, the contacts, the socials, the
// important links and the languages, plus the product-card variant index.
// Every input to those decisions already exists on disk, spread across
// `capture.json`, `page-signals.json`, `dom.json`, the draft, the
// diagnostics and `homepage-pass-status.json` — so the agent opens six
// files (measured: 6.4 artifact reads per run) to reconstruct one table.
//
// `buildReviewPacket` is that table. It is a PURE PROJECTION: every leaf
// it emits is a value one of its inputs already carries (truncated, capped
// or counted), plus a fixed decision table and a fixed field list. It
// derives nothing, measures nothing and asks nothing new of the page — so
// it cannot change what the run extracts, and the artifacts the scaffold
// writes stay byte-identical.
//
// NO I/O IN THIS MODULE. `scaffold-pass.js` reads the files and writes the
// packet; this file only maps values. `node:path` is imported for
// `path.join` (string arithmetic), never for a filesystem call.
//
// Degraded input is the normal case, not an error case: the homepage pass
// can be blocked, `dom.json` can be absent on an old capture, a non-ecom
// site has no product card. Every section therefore degrades to `null`
// rather than throwing — a scaffold that started failing because a packet
// could not be built would trade a whole run for a convenience.

import path from "node:path";
import { isUnresolvedRoleEntry } from "./role-coverage-reasons.js";

export const REVIEW_PACKET_FILENAME = "review-packet.json";
export const REVIEW_PACKET_VERSION = 1;

// Caps. Every string leaf that is PROSE is truncated; every list that could
// grow with the page is capped. The packet is read by the agent in one tool
// output, so its size has to be a property of the packet rather than of the
// site.
//
// A leaf the contract says to COPY is never shortened — see `logoRows` and
// `projectExceptUrls`. A shortened `svgPath` or `url` is not a shorter true
// value, it is a DIFFERENT, invented one: copied into `brand.logos` or
// `importantLinks` it fails the finalizer's factual gate (exit 4, nothing
// promoted). Those leaves are bounded by their producers instead — capture
// suppresses over-cap SVG markup before it reaches the diagnostics — so the
// packet inherits a bound rather than adding a second copy of the trap.
export const MAX_STRING_CHARS = 200;
export const MAX_NAVIGATION_ANCHORS = 40;
export const MAX_LOGO_ALTS = 5;
export const MAX_H1 = 3;
export const MAX_CONTACTS_PER_CHANNEL = 10;

// The container tags whose descendant anchors count as navigation.
//
// `dom.json` records `{tag, id, class, text, url, src, children}` and NO
// attribute map, so `[role="banner"]` / `[role="navigation"]` — named in the
// spec alongside these two tags — cannot be matched here at all. Matching
// them would need a new field in the DOM capture, which is a producer change
// and a different work package. Recorded rather than silently narrowed.
export const NAVIGATION_REGION_TAGS = Object.freeze(["header", "nav"]);

// The 5 bundled abandoned-cart product-card variants, verbatim from
// `references/product-card-variants.md` "The 5 variants". Embedded as DATA so
// the agent confirming or overriding `recommendedVariantIndex` does not have
// to open the reference file. Kept in sync by
// `review-packet.test.js#variant table matches the reference doc`.
export const PRODUCT_CARD_VARIANT_TABLE = Object.freeze([
  { index: 0, module: "Single Product Card Standard", surface: "bare", ctaShape: "verb + decorative glyph", titleAlignment: "left", bundledOldPrice: "top" },
  { index: 1, module: "Single Product Card Standard No.2", surface: "tiled", ctaShape: "verb-only full-width", titleAlignment: "centre", bundledOldPrice: "top" },
  { index: 2, module: "Single Product Card Standard No.3", surface: "bare", ctaShape: "icon-only glyph", titleAlignment: "left", bundledOldPrice: "top" },
  { index: 3, module: "Single Product Card Standard No.6", surface: "tiled", ctaShape: "verb-only full-width", titleAlignment: "left", bundledOldPrice: "right" },
  { index: 4, module: "Single Product Card Standard No.5", surface: "tiled", ctaShape: "verb-only full-width", titleAlignment: "centre", bundledOldPrice: "left" },
]);

// The fields the scaffold deliberately leaves for the agent. Printed so the
// packet answers "what am I supposed to write" without a SKILL.md re-read.
export const AGENT_OWNED_FIELDS = Object.freeze([
  "brand.organization.name",
  "brand.logos",
  "contacts",
  "socials",
  "importantLinks",
  "languages",
  "brand.components.productCard[0].recommendedVariantIndex",
  "brand.components.productCard[0].recommendedVariantReason",
]);

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function truncate(value) {
  if (typeof value !== "string") return value;
  return value.length > MAX_STRING_CHARS ? value.slice(0, MAX_STRING_CHARS) : value;
}

// Verbatim-with-truncation copy. Used wherever the spec says a section is the
// input "verbatim": the values stay the input's values, only over-long strings
// are shortened, and no key is renamed.
function project(value) {
  if (typeof value === "string") return truncate(value);
  if (Array.isArray(value)) return value.map(project);
  if (isObject(value)) {
    const out = {};
    for (const [key, entry] of Object.entries(value)) out[key] = project(entry);
    return out;
  }
  return value;
}

// A whole-value copy with NO truncation anywhere inside it. Used for the
// objects and leaves the contract tells the agent to copy verbatim.
function cloneVerbatim(value) {
  if (Array.isArray(value)) return value.map(cloneVerbatim);
  if (isObject(value)) {
    const out = {};
    for (const [key, entry] of Object.entries(value)) out[key] = cloneVerbatim(entry);
    return out;
  }
  return value;
}

// `project`, except that any key named `url` is copied whole. `importantLinks`
// rows are copied into the extraction as `{name, url}`: the `name` is prose
// (normalize drops any over 40 chars anyway), the `url` is a copy target.
function projectExceptUrls(value) {
  if (Array.isArray(value)) return value.map(projectExceptUrls);
  if (isObject(value)) {
    const out = {};
    for (const [key, entry] of Object.entries(value)) {
      out[key] = key === "url" ? cloneVerbatim(entry) : projectExceptUrls(entry);
    }
    return out;
  }
  return project(value);
}

function hostOf(url) {
  if (typeof url !== "string" || url === "") return null;
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return null;
  }
}

function walkDom(node, visit, region) {
  if (!isObject(node)) return;
  const tag = typeof node.tag === "string" ? node.tag.toLowerCase() : "";
  const nextRegion = NAVIGATION_REGION_TAGS.includes(tag) ? tag : region;
  visit(node, tag, nextRegion);
  if (!Array.isArray(node.children)) return;
  for (const child of node.children) walkDom(child, visit, nextRegion);
}

// Same-origin anchors inside a `<header>` / `<nav>` subtree, in document
// order, capped.
//
// WHY THIS SECTION EXISTS AT ALL: `page-signals.importantLinks` is a filtered
// set and does NOT carry the header category links (measured on a live capture
// whose category anchors are absent from that array), which is exactly what
// the agent greps `dom.json` for today. Same-origin because an off-site anchor
// in a header is a payment badge or a marketplace link, never a category, and
// because a foreign URL is the one thing the finalizer refuses outright.
export function navigationFromDom(dom, baseUrl) {
  if (!isObject(dom)) return null;
  const baseHost = hostOf(baseUrl);
  const rows = [];
  walkDom(dom, (node, tag, region) => {
    if (rows.length >= MAX_NAVIGATION_ANCHORS) return;
    if (tag !== "a" || !region) return;
    const href = typeof node.url === "string" ? node.url : "";
    // `dom.json` records the href as authored, so a same-origin nav is very
    // often relative (`/catalog`). Resolving against the landed URL is what
    // makes those rows exist at all; an absolute href resolves to itself.
    const resolved = resolveAgainst(href, baseUrl);
    if (!resolved) return;
    if (baseHost && resolved.host !== baseHost) return;
    // The `name` is a label the agent rewrites; the `url` is a copy target and
    // is never shortened (a cut href is an invented URL the finalizer refuses).
    rows.push({ name: truncate(typeof node.text === "string" ? node.text : ""), url: resolved.url, region });
  });
  return rows;
}

function resolveAgainst(url, baseUrl) {
  if (typeof url !== "string" || url === "") return null;
  const base = typeof baseUrl === "string" && baseUrl !== "" ? baseUrl : undefined;
  let parsed = null;
  try {
    parsed = new URL(url, base);
  } catch {
    return null;
  }
  const host = parsed.host.toLowerCase();
  // `tel:` / `mailto:` / `javascript:` carry no host, exactly as before.
  if (!host) return null;
  return { url: parsed.href, host };
}

function headingsFromDom(dom) {
  if (!isObject(dom)) return [];
  const rows = [];
  walkDom(dom, (node, tag) => {
    if (rows.length >= MAX_H1 || tag !== "h1") return;
    const text = typeof node.text === "string" ? node.text.trim() : "";
    if (text) rows.push(truncate(text));
  });
  return rows;
}

function candidateList(diagnostics, key) {
  const candidates = isObject(diagnostics) ? diagnostics.candidates : null;
  const rows = isObject(candidates) ? candidates[key] : null;
  return Array.isArray(rows) ? rows : [];
}

function seeds(diagnostics, key) {
  return candidateList(diagnostics, key).map((entry) => ({
    value: project(entry?.value ?? null),
    confidence: entry?.confidence ?? null,
    evidence: truncate(entry?.evidence ?? "") || null,
  }));
}

// The suffixes an email client renders as stored. Same set the finalizer's
// hosting preflight leaves untouched and the same set the report line calls
// "confirmed email-safe" (`brandkit_finalize/report_lines.py`
// `EMAIL_SAFE_SUFFIXES`); a packet that disagreed with them would pre-select a
// row the finalizer then has to convert.
const EMAIL_SAFE_URL_SUFFIXES = [".png", ".jpg", ".jpeg", ".gif"];

// The consumer's own type set: `static_module_builder` reads the first row of
// one of these types and halts `no_brand_logo` without one. A favicon is never
// the brand's mark, so it is never pre-selected however it ranks.
const PRIMARY_LOGO_TYPES = ["primary", "logo"];

// null = there is no url to judge (an inline `<svg>` capture legitimately has
// none). false = an email client may not render it as stored — a `.svg`, a
// `.webp`, an extensionless CDN path. The fact is MEASURED from the url the
// candidate already carries; it adds no input and changes no ranking.
function emailSafeUrl(url) {
  if (typeof url !== "string" || !url) return null;
  let pathname = "";
  try {
    pathname = new URL(url).pathname.toLowerCase();
  } catch {
    pathname = url.split(/[?#]/, 1)[0].toLowerCase();
  }
  return EMAIL_SAFE_URL_SUFFIXES.some((suffix) => pathname.endsWith(suffix));
}

// WHICH ROW THE AGENT SHOULD COPY, decided here instead of left to preference.
// Two primaries of the same mark tied at 0.94 in one run and were chosen
// DIFFERENTLY on two runs of the same site: the run that took the `.svg` shipped
// a logo the rasterizer then refused, while an already-email-safe `.png` of the
// same mark sat beside it in the packet. Detection confidence is the first key
// because it is what the ranker measured; email-safety breaks a TIE only,
// because "no conversion needed" is a property of the asset rather than a
// preference between marks. REGION IS NOT A KEY IN EITHER DIRECTION — a header
// mark and a footer mark can be one mark or two variants (light/dark), and
// nothing here can tell those apart, so it never overrides what was measured.
// Document order — the ranker's own — is the final key.
function preselectedIndex(rows) {
  let best = -1;
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const type = row && row.value && typeof row.value.type === "string" ? row.value.type : "";
    if (!PRIMARY_LOGO_TYPES.includes(type)) continue;
    if (best < 0) {
      best = index;
      continue;
    }
    const confidence = typeof row.confidence === "number" ? row.confidence : -Infinity;
    const bestConfidence = typeof rows[best].confidence === "number" ? rows[best].confidence : -Infinity;
    if (confidence > bestConfidence) {
      best = index;
      continue;
    }
    if (confidence === bestConfidence && row.emailSafeUrl === true && rows[best].emailSafeUrl !== true) {
      best = index;
    }
  }
  return best;
}

function logoRows(diagnostics, pageSignals, logoAssets) {
  const candidates = candidateList(diagnostics, "logos");
  if (candidates.length === 0) return [];
  const signalRows = Array.isArray(pageSignals?.logoCandidates) ? pageSignals.logoCandidates : [];
  const assetRows = Array.isArray(logoAssets?.entries) ? logoAssets.entries : [];
  const rows = candidates.map((entry) => {
    const value = isObject(entry?.value) ? entry.value : {};
    const url = typeof value.url === "string" ? value.url : "";
    const svgPath = typeof value.svgPath === "string" ? value.svgPath : "";
    // An inline-`<svg>` logo legitimately has an empty `url`, so it can only be
    // correlated by its markup; a downloaded one correlates by URL.
    const asset = assetRows.find((row) => (url ? row?.url === url : Boolean(svgPath) && row?.svgPath === svgPath)) || null;
    const signal = signalRows.find((row) => url && row?.src === url) || null;
    // `value` is the object `SKILL.md` §What you author tells the agent to copy
    // VERBATIM; a shortened `svgPath` or `url` is an invented value the
    // finalizer refuses (exit 4). Bounded by the producers, not here. Every
    // OTHER key on the entry — `confidence`, the `evidence` prose — still goes
    // through `project`. Key ORDER is the entry's, unchanged: the packet's
    // bytes must move only where a value was being cut.
    const projected = {};
    for (const [key, leaf] of Object.entries(isObject(entry) ? entry : {})) {
      projected[key] = key === "value" ? cloneVerbatim(leaf) : project(leaf);
    }
    return {
      ...projected,
      svgPathPresent: svgPath.length > 0,
      svgPathChars: svgPath.length,
      sidecarPresent: Boolean(asset && asset.sidecarPath),
      region: signal?.region ?? asset?.region ?? null,
      widthPx: signal?.widthPx ?? asset?.widthPx ?? null,
      heightPx: signal?.heightPx ?? asset?.heightPx ?? null,
      emailSafeUrl: emailSafeUrl(url),
      preselected: false,
    };
  });
  const chosen = preselectedIndex(rows);
  if (chosen >= 0) rows[chosen].preselected = true;
  return rows;
}

function unresolvedRoles(diagnostics) {
  const channels = [
    ["typography", diagnostics?.typographyRoleCoverage],
    ["textColor", diagnostics?.textColorRoleCoverage],
  ];
  const rows = [];
  for (const [channel, entries] of channels) {
    if (!Array.isArray(entries)) continue;
    for (const entry of entries) {
      if (!isUnresolvedRoleEntry(entry)) continue;
      rows.push({ channel, role: truncate(entry.hint ?? null), reason: truncate(entry.reason ?? null), severity: entry.severity ?? null });
    }
  }
  return rows;
}

function nonEmptyEntries(record) {
  if (!isObject(record)) return null;
  const out = {};
  for (const [key, value] of Object.entries(record)) {
    if (typeof value === "string" && value !== "") out[key] = truncate(value);
  }
  return out;
}

function cappedContacts(contacts) {
  if (!isObject(contacts)) return null;
  const out = {};
  for (const [channel, values] of Object.entries(contacts)) {
    out[channel] = Array.isArray(values) ? values.slice(0, MAX_CONTACTS_PER_CHANNEL).map(project) : project(values);
  }
  return out;
}

function productCardSection(draft) {
  const rows = draft?.brand?.components?.productCard;
  const card = Array.isArray(rows) ? rows[0] : null;
  if (!isObject(card)) return null;
  const cta = isObject(card.cta) ? card.cta : {};
  return {
    evidenceQuality: card.evidenceQuality ?? null,
    confidence: card.confidence ?? null,
    recommendedVariantIndex: card.recommendedVariantIndex ?? null,
    recommendedVariantReason: truncate(card.recommendedVariantReason ?? null),
    oldPricePosition: card.oldPricePosition ?? null,
    contentAlign: card.contentAlign ?? null,
    cta: {
      text: truncate(cta.text ?? null),
      textSource: cta.textSource ?? null,
      isIconLike: cta.isIconLike ?? null,
      hasUsableVisibleText: cta.hasUsableVisibleText ?? null,
      hasInlineIcon: cta.hasInlineIcon ?? null,
      layoutIntent: cta.layoutIntent ?? null,
      backgroundColor: cta.backgroundColor ?? null,
    },
    missingEvidence: project(Array.isArray(card.missingEvidence) ? card.missingEvidence : []),
    variantTable: PRODUCT_CARD_VARIANT_TABLE,
  };
}

function counts(draft) {
  const colors = draft?.brand?.colors || {};
  const components = draft?.brand?.components || {};
  const lengthOf = (value) => (Array.isArray(value) ? value.length : 0);
  return {
    backgroundColors: lengthOf(colors.backgroundColors),
    accentColors: lengthOf(colors.accentColors),
    textColors: lengthOf(colors.textColors),
    typography: lengthOf(draft?.brand?.typography),
    button: lengthOf(components.button),
    productCard: lengthOf(components.productCard),
  };
}

function runSection({ capture, homepageStatus, slug }) {
  const blocked = homepageStatus?.status === "blocked" || homepageStatus?.blockedBySecurityInterstitial === true;
  return {
    requestedUrl: truncate(capture?.requestedUrl ?? null),
    landedUrl: truncate(capture?.url ?? null),
    slug: truncate(slug ?? null),
    status: blocked ? "blocked" : (homepageStatus?.status ?? null),
    readyForAssembly: homepageStatus?.readyForAssembly ?? null,
    blockedBySecurityInterstitial: homepageStatus?.blockedBySecurityInterstitial ?? null,
    phaseTimingsMsTotal: homepageStatus?.phaseTimingsMs?.total ?? null,
    buttonProbeDegraded: homepageStatus?.buttonProbeDegraded ?? null,
  };
}

/**
 * Build the scaffold review packet.
 *
 * Every argument is an ALREADY-PARSED artifact (or `null` when the file was
 * missing); nothing here reads or writes the filesystem. `dir` and `slug` are
 * strings used for the `files` pointers and `run.slug` — `path.join` on them
 * is string arithmetic, not a filesystem call.
 */
export function buildReviewPacket({ dir = "", slug = "", draftPath = "", capture = null, pageSignals = null, dom = null, draft = null, diagnostics = null, homepageStatus = null, logoAssets = null } = {}) {
  const run = runSection({ capture, homepageStatus, slug });
  // `draftPath` rather than a second `path.join(dir, …)`: `--mode scaffold
  // --out <path>` writes the draft somewhere else, and a pointer that named
  // the default path anyway would send the agent to the previous run's file.
  // The packet itself stays in the technical dir, beside the diagnostics and
  // the probe binding, which is where the agent looks.
  const files = {
    draft: draftPath || path.join(dir, "brandkit.extraction.draft.json"),
    diagnosticsSummary: path.join(dir, "assembly-diagnostics.summary.json"),
    screenshot: path.join(dir, "home.png"),
  };
  // A blocked pass measured nothing, so every section below `run` would be a
  // projection of empty artifacts — printed, they read as "this site has no
  // contacts", which is a false statement about the page rather than an empty
  // one. `null` says "not measured".
  if (run.status === "blocked") {
    return {
      version: REVIEW_PACKET_VERSION,
      run,
      identity: null,
      logos: null,
      contacts: null,
      socials: null,
      links: null,
      languages: null,
      productCard: null,
      colourSeeds: null,
      counts: null,
      unresolvedRoles: null,
      errors: null,
      agentOwnedFields: AGENT_OWNED_FIELDS,
      files,
    };
  }

  const logoCandidates = Array.isArray(pageSignals?.logoCandidates) ? pageSignals.logoCandidates : [];
  const logoAlts = [];
  for (const candidate of logoCandidates) {
    const alt = typeof candidate?.alt === "string" ? candidate.alt.trim() : "";
    if (!alt || logoAlts.includes(truncate(alt))) continue;
    logoAlts.push(truncate(alt));
    if (logoAlts.length >= MAX_LOGO_ALTS) break;
  }

  const errors = Array.isArray(diagnostics?.errors) && diagnostics.errors.length > 0 ? project(diagnostics.errors) : null;

  return {
    version: REVIEW_PACKET_VERSION,
    run,
    identity: isObject(capture)
      ? {
          title: truncate(capture.title ?? null),
          metaDescription: truncate(capture.metadata?.description ?? null),
          logoAlts,
          h1: headingsFromDom(dom),
        }
      : null,
    logos: isObject(diagnostics) ? logoRows(diagnostics, pageSignals, logoAssets) : null,
    contacts: cappedContacts(pageSignals?.contacts),
    socials: isObject(pageSignals)
      ? {
          forBrandkit: nonEmptyEntries(pageSignals.socialsForBrandkit),
          visiblePlatforms: project(Array.isArray(pageSignals.visibleSocialPlatforms) ? pageSignals.visibleSocialPlatforms : []),
          unfilteredPlatforms: project(Array.isArray(pageSignals.unfilteredSocialPlatforms) ? pageSignals.unfilteredSocialPlatforms : []),
        }
      : null,
    links: isObject(pageSignals) || isObject(dom)
      ? {
          forBrandkit: projectExceptUrls(Array.isArray(pageSignals?.importantLinksForBrandkit) ? pageSignals.importantLinksForBrandkit : []),
          raw: projectExceptUrls(Array.isArray(pageSignals?.importantLinks) ? pageSignals.importantLinks : []),
          navigation: navigationFromDom(dom, capture?.url || capture?.requestedUrl || pageSignals?.pageUrl || ""),
        }
      : null,
    languages: isObject(pageSignals) || isObject(draft)
      ? {
          draft: project(Array.isArray(draft?.languages) ? draft.languages : []),
          visibleHints: project(Array.isArray(pageSignals?.visibleLanguageHints) ? pageSignals.visibleLanguageHints.map(({ text, url, lang }) => ({ text, url, lang })) : []),
          documentHints: project(Array.isArray(pageSignals?.documentLanguageHints) ? pageSignals.documentLanguageHints : []),
        }
      : null,
    productCard: productCardSection(draft),
    colourSeeds: isObject(diagnostics)
      ? { canvas: seeds(diagnostics, "canvas-background"), buttonPrimary: seeds(diagnostics, "button-primary") }
      : null,
    counts: isObject(draft) ? counts(draft) : null,
    unresolvedRoles: isObject(diagnostics) ? unresolvedRoles(diagnostics) : null,
    errors,
    agentOwnedFields: AGENT_OWNED_FIELDS,
    files,
  };
}

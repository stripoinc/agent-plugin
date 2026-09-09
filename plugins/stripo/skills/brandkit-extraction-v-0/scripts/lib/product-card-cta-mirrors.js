import { selectableProductRows } from "./product-row-filter.js";
// Deterministic `product-card-cta` mirror tagging for the scaffolder.
//
// Why: SKILL.md tells the agent the scaffolder "mirrors product-card-cta hints
// from technical evidence" onto `brand.components.button[]` and
// `brand.typography[]`, then the agent applies targeted patches only. But
// `buttonFromRow`/`typographyFromText` only carry forward `usageHints` from
// raw probe rows (which never include `product-card-cta`). Result: the agent
// inherits an untagged baseline and the downstream validators flag missing
// (or wrongly leaked) mirrors.
//
// This module makes the SKILL.md prose true: based on the assembled
// `productCard[0].cta` evidence, deterministically tag the matching button
// and typography entries — or strip stale tags when the CTA is not reusable.
// Failure modes are non-fatal: if no good match exists, leave usageHints
// alone and let the warning fire (caller sees the ambiguity in
// validation.json).

import { markScaffoldSynthesised } from "./provenance-marker.js";
import { productCardCtaIsReusable } from "./product-card-cta-evidence.js";

const PRODUCT_CARD_CTA_HINT = "product-card-cta";

// Color-side hints that ride alongside the typography/button mirror and must
// also stay exclusive to productCard.cta when CTA is icon-only. These appear
// on `brand.colors.{accentColors, backgroundColors, textColors}[].usageHints`.
const PRODUCT_CARD_CTA_COLOR_HINTS = [
  "product-card-cta-background",
  "product-card-cta-text",
  "product-card-cta-hover-background",
  "product-card-cta-border",
];

function lowerHex(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeFamily(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function asNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

// Score a button entry against the CTA's visual signature. Match weights are
// tuned so a clear winner needs background+font color match (the strongest
// signal) plus at least one secondary attribute.
export function scoreButtonAgainstCta(button, cta) {
  if (!button || typeof button !== "object" || !cta) return -1;
  let score = 0;
  if (lowerHex(button.backgroundColor) && lowerHex(button.backgroundColor) === lowerHex(cta.backgroundColor)) score += 4;
  if (lowerHex(button.fontColor) && lowerHex(button.fontColor) === lowerHex(cta.fontColor)) score += 3;
  if (lowerHex(button.borderColor) && lowerHex(button.borderColor) === lowerHex(cta.borderColor)) score += 2;
  const btnRadius = asNumber(button.borderRadius);
  const ctaRadius = asNumber(cta.borderRadius);
  if (btnRadius !== null && ctaRadius !== null && btnRadius === ctaRadius) score += 1;
  return score;
}

export function productCardCtaButtonCarriersAreAnchored(payload) {
  const card = payload?.brand?.components?.productCard?.[0];
  if (!productCardCtaIsReusable(card)) return false;
  const cta = card.cta;
  const buttons = (Array.isArray(payload?.brand?.components?.button)
    ? payload.brand.components.button
    : []).filter((button) => Array.isArray(button?.usageHints) && button.usageHints.includes(PRODUCT_CARD_CTA_HINT));
  return buttons.length > 0 && buttons.every((button) => scoreButtonAgainstCta(button, cta) >= 7);
}

// Score a typography entry against CTA's font evidence.
export function scoreTypographyAgainstCta(typo, ctaTypoEvidence) {
  if (!typo || typeof typo !== "object" || !ctaTypoEvidence) return -1;
  let score = 0;
  const tFamily = normalizeFamily(typo.family);
  const cFamily = normalizeFamily(ctaTypoEvidence.family);
  if (tFamily && cFamily && tFamily === cFamily) score += 3;
  const tWeight = asNumber(typo.weight);
  const cWeight = asNumber(ctaTypoEvidence.weight);
  if (tWeight !== null && cWeight !== null && tWeight === cWeight) score += 2;
  const tSize = asNumber(typo.sizePx);
  const cSize = asNumber(ctaTypoEvidence.sizePx);
  if (tSize !== null && cSize !== null && tSize === cSize) score += 2;
  return score;
}

// Canonical-form normalisers used by signature matching in
// `extractCtaTypographyEvidence`. Lowercased + trimmed for text equality,
// and a dash-only alias for the "_" / "-" intent variants the probe can
// emit (`fixed_width` vs `fixed-width`). Module-scope so they are
// independently testable.
function _normaliseCtaText(value) {
  return String(value || "").trim().toLowerCase();
}

function _normaliseLayoutIntent(value) {
  const text = String(value || "").trim().toLowerCase().replace(/_/g, "-");
  const aliases = { "content-width": "content-sized", inline: "content-sized" };
  return aliases[text] || text;
}

// True when `row.cta` is structurally compatible with the given
// `productCard[0].cta` signature. Compatibility = same non-empty text
// AND same non-empty layoutIntent AND geometry within ±20% on
// computedWidthPx. Missing fields on either side short-circuit (we
// don't fail the match on absent evidence). Used by
// `extractCtaTypographyEvidence` to filter probe rows so the typography
// fields read from a row that actually represents the live product-card
// CTA — not an unrelated SKU-copy / wishlist / compare button.
function ctaRowMatchesSignature(row, signature) {
  const cta = row?.cta;
  if (!cta || typeof cta !== "object") return false;

  const sigText = _normaliseCtaText(signature.text);
  const rowText = _normaliseCtaText(cta.text);
  if (sigText && rowText && sigText !== rowText) return false;

  const sigIntent = _normaliseLayoutIntent(signature.layoutIntent);
  const rowIntent = _normaliseLayoutIntent(cta.layoutIntent ?? cta.layout?.intent);
  if (sigIntent && rowIntent && sigIntent !== rowIntent) return false;

  const sigWidth = asNumber(signature.layout?.computedWidthPx);
  const rowWidth = asNumber(cta.layout?.computedWidthPx ?? cta.computedWidthPx);
  if (sigWidth !== null && rowWidth !== null && sigWidth > 0) {
    const ratio = rowWidth / sigWidth;
    if (ratio < 0.8 || ratio > 1.2) return false;
  }

  return true;
}

// Pull CTA typography evidence (family / weight / sizePx) from the raw
// product-card-styles probe rows. When `ctaSignature` is provided,
// filter to rows whose `cta` matches the assembled productCard[0].cta
// on (text, layoutIntent, computedWidthPx ±20%) before reading font
// fields. Without a signature, falls back to legacy behaviour (first
// row with all three font fields).
//
// Why a signature filter is needed (facebar regression): on a product
// card with multiple CTAs (e.g. cart "Add to cart" + SKU-copy icon +
// wishlist heart), the probe captures every CTA as its own row. The
// first row in DOM order is often a small icon button (12px/600 font);
// reading its typography then taints the product-card-cta mirror with
// the wrong font size. The signature filter ensures the typography
// evidence comes from the row that actually represents the LIVE
// product-card CTA at productCard[0].cta.
export function extractCtaTypographyEvidence(productRows, ctaSignature = null) {
  productRows = selectableProductRows(productRows);
  if (!Array.isArray(productRows)) return null;

  const candidates = ctaSignature
    ? productRows.filter((row) => ctaRowMatchesSignature(row, ctaSignature))
    : productRows;

  for (const row of candidates) {
    const cta = row?.cta;
    if (!cta || typeof cta !== "object") continue;
    const family = cta.fontFamily;
    const weight = asNumber(cta.fontWeight);
    const sizePx = asNumber(cta.fontSizePx ?? cta.fontSize);
    if (typeof family === "string" && family.trim() && weight !== null && sizePx !== null) {
      return { family, weight, sizePx };
    }
  }

  return null;
}

function ensureUsageHintsArray(record) {
  if (!Array.isArray(record.usageHints)) record.usageHints = [];
  return record.usageHints;
}

function addProductCardCtaHint(record) {
  const hints = ensureUsageHintsArray(record);
  if (!hints.includes(PRODUCT_CARD_CTA_HINT)) hints.push(PRODUCT_CARD_CTA_HINT);
}

function stripProductCardCtaHint(record) {
  if (!Array.isArray(record?.usageHints)) return;
  record.usageHints = record.usageHints.filter((hint) => hint !== PRODUCT_CARD_CTA_HINT);
}

function stripProductCardCtaColorHints(record) {
  if (!Array.isArray(record?.usageHints)) return;
  record.usageHints = record.usageHints.filter((hint) => !PRODUCT_CARD_CTA_COLOR_HINTS.includes(hint));
}

function stripReusableProductCardCtaMirrors(payload) {
  const buttons = Array.isArray(payload?.brand?.components?.button) ? payload.brand.components.button : null;
  const typography = Array.isArray(payload?.brand?.typography) ? payload.brand.typography : null;
  if (buttons) {
    for (const button of buttons) stripProductCardCtaHint(button);
    payload.brand.components.button = buttons.filter(
      (button) => Array.isArray(button.usageHints) && button.usageHints.length > 0,
    );
  }
  if (typography) {
    for (const typo of typography) stripProductCardCtaHint(typo);
    payload.brand.typography = typography.filter(
      (typo) => Array.isArray(typo.usageHints) && typo.usageHints.length > 0,
    );
  }
  const colors = payload?.brand?.colors;
  if (colors && typeof colors === "object") {
    for (const key of ["accentColors", "backgroundColors", "textColors"]) {
      const list = colors[key];
      if (!Array.isArray(list)) continue;
      for (const entry of list) stripProductCardCtaColorHints(entry);
      colors[key] = list.filter(
        (entry) => Array.isArray(entry.usageHints) && entry.usageHints.length > 0,
      );
    }
  }
}

// Mutates the scaffolded payload in place. After return:
//  - If productCard[0] has reusable visible-text CTA evidence AND a clear
//    button/typography match exists, the matching record gains
//    `product-card-cta` in usageHints (deduped).
//  - If productCard[0].cta is absent or not reusable (including icon-only),
//    every existing `product-card-cta` hint on button[] and typography[] is
//    stripped so the fallback path cannot consume stale CTA evidence.
//  - If productCard is missing, no change.
//
// `productRows` is the raw product-card-styles.json contents — used to read
// CTA font evidence that the assembled productCard[0].cta does not preserve
// directly.
export function tagProductCardCtaMirrors(payload, productRows = null) {
  const cards = payload?.brand?.components?.productCard;
  if (!Array.isArray(cards) || cards.length === 0) return;
  const card = cards[0];
  const cta = card?.cta;

  if (!productCardCtaIsReusable(card)) {
    stripReusableProductCardCtaMirrors(payload);
    return;
  }

  const buttons = Array.isArray(payload.brand?.components?.button) ? payload.brand.components.button : null;
  const typography = Array.isArray(payload.brand?.typography) ? payload.brand.typography : null;

  // Button: tag the entry whose visual signature best matches productCard.cta.
  // Require ≥7 score (background + font colors must both match) — protects
  // against false positives when the brand has multiple distinct buttons.
  if (buttons && buttons.length > 0) {
    let bestIndex = -1;
    let bestScore = 6;
    for (let i = 0; i < buttons.length; i++) {
      const score = scoreButtonAgainstCta(buttons[i], cta);
      if (score > bestScore) { bestScore = score; bestIndex = i; }
    }
    if (bestIndex !== -1) addProductCardCtaHint(buttons[bestIndex]);
  }

  // Typography: tag the entry whose (family, weight, sizePx) matches the CTA's
  // font evidence. Require ≥5 score (family + weight or family + size). Skip
  // if the raw probe rows don't carry the font info. Pass the assembled
  // productCard[0].cta as a signature so extractCtaTypographyEvidence
  // filters probe rows to ones matching the live CTA's text/intent/geometry
  // (Tier CC.3 / Fix F: prevents tainting from unrelated icon buttons on
  // multi-CTA cards).
  const ctaTypoEvidence = extractCtaTypographyEvidence(productRows, cta);
  if (ctaTypoEvidence && typography && typography.length > 0) {
    let bestIndex = -1;
    let bestScore = 4;
    for (let i = 0; i < typography.length; i++) {
      const score = scoreTypographyAgainstCta(typography[i], ctaTypoEvidence);
      if (score > bestScore) { bestScore = score; bestIndex = i; }
    }
    if (bestIndex !== -1) addProductCardCtaHint(typography[bestIndex]);
  }
}

// ---------------------------------------------------------------------------
// Typography role-mirror appender
//
// SKILL.md typography-mirror rule (step 13):
//   When `productCard[N].priceTypography` has non-empty family + numeric
//   sizePx, append `product-price-typography` to the existing top-level
//   typography entry whose (family, weight, sizePx) matches. Same for
//   `oldPriceTypography` → `product-old-price-typography`. NEVER create a
//   new entry to carry the hint; if no matching entry exists, skip the
//   mirror.
//
// Why this lives here: the agent contract is the primary path, but in
// practice we see runs where the agent populates
// `productCard[0].oldPriceTypography` correctly yet forgets to append the
// hint to the matching top-level entry. This deterministic appender,
// invoked at normalize time post-agent, closes that gap.
// ---------------------------------------------------------------------------

function fontFamilyKey(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

// Take the first comma-separated font name, trim, lowercase. Used as a
// MATCH key — never written back to the surviving record. Two CSS strings
// listing the same primary font with different fallback stacks
// (`"Inter, sans-serif"` vs `"Inter, system-ui, sans-serif"`) canonicalize
// to the same key. That makes `appendTypographyRoleMirrors` see a single
// equivalence class instead of tagging both rows and tripping the
// duplicate-hint advisory in `typographyHintDuplicationDiagnostics`.
//
// Strips an outer matched pair of straight/curly quotes if the primary
// name itself was quoted (`"Helvetica Neue"`) so the key matches an
// unquoted form (`Helvetica Neue`).
export function canonicalFontFamily(value) {
  const raw = String(value || "").trim();
  if (!raw) return "";
  const primary = raw.split(",")[0].trim();
  if (!primary) return "";
  const unquoted = primary.replace(/^["'“‘]|["'”’]$/g, "").trim();
  return unquoted.toLowerCase().replace(/\s+/g, " ");
}

// Known font weight name suffixes (CSS keyword names + PostScript-style
// font-name suffixes). Order: longer suffixes first so "extralight" is
// matched before its trailing "light".
//
// Omitted intentionally:
//   - "book" — too generic, false-positive risk on words like "Songbook"
//   - "roman" — appears in real family names ("Times Roman") where it
//     is part of the family identity rather than a weight suffix
const FONT_WEIGHT_NAME_SUFFIXES = [
  "extralight", "ultralight",
  "extrabold", "ultrabold",
  "semibold", "demibold",
  "regular", "medium", "normal",
  "light", "heavy", "black", "bold", "thin",
];

// Returns the canonical family with a trailing weight-name suffix
// stripped, or the input unchanged if no known suffix matches. Folds
// the noise one storefront produces, where the same physical font surfaces under
// multiple weight-variant names ("Roboto", "Robotobold", "Robotolight",
// "Gilroy-Medium", "Gilroy-Bold") into a single canonical key so
// `mergeTypographyByCanonicalFamily` collapses them onto one record.
//
// Two stripping forms:
//   - Hyphen/underscore-separated: "gilroy-medium" → "gilroy"
//   - Concatenated: "robotobold" → "roboto"
//
// Guard: base stem must be at least 4 characters long; otherwise the
// stripping is too aggressive (e.g. a 5-letter family ending in "thin"
// would shrink to a 1-letter stub).
export function stripFontWeightNameSuffix(canonical) {
  if (typeof canonical !== "string" || !canonical) return canonical || "";
  const sepMatch = canonical.match(
    /^(.+)[-_](extralight|ultralight|extrabold|ultrabold|semibold|demibold|regular|medium|normal|light|heavy|black|bold|thin)$/,
  );
  if (sepMatch && sepMatch[1].length >= 4) return sepMatch[1];
  for (const suffix of FONT_WEIGHT_NAME_SUFFIXES) {
    if (canonical.endsWith(suffix)) {
      const base = canonical.slice(0, -suffix.length);
      if (base.length >= 4) return base;
    }
  }
  return canonical;
}

// Merge typography records whose canonical font family + weight + sizePx +
// lineHeight all match. Runs AFTER `dedupeTypographyComponents` so the
// strict-signature collapse (same family STRING, same weight, same
// sizePx) is already done; this pass collapses the harder case where
// two records carry the SAME primary font name with different fallback
// stacks — a shape the scaffolder produces when text-styles surfaces the
// same canonical font through multiple selectors that resolve to
// different CSS strings.
//
// Why this exists in addition to `dedupeTypographyComponents`:
// `appendTypographyRoleMirrors` walks productCard mirror signatures and
// tags the matching top-level record. With two records carrying the
// same canonical font at the same (weight, sizePx), both match a
// productCard mirror's signature on family-key (the matcher uses
// `fontFamilyKey` which is NOT canonical — it lowercases the whole
// string). Both get tagged → `typographyHintDuplicationDiagnostics`
// surfaces a duplicate-hint advisory the agent (under SKILL.md hint
// preservation rules) cannot resolve by editing typography rows. The
// fix is to collapse the equivalence class BEFORE the mirror tagger
// runs.
//
// Merge rules — conservative on purpose:
//   - Group key is `(canonicalFontFamily(family), weight, sizePx,
//     lineHeightPx)`. All four must match exactly (no ±1px window —
//     that is `appendTypographyRoleMirrors`'s job).
//   - The surviving record keeps the MORE SPECIFIC family string
//     (longer string wins; this is the one with more declared
//     fallbacks). The canonical key itself is never written back.
//   - `usageHints` are the union across all merged peers, preserving
//     the order each hint first appeared.
//   - Other optional fields (description, fontStyle, textTransform,
//     letterSpacingPx) prefer the first non-null in source order, the
//     same way `dedupeTypographyComponents` resolves them.
//
// Diagnostic: a single entry per merge action so reviewers can see
// which equivalence classes collapsed.
//
// `captureSpellings` — see `familySpellingIsCaptured` below and
// `captureFamilySpellings` in `extraction-pass-helpers.js`. Omitting it
// restores the pre-partition behaviour exactly (every record lands in the
// same spelling class), which is what the two-argument callers in the tests
// rely on.
export function mergeTypographyByCanonicalFamily(payload, diagnostics = [], captureSpellings = null) {
  const typography = Array.isArray(payload?.brand?.typography) ? payload.brand.typography : null;
  if (!typography || typography.length < 2) return;

  const groups = new Map();
  const order = [];
  // Which spelling classes each numeric signature produced, so the held-apart
  // count is the number of merges declined rather than the number of times a
  // single bit flipped.
  const spellingClasses = new Map();
  // AN EMPTY INDEX IS NOT AN INDEX, and that is pinned rather than chosen: "no
  // index means the pre-partition grouping, not a guess" asserts that a
  // two-argument caller and a caller passing `new Map()` group identically.
  // Both are callers with no capture in hand, and `familySpellingIsCaptured`
  // already answers false for everything in both, so the spelling class must
  // collapse in both too.
  const hasCaptureIndex = Boolean(
    captureSpellings && typeof captureSpellings.get === "function" && captureSpellings.size > 0,
  );
  let partitioned = 0;
  for (const entry of typography) {
    if (!entry || typeof entry !== "object") continue;
    // Strip weight-name suffix from canonical so "Roboto", "Robotobold",
    // and "Robotolight" all bucket under the same `roboto` stem when
    // their (weight, sizePx, lineHeight) match.
    const familyKey = stripFontWeightNameSuffix(canonicalFontFamily(entry.family));
    const weight = asFiniteNumber(entry.weight);
    const sizePx = asFiniteNumber(entry.sizePx);
    const lineHeight = asFiniteNumber(entry.lineHeightPx ?? entry.lineHeight);
    // Skip entries that can't be grouped — no canonical family, or no
    // numeric weight/sizePx. Leave them untouched in the output.
    if (!familyKey || weight === null || sizePx === null) {
      const standaloneKey = `__standalone__:${typography.indexOf(entry)}`;
      groups.set(standaloneKey, [entry]);
      order.push(standaloneKey);
      continue;
    }
    // THE SPELLING CLASS, AND IT IS PART OF THE GROUP KEY RATHER THAN A
    // TIEBREAKER. A merge group can hold a record whose `family` this capture
    // spelled and one whose `family` it did not, and the survivor carries ONE
    // of those strings under the UNION of both records' roles. Whichever way
    // the tie is broken, one role then names a spelling no capture row for it
    // carries: break it towards the captured string and the productCard mirror
    // loses the card's own spelling, break it towards the longer string — as
    // this pass did — and a region role inherits the card's. Splitting the
    // group is the only resolution that leaves BOTH records spelling what
    // their own evidence spells.
    // AND THE UNCAPTURED CLASS IS KEYED BY ITS OWN SPELLING, not by a single
    // bit. `familySpellingIsCaptured` is binary, so two records whose family
    // strings are BOTH absent from the capture hashed to the same `"0"` and
    // merged -- and the survivor then spells a stack that belongs to neither
    // role. Reproduced: `Card Sans, Arial, sans-serif` on
    // `product-name-typography` and `Card Sans, Helvetica, sans-serif` on
    // `product-price-typography`, both 700/20/24, neither spelled by
    // `text-styles.json`, collapse to ONE row carrying both hints and spelling
    // `Card Sans, Helvetica, sans-serif`. `partitioned` stayed 0, so the
    // held-apart diagnostic never fired and the pass reported a clean merge.
    //
    // `familySpellingKey` and not a fresh comparison: it is the ONE spelling of
    // "the same spelling" this module, the index builder and the gate share.
    //
    // The `hasIndex` guard keeps the documented no-capture contract exactly --
    // a caller with no index in hand gets the pre-partition grouping, every
    // record in one class, because it has no evidence to partition on.
    const spelled = familySpellingIsCaptured(captureSpellings, entry)
      ? "1"
      : hasCaptureIndex
      ? `0:${familySpellingKey(entry.family)}`
      : "0";
    const signature = `${familyKey}|${weight}|${sizePx}|${lineHeight === null ? "null" : lineHeight}`;
    const key = `${signature}|${spelled}`;
    if (!groups.has(key)) {
      groups.set(key, []);
      order.push(key);
      // A second class under the same numeric signature is a merge this
      // partition prevented. Counted for the diagnostic below; the reviewer
      // needs to see that the pass declined, not just that it acted. Counted by
      // CLASS rather than by a flipped bit: the uncaptured side is no longer one
      // class, so "does the sibling exist" cannot answer this any more.
      const classes = spellingClasses.get(signature);
      if (classes) {
        partitioned += 1;
        classes.add(spelled);
      } else {
        spellingClasses.set(signature, new Set([spelled]));
      }
    }
    groups.get(key).push(entry);
  }

  let mergedAny = false;
  let totalMerged = 0;
  const merged = [];
  for (const key of order) {
    const peers = groups.get(key) || [];
    if (peers.length === 1) {
      merged.push(peers[0]);
      continue;
    }
    // Pick the canonical peer:
    //   1. Prefer entries whose canonical family is its OWN stem (no
    //      trailing weight-name suffix to strip) — e.g. "Roboto" beats
    //      "Robotobold". The bare stem is more portable for email-client
    //      fallback chains than a weight-variant PostScript-style name.
    //   2. Among ties on (1), prefer the longest family STRING — more
    //      declared fallbacks (existing tiebreaker, matches T_A1).
    //   3. Ties on both → source order.
    let canonicalPeer = peers[0];
    for (const peer of peers.slice(1)) {
      const peerCanonical = canonicalFontFamily(peer.family);
      const canCanonical = canonicalFontFamily(canonicalPeer.family);
      const peerIsStem = stripFontWeightNameSuffix(peerCanonical) === peerCanonical;
      const canIsStem = stripFontWeightNameSuffix(canCanonical) === canCanonical;
      if (peerIsStem && !canIsStem) {
        canonicalPeer = peer;
        continue;
      }
      if (canIsStem && !peerIsStem) continue;
      // Same stem-vs-suffixed status (both bare stems OR both weight-
      // suffixed forms): fall through to longest-family-string tiebreaker.
      if (String(peer.family || "").length > String(canonicalPeer.family || "").length) {
        canonicalPeer = peer;
      }
    }
    const survivor = { ...canonicalPeer };
    const mergedHints = [];
    for (const peer of peers) {
      for (const hint of Array.isArray(peer.usageHints) ? peer.usageHints : []) {
        if (typeof hint === "string" && hint.trim() && !mergedHints.includes(hint)) {
          mergedHints.push(hint);
        }
      }
      for (const field of ["lineHeightPx", "letterSpacingPx", "fontStyle", "textTransform", "description"]) {
        if (survivor[field] == null && peer[field] != null) survivor[field] = peer[field];
      }
    }
    survivor.usageHints = mergedHints;
    merged.push(survivor);
    mergedAny = true;
    totalMerged += peers.length - 1;
  }

  if (mergedAny) {
    payload.brand.typography = merged;
    diagnostics.push({
      path: "$.brand.typography",
      message:
        `Merged ${totalMerged} typography records sharing a canonical primary font stem ` +
        `(same first font name after stripping any weight-name suffix — e.g. Roboto/Robotobold/Robotolight all bucket onto roboto; ` +
        `same weight, sizePx, lineHeightPx) but differing CSS family strings; kept the entry ` +
        `whose canonical family is its own stem (preferring portable fallback names like ` +
        `"Roboto" over weight-variant forms like "Robotobold") and merged usageHints.`,
    });
  }
  if (partitioned > 0) {
    diagnostics.push({
      path: "$.brand.typography",
      message:
        `Held ${partitioned} typography signature group(s) apart because their CSS family strings are not interchangeable at that ` +
        `(font stem, weight, sizePx, lineHeightPx): either one record spells a family some text-styles.json row carries there and another spells ` +
        `a family no such row carries — a productCard mirror's own stack — or two records spell DIFFERENT families that the capture carries ` +
        `neither of, which is two mirrors from two card fields. Merging them would have handed one record's spelling to the other's role hint, ` +
        `which is a value nothing measured for that role.`,
    });
  }
}

// WHEN ARE TWO CSS FAMILY STRINGS THE SAME SPELLING: case-insensitive, repeated
// whitespace collapsed, trimmed. Nothing wider — a tolerant comparison is
// `canonicalFontFamily`, which keeps only the first name and is the thing this
// partition exists to stop being used as an identity.
//
// ONE SPELLING OF "THE SAME SPELLING", for the producer here, the index builder
// in `extraction-pass-helpers.js`, and `sameFamily` in `role-evidence.js`. If
// the producer folded a difference the gate does not, it would decline to
// partition records the gate then refuses; fold less, and it partitions records
// the gate would have accepted merged.
export function familySpellingKey(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim().toLowerCase();
}

// The signature the anchor gate scopes a family SPELLING to:
// `(canonical stem, weight, sizePx)`. Deliberately NOT lineHeightPx — the
// dedup passes may keep a sibling row's line-height under a unioned hint, so
// the gate checks that field against the signature rather than pinning it, and
// an index keyed any tighter would answer a question nothing asks. Returns ""
// when the record cannot be keyed at all, which is the same condition that
// makes the merge leave it standalone.
export function typographySpellingSignature(record) {
  const stem = stripFontWeightNameSuffix(canonicalFontFamily(record?.family));
  const weight = asFiniteNumber(record?.weight);
  const sizePx = asFiniteNumber(record?.sizePx);
  if (!stem || weight === null || sizePx === null) return "";
  return `${stem}|${weight}|${sizePx}`;
}

// Did this capture spell THIS record's family string, at THIS record's
// signature? The question `typographyValueIsCaptureAnchored` asks of the
// finished artifact, asked here by the producer that decides the string.
//
// A missing index answers `false` for everything, which collapses the
// partition to one class and reproduces the pre-partition grouping exactly.
// That is the right default for a caller with no capture in hand: this pass
// must never become MORE permissive than it was, and a caller that cannot
// supply the evidence gets the old behaviour rather than a guess.
export function familySpellingIsCaptured(captureSpellings, record) {
  if (!captureSpellings || typeof captureSpellings.get !== "function") return false;
  const key = typographySpellingSignature(record);
  if (!key) return false;
  const spellings = captureSpellings.get(key);
  if (!spellings) return false;
  return spellings.has(familySpellingKey(record?.family));
}

function asFiniteNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

// `sizePx` tolerance for typography signature matches. Exact-equal was too
// strict in practice: probe-derived `productCard[*].titleTypography.sizePx`
// often arrives as a sub-pixel float (e.g. 14.4) while the top-level
// `brand.typography[]` entry coalesced from the same probe rows lands on a
// rounded integer (e.g. 14). The ±1px window is wide enough to absorb that
// rounding drift but narrow enough that a genuinely different scale step
// (14 vs 15, 18 vs 20) still misses. Family + weight must still match
// exactly. When more than one entry falls in the window, the closest size
// wins.
//
// Exported so the typography role-coverage diagnostic shares ONE source of
// truth for the match-tolerance constant (instead of duplicating the ±1px
// hard-code in a parallel matcher). Same reason `findMatchingTypographyIndex`
// is exported below.
export const TYPOGRAPHY_SIZE_TOLERANCE_PX = 1;

// BACKLOG item 1: sub-pixel size deltas (e.g. 0.0 vs 0.04) used to win the
// strict-`<` comparison below and short-circuit the lineHeight tiebreaker.
// Treat two deltas inside this window as a tie so the lineHeight tiebreaker
// fires when the probe surfaces a sub-pixel rounding drift between an
// agent-curated record and a productCard mirror signature. 0.1px is wider
// than typical IEEE rounding noise (~1e-12) and narrower than a single
// pixel.
const SIZE_TIE_EPSILON = 0.1;

export function findMatchingTypographyIndex(typography, target) {
  if (!Array.isArray(typography) || !target) return -1;
  const targetFamily = fontFamilyKey(target.family);
  const targetWeight = asFiniteNumber(target.weight);
  const targetSize = asFiniteNumber(target.sizePx);
  if (!targetFamily || targetWeight === null || targetSize === null) return -1;
  // Secondary key: prefer the entry whose lineHeightPx is closest to the
  // target's lineHeightPx, but only when both sides carry finite values.
  // When either side is null/missing, the existing source-order fallback
  // (via Number.POSITIVE_INFINITY) keeps current behaviour. Closes the
  // fix21 leading-tie case where two typography rows shared family +
  // weight + sizePx but differed only on leading (e.g. 18 vs 20), and
  // the agent surfaced an unactionable duplicate-hint advisory.
  const targetLineHeight = asFiniteNumber(target.lineHeightPx ?? target.lineHeight);
  let bestIndex = -1;
  let bestDelta = Number.POSITIVE_INFINITY;
  let bestLineHeightDelta = Number.POSITIVE_INFINITY;
  for (let i = 0; i < typography.length; i++) {
    const entry = typography[i];
    if (!entry || typeof entry !== "object") continue;
    if (fontFamilyKey(entry.family) !== targetFamily) continue;
    if (asFiniteNumber(entry.weight) !== targetWeight) continue;
    const entrySize = asFiniteNumber(entry.sizePx);
    if (entrySize === null) continue;
    const delta = Math.abs(entrySize - targetSize);
    if (delta > TYPOGRAPHY_SIZE_TOLERANCE_PX) continue;
    const entryLineHeight = asFiniteNumber(entry.lineHeightPx ?? entry.lineHeight);
    const lineHeightDelta = (targetLineHeight !== null && entryLineHeight !== null)
      ? Math.abs(entryLineHeight - targetLineHeight)
      : Number.POSITIVE_INFINITY;
    // Strict improvement on size-delta wins outright.
    if (delta + SIZE_TIE_EPSILON < bestDelta) {
      bestDelta = delta;
      bestLineHeightDelta = lineHeightDelta;
      bestIndex = i;
      continue;
    }
    // Sub-pixel tie on size: defer to the closer lineHeight match.
    if (Math.abs(delta - bestDelta) < SIZE_TIE_EPSILON && lineHeightDelta < bestLineHeightDelta) {
      // Keep the better size delta on record (the smaller of the two), so
      // a later candidate further from the target by > ε still loses on
      // the next iteration.
      bestDelta = Math.min(bestDelta, delta);
      bestLineHeightDelta = lineHeightDelta;
      bestIndex = i;
    }
  }
  return bestIndex;
}

function appendHintIfMissing(record, hint) {
  if (!record || typeof record !== "object") return false;
  if (!Array.isArray(record.usageHints)) record.usageHints = [];
  if (record.usageHints.includes(hint)) return false;
  record.usageHints.push(hint);
  return true;
}

// Description-pattern guard against false `product-card-cta` mirrors.
//
// Why: when the agent (or scaffolder) tags a button with `product-card-cta`
// based on visual signature alone, it can pick up buttons whose own
// `description` field names a different role — most often the cookie/consent
// confirmation button (frequently a prominent full-width primary-style
// button observed early on the page) or modal/login/newsletter CTAs. The
// resulting brandkit makes downstream email customisation render the wrong
// brand color on the product-card CTA.
//
// Reproducing case: an extraction emitted button[0] with description
// "Fixed-width confirmation button style observed on the cookie/consent
// confirmation"; the same entry carried `usageHints: [..., "product-card-cta"]`.
// The customise pipeline picked it as the product-card-cta and the rendered
// email used the cookie-confirm button's blue instead of the brand's actual
// product-CTA magenta.
//
// Pattern below covers the common roles that get mistagged as product CTAs:
// cookie/consent banners, newsletter/subscribe forms, login/signup/register
// modals, search/filter/menu controls, and accept/dismiss/close confirmations.
const NON_PRODUCT_CTA_DESCRIPTION_PATTERN = /\b(cookie|consent|gdpr|modal|popup|dialog|banner|newsletter|subscribe|sign[\s-]?in|sign[\s-]?up|log[\s-]?in|register|search\s+(?:submit|form|button)|filter|navigation\s+(?:button|control)|hamburger|menu\s+(?:toggle|button)|accept|dismiss|close\s+(?:button|control)|confirmation\s+button)\b/i;

// Mutates the payload in place. For each button[] entry whose description
// names a non-product-CTA role (cookie consent, newsletter signup, etc.),
// strip the `product-card-cta` hint from its usageHints. The button entry
// itself stays — only the wrong tag is removed. The downstream
// productCardCta token then falls back to the product-card probe's CTA
// evidence (`productCard[0].cta.backgroundColor`) instead of mirroring an
// unrelated button's color.
//
// Diagnostics array (optional) accumulates one entry per stripped hint with
// the path and the description that triggered the strip — so the operator
// can see which buttons were rejected and verify the rejection was correct.
export function stripProductCardCtaFromDescriptionMismatch(payload, diagnostics = []) {
  const buttons = Array.isArray(payload?.brand?.components?.button) ? payload.brand.components.button : null;
  if (!buttons) return;
  for (const [index, button] of buttons.entries()) {
    if (!button || typeof button !== "object") continue;
    const hints = Array.isArray(button.usageHints) ? button.usageHints : null;
    if (!hints || !hints.includes(PRODUCT_CARD_CTA_HINT)) continue;
    const description = String(button.description || "");
    if (!description) continue;
    if (!NON_PRODUCT_CTA_DESCRIPTION_PATTERN.test(description)) continue;
    button.usageHints = hints.filter((hint) => hint !== PRODUCT_CARD_CTA_HINT);
    diagnostics.push({
      path: `$.brand.components.button[${index}].usageHints`,
      message: `Stripped 'product-card-cta' from button[${index}] whose description names a non-product context: ${description.slice(0, 120)}`,
    });
  }
}

// Productable-mirror role pairs the helper resolves on each pass.
const PRODUCT_CARD_MIRROR_PAIRS = [
  ["titleTypography", "product-name-typography"],
  ["priceTypography", "product-price-typography"],
  ["oldPriceTypography", "product-old-price-typography"],
];

// The productCard fields this helper can lift a typography SIGNATURE off and
// put on a `brand.typography[]` record — `synthesizeTypographyRecordFromSignature`
// copies `target.family` / `weight` / `sizePx` / `lineHeightPx` verbatim, and
// `target` is `card[field]` for each pair above. Exported so `role-evidence.js`
// can ask which fields those are instead of spelling its own list: a fourth
// mirror pair added here must widen that gate in the same commit, and a private
// copy over there would not. What each field then EMITS is
// `productCardMirrorTypographyRecord` below, so the gate reads the record
// rather than rebuilding it.
export const PRODUCT_CARD_MIRROR_TYPOGRAPHY_FIELDS = Object.freeze(
  PRODUCT_CARD_MIRROR_PAIRS.map(([field]) => field),
);

// Returns true when the productCard typography signature has the three
// mandatory components needed to construct a top-level typography record:
// non-empty family, finite weight, finite sizePx. The synthesis path
// (`synthesizeTypographyRecordFromSignature`) cannot satisfy the
// typographyStyle schema without all three.
function hasUsableSynthesisSignature(target) {
  if (!target || typeof target !== "object") return false;
  if (!fontFamilyKey(target.family)) return false;
  if (asFiniteNumber(target.weight) === null) return false;
  if (asFiniteNumber(target.sizePx) === null) return false;
  return true;
}

// Schema-clean text field. typographyStyle requires `fontStyle`,
// `textTransform`, `description`, and `family` to be strings (not null),
// so synthesis MUST coerce undefined / null / non-string inputs to "".
function safeString(value) {
  if (typeof value !== "string") return "";
  return value;
}

// Build a typographyStyle record from the productCard mirror signature.
// Required fields (per references/extraction-stage.schema.json
// $defs.typographyStyle):
//   family (string), weight (numberOrNull), sizePx (numberOrNull),
//   lineHeightPx (numberOrNull), fontStyle (string), textTransform
//   (string), usageHints (typographyUsageHintList), description (string).
//
// `letterSpacingPx` is optional in the schema; included when the signature
// carries it. `additionalProperties: false` means nothing else can ride
// through.
//
// Schema check: typographyStyle has no `evidenceQuality` field (that lives
// on productCardStyle), so we deliberately don't add one — emitting it
// would break additionalProperties:false. The description names the
// synthesis path so an operator scanning brand.typography[] can see at a
// glance which records were probe-synthesised vs agent-curated. See the
// "Auto-synthesised from productCard[0]" message — searchable in cached
// extractions and assembly-diagnostics.json.
function synthesizeTypographyRecordFromSignature(target, field, hint) {
  const sizePx = asFiniteNumber(target.sizePx);
  const weight = asFiniteNumber(target.weight);
  const lineHeight = asFiniteNumber(target.lineHeightPx ?? target.lineHeight);
  const letterSpacing = asFiniteNumber(target.letterSpacingPx ?? target.letterSpacing);
  const record = {
    family: safeString(target.family),
    weight,
    sizePx,
    lineHeightPx: lineHeight,
    fontStyle: safeString(target.fontStyle) || "normal",
    textTransform: safeString(target.textTransform) || "none",
    usageHints: [hint],
    description: `Auto-synthesised from productCard[0].${field} probe evidence (no matching agent-curated record within ±${TYPOGRAPHY_SIZE_TOLERANCE_PX}px tolerance).`,
  };
  if (letterSpacing !== null) {
    record.letterSpacingPx = letterSpacing;
  }
  return markScaffoldSynthesised(record);
}

// THE PROJECTION OF THIS PRODUCER ONTO ONE (card, mirror field), for a reader
// that has to decide whether a `brand.typography[]` record could have come
// from a card. Returns the record `appendTypographyRoleMirrors` would
// synthesise, or `null` when it would synthesise nothing.
//
// It exists so `role-evidence.js` can ask this module what it emits instead of
// respelling the answer. That gate used to lift a card's `family` STRING on its
// own and admit it at any weight/size/line-height, which no path here can
// write: `synthesizeTypographyRecordFromSignature` above copies `family`,
// `weight`, `sizePx` and `lineHeightPx` off the SAME `card[field]` in one
// object literal, and `mergeTypographyByCanonicalFamily` can only hand that
// family to a survivor of a group keyed on `(stem, weight, sizePx,
// lineHeightPx)`.
//
// Both skip rules are the producer's own and not restated: `synthesizeForRole`
// declines an unusable signature, and a `field` outside `PRODUCT_CARD_MIRROR_PAIRS`
// is one this helper never reads. The one rule NOT reproduced is
// `findMatchingTypographyIndex` — when an existing record already matches the
// card signature, `synthesizeForRole` tags that record and the card's spelling
// never moves, so skipping the match here can only widen the caller's
// admissible set, never narrow it.
export function productCardMirrorTypographyRecord(target, field) {
  const pair = PRODUCT_CARD_MIRROR_PAIRS.find(([name]) => name === field);
  if (!pair) return null;
  if (!hasUsableSynthesisSignature(target)) return null;
  return synthesizeTypographyRecordFromSignature(target, field, pair[1]);
}

// Resolve one productCard typography role: match an existing record by
// signature, or synthesise a fresh record carrying just this role.
// Factored out so the CTA role (whose evidence lives in `productRows`,
// not in `productCard[0]`) goes through the same match-then-synthesise
// path as the title/price/old-price roles.
function synthesizeForRole({ target, field, hint, typography }) {
  if (!target || typeof target !== "object") return;
  const matchIndex = findMatchingTypographyIndex(typography, target);
  if (matchIndex !== -1) {
    // Idempotent: appendHintIfMissing is a no-op when the matched
    // record already carries the hint, so running the helper twice
    // on the same payload doesn't grow the array.
    appendHintIfMissing(typography[matchIndex], hint);
    return;
  }
  // No matching agent-curated record. If the probe signature is
  // usable, synthesise a new record carrying just this role; skip
  // when the signature is incomplete (gate emits severity:info).
  if (!hasUsableSynthesisSignature(target)) return;
  typography.push(synthesizeTypographyRecordFromSignature(target, field, hint));
}

// Mutates the payload in place. For each productCard mirror field
// (titleTypography / priceTypography / oldPriceTypography):
//   1. If a top-level typography record matches the signature (family +
//      weight + sizePx within ±1px), append the role hint to it.
//   2. Otherwise, if the signature is usable (family + weight + sizePx all
//      present), SYNTHESISE a new top-level typography record carrying the
//      role hint. This is the only place outside the scaffolder that adds
//      a `brand.typography[]` entry — the role-coverage gate downstream
//      relies on synthesis to close the "signature exists, no match" gap
//      it cannot resolve via hand-tagging (the verify-only contract
//      forbids the agent from authoring typography records to carry a
//      hint).
//   3. If neither holds (no usable signature), skip — the gate will emit
//      severity:info for an upstream evidence gap.
//
// CTA role (BACKLOG item 2): when `productRows` carries a usable CTA
// font signature (`row.cta.fontFamily / fontWeight / fontSizePx`) and
// no matching top-level typography record exists, synthesise a record
// tagged `product-card-cta`. The CTA font evidence lives in the raw
// probe rows rather than on `productCard[0].cta` (which carries colors
// and layout but not font info), so the caller must pass `productRows`
// for the CTA arm to fire. Without `productRows`, only the title /
// price / old-price arms run.
//
// Idempotent: when the role hint is already present on any record in
// brand.typography[], synthesis is a no-op. Running the helper twice does
// not add duplicate records.
//
// Without step 2, the role-coverage gate's "no matching record" path
// could never fire severity:high — every productCard mirror role missing
// a match was silently down-graded to severity:info. That meant the gate
// could not catch the silent regression class it was designed to catch
// (probe captured a signature, scaffold ran, agent shipped, customise
// pipeline fell back to a heading/body default). Synthesis turns the
// helper into a deterministic record producer; the gate then fires
// severity:high only when synthesis itself was unable to act — i.e., the
// signature is genuinely absent.
//
// W3: do NOT short-circuit on `typographyArrayCarriesHint(hint)` here.
// A stale record carrying the hint at the wrong signature (e.g. agent
// edited sizePx 20 → 30 after the first synthesis ran, productCard
// signature still 20) would falsely satisfy that check and skip
// synthesis — the downstream compiler then finds no record at the
// productCard signature and silently falls back. The matched-index
// check above is the SOLE idempotency guard: when a record exists at
// the productCard signature, tagging it is a no-op; when no record
// matches, synthesis emits a fresh record at the correct signature. If
// a stale tagged record is left over, the duplicate-hint diagnostic in
// `typographyRoleCoverageDiagnostics` surfaces the drift so the
// operator can re-curate.
export function appendTypographyRoleMirrors(payload, productRows = null) {
  if (!payload || typeof payload !== "object") return;
  if (!payload.brand || typeof payload.brand !== "object") return;
  if (!Array.isArray(payload.brand.typography)) {
    // Synthesis needs a writable typography array. If the caller produced
    // a non-array (or omitted the key entirely), the rest of the assembler
    // would already have crashed; nothing to do here.
    return;
  }
  const typography = payload.brand.typography;
  const cards = Array.isArray(payload.brand?.components?.productCard) ? payload.brand.components.productCard : null;
  if (!cards || cards.length === 0) return;

  // D6: restrict mirror tagging to cards[0]. Downstream consumers
  // (customise pipeline / build_brand_tokens.py) read only productCard[0],
  // and iterating ALL cards caused duplicate-hint advisories on bi fix21
  // where card[0] and card[N] had different oldPriceTypography signatures
  // (12 vs 24) — each card tagged a separate top-level row, surfacing a
  // non-actionable diagnostic. Aligns with tagProductCardCtaMirrors which
  // also inspects cards[0] only.
  const card = cards[0];
  if (!card || typeof card !== "object") return;
  for (const [field, hint] of PRODUCT_CARD_MIRROR_PAIRS) {
    synthesizeForRole({ target: card[field], field, hint, typography });
  }

  // BACKLOG item 2: synthesise a `product-card-cta` record from the raw
  // probe rows. The CTA font signature isn't preserved on
  // `productCard[0].cta`, so we read it from `productRows` directly via
  // `extractCtaTypographyEvidence`. Skipped when the caller did not pass
  // productRows or when no row carries a complete signature. Pass the
  // assembled productCard[0].cta as the signature so the row matched
  // is the live cart-button row, not an unrelated icon-only button on
  // the same card (Tier CC.3 / Fix F).
  // A raw row is not reusable on its own. In particular, passing null as the
  // signature triggers extractCtaTypographyEvidence's legacy first-row mode,
  // which can recreate a product-card-cta mirror after normalization removed
  // an untrusted assembled CTA. Only an assembled CTA satisfying the shared
  // evidence predicate may open this arm.
  const cardCta = productCardCtaIsReusable(card) ? card.cta : null;
  const ctaEvidence = cardCta ? extractCtaTypographyEvidence(productRows, cardCta) : null;
  if (ctaEvidence) {
    synthesizeForRole({
      target: ctaEvidence,
      field: "cta",
      hint: PRODUCT_CARD_CTA_HINT,
      typography,
    });
  }
}

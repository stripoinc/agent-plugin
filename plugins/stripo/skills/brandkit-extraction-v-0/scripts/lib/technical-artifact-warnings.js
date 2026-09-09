// Mirror of `validate_brandkit_against_technical_artifacts` and its helpers in
// `reteno_agent/brandkit_finalize/validation.py`. Keep warning-message strings, helper
// semantics, and the orchestrator iteration order in lockstep with the Python
// implementation; both sides share the same parity oracle in
// tests/test_skill_probe_contracts.py.
//
// Scope (step 4b): only the advisory WARNINGS surfaced by
// `validate_brandkit_against_technical_artifacts` (button evidence, product-
// card CTA mirrors, hover, weak product-card evidence, recovery regression,
// language hints, homepage-blocked, homepage incomplete, button probe
// degraded). The technical-artifact BLOCKERS produced by
// `detect_technical_artifact_blockers` live in ./technical-artifact-blockers.js;
// shared helpers (file IO, dedupe, numeric coercion, product-card CTA evidence
// + context signals, etc.) are imported from there to keep semantics in
// lockstep across modules.

import path from "node:path";

import {
  TECHNICAL_HOMEPAGE_BLOCKED_BLOCKER,
  PRODUCT_CARD_CTA_HINT,
  dedupeMessages,
  hasProductCardCtaButton,
  hasProductCardCtaTypography,
  hasReusableProductCardCtaEvidence,
  hasReusableVisibleTextButtonEvidence,
  hasUsefulTypography,
  homepageStatusIndicatesBlocked,
  isDirectory,
  isPlainObject,
  numericValue,
  readOptionalJson,
  recordUsageHints,
  requiredWithEvidenceFindings,
  rowHasReusableProductCardCtaEvidence,
  signalsShowProductCardContext,
  statusCompletedAndReady,
} from "./technical-artifact-blockers.js";

import { productCardCtaIsReusable } from "./semantic-validators.js";

// The SAME registrable-domain identity test the factual-URL gate uses, imported
// rather than re-spelled, so the same-site locale filter cannot drift from its
// Python twins (`_identity_host` / `_identity_hosts_match`).
import { identityHost, identityHostsMatch } from "./content-validators.js";

// The normalize-time cap that decides whether an `importantLinks` entry can
// be carried at all. Imported, never re-spelled, so the warning cannot judge
// a row eligible that `dropLongImportantLinkNames` then silently removes.
import { IMPORTANT_LINK_NAME_LENGTH_CAP } from "./important-link-name-cap.js";

// The writable mapper's OWN predicate and its OWN text normaliser, imported
// rather than re-spelled. `linksFromSignals` filters with
// `isWritableImportantLink`, so a row this gate grades as evidence is a row
// that mapper carries.
import { isWritableImportantLink, normalizeText } from "./extraction-pass-helpers.js";

// Re-export so callers don't have to know which module owns the canonical
// homepage-blocked string. Python emits this same blocker into the warnings
// list (validation.py:1289) — preserving that quirk is required for parity.
export { TECHNICAL_HOMEPAGE_BLOCKED_BLOCKER };

// --- Warning message constants (string-for-string parity with Python) ---

export const TECHNICAL_BUTTON_EVIDENCE_WARNING =
  "Technical button probe captured reusable visible-text button evidence, but the final brandkit emitted no button styles.";

export const TECHNICAL_BUTTON_PROBE_DEGRADED_WARNING =
  "Technical homepage button probe degraded; legacy CTA/button compatibility evidence may be incomplete.";

export const TECHNICAL_PRODUCT_CARD_CTA_BUTTON_WARNING =
  "Technical product-card probe captured reusable visible-text product-card CTA evidence, but the final brandkit emitted no product-card-cta button style.";

export const TECHNICAL_PRODUCT_CARD_CTA_TYPOGRAPHY_WARNING =
  "Technical product-card probe captured reusable visible-text product-card CTA evidence, but the final brandkit emitted no product-card-cta typography style.";

export const TECHNICAL_PRODUCT_CARD_CTA_HOVER_WARNING =
  "Technical product-card probe captured product-card CTA hover evidence, but the final brandkit product-card CTA hover does not match that evidence.";

export const TECHNICAL_PRODUCT_CARD_WEAK_EVIDENCE_WARNING =
  "Technical product-card recovery exhausted without a representative card, and the final brandkit product-card evidence is weak or incomplete.";

// BACKLOG item 31 — section-evidence warnings. Two DISTINCT grades, and
// collapsing them is the defect these exist to prevent:
//
//   mapper-dropped    the probe classified the value and the kit lost it
//   capture-unproven  the raw DOM holds it and the visibility filter did not
//
// An empty probe is not evidence of an empty site. Only the third case —
// nothing visible, nothing unfiltered — is an honest absence, and it stays
// silent.
export const TECHNICAL_SOCIAL_MAPPER_DROPPED_WARNING =
  "Technical page signals classified social profile links that the final brandkit socials do not carry.";

export const TECHNICAL_SOCIAL_CAPTURE_UNPROVEN_WARNING =
  "Technical page signals found social profile links in the raw DOM that no visible anchor matched, so the socials capture is unproven rather than absent.";

// The THIRD answer to the same question, and the one neither grade above can
// give. Both `visibleSocialPlatforms` and `unfilteredSocialPlatforms` are built
// from `a[href]`, so a site whose social icons are `<a>` elements with no href
// at all — the click wired in JS — leaves both empty, and "nothing visible,
// nothing unfiltered" is then read as the honest absence it is not. Measured on
// two live storefronts in one day's fleet (6 and 2 such anchors inside a
// social-classed container); both runs reported no social presence and the
// replace-only save cleared the account's socials.
//
// The count is a fact; the platform behind an href-less icon is not (the class
// is the same on every one of them), so nothing here names one. `{count}` is
// substituted by `hrefLessSocialControlsWarning`; keep string-for-string with
// Python `TECHNICAL_SOCIAL_HREFLESS_CONTROLS_WARNING`.
export const TECHNICAL_SOCIAL_HREFLESS_CONTROLS_WARNING =
  "Technical page signals found {count} social-looking controls without an href in a social container; they are JS-driven, so the socials capture is unproven rather than absent.";

export const TECHNICAL_CONTACT_EMAIL_MAPPER_DROPPED_WARNING =
  "Technical page signals captured contact email evidence that the final brandkit contacts do not carry.";

export const TECHNICAL_CONTACT_EMAIL_CAPTURE_UNPROVEN_WARNING =
  "Technical page signals found mailto links in the raw DOM that no visible anchor matched, so the contact email capture is unproven rather than absent.";

export const TECHNICAL_CONTACT_PHONE_MAPPER_DROPPED_WARNING =
  "Technical page signals captured contact phone evidence that the final brandkit contacts do not carry.";

export const TECHNICAL_CONTACT_PHONE_CAPTURE_UNPROVEN_WARNING =
  "Technical page signals found tel links in the raw DOM that no visible anchor matched, so the contact phone capture is unproven rather than absent.";

export const TECHNICAL_IMPORTANT_LINKS_MAPPER_DROPPED_WARNING =
  "Technical page signals captured important-link evidence that the final brandkit importantLinks do not carry.";

// Fires alongside WEAK_EVIDENCE when the captured probe rows were too few to
// represent a populated homepage (typically a partial / loading render). Helps
// distinguish "homepage failed to hydrate" from "homepage rendered fine but
// genuinely had no shoppable cards". Re-running extraction usually recovers
// the full card set on the next pass.
export const TECHNICAL_PRODUCT_CARD_HOMEPAGE_PROBE_LIKELY_PARTIAL_WARNING =
  "Technical product-card probe captured very few card-shape rows; the homepage likely rendered as a partial / loading state. Re-running the extraction usually recovers the full card set.";

// Threshold for the homepage-likely-partial canary. Selected to fire on the
// fix35 case (one storefront, 3 rows of `/action/` promo banners) and stay
// quiet for fix29-style runs (33 rows of real product cards). Keep in sync with the
// Python constant in reteno_agent/brandkit_finalize/validation.py.
export const HOMEPAGE_PROBE_LIKELY_PARTIAL_MAX_ROWS = 5;

export const TECHNICAL_PRODUCT_CARD_RECOVERY_REGRESSION_WARNING =
  "Technical product-card recovery found purchase-like homepage candidates in an earlier attempt, but the final saved homepage product-card artifacts preserved none.";

export const TECHNICAL_LANGUAGE_EVIDENCE_WARNING =
  "Technical homepage artifacts suggest multiple visible site languages, but the final brandkit captured fewer than two languages.";

export const TECHNICAL_HOMEPAGE_PASS_INCOMPLETE_WARNING =
  "Technical homepage batch pass did not complete cleanly, so the final brandkit may have been assembled from partial homepage artifacts.";

// --- Status helpers ---

// Mirrors Python `_status_indicates_incomplete`. True when the homepage status
// payload signals any incomplete-pass condition: not "completed", explicitly
// degraded, not ready for assembly, or missing required artifacts.
function statusIndicatesIncomplete(statusPayload) {
  if (!isPlainObject(statusPayload)) return false;
  if (statusPayload.status !== "completed") return true;
  if (statusPayload.degraded === true) return true;
  if (statusPayload.readyForAssembly === false) return true;
  const missing = statusPayload.missingRequiredArtifacts;
  if (Array.isArray(missing) && missing.length > 0) return true;
  return false;
}

// --- Button-record evidence helpers ---

// Mirrors Python `_has_useful_button_record`. A record counts as "useful" iff
// it carries at least one usage hint AND has at least one of the listed
// concrete style keys present (any non-undefined value, including `null`,
// matches Python's `record.get(key) is not None`).
function hasUsefulButtonRecord(record) {
  if (!isPlainObject(record)) return false;
  if (recordUsageHints(record).length === 0) return false;
  const styleKeys = [
    "backgroundColor",
    "fontColor",
    "borderColor",
    "hoverBackgroundColor",
    "hoverFontColor",
    "hoverBorderColor",
    "padding",
    "layout",
  ];
  for (const key of styleKeys) {
    if (record[key] !== undefined && record[key] !== null) return true;
  }
  return false;
}

// Mirrors Python `_has_recovered_button_probe_evidence`. Used to suppress the
// degraded-button-probe warning when a probe-recovery pass clearly captured
// reusable button evidence.
function hasRecoveredButtonProbeEvidence(finalButtons, buttonRows) {
  return (
    Array.isArray(finalButtons) &&
    finalButtons.some((record) => hasUsefulButtonRecord(record)) &&
    Array.isArray(buttonRows) &&
    buttonRows.length > 0
  );
}

// --- Hover key helpers (mirror Python `_normalize_public_color`,
// `_hover_key_from_values`, `_technical_product_card_cta_hover_keys`,
// `_final_product_card_cta_hover_mismatches_technical_evidence`) ---

const HEX_NORMALIZE_RE = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;

// Mirrors Python `_normalize_public_color`. Lower-cases the value, expands
// 3/4-character hex codes to 6/8-character form, and returns null for empty/
// non-string inputs.
function normalizePublicColor(value) {
  if (value === null || value === undefined) return null;
  if (typeof value !== "string") return null;
  const raw = value.trim().toLowerCase();
  if (!raw) return null;
  const match = HEX_NORMALIZE_RE.exec(raw);
  if (!match) return raw;
  const body = match[1];
  if (body.length === 3 || body.length === 4) {
    return "#" + Array.from(body, (ch) => ch + ch).join("");
  }
  return "#" + body;
}

// Mirrors Python `_hover_key_from_values`. Returns null when ALL three
// normalized values are null; otherwise returns a 3-tuple (encoded as an
// array) suitable for set membership comparison.
function hoverKeyFromValues(background, font, border) {
  const values = [
    normalizePublicColor(background),
    normalizePublicColor(font),
    normalizePublicColor(border),
  ];
  if (values[0] === null && values[1] === null && values[2] === null) return null;
  return values;
}

function encodeHoverKey(key) {
  // Encode null as a sentinel so it can't collide with any real string.
  return JSON.stringify(key);
}

// Mirrors Python `_technical_product_card_cta_hover_keys`. Set of every
// non-empty hover key extracted from rows that already pass the reusable
// visible-text gate.
function technicalProductCardCtaHoverKeys(productRows) {
  const keys = new Set();
  if (!Array.isArray(productRows)) return keys;
  for (const row of productRows) {
    if (!rowHasReusableProductCardCtaEvidence(row)) continue;
    const cta = isPlainObject(row) ? row.cta : null;
    const hover = isPlainObject(cta) ? cta.hover : null;
    if (!isPlainObject(hover)) continue;
    const key = hoverKeyFromValues(hover.backgroundColor, hover.fontColor, hover.borderColor);
    if (key !== null) keys.add(encodeHoverKey(key));
  }
  return keys;
}

// Mirrors Python `_final_product_card_cta_hover_mismatches_technical_evidence`.
function finalProductCardCtaHoverMismatchesTechnicalEvidence(brandkit, productRows) {
  const technicalKeys = technicalProductCardCtaHoverKeys(productRows);
  if (technicalKeys.size === 0) return false;
  const brand = isPlainObject(brandkit?.brand) ? brandkit.brand : {};
  const components = isPlainObject(brand.components) ? brand.components : {};
  const cards = components.productCard;
  if (!Array.isArray(cards)) return false;
  for (const card of cards) {
    if (!productCardCtaIsReusable(card)) continue;
    const cta = isPlainObject(card?.cta) ? card.cta : null;
    if (!cta) continue;
    const key = hoverKeyFromValues(cta.hoverBackgroundColor, cta.hoverFontColor, cta.hoverBorderColor);
    if (key !== null && !technicalKeys.has(encodeHoverKey(key))) return true;
  }
  return false;
}

// --- Recovery-exhausted helpers ---

// Mirrors Python `_product_card_recovery_exhausted_without_representative`.
function productCardRecoveryExhaustedWithoutRepresentative(recoveryPayload, productRows) {
  if (!isPlainObject(recoveryPayload)) return false;
  const failureSignals = recoveryPayload.failureSignals;
  const summary = recoveryPayload.summary;
  const attempts = recoveryPayload.attempts;
  let rowCount = numericValue(recoveryPayload, "finalRowCount") || 0;
  const representativeCount = numericValue(recoveryPayload, "finalRepresentativeRowCount");
  if (Array.isArray(productRows)) {
    rowCount = Math.max(rowCount, productRows.length);
  }
  if (Array.isArray(attempts)) {
    for (const attempt of attempts) {
      rowCount = Math.max(rowCount, numericValue(attempt, "rowCount") || 0);
    }
  }
  const exhausted =
    Array.isArray(failureSignals) &&
    failureSignals.includes("recovery-exhausted-without-representative-card");
  if (!exhausted) return false;
  if (rowCount <= 0) return false;
  if (representativeCount !== null && representativeCount > 0) return false;
  if (isPlainObject(summary) && summary.hasRepresentativeRow === true) return false;
  return true;
}

// Mirrors Python `_homepage_probe_likely_partial`. Fires when the probe
// captured >0 but <HOMEPAGE_PROBE_LIKELY_PARTIAL_MAX_ROWS rows. A zero-row
// probe is covered by other blockers (homepage-blocked, false-fallback);
// a tiny non-zero count is the "homepage hydrated only its hero / promo
// banners" signature we see on that class of partial render.
function homepageProbeLikelyPartial(productRows) {
  if (!Array.isArray(productRows)) return false;
  const n = productRows.length;
  return n > 0 && n < HOMEPAGE_PROBE_LIKELY_PARTIAL_MAX_ROWS;
}

// --- Final product-card evidence quality helpers ---

// Mirrors Python `_has_non_empty_public_value`. Treats blank strings, empty
// dicts, and empty lists as empty; everything else (including booleans, numbers,
// non-empty containers) counts as non-empty.
function hasNonEmptyPublicValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
}

// Mirrors Python `_has_surface_or_border_evidence`.
function hasSurfaceOrBorderEvidence(card) {
  const surface = card?.surface;
  if (isPlainObject(surface) && Object.values(surface).some((value) => hasNonEmptyPublicValue(value))) {
    return true;
  }
  return ["backgroundColor", "borderColor", "borderWidth"].some((key) =>
    hasNonEmptyPublicValue(card?.[key]),
  );
}

// Mirrors Python `_has_product_card_price_evidence`.
function hasProductCardPriceEvidence(card) {
  return (
    hasNonEmptyPublicValue(card?.priceColor) ||
    hasNonEmptyPublicValue(card?.oldPriceColor) ||
    hasUsefulTypography(card?.priceTypography) ||
    hasUsefulTypography(card?.oldPriceTypography)
  );
}

// Mirrors Python `_has_product_card_cta_evidence`.
function hasProductCardCtaEvidence(card) {
  const cta = card?.cta;
  if (!isPlainObject(cta)) return false;
  const ctaKeys = [
    "text",
    "textSource",
    "layoutIntent",
    "backgroundColor",
    "fontColor",
    "borderColor",
    "padding",
    "hoverBackgroundColor",
    "hoverFontColor",
    "hoverBorderColor",
  ];
  return ctaKeys.some((key) => hasNonEmptyPublicValue(cta[key]));
}

// Mirrors Python `_has_product_card_core_component_evidence`.
function hasProductCardCoreComponentEvidence(card) {
  return (
    hasProductCardPriceEvidence(card) &&
    hasUsefulTypography(card?.titleTypography) &&
    hasSurfaceOrBorderEvidence(card) &&
    hasProductCardCtaEvidence(card)
  );
}

// Mirrors Python `_final_product_card_evidence_is_weak_or_incomplete`. Returns
// true iff every product-card slot fails BOTH the medium/strong + 0.5
// confidence check AND the "core component" rich-evidence check.
function finalProductCardEvidenceIsWeakOrIncomplete(brandkit) {
  const brand = isPlainObject(brandkit?.brand) ? brandkit.brand : {};
  const components = isPlainObject(brand.components) ? brand.components : {};
  const cards = components.productCard;
  if (!Array.isArray(cards) || cards.length === 0) return true;
  for (const card of cards) {
    if (!isPlainObject(card)) continue;
    const quality = String(card.evidenceQuality ?? "").trim().toLowerCase();
    const confidence = numericValue(card, "confidence") || 0;
    const hasPriceEvidence = Boolean(
      card.priceColor || card.oldPriceColor || card.priceTypography || card.oldPriceTypography,
    );
    const hasCtaEvidence = isPlainObject(card.cta);
    const hasSurfaceEvidence = Boolean(card.surface || card.backgroundColor || card.borderColor);
    if (
      (quality === "medium" || quality === "strong") &&
      confidence >= 0.5 &&
      (hasPriceEvidence || hasCtaEvidence || hasSurfaceEvidence)
    ) {
      return false;
    }
    if (hasProductCardCoreComponentEvidence(card)) return false;
  }
  return true;
}

// --- Locale hint helpers ---

// Mirrors Python `_LOCALE_HINT_ALIASES` (validation.py). Canonicalize alternate
// locale spellings so a single site that emits both forms doesn't register as
// multi-lingual. Codes accepted by `extractLocaleHint` stay in the allowlist;
// this only applies to multilingual-evidence counting.
const LOCALE_HINT_ALIASES = { cz: "cs", ua: "uk" };

function aliasLocaleHint(hint) {
  return Object.prototype.hasOwnProperty.call(LOCALE_HINT_ALIASES, hint)
    ? LOCALE_HINT_ALIASES[hint]
    : hint;
}

// Mirrors Python `_locale_hint_entry_is_same_site`. True unless the hint's own
// link points at a DIFFERENT registrable domain: a vendor credit in the footer
// (`<a href="https://vendor.example/ua/">Built with Vendor</a>`) contributes the
// VENDOR's locale path segment, which made a single-language site register as
// multilingual. Entries without a resolvable link (page copy, `lang`
// attributes, relative hrefs) are kept -- they are the site's own text.
function localeHintEntryIsSameSite(entry, targetHost) {
  if (!targetHost || !isPlainObject(entry)) return true;
  const host = identityHost(entry.url);
  if (!host) return true;
  return identityHostsMatch(host, targetHost);
}

const KNOWN_LOCALE_CODES = new Set([
  "ua", "uk", "ru", "en", "de", "fr", "es", "it", "pl",
  "ro", "hu", "cz", "cs", "sk", "pt", "tr", "nl",
]);

const KNOWN_LANGUAGE_NAMES = {
  english: "en",
  ukrainian: "uk",
  "українська": "uk",
  "украинский": "uk",
  "русский": "ru",
  "російська": "ru",
  russian: "ru",
  deutsch: "de",
  german: "de",
  "français": "fr",
  francais: "fr",
  french: "fr",
  "español": "es",
  espanol: "es",
  spanish: "es",
  italiano: "it",
  italian: "it",
  polski: "pl",
  polish: "pl",
  "română": "ro",
  romana: "ro",
  romanian: "ro",
  magyar: "hu",
  hungarian: "hu",
  "čeština": "cs",
  cestina: "cs",
  czech: "cs",
  "slovenčina": "sk",
  slovencina: "sk",
  slovak: "sk",
  "português": "pt",
  portugues: "pt",
  portuguese: "pt",
  "türkçe": "tr",
  turkce: "tr",
  turkish: "tr",
  nederlands: "nl",
  dutch: "nl",
};

// Mirrors Python `_extract_locale_hint`. Returns the matched locale code
// (lower-cased) or "" when nothing was extractable.
function extractLocaleHint(entry) {
  if (!isPlainObject(entry)) return "";

  const lang = entry.lang;
  if (typeof lang === "string") {
    const normalized = lang.trim().toLowerCase();
    const langCode = normalized.split(/[-_,;\s]+/, 1)[0];
    if (KNOWN_LOCALE_CODES.has(normalized)) return normalized;
    if (KNOWN_LOCALE_CODES.has(langCode)) return langCode;
  }

  const text = entry.text;
  if (typeof text === "string") {
    const compact = text.trim().toLowerCase();
    if (KNOWN_LOCALE_CODES.has(compact)) return compact;
    if (Object.prototype.hasOwnProperty.call(KNOWN_LANGUAGE_NAMES, compact)) {
      return KNOWN_LANGUAGE_NAMES[compact];
    }
  }

  const url = entry.url;
  if (typeof url === "string") {
    const queryRe = /[?&](?:lang|locale|hl)=\s*(ua|uk|ru|en|de|fr|es|it|pl|ro|hu|cz|cs|sk|pt|tr|nl)(?:[&#]|$)/i;
    const queryMatch = queryRe.exec(url);
    if (queryMatch) return queryMatch[1].toLowerCase();
    let segments = [];
    try {
      const parsed = new URL(url);
      segments = parsed.pathname
        .split("/")
        .map((segment) => segment.trim().toLowerCase())
        .filter((segment) => segment.length > 0);
    } catch {
      segments = [];
    }
    if (segments.length === 1 && KNOWN_LOCALE_CODES.has(segments[0])) {
      return segments[0];
    }
  }
  return "";
}

// --- Public orchestrator ---

// Mirrors Python `validate_brandkit_against_technical_artifacts(brandkit, technical_dir)`.
//
// Iteration order (must match Python exactly so dedupe ordering stays stable):
//   1. If the technical dir does not exist -> [].
//   2. Read button-styles.json. When the brandkit has NO public buttons but
//      the technical probe captured reusable visible-text button evidence,
//      append TECHNICAL_BUTTON_EVIDENCE_WARNING.
//   3. Read product-card-styles.json. When it carries reusable visible-text
//      product-card CTA evidence:
//        - append TECHNICAL_PRODUCT_CARD_CTA_BUTTON_WARNING when no public
//          button[] entry carries the product-card-cta hint;
//        - append TECHNICAL_PRODUCT_CARD_CTA_TYPOGRAPHY_WARNING when no public
//          typography entry carries that hint with useful typography.
//      Then check hover-key parity and append TECHNICAL_PRODUCT_CARD_CTA_HOVER_WARNING
//      when the brandkit's reusable-card hover does not match technical evidence.
//   4. Read product-card-styles.recovery.json (or fall back to homepage-pass-status.productCardRecovery).
//      When the recovery exhausted without a representative card AND the final
//      product-card evidence is weak, append TECHNICAL_PRODUCT_CARD_WEAK_EVIDENCE_WARNING.
//      Additionally, when the probe captured >0 but <HOMEPAGE_PROBE_LIKELY_PARTIAL_MAX_ROWS
//      rows, append TECHNICAL_PRODUCT_CARD_HOMEPAGE_PROBE_LIKELY_PARTIAL_WARNING
//      — points at a likely partial homepage render (vs a site that genuinely
//      lacks shoppable cards), so re-running often recovers the full card set.
//   5. Read page-signals.json. Inspect both visibleLanguageHints and
//      documentLanguageHints; append TECHNICAL_LANGUAGE_EVIDENCE_WARNING
//      according to the asymmetric Python rules (visible: <2 langs; document:
//      0 langs).
//   6. Re-read homepage-pass-status.json.
//        - If status indicates blocked, append TECHNICAL_HOMEPAGE_BLOCKED_BLOCKER
//          (Python emits the blocker constant into the warnings list — this is
//          intentional duplication that the runner.py orchestration relies on).
//        - When the homepage status is a dict and the button probe degraded
//          AND no recovered button evidence is present, append
//          TECHNICAL_BUTTON_PROBE_DEGRADED_WARNING.
//        - When the status indicates incomplete, append
//          TECHNICAL_HOMEPAGE_PASS_INCOMPLETE_WARNING.
//   7. Dedupe via `Array.from(new Set(...))` (matches Python's
//      `dict.fromkeys` semantics).
// --- Section-evidence helpers (BACKLOG item 31) ---
//
// Mirrors Python `_social_platforms_seen`, `_social_platforms_unfiltered`,
// `_social_platforms_in_kit`, `_canonical_platform_set`,
// `_has_contact_channel` and `_unfiltered_anchor_count` in validation.py.
//
// THE COMPARISON IS PER CANONICAL VALUE, NEVER PER RAW COUNT. Two Instagram
// anchors legitimately collapse to one `socials.instagram` field
// (`brandkitSocialsFromLinks` keeps the best-scoring URL per platform), so
// "2 seen vs 1 carried" is CORRECT behaviour and must stay silent.

// Platforms the visibility-filtered probe classified AND the write could store.
//
// Prefers `visibleSocialPlatforms`, which the probe computes BEFORE the 20-row
// cap on `socials` and filters to http(s). Falls back to deriving it from the
// capped rows for captures written before that key existed.
//
// THE TWO PATHS AGREE ON http(s) AND DISAGREE ON WHAT A PLATFORM IS. This
// comment used to say the identical http(s) rule made disagreement impossible.
// The http(s) rule IS identical; the CLASSIFICATION is not. `visibleSocialPlatforms`
// is written by today's probe, whose `socialPlatformFor` hard-vetoes a social
// CONTENT PERMALINK -- `youtube.com/watch`, `youtu.be/<id>`, `instagram.com/p/<id>`
// (`lib.js`, `isSocialContentPermalink`) -- and returns "" so the row names no
// platform at all. A legacy row's `platform` STRING was written by a probe that
// had no such veto, so the fallback below reads a video permalink as "the brand
// has a YouTube profile". Verified: the same page as a legacy capture yields
// {instagram, youtube} here and {instagram} through the pre-cap key.
//
// MEASURED, AND LEFT AS IT IS. Swept over the archived composed kits: 725 kits,
// EVERY ONE of them legacy (`visibleSocialPlatforms` present on 0 of 725, so
// the fallback is the only path the archive exercises), 3 socials
// `mapper-dropped` warnings, 0 `capture-unproven`, and exactly 1 of the 3 false
// through this gap -- a `youtube.com/watch?v=` link on a non-ecom capture.
// Closing it means a THIRD spelling of a per-platform list the probe itself
// calls "observed, not exhaustive" and expects to grow, in a module whose own
// rule is one spelling per concept (see `canonicalPlatformName` below). One
// false advisory line in 725 kits does not buy that. The disagreement is stated
// here instead of denied, so a reader who needs it gone knows what it costs.
export function socialPlatformsSeen(pageSignals) {
  const preCap = pageSignals?.visibleSocialPlatforms;
  if (Array.isArray(preCap)) return canonicalPlatformSet(preCap);
  const rows = pageSignals?.socials;
  if (!Array.isArray(rows)) return new Set();
  const platforms = new Set();
  for (const row of rows) {
    if (!isPlainObject(row)) continue;
    if (!/^https?:\/\//i.test(String(row.url || ""))) continue;
    // `canonicalPlatformName`, NEVER a second spelling of it. `.trim()` uses
    // JS's own whitespace set and `.toLowerCase()` folds the whole Unicode
    // table, so this site disagreed with the pre-cap site and with BOTH
    // Python sites: "\u03a9facebook" reached the kit comparison as
    // "\u03c9facebook" here and as "\u03a9facebook" everywhere else, and a
    // kit keyed "\u03c9facebook" then warned in Python and stayed silent in
    // JS. The string guard stays: Python's `_canonical_platform_name` returns
    // "" for a non-str, while `String(123)` would coin a platform "123".
    const platform = typeof row.platform === "string" ? canonicalPlatformName(row.platform) : "";
    if (platform) platforms.add(platform);
  }
  return platforms;
}

// Platforms the UNFILTERED DOM sweep classified. Absent on captures written
// before this signal existed, which reads as an empty set: `capture-unproven`
// then cannot fire and `mapper-dropped` still works. That is the intended
// soft failure, not a gap.
export function socialPlatformsUnfiltered(pageSignals) {
  const rows = pageSignals?.unfilteredSocialPlatforms;
  if (!Array.isArray(rows)) return new Set();
  return canonicalPlatformSet(rows);
}

// ONE spelling of canonicalisation for every platform list, so the seen /
// unfiltered / carried sets cannot disagree about casing or padding. Mirrors
// Python `_canonical_platform_set`; `\s` and Python's `str.strip()` differ on
// exotic whitespace, so both sides strip the same explicit class.
export function canonicalPlatformSet(values) {
  const platforms = new Set();
  for (const value of Array.isArray(values) ? values : []) {
    if (typeof value !== "string") continue;
    const platform = canonicalPlatformName(value);
    if (platform) platforms.add(platform);
  }
  return platforms;
}

export function canonicalPlatformName(value) {
  return String(value ?? "")
    .replace(/^[\s\u0000-\u001f\u007f\ufeff]+|[\s\u0000-\u001f\u007f\ufeff]+$/g, "")
    // ASCII-ONLY lowering, on purpose. `String.prototype.toLowerCase` and
    // Python's `str.lower` resolve against each runtime's OWN Unicode table,
    // and V8 is ahead of CPython 3.11: U+1C89 lowers to U+1C8A in JS and is
    // left alone in Python, so one payload yields two different warning lists.
    // Every platform name is ASCII (a closed 20-key schema enum), so lowering
    // only A-Z is exactly equivalent on real input and removes the whole
    // divergence class instead of documenting it.
    .replace(/[A-Z]/g, (letter) => String.fromCharCode(letter.charCodeAt(0) + 32));
}

// Platforms the final kit actually carries a non-empty value for.
export function socialPlatformsInKit(brandkit) {
  const socials = brandkit?.socials;
  if (!isPlainObject(socials)) return new Set();
  const platforms = new Set();
  for (const [platform, value] of Object.entries(socials)) {
    // THE EMPTINESS TEST IS LOAD-BEARING, not defensive. schema.json's
    // `$defs.socials` REQUIRES all 20 platform keys and `emptyBrandkitSocials`
    // fills the absent ones with "", so a real kit always carries 20 keys.
    // Treating key presence as carriage returns all 20 and makes both socials
    // warnings permanently unreachable. Pinned by a production-shaped fixture.
    if (typeof value === "string" && value.trim().length > 0) {
      const name = canonicalPlatformName(platform);
      if (name) platforms.add(name);
    }
  }
  return platforms;
}

// True when at least one member of `seen` is missing from `carried`.
export function anyValueDropped(seen, carried) {
  for (const value of seen) {
    if (!carried.has(value)) return true;
  }
  return false;
}

// True when `unfiltered` offers a value that neither the visible probe nor the
// kit accounts for. This is the whole point of the grade: an empty probe is
// not evidence of an empty site.
export function anyValueUnproven(seen, unfiltered, carried) {
  for (const value of unfiltered) {
    if (!seen.has(value) && !carried.has(value)) return true;
  }
  return false;
}

// Mirrors Python `CONTACT_CHANNELS`. Email and phone only: `addresses` is
// collected from visible TEXT segments, not from anchors, so it has no
// unfiltered href spelling and no honest `capture-unproven` signal.
const CONTACT_CHANNELS = [
  {
    signalKey: "emails",
    kitKey: "emails",
    scheme: "mailto",
    mapperDropped: TECHNICAL_CONTACT_EMAIL_MAPPER_DROPPED_WARNING,
    captureUnproven: TECHNICAL_CONTACT_EMAIL_CAPTURE_UNPROVEN_WARNING,
  },
  {
    signalKey: "phones",
    kitKey: "phones",
    scheme: "tel",
    mapperDropped: TECHNICAL_CONTACT_PHONE_MAPPER_DROPPED_WARNING,
    captureUnproven: TECHNICAL_CONTACT_PHONE_CAPTURE_UNPROVEN_WARNING,
  },
];

// Mirrors Python `_has_contact_channel`. A channel counts as carried when
// its array holds at least one entry.
export function hasContactChannel(container, key) {
  const bucket = isPlainObject(container) ? container[key] : null;
  return Array.isArray(bucket) && bucket.length > 0;
}

// BACKLOG item 31 — WRITABLE, NAVIGATION-ELIGIBLE important-link evidence.
//
// Two rungs, in this order:
//
//   1. WRITABLE — `isWritableImportantLink`, imported from the mapper that
//      owns it. Not a curation rule at all: a row failing it cannot reach the
//      kit no matter how the agent curates, so counting it as loss reports the
//      pipeline's own required drop as a defect.
//   2. NAV-ELIGIBLE — the legal-page and over-cap filters below, which model
//      what SKILL.md instructs the agent to leave out.
//
// The probe admits legal pages on purpose: `privacy` and `terms` are literal
// alternatives in BOTH of its admission patterns. SKILL.md's "Important links
// flow" then instructs the agent to do the opposite — "EXCLUDE long product
// titles, article slugs, promo prose with dates/SKU codes, locale toggles,
// account/wishlist, and legal pages — those belong in body copy, not nav".
// A run that curated exactly as instructed lands `importantLinks: []`, and
// grading the raw probe rows against that empty array reported the skill's
// own instruction as data loss.
//
// Over-cap names are excluded for the second half of the same reason:
// `dropLongImportantLinkNames` removes every `name.length > 40` entry
// unconditionally, so such a row CANNOT be carried and counting it as loss
// reports the pipeline's own normalisation as a defect — the mistake
// `isWritableSocialUrl` already exists to avoid on the socials channel.
//
// Scope: this narrows what the WARNING may fire on, and nothing else. The
// agent still receives every `importantLinksForBrandkit` row as evidence,
// because curation is its judgement to make, not this gate's.
//
// The token set is deliberately narrow. "Cookies" is a bakery category as
// often as it is a banner policy, so it qualifies here only when paired with
// policy/notice wording; a bare `/cookies` stays eligible and may still warn.
// Under-warning on one site is a smaller harm than silencing a real drop on
// another, so every token below is one no storefront uses as a nav label.
//
// Mirrors Python `_nav_eligible_important_links`.
//
// KNOWN RESIDUAL, not fixed here: the two regex ENGINES disagree under `/i`.
// Python's `re.IGNORECASE` folds Unicode, so `re.search("imprint",
// "\u0130mprint", re.I)` matches; this `/i` WITHOUT the `/u` flag does not, so
// the same link name is nav-eligible in JS and filtered in Python and the two
// warning lists diverge.
//
// MEASURED, not assumed: sweeping all 1,114,112 codepoints against every
// letter these two patterns are built from (33 letters, ASCII + Cyrillic)
// yields EXACTLY FOUR divergent codepoints, all folding on the Python side
// only -- U+0130 (Turkish dotted capital I) and U+0131 (dotless i) to `i`,
// U+017F (long s) to `s`, U+212A (Kelvin sign) to `k`. Of the four only the
// Turkish pair plausibly appears in a real nav label. Closing it means an
// explicit fold table on both sides, or dropping `/i` in favour of character
// classes -- a lockstep rewrite of both patterns, larger than what it buys.
const LEGAL_LINK_NAME_RE =
  /(privacy|terms|gdpr|legal|disclaimer|imprint|impressum|eula|cookies?[\s_-]*(policy|notice|settings|preferences)|конфіденц|конфиденц|оферт|правова)/i;
const LEGAL_LINK_PATH_RE =
  /(^|[._/-])(privacy([-_]?policy)?|terms([-_]?(of[-_]?)?(use|service|sale))?|cookies?[-_]?(policy|notice)|gdpr|legal|disclaimer|imprint|impressum|eula)([._/?#-]|$)/i;

// Scheme + authority stripped WITHOUT a URL parser, so a relative `/help` and
// an absolute `https://acme.test/help` reduce to the same string and the two
// languages cannot disagree about what their respective parsers do. Host is
// deliberately excluded: `legal-shop.test/delivery` is a storefront, not a
// legal page.
export function importantLinkPath(url) {
  const withoutScheme = String(url ?? "").replace(/^[a-z][a-z0-9+.-]*:\/\//i, "");
  const slash = withoutScheme.indexOf("/");
  return slash < 0 ? "" : withoutScheme.slice(slash);
}

export function isNavEligibleImportantLink(entry) {
  if (!isPlainObject(entry)) return false;
  // WRITABLE FIRST. The probe admits rows the writable mapper is REQUIRED to
  // drop — `lib.js` builds each row as `name: entry.text || ""`, so a visible
  // icon-only `/delivery` link arrives as `{name: "", url: "..."}` — and
  // `linksFromSignals` removes them. Grading those rows against the kit
  // reported the mapper's own correct drop as data loss. Reproduced live:
  // real Chromium, an icon-only header link, kit `importantLinks: []`,
  // warning fired. Asking the mapper's predicate is the whole fix; everything
  // below it is the pre-existing curation filter.
  //
  // The STRING-GUARDED view is what the predicate sees, exactly as this gate
  // has always read these two fields. `normalizeText` would coerce a non-string
  // (`String(5)`, `String(true)`, `String(1.0)`) and Python's `str()` spells
  // two of those three differently — a divergence class with no reachable
  // input behind it, since `lib.js` writes `name: entry.text || ""` and
  // `url: entry.url || ""` from DOM strings. Guarding here keeps the two
  // languages identical by construction.
  const name = typeof entry.name === "string" ? entry.name : "";
  const url = typeof entry.url === "string" ? entry.url : "";
  if (!isWritableImportantLink({ name, url })) return false;
  // The mapper's normaliser, not the raw field: the cap and the legal-name
  // test must judge the string the kit would actually carry.
  const normalizedName = normalizeText(name);
  // The cap's own constant and the cap's own comparison (UTF-16 code units),
  // so this can never call a row eligible that normalize drops.
  if (normalizedName.length > IMPORTANT_LINK_NAME_LENGTH_CAP) return false;
  if (LEGAL_LINK_NAME_RE.test(normalizedName)) return false;
  if (LEGAL_LINK_PATH_RE.test(importantLinkPath(url))) return false;
  return true;
}

export function navEligibleImportantLinks(rows) {
  return (Array.isArray(rows) ? rows : []).filter(isNavEligibleImportantLink);
}

// Mirrors Python `_js_integer_or_zero`.
//
// INTEGER-VALUED, not int-typed -- and the Python side now says the same
// thing. `JSON.parse` has one numeric type, so the bytes `3.0` and `1e30`
// arrive here as Numbers `Number.isInteger` accepts, while `json.loads` gave
// Python a `float` that `isinstance(value, int)` rejected: the artifact
// `{"tel": 3.0}` warned on this side and stayed silent on the other.
// `Number.isInteger` already refuses Infinity and NaN, so an integer literal
// too large for a finite double is refused here and by the `float()`
// OverflowError on the Python side.
//
// ONE spelling for every count this module reads off an artifact: the drift
// above is what a second copy costs, and there are two callers now.
function integerOrZero(value) {
  if (typeof value !== "number" || !Number.isInteger(value) || value <= 0) return 0;
  return value;
}

// Mirrors Python `_unfiltered_anchor_count`. Missing key reads as zero.
export function unfilteredAnchorCount(pageSignals, scheme) {
  const anchors = pageSignals?.unfilteredContactAnchors;
  if (!isPlainObject(anchors)) return 0;
  return integerOrZero(anchors[scheme]);
}

// Mirrors Python `_hrefless_social_control_count`. An ABSENT field is a zero:
// every artifact produced before this signal existed carries no such key, and
// a run whose page could not answer omits it rather than publishing a count it
// did not measure. Both must stay silent, which is what zero already does.
export function hrefLessSocialControlCount(pageSignals) {
  const controls = pageSignals?.hrefLessSocialControls;
  if (!isPlainObject(controls)) return 0;
  return integerOrZero(controls.count);
}

// Mirrors Python `_hrefless_social_controls_warning`; the two must produce the
// byte-identical string for the same count.
export function hrefLessSocialControlsWarning(count) {
  return TECHNICAL_SOCIAL_HREFLESS_CONTROLS_WARNING.replace("{count}", String(count));
}

export function validateBrandkitAgainstTechnicalArtifacts(brandkit, technicalDir) {
  if (!isDirectory(technicalDir)) return [];

  const warnings = [];
  const brand = isPlainObject(brandkit?.brand) ? brandkit.brand : {};
  const components = isPlainObject(brand.components) ? brand.components : {};
  const finalButtons = components.button;
  const hasAnyFinalButtons = Array.isArray(finalButtons) && finalButtons.length > 0;

  const buttonRows = readOptionalJson(path.join(technicalDir, "button-styles.json"));
  if (!hasAnyFinalButtons && hasReusableVisibleTextButtonEvidence(buttonRows)) {
    warnings.push(TECHNICAL_BUTTON_EVIDENCE_WARNING);
  }

  const productRows = readOptionalJson(path.join(technicalDir, "product-card-styles.json"));
  if (hasReusableProductCardCtaEvidence(productRows)) {
    if (!hasProductCardCtaButton(brandkit)) {
      warnings.push(TECHNICAL_PRODUCT_CARD_CTA_BUTTON_WARNING);
    }
    if (!hasProductCardCtaTypography(brandkit)) {
      warnings.push(TECHNICAL_PRODUCT_CARD_CTA_TYPOGRAPHY_WARNING);
    }
  }
  if (finalProductCardCtaHoverMismatchesTechnicalEvidence(brandkit, productRows)) {
    warnings.push(TECHNICAL_PRODUCT_CARD_CTA_HOVER_WARNING);
  }

  let productRecovery = readOptionalJson(path.join(technicalDir, "product-card-styles.recovery.json"));
  if (!isPlainObject(productRecovery)) {
    const homepageStatusForRecovery = readOptionalJson(
      path.join(technicalDir, "homepage-pass-status.json"),
    );
    productRecovery = isPlainObject(homepageStatusForRecovery)
      ? homepageStatusForRecovery.productCardRecovery
      : null;
  }
  if (
    productCardRecoveryExhaustedWithoutRepresentative(productRecovery, productRows) &&
    finalProductCardEvidenceIsWeakOrIncomplete(brandkit)
  ) {
    warnings.push(TECHNICAL_PRODUCT_CARD_WEAK_EVIDENCE_WARNING);
    if (homepageProbeLikelyPartial(productRows)) {
      warnings.push(TECHNICAL_PRODUCT_CARD_HOMEPAGE_PROBE_LIKELY_PARTIAL_WARNING);
    }
  }

  const pageSignals = readOptionalJson(path.join(technicalDir, "page-signals.json"));
  const finalLanguages = brandkit?.languages;
  if (isPlainObject(pageSignals)) {
    const targetHost = identityHost(pageSignals.pageUrl) || "";
    const visibleHints = pageSignals.visibleLanguageHints;
    if (Array.isArray(visibleHints)) {
      const localeHints = new Set();
      for (const entry of visibleHints) {
        if (!localeHintEntryIsSameSite(entry, targetHost)) continue;
        const hint = extractLocaleHint(entry);
        if (hint) localeHints.add(aliasLocaleHint(hint));
      }
      if (
        localeHints.size >= 2 &&
        (!Array.isArray(finalLanguages) || finalLanguages.length < 2)
      ) {
        warnings.push(TECHNICAL_LANGUAGE_EVIDENCE_WARNING);
      }
    }
    const documentHints = pageSignals.documentLanguageHints;
    if (Array.isArray(documentHints)) {
      const localeHints = new Set();
      for (const entry of documentHints) {
        const hint = extractLocaleHint(entry);
        if (hint) localeHints.add(aliasLocaleHint(hint));
      }
      if (
        localeHints.size >= 2 &&
        (!Array.isArray(finalLanguages) || finalLanguages.length === 0)
      ) {
        warnings.push(TECHNICAL_LANGUAGE_EVIDENCE_WARNING);
      }
    }
  }

  // BACKLOG item 31 — section evidence. `languages` is deliberately NOT here:
  // the two locale-hint checks above already own that channel, and a second
  // warning on the same evidence would be a duplicate.
  //
  // `importantLinks` gets `mapper-dropped` ONLY. Its probe rows are curated
  // {name, url} pairs with no independent unfiltered spelling, so there is no
  // honest `capture-unproven` signal to compute; inventing one would be the
  // same correlate-instead-of-question mistake this gate exists to catch.
  if (isPlainObject(pageSignals)) {
    const socialsSeen = socialPlatformsSeen(pageSignals);
    const socialsUnfiltered = socialPlatformsUnfiltered(pageSignals);
    const socialsCarried = socialPlatformsInKit(brandkit);
    if (anyValueDropped(socialsSeen, socialsCarried)) {
      warnings.push(TECHNICAL_SOCIAL_MAPPER_DROPPED_WARNING);
    }
    if (anyValueUnproven(socialsSeen, socialsUnfiltered, socialsCarried)) {
      warnings.push(TECHNICAL_SOCIAL_CAPTURE_UNPROVEN_WARNING);
    }
    // The href-less arm. Gated on the KIT carrying no social url at all, not on
    // the per-platform comparison above: this evidence names no platform, so it
    // can only speak to the whole channel, and a site whose visible anchors
    // already produced socials has had that channel proven — the icons drawn
    // without an href beside them are then a duplicate rendering, not a missed
    // capture.
    const hrefLessSocialControls = hrefLessSocialControlCount(pageSignals);
    if (hrefLessSocialControls > 0 && socialsCarried.size === 0) {
      warnings.push(hrefLessSocialControlsWarning(hrefLessSocialControls));
    }

    // Email and phone are evaluated INDEPENDENTLY: a site that publishes a
    // phone number and no address must not have its phone finding masked by
    // the email channel, and vice versa.
    const signalContacts = pageSignals.contacts;
    const finalContacts = brandkit?.contacts;
    for (const channel of CONTACT_CHANNELS) {
      const seen = hasContactChannel(signalContacts, channel.signalKey);
      const carried = hasContactChannel(finalContacts, channel.kitKey);
      if (carried) continue;
      if (seen) {
        warnings.push(channel.mapperDropped);
      } else if (unfilteredAnchorCount(pageSignals, channel.scheme) > 0) {
        warnings.push(channel.captureUnproven);
      }
    }

    const linksSeen = navEligibleImportantLinks(pageSignals.importantLinksForBrandkit);
    const linksCarried = brandkit?.importantLinks;
    if (
      linksSeen.length > 0 &&
      (!Array.isArray(linksCarried) || linksCarried.length === 0)
    ) {
      warnings.push(TECHNICAL_IMPORTANT_LINKS_MAPPER_DROPPED_WARNING);
    }
  }

  const homepageStatus = readOptionalJson(path.join(technicalDir, "homepage-pass-status.json"));
  if (homepageStatusIndicatesBlocked(homepageStatus)) {
    warnings.push(TECHNICAL_HOMEPAGE_BLOCKED_BLOCKER);
  }
  if (isPlainObject(homepageStatus)) {
    const completedPhases = homepageStatus.completedPhases;
    const buttonProbeDegraded =
      homepageStatus.buttonProbeDegraded ||
      (Array.isArray(completedPhases) && completedPhases.includes("buttons-degraded"));
    if (buttonProbeDegraded && !hasRecoveredButtonProbeEvidence(finalButtons, buttonRows)) {
      warnings.push(TECHNICAL_BUTTON_PROBE_DEGRADED_WARNING);
    }
  }
  if (statusIndicatesIncomplete(homepageStatus)) {
    warnings.push(TECHNICAL_HOMEPAGE_PASS_INCOMPLETE_WARNING);
  }

  // THE FOUR REQUIRED-WITH-EVIDENCE FINDINGS, demoted from blockers.
  //
  // APPENDED AT THE TAIL, and the position is load-bearing rather than
  // convenient: `_assert_technical_artifact_warnings_parity` compares this list
  // to the Python one with an ORDERED `assertEqual`, so the twin appends at the
  // same place or nine existing fixtures fail at once. The tail is also the
  // only position that leaves every existing warning at the index it had.
  //
  // The `statusCompletedAndReady` guard is carried over from
  // `detectTechnicalArtifactBlockers` verbatim. Without it these findings would
  // start firing on captures the blocker never judged -- a blocked or
  // half-finished homepage -- which would be a new condition rather than a
  // moved one. The styling three and the logos one are appended in that order,
  // matching the order the split returns them.
  if (statusCompletedAndReady(homepageStatus)) {
    const required = requiredWithEvidenceFindings(brandkit, technicalDir);
    warnings.push(...required.styling, ...required.logos);
  }

  return dedupeMessages(warnings);
}

// Re-export the canonical product-card-cta hint string so callers don't need
// to know which module owns it. This stays in lockstep with the
// technical-artifact-blockers and semantic-validators modules.
export { PRODUCT_CARD_CTA_HINT };

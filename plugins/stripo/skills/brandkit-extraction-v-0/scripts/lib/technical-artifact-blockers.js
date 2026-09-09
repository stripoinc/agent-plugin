// Mirror of `detect_technical_artifact_blockers` and its helpers in
// `reteno_agent/brandkit_finalize/validation.py`. Keep blocker-message strings, helper
// semantics, and the orchestrator iteration order in lockstep with the Python
// implementation; both sides share the same parity oracle in
// tests/test_skill_probe_contracts.py.
//
// Scope (step 2): only the technical-artifact BLOCKERS produced by
// `detect_technical_artifact_blockers`. Warnings emitted by
// `validate_brandkit_against_technical_artifacts` are out of scope here.

import fs from "node:fs";
import path from "node:path";
import { isDiscountOnlyCtaLabel } from "./product-card-cta-label.js";

// --- Blocker message constants (string-for-string parity with Python) ---

export const TECHNICAL_HOMEPAGE_BLOCKED_BLOCKER =
  "Homepage appears blocked by a security interstitial, so brand extraction cannot continue from reliable homepage evidence.";

export const TECHNICAL_FALSE_FALLBACK_BLOCKER =
  "Final brandkit looks like an empty fallback bundle even though homepage technical artifacts completed and were ready for assembly.";

export const REQUIRED_WITH_EVIDENCE_BACKGROUND_COLORS_BLOCKER =
  "Final brandkit brand.colors.backgroundColors is empty even though assembly-diagnostics canvas-background candidates exist with confidence at or above 0.3.";

export const REQUIRED_WITH_EVIDENCE_TYPOGRAPHY_BLOCKER =
  "Final brandkit brand.typography is empty even though assembly-diagnostics body-typography or heading-typography candidates exist with confidence at or above 0.3.";

export const REQUIRED_WITH_EVIDENCE_BUTTON_BLOCKER =
  "Final brandkit brand.components.button is empty even though assembly-diagnostics button-primary candidates exist with confidence at or above 0.3.";

export const REQUIRED_WITH_EVIDENCE_LOGOS_BLOCKER =
  "Final brandkit brand.logos is empty even though assembly-diagnostics logos candidates exist with confidence at or above 0.3.";

export const PRODUCT_CARD_CTA_VISIBLE_TEXT_MIRROR_MISSING_BLOCKER =
  "Product-card CTA layoutIntent indicates reusable visible-text, so brand.components.button and brand.typography must each carry an entry with the product-card-cta usage hint.";

export const PRODUCT_CARD_CTA_HINT = "product-card-cta";

export const CANDIDATE_CONFIDENCE_FLOOR = 0.3;

// --- isPlainObject helper: matches Python `isinstance(x, dict)` semantics ---

export function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

// --- File / directory helpers ---

// Strict UTF-8 decode: the JS equivalent of Python's
// `Path.read_text(encoding="utf-8")` raising UnicodeDecodeError.
//
// `fs.readFileSync(p, "utf-8")` decodes LOSSILY — every invalid byte becomes
// U+FFFD and the read succeeds. That silently turns unreadable input into
// readable-but-altered input: one 0xFF byte inside a JSON string still parses,
// so a corrupt `assembly-diagnostics.json` whose `"logos"` key decoded to
// `"lo<U+FFFD>gos"` hid a confident candidate, the gate reported no blockers,
// and the run promoted a logo-less brandkit — while the Python side raised
// UnicodeDecodeError on the identical bytes. Decoding with `fatal: true`
// throws instead.
//
// `ignoreBOM: true` KEEPS a leading U+FEFF in the string rather than stripping
// it, which is what both `fs.readFileSync(p, "utf-8")` and Python's
// `read_text` already do — so a BOM-prefixed artifact keeps failing
// JSON.parse / json.loads on both sides instead of newly succeeding here.
const STRICT_UTF8_DECODER = new TextDecoder("utf-8", { fatal: true, ignoreBOM: true });

export function decodeUtf8Strict(buffer) {
  return STRICT_UTF8_DECODER.decode(buffer);
}

// Read a file as text through the strict decoder above. Throws both on an
// unreadable path and on invalid UTF-8; callers decide which is fatal.
export function readUtf8FileStrict(filePath) {
  return decodeUtf8Strict(fs.readFileSync(filePath));
}

// Mirrors Python `_read_optional_json`. LENIENT reader for artifacts that only
// feed ADVISORY warnings (technical-artifact-warnings.js). Returns the parsed
// value, or `null` if the path does not exist, is not a regular file, fails to
// read, carries invalid UTF-8, or fails to parse. Never throws.
//
// Invalid UTF-8 degrades to `null` here deliberately: Python's `except
// (OSError, ValueError)` catches UnicodeDecodeError (a ValueError subclass),
// so a corrupt advisory artifact reads as "absent" on both sides.
//
// NEVER use this for an artifact a BLOCKER decision reads — see readGateJson.
export function readOptionalJson(filePath) {
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return null;
  } catch {
    return null;
  }
  try {
    return JSON.parse(readUtf8FileStrict(filePath));
  } catch {
    return null;
  }
}

// Mirrors Python `TechnicalArtifactUnreadableError`.
export class TechnicalArtifactUnreadableError extends Error {
  constructor(message, { filePath = null, cause = null } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = "TechnicalArtifactUnreadableError";
    this.code = "technical_artifact_unreadable";
    this.filePath = filePath;
  }
}

// Mirrors Python `_read_gate_json`. STRICT reader for the artifacts
// `detectTechnicalArtifactBlockers` decides on.
//
// Absent -> null (a decidable "no evidence recorded"). Unreadable -> throw.
// "Unreadable" covers three things, and all three take the same loud path:
// the read failing, the bytes not being valid UTF-8 (readUtf8FileStrict), and
// the text not being JSON. A LOSSY decode is as dangerous as a swallowed parse
// error — it does not report failure at all, it reports a different document.
//
// Degrading a corrupt file to "absent" here silently converts "we cannot tell
// whether this run is blocked" into "this run is not blocked": a truncated
// homepage-pass-status.json can be concealing {"status": "blocked"}, and a
// corrupt assembly-diagnostics.json can be concealing the confident candidate
// that makes an empty role fatal. Either way the gate would report an empty
// blocker list — a success signal derived from unreadable input.
//
// The throw is deliberately NOT converted into a result entry by
// validate-skill-output.js: the finalize CLI downgrades JS `errors` to
// warnings during the port transition, so an error entry here would exit 0.
// Aborting without a result routes the run to the Python gate, which raises
// TechnicalArtifactUnreadableError and lands on exit 1 with the file named in
// finalize-report.json.
export function readGateJson(filePath) {
  try {
    const stat = fs.statSync(filePath);
    if (!stat.isFile()) return null;
  } catch {
    return null;
  }
  let text;
  try {
    // Bytes -> strict UTF-8. A decode failure lands in the same catch as a
    // read failure, so invalid UTF-8 can never reach JSON.parse mangled.
    text = readUtf8FileStrict(filePath);
  } catch (error) {
    throw unreadableGateArtifact(filePath, error);
  }
  try {
    return JSON.parse(text);
  } catch (error) {
    throw unreadableGateArtifact(filePath, error);
  }
}

// One message shape for every unreadable-artifact cause (read error, invalid
// UTF-8, invalid JSON), mirroring Python's single `except (OSError, ValueError)`.
function unreadableGateArtifact(filePath, error) {
  return new TechnicalArtifactUnreadableError(
    `Blocker gate cannot read technical artifact ${filePath}: `
    + `${errorLabel(error)}: ${error.message || String(error)}. A corrupt artifact may be `
    + "concealing a blocker, so the gate fails closed instead of "
    + "reporting an empty blocker list.",
    { filePath, cause: error },
  );
}

// Python names the invalid-UTF-8 cause `UnicodeDecodeError`; TextDecoder
// reports a bare `TypeError`, which reads as a programming bug rather than a
// corrupt artifact. Relabel that one case so both sides name the same thing.
function errorLabel(error) {
  const name = error?.name || "Error";
  if (name === "TypeError" && /encoded data was not valid|not valid for encoding/i.test(String(error?.message || ""))) {
    return "UnicodeDecodeError";
  }
  return name;
}

export function isDirectory(dirPath) {
  try {
    return fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

// --- Status helpers ---

// Mirrors Python `homepage_status_indicates_blocked`.
export function homepageStatusIndicatesBlocked(statusPayload) {
  return (
    isPlainObject(statusPayload) &&
    (statusPayload.status === "blocked" ||
      statusPayload.blockedBySecurityInterstitial === true)
  );
}

// Mirrors Python `_status_completed_and_ready`.
export function statusCompletedAndReady(statusPayload) {
  if (!isPlainObject(statusPayload)) return false;
  if (statusPayload.status !== "completed") return false;
  if (statusPayload.degraded === true) return false;
  if (statusPayload.readyForAssembly !== true) return false;
  const missing = statusPayload.missingRequiredArtifacts;
  if (Array.isArray(missing) && missing.length > 0) return false;
  return true;
}

// --- Required-with-evidence helpers ---

// Mirrors Python `_pool_has_confident_candidate`. Returns true iff
// `candidates[role]` contains at least one entry with a numeric confidence
// at or above `threshold` (default 0.3).
export function poolHasConfidentCandidate(
  candidates,
  role,
  { threshold = CANDIDATE_CONFIDENCE_FLOOR } = {},
) {
  if (!isPlainObject(candidates)) return false;
  const entries = candidates[role];
  if (!Array.isArray(entries)) return false;
  for (const entry of entries) {
    if (!isPlainObject(entry)) continue;
    const confidence = entry.confidence;
    if (typeof confidence === "boolean") continue;
    const value = typeof confidence === "number" ? confidence : Number(confidence);
    if (!Number.isFinite(value)) continue;
    if (value >= threshold) return true;
  }
  return false;
}

// The recorded reason under any of `fieldPaths`, trimmed, or `""`.
//
// ONE reader, two views. `hasRoleChoiceJustification` below is the boolean the
// finalize CLI's empty-array checks want and the half that mirrors Python
// `_has_role_choice_justification`; the text-colour coverage gate needs the
// TEXT, because a justification there has to name what it excuses or it is a
// permanent site-wide opt-out. Two readers of one key would be one more thing
// to keep in step, so the boolean delegates to this rather than the reverse.
// Order is irrelevant ("any match", first non-empty wins).
export function roleChoiceJustificationText(diagnostics, fieldPaths) {
  if (!isPlainObject(diagnostics)) return "";
  const justifications = diagnostics.roleChoiceJustifications;
  if (!isPlainObject(justifications)) return "";
  for (const fieldPath of Array.isArray(fieldPaths) ? fieldPaths : []) {
    const value = justifications[fieldPath];
    if (typeof value === "string" && value.trim().length > 0) return value.trim();
  }
  return "";
}

// Mirrors Python `_has_role_choice_justification`. Returns true iff
// `diagnostics.roleChoiceJustifications[path]` is a non-empty (after trim)
// string for any of the supplied paths. Order is irrelevant ("any match").
export function hasRoleChoiceJustification(diagnostics, fieldPaths) {
  return roleChoiceJustificationText(diagnostics, fieldPaths) !== "";
}

// Mirrors Python `_required_with_evidence_findings`. Reads
// `assembly-diagnostics.json` from the technical dir and emits one finding per
// "candidate confident, public field empty, no role-choice justification" gap.
//
// RETURNS THE FOUR FINDINGS SPLIT BY WHAT THEY ARE ABOUT, not as one list. The
// three styling ones -- background colours, typography, button -- and the logos
// one used to be pushed into a single array that `detectTechnicalArtifactBlockers`
// concatenated into six other fatal conditions, so any change to "the
// required-with-evidence blockers" moved the logo row by accident. A logo is
// the one field on this list that is also an ASSET URL, which is the factual
// family, and it earns its own name for that reason even though the owner ruled
// it a warning too: the condition is an EMPTY `brand.logos`, an absence, and an
// absence cannot publish a false URL.
export function requiredWithEvidenceFindings(brandkit, technicalDir) {
  const diagnostics = readGateJson(path.join(technicalDir, "assembly-diagnostics.json"));
  if (!isPlainObject(diagnostics)) return { styling: [], logos: [] };
  const candidates = diagnostics.candidates;
  if (!isPlainObject(candidates)) return { styling: [], logos: [] };

  const brandRaw = isPlainObject(brandkit) ? brandkit.brand : undefined;
  const brand = isPlainObject(brandRaw) ? brandRaw : {};
  const colors = isPlainObject(brand.colors) ? brand.colors : {};
  const components = isPlainObject(brand.components) ? brand.components : {};

  const styling = [];
  const logos = [];

  if (poolHasConfidentCandidate(candidates, "canvas-background")) {
    const backgrounds = colors.backgroundColors;
    if (
      (!Array.isArray(backgrounds) || backgrounds.length === 0) &&
      !hasRoleChoiceJustification(diagnostics, [
        "brand.colors.backgroundColors",
        "colors.backgroundColors",
      ])
    ) {
      styling.push(REQUIRED_WITH_EVIDENCE_BACKGROUND_COLORS_BLOCKER);
    }
  }

  if (
    poolHasConfidentCandidate(candidates, "body-typography") ||
    poolHasConfidentCandidate(candidates, "heading-typography")
  ) {
    const typography = brand.typography;
    if (
      (!Array.isArray(typography) || typography.length === 0) &&
      !hasRoleChoiceJustification(diagnostics, ["brand.typography", "typography"])
    ) {
      styling.push(REQUIRED_WITH_EVIDENCE_TYPOGRAPHY_BLOCKER);
    }
  }

  if (poolHasConfidentCandidate(candidates, "button-primary")) {
    const buttons = components.button;
    if (
      (!Array.isArray(buttons) || buttons.length === 0) &&
      !hasRoleChoiceJustification(diagnostics, [
        "brand.components.button",
        "components.button",
      ])
    ) {
      styling.push(REQUIRED_WITH_EVIDENCE_BUTTON_BLOCKER);
    }
  }

  if (poolHasConfidentCandidate(candidates, "logos")) {
    const brandLogos = brand.logos;
    if (
      (!Array.isArray(brandLogos) || brandLogos.length === 0) &&
      !hasRoleChoiceJustification(diagnostics, ["brand.logos", "logos"])
    ) {
      logos.push(REQUIRED_WITH_EVIDENCE_LOGOS_BLOCKER);
    }
  }
  return { styling, logos };
}

// --- Product-card visible-text mirror helpers ---

// Mirrors Python `_record_usage_hints`. Returns the list of non-blank string
// usage hints attached to a record, or [] if the record is malformed.
export function recordUsageHints(record) {
  if (!isPlainObject(record)) return [];
  const hints = record.usageHints;
  if (!Array.isArray(hints)) return [];
  return hints.filter((hint) => typeof hint === "string" && hint.trim().length > 0);
}

// Mirrors Python `_numeric_value`. Returns the positive numeric value of
// `record[key]`, or null if missing/non-numeric/non-positive. Booleans are
// rejected (Python's `isinstance(x, bool)` early-out).
export function numericValue(record, key) {
  if (!isPlainObject(record)) return null;
  const raw = record[key];
  if (typeof raw === "boolean") return null;
  if (typeof raw !== "number" || !Number.isFinite(raw)) return null;
  return raw > 0 ? raw : null;
}

// Mirrors Python `_has_useful_typography`. A typography record is "useful"
// when it has a non-blank font family AND a positive numeric `sizePx`.
export function hasUsefulTypography(record) {
  if (!isPlainObject(record)) return false;
  const family = typeof record.family === "string" ? record.family.trim() : "";
  if (!family) return false;
  return numericValue(record, "sizePx") !== null;
}

// Mirrors Python `_signals_show_product_card_context`. Treats the row as
// product-card-shaped when at least 2 of the 5 context flags are true.
export function signalsShowProductCardContext(signals) {
  const keys = ["hasProductUrl", "hasTitle", "hasImage", "hasCurrentPrice", "hasOldPrice"];
  let count = 0;
  for (const key of keys) {
    if (signals[key] === true) count += 1;
  }
  return count >= 2;
}

// Mirrors Python `_row_has_reusable_product_card_cta_evidence`.
export function rowHasReusableProductCardCtaEvidence(row) {
  if (!isPlainObject(row)) return false;
  const signals = row.selectionSignals;
  if (!isPlainObject(signals)) return false;
  return (
    !isDiscountOnlyCtaLabel(row?.cta?.text) &&
    signals.hasCta === true &&
    signals.ctaLooksPurchaseLike === true &&
    signals.ctaHasUsableVisibleText === true &&
    signals.ctaIsIconLike !== true &&
    signals.ctaLabelNotUsable !== true &&
    signals.homepageCtaNotReusableAsText !== true &&
    signalsShowProductCardContext(signals)
  );
}

// Mirrors Python `_has_reusable_product_card_cta_evidence`.
export function hasReusableProductCardCtaEvidence(productRows) {
  if (!Array.isArray(productRows)) return false;
  return productRows.some((row) => rowHasReusableProductCardCtaEvidence(row));
}

// Mirrors Python `_has_product_card_cta_button`. Returns true iff any
// `brand.components.button[]` record carries the `product-card-cta` hint.
export function hasProductCardCtaButton(brandkit) {
  const brand = isPlainObject(brandkit?.brand) ? brandkit.brand : {};
  const components = isPlainObject(brand.components) ? brand.components : {};
  const buttons = components.button;
  if (!Array.isArray(buttons)) return false;
  return buttons.some((record) => recordUsageHints(record).includes(PRODUCT_CARD_CTA_HINT));
}

// Mirrors Python `_has_product_card_cta_typography`.
export function hasProductCardCtaTypography(brandkit) {
  const brand = isPlainObject(brandkit?.brand) ? brandkit.brand : {};
  const typography = brand.typography;
  if (!Array.isArray(typography)) return false;
  return typography.some(
    (record) =>
      recordUsageHints(record).includes(PRODUCT_CARD_CTA_HINT) && hasUsefulTypography(record),
  );
}

// Mirrors Python `_product_card_visible_text_mirror_missing`. When technical
// product-card rows show reusable visible-text CTA evidence, both the button
// and typography mirrors must carry the `product-card-cta` hint; otherwise the
// blocker fires (deduped to one occurrence).
export function productCardVisibleTextMirrorMissing(brandkit, productRows) {
  if (!hasReusableProductCardCtaEvidence(productRows)) return [];
  const blockers = [];
  if (!hasProductCardCtaButton(brandkit)) {
    blockers.push(PRODUCT_CARD_CTA_VISIBLE_TEXT_MIRROR_MISSING_BLOCKER);
  }
  if (
    !hasProductCardCtaTypography(brandkit) &&
    !blockers.includes(PRODUCT_CARD_CTA_VISIBLE_TEXT_MIRROR_MISSING_BLOCKER)
  ) {
    blockers.push(PRODUCT_CARD_CTA_VISIBLE_TEXT_MIRROR_MISSING_BLOCKER);
  }
  return blockers;
}

// --- Empty-site fallback helpers ---

// Mirrors Python `_has_product_card_extraction_evidence`. A product-card
// record counts as evidence unless it is the explicit "no evidence" stub.
function hasProductCardExtractionEvidence(productCards) {
  if (!Array.isArray(productCards)) return false;
  for (const card of productCards) {
    if (!isPlainObject(card)) continue;
    if (card.evidenceQuality === "none") continue;
    if (
      card.confidence === 0 &&
      !["backgroundColor", "borderColor", "priceColor", "oldPriceColor", "titleTypography", "cta"].some(
        (key) => Boolean(card[key]),
      )
    ) {
      continue;
    }
    return true;
  }
  return false;
}

// Mirrors Python `_social_values`. Returns the trimmed non-empty string values
// from the `socials` map.
function socialValues(brandkit) {
  const socials = brandkit?.socials;
  if (!isPlainObject(socials)) return [];
  const values = [];
  for (const value of Object.values(socials)) {
    if (typeof value === "string" && value.trim().length > 0) {
      values.push(value.trim());
    }
  }
  return values;
}

// Mirrors Python `_looks_like_empty_site_fallback_bundle`. Returns true iff
// none of the public extraction surfaces have any evidence.
export function looksLikeEmptySiteFallbackBundle(brandkit) {
  const brandRaw = isPlainObject(brandkit?.brand) ? brandkit.brand : {};
  const brand = brandRaw;
  const components = isPlainObject(brand.components) ? brand.components : {};
  const colors = isPlainObject(brand.colors) ? brand.colors : {};
  const contacts = isPlainObject(brandkit?.contacts) ? brandkit.contacts : {};

  const accentColors = colors.accentColors;
  const backgroundColors = colors.backgroundColors;
  const textColors = colors.textColors;
  const typography = brand.typography;
  const buttons = components.button;
  const productCards = components.productCard;
  const importantLinks = brandkit?.importantLinks;
  const languages = brandkit?.languages;
  const emails = contacts.emails;
  const phones = contacts.phones;
  const addresses = contacts.addresses;

  const flags = [
    Array.isArray(accentColors) && accentColors.length > 0,
    Array.isArray(backgroundColors) && backgroundColors.length > 0,
    Array.isArray(textColors) && textColors.length > 0,
    Array.isArray(typography) && typography.length > 0,
    Array.isArray(buttons) && buttons.length > 0,
    hasProductCardExtractionEvidence(productCards),
    Array.isArray(importantLinks) && importantLinks.length > 0,
    Array.isArray(languages) && languages.length > 0,
    Array.isArray(emails) && emails.length > 0,
    Array.isArray(phones) && phones.length > 0,
    Array.isArray(addresses) && addresses.length > 0,
    socialValues(brandkit).length > 0,
  ];
  return !flags.some(Boolean);
}

// --- Reusable visible-text button helpers (used by the false-fallback gate) ---

// Mirrors Python `_signals_show_reusable_visible_text_cta`. Visible text
// signals fall back to `hasUsableVisibleText` when `ctaHasUsableVisibleText` is
// missing (Python uses `is None` to detect that).
function signalsShowReusableVisibleTextCta(signals) {
  if (signals.looksLikePurchaseCta !== true) return false;
  if (signals.homepageCtaNotReusableAsText === true) return false;
  if (signals.ctaLabelNotUsable === true) return false;
  if (signals.ctaIsIconLike === true) return false;
  let visibleText = signals.ctaHasUsableVisibleText;
  if (visibleText === undefined || visibleText === null) {
    visibleText = signals.hasUsableVisibleText;
  }
  return visibleText === true;
}

// Mirrors Python `_has_reusable_visible_text_button_evidence`.
export function hasReusableVisibleTextButtonEvidence(buttonRows) {
  if (!Array.isArray(buttonRows)) return false;
  for (const row of buttonRows) {
    if (!isPlainObject(row)) continue;
    const def = row.default;
    if (!isPlainObject(def)) continue;
    const signals = def.selectionSignals;
    if (!isPlainObject(signals)) continue;
    if (signalsShowReusableVisibleTextCta(signals)) return true;
  }
  return false;
}

// --- Dedupe ---

// Mirrors Python `_dedupe_messages = list(dict.fromkeys(messages))`.
export function dedupeMessages(messages) {
  return Array.from(new Set(messages));
}

// --- Public orchestrator ---

// Mirrors Python `detect_technical_artifact_blockers(brandkit, technical_dir)`.
//
// Iteration order (must match Python exactly so the first blocker fires the
// same way on both sides):
//   1. If technical dir does not exist -> [].
//   2. Read homepage-pass-status.json. If status is "blocked" -> single
//      homepage-blocked entry, short-circuit.
//   3. If status is not completed-and-ready -> []. (Other partial states are
//      surfaced as warnings, not blockers.)
//   4. Append required-with-evidence blockers (assembly-diagnostics gaps).
//   5. Append product-card visible-text mirror-missing blockers.
//   6. If brandkit is NOT an empty-site fallback bundle, return deduped list.
//   7. Otherwise, append the false-fallback blocker iff page-signals,
//      button-styles, or run-notes show enough evidence to contradict the
//      "empty fallback" claim, then dedupe.
export function detectTechnicalArtifactBlockers(brandkit, technicalDir) {
  if (!isDirectory(technicalDir)) return [];

  const homepageStatus = readGateJson(path.join(technicalDir, "homepage-pass-status.json"));
  const blockers = [];
  if (homepageStatus !== null && !isPlainObject(homepageStatus)) {
    throw new TechnicalArtifactUnreadableError(
      `Blocker gate requires technical artifact ${path.join(technicalDir, "homepage-pass-status.json")} `
      + "to be a JSON object. A wrong-shaped status may conceal a blocked homepage.",
      { filePath: path.join(technicalDir, "homepage-pass-status.json") },
    );
  }

  if (homepageStatusIndicatesBlocked(homepageStatus)) {
    return [TECHNICAL_HOMEPAGE_BLOCKED_BLOCKER];
  }

  if (!statusCompletedAndReady(homepageStatus)) {
    return blockers;
  }

  // FAIL-CLOSED ON THE FILE, EVEN THOUGH NOTHING HERE READS ITS CONTENT.
  // `assembly-diagnostics.json` was a gate input only because the
  // required-with-evidence findings read it; moving those to warnings would
  // have moved this strict read with them and quietly turned "we could not
  // check" back into "we checked and it was fine" for the blocker gate. The
  // read stays, on purpose and by itself, so a corrupt or non-UTF-8 diagnostics
  // file still raises here exactly as it did -- that is row J9, which is on the
  // BLOCK list and does not move in this change.
  const diagnostics = readGateJson(path.join(technicalDir, "assembly-diagnostics.json"));
  if (diagnostics !== null && !isPlainObject(diagnostics)) {
    throw new TechnicalArtifactUnreadableError(
      `Blocker gate requires technical artifact ${path.join(technicalDir, "assembly-diagnostics.json")} `
      + "to be a JSON object. A wrong-shaped diagnostics artifact may conceal a blocker.",
      { filePath: path.join(technicalDir, "assembly-diagnostics.json") },
    );
  }

  // NOT PUSHED HERE ANY MORE. All four required-with-evidence findings say
  // "a confident candidate exists and the public field is empty", which
  // publishes NO value and therefore cannot publish a false one. Blocking on
  // them yields no kit at all, and a refused run under replace-only
  // persistence leaves the account with the previous site's kit or with
  // nothing. They are emitted as warnings by
  // `validateBrandkitAgainstTechnicalArtifacts`, in lockstep with the Python
  // twin, which is the fallback whenever the node subprocess produces no
  // verdict -- moving one side alone would restore the old blocking behaviour
  // on any run where node failed.

  // Note: the product-card visible-text mirror check (was a hard blocker via
  // `productCardVisibleTextMirrorMissing`) is now surfaced as a warning by
  // `validateBrandkitAgainstTechnicalArtifacts` in technical-artifact-warnings.js
  // (TECHNICAL_PRODUCT_CARD_CTA_BUTTON_WARNING / _TYPOGRAPHY_WARNING). The
  // condition was overstrict: when the agent omits the `product-card-cta`
  // mirror on `button[]`/`typography[]`, the compiler's existing
  // `select_product_card_cta_component` falls back to the primary button —
  // downstream is robust without forcing extraction to fail. The function is
  // kept exported so external callers (and parity tests) still see it.

  if (!looksLikeEmptySiteFallbackBundle(brandkit)) {
    return dedupeMessages(blockers);
  }

  const pageSignals = readGateJson(path.join(technicalDir, "page-signals.json"));
  const buttonRows = readGateJson(path.join(technicalDir, "button-styles.json"));
  const runNotes = readGateJson(path.join(technicalDir, "run-notes.json"));
  for (const [filename, value, valid] of [
    ["page-signals.json", pageSignals, isPlainObject(pageSignals)],
    ["button-styles.json", buttonRows, Array.isArray(buttonRows)],
    ["run-notes.json", runNotes, isPlainObject(runNotes)],
  ]) {
    if (value !== null && !valid) {
      throw new TechnicalArtifactUnreadableError(
        `Blocker gate requires technical artifact ${path.join(technicalDir, filename)} `
        + "to have its producer-defined JSON shape. A wrong-shaped artifact may conceal a blocker.",
        { filePath: path.join(technicalDir, filename) },
      );
    }
  }

  let hasPageSignalEvidence = false;
  if (isPlainObject(pageSignals)) {
    const socials = pageSignals.socials;
    const importantLinks = pageSignals.importantLinks;
    const visibleLanguageHints = pageSignals.visibleLanguageHints;
    const documentLanguageHints = pageSignals.documentLanguageHints;
    hasPageSignalEvidence =
      (Array.isArray(socials) && socials.length > 0) ||
      (Array.isArray(importantLinks) && importantLinks.length > 0) ||
      (Array.isArray(visibleLanguageHints) && visibleLanguageHints.length > 0) ||
      (Array.isArray(documentLanguageHints) && documentLanguageHints.length > 0);
  }

  const hasButtonEvidence = hasReusableVisibleTextButtonEvidence(buttonRows);
  const runNotesClaimFallback =
    isPlainObject(runNotes) && runNotes.assemblyMode === "fallback-with-empty-site-extraction-fields";

  if (hasPageSignalEvidence || hasButtonEvidence || runNotesClaimFallback) {
    blockers.push(TECHNICAL_FALSE_FALLBACK_BLOCKER);
  }
  return dedupeMessages(blockers);
}

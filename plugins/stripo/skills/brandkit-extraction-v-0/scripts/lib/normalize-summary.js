// The post-normalize VERIFICATION BLOCK (WP-A3).
//
// SKILL.md tells the agent to re-open `brandkit.extraction.json` after
// `--mode normalize` and check five per-array evidence conditions by hand
// ("Verification after normalize"). Measured on 9/9 runs: the agent does that
// re-read every time, and the check itself is a comparison between two files
// the run has just written. Both halves are mechanical, so the pass prints the
// verdict instead of asking for it in prose.
//
// `buildNormalizeSummary` is the pure builder. It does no I/O and computes no
// styling value: every count is a length, every predicate is the SKILL.md rule
// applied to `candidates`, and `errors` is carried verbatim.
//
// `ok` IS `diagnostics.schemaValidated`, NOT "we reached the end". The
// normalize pass sets `schemaValidated = true` only AFTER
// `brandkit.extraction.json` is on disk (see the publish-order comment in
// `normalize-pass.js` and `lib/normalize-publish-order.test.js`), so reading
// `ok` from it makes the printed verdict a claim about the ARTIFACT rather
// than about the control flow. A block saying `ok: true` while the publish
// failed would be exactly the defect that ordering exists to prevent.

import { writeStdoutJsonLine } from "./stdout-json.js";

// The confidence floor in the SKILL.md rule: "backgroundColors must be
// non-empty when candidates.canvas-background has any entry with
// confidence >= 0.3".
export const CANVAS_CANDIDATE_CONFIDENCE_FLOOR = 0.3;

// Strings in the block are truncated so one pathological repair message cannot
// make the block larger than the artifact it summarises.
export const MAX_STRING_CHARS = 400;
export const MAX_ERRORS = 20;
export const MAX_HIGH_SEVERITY = 20;

// The `_high` sections `buildDiagnosticsSummary` emits, without the suffix.
// Listed here so the block reports the same set the summary file carries.
const HIGH_SEVERITY_SECTIONS = [
  "layoutDiagnostics",
  "roleChoiceGaps",
  "typographyRoleCoverage",
  "textColorRoleCoverage",
  "productCardCtaContract",
  "homepagePassContract",
  "colorRoleHintDuplication",
  "linkColorBrandAlignment",
  "productCardCtaSelection",
  "productCardVariantDecision",
  "productCardTypographyMirrors",
];

function isObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function truncate(value) {
  if (typeof value !== "string") return value;
  return value.length > MAX_STRING_CHARS ? value.slice(0, MAX_STRING_CHARS) : value;
}

function lengthOf(value) {
  return Array.isArray(value) ? value.length : 0;
}

function candidateList(candidates, key) {
  const rows = isObject(candidates) ? candidates[key] : null;
  return Array.isArray(rows) ? rows : [];
}

// The five "Verification after normalize" predicates, as
// `<array>Expected` / `<array>Present` / `<array>Ok` triples plus the list of
// unmet ones. Six arrays, five rules — `accentColors` and `textColors` share
// the button-primary rule, exactly as SKILL.md states them.
//
// EXPECTED IS ABOUT THE EVIDENCE, PRESENT IS ABOUT THE ARTIFACT, and they are
// reported separately because only their DISAGREEMENT is actionable: an empty
// array with no candidate behind it is an honest gap, while an empty array
// with candidates behind it is the missed role-tagging step SKILL.md tells the
// agent to go back and fix.
export function evidenceConditions(payload, candidates) {
  const colors = payload?.brand?.colors || {};
  const components = payload?.brand?.components || {};
  const canvasSeeded = candidateList(candidates, "canvas-background").some(
    (entry) => typeof entry?.confidence === "number" && entry.confidence >= CANVAS_CANDIDATE_CONFIDENCE_FLOOR,
  );
  const buttonSeeded = candidateList(candidates, "button-primary").length > 0;
  const typographySeeded =
    candidateList(candidates, "body-typography").length > 0 || candidateList(candidates, "heading-typography").length > 0;
  const logosSeeded = candidateList(candidates, "logos").length > 0;

  const rows = [
    ["backgroundColors", canvasSeeded, lengthOf(colors.backgroundColors) > 0],
    ["accentColors", buttonSeeded, lengthOf(colors.accentColors) > 0],
    ["textColors", buttonSeeded, lengthOf(colors.textColors) > 0],
    ["typography", typographySeeded, lengthOf(payload?.brand?.typography) > 0],
    ["button", buttonSeeded, lengthOf(components.button) > 0],
    ["logos", logosSeeded, lengthOf(payload?.brand?.logos) > 0],
  ];
  const conditions = { unmet: [] };
  for (const [name, expected, present] of rows) {
    conditions[`${name}Expected`] = expected;
    conditions[`${name}Present`] = present;
    conditions[`${name}Ok`] = !expected || present;
    if (expected && !present) conditions.unmet.push(name);
  }
  return conditions;
}

function agentOwned(payload) {
  if (!isObject(payload)) return null;
  const contacts = isObject(payload.contacts) ? payload.contacts : {};
  const socials = isObject(payload.socials) ? payload.socials : {};
  return {
    organizationName: truncate(payload.brand?.organization?.name ?? null),
    logoUrls: (Array.isArray(payload.brand?.logos) ? payload.brand.logos : []).map((row) => truncate(row?.url ?? "")),
    contactsCount: {
      emails: lengthOf(contacts.emails),
      phones: lengthOf(contacts.phones),
      addresses: lengthOf(contacts.addresses),
    },
    socialsNonEmpty: Object.entries(socials)
      .filter(([, value]) => typeof value === "string" && value !== "")
      .map(([key]) => key),
    importantLinks: (Array.isArray(payload.importantLinks) ? payload.importantLinks : []).map((row) => truncate(row?.name ?? "")),
    languages: Array.isArray(payload.languages) ? payload.languages.map(truncate) : [],
  };
}

function productCardZero(payload) {
  const rows = payload?.brand?.components?.productCard;
  const card = Array.isArray(rows) ? rows[0] : null;
  if (!isObject(card)) return null;
  return {
    recommendedVariantIndex: card.recommendedVariantIndex ?? null,
    recommendedVariantReason: truncate(card.recommendedVariantReason ?? null),
    oldPricePosition: card.oldPricePosition ?? null,
    contentAlign: card.contentAlign ?? null,
    layoutIntent: card.cta?.layoutIntent ?? null,
    missingEvidence: Array.isArray(card.missingEvidence) ? card.missingEvidence.map(truncate) : [],
  };
}

// Every role-coverage entry the run could not stand behind. `no_evidence` is
// excluded for the reason `role-coverage-reasons.js` gives: an honest gap is a
// property of the page, the skill tells the agent not to act on it, and
// carrying it here would fill the block on most captures.
function unresolvedRoles(diagnostics) {
  const channels = [
    ["typography", diagnostics?.typographyRoleCoverage],
    ["textColor", diagnostics?.textColorRoleCoverage],
  ];
  const rows = [];
  for (const [channel, entries] of channels) {
    if (!Array.isArray(entries)) continue;
    for (const entry of entries) {
      if (!entry || !entry.reason || entry.reason === "no_evidence") continue;
      rows.push({ channel, role: truncate(entry.hint ?? null), reason: truncate(entry.reason) });
    }
  }
  return rows;
}

function highSeverity(diagnostics) {
  const rows = [];
  for (const section of HIGH_SEVERITY_SECTIONS) {
    const entries = diagnostics?.[section];
    if (!Array.isArray(entries)) continue;
    for (const entry of entries) {
      if (!entry || entry.severity !== "high") continue;
      rows.push({ section, path: truncate(entry.path ?? entry.hint ?? null), message: truncate(entry.message ?? null) });
      if (rows.length >= MAX_HIGH_SEVERITY) return rows;
    }
  }
  return rows;
}

function counts(payload) {
  if (!isObject(payload)) return null;
  const colors = payload.brand?.colors || {};
  const components = payload.brand?.components || {};
  return {
    backgroundColors: lengthOf(colors.backgroundColors),
    accentColors: lengthOf(colors.accentColors),
    textColors: lengthOf(colors.textColors),
    typography: lengthOf(payload.brand?.typography),
    button: lengthOf(components.button),
    productCard: lengthOf(components.productCard),
    logos: lengthOf(payload.brand?.logos),
  };
}

/**
 * Build the one-line normalize verification block.
 *
 * `diagnostics`, `payload` and `candidates` are the pass's own in-memory
 * objects — or `null` when the pass threw before building them, which is
 * exactly why every section here tolerates `null`. `error` is the Error about
 * to be rethrown, if any. No I/O; nothing is invented.
 */
export function buildNormalizeSummary({ diagnostics = null, payload = null, candidates = null, normalizeAttempt = null, error = null } = {}) {
  const errors = Array.isArray(diagnostics?.errors) ? diagnostics.errors.slice(0, MAX_ERRORS) : [];
  // The thrown message is the ONE string the agent cannot recover from any
  // artifact: several of normalize's throws carry their repair prose in the
  // Error alone. APPENDED to the recorded errors, never substituted for them.
  if (error) {
    errors.push({ path: "$", message: error instanceof Error ? error.message : String(error) });
  }
  return {
    mode: "normalize",
    ok: diagnostics?.schemaValidated === true,
    normalizeAttempt: normalizeAttempt ?? diagnostics?.normalizeAttempt ?? null,
    counts: counts(payload),
    agentOwned: agentOwned(payload),
    productCard0: productCardZero(payload),
    errors,
    unresolvedRoles: unresolvedRoles(diagnostics),
    highSeverity: highSeverity(diagnostics),
    evidenceConditions: evidenceConditions(payload, candidates),
  };
}

// The single stdout write. It lives beside the builder so "exactly one block
// per exit path" is a property of one call site rather than of each caller's
// care.
export function printNormalizeSummary(state) {
  writeStdoutJsonLine(buildNormalizeSummary(state));
}

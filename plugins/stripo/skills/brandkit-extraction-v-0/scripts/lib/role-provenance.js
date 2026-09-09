// Per-role provenance and confidence for the published Brand Kit.
//
// WHY IT EXISTS. The severity split lets a styling value through that this
// capture could not prove. That is the right trade only if the CONSUMER can
// tell such a value from a measured one -- otherwise the kit reads as
// uniformly authoritative and a soft heading font is indistinguishable from a
// measured one. `finalize-report.json` is the wrong carrier: its reader is a
// human auditing one run, while the consumer of the kit is the email-
// customization pipeline reading the stored document. So the map is PUBLISHED,
// on the artifact itself.
//
// PER ROLE, NOT PER ROW, and that is forced by the data: one typography record
// can carry several `usageHints` whose evidence standings differ, so a per-row
// field could not express the state it exists to describe.
//
// A PROJECTION, NOT A SECOND OPINION. Deterministically graded values delegate
// to the same value anchors the coverage gates use. Roles those gates do not
// cover are called measured only when their public carrier exactly equals a
// saved candidate from the corresponding probe. Bounded recovery is a third
// input: a run-bound exact DOM re-probe, or a fallback whose softness is
// explicit. Nothing here accepts a grade authored on the public payload.
//
// ASKING THE GRADER IS NOT OPTIONAL, and reading the gate's OUTPUT alone is
// what was wrong here: both gates emit NOTHING in their two cannot-tell states,
// so their silence is ambiguous between "measured" and "could not look". Only
// the grader distinguishes them. See `roleWasMeasured`.

import { UNRESOLVED_ROLE_REASONS } from "./role-coverage-reasons.js";
import {
  EVIDENCE_GRADED_PRODUCT_CARD_TYPOGRAPHY_HINTS,
  EVIDENCE_GRADED_TEXT_COLOR_HINTS,
  EVIDENCE_GRADED_TYPOGRAPHY_HINTS,
  EVIDENCE_PRESENT,
  productCardTypographyValueIsMirrorAnchored,
  textColorRoleEvidence,
  textColorValueIsCaptureAnchored,
  typographyRoleEvidence,
  typographyValueIsCaptureAnchored,
} from "./role-evidence.js";
import { productCardCtaButtonCarriersAreAnchored } from "./product-card-cta-mirrors.js";
import { recoveryProvenanceForRole } from "./agent-role-recovery.js";
import { backfillHeaderLinkFromScopedEvidence } from "./header-link-backfill.js";
import { resolveTextRoleCanvasHex } from "./text-role-canvas.js";
import { synthesizeRegionBgHints } from "./region-bg-hints.js";
import { synthesizeContentBgHint } from "./region-bg-content-hint.js";
import { synthesizeProductCardSurfaceBgHint } from "./product-card-surface-hint.js";

// The five grades, exactly. `agent-recovered` and `screenshot-sampled` are
// produced only by the structured, run-bound recovery path.
export const PROVENANCE_DOM_MEASURED = "dom-measured";
export const PROVENANCE_AGENT_RECOVERED = "agent-recovered";
export const PROVENANCE_SCREENSHOT_SAMPLED = "screenshot-sampled";
export const PROVENANCE_DEFAULTED = "defaulted";
export const PROVENANCE_MISSING = "missing";

// Mirrors `CANDIDATE_CONFIDENCE_FLOOR` in `technical-artifact-blockers.js` and
// its Python twin, so the two confidences on the artifact cannot be read on
// different scales.
//
// EVERY `defaulted` value gets it, with no exception. The alternative -- read
// the best confidence out of `candidates[hint]` -- was tried and is wrong at
// the root: a role is `defaulted` precisely BECAUSE the gate established the
// published value is not that candidate, so the candidate's number describes a
// value the artifact does not carry. There is no number to have here, and the
// floor is how this module says so rather than inventing one.
export const DEFAULTED_CONFIDENCE_FLOOR = 0.3;

function hintsOf(row) {
  return Array.isArray(row?.usageHints) ? row.usageHints.filter((h) => typeof h === "string") : [];
}

function rolesPresent(payload) {
  const present = new Set();
  const rows = [
    ...(Array.isArray(payload?.brand?.typography) ? payload.brand.typography : []),
    ...(Array.isArray(payload?.brand?.colors?.accentColors) ? payload.brand.colors.accentColors : []),
    ...(Array.isArray(payload?.brand?.colors?.backgroundColors) ? payload.brand.colors.backgroundColors : []),
    ...(Array.isArray(payload?.brand?.colors?.textColors) ? payload.brand.colors.textColors : []),
    ...(Array.isArray(payload?.brand?.components?.button) ? payload.brand.components.button : []),
  ];
  for (const row of rows) for (const hint of hintsOf(row)) present.add(hint);
  return present;
}

function rowsWithHint(rows, hint) {
  return (Array.isArray(rows) ? rows : []).filter((row) => hintsOf(row).includes(hint));
}

function roleHasEveryRequiredCarrier(payload, hint) {
  if (hint !== "product-card-cta") return true;
  return (
    rowsWithHint(payload?.brand?.typography, hint).length > 0 &&
    rowsWithHint(payload?.brand?.components?.button, hint).length > 0
  );
}

function normalizeHex(value) {
  const text = typeof value === "string" ? value.trim().toLowerCase() : "";
  return /^#[0-9a-f]{6}$/.test(text) ? text : null;
}

const BUTTON_CANDIDATE_FIELD = new Map([
  ["brand-primary-accent", "backgroundColor"],
  ["button-primary-background", "backgroundColor"],
  ["button-primary-text", "fontColor"],
]);

const BUTTON_ROW_FIELD = new Map([
  ["button-primary-background", "backgroundColor"],
  ["button-primary-text", "fontColor"],
]);

function deterministicBackgroundRoleWasMeasured(payload, hint, captureEvidence, colorRows) {
  if (!["header-background", "footer-background", "promo-surface-background", "content-background", "product-card-surface-background"].includes(hint)) {
    return false;
  }
  const runProducers = (includeCanvas) => {
    const seed = {
      brand: {
        colors: {
          backgroundColors: includeCanvas
            ? rowsWithHint(payload?.brand?.colors?.backgroundColors, "canvas-background")
              .map((row) => ({ value: row.value, usageHints: ["canvas-background"] }))
            : [],
        },
      },
    };
    synthesizeRegionBgHints(seed, captureEvidence?.backgroundStyles, []);
    synthesizeContentBgHint(seed, captureEvidence?.backgroundStyles, []);
    synthesizeProductCardSurfaceBgHint(seed, captureEvidence?.productRows, []);
    return new Set(
      rowsWithHint(seed.brand.colors.backgroundColors, hint)
        .map((row) => normalizeHex(row.value))
        .filter(Boolean),
    );
  };
  const directlyMeasured = runProducers(false);
  if (
    directlyMeasured.size > 0
    && colorRows.length > 0
    && colorRows.every((row) => directlyMeasured.has(normalizeHex(row.value)))
  ) {
    return true;
  }
  if (!["content-background", "product-card-surface-background"].includes(hint)) return false;
  if (!genericRoleWasMeasured(payload, "canvas-background", captureEvidence)) return false;
  const inheritedMeasured = runProducers(true);
  return inheritedMeasured.size > 0 && colorRows.length > 0
    && colorRows.every((row) => inheritedMeasured.has(normalizeHex(row.value)));
}

function genericRoleWasMeasured(payload, hint, captureEvidence) {
  const candidates = captureEvidence?.candidates;
  const colors = payload?.brand?.colors || {};
  const colorRows = [
    ...rowsWithHint(colors.accentColors, hint),
    ...rowsWithHint(colors.backgroundColors, hint),
    ...rowsWithHint(colors.textColors, hint),
  ];
  const buttonRows = rowsWithHint(payload?.brand?.components?.button, hint);
  if (colorRows.length + buttonRows.length === 0) return false;

  if (["header-link", "footer-link"].includes(hint)) {
    // Reproduce from measured rows, never from the claimed role itself. A
    // canvas tiebreak is an inference, not measurement of the region's band.
    const seed = { brand: { colors: { textColors: [], backgroundColors: [] } } };
    synthesizeRegionBgHints(seed, captureEvidence?.backgroundStyles, []);
    const backgroundHint = hint.replace("-link", "-background");
    if (rowsWithHint(seed.brand.colors.backgroundColors, backgroundHint).length === 0) return false;
    backfillHeaderLinkFromScopedEvidence(seed, captureEvidence?.textStyles, [], captureEvidence?.backgroundStyles);
    const measured = new Set(rowsWithHint(seed.brand.colors.textColors, hint).map(row => normalizeHex(row.value)));
    return colorRows.length > 0 && colorRows.every(row => measured.has(normalizeHex(row.value)));
  }

  if (deterministicBackgroundRoleWasMeasured(payload, hint, captureEvidence, colorRows)) return true;

  const roleCandidates = new Set(
    (Array.isArray(candidates?.[hint]) ? candidates[hint] : [])
      .map((candidate) => normalizeHex(candidate?.value))
      .filter(Boolean),
  );
  if (buttonRows.length === 0 && roleCandidates.size > 0 && colorRows.length > 0) {
    return colorRows.every((row) => roleCandidates.has(normalizeHex(row.value)));
  }

  const candidateField = BUTTON_CANDIDATE_FIELD.get(hint);
  if (!candidateField) return false;
  const measured = new Set(
    (Array.isArray(candidates?.["button-primary"]) ? candidates["button-primary"] : [])
      .map((candidate) => normalizeHex(candidate?.value?.[candidateField]))
      .filter(Boolean),
  );
  if (measured.size === 0) return false;
  if (!colorRows.every((row) => measured.has(normalizeHex(row.value)))) return false;
  const buttonField = BUTTON_ROW_FIELD.get(hint);
  if (buttonRows.length > 0 && !buttonField) return false;
  return buttonRows.every((row) => measured.has(normalizeHex(row[buttonField])));
}

// DID ANYTHING ACTUALLY MEASURE THIS ROLE ON THIS CAPTURE?
//
// WHY THIS EXISTS, and it is the whole correctness argument for the map. The
// absence of an unresolved coverage entry is NOT proof of measurement, because
// both gates deliberately emit NOTHING when they cannot tell:
//
//   * `CAPTURE_UNUSABLE` -- `text-styles.json` is empty or absent, so no probe
//     row exists to anchor anything against. Reproduced on a saved capture
//     whose `text-styles.json` is `[]`: the four productCard roles published as
//     `dom-measured / 1.0` on a run with ZERO typography measurements, and
//     overwriting them with a fabricated family/weight/size changed neither the
//     exit code nor the grade.
//   * `EVIDENCE_UNPROVEN` -- no `text-styles.probed.json`, or its list omits
//     one of the role's source selectors, so the run cannot say whether the
//     probe ever LOOKED. `typography-role-coverage.js` states it directly:
//     "UNPROVEN and CAPTURE_UNUSABLE stay outside both branches ... both mean
//     the run cannot tell."
//
// A gate that stays silent on "cannot tell" is right to -- refusing there would
// refuse legitimate kits. But reading that silence as "measured" inverts it,
// and publishes the softest state in the run wearing the hardest grade. The
// grade that carries the softness (`defaulted`) was emitted 0 times across 759
// published artifacts before this predicate existed.
//
// DELEGATION, not a private reimplementation: the two graders asked here are
// the ones the two coverage gates ask, with the same four arguments, so this
// cannot answer a different question than the gate that produced the entries.
//
// THE PRODUCTCARD EXTRA CONDITION. `typographyRoleEvidence` returns
// `EVIDENCE_PRESENT` for any hint OUTSIDE `EVIDENCE_GRADED_TYPOGRAPHY_HINTS`
// without reading a single row (`role-evidence.js`), so the four productCard
// mirrors reach `EVIDENCE_PRESENT` on any usable capture. Their gate arm is
// additionally fenced by `productRows.length > 0` -- no
// `product-card-styles.json` means the mirror anchor could not be asked -- so
// the grade has to carry that fence too or it claims measurement the gate
// declined to check.
//
// FAIL-SOFT ON MISSING INPUTS. `captureEvidence` absent degrades every role to
// `defaulted`, never to `dom-measured`: a caller that cannot supply the capture
// has not measured anything, and the one grade this function must never invent
// is the confident one.
export function roleWasMeasured(hint, captureEvidence, payload = null) {
  const { textStyles = null, probedSelectors = null, salientRows = null, productRows = null } =
    captureEvidence && typeof captureEvidence === "object" ? captureEvidence : {};
  if (EVIDENCE_GRADED_TEXT_COLOR_HINTS.includes(hint)) {
    const canvasHex = resolveTextRoleCanvasHex(payload, captureEvidence?.backgroundStyles);
    if (textColorRoleEvidence(textStyles, hint, probedSelectors, salientRows, canvasHex) !== EVIDENCE_PRESENT) {
      return false;
    }
    const carriers = rowsWithHint(payload?.brand?.colors?.textColors, hint);
    return carriers.length > 0 && carriers.every((row) => textColorValueIsCaptureAnchored(textStyles, hint, row));
  }
  if (EVIDENCE_GRADED_PRODUCT_CARD_TYPOGRAPHY_HINTS.includes(hint)) {
    if (typographyRoleEvidence(textStyles, hint, probedSelectors, salientRows) !== EVIDENCE_PRESENT) {
      return false;
    }
    const carriers = rowsWithHint(payload?.brand?.typography, hint);
    return (
      carriers.length > 0 &&
      Array.isArray(productRows) &&
      productRows.length > 0 &&
      carriers.every((row) => productCardTypographyValueIsMirrorAnchored(productRows, textStyles, hint, row)) &&
      (hint !== "product-card-cta" || productCardCtaButtonCarriersAreAnchored(payload))
    );
  }
  if (EVIDENCE_GRADED_TYPOGRAPHY_HINTS.includes(hint)) {
    if (typographyRoleEvidence(textStyles, hint, probedSelectors, salientRows) !== EVIDENCE_PRESENT) {
      return false;
    }
    const carriers = rowsWithHint(payload?.brand?.typography, hint);
    return carriers.length > 0 && carriers.every((row) => typographyValueIsCaptureAnchored(textStyles, hint, row));
  }
  return genericRoleWasMeasured(payload, hint, captureEvidence);
}

// `roleProvenance` for one payload.
//
// `roles` supplies the required roles that must still appear as `missing` when
// absent. Every styling hint actually published by the payload is unioned into
// that list, so accents, backgrounds, buttons and canvas hints are never left
// ungraded.
//
// `captureEvidence` is `{textStyles, probedSelectors, salientRows, productRows}`
// -- the same four capture artifacts the two gates were handed, so the grade is
// a projection of their inputs rather than a second reading of the capture.
export function buildRoleProvenance(
  payload,
  coverageEntries,
  roles,
  captureEvidence,
  recoveryEvidence = null,
  provenanceDiagnostics = null,
) {
  const present = rolesPresent(payload);
  const unresolved = new Map();
  for (const entry of Array.isArray(coverageEntries) ? coverageEntries : []) {
    if (!entry || typeof entry.hint !== "string") continue;
    if (!UNRESOLVED_ROLE_REASONS.includes(entry.reason)) continue;
    // First entry wins: two entries for one role are two carriers of the same
    // finding, and the grade is a property of the role, not of the row.
    if (!unresolved.has(entry.hint)) unresolved.set(entry.hint, entry);
  }

  const allRoles = [...new Set([...(Array.isArray(roles) ? roles : []), ...present])];
  const map = {};
  for (const hint of allRoles) {
    if (!present.has(hint)) {
      // ABSENT BEATS EVERYTHING. A role no row carries has no value to grade,
      // whatever the coverage array says about why it is absent.
      map[hint] = { provenance: PROVENANCE_MISSING, confidence: 0 };
      continue;
    }
    if (!roleHasEveryRequiredCarrier(payload, hint)) {
      // `product-card-cta` is shared by the typography and component mirror
      // contracts. A role-level positive grade would overclaim the whole role
      // when either carrier is missing, even if the surviving carrier is an
      // exact deterministic measurement.
      map[hint] = { provenance: PROVENANCE_DEFAULTED, confidence: DEFAULTED_CONFIDENCE_FLOOR };
      if (Array.isArray(provenanceDiagnostics)) {
        provenanceDiagnostics.push({
          severity: "warn",
          reason: "compound-role-carrier-missing",
          role: hint,
          message: `The ${hint} role is only partially published: both typography and button component carriers are required before the role can earn a measured or recovered grade.`,
        });
      }
      continue;
    }
    const recovered = recoveryProvenanceForRole(payload, hint, recoveryEvidence);
    if (recovered && recovered.provenance !== PROVENANCE_AGENT_RECOVERED) {
      // A screenshot sample or explicit typography fallback remains soft even
      // when its value happens to equal another captured row. Equality cannot
      // turn agent-selected semantic attribution into a deterministic one.
      map[hint] = recovered;
      if (Array.isArray(provenanceDiagnostics)) {
        provenanceDiagnostics.push({
          severity: "warn",
          reason: recovered.provenance,
          role: hint,
          message: `The ${recoveryEvidence.byRole.get(hint)?.property || "styling"} carrier for ${hint} uses a provenance-labelled fallback because the exact DOM re-probe failed.`,
        });
      }
      continue;
    }
    if (roleWasMeasured(hint, captureEvidence, payload)) {
      // Current deterministic evidence is always the highest authority. A
      // recovery marker from an earlier pass cannot demote a carrier that the
      // present capture now anchors exactly.
      map[hint] = { provenance: PROVENANCE_DOM_MEASURED, confidence: 1 };
      continue;
    }
    if (recovered) {
      map[hint] = recovered;
      if (Array.isArray(provenanceDiagnostics)) {
        provenanceDiagnostics.push({
          severity: recovered.provenance === PROVENANCE_AGENT_RECOVERED ? "info" : "warn",
          reason: recovered.provenance,
          role: hint,
          message:
            recovered.provenance === PROVENANCE_AGENT_RECOVERED
              ? `The ${recoveryEvidence.byRole.get(hint)?.property || "styling"} carrier for ${hint} was filled from an exact DOM re-probe of the agent-selected locator; other carrier contracts are graded separately.`
              : recovered.provenance === PROVENANCE_SCREENSHOT_SAMPLED
                ? `The colour carrier for ${hint} uses a screenshot sample only after its exact DOM re-probe failed; other carrier contracts are graded separately.`
                : `The typography carrier for ${hint} uses an explicit default only after its exact DOM re-probe failed; it is not claimed as pixel- or DOM-measured.`,
        });
      }
      continue;
    }
    if (recoveryEvidence?.byRole instanceof Map && recoveryEvidence.byRole.has(hint) && Array.isArray(provenanceDiagnostics)) {
      provenanceDiagnostics.push({
        severity: "warn",
        reason: "recovery-value-mismatch",
        role: hint,
        message: `Recovery evidence for ${hint} does not exactly equal every published carrier value and earned no provenance grade.`,
      });
    }
    if (unresolved.has(hint)) {
      // THE FLOOR, NEVER A CANDIDATE'S NUMBER. This used to publish the best
      // confidence in `candidates[hint]`, and that number is about a DIFFERENT
      // value: both unresolved reasons mean the gate has already established
      // the published value is not that candidate -- `authored_without_evidence`
      // fires because `typographyHintIsValueAnchored` was false,
      // `value_not_measured` because the capture anchor failed. Measured: an
      // authored `PhantomDisplay, serif / 700 / 38` published as
      // `{defaulted, 1}`, where the 1 describes `RealSans 700/32`. The schema
      // tells consumers `defaulted` means "treat it as overridable"; a high
      // number beside it invites the opposite. The module's own goal -- do not
      // invent a number -- is better served by the floor than by borrowing one
      // about something else.
      map[hint] = { provenance: PROVENANCE_DEFAULTED, confidence: DEFAULTED_CONFIDENCE_FLOOR };
      continue;
    }
    if (!roleWasMeasured(hint, captureEvidence, payload)) {
      // The gate said nothing about this role because it COULD NOT SAY
      // anything -- see `roleWasMeasured`. Silence from a gate that cannot tell
      // is the softest state in the run, not the hardest, so it is graded
      // exactly like a value the gate named: `defaulted`, at the floor. There
      // is no candidate to borrow a number from here, and inventing one would
      // put a confidence on the artifact that describes nothing.
      map[hint] = { provenance: PROVENANCE_DEFAULTED, confidence: DEFAULTED_CONFIDENCE_FLOOR };
      continue;
    }
    map[hint] = { provenance: PROVENANCE_DEFAULTED, confidence: DEFAULTED_CONFIDENCE_FLOOR };
  }
  return map;
}

// Heading-typography auto-apply from the single unsplit salient candidate.
//
// WHY IT EXISTS. `salientTypographyCandidates` (assemble-candidates.js) exists
// because tag choice decides whether a row EXISTS: a visual heading that is a
// `div`/`span` is never recorded by the selector probe, so the selector lane
// ranks nothing and `typographyRoleCoverage` grades `heading-typography` an
// honest gap. SKILL.md's bounded exception then licenses the agent to copy the
// published salient candidate onto a row verbatim. MEASURED on the 50-dir
// replay corpus: `heading-typography` is a gap on 6 dirs, 3 of them publish a
// salient candidate for it, and the composed kit carried the role on ZERO of
// the 3. The licence is never exercised, so the role ships missing and the
// email builder falls through to its reference template's font.
//
// So the copy is done here instead, deterministically, which is the owner's
// producer-side rule: the agent demonstrably does not execute prose.
//
// SCOPE IS ONE ROLE, AND THAT IS EVIDENCE-LED, not caution. The same sweep
// found `body-typography` gapped on 3 dirs with a salient candidate on 2 --
// and on one of those the salient body row is the page's DISPLAY face at
// 400/20 while the real body face is a different family entirely. The body
// lane is a coin flip on the measured population, so it stays a gap.
//
// EXACTLY ONE UNSPLIT CANDIDATE, and that term is the whole safety argument.
// `salientConfidence` divides the cap across every emitted candidate: two
// admissible rows publish two entries at 0.38 each, which is the capture
// saying "there are two readings and nothing recorded separates them". Copying
// either would state a certainty the run does not hold. One entry at the full
// cap is the only shape where the capture's own ranking is unambiguous.
//
// WHAT IT DOES NOT DO. It never overwrites: a role any row already carries is
// left alone, whoever produced it. It never fires where a selector DID resolve
// the role -- there the salient lane's own entry is explicitly not licensed
// (`gateWouldRefuseIt`), and copying it earns `value_not_measured`. And it
// asks the SAME grader the coverage gate asks, with the same four arguments,
// so it cannot answer a different question than the gate that would grade the
// appended row (the delegation rule stated in `lib/role-evidence.js`).
//
// THE APPENDED ROW MUST SURVIVE THE GATE ON ITS OWN. Nothing here edits a
// gate: `typographyHintIsValueAnchored` -> `typographyValueIsPublishedCandidate`
// compares `(family, weight, sizePx)` against the published candidate, and the
// row copies those three from that candidate verbatim, so the existing
// absence-branch anchor accepts it. That is also why this runs BEFORE
// `typographyRoleCoverageDiagnostics` in `normalize-pass.js` -- the gate grades
// the payload the pass publishes, appended row included, rather than the row
// being smuggled past a grade that already ran.
//
// PROVENANCE IS `defaulted`, AND IT IS NOT STAMPED HERE. `buildRoleProvenance`
// grades the role by asking `roleWasMeasured`, which returns false while
// `typographyRoleEvidence` is anything but `EVIDENCE_PRESENT` -- exactly the
// state this module fires in. So the role lands on `{provenance: "defaulted",
// confidence: 0.3}` (`DEFAULTED_CONFIDENCE_FLOOR`) through the existing
// projection, which is the grade `agent-role-recovery.js` gives its own
// `typography-default` fallback. A stamp written here would be a second
// opinion about a value the projection already grades.
//
// THE SECONDARY FIELDS ARE THE RECOVERY DEFAULT'S, NOT THE PAGE'S. The
// published candidate carries `(fontFamily, fontWeight, fontSizePx,
// lineHeightPx, color)` and nothing else, while the schema requires
// `fontStyle` and `textTransform` on every typography record. They are filled
// the way `agent-role-recovery.js`'s `typography-default` fills them --
// `letterSpacingPx: null`, `fontStyle: "normal"`, `textTransform: "none"` --
// because those are the fields the value anchor does not bind and the run has
// no published measurement for. Reading them off `salient-text.json` instead
// would put a value on the row that no candidate published, which is the
// authored-hint shape this whole lane exists to refuse.

import {
  selectorEvidenceIsAbsent,
  typographyRoleEvidence,
} from "./role-evidence.js";
import { SALIENT_CANDIDATE_SOURCE } from "./salient-text.js";

// The roles this lane may fill, and it has exactly one member. The obvious
// second member -- `body-typography` -- is the one the corpus rejected; see the
// header. Kept as a list so the restriction is one editable line and a test
// that a second member breaks is a real test rather than a reading of the
// source.
export const SALIENT_AUTO_APPLY_HINTS = Object.freeze(["heading-typography"]);

export const SALIENT_AUTO_APPLIED_ACTION = "salient-auto-applied";

// `UNCORROBORATED_CONFIDENCE_CAP / 1` -- the confidence `salientConfidence`
// emits when the lane publishes exactly ONE candidate for a role. Kept as a
// local mirror because the producer's constant is module-private to
// `assemble-candidates.js`; `salient-heading-autoapply.test.js` pins the two
// together by running the real producer over a one-row fixture, so a change to
// either side fails a test rather than silently disabling this rule.
export const SALIENT_UNSPLIT_CONFIDENCE = 0.75;

function usageHintsOf(record) {
  return Array.isArray(record?.usageHints)
    ? record.usageHints.filter((hint) => typeof hint === "string")
    : [];
}

function hintIsPresent(typography, hint) {
  return typography.some((record) => usageHintsOf(record).includes(hint));
}

// The single admissible candidate, or null. `null` for every other shape:
// no array, no salient-sourced entry, two or more of them, a split
// confidence, or a value whose three anchored fields are not the types
// `typographyValueIsPublishedCandidate` compares.
function unsplitSalientCandidate(candidates, hint) {
  const entries = Array.isArray(candidates?.[hint]) ? candidates[hint] : [];
  const salient = entries.filter(
    (entry) => entry && typeof entry === "object" && entry.source === SALIENT_CANDIDATE_SOURCE,
  );
  if (salient.length !== 1) return null;
  const entry = salient[0];
  if (entry.confidence !== SALIENT_UNSPLIT_CONFIDENCE) return null;
  const value = entry.value;
  if (!value || typeof value !== "object") return null;
  if (typeof value.fontFamily !== "string" || value.fontFamily.trim() === "") return null;
  if (!Number.isFinite(value.fontWeight) || !Number.isFinite(value.fontSizePx)) return null;
  return entry;
}

// Mutates `payload.brand.typography` in place; returns true when a row was
// appended. Idempotent: a second pass over its own output finds the hint
// present and does nothing. Safe with missing / empty / malformed inputs --
// no-ops without throwing, mirroring `synthesizeRegionBgHints`.
export function applySalientHeadingTypography(
  payload,
  { candidates = null, textStyles = null, probedSelectors = null, salientRows = null } = {},
  diagnostics = [],
) {
  const typography = payload?.brand?.typography;
  if (!Array.isArray(typography)) return false;
  let applied = false;
  for (const hint of SALIENT_AUTO_APPLY_HINTS) {
    if (hintIsPresent(typography, hint)) continue;
    if (!selectorEvidenceIsAbsent(typographyRoleEvidence(textStyles, hint, probedSelectors, salientRows))) {
      continue;
    }
    const candidate = unsplitSalientCandidate(candidates, hint);
    if (!candidate) continue;

    const value = candidate.value;
    const record = {
      family: value.fontFamily,
      weight: value.fontWeight,
      sizePx: value.fontSizePx,
      lineHeightPx: Number.isFinite(value.lineHeightPx) ? value.lineHeightPx : null,
      letterSpacingPx: null,
      fontStyle: "normal",
      textTransform: "none",
      usageHints: [hint],
      description:
        "Auto-applied from the single unsplit salient-text candidate this run published for " +
        hint +
        "; no selector produced this role.",
    };
    const index = typography.length;
    typography.push(record);
    applied = true;
    if (Array.isArray(diagnostics)) {
      diagnostics.push({
        severity: "info",
        path: `$.brand.typography[${index}]`,
        action: SALIENT_AUTO_APPLIED_ACTION,
        hint,
        value: {
          family: record.family,
          weight: record.weight,
          sizePx: record.sizePx,
          lineHeightPx: record.lineHeightPx,
        },
        confidence: candidate.confidence,
      });
    }
  }
  return applied;
}

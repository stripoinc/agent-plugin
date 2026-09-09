// Finalize-time re-check of the two role-coverage PROVENANCE gates.
//
// THE HOLE. `--mode normalize` binds its gates to `brandkit.extraction.json`
// only at the instant it runs, and nothing downstream re-asks the question:
// finalize re-validates the extraction against
// `extraction-stage.schema.json` (`brandkit_finalize/__main__.py` ->
// `validation.py#validate_extraction_stage_file`), which is a SHAPE gate, and
// `role_coverage_gap_warnings`, which only re-reads what a past normalize
// recorded. So the shortest fabrication path is: run a clean normalize, edit a
// typography record or a textColors hex with `jq`, do NOT re-normalize, and
// finalize composes and promotes it with `blockers: []`.
//
// AND MTIME IS NOT THE ANSWER, THOUGH IT IS NO LONGER USELESS. This header
// used to claim the pass wrote `assembly-diagnostics.json` FIRST and the
// artifact LAST, so "mtime cannot tell a clean run from an edited one". That
// was true of `29a5c46` and stopped being true at `1065530`, which reordered
// the tail of `runNormalize` to publish first and record second. Under the
// current order a clean pass always leaves `mtime(artifact) <=
// mtime(diagnostics)` -- measured on a real scaffold + normalize, the two
// writes landing 0.45 ms apart in that order -- and a `jq` edit afterwards does
// invert it. Why this module still does not read it is in the alternatives
// below.
//
// WHAT THIS MODULE DOES. It re-runs `typographyRoleCoverageDiagnostics` and
// `textColorRoleCoverageDiagnostics` against the artifact ON DISK and the
// capture artifacts beside it, and warns on the two entries that mean a value
// in THIS kit was authored. They remain publishable styling findings:
//
//   - `authored_without_evidence` — the role is on a row and the capture holds
//     no element any deterministic producer could have derived it from.
//   - `value_not_measured`        — the role is derivable here, and the value on
//     a row carrying it is not one the capture measured.
//
// WHAT IT DELIBERATELY DOES NOT DO. It never blocks on a missing-role
// `severity: "high"` entry. Those are advisory by the owner's standing
// position — a less precise kit beats a failed one, and `role_coverage_gaps`'
// own docstring says filing a gap as a blocker "would defeat at the consumer
// exactly what the gate change achieves upstream". Missing and authored share
// `severity` and nothing else; the filter here is on `reason`, never severity.
//
// WHY THE NODE BRIDGE. `validate-skill-output.js` is already invoked as a
// subprocess by the finalize CLI and its `blockers[]` already become real
// finalize blockers (exit 4, before promotion). Re-running the real producers
// through it reuses the delegation rule `role-evidence.js` states in its own
// header, and picks up any gate later added to those two modules for free. A
// Python port would reimplement a producer and drift silently; a
// `schemaValidated !== true` check alone misses the edit-after-successful-
// normalize path entirely (it is retained below as a cheap consistency guard,
// never as a substitute); a gate-input digest introduces a JS/Python projection
// to keep in step forever and cannot see an edit to `text-styles.json`.
//
// AND NOT AN MTIME COMPARISON, for two reasons, neither of them "it cannot
// work". Since `1065530` it can: a clean pass leaves `mtime(artifact) <=
// mtime(diagnostics)` and a post-normalize edit inverts that, both measured.
// (1) It is REDUNDANT where this module has an opinion. The predicates below
// re-run against the artifact as it stands on disk, which answers the stronger
// question -- is this value one the capture supports -- without caring when the
// bytes changed. An mtime skew the predicates then accept is an edit that
// changed nothing either gate can name, and blocking a finalize on it would
// mean refusing for a reason this module cannot state. (2) It is ERASED BY ONE
// COMMAND. `touch -r assembly-diagnostics.json brandkit.extraction.json`
// restores the ordering with the edit still in place; measured, the same way
// `jq 'del(.roleCoverageGateVersion)'` turns this module off, and the same
// paragraph below covers both. So mtime would add no reach against the
// accidental case and none against the deliberate one. What it WOULD catch is
// an edit outside these two gates' scope -- a logo URL, a product row -- and
// that check, if it is wanted, belongs to whoever owns the whole artifact, not
// to a module named for role-coverage provenance.
//
// WHAT THIS DEFENDS AGAINST, STATED HONESTLY. Accidental drift and careless
// post-normalize editing: an artifact edited after a clean pass, a value nudged
// by hand, a role tagged onto a row nothing measured. NOT a run that sets out
// to circumvent it. The marker and the `roleChoiceJustifications` sidecar both
// live in `assembly-diagnostics.json`, which the run may write, so
// `jq 'del(.roleCoverageGateVersion)'` turns this module off. That is not a
// hole this module can close -- every gate input is a local file the run can
// write, and a check cannot defend against a process that deletes it. It is a
// consistency gate, and any claim that it makes fabrication impossible is
// wrong.
//
// WHY THE MARKER IS MANDATORY. Replaying today's predicates against the saved
// agent-finished `brandkit.extraction.json` corpus (~May 2026 producers, before
// these gates existed) refuses a majority of it. That is producer drift, not a
// fabrication rate — but it is the exact blast radius of an ungated check, and
// re-finalizing an older technical dir is a supported case. So the coverage
// predicates run ONLY when `assembly-diagnostics.json` carries
// `roleCoverageGateVersion === ROLE_COVERAGE_GATE_VERSION`, a field the
// normalize pass in THIS tree writes. A markerless legacy dir with no
// `roleProvenance` finalizes exactly as it did before this feature. In repair
// mode, a markerless payload that does carry that new map has it stripped and
// warns: an unverifiable positive grade must not publish merely because the
// stamp that could support it is absent. Bump the version whenever a change to
// either predicate could refuse an artifact the previous normalize accepted;
// rollback is "stop writing the marker in normalize".
//
// AND THE MARKER RIDES ON SUCCESS ALONE. `runNormalize` writes it at exactly
// ONE site -- the tail, next to `diagnostics.schemaValidated = true` and the
// write that publishes the artifact. Every other `writeDiagnostics` call in
// that pass is a failure path that then throws, and the file it leaves is
// wholesale (never merged), so a failed normalize also CLEARS the marker an
// earlier successful one wrote. That is not an implementation detail; it is
// what makes the "never blocks a missing role" promise above true in
// production. This module briefly had the opposite: the marker was written on
// the failure paths too, so that a stale artifact could not finalize
// unchecked. The cost was measured -- 409 of the 767 saved captures refuse a
// replay of their own untouched scaffolder draft, EVERY one of them for a
// missing role and not one for a provenance reason, and all 409 were
// hard-blocked here by ROLE_COVERAGE_STALE_ARTIFACT_BLOCKER. Blocking that
// category is exactly what the header two paragraphs up promises never to do,
// so the marker came off the failure paths. The residue is stated rather than
// hidden: a dir whose LAST normalize failed carries no marker, so an artifact
// edited after an earlier clean pass finalizes unchecked if a later pass then
// fails for an unrelated reason. That is the pre-existing behaviour of every
// build before this module, and it is the price of the promise.

import path from "node:path";

import { buildCandidates } from "../assemble-candidates.js";
import { resolveEffectiveButtonStyles } from "./button-styles-fallback.js";
import { readJson, readMtimeMs, writeJson } from "./extraction-pass-helpers.js";
import { loadLogoSvgPathFiles, logoSvgFillsFromPaths } from "./load-logo-svg-paths.js";
import { probedSelectorsPathFor, readProbedSelectors } from "./probed-selectors.js";
import {
  EVIDENCE_GRADED_PRODUCT_CARD_TYPOGRAPHY_HINTS,
  EVIDENCE_GRADED_TYPOGRAPHY_HINTS,
  isAuthoredWithoutEvidence,
  isValueNotMeasured,
} from "./role-evidence.js";
import { readSalientRows } from "./salient-text.js";
import {
  bindTextColorJustification,
  REQUIRED_TEXT_COLOR_ROLE_HINTS,
  textColorRoleCoverageDiagnostics,
} from "./text-color-role-coverage.js";
import { typographyRoleCoverageDiagnostics } from "./typography-role-coverage.js";
import { resolveTextRoleCanvasHex } from "./text-role-canvas.js";
import { buildRoleProvenance } from "./role-provenance.js";
import { loadAgentRoleRecovery, recoveryProvenanceForRole } from "./agent-role-recovery.js";

// The marker field the normalize pass writes into `assembly-diagnostics.json`,
// and the only value this build's re-check will act on.
export const ROLE_COVERAGE_GATE_FIELD = "roleCoverageGateVersion";
// The digest of the colour-gate justification the stamping normalize pass
// HONOURED, AND OF THE DEVIATIONS IT HONOURED IT FOR, written beside the marker
// on the same success write and read here to tell that sentence from one added
// afterwards. Written only when the pass actually acted on one, so its absence
// on a marker-carrying dir means "that pass honoured no justification" -- which
// covers both "no sentence was recorded" and "a sentence was recorded and
// excused nothing". The second state used to stamp, and a stamp for a sentence
// nothing depended on is standing authority for a fabrication that has not
// happened yet. See `bindTextColorJustification`.
export const ROLE_COVERAGE_JUSTIFICATION_DIGEST_FIELD = "roleCoverageJustificationDigest";
// 4, not 3, per the bump rule stated above. Version 1 was the marker as first
// written. `d4311fc` then narrowed `typographyValueIsCaptureAnchored` -- a
// record's `family` STRING must be one the capture spells, not merely one of
// its canonical class -- and `29a5c46` moved the productCard half of that same
// comparison off the payload being judged and onto `product-card-styles.json`;
// that pair was version 2. Version 3 narrowed the same predicate again: the
// productCard arm admitted a card's `family` only at the
// `(weight, sizePx, lineHeightPx)` the mirror producer writes it with.
// Version 4 DELETES that arm. Three narrowings failed to model the producer
// because it cannot be modelled from what the predicate is given -- the
// canonical-family merge picks its winner from `payload.brand.typography`,
// peers the gate does not hold and must not read off the artifact under
// judgement. Each step narrows a gated predicate, so a dir an earlier normalize
// accepted could be refused by this re-check, which is precisely the condition
// the rule names.
// Version 5 BINDS THE COLOUR ESCAPE to the pass that honoured it. Until then
// this module re-ran the colour gate with the `assembly-diagnostics.json` that
// happened to be on disk at finalize time, so a `roleChoiceJustifications`
// sentence added after a clean normalize was honoured by a pass that never saw
// it -- reproduced through the real finalize CLI, exit 4 with 2 blockers
// becoming exit 0 and promoted on one hand-added sentence. A version-4 dir
// carries no digest, so under version 5's rule its recorded justification would
// not be honoured and an artifact the previous normalize accepted could be
// refused: the bump rule's exact trigger, and the bump is what keeps those dirs
// finalizing as they do today rather than being refused for a stamp their
// normalize could not have written.
// Version 6 BINDS THE STAMP TO THE DEVIATION IT EXCUSED. Version 5 digested the
// justification TEXT alone, so a version-5 dir's stamp was computed over a
// different input than version 6 computes: under version 6's rule that stamp
// does not bind, the recorded sentence is stripped, and an artifact the
// previous normalize accepted could be refused. That is the bump rule's exact
// trigger, and the bump is what keeps those dirs finalizing as they do today
// rather than being refused for a stamp their normalize could not have written.
// Version 7 binds the technical roleProvenance map to the capture, recovery
// evidence and carrier values that normalize would grade now. A version-6 dir
// has no such integrity claim, so applying the new comparison to it could
// refuse an artifact its stamping normalize accepted; that is exactly the
// bump rule above.
// THE SEVERITY SPLIT DOES NOT BUMP THIS, and the question is worth answering in
// writing because the split changes something the bump rule does not mention.
//
// The rule's trigger is "a change to either predicate could refuse an artifact
// the previous normalize accepted". Neither predicate moved: the split changes
// SEVERITY, and `provenanceRefusals` has never consulted severity. What DID
// change is the marked population -- a normalize that used to throw on a
// missing role or an unmeasured value now completes, so it stamps the marker
// and its dir becomes one this module judges. Judging MORE dirs is not the
// rule's trigger on its own; refusing one is. And a newly-marked dir cannot be
// refused here: the provenance findings return in `warnings`, and the one
// blocker left needs `schemaValidated !== true`, which a dir stamped by a
// successful pass never has -- the marker and the flag are written at the same
// statement.
//
// The other direction is safe too. A dir stamped by the PREVIOUS build carries
// the same version, so this build re-checks it with unchanged predicates and
// routes the same findings to `warnings`. Strictly less refusal, on every dir.
export const ROLE_COVERAGE_GATE_VERSION = 7;

// KEPT, AND NO LONGER PRODUCED HERE. The provenance findings this module makes
// are styling findings -- a font family, a weight, a hex -- and under the
// severity policy a styling finding warns. The string stays exported because it
// is the only durable record of what this gate used to say, and because a
// caller that still greps for it must find nothing rather than find a rename.
export const ROLE_COVERAGE_RECHECK_BLOCKER_PREFIX =
  "Role-coverage provenance re-check refused the extraction artifact being finalized";

// WHAT IT SAYS NOW. The verb had to change with the channel: "refused" in a
// warning would tell the reader the run stopped when it did not, and a report
// that misdescribes its own severity is the failure mode this whole programme
// is correcting.
export const ROLE_COVERAGE_RECHECK_WARNING_PREFIX =
  "Role-coverage provenance re-check flagged a value in the extraction artifact being finalized";

export const ROLE_COVERAGE_RECHECK_FAILED_PREFIX =
  "Role-coverage provenance re-check could not run";

// A state no pass in this tree can write: the marker goes on at the same
// statement as `schemaValidated = true`. It survives as a consistency guard
// over the one file the run is allowed to hand-edit -- a diagnostics file
// carrying this build's marker while denying that its normalize validated
// anything is internally inconsistent, and reading it as "checked and fine"
// would be the one interpretation that is certainly wrong.
export const ROLE_COVERAGE_STALE_ARTIFACT_BLOCKER =
  "assembly-diagnostics.json is internally inconsistent: it carries the role-coverage gate " +
  "marker, which `--mode normalize` writes only on the pass that validated the artifact, and " +
  "yet reports `schemaValidated` other than `true`. No normalize pass writes that pair, so the " +
  "file has been edited by hand and nothing here can say what judged brandkit.extraction.json. " +
  "Re-run `--mode normalize` on the current input and fix what it reports.";

export const ROLE_PROVENANCE_RECONCILED_WARNING =
  "Styling role provenance was stale and has been conservatively re-derived from this run's capture, " +
  "recovery evidence, and current published carrier values before composition. The styling edit still " +
  "publishes, but no stale dom-measured or agent-recovered claim is retained.";

export const ROLE_PROVENANCE_UNGRADED_WARNING =
  "brandkit.extraction.json has no roleProvenance map. Styling remains usable and publication " +
  "continues, but consumers must treat every published styling role as ungraded.";

function sameRoleProvenance(left, right) {
  if (!left || typeof left !== "object" || Array.isArray(left)) return false;
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();
  if (leftKeys.length !== rightKeys.length || leftKeys.some((key, index) => key !== rightKeys[index])) return false;
  return leftKeys.every((key) =>
    left[key]?.provenance === right[key]?.provenance && left[key]?.confidence === right[key]?.confidence,
  );
}

// Load every input the two coverage predicates consume, from `dir`.
//
// SHARED WITH THE PRODUCER ON PURPOSE. `runNormalize` calls this too, so the
// re-check cannot drift into asking the predicates a differently-loaded
// question than the pass whose verdict it is re-testing. `layoutDiagnostics` is
// threaded because `resolveEffectiveButtonStyles` records the stale-focused
// note into it; pass a throwaway array when nobody reads it.
export async function loadRoleCoverageInputs(dir, layoutDiagnostics = []) {
  const [
    technicalProductRows,
    homepageStatus,
    capture,
    pageSignals,
    textStyles,
    buttonStylesRaw,
    buttonStylesFocused,
    backgroundStyles,
    logoSvgPaths,
    logoAssets,
  ] = await Promise.all([
    readJson(path.join(dir, "product-card-styles.json"), []),
    readJson(path.join(dir, "homepage-pass-status.json"), null),
    readJson(path.join(dir, "capture.json"), {}),
    readJson(path.join(dir, "page-signals.json"), {}),
    readJson(path.join(dir, "text-styles.json"), []),
    readJson(path.join(dir, "button-styles.json"), []),
    readJson(path.join(dir, "button-styles.focused.json"), []),
    readJson(path.join(dir, "background-styles.json"), []),
    loadLogoSvgPathFiles(dir),
    readJson(path.join(dir, "logo-assets.json"), null).catch(() => null),
  ]);
  const probedSelectors = readProbedSelectors(
    await readJson(probedSelectorsPathFor(path.join(dir, "text-styles.json")), null),
  );
  const salientRows = readSalientRows(await readJson(path.join(dir, "salient-text.json"), null));
  const [rawMtimeMs, focusedMtimeMs] = await Promise.all([
    readMtimeMs(path.join(dir, "button-styles.json")),
    readMtimeMs(path.join(dir, "button-styles.focused.json")),
  ]);
  const buttonStyles = resolveEffectiveButtonStyles(
    buttonStylesRaw,
    buttonStylesFocused,
    homepageStatus,
    layoutDiagnostics,
    { rawMtimeMs, focusedMtimeMs },
  );
  return {
    technicalProductRows,
    homepageStatus,
    capture,
    pageSignals,
    textStyles,
    backgroundStyles,
    logoSvgPaths,
    logoAssets,
    probedSelectors,
    salientRows,
    buttonStyles,
  };
}

// `buildCandidates` from a loaded input bundle. One place, so the re-check and
// the pass cannot disagree about which pools the salient lane may spare a role
// from.
export function candidatesFromInputs(inputs) {
  return buildCandidates({
    backgroundStyles: inputs.backgroundStyles,
    textStyles: inputs.textStyles,
    buttonStyles: inputs.buttonStyles,
    productRows: inputs.technicalProductRows,
    capture: inputs.capture,
    pageSignals: inputs.pageSignals,
    logoSvgFills: logoSvgFillsFromPaths(inputs.logoSvgPaths),
    logoAssets: inputs.logoAssets,
    salientRows: inputs.salientRows,
    probedSelectors: inputs.probedSelectors,
  });
}

// True when `diagnostics` was written by a normalize pass carrying this build's
// gate. Anything else — no file, a legacy file, a hand-written one, a different
// version — reads as "not this build's", and the caller does nothing.
export function diagnosticsCarryRoleCoverageGate(diagnostics) {
  return Boolean(
    diagnostics &&
      typeof diagnostics === "object" &&
      !Array.isArray(diagnostics) &&
      diagnostics[ROLE_COVERAGE_GATE_FIELD] === ROLE_COVERAGE_GATE_VERSION,
  );
}

// The provenance subset of a coverage array: the entries that say a value in
// this kit was authored. `severity` is NOT consulted — filtering on it is what
// would sweep the advisory missing-role entries into the blocker channel.
export function provenanceRefusals(entries) {
  if (!Array.isArray(entries)) return [];
  return entries.filter((entry) => isAuthoredWithoutEvidence(entry) || isValueNotMeasured(entry));
}

function warningFor(channelKey, entry) {
  const hint = typeof entry?.hint === "string" && entry.hint ? entry.hint : "(unnamed role)";
  const message = typeof entry?.message === "string" ? entry.message : "";
  return (
    `${ROLE_COVERAGE_RECHECK_WARNING_PREFIX}: ${channelKey} (${hint}) — ${entry.reason}. ` +
    "The value on the row carrying this role is not one this capture supports, and " +
    "brandkit.extraction.json is judged as it stands on disk rather than as some earlier " +
    `\`--mode normalize\` left it. The kit is still published: a close styling value carrying ` +
    "this note is worth more to the account than no kit at all. " +
    `${message}`
  ).trim();
}

function softProvenanceWarnings(payload, alreadyWarnedRoles = new Set()) {
  const map = payload?.roleProvenance;
  if (!map || typeof map !== "object" || Array.isArray(map)) return [];
  const warnings = [];
  for (const [role, grade] of Object.entries(map)) {
    if (alreadyWarnedRoles.has(role)) continue;
    if (grade?.provenance !== "defaulted" && grade?.provenance !== "screenshot-sampled") continue;
    warnings.push(
      `Styling role provenance is uncertain (${role}): ${grade.provenance} at confidence ${grade.confidence}. ` +
        (grade.provenance === "screenshot-sampled"
          ? "The exact agent-selected DOM locator was re-probed first and failed; the published colour was then sampled from the screenshot bound to this run."
          : "No exact deterministic or agent-selected DOM measurement supports every published carrier of this role; the value remains usable but should be treated as overridable."),
    );
  }
  return warnings;
}

function roleHasPublishedResolution(payload, entry, recoveryEvidence) {
  const role = typeof entry?.hint === "string" ? entry.hint : "";
  const provenance = role ? payload?.roleProvenance?.[role]?.provenance : null;
  if (provenance !== "agent-recovered" && provenance !== "screenshot-sampled" && provenance !== "defaulted") {
    return false;
  }
  // A generic defaulted grade says only "not exactly measured"; it must not
  // erase a fresh value_not_measured finding after the carrier is edited.
  // Suppression is reserved for the current run-bound recovery entry that
  // actually explains this carrier and reproduces the same soft/exact grade.
  return recoveryProvenanceForRole(payload, role, recoveryEvidence)?.provenance === provenance;
}

// Re-run both coverage gates against `<technicalDir>/brandkit.extraction.json`.
//
// Returns `{blockers, warnings}`. `{blockers: [], warnings: []}` means "nothing
// to say", which is also the answer for every markerless technical dir without
// a provenance map. In repair mode, a markerless positive map is stripped and
// warned. THROWS when the marker IS present and an input cannot be read — the
// caller turns that into a blocker, because "we could not check" must never
// read as "we checked and it was fine".
//
// TWO CHANNELS, AND THE SPLIT IS THE POINT. This module's entire subject is the
// styling axis -- a font family, a weight, a size, a hex -- so under the
// severity policy every provenance finding it makes is a warning: a close
// styling value labelled as unproven beats no Brand Kit at all, and a refused
// run under replace-only persistence writes nothing, leaving the account with
// the PREVIOUS run's kit or with nothing.
//
// `ROLE_COVERAGE_STALE_ARTIFACT_BLOCKER` is the exception and stays a blocker.
// It is not a styling finding at all: it fires on a diagnostics file that
// carries this build's gate marker while denying its own normalize validated
// anything, a pair no producer writes. That is artifact tampering, and the run
// cannot say what judged `brandkit.extraction.json`.
export async function roleCoverageRecheckFindings(technicalDir, { repairProvenance = false } = {}) {
  const dir = path.resolve(technicalDir);
  // Lenient, and first: a corrupt or absent diagnostics file must degrade to
  // today's behaviour, not to a throw, exactly as `readPriorDiagnostics` does
  // for the pass that writes it.
  let diagnostics = null;
  try {
    diagnostics = await readJson(path.join(dir, "assembly-diagnostics.json"), null);
  } catch {
    diagnostics = null;
  }
  if (!diagnosticsCarryRoleCoverageGate(diagnostics)) {
    if (repairProvenance) {
      const payloadPath = path.join(dir, "brandkit.extraction.json");
      const payload = await readJson(payloadPath, null);
      if (
        payload
        && typeof payload === "object"
        && !Array.isArray(payload)
        && Object.hasOwn(payload, "roleProvenance")
      ) {
        delete payload.roleProvenance;
        await writeJson(payloadPath, payload, true);
        return { blockers: [], warnings: [ROLE_PROVENANCE_UNGRADED_WARNING] };
      }
    }
    return { blockers: [], warnings: [] };
  }

  // A CONSISTENCY GUARD, and no producer reaches it. It used to be described
  // as the companion that catches the artifact left behind when the last
  // normalize threw -- it does not, and cannot: a normalize that threw leaves
  // no marker, so the line above has already returned by then. What remains is
  // a diagnostics file that carries this build's marker AND denies its own
  // normalize validated anything, a pair `runNormalize` writes at one
  // statement and therefore never splits. Reaching this line means the file
  // was hand-edited, and refusing is the only reading that is not a guess. It
  // is emphatically not a substitute for the predicates below: on the
  // edit-after-clean-normalize path the flag is `true`.
  if (diagnostics.schemaValidated !== true) {
    return { blockers: [ROLE_COVERAGE_STALE_ARTIFACT_BLOCKER], warnings: [] };
  }

  const payload = await readJson(path.join(dir, "brandkit.extraction.json"), null);
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    throw new Error(
      `${path.join(dir, "brandkit.extraction.json")} is missing or is not a JSON object, so the ` +
        "artifact about to be promoted cannot be re-checked.",
    );
  }

  const inputs = await loadRoleCoverageInputs(dir);
  const candidates = candidatesFromInputs(inputs);
  // The diagnostics file on disk stands in for normalize's `priorDiagnostics`,
  // WITH THE COLOUR ESCAPE BOUND TO THE PASS THAT HONOURED IT. The pass
  // carries `roleChoiceJustifications` across its own rewrite
  // (`carryRoleChoiceJustifications`), so the key survives in the file it
  // wrote — but survival is not provenance. Presence alone cannot tell that
  // sentence from one appended afterwards, and this module used to claim it
  // could: it said a justification the pass never saw "is a post-normalize
  // edit to the sanctioned sidecar, the same class of edit this module exists
  // to judge". It did not judge it, it honoured it. A clean scaffold +
  // normalize with both textColors rows edited to `#ff00ff` and NO
  // re-normalize went from exit 4 / blocked / 2 blockers to exit 0 / composed
  // / promoted on one hand-added sentence under
  // `.roleChoiceJustifications["brand.colors.textColors"]`, whose only
  // required contents — the role name, the kept hex, the derived hex — are
  // all printed in the refusal message that asks for it. Typography has no
  // such escape and still blocked on the same dir, so the hole was the colour
  // channel's alone.
  //
  // So the sentence is honoured here only when it digests to what the stamping
  // pass recorded beside the marker (`bindTextColorJustification`); anything
  // else is stripped for this call and the gate refuses the deviation on its
  // merits. This does NOT make the escape unforgeable — the digest lives in
  // the same writable file as the marker, and the header above says plainly
  // that no gate input here is beyond a run that sets out to circumvent it.
  // What it removes is a bypass the refusal message itself dictated.
  //
  // AND THE CARDS ARE PASSED, which they were not. The removed arm read them to
  // admit a card's family onto a REGION-role record and could not model its own
  // producer; this one grades the PRODUCT roles against
  // `product-card-styles.json`, the artifact their producer copies from. That
  // channel had no anchor at all until now -- `typographyRoleEvidence` returns
  // `EVIDENCE_PRESENT` for every hint outside the region list without reading a
  // row, and the value branch is fenced by that same list -- so an invented
  // product font reached this re-check and produced no entry to refuse.
  //
  // `inputs.technicalProductRows` was already loaded here and already
  // documented as read by nobody. It is read now, out of the SAME loader
  // `runNormalize` uses, so the re-check cannot ask the predicate a
  // differently-loaded question than the pass whose verdict it re-tests.
  const typography = typographyRoleCoverageDiagnostics(
    payload,
    inputs.homepageStatus,
    inputs.textStyles,
    inputs.probedSelectors,
    inputs.salientRows,
    candidates,
    inputs.technicalProductRows,
  );
  //
  // AND THE BINDING RUNS AFTER THE GATE, NOT BEFORE IT. The digest covers the
  // reason AND the deviations it excused -- role, kept hexes, derived hex --
  // and that tuple list only exists once the gate has been asked. So this runs
  // the gate with the sidecar exactly as the pass would have seen it,
  // collecting what the sentence admitted, and only then asks whether the
  // stamping pass admitted the same thing. It could not be bound on the text
  // alone: a compliant sentence recorded while every colour was still measured
  // excuses nothing, is never read by the gate, and was stamped anyway -- so
  // the stamp became standing authority for an edit to a hex the sentence had
  // already named, and the re-check honoured it.
  //
  // A MISMATCH COSTS ONE RE-RUN, deliberately, and the whole file's escape is
  // withdrawn when it happens. `bindTextColorJustification` is all-or-nothing
  // per file -- the key names a FIELD -- so a stamp that no longer describes
  // the corrections in front of it cannot be honoured for the half that still
  // matches; that is the exact hole the rejected "counterfactual stamp" left
  // open, where a reason load-bearing for `heading-text` licensed a `body-text`
  // fabrication.
  // The SAME canvas the pass resolved, out of the same helper and the same
  // loader, so the re-check cannot grade a suppressed colour role against a
  // different surface than the pass that suppressed it. See
  // `lib/text-role-canvas.js`.
  const canvasHex = resolveTextRoleCanvasHex(payload, inputs.backgroundStyles);
  const honoured = [];
  let textColor = textColorRoleCoverageDiagnostics(
    payload,
    inputs.textStyles,
    inputs.probedSelectors,
    inputs.salientRows,
    candidates,
    diagnostics,
    honoured,
    canvasHex,
  );
  const boundDiagnostics = bindTextColorJustification(
    diagnostics,
    diagnostics[ROLE_COVERAGE_JUSTIFICATION_DIGEST_FIELD],
    honoured,
  );
  // Identity, not deep equality: the helper returns its input untouched when it
  // binds and a shallow copy when it strips. Nothing was stripped means nothing
  // to re-ask -- and when the gate honoured NOTHING the helper also returns the
  // input, because a reason no verdict depended on cannot change one by leaving.
  if (boundDiagnostics !== diagnostics) {
    textColor = textColorRoleCoverageDiagnostics(
      payload,
      inputs.textStyles,
      inputs.probedSelectors,
      inputs.salientRows,
      candidates,
      boundDiagnostics,
      null,
      canvasHex,
    );
  }
  const recoveryEvidence = await loadAgentRoleRecovery(dir);
  recoveryEvidence.filledRoles = new Set(
    (Array.isArray(diagnostics.agentRoleRecovery) ? diagnostics.agentRoleRecovery : [])
      .filter((entry) => entry?.reason === "recovery-role-filled" && typeof entry?.role === "string")
      .map((entry) => entry.role),
  );
  const expectedProvenance = buildRoleProvenance(
    payload,
    [...typography, ...textColor],
    [
      ...EVIDENCE_GRADED_TYPOGRAPHY_HINTS,
      ...EVIDENCE_GRADED_PRODUCT_CARD_TYPOGRAPHY_HINTS,
      ...REQUIRED_TEXT_COLOR_ROLE_HINTS,
    ],
    {
      textStyles: inputs.textStyles,
      probedSelectors: inputs.probedSelectors,
      salientRows: inputs.salientRows,
      productRows: inputs.technicalProductRows,
      backgroundStyles: inputs.backgroundStyles,
      candidates,
    },
    recoveryEvidence,
  );
  if (!sameRoleProvenance(payload.roleProvenance, expectedProvenance)) {
    if (!Object.hasOwn(payload, "roleProvenance") && !repairProvenance) {
      // The map is schema-optional. The Python finalizer deliberately removes
      // it when the reconciliation runtime is unavailable, because an absent
      // styling grade is safer than a stale positive claim. That conservative
      // strip warns but must not turn styling uncertainty into a blocker.
      return { blockers: [], warnings: [ROLE_PROVENANCE_UNGRADED_WARNING] };
    }
    const priorProvenance = payload.roleProvenance;
    const downgradedRefusal = (entry) => {
      const role = typeof entry?.hint === "string" ? entry.hint : "";
      const prior = priorProvenance?.[role]?.provenance;
      return (
        expectedProvenance?.[role]?.provenance === "defaulted" &&
        (prior === "dom-measured" || prior === "agent-recovered")
      );
    };
    const actionableEntries = [
      ...provenanceRefusals(typography)
        .filter(downgradedRefusal)
        .map((entry) => ["typographyRoleCoverage", entry]),
      ...provenanceRefusals(textColor)
        .filter(downgradedRefusal)
        .map((entry) => ["textColorRoleCoverage", entry]),
    ];
    const actionableWarnings = actionableEntries.map(([channel, entry]) => warningFor(channel, entry));
    const warnings = actionableWarnings.length > 0
      ? actionableWarnings
      : [ROLE_PROVENANCE_RECONCILED_WARNING];
    if (repairProvenance) {
      payload.roleProvenance = expectedProvenance;
      await writeJson(path.join(dir, "brandkit.extraction.json"), payload, true);
      return {
        blockers: [],
        warnings,
      };
    }
    // A stale grade is styling uncertainty, not a factual corruption. Report
    // the exact unsupported carrier when the evidence predicates can name it,
    // but never turn the optional provenance map into a run refusal. The
    // pre-compose reconciliation helper uses the branch above to persist the
    // conservative map; read-only validators use this branch.
    return {
      blockers: [],
      warnings,
    };
  }
  // These predicates grade deterministic extraction only. Once normalize has
  // published a non-missing recovery/default grade, their authored finding is
  // the historical deterministic miss, not the standing of the value in the
  // kit. Exact agent recovery is silent; soft grades are described once by
  // `softProvenanceWarnings` below.
  const typographyRefusals = provenanceRefusals(typography).filter(
    (entry) => !roleHasPublishedResolution(payload, entry, recoveryEvidence),
  );
  const textColorRefusals = provenanceRefusals(textColor).filter(
    (entry) => !roleHasPublishedResolution(payload, entry, recoveryEvidence),
  );
  const alreadyWarnedRoles = new Set(
    [...typographyRefusals, ...textColorRefusals]
      .map((entry) => entry?.hint)
      .filter((hint) => typeof hint === "string" && hint),
  );
  return {
    blockers: [],
    warnings: [
      ...typographyRefusals.map((entry) => warningFor("typographyRoleCoverage", entry)),
      ...textColorRefusals.map((entry) => warningFor("textColorRoleCoverage", entry)),
      ...softProvenanceWarnings(payload, alreadyWarnedRoles),
    ],
  };
}

// The pre-split entry point, kept because several call sites and every existing
// pin ask this module one question: what stops the run. It now answers with the
// blockers alone, which is the whole of the answer.
export async function roleCoverageRecheckBlockers(technicalDir) {
  return (await roleCoverageRecheckFindings(technicalDir)).blockers;
}

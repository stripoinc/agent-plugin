// Normalize-pass body for the extraction-stage orchestrator (BACKLOG item 15).
//
// `runNormalize` was previously inlined in `assemble-extraction-stage.js`
// at lines 974-1209. This module exports it verbatim — the orchestrator
// now just imports and dispatches. The body is unchanged so the
// normalize-stage output + diagnostics stay byte-identical to the
// pre-refactor pipeline (see the parity test in
// `tests/test_assemble_extraction_stage.py`).
//
// Synth-helper ordering invariants preserved verbatim per
// `skills/brandkit-extraction-v-0/SKILL.md` and the BACKLOG-item docstrings:
//   1. `applyHeaderLinkStrip` first — the gated link-region purge runs
//      before any synthesiser so subsequent helpers operate on the
//      cleaned set.
//   2. `backfillHeaderLinkFromScopedEvidence` — append-only inverse of
//      the strip; both are no-ops when their gate is inactive.
//   3. `synthesizeLogoSvgAccents` — accent-set top-up from logo SVG
//      fills, gated on `accentColors.length <= 2`. Runs BEFORE the
//      text-color synthesis so the linkColorBrandAlignment diagnostic
//      sees the enriched accent set.
//   4. Synthesis chain: `synthesizeTextColorRoles` →
//      `purifyProductCardLinkRoles` → `applyAccentPromotionFromEvidence`
//      → `stripTextRoleHintsFromAccents` → `stripBackgroundHintsFromAccents`
//      → `emitHeaderLinkContrastDiagnostic`. Tier-H Fix 3, Fix 2,
//      Tier-I Fix 2, Tier-J item 26, Tier-J item 20 respectively.
//   5. Background-region synthesis: `synthesizeRegionBgHints` →
//      `synthesizeFooterTextRole` → `synthesizeContentBgHint` →
//      `synthesizeProductCardSurfaceBgHint`.
//      Re-emitted in normalize so a dropped scaffold hint is restored.
//      `synthesizeFooterTextRole` is a textColors producer sitting in the
//      background chain because its gate is the `footer-background` the
//      region synthesis immediately above it emits.
//   6. Variant-decision chain: `filterScaffoldProductRows` →
//      `applyDerivedOldPricePosition` → `applyDerivedContentAlign` →
//      `applyDerivedVariantIndex` → `enforceDeterministicVariantIndex`.
//      The deterministic tree gets the final word on the variant index
//      (`enforceDeterministicVariantIndex`) so an agent-authored value
//      that contradicts the derived axes is overwritten with a diagnostic.
//
// Reordering ANY of the above WILL flip downstream outputs on real
// brands. The parity test guards against accidental movement.

import path from "node:path";
import { applyHeaderLinkStrip } from "./header-link-strip.js";
import { backfillHeaderLinkFromScopedEvidence } from "./header-link-backfill.js";
import { synthesizeFooterTextRole, synthesizeTextColorRoles } from "./text-color-role-synthesis.js";
import { synthesizeLogoSvgAccents } from "./logo-svg-accent-synthesis.js";
import {
  textColorJustificationDigest,
  textColorRoleCoverageDiagnostics,
} from "./text-color-role-coverage.js";
import {
  isAuthoredWithoutEvidence,
  isRoleNotProduced,
  isValueNotMeasured,
} from "./role-evidence.js";
import { isUnresolvedRoleEntry } from "./role-coverage-reasons.js";
import { printNormalizeSummary } from "./normalize-summary.js";
import { colorRoleHintDuplicationDiagnostics } from "./color-role-hint-duplication.js";
import {
  componentShrinkageDiagnostics,
  buildShrinkageRecoveryPayload,
  EXTRACTION_FIELD_ACCESSORS,
} from "./component-shrinkage-gate.js";
import {
  MAX_NORMALIZE_ATTEMPTS,
  parseNormalizeAttempt,
  buildNormalizeAttemptDiagnostic,
} from "./normalize-attempt-budget.js";
import { stripProvenanceMarkers } from "./provenance-marker.js";
import { buildRoleProvenance } from "./role-provenance.js";
import {
  applyAgentRoleRecoveries,
  loadAgentRoleRecovery,
  recoveryEntrySupportsPublishedRole,
} from "./agent-role-recovery.js";
import {
  EVIDENCE_GRADED_PRODUCT_CARD_TYPOGRAPHY_HINTS,
  EVIDENCE_GRADED_TYPOGRAPHY_HINTS,
} from "./role-evidence.js";
import { REQUIRED_TEXT_COLOR_ROLE_HINTS } from "./text-color-role-coverage.js";
import { applyDerivedOldPricePosition } from "./product-card-old-price-position.js";
import { applyDerivedContentAlign } from "./product-card-content-align.js";
import {
  applyDerivedVariantIndex,
  enforceDeterministicVariantIndex,
} from "./product-card-variant-decision.js";
import { applySalientHeadingTypography } from "./salient-heading-autoapply.js";
import { synthesizeRegionBgHints } from "./region-bg-hints.js";
import { resolveTextRoleCanvasHex } from "./text-role-canvas.js";
import { synthesizeContentBgHint } from "./region-bg-content-hint.js";
import { synthesizeProductCardSurfaceBgHint } from "./product-card-surface-hint.js";
import { applyAccentPromotionFromEvidence } from "./accent-promotion-from-evidence.js";
import { purifyProductCardLinkRoles } from "./text-color-link-region-purify.js";
import {
  stripTextRoleHintsFromAccents,
  stripBackgroundHintsFromAccents,
} from "./text-role-hints-strip.js";
import { emitHeaderLinkContrastDiagnostic } from "./header-link-contrast-diagnostic.js";
import { linkColorBrandAlignmentDiagnostics } from "./link-colour-brand-alignment.js";
import { usageHintEnumsFromSchema } from "./usage-hint-enums.js";
import {
  describeRoleResolution,
  productCardTypographyRepairField,
  typographyRoleCoverageDiagnostics,
} from "./typography-role-coverage.js";
import { filterScaffoldProductRows } from "./product-row-filter.js";
import {
  PRODUCT_CARD_PROBE_BINDING_FILENAME,
  productCardProbeBindingMatches,
} from "./product-card-probe-binding.js";
import {
  productCardCtaDiagnostics,
  productCardCtaSelectionDiagnostics,
} from "../assemble-product-card-cta.js";
import {
  ROLE_COVERAGE_GATE_FIELD,
  ROLE_COVERAGE_GATE_VERSION,
  ROLE_COVERAGE_JUSTIFICATION_DIGEST_FIELD,
  candidatesFromInputs,
  loadRoleCoverageInputs,
} from "./role-coverage-recheck.js";
import {
  carryRoleChoiceJustifications,
  findUnsafePublicStrings,
  homepagePassDiagnostics,
  normalizeExtraction,
  productCardMirrorDiagnostics,
  productCardVariantDecisionDiagnostics,
  readExtractionStageSchema,
  readJson,
  readPriorDiagnostics,
  roleGaps,
  technicalDir,
  validateExtractionStage,
  writeDiagnostics,
  writeJson,
} from "./extraction-pass-helpers.js";

// The two `severity: "high"` conditions with a legal one-line in-run repair.
// Each returns "" when this run carries none of its condition, so a caller can
// filter on length. Both are called twice -- once by the retry-budget throw,
// once by the role-coverage gate the budget throw used to pre-empt -- so the
// wording cannot differ between the two readers.
function authoredTypographyRepairSection(highSeverityEntries) {
  const entries = highSeverityEntries.filter(isAuthoredWithoutEvidence);
  if (entries.length === 0) return "";
  const authored = entries.map((entry) => entry.hint).join(", ");
  return `Typography role hint present without evidence: ${authored}. The capture contains no element the deterministic selector mapper assigns to these roles, so no producer could have put them on a row. REMOVE the hint from the \`usageHints\` array that carries it and re-run; the run then records an honest gap for that role and the kit persists. Do NOT re-add it, do NOT move it to another row, and do NOT re-probe with a narrower selector list to make this message go away.`;
}

function authoredTextColorRepairSection(highSeverityEntries) {
  const entries = highSeverityEntries.filter(isAuthoredWithoutEvidence);
  if (entries.length === 0) return "";
  const authored = entries.map((entry) => entry.hint).join(", ");
  return `Text-color role hint present without evidence: ${authored}. The deterministic synthesis helper has no row it could have derived these colours from — the source rows are absent, or every one of them is \`#ffffff\`. REMOVE the hint from the \`usageHints\` array that carries it and re-run; the run then records an honest gap for that role and the kit persists. Do NOT re-add it, do NOT move it to another row, and do NOT re-probe with a narrower selector list to make this message go away.`;
}

// WP-A3 — the verification block, printed on EVERY exit path.
//
// SKILL.md asks the agent to re-open `brandkit.extraction.json` after this
// pass and hand-check five per-array evidence conditions; 9/9 measured runs do
// exactly that re-read. Both halves are mechanical, so the pass prints the
// verdict.
//
// THE PRINT IS A `finally`, and that is the whole design. `normalizePass` has
// seven throw sites (the probe-binding rethrow, the shrinkage gate, the retry
// budget, the unsafe-public-strings refusal, AJV validation, the publish
// rethrow, and anything unforeseen), and a print statement added at each one
// would be six chances to miss the seventh — the failure paths are precisely
// where the block matters most, because several of them carry their repair
// prose in the thrown Error alone. A `finally` runs before the rethrow reaches
// the caller, so the block is printed exactly once, before the error
// propagates, and the exit code is untouched.
//
// `state` is how the block reaches the printer: the body fills it as it goes,
// so a pass that died at statement three still prints what it knew by then
// instead of printing nothing.
export async function runNormalize(args) {
  const state = { diagnostics: null, payload: null, candidates: null, normalizeAttempt: null, error: null };
  try {
    await normalizePass(args, state);
  } catch (error) {
    state.error = error;
    throw error;
  } finally {
    printNormalizeSummary(state);
  }
}

async function normalizePass(args, state) {
  const inputPath = path.resolve(args.input);
  const dir = args.technicalDir ? technicalDir(args) : path.dirname(inputPath);
  const colorConflicts = [];
  const layoutDiagnostics = [];
  // BACKLOG item 24: cap normalize retry attempts at 3. The agent (or its
  // wrapper script) increments BRANDKIT_NORMALIZE_ATTEMPT each turn; on the
  // third attempt with unresolved high-severity entries we emit a terminal
  // diagnostic and exit non-zero so a pathological loop fails fast instead
  // of burning ~1M+ tokens. The attempt counter is always surfaced in the
  // diagnostics file regardless of whether the cap was hit.
  const normalizeAttempt = parseNormalizeAttempt(process.env.BRANDKIT_NORMALIZE_ATTEMPT);
  state.normalizeAttempt = normalizeAttempt;
  // Recompute the candidates block here too. Without this, the
  // scaffold's candidates field is wiped from
  // `assembly-diagnostics.json` when the agent runs `--mode normalize`.
  // `logo-assets.json` must be re-read HERE too. Without it, `--mode
  // normalize` recomputes the candidates block with `svgPath: ""` and erases
  // the captured hint the scaffold pass had surfaced. Tolerant read: missing
  // OR malformed degrades to `null` (== today's behaviour).
  //
  // ONE LOADER, SHARED WITH THE FINALIZE-TIME RE-CHECK
  // (`lib/role-coverage-recheck.js#loadRoleCoverageInputs`). That re-check
  // re-asks the two role-coverage predicates the question this pass is about
  // to answer, against the artifact as it stands on disk. If it loaded the
  // inputs even slightly differently it would answer a different question and
  // could refuse an artifact this pass accepted, so the reads are not
  // duplicated there — they are the same function. `resolveEffectiveButtonStyles`
  // still records its stale-focused note into `layoutDiagnostics` (BACKLOG
  // item 16) and is still the first writer of that array; the probed-selector
  // and salient-row reads keep their own rationale in the helper's header.
  const coverageInputs = await loadRoleCoverageInputs(dir, layoutDiagnostics);
  const {
    technicalProductRows,
    homepageStatus,
    textStyles,
    backgroundStyles,
    logoSvgPaths,
    probedSelectors,
    salientRows,
    buttonStyles,
  } = coverageInputs;
  // The diagnostics file this pass is about to overwrite. It is the only place
  // the agent's `roleChoiceJustifications` can be, and the text-colour gate
  // reads it to tell a recorded correction from a silent one.
  const priorDiagnostics = await readPriorDiagnostics(dir);
  let productCardProbeBinding = null;
  try {
    productCardProbeBinding = await readJson(
      path.join(dir, PRODUCT_CARD_PROBE_BINDING_FILENAME),
      null,
    );
  } catch (error) {
    // This sidecar is optional private endorsement evidence. A partial write
    // must fail that endorsement closed, not abort every other normalize
    // repair. Keep real filesystem failures visible: only JSON.parse's
    // SyntaxError degrades to the same unbound state as a missing sidecar.
    if (!(error instanceof SyntaxError)) throw error;
  }
  const technicalProductRowsBound = productCardProbeBindingMatches(
    productCardProbeBinding,
    technicalProductRows,
  );
  const agentInput = await readJson(inputPath, {}); // Tier-H Fix 1 + BACKLOG item 16.
  const recoveryEvidence = await loadAgentRoleRecovery(dir);
  // Soft-reject wholesale-rewrite BEFORE any transform. See
  // `lib/component-shrinkage-gate.js`: when the scaffold draft sidecar
  // exists AND the agent's input shrank a guarded component/color array
  // by >=50% from a draft length >= 10, surface severity:"high" and
  // fail normalize. Sidecar missing → gate no-ops (older runs,
  // hand-authored inputs). Runs first so the diagnostic reflects the
  // agent's raw input, not the post-helper-pass state.
  const draftSidecar = await readJson(path.join(dir, "brandkit.extraction.draft.json"), null);
  const shrinkageReports = componentShrinkageDiagnostics(draftSidecar, agentInput);
  // FATAL ON ATTEMPTS 1-2, ADVISORY ON THE LAST ONE.
  //
  // This gate is not a truthfulness check and never was: it counts ROWS. It
  // detects the agent deleting most of a guarded array, which is data LOSS, not
  // a false fact -- nothing it refuses is wrong, there is merely less of it. So
  // it is not on the BLOCK list, and it is not on the WARN list either: it is
  // the trigger of an in-run repair loop with a recovery sidecar, and blocking
  // on the early attempts is what makes the repair happen at all.
  //
  // Blocking on the FINAL attempt makes nothing happen. There is no attempt
  // left to spend, so the throw only ensures the run persists nothing --
  // which, under replace-only persistence, leaves the account with the previous
  // site's kit or with none. A kit that lost most of a section is worse than a
  // complete one and better than no kit, and the recovery sidecar and the
  // diagnostic still say exactly what was dropped.
  //
  // `parseNormalizeAttempt` clamps above the cap, so `>=` and `===` agree here;
  // `>=` is written because a clamp is a property of that helper and not of
  // this comparison.
  const shrinkageIsFinalAttempt = normalizeAttempt >= MAX_NORMALIZE_ATTEMPTS;
  if (shrinkageReports.length > 0 && !shrinkageIsFinalAttempt) {
    layoutDiagnostics.push(...shrinkageReports);
    const blockerDiagnostics = {
      mode: "normalize",
      schemaValidated: false,
      normalizeAttempt,
      usageHintEnums: usageHintEnumsFromSchema(await readExtractionStageSchema()),
      colorConflicts,
      layoutDiagnostics,
      errors: shrinkageReports.map((entry) => ({ path: entry.path, message: entry.message })),
    };
    state.diagnostics = blockerDiagnostics;
    const sidecarPath = path.join(dir, "assembly-diagnostics-shrinkage-recovery.json"); await writeDiagnostics(dir, blockerDiagnostics, args.pretty); await writeJson(sidecarPath, buildShrinkageRecoveryPayload(draftSidecar, agentInput, shrinkageReports, EXTRACTION_FIELD_ACCESSORS), args.pretty);
    const summary = shrinkageReports
      .map((entry) => `  ${entry.path}: scaffold=${entry.draftLength} -> agent=${entry.agentLength}`)
      .join("\n");
    const thresholdPct = Math.round((1 - shrinkageReports[0].fraction) * 100);
    throw new Error(
      `Component-array wholesale-rewrite detected (shrinkage gate). Each guarded field below shrank by >=${thresholdPct}% from the scaffold draft. Restore scaffold rows from brandkit.extraction.draft.json and apply targeted edits per the "Targeted edits vs wholesale rewrites — worked example" section in SKILL.md.\n${summary}\nSee ${sidecarPath} for per-field dropped-row list (read this instead of re-reading brandkit.extraction.draft.json).`,
    );
  }
  // The final-attempt half of the same gate: the reports are recorded on
  // `layoutDiagnostics` (which the pass carries to the end and writes), the run
  // continues, and the kit persists with the rows the agent left. The recovery
  // sidecar is written here too, because it is the only per-field record of
  // what was dropped and the operator needs it whether or not the run stopped.
  if (shrinkageReports.length > 0) {
    // GRADED DOWN WITH THE CONSEQUENCE, and this is not cosmetic. The reports
    // carry `severity: "high"`, and the retry-budget gate below scans
    // `layoutDiagnostics` for exactly that -- so leaving the grade alone would
    // let the budget re-throw at attempt 3 on the very finding this branch
    // exists to stop throwing on, and the ruling would have had no effect at
    // all. (Found by running the case, not by reading the code.) Every other
    // field of the entry is carried through untouched: the path, both lengths
    // and the message still say precisely what was dropped.
    layoutDiagnostics.push(
      ...shrinkageReports.map((entry) => ({ ...entry, severity: "warn" })),
    );
    await writeJson(
      path.join(dir, "assembly-diagnostics-shrinkage-recovery.json"),
      buildShrinkageRecoveryPayload(draftSidecar, agentInput, shrinkageReports, EXTRACTION_FIELD_ACCESSORS),
      args.pretty,
    );
  }
  const payload = normalizeExtraction(
    agentInput,
    colorConflicts,
    layoutDiagnostics,
    technicalProductRows,
    buttonStyles,
    // The SAME `text-styles.json` the two coverage gates below are handed, out
    // of the same loader, so the producer's notion of "a spelling this capture
    // carries" and the gate's cannot drift apart between the two calls.
    textStyles,
    { technicalProductRowsBound },
  );
  state.payload = payload;
  // Header-link / footer-link gated-strip validator. See
  // `lib/header-link-strip.js` for the rationale (wishlist-anchor-color
  // escapes-to-header mistag) and the conservative posture: gate
  // inactive → do nothing.
  applyHeaderLinkStrip(payload, textStyles, layoutDiagnostics);
  // Inverse safety net: append `header-link` / `footer-link` when scoped
  // probe evidence exists but the agent forgot the hint. See
  // `lib/header-link-backfill.js` — same gate as the strip, but
  // append-only (idempotent, never re-orders other hints).
  backfillHeaderLinkFromScopedEvidence(payload, textStyles, layoutDiagnostics, backgroundStyles);
  // A4: logo-SVG accent color synthesis. Append-only safety net for the
  // post-fix20 regression where the agent's normalize input drops the
  // brand-distinctive accent colors mined from the homepage logo SVG.
  // Gate: `accentColors.length <= 2`. Runs BEFORE synthesizeTextColorRoles
  // so the textColors synthesis and linkColorBrandAlignment diagnostic
  // both see the enriched accent set.
  synthesizeLogoSvgAccents(payload, logoSvgPaths, layoutDiagnostics);
  // Synthesise `heading-text` / `body-text` / `link-text` hints from
  // text-styles.json when `brand.colors.textColors` lacks them. See
  // `lib/text-color-role-synthesis.js` — companion to
  // appendTypographyRoleMirrors for the color channel. Runs AFTER the
  // header-link strip + backfill so the link region split is already
  // resolved (synthesis helper skips region-scoped <a> rows).
  // The page's own canvas colour, resolved ONCE and handed to both the
  // synthesiser (which refuses to publish an illegible heading/body colour
  // against it) and the coverage gate below (which names the resulting gap).
  // Resolved AFTER `normalizeExtraction` so the kit's `canvas-background` hint
  // is the one the artifact will actually carry. See `lib/text-role-canvas.js`.
  const canvasHex = resolveTextRoleCanvasHex(payload, backgroundStyles);
  synthesizeTextColorRoles(payload, textStyles, layoutDiagnostics, canvasHex); purifyProductCardLinkRoles(payload, layoutDiagnostics); applyAccentPromotionFromEvidence(payload, layoutDiagnostics); stripTextRoleHintsFromAccents(payload, layoutDiagnostics); stripBackgroundHintsFromAccents(payload, layoutDiagnostics); emitHeaderLinkContrastDiagnostic(payload, layoutDiagnostics); // Tier-H Fix 3 (link-region purify) + Fix 2 (accent promotion) + Tier-I Fix 2 (strip text-role hints from accent rows) + Tier-J item 26 (strip surface hints from accent rows) + Tier-J item 20 (header-link contrast warn).
  // Re-emit `header-background` / `footer-background` hints from probe
  // evidence (Tier-F decision 1: re-run in normalize so a dropped hint
  // is re-asserted). Idempotent — no duplicate rows or hints. See
  // lib/region-bg-hints.js.
  synthesizeRegionBgHints(payload, backgroundStyles, layoutDiagnostics);
  // `footer-text` from the selector-free capture. AFTER the region synthesis
  // above and not before it: the helper needs `footer-background` to be on the
  // kit, because the only test that lets it emit a colour is a contrast pair
  // against that surface. See `lib/text-color-role-synthesis.js`.
  synthesizeFooterTextRole(payload, salientRows, layoutDiagnostics);
  synthesizeContentBgHint(payload, backgroundStyles, layoutDiagnostics); synthesizeProductCardSurfaceBgHint(payload, technicalProductRows, layoutDiagnostics); // Tier-G re-emit.
  // Re-derive productCard[0].oldPricePosition and contentAlign from
  // probe evidence — majority wins; null leaves the agent's value.
  // Same filter as the scaffold path: non-product rows (category tiles,
  // banners, promo strips) must NOT bleed into the cross-row vote.
  const filteredTechnicalRows = filterScaffoldProductRows(technicalProductRows);
  applyDerivedOldPricePosition(payload, filteredTechnicalRows);
  applyDerivedContentAlign(payload, filteredTechnicalRows);
  applyDerivedVariantIndex(payload);
  // Deterministic-tree authority over the variant index — when the
  // tree returns a definite index, the agent's value is overwritten
  // and a diagnostic surfaces the prior pick for audit. See
  // lib/product-card-variant-decision.js#enforceDeterministicVariantIndex.
  enforceDeterministicVariantIndex(payload, layoutDiagnostics);
  // Keep recovery ownership stable across an untouched second normalize. The
  // marker is only a pointer: the current hash-bound recovery entry must still
  // exist and must still exactly support the published carrier before the
  // provenance builder can use it.
  if (!(recoveryEvidence.filledRoles instanceof Set)) recoveryEvidence.filledRoles = new Set();
  for (const entry of Array.isArray(priorDiagnostics?.agentRoleRecovery) ? priorDiagnostics.agentRoleRecovery : []) {
    if (entry?.reason === "recovery-role-filled" && recoveryEvidence.byRole.has(entry?.role)) {
      recoveryEvidence.filledRoles.add(entry.role);
    }
  }
  const agentRoleRecoveryDiagnostics = [...recoveryEvidence.diagnostics];
  applyAgentRoleRecoveries(payload, recoveryEvidence, agentRoleRecoveryDiagnostics);
  const usageHintEnums = usageHintEnumsFromSchema(await readExtractionStageSchema());
  // Hoisted above the diagnostics object because BOTH coverage gates now read
  // it: the authored-hint refusal is spared only by a value THIS RUN
  // published, so the gate and the published block must be the same object,
  // not two computations that could drift.
  const candidates = candidatesFromInputs(coverageInputs);
  state.candidates = candidates;
  // BOUNDED SALIENT AUTO-APPLY, and it must run HERE: after `candidates`
  // (the block it copies from, and the block the gate anchors against) and
  // BEFORE `typographyRoleCoverageDiagnostics` below, so the gate grades the
  // payload this pass actually publishes -- appended row included -- instead
  // of the row being added behind a grade that already ran. It fills
  // `heading-typography` ONLY, only when no row carries it, only when no
  // selector produced it, and only from a single unsplit salient candidate;
  // every other shape is left as the honest gap it is. Nothing in either gate
  // changes: the appended row copies `(family, weight, sizePx)` verbatim, so
  // the existing `typographyValueIsPublishedCandidate` anchor accepts it, and
  // `buildRoleProvenance` grades the role `defaulted` at the floor because
  // `typographyRoleEvidence` is still an absence grade. See
  // `lib/salient-heading-autoapply.js` for why the role set is one member.
  applySalientHeadingTypography(
    payload,
    { candidates, textStyles, probedSelectors, salientRows },
    layoutDiagnostics,
  );
  // WHAT THE COLOUR GATE HONOURS, collected as it runs. The stamp at the tail
  // of this function digests the justification TOGETHER with the deviations it
  // excused; an empty list means the recorded sentence was never load-bearing,
  // and such a sentence must not be stamped. See `textColorJustificationDigest`.
  const honouredTextColorDeviations = [];
  const diagnostics = {
    mode: "normalize",
    schemaValidated: false,
    // NO role-coverage gate marker here. It is written ONCE, on the success
    // write at the tail of this function, next to `schemaValidated = true`.
    // Writing it on the failure writes too (as this object briefly did) made
    // the finalize-time re-check hard-block every normalize that threw --
    // including the missing-role throw below, which is the one category
    // `role-coverage-recheck.js` promises never to block. Measured: 409 of the
    // 767 saved captures refuse normalize on a replay of their own untouched
    // scaffolder draft, ALL of them for a missing role and none for a
    // provenance reason, and all 409 were blocked at finalize by
    // ROLE_COVERAGE_STALE_ARTIFACT_BLOCKER. Leaving the marker off a failed
    // pass is the module's own documented rollback ("stop writing the marker
    // in normalize") applied to exactly the runs that need it: the file this
    // pass writes is wholesale, never merged, so a failed pass also CLEARS a
    // marker an earlier successful pass left.
    normalizeAttempt,
    usageHintEnums,
    colorConflicts,
    layoutDiagnostics,
    roleChoiceGaps: roleGaps(payload),
    homepagePassContract: homepagePassDiagnostics(homepageStatus),
    productCardTypographyMirrors: productCardMirrorDiagnostics(payload),
    productCardCtaContract: productCardCtaDiagnostics(payload, technicalProductRows),
    productCardCtaSelection: productCardCtaSelectionDiagnostics(technicalProductRows),
    productCardVariantDecision: productCardVariantDecisionDiagnostics(payload),
    typographyRoleCoverage: typographyRoleCoverageDiagnostics(payload, homepageStatus, textStyles, probedSelectors, salientRows, candidates, technicalProductRows),
    textColorRoleCoverage: textColorRoleCoverageDiagnostics(payload, textStyles, probedSelectors, salientRows, candidates, priorDiagnostics, honouredTextColorDeviations, canvasHex),
    colorRoleHintDuplication: colorRoleHintDuplicationDiagnostics(payload),
    linkColorBrandAlignment: linkColorBrandAlignmentDiagnostics(payload),
    candidates,
  };
  state.diagnostics = diagnostics;
  // The deterministic coverage lanes have no knowledge of the bounded
  // recovery artifact, so a freshly filled role looks hand-authored to them.
  // Remove that stale finding only when recovery both filled the previously
  // absent role and exactly supports every carrier now published for it. This
  // keeps deterministic extraction authoritative for roles it already owned,
  // and keeps malformed/mismatched recovery visible to the ordinary gates.
  const recoveryResolved = (entry) => {
    const role = typeof entry?.hint === "string" ? entry.hint : "";
    const recovery = recoveryEvidence.byRole instanceof Map ? recoveryEvidence.byRole.get(role) : null;
    return Boolean(
      role &&
        recoveryEvidence.filledRoles instanceof Set &&
        recoveryEvidence.filledRoles.has(role) &&
        recoveryEntrySupportsPublishedRole(payload, role, recovery),
    );
  };
  diagnostics.typographyRoleCoverage = diagnostics.typographyRoleCoverage.filter(
    (entry) => !recoveryResolved(entry),
  );
  diagnostics.textColorRoleCoverage = diagnostics.textColorRoleCoverage.filter(
    (entry) => !recoveryResolved(entry),
  );
  // Put the agent's justifications back into the file this pass replaces.
  carryRoleChoiceJustifications(diagnostics, priorDiagnostics);
  // THE AUTHORED SPLIT IS COMPUTED HERE, ABOVE THE BUDGET GATE, AND THAT
  // ORDER IS THE FIX. Both role-coverage gates below grade three opposite
  // conditions `severity: "high"` and only one of the three -- an AUTHORED
  // hint, which the run may simply remove -- has a legal in-run repair. The
  // budget gate throws ~23 lines before those gates run, so at attempt 3 the
  // agent used to receive a budget note in place of a repair sitting in the
  // same run directory: the tailored text survived in
  // `assembly-diagnostics.json`, but the run's HEADLINE contradicted it and
  // said stop. Hoisting the filters costs nothing (they are pure) and lets
  // the budget throw carry the same repair the gate would have printed.
  // SELECTED BY REASON, NOT BY SEVERITY, and that is the whole point of the
  // spelling work in `role-coverage-reasons.js`. These two lists drive THREE
  // things: the `diagnostics.errors` records, the repair prose, and (below)
  // the decision to throw. Only the last of those is a severity question.
  // Filtering all three on `severity === "high"` meant that demoting the
  // severity would silence the errors and the repair prose at the same
  // statement that stopped the run failing -- a change whose stated purpose is
  // to keep telling the agent what is soft would have made the run quieter
  // three ways at once. `isUnresolvedRoleEntry` names the three conditions
  // positively: authored-without-evidence, value-not-measured, role-not-produced.
  // Every other entry in these arrays is `info` or `warn` and was never in the
  // set.
  const typographyRoleFindings = diagnostics.typographyRoleCoverage.filter(isUnresolvedRoleEntry);
  const textColorRoleFindings = diagnostics.textColorRoleCoverage.filter(isUnresolvedRoleEntry);
  // ONE BUILDER PER CHANNEL, CALLED TWICE. The budget throw and the gate
  // throw must name the same repair in the same words; two spellings of one
  // instruction drift, and the copy the agent reads at attempt 3 is the copy
  // nothing tested.
  const authoredRepairSections = [
    authoredTypographyRepairSection(typographyRoleFindings),
    authoredTextColorRepairSection(textColorRoleFindings),
  ].filter((section) => section.length > 0);
  // BACKLOG item 24 — retry-budget terminal gate. When attempt N reaches
  // MAX_NORMALIZE_ATTEMPTS AND any diagnostic array still carries a
  // severity:"high" entry, write the diagnostic file with a terminal note,
  // emit it as an error, and throw so the caller exits non-zero. The
  // existing typography/text-color gates below also throw on high-severity,
  // but they each look at a single source; this gate is the umbrella check
  // that stops a fourth normalize pass when the agent cannot close the
  // remaining gap. It no longer stops the ONE pass that closes it: where an
  // `authored_without_evidence` entry survives, the throw carries that
  // entry's repair and the budget message authorizes a single corrective
  // rerun. `parseNormalizeAttempt` clamps above the cap, so the authorized
  // rerun re-enters here at attempt 3 and cannot loop.
  const attemptTerminal = buildNormalizeAttemptDiagnostic(
    normalizeAttempt,
    [
      layoutDiagnostics,
      diagnostics.roleChoiceGaps,
      diagnostics.productCardCtaContract,
      diagnostics.typographyRoleCoverage,
      diagnostics.textColorRoleCoverage,
      diagnostics.colorRoleHintDuplication,
      diagnostics.linkColorBrandAlignment,
    ],
    { hasAuthoredRepair: authoredRepairSections.length > 0 },
  );
  if (attemptTerminal) {
    diagnostics.errors = [
      ...(diagnostics.errors || []),
      { path: attemptTerminal.path, message: attemptTerminal.message },
    ];
    await writeDiagnostics(dir, diagnostics, args.pretty);
    // TWO COUNTER INSTRUCTIONS IN ONE MESSAGE IS A CONTRADICTION, so the
    // tail is conditional too. Resetting the counter to 1 hands the run
    // three fresh attempts and is right only where the agent is accepting
    // the gap; the authorized corrective rerun is ONE pass and must keep
    // the counter at the cap, or the budget stops binding at exactly the
    // moment it was relaxed. The no-repair tail is unchanged from before.
    const budgetTail = authoredRepairSections.length > 0
      ? `Keep BRANDKIT_NORMALIZE_ATTEMPT=3 for that corrective rerun -- do NOT reset it to 1, which would hand the run three fresh attempts, and do NOT mark the authored role with missingEvidence instead of removing its hint.`
      : `Set BRANDKIT_NORMALIZE_ATTEMPT=1 only after marking unresolved productCard fields with missingEvidence -- that array is a productCard-row field, not a general one.`;
    throw new Error(
      [
        `Normalize retry budget exhausted: ${attemptTerminal.message} ${budgetTail}`,
        ...authoredRepairSections,
      ].join("\n\n"),
    );
  }
  const unsafe = findUnsafePublicStrings(payload);
  if (unsafe.length) {
    diagnostics.errors = unsafe;
    await writeDiagnostics(dir, diagnostics, args.pretty);
    throw new Error(`Extraction-stage normalize rejected unsafe public fields: ${unsafe.map((item) => item.path).join(", ")}`);
  }
  // THE REPAIR PROSE IS A RECORD FIRST AND A THROW SECOND. Both channels used
  // to build their tailored repair text, write `diagnostics.errors`, write the
  // file and throw inside ONE conditional -- so the file write, the error
  // records and the run's failure were the same statement, and the aggregated
  // prose reached the agent ONLY as the thrown message. Nothing durable carried
  // it. Collecting the sections here means the repair survives in
  // `assembly-diagnostics.json` whether or not the condition is still fatal,
  // which is what lets the severity move without the run going quiet.
  const roleCoverageRepairs = [];
  // Hard gate on typographyRoleCoverage severity:"high". The stated reason --
  // that the customise pipeline returns `needs_review` and aborts -- is FALSE.
  // No such consumer exists in either repo. The gate's real value is catching a
  // dropped hint on a site whose evidence supports one; it cannot yet tell that
  // from a site that has no such evidence. Teaching it that difference is
  // tracked work and is deliberately not in this change. `appendTypographyRoleMirrors` is
  // supposed to close the product-name/price/old-price gap; severity:high
  // here means the helper didn't run, the signature match failed, or an
  // always-required hint (heading/body/header/footer/button) is missing.
  if (typographyRoleFindings.length > 0) {
    diagnostics.errors = [
      ...(diagnostics.errors || []),
      ...typographyRoleFindings.map((entry) => ({
        path: "$.brand.typography",
        message: entry.message,
        hint: entry.hint,
      })),
    ];
    // Two OPPOSITE conditions share `severity: "high"` and would otherwise
    // share one throw. A missing hint is unrepairable at run time and the
    // text below says so; an authored one is present, is a contract
    // violation, and HAS a legal one-line repair. Handing the authored case
    // the missing-hint text tells the agent to stop when the run is one
    // `jq` edit away from persisting an honest kit — the dead run the
    // owner ruled against, produced by message text, which is exactly the
    // #124 defect. `describeRoleResolution` is only correct for the missing
    // case too: on an authored hint it says "no record in brand.typography[]
    // carries this hint", and a record demonstrably does.
    //
    // THREE conditions now share `severity: "high"`, not two, and the third
    // needs the OPPOSITE instruction from the first. `authored_without_evidence`
    // means no producer could have derived the role, so "remove the hint" ends
    // in an honest gap and the kit persists. `value_not_measured` means the
    // role IS derivable here, so removing the hint turns a bad value into a
    // MISSING role -- still high, still fatal. Handing it the removal text
    // would walk the agent from one dead run into another.
    const typographyUnmeasured = typographyRoleFindings.filter(isValueNotMeasured);
    const typographyMissing = typographyRoleFindings.filter(
      (entry) => !isAuthoredWithoutEvidence(entry) && !isValueNotMeasured(entry),
    );
    const sections = [];
    // Same builder the retry-budget throw above calls, so the repair the agent
    // reads at attempt 3 and the one it reads at attempts 1-2 are one string.
    const typographyAuthoredSection = authoredTypographyRepairSection(typographyRoleFindings);
    if (typographyAuthoredSection) sections.push(typographyAuthoredSection);
    // TWO REPAIRS, SPLIT ON WHETHER ANY CARRIER IS ANCHORED -- which is the
    // question that decides the repair, and NOT "how many rows carry the role".
    // This section used to say "Do NOT remove the hint" in every case. That is
    // true wherever no carrier is anchored; where a second row
    // already carries the role and IS anchored -- the shape every observed
    // typography refusal has -- the sentence tells the agent to copy a captured
    // row over a genuinely measured record to satisfy a gate that is pointing
    // at a different row. `anchoredCarrier` is computed once, by the gate, and
    // read here: two computations of "is there an anchored carrier" would drift
    // and the two messages would then contradict each other.
    const typographyStray = typographyUnmeasured.filter(
      (entry) => typeof entry.anchoredCarrier === "string" && entry.anchoredCarrier,
    );
    const typographySoleCarrier = typographyUnmeasured.filter(
      (entry) => !(typeof entry.anchoredCarrier === "string" && entry.anchoredCarrier),
    );
    // AND THE SOLE-CARRIER HALF SPLITS AGAIN, ON CHANNEL. The section below is
    // region-worded from end to end -- "the deterministic selector mapper
    // assigns to these roles", "copy ONE captured row for the role out of
    // text-styles.json" -- and it was reached by EVERY sole-carrier refusal,
    // because the productCard arm emits the same `value_not_measured` reason.
    // A productCard mirror is not produced from a probe selector and no
    // captured row carries it, so that instruction sends the agent to an
    // artifact that holds no value for the role; the gate ENTRY for the very
    // same refusal already names `productCard[0].<field>` and deliberately
    // never says `text-styles.json`. 49 of the 61 productCard refusals in the
    // archived population are sole-carrier, so this is the MAJORITY shape for
    // that channel, not an edge. The discriminator is the coverage module's own
    // `productCardTypographyRepairField`, so the throw and the entry name one
    // field from one definition.
    const typographyCardSole = typographySoleCarrier.filter(
      (entry) => productCardTypographyRepairField(entry.hint) !== null,
    );
    const typographyRegionSole = typographySoleCarrier.filter(
      (entry) => productCardTypographyRepairField(entry.hint) === null,
    );
    if (typographyCardSole.length > 0) {
      const unmeasured = typographyCardSole
        .map((entry) => `${entry.hint} (productCard[0].${productCardTypographyRepairField(entry.hint)})`)
        .join(", ");
      sections.push(
        `Typography role hint carries a value no product card on this page was measured to use: ${unmeasured}. This role is NOT produced from a probe selector: appendTypographyRoleMirrors either copies the productCard[0] field named after each hint above onto a fresh record verbatim, or tags a record already at that field's (family, weight) within the size tolerance. So every field on a genuine mirror traces to a row of product-card-styles.json. THE REPAIR: copy that card field's own signature onto the row -- family, weight, sizePx and lineHeightPx from the productCard[0] field named above -- which is what the mirror producer would have written. Do NOT copy a row out of text-styles.json: that artifact is the region channel's evidence and holds no value for this role. Do NOT remove the hint: no row carrying the role is anchored here, so an absent hint is a MISSING role rather than an honest gap, and hints are never stripped by hand. Do NOT invent a value, and do NOT re-probe with a narrower selector list to make this message go away. This no longer stops the run -- the kit ships either way -- so the only thing that decides whether the account gets the real card typography is whether you apply the repair.`,
      );
    }
    if (typographyRegionSole.length > 0) {
      const unmeasured = typographyRegionSole.map((entry) => entry.hint).join(", ");
      sections.push(
        `Typography role hint carries a value this page was never measured to use: ${unmeasured}. The capture DOES contain elements the deterministic selector mapper assigns to these roles, so the role is derivable here -- but a row carrying the hint holds a value none of them has. Every field is checked, not just the signature: (family, weight, sizePx) against a row this role's mapper selects, and lineHeightPx / fontStyle / letterSpacingPx / textTransform against a captured row sharing that signature. Copy ONE captured row for the role out of text-styles.json onto that record verbatim -- every field of it, which satisfies both scopes at once -- and re-run. Do NOT remove the hint: no row carrying the role is anchored here, so an absent hint is a MISSING role rather than an honest gap, and hints are never stripped by hand. This no longer stops the run -- the kit ships either way -- so applying the repair is what decides whether the account gets the measured value. Do NOT invent a value, and do NOT re-probe with a narrower selector list to make this message go away.`,
      );
    }
    if (typographyStray.length > 0) {
      const stray = typographyStray
        .map((entry) => `${entry.hint} (anchored on ${entry.anchoredCarrier})`)
        .join(", ");
      sections.push(
        `Typography role hint carries a value this page was never measured to use, on a row that is NOT the role's only carrier: ${stray}. Another record already carries each of these roles and is anchored to the capture, named after each hint above. REMOVE the hint from the row that is not anchored and re-run -- the role stays present and covered, so nothing goes missing. Do NOT edit the anchored record, and do NOT copy a captured row over it: that would overwrite a genuinely measured value to satisfy a gate pointing at a different row. Do NOT invent a value, and do NOT re-probe with a narrower selector list to make this message go away.`,
      );
    }
    if (typographyMissing.length > 0) {
      const missing = typographyMissing.map((entry) => entry.hint).join(", ");
      // W4 — augment the error with one diagnostic line per missing role:
      // target signature (family/weight/sizePx) from the productCard mirror,
      // whether a matching record exists in brand.typography[], and (for
      // always-required roles) just that no record carries the hint. Keeps
      // the message machine-greppable: a single line per role.
      const perRoleLines = typographyMissing
        .map((entry) => `  ${describeRoleResolution(entry.hint, payload)}`)
        .join("\n");
      sections.push(
        `Typography role hint missing: ${missing}. DO NOT author these hints. Naming the row they belong on is what produced tagged price rows on sites with no headings: the only record matching productCard[0] is the price record, so this message used to hand the agent the wrong answer. Report the missing roles with the per-role detail below and CONTINUE: the run records them and the kit persists without them, and every downstream reader of these hints falls through to a default rather than refusing. Stopping here saves nothing. Why the deterministic pass did not produce them is a maintainer question, not a run-time repair.\n${perRoleLines}`,
      );
    }
    roleCoverageRepairs.push({
      path: "$.brand.typography",
      message: sections.join("\n\n"),
    });
  }
  // A5 — hard gate on textColorRoleCoverage severity:"high". Mirror of
  // the typography gate above for the color channel. severity:"warn"
  // (text-styles degenerate) is informational only; only :"high"
  // (text-styles healthy → synthesis should have closed the gap) blocks
  // normalize. See `lib/text-color-role-coverage.js` for rationale.
  if (textColorRoleFindings.length > 0) {
    diagnostics.errors = [
      ...(diagnostics.errors || []),
      ...textColorRoleFindings.map((entry) => ({
        path: "$.brand.colors.textColors",
        message: entry.message,
        hint: entry.hint,
      })),
    ];
    // Same split as the typography channel above, and for the same reason:
    // "stop" is the right instruction for a synthesis failure and the wrong
    // one for a hint the run can legally remove.
    const colorUnmeasured = textColorRoleFindings.filter(isValueNotMeasured);
    const colorMissing = textColorRoleFindings.filter(
      (entry) => !isAuthoredWithoutEvidence(entry) && !isValueNotMeasured(entry),
    );
    const sections = [];
    // Same builder the retry-budget throw above calls. See the typography twin.
    const colorAuthoredSection = authoredTextColorRepairSection(textColorRoleFindings);
    if (colorAuthoredSection) sections.push(colorAuthoredSection);
    if (colorUnmeasured.length > 0) {
      // ONE CONTRACT: set the value back, never strip the hint. This used to
      // say "remove that hint from the row and re-run", which contradicts the
      // hint-preservation rule the same skill blames for past regressions --
      // and it is the worse of the two repairs anyway, because the role is
      // derivable here, so an absent hint is a MISSING role, not a gap.
      // The per-role entry names the derived hex; repeat it here so the
      // instruction is complete without cross-referencing.
      const unmeasured = colorUnmeasured
        .map((entry) => `${entry.hint} -> ${entry.derivedValue || "the synthesised colour"}`)
        .join(", ");
      sections.push(
        `Text-color role hint carries a colour this capture did not measure for it: ${unmeasured}. The synthesis helper CAN derive these roles on this page, and the hex on a row carrying the hint is not a colour text-styles.json measured on any row this role derives from. Set every row carrying the hint to the colour named after the arrow above and re-run. Do NOT remove the hint: the role is derivable on this page, so an absent hint is a MISSING role rather than an honest gap, and hints are never stripped by hand. This no longer stops the run -- the kit ships either way -- so applying the repair is what decides whether the account gets the measured colour. If you are deliberately correcting the helper against the screenshot, record the reason in assembly-diagnostics.json.roleChoiceJustifications["brand.colors.textColors"] first -- the reason must name the role hint, the hex you are keeping and the hex you are overriding, or it excuses every role and every future capture. A justified correction is accepted and kept, a silent one is refused. Do NOT re-probe with a narrower selector list to make this message go away.`,
      );
    }
    if (colorMissing.length > 0) {
      const missing = colorMissing.map((entry) => entry.hint).join(", ");
      sections.push(
        `Text-color role hint missing: ${missing}. DO NOT author these hints, and do not name a row that could carry them. text-styles.json is healthy here, so the deterministic synthesis helper should have closed the gap and did not; why it did not is a MAINTAINER question about lib/text-color-role-synthesis.js, not a repair this run may make. Report the missing roles and CONTINUE: the run records them and the kit persists without them. Stopping here saves nothing.`,
      );
    }
    roleCoverageRepairs.push({
      path: "$.brand.colors.textColors",
      message: sections.join("\n\n"),
    });
  }
  // ONE WRITE, THEN THE SEVERITY QUESTION -- and they are separate statements
  // on purpose. Everything above records what the run found; only the line
  // below decides whether finding it stops the run. Note that BOTH channels'
  // records now reach the file: the old shape threw inside the typography
  // block, so on a payload failing both gates the colour channel's error
  // records were never written at all and the agent saw half the problem.
  //
  // AND THE ANSWER IS NO LONGER "STOP". Every condition these two channels
  // grade is a styling one -- a font family, a weight, a size, a hex, a
  // component role -- and none of them can put a false FACT in the account: no
  // contact, no social URL, no asset URL, no wrong-site identity, no corrupt
  // schema. Those all keep every gate they had. What throwing here bought was
  // nothing: under replace-only persistence a refused run writes nothing, so
  // the account keeps the PREVIOUS run's kit -- another site's brand on a
  // shared org, or nothing at all on a fresh onboarding account. Refusal is a
  // failure mode, not a safe default.
  //
  // The repair prose is recorded above and reaches the agent through
  // `assembly-diagnostics.json` and its summary. It is now advice rather than a
  // gate, and the quality of a soft styling value rests on the agent acting on
  // it -- a deliberate trade, and the reason the value is LABELLED rather than
  // silently published.
  if (roleCoverageRepairs.length > 0) {
    diagnostics.errors = [...(diagnostics.errors || []), ...roleCoverageRepairs];
    await writeDiagnostics(dir, diagnostics, args.pretty);
  }
  // BACKLOG item 21: strip `_provenance: "scaffold-synthesised"` markers
  // before AJV validation. The synth helpers set the marker so the
  // shrinkage-gate's `countableLength` filter (lib/component-shrinkage-gate.js)
  // can exclude these rows from the draft denominator. Schema $defs
  // (`{accent,background,text}ColorToken`, `typographyStyle`,
  // productCardComponent, …) use
  // `additionalProperties: false`, so the marker would fail validation
  // if it reached AJV. The marker lives only in
  // `brandkit.extraction.draft.json` (read by the shrinkage gate); the
  // final `brandkit.extraction.json` is the schema-validated technical handoff
  // to finalize and stays free of those private row markers.
  stripProvenanceMarkers(payload);
  // ATTACHED AFTER THE STRIP, BEFORE THE VALIDATE. `stripProvenanceMarkers`
  // targets the per-row `_provenance` sentinel by key, so it would not touch
  // this map -- but attaching afterwards makes that independent of the strip's
  // implementation rather than a fact about it. Before the validate because the
  // schemas now describe the field, and a key AJV has never seen is exactly
  // what a top-level `additionalProperties: false` exists to catch.
  //
  // RETAINED IN THE TECHNICAL ARTIFACT. The severity split lets a styling value
  // through that this capture could not prove, so finalize needs the grade to
  // produce honest gaps and warnings. `compose_final_brandkit` deliberately
  // omits this diagnostic map from the account-facing Brand Kit: email
  // customization consumes the styling value itself, not its run diagnostics.
  //
  // The role list is the CLOSED set the two gates grade. Not "every hint in the
  // payload": a hint no gate grades has no evidence standing to report, and
  // inventing one would be the same correlate-instead-of-question mistake the
  // gates exist to catch.
  const roleProvenanceDiagnostics = [];
  payload.roleProvenance = buildRoleProvenance(
    payload,
    [...diagnostics.typographyRoleCoverage, ...diagnostics.textColorRoleCoverage],
    [
      ...EVIDENCE_GRADED_TYPOGRAPHY_HINTS,
      ...EVIDENCE_GRADED_PRODUCT_CARD_TYPOGRAPHY_HINTS,
      ...REQUIRED_TEXT_COLOR_ROLE_HINTS,
    ],
    // THE SAME FOUR ARTIFACTS THE TWO GATES WERE HANDED, above. Without them
    // the map read "no unresolved entry names this role" as proof of
    // measurement, and both gates emit NOTHING when they cannot tell -- an
    // empty `text-styles.json`, or a probed-selector sidecar that does not
    // cover the role. Every such role published as `dom-measured / 1.0`.
    {
      textStyles,
      probedSelectors,
      salientRows,
      productRows: technicalProductRows,
      backgroundStyles,
      candidates,
    },
    recoveryEvidence,
    roleProvenanceDiagnostics,
  );
  diagnostics.agentRoleRecovery = [
    ...agentRoleRecoveryDiagnostics,
    ...roleProvenanceDiagnostics,
  ];
  await validateExtractionStage(payload);
  const artifactPath = args.out ? path.resolve(args.out) : path.join(dir, "brandkit.extraction.json");
  // PUBLISH FIRST, RECORD SECOND. The marker and `schemaValidated: true` are
  // claims ABOUT the artifact on disk, so they may only be written once that
  // artifact is on disk. Reversed -- as this did until the reorder -- a
  // normalize that validated cleanly and then failed to write left
  // `schemaValidated: true` and the gate marker describing an artifact that
  // was never published: the previous run's file, or none at all. Reproduced
  // with the artifact path as a directory (EISDIR): exit 1, nothing
  // published, `schemaValidated: true`, `roleCoverageGateVersion: 2`.
  try {
    await writeJson(artifactPath, payload, args.pretty);
  } catch (error) {
    // Same rule every other failure path in this function follows: record the
    // reason, leave the diagnostics marker-free and `schemaValidated: false`,
    // rethrow. That is what makes the finalize-time re-check a no-op on a dir
    // whose normalize failed, and it is now true of a failed WRITE too.
    diagnostics.errors = [
      ...(diagnostics.errors || []),
      {
        path: "$",
        message: `Normalize could not publish ${artifactPath}: ${error && error.message ? error.message : String(error)}`,
      },
    ];
    await writeDiagnostics(dir, diagnostics, args.pretty);
    throw error;
  }
  diagnostics.schemaValidated = true;
  // The marker the finalize-time re-check gates on (`lib/role-coverage-recheck.js`),
  // written HERE and nowhere else: after the publish above, so the marker
  // rides on an artifact that reached the disk. Every earlier
  // `writeDiagnostics` call in this function is a failure path that then
  // throws, and each leaves a marker-free file -- which is what makes the
  // re-check a no-op on a dir whose normalize failed, exactly as on a dir
  // that predates the marker. The ORDER is what holds that together; there is
  // no construction that makes the marker and the artifact one event, and the
  // claim that there was cost a build in which the two could drift apart.
  diagnostics[ROLE_COVERAGE_GATE_FIELD] = ROLE_COVERAGE_GATE_VERSION;
  // AND THE JUSTIFICATION THIS PASS HONOURED, stamped at the same statement
  // and for the same reason. The colour gate's `value_not_measured` escape is
  // a free-text sentence in `assembly-diagnostics.json`, the one artifact the
  // agent hand-edits; without this stamp the finalize-time re-check honours a
  // sentence added AFTER this pass ran, which made the whole colour channel
  // bypassable by writing back the three things the refusal message prints.
  // `priorDiagnostics`, not `diagnostics`, names the input the gate above was
  // actually given -- they hold the same object today (via
  // `carryRoleChoiceJustifications`) and saying so at the source is what keeps
  // that an implementation detail rather than a dependency.
  //
  // HONOURED, AND NOT MERELY PRESENT. This used to digest the sentence alone,
  // so a compliant reason recorded while every colour was still measured --
  // excusing nothing, never read by the gate -- was stamped anyway and became
  // standing authority for a later edit to a hex it already named. The second
  // argument is the deviation list the gate filled as it ran, and an empty one
  // yields `null`: a sentence this pass did not act on is not a sentence this
  // pass may vouch for.
  const honouredJustificationDigest = textColorJustificationDigest(
    priorDiagnostics,
    honouredTextColorDeviations,
  );
  // Absent, not null, when nothing was recorded: a run that never had a
  // justification writes the file it wrote before this stamp existed.
  if (honouredJustificationDigest) {
    diagnostics[ROLE_COVERAGE_JUSTIFICATION_DIGEST_FIELD] = honouredJustificationDigest;
  }
  await writeDiagnostics(dir, diagnostics, args.pretty);
}

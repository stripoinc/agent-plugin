// Text-color role-coverage diagnostic gate (A5). Verifies that
// `brand.colors.textColors[]` carries at least one row tagged
// `heading-text` AND at least one row tagged `body-text` after the
// deterministic synthesis helper (`text-color-role-synthesis.js`) has
// run on the normalize pass.
//
// The downstream customise pipeline's email-generator token compiler
// hard-requires both roles. Absence aborts customise with:
//   `SkillError: Unable to derive required semantic token heading_text
//   from upstream brandkit bundle`
//
// Severity policy:
//   - severity:"high" when text-styles.json is HEALTHY (has at least
//     one row with h1..h6/p selector AND a non-white color). In that
//     case the deterministic synthesis helper should have closed the
//     gap; if a required hint is still missing, either the helper did
//     not run, the agent stripped the synthesised row after it ran, or
//     the helper's selectors/dominant-color filter excluded every
//     evidence row. Normalize must block until the gap is closed.
//   - severity:"warn" when text-styles.json is DEGENERATE (missing on
//     disk, empty array, no h1..h6/p rows, or only `#ffffff` colors).
//     The synthesis helper cannot derive the role from the available
//     evidence, so blocking here would not be actionable — degenerate
//     text-styles is usually a blocked-site or pre-render-fail
//     symptom. The downstream customise pipeline still aborts, but
//     the fix is "author the row from non-text-styles evidence", not
//     "rerun normalize".
//
// Verify-only. Helper does not mutate the payload, does not read
// text-styles.json from disk (caller passes it), and does not throw.
// The block-on-severity:high behaviour lives in the caller
// (`assemble-extraction-stage.js`), mirroring the typography
// role-coverage gate.

import { createHash } from "node:crypto";

import { normalizeHexForCompare } from "./header-link-strip.js";
import {
  textColorRoleEvidence,
  selectorEvidenceIsAbsent,
  EVIDENCE_ABSENT,
  EVIDENCE_ILLEGIBLE_ON_CANVAS,
  EVIDENCE_PRESENT,
  SALIENT_EVIDENCE_PRESENT,
  CAPTURE_UNUSABLE,
  AUTHORED_WITHOUT_EVIDENCE,
  ILLEGIBLE_ON_CANVAS,
  VALUE_NOT_MEASURED,
  ROLE_NOT_PRODUCED,
  textColorValueIsPublishedCandidate,
  textColorValueIsCaptureAnchored,
} from "./role-evidence.js";
import { salientRowsForRole, describeSalientRow } from "./salient-text.js";
// The `roleChoiceJustifications` reader, imported rather than re-written: it
// is the JS half of a Python/JS mirror pair with a parity oracle
// (`_has_role_choice_justification`), and a second reader of the same key
// would be one more thing to keep in step. The TEXT view, not the boolean:
// what the reason says is now load-bearing (see `justificationAdmits`).
import { roleChoiceJustificationText } from "./technical-artifact-blockers.js";
// The synthesiser's own answer for a role, so the refusal can NAME the hex the
// agent must put back and the justification can be bound to the deviation it
// excuses. It is NOT what `textColorValueIsCaptureAnchored` compares against --
// that predicate asks whether the capture measured the hex on one of this
// role's rows, and the derived value is only ever ONE member of that set. It is
// named here because it is the repair that always works, not because it is the
// only admissible value.
import { textColorRoleDerivedValue } from "./text-color-role-synthesis.js";

export const REQUIRED_TEXT_COLOR_ROLE_HINTS = ["heading-text", "body-text"];

const HEADING_SELECTORS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
const BODY_SELECTOR = "p";
const HEADING_OR_BODY_SELECTORS = new Set([
  ...HEADING_SELECTORS,
  BODY_SELECTOR,
]);

const WHITE_HEX = "#ffffff";

// Mirror `typography-role-coverage.js`'s local `normalizeText`.
function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

// Mirror `typography-role-coverage.js`'s local `normalizeUsageHints`.
// Returns a deduped array of trimmed non-empty hint strings.
function normalizeUsageHints(value) {
  const output = [];
  for (const item of Array.isArray(value) ? value : []) {
    const raw = normalizeText(item);
    if (!raw) continue;
    if (!output.includes(raw)) output.push(raw);
  }
  return output;
}

// True when text-styles.json carries at least one h1..h6/p row whose
// color normalises to a `#rrggbb` string distinct from `#ffffff`.
// Exported so unit tests can exercise the helper directly without
// reaching through `textColorRoleCoverageDiagnostics`.
export function isTextStylesHealthy(textStyles) {
  if (!Array.isArray(textStyles) || textStyles.length === 0) return false;
  for (const row of textStyles) {
    if (!row || typeof row !== "object") continue;
    const selector = normalizeText(row.selector).toLowerCase();
    if (!HEADING_OR_BODY_SELECTORS.has(selector)) continue;
    const color = normalizeHexForCompare(row.color);
    if (!/^#[0-9a-f]{6}$/.test(color)) continue;
    if (color === WHITE_HEX) continue;
    return true;
  }
  return false;
}

const HIGH_MESSAGE = (hint) =>
  "missing required text-color role: no `brand.colors.textColors[*].usageHints` carries `" +
  hint +
  "`. text-styles.json contains h1..h6/p rows with non-white colors, so the deterministic synthesis helper (text-color-role-synthesis.js) should have produced this role on the normalize pass — either the helper did not run, the agent stripped the synthesised row after it ran, or the helper's selectors/dominant-color filter excluded every row for an evidence shape it does not yet handle. DO NOT mine the evidence and add the row yourself. This role is derived deterministically or not at all; a row you author asserts a colour the page was never measured to use. Report the missing role and CONTINUE -- the run records it and the kit persists without it. Stopping here saves nothing.";

const GAP_MESSAGE = (hint) =>
  "text-color role `" +
  hint +
  "` is unavailable on this page: the deterministic synthesis helper (text-color-role-synthesis.js) has no row it could derive this colour from — the source rows for this role are absent, or every one of them is `#ffffff`. This is a property of the page, not a fault. CONTINUE THE RUN. The kit persists without this role, the report names it as a gap, and downstream falls through its token chain. Do NOT author a textColors row to fill it, and do NOT stop: stopping here saves nothing, which is strictly worse than saving a kit with a named gap.";

// The colour twin of `typography-role-coverage.js`'s salient gap message, and
// symmetric with it on purpose: every salient row carries the colour it was
// rendered in — colour is in the capture's collapse key precisely so a dark
// heading cannot vanish into a bucket of price-coloured rows — so this channel
// is exactly as able to name what it saw as the typography channel is.
// `GAP_MESSAGE` above is unchanged and still fires whenever the capture holds
// no admissible row, which includes every run that has no such artifact.
// The third missing-role sentence. It exists because the other two would both
// be FALSE here: `GAP_MESSAGE` says the source rows are absent or white (they
// are neither) and `HIGH_MESSAGE` says a producer should have written the role
// and did not (the producer declined, on purpose, and re-running it will
// decline again). Nothing is asked of the agent, because there is nothing to
// do: a colour that cannot be read on the page it was measured on will not
// become readable in an email.
const ILLEGIBLE_GAP_MESSAGE = (hint, derived, canvasHex) =>
  "text-color role `" +
  hint +
  "` was not produced on this page: every colour the deterministic synthesis helper " +
  "(text-color-role-synthesis.js) could derive for it is illegible on this page's own canvas " +
  "(" +
  canvasHex +
  "), under the 3:1 large-text floor" +
  (derived ? " — the colour it would otherwise have published is " + derived : "") +
  ". Publishing it would ship an email whose body copy cannot be read; leaving the role empty " +
  "lets the downstream builder keep its own default, which is legible by construction. This is a " +
  "property of the page, not a fault, and there is NOTHING to repair: do NOT author a textColors " +
  "row for this role, do NOT re-probe, and do NOT stop. CONTINUE THE RUN — the kit persists " +
  "without this role and the report names it.";

const SALIENT_GAP_MESSAGE = (hint, rows) =>
  "text-color role `" +
  hint +
  "` was not produced on this page: the deterministic synthesis helper (text-color-role-synthesis.js) has no row it could derive this colour from — the source rows for this role are absent, or every one of them is `#ffffff`. The selector-free capture (salient-text.json) does hold " +
  rows.length +
  " row(s) whose recorded shape is compatible with this role; the most prominent of them, by that capture's own ranking, is " +
  describeSalientRow(rows[0]) +
  ". A salient row is not a synthesis source: the helper did not derive this colour, and the role is recorded as a gap. CONTINUE THE RUN -- the kit persists without it, the report names it, and downstream falls through its token chain. There is exactly one way to fill it, and no other: a `brand.colors.textColors[]` row may carry `" +
  hint +
  "` only when its hex EQUALS a value this run published in `assembly-diagnostics.json.candidates[\"" + hint + "\"]` on an entry carrying `\"source\": \"salient-text\"`, copied verbatim from there, and the row must be created carrying the hint. Any other colour -- picked off a screenshot, read from a logo, or nudged -- is recorded as an authored hint the capture does not support, and it ships that way: the run no longer stops, so nothing but this rule protects the account from a fabricated colour. If no salient-sourced candidate is published for this role, there is nothing to copy and the gap stands. Do NOT stop on this message: stopping saves nothing, which is strictly worse than saving a kit with a named gap.";

const WARN_MESSAGE = (hint) =>
  "text-color role `" +
  hint +
  "` not present in brand.colors.textColors[*].usageHints, and text-styles.json is degenerate (missing on disk, empty array, has no h1..h6/p rows, or only `#ffffff` colors). The deterministic synthesis helper (text-color-role-synthesis.js) cannot derive this role from the available evidence. Nothing downstream fails because of this. The `SkillError` this message used to threaten has no raiser anywhere in either repo, and `semantic_color` falls through its token chain to a default instead of raising. DO NOT author a textColors row from a logo screenshot, hero image OCR, or a colour picked off the homepage screenshot -- this message asked for exactly that, on the one path where the page evidence is weakest, and a colour invented there is indistinguishable from a measured one. Record the role as unavailable on this run. Normalize continues without blocking — degenerate text-styles is usually a blocked-site or pre-render-fail symptom and gating here would not be actionable.";

// Is EVERY row carrying this hint anchored to a hex this run published for
// it? EVERY, not any, and for the same reason as the typography twin: a second
// row carrying the same role with a colour nobody measured is the fabrication
// being refused, and an `any` reading would let one honest row license it.
function textColorHintIsValueAnchored(textColors, hint, candidates) {
  const carriers = textColorRoleCarriers(textColors, hint);
  // `every` on an empty array is TRUE, so without this line "no carrier" would
  // read as "anchored" and widen the authority. Unreachable from the two
  // production call sites -- `presentHints` is derived from this same array
  // with this same normalizer, so a present hint always has a carrier -- which
  // is why its flipped mutant survives the suite. Kept because it guards the
  // vacuous-truth footgun, not the reachable path; deleting it would leave a
  // widening one refactor away.
  if (carriers.length === 0) return false;
  return carriers.every((row) => textColorValueIsPublishedCandidate(candidates, hint, row));
}

// The present-evidence twin: is EVERY row carrying this hint a colour this
// capture measured on a row this role derives from?
//
// EVERY, not any, and for the same reason as `textColorHintIsValueAnchored`
// above and as the typography twin: a second row carrying the same role with a
// colour nobody measured is the fabrication being refused, and an `any` reading
// would let one honest row license any number of invented ones. Multi-carrier
// is the normal shape, not a corner -- the typography twin holds its region
// role on more than one record in 328 of the 358 kits the saved corpus writes
// (`heading-typography`; 348 for `body-typography`). The colour synthesiser
// writes one row, so a second one is agent-added, which is precisely the act
// this gate exists to judge.
//
// IT WAS PINNED BY NOTHING: flipping `every` to `some` here left all 1470 node
// tests green. Now pinned by "one anchored colour row does not license a
// second" in region-role-capture-anchor.test.js.
const TEXT_COLORS_JUSTIFICATION_PATHS = ["brand.colors.textColors", "colors.textColors"];

// ---------------------------------------------------------------------------
// Binding the escape to the pass that honoured it.
//
// THE HOLE THIS CLOSES. `justificationAdmits` below is the ONLY way past
// `value_not_measured` on the colour channel, and the finalize-time re-check
// (`role-coverage-recheck.js`) re-runs this gate with the
// `assembly-diagnostics.json` that is on disk AT FINALIZE TIME. So a sentence
// added to the sanctioned sidecar AFTER a clean normalize was honoured by a
// pass that never saw it. Reproduced end to end through the real finalize CLI
// on a clean scaffold + normalize, both textColors rows edited to `#ff00ff`
// with no re-normalize: no sidecar sentence -> exit 4, blocked, 2 blockers;
// one hand-added sentence under `.roleChoiceJustifications["brand.colors.
// textColors"]` -> exit 0, composed, promoted. The sentence needs only the
// role name, the kept hex and the derived hex -- all three of which the
// refusal message prints. Typography has no such escape and still blocked on
// the same dir, so this was colour-only.
//
// THE BINDING. `--mode normalize` stamps a digest of the justification IT
// honoured next to the gate marker, on the same success write. The re-check
// re-digests what is on disk and honours the sentence only when the two agree.
// A sentence the pass never saw digests to something the pass never stamped,
// so it is not honoured and the gate refuses exactly as it does with no
// sentence at all.
//
// WHAT IS DIGESTED, AND WHY THAT EXACTLY. The LOWERCASED, TRIMMED text this
// gate reads -- byte-for-byte the string `justificationAdmits` tests, not the
// file, not the whole sidecar. Three consequences, all wanted:
//   - Re-casing or re-indenting the sidecar, or moving the reason between the
//     two paths in `TEXT_COLORS_JUSTIFICATION_PATHS`, changes nothing this
//     gate decides on, so it must not flip the verdict. It does not.
//   - Changing a hex, a role name or a word DOES change the decision input,
//     and the run must say so again by re-running normalize. It must.
//   - Justifications recorded under OTHER field paths (the finalize CLI's
//     empty-array checks read the same key) are not covered, so recording one
//     of those after normalize cannot revoke a colour escape it has nothing
//     to do with.
//
// AND IT IS EXACTLY AS STRONG AS THE MARKER, WHICH IS TO SAY: consistency, not
// tamper-proofing. `assembly-diagnostics.json` is a file the run may write, so
// a run that recomputes the digest -- or simply deletes the marker -- turns
// the whole re-check off. `role-coverage-recheck.js`'s header states that
// honestly and this changes none of it. What it does change is that the
// cheapest bypass is no longer a sentence the refusal message dictated.
const JUSTIFICATION_DIGEST_ALGORITHM = "sha256";

// AND WHAT IS DIGESTED ALONGSIDE IT: THE DEVIATIONS THE SENTENCE ACTUALLY
// EXCUSED. The text alone was not enough, and the gap was not theoretical.
// `textColorJustificationDigest` used to return a digest whenever any
// justification text existed -- it had no knowledge of whether this gate ever
// consulted it -- while the only consumer of a justification is
// `justificationAdmits`, reached below ONLY when a live deviation exists. So a
// compliant sentence recorded while every colour was still measured digested
// and stamped while excusing nothing, and the stamp became standing authority:
// edit the textColors rows afterwards to an unmeasured hex the sentence already
// names, and the re-check finds digest == stamped digest, honours the sentence
// and waves the fabrication through. Reproduced at this module: all colours
// measured -> `[]` from this function (the reason never read) and a digest
// stamped regardless; both rows then edited to `#ff00ff` -> 0 entries with the
// stamp, 2 `value_not_measured` entries without it.
//
// So the digest covers the reason AND the tuple of every deviation it admitted
// -- role, the hexes being kept, the hex the helper derives. Change any of
// those and the recorded stamp no longer describes what is happening, which is
// the same contract `justificationAdmits` already imposes on the sentence
// itself, carried one step further so the STAMP cannot outlive the correction.
//
// AND NOT THE CHEAPER "COUNTERFACTUAL STAMP" -- stamp only when REMOVING the
// justification would produce a `value_not_measured`. That rule was built and
// demonstrated broken: `bindTextColorJustification` below is all-or-nothing per
// FILE (it either keeps the covered paths or strips them), so a reason
// genuinely load-bearing for `heading-text` -- which stamps legitimately under
// that rule -- while also pre-naming `body-text`'s future hex lets a `body-text`
// fabrication through with zero blockers. A per-file gate cannot bind a per-role
// escape; only the tuple does.
//
// CANONICAL FORM. Roles sorted, kept hexes sorted within a role. Nothing here
// depends on the order this gate happens to walk `REQUIRED_TEXT_COLOR_ROLE_HINTS`
// in, or on the order carriers appear on the payload, because neither is a fact
// about the correction being excused.
function canonicalHonouredDeviations(honoured) {
  if (!Array.isArray(honoured) || honoured.length === 0) return null;
  return honoured
    .map((tuple) => {
      const hint = String(tuple?.hint ?? "");
      const kept = (Array.isArray(tuple?.keptHexes) ? tuple.keptHexes : [])
        .map((hex) => String(hex ?? "").trim().toLowerCase())
        .sort()
        .join(",");
      const derived = String(tuple?.derivedHex ?? "").trim().toLowerCase();
      return `${hint}|${kept}|${derived}`;
    })
    .sort()
    .join(";");
}

// The digest of the colour-gate justification recorded in `diagnostics` AS
// HONOURED on `honoured`, or `null` when there is nothing to bind. `null` means
// exactly that: no reason recorded, or a reason this pass never acted on. A
// pass in either state stamps nothing and the re-check strips nothing, so a run
// that never had a load-bearing justification behaves byte-identically to the
// build before this binding existed -- which is now also true of the run that
// records a reason it does not need.
//
// `honoured` is the second channel `textColorRoleCoverageDiagnostics` fills:
// one tuple per hint where `justificationAdmits` returned true.
export function textColorJustificationDigest(diagnostics, honoured = null) {
  const reason = roleChoiceJustificationText(diagnostics, TEXT_COLORS_JUSTIFICATION_PATHS)
    .toLowerCase();
  if (!reason) return null;
  const deviations = canonicalHonouredDeviations(honoured);
  if (!deviations) return null;
  return createHash(JUSTIFICATION_DIGEST_ALGORITHM)
    .update(`${reason}\n${deviations}`, "utf8")
    .digest("hex");
}

// `diagnostics` as the colour gate may read it, given the digest a normalize
// pass stamped and the deviations THIS run's gate honoured under it. Unchanged
// when the recorded justification is the one that pass honoured, excusing the
// same corrections (or when there is nothing to bind); otherwise a shallow copy
// with the covered paths removed, so `justificationAdmits` finds no reason and
// the gate refuses the deviation on its merits.
//
// THE CALLER MUST RUN THE GATE FIRST. `honoured` only exists once the gate has
// been asked, so the binding check comes AFTER the call it constrains rather
// than before it, and a mismatch costs one re-run with the reason stripped. The
// alternative -- digesting the text alone, which is what this did -- cannot
// tell a load-bearing sentence from an unused one, and an unused one stamped is
// standing authority for a fabrication that has not happened yet.
//
// ONLY THE COVERED PATHS ARE REMOVED, never the whole `roleChoiceJustifications`
// object: the same key carries the finalize CLI's empty-array reasons, and an
// unbound colour sentence is no reason to silence those.
export function bindTextColorJustification(diagnostics, stampedDigest, honoured = null) {
  const digest = textColorJustificationDigest(diagnostics, honoured);
  // Nothing to bind: either no reason is recorded, or this run's gate honoured
  // none. In the second case stripping the reason cannot change a single
  // verdict -- a justification acts ONLY through `justificationAdmits` -- so
  // returning the file as read is the same answer, computed cheaper.
  if (!digest) return diagnostics;
  if (typeof stampedDigest === "string" && stampedDigest === digest) return diagnostics;
  const justifications = { ...diagnostics.roleChoiceJustifications };
  for (const fieldPath of TEXT_COLORS_JUSTIFICATION_PATHS) delete justifications[fieldPath];
  return { ...diagnostics, roleChoiceJustifications: justifications };
}

function textColorRoleCarriers(textColors, hint) {
  return textColors.filter(
    (row) => row && typeof row === "object" && normalizeUsageHints(row.usageHints).includes(hint),
  );
}

function textColorHintIsCaptureAnchored(carriers, hint, textStyles) {
  // `every` on an empty array is TRUE, so without this line "no carrier" would
  // read as "anchored" and widen the authority. KNOWINGLY UNPINNED: deleting it
  // leaves every test green, because it is unreachable from the production call
  // site -- `presentHints` is derived from the same array with the same
  // normalizer, so a present hint always has a carrier. Kept for the same
  // reason its two twins are (`textColorHintIsValueAnchored`,
  // `typographyHintIsCaptureAnchored`): it guards the vacuous-truth footgun,
  // not the reachable path, and deleting it would leave a widening one
  // refactor away.
  if (carriers.length === 0) return false;
  return carriers.every((row) => textColorValueIsCaptureAnchored(textStyles, hint, row));
}

// THE ONE ESCAPE, and it is deliberate. `SKILL.md` Phase 3 asks the agent to
// confirm OR CORRECT every pre-tagged field against the saved screenshot, so a
// capture-membership test on its own is still a correction ban for one class of
// correction -- the one whose right answer is a colour no row of this role was
// measured at -- and a correction ban on the colour channel is how a
// wrong-but-measured heading colour ships. It carries less weight than it did
// when the anchor demanded the single dominant hex, because choosing a DIFFERENT
// MEASURED colour for the role no longer needs an escape at all; what is left
// for it is the off-capture correction. A row that deviates is admissible when
// the run has RECORDED WHY, in
// `assembly-diagnostics.json.roleChoiceJustifications` under the field path the
// finalize CLI already uses for its empty-array checks.
//
// BOUND TO THE DEVIATION IT EXCUSES, which a bare presence check was not. The
// key names a FIELD, so "is there a reason under `brand.colors.textColors`"
// answered yes for BOTH text roles at once, for every hex, on every capture,
// for ever -- and `carryRoleChoiceJustifications` copies it into each rewritten
// diagnostics file, so one sentence written once became a permanent site-wide
// opt-out from the colour gate. Reproduced: a reason mentioning only the
// heading admitted `#ff00ff` on `heading-text` AND `#00ff00` on `body-text`;
// re-colouring 127 source rows and re-running scaffold then admitted a
// different pair on a different capture with the reason never restated.
//
// So the reason must NAME the three things that identify the correction: the
// role, the hex being kept, and the hex the helper derives and the agent is
// overriding. Change any one of them -- a second role, a different pick, a
// re-probe that moves the dominant colour -- and the recorded reason no longer
// describes what is happening and the run must say so again. No new vocabulary:
// the value stays the free-text string under the same key that the finalize CLI
// and its Python mirror already read.
//
// THE HEXES ARE MATCHED AS HEXES, NOT AS SUBSTRINGS. `String.includes` was the
// hole under the binding: `deviatingHexes` below falls back to the raw
// lowercased value when the row does not hold a `#rrggbb`, so ANY value that
// happens to occur inside the agent's own sentence was admitted as the hex it
// was "keeping". Reproduced on one storefront through the real assembler, with a reason
// that names both roles and the derived hex but describes a different
// correction: `heading-text` rows valued `e`, `a`, `f0` and `screenshot` all
// normalized exit 0 with an empty `textColorRoleCoverage` and were written
// verbatim to `brandkit.extraction.json`. `screenshot` is a word the refusal
// message itself tells the agent to write, and `f0` is a substring of the hexes
// the reason is required to name -- so the wider the reason, the more it
// admitted.
//
// The fix is to read the reason for `#rrggbb` TOKENS and test set membership.
// It is strictly narrower than what it replaces: every hex a compliant reason
// named is still found, and nothing that is not a hex can be one now. The
// role-name check stays a substring test -- a role name is a word, not a token
// with a lexical form, and `hint` is one of two fixed strings.
//
// The trailing lookahead is the same hole one character further out: without
// it, an 8-digit `#rrggbbaa` in the reason vouches for its own 6-digit prefix,
// which is a DIFFERENT colour. No producer emits 8-digit hex and the refusal
// message never prints one, so this refuses nothing an agent would write.
//
// The `/g` regex is module-level and reused. That is safe HERE and only here:
// `String.prototype.match` with a global regex resets `lastIndex` to 0 and
// returns every match. `test`/`exec` on the same object would be stateful --
// do not switch to them.
const REASON_HEX_TOKEN_RE = /#[0-9a-f]{6}(?![0-9a-f])/g;

function hexTokensIn(reason) {
  return new Set(reason.match(REASON_HEX_TOKEN_RE) || []);
}

function justificationAdmits(priorDiagnostics, hint, keptHexes, derivedHex) {
  if (typeof derivedHex !== "string" || !/^#[0-9a-f]{6}$/.test(derivedHex)) return false;
  if (!Array.isArray(keptHexes) || keptHexes.length === 0) return false;
  const reason = roleChoiceJustificationText(priorDiagnostics, TEXT_COLORS_JUSTIFICATION_PATHS)
    .toLowerCase();
  if (!reason) return false;
  if (!reason.includes(hint)) return false;
  const named = hexTokensIn(reason);
  if (!named.has(derivedHex)) return false;
  return keptHexes.every((hex) => named.has(hex));
}

// The `#rrggbb` on every carrier row this capture did not measure for the role.
function deviatingHexes(carriers, hint, textStyles) {
  const out = [];
  for (const row of carriers) {
    if (textColorValueIsCaptureAnchored(textStyles, hint, row)) continue;
    const hex = normalizeHexForCompare(row?.value);
    out.push(/^#[0-9a-f]{6}$/.test(hex) ? hex : String(row?.value ?? "").trim().toLowerCase());
  }
  return out;
}

// Public API. Returns a (possibly empty) array of diagnostic entries —
// one per missing required role hint. Empty array means full coverage.
//
// Shape per entry:
//   {
//     hint: "heading-text" | "body-text",
//     severity: "high" | "warn",
//     message: string,
//     missingHints: string[],     // all missing roles (not just this entry)
//     textStylesHealthy: boolean,
//     textColorsLength: number,
//   }
//
// `salientRows` is `salient-text.json`'s rows, read through
// `readSalientRows`. Message text only: no severity depends on it, and the
// authored-hint refusal below treats a salient row as absence, exactly as it
// treats no artifact at all. `null` is the pre-salient behaviour.
// `candidates` is this run's `buildCandidates` output. It is the ONE thing
// that can spare a present region role from the authored-without-evidence
// refusal below, and only by matching a hex the run itself printed. Omitting
// it (`null`) publishes nothing, so every present hint under an absence grade
// is refused exactly as it was before this parameter existed.
// `priorDiagnostics` is the `assembly-diagnostics.json` ALREADY on disk when
// this pass started -- the only place the agent's `roleChoiceJustifications`
// can live, since this pass rewrites that file at the end. `null` (no prior
// file, and every caller not taught to pass it) records no justification, so
// the present-evidence refusal below is at its strictest.
// `honoured` is an OUT-PARAMETER, and the only reason it exists: the digest
// that binds the justification has to cover the deviations the justification
// actually excused, and this is the one place that knows them. One tuple is
// pushed per hint where `justificationAdmits` returned true -- `{hint,
// keptHexes, derivedHex}`, the exact three things the sentence is required to
// name. Callers that pass nothing (`null`) get the behaviour they always had;
// the tuples are recorded, never read, by this function.
// `canvasHex` is this page's canvas colour (the kit's `canvas-background` hint,
// else the ranker's top candidate), or `null` when the caller cannot name it.
// It is passed to the evidence grader for the MISSING-role arm only, and the
// asymmetry is the whole of its scope: the canvas decides what the SYNTHESISER
// may publish, so it decides why a role the synthesiser declined is absent. It
// decides nothing about a row somebody already wrote — the carrier branch
// below grades WITHOUT it, so an authored value is judged by exactly the
// predicates that judged it before this parameter existed.
export function textColorRoleCoverageDiagnostics(payload, textStyles, probedSelectors = null, salientRows = null, candidates = null, priorDiagnostics = null, honoured = null, canvasHex = null) {
  const textColors = Array.isArray(payload?.brand?.colors?.textColors)
    ? payload.brand.colors.textColors
    : [];
  const presentHints = new Set();
  for (const row of textColors) {
    if (!row || typeof row !== "object") continue;
    for (const hint of normalizeUsageHints(row.usageHints)) {
      presentHints.add(hint);
    }
  }
  // PROVENANCE, the colour twin. A present hint used to end the enquiry
  // here too. `heading-text` and `body-text` are synthesised deterministically
  // or not at all, so a hint present where the probe PROVES no source row
  // exists was authored -- the exact act #124's WARN message used to ask for
  // ("author a textColors row from a logo screenshot, hero image OCR, or a
  // manual colour pick"), on the one path where the page evidence is weakest.
  // Retiring that instruction did not make the act impossible.
  //
  // `selectorEvidenceIsAbsent`, not `=== EVIDENCE_ABSENT`: the salient grade
  // is absence to every authority decision. A row in a selector-free capture
  // is not something the synthesis helper can derive a colour from, so a page
  // that grew a salient artifact must be refused exactly as it was before.
  //
  // TWO BRANCHES, NOT ONE CONJUNCTION -- the same short-circuit the typography
  // twin had. Under `EVIDENCE_PRESENT` the first term is false, so the value
  // anchor never ran and the hex on the tagged row was compared to nothing: a
  // `#ff00ff` heading colour persisted on any page carrying an `h1`. The
  // present-evidence branch asks the synthesiser what it WOULD have written,
  // because the published-candidate anchor reads salient-lane entries and the
  // salient colour lane returns `[]` the moment the role is derivable.
  //
  // `UNPROVEN` and `CAPTURE_UNUSABLE` are outside both branches exactly as
  // before: they mean the run cannot tell, and a check that fired on "cannot
  // tell" would refuse legitimate kits.
  const authored = [];
  for (const hint of REQUIRED_TEXT_COLOR_ROLE_HINTS) {
    if (!presentHints.has(hint)) continue;
    // THE CANVAS IS NOT CONSULTED FOR A ROLE THAT IS PRESENT. The grade below
    // decides how a row somebody already wrote is judged, and the legibility
    // rule is about what the producer may WRITE. Passing the canvas here would
    // make the same hex on the same page pass or fail depending on who typed
    // it, and would silently drop the `value_not_measured` refusal on any page
    // whose derivable colours are all illegible. So this call is the one it
    // always was.
    const evidence = textColorRoleEvidence(textStyles, hint, probedSelectors, salientRows);
    const base = {
      hint,
      // STYLING WARNS -- see the typography twin. This `base` feeds BOTH the
      // authored-without-evidence and the value-not-measured entries below.
      severity: "gap",
      missingHints: [],
      textStylesHealthy: isTextStylesHealthy(textStyles),
      textColorsLength: textColors.length,
    };
    if (selectorEvidenceIsAbsent(evidence)) {
      // THE BOUNDED EXCEPTION, extending this refusal rather than repealing
      // it: a hex this run published as a candidate for the role is the only
      // thing that may carry it here. Anything else is refused as before.
      if (textColorHintIsValueAnchored(textColors, hint, candidates)) continue;
      authored.push({
        ...base,
        reason: AUTHORED_WITHOUT_EVIDENCE,
        message:
          "text-color role `" + hint +
          "` is present on a `brand.colors.textColors[*].usageHints` array, but the deterministic synthesis helper has no row it could have derived this colour from -- the source rows are absent, or every one of them is `#ffffff` -- and the hex on at least one row carrying it is not a value this run published in `assembly-diagnostics.json.candidates[\"" + hint + "\"]` on an entry marked `\"source\": \"salient-text\"`. So a colour was authored here, and a colour invented from a screenshot or a manual pick is indistinguishable from a measured one. Either set the row to a published candidate hex verbatim, or remove the row\u0027s hint and let the run record the honest gap. Do NOT invent a colour, and do NOT re-probe with a narrower selector list to make this message go away.",
      });
      continue;
    }
    if (evidence !== EVIDENCE_PRESENT) continue;
    const carriers = textColorRoleCarriers(textColors, hint);
    if (textColorHintIsCaptureAnchored(carriers, hint, textStyles)) continue;
    // The colour the helper derives, named in the refusal so the repair is a
    // value the agent can copy rather than a procedure it has to reconstruct,
    // and used to bind the justification to the deviation it excuses.
    const derived = textColorRoleDerivedValue(textStyles, hint);
    const deviating = deviatingHexes(carriers, hint, textStyles);
    if (justificationAdmits(priorDiagnostics, hint, deviating, derived)) {
      // The deviation this sentence just excused, reported so the pass can
      // stamp a digest bound to it rather than to the sentence alone.
      if (Array.isArray(honoured)) {
        honoured.push({ hint, keptHexes: deviating.slice(), derivedHex: derived });
      }
      continue;
    }
    authored.push({
      ...base,
      reason: VALUE_NOT_MEASURED,
      derivedValue: typeof derived === "string" ? derived : null,
      message:
        "text-color role `" + hint +
        "` is present on a `brand.colors.textColors[*].usageHints` array, and the deterministic synthesis helper CAN derive this colour on this page -- but the hex on at least one row carrying it is not a colour this capture measured on a row this role derives from. `text-styles.json` is the record of what was measured; a hex that appears on none of this role\u0027s rows there is either a colour picked off a screenshot or a measured one that was edited afterwards, and a nearby hex is not a nearer truth. THE REPAIR: set every row carrying `" + hint + "` to `" + (typeof derived === "string" ? derived : "the synthesised colour") + "`. Do NOT remove the hint -- the role is derivable on this page, so an absent hint is a MISSING role rather than an honest gap, and hints are never stripped by hand. If you are deliberately correcting the helper against the screenshot, record why in `assembly-diagnostics.json.roleChoiceJustifications[\"brand.colors.textColors\"]` and re-run; the reason must NAME `" + hint + "`, the hex you are keeping (" + (deviating.length ? deviating.join(", ") : "the hex on the row") + ") and the hex you are overriding (" + (typeof derived === "string" ? derived : "the synthesised colour") + "), because a reason that names none of them excuses every role, every colour and every future capture. A silent deviation is refused. Do NOT re-probe with a narrower selector list to make this message go away.",
    });
  }

  const missing = REQUIRED_TEXT_COLOR_ROLE_HINTS.filter(
    (hint) => !presentHints.has(hint),
  );
  if (missing.length === 0) return authored;
  const healthy = isTextStylesHealthy(textStyles);
  // Graded PER ROLE, not per capture. `isTextStylesHealthy` answers one
  // question for both roles ("is any h1..h6 OR p row non-white"), which is
  // why the measured site — 11 non-white `p` rows, zero h1..h6 — reported healthy and
  // then blocked on a `heading-text` its synthesiser could never have
  // produced. The field is kept for readers that already consume it.
  return authored.concat(missing.map((hint) => {
    const evidence = textColorRoleEvidence(textStyles, hint, probedSelectors, salientRows, canvasHex);
    const base = {
      hint,
      missingHints: missing.slice(),
      textStylesHealthy: healthy,
      textColorsLength: textColors.length,
    };
    // A degenerate capture — empty, or no non-white h1..h6/p row anywhere —
    // stays `warn` and non-blocking exactly as before. It is the blocked-site
    // and pre-render-failure shape, and calling it a gap would assert the page
    // lacks the role when we never really looked. This branch is deliberately
    // FIRST so the existing behaviour is untouched.
    if (evidence === CAPTURE_UNUSABLE || !healthy) {
      return { ...base, severity: "warn", message: WARN_MESSAGE(hint) };
    }
    // The capture holds this role's rows and every colour on them is
    // unreadable on the canvas. A gap, like `EVIDENCE_ABSENT`, and named
    // separately because calling it `no_evidence` would be false about a page
    // whose evidence is exactly what is there. `derivedValue` is the colour the
    // helper would have published without the floor, carried so the report can
    // say what was suppressed rather than only that something was.
    if (evidence === EVIDENCE_ILLEGIBLE_ON_CANVAS) {
      const derived = textColorRoleDerivedValue(textStyles, hint);
      return {
        ...base,
        severity: "gap",
        reason: ILLEGIBLE_ON_CANVAS,
        derivedValue: typeof derived === "string" ? derived : null,
        message: ILLEGIBLE_GAP_MESSAGE(hint, derived, canvasHex),
      };
    }
    // Healthy capture, but THIS role has no row its synthesiser could use.
    // The only shape that reaches here is the one that used to be graded
    // `high` and killed the run: that site has 11 non-white `p` rows (healthy)
    // and zero h1..h6, so `heading-text` was demanded from evidence that
    // cannot exist.
    //
    // `reason` stays `EVIDENCE_ABSENT` on both forms — it is the wire value
    // `brandkit_finalize` reads back as `reason: "no_evidence"`, and it is
    // still true: no synthesis source produced this role. The salient rung is
    // a sentence, not a state.
    if (selectorEvidenceIsAbsent(evidence)) {
      const salient = salientRowsForRole(salientRows, hint);
      return {
        ...base,
        severity: "gap",
        reason: EVIDENCE_ABSENT,
        message:
          evidence === SALIENT_EVIDENCE_PRESENT
            ? SALIENT_GAP_MESSAGE(hint, salient)
            : GAP_MESSAGE(hint),
      };
    }
    // See the typography twin: the missing-with-evidence entry is NAMED so it
    // stays tellable apart from the honest gap once both carry `severity: "gap"`,
    // and so the report does not call present evidence `no_evidence`.
    return { ...base, severity: "gap", reason: ROLE_NOT_PRODUCED, message: HIGH_MESSAGE(hint) };
  }));
}

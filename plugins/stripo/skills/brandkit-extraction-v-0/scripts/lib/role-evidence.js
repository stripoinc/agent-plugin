// Can a required region role be derived from this capture AT ALL?
//
// The gate cannot currently tell two things apart, and treats both as
// fatal:
//
//   1. the deterministic producer did not run, or ran and failed to match
//      — a process fault, and the run must stop so someone fixes it;
//   2. this page offers no such evidence — one storefront has zero `h1..h3`,
//      zero `header`/`nav`/`footer` and zero ARIA landmarks, so no probe
//      row exists that any producer could have turned into a heading or
//      region role.
//
// Conflating them means case 2 saves NOTHING, which is the outcome the
// owner ruled against: a less precise kit beats a failed one. This module
// separates them so case 2 can become a recorded gap and the kit persists.
//
// THE DELEGATION RULE, which is the whole correctness argument. Every
// predicate here asks the SAME function the producer asks, never a
// private reimplementation:
//
//   * typography evidence asks `typographyRoleHintsForSelector`, the
//     shipped selector→role mapper, so "is there a row this mapper would
//     tag with this role" is answered by the mapper itself;
//   * text-colour evidence asks the synthesiser's own row selection;
//   * salient evidence asks `salientRowsForRole`, which lives in the module
//     that WRITES `salient-text.json`, so "which recorded rows could support
//     this role" is answered by the producer of the rows. Re-deriving the
//     notion of a heading-shaped row here is exactly the drift below.
//
// A copied predicate drifts from its producer, and the drift is silent
// and one-directional: we would report "no evidence" for a role the
// producer could in fact have derived, and the gap would look honest.
//
// Evidence absence is decided WITHOUT the agent. Requiring an agent to
// declare it would add a failure mode to the one requirement this work
// exists to satisfy — an agent that dies before declaring still fails
// the site.

import { typographyRoleHintsForSelector } from "./typography-selector-role-hints.js";
import {
  textColorRoleIsDerivable,
  textColorRoleSourceTags,
  textColorRoleMeasuredValues,
} from "./text-color-role-synthesis.js";
import { DEFAULT_TEXT_SELECTORS } from "./default-text-selectors.js";
// The producer's OWN family equivalence, used to BUILD the signature group.
// `mergeTypographyByCanonicalFamily` runs on the scaffold and normalize paths
// and rewrites a record's `family` to the most specific string in its class,
// so the record's family is routinely NOT the one on the row the selector
// mapper tagged. One storefront is the measured case: its `heading-typography`
// record at 700/24 carries `Inter, system-ui, sans-serif`, while the `h1..h3`
// rows the mapper tags spell only `Inter, sans-serif`.
//
// What that case does NOT show, and what the comment here used to claim, is
// that the capture spells no such string. It does: `Inter, system-ui,
// sans-serif` is on a peer row in the SAME signature group (measured -- 138 of
// that site's 139 saved `text-styles.json` spell both strings; 1 spells
// neither). So the merge rewrites a family ACROSS the group, never out of it,
// and a raw-string comparison scoped to the group costs nothing. Only a
// comparison scoped to the mapper-tagged row alone would refuse that draft:
// over the 768 saved captures, 136 carry a graded region role at a family
// spelled by a signature peer but by no mapper-tagged row (134 of them that
// storefront, plus two others), against 0 refused by the group-scoped rule.
// `typographyValueIsCaptureAnchored` makes exactly that distinction, and the
// group scoping is the load-bearing half.
import {
  canonicalFontFamily,
  familySpellingKey,
  stripFontWeightNameSuffix,
} from "./product-card-cta-mirrors.js";
// THE PRODUCT-CARD MIRROR PRODUCER, asked rather than modelled. The productCard
// anchor below does not rebuild what `appendTypographyRoleMirrors` emits -- it
// calls the projection that module exports for exactly this reader. See
// `productCardTypographyValueIsMirrorAnchored`.
import {
  extractCtaTypographyEvidence,
  productCardMirrorTypographyRecord,
  PRODUCT_CARD_MIRROR_TYPOGRAPHY_FIELDS,
  TYPOGRAPHY_SIZE_TOLERANCE_PX,
} from "./product-card-cta-mirrors.js";
import { salientRowsForRole, SALIENT_CANDIDATE_SOURCE } from "./salient-text.js";
// THE PRODUCER ITSELF. The capture anchor below builds its comparison record by
// calling this, rather than reading the fields it reads by hand -- a hand-read
// copy of a producer's field access is the drift this whole module exists to
// avoid, and it had already happened here (see the anchor's header).
import { productCardFromRow, typographyFromText } from "./extraction-pass-helpers.js";
// The `reason` vocabulary lives in a LEAF module so `diagnostics-summary.js`
// can read the same spellings without closing an import cycle back through
// `extraction-pass-helpers.js`. Re-exported here so every existing importer
// of this module keeps its import site.
import {
  AUTHORED_WITHOUT_EVIDENCE,
  EVIDENCE_ABSENT,
  ILLEGIBLE_ON_CANVAS,
  ROLE_NOT_PRODUCED,
  VALUE_NOT_MEASURED,
} from "./role-coverage-reasons.js";

export const EVIDENCE_PRESENT = "evidence_present";
export { EVIDENCE_ABSENT };
export const CAPTURE_UNUSABLE = "capture_unusable";
// The capture may be perfectly good; what is unknown is whether the probe
// ever LOOKED for this role's sources. Distinct from CAPTURE_UNUSABLE so the
// two gates can map it themselves — both to their pre-gap behaviour.
export const EVIDENCE_UNPROVEN = "probe_provenance_unproven";
// No selector produced this role AND the selector-free capture
// (`salient-text.json`) holds a row whose recorded shape could support it.
//
// It exists because `EVIDENCE_ABSENT` was being REPORTED as "the page does not
// offer this role", and on a site whose heading no selector can address that
// sentence is false while an artifact in the same run directory records the
// heading and its colour. The run did its best with selectors; it did not do
// its best.
//
// It changes what the run SAYS and nothing else. It carries the SAME severity
// as `EVIDENCE_ABSENT` (`missingRoleIsHonestGap`), and it is absence to every
// authority decision (`selectorEvidenceIsAbsent`) — a salient row is not a
// selector match, cannot produce a role, and must never license one.
export const SALIENT_EVIDENCE_PRESENT = "salient_evidence_present";

// The colour channel only. The capture holds rows this role derives from, and
// every colour on them is under 3:1 against the page's own canvas, so the
// synthesiser publishes nothing rather than a value that cannot be read where
// it will be painted.
//
// NOT AN ABSENCE GRADE, and `selectorEvidenceIsAbsent` deliberately does not
// include it. The two absence grades gate #132's authored-hint refusal, and
// admitting this one there would turn a rule about what the PRODUCER may
// publish into a refusal of a row the AGENT wrote — the same hex, on the same
// page, judged two ways depending on who typed it. What this grade changes is
// the MISSING-role entry's `reason`, and nothing else: a role that is present
// on a row is graded exactly as it was before the canvas was known.
export const EVIDENCE_ILLEGIBLE_ON_CANVAS = "illegible_on_canvas_evidence";

// "No SELECTOR produced this role." Both absence grades say exactly that and
// differ only in what the run can say about the page, so every decision about
// AUTHORITY must treat them as one. Spelled as a function, not repeated as
// `=== EVIDENCE_ABSENT` at four call sites, because the four are what a new
// grade quietly breaks: two of them gate #132's authored-hint refusal (one per
// channel) and two decide severity, and a missed one turns the new grade into
// the excuse that lets a fabricated hint through, or silently moves a gap.
export function selectorEvidenceIsAbsent(evidence) {
  return evidence === EVIDENCE_ABSENT || evidence === SALIENT_EVIDENCE_PRESENT;
}

// Only the five region roles are evidence-graded here. The productCard
// mirrors have a different producer (`appendTypographyRoleMirrors`) and a
// different evidence source (the card record, not the selector probe), and
// the gate already skips them when no card exists. Grading them through the
// selector mapper would find no selector for any of them and downgrade every
// genuine mirror fault to a gap.
//
// Spelled out rather than imported from `typography-role-coverage.js`,
// which imports THIS module: the cycle resolves at runtime but leaves the
// binding in a temporal dead zone depending on which module loads first.
// A test pins this list equal to `ALWAYS_REQUIRED_TYPOGRAPHY_HINTS`, so
// the copy cannot drift silently.
export const EVIDENCE_GRADED_TYPOGRAPHY_HINTS = Object.freeze([
  "heading-typography",
  "body-typography",
  "header-typography",
  "footer-typography",
  "button-typography",
]);

// Spelled out for the SAME reason as the typography list above:
// `text-color-role-coverage.js` imports this module, so importing
// `REQUIRED_TEXT_COLOR_ROLE_HINTS` back from it forms a cycle and the
// binding is in a temporal dead zone whenever the coverage module loads
// first. That is not hypothetical — it was tried, and `node --test`
// threw `Cannot access 'REQUIRED_TEXT_COLOR_ROLE_HINTS' before
// initialization`. A test pins the two lists equal instead.
export const EVIDENCE_GRADED_TEXT_COLOR_HINTS = Object.freeze([
  "heading-text",
  "body-text",
]);

// An empty or absent text-styles capture is a PROCESS fault, not an
// honest gap: it means the probe did not run or returned nothing, and
// grading every role as "no evidence" there would let a broken capture
// save a kit that claims the page has no text. Callers must check this
// first; both graders return CAPTURE_UNUSABLE if they are called anyway.
export function captureIsUsable(textStyles) {
  return Array.isArray(textStyles) && textStyles.length > 0;
}

// Is there at least one captured row the shipped selector mapper would
// tag with this role? If yes, the producer had something to work with and
// a missing hint is its fault. If no, the page simply does not offer it.
export function typographyRoleEvidence(
  textStyles,
  hint,
  probedSelectors = null,
  salientRows = null,
) {
  if (!captureIsUsable(textStyles)) return CAPTURE_UNUSABLE;
  if (!EVIDENCE_GRADED_TYPOGRAPHY_HINTS.includes(hint)) return EVIDENCE_PRESENT;
  for (const row of textStyles) {
    if (!row || typeof row !== "object") continue;
    if (typographyRoleHintsForSelector(row.selector).includes(hint)) {
      return EVIDENCE_PRESENT;
    }
  }
  // Nothing matched. That is only an honest absence if we can prove the
  // probe actually LOOKED for this role. A re-probe overwrites
  // text-styles.json, so a narrowed selector list deletes the evidence a
  // role was derived from, and grading that as a gap would both mint a
  // false "the page does not offer this" AND silently downgrade a real
  // producer fault. Unknown provenance fails closed to the old behaviour.
  if (!roleWasProbed(hint, probedSelectors)) return EVIDENCE_UNPROVEN;
  // Ordered AFTER the provenance check on purpose: an unproven probe stays
  // unproven, because a salient row cannot tell us whether anyone LOOKED.
  // `salientRows == null` — no artifact, every capture written before it
  // existed — yields nothing here, so the grade is what it was.
  if (salientRowsForRole(salientRows, hint).length > 0) return SALIENT_EVIDENCE_PRESENT;
  return EVIDENCE_ABSENT;
}

// Did the probe look for EVERY selector this role derives from?
//
// Any-one-of is not enough. `heading-typography` derives from h1, h2 and h3;
// a probe that asked only about `h1` and found none proves nothing about a
// site that carries all its headings in `<h2>` — and that site is common
// enough that a storefront in our own corpus is one. `null` (no sidecar, e.g. a capture
// written before the sidecar existed) is "unknown", never "yes".
export function roleSourceSelectors(hint) {
  return DEFAULT_TEXT_SELECTORS.filter((selector) =>
    typographyRoleHintsForSelector(selector).includes(hint),
  );
}

export function roleWasProbed(hint, probedSelectors) {
  if (!Array.isArray(probedSelectors) || probedSelectors.length === 0) return false;
  const probed = new Set(probedSelectors.map((s) => String(s).trim().toLowerCase()));
  const sources = roleSourceSelectors(hint);
  if (sources.length === 0) return false;
  return sources.every((selector) => probed.has(selector.toLowerCase()));
}

// Same question for the colour channel, asked of the synthesiser's own
// row selection.
//
// This is where `isTextStylesHealthy` was wrong and why the measured
// storefront stayed fatal even with the typography channel fixed: it answers
// one question for BOTH roles ("is any h1..h6 OR p row non-white"), so its 11
// non-white `p` rows made it report healthy while `heading-text` — which
// synthesises only from h1..h6, of which that site has none — remained
// underivable. Healthy-but-missing then graded `high` and normalize threw.
// Per-role evidence is the fix: `body-text` derivable, `heading-text` not.
//
// `canvasHex` is the page's canvas colour, or `null` for "the caller cannot
// name it" — which is what every caller got before the parameter existed and
// what every caller outside the two coverage lanes still gets. Supplying it
// asks the synthesiser the question it will actually be asked at synthesis
// time (the delegation rule this module's header states), so a role the
// producer declines on legibility grounds is graded as the gap it will be
// rather than as a role that was somehow not produced.
export function textColorRoleEvidence(
  textStyles,
  hint,
  probedSelectors = null,
  salientRows = null,
  canvasHex = null,
) {
  if (!captureIsUsable(textStyles)) return CAPTURE_UNUSABLE;
  if (!EVIDENCE_GRADED_TEXT_COLOR_HINTS.includes(hint)) return EVIDENCE_PRESENT;
  if (textColorRoleIsDerivable(textStyles, hint, canvasHex)) return EVIDENCE_PRESENT;
  // Ordered BEFORE the probe-provenance check on purpose: reaching this line
  // with the ungated answer `true` means the probe not only looked but found
  // this role's rows, so nothing about provenance is unknown — what is true is
  // that every colour on them is unreadable on this page.
  if (canvasHex && textColorRoleIsDerivable(textStyles, hint)) {
    return EVIDENCE_ILLEGIBLE_ON_CANVAS;
  }
  // Same rule as the typography channel, and it was missing here: a narrowed
  // re-probe deletes the rows this role derives from, so "not derivable" only
  // means "the page does not offer it" once the probe is known to have asked.
  if (!colourRoleWasProbed(hint, probedSelectors)) return EVIDENCE_UNPROVEN;
  // The salient rung, symmetric with the typography channel. Every row in the
  // capture carries the colour it was rendered in — that is why colour is in
  // the collapse key — so this channel is exactly as able to name what it saw.
  if (salientRowsForRole(salientRows, hint).length > 0) return SALIENT_EVIDENCE_PRESENT;
  return EVIDENCE_ABSENT;
}

// The probe list is CSS selectors; the synthesiser names element tags. A role
// is probed when every one of its source tags that the default probe list can
// express appears in the list that actually ran.
export function colourRoleSourceSelectors(hint) {
  const tags = new Set(textColorRoleSourceTags(hint));
  return DEFAULT_TEXT_SELECTORS.filter((selector) => tags.has(selector));
}

export function colourRoleWasProbed(hint, probedSelectors) {
  if (!Array.isArray(probedSelectors) || probedSelectors.length === 0) return false;
  const probed = new Set(probedSelectors.map((s) => String(s).trim().toLowerCase()));
  const sources = colourRoleSourceSelectors(hint);
  if (sources.length === 0) return false;
  return sources.every((selector) => probed.has(selector.toLowerCase()));
}


// ---------------------------------------------------------------------------
// THE VALUE ANCHOR
//
// #132 asks ONE question of a region role that is present on a row: did a
// SELECTOR produce it? On a page whose heading no selector can address the
// answer is always no, so the role was unauthorable there -- the gap saved the
// kit and left the role empty, and the agent had nothing it was allowed to do.
//
// This adds a SECOND question, asked only after the first has said no: is the
// value on that row one THIS RUN PUBLISHED, from the selector-free capture, as
// a candidate for this role? The candidates block is deterministic output of
// the same saved artifacts the gate reads, so the check recomputes it rather
// than trusting the row, and "the agent only ever adds a label, never a value"
// -- true as a description of the scaffolder, never enforced anywhere --
// becomes a rule.
//
// IT EXTENDS THE REFUSAL, IT DOES NOT REPEAL IT. Everything outside the
// published set is `authored_without_evidence` exactly as before, and the run
// stops. `candidates == null` -- every caller not taught to pass it, and every
// test written before this existed -- publishes nothing, so nothing anchors
// and every present hint under an absence grade is refused as it was.

// The values this run published for `role` FROM THE SELECTOR-FREE CAPTURE.
//
// CONFINED TO ONE LANE, and that is the whole bound. "A value this run
// published" is too wide: the ranker's heading filter is
// `weight >= 600 && sizePx >= 18` over rows the selector->role mapper may not
// map to this role at all, so a capture can grade `no_evidence` for the role
// while the SELECTOR lane still publishes a candidate for it. Measured across
// 21 captures, 1 site is in that state, and its top publishable value was
// a white 18px/600 bucket of `a` and `button` labels -- a cookie banner, "view
// all", "subscribe" -- at confidence 0.83. THAT CORPUS IS NOT THE SAVED ONE and
// the figure is not reproducible from it: reaching this branch needs
// `text-styles.probed.json`, and 0 of the 768 saved runs carry one (the newest
// predates the sidecar). See docs/brandkit-external-review-fix-plan.md,
// "Corpus provenance". Accepting it would let a CTA style
// ship as the brand's heading font under a rule written to prevent exactly
// that. A selector-lane candidate for a role the mapper did not tag is a
// producer question, never an agent licence.
//
// Tolerant of every shape a missing or malformed candidates block can take: an
// unreadable block, and an entry that does not name its lane, publish nothing
// -- which REFUSES rather than admits.
export function publishedCandidateValues(candidates, role) {
  if (!candidates || typeof candidates !== "object") return [];
  const entries = candidates[role];
  if (!Array.isArray(entries)) return [];
  return entries
    .filter(
      (entry) =>
        entry && typeof entry === "object" && entry.source === SALIENT_CANDIDATE_SOURCE,
    )
    .map((entry) => entry.value);
}

// Family equality AS THE TYPOGRAPHY PRODUCER DEFINES IT, for the capture
// anchor only. `mergeTypographyByCanonicalFamily` groups on
// `stripFontWeightNameSuffix(canonicalFontFamily(family))` and keeps one
// string for the class, so two rows this returns true for are two rows that
// producer would have collapsed into one record. Asking the same function is
// the delegation rule; re-deriving "same font, different fallbacks" here is
// how the check drifts from the pass that rewrote the value.
//
// IT IS THE GROUPING KEY, NOT THE VALUE CHECK. Everything after the first
// comma is invisible to `canonicalFontFamily`, and the suffix strip folds
// `interblack` onto `inter`, so on its own this admits any fallback chain and
// any weight-name variant -- `ProximaNova, totally-invented, fantasy` and
// `ProximaNovaBlack` both persisted verbatim into a real shipped kit through
// it, exit 0 and an empty coverage array. `typographyValueIsCaptureAnchored`
// therefore uses it to FORM the signature group and then requires the family
// STRING to be one that group (or a productCard mirror) actually spells.
//
// NOT used by `typographyValueIsPublishedCandidate`: that one compares against
// a value THIS RUN PRINTED verbatim into a diagnostic, where the only
// admissible difference is how the same string is spelled. Widening it to a
// font-name stem would let `Robotobold` anchor on a published `Roboto`.
function sameCanonicalFamily(a, b) {
  const key = (value) => stripFontWeightNameSuffix(canonicalFontFamily(value));
  const left = key(a);
  return left !== "" && left === key(b);
}

// `familySpellingKey` is the producer's own notion of "the same spelling", and
// the merge partition that keeps a card's stack off a region-role record folds
// exactly what this folds. Two spellings of that rule drift, and the drift is
// one-directional in either direction: fold more here and the gate accepts a
// string the producer treated as foreign, fold less and it refuses one the
// producer deliberately kept.
function sameFamily(a, b) {
  const left = familySpellingKey(a);
  return left !== "" && left === familySpellingKey(b);
}

// Does this typography record carry a value the run published for `role`?
//
// `(family, weight, sizePx)` is the comparison, and deliberately NOT the whole
// of the record: a record and a candidate BOTH carry `lineHeightPx`, and the
// record also carries `letterSpacingPx` / `textTransform` / `fontStyle`. Those
// are not compared. So an anchored row can carry secondary typography fields
// this check never measured -- the anchor binds the identity of the style
// (family, weight, size), not every field on the row.
//
// EXACT, not tolerant. The +/-1px tolerance elsewhere (`findMatchingTypography
// Index`) exists to FIND a row the probe already measured; here the agent is
// copying a value this run printed into a diagnostic, and anything but
// equality is a value nobody measured. A tolerance would be a licence to
// nudge, and nudging a tagged row's `sizePx` is a drift already observed in
// production (`product-card-cta-mirrors.js` records the 20 -> 30 case).
//
// KNOWN RESIDUAL, deliberately not closed here. The capture anchor below now
// compares all seven value fields; this one still compares three, and the
// published value carries a fourth -- `salientTypographyCandidates` emits
// `lineHeightPx` alongside the triple (assemble-candidates.js), so a record
// anchored here may carry a line-height the published candidate does not.
// The remaining three (`fontStyle`, `letterSpacingPx`, `textTransform`) cannot
// be closed at all on this branch: the candidate does not carry them and,
// by definition of the branch, no capture row for the role does either.
// Widening it was NOT attempted because it cannot be sized: reaching this
// branch needs `text-styles.probed.json` AND `salient-text.json`, and 0 of the
// 768 archived runs carry either, so a stricter rule here would ship
// unmeasured against the one path whose whole purpose is to keep a run alive.
// See docs/brandkit-external-review-fix-plan.md, "Corpus provenance".
export function typographyValueIsPublishedCandidate(candidates, role, record) {
  if (!record || typeof record !== "object") return false;
  const weight = record.weight;
  const sizePx = record.sizePx;
  if (!Number.isFinite(weight) || !Number.isFinite(sizePx)) return false;
  return publishedCandidateValues(candidates, role).some(
    (value) =>
      Boolean(value) &&
      typeof value === "object" &&
      sameFamily(value.fontFamily, record.family) &&
      value.fontWeight === weight &&
      value.fontSizePx === sizePx,
  );
}

// The colour twin. A `textColors` row's value IS its hex, so the comparison is
// the hex -- normalised for case and whitespace only, never widened into a
// nearest-colour test. "Close to a published colour" is a colour nobody
// measured, which is the thing being refused.
export function textColorValueIsPublishedCandidate(candidates, role, row) {
  const hex = String(row?.value ?? "").trim().toLowerCase();
  if (!/^#[0-9a-f]{6}$/.test(hex)) return false;
  return publishedCandidateValues(candidates, role).some(
    (value) => typeof value === "string" && value.trim().toLowerCase() === hex,
  );
}

// ---------------------------------------------------------------------------
// THE CAPTURE ANCHOR
//
// The anchor above is reached only after `selectorEvidenceIsAbsent` has said
// "no selector produced this role". `&&` short-circuits, so on every page whose
// selectors DO produce the role -- any page with an `h1`/`h2`/`h3`, which is
// the majority -- the value on the tagged row was never compared to anything.
// The gate asked WHO tagged the row and never WHAT it says.
//
// These two answer the second question, and only on the present-evidence
// branch. They are not the anchor above widened: that one is confined to
// `SALIENT_CANDIDATE_SOURCE` entries, and under `EVIDENCE_PRESENT` the salient
// lane publishes nothing at all, so widening it would refuse every legitimate
// run. A different branch needs a different predicate.
//
// SAME DELEGATION RULE as everything else in this file. Typography asks the
// shipped selector->role mapper which rows are this role's; colour asks the
// synthesiser what it WOULD WRITE. Neither re-derives the producer's answer.

// WHICH FIELDS CAN BE PINNED TO THE ROLE, AND WHICH ONLY TO ITS SIGNATURE.
// Not a judgement -- it is read off the two passes that decide which record
// ends up carrying a role hint.
//
// `dedupeTypographyComponents` groups on `typographyVisualSignature`, which is
// `(family, weight, sizePx)` and NOTHING else, keeps the FIRST peer's other
// fields, and unions every peer's `usageHints` onto it.
// `mergeTypographyByCanonicalFamily` then does the same across a canonical
// family class, and additionally null-backfills `lineHeightPx`,
// `letterSpacingPx`, `fontStyle` and `textTransform` from any peer. So a role
// hint legitimately lands on a record whose secondary fields came from a
// DIFFERENT captured row than the one the mapper tagged -- the producers make
// that happen on purpose, and a role-scoped check on those fields would refuse
// their own output.
//
// The signature the role travels with, and the only part of the record a row
// the mapper tags must itself carry.
const ROLE_SCOPED_TYPOGRAPHY_FIELDS = Object.freeze(["weight", "sizePx"]);

// Everything else. Still anchored -- each must equal the corresponding field of
// SOME captured row sharing this record's signature, which is exactly the set
// the two passes above may draw it from. Nothing on the record is unchecked.
//
// MEASURED, not asserted, by running scaffold + normalize on the UNTOUCHED
// scaffolder draft across all 768 saved captures: role-scoping these four
// refuses 540 of them; signature-scoping them refuses 0. The 540 are not
// fabrications -- they are the dedup keeping one peer's line-height and
// letter-spacing under a hint unioned in from another peer of the same
// signature.
const SIGNATURE_SCOPED_TYPOGRAPHY_FIELDS = Object.freeze([
  "lineHeightPx",
  "fontStyle",
  "letterSpacingPx",
  "textTransform",
]);

function sameTypographyField(left, right) {
  return Object.is(left ?? null, right ?? null);
}

// Is this typography record a value the capture measured for `hint`?
//
// BOTH SIDES GO THROUGH `typographyFromText`, which is the whole correctness
// argument and was the bug. This used to read `row.fontFamily`, `row.fontWeight`
// and `row.fontSizePx` off the capture row by hand while the producer reads
// fallback chains (`row.fontSizePx ?? row.sizePx ?? row.fontSize`, and the same
// for line-height and letter-spacing). Those are not the same question:
// measured over 284926 rows in 768 saved captures, `fontSize` is on 100% of
// rows and `fontSizePx` on 95.55%, so on a capture written without the `*Px`
// fields the producer builds a record the gate then refused. That refusal was
// unrecoverable -- the message says to copy a captured row verbatim, and no
// value can satisfy a comparison against a field the rows do not carry. It fired
// on 27 of the 768 saved captures with ZERO agent edits.
//
// WHAT IS COMPARED, and it is the whole producer record rather than the
// `(family, weight, sizePx)` triple it used to be. A record carries seven
// value fields; three of them being checked is how `lineHeightPx: 999`,
// `letterSpacingPx: 42`, `textTransform: "uppercase"` and `fontStyle: "italic"`
// all persisted into a customer's kit through the real assembler with exit 0
// and an empty coverage array. `usageHints` and `description` are not values --
// the first is the role tag being judged, the second is the agent's prose.
//
// EXACT, not tolerant, for the reasons on `typographyValueIsPublishedCandidate`:
// the +/-1px tolerance elsewhere FINDS a row the probe measured, whereas this
// checks a value AGAINST the measurement, and a tolerance is a licence to nudge.
//
// RECOVERABLE BY CONSTRUCTION, which the version this replaces was not: copying
// any single captured row for the role satisfies both scopes at once, because
// that row is in its own signature group.
export function typographyValueIsCaptureAnchored(textStyles, hint, record) {
  if (!record || typeof record !== "object") return false;
  if (!Array.isArray(textStyles)) return false;
  // The record read THROUGH the producer, so an agent record spelling a field
  // the probe's way (`fontSizePx`) and one spelling it the record's way
  // (`sizePx`) are the same value, exactly as they are to `typographyFromText`.
  const target = typographyFromText(record);
  if (!Number.isFinite(target.weight) || !Number.isFinite(target.sizePx)) return false;
  const produced = [];
  for (const row of textStyles) {
    if (!row || typeof row !== "object") continue;
    produced.push({ row, value: typographyFromText(row) });
  }
  const sameSignature = ({ value }) =>
    sameCanonicalFamily(value.family, target.family) &&
    ROLE_SCOPED_TYPOGRAPHY_FIELDS.every((field) =>
      sameTypographyField(value[field], target[field]),
    );
  const anchoredForRole = produced.some(
    (entry) =>
      typographyRoleHintsForSelector(entry.row.selector).includes(hint) &&
      sameSignature(entry),
  );
  if (!anchoredForRole) return false;
  // The dedup's own group, recomputed from its own signature.
  const group = produced.filter(sameSignature);
  // THE FAMILY STRING ITSELF, not just its canonical class.
  //
  // `sameSignature` above compares families through `sameCanonicalFamily`,
  // which keeps only the first comma-separated name and folds weight-name
  // suffixes onto their stem. So every fallback after the first, and every
  // `-Black`/`bold` variant, passed unmeasured: on a real storefront capture with
  // an otherwise honest draft, `ProximaNova, totally-invented, fantasy` and
  // `ProximaNovaBlack` both normalised with exit 0, an empty
  // `typographyRoleCoverage`, and the string written verbatim into the kit.
  // Worse than inert: `mergeTypographyByCanonicalFamily` breaks ties by
  // LONGEST family string, so a stack padded with fake fallbacks outranks the
  // honest record and is the one that survives.
  //
  // THE GROUP, AND ONLY THE GROUP. A family string reaches a record by three
  // routes: `typographyFromText(row)` copies a capture row's `fontFamily`
  // verbatim, and any such row that could carry THIS record's signature is by
  // construction in `group`; `dedupeTypographyComponents` and
  // `mergeTypographyByCanonicalFamily` spread ONE peer's record and so can only
  // MOVE a string another route already put on a record; and
  // `synthesizeTypographyRecordFromSignature` copies a card's spelling off
  // `productCard[N].{title,price,oldPrice}Typography`. The third route USED to
  // have an arm of its own here, and it is gone. Why is worth stating, because
  // this is the fourth time it has been touched.
  //
  // WHY THE CARD ARM IS NOT HERE. Modelling route 3 means reproducing what the
  // producers would emit, and they cannot be reproduced from what this function
  // is given. The mirror record itself can be (`productCardMirrorTypographyRecord`
  // returns it), but a card's spelling only reaches a record carrying a REGION
  // role by then winning `mergeTypographyByCanonicalFamily`, whose winner is
  // chosen from `payload.brand.typography` -- peers this function does not
  // receive and must not read, because the payload is the artifact under
  // judgement and reading it would let one `jq` line vouch for itself. Measured
  // rather than argued: with the SAME card (`RobotoBold, Arial` at 700/16/40)
  // and the SAME capture rows, running merge + `appendTypographyRoleMirrors`
  // twice emits `button-typography: "Roboto"` when a bare-stem peer is in the
  // payload and `button-typography: "RobotoBold, Arial"` when it is not. One
  // input differs, and it is the one input the gate does not hold.
  //
  // An arm that cannot model the producer approximates it, and every
  // approximation so far has admitted records no producer emits. The version
  // this replaces bound the card's family to the card's `(weight, sizePx,
  // lineHeightPx)` and still took `fontStyle`, `letterSpacingPx` and
  // `textTransform` from arbitrary signature peers, so a card spelling a family
  // with `normal`/`none` licensed that family with `italic`/`uppercase`;
  // reproduced end to end through `--mode normalize` on a synthetic capture,
  // exit 0, empty coverage array, no finalize blocker. It also accepted
  // `RobotoBold, Arial` where the merge always keeps `Roboto`.
  //
  // AND REMOVING IT COSTS THE CORPUS NOTHING, which is what makes removal
  // available rather than merely tidy. Over the 690 archived scaffolder drafts
  // and the 709 archived agent-authored artifacts -- 15346 role-carrying
  // records across 1391 measurable dirs -- the arm is load-bearing on 0 records
  // (accepted with the cards, refused without), and 0 records carry a `family`
  // no `text-styles.json` row spells. Replaying every one of those 690 drafts
  // through `--mode normalize` moves 0 exit codes, and replaying the 709
  // artifacts through the finalize re-check moves 0 dirs in either direction.
  //
  // BOTH OF THOSE NUMBERS ARE BLIND TO THE RESIDUAL BELOW, which is worth
  // saying here rather than leaving a reader to reconcile them. They replayed
  // the drafts ARCHIVED beside each capture -- written by the producers of the
  // day the run happened -- and they compared EXIT CODES. Neither instrument
  // can see a record that only exists after TODAY's scaffolder runs, on a
  // capture whose exit code is already 1 for an unrelated missing role.
  //
  // THE RESIDUAL, AND IT WAS NOT HYPOTHETICAL -- IT IS FIXED, IN THE PRODUCER.
  // The shape is constructible: give the capture a button row spelling
  // `X, sans-serif` and the card the longer `X, ...` at the same signature, and
  // `mergeTypographyByCanonicalFamily` hands the CARD's spelling to the
  // button-typography record -- so a clean draft is refused here. The repair
  // this gate's message prescribes does NOT recover it, and not for the reason
  // one would guess: a captured row for the role does exist (the branch is
  // `EVIDENCE_PRESENT`, which means the mapper tags one), the agent can copy
  // it, and the next merge puts the card's spelling straight back on the
  // repaired record -- measured, exit 1 again.
  //
  // An earlier revision of this comment said the shape does not occur.
  // Scaffolding each of the 1550 saved capture directories with the current
  // code and diffing the SET of `(hint, severity, reason)` triples --
  // `tools/brandkit-draft-coverage-sweep/sweep.mjs` -- finds it on 2 of them,
  // both the same storefront, both `button-typography`.
  //
  // The fix is in the producer, where this comment already said it belonged:
  // `mergeTypographyByCanonicalFamily` now partitions a signature group by
  // whether the capture spells each member's family, so a card's stack can no
  // longer cross onto a region-role record. Head of that sweep: 0 of 1550,
  // 0 coverage entries gained anywhere, and `family` values moved on 6 records
  // across those 2 captures and nowhere else. The predicate below is unchanged,
  // and the tests in `region-role-capture-anchor.test.js` still pin that it
  // refuses the shape -- the pipeline no longer mints it, an agent edit still
  // could.
  //
  // Comparison is `sameFamily`: whitespace-collapsed, trimmed, lowercased.
  // Nothing wider. A tolerant family comparison is `sameCanonicalFamily`,
  // which is the thing being repaired.
  const familyIsSpelled = group.some(({ value }) => sameFamily(value.family, target.family));
  if (!familyIsSpelled) return false;
  return SIGNATURE_SCOPED_TYPOGRAPHY_FIELDS.every((field) =>
    group.some(({ value }) => sameTypographyField(value[field], target[field])),
  );
}

// ---------------------------------------------------------------------------
// THE PRODUCT-CARD ANCHOR
//
// WHY THERE WAS NONE, AND WHY THAT WAS NOT A DECISION. The branch above is
// fenced by `EVIDENCE_GRADED_TYPOGRAPHY_HINTS`, and that fence is correct:
// `typographyRoleEvidence` returns `EVIDENCE_PRESENT` for every hint OUTSIDE
// that list WITHOUT READING A ROW, so lifting the guard would refuse every
// genuine mirror. What was never true is that anything else asked the question.
// Measured through the real gate, A/B with one identical invention
// (`TotallyInvented Sans, fantasy` 900/99px, italic, uppercase, letterSpacing
// 42) moved from role to role: `heading-typography` produces
// `{severity: "high", reason: "value_not_measured"}`, and
// `product-name-typography`, `product-price-typography` and `product-card-cta`
// produce ZERO ENTRIES. Not a quieter entry -- none. So the channel that
// reaches every product email had no provenance signal at all.
//
// WHY THIS ONE CAN BE ANSWERED WHERE THE REGION ARM COULD NOT. The dead arm on
// `typographyValueIsCaptureAnchored` tried to admit a CARD's family onto a
// REGION-role record, and that requires modelling
// `mergeTypographyByCanonicalFamily`, whose winner is chosen from
// `payload.brand.typography` peers the gate does not hold and must not read off
// the artifact under judgement. This asks the opposite question about the
// opposite record, and the answer is in a file: a `product-*` record's value
// comes from `appendTypographyRoleMirrors`, which either SYNTHESISES from
// `card[field]` -- `synthesizeTypographyRecordFromSignature` copies `family`,
// `weight`, `sizePx` and `lineHeightPx` off the same object in one literal --
// or TAGS an existing record that `findMatchingTypographyIndex` matched to that
// same `card[field]` on exact family spelling, exact weight and sizePx within
// `TYPOGRAPHY_SIZE_TOLERANCE_PX`. Both routes end at a card, and the cards come
// from `product-card-styles.json`, which is a probe artifact beside the
// extraction rather than a part of it.
//
// AND THE PRODUCER IS ASKED, NOT RESPELLED. `productCardMirrorTypographyRecord`
// is the projection `product-card-cta-mirrors.js` exports for a reader that has
// to decide whether a record could have come from a card; the CTA half goes
// through `extractCtaTypographyEvidence`, that role's own evidence reader,
// because the CTA signature is not on `productCard[0].cta` at all. A hand-read
// copy of either is the drift this module exists to avoid.
//
// EVERY PROBE ROW, RAW AND UNFILTERED, and both halves of that were measured
// rather than chosen. `appendTypographyRoleMirrors` mirrors `cards[0]` only,
// but which row became `cards[0]` is a property of the artifact being judged.
// And `filterScaffoldProductRows` is the wrong population even for the
// producer: `propagateOldPriceFromProbeRows` runs BEFORE the mirrors and writes
// `card[0].oldPriceTypography` from the dominant signature over the RAW rows,
// so on one storefront the only cards carrying an old-price signature are ones that
// filter drops -- 2 of the 768 saved captures were refused for exactly that,
// with an emission set that came back empty. Reading every raw row is a
// superset of what the producer could have used, which can only ADMIT more,
// never refuse a genuine mirror -- the direction every one of the three dead
// region arms got wrong.
const PRODUCT_CARD_MIRROR_HINT_FIELDS = Object.freeze(
  PRODUCT_CARD_MIRROR_TYPOGRAPHY_FIELDS.map((field) => [
    field,
    field === "titleTypography"
      ? "product-name-typography"
      : field === "priceTypography"
      ? "product-price-typography"
      : "product-old-price-typography",
  ]),
);

// The productCard roles this file grades, spelled out for the SAME reason the
// region list above is: `typography-role-coverage.js` imports this module, so
// importing its constants back forms a cycle whose binding sits in a temporal
// dead zone depending on load order. A test pins this list equal to that
// module's `PRODUCT_CARD_REQUIRED_TYPOGRAPHY_HINTS` +
// `PRODUCT_CARD_CTA_TYPOGRAPHY_HINT` + `OLD_PRICE_REQUIRED_TYPOGRAPHY_HINTS`,
// so the copy cannot drift silently.
export const EVIDENCE_GRADED_PRODUCT_CARD_TYPOGRAPHY_HINTS = Object.freeze([
  "product-name-typography",
  "product-price-typography",
  "product-card-cta",
  "product-old-price-typography",
]);

export const PRODUCT_CARD_CTA_TYPOGRAPHY_ROLE = "product-card-cta";

// Every record the mirror producer could emit for `hint`, given this capture's
// `product-card-styles.json` rows. Read through `typographyFromText`, the same
// producer both sides of every other comparison in this file go through.
function productCardMirrorRecords(productRows, hint) {
  if (!Array.isArray(productRows) || productRows.length === 0) return [];
  const cards = productRows.map((row) => productCardFromRow(row));
  const out = [];
  if (hint === PRODUCT_CARD_CTA_TYPOGRAPHY_ROLE) {
    // The CTA's evidence is on the PROBE ROW, not on `productCard[0].cta`, and
    // the producer reads it two ways: filtered by the assembled card's CTA
    // signature, and -- when the caller passed no signature -- unfiltered. Both
    // are collected, because which one ran is a property of the payload.
    const signatures = [null, ...cards.map((card) => (card?.cta && typeof card.cta === "object" ? card.cta : null))];
    for (const signature of signatures) {
      const evidence = extractCtaTypographyEvidence(productRows, signature);
      // `synthesizeTypographyRecordFromSignature` coerces the two string fields
      // this evidence never carries, so the record it emits is pinned here to
      // the same defaults rather than left undefined.
      if (evidence) out.push(typographyFromText({ ...evidence, fontStyle: "normal", textTransform: "none" }));
    }
    return out;
  }
  const pair = PRODUCT_CARD_MIRROR_HINT_FIELDS.find(([, role]) => role === hint);
  if (!pair) return [];
  for (const card of cards) {
    const emitted = productCardMirrorTypographyRecord(card?.[pair[0]], pair[0]);
    if (emitted) out.push(typographyFromText(emitted));
  }
  return out;
}

// Is this typography record a value some product card measured for `hint`?
//
// THREE SCOPES, and each one is read off a producer rather than chosen.
//
//   ROLE:      `(canonical stem, weight, sizePx +/- TYPOGRAPHY_SIZE_TOLERANCE_PX)`
//              must be a signature some card carries FOR THIS FIELD. That is
//              exactly the window `findMatchingTypographyIndex` admits, and
//              `synthesizeTypographyRecordFromSignature` writes the card's
//              values verbatim, so both mirror routes land inside it. The stem
//              rather than the spelling, because the merge below may rewrite
//              the string afterwards -- see the next scope.
//
//   SPELLING:  the `family` STRING must be one some member of the signature
//              GROUP spells. `mergeTypographyByCanonicalFamily` groups on
//              `(stem, weight, sizePx, lineHeightPx)` and hands the survivor
//              the longest family string in its group, so a mirror record's
//              final spelling can be a `text-styles.json` row's rather than the
//              card's. Measured: refusing that costs 3 records across two
//              storefronts on the untouched scaffolder draft -- one's
//              `product-name-typography` ends up on `Inter, system-ui,
//              sans-serif` where the card spells `Inter, sans-serif`, the same
//              shape already documented on `typographyValueIsCaptureAnchored`.
//              The group is where the merge may draw from, so the group is the
//              scope; `sameFamily`, never `sameCanonicalFamily`, because a
//              stem-wide comparison is what let an invented fallback chain
//              through on the region channel.
//
//   SIGNATURE: `lineHeightPx`, `fontStyle`, `letterSpacingPx` and
//              `textTransform` must each equal SOME group member's. Not
//              role-scoped, and both halves of the group were MEASURED over the
//              768 saved captures rather than argued -- the whole set is 2336
//              product-role records:
//                * the captured rows are load-bearing on 1581 of them across
//                  707 captures. `findMatchingTypographyIndex` TAGS an existing
//                  `text-styles.json`-derived record whenever one sits at the
//                  card's family and weight within the size tolerance, and that
//                  record's secondary fields are the captured row's;
//                * the other product fields' emissions are load-bearing on 1,
//                  and it is the shape a reader would not guess: a
//                  `product-card-cta` role tagged onto the record the OLD-PRICE
//                  half synthesised, so its `lineHeightPx` is the old-price
//                  field's while `extractCtaTypographyEvidence` returns family,
//                  weight and sizePx and no line-height at all.
//              Role-scoping these four refuses 1607 of 2336 -- the producer's
//              own output, on 713 of the 768 captures.
//
// The group is drawn from every product field's emissions plus the capture
// rows, because those are the two artifacts the merge can pick a survivor from.
// It never reads `payload.brand.typography` -- the peers the three dead region
// arms needed and could not have, because the payload is the thing on trial.
//
// WHAT IT COSTS ON THE CORPUS: nothing. Scaffolding all 768 saved captures with
// today's producers and running `normalizeExtraction` on that draft yields 2336
// product-role records, and this predicate refuses 0 of them.
export function productCardTypographyValueIsMirrorAnchored(productRows, textStyles, hint, record) {
  if (!record || typeof record !== "object") return false;
  const target = typographyFromText(record);
  if (!Number.isFinite(target.weight) || !Number.isFinite(target.sizePx)) return false;
  const sameStemAndWeight = (value) =>
    sameCanonicalFamily(value.family, target.family) &&
    Number.isFinite(value.weight) &&
    value.weight === target.weight;
  // The card window is the producer's: exact weight, size within the tolerance
  // `findMatchingTypographyIndex` itself uses.
  const cardSignature = (value) =>
    sameStemAndWeight(value) &&
    Number.isFinite(value.sizePx) &&
    Math.abs(value.sizePx - target.sizePx) <= TYPOGRAPHY_SIZE_TOLERANCE_PX;
  // The merge window is the merge's: exact size, because
  // `mergeTypographyByCanonicalFamily` keys on it exactly.
  const mergeSignature = (value) =>
    sameStemAndWeight(value) && sameTypographyField(value.sizePx, target.sizePx);

  const emittedForRole = productCardMirrorRecords(productRows, hint);
  if (!emittedForRole.some(cardSignature)) return false;

  const group = [
    ...EVIDENCE_GRADED_PRODUCT_CARD_TYPOGRAPHY_HINTS.flatMap((role) =>
      productCardMirrorRecords(productRows, role),
    ).filter(cardSignature),
    ...(Array.isArray(textStyles) ? textStyles : [])
      .filter((row) => row && typeof row === "object")
      .map((row) => typographyFromText(row))
      .filter(mergeSignature),
  ];
  if (!group.some((value) => sameFamily(value.family, target.family))) return false;
  return SIGNATURE_SCOPED_TYPOGRAPHY_FIELDS.every((field) =>
    group.some((value) => sameTypographyField(value[field], target[field])),
  );
}

// The colour twin, and it asks the same PROVENANCE question its typography
// sibling asks: did this capture measure this value on a row this role derives
// from? `textColorRoleMeasuredValues` is built from the synthesiser's own
// `rowsForHeading` / `rowsForBody` selection, so the delegation rule holds --
// the producer decides which rows count, not a predicate re-derived here.
//
// AN EARLIER REVISION ASKED A DIFFERENT QUESTION and it was the wrong one. It
// compared against `textColorRoleDerivedValue`, i.e. "is this the single hex
// `pickDominantColor` would have written" -- a CONFORMANCE test wearing a
// provenance test's name. The gap between the two is not theoretical: on
// one saved run the capture holds `('p', '#000000')` 14 times
// and `('p', '#272727')` twice, the agent kept the measured `#272727` for
// `body-text`, and the gate emitted `value_not_measured` -- a reason string
// that is false about that capture, on a colour nobody invented. Replayed over
// the 709 saved agent-authored artifacts, moving to membership stops refusing
// 66 directories and starts refusing none.
//
// The 4-way taxonomy people reach for here (producer output / other measured
// value / justified deviation / fabrication) collapses to one arm, because
// `pickDominantColor` can only return a colour it counted: the producer's own
// output is always a member of this set. That is structural and it was also
// checked -- across the 768 saved captures the producer answers 1506 role
// instances and every one is a member. The justified-deviation arm already
// exists as `justificationAdmits` in `text-color-role-coverage.js` and is
// untouched. What remains is membership, and its complement -- a hex on no row
// this role derives from -- which is the fabrication being refused.
//
// The bar is deliberately not raised further; both narrower variants were built
// and replayed over the same 709.
//   * A WHITE EXCLUSION answers "will this be legible against its surface",
//     which is a PAIR property this repo has an open defect class for, and
//     banning one hex leaves `#fefefe` through. Measured cost: colour-provenance
//     directories 109 -> 131 (+22), refusal entries 359 -> 404 (+45).
//
//     WHAT THAT DECISION COSTS, SAID PLAINLY: white text roles are publishable
//     on roughly a third of captures. `#ffffff` is admissible for a DERIVABLE
//     role on 272 (capture, role) pairs across 209 of the 768 saved captures --
//     `heading-text` on 64, `body-text` on 208, both roles on 63 -- and 73 of
//     the 342 archived artifacts this build accepts sit on such a capture (93
//     (dir, role) pairs: 20 heading, 73 body).
//
//     AN EARLIER REVISION OF THIS COMMENT SAID WHITE WAS UNREACHABLE, because
//     `textColorRoleIsDerivable` delegates to `pickDominantColor`, which skips
//     white. That bound is real and it is narrow: it covers an ALL-white role
//     and nothing else. One dark row alongside the white ones is enough to
//     escape it, which is the common shape, not the exotic one. Measured on
//     one run's saved capture: the heading rows carry
//     `#f4f4f4` and `#ffffff`, `textColorRoleEvidence` grades the role
//     `EVIDENCE_PRESENT`, `textColorRoleDerivedValue` returns `#f4f4f4`, and
//     `#ffffff` is in the measured set -- so a kit publishing
//     `heading-text: #ffffff` reaches THIS branch and is anchored by it. Under
//     the pre-`c97aeb2` conformance predicate the same kit was refused.
//
//     That is not a reason to add the ban here. Legibility is a property of a
//     PAIR, and the instrument for it already exists in this directory:
//     `wcag-contrast.js` and the paired `header-link` vs `header-background`
//     check in `header-link-contrast-diagnostic.js`, which nobody has yet
//     extended to `heading-text` / `body-text`. That extension is where a white
//     heading should be caught -- against the surface it will be drawn on. A
//     per-hex ban in a PROVENANCE gate answers a different question from the
//     one it would be trying to ask, and still lets `#fefefe` through.
//   * A MINIMUM-COUNT FLOOR of 2 refuses the deterministic producer's OWN
//     derived value, on a row carrying it, in 41 of the 709 directories -- a
//     derived value can legitimately have count 1 (true for some role on 70 of
//     the 768 saved captures). Total cost: colour-provenance 109 -> 177.
export function textColorValueIsCaptureAnchored(textStyles, hint, row) {
  const hex = String(row?.value ?? "").trim().toLowerCase();
  if (!/^#[0-9a-f]{6}$/.test(hex)) return false;
  return textColorRoleMeasuredValues(textStyles, hint).has(hex);
}

// Both coverage channels emit this `reason` for a role that is PRESENT on a
// row while the capture proves nothing could have derived it. It shares
// `severity: "high"` with the missing-role entries, and the two conditions
// are opposites: a missing role is unrepairable at run time, an authored one
// is one `jq` edit from an honest gap. Callers that phrase remediation MUST
// tell them apart, so the spelling lives here rather than in four string
// literals that can drift.
export { AUTHORED_WITHOUT_EVIDENCE };

export function isAuthoredWithoutEvidence(entry) {
  return Boolean(entry) && entry.reason === AUTHORED_WITHOUT_EVIDENCE;
}

// The present-evidence twin, and a SEPARATE spelling because the remediation
// is the opposite one. `authored_without_evidence` means no producer could
// have derived the role here, so removing the hint yields an honest gap and
// the kit persists -- which is what the normalize message tells the agent to
// do. Under `EVIDENCE_PRESENT` removing the hint yields a MISSING role graded
// `high`, so that instruction would swap one fatal state for another. The only
// repair here is to put a measured value on the row, and the two conditions
// need two messages. Reusing one `reason` would merge them at the one place
// that reads it.
export { VALUE_NOT_MEASURED };

export function isValueNotMeasured(entry) {
  return Boolean(entry) && entry.reason === VALUE_NOT_MEASURED;
}

// The MISSING-role twin of the two above, and the third member of the set a
// consumer must be able to select positively. A required role is absent from
// the payload although the capture offers what a producer needed. Until the
// severity split this entry was identified by `severity: "high"` and carried
// no `reason` at all; both coverage channels now name it, so the discriminator
// survives the demotion to `severity: "gap"` and the report can say which of
// the two gap shapes it is looking at.
export { ROLE_NOT_PRODUCED };

// The second honest-gap reason, re-exported beside the other four so a reader
// of this module sees the whole vocabulary. See `role-coverage-reasons.js` for
// why it is not an unresolved reason.
export { ILLEGIBLE_ON_CANVAS };

export function isRoleNotProduced(entry) {
  return Boolean(entry) && entry.reason === ROLE_NOT_PRODUCED;
}

// WHICH MISSING-ROLE ENTRY TO EMIT, given the evidence. Returns `true` for the
// honest gap -- the page offers the role nothing, so nothing could have
// produced it -- and `false` for the producer fault, where the capture DID
// offer what a producer needed (or the run could not tell).
//
// RENAMED FROM `severityForMissingRole`, WHICH RETURNED "gap" | "high" AND NOW
// WOULD BE A LIE. Under the severity split both missing-role entries carry
// `severity: "gap"`; they are told apart by `reason` -- `no_evidence` for the
// first, `role_not_produced` for the second. A function still handing back
// "high" would have named a grade nothing emits, and every reader of it would
// have had to know that.
//
// The salient rung is on the honest-gap side deliberately: it changes the
// sentence the run writes, not what the run may do.
export function missingRoleIsHonestGap(evidence) {
  return selectorEvidenceIsAbsent(evidence);
}

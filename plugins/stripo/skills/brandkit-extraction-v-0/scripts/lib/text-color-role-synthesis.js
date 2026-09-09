// Synthesise `heading-text` / `body-text` / `link-text` role hints into
// `brand.colors.textColors` from `text-styles.json` evidence at normalize
// time. Companion to `appendTypographyRoleMirrors`: where that helper
// synthesises typography records carrying a role hint from probe
// signatures, this helper synthesises (or back-tags) color tokens
// carrying a role hint from text-style probe rows.
//
// Why: the scaffolder seeds `brand.colors.textColors` from a narrow set of
// probe rows (most often only the button-primary text color via
// `preEmitBrandColours`). The agent is expected to populate the remaining
// role-tagged entries, but in practice on most extraction runs the agent
// either leaves `textColors` near-empty or wholesale-rewrites it without
// the `heading-text` / `body-text` hints. The downstream customise
// pipeline then aborts with
//   `SkillError (NO RAISER EXISTS; this consumer was never built) Unable to derive required semantic token heading_text
//   from upstream brandkit bundle`
// even though `text-styles.json` clearly contained `<h1>..<h6>` and `<p>`
// rows with distinct colors. This helper closes that gap deterministically.
//
// Posture (matches `header-link-backfill.js`):
//   - Append-only / additive. Never strips a hint, never removes a row,
//     never re-orders other hints.
//   - Idempotent: if the role hint is already present (on any row or on
//     the matching row), no-op. Running normalize twice does not add
//     duplicate rows or duplicate hints.
//   - White-on-white skip: `#ffffff` is never tagged `heading-text` /
//     `body-text` / `link-text`. White heading/body text is only
//     meaningful on a dark page background, which the helper does not
//     know about here; the simplest safe behaviour is to skip white
//     entirely and let downstream gates surface the gap if it matters.
//   - Canvas-contrast skip: when the caller can name the page's
//     `canvas-background`, a heading / body colour under 3:1 against it is
//     skipped for the same reason white is — it cannot be read where it
//     will be painted. Not synthesising leaves the role an honest gap and
//     the downstream builder on its own default, which is legible by
//     construction; synthesising it ships an unreadable email.
//   - Empty / missing inputs no-op without throwing — same defensive
//     posture as `backfillHeaderLinkFromScopedEvidence`.

import { normalizeHexForCompare } from "./header-link-strip.js";
import { markScaffoldSynthesised } from "./provenance-marker.js";
import { contrastRatio, relativeLuminance, EMAIL_MIN_CONTRAST } from "./wcag-contrast.js";
import { salientFooterLandmarkRows } from "./salient-text.js";

const HEADING_TEXT_HINT = "heading-text";
const BODY_TEXT_HINT = "body-text";
const LINK_TEXT_HINT = "link-text";
const LINK_PROMO_HINT = "link-promo";
const FOOTER_TEXT_HINT = "footer-text";
const FOOTER_BACKGROUND_HINT = "footer-background";

const HEADING_SELECTORS = new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
const BODY_SELECTOR = "p";
const LINK_SELECTOR = "a";

// `link-text` / `link-promo` are the UNSCOPED link roles: the colour of
// an <a> that is not inside a region another synthesiser owns.
// `header-link` / `footer-link` come from `header-link-backfill.js` via
// scoped selectors (`header a`, `nav a`, `footer a`, ARIA-landmark
// variants like `"[role='banner'] a"`), and product-card anchors come
// from the product-card synthesis.
//
// An earlier revision of this comment claimed those compound selectors
// "do not satisfy the `effectiveTag(row) === 'a'` test, so they are
// naturally excluded". That was false against real probe output: every
// scoped anchor row also carries `tag: "a"`, and `effectiveTag`'s
// tag-fallback resolved it, so `nav a` / `footer a` / `header a` rows
// voted in the link tally and were counted a second and third time in
// the `link-promo` coverage ratio below. Across 750 captured runs the
// only unscoped selector the probe ever emits on a `tag: "a"` row is the
// bare `"a"`; every other one names a region, a component, or a class.
// So the link roles select on the row's OWN selector, not on its tag.

// Exported so a caller outside this module inherits the white skip below
// rather than spelling a second `"#ffffff"` of its own: this module owns
// "which colour may carry a text role", and the skip is part of that answer.
export const WHITE_HEX = "#ffffff";

// Browser-default link colors. When a page leaves <a> styling at the
// UA default (no explicit `color:` rule), Chromium normalises hover /
// visited states to one of these four hex values. They overwhelmingly
// indicate "the author forgot to set a link color" rather than "the
// brand link colour is #0000EE", so for the `link-text` role
// synthesis we reject these candidates outright. Heading / body
// synthesis is untouched — those roles never see UA defaults in
// practice and we'd rather not strip a legitimate near-blue heading
// color by accident.
const UA_DEFAULT_LINK_HEXES = Object.freeze(
  new Set(["#0000ee", "#0000ff", "#551a8b", "#800080"]),
);

function rowSelector(row) {
  if (!row || typeof row !== "object") return "";
  return String(row.selector ?? "").trim();
}

// Reject rows whose text content does not represent a real visible text
// run on the page. Probe rows can carry an explicit `selectionSignals`
// block (newer fixtures) that flags icon-only labels, `title=` /
// `aria-label` / `alt=` attribute strings, or `hasUsableVisibleText: false`
// runs — none of those should drive `heading-text` / `body-text` /
// `link-text` color synthesis, because the colour shown on screen for an
// icon-only or attribute-only label is governed by the icon, not by the
// visible-text colour the synth is meant to capture.
//
// Regression class: icon-only <a> rows (textSource=title/alt/aria-label
// or selectionSignals.isIconLike) carrying browser-default link color
// (e.g. #0000EE) get falsely promoted to link-text. Gate them out via
// hasUsableVisibleText + textSource + isIconLike before they vote. This
// gate drops them deterministically while leaving fixtures without
// `selectionSignals` (older / minimal test rows) untouched — the
// default-accept on missing signals keeps existing tests green.
//
// Exported because this is the codebase's single definition of "label that
// exists for assistive tech but never paints". The primary-button ranker
// (assemble-candidates.js) reads the same set to decide whether a control
// is visibly labelled; a new non-visible source must be added HERE only.
export const NON_VISIBLE_TEXT_SOURCES = new Set(["title", "alt", "aria-label"]);

// Would this synthesiser actually produce `hint` from this capture?
//
// Exported for `lib/role-evidence.js`, which grades a missing colour role
// as an honest gap only when the answer is no. It deliberately runs the
// SAME row selection AND the same `pickDominantColor` the synthesiser runs,
// white-skip included, so "derivable" here and "produced" there cannot
// disagree. Answering it with a copied predicate would report an
// honest-looking gap for a role this file could in fact have produced —
// and `#ffffff`-only rows are exactly where a copy goes wrong, because the
// white skip lives inside `pickDominantColor`, not in the row selection.
// Which element tags does this role derive from? Exported for
// `lib/role-evidence.js`, which needs to know whether the PROBE looked for
// them before it may call the role absent. Same delegation rule as
// `textColorRoleIsDerivable`: the sets live here, next to the code that uses
// them, so a probe-provenance check cannot drift from the synthesiser.
export function textColorRoleSourceTags(hint) {
  if (hint === HEADING_TEXT_HINT) return [...HEADING_SELECTORS];
  if (hint === BODY_TEXT_HINT) return [BODY_SELECTOR];
  return [];
}

// WHAT this synthesiser would produce for `hint` from this capture -- the hex
// itself, not merely whether one exists. `null` when it would produce nothing.
//
// It is the same call `synthesizeTextColorRoles` makes below (step 2), so
// "the hex the gate names as the repair" and "the hex the synthesiser writes"
// cannot drift. Two consumers, neither of which is the capture anchor:
// `textColorRoleIsDerivable` just below, and `text-color-role-coverage.js`,
// which prints this value as the recommended repair and binds a recorded
// justification to the deviation it excuses.
//
// `canvasHex` is the page's own canvas colour, and it is the SECOND thing this
// synthesiser refuses to publish a colour against -- see `clearsCanvas` and
// `pickDominantColor`. It defaults to "no gate", which is what every caller
// that cannot name the canvas gets and what every caller got before the
// parameter existed.
export function textColorRoleDerivedValue(textStyles, hint, canvasHex = null) {
  if (hint === HEADING_TEXT_HINT) {
    return pickDominantColor(rowsForHeading(textStyles), { canvasHex })?.color ?? null;
  }
  if (hint === BODY_TEXT_HINT) {
    return pickDominantColor(rowsForBody(textStyles), { canvasHex })?.color ?? null;
  }
  return null;
}

// EVERY `#rrggbb` this capture measured on a row this role derives from.
//
// Exported for `lib/role-evidence.js`'s capture anchor, which asks a
// PROVENANCE question -- "did this capture measure this colour on an element
// this role derives from?" -- and not a CONFORMANCE one. The distinction is
// not academic: `textColorRoleDerivedValue` above answers "which single hex
// would `pickDominantColor` have picked", and an anchor built on it refuses a
// colour the capture plainly holds the moment the agent keeps a non-modal one.
// Measured on one saved run: the capture holds
// `('p', '#000000')` 14 times and `('p', '#272727')` twice, the agent kept
// `#272727` for `body-text`, and the gate refused it as `value_not_measured`
// -- a reason string that is factually false about that capture.
//
// The set is built from the synthesiser's OWN row selection (`rowsForHeading` /
// `rowsForBody`, `isUsableTextEvidence` included) and its OWN validity test, so
// the delegation rule holds exactly as it did for the derived value: a row this
// file would not count cannot anchor a colour, and a value shape it would
// reject is not admissible here either. `textColorRoleSourceTags` returns TAGS
// and would be the wrong accessor -- it cannot see the usability filter.
//
// It is deliberately NOT the whole capture: `#ffffff` is admissible when a role
// row carries it (the white skip lives in `pickDominantColor`, one layer down),
// but a hex measured only on the other role's rows, only on a `button`, or only
// in `background-styles.json` is not. Membership is a real constraint, not a
// formality, and the figures below size THE SET THIS FUNCTION RETURNS -- white
// included, because white is in it. An earlier revision sized it by counting
// the admissible NON-WHITE colours, which is not the set any caller tests
// against; those counts (754 / median 1 / max 3 / 602 exactly-one for
// `heading-text`, 752 / median 3 / max 7 for `body-text`) described a narrower
// set than the predicate uses. Re-measured over the 768 saved captures -- the
// three empty ones return an empty set and fall out of every count, so the
// non-empty 765 give the same figures: `heading-text` admits at least one
// colour on 755 of them, median 1, max 4, and 541 of those 755 admit exactly
// ONE; `body-text` admits at least one on 752, median 3, max 8. A 1-of-1 to
// 1-of-8 constraint, not a formality.
//
// `canvasHex` narrows the set the same way it narrows `pickDominantColor`, and
// it exists for symmetry: this file owns "which colour may carry this role",
// and a caller asking the wider question must be able to ask the narrower one
// from the same export rather than filtering the answer itself.
//
// NO CALLER PASSES IT TODAY, DELIBERATELY. The one consumer is
// `role-evidence.js`'s CAPTURE ANCHOR, and that predicate asks a provenance
// question about a row somebody already wrote -- "did this capture measure this
// hex on an element this role derives from" -- which the canvas cannot answer.
// Narrowing it there would turn a legibility rule about what the SYNTHESISER
// publishes into a refusal of an AGENT-authored row, and this change is scoped
// to the producer.
export function textColorRoleMeasuredValues(textStyles, hint, canvasHex = null) {
  const rows = hint === HEADING_TEXT_HINT
    ? rowsForHeading(textStyles)
    : hint === BODY_TEXT_HINT
      ? rowsForBody(textStyles)
      : [];
  const canvasFloor = normalizeHexForCompare(canvasHex);
  const out = new Set();
  for (const row of rows) {
    const hex = rowColor(row);
    if (!/^#[0-9a-f]{6}$/.test(hex)) continue;
    if (canvasFloor && !clearsCanvas(hex, canvasFloor)) continue;
    out.add(hex);
  }
  return out;
}

export function textColorRoleIsDerivable(textStyles, hint, canvasHex = null) {
  // Delegated to the value above so there is ONE row-selection +
  // dominant-colour path for both questions. `true` for any other hint is
  // unchanged: this file owns only the two region roles, and a hint it does
  // not own must not be graded absent by it.
  if (hint === HEADING_TEXT_HINT || hint === BODY_TEXT_HINT) {
    return textColorRoleDerivedValue(textStyles, hint, canvasHex) !== null;
  }
  return true;
}

export function isUsableTextEvidence(row) {
  if (!row || typeof row !== "object") return false;
  if (row.selectionSignals && typeof row.selectionSignals === "object") {
    if (row.selectionSignals.hasUsableVisibleText === false) return false;
    if (row.selectionSignals.isIconLike === true) return false;
  }
  const textSource = typeof row.textSource === "string"
    ? row.textSource.trim().toLowerCase()
    : "";
  if (textSource && NON_VISIBLE_TEXT_SOURCES.has(textSource)) return false;
  return true;
}

// Effective tag for membership tests. Real probe rows carry both
// `selector` (e.g. `"h1"`, or compound like `"main article h2"`) and an
// explicit `tag` (e.g. `"h1"`). Prefer `selector` when it is a clean
// single-tag name so behaviour matches earlier revisions; otherwise
// fall back to `tag` so compound selectors emitted by future probe
// variants still classify correctly.
const CLEAN_TAG_NAMES = new Set([
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "p",
  "a",
]);

function rowTag(row) {
  if (!row || typeof row !== "object") return "";
  return String(row.tag ?? "").trim().toLowerCase();
}

function effectiveTag(row) {
  const selector = rowSelector(row);
  if (selector && CLEAN_TAG_NAMES.has(selector)) return selector;
  const tag = rowTag(row);
  if (tag && CLEAN_TAG_NAMES.has(tag)) return tag;
  return "";
}

function rowColor(row) {
  if (!row || typeof row !== "object") return "";
  return normalizeHexForCompare(row.color);
}

// `relativeLuminance` is the shared `wcag-contrast.js` one. This module used
// to keep a private copy whose malformed-input fallback was
// `Number.POSITIVE_INFINITY` rather than `null`, so that a bad hex sorted
// last in the "prefer darker" tiebreak. That fallback is unreachable: every
// hex reaching the two tiebreaks below is already a key of a map that only
// accepts `/^#[0-9a-f]{6}$/` (`pickDominantColor`'s `counts`, gated at the
// row loop; `footerColourWeights`' `weights`, gated at its own loop), and on
// a validated lowercase `#rrggbb` the two implementations compute the same
// number.

// Pick the most-frequent color among the supplied rows, counting ONE VOTE PER
// (text, colour) — see the vote-key note above the function itself. Tiebreak:
//   1. darkest by luminance (lower value wins) — heading/body text is
//      typically the darker color on the page;
//   2. first encountered in `textStyles` source order — stable across
//      identical inputs.
//
// White requires a valid measured canvas; when a valid `canvasHex` is
// supplied, skips any color that does not clear
// `EMAIL_MIN_CONTRAST` against it. When `rejectUaDefaults` is true, also skips rows whose normalised color
// is a browser-default link hex (`#0000ee`, `#0000ff`, `#551a8b`,
// `#800080`); this gate exists for the `link-text` role where UA
// defaults are common noise on legacy pages. Heading / body callers
// leave it at the default `false` so a legitimate near-blue heading
// color is not stripped.
//
// Returns `{ color, selectorSamples, totals, winnerCount }`:
//   - `selectorSamples`: deduped list capped to 5, used in the synthesised
//     row's evidence record;
//   - `totals`: Map<color, count> across all surviving rows (kept so
//     downstream callers — currently the multi-color link diagnostic
//     — can inspect the runner-up without re-walking the rows);
//   - `winnerCount`: count for `color` (convenience).
//
// Returns `null` when nothing usable remains after filtering.
// DOES THIS COLOUR CLEAR THE EMAIL LEGIBILITY FLOOR ON THIS PAGE'S CANVAS?
//
// The sibling of the white skip above, and the reason that skip has to stay:
// white is refused because the heading/body roles do NOT know their surface,
// and this is the same refusal made on a surface that IS known. A malformed
// canvas answers `true` -- "no claim" must not silence a role.
//
// The floor is `wcag-contrast.js`'s `EMAIL_MIN_CONTRAST` (3.0, WCAG's
// large-text minimum), the same constant every other email-render contrast
// decision in this tree uses. Measured across 50 saved captures: 1 body-text
// value falls under it (a footer grey at 1.58:1 on a near-white canvas) and 0
// heading-text values do -- so this is a narrow suppression, not a filter.
function clearsCanvas(hex, canvasHex) {
  const ratio = contrastRatio(hex, canvasHex);
  if (ratio === null) return true;
  return ratio >= EMAIL_MIN_CONTRAST;
}

// ONE VOTE PER (TEXT, COLOUR).
//
// The capture records a string once per ELEMENT it is rendered in, so a single
// design decision repeated down the page arrives here as N rows and outvotes
// every other colour by arithmetic alone. That is a property of the page's
// layout, not of its typography: "the notice printed under every product card"
// is one decision whether the grid holds six cards or sixty.
//
// Measured on 62 replayed captures: six identical warning-orange notice rows
// (one string) beat four DISTINCT grey running-copy rows and shipped as
// `body-text`; 64 identical per-card "more" anchors beat 42 distinct event-title
// anchors and shipped as `link-text` — on a site whose nav, titles and venue
// links are all dark and whose red is the logo accent.
//
// Empty text is one string like any other, so N textless anchors of one colour
// cast one vote between them. That is deliberate and it is what was measured:
// `isUsableTextEvidence` does not drop empty-text rows, and the two corrected
// sites both carry a block of them. Do not special-case it.
//
// Counting distinct strings does NOT collapse a colour to one vote: two
// headings of one colour are two decisions and still outvote one repeated
// string. `winnerCount` and `totals` therefore report distinct-text votes, and
// the multi-colour link diagnostic downstream reads the same corrected numbers.
function voteKeyFor(row, color) {
  return `${String(row?.text ?? "").replace(/\s+/g, " ").trim()}|${color}`;
}

function pickDominantColor(rows, { rejectUaDefaults = false, canvasHex = null } = {}) {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const normalizedCanvas = normalizeHexForCompare(canvasHex);
  const canvasFloor = /^#[0-9a-f]{6}$/.test(normalizedCanvas || "") ? normalizedCanvas : null;
  const counts = new Map();
  const firstSeenIndex = new Map();
  const selectorsByColor = new Map();
  const votedTextByColor = new Set();
  for (let index = 0; index < rows.length; index += 1) {
    const row = rows[index];
    const color = rowColor(row);
    if (!color) continue;
    // The /^#([0-9a-f]{6})$/ check rejects non-hex / transparent
    // values (rgba(...) with alpha 0 normalizes to "transparent" upstream).
    if (!/^#([0-9a-f]{6})$/.test(color)) continue;
    if (color === WHITE_HEX && !canvasFloor) continue;
    if (canvasFloor && !clearsCanvas(color, canvasFloor)) continue;
    if (rejectUaDefaults && UA_DEFAULT_LINK_HEXES.has(color)) continue;
    // The dedupe governs the VOTE only. `firstSeenIndex` (the source-order
    // tiebreak) and `selectorsByColor` (the evidence record printed in the
    // synthesised row's description) are provenance, not votes, and stay
    // complete over every surviving row — so a colour whose winner does not
    // change keeps byte-identical evidence prose.
    const voteKey = voteKeyFor(row, color);
    if (!votedTextByColor.has(voteKey)) {
      votedTextByColor.add(voteKey);
      counts.set(color, (counts.get(color) || 0) + 1);
    }
    if (!firstSeenIndex.has(color)) firstSeenIndex.set(color, index);
    const selector = rowSelector(row);
    if (!selectorsByColor.has(color)) selectorsByColor.set(color, []);
    const bucket = selectorsByColor.get(color);
    if (selector && !bucket.includes(selector)) bucket.push(selector);
  }
  if (counts.size === 0) return null;
  let winner = null;
  let winnerCount = -1;
  let winnerLuminance = Number.POSITIVE_INFINITY;
  let winnerFirstSeen = Number.POSITIVE_INFINITY;
  for (const [color, count] of counts) {
    if (count > winnerCount) {
      winner = color;
      winnerCount = count;
      winnerLuminance = relativeLuminance(color);
      winnerFirstSeen = firstSeenIndex.get(color);
      continue;
    }
    if (count === winnerCount) {
      const luminance = relativeLuminance(color);
      if (luminance < winnerLuminance) {
        winner = color;
        winnerLuminance = luminance;
        winnerFirstSeen = firstSeenIndex.get(color);
        continue;
      }
      if (luminance === winnerLuminance) {
        const seen = firstSeenIndex.get(color);
        if (seen < winnerFirstSeen) {
          winner = color;
          winnerFirstSeen = seen;
        }
      }
    }
  }
  if (!winner) return null;
  const selectorSamples = (selectorsByColor.get(winner) || []).slice(0, 5);
  return { color: winner, selectorSamples, totals: counts, winnerCount };
}

// Chroma of a `#rrggbb` hex: the span between its strongest and weakest
// channel, as a fraction of the full 8-bit range. Returns 0 for
// malformed / null / non-string input so the gates below reject it.
//
// This is deliberately NOT `colour.js`'s `hexSaturation` (HSL), which
// the split gate below used to call. HSL saturation divides that same
// channel span by `1 - |2L - 1|`, a quantity that goes to zero at both
// ends of the lightness axis — so near white and near black the
// quotient approaches 0/0 and a one-bit channel difference scores as
// fully saturated. Measured: `#fcfeff` spans 3/255 and scores
// hexSaturation 1.000; `#0c061a` spans 20/255 and scores 0.767; the
// exactly-neutral `#fefefe` scores 0. Chroma is the numerator alone, so
// the same three colours read 0.012, 0.078 and 0.000 — "how much colour
// is in this colour", at every lightness.
//
// Kept local rather than promoted to `colour.js` per that module's own
// stated policy: only true cross-file duplicates belong there, and this
// helper has one consumer.
function hexChroma(hex) {
  const match = /^#([0-9a-f]{6})$/i.exec(hex || "");
  if (!match) return 0;
  const body = match[1];
  const channels = [
    parseInt(body.slice(0, 2), 16),
    parseInt(body.slice(2, 4), 16),
    parseInt(body.slice(4, 6), 16),
  ];
  return (Math.max(...channels) - Math.min(...channels)) / 255;
}

// One bar separates "near-neutral" from "brand-saturated" for the split
// test below. Above it a colour is a brand colour; below it, a grey.
//
// Measured over the 666 captured runs in the run corpus that carry two
// or more link colours, the runner-up chroma distribution is bimodal:
// the neutral cluster tops out at 0.122 (`#637282`, a slate grey, 114
// runs) and the brand cluster starts at 0.373 (`#3b6d9a`), with one
// single-run observation (0.243) in between. Bars of 0.25 / 0.30 / 0.35
// all select the identical 89-run mint set, so the choice sits on a
// plateau rather than a tuned point; 0.30 is the plateau's centre and
// the furthest point from both clusters. Calibration references:
// `#5285cc` = 0.478 and `#337ab7` = 0.518 (real brand link blues that
// must pass), `#e50000` = 0.898, `#fcfeff` = 0.012 (must fail).
//
// It replaces a PAIR of HSL thresholds (winner < 0.2, secondary > 0.5)
// whose gap left colours in [0.2, 0.5] neither grey nor brand.
//
// Chroma is the only test here; there is deliberately no contrast floor
// against `canvas-background`. Contrast INSTEAD of chroma is not the
// rule — it takes the mint set from ~110 runs to ~490, nearly all of
// them greys, which would make `link-promo` mean "the second most
// common link colour". Contrast ALONGSIDE chroma changed zero runs in
// the corpus, so it would have been an inert gate.
//
// Know the margin, though: that inertness is one coverage point deep.
// The single corpus candidate that clears this bar and still fails 3:1
// is `#ff8516` — chroma 0.914, 2.44:1 on white — and it sits at 24%
// coverage, one point under the 25% gate below. A capture of that shape
// at 25% would mint a 2.44:1 orange and the "changes zero runs"
// justification would no longer hold. If one turns up, the fix is a
// contrast floor against the kit's own `canvas-background` (never a
// hardcoded white — 50 captured runs carry a dark canvas), reusing
// `wcag-contrast.js`'s `EMAIL_MIN_CONTRAST`.
const BRAND_CHROMA_MIN = 0.3;

// Detect the "near-gray nav majority + saturated promo minority" split
// in link-role evidence and:
//   1. Emit an `info` diagnostic with the two colors and coverage (kept
//      from the original Tier-L2 deferral note — useful for fleet
//      sweeps).
//   2. Synthesise a `link-promo` textColors row carrying the saturated
//      secondary hex (BACKLOG item 38). Same gates as the diagnostic:
//        - winner chroma below the bar (the majority is near-gray)
//        - secondary chroma at or above it (the minority is a brand
//          colour)
//        - secondary coverage >= 25% of the winner (not a one-off
//          outlier)
//      The synthesis path mirrors `synthesizeTextColorRoles`'s
//      "append-to-existing-row OR append-new-row" pattern and is
//      idempotent on a second pass.
//
// Only the single max-count runner-up is tested; the gate does not walk
// further down the tail looking for a candidate that passes. On the
// allo capture that motivated this fix, the next passing colour
// (`#5285cc`, the site's real link blue) reaches 28 of 147 unscoped
// anchor rows = 19%, under the 25% coverage bar — so iterating would not
// have recovered it there either, and on a site with no promo colour it
// would turn a two-way majority/minority test into a search over the
// tail. No evidence for the split ⇒ no row.
function diagnoseAndSynthesizeSecondaryLink(dominant, colors, diagnostics) {
  if (!dominant || !(dominant.totals instanceof Map)) return;
  if (!colors || typeof colors !== "object") return;
  if (!Array.isArray(colors.textColors)) return;
  const winner = dominant.color;
  const winnerCount = dominant.winnerCount;
  if (!winner || !winnerCount || winnerCount <= 0) return;
  if (hexChroma(winner) >= BRAND_CHROMA_MIN) return; // winner is itself a brand colour → no split signal.
  let bestSecondary = null;
  let bestSecondaryCount = 0;
  for (const [color, count] of dominant.totals) {
    if (color === winner) continue;
    if (count > bestSecondaryCount) {
      bestSecondary = color;
      bestSecondaryCount = count;
    }
  }
  if (!bestSecondary) return;
  const coverage = bestSecondaryCount / winnerCount;
  if (coverage < 0.25) return;
  if (hexChroma(bestSecondary) < BRAND_CHROMA_MIN) return;
  const coveragePct = Math.round(coverage * 100);
  if (Array.isArray(diagnostics)) {
    diagnostics.push({
      severity: "info",
      path: "$.brand.colors.textColors",
      message: `Detected secondary saturated link color ${bestSecondary} covering ${coveragePct}% alongside winner ${winner}; tagged as link-promo.`,
    });
  }

  // Idempotency: skip the synthesis when ANY existing textColors row
  // already carries `link-promo` (a second pass on the same evidence
  // must not duplicate the row or the hint).
  for (const row of colors.textColors) {
    if (!row || typeof row !== "object") continue;
    const hints = Array.isArray(row.usageHints) ? row.usageHints : [];
    if (hints.includes(LINK_PROMO_HINT)) return;
  }

  // Step 1: append to an existing row at the same hex (e.g. brand-
  // primary-accent at `#E50000` ⇒ tack `link-promo` onto its hints).
  const targetKey = normalizeHexForCompare(bestSecondary);
  if (!targetKey) return;
  for (const [index, row] of colors.textColors.entries()) {
    if (!row || typeof row !== "object") continue;
    const rowKey = normalizeHexForCompare(row.value);
    if (!rowKey || rowKey !== targetKey) continue;
    const hints = Array.isArray(row.usageHints) ? row.usageHints : [];
    if (hints.includes(LINK_PROMO_HINT)) return;
    row.usageHints = [...hints, LINK_PROMO_HINT];
    if (Array.isArray(diagnostics)) {
      diagnostics.push({
        severity: "info",
        path: `$.brand.colors.textColors[${index}].usageHints`,
        action: "appended-hint",
        hint: LINK_PROMO_HINT,
        value: row.value,
      });
    }
    return;
  }

  // Step 2: append a new textColors row carrying the link-promo hint.
  const newRow = markScaffoldSynthesised({
    value: bestSecondary,
    description: `Auto-synthesised from text-styles.json secondary saturated link evidence (covering ${coveragePct}% of <a> rows).`,
    usageHints: [LINK_PROMO_HINT],
  });
  const newIndex = colors.textColors.length;
  colors.textColors.push(newRow);
  if (Array.isArray(diagnostics)) {
    diagnostics.push({
      severity: "info",
      path: `$.brand.colors.textColors[${newIndex}]`,
      action: "appended-row",
      hint: LINK_PROMO_HINT,
      value: bestSecondary,
    });
  }
}

// Exported for `lib/role-evidence.js`, which must ask THIS function
// whether a colour role is derivable rather than reimplementing the
// selection. A copy would drift and then report an honest-looking gap for
// a role this synthesiser could in fact have produced.
// Collect the rows whose effective tag is a heading (h1..h6). Uses the
// `selector` field when it's a clean single-tag name and falls back to
// `row.tag` when the selector is empty or compound (e.g. probe variants
// emitting `"main article h2"`).
function rowsForHeading(textStyles) {
  return (Array.isArray(textStyles) ? textStyles : []).filter(
    (row) =>
      HEADING_SELECTORS.has(effectiveTag(row)) && isUsableTextEvidence(row),
  );
}

// Collect <p> rows (selector OR tag).
function rowsForBody(textStyles) {
  return (Array.isArray(textStyles) ? textStyles : []).filter(
    (row) => effectiveTag(row) === BODY_SELECTOR && isUsableTextEvidence(row),
  );
}

// Collect unscoped <a> rows. Unlike heading / body — which are defined
// by their tag wherever they appear, so `effectiveTag`'s tag-fallback is
// right for them — the link role is defined by the ABSENCE of a scope:
// a scoped anchor belongs to whichever synthesiser owns that scope
// (`header-link-backfill.js` for regions, the product-card pass for
// card titles). The tag-fallback cannot express that, because a scoped
// anchor's tag is `"a"` just like an unscoped one's. Match the row's own
// selector instead.
function rowsForLink(textStyles) {
  return (Array.isArray(textStyles) ? textStyles : []).filter(
    (row) => rowSelector(row) === LINK_SELECTOR && isUsableTextEvidence(row),
  );
}

// Mutates `brandkit.brand.colors.textColors` in place. Three role hints
// are considered: `heading-text`, `body-text`, `link-text`. For each:
//   1. If any existing textColors row already carries the hint → no-op.
//   2. Otherwise derive the dominant color from the relevant text-styles
//      rows (white skipped).
//   3. If an existing row's `value` matches the derived color, append the
//      hint to that row's `usageHints` array (idempotent on the hint).
//   4. Else append a fresh row carrying just the hint plus an `evidence`
//      block naming the text-styles selectors that produced it.
//
// Each action records one diagnostic entry. Severity is `info` — append
// is non-blocking and the role-coverage gate (if added later for text
// colors) would surface the genuine missing-evidence case.
//
// Diagnostic shape mirrors `backfillHeaderLinkFromScopedEvidence`:
//   { severity, path, action, hint, value }
//   - `action: "appended-hint"` → hint added to an existing row
//   - `action: "appended-row"` → new textColors row appended
//   - `action: "no-op-already-tagged"` → silent (no diagnostic emitted)
//   - `action: "no-op-no-evidence"` → silent (no diagnostic emitted)
//
// `canvasHex` gates HEADING AND BODY ONLY, and the omission of `link-text` is
// deliberate rather than an oversight. A link is allowed to be a brand colour
// that a body paragraph could not be, the `link-promo` split above states in
// writing that a contrast floor there takes the mint set from ~110 runs to
// ~490 and makes the role mean something else, and no measured link value in
// the corpus is under the floor anyway. The two roles gated here are the two
// the downstream builders paint as running text on the canvas.
export function synthesizeTextColorRoles(brandkit, textStyles, diagnostics = [], canvasHex = null) {
  if (!brandkit || typeof brandkit !== "object") return;
  const colors = brandkit?.brand?.colors;
  if (!colors || typeof colors !== "object") return;
  if (!Array.isArray(colors.textColors)) return;
  if (!Array.isArray(textStyles) || textStyles.length === 0) return;

  const roleSpecs = [
    { hint: HEADING_TEXT_HINT, rows: rowsForHeading(textStyles), rejectUaDefaults: false, canvasHex },
    { hint: BODY_TEXT_HINT, rows: rowsForBody(textStyles), rejectUaDefaults: false, canvasHex },
    // `link-text` role: <a> rows on legacy pages often inherit UA-default
    // unvisited/visited link colors (#0000EE etc.). Reject those candidates
    // so the synthesised `link-text` color reflects an explicit author
    // choice instead.
    { hint: LINK_TEXT_HINT, rows: rowsForLink(textStyles), rejectUaDefaults: true, canvasHex: null },
  ];

  for (const { hint, rows, rejectUaDefaults, canvasHex: roleCanvasHex } of roleSpecs) {
    // Step 1: idempotency — skip silently if any existing row already
    // carries this hint. Running normalize twice must not add a duplicate
    // row.
    let alreadyTagged = false;
    for (const entry of colors.textColors) {
      if (!entry || typeof entry !== "object") continue;
      const hints = Array.isArray(entry.usageHints) ? entry.usageHints : [];
      if (hints.includes(hint)) {
        alreadyTagged = true;
        break;
      }
    }
    if (alreadyTagged) continue;

    const dominant = pickDominantColor(rows, { rejectUaDefaults, canvasHex: roleCanvasHex });
    if (!dominant) continue;
    if (hint === LINK_TEXT_HINT) diagnoseAndSynthesizeSecondaryLink(dominant, colors, diagnostics);

    // Step 3: if an existing row's value matches the derived color,
    // append the hint to that row.
    const targetKey = normalizeHexForCompare(dominant.color);
    let appendedToExisting = false;
    for (const [index, entry] of colors.textColors.entries()) {
      if (!entry || typeof entry !== "object") continue;
      const entryKey = normalizeHexForCompare(entry.value);
      if (!entryKey || entryKey !== targetKey) continue;
      const hints = Array.isArray(entry.usageHints) ? entry.usageHints : [];
      if (!hints.includes(hint)) {
        entry.usageHints = [...hints, hint];
        diagnostics.push({
          severity: "info",
          path: `$.brand.colors.textColors[${index}].usageHints`,
          action: "appended-hint",
          hint,
          value: entry.value,
        });
      }
      appendedToExisting = true;
      break;
    }
    if (appendedToExisting) continue;

    // Step 4: append a new row. Schema requires `value`, `description`,
    // `usageHints` on every textColors row, and `value` must match
    // `^#[0-9a-f]{6}$` (extraction-stage.schema.json $defs.textColorToken).
    // `dominant.color` is a probed `#rrggbb`, so it conforms. Selectors land
    // on a non-schema `evidence` key — strip-on-emit if a future schema
    // iteration forbids it.
    const newRow = markScaffoldSynthesised({
      value: dominant.color,
      description: `Auto-synthesised from text-styles.json ${hint.split("-")[0]} rows (selectors: ${dominant.selectorSamples.join(", ")}).`,
      usageHints: [hint],
    });
    const newIndex = colors.textColors.length;
    colors.textColors.push(newRow);
    diagnostics.push({
      severity: "info",
      path: `$.brand.colors.textColors[${newIndex}]`,
      action: "appended-row",
      hint,
      value: dominant.color,
      selectorSamples: dominant.selectorSamples,
    });
  }
}

// ---------------------------------------------------------------------------
// FOOTER-TEXT
//
// The static email builders read nine colour hints, and `footer-text` is the
// one no producer in this repo has ever written: measured across 50 saved
// technical dirs and 44 stored kits, the role appears zero times. A missing
// hint is not loud -- the builder silently falls back to the reference
// template's own colour -- so a brand whose footer is dark ships an email
// footer in the template's near-black on the brand's near-black.
//
// WHY THE SALIENT CAPTURE AND NOT `text-styles.json`. The selector probe
// records rows for `footer a` (which `header-link-backfill.js` already turns
// into `footer-link`) and for the bare tags; it has no selector for "the
// non-link running text inside the footer", so the colour this role names was
// never in that artifact to begin with. `salient-text.json` walks text nodes
// instead of selectors and records, per row, the landmark it sits in and the
// colour it was rendered in -- which is exactly this role's two facts.
//
// WHY A CONTRAST TEST AND NOT `pickDominantColor`'s white skip. The heading /
// body roles skip `#ffffff` unconditionally because they do not know the
// surface their colour will be painted on. This role does: `footer-background`
// is a hint the kit either carries by the time this runs or does not carry at
// all. So white is admissible here -- on the corpus it is the correct answer
// for every dark-footer site -- and the rule that replaces the blanket skip is
// the pair test the white skip was standing in for. With NO footer background
// the pair cannot be formed, and this emits nothing rather than guessing a
// surface; that is 3 of the 50 corpus dirs.
//
// Posture is `synthesizeTextColorRoles`'s: append-only, idempotent, silent on
// missing or malformed inputs.

// The value of `hint` as this kit carries it, or `null`. First row wins, which
// is what every downstream consumer of a colour hint does.
function hintValueFromRows(rows, hint) {
  for (const row of Array.isArray(rows) ? rows : []) {
    if (!row || typeof row !== "object") continue;
    const hints = Array.isArray(row.usageHints) ? row.usageHints : [];
    if (!hints.includes(hint)) continue;
    const hex = normalizeHexForCompare(row.value);
    if (/^#[0-9a-f]{6}$/.test(hex)) return hex;
  }
  return null;
}

// Weight every `#rrggbb` recorded on a footer row by how many elements the
// capture collapsed into it.
//
// `occurrences` IS THE COUNT THAT MATTERS. `salient-text.json` collapses rows
// by (tag, family, size, weight, colour) and keeps `occurrences` for the
// collapsed group, so counting ROWS would score a footer's single 40-element
// grey link list exactly as heavily as one stray coloured badge. A row without
// a usable count contributes 1 -- the row itself was measured, whatever the
// capture failed to record about it.
function footerColourWeights(rows) {
  const weights = new Map();
  const firstSeen = new Map();
  for (let index = 0; index < rows.length; index += 1) {
    const hex = normalizeHexForCompare(rows[index]?.color);
    if (!/^#[0-9a-f]{6}$/.test(hex)) continue;
    const recorded = Number(rows[index]?.occurrences);
    const occurrences = Number.isFinite(recorded) && recorded > 0 ? recorded : 1;
    weights.set(hex, (weights.get(hex) || 0) + occurrences);
    if (!firstSeen.has(hex)) firstSeen.set(hex, index);
  }
  return { weights, firstSeen };
}

// Mutates `brandkit.brand.colors.textColors` in place; appends at most one
// hint or one row. Idempotent, and a no-op on every input it cannot read.
//
// Order of candidates: weight descending, ties to the darker colour, then to
// the row the capture recorded first. The darker tiebreak mirrors
// `pickDominantColor`'s and is stable rather than principled -- two colours
// carrying the same weight in one footer is a design that has no single
// answer.
//
// The FIRST candidate clearing `EMAIL_MIN_CONTRAST` against the footer
// background wins, rather than the strongest-contrast one: the role names the
// footer's text colour, and the most-used legible colour is that colour. The
// contrast term is a legibility floor, not a ranking. When no candidate clears
// it -- a light-on-brand footer whose text is deliberately low-contrast --
// nothing is emitted and the builder keeps its own default, which is the same
// outcome the run has today.
export function synthesizeFooterTextRole(brandkit, salientRows, diagnostics = []) {
  if (!brandkit || typeof brandkit !== "object") return;
  const colors = brandkit?.brand?.colors;
  if (!colors || typeof colors !== "object") return;
  if (!Array.isArray(colors.textColors)) return;

  // Idempotency, first and cheapest: a second normalize over an artifact that
  // already carries the role must not add a duplicate row or re-tag a row.
  // This also leaves an AGENT-authored `footer-text` alone -- the role is
  // present, so there is nothing for this helper to decide.
  for (const entry of colors.textColors) {
    if (!entry || typeof entry !== "object") continue;
    const hints = Array.isArray(entry.usageHints) ? entry.usageHints : [];
    if (hints.includes(FOOTER_TEXT_HINT)) return;
  }

  const footerBackground = hintValueFromRows(colors.backgroundColors, FOOTER_BACKGROUND_HINT);
  if (!footerBackground) return;

  const rows = salientFooterLandmarkRows(salientRows);
  if (rows.length === 0) return;

  const { weights, firstSeen } = footerColourWeights(rows);
  if (weights.size === 0) return;
  const ordered = [...weights.entries()].sort((left, right) => {
    if (right[1] !== left[1]) return right[1] - left[1];
    const leftLuminance = relativeLuminance(left[0]);
    const rightLuminance = relativeLuminance(right[0]);
    if (leftLuminance !== rightLuminance) return leftLuminance - rightLuminance;
    return firstSeen.get(left[0]) - firstSeen.get(right[0]);
  });
  const winner = ordered.find(([hex]) => {
    const ratio = contrastRatio(hex, footerBackground);
    return ratio !== null && ratio >= EMAIL_MIN_CONTRAST;
  });
  if (!winner) return;
  const [value, weight] = winner;

  for (const [index, entry] of colors.textColors.entries()) {
    if (!entry || typeof entry !== "object") continue;
    if (normalizeHexForCompare(entry.value) !== value) continue;
    const hints = Array.isArray(entry.usageHints) ? entry.usageHints : [];
    entry.usageHints = [...hints, FOOTER_TEXT_HINT];
    diagnostics.push({
      severity: "info",
      path: `$.brand.colors.textColors[${index}].usageHints`,
      action: "appended-hint",
      hint: FOOTER_TEXT_HINT,
      value: entry.value,
      footerBackground,
      occurrences: weight,
    });
    return;
  }

  const newRow = markScaffoldSynthesised({
    value,
    description: `Auto-synthesised from salient-text.json footer-landmark rows (${weight} occurrence(s), legible on the ${footerBackground} footer background).`,
    usageHints: [FOOTER_TEXT_HINT],
  });
  const newIndex = colors.textColors.length;
  colors.textColors.push(newRow);
  diagnostics.push({
    severity: "info",
    path: `$.brand.colors.textColors[${newIndex}]`,
    action: "appended-row",
    hint: FOOTER_TEXT_HINT,
    value,
    footerBackground,
    occurrences: weight,
  });
}

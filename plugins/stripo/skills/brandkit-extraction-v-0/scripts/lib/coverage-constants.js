// Shared coverage thresholds used by the region-bg synthesis helpers.
//
// `MIN_REGION_COVERAGE` is the lower bound on summed `viewportCoverage`
// (across rows matching the same hex within a region) that a region-bg
// candidate must clear before its hint is emitted onto
// `brand.colors.backgroundColors[]`. Used by:
//   - `synthesizeRegionBgHints` (`region-bg-hints.js`) — header / footer.
//   - `synthesizeContentBgHint` (`region-bg-content-hint.js`) — main /
//     content.
//
// The 0.05 floor (5% of viewport) rejects thin evidence such as a
// sticky utility strip masquerading as the real header. Tuned against
// the canvas-ranker's coverage gate so all three region-bg channels
// (canvas / header+footer / content) apply the same minimum.
//
// BACKLOG item 10 — previously each helper carried its own
// `MIN_COVERAGE = 0.05` constant; lifting here keeps the threshold
// from drifting between channels.
//
// NOTE: this is NOT the same constant as the 0.05 coverage penalty
// applied inside `rankCanvasBackgroundCandidates` (assemble-candidates.js).
// That value is a per-row weight adjustment in the canvas ranker
// (`weight -= 1` when coverage < 0.05), not a region-coverage emit
// threshold — coincidentally the same number but a different concept.
export const MIN_REGION_COVERAGE = 0.05;

// HSL-saturation floor for `promo-surface-background` synthesis. Promo
// surfaces (sale banners, hero promos, callouts) on real sites are
// chromatic — red / orange / brand-saturated — never near-neutral. The
// 0.4 floor rejects light-grey utility strips that happen to carry a
// `roleHint: "promo"` (the role can be set defensively in markup even
// when the strip is purely decorative) and any near-neutral surface
// that the fleet has produced as false positives in prior probes. Tier
// G deferred this synthesis explicitly because the deterministic signal
// was too noisy without a saturation gate; the gate goes here so any
// future tweak lives next to the coverage floor.
//
// BACKLOG item 13 — conservative scaffolding: at planning time zero
// fleet fixtures qualify at (cov>=0.05 AND sat>=0.4). The helper is in
// place so tighter future probes have a deterministic emit path.
export const MIN_PROMO_SATURATION = 0.4;

// Confidence floor for pre-emitting `canvas-background` when the canvas
// ranker's top bucket is PAGE-ANCHORED (`pageAnchored === true`: some
// contributing row is `body` / `html` / the synthetic
// `(rendered-canvas-pixel)` row, or carries `roleHint: "page"`).
//
// The generic gate is `MINIMUM_PRE_EMIT_CONFIDENCE` (0.5, below).
// Confidence there is a SHARE of total ranker
// weight, so it is diluted by however many other buckets the page
// happens to have: a site whose body paints the canvas plus one large
// section of another colour lands the correct answer at 0.47-0.49, and
// the role is then left empty — which the consumer silently fills from
// the reference template's colour instead. Dilution is not doubt: when
// the winning bucket is the one the page itself declares as its canvas,
// a plurality is enough, so the floor drops to 0.4 for that case only.
//
// 0.4 (not lower) keeps the winner a clear plurality: below it the
// combined rest outweighs the winner by more than 3:2. Anchoring is
// required ON TOP OF the floor, never instead of it.
export const CANVAS_PAGE_ANCHORED_MIN_CONFIDENCE = 0.4;

// ---------------------------------------------------------------------
// Landmark-band fallback for `header-background` / `footer-background`
// (`region-bg-hints.js`, `pickLandmarkBandHex`).
//
// Why: on a site whose `<header>` / `<footer>` element is itself
// transparent, every landmark row carries an empty `backgroundColor`
// and `pickRegionHex` returns null — the region role stays a gap even
// though a full-width painted surface sits inside the landmark's own
// rectangle. The fallback reads that surface geometrically (no colour
// assumption, no `roleHint: "navigation"` shortcut) and only when the
// coverage-ranked pick produced nothing, so it is strictly additive.
//
// Constants tuned on a 50-dir replay sweep of archived
// `background-styles.json` captures (`q3_region_bg.mjs`, 2026-09-03).
// At the values below the sweep fills `header-background` on 4 dirs and
// `footer-background` on 1, with 0 conflicts (no dir where
// `pickRegionHex` already returns a hex changes).
//
// Honest note on which term is load-bearing: on that corpus ONLY
// `REGION_BAND_MIN_COVER_RATIO` moves the outcome. Re-running the sweep
// with the other three widened to the point of near-uselessness
// (TOLERANCE 0 and 20, FULL_WIDTH 0.5, MIN_HEIGHT 1) produced a
// byte-identical 50-line report each time — 4 header / 1 footer, same
// hexes, same winners. They are therefore guards against shapes the
// corpus does not contain (hairline strips, side rails, surfaces
// overflowing the landmark), not thresholds this corpus validates.
// Their unit tests below are the only evidence that they bite; do not
// cite the corpus for them.

// Minimum height, in CSS px, of BOTH the landmark band itself and of a
// candidate surface inside it. Rejects hairline separators and sticky
// utility strips that are geometrically inside the landmark but are not
// the region's surface. Corpus-inert (see note above).
export const REGION_BAND_MIN_HEIGHT_PX = 24;

// A candidate surface must cover at least this fraction of the landmark
// band's height. This is the term that does the real rejecting: sweep
// counts were RATIO 0 → 5 header / 2 footer fills (the two extra are
// visibly NOT the region surface: a 48 px promo strip covering 22% of a
// 222 px header band, and a 72 px strip covering 17% of a footer band),
// RATIO 0.5 → 4 header / 1 footer, RATIO 0.6 → 3 header / 1 footer.
// 0.6 was rejected because it loses a real case whose brand-coloured
// band covers 54% of a header that also holds a 46% promo strip — that
// 54/46 split is the margin this threshold sits in.
export const REGION_BAND_MIN_COVER_RATIO = 0.5;

// A candidate surface must span at least this fraction of the page
// width (the `body` / `roleHint: "page"` row's width, else the widest
// rect in the capture). Region surfaces are full-bleed; a nav block or
// a logo tile is not. Corpus-inert (see note above).
export const REGION_BAND_FULL_WIDTH_RATIO = 0.9;

// Vertical slack, in CSS px, when testing that a candidate lies inside
// the landmark band. Absorbs sub-pixel rounding and 1-2 px borders
// without admitting a hero surface that starts below the header, which
// is the shape this guard exists for. Corpus-inert (see note above).
export const REGION_BAND_TOLERANCE_PX = 8;

// The confidence floor at which the scaffolder pre-emits a colour seed the
// agent can confirm (`colour-pre-emit.js`, re-exported from there so existing
// importers are unaffected).
//
// It lives HERE, next to `CANVAS_PAGE_ANCHORED_MIN_CONFIDENCE`, because two
// modules now have to agree on it: the pre-emit decides whether to write the
// seed, and `assemble-candidates.js` decides whether the button lane reached
// the floor -- which is the exact condition under which the card-CTA lane may
// speak. A copy in each file is a copy that can drift, and this module imports
// nothing, so neither importer risks a cycle.
export const MINIMUM_PRE_EMIT_CONFIDENCE = 0.5;

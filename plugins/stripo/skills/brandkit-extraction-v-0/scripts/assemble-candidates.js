// Pre-ranks role candidates from saved homepage evidence. Phase 1: emit only.
//
// The agent currently spends ~56% of extraction wall-clock reading saved
// artifacts and reasoning from raw evidence about which color/button/typography
// candidate maps to which brand role. This module reads the same artifacts the
// scaffold already reads (plus background-styles.json) and emits a ranked
// `candidates` block into `assembly-diagnostics.json`. Phase 1 is purely
// additive — the existing scaffold draft is unchanged, no SKILL behavior
// references the new field. Phase 2 (separate change) will teach the agent
// to consume it.
//
// Design constraints:
// - All ranking functions must be total (never throw). Empty / malformed
//   input returns []. Defensive coercion everywhere.
// - No live-page or filesystem access. Pure functions of saved artifacts.
// - No fabrication. Confidence scores reflect observed evidence weight,
//   not invented certainty. If evidence is thin, confidence is low.
// - Output shape per candidate is uniform: { value, confidence, evidence }.
//   `value` is the role-specific payload; `confidence` is 0..1 rounded to
//   two decimals; `evidence` is a short plain-English string the agent
//   can print to verify the ranking matches its own reading.

import { hexSaturation } from "./lib/colour.js";
import { isLikelyProductCardRow } from "./lib/product-row-filter.js";
import { MINIMUM_PRE_EMIT_CONFIDENCE } from "./lib/coverage-constants.js";
import {
  NON_VISIBLE_TEXT_SOURCES,
  WHITE_HEX,
  textColorRoleIsDerivable,
} from "./lib/text-color-role-synthesis.js";
import {
  inlineSvgLogosFromLogoAssets,
  svgPathIndexFromLogoAssets,
} from "./lib/logo-asset-capture.js";
import {
  salientRowsForRole,
  salientRowReadsAsPrice,
  describeSalientRow,
  SALIENT_CANDIDATE_SOURCE,
} from "./lib/salient-text.js";
import {
  EVIDENCE_PRESENT,
  captureIsUsable,
  selectorEvidenceIsAbsent,
  typographyRoleEvidence,
} from "./lib/role-evidence.js";
import {
  hasLetters,
  holdsCurrencyToken,
  textReadsAsAnchoredPrice,
} from "./lib/product-data.js";
import { EMAIL_MIN_CONTRAST, contrastRatio } from "./lib/wcag-contrast.js";

const HEX_PATTERN = /^#[0-9a-f]{3}([0-9a-f]{3}([0-9a-f]{2})?)?$/i;

// The canvas assumed when a capture carries no rankable background row.
// White is the browser default and the value every downstream email
// consumer falls back to.
const DEFAULT_CANVAS_HEX = "#ffffff";

// BACKLOG item 5 — `LOGO_BOOST` is the additive sort-key bump applied
// to a bucket whose background hex exactly matches a non-trivial logo
// SVG fill. The value (50) is a soft tie-breaker, not enough to flip a
// high-count real CTA below a low-count logo-fill-matching alternative
// on validated fixtures: the chrome penalty (-1000) dominates the
// scoring algebra, so misclassified buckets still get buried. However,
// if a future site has a logo colour that disagrees with the real CTA
// colour, this constant may need scaling with bucket count or
// reducing to 5–15 to stop the boost from out-voting real evidence.
// See BACKLOG item 5 for the trade-off analysis.
const LOGO_BOOST = 50;

// BACKLOG item 6 — `CHROME_DOMINATED_RATIO` is the chrome-rows / count
// fraction at which a bucket is flagged `chromeDominated` and pays the
// -1000 penalty (i.e. is excluded from emit). At 0.5 a 2-row bucket
// with 1 chrome row crosses the line, which is the right call on a
// count=2 bucket carrying one consent verb + one ambiguous CTA — the
// real CTA evidence is too thin to outweigh the consent signal. If a
// site has many count=2 buckets where one row is a borderline chrome
// match (e.g. "Continue" in a multi-step checkout that is not a
// consent banner), this threshold may need raising to 0.66+. See
// BACKLOG item 6 for the trade-off analysis.
const CHROME_DOMINATED_RATIO = 0.5;

// ONE LEG OF EVIDENCE IS ENOUGH TO EMIT AND NOT ENOUGH TO ENTER THE COPY BAND.
//
// `SKILL.md` bands the confidence this module publishes: at >= 0.85 the agent
// copies the value after one screenshot check; at 0.50-0.85 it verifies
// against an anchor first. A candidate standing on a single leg -- measured,
// but with nothing independent vouching for what it IS -- may be offered and
// may not be told to copy, so it is capped below that band and the screenshot
// check stops being perfunctory.
//
// Three clauses already price that way (both logo lanes below), and the
// salient typography / text-colour lanes join them: a row recorded by the
// selector-free capture was measured on the rendered page, and no selector
// vouches that it is the page's heading. Same hazard, same cap, one constant
// -- the three logo clauses used to spell the number themselves while their
// own comments claimed "same cap, same constant" and nothing enforced it.
const UNCORROBORATED_CONFIDENCE_CAP = 0.75;

function normalizeHex(value) {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim().toLowerCase();
  if (!HEX_PATTERN.test(trimmed)) return null;
  if (trimmed.length === 4) {
    return "#" + trimmed.slice(1).split("").map((c) => c + c).join("");
  }
  if (trimmed.length === 7) return trimmed;
  if (trimmed.length === 9) return trimmed.slice(0, 7); // strip alpha channel
  return null;
}

function numberOrNull(value) {
  return Number.isFinite(value) ? value : null;
}

function roundConfidence(value) {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value > 1) return 1;
  return Math.round(value * 100) / 100;
}

function dedupeSelectors(list) {
  const seen = new Set();
  const out = [];
  for (const item of list) {
    if (typeof item !== "string" || !item) continue;
    if (seen.has(item)) continue;
    seen.add(item);
    out.push(item);
    if (out.length >= 3) break;
  }
  return out;
}

// Anchor selectors that suggest "this row represents the page canvas".
// Weights are deliberately conservative — the goal is ordering, not absolute
// certainty.
//
// `(rendered-canvas-pixel)` is the synthetic row emitted by
// `collectBackgroundStyles` when `<body>` AND `<html>` are both transparent
// (the store-example.ua / shop-example.com / Tailwind-SSR pattern) — see `lib.js`. That row
// carries the actual rendered pixel at viewport center: by construction it
// IS what the user sees as the canvas. It outranks DOM anchors because the
// DOM has already declared "I don't paint a canvas"; the rendered pixel is
// the authoritative answer. Weight is set high enough to dominate footer-
// aggregate evidence (typical worst case: 6–10) so a tinted footer can't
// outvote the literal-canvas reading. The probe-side guards ensure the
// synthetic row is only emitted when the sample is trustworthy
// (neutral hex + ancestor covers > 80% viewport or no ancestor at all).
const CANVAS_ANCHOR_WEIGHTS = [
  { match: (s) => s === "(rendered-canvas-pixel)", weight: 12 },
  { match: (s) => s === "body", weight: 5 },
  { match: (s) => s === "html", weight: 4 },
  { match: (s) => s === "main", weight: 3 },
  { match: (s) => /\bcontainer\b/i.test(s), weight: 2 },
  { match: (s) => /\bwrapper\b/i.test(s), weight: 2 },
  { match: (s) => /\bpage\b/i.test(s), weight: 2 },
];

// Selectors that mean "this row IS the page canvas, not a region inside it".
// `main` / `container` / `wrapper` / `page` carry ranking weight above but are
// deliberately NOT page anchors: they are content wrappers that can legitimately
// paint a colour different from the canvas. `roleHint === "page"` is the
// probe-side equivalent of the same claim and counts as an anchor too.
const CANVAS_PAGE_ANCHOR_SELECTORS = new Set(["body", "html", "(rendered-canvas-pixel)"]);

// Does this background row assert page-canvas identity?
function isPageAnchorRow(selector, row) {
  if (CANVAS_PAGE_ANCHOR_SELECTORS.has(selector)) return true;
  return row?.roleHint === "page";
}

export function rankCanvasBackgroundCandidates(backgroundStyles) {
  if (!Array.isArray(backgroundStyles) || backgroundStyles.length === 0) return [];

  const buckets = new Map();
  for (const row of backgroundStyles) {
    if (!row || typeof row !== "object") continue;
    const hex = normalizeHex(row.backgroundColor);
    if (!hex) continue;

    const selector = typeof row.selector === "string" ? row.selector : "";
    let weight = 1;
    for (const anchor of CANVAS_ANCHOR_WEIGHTS) {
      if (anchor.match(selector)) {
        weight = Math.max(weight, anchor.weight);
      }
    }
    if (row.isNeutralBackground === true) weight += 2;
    if (row.roleHint === "page") weight += 2;
    const coverage = Number.isFinite(row.viewportCoverage) ? row.viewportCoverage : null;
    // Not the same constant as MIN_REGION_COVERAGE (coverage-constants.js) —
    // this is a per-row weight-penalty threshold for canvas ranker scoring
    // (thin rows lose one weight unit), not a region-coverage emit gate.
    if (coverage !== null && coverage < 0.05) weight = Math.max(0, weight - 1);

    const bucket = buckets.get(hex) || { hex, totalWeight: 0, selectors: [], pageAnchored: false };
    bucket.totalWeight += weight;
    bucket.selectors.push(selector);
    if (isPageAnchorRow(selector, row)) bucket.pageAnchored = true;
    buckets.set(hex, bucket);
  }

  if (buckets.size === 0) return [];
  const total = Array.from(buckets.values()).reduce((s, b) => s + b.totalWeight, 0);
  if (total <= 0) return [];

  return Array.from(buckets.values())
    .sort((a, b) => b.totalWeight - a.totalWeight)
    .slice(0, 3)
    .map((b) => ({
      value: b.hex,
      confidence: roundConfidence(b.totalWeight / total),
      evidence: `weight=${b.totalWeight} across selectors: ${dedupeSelectors(b.selectors).join(", ") || "(unspecified)"}`,
      // Structured restatement of the anchor half of `evidence`. Consumers
      // (colour-pre-emit's page-anchored confidence floor) must read THIS,
      // never re-parse the human-readable `evidence` string: `evidence`
      // truncates to 3 deduped selectors, so an anchor row beyond the third
      // distinct selector is invisible there but still true here.
      pageAnchored: b.pageAnchored === true,
    }));
}

// Chrome / consent / locale-switcher text patterns. Used by
// `looksLikeChromeButton` to demote rows whose visible text reads like
// a cookie banner / consent CTA / language toggle rather than a real
// purchase CTA. Three independent matchers (start-anchored verbs, exact
// locale codes, substring cookie/consent vocabulary) are combined with
// a carve-out for upstream signals (`selectionSignals.looksLikePurchaseCta`).
//
// Coverage spans EN / UK / RU / DE / PL / IT / ES so real ecommerce
// pages in any of those locales do not seed brand-primary from a
// consent overlay sitting above the page.
//
// EXACT-MATCH set (lowercased + trimmed before lookup). Exact-match
// avoids the false-positive class where a prefix-anchored regex
// matches legitimate multi-word CTAs that happen to begin with a
// consent verb — e.g. "Continue to checkout" / "Принять заказ" /
// "Accept order". A real consent button is almost always a short,
// standalone phrase ("Accept", "OK", "Continue", "Прийняти всі"),
// so exact-match captures the intent without bleeding into purchase
// flows. Extend by adding short variants — do NOT change to substring
// match without re-vetting against the negative test cases below.
const EXACT_CHROME_TEXTS = new Set([
  // English consent affirmatives
  "accept", "accept all", "accept cookies", "accept all cookies",
  "allow", "allow all", "allow cookies", "confirm", "continue",
  "ok", "okay", "agree", "i agree", "i accept", "got it",
  // Ukrainian / Russian
  "хорошо", "прийняти", "прийняти всі", "прийняти все",
  "принять", "принять всё", "принять все",
  "підтвердити", "согласен", "погоджуюся", "погоджуюсь",
  // German
  "akzeptieren", "alle akzeptieren", "zustimmen", "bestätigen",
  "einverstanden", "annehmen",
  // Polish
  "akceptuję", "akceptuj", "zaakceptuj", "zgadzam się",
  "kontynuuj", "potwierdź",
  // Italian (incl. plural/gender variants for "accept all")
  "accetta", "accetta tutto", "accetta tutti", "accetta tutte",
  "conferma", "continua", "consenso", "acconsento",
  // Spanish / Portuguese (incl. plural variants)
  "aceptar", "aceptar todo", "aceptar todos", "aceptar todas",
  "confirmar", "continuar", "consentimiento", "de acuerdo",
  "aceito", "concordo",
  // Portuguese consent affirmatives (BACKLOG item 8). Aligned with
  // the PT entry already present in `LOCALE_CODE_PATTERN`.
  "aceitar", "aceitar tudo", "aceitar todos",
  "consentimento",
  // French consent affirmatives (BACKLOG item 8). Aligned with the
  // FR entry already present in `LOCALE_CODE_PATTERN`. `j'accepte`
  // uses a typographic apostrophe variant `j’accepte` on some sites,
  // but the exact-match comparison is post-trim only — extend if a
  // fixture surfaces the curly-apostrophe form.
  "accepter", "tout accepter", "j'accepte", "continuer",
  "consentement",
]);
const LOCALE_CODE_PATTERN = /^(UA|RU|EN|UK|US|DE|PL|IT|ES|FR|PT)$/i;
const COOKIE_PATTERN = /cookie|consent|gdpr|приват|конфіденц|datenschutz|prywatność|privacidade|privacidad|riservatezza/i;

// Heuristic: does this button row look like cookie-consent / locale
// chrome rather than a real primary CTA? Return `true` to mark the
// candidate as "chrome" — at scoring time chrome-dominated buckets
// take a -1000 penalty and are flagged `chromeDominated`, which the
// pre-emit excludes from the confidence denominator.
//
// Carve-out: when the probe has already classified this row as a
// purchase CTA (`selectionSignals.looksLikePurchaseCta === true`) we
// MUST NOT demote — short purchase confirmations ("OK", "Готово") on
// post-checkout overlays must remain selectable. The probe owns the
// purchase-flow signal; this helper only intervenes when the probe has
// not made that call.
export function looksLikeChromeButton(def) {
  // CARVE-OUT: respect upstream signal that this is a real purchase CTA.
  if (def?.selectionSignals?.looksLikePurchaseCta === true) return false;
  // A consent CHOICE inside an overlay is chrome whatever its wording: the
  // capture judged both facts on the live element (`inOverlay` = a fixed or
  // modal ancestor; `looksLikeConsentControl` = the accessible name is an
  // accept / decline / manage verb). BOTH are required -- a sticky-header
  // "Buy now" is in an overlay but is no consent choice, and a body "Accept
  // order" is consent-shaped but sits in no overlay -- and the purchase
  // carve-out above still wins, so a post-checkout "OK" the probe read as a
  // purchase CTA stays selectable. Rows without the signals (older captures,
  // fixtures) fall through to the text rules below unchanged.
  if (def?.selectionSignals?.inOverlay === true && def?.selectionSignals?.looksLikeConsentControl === true) return true;
  const text = (typeof def?.text === "string" ? def.text : "").trim();
  if (!text) return false;
  if (EXACT_CHROME_TEXTS.has(text.toLowerCase())) return true;
  if (LOCALE_CODE_PATTERN.test(text)) {
    const width = Number.isFinite(def?.layout?.computedWidthPx)
      ? def.layout.computedWidthPx
      : 9999;
    if (width < 100) return true;
  }
  if (COOKIE_PATTERN.test(text)) return true;
  return false;
}

// Derive the set of hexes that represent canvas / chrome surfaces
// (page body, html, header/footer chrome, or any row explicitly
// flagged by upstream as a neutral background or `roleHint: "page"`).
// Buttons whose background hex matches any of these are very likely
// rendered against an icon-only / chrome surface and not "filled" in
// the brand-primary sense — they get discarded outright from the
// candidate ranking.
//
// The neutral arm is CONTRAST-GATED. `isNeutralBackground` is a
// chromaticity test (`isNeutralColor`: max channel delta <= 10), so it
// is true of black and charcoal just as much as of a near-white section
// wrapper. Ungated, ONE neutral wrapper row anywhere on the page deleted
// every dark filled CTA from the ranking, and the survivor was whatever
// coloured control happened to remain — a chat widget, a newsletter
// button — or nothing at all. A filled CTA has to be distinguishable
// from the canvas it sits on, so a neutral row joins the reject set only
// when it does NOT stand out against that canvas (`contrastRatio <
// EMAIL_MIN_CONTRAST`). A neutral surface that DOES stand out (black on
// a white page, white on a dark-theme page) is a legitimate filled
// button colour and stays a candidate.
//
// The canvas arm (`body` / `html` / `roleHint: "page"` /
// `(rendered-canvas-pixel)`) and the header/footer arm stay
// unconditional: those rows are page chrome by construction, not by
// colour.
export function deriveCanvasSurfaceHexes(backgroundStyles, { canvasHex } = {}) {
  const surfaces = new Set();
  if (!Array.isArray(backgroundStyles)) return surfaces;
  // Callers that own a canvas pick pass it in, so every consumer of the
  // reject set gates against the SAME canvas. A caller that passes
  // nothing gets the pick derived from the very rows it handed in, so
  // the two can never silently disagree.
  const canvas = normalizeHex(canvasHex) || deriveCanvasHex(backgroundStyles);
  for (const row of backgroundStyles) {
    if (!row || typeof row !== "object") continue;
    const hex = normalizeHex(row.backgroundColor);
    if (!hex) continue;
    const selector = typeof row.selector === "string" ? row.selector : "";
    const isCanvas = (selector === "body" || selector === "html" || row.roleHint === "page");
    const isHeaderFooter = (selector === "header" || selector === "footer");
    // A neutral row is released from the reject set only on PROOF that
    // it stands out from the canvas; anything else (including a `null`
    // "no contrast claim") keeps the pre-gate reject, so no input can
    // widen the candidate set by being unreadable.
    const isNeutralSurface = row.isNeutralBackground === true
      && !(contrastRatio(hex, canvas) >= EMAIL_MIN_CONTRAST);
    if (isCanvas || isHeaderFooter || isNeutralSurface) {
      surfaces.add(hex);
    }
  }
  return surfaces;
}

// The page canvas the F1 reject-set gate measures against: the top
// `rankCanvasBackgroundCandidates` pick, falling back to white when the
// capture holds no rankable background row.
// FIX-93: which ranked bucket names the canvas. The page-anchored bucket
// (body / html / rendered pixel / roleHint page) wins even when a heavier
// non-anchored neutral bucket out-weighs it; the raw top is used only when
// no ranked bucket is anchored. One pick for every consumer (F1 gate,
// pre-emit reject set, text-role legibility canvas).
export function pickCanvasCandidate(ranked) {
  if (!Array.isArray(ranked) || ranked.length === 0) return null;
  const anchored = ranked.find((row) => row && row.pageAnchored === true);
  return anchored || ranked[0] || null;
}

export function deriveCanvasHex(backgroundStyles) {
  return normalizeHex(pickCanvasCandidate(rankCanvasBackgroundCandidates(backgroundStyles))?.value)
    || DEFAULT_CANVAS_HEX;
}

// Build the boost set used by the logo cross-reference. Pure white /
// black are dropped because logo SVGs often carry knockout fills that
// would otherwise inflate every white/black-backgrounded button into
// the boost path. `null` / non-hex tokens are silently ignored.
export function extractBgHexSet(logoSvgFills) {
  const out = new Set();
  if (!Array.isArray(logoSvgFills)) return out;
  for (const raw of logoSvgFills) {
    const hex = normalizeHex(raw);
    if (!hex) continue;
    if (hex === "#ffffff" || hex === "#000000") continue;
    out.add(hex);
  }
  return out;
}

// HSL hue (degrees in [0, 360)) and saturation of a `#rrggbb` hex.
// Returns `null` for malformed input so the BACKLOG-item-40 body-
// typography promo-color filter can naturally reject it without
// emitting a misleading hue. Stays local (rather than shared with
// `lib/colour.js`'s `hexSaturation`) because promoting it would force
// every caller to destructure {hue, sat}, and there's only one caller.
function hexHueSat(hex) {
  const match = /^#([0-9a-f]{6})$/i.exec(hex || "");
  if (!match) return null;
  const body = match[1];
  const r = parseInt(body.slice(0, 2), 16) / 255;
  const g = parseInt(body.slice(2, 4), 16) / 255;
  const b = parseInt(body.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return { hue: 0, saturation: 0 };
  const delta = max - min;
  const saturation = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  let hue;
  if (max === r) hue = ((g - b) / delta + (g < b ? 6 : 0)) * 60;
  else if (max === g) hue = ((b - r) / delta + 2) * 60;
  else hue = ((r - g) / delta + 4) * 60;
  return { hue, saturation };
}

// BACKLOG item 40 — promo-saturated body-typography filter constants.
// `body_text` resolves correctly to #212121 via downstream filters,
// but `footer_text` falls through to a secondary body-typography
// candidate (e.g. eva fix28's #595959) when the dominant body row
// carries a saturated red/orange/magenta hex (#ff0000 sale-price /
// promo-badge bleed). The chrome-penalty posture from canvas-ranker
// is the right shape: drop the saturated candidate only when a
// genuine alternative exists, so a brand whose body text genuinely is
// red still ships red.
//
// Saturation threshold > 0.7: matches HSL `pure` promo reds /
// oranges / magentas without catching brand greys (#212121 ≈ 0)
// or muted body greys (#595959 ≈ 0). Hue ranges encode the three
// promo-class colour families:
//   - red:     hue in [0, 30) ∪ [330, 360)
//   - orange:  hue in [30, 60)
//   - magenta: hue in [300, 330)
// The alternative bucket gates: saturation <= 0.4 AND confidence >
// 0.3. <= 0.4 catches greys + muted brand neutrals without rejecting
// muted brand colours; > 0.3 confidence prevents falling through to
// a one-off neutral row that is itself noise.
const BODY_PROMO_SATURATION_MIN = 0.7;
const BODY_PROMO_HUE_RANGES = [
  [0, 30],   // red lower half
  [30, 60],  // orange
  [300, 330],// magenta
  [330, 360],// red upper half
];
const BODY_ALTERNATIVE_SATURATION_MAX = 0.4;
const BODY_ALTERNATIVE_CONFIDENCE_MIN = 0.3;

function isBodyPromoSaturatedColor(hex) {
  const hs = hexHueSat(hex);
  if (!hs) return false;
  if (hs.saturation <= BODY_PROMO_SATURATION_MIN) return false;
  return BODY_PROMO_HUE_RANGES.some(([lo, hi]) => hs.hue >= lo && hs.hue < hi);
}

function isBodyDesaturatedAlternative(hex) {
  const hs = hexHueSat(hex);
  if (!hs) return false;
  return hs.saturation <= BODY_ALTERNATIVE_SATURATION_MAX;
}

// BACKLOG item 30 — `CTA_SURFACE_*` constants gate the cross-source
// "top-of-page CTA surface" candidate. The candidate is emitted from
// background-styles.json (NOT button-styles.json) when a brand-coloured
// full-width bar sits at the top of the page — e.g. a saturated
// catalog-navbar band whose hex matches the brand's primary CTA. The
// bar's hex frequently lives only in background-styles (no matching
// button-styles row), so the existing `rankPrimaryButtonCandidates`
// cannot see it. This separate ranker surfaces the candidate so the
// cross-source pre-emit override can fire.
//
// Gates (all required):
//   - viewportCoverage in [0.02, 0.20]  — skip body-canvas (covers most
//     of the viewport) AND skip tiny badges (sub-2% bands).
//   - rect.width >= 0.9 * viewport      — full-width band, not a card.
//   - rect.y < 400                       — top-of-page only; bottom
//     mobile-app promo strips (y > 3000) are not the CTA surface.
//   - hexSaturation(hex) >= 0.5          — skip greys / near-white.
//   - hex NOT in canvasSurfaces           — skip body / page bg.
//   - roleHint === "surface"             — probe-classified as a
//     positive surface (not a button / icon / chrome row).
//   - isNeutralBackground === false       — probe rejected the neutral
//     reading; the bar is brand-coloured.
//
// Weight = evidenceScore (probe-derived; typically in the 30-50 range
// for a brand-coloured top-of-page navbar band).
const CTA_SURFACE_MIN_VIEWPORT_COVERAGE = 0.02;
const CTA_SURFACE_MAX_VIEWPORT_COVERAGE = 0.20;
const CTA_SURFACE_FULL_WIDTH_RATIO = 0.9;
const CTA_SURFACE_MAX_Y = 400;
const CTA_SURFACE_MIN_SATURATION = 0.5;
// Heuristic viewport width when the row does not carry an explicit
// `viewportWidth` field. The probe normally records rects against a
// 1920px-wide viewport; the gate is forgiving (0.9 * 1920 = 1728), so
// a slight viewport mismatch will still admit clearly full-width bars.
const CTA_SURFACE_DEFAULT_VIEWPORT_WIDTH = 1920;

// Returns a ranked list of cross-source CTA surface candidates derived
// from `backgroundStyles`. Each entry mirrors the shape used by other
// rankers in this module: `{ value, confidence, evidence, weight }`.
// The list is sorted by `weight` (= evidenceScore) descending; the top
// entry is the most defensible CTA-surface signal on the page.
//
// `canvasSurfaces` is a Set of hexes representing the canvas / chrome
// surfaces (body, html, header/footer, isNeutralBackground rows). A row
// whose hex appears in that set is rejected even when all other gates
// pass — it's likely the page surface itself, not a brand-distinctive
// CTA bar.
export function rankCtaSurfaceCandidates(backgroundStyles, canvasSurfaces = new Set()) {
  if (!Array.isArray(backgroundStyles) || backgroundStyles.length === 0) return [];

  const buckets = new Map();
  for (const row of backgroundStyles) {
    if (!row || typeof row !== "object") continue;
    if (row.roleHint !== "surface") continue;
    if (row.isNeutralBackground === true) continue;

    const hex = normalizeHex(row.backgroundColor);
    if (!hex) continue;
    if (canvasSurfaces.has(hex)) continue;
    if (hexSaturation(hex) < CTA_SURFACE_MIN_SATURATION) continue;

    const coverage = Number.isFinite(row.viewportCoverage) ? row.viewportCoverage : null;
    if (coverage === null) continue;
    if (coverage < CTA_SURFACE_MIN_VIEWPORT_COVERAGE) continue;
    if (coverage > CTA_SURFACE_MAX_VIEWPORT_COVERAGE) continue;

    const rect = row.rect && typeof row.rect === "object" ? row.rect : null;
    if (!rect) continue;
    const width = Number.isFinite(rect.width) ? rect.width : null;
    const y = Number.isFinite(rect.y) ? rect.y : null;
    if (width === null || y === null) continue;
    if (y >= CTA_SURFACE_MAX_Y) continue;
    const viewportWidth = Number.isFinite(row.viewportWidth)
      ? row.viewportWidth
      : CTA_SURFACE_DEFAULT_VIEWPORT_WIDTH;
    if (width < CTA_SURFACE_FULL_WIDTH_RATIO * viewportWidth) continue;

    const evidenceScore = Number.isFinite(row.evidenceScore) ? row.evidenceScore : 1;
    const bucket = buckets.get(hex) || { hex, weight: 0, rows: 0, sampleY: y };
    bucket.weight += Math.max(evidenceScore, 0.01);
    bucket.rows += 1;
    if (y < bucket.sampleY) bucket.sampleY = y;
    buckets.set(hex, bucket);
  }

  if (buckets.size === 0) return [];
  const totalWeight = Array.from(buckets.values()).reduce((s, b) => s + b.weight, 0);
  if (totalWeight <= 0) return [];

  return Array.from(buckets.values())
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 3)
    .map((b) => ({
      value: b.hex,
      confidence: roundConfidence(b.weight / totalWeight),
      weight: b.weight,
      rows: b.rows,
      evidence: `top-of-page full-width brand surface (y=${b.sampleY}, ${b.rows} row${b.rows === 1 ? "" : "s"}, weight=${b.weight.toFixed(2)})`,
    }));
}

// Count how many text-styles rows carry the exact target hex as their
// `color`. Returns 0 for missing / malformed inputs. Used by the
// cross-source CTA-surface pre-emit override (BACKLOG item 30) as the
// "minority but real" signal — the surface hex must show up elsewhere
// on the page (typically in heading / accent text) to confirm it is
// the site's actual brand colour, not a coincidental top strip.
export function countTextStyleColor(textStyles, hex) {
  const target = normalizeHex(hex);
  if (!target || !Array.isArray(textStyles)) return 0;
  let n = 0;
  for (const row of textStyles) {
    if (!row || typeof row !== "object") continue;
    if (normalizeHex(row.color) === target) n += 1;
  }
  return n;
}

// Count button-styles rows whose hoverBackgroundColor (or hover-state
// backgroundColor) equals the target hex. The probe shape varies: most
// rows expose `default.hoverBackgroundColor`; some carry a separate
// `hover: { backgroundColor }` object. Both shapes contribute to the
// count. Used as a secondary minority-signal source for the CTA-surface
// pre-emit override.
export function countButtonHoverColor(buttonStyles, hex) {
  const target = normalizeHex(hex);
  if (!target || !Array.isArray(buttonStyles)) return 0;
  let n = 0;
  for (const row of buttonStyles) {
    if (!row || typeof row !== "object") continue;
    const def = row.default && typeof row.default === "object" ? row.default : null;
    if (def && normalizeHex(def.hoverBackgroundColor) === target) {
      n += 1;
      continue;
    }
    const hover = row.hover && typeof row.hover === "object" ? row.hover : null;
    if (hover && normalizeHex(hover.backgroundColor) === target) {
      n += 1;
    }
  }
  return n;
}

export function rankPrimaryButtonCandidates(buttonStyles, { backgroundStyles = [], logoSvgFills = [] } = {}) {
  if (!Array.isArray(buttonStyles) || buttonStyles.length === 0) return [];

  // Precompute filter inputs once. Empty / malformed inputs yield empty
  // sets (no-op filters) — the rest of the function does not branch on
  // their presence.
  const canvasSurfaces = deriveCanvasSurfaceHexes(backgroundStyles, {
    canvasHex: deriveCanvasHex(backgroundStyles),
  });
  const logoFillSet = extractBgHexSet(logoSvgFills);

  const buckets = new Map();
  let totalWithBg = 0;

  for (const row of buttonStyles) {
    if (!row || typeof row !== "object") continue;
    const def = row.default;
    if (!def || typeof def !== "object") continue;

    // Exclude rows the upstream button probe identified as icon-only
    // product-card CTAs. THIS LANE RANKS A BUTTON, not a colour: what it
    // publishes is a bucket's background, font colour, corner radius and
    // layout intent together, and a 40 px cart glyph has none of the geometry
    // an email button needs -- its padding and radius must not become the
    // email CTA's. On sites with many product cards (one ecommerce run
    // captured 60 icon-only product-card CTAs out of 64 total buttons) the
    // icon-only bucket would otherwise dominate the ranking and hand the
    // agent a candidate it cannot use.
    //
    // An earlier revision of this comment said the SKILL.md role-tagging
    // contract FORBIDS tagging such elements `button-primary-background`. No
    // such sentence exists (grepped across SKILL.md and every reference), and
    // the claim was doing real damage: the purchase COLOUR of an icon-only
    // card action is the best brand evidence those sites have, and dropping
    // the row here dropped the colour too. It no longer does --
    // `rankCardCtaCandidates` below reads that colour from the product cards
    // themselves, and only when they prove it is the page's purchase control.
    const signals = def.selectionSignals;
    if (signals && (signals.ctaResolvedToIconOnly === true || signals.ctaIsIconLike === true)) {
      continue;
    }

    // EMPTY-TEXT GUARD — fallback for cases where the probe failed to
    // flag a small icon-control as `ctaResolvedToIconOnly` /
    // `ctaIsIconLike`. Examples observed in real artifact dumps:
    // 24x24 carousel arrows, close ✕ buttons, hamburger toggles, where
    // the visible glyph lives in a child <svg> / pseudo-element and
    // never reaches `text`. A button with no VISIBLE text AND a small
    // width is not a brand-distinctive primary CTA in any locale — primary
    // CTAs always carry readable text wider than this cap. The cap is
    // conservative (96px); legitimate text CTAs across the surveyed
    // fixtures all exceed it.
    //
    // `def.text` alone does not answer "is this control labelled visibly?".
    // `recoverVisibleLabel` falls back to `aria-label` / `title` when an
    // element has no rendered text, so an icon control carrying
    // `aria-label="Go to slide 3"` reaches here with a NON-empty `def.text`
    // and walks straight past a guard that was written for it. `textSource`
    // records which fallback produced the string, so the guard reads that
    // instead of the string's emptiness.
    //
    // `NON_VISIBLE_TEXT_SOURCES` is imported from
    // lib/text-color-role-synthesis.js rather than restated here, so a new
    // non-visible source is added in exactly one place.
    //
    // ONLY that source test is applied. The sibling
    // `selectionSignals.hasUsableVisibleText` is deliberately NOT consulted,
    // because despite its name it does not report whether a label is
    // visible: it is `hasVisuallyUsableLabel` (lib.js), a canvas
    // `measureText` check that the label FITS its box with slack to spare
    // (18% on compact controls, 8% otherwise). A tight-fitting but perfectly
    // visible label reads false. On live captures that is the common case,
    // not an edge case — genuine text-bearing CTAs reach here with
    // `hasUsableVisibleText: false` and a VISIBLE `textSource` (an 86x40
    // `#00a046` search button, a 128x40 `#e00027` subscribe button, a 97x38
    // `#43b02a` send button). On one storefront that row was the only
    // primary-button candidate, so folding the signal in emptied the
    // ranking outright. The signal's misuse elsewhere is tracked separately;
    // do not wire it in here.
    const textSource = (typeof def.textSource === "string" ? def.textSource : "").trim().toLowerCase();
    const textValue = NON_VISIBLE_TEXT_SOURCES.has(textSource)
      ? ""
      : (typeof def.text === "string" ? def.text : "").trim();
    if (!textValue) {
      const widthForGuard = Number.isFinite(def?.layout?.computedWidthPx)
        ? def.layout.computedWidthPx
        : 9999;
      if (widthForGuard <= 96) continue;
    }

    const bg = normalizeHex(def.backgroundColor);
    if (!bg) continue; // Primary buttons must have a filled background.

    // FILTER 1 — Canvas-reject (DISCARD). When the button's background
    // hex matches a known canvas / chrome surface (body, html,
    // header/footer, or any row flagged `isNeutralBackground` /
    // `roleHint: "page"`), the row is not a brand-distinctive primary
    // CTA: it is rendered on the page surface itself (typically an
    // icon-only or text-link button on a white body). Discard before
    // bucketing so it also stays out of `totalWithBg`.
    if (canvasSurfaces.has(bg)) continue;

    const fg = normalizeHex(def.fontColor);
    const radius = numberOrNull(def.borderRadius);
    const layoutIntent = (def.layout && typeof def.layout.intent === "string") ? def.layout.intent : "unknown";
    const candidateScore = Number.isFinite(def?.selectionSignals?.candidateScore)
      ? def.selectionSignals.candidateScore : 0;

    // FILTER 2 — Chrome / consent demote (PENALTY at scoring time).
    // Tag the row up-front so the bucket can track what fraction of
    // its rows look like chrome. We do not skip; the penalty applies
    // at sort time so a mostly-real bucket with one chrome straggler
    // is not lost.
    const isChrome = looksLikeChromeButton(def);

    totalWithBg += 1;
    const sig = JSON.stringify({ bg, fg, radius, layoutIntent });
    const bucket = buckets.get(sig) || {
      bg,
      fg,
      radius,
      layoutIntent,
      count: 0,
      chromeRows: 0,
      totalScore: 0,
      sampleTexts: [],
    };
    bucket.count += 1;
    if (isChrome) bucket.chromeRows += 1;
    bucket.totalScore += candidateScore;
    if (typeof def.text === "string" && def.text && bucket.sampleTexts.length < 3
        && !bucket.sampleTexts.includes(def.text)) {
      bucket.sampleTexts.push(def.text.slice(0, 40));
    }
    buckets.set(sig, bucket);
  }

  if (buckets.size === 0 || totalWithBg === 0) return [];

  // Scoring pass: compute the chrome penalty and logo boost per
  // bucket. Chrome penalty is a large constant (1000) — enough to
  // bury any chrome-dominated bucket below a legitimate one,
  // regardless of count. The logo boost is a small constant (50) —
  // a soft tie-breaker between two otherwise comparable buckets,
  // not enough to flip a high-count real CTA below a low-count
  // logo-fill-matching alternative.
  const ranked = [];
  let originalOrder = 0;
  for (const bucket of buckets.values()) {
    const chromeDominated = bucket.count > 0 && (bucket.chromeRows / bucket.count) >= CHROME_DOMINATED_RATIO;
    const chromePenalty = chromeDominated ? 1000 : 0;
    // FILTER 3 — Logo-fill cross-reference (BOOST). When the button
    // background hex exactly equals a non-trivial logo SVG fill, raise
    // the score so a real brand CTA outranks a same-count but
    // non-brand-matching alternative. Exact-hex equality only (no ΔE
    // tolerance) per the spec — the boost set already excludes
    // white/black.
    const logoBoost = logoFillSet.has(bucket.bg) ? LOGO_BOOST : 0;
    ranked.push({
      bucket,
      chromeDominated,
      chromePenalty,
      logoBoost,
      originalOrder: originalOrder++,
    });
  }

  ranked.sort((a, b) => {
    const aSort = a.bucket.totalScore + a.logoBoost - a.chromePenalty;
    const bSort = b.bucket.totalScore + b.logoBoost - b.chromePenalty;
    if (bSort !== aSort) return bSort - aSort;
    if (b.bucket.count !== a.bucket.count) return b.bucket.count - a.bucket.count;
    return a.originalOrder - b.originalOrder;
  });

  // F2-strict denominator: sum nonChromeCount across ALL buckets, not
  // just the top-3 slice. The pre-emit divides a bucket's non-chrome
  // count by this aggregate to obtain `effectiveConfidence`. Computing
  // it over the slice (legacy behaviour) would under-count when a site
  // has 4+ legitimate non-chrome buckets — bucket #4's rows would
  // disappear from the denominator and inflate the top bucket's
  // confidence. Computing over all buckets keeps the ratio honest.
  const totalNonChromeAllBuckets = ranked.reduce((sum, r) => {
    return sum + Math.max(0, r.bucket.count - r.bucket.chromeRows);
  }, 0);

  return ranked.slice(0, 3).map(({ bucket, chromeDominated }) => ({
    value: {
      backgroundColor: bucket.bg,
      fontColor: bucket.fg,
      borderRadius: bucket.radius,
      layoutIntent: bucket.layoutIntent,
    },
    confidence: roundConfidence(bucket.count / totalWithBg),
    chromeDominated,
    // Per-bucket counts exposed so the pre-emit can recompute
    // confidence using the F2-strict semantics (chrome rows excluded
    // from BOTH numerator and denominator). `count` is the raw bucket
    // size; `chromeRows` is the subset whose visible text matched the
    // chrome / consent / locale regex (`looksLikeChromeButton`).
    count: bucket.count,
    chromeRows: bucket.chromeRows,
    // F2-strict denominator over ALL buckets — see comment above. The
    // pre-emit prefers this field when present; older callers that
    // only see the slice fall back to summing within the slice.
    totalNonChromeAllBuckets,
    evidence: `${bucket.count} of ${totalWithBg} filled-background buttons match; texts: ${bucket.sampleTexts.join(", ") || "(none)"}`,
  }));
}

// ---------------------------------------------------------------------------
// PRODUCT-CARD CTA LANE
//
// Some storefronts have no text buy button at all: the purchase control is an
// icon on every card. `rankPrimaryButtonCandidates` above skips those rows by
// design (they carry no usable button geometry), and what is left of the
// button probe is a chat widget, a newsletter form, a "0" badge -- three
// one-row buckets, none of which reaches the pre-emit floor. Measured on the
// replay corpus: four archived runs of one bookstore publish a #333377 chat
// widget at effective confidence 0.33 as the brand's primary button, while
// 380 of 380 product cards carry the same magenta buy control.
//
// The purchase colour IS measured on those sites -- on every product card --
// so this lane ranks it from that evidence instead. It is consulted ONLY when
// the button lane abstains (`cardLaneEngages`), never to overrule a bucket
// that reached the floor.
//
// WHY THESE FOUR ARMS. Together they say "the page's product controls agree on
// one colour, that colour means buy, and it is a real button element" --
// which is what "THE purchase control" means when no text button exists:
//
//   1. count       -- the majority background appears on at least
//                     CARD_CTA_MIN_CARDS distinct PRICED cards (one card is a
//                     coincidence, a page of them is a design). The probe
//                     emits a row per (selector x card), so the rows are
//                     folded into cards first -- see `countDistinctCards`;
//   2. consistency -- its share of filled product-CTA rows is at least
//                     CARD_CTA_MIN_SHARE (a 60/40 split is two controls, and
//                     this lane has no way to say which one buys);
//   3. intent      -- at least one of those rows carries the probe's own
//                     `ctaLooksPurchaseLike` verdict, made inside a product
//                     card;
//   4. corroboration -- at least one `button-styles.json` row carries the same
//                     filled background, so the colour is a real button
//                     element on the page and not only a card swatch.
//
// The two numbers are floors, not tuned separators: MEASURED over the 50-dir
// replay corpus, the set of sites this lane fires on is IDENTICAL at a floor
// of 2, 3, 4, 5, 6, 8, 10 and 16 rows and at CARD_CTA_MIN_SHARE 0.5 through
// 0.95. The firing sites sit at 16-380 rows and share 0.986-1.00; the
// non-firing ones have no card CTA at all. Only share = 1.00 exactly changes
// the set, by dropping two sites whose 276 of 280 cards agree. Folded into
// cards (below) the same firing dirs hold 13-95 (16-95 where the lane engages)
// distinct cards, so the floor of 3 separates nothing there either.
//
// Consent / chrome / carousel controls cannot enter: this lane reads product
// card rows only, through the scaffolder's own `isLikelyProductCardRow`, and
// only the PRICED ones among them -- a purchase-looking control on an
// unpriced tile (a hero slide, a collection tile, a promo) is navigation, not
// the control of an offer, and casts no vote. It applies the SAME F1
// canvas-reject set the button lane applies, so a white-on-white card CTA is
// refused here exactly as it is refused there.
export const CARD_CTA_MIN_CARDS = 3;
export const CARD_CTA_MIN_SHARE = 0.8;

// ONE VOTE PER CARD. The probe emits a row per (selector x card): the same
// card reached through four selectors is four rows and ONE design decision,
// so counting rows measures our selector list, not the page. A card is an
// OFFER, and an offer has two identity facts the row already carries:
//
//   - its product URL (`productUrl`): the same offer rendered twice -- a
//     carousel's cloned slides, a second placement -- is one offer;
//   - its price node (`price.boundingBox`): a card has ONE price element, so
//     every selector that reaches the card reaches the same box, including a
//     selector that matched a sub-element below the link (a purchase section
//     carries the price and the CTA but not the product anchor, so its row
//     has no URL).
//
// The box is the bridge: a URL-less row borrows the URL of any row that
// shares its price box, and a box no URL-carrying row shares is an identity
// of its own. A row with neither fact is its own card -- the posture older
// captures and fixtures already get from the product filter -- and the worst
// that can do is count a row once.
export function countDistinctCards(rows) {
  const facts = (Array.isArray(rows) ? rows : []).map((row) => ({
    url: typeof row?.productUrl === "string" && row.productUrl ? row.productUrl : null,
    box: priceBoxKey(row?.price?.boundingBox),
  }));
  const urlByBox = new Map();
  for (const { url, box } of facts) {
    if (url && box && !urlByBox.has(box)) urlByBox.set(box, url);
  }
  const cards = new Set();
  facts.forEach(({ url, box }, index) => {
    const offer = url || (box && urlByBox.get(box)) || null;
    cards.add(offer ? `url:${offer}` : box ? `box:${box}` : `row:${index}`);
  });
  return cards.size;
}

function priceBoxKey(box) {
  if (!box || typeof box !== "object") return null;
  const parts = [box.x, box.y, box.width, box.height];
  if (!parts.every((value) => Number.isFinite(value))) return null;
  return parts.map((value) => Math.round(value)).join(":");
}

export function rankCardCtaCandidates(productRows, { backgroundStyles = [], buttonStyles = [] } = {}) {
  if (!Array.isArray(productRows) || productRows.length === 0) return [];
  const canvasSurfaces = deriveCanvasSurfaceHexes(backgroundStyles, {
    canvasHex: deriveCanvasHex(backgroundStyles),
  });
  const buckets = new Map();
  let total = 0;
  for (const row of productRows) {
    if (!isLikelyProductCardRow(row)) continue;
    // A product card is a PRICED offer and its purchase control belongs to the
    // offer; an unpriced tile's "Shop now" is navigation and casts no vote.
    // Rows without a signals object (older captures, fixtures) are kept, as
    // the filter keeps them.
    const signals = row?.selectionSignals;
    if (signals && typeof signals === "object" && signals.hasCurrentPrice !== true) continue;
    const bg = normalizeHex(row?.cta?.backgroundColor);
    if (!bg || canvasSurfaces.has(bg)) continue;
    total += 1;
    const bucket = buckets.get(bg) || { bg, count: 0, purchase: 0, fonts: new Map(), rows: [] };
    bucket.count += 1;
    bucket.rows.push(row);
    if (row?.selectionSignals?.ctaLooksPurchaseLike === true) bucket.purchase += 1;
    const fg = normalizeHex(row?.cta?.fontColor);
    if (fg) bucket.fonts.set(fg, (bucket.fonts.get(fg) || 0) + 1);
    buckets.set(bg, bucket);
  }
  if (total === 0) return [];
  const top = [...buckets.values()].sort((left, right) => right.count - left.count)[0];
  const share = top.count / total;
  const corroborating = (Array.isArray(buttonStyles) ? buttonStyles : [])
    .filter((row) => normalizeHex(row?.default?.backgroundColor) === top.bg).length;
  const cards = countDistinctCards(top.rows);
  if (cards < CARD_CTA_MIN_CARDS) return [];
  if (share < CARD_CTA_MIN_SHARE) return [];
  if (top.purchase < 1) return [];
  if (corroborating < 1) return [];
  const fontColor = [...top.fonts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? null;
  return [{
    source: "product-card-cta",
    value: { backgroundColor: top.bg, fontColor },
    confidence: roundConfidence(share),
    count: top.count,
    of: total,
    cards,
    purchaseRows: top.purchase,
    corroboratingButtons: corroborating,
    evidence: `${cards} product card(s) (${top.count} of ${total} rows) share this purchase CTA background (${top.purchase} purchase-like); ${corroborating} button-styles row(s) carry it`,
  }];
}

// F2-strict effective confidence, in ONE place.
//
// Chrome rows are excluded from BOTH the numerator and the denominator, and
// the denominator is the ranker's `totalNonChromeAllBuckets` (summed over
// every bucket, including those the top-3 slice clipped) with a
// sum-over-the-slice fallback for hand-built candidate arrays. Moved out of
// `colour-pre-emit.js` verbatim because the abstain decision now has two
// readers -- the pre-emit and the candidates block -- and a second copy of
// this ratio is a second answer to "did the button lane reach the floor?".
export function withEffectiveConfidence(primaryCandidates) {
  const candidates = Array.isArray(primaryCandidates) ? primaryCandidates : [];
  const sumOverSlice = candidates.reduce((sum, c) => {
    const nonChrome = Math.max(0, (c?.count ?? 0) - (c?.chromeRows ?? 0));
    return sum + nonChrome;
  }, 0);
  const effectiveTotal = candidates[0]?.totalNonChromeAllBuckets ?? sumOverSlice;
  return candidates.map((c) => {
    if (!c) return c;
    const nonChrome = Math.max(0, (c.count ?? 0) - (c.chromeRows ?? 0));
    const effectiveConfidence = effectiveTotal > 0 ? nonChrome / effectiveTotal : 0;
    return { ...c, effectiveConfidence };
  });
}

// The abstain decision. Returns the card-lane candidate list when no non-chrome
// button bucket reaches the pre-emit floor, and `[]` otherwise -- so the lane
// is additive by construction: on every site where the button lane speaks,
// the pool is byte-identical to today's.
export function cardLaneEngages(primaryCandidates, productRows, { backgroundStyles = [], buttonStyles = [] } = {}) {
  const top = withEffectiveConfidence(primaryCandidates)
    .find((candidate) => candidate && candidate.chromeDominated !== true);
  if (top && top.effectiveConfidence >= MINIMUM_PRE_EMIT_CONFIDENCE) return [];
  return rankCardCtaCandidates(productRows, { backgroundStyles, buttonStyles });
}

// A price probe's rows are not typography-role evidence.
//
// `[class*='price']` is in `DEFAULT_TEXT_SELECTORS` so the price channel can
// be measured; nothing makes those rows candidates for a REGION role, and on
// a storefront they are the single most numerous bold-and-large population
// there is. Measured on the historical replay corpus: one site's winning heading bucket
// was 60 of 60 rows from this selector, every one bare numerals, and the
// candidate it produced carried the PRICE colour `#f71720` at confidence 1.0
// -- which `SKILL.md:324` then tells the agent to copy after one screenshot
// check.
//
// It matters just as much in the BODY role, contrary to an earlier version of
// this comment which claimed prices are bold so they rarely qualify. Measured
// on the same capture: 400 of that site's 693 body-eligible rows come from this
// selector -- 58 percent -- because a storefront prints plenty of small,
// regular-weight price text ("грн", bare digits, per-unit rates).
//
// This is a candidacy rule, not a scoring tweak: the heading filter is
// `weight >= 600 && sizePx >= 18`, which a price satisfies by construction
// and which cannot be repaired by tuning, because on a storefront the price
// really is bold and large.
//
// SUBSTRING, not an exact literal. A copied literal of one default selector
// dies silently the day anyone respells it, and the failure direction is
// unsafe: an unrecognised selector reads as "not a price" and the exclusion
// stops applying. That asymmetry is the opposite of
// `typographyRoleHintsForSelector`, where an unknown selector yields `[]` and
// fails safe. It is also not hypothetical -- eva's capture has ZERO
// `[class*='price']` rows, so storefronts whose price classes miss this exact
// spelling already exist, and `SKILL.md` tells the agent to append
// site-specific selectors on a re-probe.
//
// AND THE SUBSTRING ALONE IS NOT THE TEST, because the selector is not a
// bounded vocabulary. The 13-entry probe table does not fence what `selector`
// can hold: `SKILL.md` instructs the agent to "keep every entry and append
// your site-specific ones", and `lib.js` records the caller's `--selector`
// verbatim. Both failure directions are reachable, and both were reproduced
// against this ranker:
//
//   [data-amount] x 40      -> the price bucket is crowned `heading` at
//                              confidence 0.98, which is #131's production
//                              defect verbatim, all gates green.
//   .price-guide .headline  -> 0 candidates, on a `div` that the retained
//     ("How Our Pricing Works")  flat `h2` selector cannot re-reach, so
//                              nothing rescues it. (`.price-guide h2` usually
//                              self-heals for exactly that reason.)
//
// ONE PREDICATE, NOT TWO OPERATIONS. Adding the text as an OR-arm can only
// ADD price classifications, so it leaves the prose heading classified as a
// price; a veto bolted on afterwards then modifies the very rule the OR was
// added to. Stated once, the text leads and the selector is what remains:
//
//   text says price      -> a price, whatever the selector is called
//   selector says price  -> a price UNLESS the text reads as prose
//   neither              -> not a price
//
// THE SELECTOR ARM IS LOAD-BEARING, NOT LEGACY. `textReadsAsAnchoredPrice` is
// currency-anchored, so "€1.299,00" (dot-thousands, which `normalizeAmountText`
// declines) returns false, and so does a price whose currency is a separate
// span or a background image and never reaches the text at all. Both are bare
// numerals, `readsAsProse` is false on them, and the selector arm still
// excludes them. Delete it and those rows become heading candidates.
//
// `readsAsProse` IS DELIBERATELY CONSERVATIVE, and the corpus is why. Censused
// over all 768 archived `text-styles.json`: 26360 rows carry a price selector
// AND pass a typography filter, 10561 of them the text arm above already
// catches, and the letter-bearing remainder the parsers decline is 6249 rows
// in just 25 DISTINCT strings -- every one of them price-widget chrome, not a
// headline. "на бонусний рахунок" x2646, "грн." x2586, "Звичайна ціна" x300,
// "В кошик" x259, "Ціна зі знижкою" x220. So `hasLetters` is NOT the prose
// test: it would readmit all of those. Requiring the absence of BOTH a digit
// and a currency token is what separates a phrase from a price widget's label.
//
// It does not separate them perfectly, and nothing lexical can -- "Звичайна
// ціна" and "How Our Pricing Works" are both short letter-only phrases. So the
// tie is broken on which error is safe: crowning a price as the heading is
// #131, while withholding a candidate grades as a `gap` the never-fail rung
// already handles. When in doubt this stays "price", the exclusion stays
// applied, and the measured cost of the 8 chrome strings this does readmit is
// recorded below.
//
// THE TEXT ARM'S KNOWN FALSE EXCLUSION, measured rather than inherited.
// `textReadsAsAnchoredPrice` is `parsePriceText || salvageAnchoredPrice`, and
// only the first requires the WHOLE node text to be a price; the salvage path
// pulls amounts out of a blob, so a marketing headline that QUOTES an amount
// reads as a price ("Топовые смартфоны со скидками до 7000 грн!" x80 on
// one storefront). Dropping salvage was measured, not assumed: over the corpus rows
// that pass a typography filter, salvage is the only reader for 373 of the
// newly-excluded rows -- 279 of them genuine old/current pairs
// ("202 грн. 310 грн." x46 on another, which `parsePriceText` refuses as an
// ascending pair) against 94 prose-with-an-amount. It buys three correct
// exclusions per false one, and the false one errs toward `gap`, so both
// readers stay. A site whose real heading quotes a price is the residual, and
// it is not closable lexically.
//
// MEASURED BLAST RADIUS, replaying this ranker over all 768 captures at the
// commit before this change and at it: `heading-typography` is byte-identical
// on every capture -- no top candidate lost, gained or moved, no confidence
// changed. `body-typography` moves no top-candidate VALUE and no second
// candidate on any capture either; 178 captures across 5 sites shift the top
// candidate's CONFIDENCE only, by -0.15 to +0.16, and none of the 1536
// capture-roles crosses `CANDIDATE_CONFIDENCE_FLOOR`.
export function isPriceProbeRow(row) {
  // No local string guard: `textReadsAsAnchoredPrice` delegates to two readers
  // that both open with `typeof rawText !== "string"`, and `readsAsProse`
  // guards its own argument. A third copy here changed no answer for any
  // input, which a mutation deleting it demonstrated by killing no test.
  const text = row?.text;
  if (textReadsAsAnchoredPrice(text)) return true;

  const selector = typeof row?.selector === "string" ? row.selector.trim().toLowerCase() : "";
  if (!selector) return false;
  // `.includes` on the already-lower-cased selector, which is what `/price/i`
  // would be. Verified rather than assumed: `"pricing".includes("price")` is
  // FALSE ("prici" != "price"), so `.pricing`, `[class*='pricing']` and
  // `#pricing-faq h3` escape this arm entirely -- the rule reads as if it
  // covered every price-ish class name and it does not. That hole is exactly
  // what the text arm above closes: under those same selectors a
  // currency-anchored price is now excluded on its text alone, where base
  // admitted every one of them.
  if (!selector.includes("price")) return false;
  return !readsAsProse(text);
}

// Does this text read as a phrase rather than as anything a price node emits?
//
// Three tests, and every one of them has a corpus row behind it:
//   letters      a phrase is made of letters. The digit test below already
//                covers every bare numeral, so what is left to this line is
//                punctuation-only text -- "*", "‹", "›", "→", which occur 17
//                times across the corpus's 284926 rows (0 of them under a
//                price selector, so this is the safe direction chosen where
//                the corpus is silent, not a measured save).
//   no digit     an amount is present, so the node is quoting a number even
//                where the currency did not parse ("від 1800 ₴/міс").
//   no currency  "грн." x2586 is a price node's currency word standing alone;
//                it carries no digit and would otherwise read as a phrase.
//
// The currency alphabet is `holdsCurrencyToken`'s, shared rather than
// respelled, for the reason that function's own comment gives.
function readsAsProse(rawText) {
  const text = typeof rawText === "string" ? rawText.trim() : "";
  if (!text) return false;
  if (!hasLetters(text)) return false;
  if (/\d/u.test(text)) return false;
  return !holdsCurrencyToken(text);
}

// ---------------------------------------------------------------------------
// THE SALIENT FALLBACK LANE
//
// `salient-text.json` (lib/salient-text.js) is a selector-free walk of the
// page's most prominent visible text. It exists because tag choice decides a
// row EXISTS: a heading that is not an `h1..h3` is never captured by the
// selector probe at all, so the lanes above cannot rank what was never
// recorded. One historical-corpus site is the measured case -- zero `h1..h3`, zero landmarks, and
// a visual heading that is a `div` at 32px/700.
//
// FALLBACK-ONLY IS THE INVARIANT, not a preference. This lane runs for a role
// only when the primary lane returned NOTHING for that role; where the primary
// produced anything, these functions return exactly what they returned before,
// byte for byte. Fourteen of twenty sites in the historical replay corpus resolve every
// region role from selectors and must not move. It is also the lesson the logo
// arc already paid for: a fallback source that COMPETES with a primary one
// evicts the better answer instead of filling in for a missing one.
//
// And it is one leg. `UNCORROBORATED_CONFIDENCE_CAP` is why -- see the
// constant. The row was measured; nothing says it is the role.

// The ranker names roles "heading" / "body"; `salient-text.js` names region
// roles in full. Mapped rather than concatenated so an unknown role produces
// nothing instead of a plausible-looking string the producer would decline.
const SALIENT_TYPOGRAPHY_ROLE = new Map([
  ["heading", "heading-typography"],
  ["body", "body-typography"],
]);

// Matches the selector lane's `slice(0, 2)`: the agent is offered a first
// choice and one alternative, never a slate to curate.
const SALIENT_CANDIDATE_CAP = 2;

// Re-exported from its new home so the ranker's public surface is unchanged.
// The definition moved into `lib/salient-text.js` because the exclusion has to
// happen before that module chooses a prominence tier -- see
// `admissibleSalientRows`.
export { salientRowReadsAsPrice };

// Which recorded rows may stand for `hint`, in the capture's own order.
//
// DELEGATED. Which rows are structurally admissible for a role is a fact about
// the capture, so it is answered by the module that WRITES the capture and
// never re-derived here -- the delegation rule stated in lib/role-evidence.js.
// A copied predicate drifts from its producer silently, and the drift
// direction is unsafe.
//
// The ORDER is likewise consumed, not recomputed: the walk sorts by size, then
// weight, then area before it slices, and `salientRowsForRole` is a filter, so
// what comes back is still the capture's own prominence ranking.
//
// THE PRICE EXCLUSION IS NOT HERE ANY MORE, and that is the fix. It used to be
// a `.filter()` on this line, which runs AFTER `salientProminenceLeaders` has
// already chosen the top size/weight tier over every row -- so a 48px price
// above a 32px heading picked the price tier and this filter then emptied it,
// with no fallthrough. `salientRowsForRole` now drops price-shaped rows before
// it ranks anything; a second filter here would be the same rule in two places.
function admissibleSalientRows(salientRows, hint) {
  return salientRowsForRole(salientRows, hint).filter(
    (row) =>
      typeof row.fontFamily === "string" &&
      row.fontFamily &&
      Number.isFinite(row.fontWeight) &&
      Number.isFinite(row.fontSizePx),
  );
}

// SPLIT, NOT SHARED. When the capture ranks two rows equally and nothing
// recorded separates them, the run does not know which is the role, and
// publishing both at the full cap would state twice over a certainty it holds
// once. Dividing says what is true: there are N readings and no way to choose.
// A lone survivor keeps the whole cap, which is still short of the copy band.
function salientConfidence(count) {
  return roundConfidence(UNCORROBORATED_CONFIDENCE_CAP / Math.max(1, count));
}

// The row's TEXT is deliberately absent, for the reason `describeSalientRow`
// states: a signature identifies the row without republishing page copy into a
// diagnostic that travels to the report.
function salientEvidence(prefix, rows, index) {
  const row = rows[index];
  const rank = index === 0 ? "most prominent" : `#${index + 1}`;
  const occurrences = Number.isInteger(row.occurrences) ? row.occurrences : 1;
  return (
    `${prefix}; the selector-free capture (salient-text.json) holds ${rows.length} ` +
    `admissible row(s) for it and this is the ${rank} by that capture's own ranking: ` +
    `${describeSalientRow(row)}, seen ${occurrences}x. Measured on the rendered page, ` +
    "but no selector vouches that it IS this role -- confirm against the screenshot " +
    "before use."
  );
}

// THE PREFIX SAYS WHICH LANE'S ABSENCE PUT THIS ENTRY HERE, and the two are
// not the same absence.
//
// `gateWouldRefuseIt === false` covers the gap case this lane was built for --
// no selector reaches the role, `typographyRoleCoverage` grades it a gap, and
// SKILL.md's bounded exception licenses copying this value verbatim onto a row
// -- and equally the grades under which the gate has NO opinion
// (`probe_provenance_unproven`, `capture_unusable`), where a refusal warning
// would be a claim about a branch that never runs.
//
// `gateWouldRefuseIt === true` is the OTHER trigger -- an empty
// `weight >= 600 && sizePx >= 18` bucket on a page whose selector mapper DID
// resolve the role (three storefronts: 700/16, 700/17, 400/25). There
// the entry is a measurement and NOT a licence, and until this prefix existed
// it said "no selector-derived <role> candidate exists on this page", which is
// true of the bucket and reads as a gap. It is not one: the coverage gate takes
// the `EVIDENCE_PRESENT` branch, `typographyHintIsValueAnchored` is never
// consulted, and `typographyHintIsCaptureAnchored` demands a `text-styles.json`
// signature instead -- so an agent following the unscoped confidence band and
// copying this 0.75 entry verbatim gets `value_not_measured` and exit 1.
// Reproduced end to end through the real assembler on an `h1` at 700/16 plus
// one salient row: clean normalize exit 0 with `typographyRoleCoverage: []`,
// then exit 1 on the copy.
//
// WHY THE ENTRY IS STILL PUBLISHED. Deleting it is what the design doc
// prescribes (`docs/brandkit-external-review-fix-plan.md`, "Gap-gate it") and
// what the colour twin already does (`rankTextColorCandidates` returns `[]`
// when `textColorRoleIsDerivable`). It is the deeper repair and it needs a
// live sweep this tree cannot run: the three captures the regression guard in
// `salient-candidate-lane.test.js` names do not exist here -- `salient-text.json`
// and `text-styles.probed.json` are both ZERO files across the whole corpus
// and both sibling repos -- and the one published `poolHasConfidentCandidate`
// measurement covers the SUPERSET of publishes, not the shrunk set. So the
// licence claim is corrected where it is made, and the deletion is left to
// whoever can re-measure it.
function salientTypographyCandidates(salientRows, role, gateWouldRefuseIt = false) {
  const hint = SALIENT_TYPOGRAPHY_ROLE.get(role);
  if (!hint) return [];
  const rows = admissibleSalientRows(salientRows, hint);
  if (rows.length === 0) return [];
  const emitted = rows.slice(0, SALIENT_CANDIDATE_CAP);
  return emitted.map((row, index) => ({
    // THE LANE, STAMPED ON THE ENTRY. A candidate's value cannot say where it
    // came from, and the region-role value anchor has to know: only a
    // salient-sourced candidate may anchor an authored hint. Selector-lane
    // entries deliberately carry no marker -- a field absent is a lane that
    // never claimed to be this one.
    source: SALIENT_CANDIDATE_SOURCE,
    value: {
      fontFamily: row.fontFamily,
      fontWeight: row.fontWeight,
      fontSizePx: row.fontSizePx,
      // The walk records `lineHeight` as the computed CSS string ("20px",
      // "normal"); the selector lane's `lineHeightPx` is a number. "normal"
      // parses to nothing and stays null rather than becoming a guess.
      lineHeightPx: numberOrNull(Number.parseFloat(row.lineHeight)),
      color: normalizeHex(row.color),
    },
    confidence: salientConfidence(emitted.length),
    evidence: salientEvidence(
      gateWouldRefuseIt
        ? `the selector-to-role mapper DID resolve ${role}-typography on this page, so this ` +
          "entry is NOT licensed for it and must not be copied onto a row carrying that role -- " +
          "`typographyRoleCoverage` will refuse the row as `value_not_measured`. It is published " +
          `only because the size/weight bucket that normally ranks ${role}-typography is empty ` +
          "here. Take the row's value from a captured `text-styles.json` row for the role instead"
        : `no selector-derived ${role}-typography candidate exists on this page`,
      rows,
      index,
    ),
  }));
}

function typographyFilter(role) {
  if (role === "heading") {
    return (row) => Number.isFinite(row?.fontWeight) && row.fontWeight >= 600
      && Number.isFinite(row?.fontSizePx) && row.fontSizePx >= 18;
  }
  if (role === "body") {
    return (row) => Number.isFinite(row?.fontWeight) && row.fontWeight <= 500
      && Number.isFinite(row?.fontSizePx) && row.fontSizePx >= 12 && row.fontSizePx <= 18;
  }
  return () => true;
}

// The two-lane dispatcher, and the whole of the fallback-only invariant.
//
// FALLBACK-ONLY IS ABOUT PRECEDENCE, and precedence is preserved exactly: the
// selector lane runs first and its entries keep the front of the array, so the
// top candidate and its confidence are whatever they were. What changed is the
// TRIGGER and the combination.
//
// The trigger used to be "did the `weight >= 600 && sizePx >= 18` bucket
// produce a row". That is not the question the lane exists to answer. The
// question is "did the selector-to-role MAPPER resolve this role", and it is
// answered by `selectorEvidenceIsAbsent(typographyRoleEvidence(...))` -- the
// same predicate the coverage gate grades a gap with, and the same shape the
// colour twin below already uses (`textColorRoleIsDerivable`, `:1051`).
//
// The two disagree on real captures. Measured across 21: `heading-typography`
// grades a gap on 4 of them, and on 1 of those 4 the bucket is non-empty -- so
// the lane was suppressed on a quarter of its own target population, including
// the one page whose gap nothing else could fill.
//
// BOTH TRIGGERS, NOT A SUBSTITUTION. On the same 21, four captures have an
// EMPTY bucket while the mapper did resolve the role -- their `h1..h3` rows
// are 700/16 and 400/20, 700/17, 400/25, and 500/16, every one of them below
// this filter's floor -- and on three of the four the salient lane publishes
// today. Replacing the empty-bucket arm rather than adding to it would delete
// those candidates. Measured, the union moves
// the top candidate on 0 site-roles, flips `poolHasConfidentCandidate` on 0,
// and grows exactly one published array -- the site that needs it.
//
// AND THE TWO ARMS DO NOT PUBLISH THE SAME KIND OF ENTRY. Only the grade arm's
// entries are LICENCES -- values SKILL.md's bounded exception permits an agent
// to copy onto a row. The empty-bucket arm fires where the mapper DID resolve
// the role, and there the coverage gate takes its `EVIDENCE_PRESENT` branch and
// demands a `text-styles.json` signature, so copying that entry is refused as
// `value_not_measured` (reproduced through the real assembler). The difference
// is carried in the entry's own `evidence` string, which is the only field an
// agent reads before deciding; see `salientTypographyCandidates`. Gap-gating
// the publish outright -- what the design doc prescribes and what the colour
// twin does -- would end the distinction rather than describe it, and is left
// to a sweep that can re-measure the three captures named above.
//
// `salientRows` defaults to `null`, which yields `[]` from the salient lane, and
// `probedSelectors` to `null`, which cannot make an absence grade provable. So
// every caller not taught to pass them, and every capture written before those
// artifacts existed, gets exactly the old behaviour on both branches.
export function rankTypographyCandidates(textStyles, role, salientRows = null, probedSelectors = null) {
  const fromSelectors = rankTypographyCandidatesFromSelectors(textStyles, role);
  const hint = SALIENT_TYPOGRAPHY_ROLE.get(role);
  const grade =
    hint === undefined ? null : typographyRoleEvidence(textStyles, hint, probedSelectors, salientRows);
  const mapperResolvedIt = grade !== null && !selectorEvidenceIsAbsent(grade);
  if (fromSelectors.length > 0 && mapperResolvedIt) return fromSelectors;
  // THE WARNING PREDICATE IS THE GATE'S OWN REFUSING BRANCH, and it is NARROWER
  // than `mapperResolvedIt`. `!selectorEvidenceIsAbsent(...)` is also true for
  // `probe_provenance_unproven` and `capture_unusable` -- the grades a caller
  // that passes no `probedSelectors` always gets -- and under those the coverage
  // gate takes NEITHER branch, so nothing refuses the value and telling the
  // agent it would be refused is simply false. Only `EVIDENCE_PRESENT` reaches
  // `typographyHintIsCaptureAnchored`.
  const gateWouldRefuseIt = grade === EVIDENCE_PRESENT;
  return [...fromSelectors, ...salientTypographyCandidates(salientRows, role, gateWouldRefuseIt)];
}

function rankTypographyCandidatesFromSelectors(textStyles, role) {
  if (!Array.isArray(textStyles) || textStyles.length === 0) return [];
  const filtered = textStyles
    .filter((row) => !isPriceProbeRow(row))
    .filter(typographyFilter(role));
  if (filtered.length === 0) return [];

  const buckets = new Map();
  for (const row of filtered) {
    if (!row || typeof row !== "object") continue;
    const family = typeof row.fontFamily === "string" ? row.fontFamily : null;
    const weight = Number.isFinite(row.fontWeight) ? row.fontWeight : null;
    const size = Number.isFinite(row.fontSizePx) ? row.fontSizePx : null;
    if (!family || weight === null || size === null) continue;

    const sig = `${family}|${weight}|${size}`;
    const bucket = buckets.get(sig) || {
      fontFamily: family,
      fontWeight: weight,
      fontSizePx: size,
      lineHeightPx: numberOrNull(row.lineHeightPx),
      color: normalizeHex(row.color),
      count: 0,
      sampleTags: new Set(),
    };
    bucket.count += 1;
    if (typeof row.tag === "string" && row.tag) bucket.sampleTags.add(row.tag);
    buckets.set(sig, bucket);
  }

  if (buckets.size === 0) return [];
  const totalCount = Array.from(buckets.values()).reduce((s, b) => s + b.count, 0);
  if (totalCount === 0) return [];

  let candidateBuckets = Array.from(buckets.values());

  // BACKLOG item 40 — promo-saturated body-typography filter.
  //
  // body-typography buckets occasionally surface a high-occurrence,
  // high-confidence saturated red/orange/magenta hex (eva fix28:
  // #ff0000 at 0.58 confidence on 204/349 rows) because the live page
  // styles sale-price / promo-badge spans with the same DOM shape the
  // probe captures as `body`. body_text resolves correctly to
  // `#212121` via downstream filters, but `footer_text` falls through
  // to a secondary body row (#595959 in eva's case) instead of the
  // canonical body grey — same site reads two different body colours
  // in the rendered email.
  //
  // Drop promo-saturated body buckets ONLY when a genuine desaturated
  // alternative exists (saturation <= 0.4, confidence > 0.3 on the
  // denominator above). Heading-typography is unaffected — brand-
  // coloured headings remain legal. Same posture as the canvas-ranker
  // chrome penalty: don't strip the candidate when stripping would
  // leave the ladder empty.
  if (role === "body") {
    const promoBuckets = candidateBuckets.filter((b) => isBodyPromoSaturatedColor(b.color));
    if (promoBuckets.length > 0) {
      const qualifyingAlternative = candidateBuckets.some(
        (b) => !isBodyPromoSaturatedColor(b.color)
          && isBodyDesaturatedAlternative(b.color)
          && (b.count / totalCount) > BODY_ALTERNATIVE_CONFIDENCE_MIN,
      );
      if (qualifyingAlternative) {
        candidateBuckets = candidateBuckets.filter((b) => !isBodyPromoSaturatedColor(b.color));
      }
    }
  }

  return candidateBuckets
    .sort((a, b) => b.count - a.count)
    .slice(0, 2)
    .map((b) => ({
      value: {
        fontFamily: b.fontFamily,
        fontWeight: b.fontWeight,
        fontSizePx: b.fontSizePx,
        lineHeightPx: b.lineHeightPx,
        color: b.color,
      },
      confidence: roundConfidence(b.count / totalCount),
      evidence: `${b.count} of ${totalCount} matching ${role} rows; tags: ${[...b.sampleTags].slice(0, 4).join(", ") || "(none)"}`,
    }));
}


// The colour equivalent of the lane above, in the same two-lane shape.
//
// The primary here is not a selector list but the deterministic synthesiser
// `text-color-role-synthesis.js`, which OWNS `heading-text` / `body-text`:
// where it can derive the colour it writes the row itself at normalize time,
// and a candidate published beside it would be a second opinion on a settled
// question. So the lane returns `[]` there -- which `buildCandidates` already
// defines as "no defensible candidate", never "the role is missing from the
// page". Fallback-only, same invariant, same reason as the typography lane.
//
// `captureIsUsable` gates it for the reason `role-evidence.js` gives: an empty
// or absent text-styles capture is a PROCESS fault, not a page fact, and a
// probe that did not run must not be the thing that promotes a salient row.
//
// Colour is the channel this whole rung exists for. `text-styles.json` carries
// only what its selectors matched, so on a page with no `h1..h6` the heading
// COLOUR is underivable even when the heading is plainly visible -- while the
// salient walk recorded it, and recorded it with the colour, because colour is
// in that capture's collapse key precisely so a dark heading cannot vanish
// into a bucket of price-coloured rows.
const SALIENT_TEXT_COLOR_ROLES = new Set(["heading-text", "body-text"]);

export function rankTextColorCandidates(textStyles, hint, salientRows = null) {
  if (!SALIENT_TEXT_COLOR_ROLES.has(hint)) return [];
  if (!captureIsUsable(textStyles)) return [];
  if (textColorRoleIsDerivable(textStyles, hint)) return [];
  const rows = admissibleSalientRows(salientRows, hint).filter((row) => {
    const hex = normalizeHex(row.color);
    // A row whose colour the walk could not read says nothing about colour,
    // and `#ffffff` is skipped for exactly the reason the synthesiser skips
    // it: white heading/body text is meaningful only on a dark page
    // background, which neither producer knows. Inherited from that module,
    // not restated here.
    return hex !== null && hex !== WHITE_HEX;
  });
  if (rows.length === 0) return [];
  const emitted = rows.slice(0, SALIENT_CANDIDATE_CAP);
  return emitted.map((row, index) => ({
    source: SALIENT_CANDIDATE_SOURCE,
    value: normalizeHex(row.color),
    confidence: salientConfidence(emitted.length),
    evidence: salientEvidence(
      `the deterministic synthesis helper (text-color-role-synthesis.js) has no row it could derive ${hint} from`,
      rows,
      index,
    ),
  }));
}

// Placement facts a capture may or may not carry. The probe started emitting
// `region` / `homeLink` / `inLogoContext` / `opacityHidden` / `topPx` alongside
// the older {tag, src, alt, widthPx, heightPx, selector} shape; every capture
// taken before that — and every replayed `page-signals.json` on disk — carries
// none of them. `null` therefore means "this capture cannot say where the mark
// sat", which is NOT the same as "the mark was not in the header", and a row
// that cannot say must price exactly as it always did.
function logoPlacementFacts(entry) {
  if (typeof entry?.region !== "string") return null;
  return {
    region: entry.region,
    homeLink: entry?.homeLink === true,
    inLogoContext: entry?.inLogoContext === true,
    opacityHidden: entry?.opacityHidden === true,
    topPx: Number.isFinite(entry?.topPx) ? entry.topPx : null,
  };
}

// The masthead band. Two fleet shapes make `region === "header"` and
// `homeLink` alone too narrow to recognise a genuine mark: a storefront with
// ZERO landmark elements puts `region` at "body" for every row on the page,
// and a locale-rooted site links its mark at `/ua/` rather than `/`. Both sit
// in the top strip of the first viewport, and the probe never scrolls, so
// `topPx` is measured against the document top. Sweep-tunable: raise it if a
// live sweep finds tall promo bars pushing marks below it, lower it if a
// hero's own imagery starts corroborating.
const MASTHEAD_MAX_TOP_PX = 400;

// "This capture can point at where the mark sat, and that place is one a brand
// puts its OWN mark." Absence of evidence is not corroboration: a capture with
// no facts answers `false`, not `true`.
//
// `inLogoContext` is deliberately NOT a corroborator. It is a TEXT signal
// (`[class*='logo']` / `[id*='logo']` on an ancestor), it is already credited
// in the +5 clause, and it is already gated by the impostor-vocabulary rule —
// a payment badge sits inside a `.payment-logos` wrapper, so context is true
// FOR THE IMPOSTOR. Letting it corroborate would hand back the exact escape
// hatch that rule closes.
function logoPlacementCorroborated(placement) {
  if (!placement) return false;
  return placement.region === "header"
    || placement.homeLink === true
    || (typeof placement.topPx === "number" && placement.topPx <= MASTHEAD_MAX_TOP_PX);
}

// Text that says WHOSE mark this is, and answers "someone else's". A payment
// badge strip, a partner wall, a press or award row: the words "payment-logo",
// "Visa logo", "/payment-logos/visa.svg" name the element a logo, but they
// name it a THIRD PARTY's logo. That is readable in fields the scorer already
// holds, in every capture old and new.
//
// "brand" is deliberately ABSENT — real marks live in `.brand-logo`.
//
// Sweep-tunable: the vendor list is the payment rail actually seen on the
// fleet's storefronts, and the context list the wrapper vocabulary those
// strips are authored with. Add to it from measured pages, not from
// imagination.
const LOGO_IMPOSTOR_VOCABULARY = /(payment|partner|client|sponsor|press|award|social)[-_ ]?(logos?|icons?)|(^|\W)(visa|mastercard|maestro|paypal|apple[-_ ]?pay|g(oogle)?[-_ ]?pay|liqpay|privat24|mono(bank)?)(\W|$)/i;

// A STRIP: many similarly-sized candidates laid out along one horizontal band.
// That shape is what a manufacturer carousel, a payment rail and a partner wall
// all have in common, and — unlike vocabulary or placement — it is a fact the
// probe already reports, so recognising it is pure ranker arithmetic.
//
// The measured defect: a `[class*='logo']` carousel wrapper hands every
// manufacturer tile `inLogoContext` +5, so six tiles scored 10 apiece while the
// brand's own 46x46 masthead mark scored 7 and lost both slate slots. Nothing
// in the tiles' words or placement separates them from a real mark; their
// mutual similarity does.
//
// Deliberately NOT a replacement for `LOGO_IMPOSTOR_VOCABULARY`, which stays:
// the two are complementary. A two-badge strip gives each row only ONE
// band-mate and never reaches the peer floor, and an off-band single badge has
// no band-mates at all — vocabulary is what covers those. This rule is what
// covers the strips vocabulary has never heard of.
//
// Sweep-tunable, all three. `40` is the vertical slack a real strip's rows show
// once baselines and paddings differ; `0.25` is measured against the LARGER of
// the two heights so band membership is a symmetric relation and not an
// artefact of which row is asked; `2` other members is the smallest count that
// says "row", because one neighbour is also what a mark and the search icon
// beside it look like.
const LOGO_BAND_MAX_TOP_DELTA_PX = 40;
const LOGO_BAND_HEIGHT_TOLERANCE = 0.25;
const LOGO_BAND_MIN_PEERS = 2;

// Which rows of a capture are strip members. Presence-gated exactly like the
// placement facts: a row that cannot state `topPx` / `heightPx` — every capture
// taken before the probe emitted them — is never a strip member, so old
// captures rank precisely as they always did.
function logoStripMembership(entries) {
  const bands = entries.map((entry) => {
    const placement = logoPlacementFacts(entry);
    if (!placement || typeof placement.topPx !== "number") return null;
    const height = Number.isFinite(entry?.heightPx) ? entry.heightPx : null;
    if (height === null || height <= 0) return null;
    return { top: placement.topPx, height };
  });
  return bands.map((band, index) => {
    if (!band) return false;
    let peers = 0;
    for (let other = 0; other < bands.length; other += 1) {
      if (other === index) continue;
      const mate = bands[other];
      if (!mate) continue;
      if (Math.abs(mate.top - band.top) > LOGO_BAND_MAX_TOP_DELTA_PX) continue;
      const tallest = Math.max(mate.height, band.height);
      if (Math.abs(mate.height - band.height) > tallest * LOGO_BAND_HEIGHT_TOLERANCE) continue;
      peers += 1;
    }
    return peers >= LOGO_BAND_MIN_PEERS;
  });
}

// Sweep-tunable. It was 60, and 60 is above a real mark: the storefront in the
// measured regression draws its own mark at 46x46, so it took no dimension
// credit at all and lost to a manufacturer tile that did. Lowering it in
// isolation would have admitted every 40-59px icon on every page, which is why
// it lands together with the emission floor and the band rule — both of which
// fence geometry-only rows out, so this constant's blast radius is confined to
// rows that ALSO carry a text signal or corroboration, and that is exactly
// where genuine small marks live.
const LOGO_MIN_WIDTH_PX = 40;

// Score an image candidate from pageSignals.logoCandidates (the real shape is
// {tag, src, alt, widthPx, heightPx, selector} — many entries are banners or
// product tiles, not logos). We have to discriminate by alt/src/selector
// text matches plus reasonable logo dimensions and aspect ratio.
//
// `stripMember` comes from `logoStripMembership` and is a property of the row's
// NEIGHBOURS, which is why it is passed in rather than read off the entry.
function scoreLogoImageCandidate(entry, stripMember = false) {
  const url = typeof entry?.src === "string" ? entry.src : null;
  if (!url) return null;
  const alt = (typeof entry?.alt === "string" ? entry.alt : "").toLowerCase();
  const selector = (typeof entry?.selector === "string" ? entry.selector : "").toLowerCase();
  const w = Number.isFinite(entry?.widthPx) ? entry.widthPx : null;
  const h = Number.isFinite(entry?.heightPx) ? entry.heightPx : null;
  const aspect = (w && h && h > 0) ? w / h : null;
  const lowSrc = url.toLowerCase();

  const placement = logoPlacementFacts(entry);

  // Every TEXT credit below rests on one premise: the words around this
  // element say it is a logo, therefore it is probably THIS site's logo. On a
  // payment / partner / press strip the premise is false — the words say it is
  // a logo AND say whose, and the answer is not this brand. So the three text
  // credits (alt +6, selector/context +5, src +4) do not fire, and the row is
  // priced on geometry alone. Dimensions, aspect and the penalties below are
  // untouched: a badge that really is 66x40 still says so.
  //
  // The consequence that matters is that stacked vocabulary can never outbid
  // geometry. A maximally decorated badge — alt "Visa logo", src
  // `/payment-logos/visa-logo.svg`, class `payment-logo` — scores 20 without
  // this gate and 5 with it.
  const impostorVocabulary = LOGO_IMPOSTOR_VOCABULARY.test(`${alt} ${selector} ${lowSrc}`);

  // Identified as someone else's mark either way: by the words around it, or
  // by the company it keeps. Both answers withhold the same three credits.
  const textCreditsWithheld = impostorVocabulary || stripMember === true;

  // POST-GATE, and that is the whole point. A row whose text credits were
  // withheld does not merely lose the POINTS, it loses text-SIGNAL status: the
  // words on it have been read and found to say "someone else's mark", which is
  // the opposite of evidence that it is this brand's.
  //
  // BUT THE TWO WAYS OF BEING WITHHELD DO NOT END THE SAME WAY, and this
  // comment claimed they did. The emission floor asks for a text signal OR
  // corroboration, and its corroboration arm reads `!result.impostorVocabulary`
  // -- NOT `!textCreditsWithheld`. So:
  //
  //   - identified by VOCABULARY -> no text signal, and the corroboration arm
  //     excludes it by name. Not emitted at all.
  //   - identified only by its BAND (`stripMember`, no vocabulary hit) -> no
  //     text signal either, but corroboration still admits it, so it IS
  //     emitted, priced on geometry alone.
  //
  // That gap is deliberate, and is pinned as such by
  // `assemble-candidates.test.js`'s "the band arm is NOT part of the
  // corroboration exception, and a wordless scroller is the price": widening the term to
  // `!textCreditsWithheld` would close the wordless-scroller shape but would
  // drop a co-branded masthead mark, and losing a real mark is worse.
  let textSignal = false;

  let score = 0;
  if (!textCreditsWithheld && /(^|\W)logo(\W|$)/.test(alt)) {
    score += 6;
    textSignal = true;
  }
  // Same clause, same weight: "the word logo names this element". The
  // selector string can only say so when `simpleSelectorFor` kept the classes,
  // and it drops all of them the moment the element has an id — so on any
  // platform that stamps ids onto images (CS-Cart's `det_img_*`) this bonus was
  // unreachable no matter how the markup was written. `inLogoContext` asks the
  // DOM the same question directly.
  if (!textCreditsWithheld && (selector.includes("logo") || placement?.inLogoContext === true)) {
    score += 5;
    textSignal = true;
  }
  if (!textCreditsWithheld && /\/logo[._\-/]|logo\.(svg|png|webp|jpe?g|gif)/i.test(lowSrc)) {
    score += 4;
    textSignal = true;
  }
  if (w !== null && h !== null && w >= LOGO_MIN_WIDTH_PX && w <= 400 && h >= 16 && h <= 150) score += 3;
  if (aspect !== null && aspect >= 1.0 && aspect <= 6.0) score += 2;
  if (w !== null && w > 800) score -= 3;            // banner-wide
  if (h !== null && h < 16) score -= 3;             // banner-thin
  if (lowSrc.includes("banner") || alt.includes("banner")) score -= 4;

  return {
    url,
    score,
    alt: entry?.alt || "",
    widthPx: w,
    heightPx: h,
    placement,
    stripMember: stripMember === true,
    textSignal,
    // EXPORTED, because the emission floor needs the ANSWER and not just its
    // absence. `textSignal === false` conflates two very different rows: one
    // whose words were silent, and one whose words were read and named a THIRD
    // PARTY. Only the second may have its corroboration arm refused — see the
    // floor below.
    //
    // THE VOCABULARY ARM ALONE, deliberately, and NOT `textCreditsWithheld`.
    // The two halves of that variable answer different questions. Vocabulary
    // is positive evidence about WHOSE mark this is ("visa", "payment-logo"),
    // and no brand names its own mark that way. Band membership is suspicion
    // by association — a fact about the row's NEIGHBOURS — and a co-branded
    // masthead makes a genuine mark a band member. Refusing corroboration on
    // the band arm too drops that mark outright: measured, it turns
    // `img.acme-logo` at `/img/acme-logo.png`, home-linked, `region: header`,
    // 160x40, from one emitted row at 0.70 into `[]`. That is the archetype
    // "a text-signalled mark inside a masthead strip is degraded but NOT
    // dropped" exists to hold, and this term must not break it.
    impostorVocabulary,
    corroborated: logoPlacementCorroborated(placement),
  };
}

// The collector's admissibility contract, stated once so the probe can keep
// exactly the rows this ranker could conceivably emit and drop the rest.
//
// Deliberately COARSER than the rules above — substring `logo` rather than the
// scorer's word-boundary and path-shaped tests, and no knowledge of the
// impostor vocabulary or the band rule — so it is a strict SUPERSET of what can
// be emitted. `assemble-candidates.test.js` pins that direction: every fixture
// row the ranker emits must pass this predicate.
//
// The probe (lib.js `collectPageSignals`) carries a literal copy, because its
// body runs inside `page.evaluate` — a scope boundary no import crosses. The
// two are pinned to each other behaviourally by the collector parity test.
export function logoCandidateKeepRule(entry) {
  if (!entry || typeof entry !== "object") return false;
  const src = typeof entry.src === "string" ? entry.src : "";
  const alt = typeof entry.alt === "string" ? entry.alt : "";
  const selector = typeof entry.selector === "string" ? entry.selector : "";
  return entry.inLogoContext === true
    // `inLogoContext` is NOT a stand-in for this arm. It is computed with a CSS
    // attribute match, which is case-SENSITIVE on attribute values, while the
    // scorer lowercases the selector before `.includes("logo")`. So a
    // `class="Logo-img"` or `id="siteLogo"` mark is credited +5 by the scorer
    // and was invisible here — collected by main, dropped by this rule, gone
    // before the ranker could see it. That is the destruction this file exists
    // to stop, so the arm matches the scorer's case-insensitivity exactly.
    || /logo/i.test(selector)
    || /logo/i.test(src)
    || /logo/i.test(alt)
    || entry.region === "header"
    || entry.homeLink === true
    || (Number.isFinite(entry.topPx) && entry.topPx <= MASTHEAD_MAX_TOP_PX);
}

// `logoAssets` is the parsed `logo-assets.json` written by the homepage pass
// (absent / malformed => null, and this ranker then behaves exactly as it did
// before the artifact existed).
//
// THE HARD CONSTRAINT: it supplies `svgPath` and NOTHING ELSE. `value.url`
// keeps being sourced from `pageSignals.logoCandidates[].src`,
// `capture.headAssets.parsedFavicons[].href`, and `capture.headAssets.ogImage`
// — the page's own PUBLIC source URLs — because the downstream email flow
// re-downloads the logo from `brand.logos[].url` under its own human
// approval, and a worker-local path there is a normalize HARD REJECT.
// `logo-assets.json`'s own `localPath` / `sidecarPath` fields are never read
// here.
export function rankLogoCandidates(capture, pageSignals, logoAssets = null) {
  const out = [];
  const seen = new Set();
  const seenSvgPaths = new Set();
  const svgPathByUrl = svgPathIndexFromLogoAssets(logoAssets);

  const pushIfNew = (entry) => {
    if (!entry || !entry.value || typeof entry.value.url !== "string" || !entry.value.url) return;
    if (seen.has(entry.value.url)) return;
    seen.add(entry.value.url);
    // svgPath ONLY — never `url`.
    const capturedSvgPath = svgPathByUrl.get(entry.value.url);
    if (typeof capturedSvgPath === "string" && capturedSvgPath.length > 0) {
      entry.value.svgPath = capturedSvgPath;
      entry.evidence = `${entry.evidence}; svgPath captured from the rendered page (${capturedSvgPath.length} chars, logo-assets.json)`;
      seenSvgPaths.add(capturedSvgPath);
    }
    out.push(entry);
  };

  // An inline capture has no URL, so it dedupes on its markup instead. Same
  // markup as an already-emitted downloaded asset ⇒ the same mark, and the
  // one carrying a public URL is the better row.
  const pushInlineIfNew = (entry) => {
    if (!entry || !entry.value || typeof entry.value.svgPath !== "string" || !entry.value.svgPath) return;
    if (seenSvgPaths.has(entry.value.svgPath)) return;
    seenSvgPaths.add(entry.value.svgPath);
    out.push(entry);
  };

  // 1. Score img candidates from page-signals.logoCandidates. Many of these
  // are banners or product tiles, so the floor below asks for score >= 4 AND,
  // on any capture that can state its facts, for one identity signal — the
  // words on the row, or the place it sits.
  const signalsLogos = pageSignals && Array.isArray(pageSignals.logoCandidates)
    ? pageSignals.logoCandidates : [];
  const stripMembers = logoStripMembership(signalsLogos);
  const scored = [];
  for (let index = 0; index < signalsLogos.length; index += 1) {
    const entry = signalsLogos[index];
    if (!entry || typeof entry !== "object") continue;
    const result = scoreLogoImageCandidate(entry, stripMembers[index] === true);
    if (!result || result.score < 4) continue;
    // THE EMISSION FLOOR. Geometry is evidence of an IMAGE, not of a LOGO: a
    // 200x126 gift-card product photo takes dimensions +3 and aspect +2 and
    // nothing else, and that 5 was enough to ship it as the brand's `primary`
    // mark at 0.70 on a page where no row anywhere mentions "logo". A row has
    // to say something about identity — the words on it, or the place it sits —
    // before it may represent the brand at all.
    //
    // The text-signal half is POST-gate on purpose. A row whose words name a
    // THIRD PARTY has had them read and answered; it is not a weaker logo
    // candidate, it is a known non-candidate.
    //
    // AND THAT ANSWER HAS TO BEAT PLACEMENT, which is what
    // `!result.impostorVocabulary` on the corroboration arm buys. Without it
    // the two arms contradict each other about the same row: the text arm
    // calls a payment badge a known non-candidate, and the placement arm
    // re-admits it, because `topPx <= MASTHEAD_MAX_TOP_PX` is 400px of first
    // viewport and a trust bar sits inside it. Measured on
    // `rankLogoCandidates` before the term existed — 3 rows,
    // `/payment-logos/rail-N.svg`, alt "Visa logo", 66x40, `region: body`:
    //
    //   topPx 2400 (footer)     -> 0 rows emitted
    //   topPx  350 (trust bar)  -> 2 `type: "primary"` rows at 0.70
    //   topPx  120, one badge   -> 1 `type: "primary"` row  at 0.70
    //
    // and after it, 0 in all three. The 0.75 cap catches none of that: a row
    // priced on geometry alone scores 5, and 0.4 + 5*0.06 = 0.70 is already
    // under the cap, so the flip is between not-emitted and emitted, not
    // between two prices.
    //
    // THE VOCABULARY ARM ONLY. `textCreditsWithheld` — vocabulary OR band
    // membership — is the wider term and it is WRONG here, because the band
    // arm is a fact about a row's NEIGHBOURS rather than about the row. Using
    // it drops the co-branded masthead this file already pins ("a
    // text-signalled mark inside a masthead strip is degraded but NOT
    // dropped"): `img.acme-logo`, src `/img/acme-logo.png`, home-linked,
    // `region: header`, 160x40, beside two similar-height header images, goes
    // from one emitted row at 0.70 to `[]`. Losing a real mark is worse than
    // the hole it would close.
    //
    // SO THIS DOES NOT CLOSE THE BAND CASE, and nothing here should be read as
    // claiming it does: a 4-thumb category scroller at topPx 180 — wordless,
    // every row a `stripMember` — still emits two primaries at 0.70. Refusing
    // corroboration to a WORDLESS band member would close it and would spare
    // the co-branded mark (whose words do say "logo"), but it would newly drop
    // a wordless mark in a wordless header rank, which today survives on
    // document order. That is a trade this corpus cannot referee: not one
    // archived capture carries `region`/`topPx` (737 captures, 8572
    // logoCandidate rows, 0 with facts), so `logoStripMembership` never fires
    // on any of them. It needs a live sweep, like the other two band-shaped
    // deferrals.
    //
    // Nor does it close the wordless-hero case: a 200x126 gift-card product
    // photo at topPx 399 is emitted at 0.70 on placement alone, and at topPx
    // 401 it is not — a 2px flip. Narrowing `MASTHEAD_MAX_TOP_PX` is what
    // reaches that one, and it needs the same sweep.
    //
    // PRESENCE-GATED, like the 0.75 cap: the corroboration clause can only be
    // asked of a capture that carries the fact fields. `placement === null` is
    // an older capture with no facts, and it is admitted exactly as it always
    // was — the floor bites only where the probe could speak.
    if (result.placement && !(result.textSignal || (result.corroborated && !result.impostorVocabulary))) continue;
    scored.push(result);
  }
  // SELECTION IS BY SCORE; the 0.75 rule below caps CONFIDENCE, and it is
  // computed after this slate is already fixed. So placement cannot keep a
  // genuine mark IN the slate — which is exactly how a footer badge strip
  // evicted one: a bare `img.site-mark` in a `<div class="top-bar">` takes
  // dimensions +3 and aspect +2 = 5, while each `img.payment-logo` took
  // selector +5 on top of the same geometry = 10, and `slice(0, 2)` handed
  // both slots to the badges.
  //
  // Corroboration is a TIE-BREAK, not a partition. Partitioning — every
  // corroborated row ahead of every uncorroborated one — fails the mirror
  // archetype, where a corroborated junk pair in the header (a promo banner
  // and a category icon, 5 each) would evict an uncorroborated footer mark
  // that beats them on score (9). And no constant placement TERM can serve
  // both: the first archetype needs corroboration worth more than 5 (mark 5+K
  // must beat badge 10), the second needs it worth less than 4 (mark 9 must
  // beat junk 5+K), and `K > 5 ∧ K < 4` has no solution. Placement is the
  // wrong instrument for that cut; the identity gates in
  // `scoreLogoImageCandidate` are what price the badge honestly.
  //
  // Nor may the tie-break be asked to carry a strip. A live sweep found a
  // manufacturer carousel evicting a storefront's own 46x46 mark, and lowering
  // the dimension floor alone would have "fixed" it only by an engineered
  // coincidental tie — one that holds while the tiles sit at exactly 10 and
  // collapses the moment one tile is decorated (`/brands/apple-logo.svg` +4, or
  // alt "APPLE logo" +6), with the tie-break never reached. The band rule is
  // what actually separates them, and it does so before any of this runs.
  //
  // A stable sort (spec-required since ES2019) supplies document order as the
  // final key for free, so a capture whose rows all answer `false` — every
  // factless capture, and every page-signals.json replayed from disk — comes
  // out in exactly the order it always did.
  scored.sort((a, b) => (b.score - a.score) || (Number(b.corroborated) - Number(a.corroborated)));
  for (const s of scored.slice(0, 2)) {
    // Confidence rises with score: 4 -> 0.64, 10+ -> 0.95.
    let confidence = Math.min(0.95, 0.4 + s.score * 0.06);
    // WITHOUT PLACEMENT CORROBORATION IT MAY NOT REACH THE ≥0.85 "copy it with
    // one screenshot check" band — deliberately the same rule, the same cap and
    // the same reasoning as the inline-<svg> lane below, because it is the same
    // hazard on a different candidate source.
    //
    // Not redundant with the tie-break above: selection and pricing are two
    // independent risks. The tie-break governs who makes the two-row slate; the
    // cap governs who may enter the copy band. A row can win its slot on
    // geometry alone and still be a stranger's mark.
    //
    // Only a capture that CAN say gets judged: `placement === null` is an older
    // capture with no facts, and it prices exactly as it did before.
    if (s.placement && !s.corroborated) {
      confidence = Math.min(confidence, UNCORROBORATED_CONFIDENCE_CAP);
    }
    pushIfNew({
      value: { url: s.url, type: "primary", background: "unknown", svgPath: "" },
      confidence: roundConfidence(confidence),
      // The placement suffix is what makes the cap auditable and tells the
      // agent's screenshot check WHERE to look; `corroborated` is the decision
      // itself, and `topPx` the one input a screenshot can check by eye.
      // `stripMember` is appended last and for the same reason: a co-branded
      // masthead is the one shape where the band rule could bite a genuine
      // mark, and this is what lets a screenshot check see that it did. A
      // factless capture keeps the evidence string it always had, byte for
      // byte.
      evidence: `pageSignals logoCandidate alt="${s.alt}" ${s.widthPx ?? "?"}x${s.heightPx ?? "?"} score=${s.score}${
        s.placement
          ? ` region=${s.placement.region} homeLink=${s.placement.homeLink} inLogoContext=${s.placement.inLogoContext} opacityHidden=${s.placement.opacityHidden} topPx=${s.placement.topPx ?? "?"} corroborated=${s.corroborated} stripMember=${s.stripMember}`
          : ""
      }`,
    });
  }

  // 1b. Inline `<svg>` logos the page never downloaded (lib/inline-svg-logo-
  // capture.js). They rank BETWEEN the two neighbours on purpose:
  //   - BELOW a downloaded logo asset, because that one carries a public URL
  //     the downstream email flow can re-fetch under its own approval, and an
  //     inline capture carries only markup;
  //   - ABOVE a favicon, because a header logo IS the brand mark and a favicon
  //     is a 32px stand-in. Shipping the favicon while the real mark sat
  //     uncaptured in the DOM is the defect this whole path exists to close.
  // `url` is "" — see `inlineSvgLogosFromLogoAssets`. The schema requires the
  // key, not a value, and NOTHING downstream fills it in later — UNLESS THE
  // FINALIZER minted a hosted PNG this run: `svgPath` is evidence of the mark, not an
  // email-usable asset, and the ONLY step that can turn one into the other is
  // the finalizer, which uploads this capture's worker-local
  // sidecar bytes while they still exist and writes the rasterized hosted
  // `.png` back into `brand.logos[].url` (see the note in
  // lib/logo-asset-capture.js and SKILL.md, Phase 4). On every other
  // outcome the old truth stands verbatim and the run has to say so.
  //
  // The `evidence` string below is written at SCAFFOLD time, so it necessarily
  // predates the finalizer's attempt; it hedges rather than asserting an outcome nothing
  // here can know yet.
  for (const inline of inlineSvgLogosFromLogoAssets(logoAssets)) {
    // Same shape as the img scorer's band, one notch lower at the top: an
    // inline capture is strong evidence of the mark but weaker evidence of
    // how the brand publishes it.
    let confidence = Math.min(0.9, 0.45 + inline.score * 0.05);
    // WITHOUT PLACEMENT CORROBORATION IT MAY NOT REACH THE ≥0.85 "copy it with
    // one screenshot check" band. A `.payment-logos svg` or a partner strip
    // mark scores like a header logo on geometry alone; only header / banner /
    // home-link placement says it is THIS brand's.
    if (!inline.placement) confidence = Math.min(confidence, UNCORROBORATED_CONFIDENCE_CAP);
    // AND NEITHER MAY AN ADMISSION WHOSE ONLY EVIDENCE IS PLACEMENT PLUS
    // GEOMETRY. Same cap, same constant, same reasoning as the clause above and
    // as the img lane's `placement && !corroborated` rule — but the asymmetry
    // between the two lanes is the point, so state it:
    //
    //   an IMG row carries `src` and `alt`, two pieces of TEXT that can say
    //   "logo" on their own, so for images placement is the weaker SECOND leg
    //   and the band works with it;
    //
    //   an inline `<svg>` HAS NO TEXT LEG AT ALL. No src, usually no alt, and
    //   on the measured archetype every class CSS-module-obfuscated. That is
    //   precisely why the scan's landmark container arm is required to reach
    //   it — and it means a landmark-only admission is standing on one leg.
    //
    // One leg is enough to EMIT (a masthead mark is a real find, and the
    // alternative is the favicon). It is not enough to tell the agent to copy
    // the thing with a single check. The screenshot check is the identity test
    // no heuristic here fakes, and 0.75 is what asks for it.
    //
    // `=== false`, and `inlineSvgLogosFromLogoAssets` keeps the field TRI-STATE
    // for exactly this line. `null` is a capture taken before the field
    // existed, and such a capture is not evidence-free — it cleared the OLD
    // container gate, which admitted only logo-NAMED containers and home-link
    // anchors. A landmark-only admission was not reachable then, so an old row
    // already carries the evidence this cap asks for and must price exactly as
    // it always did. Only a capture that CAN say, and says no, is capped.
    if (inline.textSignal === false) confidence = Math.min(confidence, UNCORROBORATED_CONFIDENCE_CAP);
    pushInlineIfNew({
      value: {
        url: "",
        type: "primary",
        // Measured by the scan against the live band — the one candidate
        // source that can do better than "unknown".
        background: inline.background,
        svgPath: inline.svgPath,
      },
      confidence: roundConfidence(confidence),
      evidence: `inline <svg> logo captured from the rendered page (${inline.shapeCount} shapes, ${inline.svgPath.length} chars, logo-assets.json) alt="${inline.label}" ${inline.widthPx ?? "?"}x${inline.heightPx ?? "?"} score=${inline.score} placement=${inline.placement ? "header/home-link" : "none"} background=${inline.background}; markup only — no image URL exists for it, so a logo file or URL is still needed unless the finalizer hosts it this run`,
    });
  }

  // 2. Favicons from capture.headAssets.parsedFavicons (preferred — has
  // size hints) or capture.headAssets.icons (fallback).
  const head = (capture && typeof capture === "object" && capture.headAssets) ? capture.headAssets : null;
  const parsedFavicons = head && Array.isArray(head.parsedFavicons) ? head.parsedFavicons : [];
  const icons = head && Array.isArray(head.icons) ? head.icons : [];
  const allIcons = parsedFavicons.length ? parsedFavicons : icons;
  // Sort by largestSizePx descending to favor higher-res favicons.
  const sortedIcons = [...allIcons].sort((a, b) => {
    const aSize = Number.isFinite(a?.largestSizePx) ? a.largestSizePx : 0;
    const bSize = Number.isFinite(b?.largestSizePx) ? b.largestSizePx : 0;
    return bSize - aSize;
  });
  for (const icon of sortedIcons) {
    if (!icon || typeof icon !== "object") continue;
    const href = typeof icon.href === "string" ? icon.href : null;
    if (!href) continue;
    pushIfNew({
      value: { url: href, type: "favicon", background: "unknown", svgPath: "" },
      confidence: 0.7,
      evidence: `capture.headAssets favicon rel="${icon.rel || ""}" largestSizePx=${icon.largestSizePx ?? "?"}`,
    });
  }

  // 3. og:image is often (but not always) the brand logo. Moderate confidence.
  if (head && typeof head.ogImage === "string" && head.ogImage) {
    pushIfNew({
      value: { url: head.ogImage, type: "primary", background: "unknown", svgPath: "" },
      confidence: 0.55,
      evidence: "capture.headAssets.ogImage (often the brand logo, sometimes a marketing image)",
    });
  }

  return out.slice(0, 4);
}

// Top-level orchestrator. Each role key is stable; downstream consumers can
// ignore unknown keys safely. Empty arrays mean "no defensible candidate" —
// they do not mean the role is missing from the page, just that the ranker
// could not score it from the saved artifacts.
export function buildCandidates({
  backgroundStyles = [],
  textStyles = [],
  buttonStyles = [],
  // Raw `product-card-styles.json` rows -- NOT the scaffold's capped/filtered
  // draft list. The card lane needs the full population to know what share of
  // the page's cards agree.
  productRows = [],
  capture = null,
  pageSignals = null,
  logoSvgFills = [],
  logoAssets = null,
  salientRows = null,
  // What the probe LOOKED FOR. The typography lane needs it to tell "this page
  // has no <h2>" from "nobody asked about <h2>", which is the difference
  // between a gap and an unproven capture. Both production call sites already
  // read it for the coverage gates, so this is a parameter, not new I/O.
  probedSelectors = null,
} = {}) {
  const canvasSurfaces = deriveCanvasSurfaceHexes(backgroundStyles, {
    canvasHex: deriveCanvasHex(backgroundStyles),
  });
  return {
    "canvas-background": rankCanvasBackgroundCandidates(backgroundStyles),
    "button-primary": (() => {
      // The card lane appends to the SAME pool the review packet prints and
      // the validators read, so the seed the agent sees in the draft and the
      // seed in the packet are one object. `cardLaneEngages` returns [] unless
      // the button lane abstained, so this is a concatenation with nothing on
      // every site that has a text CTA.
      const pool = rankPrimaryButtonCandidates(buttonStyles, { backgroundStyles, logoSvgFills });
      return [...pool, ...cardLaneEngages(pool, productRows, { backgroundStyles, buttonStyles })];
    })(),
    // BACKLOG item 30 — cross-source CTA-surface ranker. Emits brand
    // surface candidates derived from background-styles when a
    // top-of-page full-width brand bar is present. May be empty on
    // sites where the brand CTA colour is already captured by
    // `button-primary` (the common case).
    "primary-cta-surface": rankCtaSurfaceCandidates(backgroundStyles, canvasSurfaces),
    "heading-typography": rankTypographyCandidates(textStyles, "heading", salientRows, probedSelectors),
    "body-typography": rankTypographyCandidates(textStyles, "body", salientRows, probedSelectors),
    // The two text-colour region roles. New keys, and additive by the rule
    // stated above: a consumer that does not know them ignores them. They are
    // EMPTY on every site whose synthesiser can derive the role -- which is
    // most of them -- because the lane behind them is fallback-only.
    "heading-text": rankTextColorCandidates(textStyles, "heading-text", salientRows),
    "body-text": rankTextColorCandidates(textStyles, "body-text", salientRows),
    "logos": rankLogoCandidates(capture, pageSignals, logoAssets),
  };
}

// Pre-emit ranker-selected brand colours into the scaffolder's payload
// so the LLM agent has tagged seeds to *confirm* on Phase 3 rather
// than curating from empty arrays.
//
// Originally surfaced as a regression where the agent dropped a
// brand-primary accent colour and substituted a generic anchor blue
// for link-text. The pre-emit doesn't prevent override — the agent can
// still edit — but a downstream diagnostic
// (`linkColorBrandAlignmentDiagnostics`) flags the case where the
// agent's link-text doesn't share a value with brand-primary-accent.
//
// Confidence gate: only pre-emit at confidence >= MINIMUM_CONFIDENCE
// (currently 0.5). Top candidate only — never pre-emit lower-confidence
// alternates so the seed remains a single, defensible hypothesis. The
// `canvas-background` seed carries one additive second arm on top of
// that floor (`canvasClearsPreEmitGate` below): a PAGE-ANCHORED top
// bucket seeds from CANVAS_PAGE_ANCHORED_MIN_CONFIDENCE (0.4) instead.
//
// The helper is idempotent: a record with the same value AND a
// fully-covering hint set is treated as already-present and skipped.
// Comparison is on lowercase hex so accidental case drift doesn't
// double-emit.

import {
  countButtonHoverColor,
  countTextStyleColor,
  deriveCanvasHex,
  deriveCanvasSurfaceHexes,
  rankCanvasBackgroundCandidates,
  rankCardCtaCandidates,
  rankCtaSurfaceCandidates,
  rankPrimaryButtonCandidates,
  withEffectiveConfidence,
} from "../assemble-candidates.js";
import {
  CANVAS_PAGE_ANCHORED_MIN_CONFIDENCE,
  MINIMUM_PRE_EMIT_CONFIDENCE,
} from "./coverage-constants.js";

// Re-exported so every existing importer keeps reading it from here. The
// value moved next door because `assemble-candidates.js` now has to answer
// "did the button lane reach the pre-emit floor?" too -- see
// `cardLaneEngages` -- and one number cannot live in two files.
export { MINIMUM_PRE_EMIT_CONFIDENCE };

const PRIMARY_ACCENT_HINTS = ["brand-primary-accent", "button-primary-background"];
const PRIMARY_TEXT_HINTS = ["button-primary-text"];
const CANVAS_BACKGROUND_HINTS = ["canvas-background"];

// BACKLOG item 30 — Minority-signal thresholds for the cross-source
// CTA-surface override. When the ranker's top button-primary candidate
// disagrees with the top CTA-surface candidate, the override fires only
// when the surface hex shows up elsewhere on the page with enough
// frequency to confirm it is the site's real brand colour:
//   - >= 3 text-style rows whose color is the surface hex, OR
//   - >= 1 button-style row whose hoverBackgroundColor is the surface hex.
// Either path is sufficient (OR-gated). The 3-row text-style floor
// avoids coincidence: a single heading happening to share the same hex
// as a top strip is not enough to flip a button-derived decision. The
// 1-row button-hover floor is permissive because hover-background hex
// is highly intentional — when a probe captures hover state at all,
// the row's choice of CTA hex is almost certainly authoritative.
const CTA_SURFACE_MIN_TEXT_STYLE_ROWS = 3;
const CTA_SURFACE_MIN_BUTTON_HOVER_ROWS = 1;
const CTA_SURFACE_OVERRIDE_HINTS = ["brand-primary-accent", "button-primary-background"];

// Pre-emit deterministic colour seeds derived from the candidate
// rankers into `payload.brand.colors.*`. Mutates the payload in
// place. Safe to call with missing/empty buttonStyles /
// backgroundStyles / logoSvgFills — the rankers return [] in those
// cases and the pre-emit is a no-op.
//
// `backgroundStyles` and `logoSvgFills` feed three downstream filters
// inside `rankPrimaryButtonCandidates`:
//   - F1 (canvas-reject)  — discards buttons whose backgroundColor
//     matches a known canvas / chrome surface hex (body, html,
//     header/footer, `roleHint: "page"`, and an `isNeutralBackground`
//     row only when it does not reach 3:1 against the ranked canvas —
//     a neutral row that stands out is a filled CTA colour, not chrome).
//   - F2 (chrome demote)  — penalises and flags buckets whose visible
//     text reads like cookie-consent / locale chrome rather than a
//     real purchase CTA. Buckets where >=50% of rows look like chrome
//     come back with `chromeDominated: true`; this helper EXCLUDES
//     those from the pre-emit (confidence semantics: chrome-only
//     ranking = no real CTA evidence, so confidence collapses).
//   - F3 (logo-fill boost) — soft tie-breaker that lifts a bucket
//     whose backgroundColor hex exactly matches a non-trivial logo
//     SVG fill.
//
// BACKLOG item 30 — Cross-source CTA-surface override.
//   On sites where the per-card product-tile CTA hex dominates the
//   button-styles probe but does NOT match the brand's actual primary
//   CTA colour (surfaced only in background-styles as the top-of-page
//   catalog navbar), the button ranker alone produces the wrong
//   `brand_primary`. When a high-confidence top-of-page brand surface
//   exists AND that surface
//   hex appears elsewhere on the page as a minority but real signal
//   (>= 3 text-style rows OR >= 1 button-hover row), override the
//   button-derived pre-emit so the agent / downstream tokenizers see
//   the magenta surface as the brand-primary-accent. `textStyles` is
//   passed by the scaffolder for this confirmation check.
//
//   Override is conservative: it only fires when the top button
//   candidate's hex DIFFERS from the top CTA-surface candidate's hex.
//   On the typical fixture both pick the same hex, the override is a
//   no-op, and `topPrimary` falls through to the legacy emit path
//   unchanged.
export function preEmitBrandColours(payload, { buttonStyles, backgroundStyles, logoSvgFills, textStyles, productRows, diagnostics } = {}) {
  const colors = payload?.brand?.colors;
  if (!colors || typeof colors !== "object") return;

  ensureArray(colors, "accentColors");
  ensureArray(colors, "backgroundColors");
  ensureArray(colors, "textColors");

  // Top primary-button candidate → tag both the background and the
  // text colour. Confidence gate keeps thin evidence (a single sample
  // among many) from pre-emitting a guess. fontColor is optional on
  // the ranker output; when missing we skip the textColors emit but
  // still write the accent record so the agent has a brand-accent
  // seed.
  //
  // F2 confidence semantics: exclude chrome-dominated candidates from
  // the pre-emit entirely. A bucket whose visible text is cookie-
  // consent / locale chrome (CHROME_TEXT_PATTERNS / LOCALE_CODE /
  // COOKIE_PATTERN — see assemble-candidates.js) is not a real CTA
  // signal: emitting its background as `brand-primary-accent` /
  // `button-primary-background` would seed the agent (and downstream
  // logo-synth) with the consent banner's blue/black. When the top
  // ranked candidate is chromeDominated, drop down the candidate list
  // to the first non-chrome row; if none exists, emit nothing and let
  // logo-synth / agent author from non-chrome signals downstream.
  const primary = rankPrimaryButtonCandidates(buttonStyles || [], {
    backgroundStyles: backgroundStyles || [],
    logoSvgFills: logoSvgFills || [],
  });
  // F2-strict confidence semantics: recompute per the spec — chrome
  // rows are excluded from BOTH the numerator and the denominator.
  // `effectiveTotal` aggregates `nonChromeCount` across every bucket
  // the ranker observed; a bucket whose visible text is 100% chrome
  // contributes 0 to the total. On chrome-only sites (the only
  // candidates are consent / locale buttons) every bucket is
  // chrome-dominated, effectiveTotal collapses to 0, and pre-emit
  // emits nothing — downstream logo-synth or agent takes over.
  //
  // Denominator source: prefer the ranker's `totalNonChromeAllBuckets`
  // field which sums over ALL buckets (including those clipped by the
  // top-3 slice). Falls back to summing within the slice when that
  // field is missing — defensive against synthetic/legacy callers that
  // construct candidate arrays by hand.
  // The ratio itself lives in `assemble-candidates.js` now: the candidates
  // block asks the same question ("did the button lane reach the floor?") to
  // decide whether the card lane may speak, and two copies of it could give
  // two answers.
  const candidatesWithEffectiveConfidence = withEffectiveConfidence(primary);
  const topPrimary = candidatesWithEffectiveConfidence
    .find((candidate) => candidate && candidate.chromeDominated !== true);

  // BACKLOG item 30 — cross-source CTA-surface override. Evaluate
  // BEFORE the legacy button-primary emit: when a high-confidence
  // top-of-page brand surface exists AND its hex differs from
  // `topPrimary`'s AND it has a minority-but-real signal elsewhere on
  // the page (text-styles rows OR button-hover rows), use the surface
  // hex as the pre-emitted brand_primary / button_primary_background.
  //
  // Conservative posture: the override only fires when the button
  // ranker's pick and the surface ranker's pick DISAGREE on the
  // background hex. On the typical fixture they agree and the
  // override is a no-op.
  // Same canvas pick the button ranker gates its F1 reject set on, so
  // the surface ranker and the button ranker exclude exactly the same
  // set of chrome hexes.
  const canvasSurfaces = deriveCanvasSurfaceHexes(backgroundStyles || [], {
    canvasHex: deriveCanvasHex(backgroundStyles || []),
  });
  const ctaSurfaces = rankCtaSurfaceCandidates(backgroundStyles || [], canvasSurfaces);
  const topSurface = ctaSurfaces && ctaSurfaces[0];
  const surfaceHex = lowerHex(topSurface?.value);
  const buttonHex = lowerHex(topPrimary?.value?.backgroundColor);

  let overrideApplied = false;
  // Override fires when a CTA-surface candidate exists AND it does NOT
  // match the button-derived top primary. The "does not match" case
  // includes both "button hex differs" AND "no button hex at all"
  // (chrome-only ranking — when the button-styles probe captures only
  // per-card product-tile CTAs, the top-of-page brand surface is the
  // only real CTA signal on the page).
  if (surfaceHex && surfaceHex !== buttonHex) {
    // Minority-signal gate: confirm the surface hex shows up elsewhere
    // on the page. Either path is sufficient.
    const textStyleHits = countTextStyleColor(textStyles || [], surfaceHex);
    const hoverHits = countButtonHoverColor(buttonStyles || [], surfaceHex);
    const hasMinoritySignal = (textStyleHits >= CTA_SURFACE_MIN_TEXT_STYLE_ROWS)
      || (hoverHits >= CTA_SURFACE_MIN_BUTTON_HOVER_ROWS);
    if (hasMinoritySignal) {
      addIfAbsent(colors.accentColors, {
        value: surfaceHex,
        description: "Auto-tagged primary CTA background from top-of-page brand surface evidence (cross-source override of disagreeing button pick)",
        usageHints: [...CTA_SURFACE_OVERRIDE_HINTS],
      });
      // Mirror the existing brand.components.button hint-propagation
      // behaviour but for the surface hex. When a pre-existing button
      // row carries the same backgroundColor, tag it
      // `button-primary-background` so the brand.colors.* and
      // brand.components.button[] views stay consistent.
      const buttons = Array.isArray(payload?.brand?.components?.button)
        ? payload.brand.components.button
        : [];
      for (const button of buttons) {
        if (!button || typeof button !== "object") continue;
        const buttonBg = lowerHex(button.backgroundColor);
        if (buttonBg !== surfaceHex) continue;
        if (!Array.isArray(button.usageHints)) button.usageHints = [];
        if (!button.usageHints.includes("button-primary-background")) {
          button.usageHints.push("button-primary-background");
        }
      }
      overrideApplied = true;
    }
  }

  // CARD-CTA LANE. Consulted only when neither the cross-source override nor
  // a button bucket at or above the floor supplies `button-primary-background`
  // -- i.e. exactly when this function would otherwise seed nothing and leave
  // the consumer to default the email button to black. `rankCardCtaCandidates`
  // returns [] unless the page's product cards agree on one purchase colour
  // that a real button element also carries (see its four arms).
  const textLaneEmits = overrideApplied
    || Boolean(topPrimary && topPrimary.effectiveConfidence >= MINIMUM_PRE_EMIT_CONFIDENCE);
  const cardLane = textLaneEmits
    ? null
    : (rankCardCtaCandidates(productRows || [], {
      backgroundStyles: backgroundStyles || [],
      buttonStyles: buttonStyles || [],
    })[0] ?? null);

  // GG1: ALWAYS tag matching brand.components.button rows for the top
  // non-chrome primary candidate, regardless of confidence. The
  // `colors.accentColors` / `colors.textColors` emit stays gated at
  // MINIMUM_PRE_EMIT_CONFIDENCE because a low-confidence accent guess
  // could mislead the agent's curation. But the button-row tag is
  // strictly additive: it gives the strongest probe row a starting
  // hint so the downstream `dropEmptyUsageHintRows` strip doesn't
  // silently delete a roleless-but-real primary CTA row, forcing the
  // agent into an extra normalize round-trip. The agent can still
  // override or remove this hint.
  //
  // WHEN THE CARD LANE FIRES IT IS THE GG1 WINNER, and that is not cosmetic:
  // the consumer (`card_tokens.py`) rejects a non-reusable icon-only card CTA
  // wholesale and falls back to the FIRST `components.button[]` row hinted
  // `button-primary-background`, reading the semantic token only when no such
  // row exists. Leaving a sub-floor text-lane row tagged here would keep the
  // chat widget's #333377 winning in the email even after the accent row is
  // added. The rows this moves are precisely the ones the pre-emit never
  // published a seed for; when `cardLane` is null every line below is
  // byte-for-byte today's behaviour.
  //
  // `demoteIconOnlyFromButtonPrimary` (normalize) does not fight this: it
  // swaps button[0] only when a LATER non-icon row carries the hint, and after
  // the lane no such row exists. On every dir where that demotion fires today
  // the text lane pre-emits, so the lane is inert there.
  if (!overrideApplied && (cardLane || topPrimary)) {
    const bg = cardLane
      ? lowerHex(cardLane.value?.backgroundColor)
      : lowerHex(topPrimary.value?.backgroundColor);
    if (bg) {
      const buttons = Array.isArray(payload?.brand?.components?.button)
        ? payload.brand.components.button
        : [];
      for (const button of buttons) {
        if (!button || typeof button !== "object") continue;
        const buttonBg = lowerHex(button.backgroundColor);
        if (buttonBg !== bg) continue;
        if (!Array.isArray(button.usageHints)) button.usageHints = [];
        if (!button.usageHints.includes("button-primary-background")) {
          button.usageHints.push("button-primary-background");
        }
      }
    }
  }

  if (cardLane) {
    const bg = lowerHex(cardLane.value?.backgroundColor);
    if (bg) {
      addIfAbsent(colors.accentColors, {
        value: bg,
        description: "Auto-tagged primary CTA background from product-card CTA evidence (no button-styles bucket reached the pre-emit floor)",
        usageHints: [...PRIMARY_ACCENT_HINTS],
      });
    }
    const fg = lowerHex(cardLane.value?.fontColor);
    if (fg) {
      addIfAbsent(colors.textColors, {
        value: fg,
        description: "Auto-tagged primary CTA text from product-card CTA evidence",
        usageHints: [...PRIMARY_TEXT_HINTS],
      });
    }
    if (Array.isArray(diagnostics)) {
      diagnostics.push({
        severity: "info",
        path: "$.brand.colors.accentColors",
        action: "card-cta-lane",
        value: bg,
        rows: cardLane.count,
        of: cardLane.of,
        share: cardLane.confidence,
        corroboratingButtons: cardLane.corroboratingButtons,
      });
    }
  }

  if (!overrideApplied && topPrimary && topPrimary.effectiveConfidence >= MINIMUM_PRE_EMIT_CONFIDENCE) {
    const bg = lowerHex(topPrimary.value?.backgroundColor);
    if (bg) {
      addIfAbsent(colors.accentColors, {
        value: bg,
        description: "Auto-tagged primary CTA background from probe evidence",
        usageHints: [...PRIMARY_ACCENT_HINTS],
      });
    }
    const fg = lowerHex(topPrimary.value?.fontColor);
    if (fg) {
      addIfAbsent(colors.textColors, {
        value: fg,
        description: "Auto-tagged primary CTA text from probe evidence",
        usageHints: [...PRIMARY_TEXT_HINTS],
      });
    }
  }

  // Top canvas-background candidate. The ranker emits a flat hex
  // value (not an object) so the value lives directly on `value`.
  const canvas = rankCanvasBackgroundCandidates(backgroundStyles || []);
  const topCanvas = canvas && canvas[0];
  if (topCanvas && canvasClearsPreEmitGate(topCanvas)) {
    const value = lowerHex(topCanvas.value);
    if (value) {
      addIfAbsent(colors.backgroundColors, {
        value,
        description: "Auto-tagged canvas background from probe evidence",
        usageHints: [...CANVAS_BACKGROUND_HINTS],
      });
    }
  }
}

// Two-arm confidence gate for the `canvas-background` seed.
//
// Arm 1 (unchanged): confidence >= MINIMUM_PRE_EMIT_CONFIDENCE — an
// outright majority of ranker weight, no other evidence required.
//
// Arm 2 (additive): confidence >= CANVAS_PAGE_ANCHORED_MIN_CONFIDENCE
// AND the top bucket is page-anchored, i.e. some row that voted for it
// is `body` / `html` / the synthetic `(rendered-canvas-pixel)` sample,
// or carries `roleHint: "page"`. Arm 2 only ever ADDS a seed at a
// confidence where arm 1 emitted nothing; it can never change which
// value is emitted, because both arms read the same top bucket.
//
// The anchor flag is read from the ranker's structured `pageAnchored`
// field, never parsed out of the `evidence` string (which is truncated
// to three deduped selectors).
function canvasClearsPreEmitGate(topCanvas) {
  const confidence = topCanvas?.confidence;
  if (!Number.isFinite(confidence)) return false;
  if (confidence >= MINIMUM_PRE_EMIT_CONFIDENCE) return true;
  return topCanvas.pageAnchored === true && confidence >= CANVAS_PAGE_ANCHORED_MIN_CONFIDENCE;
}

// Push `record` into `list` only when no existing entry shares the
// same lowercase-hex value AND already covers every hint in the new
// record. The agent may later append additional hints to an existing
// record; we treat that as "already pre-emitted" so a re-run on the
// normalize side doesn't double-add.
function addIfAbsent(list, record) {
  if (!Array.isArray(list)) return;
  const value = lowerHex(record?.value);
  if (!value) return;
  const requiredHints = Array.isArray(record?.usageHints) ? record.usageHints : [];
  for (const existing of list) {
    if (!existing || typeof existing !== "object") continue;
    if (lowerHex(existing.value) !== value) continue;
    const existingHints = Array.isArray(existing.usageHints) ? existing.usageHints : [];
    if (requiredHints.every((hint) => existingHints.includes(hint))) {
      return; // hint set is fully covered — skip the pre-emit
    }
  }
  list.push({
    value: record.value,
    description: record.description,
    usageHints: [...requiredHints],
  });
}

function ensureArray(target, key) {
  if (!Array.isArray(target[key])) target[key] = [];
}

function lowerHex(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.toLowerCase();
}

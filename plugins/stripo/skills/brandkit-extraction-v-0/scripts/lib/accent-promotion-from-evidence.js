// Tier-H Fix 2 — promote brand-distinctive colours into accentColors[]
// from existing component evidence.
//
// Failure mode this closes: the codex agent authors
// `brand.components.button[].hoverBackgroundColor` and
// `brand.components.productCard[].cta.backgroundColor` with the brand's
// actual on-page colours (e.g. a strong magenta secondary CTA hex),
// but does NOT carry those colours into `brand.colors.accentColors[]`.
// The downstream customise stage reads `accentColors[]` for the
// `brand_primary_accent` / `brand_secondary_accent` semantic tokens —
// when the strong evidence colour is absent from accentColors, the
// email falls back to a generic neutral and the brand-distinctive
// colour never reaches the rendered output.
//
// Fix: walk button[] hoverBackgroundColor + productCard[].cta.backgroundColor,
// promote each non-neutral hex that is NOT already in accentColors and
// NOT a backgroundColor (canvas / content / header / footer) — those
// are deliberately not accents. Tag the first productCard[0]'s CTA bg
// with `brand-primary-accent` (the on-page primary CTA evidence);
// everything else gets `brand-secondary-accent`.
//
// Conservative posture:
//   - NEVER overwrite an existing accentColors row's hint set; only
//     append new rows for hexes the agent didn't already list.
//   - SKIP neutrals (white / black / off-white pairs) because those
//     are universally chrome, not brand evidence.
//   - SKIP hexes that already exist in backgroundColors — those have
//     been claimed by the canvas / content / header / footer channel
//     and should not be re-tagged as accents.
//   - DEDUPE within a single pass — a hex that appears on multiple
//     buttons / cards emits only one promoted row.
//   - GENERAL — no fixture-named code paths. The hex set is whatever
//     the components carry.

import { markScaffoldSynthesised } from "./provenance-marker.js";

const NEUTRAL_HEXES = new Set(["#ffffff", "#000000", "#fefefe", "#fafafa"]);

function lowerHex(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

export function applyAccentPromotionFromEvidence(payload, diagnostics = []) {
  const colors = payload?.brand?.colors;
  if (!colors || typeof colors !== "object") return;
  if (!Array.isArray(colors.accentColors)) colors.accentColors = [];

  const knownAccentHexes = new Set(
    colors.accentColors.map((r) => lowerHex(r?.value)).filter(Boolean)
  );
  const knownBgHexes = new Set(
    (Array.isArray(colors.backgroundColors) ? colors.backgroundColors : [])
      .map((r) => lowerHex(r?.value)).filter(Boolean)
  );
  // Track which usageHints are already claimed by some existing accent
  // row. If the brand already has a row tagged `brand-primary-accent`
  // (whatever its hex), the agent's curated brand-primary is canonical
  // and we should NOT promote a second row with the same hint — that
  // creates ambiguity for the customise stage and trips
  // colorRoleHintDuplication diagnostics. The hex-presence check above
  // catches the same-hex case; this catches the different-hex
  // same-hint case (e.g. probe captured one shade, logo carries
  // another — both end up as competing primary-accent rows).
  const claimedHints = new Set();
  for (const row of colors.accentColors) {
    const hints = Array.isArray(row?.usageHints) ? row.usageHints : [];
    for (const h of hints) if (typeof h === "string") claimedHints.add(h);
  }

  const buttons = Array.isArray(payload?.brand?.components?.button) ? payload.brand.components.button : [];
  const productCards = Array.isArray(payload?.brand?.components?.productCard) ? payload.brand.components.productCard : [];
  const promoted = [];

  for (const btn of buttons) {
    const hex = lowerHex(btn?.hoverBackgroundColor);
    if (!hex || NEUTRAL_HEXES.has(hex)) continue;
    if (knownAccentHexes.has(hex) || knownBgHexes.has(hex)) continue;
    promoted.push({ hex, source: "components.button[].hoverBackgroundColor" });
  }
  for (const [i, card] of productCards.entries()) {
    const hex = lowerHex(card?.cta?.backgroundColor);
    if (!hex || NEUTRAL_HEXES.has(hex)) continue;
    if (knownAccentHexes.has(hex) || knownBgHexes.has(hex)) continue;
    promoted.push({
      hex,
      source: `components.productCard[${i}].cta.backgroundColor`,
      primary: i === 0,
    });
  }

  const emitted = new Set();
  for (const { hex, source, primary } of promoted) {
    if (emitted.has(hex)) continue;
    const hint = primary ? "brand-primary-accent" : "brand-secondary-accent";
    // Hint-collision guard: if the same hint is already claimed by an
    // existing accent row, downgrade primary→secondary, or skip
    // entirely when secondary is also claimed. Prevents duplicate
    // brand-primary-accent rows in the probe-vs-logo split case (where
    // the same brand colour is independently sourced from CTA surface
    // evidence AND from logo SVG fills, each emitted as a primary).
    let finalHint = hint;
    if (claimedHints.has(finalHint)) {
      if (finalHint === "brand-primary-accent" && !claimedHints.has("brand-secondary-accent")) {
        finalHint = "brand-secondary-accent";
      } else {
        // Both primary and secondary claimed; skip — the brand already
        // has the accents it needs from agent curation.
        continue;
      }
    }
    emitted.add(hex);
    claimedHints.add(finalHint);
    colors.accentColors.push(markScaffoldSynthesised({
      value: hex,
      description: `Auto-promoted into accentColors from ${source} (Tier-H accent-promotion-from-evidence).`,
      usageHints: [finalHint],
    }));
    if (Array.isArray(diagnostics)) {
      diagnostics.push({
        severity: "info",
        path: "$.brand.colors.accentColors",
        message: `Promoted ${hex} into accentColors with hint "${finalHint}"; evidence: ${source}.`,
      });
    }
  }
}

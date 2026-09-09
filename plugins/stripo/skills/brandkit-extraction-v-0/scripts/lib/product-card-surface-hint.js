import { selectableProductRows } from "./product-row-filter.js";
// Synthesise the `product-card-surface-background` usageHint onto
// `brand.colors.backgroundColors[]` from `product-card-styles.json`
// probe rows. Companion to `synthesizeRegionBgHints` (header/footer)
// and `synthesizeContentBgHint` (content) — same deterministic-seed
// posture for the productCard-surface channel.
//
// Why this exists: the agent's pre-tagging contract (SKILL.md) covers
// canvas / header / footer / content backgrounds via dedicated
// helpers, but `product-card-surface-background` (the tile surface
// downstream renderers paint the product cards onto) was left for the
// agent to author. The hint regressed after fix19 in the same way the
// other region hints did — fix20+ scaffolders shipped without it and
// downstream customise lost the brand's tile colour.
//
// The probe rows in `product-card-styles.json` carry the evidence:
// each row exposes `card.backgroundColor` (the measured surface
// colour). Rows that pass `isLikelyProductCardRow` here are the ones
// whose `price.text` is non-empty — the deterministic signal that
// distinguishes a real product (price visible) from a promo banner
// (no price, just date range / call-to-action text). The probe
// emits `price.text` as a locale-formatted string; `price.value` is
// a downstream-extracted numeric and is not consistently populated.
// URL patterns vary too widely across ecommerce platforms to be a
// reliable secondary signal, so we lean on `price.text` alone.
//
// Confidence gates:
//   - need at least `MIN_CONTRIBUTORS` (3) product-like rows
//     contributing a non-empty hex
//   - winning hex must hold a strict majority (> 50%) of the
//     contributing rows
// Both gates skew toward NOT emitting when the signal is genuinely
// thin or split — same conservative posture as the header/footer
// helper's 0.05 coverage gate. We'd rather leave the hint off than
// emit on noisy evidence.
//
// Emit on `brand.colors.backgroundColors[]`:
//   - If an existing row's `value` matches the winning hex → append
//     the hint to its `usageHints` (idempotent).
//   - Else append a new row carrying just the hint.
//
// Idempotent and safe with missing / empty / non-array inputs.

import { markScaffoldSynthesised } from "./provenance-marker.js";

const PRODUCT_CARD_SURFACE_HINT = "product-card-surface-background";
const MIN_CONTRIBUTORS = 3;

function lowerHex(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

function isLikelyProductCardRow(row) {
  if (!row || typeof row !== "object") return false;
  // Deterministic product-vs-promo signal: real product rows always
  // carry a visible price string in the probe. Promotional banner
  // rows captured by the same selector (date ranges, hero text,
  // empty placeholders) do not.
  const price = row.price;
  if (!price || typeof price !== "object") return false;
  const text = typeof price.text === "string" ? price.text.trim() : "";
  if (text === "") return false;
  return true;
}

function ensureArray(target, key) {
  if (!Array.isArray(target[key])) target[key] = [];
}

function appendHintIfAbsent(row, hint) {
  if (!row || typeof row !== "object") return false;
  const hints = Array.isArray(row.usageHints) ? row.usageHints : [];
  if (hints.includes(hint)) return false;
  row.usageHints = [...hints, hint];
  return true;
}

function emitProductCardSurfaceBgHint(payload, hex, diagnostics) {
  const targetKey = lowerHex(hex);
  if (!targetKey) return;
  const colors = payload?.brand?.colors;
  if (!colors || typeof colors !== "object") return;
  ensureArray(colors, "backgroundColors");
  for (const [index, row] of colors.backgroundColors.entries()) {
    if (!row || typeof row !== "object") continue;
    if (lowerHex(row.value) !== targetKey) continue;
    const appended = appendHintIfAbsent(row, PRODUCT_CARD_SURFACE_HINT);
    if (appended && Array.isArray(diagnostics)) {
      diagnostics.push({
        severity: "info",
        path: `$.brand.colors.backgroundColors[${index}].usageHints`,
        action: "appended-hint",
        hint: PRODUCT_CARD_SURFACE_HINT,
        value: row.value,
      });
    }
    return;
  }
  const newRow = markScaffoldSynthesised({
    value: hex,
    description: "Auto-tagged product-card surface background from probe evidence.",
    usageHints: [PRODUCT_CARD_SURFACE_HINT],
  });
  const newIndex = colors.backgroundColors.length;
  colors.backgroundColors.push(newRow);
  if (Array.isArray(diagnostics)) {
    diagnostics.push({
      severity: "info",
      path: `$.brand.colors.backgroundColors[${newIndex}]`,
      action: "appended-row",
      hint: PRODUCT_CARD_SURFACE_HINT,
      value: hex,
    });
  }
}

// Mutates `payload.brand.colors.backgroundColors[]` in place. Idempotent.
// Safe with missing / empty / non-array inputs — no-ops without throwing.
export function synthesizeProductCardSurfaceBgHint(payload, productCardStyles, diagnostics = []) {
  productCardStyles = selectableProductRows(productCardStyles);
  if (!payload?.brand?.colors) return;
  if (!Array.isArray(productCardStyles)) return;

  const rows = productCardStyles.filter(isLikelyProductCardRow);
  if (rows.length < MIN_CONTRIBUTORS) return;

  // Count per-hex contributors AND null-bg rows separately. Many
  // ecommerce sites use transparent product-card surfaces that
  // inherit canvas bg (the probe captures `card.backgroundColor:
  // null` on every product row in that case). When the dominant
  // signal is "transparent cards render on canvas", fall through
  // to the canvas-bg row — same pattern as `region-bg-content-hint.js`.
  const byHex = new Map();
  let nullBgRows = 0;
  for (const row of rows) {
    const hex = lowerHex(row?.card?.backgroundColor);
    if (!hex) {
      nullBgRows += 1;
      continue;
    }
    byHex.set(hex, (byHex.get(hex) || 0) + 1);
  }

  // Fall-through path: when >= MIN_CONTRIBUTORS rows had transparent
  // cards AND no other hex achieves a strict majority, tag the
  // existing canvas-background row.
  if (byHex.size === 0 && nullBgRows >= MIN_CONTRIBUTORS) {
    const colors = payload?.brand?.colors;
    const bgList = colors?.backgroundColors;
    if (Array.isArray(bgList)) {
      const canvas = bgList.find((r) => Array.isArray(r?.usageHints) && r.usageHints.includes("canvas-background"));
      if (canvas) {
        emitProductCardSurfaceBgHint(payload, canvas.value, diagnostics);
        return;
      }
    }
  }
  if (byHex.size === 0) return;

  // Pick majority hex.
  let winningHex = null;
  let winningCount = 0;
  for (const [hex, count] of byHex) {
    if (count > winningCount) {
      winningHex = hex;
      winningCount = count;
    }
  }

  // Strict-majority gate: winner must own > 50% of contributing
  // rows (those that actually emitted a non-empty hex).
  let totalContrib = 0;
  for (const count of byHex.values()) totalContrib += count;
  if (winningCount * 2 <= totalContrib) return;

  // Second guard: at least MIN_CONTRIBUTORS rows must have
  // contributed a hex. Cheaper than recounting via byHex sum, but
  // identical semantics.
  if (totalContrib < MIN_CONTRIBUTORS) return;

  emitProductCardSurfaceBgHint(payload, winningHex, diagnostics);
}

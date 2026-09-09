import { selectableProductRows } from "./product-row-filter.js";
// Propagates old-price evidence from probe rows onto `productCard[0]` when
// the agent collapses a multi-row draft and accidentally drops the discount
// signal on the canonical entry.
//
// Why: ecommerce homepages with discount badges produce many probe rows
// that share a consistent oldPrice signature (e.g. 12 of 33 rows with
// `oldPrice.color = #808080`, `Rubik, 400, 12px`, `text-decoration:
// line-through`). The scaffolder maps each to a productCard entry with the
// oldPrice fields populated. The agent then dedupes/collapses those entries
// down to a single canonical productCard[0]. When the entry it picks happens
// to be a non-discount row (price-only, no oldPrice), oldPriceColor and
// oldPriceTypography are missing on the assembled brandkit even though the
// site clearly has discounts. The downstream customise step then renders the
// email with no struck-through old price.
//
// Reproducing case:
//   draft.productCard had 12 entries with oldPriceColor: "#808080"
//   plus 21 entries with oldPriceColor: null. After agent's collapse,
//   productCard[0].oldPriceColor was null — but the probe rows still hold
//   the discount evidence.
//
// This safety net runs at normalize time, after dedup. It walks the raw
// product-card-styles.json rows (passed through to normalizeExtraction
// alongside the assembled payload), finds rows with consistent oldPrice
// evidence, and copies the evidence onto productCard[0] when it is missing.
//
// Conservative gates protect against false positives:
//   1) productCard[0] must exist AND have empty/null oldPriceColor.
//      Any existing oldPriceColor means the agent already preserved the
//      evidence — leave it alone.
//   2) At least MIN_CONSISTENT_ROWS probe rows must agree on the
//      (color, family, weight, sizePx) signature. Three rows is below
//      what any real ecommerce homepage produces (the reproducing case
//      had 12) but above the noise floor where one stray row carries a
//      stale color.
//   3) Only the dominant signature wins; if no signature has
//      MIN_CONSISTENT_ROWS observations, no propagation.
//
// False negatives (missing the propagation) are far better than false
// positives (writing wrong colors onto productCard[0]). When the gates
// fail, the helper no-ops and the existing behavior — empty oldPrice on
// the assembled brandkit — is preserved.

const MIN_CONSISTENT_ROWS = 3;

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function lowerHex(value) {
  return String(value || "").trim().toLowerCase();
}

function normalizeFamily(value) {
  return String(value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function asFiniteNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function hasMeaningfulOldPriceColor(card) {
  if (!isPlainObject(card)) return false;
  const color = lowerHex(card.oldPriceColor);
  return color.length > 0;
}

// Build a normalized signature for an oldPrice probe row. Returns null when
// the row lacks the minimum evidence (color is required; family / weight /
// sizePx are best-effort and treated as part of the signature when present).
function oldPriceSignature(oldPrice) {
  if (!isPlainObject(oldPrice)) return null;
  const color = lowerHex(oldPrice.color);
  if (!color) return null;
  const family = normalizeFamily(oldPrice.fontFamily);
  const weight = asFiniteNumber(oldPrice.fontWeight);
  const sizePx = asFiniteNumber(oldPrice.fontSizePx);
  return {
    key: `${color}|${family}|${weight ?? ""}|${sizePx ?? ""}`,
    color,
    family: family || null,
    weight,
    sizePx,
    lineHeightPx: asFiniteNumber(oldPrice.lineHeightPx),
    letterSpacingPx: asFiniteNumber(oldPrice.letterSpacingPx),
    fontStyle: String(oldPrice.fontStyle || "").trim() || null,
    textTransform: String(oldPrice.textTransform || "").trim() || null,
  };
}

// Pick the dominant signature from the probe rows. Returns the signature
// object plus its observation count, or null when no signature has at least
// MIN_CONSISTENT_ROWS observations.
export function pickDominantOldPriceSignature(productRows) {
  productRows = selectableProductRows(productRows);
  if (!Array.isArray(productRows) || productRows.length === 0) return null;
  const counts = new Map();
  for (const row of productRows) {
    const sig = oldPriceSignature(row?.oldPrice);
    if (!sig) continue;
    const existing = counts.get(sig.key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(sig.key, { signature: sig, count: 1 });
    }
  }
  let best = null;
  for (const entry of counts.values()) {
    if (entry.count < MIN_CONSISTENT_ROWS) continue;
    if (!best || entry.count > best.count) best = entry;
  }
  return best;
}

// Mutates productCard[0] in place when the gates pass. Records a single
// diagnostic entry on the provided diagnostics array.
//
// No-op cases:
//   - missing / non-array / empty productCard
//   - productCard[0] already has a non-empty oldPriceColor
//   - productRows is empty / not an array
//   - no signature meets MIN_CONSISTENT_ROWS observations
export function propagateOldPriceFromProbeRows(payload, productRows, diagnostics = []) {
  const cards = payload?.brand?.components?.productCard;
  if (!Array.isArray(cards) || cards.length === 0) return;
  const card = cards[0];
  if (!isPlainObject(card)) return;
  if (hasMeaningfulOldPriceColor(card)) return;

  const dominant = pickDominantOldPriceSignature(productRows);
  if (!dominant) return;

  const { signature, count } = dominant;
  card.oldPriceColor = signature.color;

  // Only overwrite oldPriceTypography when the existing value is empty/null.
  // The agent may have correctly kept the typography from a different probe
  // row even when stripping color — preserve any existing populated fields.
  const existing = isPlainObject(card.oldPriceTypography) ? card.oldPriceTypography : null;
  const propagated = {
    family: existing?.family || signature.family,
    weight: existing?.weight ?? signature.weight,
    sizePx: existing?.sizePx ?? signature.sizePx,
    lineHeightPx: existing?.lineHeightPx ?? signature.lineHeightPx,
    fontStyle: existing?.fontStyle || signature.fontStyle,
    letterSpacingPx: existing?.letterSpacingPx ?? signature.letterSpacingPx,
    textTransform: existing?.textTransform || signature.textTransform,
  };
  card.oldPriceTypography = propagated;

  if (Array.isArray(diagnostics)) {
    diagnostics.push({
      path: "$.brand.components.productCard[0]",
      kind: "old-price-propagated-from-probe",
      message:
        `Propagated oldPriceColor=${signature.color} (family=${signature.family || "null"}, ` +
        `weight=${signature.weight ?? "null"}, sizePx=${signature.sizePx ?? "null"}) from ${count} ` +
        `probe rows with consistent old-price evidence; productCard[0].oldPriceColor was empty.`,
    });
  }
}

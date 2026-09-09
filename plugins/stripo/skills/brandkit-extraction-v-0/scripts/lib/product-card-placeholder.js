// Normalizes the "single empty placeholder" pattern in
// `brand.components.productCard` to the canonical empty-array shape.
//
// SKILL.md ([line 277](skills/brandkit-extraction-v-0/SKILL.md#non-ecommerce-shape))
// says non-ecommerce homepages should emit `productCard: []` rather than
// `productCard: [{evidenceQuality: "none"}]`. The scaffolder produces `[]`
// correctly when no purchase signals exist; the agent's normalize pass
// occasionally drifts and emits a single placeholder object with
// `evidenceQuality: "none"` and `confidence: 0` (a non-ecommerce
// marketing site reproduced this consistently across multiple batches).
//
// This safety net runs after dedup. When the productCard array has exactly
// one entry, that entry has `evidenceQuality: "none"`, `confidence: 0`, and
// no real evidence (no priceColor, no surface bg, no CTA bg), we replace
// the array with `[]`. Any signal of real evidence (prices, surface bg,
// CTA bg, isIconLike resolution, anything) keeps the entry — partial
// evidence isn't a placeholder.
//
// The resulting canonical empty array is what downstream consumers
// (customise step, validators, role-mirror steps) expect for non-ecommerce
// homepages — no special-casing of the placeholder shape is needed
// elsewhere.

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function looksLikePurePlaceholder(card) {
  if (!isPlainObject(card)) return false;
  const evidenceQuality = String(card.evidenceQuality || "").toLowerCase();
  if (evidenceQuality !== "none") return false;
  // confidence must be falsy / zero. Any non-zero confidence implies the
  // agent had at least some signal worth recording.
  const confidence = Number(card.confidence);
  if (Number.isFinite(confidence) && confidence > 0) return false;
  // Real evidence on any of: prices, card surface, CTA bg → not a placeholder.
  if (card.priceColor) return false;
  if (card.oldPriceColor) return false;
  if (isPlainObject(card.surface) && card.surface.backgroundColor) return false;
  if (isPlainObject(card.cta) && card.cta.backgroundColor) return false;
  // Real CTA layout signal → not a placeholder.
  if (
    isPlainObject(card.cta) &&
    (card.cta.layoutIntent === "icon-only" ||
      card.cta.isIconLike === true ||
      typeof card.cta.text === "string" && card.cta.text.trim().length > 0)
  ) {
    return false;
  }
  return true;
}

export function normalizeProductCardPlaceholderToCanonical(payload, diagnostics = []) {
  const cards = payload?.brand?.components?.productCard;
  if (!Array.isArray(cards)) return;
  if (cards.length !== 1) return;
  if (!looksLikePurePlaceholder(cards[0])) return;
  payload.brand.components.productCard = [];
  if (Array.isArray(diagnostics)) {
    diagnostics.push({
      path: "$.brand.components.productCard",
      kind: "placeholder-collapsed",
      message:
        "Collapsed single-entry productCard with evidenceQuality:none and no real evidence to canonical empty array.",
    });
  }
}

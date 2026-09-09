// Drops `brand.components.productCard[]` entries that lack any purchase
// signal — neither a current price color nor a recognizable short CTA
// label nor a confidence-above-threshold agent endorsement. Used to keep
// `productCard` empty on marketing / non-ecom homepages even when the
// agent has mis-classified feature cards or testimonials as product
// entries.
//
// Why: SKILL.md ([line 277](skills/brandkit-extraction-v-0/SKILL.md#non-ecommerce-shape))
// says non-ecommerce homepages should emit `productCard: []`. The agent
// sometimes invents productCard entries from non-purchase content —
// feature cards, testimonials, app benefit tiles — when no real product
// cards exist on the page. The pre-existing `product-card-placeholder.js`
// only collapses the strict `[{evidenceQuality:"none", confidence:0,
// priceColor:null, ...}]` shape. Marketing-site mis-classifications are
// richer: they have surface colors, descriptions, and a prose-length
// `cta.text` (sentence describing the feature, not a purchase label).
//
// Reproducing case:
//   productCard had 2 entries — a "workout-feature card" and a
//   "community testimonial card" — both with priceColor: null,
//   oldPriceColor: null, confidence ≈ 0.7, and cta.text being a
//   74-character sentence describing the feature. The customise step
//   then renders these as fake product blocks in marketing emails.
//
// Conservative gates — ALL must hold to drop an entry:
//   1) priceColor is null/empty/missing.
//   2) oldPriceColor is null/empty/missing.
//   3) priceTypography is null/empty AND oldPriceTypography is null/empty.
//      A populated typography object (even partial, e.g. `{family: "..."}`)
//      is the agent's signal that price evidence existed for this card —
//      keep it, the typography-mirror diagnostic will surface the weakness.
//   4) cta is missing, OR cta.text is missing/empty, OR cta.text length
//      exceeds LONG_CTA_TEXT_THRESHOLD characters (real purchase CTAs are
//      short imperatives in any language — "Buy", "Add to cart",
//      "В кошик", "Купити", "Order now"; prose runs 40+ chars).
//   5) confidence is missing OR below HIGH_CONFIDENCE_THRESHOLD —
//      preserve cards the agent strongly endorsed (≥0.85) even when
//      visual evidence is thin, since the agent may have surface-level
//      reasoning we lack.
//
// False negatives (keeping a non-ecom card) are far better than false
// positives (dropping a legitimate product card). The gate is intentionally
// strict — when in doubt, keep the entry.

const LONG_CTA_TEXT_THRESHOLD = 40;
const HIGH_CONFIDENCE_THRESHOLD = 0.85;

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function hasMeaningfulColor(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function asFiniteNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

// Returns true when the typography object carries any non-null evidence.
// A `{family: "..."}` shape (even without sizePx) counts — the agent
// recorded that prices were rendered with this font. An object that
// exists but has every value null/empty does NOT count.
function hasMeaningfulTypography(typography) {
  if (!isPlainObject(typography)) return false;
  for (const value of Object.values(typography)) {
    if (value === null || value === undefined) continue;
    if (typeof value === "string" && value.trim().length === 0) continue;
    return true;
  }
  return false;
}

// Returns true when the card's CTA has a short purchase-like label.
// Returns false for missing cta, missing text, empty text, or prose-length
// text. The length check is the discriminator — every real product CTA in
// the languages this codebase targets fits comfortably under
// LONG_CTA_TEXT_THRESHOLD characters.
function hasShortCtaLabel(card) {
  const cta = card?.cta;
  if (!isPlainObject(cta)) return false;
  const text = cta.text;
  if (typeof text !== "string") return false;
  const trimmed = text.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.length > LONG_CTA_TEXT_THRESHOLD) return false;
  return true;
}

// Decision: drop or keep. Returns a reason string when the card should be
// dropped, or null when it should be kept.
export function nonEcomDropReason(card) {
  if (!isPlainObject(card)) return null;
  if (hasMeaningfulColor(card.priceColor)) return null;
  if (hasMeaningfulColor(card.oldPriceColor)) return null;
  if (hasMeaningfulTypography(card.priceTypography)) return null;
  if (hasMeaningfulTypography(card.oldPriceTypography)) return null;
  if (hasShortCtaLabel(card)) return null;
  const confidence = asFiniteNumber(card.confidence);
  if (confidence !== null && confidence >= HIGH_CONFIDENCE_THRESHOLD) return null;

  const ctaText = card?.cta?.text;
  const ctaSummary = typeof ctaText === "string" && ctaText.trim().length > 0
    ? `cta.text "${ctaText.trim().slice(0, 40)}${ctaText.trim().length > 40 ? "…" : ""}"`
    : "cta missing or empty";
  return (
    `no price evidence (priceColor=${card.priceColor ?? "null"}, ` +
    `oldPriceColor=${card.oldPriceColor ?? "null"}), ${ctaSummary}, ` +
    `confidence=${confidence ?? "null"} below ${HIGH_CONFIDENCE_THRESHOLD}`
  );
}

// Mutates payload.brand.components.productCard in place. Drops entries
// that match the conservative non-ecom criteria above. Records a single
// diagnostic when at least one entry is dropped, listing how many were
// removed and a summary of the first dropped reason.
//
// No-op cases:
//   - missing / non-array / empty productCard
//   - no entry matches the drop criteria
export function dropNonEcomProductCards(payload, diagnostics = []) {
  const cards = payload?.brand?.components?.productCard;
  if (!Array.isArray(cards) || cards.length === 0) return;

  const survivors = [];
  const droppedReasons = [];
  for (const card of cards) {
    const reason = nonEcomDropReason(card);
    if (reason) {
      droppedReasons.push(reason);
    } else {
      survivors.push(card);
    }
  }

  if (droppedReasons.length === 0) return;
  payload.brand.components.productCard = survivors;

  if (Array.isArray(diagnostics)) {
    diagnostics.push({
      path: "$.brand.components.productCard",
      kind: "non-ecom-product-cards-dropped",
      message:
        `Dropped ${droppedReasons.length} of ${cards.length} productCard ` +
        `entries lacking purchase signal (likely non-ecom mis-classification). ` +
        `First dropped: ${droppedReasons[0]}. ${survivors.length} survivor(s).`,
    });
  }
}

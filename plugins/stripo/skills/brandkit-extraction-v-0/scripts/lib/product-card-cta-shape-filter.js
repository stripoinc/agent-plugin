// Drops `brand.components.productCard[]` entries whose `cta.text` does not
// match a short purchase-verb allowlist. Used to remove cards where the agent
// captured a non-purchase label (a swatch / chip / product-name / category
// link) into `cta.text` instead of the real action button.
//
// Why: see D4 (fix21 productCard normalize-time CTA shape filter). On
// the high-swatch-density product-grid case, the agent emitted 8
// productCard entries — only the first carries a real purchase-verb
// action button, while indexes 1..6 carry colour-swatch labels and
// index 7 carries a product-name string. These are not purchase CTAs
// and bleed through into the customise step as fake buttons. The
// pre-existing `product-card-non-ecom-filter.js` only drops cards
// lacking ANY purchase signal (no price + long CTA + low confidence);
// cards with prose-length but valid surface evidence slip through.
// This helper closes that gap by inspecting `cta.text` directly.
//
// Gates / decisions per card:
//   1) `cta.hasUsableVisibleText !== true` → BYPASS (icon-only CTAs are
//      handled by other helpers; we have no text to gate on).
//   2) `cta.text` trimmed + lowercased matches any PURCHASE_VERB_ALLOWLIST
//      entry on a Unicode word boundary → KEEP. (Word-boundary match
//      prevents single-token verbs like "add"/"shop"/"order" from matching
//      unrelated labels like "Address"/"Workshop"/"Order tracking".)
//   3) A whole-label discount/sale badge → REJECT before technical or strong
//      endorsement. Purchase-verb labels that include a discount are exempt.
//   4) A filtered technical row with the same scaffolded CTA signature has
//      `selectionSignals.ctaLooksPurchaseLike === true` → KEEP (probe-derived
//      endorsement, even when the literal text isn't on our allowlist — e.g.
//      brand-specific wording). Conflicting rows with the same signature fail
//      closed. This avoids both cross-card text collisions and exposing the
//      private `selectionSignals` object in schema-validated public JSON.
//   5) `card.evidenceQuality` lowercased === "strong" → KEEP + emit a
//      `non-purchase-cta-kept-strong-evidence` info diagnostic (the
//      strong endorsement carves an exception, but we log it so we can
//      audit the allowlist later).
//   6) Otherwise → DROP, emit `dropped-non-purchase-cta` info diagnostic.
//
// Card at index 0 is ALWAYS preserved (single-card preservation rule —
// downstream consumers rely on having at least one productCard skeleton
// even when the page has weak evidence). When it fails gate 5, only its
// untrusted CTA is removed and a canonical missingEvidence note is appended.
// Cards at index >= 1 still fail gate 5 by being dropped as before.
//
// Anti-goals: do not mutate visual or structural card fields; only remove a
// rejected card[0] CTA and append the evidence-gap note to surviving
// nonreusable cards. Do not enable in scaffold mode, introduce config flags,
// or log to stdout/stderr.

import { productCardCtaIsReusable } from "./product-card-cta-evidence.js";
import { isDiscountOnlyCtaLabel } from "./product-card-cta-label.js";
import { filterScaffoldProductRows } from "./product-row-filter.js";
import { productCardCtaFromRow } from "../assemble-product-card-cta.js";

export const PURCHASE_VERB_ALLOWLIST = [
  // English
  "buy", "add to cart", "add to bag", "add", "cart", "order",
  "shop", "shop now", "checkout", "purchase", "get",
  // Ukrainian. Use specific inflected forms ("замовити", "замовляти") instead
  // of the bare stem "замов" — the stem matches "замов дзвінок" (call
  // request), which is not a purchase intent.
  "купити", "купуй", "у кошик", "в кошик", "до кошика",
  "замовити", "замовляти", "замовлення",
  // Russian
  "купить", "в корзину", "заказать", "оплатить", "оформить",
  "приобрести", "положить",
];

export const PRODUCT_CARD_CTA_MISSING_EVIDENCE =
  "no reusable visible-text product-card CTA observed; use primary button fallback for text CTA styling";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function lowerString(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

// Escape regex meta-characters in allowlist entries. None of the current
// entries contain meta-chars, but this guards against future additions.
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Compile the allowlist into a single Unicode word-boundary regex ONCE at
// module load. `\p{L}` and `\p{N}` cover Latin AND Cyrillic letters/digits
// so we treat anything else (spaces, punctuation, string start/end) as a
// word boundary. The `iu` flags enable case-insensitivity + Unicode mode.
//
// Word-boundary matching prevents false-keeps where a single-token verb
// like "add"/"shop"/"order" appears inside an unrelated label:
//   - "Address" (contains "add")        → no match
//   - "Get coupon" (contains "get")     → "get" matches (still a purchase
//     keyword on a boundary — see test "Add to wishlist" for the same
//     trade-off; the keyword carries the intent signal).
//   - "Workshop" (contains "shop")      → no match
//   - "Order tracking" (contains "order") → "order" matches (boundary hit)
//
// Multi-word entries like "add to cart" still match as a phrase because
// the literal pattern includes the spaces and the regex boundary applies
// to the entire phrase, not each token inside it.
const PURCHASE_VERB_REGEX = new RegExp(
  `(?:^|[^\\p{L}\\p{N}])(?:${PURCHASE_VERB_ALLOWLIST.map(escapeRegex).join("|")})(?:[^\\p{L}\\p{N}]|$)`,
  "iu",
);

// Returns true when any allowlist verb appears as a word in the
// (already-lowercased, already-trimmed) text. Word-boundary matching keeps
// "Add to cart now" matching "add to cart" / "add", "Купити зараз" matching
// "купити", and "Order now" matching "order", while rejecting substring
// false-positives like "Address" / "Workshop" / "Замов дзвінок".
function matchesPurchaseAllowlist(loweredText) {
  if (!loweredText) return false;
  return PURCHASE_VERB_REGEX.test(loweredText);
}

const CTA_EVIDENCE_SIGNATURE_FIELDS = [
  "text",
  "textSource",
  "hasUsableVisibleText",
  "isCompact",
  "isIconLike",
  "hasInlineIcon",
  "backgroundColor",
  "fontColor",
  "borderColor",
  "borderWidth",
  "borderRadius",
  "padding",
  "hoverBackgroundColor",
  "hoverFontColor",
  "hoverBorderColor",
  "layoutIntent",
];

function signatureText(value) {
  return typeof value === "string" ? value.trim().toLowerCase().replace(/\s+/g, " ") : value ?? null;
}

function signatureLayoutIntent(value) {
  const text = signatureText(value);
  const intent = typeof text === "string" ? text.replace(/_/g, "-") : text;
  if (intent === "content-width" || intent === "inline") return "content-sized";
  return intent;
}

function signaturePadding(value) {
  if (!isPlainObject(value)) return null;
  return ["top", "right", "bottom", "left"].map((side) => value[side] ?? null);
}

function ctaEvidenceSignature(cta) {
  if (!isPlainObject(cta)) return "";
  const signature = {};
  for (const field of CTA_EVIDENCE_SIGNATURE_FIELDS) {
    const value = cta[field];
    if (field === "text" || field === "textSource") signature[field] = signatureText(value);
    else if (field === "layoutIntent") signature[field] = signatureLayoutIntent(value);
    else if (field === "padding") signature[field] = signaturePadding(value);
    else signature[field] = value ?? null;
  }
  return JSON.stringify(signature);
}

function probePurchaseEndorsements(productRows) {
  const byCtaSignature = new Map();
  for (const row of filterScaffoldProductRows(productRows)) {
    const signature = ctaEvidenceSignature(productCardCtaFromRow(row));
    if (!signature) continue;
    const endorsed = row?.selectionSignals?.ctaLooksPurchaseLike === true;
    if (!byCtaSignature.has(signature)) {
      byCtaSignature.set(signature, endorsed);
    } else if (byCtaSignature.get(signature) !== endorsed) {
      // Repeated product cards commonly share one CTA signature, so unanimous
      // duplicates are safe. Conflicting rows are ambiguous (often stale probe
      // evidence) and deliberately fail closed rather than letting one row
      // license another. Agent edits to any scaffolded CTA signature field also
      // stop matching; normalize never relies on card/row array positions.
      byCtaSignature.set(signature, null);
    }
  }
  return byCtaSignature;
}

function purchaseGateDecision(card, probeEndorsements) {
  const cta = isPlainObject(card) ? card.cta : null;
  // Icon-only / missing-CTA bypass — we have no text to gate on.
  if (!isPlainObject(cta) || cta.hasUsableVisibleText !== true) {
    return { decision: "bypass", cta, trimmedText: "" };
  }

  const trimmedText = typeof cta.text === "string" ? cta.text.trim() : "";
  const allowlistHit = matchesPurchaseAllowlist(trimmedText.toLowerCase());
  // This hard negative precedes technical endorsement and strong-evidence
  // carve-outs. A whole-label discount is not a reusable action even when a
  // compact price-context probe inferred purchase intent. Purchase-verb labels
  // (for example "Buy now -20%") are exempted by the helper and allowlist.
  if (!allowlistHit && isDiscountOnlyCtaLabel(trimmedText)) {
    return { decision: "reject", cta, trimmedText, discountOnly: true };
  }
  const probeHit = probeEndorsements.get(ctaEvidenceSignature(cta)) === true;
  const strongEvidence = lowerString(card?.evidenceQuality) === "strong";
  if (allowlistHit || probeHit) return { decision: "keep", cta, trimmedText };
  if (strongEvidence) return { decision: "strong", cta, trimmedText };
  return { decision: "reject", cta, trimmedText };
}

function appendMissingEvidence(card, message) {
  if (!isPlainObject(card)) return;
  const missing = Array.isArray(card.missingEvidence) ? card.missingEvidence : [];
  if (!missing.includes(message)) missing.push(message);
  card.missingEvidence = missing;
}

function rejectionReason(result) {
  return result?.discountOnly
    ? "cta.text is a discount/percent-only label without a purchase verb"
    : "cta.text does not match PURCHASE_VERB_ALLOWLIST and no verified technical endorsement exists";
}

// Mutates payload.brand.components.productCard in place. Sanitizes card[0]
// and drops entries at index ≥ 1 when their CTA fails the purchase gate.
// Emits one per-drop/sanitization diagnostic, one per-strong-evidence
// carve-out diagnostic, and a single summary diagnostic when ≥1 later entry
// was dropped.
//
// No-op cases:
//   - missing / non-array productCard
//   - empty productCard array
//   - every card passes its gate (allowlist / probe / strong / icon-only)
export function dropNonPurchaseProductCards(
  payload,
  diagnostics,
  productRows = null,
  { technicalRowEndorsementVerified = false } = {},
) {
  const cards = payload?.brand?.components?.productCard;
  if (!Array.isArray(cards) || cards.length === 0) return;

  const diag = Array.isArray(diagnostics) ? diagnostics : null;
  const probeEndorsements = technicalRowEndorsementVerified
    ? probePurchaseEndorsements(productRows)
    : new Map();
  const first = purchaseGateDecision(cards[0], probeEndorsements);
  if (first.decision === "strong" && diag) {
    diag.push({
      path: "$.brand.components.productCard[0]",
      kind: "non-purchase-cta-kept-strong-evidence",
      ctaText: first.trimmedText,
      evidenceQuality: "strong",
      reason: "strong evidenceQuality overrides non-purchase CTA text",
    });
  } else if (first.decision === "reject") {
    delete cards[0].cta;
    appendMissingEvidence(cards[0], PRODUCT_CARD_CTA_MISSING_EVIDENCE);
    if (diag) {
      diag.push({
        path: "$.brand.components.productCard[0].cta",
        kind: "non-purchase-cta-sanitized",
        action: "removed-non-purchase-cta",
        ctaText: first.trimmedText,
        ctaBackgroundColor: first.cta.backgroundColor || null,
        evidenceQuality: cards[0].evidenceQuality || null,
        reason: rejectionReason(first),
      });
    }
  }

  const survivors = [cards[0]];
  const dropped = [];

  for (let i = 1; i < cards.length; i += 1) {
    const card = cards[i];
    const result = purchaseGateDecision(card, probeEndorsements);
    if (result.decision === "bypass" || result.decision === "keep") {
      survivors.push(card);
      continue;
    }

    if (result.decision === "strong") {
      survivors.push(card);
      if (diag) {
        diag.push({
          path: `$.brand.components.productCard[${i}]`,
          kind: "non-purchase-cta-kept-strong-evidence",
          ctaText: result.trimmedText,
          evidenceQuality: "strong",
          reason: "strong evidenceQuality overrides non-purchase CTA text",
        });
      }
      continue;
    }

    dropped.push({
      index: i,
      trimmedText: result.trimmedText,
      cta: result.cta,
      card,
      discountOnly: result.discountOnly,
    });
  }

  // Purchase-shape acceptance and reusable-token trust are different gates.
  // A weak/icon-only/missing/non-visible CTA may remain useful public card
  // evidence while still requiring downstream primary-button fallback.
  for (const card of survivors) {
    if (!productCardCtaIsReusable(card)) {
      appendMissingEvidence(card, PRODUCT_CARD_CTA_MISSING_EVIDENCE);
    }
  }

  if (dropped.length === 0) return;

  payload.brand.components.productCard = survivors;

  if (diag) {
    for (const entry of dropped) {
      diag.push({
        path: `$.brand.components.productCard[${entry.index}]`,
        kind: "non-purchase-cta-dropped",
        action: "dropped-non-purchase-cta",
        ctaText: entry.trimmedText,
        ctaBackgroundColor: entry.cta.backgroundColor || null,
        evidenceQuality: entry.card.evidenceQuality || null,
        reason: rejectionReason(entry),
      });
    }

    const sample = dropped[0].trimmedText;
    diag.push({
      path: "$.brand.components.productCard",
      kind: "non-purchase-product-cards-dropped",
      message:
        `Dropped ${dropped.length} of ${cards.length} productCard entries whose cta.text did not match ` +
        `PURCHASE_VERB_ALLOWLIST. First dropped cta.text: "${sample}". ${survivors.length} survivor(s).`,
    });
  }
}

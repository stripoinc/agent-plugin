// Canonical reusable product-card CTA evidence predicate.
//
// Keep this deliberately small: normalization's purchase-intent gate decides
// whether a captured label is plausibly an action. The anchored discount-only
// hard negative is repeated here so a mapper cannot consume an unsanitized
// medium/strong legacy card. This predicate otherwise decides whether
// downstream reusable CTA tokens may be derived from the assembled card at
// all. The Python twin lives in
// src/reteno_agent/product_card_cta_evidence.py.

import { isDiscountOnlyCtaLabel } from "./product-card-cta-label.js";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

export function productCardCtaIsReusable(card) {
  if (!isPlainObject(card)) return false;
  if (typeof card.evidenceQuality !== "string") return false;
  const quality = card.evidenceQuality.trim().toLowerCase();
  if (quality !== "medium" && quality !== "strong") return false;
  const cta = card.cta;
  if (!isPlainObject(cta)) return false;
  if (isDiscountOnlyCtaLabel(cta.text)) return false;
  return (
    typeof cta.text === "string" &&
    cta.text.trim() !== "" &&
    cta.textSource === "visible-text" &&
    cta.hasUsableVisibleText === true &&
    cta.isIconLike !== true
  );
}

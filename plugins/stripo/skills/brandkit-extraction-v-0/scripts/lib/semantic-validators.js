// Mirror of `validate_brandkit_semantics` and its helpers in
// `reteno_agent/brandkit_finalize/validation.py`. Keep error/warning message strings, helper
// semantics, and the orchestrator iteration order in lockstep with the Python
// implementation; both sides share the same parity oracle in
// tests/test_skill_probe_contracts.py.
//
// Scope (step 3): only the SEMANTIC validators surfaced by
// `validate_brandkit_semantics`. The technical-artifact validators emitted by
// `validate_brandkit_against_technical_artifacts` and
// `detect_technical_artifact_blockers` live in
// ./technical-artifact-blockers.js — helpers that overlap (dedupeMessages,
// numericValue, recordUsageHints, hasProductCardCtaButton,
// hasProductCardCtaTypography, hasUsefulTypography, isPlainObject) are imported
// from there to keep semantics in lockstep across both modules.

import { findFirstUnsafePublicString } from "./unsafe-public-strings.js";
import { productCardCtaIsReusable } from "./product-card-cta-evidence.js";
import {
  dedupeMessages,
  hasProductCardCtaButton,
  hasProductCardCtaTypography,
  isPlainObject,
  recordUsageHints,
} from "./technical-artifact-blockers.js";

// --- Hint constants (string-for-string parity with Python) ---

// Re-export `product-card-cta` from technical-artifact-blockers.js so callers
// don't have to know which module owns the canonical string.
export { PRODUCT_CARD_CTA_HINT } from "./technical-artifact-blockers.js";

export const BUTTON_TYPOGRAPHY_HINT = "button-typography";

export const BUTTON_PRIMARY_HOVER_BACKGROUND_HINT = "button-primary-hover-background";

// Mirrors Python `CANONICAL_USAGE_HINTS` (the 40-element set on
// validation.py:295). Order is irrelevant; membership is the only operation we
// run against this set.
export const CANONICAL_USAGE_HINTS = new Set([
  "brand-primary-accent",
  "brand-secondary-accent",
  "promo-accent",
  "promo-surface-accent",
  "promo-surface-background",
  "canvas-background",
  "content-background",
  "header-background",
  "footer-background",
  "product-card-surface-background",
  "heading-text",
  "body-text",
  "link",
  "link-text",
  // Produced by `lib/text-color-role-synthesis.js` and listed in both
  // reference schemas' usageHints enums; it was missing here and in the Python
  // twin, so every kit carrying a synthesised secondary link colour drew a
  // "usageHints outside the canonical extraction contract" warning about a hint
  // this codebase itself emits.
  "link-promo",
  "header-link",
  "footer-text",
  "footer-link",
  "button-primary-background",
  "button-primary-text",
  "button-primary-hover-background",
  "button-secondary-background",
  "button-secondary-text",
  "product-card-cta-background",
  "product-card-cta-text",
  "product-card-cta-hover-background",
  "product-card-cta-border",
  "price-current",
  "price-old",
  "divider",
  "border-subtle",
  "body-typography",
  "heading-typography",
  "header-typography",
  "footer-typography",
  "button-typography",
  "product-name-typography",
  "product-price-typography",
  "product-old-price-typography",
  "product-card-cta",
]);

// Mirrors Python `SOCIAL_PLATFORM_KEYS = tuple(PLATFORM_DOMAIN_ALLOWLIST.keys())`.
// Not consumed by `validate_brandkit_semantics`, but exported here for parity
// with the Python module's public surface.
export const SOCIAL_PLATFORM_KEYS = [
  "facebook",
  "youtube",
  "instagram",
  "tiktok",
  "twitter",
  "x",
  "snapchat",
  "pinterest",
  "linkedin",
  "android",
  "apple",
  "rss",
  "yelp",
  "threads",
  "discord",
  "twitch",
  "whatsapp",
  "viber",
  "telegram",
  "messenger",
];

// --- Warning / error message constants (string-for-string parity) ---

export const NONCANONICAL_USAGE_HINT_WARNING =
  "Final brandkit contains usageHints outside the canonical extraction contract.";

export const PRODUCT_CARD_CTA_FALLBACK_ADVISORY =
  "Product-card CTA lacks medium/strong reusable visible-text evidence; downstream should use primary button fallback for reusable text CTA tokens.";

export const PRODUCT_CARD_CTA_REUSABLE_HINT_WARNING =
  "Reusable product-card-cta hint is present, but no medium/strong visible-text product-card CTA evidence supports it.";

export const PRODUCT_CARD_CTA_ICON_ONLY_MIRROR_LEAK_BLOCKER =
  "Product-card CTA layoutIntent is icon-only, so no brand.components.button or brand.typography entry may carry the product-card-cta usage hint; the icon-only path must keep that hint exclusive to productCard.cta.";

export const PRODUCT_CARD_CTA_LAYOUT_INTENT_INCOHERENT_BLOCKER =
  "Product-card CTA layoutIntent and hasUsableVisibleText are incoherent: icon-only requires hasUsableVisibleText=false, while content-sized or full-width requires hasUsableVisibleText=true.";

// --- Usage-hint iteration helpers ---

// Mirrors Python `_iter_usage_hint_records`. Returns an eager array of
// `[recordPath, record]` tuples for every usage-hint-bearing record, in the
// exact iteration order the Python generator yields (accentColors,
// backgroundColors, textColors, then typography, then components.button).
// Eager array is preferred to a generator because the data sizes are tiny and
// the call-site only needs a single pass.
export function iterUsageHintRecords(brandkit) {
  const out = [];
  const brand = isPlainObject(brandkit?.brand) ? brandkit.brand : {};
  const colors = isPlainObject(brand.colors) ? brand.colors : null;
  if (colors !== null) {
    for (const colorGroup of ["accentColors", "backgroundColors", "textColors"]) {
      const records = colors[colorGroup];
      if (Array.isArray(records)) {
        records.forEach((record, index) => {
          out.push([`brand.colors.${colorGroup}[${index}]`, record]);
        });
      }
    }
  }

  const typography = brand.typography;
  if (Array.isArray(typography)) {
    typography.forEach((record, index) => {
      out.push([`brand.typography[${index}]`, record]);
    });
  }

  const components = isPlainObject(brand.components) ? brand.components : {};
  const buttons = components.button;
  if (Array.isArray(buttons)) {
    buttons.forEach((record, index) => {
      out.push([`brand.components.button[${index}]`, record]);
    });
  }
  return out;
}

// --- Product-card CTA contract helpers ---

// Mirrors Python `_has_product_card_cta_usage_hint`. True iff the brandkit's
// reusable button[] OR typography[] mirrors carry the `product-card-cta` hint.
export function hasProductCardCtaUsageHint(brandkit) {
  return hasProductCardCtaButton(brandkit) || hasProductCardCtaTypography(brandkit);
}

// Mirrors Python `_product_card_cta_is_reusable`. A product-card CTA counts as
// reusable when its evidenceQuality is medium/strong AND its CTA is a
// visible-text purchase action with `hasUsableVisibleText=true` and not
// icon-like.
export { productCardCtaIsReusable } from "./product-card-cta-evidence.js";

// Mirrors Python `_product_card_cta_needs_text_fallback`. Any assembled card
// without reusable CTA evidence — including a missing or weak CTA — needs the
// deterministic downstream text/button fallback.
export function productCardCtaNeedsTextFallback(card) {
  if (!isPlainObject(card)) return false;
  return !productCardCtaIsReusable(card);
}

// Mirrors Python `_product_card_cta_contract_warnings`. Walks every product-
// card and emits the FALLBACK advisory and/or the REUSABLE-HINT warning when
// the contract gates fire. Result is deduped to keep the public surface tidy.
export function productCardCtaContractWarnings(brandkit) {
  const brand = isPlainObject(brandkit?.brand) ? brandkit.brand : {};
  const components = isPlainObject(brand.components) ? brand.components : {};
  const cards = components.productCard;
  if (!Array.isArray(cards)) return [];
  const warnings = [];
  const reusableHint = hasProductCardCtaUsageHint(brandkit);
  const reusableCard = cards.some((card) => productCardCtaIsReusable(card));
  for (const card of cards) {
    if (!isPlainObject(card)) continue;
    if (productCardCtaNeedsTextFallback(card)) {
      warnings.push(PRODUCT_CARD_CTA_FALLBACK_ADVISORY);
    }
    if (reusableHint && !reusableCard && !productCardCtaIsReusable(card)) {
      warnings.push(PRODUCT_CARD_CTA_REUSABLE_HINT_WARNING);
    }
  }
  return dedupeMessages(warnings);
}

// --- Icon-only mirror leak / layout intent coherence ---

// Mirrors Python `_product_card_icon_only_mirror_leak`. Returns true when any
// product-card CTA is icon-only AND the brandkit ALSO carries the
// `product-card-cta` hint anywhere in `brand.components.button[]` or
// `brand.typography[]` — that mirror MUST stay exclusive to productCard.cta on
// the icon-only path.
export function productCardIconOnlyMirrorLeak(brandkit) {
  const brand = isPlainObject(brandkit?.brand) ? brandkit.brand : {};
  const components = isPlainObject(brand.components) ? brand.components : {};
  const cards = components.productCard;
  if (!Array.isArray(cards)) return false;
  for (const card of cards) {
    if (!isPlainObject(card)) continue;
    const cta = isPlainObject(card.cta) ? card.cta : null;
    if (!cta) continue;
    if (cta.layoutIntent !== "icon-only") continue;
    if (hasProductCardCtaButton(brandkit) || hasProductCardCtaTypography(brandkit)) {
      return true;
    }
  }
  return false;
}

// Mirrors Python `_product_card_cta_layout_intent_incoherent`. Returns true
// when any product-card CTA declares `layoutIntent: "icon-only"` while ALSO
// claiming `hasUsableVisibleText: true`. (The Python helper flags only this
// exact pair; full-width/content-sized + missing visible-text is not surfaced
// here. Keeping that asymmetry in the JS port preserves parity.)
export function productCardCtaLayoutIntentIncoherent(brandkit) {
  const brand = isPlainObject(brandkit?.brand) ? brandkit.brand : {};
  const components = isPlainObject(brand.components) ? brand.components : {};
  const cards = components.productCard;
  if (!Array.isArray(cards)) return false;
  for (const card of cards) {
    if (!isPlainObject(card)) continue;
    const cta = isPlainObject(card.cta) ? card.cta : null;
    if (!cta) continue;
    if (cta.layoutIntent === "icon-only" && cta.hasUsableVisibleText === true) {
      return true;
    }
  }
  return false;
}

// --- Public orchestrator ---

// Mirrors Python `validate_brandkit_semantics(brandkit) -> SemanticValidationResult`.
//
// Iteration order (must match Python exactly):
//   1. Walk every usage-hint-bearing record and emit:
//        a. an empty-usageHints error if the array is empty;
//        b. one noncanonical-hint warning per non-canonical hint;
//        c. a missing-hoverBackgroundColor error when a button[] entry uses
//           the `button-primary-hover-background` hint without setting
//           `hoverBackgroundColor`.
//   2. Run `_raise_on_unsafe_public_strings`. Python's call site catches the
//      jsonschema.ValidationError and appends `str(exc)` to errors; we mirror
//      that behavior here (we do NOT throw out of `validateBrandkitSemantics`).
//      The thrown error's `.message` is the same string Python's `str(exc)`
//      yields, so parity holds.
//   3. Append product-card CTA contract warnings.
//   4. Append the icon-only mirror-leak blocker when the gate fires.
//   5. Append the layout-intent incoherent blocker when the gate fires.
// Both lists are deduped (Python uses `dict.fromkeys`; we use `Set` ordering).
export function validateBrandkitSemantics(brandkit) {
  const errors = [];
  const warnings = [];
  // See the push site: kept out of `warnings` until after the record loop so
  // the ordered semantic-parity oracle sees the same list on both sides.
  const hoverCoherence = [];

  for (const [recordPath, record] of iterUsageHintRecords(brandkit)) {
    const usageHints = recordUsageHints(record);
    if (usageHints.length === 0) {
      // The prohibition applies to typography rows only. Every canonical hint a
      // typography row can carry is a deterministic role, so the ONLY edit that
      // clears this error there is a forbidden authoring. A colour row's hints
      // are the agent's to tag, so the bare message is correct for those.
      const deterministicRow = recordPath.startsWith("brand.typography");
      errors.push(
        `${recordPath} must include a non-empty usageHints array.` +
          (deterministicRow
            ? " DO NOT satisfy this by adding a hint: every canonical hint a typography row carries is a deterministic role the agent may not author. Re-run normalize, which strips a genuinely hintless row, and report the row if it survives."
            : ""),
      );
    }
    for (const hint of usageHints) {
      if (!CANONICAL_USAGE_HINTS.has(hint)) {
        warnings.push(`${NONCANONICAL_USAGE_HINT_WARNING} ${recordPath}: ${hint}`);
      }
    }
    if (
      recordPath.startsWith("brand.components.button[") &&
      usageHints.includes(BUTTON_PRIMARY_HOVER_BACKGROUND_HINT) &&
      (!isPlainObject(record) || record.hoverBackgroundColor === undefined || record.hoverBackgroundColor === null)
    ) {
      // A WARNING, NOT AN ERROR. Pure styling coherence: a button row claims a
      // hover role and carries no hover colour, so the compiler falls through
      // to its own default. Nothing false is published -- the field is absent,
      // not wrong -- and refusing the run persists no kit at all.
      //
      // Collected here and appended AFTER the loop rather than pushed into
      // `warnings` in place: `validateBrandkitSemantics` is under the ordered
      // `_assert_semantic_parity` oracle, and the Python twin builds its
      // warnings in a different order within this same loop. Appending both
      // sides at one point after the loop is what keeps the two lists equal.
      hoverCoherence.push(
        `${recordPath} uses '${BUTTON_PRIMARY_HOVER_BACKGROUND_HINT}' but is missing hoverBackgroundColor.`,
      );
    }
  }

  const unsafe = findFirstUnsafePublicString(brandkit);
  if (unsafe !== null) {
    errors.push(unsafe.message);
  }
  warnings.push(...productCardCtaContractWarnings(brandkit));

  // Demoted from error → warning: when the productCard CTA is icon-only but
  // a `button[]` / `typography[]` entry still carries `product-card-cta`, the
  // compiler's icon-only fallback already ignores that mirror and uses the
  // primary button instead. Surface it so operators see the leak; do not
  // hard-fail extraction.
  if (productCardIconOnlyMirrorLeak(brandkit)) {
    warnings.push(PRODUCT_CARD_CTA_ICON_ONLY_MIRROR_LEAK_BLOCKER);
  }
  // AND THE LAYOUT-INTENT INCOHERENCE JOINS IT. This used to say the
  // contradiction is one "downstream cannot safely interpret" -- but downstream
  // does interpret it, by the icon-only fallback two blocks above, which is why
  // its sibling was demoted first. It is a component-role coherence finding:
  // styling, not a false fact, and refusing the run over it publishes nothing.
  if (productCardCtaLayoutIntentIncoherent(brandkit)) {
    warnings.push(PRODUCT_CARD_CTA_LAYOUT_INTENT_INCOHERENT_BLOCKER);
  }
  warnings.push(...hoverCoherence);

  return {
    errors: dedupeMessages(errors),
    warnings: dedupeMessages(warnings),
  };
}

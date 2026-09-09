// Deterministic variant-index derivation for the abandoned-cart email
// template. Walks the decision tree documented in
// `references/product-card-variants.md` and returns an integer 0-4
// when all required input axes are present, or `null` when the signal
// is genuinely ambiguous (agent must decide from screenshot).
//
// All four input axes are now deterministic by the time this runs:
//   - `cta.isIconLike` + `cta.hasUsableVisibleText`: probe-captured.
//   - `oldPricePosition`: derived from per-row price/oldPrice
//     boundingBox votes by `aggregateOldPricePosition`.
//   - `cta.hasInlineIcon`: probe-captured.
//   - `contentAlign`: derived from titleTextAlign/priceTextAlign votes
//     by `aggregateContentAlign`.
//
// So the variant pick itself can be deterministic too — the agent's
// job shrinks to confirming the derived index against the saved
// screenshot and refining `recommendedVariantReason` with
// screenshot-confirmed nuance. The scaffolder writes a starter reason
// citing the input axes used; the agent overwrites if their confirmation
// adds detail.
//
// Decision tree (mirrors product-card-variants.md):
//   1. Icon-only CTA → variant 2.
//   2. Verb-bearing CTA:
//      a. oldPricePosition=right → variant 3
//      b. oldPricePosition=left  → variant 4
//      c. oldPricePosition=top OR null:
//         - hasInlineIcon=true   → variant 0
//         - hasInlineIcon=false:
//           - contentAlign=center → variant 1
//           - contentAlign=left   → variant 3 (parametric oldPrice
//             override flips bundled RIGHT to TOP at customise time)
//           - contentAlign=null   → null (agent decides)
//         - hasInlineIcon=null    → null (agent decides; screenshot
//           disambiguates per doc)
//   3. None match cleanly → null.
//
// Conservative posture: insufficient signal returns `null` rather
// than guessing, which hands the pick to the AGENT --
// `enforceDeterministicVariantIndex` below abstains entirely when this
// returns null, so an agent-authored index stands.
//
// A null here is NOT a licence to ship a null index. This comment used
// to claim the customise pipeline had its own deterministic scorer, and
// to cite a python file by name as that scorer. The name is deleted
// rather than reworded: a repo-wide search found exactly one string
// matching it and it was this comment, which is what made this the most
// convincing of the surfaces making the claim. No such scorer exists
// anywhere in either repo, and the absence is deliberate:
// `card_tokens.py::_map_product_card_selection` maps an absent index to
// `None` because "the scorer that would otherwise compute it is
// explicitly out of scope (SPEC A §4)", `product_card_builder.py` states
// variant selection is "never re-scored", and
// `build_product_card_bundle.py::_resolve_variant` raises `WorkflowError`
// on `--variant auto` unless the index is an int 0..4. A null index is a
// downstream HALT that costs an operator an explicit `--variant`.
//
// The AXES are the opposite case and their own comments say so: an
// absent `oldPricePosition` / `contentAlign` / `cta.isIconLike` is
// omitted from the selection dict entirely and the bundled template
// default stands. Only the index reaches `--variant auto`.

const KNOWN_OLD_PRICE_POSITIONS = new Set(["top", "left", "right"]);

/**
 * Walk the decision tree and return either
 * `{ index, reason }` or `null`. The reason cites the input axes used.
 */
export function deriveRecommendedVariantIndex(card) {
  if (!card || typeof card !== "object") return null;
  const cta = card.cta && typeof card.cta === "object" ? card.cta : null;

  // Step 1: icon-only CTA short-circuits. Variant 2 is the only
  // icon-only template; the customise pipeline's parametric
  // oldPricePosition override flips its bundled TOP to whatever the
  // brand specifies.
  if (cta && cta.isIconLike === true && cta.hasUsableVisibleText === false) {
    return {
      index: 2,
      reason: "icon-only CTA (isIconLike=true, hasUsableVisibleText=false) → variant 2",
    };
  }

  // Defensive guard: a CTA flagged BOTH `isIconLike=true` AND
  // `hasUsableVisibleText=true` is contradictory probe evidence — the
  // CTA can't be icon-only-shaped AND text-bearing simultaneously.
  // Step 1 didn't match (text is true), and falling through to step 2's
  // verb-bearing branch would commit a variant from contradictory
  // signal. Abstain so the agent investigates the probe discrepancy.
  if (cta && cta.isIconLike === true && cta.hasUsableVisibleText === true) {
    return null;
  }

  // From here we're in verb-bearing CTA territory. If cta is missing
  // or the visible-text signal is null/false (without icon-only), we
  // can't proceed deterministically.
  if (!cta || cta.hasUsableVisibleText !== true) return null;

  const oldPricePosition = card.oldPricePosition;

  // Step 2a: explicit RIGHT placement.
  if (oldPricePosition === "right") {
    return {
      index: 3,
      reason: "verb-bearing CTA + oldPricePosition=right → variant 3 (only RIGHT-placement variant)",
    };
  }

  // Step 2b: explicit LEFT placement.
  if (oldPricePosition === "left") {
    return {
      index: 4,
      reason: "verb-bearing CTA + oldPricePosition=left → variant 4 (only LEFT-placement variant)",
    };
  }

  // Step 2c: TOP or NULL placement. Unknown placement values abstain.
  if (
    oldPricePosition !== "top" &&
    oldPricePosition !== null &&
    oldPricePosition !== undefined
  ) {
    return null;
  }
  if (
    typeof oldPricePosition === "string" &&
    !KNOWN_OLD_PRICE_POSITIONS.has(oldPricePosition)
  ) {
    return null;
  }

  const hasInlineIcon = cta.hasInlineIcon;

  // Step 2c.i: verb + decorative-glyph CTA.
  if (hasInlineIcon === true) {
    return {
      index: 0,
      reason: "verb-bearing CTA + decorative glyph (hasInlineIcon=true) + oldPricePosition=top/null → variant 0",
    };
  }

  // Step 2c.ii: pure verb-only CTA. Branch on contentAlign.
  if (hasInlineIcon === false) {
    if (card.contentAlign === "center") {
      return {
        index: 1,
        reason: "verb-only CTA + centre-aligned content + oldPricePosition=top/null → variant 1",
      };
    }
    if (card.contentAlign === "left") {
      return {
        index: 3,
        reason: "verb-only CTA + left-aligned content + oldPricePosition=top/null → variant 3 (parametric override flips bundled RIGHT to TOP at customise)",
      };
    }
    // contentAlign null/unknown: agent must decide.
    return null;
  }

  // hasInlineIcon null/unknown: agent must decide (per doc, screenshot
  // disambiguates between verb+glyph and pure verb-only).
  return null;
}

/**
 * Populate `productCard[0].recommendedVariantIndex` and
 * `recommendedVariantReason` from the deterministic derivation.
 * Conservative: only writes when BOTH fields are currently unset
 * (null / undefined / empty string). An agent-authored value is
 * preserved — the agent's screenshot review beats the deterministic
 * tree-walk on tie or conflict.
 *
 * Returns true when a write happened, false otherwise.
 */
export function applyDerivedVariantIndex(payload) {
  const cards = payload?.brand?.components?.productCard;
  if (!Array.isArray(cards) || cards.length === 0) return false;
  const card = cards[0];
  if (!card || typeof card !== "object") return false;

  const hasIndex =
    card.recommendedVariantIndex !== undefined &&
    card.recommendedVariantIndex !== null;
  const hasReason =
    typeof card.recommendedVariantReason === "string" &&
    card.recommendedVariantReason.trim().length > 0;
  if (hasIndex || hasReason) return false;

  const derived = deriveRecommendedVariantIndex(card);
  if (!derived) return false;

  card.recommendedVariantIndex = derived.index;
  card.recommendedVariantReason =
    "Auto-derived from probe evidence: " +
    derived.reason +
    ". Agent should confirm against the saved homepage screenshot and refine this reason with screenshot-grounded nuance if needed.";
  return true;
}

/**
 * Always-overwrite companion to `applyDerivedVariantIndex`. Runs in
 * the normalize path after the scaffold-time fill: when the
 * deterministic tree returns a definite index, the tree wins over
 * any LLM-authored value.
 *
 * Conservative posture restricted to a single axis: only the
 * `recommendedVariantIndex` is overwritten when the tree disagrees
 * with the agent. The reason is always overwritten too, but worded so
 * the agent knows they may still amend the reason after screenshot
 * review (the index remains tree-authoritative).
 *
 * When the tree returns `null` (insufficient signal), this helper
 * abstains entirely — the agent's manual override stays in place.
 * That's the legitimate ambiguous case the tree explicitly cannot
 * resolve.
 *
 * Emits one diagnostic when overwrite changed the index value
 * (`before` was a real value AND differed from the tree result), so
 * a sceptic can audit which agent picks the helper undid. No
 * diagnostic when the agent agreed with the tree or hadn't authored
 * an index yet — the reason update on agreement is a silent
 * canonicalisation.
 *
 * Returns true when a write happened, false otherwise.
 */
export function enforceDeterministicVariantIndex(payload, diagnostics = []) {
  const cards = payload?.brand?.components?.productCard;
  if (!Array.isArray(cards) || cards.length === 0) return false;
  const card = cards[0];
  if (!card || typeof card !== "object") return false;

  const derived = deriveRecommendedVariantIndex(card);
  if (!derived) return false;

  const before = card.recommendedVariantIndex;
  const previousReason =
    typeof card.recommendedVariantReason === "string"
      ? card.recommendedVariantReason
      : "";

  card.recommendedVariantIndex = derived.index;
  // Confirm path: when the agent already picked the same index, preserve
  // their reason text — they may have screenshot-specific nuance worth
  // keeping (e.g. screenshot-specific layout cues the tree can't see). Only
  // canonicalise the reason when the helper actually overwrote a
  // disagreeing value OR the previous reason was empty.
  const agentConfirmed = before === derived.index && previousReason.trim().length > 0;
  if (!agentConfirmed) {
    card.recommendedVariantReason =
      "Deterministic (decision-tree): " +
      derived.reason +
      ". Agent may amend the reason after screenshot review; index is fixed by the tree.";
  }

  if (before !== undefined && before !== null && before !== derived.index) {
    diagnostics.push({
      severity: "info",
      path: "$.brand.components.productCard[0].recommendedVariantIndex",
      message:
        "Overwrote LLM-authored recommendedVariantIndex (was " +
        String(before) +
        ", deterministic tree returns " +
        String(derived.index) +
        "). Original reason: " +
        (previousReason || "(empty)"),
    });
  }
  return true;
}

# Product-card variants

The downstream email template provides five modules. Before comparing their shapes, establish what the selected card control actually does and whether that action is compatible with an email product CTA. Record the closest compatible module in `recommendedVariantIndex`, with the source action and any adaptation or material trade-off in `recommendedVariantReason`. This index identifies an email module, not the position of a source candidate. The first selected product card is the downstream default.

The working packet includes this table, so a separate read is unnecessary during ordinary extraction.

| Index | Module | Surface | CTA shape | Title alignment | Bundled old-price |
|---|---|---|---|---|---|
| 0 | Single Product Card Standard | bare | verb + decorative glyph | left | **TOP** (stacked) |
| 1 | Single Product Card Standard No.2 | tiled | verb-only full-width | centre | **TOP** (stacked) |
| 2 | Single Product Card Standard No.3 | bare | icon-only glyph | left | **TOP** (stacked) |
| 3 | Single Product Card Standard No.6 | tiled | verb-only full-width | left | **RIGHT** (beside current) |
| 4 | Single Product Card Standard No.5 | tiled | verb-only full-width | centre | **LEFT** (beside current) |

Action meaning takes precedence over visual similarity. A wishlist or favourite control is never purchase evidence and must not become an add-to-cart CTA. A genuine icon-only purchase action may support variant 2; keep it icon-only with `isIconLike: true`, `hasUsableVisibleText: false` and `hasInlineIcon: false`, because `hasInlineIcon` describes a decorative glyph beside visible text. A product-detail link can support a view/details action, but it is distinct from add-to-cart and must not be relabelled as purchase evidence.

After that compatibility decision, use the selected physical card and its screenshot context to assess surface, CTA shape, alignment and price arrangement together. Different source cards may legitimately use different treatments. Keep their own measurements; agreement across other cards is not authority to replace them.

`cta.layoutIntent`, `contentAlign` and `oldPricePosition` separately control the customized layout. Preserve the observed values even when the nearest module has different defaults. Colors and typography are customized from the kit, so the module's stock palette and font are not selection criteria. The unused brand-line slot is also not a criterion.

Distinguish visible label text from an accessible name. An icon-only action may have an aria-label without a painted label. Preserve `hasUsableVisibleText`, `isIconLike`, `hasInlineIcon`, state and measurements from the same selected control. A text-bearing CTA hint needs a visible label owner from that control or an explicitly selected visible-label fallback used only as a styling source; an accessible name alone is not a text-style owner.

When the selected card has no visible compatible CTA or only an icon-like control whose action is unclear, make one bounded hover check of that card before reporting a CTA gap or borrowing another component's button styling. Use a current card ref, or a visible descendant ref within it when needed. Read hover's returned snapshot and view its image, then inspect a relevant revealed control and its visible label owner for exact current-state measurements. Preserve their source, text flags and complete measured styling. Card hover alone does not establish the control's own hover treatment. Inspect requests no pointer movement or scrolling; later pointer movement or reveal can change that state. A visibly delayed or inconsistent result may need one focused bounded follow-up. Report only what the checked state supports; unavailable or inconclusive hover, including a touch-only state, is a gap rather than proof of absence. A sufficient, unambiguous CTA, including an icon-only purchase action, needs no discovery hover. Determine action meaning without activating the control.

When no compatible local action is established, preserve its supported surface, title, price and layout evidence and report the CTA gap; do not discard the card or reuse its wishlist control. A separately selected primary control may supply styling for a downstream CTA adaptation when its measured treatment is suitable. Encode the intended adapted label in the existing `cta.text` and mark `textSource: "inferred"`; prose in `recommendedVariantReason` does not reach the consumer as a label. Derive its styling from the explicitly selected treatment. Name that fallback in the reason or gap note and keep its source meaning explicit: a newsletter label or action remains newsletter evidence, not a product action.

Choose a useful closest module only when the evidence and adaptation support it, and explain any material compromise. If they do not, retain the card with the gap reported. No consumer-side scorer absorbs a null index. It is an honest schema-valid partial result, but it cannot drive unattended `--variant auto` and is not onboarding-ready. Validation warnings are advisory; they do not make an incompatible action compatible or select a variant. When no product cards are evidenced, preserve the rest of the kit and report that missing capability.

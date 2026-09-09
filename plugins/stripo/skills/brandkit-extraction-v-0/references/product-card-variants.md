# Product-card variants — visual decision guide

The downstream abandoned-cart email template ships **5 product-card variants** (indices 0–4). Pick the one whose **shape** best matches the live homepage's product cards and write the index into `brand.components.productCard[0].recommendedVariantIndex`. Add a one-line rationale in `recommendedVariantReason`. If the homepage has no product cards (non-ecom), or two variants are genuinely indistinguishable from the evidence, leave both fields `null`.

## Priority order

When two variants partially match, prefer the one whose **old-price placement** matches the brand's `productCard[0].oldPricePosition`, even at the cost of losing the CTA's inline glyph (the inline icon is a smaller detail than the price-block layout that defines the card's overall read). The customise pipeline does parametrically override the variant's bundled `oldPricePosition`, but the bundled-match avoids the layout-relayout pass and keeps the variant's design intact. Glyph preservation is a lower-priority tiebreaker.

## Not match criteria

The customise pipeline replaces these at build time. Do **not** pick a variant by matching them against the live homepage.

- **Surface, CTA, text, border colours** — replaced by brand tokens.
- **Brand-line slot** — variants 0 and 2 ship a slot for it, but the eSputnik data source only provides image / name / price / old_price / link, so the slot stays empty regardless. Ignore it when picking.

## Evidence the agent uses

Read these from your just-written `brand.components.productCard[0]` in `brandkit.extraction.json` plus the saved homepage screenshot at `${BRANDKIT_ARTIFACTS_ROOT}/technical/<slug>/home.png`:

| Decision axis | Evidence field(s) | Notes |
|---|---|---|
| **Old-price placement** (primary axis) | `oldPricePosition` (`"top"` / `"left"` / `"right"` / `null`) | **Pre-derived by the scaffolder** from per-row `price.boundingBox` vs `oldPrice.boundingBox` votes across filtered product rows (`aggregateOldPricePosition` returns a value only when ≥ 2 rows agree at ≥ 60% share; else `null`). `top` = stacked above current price; `left` / `right` = beside current. The variant pick keys off this axis first. The agent confirms against the screenshot and overrides only on clear mismatch. |
| CTA shape: icon-only | `cta.isIconLike == true` AND `cta.hasUsableVisibleText == false` | `cta.text` may still hold an aria-label fallback — that is normal for icon-only CTAs and not a contradiction. `cta.layoutIntent == "icon-only"` is the coherent companion value. |
| CTA shape: verb word + decorative glyph | `cta.isIconLike == false` AND `cta.hasUsableVisibleText == true` AND `cta.hasInlineIcon == true` | `hasInlineIcon` is set by the probe when the live CTA element contains an `<img>`, `<svg>`, or `[class*="icon"]` child alongside visible text. Both button and product-card probes share this bounded measurement: the descendant must have positive geometry above 4px on both axes and pass visibility/ancestor-opacity checks. Hidden descendants do not establish an inline glyph. Pseudo-elements, canvas, shadow DOM, and arbitrary clipping are not inferred. Falls back to screenshot inspection only when `hasInlineIcon` is `null`. |
| CTA shape: verb-only, no glyph | `cta.isIconLike == false` AND `cta.hasUsableVisibleText == true` AND `cta.hasInlineIcon == false` | When `hasInlineIcon` is `null`, the screenshot disambiguates: pure text CTA, no icon. |
| Content alignment | `contentAlign` (`"left"` / `"center"` / `null`) | Authoritative when non-null. `null` means the aggregator did not reach the ≥75% / ≥2-rows threshold — fall back to the screenshot. |
| Card surface (bare vs tiled) | screenshot only | Extraction does not classify surface as tile-vs-bare directly; `productCard[0].surface.{backgroundColor,borderRadius,borderWidth}` is a hint but a tile is visual, not structural. |

`cta.layoutIntent` (`"full-width"` / `"content-sized"` / `"fixed-width"` / `"icon-only"` / `"unknown"`) flows separately to the customise pipeline to drive the rendered CTA width — it is **not** a variant-selection axis. A brand with a content-sized verb-only CTA still falls under "verb-only" in the decision flow; the customiser renders the CTA compact rather than full-width at build time based on this field.

## The 5 variants

| Index | Module | Surface | CTA shape | Title alignment | Bundled old-price |
|---|---|---|---|---|---|
| 0 | Single Product Card Standard | bare | verb + decorative glyph | left | **TOP** (stacked) |
| 1 | Single Product Card Standard No.2 | tiled | verb-only full-width | centre | **TOP** (stacked) |
| 2 | Single Product Card Standard No.3 | bare | icon-only glyph | left | **TOP** (stacked) |
| 3 | Single Product Card Standard No.6 | tiled | verb-only full-width | left | **RIGHT** (beside current) |
| 4 | Single Product Card Standard No.5 | tiled | verb-only full-width | centre | **LEFT** (beside current) |

Variants 1, 3, 4 are all tiled + verb-only-full-width. They differ on alignment AND on bundled old-price placement.

## Decision flow

Walk the steps in order. The first step that matches wins. Old-price placement is the **leading axis** for verb-bearing CTAs; icon-only CTAs short-circuit to variant 2 regardless.

1. **`cta.isIconLike == true` AND `cta.hasUsableVisibleText == false`** → **variant 2**.
   Icon-only CTA. Variant 2 is the only icon-only template; the customise pipeline's parametric `oldPricePosition` override flips its bundled TOP layout to LEFT/RIGHT when the brand specifies a non-top position.

2. **Verb-bearing CTA.** Branch on `oldPricePosition` FIRST:

   a. **`oldPricePosition == "right"`** → **variant 3** (the only RIGHT-placement variant).
      Variant 3 is tiled + LEFT-aligned + verb-only + RIGHT. Picking it loses the CTA's inline glyph (if any) because variant 3 has no glyph slot — accept this trade-off per the priority order at the top of the doc. Placement match wins over glyph preservation.

   b. **`oldPricePosition == "left"`** → **variant 4** (the only LEFT-placement variant).
      Variant 4 is tiled + CENTRE-aligned + verb-only + LEFT. Same trade-off: lose the glyph if any.

   c. **`oldPricePosition == "top"` OR `null`** (no old price visible OR mixed layouts). All TOP-bundled variants are 0, 1, 2 (variant 2 is icon-only and handled in step 1). Branch on `cta.hasInlineIcon`:

      - **`cta.hasInlineIcon == true`** → **variant 0** (bare + LEFT + verb-with-decorative-glyph + TOP).
        The bundled variant 0 ships a compact pill CTA; the customise consumer's `cta.layoutIntent` override stretches it to full-width when the brand's live CTA is full-width.

      - **`cta.hasInlineIcon == false`** (or `null` with a screenshot showing a pure verb-only CTA):
        - `contentAlign == "center"` (or screenshot reads centred) → **variant 1** (tiled + CENTRE + verb-only + TOP).
        - `contentAlign == "left"` (or screenshot reads left) → **variant 3** (tiled + LEFT + verb-only). Note variant 3 ships RIGHT placement; the parametric `oldPricePosition` override flips its price block to TOP at customise time. The trade-off here is reversed: variant 3's alignment matches the brand exactly, and the customiser absorbs the placement override.
        - `contentAlign == null` AND the screenshot is genuinely ambiguous → return `null`.

3. **None match cleanly** → return `null`.

## The tree returns `null` rather than guessing when

- The homepage is non-ecommerce (no product cards anywhere). Emit `productCard: []` per the Stop matrix; `recommendedVariantIndex` stays `null`.
- The CTA shape is genuinely ambiguous between two of the three shape categories.
- `contentAlign` is `null` AND the screenshot does not lean to either alignment.
- Different cards on the same page use different shapes (mixed CTA shapes, mixed surface styles, mixed old-price placements).

A `null` from the tree is the tree ABSTAINING, which hands the decision to you. It is not a value to ship. No consumer-side scorer absorbs a null index: `build_product_card_bundle.py --variant auto` raises `WorkflowError` unless `productCardSelection.recommendedVariantIndex` is an int 0..4, and the onboarding run HALTs there to ask a human operator for an explicit `--variant`. Every bullet above except the first therefore means "decide it from the screenshot", not "leave it null" — only the non-ecommerce case ships a null index, and it ships one because `productCard: []` leaves no row to carry it.

The collector preserves distinct published CTA paint, border width/radius, padding, layout, inline-glyph, and supported hover-color variants. A hover-revealed replacement carries its own label, glyph evidence, layout and styles together; the replaced record and its selection evidence remain under `originalCandidate`. Its visible-under-card-hover sample is its default, and its own CSSOM hover is recorded separately when measurable. Measured text-only glyph evidence is `false`; a missing reader remains `null`, so automatic variant selection can abstain. Supported text and border hover colors survive even when fill is unchanged. Hover font-weight is outside the public product-card contract.

Default-card, alternative and standalone button readers share label geometry: a measured zero text Range axis is unusable; positive text geometry can survive `line-height: normal`, a zero line box, or a zero-font parent with a sized descendant. Unknown extent falls back to the control font and existing label recovery/fit checks. Positive Range geometry is not proof of visible ink through arbitrary clipping or hidden styles.

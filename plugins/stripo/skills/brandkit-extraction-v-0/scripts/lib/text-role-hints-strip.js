// Strip readable-copy usage hints (`heading-text`, `body-text`,
// `product-card-cta-text`) from `brand.colors.accentColors[*].usageHints`,
// and (sibling helper below) strip surface-only hints (`*-background`)
// from the same channel.
//
// Why: readable-copy hints describe body / heading / product-card-CTA
// text colors and belong on `brand.colors.textColors[*]` rows. When
// extraction over-tags an accent record with one of these hints (e.g. a
// promo accent whose description mentions "promotional headings"),
// downstream consumers that walk the merged color records in channel
// order (`accentColors → backgroundColors → textColors`) resolve
// `heading_text` / `body_text` / `product_card_cta_text` to the accent
// value instead of the calibrated textColors value. The compiler has a
// matching channel-preference fallback for those roles; this strip
// removes the over-tag at the source so the extraction artifact itself
// is correct.
//
// `link-text` is intentionally NOT in this strip list: brand-coloured
// link text is a legitimate design choice, so an accent-channel
// `link-text` hint is allowed to remain. The customise compiler's
// `link` resolver mirrors this — no textColors-channel preference for
// links. Defense against UA-default link colours bleeding into body
// links lives in the sibling helper `text-color-link-region-purify.js`.
//
// The sibling `stripBackgroundHintsFromAccents` mirrors the same shape
// for the `backgroundColorUsageHint` enum: any surface hint
// (`canvas-background`, `content-background`, `header-background`,
// `footer-background`, `product-card-surface-background`,
// `promo-surface-background`) over-tagged onto an accent row is
// stripped — surface hints live on `backgroundColors` only.
//
// Posture: both helpers are idempotent (running them a second time on a
// stripped payload is a no-op and emits no diagnostics) and append-only
// on the diagnostics array — never re-orders or removes anything else.

export const TEXT_ROLE_HINTS = Object.freeze([
  "heading-text",
  "body-text",
  "product-card-cta-text",
]);

// Must stay in sync with the `backgroundColorUsageHint` enum in
// references/extraction-stage.schema.json. Surface hints live on
// `backgroundColors` rows only; an accent row carrying any of them is
// an over-tag.
export const BACKGROUND_ROLE_HINTS = Object.freeze([
  "canvas-background",
  "content-background",
  "header-background",
  "footer-background",
  "product-card-surface-background",
  "promo-surface-background",
]);

export function stripTextRoleHintsFromAccents(payload, diagnostics = []) {
  const colors = payload?.brand?.colors;
  if (!colors || typeof colors !== "object") return;
  const accents = Array.isArray(colors.accentColors) ? colors.accentColors : [];
  for (const [i, row] of accents.entries()) {
    if (!row || typeof row !== "object") continue;
    const hints = Array.isArray(row.usageHints) ? row.usageHints : [];
    if (hints.length === 0) continue;
    const kept = [];
    const stripped = [];
    for (const h of hints) {
      if (typeof h === "string" && TEXT_ROLE_HINTS.includes(h)) stripped.push(h);
      else kept.push(h);
    }
    if (stripped.length === 0) continue;
    row.usageHints = kept;
    if (Array.isArray(diagnostics)) {
      diagnostics.push({
        severity: "info",
        path: `$.brand.colors.accentColors[${i}].usageHints`,
        message: `Stripped text-role hints [${stripped.join(", ")}] from accent row ${row?.value ?? "(no hex)"}; text-role hints belong on textColors rows only.`,
      });
    }
  }
}

export function stripBackgroundHintsFromAccents(payload, diagnostics = []) {
  const colors = payload?.brand?.colors;
  if (!colors || typeof colors !== "object") return;
  const accents = Array.isArray(colors.accentColors) ? colors.accentColors : [];
  for (const [i, row] of accents.entries()) {
    if (!row || typeof row !== "object") continue;
    const hints = Array.isArray(row.usageHints) ? row.usageHints : [];
    if (hints.length === 0) continue;
    const kept = [];
    const stripped = [];
    for (const h of hints) {
      if (typeof h === "string" && BACKGROUND_ROLE_HINTS.includes(h)) stripped.push(h);
      else kept.push(h);
    }
    if (stripped.length === 0) continue;
    row.usageHints = kept;
    if (Array.isArray(diagnostics)) {
      diagnostics.push({
        severity: "info",
        path: `$.brand.colors.accentColors[${i}].usageHints`,
        message: `Stripped surface hints [${stripped.join(", ")}] from accent row ${row?.value ?? "(no hex)"}; surface hints belong on backgroundColors rows only.`,
      });
    }
  }
}

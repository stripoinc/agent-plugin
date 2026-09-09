import { selectableProductRows } from "./product-row-filter.js";
// Synthesise a placeholder `brand.components.productCard[0]` from
// brand evidence when the homepage probe captured zero real product
// cards but at least some card-shape rows. Last-resort safety net
// for marketing-style homepages whose product-card probe surfaces
// only promotional banners / carousels (no price, no product URL)
// that `dropNonEcomProductCards` correctly filters out.
//
// Why this exists: a marketing-style homepage's product-card probe
// can capture promotional carousel rows (price-less, with URLs like
// `/action/*` or `/campaign/*` and date-range titles).
// `dropNonEcomProductCards` filters them out cleanly — which leaves
// `brand.components.productCard[]` empty. Downstream customise needs
// SOMETHING to render: a placeholder entry seeded from the brand's
// own colour signals (canvas / product-card-surface backgrounds and
// the primary accent) gives the customise pipeline enough to pick a
// bundled productCard variant and apply brand-aligned CTA colours.
// Layout (variant index, copy, etc.) is NOT synthesised — the
// bundled variant defaults handle that.
//
// Trigger conditions (all must hold):
//   1. `brand.components.productCard[]` is empty (no real cards
//      survived earlier passes).
//   2. The probe captured at least one card-shape row (i.e.
//      `product-card-styles.json` is a non-empty array) — proves
//      we ran the probe and saw SOMETHING card-shaped; we just
//      couldn't keep any of it. On true non-ecom sites this array
//      is empty and the helper no-ops.
//   3. `brand.colors.accentColors[]` has at least one entry the
//      helper can treat as the brand primary (either
//      `brand-primary-accent` tagged or `accentColors[0]` as
//      fall-through).
//
// The synthesised entry:
//   - `description`: explicit note that this is synthetic.
//   - `evidenceQuality: "weak"`, `confidence: 0.3` — both schema-
//     valid (see references/extraction-stage.schema.json).
//   - `surface.backgroundColor`: prefer an existing row tagged
//     `product-card-surface-background`, then `canvas-background`,
//     then `#ffffff` as last-ditch fallback.
//   - `cta.backgroundColor`: brand primary hex.
//   - `cta.fontColor`: relative-luminance-based contrast pick
//     (white on dark primary, black on light primary).
//
// Position: NORMALIZE only. The productCard[] array isn't a stable
// "empty array" until all the dropping helpers (dedupe, placeholder
// collapse, non-ecom, non-purchase) have run. Calling in scaffold
// would synthesise even when the probe-derived rows would survive
// downstream filters.
//
// Mutates `payload.brand.components.productCard[]` in place.

import { markScaffoldSynthesised } from "./provenance-marker.js";

function lowerHex(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

// Compute relative luminance of a 6-digit hex (#RRGGBB). Returns 0..1.
// Uses the standard sRGB linearisation (WCAG 2.x). When the input is
// not a 6-digit hex (3-digit, named, malformed), returns 0.5 as the
// neutral midpoint — the contrast pick falls through to "dark" by the
// `< 0.5` check, which is the safer default for branded sites.
function relativeLuminance(hex) {
  const raw = lowerHex(hex);
  const m = raw.match(/^#([0-9a-f]{6})$/);
  if (!m) return 0.5;
  const bytes = m[1];
  const channels = [bytes.slice(0, 2), bytes.slice(2, 4), bytes.slice(4, 6)].map((part) => {
    const value = Number.parseInt(part, 16) / 255;
    return value <= 0.03928 ? value / 12.92 : Math.pow((value + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function isDarkHex(hex) {
  return relativeLuminance(hex) < 0.5;
}

function pickBrandPrimary(accents) {
  if (!Array.isArray(accents) || accents.length === 0) return null;
  for (const row of accents) {
    if (!row || typeof row !== "object") continue;
    const hints = Array.isArray(row.usageHints) ? row.usageHints : [];
    if (hints.includes("brand-primary-accent") && typeof row.value === "string") return row.value;
  }
  const first = accents[0];
  if (first && typeof first === "object" && typeof first.value === "string") return first.value;
  return null;
}

function pickSurfaceBg(backgroundColors) {
  if (!Array.isArray(backgroundColors)) return "#ffffff";
  const productCardSurface = backgroundColors.find(
    (r) => r && typeof r === "object" && Array.isArray(r.usageHints) && r.usageHints.includes("product-card-surface-background"),
  );
  if (productCardSurface && typeof productCardSurface.value === "string") return productCardSurface.value;
  const canvas = backgroundColors.find(
    (r) => r && typeof r === "object" && Array.isArray(r.usageHints) && r.usageHints.includes("canvas-background"),
  );
  if (canvas && typeof canvas.value === "string") return canvas.value;
  return "#ffffff";
}

// Returns true when a placeholder was synthesised, false otherwise.
// Mutates `payload.brand.components.productCard[]` in place.
export function synthesizeProductCardFromEvidence(payload, productCardStyles, diagnostics = []) {
  productCardStyles = selectableProductRows(productCardStyles);
  const components = payload?.brand?.components;
  if (!components || typeof components !== "object") return false;
  const cards = components.productCard;
  if (!Array.isArray(cards) || cards.length > 0) return false;

  // Trigger 2: probe captured at least one card-shape row.
  if (!Array.isArray(productCardStyles) || productCardStyles.length === 0) return false;

  // Trigger 3: need a brand-primary accent signal.
  const accents = payload?.brand?.colors?.accentColors;
  const brandPrimary = pickBrandPrimary(accents);
  if (!brandPrimary) return false;

  const backgroundColors = payload?.brand?.colors?.backgroundColors;
  const surfaceBg = pickSurfaceBg(backgroundColors);
  const ctaTextColor = isDarkHex(brandPrimary) ? "#ffffff" : "#000000";

  components.productCard.push(markScaffoldSynthesised({
    description: "Synthesised from brand evidence — homepage probe did not surface real product cards.",
    evidenceQuality: "weak",
    confidence: 0.3,
    surface: { backgroundColor: surfaceBg },
    cta: { backgroundColor: brandPrimary, fontColor: ctaTextColor },
  }));

  if (Array.isArray(diagnostics)) {
    diagnostics.push({
      severity: "info",
      path: "$.brand.components.productCard",
      message: "Synthesised a placeholder productCard from brand evidence (homepage probe yielded no real product cards).",
    });
  }
  return true;
}

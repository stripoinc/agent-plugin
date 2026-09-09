// Tier-H Fix 3 (extraction prong) — purify `link` / `link-text` /
// `footer-link` / `header-link` hint tags from textColors[] rows
// whose `description` identifies them as a product-card / category
// link rather than a body link.
//
// Failure mode this closes: a site's CSS surfaces a textColors row
// like `#0000EE` with description "Product and category link color
// for the catalog grid" and `usageHints: ["link", "link-text",
// "footer-link"]`. The Python compiler (`build_brand_tokens.py`)
// reads textColors[] for the `link` / `footer_link` semantic tokens
// — it picks the first row whose usageHints carry the matching role
// hint. With the wrong hex tagged for `link`, the downstream email
// renders body anchors in a product-card-only colour, which can be
// wildly off-brand (e.g. a vivid blue body link on a brand whose
// real body link is the brand primary).
//
// Fix algorithm:
//   1. Find a body-text row — `usageHints` includes `body-text`
//      AND `value` is a non-empty hex. This is the safer alternative;
//      if no body row exists, do nothing (we cannot trust the purify
//      step without a fallback for the downstream compiler).
//   2. For each textColors row:
//        - skip if it shares the body row's hex (the body row itself
//          or another row with the same hex; leave alone)
//        - skip if its `description` does NOT mention a product /
//          product-card / category / catalog region
//        - skip if it ALSO carries `body-text` (multi-role row; the
//          agent has explicitly claimed it covers body text too)
//        - else, strip `link` / `link-text` / `footer-link` /
//          `header-link` from `usageHints` and emit a diagnostic.
//
// Conservative posture:
//   - Only touch the link-family hints. Other hints on the row
//     (e.g. `price-current`, `product-card-title-color`) are left
//     intact.
//   - Never delete the row.
//   - GENERAL — regex matches any region-pointing description text
//     (`product`, `product-card`, `category`, `catalog`, `product link`,
//     `item link`). No fixture-named carve-outs.
//   - Idempotent — re-running on the purified array is a no-op,
//     because the role-set is already gone.
//
// Position in normalize: after `synthesizeTextColorRoles` (so the
// safer body row exists if synthesis just promoted one) and BEFORE
// `applyAccentPromotionFromEvidence` (the accent helper doesn't read
// link hints, but the order keeps the purify pass next to the other
// textColor maintenance for greppability).

// Match descriptions that clearly identify the row as a product / category /
// catalog link — phrases that ONLY make sense for product-list link colours,
// not for body-paragraph link colours. Specifically excludes the bare word
// "product" because it would false-match phrases like "Default body copy
// and product description text color" on a row that legitimately carries
// link hints. The body-text safety-net check below is the second line of
// defence, but this regex tightening keeps the false-positive surface small.
const PRODUCT_LINK_DESC_RE = /\bproduct[- ]card\b|\bproduct link\b|\bproduct title\b|\bproduct name\b|\bcategory\b|\bcatalog\b|\bitem link\b|\bitem card\b/i;
const ROLE_HINTS_TO_PURIFY = ["link", "link-text", "footer-link", "header-link"];

function lowerHex(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

export function purifyProductCardLinkRoles(payload, diagnostics = []) {
  const textColors = payload?.brand?.colors?.textColors;
  if (!Array.isArray(textColors)) return;

  // Find a body-text row with usable hex — needed as safer alternative.
  const bodyRow = textColors.find((r) => {
    const hints = Array.isArray(r?.usageHints) ? r.usageHints : [];
    return hints.includes("body-text") && lowerHex(r?.value) !== "";
  });
  if (!bodyRow) return;
  const bodyHex = lowerHex(bodyRow.value);

  for (const row of textColors) {
    if (!row || typeof row !== "object") continue;
    const hex = lowerHex(row.value);
    if (!hex || hex === bodyHex) continue;
    const desc = typeof row.description === "string" ? row.description : "";
    if (!PRODUCT_LINK_DESC_RE.test(desc)) continue;
    const hints = Array.isArray(row.usageHints) ? row.usageHints : [];
    if (hints.includes("body-text")) continue; // multi-role row, leave alone
    const purified = hints.filter((h) => !ROLE_HINTS_TO_PURIFY.includes(h));
    if (purified.length === hints.length) continue;
    row.usageHints = purified;
    if (Array.isArray(diagnostics)) {
      diagnostics.push({
        severity: "info",
        path: "$.brand.colors.textColors[].usageHints",
        message: `Purified link/footer-link role hints from ${row.value} (description mentions product/category region; safer body-text fallback exists at ${bodyRow.value}).`,
      });
    }
  }
}

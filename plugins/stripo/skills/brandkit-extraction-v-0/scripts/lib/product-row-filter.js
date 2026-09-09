// Scaffold-time filter for `product-card-styles.json` rows.
//
// Why: the probe runs every product-card selector against the page and emits
// one row per match. A homepage with 6 visible product cards typically yields
// 200+ rows because nested DOM ancestors / different specificity selectors all
// match. The scaffolder used to map every row to a `brand.components.productCard`
// entry, leaving the agent to wade through hundreds of near-duplicates plus
// non-product noise (rainbow category tiles, brand logos, header utilities).
// In one observed ecommerce run the scaffolder emitted 221 rows and the agent
// kept 40 — clearly more than reasonable. This filter keeps rows that the
// probe's own `selectionSignals` already flag as product-like and drops the
// rest before mapping; the agent then sees a tractable list.
//
// The rules are deliberately conservative:
//   - Wrapper-like rows are never products. The probe sets `looksWrapperLike`
//     when the candidate fills most of the viewport / has way too much text /
//     has many interactive descendants — none of those are real cards.
//   - A row is product-like when at least 2 of (hasCurrentPrice, hasTitle,
//     hasProductUrl) are true. Rows with only one signal are usually partial
//     evidence (a price-only chip, an unlinked title) and add noise.
//   - Or the probe already inferred a purchase intent in a grid context
//     (`ctaLooksPurchaseLike` + `hasGridSiblings`) — covers icon-only "buy"
//     buttons on a card grid even when title/price evidence isn't on the
//     scored row itself.
//
// Rows without `selectionSignals` are kept (back-compat for fixtures and
// older probe outputs that pre-date the signals object).
//
// The cap (`MAX_PRODUCT_CARD_ROWS`) is a defensive ceiling. The probe sorts
// rows by representativeScore descending, so slice(0, MAX) keeps the
// highest-scoring rows. Real homepages have 3-8 distinct card variants;
// 12 is generous headroom and keeps the agent's review tractable.

export const MAX_PRODUCT_CARD_ROWS = 12;

export function isLikelyProductCardRow(row) {
  if (!row || typeof row !== "object") return false;
  const signals = row.selectionSignals;
  // Back-compat: older fixtures without selectionSignals stay accepted.
  if (!signals || typeof signals !== "object") return true;
  if (signals.supportingBoundaryEvidence === true) return false;
  if (signals.looksWrapperLike === true) return false;
  const productSignalCount =
    (signals.hasCurrentPrice === true ? 1 : 0) +
    (signals.hasTitle === true ? 1 : 0) +
    (signals.hasProductUrl === true ? 1 : 0);
  if (productSignalCount >= 2) return true;
  if (signals.ctaLooksPurchaseLike === true && signals.hasGridSiblings === true) return true;
  return false;
}

// Tier T — deterministic populated-price-color promotion.
//
// The probe's `selectionSignals.hasCurrentPrice` is `Boolean(priceText)` —
// any price-shaped text fragment (a "1₴" leaf inside a swatch chip, a "$0"
// placeholder, a coupon-amount caption) trips this signal even when the
// probe did NOT find a real price element on that row (so `row.price.color`
// is `null` / `""`). On homepages that expose ancestor wrappers carrying
// such fragments, partial-evidence rows can outscore the canonical
// product card via the probe's `representativeScore` (`lib.js:5391-5411`).
// The scaffolder hands the agent a draft whose index 0 lacks captured
// price-color, and the agent's rescue is non-deterministic — different
// runs land on different `productCard[0]` shapes for the same site.
//
// This helper distinguishes "row has a captured price element with a real
// colour string" from "row has price-shaped text but no captured element"
// without rebuilding the probe's signal vocabulary. The companion sort in
// `filterScaffoldProductRows` is STABLE, so rows that share populated/
// unpopulated status preserve the probe's representativeScore ordering.
function rowHasPopulatedPriceColor(row) {
  const color = row?.price?.color;
  return typeof color === "string" && color.trim().length > 0;
}

export function filterScaffoldProductRows(rows, options = {}) {
  const max = Number.isInteger(options.max) && options.max > 0 ? options.max : MAX_PRODUCT_CARD_ROWS;
  if (!Array.isArray(rows)) return [];
  const survivors = rankLegacyOverlappingRows(selectableProductRows(rows).filter(isLikelyProductCardRow));
  // Stable secondary sort: rows whose probe captured a real price ELEMENT
  // (with a non-empty `price.color`) rank ahead of rows that only flagged
  // `hasCurrentPrice` via price-shaped TEXT in a descendant. Within each
  // bucket, the probe's representativeScore ordering is preserved verbatim
  // (Array.prototype.sort has been stable since ES2019). Sites whose every
  // survivor already has a populated `price.color` (the common happy path)
  // see no behaviour change — both buckets collapse to one and the sort
  // is a no-op.
  survivors.sort((left, right) => {
    const leftBucket = rowHasPopulatedPriceColor(left) ? 1 : 0;
    const rightBucket = rowHasPopulatedPriceColor(right) ? 1 : 0;
    return rightBucket - leftBucket;
  });
  return survivors.slice(0, max);
}

// Technical compound layers remain inspectable but cannot vote or seed cards.
export function selectableProductRows(rows) {
  return Array.isArray(rows) ? rows.filter(row => !row?.selectionSignals?.supportingBoundaryEvidence) : [];
}

// Old probes have no DOM references or surface measurement state. Exact
// positive price geometry plus URL/title and whole-product flags corroborate
// overlapping observations, but do NOT prove containment. Rank one uniquely
// measured body ahead of unstated paint; retain every row and all uncertainty.
function rankLegacyOverlappingRows(rows) {
  const groups = new Map();
  const clean = value => typeof value === "string" ? value.trim() : "";
  const hex = value => /^#[0-9a-f]{6}$/i.test(clean(value));
  rows.forEach((row,index) => {
    const signals = row.selectionSignals;
    const box = row.price?.boundingBox;
    if (row.card?.backgroundColorState != null || !signals?.hasImage ||
        !signals.hasTitle || !signals.hasCurrentPrice || signals.priceLooksMergedLike ||
        !clean(row.productUrl) || !clean(row.title?.text) || !clean(row.price?.text) ||
        !box || ![box.x,box.y,box.width,box.height].every(Number.isFinite) ||
        box.width <= 0 || box.height <= 0) return;
    const key = JSON.stringify([row.productUrl,row.title.text,row.price.text,box.x,box.y,box.width,box.height]);
    if (!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(index);
  });
  const ranked = [...rows];
  for (const indices of groups.values()) {
    const measured = indices.filter(index => {
      const card = rows[index].card || {};
      return (!card.backgroundImage || card.backgroundImage === "none") &&
        (hex(card.backgroundColor) || (card.borderWidth > 0 && hex(card.borderColor)));
    });
    const styles = new Set(measured.map(index => {
      const c = rows[index].card;
      return JSON.stringify([c.backgroundColor,c.borderWidth,c.borderWidth === 0 ? null : c.borderColor,
        c.borderWidth === 0 ? null : c.borderStyle,c.borderRadius,c.boxShadow]);
    }));
    if (styles.size !== 1) continue;
    const first = indices[0];
    const initial = rows[first].card || {};
    if (clean(initial.backgroundColor) || initial.borderWidth !== 0 ||
        (initial.boxShadow && initial.boxShadow !== "none") ||
        (initial.backgroundImage && initial.backgroundImage !== "none")) continue;
    const winner = measured[0];
    if (winner === first) continue;
    // Swap only positions inside this group; unrelated products keep their
    // positions and no paint/CTA/confidence field crosses between records.
    ranked[first] = rows[winner];
    ranked[winner] = rows[first];
  }
  return ranked;
}

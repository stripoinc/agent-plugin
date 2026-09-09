import { selectableProductRows } from "./product-row-filter.js";
// Deterministic aggregator for `productCard[N].oldPricePosition`.
//
// Why: the live product-card probe captures the bounding boxes of the
// current price + old price on every candidate row. The relative
// geometry of the two boxes encodes the layout intent — when the old
// price is strictly above the current price the old is "top"; when
// they share a row, x-position decides "left" vs "right". Without
// this aggregator the scaffolder leaves the axis null and the LLM
// extraction agent has to decide from the per-row evidence directly,
// which drifted between near-identical runs of the same site (the
// same product page produced different oldPricePosition values on
// back-to-back invocations).
//
// Aggregation rules (mirrors product-card-content-align.js):
//   1. Only rows where BOTH price.boundingBox and oldPrice.boundingBox
//      are present (non-null) contribute a vote. Missing geometry =
//      abstain (the price was text-recovered with no DOM element).
//   2. A row votes "top" when the old-price's center is clearly above
//      the current-price's center — specifically, the absolute
//      center-delta is at least `(combinedHalfHeights - VERTICAL_OVERLAP_TOLERANCE_PX)`
//      pixels. This catches stacked layouts where the two boxes touch
//      with NO inter-box gap (their bottom/top edges meet at the same
//      y), which a gap-based gate would miss.
//   3. A row votes "left" or "right" when the y-centers are within
//      `VERTICAL_OVERLAP_TOLERANCE_PX` of each other (same row), and the
//      x-edges show a clean non-overlapping ordering. Overlapping boxes
//      abstain.
//   4. If fewer than `minVotingRows` (default 2) cleared the gate,
//      return null — single-row evidence is too thin.
//   5. If `majorityCount / votingCount >= threshold` (default 0.6),
//      return the majority. Otherwise return null.
//
// Returning null is the safe fallback — downstream customise falls
// through to a template default. A wrong "top" / "left" / "right"
// would force the email generator to fight the brand evidence.

export const DEFAULT_OLD_PRICE_POSITION_THRESHOLD = 0.6;
export const DEFAULT_MIN_VOTING_ROWS = 2;
export const VERTICAL_OVERLAP_TOLERANCE_PX = 6;
// Horizontal tolerance for the side-by-side decision (left/right). Two
// edges within this many pixels count as touching rather than truly
// separated; protects against sub-pixel rounding from
// getComputedStyle / getBoundingClientRect when the layout sits cleanly
// adjacent.
export const HORIZONTAL_OVERLAP_TOLERANCE_PX = 4;

const VALID_VOTES = new Set(["top", "left", "right"]);

// Inspect a single productCard probe row and return its layout vote, or
// null when the row's evidence is too thin / ambiguous.
//
// Required shape: `row.price?.boundingBox` and `row.oldPrice?.boundingBox`
// each carrying `{x, y, width, height}` as plain numbers. The probe
// (collectProductCardStyles) writes both objects with this shape; null
// is returned when the price was text-recovered without a DOM element.
//
// Decision is center-based — comparing the y-centers of the two boxes
// rather than their edges — so stacked layouts where the boxes touch
// vertically (no inter-box gap) still classify cleanly as "top". An
// edge-gap based threshold would have left those cases as "ambiguous"
// and forced the agent to guess from the screenshot.
export function oldPricePositionVoteForRow(row) {
  if (!row || typeof row !== "object") return null;
  const priceBox = boxOrNull(row.price?.boundingBox);
  const oldBox = boxOrNull(row.oldPrice?.boundingBox);
  if (!priceBox || !oldBox) return null;

  const priceYCenter = priceBox.y + priceBox.height / 2;
  const oldYCenter = oldBox.y + oldBox.height / 2;
  const centerDelta = oldYCenter - priceYCenter;

  // Same-row case: y-centers within tolerance. Decide left/right by
  // x-edge ordering. Overlapping x-edges fall through to the
  // nested-narrow heuristic (Tier R / BACKLOG-49) before abstaining.
  if (Math.abs(centerDelta) <= VERTICAL_OVERLAP_TOLERANCE_PX) {
    if (oldBox.x + oldBox.width <= priceBox.x + HORIZONTAL_OVERLAP_TOLERANCE_PX) return "left";
    if (priceBox.x + priceBox.width <= oldBox.x + HORIZONTAL_OVERLAP_TOLERANCE_PX) return "right";
    // Nested-narrow heuristic. When the oldPrice box is significantly
    // narrower than the price box AND sits inside the price box's
    // horizontal span (e.g. shared left edge x=192 and oldPrice.width=33
    // << price.width=216), the boxes overlap horizontally, so the
    // left/right edge-ordering test above abstains. But the visual
    // layout in such cases is stacked: the narrower box sits ABOVE the
    // wider one in the rendered flow (the probe captured coincident
    // y-centers because the BOXES coincide vertically, not because
    // the GLYPHS do — small boxes inside larger boxes appear above
    // when stacked). Vote "top" deterministically. Risk: a true
    // side-by-side narrow-trailing layout where oldPrice sits flush
    // to the right edge inside the price box would also match — but
    // such layouts are vanishingly rare; the dominant real-world
    // pattern that hits these conditions is stacked-on-top.
    if (
      oldBox.width <= priceBox.width / 2 &&
      oldBox.x >= priceBox.x - HORIZONTAL_OVERLAP_TOLERANCE_PX &&
      oldBox.x + oldBox.width <= priceBox.x + priceBox.width + HORIZONTAL_OVERLAP_TOLERANCE_PX
    ) {
      return "top";
    }
    return null; // overlapping or interleaved — too ambiguous to commit
  }

  // Stacked case: y-centers clearly separated. To commit a stacked
  // vote, the separation has to be on the order of half the combined
  // heights — i.e. the boxes are vertically distinct rather than
  // partially overlapping. The `- tolerance` slack absorbs sub-pixel
  // rounding from getBoundingClientRect when boxes touch exactly.
  const combinedHalfHeights = (oldBox.height + priceBox.height) / 2;
  const stackedSeparationThreshold = Math.max(
    1,
    combinedHalfHeights - VERTICAL_OVERLAP_TOLERANCE_PX,
  );
  if (centerDelta <= -stackedSeparationThreshold) return "top";
  // Unusual layout: old is below current. Defined for completeness but
  // never emitted as a productCard.oldPricePosition value because the
  // downstream template doesn't model "bottom" — abstain instead so the
  // agent can decide.
  return null;
}

// Aggregate per-row votes into a single dominant oldPricePosition. See
// the file header for the full vote / threshold contract.
//
// Options:
//   threshold      - minimum vote share (0..1) required to commit.
//                    Default 0.6 (slightly looser than contentAlign's
//                    0.75 because the geometric signal is less noisy).
//   minVotingRows  - minimum number of rows that must vote before any
//                    value can win. Default 2.
//
// Returns `"top" | "left" | "right" | null`.
export function aggregateOldPricePosition(rows, options = {}) {
  rows = selectableProductRows(rows);
  const threshold = clampThreshold(options.threshold, DEFAULT_OLD_PRICE_POSITION_THRESHOLD);
  const minVotingRows = clampMinRows(options.minVotingRows, DEFAULT_MIN_VOTING_ROWS);
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const tallies = { top: 0, left: 0, right: 0 };
  let votingRows = 0;
  for (const row of rows) {
    const vote = oldPricePositionVoteForRow(row);
    if (!vote || !VALID_VOTES.has(vote)) continue;
    tallies[vote] += 1;
    votingRows += 1;
  }

  if (votingRows < minVotingRows) return null;

  for (const candidate of ["top", "left", "right"]) {
    const share = tallies[candidate] / votingRows;
    if (share >= threshold) return candidate;
  }
  return null;
}

function boxOrNull(value) {
  if (!value || typeof value !== "object") return null;
  const x = numericOrNull(value.x);
  const y = numericOrNull(value.y);
  const width = numericOrNull(value.width);
  const height = numericOrNull(value.height);
  if (x === null || y === null || width === null || height === null) return null;
  return { x, y, width, height };
}

function numericOrNull(value) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function clampThreshold(value, fallback) {
  if (typeof value !== "number" || !Number.isFinite(value)) return fallback;
  if (value <= 0 || value > 1) return fallback;
  return value;
}

function clampMinRows(value, fallback) {
  if (!Number.isInteger(value) || value < 1) return fallback;
  return value;
}

// Mutates `payload.brand.components.productCard[0].oldPricePosition` when
// the aggregator returns a non-null vote. Null vote ⇒ leave the existing
// field untouched so the agent can decide (and
// productCardVariantDecisionDiagnostics still flags missing reasons).
//
// We always pass the FULL productRows array — the aggregator's vote is
// cross-row, not single-row. The LLM extraction agent previously picked
// one representative row and decided based on its geometry alone, which
// drifted between near-identical runs of the same site. The majority
// vote across all candidate rows is the deterministic replacement.
export function applyDerivedOldPricePosition(payload, productRows) {
  const card = payload?.brand?.components?.productCard?.[0];
  if (!card || typeof card !== "object") return;
  const derived = aggregateOldPricePosition(Array.isArray(productRows) ? productRows : []);
  if (derived) card.oldPricePosition = derived;
}

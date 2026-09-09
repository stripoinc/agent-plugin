import { selectableProductRows } from "./product-row-filter.js";
// Deterministic aggregator for `productCard[N].contentAlign`.
//
// Why: the live product-card probe captures `text-align` for the title element
// and the price element of every candidate row. Different card variants on the
// same homepage often disagree (a featured row may center, while the grid
// rows left-align). The downstream `email-generator-v-0` picks between
// source-template card variants based on a single dominant signal. Returning
// the wrong alignment forces the generator to fight the brand evidence;
// returning `null` lets it fall back to a template default. The cost of a
// wrong "left"/"center" is therefore higher than the cost of `null`.
//
// Aggregation rules (intentionally conservative):
//   1. Primary vote: rows where BOTH the title and price expose a usable
//      alignment AND the two agree contribute a primary vote. "Usable" means
//      `"left"` or `"center"`. `"right"`, `null`, or any other value
//      abstains from the primary tally. Right-aligned product copy is rare
//      enough in practice that treating it as evidence would create more
//      noise than it would resolve.
//   2. If the primary tally has ≥`minVotingRows` (default 2) and a candidate
//      clears `threshold` (default 0.75), return that candidate. A primary
//      tally that meets the gate but stays split (no candidate clears
//      threshold) returns `null` — split is genuinely ambiguous, and the
//      start-default fallback below would only paper over it.
//   3. Start-default fallback: when the primary tally is too thin
//      (`votingRows < minVotingRows`), consult rows where BOTH
//      `titleTextAlign` and `priceTextAlign` are exactly the string
//      `"unknown"`. The probe maps the literal CSS `text-align` value
//      through a normalizer that emits `"unknown"` for `"start"`, `"end"`,
//      `"justify"`, `""`, etc. In LTR contexts (the only locales this skill
//      currently targets) `text-align: start` resolves to visually
//      left-aligned content — and `"start"` is the CSS default a title or
//      price element inherits when no rule sets a non-default value
//      anywhere up the cascade. So a row where the title element AND the
//      price element both surface `"unknown"` is real evidence the card is
//      left-aligned by default. The fallback returns `"left"` only when the
//      fallback rows themselves have ≥`minVotingRows` and clear `threshold`
//      as a share of the filtered row set. Rows with `"right"` or `null`
//      are NOT counted here — `null` means the element was missing (no
//      evidence at all), and `"right"` means a real value we should not
//      silently override.
//
// The aggregator is pure: it only inspects the per-row fields the probe
// surfaces (`titleTextAlign`, `priceTextAlign`) and never touches the wider
// row context. That keeps it cheap to test in isolation and easy to reason
// about when a homepage produces an unexpected signal.

const VALID_VOTES = new Set(["left", "center"]);

export const DEFAULT_CONTENT_ALIGN_THRESHOLD = 0.75;
export const DEFAULT_MIN_VOTING_ROWS = 2;

// Pull the per-row alignment vote, returning either "left"/"center" when the
// row has matching title+price alignment, or null when the row abstains.
export function contentAlignVoteForRow(row) {
  if (!row || typeof row !== "object") return null;
  const titleAlign = normalizeAlignSignal(row.titleTextAlign);
  const priceAlign = normalizeAlignSignal(row.priceTextAlign);
  if (!titleAlign || !priceAlign) return null;
  if (titleAlign !== priceAlign) return null;
  return titleAlign;
}

// True when the row's title and price both surfaced the literal probe value
// `"unknown"`. The probe's `normalizedAlignment` mapper emits `"unknown"`
// for any computed `text-align` that isn't `"left"`, `"center"`, or
// `"right"` — most commonly `"start"`, the CSS default an unstyled title or
// price inherits from the document. In LTR locales `"start"` is visually
// left-aligned, so a row in this state is real evidence the card is
// left-aligned by default. We require BOTH sides to be `"unknown"` (rather
// than one unknown and one missing) so the fallback only fires on rows
// where the probe actually located both elements but both inherited the
// cascade default.
export function rowSuggestsStartDefault(row) {
  if (!row || typeof row !== "object") return false;
  const title = typeof row.titleTextAlign === "string" ? row.titleTextAlign.trim().toLowerCase() : null;
  const price = typeof row.priceTextAlign === "string" ? row.priceTextAlign.trim().toLowerCase() : null;
  return title === "unknown" && price === "unknown";
}

// Aggregate per-row alignment votes into a single dominant signal.
//
// Options:
//   threshold       - minimum vote share (0..1) required to commit. Default 0.75.
//   minVotingRows   - minimum number of rows that must contribute a vote
//                     before any value can win. Default 2.
//
// Returns `"left" | "center" | null`. `null` is the safe fallback whenever
// the evidence is too thin, mixed, or otherwise inconclusive.
export function aggregateContentAlign(rows, options = {}) {
  rows = selectableProductRows(rows);
  const threshold = clampThreshold(options.threshold, DEFAULT_CONTENT_ALIGN_THRESHOLD);
  const minVotingRows = clampMinRows(options.minVotingRows, DEFAULT_MIN_VOTING_ROWS);
  if (!Array.isArray(rows) || rows.length === 0) return null;

  const tallies = { left: 0, center: 0 };
  let votingRows = 0;
  let startDefaultRows = 0;
  for (const row of rows) {
    const vote = contentAlignVoteForRow(row);
    if (vote) {
      tallies[vote] += 1;
      votingRows += 1;
      continue;
    }
    if (rowSuggestsStartDefault(row)) startDefaultRows += 1;
  }

  if (votingRows >= minVotingRows) {
    for (const candidate of ["left", "center"]) {
      const share = tallies[candidate] / votingRows;
      if (share >= threshold) return candidate;
    }
    // Primary tally met the gate but stayed split — return null rather than
    // letting the start-default fallback paper over a genuinely ambiguous
    // signal. Real left/center evidence is more trustworthy than a
    // cascade-default inference.
    return null;
  }

  // Primary tally too thin to commit. Fall back to the `text-align: start`
  // default signal: when most filtered rows surface `"unknown"` on both
  // title and price, the likeliest explanation is that no rule sets a
  // non-default text-align anywhere up the cascade — which in LTR locales
  // means left-aligned content.
  if (startDefaultRows < minVotingRows) return null;
  const startShare = startDefaultRows / rows.length;
  if (startShare >= threshold) return "left";
  return null;
}

function normalizeAlignSignal(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().toLowerCase();
  if (!trimmed) return null;
  if (VALID_VOTES.has(trimmed)) return trimmed;
  return null;
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

// Mutates `payload.brand.components.productCard[0].contentAlign` when
// the cross-row aggregator returns a non-null vote. Null vote ⇒ leave
// the existing field untouched so the agent can decide.
//
// We always pass the FULL productRows array — the aggregator's vote is
// cross-row, not single-row. The LLM extraction agent previously
// inspected one representative row and decided based on its title/price
// alignment alone, which drifted between near-identical runs of the
// same site (the same product page produced different alignment picks
// on back-to-back invocations). The majority vote across all candidate
// rows is the deterministic replacement, mirroring the
// applyDerivedOldPricePosition wrapper.
//
// Returns `true` when a write happened, `false` otherwise. The boolean
// is useful for diagnostic logging but no caller currently consumes it.
export function applyDerivedContentAlign(payload, productRows) {
  const card = payload?.brand?.components?.productCard?.[0];
  if (!card || typeof card !== "object") return false;
  const derived = aggregateContentAlign(Array.isArray(productRows) ? productRows : []);
  if (!derived) return false;
  card.contentAlign = derived;
  return true;
}

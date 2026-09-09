// Pure helpers for selecting the best old-price evidence within a product
// card and computing scoring signals around it.
//
// Background. The browser-context probe in `lib.js` walks each card's DOM
// looking for two sibling pieces of evidence: the current price and the old
// (struck-through) price. When the explicit `oldPriceSelectors` list misses,
// the walker falls back to a heuristic (`oldPriceEvidenceFor(...).isOld`) that climbs
// up to three ancestors looking for a `text-decoration: line-through` style
// or an `<s>/<del>/<strike>` tag. On Tailwind-style sites where the
// strikethrough is applied to a leaf `<span class="line-through">`, the
// heuristic correctly fires — but the candidate-selection step that follows
// can still pick a wrapper whose text contains `"299 ₴ -40%"` instead of
// the leaf's clean `"299 ₴"`. The wrapper inherits `line-through` only as
// a cascade rule, so its computed `textDecoration` is `"none"`, the
// captured colour is the wrapper's body colour rather than the strikethrough
// span's actual colour, and the recorded price text is mashed with sibling
// content (typically a discount badge).
//
// `selectBestOldPriceCandidate` and `computeOldPriceEvidenceQuality` codify
// the preference rules. `computePriceLooksMergedLike` and
// `computeRepresentativeScore` are the scoring counterparts: the merged-like
// flag now requires BOTH prices to look noisy (so a clean strikethrough +
// adjacent merged-current-price row isn't punished), and the
// representative-score gets a +6 boost when old-price evidence was captured
// directly on the leaf element.
//
// The functions are pure on plain data shapes so they can be unit-tested
// without a browser. The browser-context probe in `lib.js` mirrors the
// logic inline because it needs live DOM access; this file is the source
// of truth for the rules and the unit-test surface.

/**
 * Candidate shape (plain data — no DOM):
 *   {
 *     text: string,                            // visible text after compaction
 *     source: "explicit-old-selector" | "heuristic-text" | ...,
 *     score: number,                           // priceCandidateFromElement score
 *     isOld: boolean,                          // oldPriceEvidenceFor(...).isOld
 *     priceCount: number,                      // priceMatches(text).length
 *     hasDirectLineThrough: boolean,           // text-decoration[-line]: line-through
 *                                              // computed DIRECTLY on the element
 *     hasDirectStrikeTag: boolean,             // tag is <s>/<del>/<strike>
 *     hasAncestorLineThrough: boolean,         // line-through inherited from
 *                                              // an ancestor (cascade) — may be
 *                                              // tag-based or decoration-based
 *   }
 */

/**
 * Picks the most-specific old-price candidate from a list of candidates that
 * have already been flagged as `isOld`.
 *
 * Preference order:
 *   1. Direct line-through evidence (`hasDirectLineThrough` or
 *      `hasDirectStrikeTag`) AND `priceCount === 1` AND shorter text wins.
 *      A leaf `<span class="line-through">299 ₴</span>` beats a wrapper
 *      `<div class="strikethrough-row">299 ₴ -40%</div>` because the leaf
 *      has the strikethrough rule on it directly and contains exactly one
 *      price token.
 *   2. Direct line-through evidence (regardless of priceCount) wins over
 *      ancestor-only evidence — the leaf is the right node even if its text
 *      somehow contains a stray secondary number.
 *   3. Among equal-evidence candidates, prefer single-price texts over
 *      multi-price.
 *   4. Tiebreaker: shorter text.
 *   5. Tiebreaker: higher score (existing priceCandidateFromElement metric).
 *
 * Returns `null` if `candidates` is empty.
 */
export function selectBestOldPriceCandidate(candidates) {
  if (!Array.isArray(candidates) || candidates.length === 0) return null;
  const oldOnly = candidates.filter((c) => c && c.isOld);
  if (oldOnly.length === 0) return null;
  if (oldOnly.length === 1) return oldOnly[0];

  const sorted = [...oldOnly].sort(compareOldPriceCandidates);
  return sorted[0];
}

/**
 * Comparator returning negative when `a` is preferable to `b`. Pure data
 * comparison — used by `selectBestOldPriceCandidate` and exposed for tests.
 */
export function compareOldPriceCandidates(a, b) {
  // Tier 1: direct evidence + single price wins.
  const aDirectClean = isDirectAndSinglePrice(a);
  const bDirectClean = isDirectAndSinglePrice(b);
  if (aDirectClean !== bDirectClean) return aDirectClean ? -1 : 1;
  if (aDirectClean && bDirectClean) {
    // Both direct + single price — prefer shorter text (leaf span vs wrapper).
    const aLen = (a.text || "").length;
    const bLen = (b.text || "").length;
    if (aLen !== bLen) return aLen - bLen;
    return (b.score || 0) - (a.score || 0);
  }

  // Tier 2: any direct evidence wins over ancestor-only.
  const aDirect = hasDirectEvidence(a);
  const bDirect = hasDirectEvidence(b);
  if (aDirect !== bDirect) return aDirect ? -1 : 1;

  // Tier 3: prefer single-price texts.
  const aSingle = (a.priceCount || 0) === 1;
  const bSingle = (b.priceCount || 0) === 1;
  if (aSingle !== bSingle) return aSingle ? -1 : 1;

  // Tier 4: shorter text — wrappers are longer than leaf spans.
  const aLen = (a.text || "").length;
  const bLen = (b.text || "").length;
  if (aLen !== bLen) return aLen - bLen;

  // Tier 5: higher score.
  return (b.score || 0) - (a.score || 0);
}

function isDirectAndSinglePrice(candidate) {
  return hasDirectEvidence(candidate) && (candidate.priceCount || 0) === 1;
}

function hasDirectEvidence(candidate) {
  return Boolean(candidate && (candidate.hasDirectLineThrough || candidate.hasDirectStrikeTag));
}

/**
 * Returns one of `"direct"`, `"wrapper"`, `"none"` describing the strength
 * of the strikethrough evidence captured on a candidate. `"direct"` means
 * the strikethrough is applied to the leaf element itself (best signal).
 * `"wrapper"` means it inherits from an ancestor cascade. `"none"` means
 * we have no strikethrough evidence (probably a class-name-only match).
 *
 * Used downstream by the representative-score boost and by callers wanting
 * to expose the quality on the row's selectionSignals.
 */
export function computeOldPriceEvidenceQuality(candidate) {
  if (!candidate) return "none";
  if (hasDirectEvidence(candidate)) return "direct";
  if (candidate.hasAncestorLineThrough) return "wrapper";
  return "none";
}

/**
 * Decides whether a card's price+oldPrice texts look like a single merged
 * blob (e.g. wrapper that grabbed both the strikethrough span and the
 * discount badge). Only true when BOTH fields show noise — when the
 * strikethrough span is direct and clean, this stays false even if the
 * paired current-price field is weird, so cards with at least one piece
 * of clean evidence aren't penalised.
 *
 * The previous behaviour (true when EITHER side looked noisy) created
 * a ratchet on Tailwind-style sites: every discount card had a wrappery
 * price evidence row, every discount card got the merged-like flag, every
 * discount card lost 8 points, and `productCard[0]` always landed on a
 * non-discount card.
 *
 * Inputs:
 *   - priceText / oldPriceText: the captured texts (may be empty strings).
 *   - priceNumberCount / oldPriceNumberCount: countNumberTokens result.
 *
 * Returns boolean.
 */
export function computePriceLooksMergedLike({
  priceText = "",
  oldPriceText = "",
  priceNumberCount = 0,
  oldPriceNumberCount = 0,
} = {}) {
  const priceNoisy = looksNoisy(priceText, priceNumberCount);
  const oldNoisy = looksNoisy(oldPriceText, oldPriceNumberCount);

  // Equal current+old text is a merged-blob signal regardless of noise on
  // either side — the walker resolved both fields to the same wrapper.
  if (priceText && oldPriceText && priceText === oldPriceText) return true;

  // Otherwise, only fire when BOTH sides look noisy. A clean strikethrough
  // (`oldPriceText = "299 ₴"`) paired with a merged current-price row should
  // be allowed to score on its old-price evidence merits.
  if (!priceText && !oldPriceText) return false;
  if (priceText && oldPriceText) return priceNoisy && oldNoisy;
  if (priceText) return priceNoisy;
  return oldNoisy;
}

function looksNoisy(text, numberCount) {
  if (!text) return false;
  if ((numberCount || 0) >= 2) return true;
  if (text.length > 32) return true;
  if (text.includes("\n")) return true;
  // Discount-badge-shaped text alongside the price ("-40%", "-50%", "−25%").
  if (/-\s*\d{1,3}\s*%/.test(text)) return true;
  return false;
}

/**
 * Computes the representative-row score from selection signals.
 *
 * The 2026-05-10 update introduces:
 *   - +6 when `oldPriceEvidenceQuality === "direct"` (signals.cleanOldPriceEvidence)
 *     to reward rows whose old-price was captured on the leaf element.
 *   - The existing `-8` when `priceLooksMergedLike` is true (kept; the flag
 *     itself is now narrower thanks to `computePriceLooksMergedLike`).
 *
 * The boost size is chosen to roughly cancel the merged-like penalty on
 * sites where SOME rows have clean strikethrough evidence and OTHERS don't,
 * so the discount cards don't get systematically demoted.
 */
export function computeRepresentativeScore(signals = {}, selectorScore = 0) {
  const {
    hasCurrentPrice = false,
    hasOldPrice = false,
    hasTitle = false,
    hasImage = false,
    hasGridSiblings = false,
    hasCta = false,
    ctaLooksPurchaseLike = false,
    ctaHasUsableVisibleText = false,
    hasProductUrl = false,
    homepageCtaNotReusableAsText = false,
    ctaLooksNonPurchaseLike = false,
    looksWrapperLike = false,
    priceLooksMergedLike = false,
    cleanOldPriceEvidence = false,
  } = signals;
  return (
    (hasCurrentPrice ? 6 : 0) +
    (hasOldPrice ? 1 : 0) +
    (hasTitle ? 5 : 0) +
    (hasImage ? 3 : 0) +
    (hasGridSiblings ? 4 : 0) +
    (hasCta ? 7 : 0) +
    (ctaLooksPurchaseLike ? 8 : 0) +
    (ctaHasUsableVisibleText ? 3 : 0) +
    (hasProductUrl ? 3 : 0) +
    (homepageCtaNotReusableAsText ? 2 : 0) +
    (cleanOldPriceEvidence ? 6 : 0) +
    (selectorScore || 0) -
    (ctaLooksNonPurchaseLike ? 10 : 0) -
    (looksWrapperLike ? 12 : 0) -
    (priceLooksMergedLike ? 8 : 0)
  );
}

// Synthesise `header-background` / `footer-background` /
// `promo-surface-background` usageHints onto
// `brand.colors.backgroundColors[]` from `background-styles.json` probe
// evidence. Companion to `preEmitBrandColours` for the canvas channel
// and to `synthesizeTextColorRoles` for the textColors channel — same
// "deterministic seed → agent confirms" posture.
//
// Why this exists: the agent's pre-tagging contract (SKILL.md) covers
// `canvas-background` via `rankCanvasBackgroundCandidates`, but
// header/footer background hints are left for the agent to author. In
// practice the agent regularly forgets one or both, and the downstream
// customise pipeline ends up rendering on a guessed neutral surface
// instead of the brand's real header/footer treatment. The probe rows
// already carry the evidence — `roleHint` or a clean tag selector
// identifies the region — so the synthesis is deterministic.
//
// Matching rules per row:
//   - header: `roleHint === "header"` OR `roleHint === "banner"` (ARIA)
//     OR `selector` matches /^header(\s|>|\[|\.|:|$)/ (raw selector)
//   - footer: `roleHint === "footer"` OR `roleHint === "contentinfo"`
//     (ARIA) OR `selector` matches /^footer(\s|>|\[|\.|:|$)/
//   - promo: `roleHint === "promo"` only (no selector layering — the
//     planning-time fleet scan for `[class*="promo"]` / `banner` /
//     `hero` returned zero matches, so the helper would carry code
//     paths with no fixture coverage). On top of the coverage gate the
//     promo channel adds a saturation gate (`MIN_PROMO_SATURATION`) to
//     reject near-neutral surfaces — promo surfaces are chromatic by
//     definition.
//
// The selector regex catches the raw `header` / `footer` tag plus
// descendant / attribute / class selectors anchored at the tag
// (`header.dark`, `header > nav`, `header[role='banner']`). A leading
// match of `header` followed by a non-word character avoids false
// positives like `header-utility` (which is a class, not a tag, and
// wouldn't appear as the selector root anyway, but the regex makes the
// intent explicit).
//
// Skip rows whose `backgroundColor` normalizes to empty
// (transparent / CSS-var resolved to "") — those are not visible
// surfaces and can't carry a colour hint.
//
// Bucket matching rows by `lowerHex(backgroundColor)`; sum
// `viewportCoverage` per bucket. Winning hex per region is the one
// with the highest summed coverage. Confidence gate: skip the region
// if summed coverage < 0.05 — that's the same threshold the canvas
// ranker uses to reject thin evidence (a 5%-or-less of viewport
// header surface is likely noise, e.g. a sticky utility strip that
// isn't the real header).
//
// Emit on `brand.colors.backgroundColors[]` (BACKLOG item 9: prior
// "mirrors addIfAbsent" wording drifted from actual mutation
// semantics — addIfAbsent appends a fresh row; here we mutate an
// existing row in place):
//   - If an existing `backgroundColors[]` row's `value` matches the
//     winning hex, append the hint to its `usageHints` in place
//     (hints accumulated on one row per hex; idempotent via the
//     `includes` check in `appendHintIfAbsent`).
//   - Else append a new row carrying just the hint.
//
// Idempotent: running twice produces no duplicate rows and no
// duplicate hints. Safe to call in both scaffold AND normalize (per
// Tier-F decision 1) so the normalize pass re-asserts the hints if
// the agent dropped them.

// Landmark-band fallback (header / footer only): when EVERY landmark
// row for a region carries an empty `backgroundColor` the region has no
// colour of its own to rank, and `pickRegionHex` returns null — the
// role stays a gap even though a full-width painted surface sits inside
// the landmark's own rectangle (a `<header>` that is transparent while
// an inner `div` paints the brand band). `pickLandmarkBandHex` reads
// that surface GEOMETRICALLY: no colour assumption, no `roleHint:
// "navigation"` shortcut (nav rows are routinely narrow sub-blocks, and
// on some sites the nav is the promo strip rather than the header
// surface). It runs ONLY when `pickRegionHex` returned null for that
// region, so it can never overwrite or contradict a ranked pick — the
// helper stays strictly additive.
//
// Thresholds and the 50-dir sweep behind them live in
// `coverage-constants.js` (`REGION_BAND_*`).

import { markScaffoldSynthesised } from "./provenance-marker.js";
import {
  MIN_REGION_COVERAGE,
  MIN_PROMO_SATURATION,
  REGION_BAND_MIN_HEIGHT_PX,
  REGION_BAND_MIN_COVER_RATIO,
  REGION_BAND_FULL_WIDTH_RATIO,
  REGION_BAND_TOLERANCE_PX,
} from "./coverage-constants.js";
import { hexSaturation } from "./colour.js";

const HEADER_HINT = "header-background";
const FOOTER_HINT = "footer-background";
const PROMO_HINT = "promo-surface-background";

const HEADER_SELECTOR_RE = /^header(\s|>|\[|\.|:|$)/;
const FOOTER_SELECTOR_RE = /^footer(\s|>|\[|\.|:|$)/;

function lowerHex(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

function isHeaderRow(row) {
  if (!row || typeof row !== "object") return false;
  const roleHint = typeof row.roleHint === "string" ? row.roleHint.toLowerCase() : "";
  if (roleHint === "header" || roleHint === "banner") return true;
  const selector = typeof row.selector === "string" ? row.selector.trim() : "";
  return Boolean(selector) && HEADER_SELECTOR_RE.test(selector);
}

function isFooterRow(row) {
  if (!row || typeof row !== "object") return false;
  const roleHint = typeof row.roleHint === "string" ? row.roleHint.toLowerCase() : "";
  if (roleHint === "footer" || roleHint === "contentinfo") return true;
  const selector = typeof row.selector === "string" ? row.selector.trim() : "";
  return Boolean(selector) && FOOTER_SELECTOR_RE.test(selector);
}

// Promo-row recognition: roleHint-only on purpose. A planning-time fleet
// scan of `[class*="promo"]` / `[class*="banner"]` / `[class*="hero"]`
// selectors returned zero matches; layering those selectors here would
// add code paths with no fixture coverage. The roleHint reflects an
// ARIA / data-role attribution the probe already trusts, so this stays
// the single source.
function isPromoRow(row) {
  if (!row || typeof row !== "object") return false;
  return String(row.roleHint ?? "").toLowerCase() === "promo";
}

function ensureArray(target, key) {
  if (!Array.isArray(target[key])) target[key] = [];
}

// A promo surface is chromatic by definition, so the promo caller admits only
// hexes at or above `MIN_PROMO_SATURATION`. The filter is per HEX, not per
// summed coverage, so a near-neutral hex with most of the coverage cannot
// shadow a saturated one — a near-grey winner would defeat the purpose of
// synthesising `promo-surface-background` at all.
function promoHexIsChromatic(hex) {
  return hexSaturation(hex) >= MIN_PROMO_SATURATION;
}

// Pick the hex with the highest summed `viewportCoverage` across the
// matching rows. Returns `null` when no row contributes a non-empty
// hex or when the summed coverage of the winner is below the
// confidence gate (`MIN_REGION_COVERAGE`).
//
// `admits` is an optional per-hex filter applied BEFORE any coverage is
// summed. The promo variant used to be a second copy of this function that
// differed by exactly that one line, which is a second answer waiting to
// drift — the same reason `pickRegionBand` below serves two callers.
function pickRegionHex(rows, admits = null) {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const totals = new Map();
  const firstSeen = new Map();
  rows.forEach((row, index) => {
    const hex = lowerHex(row?.backgroundColor);
    if (!hex) return;
    if (admits && !admits(hex)) return;
    const cov = Number(row?.viewportCoverage);
    const safeCov = Number.isFinite(cov) ? cov : 0;
    totals.set(hex, (totals.get(hex) || 0) + safeCov);
    if (!firstSeen.has(hex)) firstSeen.set(hex, index);
  });
  if (totals.size === 0) return null;
  let winner = null;
  let winnerTotal = -Infinity;
  let winnerFirstSeen = Number.POSITIVE_INFINITY;
  for (const [hex, total] of totals) {
    if (total > winnerTotal) {
      winner = hex;
      winnerTotal = total;
      winnerFirstSeen = firstSeen.get(hex);
      continue;
    }
    if (total === winnerTotal) {
      const seen = firstSeen.get(hex);
      if (seen < winnerFirstSeen) {
        winner = hex;
        winnerFirstSeen = seen;
      }
    }
  }
  if (winner === null || winnerTotal < MIN_REGION_COVERAGE) return null;
  return { hex: winner, coverage: winnerTotal };
}

// --------------------------------------------------------------------
// Landmark-band fallback helpers.
// --------------------------------------------------------------------

// Normalised `{x, y, width, height}` for a probe row, or null when the
// row carries no usable rectangle. `x` is optional (only y/height/width
// participate in the predicate); a missing `x` reads as 0.
function rectOf(row) {
  const rect = row?.rect;
  if (!rect || typeof rect !== "object") return null;
  const y = Number(rect.y);
  const width = Number(rect.width);
  const height = Number(rect.height);
  if (!Number.isFinite(y) || !Number.isFinite(width) || !Number.isFinite(height)) return null;
  const x = Number(rect.x);
  return { x: Number.isFinite(x) ? x : 0, y, width, height };
}

// Page width used by the full-bleed term: the `body` / `roleHint:
// "page"` row's width when it has one, else the widest rect in the
// capture. Returns 0 when nothing carries a rect (the caller then
// refuses).
function pageWidth(rows) {
  const pageRow = rows.find((row) => {
    const selector = typeof row?.selector === "string" ? row.selector.trim().toLowerCase() : "";
    const roleHint = typeof row?.roleHint === "string" ? row.roleHint.toLowerCase() : "";
    return selector === "body" || roleHint === "page";
  });
  const pageRect = pageRow ? rectOf(pageRow) : null;
  if (pageRect && pageRect.width > 0) return pageRect.width;
  let widest = 0;
  for (const row of rows) {
    const rect = rectOf(row);
    if (rect && rect.width > widest) widest = rect.width;
  }
  return widest;
}

// Geometric fallback for a region whose landmark rows carry no colour.
//
// `regionRows` are the landmark rows for this region, `allRows` the
// whole capture, `isRegionRow` the region's matcher (so the landmark
// rows themselves are never their own candidates).
//
// Fires only when: at least one landmark row exists, EVERY landmark row
// has an empty `backgroundColor` (a landmark that paints anything is
// `pickRegionHex`'s business, not this one), and at least one landmark
// row carries a rect. The band is the union `[y0, y1]` of the landmark
// rects and must be at least `REGION_BAND_MIN_HEIGHT_PX` tall.
//
// A candidate is a non-landmark row with a non-empty hex whose rect is
// full-bleed (`≥ REGION_BAND_FULL_WIDTH_RATIO` of the page width),
// covers at least `REGION_BAND_MIN_COVER_RATIO` of the band's height
// (and at least `REGION_BAND_MIN_HEIGHT_PX` outright), and lies inside
// the band within `REGION_BAND_TOLERANCE_PX` at both edges. The winner
// is the largest painted area; ties keep capture (document) order.
//
// Returns `{ hex, band: [y0, y1], rect }` or null.
function pickLandmarkBandHex(regionRows, allRows, isRegionRow) {
  if (!Array.isArray(regionRows) || regionRows.length === 0) return null;
  if (regionRows.some((row) => lowerHex(row?.backgroundColor))) return null;
  const bandRects = regionRows.map(rectOf).filter(Boolean);
  if (bandRects.length === 0) return null;
  const y0 = Math.min(...bandRects.map((rect) => rect.y));
  const y1 = Math.max(...bandRects.map((rect) => rect.y + rect.height));
  const bandHeight = y1 - y0;
  if (bandHeight < REGION_BAND_MIN_HEIGHT_PX) return null;

  const width = pageWidth(allRows);
  if (!(width > 0)) return null;
  const minWidth = REGION_BAND_FULL_WIDTH_RATIO * width;
  const minHeight = Math.max(REGION_BAND_MIN_HEIGHT_PX, REGION_BAND_MIN_COVER_RATIO * bandHeight);

  let winnerHex = null;
  let winnerRect = null;
  let winnerArea = -Infinity;
  for (const row of allRows) {
    if (isRegionRow(row)) continue;
    const hex = lowerHex(row?.backgroundColor);
    if (!hex) continue;
    const rect = rectOf(row);
    if (!rect) continue;
    if (rect.width < minWidth) continue;
    if (rect.height < minHeight) continue;
    if (rect.y < y0 - REGION_BAND_TOLERANCE_PX) continue;
    if (rect.y + rect.height > y1 + REGION_BAND_TOLERANCE_PX) continue;
    const area = rect.width * rect.height;
    // Strict `>` keeps the first row in capture order on an area tie.
    if (area > winnerArea) {
      winnerHex = hex;
      winnerRect = rect;
      winnerArea = area;
    }
  }
  if (winnerHex === null) return null;
  return { hex: winnerHex, band: [y0, y1], rect: winnerRect };
}

function appendHintIfAbsent(row, hint) {
  if (!row || typeof row !== "object") return false;
  const hints = Array.isArray(row.usageHints) ? row.usageHints : [];
  if (hints.includes(hint)) return false;
  row.usageHints = [...hints, hint];
  return true;
}

// `landmarkBand` is `{ band, rect }` when the hex came from the
// geometric fallback rather than the coverage ranker; it renames the
// diagnostic action (so the two producers stay distinguishable in a
// replay diff) and carries the geometry that justified the pick.
function emitRegion(colors, hint, hex, diagnostics, landmarkBand = null) {
  const targetKey = lowerHex(hex);
  if (!targetKey) return;
  const geometry = landmarkBand ? { band: landmarkBand.band, rect: landmarkBand.rect } : {};
  for (const [index, row] of colors.backgroundColors.entries()) {
    if (!row || typeof row !== "object") continue;
    if (lowerHex(row.value) !== targetKey) continue;
    const appended = appendHintIfAbsent(row, hint);
    if (appended) {
      diagnostics.push({
        severity: "info",
        path: `$.brand.colors.backgroundColors[${index}].usageHints`,
        action: landmarkBand ? "appended-hint-landmark-band" : "appended-hint",
        hint,
        value: row.value,
        ...geometry,
      });
    }
    return;
  }
  const newRow = markScaffoldSynthesised({
    value: hex,
    description: `Auto-tagged ${hint.split("-")[0]} background from probe evidence.`,
    usageHints: [hint],
  });
  const newIndex = colors.backgroundColors.length;
  colors.backgroundColors.push(newRow);
  diagnostics.push({
    severity: "info",
    path: `$.brand.colors.backgroundColors[${newIndex}]`,
    action: landmarkBand ? "appended-row-landmark-band" : "appended-row",
    hint,
    value: hex,
    ...geometry,
  });
}

// Mutates `payload.brand.colors.backgroundColors[]` in place. Idempotent.
// Safe with missing / empty / non-array inputs — no-ops without throwing
// (mirrors `preEmitBrandColours`'s defensive posture).
// THE ONE DERIVATION OF A REGION'S BAND, and it has two callers.
//
// This function answers "which hex is this page's header / footer band?" from
// `background-styles.json`: the coverage-ranked pick, else the geometric
// landmark-band fallback. `synthesizeRegionBgHints` below writes the answer
// into the kit; `header-link-backfill.js` READS it, because it runs earlier in
// normalize than this synthesis does and would otherwise be blind to a band
// the very next step is about to publish. Measured on the 50-dir replay
// corpus: 5 dirs name a region background only after this synthesis, and on
// those the link guard saw no band at all -- including a brand-green header
// whose white links it is the guard's whole job to judge.
//
// Two callers, one function, for the same reason `pickDominantColor` serves
// both the text-colour producer and the gate that grades it: a copied
// predicate is a second answer waiting to drift.
function pickRegionBand(rows, backgroundStyles, test) {
  const pick = pickRegionHex(rows);
  if (pick) return { hex: pick.hex, band: null };
  const band = pickLandmarkBandHex(rows, backgroundStyles, test);
  return band ? { hex: band.hex, band } : null;
}

export function regionBackgroundHex(backgroundStyles, region) {
  if (!Array.isArray(backgroundStyles) || backgroundStyles.length === 0) return null;
  const test = region === "header" ? isHeaderRow : region === "footer" ? isFooterRow : null;
  if (!test) return null;
  const picked = pickRegionBand(backgroundStyles.filter(test), backgroundStyles, test);
  return picked ? picked.hex : null;
}

export function synthesizeRegionBgHints(payload, backgroundStyles, diagnostics = []) {
  const colors = payload?.brand?.colors;
  if (!colors || typeof colors !== "object") return;
  ensureArray(colors, "backgroundColors");
  if (!Array.isArray(backgroundStyles) || backgroundStyles.length === 0) return;

  const headerRows = backgroundStyles.filter(isHeaderRow);
  const footerRows = backgroundStyles.filter(isFooterRow);
  const promoRows = backgroundStyles.filter(isPromoRow);

  const headerPicked = pickRegionBand(headerRows, backgroundStyles, isHeaderRow);
  if (headerPicked) {
    emitRegion(colors, HEADER_HINT, headerPicked.hex, diagnostics, headerPicked.band ?? undefined);
  }

  const footerPicked = pickRegionBand(footerRows, backgroundStyles, isFooterRow);
  if (footerPicked) {
    emitRegion(colors, FOOTER_HINT, footerPicked.hex, diagnostics, footerPicked.band ?? undefined);
  }

  // BACKLOG item 13. At planning time zero fleet fixtures qualify
  // (saturation>=0.4 AND summed coverage>=0.05) so this emits nothing
  // on the current fleet — the user explicitly preferred missing over
  // false positives.
  const promoPick = pickRegionHex(promoRows, promoHexIsChromatic);
  if (promoPick) emitRegion(colors, PROMO_HINT, promoPick.hex, diagnostics);
}

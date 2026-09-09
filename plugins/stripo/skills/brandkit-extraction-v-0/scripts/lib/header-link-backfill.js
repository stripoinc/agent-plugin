// Inverse-direction safety net for `header-link` / `footer-link` color usage
// hints — when scoped probe evidence DOES exist for a textColors entry but
// the agent forgot to tag the hint.
//
// Why: this is the mirror image of `applyHeaderLinkStrip`. That helper
// removes header-link / footer-link hints when a color has no scoped evidence
// (false-positive tag). This helper APPENDS a missing hint when the scoped
// evidence is present (false-negative omission). Originally surfaced as a
// regression where the extraction agent's outputs drifted on this axis —
// colors that had genuine `header a` / `nav a` evidence in
// text-styles.json showed up in `textColors[]` without the `header-link`
// hint, leaving downstream customise to fall back on a neutral default
// and lose the brand's actual nav link color.
//
// Gate (mirrors header-link-strip.js):
//   - The header gate is active when text-styles.json contains at least one
//     row with a header-scoped selector (`header a`, `[role='banner'] a`,
//     `nav a`, `[role='navigation'] a`). The footer gate uses
//     `footer a` / `[role='contentinfo'] a`.
//   - Each region's gate is checked independently.
//   - When the gate is inactive (no scoped rows at all on this page),
//     this helper does NOTHING — the scoped-evidence signal is silent.
//
// Conservative posture:
//   - Append-only. Never re-order, never remove other hints.
//   - One carrier per unresolved region may be created when scoped rendered
//     links and a known band yield a legible winner, or the canvas tiebreak
//     yields its supported header winner. Existing carriers are reused.
//     Region presence alone is insufficient; unknown surfaces stay unresolved.
//   - Idempotent: if the hint is already present, no-op.
//   - One diagnostic per (color, hint) pair appended, mirroring the strip
//     helper's shape.
//
// BACKLOG item 31 — Header-link contrast tiebreak.
//   When the header region contains multiple scoped `header a` colors and
//   the frequency-winner is white (#ffffff), the legacy backfill would
//   tag white as `header-link` even when the white text actually sits on
//   a brand-colored catalog navbar (not the literal canvas band). For
//   the class of sites with a full-width brand-coloured navbar BELOW the
//   utility-bar nav, white catalog-navbar links can outnumber the utility
//   nav's dark links by raw frequency. White IS observed in `header a`
//   rows, but rendering it against the LIGHT canvas background fails
//   contrast guards downstream and the customise pipeline ends up flipping
//   the link text colour silently.
//
//   `pickHeaderLinkColor` resolves this tie at backfill time using the
//   canvas-background hex as context: when canvas is light AND a non-white
//   `header a` color exists with enough scoped-row count AND that
//   non-white color clears WCAG 4.5:1 against canvas, prefer the dark
//   colour. Otherwise fall back to current frequency-based behaviour
//   (tag every header-scoped color that maps to a textColors row).

import { contrastRatio, relativeLuminance, EMAIL_MIN_CONTRAST } from "./wcag-contrast.js";
import { normalizeHexForCompare } from "./header-link-strip.js";
import { markScaffoldSynthesised } from "./provenance-marker.js";
import { regionBackgroundHex } from "./region-bg-hints.js";

const HEADER_LINK_HINT = "header-link";
const FOOTER_LINK_HINT = "footer-link";
const HEADER_BG_HINT = "header-background";
const FOOTER_BG_HINT = "footer-background";

const HEADER_SCOPED_SELECTORS = new Set([
  "header a",
  "[role='banner'] a",
  "nav a",
  "[role='navigation'] a",
]);

const FOOTER_SCOPED_SELECTORS = new Set([
  "footer a",
  "[role='contentinfo'] a",
]);

// Lightness gate used by `pickHeaderLinkColor`. WCAG-style relative
// luminance threshold above which the canvas counts as a "light surface"
// that turns white-on-canvas into an unreadable contrast failure. The
// value is conservative: 0.7 captures pure-white and very-light grey
// canvases (`#f2f2f2` ≈ 0.879, `#fafafa` ≈ 0.944) without sweeping in
// mid-grey backgrounds where white-on-grey may still render legibly.
const LIGHT_CANVAS_LUMINANCE = 0.7;

// Frequency floor used by `pickHeaderLinkColor`. The non-white candidate
// must appear in at least this fraction of the white-winner's `header a`
// rows for the tiebreak to fire. 0.25 means "the alternative needs at
// least one quarter as many occurrences as the white winner" — enough to
// be a substantive secondary signal, not a single straggler.
const HEADER_LINK_ALT_COUNT_RATIO = 0.25;

// WCAG body-text minimum contrast ratio used by `pickHeaderLinkColor`.
// 4.5:1 is the AA threshold for normal-weight body copy; header links
// are commonly rendered at small body size so we hold them to the same
// gate rather than the looser large-text 3:1.
const HEADER_LINK_MIN_CONTRAST = 4.5;

// The floor RULE 2 holds a region link colour to, against that region's own
// band. It is `EMAIL_MIN_CONTRAST` and nothing else: `synthesizeFooterTextRole`
// already answers the identical question for `footer-text` -- "white is
// admissible where the surface is KNOWN, and then the rule is the pair test" --
// at that constant, and a second number for the sibling roles would be a
// second answer. Aliased rather than used inline so the file names what it
// holds itself to, and so the floor is one line to move.
//
// WHY NOT A THRESHOLD ON THE BACKGROUND'S LIGHTNESS. An earlier revision asked
// "is this band light?" (luminance >= 0.7) and refused white there. That reads
// one half of a pair property: a header at luminance 0.55 carrying white links
// sits at 1.75:1 -- illegible -- and no background-only rule fires on it. The
// pair is what legibility is, so the pair is what is tested.
const REGION_LINK_MIN_CONTRAST = EMAIL_MIN_CONTRAST;

const WHITE_HEX = "#ffffff";

// RULE 1 -- AN ELEMENT THAT PAINTS NO TEXT PAINTS NO LINK COLOUR.
//
// The probe records one row per selector match, and a match is an ELEMENT, not
// a rendering. Measured on the replay corpus: a storefront's header carries a
// zero-height anchor (`text: ""`, `textSource: "none"`, `fontSizePx: 0`) whose
// computed colour is `#ffffff`; it is the ONLY white row among 91 header
// anchors, and the backfill published it as the brand's header link colour --
// white nav links on a near-white header band, on four archived runs of that
// site. Nothing about that element was ever visible to a human.
//
// This is a structural rule, not a threshold: it asks what the row measured,
// not how light the answer was. It fires the same way on any site and needs no
// knowledge of the surface.
//
// A row with NO `text` key at all is not a measurement of emptiness -- older
// probe outputs and minimal fixtures simply do not carry the field -- so it
// stays evidence, the same back-compat posture `isLikelyProductCardRow` takes
// for rows without `selectionSignals`. Only an explicitly EMPTY string is the
// negative signal.
function rowRendersText(row) {
  if (!row || typeof row !== "object") return false;
  if (row.text === undefined || row.text === null) return true;
  return String(row.text).trim() !== "";
}

function rowSelector(row) {
  if (!row || typeof row !== "object") return "";
  return String(row.selector ?? "").trim();
}

function rowColor(row) {
  if (!row || typeof row !== "object") return "";
  return normalizeHexForCompare(row.color);
}

// True when text-styles contains at least one row whose selector is in the
// region-scoped set. The validator only fires per-region when its gate is
// active.
function gateActive(textStyles, scopedSet) {
  if (!Array.isArray(textStyles)) return false;
  for (const row of textStyles) {
    if (scopedSet.has(rowSelector(row))) return true;
  }
  return false;
}

// What this region measured for `color`, in three answers rather than two:
//
//   "painting"  -- at least one region-scoped row of this colour rendered text;
//   "textless"  -- the colour appears ONLY on region-scoped rows that painted
//                  nothing (RULE 1) -- evidence of an element, not of a link;
//   "none"      -- no region-scoped row carries this colour at all.
//
// The middle answer is why this is not a boolean: "none" means the colour
// belongs to another part of the page and the backfill has nothing to say,
// while "textless" means this region's only claim to the colour is an element
// no reader ever saw -- a REFUSAL, which arms the replacement below.
function scopedEvidenceKind(color, textStyles, scopedSet) {
  const target = normalizeHexForCompare(color);
  if (!target || !Array.isArray(textStyles)) return "none";
  let seen = false;
  for (const row of textStyles) {
    if (rowColor(row) !== target) continue;
    if (!scopedSet.has(rowSelector(row))) continue;
    if (rowRendersText(row)) return "painting";
    seen = true;
  }
  return seen ? "textless" : "none";
}

// True if any text-styles row whose color matches `color` carries a selector
// from the region-scoped set AND rendered text. Matches use case-insensitive
// normalized hex.
function colorHasScopedEvidence(color, textStyles, scopedSet) {
  return scopedEvidenceKind(color, textStyles, scopedSet) === "painting";
}

// Pull the canvas-background hex from `brandkit.brand.colors.backgroundColors`.
// Prefer the first row tagged `canvas-background`; fall back to index 0 when
// no explicit hint is present (the scaffold's deterministic pre-emit usually
// places the highest-confidence canvas pick at position 0). Returns `null`
// when backgroundColors is missing or empty so the caller can skip the
// tiebreak entirely.
function readCanvasBackground(brandkit) {
  const rows = brandkit?.brand?.colors?.backgroundColors;
  if (!Array.isArray(rows) || rows.length === 0) return null;
  for (const row of rows) {
    if (!row || typeof row !== "object") continue;
    const hints = Array.isArray(row.usageHints) ? row.usageHints : [];
    if (!hints.includes("canvas-background")) continue;
    const value = normalizeHexForCompare(row.value);
    if (value) return value;
  }
  // Fallback: first usable row in the array. Pre-emit publishes the
  // ranker-selected canvas hex first, so this slot is normally correct
  // even when the agent didn't explicitly hint it.
  const first = rows[0];
  if (first && typeof first === "object") {
    const value = normalizeHexForCompare(first.value);
    if (value) return value;
  }
  return null;
}

// Count how many `header a` (or other header-scoped) rows in text-styles
// match each color. Returns a Map<normalizedHex, integer count>.
// Colors not in the scoped selector set contribute 0.
function countScopedColors(textStyles, scopedSet) {
  const counts = new Map();
  if (!Array.isArray(textStyles)) return counts;
  for (const row of textStyles) {
    if (!scopedSet.has(rowSelector(row))) continue;
    if (!rowRendersText(row)) continue; // RULE 1, same definition everywhere.
    const colorKey = rowColor(row);
    if (!colorKey) continue;
    counts.set(colorKey, (counts.get(colorKey) || 0) + 1);
  }
  return counts;
}

// The background this kit gives the region itself, or `null`. Unlike
// `readCanvasBackground` there is NO positional fallback: `backgroundColors[0]`
// is the canvas, and reading it as the header's band is exactly the confusion
// the guard below exists to end.
function readRegionBackground(brandkit, hint, backgroundStyles) {
  const rows = brandkit?.brand?.colors?.backgroundColors;
  if (Array.isArray(rows)) {
    for (const row of rows) {
      if (!row || typeof row !== "object") continue;
      const hints = Array.isArray(row.usageHints) ? row.usageHints : [];
      if (!hints.includes(hint)) continue;
      const value = normalizeHexForCompare(row.value);
      if (value) return value;
    }
  }
  // The kit does not name the band YET. This helper runs at normalize step 2
  // and `synthesizeRegionBgHints` at step 5, so on a site whose band is
  // derived rather than authored the guard would judge a link colour against
  // no surface at all -- measured on 5 of the 50 replay dirs. Ask the
  // synthesiser's own derivation, from the same artifact, rather than guess or
  // wait. An authored row still wins: the loop above runs first.
  return regionBackgroundHex(backgroundStyles, hint === HEADER_BG_HINT ? "header" : "footer");
}

// Can this colour be read on this region's band?
//
// `false` ONLY on a measured failure. No band (the kit never named one) and a
// malformed hex both answer `true`: "no claim" must not become a refusal, the
// same posture `clearsCanvas` takes one module over.
function colourClearsRegionFloor(colorKey, regionBgHex) {
  const bg = normalizeHexForCompare(regionBgHex);
  if (!bg) return true;
  const ratio = contrastRatio(colorKey, bg);
  if (ratio === null) return true;
  return ratio >= REGION_LINK_MIN_CONTRAST;
}

// RULE 2's replacement -- what the region says instead.
//
// Rule 1 removes the rows that painted nothing. What survives it is real
// rendered text, and rule 2 asks of it the only question this stage can ask:
// can it be READ on the band it sits on. Measured on the replay corpus, what
// fails is white at 1.0-1.32:1 on five sites (anchors styled as buttons -- a
// "Try now", a catalogue tab -- and a phone number on a darker sub-strip) and
// white at 2.52:1 on a brand-green band. `text-styles.json` records no per-row
// background, so the region's own band is the only surface available to pair
// with, and that pairing IS the test.
//
// The replacement is the MOST FREQUENT scoped colour that clears the floor --
// the same floor and the same "first legible candidate by weight, not the
// strongest contrast" rule `synthesizeFooterTextRole` already applies to
// `footer-text`, because the role names the region's link colour and the
// most-used legible colour is that colour. Contrast is a floor here, never a
// ranking. When nothing clears it, this returns null and the caller appends
// NOTHING: a 1.7:1 grey (`#bebebe` x42 on one measured header) is the same
// defect in a lighter shade.
export function pickLinkColorForRegion(textStyles, scopedSet, regionBgHex) {
  const bg = normalizeHexForCompare(regionBgHex);
  if (!/^#[0-9a-f]{6}$/.test(bg || "")) return null;
  const ranked = Array.from(countScopedColors(textStyles, scopedSet).entries())
    .sort((left, right) => right[1] - left[1]);
  for (const [color] of ranked) {
    if (!colourClearsRegionFloor(color, bg)) continue;
    return color;
  }
  return null;
}

// Tiebreak helper (BACKLOG item 31). When the canvas is light AND the
// frequency-winner among header-scoped rows is white AND a non-white
// alternative meets the count + contrast gates, return the alternative's
// normalized hex so the caller can prefer it. Otherwise return `null`,
// signalling "no override; fall back to the legacy `tag any match`
// behaviour."
//
// `canvasBgHex` may be `null` (no canvas-background available) — the
// helper returns `null` in that case rather than guessing.
export function pickHeaderLinkColor(textStyles, canvasBgHex) {
  const normalizedCanvas = canvasBgHex
    ? normalizeHexForCompare(canvasBgHex)
    : null;
  if (!normalizedCanvas) return null;

  // Canvas-luminance gate. Mid / dark canvases legitimately render
  // white nav links — the tiebreak only fires on white-on-light, the
  // case that produces a contrast-guard rescue downstream.
  const canvasLuma = relativeLuminance(normalizedCanvas);
  if (canvasLuma === null || canvasLuma < LIGHT_CANVAS_LUMINANCE) return null;

  const counts = countScopedColors(textStyles, HEADER_SCOPED_SELECTORS);
  if (counts.size <= 1) return null; // No alternative → no tiebreak.

  const whiteCount = counts.get(WHITE_HEX) || 0;
  if (whiteCount <= 0) return null; // White is not in the running.

  // The white row must actually be the frequency winner. If a non-white
  // color already outscores white, the legacy "tag any match" behaviour
  // already picks it on its own and we should not intervene.
  let topColor = null;
  let topCount = -1;
  for (const [color, count] of counts.entries()) {
    if (count > topCount) {
      topCount = count;
      topColor = color;
    }
  }
  if (topColor !== WHITE_HEX) return null;

  // Search for the strongest non-white alternative that clears both
  // gates: count >= 25% of the white count AND contrast >= 4.5:1 against
  // the canvas. Iterate by count descending so the most-supported
  // alternative wins when several qualify.
  const sortedAlternatives = Array.from(counts.entries())
    .filter(([color]) => color !== WHITE_HEX)
    .sort((a, b) => b[1] - a[1]);
  const minCount = whiteCount * HEADER_LINK_ALT_COUNT_RATIO;
  for (const [color, count] of sortedAlternatives) {
    if (count < minCount) continue;
    const ratio = contrastRatio(color, normalizedCanvas);
    if (ratio === null || ratio < HEADER_LINK_MIN_CONTRAST) continue;
    return color;
  }
  return null;
}

// Append-only mutation. Walks `brandkit.brand.colors.textColors[]` and adds
// `header-link` / `footer-link` to entries whose value has matching scoped
// evidence and whose `usageHints` is missing the hint.
//
// One diagnostic entry per (color, hint) appended:
//   { severity, path, action, hint, value }
//
// BACKLOG item 31 (contrast tiebreak): before tagging `header-link`, call
// `pickHeaderLinkColor` to choose between white and a non-white alternative
// when the canvas is light and white wins by frequency. When the helper
// returns a non-null hex, only that hex receives the `header-link` tag —
// other header-scoped textColors entries skip the header tag while keeping
// any other matching role hints (e.g. `footer-link` still gets tagged
// independently). When the helper returns null, behaviour falls back to
// the legacy "tag any scoped match" path.
export function backfillHeaderLinkFromScopedEvidence(brandkit, textStyles, diagnostics = [], backgroundStyles = []) {
  const textColors = brandkit?.brand?.colors?.textColors;
  if (!Array.isArray(textColors)) return;
  const headerActive = gateActive(textStyles, HEADER_SCOPED_SELECTORS);
  const footerActive = gateActive(textStyles, FOOTER_SCOPED_SELECTORS);
  if (!headerActive && !footerActive) return;

  // Resolve the header-link tiebreak once per call. `chosenHeaderLink` is
  // either a normalized hex (the override winner) or null (no override —
  // fall back to legacy tag-any-match). The footer path is unaffected.
  const canvasBgHex = readCanvasBackground(brandkit);
  const headerBg = readRegionBackground(brandkit, HEADER_BG_HINT, backgroundStyles);
  const footerBg = readRegionBackground(brandkit, FOOTER_BG_HINT, backgroundStyles);
  const regionBg = { [HEADER_LINK_HINT]: headerBg, [FOOTER_LINK_HINT]: footerBg };
  const scopedFor = {
    [HEADER_LINK_HINT]: HEADER_SCOPED_SELECTORS,
    [FOOTER_LINK_HINT]: FOOTER_SCOPED_SELECTORS,
  };
  // The BACKLOG#31 canvas tiebreak decides only where the region guard cannot.
  // Both answer "which of these colours is the header's link colour", and the
  // tiebreak answers it against the PAGE canvas because, when it was written,
  // the header's own band was not available here. It is available now: when
  // the kit names a `header-background`, that band is the surface the link is
  // painted on and the canvas is a proxy for it. Letting both decide would let
  // the proxy re-admit a colour the real surface just refused.
  const chosenHeaderLink = headerActive && !headerBg
    ? pickHeaderLinkColor(textStyles, canvasBgHex)
    : null;
  const tagged = { [HEADER_LINK_HINT]: false, [FOOTER_LINK_HINT]: false };
  const existingRoles = new Set(textColors.flatMap(entry =>
    Array.isArray(entry?.usageHints) ? entry.usageHints : []));

  for (const [index, entry] of textColors.entries()) {
    if (!entry || typeof entry !== "object") continue;
    const hints = Array.isArray(entry.usageHints) ? entry.usageHints : null;
    if (!hints) continue;
    const colorKey = normalizeHexForCompare(entry.value);
    if (!colorKey) continue;

    const tryAppend = (active, scopedSet, hint) => {
      if (!active || existingRoles.has(hint)) return;
      if (hints.includes(hint)) {
        tagged[hint] = true;
        return;
      }
      const evidence = scopedEvidenceKind(entry.value, textStyles, scopedSet);
      if (evidence === "none") return;
      // RULE 1: the colour's only claim to this region is an element that
      // painted nothing. Refuse it as evidence for this region.
      if (evidence === "textless") {
        diagnostics.push({
          severity: "info",
          path: `$.brand.colors.textColors[${index}].usageHints`,
          action: "refused",
          hint,
          value: entry.value,
          reason: "no region-scoped row of this colour rendered any text",
        });
        return;
      }
      // RULE 2: a colour that cannot be read on this region's own band is not
      // that region's link colour. Not white-specific -- white is merely where
      // the corpus put it.
      if (!colourClearsRegionFloor(colorKey, regionBg[hint])) {
        diagnostics.push({
          severity: "info",
          path: `$.brand.colors.textColors[${index}].usageHints`,
          action: "refused",
          hint,
          value: entry.value,
          reason: `fails the ${REGION_LINK_MIN_CONTRAST}:1 email contrast floor against the ${hint === HEADER_LINK_HINT ? "header" : "footer"} background (${regionBg[hint]})`,
        });
        return;
      }
      // Tiebreak gate: when an override has been chosen for header-link,
      // only the chosen colour receives the hint. Other header-scoped
      // textColors entries are skipped on this hint but their other
      // hints (footer-link, etc.) keep the legacy treatment.
      if (hint === HEADER_LINK_HINT && chosenHeaderLink && colorKey !== chosenHeaderLink) return;
      hints.push(hint);
      tagged[hint] = true;
      diagnostics.push({
        severity: "info",
        path: `$.brand.colors.textColors[${index}].usageHints`,
        action: "appended",
        hint,
        value: entry.value,
      });
    };

    tryAppend(headerActive, HEADER_SCOPED_SELECTORS, HEADER_LINK_HINT);
    tryAppend(footerActive, FOOTER_SCOPED_SELECTORS, FOOTER_LINK_HINT);
  }

  // A measured winner need not already have a carrier in the draft. Keep
  // unknown-surface recovery conservative and reuse the header tiebreak.
  for (const hint of [HEADER_LINK_HINT, FOOTER_LINK_HINT]) {
    const active = hint === HEADER_LINK_HINT ? headerActive : footerActive;
    if (!active || existingRoles.has(hint) || tagged[hint]) continue;
    const choice = hint === HEADER_LINK_HINT && chosenHeaderLink
      ? chosenHeaderLink
      : pickLinkColorForRegion(textStyles, scopedFor[hint], regionBg[hint]);
    if (!choice) continue;
    const region = hint === HEADER_LINK_HINT ? "header" : "footer";
    const carrier = textColors.find(entry => normalizeHexForCompare(entry?.value) === choice);
    if (carrier) {
      carrier.usageHints = Array.isArray(carrier.usageHints) ? carrier.usageHints : [];
      if (!carrier.usageHints.includes(hint)) carrier.usageHints.push(hint);
      tagged[hint] = true;
      diagnostics.push({ severity: "info", action: "appended", hint, value: choice,
        regionBackground: regionBg[hint] || canvasBgHex });
      continue;
    }
    const newIndex = textColors.length;
    textColors.push(markScaffoldSynthesised({
      value: choice,
      description: `Auto-synthesised ${hint} from ${region}-scoped anchor rows that render text, legible on the ${regionBg[hint] || canvasBgHex} ${region} background.`,
      usageHints: [hint],
    }));
    tagged[hint] = true;
    diagnostics.push({
      severity: "info",
      path: `$.brand.colors.textColors[${newIndex}]`,
      action: "appended-row",
      hint,
      value: choice,
      regionBackground: regionBg[hint] || canvasBgHex,
      surfaceSource: regionBg[hint] ? `${region}-background` : "canvas-proxy",
    });
  }
}

// Emit a `warn` diagnostic when a `header-link` textColors row fails
// the WCAG `EMAIL_MIN_CONTRAST` (3:1) threshold against the synthesised
// `header-background` (or `canvas-background` fallback).
//
// Why: regressions on multi-region-nav sites (sites with a utility
// bar above a catalog navbar) where extraction synthesised a
// `header-link` color that rendered white-on-white in the customise
// preview. The downstream Python contrast-guard rescued the situation
// by auto-flipping the text color, but the extraction artifact itself
// was already wrong — the brandkit consumer had no visibility into the
// fact that the probe selectors had captured the wrong region (e.g.
// utility-bar vs catalog-navbar). This diagnostic surfaces the
// mismatch at normalize time as observability; the Python soft-flip
// in `enforce_text_surface_contrast` still does the rescue side.
//
// Posture: pure diagnostic. Never mutates `payload`. Append-only on
// `diagnostics`. Severity is `warn` (not `error`) because the email
// will still render — but only after the Python rescue flips text to
// black-on-white, which loses brand fidelity.
//
// Fallback rule: when `backgroundColors` carries no `header-background`
// row, fall back to `canvas-background`. The diagnostic message names
// the source it actually compared against so a reviewer can verify.
// When neither hint is present, the helper no-ops silently — that's
// the "no signal" case, not a violation.

import { contrastRatio, EMAIL_MIN_CONTRAST } from "./wcag-contrast.js";

const HEADER_LINK_HINT = "header-link";
const HEADER_BG_HINT = "header-background";
const CANVAS_BG_HINT = "canvas-background";

function hasHint(row, hint) {
  if (!row || typeof row !== "object") return false;
  const hints = Array.isArray(row.usageHints) ? row.usageHints : [];
  return hints.includes(hint);
}

function rowValue(row) {
  return row && typeof row === "object" && typeof row.value === "string" ? row.value : "";
}

function pickFirstWithHint(rows, hint) {
  if (!Array.isArray(rows)) return null;
  for (const row of rows) {
    if (hasHint(row, hint)) return row;
  }
  return null;
}

export function emitHeaderLinkContrastDiagnostic(payload, diagnostics = []) {
  if (!Array.isArray(diagnostics)) return;
  const colors = payload?.brand?.colors;
  if (!colors || typeof colors !== "object") return;
  const textRows = Array.isArray(colors.textColors) ? colors.textColors : [];
  const bgRows = Array.isArray(colors.backgroundColors) ? colors.backgroundColors : [];

  const headerBgRow = pickFirstWithHint(bgRows, HEADER_BG_HINT);
  const canvasBgRow = pickFirstWithHint(bgRows, CANVAS_BG_HINT);
  const bgRow = headerBgRow ?? canvasBgRow;
  if (!bgRow) return; // No background reference → no claim to make.
  const bgHex = rowValue(bgRow);
  const bgSource = headerBgRow ? HEADER_BG_HINT : CANVAS_BG_HINT;
  if (!bgHex) return;

  for (let i = 0; i < textRows.length; i += 1) {
    const row = textRows[i];
    if (!hasHint(row, HEADER_LINK_HINT)) continue;
    const linkHex = rowValue(row);
    if (!linkHex) continue;
    const ratio = contrastRatio(linkHex, bgHex);
    if (ratio === null) continue;
    if (ratio >= EMAIL_MIN_CONTRAST) continue;
    const ratioRounded = Math.round(ratio * 100) / 100;
    diagnostics.push({
      severity: "warn",
      path: `$.brand.colors.textColors[${i}].usageHints`,
      message: `header-link ${linkHex} fails WCAG contrast (${ratioRounded}:1) against synthesised ${bgSource} ${bgHex}; verify probe selectors captured the right region (utility-bar vs catalog-navbar).`,
    });
  }
}

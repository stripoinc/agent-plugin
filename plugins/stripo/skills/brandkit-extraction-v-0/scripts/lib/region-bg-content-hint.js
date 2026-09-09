// Synthesise the `content-background` usageHint onto
// `brand.colors.backgroundColors[]` from `background-styles.json`
// probe rows that target the page's main content region. Companion
// to `synthesizeRegionBgHints` (header / footer) and to the canvas
// pre-emit — same "deterministic seed → agent confirms" posture.
//
// Why this exists: the agent's pre-tagging contract (SKILL.md) covers
// canvas / header / footer / link backgrounds via dedicated helpers,
// but the `content-background` channel — the page's main content
// surface — was left for the agent to author. In practice that hint
// regressed after fix19: fix20+ scaffolders shipped with only the
// canvas-background hint, and the downstream customise stage ended
// up rendering content on the guessed neutral surface rather than the
// brand's true content treatment. The probe rows already carry the
// evidence: a row whose `selector` is `main` / `[role="main"]` (or
// whose `roleHint` is `main` / `region`) identifies the content
// region deterministically.
//
// Matching rule per row: `roleHint === "main"` OR `roleHint === "region"`
// (the ARIA `region` role acts as a fall-through synonym in HTML5
// landmark semantics), OR `selector` starts with the `main` tag
// (`main`, `main.foo`, `main > nav`, `main[role='main']`), OR the
// selector is a `[role='main']` attribute selector. The selector
// regex anchors `^main` followed by a non-word character so that
// class-leading selectors like `main-utility-strip` never match.
//
// Two emit modes:
//   1) **Direct emit.** Any matching row whose `backgroundColor`
//      normalises to a non-empty hex contributes summed
//      `viewportCoverage` to a per-hex bucket. Winning hex is the
//      one whose summed coverage exceeds the confidence gate
//      (`MIN_REGION_COVERAGE`, same 0.05 threshold as the canvas
//      ranker and the header/footer helper). The hint is emitted on
//      a matching `backgroundColors[]` row or on a new row when
//      none matches.
//   2) **Canvas fall-through.** When no row produced a usable hex
//      BUT at least one matching row had a `null`/empty
//      `backgroundColor` (a transparent `<main>` is the common
//      case: the element renders directly on the canvas without
//      its own surface), the hint propagates to the existing
//      `canvas-background` row — i.e. `content-background` is
//      semantically equivalent to canvas when main has no surface
//      of its own.
//
// Skip rows whose `backgroundColor` normalises to empty when
// looking for direct emits — those rows feed the
// `nullBgSeen` flag instead.
//
// Bucket-and-sum semantics + the `appendHintIfAbsent` idempotency
// mirror `synthesizeRegionBgHints` (same Tier-F decision: both
// scaffold and normalize so a dropped hint is re-asserted on
// normalize).

import { markScaffoldSynthesised } from "./provenance-marker.js";
import { MIN_REGION_COVERAGE } from "./coverage-constants.js";

const CONTENT_HINT = "content-background";

const CONTENT_SELECTOR_RE = /^main(\s|>|\[|\.|:|$)|^\[role=["']main["']\]/i;

function lowerHex(value) {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase();
}

function isContentRow(row) {
  if (!row || typeof row !== "object") return false;
  const roleHint = typeof row.roleHint === "string" ? row.roleHint.toLowerCase() : "";
  if (roleHint === "main" || roleHint === "region") return true;
  const selector = typeof row.selector === "string" ? row.selector.trim() : "";
  return Boolean(selector) && CONTENT_SELECTOR_RE.test(selector);
}

function ensureArray(target, key) {
  if (!Array.isArray(target[key])) target[key] = [];
}

function appendHintIfAbsent(row, hint) {
  if (!row || typeof row !== "object") return false;
  const hints = Array.isArray(row.usageHints) ? row.usageHints : [];
  if (hints.includes(hint)) return false;
  row.usageHints = [...hints, hint];
  return true;
}

function emitContentBgHint(payload, hex, diagnostics) {
  const targetKey = lowerHex(hex);
  if (!targetKey) return;
  const colors = payload?.brand?.colors;
  if (!colors || typeof colors !== "object") return;
  ensureArray(colors, "backgroundColors");
  for (const [index, row] of colors.backgroundColors.entries()) {
    if (!row || typeof row !== "object") continue;
    if (lowerHex(row.value) !== targetKey) continue;
    const appended = appendHintIfAbsent(row, CONTENT_HINT);
    if (appended && Array.isArray(diagnostics)) {
      diagnostics.push({
        severity: "info",
        path: `$.brand.colors.backgroundColors[${index}].usageHints`,
        action: "appended-hint",
        hint: CONTENT_HINT,
        value: row.value,
      });
    }
    return;
  }
  const newRow = markScaffoldSynthesised({
    value: hex,
    description: "Auto-tagged content background from probe evidence.",
    usageHints: [CONTENT_HINT],
  });
  const newIndex = colors.backgroundColors.length;
  colors.backgroundColors.push(newRow);
  if (Array.isArray(diagnostics)) {
    diagnostics.push({
      severity: "info",
      path: `$.brand.colors.backgroundColors[${newIndex}]`,
      action: "appended-row",
      hint: CONTENT_HINT,
      value: hex,
    });
  }
}

// Mutates `payload.brand.colors.backgroundColors[]` in place. Idempotent.
// Safe with missing / empty / non-array inputs — no-ops without throwing
// (mirrors `synthesizeRegionBgHints`'s defensive posture).
export function synthesizeContentBgHint(payload, backgroundStyles, diagnostics = []) {
  if (!payload?.brand?.colors) return;
  if (!Array.isArray(backgroundStyles)) return;

  // Bucket content rows by hex, sum viewportCoverage. Track whether
  // any matching row had a null/empty bg (transparent main).
  const byHex = new Map();
  let nullBgSeen = false;
  for (const row of backgroundStyles) {
    if (!isContentRow(row)) continue;
    const hex = lowerHex(row.backgroundColor);
    if (!hex) {
      nullBgSeen = true;
      continue;
    }
    const cov = Number(row.viewportCoverage);
    const safeCov = Number.isFinite(cov) ? cov : 0;
    byHex.set(hex, (byHex.get(hex) || 0) + safeCov);
  }

  // Pick winning hex with summed cov > MIN_REGION_COVERAGE.
  let winningHex = null;
  let winningCov = MIN_REGION_COVERAGE;
  for (const [hex, cov] of byHex) {
    if (cov > winningCov) {
      winningHex = hex;
      winningCov = cov;
    }
  }

  // Fall-through: if no usable content bg was found AND a transparent
  // main row was seen, content-bg == canvas-bg (the main element
  // renders directly on canvas).
  if (!winningHex && nullBgSeen) {
    const bgList = payload?.brand?.colors?.backgroundColors;
    if (Array.isArray(bgList)) {
      const canvas = bgList.find(
        (r) => r && typeof r === "object" && Array.isArray(r.usageHints) && r.usageHints.includes("canvas-background"),
      );
      if (canvas) winningHex = lowerHex(canvas.value);
    }
  }
  if (!winningHex) return;

  emitContentBgHint(payload, winningHex, diagnostics);
}

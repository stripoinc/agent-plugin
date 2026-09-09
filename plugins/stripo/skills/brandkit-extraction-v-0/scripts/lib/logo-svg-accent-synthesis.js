// Synthesise `brand-secondary-accent` color tokens from logo SVG fills at
// normalize time. Companion to `synthesizeTextColorRoles`: where that helper
// synthesises text-color role tokens from text-style probe rows, this helper
// synthesises brand-distinctive accent tokens from `${TECH}/*.svgpath.json`
// logo markup.
//
// Why: the scaffolder seeds `brand.colors.accentColors` from a narrow set of
// probe rows (most often only the button-primary background tagged as
// `brand-primary-accent` via `preEmitBrandColours`). The agent is expected
// to enrich the array from the homepage logo SVG markup, but in practice the
// agent's normalize input regularly ships with `accentColors` near-empty
// even when the logo plainly carries 3-4 brand-distinctive fills (e.g.
// EVA's `#005bbb`, `#ffd500`, `#72be44`, `#f48120`). Downstream customise
// then has no brand-secondary-accent to render with and falls back to the
// bundled template palette. This helper closes that gap deterministically.
//
// Posture (matches `header-link-backfill.js` / `text-color-role-synthesis.js`):
//   - Append-only / additive. Never strips a hint, never removes a row,
//     never reorders other rows.
//   - Idempotent: dedupe runs against `accentColors[*].value` with
//     case-insensitive hex compare so re-running normalize is a no-op.
//   - Gated: short-circuits when `accentColors.length > 2` so a brand that
//     already enumerated its accents in the agent input is untouched.
//   - Threshold: at least 3 distinct survivors required. A single-color
//     monogram logo (one brand-tinted fill, no supporting accents) is
//     not enough signal; we'd rather leave the slot for the agent /
//     customise fallback than ship one vaguely-tagged row.
//   - White / black skipped unconditionally. Pure `#ffffff` / `#000000`
//     fills are non-brand-distinctive on logos (frame strokes, knockouts).
//   - Empty / missing inputs no-op without throwing — same defensive
//     posture as `backfillHeaderLinkFromScopedEvidence`.

import { normalizeHexForCompare } from "./header-link-strip.js";
import { markScaffoldSynthesised } from "./provenance-marker.js";

const ACCENT_HINT = "brand-secondary-accent";
const ACCENT_GATE_THRESHOLD = 2;
const APPEND_MIN_DISTINCT = 3;
// Cap on `accentColors.length` after synthesis. The downstream customise
// picker is heuristic when multiple identical-hint rows exist — capping
// the post-synthesis total at 5 keeps the slate small enough to choose
// confidently. With the gate at >2 existing rows, the practical cases
// are: 0 existing → up to 5 appended; 1 → up to 4; 2 → up to 3.
const POST_SYNTH_TOTAL_CAP = 5;

const WHITE_HEX = "#ffffff";
const BLACK_HEX = "#000000";

const HEX_TOKEN_RE = /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const FILL_ATTR_RE = /\bfill\s*=\s*["']([^"']+)["']/gi;
const FILL_CSS_RE = /\bfill\s*:\s*([^;}\s]+)/gi;

// Canonicalise a fill token to a 6-char lowercase hex, or null when the
// token is non-hex (named colors, `url(#...)`, `currentColor`, `rgba(...)`,
// etc.). 3-char hex expands; 8-char hex truncates alpha.
function canonicaliseHex(rawToken) {
  if (typeof rawToken !== "string") return null;
  const token = rawToken.trim();
  if (!token) return null;
  const match = HEX_TOKEN_RE.exec(token);
  if (!match) return null;
  const body = match[1].toLowerCase();
  if (body.length === 3) {
    return `#${[...body].map((c) => c + c).join("")}`;
  }
  if (body.length === 8) {
    // Drop alpha: extraction agents downstream don't model alpha and
    // schema `value` is a plain hex string.
    return `#${body.slice(0, 6)}`;
  }
  return `#${body}`;
}

// Extract distinct hex fills from a single svgpath JSON entry. Returns an
// array preserving first-seen order. Two channels:
//   1. Inline `fill="..."` attributes — checked against every
//      `shapes[i].markup` AND the top-level `svgPath` string.
//   2. CSS `<style>` block declarations (`.cls-1 { fill: #abcdef; }`) —
//      checked against the top-level `svgPath` string only. (Inline
//      markup never carries `<style>` blocks per the probe's serialisation.)
//
// Tokens that don't look like hex (named colors, url(#...), rgba(...)) are
// silently dropped — see `canonicaliseHex`. Defensive guards on every input
// so a malformed entry does not throw.
export function extractLogoSvgFills(svgPathJson) {
  const seen = new Set();
  const ordered = [];
  function consume(token) {
    const canonical = canonicaliseHex(token);
    if (!canonical) return;
    if (seen.has(canonical)) return;
    seen.add(canonical);
    ordered.push(canonical);
  }
  if (!svgPathJson || typeof svgPathJson !== "object") return ordered;
  const topSvg = typeof svgPathJson.svgPath === "string" ? svgPathJson.svgPath : "";
  const shapes = Array.isArray(svgPathJson.shapes) ? svgPathJson.shapes : [];
  // Channel 1: inline fill="..." attributes across markup and top-level svgPath.
  const markupSources = [];
  for (const shape of shapes) {
    if (!shape || typeof shape !== "object") continue;
    if (typeof shape.markup === "string" && shape.markup) {
      markupSources.push(shape.markup);
    }
  }
  if (topSvg) markupSources.push(topSvg);
  for (const source of markupSources) {
    FILL_ATTR_RE.lastIndex = 0;
    let match;
    while ((match = FILL_ATTR_RE.exec(source)) !== null) {
      consume(match[1]);
    }
  }
  // Channel 2: CSS <style> block declarations in the top-level svgPath only.
  if (topSvg) {
    FILL_CSS_RE.lastIndex = 0;
    let match;
    while ((match = FILL_CSS_RE.exec(topSvg)) !== null) {
      consume(match[1]);
    }
  }
  return ordered;
}

// Mutates `brandkit.brand.colors.accentColors` in place. Append-only — never
// strips existing rows. See module header for the full posture.
//
// `logoSvgPaths` is an array of parsed `*.svgpath.json` objects, optionally
// tagged with `_basename: "<file>.svgpath.json"` for diagnostic attribution.
// Each entry is parsed independently then union-deduped into a single Map
// keyed on lowercase hex, with the first contributing basename winning the
// attribution slot.
//
// Diagnostic shape mirrors `text-color-role-synthesis.js`:
//   - `appended-row` (one per appended color, info severity)
//   - `synthesized-from-logo-svg` (single summary, info severity, emitted
//     only when >=1 row was appended)
export function synthesizeLogoSvgAccents(brandkit, logoSvgPaths, diagnostics = []) {
  if (!brandkit || typeof brandkit !== "object") return;
  const colors = brandkit?.brand?.colors;
  if (!colors || typeof colors !== "object") return;
  if (!Array.isArray(colors.accentColors)) return;
  // Step 1: trigger gate. A brand with >2 accents has either been enriched
  // by the agent or seeded from another channel; leave it alone.
  if (colors.accentColors.length > ACCENT_GATE_THRESHOLD) return;
  if (!Array.isArray(logoSvgPaths) || logoSvgPaths.length === 0) return;

  // Step 2: union fills across every svgpath entry, recording the first
  // contributing basename per color for diagnostic attribution.
  const candidates = new Map(); // hexKey -> { canonical, sourceFiles: [basename] }
  for (const entry of logoSvgPaths) {
    if (!entry || typeof entry !== "object") continue;
    const fills = extractLogoSvgFills(entry);
    if (fills.length === 0) continue;
    const basename = typeof entry._basename === "string" && entry._basename
      ? entry._basename
      : "";
    for (const hex of fills) {
      const key = hex.toLowerCase();
      if (!candidates.has(key)) {
        candidates.set(key, { canonical: hex, sourceFiles: basename ? [basename] : [] });
        continue;
      }
      const existing = candidates.get(key);
      if (basename && !existing.sourceFiles.includes(basename)) {
        existing.sourceFiles.push(basename);
      }
    }
  }
  if (candidates.size === 0) return;

  // Step 3: filter. Drop pure white / black, drop anything already on
  // `accentColors` (case-insensitive hex compare via the shared helper).
  const existingKeys = new Set();
  for (const entry of colors.accentColors) {
    if (!entry || typeof entry !== "object") continue;
    const key = normalizeHexForCompare(entry.value);
    if (key) existingKeys.add(key);
  }
  const survivors = [];
  for (const [key, candidate] of candidates) {
    if (key === WHITE_HEX || key === BLACK_HEX) continue;
    const normalised = normalizeHexForCompare(candidate.canonical);
    if (normalised && existingKeys.has(normalised)) continue;
    survivors.push(candidate);
  }

  // Step 4: threshold gate. Require at least 3 distinct survivors so a
  // monogram logo (single distinct fill) does not seed a lone "secondary
  // accent" row with weak provenance.
  if (survivors.length < APPEND_MIN_DISTINCT) return;

  // Step 4b: cap appended count so `accentColors.length` AFTER synthesis
  // is at most `POST_SYNTH_TOTAL_CAP`. With the gate at >2 existing rows,
  // `available` is always >= 3, so this never collides with the threshold
  // above. First-seen order matches the existing dedup behaviour.
  const available = Math.max(0, POST_SYNTH_TOTAL_CAP - colors.accentColors.length);
  const survivorsToAppend = survivors.length > available
    ? survivors.slice(0, available)
    : survivors;

  // Step 5: append rows in first-seen order. Schema (`accentColorToken`,
  // additionalProperties:false) requires `value`, `description`,
  // `usageHints`; no `evidence` field — source attribution lives only in
  // the diagnostic. `value` must also match `^#[0-9a-f]{6}$`, which is what
  // every hex mined out of the logo SVG already is.
  const appendedValues = [];
  const summarySourceFiles = new Set();
  for (const candidate of survivorsToAppend) {
    const newIndex = colors.accentColors.length;
    const firstFile = candidate.sourceFiles[0] || "";
    const descriptionSuffix = firstFile ? ` (${firstFile})` : "";
    colors.accentColors.push(markScaffoldSynthesised({
      value: candidate.canonical,
      description: `Auto-synthesised from logo SVG${descriptionSuffix}.`,
      usageHints: [ACCENT_HINT],
    }));
    diagnostics.push({
      severity: "info",
      path: `$.brand.colors.accentColors[${newIndex}]`,
      action: "appended-row",
      hint: ACCENT_HINT,
      value: candidate.canonical,
      sourceSvgFile: firstFile,
    });
    appendedValues.push(candidate.canonical);
    for (const file of candidate.sourceFiles) {
      if (file) summarySourceFiles.add(file);
    }
  }

  // Step 6: one summary diagnostic when >=1 row appended.
  if (appendedValues.length > 0) {
    diagnostics.push({
      severity: "info",
      path: "$.brand.colors.accentColors",
      action: "synthesized-from-logo-svg",
      appendedCount: appendedValues.length,
      appendedValues,
      sourceSvgFiles: [...summarySourceFiles],
    });
  }
}

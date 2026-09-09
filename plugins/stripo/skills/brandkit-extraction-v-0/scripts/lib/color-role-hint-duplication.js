// Diagnostic for strong color-role-hint duplication across rows in
// `brand.colors.{accentColors, backgroundColors, textColors}`.
//
// A "strong" hint here is a role that the customise pipeline treats as
// the canonical brand commitment for that surface — accent, primary/
// secondary CTA background, or price colour. The pipeline reads only
// the FIRST matching row per hint; a second row tagged with the same
// strong hint but a different value is silently dropped and the token
// budget pays for the redundant tag.
//
// Severity is `info`, NOT `warn` or `high`:
//   - The deterministic normalize helpers (colour-pre-emit + safety
//     nets) are responsible for resolving duplicates on the next pass.
//     This diagnostic is a tracked-state breadcrumb in
//     `assembly-diagnostics.json` so an operator who suspects drift
//     across runs has a paper trail.
//   - SKILL.md `Role-tagging contract -> Hint preservation` forbids the
//     agent from stripping hints to "clean up" a duplicate. The message
//     reiterates this so the prior agent regression (stripping hints in
//     response to a warn-level entry, mirroring the typography case in
//     `typography-role-coverage.js -> typographyHintDuplicationDiagnostics`)
//     does not repeat for color rows.
//
// Algorithm notes:
//   - Cross-array reuse of the SAME (value, hint) pair is benign — e.g.
//     `#ffffff` carrying `button-primary-background` on accentColors and
//     also implicitly on a related backgroundColors row only flags when
//     the VALUES differ. We dedup by `(value, group)` before counting
//     distinct values per hint.
//   - The strong-hint tuple is restated locally rather than imported
//     from `assemble-extraction-stage.js` (where `EXCLUSIVE_HINT_GROUPS`
//     lives) to keep this module independently testable and to avoid an
//     upward dependency.

export const STRONG_COLOR_ROLE_HINTS = Object.freeze([
  "brand-primary-accent",
  "brand-secondary-accent",
  "button-primary-background",
  "button-secondary-background",
  "price-current",
  "price-old",
]);

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeUsageHints(value) {
  const output = [];
  for (const item of Array.isArray(value) ? value : []) {
    const raw = normalizeText(item);
    if (!raw) continue;
    if (!output.includes(raw)) output.push(raw);
  }
  return output;
}

function normalizeValue(value) {
  const text = normalizeText(value);
  return text ? text.toLowerCase() : "";
}

export function colorRoleHintDuplicationDiagnostics(payload) {
  const colors = payload?.brand?.colors;
  if (!colors || typeof colors !== "object") return [];

  const STRONG = new Set(STRONG_COLOR_ROLE_HINTS);
  // Per-hint map: hint -> Map keyed by `${value}::${group}` -> { value, group, sourceHints }
  const perHint = new Map();
  for (const hint of STRONG_COLOR_ROLE_HINTS) perHint.set(hint, new Map());

  const GROUPS = ["accentColors", "backgroundColors", "textColors"];
  for (const group of GROUPS) {
    const rows = Array.isArray(colors[group]) ? colors[group] : [];
    for (const row of rows) {
      if (!row || typeof row !== "object") continue;
      // Skip rows whose `usageHints` is not an array (e.g. null, string).
      if (!Array.isArray(row.usageHints)) continue;
      const value = normalizeValue(row.value);
      if (!value) continue;
      const hints = normalizeUsageHints(row.usageHints);
      if (hints.length === 0) continue;
      for (const hint of hints) {
        if (!STRONG.has(hint)) continue;
        const bucket = perHint.get(hint);
        const key = `${value}::${group}`;
        if (bucket.has(key)) continue; // already recorded this (value, group)
        bucket.set(key, { value, group, sourceHints: hints });
      }
    }
  }

  const output = [];
  for (const hint of STRONG_COLOR_ROLE_HINTS) {
    const bucket = perHint.get(hint);
    if (!bucket || bucket.size === 0) continue;
    const distinctValues = new Set();
    for (const entry of bucket.values()) distinctValues.add(entry.value);
    if (distinctValues.size <= 1) continue;
    const values = Array.from(bucket.values());
    const valueSummary = values
      .map((entry) => `${entry.value} (${entry.group})`)
      .join(", ");
    output.push({
      hint,
      severity: "info",
      message:
        "[INFO] Duplicate strong color role hint detected (`" +
        hint +
        "` appears on " +
        distinctValues.size +
        " distinct values: " +
        valueSummary +
        "). Customise consumes only the first match; redundant tags reduce token clarity and can mask the canonical brand commitment. This is informational only — the deterministic helpers should resolve duplicates on the next normalize pass. **DO NOT strip hints from color rows.** If the duplicate persists across normalize passes, file a BACKLOG item describing the colors and groups involved.",
      values,
      valueCount: distinctValues.size,
    });
  }
  return output;
}

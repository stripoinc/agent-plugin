// Backfills layout dimension fields onto `brand.components.button[]` entries
// from the raw `button-styles.json` probe rows.
//
// Why: SKILL.md ([line 288](skills/brandkit-extraction-v-0/SKILL.md#authoritative-source))
// tells the agent to preserve scaffolder rows and apply only targeted edits.
// In practice, the agent often collapses N candidate buttons to ~3 canonical
// entries and strips the layout dimensions (`computedHeightPx`,
// `computedWidthPx`, `widthRatioToParent`, `isFullWidth`) along the way,
// keeping only `layout.intent`. This silently disables downstream safety
// nets that depend on dimensions — most notably
// `demoteIconOnlyFromButtonPrimary`, whose conjunctive gate requires
// `intent === "fixed-width"` AND `borderRadius >= 24` AND
// `computedHeightPx <= 60` AND `widthRatioToParent < 0.4`. Without the
// dimension fields, two of four signals are null and the gate fails.
//
// Reproducing case:
//   probe button[0]: bg=#43b02a, radius=50, height=48, widthRatio=0.2069
//   draft button[0]:  same fields preserved by the scaffolder
//   final button[0]:  same bg/radius/intent, but height=null, widthRatio=null
//
// This helper runs at normalize time. For each button entry, it finds probe
// rows whose `default.backgroundColor` + `default.borderRadius` match the
// button's signature. If all matches agree on dimensions, it backfills the
// missing fields. Existing non-null fields are never overwritten — the
// agent's intent stays authoritative.
//
// Conservative gates:
//   1) Button must have backgroundColor AND finite borderRadius (signature
//      keys must be present for a meaningful match).
//   2) Matches require an EXACT match on (lowercased bg, numeric radius).
//   3) When multiple probe rows match, all must agree on dimensions within
//      tolerance (height/width exact, widthRatioToParent within 0.01).
//      Disagreement means the signature is ambiguous → skip rather than
//      pick wrong dimensions.
//   4) Only fields that are null/undefined are backfilled — never overwrite.
//
// The helper is safe to run before `demoteIconOnlyFromButtonPrimary` and is
// idempotent. Multiple runs converge to the same state.

const WIDTH_RATIO_TOLERANCE = 0.01;

const BACKFILL_FIELDS = [
  "computedHeightPx",
  "computedWidthPx",
  "widthRatioToParent",
  "isFullWidth",
];

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function lowerHex(value) {
  return String(value || "").trim().toLowerCase();
}

function asFiniteNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function matchesByVisualSignature(button, probeRows) {
  const bg = lowerHex(button.backgroundColor);
  const radius = asFiniteNumber(button.borderRadius);
  if (!bg || radius === null) return [];
  return probeRows.filter((row) => {
    const def = row?.default;
    if (!isPlainObject(def)) return false;
    if (lowerHex(def.backgroundColor) !== bg) return false;
    if (asFiniteNumber(def.borderRadius) !== radius) return false;
    return true;
  });
}

// Returns the consistent dimensions across all matches, or null when matches
// disagree. Numeric equality for height/width (pixel values from the same
// probe pass); ratio equality with WIDTH_RATIO_TOLERANCE because rounding
// can vary between rows of the same visual class (e.g., 0.2069 vs 0.2046).
export function consistentLayoutDimensions(matches) {
  if (!Array.isArray(matches) || matches.length === 0) return null;
  const first = matches[0]?.default?.layout;
  if (!isPlainObject(first)) return null;
  const target = {
    computedHeightPx: asFiniteNumber(first.computedHeightPx),
    computedWidthPx: asFiniteNumber(first.computedWidthPx),
    widthRatioToParent: asFiniteNumber(first.widthRatioToParent),
    isFullWidth: typeof first.isFullWidth === "boolean" ? first.isFullWidth : null,
  };
  for (let i = 1; i < matches.length; i++) {
    const layout = matches[i]?.default?.layout;
    if (!isPlainObject(layout)) return null;
    if (asFiniteNumber(layout.computedHeightPx) !== target.computedHeightPx) return null;
    if (asFiniteNumber(layout.computedWidthPx) !== target.computedWidthPx) return null;
    const ratio = asFiniteNumber(layout.widthRatioToParent);
    if (target.widthRatioToParent === null && ratio !== null) return null;
    if (target.widthRatioToParent !== null && ratio === null) return null;
    if (
      target.widthRatioToParent !== null &&
      Math.abs(ratio - target.widthRatioToParent) > WIDTH_RATIO_TOLERANCE
    ) {
      return null;
    }
    const full = typeof layout.isFullWidth === "boolean" ? layout.isFullWidth : null;
    if (target.isFullWidth !== full) return null;
  }
  return target;
}

// Mutates payload.brand.components.button[] in place. For each button entry
// whose layout is missing or stripped to a non-object, the layout is
// reconstructed as `{}` before the field-level backfill. Then, when the
// layout is missing one or more of `computedHeightPx`, `computedWidthPx`,
// `widthRatioToParent`, `isFullWidth`, finds probe rows matching the visual
// signature (backgroundColor + borderRadius) and, if they agree on the
// missing dimensions, copies them onto the button's `layout` object. Records
// a diagnostic per backfilled button.
//
// No-op cases:
//   - missing / non-array / empty buttons
//   - missing / non-array / empty probeRows
//   - button lacks backgroundColor or borderRadius (no signature)
//   - no probe rows match the signature
//   - matched probe rows disagree on dimensions (ambiguous)
//   - all backfill fields are already populated
export function backfillButtonDimensionsFromProbe(payload, probeRows, diagnostics = []) {
  const buttons = payload?.brand?.components?.button;
  if (!Array.isArray(buttons) || buttons.length === 0) return;
  if (!Array.isArray(probeRows) || probeRows.length === 0) return;

  for (let index = 0; index < buttons.length; index += 1) {
    const button = buttons[index];
    if (!isPlainObject(button)) continue;
    // When the agent strips `button.layout` entirely (missing or non-object),
    // reconstruct it as an empty object before the field-level backfill loop.
    // Otherwise the conjunctive `demoteIconOnlyFromButtonPrimary` gate has no
    // dimensions to inspect even when matching probe rows exist.
    if (!isPlainObject(button.layout)) button.layout = {};
    const layout = button.layout;
    const missing = BACKFILL_FIELDS.filter((field) => layout[field] == null);
    if (missing.length === 0) continue;

    const matches = matchesByVisualSignature(button, probeRows);
    if (matches.length === 0) continue;
    const dims = consistentLayoutDimensions(matches);
    if (!dims) continue;

    const applied = [];
    for (const field of missing) {
      if (dims[field] == null) continue;
      layout[field] = dims[field];
      applied.push(field);
    }
    if (applied.length === 0) continue;

    if (Array.isArray(diagnostics)) {
      diagnostics.push({
        path: `$.brand.components.button[${index}].layout`,
        kind: "button-dimensions-backfilled-from-probe",
        message:
          `Backfilled [${applied.join(", ")}] on button[${index}] from ${matches.length} ` +
          `probe row(s) matching (backgroundColor=${button.backgroundColor}, ` +
          `borderRadius=${button.borderRadius}). Agent had stripped these fields when ` +
          `collapsing button entries; downstream safety nets rely on them.`,
      });
    }
  }
}

// `_provenance` marker for synthesised draft rows (BACKLOG item 21).
//
// Several normalize-time helpers emit fresh rows into `brand.colors.*` or
// `brand.typography[]` / `brand.components.productCard[]` when probe
// evidence supports a role but the agent's input lacks the matching row.
// Examples: `synthesizeTextColorRoles`, `synthesizeLogoSvgAccents`,
// `synthesizeRegionBgHints`, `synthesizeContentBgHint`,
// `synthesizeProductCardSurfaceBgHint`, `applyAccentPromotionFromEvidence`,
// `synthesizeProductCardFromEvidence`, `synthesizeTypographyRecordFromSignature`.
//
// The shrinkage gate (`lib/component-shrinkage-gate.js#countableLength`)
// has filtered `_provenance: "scaffold-synthesised"` rows out of the draft
// denominator since its inception — the gate's comment notes the filter is
// "dormant today (no helper sets the field yet), but the filter is in place
// so future synth paths can opt in." This module is the opt-in.
//
// Two concerns: (1) the schema is `additionalProperties: false` on every
// {accent,background,text}ColorToken / typographyStyle / componentDescriptor /
// productCardComponent type, so AJV would reject `_provenance` if it reached
// the validator;
// (2) any consumer reading `brandkit.extraction.json` would see the
// marker as user-facing noise. Both are addressed by stripping the marker
// from the payload IMMEDIATELY BEFORE the AJV call (and therefore before
// the final write). The marker lives only in `brandkit.extraction.draft.json`
// (which is NOT validated and is read only by the shrinkage gate).

export const PROVENANCE_FIELD = "_provenance";
export const PROVENANCE_VALUE_SCAFFOLD_SYNTH = "scaffold-synthesised";

// Mark a freshly synthesised row with the provenance marker. Returns the
// same row mutated in place so callers can `.push(markScaffoldSynthesised({...}))`
// without an extra statement.
export function markScaffoldSynthesised(row) {
  if (row && typeof row === "object") {
    row[PROVENANCE_FIELD] = PROVENANCE_VALUE_SCAFFOLD_SYNTH;
  }
  return row;
}

// Recursive strip-on-emit. Walks every object/array in the payload and
// deletes the `_provenance` key wherever it appears. Idempotent: calling
// it twice is safe. Mutates in place and returns the payload for
// convenience. Pure-data — no schema awareness, so the helper stays
// correct if future schema versions add or remove `_provenance`-bearing
// types.
export function stripProvenanceMarkers(value) {
  if (Array.isArray(value)) {
    for (const item of value) {
      stripProvenanceMarkers(item);
    }
    return value;
  }
  if (value && typeof value === "object") {
    if (Object.prototype.hasOwnProperty.call(value, PROVENANCE_FIELD)) {
      delete value[PROVENANCE_FIELD];
    }
    for (const key of Object.keys(value)) {
      stripProvenanceMarkers(value[key]);
    }
    return value;
  }
  return value;
}

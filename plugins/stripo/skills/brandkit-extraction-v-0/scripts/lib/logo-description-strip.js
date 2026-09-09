// Drop the extraneous `description` field from `brand.logos[]` items
// before AJV sees the payload.
//
// Why: the AJV schema in `references/extraction-stage.schema.json`
// declares `brand.logos` items as a closed shape `{url, type, background,
// svgPath}` (`additionalProperties: false`, lines 338-375). Tier DD P5
// added a SKILL.md note instructing the agent to NOT emit a `description`
// field on logo records, but the post-tier-dd-qw batch found three sites
// where the agent still added the field
// from screenshot evidence ("Header logo image visible on the homepage").
// Each occurrence triggered an AJV retry round (~547k tokens each).
//
// Scope: ONLY the `description` field. No `alt` / dimensions / other
// extras observed in the batch. If a future agent invents another extra
// field, AJV will still surface a clear retry — we'll catch that and
// extend this helper or add a sibling helper. The "narrow scope over
// broad" discipline mirrors `empty-usagehints-strip.js`.
//
// Diagnostic posture: append one info-severity entry per stripped field
// with the logo's identifying signature (type + url) so a reviewer can
// trace what was dropped. Idempotent — a payload with no extra fields
// produces no diagnostics and no mutation.
//
// Non-scope: this helper does NOT validate the entries it keeps; AJV at
// the end of `runNormalize` does that. It only removes the unsupported
// `description` field that would otherwise trigger an AJV retry.
//
// Relationship to SKILL.md L338 (Tier DD P5 closed-shape note): the
// helper is a deterministic safety net for an agent slip, not a license
// to add the field. The prose contract remains authoritative.

export function dropLogoDescriptionFields(payload, diagnostics = []) {
  if (!payload || typeof payload !== "object") return;
  const brand = payload.brand;
  if (!brand || typeof brand !== "object") return;
  const logos = brand.logos;
  if (!Array.isArray(logos) || logos.length === 0) return;

  for (const [idx, logo] of logos.entries()) {
    if (!logo || typeof logo !== "object") continue;
    if (!Object.prototype.hasOwnProperty.call(logo, "description")) continue;
    const type = String(logo.type || "").trim();
    const url = String(logo.url || "").trim();
    delete logo.description;
    if (Array.isArray(diagnostics)) {
      diagnostics.push({
        severity: "info",
        path: `$.brand.logos[${idx}].description`,
        message:
          `Dropped unsupported "description" field from logo ` +
          `(type="${type}" url="${url}"); schema closed-shape only allows ` +
          `{url, type, background, svgPath}.`,
      });
    }
  }
}

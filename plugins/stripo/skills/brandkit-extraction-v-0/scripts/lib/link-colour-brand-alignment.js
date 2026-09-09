// Diagnostic for the editorial gap between `link-text` colour records
// and `brand-primary-accent` colour records. The LLM extraction agent
// chooses which colour carries `link-text`; that's a legitimate
// editorial decision (some brands deliberately style links in a
// neutral colour). But on brand-led sites the link colour usually
// matches the brand primary accent.
//
// Originally surfaced as a regression where the agent dropped a
// brand-primary accent colour and shipped a generic anchor blue on the
// `link-text` record. That's a tagging call that's hard to make wrong
// from raw evidence; the diagnostic flags it as `info` (not `high`) so
// the agent re-checks rather than being told it's wrong.
//
// Decision contract:
//   - Gather all textColors entries tagged `link-text`.
//   - Gather all accentColors entries tagged `brand-primary-accent`.
//   - If NO link-text record exists → emit nothing (the agent may
//     have intentionally omitted it).
//   - If NO brand-primary-accent record exists → emit nothing (no
//     reference value to compare against).
//   - If at least one link-text value matches at least one
//     brand-primary-accent value → emit nothing.
//   - Otherwise emit one diagnostic per link-text record, pointing at
//     its usageHints path so the agent can decide whether to re-tag
//     or leave the editorial mismatch in place.
//
// Comparison is on lowercase hex so case-drift between records (e.g.
// `#ABCDEF` vs `#abcdef`) is treated as a match.

function lowerHex(value) {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.toLowerCase();
}

function recordsByHint(list, hint) {
  if (!Array.isArray(list)) return [];
  const out = [];
  for (const [index, record] of list.entries()) {
    if (!record || typeof record !== "object") continue;
    const hints = Array.isArray(record.usageHints) ? record.usageHints : [];
    if (!hints.includes(hint)) continue;
    const value = lowerHex(record.value);
    if (!value) continue;
    out.push({ index, value });
  }
  return out;
}

export function linkColorBrandAlignmentDiagnostics(payload) {
  const textColors = payload?.brand?.colors?.textColors;
  const accentColors = payload?.brand?.colors?.accentColors;

  const linkRecords = recordsByHint(textColors, "link-text");
  if (linkRecords.length === 0) return [];

  const accentRecords = recordsByHint(accentColors, "brand-primary-accent");
  if (accentRecords.length === 0) return [];

  const accentValues = new Set(accentRecords.map((record) => record.value));
  const aligned = linkRecords.some((record) => accentValues.has(record.value));
  if (aligned) return [];

  return linkRecords.map((record) => ({
    severity: "info",
    path: `$.brand.colors.textColors[${record.index}].usageHints`,
    hint: "link-text",
    value: record.value,
    message:
      "link-text colour does not share value with any brand-primary-accent colour — confirm this is intentional (otherwise re-tag the brand-primary accent on the textColor record). Originally surfaced as a regression where the agent dropped a brand-primary accent value in favour of a generic anchor blue for link-text.",
  }));
}

// Drop typography / button rows whose `usageHints` array is empty
// AFTER all role-tagging passes have run.
//
// Why: the AJV schema in `references/extraction-stage.schema.json`
// declares `usageHintList.minItems: 1` (shared by every channel via
// `$ref`). The scaffolder emits typography rows from
// `typographyFromText` (extraction-pass-helpers.js:486-511) and button
// rows from `buttonFromRow` (extraction-pass-helpers.js:513-552) with
// `usageHints: []` whenever the probe selector / row payload has no
// hint to begin with — by design, expecting the agent or a downstream
// helper to attach a role hint. Rows that survive to the END of
// `normalizeExtraction` with an empty array are roleless probe
// residue: the agent declined to tag (or never reviewed), AND the
// deterministic taggers (`appendTypographyRoleMirrors`,
// `tagProductCardCtaMirrors`) found no signature match. They carry
// real visual data (family/weight/sizePx for typography;
// backgroundColor/fontColor/borderRadius for buttons) but no
// consumer-side downstream consumer.
//
// Channel scope: typography + button ONLY. Color channels
// (accentColors / backgroundColors / textColors) never produce
// empty-hint rows — the scaffolder's `preEmitBrandColours` and the
// synthesis helpers always attach a hint at emit time, and probe
// helpers like `synthesizeTextColorRoles` /
// `backfillHeaderLinkFromScopedEvidence` close any gap. Verified
// across the fix36 batch (five storefronts): empty-hint rows appeared
// only on typography and button arrays.
//
// Order discipline: run this helper LAST in `normalizeExtraction`,
// after `appendTypographyRoleMirrors`, `tagProductCardCtaMirrors`,
// and `stripProductCardCtaFromDescriptionMismatch`. Running before
// the taggers would drop rows the deterministic helpers would have
// rescued via signature match.
//
// Diagnostic posture: append one info-severity entry per dropped row
// listing path + identifying signature so a reviewer can trace what
// was dropped. Idempotent — a payload with no empty-hint rows
// produces no diagnostics and no mutation.
//
// Non-scope: this helper does NOT validate the entries it keeps; AJV
// at the end of `runNormalize` does that. It only removes the
// minItems:1 violators.

function signatureForTypography(row) {
  const family = String(row?.family || "").trim();
  const weight = row?.weight ?? null;
  const sizePx = row?.sizePx ?? null;
  return `family="${family}" weight=${weight} sizePx=${sizePx}`;
}

function signatureForButton(row) {
  const bg = String(row?.backgroundColor || "").trim();
  const fg = String(row?.fontColor || "").trim();
  const radius = row?.borderRadius ?? null;
  return `backgroundColor="${bg}" fontColor="${fg}" borderRadius=${radius}`;
}

function dropChannel(payload, channelPath, rowSignature, diagnostics) {
  const parts = channelPath.split(".");
  let parent = payload;
  for (let i = 0; i < parts.length - 1; i += 1) {
    if (!parent || typeof parent !== "object") return;
    parent = parent[parts[i]];
  }
  const key = parts[parts.length - 1];
  if (!parent || typeof parent !== "object") return;
  const list = parent[key];
  if (!Array.isArray(list) || list.length === 0) return;

  const kept = [];
  let dropCount = 0;
  for (const [idx, row] of list.entries()) {
    const hints = Array.isArray(row?.usageHints) ? row.usageHints : [];
    if (hints.length > 0) {
      kept.push(row);
      continue;
    }
    dropCount += 1;
    if (Array.isArray(diagnostics)) {
      diagnostics.push({
        severity: "info",
        path: `$.${channelPath}[${idx}].usageHints`,
        message: `Dropped row with empty usageHints (${rowSignature(row)}); ` +
          `schema requires minItems:1 and no role-tagging pass matched the row.`,
      });
    }
  }
  if (dropCount > 0) parent[key] = kept;
}

export function dropEmptyUsageHintRows(payload, diagnostics = []) {
  if (!payload || typeof payload !== "object") return;
  dropChannel(payload, "brand.typography", signatureForTypography, diagnostics);
  dropChannel(payload, "brand.components.button", signatureForButton, diagnostics);
}

// Soft-reject the wholesale-rewrite anti-pattern at normalize entry.
//
// Why: scaffolders write rich component arrays (75 buttons + 12 productCards
// + 24 typography rows + a full color palette is typical) so the agent can
// apply targeted edits per SKILL.md "Targeted edits vs wholesale rewrites".
// In practice, on 4 of 5 sites in the fix20 audit batch, the agent
// wholesale-rewrote these arrays — replacing N rows with 1, or filtering
// `usageHints | length > 0` and shipping a fraction. Downstream consumers
// then fell back to white/black defaults (e.g. brand_primary collapsed
// to `#FFFFFF` for a site whose actual brand colour was unique to one
// surface) or aborted entirely.
//
// The wholesale-rewrite syntactic forms vary (`= [...]` assignment,
// `|= map(select())` filter, `jq draft > extraction` redirect), so the
// SKILL.md prose ban catches only the explicit forms. This deterministic
// gate compares cardinality between the scaffold draft and the agent's
// normalize input and refuses to write if either:
//   - the scaffold had >= MIN_FLOOR_FOR_GATE entries AND the agent's
//     input has < 50% of that, OR
//   - any of the four guarded fields above hits the shrinkage signature.
//
// Thresholds (tunable, documented inline):
//   - MIN_FLOOR_FOR_GATE = 10 — protects simple sites whose probe legitimately
//     emitted only 2-3 product cards. A 50% drop on 10 entries means going
//     to 5 (clearly wholesale); on 75 it means going to 37 (also clearly
//     wholesale). Below 10 the floor is too noisy.
//   - SHRINKAGE_FRACTION = 0.5 — clear cutoff. A legitimate dedup on a
//     20-entry array typically removes one or two rows, not ten.
//
// Posture:
//   - Direction-aware: only fires when the input is SMALLER than the
//     draft. The legitimate-growth path — where normalize grows
//     typography (e.g. 7→14) via `appendTypographyRoleMirrors` — is
//     unaffected.
//   - Sidecar-aware: when `brandkit.extraction.draft.json` doesn't exist
//     (older run, hand-authored input), the gate no-ops.
//   - Mode-aware: only fires during normalize. Scaffold doesn't run this.

const MIN_FLOOR_FOR_GATE = 10;
const SHRINKAGE_FRACTION = 0.5;

// Field specs: `[label, accessor]`. Each accessor receives the payload
// (draft or agent input) and returns the array (or null when the path is
// missing). The gate only compares lengths; rich diffs of which rows
// dropped is intentionally out of scope here.
const GUARDED_FIELDS = [
  ["brand.components.button", (p) => p?.brand?.components?.button],
  ["brand.components.productCard", (p) => p?.brand?.components?.productCard],
  ["brand.typography", (p) => p?.brand?.typography],
  ["brand.colors.accentColors", (p) => p?.brand?.colors?.accentColors],
  ["brand.colors.backgroundColors", (p) => p?.brand?.colors?.backgroundColors],
  ["brand.colors.textColors", (p) => p?.brand?.colors?.textColors],
];

// Accessor map exported so the orchestrator (and the recovery-payload
// helper) can route per-path lookups without duplicating the path
// literals. Kept in lock-step with GUARDED_FIELDS above — a new guarded
// field must appear in both.
export const EXTRACTION_FIELD_ACCESSORS = Object.freeze(
  Object.fromEntries(GUARDED_FIELDS.map(([label, accessor]) => [label, accessor])),
);

function lengthOrNull(value) {
  return Array.isArray(value) ? value.length : null;
}

// Some helpers synthesise rows from probe evidence (e.g. typography
// signatures pulled from productCard mirrors). When they do, they tag
// the row with `_provenance: "scaffold-synthesised"`. Those rows are
// not authored by the agent and must not count toward the
// "scaffold-said-N, agent-said-M" cardinality comparison — otherwise a
// legitimate dedup that removes a synthesised duplicate trips the
// gate. Dormant today (no helper sets the field yet), but the filter
// is in place so future synth paths can opt in without revisiting the
// gate.
function countableLength(value) {
  if (!Array.isArray(value)) return null;
  let count = 0;
  for (const row of value) {
    if (row && typeof row === "object" && row._provenance === "scaffold-synthesised") continue;
    count += 1;
  }
  return count;
}

// Pure analysis. Compares draft vs. agent-input cardinalities and returns
// an array of diagnostic entries (one per shrunk field). When the draft
// is `null` (sidecar missing), returns `[]` regardless of input.
//
// Diagnostic shape mirrors `typographyRoleCoverageDiagnostics`:
//   { severity: "high", path, message, draftLength, agentLength, floor, fraction }
//
// The caller (assemble-extraction-stage.js runNormalize) is responsible
// for routing severity:"high" entries into `layoutDiagnostics`, marking
// the normalize as failed in `assembly-diagnostics.json`, and exiting
// non-zero — the same blocking flow `typographyRoleCoverageDiagnostics`
// uses.
export function componentShrinkageDiagnostics(draft, agentInput) {
  if (!draft || typeof draft !== "object") return [];
  if (!agentInput || typeof agentInput !== "object") return [];
  const reports = [];
  for (const [label, accessor] of GUARDED_FIELDS) {
    // Draft denominator excludes rows synth-tagged by upstream helpers
    // (`_provenance: "scaffold-synthesised"`) — those are not authored
    // by the agent and a legitimate dedup that drops one of them must
    // not trip the gate. See `countableLength` rationale above.
    const draftLength = countableLength(accessor(draft));
    const agentLength = lengthOrNull(accessor(agentInput));
    // Skip fields the draft didn't carry (or where access threw → null).
    if (draftLength === null || agentLength === null) continue;
    // Below the floor → too noisy to fire deterministically.
    if (draftLength < MIN_FLOOR_FOR_GATE) continue;
    // Direction-aware: grown / equal arrays don't trip the gate. The
    // floor() matches the spec: `agent_len <= floor(N * 0.5)`.
    const threshold = Math.floor(draftLength * SHRINKAGE_FRACTION);
    if (agentLength > threshold) continue;
    reports.push({
      severity: "high",
      path: `$.${label}`,
      message:
        `[BLOCKER] ${label} shrunk from ${draftLength} (scaffold) to ${agentLength} (agent input). ` +
        `Wholesale-rewrite anti-pattern detected (threshold: scaffold>=${MIN_FLOOR_FOR_GATE} AND input<=${Math.round(SHRINKAGE_FRACTION * 100)}% of scaffold). ` +
        `Restore scaffold rows and apply targeted edits per the "Targeted edits vs wholesale rewrites — worked example" in SKILL.md. ` +
        `See \`references/normalize-safety-nets.md\` (intro + step 1 Dedup) for which mutations normalize will safely apply on its own, and the "Targeted edits vs wholesale rewrites — worked example" section in SKILL.md for the prescribed jq shape.`,
      draftLength,
      agentLength,
      floor: MIN_FLOOR_FOR_GATE,
      fraction: SHRINKAGE_FRACTION,
    });
  }
  return reports;
}

// Constants exported for tests (and for future tuning to be a single
// source of truth — no parallel literal in the test file).
export const COMPONENT_SHRINKAGE_FLOOR = MIN_FLOOR_FOR_GATE;
export const COMPONENT_SHRINKAGE_FRACTION = SHRINKAGE_FRACTION;

// Per-field row summarisers used by the recovery payload below. The
// summariser projects a row onto the fields that uniquely identify it
// for the purpose of "did this draft row survive into the agent
// input?" — full rows can carry helper-tagged metadata (e.g.
// `_provenance`) that varies between draft and input and would cause
// spurious "dropped" reports if compared by JSON-equality.
const SUMMARISERS = Object.freeze({
  "brand.components.button":           (r) => ({ selector: r?.selector ?? null, variant: r?.variant ?? null, textContent: r?.textContent ?? null }),
  "brand.components.productCard":      (r) => ({ cta_bg: r?.cta?.backgroundColor ?? null, ribbon_show: r?.ribbon?.show ?? null }),
  "brand.typography":                  (r) => ({ family: r?.family ?? null, sizePx: r?.sizePx ?? null, weight: r?.weight ?? null, usageHints: Array.isArray(r?.usageHints) ? r.usageHints : [] }),
  "brand.colors.accentColors":         (r) => ({ value: r?.value ?? null, usageHints: Array.isArray(r?.usageHints) ? r.usageHints : [] }),
  "brand.colors.backgroundColors":     (r) => ({ value: r?.value ?? null, usageHints: Array.isArray(r?.usageHints) ? r.usageHints : [] }),
  "brand.colors.textColors":           (r) => ({ value: r?.value ?? null, usageHints: Array.isArray(r?.usageHints) ? r.usageHints : [] }),
});

const ROW_CAP = 40;

// Build a sidecar payload describing exactly which draft rows dropped
// out of the agent's normalize input on each shrunk field. The
// orchestrator writes this beside `assembly-diagnostics.json` when the
// gate fires so the agent can read a KB-scale sidecar instead of
// re-reading the hundreds-of-KB `brandkit.extraction.draft.json` to
// reconstruct the diff. Pure function — no I/O.
//
// `accessors`: map from the `path` label (e.g. `brand.components.button`)
// to a function `(payload) => Array | undefined`. Pass the gate's own
// `EXTRACTION_FIELD_ACCESSORS` export so the sidecar walks the same set
// of fields the gate guards.
export function buildShrinkageRecoveryPayload(draft, agentInput, reports, accessors) {
  const fields = {};
  if (!Array.isArray(reports) || reports.length === 0) {
    return { generatedAt: new Date().toISOString(), fields };
  }
  for (const { path: rawPath, draftLength, agentLength } of reports) {
    const label = String(rawPath || "").replace(/^\$\./, "");
    const accessor = accessors?.[label];
    if (typeof accessor !== "function") continue;
    const draftArr = Array.isArray(accessor(draft)) ? accessor(draft) : [];
    const agentArr = Array.isArray(accessor(agentInput)) ? accessor(agentInput) : [];
    const summarise = SUMMARISERS[label] || ((r) => r);
    const agentSigs = new Set(agentArr.map((r) => JSON.stringify(summarise(r))));
    const dropped = [];
    for (let i = 0; i < draftArr.length; i++) {
      const sig = JSON.stringify(summarise(draftArr[i]));
      if (!agentSigs.has(sig)) dropped.push({ draftIndex: i, ...summarise(draftArr[i]) });
    }
    fields[label] = {
      draftLength,
      agentLength,
      droppedCount: dropped.length,
      droppedRows: dropped.slice(0, ROW_CAP),
      truncated: dropped.length > ROW_CAP,
      action: `Restore these draft rows in your normalize input, or align your input shape with the scaffold draft — do not wholesale-rewrite. See SKILL.md "Targeted edits vs wholesale rewrites".`,
    };
  }
  return { generatedAt: new Date().toISOString(), fields };
}

// Exported for tests so the row-cap and summariser shape are pinned by
// the test suite, not redeclared per test.
export const SHRINKAGE_RECOVERY_ROW_CAP = ROW_CAP;
export const SHRINKAGE_RECOVERY_SUMMARISERS = SUMMARISERS;

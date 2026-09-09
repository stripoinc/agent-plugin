// Build a compact summary of `assembly-diagnostics.json` for the recovery
// path (BACKLOG item 23).
//
// On a slug that takes 3-4 normalize turns, the full diagnostics file is
// large (~29 KB on high-component-density retail-class sites) — the
// agent re-reads it each turn to spot what changed, burning ~90K input
// tokens per turn. The vast majority of those bytes are severity:"info"
// entries that surface only for human audit; the agent's recovery loop
// reads `errors` and the severity:"high" rows.
//
// `buildDiagnosticsSummary(full)` returns a parallel ~3 KB payload that
// the orchestrator writes alongside the full file. The summary carries
// every severity:"high" entry across the standard diagnostic arrays,
// includes `errors` only when validation produced errors, carries
// `candidates` verbatim whenever the full diagnostics has it (all writes
// except the component-shrinkage-gate blocker; it is irreplaceable for
// the recovery path — agents read it to pick role decisions), and
// records the full-file pointer at `_seeFullDiagnostics`.
//
// Sections with zero high entries are omitted: keeping empty arrays in
// the summary defeats the size win. The full file remains the source of
// truth for severity:"info" / "warn" entries and for any non-array
// diagnostics not surfaced here.
//
// Pure helper: no I/O, no orchestrator coupling beyond the field names.

import { isUnresolvedRoleEntry } from "./role-coverage-reasons.js";

export const FULL_DIAGNOSTICS_FILENAME = "assembly-diagnostics.json";
export const SUMMARY_DIAGNOSTICS_FILENAME = "assembly-diagnostics.summary.json";

// Field names whose value is an array of `{ severity, ... }` diagnostic
// entries. Each is filtered down to its severity:"high" subset; sections
// where the subset is empty are dropped from the summary.
const HIGH_SEVERITY_ARRAY_FIELDS = [
  "layoutDiagnostics",
  "roleChoiceGaps",
  "typographyRoleCoverage",
  "textColorRoleCoverage",
  "productCardCtaContract",
  "homepagePassContract",
  "colorRoleHintDuplication",
  "linkColorBrandAlignment",
  "productCardCtaSelection",
  "productCardVariantDecision",
  "productCardTypographyMirrors",
];

function highOnly(entries) {
  if (!Array.isArray(entries)) return [];
  return entries.filter((entry) => entry && entry.severity === "high");
}

// The two role-coverage arrays whose unresolved entries must reach the summary
// REGARDLESS of severity. Everything else here is selected by `severity ===
// "high"`, and for these two that predicate is about to stop matching: the
// styling severities move to "gap" so they no longer stop the run. The
// recovery path is the reason this matters -- `SKILL.md` tells the agent to
// read this file FIRST on a recovery turn, so a condition that vanishes from
// here is a condition the agent never learns about, whatever the full file
// says.
const UNRESOLVED_ROLE_ARRAY_FIELDS = ["typographyRoleCoverage", "textColorRoleCoverage"];

// NOT "every gap". An honest gap (`reason: "no_evidence"`) is a property of the
// page that re-probing cannot close, the skill tells the agent not to act on
// it, and admitting it here would put an entry in the summary for a large
// share of captures -- inflating the one file that exists to be small. Only
// the three reasons that name something the run could not stand behind are
// carried; `isUnresolvedRoleEntry` owns that list.
function unresolvedOnly(entries) {
  if (!Array.isArray(entries)) return [];
  return entries.filter((entry) => isUnresolvedRoleEntry(entry) && entry.severity !== "high");
}

export function buildDiagnosticsSummary(full) {
  const summary = {
    mode: full?.mode ?? null,
    schemaValidated: full?.schemaValidated ?? false,
  };
  if (full && typeof full.normalizeAttempt !== "undefined") {
    summary.normalizeAttempt = full.normalizeAttempt;
  }
  // Errors are always surfaced — they are the cheapest pointer to "what
  // the orchestrator threw on this turn." Omitted only when absent.
  if (Array.isArray(full?.errors) && full.errors.length > 0) {
    summary.errors = full.errors;
  }
  // High-severity entries per known array source. Each section is
  // surfaced under its original name with a `_high` suffix so a reader
  // can grep for either form without confusion.
  for (const field of HIGH_SEVERITY_ARRAY_FIELDS) {
    const filtered = highOnly(full?.[field]);
    if (filtered.length > 0) {
      summary[`${field}_high`] = filtered;
    }
  }
  // Unresolved role-coverage entries that are NOT already carried by the
  // `_high` section above. The suffix differs so a reader can tell a fatal
  // finding from an advisory one at a glance, and so neither section can
  // silently absorb the other's rows.
  for (const field of UNRESOLVED_ROLE_ARRAY_FIELDS) {
    const filtered = unresolvedOnly(full?.[field]);
    if (filtered.length > 0) {
      summary[`${field}_unresolved`] = filtered;
    }
  }
  // Candidates is irreplaceable for the recovery path — the agent reads
  // it to pick role decisions. Carry it verbatim.
  if (full && typeof full.candidates !== "undefined") {
    summary.candidates = full.candidates;
  }
  summary._seeFullDiagnostics = FULL_DIAGNOSTICS_FILENAME;
  return summary;
}

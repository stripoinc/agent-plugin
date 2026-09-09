// Normalize retry budget (BACKLOG item 24).
//
// `--mode normalize` is meant to be self-converging: the scaffolder pre-tags
// most of the deterministic decisions, the agent applies targeted edits, and
// normalize re-runs the deterministic helpers + validates. In practice we've
// seen pathological loops where the agent re-rolls the same edit four times
// burning ~1M tokens because diagnostics keep surfacing the same severity:
// "high" entry the agent cannot fix from the available evidence.
//
// This helper caps the loop at MAX_NORMALIZE_ATTEMPTS. The orchestrator
// exports BRANDKIT_NORMALIZE_ATTEMPT into the agent's shell (defaults to 1
// when the var is unset, e.g. for legacy callers). When the agent re-invokes
// normalize, it must increment the env var. When attempt N reaches the cap
// AND any layoutDiagnostics entry still has `severity === "high"`, we emit a
// terminal-state diagnostic and the caller exits non-zero so the run fails
// fast rather than continuing into a fifth turn.
//
// The diagnostic body always includes `normalizeAttempt: N` regardless of
// whether the cap was hit — visible state is the cheapest debugging aid.
//
// Pure helper: no I/O, no env reads. Caller passes attempt + diagnostics
// array, helper returns `{ attempt, terminalDiagnostic }`.

export const MAX_NORMALIZE_ATTEMPTS = 3;

// Parse the BRANDKIT_NORMALIZE_ATTEMPT env value into a 1-based integer
// attempt index. Missing / empty / non-numeric → 1 (first attempt). Negative
// or zero → 1. Values above the cap are clamped to the cap so a misbehaving
// caller cannot silently bypass the gate.
export function parseNormalizeAttempt(rawEnvValue) {
  if (rawEnvValue === undefined || rawEnvValue === null) return 1;
  const text = String(rawEnvValue).trim();
  if (!text) return 1;
  const parsed = Number.parseInt(text, 10);
  if (!Number.isFinite(parsed) || parsed < 1) return 1;
  if (parsed > MAX_NORMALIZE_ATTEMPTS) return MAX_NORMALIZE_ATTEMPTS;
  return parsed;
}

// Build the cap-exhausted diagnostic entry, or return null when the budget
// is not yet exhausted. Called once per normalize run after the diagnostic
// arrays have been assembled.
//
// The helper inspects every array passed in `diagnosticArrays`: a `severity:
// "high"` entry anywhere means at least one deterministic check failed AND
// the agent could not close the gap this turn. When (attempt >= cap) AND
// (any high entry exists), return the terminal diagnostic to merge into the
// orchestrator's `errors` array so the caller can write the file and exit
// non-zero. Otherwise return null.
//
// Accepts either a single array (legacy single-source caller) or a list of
// arrays — `flat()` collapses both shapes uniformly so the helper does not
// have to special-case its input.
//
// `options.hasAuthoredRepair` decides the message's LAST sentence, and it is
// the caller's to compute rather than this helper's: the predicate lives in
// `role-evidence.js`, which reaches `extraction-pass-helpers.js`, and importing
// it here would close an import cycle through this module. The caller
// (`normalize-pass.js`) already holds that split for the gates below the budget
// gate, so it passes what it already knows.
//
// WHY THE SENTENCE MOVES AT ALL. An `authored_without_evidence` entry is the
// one terminal-looking `high` with a legal one-line repair, and that repair
// REQUIRES the rerun this budget forbids -- so "and stop" handed to it is an
// operational contradiction, and an agent obeying both does nothing. The
// authorization is bounded by `parseNormalizeAttempt`, which clamps above the
// cap: a corrective rerun costs one turn and cannot loop. Every OTHER cause
// this message enumerates keeps "and stop" unchanged.
export function buildNormalizeAttemptDiagnostic(attempt, diagnosticArrays, options = {}) {
  const safeAttempt = Number.isInteger(attempt) && attempt >= 1 ? attempt : 1;
  if (safeAttempt < MAX_NORMALIZE_ATTEMPTS) return null;
  const entries = Array.isArray(diagnosticArrays) ? diagnosticArrays.flat() : [];
  if (entries.length === 0) return null;
  const hasHigh = entries.some(
    (entry) => entry && entry.severity === "high",
  );
  if (!hasHigh) return null;
  const hasAuthoredRepair = options.hasAuthoredRepair === true;
  return {
    path: "$.normalizeAttempt",
    severity: "high",
    message:
      `Normalize attempt ${safeAttempt} of ${MAX_NORMALIZE_ATTEMPTS} reached without resolution. ` +
      `A \`high\` entry survived the budget. Where none of them is ` +
      `\`authored_without_evidence\`, that means ONE OF THREE things: a ` +
      `deterministic producer faulted; OR probe provenance could not be proven ` +
      `-- a missing or narrowed \`text-styles.probed.json\`, which grades ` +
      `unproven rather than absent precisely because the run cannot tell; OR the ` +
      `\`text-styles.json\` capture is itself empty or absent, which is a probe ` +
      `failure and not an authorship one. A FOURTH state does reach this ` +
      `diagnostic and is the only one with an in-run repair: a role whose ` +
      `evidence is ABSENT but whose hint is PRESENT is graded ` +
      `\`authored_without_evidence\` at \`high\`, not \`gap\`. Only a role with ` +
      `absent evidence and NO hint is graded \`gap\`, and that one never reaches ` +
      `this diagnostic. ` +
      (hasAuthoredRepair
        ? `THIS RUN CARRIES ONE. Apply the \`authored_without_evidence\` repair ` +
          `printed below -- REMOVE the named hint from the \`usageHints\` array ` +
          `that carries it -- and RE-RUN normalize once more with ` +
          `BRANDKIT_NORMALIZE_ATTEMPT=3. That rerun is AUTHORIZED: ` +
          `parseNormalizeAttempt clamps anything above the cap back to the cap, ` +
          `so it costs exactly one turn and cannot loop. Mark unresolved ` +
          `productCard fields with missingEvidence, and report every OTHER ` +
          `surviving \`high\` entry as a blocker, and stop.`
        : `THIS RUN CARRIES NONE, so there is no repair to apply. Mark ` +
          `unresolved productCard fields with missingEvidence, report the ` +
          `surviving \`high\` entries as a blocker, and stop.`),
  };
}

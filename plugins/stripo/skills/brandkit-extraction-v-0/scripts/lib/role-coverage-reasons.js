// The `reason` vocabulary both role-coverage channels stamp on their entries.
//
// A LEAF MODULE ON PURPOSE, and that is the whole reason it exists rather than
// these strings living in `role-evidence.js` where they were written.
// `role-evidence.js` imports `extraction-pass-helpers.js`, which imports
// `diagnostics-summary.js`; so the summary builder — which must now select
// entries BY REASON rather than by severity — cannot import the spellings from
// `role-evidence.js` without closing an import cycle. `normalize-attempt-budget.js`
// already documents that same cycle as the reason it takes a boolean from its
// caller instead of computing one. This module has no imports, so anything may
// read it.
//
// `role-evidence.js` re-exports every one of them, so each existing importer keeps its
// current import site and there is still exactly ONE definition of each string.

// No selector produced this role, and nothing else could have either. The
// honest gap: recorded, reported, and never a fault.
export const EVIDENCE_ABSENT = "no_evidence";

// The role is PRESENT on a row while the capture proves nothing could have
// derived it. The value was authored.
export const AUTHORED_WITHOUT_EVIDENCE = "authored_without_evidence";

// The role is present AND derivable here, but the value on at least one row
// carrying it is not one the capture measured.
export const VALUE_NOT_MEASURED = "value_not_measured";

// A required role is ABSENT from the payload although this capture offers the
// evidence to produce it (or the run could not tell whether it does). A
// deterministic producer should have written it and did not.
//
// WHY THIS SPELLING EXISTS AT ALL. This entry used to carry no `reason` and be
// told apart from the honest gap by `severity: "high"` alone. Once the styling
// severities are demoted the two become `severity: "gap"` together, and the
// only remaining discriminator would be the ABSENCE of a `reason` field —
// a negative test, and one that reads a producer fault as
// `reason: "no_evidence"` in `finalize-report.json.gaps[]`, which is a false
// statement about the page: the evidence is exactly what IS present. Naming the
// condition keeps every consumer's selection positive and the report truthful.
export const ROLE_NOT_PRODUCED = "role_not_produced";

// The capture DOES hold rows for this role, and every colour on them is
// illegible on this page's own canvas -- under 3:1, the email large-text
// floor. The synthesiser declines to publish such a value, so the role is
// absent, and this names WHY it is absent.
//
// A SECOND HONEST GAP, not a fourth fault. Like `EVIDENCE_ABSENT` it describes
// the page rather than something the run left undone: there is nothing an
// agent, a re-probe or a recovery pass can do about a footer-grey body colour
// on a white canvas, and the builder's own default is a better answer than a
// value nobody could read. So it is deliberately NOT in
// `UNRESOLVED_ROLE_REASONS` below -- it must not enter the retry budget, the
// recovery summary, or the finalize warnings. It exists because reporting it
// as `no_evidence` would be false about the page: the evidence is exactly what
// IS there.
export const ILLEGIBLE_ON_CANVAS = "illegible_on_canvas";

// The three reasons that mean "the run could not stand behind this role".
// `EVIDENCE_ABSENT` is deliberately NOT here: an honest gap is a property of
// the page, not something the run left undone, and sweeping it in is what
// would turn every gapped capture into a recovery-path entry.
export const UNRESOLVED_ROLE_REASONS = Object.freeze([
  AUTHORED_WITHOUT_EVIDENCE,
  VALUE_NOT_MEASURED,
  ROLE_NOT_PRODUCED,
]);

export function isUnresolvedRoleEntry(entry) {
  return Boolean(entry) && UNRESOLVED_ROLE_REASONS.includes(entry.reason);
}

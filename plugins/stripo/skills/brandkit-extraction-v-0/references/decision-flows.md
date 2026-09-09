<!-- Moved out of SKILL.md by the 0.3.0 contract split. The text below is
     verbatim from SKILL.md at sha256 6cdd8d5975fa8aca548fbe00d5507260bf6d5ec6522d61ddaa0e4fa512ef9609. -->

# Decision flows index, output layout and default commands

The run's shape: what it produces, where it writes, and what every command it runs means.

The four files of this family, each readable in one tool call:

- [`decision-flows.md`](decision-flows.md) — goal, output layout, the full prose for every default command, the runtime-facing scripts, the reference index.
- [`workflow-phases.md`](workflow-phases.md) — phases 1-3 in prose, the targeted-edits worked example, and what the scaffolder pre-tags for you.
- [`role-decision-rules.md`](role-decision-rules.md) — recovery budget and confidence bands, then the per-role flows: colour, region-scoped links, important links, descriptions, button preservation.
- [`extraction-stage-json.md`](extraction-stage-json.md) — the extraction-stage JSON, the canonical `usageHints` enums, product-card specifics, the variant pick, and the hard rules in full.

**Goal.** Produce `brandkit.extraction.json` (path + all non-voice public brand fields) from the rendered homepage. Then continue, in the same agent turn, with `$brandkit-tone-of-voice-v-0` to derive `brand.brandVoice` and `$brandkit-business-context-v-0` to derive `brand.businessContext`, both into the same technical directory. **You write each satellite's task envelope yourself**: when invoking `$brandkit-tone-of-voice-v-0` and `$brandkit-business-context-v-0`, include the envelope line `technical dir: <absolute-path>` in the satellite's task text, where `<absolute-path>` is the fully resolved `${BRANDKIT_ARTIFACTS_ROOT}/technical/<slug>` (a concrete absolute path — never an unresolved placeholder). The satellites consume that line verbatim and are forbidden from constructing the path themselves. Then run the finalize CLI ([Default Commands](#default-commands), Phase 4) — it assembles the final `brandkit.json` and `brandkit.html` from those technical artifacts, and it is the last step before the save. **It is not where the run ends.** Phase 5 follows it in the same turn — writing two small documents of its own and ending with the `report` command, the run's last CLI call: it offers to save the composed brandkit to the account Brand Kit, and every run that reached a promoted Phase 4 owes a persist line in its final reply ([Persist outcome](#persist-outcome--always-reported-never-implied)). A turn that stops after Phase 4 has silently skipped the save.

**Success criteria.**
- Schema-valid against `references/extraction-stage.schema.json`.
- Evidence-backed factual fields and `dom-measured` / `agent-recovered` styling. A labelled styling fallback is allowed for a usable kit only after an eligible exact DOM re-probe failure: a color may come from a hash-bound screenshot region, while typography comes from a complete same-run captured row or the fixed conservative system tuple and is never inferred from pixels.
- Conservative on ambiguity: prefer `missingEvidence` for factual/structural uncertainty; for a missing styling role, use the bounded, provenance-labelled Phase 2.5 fallback when its prerequisites hold.
- Validators pass: `--mode normalize` exits cleanly and the finalize CLI's semantic / required-with-evidence checks succeed.
- Fallback when recovery is exhausted: see [Stop conditions → Recovery budget exhausted](#stop-conditions) for the canonical terminal-state statement. (One of five terminal states in the matrix below.)
- Normalize retry budget: at most **three** `--mode normalize` invocations per slug, plus the one corrective rerun attempt 3 authorizes when it hands back an `authored_without_evidence` repair — see [Stop conditions → Normalize retry budget exhausted](#stop-conditions) for the counter discipline and terminal state.

**Skip the tone-of-voice and business-context handoffs** only when (a) the homepage was blocked (see Stop matrix), or (b) the user request explicitly says "skip brand voice" / "extraction only". The same two skip conditions apply to both handoffs; the finalize CLI fills `brand.brandVoice` and `brand.businessContext` with empty fallbacks when they are skipped.

The task text supplies the target website URL and slug. Substitute them into commands and into every `${BRANDKIT_ARTIFACTS_ROOT}/technical/<slug>/` path.

## Output Layout

For slug `<slug>`, write technical extraction artifacts under:

```text
${BRANDKIT_ARTIFACTS_ROOT}/technical/<slug>/
```

The extraction-stage JSON must be:

```text
${BRANDKIT_ARTIFACTS_ROOT}/technical/<slug>/brandkit.extraction.json
```

Do not write final `brandkit.json`, final `brandkit.html`, `brand-voice.json`, or `business-context.json`. The finalize CLI owns final composition and validation (you run it — [Default Commands](#default-commands), Phase 4); the satellite skills own their own intermediate files.

Phase 5 transcribes nothing of the Brand Kit: it uploads `brandkit.json` — the finalize CLI's own output, unedited — by path, names the upload session to the MCP tool that writes it, and reads the account back through another. The only files it writes are the failure/result document the 5a/5b/5c cells save (`persist-write.json`) and the read-back `report` saves itself (`persist-readback.json`), which `report` reads by path; the Brand Kit itself never passes through a tool argument or a shell, so there is nothing on this path that a bad copy could corrupt.
## Default Commands

Phase 0 — prepare (required first step; thread workspaces persist across runs, so stale probe evidence and agent-authored intermediates must be cleared before a new pass):

```bash
python "${BRANDKIT_SKILL_ROOT}/scripts/finalize.py" prepare --technical-dir ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example
```

`prepare` prints `{"cleared": [...], "failures": [...]}`. **Exit 0 = `failures` is empty and the workspace is clean.** Exit 1 = at least one path could not be cleared; each `failures` entry names the path, the cause, and what an OPERATOR has to check to clear it — it is not a command for you to run, and this runtime refuses a forced `rm` before it starts. **On a non-zero `prepare`, report the named paths and STOP — do not start an extraction on a workspace you could not clear.** A surviving satellite stop file is the reason: it would make every future run of this slug exit 4 quoting a reason from a run that is long over, and nothing else on the path removes it. Exit 64 = usage error (malformed invocation — re-check the command and that `--technical-dir` is a fully resolved absolute path. `--technical-dir` is the ONLY flag `prepare` accepts, so adding any other — `--out-dir` above all, which belongs to Phase 4 — is itself an exit-64 "unrecognized arguments". Not a brandkit outcome).

`prepare` clears the technical dir only. The out-dir is Phase 4's to manage: it promotes `brandkit.json` and `brandkit.html` together, on a clean outcome only, so anything left there from an earlier run is a complete pair rather than a half-written one. That is why Phase 5 keys off `finalize-report.json`'s `promoted` rather than off the file being present.

Phase 1 — homepage batch:

```bash
node ${BRANDKIT_SKILL_ROOT}/scripts/homepage-pass.js --url "https://store.example" --slug "store-example" --artifacts-root ${BRANDKIT_ARTIFACTS_ROOT}
```

Writes homepage screenshot, capture metadata (with bounded homepage-copy snippets), DOM, background / text / button / product-card style probes, `product-card-styles.recovery.json` (recovery summary, always written), page signals, optional language-subtree evidence, and `homepage-pass-status.json`. The final status includes non-negative `phaseTimingsMs` values and `phaseTimingsMs.total`.
It also writes `product-data.json`, a downstream-only artifact the finalize CLI embeds into the final brandkit as `brand.products`: never read, edit, or author it. When the proxy policy permits it, this packaged command alone may perform one release-before-mint residential retry for a conservatively proven live security interstitial. `securityInterstitialFallback` in the status records eligibility, attempt and outcome without session ids or replay URLs.

Phase 2 — schema-shaped scaffold:

This pass also writes the private technical sidecar `product-card-probe-binding.json`; do not edit it or copy it into the brandkit. Normalize uses its canonical filtered-row digest to accept product-card CTA endorsements only from the same scaffold run. A missing, malformed, or mismatched sidecar fails that endorsement closed while allowlisted and strong CTA paths continue normally. The sidecar is separate because normalize rewrites assembly diagnostics on every retry.

```bash
node ${BRANDKIT_SKILL_ROOT}/scripts/assemble-extraction-stage.js --mode scaffold --slug "store-example" --artifacts-root ${BRANDKIT_ARTIFACTS_ROOT} --url "https://store.example" --pretty
```

Writes `brandkit.extraction.draft.json` plus a paired `assembly-diagnostics.json` / `assembly-diagnostics.summary.json` (with pre-ranked role candidates). The scaffolder is shape-safe but does not own role decisions; review against saved evidence and write your final reviewed extraction to `brandkit.extraction.json`. **On recovery turns, read `assembly-diagnostics.summary.json` first** (a ~3 KB high-severity projection that carries `candidates` on every scaffold and normalize write — an empty role array means no defensible candidate — except a component-shrinkage-gate failure, which routes recovery through `assembly-diagnostics-shrinkage-recovery.json` instead; `errors` appears on any turn the run recorded a finding, whether or not it stopped. Check key presence before indexing.); the summary also carries `typographyRoleCoverage_unresolved` / `textColorRoleCoverage_unresolved` — the role-coverage findings that no longer stop the run but still name a value or role deterministic extraction did not support. Open the full `assembly-diagnostics.json` only when the summary names a `$.path` you need to inspect. Read it as a checklist of recoverable evidence gaps (canonical hint violations, missing product-card sub-evidence); rerun only the focused packaged probe needed to close each gap, and only ever with MORE selectors than the default set, never fewer. **Region-role coverage is on that checklist only by `reason`, never by severity.** Every role-coverage entry now carries `severity: "gap"`, so the severity tells you nothing: `no_evidence` and `role_not_produced` describe deterministic-lane misses that Phase 2.5 may close when the screenshot/DOM identifies a concrete semantic target; otherwise leave them as gaps. `authored_without_evidence` and `value_not_measured` name an existing unsupported carrier and follow their measured-value repairs below.

Phase 3 — normalize:

```bash
node ${BRANDKIT_SKILL_ROOT}/scripts/assemble-extraction-stage.js --mode normalize --input ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/brandkit.extraction.json --slug "store-example" --artifacts-root ${BRANDKIT_ARTIFACTS_ROOT} --url "https://store.example" --pretty
```

Validates, sanitizes, canonicalizes aliases, applies any schema-valid run-bound role recovery after deterministic producers have run, and produces final diagnostics. Normalize does not make a semantic choice: the agent-selected locator and fallback source live in the recovery request, and values that do not exactly match its machine evidence earn no recovered grade.

Phase 4 — finalize (mandatory, after both satellite handoffs; it composes and promotes the Brand Kit — Phase 5 still follows it, and its `report` command is the run's last CLI call):

```bash
python "${BRANDKIT_SKILL_ROOT}/scripts/finalize.py" run --technical-dir ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example --skill-root ${BRANDKIT_SKILL_ROOT} --url "https://store.example" --slug "store-example" --out-dir ${BRANDKIT_ARTIFACTS_ROOT}/store-example
```

Exit 0 = composed (final `brandkit.json` + `brandkit.html` written under `--out-dir`). Exit 3 = homepage-blocked. Exit 4 = technical-artifact blockers **or a satellite hard stop** — report them and stop. The exit-4 set is narrow by design: wrong-site identity; invented contacts, social URLs, or logo asset URLs; unsafe SVG; a hand-edited diagnostics file; an unreadable or wrong-shaped gate input; a false-fallback bundle; and a satellite refusing on its own site-match check. **No styling condition is on it** — typography, colours, buttons, surfaces and component roles are recorded as warnings and the kit is published, because a refused run persists nothing at all. Exit 1 = internal error (`finalize-report.json` is still written when possible — read it and report the failure). Exit 64 = usage error (malformed invocation — re-check your command line; not a brandkit outcome).

**A non-zero exit always means this run promoted nothing.** `finalize-report.json` is written for every outcome and states it (`promoted` / `brandkit_sha256`; a non-null sha only when `promoted` is true). Two cases produce no report at all, and both emit the same one-line structured JSON on stderr instead — `{"status": "error", "report_written": false, "promoted": <bool>, "out_dir": …, "error": …}`: an out-dir so broken the report cannot be written, and a **refused concurrent run** — a second finalize against the same `--out-dir` loses an exclusive lock and writes nothing at all (no staging, no promotion, and deliberately no report, so it cannot contradict the winner's), naming the owning pid in `error`. When you see the refusal, read the winner's `finalize-report.json` rather than re-running.

`finalize-report.json` carries `status`, `promoted`, `brandkit_sha256`, `blockers`, `warnings`, `gaps`, `logo_hosting`, `timings_ms`, and — only on `status: "error"` — `error`. **`promoted` answers "did THIS run write the brandkit?"**: the CLI stages the pair and promotes it as the last step, on a clean outcome only, so `promoted: false` means every artifact under `--out-dir` is left over from an earlier run and is byte-identical to what was there before. `brandkit_sha256` is non-null only when `promoted` is true — a null hash beside existing files is not a contradiction, it means this run did not produce them. Never report a blocked or errored run as though it had refreshed the brandkit, and never hand-edit the outputs to make one look composed.

## Runtime-Facing Scripts

- `scripts/homepage-pass.js`: default batched homepage evidence path.
- `scripts/assemble-extraction-stage.js`: `--mode scaffold` creates a shape-safe candidate extraction-stage draft and diagnostics; `--mode normalize --input <path>` validates, sanitizes, canonicalizes, and diagnoses an agent-authored draft.
- `scripts/recover-role-styles.js`: exact, run-bound styling-role re-probe and eligible color/typography fallback producer; writes `agent-role-recovery.json` from `agent-role-recovery.request.json`.
- `scripts/capture-page.js`: standalone screenshot/capture fallback.
- `scripts/dom-hierarchy.js`: standalone visible DOM fallback.
- `scripts/language-subtree.js`: homepage language-control subtree after a bounded toggle action.
- `scripts/background-styles.js`: standalone background evidence probe.
- `scripts/text-styles.js`: standalone typography evidence probe.
- `scripts/button-styles.js`: standalone button evidence probe with hover/layout/source signals.
- `scripts/product-card-styles.js`: standalone neutral product-card evidence probe.
- `scripts/run-playwright-fix.js`: JSON-only page actions for cookie/modal/locale fixes.
- `scripts/run-scratch-probe.js`: controlled run-local scratch evidence probes under `${BRANDKIT_ARTIFACTS_ROOT}/technical/<slug>/scratch/`.
- `scripts/save-logo-asset.js`: technical logo asset saving only, and a fallback — `homepage-pass.js` already keeps the SVG logo bytes it rendered (see **Logo flow**).
- `scripts/extract-svg-path.js`: optional SVG markup extraction after a public URL is known, for a logo the homepage pass did not capture.
- `scripts/normalize-cyrillic-text.js`: normalize retrieved Cyrillic text fields.
- `scripts/upload_via_proxy.sh`: used internally by the finalizer for a captured logo SVG and by Phase 5b for the composed `brandkit.json`. The agent invokes it only for Phase 5b. Never fetch or PUT a signed Reteno URL any other way.
- image viewer available in the current session:
  Inspect screenshots saved by `homepage-pass.js`, `capture-page.js`, or
  `run-playwright-fix.js` when visual confirmation is needed. Use the exact
  saved artifact path. Do not assume a specific tool name.

Never invoke: `scripts/probe-helpers-runner.js`, `scripts/social-signals.js`, `scripts/validate-skill-output.js`, `scripts/render-brand-kit-html.js` — test / library / finalize material, not part of the agent flow (the finalize CLI invokes `validate-skill-output.js` and `render-brand-kit-html.js` itself).

## Reference index

The skill ships these reference files. Most are loaded only when the agent (or a downstream consumer / operator) needs them:

| File | Audience | When to read |
| --- | --- | --- |
| [`references/extraction-stage.schema.json`](references/extraction-stage.schema.json) | Agent + downstream | Validation target for `brandkit.extraction.json`. The agent reads it implicitly via `--mode normalize`; downstream consumers validate the technical-stage artifact against it. |
| [`references/schema.json`](references/schema.json) | Downstream consumers | Validation target for the finalize-composed `${BRANDKIT_ARTIFACTS_ROOT}/<slug>/brandkit.json` (with `brand.brandVoice` required and optional `brand.businessContext` / `brand.products`). DB writers and validators consume this. |
| [`references/schema.md`](references/schema.md) | Downstream consumers, schema readers | Human-readable overview of the two-schema split + canonical hint values. |
| [`references/product-card-variants.md`](references/product-card-variants.md) | Agent | Variant geometry + decision tree for `recommendedVariantIndex`. Read when the scaffolder commits a non-null index or when authoring during ambiguity. |
| [`references/scratch-probe-contract.md`](references/scratch-probe-contract.md) | Agent | Rules for `run-scratch-probe.js`. Read only when a packaged probe cannot answer the question. |
| [`references/normalize-safety-nets.md`](references/normalize-safety-nets.md) | Agent | What normalize will silently fix vs. what it diagnoses. Read on recovery turns. |
| [`references/assembly-contract.json`](references/assembly-contract.json) | Downstream consumers, operators | Stable contract for which actor owns which artifact + public-output rules. |
| [`references/technical-artifact-contract.json`](references/technical-artifact-contract.json) | Downstream consumers, operators | Reference for what each per-slug technical artifact contains and how the assembler uses it. |
| [`references/tool-contracts.md`](references/tool-contracts.md) | Agent (focused-probe recovery), operators | Wrapper / probe flag matrix + per-wrapper examples + public-output rules. Read when you need a wrapper flag (e.g. `--old-price-selector`) not shown in the sample commands here. |
| [`references/assembly-checklist.md`](references/assembly-checklist.md) | Operators, agent recovery | Pointer checklist into the canonical SKILL.md sections. |

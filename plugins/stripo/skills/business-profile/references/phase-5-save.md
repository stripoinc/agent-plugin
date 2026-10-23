# Phase 5 — complete a promoted website run

Read this after the current finalization reports `promoted: true`. Use `${OUT}` for that run's `--out-dir` and `${BRANDKIT_SKILL_ROOT}` for the installed skill. The finalizer's stdout JSON already provides logo/contact outcomes; retain ordinary notices in the existing results and logs. An older file in `${OUT}` is not evidence of current promotion.

The composed `${OUT}/brandkit.json` moves unedited by file path. Never pass its contents as a tool argument, copy stored values into the extraction, or make a preservation write. A full save replaces the selected account or project's profile and can clear anything this run did not measure. Explain that consequence before any required write approval; use authorization already present in the session.

## No profile write

For Visual-identity-only or an intentional no-save request, stop after authorized finalization and state that the profile was not saved, with any material limitation or requested artifact. Do not call the account read or the persistence report command merely to produce a status line. If a run resumes and it is unclear whether a save was attempted, follow uncertain-save handling before considering any further write; do not infer no attempt from missing local files.

## Save the full profile

Use the selected MCP server and selected account or project from `HOST.md`. If a required tool or transfer helper is unavailable, stop at that step. Do not substitute another transport or account. Never call the save tool after an unsuccessful prepare or upload.

1. Call `prepare_business_profile_upload` directly with the selected `projectId`; use its returned `uploadId` and `uploadUrl`. Treat an MCP error or malformed/missing session ID or URL as a failed preparation.
2. PUT the finalizer's exact `${OUT}/brandkit.json` bytes to the returned upload URL through the installed host helper using the transfer arguments in `HOST.md`. Require HTTP 2xx.
3. Call `replace_business_profile` directly with the selected `projectId`, returned `uploadId`, and this run's exact website. This replaces the stored profile; `cleared` names values the service removed. A returned `error_code` is a failure even when `isError` is false.

For a confirmed pre-write different-site error, compare the quoted site with this run's site. If it belongs to another run, repeat prepare and upload once for this run before a single save retry. If it is this site spelled with a different host or subdomain, retry the save once with the quoted website verbatim. Never submit an unrelated website to bypass the check.

Do not retry a denied (`-32040`), expired (`-32041`), unattended (`proactive_mutation_denied`), validation-rejected, or known pre-write logo-refused call (`logo_rasterize_failed` or `logo_font_unresolved`). Report its actual code, field path and reason; a matching old profile cannot turn a refusal into success. Do not edit the finalizer's validated file to evade a rejection.

Inspect the direct save result using the selected provider's existing contract. A transport/MCP error or returned `error_code` is not success, even when `isError` is false or absent. An empty, missing, malformed or generic result without a valid acknowledgment leaves the outcome uncertain; absence of an error alone is insufficient. If the returned destination or website conflicts with this invocation, report the discrepancy without choosing another account or retrying blindly.

A definitive successful acknowledgment completes the normal website-save request. Finish with a short statement that the Business Profile was saved. Do not run the account report, another account read, field-equality audit, archive, directory inventory or authored save receipt merely to strengthen that result. Keep routine sanitization, clearing and conversion notices in the existing results and logs. If an already-returned outcome reveals material loss that prevents the requested onboarding use or conflicts with an explicit requirement, state the saved action and concrete unmet requirement; do not call the whole request complete.

For an uncertain save (timeout, lost or invalid acknowledgment, or an error that may have followed a write), use the existing read-only state check when the current promoted witness and host read are available:

```bash
python "${BRANDKIT_SKILL_ROOT}/scripts/finalize.py" report --out-dir ${OUT}
```

The report fetches the current profile through the selected host adapter, saves the actual response under `${OUT}/persist-readback.json`, and compares the ten projected fields described in [Report lines](report-lines.md). A match proves those checked fields currently agree; it does not prove this call caused them to agree or that every Brand Kit field is equal. Report the original uncertainty with the available comparison; never turn matching old state into success for an uncertain call. On an uncertain write, never retry solely because the comparison differs or is unavailable. Do not run the report merely to produce a status after a known no-write refusal, failed prepare/upload, or intentional no-save. An explicitly requested read-only comparison still requires a valid promoted witness and cannot turn a refusal into success.

An explicitly requested audit, comparison, archive, artifact or additional answer still needs to be completed within its scope, using retained evidence. Use the existing report for a requested stored-profile comparison and describe its limits. Return existing kit/review links when requested or needed for delivery; do not reconstruct host-owned evidence or invent missing raw HTML/CSS. Once that work is complete, finish without another automatic audit or evidence pack.

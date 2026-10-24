# Reusing supplied website evidence

Fresh browser work already uses the requested URL and host-owned session. Do not add a repeated site-check call to each section of the same live extraction.

When the user explicitly supplies an existing native run directory for a standalone Brand voice or Business context request, verify its host-recorded site before reading its evidence:

```bash
python "${BRANDKIT_SKILL_ROOT}/scripts/finalize.py" check-site --technical-dir "<supplied absolute run directory>" --url "<requested URL>" --stage "<tone-of-voice or business-context>"
```

The command checks the native session's recorded requested URL. A kit's agent-authored organization website does not establish the source of unrelated files. On a mismatch or missing session evidence, do not use that directory; report the reason and use a fresh authorized browser run if requested. Never override the mismatch by eye or substitute another directory.

On success, use the matching run's captured text and state its evidence date. A past matching run is still past evidence: when the user requests fresh extraction, navigate again rather than presenting reused files as new observations.

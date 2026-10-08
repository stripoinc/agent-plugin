# Report lines — stored state, logo and contact outcomes

The read-only `report` command prints the stored-profile `REPORT_LINE`. The current finalizer's stdout JSON supplies `reportLines.logo` and `reportLines.contacts`. Use these returned lines when applicable, alongside the direct save outcome; no separate authored receipt is needed to establish their result.

### Stored-profile comparison after a possible save

Run `finalize.py report --out-dir ${OUT}` only after an acknowledged or uncertain write. It reads the selected account through the host adapter and prints one outcome-neutral `REPORT_LINE:`. The line states whether the current stored profile matches this run's promoted kit in the ten projected fields, differs, or could not be checked. The comparison covers website, name, logo URLs, languages, contacts, socials, important links, colours, typography, and button components. It tolerates the server's known normalization of those fields. It does not compare every field or establish that this particular write caused the current state.

A matching line can support an acknowledged save, or help explain an uncertain call. Keep the direct tool acknowledgement, refusal, or error separate from that line. A different or unavailable state does not authorize another write. Do not run the comparison after a known no-write refusal, failed preparation/upload, or intentional no-save. For those paths, report the actual tool outcome and use the finalizer stdout JSON's `reportLines.logo` and `reportLines.contacts`.

The report stores its fresh read-back under `${OUT}/persist-readback.json` as host-owned evidence. The model never authors that file and never supplies a read-back as a command argument. An unreadable, unpromoted, or hash-mismatched local output cannot be used as a witness for this run; the report says verification is unavailable and does not read the account in those cases.

### Logo outcome — a missing brand logo is said out loud, not footnoted

Include a returned `reportLines.logo` as a named line of its own. It distinguishes a hosted conversion from a missing usable mark; neither an empty `svgPath` on a usable raster nor a captured source URL alone establishes a conversion outcome.

In the current native workflow:

- A missing primary logo can leave a useful promoted kit, with its explicit missing-logo line. It does not establish readiness to customize a branded header.
- Successful required hosting binds the selected artwork to the hosted result before promotion. Report the returned hosted-logo line and URL.
- An already usable primary logo may need no logo line.
- A refused asset or failed required hosting does not promote the current run. Report the actual blocker, outcome and available error code/reason; do not enter Phase 5 or imply a fallback was saved.

Native finalization does not substitute another logo after conversion failure. Local-only requests skip remote-capable finalization and remain unpromoted; describe retained artwork and its actual limitations without promising a hosted image. Do not relabel a favicon, use a social preview, or guess artwork to avoid a missing-logo outcome.

### Contact outcomes

Native authoring supplies homepage-grounded contacts, and current native finalization preserves them subject to its schema and intrinsic checks. It does not reconcile them against legacy `page-signals` or strip them merely because that sidecar is absent. Include any `reportLines.contacts` actually returned, naming the affected channel and value. Report save-service removals or replacements from the actual save response; do not infer contact removal or verification from an absent line. Missing optional contacts remain concise evidence gaps.

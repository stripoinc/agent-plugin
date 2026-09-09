<!-- Moved out of SKILL.md by the 0.3.0 contract split. The text below is
     verbatim from SKILL.md at sha256 6cdd8d5975fa8aca548fbe00d5507260bf6d5ec6522d61ddaa0e4fa512ef9609. -->

# Phase 5 — save to the account Brand Kit

Read this on any Phase 5 error, including a `different site` rejection, a
denied or expired approval, an unattended run, or a validation rejection.

Phase 5 — save to the account Brand Kit (only when `finalize-report.json` says `promoted: true`; skip the whole phase otherwise). Read that field rather than recalling Phase 4's exit code: the two agree on a run you just executed, but a resumed thread has no exit code in hand, and a `brandkit.json` sitting under `--out-dir` may be an earlier run's. **You are a transport here, not a decision-maker.** The composed document moves as a FILE, by path: it is never a tool argument, and you never open it to trim it first.

**This phase is strictly current-run and replace-only.** Before the write, do not inspect the account's stored Brand Kit or copy any stored row into this run's extraction. A same-site stored logo is no exception. The outgoing document contains only evidence this run extracted and the satellite outputs composed from that evidence; anything absent from it is cleared by the replacement.

**5a — mint a session.** Call `prepare_business_profile_upload(projectId=<HOST.md's selected project>)` → `{uploadId, uploadUrl, …}`. It lives long enough to outlast 5c's approval, and its `instruction` field restates the call to make next.

**5b — send the file.** PUT the composed `brandkit.json` — the finalize CLI's own output, unedited — to `uploadUrl` this way and no other, then wait for HTTP 2xx:

```bash
${BRANDKIT_SKILL_ROOT}/scripts/upload_via_proxy.sh \
  --organization-id <selected_organization.organization_id> \
  --url <uploadUrl> \
  --input ${BRANDKIT_ARTIFACTS_ROOT}/store-example/brandkit.json \
  --failure-document ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/persist-write.json \
  --content-type application/json
```

**A 5a or 5b that fails still owes the persist line.** Both write `persist-write.json` with `stage` on failure — the 5a cell in SKILL.md on a session it could not mint, `upload_via_proxy.sh --failure-document` on a PUT that did not return 2xx: skip 5c and 5d and run `report` — it renders `not persisted (<the error>)` from that document and performs no read, because nothing reached the account.

**5c — write it.** Call `replace_business_profile(projectId=<HOST.md's selected project>, uploadId=<5a's id>, website="https://store.example")`. The `website` is what marks the payload as extracted data and must match the website inside the file.

**This call REPLACES the account's Brand Kit with this run's extraction.** Whatever the account held before is gone unless this run measured it again: nothing is carried over. That is deliberate — a Brand Kit describes the brand that was just extracted, not the union of every brand ever extracted into this org — and it is the sentence to have in mind when you report the outcome.

That tool owns the whole transform, and since 2026-08-27 it drops almost nothing: the Brand Kit's nodes are open types that keep properties the service has no field for, so the composed document is stored as the run wrote it — `brand.products` included, and with it every hint, metric, hover, card surface and CTA the extraction measured. What it still drops is every empty this run did not find, since from an extractor an empty means "not found", never "this brand has none". Everything that survives becomes the whole stored document. A section this run did not fill is therefore CLEARED, and `cleared` names it. `dropped.unsupportedByEndpoint` is now EMPTY on every run — it used to name `brand.products`, which the Brand Kit had no section for — and it is still returned so callers reading it keep working. A run against an account that held nothing this run missed comes back with the list EMPTY. Logo rows are named per class (`brand.logos[type=logo]`), because a run that finds only a favicon still writes `brand.logos` while removing the main mark. What the list names is the `<names>` in the persist line. `website` is checked against the staged document's own `brand.organization.website` before any read or write, so a session staged by another run cannot be redeemed here.

A `different site` error quotes that stored value. **Read the quoted value before reacting — two different causes raise the same error, and only one of them is a stale session.**

- **The quoted site is not the one this run extracted.** The session belongs to another run. Re-run 5a–5b to mint a fresh session and stage THIS run's `brandkit.json`, then 5c again.
- **The quoted site IS this run's site, spelled differently from the `website` you sent** (only the two HOSTS are compared, case- and `www.`-insensitively and with a missing scheme filled in, so this fires only where the hosts themselves differ — a subdomain, `https://shop.store.example` against `https://store.example`). Nothing is stale, and re-running 5a–5b re-uploads a byte-identical document into the same disagreement. Call 5c again passing the quoted value verbatim.

Never retry with a different website to get past the check: the target is always the site this run extracted.

Approval: the write is gated, so a Slack card asks first. **The card names the account being written to, not a diff** — the document is behind an upload session, so the request carries nothing to diff. **Never retry a denied (`-32040`) or expired (`-32041`) approval** — report `not persisted (approval denied)` / `not persisted (approval timed out)` and stop. In an unattended (proactive) run both calls are refused at the proxy with `-32040 proactive_mutation_denied`: by design, not an error — report `not persisted (unattended run — Stripo mutations are disabled). Re-run in a Slack thread to save it.` and stop. Do NOT offer a separate whole-document updater as the alternative — that write replaces the whole document, so an extraction pushed through it blanks every section this run did not fill. A persist Phase 5 could not finish is Phase 5's to re-run. On a validation error do **not** repair the document and do **not** retry: `brandkit.json` is the finalize CLI's own validated output, and there is no edit to it you are permitted to make. The two checks are not the same check — the CLI validated the composed document against this skill's schema; the write validates what the transform produced against the account Brand Kit's own contract — so a rejection is a disagreement between them at a named field path, not something this run can settle. Report `not persisted (rejected: <the field path and message, verbatim>)` and stop, quoting the path and the message as given rather than diagnosing which side is wrong.

**5d — confirm** is `report`'s job, not yours. The three refusals above — denied/expired approval, unattended run, validation rejection — are all decided before anything reaches the account, so their `and stop` is final and no read is owed. On **every other** outcome of 5c, including an apparently successful one, `report` calls the stored profile's read tool itself through the finalizer's MCP route
(`get_business_profile(projectId)`),
saves what it read as `persist-readback.json`, and decides the persist line from what the stored document holds: a successful-looking write result can be an echo rather than the stored document, and a call that errored in transit can still have landed. **This is post-write verification only.** Never call that read tool yourself in this phase; never copy anything from the read-back into the extraction, never rewrite `brandkit.json` from it, and never issue a second replacement to preserve a stored field. The read, not the call's return value, decides which persist line `report` prints. Then report the single persist line ([Persist outcome](#persist-outcome--always-reported-never-implied)).

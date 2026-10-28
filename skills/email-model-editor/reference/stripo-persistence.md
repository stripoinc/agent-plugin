# Stripo persistence and verification

## Upload and verification contract

Preserve native font settings/resources; no font substitution is required. Change native fields only when requested
and supported by the live schema; do not invent an external metadata write capability.
Reuse hosted reference assets, authorized hosted image URLs, completed local-image uploads,
or completed Stripo image-job URLs. Asset tickets are separate from document-state tickets.

For edits, rebuilds, or a newly created email whose state has already been acquired, use both
candidate and base tickets in these steps:

1. Call `prepare_document_state_upload(id, type)` twice; require `status=OK` on both and check
   `maxBytes`. One ticket holds one file: the first is for the candidate, the second for the base.
2. Upload the candidate file to the first `uploadUrl` and the unmodified acquired model (the file
   `get_document_state` was downloaded to) to the second, with the returned HTTP
   method/headers/instruction. Keep the two ids under explicit names; never swap them.
3. Call `set_document_state(id, type, uploadId=<candidate ticket>, baseUploadId=<base ticket>)`
   with ticket IDs, never URLs. There is no `message_id`, `operation`, `expected_model_hash`, or
   idempotency-key argument.

With `baseUploadId` the editor applies only the differences between the uploaded base and the
candidate on top of the letter's current state, so edits other people made since the read
survive; a change of the candidate to a node someone deleted meanwhile rejects the whole write.
Skip the base ticket only for a letter whose state was never acquired (a freshly created email
built from a brief): the upload then replaces the whole document and concurrent edits are lost.
For that initial write, call `prepare_document_state_upload(id, type)` once, require `status=OK`,
upload the validated candidate with the returned transfer contract, then call
`set_document_state(id, type, uploadId=<candidate ticket>)` without `baseUploadId`.
Never upload anything but the byte-exact acquired model as the base, and never pass the base
ticket as `uploadId`: that would replace the letter with a stale copy.

Every ticket is single-use once consumed. After an uncertain write, read the state before
retrying; do not repeat a possibly successful mutation blindly. Consumed tickets need a fresh
candidate upload and, when the write used a base, a fresh base upload. The missing-base case below
is the exception: that call consumed
neither ticket, so a still-valid, not-yet-uploaded base can be completed using the same IDs.
Follow refusal/error statuses. Candidate repairs and unknown-outcome recovery allow at most
one repair retry; confirmed `REVISION_CONFLICT` responses have the separate bound below.
After `OK` acquire again before the next edit: the old acquisition is no longer the letter's state
and must not be reused as a base. Keep the read-to-write gap short, change only requested
content, and re-read after writing, as the MCP guide recommends.

Expected `set_document_state` outcomes are returned as a `status`. `OK` carries
`generatedPatchesCount` and echoes `baseUploadId` when the write was applied as a delta.
`ACCESS_DENIED` has no retry. `UPLOAD_NOT_FOUND` means one ticket is empty — unknown, not
uploaded yet, or already spent — and `missingUploadId` says which. The base is read first: a
missing base has spent nothing, so finish that upload and call again with the same two ids. A
missing base that is no longer uploadable needs a new base ticket with the same untouched file,
while the candidate ticket can be retained. With a base, a missing candidate has already spent
the base, so prepare two fresh tickets and upload both files again. Without a base, finish a
still-pending candidate upload or prepare a fresh candidate ticket when the old one is unusable.
Never drop `baseUploadId` to force the write. `INVALID_STATE` means a file is oversized
(the candidate, optional base and JSON request wrapper together must fit `maxBytes`), not UTF-8,
or not a single JSON object. Correct the indicated problem, then prepare fresh tickets for both
files when the write has a base. Preserve the base on retries after `NOT_FOUND` too.
`REVISION_CONFLICT` means the letter changed while the write was running; nothing was written
and the tickets used by that write are spent. Prepare a fresh candidate ticket and, if the write
used a base, a fresh base ticket; upload the same files and repeat the call.
Stop after three `REVISION_CONFLICT` responses in total (at most two
unchanged-write retries), reporting that the letter is being edited right now. This is not a
candidate-repair budget and never applies to `WRITE_UNCONFIRMED` or transport failures.
`WRITE_UNCONFIRMED` means a server or transport failure left the outcome unknown; the write may
have been applied. Read with `get_document_state` and check the requested changes before retrying.
If they are already present, do not write again. If the read fails, stop and report the failure.
If a node the edit targeted is now missing, report the conflict; do not recreate it or retarget
the edit automatically. Otherwise redo the edit on the fresh model and persist with that model
as the base and two fresh tickets, allowing at most one repair retry. A deleted-target rejection
can surface this status, so do not infer a specific conflict solely from the status. Follow the
same read-first procedure after a protocol or transport error with no status.
`MERGE_BROKEN` means the editor rejected the upload and wrote nothing; it carries the editor's
`code`, its `message`, and for these codes `details`:

- `VALIDATION_ERROR` — `details.errors[{path, message}]`. `path` is a dot path into the uploaded
  JSON with numeric array indexes (`stripes.0.structures.0.columns.0.containers.0.blocks.2.settings.…`);
  `<root>` is the top level. Fix every listed field at its source (the brief or the SDK script,
  not the candidate JSON by hand), rebuild, and persist with fresh tickets, uploading the same
  base again when the write used one. This is the retry. When the `message` says the delta is incompatible with the
  current document, the projected delta failed validation against the current state — acquire
  again, rerun the change module, and persist with the fresh model as the base. When it says the
  base is invalid, the base ticket held something other than
  the unmodified acquired model.
- `PARSE_ERROR` — `details.parseErrors[{message, location?, severity?}]`. A document could not be
  parsed; the message may describe the letter's stored state rather than the upload. Re-read the
  target with `get_document_state`; if that read also fails, report the letter as broken and stop.
- `SIDE_EFFECT_UNAVAILABLE` — `details.unavailableSideEffects[{kind, affectedBlockIds?, affectedPaths?}]`.
  The listed blocks need a backend capability this runtime cannot run. The same upload fails
  again: repair the indicated change, rebuild, and persist with fresh tickets for both files when
  the write has a base. Do not drop `baseUploadId`.

`details.truncated=true` means diagnostics were dropped to fit; fix what is listed, persist, and
read the fresh diagnostics. Without `details`, use `message`. Report the `code`, the paths, and
the messages verbatim when the one repair retry does not resolve the rejection.

The upload is the complete document. `set_document_state` diffs it against the uploaded base
(without one, against the live state) and applies that difference. Settings
are canonical and complete: every key of `general`, `stripes`, `headings`, and `buttons`, including
their `lightTheme` and `darkTheme` branches, is required, and local validation rejects a model that
omits one. A missing stripe `messageArea`/`includeInOutput`/`padding`/background color or column
`settings.width` rejects the whole write with `ACTION_NOT_APPLIED`. An absent
`stripes`, `structures`, `columns`, or `blocks` array deletes its elements. Never upload a partial model: edit the freshly
acquired one and preserve unrelated keys — with a base a key that is absent from the candidate
but present in the base is still a deletion. Colors live in `settings.<section>.lightTheme`, with
nullable dark-mode overrides in `darkTheme`. The shared editing skill resets a nullable setting by
writing `null` (`email.setTheme(path, undefined)` or `email.resetSettings(paths)`), including
`settings.general.backgroundImage`, `settings.general.customListStyles`, paragraph spacing, heading
font weight, and dark-theme colors. Its [Model completeness](../../email-model-editor/reference/mutate-and-validate.md#model-completeness)
section lists the supported paths.
The runner still rejects accidentally absent fields and unsupported resets.

Re-read with `get_document_state(id, type)`; IDs can change across reads. After a write with a
base the durable state may legitimately contain other people's edits made since the acquisition:
verify the requested changes and the preserved content the change module did not touch, and do
not treat a difference outside the delta as a loss unless the acquisition had it and the current
state lacks it without another author's change being possible.
Request `get_screenshot(id, type, mode="BOTH")`, download `screenshots[].downloadUrl` and visually
inspect both PNGs. These show the current
coediting state with export settings, including unsaved changes; they do not prove an independent
durable revision. `PARTIAL` or unavailable previews mean “saved, visual verification incomplete”
when model checks pass. Retry previews once without repeating a successful write.
Stripo offers no routine compiled HTML/CSS verification: do not call quota-consuming
`export_to_html` to verify a write, and keep `get_content(includeHtml=true)` for reference
inspection. Verify requested inline styles in the fresh native model and both screenshots, and
report compiled-style verification as unavailable. There are no compiled-preheader checks and no
preheader-only completion rule: verify `metadata` in the fresh `get_document_state` model and
still inspect both previews.
For creation/rebuilds, call `get_content(id, type=<lowercase>, includeHtml=false)` after persistence
to verify the stored name and project; the initial read or create receipt does not replace this
saved-metadata check. Return the saved `id` and entity `type`, plus the verified project for a new
email. Links come only from the [final presentation](#final-presentation): always `editorLink`,
plus a shared `previewLink` when the server returns one. Do not invent a link.

## Final presentation

After the last confirmed `set_document_state` and the checks and repairs the selected workflow
requires, call the optional `show_content_preview(id, type)` once for the saved target through the
host-visible MCP tool path so a supporting host can display its App. Pass `id` and `type` as its
advertised schema defines them. Creation and rebuilds call it after the last write, model and
desktop/mobile checks and any repairs, never immediately after creating the initial email or
before its first content write. An edit calls it after the edit skill's durable and visual checks.
A confirmed save with incomplete verification or unresolved visual defects still calls it.
Inspection-only work, or a write that was never confirmed, does not call it.

This is a presentation step, separate from persistence and visual verification. `OK` means the
snapshot was prepared; it does not prove that the host rendered it or that an uncertain write
succeeded. Resolve `WRITE_UNCONFIRMED` through normal recovery first. The preview reflects the
current coediting state at call time, including concurrent changes, without an exact saved
revision guarantee.

The model receives status, metadata and `editorLink`. When the workspace plan includes shared
preview, the result also carries `previewLink`, a hosted preview page; otherwise it may carry
`screenshotUrl`, a temporary signed PNG for the App. Older servers return neither. Include the
returned `editorLink` in the final response as the text fallback, add `previewLink` when present,
and never print or download `screenshotUrl`. If the server lacks this optional tool
or the preview fails, report the saved result and the presentation limitation honestly. Never
repeat `create_email` or `set_document_state` for a preview, and never claim the App was shown
merely because a snapshot was prepared. Do not hide this call in file-transfer helpers.

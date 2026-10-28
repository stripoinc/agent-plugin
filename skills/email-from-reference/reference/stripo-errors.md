# Stripo write and upload errors

Read this topic when `set_document_state` returns a status other than `OK` or fails without a
status, or when `upload_image` returns an `error_code`. Successful paths are in
[Persistence and verification](stripo-persistence.md) and [Images](stripo-images.md).

## Document writes

A missing base is the exception to fresh tickets after a consumed write: that call consumed
neither ticket, so a still-valid, not-yet-uploaded base can be completed using the same IDs.
Confirmed `REVISION_CONFLICT` responses have their own bound below; other candidate repairs and
unknown-outcome recovery allow at most one repair retry.

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

## Image uploads

An `upload_image` failure is `{error_code, reason, instruction}`:

| `error_code` | Meaning | Action |
| --- | --- | --- |
| `upload_session_not_found` | No transferred file for this session: it expired, was already used, or was prepared for another target or user. | If `upload_image` was already sent for this session, treat the outcome as uncertain. Otherwise correct `id`/`type`, or replace an expired session with a fresh prepare/transfer sequence. |
| `file_too_large` | Byte size or, for PNG/GIF, pixel dimensions exceed the limit; `reason` says which. Nothing was hosted. | Report the limit. Resize or compress only when the request allows changing the image; compression alone does not fix a pixel failure. A changed file needs a fresh prepare/transfer sequence. |
| `unsupported_format` | The bytes are not PNG, JPEG, or GIF with a valid header. Nothing was hosted. | Convert with an authorized tool and start a fresh prepare/transfer sequence, or report the format. |
| `hosting_rejected` | The gallery refused the file. Nothing was hosted. | The same file and name will be refused again. Report the refusal; do not repeat the upload unchanged. |
| `hosting_failed` | The gallery failed or did not answer. The image may or may not be in the gallery. | Uncertain finalization: do not prepare, transfer, or finalize this image again. Report the uncertainty. |

The response's `instruction` can suggest preparing a new upload after `hosting_failed` or an
uncertain `upload_session_not_found`. Do not follow that suggestion: Stripo has no gallery read
operation to rule out a duplicate, so report the uncertainty and leave the image unchanged.

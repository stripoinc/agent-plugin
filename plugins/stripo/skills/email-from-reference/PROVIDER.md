# Stripo provider

Stripo-specific MCP details for both email skills. Follow each `SKILL.md` for the creation or
editing workflow and SDK usage; `<bundle-root>/mcp-tools.json` lists the tool names and unsupported
capabilities. Use the connected Stripo MCP. Call `whoami` once to resolve access and projects.
Read `stripo://guide/start-here` and `stripo://guide/recipes` when available.

## Reference and target

Accept an email/template ID or a reference link. Extract an unambiguous ID and entity kind from
the link; ask when either is unclear. Keep `(id, type)` together on every call: `type` is `EMAIL`
or `TEMPLATE` for document/preview tools and lowercase for `get_content`. A reference identifies
source material; only an explicit edit/rebuild request makes it the write target.

Read the destination project's Business Profile with `get_business_profile(projectId)`; it is
scoped to one project, and `businessProfileId: null` means the project has none and
`businessProfile` carries defaults only. Its brand, contacts, socials, important links and
languages are authorized facts. Derive whatever it does not carry — colors, fonts, assets, layout,
identity, destinations and footer content — from the designated reference model and its previews;
for an existing target, its own model can serve as the reference. There are no sending-interface
tools.

Never write the Business Profile from these skills. `patch_business_profile`,
`replace_business_profile` and `prepare_business_profile_upload` belong to
`$brandkit-updater` and `$brandkit-extraction-v-0`, which carry their own approval step. When the
project has no profile, offer `$brandkit-extraction-v-0` once and continue from the reference.

Acquire the reference/target with `get_document_state(id, type)`; it returns a temporary
`downloadUrl`, download to a local JSON file and keep that file unmodified: it is the base the
write uploads next to the candidate (see below). Require `status=OK`; a missing, inaccessible or
broken model is not an empty reference. The runners validate with the editor rules bundled in
the SDK. `get_document_state_schema()` remains available for field documentation.

Use `get_content(id, type, includeHtml=false)` for name and project/folder metadata.
Use `get_screenshot(id, type, mode="BOTH")` for reference and final desktop/mobile inspection.

## Creation and capabilities

For a new email, call `create_email(name, projectId, folderId?)`, then write to the returned
`emailId` using the upload flow below. Resolve the project from the user's destination or the
reference's verified project when creating alongside it; ask if the destination is ambiguous.
There are no sender, subject, or sending-interface arguments. Pass a folder only when requested;
use `find_folders` to resolve it. For an explicitly requested copy, `sourceEmailId` or
`sourceTemplateId` can preserve the source before editing. Never supply both. Check the returned
project and `editorModelReady`/instruction; if the model is not initialized, keep the same email
and report the required editor action.

Creation is not idempotent. After an uncertain create, find the matching name in the intended
project with `find_content` (include drafts as needed) before retrying. If recovery is ambiguous,
stop and resolve it. Repair a known created email using the same ID.

Templates support reading, editing, rebuilding and use as references; this MCP has no tool to
create a new template. There is no tool to rename/update external metadata after creation.
Preserve name, project, and folder metadata and report requested unsupported updates to them.

Native document metadata is writable through `set_document_state`: `metadata.title` is the HTML
`<head><title>`, and `metadata.preheader` is `{text: string, fillSpace: boolean}`. These are separate
from the email's name, sending subject, project, and folder. Use `email.setMetadata(patch)` for an
existing model, or `model.metadata` in a creation brief. Omitted fields keep their current values.
Both preheader fields are required; `fillSpace` controls the editor's invisible filler after the text.
New or changed title/preheader text is limited to 500 UTF-16 code units; unchanged imported text
may be longer. Empty `title` clears the title; `{text: "", fillSpace: false}` clears the preheader.
Keep the metadata keys in the candidate when clearing values. Check support in the downloaded
schema and verify the exact metadata values with `get_document_state` after writing.
The creation runner enforces the same text limit before producing a candidate. For a full rebuild,
pass `--baseline <target-model.json>` using the acquired state of the document being replaced;
only unchanged text from that baseline may exceed the limit. Omit `--baseline` for a new email.

## Upload and verification contract

Preserve native font settings/resources. Do not run `normalize-merge-service-fonts.mjs` or apply
Reteno's font substitutions or preheader restriction. Change native fields only when requested
and supported by the live schema; do not invent an external metadata write capability.
No asset-upload tool exists: reuse hosted reference assets or authorized hosted image URLs.

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
Never upload anything but the byte-exact acquired model as the base, and never pass the base
ticket as `uploadId`: that would replace the letter with a stale copy.

Every ticket is single-use. After an uncertain write, read the state before retrying. A retry
needs a fresh candidate ticket and, when using a base, a fresh base ticket; do not repeat a
possibly successful mutation blindly.
Follow refusal/error statuses and allow at most one repair retry before reporting the failure.
After `OK` acquire again before the next edit: the old acquisition is no longer the letter's state
and must not be reused as a base. Keep the read-to-write gap short, change only requested
content, and re-read after writing, as the MCP guide recommends.

Expected `set_document_state` outcomes are returned as a `status`. `OK` carries
`generatedPatchesCount` and echoes `baseUploadId` when the write was applied as a delta.
`ACCESS_DENIED` has no retry. `UPLOAD_NOT_FOUND` means one ticket is empty — unknown, not
uploaded yet, or already spent — and `missingUploadId` says which. The base is read first: a
missing base has spent nothing, so finish that upload and call again with the same two ids; a
missing candidate has already spent the base, so prepare two fresh tickets and upload both files
again. Never drop `baseUploadId` to force the write. `INVALID_STATE` means a file is oversized
(the candidate, optional base and JSON request wrapper together must fit `maxBytes`), not UTF-8,
or not a single JSON object. Correct the indicated problem, then prepare fresh tickets for both
files when the write has a base. Preserve the base on retries after `NOT_FOUND` too.
`REVISION_CONFLICT` means the letter changed while the write was running; nothing was written
and both tickets are spent: prepare two fresh tickets, upload the same candidate and the same
base, and repeat the call; after three such answers report that the letter is being edited right now.
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
`stripes`, `structures`, `columns`, or `blocks` array deletes its elements, and Timer and Social
blocks cannot be deleted through this write. Never upload a partial model: edit the freshly
acquired one and preserve unrelated keys — with a base a key that is absent from the candidate
but present in the base is still a deletion. Colors live in `settings.<section>.lightTheme`, with
nullable dark-mode overrides in `darkTheme`. The shared editing skill resets a nullable setting by
writing `null` (`email.setTheme(path, undefined)` or `email.resetSettings(paths)`), including
`settings.general.backgroundImage`, `settings.general.customListStyles`, paragraph spacing, heading
font weight, and dark-theme colors. Its Model completeness section lists the supported paths.
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
Do not call quota-consuming HTML export for verification.

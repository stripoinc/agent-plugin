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
`downloadUrl`, download to a local JSON file. Require `status=OK`; a missing, inaccessible or
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

1. Call `prepare_document_state_upload(id, type)`; require `status=OK` and check `maxBytes`.
2. Upload the candidate file to `uploadUrl` with the returned HTTP method/headers/instruction.
3. Call `set_document_state(id, type, uploadId)` with the ticket ID, never its URL. There is no
   `message_id`, `operation`, `expected_model_hash`, or idempotency-key argument.

An upload ID is single-use. After an uncertain write, read the state before retrying. Every actual
retry needs a fresh prepare/upload ticket; do not repeat a possibly successful mutation blindly.
Follow refusal/error statuses and allow at most one repair retry before reporting the failure.
There is no conflict-resolution or base-version check in this version. Keep the read-to-write gap
short, change only requested content, and re-read after writing, as the MCP guide recommends.

`set_document_state` answers with a `status`, never a protocol error. `OK` carries
`generatedPatchesCount`. `ACCESS_DENIED` has no retry. `UPLOAD_NOT_FOUND` means nothing was
uploaded under that ticket or it is already spent. `INVALID_STATE` means the file is oversized,
not UTF-8, or not a single JSON object. `MERGE_BROKEN` means the editor rejected the upload and
wrote nothing; it carries the editor's `code`, its `message`, and for these codes `details`:

- `VALIDATION_ERROR` — `details.errors[{path, message}]`. `path` is a dot path into the uploaded
  JSON with numeric array indexes (`stripes.0.structures.0.columns.0.containers.0.blocks.2.settings.…`);
  `<root>` is the top level. Fix every listed field at its source (the brief or the SDK script,
  not the candidate JSON by hand), rebuild, and persist with a fresh ticket. This is the retry.
- `PARSE_ERROR` — `details.parseErrors[{message, location?, severity?}]`. A document could not be
  parsed; the message may describe the letter's stored state rather than the upload. Re-read the
  target with `get_document_state`; if that read also fails, report the letter as broken and stop.
- `SIDE_EFFECT_UNAVAILABLE` — `details.unavailableSideEffects[{kind, affectedBlockIds?, affectedPaths?}]`.
  The listed blocks need a backend capability this runtime cannot run. The same upload fails
  again: change or drop what those paths point at, rebuild, and persist with a fresh ticket.

`details.truncated=true` means diagnostics were dropped to fit; fix what is listed, persist, and
read the fresh diagnostics. Without `details`, use `message`. Report the `code`, the paths, and
the messages verbatim when the one repair retry does not resolve the rejection.

The upload is the complete document. `set_document_state` diffs it against the live state and
treats every absent optional key as a deletion: most keys reset to their defaults, `fontWeight`
and `metadata` keep their values, and a missing global `fontFamily` (stripes, headings, buttons),
`general.hideImageDownloadIcons`, stripe `messageArea`/`includeInOutput`/`padding`/background
colors, or column `settings.width` rejects the whole write with `ACTION_NOT_APPLIED`. An absent
`stripes`, `structures`, `columns`, or `blocks` array deletes its elements, and Timer and Social
blocks cannot be deleted through this write. Never upload a partial model: edit the freshly
acquired one and preserve unrelated keys. The shared editing skill supports intentional
`email.setTheme(path, undefined)` resets for optional theme settings with native reset handlers,
including `settings.general.backgroundImage`, `settings.general.customListStyles`, hover effects,
and optional colors, sizes, and spacing. Its Model completeness section lists the supported paths.
The runner still rejects accidentally absent fields and unsupported resets; native schema
validation also rejects deletion of required settings and required children.

Re-read with `get_document_state(id, type)`; IDs can change across reads.
Request `get_screenshot(id, type, mode="BOTH")`, download `screenshots[].downloadUrl` and visually
inspect both PNGs. These show the current
coediting state with export settings, including unsaved changes; they do not prove an independent
durable revision. `PARTIAL` or unavailable previews mean “saved, visual verification incomplete”
when model checks pass. Retry previews once without repeating a successful write.
Do not call quota-consuming HTML export for verification.

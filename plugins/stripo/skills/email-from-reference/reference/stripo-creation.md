## Creation and capabilities

For a new email, call `create_email(name, projectId, folderId?)`, then write to the returned
`emailId` using the [persistence flow](stripo-persistence.md). Resolve the project from the user's destination or the
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

## Explicitly empty email

When the user requests an empty email, call `create_email` with its name and destination,
without `sourceEmailId` or `sourceTemplateId`. Follow the returned readiness/instruction and
keep the returned `emailId`. Check the name/project with `get_content` and the empty native model
with `get_document_state`; download it through the [authorized transfer path](stripo-acquisition.md#network-access-before-downloading).
Verify zero content blocks and no unintended title or preheader. Inspect desktop/mobile PNGs
with `get_screenshot` before reporting full verification; if unavailable, report the limitation.
No content brief, brand lookup, image job, SDK build, or document upload is needed to keep an
already empty model empty. The uncertain-create recovery above still applies.

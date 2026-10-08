## Creation and capabilities

For a new email, call `create_email(name, projectId?, folderId?)`. Write to the returned `emailId`
through [persistence](stripo-persistence.md) only when content or native-model changes are requested.
Use the requested destination or the reference's verified project when creating alongside it;
resolve an unknown named destination, and ask if it is ambiguous. With no requested destination,
use the tool's default project without a preliminary lookup.
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
Keep the metadata keys in the candidate when clearing values. Use the bundled field contract;
fetch schema documentation only when needed. A focused metadata edit completes on `set_document_state` with `status=OK`. Read back exact values when
verification was requested or is part of a full build/rebuild.
The creation runner enforces the same text limit before producing a candidate. For a full rebuild,
pass `--baseline <target-model.json>` using the acquired state of the document being replaced;
only unchanged text from that baseline may exceed the limit. Omit `--baseline` for a new email.

## Explicitly empty email

Apply [focused operations](../PROVIDER.md#focused-operations). Call `create_email` with the
requested name and known destination, without `sourceEmailId` or `sourceTemplateId`. A successful
response with `editorModelReady=true` is sufficient confirmation: report its `emailId`, actual
`name`, and `projectId`, then stop. No `whoami`, guide discovery, content brief, brand lookup,
model/schema read, image job, SDK build, document upload, or screenshot is needed for confirmation.
Resolve an unknown explicitly named destination only when necessary.

Optional instructions to fill or inspect the newly created email do not authorize more work.
If `editorModelReady` is false or absent, retain the ID and follow the readiness instruction;
do not claim readiness or create another email. The uncertain-create recovery above still applies.
Perform previews or other checks only when the user asks for them.

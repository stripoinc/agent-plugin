# Stripo creation and metadata

## Create an email

For a new email, call `create_email(name, projectId, folderId?)`, then write to the returned
`emailId` using the [persistence contract](stripo-persistence.md). Resolve the project from the
user's destination or the reference's verified project when creating alongside it; ask if the
destination is ambiguous. The brief message allows only `name` (nonempty, at most 200
characters), positive optional `projectId`/`folderId`, and local `referenceMode`. There are no
sender, subject, or sending-interface arguments. Pass a folder only when requested; use
`find_folders` to resolve it. For an explicitly requested copy, `sourceEmailId` or
`sourceTemplateId` can preserve the source before editing. Never supply both. Check the returned
project and `editorModelReady`/instruction before assets or persistence. If the model is not
initialized, stop those dependent operations, keep the same email, and report the required
editor action. Do not silently create an email when the request was for a new template.

Creation is not idempotent. After an uncertain create, find the matching name in the intended
project with `find_content` (include drafts as needed) before retrying. If recovery is ambiguous,
stop and resolve it. Repair a known created email using the same ID.

Templates support reading, editing, rebuilding and use as references; this MCP has no tool to
create a new template. There is no tool to rename/update external metadata after creation.
Preserve name, project, and folder metadata and report requested unsupported updates to them.

For an explicit full rebuild, keep the named target's `(id, type)` and skip creation.

## Native metadata

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

## Renderer constraints

For a centered photo-backed panel, do not put the only image on the stripe while leaving the
body transparent: this renderer paints that image outside the body and the overlay text can disappear.
When a native background uses `sizeX: "cover"`, set `sizeY: "auto"`; a `cover`/`cover` pair can
pass local schema validation but fail the server write. Compare the saved
photo crop after this adjustment.

When a horizontal divider's border sits in a text block, set the wrapper paragraph's `font-size:1px!important`
and `line-height:1px!important`. The mobile compiler otherwise forces that paragraph to
16px and inserts a full line of space at every divider.
The generated mobile stylesheet forces content paragraphs to 16px with `!important`.
An inline `font-size` on the `<p>` can therefore look correct on desktop yet enlarge small
mobile copy, wrap compact detail rows, and lengthen the email. For a source mobile design with
smaller text, put the mobile size on a nested span with `!important`. For aligned label/value
rows, use a two-cell presentation table with an explicit font size on each cell so wrapped
values stay in the value column. Verify the saved mobile PNG, not just the JSON or desktop HTML.
The renderer can also give a two-column native structure equal mobile widths even when its desktop
column widths differ and `responsiveMobile` is false. For compact receipt rows, keep the label
and amount together in one presentation table when the source needs unequal mobile columns.

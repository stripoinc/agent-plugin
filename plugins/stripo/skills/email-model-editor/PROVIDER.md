# Stripo provider

This file supplies the Stripo MCP contract for both email skills; each `SKILL.md` refers here for
reference resolution, MCP calls, persistence, and verification. Use the connected Stripo MCP;
`<bundle-root>/mcp-tools.json` lists its supported operations.
The agent performs the workflow itself. Call `whoami` once to resolve access and projects.
Read `stripo://guide/start-here` and `stripo://guide/recipes` when available.

## Reference and target

Accept an email/template ID or a reference link. Extract an unambiguous ID and entity kind from
the link; ask when either is unclear. Keep `(id, type)` together on every call: `type` is `EMAIL`
or `TEMPLATE` for document/preview tools and lowercase for `get_content`. A reference identifies
source material; only an explicit edit/rebuild request makes it the write target.

Do not call `get_brandkit` or `list_email_interfaces`. Derive colors, fonts, assets, layout,
identity, destinations and footer content from the designated reference model and its previews.
User instructions override reference choices. Preserve reusable facts, and ask about required
missing or conflicting facts rather than inventing them. For an existing target, its own model
can serve as the reference. Do not copy unrelated campaign offers or dates into a new campaign.

Acquire the schema with `get_document_state_schema()` and the reference/target with
`get_document_state(id, type)`. Both return a temporary `downloadUrl`; download to local JSON
files. Require `status=OK`; a missing, inaccessible or broken model is not an empty reference.
Pass `--schema <schema.json>` to every runner; refresh files older than one hour. The SDK remains
shared. Never put the full model in an MCP argument or in the conversation.

Use `get_content(id, type, includeHtml=false)` for name and project/folder metadata.
Use `get_screenshot(id, type, mode="BOTH")` for reference and final desktop/mobile inspection.

## Edit with email-model-editor

Use the existing `inspect-editor-json.mjs` and `run-sdk.mjs` scripts and a module that receives
only `{ email }`, calls SDK methods, and returns nothing. Preserve unrelated content and styles.

- Value changes: `--live-value-edit` retains the existing topology checks.
- Explicit additions/removals: `--live-structure-edit` enables the full SDK handle, including
  `remove()`, `repeat(totalCount)` and `insert(componentName, {after: handle})`. `repeat` takes the
  final total count including the original, not the number of new copies.
- For `insert`, pass `--components <components.json>`, an object keyed by component name. Each
  value is `{node, slots, level?}` from a native reference subtree; `level` is `L1` (stripe),
  `L2` (structure), or `atoms` (block). Give slots JSON pointers relative to that subtree.
  Target inserted blocks through `inserted.slot(role)`. The SDK assigns fresh IDs. For a block
  type absent from the reference, build a schema-valid native component using the shared SDK
  and reference styles; do not switch to raw HTML.

Both modes require a populated input, successful schema validation, positive SDK mutation count,
no selector misses, and a populated output. Structural mode reports the actual topology and
block counts; check them against the requested additions/removals instead of requiring equality.
Retain the untouched input, change module, candidate and diagnostics. A known `changed:false`
needs no write. Generated JavaScript still runs under the host's execution permissions; the
runner is not a JavaScript security sandbox.

## Create or rebuild with email-from-reference

Use its installed `reference/creation-brief.schema.json` and example. The version 2 brief uses
native `model` JSON and Stripo `message: {name, projectId?, folderId?}` metadata. It has no sender,
subject, sending interface or font gate. Preserve the reference's native settings and resources
in the draft unless the request changes them; reconstruct the requested editable content.

Run the existing builder with `--brand stripo --schema <schema.json>` as well as `--brief`,
`--output` and `--diagnostics`. The builder completes text/image/button/spacer drafts with shared
defaults and preserves other native block types from a reference as supplied; every block still
passes the builder's checks (unique IDs, non-empty text content, image `src`, button text and
`mailto:` targets). Fix validation failures before creating a remote email. For small structural
edits use email-model-editor instead.

For a new email, call `create_email(name, projectId, folderId?)`, then write to the returned
`emailId` using the upload flow below. Resolve the project from the user's destination or the
reference's verified project when creating alongside it; ask if the destination is ambiguous.
Pass a folder only when requested. For an explicitly requested copy, `sourceEmailId` or
`sourceTemplateId` can preserve the source before editing. Never supply both. Check the returned
project and `editorModelReady`/instruction; if the model is not initialized, keep the same email
and report the required editor action.

Creation is not idempotent. After an uncertain create, find the matching name in the intended
project with `find_content` (include drafts as needed) before retrying. If recovery is ambiguous,
stop and resolve it. Repair a known created email using the same ID.

For a full rebuild, use the explicitly named target's existing ID and type, preserving unrelated
native settings/resources. Do not create a shell. Templates support reading, editing, rebuilding
and use as references; this MCP has no tool to create a new template. Do not silently create an
email when the user requested a new template. There is no tool to rename/update external metadata
after creation. Preserve existing metadata and report requested unsupported updates.

## Persist and verify (both skills)

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

Read the saved model again and verify exact values, links, image URLs, resources and intended
block counts/types. IDs can change across reads. Request `get_screenshot(id, type, mode="BOTH")`,
download `screenshots[].downloadUrl` and visually inspect both PNGs. These show the current
coediting state with export settings, including unsaved changes; they do not prove an independent
durable revision. `PARTIAL` or unavailable previews mean “saved, visual verification incomplete”
when model checks pass. Retry previews once without repeating a successful write.
Do not call quota-consuming HTML export for verification. Report ID, entity type, project for a
new email, applied changes, and any verification or unsupported-capability limitations.

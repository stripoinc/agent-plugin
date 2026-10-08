# Create, persist, and verify

This procedure covers content creation and full rebuilds. Creating an email with no changes
inside it follows [focused operations](../PROVIDER.md#focused-operations) and ends on a successful
`create_email` response with `editorModelReady=true`; it does not enter PERSIST or VERIFY.

### 5. CREATE the email

If PREPARE images already created the email, reuse its recorded `emailId` and verified project;
do not call `create_email` again. Continue with PERSIST after building the final brief.

For an explicit full rebuild, skip creation. Use the named target's existing `(id, type)` and
preserve its unrelated native settings and resources; templates can be rebuilt but not created.
Copy the target's complete `settings` from its acquired model into the brief's `model.settings`
before building; the schema rejects a rebuilt model that omits a settings key.

For a new email not yet created, call `create_email` with the brief's `name` (or the resolved
name from the inspected plan when PREPARE images runs this step early), the resolved `projectId`, and a
`folderId` only when requested, as described in [creation](stripo-creation.md); pass `sourceEmailId` or
`sourceTemplateId` only for an explicitly requested copy, never both. Check the returned project
and `editorModelReady`; if the model is not initialized, keep the same email and report the
required editor action. Creation is not idempotent: after an uncertain create, find the matching
name in the intended project with `find_content` before retrying, and repair a known created
email under the same ID. Do not silently create an email when the user requested a new template.

### 6. PERSIST the new Stripo model

Preserve native font settings and resources. Requested title and preheader are already in the
model's `metadata` and are persisted in the same document upload.
Persist `<new-model.json>` through the prepare-upload/write flow in [Stripo persistence](stripo-persistence.md):

1. Call `prepare_document_state_upload(id=<id>, type=<type>)`; require `status=OK`.
2. Upload `<new-model.json>` to the returned `uploadUrl` through the consuming agent's authorized transfer mechanism.
3. Call `set_document_state(id=<id>, type=<type>, uploadId=<upload id>, baseUploadId=<base ticket, rebuild only>)`. Never pass the complete model as a tool argument.

For a rebuild, also call `prepare_document_state_upload` a second time, upload the target's
untouched acquired model to that ticket and pass it as `baseUploadId`, so the rebuild is applied
as a delta on top of the current state and concurrent edits survive; `UPLOAD_NOT_FOUND` names the
empty ticket in `missingUploadId`, a `VALIDATION_ERROR` about an incompatible delta means acquire
the target again, rebuild from the fresh model, and persist with it as the base, and
`REVISION_CONFLICT` means repeat the same write with fresh tickets. For a freshly created email
built from a brief there is no acquisition: use one ticket and no `baseUploadId`, and the upload
replaces the empty document.
`WRITE_UNCONFIRMED` means the result is unknown, including when a deleted-target rejection was
returned as an internal error. Read back first: do not repeat a rebuild already applied, and
report a missing intended target without recreating or retargeting it. Otherwise rebuild from
the fresh model and upload it unmodified as the base with fresh tickets. If readback fails, stop
and report the failure. Follow the same read-first procedure after a protocol or transport error.
An upload ID is single-use and there is no hash or idempotency argument. After an uncertain
write, read the state before retrying with fresh tickets; allow at most one repair retry under
the same ID. A `MERGE_BROKEN` answer carries the editor's `code` and `details` as [Stripo persistence](stripo-persistence.md)
describes: `details.errors[].path` is a dot path into `<new-model.json>`, so correct the brief,
rebuild, and persist with fresh tickets for both files when rebuilding; do not patch the JSON
by hand. Report the returned `code`, paths, and messages when the repair retry fails.
There is no external metadata write tool: preserve existing name, project,
and folder metadata, report requested metadata changes as unsupported, and reference only hosted
assets.

### 7. VERIFY

Re-read the saved model with `get_document_state(id=<id>, type=<type>)` and request
`get_screenshot(id=<id>, type=<type>, mode="BOTH")`. Download the fresh model and both PNGs
through the host's authorized transfer mechanism.

Inspect the saved model for every intended block, exact copy, CTA href, asset URL, merge tag,
unsubscribe link, and postal/legal detail. Compare the per-type block census with the intended
model.
Verify the stored name and project with `get_content`; do not infer hidden metadata from an image.

Open and visually inspect both PNGs with the host's image-viewing tool. Compare the desktop and
mobile layouts with the reference intent, including readable text, loaded images, spacing,
alignment, clipping, and the CTA. A successful tool call or download alone is not visual
verification.
Compare the saved desktop/mobile previews with the original reference and intended changes,
not only with the most recent generated model. Account for missing branding or blocks, actual
side spacing around text and buttons, and heading scale on mobile. A deliberate design change
is valid in Tailored or Creative when it serves the request; Exact changes require the user's
instructions or a documented native limitation.
For an agent-authored text reference, review both saved previews against its proposed structure,
copy, primary action, and visual direction. No source PNG comparison is required when none
exists; the saved desktop and mobile visual checks are still required.

For **Exact**, when source PNGs are available, compare PNG to PNG against the original source
at matching viewport widths.
Check content order, section dimensions, colors, typography, spacing, image crops, alignment,
and mobile stacking. Correct visible differences in the same draft and repeat the comparison.
Use side-by-side views or an overlay; a pixel-diff score alone cannot establish fidelity.
If only one source viewport is available, compare that viewport and separately inspect the
other target layout, stating that its source comparison is unavailable. If perfect reproduction
is impossible, keep the closest editable result and report the specific differences and causes
(for example an unavailable font, asset, or unsupported layout). Do not claim an exact match
or silently change to Tailored or Creative.
When source PNGs are unavailable, compare the saved model and available target previews with
the inspected source HTML/CSS and report that source visual fidelity is unverified. Continue
the saved-target checks below; missing source PNGs do not require another user-supplied artifact.

If either preview shows a defect, repair the same draft, persist it, then obtain and inspect
fresh previews of both sizes again. Use the existing model-editor workflow for a saved draft;
do not rerun an insertion or duplication module just to verify it. Stop when the intended result
passes review or a concrete limitation prevents repair. In the latter case, report "saved,
visual defects unresolved", name the defect, and do not describe the email as ready to launch.
Screenshots show the current coediting state, including unsaved changes; the fresh model read is
the durable check.

Report full success only when the persisted id exists, persistence and model checks pass, required
metadata reads back correctly, and both visual checks pass. If PNG generation, download, or
inspection fails after a bounded retry, report "saved, visual verification incomplete" when the
other checks passed.
Keep the same id for a later preview retry; do not create another email or repeat a successful
write. Never use an HTML export as the visual-verification fallback for the saved target. Return the id, entity type,
project for a new email, and a concise summary of deliberate deviations from the references.

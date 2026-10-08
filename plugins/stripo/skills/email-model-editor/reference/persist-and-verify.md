# Persist and verify the edit

## 4. Persist by file reference

Preserve native font settings and resources; there is no font normalization step. Follow the
prepare-upload/write flow in [Stripo persistence](stripo-persistence.md):

```text
prepare_document_state_upload(id=<id>, type=<type>)   # ticket for <updated-model.json>
prepare_document_state_upload(id=<id>, type=<type>)   # ticket for <downloaded-model.json>
set_document_state(id=<id>, type=<type>, uploadId=<first ticket>, baseUploadId=<second ticket>)
```

Between the calls, upload `<updated-model.json>` to the first `uploadUrl` and the untouched
`<downloaded-model.json>` to the second, both through the consuming agent's authorized transfer
mechanism. Never pass a model inline and never swap the two ids. With the base the editor writes
only this edit on top of the live state and concurrent edits by others survive. Tickets are
single-use and there is no hash or idempotency argument: keep the read-to-write gap short, and
after an uncertain write read the state before retrying with fresh tickets. Follow the `status`
contract in [Stripo persistence](stripo-persistence.md): a `MERGE_BROKEN` answer names the rejected fields in
`details.errors[].path` (a dot path into `<updated-model.json>`); fix them in the change module,
rerun the runner, and persist with two fresh tickets. `UPLOAD_NOT_FOUND` names the empty ticket in
`missingUploadId`: a missing base has spent nothing, finish that upload and call again; a missing
candidate has spent the base, so upload both files to fresh tickets. `REVISION_CONFLICT` or a
`VALIDATION_ERROR` whose message says the delta is incompatible with the current document mean
the letter moved, not that the edit is wrong: for `REVISION_CONFLICT` repeat the same write with
fresh tickets; otherwise acquire again, rerun the same change module on the fresh model, and
persist with the fresh model as the base. A deleted target can instead return `WRITE_UNCONFIRMED`:
the result is unknown, so read back first. If the changes are already present, do not write again;
if the intended node is missing, report the conflict without recreating it or retargeting the edit.
Otherwise rerun the change module on the fresh model and use it as the base with fresh tickets.
If readback fails, stop and report the failure. Use this same read-first procedure after a
protocol or transport error. Use two fresh tickets for repairs after `INVALID_STATE`, `PARSE_ERROR`
and `SIDE_EFFECT_UNAVAILABLE` as well. Never drop `baseUploadId` to force a write. Allow at
most one repair retry before reporting the failure with the returned `code`, paths, and messages.

## 5. Complete the requested operation

For a focused edit, `set_document_state` with `status=OK` completes the request. Report the saved
change and stop; no confirmation read or preview is required. If the acquired model already
has the requested values and the runner reports `skipped`, report that result without a write.
An uncertain response still requires the recovery above.

The checks below apply to broader changes, full builds/rebuilds, or user-requested verification. For an explicit check, inspect only the requested surface; for full verification,
read both surfaces and follow the complete procedure:

```text
get_document_state(id=<id>, type=<type>)
get_screenshot(id=<id>, type=<type>, mode="BOTH")
```

Download the fresh model and both PNG artifacts through the authorized transfer path. Inspect
the model for the exact requested values, link destinations, image URLs, alt text, merge tags, and
preserved content. Compare its depth-agnostic per-type block census with the acquisition census.
Structural node IDs may change between reads, so compare counts and types rather than those ids.
Saved-library `moduleId` values are persistent identities and must still match. For an explicit
module request, verify the requested ID and content on the final saved target; translated text,
a matching module count, or a successful write receipt alone cannot establish replacement.
After a structural edit, compare the census with the intended additions, removals, or duplication.
The merged result may also contain concurrent edits. Whole-target equality or an unchanged
block count is not required: verify the requested changes and investigate unexplained loss,
while preserving unrelated live additions and edits.
After a metadata edit, compare the fresh model's `metadata.title`, `metadata.preheader.text`, and
`metadata.preheader.fillSpace` with the requested values and the preserved fields. Hidden metadata
is verified from JSON; an unchanged screenshot is expected for a metadata-only edit.
Because the write was applied as a delta, the fresh model may also carry edits other people made
since the acquisition; those are not defects. Report a difference outside the requested change as
a loss only when the acquisition had it, the current state lacks it, and nothing else explains it.

Open and visually inspect both PNG files with the host's image-viewing tool. Check the requested
visible changes, text readability, image loading, spacing, alignment, clipping, and responsive
layout. A successful preview call or download alone is not visual verification. Screenshots do
not prove link destinations, asset URLs, or hidden values; use the saved model for those checks.
Compare against the untouched baseline and requested changes, not only the latest candidate.
Check that branding remains, text and buttons retain effective side spacing, and heading scale
works on mobile. Treat unrequested losses as defects, not as successful simplification.

If either preview shows a defect, write a targeted repair for the same draft, persist it, then
obtain and inspect fresh previews of both sizes again. Do not replay a successful structural edit
as a verification step. Stop when the requested result passes review or a concrete limitation
prevents repair. Report "saved, visual defects unresolved" with the defect if repair cannot
complete; do not describe that email as ready to launch.
Screenshots show the current coediting state with export settings, including unsaved changes; the
fresh model read is the durable check. `PARTIAL` or unavailable previews mean "saved, visual
verification incomplete" when the model checks pass.

Do not rerun the change module for verification. Report full success only when persistence, model
checks, and the required visual checks pass. If PNG generation, download, or inspection is unavailable or
fails after a bounded retry, report "saved, visual verification incomplete" when persistence and
model checks passed. Keep the same id for a later preview retry. Do not substitute an HTML
export, inspect HTML as the visual check, or repeat a successful write to obtain a preview.

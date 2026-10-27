# Create, persist and verify

### 5. CREATE or acquire the target baseline

For an explicit full rebuild, skip creation. Acquire the named target before BUILD and preserve
its untouched complete model and manifest as the baseline. Set the brief's `model.settings` and
font resources from the requested source design. The builder fills schema defaults; do not copy
the target's visual settings merely to make a rebuild complete. The target model supplies the
persistence baseline, while the reference supplies typography, width, borders and layout.

For a new email, use `PROVIDER.md` to create once with supported metadata. Reuse any identity already
created during PREPARE images. Check the returned initialization status; if initialization is
unavailable, stop dependent writes, retain the draft, and report the required editor action.
After an ambiguous create, use the recovery lookup in `PROVIDER.md`
before any retry; never create a duplicate to work around an unknown outcome.

When `PROVIDER.md` requires acquisition of the new shell, acquire it and rerun BUILD once with
`--baseline <shell-model.json>` to validate the initial candidate against the actual shell.
Keep the extracted brandkit and brief unchanged for that run.
This validation baseline does not imply that the provider accepts a base upload in create mode.
Retain the final candidate for persistence retries; do not regenerate IDs after a successful save.

### 6. PERSIST

Use the create contract in `PROVIDER.md` for a newly created draft and its edit/rebuild contract
for an existing target. Follow its acquisition-history rules too: a new identity alone does not
authorize dropping an acquired base. Prepare the required tickets, transfer exact file bytes, and finalize
only after successful uploads. Edits/rebuilds preserve the byte-exact acquired base; creation
may require a single candidate ticket and forbid a base. Do not send the model inline or
copy hash, idempotency, or ticket rules from another provider.

Persist `metadata.preheader` and `resources.fonts` in the same native document as the body.
Follow `PROVIDER.md` for requested external metadata changes and provider-specific recovery.
After uncertainty, read first. Verify already-saved changes instead of writing them again.
Before the first successful save, follow the initial-write recovery and baseline rules in `PROVIDER.md`.
After a successful save, repair the same draft against its fresh saved state. Never restore a
stale snapshot, recreate a deleted target, drop concurrency checks, or restart image jobs.
Changed inputs need the provider's appropriate new tickets/keys. If readback fails, stop and
report uncertainty.
Allow at most one repair retry per rejected change unless `PROVIDER.md` documents a bounded
recovery sequence for that concrete failure. Retain the requested content and report any
part that cannot be persisted; do not silently simplify the email to pass validation.

### 7. VERIFY

Use `PROVIDER.md` to reacquire the saved native model and both desktop/mobile previews. Issue
these independent reads together when the host supports it, keep their results distinct, and
download every artifact through the configured transfer helper. Verify native fonts, requested
metadata, and the provider's compiled-content checks, including its saved preheader checks when
the model sets or copies a preheader. A receipt alone does not establish requested-value equality.

Inspect the saved model for every intended block, exact copy, CTA href, asset URL, merge tag,
unsubscribe link, and postal/legal detail. Compare the per-type block census with the intended
model.
Verify supported external metadata through the read operation in `PROVIDER.md`; do not infer it from an image.

For intentional inline styling, follow the shared [inline-style verification](../../email-model-editor/reference/persist-and-verify.md#inline-style-verification)
before judging the saved previews.

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
Apply the preview freshness and durable-state checks in `PROVIDER.md`; hashes do not replace visual inspection.

Report full success only when the persisted id exists, persistence and model checks pass, required
metadata reads back correctly, and both visual checks pass. If PNG generation, download, or
inspection fails after a bounded retry, report "saved, visual verification incomplete" when the
other checks passed.
Keep the same target identity for later preview retries; do not create another email or repeat
a successful write. Never use an HTML export as the saved target's visual-verification fallback;
rendering source HTML as reference evidence is allowed.

### 8. PRESENT

After the last confirmed save and the checks above, run the provider's final presentation step
once when `PROVIDER.md` defines one. It is not verification, needs no further write, and its
absence or failure does not change the saved result.
Return the saved identity, destination and available presentation link as defined in `PROVIDER.md`,
plus a concise account of deliberate deviations from the references.

# Persist and verify

## Persist by file reference

Follow the edit/rebuild contract in the provider's persistence topic (`PROVIDER.md`). Prepare distinct candidate and base tickets where
required, upload the complete candidate and byte-exact acquisition through the configured helper,
and finalize only after every transfer succeeds. Never swap their ticket IDs, pass JSON inline,
or discard the concurrency protection to force a write. Use the provider's exact hash,
idempotency, ticket-consumption, and retry rules; these are not interchangeable.

After an uncertain write, read current state before considering any retry. If the intended
changes are already present, verify them without another write. If a target node was deleted
or changed incompatibly, report the conflict without recreating or retargeting it. Otherwise
reconcile against a fresh acquisition and rerun the SDK module. Never restore a stale snapshot.
If readback fails, report the uncertainty and stop. Repair returned field errors in the module,
not in the generated JSON. Allow at most one repair retry, using the tickets and keys required
by `PROVIDER.md`. A confirmed pre-write conflict may have its own bounded retry rule there;
never apply that rule to an unknown outcome. Report unresolved codes, paths, and messages.

## Verify durable state

Acquire a fresh native model and perform the required verification calls through `PROVIDER.md`.
Request desktop/mobile previews unless the provider defines a preheader-only completion rule;
then perform its saved native/compiled preheader checks instead of requesting PNGs.
Independent verification requests may be issued together when the host supports it; inspect
every response. A merge receipt is not the resulting document. Use the fresh file and manifest
for any next edit. Verify `resources.fonts` and requested font-family settings in that file.

Download the fresh model and required PNG artifacts through the authorized transfer path. Inspect
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
After a metadata edit, compare the fresh model's `metadata.title`, `metadata.preheader.text`,
and `metadata.preheader.fillSpace` with the requested and preserved values. Follow `PROVIDER.md` for
any compiled-preheader checks and its preheader-only preview rule. Screenshots cannot
verify hidden metadata; unchanged previews are expected after a metadata-only edit and are not a
defect to repair. A concurrent change outside the requested delta is not automatically a loss.

## Inline-style verification

For intentional inline-style changes, verify the requested CSS properties, values or removals
on the intended elements in fresh native content against the checked candidate, allowing harmless
serializer changes in quoting, whitespace, and declaration order. A write receipt does not
prove the styles were saved. An incorrect local candidate is a mutation failure;
a correct candidate followed by a native styling mismatch is a persistence discrepancy.
`PROVIDER.md` states whether compiled HTML/CSS verification is available and any export quota limits.
Where supported, verify requested CSS on the compiled elements before judging the PNGs.
Correct native CSS followed by different compiled CSS is a compilation or rule discrepancy;
report unavailable compiled-style verification explicitly. Screenshots alone do not establish it.

If retained styling still renders incorrectly, inspect the affected elements, applicable rules,
and layout constraints. A preview showing literal merge placeholders does not establish a
recipient-data rendering defect.

To undo CSS property changes, reacquire live content and change only properties still matching
this repair, including continued absence after a removal: restore the acquired value of a
replaced or removed property, or remove only a newly added property. Preserve concurrent edits,
links, and merge expressions. Stop on a conflicting value and report it for reconciliation;
never restore a stale block or model snapshot.

Once both PNG downloads succeed, open both with the host's image-viewing tool in the same model
response when multiple calls are supported. Inspect both returned images independently; batching
must not hide either result or treat one successful image as success for the pair. Check the requested
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
Follow `PROVIDER.md` for preview freshness semantics and presentation links. A matching manifest
hash supports verification but does not replace inspecting visible changes. A preview may show
coediting state; use the fresh model and the provider's durable checks to assess persistence.

Do not rerun the change module for verification. Report full success only when persistence, model
checks, and the required visual checks pass. If PNG generation, download, or inspection is unavailable or
fails after a bounded retry, report "saved, visual verification incomplete" when persistence and
model checks passed. Keep the same id for a later preview retry. Do not substitute an HTML
export, inspect HTML as the visual check, or repeat a successful write to obtain a preview.

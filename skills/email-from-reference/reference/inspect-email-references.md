# Email, HTML and image references

Read this topic during INSPECT when the reference is a live email or template, HTML/CSS, an
image or screenshot, or a Figma export. The rest of INSPECT stays in
[Resolve and inspect](resolve-and-inspect.md).

## Acquire

Source PNGs are preferred evidence, not a prerequisite for continuing from an authorized
HTML/CSS reference. Try the provider's preview tool when available; a missing local browser
does not make remote MCP previews unavailable. For HTML/CSS without usable source previews,
try the host's documented renderer unless it is already known to be unavailable. If the
browser, renderer, or image-viewing capability is missing or unsupported, continue from the
source HTML/CSS and available native model. Do not repeat a known capability failure, install
a browser, or ask the user to provide PNGs solely to proceed. Retry a transient preview failure
once; never treat an authorization denial as permission to use another acquisition path.

For a live reference, acquire its model and try desktop/mobile PNG previews when the
preview tool is available. Issue these acquisitions together with the RESOLVE reads that do not
depend on them:

Use the model acquisition and preview calls defined in `PROVIDER.md` with the reference identity.

Download file manifests through the host's authorized transfer mechanism. Prefer a populated
native model. If the reference model is empty or explicitly unavailable, call the authorized
reference-HTML operation defined in `PROVIDER.md`, if available, and download the artifacts it
actually returns. Read HTML together with embedded and separately supplied CSS; a separate CSS
file is not required when the provider returns self-contained HTML. Export JSON is an export
envelope, not proof of a native editor model. Inspect inline styles, media queries, image URLs, and links,
and reconstruct them as native JSON blocks. This fallback applies to all three regimes.
An authorization error is not a missing model; respect it. Retry a temporary acquisition failure
once before reporting it. Use only exports covered by the existing authorization.

## Examine

Open available PNGs with the host's image-viewing tool. Use the native model for exact copy,
links, and asset URLs. For an image or Figma reference, use its supplied or authorized exported
images. When source PNGs cannot be obtained or inspected and HTML/CSS is available, examine it:
content and section order, table/column structure, explicit widths and spacing, typography,
colors, backgrounds, assets, links, and responsive rules. Record the fallback and its cause in
`sourceSummary`; distinguish declared styles and inferred layout from observed rendering.
Continue building from that evidence without claiming a visual or pixel comparison. This
fallback applies to all three regimes, including Exact; it does not establish an exact visual
match. Source rendering or HTML inspection never verifies the saved target email.

## Saved modules

New reference emails copy editable content rather than saved-library bindings. A source
`moduleId` is read-only and cannot be inserted on the new structural IDs. The builder detaches
it only when that module's editable blocks are present, preserves those blocks and their
styling, and lists the removed bindings in diagnostics `detachedModules`. Report the copied
content as detached; do not claim saved-module identity or synchronization. Existing-email
content edits preserve their acquired bindings. If retaining a saved-library identity is an
explicit requirement, this creation path is unsupported; report it instead of using detached
content to claim library reuse. An unresolved module must be acquired completely before copying.

## Verify an Exact reproduction

During VERIFY, in addition to the saved-target checks in
[Create, persist and verify](persist-and-verify.md):

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

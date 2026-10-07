# Reconstructing reference geometry

For Exact image/HTML reconstruction, read this before writing the brief and use it again on
the saved PNGs. Record the measurements and unresolved limitations in `sourceSummary`; no
additional brief schema is needed. Measure the supplied source, not a resized tool thumbnail.
Start from this request's reference. Do not search other thread directories for an earlier
brief or reconstruction, or treat previous output as the original, unless the user explicitly
identifies it as a reference. Packaged generic examples may illustrate syntax, not supply
unmeasured geometry.

## Measure before building

- Record each source image's actual pixel dimensions and the reference viewport/body width.
  For HTML, inspect explicit widths, padding, backgrounds, media queries, and vertical
  alignment; use computed values only when a renderer is available. Without source PNGs,
  record CSS-derived layout as inferred rather than measured pixels and continue the brief.
  For screenshots, measure the body edges and the section boundaries.
- List each logical row in reading order, including its desktop columns and mobile order.
  Each repeated item must keep its image/title/description/CTA together. Use one structure
  per repeated row, not one column containing all titles and another containing all copy.
  A tall crop containing several unrelated image rows loses their editable alignment and
  mobile ordering; crop the individual visual groups instead.
- Record outer canvas, stripe outside the body, body fill, and inner panel fill separately.
  Record content insets at their actual parent, column widths, gutters, vertical alignment,
  image bounds, corner radius, and CTA width mode at both supplied breakpoints.
- Inventory the whole artwork, including bottom edges, rounded corners, shadows, ornamental
  strips, and whitespace that establishes alignment. Crop in the original pixel coordinate
  frame (or explicitly map the viewed dimensions to it using the host helper). Open every
  crop at a useful scale before upload and compare all four edges with the source. Use the
  host's crop-context preview when available: it shows the proposed box over the surrounding
  source, so a boundary cutting through an object remains visible. Expand a crop that cuts
  a silhouette, rounded corner, shadow, or decorative strip. In-bounds coordinates and known
  source dimensions do not prove the object is complete. For tall screenshots, inspect short
  sections with source-coordinate labels rather than estimating from a whole-email thumbnail.
- Give uploaded assets a name containing their content digest. Generic names such as `hero.png`
  can resolve to an older asset in the destination media library. A successful upload and a
  matching email-model hash do not prove the hosted pixels changed: compare the saved image
  bounds and composition with the crop, and inspect returned upload metadata when they differ.

## Map measurements to native fields

Do not rely on builder defaults to infer the source design. Read the native field definitions
when a field is unfamiliar; use the smallest supported representation that preserves the
visible relationship.
The acquired shell is a persistence baseline, not a visual reference. Its button borders,
heading alignment, and other defaults must not leak into a reconstruction. Copy any desired
global settings from the actual source into the brief explicitly.

| Reference relationship | Native representation |
| --- | --- |
| Outer page versus centered body band | `settings.general.lightTheme.backgroundColor`, stripe `stripeBackgroundColor` (outside the body), and `contentBackgroundColor` (inside) are separate. Do not assign a body band color to the outside stripe unless the source bleeds across the viewport. |
| Text on a photo or colored panel | Keep the photo as the correct structure/container background and use transparent child text backgrounds. Preserve its measured content width, position, height through content/padding, and overlay text. A separate image followed by text is a different layout. Clear stale background images when replacing a layer. |
| Edge-to-edge image next to inset copy | Keep outer structure padding at zero; put the inset on the text container. Set container vertical alignment from the source. A structure inset shrinks both columns. |
| Repeated paired items | One structure per pair, with the paired blocks inside its columns. Inspect mobile reading order and use inversion only where the source requires it. |
| Product images on a shared visual baseline | Preserve each image's source canvas/whitespace or map its individual offset. Different tight crop heights with top alignment do not preserve the source baseline. |
| Circular or rounded image | Set native image border radius; preserve baked corners and the complete silhouette when cropping. |
| Fixed versus fluid image | Set `size.desktop`, `size.mobile`, and `responsiveMobile` deliberately. A stacked column gets the mobile body width: do not proportionally shrink the image a second time. |
| Content-width CTA | Set `fitContainer` explicitly for both breakpoints. A short source CTA must not stretch to the full mobile container. If source buttons share a fixed visual width but labels differ, size each button's horizontal padding separately and verify the saved width. |
| Heading alignment | Check both block alignment and `settings.headings.h1`…`h6.textAlign.mobile`, which can override the block on mobile; `null` means no override. |
| Short divider | Use a fixed pixel line width and explicit alignment; `100%` means the full container. |
| Social row above legal copy | Keep it a separate row at the measured width; do not squeeze it into an unrelated legal-text column. |

Sum insets through stripe, structure, container, and block. Adding the same gutter twice is a
layout error. Never flatten native text/controls to an image just to match a screenshot.
For a centered photo-backed panel, do not put the only image on the stripe while leaving the
body transparent: Reteno paints that image outside the body and the overlay text can disappear.
When a native background uses `sizeX: "cover"`, set `sizeY: "auto"`; a `cover`/`cover` pair can
pass local schema validation but fail the Reteno document-state write. Compare the saved
photo crop after this adjustment.

For desktop two-column image/quote rows, check `structure.settings.responsiveMobile` in the
saved mobile preview. If it is false, text can remain in a narrow column and wrap vertically;
enable stacking and set inversion deliberately to keep each image with its own quote. Check
text contrast against the actual saved panel, including inline colors that override block
settings. If the source has decorative social icons but supplies no link destinations, an
uploaded crop of just that icon row can preserve its visible geometry as an editable image;
disclose that its individual destinations remain unverified.
When a desktop row of cards or counters stacks on mobile, set each container's mobile vertical
padding from the source mobile design. Reusing large desktop top/bottom padding on every stacked
column multiplies the total section height. Keep outer stripe color separate from the centered
content color when the source shows visible gutters around a tinted panel.
Count vertical padding on each text block as well as each container in mobile-stacked columns.
An 18px bottom inset on every heading adds 72px to a four-column counter row after stacking,
even when the heading's HTML margin is zero. Set the mobile block padding independently from
desktop and compare the saved section height with the source mobile image.
Represent horizontal separators with a native border or a full-width text span with a one-pixel
top border and a nonbreaking space. Repeated `━`/`─` characters form one unbreakable text run;
they can expand the entire mobile email table and push other columns off-screen.
When the border sits in a text block, set the wrapper paragraph's `font-size:1px!important`
and `line-height:1px!important`. The mobile compiler otherwise forces that paragraph to
16px and inserts a full line of space at every divider.
Reteno's generated mobile stylesheet forces content paragraphs to 16px with `!important`.
An inline `font-size` on the `<p>` can therefore look correct on desktop yet enlarge small
mobile copy, wrap compact detail rows, and lengthen the email. For a source mobile design with
smaller text, put the mobile size on a nested span with `!important`. For aligned label/value
rows, use a two-cell presentation table with an explicit font size on each cell so wrapped
values stay in the value column. Verify the saved mobile PNG, not just the JSON or desktop HTML.
Reteno can also give a two-column native structure equal mobile widths even when its desktop
column widths differ and `responsiveMobile` is false. For compact receipt rows, keep the label
and amount together in one presentation table when the source needs unequal mobile columns.

`responsiveMenu` controls stacking; it does not establish an interactive hamburger menu.
Check the actual model capability for collapsed navigation. A static hamburger glyph with
hidden links is not a working substitute. Report unsupported behavior and the visible
difference instead of claiming a faithful mobile match.

## Verify the saved email by region

Use the fresh saved model and PNGs from the same write. Remove preview UI/chrome only when its
bounds are identified; preserve the email canvas. Compare at the same CSS/body scale without
stretching either image to equal height. If source HTML and a working host renderer are
available, render it at the saved preview's viewport width. If source rendering is unavailable,
compare the saved model and target PNGs with the inspected HTML/CSS, and mark source pixel
comparison unverified; do not ask for source PNGs solely to continue. If only a desktop
screenshot is supplied, mobile can be reviewed for defects, but cannot be claimed to match an
unseen source.

When source PNGs exist, open aligned source/saved crops for the hero, each repeated-row pattern,
any image crop, colored band, CTA, and footer. Check row/column order, insets, image edges, backgrounds,
alignment, overlays, element sizes, and mobile stacking. Look at the lower half of long
emails too. Text or image counts, valid JSON, matching hashes, and a successful save do not
establish layout fidelity. Font substitution can be disclosed independently; it does not
justify a different topology, clipped image, missing label, or misplaced CTA.

Keep a short `layout-review.md` beside the preview files: region, source measurement, saved
measurement, inspected crop paths, pass/defect/unverified, and remaining cause. Fix every
observed repairable layout defect on the same draft and inspect fresh desktop/mobile PNGs.
Report persistence and visual fidelity separately in the final result. If a defect remains,
say `saved, visual defects unresolved` and identify it. A claimed model limitation requires
a concrete missing field or rejected minimal change with read-back evidence, not a failed
first attempt. After a failed repair, read the live state before retrying and report the
actual service error; never repeat an identical rejected payload blindly.

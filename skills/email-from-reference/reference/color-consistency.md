# Color consistency

This is the shared color contract for native email creation and editing. Read it before
planning colors or changing text markup, colors, backgrounds, or inserting text. The skill's
workflow defines where to record the plan and how to rebuild or rerun its candidate.

## Choose foreground/background pairs

For each affected section or scope, choose its actual background together with body, heading,
link, and CTA text colors. Include the CTA fill and any intended dark-theme pairs. Reuse coherent
pairs from the authorized reference or Business Profile, keeping their roles together, and
choose legible combinations where design choices are allowed. Preserve unrelated local
exceptions and shared theme values.

Resolve the painted surface through the relevant parent layers. Transparent exposes the
underlying layer; it does not mean white. Keep the outer page, stripe gutters, centered body,
and local panels distinct. Image-backed, gradient, or unresolved surfaces need visual evidence;
do not substitute a guessed solid color to claim a contrast check passed.

Use the native fields for the intended scope:

| Role | Native fields |
| --- | --- |
| Outer page | `settings.general.lightTheme.backgroundColor` |
| Stripe gutters / centered body | Stripe `settings.stripeBackgroundColor` / `settings.contentBackgroundColor` |
| Local panel | Structure/container `settings.backgroundColor` |
| Text block | Block `settings.fontColor` and semantic inline treatments in `content` |
| Area text / links | `settings.stripes.lightTheme.<area>.fontColor` / `linkColor` |
| Shared heading level | `settings.headings.lightTheme.h1.fontColor` (likewise `h2` through `h6`) |
| CTA text / fill | Button block `settings.fontColor` / `backgroundColor`; shared defaults use `settings.buttons.lightTheme.fontColor` / `buttonColor` |

A theme font-color edit does not imply that every heading, button, or local exception has that
color. Do not change a shared heading level to repair one local exception. Keep link colors as
a separate role, including existing anchor and nested inline styles.

## Keep native and inline colors consistent

There is no universal inline-over-block precedence rule for a JSON write: how the editor applies
a text block's `fontColor` to inline colors is listed under [Text color](editor-limitations.md#text-color).
CSS specificity alone does not predict the persisted result.

For uniform-color text, explicitly supply the intended native `settings.fontColor` and remove
or align conflicting inline `color` declarations in `content`, preserving unrelated markup,
links, and text.

Keep intentional multicolor text distinct from accidental contradictions. During an existing
block's content-only edit, preserve its inline treatments and acquired `fontColor`; do not issue
an unrelated block-wide recolor. Do not flatten the design to
pass a check. Report an unresolved required treatment instead of inventing a persistence
workaround.

Inspect relevant `lightTheme` and authored `darkTheme` pairs separately. The shared dark fields
mirror their light counterparts; `null` means no authored dark override. Enabled dark rules can
use `!important` to override ordinary inline colors. Do not invent block-level dark settings or
promise that every email client will leave light-theme colors unchanged.

## Check the completed candidate before upload

Read the relevant nodes' full settings and content from the completed candidate, including any
defaults added during building. Check the affected parent/theme backgrounds as well.

- Check native/inline agreement for uniform-color text while preserving intentional multicolor
  and link treatments. Compare equivalent color values rather than raw spellings.
- Check the selected foreground/background pairs, CTA fills, and authored dark overrides.
  Calculate contrast for known opaque solid pairs. Unknown or image-backed surfaces are not a
  passing static contrast check.
- Resolve accidental contradictions in the workflow's source brief or mutation module before
  upload. Schema validity and abbreviated inspection snippets do not establish color consistency
  or readability; do not treat them as a color audit.

Keep this a local check scoped to the planned creation/rebuild or affected edit. It does not add
remote reads, screenshots, or a full verification cycle to a focused edit. Preserve the
workflow's existing final visual checks for full builds/rebuilds and requested verification,
including image-backed text and client-dependent rendering.

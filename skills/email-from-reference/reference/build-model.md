# Brief and build

### 3. BRIEF

Write a version 2 creation brief conforming to [creation-brief.schema.json](creation-brief.schema.json). Start from [the example brief](../examples/prompt-only.creation.json) when useful.
Translate the supplied or agent-authored text reference into the complete native model; the
example's placeholder copy, assets, and destinations are not verified campaign facts. Its
`message` is a valid instance of the installed provider's metadata; replace those values too.

The brief contains:

- `message`: provider creation metadata as defined in `PROVIDER.md`, plus local `referenceMode`;
- `model`: a draft using the native editor schema's field names and nesting.

The brief schema describes the wrapper and message metadata. The bundled editor schema
defines the editor model. Put global styles in `model.settings` and content under
`model.stripes[].structures[].columns[].containers[].blocks[]`.

The builder supplies omitted node IDs and default settings. Supply the complete intended
topology, each column's `settings.width` in pixels, and the content of every block:

- Text: `type: "text"` with `content` containing semantic HTML.
- Image: `type: "image"` with `settings.src`; optional `settings.altText.text` and native `settings.link`.
- Button: `type: "button"` with `settings.text` and native `settings.link`, such as
  `{ "type": "site", "value": "https://example.com" }` or `{ "type": "email", "value": "mailto:help@example.com" }`.
- Spacer: `type: "spacer"`; use `settings.mode: "line"` for a rule or `"space"` for a gap.
- Social: `type: "social"` with `settings.networks`, one entry per icon such as
  `{"type": "instagram", "link": {"type": "site", "href": "https://www.instagram.com/brand"}}`.
  The builder infers a missing link type from the href, defaults the title to the network name,
  and fills the editor defaults (`style: "logoColored"`, `iconSize: 32`, centered). Social links
  support `http(s)://`, `#`, `mailto:`, `tel:`, `ftp(s)://`, `sms:`, `tg://`, and `viber:`;
  other non-empty, trimmed hrefs use `type: "other"`, matching the editor's link contract. Known networks
  never carry `icon`; the editor derives it from the type and the block `style`. Only
  `type: "custom"` requires an `icon` URL. `alt` is allowed only with `settings.textCustomization:
  true`, which then requires it on every network; supplying `alt` on any network enables it. A
  network `type` has to be one the editor ships an icon for, `title` is at most 100 UTF-16 code units
  and `alt` at most 500 (`String.length`, so `😀` counts as two). `iconSize` is an integer 16..64
  and `spaceBetweenIcons` an integer 0..40. The
  persisted schema does not express these rules, but the editor rejects the write when they are
  broken, so the builder validates them locally.

For an authorized logo, native image dimensions use `size`, not `width`, and an image link uses
`href`, not the button's `value`. For example (replace the asset and destination with verified URLs):

```json
{"type":"image","settings":{"src":"https://example.com/logo.png","altText":{"text":"Target brand"},"size":{"desktop":{"mode":"width","px":170},"mobile":{"mode":"width","px":170}},"responsiveMobile":false,"link":{"type":"site","href":"https://example.com/"}}}
```

Set section areas through stripe `settings.messageArea`. Global settings supply section colors
and button defaults; explicit node settings replace those defaults during draft completion. Global colors live in each section's
`lightTheme` branch, for example `settings.stripes.lightTheme.content.linkColor` or
`settings.buttons.lightTheme.buttonColor`; `darkTheme` mirrors it, and `null` there means no dark override.
Supply the color settings selected under [Color consistency](color-consistency.md) explicitly
in the brief instead of relying on omitted values to reproduce the planned design; for text with
inline colors, follow [Text color](editor-limitations.md#text-color).

Images default to their column's
width with matching desktop/mobile sizes. Set both sizes explicitly when different sizes are
intended. Supplied IDs and fields are preserved except that bare email button targets receive
the `mailto:` prefix required for persistence. Duplicate IDs fail validation.

Global settings and block settings are different schemas. `model.settings` (`general`, `stripes`,
`headings`, `buttons`) holds the defaults for every element of a type, but a block's own
`settings` accepts only the keys the editor schema lists for that block type, and some global
keys have no block-level counterpart. Check the block definition before
adding a key to a block: `node <skill-dir>/scripts/describe-settings.mjs --target <name>` lists
the native settings of a block type (`text`, `image`, `button`, …), a node kind (`stripe`,
`structure`, `column`, `container`) or a global group (`general`, `stripes`, `headings`,
`buttons`) compactly. Use it instead of reading the bundled schema files or the provider's
schema tool. When the block schema lacks the key, the global setting is the only way
to change it, and it then applies to every element of that type in the email. A key the block
schema does not list fails validation as `unsupported property`. For example, button
`letterSpacing` and `textTransform` exist only in `settings.buttons`; the hover effect is the boolean
`settings.buttons.hoverButtonStyles`, with its colors in `settings.buttons.lightTheme.hoverButtonStyles`.

The unified SDK covers text, image, button, spacer, social, menu, video, timer, HTML and
unknown blocks with native types and canonical defaults. Use `createBlock`, `createStructure`
and `createStripe` for programmatic creation; layout widths are positive weights on write.
Menu and social arrays use explicit collection methods. Timer/video changes that require an
unavailable preview fail rather than fabricate assets. Preserve supplied native values and
resources. For a rebuild, use the acquired target as `baselineEmailJson`, or use
`createDocument({current})`.
Creation and editing use the same current/target preparation and loss
guards. The successful result is the normalized validated JSON; failed preparation removes
stale output. An optional encoded-model preflight is stronger local evidence, while a server
set followed by get is required to confirm persistence.

The builder's defaults are fixed values, not the live document's values. The candidate and base
are complete models; persistence applies their differences to the live state for a rebuild,
while creation replaces the new shell. Settings are canonical and complete: the built model
has every key of `general`, `stripes`, `headings`, and `buttons`, including both theme branches.
The builder fills a key the brief omits, such as `general.hideImageDownloadIcons`, with its
schema default instead of failing, also with `--baseline`; it never copies the target's value.
Unset optional values are `null`: background images, custom list styles,
paragraph bottom space, heading font weight, and every dark-theme color. For an explicit full rebuild,
use the acquired target as the validation baseline and set the brief's `settings` from the
requested source design and user instructions; do not copy the target's visual settings merely to
make a rebuild complete. Preserve unrequested metadata. Never persist a
partial document; `email-model-editor` describes resets under
[Model completeness](../../email-model-editor/reference/mutate-and-validate.md#model-completeness).
Put requested or copied document title and preheader values in `model.metadata`, for example:

```json
{"title":"Spring collection","preheader":{"text":"Discover what's new this season","fillSpace":true}}
```

Both preheader fields are required. For text-only changes preserve `fillSpace`, using `false`
when no preheader exists. Clear with `{text: "", fillSpace: false}` instead of deleting keys.
Preserve unrequested metadata. New or changed text is limited to 500 UTF-16 code units;
unchanged longer text needs the acquired target as the validation baseline. Document title is
not the sending subject. Keep `message.preheader` and `message.preHeader` absent. `PROVIDER.md`
defines external metadata support. Use `email-model-editor` for bounded metadata edits.

Prefer semantic text, image, button, spacer, and social blocks for newly drafted content. Preserve other
schema-valid native blocks from the reference; do not replace editable content with newly authored
raw HTML blocks. Text-block `content` is limited to the semantic markup needed inside that block.

Build a complete email. In Exact, preserve the source's intentional content and desktop/mobile
structure; do not add a new section or CTA merely to improve the design. In Tailored and Creative,
use a meaningful opening, message body, clear action when appropriate, and compliant footer.

Copy explicitly designated by the user for the target email may be used regardless of its
transport. Do not copy other source-specific wording, identities, offers, URLs, legal text, or
private data unless the user has authorized them and they pass the verified target requirements.
In Exact, an authorized reproduction includes the source's visible copy and assets unless the
user requests changes. In Tailored, preserve the primary CTA's label and presented action but
use the target's approved destination. Record the chosen regime, source PNGs, intended changes,
and any unavoidable fidelity limits in `sourceSummary`.

### Native fonts

Preserve typography from the authorized reference. Put custom-font definitions in
`model.resources.fonts` and select their font-family stacks in native body, heading, button,
and block settings. Each definition has `fontFamily` plus one of:

- `importMethod: "link"` or `"import"`, with the hosted stylesheet `url`;
- `importMethod: "fontFace"`, with ready-to-inline `css` and an optional source `url`.

Set each resource's `fontFamily` to the complete stack assigned in settings, including
fallbacks: for `Inter, Arial, sans-serif`, use `inter,arial,sans-serif`. The editor matches the
canonical stack when connecting resources. In `fontFace` CSS, the `@font-face` family remains
the primary name, such as `Inter`.

Use the native schema to validate the definitions. Keep existing font resources needed by the
model, including during rebuilds. Fonts and fallback stacks remain as requested. No separate
shell-font plan is needed: font resources travel in the same document upload as the content.

### 4. BUILD

Run the fixed TypeScript-generated builder:

```bash
node <skill-dir>/scripts/create-from-brief.mjs \
  --brief <creation-brief.json> \
  --output <new-model.json> \
  --diagnostics <diagnostics.json>
```

For a full rebuild, acquire the target before building and add `--baseline <target-model.json>`
to the command. Pass its untouched, complete native model. This allows unchanged imported
title/preheader text above 500 UTF-16 code units while still rejecting changed text above the
limit. For a new email, omit `--baseline`; do not use a reference as the target baseline.

BUILD waits for every image result ([Parallel work](parallel-work.md)). A brief drafted while
images render leaves their `settings.src` empty; the builder rejects an image without `src`, so
fill in every collected URL before building. Never substitute a placeholder URL.

Require a zero exit code and schema-valid output. Inspect diagnostics for stripe, structure, column, container, and block counts. Re-open the output when needed to verify exact copy, links, asset URLs, merge tags, areas, and visibility.

Before upload, apply the shared [candidate color check](color-consistency.md#check-the-completed-candidate-before-upload)
to the completed model, including builder-added defaults, and compare it with `sourceSummary`.
Correct the brief and rebuild before upload; do not patch generated JSON ad hoc.

For requested inline CSS, apply the shared [inline-style candidate checks](../../email-model-editor/reference/mutate-and-validate.md#inline-style-candidate-checks)
to the builder output before persistence. Check a fresh build against the intended brief and
request; no acquired edit baseline is required.

The builder assigns fresh structural IDs to copied or rebuilt content so reference IDs cannot
collide with existing blocks in the destination. Reuse the generated model file for persistence
retries; rebuilding assigns new IDs. Bounded edits use `email-model-editor` and retain target IDs.

Repair schema errors without removing intended content. Read the field errors in
`diagnostics.error.errors` and compare the failing block with its native reference. A technical
failure is not a reason to drop a logo or simplify the design. If repair cannot complete, keep
the draft and report the defect; do not redefine the intended result merely to pass validation.

# Mutate and validate the model

Validation runs the editor's own Document State rules bundled into the SDK. No schema download
or initialization is required. `bundle.json.editorValidator` records the editor revision.
`finish()` validates edits against the acquired input; create mode validates a new document.
The service also validates its deployed revision and applies the write to its live state;
local success does not establish persistence.

## 2. Write the change module

Create one task-local file such as `<workspace>/email-<id>.changes.mjs`. Export a function and
mutate only the supplied `email` handle:

```js
export default ({ email }) => {
  const logos = email.select({
    nodeKind: "block",
    type: "image",
    inMessageArea: "header",
  });
  if (logos.length !== 1) {
    throw new Error(`Expected one header logo, found ${logos.length}.`);
  }
  logos[0]
    .setSrc("https://cdn.acme.example/logo.png")
    .setAlt("Acme")
    .setHref("https://acme.example/");
};
```

For document title or preheader requests, use `email.setMetadata(patch)`:

```js
export default ({ email }) => {
  email.setMetadata({
    title: "Spring collection",
    preheader: {text: "Discover what's new this season", fillSpace: true},
  });
};
```

Read current values from the inspection's `summary.metadata`. Include only the requested fields.
When changing only the preheader text, carry over its current `fillSpace`; use `false` if no
preheader exists. Both preheader fields must be supplied. [Native metadata](stripo-creation.md) defines the limits and
clearing semantics. This method also works when the native model has no blocks. Return nothing
from the module, including after a chained SDK call.

Use `email.one(selector)` when exactly one match is required, or `email.block(id, type)` for
a type-checked block. `within` restricts a selector to a subtree. Use `patchSettings(patch)`
for supported settings; unknown keys, arbitrary collection arrays and `undefined` are errors.
Use collection methods for social/menu items, `setSpacerMode` for spacer variants, and
`resetSettings(paths)` for confirmed resets. A line spacer's `settings.mobileBorder` overrides
its mobile line; `null` inherits `border`. `node.describe()` exposes the pinned contract.
Each method is atomic. The synchronous module may also receive `transaction` and group
related changes with `transaction(email => { ... })`; failure restores the whole group.
All ten native block types are represented. Timer reads and unrelated supported edits are
allowed, but preview-dependent changes and unsupported structural actions fail explicitly.

Rules for the module:

- Use the full `EmailDocument` API declared in
  `<bundle-root>/packages/convo-email-agent/sdk/types.d.ts`: `email.byId`, `email.select`,
  `email.first`, `email.theme`, node mutation methods, `remove()`, `repeat(totalCount)`, and
  `insert(componentName, {after: handle})`. `repeat` takes the final total count including the
  original. Use the handles returned by `repeat` for subsequent edits; the original IDs are
  replaced. Insertion also accepts `{before: handle}`.
- Check expected selector cardinality. When a request intentionally targets every match, require at
  least one match before iterating.
- Encode requested strings as JavaScript string literals; never evaluate customer text as code.
- Do not import filesystem, process, network, or shell facilities. The edit function receives only
  `{ email }`; the module's only job is to call SDK mutation methods.
- Preserve unrelated content, links, merge tags, visibility, and compliance content unless they
  are explicit targets. Make structural changes as needed to fulfill the user's request.
- Prefer a theme edit for a broad change and a node edit for an exception. Render precedence is
  inline HTML, block, container, structure, stripe, area theme, then general theme.
- For a text block, responsive `textAlign` accepts `left`, `center`, `right`, or `justify`; font size
  remains part of the semantic HTML passed to `node.setContent`.
- For a social block, edit networks through `setSocialNetwork(typeOrIndex, {url, title, alt, icon})`,
  `addSocialNetwork({type, url, title}, {after | before})`, `removeSocialNetwork(typeOrIndex)`, and
  `setSocialShared({style, iconSize, spaceBetweenIcons, textCustomization})`; `setLink({url, network})`
  changes one link. The editor's rules apply: known networks never carry `icon` (only `type: "custom"`
  does), `alt` exists only while `textCustomization` is on (enable it with `setSocialShared` first;
  turning it off removes every alt). Links support `http(s)://`, `#`, `mailto:`, `tel:`,
  `ftp(s)://`, `sms:`, `tg://`, and `viber:`; a different non-empty, trimmed href uses the
  editor's `other` type. A network `type` has to be one the editor ships an icon for, `title` is at
  most 100 UTF-16 code units and `alt` at most 500 (`String.length`, so `😀` counts as two),
  `iconSize` is an integer 16..64 and `spaceBetweenIcons`
  an integer 0..40 per breakpoint. Social insertion, duplication and deletion are supported;
  `moveSocialNetwork` reorders a network through the collection API.
- Image sources must be email-safe hosted URLs already supplied or authorized by the user or
  reused from the reference, or a completed hosted Stripo image-job result. For a requested
  AI change, follow [Stripo images](stripo-images.md) before writing the mutation module: `edit_image` changes the
  current asset, while `generate_image` creates a new composition. Use the current target's
  `(id, type)`; do not create another email. Inspect the completed image, then reacquire the
  target model before constructing the SDK mutation. For a replacement, verify that the intended
  image still exists with the expected source. Report a concurrent deletion or source change
  instead of overwriting it. Use `setSrc()` and `setAlt()` as needed against that fresh model.
  For an insertion, verify the intended container/anchor still exists and insert a native image
  block with the completed URL through the component workflow below. Retain the fresh model
  unmodified as the persistence base. Preserve unrelated links, layout, and settings.
  A pending or failed image job is not a replacement; keep the original asset until ready.
  Use the returned URL directly without reuploading or recompressing it, including during
  document-write recovery. Image tool calls happen outside the SDK module.
  Local attachments and crops use [Upload supplied images](image-upload.md).
  WebP inputs are supported by its image tools,
  whose completed output is PNG; WebP, AVIF, and extensionless or otherwise unknown URLs are
  not confirmed email-safe for direct insertion. Obtain a hosted PNG/JPG/JPEG/GIF before
  applying an image change with an unsupported source; generation is not a lossless conversion.

For insertion, define and export `components` in this same change module. Each named entry is
`{node, slots, level?}` containing a complete native reference subtree; `level` is `L1` (stripe),
`L2` (structure), or `atoms` (block). Give slots JSON pointers relative to that subtree and use
`inserted.slot(role)` to address a block within an inserted section. Use `slots: []` when targeting
the inserted block directly. The SDK assigns fresh IDs. Removal and duplication need no component
definitions. For a block type absent from the reference, construct a schema-valid native component
in the module using the reference styles.

Block `settings` accept only the keys the editor schema lists for that block type. The model's
top-level `settings` (`general`, `stripes`, `headings`, `buttons`) holds the defaults for every
element of a type, and some of those keys have no block-level counterpart. Check the block
definition before setting a key on a block. When the key is absent there, change the global
setting instead and expect the change to apply to every element of that type in the email. A key
the block schema does not list fails validation as `unsupported property`. For example, button
`letterSpacing` and `textTransform` exist only in `settings.buttons`; the hover effect is the boolean
`settings.buttons.hoverButtonStyles`, with its colors in `settings.buttons.lightTheme.hoverButtonStyles`.

For example, a module can define and insert a text block:

```js
const zeroPadding = {top: 0, right: 0, bottom: 0, left: 0};
export const components = {
  "offer-text": {
    node: {
      id: "offer-text-source",
      type: "text",
      content: "<p>Offer details.</p>",
      settings: {
        backgroundColor: "transparent",
        hideElement: "no",
        includeInOutput: "both",
        padding: {desktop: zeroPadding, mobile: zeroPadding},
        rightToLeftTextDirection: false,
      },
    },
    slots: [],
  },
};

export default ({email}) => {
  email.insert("offer-text", {after: email.byId("<anchor-block-id>")});
};
```

## 3. Run the edit

```bash
node <skill-dir>/scripts/run-sdk.mjs \
  --input <downloaded-model.json> \
  --script <workspace>/email-<id>.changes.mjs \
  --output <updated-model.json> \
  --diagnostics <diagnostics.json>
```

Require exit code 0 and confirm:

- `validation.valid` is true;
- `sdkDiagnostics.mutationCount` is positive;
- `sdkDiagnostics.selectorMisses` is empty;
- `inputSummary` and `outputSummary` show the intended content, block types, and counts,
  including any additions, removals, or duplication needed for the request.

If the requested result already exists, call the supplied `skip(reason)` and return. The runner
reports `skipped` and produces no uploadable output. A setter that silently changes nothing is an
error. Keep the acquired model, inspection, module, candidate and diagnostics as task artifacts.
On any preparation failure, the runner removes stale output. Diagnostics distinguish JSON,
schema, capability, loss and optional runtime stages; inspect `diagnostics.error.issues`.
Local contract validation is against the pinned revision. `--runtime-snapshot <file>` plus
`STRIPO_RUNTIME_PATH` explicitly requests model preflight and fails if context is missing.
A focused edit completes when `set_document_state` returns `status=OK`. Read-back and previews
follow the requested verification scope; unknown write outcomes still require recovery.

Repair schema errors without removing intended content. Use `diagnostics.error.errors` and
the untouched acquired model to repair the failing fields. Do not delete a logo or another
intended block just to obtain a valid model; report an unresolved defect if repair cannot complete.

## Model completeness

`set_document_state` takes the whole document; with the acquired model uploaded as the base
the editor applies the difference between it and the candidate to the live state.
The editor diffs the uploaded JSON against the full acquired state. Settings are canonical and complete:
every key of `general`, `stripes`, `headings`, and `buttons`, including their `lightTheme` and
`darkTheme` branches, is required, so a missing settings key fails validation before upload. A
stripe's `messageArea`, `includeInOutput`, `padding`, `stripeBackgroundColor`, and
`contentBackgroundColor`, and a column's `settings.width`, must also stay present.

An omitted `stripes`, `structures`, `columns`, or `blocks` array deletes every element it held.
Timer blocks from the acquired model cannot be deleted, including through a parent
`remove()` or `repeat()`. Social deletion is supported in the pinned merge-service profile.
Therefore persist the complete candidate produced from the freshly acquired model. Clear ordinary
values by setting their cleared value. The SDK can remove an image or social link with
`setLink({url: ""})`, or discard `link.salesforce` when `setLink` changes a button's link from
`salesforce_mc` to another type.
Social `networks` is replaced as a complete list: replacing or reordering networks is supported,
including multiple custom networks. Every resulting network still has to pass schema validation
and the editor's icon, alt, and link rules.

Colors live in the theme branches. Change a light color at its `lightTheme` path, for example
`email.setTheme("settings.stripes.lightTheme.content.linkColor", "#2457d6")`, and set a dark-mode
override at the matching `darkTheme` path, where `null` means no override. Switch the button hover
effect with the boolean `settings.buttons.hoverButtonStyles`.

For an intentional reset, write `undefined` or `null` to a nullable setting below. For example,
`email.setTheme("settings.general.backgroundImage", undefined)` clears the email's background image,
and `email.resetSettings(["general.customListStyles"])` disables custom list formatting.

| Path | Settings that accept a reset (`null`) |
| --- | --- |
| `settings.general` | `backgroundImage`, `customListStyles` |
| `settings.stripes.<area>` (`header`, `content`, `footer`, `infoArea`) | `paragraphBottomSpace` |
| `settings.stripes.<area>` (`header`, `footer`) | `backgroundImage` |
| `settings.headings.h1` through `settings.headings.h6` | `fontWeight`, `paragraphBottomSpace`, `fontSize.desktop`, `fontSize.mobile`, `lineHeight.desktop`, `lineHeight.mobile`, `textAlign.mobile` |
| `settings.<section>.darkTheme` | every color |

A nested patch works the same way: `email.setTheme("settings.general", {backgroundImage: undefined})`.
Every other setting, including light-theme colors, global `fontFamily`, `general.hideImageDownloadIcons`, and
whole groups such as `settings.stripes.content`, has no reset; set a new value instead. Do not strip
fields from JSON manually. The runner still reports unintended loss for accidentally absent fields,
unknown settings, and unsupported resets.

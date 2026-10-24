# Conditional mutation details

Read the section relevant to the requested operation.

## Metadata

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
preheader exists. Both preheader fields must be supplied. Clear the title with `title: ""` or
the preheader with `{text: "", fillSpace: false}`; keep those keys in the complete candidate.
Omitted patch fields preserve their acquired values. New or changed title/preheader text is
limited to 500 UTF-16 code units; unchanged imported longer text needs the acquired model as
the validation baseline. The document title is separate from external sending metadata.
Follow [PROVIDER.md](../PROVIDER.md) for external metadata routing and saved-value checks.
This method also works when an initialized native model has no blocks. Missing or unhydrated
state is a read failure: never initialize a replacement model to bypass it. Return nothing
from the module, including after a chained SDK call.

## Social blocks

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

## Insertion and block settings

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

## Colors and resets

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
| `settings.general.darkTheme` | `backgroundImage` |

A nested patch works the same way: `email.setTheme("settings.general", {backgroundImage: undefined})`.
Every other setting, including light-theme colors, global `fontFamily`, `general.hideImageDownloadIcons`, and
whole groups such as `settings.stripes.content`, has no reset; set a new value instead. Do not strip
fields from JSON manually. The runner still reports unintended loss for accidentally absent fields,
unknown settings, and unsupported resets.

## Native font persistence

Custom fonts use `resources.fonts` in the native document. Use `email.setFonts([...])` to
replace the font-resource collection; include every existing resource still used by the email.
Each entry has `fontFamily` and `importMethod`: `link` or `import` requires a stylesheet `url`;
`fontFace` requires ready-to-inline `css` and accepts an optional source `url`.

Use the complete assigned stack as the resource key: `Inter, Arial, sans-serif` in settings
matches `fontFamily: "inter,arial,sans-serif"` in the resource. The editor canonicalizes case,
quotes, and spacing when matching. The family inside `@font-face` CSS stays the primary name.

Update native `fontFamily` settings through the SDK. Preserve requested fallback stacks and
unrelated inline typography. The validated output from `run-sdk.mjs` is the upload candidate;
its native schema and change checks apply to fonts just as they do to other fields.

---
name: email-model-editor
description: "Edit an existing Stripo email or template through its native JSON model. Use for document title and preheader, copy, link, image-source, theme, style, and block additions, removals, or duplication when the email or template has an editor document state. Uses a generated SDK mutation module, validated file-based execution, and durable read-back through the Stripo MCP. Use email-from-reference for a new email or full rebuild. Do not use for raw-HTML editing, sending, scheduling, changes to name/project/folder, or content without a native model."
---

# Email Model Editor

Host paths: in Claude Code `<skill-dir>` is `${CLAUDE_SKILL_DIR}` and `<bundle-root>` is
`${CLAUDE_PLUGIN_ROOT}`. In Codex `<skill-dir>` is the directory of this `SKILL.md`. In both
hosts `<bundle-root>` is two levels above `<skill-dir>`. Read `HOST.md` beside this file for
the working directory and file-transfer commands before the first MCP call.

Edit an existing Stripo email or template through its JSON model without flattening it to HTML.
`PROVIDER.md` beside this file defines the Stripo MCP contract: reference and target resolution,
model acquisition, persistence, and verification. Follow it for every MCP
step below; `<bundle-root>/mcp-tools.json` lists the tool names. The bundle contains no MCP
endpoint or credential; use the Stripo MCP server and authorized file-transfer mechanism
configured by the consuming agent.
If the host installs `HOST.md` beside this file, read it for the concrete transfer commands.

Validation runs the editor's own Document State rules bundled into the SDK. No schema download
or initialization is required. `bundle.json.editorValidator` records the editor revision.
`finish()` validates edits against the acquired input; create mode validates a new document.
The service also validates its deployed revision and applies the write to its live state;
local success does not establish persistence.

`<skill-dir>` is this installed skill directory. `<bundle-root>` is the directory containing the
installed `skills/` and `packages/` directories.

## Invariants

- The model is a file. Never paste the complete model into the conversation or pass it as an MCP
  argument.
- The candidate is the complete model. Persistence replaces the whole document by diffing it
  against the live state, so an optional key that is absent from the candidate is a deletion, not
  "unchanged" (see Model completeness). Never strip keys or upload a partial document; the runner
  rejects a candidate that lost a key the acquired model had, except for supported explicit clears.
- Express each request as a small JavaScript module that mutates the supplied `email` SDK handle.
  Return nothing; the runner finishes its tracked session and rejects returned replacement documents.
  Do not edit the raw JSON object or regenerate the full model.
- Run the module with `run-sdk.mjs --input <model> --script <module> --output <candidate>`.
  Every edit receives the full SDK handle for content, style, insertion, removal, and duplication.
  The runner rejects scripts with no SDK mutations, selector misses, and schema-invalid output.
  A model without blocks permits metadata edits only; other edits must leave at least one block.
- Keep the acquired model untouched as the baseline for the before/after comparison.
- A successful local mutation is not completion. Verify the saved model and inspect fresh
  desktop and mobile PNG previews of the persisted email.

## 1. Acquire and inspect

Resolve the target `(id, type)` as described in `PROVIDER.md` and call:

```text
get_document_state(id=<id>, type=<EMAIL|TEMPLATE>)
```

Require `status=OK` and download its temporary `downloadUrl` to a local JSON file through the
host's authorized transfer path.

Inspect the model:

```bash
node <skill-dir>/scripts/inspect-editor-json.mjs \
  --input <downloaded-model.json> \
  --output <inspection.json>
```

If inspection reports no stripes or zero blocks, acquire and download again a bounded handful of
times. Never upload a blockless model or fall back to editing compiled HTML. If no populated model
becomes available, report a read failure and write nothing.

Use the inspection report to identify node ids, message areas, block types, visible text, links,
image sources, effective visibility, duplicate ids, and the before-edit census. Inspect relevant
source nodes directly when exact content matters. IDs belong to this acquisition only.

Do not target inert `moduleId` metadata. Prefer a unique node id. Use a selector only when its
meaning is intentional for every matched node.

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
preheader exists. Both preheader fields must be supplied. `PROVIDER.md` defines the limits and
clearing semantics. This method also works when the native model has no blocks. Return nothing
from the module, including after a chained SDK call.

Use `email.one(selector)` when exactly one match is required, or `email.block(id, type)` for
a type-checked block. `within` restricts a selector to a subtree. Use `patchSettings(patch)`
for supported settings; unknown keys, arbitrary collection arrays and `undefined` are errors.
Use collection methods for social/menu items, `setSpacerMode` for spacer variants, and
`resetSettings(paths)` for confirmed resets. `node.describe()` exposes the pinned contract.
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
  reused from the reference; the Stripo MCP has no asset-upload tool. WebP, AVIF, and
  extensionless or otherwise unknown URLs are not confirmed email-safe. Obtain a hosted
  PNG/JPG/JPEG/GIF before applying an image change with an unsupported source.

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
`letterSpacing`, `textTransform`, and `hoverButtonStyles` exist only in `settings.buttons`.

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
Only a successful server set followed by get confirms persistence.

Repair schema errors without removing intended content. Use `diagnostics.error.errors` and
the untouched acquired model to repair the failing fields. Do not delete a logo or another
intended block just to obtain a valid model; report an unresolved defect if repair cannot complete.

## Model completeness

`set_document_state` replaces the whole document.
The editor diffs the uploaded JSON against the full live state, so every optional key that is
absent from the candidate becomes a delete, not "unchanged". Depending on the key, the editor then:

- resets it to its built-in default or clears it: most global, structure, container, stripe, and
  block settings, including background images, hover button styles, custom list styles, borders,
  and paddings;
- keeps the current value: only `fontWeight` (stripes and headings) and `metadata`;
- rejects the whole write without changing anything: the global `stripes.fontFamily`,
  `headings.fontFamily`, `buttons.fontFamily`, and `general.hideImageDownloadIcons`; a stripe's
  `messageArea`, `includeInOutput`, `padding`, `stripeBackgroundColor`, and
  `contentBackgroundColor`; and a column's `settings.width`.

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

For an intentional reset, use `email.setTheme(path, undefined)` on one of the supported optional
settings below. For example, `email.setTheme("settings.general.backgroundImage", undefined)`
clears the email's background image; `email.setTheme("settings.general.customListStyles", undefined)`
disables custom list formatting. Deleting hover settings switches the effect off; other settings
reset to the editor's defaults or inheritance rules.

| Path prefix | Settings that support an explicit reset |
| --- | --- |
| `settings.general` | `backgroundImage`, `customListStyles` |
| `settings.stripes` | `letterSpacing`, `lineHeight` |
| `settings.stripes.<area>` (`header`, `content`, `footer`, `infoArea`) | `fontSize`, `fontColor`, `linkColor`, `linkColorHover`, `paragraphBottomSpace` |
| `settings.stripes.<area>` (`header`, `content`, `footer`) | `contentBackgroundColor` |
| `settings.stripes.<area>` (`header`, `footer`) | `stripeBackgroundColor`, `backgroundImage` |
| `settings.headings` | `letterSpacing` |
| `settings.headings.h1` through `settings.headings.h6` | `fontColor`, `textAlign`, `textStyle`, `fontSize`, `lineHeight`, `paragraphBottomSpace` |
| `settings.buttons` | `outlookSupport`, `fontColor`, `textStyle`, `textTransform`, `buttonColor`, `letterSpacing`, `fontSize`, `borderRadius`, `fitContainer`, `hoverButtonStyles`, `padding` |

Reset the whole named setting, preserving unrelated settings. A nested patch with an explicit
`undefined` also works: `email.setTheme("settings.general", {backgroundImage: undefined})`.
An entire optional area or heading group can be reset only if every field it currently holds
supports a reset. A heading containing `fontWeight` therefore requires individual field resets.
Do not strip fields from JSON manually. The runner still reports unintended loss for
accidentally absent fields, unknown settings, and unsupported resets, including global `fontFamily`,
`hideImageDownloadIcons`, and `fontWeight`. Native schema validation also rejects deletion of
required settings and required children such as `backgroundImage.path`.

## 4. Persist by file reference

Preserve native font settings and resources; there is no font normalization step. Follow the
prepare-upload/write flow in `PROVIDER.md`:

```text
prepare_document_state_upload(id=<id>, type=<type>)
set_document_state(id=<id>, type=<type>, uploadId=<upload id>)
```

Between the two calls, upload `<updated-model.json>` to the returned `uploadUrl` through the
consuming agent's authorized transfer mechanism. Never pass the model inline. An upload ID is
single-use and there is no hash or idempotency argument: keep the read-to-write gap short, and
after an uncertain write read the state before retrying with a fresh ticket. Follow the `status`
contract in `PROVIDER.md`: a `MERGE_BROKEN` answer names the rejected fields in
`details.errors[].path` (a dot path into `<updated-model.json>`); fix them in the change module,
rerun the runner, and persist with a fresh ticket. Allow at most one repair retry before reporting
the failure with the returned `code`, paths, and messages.

## 5. Verify durable state

Read both surfaces after persistence:

```text
get_document_state(id=<id>, type=<type>)
get_screenshot(id=<id>, type=<type>, mode="BOTH")
```

Download the fresh model and both PNG artifacts through the authorized transfer path. Inspect
the model for the exact requested values, link destinations, image URLs, alt text, merge tags, and
preserved content. Compare its depth-agnostic per-type block census with the acquisition census.
IDs may change between reads, so compare counts and types rather than ids.
After a structural edit, compare the census with the intended additions, removals, or duplication.
After a metadata edit, compare the fresh model's `metadata.title`, `metadata.preheader.text`, and
`metadata.preheader.fillSpace` with the requested values and the preserved fields. Hidden metadata
is verified from JSON; an unchanged screenshot is expected for a metadata-only edit.

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
checks, and both visual checks pass. If PNG generation, download, or inspection is unavailable or
fails after a bounded retry, report "saved, visual verification incomplete" when persistence and
model checks passed. Keep the same id for a later preview retry. Do not substitute an HTML
export, inspect HTML as the visual check, or repeat a successful write to obtain a preview.

## Boundaries

- Do not create, clone, translate, send, schedule, activate, or delete an email.
- Do not change name, project, or folder metadata; the Stripo MCP has no metadata write tool.
  Report a requested change to those external fields as unsupported. Native document title and
  preheader are supported through `email.setMetadata()` and `set_document_state`.
- Do not use compiled HTML as the editable source of truth.
- Do not mutate a message that has no native editor model.
- Do not generate image assets or infer MCP endpoints, credentials, or authentication.
- Use `email-from-reference` for a new persisted email.

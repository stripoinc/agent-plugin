# Mutate and validate

Validation runs the editor's own Document State rules bundled into the SDK. No schema download
or initialization is required. `bundle.json.editorValidator` records the editor revision.
`finish()` validates edits against the acquired input; create mode validates a new document.
The service also validates its deployed revision and applies the write to its live state;
local success does not establish persistence.

## Write the change module

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

Text-block `setContent()` and `setText()` transplant acquired formatting for copy edits;
supplied new inline CSS and span wrappers are dropped. For intentional inline HTML styling,
derive `updatedHtml` from the block's fresh acquired `content`, preserving unrelated markup,
text, attributes, links, and literal merge expressions. Use `node.setHtml(updatedHtml)` and
assert `node.inspect().element.content === updatedHtml`. This edits native JSON block content
through the SDK; continue through the native-model persistence workflow.

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
- Prefer a theme edit for a broad change and a node edit for an exception.
- For a text block, responsive `textAlign` accepts `left`, `center`, `right`, or `justify`.
  Use supported `node.style` or `email.theme.style` methods for native styles; intentional inline
  font-size changes use the complete block HTML passed to `node.setHtml()`, not `setContent()`. Mobile
  paragraph sizes follow [Mobile font size](editor-limitations.md#mobile-font-size).
- Use authorized, email-safe hosted image URLs. Prepare requested visuals through the
  image topic in `PROVIDER.md` before writing the mutation module, unless a background worker
  collects them as [Parallel work](parallel-work.md) describes. Preserve text, composition,
  dimensions, and transparency unless the user requests changes. Inspect the completed hosted
  result, then reacquire the target model and check that the selected image still has its expected
  source. Report a concurrent deletion or source change instead of retargeting the edit.
  For an insertion, verify the intended container/anchor still exists and insert a native image
  through [the component workflow](mutation-options.md#insertion-and-block-settings).
  Use `setSrc()` and `setAlt()` against that fresh model and retain it unmodified as the persistence base. Keep the original
  asset until ready. Use the returned URL directly without another upload or compression pass,
  including during document-write recovery. Image tool calls happen outside the SDK module.
  Local attachments and crops for direct insertion use [Upload supplied images](image-upload.md).
  Inputs to an image job follow `PROVIDER.md`; a staged input ticket is not an email image URL.
  WebP, AVIF, SVG, and unknown formats are not confirmed email-safe for direct insertion;
  obtain a hosted PNG/JPG/JPEG/GIF through an authorized conversion and the provider's upload route.
  Generation is not a lossless conversion. Inspection-only requests must not start image jobs.

For affected text, colors, backgrounds, or inserted text, follow
[Color consistency](color-consistency.md) using the acquired model to scope the change.
Express supported block-color writes through `node.setStyle("fontColor", color)`. Removing or
aligning inline `color` declarations needs the complete block HTML passed to `node.setHtml()`;
`setContent()` drops incoming style attributes. How a `fontColor` change repaints inline colors,
and when the SDK rejects it, is in [Text color](editor-limitations.md#text-color).

## Run the edit

```bash
node <skill-dir>/scripts/run-sdk.mjs \
  --input <downloaded-model.json> \
  --script <workspace>/email-<id>.changes.mjs \
  --output <updated-model.json> \
  --diagnostics <diagnostics.json>
```

Create the module and run it in the same local command when practical. The runner prints
validation, SDK diagnostics and a bounded before/after change report, so a separate diagnostic
script is unnecessary when that report fully describes the edit. Require exit code 0 and confirm:

- `validation.valid` is true;
- `sdkDiagnostics.mutationCount` is positive;
- `sdkDiagnostics.selectorMisses` is empty;
- The stdout `changes` report lists only request-authorized changes; its paths refer to the
  acquired/candidate files, not stable server node identities. `changes.truncated` means values
  or entries are abbreviated: inspect the relevant complete files before accepting the scope.
  Diagnostics retain `inputSummary` and `outputSummary` for content and census checks.
  This report is diagnostic only; it does not establish persistence or replace saved-state checks.

Before uploading an edit that changes text markup, colors, backgrounds, or inserts text, apply
the shared [candidate color check](color-consistency.md#check-the-completed-candidate-before-upload)
only to affected content and its relevant backgrounds. Use the acquired model to identify that
scope. Correct conflicts in the change module and rerun it before upload.

If the requested result already exists, call the supplied `skip(reason)` and return. The runner
reports `skipped` and produces no uploadable output. A skipped request is complete only after
the fresh saved-value read in [Verify durable state](persist-and-verify.md#verify-durable-state)
confirms the already-correct value. A setter that silently changes nothing is an
error. Keep the acquired model, inspection, module, candidate and diagnostics as task artifacts.
On any preparation failure, the runner removes stale output. Diagnostics distinguish JSON,
schema, capability, loss and optional runtime stages; inspect `diagnostics.error.issues`.
Local contract validation is against the pinned revision. `--runtime-snapshot <file>` plus
`STRIPO_RUNTIME_PATH` explicitly requests model preflight and fails if context is missing.
Only a successful server set followed by get confirms persistence.

## Inline-style candidate checks

Before uploading requested inline styling, inspect the actual generated candidate for the
exact requested CSS properties, values or removals on the intended elements and the expected
target cardinality. Allow only request-authorized model and HTML differences; preserve
unrequested fields, markup, text, links, and literal merge expressions. For an edit limited
to inline CSS changes on existing HTML elements, compare with the acquisition: only approved
block content strings may differ, and their HTML differences must be the planned CSS additions,
replacements or removals. For a new build, check the intended styles against the brief and
request without requiring an acquired edit baseline. Valid schema and mutation diagnostics
do not prove the requested styling is correct. Correct any local styling mismatch before
uploading.

Repair schema errors without removing intended content. Use `diagnostics.error.errors` and
the untouched acquired model to repair the failing fields. Do not delete a logo or another
intended block just to obtain a valid model; report an unresolved defect if repair cannot complete.

## Model completeness

Persist complete base and candidate documents using the concurrency contract in `PROVIDER.md`.
An optional key present in the base but absent from the candidate requests deletion.

The editor diffs the uploaded JSON against the full acquired state. Settings are canonical and complete:
every key of `general`, `stripes`, `headings`, and `buttons`, including their `lightTheme` and
`darkTheme` branches, is required, so a missing settings key fails validation before upload. The
one optional key is `settings.general.darkTheme.backgroundImage`, the dark-mode background image
URL or `null`. Never add it to a model acquired without it: that editor does not accept it yet. A
stripe's `messageArea`, `includeInOutput`, `padding`, `stripeBackgroundColor`, and
`contentBackgroundColor`, and a column's `settings.width`, must also stay present.

An omitted `stripes`, `structures`, `columns`, or `blocks` array deletes every element it held.
The runner rejects deleting a block type the write does not support, including through a parent
`remove()` or `repeat()`.
Therefore persist the complete candidate produced from the freshly acquired model. Clear ordinary
values by setting their cleared value. The SDK can remove an image or social link with
`setLink({url: ""})`, or discard `link.salesforce` when `setLink` changes a button's link from
`salesforce_mc` to another type.
Social `networks` is replaced as a complete list: replacing or reordering networks is supported,
including multiple custom networks. Every resulting network still has to pass schema validation
and the editor's icon, alt, and link rules.

For native font changes, read [Font persistence](mutation-options.md#native-font-persistence).

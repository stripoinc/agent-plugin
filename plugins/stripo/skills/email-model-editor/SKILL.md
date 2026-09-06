---
name: email-model-editor
description: "Edit an existing Stripo email or template through its native JSON model. Use for copy, link, image-source, theme, or style changes, and for explicitly requested block additions or removals, when the email or template has an editor document state. Uses a generated SDK mutation module, guarded file-based execution, and durable read-back through the Stripo MCP. Use email-from-reference for a new email or full rebuild. Do not use for raw-HTML editing, sending, scheduling, metadata updates, or content without a native model."
---

# Email Model Editor

Host paths: in Claude Code `<skill-dir>` is `${CLAUDE_SKILL_DIR}` and `<bundle-root>` is
`${CLAUDE_PLUGIN_ROOT}`. In Codex `<skill-dir>` is the directory of this `SKILL.md`. In both
hosts `<bundle-root>` is two levels above `<skill-dir>`. Read `HOST.md` beside this file for
the working directory and file-transfer commands before the first MCP call.

Edit an existing Stripo email or template through its JSON model without flattening it to HTML.
`PROVIDER.md` beside this file defines the Stripo MCP contract: reference and target resolution,
model acquisition, structural-edit mode, persistence, and verification. Follow it for every MCP
step below; `<bundle-root>/mcp-tools.json` lists the tool names. The bundle contains no MCP
endpoint or credential; use the Stripo MCP server and authorized file-transfer mechanism
configured by the consuming agent.
If the host installs `HOST.md` beside this file, read it for the concrete transfer commands.

The email schema comes from `get_document_state_schema` as a temporary download URL. Download it
to a local file, refresh a file older than one hour, and pass `--schema <file>` to every runner.
The SDK never bundles a schema; direct SDK callers first call `setEmailSchema(schema)`.

`<skill-dir>` is this installed skill directory. `<bundle-root>` is the directory containing the
installed `skills/` and `packages/` directories.

## Invariants

- The model is a file. Never paste the complete model into the conversation or pass it as an MCP
  argument.
- Express each request as a small JavaScript module that mutates the supplied `email` SDK handle.
  Return nothing; the runner finishes its tracked session and rejects returned replacement documents.
  Do not edit the raw JSON object or regenerate the full model.
- Run the module with `--live-value-edit` for value changes, or with `--live-structure-edit` only
  for explicitly requested block additions or removals. Both modes reject blockless input, scripts
  with no SDK mutations, selector misses, and blockless or schema-invalid output before writing a
  candidate file; value mode also rejects topology changes.
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
  --schema <schema.json> \
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

Rules for the module:

- Use `email.byId`, `email.select`, `email.first`, `email.theme`, and node mutation methods. In
  value mode the `EmailValueEditor` API applies, declared in
  `<bundle-root>/packages/convo-email-agent/sdk/value-editor.d.ts` with value methods in the
  adjacent `types.d.ts`; structural methods such as `insert`, `remove`, `repeat`, and `slot` are
  unavailable there. In structure mode the module receives the full `EmailDocument` handle from
  `types.d.ts`, including `remove()`, `repeat(totalCount)`, and
  `insert(componentName, {after: handle})`; `PROVIDER.md` describes the `--components` file and
  slot targeting.
- Check expected selector cardinality. When a request intentionally targets every match, require at
  least one match before iterating.
- Encode requested strings as JavaScript string literals; never evaluate customer text as code.
- Do not import filesystem, process, network, or shell facilities. Live edit modes supply only
  `{ email }`; the module's only job is to call SDK mutation methods.
- Preserve unrelated content, links, merge tags, visibility, and compliance content unless they
  are explicit targets. Change topology only in structure mode and only as requested.
- Prefer a theme edit for a broad change and a node edit for an exception. Render precedence is
  inline HTML, block, container, structure, stripe, area theme, then general theme.
- For a text block, responsive `textAlign` accepts `left`, `center`, `right`, or `justify`; font size
  remains part of the semantic HTML passed to `node.setContent`.
- Image sources must be email-safe hosted URLs already supplied or authorized by the user or
  reused from the reference; the Stripo MCP has no asset-upload tool. WebP, AVIF, and
  extensionless or otherwise unknown URLs are not confirmed email-safe. Obtain a hosted
  PNG/JPG/JPEG/GIF before applying an image change with an unsupported source.

## 3. Run the guarded edit

```bash
node <skill-dir>/scripts/run-sdk.mjs \
  --input <downloaded-model.json> \
  --script <workspace>/email-<id>.changes.mjs \
  --output <updated-model.json> \
  --diagnostics <diagnostics.json> \
  --schema <schema.json> \
  --live-value-edit
```

For explicitly requested block additions or removals, replace `--live-value-edit` with
`--live-structure-edit` and add `--components <components.json>` when the module calls `insert`.

Require exit code 0 and confirm:

- `validation.valid` is true;
- `sdkDiagnostics.mutationCount` is positive;
- `sdkDiagnostics.selectorMisses` is empty;
- in value mode, `guards.topologyPreserved` is true and input and output block counts match;
- in structure mode, `guards.inputBlocks`, `guards.outputBlocks`, and the output census differ
  from the input exactly by the requested additions or removals.

`changed:false` is valid when SDK setters ran but the requested values were already present. Keep
the acquired model, inspection, change module, updated model, and diagnostics as local task
artifacts.

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
after an uncertain write read the state before retrying with a fresh ticket. Follow refusal or
error statuses and allow at most one repair retry before reporting the failure.

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
After a structural edit, the census must differ from the acquisition census exactly by the
requested additions or removals.

Open and visually inspect both PNG files with the host's image-viewing tool. Check the requested
visible changes, text readability, image loading, spacing, alignment, clipping, and responsive
layout. A successful preview call or download alone is not visual verification. Screenshots do
not prove link destinations, asset URLs, or hidden values; use the saved model for those checks.
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
  Report a requested metadata change as an unsupported capability without failing the edit.
- Do not use compiled HTML as the editable source of truth.
- Do not mutate a message that has no native editor model.
- Do not generate image assets or infer MCP endpoints, credentials, or authentication.
- Use `email-from-reference` for a new persisted email.

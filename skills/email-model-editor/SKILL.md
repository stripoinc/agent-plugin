---
name: email-model-editor
description: "Edit an existing Stripo email/template through its native JSON model: document title and preheader, copy, links, images, AI image generation/editing, theme/style, and block additions, removals, or duplication. Uses validated SDK mutations, base/target merging and durable readback. Use email-from-reference for new emails/full rebuilds. Not for raw HTML, translation, sending/scheduling, external metadata (subject, sender, name, project or folder), or content without a native model."
---

# Email Model Editor

Edit content, styles, and structure of an existing email without flattening the native model to
HTML. Use `email-from-reference` for a new email or full rebuild.

Reuse instructions already present, including a complete injected `SKILL.md` and shared topics
across both email skills in the same provider/bundle. Reread missing, truncated or changed
documents and reload on provider/version changes. All checks and remote-state freshness apply.

Read [PROVIDER.md](PROVIDER.md) once before tool discovery for target resolution, metadata,
transfers, images, persistence and verification. If installed, read `HOST.md` for bundle paths,
transfer/attachment bindings, image viewing, permissions and delegated image operations.
`mcp-tools.json` maps operation roles to advertised names; discover the selected server's actual
schemas, not those logical keys. The bundle contains no endpoint or credentials.

Use one agent by default and batch independent tool calls. For a newly acquired edit task, read
the acquisition, mutation, persistence and [parallel work](reference/parallel-work.md) guides plus
the provider's acquisition and persistence topics not already loaded, each in its own tool call.
The parallel guide limits delegation to large independent subtasks or separate reviews. For a
repair continuing creation, use the continuation below. Load conditional topics on demand,
never the full tool/resource catalog.

| Stage | Common guides read together; conditional topics when needed |
| --- | --- |
| Acquire | [Download and inspect the target](reference/acquire-and-inspect.md) before editing. |
| Mutate | [SDK module, run, validation, completeness](reference/mutate-and-validate.md) before constructing the change. |
| Conditional mutation | [Metadata, social, insertion, global block settings, theme resets and fonts](reference/mutation-options.md) when the request includes these operations. |
| Text or colors | [Color consistency](reference/color-consistency.md) before changing text markup, colors, backgrounds, or inserting text. |
| Editor limits | [Editor limitations](reference/editor-limitations.md) before changing text color, line height, or layout. |
| Persist | [File upload, recovery, durable and visual checks, final presentation](reference/persist-and-verify.md) before writing. |
| Attached or Ctrl+V image | [Upload supplied images](reference/image-upload.md) before hosting original bytes. |

For an attached or Ctrl+V-pasted replacement image, the host must supply the original bytes as
a local file. Host it before editing the model and use only the verified final `data.url`. Reacquire the
target and check its current image source before replacement. Keep
the original asset if hosting fails; do not regenerate a supplied image.

## Continue after creation

For a repair of the same saved draft, use [the continuation](reference/mutate-and-validate.md#continue-after-creation).
Carry forward the latest readback and loaded contracts; keep all edit invariants and verification below.

`<skill-dir>` is this installed skill directory. `<bundle-root>` is the directory containing the
installed `skills/` and `packages/` directories.

## Invariants

- The model is a file. Never paste the complete model into the conversation or pass it as an MCP
  argument.
- The candidate and base are complete models. Persistence applies the differences from the base
  to the candidate on top of the live state. Omitting an acquired optional key requests deletion,
  not "unchanged" (see [Model completeness](reference/mutate-and-validate.md#model-completeness)).
  Never strip keys or upload a partial document; the runner rejects a candidate that lost a key
  the acquired model had, except for supported explicit clears.
- Express each request as a small JavaScript module that mutates the supplied `email` SDK handle.
  Return nothing; the runner finishes its tracked session and rejects returned replacement
  documents. Do not edit the raw JSON object or regenerate the full model.
- Run the module with `run-sdk.mjs --input <model> --script <module> --output <candidate>`.
  Every edit receives the full SDK handle for content, style, insertion, removal, and duplication.
  The runner rejects scripts with no SDK mutations, selector misses, and schema-invalid output.
  A model without blocks permits metadata edits only; other edits must leave at least one block.
- Keep the acquired model byte-exact as the persistence base and retain its manifest and
  concurrency token when supplied.
- A successful local mutation is not completion. Verify the saved model and inspect fresh
  desktop and mobile PNG previews, except when `PROVIDER.md` defines preheader-only checks.
  Then run the provider's final presentation step, when `PROVIDER.md` defines one.

## Boundaries

- Do not create, clone, translate, send, schedule, activate, or delete an email.
- Change only requested native metadata. Preserve external sending and organization metadata;
  `PROVIDER.md` defines supported fields and any separate route for explicitly requested changes.
  Preheaders use `metadata.preheader`. A requested change is complete only when its saved value
  is verified, including a fresh read confirming an already-correct value.
- Do not use compiled HTML as the editable source of truth.
- Do not mutate a message that has no native editor model.
- Use the image operations in `PROVIDER.md`; keep them outside the SDK module.
- Do not infer MCP endpoints, credentials, or authentication.
- Use `email-from-reference` for a new persisted email.

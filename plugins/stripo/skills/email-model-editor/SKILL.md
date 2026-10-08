---
name: email-model-editor
description: "Edit an existing Stripo email or template through its native JSON model. Use for document title and preheader, copy, link, image-source, AI image generation/editing, theme, style, and block additions, removals, or duplication when the email or template has an editor document state. Uses Stripo MCP image tools for requested visuals and a generated SDK mutation module, validated file-based execution, and durable read-back for model changes. Use email-from-reference for a new email or full rebuild. Do not use for raw-HTML editing, sending, scheduling, changes to name/project/folder, or content without a native model."
---

# Email Model Editor

Host paths: in Claude Code `<skill-dir>` is `${CLAUDE_SKILL_DIR}` and `<bundle-root>` is
`${CLAUDE_PLUGIN_ROOT}`. In Codex `<skill-dir>` is the directory of this `SKILL.md`. In both
hosts `<bundle-root>` is two levels above `<skill-dir>`. Read `HOST.md` beside this file for
the working directory and file-transfer commands before the first MCP call.

Edit an existing Stripo email through its native JSON model. Use `email-from-reference` for
a new email or full rebuild. Read the topic for the current stage; do not load all references
or the full tool/resource catalog at startup.

| Stage | Read when needed |
| --- | --- |
| Acquire | [Download and inspect the target](reference/acquire-and-inspect.md) before editing. |
| Mutate | [SDK module, examples, validation, completeness](reference/mutate-and-validate.md) before constructing the change. |
| Persist | [File upload, recovery, durable and visual checks](reference/persist-and-verify.md) before writing. |
| Attached or Ctrl+V image | [Upload supplied images](reference/image-upload.md) before hosting original bytes. Keep the original asset if hosting fails; do not regenerate a supplied image. |

Start with the shared [Stripo MCP guide](PROVIDER.md); select its relevant topic for each MCP step.
If the host installs `HOST.md` beside this file, use its concrete transfer commands.
The image workflow is supplied by `PROVIDER.md` and does not require a host image adapter.

`<skill-dir>` is this installed skill directory; `<bundle-root>` contains `skills/` and `packages/`.

## Invariants

- The model is a file. Never paste the complete model into the conversation or pass it as an MCP
  argument.
- The candidate and base are complete models. Persistence applies the differences from the base
  to the candidate on top of the live state. Omitting an acquired optional key requests deletion,
  not "unchanged" (see [Model completeness](reference/mutate-and-validate.md#model-completeness)). Never strip keys or upload a partial document; the runner
  rejects a candidate that lost a key the acquired model had, except for supported explicit clears.
- Express each request as a small JavaScript module that mutates the supplied `email` SDK handle.
  Return nothing; the runner finishes its tracked session and rejects returned replacement documents.
  Do not edit the raw JSON object or regenerate the full model.
- Run the module with `run-sdk.mjs --input <model> --script <module> --output <candidate>`.
  Every edit receives the full SDK handle for content, style, insertion, removal, and duplication.
  The runner rejects scripts with no SDK mutations, selector misses, and schema-invalid output.
  A model without blocks permits metadata edits only; other edits must leave at least one block.
- Keep the acquired model untouched as the baseline for the before/after comparison and as the
  base file the write uploads next to the candidate.
- A successful local mutation is not completion. Verify the saved model and inspect fresh
  desktop and mobile PNG previews of the persisted email.

## Boundaries

- Do not create, clone, translate, send, schedule, activate, or delete an email.
- Do not change name, project, or folder metadata; the Stripo MCP has no metadata write tool.
  Report a requested change to those external fields as unsupported. Native document title and
  preheader are supported through `email.setMetadata()` and `set_document_state`.
- Do not use compiled HTML as the editable source of truth.
- Do not mutate a message that has no native editor model.
- Generate and edit requested visuals through the Stripo image workflow in `PROVIDER.md`.
  Inspection-only requests must not start image jobs. Keep image-provider calls outside the SDK.
- Do not infer MCP endpoints, credentials, or authentication.
- Use `email-from-reference` for a new persisted email.

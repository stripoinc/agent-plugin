---
name: email-model-editor
description: "Edit an existing Stripo email or template through its native JSON model. Use for document title and preheader, copy, link, image-source, AI image generation/editing, theme, style, and block additions, removals, or duplication when the email or template has a native editor model. Uses the provider image workflow for requested visuals and a generated SDK mutation module, validated file-based execution, base/target merging and durable read-back. Use email-from-reference for a new email or full rebuild. Do not use for raw-HTML editing, translation, sending, scheduling, external metadata such as subject, sender, name, project or folder, or content without a native model."
---

# Email Model Editor

Edit content, styles, and structure of an existing email without flattening the native model to
HTML. Use `email-from-reference` for a new email or full rebuild.

Read [PROVIDER.md](PROVIDER.md) before tool discovery: it is the provider contract and indexes
its topics for target resolution, MCP arguments, transfers, image jobs, persistence and
verification. If the host installs `HOST.md` beside this file, read it too for its runtime
binding: bundle paths, transfer commands, attachment files, image viewer and permissions, plus
any image workflow `PROVIDER.md` delegates to it.
`mcp-tools.json` maps logical operations to advertised tool names; its keys are not callable
tools. Discover the selected server's actual callable schemas before use. The bundle contains
no endpoint or credentials.

For an existing-model edit, read the acquisition, mutation and persistence guides together in
one local read, with the provider's acquisition and persistence topics. Keep conditional topics
on demand and do not load the full tool/resource catalog.

| Stage | Common guides read together; conditional topics when needed |
| --- | --- |
| Acquire | [Download and inspect the target](reference/acquire-and-inspect.md) before editing. |
| Mutate | [SDK module, run, validation, completeness](reference/mutate-and-validate.md) before constructing the change. |
| Conditional mutation | [Metadata, social, insertion, global block settings, theme resets and fonts](reference/mutation-options.md) when the request includes these operations. |
| Persist | [File upload, recovery, durable and visual checks, final presentation](reference/persist-and-verify.md) before writing. |
| Attached or Ctrl+V image | [Upload supplied images](reference/image-upload.md) before hosting original bytes. |

For an attached or Ctrl+V-pasted replacement image, the host must supply the original bytes as
a local file. Host it before editing the model and use only the verified final `data.url`. Reacquire the
target and check its current image source before replacement. Keep
the original asset if hosting fails; do not regenerate a supplied image.

When repairing a draft created from a reference, retain its chosen Exact, Tailored, or Creative
regime and original PNG baseline. For Exact, preserve source choices, reuse existing assets or
crops before considering AI generation, and compare the repaired PNGs with the original source.
Do not reset the regime or adapt the branding during the repair.

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

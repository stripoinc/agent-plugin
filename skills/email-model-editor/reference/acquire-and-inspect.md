# Acquire and inspect

Resolve the explicit write target and acquire its native model using the acquisition topic in
[PROVIDER.md](../PROVIDER.md).
Check the provider's success envelope, retain its manifest and any concurrency token, then
download the temporary artifact through the configured transfer helper. Confirm its byte count
and checksum when supplied. An access refusal is not an empty model.

Inspect the model:

```bash
node <skill-dir>/scripts/inspect-editor-json.mjs \
  --input <downloaded-model.json> \
  --output <inspection.json>
```

If inspection reports no stripes or zero blocks, acquire and download again a bounded handful of
times, unless this is a metadata-only edit against a successfully acquired, initialized native
model. Missing or unhydrated state is never that exception. For other edits, if no populated model
becomes available, report a read failure and write nothing; do not fall back to compiled HTML.

With `--output`, the command saves the full inspection report and prints a compact summary:
validation status/error, metadata, census, block types/visibility and reported duplicate-ID/locked-block
counts. These last counts describe the bounded report entries, not necessarily every occurrence. Read the report's `summary.inventories` for relevant nodes and `sdkMethods` for the
needed selector/node signatures, read from the installed SDK declarations. Read their argument
types, settings or unlisted methods from the full declarations only when needed. Use
`--detail full` to print the bounded inventories and SDK signatures on demand; without `--output`
this remains the default so detail is not discarded. `--detail summary` requires `--output`.

Both modes run the same validation and retain the same report and failing exit status.
Investigate reported duplicate IDs, locked blocks and schema errors before editing; full error
details remain in `schema.error`. The reference does not select targets, authorize mutations or
override native capability limits. Download and run inspection in the same local command when
practical. Snippets and bounded inventories are not proof of exact full content; inspect the
relevant complete source nodes without dumping the whole report into the conversation.

Use the inspection report to identify node ids, message areas, block types, visible text, links,
image sources, effective visibility, duplicate ids, and the before-edit census. Inspect relevant
source nodes directly when exact content matters. IDs belong to this acquisition only.

`moduleId` identifies a saved library module; it is different from a structural node `id`.
The pinned editor contract makes `moduleId` read-only. Preserve it during ordinary content
edits. Prefer a unique node id to address an edit; a `moduleId` selector also matches descendants,
so constrain its node kind and check cardinality before changing content.

## Requests to reuse a saved module

Use the saved-module lookup documented by `PROVIDER.md`; when it documents none and
`mcp-tools.json` marks the library operation unsupported, report library reuse as unavailable. Match the requested name, ID, language,
and purpose to an actual result. Verify the target node's own read-only `moduleId` and content.
A library synchronization flag does not prove that this instance is linked or current.
The current SDK cannot replace a binding by changing `moduleId`; report an unsupported replacement
without relabeling, detaching, or rebuilding content to manufacture the requested identity.

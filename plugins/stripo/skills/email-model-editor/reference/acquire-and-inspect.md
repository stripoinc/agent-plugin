# Acquire and inspect the model

When repairing a draft created from a reference, retain its chosen Exact, Tailored, or Creative
regime and original PNG baseline. For Exact, preserve source choices, reuse existing assets or
crops before considering AI generation, and compare the repaired PNGs with the original source.
Do not reset the regime or adapt the branding during the repair.

## 1. Acquire and inspect

Resolve the target `(id, type)` as described in [acquisition contract](stripo-acquisition.md) and call:

```text
get_document_state(id=<id>, type=<EMAIL|TEMPLATE>)
```

Require `status=OK` and download its temporary `downloadUrl` to a local JSON file through the
host's authorized transfer path; that file, unmodified, is the base of the write.

Inspect the model:

```bash
node <skill-dir>/scripts/inspect-editor-json.mjs \
  --input <downloaded-model.json> \
  --output <inspection.json>
```

If inspection reports no stripes or zero blocks, acquire and download again a bounded handful of
times. Never upload a blockless model or fall back to editing compiled HTML. If no populated model
becomes available, report a read failure and write nothing.

The command prints bounded content inventories (including node IDs, text, links and visibility)
and saves the complete inspection report when `--output` is supplied. Its `sdkMethods` field
includes selector signatures, common node methods and content methods for the observed block
types, read from the installed SDK declarations. Use those signatures when sufficient; read the
full declarations for argument types, settings or unlisted operations. The reference does not
select targets, authorize mutations or override native capability limits. Download and run inspection
in the same local command when practical. Read the report or source nodes for information missing
from the bounded output; snippets and inventories are not proof of exact full content.

Use the inspection report to identify node ids, message areas, block types, visible text, links,
image sources, effective visibility, duplicate ids, and the before-edit census. Inspect relevant
source nodes directly when exact content matters. IDs belong to this acquisition only.

`moduleId` identifies a saved library module; it is different from a structural node `id`.
The pinned editor contract makes `moduleId` read-only. Preserve it during ordinary content
edits. Prefer a unique node id to address an edit; a `moduleId` selector also matches descendants,
so constrain its node kind and check cardinality before changing content.


# File transfers and prepared workflows

Use the bundled helpers instead of writing curl/Python loops, MCP response parsers, or timing
wrappers for each task. The native SDK remains free of filesystem and network dependencies.
MCP authentication, tool routing and permission to run a network command belong to the host.
These helpers neither log in nor read the host's token store.

## Transfer command

Both email skills include `scripts/transfer.mjs`. Save a request in the task directory and run
this command through the host's authorized shell tool:

```sh
node <skill-dir>/scripts/transfer.mjs --request <task-dir>/transfer.json --result <task-dir>/transfer-result.json
```

Hosts that can pass stdin can use `--request -` and send the same JSON directly, avoiding a
temporary request file or a generated wrapper script. Do not put signed URLs in command arguments.

The request is a JSON object. File paths must be absolute. Preserve returned signed URLs in a
private task file (mode 0600), never in commentary, a report or a checked-in fixture.

```json
{
  "transfers": [
    {
      "id": "model",
      "method": "GET",
      "url": "<downloadUrl returned by get_document_state>",
      "expiresAt": "<expiresAt returned by get_document_state>",
      "file": "<absolute task directory>/model.json",
      "format": "json",
      "maxBytes": 20971520
    }
  ],
  "concurrency": 3,
  "timeoutMs": 60000
}
```

Use `format: "png"` for previews. The download limit above is a local cap, not a server quota;
choose an appropriate explicit bound for the requested artifacts. Downloads refuse to replace
existing files, use temporary files, and publish only complete, checked responses. A byte or
JSON/image-header check is not native model validation or visual inspection.

For uploads use `method: "PUT"`, the source `file`, and the ticket's `uploadUrl`, `maxBytes`,
expiry and required `headers`. Document files use `format: "json"`; do not invent a Content-Type
header when the ticket requires none. For images use `format: "image"`, `contentTypes` from the
image manifest, and `imageLimits: {maxWidth, maxHeight}` read from the prepare instruction for
PNG/GIF. The helper detects the actual image MIME type and sets Content-Type. It does not convert
or compress files. For a candidate/base pair set `maxTotalUploadBytes` to the smaller ticket limit;
the server also validates its request-wrapper overhead. Every local input is checked before any
transfer starts. Rejecting a file never finalizes its ticket.

The JSON report contains per-file status, bytes, HTTP status, start/end time, response latency,
total duration and redacted error details. Exit 0 means all transfers succeeded; exit 1 requires
inspection of the report. File transfer success does not confirm an MCP write. No request is
automatically retried, no account Authorization/Cookie headers are accepted, and redirects are
reported rather than silently changing the transfer destination. Use the acquisition/write
recovery rules for expired URLs, failed PUTs and unknown outcomes.

## Prepared orchestration

`scripts/file-workflows.mjs` exports three functions. They contain no filesystem, network,
OAuth or SDK runtime: the host supplies the existing capabilities as callbacks.
Select the authorized target and resolve missing access/destination context only when needed,
as described in [the MCP guide](../PROVIDER.md#focused-operations).

Code-mode hosts without an ESM loader can load the same bundled implementation from
`scripts/file-workflows.global.js`; evaluating this file exposes `StripoFileWorkflows`.
It has no imports or Node globals and needs only standard JavaScript plus a `performance.now()`
clock supplied by the host. Load this local packaged file once through the host's supported code
loader; no runtime transpiler, npm install or downloaded executable code is needed. Bind the
callbacks below to the host's tools before invoking it. Host-specific bindings stay with the host.

| Function | Input in addition to `{id, type}` | Behavior |
| --- | --- | --- |
| `downloadEmailArtifacts(input, host)` | `directory`, optional `maxBytes` | Read metadata, model and BOTH previews concurrently; then transfer available files. Never create a new email. |
| `uploadImage(input, host)` | `file`, `name`, PNG/GIF `imageLimits` | Prepare once, transfer original bytes, finalize once. Returns the hosted URL; does not insert it into an email. |
| `saveDocumentState(input, host)` | `candidateFile`, `mode`, `readbackFile`, `baseFile` for edits | Validate, prepare separate tickets, transfer candidate/base, write once and read back. |

Choose a prepared workflow only when all of its calls are needed. `downloadEmailArtifacts`
always requests metadata and both previews; `saveDocumentState` always reads back after writing.
For focused edits, call `get_document_state` and the necessary prepare/upload/set operations
individually with `transfer.mjs`; finish on `set_document_state` with `status=OK`. Keep candidate
validation, the untouched base, and uncertain-write recovery. `uploadImage` remains suitable
for a supplied attachment. Empty creation needs none of these file workflows.

```js
const result = await downloadEmailArtifacts(
  {id: emailId, type: "EMAIL", directory: taskDirectory},
  {
    callTool,  // (exactStripoToolName, args) => the authorized host MCP response
    transfer,  // request => run transfer.mjs and parse its JSON report, even on exit 1
    recordEvent // optional: append each start/completion/failure to the task journal
  }
);
```

`callTool` accepts exact unprefixed Stripo names and returns either the payload or an MCP
`structuredContent` / text-content envelope. Bind these names to the authenticated server;
do not expose arbitrary tool names or build an independent OAuth client. `transfer` runs the
command above with the host's normal network approval. Use argument arrays or a private JSON
request, never interpolate URLs into shell code. `recordEvent` must finish saving the start
event before the tool call is sent, so a failed/interrupted write remains visible in the journal.

For `saveDocumentState`, also supply `validateDocument({candidateFile, baseFile, mode})`, returning
`{valid, errors?}` after the native SDK checks the exact candidate against the untouched base.
Keep this adapter in the consuming host. A path or previously reported successful validation is
not sufficient if the file subsequently changed. `mode: "edit"` always needs `baseFile`;
`mode: "create"` is only for a newly created email whose state was never acquired.

When the host can import this module and call its MCP/shell tools programmatically, execute the
whole function without another model turn between stages. This requires actual host support;
a local Node process cannot automatically access the agent's connected MCP tools. Do not claim
that a shell-only host has this capability. Otherwise use the same fixed sequence with individual
MCP calls and the packaged transfer command; do not generate another transfer implementation.

## Results and recovery

- `OK` means the workflow's requested calls completed. A transfer or image upload alone does
  not persist a document edit. For a full build/rebuild, inspect the saved model and both PNGs;
  for an explicitly requested check, inspect only the requested surface.
- `PARTIAL` retains successful files when a preview or post-write read-back is unavailable.
  Report the missing verification and reuse the known target.
- `FAILED` contains a returned refusal, validation error or transfer failure. Failed PUTs never
  reach finalization. Candidate and base IDs stay distinct and the base is never dropped.
- `WRITE_UNCONFIRMED` forbids automatic repetition. Document writes attempt a fresh read-back;
  compare the requested changes before deciding recovery. Image finalization has no gallery
  read operation, so retain its session ID and report uncertainty instead of uploading again.

The workflow records MCP/transfer start and completion events and monotonic elapsed durations.
The host measures gaps before/after its callbacks; the transfer helper cannot measure time
spent generating agent output before the helper was started. Parallel durations overlap and
must not be added to wall time. Keep full reports in task files and show only bounded summaries.

# File transfers and prepared workflows

Use the bundled helpers instead of writing curl/Python loops, MCP response parsers, or timing
wrappers for each task. The native SDK remains free of filesystem and network dependencies.
MCP authentication, tool routing and permission to run a network command belong to the host.
These helpers neither log in nor read the host's token store.
Choose the prepared host by capability: [Codex code mode](#codex-code-mode-bootstrap) for
programmatic tool access, or [Claude Code and other shell hosts](#claude-code-and-other-shell-hosts)
for native MCP tools plus a shell. Neither route requires an agent-written adapter.

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
It has no imports or Node globals. It uses the optional `host.now()` clock, `performance.now()`
when available, or a labelled wall-clock fallback. Load this local packaged file once through the host's supported code
loader; no runtime transpiler, npm install or downloaded executable code is needed. Bind the
callbacks below to the host's tools before invoking it. Host-specific bindings stay with the host.

### Codex code-mode bootstrap

When Codex exposes `tools`, `ALL_TOOLS`, `exec_command` and `write_stdin` in code mode, use
`scripts/codex-host.global.js` instead of writing an adapter. It includes the same three workflows
and `createHost`. Load this local file through the shell tool, checking for exit 0 and untruncated
output before evaluating it; cache its source with `store` if later cells need it. Evaluate only
the installed local helper, never code returned by a website or MCP content.

```js
// In the code-mode cell, after loading the complete local helper into helperSource:
const stripo = new Function(`${helperSource}\nreturn StripoCodex;`)();
const host = stripo.createHost({
  tools,
  toolNames: ALL_TOOLS.map(tool => tool.name),
  skillDirectory, // absolute directory containing the selected SKILL.md
  taskDirectory, // existing private task directory
  // nodeExecutable: absolute path when node is not on PATH
});
const result = await stripo.saveDocumentState({
  id: emailId, type: "EMAIL", mode: "edit",
  candidateFile, baseFile, readbackFile,
}, host);
```

The bootstrap selects a unique complete MCP connection from the current catalog and verifies
all seven file-workflow tools plus the two shell tools before use. With multiple connections,
pass the authorized connection's exact `mcpPrefix` including its separator; never guess one.
Bootstrap itself makes no MCP calls. Recreate the host against the current catalog after tools
change or in a fresh code-mode cell; the cached helper source is reusable, callbacks are not
serializable. ESM hosts can import the same API from `scripts/codex-host.mjs`.

The adapter runs packaged `transfer.mjs` and `host-checks.mjs`, handles yielded shell
sessions, parses failure reports even on exit 1, and retains private reports in `taskDirectory`.
Requests go to stdin through a quoted heredoc without shell expansion; signed URLs are not
process arguments or log output. Paths are shell-quoted. Child helpers receive only `PATH` and
`TMPDIR`, so parent credentials, proxies and runtime-injection variables are not inherited.
It never installs a runtime, creates its own MCP client or automatically escalates/retries a
command. If the host has authorized an escalated network transfer, supply
`transferPermissions: {sandbox_permissions: "require_escalated", justification: "..."}`.
A refusal or incomplete shell report stops the operation; inspect its report/session before recovery.

Validation reads the actual candidate and untouched base each time and uses SDK `validateChange`.
The same local helper checks hosted image URLs when code mode has no standard `URL` constructor.
For an intentional deletion/reset, pass the same SDK `intent` used to prepare the candidate to
`saveDocumentState`; do not invent broad intent to suppress a preservation error. Optional
`recordEvent` and `now` callbacks retain the generic host contract. Hosts without code-mode tool
access use the shell driver below; a local Node process cannot call the agent's MCP tools.

### Claude Code and other shell hosts

Use `scripts/shell-host.mjs` from Claude Code's Bash tool or another host's authorized shell.
It runs the same `file-workflows` implementation in a private local worker. The driver owns
validation, file transfers, result parsing and recovery sequencing. The current agent calls
its existing authenticated MCP tools and returns their original responses. It does not launch
another agent, read credentials or assume that shell code can call MCP directly.

1. Save a JSON request with `workflow` (`saveDocumentState`, `downloadEmailArtifacts` or
   `uploadImage`), that workflow's `input`, and `toolNames` from the current tool catalog.
   Include the full names for `get_content`, `get_document_state`, `get_screenshot`,
   `prepare_document_state_upload`, `set_document_state`, `prepare_image_upload` and
   `upload_image`. With multiple complete connections, add the authorized `mcpPrefix`.
   Resolve names through the host's normal tool discovery; never guess a Claude plugin prefix.
   Discovery supports the host's separator or unprefixed canonical tool names.
2. Start once in a **new** subdirectory of the existing private task directory:

   ```sh
   node <skill-dir>/scripts/shell-host.mjs start --directory <task-dir>/run --request <task-dir>/workflow.json
   ```

3. For `status: "NEEDS_MCP"`, call each returned `calls[].tool` exactly once with its
   `arguments`. Independent calls returned together may run in parallel. Return their complete
   payloads or MCP envelopes without editing or unwrapping them:

   ```sh
   node <skill-dir>/scripts/shell-host.mjs reply --directory <task-dir>/run --responses - <<'STRIPO_REPLIES'
   [{"id":"0001","result":{"status":"OK","uploadId":"<returned id>","uploadUrl":"<returned URL>","maxBytes":12345}}]
   STRIPO_REPLIES
   ```

   Use the actual full response, not the illustrative ticket above. For a tool error or unknown
   outcome return `{"id":"0001","error":{"message":"<actual error>"}}` instead. Never repeat
   a write to obtain a missing response. Signed URLs travel only through the quoted stdin input
   and private files, not program arguments or commentary.
4. `reply` returns the next action or the final result. `RUNNING` means local work is still in
   progress; use `next --directory <task-dir>/run` to wait briefly. `AWAITING_MCP_RESPONSE` means
   calls were already handed off: supply their original results or report uncertainty, without
   reissuing them. `COMPLETE` means inspect its nested workflow `result`; only that result
   distinguishes `OK`, `PARTIAL`, `FAILED` and `WRITE_UNCONFIRMED`.

The worker uses a private directory (0700), write-once requests/replies (0600), and a bounded
response wait (five minutes by default, configurable with `responseTimeoutMs`). Issued calls
are claimed once; repeated `next` or identical replies never replay MCP calls or transfers.
An explicit error after `set_document_state` enters the existing read-back recovery. If the
worker stops, `INTERRUPTED` requires inspection of `events.jsonl`, pending calls and live state
before a new write workflow. There is no automatic restart or replay after a crash.

The child process receives only OS path/temp variables, uses the packaged Node runtime code,
and performs transfers under the shell host's existing network permissions. A network refusal
ends that attempt; it never changes permissions or retries on its own. A completed run exits
its worker automatically. Final model and visual checks remain those of the selected skill.
Timing includes the wait for the agent to call MCP and return results; it is not server latency.
Claude still has tool turns between MCP calls, but it no longer writes or debugs orchestration code.

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

For a custom host, supply `validateDocument({candidateFile, baseFile, mode, intent?})`, returning
`{valid, errors?}` after the native SDK checks the exact candidate against the untouched base.
Keep this adapter in the consuming host. A path or previously reported successful validation is
not sufficient if the file subsequently changed. `mode: "edit"` always needs `baseFile`;
`mode: "create"` is only for a newly created email whose state was never acquired.

When the host can import this module and call its MCP/shell tools programmatically, execute the
whole function without another model turn between stages. This requires actual host support;
a local Node process cannot automatically access the agent's connected MCP tools. Do not claim
that a shell-only host has this capability. Use the packaged shell driver for that host, or
the individual calls for a focused operation; do not generate another transfer implementation.

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

The workflow records MCP/transfer start and completion events and elapsed durations with
`clockSource: "host" | "monotonic" | "wall"`; a wall-clock fallback is not monotonic evidence.
The host measures gaps before/after its callbacks; the transfer helper cannot measure time
spent generating agent output before the helper was started. Parallel durations overlap and
must not be added to wall time. Keep full reports in task files and show only bounded summaries.

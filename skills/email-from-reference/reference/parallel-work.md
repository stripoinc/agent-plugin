# Parallel work

This is the shared execution contract for native email creation and editing. Read it with
`PROVIDER.md`, before the first MCP call. Use one agent by default, with parallel tool calls
for independent operations. Subagents are optional, only for large independent subtasks or
separate reviews; their availability alone is not a reason to delegate.

## Batch tool calls

When the host accepts several tool calls in one response, issue independent calls together and
keep their results distinct:

- documentation reads needed for the same stage, each in its own tool call;
- destination, Business Profile and other RESOLVE reads with reference and target acquisition;
- every artifact download of one step;
- supplied-image uploads and the start calls of all independent image jobs;
- the fresh-model and preview reads of verification, plus any saved-metadata read.

A call that needs another call's result waits for it. The host may still run batched calls one
after another. Parallel tool calls do not require a subagent.

## Overlap asynchronous jobs

Start image jobs once the write target that `PROVIDER.md` requires exists, and retain their
identities. While they run, continue independent reference analysis, brief drafting or SDK
module preparation in the same agent. Poll existing jobs at the provider's intervals and collect
results before expiry; do not leave jobs unpolled during a long step. If the host blocks until
a tool returns, resume the workflow when it does; do not spawn a worker just to wait.

- Creation: draft the brief while images render, leaving their image blocks without
  `settings.src`. BUILD waits until every completed result is inspected and its hosted URL is
  filled in; the builder rejects an image without `src`.
- Editing: draft the SDK module's other changes while images render, then add `setSrc()` and
  `setAlt()` once the URL is known. Select nodes by selectors rather than IDs from the earlier
  read, and run the module only against the model `PROVIDER.md` requires you to reacquire after
  the job.
- CREATE and each document write stay single and in workflow order, never earlier than the
  workflow and `PROVIDER.md` allow; never run two document writes for one target at once.
- PRESENT waits for VERIFY.

## Optional delegation

Delegate only a large independent subtask or a separate review when the host supports it and
the expected benefit justifies the extra context and coordination. Examples include inspecting
a substantial reference set, measuring a complex Exact layout, or independently comparing saved
desktop/mobile previews with the source or request. Routine image polling, downloading,
resizing and inspection stay with the main agent; a long wait alone does not justify a worker.

The main conversation owns calls with remote effects: creating an email, finalizing uploads,
starting image jobs, document writes and final presentation. It records identities, checks
worker results, decides retries and talks to the user. A worker does read-only or local work;
it may collect already-started jobs as part of a delegated subtask only when the provider's
images topic allows it. It never starts, repeats or replaces calls with remote effects or asks
the user; it returns facts and open questions, not decisions.

Give each worker a compact, self-contained task: exact identifiers, local file paths, tool
names, only the topic files it needs and the result shape. Assign each image job to one poller.
If a worker returns without a terminal status or cannot reach the tools, take back its jobs and
resume polling. Worker reviews narrow your checks but do not replace them: open each returned
PNG yourself before using an image or reporting completion. Wait for any required worker result
at the same image, write and verification join points above.

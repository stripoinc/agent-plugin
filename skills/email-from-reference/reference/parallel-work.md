# Parallel work

This is the shared execution contract for native email creation and editing. Read it with
`PROVIDER.md`, before the first MCP call. How much work overlaps depends on whether the host
can run subagents (workers) in the background.

## Batch in one response

When the host accepts several tool calls in one response, issue independent calls together and
keep their results distinct:

- destination, Business Profile and other RESOLVE reads with reference and target acquisition;
- every artifact download of one step;
- supplied-image uploads and the start calls of all independent image jobs;
- the fresh-model and preview reads of verification, plus any saved-metadata read.

A call that needs another call's result waits for it. The host may still run batched calls one
after another.

## Without background workers

Run the stages one after another in workflow order. Wait until every started image job is
complete and collected before writing the brief or the SDK module: generation takes about a
minute, while a result left uncollected during a long step can expire. Subagents that block the
main conversation may still inspect several references at once; launch them in one response.

## With background workers

When the host can run subagents in the background, overlap the stages and wait only at the
join points below.

### Roles

- The main conversation owns every call with remote effects: creating an email, finalizing
  uploads, starting image jobs, document writes and the final presentation. It records their
  identities, checks every worker result, decides retries and talks to the user.
- A worker does read-only or local work, plus collecting image jobs when the provider's images
  topic allows it. It never starts, repeats or replaces a call with remote effects and never
  asks the user; it returns facts and open questions, not decisions.

Do not delegate a single short call: starting a worker costs more than it saves.

### Delegate

| Work | The worker returns |
| --- | --- |
| Inspect one of several references, or measure an Exact layout | Facts for `sourceSummary`, asset URLs, dimensions |
| Collect, download and review the image jobs started together | Per job: hosted URL, dimensions, local PNG path and review notes, or failure code |
| Compare saved desktop/mobile previews with the source or request | Differences by section |

Give each worker a self-contained task instead of the whole skill: exact identifiers, local
file paths, tool names, the topic files it needs and the result shape. A collecting worker
polls each job until it reaches a terminal status. If it returns without one, or cannot reach
the required tools, take that work back and poll the remaining jobs at once. Worker reviews
narrow your checks but do not replace them: open each returned PNG yourself before using an
image or reporting completion.

### Join points

- Image jobs and uploads start once the write target that `PROVIDER.md` requires exists.
- Creation: draft the brief while a worker collects the images, leaving their image blocks
  without `settings.src`. The builder rejects an image without `src`, so BUILD runs only after
  every URL is filled in.
- Editing: write the SDK module's other changes while a worker collects the job, and add
  `setSrc()`/`setAlt()` once the URL is known. Select nodes by selectors rather than IDs from
  the earlier read, and run the module only against the model `PROVIDER.md` requires you to
  reacquire after the job.
- CREATE and each document write stay single and in workflow order, never earlier than the
  workflow and `PROVIDER.md` allow; never run two document writes for one target at once.
- PRESENT waits for VERIFY.

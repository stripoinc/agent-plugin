# Stripo plugin host adapter

`<skill-dir>` is the directory of this file. `<bundle-root>` is the plugin root two levels above
it; it holds `skills/`, `packages/` and `scripts/`. Claude Code and Codex run the plugin from
their cache, so resolve both paths from this installed file, never from the current project
directory, and keep the layout: the runners locate the SDK through it.

This plugin ships no `bundle.json` or `mcp-tools.json`. The bundled validator's editor revision
is `editorRevision` in `<bundle-root>/packages/convo-email-agent/editor-validator/manifest.json`.
When a file these skills mention is absent from the plugin, do not search the disk for it;
continue with `PROVIDER.md`. Stripo has no saved-module library, sending interfaces,
name/project/folder metadata writes, template creation or HTML/CSS export manifest. A shared
preview link comes only from `show_content_preview`, as described under presentation below.

Read one topic file per command, when its stage starts. Codex cuts the middle out of a tool
result above its output budget (10,000 tokens by default), so concatenated topics lose rules.

## Tool declarations

Call tools by the names `PROVIDER.md` and its topics use. To check callable schemas, as the
skills require, look only at the selected Stripo server's tools: list their names once, then
read the full declaration of each tool you are about to call, by its exact name. In Codex code
mode use `ALL_TOOLS.filter(t => t.name.startsWith(prefix)).map(t => t.name)` with that server's
prefix, such as `mcp__stripo_mcp__`, and `ALL_TOOLS.find(t => t.name === name)`. In Claude Code
the declarations are already loaded or come from a tool search for the exact name. Do not match
tool names or descriptions with broad patterns, list other servers' tools or MCP resources, or
read `stripo://guide/*`: these skills replace the server guides.

When a call is rejected as an unknown tool or parameter, first compare it with that tool's
current declaration and correct your own arguments. If the declaration requires something these
skills do not describe, follow Plugin updates. If the skills require a tool or parameter the
declaration lacks, the server is older than the plugin: report it instead of offering an update.

## Connection

The agent's own authenticated Stripo MCP connection, normally `stripo-mcp`
(`https://mcp.stripo.email/mcp`, scopes `mcp:tools` and `offline_access`), supplies OAuth. The
plugin ships no MCP server entry, tokens or client secrets. When the server is missing or not
authenticated, stop and point the user to
https://support.stripo.email/en/articles/15921958-how-to-connect-your-ai-assistant-to-stripo.
Never read credential files or put tokens into the conversation, commands or files.

## Working files

Create a fresh directory per task (`mktemp -d`) for the untouched model, the SDK module or
brief, the candidate, diagnostics and PNG previews; never write them into the user's project.
Inspect local PNGs with the agent's image viewer: `Read` in Claude Code, `view_image` in Codex.

An attached or pasted image can be uploaded only from a local file with its original bytes.
When the conversation shows an image but no path to it, ask the user for the file path instead
of recreating the image.

## Signed file transfers

`node <bundle-root>/scripts/transfer.mjs` is this host's transfer binding. Its commands, limits
and failure codes are in [Acquisition and transfers](reference/stripo-acquisition.md#transfers).
Signed URLs point to Stripo storage, not to the MCP host. Codex's default sandbox has no
network: run the first transfer of a task with an escalation request whose justification names
the URL's host. Claude Code runs it under its Bash permission rules; with sandboxing enabled the
host must be allowed. A denied approval stops the transfer; report it.

## Images

Image generation and editing use Stripo MCP `generate_image`, `edit_image` and `get_image_job`;
supplied images use `prepare_image_upload`, a `transfer.mjs upload` and `upload_image`. Follow
[Images](reference/stripo-images.md). This host has no other image provider, adapter or
credentials. Jobs consume the project's image quota.

## Parallel work, approvals and presentation

Claude Code and Codex accept several tool calls in one response. Use the background-worker path
of [Parallel work](reference/parallel-work.md) only when the agent offers background subagents,
such as Claude Code's; otherwise run the stages in order.

The agent's permission prompt gates `create_email`, `set_document_state`, uploads and image
jobs. A denial arrives as a tool error: stop that step, do not retry or switch projects, and
report what was not saved.

`show_content_preview` displays its App only in clients that render MCP Apps; a terminal client
usually shows nothing. Always give the returned `editorLink` as text. When the workspace plan
includes shared preview, the result also carries `previewLink`, a hosted preview page you may
give the user; otherwise it may carry `screenshotUrl`, a temporary signed PNG for the App that
you must not print or download. Older servers return neither.

## Plugin updates

When a Stripo MCP call fails in a way `SKILL.md` and `PROVIDER.md` do not explain, such as a
declaration that requires a tool or parameter these skills do not describe, or a rejection of a
model the bundled validator accepted, the plugin may be older than the service. Tell the user and offer an update; run it only with consent:

- Claude Code: `claude plugin marketplace update stripo`, then `claude plugin update stripo@stripo`
  (add `--scope project` or `--scope local` for that install scope), then `/reload-plugins`.
- Codex: `codex plugin marketplace upgrade stripo`, then a new session.
- Other agents: `git pull` in the checkout of https://github.com/stripoinc/agent-plugin, then a
  new session.

If the plugin is already current, the failure has another cause: report it as `SKILL.md` says.

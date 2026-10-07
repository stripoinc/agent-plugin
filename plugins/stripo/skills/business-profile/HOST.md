# Host notes

This skill is part of the Stripo agent plugin. These notes apply to any agent that loads it;
where Claude Code or Codex behave differently, they are named. The agent runs the skill's
commands with its shell tool and calls the Stripo MCP tools itself. This file is the host
contract the skill refuses to infer. It needs `curl` on `PATH` and nothing else.

## Paths

- `${BRANDKIT_SKILL_ROOT}` is the directory holding this file (`${CLAUDE_SKILL_DIR}` in Claude
  Code; in Codex and other agents the directory of `SKILL.md`).
- `${BRANDKIT_ARTIFACTS_ROOT}` is a fresh temporary directory per task: create it with
  `mktemp -d` and use its absolute path. Read the email procedure's
  `output/brandkit/runs/<UTC_TIMESTAMP>/` as a layout inside it. Do not write run artifacts into
  the user's project.

## Plugin updates

Codex refreshes the plugin each time it starts. Claude Code updates it in the background only
when auto-update is enabled for the `stripo` marketplace. An agent that loads the skills from a
checkout of the plugin repository gets a new version only when that checkout is updated.

When a Stripo MCP call fails in a way this skill does not explain, such as an unknown tool or
parameter, the installed plugin may be older than the service. Tell the user and offer to update
it; run the commands only with the user's consent:

- Claude Code: `claude plugin marketplace update stripo`, then `claude plugin update stripo@stripo`
  (add `--scope project` or `--scope local` for a plugin installed at that scope), then
  `/reload-plugins` or a new session.
- Codex: `codex plugin marketplace upgrade stripo`, then a new session.
- Other agents: `git pull` in the checkout of https://github.com/stripoinc/agent-plugin the
  skills were installed from (copy the package again if it was copied rather than linked), then
  a new session.

When the update reports that the plugin is already current, the failure has another cause:
report it as the skill describes.

## What this host runs

- **Email evidence** (read, check/audit, fill, reconcile, update from the project's emails) is
  supported.
- **Website procedures are not available.** This host registers no native browser: the bundled
  `native-browser-server.mjs` needs a host session adapter that this plugin does not ship. That
  covers full website extraction, extraction-only and Visual-identity-only runs, standalone
  website Brand voice and Business context, and reuse of a supplied run directory. When asked for
  one, say that website extraction is not available in this host and stop before any browser
  work. Do not substitute another browser or browser MCP from the session, a web fetch, an
  earlier kit or a legacy extraction command. When the project's emails could serve the request,
  offer the email procedure as a different source; its result is not a website extraction and
  never a full replacement.

Phase 5 (`prepare_business_profile_upload`, the upload, `replace_business_profile`) and
`finalize.py` therefore never run in this host.

## Write scope: one Stripo project

A Business Profile belongs to one Stripo project, not to the account; it is the skill's "publisher
account" and "selected project". Resolve it before the first read: `whoami` for the account, then
`find_projects`. Use the single project when there is exactly one; when there is more than one and
the request did not name it, ask the user which project to work in. Every profile call carries that
`projectId`.

## MCP routing

The host provides the Stripo MCP server as `stripo-mcp` (in Claude Code the server bundled with
the plugin is `plugin:stripo:stripo-mcp`), or `stripo-mcp-dev` / `stripo-mcp-stage` when it points
at a non-production environment. When more than one of them is connected, ask the
user which one to work in before resolving the project. The email procedure names generic tools;
these are the Stripo ones:

| Skill text | Stripo tool |
| --- | --- |
| brandkit read tool | `get_business_profile(projectId)` |
| brandkit update tool | `patch_business_profile(projectId, patch)` |
| `get_email_model` | `get_document_state(id, "EMAIL")` → a `downloadUrl` |
| email PNG / render tool | `get_screenshot(id, "EMAIL", mode="BOTH")` → `screenshots[].downloadUrl` |
| `get_email_message_export` | `export_to_html(type="email", id)` → `htmlUrl`; each call spends one export from the workspace quota, so use it only when an email has no JSON model |
| email list / search | `find_content`, `find_folders`, `get_content` |

In a `patch_business_profile` patch, omitted fields stay unchanged, but an array replaces the
whole stored list and `[]` clears it. To add a variant, send the current items plus the new one.

Stripo does not send emails, so there is no sent status and no analytics or performance ranking.
For "latest" emails use `find_content(type="email", projectId, sortBy="updatedAt",
sortOrder="desc")`; drafts are excluded unless `draft` is set. When the user asks for
"best-performing" emails, say that no performance data exists and offer the most recently updated
emails instead.

`publisher-runtime` and `publisher-proxy` are the shared text's names for a runtime this host does
not have; ignore those rules and the `OPENAI_API_KEY` one with them. The plugin bundles the MCP
endpoint and scopes without a fixed OAuth client ID. Configure a pre-registered client in the
host's MCP connection as the plugin README describes; do not assume automatic registration.
Authorization is per agent, through OAuth (Claude Code: `/mcp`; Codex:
`codex mcp login stripo-mcp --scopes mcp:tools,offline_access`; other agents: their own login flow
for the server, or the browser login an `mcp-remote` bridge opens on its first start). Never paste tokens or credentials into the conversation,
command arguments or files.

## Artifact transfer

Tools return signed, short-lived URLs rather than inline payloads. Download each one with the
helper this host installs beside the skill:

```bash
"${BRANDKIT_SKILL_ROOT}/scripts/download_via_proxy.sh" --url '<downloadUrl>' --output <file>
```

When a URL has expired, ask the tool for a new one instead of retrying the download.

## Approvals

The host's own permission prompt gates every write; there is no Slack card here. A denial arrives
as a tool error: report which field paths went unwritten and leave the profile as it stands.

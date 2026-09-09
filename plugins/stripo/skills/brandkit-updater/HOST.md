# Host notes: Claude Code and Codex

This skill is installed by the Stripo plugin. It runs entirely on MCP tool calls plus one download
helper; it needs Node.js 20+ and `curl` on `PATH` and nothing else.

## Write scope: one Stripo project

The skill's "publisher account" is one Stripo project — a Business Profile belongs to a project,
not to the account. Resolve the project before the first read: `whoami` for the account, then
`find_projects`. Use the single project when there is exactly one; when there is more than one and
the request did not name it, ask the user which project to work in. Every brandkit call carries
that `projectId`.

## MCP routing

The plugin configures one MCP server, `stripo`. Read the tool names off it directly; the shared
skill text names Reteno's, and these are the Stripo ones:

| Skill text | Stripo tool |
| --- | --- |
| brandkit read tool | `get_business_profile(projectId)` |
| brandkit field-by-field write | `patch_business_profile(projectId, …)` |
| brandkit whole-document write | `replace_business_profile(projectId, uploadId, website)` — extraction only, not this skill |
| `get_email_model` | `get_document_state(id, type)` → a `downloadUrl` |
| email PNG / render tool | `get_screenshot(id, type)` → `screenshots` |
| `get_email_message_export` | `export_to_html(id, type)` |
| email list / search | `find_content`, `find_folders`, `get_content` |

There is no analytics or message-ranking tool on this server. When the user asks for
"best-performing" emails, say so and offer the latest sent emails instead of inferring performance.

`publisher-runtime` and `publisher-proxy` are the shared text's names for a runtime this host does
not have; ignore those rules and the `OPENAI_API_KEY` one with them. Authorization is per host,
through OAuth (Claude Code: `/mcp`; Codex: `codex mcp login stripo`). Never paste tokens or
credentials into the conversation, command arguments or files.

## Artifact transfer

Tools return signed, short-lived URLs rather than inline payloads. Download each one with the
helper this host installs beside the skill:

```bash
<skill-dir>/scripts/download_via_proxy.sh --url '<downloadUrl>' --output <file>
```

`<skill-dir>` is the directory holding this file (`${CLAUDE_SKILL_DIR}` in Claude Code). Keep run
artifacts in a fresh temporary directory (`mktemp -d`), not in the user's project: read
`output/brandkit/runs/<UTC_TIMESTAMP>/` in the skill as a layout inside that directory. When a URL
has expired, ask the tool for a new one instead of retrying the download.

## Approvals

The host's own permission prompt gates every write; there is no Slack card here. A denial arrives
as a tool error — report which field paths went unwritten and leave the brandkit as it stands.

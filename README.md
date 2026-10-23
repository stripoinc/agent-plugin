# Stripo Agent Plugin

Create and edit native, editable Stripo emails with Claude Code, Codex or another MCP-capable
agent. The plugin uses your authenticated Stripo connection and includes the email SDK and
editor validator. It does not send emails or schedule campaigns.

## Skills

| Skill | Capabilities |
| --- | --- |
| `email-from-reference` | Create an email from a brief, website, template, HTML, screenshot or supplied images; rebuild an explicitly selected email or template; verify saved desktop/mobile previews. |
| `email-model-editor` | Edit native copy, links, images, layout, styles, document title and preheader in existing emails and templates. |
| `business-profile` | Read, audit, fill or update a project's Business Profile from supplied information or selected Stripo emails, preserving unrelated fields. |

Image generation and editing use Stripo MCP. Supplied images are hosted as original assets;
requests to inspect content do not start image jobs. Business Profile website extraction is
not supported. The email creation skill can still use an authorized website as a reference.

## Install

Requirements: Node.js 20.18.1+ and an agent with shell, file, image inspection and MCP tools.
The supplied shell examples use POSIX syntax; on Windows use WSL or an equivalent shell.
No npm install, curl, Python runtime or private source checkout is needed to use the plugin.

Claude Code:

```text
/plugin marketplace add stripoinc/agent-plugin
/plugin install stripo@stripo
```

`/reload-plugins` reloads changed skills.

Codex:

```sh
codex plugin marketplace add stripoinc/agent-plugin
codex plugin add stripo@stripo
```

Start a new session to load the installed skills.

The skills require an authenticated `stripo-mcp` connection configured separately in your agent.
Stripo uses `https://mcp.stripo.email/mcp` with scopes `mcp:tools` and `offline_access`.
The plugin contains no tokens, client secrets or fixed MCP server entry. Browser sign-in belongs
to you and your agent's OAuth flow; never paste tokens into chat or plugin files.

Other clients with an authenticated Stripo MCP connection can load `skills/` from this repository.
Keep the complete plugin together, including
`packages/`: the local commands resolve the SDK relative to the skills.

Run `node scripts/doctor.mjs` from the plugin directory to check local prerequisites. In a new
agent session, ask for a read-only `whoami` check and verify the intended account/project before
editing. Local prerequisite checks do not prove MCP authentication or write access.

The bundled `scripts/transfer.mjs` downloads models, references and previews and uploads prepared
files using the exact HTTPS URLs returned by MCP. It supports direct S3 links, keeps file bytes
unchanged, checks size limits and optional download checksums, and replaces downloads atomically.
It returns compact JSON without printing signed URLs. See the
[host instructions](skills/email-model-editor/HOST.md) for commands and upload finalization.

## Examples

- "Create a Stripo email from this brief and check its saved desktop and mobile previews."
- "Change the CTA and image in this email, keeping the rest of its layout."
- "Audit this project's Business Profile against these three emails without changing it."

## Data and external services

The agent runs the bundled Node.js helpers locally and calls the authorized Stripo MCP server.
Email models, reference files, images and previews are downloaded to local task files using
short-lived URLs returned by Stripo or URLs authorized for the task. Candidate and unchanged base
models use separate upload tickets. After a write, the skill reads saved state and inspects fresh
desktop/mobile previews. Local files remain in the workspace until its owner or host removes them.

Stripo image generation/editing consumes the project's image quota. Image jobs receive the
requested prompts and authorized reference assets. Uploading or generating an image returns a
hosted URL; inserting it into an email requires a separate model write. A supplied image is not
permission to generate a substitute. The plugin carries no separate image-provider credentials.

Website references use the agent's authorized browser tools. The destination receives normal
browser requests. This plugin has no browser service, publisher proxy, hidden extraction runtime
or background hook. Host and external-provider data handling follows their own terms and settings.

See [Stripo privacy](https://stripo.email/privacy-policy/),
[terms of use](https://stripo.email/terms-of-use/) and [support](https://support.stripo.email).

## Limits and maintenance

Access depends on the selected project's permissions, available MCP tools and quotas. The plugin
cannot create templates, change external name/project/folder metadata, or rank emails by sending
performance. Missing capabilities and incomplete visual checks are reported explicitly; local
validation alone is not a successful save.

The repository root is the installable plugin. `skills/` contains Stripo-owned instructions,
`packages/` the imported SDK, and `release.json` the upstream provenance and file hashes.
The development-only `evals/` suite checks routing and scope. See
[maintenance and eval instructions](https://github.com/stripoinc/agent-plugin/blob/main/docs/maintaining.md)
for SDK synchronization, validation and packaging. A curated release package excludes development
scripts, evals, local work files and dependencies.

This package is distributed under the [Stripo Agent Plugin License, Version 1.0](LICENSE).
The pinned editor validator contains proprietary Stripo code; bundled third-party notices and
separately licensed components retain their own terms. The plugin identifier remains `stripo`.

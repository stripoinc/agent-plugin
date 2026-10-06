# Stripo Agent Plugin

Create and edit native, editable Stripo emails with an AI agent. The plugin is
published by Stripo through the [stripoinc organization](https://github.com/stripoinc).
It contains three skills and their local Document State SDK:

- **email-from-reference** creates an email from a brief, an authorized reference,
  HTML, a screenshot or supplied images, and can rebuild a selected email.
- **email-model-editor** changes an existing email or template, including copy,
  links, layout and images, then checks saved content and available previews.
- **business-profile** reads, audits and updates a Stripo project's business
  profile using the project's emails as evidence.

## Install

Requires Node.js 20.18.1 or later, a POSIX shell, curl, and an agent with shell,
file, image inspection and MCP tools. Keep this entire plugin directory together;
the skills load the sibling packages directory. The SDK and canonical validator
are bundled as readable ESM modules and do not download executable code at runtime.
No private source checkout or npm install inside this plugin is needed for its
supported workflows.

For Claude Code, run:

```text
/plugin marketplace add stripoinc/agent-plugin
/plugin install stripo@stripo
```

For Codex, run:

```bash
codex plugin marketplace add stripoinc/agent-plugin
codex plugin add stripo@stripo
```

Start a new agent session after installation. In Claude Code, `/reload-plugins`
also reloads the skills. See the [installation guide](https://github.com/stripoinc/agent-plugin#install-and-connect-mcp)
for Codex's separately configured, version-pinned OAuth bridge and other agents.
Installing that optional bridge downloads its pinned package; it is not part of
the local SDK or automatically installed by this plugin.

## Authorize Stripo

Your organization must enable MCP access and supply its OAuth client ID. Configure
the server as **stripo-mcp**, using `https://mcp.stripo.email/mcp`. The plugin does
not ship an organization-specific MCP configuration or request API keys.

For Claude Code, substitute your organization's client ID, then run:

```bash
claude mcp add-json --scope user stripo-mcp '{"type":"http","url":"https://mcp.stripo.email/mcp","oauth":{"clientId":"<CLIENT_ID>","callbackPort":8080,"scopes":"mcp:tools"}}'
```

Open `/mcp` and finish the browser login. Authentication belongs to the agent's
OAuth connection. Do not paste tokens into chat, source files or runner arguments.
In a fresh session, ask the agent to call `whoami` without making changes, then
confirm the account and project before editing.

## What runs and where data goes

The agent reads these skills, runs local Node.js SDK commands, and calls your
authorized Stripo MCP server. Model JSON, references and screenshots are downloaded
to local task files from signed URLs returned by Stripo. Approved candidate models
and unchanged base models are uploaded through separate signed upload tickets;
Stripo persists the resulting changes. The plugin then reads back saved state and
inspects available desktop and mobile screenshots. Signed URLs are temporary.

Image generation and editing run through Stripo's `generate_image`, `edit_image`
and `get_image_job` tools. They consume the project's image quota. Supplied local
images use `prepare_image_upload` and `upload_image`, with file transfer to the
returned upload destination. Completed uploads and generated images produce hosted
URLs; putting those URLs into an email requires a separate model edit. Authorized
reference URLs and image content are provided to Stripo for the requested operation.

The Business Profile browser scripts and Python runtime are included for shared
source compatibility. This public host has no browser session adapter and does
not run website extraction, its finalizer, or full website profile replacement.
Do not install those dependencies to try to enable an unsupported workflow. The
supported email-evidence procedure uses Stripo MCP and the local transfer helper.

## Limits and licensing

This plugin does not send emails or schedule campaigns. It needs access to the
selected project, the required live MCP tools, and any applicable quota. It cannot
rank emails by performance: Stripo supplies no sending analytics here. Image uploads
and generation must be available on the connected server. Missing permissions,
tools, quota or screenshots are reported; local validation alone does not prove a
successful save or completed visual review.

The validator contains proprietary Stripo editor code from a pinned revision.
Its bundled third-party notices remain in the SDK's editor-validator NOTICE.txt.
The package is distributed under the [Stripo Agent Plugin License, Version 1.0](LICENSE),
identified in its manifests as `LicenseRef-Stripo-Agent-Plugin-1.0`. Separately licensed
components retain their own terms and notices.

For setup and troubleshooting, read the [project documentation](https://github.com/stripoinc/agent-plugin#readme).
The plugin identifier remains **stripo**.

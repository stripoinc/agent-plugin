# Stripo Agent Plugin

Skills for creating and editing emails and templates in Stripo with AI agents.
Requires a connected Stripo MCP server.

The plugin is `stripo`, distributed through the `stripo` marketplace in this repository.
It includes the skills and their SDK. MCP access is configured separately in each agent.

## Included skills

| Skill | Use it for |
| --- | --- |
| `email-model-editor` | Edit an existing email or template through native JSON models; verify the saved result and desktop/mobile previews. |
| `email-from-reference` | Create an email from a brief, HTML, screenshot or another authorized reference; rebuild an explicitly selected email or template. |
| `business-profile` | Read, audit and update a project's business profile using its emails as evidence. |

The current Claude Code/Codex host adapter does not support Business Profile extraction from
websites. It also provides no image generation or asset-upload workflow. See the packaged
[host capabilities](host/business-profile/HOST.md) before planning those workflows.

## Requirements

- Claude Code or Codex with plugin support and permission to use a shell, local files and MCP tools.
- Node.js **20.18.1+**, `curl`, and a POSIX shell, such as on macOS, Linux or WSL.
- An agent that can inspect the desktop and mobile PNG previews for visual verification.
- A Stripo organization with MCP enabled, its OAuth client ID, and access to the intended project.
- Network access to Stripo MCP and the temporary download/upload URLs returned by its tools.

The SDK is included: installing this plugin does not require the private `convo-email-agent`
repository or an npm install inside the plugin. The documented Business Profile email workflow
does not require Python or browser-runtime setup.

Keep the complete `plugins/stripo/` package together. Copying only `skills/` loses the sibling
`packages/` directory and breaks the SDK runners. Installation instructions below cover Claude
Code and Codex; other agents need their own installation and runtime verification.

## Install and connect MCP

The plugin ships no MCP configuration because the OAuth client is issued per organization.
`<CLIENT_ID>` below is the organization's OAuth client ID from the Stripo account once MCP is
enabled. Name the server **`stripo-mcp`**. Its dependency is declared in each skill's
`agents/openai.yaml`; that declaration does not supply the client ID or complete OAuth login.

### Claude Code

In Claude Code:

```text
/plugin marketplace add stripoinc/agent-plugin
/plugin install stripo@stripo
```

In a terminal, connect the MCP server using your organization's client ID:

```bash
claude mcp add-json stripo-mcp '{"type":"http","url":"https://mcp.stripo.email/mcp","oauth":{"clientId":"<CLIENT_ID>","callbackPort":8080,"scopes":"openid profile email mcp:tools"}}'
```

Open `/mcp` in Claude Code and complete the browser login. Start a new session to load the
installed skills. Invoke them with the `stripo:` prefix, for example
`/stripo:email-model-editor`.

### Codex

```bash
codex plugin marketplace add stripoinc/agent-plugin
codex plugin add stripo@stripo
```

Add the server to `~/.codex/config.toml`, substituting your organization's client ID. This setup
uses the `mcp-remote` bridge through `npx` (included with npm):

```toml
[mcp_servers.stripo-mcp]
command = "npx"
args = ["-y", "mcp-remote", "https://mcp.stripo.email/mcp", "3334", "--static-oauth-client-info", "{\"client_id\":\"<CLIENT_ID>\"}", "--static-oauth-client-metadata", "{\"scope\":\"openid profile email mcp:tools\"}"]
startup_timeout_sec = 60
```

On its first start the bridge opens the browser login. Start a new Codex session and invoke a
skill by name, for example `$email-model-editor`. For this bridge setup, complete login through
the bridge; `codex mcp login` is for directly configured HTTP servers.

### Verify the installation

Check the tools on the machine where the agent runs:

```bash
node --version
curl --version
```

For Claude Code, use `claude plugin list` and `claude mcp get stripo-mcp`.
For Codex, use `codex plugin list` and `codex mcp get stripo-mcp`.
These commands inspect configuration; they do not prove successful authorization.

In a new agent session, ask: **"Use Stripo MCP's `whoami` tool to verify my connection without
changing anything."** Confirm the returned account before working with a project. If this
fails, finish MCP setup before invoking an editing skill.

## Update or uninstall

Refresh the marketplace and update the installed plugin, then start a new session:

| Agent | Update | Uninstall |
| --- | --- | --- |
| Claude Code | `claude plugin marketplace update stripo`, then `claude plugin update stripo@stripo` | `claude plugin uninstall stripo@stripo` |
| Codex | `codex plugin marketplace upgrade stripo`, then `codex plugin add stripo@stripo` | `codex plugin remove stripo@stripo` |

Use the same installation scope that you selected initially. To remove the catalog as well,
run `claude plugin marketplace remove stripo` or `codex plugin marketplace remove stripo`.
The manually configured MCP connection is separate: remove it with
`claude mcp remove stripo-mcp` or `codex mcp remove stripo-mcp` when it is no longer needed.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Marketplace or plugin command is unknown | Update the agent to a version with plugin support. |
| Skills do not appear, or an old version is still active | Confirm the plugin is installed and enabled, refresh it, and start a new session. Check the installed version against `plugin-metadata.json`. |
| The same skill appears twice | Check for earlier manually copied skills in the agent's personal/project skill directories. Remove only the obsolete copies after confirming which plugin supplies the current version. |
| `stripo-mcp` is missing or reports authentication errors | Check the exact server name, organization client ID and completed browser login. Verify live access with `whoami`. |
| The Codex bridge does not start | Check `node`/`npx` on the agent's PATH, network access for `mcp-remote`, and port 3334 availability. |
| `Cannot find the packaged convo-email-agent SDK` | Reinstall the whole plugin. Keep `skills/` and `packages/` together; remove an obsolete `CONVO_EMAIL_AGENT_SDK_PATH` override if one is set. |
| Business Profile website extraction is unavailable | The current host adapter supports email evidence only; installing browser/Python dependencies alone does not add a website adapter. |

## Maintain this repository

### Sources and generated files

| Source | Generated output |
| --- | --- |
| `plugin-metadata.json` | Claude/Codex plugin manifests, both marketplace catalogs, and the `stripo-mcp` dependency in each `agents/openai.yaml`. |
| A clean Stripo bundle built by `convo-email-agent` | `plugins/stripo/skills/`, `packages/`, `mcp-tools.json`, and `bundle.json`. |
| `host/HOST.md` and `host/<skill>/` | Shared host instructions and skill-specific overrides/helpers in the installed skills. |
| The assembled bundle | `bundle-integrity.json`, a SHA-256 inventory of packaged files; `plugins/stripo/.generated` identifies the sources. |

Removing a host override requires syncing a clean upstream bundle again, so the corresponding
upstream file can be restored or an obsolete helper removed. Generation detects such removals.

The upstream skill interface, invocation policy and unrelated dependencies are preserved when
adding the Stripo MCP dependency. Change workflow instructions and SDK code in
`convo-email-agent`; this repository owns packaging metadata and host integration.

### Change metadata or host integration

Install maintenance dependencies once in the repository root:

```bash
npm ci --ignore-scripts
```

Edit `plugin-metadata.json` or `host/`, then increase `version` in `plugin-metadata.json` when
changing the distribution or packaging tools. Generate and check the result:

```bash
npm run generate
npm run validate
npm test
npm run validate:claude
npm run check:version -- --base origin/main
```

`validate:claude` requires the Claude CLI; CI pins it to **2.1.263**. `check:version` detects changes
since the merge base and compares the version with the supplied Git ref. It does not fetch that
ref; fetch your intended base first when necessary. It rejects unchanged or lower versions,
including prerelease regressions.
README-only changes do not require a release bump.

Commit the sources and their generated outputs together. `npm run check:generated` checks them
without writing; `npm run generate` updates the integrity inventory, so review every packaged
file change rather than using generation to accept unexplained edits or deletions.

### Sync a new upstream bundle

Build the committed upstream revision in a clean `convo-email-agent` checkout with
`npm run build:stripo`, following that repository's build prerequisites. Back in this repository:

```bash
node scripts/sync-bundle.mjs --bundle ../convo-email-agent/dist/convo-email-agent/stripo --version 0.6.2
npm run validate
npm test
npm run validate:claude
npm run check:version -- --base origin/main
```

Replace `0.6.2` with the next plugin release version. The sync requires a version greater than
the one currently in `plugin-metadata.json`; it updates that source and regenerates the host
files, manifests, dependencies and integrity inventory. `bundle.json.version` is the upstream
SDK version and is independent of the plugin release version. Keep `bundle.json` provenance
from the build; do not edit it by hand. `--allow-dirty` is for local investigation only: CI
rejects dirty release bundles.

Public CI validates the committed distribution on Node.js 20.18.1, 22 and 24. It checks generated
files, skill frontmatter, declared package paths, MCP tool mappings, bundle provenance and SDK
loading from an isolated installed copy. PRs changing the bundle, metadata, host files or
packaging tools require a higher version. CI needs no private checkout, MCP account or OAuth
credentials. These checks do not verify live MCP persistence or OAuth; exercise those separately
in each supported agent before releasing changes that affect them.

## Format references

- [Claude plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)
- [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins)
- [OpenAI skill MCP dependencies](https://developers.openai.com/plugins/build/skills#connect-skills-to-mcp-tools)

# Stripo Agent Plugin

Skills for creating and editing emails and templates in Stripo with AI agents.
Requires a connected Stripo MCP server.

The plugin is `stripo`. It includes the skills and their SDK and is built for any agent that
loads skills in the `SKILL.md` format and can use a shell and MCP tools. Claude Code and Codex
install it from the `stripo` marketplace in this repository; [other agents](#other-agents) load
the same package from a checkout. MCP access is configured separately in each agent.

## Included skills

| Skill | Use it for |
| --- | --- |
| `email-model-editor` | Edit an existing email or template through native JSON models; verify the saved result and desktop/mobile previews. |
| `email-from-reference` | Create an email from a brief, HTML, screenshot or another authorized reference; rebuild an explicitly selected email or template. |
| `business-profile` | Read, audit and update a project's business profile using its emails as evidence. |

The packaged host adapter does not support Business Profile extraction from websites. It also
provides no image generation or asset-upload workflow. See the packaged
[host capabilities](host/business-profile/HOST.md) before planning those workflows.

## Requirements

- An AI agent that loads skills in the `SKILL.md` format, with permission to use a shell, local
  files and MCP tools. Claude Code and Codex install the plugin natively.
- Node.js **20.18.1+**, `curl`, and a POSIX shell, such as on macOS, Linux or WSL.
- An agent that can inspect the desktop and mobile PNG previews for visual verification.
- A Stripo organization with MCP enabled, its OAuth client ID, and access to the intended project.
- Network access to Stripo MCP and the temporary download/upload URLs returned by its tools.

The SDK is included: installing this plugin does not require the private `convo-email-agent`
repository or an npm install inside the plugin. The documented Business Profile email workflow
does not require Python or browser-runtime setup.

Keep the complete `plugins/stripo/` package together. Copying only `skills/` loses the sibling
`packages/` directory and breaks the SDK runners.

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

The same from a terminal, which an agent can run when you ask it to install the plugin:

```bash
claude plugin marketplace add stripoinc/agent-plugin
claude plugin install stripo@stripo
```

Third-party marketplaces do not update on their own: turn on
[automatic updates](#automatic-updates) for `stripo` right after installing.

In a terminal, connect the MCP server using your organization's client ID. `--scope user` makes
it available in every project, like the plugin; without it the server is registered only for the
current project:

```bash
claude mcp add-json --scope user stripo-mcp '{"type":"http","url":"https://mcp.stripo.email/mcp","oauth":{"clientId":"<CLIENT_ID>","callbackPort":8080,"scopes":"mcp:tools"}}'
```

If you added the server earlier without `--scope`, remove that entry first in the project where
you added it: `claude mcp remove stripo-mcp -s local`.

Open `/mcp` in Claude Code and complete the browser login. Run `/reload-plugins` or start a new
session to load the installed skills. Invoke them with the `stripo:` prefix, for example
`/stripo:email-model-editor`.

### Codex

```bash
codex plugin marketplace add stripoinc/agent-plugin
codex plugin add stripo@stripo
```

Add the server to `~/.codex/config.toml`, substituting your organization's client ID. This setup
uses the `mcp-remote` bridge through `npx` (included with npm). The bridge handles your OAuth
login, so its version is pinned; raise it deliberately:

```toml
[mcp_servers.stripo-mcp]
command = "npx"
args = ["-y", "mcp-remote@0.14.3", "https://mcp.stripo.email/mcp", "3334", "--static-oauth-client-info", "{\"client_id\":\"<CLIENT_ID>\"}", "--static-oauth-client-metadata", "{\"scope\":\"mcp:tools offline_access\"}"]
startup_timeout_sec = 60
```

On its first start the bridge opens the browser login. Start a new Codex session and invoke a
skill by its plugin-prefixed name, for example `$stripo:email-model-editor`. For this bridge
setup, complete login through the bridge; `codex mcp login` is for directly configured HTTP
servers.

### Other agents

Any agent that loads skills in the `SKILL.md` format can use the package from a checkout. There
is no native installer for these agents, so check the result in yours before relying on it.

Clone the repository to a permanent location and place the package in the directory that holds
your agent's `skills/` folder (`<agent-dir>` below; your agent's documentation names it). The
skills, `packages/`, `mcp-tools.json` and `bundle.json` must end up side by side:

```bash
git clone https://github.com/stripoinc/agent-plugin.git
cd agent-plugin/plugins/stripo
ln -s "$PWD"/skills/* <agent-dir>/skills/
ln -s "$PWD/packages" "$PWD/mcp-tools.json" "$PWD/bundle.json" <agent-dir>/
```

Copy the same entries instead when the agent does not follow links; if its folder is then not
named `skills`, set `CONVO_EMAIL_AGENT_SDK_PATH` to
`<agent-dir>/packages/convo-email-agent/index.js`. An installer that copies only the skill
folders leaves the SDK behind.

Connect the Stripo MCP server under the name `stripo-mcp`: the URL is
`https://mcp.stripo.email/mcp`, with OAuth using your organization's client ID and the
`mcp:tools` scope. An agent without OAuth support for remote MCP servers can run the
`mcp-remote` bridge with the command and arguments shown for Codex.

### Verify the installation

Check the tools on the machine where the agent runs:

```bash
node --version
curl --version
```

For Claude Code, use `claude plugin list` and `claude mcp get stripo-mcp`.
For Codex, use `codex plugin list` and `codex mcp get stripo-mcp`.
In another agent, list its skills and MCP servers the way it provides.
These commands inspect configuration; they do not prove successful authorization.

In a new agent session, ask: **"Use Stripo MCP's `whoami` tool to verify my connection without
changing anything."** Confirm the returned account before working with a project. If this
fails, finish MCP setup before invoking an editing skill.

## Update or uninstall

Refresh the marketplace and update the installed plugin, then start a new session (in Claude
Code, `/reload-plugins` also applies the update):

| Agent | Update | Uninstall |
| --- | --- | --- |
| Claude Code | `claude plugin marketplace update stripo`, then `claude plugin update stripo@stripo` | `claude plugin uninstall stripo@stripo` |
| Codex | `codex plugin marketplace upgrade stripo` (it also reinstalls the plugin) | `codex plugin remove stripo@stripo` |
| Other agents | `git pull` in the checkout; copy the entries again if you copied them | Remove the links or copies, then the checkout |

Use the same installation scope that you selected initially. To remove the catalog as well,
run `claude plugin marketplace remove stripo` or `codex plugin marketplace remove stripo`.
The manually configured MCP connection is separate: remove it with
`claude mcp remove stripo-mcp` or `codex mcp remove stripo-mcp` when it is no longer needed.

### Automatic updates

Codex refreshes configured Git marketplaces in the background each time it starts and reinstalls
their plugins when a marketplace changed, so a release is active from the next start at the
latest.

Claude Code does not auto-update third-party marketplaces by default. Turn it on for `stripo` in
`/plugin` → **Marketplaces** → `stripo` → **Enable auto-update**, or declare it in
`~/.claude/settings.json`. On a machine without the plugin the same block also installs it when
the next interactive session starts:

```json
{
  "extraKnownMarketplaces": {
    "stripo": {
      "source": {"source": "github", "repo": "stripoinc/agent-plugin"},
      "autoUpdate": true
    }
  },
  "enabledPlugins": {"stripo@stripo": true}
}
```

If `settings.json` already has these keys, merge the entries instead of replacing the file. After
an install through this block the skills appear in that session, but `claude plugin list` may
show the plugin only after a later one. Claude Code checks for updates in the background of an
interactive session, within about ten minutes of your first message; the running session keeps
its loaded version until `/reload-plugins` or the next session.

## Troubleshooting

| Symptom | What to check |
| --- | --- |
| Marketplace or plugin command is unknown | Update the agent to a version with plugin support. |
| Skills do not appear, or an old version is still active | Confirm the plugin is installed and enabled, update it, and run `/reload-plugins` (Claude Code) or start a new session. `claude plugin list` or `codex plugin list` prints the installed version; the released one is `version` in [`plugin-metadata.json`](plugin-metadata.json). |
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
without writing and names the packaged files that differ from the inventory; `npm run generate`
updates the integrity inventory, so review every packaged file change rather than using
generation to accept unexplained edits or deletions. Validation also rejects any file in
`plugins/stripo/` that is neither inventoried nor a generated manifest, such as a stray
`hooks/` directory or `.mcp.json`, because hosts load those from the plugin root.

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
files, the exact packaged file set, skill frontmatter, declared package paths, MCP tool mappings,
the format of bundle provenance and its agreement with the packaged SDK contract, and SDK
loading from an isolated installed copy. PRs changing the bundle, metadata, host files or
packaging tools require a higher version. CI needs no private checkout, MCP account or OAuth
credentials. These checks do not verify live MCP persistence or OAuth; exercise those separately
in each supported agent before releasing changes that affect them.

## Format references

- [Claude plugin marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)
- [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins)
- [OpenAI skill MCP dependencies](https://developers.openai.com/plugins/build/skills#connect-skills-to-mcp-tools)

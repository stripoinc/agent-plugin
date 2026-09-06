# Stripo agent plugin

Marketplace repository for the `stripo` plugin: the `email-model-editor` and `email-from-reference`
skills, the convo-email-agent SDK they run on, and the connection to the Stripo MCP server. One
plugin directory serves both Claude Code and Codex.

## Install

The machine that runs the agent needs Node.js 20+ and `curl`.

### Claude Code

```text
/plugin marketplace add stripoinc/agent-plugin
/plugin install stripo@stripo
/mcp
```

`/mcp` opens the browser login for the Stripo MCP server. The skills appear as
`stripo:email-model-editor` and `stripo:email-from-reference`.

### Codex

```bash
codex plugin marketplace add stripoinc/agent-plugin
codex plugin add stripo@stripo
```

Authorization starts on install. If it does not, run
`codex mcp login stripo --scopes mcp:tools,offline_access`. The skills are invoked as
`$email-model-editor` and `$email-from-reference`.

## Layout

```text
.claude-plugin/marketplace.json     Claude Code marketplace
.agents/plugins/marketplace.json    Codex marketplace
plugins/stripo/                     the plugin
  .claude-plugin/plugin.json        Claude Code manifest; version written by the sync script
  .codex-plugin/plugin.json         Codex manifest; version written by the sync script
  .mcp.json                         Stripo MCP server
  skills/<skill>/                   synced from convo-email-agent, plus HOST.md
  packages/convo-email-agent/       synced SDK; must stay next to skills/
  mcp-tools.json                    synced tool mapping
  bundle.json                       synced build provenance (version, source commit)
host/HOST.md                        host notes installed beside each skill by the sync script
scripts/sync-bundle.mjs             sync script
```

`skills/` and `packages/` must stay siblings: every runner locates the SDK at
`skills/<skill>/scripts/../../../packages/convo-email-agent/index.js`. Both hosts copy the whole
plugin directory into their cache, so the layout survives installation.

## Updating the plugin

1. In `convo-email-agent`, commit the changes and run `npm run build:stripo`. The resulting
   `dist/convo-email-agent/stripo/bundle.json` must report `sourceDirty: false`.
2. In this repository run:

   ```bash
   node scripts/sync-bundle.mjs
   ```

   `--bundle <dir>` points at another bundle location. `--version <x.y.z>` sets the plugin
   version for a plugin-only release (for example a `HOST.md` change without a new bundle); by
   default the plugin takes the bundle version. The script refuses a dirty bundle and an
   unchanged version, because installed copies update only when the version changes.
3. Review `git diff`, commit and push.

Local check before pushing:

```bash
claude plugin marketplace add /path/to/agent-plugin
```

```bash
codex plugin marketplace add /path/to/agent-plugin
```

## Before the first publication

- Put the production MCP URL into `plugins/stripo/.mcp.json`.
- Either register a public OAuth client for the plugin and set `oauth.clientId`, or enable dynamic
  client registration on the production Keycloak and remove the `oauth` block. The sync script
  warns while placeholders remain.
- Choose a license and add `license` to both plugin manifests.

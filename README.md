# Stripo agent plugin

Marketplace repository for the `stripo` plugin: six skills, the convo-email-agent SDK and Brand Kit
runtime they run on, and the connection to the Stripo MCP server. One plugin directory serves both
Claude Code and Codex.

| Skill | What it does |
| --- | --- |
| `email-model-editor` | Bounded copy, link, image and style edits to an existing email or template |
| `email-from-reference` | A new email from a description, an existing email, HTML or a screenshot |
| `brandkit-extraction-v-0` | Browses a website and saves the extracted Brand Kit to a project |
| `brandkit-tone-of-voice-v-0` | Derives `brand.brandVoice`; a satellite of the extraction skill |
| `brandkit-business-context-v-0` | Derives `brand.businessContext`; a satellite of the extraction skill |
| `brandkit-updater` | Reconciles a project's Brand Kit against the account's own emails |

## Install

The machine that runs the agent needs Node.js 20+ and `curl`. The email skills and
`brandkit-updater` need nothing else.

### Claude Code

```text
/plugin marketplace add stripoinc/agent-plugin
/plugin install stripo@stripo
/mcp
```

`/mcp` opens the browser login for the Stripo MCP server. The skills appear under the `stripo:`
prefix, for example `stripo:email-model-editor`.

### Codex

```bash
codex plugin marketplace add stripoinc/agent-plugin
codex plugin add stripo@stripo
```

Authorization starts on install. If it does not, run
`codex mcp login stripo --scopes mcp:tools,offline_access`. The skills are invoked by name, for
example `$email-model-editor`.

### Brand Kit extraction

`brandkit-extraction-v-0` browses live websites, so it carries prerequisites the other skills do
not. Install them once, then read the skill's `HOST.md` for the rest of the contract:

```bash
python3 -m pip install -r <plugin-root>/packages/brandkit-runtime/requirements.txt
```

Use Python 3.11 or 3.12. On 3.13 and newer the Brand Kit runtime fails to import: a docstring in
`validation.py` holds an unpaired `\ud800` escape those versions refuse to compile. The email
skills and `brandkit-updater` are unaffected — they run no Python.

```bash
cd <plugin-root>/skills/brandkit-extraction-v-0/scripts && npm install && npx playwright install chromium
```

It also needs a browser route, because it never dials a target directly: either
`BRANDKIT_BROWSER_PROXY_URL` pointing at an HTTP proxy this machine may use, or
`BROWSERBASE_API_KEY` and `BROWSERBASE_PROJECT_ID`. Logo hosting and the Phase 5 read-back stay
unavailable in these hosts — the skill's `HOST.md` says what that changes in a run.

## Layout

```text
.claude-plugin/marketplace.json     Claude Code marketplace
.agents/plugins/marketplace.json    Codex marketplace
plugins/stripo/                     the plugin
  .claude-plugin/plugin.json        Claude Code manifest; version written by the sync script
  .codex-plugin/plugin.json         Codex manifest; version written by the sync script
  .mcp.json                         Stripo MCP server
  skills/<skill>/                   synced from convo-email-agent, plus the host files
  packages/convo-email-agent/       synced SDK; must stay next to skills/
  packages/brandkit-runtime/        synced Brand Kit finalizer (Python)
  mcp-tools.json                    synced tool mapping
  bundle.json                       synced build provenance (version, source commit)
host/HOST.md                        default host notes, installed beside every skill without an overlay
host/<skill>/                       per-skill overlay: HOST.md plus helpers the skill calls by path
scripts/sync-bundle.mjs             sync script
```

`skills/` and `packages/` must stay siblings: every runner locates the SDK at
`skills/<skill>/scripts/../../../packages/convo-email-agent/index.js`, and the Brand Kit finalizer
locates its runtime the same way. Both hosts copy the whole plugin directory into their cache, so
the layout survives installation.

The bundle owns everything under `skills/` and `packages/`; the repository owns `host/`. A skill
with a `host/<skill>/` directory gets it copied over the synced skill — that is how the brandkit
skills receive the `HOST.md` they refuse to run without, and the helpers they call by path
(`upload_via_proxy.sh`, `download_via_proxy.sh`). Every other skill gets the shared
`host/HOST.md`.

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

# Stripo agent plugin

Marketplace repository for the `stripo` plugin.

## Install

The plugin ships no MCP configuration, because the OAuth client is issued per organization: each
host adds the server itself, with the same commands Stripo's MCP setup instructions give.
`<CLIENT_ID>` below is the organization's OAuth client id; it comes from the Stripo account once
MCP is enabled for the organization. Name the server `stripo-mcp`.

### Claude Code

```text
/plugin marketplace add stripoinc/agent-plugin
/plugin install stripo@stripo
```

```bash
claude mcp add-json stripo-mcp '{"type":"http","url":"https://mcp.stripo.email/mcp","oauth":{"clientId":"<CLIENT_ID>","callbackPort":8080,"scopes":"openid profile email mcp:tools"}}'
```

`/mcp` then opens the browser login for the Stripo MCP server. The skills appear under the
`stripo:` prefix, for example `stripo:email-model-editor`.

### Codex

```bash
codex plugin marketplace add stripoinc/agent-plugin
codex plugin add stripo@stripo
```

Add the server to `~/.codex/config.toml`. Codex reaches it through the `mcp-remote` bridge:

```toml
[mcp_servers.stripo-mcp]
command = "npx"
args = ["-y", "mcp-remote", "https://mcp.stripo.email/mcp", "3334", "--static-oauth-client-info", "{\"client_id\":\"<CLIENT_ID>\"}", "--static-oauth-client-metadata", "{\"scope\":\"openid profile email mcp:tools\"}"]
startup_timeout_sec = 60
```

On its first start the bridge opens the browser login for the Stripo MCP server. The skills are
invoked by name, for example `$email-model-editor`.

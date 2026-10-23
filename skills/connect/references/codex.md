# Codex

Inspect `mcp_servers.stripo-mcp` in `$CODEX_HOME/config.toml`, or `~/.codex/config.toml` when
unset, plus any current project override. The native Client ID is `oauth.client_id`; `codex mcp
get stripo-mcp` does not display it. Preserve the selected ID before changing configuration.

Edit only that server's user-scope entry, including obsolete transport-specific sub-tables.
Keep all other servers/settings. A correct entry explicitly disabled with `enabled = false`
needs enabling before it is usable. Use the host's approval flow for the settings write.

```toml
[mcp_servers.stripo-mcp]
url = "https://mcp.stripo.email/mcp"
scopes = ["mcp:tools", "offline_access"]
enabled = true

[mcp_servers.stripo-mcp.oauth]
client_id = "<CLIENT_ID>"
```

After saving, remove only the corresponding entry from a current project configuration that
overrides it. Verify the effective connection and saved Client ID. Do not run `codex mcp add
--oauth-client-id` inside the agent session: it starts browser sign-in immediately.

If login is needed, tell the user to run this in a terminal or choose **Authenticate** for
`stripo-mcp` in the app, then start a new session:

```sh
codex mcp login stripo-mcp --scopes mcp:tools,offline_access
```

Do not run login yourself. Recheck `whoami` once tools are available.

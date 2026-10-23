# Cursor

Inspect the global `~/.cursor/mcp.json` and current project's `.cursor/mcp.json`. Reuse the native
`auth.CLIENT_ID` or recover the saved ID from the bridge arguments. Edit the global entry unless
the user requests project scope, preserving every other server. Use the host's approval flow if
the settings file is outside the writable workspace.

```json
{
  "mcpServers": {
    "stripo-mcp": {
      "url": "https://mcp.stripo.email/mcp",
      "auth": {
        "CLIENT_ID": "<CLIENT_ID>",
        "scopes": ["mcp:tools", "offline_access"]
      }
    }
  }
}
```

Check for a project entry overriding the edited global entry. Verify the effective settings;
then ask the user to restart/reload Cursor and complete the server's OAuth flow. Do not start
browser login yourself. Confirm access with `whoami` when tools become available.

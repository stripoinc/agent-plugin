# VS Code / GitHub Copilot

Inspect the user-level `mcp.json` opened by **MCP: Open User Configuration** and the workspace's
`.vscode/mcp.json`. Typical user locations are `~/Library/Application Support/Code/User/mcp.json`
on macOS, `~/.config/Code/User/mcp.json` on Linux and `%APPDATA%\Code\User\mcp.json` on Windows.
Reuse `oauth.clientId` or the saved bridge ID. The native field is supported from VS Code 1.123.

Edit the user-level entry unless the user requests workspace scope; preserve other servers:

```json
{
  "servers": {
    "stripo-mcp": {
      "type": "http",
      "url": "https://mcp.stripo.email/mcp",
      "oauth": {"clientId": "<CLIENT_ID>"}
    }
  }
}
```

VS Code reads scopes from the server. Check for a workspace override, verify the saved entry,
and tell the user to reload and authenticate the MCP connection. Do not start sign-in yourself.
Confirm access with `whoami` when tools become available.

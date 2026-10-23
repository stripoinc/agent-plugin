# Other MCP clients

Reuse the saved Client ID and configure a user-level HTTP server using the settings in
[connect](../SKILL.md). If the agent cannot write its own settings, give the user those values.
Use its built-in OAuth flow and reload instructions; never infer credentials or sign in for the user.

For a client without OAuth support for remote servers, an optional stdio bridge is available:

```sh
npx -y mcp-remote@0.14.3 https://mcp.stripo.email/mcp 3334 \
  --static-oauth-client-info '{"client_id":"<CLIENT_ID>"}' \
  --static-oauth-client-metadata '{"scope":"mcp:tools offline_access"}'
```

Configure this as the client's server command; do not launch it during inspection. It requires
Node.js 18+ and downloads the pinned bridge package. The first start opens browser login for the
user. Do not add a bridge when a working native HTTP connection exists.

---
name: connect
description: Connect this agent to the Stripo MCP server with the organization's Client ID, or check an existing connection. Use when Stripo MCP is missing, unauthenticated or rejecting calls, when the user supplies a Stripo Client ID, or during plugin setup. Supports Claude Code, Codex, Cursor, VS Code and other MCP clients. Never signs in on the user's behalf.
allowed-tools: Bash(claude mcp add:*), Bash(claude mcp get:*), Bash(claude mcp list:*), Bash(claude mcp remove:*), Bash(codex mcp get:*), Bash(codex mcp list:*)
---

# Connect Stripo MCP

Stripo uses an organization's pre-registered OAuth client. Register the connection in the current
agent; the plugin itself carries no server entry or credentials.

| Setting | Value |
| --- | --- |
| Server name | `stripo-mcp` |
| URL | `https://mcp.stripo.email/mcp` (streamable HTTP) |
| OAuth client | Organization Client ID; public client, no secret |
| Scopes | `mcp:tools` and `offline_access` |

Read only the current host's setup instructions:

- [Claude Code](references/claude-code.md)
- [Codex](references/codex.md)
- [Cursor](references/cursor.md)
- [VS Code / GitHub Copilot](references/vscode.md)
- [Other MCP clients and the optional bridge](references/other-agents.md)

1. Inspect only the relevant connection fields and scopes. Recover the saved Client ID from the
   effective connection, including an existing bridge's `--static-oauth-client-info` argument.
   An ID explicitly supplied for this connection takes precedence. Never dump whole configuration
   files or token stores into the conversation.
2. Reuse that ID without asking for it again. In Claude Code, also check the configured
   `${user_config.client_id}` value; empty values and literal placeholders are not IDs. If no ID
   is available, ask for it: a workspace Owner or Admin copies it from **Workspace Settings → MCP
   integration** after turning on **Connect AI tools**. Stop until it is supplied.
3. Keep a matching enabled connection. If its tools are available, call `whoami`; successful
   identity/access verification completes setup without another login. For a missing or mismatched
   entry, follow the host reference, changing only `stripo-mcp`. Explain any scope migration and
   save the selected Client ID before removing an override. Preserve every unrelated setting.
4. Verify the saved configuration, then give the host's sign-in/reload instructions when needed.
   Do not start browser login yourself. A saved configuration is not proof of authentication;
   confirm access with `whoami` once the host exposes the tools.

Never request, print or store tokens. Keep the Client ID only in the agent's MCP configuration,
not public repositories or temporary scripts. Respect the host's permission flow for settings
writes and report a failed or blocked change accurately.

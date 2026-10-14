---
name: connect
description: Connect this agent to the Stripo MCP server (stripo-mcp) with the organization's Client ID, or check an existing connection. Use when stripo-mcp is missing, not authenticated or rejecting calls, when the user shares a Stripo Client ID, or before the first Stripo task after installing the plugin. Never signs in on the user's behalf.
allowed-tools: Bash(claude mcp add:*), Bash(claude mcp get:*), Bash(claude mcp list:*), Bash(claude mcp remove:*), Bash(codex mcp get:*), Bash(codex mcp list:*)
---

# Connect Stripo MCP

The Stripo plugin ships no MCP server entry, because Stripo authenticates every organization
with its own pre-registered OAuth client. This skill registers the server in the agent that runs
it and hands the browser sign-in to the user.

| Setting | Value |
| --- | --- |
| Server name | `stripo-mcp` |
| URL | `https://mcp.stripo.email/mcp` (streamable HTTP) |
| OAuth client | the organization's Client ID, a public client without a secret |
| Scopes | `mcp:tools` and `offline_access` |

Rules: change nothing except the `stripo-mcp` entry. Never start the OAuth sign-in yourself, and
never ask for, print or store tokens. The Client ID is not a password, but keep it out of files
other than the agent's own MCP configuration, and out of public repositories.

## 1. Inspect the existing connection

- Claude Code: run `claude mcp get stripo-mcp` to identify the effective entry and its scope.
  Inspect the `stripo-mcp` entries in the user/local configuration (`~/.claude.json`, or
  `$CLAUDE_CONFIG_DIR/.claude.json` when that directory is set) and the project's `.mcp.json`.
  The native Client ID is `oauth.clientId`; local and project entries override a user entry.
- Codex: run `codex mcp get stripo-mcp`, then inspect `mcp_servers.stripo-mcp` in the user
  configuration (`$CODEX_HOME/config.toml` when set, otherwise `~/.codex/config.toml`) and any
  project configuration overriding it. The native Client ID is `oauth.client_id`; `mcp get`
  does not display it.
- Other agents: inspect the existing server in the agent's MCP settings.
- For an existing `mcp-remote` entry, recover `client_id` from its
  `--static-oauth-client-info` argument. Read only the relevant connection fields; never dump
  configuration files or token stores into the conversation.

## 2. Reuse the saved Client ID

Use the Client ID already saved for this Stripo connection without asking the user to provide
it again, including when migrating a local/project entry or an `mcp-remote` bridge. Prefer the
effective entry's ID when multiple scopes exist. A replacement ID explicitly supplied by the
user for this connection takes precedence; do not change organizations based on an unrelated ID.

If no connection has a saved ID, use the plugin's configured value (Claude Code only):
`${user_config.client_id}`. An empty value or the literal placeholder is not an ID.
Only when neither the existing connection nor the plugin nor the user supplies an ID, ask for
it: a workspace Owner or Admin copies it from Stripo **Workspace Settings → MCP integration**
(turn on *Connect AI tools* first), and other members ask them. Stop until you have it.

A user-scope HTTP entry with this URL, the selected ID and no local/project override needs no
configuration change.
If its tools are already available, call `whoami` and report the account/workspace; a successful
call completes this skill without another login. Otherwise continue with step 4. For other
entries, explain the migration to user scope before step 3.

## 3. Register the server (pick the host you run in)

**Claude Code**: the target scope is always **user**. Preserve the selected Client ID before
changing any entry. Keep a matching user entry; otherwise replace only the user entry and add
the HTTP server with the saved ID:

```bash
claude mcp remove stripo-mcp --scope user   # only when an existing user entry needs replacement
claude mcp add --transport http --scope user --client-id '<CLIENT_ID>' stripo-mcp https://mcp.stripo.email/mcp
```

After the user entry is saved, remove each `stripo-mcp` override found in the current project's
local and project scopes. Do not recreate it at either scope:

```bash
claude mcp remove stripo-mcp --scope local     # only if a local entry exists
claude mcp remove stripo-mcp --scope project   # only if a project entry exists
claude mcp get stripo-mcp
```

Verify that the effective entry now reports **User config**, HTTP and the Stripo URL, and that
the user configuration retains the selected Client ID. If an overriding entry cannot be removed,
report that remaining blocker instead of claiming the connection was migrated.

**Codex**: edit the user configuration located in step 1 (create it when missing). Replace only
the `mcp_servers.stripo-mcp` entry, including its `oauth` and obsolete transport-specific
sub-tables; preserve all other server entries and settings. After saving, remove only the
corresponding entry from any project configuration that
overrides it, and verify the effective entry uses the user configuration and the saved ID.
Use the host's approval flow if it requires approval for the configuration write. Do not use
`codex mcp add --oauth-client-id` from inside a session: it starts a browser sign-in at once,
which cannot complete from a sandboxed agent.

```toml
[mcp_servers.stripo-mcp]
url = "https://mcp.stripo.email/mcp"
scopes = ["mcp:tools", "offline_access"]

[mcp_servers.stripo-mcp.oauth]
client_id = "<CLIENT_ID>"
```

**Other agents**: add a user-level HTTP MCP server named `stripo-mcp` with the URL above, the saved
Client ID as a pre-registered OAuth client without a secret, and the scopes `mcp:tools offline_access`, in the
agent's own MCP settings. When the agent cannot write its settings, give the user these values.
An agent without OAuth support for remote servers can run the bridge as a local stdio server
(Node.js 18 or later): `npx -y mcp-remote@0.14.3 https://mcp.stripo.email/mcp 3334 --static-oauth-client-info '{"client_id":"<CLIENT_ID>"}' --static-oauth-client-metadata '{"scope":"mcp:tools offline_access"}'`.

## 4. Hand over the sign-in

Tell the user what to do next; do not run it:

- Claude Code: exit and start Claude Code again, run `/mcp`, select `stripo-mcp`, choose
  **Authenticate**, and sign in to Stripo in the browser. On a machine without a browser:
  `claude mcp login stripo-mcp --no-browser`.
- Codex: run `codex mcp login stripo-mcp --scopes mcp:tools,offline_access` in a terminal, or
  choose **Authenticate** next to `stripo-mcp` in the Codex app's MCP settings, then start a new
  session.
- Other agents: start the server or connection and complete the browser sign-in it opens.

## 5. Verify

In the new session, call `whoami` on `stripo-mcp` without changing anything and report the
account and workspace it returns. "Client not found" on the sign-in page means a wrong, stale or
regenerated Client ID: explain that the saved ID was rejected and use a replacement when the
user supplies one. A tool call refused with a plan message means the
organization's Stripo plan does not include MCP integration.

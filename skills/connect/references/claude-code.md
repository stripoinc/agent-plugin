# Claude Code

Inspect `stripo-mcp` in `~/.claude.json` (or `$CLAUDE_CONFIG_DIR/.claude.json`) and the current
project's `.mcp.json`. Local/project entries override user entries. Read `oauth.clientId` for a
native HTTP entry or the static OAuth argument for an `mcp-remote` bridge. Inspect configuration
before running `claude mcp get`: that command can start a configured stdio bridge.

The target scope is user. Keep a matching user HTTP entry with the selected Client ID. Otherwise:

```sh
claude mcp remove stripo-mcp --scope user  # only if a mismatched user entry exists
claude mcp add --transport http --scope user --client-id '<CLIENT_ID>' stripo-mcp https://mcp.stripo.email/mcp
```

After saving the user entry, remove only the overrides found for this server in the current project:

```sh
claude mcp remove stripo-mcp --scope local    # only if present
claude mcp remove stripo-mcp --scope project  # only if present
claude mcp get stripo-mcp
```

Verify HTTP, the Stripo URL, **User config**, and the retained Client ID. An override that could
not be removed is a remaining blocker. If authentication is needed, tell the user to restart
Claude Code, open `/mcp`, select `stripo-mcp` and authenticate in the browser. For a machine without
a browser, the user can run `claude mcp login stripo-mcp --no-browser`. Do not run sign-in yourself.

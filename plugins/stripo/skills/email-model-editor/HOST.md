# Host notes: Claude Code and Codex

This skill is installed by the Stripo plugin. Both hosts run the skill runners with their shell
tool and move files with `curl`. The machine needs Node.js 20+ and `curl` on `PATH`.

## Paths

- Claude Code substitutes `<skill-dir>` and `<bundle-root>` in `SKILL.md` with absolute paths.
- Codex lists the path of `SKILL.md` with the skill; `<skill-dir>` is its directory.
- In both hosts `<bundle-root>` is two levels above `<skill-dir>`: it holds `skills/`,
  `packages/` and `mcp-tools.json`. Keep that layout; the runners locate the SDK through it.

## Working directory

Create a fresh temporary directory per task (`mktemp -d`) and keep every file there: the
downloaded schema, the untouched model, the change module or brief, the candidate, the
diagnostics and the PNG previews. Do not write these files into the user's project.

## Download: schema, model, screenshots

```bash
curl -fsSL --retry 2 -o <file> '<downloadUrl>'
```

Download URLs are temporary. If a download fails after the URL expired, request a new one through
the same MCP tool. Refresh a schema file older than one hour.

## Upload: candidate model

1. `prepare_document_state_upload(id, type)` returns `uploadUrl`, `uploadId` and `maxBytes`.
   Check the candidate size against `maxBytes` first (`wc -c <candidate.json>`).
2. Upload with the method the tool returned. The current presigned URL is a plain `PUT` with no
   extra headers:

   ```bash
   curl -fsS -X PUT --upload-file <candidate.json> '<uploadUrl>'
   ```

3. `set_document_state(id, type, uploadId)`.

`uploadId` is single-use and short-lived. If the `PUT` fails, or it is unclear whether
`set_document_state` consumed the ticket, do not retry the same ticket: read the state back and,
only if the change is missing, start again from step 1.

## Authentication

MCP access is authorized once per host through OAuth (Claude Code: `/mcp`; Codex: the browser
login the `mcp-remote` bridge opens on its first start, or `codex mcp login stripo-mcp` for a
server configured by `url`). Never paste tokens or credentials into the conversation, runner
arguments or files.

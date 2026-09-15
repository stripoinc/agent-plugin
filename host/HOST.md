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
untouched model, the change module or brief, the candidate, the diagnostics and the PNG
previews. Do not write these files into the user's project.

## Validation

The SDK bundles the editor's executable Document State validator. The runners need no schema
download or `--schema` argument. `get_document_state_schema()` is available for field
documentation; validation uses the editor revision recorded in `bundle.json.editorValidator`.
The service validates and applies each write against its live state, so follow the rejection
diagnostics in `PROVIDER.md` and verify the saved model after writing.

## Download: model, screenshots

```bash
curl -fsSL --retry 2 -o <file> '<downloadUrl>'
```

Download URLs are temporary. If a download fails after the URL expired, request a new one through
the same MCP tool.

## Upload: candidate and base models

1. `prepare_document_state_upload(id, type)` returns `uploadUrl`, `uploadId` and `maxBytes` for
   one file. An edit or a rebuild of an existing letter needs two tickets: one for the candidate
   and one for the base, the untouched file `get_document_state` was downloaded to. A freshly
   created email built from a brief has no base and needs one ticket. Check the sizes against
   `maxBytes` first (`wc -c <candidate.json> <downloaded-model.json>`); with a base, both files
   together must fit.
2. Upload each file to its own `uploadUrl` with the method the tool returned. The current
   presigned URL is a plain `PUT` with no extra headers:

   ```bash
   curl -fsS -X PUT --upload-file <candidate.json> '<candidate uploadUrl>'
   curl -fsS -X PUT --upload-file <downloaded-model.json> '<base uploadUrl>'
   ```

3. `set_document_state(id, type, uploadId=<candidate ticket>, baseUploadId=<base ticket>)`, or
   `set_document_state(id, type, uploadId)` without a base. Never swap the two ids.

Tickets are single-use and short-lived. If a `PUT` fails, or it is unclear whether
`set_document_state` consumed the tickets, do not retry the same ticket: read the state back and,
only if the change is missing, start again from step 1 with fresh tickets for both files.
`PROVIDER.md` describes the answers (`UPLOAD_NOT_FOUND` with `missingUploadId`,
`REVISION_CONFLICT`, `WRITE_UNCONFIRMED`, `MERGE_BROKEN`).

## Authentication

MCP access is authorized once per host through OAuth (Claude Code: `/mcp`; Codex: the browser
login the `mcp-remote` bridge opens on its first start, or `codex mcp login stripo-mcp` for a
server configured by `url`). Never paste tokens or credentials into the conversation, runner
arguments or files.

# Host notes

This skill is part of the Stripo agent plugin. These notes apply to any agent that loads it;
where Claude Code or Codex behave differently, they are named. The agent runs the skill runners
with its shell tool and moves files with `curl`. The machine needs Node.js 20.18.1+ and `curl`
on `PATH`.

## Paths

- Claude Code substitutes `<skill-dir>` and `<bundle-root>` in `SKILL.md` with absolute paths.
- In Codex and other agents `<skill-dir>` is the directory of the `SKILL.md` the agent loaded.
- In every agent `<bundle-root>` is two levels above `<skill-dir>`: it holds `skills/`,
  `packages/` and `mcp-tools.json`. Keep that layout; the runners locate the SDK through it.

## Plugin updates

Codex refreshes the plugin each time it starts. Claude Code updates it in the background only
when auto-update is enabled for the `stripo` marketplace. An agent that loads the skills from a
checkout of the plugin repository gets a new version only when that checkout is updated.

When a Stripo MCP call fails in a way `SKILL.md` and `PROVIDER.md` do not explain, such as an
unknown tool or parameter, or a rejection of a model the bundled validator accepted, the
installed plugin may be older than the service. Tell the user and offer to update it; run the
commands only with the user's consent:

- Claude Code: `claude plugin marketplace update stripo`, then `claude plugin update stripo@stripo`
  (add `--scope project` or `--scope local` for a plugin installed at that scope), then
  `/reload-plugins` or a new session.
- Codex: `codex plugin marketplace upgrade stripo`, then a new session.
- Other agents: `git pull` in the checkout of https://github.com/stripoinc/agent-plugin the
  skills were installed from (copy the package again if it was copied rather than linked), then
  a new session.

When the update reports that the plugin is already current, the failure has another cause:
report it as `SKILL.md` describes.

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

## Download: model, screenshots, generated images

```bash
curl -fsSL --retry 2 -o <file> '<downloadUrl>'
```

Model and screenshot download URLs are temporary. If a download fails after the URL expired,
request a new one through the same MCP tool. A completed image job's `image.url` is a hosted PNG;
download that URL to inspect it without starting another generation.

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

## Images

The email skills use `generate_image`, `edit_image`, and `get_image_job` on the connected Stripo
MCP server. Read `PROVIDER.md` for arguments, target selection, quota, polling, and recovery rules.
Verify that the selected server exposes all three tools; report a missing capability instead of
substituting another image provider. No separate image adapter or image-provider credentials are
required in this host.

Jobs belong to the target email/template. When a new email needs generated visuals, create it
once before starting the jobs and retain that same id through persistence and recovery. Poll
with the returned `jobId` and `pollAfterSeconds`; a repeated start is a new quota-consuming job.
Download and visually inspect a completed PNG using the download command above and the agent's
image-viewing tool. Insert its hosted `image.url` through the native model workflow without
reuploading or recompressing it. Generation alone does not place the image into the document.

Local asset and crop uploads remain unavailable. Image references and edit sources must already
be authorized public HTTPS URLs; the supported formats and limits are in `PROVIDER.md`.
Reuse suitable hosted assets and report a required visual that cannot be completed as `SKILL.md`
describes. Inspection-only email requests must not start image jobs.

## Authentication

MCP access is authorized once per agent through OAuth (Claude Code: `/mcp`; Codex: the browser
login the `mcp-remote` bridge opens on its first start, or `codex mcp login stripo-mcp` for a
server configured by `url`; other agents: their own login flow for the `stripo-mcp` server).
Never paste tokens or credentials into the conversation, runner arguments or files.

# Running the Stripo skills

Use the host's authenticated `stripo-mcp` connection and local shell/file/image tools. When the
connection is missing or unauthenticated, use [connect](../connect/SKILL.md). If several Stripo
environments are connected, resolve the intended one before reading or writing.

`<skill-dir>` is the directory containing the loaded `SKILL.md`; `<bundle-root>` is two levels
above it. In Claude Code these correspond to `${CLAUDE_SKILL_DIR}` and `${CLAUDE_PLUGIN_ROOT}`.
Keep `skills/` and `packages/` together: the runners resolve the bundled SDK through this layout.
Node.js 20.18.1+ and curl are required. `node <bundle-root>/scripts/doctor.mjs` checks prerequisites
without accessing credentials or contacting Stripo. No npm install is needed to use the skills.

Create a temporary task directory for the untouched model, mutation module or brief, candidate,
diagnostics and previews. Never modify the acquired base file. Download signed URLs there:

```sh
curl -fsSL --retry 2 -o <file> '<downloadUrl>'
```

Expired URLs need a fresh MCP result. MCP access does not imply shell network access; follow
[acquisition](reference/stripo-acquisition.md) when the download path is unavailable.

For model writes, follow [persistence](reference/stripo-persistence.md). Check file sizes against
the ticket's `maxBytes`, then upload each file to its own ticket using the returned method:

```sh
curl -fsS -X PUT --upload-file <candidate.json> '<candidate uploadUrl>'
curl -fsS -X PUT --upload-file <base.json> '<base uploadUrl>'
```

Do not swap candidate and base tickets. After an uncertain write, inspect fresh state before
retrying. The provider contract defines which tickets must be renewed for each failure.

Use [image upload](reference/image-upload.md) for supplied bytes and
[image jobs](reference/stripo-images.md) for `generate_image`, `edit_image` and `get_image_job`.
Use the host's image viewer to inspect completed images and saved desktop/mobile screenshots.

The SDK includes the pinned editor validator; its provenance is in `release.json.upstream` and
`packages/convo-email-agent/editor-validator/manifest.json`. No schema download is required.
The live server validates writes independently. Report its diagnostics and follow the documented
recovery path; local validation alone does not establish persistence or visual correctness.

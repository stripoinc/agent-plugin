# Running the Stripo skills

Use the host's authenticated `stripo-mcp` connection and local shell/file/image tools. If the
connection is missing or unauthenticated, explain that it must be configured or authorized in
the agent before calling Stripo tools. If several Stripo environments are connected, resolve
the intended one before reading or writing.

`<skill-dir>` is the directory containing the loaded `SKILL.md`; `<bundle-root>` is two levels
above it. In Claude Code these correspond to `${CLAUDE_SKILL_DIR}` and `${CLAUDE_PLUGIN_ROOT}`.
Keep `skills/` and `packages/` together: the runners resolve the bundled SDK through this layout.
Node.js 20.18.1+ is required. `node <bundle-root>/scripts/doctor.mjs` checks prerequisites
without accessing credentials or contacting Stripo. No npm install is needed to use the skills.

Create a temporary task directory for the untouched model, mutation module or brief, candidate,
diagnostics and previews. Never modify the acquired base file. Download signed URLs there:

```sh
node <bundle-root>/scripts/transfer.mjs download --url '<downloadUrl>' --output <file>
```

Use the exact URL returned by MCP, including its signed query. Stripo returns direct S3 links;
their origin differs from the MCP endpoint. The helper permits HTTPS on public addresses,
verifies TLS, refuses redirects and does not automatically retry. It never reads host OAuth
credentials or prints URLs or response bodies. Use it only for URLs returned by the selected
MCP connection or explicitly authorized for this task; it cannot prove a URL's account ownership.
Pass `--sha256 <expected hash>` when a download manifest supplies one. Downloads have a 64 MiB
ceiling, which `--max-bytes <n>` can lower. Successful output includes the byte count and SHA-256;
failed transfers leave an existing destination untouched.

Expired URLs need a fresh MCP result. MCP access does not imply shell network access; follow
[acquisition](reference/stripo-acquisition.md) when the download path is unavailable.

For model writes, follow [persistence](reference/stripo-persistence.md). Check file sizes against
the ticket's `maxBytes`, then upload each file to its own ticket using the returned method:

```sh
node <bundle-root>/scripts/transfer.mjs upload --url '<candidate uploadUrl>' --input <candidate.json> --max-bytes <candidate maxBytes> --method PUT
node <bundle-root>/scripts/transfer.mjs upload --url '<base uploadUrl>' --input <base.json> --max-bytes <base maxBytes> --method PUT
```

Uploads require the ticket's `maxBytes`; the helper also applies its 64 MiB ceiling. The default
content type is `application/json`. For images use the actual supported MIME type, for example
`--content-type image/png`, and the selected `uploads[]` entry's URL and byte limit. If MCP returns
required headers, save that exact object and pass `--headers-file <headers.json>`. Do not supply
OAuth, Cookie or Authorization headers. Uploads use raw file bytes and an exact Content-Length;
an empty S3 HTTP 200 response is valid. `transferred:true, persisted:false` confirms only the
file transfer: call `set_document_state`, `upload_image` or the appropriate MCP finalizer next.
For model edits, candidate, base and the server's JSON wrapper must together fit the server
limit; passing each file's transfer check does not establish that combined limit.

Do not swap candidate and base tickets. After an uncertain write, inspect fresh state before
retrying. The provider contract defines which tickets must be renewed for each failure.

Use [image upload](reference/image-upload.md) for supplied bytes and
[image jobs](reference/stripo-images.md) for `generate_image`, `edit_image` and `get_image_job`.
Use the host's image viewer to inspect completed images and saved desktop/mobile screenshots.

The SDK includes the pinned editor validator; its provenance is in `release.json.upstream` and
`packages/convo-email-agent/editor-validator/manifest.json`. No schema download is required.
The live server validates writes independently. Report its diagnostics and follow the documented
recovery path; local validation alone does not establish persistence or visual correctness.

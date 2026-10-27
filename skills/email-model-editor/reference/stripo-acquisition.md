# Stripo acquisition and transfers

## Reference and target

Accept an email/template ID or a reference link. Extract an unambiguous ID and entity kind from
the link; ask when either is unclear. Keep `(id, type)` together on every call: `type` is `EMAIL`
or `TEMPLATE` for document/preview tools and lowercase for `get_content`. A reference identifies
source material; only an explicit edit/rebuild request makes it the write target.

Read the destination project's Business Profile with `get_business_profile(projectId)`; for
creation/rebuilds, follow the shared reference regime: call it during RESOLVE for Tailored and
Creative, and only for missing or ambiguous required source facts in Exact. The profile is
scoped to one project, and `businessProfileId: null` means the project has none and
`businessProfile` carries defaults only. Its brand, contacts, socials, important links and
languages are authorized facts. Derive whatever it does not carry — colors, fonts, assets, layout,
identity, destinations and footer content — from the designated reference model and its previews;
for an existing target, its own model can serve as the reference. There are no sending-interface
tools.

Never write the Business Profile from these skills: do not call `patch_business_profile`,
`replace_business_profile` or `prepare_business_profile_upload`. When the project has no
profile, continue from the reference.

Acquire the reference/target with `get_document_state(id, type)`; it returns a temporary
`downloadUrl`, download to a local JSON file and keep that file unmodified: it is the base the
write uploads next to the candidate (see [persistence](stripo-persistence.md)). Require
`status=OK`; a missing, inaccessible or broken model is not an empty reference. The runners
validate with the editor rules bundled in the SDK. `get_document_state_schema()` remains
available for field documentation.

Use `get_content(id, type, includeHtml=false)` for name and project/folder metadata.
Use `get_screenshot(id, type, mode="BOTH")` for reference and final desktop/mobile inspection.

For a reference whose native model is unavailable, `get_content(id, type, includeHtml=true)`
returns a temporary `htmlUrl`; it does not promise a separate CSS artifact. Respect access errors.
Do not use quota-consuming `export_to_html` as routine model-write verification.

## Transfers

Transfer signed URLs with the desktop plugin's installed helper unless `HOST.md` installs another
authorized binding. This bundle does not ship the helper itself:

```bash
node <bundle-root>/scripts/transfer.mjs download --url '<downloadUrl>' --output <local-file>
node <bundle-root>/scripts/transfer.mjs upload --url '<uploadUrl>' --input <local-file> --max-bytes <ticket maxBytes> --method PUT
```

Pass the exact signed URL, including its query, without OAuth, Cookie or Authorization headers.
These are direct public HTTPS/S3 transfers; their origin differs from the MCP endpoint. The
helper verifies TLS, refuses redirects and non-public destinations, applies a 64 MiB ceiling
that `--max-bytes` can lower, never retries automatically, and leaves an existing destination
untouched on failure. Pass `--sha256` when a manifest supplies one. Uploads need the ticket's
`maxBytes`, the actual `--content-type` for images, and `--headers-file <headers.json>` holding
the exact ticket headers when MCP returns any. A download prints `downloaded:true` with its byte
count and SHA-256; an upload prints `transferred:true, persisted:false`, which confirms only the
file transfer: call `set_document_state`, `upload_image` or the appropriate finalizer next. A
failure prints `{success:false, code, error}`. Without the helper or another authorized binding,
stop that step; never invent a proxy route or download through another tool.

## Network access before downloading

Successful Stripo MCP calls do not establish network access for local shell commands. Before
the first model, preview or hosted-image download, check the host's effective network policy
and its transfer instructions in `HOST.md` when installed. If the transfer needs access beyond
the shell sandbox, request it through the host's supported approval mechanism with that first
`transfer.mjs` command, asking only for HTTPS access to the returned URL's host. Do not run a
command merely to demonstrate a known restriction. Respect approval denials and report a
blocked transfer; these instructions do not grant permissions.

Interpret a failed transfer by its `code`:

| `code` | Meaning | Next step |
| --- | --- | --- |
| `ENOTFOUND`, `EAI_AGAIN` | DNS resolution failed: usually sandbox network policy, never proof of an expired URL or a broken model. | Check the execution context and network approval; do not repeat under an unchanged restriction. |
| `HTTP_ERROR` with HTTP 403 or 400 | The signed URL expired or no longer matches its signature. | Request a fresh URL through the same read tool with the same `(id, type)`. |
| `ECONNRESET`, `ETIMEDOUT`, `ECONNREFUSED`, `ABORT_ERR`, `TRANSFER_FAILED`, `HTTP_ERROR` with HTTP 5xx | Transient or unknown transport failure. | Retry once on the permitted path, reusing the same URL while it remains valid. |
| `CHECKSUM_MISMATCH`, `INCOMPLETE_RESPONSE`, `SIZE_LIMIT` | The received bytes are not the advertised artifact or exceed its limit. | Discard them and download once from a fresh URL; report a repeated mismatch. |
| `NON_PUBLIC_HOST`, `INVALID_URL`, `INVALID_HEADERS`, `INVALID_ARGUMENT` | The URL, headers or command are not an authorized direct transfer. | Correct a local argument error; otherwise report it and never bypass the check. |

Use bounded retries only for transient failures on a permitted network path. Download a fresh
response completely and keep a newly acquired model unmodified as the base for later editing.
Never recreate an email, repeat a write, or restart an image job to recover a download. These
GET rules do not apply to upload tickets or writes; follow [document-write recovery](stripo-persistence.md)
or [image-upload recovery](stripo-images.md#supplied-images).

Treat signed URLs as temporary credentials: keep them and their query parameters out of
user-facing reports and diagnostic output.

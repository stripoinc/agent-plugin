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

Call `get_document_state(id, type)` for the reference or target. Download its `downloadUrl`
after `status=OK`. Keep the target file untouched for the [base upload](stripo-persistence.md).

Before drafting or editing, call `get_document_state_schema()` on the write connection and
download its `downloadUrl`. Use `--server-schema <file>` for settings discovery, inspection,
creation, and edits. If unavailable, use bundled fields and report any blocked feature.

Use `get_content(id, type, includeHtml=false)` for name and project/folder metadata.
Use `get_screenshot(id, type, mode="BOTH")` for reference and final desktop/mobile inspection.

For a reference whose native model is unavailable, `get_content(id, type, includeHtml=true)`
returns a temporary `htmlUrl`; it does not promise a separate CSS artifact. Respect access errors.
Do not use quota-consuming `export_to_html` as routine model-write verification.

## Transfers

Start with the installed helper under ordinary host permissions (Codex `use_default`).
The consuming host supplies the binding in `HOST.md`.

```bash
node <bundle-root>/scripts/transfer.mjs download --url '<downloadUrl>' --output <local-file>
node <bundle-root>/scripts/transfer.mjs upload --url '<uploadUrl>' --input <local-file> --max-bytes <ticket maxBytes> --method PUT
```

Keep the exact signed HTTPS request target, TLS verification and the configured network route.
Refuse redirects. Send only the ticket headers (`--headers-file`) and image MIME type
(`--content-type`), with no OAuth, Cookie or Authorization. Keep input, output and header files
in the private task directory under system temp. Limit the stream to 64 MiB or the smaller
ticket/manifest `--max-bytes`. Verify completeness and any supplied download `--sha256` before
atomically replacing the destination. Direct connections validate every DNS answer and pin a
public IP. Proxy GET accepts the three Stripo storage hosts and `*.stripocdn.email` for images
on port 443. On every route, PUT requires a ticket for one of those storage hosts on port 443.
Keep the ticket's method, original bytes, headers and limit.

Use the helper's automatic curl fallback for technical failures. If the entry point cannot run,
use the alternate binding in `HOST.md` or an available host client enforcing this contract.
The same resource, recipient, method, data and permissions need no further approval. Report
a missing binding if none can enforce the contract.

GET returns `downloaded:true`, bytes and SHA-256. PUT returns `transferred:true, persisted:false`
before MCP finalization. Failures return `{success:false, code, error}` plus known transport,
phase, attempts and HTTP status. Treat signed URLs as temporary credentials. Keep queries,
proxy credentials, ticket headers and bodies out of diagnostics.

## Failures and retries

- **Execution or access.** Report a pre-launch refusal as the execution tool's decision. An unavailable
  escalation mode still permits an authorized default-mode attempt. Request extra access only
  when needed and supported. Never repeat an unavailable mode. A denial for the action or destination
  binds all clients. Any alternative must be permitted and resolve the reviewer's stated reason.
- **Transport.** `ENOTFOUND`, `EAI_AGAIN` identify DNS failures. Check the reported phase and host
  policy. A reset or timeout may also be technical. Keep the same proxy, DNS and TLS policy.
- **HTTP.** Inspect the status, recognized provider error code and ticket expiry. A 400 or 403
  alone leaves the cause open. Respect access denials and proxy refusals. Correct a signature
  or header mismatch at its source. On confirmed expiry, obtain a fresh URL for the same
  resource from the issuing tool, e.g. `get_document_state(id, type)`, `get_screenshot` with
  the same mode, or `get_document_state_schema()`.
- **Validation.** Stop on an unsafe URL/host/path/header, TLS verification, checksum, size or
  incomplete-response failure. Preserve the previous destination and correct the cause.
- **GET.** Allow two transfer attempts total per resource across helper, fallback and agent,
  including a refreshed ticket or a retry after a transient 5xx. Subtract the reported
  `attempts` and use `--max-attempts 1` for the last try. Never recreate an email, repeat a
  write, or restart an image job to recover a download.
- **PUT and finalize.** Fallback is possible only before origin request bytes could have been
  sent. Keep the same ticket, bytes, method, content type and required headers. If a PUT is
  uncertain, keep its ticket and files, stop before finalization and use documented recovery
  when available. After an uncertain document finalizer, read saved state before any replay.
  For an uncertain image finalizer with no gallery readback, report the uncertainty.
  Follow [document recovery](stripo-errors.md#document-writes) or
  [image recovery](stripo-errors.md#image-uploads).

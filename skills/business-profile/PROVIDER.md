# Stripo Business Profile host and provider contract

This file ships with the bundle as the skill's `PROVIDER.md`. The consuming host supplies its
selected scope, MCP routing, artifact root, browser/session binding, file-transfer commands and
authorization behavior in its own `HOST.md`; it must not replace or edit this file. A URL alone neither selects a destination nor authorizes a write.
Use the advertised schemas; `mcp-tools.json` supplies names, not argument translation.
Call `whoami` once to resolve accessible projects, only if it has not been called yet and the
project to work with is not already clear. Use the selected `projectId` on every profile call.

## Full website replacement

1. Call `prepare_business_profile_upload` directly with the selected `projectId`; use its returned `uploadId` and `uploadUrl`. Treat an MCP error or malformed/missing session ID or URL as a failed preparation.
2. PUT the finalizer's exact `${OUT}/brandkit.json` bytes to the returned upload URL through the transfer helper in [Direct signed-file transfers](#direct-signed-file-transfers)
   or the host's binding in `HOST.md`. Require HTTP 2xx.
3. Call `replace_business_profile` directly with the selected `projectId`, returned `uploadId`, and this run's exact website. This replaces the stored profile. Validate the returned `businessProfileId` and `businessProfile`; do not expect an orgId/brandkit envelope. Treat any MCP error as failure, and read state before retrying an unknown outcome.

## Preserving email-evidence update

Email writes use project-scoped `patch_business_profile`; `replace_business_profile` is the whole-document website route.

Call `patch_business_profile(projectId, patch)` with the approved partial update; it preserves
omitted fields. Do not use `replace_business_profile` for an email-evidence patch.

## Read and evidence acquisition

Read `get_business_profile(projectId)`. `businessProfileId:null` means no stored profile;
`businessProfile` then contains defaults only. Acquire email evidence via `get_document_state`,
`get_screenshot(mode="BOTH")`, and authorized `get_content(includeHtml=true)` for reference HTML.
Its type is lowercase; document and preview types are `EMAIL`/`TEMPLATE`. Do not use a sending
interface or pretend a read-only default profile is persisted. Direct signed HTTPS transfers
use the host's Node transfer helper, never the publisher-proxy scripts.
The finalizer adapter's logical `get_brandkit` read must map to `get_business_profile(projectId)`.
Adapt a successful stored profile to a payload `{brandkit: businessProfile}` in the MCP response
expected by the shared runtime. If `businessProfileId` is null, return an absent profile rather
than treating default values as persisted. Forward errors as errors; never invent an `orgId` or
silently pass the unadapted Stripo envelope to the shared report reader.

`replace_business_profile` replaces the entire profile, can overwrite concurrent changes, and
consumes its uploadId once. `patch_business_profile` preserves omitted fields, replaces supplied
arrays wholesale, and treats [] as a clear. Keep `languages` and `brand.brandVoice.defaultLanguages`
consistent. The response contains `businessProfileId` and `businessProfile`; validate that shape
instead of requiring Reteno acknowledgment fields. Read before retrying any unconfirmed write.

After every successful `replace_business_profile` or `patch_business_profile`, call
`get_business_profile(projectId)` on the same selected project and compare the requested fields.
Complete this fresh read before reporting success or using the profile downstream; the save
response, an earlier read, and a local file do not satisfy it. If the read fails or values differ,
report persistence as unverified and do not blindly repeat the write.

## Refusals and uncertain outcomes

Stripo reports tool failures as MCP errors with a message; it has no numeric approval codes.
These are the concrete signals for the shared Phase 5 refusals. Report the returned message:

| Shared refusal | Stripo signal | Action |
| --- | --- | --- |
| Denied | The agent host rejects the tool call or the user declines it, or MCP returns `Business Profile write access denied for this project.` | Stop; do not retry or switch projects. |
| Unattended | The host's permission mode blocks the mutation because no user can approve it. | Stop and report that approval is required. |
| Expired | `replace_business_profile` refuses with `Upload unavailable: wrong target/purpose/principal, not uploaded, or already consumed.` | Do not retry automatically. If an earlier call with this `uploadId` may have landed, read `get_business_profile(projectId)` first; otherwise report the refusal. |
| Validation-rejected | An invalid-argument error: the forwarded `INVALID_BUSINESS_PROFILE` message, `Invalid Business Profile request.`, `Business Profile upload exceeds <n> bytes.`, `Upload must be one valid JSON object.`, or `patch must be a JSON object.` | Report the message and field path; never edit the finalizer's validated file to evade it. |
| Logo refused before the write | The adapter rejects the logo (live SVG text, failed local rendering, byte or dimension limits, invalid or transparent PNG), or `upload_image` returns `file_too_large`, `unsupported_format`, or `hosting_rejected`. | Keep the finalizer's hosting limitation; no gallery asset or profile write happened. |

`Business Profile write result is unconfirmed…`, `Business profile service returned an invalid
response…`, `hosting_failed` and transport failures are uncertain outcomes, not refusals: read
`get_business_profile(projectId)` before any retry, and never reuse a consumed `uploadId`.

## Finalizer adapter and logos

Use the packaged `brandkit_runtime.adapters.stripo.StripoBusinessProfileAdapter` in the host's
`business-profile/scripts/host_adapter.py` (or the absolute `BRANDKIT_HOST_ADAPTER` override).
Install `packages/brandkit-runtime/requirements-stripo.txt` before enabling local SVG conversion.
It includes the common requirements and pinned `resvg-py` renderer; Reteno does not need that
renderer. The adapter translates the internal profile read and the logo-operation contract;
the shared finalizer, evidence policy and Phase 5 persistence stay unchanged.

The consuming host binds its existing authenticated MCP callback and signed-upload callback,
plus the selected project and explicitly authorized gallery target, once per finalizer process:

```python
from brandkit_runtime.adapters.stripo import StripoBusinessProfileAdapter

# These values/callbacks come from the consuming host's selected session.
adapter = StripoBusinessProfileAdapter(
    project_id=selected_project_id,
    logo_target_id=authorized_gallery_target_id,  # None for profile reads without logo hosting
    logo_target_type=authorized_gallery_target_type,  # "EMAIL" or "TEMPLATE"
    request_mcp=authenticated_mcp_request,
    upload_file=put_signed_file,
)
request_mcp = adapter.request_mcp
upload_file = adapter.upload_file
```

`authenticated_mcp_request(name, arguments)` uses the same selected Stripo connection and
returns a raw JSON-RPC response or native MCP `CallToolResult`. It must preserve errors and
permission decisions. `put_signed_file` implements the shared keyword-only upload contract
(`skill_root`, `input_path`, `upload_url`, `content_type`, `timeout_seconds`), performs one PUT
and raises unless HTTP success is confirmed. For logos its content type is always `image/png`;
when using the Node helper below, supply that Content-Type through `--headers-file`, and set
`--max-bytes` to the already-checked local PNG size or a stricter host limit. Do not accept the
helper's JSON Content-Type default for an image. Neither callback extracts OAuth tokens from
the agent or starts a separate MCP login. The generic loader keeps this adapter instance for
prepare, transfer and finalize; do not reconstruct it separately for each call.

Stripo's gallery API requires an email/template `id` and `type`; `projectId` is not a letter ID.
Resolve an authorized existing gallery target in the selected project before finalization.
Do not select an arbitrary first email or create a throwaway draft solely to obtain a gallery.
If no such target is authorized, report that requirement; reads and local validation still work.

The adapter performs this sequence for the shared finalizer's validated logo:

1. Read `get_content(id, type=<lowercase>, includeHtml=false)` and require the selected project
   and target. Then call `prepare_image_upload(id, type=<uppercase>, name)` and retain its
   session, URL, PNG content type, byte limit and expiry.
2. Convert a safe local SVG to PNG in a bounded, offline renderer before PUT. Keep an already
   converted PNG byte-for-byte. Preserve alpha, check dimensions/bytes and transfer only to
   the exact URL from that ticket. SVG source files and evidence remain unchanged.
3. After confirmed transfer, recheck target/project ownership and call
   `upload_image(id, type, uploadSessionId, name)`. Strip the internal `purpose:"logo"` argument;
   Stripo does not accept it. Require a successful permanent PNG result before the shared
   finalizer replaces the logo URL. Hosting does not change the email document or save the profile.

The built-in SVG renderer supports outlined artwork, fits it proportionally within 600x2000,
and preserves transparency. It rejects live SVG text instead of substituting fonts. A host with
the exact source fonts may pass `render_svg=<isolated byte-to-PNG callback>` to the adapter;
that callback must preserve the artwork, use no unapproved resources and enforce a render deadline.
Otherwise retain the finalizer's explicit hosting limitation or use an authorized captured PNG.
PNG inputs are limited to 4000x4000 and the ticket's byte cap; the server's current limits can be
stricter. Do not redraw a logo or silently discard lettering to make conversion pass.

Tickets stay bound to this process, target, name and URL. A failed/uncertain PUT cannot finalize;
an attempted `upload_image` cannot be replayed through this adapter. `hosting_rejected` confirms
no hosted asset, while `hosting_failed` or a transport failure leaves the outcome unknown.
Report that outcome without automatically preparing another upload, switching galleries, or
claiming that an asset was rolled back. An unused prepare ticket may remain after local conversion
fails; the adapter creates no gallery asset in that case.

## Direct signed-file transfers

When using the desktop plugin's installed helper:

```bash
node <bundle-root>/scripts/transfer.mjs download --url '<downloadUrl>' --output <local-file>
node <bundle-root>/scripts/transfer.mjs upload --url '<uploadUrl>' --input ${OUT}/brandkit.json --max-bytes <ticket maxBytes> --method PUT
```

Use the exact signed URL without adding OAuth, Cookie or Authorization headers. Require HTTP
success and obey the ticket's method, MIME type, maxBytes and expiry. Other host environments
supply their authorized transfer binding in `HOST.md`; do not invent a direct-network fallback.

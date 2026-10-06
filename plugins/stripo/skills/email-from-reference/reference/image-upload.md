# Upload supplied images

Use this workflow to host an image attached to the conversation, pasted with Ctrl+V, or
available as an authorized local file or crop. Preserve the supplied artwork; uploading does
not require image generation. Reuse an already suitable hosted URL directly.

The consuming host must expose the original attachment bytes as a local file and provide an
authorized transfer command, documented in `HOST.md` when installed. A visible chat image,
attachment id, or filename alone is not access to its bytes. If the file is unavailable, report
that limitation; never reconstruct it from the model's visual description. Do not put file
bytes, base64, data URLs, or local paths in MCP arguments or email image sources.

## Prepare, transfer, finalize

This bundle requires the following Stripo server contract. The host must verify both tools
and their argument schemas before activation; a mapping does not prove server support.

- `prepare_image_upload(id: integer, type: "EMAIL" | "TEMPLATE", name?: string)`
- `upload_image(id: integer, type: "EMAIL" | "TEMPLATE", uploadSessionId: string, name?: string)`

Use the write target's positive `id` and `type` on both calls, with the same filename. Its
project owns the gallery asset. For a new email, create its shell once before preparing assets;
reuse that email throughout the workflow. A reference is not the upload target unless it is
also the explicit edit/rebuild target. The server must bind each ticket to the authenticated
caller, project, and target and verify those bindings on finalization.

1. Resolve the intended local file and inspect it. Keep its actual format, filename, dimensions,
   transparency, and animation unless a change was requested. Use a filename whose extension
   matches the bytes. PNG, JPEG, and GIF are suitable for direct email insertion; uploading a
   WebP or SVG does not by itself make it email-safe.
2. Call `prepare_image_upload` with the arguments above. Require a nonempty `uploadSessionId`
   and select the `uploads` entry whose `kind` is exactly `image`. Do not use another artifact's
   URL. The response contract is:

   ```json
   {
     "uploadSessionId": "opaque-ticket",
     "name": "picture.png",
     "expiresAt": "ISO-8601 timestamp",
     "supportedFormats": ["PNG", "JPG", "GIF"],
     "uploads": [{
       "kind": "image", "method": "PUT", "uploadUrl": "https://signed-upload-url",
       "contentTypes": ["image/png", "image/jpeg", "image/gif"], "maxBytes": 3145728
     }]
   }
   ```

   The formats and byte limit above are illustrative: use the returned values, never a
   hardcoded allowance. Reject a missing/invalid manifest, unsupported MIME type, oversized or
   empty file, or expired ticket before transferring. Providers may advertise extra formats.
3. Transfer the exact file bytes to that `uploadUrl` with the returned HTTP method and any
   required headers, using the host's authorized transfer helper. Set `Content-Type` to the
   actual supported image MIME type. Require a successful transfer before finalization. This
   is an HTTP file upload between two MCP calls; it is not an MCP call with image bytes.
4. Call `upload_image` with that same `uploadSessionId`, filename, and provider scope. The
   successful result must contain `data.url`, an absolute HTTPS hosted asset URL. A signed
   staging `uploadUrl` is not the final asset. Treat MCP errors, `{error_code, reason}`, and
   missing or invalid `data.url` as failures. Never invent a fallback URL.
5. Verify the hosted image through the host's authorized download/viewing mechanism. Use the
   exact returned URL in the email's native image `settings.src` (or the SDK's `setSrc()`).
   For replacement, reacquire the model after hosting and verify the selected image still has
   the expected source before editing. Preserve unrelated links, alt text, and layout. Save
   with the usual base/target workflow, re-read the model, and inspect desktop/mobile previews.

For multiple attachments, keep a separate filename, ticket, upload URL, and final URL for each.
Do not mix files or sessions. After successful hosting, reuse the final URL during document
write retries. A failed upload leaves the original image unchanged and the requested work
incomplete. Do not call an image generator to recover an upload failure. An uncertain
finalization can already have created an asset: do not blindly finalize again or prepare a
duplicate; use a documented provider recovery/read operation, or report the uncertainty.
Only an explicitly expired/rejected session with no completed asset may be replaced by a fresh
prepare/transfer sequence. Inspection-only requests must not prepare or finalize uploads.

The Stripo implementation must validate the actual image bytes, enforce the advertised size
and type limits, check target write access, and return a durable gallery URL usable by email
recipients without chat authentication. It must reject expired, missing, mismatched, or already
consumed tickets without silently creating another asset. SVG rasterization is not required
by this contract; advertise only implemented formats. Image uploads do not consume AI
generation quota and must not invoke `generate_image` or `edit_image`.

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
also the explicit edit/rebuild target. Each ticket is bound to the authenticated caller and
that target: finalizing with another `id` or `type` fails with `upload_session_not_found`.
Preparing requires write access to the target and the right to change its images.

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
5. Use the exact returned `data.url` in the native image `settings.src` (or the SDK's `setSrc()`).
   Acquire the target model after hosting; for replacement, check the selected image still
   exists and any previously observed source is unchanged. Preserve unrelated links, alt text,
   and layout. Validate and save with the usual candidate/base workflow. For a focused image
   insertion or replacement, `set_document_state` with `status=OK` completes the request:
   no hosted-image download, model read-back, or desktop/mobile previews are required.
   Perform extra checks only when requested or completing a full build/rebuild; that workflow
   also verifies the hosted image through the authorized download/viewing mechanism.

For multiple attachments, keep a separate filename, ticket, upload URL, and final URL for each.
Do not mix files or sessions. After successful hosting, reuse the final URL during document
write retries. A failed upload leaves the original image unchanged and the requested work
incomplete. Do not call an image generator to recover an upload failure. An uncertain
finalization can already have created an asset: do not blindly finalize again or prepare a
duplicate; use a documented provider recovery/read operation, or report the uncertainty.
Only an explicitly expired/rejected session with no completed asset may be replaced by a fresh
prepare/transfer sequence. Inspection-only requests must not prepare or finalize uploads.

Stripo accepts PNG, JPEG, and GIF only, judged by the actual bytes; the filename and
`Content-Type` are not considered. Convert WebP, SVG, or any other format before preparing an
upload. JPEG and GIF are stored byte for byte, keeping animation. PNG keeps its pixels and
transparency but loses metadata. Names are plain file names of at most 100 characters; give
each image of a target its own name. The hosted extension follows the actual format, so the
returned name can differ from the requested one. Success is
`data: {url, name, contentType, bytes}`, where `data.url` is a durable gallery URL usable by
email recipients without chat authentication. Image uploads do not consume AI generation quota
and must not invoke `generate_image` or `edit_image`.

A PNG or GIF also has a pixel limit that the manifest does not carry. The `instruction` text of
the `prepare_image_upload` response states the current maximum width and height (4000x4000
unless the server is configured otherwise); check the file against it before transferring.

The upload session is single-use. Once `upload_image` has read the transferred file, the session
is spent, whatever the answer. A failure is `{error_code, reason, instruction}`:

| `error_code` | Meaning | Action |
| --- | --- | --- |
| `upload_session_not_found` | No transferred file for this session: it expired, was already used, or was prepared for another target or user. | If `upload_image` was already sent for this session, treat the outcome as uncertain. Otherwise correct `id`/`type`, or replace an expired session with a fresh prepare/transfer sequence. |
| `file_too_large` | Byte size or, for PNG/GIF, pixel dimensions exceed the limit; `reason` says which. Nothing was hosted. | Report the limit. Resize or compress only when the request allows changing the image; compression alone does not fix a pixel failure. A changed file needs a fresh prepare/transfer sequence. |
| `unsupported_format` | The bytes are not PNG, JPEG, or GIF with a valid header. Nothing was hosted. | Convert with an authorized tool and start a fresh prepare/transfer sequence, or report the format. |
| `hosting_rejected` | The gallery refused the file. Nothing was hosted. | The same file and name will be refused again. Report the refusal; do not repeat the upload unchanged. |
| `hosting_failed` | The gallery failed or did not answer. The image may or may not be in the gallery. | Uncertain finalization: do not prepare, transfer, or finalize this image again. Report the uncertainty. |

The response's `instruction` can suggest preparing a new upload after `hosting_failed` or an
uncertain `upload_session_not_found`. Do not follow that suggestion: Stripo has no gallery read
operation to rule out a duplicate, so report the uncertainty and leave the image unchanged.

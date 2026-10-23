## Upload supplied images

For files attached or pasted into chat, follow [Upload supplied images](image-upload.md).
This release requires `prepare_image_upload(id, type, name?)` and
`upload_image(id, type, uploadSessionId, name?)` on the Stripo server. They use the same
write target and project ownership as image jobs, but preserve supplied artwork without AI
generation. Transfer the bytes over HTTP between the two MCP calls, then use `data.url`.
The linked contract defines manifests, limits, failure handling, and host responsibilities.
Verify the server implements this contract before activating the updated bundle.

## Generate and edit images

Use the connected Stripo MCP's `generate_image`, `edit_image`, and `get_image_job`; their mapping
is in `auxiliaryTools`. The host must verify these names in the authenticated `tools/list`
catalog before activating the bundle. If a tool is unavailable, report the missing capability
and its effect on the requested email. Inspection-only requests must not start or collect image
jobs: collecting a completed job hosts its PNG in the gallery.

Both start calls require the write target's positive `id` and `type` (`EMAIL` or `TEMPLATE`).
Never use a reference's id as the image-job target unless it is also the explicit edit/rebuild
target. The target's project determines gallery ownership, write access, the AI image generation
right, and quota. For a new email needing AI visuals, resolve its name and destination, then
create it once before starting image jobs. Check the returned project and `editorModelReady`
as described in [creation](stripo-creation.md); keep that same `emailId` through generation, building, persistence, and recovery.
An existing email/template being edited or rebuilt needs no new email.

| Operation | Arguments and choice |
| --- | --- |
| `generate_image` | `prompt, id, type, aspectRatio?, referenceImageUrls?, model?`. Generate one new composition, optionally guided by up to 5 reference images. |
| `edit_image` | `prompt, imageUrl, id, type, referenceImageUrls?, aspectRatio?, model?`. Change one existing image while preserving the rest; up to 4 additional references. The source image is never modified. |
| `get_image_job` | `jobId`. Poll the started job and obtain its hosted result. |

Inputs must be authorized public HTTPS URLs of PNG, JPEG, or WebP images, up to 20 MB each.
Do not duplicate reference URLs or repeat `imageUrl` in an edit's references. Local files,
data URLs, and local crops cannot be passed directly to these generation tools. Host authorized
local inputs through the upload workflow first. Generation does not provide a lossless
upload/conversion path. Reuse an authorized hosted asset when exact preservation is required;
report an unavailable hosted input instead of inventing a URL.
Describe each reference's role, the intended composition, brand facts, and exact approved copy
in `prompt`. Use a bounded edit when the existing composition should be preserved; explicitly
request preservation of text, proportions, and transparency that must remain, then verify them.

`aspectRatio` accepts `1:1`, `3:2`, `2:3`, `16:9`, or `9:16`. Generation defaults to `1:1`;
for an edit omit it unless a proportion change is requested, so the provider can keep the source
proportions approximately. Exact dimensions, text, and transparency are not guaranteed.
Omit `model` to use the server default; the current tool accepts `gpt-image-2.5` and `gpt-image-2`.
Each model has its own project quota; do not switch models automatically to bypass a quota error.

Every start call is non-idempotent and consumes project AI quota, even for a discarded result.
Record `jobId` as soon as it is returned. While `status=running`, call `get_image_job(jobId)`
after `pollAfterSeconds`; generation usually takes 20–90 seconds. Poll promptly: an uncollected
result expires 5 minutes after completion. After a transient polling failure, retry the same
`jobId`, not the start call. If polling cannot continue, retain the id and report the job as
pending. After an uncertain start with no `jobId`, report the unknown outcome; do not replay it.

| Result | Next step |
| --- | --- |
| `completed` | `image` contains `url`, `width`, `height`, `format`, and `bytes`. Download and visually inspect the hosted PNG through the host's authorized transfer/viewing tools. Use `image.url` directly without another upload or compression pass. |
| `failed` / `quota_exceeded` | Report `error.details.reason`, `limit`, and `count`. `SUBSCRIPTION_LIMITS_REACHED` is the billing-period limit; `DAILY_LIMITS_REACHED` is the global daily cap. Do not retry. |
| `failed` / `generation_failed` | Report the failure. A deliberate new attempt must change the prompt or references within the user's request and spends quota again; never repeat the same call blindly. |
| `expired` / `job_expired` | The uncollected result is gone. Report it; any deliberate replacement is a new quota-consuming job, not a retry of polling. |
| `failed` / `job_not_found` | Check the recorded id and selected user/server. Do not silently start another job; report an unresolved result. |

A completed image is in the gallery, not yet in the document. For creation/rebuild, put its URL
in the brief's image `settings.src` with suitable `settings.altText.text`, then build normally.
For a bounded replacement, keep the original asset until ready. After inspection, reacquire the
target model and check that the intended image still exists with the expected source. If it was
deleted or changed while the job ran, report the conflict instead of retargeting or overwriting.
Otherwise create the SDK mutation against this fresh model using `setSrc()` and `setAlt()` as
needed; preserve unrelated links, layout, and settings. Upload the untouched fresh model as
`baseUploadId` alongside the candidate. Reuse a completed image URL during model-write recovery;
a failed document write must not start another image job. Finish with model read-back and both
desktop/mobile screenshots through the [verification contract](stripo-persistence.md).

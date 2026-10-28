# Stripo images

## Generate and edit images

Use the connected Stripo MCP's `generate_image`, `edit_image`, and `get_image_job`; their mapping
is in `auxiliaryTools`. The host must verify these names in the authenticated `tools/list`
catalog before activating the bundle. If a tool is unavailable, report the missing capability
and its effect on the requested email. Inspection-only requests must not start or collect image
jobs: collecting a completed job hosts its PNG in the gallery.

Both start calls require the write target's positive `id` and `type` (`EMAIL` or `TEMPLATE`).
Never use a reference's id as the image-job target unless it is also the explicit edit/rebuild
target. The target's project determines gallery ownership, write access, the AI image generation
right, and quota. A refusal for that right (`AI image generation is not allowed for your role…`)
stops image jobs: do not retry or switch the project or target; reuse authorized assets or crops,
or report the missing visual. For a new email needing AI visuals, resolve its name and
destination, then create it once before starting image jobs. Check the returned project and `editorModelReady`
as described in [creation](stripo-creation.md); keep that same `emailId` through generation,
building, persistence, and recovery. An existing email/template being edited or rebuilt needs no new email.

| Operation | Arguments and choice |
| --- | --- |
| `generate_image` | `prompt, id, type, aspectRatio?, referenceImageUrls?, model?`. Generate one new composition, optionally guided by up to 5 reference images. |
| `edit_image` | `prompt, imageUrl, id, type, referenceImageUrls?, aspectRatio?, model?`. Change one existing image while preserving the rest; up to 4 additional references. The source image is never modified. |
| `get_image_job` | `jobId`. Poll the started job and obtain its hosted result. |

Inputs must be authorized public HTTPS URLs of PNG, JPEG, or WebP images, up to 20 MB each.
Do not duplicate reference URLs or repeat `imageUrl` in an edit's references. Local files,
data URLs, and local crops cannot be passed directly to these generation tools. Host authorized
local inputs through [Supplied images](#supplied-images) first. Generation does not provide a
lossless upload/conversion path. Reuse an authorized hosted asset when exact preservation is
required; report an unavailable hosted input instead of inventing a URL.

### Brief and references

State in `prompt` the visual's purpose, its display size in the email, subject, composition,
palette, and each reference's role by its order ("reference 1 is the product, reference 2 sets the
palette"). Put text that must appear in the image in quotes. Take facts by regime: an Exact
fallback keeps the source's products, logos, colors, and visible copy rather than Business Profile
defaults; Tailored and Creative use verified target products, logos, offers, and approved copy.
Another brand's reference supplies design evidence, not facts about the target.

Order references by importance and put the main subject first: with references, the server
starts generation from the first one. Collect them from image-block `src` values, the Business
Profile logo, or the client's site.

The tools have no text, mask, or alpha controls, so state them in `prompt`. Say "keep all existing
text unchanged", "replace 'X' with 'Y'", or "no text in the image"; prefer native email text
outside the image. Text rendering is best-effort: check every word letter by letter. Use a bounded
edit when the existing composition should be preserved and name the regions that must not change.
Do not AI-edit a transparent source (logo, cutout) unless the user asks; never regenerate a logo.
When an edit must keep transparency, request it explicitly; if the result loses it, keep the
original and report the limitation.

`aspectRatio` accepts `1:1` (1024x1024), `3:2` (1536x1024), `2:3` (1024x1536), `16:9` (1792x1024),
or `9:16` (1024x1792). Generation defaults to `1:1`; choose the ratio nearest to the email slot and
set the displayed width through the native image block, not by expecting exact pixels. For an edit
omit it unless a proportion change is requested, so the provider can keep the source proportions
approximately. Exact dimensions, text, and transparency are not guaranteed: compare an edit's
proportions with the source and never stretch a result to fit. If they changed, report it or
deliberately restart with `aspectRatio`, which spends quota again.
Omit `model` to use the server default; the current tool accepts `gpt-image-2.5` and `gpt-image-2`.
Each model has its own project quota; do not switch models automatically to bypass a quota error.

### Jobs and results

Every start call is non-idempotent and consumes project AI quota, even for a discarded result.
Record `jobId` as soon as it is returned, together with the tool, prompt, references, and target
`(id, type)`, in the conversation itself: local files alone cannot recover a job after context loss.
Start independent jobs together from the main conversation so every `jobId` is recorded there.
A background worker may collect, download, and review recorded jobs; while it holds them, only
it polls them, until each reaches a terminal status. A worker never starts, restarts, or replaces
a job. If it returns without a terminal status, poll those jobs from the main conversation at once.
Only jobs you started are visible, and the server forgets a job one hour after its start.
While `status=running`, call `get_image_job(jobId)` after `pollAfterSeconds`; generation usually takes 20–90 seconds. Poll promptly: an uncollected
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

Review every completed image before use: requested content, approved text and spelling, branding
for the regime, dimensions, crop, and transparency. For an edit, also compare the regions that
should be unchanged with the source; the prompt does not guarantee unchanged pixels. Record each
result's `jobId`, `image.url`, dimensions, and review outcome: in the creation brief's
`sourceSummary` for a creation or rebuild, and in the final report for any workflow. The final
report names which images are AI-generated; the server marks them as such (C2PA).

A completed image is in the gallery, not yet in the document. For creation/rebuild, put its URL
in the brief's image `settings.src` with suitable `settings.altText.text`, then build normally.
For a bounded replacement, keep the original asset until ready. After inspection, reacquire the
target model and check that the intended image still exists with the expected source. If it was
deleted or changed while the job ran, report the conflict instead of retargeting or overwriting.
Otherwise run the SDK mutation against this fresh model using `setSrc()` and `setAlt()` as
needed; [Parallel work](parallel-work.md) says when its other changes may be written earlier.
Preserve unrelated links, layout, and settings. Upload the untouched fresh model as
`baseUploadId` alongside the candidate. Reuse a completed image URL during model-write recovery;
a failed document write must not start another image job. Finish with model read-back and both
desktop/mobile screenshots through the [verification contract](stripo-persistence.md).

## Supplied images

For files attached or pasted into chat, or authorized local files and crops, follow the shared
[Upload supplied images](image-upload.md) workflow with this contract. The host must verify both
tools and their argument schemas in the authenticated `tools/list` catalog before activation;
a mapping does not prove server support.

- `prepare_image_upload(id: integer, type: "EMAIL" | "TEMPLATE", name?: string)`
- `upload_image(id: integer, type: "EMAIL" | "TEMPLATE", uploadSessionId: string, name?: string)`

Use the write target's positive `id` and `type` on both calls, with the same filename. Its
project owns the gallery asset; preparing requires write access to the target and the right to
change its images. For a new email, create its shell once before preparing assets and reuse that
email throughout the workflow. A reference is not the upload target unless it is also the
explicit edit/rebuild target. Each ticket is bound to the authenticated caller and that target:
finalizing with another `id` or `type` fails with `upload_session_not_found`. Image uploads do
not consume AI generation quota and must not invoke `generate_image` or `edit_image`.

Stripo accepts PNG, JPEG, and GIF only, judged by the actual bytes; the filename and
`Content-Type` are not considered. Convert WebP, SVG, or any other format with an authorized
local tool before preparing an upload; image generation is not a conversion path. JPEG and GIF
are stored byte for byte, keeping animation. PNG keeps its pixels and transparency but loses
metadata. Names are plain file names of at most 100 characters; give each image of a target its
own name. The hosted extension follows the actual format, so the returned name can differ from
the requested one.

PNG and GIF also have a pixel limit that the manifest does not carry. The `instruction` text of
the `prepare_image_upload` response states the current maximum width and height (4000x4000
unless the server is configured otherwise); check the file against it and against the ticket's
`maxBytes` before transferring. Transfer through the selected `uploads[]` entry:

```bash
node <bundle-root>/scripts/transfer.mjs upload --url '<uploadUrl>' --input <image-file> --max-bytes <maxBytes> --content-type <actual image MIME type> --method PUT
```

Call `upload_image` only after the helper prints `transferred:true`. Success is
`data: {url, name, contentType, bytes}`, where `data.url` is a durable gallery URL usable by email
recipients without chat authentication. Insert that URL, never the staging `uploadUrl`.

The upload session is single-use. Once `upload_image` has read the transferred file, the session
is spent, whatever the answer; a call made before the transfer finishes spends nothing. A failure
is `{error_code, reason, instruction}`; handle it as
[Write and upload errors](stripo-errors.md#image-uploads) describes.

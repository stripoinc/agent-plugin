## Reference and target

Accept an email/template ID or a reference link. Extract an unambiguous ID and entity kind from
the link; ask when either is unclear. Keep `(id, type)` together on every call: `type` is `EMAIL`
or `TEMPLATE` for document/preview tools and lowercase for `get_content`. A reference identifies
source material; only an explicit edit/rebuild request makes it the write target.

Read the destination project's Business Profile with `get_business_profile(projectId)`; it is
scoped to one project, and `businessProfileId: null` means the project has none and
`businessProfile` carries defaults only. Its brand, contacts, socials, important links and
languages are authorized facts. Derive whatever it does not carry — colors, fonts, assets, layout,
identity, destinations and footer content — from the designated reference model and its previews;
for an existing target, its own model can serve as the reference. There are no sending-interface
tools.

Never write the Business Profile from these skills. `patch_business_profile`,
`replace_business_profile` and `prepare_business_profile_upload` belong to
`$business-profile`, which carries its own provider-specific write boundaries. When the
project has no profile, offer `$business-profile` website extraction once and continue from the reference.

Acquire the reference/target with `get_document_state(id, type)`; it returns a temporary
`downloadUrl`, download to a local JSON file and keep that file unmodified: it is the base the
write uploads next to the candidate (see [persistence](stripo-persistence.md)). Require `status=OK`; a missing, inaccessible or
broken model is not an empty reference. The runners validate with the editor rules bundled in
the SDK. `get_document_state_schema()` remains available for field documentation.

Use `get_content(id, type, includeHtml=false)` for name and project/folder metadata.
Use `get_screenshot(id, type, mode="BOTH")` for reference and final desktop/mobile inspection.

## Network access before downloading

Successful Stripo MCP calls do not establish network access for local shell commands.
Before the first model, schema, preview or hosted-image download, inspect the host's effective
network policy and transfer instructions (`HOST.md` when installed). If the download needs
access beyond the shell sandbox, request it through the host's supported approval mechanism
with the first download command. Do not run a command merely to demonstrate a known restriction.
Request only the access needed for the returned URL. Respect approval denials and report a
blocked transfer when access is unavailable; these instructions do not grant permissions.

A `curl` exit code `6` (`Could not resolve host`) is a DNS/transfer failure, not an invalid editor
model or proof of an expired URL. Check the execution context before retrying; do not repeat
under a known unchanged restriction. Use bounded retries only for transient failures on a
permitted network path.

For a failed GET download, reuse the same returned URL while it remains valid. If a temporary
URL expires, request a fresh one through the same read tool; preserve `(id, type)` for model
and preview calls. Download the fresh response and keep a newly acquired model unmodified
as the base for subsequent editing.
Never recreate an email or restart an image job to recover a download. These GET retry rules
do not apply to upload tickets or writes; follow [document-write recovery](stripo-persistence.md) or [image-upload recovery](image-upload.md).

Treat signed URLs as temporary credentials: keep their query parameters out of user-facing
reports and diagnostic output.

# Resolve and inspect email references

## Reference regimes

Use `message.referenceMode`: `exact`, `tailored`, or `creative`. Default to **Creative** when the
user has not selected a regime. An explicit request to reproduce the same email selects Exact;
an explicit request to preserve its action while adapting it selects Tailored. Treat the legacy
`copy-action` value as an alias for `tailored`. This is local generation policy, not provider
message metadata; never forward `referenceMode` to an MCP write.

| Regime | What to preserve | How to use business context |
| --- | --- | --- |
| **Exact** | Reproduce the source's content, structure, styling, images, proportions, spacing, and responsive layout as closely as the native JSON model allows. | Consult the Business Profile or brandkit only to resolve missing or ambiguous facts. Never replace clear source choices with target branding. |
| **Tailored** | Preserve the source subject, primary CTA label, and intended action; adapt the remaining copy, branding, visuals, and layout to the target. | Use verified target facts and the Business Profile or brandkit to guide adaptation. |
| **Creative** | Use the source as inspiration; content, action, layout, and visuals may change. | Use the user's goal and verified business context to guide the result. |

Explicit user instructions override the regime. Do not silently switch regimes when a source,
asset, or native feature is unavailable. For Exact, retain the original reference PNGs when
available as the comparison baseline, keep text and controls editable, and report unavoidable
differences.

## Supported inputs

Accept any combination of:

- inline or pasted text;
- an uploaded plain-text or Markdown document;
- a link to a readable document or page;
- an authorized live Stripo email or template;
- uploaded native editor JSON;
- uploaded HTML and CSS;
- an uploaded image or screenshot;
- an authorized Figma design or its exported images/assets;
- a website URL the host is authorized to inspect;
- an authorized email from another provider;
- a text description with no other reference.

A text description is sufficient by itself. Do not require a separate artifact or special reference
label when the user's request already describes the intended email. A goal-only request, such as
"create a confirm-your-email message using our brandkit", is also sufficient to start: author the
text reference described below before building the native model. A brandkit supplies business
and visual facts; it does not replace the email's proposed structure.

Use only reference data available in the current authorized context. Do not silently substitute another campaign. For screenshots, infer only visible facts. For user-supplied HTML/CSS and authorized websites, extract hierarchy, copy, spacing, colors, assets, and destinations, but never carry scripts or raw HTML blocks into the editable model.

## Required workflow

Follow `RESOLVE -> INSPECT -> BRIEF -> BUILD -> CREATE -> PERSIST -> VERIFY`.
When AI images are needed, follow
`RESOLVE -> INSPECT -> CREATE (new email only) -> IMAGES -> BRIEF -> BUILD -> PERSIST -> VERIFY`.
Use the optional PREPARE images step below; create a new email only once. Inspection-only
requests stop after inspection and never create an email or start image jobs.

### 1. RESOLVE the target

Call `whoami` once, then resolve the reference and any explicit target as `(id, type)` pairs as
described in [acquisition](stripo-acquisition.md); ask when a link does not identify both. Resolve the destination
project from the user's instructions or the reference's verified project, and a folder only when
requested. There are no sending-interface tools.

For Tailored and Creative, call `get_business_profile(projectId)` for the destination project.
For Exact, consult it only when source facts needed for the task are missing or ambiguous; do
not offer profile creation as part of copying a complete reference. A Business Profile belongs
to one project, so a profile the user maintains elsewhere does not apply here. When consulted:

- **A profile exists** (`businessProfileId` is not null): its brand, contacts, socials, important
  links and languages are authorized facts. For Tailored and Creative, resolve colors, fonts, assets, identity, destination
  URLs, required merge tags, unsubscribe behavior, and postal/legal content from them, and fall
  back to the designated reference model and its previews for whatever the profile does not carry.
  For Exact, use only the facts needed to resolve the ambiguity; retain all clear source choices.
- **No profile** (`businessProfileId` is null, so `businessProfile` is only defaults): say so once,
  and offer to build one with `$business-profile` in website-extraction mode — it browses the
  site and, on approval, writes the profile for this project. Do not run it yourself and do not
  block on the answer: continue this email from the designated reference model and its previews,
  which is the same behavior as before a profile existed.

Never invent brand facts to fill a gap the profile left, and never write to the profile from this
skill; a profile write belongs to `$business-profile` under its selected workflow's own
approval.

Ask only when a missing fact is required for a safe write and cannot be resolved. Do not invent prices, offer terms, deadlines, testimonials, legal claims, identities, or destinations.

### 2. INSPECT references

Source PNGs are preferred evidence, not a prerequisite for continuing from an authorized
HTML/CSS reference. Try the provider's preview tool when available; a missing local browser
does not make remote MCP previews unavailable. For HTML/CSS without usable source previews,
try the host's documented renderer unless it is already known to be unavailable. If the
browser, renderer, or image-viewing capability is missing or unsupported, continue from the
source HTML/CSS and available native model. Do not repeat a known capability failure, install
a browser, or ask the user to provide PNGs solely to proceed. Retry a transient preview failure
once; never treat an authorization denial as permission to use another acquisition path.

For a live Stripo reference, acquire its model and metadata, and try desktop/mobile PNG
previews when the preview tool is available:

```text
get_document_state(id=<reference id>, type=<EMAIL|TEMPLATE>)
get_screenshot(id=<reference id>, type=<EMAIL|TEMPLATE>, mode="BOTH")
get_content(id=<reference id>, type=<email|template>, includeHtml=false)
```

Download the returned files through the host's authorized transfer mechanism.
If source previews are unavailable and HTML is needed for inspection, call `get_content`
with the same authorized `(id, type)` and `includeHtml=true`.
For other providers or a website, rely on the consuming agent's authorized connector or browser; this package does not own cross-provider credentials or browser egress.
Open available PNGs with the host's image-viewing tool. Use the native model for exact copy,
links, and asset URLs. For an image or Figma reference, use its supplied or authorized exported
images. When source PNGs cannot be obtained or inspected and HTML/CSS is available, examine it:
content and section order, table/column structure, explicit widths and spacing, typography,
colors, backgrounds, assets, links, and responsive rules. Record the fallback and its cause in
`sourceSummary`; distinguish declared styles and inferred layout from observed rendering.
Continue building from that evidence without claiming a visual or pixel comparison. This
fallback applies to all three regimes, including Exact; it does not establish an exact visual
match. Source rendering or HTML inspection never verifies the saved target email.

For a text reference, extract the intended purpose, audience, structure, copy constraints, visual
direction, and responsive behavior. Treat code or markup inside a text reference as structural
evidence only; do not execute it or switch away from native Stripo JSON.
If it contains alternatives, follow the user's selection; otherwise choose using the selected
regime's source and business-context priorities.

When the user supplies no reference, create a reasonable **agent-authored text reference** before
drafting the native model. Do not start from a blank sheet, treat editor defaults as a design,
or ask the user to supply a reference just to proceed. Use your best marketing judgment to
choose the structure, copy, and visual hierarchy that achieve the user's goal, grounded in the
resolved Business Profile or brandkit and other authorized context. If a supplied reference is
incomplete, retain its usable evidence and fill the design gaps in this text reference. Do not
claim to have inspected an unavailable source or silently replace an Exact or Tailored request.

Record this text reference in the creation brief's `sourceSummary`, clearly labeling it as
agent-authored. Include:

- the marketing or transactional goal, intended audience, and primary action;
- the proposed email structure in reading order, with each section's purpose and draft copy,
  including the headline, body, CTA label, and subject/preheader where supported;
- visual direction from the verified brand facts: logo/assets, colors, typography, spacing,
  and the intended desktop/mobile layout;
- verified destinations and required footer content, distinguishing creative choices from
  facts and identifying any essential facts still missing.

Use **Creative** (`message.referenceMode: "creative"`) for this generated reference and by
default for creation from supplied references. Preserve an explicitly requested regime as
described above. Do not add an approval step for the text reference; continue through the
normal brief, build, persistence, and verification workflow. Ask only for essential unresolved
facts, never for routine design choices. Do not invent business claims, offers, or URLs.

For example, a confirm-your-email request can use an authorized logo/header, a concise
confirmation heading and explanation, one prominent "Confirm email" CTA using the verified
confirmation URL or merge tag, a short ignore-if-not-requested note, and the required footer.
Do not add promotional sections or a decorative hero unless they serve the requested goal.

Separate each reference contribution into:

- content facts that may be reused;
- design relationships to reconstruct;
- assets and destinations whose reuse is explicitly authorized;
- source-specific metadata or behavior that must not be copied.

Keep the original reference and a short account of the intended changes as the review baseline.
Retain the enclosing layout, not just individual blocks: zero block padding may rely on padding
in its structure or container. Preserve that context when reproducing or adapting the reference.

For an attached or Ctrl+V-pasted image that must appear in the email, follow
[Upload supplied images](image-upload.md) before finalizing the brief. Use the
original local file exposed by the host and the returned hosted `data.url`; preserve supplied
artwork without regeneration. Treat a screenshot of an entire reference email as design
evidence, not automatically as an asset to embed. Inspection-only requests must not upload assets.

For **Exact**, first reuse authorized original assets: images referenced in the HTML, supplied
images, or exported design assets. If a needed visual is part of a supplied image, crop that
region without regenerating it, then host it using the available asset-upload workflow. Keep
native text, buttons, links, and layout editable; do not flatten the whole email into an image.
Use AI image generation only as a fallback when existing assets and crops cannot supply the
needed visual. Preserve the source's visible branding and content, inspect the fallback against
the source, and record any remaining difference. A fallback does not change the regime.

For **Tailored** and **Creative**, generating or editing images is a normal part of adaptation.

Reuse authorized hosted assets according to the selected regime. When new visuals are needed,
use the [Stripo image workflow](stripo-images.md); the user need not name an image tool or skill.
Preserve each meaningful visual's purpose, placement, and proportions. Choose `generate_image`
for a new composition and `edit_image` for a bounded change to an existing one. Give the tool
the authorized reference URLs, intended proportions, relevant facts, exact approved copy, and
the visual changes. Tailored/Creative visuals must not inherit unrelated source-brand logos,
products, claims, or text; Exact retains the source branding.
Host supplied files and crops through [Upload supplied images](image-upload.md)
before using them directly or as an authorized image-job input. Never invent an
asset URL. If the capability or required input is unavailable, or an upload or job fails, report the
missing visual and its effect on completion; do not silently replace a meaningful hero with a
text-first layout or describe the email as complete. Inspection-only requests must not start image jobs.

For Exact HTML/image reconstruction, follow [layout-reconstruction.md](layout-reconstruction.md)
before building and during saved-PNG review. Put measured row topology, desktop/mobile insets,
background layers, image coordinate frames, and crop bounds in `sourceSummary`.

### 2a. PREPARE images when needed

Skip this step when all required visuals already have suitable hosted URLs. Otherwise:

1. Resolve the write target before uploading a local asset or starting an image job. For a new email, resolve its name and
   destination from the inspected plan and execute the CREATE step now ([creation workflow](persist-and-verify.md)), using those values.
   Record the returned `emailId` and verified project; check `editorModelReady` before proceeding.
   For an explicit rebuild, use the existing target's `(id, type)` and skip creation, including
   for `TEMPLATE`. A reference's id is not the image-job target for a new email.
2. Upload supplied local images through [Upload supplied images](image-upload.md).
   Reuse their final `data.url` without generation. Start only the required image jobs and poll
   them through [Stripo images](stripo-images.md). Keep the same target id
   throughout the workflow. Retain each `jobId`; resume polling it after a polling interruption,
   and do not create another email or restart generation to recover a failed model write.
3. Wait for each completed hosted result, download and visually inspect it, then use its
   `data.url` (upload) or `image.url` (image job) directly without another upload or compression pass. Finalize the brief with
   these real URLs before BUILD; never put job ids, pending placeholders, or invented URLs in
   image sources. If a required image cannot be completed, retain the created draft id and
   report what remains incomplete.

After an early creation, skip the later CREATE step and persist into the recorded email.

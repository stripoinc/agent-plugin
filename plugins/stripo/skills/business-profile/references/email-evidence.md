# Email evidence

Read the host-installed `HOST.md` in the top-level `business-profile` skill directory before invoking tools or transferring artifacts. It defines the selected organization or project, MCP routing, artifact transfer commands, and the host's approval behavior; do not infer those values or permissions.

## Overview

Use live emails from the selected publisher account to read, audit, fill, reconcile, or update its Business profile. Website extraction is a separate procedure and uses full replacement; do not use this email updater to finish or bypass a refused, incomplete, partial, or stale website run.

Email writes use project-scoped `patch_business_profile`; `replace_business_profile` is the whole-document website route.

## Modes

Infer the mode from the user request:

- `read`: read and summarize the current brandkit only.
- `check` / `audit`: compare selected email evidence with the current brandkit and do not write.
- `fill`: add missing high-confidence values only. Do not overwrite non-empty fields.
- `reconcile`: prepare one or more variants for conflicting fields. Write only approved values.
- `update`: apply approved non-destructive changes and high-confidence additions. Ask before destructive changes.

If the user asks to "check and update", treat that as permission for non-destructive high-confidence additions. Still ask before replacing, deleting, blanking, or narrowing any existing value.

## Evidence Selection

Real emails means live account emails read through the configured publisher MCP in the current organization. Do not use stale local exports, examples, old `output/` files, or memory as primary evidence.

If the user provides message IDs, workflow IDs, tags, dates, or a sampling rule, use that scope. If the evidence source is not specified, ask which emails to use before reading messages. Useful choices are:

- latest sent emails
- best-performing emails
- active workflow emails
- specific message IDs
- a named campaign/tag/date range

If the user asks for "best-performing", use live analytics or message ranking MCP data when available. If performance data is unavailable, ask whether to use latest sent emails instead.

Prefer production-like sent or active workflow emails. Exclude obvious tests, drafts, empty templates, and one-off experiment messages unless the user explicitly includes them.

## MCP Workflow

1. Read the current brandkit with the configured publisher MCP brandkit read tool. Prefer the brand's read tool when exposed:
`get_business_profile(projectId)`.
2. Select the evidence emails from the user's scope. Use live MCP list/search/analytics tools; do not rely on local inventories.
3. For each selected email, gather both structured and visual evidence:
   - Read JSON first, using the configured publisher MCP email model or JSON export tool, such as `get_email_model` or the equivalent current tool.
   - Read rendered PNGs with the configured publisher MCP email PNG/render tool when available.
   - If JSON is unavailable, fall back to HTML from `get_email_message_export`.
   - If a tool returns a signed artifact URL, download it through `scripts/download_via_proxy.sh`; never fetch signed publisher artifact URLs directly from `publisher-runtime`.
4. Walk the current brandkit schema. Consider every field the schema exposes, including colors, logos, fonts, typography, sender identity, product names, CTA style, links, social links, navigation, legal/footer content, image style, templates, tone of voice, and any future fields.
5. Extract candidate values from email JSON, PNGs, and HTML fallback. Prefer structured JSON evidence over pixel inference; use PNGs to confirm rendered colors, logos, typography, layout, and image style.
6. Build a small patch plan: field path, current value, candidate value, operation (`add`, `overwrite`, `delete`, `variant`, `skip`), confidence, and source message IDs.
7. Apply only the changes allowed by the selected mode through the brandkit MCP update tool.
Prefer `patch_business_profile(projectId, patch)`: it applies the patch plan field by field, where `replace_business_profile` would blank every section this run did not fill.
8. Verify by reading the brandkit again after any write.

Save run artifacts under `output/brandkit/runs/<UTC_TIMESTAMP>/` when local files are needed:

- `brandkit.current.json`
- `email_<message_id>.json`
- `email_<message_id>.png`
- `email_<message_id>.html` only for fallback
- `patch_plan.json`
- `brandkit.after.json` after writes

## Field Rules

Use the brandkit's current schema as the authority. Do not invent fields that the read or update tool does not support.

Treat an update as non-destructive only when it adds a value to an empty field or appends a supported variant without changing existing values.

Treat these as destructive and ask before writing:

- replacing a non-empty scalar value
- deleting or blanking a value
- replacing a logo, sender identity, domain, social link, legal/footer value, or primary color
- shrinking an array or choosing one value from several existing variants
- changing a field whose meaning is unclear from the schema

When the brandkit supports variants or arrays, keep real recurring variants instead of forcing one winner. Examples: multiple logo formats, dark/light logo variants, social URLs, language-specific legal text, reusable CTA labels, and navigation links.

Do not add schema-incompatible metadata just to preserve evidence. Keep evidence in `patch_plan.json` and the concise final response unless the brandkit schema has explicit metadata fields.

## Confidence Rules

Use high confidence when:

- the current brandkit field is empty and the same value appears in structured JSON across multiple selected real emails
- the value is global/theme-level in JSON and the rendered PNG confirms it
- header/footer evidence repeats across the selected emails
- all user-specified message IDs agree on the value

Use medium confidence when:

- one strong email provides the value but the sample is small
- JSON and PNG mostly agree but the value may be campaign-specific
- values differ but there is a clear majority and the minority looks experimental

Use low confidence when:

- evidence is PNG-only or visually inferred
- the value appears only in hero imagery, seasonal creative, promo copy, dynamic product blocks, or one campaign
- many plausible values exist without a clear majority
- HTML fallback is the only source and the field would overwrite an existing brandkit value

Auto-write only high-confidence non-destructive additions when the user gave update permission. Ask before writing medium/low confidence values, and never auto-write destructive changes.

## Conflict Handling

When evidence disagrees:

1. If the schema supports variants, add variants when the user allowed writes and the variants are high confidence.
2. If there are one or two plausible values, choose the conservative action for the mode and mention the skipped alternative briefly.
3. If there are many plausible values, or choosing one would overwrite a current value, ask the user to choose.

Do not turn campaign-specific values into brand defaults. Examples: Black Friday button color, temporary promo headline style, a one-off footer legal line, or a seasonal image direction.

## Safety

- Use the configured publisher MCP tools for all live reads and writes.
- Do not call publisher APIs directly from `publisher-runtime`.
- Do not pass `OPENAI_API_KEY` into `publisher-runtime`; OpenAI-backed visual analysis must go through `publisher-proxy` or approved runtime tooling.
- Do not update email messages in this skill. The only write target is the brandkit.
- If the MCP update tool rejects a patch, stop, report the rejected field paths, and leave the brandkit unchanged except for already confirmed successful writes.

## Resources

Use `scripts/download_via_proxy.sh` for signed JSON, HTML, PNG, or other artifact URLs returned by the configured publisher MCP tools.

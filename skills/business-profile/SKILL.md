---
name: business-profile
description: Read, audit, fill or update a Stripo project's Business Profile using supplied business information or selected live Stripo emails. Covers visual identity, brand voice, business facts, colors, fonts and links. Preserve unrelated fields and verify saved changes. Does not crawl websites, replace a full profile from website extraction, or edit emails.
---

# Business Profile

Use the authenticated Stripo MCP connection. Call `whoami`, resolve the requested project with
`find_projects`, and read `get_business_profile(projectId)` before proposing changes. Use the
single project when unambiguous; otherwise ask which project. Keep that `projectId` throughout.
For a missing connection, use [connect](../connect/SKILL.md).

Choose the scope from the request:

- **Read or audit:** summarize the current profile or compare it with the selected evidence; do not write.
- **Fill:** add high-confidence values to empty fields, preserving existing values.
- **Update or reconcile:** apply the requested changes from supplied facts or selected emails.
  Ask only for unresolved conflicts or changes outside the user's authorization.

For email evidence, read [the email procedure](references/email-evidence.md). A website URL alone
is not a supported profile extraction workflow or authorization to save. Explain the limitation
and ask for supplied business information or a selection of Stripo emails.

1. Keep the current profile as the baseline. Follow the live read and patch schemas; do not invent
   fields or infer brand facts, URLs or legal text.
2. Prepare only the requested field changes. Omitted fields stay unchanged. Arrays replace in full:
   retain existing items when adding a variant; `[]`, empty strings and null are explicit changes.
   Do not use empty values as placeholders for missing evidence.
3. Call `patch_business_profile(projectId, patch)` within the authorized scope. Do not use
   `replace_business_profile` or the website extraction/upload route to apply a partial update.
4. Read `get_business_profile(projectId)` again. Verify requested values and preservation of
   unrelated fields and array entries. After an uncertain write, read back before any retry.
   Report rejected field paths or incomplete verification; never claim a save from a local plan.

For supplied logos, use [the Stripo image upload workflow](../email-model-editor/reference/image-upload.md)
when the live tool supports the selected target. Keep original bytes and use the hosted URL returned
by Stripo. Hosting an image does not itself update the profile. Do not generate a replacement logo
or create an email merely to obtain an upload target.

This skill writes only the selected project's Business Profile. Stripo supplies no sending or
performance analytics; do not rank evidence by opens, clicks or campaign results.

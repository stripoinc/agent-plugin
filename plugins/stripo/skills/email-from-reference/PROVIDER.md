# Stripo MCP guide

The server supplies tool schemas; this bundle supplies workflows and `mcp-tools.json` tool names.
Read only the topic needed for the next operation.

## Focused operations

A focused request creates an email without changes inside it, replaces text in a block, inserts
an attachment into a specified image block, changes a button color, or makes a similar local edit.
Use only the calls needed to complete it. A successful `create_email` response with
`editorModelReady=true`, or `set_document_state` with `status=OK`, completes the operation.
Report the actual result and stop. Do not add confirmation reads, screenshots, exports, or
artifact downloads. Omitted unrequested checks do not make the result incomplete.

Keep the necessary preparation: resolve an unknown target, acquire the current model for an
edit, validate the SDK change, upload supplied assets when needed, and upload the candidate and
untouched base. A local change or image upload alone does not complete the document edit.
Use `whoami`, searches, or server guides only when missing context requires them; never supply
your own user ID. With no requested destination, `create_email` may use its default project.
Optional follow-up suggestions in a successful tool response do not expand the user's request.

Perform additional checks when the user requests them, within the requested scope. Full email
builds/rebuilds and broader redesigns retain their model and desktop/mobile verification,
including repairs made to complete that workflow. A refusal, timeout, or unknown write outcome is not success: follow
the operation's recovery rules and read back before retrying an uncertain document write.

## Tool and topic selection

- For full workflows, resolve access with `whoami` once and read `stripo://guide/start-here`.
  Read `stripo://guide/recipes` only for the selected workflow.
- Discover exact tool names or the Stripo namespace, not every tool description. Limit resource
  discovery to Stripo; inspect names/URIs before reading selected resources.
- Keep full results in variables/task files and print bounded excerpts. Keep `(id, type)`
  together. Models travel through files and temporary URLs, never inline in MCP arguments.
- Use configured credentials and host transfers. MCP access does not establish shell network
  access; check the download topic before a transfer.

| Operation | Topic |
| --- | --- |
| File transfers and bootstrap for Codex, Claude Code and shell hosts | [File workflows](reference/stripo-file-workflows.md) |
| Resolve or acquire a target/reference | [Acquisition](reference/stripo-acquisition.md) |
| Create an email; native title/preheader | [Creation](reference/stripo-creation.md) |
| Upload, generate, or edit an image | [Images](reference/stripo-images.md) |
| Write, recover, or verify a model | [Persistence](reference/stripo-persistence.md) |

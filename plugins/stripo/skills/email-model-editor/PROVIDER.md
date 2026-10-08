# Stripo MCP guide

Shared MCP context for both email skills. Read this once, then open only the topic needed for
the next operation. The connected server supplies tool schemas; this bundle supplies the
workflow and `<bundle-root>/mcp-tools.json` supplies exact tool names and unsupported capabilities.

- Call `whoami` once to resolve identity and access; never supply your own user ID.
- Read the connected Stripo server's `stripo://guide/start-here` once when available. Read a
  relevant recipe from `stripo://guide/recipes` only when the selected workflow needs it.
- Discover tools by exact name or the Stripo server namespace. Do not search every description
  for a tool name: a shared server introduction can mention that name in every result.
- For resource discovery, limit the request to the Stripo server when the host supports it.
  Inspect names/URIs first and read the selected resource, not every resource body.
- Keep full tool results and models in variables or local files. Return only the needed fields
  or bounded excerpts to the conversation; retain the original for later inspection.
- Keep `(id, type)` together. A reference is not a write target without an explicit edit/rebuild
  request. Model JSON travels through files and temporary URLs, never inline in MCP arguments.
- Use the host's configured endpoint, credentials and transfer mechanism. Successful MCP access
  does not establish shell network access; check the download topic before the first transfer.

| Operation | Read before the operation |
| --- | --- |
| Resolve a reference/target; download model, preview, or image | [Acquisition and network access](reference/stripo-acquisition.md) |
| Create an email, including an empty one; set native title/preheader | [Creation and native metadata](reference/stripo-creation.md) |
| Upload a supplied image, generate a visual, or edit an image | [Images and job recovery](reference/stripo-images.md) |
| Upload a model, handle a write failure, or verify persistence | [Persistence and verification](reference/stripo-persistence.md) |

Follow the selected skill's SDK workflow and these provider topics together. Read the write
contract before preparing upload tickets; an uncertain outcome must be checked before retrying.

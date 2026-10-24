# Stripo provider contract

Provider contract for both email skills; each `SKILL.md` and its references define the shared
creation/editing workflow and SDK usage. This file ships with the bundle: a consuming host adds
its runtime binding in its own `HOST.md` and must not replace or edit this file. Use the
connected Stripo MCP. Call `whoami` once to resolve access and projects, only if it has not
been called yet and the project to work with is not already clear.

Bundle metadata is at `<bundle-root>/{bundle.json,mcp-tools.json}` unless `HOST.md` relocates
it; `mcp-tools.json` lists tool names and unsupported capabilities, not callable logical keys.

Keep `(id, type)` together on every call: `type` is `EMAIL` or `TEMPLATE` for document, preview
and image tools and lowercase for `get_content`. A reference identifies source material; only an
explicit edit/rebuild request makes it the write target. Never write the Business Profile from
these skills.

Read the topic for the current step:

| Step | Topic |
| --- | --- |
| Read a reference or target, download artifacts, network access | [Acquisition and transfers](reference/stripo-acquisition.md) |
| Create an email; document title, preheader and external metadata; renderer constraints for layout | [Creation and metadata](reference/stripo-creation.md) |
| Image jobs; attached, pasted or local images | [Images](reference/stripo-images.md) |
| Any document write, its recovery and saved-state verification | [Persistence and verification](reference/stripo-persistence.md) |

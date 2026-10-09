# Known email JSON and JS SDK limitations

This is the shared register of current limitations when reading, creating, or editing native
email JSON through the JS SDK. Read it before planning a JSON/SDK operation and consult the relevant
entry before attempting an affected change. Update this canonical document when a limitation
or its supported workaround changes; do not maintain separate copies in skill sources.

## Agent policy

- Treat a matching entry as authoritative for normal email creation and editing. Only the
  solutions and workarounds explicitly listed in that entry are available.
- If no solution is listed, there is no supported solution for this workflow. If the listed
  workaround cannot satisfy the user's request, treat that part of the request as unsupported.
- When no listed solution or suitable listed workaround is available, stop the affected operation
  immediately. Do not research alternatives, retry equivalent mutations, invent SDK/JSON fields,
  or try unlisted HTML/CSS tricks.
- Use a listed workaround only when it fits the requested content and behavior. Do not silently
  change semantics or shared settings merely to imitate the requested appearance.
- Complete independent supported work. In the final result, report the limitation, the part of
  the request that remains unmet, and whether a listed workaround was used or did not fit. Do
  not claim the unsupported operation succeeded.

The absence of an entry does not establish that an operation is supported; follow the normal
SDK and validation workflow for operations not covered here.

## JSON-001: Mobile font size for an individual paragraph

- **Limitation:** A native text block's individual paragraph (`p`) cannot currently receive its
  own mobile font size through email JSON or the JS SDK. Its mobile font size is hardcoded to
  **14px**.
- **Impact:** A request to display a specific paragraph at another mobile font size cannot be
  fulfilled while keeping that text an ordinary paragraph through this workflow.
- **Supported solution:** None.
- **Allowed workaround:** Use a heading element (`h1` through `h6`) for the text and configure
  that heading level's mobile `fontSize` in the document-wide `settings`, for example
  `settings.headings.h1.fontSize.mobile` for `h1`. This changes the text's semantics and uses
  shared heading settings, so it is not suitable for every paragraph or
  request. Use it only when those consequences fit the requested content and design.
- **Agent action:** Do not attempt a per-paragraph mobile font-size mutation or search for
  another workaround. If the heading workaround is appropriate, use it and report the
  substitution. Otherwise, leave the paragraph as a paragraph, continue independent work, and
  report the unmet mobile font-size requirement and the fixed 14px limitation in the final
  result.
- **Evidence:** User-reported current limitation and workaround, recorded on 2026-10-09.

## Adding an entry

Use a stable ID and keep the scope specific. State `None` explicitly when no supported solution
or workaround is available; an empty or omitted solution is not permission to invent one.

```markdown
## JSON-NNN: Short problem name

- **Limitation:** Affected operation, element, breakpoint, and scope.
- **Impact:** What cannot be achieved for the user.
- **Supported solution:** Exact supported solution, or None.
- **Allowed workaround:** Exact permitted workaround and its limits, or None.
- **Agent action:** What to skip, what may continue, and what to report in the final result.
- **Evidence:** Source and date of the recorded limitation.
```

# Host notes: Claude Code and Codex

This skill is installed by the Stripo plugin. Both hosts run its commands with their shell tool
and call MCP tools themselves. This file is the host contract the skill refuses to infer.

## Prerequisites

Install these once, before the first run. They are not part of the plugin download.

- Node.js 20+ and `curl` on `PATH`.
- Python **3.11 or 3.12** with the finalizer's dependencies:

  ```bash
  python3 -m pip install -r <bundle-root>/packages/brandkit-runtime/requirements.txt
  ```

  Not 3.13 or newer: `brandkit_runtime/validation.py` carries a docstring holding an unpaired
  `\ud800` escape, which those versions refuse to compile, so `finalize.py` fails on import before
  it does anything. Point the commands at a 3.11/3.12 interpreter until the bundle ships a fix.

- The extraction scripts' own dependencies, installed in place so `node` resolves them:

  ```bash
  cd <skill-dir>/scripts && npm install && npx playwright install chromium
  ```

`<skill-dir>` is the directory holding this file (`${CLAUDE_SKILL_DIR}` in Claude Code) and
`<bundle-root>` is two levels above it (`${CLAUDE_PLUGIN_ROOT}` in Claude Code).

## Browsing

The homepage pass never dials a target directly: without a browser route it stops before Phase 1
with `PUBLISHER_BROWSER_PROXY_URL is not set`. Arm exactly one route in the environment the shell
tool inherits.

- **Local Chromium through an HTTP proxy** — set `BRANDKIT_BROWSER_PROXY_URL` to an
  `http(s)://[user:pass@]host:port` proxy this machine may use. Playwright drives the Chromium
  installed above, and the proxy is the egress.
- **Browserbase** — set `BROWSERBASE_API_KEY` and `BROWSERBASE_PROJECT_ID`. The remote browser
  owns its egress and `BRANDKIT_BROWSER_PROXY_URL` stays unset.

There is no `website_access` approval in this host and no publisher proxy behind it. A refusal
here is a proxy or a Browserbase fault, never a missing grant: report it and stop rather than
asking a human for an approval that does not exist.

## Artifact root

`${BRANDKIT_ARTIFACTS_ROOT}` is a fresh temporary directory per run — create it with `mktemp -d`
and paste the absolute path into every command. Do not write run artifacts into the user's
project. Keep the same root for the satellites: the `technical dir:` line in their envelope is
`${BRANDKIT_ARTIFACTS_ROOT}/technical/<slug>` resolved to an absolute path.

## Write scope: one Stripo project

A Business Profile belongs to one Stripo project, so every Phase 5 call carries its `projectId`.
Resolve it before Phase 5, never during it:

1. `whoami` for the account.
2. `find_projects` for the projects it can reach.

Use the single project when there is exactly one. When there is more than one and the request did
not name it, ask the user which project to write to. Never guess, and never fall back to a project
the user did not confirm — the write replaces whatever that project holds.

## MCP server and routing

The host provides the Stripo MCP server as `stripo-mcp`, or `stripo-mcp-dev` / `stripo-mcp-stage`
when it points at a non-production environment. When more than one of them is connected, ask the
user which one to write to before resolving the project. The chosen server is the `<SERVER>` in
the Phase 5 cells, so `tools.mcp__<SERVER>__prepare_business_profile_upload` is that server's
`prepare_business_profile_upload`. Both Phase 5 write calls take the resolved `projectId`:

- 5a — `prepare_business_profile_upload(projectId)` → `{uploadId, uploadUrl}`
- 5c — `replace_business_profile(projectId, uploadId, website)`

Authorization is per host, through OAuth (Claude Code: `/mcp`; Codex: the browser login the
`mcp-remote` bridge opens on its first start, or `codex mcp login stripo-mcp` for a server
configured by `url`). Never paste tokens or credentials into the conversation, command arguments
or files.

## Artifact transfer

Phase 5b sends the composed `brandkit.json` with the helper this host installs beside the skill:

```bash
<skill-dir>/scripts/upload_via_proxy.sh \
  --url <uploadUrl> \
  --input ${BRANDKIT_ARTIFACTS_ROOT}/<slug>/brandkit.json \
  --failure-document ${BRANDKIT_ARTIFACTS_ROOT}/technical/<slug>/persist-write.json \
  --content-type application/json
```

`uploadUrl` is a presigned S3 `PUT`; the helper sends the file and writes the `stage: "5b"` failure
document when the transfer does not return 2xx. `--organization-id` is accepted and ignored:
that flag names a Reteno organization, and on Stripo the scope is the `projectId` that 5a and 5c
already carry.

## Approvals

There is no Slack card and no proactive-mutation proxy here. The host's own permission prompt gates
the write, and a denial arrives as a tool error on the 5a or 5c call, which those cells already
record in `persist-write.json`. The `-32040` / `-32041` refusal codes belong to the Slack-gated
host and do not appear in this one.

## What this host does not wire

The finalizer's Python MCP route (`BRANDKIT_HOST_ADAPTER`) is not configured: a Python subprocess
here has no way to reach the host's authorized MCP session. Two consequences, both expected:

- **Logo hosting is unavailable.** It is unavailable on Stripo regardless — `mcp-tools.json` lists
  `prepareImageUpload` and `uploadImage` as unsupported — so a logo is recorded by its public URL
  and the run continues. The report's logo row names the failure; that is the correct outcome, not
  something to work around.
- **Phase 5d reads nothing back.** `report` still prints the persist line, as
  `persisted but unverified (the read-back call failed)`. Report that line as it stands. Do not
  call the read tool yourself to improve it — Phase 5 forbids it, and a second read cannot change
  what the write already did.

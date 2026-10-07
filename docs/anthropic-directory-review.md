# Anthropic directory review — Stripo 0.7.0

Prepared on 2026-10-06. This document records local validation and review evidence;
it does not establish Anthropic approval or a submitted appeal. The public plugin
identifier remains `stripo`.

## Evidence revision and scope

The original report scanned public commit
`3443fddd3a28ea7741552dc675b18519a8c3264e` (plugin 0.6.2). The existing draft
[PR #8](https://github.com/stripoinc/agent-plugin/pull/8) started at
`adb012fa732a793ad6f3cf2e77bffd9c33ef82e9` and prepares 0.7.0. These fixes build
on that draft, retaining its image generation/editing workflows and incorporating
the current upstream image-upload contract.

All code links below identify the fixed distribution commit `89c06e8559aebddff106fcfc22f4aec205f2fb37`.
The distribution is included in [PR #8](https://github.com/stripoinc/agent-plugin/pull/8).
The document itself can be in a subsequent documentation-only commit. If packaging changes again, refresh these links,
measurements and validation results against the actual submission commit.

The bundled SDK is `convo-email-agent` **0.2.17**, built from clean committed
upstream `901aa8ee24b1a301b77d7268f17bd1ba04d2d02f` with `sourceDirty: false`.
Its canonical editor revision remains
`9fe0771bd1219868d7053ef7e323dc3406329de3`. No editor repository files were changed.
The plugin version and SDK version are independent.

## Four credential findings requiring manual review

Please review these as false positives. None of these four cited locations reads
a machine credential and sends it to the mentioned host. We have retained the
ordinary word `pass`, loop variable names and standard namespace identifiers.
No artificial credential configuration was introduced.

| Finding | Fixed-release evidence | Explanation |
| --- | --- | --- |
| `email-from-reference/SKILL.md`: `pass` / `example.com` | [Instructions, lines 225–253](https://github.com/stripoinc/agent-plugin/blob/89c06e8559aebddff106fcfc22f4aec205f2fb37/plugins/stripo/skills/email-from-reference/SKILL.md#L225-L253); [image example, line 274](https://github.com/stripoinc/agent-plugin/blob/89c06e8559aebddff106fcfc22f4aec205f2fb37/plugins/stripo/skills/email-from-reference/SKILL.md#L274) | `pass` is ordinary English describing a compression step or argument passing. `example.com` is an illustrative website/email/image address in documentation. Neither denotes a secret or a credential store. |
| `inline-svg-logo-capture.js`: `pass` / W3C host | [Namespace constants, lines 5–6](https://github.com/stripoinc/agent-plugin/blob/89c06e8559aebddff106fcfc22f4aec205f2fb37/plugins/stripo/skills/business-profile/scripts/lib/inline-svg-logo-capture.js#L5-L6); [bounded traversal, lines 243–269](https://github.com/stripoinc/agent-plugin/blob/89c06e8559aebddff106fcfc22f4aec205f2fb37/plugins/stripo/skills/business-profile/scripts/lib/inline-svg-logo-capture.js#L243-L269); [second traversal, line 349](https://github.com/stripoinc/agent-plugin/blob/89c06e8559aebddff106fcfc22f4aec205f2fb37/plugins/stripo/skills/business-profile/scripts/lib/inline-svg-logo-capture.js#L349) | `pass` counts bounded DOM traversal rounds. The W3C strings identify the SVG and XLink namespaces; they are passed to DOM namespace operations such as `createElementNS`, not used as network destinations. |
| `svg-safety.js`: `pass` / XML or SVG namespace | [Decode loop, lines 87–99](https://github.com/stripoinc/agent-plugin/blob/89c06e8559aebddff106fcfc22f4aec205f2fb37/plugins/stripo/skills/business-profile/scripts/lib/svg-safety.js#L87-L99); [SVG wrapper, lines 110–118](https://github.com/stripoinc/agent-plugin/blob/89c06e8559aebddff106fcfc22f4aec205f2fb37/plugins/stripo/skills/business-profile/scripts/lib/svg-safety.js#L110-L118) | `pass` counts bounded string decoding rounds. Namespace text belongs to the SVG safety wrapper. These operations process markup locally; they do not retrieve credentials or send a request to W3C. |
| `.claude-plugin/plugin.json`: association of `pass` with `host` text | [Complete manifest](https://github.com/stripoinc/agent-plugin/blob/89c06e8559aebddff106fcfc22f4aec205f2fb37/plugins/stripo/.claude-plugin/plugin.json#L1-L20) | This is declarative plugin identity, publisher and listing metadata. It contains no credential value, environment lookup, credential-reading hook or outbound credential transfer. The reported association crosses unrelated instruction/metadata text. |

## Confirmed child-process environment issue: fixed

Previously, the browser adapter supplied `{...process.env, CI: '1'}` to the local
`chrome-devtools-mcp` child. That unnecessarily exposed unrelated parent environment
variables to the child. The original finding does not, by itself, establish remote
exfiltration of those variables.

The [driver options](https://github.com/stripoinc/agent-plugin/blob/89c06e8559aebddff106fcfc22f4aec205f2fb37/plugins/stripo/skills/business-profile/scripts/native-browser-server.mjs#L37-L62)
now copy only explicit OS path/user/shell/temporary-directory variables. This list
accounts for the fixed defaults inherited by the pinned MCP stdio transport
1.30.0. The driver uses the current Node executable and its installed, pinned
Chrome DevTools MCP 1.9.0 entry point. It attaches to an existing host-owned browser
session; it does not need proxy credentials or Node injection settings. Usage
statistics, CrUX integration and automatic update checks are disabled. The actual
[spawn site](https://github.com/stripoinc/agent-plugin/blob/89c06e8559aebddff106fcfc22f4aec205f2fb37/plugins/stripo/skills/business-profile/scripts/native-browser-server.mjs#L427)
uses these options.

Tests exercise the actual stdio child: a fake `STRIPO_TEST_SECRET`, `NPM_TOKEN`,
`NODE_OPTIONS` and `HTTP_PROXY` in the parent are absent from the child, while
required system paths and the fixed control flags remain available. A separate
test initializes the installed Chrome DevTools MCP driver and lists its tools
with the restricted environment. The existing native-browser suite and full
Brand Kit suite passed. Driver initialization does not establish a production
host/browser connection or live Stripo OAuth.

The scanner's separate [`http://${host}` occurrence](https://github.com/stripoinc/agent-plugin/blob/89c06e8559aebddff106fcfc22f4aec205f2fb37/plugins/stripo/skills/business-profile/scripts/native-browser-server.mjs#L376-L386)
is a `new URL()` hostname parser. It rejects invalid allowlist entries and does
not perform an HTTP request.

## Files previously too large to inspect

The SDK and its canonical validator are now readable, unminified ESM modules.
`packages/convo-email-agent/index.js` remains the public entry; exports and public
TypeScript declarations remain supported. The canonical schema/catalog/support
data are static ESM data modules, split at record/array boundaries without dropping
data. There is no runtime code download, opaque binary replacement, or private
checkout requirement for the supported plugin workflows.

Esbuild's module splitting preserves initialization and imports. Only modules
reachable from public entries are shipped. Each validator file has a SHA-256 in
its [manifest](https://github.com/stripoinc/agent-plugin/blob/89c06e8559aebddff106fcfc22f4aec205f2fb37/plugins/stripo/packages/convo-email-agent/editor-validator/manifest.json),
and `bundleSha256` hashes the sorted file-to-hash mapping. The same manifest is
recorded in `bundle.json`; validation also compares it with the SDK's `getContract()`.
The proprietary editor notice and bundled third-party license texts remain in
[NOTICE.txt](https://github.com/stripoinc/agent-plugin/blob/89c06e8559aebddff106fcfc22f4aec205f2fb37/plugins/stripo/packages/convo-email-agent/editor-validator/NOTICE.txt).

Measured package: **271 files**, largest text file **219,437 bytes** (limit:
strictly below 262,144); canonical validator: 92 inventoried files, 2,663,378
bytes in total. Validator inventory SHA-256:
`601faa25df39ad27525959006264950f84645b3b7132d338b5b8867867f27e2c`.

The canonical validator reproduced byte for byte in an independent temporary
build from the pinned editor revision and exact dependency locks. SDK tests
compare all packaged canonical data with its source, compile/run a consumer in
isolation, create/edit a document and exercise the optional private runtime.
A separate local differential check compared the old and modular validator's
public exports and 340 snapshot/current-target validation results, with no
differences. The public plugin's validation also imports the installed SDK from
an isolated copy without a private checkout or installed SDK dependencies.

These changes meet the published file-count/size checks. Anthropic still needs
to rerun its inspection; local results cannot clear a remote scanner hold.

## Stripo name and publisher identity

Please manually review all three name-confusion findings and both publisher
findings. **Stripo** is the email creation/editing product at
[stripo.email](https://stripo.email/); the plugin serves that product and does not
claim to be Stripe or an integration published by Stripe.

Evidence checked on 2026-10-06:

- The public [stripoinc GitHub organization](https://github.com/stripoinc) identifies
  itself as StripoInc, links to `https://stripo.email`, and describes an online
  drag-and-drop email editor.
- Stripo's own [New Plugin: Extensions documentation](https://support.stripo.email/en/articles/11930155-new-plugin-extensions)
  links to repositories under `github.com/stripoinc`, including
  `stripoinc/stripo-plugin-samples`. This supplies a first-party link from the
  product's support site back to the publisher organization.
- The plugin manifest identifies its author as Stripo, website as
  `https://stripo.email`, and repository as `stripoinc/agent-plugin`.
- The owner selected the icon from the [Stripo Product Hunt listing](https://www.producthunt.com/products/stripo-email).

These public associations support the publisher review; they are not a legal
certification of ownership. If Anthropic requires additional organizational or
trademark verification, the owner must supply it. Renaming the plugin solely
because of a similarity warning is not proposed.

## Icon, README and license

The approved source icon's [512×512 CDN rendition](https://ph-files.imgix.net/b42bcb2d-ecca-4caa-8c7c-3954f08376a6.jpeg?fm=png&w=512&h=512&fit=scale)
was visually inspected and is packaged as `assets/stripo-icon.jpeg`. The server
returned JPEG bytes despite the format query parameter; the file extension and
manifest match the actual format. The original asset is 257×257, and this CDN
rendition scales it to 512×512 without changing the artwork. It is 8,674 bytes;
SHA-256 `5df347d74fb49cc5cf730350934430e5e968a8e7613a395beed81c7a559d956d`.
Claude uses its `icon` field; Codex uses `interface.logo` and `interface.composerIcon`.
Claude-only directory fields do not leak into the Codex manifest or marketplaces.

The plugin-root README covers installation, OAuth, dependencies, capabilities,
data transfers and limitations. The public host still does not support website
profile extraction. Browser components remain because the shared skills,
reference documents and script imports reference them; removing only the driver
or shared SVG helpers would leave an incomplete package. The supported email
evidence workflow needs neither Python nor browser setup.

The owner approved the repository-root [Stripo Agent Plugin License, Version 1.0](https://github.com/stripoinc/agent-plugin/blob/89c06e8559aebddff106fcfc22f4aec205f2fb37/LICENSE).
It is copied verbatim into the plugin root. `plugin-metadata.json` declares
`packageFiles.LICENSE: "LICENSE"` and the custom identifier
`LicenseRef-Stripo-Agent-Plugin-1.0`. Both manifests contain this identifier;
the file is inventoried and preserved on sync. The generator does not alter the
terms or substitute an open-source license for the proprietary editor code.
Separately licensed components retain their original notices and terms. The
presence of this approved license resolves the local missing-license check;
Anthropic must still review and validate it under its own directory rules.

## Local validation and remaining gates

| Check | Result |
| --- | --- |
| Upstream SDK, CLI, package and contract tests | 562 passed across 20 files |
| Native browser tests | 22 passed, including actual child-environment and driver-start tests |
| Full Brand Kit suite | 198 passed; Chromium tests rerun with OS launch permission after a sandbox launch denial |
| Canonical validator reproduction | Byte-for-byte match at the unchanged editor pin |
| Public `npm test` | 13 passed, including license/icon rejection and isolated installed SDK checks |
| `npm run validate` | Passed, including the approved LICENSE, both manifests, icon, limits, integrity and isolated SDK |
| `npm run validate:claude` | Both marketplace and plugin passed `--strict` on Claude CLI 2.1.281 |
| `npm run check:generated` | Passed; repeated sync produced identical bytes and file permissions |
| `npm run check:version -- --base origin/main` | Passed: 0.6.2 → 0.7.0 |
| `git diff --check` | Passed in both repositories |

The synthetic license and icon used by packaging test fixtures are test data only;
they do not enter this distribution or waive its real license gate. The new CI
configuration covers Node 20.18.1, 22 and 24; see the actual
[PR checks](https://github.com/stripoinc/agent-plugin/pull/8/checks) for remote CI status.
Live OAuth, MCP persistence and an
Anthropic directory scan were not performed by these local checks.

## Authorized publication and revalidation procedure

1. Verify that the reviewed license and packaged copy remain identical, then
   update this document's revision and measurements if the distribution changed.
2. Run `npm run validate`, `npm test`, `npm run validate:claude`,
   `npm run check:generated`, `npm run check:version -- --base origin/main`, and
   `git diff --check`. Use Claude CLI 2.1.281 for the strict schema checks. Confirm
   clean upstream provenance and inspect the release diff; do not hand-edit
   generated skills or SDK files.
3. Only on the owner's separate publication instruction, push the reviewed
   commit to the draft release branch and wait for its actual CI. Publishing,
   merging and directory submission are separate decisions.
4. In the Anthropic listing, select the fixed commit and click **Re-validate**.
   Confirm that the new report SHA is the published release SHA, not the old
   `3443fdd` scan or the previous draft head.
5. Verify that License missing and No icon are cleared and that all files were
   inspected. Review the real environment finding separately from the four
   false positives. Request manual review of any remaining credential holds,
   all three name findings, and both publisher findings using the pinned
   evidence above. Do not treat a missing finding in a partial scan as clearance.
6. Record the resulting report SHA/status and any requested owner evidence.
   Proceed to submission only with explicit authorization and the required
   blocker/hold resolutions.

Rules checked against the [Anthropic pre-submission checklist](https://claude.com/docs/plugins/pre-submission-checklist),
[Claude plugin manifest reference](https://code.claude.com/docs/en/plugins-reference),
and [OpenAI plugin submission documentation](https://developers.openai.com/plugins/deploy/submission).

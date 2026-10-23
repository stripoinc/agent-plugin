# Maintaining the Stripo plugin

The repository root is an installable plugin, with the same `skills/`, `packages/`, `assets/`
and host manifests layout as Reteno's plugin. Both marketplaces point to `./` and retain the
`stripo@stripo` identifier. There is no second copy under `plugins/stripo/`.

## Ownership

| Files | Edit or update |
| --- | --- |
| `skills/*/SKILL.md`, references, host notes and `agents/openai.yaml` | Edit here. These are the supported Stripo workflows and are never replaced by SDK sync. |
| `plugin.json` | Canonical portable identity and OpenAI listing/onboarding settings. |
| `.claude-plugin/plugin.json` | Claude listing and Client ID configuration; keep shared identity/version fields equal to `plugin.json`. |
| `.codex-plugin/plugin.json` | Generated compatibility manifest from `plugin.json`. |
| Both `marketplace.json` files | Native catalogs; keep the root source and stable plugin identifier. |
| `packages/convo-email-agent/`, email `scripts/`, creation brief schema/example | Imported unchanged from a clean `convo-email-agent` Stripo build through `scripts/sync-bundle.mjs`. |
| `release.json` | Generated provenance, import ownership and hashes; never edit to hide an uncommitted build or SDK change. |
| `evals/`, maintenance scripts and tests | Edit here; these are not part of the curated install package. |

The shared SDK, public exports, types and canonical editor validator remain intact, including
required shared modules and license notices. The unsupported Business Profile website runtime
and its dependencies are not imported. Provider instructions and file-transfer commands have one
copy in `skills/email-model-editor/`; creation and profile workflows link to that shared contract.

## Local checks and package

```sh
npm ci --ignore-scripts
npm run generate
npm run validate
npm test
npm run validate:claude
npm run check:version
npm run package -- work/stripo-0.12.0
```

Generation refreshes only the Codex compatibility manifest and release hashes. It refuses to
re-hash changed or missing imported files. Update the version in both native source manifests
before releasing distribution changes. The version guard compares against `origin/main` by
default and also understands the old nested layout for this migration.

The package command requires a new output directory and copies only the release inventory.
It excludes evals, maintenance scripts, node_modules, Git/IDE data and local worktrees. To build
an archive, zip that directory's contents, including dot directories. Keep the root manifests,
skills and packages together. Local validation includes package limits, links, manifests,
provenance, validator hashes and an isolated runtime check without development dependencies.
Tests also build and mutate a native model using the packaged commands.

## Update the shared SDK

Build in a clean committed `convo-email-agent` checkout; preserve any unrelated local changes.
Follow that repository's instructions and run its SDK/editor-contract tests. Then import its
Stripo distribution:

```sh
node scripts/sync-bundle.mjs \
  --bundle /path/to/clean/convo-email-agent/dist/convo-email-agent/stripo \
  --version <next-plugin-version>
```

Sync stages the import in a temporary package and validates it before changing this checkout.
It replaces only the explicit shared-runtime inventory, updates both source manifest versions,
and regenerates the compatibility manifest and release hashes. Stripo instructions and evals
stay byte-for-byte unchanged. Review upstream workflow/reference changes separately and apply
relevant Stripo changes here; a successful import does not prove behavioral compatibility.

`--base <older-ancestor>` permits rebuilding an unpublished version newer than that base.
`--allow-dirty` is only for local testing: provenance remains dirty, and normal validation and
release packaging reject it. Do not change the editor pin or validator code as a packaging cleanup.

## Behaviour evals

`evals/` contains ten Claude plugin eval cases. They test skill routing, onboarding, preservation
of edit scope, and refusals for sending/unrelated work. Every case loads this root plugin with
`plugins: ["../.."]`. Keep prompts, graders and the screenshot fixture when restructuring.

```sh
npm run eval:smoke
npm run eval:indirect
```

These are real model calls through the signed-in Claude CLI account. Smoke uses one run per
case; indirect uses five and `--scaffold` for the screenshot fixture. Results are ignored under
`evals/results/`. These cases have no Stripo MCP connection and cannot establish authentication,
live persistence or visual correctness. The fixture writes only its screenshot into the eval
workspace. Static eval checks run with `npm test`; model eval outcomes must be reported separately.

## Format references

- [OpenAI plugin packaging](https://developers.openai.com/plugins/build/plugins)
- [Claude plugin manifests](https://code.claude.com/docs/en/plugins-reference)
- [Claude plugin evals](https://code.claude.com/docs/en/plugin-evals)

The portable root manifest follows current OpenAI guidance; the Codex compatibility manifest
and Claude manifest preserve host support. The historical directory review in
`anthropic-directory-review.md` describes its pinned release, not this refactor's verification.

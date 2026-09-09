# Tool Contracts

Run packaged scripts with Node from the skill directory. The normal runtime path is:

```bash
node ${BRANDKIT_SKILL_ROOT}/scripts/homepage-pass.js --url "https://store.example" --slug "store-example" --artifacts-root ${BRANDKIT_ARTIFACTS_ROOT}
node ${BRANDKIT_SKILL_ROOT}/scripts/assemble-extraction-stage.js --mode scaffold --slug "store-example" --artifacts-root ${BRANDKIT_ARTIFACTS_ROOT} --url "https://store.example" --pretty
node ${BRANDKIT_SKILL_ROOT}/scripts/assemble-extraction-stage.js --mode normalize --input ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/brandkit.extraction.json --slug "store-example" --artifacts-root ${BRANDKIT_ARTIFACTS_ROOT} --url "https://store.example" --pretty
```

Standalone wrappers remain available for focused fallback/debug passes after the homepage batch:

- `capture-page.js`
- `assemble-extraction-stage.js`
- `dom-hierarchy.js`
- `language-subtree.js`
- `background-styles.js`
- `text-styles.js`
- `button-styles.js`
- `product-card-styles.js`
- `run-playwright-fix.js`
- `run-scratch-probe.js`
- `save-logo-asset.js`
- `extract-svg-path.js`
- `normalize-cyrillic-text.js`
- `render-brand-kit-html.js`

## Wrapper Flag Matrix

Agents should not read wrapper source to discover basic flags. Standalone wrappers consume generic
`--selector` for selector-focused probes; product-card-specific sub-element flags are supported
only where listed.

| Wrapper | Basic example | Selector flags |
| --- | --- | --- |
| `capture-page.js` | `--url "https://store.example" --out ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/capture.json --screenshot ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/home.png --pretty` | none |
| `dom-hierarchy.js` | `--url "https://store.example" --out ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/dom.json --pretty` | none |
| `background-styles.js` | `--url "https://store.example" --selector "body" --out ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/background-styles.json --pretty` | repeat `--selector <css>` |
| `text-styles.js` | `--url "https://store.example" --selector "h1" --out ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/text-styles.json --pretty` | repeat `--selector <css>` |
| `button-styles.js` | `--url "https://store.example" --selector "a, button" --out ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/button-styles.json --pretty` | repeat `--selector <css>` |
| `product-card-styles.js` | `--url "https://store.example" --selector ".product-card" --price-selector ".price" --old-price-selector ".old-price" --cta-selector ".buy" --out ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/product-card-styles.json --pretty` | repeat `--selector <css>` for card roots; optional repeat `--price-selector <css>`, `--old-price-selector <css>`, `--cta-selector <css>` |
| `language-subtree.js` | `--url "https://store.example" --selector "[lang], .language" --out ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/language-subtree.json --pretty` | requires at least one `--selector <css>` |
| `run-playwright-fix.js` | `--url "https://store.example" --actions-file ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/page-actions.json --out ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/page-fix.json --pretty` | none; actions file supplies bounded selectors |
| `run-scratch-probe.js` | `--url "https://store.example" --slug "store-example" --artifacts-root ${BRANDKIT_ARTIFACTS_ROOT} --script ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/scratch/probe.mjs --question "Narrow question?" --with-browser --pretty` | none; scratch script owns its bounded question |

`run-playwright-fix.js --actions-file` accepts JSON actions only.

`save-logo-asset.js` caveat: it re-fetches the asset through the thread's approved browser proxy,
which admits only the hosts the egress grant covers — so a logo on a third-party CDN is refused
there. `homepage-pass.js` already keeps the SVG logo bytes the render downloaded (`logo-assets.json`
plus the `logo-assets/` sidecar directory) and the scaffolder pre-fills `brand.logos[].svgPath` from
them, so on the normal path there is nothing left for `save-logo-asset.js` to do.

Do not inspect extraction schemas with `jq`, `cat`, or `grep` during normal extraction. Use the
SKILL canonical hints and run `assemble-extraction-stage.js --mode normalize`; inspect schema files
only after normalize reports a concrete schema error.

`run-scratch-probe.js` executes narrow, run-local evidence probes from
`${BRANDKIT_ARTIFACTS_ROOT}/technical/<slug>/scratch/` and appends
`scratch/scratch-manifest.json`. Scratch output is technical evidence only. It must not write
public JSON, patch `${BRANDKIT_SKILL_ROOT}`, install packages, crawl secondary pages, or leak scratch
paths into public fields. See `scratch-probe-contract.md`.

If `homepage-pass-status.json` has `status: "running"` and the status-file heartbeat is fresh or
`currentPhaseElapsedMs` is still increasing, wait instead of starting a duplicate batch. The
stale threshold is 5 minutes (300000 ms) with no status-file update and no `currentPhaseElapsedMs`
increase. If the pass is clearly stale, rerun the homepage pass at most once; after that,
use standalone packaged wrappers or `run-scratch-probe.js` for specific missing evidence only.
But a pass that reports `failed` twice is the **Homepage pass failed** stop condition — do not
probe for evidence the pass never captured. Do not rebuild the whole homepage pass with inline
Node browser scripts.

`homepage-pass.js` owns the only security-interstitial retry: at most one residential
publisher-proxy fallback, only after provider-specific live evidence, and only after the standard
session release is confirmed. Callers must not reproduce the transition with a second command,
request a fallback in direct-API mode, or switch to local Chromium. The pass promotes capture/DOM/
page-signals and the screenshot only from the selected attempt, then runs the expensive style,
logo, product, button, language and salient-text probes exactly once.

The extraction skill writes `brandkit.extraction.json`; runtime writes final `brandkit.json` and `brandkit.html`.

## Assembly Contract

`assemble-extraction-stage.js --mode scaffold` is a reducer over saved homepage artifacts that writes
a shape-safe candidate `brandkit.extraction.draft.json` plus `assembly-diagnostics.json`. It may
project public-safe candidate records and structural fields, but it must not be treated as the owner
of brand role decisions.

The agent owns role decisions. Review the saved screenshot, DOM, and focused probe artifacts before
deciding which candidate colors, typography, buttons, links, logos, and product-card summaries
survive into the extraction-stage JSON. The required decision flow is screenshot -> DOM hierarchy ->
probe candidate selectors -> decide public roles.

`assemble-extraction-stage.js --mode normalize --input <path>` validates, sanitizes, canonicalizes
known aliases, and refreshes diagnostics for an agent-authored extraction-stage draft. Normalize
must not invent missing evidence or make new brand role decisions.

Public output rules are:

- Normalize internal `usageHints` aliases into canonical downstream names before writing JSON.
- The scaffolder picks the representative product-card row and emits the matching top-level `brand.typography[]` mirrors (`product-price-typography`, `product-old-price-typography`) deterministically when reliable evidence supports them. The agent MUST NOT add or remove these mirror tags — see SKILL.md "Role-tagging contract".
- The scaffolder also emits the `brand.components.button[]` mirror record tagged `product-card-cta` from the same evidence when a reusable visible-text CTA is captured. The agent does not author this mirror. `product-card-cta` reusability is for visible-text CTAs only; icon-only product actions remain valid component evidence under `productCard[0].cta` and are not a defect.
- Do not run scratch or recovery just to find visible text when the observed homepage product actions are icon-only; use neutral `missingEvidence` wording such as `"no reusable visible-text product-card CTA observed; use primary button fallback for text CTA styling"`.
- Product-card CTA hover, typography, and layout come from `product-card-styles.json` or `product-card-styles.recovery.json` first. Generic `button-styles.json` may support generic site button records, but must not override product-card-specific CTA hover evidence.
- Write `assembly-diagnostics.json` after scaffold and normalize. If diagnostics report recoverable homepage evidence gaps, rerun only the focused packaged probe for that gap, update the draft from saved evidence, then rerun normalize.

Do not infer missing product price, old-price, CTA padding, or logo URL from screenshot pixels alone.
Screenshots are for visual sanity checks and for deciding whether a focused packaged rerun is justified.

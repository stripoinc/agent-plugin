<!-- Moved out of SKILL.md by the 0.3.0 contract split. The text below is
     verbatim from SKILL.md at sha256 6cdd8d5975fa8aca548fbe00d5507260bf6d5ec6522d61ddaa0e4fa512ef9609. -->

# Decision rules and per-role decision flows

Recovery budget, candidate confidence bands, and the colour / link / description / button flows.

The four files of this family, each readable in one tool call:

- [`decision-flows.md`](decision-flows.md) — goal, output layout, the full prose for every default command, the runtime-facing scripts, the reference index.
- [`workflow-phases.md`](workflow-phases.md) — phases 1-3 in prose, the targeted-edits worked example, and what the scaffolder pre-tags for you.
- [`role-decision-rules.md`](role-decision-rules.md) — recovery budget and confidence bands, then the per-role flows: colour, region-scoped links, important links, descriptions, button preservation.
- [`extraction-stage-json.md`](extraction-stage-json.md) — the extraction-stage JSON, the canonical `usageHints` enums, product-card specifics, the variant pick, and the hard rules in full.

## Decision Rules

**Required.**

- **Recovery has a budget.** When `homepage-pass.js` partially fails or `readyForAssembly: false`: at most one homepage-pass rerun for transient failures (browser-target crash, screenshot timeout); one round of focused packaged probes for missing specific evidence (batched parallel); at most three scratch probes for narrow residual questions (each ≤ ~150 lines, output ≤ 50 KB, total runtime < 1 minute). Beyond that, accept partial — author `brandkit.extraction.json` from what is available and mark gaps with `missingEvidence`. Do not loop. Do not reconstruct the homepage batch with inline Node.
- **Icon-only product-card actions are valid evidence.** Do not chase CTA text that is not on the page — see [Product-card specifics](#product-card-specifics) for the canonical statement and the `missingEvidence` note, and [Role-tagging contract](#role-tagging-contract) for the hint-exclusivity rule that follows.
- **Cookie/modal/locale gates.** If the homepage is hidden behind a cookie/modal/locale state, write one small JSON actions file and rerun the homepage batch once, then rerun scaffold. If blocked by a security interstitial (per the Stop conditions), do not issue another retry; any eligible residential attempt was already managed inside the packaged pass.
- **Pre-ranked candidates are the fast-path.** `assembly-diagnostics.json.candidates` carries deterministic role recommendations from the saved evidence (canvas-background, button-primary, heading-typography, body-typography, heading-text, body-text, logos). For `canvas-background` and `button-primary`, the scaffolder already pre-emits the top candidate (confidence ≥ 0.5) directly into `brand.colors.{backgroundColors, accentColors, textColors}` — for `button-primary`, when no button-styles bucket reaches that floor, the seed is the product-card CTA majority (`source: "product-card-cta"`) — see [Scaffolder pre-tags](#scaffolder-pre-tags); you confirm the seeds against the screenshot rather than copying them. For typography and logos: at confidence ≥ 0.85, copy the value with one screenshot sanity check; at 0.50–0.85, verify against one anchor (screenshot or one targeted `jq` read) before keeping; below < 0.50 or empty, fall back to the manual flows in [Decision Flows](#decision-flows). Override the top candidate when screenshot evidence contradicts it, when a `button-primary` candidate is a lone icon control that is not the page's purchase CTA (a candidate whose `source` is `product-card-cta` IS the purchase CTA — keep it), or when two candidates have similar confidence and your evidence prefers the second. **The bands are about how hard to check a value, never about whether you are permitted to write it.** For the five typography region roles and the two text-colour region roles the permission comes from the [Role-tagging contract](#role-tagging-contract) alone, and a confidence in the copy band grants none: a `"source": "salient-text"` entry is licensed only where the run records that role at `severity: "gap"`. Those entries are published on one other occasion — where the mapper resolved the role but the size/weight bucket that ranks it came out empty — and there the entry's own `evidence` string says so and says not to copy it. Read that string before you copy anything from this block; a row set from an unlicensed entry is recorded as `value_not_measured`, and it SHIPS that way — the run no longer stops, so this rule is the only thing standing between the account and a value nothing measured.

**Preferences.**

- **Use the right tool for the question.** Packaged probes are the primary path; reach for `jq` or `rg` for narrow field reads. Use `run-scratch-probe.js` (governed by [scratch-probe-contract.md](references/scratch-probe-contract.md)) only when no packaged probe matches the question. Edit `brandkit.extraction.json` via `jq '.path = ...' input > tmp && mv tmp input` — see [Hard rules — Authoritative source](#hard-rules) for the forbidden forms (heredocs, mega-`jq` assignment, `cp draft → main + jq` rewrite-in-disguise) and the [worked example](#targeted-edits-vs-wholesale-rewrites--worked-example) above.
- **Run independent probes in parallel.** Background, text, button, and product-card probes have no dependencies; issue them as a single parallel tool-call message.
- **Trust visible evidence over reconstruction.** Inspect the saved screenshot and DOM hierarchy before accepting a contested scaffolded role choice. The screenshot triggers diagnosis (a missed product surface, a wrong canvas color) — but do not infer `priceColor`, `oldPriceColor`, or `ctaPadding` from pixels alone. Those fields need DOM-grounded probe evidence.
- **Preserve schema discipline.** Do not inspect `references/*.schema.json` with `jq`/`cat`/`grep` during normal extraction. The complete enum lists for color, typography, and button `usageHints` are surfaced at `assembly-diagnostics.json.usageHintEnums.{colorUsageHintList, typographyUsageHintList, buttonUsageHintList}` — read from that file (mirrored verbatim from the schema $defs) instead. Run `--mode normalize` to validate. Inspect schema files directly only after normalize reports a concrete schema error.
## Decision Flows

Most role decisions are covered by [Decision Rules](#decision-rules) and [Role-tagging contract](#role-tagging-contract) above. The flows below capture per-role specifics where the rules need more concrete guidance.

**Verification after normalize.** Re-open `brandkit.extraction.json` after `--mode normalize` exits and confirm intended arrays are still populated:
- `brand.colors.backgroundColors` must be non-empty when `assembly-diagnostics.json.candidates.canvas-background` has any entry with `confidence >= 0.3`.
- `brand.colors.accentColors` and `brand.colors.textColors` must each be non-empty when `button-primary` candidates exist (the confidence-gated pre-emit seeds both — see [Scaffolder pre-tags](#scaffolder-pre-tags)).
- `brand.typography` must be non-empty when `body-typography` or `heading-typography` candidates exist.
- `brand.components.button` must be non-empty when `button-primary` candidates exist.
- `brand.logos` must be non-empty when `logos` candidates exist.

If you intentionally leave one of these empty, document the reason in `assembly-diagnostics.json.roleChoiceJustifications`. An unjustified empty field is a **warning** in `finalize-report.json`, never a refusal: the CLI stopped rejecting the run over it, because blocking on "the field is empty" persisted nothing and so kept it empty. The justification is what turns a reported gap into a recorded decision — nothing forces you to write one, which is why writing it is on you.

**Pre-ranked candidate role mapping** (`assembly-diagnostics.json.candidates`):
- `canvas-background` → `brand.colors.backgroundColors[]` with `usageHints: ["canvas-background"]`. Value is a hex string.
- `button-primary` → `brand.components.button[]` with `usageHints: ["button-primary-background"]` (and matching color records under `accentColors`/`backgroundColors`). Value is `{backgroundColor, fontColor, borderRadius, layoutIntent}`.
- `heading-typography` → `brand.typography[]` with `usageHints: ["heading-typography"]`. Value is `{fontFamily, fontWeight, fontSizePx, lineHeightPx, color}`.
- `body-typography` → `brand.typography[]` with `usageHints: ["body-typography"]`. Same shape as heading.
- `heading-text` / `body-text` → `brand.colors.textColors[]` with `usageHints: ["heading-text"]` / `["body-text"]`. Value is a hex string. These two are **fallback-only and usually empty**: they carry an entry only where the deterministic synthesis helper could not derive the role at all, which is the same run that records it as a `severity: "gap"`. Every entry they carry is marked `"source": "salient-text"`, which is the marker the bounded exception reads. That is the pairing the bounded exception in the [Role-tagging contract](#role-tagging-contract) is about.
- `logos` → top primary candidate is `brand.logos[]` `type: "primary"`; favicons add entries with `type: "favicon"`. Value is `{url, type, background, svgPath}` where `background ∈ {"light", "dark", "unknown"}` (default `"unknown"` — override only with screenshot evidence; `"any"` is NOT a valid enum value) and `svgPath` arrives **pre-filled** when the homepage pass captured the logo's SVG markup while rendering (`logo-assets.json`), and `""` otherwise. Copy whichever value the candidate carries verbatim; do not re-derive it — **including an empty `url`**, which is what an inline-`<svg>` logo legitimately looks like (Logo flow below).

Each candidate has shape `{value, confidence, evidence}`, plus `source` on entries derived from the selector-free capture (`salient-text.json`) rather than from a probe selector. Confidence bands and override conditions live in [Decision Rules → Pre-ranked candidate confidence bands](#decision-rules). One logo-specific note: when the top `img` candidate's `evidence` mentions `score < 8` and a much higher-resolution favicon is present, prefer the favicon.

**Color flow.** Inspect the screenshot, list visible roles, and map each to the correct channel BEFORE picking a usageHint:
- backgroundColors[] roles: canvas, content surface, header surface, footer surface, product-card surface, promo surface.
- accentColors[] roles: brand primary, brand secondary, promo accent, button primary background, product-card CTA background, current price, old price.
- textColors[] roles: heading text, body text, link text, header navigation link, footer text/link, button primary text, product-card CTA text.

A single visible color may appear in two channels (e.g. a brand red used both as the button background AND as the price emphasis text); when this happens, emit two separate records — one per channel — each carrying ONLY the hints that belong to that channel. Do NOT collapse them into one row by adding both channels' hints to a single record.

**Every `accentColors` / `backgroundColors` / `textColors` `value` must be a canonical `#rrggbb`, and the schema says so.** The list below is measured, one row per spelling through `--mode normalize`, not inferred:

| you write | outcome |
| --- | --- |
| `#abc`, `#ABC`, `#AABBCC`, `rgb(...)`, `RGB(...)`, `hsl(...)` | accepted — normalize rewrites it to lowercase `#rrggbb` |
| `rgba(r,g,b,a)` with **a > 0** | accepted — the alpha is dropped, the colour is kept |
| `rgba(r,g,b,0)`, `hsla(..., 0)`, `transparent` | **refused** — `normalizeColor` maps a zero alpha onto the literal `transparent` |
| `#rgba`, `#rrggbbaa` | **refused** — the 4-digit form expands to the 8-digit one |
| `linear-gradient(...)` | **refused** |
| `inherit`, `var(...)`, any bare word | **refused** |

A refusal happens at normalize AND again when the finalize CLI re-validates the artifact, and the message names the row's JSON pointer (`/brand/colors/accentColors/0/value must match pattern "^#[0-9a-f]{6}$"`) followed by the repair for each refused spelling. There is no justification key that excuses one.

**A gradient is not a `backgroundColors` value, and that is a decision rather than collateral.** The compiler writes this value into an HTML `bgcolor` attribute and a CSS `background-color`, and neither renders a gradient — the surface comes out unpainted. The hint vocabulary already agrees: `gradient-background` is in `USAGE_HINT_ALIASES` mapped to **nothing**. So when the probe reports a gradient (`background-styles.json` carries it in `backgroundImage` / `gradient`, never in `backgroundColor`), pick the one stop colour the surface reads as against the screenshot and write that, or leave the row out. This is not hypothetical: one kit in the historical run archive shipped `linear-gradient(90.7deg, rgb(62, 255, 31) …)` as its `footer-background`.

**A fully transparent value is not a brand colour either** — drop the row rather than guessing what shows through. This applies to the three colour-token arrays only. `transparent` remains valid component evidence, but the finalizer replaces a zero-width button `borderColor` with its background hex before Reteno persistence.

**The product-card surface goes the other way, on purpose.** A card whose `borderWidth` is exactly `0` draws no border, so the `borderColor` the probe reads off it is the browser's `currentColor` (the text colour), not anything visible; the scaffolder nulls `productCard[].borderColor` / `surface.borderColor` for a literal zero width and the card token mapper ignores such a colour, because that field feeds the `border_subtle` / `divider` tokens the email compiler paints as real dividers. The button field cannot take the same treatment: `buttonStyle.borderColor` is a required string in both schemas and the Brand Kit write drops any non-hex button colour from the row, while the card CTA renderers honour a zero `borderWidth` whatever colour sits beside it — so the button keeps a colour, and the one that can never draw a visible edge is its own background.

Map each role to candidate DOM selectors or page regions. Probe with `background-styles.js`, `text-styles.js`, `button-styles.js`, `product-card-styles.js`. Compare probes against the screenshot. If a visible color was missed, rerun only the affected probe with better selectors.

> **A re-probe OVERWRITES the artifact, so it must ADD selectors, never drop them.** The list above is the homepage pass's full default set; keep every entry and append your site-specific ones. `text-styles.json` is the evidence base the role-coverage gate grades against, so a narrowed re-probe deletes evidence a role was derived from and can turn a real producer fault into a false `gap` recorded as "the page does not offer this". Dropping `h2`/`h3` is the easiest way to do it: plenty of storefronts have no `<h1>` at all and carry every heading in `<h2>`. Sample parallel-batched invocation:

```bash
node ${BRANDKIT_SKILL_ROOT}/scripts/background-styles.js --url "https://store.example" --slug "store-example" --artifacts-root ${BRANDKIT_ARTIFACTS_ROOT} --selector "body" --selector "header" --selector "main" --selector "footer" --out "${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/background-styles.json"
node ${BRANDKIT_SKILL_ROOT}/scripts/text-styles.js     --url "https://store.example" --slug "store-example" --artifacts-root ${BRANDKIT_ARTIFACTS_ROOT} --selector "h1" --selector "h2" --selector "h3" --selector "p" --selector "a" --selector "button" --selector "[class*='price']" --selector "header a" --selector "[role='banner'] a" --selector "nav a" --selector "[role='navigation'] a" --selector "footer a" --selector "[role='contentinfo'] a" --out "${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/text-styles.json"
node ${BRANDKIT_SKILL_ROOT}/scripts/button-styles.js   --url "https://store.example" --slug "store-example" --artifacts-root ${BRANDKIT_ARTIFACTS_ROOT} --selector "button" --selector "[role='button']" --out "${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/button-styles.json"
node ${BRANDKIT_SKILL_ROOT}/scripts/product-card-styles.js --url "https://store.example" --slug "store-example" --artifacts-root ${BRANDKIT_ARTIFACTS_ROOT} --selector "[class*='product-card']" --price-selector ".price" --cta-selector "button[class*='buy']" --out "${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/product-card-styles.json"
```

When the DOM shows clearer candidates than the heuristic defaults, pass explicit `--selector`, `--price-selector`, `--cta-selector` rather than relying on probe heuristics.

**Region-scoped link selectors.** `homepage-pass.js` runs `text-styles.js` with both flat `"a"` and region-scoped variants (`"header a"`, `"[role='banner'] a"`, `"nav a"`, `"[role='navigation'] a"`, `"footer a"`, `"[role='contentinfo'] a"`). Each observation row records the `selector` that captured it. Use the scoped buckets when deciding link roles: `header-link` must be sourced from observations whose `selector` is one of the header/banner/nav scopes; `footer-link` from footer/contentinfo. Do not assign `header-link` or `footer-link` based on flat `"a"` rows alone — those mix product-card icon links, body links, breadcrumbs, etc. When the scoped buckets are empty for a region, omit the role rather than promoting a flat `"a"` color into it.

**Important links flow.** Start with header navigation (primary customer journeys). If header evidence is missing or too thin, fall back to left-side menu/category navigation; then footer navigation. Treat `importantLinksForBrandkit` as evidence to weigh, not automatic public output.

The downstream customise pipeline renders the first three `importantLinks` entries as the email's fixed-width header navigation row, so the curation discipline mirrors what a human designer would put in a header nav: short noun-phrase labels (typically one or two words; "Catalog", "Sale", "Brands", "Contact", "Delivery", "About", "Доставка та оплата"), top-of-funnel customer journeys, and one item per category. EXCLUDE long product titles, article slugs, promo prose with dates/SKU codes, locale toggles, account/wishlist, and legal pages — those belong in body copy, not nav. If `importantLinksForBrandkit` surfaces such candidates (e.g. product anchors that the probe's keyword regex matched on a body word), drop them at curation time rather than passing them through. Cap the final array at roughly six entries — enough for the downstream picker to choose a balanced top-3 without forcing it to discriminate against noise.

Normalize backstops this contract with `lib/important-link-name-cap.js`: any `importantLinks[]` entry whose `name.length > 40` is silently dropped (info-severity diagnostic). The 40-char cap is a physical-display constraint — the email header column cannot render that much text — not a curation target. Treat it as a hard floor that catches slips, not as license to pass long entries through; long entries never reach the email regardless of order.

**Description rule.** Each description must explain usage — how, when, and where the style is applied (primary CTA, promotional price, hero surface, category navigation, footer text, product title, product-card CTA, etc.). Do not describe raw tags, selectors, CSS declarations, or visual appearance alone.

**Description must not license a cross-channel tag.** The prose names visible roles; the `usageHints` array names the compiler-consumed tokens. They are not free to mirror each other — see the counter-examples in [Role-tagging contract → Color usageHint channel constraints](#role-tagging-contract).

**Button preservation.** Distinct visible-text buttons by *purpose* are separate records: primary CTA, secondary action, header utility (search, login, cart), footer/subscription submit, reusable category/promo controls. Two buttons sharing a single property (e.g. the same background color) are NOT structurally identical if their visible text or placement differs. Dedup applies only to true visual duplicates that share background, foreground, border-radius, layout intent, hover, AND functional purpose. (See [Role-tagging contract → Dedup](#role-tagging-contract) for the visual signature definition.)

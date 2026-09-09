# Brandkit Schemas

> **Audience:** downstream consumers (DB writers, validators, integrators) and operators reading the schemas. The agent does not consume this file at runtime — the agent's contract lives in `SKILL.md` plus the two JSON schemas this document references. Linked from SKILL.md "Reference index".

Use two schemas:

- `extraction-stage.schema.json` validates `artifacts/technical/<slug>/brandkit.extraction.json`.
- `schema.json` validates runtime-composed `artifacts/results/<slug>/brandkit.json`.

Extraction-stage output omits `brand.brandVoice`, `brand.businessContext`, and `brand.products`
(the voice and business-context fields are owned by satellite skills, products is composed by the
runtime from probe data — all three are added by the runtime), but otherwise keeps the same public field
shapes as final output for fields copied unchanged by the runtime. For example, `socials` must be
the full platform-keyed object from `schema.json`; `socials.links` is valid only in technical
artifacts, not in `brandkit.extraction.json`.

The normal flow is:

```bash
node ${BRANDKIT_SKILL_ROOT}/scripts/assemble-extraction-stage.js --mode scaffold --slug "<slug>" --artifacts-root ${BRANDKIT_ARTIFACTS_ROOT} --url "<url>" --pretty
node ${BRANDKIT_SKILL_ROOT}/scripts/assemble-extraction-stage.js --mode normalize --input ${BRANDKIT_ARTIFACTS_ROOT}/technical/<slug>/brandkit.extraction.json --slug "<slug>" --artifacts-root ${BRANDKIT_ARTIFACTS_ROOT} --url "<url>" --pretty
```

Scaffold produces a shape-safe candidate draft and diagnostics from saved homepage artifacts. The
agent owns brand role decisions from screenshot, DOM, and focused probe evidence, and decides which
candidate records survive into `brandkit.extraction.json`. Normalize validates, sanitizes,
canonicalizes known aliases, and diagnoses only.

Final output requires `brand.brandVoice` and may also carry an optional `brand.businessContext`
(`{customerValue, revenueModel}` — a two-sentence business-context assumption written by the
`brandkit-business-context-v-0` skill) and an optional `brand.products` (an array of up to 8 demo
products, each `{name, url, imageUrl, price, oldPrice, currency}`, projected by the runtime from the
homepage `product-data.json` probe; sites with no products carry `[]`).

`languages` is an array of deduped lowercase ISO 639-1 two-letter codes (e.g. `["uk","ru"]`). The
agent authors codes directly, and the runtime canonicalizes the extraction stage before composing
the final brandkit — reducing region subtags (`uk-ua`→`uk`), mapping common aliases (`ua`→`uk`,
`cz`→`cs`), deduping, and dropping non-conforming entries. It is a coercion, never a rejection, and
both schemas keep `languages` as a permissive string array (no `enum`/`pattern`) so previously
cached brandkits are never rejected on a refresh turn; an empty `[]` is valid.

`contacts.emails[]` and `contacts.phones[]` contain canonical, directly usable facts—not visible
labels such as “Email us” / “Call us” and not prose containing a fact. The current page-signals
producer emits typed `email` / `phone` fields beside the original `text` and `url`; scaffold and
finalize prefer those typed fields and require every published fact to match this run's evidence.

`roleProvenance` is an optional top-level object in the technical extraction-stage artifact, written
by `--mode normalize`. It is keyed by role hint and each value is
`{provenance, confidence}` — `provenance` one of `dom-measured`, `agent-recovered`,
`screenshot-sampled`, `defaulted`, `missing`, and `confidence` a number in `[0,1]`. It exists
because a styling value this capture could not prove is now WARNED about rather than refused, and
that trade is only defensible if the softness travels with the value: `dom-measured` means use it,
`defaulted` means use it but treat it as overridable, `missing` means do not read the field at all.
`agent-recovered` is produced only when `recover-role-styles.js` re-probes the exact DOM locator the
agent selected from this run's page/screenshot context and the measured value exactly equals every
published carrier. `screenshot-sampled` is color-only and requires an eligible failed exact re-probe,
an in-bounds region of this run's hash-bound `home.png`, and the named colour to occur in that decoded
pixel region. The binding also covers `text-styles.json` when present, so a captured-row typography
source cannot drift underneath an old recovery artifact. A typography fallback after failed
re-probe is never described as measured: normalize copies either a complete same-run captured row or
the role's fixed system tuple and grades it `defaulted`. The agent never authors `roleProvenance`
itself — normalize rebuilds it on every pass. It is optional so a technical artifact written before
the field existed still validates. Finalize consumes it for gap and warning classification, then
omits it from the account-facing `brandkit.json`: current email customization consumes the styling
values, not this diagnostic map, and optional diagnostics must never block persistence.

**An absent `roleProvenance`, or an absent entry in one, is not a claim.** A missing top-level object means the technical artifact predates the field or the pass produced none; it does NOT mean every role was measured. Current normalize output grades every styling hint in the extraction-stage artifact and also records required-but-absent roles as `missing`; the latter is the only positive statement that the kit is not carrying a role.

All public `usageHints` are canonical contract values. The assembler may accept historical or
internal aliases in technical evidence, but `brandkit.extraction.json` and final `brandkit.json`
must use canonical names such as `canvas-background`, `content-background`,
`button-primary-background`, `button-primary-text`, `product-card-cta-background`,
`price-current`, `price-old`, `body-typography`, `footer-typography`,
`product-price-typography`, `product-old-price-typography`, and `product-card-cta`.

Product-card evidence is neutral evidence under `brand.components.productCard[]` with
`description`, `evidenceQuality`, `confidence`, and optional public-safe style evidence. The
primary item summarizes the best reusable homepage card treatment by combining a representative
row with aggregate current-price and old-price evidence across reliable product rows.

Optional product-card fields include:

- `surface`: card background, border, and radius.
- `titleTypography`: product-name typography.
- `priceTypography`: current-price typography.
- `oldPriceTypography`: old/comparison-price typography.
- `cta`: text/source usability flags, compact/icon flags, colors, border, radius, padding, hover,
  and canonical layout intent (`full-width`, `content-sized`, `fixed-width`, `icon-only`, `unknown`).
- `missingEvidence`: public-safe notes about evidence gaps.

`product-card-cta` means reusable visible-text product-card CTA evidence only. Icon-only product
actions are valid component evidence, not a defect. They stay in `productCard[0].cta` with
`layoutIntent: "icon-only"`, `isIconLike: true`, and `hasUsableVisibleText: false`; they should be
treated by downstream compilers as a reason to fall back to a reusable primary button for text CTA
styling. Do not run scratch or recovery just to find visible text when the observed homepage
product actions are icon-only. When no reusable visible-text product-card CTA is observed, use the
neutral `missingEvidence` note `"no reusable visible-text product-card CTA observed; use primary button fallback for text CTA styling"`.
When reusable visible-text product-card CTA evidence is captured, the normalize step's
`tagProductCardCtaMirrors` helper deterministically tags the matching
`brand.components.button[]` record with `product-card-cta`; downstream systems then see a
reusable CTA box-style source without icon-only product actions being mis-treated as buttons.
The purchase COLOUR of an icon-only card action is still brand evidence: when no text button
reaches the pre-emit floor, the scaffolder seeds `button-primary-background` from the card
majority, and the consumer sizes that button itself.
The agent does not author this mirror — see SKILL.md "Role-tagging contract".
Product-card CTA hover, typography, and layout should be sourced from product-card technical
artifacts first; generic site button evidence is not authoritative for product-card CTA hover.

Public JSON must not contain selectors, worker-local paths, DOM ids/classes, coordinates,
screenshots, or debug traces.

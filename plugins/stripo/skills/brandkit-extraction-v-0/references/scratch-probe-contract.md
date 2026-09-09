# Scratch Probe Contract

Scratch probes are run-local technical evidence collectors. They are for narrow diagnosis only, when packaged probes and saved artifacts do not answer a specific extraction question.

## When To Use

Use a scratch probe only after the homepage batch and focused packaged probes leave a concrete, recoverable gap:

- `homepage-pass-status.json` is `failed` or `readyForAssembly: false` after one packaged retry, and a narrow missing artifact still needs homepage evidence;
- product-card CTA layout contradicts screenshot, DOM, or class evidence;
- visible product-card CTA text exists but packaged rows disagree about source or usability;
- hover evidence is contradictory and the final field would otherwise be guessed;
- assembly diagnostics report a role gap that can be answered from homepage evidence.

Do not use scratch probes for broad discovery, secondary-page crawling, public JSON repair, or replacing normal packaged probes.
Do not run scratch or recovery just to find visible text when the observed homepage product actions
are icon-only. Icon-only product actions are valid component evidence, not a defect; preserve them
under `brand.components.productCard[0].cta` and use neutral `missingEvidence` wording for the absent
reusable visible-text CTA mirror.

Do not reconstruct a failed homepage batch with inline Node browser scripts. If the packaged batch
crashes, rerun it once, then recover only the specific missing evidence with packaged standalone
wrappers or a scratch probe whose question and output are bounded.

If `assembly-diagnostics.json.productCardCtaContract` reports that public
`layoutIntent` conflicts with technical product-card layout evidence, use a scratch probe to measure
the visible CTA against the nearest repeated product-card/action container. Class hints such as a
full-width button class and repeated card-local action slots are stronger evidence than a width ratio
computed against a page-wide parent.

## Location

All scratch files for slug `<slug>` must live under:

```text
${BRANDKIT_ARTIFACTS_ROOT}/technical/<slug>/scratch/
```

Run probes only through:

```bash
node ${BRANDKIT_SKILL_ROOT}/scripts/run-scratch-probe.js \
  --url "https://store.example" \
  --slug "store-example" \
  --artifacts-root ${BRANDKIT_ARTIFACTS_ROOT} \
  --script ${BRANDKIT_ARTIFACTS_ROOT}/technical/store-example/scratch/cta-layout-probe.mjs \
  --question "Is the visible product-card CTA full-width inside the card?" \
  --with-browser \
  --pretty
```

The wrapper writes a sibling output JSON and appends an entry to:

```text
${BRANDKIT_ARTIFACTS_ROOT}/technical/<slug>/scratch/scratch-manifest.json
```

## Probe Module Shape

Use `.mjs` for ES modules or `.cjs` for CommonJS. The module must export a function:

```js
export default async function probe(context) {
  const rows = await context.readTechnicalJson("product-card-styles.json");
  return {
    question: context.question,
    status: "answered",
    findings: [
      {
        field: "brand.components.productCard[0].cta.layoutIntent",
        value: "full-width",
        confidence: 0.84,
        evidence: ["Selected visible CTA has full-width class and spans the nearest card CTA slot."],
      },
    ],
    publicSafeSummary: "The product-card CTA is full-width inside the card, not content-sized relative to the page.",
    confidence: 0.84,
  };
}
```

The context exposes:

- `url`, `slug`, `question`, `technicalDir`, `scratchDir`;
- `input`, when `--input <path>` is supplied;
- `page` and `browserContext`, only when `--with-browser` is supplied;
- `readTechnicalJson(relativePath)`;
- `readScratchJson(relativePath)`;
- `writeScratchJson(relativePath, payload)`.

## Output Schema

The returned object must contain:

```json
{
  "question": "specific question answered by this probe",
  "status": "answered | inconclusive | blocked",
  "findings": [],
  "publicSafeSummary": "short summary safe to paraphrase into agent reasoning",
  "confidence": 0.0
}
```

Limits:

- main output is limited to 50 KB;
- supplemental scratch writes through `writeScratchJson` are limited to 100 KB each;
- `publicSafeSummary` is limited to 1200 characters;
- no more than 20 findings;
- timeout is 1-60 seconds, default 20 seconds.

## Forbidden

- Do not patch `${BRANDKIT_SKILL_ROOT}` or packaged scripts.
- Do not install packages.
- Do not write final `brandkit.extraction.json`, `brandkit.json`, or public HTML from a scratch probe.
- Do not crawl PDPs or secondary pages.
- Do not dump full DOM, screenshots, style sheets, or large row arrays.
- Do not copy scratch paths or raw scratch diagnostics into public JSON fields.

Scratch probe output is evidence. The agent owns the final role decision, and `assemble-extraction-stage.js --mode normalize` remains the public shape, sanitation, and diagnostics gate.

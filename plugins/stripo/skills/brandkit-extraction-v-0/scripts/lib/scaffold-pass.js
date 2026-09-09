// Scaffold-pass body for the extraction-stage orchestrator (BACKLOG item 15).
//
// `runScaffold` was previously inlined in `assemble-extraction-stage.js`
// at lines 831-972. This module exports it verbatim — the orchestrator
// now just imports and dispatches. The body is unchanged so the scaffold
// draft + diagnostics outputs stay byte-identical to the pre-refactor
// pipeline (see the parity test in
// `tests/test_assemble_extraction_stage.py`).
//
// Imports for the shared helpers + pass-only helpers come from sibling
// `lib/` modules:
//   - `extraction-pass-helpers.js`: argv contract, normalisation
//     primitives, `scaffoldPayload`, diagnostic builders, schema reader.
//   - `assemble-product-card-cta.js`: the CTA-row evidence diagnostics
//     (used in the diagnostics block only — `productCardCtaFromRow` is
//     re-exported via the shared helpers for `productCardFromRow`).
//   - `assemble-candidates.js`: phase-1 candidate-rank builder.
//   - `usage-hint-enums.js`, `header-link-contrast-diagnostic.js`,
//     `accent-promotion-from-evidence.js`, etc.: read directly by the
//     pass body (or its diagnostics block).

import fs from "node:fs/promises";
import path from "node:path";
import {
  productCardCtaDiagnostics,
  productCardCtaSelectionDiagnostics,
} from "../assemble-product-card-cta.js";
import { loadLogoSvgPathFiles, logoSvgFillsFromPaths } from "./load-logo-svg-paths.js";
import {
  dedupeButtonComponents,
  dedupeProductCardComponents,
} from "./component-dedup.js";
import {
  appendTypographyRoleMirrors,
  mergeTypographyByCanonicalFamily,
} from "./product-card-cta-mirrors.js";
import { seedTypographyDescriptions } from "./typography-description-seed.js";
import { applyButtonNoiseFilter } from "./button-noise-filter.js";
import { resolveEffectiveButtonStyles } from "./button-styles-fallback.js";
import { buildCandidates } from "../assemble-candidates.js";
import { typographyRoleCoverageDiagnostics } from "./typography-role-coverage.js";
import { readProbedSelectors, probedSelectorsPathFor } from "./probed-selectors.js";
import { readSalientRows } from "./salient-text.js";
import { linkColorBrandAlignmentDiagnostics } from "./link-colour-brand-alignment.js";
import { usageHintEnumsFromSchema } from "./usage-hint-enums.js";
import {
  PRODUCT_CARD_PROBE_BINDING_FILENAME,
  buildProductCardProbeBinding,
} from "./product-card-probe-binding.js";
import { REVIEW_PACKET_FILENAME, buildReviewPacket } from "./review-packet.js";
import { writeStdoutJsonLine } from "./stdout-json.js";
import {
  captureFamilySpellings,
  carryRoleChoiceJustifications,
  homepagePassDiagnostics,
  normalizeLayouts,
  productCardMirrorDiagnostics,
  productCardVariantDecisionDiagnostics,
  readExtractionStageSchema,
  readJson,
  readMtimeMs,
  readPriorDiagnostics,
  roleGaps,
  scaffoldPayload,
  technicalDir,
  writeDiagnostics,
  writeJson,
} from "./extraction-pass-helpers.js";

export async function runScaffold(args) {
  const dir = technicalDir(args);
  // BACKLOG item 27: clear any stale `assembly-diagnostics-shrinkage-recovery.json`
  // sidecar from a prior batch. The file is normally written by the normalize-
  // mode shrinkage gate; when the gate doesn't fire in the new run, an
  // older sidecar would otherwise persist with timestamps that predate the
  // current batch. Best-effort: ENOENT (and any other error) is swallowed
  // — this is housekeeping, never blocking.
  await fs.unlink(path.join(dir, "assembly-diagnostics-shrinkage-recovery.json")).catch(() => {});
  // `loadLogoSvgPathFiles` joined into the parallel load so the F3
  // logo-fill cross-reference in `rankPrimaryButtonCandidates` (driven
  // by `preEmitBrandColours` from `scaffoldPayload`) has the logo
  // hex set available at pre-emit time. Previously only `runNormalize`
  // loaded these — moving the load into the scaffold path lets F3 fire
  // when the pre-emit seeds `brand-primary-accent`, so sites whose
  // primary CTA hex exactly matches a logo SVG fill rank cleanly.
  // `logo-assets.json` is the homepage pass's record of the SVG logo bytes the
  // render already downloaded. Read tolerantly — a missing OR malformed file
  // must degrade to `null`, which makes `rankLogoCandidates` behave exactly
  // as it did before the artifact existed (`svgPath: ""`).
  const [capture, pageSignals, textStyles, buttonStylesRaw, buttonStylesFocused, productRows, languageSubtree, homepageStatus, backgroundStyles, logoSvgPaths, logoAssets, dom] = await Promise.all([
    readJson(path.join(dir, "capture.json"), {}),
    readJson(path.join(dir, "page-signals.json"), {}),
    readJson(path.join(dir, "text-styles.json"), []),
    readJson(path.join(dir, "button-styles.json"), []),
    readJson(path.join(dir, "button-styles.focused.json"), []),
    readJson(path.join(dir, "product-card-styles.json"), []),
    readJson(path.join(dir, "language-subtree.json"), null),
    readJson(path.join(dir, "homepage-pass-status.json"), null),
    readJson(path.join(dir, "background-styles.json"), []),
    loadLogoSvgPathFiles(dir),
    readJson(path.join(dir, "logo-assets.json"), null).catch(() => null),
    // WP-A2: read ONLY for the review packet's `links.navigation` section.
    // Nothing else in this pass sees it, so a missing or malformed
    // `dom.json` degrades that one section to `null` and changes no
    // artifact this pass already wrote.
    readJson(path.join(dir, "dom.json"), null).catch(() => null),
  ]);

  // What the probe LOOKED FOR, not what matched. Without it the gate cannot
  // tell "this page has no <h2>" from "nobody asked about <h2>", and a
  // narrowed re-probe would mint a false gap while hiding a real fault.
  const probedSelectors = readProbedSelectors(
    await readJson(probedSelectorsPathFor(path.join(dir, "text-styles.json")), null),
  );
  // The selector-free capture, read for MESSAGE TEXT only. A gap that says
  // "the page offers nothing for this role" is false on a site whose heading
  // no selector can address, and this artifact — written beside
  // text-styles.json by the same pass — is where that heading was recorded.
  // `null` (no artifact; every capture written before it existed) grades
  // exactly as it did before.
  const salientRows = readSalientRows(await readJson(path.join(dir, "salient-text.json"), null));
  // The diagnostics file this pass is about to overwrite, read for the SAME
  // reason the normalize pass reads it: the agent's `roleChoiceJustifications`
  // live only there, and a rewrite that dropped them would delete a record the
  // finalize CLI reads.
  const priorDiagnostics = await readPriorDiagnostics(dir);
  const logoSvgFills = logoSvgFillsFromPaths(logoSvgPaths);
  // BACKLOG item 16: capture button-styles mtimes so the focused fallback
  // can gate on freshness (stale focused.json from a prior batch must
  // not override an empty current-batch raw probe).
  const [rawMtimeMs, focusedMtimeMs] = await Promise.all([
    readMtimeMs(path.join(dir, "button-styles.json")),
    readMtimeMs(path.join(dir, "button-styles.focused.json")),
  ]);
  const layoutDiagnostics = []; const buttonStyles = resolveEffectiveButtonStyles(buttonStylesRaw, buttonStylesFocused, homepageStatus, layoutDiagnostics, { rawMtimeMs, focusedMtimeMs }); // Tier-H Fix 1 + BACKLOG item 16.
  const payload = scaffoldPayload({
    capture,
    pageSignals,
    textStyles,
    buttonStyles,
    productRows,
    languageSubtree,
    baseUrl: args.url,
    backgroundStyles,
    logoSvgFills,
    diagnostics: layoutDiagnostics,
  });
  normalizeLayouts(payload, layoutDiagnostics);
  // BACKLOG item 33: run the button + productCard dedup helpers in
  // scaffold mode so the draft the agent reads is already deduped. The
  // helpers are battle-tested in normalize (see lib/component-dedup.js
  // and lib/button-noise-filter.js) and run-to-run idempotent. Without
  // this, high-button-density retail-class sites ship a 64-button
  // scaffold draft with ~5 unique visual signatures, and the agent's
  // only honest move is a wholesale rewrite — which trips the
  // shrinkage gate. After this pre-dedup the draft ships ~10-20 button
  // rows, and the agent's targeted-edit contract is deterministically
  // holdable.
  // Typography dedup stays normalize-only: it runs after
  // `mergeTypographyByCanonicalFamily` upstream, and the canonical-family
  // merge needs `appendTypographyRoleMirrors` to have populated hints
  // first to pick a winner — see the comments at lines below.
  dedupeButtonComponents(payload, layoutDiagnostics);
  applyButtonNoiseFilter(payload, layoutDiagnostics);
  dedupeProductCardComponents(payload, layoutDiagnostics);
  // W1+W5: run the typography role-mirror synthesis BEFORE
  // `typographyRoleCoverageDiagnostics` so the scaffold draft carries the
  // same synthesised records the normalize path produces. Without this,
  // the scaffold's `assembly-diagnostics.json.typographyRoleCoverage`
  // flags severity:high entries for productCard mirror roles even though
  // the SKILL.md prose tells the agent "the scaffolder synthesises". The
  // agent then sees contradictory signals (checklist says "missing X" but
  // the contract says "don't author X") and the noise compounds across
  // batches.
  //
  // Pre-conditions at this point:
  //  - `payload.brand.typography` is the array built from `text-styles.json`
  //    plus selector-derived role hints (typographyFromText).
  //  - `payload.brand.components.productCard` is the filtered + mapped
  //    productCard array (productCardFromRow on filtered probe rows).
  // Both arrays exist whenever the scaffolder ran without exception, so
  // `appendTypographyRoleMirrors` has the inputs it needs.
  //
  // Run `mergeTypographyByCanonicalFamily` FIRST so the role-mirror pass
  // operates on collapsed canonical-family rows. Without this, sites whose
  // probe surfaces the same canonical primary font through multiple CSS
  // family strings (e.g. `Inter, sans-serif` vs
  // `Inter, system-ui, sans-serif`) end up with duplicate typography rows
  // — `appendTypographyRoleMirrors` would then tag BOTH records and the
  // role-coverage diagnostic would surface a duplicate-hint info entry the
  // agent has no clean way to act on. Merging upfront keeps the agent's
  // scaffold view consistent with the normalize-mode ordering at
  // `normalizeExtraction()`.
  //
  // `captureFamilySpellings(textStyles)` is what keeps the merge from handing a
  // productCard mirror's CSS family stack to a record carrying a region role.
  //
  // AND IT CANNOT FIRE AT THIS CALL SITE, said plainly rather than left for
  // someone to discover. `scaffoldPayload` builds `brand.typography` as
  // `textStyles.map(typographyFromText)` and nothing between there and here
  // touches it, so every record's family is one this index holds by
  // construction: one spelling class, and the grouping is exactly what it was.
  // Measured too — scaffolding all 1550 saved captures with and without this
  // argument produces byte-identical drafts, and dropping it kills no test.
  //
  // It is passed anyway because the ORDER two lines below is the only reason it
  // is inert: the mirrors are appended AFTER the merge here, and BEFORE it in
  // `normalizeExtraction`, which is the pass that re-merges this draft and where
  // the two spellings do meet. One call shape at both sites means moving
  // `appendTypographyRoleMirrors` above the merge cannot silently reintroduce
  // the defect.
  mergeTypographyByCanonicalFamily(payload, layoutDiagnostics, captureFamilySpellings(textStyles));
  appendTypographyRoleMirrors(payload, productRows);
  // Seed usage-prose descriptions on typography rows the probe left empty,
  // from their now-merged/role-tagged hints, so the draft the agent reviews
  // is never description-less (the colour channel seeds the same way via
  // `preEmitBrandColours`). Runs after the merge + role-mirror passes so the
  // prose reflects the final hint set. Scaffold does not strip empty-hint
  // rows (that is normalize-only), so roleless rows simply get no seed here —
  // `describeTypographyFromHints` returns "" for them. Fill-only; the agent
  // rewrites the seed with richer prose. See lib/typography-description-seed.js.
  seedTypographyDescriptions(payload, layoutDiagnostics);
  // DO NOT call `tagProductCardCtaMirrors` here. In normalize mode, that
  // helper safely operates on agent-tagged records (each button carries
  // role hints; the icon-only branch's "drop buttons with empty
  // usageHints" filter only kills records the agent already declined to
  // tag). In SCAFFOLD mode, `payload.brand.components.button` is the
  // raw probe-derived array from `buttonFromRow`, which produces records
  // with `usageHints: []` by design — the agent populates them later.
  // Running the helper here with a nonreusable card triggers the stale-mirror
  // filter, which deletes EVERY probe-derived button because their hints are
  // still empty (empirically verified during v4 critic review:
  // sites with 100+ probe buttons end up with brand.components.button
  // === [] in the scaffold draft). The agent then has no input to tag
  // and is forced to author from scratch — the exact failure mode v4
  // tried to close on the typography channel. Until the icon-only filter is
  // mode-aware (or refactored to only delete buttons whose `usageHints`
  // were just stripped this pass), CTA tagging stays normalize-only.
  // The product-card-cta severity:high entries that appear in scaffold
  // diagnostics for multi-card sites with icon-only card[0] are a known
  // gap tracked in BACKLOG.md.
  // Phase 1 candidates: additive pre-ranked role recommendations the
  // agent can confirm instead of re-deriving. See assemble-candidates.js.
  const candidates = buildCandidates({ backgroundStyles, textStyles, buttonStyles, productRows, capture, pageSignals, logoSvgFills, logoAssets, salientRows, probedSelectors });
  // Surface the canonical usageHint enum lists straight from the schema so
  // the agent can read them without inspecting `references/*.schema.json`
  // directly (SKILL.md prohibits `jq`/`cat`/`grep` on schema files during
  // normal extraction). Keys mirror the schema's $defs verbatim.
  const usageHintEnums = usageHintEnumsFromSchema(await readExtractionStageSchema());
  const diagnostics = {
    mode: "scaffold",
    schemaValidated: false,
    usageHintEnums,
    layoutDiagnostics,
    roleChoiceGaps: roleGaps(payload),
    homepagePassContract: homepagePassDiagnostics(homepageStatus),
    productCardTypographyMirrors: productCardMirrorDiagnostics(payload),
    productCardCtaContract: productCardCtaDiagnostics(payload, productRows),
    productCardCtaSelection: productCardCtaSelectionDiagnostics(productRows),
    productCardVariantDecision: productCardVariantDecisionDiagnostics(payload),
    // `textStyles` is passed so the scaffold-stage gate grades an absent-evidence
    // role as `gap` rather than `high`. This call site is the one that matters on a
    // site with no h1..h3: normalize never runs there, because the agent reads THIS
    // diagnostic, sees `high`, and stops. Grading only in normalize would leave the
    // run dying one stage earlier, unchanged.
    // `productRows` grades the productCard roles, which nothing graded before
    // -- see the parameter's note in `typography-role-coverage.js`. Passed here
    // for the same reason `textStyles` is: the agent reads THIS diagnostic and
    // stops, so a channel that only speaks at normalize speaks too late.
    typographyRoleCoverage: typographyRoleCoverageDiagnostics(payload, homepageStatus, textStyles, probedSelectors, salientRows, candidates, productRows),
    linkColorBrandAlignment: linkColorBrandAlignmentDiagnostics(payload),
    candidates,
  };
  carryRoleChoiceJustifications(diagnostics, priorDiagnostics);
  await writeDiagnostics(dir, diagnostics, args.pretty);
  const draftPath = args.out ? path.resolve(args.out) : path.join(dir, "brandkit.extraction.draft.json");
  await writeJson(draftPath, payload, args.pretty);
  await writeJson(
    path.join(dir, PRODUCT_CARD_PROBE_BINDING_FILENAME),
    buildProductCardProbeBinding(productRows),
    args.pretty,
  );
  // WP-A2 — the review packet, written LAST and read by nothing in this pass.
  //
  // It is a projection of the artifacts above plus the draft this function
  // just wrote, so it can only be built once they are final. Everything it
  // touches is already on disk; the packet adds a file and a line of stdout
  // and changes no existing byte.
  //
  // ALWAYS COMPACT, `--pretty` or not, because the file and the stdout line
  // must be the SAME BYTES: the agent is told the printed document is the
  // file, and a pretty-printed sibling would make that false.
  const reviewPacket = buildReviewPacket({
    dir,
    draftPath,
    slug: args.slug || path.basename(dir),
    capture,
    pageSignals,
    dom,
    draft: payload,
    diagnostics,
    homepageStatus,
    logoAssets,
  });
  await writeJson(path.join(dir, REVIEW_PACKET_FILENAME), reviewPacket, false);
  // The ONLY stdout write on this path. `writeJson` appends the same newline,
  // so these bytes equal the file's bytes exactly, and `writeStdoutJsonLine`
  // puts them in the kernel before it returns (see lib/stdout-json.js).
  writeStdoutJsonLine(reviewPacket);
}

<!-- Moved out of SKILL.md by the 0.3.0 contract split. The text below is
     verbatim from SKILL.md at sha256 6cdd8d5975fa8aca548fbe00d5507260bf6d5ec6522d61ddaa0e4fa512ef9609. -->

# Workflow — phases 1-3 in full prose

Capture, scaffold and verify, the targeted-edits worked example, and the scaffolder's pre-tags.

The four files of this family, each readable in one tool call:

- [`decision-flows.md`](decision-flows.md) — goal, output layout, the full prose for every default command, the runtime-facing scripts, the reference index.
- [`workflow-phases.md`](workflow-phases.md) — phases 1-3 in prose, the targeted-edits worked example, and what the scaffolder pre-tags for you.
- [`role-decision-rules.md`](role-decision-rules.md) — recovery budget and confidence bands, then the per-role flows: colour, region-scoped links, important links, descriptions, button preservation.
- [`extraction-stage-json.md`](extraction-stage-json.md) — the extraction-stage JSON, the canonical `usageHints` enums, product-card specifics, the variant pick, and the hard rules in full.

## Workflow

The extraction has six numbered phases plus the bounded Phase 2.5 recovery. Each has a clear outcome; sequencing within a phase is the agent's call based on what the evidence shows.

**Phase 1 — Capture.** Run `homepage-pass.js` to produce the saved artifact set (screenshot, DOM, capture, page-signals, focused style probes, recovery summary, status). `homepage-pass-status.json` is the authoritative success/blocker signal — wait for it to reach a terminal state before judging the run; `curl`/DNS/fetch behaviour is not a substitute. While the batch runs, poll the status file at most once every 30 seconds, and only after the next phase budget could plausibly have elapsed. Treat the pass as stale only after 5 minutes (300000 ms) with no `currentPhaseElapsedMs` progress (the field can be `null` between phases — that gap is what staleness looks like), then rerun `homepage-pass.js` once.

**Phase 2 — Scaffold.** Run `assemble-extraction-stage.js --mode scaffold` to produce `brandkit.extraction.draft.json` plus `assembly-diagnostics.json` (with pre-ranked role candidates). The scaffolder is the deterministic starting point and now does work that used to be the agent's job — see [Scaffolder pre-tags](#scaffolder-pre-tags). Preserve scaffolder rows: apply targeted `jq` edits only; do not wholesale-rewrite. See [Hard rules — Authoritative source](#hard-rules) for the full prohibition and the [worked example](#targeted-edits-vs-wholesale-rewrites--worked-example) below for the right vs wrong shape.

The same pass writes `product-card-probe-binding.json` beside those artifacts. It is private run-binding evidence, not an authoring input or public schema field.

**Inventory before re-deriving.** After `homepage-pass.js` and `assemble-extraction-stage.js --mode scaffold` complete, list `${BRANDKIT_ARTIFACTS_ROOT}/technical/<slug>/` (e.g. `ls "$TECH"` where `$TECH=...`) before invoking any further script. `homepage-pass.js` already writes the screenshot, DOM, capture, page-signals, all style probes, recovery summary, and — for SVG logos it rendered — `logo-assets.json` plus a `logo-assets/` directory into that directory; those are the canonical inputs for the agent's next steps. A pre-filled `svgPath` in the scaffold's `candidates.logos` means the bytes are already captured and neither logo script needs to run. `extract-svg-path.js` emits SVG markup to stdout only (capture with `>` to a file if you need to persist it). `save-logo-asset.js` is the opposite: it REQUIRES `--asset-url` + `--out-dir` and ALWAYS writes the fetched binary to disk under `--out-dir`; its stdout is summary metadata (path + content-type), not the asset itself. Do NOT invoke either script if the homepage-pass already produced the evidence you need. **Caveat (cache mtime, unrelated to the Phase-1 staleness timer):** the persistent thread workspace may also hold files from prior runs (`logo.svg`, older `*.json`); trust ONLY files whose mtime is from THIS run's homepage-pass. If unsure, prefer re-deriving over reusing an unverifiable cached artifact.

**Wait for status:completed before declaring a homepage-pass run failed.** `homepage-pass-status.json` updates incrementally — a `status:openPage` / `status:probesRunning` mid-run snapshot with `completedPhases` below the total is normal on heavy homepages and is NOT a crash signal. Re-invoke `homepage-pass.js` only after one of: (a) `status:completed` AND `readyForAssembly:true`, (b) `status:failed` / `status:blocked`, or (c) the Phase 1 staleness threshold trips (see Phase 1 above for the canonical 5-minute / `currentPhaseElapsedMs` rule). Reading a partial status as a crash burns a full second pass and discards the first run's saved evidence.

**On a normalize gate failure, read the reference doc named in the gate's error message (`references/normalize-safety-nets.md` for the normalize gates, `references/product-card-variants.md` for the variant-decision gate) BEFORE the script source.** The gate's error message already names the rule it enforces and the section with the minimal-fix recipe. Reading `scripts/lib/*.js` source under `${BRANDKIT_SKILL_ROOT}` to re-derive the rule duplicates what the doc already states and the worker treats `${BRANDKIT_SKILL_ROOT}` as read-only — there is no code change you can make from inside the run. Open the named reference, find the section the gate cites, then apply the targeted `jq` edit.

**Inventory once per phase; trust the listed artifacts for the rest of that phase.** After `ls "$TECH"` confirms the homepage-pass artifacts (above) and again after `--mode scaffold` writes `brandkit.extraction.draft.json` + `assembly-diagnostics.json`, treat those files' content as canonical for the inventory phase: read each at most once per question. Re-running `jq` on `draft.json`, `assembly-diagnostics.json`, `page-signals.json`, or `capture.json` five or eight times within one verify pass does not surface new evidence — the files are written once and not modified again until your `jq … > tmp && mv tmp …` edit on `brandkit.extraction.json`. If you need multiple fields, ask for them in one `jq` invocation, not five.

**Phase 3 — Verify and adjust.** This phase is **verify**, not re-curate. The scaffolder has already pre-tagged AND pre-deduped the parts of the draft that are mechanically derivable from probe evidence; your job is to (a) confirm those pre-tags against the saved screenshot and DOM — every pre-tagged field and pre-emitted seed either confirmed or corrected, none skipped — (b) fill the small set of decisions the scaffolder leaves to you, and (c) run normalize. Apply targeted edits via `jq`; do not rewrite whole arrays. Run `--mode normalize --input <path>` to validate, sanitize, and produce final diagnostics. **After normalize, run the post-normalize verification**: `brand.colors.{backgroundColors, accentColors, textColors}`, `brand.typography`, `brand.components.button`, and `brand.logos` must each still be non-empty when probe evidence supports them (per-array evidence conditions: [Decision Flows → Verification after normalize](#decision-flows)) — if any is empty after normalize while diagnostics show available candidates, you missed a role-tagging step and should fix it via targeted `jq` rather than re-running scaffold. The finalize CLI records an unjustified empty `backgroundColors`, `typography`, `components.button`, or `logos` field as a warning in `finalize-report.json`; it still publishes the Brand Kit. The `accentColors`/`textColors` check remains agent-side only. After normalize succeeds, pick the bundled abandoned-cart product-card variant — see [Product-card variant pick](#product-card-variant-pick). Then continue with the tone-of-voice and business-context handoffs, run the finalize step ([Default Commands](#default-commands), Phase 4), and end the turn on Phase 5's save — not on the finalize.

**Logo hosting is finalizer-owned.** After normalize, do not upload a logo, edit its URL, or write a hosting claim into diagnostics. Phase 4 performs one fail-open attempt from current-run sidecar evidence and records its non-authorizing outcome in `finalize-report.json.logo_hosting`. This is a same-workflow drift check, not proof against a process that can rewrite the technical artifacts before finalization.

### Targeted edits vs wholesale rewrites — worked example

ANTI-PATTERN (forbidden, even though it produces valid JSON):

```bash
cp technical/<slug>/brandkit.extraction.draft.json technical/<slug>/brandkit.extraction.json
jq '.brand.typography = [<rewritten array>]
   | .brand.colors.accentColors = [<rewritten array>]' \
   technical/<slug>/brandkit.extraction.json > /tmp/edited.json
mv /tmp/edited.json technical/<slug>/brandkit.extraction.json
```

An assignment-style `jq '.brand.typography = [...]'` is a wholesale rewrite of that subtree even though the syntax looks targeted — see [Hard rules — Authoritative source](#hard-rules) for the full prohibition. The downstream deterministic helpers (`appendTypographyRoleMirrors`, role-coverage gate) then operate on YOUR array, not the scaffolder's, so every pre-tagged hint / description / synthesised record is gone.

PRESCRIBED PATTERN:

```bash
jq '.brand.organization = {<agent-authored>}
   | .brand.logos = <agent-authored array>
   | .contacts = {<agent-authored>}
   | .socials = {<agent-authored>}
   | .importantLinks = <agent-authored array>
   | .languages = <agent-authored array>' \
   technical/<slug>/brandkit.extraction.draft.json > technical/<slug>/brandkit.extraction.json
```

Agent-authored fields (`brand.organization`, `brand.logos`, `contacts`, `socials`, `importantLinks`, `languages`) are written from scratch — assign them. Scaffolder-derived fields (`brand.typography[]`, `brand.colors.*`, `brand.components.*`) are READ-ONLY for the agent's first pass — do NOT include them in the assignment chain. Refine individual records via path-targeted updates (e.g. `jq '(.brand.colors.accentColors[] | select(.value == "#212121") | .description) = "<new prose>"'`), never via array replacement.

Author `languages` as lowercase ISO 639-1 two-letter codes — one per visible site language, no region suffixes and no duplicates (`["uk","ru"]`, not `["uk","uk-ua","ru-ua"]`). The finalize CLI canonicalizes anyway, so emitting clean codes just avoids needless rewrites.

The scaffolder already deduped `button[]` and `productCard[]` arrays before you read them. Treat each row as canonical — do not invent a second dedup pass; if you see two rows that look identical, append a missing `usageHint` to one rather than removing the other.

If the gate fires, read `assembly-diagnostics-shrinkage-recovery.json` (KB-scale) instead of re-reading `brandkit.extraction.draft.json` (hundreds of KB). The sidecar lists the specific draft rows missing from your input.

### Scaffolder pre-tags

The scaffolder writes these directly into the draft based on saved probe evidence. Override them only on **clear screenshot/DOM mismatch**, never as a stylistic preference. Hints stay attached to records — strip them only when normalize's safety nets do (the existing helpers do this transparently).

- **Empty-hint rows are normalize-pruned.** The scaffolder emits typography and button rows whose `usageHints` start as `[]` (no probe selector match and no agent-attached role yet). The agent's responsibility is to TAG roles on rows whose visual evidence supports them, EXCEPT the deterministic roles listed under [Role-tagging contract](#role-tagging-contract), which the agent may never author and may only copy, under the bounded exception stated there — not to delete hintless rows manually; normalize's empty-hint strip drops any row still empty after all role-tagging passes ([normalize-safety-nets.md](references/normalize-safety-nets.md), step 12 — Empty-hint strip).

- **Typography role hints** — `brand.typography[].usageHints` is pre-tagged from each row's source probe selector:
  - `h1` / `h2` / `h3` → `heading-typography`
  - `p` → `body-typography`
  - `header a` / `[role='banner'] a` / `nav a` / `[role='navigation'] a` → `header-typography`
  - `footer a` / `[role='contentinfo'] a` → `footer-typography`
  - `button` (any variant) → `button-typography`
  After dedup, each canonical entry carries the union of its source-row hints. The hints downstream consumes for `font_family_{heading,body,header,footer,button}` resolution are all deterministically populated.

- **Typography `description` is deterministically seeded.** Any `brand.typography[]` row left with an empty `description` after role-tagging gets a usage-prose seed synthesised from its `usageHints` (`Applied to <role clauses>.`) — mechanics in [normalize-safety-nets.md](references/normalize-safety-nets.md), step 13 — Typography description seed. You SHOULD still author richer, site-specific description prose where you have context (the seed is a floor, not a ceiling); a targeted `jq` update to a single row's `description` overrides the seed. Do not hand-author placeholder prose just to avoid an empty field — the seed already guarantees non-empty.

- **Product-card typography role mirrors** — the scaffolder walks each `brand.components.productCard[*]` and pre-tags the matching top-level `brand.typography[]` record, synthesising a record from the probe signature when none matches:
  - `titleTypography` → `product-name-typography`
  - `priceTypography` → `product-price-typography`
  - `oldPriceTypography` → `product-old-price-typography`
  These hints are verify-only — see [Role-tagging contract → Typography mirrors](#role-tagging-contract); synthesis, idempotency, and gate mechanics live in [normalize-safety-nets.md](references/normalize-safety-nets.md) (step 8 — Typography mirrors).

- **Brand colours** — when the rankers produce a top candidate with confidence ≥ 0.5, the scaffolder pre-emits records into `brand.colors`:
  - `accentColors[]` with `["brand-primary-accent", "button-primary-background"]` from `rankPrimaryButtonCandidates`.
  - `textColors[]` with `["button-primary-text"]` from the same candidate's `fontColor`.
  - `backgroundColors[]` with `["canvas-background"]` from `rankCanvasBackgroundCandidates`.
  Treat these as confirmed seeds. Adding `link-text` to the same brand-primary-accent value is the canonical brand-magenta preservation move — `linkColorBrandAlignmentDiagnostics` flags drift when `link-text` is on a different value. **`link-text` is the only text-role hint allowed to co-occur on an accentColors row.** Do NOT generalise this to `heading-text`, `body-text`, `footer-text`, or `price-*`; those belong on their canonical channel only (see the channel-constraints rule in the Role-tagging contract below).
- **Brand colours — button-row tag (ungated)**: separately from the confidence-gated `colors.*` emit above, `components.button[]` rows whose `backgroundColor` matches the top non-chrome primary candidate are ALWAYS tagged with `button-primary-background`, regardless of candidate confidence. Strictly additive — never overrides existing hints, never tags a non-matching row. Prevents the empty-hint strip from silently dropping the strongest CTA evidence on sites where button-bucket confidence falls below 0.5.
- `backgroundColors[]` gets `header-background` / `footer-background` synthesised deterministically from `background-styles.json` rows whose `roleHint` or `selector` identifies the region. The agent's job is to confirm against the screenshot, never re-author the hint manually.

- `backgroundColors[]` gets `content-background` synthesised deterministically from `<main>` / `[role="main"]` probe rows. When `<main>` has transparent bg, the hint propagates to the existing `canvas-background` row.

- `backgroundColors[]` gets `product-card-surface-background` synthesised from the most-common `card.backgroundColor` across card-like `product-card-styles.json` rows.

- **Normalize-time only**: when `productCard[]` is empty AND probe captured any card-shape rows, normalize writes a placeholder with brand-derived surface + CTA colors. The synthesised entry carries `evidenceQuality: "weak"` and `confidence: 0.3`; the customise stage should use one of the bundled productCard variants (the synth provides colors, not layout).

- **`productCard[0].oldPricePosition`** — derived deterministically from per-row `price.boundingBox` + `oldPrice.boundingBox` votes. The aggregator returns `"top"` / `"left"` / `"right"` only when ≥ 2 product rows agree at ≥ 60% share; otherwise `null` (leaves your call). Normalize re-derives this from the same probe evidence on every run (`applyDerivedOldPricePosition`); agent overrides win only when paired with a clear `recommendedVariantReason` justifying the deviation.

- **`productCard[0].contentAlign`** — derived deterministically from per-row `titleTextAlign` + `priceTextAlign` votes (`"left"` / `"center"` / `null`). Normalize re-derives this from the same probe evidence on every run (`applyDerivedContentAlign`); agent overrides win only when paired with a clear `recommendedVariantReason` justifying the deviation.

- **`productCard[0].recommendedVariantIndex`** + a starter `recommendedVariantReason` — walks the decision tree from [`references/product-card-variants.md`](references/product-card-variants.md) using the four pre-derived axes (`isIconLike`, `oldPricePosition`, `hasInlineIcon`, `contentAlign`). Returns a definite index 0–4 when the tree resolves cleanly, or leaves both fields blank when the signal is genuinely ambiguous (agent must decide from the screenshot). When the scaffolder commits an index, the agent's job is to confirm against the screenshot and optionally refine the reason with screenshot-grounded nuance.

- **`header-link` / `footer-link` colour hints** — when scoped probe rows (`header a`, `nav a`, `[role='banner'] a`, `[role='navigation'] a`, and symmetric footer variants) match a `textColors` record's value, the scoped-evidence backfill appends the hint if missing. Inverse safety net of the gated-strip helper.

The scaffolder leaves these for you to determine:
- `recommendedVariantReason` REFINEMENT (the scaffolder writes a starter citing the axes used; you adjust it after screenshot review when you have extra context).
- `recommendedVariantIndex` MANUAL OVERRIDE only when screenshot evidence clearly contradicts the derivation (rare — the tree-walk is exhaustive when axes are sufficient).
- Non-trivial accent/text-colour assignments outside the rankers' top picks (promo accents, secondary surfaces).
- Curation of duplicate or noise records (the dedup safety nets merge most, but anything they miss is yours).

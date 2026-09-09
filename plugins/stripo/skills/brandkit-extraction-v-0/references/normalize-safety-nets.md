# Normalize-mode safety nets

`assemble-extraction-stage.js --mode normalize` runs deterministic helpers
after the agent's targeted edits land in `brandkit.extraction.json`. These
helpers absorb run-to-run variance — **they do not substitute for following
the Role-tagging contract in SKILL.md.** Expect mutations of these specific
shapes after normalize exits.

The agent does not invoke these directly. They exist here so reviewers can
trace observed mutations back to a named helper. Order matters within
`normalizeExtraction()` in `scripts/assemble-extraction-stage.js`:

1. **Dedup.** `dedupeButtonComponents`, `dedupeTypographyComponents`,
   `dedupeProductCardComponents` collapse records sharing a visual
   signature (see SKILL.md `Role-tagging contract → Dedup`).
   `mergeTypographyByCanonicalFamily` runs after
   `dedupeTypographyComponents` and collapses typography rows whose
   primary font name + weight + sizePx + lineHeightPx match but whose
   CSS family strings differ (`"Inter, sans-serif"` vs `"Inter,
   system-ui, sans-serif"` both reduce to canonical `inter`). The
   surviving record keeps the longer (more specific) family string and
   the union of `usageHints`; this prevents the productCard mirror
   tagger from tagging two equivalent rows and tripping the
   duplicate-hint informational entry downstream.
2. **Backfill.** `propagateOldPriceFromProbeRows` copies `oldPriceColor` +
   `oldPriceTypography` onto `productCard[0]` when the agent's collapse
   stripped it AND ≥ 3 probe rows agree on a consistent signature.
3. **CTA hover propagation.** `propagateProductCardCtaHoverFromProbeRows`
   restores the product-card-specific hover triplet on `productCard[0].cta`
   before any button-mirror tagging runs.
4. **Placeholder collapse.** `normalizeProductCardPlaceholderToCanonical`
   replaces `productCard: [{evidenceQuality:"none"}]` with the canonical
   empty array `[]` for non-ecom homepages.
5. **Non-ecom drop.** `dropNonEcomProductCards` removes productCard entries
   lacking purchase signal (no price/old-price colors, no price/old-price
   typography, no short CTA label, confidence < 0.85).
6. **Button dimension backfill.** `backfillButtonDimensionsFromProbe`
   restores `layout.computedHeightPx` / `computedWidthPx` /
   `widthRatioToParent` / `isFullWidth` on each `button[]` entry from
   matching probe rows — the demote net (next step) needs these to detect
   icon-only shape.
7. **Demote icon-only.** `demoteIconOnlyFromButtonPrimary` swaps icon-only
   round CTAs out of `button[0]` when a later entry with
   `button-primary-background` is not icon-only-shaped.
8. **Typography mirrors.** `appendTypographyRoleMirrors` appends matching
   `product-name-typography` / `product-price-typography` /
   `product-old-price-typography` hints onto typography entries that match
   `productCard[0].titleTypography` / `priceTypography` /
   `oldPriceTypography` evidence (signature: same `family`, same `weight`,
   `sizePx` within ±1px). When the productCard mirror has a usable
   signature (family + numeric weight + numeric sizePx) but no top-level
   record matches within the window, the helper synthesises a new
   `brand.typography[]` entry from the probe signature so the role hint
   can land without manual authoring. Synthesised entries carry
   `description: "Auto-synthesised from productCard[0].<field> probe
   evidence (no matching agent-curated record within ±1px tolerance)."`
   and exactly one `usageHints` entry naming the synthesised role; the
   helper is idempotent — running it twice does not add a second
   synthesis record. MUST run before the CTA tagger so an
   empty-`usageHints` typography record gains its product-* role before
   the CTA tagger's icon-only branch filters out empty-hint records.
9. **CTA mirrors and recovery boundary.** `tagProductCardCtaMirrors`
   appends `product-card-cta` onto matching button (and typography) entries
   only when `productCard[0]` passes the canonical reusable-evidence gate:
   medium/strong quality, non-empty text under ECMAScript `String.trim`,
   `textSource: "visible-text"`, `hasUsableVisibleText: true`, and not
   icon-like. `layoutIntent` is geometry, not trust. When the gate fails for
   any reason (weak/missing quality, blank/missing/non-visible text,
   icon-only, or missing CTA), the helper strips the CTA typography/button
   hint and all four CTA colour hints, dropping any record left with no role.
   Later `applyAgentRoleRecoveries` applies the identical gate to exactly
   `product-card-cta`, `product-card-cta-background`,
   `product-card-cta-text`, `product-card-cta-hover-background`, and
   `product-card-cta-border`; rejected roles never enter `filledRoles`, so a
   valid run-bound sidecar cannot resurrect sanitized CTA evidence.
10. **Description-mismatch strip.**
    `stripProductCardCtaFromDescriptionMismatch` removes `product-card-cta`
    from buttons whose `description` names a non-product context (cookie
    consent, newsletter, login modal, etc.).
11. **Header/footer link strip.** `applyHeaderLinkStrip` removes
    `header-link` / `footer-link` hints from colors that lack region-scoped
    evidence in `text-styles.json`.
12. **Empty-hint strip.** `dropEmptyUsageHintRows`
    (`lib/empty-usagehints-strip.js`) — final safety net; drops
    typography/button rows whose `usageHints` array remained empty after
    all role-tagging passes. The schema's `usageHintList.minItems: 1`
    rejects empty hints; the scaffolder emits such rows by design (probe
    rows that no helper matched and the agent declined to tag). One
    info-severity diagnostic per drop.
13. **Typography description seed.** `seedTypographyDescriptions`
    (`lib/typography-description-seed.js`) — fills an empty/whitespace
    `description` on each surviving `brand.typography[]` row from its
    now-final `usageHints` (`Applied to <role clauses>.`). Runs last among
    the typography passes (after dedup, role-mirror tagging, and the
    empty-hint strip) so the prose reflects the complete hint set, including
    hints a row acquired via merge/mirror rather than its build-time
    selector. Fill-only — never overwrites an agent- or synth-authored
    description — so it is idempotent across normalize retries. The colour
    channel seeds descriptions the same way at row creation
    (`colour-pre-emit.js`, `region-bg-hints.js`); this closes the one
    builder (`typographyFromText`) that emitted rows description-less. Also
    runs in `--mode scaffold` (after `appendTypographyRoleMirrors`) so the
    draft the agent reviews is never empty. One info-severity diagnostic per
    seeded row.
14. **Logo description strip.** `dropLogoDescriptionFields`
    (`lib/logo-description-strip.js`) — drops the `description` field
    from `brand.logos[]` items. Schema closed-shape (`additionalProperties:
    false`) accepts only `{url, type, background, svgPath}`. Eliminates an
    AJV retry round on the agent slip class where screenshot evidence
    leaks into the logo record. One info-severity diagnostic per drop.
15. **Long-link-name strip.** `dropLongImportantLinkNames`
    (`lib/important-link-name-cap.js`) — drops `importantLinks[]` entries
    whose `name.length > 40`. The 40-char cap is a physical-display
    constraint (the email header column cannot render more), not a
    curation rule. Catches probe-surfaced promo prose, article-rail
    headlines, product titles, and scratch text the agent passed through
    unfiltered. One info-severity diagnostic per drop, including the
    offending name and url.

Typography role coverage is RECORDED, not enforced: no role-coverage entry
stops `--mode normalize`. **`reason` carries the finding; `severity` no longer
does.** Every entry below is `severity: "gap"`, and reading the severity to tell
them apart is the mistake this section exists to prevent.

A missing role is graded from the capture (`lib/role-evidence.js`), and the two
grades are two different facts about the PAGE:

- **`reason: "role_not_produced"`** — the probe DID capture rows this role
  derives from and the hint is still missing, or the capture is empty/absent, or
  nobody can prove the role's source selectors were probed at all. A producer or
  process fault. The kit ships without the role and the report names it; every
  downstream reader of these hints falls through to a default rather than
  refusing, which is why the run continues.
- **`reason: "no_evidence"`** — the probe looked for every selector this role
  derives from and none of them matched. A property of the SELECTORS the site
  offers, recorded and reported in `finalize-report.json.gaps`. **It is not a
  claim that the page visually lacks the role** — see the salient lane below,
  which is how a gap can name a row nothing selector-addressed.
- **`severity: "info"`** — the helper cannot resolve the role by design, below.

The distinction is load-bearing even though neither stops the run: an agent that
drops a hint to convert the first into the second is asserting the page cannot
supply a role that it can, and the report would carry that assertion to the
consumer. That is what the reason spellings are for.

Proving a gap needs `text-styles.probed.json`, the sidecar recording what
each probe looked for. `text-styles.json` records only what MATCHED, so on
its own it cannot separate "this page has no `<h2>`" from "nobody asked
about `<h2>`" — and a re-probe overwrites it. Without the sidecar, or with
one whose list omits any of the role's sources, the grade stays
`role_not_produced`.

### The salient fallback lane — a gap is not the end of the evidence

A fourth grade sits between `gap` and nothing: `salient_evidence_present`.
`salient-text.json` is a **selector-free** walk of the page's most
prominent visible text (`lib/salient-text.js`, a `page.evaluate` tree-walk
over text nodes reading `getComputedStyle`), written by the homepage pass
alongside the probe artifacts. It exists because the tag decides a row
EXISTS: a visual heading that is a `div` is never captured by an
`h1..h3` probe at all, so the selector lanes cannot rank what was never
recorded.

**When it fires.** `rankTypographyCandidates`
(`assemble-candidates.js:1108`) runs it on either of two triggers — the
selector bucket came out empty, OR the selector-to-role mapper did not
resolve the role. It **appends**; selector-lane entries keep the front of
the array, so the top candidate and its confidence are exactly what they
were without the lane. `rankTextColorCandidates` has no selector arm at
all and emits only when the colour role is not derivable.

**What it can supply — four roles, and only four.** `heading-typography`,
`body-typography`, `heading-text`, `body-text`
(`SALIENT_TYPOGRAPHY_ROLE`, `SALIENT_TEXT_COLOR_ROLES`).
`header-typography`, `footer-typography` and `button-typography` can reach
`salient_evidence_present` and be NAMED in a gap message, but nothing maps
them to a candidate emitter — so a gap on those three can never be filled,
whatever the message says about the page.

**What it cannot supply.** A licence on its own. Its entries are capped at
`UNCORROBORATED_CONFIDENCE_CAP = 0.75` (0.38 when two rows share the role)
because they stand on one leg: the row was measured, nothing says it IS
the role. They are marked `"source": "salient-text"`, and that marker —
not the confidence — is what the bounded exception in SKILL.md reads.
Entries published on the empty-bucket trigger for a role the mapper DID
resolve are a measurement and not a licence; their own `evidence` string
says so, and copying one is refused as `value_not_measured`. The colour
arm additionally drops `#ffffff` and unreadable colours, so a white
heading is not recoverable through this lane.

**When it supplies nothing.** A missing or empty `salient-text.json` makes
every salient path return `[]` and grading fall through to
`no_evidence` / `probe_provenance_unproven` — behaviour identical to
before the lane existed. A blocked homepage writes the artifact with
`status: "blocked"` and zero rows. And the whole branch is unreachable
without `text-styles.probed.json`: absent the sidecar, grading stops at
`probe_provenance_unproven` before it ever reaches the salient rung.

The `info` cases:

- `brand.typography` is empty AND `homepage-pass-status.json` reports the
  homepage is blocked (`blockedBySecurityInterstitial: true` or
  `status: "blocked"`). Both conditions together describe the
  blocked-homepage stop state SKILL.md documents. Either condition alone
  is NOT a free pass: empty typography on a completed homepage is the
  silent regression class the gate is supposed to catch.
- For a product-card-dependent role, `productCard[0]` lacks a usable
  signature on the corresponding field (`titleTypography` /
  `priceTypography` / `oldPriceTypography` is null/missing, or
  `missingEvidence` flags it). The mirror appender cannot tag OR
  synthesise a hint without a probe signature.

The "signature exists but no top-level match" path is no longer a skip:
`appendTypographyRoleMirrors` now synthesises a top-level typography
record from the probe signature when no match exists, so by the time the
gate runs the role hint either is present (synthesis ran) or the
signature itself was unusable (already covered above). The gate recording
`role_not_produced` in this state means synthesis was bypassed or somehow
failed silently — that is the silent regression class the gate exists
to catch.

Synthesis runs in BOTH `--mode scaffold` and `--mode normalize`. The
scaffold ordering mirrors normalize: `normalizeLayouts` then
`appendTypographyRoleMirrors` before the diagnostic block. Without this,
the scaffold's `assembly-diagnostics.json typographyRoleCoverage` would
contradict the SKILL.md contract ("the scaffolder synthesises") by
listing `role_not_produced` entries for productCard mirror roles even when the
probe signature was usable.

`appendTypographyRoleMirrors` keys idempotency off the matched index in
`brand.typography[]` rather than a hint-presence scan. A stale tagged
record at the wrong signature does NOT count as satisfying the
mirror — the helper synthesises a fresh record at the productCard
signature so the downstream compiler always finds a correctly-sized
match. The follow-up `typographyHintDuplicationDiagnostics` then
surfaces the drift as severity:info — an informational breadcrumb that
the deterministic helpers (canonical-family merge + synthesis) handle
on the next normalize pass. The agent is explicitly instructed via
SKILL.md to NOT respond to this entry by editing typography rows;
historically a `warn` severity here triggered the very strip-hints
behaviour the contract forbids.

When the gate does fire, the error message prints one line per missing
role with the target signature (family/weight/sizePx) and whether a
matching record exists in `brand.typography[]`.

## Pre-tag helper mechanics

SKILL.md "Scaffolder pre-tags" names what arrives pre-tagged; the
helper-level mechanics live here:

- `lib/colour-pre-emit.js` — pre-emits the rankers' top candidates into
  `brand.colors.*` at confidence ≥ 0.5 (top candidate only), and ALWAYS
  tags `components.button[]` rows matching the top non-chrome primary
  candidate with `button-primary-background` (ungated, strictly
  additive). Idempotent: a record with the same value and a
  fully-covering hint set is skipped.
- `lib/region-bg-hints.js` — `header-background` / `footer-background`
  synthesis from region-identified `background-styles.json` rows.
  Confidence gate: summed `viewportCoverage >= 0.05`.
- `lib/region-bg-content-hint.js` — `content-background` synthesis from
  `<main>` / `[role="main"]` probe rows.
- `lib/product-card-surface-hint.js` — `product-card-surface-background`
  from the most-common `card.backgroundColor` across rows passing
  `isLikelyProductCardRow` (≥ 3 contributors, > 50% majority).
- `lib/product-card-synth-from-evidence.js` — placeholder productCard
  synthesis when `productCard[]` is empty and probe captured card-shape
  rows. Runs at normalize (not scaffold) because `productCard[]` only
  stabilises as a real "empty array" after dedupe / placeholder-collapse
  / non-ecom / non-purchase drops have run.

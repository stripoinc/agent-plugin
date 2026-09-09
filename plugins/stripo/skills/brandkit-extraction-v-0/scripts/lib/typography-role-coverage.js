// Typography role-coverage diagnostic. The email template's compiler +
// customise pipeline expects specific role tags to be present on
// `brand.typography[*].usageHints`:
//
//   Always required (the email shell can't render without them):
//     - heading-typography  -> h1/h2 styling
//     - body-typography     -> paragraph copy
//     - header-typography   -> header-region text
//     - footer-typography   -> footer-region text
//     - button-typography   -> CTA buttons
//
//   Required when productCard is non-empty:
//     - product-name-typography
//     - product-price-typography
//     - product-card-cta
//
//   Required when productCard has an old-price element (`oldPriceColor`
//   set on the card record):
//     - product-old-price-typography
//
// When the agent ships a draft that lacks any of these required
// hints, the compiler falls back to body/heading defaults — which can
// be invisible. But when the downstream customise typography plan's
// support check sees a fallback font_family_* without a usable hint
// chain it was said to return `needs_review` and abort mutation. NO SUCH
// CONSUMER EXISTS. `needs_review` appears only inside this skill and its own
// fixtures, and no reader of these hints refuses a kit that lacks one. The claim was
// pressure with nothing behind it, and agents obeyed it by inventing hints
// The claim went on: no rendered email produced, said to be what had blocked a
// previously-working email build when curation dropped required role hints.
// That story is why authority moved into this deterministic layer. The drift it
// describes was real; the abort it threatens was not.
//
// The diagnostic emits one entry per missing required hint so the run can
// REPORT which one is missing. Re-tagging is not the agent's to do; see the
// deterministic-roles paragraph in SKILL.md. Severity is "high" because a hint
// DROPPED from evidence that supports it is a real regression, not because
// anything downstream blocks. The gate cannot yet tell that case from a site
// whose evidence never supported the hint, which is tracked work.
//
// B1+B2 guards keep the gate from firing on cases the assembler CANNOT
// resolve by design (the role-tagging contract is verify-only; agents
// MUST NOT author or strip these hints):
//   - typography:[] AND `homepage-pass-status.json` reports blocked.
//     Either condition alone is NOT a free pass — typography:[] with a
//     completed homepage means the extraction pipeline dropped every
//     curated record, which is the silent regression class the gate is
//     supposed to catch.
//   - productCard[0].{title,price,oldPrice}Typography is null/missing,
//     or `missingEvidence` flags it. The mirror appender needs a probe
//     signature to tag; without one no record can be synthesised.
//
// The "signature exists but no top-level match" case is no longer a B2
// extension here. `appendTypographyRoleMirrors` synthesises a top-level
// record from the probe signature when nothing matches, so by the time
// this diagnostic runs the role hint either is present (synthesis ran)
// or the signature itself was unusable (handled above). The previous
// B2 extension that down-graded "no match" to severity:info masked
// genuine authoring gaps — see commit message for context.
import {
  findMatchingTypographyIndex,
  TYPOGRAPHY_SIZE_TOLERANCE_PX,
} from "./product-card-cta-mirrors.js";
import {
  typographyRoleEvidence,
  missingRoleIsHonestGap,
  selectorEvidenceIsAbsent,
  EVIDENCE_ABSENT,
  EVIDENCE_PRESENT,
  EVIDENCE_GRADED_TYPOGRAPHY_HINTS,
  EVIDENCE_GRADED_PRODUCT_CARD_TYPOGRAPHY_HINTS,
  SALIENT_EVIDENCE_PRESENT,
  AUTHORED_WITHOUT_EVIDENCE,
  VALUE_NOT_MEASURED,
  ROLE_NOT_PRODUCED,
  typographyValueIsPublishedCandidate,
  typographyValueIsCaptureAnchored,
  productCardTypographyValueIsMirrorAnchored,
} from "./role-evidence.js";
import { salientRowsForRole, describeSalientRow } from "./salient-text.js";

export const ALWAYS_REQUIRED_TYPOGRAPHY_HINTS = [
  "heading-typography",
  "body-typography",
  "header-typography",
  "footer-typography",
  "button-typography",
];

// product-name-typography and product-price-typography are required
// for any product-card render. product-card-cta typography is only
// meaningful when the card's CTA has visible text — icon-only product
// cards deliberately omit this hint because there is no visible button
// text to style.
export const PRODUCT_CARD_REQUIRED_TYPOGRAPHY_HINTS = [
  "product-name-typography",
  "product-price-typography",
];
export const PRODUCT_CARD_CTA_TYPOGRAPHY_HINT = "product-card-cta";
export const OLD_PRICE_REQUIRED_TYPOGRAPHY_HINTS = ["product-old-price-typography"];

// Map productCard-required role hints back to the productCard[0] typography
// field that supplies their signature. The B2 unresolvable guard reads from
// these: when productCard[0].titleTypography is null/missing (or carries a
// `missingEvidence` marker for that field), the helper cannot tag the role —
// demanding it would block the gate on a probe gap, not an authorship gap.
const PRODUCT_CARD_HINT_TO_FIELD = new Map([
  ["product-name-typography", "titleTypography"],
  ["product-price-typography", "priceTypography"],
  ["product-old-price-typography", "oldPriceTypography"],
  [PRODUCT_CARD_CTA_TYPOGRAPHY_HINT, null],
]);

// The `productCard[0]` field a productCard typography mirror is copied from,
// and `null` for anything this channel does not own.
//
// EXPORTED BECAUSE THE NORMALIZE THROW HAS TO SPLIT ON THE SAME FACT. Both
// channels emit `reason: "value_not_measured"`, so the throw's sole-carrier
// section -- which is region-worded and ends "copy ONE captured row for the
// role out of text-styles.json" -- was reached by every productCard refusal
// too. That artifact holds no value for these roles: a mirror is not produced
// from a probe selector, and the per-entry message below says so and names
// this field instead. Two spellings of "which channel is this" would drift and
// the two texts would then contradict each other, exactly as `anchoredCarrier`
// is computed once by the gate and merely read by the throw.
export function productCardTypographyRepairField(hint) {
  if (!EVIDENCE_GRADED_PRODUCT_CARD_TYPOGRAPHY_HINTS.includes(hint)) return null;
  return PRODUCT_CARD_HINT_TO_FIELD.get(hint) || "cta";
}

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

// What a gap says. The first form is the one this file has always emitted and
// it stays byte-identical: with no salient artifact — every capture written
// before it existed — or with one that holds no admissible row, "the page
// offers nothing for this role" is backed by everything the run has.
//
// The second form exists because that sentence was being written on pages
// where it is FALSE: a site whose heading no selector can address still has
// its heading recorded, with its colour, in `salient-text.json` beside this
// diagnostic.
//
// It is also the ONE message that fires on the run where the bounded exception
// applies, so it is the one that has to state it. This message is where the
// agent hears the rule at the moment of decision -- the absolute form was
// stated on five surfaces at once and flipping four of them would leave this
// one instructing the opposite, which is the failure class #124 and #128 both
// closed one surface at a time.
const GAP_MESSAGE = (hint) =>
  "region role `" + hint +
  "` is unavailable on this page: the capture contains no element that the deterministic selector mapper assigns to this role, so no producer could have derived it. Recorded as a gap; the kit persists without it and the report names it. This is not a fault to investigate and not a hint to author.";

const SALIENT_GAP_MESSAGE = (hint, rows) =>
  "region role `" + hint +
  "` was not produced on this page: the capture contains no element that the deterministic selector mapper assigns to this role. The selector-free capture (salient-text.json) does hold " +
  rows.length +
  " row(s) whose recorded shape is compatible with this role; the most prominent of them, by that capture's own ranking, is " +
  describeSalientRow(rows[0]) +
  ". A salient row is not a selector match: no producer derived this role, and it is recorded as a gap -- the kit persists without it and the report names it. There is exactly one way to tag it, and no other: a `brand.typography[]` record may carry `" +
  hint +
  "` only when its (family, weight, sizePx) EQUALS a value this run published in `assembly-diagnostics.json.candidates[\"" + hint + "\"]` on an entry carrying `\"source\": \"salient-text\"`, copied verbatim from there. Entries WITHOUT that marker come from the selector lane and license nothing: the ranker admits a bucket on size and weight alone, so a page's button and link labels can win a heading bucket the selector-to-role mapper never tagged. Any other value -- adjusted, rounded, or read off a screenshot -- is recorded as an authored hint the capture does not support, and it ships that way: the run no longer stops, so nothing but this rule protects the account from a fabricated font. If no salient-sourced candidate is published for this role, there is nothing to copy and the gap stands.";

function numberOrNull(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function normalizeUsageHints(value) {
  const output = [];
  for (const item of Array.isArray(value) ? value : []) {
    const raw = normalizeText(item);
    if (!raw) continue;
    if (!output.includes(raw)) output.push(raw);
  }
  return output;
}

function productCardHasTypographyEvidence(card, field) {
  if (!card || typeof card !== "object" || !field) return false;
  const typo = card[field];
  if (!typo || typeof typo !== "object") return false;
  // A signature is usable only when `family` + numeric `sizePx` are both
  // present. Without these the appendTypographyRoleMirrors helper can never
  // match a top-level record, so the gate cannot be satisfied.
  const family = normalizeText(typo.family);
  const sizePx = numberOrNull(typo.sizePx ?? typo.fontSizePx);
  if (!family || sizePx === null) return false;
  // missingEvidence entries naming this field also disqualify it.
  const missing = Array.isArray(card.missingEvidence) ? card.missingEvidence : [];
  for (const note of missing) {
    const text = normalizeText(note).toLowerCase();
    if (!text) continue;
    if (text.includes(field.toLowerCase())) return false;
  }
  return true;
}

// Is EVERY record carrying this hint anchored to a value this run published
// for it?
//
// EVERY, not any. A second record carrying the same region role with a value
// nobody measured is exactly the fabrication this gate exists to refuse, and
// an `any` reading would let one honest row license it. No carrier at all is
// not anchored either -- the caller only reaches here when the hint IS
// present, so an empty carrier list means the hint was found somewhere this
// function cannot see, and a check that cannot see the value must refuse.
function typographyHintIsValueAnchored(typography, hint, candidates) {
  const carriers = typography.filter(
    (record) => record && typeof record === "object" && normalizeUsageHints(record.usageHints).includes(hint),
  );
  // `every` on an empty array is TRUE, so without this line "no carrier" would
  // read as "anchored" and widen the authority. Unreachable from the two
  // production call sites -- `presentHints` is derived from this same array
  // with this same normalizer, so a present hint always has a carrier -- which
  // is why its flipped mutant survives the suite. Kept because it guards the
  // vacuous-truth footgun, not the reachable path; deleting it would leave a
  // widening one refactor away.
  if (carriers.length === 0) return false;
  return carriers.every((record) => typographyValueIsPublishedCandidate(candidates, hint, record));
}

// The present-evidence twin. Same `every`, same empty-carrier refusal, and the
// same reason for both: one honest row must not license a second row carrying
// the region role at a signature nothing measured.
//
// AND ITS EMPTY-CARRIER GUARD IS UNPINNED, exactly like the twin's above and
// for exactly the same reason -- both callers reach this only after
// establishing the hint is present with this same normalizer, so a present hint
// always has a carrier and the reachable path never sees an empty list.
// Verified: flipping `return false` to `return true` here leaves the whole node
// suite green. It is disclosed rather than pinned because a test would have to
// call the private function directly to reach a state production cannot
// produce, and the guard is kept for the same reason the twin's is -- it fences
// the vacuous-truth footgun, where `[].every(...)` is `true` and an empty
// carrier list would report the role as anchored by nothing at all.
//
// NO CARDS ARE PASSED, and that is a deliberate narrowing rather than an
// omission. `product-card-styles.json` used to be threaded here so a record's
// `family` could be admitted when only a productCard mirror spelled it. That
// arm could not model its own producer: a card's spelling reaches a REGION-role
// record only by winning `mergeTypographyByCanonicalFamily`, whose winner is
// picked from `payload.brand.typography` -- peers this diagnostic does not hold
// and must not read off the artifact it is judging. Every approximation of it
// admitted records no producer emits; the last one let a card's family through
// carrying a peer ROW's `fontStyle` and `textTransform`. It is gone, with the
// measurement that made removal available on
// `typographyValueIsCaptureAnchored`: 0 load-bearing records over the 690
// archived scaffolder drafts and the 709 archived agent-authored artifacts.
function typographyHintIsCaptureAnchored(typography, hint, textStyles) {
  const carriers = typography.filter(
    (record) => record && typeof record === "object" && normalizeUsageHints(record.usageHints).includes(hint),
  );
  if (carriers.length === 0) return false;
  return carriers.every((record) => typographyValueIsCaptureAnchored(textStyles, hint, record));
}

// The productCard twin of `typographyHintIsCaptureAnchored`. Same `every`, same
// empty-carrier refusal, same reason: one honest mirror must not license a
// second row carrying the role at a signature no card measured.
function productCardHintIsMirrorAnchored(typography, hint, productRows, textStyles) {
  const carriers = typography.filter(
    (record) => record && typeof record === "object" && normalizeUsageHints(record.usageHints).includes(hint),
  );
  if (carriers.length === 0) return false;
  return carriers.every((record) =>
    productCardTypographyValueIsMirrorAnchored(productRows, textStyles, hint, record),
  );
}

// ---------------------------------------------------------------------------
// WHO CARRIES THE ROLE, AND WHICH OF THEM THE CAPTURE ANCHORS.
//
// The `value_not_measured` refusal below used to say, in every case:
//
//     "Removing the hint does NOT help here and makes it worse."
//
// That is true of ONE shape and false of the other, and the other is the common
// one. Measured over the observed typography refusals: every one of them has a
// correctly anchored carrier record ALREADY PRESENT, and the refusal fires
// because a STRAY copy of the hint sits on a second, unanchored row. The
// branch's own documentation calls multi-carrier "the normal shape". An agent
// obeying the sentence copies a captured row over a genuinely measured record
// to satisfy a gate that is pointing at a different row -- the message
// instructs data destruction.
//
// Both anchors are asked, because both channels emit this reason and they do
// not judge against the same artifact: the region roles against
// `text-styles.json`, the productCard roles against `product-card-styles.json`.
function typographyRoleCarrierSplit(typography, hint, textStyles, productRows) {
  const carriers = typography.filter(
    (record) => record && typeof record === "object" && normalizeUsageHints(record.usageHints).includes(hint),
  );
  const isProductRole = EVIDENCE_GRADED_PRODUCT_CARD_TYPOGRAPHY_HINTS.includes(hint);
  const anchored = carriers.filter((record) =>
    isProductRole
      ? productCardTypographyValueIsMirrorAnchored(productRows, textStyles, hint, record)
      : typographyValueIsCaptureAnchored(textStyles, hint, record),
  );
  return { carriers, anchored };
}

// Enough of a record to find it in `brand.typography[]` by eye, and no more.
// Named so the multi-carrier repair can say which row must NOT be edited.
function describeTypographyCarrier(record) {
  const family =
    typeof record?.family === "string" && record.family.trim() ? record.family.trim() : "(no family)";
  const weight = numberOrNull(record?.weight);
  const sizePx = numberOrNull(record?.sizePx);
  return `\`${family}\` at ${weight === null ? "?" : weight}/${sizePx === null ? "?" : sizePx}px`;
}

// The tail every `value_not_measured` typography message ends on, whichever
// repair it prescribes.
const VALUE_NOT_MEASURED_TAIL =
  "Do NOT invent a value, and do NOT re-probe with a narrower selector list to make this message go away.";

// THE MULTI-CARRIER REPAIR, and it is the opposite of the sole-carrier one. It
// is safe precisely because the anchored row keeps the role: removing the stray
// hint leaves `presentHints` unchanged and every remaining carrier anchored, so
// the role does not go missing. Verified by running the gate before and after
// the removal on the same payload: one entry, then none.
const multiCarrierRepair = (hint, anchoredCarrier) =>
  "THE REPAIR IS TO REMOVE THE STRAY HINT FROM THE UNANCHORED ROW. Another row already carries this role and IS anchored to the capture -- " +
  anchoredCarrier +
  " -- so removing `" + hint +
  "` from the row that is not anchored leaves the role present and covered, not missing. Leave the anchored record exactly as it is: do NOT edit it, and do NOT copy a captured row over it, which would overwrite a genuinely measured value to satisfy a gate that is pointing at a different row. " +
  VALUE_NOT_MEASURED_TAIL;

function isHomepageBlocked(homepageStatus) {
  if (!homepageStatus || typeof homepageStatus !== "object") return false;
  if (homepageStatus.blockedBySecurityInterstitial === true) return true;
  const status = normalizeText(homepageStatus.status).toLowerCase();
  return status === "blocked";
}

// Produce a one-line, machine-greppable diagnostic context for a missing
// required role. Reports the target signature (family/weight/sizePx) for
// productCard-mirror roles + whether a matching record is present in
// brand.typography[]; for always-required roles, names that no record
// carries the hint yet. Keeps the gate message focused on what evidence the
// scaffolder actually has so the operator can tell B1/B2/B3 apart from a
// real authorship gap.
//
// Uses `findMatchingTypographyIndex` (the shared matcher from
// product-card-cta-mirrors.js) so the ±1px tolerance constant lives in
// exactly one place — a parallel matcher here drifted in the past.
export function describeRoleResolution(hint, payload) {
  const cards = Array.isArray(payload?.brand?.components?.productCard)
    ? payload.brand.components.productCard
    : [];
  const card = cards[0] || null;
  const field = PRODUCT_CARD_HINT_TO_FIELD.get(hint);
  if (!field) {
    // Always-required / CTA-typography hint without a specific
    // productCard signature → just report that the record set lacks it.
    return `${hint}: no record in brand.typography[] carries this hint`;
  }
  const typo = card && typeof card === "object" ? card[field] : null;
  if (!typo || typeof typo !== "object") {
    return `${hint}: productCard[0].${field} is null/missing — cannot mirror without a probe signature`;
  }
  const family = normalizeText(typo.family) || "?";
  const weightVal = numberOrNull(typo.weight);
  const sizePx = numberOrNull(typo.sizePx ?? typo.fontSizePx);
  const weightLabel = weightVal === null ? "?" : weightVal;
  const sizeLabel = sizePx === null ? "?" : sizePx;
  const typography = Array.isArray(payload?.brand?.typography)
    ? payload.brand.typography
    : [];
  // Shared matcher. The signature shape it accepts (family + numeric
  // weight + numeric sizePx) matches typo here; when any of those is
  // null/empty, findMatchingTypographyIndex returns -1 which we report
  // as "no matching record".
  const matched = findMatchingTypographyIndex(typography, typo) !== -1;
  return `${hint}: target ${family}/${weightLabel}/${sizeLabel}, ${matched ? "matched a record but hint absent" : "no matching record in brand.typography[] within ±" + TYPOGRAPHY_SIZE_TOLERANCE_PX + "px"}`;
}

// Detect productCard mirror role hints that landed on more than one
// typography record. Severity is `"info"`, NOT `"warn"`: the deterministic
// helpers (`mergeTypographyByCanonicalFamily` + `appendTypographyRoleMirrors`)
// resolve duplicates on the next normalize pass — the agent cannot act
// here, and historically responded to the prior warn-level message by
// stripping role hints from typography rows, which is the forbidden
// author/strip path under SKILL.md `Role-tagging contract → Hint
// preservation` and `Role-tagging contract → Typography mirrors`.
//
// When this entry fires, it almost always reflects one of two shapes that
// upstream helpers handle on their own:
//   1. Two records with the same canonical primary font name but
//      different fallback stacks — collapsed by
//      `mergeTypographyByCanonicalFamily`.
//   2. Stale tagged record at the wrong signature coexisting with a freshly
//      synthesised one at the correct signature (W3 drift). The follow-up
//      pass picks up after the agent edits land.
//
// Severity remained `"warn"` historically; that proved unactionable in
// practice and triggered the very behaviour SKILL.md prohibits. The
// entry now stays as a tracked-state breadcrumb in
// `assembly-diagnostics.json` so an operator who suspects drift across
// runs has a paper trail, but it does not block the gate and the agent
// is explicitly instructed not to "fix" it from the SKILL.md side.
export function typographyHintDuplicationDiagnostics(payload) {
  const typography = Array.isArray(payload?.brand?.typography)
    ? payload.brand.typography
    : [];
  if (typography.length === 0) return [];
  const counts = new Map();
  for (const record of typography) {
    const hints = normalizeUsageHints(record?.usageHints);
    for (const hint of hints) {
      counts.set(hint, (counts.get(hint) || 0) + 1);
    }
  }
  // Only report roles in the productCard-mirror family. Always-required
  // roles (heading / body / header / footer / button) can legitimately
  // appear on more than one record — e.g. body-typography on two distinct
  // weights of the body face. The dedup safety net handles those by
  // signature; cross-signature reuse is fine.
  const REPORTABLE = new Set([
    ...PRODUCT_CARD_REQUIRED_TYPOGRAPHY_HINTS,
    ...OLD_PRICE_REQUIRED_TYPOGRAPHY_HINTS,
  ]);
  const output = [];
  for (const [hint, count] of counts) {
    if (count <= 1) continue;
    if (!REPORTABLE.has(hint)) continue;
    output.push({
      hint,
      severity: "info",
      message:
        "[INFO] Duplicate productCard mirror role hint detected (`" +
        hint +
        "` appears on " +
        count +
        " records). This is informational only — the deterministic helper resolves duplicates on normalize. **DO NOT strip hints from typography rows.** If the duplicate persists across normalize passes, file a BACKLOG item describing the typography signatures involved.",
      count,
      productCardDependent: true,
      oldPriceDependent: OLD_PRICE_REQUIRED_TYPOGRAPHY_HINTS.includes(hint),
    });
  }
  return output;
}

// `textStyles` is the raw probe capture. It is what lets a missing role
// be graded as an honest gap rather than a fault: see `lib/role-evidence.js`.
// Omitting it (older callers, tests) leaves the capture unusable, which
// grades `high` — the pre-gap behaviour — so the argument is additive and
// cannot silently soften a gate that was not updated.
//
// `salientRows` is `salient-text.json`'s rows, read through
// `readSalientRows`. It changes MESSAGE TEXT only: no severity depends on it
// and no authority does. Omitting it (`null`) is the pre-salient behaviour,
// which is also what every capture written before the artifact existed gets.
//
// `candidates` is this run's `buildCandidates` output -- the same block the
// diagnostics publish. It is the ONE thing that can spare a present region
// role from the authored-without-evidence refusal below, and only by matching
// a value the run itself printed. Omitting it (`null`) publishes nothing, so
// every present hint under an absence grade is refused exactly as it was
// before this parameter existed.
//
// `productRows` is `product-card-styles.json`, and it is BACK -- for a
// different question, on a different record, answered from a different file
// than the arm that was removed.
//
// What was removed fed `typographyValueIsCaptureAnchored`: it tried to admit a
// CARD's family onto a REGION-role record, which means modelling
// `mergeTypographyByCanonicalFamily`, whose winner is chosen from
// `payload.brand.typography` peers this diagnostic does not hold and must not
// read off the artifact it is judging. Three narrowings failed and the arm went.
//
// What comes back grades the PRODUCT roles -- and until now nothing graded
// them at all. `typographyRoleEvidence` returns `EVIDENCE_PRESENT` for every
// hint outside `EVIDENCE_GRADED_TYPOGRAPHY_HINTS` without reading a row, and
// the value branch below is fenced by that same list, so
// `product-name-typography`, `product-price-typography`, `product-card-cta` and
// `product-old-price-typography` reached no anchor of any kind. Measured
// through this function, A/B with one identical invention moved between roles:
// `heading-typography` emits `{severity: "high", reason: "value_not_measured"}`
// and each product role emits NOTHING.
//
// Omitting it (`null`, and every caller not taught to pass it) skips the new
// arm entirely, which is the behaviour every build before it had. A caller with
// no probe artifact in hand gets the old answer rather than a guess -- the same
// posture `familySpellingIsCaptured` takes for the same reason.
export function typographyRoleCoverageDiagnostics(payload, homepageStatus, textStyles = null, probedSelectors = null, salientRows = null, candidates = null, productRows = null) {
  const typography = Array.isArray(payload?.brand?.typography)
    ? payload.brand.typography
    : [];

  // B1 — Skip every typography role check ONLY when typography is empty
  // AND the homepage is in a blocked stop state. Either condition alone
  // is insufficient: an empty typography array on a completed homepage
  // is the silent-regression class the gate is supposed to catch (the
  // extraction pipeline produced records during scaffold, the agent or
  // a normalize helper wiped them, the customise pipeline now has
  // nothing to anchor font_family_* on). A blocked homepage on its own
  // can legitimately ship empty typography per SKILL.md Stop conditions
  // — that case is covered by the AND.
  //
  // Surfaces an `info` entry instead of staying silent so the audit
  // trail still shows the gate ran.
  if (typography.length === 0 && isHomepageBlocked(homepageStatus)) {
    return [
      {
        hint: null,
        severity: "info",
        message:
          "typography role coverage skipped: brand.typography is empty AND homepage-pass-status reports the homepage is blocked; no required hints can be verified on an empty blocked-homepage extraction",
        productCardDependent: false,
        oldPriceDependent: false,
      },
    ];
  }

  const presentHints = new Set();
  for (const record of typography) {
    for (const hint of normalizeUsageHints(record?.usageHints)) {
      presentHints.add(hint);
    }
  }

  const cards = Array.isArray(payload?.brand?.components?.productCard)
    ? payload.brand.components.productCard
    : [];
  // `cards` is the PAYLOAD's, and stays so: it decides which roles are
  // REQUIRED, which is a property of the kit being graded. It decides nothing
  // about which VALUES are admissible -- that question no longer reads a card
  // at all, from either side; see `typographyHintIsCaptureAnchored`.
  const hasProductCards = cards.length > 0;
  const hasOldPriceEvidence = cards.some(
    (card) =>
      card && typeof card === "object" && normalizeText(card.oldPriceColor),
  );
  // Only require product-card-cta typography when at least one card's
  // CTA actually has visible text. Icon-only CTAs (`isIconLike: true`
  // AND `hasUsableVisibleText: false`) intentionally lack this hint.
  const hasVisibleCtaText = cards.some((card) => {
    const cta = card && typeof card === "object" ? card.cta : null;
    return cta && typeof cta === "object" && cta.hasUsableVisibleText === true;
  });

  const required = [...ALWAYS_REQUIRED_TYPOGRAPHY_HINTS];
  if (hasProductCards) required.push(...PRODUCT_CARD_REQUIRED_TYPOGRAPHY_HINTS);
  if (hasVisibleCtaText) required.push(PRODUCT_CARD_CTA_TYPOGRAPHY_HINT);
  if (hasOldPriceEvidence) required.push(...OLD_PRICE_REQUIRED_TYPOGRAPHY_HINTS);

  const card0 = hasProductCards ? cards[0] : null;

  const output = [];
  for (const hint of required) {
    if (presentHints.has(hint)) {
      // PROVENANCE. Until now a present hint ended the enquiry: the gate
      // checked that a role EXISTED and never asked who put it there. That
      // is the hole #124 left open -- it retired the six messages that
      // INSTRUCTED the authoring, but nothing stopped an agent doing it
      // anyway, and a hand-added hint is indistinguishable from a derived
      // one once it is on the row.
      //
      // A region role is produced by the scaffolder from probe selectors or
      // it is not produced at all. So when the probe PROVES the page offers
      // no row this role could derive from, and the hint is present
      // regardless, something authored it. That is a contract violation,
      // not a page property, and it is fatal like every other process fault.
      //
      // Only the ABSENCE grades fire this. UNPROVEN and CAPTURE_UNUSABLE both
      // mean the run cannot tell, and a check that fired on "cannot tell"
      // would refuse legitimate kits -- including every capture written
      // before the probed-selectors sidecar existed.
      //
      // `selectorEvidenceIsAbsent`, not `=== EVIDENCE_ABSENT`: a salient row
      // is not a selector match and produces no role, so a page that grew a
      // salient artifact must be refused exactly as it was before. Comparing
      // against the one constant here is how the new grade would have become
      // the excuse that lets a fabricated hint through.
      // No graded-list guard here on purpose: `typographyRoleEvidence`
      // already returns EVIDENCE_PRESENT for any hint outside that list, so
      // a productCard mirror can never reach EVIDENCE_ABSENT. A second
      // mechanism for the same outcome is one that can rot unnoticed --
      // removing it changed nothing, which is how it was found.
      //
      // THE BOUNDED EXCEPTION, and it EXTENDS this refusal rather than
      // repealing it. The question used to be "did a selector produce this
      // role"; it is now "did a selector produce this role, OR is the value on
      // every row carrying it one this run published as a candidate for it".
      // A value outside that set is refused exactly as it was, and the run
      // stops. See `typographyValueIsPublishedCandidate` for why the match is
      // exact.
      //
      // TWO BRANCHES, NOT ONE CONJUNCTION. This used to read
      // `selectorEvidenceIsAbsent(...) && !anchored(...)`, and `&&`
      // short-circuits: under `EVIDENCE_PRESENT` the first term is false and
      // the anchor NEVER RAN, so wherever a selector DID produce the role the
      // value on the tagged row was compared to nothing -- 739 of the 767
      // usable saved captures, on `heading-typography` alone. A fabricated `PriceFace
      // 900/64` and a 32 -> 30 nudge both persisted through the real assembler
      // with `schemaValidated: true`, an empty coverage array and exit 0. The
      // present-evidence branch asks a
      // DIFFERENT question, because the published-candidate anchor is confined
      // to the salient lane and that lane publishes nothing here: is the row's
      // signature one the capture actually measured for this role?
      //
      // `UNPROVEN` and `CAPTURE_UNUSABLE` stay outside both branches, exactly
      // as before. Both mean the run cannot tell, and the capture anchor would
      // refuse EVERYTHING there -- the mapper matched no row, which is how the
      // grade was reached -- turning "we did not look" into a fatal.
      const evidence = typographyRoleEvidence(textStyles, hint, probedSelectors, salientRows);
      if (selectorEvidenceIsAbsent(evidence)) {
        if (!typographyHintIsValueAnchored(typography, hint, candidates)) {
          output.push({
            hint,
            // STYLING WARNS. A font family nobody measured is a cosmetic miss:
            // publishing it puts no false FACT in the account -- no contact, no
            // social URL, no asset URL -- and refusing the run persists
            // nothing at all, leaving the account with the previous run's kit
            // or with none. The finding is not weakened; only its severity is.
            severity: "gap",
            reason: AUTHORED_WITHOUT_EVIDENCE,
            message:
              "region role `" + hint +
              "` is present on a `brand.typography[*].usageHints` array, but the capture contains no element the deterministic selector mapper assigns to this role, and the (family, weight, sizePx) on at least one row carrying it is not a value this run published in `assembly-diagnostics.json.candidates[\"" + hint + "\"]` on an entry marked `\"source\": \"salient-text\"`. So the value was authored, and a value invented here asserts a page fact nothing measured. Either set the row to a published candidate value verbatim, or remove the hint and let the run record the honest gap. A candidate WITHOUT the salient-text marker does not count: it comes from the selector lane, which admits a bucket on size and weight alone. Do NOT invent a value, and do NOT re-probe with a narrower selector list to make this message go away.",
            productCardDependent: false,
            oldPriceDependent: false,
          });
        }
      } else if (
        evidence === EVIDENCE_PRESENT &&
        EVIDENCE_GRADED_TYPOGRAPHY_HINTS.includes(hint) &&
        !typographyHintIsCaptureAnchored(typography, hint, textStyles)
      ) {
        // The graded-list guard is REQUIRED here and is not the mirror of the
        // absence branch's "no guard on purpose" note. `typographyRoleEvidence`
        // returns `EVIDENCE_PRESENT` for every hint OUTSIDE that list without
        // reading a row, so a productCard mirror reaches this branch always --
        // and mirrors are produced by `appendTypographyRoleMirrors` from the
        // card record, not from a probe selector, so the selector mapper tags
        // no row for them and every genuine mirror would be refused.
        const regionSplit = typographyRoleCarrierSplit(typography, hint, textStyles, productRows);
        const regionAnchored = regionSplit.anchored.length > 0
          ? describeTypographyCarrier(regionSplit.anchored[0])
          : null;
        output.push({
          hint,
          severity: "gap",
          reason: VALUE_NOT_MEASURED,
          // The anchored carrier, or `null` when NO row carrying the role is
          // anchored -- which is not the same as "this row is the only
          // carrier", and the difference is a shape that occurs: two carriers,
          // neither anchored. It is what splits the repair, and it is on the
          // entry so the normalize throw can split the same way from the same
          // fact rather than recomputing it.
          anchoredCarrier: regionAnchored,
          message:
            "region role `" + hint +
            "` is present on a `brand.typography[*].usageHints` array, and the capture DOES contain elements the deterministic selector mapper assigns to this role -- but at least one row carrying it holds a value no such element was measured to have. The scaffolder copies a probe row onto the record through `typographyFromText` and tags it from that row's selector, so every field on the record traces to a measurement: `(family, weight, sizePx)` must be the signature of a row THIS ROLE's mapper selects, the `family` STRING must additionally be spelled -- character for character, ignoring case and repeated whitespace -- by some captured row carrying that signature (the signature match compares only the first font name in the list, so without this every declared fallback after the first would be unmeasured), and `lineHeightPx`, `fontStyle`, `letterSpacingPx` and `textTransform` must each be a value some captured row with that same signature carries (the dedup groups on the signature alone and may keep a sibling row's secondary fields under a unioned hint, which is why those four are checked against the signature rather than the role). Anything else was authored, or was a measured value edited afterwards -- a nudged `sizePx` is the drift already recorded in `product-card-cta-mirrors.js`. " +
            (regionAnchored
              ? multiCarrierRepair(hint, regionAnchored)
              : "THE REPAIR: copy ONE captured row for this role out of `text-styles.json` onto the record verbatim, every field of it; a single row satisfies both scopes at once, so that repair always works. Removing the hint does NOT help here and makes it worse: no row carrying this role is anchored to the capture, and the role is derivable on this page, so an absent hint is a missing role rather than an honest gap, and hints are never stripped by hand. " +
                VALUE_NOT_MEASURED_TAIL),
          productCardDependent: false,
          oldPriceDependent: false,
        });
      } else if (
        evidence === EVIDENCE_PRESENT &&
        EVIDENCE_GRADED_PRODUCT_CARD_TYPOGRAPHY_HINTS.includes(hint) &&
        Array.isArray(productRows) &&
        productRows.length > 0 &&
        !productCardHintIsMirrorAnchored(typography, hint, productRows, textStyles)
      ) {
        // THE PRODUCT-CARD ARM, and it is a NEW record rather than a promoted
        // one: before this branch existed the gate emitted nothing at all for
        // these roles, not a quieter entry. The two conditions are mutually
        // exclusive by construction -- `EVIDENCE_GRADED_TYPOGRAPHY_HINTS` and
        // `EVIDENCE_GRADED_PRODUCT_CARD_TYPOGRAPHY_HINTS` are disjoint -- so
        // the `else` is a reader's aid, not a precedence rule.
        //
        // `productRows.length > 0` is the "no evidence in hand" fence. A
        // capture without `product-card-styles.json` cannot be asked this
        // question, and a check that fired on "we could not look" would refuse
        // every capture written before the artifact existed.
        //
        // The anchor is `product-card-styles.json` -- a probe artifact BESIDE
        // the extraction, never `payload.brand.components.productCard`, which is
        // part of the thing on trial and would let one `jq` line vouch for
        // itself.
        const cardSplit = typographyRoleCarrierSplit(typography, hint, textStyles, productRows);
        const cardAnchored = cardSplit.anchored.length > 0
          ? describeTypographyCarrier(cardSplit.anchored[0])
          : null;
        output.push({
          hint,
          severity: "gap",
          reason: VALUE_NOT_MEASURED,
          anchoredCarrier: cardAnchored,
          message:
            "productCard role `" + hint +
            "` is present on a `brand.typography[*].usageHints` array, but at least one row carrying it holds a value no product card on this page was measured to have. This role is not produced from a probe SELECTOR -- `appendTypographyRoleMirrors` either copies `productCard[0]." +
            productCardTypographyRepairField(hint) +
            "` onto a fresh record verbatim, or tags an existing record whose (family, weight) equal that field's and whose `sizePx` is within " +
            TYPOGRAPHY_SIZE_TOLERANCE_PX +
            "px of it. So every field on a genuine mirror traces to a row of `product-card-styles.json`: the `(font stem, weight, sizePx)` must be a signature some card carries for this field, the `family` STRING must be spelled -- character for character, ignoring case and repeated whitespace -- by some card or captured row sharing that signature, and `lineHeightPx`, `fontStyle`, `letterSpacingPx` and `textTransform` must each be a value one of those carries (the merge and dedup passes may keep a signature peer's secondary field under a unioned hint, which is why those four are checked against the signature rather than the role). Anything else was authored, or was a measured value edited afterwards. " +
            (cardAnchored
              ? multiCarrierRepair(hint, cardAnchored)
              : "THE REPAIR: copy the card's own signature onto this row -- `family`, `weight`, `sizePx` and `lineHeightPx` from `productCard[0]." +
                productCardTypographyRepairField(hint) +
                "`, which is what the mirror producer would have written. Removing the hint does NOT help here and makes it worse: no row carrying this role is anchored to a card on this page, so an absent hint is a missing role rather than an honest gap, and hints are never stripped by hand. " +
                VALUE_NOT_MEASURED_TAIL),
          productCardDependent: true,
          oldPriceDependent: OLD_PRICE_REQUIRED_TYPOGRAPHY_HINTS.includes(hint),
        });
      }
      continue;
    }
    const isProductCardHint =
      PRODUCT_CARD_REQUIRED_TYPOGRAPHY_HINTS.includes(hint) ||
      hint === PRODUCT_CARD_CTA_TYPOGRAPHY_HINT;
    // B2 — When the productCard mirror has no usable signature for this
    // role, the appendTypographyRoleMirrors helper cannot synthesise or
    // tag a record by design. Down-grade to `info` so the gate doesn't
    // refuse to write on an evidence gap the scaffolder cannot fix.
    // Same for an explicit `missingEvidence` note on the field. The
    // OLD-PRICE dependent role gets the same treatment.
    //
    // The previous "B2 extension" (signature present but no top-level
    // match → info) was dropped: `appendTypographyRoleMirrors` now
    // synthesises a top-level record from the probe signature when no
    // match exists, so by the time this diagnostic runs the hint either
    // is present (synthesis ran) or the signature itself was unusable
    // (this block). Keeping the extension would hide a synthesis bug
    // — the gate must fire severity:high if synthesis was bypassed or
    // failed silently.
    const productCardField = PRODUCT_CARD_HINT_TO_FIELD.get(hint);
    const oldPriceField = OLD_PRICE_REQUIRED_TYPOGRAPHY_HINTS.includes(hint)
      ? "oldPriceTypography"
      : null;
    if (productCardField && card0 && !productCardHasTypographyEvidence(card0, productCardField)) {
      output.push({
        hint,
        severity: "info",
        message:
          "typography role `" + hint +
          "` skipped: productCard[0]." + productCardField +
          " has no usable signature (missing family/sizePx or flagged in missingEvidence); mirror cannot be appended without a probe signature",
        productCardDependent: true,
        oldPriceDependent: false,
      });
      continue;
    }
    if (oldPriceField && card0 && !productCardHasTypographyEvidence(card0, oldPriceField)) {
      output.push({
        hint,
        severity: "info",
        message:
          "typography role `" + hint +
          "` skipped: productCard[0]." + oldPriceField +
          " has no usable signature; mirror cannot be appended without a probe signature",
        productCardDependent: true,
        oldPriceDependent: true,
      });
      continue;
    }
    // Evidence-graded. `high` still means a producer fault and still stops
    // the run; `gap` means this page offers no row any producer could have
    // used, which is recorded and survives to the report instead of killing
    // the extraction. `textStyles == null` yields `high`, the old behaviour.
    // No null-guard here on purpose: `typographyRoleEvidence(null, …)`
    // already returns CAPTURE_UNUSABLE, which grades `high`. A second
    // mechanism for the same outcome is one that can rot unnoticed — a
    // mutation removing it changed nothing, which is how it was found.
    const evidence = typographyRoleEvidence(textStyles, hint, probedSelectors, salientRows);
    if (missingRoleIsHonestGap(evidence)) {
      // `reason` stays `EVIDENCE_ABSENT` on BOTH forms. It is the wire value
      // `brandkit_finalize` reads back as `{kind: "missing_role", ...,
      // reason: "no_evidence"}`, it is still true — no selector evidence
      // produced this role — and a second spelling here would be a shape
      // change nobody asked for. The salient rung is a sentence, not a state.
      const salient = salientRowsForRole(salientRows, hint);
      output.push({
        hint,
        severity: "gap",
        reason: EVIDENCE_ABSENT,
        message:
          evidence === SALIENT_EVIDENCE_PRESENT
            ? SALIENT_GAP_MESSAGE(hint, salient)
            : GAP_MESSAGE(hint),
        productCardDependent: isProductCardHint,
        oldPriceDependent: OLD_PRICE_REQUIRED_TYPOGRAPHY_HINTS.includes(hint),
      });
      continue;
    }
    output.push({
      hint,
      // A MISSING styling role is the emptiest possible value: it cannot assert
      // anything false about the page, and every downstream reader of these
      // hints falls through to a default rather than raising. The reason names
      // it as a producer fault so it stays tellable apart from the honest gap.
      severity: "gap",
      // NAMED, not reason-less. This entry and the `gap` one above are both
      // missing roles and they are opposite facts about the page: here the
      // evidence a producer needed IS present (or the run could not tell), so
      // reporting it as `no_evidence` would be false. It also has to stay
      // tellable apart from the honest gap after both carry `severity: "gap"`.
      reason: ROLE_NOT_PRODUCED,
      message:
        "missing required typography role: no `brand.typography[*].usageHints` carries `" +
        hint +
        "`. DO NOT author this hint. These roles are produced deterministically, by the scaffolder from probe selectors and by `appendTypographyRoleMirrors`; a hint added by hand asserts a fact about the page that no probe evidence supports, and nothing downstream can tell the two apart. Report the missing role and CONTINUE -- the run records it and the kit persists without it. No reader of these hints refuses a kit that lacks one; none of them raises; they fall through to a default or skip the field (`card_tokens.py` `_font_family_fallback_chain` is the clearest, ending in a literal family). So the cost of reporting this is a gap, and the cost of inventing it is a wrong brand. See the `Role-tagging contract` section in `SKILL.md`. Why the deterministic pass produced nothing is a MAINTAINER question, answered by `references/normalize-safety-nets.md` (step 8 — Typography mirrors); it is not a repair the run may make.",
      productCardDependent: isProductCardHint,
      oldPriceDependent: OLD_PRICE_REQUIRED_TYPOGRAPHY_HINTS.includes(hint),
    });
  }
  // W3 follow-up: append duplicate-hint warnings so the operator can see
  // stale drift (productCard mirror role on two records when the
  // signature shifted). Severity `warn` — non-blocking but visible.
  output.push(...typographyHintDuplicationDiagnostics(payload));
  return output;
}

// Deterministic mapping from a typography record's role hints to a
// human-readable usage description, used to SEED
// `brand.typography[*].description` when the probe supplied none.
//
// Why: every other brand-token row-builder writes a description inline at the
// moment it creates the row. The colour seeder (colour-pre-emit.js) emits
// `description: "Auto-tagged primary CTA background from probe evidence"`, the
// background/text-colour synthesisers (region-bg-hints.js,
// text-color-role-synthesis.js) emit "Auto-tagged …"/"Auto-synthesised …", and
// the productCard typography-mirror synthesiser (product-card-cta-mirrors.js)
// emits "Auto-synthesised from productCard[0].…". The one outlier was
// `typographyFromText` (extraction-pass-helpers.js), which builds the bulk
// typography rows from the text-styles probe with `description: ""` because the
// probe row carries no description field. That left ordinary
// heading/body/header/footer/button typography rows description-less unless the
// LLM agent authored one — which it did inconsistently, occasionally shipping
// empty font descriptions to the brandkit.html preview.
//
// This helper closes the gap the same way the colour builders do: it derives a
// usage-prose description from the role hints the scaffolder has already tagged.
// The agent rewrites this seed with richer, site-specific prose on the happy
// path (empirically the agent rewrites 100% of seeded colour descriptions — no
// "Auto-*" seed survives to any final artifact); the seed is the graceful
// fallback for the rare run where the agent leaves the description empty.
//
// Wording is reader-facing prose ("Applied to headings and section titles."),
// NOT the colour builders' techy "Auto-tagged … from probe evidence". The
// difference is intentional: a colour seed never survives to a final artifact
// (the agent always rewrites it) and — load-bearing — its text is regex-scanned
// by purifyProductCardLinkRoles (text-color-link-region-purify.js) to strip
// link role hints, so its wording is internal scaffolding. A typography
// description, by contrast, CAN survive to the final artifact and no downstream
// consumer reads its text, so it should read well to a human.

// Canonical clause per typography usageHint. Each names the email-template role
// the hint resolves to, per the SKILL.md "Description rule" (explain how/when/
// where the style is applied — not raw tags, selectors, or CSS).
const HINT_CLAUSES = {
  "heading-typography": "headings and section titles",
  "body-typography": "body copy and paragraph text",
  "header-typography": "header and top navigation links",
  "footer-typography": "footer links and fine print",
  "button-typography": "call-to-action button labels",
  "product-name-typography": "product names on product cards",
  "product-price-typography": "current prices on product cards",
  "product-old-price-typography": "struck-through original prices on product cards",
  "product-card-cta": "product-card call-to-action labels",
};

// Canonical hint order — matches the typographyUsageHint enum order in
// references/extraction-stage.schema.json. Joining clauses in this fixed order
// makes the seed deterministic regardless of the incoming usageHints order, so
// two rows carrying the same hint set always get byte-identical prose (and the
// fill is stable across repeated normalize passes).
const HINT_ORDER = [
  "body-typography",
  "heading-typography",
  "header-typography",
  "footer-typography",
  "button-typography",
  "product-name-typography",
  "product-price-typography",
  "product-old-price-typography",
  "product-card-cta",
];

function joinClauses(clauses) {
  if (clauses.length === 1) return clauses[0];
  if (clauses.length === 2) return `${clauses[0]} and ${clauses[1]}`;
  return `${clauses.slice(0, -1).join(", ")}, and ${clauses[clauses.length - 1]}`;
}

// Public API.
//
// Returns a usage-prose description string derived from `usageHints`, or "" when
// no hint is recognised. A caller treats "" as "no seed available" and leaves
// the row's description untouched — a roleless row is dropped downstream by
// dropEmptyUsageHintRows (empty-usagehints-strip.js) anyway. Always returns a
// string; never throws on malformed input.
export function describeTypographyFromHints(usageHints) {
  if (!Array.isArray(usageHints)) return "";
  const present = new Set(
    usageHints.filter((hint) => typeof hint === "string" && hint in HINT_CLAUSES),
  );
  const clauses = HINT_ORDER.filter((hint) => present.has(hint)).map(
    (hint) => HINT_CLAUSES[hint],
  );
  if (!clauses.length) return "";
  return `Applied to ${joinClauses(clauses)}.`;
}

function isEmptyDescription(value) {
  return typeof value !== "string" || value.trim() === "";
}

// Mutates `payload.brand.typography[]` in place: for each row whose description
// is empty/whitespace AND whose hints yield a clause, sets a seed description
// derived from the row's (final) `usageHints`. Append-only/fill-only — an
// existing description is never overwritten — so the pass is idempotent and
// safe to run in both scaffold and normalize (and across normalize retries).
// No-ops without throwing on missing / non-array / malformed input. Pushes one
// info-severity diagnostic per seeded row. Returns the number of rows seeded.
export function seedTypographyDescriptions(payload, diagnostics = []) {
  const rows = payload?.brand?.typography;
  if (!Array.isArray(rows)) return 0;
  let seeded = 0;
  rows.forEach((row, index) => {
    if (!row || typeof row !== "object") return;
    if (!isEmptyDescription(row.description)) return;
    const description = describeTypographyFromHints(row.usageHints);
    if (!description) return;
    row.description = description;
    seeded += 1;
    if (Array.isArray(diagnostics)) {
      diagnostics.push({
        severity: "info",
        path: `$.brand.typography[${index}].description`,
        action: "seeded-typography-description",
        value: description,
      });
    }
  });
  return seeded;
}

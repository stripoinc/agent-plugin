// Gated-strip validator for `header-link` / `footer-link` color usage hints.
//
// Why: the extraction agent occasionally tags `header-link` / `footer-link` on
// a color whose only `<a>` observations come from product-card icon links,
// wishlist anchors, breadcrumb links, etc. — not actual header / footer
// navigation. The 2026-05-08 fix added region-scoped probes
// (`header a`, `nav a`, `footer a`, ARIA-landmark variants) to the homepage
// pass plus SKILL.md guidance steering the agent toward scoped buckets, but
// that doesn't eliminate the mistag entirely. This validator is the
// belt-and-suspenders defense at normalize stage:
//
//   When the gate is active (text-styles.json contains rows from the scoped
//   set) AND a color tagged with header-link / footer-link does NOT appear
//   in any region-scoped row, strip the hint. The downstream resolver then
//   falls back to neutral and customise's contrast guard catches readability
//   regressions.
//
// Conservative posture (intentional):
//   - Gate inactive (stale cache, non-semantic-markup site, no scoped probe
//     rows) → do NOTHING. False-positive strips are worse than false
//     negatives for the customise pipeline.
//   - Gate active but ANY scoped row matches the color → keep the hint.
//
// Future iteration (deferred): an `assembly-diagnostics.json
// .roleChoiceJustifications` flag for the legitimate "site has no semantic
// header but I verified the menu color from the screenshot" case. We'll
// add that escape hatch after the live-strip behaviour proves stable across
// real batches; documenting here so the next iteration knows where to land.
//
// Public API:
//   - planHeaderLinkStrip(brandkit, textStyles)
//       Pure analysis. Returns Array<{color, role, reason}> describing what
//       WOULD be stripped without mutating anything. Useful for dry-run.
//   - applyHeaderLinkStrip(brandkit, textStyles, diagnostics)
//       Mutates brandkit in place. Records one diagnostic per stripped hint.

const HEADER_LINK_HINT = "header-link";
const FOOTER_LINK_HINT = "footer-link";

const HEADER_SCOPED_SELECTORS = new Set([
  "header a",
  "[role='banner'] a",
  "nav a",
  "[role='navigation'] a",
]);

const FOOTER_SCOPED_SELECTORS = new Set([
  "footer a",
  "[role='contentinfo'] a",
]);

// Trim, lowercase, expand 3-char hex to 6-char so `#FFF` matches `#ffffff`.
// Anything that doesn't look like a hex color is returned lowercased-trimmed
// for consistent comparison; we never want to throw on malformed input.
export function normalizeHexForCompare(value) {
  const raw = String(value ?? "").trim().toLowerCase();
  if (!raw) return "";
  const hex = raw.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/);
  if (!hex) return raw;
  const body = hex[1];
  if (body.length === 3 || body.length === 4) {
    return `#${[...body].map((c) => c + c).join("")}`;
  }
  return `#${body}`;
}

function rowSelector(row) {
  if (!row || typeof row !== "object") return "";
  return String(row.selector ?? "").trim();
}

function rowColor(row) {
  if (!row || typeof row !== "object") return "";
  return normalizeHexForCompare(row.color);
}

// True when text-styles contains at least one row whose selector is in the
// region-scoped set. The validator only fires per-region when its gate is
// active.
function gateActive(textStyles, scopedSet) {
  if (!Array.isArray(textStyles)) return false;
  for (const row of textStyles) {
    if (scopedSet.has(rowSelector(row))) return true;
  }
  return false;
}

// True if any text-styles row whose color matches `color` carries a selector
// from the region-scoped set. Matches use case-insensitive normalized hex.
function colorHasScopedEvidence(color, textStyles, scopedSet) {
  const target = normalizeHexForCompare(color);
  if (!target || !Array.isArray(textStyles)) return false;
  for (const row of textStyles) {
    if (rowColor(row) !== target) continue;
    if (scopedSet.has(rowSelector(row))) return true;
  }
  return false;
}

// Walk textColors and emit a strip plan entry for every (color, hint) pair
// that should be stripped. Pure — never mutates inputs.
function buildStripPlan(textColors, textStyles) {
  const plan = [];
  if (!Array.isArray(textColors)) return plan;
  const headerActive = gateActive(textStyles, HEADER_SCOPED_SELECTORS);
  const footerActive = gateActive(textStyles, FOOTER_SCOPED_SELECTORS);
  if (!headerActive && !footerActive) return plan;
  for (const entry of textColors) {
    if (!entry || typeof entry !== "object") continue;
    const hints = Array.isArray(entry.usageHints) ? entry.usageHints : [];
    if (headerActive && hints.includes(HEADER_LINK_HINT)) {
      if (!colorHasScopedEvidence(entry.value, textStyles, HEADER_SCOPED_SELECTORS)) {
        plan.push({
          color: entry.value,
          role: HEADER_LINK_HINT,
          reason: "no scoped evidence in text-styles (no row with selector ∈ {header a, [role='banner'] a, nav a, [role='navigation'] a})",
        });
      }
    }
    if (footerActive && hints.includes(FOOTER_LINK_HINT)) {
      if (!colorHasScopedEvidence(entry.value, textStyles, FOOTER_SCOPED_SELECTORS)) {
        plan.push({
          color: entry.value,
          role: FOOTER_LINK_HINT,
          reason: "no scoped evidence in text-styles (no row with selector ∈ {footer a, [role='contentinfo'] a})",
        });
      }
    }
  }
  return plan;
}

// Pure analysis function. Returns an array of { color, role, reason } entries
// describing what WOULD be stripped, without mutating anything.
export function planHeaderLinkStrip(brandkit, textStyles) {
  const textColors = brandkit?.brand?.colors?.textColors;
  return buildStripPlan(textColors, textStyles);
}

// Mutates brandkit in place. Removes header-link / footer-link hints from
// textColors entries when the color has no scoped evidence. Records one
// diagnostic per stripped (color, role) pair so operators can audit which
// hints were dropped.
export function applyHeaderLinkStrip(brandkit, textStyles, diagnostics = []) {
  const textColors = brandkit?.brand?.colors?.textColors;
  if (!Array.isArray(textColors) || textColors.length === 0) return;
  const plan = buildStripPlan(textColors, textStyles);
  if (plan.length === 0) return;
  // Index plan entries by (normalized color, role) for cheap per-entry lookup.
  // Using a Set of "color|role" composite keys keeps this O(rows × hints).
  const stripKeys = new Set(
    plan.map((p) => `${normalizeHexForCompare(p.color)}|${p.role}`),
  );
  for (const [index, entry] of textColors.entries()) {
    if (!entry || typeof entry !== "object") continue;
    const hints = Array.isArray(entry.usageHints) ? entry.usageHints : null;
    if (!hints) continue;
    const colorKey = normalizeHexForCompare(entry.value);
    if (!colorKey) continue;
    const next = [];
    let stripped = false;
    for (const hint of hints) {
      if ((hint === HEADER_LINK_HINT || hint === FOOTER_LINK_HINT)
          && stripKeys.has(`${colorKey}|${hint}`)) {
        stripped = true;
        diagnostics.push({
          path: `$.brand.colors.textColors[${index}].usageHints`,
          color: entry.value,
          role: hint,
          message: `Stripped '${hint}' from ${entry.value}: no scoped evidence in text-styles (the color appears only under flat <a> rows, not under header/nav/footer-region anchors).`,
        });
        continue;
      }
      next.push(hint);
    }
    if (stripped) entry.usageHints = next;
  }
}

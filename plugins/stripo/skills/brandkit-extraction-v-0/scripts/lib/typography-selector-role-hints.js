// Deterministic mapping from a text-styles probe row's selector to the
// typography role hints the email-template compiler requires on
// `brand.typography[*].usageHints`.
//
// Why: the live homepage-pass probe (homepage-pass.js DEFAULT_TEXT_SELECTORS)
// runs against a stable, finite set of selectors. Each selector already tells
// us which email-template role it serves — `h1`/`h2`/`h3` are headings, `p`
// is body, `header a` / `nav a` is the header region, etc. Up until now
// the scaffolder dropped this signal on the floor and left the LLM extraction
// agent to curate `usageHints` from raw evidence. On back-to-back runs of
// the same site the agent's outputs drifted on this axis — most
// catastrophically, a real site's typography records lost three required
// role hints (header-typography, footer-typography, button-typography),
// causing the downstream customise typography plan to return
// `needs_review` and abort the email build entirely. That consumer does not
// exist and never did; the claim is retained here only as the reason the
// authority moved into this deterministic layer. The DRIFT it describes was
// real and is the reason for this file; the abort it threatens was not.
//
// Pre-tagging the role at scaffold time turns the agent's job from "curate
// from raw evidence" into "verify the scaffolder's pre-tags", which is a much
// narrower and more reliable task. `dedupeTypographyComponents`
// (lib/component-dedup.js:149-202) already unions hints across
// signature-duplicates, so a pre-tagged record merging with an agent-tagged
// peer keeps both hints — no special handling needed there.
//
// Conservative posture (intentional):
//   - Recognised selectors → exactly the role hints they unambiguously imply.
//   - Unknown / ambiguous selectors (`a` plain, `[class*='price']`, anything
//     else) → `[]`. Never tag where the probe selector cannot tell us the
//     region by itself.
//   - Case-insensitive on the selector text but otherwise exact-match.

const HEADING_SELECTORS = new Set(["h1", "h2", "h3"]);
const BODY_SELECTORS = new Set(["p"]);
const HEADER_REGION_SELECTORS = new Set([
  "header a",
  "[role='banner'] a",
  "nav a",
  "[role='navigation'] a",
]);
const FOOTER_REGION_SELECTORS = new Set([
  "footer a",
  "[role='contentinfo'] a",
]);
const BUTTON_SELECTORS = new Set([
  "button",
  "button[class*='buy']",
  "button[class*='cart']",
  "button[class*='add']",
  "button[class*='order']",
]);

// Public API.
//
// Returns a frozen array of role-hint strings the scaffolder should append
// (idempotent — caller is responsible for dedupe against any existing hints).
// Always returns an array, never null/undefined. Unrecognised selectors yield
// the empty array — no false-positive tagging.
export function typographyRoleHintsForSelector(selector) {
  if (typeof selector !== "string") return [];
  const key = selector.trim().toLowerCase();
  if (!key) return [];
  if (HEADING_SELECTORS.has(key)) return ["heading-typography"];
  if (BODY_SELECTORS.has(key)) return ["body-typography"];
  if (HEADER_REGION_SELECTORS.has(key)) return ["header-typography"];
  if (FOOTER_REGION_SELECTORS.has(key)) return ["footer-typography"];
  if (BUTTON_SELECTORS.has(key)) return ["button-typography"];
  return [];
}

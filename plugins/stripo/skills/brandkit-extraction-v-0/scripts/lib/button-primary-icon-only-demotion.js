// Demotes an icon-only-shaped product-card CTA out of the
// `brand.components.button[0]` slot when a non-icon entry with the
// `button-primary-background` hint exists later in the array.
//
// Why: ecommerce homepages capture dozens of icon-only round product-card
// CTAs (e.g. ~48x48 round buy buttons next to each price) alongside a
// handful of real text-bearing primary buttons (a header catalog CTA,
// a "See all" footer-anchor link, etc.). Ranking by row count puts the
// icon-only CTA at button[0]. The agent then carries `button-primary-*`
// hints on that entry — schema-valid because SKILL.md only forbids the
// `product-card-cta` hint on icon-only buttons — but the downstream
// customise step picks button[0] as the email's primary button and
// renders the round-icon styling instead of a proper full-width text
// button.
//
// Reproducing case (observed on an ecommerce homepage):
//   button[0] = round (radius 50), fixed-width, ~48x48, button-primary-* hints
//   button[1] = real text-CTA, content-sized, button-primary-* hints
// Swapping these makes button[0] the legitimate primary button.
//
// This safety net is intentionally narrow:
//   - Only swap if button[0] meets ALL icon-only-shape criteria below
//     (multiple signals; missing fields fail safe — no swap).
//   - Only swap with a non-icon-only entry that ALSO carries
//     `button-primary-background`.
//   - First non-icon match wins (preserves agent's ordering of remaining
//     entries).
//
// Detection criteria for "icon-only-shaped":
//   - layout.intent === "fixed-width"
//   - borderRadius >= 24 (round / pill)
//   - layout.computedHeightPx <= 60 (small badge-sized)
//   - layout.widthRatioToParent < 0.4 (not stretching to fill its row)
//
// All four must hold. False positives (demoting a legitimate primary
// button) are far worse than false negatives — a non-fired safety net
// just preserves the existing behavior, which is the agent's choice.
//
// Note: in the typical assembled brandkit.json, `layout` only carries
// `intent` (the scaffolder's `buttonFromRow` strips dimensions). When
// `computedHeightPx` and `widthRatioToParent` are absent, this helper
// no-ops because the conjunctive gate fails. The schema permits the
// dimension fields, so an agent that preserves them — or any future
// scaffolder change that carries them through — will get the safety
// net's protection automatically.

const PRIMARY_BUTTON_HINT = "button-primary-background";

const ICON_ONLY_BORDER_RADIUS_MIN = 24;
const ICON_ONLY_HEIGHT_MAX = 60;
const ICON_ONLY_WIDTH_RATIO_MAX = 0.4;

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function asFiniteNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
}

function hasPrimaryButtonHint(button) {
  if (!isPlainObject(button)) return false;
  return Array.isArray(button.usageHints) && button.usageHints.includes(PRIMARY_BUTTON_HINT);
}

// Conservative icon-only-shape detector. Returns true only when ALL four
// signals agree; any missing or unparsable field returns false (i.e. "do
// not demote"). The four signals together protect against false
// positives on legitimate primary buttons that happen to have one of the
// individual properties (e.g. a small full-width pill button on a
// landing page would have radius >= 24 but widthRatioToParent ~= 1).
export function isIconOnlyShaped(button) {
  if (!isPlainObject(button)) return false;
  const layout = isPlainObject(button.layout) ? button.layout : null;
  if (!layout) return false;
  if (layout.intent !== "fixed-width") return false;
  const radius = asFiniteNumber(button.borderRadius);
  if (radius === null || radius < ICON_ONLY_BORDER_RADIUS_MIN) return false;
  const height = asFiniteNumber(layout.computedHeightPx);
  if (height === null || height > ICON_ONLY_HEIGHT_MAX) return false;
  const ratio = asFiniteNumber(layout.widthRatioToParent);
  if (ratio === null || ratio >= ICON_ONLY_WIDTH_RATIO_MAX) return false;
  return true;
}

// Mutates the payload in place. If `brand.components.button[0]` looks
// icon-only-shaped AND there is a later entry that is NOT icon-only
// AND carries the `button-primary-background` hint, swap them so the
// real primary becomes button[0]. Records a single diagnostic on the
// `layoutDiagnostics` array.
//
// No-op cases:
//   - missing / non-array / empty / single-entry buttons array
//   - button[0] not icon-only-shaped (the common case)
//   - no later entry with button-primary-background hint
//   - all later entries with the hint are themselves icon-only-shaped
//     (do nothing rather than pick a worse candidate)
export function demoteIconOnlyFromButtonPrimary(payload, diagnostics = []) {
  const buttons = payload?.brand?.components?.button;
  if (!Array.isArray(buttons) || buttons.length < 2) return;
  const head = buttons[0];
  if (!isIconOnlyShaped(head)) return;

  let swapIndex = -1;
  for (let i = 1; i < buttons.length; i++) {
    const candidate = buttons[i];
    if (!hasPrimaryButtonHint(candidate)) continue;
    if (isIconOnlyShaped(candidate)) continue;
    swapIndex = i;
    break;
  }
  if (swapIndex === -1) return;

  const promoted = buttons[swapIndex];
  buttons[swapIndex] = head;
  buttons[0] = promoted;

  if (Array.isArray(diagnostics)) {
    diagnostics.push({
      path: "$.brand.components.button",
      kind: "button-primary-icon-only-demoted",
      message:
        `Demoted icon-only-shaped button[0] (borderRadius=${asFiniteNumber(head.borderRadius)}, ` +
        `computedHeightPx=${asFiniteNumber(head.layout?.computedHeightPx)}, ` +
        `widthRatioToParent=${asFiniteNumber(head.layout?.widthRatioToParent)}) and promoted button[${swapIndex}] ` +
        `(borderRadius=${asFiniteNumber(promoted.borderRadius)}, intent=${promoted.layout?.intent || "unknown"}) ` +
        `to button[0] for primary-button role correctness.`,
    });
  }
}

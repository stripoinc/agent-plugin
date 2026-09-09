// Filter noisy `brand.components.button[]` entries that survive the
// strict-signature dedup in `component-dedup.js`. Two failure modes
// motivate this helper:
//
//  1. Empty-background "buttons" that are really link spans the agent
//     scooped up from `button-styles.json`. The probe occasionally
//     captures wide-flex containers whose computed `background-color`
//     is transparent (resolved to "" by `normalizeColor`); when the
//     agent doesn't strip those (or actively tags them with
//     `button-secondary-background` because the visual outline reads
//     like a secondary CTA on the page), they leak into the downstream
//     customise pipeline as bogus primaries.
//  2. Padding-only variance — rows that share the same
//     `(backgroundColor, fontColor, borderColor, borderRadius)` quad
//     but differ in `padding`. Strict signature in `dedupeButtonComponents`
//     keeps them apart, which is correct for hover/layout extraction but
//     noise for downstream consumers that key off the visual surface.
//     Collapsing them by the relaxed signature keeps one canonical row
//     per visual identity while still preserving outline-styled rows
//     (those have non-empty `borderColor` / `borderWidth`, which stay
//     in the relaxed key).
//
// STEP A — Drop rows where `backgroundColor` is empty UNLESS the row is
// outline-styled (`borderWidth > 0`) AND carries a role-naming
// usageHint (`button-primary-*`, `button-secondary-*`, `product-card-cta`).
// The carve-out keeps legitimate outline-styled secondaries: a brand
// whose secondary CTA is a transparent rectangle with a 1px border is
// a real pattern. The visibility predicate requires `borderWidth > 0`
// regardless of whether `borderColor` is set — CSS like `border: 0
// solid black` carries a colour but renders no border. A non-zero
// width is the only signal that a border actually paints. Outline rows
// without a role hint are still noise — the agent hasn't claimed them,
// the probe captured a generic outline element.
//
// STEP B — Collapse remaining rows by the relaxed signature
// `(backgroundColor, fontColor, borderColor, borderRadius)`. Padding is
// intentionally NOT part of the key — see Tier-F decision 2. Canonical
// row picker mirrors `pickCanonicalProductCard` in
// `component-dedup.js`: prefer `product-card-cta`, then
// `button-primary-background`, then most hints, then `widthRatioToParent`,
// then source order. Union usageHints across collapsed peers.
//
// STEP C — Fallback. If every row was dropped (the empty-bg-no-carveout
// case where the agent stripped all colour hints), restore the row with
// the largest summed padding from `droppedEmpty` so the array stays
// non-empty. The customise pipeline relies on a defined
// `brand.components.button[0]` for fallback CTA geometry; an empty
// array escapes into a downstream KeyError. Emit one severity:"info"
// diagnostic naming the restored row's source position.
//
// STEP D — Diagnostics. One severity:"info" entry per merged group
// (count + canonical signature) and one summary entry naming the
// total drop count. Mirrors `dedupeButtonComponents`'s posture —
// the helper is loud about what it changed so a sceptic review can
// trace the line back to the input.
//
// Idempotent: re-running on the same input produces no further drops.
// Padding-collapse merges produce one diagnostic on the first pass
// and zero on subsequent passes (already collapsed).

function lowerHex(value) {
  return String(value || "").trim().toLowerCase();
}

// BACKLOG item 12 — Matches `button-primary-*`, `button-secondary-*`,
// `product-card-cta*` — intentionally broader than just `*-background`.
// Any agent-tagged button hint signals the row is claimed and must be
// carved out of the empty-bg drop. Do NOT narrow to `*-background`
// without re-vetting against `button-primary-text` /
// `button-primary-hover-background` rows: those hints also identify
// the row as a claimed brand button, even though they don't reference
// the row's own background colour.
const ROLE_NAMING_HINT_RE = /^(button-(primary|secondary)-|product-card-cta)/;

function hasOutlineStyle(button) {
  if (!button || typeof button !== "object") return false;
  // Width is the only reliable signal that a border actually paints.
  // CSS `border: 0 solid <color>` records the colour but renders
  // nothing; rows with `borderWidth: 0` and a colour set are not
  // visually outline-styled — they are typically link spans the
  // probe scooped up alongside real buttons.
  return Number(button.borderWidth) > 0;
}

function hasRoleNamingHint(button) {
  if (!button || typeof button !== "object") return false;
  const hints = Array.isArray(button.usageHints) ? button.usageHints : [];
  return hints.some((hint) => typeof hint === "string" && ROLE_NAMING_HINT_RE.test(hint));
}

function relaxedSignature(button) {
  if (!button || typeof button !== "object") return "";
  return [
    lowerHex(button.backgroundColor),
    lowerHex(button.fontColor),
    lowerHex(button.borderColor),
    String(button.borderRadius ?? ""),
  ].join("|");
}

function totalPadding(button) {
  const p = button && typeof button === "object" ? button.padding : null;
  if (!p || typeof p !== "object") return 0;
  return (Number(p.top) || 0) + (Number(p.right) || 0) + (Number(p.bottom) || 0) + (Number(p.left) || 0);
}

function hintScore(button) {
  const hints = Array.isArray(button?.usageHints) ? button.usageHints : [];
  let score = 0;
  if (hints.includes("product-card-cta")) score += 1000;
  if (hints.includes("button-primary-background")) score += 100;
  score += hints.length;
  return score;
}

function widthRatio(button) {
  const ratio = Number(button?.layout?.widthRatioToParent);
  return Number.isFinite(ratio) ? ratio : 0;
}

function pickCanonical(peers, sourceIndexOf) {
  let best = peers[0];
  let bestScore = -Infinity;
  let bestRatio = -Infinity;
  let bestSource = Number.POSITIVE_INFINITY;
  for (const peer of peers) {
    const score = hintScore(peer);
    const ratio = widthRatio(peer);
    const source = sourceIndexOf.get(peer) ?? Number.POSITIVE_INFINITY;
    if (score > bestScore) {
      best = peer;
      bestScore = score;
      bestRatio = ratio;
      bestSource = source;
      continue;
    }
    if (score === bestScore) {
      if (ratio > bestRatio) {
        best = peer;
        bestRatio = ratio;
        bestSource = source;
        continue;
      }
      if (ratio === bestRatio && source < bestSource) {
        best = peer;
        bestSource = source;
      }
    }
  }
  return best;
}

function unionHints(peers) {
  const out = [];
  const seen = new Set();
  for (const peer of peers) {
    const hints = Array.isArray(peer?.usageHints) ? peer.usageHints : [];
    for (const hint of hints) {
      if (typeof hint !== "string") continue;
      const trimmed = hint.trim();
      if (!trimmed || seen.has(trimmed)) continue;
      seen.add(trimmed);
      out.push(trimmed);
    }
  }
  return out;
}

export function applyButtonNoiseFilter(payload, diagnostics = []) {
  const buttons = payload?.brand?.components?.button;
  if (!Array.isArray(buttons) || buttons.length === 0) return;

  const sourceIndexOf = new Map();
  buttons.forEach((button, index) => sourceIndexOf.set(button, index));

  // STEP A — drop empty-background rows without the outline+role-hint
  // carve-out. Outline-styled rows with a role-naming usageHint stay.
  const kept = [];
  const droppedEmpty = [];
  for (const button of buttons) {
    const bgEmpty = lowerHex(button?.backgroundColor) === "";
    if (!bgEmpty) {
      kept.push(button);
      continue;
    }
    if (hasOutlineStyle(button) && hasRoleNamingHint(button)) {
      kept.push(button);
      continue;
    }
    droppedEmpty.push(button);
  }

  // STEP B — collapse remaining rows by relaxed signature
  // (padding dropped from key — per Tier-F decision 2).
  const groups = new Map();
  const order = [];
  for (const button of kept) {
    const signature = relaxedSignature(button);
    if (!signature) continue;
    if (!groups.has(signature)) {
      groups.set(signature, []);
      order.push(signature);
    }
    groups.get(signature).push(button);
  }

  const merged = [];
  let totalMerged = 0;
  for (const signature of order) {
    const peers = groups.get(signature) || [];
    if (peers.length === 1) {
      merged.push(peers[0]);
      continue;
    }
    const canonical = pickCanonical(peers, sourceIndexOf);
    const out = { ...canonical, usageHints: unionHints(peers) };
    merged.push(out);
    totalMerged += peers.length - 1;
    diagnostics.push({
      severity: "info",
      path: "$.brand.components.button",
      message: `Collapsed ${peers.length} button entries sharing relaxed signature (backgroundColor, fontColor, borderColor, borderRadius)=(${signature}); padding intentionally excluded. Kept canonical preferring product-card-cta > button-primary-background > most hints > widthRatioToParent > source order; unioned usageHints across peers.`,
    });
  }

  // STEP C — fallback: if every row was filtered, restore the
  // largest-padding row so the array stays non-empty.
  if (merged.length === 0 && droppedEmpty.length > 0) {
    let fallback = droppedEmpty[0];
    let fallbackPadding = totalPadding(fallback);
    for (const candidate of droppedEmpty.slice(1)) {
      const padding = totalPadding(candidate);
      if (padding > fallbackPadding) {
        fallback = candidate;
        fallbackPadding = padding;
      }
    }
    merged.push(fallback);
    diagnostics.push({
      severity: "info",
      path: "$.brand.components.button",
      message: "All button rows had empty backgroundColor and no outline+role-hint carve-out; restored largest-padding row to keep array non-empty. Fallback row has empty backgroundColor; downstream customise pipeline applies its own brand-primary fallback colour before rendering (see email_template_sdk/fixed_template/abandoned_cart.py for the consumer-side default). Downstream customise pipeline requires brand.components.button[0] for fallback CTA geometry.",
    });
  }

  // STEP D — summary diagnostic for the empty-bg drop count.
  if (droppedEmpty.length > 0 && merged.length > 0) {
    diagnostics.push({
      severity: "info",
      path: "$.brand.components.button",
      message: `Dropped ${droppedEmpty.length} button row${droppedEmpty.length === 1 ? "" : "s"} with empty backgroundColor and no outline+role-hint carve-out; ${totalMerged} additional row${totalMerged === 1 ? "" : "s"} collapsed by relaxed (bg, fg, border, radius) signature.`,
    });
  }

  payload.brand.components.button = merged;
}

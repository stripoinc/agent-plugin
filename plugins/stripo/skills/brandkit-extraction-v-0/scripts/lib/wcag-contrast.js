// Shared WCAG 2.x contrast helpers. Used by normalize-time diagnostics
// that compare paired hex colors (e.g. `header-link` against the
// synthesised `header-background`).
//
// One private copy of `relativeLuminance` remains in this directory, in
// `product-card-synth-from-evidence.js`: it picks "is this hex dark?" via a
// `< 0.5` check and returns `0.5` for malformed input, so the fallback is
// "treat as midtone" — semantically load-bearing for that caller, and not
// replaced here. `text-color-role-synthesis.js` had a second copy whose
// `Number.POSITIVE_INFINITY` fallback was believed load-bearing for the same
// reason; it was not (every hex reaching its two tiebreaks is already a
// validated lowercase `#rrggbb`), and that copy now calls this one.
//
// Malformed-input contract: `relativeLuminance` returns `null` (not a
// number) and `contrastRatio` returns `null` when either side is
// non-parseable. Callers must treat `null` as "no diagnostic" rather
// than coerce to NaN / 0.
//
// `EMAIL_MIN_CONTRAST = 3.0` is the WCAG large-text minimum we apply
// to email render contexts. Body-text contexts elsewhere in the
// pipeline use 4.5 and are not served by this constant.

const HEX_RE = /^#([0-9a-f]{6})$/i;

export const EMAIL_MIN_CONTRAST = 3.0;

function normalizeHex(hex) {
  if (typeof hex !== "string") return null;
  const trimmed = hex.trim().toLowerCase();
  return HEX_RE.test(trimmed) ? trimmed : null;
}

export function relativeLuminance(hex) {
  const normalized = normalizeHex(hex);
  if (!normalized) return null;
  const body = normalized.slice(1);
  const channels = [
    parseInt(body.slice(0, 2), 16),
    parseInt(body.slice(2, 4), 16),
    parseInt(body.slice(4, 6), 16),
  ].map((value) => {
    const channel = value / 255;
    return channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function contrastRatio(hex1, hex2) {
  const l1 = relativeLuminance(hex1);
  const l2 = relativeLuminance(hex2);
  if (l1 === null || l2 === null) return null;
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

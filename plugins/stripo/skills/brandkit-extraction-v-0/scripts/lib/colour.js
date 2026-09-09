// Shared low-level colour utilities for extraction-side passes.
//
// Kept intentionally minimal — only true cross-file duplicates with no
// semantic divergence belong here. Per-file `lowerHex` variants stay
// local because their return-type contracts differ by design (see
// colour-pre-emit.js's null-returning variant), and the helper is too
// trivial to risk a hidden semantic shift.

// HSL saturation of a `#rrggbb` hex. Returns 0 for malformed / null /
// undefined / non-string input so saturation gates naturally reject it.
// Mirrors prior local copies in region-bg-hints.js,
// text-color-role-synthesis.js, and assemble-candidates.js (now removed).
export function hexSaturation(hex) {
  const match = /^#([0-9a-f]{6})$/i.exec(hex || "");
  if (!match) return 0;
  const body = match[1];
  const r = parseInt(body.slice(0, 2), 16) / 255;
  const g = parseInt(body.slice(2, 4), 16) / 255;
  const b = parseInt(body.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return 0;
  const delta = max - min;
  return l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
}

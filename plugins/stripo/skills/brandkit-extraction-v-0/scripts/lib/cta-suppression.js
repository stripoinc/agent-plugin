// Decides whether a product-card CTA STOPPED RENDERING under hover, which is
// the only evidence that the captured element isn't the user-visible "buy"
// action and that the caller should look elsewhere on the card (typically a
// hover-revealed alternative element).
//
// WHY THIS IS A RENDERING TEST AND NOT A COLOUR TEST. The rule this file used
// to carry fired when the default had a background and the hover reading did
// not: `defaultRecord.backgroundColor && !hoverRecord.backgroundColor`. That
// predicate cannot tell three different things apart, because the colour
// normaliser returns the same `null` for all of them — a colour measured as
// fully transparent, a colour that could not be parsed, and a colour that was
// never read at all. Two of those are the ABSENCE OF A MEASUREMENT, and a rule
// that deletes a measured default because one channel went quiet deletes real
// evidence on the strength of no evidence. It did: a live storefront's purple
// product CTA was discarded while the same record reported the button still
// occupying 40px of height in both states.
//
// So the signals here are all forms of measured NON-RENDERING, and each one is
// something the browser reports the element doing:
//   1) zero area          — the element occupies no space under hover.
//   2) display: none      — it is not in the rendering tree.
//   3) visibility: hidden — it renders nothing and is not interactive.
//   4) opacity <= 0.01    — it is painted, but invisibly.
//
// A placeholder that genuinely cedes visibility to a sibling must do one of
// these; they are sufficient observations, not an exhaustive visibility model.
// Ancestor opacity, clipping, offscreen placement and generated paint remain
// outside these own-style and box signals. What is NOT
// suppression, and is preserved by construction: outline / ghost hovers
// (background transparent, text and border still painted), de-emphasis hovers,
// colour flips of any size, and partial shrinkage.
//
// WHY NO COLOUR READING IS A SIGNAL. This file used to carry a fifth signal,
// "paints nothing": background, text and border all measured transparent at
// once. It was deleted because an element's rendered output is the union of
// its own colour channels and everything it contains or generates — an `svg`,
// `img`, `canvas` or `video` child, a `background-image`, a `border-image`, a
// `box-shadow`, an `outline`, a `::before` / `::after` — and the probe measures
// none of those. Three quiet channels on a transparent 76px button holding a
// painted 30px SVG read as "draws nothing", and the swap then wrote a
// hover-only sibling's colours over a control the visitor can see. Colour is
// one paint source among many; the absence of a measurement of the others is
// not a measurement of their absence. The colour states are still read by
// `swapLowersEvidence` below, where they mean what they say: how KNOWN a
// value is, never whether the element renders.
//
// Returns: { suppressed: boolean, reasons: Array<{signal, detail}> }
//
// Inputs are plain records (defaults from row.cta + cta.layout, hover from
// readHoverStyleFor's extended return). Either may be missing fields; the
// helper handles partial inputs gracefully — a field it cannot read is a field
// that says nothing.

// Every colour reading carries one of these three states. Anything else —
// including a missing field, which is what an artifact written before the
// state existed looks like — is treated as "unavailable": not knowing.
const MEASURED = "measured";
const TRANSPARENT = "transparent";
const UNAVAILABLE = "unavailable";

function colorState(record, valueKey, stateKey) {
  if (!record || typeof record !== "object") return UNAVAILABLE;
  const state = record[stateKey];
  const value = record[valueKey];
  const measured = typeof value === "string" && /^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(value.trim());
  if (state === UNAVAILABLE) return UNAVAILABLE;
  if (state === TRANSPARENT) return value == null || value === "" ? TRANSPARENT : UNAVAILABLE;
  if (state === MEASURED) return measured ? MEASURED : UNAVAILABLE;
  return measured ? MEASURED : UNAVAILABLE;
}

// A number that was actually read. `Number(null)` is 0 and `Number("")` is 0,
// so a missing field would otherwise read as a measured zero — the same
// absence-as-measurement error this module exists to remove.
function readNumber(value) {
  if (typeof value !== "number" && (typeof value !== "string" || !value.trim())) return Number.NaN;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : Number.NaN;
}

export function isCtaSuppressedOnHover(defaultRecord, hoverRecord) {
  if (!defaultRecord || !hoverRecord || typeof defaultRecord !== "object" || typeof hoverRecord !== "object") {
    return { suppressed: false, reasons: [] };
  }
  const reasons = [];

  // Signal 1: the element occupies no area under hover. Either dimension at
  // zero is enough — a 0x40 box paints exactly as much as a 40x0 one.
  const hovH = readNumber(hoverRecord.computedHeightPx);
  const hovW = readNumber(hoverRecord.computedWidthPx);
  if (hovH === 0 || hovW === 0) {
    reasons.push({
      signal: "zero-area",
      detail: `hover box ${Number.isNaN(hovW) ? "?" : hovW}x${Number.isNaN(hovH) ? "?" : hovH}px`,
    });
  }

  // Signal 2: removed from the rendering tree.
  if (hoverRecord.display === "none") {
    reasons.push({ signal: "display-none", detail: "hover display: none" });
  }

  // Signal 3: keeps its box, paints nothing, takes no clicks.
  if (hoverRecord.visibility === "hidden") {
    reasons.push({ signal: "visibility-hidden", detail: "hover visibility: hidden" });
  }

  // Signal 4: painted, but invisibly. The 0.01 floor is not a tuned threshold
  // — it is there because opacity arrives as a decimal string and an exact
  // `=== 0` test would miss "0.0000001", which is the same claim.
  const opacity = readNumber(hoverRecord.opacity);
  if (opacity <= 0.01) {
    reasons.push({ signal: "opacity-zero", detail: `hover opacity ${hoverRecord.opacity}` });
  }

  return { suppressed: reasons.length > 0, reasons };
}

// The fields a swap to an alternative CTA overwrites wholesale. Each pairs the
// stored value with the state field that says how the value was arrived at;
// typography has no state field because it has no third outcome — a family,
// weight or size read either produced a value or produced nothing. There is no
// such thing as a transparent font size.
const SWAP_EVIDENCE_FIELDS = [
  ["backgroundColor", "backgroundColorState"],
  ["fontColor", "fontColorState"],
  ["borderColor", "borderColorState"],
  ["fontFamily", null],
  ["fontWeight", null],
  ["fontSizePx", null],
  ["hasInlineIcon", null],
];

function evidenceState(record, valueKey, stateKey) {
  if (stateKey) return colorState(record, valueKey, stateKey);
  if (!record || typeof record !== "object") return UNAVAILABLE;
  const value = record[valueKey];
  return value === null || value === undefined || value === "" ? UNAVAILABLE : MEASURED;
}

// Monotonicity, not a threshold: a replacement may be different, but it may
// never be LESS KNOWN. "Known" is measured OR transparent — both are readings
// of what the element paints; only "unavailable" is the absence of one. So a
// swap is refused when it would turn any known field into an unknown one. Diagnostic totals do not replace that fieldwise rule.
//
// This is the second half of the same rule the suppression gate enforces. The
// gate stops an unreadable hover from CONDEMNING a measured default; this stops
// an unreadable alternative from OVERWRITING one. Both failed together on the
// storefront run that lost its purple CTA: the gate admitted the swap, and the
// swap then wrote `null` over a measured colour with nothing to compare against.
export function swapLowersEvidence(originalCta, altStyles) {
  const lowered = [];
  let knownBefore = 0;
  let knownAfter = 0;
  for (const [valueKey, stateKey] of SWAP_EVIDENCE_FIELDS) {
    const before = evidenceState(originalCta, valueKey, stateKey);
    const after = evidenceState(altStyles, valueKey, stateKey);
    if (before !== UNAVAILABLE) knownBefore += 1;
    if (after !== UNAVAILABLE) knownAfter += 1;
    if (before !== UNAVAILABLE && after === UNAVAILABLE) lowered.push(valueKey);
  }
  return {
    lowers: lowered.length > 0,
    lowered,
    knownBefore,
    knownAfter,
  };
}

// Supported consumer hover paint, independent of which channel changed.
// Unknown readings cannot establish a change; measured transparency can.
export function hasSupportedCtaHoverChange(before, after) {
  if (!before || !after) return false;
  for (const key of ["backgroundColor", "fontColor", "borderColor"]) {
    const stateKey = `${key}State`;
    const a = colorState(before, key, stateKey);
    const b = colorState(after, key, stateKey);
    if (a === UNAVAILABLE || b === UNAVAILABLE) continue;
    if (a !== b || (a === MEASURED && String(before[key]).toLowerCase() !== String(after[key]).toLowerCase())) return true;
  }
  const a = readNumber(before.borderWidth);
  const b = readNumber(after.borderWidth);
  return Number.isFinite(a) && Number.isFinite(b) && a !== b;
}

import { selectableProductRows } from "./product-row-filter.js";
import { productCardCtaFromRow } from "../assemble-product-card-cta.js";
// Recover missing or unsupported copied-default hover only from a unique
// compatible measured treatment. A sampled no-op is a real treatment;
// unchanged CSSOM fallback is coverage, not evidence of an authored no-op.
// Public/probe snapshots are read throughout: an earlier repair must never
// become evidence licensing another repair in the same pass.

const MIN_CONSISTENT_ROWS = 1;

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function lowerHex(value) {
  const s = String(value || "").trim().toLowerCase();
  return s.length > 0 ? s : null;
}

// Transparent is a measured treatment; unavailable and legacy null are coverage.
function colorToken(record, key) {
  if (record?.[`${key}State`] === "transparent") return "transparent";
  if (record?.[`${key}State`] === "unavailable") return null;
  return lowerHex(record?.[key]);
}

// Build a normalized hover signature for a probe row. Returns null when the
// row lacks the minimum evidence (backgroundColor is required; fontColor /
// borderColor are best-effort and treated as part of the signature when
// present).
function ctaHoverSignature(hover) {
  if (!isPlainObject(hover)) return null;
  const bg = colorToken(hover, "backgroundColor");
  if (!bg) return null;
  const fg = colorToken(hover, "fontColor");
  const border = colorToken(hover, "borderColor");
  return {
    key: `${bg}|${fg ?? ""}|${border ?? ""}`,
    backgroundColor: bg,
    fontColor: fg,
    borderColor: border,
  };
}

// Pick the dominant hover signature from the probe rows. Returns the
// signature object plus its observation count, or null when no signature has
// at least MIN_CONSISTENT_ROWS observations. Rows whose hover evidence is
// pure cssom-fallback AND whose hover background equals the row's default
// background are discarded as noise.
export function pickDominantProductCardCtaHoverSignature(productRows) {
  productRows = selectableProductRows(productRows);
  if (!Array.isArray(productRows) || productRows.length === 0) return null;
  const counts = new Map();
  for (const row of productRows) {
    const cta = row?.cta;
    if (!isPlainObject(cta)) continue;
    const sig = ctaHoverSignature(cta.hover);
    if (!sig) continue;
    // Unchanged fallback is coverage; a font-only or visible border-only
    // CSSOM change is still meaningful evidence.
    if (isUnchangedCssomFallback(cta)) {
      continue;
    }
    const existing = counts.get(sig.key);
    if (existing) {
      existing.count += 1;
    } else {
      counts.set(sig.key, { signature: sig, count: 1 });
    }
  }
  let best = null;
  for (const entry of counts.values()) {
    if (entry.count < MIN_CONSISTENT_ROWS) continue;
    if (!best || entry.count > best.count) best = entry;
  }
  return best;
}


const HOVER_FIELDS = ["backgroundColor", "fontColor", "borderColor"];
const publicHover = cta => Object.fromEntries(HOVER_FIELDS.map(key =>
  [key, colorToken(cta, `hover${key[0].toUpperCase()}${key.slice(1)}`)]));
const activeFields = cta => HOVER_FIELDS.filter(key => key !== "borderColor" || cta?.borderWidth !== 0);
const agrees = (left,right,fields) => fields.every(key => !left[key] || !right[key] || left[key] === right[key]);
const covers = (left,right,fields) => fields.every(key => !right[key] || left[key] === right[key]);

function isUnchangedCssomFallback(cta) {
  if (cta?.hoverCaptureMode !== "cssom-fallback") return false;
  const fields = activeFields(cta).filter(key => colorToken(cta.hover,key));
  return fields.length > 0 && fields.every(key => colorToken(cta,key) === colorToken(cta.hover,key));
}

function compatibleDefault(left,right) {
  const colorFields = activeFields(left).filter(key => key !== "borderColor" || right.borderWidth !== 0);
  // A matching measured default paint establishes the treatment; missing
  // optional detail is not an assertion that two known shapes disagree.
  if (!colorToken(left,"backgroundColor") || colorToken(left,"backgroundColor") !== colorToken(right,"backgroundColor")) return false;
  if (!colorFields.every(key => !colorToken(left,key) || !colorToken(right,key) || colorToken(left,key) === colorToken(right,key))) return false;
  for (const key of ["text","borderWidth","borderRadius","hasInlineIcon","isIconLike","hasUsableVisibleText","layoutIntent"]) {
    const known = value => value != null && value !== "" && value !== "unknown";
    if (known(left[key]) && known(right[key]) && String(left[key]).toLowerCase() !== String(right[key]).toLowerCase()) return false;
  }
  return ["top","right","bottom","left"].every(key => left.padding?.[key] == null ||
    right.padding?.[key] == null || left.padding[key] === right.padding[key]);
}

export function propagateProductCardCtaHoverFromProbeRows(payload, productRows, diagnostics = []) {
  const cards = payload?.brand?.components?.productCard;
  if (!Array.isArray(cards)) return;
  const originalCards = structuredClone(cards);
  const observations = structuredClone(selectableProductRows(productRows)).flatMap(row => {
    const signature = ctaHoverSignature(row?.cta?.hover);
    return signature && !isUnchangedCssomFallback(row.cta)
      ? [{cta:productCardCtaFromRow(row), signature}] : [];
  });
  for (const [index,card] of originalCards.entries()) {
    const cta = card?.cta;
    if (!isPlainObject(cta)) continue;
    const fields = activeFields(cta);
    const compatible = observations.filter(entry => compatibleDefault(cta,entry.cta));
    // One intact observation must cover every compatible observation. A
    // majority or input order cannot settle conflicting real treatments.
    const targets = compatible.filter(entry => compatible.every(other => covers(entry.signature,other.signature,fields)));
    if (!targets.length) continue;
    const captured = targets[0].signature;
    const existing = publicHover(cta);
    const defaults = Object.fromEntries(HOVER_FIELDS.map(key => [key,colorToken(cta,key)]));
    // Other positively changed public treatments also preserve uncertainty,
    // even when the bounded probe budget sampled only one of them.
    if (originalCards.some(peer => peer !== card && peer?.cta && compatibleDefault(cta,peer.cta) &&
      fields.some(key => publicHover(peer.cta)[key] && publicHover(peer.cta)[key] !== colorToken(peer.cta,key)) &&
      !agrees(publicHover(peer.cta),captured,fields))) continue;
    const hasExisting = fields.some(key => existing[key]);
    const equalsDefault = hasExisting && fields.every(key => !existing[key] || existing[key] === defaults[key]);
    if (hasExisting && !agrees(existing,captured,fields) && !equalsDefault) continue;
    // A genuine directly sampled same-paint treatment conflicts with a
    // different target above, so copied-default recovery cannot overwrite it.
    const out = cards[index].cta;
    const before = JSON.stringify(publicHover(out));
    for (const key of HOVER_FIELDS) {
      const publicKey = `hover${key[0].toUpperCase()}${key.slice(1)}`;
      if (captured[key] && (!colorToken(out,publicKey) || equalsDefault)) {
        out[publicKey] = captured[key] === "transparent" ? null : captured[key];
        const state = targets[0].cta[`${publicKey}State`];
        if (state) out[`${publicKey}State`] = state;
        else delete out[`${publicKey}State`];
      }
    }
    if (before === JSON.stringify(publicHover(out))) continue;
    if (Array.isArray(diagnostics)) diagnostics.push({path:`$.brand.components.productCard[${index}].cta`,kind:"product-card-cta-hover-propagated-from-probe",
      message:`Promoted unique compatible CTA hover from ${targets.length} probe row(s); previous values ${equalsDefault ? "equalled default-state" : "were empty or partial"}.`});
  }
}

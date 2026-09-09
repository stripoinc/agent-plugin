import { PROVENANCE_FIELD, PROVENANCE_VALUE_SCAFFOLD_SYNTH } from "./lib/provenance-marker.js";
import { productCardCtaIsReusable } from "./lib/product-card-cta-evidence.js";
import { isDiscountOnlyCtaLabel } from "./lib/product-card-cta-label.js";

const PRODUCT_CARD_CTA_HINT = "product-card-cta";
const PRODUCT_CARD_CTA_FALLBACK_ADVISORY = "Product-card CTA lacks medium/strong reusable visible-text evidence; downstream should use primary button fallback for reusable text CTA tokens.";

// BACKLOG item 14: placeholder productCard rows synthesised by
// `synthesizeProductCardFromEvidence` carry a sentinel `_provenance`
// marker. They are deliberately weak (`evidenceQuality: "weak"`,
// `cta` without `textSource` / `hasUsableVisibleText`) and would
// otherwise trip the icon-only / weak-evidence diagnostics below.
// Skipping them in `productCardCtaDiagnostics` keeps those entries
// from surfacing as severity:high gate noise — the placeholder is
// what closes the gap that gate is designed to flag, so re-emitting
// the gate against it is double-counting.
function isScaffoldSynthesisedCard(card) {
  return Boolean(card && typeof card === "object" && card[PROVENANCE_FIELD] === PROVENANCE_VALUE_SCAFFOLD_SYNTH);
}

function localText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function localNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function localColor(value) {
  const raw = localText(value);
  if (!raw) return raw;
  const hex = raw.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  if (!hex) return raw.toLowerCase();
  const body = hex[1].toLowerCase();
  if (body.length === 3 || body.length === 4) return `#${[...body].map((char) => char + char).join("")}`;
  return `#${body}`;
}

function colorOrNull(value, normalizeColor = localColor) {
  if (value === null || value === undefined || value === "") return null;
  return normalizeColor(value) || null;
}

function booleanFromSources(...values) {
  for (const value of values) {
    if (typeof value === "boolean") return value;
  }
  return false;
}

// The measurement state the probe records beside a colour: `measured`,
// `transparent` or `unavailable` (`measureColor`, scripts/lib.js). Carried when
// the row says one of the three, absent otherwise — never invented, because a
// state is a claim about HOW the hex was arrived at, and the scaffold has no
// way to make that claim on the row's behalf. It is the bit the hex cannot
// carry: `null` is both a colour measured as fully transparent and one that
// could not be read, and the variant signature downstream must not treat a
// real outline button as a colour nobody measured.
const COLOUR_MEASUREMENT_STATES = new Set(["measured", "transparent", "unavailable"]);

export function colourMeasurementState(key, value) {
  return COLOUR_MEASUREMENT_STATES.has(value) ? { [key]: value } : {};
}

function nullableBooleanFromSources(...values) {
  // Same iteration as ``booleanFromSources`` but returns ``null`` (not
  // ``false``) when no source supplied an explicit boolean. Use for
  // fields whose "absent" semantics differ from "explicitly false" —
  // e.g. ``hasInlineIcon`` (null = unknown / probe gap; false = probe
  // saw no inline icon).
  for (const value of values) {
    if (typeof value === "boolean") return value;
  }
  return null;
}

function publicTextSource(row, normalizeText = localText) {
  const raw = normalizeText(row?.cta?.textSource).toLowerCase();
  if (["visible-text", "self-visible-text", "descendant-visible-text", "inner-text"].includes(raw)) return "visible-text";
  if (row?.selectionSignals?.ctaHasUsableVisibleText === true) return "visible-text";
  if (["aria-label", "title", "alt", "inferred", "none"].includes(raw)) return raw;
  return raw || null;
}

// Strip the product-name leak when an aria-label / title concatenates the
// CTA verb with the product title, e.g.
//   "Купити: Ємність для зберігання Krauff 400 мл (29-298-025)"
// -> "Купити". The screen-reader label includes the product name to disambig
// the icon-only "buy" button across many products on the page; keeping the
// whole string as `cta.text` would leak the product name into any downstream
// renderer that uses `text` as the CTA copy. The verb alone (e.g. "Купить",
// "Add to cart") is fine and useful as the text-fallback label for icon-only
// buttons rendered as text downstream (e.g. email templates).
//
// Visible-text labels are authoritative and never modified — a homepage that
// genuinely shows a "Special offer: 20% off" button would otherwise lose the
// suffix. We only rewrite when the source is non-visible AND the label fits
// the leak pattern: a short verb-like prefix followed by `: <substantial
// content>`. Other separators (hyphens, em-dashes) are not touched — they
// have legitimate uses inside CTA copy ("Sign-in", "Click-and-collect").
function sanitizeCtaText(rawText, textSource, normalizeText = localText) {
  const text = normalizeText(rawText);
  if (!text) return null;
  if (textSource === "visible-text") return text;
  // Look for "<verb>: <stuff>" where the verb is short and the suffix is
  // substantial (≥ 5 chars after trimming). Anything else stays as-is so
  // clean verb-only labels like "Купить" survive.
  const colonAt = text.indexOf(":");
  if (colonAt <= 0) return text;
  const verb = text.slice(0, colonAt).trim();
  const suffix = text.slice(colonAt + 1).trim();
  if (verb.length === 0 || verb.length > 16) return text;
  if (suffix.length < 5) return text;
  return verb;
}

export function productCardCtaFromRow(row, helpers) {
  if (!row?.cta) return null;
  const normalizeText = helpers?.normalizeText || localText;
  const normalizeColor = helpers?.normalizeColor || localColor;
  const numberOrNull = helpers?.numberOrNull || localNumber;
  const simplePadding = helpers?.simplePadding || ((value) => value || null);
  const signals = row?.selectionSignals || {};
  const hover = row.cta.hover || {};
  const hoverFields = Object.fromEntries(["backgroundColor", "fontColor", "borderColor"].flatMap(key => {
    const publicKey = `hover${key[0].toUpperCase()}${key.slice(1)}`;
    // Value and measurement state describe the same sample. A flattened
    // explicit transparent reading must not fall through to a nested color.
    const flat = row.cta[publicKey] != null || row.cta[`${publicKey}State`] != null;
    const value = flat ? row.cta[publicKey] : hover[key];
    const state = flat ? row.cta[`${publicKey}State`] : hover[`${key}State`];
    return [[publicKey, colorOrNull(value, normalizeColor)],
      ...Object.entries(colourMeasurementState(`${publicKey}State`, state))];
  }));
  const textSource = publicTextSource(row, normalizeText);
  return {
    text: sanitizeCtaText(row.cta.text, textSource, normalizeText),
    textSource,
    hasUsableVisibleText: booleanFromSources(row.cta.hasUsableVisibleText, signals.ctaHasUsableVisibleText, textSource === "visible-text"),
    isCompact: Boolean(row.cta.isCompact),
    isIconLike: booleanFromSources(row.cta.isIconLike, signals.ctaIsIconLike, signals.ctaResolvedToIconOnly),
    // True when the live CTA carries both visible text AND a decorative
    // glyph (<img>, <svg>, or [class*="icon"] child). Distinguishes
    // verb-with-glyph CTAs (template variant 0) from pure verb-only
    // CTAs (template variants 1/3/4) without needing the agent to
    // judge from the screenshot. Null when neither the row nor the
    // probe signal provided a value.
    hasInlineIcon: nullableBooleanFromSources(row.cta.hasInlineIcon, signals.ctaHasInlineIcon),
    backgroundColor: colorOrNull(row.cta.backgroundColor, normalizeColor),
    ...colourMeasurementState("backgroundColorState", row.cta.backgroundColorState),
    fontColor: colorOrNull(row.cta.fontColor, normalizeColor),
    ...colourMeasurementState("fontColorState", row.cta.fontColorState),
    borderColor: colorOrNull(row.cta.borderColor, normalizeColor),
    ...colourMeasurementState("borderColorState", row.cta.borderColorState),
    borderWidth: numberOrNull(row.cta.borderWidth),
    borderRadius: numberOrNull(row.cta.borderRadius),
    padding: row.cta.padding ? simplePadding(row.cta.padding) : null,
    ...hoverFields,
    layoutIntent: normalizeText(row.cta.layoutIntent ?? row.cta.layout?.intent) || "unknown",
  };
}

function usageHints(record) {
  return Array.isArray(record?.usageHints) ? record.usageHints.filter((hint) => typeof hint === "string") : [];
}

function hasProductCardCtaHint(items) {
  return (Array.isArray(items) ? items : []).some((item) => usageHints(item).includes(PRODUCT_CARD_CTA_HINT));
}

function hasUsefulProductCardCtaTypography(items) {
  return (Array.isArray(items) ? items : []).some((item) => (
    usageHints(item).includes(PRODUCT_CARD_CTA_HINT)
    && Boolean(localText(item?.family))
    && localNumber(item?.sizePx) !== null
  ));
}

function technicalReusableRow(row) {
  const signals = row?.selectionSignals;
  if (!signals || typeof signals !== "object") return false;
  const productContext = ["hasProductUrl", "hasTitle", "hasImage", "hasCurrentPrice", "hasOldPrice"].filter((key) => signals[key] === true).length >= 2;
  return (
    productContext
    && !isDiscountOnlyCtaLabel(row?.cta?.text)
    && signals.hasCta === true
    && signals.ctaLooksPurchaseLike === true
    && signals.ctaHasUsableVisibleText === true
    && signals.ctaIsIconLike !== true
    && signals.ctaLabelNotUsable !== true
    && signals.homepageCtaNotReusableAsText !== true
  );
}

function hoverKeyFromPublicCta(cta) {
  if (!cta || typeof cta !== "object") return "";
  const values = ["hoverBackgroundColor", "hoverFontColor", "hoverBorderColor"].map(key =>
    cta[`${key}State`] === "transparent" ? "transparent" :
      cta[`${key}State`] === "unavailable" ? null : colorOrNull(cta[key]));
  return values.every(value => value === null) ? "" : values.join("|");
}

function hoverKeyFromTechnicalRow(row) {
  return hoverKeyFromPublicCta(productCardCtaFromRow(row));
}

function normalizedLayoutIntent(value) {
  const intent = localText(value).toLowerCase();
  if (!intent) return "";
  if (["content-width", "inline"].includes(intent)) return "content-sized";
  if (["full-width", "content-sized", "fixed-width", "icon-only", "unknown"].includes(intent)) return intent;
  return intent;
}

function technicalRowLayoutIntent(row) {
  return normalizedLayoutIntent(row?.cta?.layoutIntent ?? row?.cta?.layout?.intent);
}

function technicalRowHasFullWidthSignal(row) {
  const layout = row?.cta?.layout;
  if (!layout || typeof layout !== "object") return false;
  const classList = Array.isArray(layout.classList) ? layout.classList.join(" ") : "";
  const cssWidth = localText(layout.cssWidth).toLowerCase();
  const widthRatio = localNumber(layout.widthRatioToParent);
  return (
    layout.isFullWidth === true
    || layout.classHintMatched === true
    || cssWidth === "100%"
    || (widthRatio !== null && widthRatio >= 0.8)
    || /(?:^|\s)(?:sf-button--full-width|full[-_]?width|w-100|width-100)(?:\s|$)/i.test(classList)
  );
}

function effectiveTechnicalLayout(row) {
  const intent = technicalRowLayoutIntent(row);
  if (intent === "full-width" || technicalRowHasFullWidthSignal(row)) return "full-width";
  if (["content-sized", "fixed-width", "icon-only"].includes(intent)) return intent;
  return "";
}

function dominantLayoutFromTechnicalRows(rows) {
  const reusableRows = (Array.isArray(rows) ? rows : []).filter(technicalReusableRow);
  const counts = new Map();
  let fullWidthSignalRows = 0;
  let contentSizedWithFullWidthSignalRows = 0;
  for (const row of reusableRows) {
    const intent = technicalRowLayoutIntent(row);
    const fullWidthSignal = technicalRowHasFullWidthSignal(row);
    if (fullWidthSignal) fullWidthSignalRows += 1;
    if (intent === "content-sized" && fullWidthSignal) contentSizedWithFullWidthSignalRows += 1;
    const effective = effectiveTechnicalLayout(row);
    if (effective) counts.set(effective, (counts.get(effective) || 0) + 1);
  }
  let dominant = "";
  let dominantCount = 0;
  for (const [layout, count] of counts.entries()) {
    if (count > dominantCount) {
      dominant = layout;
      dominantCount = count;
    }
  }
  const total = reusableRows.length;
  const ratio = total > 0 ? dominantCount / total : 0;
  if (dominantCount < 3 || ratio < 0.6) dominant = "";
  return {
    dominant,
    dominantCount,
    ratio,
    total,
    fullWidthSignalRows,
    contentSizedWithFullWidthSignalRows,
  };
}

function productCardLayoutDiagnostics(cards, technicalProductRows) {
  const summary = dominantLayoutFromTechnicalRows(technicalProductRows);
  if (!summary.dominant) return [];
  const reports = [];
  cards.forEach((card, index) => {
    if (!productCardCtaIsReusable(card)) return;
    const publicIntent = normalizedLayoutIntent(card?.cta?.layoutIntent);
    if (!publicIntent || publicIntent === "unknown" || publicIntent === summary.dominant) return;
    reports.push({
      index,
      severity: "warning",
      message: "product-card CTA layoutIntent conflicts with technical product-card layout evidence; run a scratch probe against the nearest card container before finalizing",
      publicLayoutIntent: publicIntent,
      technicalDominantLayoutIntent: summary.dominant,
      technicalReusableRows: summary.total,
      technicalDominantRows: summary.dominantCount,
      fullWidthSignalRows: summary.fullWidthSignalRows,
    });
  });
  return reports;
}

function productCardHoverDiagnostics(cards, technicalProductRows) {
  const technicalKeys = new Set((Array.isArray(technicalProductRows) ? technicalProductRows : [])
    .filter(technicalReusableRow)
    .map(hoverKeyFromTechnicalRow)
    .filter(Boolean));
  if (!technicalKeys.size) return [];
  const reports = [];
  if (technicalKeys.size > 1) {
    reports.push({ severity: "warning", message: "multiple product-card CTA hover styles were captured; keep hover fields conservative unless the selected product-card row supports them" });
  }
  cards.forEach((card, index) => {
    if (!productCardCtaIsReusable(card)) return;
    const publicKey = hoverKeyFromPublicCta(card.cta);
    if (publicKey && !technicalKeys.has(publicKey)) {
      reports.push({ index, severity: "warning", message: "product-card CTA hover colors do not match technical product-card hover evidence" });
    }
  });
  return reports;
}

// Summarises captureProductCardCtaHoverStates' per-row CTA selection. When a
// row's original CTA was suppressed on hover and replaced by a card-hover-revealed
// alternative, that swap is recorded here so an operator can see (a) whether the
// alt-discovery path fired, (b) which rows it fired for, and (c) the reason
// chain. Rows that didn't trigger alt discovery report source: "default" with
// no alternativeReason. Useful for reviewing why a particular site got its
// product-card CTA from the alt path instead of the default-state probe.
export function productCardCtaSelectionDiagnostics(technicalProductRows = []) {
  const rows = Array.isArray(technicalProductRows) ? technicalProductRows : [];
  const perRow = [];
  let alternativesPreferred = 0;
  for (const row of rows) {
    const cta = row?.cta;
    if (!cta || typeof cta !== "object") continue;
    const source = typeof cta.source === "string" ? cta.source : "default";
    const entry = {
      matchIndex: typeof row.matchIndex === "number" ? row.matchIndex : null,
      selector: typeof row.selector === "string" ? row.selector : null,
      source,
    };
    if (source === "card-hover-alternative") {
      alternativesPreferred += 1;
      if (cta.alternativeReason) entry.alternativeReason = cta.alternativeReason;
      if (cta.originalCandidate?.backgroundColor) {
        entry.originalBackgroundColor = cta.originalCandidate.backgroundColor;
      }
      if (cta.backgroundColor) entry.alternativeBackgroundColor = cta.backgroundColor;
    }
    perRow.push(entry);
  }
  return {
    rowsProcessed: perRow.length,
    alternativesPreferred,
    perRow,
  };
}

export function productCardCtaDiagnostics(payload, technicalProductRows = []) {
  const reports = [];
  const cards = Array.isArray(payload?.brand?.components?.productCard) ? payload.brand.components.productCard : [];
  const buttons = payload?.brand?.components?.button;
  const typography = payload?.brand?.typography;
  const hasReusableHint = hasProductCardCtaHint(buttons) || hasProductCardCtaHint(typography);
  const hasReusableCard = cards.some(productCardCtaIsReusable);
  const hasReusableButton = hasProductCardCtaHint(buttons);
  const hasReusableTypography = hasUsefulProductCardCtaTypography(typography);
  cards.forEach((card, index) => {
    // BACKLOG item 14: skip placeholder cards tagged with the
    // scaffold-synthesised provenance marker — the marker is stripped
    // before AJV validation but is still present at diagnostic-emit
    // time. Without the skip, every placeholder fires the icon-only
    // advisory + the reusable-but-weak warning.
    if (isScaffoldSynthesisedCard(card)) return;
    if (!productCardCtaIsReusable(card)) {
      reports.push({ index, severity: "advisory", message: PRODUCT_CARD_CTA_FALLBACK_ADVISORY });
      if (hasReusableHint && !hasReusableCard) {
        reports.push({ index, severity: "warning", message: "reusable product-card-cta hint is present but product-card CTA lacks medium/strong reusable visible-text evidence" });
      }
    }
  });
  if (hasReusableCard && !hasReusableButton) {
    reports.push({ severity: "missing", message: "missing product-card-cta button for reusable product-card CTA" });
  }
  if (hasReusableCard && !hasReusableTypography) {
    reports.push({ severity: "missing", message: "missing product-card-cta typography for reusable product-card CTA" });
  }
  reports.push(...productCardLayoutDiagnostics(cards, technicalProductRows));
  reports.push(...productCardHoverDiagnostics(cards, technicalProductRows));
  return reports;
}

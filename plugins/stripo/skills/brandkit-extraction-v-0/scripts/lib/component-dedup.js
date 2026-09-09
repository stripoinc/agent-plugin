// Deduplication helpers for `brand.components.button[]` entries that the
// LLM extraction agent recorded multiple times for the same physical button.
//
// Why: a single button can be measured by both `button-styles.js` (parent =
// immediate DOM ancestor) and the per-card CTA path inside
// `product-card-styles.js` (parent = the product card). When the per-card
// probe ran with a too-broad card selector that matched a page-level
// wrapper, the same physical button got two entries in brandkit.json — one
// with a correct full-width layout, one with a bogus content-sized layout.
//
// This module dedupes by visual signature (background / font / border /
// radius / padding) and merges:
//  - the better LAYOUT (full-width over fixed-width over content-sized;
//    classHintMatched as tiebreaker; bigger widthRatioToParent as last
//    tiebreaker)
//  - the better HOVER (prefer effective changes; prefer hover from the
//    entry tagged `product-card-cta` when both effective)
//  - all unique usageHints from every peer

function lowerHex(value) {
  return String(value || "").trim().toLowerCase();
}

export function buttonVisualSignature(button) {
  if (!button || typeof button !== "object") return "";
  const padding = button.padding && typeof button.padding === "object"
    ? `${button.padding.top ?? ""}/${button.padding.right ?? ""}/${button.padding.bottom ?? ""}/${button.padding.left ?? ""}`
    : "";
  const radius = button.borderRadius == null ? "" : String(button.borderRadius);
  const borderWidth = button.borderWidth == null ? "" : String(button.borderWidth);
  return [
    lowerHex(button.backgroundColor),
    lowerHex(button.fontColor),
    lowerHex(button.borderColor),
    radius,
    borderWidth,
    padding,
  ].join("|");
}

function intentRank(intent) {
  if (intent === "full-width") return 3;
  if (intent === "fixed-width") return 2;
  if (intent === "content-sized") return 1;
  return 0;
}

export function preferredButtonLayout(canonical, alternate) {
  const canonicalRank = intentRank(canonical?.layout?.intent);
  const alternateRank = intentRank(alternate?.layout?.intent);
  if (alternateRank > canonicalRank) return "alternate";
  if (canonicalRank > alternateRank) return "canonical";
  const canonicalClass = Boolean(canonical?.layout?.classHintMatched);
  const alternateClass = Boolean(alternate?.layout?.classHintMatched);
  if (alternateClass && !canonicalClass) return "alternate";
  if (canonicalClass && !alternateClass) return "canonical";
  const canonicalRatio = Number(canonical?.layout?.widthRatioToParent) || 0;
  const alternateRatio = Number(alternate?.layout?.widthRatioToParent) || 0;
  return alternateRatio > canonicalRatio ? "alternate" : "canonical";
}

export function preferredButtonHover(canonical, alternate) {
  const canonicalChanged = canonical?.hoverBackgroundColor
    && lowerHex(canonical.hoverBackgroundColor) !== lowerHex(canonical.backgroundColor);
  const alternateChanged = alternate?.hoverBackgroundColor
    && lowerHex(alternate.hoverBackgroundColor) !== lowerHex(alternate.backgroundColor);
  if (!canonicalChanged && alternateChanged) return "alternate";
  if (canonicalChanged && !alternateChanged) return "canonical";
  const canonicalProductCard = Array.isArray(canonical?.usageHints) && canonical.usageHints.includes("product-card-cta");
  const alternateProductCard = Array.isArray(alternate?.usageHints) && alternate.usageHints.includes("product-card-cta");
  if (alternateProductCard && !canonicalProductCard) return "alternate";
  return "canonical";
}

export function dedupeButtonComponents(payload, diagnostics = []) {
  const buttons = Array.isArray(payload?.brand?.components?.button) ? payload.brand.components.button : [];
  if (buttons.length < 2) return;
  const groups = new Map();
  for (const button of buttons) {
    const signature = buttonVisualSignature(button);
    if (!signature) continue;
    if (!groups.has(signature)) groups.set(signature, []);
    groups.get(signature).push(button);
  }
  const merged = [];
  const consumed = new Set();
  for (const button of buttons) {
    if (consumed.has(button)) continue;
    const signature = buttonVisualSignature(button);
    const peers = signature ? (groups.get(signature) || [button]) : [button];
    if (peers.length <= 1) {
      merged.push(button);
      consumed.add(button);
      continue;
    }
    let canonical = peers[0];
    let canonicalHover = peers[0];
    for (const peer of peers.slice(1)) {
      if (preferredButtonLayout(canonical, peer) === "alternate") canonical = peer;
      if (preferredButtonHover(canonicalHover, peer) === "alternate") canonicalHover = peer;
    }
    const out = { ...canonical };
    if (canonicalHover !== canonical) {
      if (canonicalHover.hoverBackgroundColor != null) out.hoverBackgroundColor = canonicalHover.hoverBackgroundColor;
      if (canonicalHover.hoverFontColor != null) out.hoverFontColor = canonicalHover.hoverFontColor;
      if (canonicalHover.hoverBorderColor != null) out.hoverBorderColor = canonicalHover.hoverBorderColor;
      if (canonicalHover.hoverBorderWidth != null) out.hoverBorderWidth = canonicalHover.hoverBorderWidth;
    }
    const mergedHints = new Set();
    for (const peer of peers) {
      for (const hint of (Array.isArray(peer.usageHints) ? peer.usageHints : [])) {
        if (typeof hint === "string" && hint.trim()) mergedHints.add(hint);
      }
    }
    out.usageHints = Array.from(mergedHints);
    merged.push(out);
    diagnostics.push({
      path: "$.brand.components.button",
      message: `Merged ${peers.length} button entries with identical visual signature; kept full-width / class-hint-matched layout, preferred product-card-cta hover when both effective, merged usageHints.`,
    });
    for (const peer of peers) consumed.add(peer);
  }
  payload.brand.components.button = merged;
}

// --- Typography dedup ----------------------------------------------------
//
// Why: the agent's "patch-only" rule combined with the scaffolder's
// one-entry-per-text-styles-row pass produces brand.typography arrays with
// dozens of byte-identical duplicates (one observed ecommerce run: 164
// entries collapsing to 9 unique (family, weight, sizePx) signatures).
// One entry per signature is
// enough — additional copies are noise, not coverage. This helper collapses
// duplicates by visual signature and merges their `usageHints` so role tags
// (body-typography, product-name-typography, etc.) survive the merge.

function lowerString(value) {
  return String(value || "").trim().toLowerCase();
}

export function typographyVisualSignature(entry) {
  if (!entry || typeof entry !== "object") return "";
  const family = lowerString(entry.family).replace(/\s+/g, " ");
  const weight = entry.weight == null ? "" : String(entry.weight);
  const size = entry.sizePx == null ? "" : String(entry.sizePx);
  return [family, weight, size].join("|");
}

export function dedupeTypographyComponents(payload, diagnostics = []) {
  const typography = Array.isArray(payload?.brand?.typography) ? payload.brand.typography : null;
  if (!typography) return;

  // First, drop rows with non-positive / non-finite sizePx, and rows that
  // explicitly carry a non-positive / non-finite lineHeightPx. The agent
  // occasionally emits placeholder rows with sizePx=0 / lineHeightPx=0
  // (probed from elements with display:none or zero-height containers) —
  // these are noise that downstream tokenisation will reject anyway, and
  // they survive into brandkit.json today. Filter them here so dedup +
  // role-coverage operate on the cleaned set.
  const filtered = [];
  let droppedRows = 0;
  for (const entry of typography) {
    if (!entry || typeof entry !== "object") continue;
    const size = Number(entry.sizePx);
    if (!Number.isFinite(size) || size <= 0) {
      droppedRows += 1;
      continue;
    }
    if (entry.lineHeightPx !== undefined && entry.lineHeightPx !== null) {
      const lh = Number(entry.lineHeightPx);
      if (!Number.isFinite(lh) || lh <= 0) {
        droppedRows += 1;
        continue;
      }
    }
    filtered.push(entry);
  }
  if (droppedRows > 0) {
    payload.brand.typography = filtered;
    diagnostics.push({
      path: "$.brand.typography",
      message: `Dropped ${droppedRows} typography entries with non-positive sizePx or lineHeightPx; these are placeholder rows from zero-height / display:none probes.`,
    });
  }

  if (filtered.length < 2) return;

  // Group entries by signature, in original order.
  const groups = new Map();
  const order = [];
  for (const entry of filtered) {
    const signature = typographyVisualSignature(entry);
    if (!signature) continue;
    if (!groups.has(signature)) {
      groups.set(signature, []);
      order.push(signature);
    }
    groups.get(signature).push(entry);
  }

  let mergedAny = false;
  let totalMerged = 0;
  const merged = [];
  for (const signature of order) {
    const peers = groups.get(signature) || [];
    if (peers.length === 1) {
      merged.push(peers[0]);
      continue;
    }
    // Pick the first peer as the canonical (preserves source order; agent's
    // first emit usually has the most populated optional fields).
    const canonical = { ...peers[0] };
    const mergedHints = new Set();
    for (const peer of peers) {
      for (const hint of (Array.isArray(peer.usageHints) ? peer.usageHints : [])) {
        if (typeof hint === "string" && hint.trim()) mergedHints.add(hint);
      }
      // For optional fields that may be null on some peers, prefer the first
      // non-null we encounter.
      for (const field of ["lineHeightPx", "letterSpacingPx", "fontStyle", "textTransform", "description"]) {
        if (canonical[field] == null && peer[field] != null) canonical[field] = peer[field];
      }
    }
    canonical.usageHints = Array.from(mergedHints);
    merged.push(canonical);
    mergedAny = true;
    totalMerged += peers.length - 1;
  }

  if (mergedAny) {
    payload.brand.typography = merged;
    diagnostics.push({
      path: "$.brand.typography",
      message: `Merged ${totalMerged} duplicate typography entries by (family, weight, sizePx); kept one canonical per signature with merged usageHints.`,
    });
  }
}

// --- ProductCard dedup ---------------------------------------------------
//
// Why: one observed ecommerce run emitted 33 productCard entries that
// collapsed to ~6 unique
// visual signatures. The agent included raw probe rows verbatim — many with
// null CTA, all sharing similar colors/surface. Downstream the compiler reads
// productCard[0]; extra entries are noise. This helper groups by visual
// signature and keeps the entry with the strongest evidence per group.

function nestedObject(card, key) {
  const value = card && typeof card === "object" ? card[key] : null;
  return value && typeof value === "object" ? value : {};
}

// A boolean axis is three-valued here: true, false, and not measured at all.
// `null` and `undefined` both read as unmeasured, which is what makes the axis
// a wildcard for the absorb pass rather than a `false`.
function flagString(value) {
  return value == null ? "" : String(Boolean(value));
}

// A COLOUR axis is compared on its MEASUREMENT STATE, not on its hex alone.
// The probe records one of three states beside every colour it reads
// (`measureColor`, scripts/lib.js), the scaffold carries them onto the
// authored record, the schema admits them, and this reader is where they are
// finally read — nothing between the probe and here may collapse them:
//   transparent  -> "transparent": a VALUE. An outline button, a card drawn
//                   straight on the page background. It may equal only
//                   another transparent, and it is never a wildcard.
//   measured     -> the hex.
//   unavailable  -> "": the ONE wildcard the absorb pass may treat as "we did
//                   not measure it".
//   no state     -> the hex when there is one; otherwise `COLOUR_UNSTATED`, a
//                   fixed non-empty token. Two state-less nulls still group
//                   together (the baseline behaviour), and neither is a
//                   wildcard: a record written before the state existed —
//                   every archived row — says nothing about WHY its colour is
//                   null, and "did not say" is not "did not measure".
// The hex alone cannot carry this: `null` is written both for a colour
// measured as fully transparent and for one that could not be read, and
// reading those as one string made a real outline variant absorbable into its
// filled sibling — the absence of a measurement read as the measurement of an
// absence.
const COLOUR_UNSTATED = "unstated";
function colourAxis(record, valueKey, stateKey) {
  const state = record ? record[stateKey] : undefined;
  if (state === "transparent") return "transparent";
  if (state === "unavailable") return "";
  return lowerString(record ? record[valueKey] : "") || COLOUR_UNSTATED;
}

// Visual signature for productCard dedup.
//
// Per SKILL.md :321-322 — variants must reflect "meaningfully different"
// surface, CTA, or price treatment. The signature keys on exactly those axes.
// Fresh nested measurements are resolved in the DOM collector. Visible tile
// border, radius and shadow distinguish genuine sibling variants. Old-price
// presence is sample-dependent (discounted versus regular products), so its
// colour remains excluded and is propagated separately downstream.
// The axes, in the order the signature spells them. Each entry carries BOTH
// the name the diagnostic prints and the reader that produces the value the
// absorb pass compares, because the pass names the axis it treated as
// unmeasured and the name has to be that axis's. One entry, one axis: there is
// no second list for a name to disagree with, so the diagnostic cannot name an
// axis other than the one whose reader produced the differing value.
const PRODUCT_CARD_SIGNATURE_AXES = [
  // price treatment
  { name: "priceColor", read: (card) => colourAxis(card, "priceColor", "priceColorState") },
  // CTA label (a verb, another verb, or a product-name leak)
  { name: "cta.text", read: (card) => lowerString(nestedObject(card, "cta").text) },
  // CTA fill (filled vs outline vs unmeasured)
  { name: "cta.backgroundColor", read: (card) => colourAxis(nestedObject(card, "cta"), "backgroundColor", "backgroundColorState") },
  { name: "cta.fontColor", read: (card) => colourAxis(nestedObject(card, "cta"), "fontColor", "fontColorState") },
  { name: "cta.borderColor", read: (card) => {
    const cta = nestedObject(card, "cta");
    return cta.borderWidth === 0 ? "no-border" : colourAxis(cta, "borderColor", "borderColorState");
  } },
  { name: "cta.shape", read: (card) => {
    const cta = nestedObject(card, "cta");
    const padding = cta.padding ?? card.ctaPadding;
    const shape = [cta.borderWidth ?? null, cta.borderRadius ?? null,
      ...["top", "right", "bottom", "left"].map((side) => padding?.[side] ?? null)];
    return shape.every((value) => value === null) ? COLOUR_UNSTATED : JSON.stringify(shape);
  } },
  { name: "cta.hasInlineIcon", read: (card) => flagString(nestedObject(card, "cta").hasInlineIcon) },
  ...["hoverBackgroundColor", "hoverFontColor", "hoverBorderColor"].map((key) => ({
    name: `cta.${key}`, read: (card) => {
      const cta = nestedObject(card, "cta");
      if (key === "hoverBorderColor" && cta.borderWidth === 0) return "no-border";
      // No capture is coverage, not a positively measured hover treatment.
      return cta[`${key}State`] === "transparent" ? "transparent"
        : cta[`${key}State`] === "unavailable" ? "" : lowerString(cta[key]) || "";
    },
  })),
  // CTA layout
  { name: "cta.layoutIntent", read: (card) => lowerString(nestedObject(card, "cta").layoutIntent) },
  { name: "cta.isIconLike", read: (card) => flagString(nestedObject(card, "cta").isIconLike) },
  { name: "cta.hasUsableVisibleText", read: (card) => flagString(nestedObject(card, "cta").hasUsableVisibleText) },
  // surface treatment
  { name: "surface.backgroundColor", read: (card) => colourAxis(nestedObject(card, "surface"), "backgroundColor", "backgroundColorState") },
  { name: "surface.shape", read: (card) => {
    const surface = nestedObject(card, "surface");
    const width = surface.borderWidth ?? card.borderWidth ?? null;
    const color = width === 0 ? null : lowerString(surface.borderColor ?? card.borderColor) || null;
    const style = width === 0 ? null : lowerString(surface.borderStyle) || null;
    const radius = surface.borderRadius ?? null;
    const shadow = lowerString(surface.boxShadow) || null;
    // An absent legacy shape is not DOM identity or a measured boundary.
    if ([width, color, style, radius, shadow].every((value) => value === null)) return COLOUR_UNSTATED;
    return JSON.stringify([width, color, style, radius, shadow]);
  } },
];

const PRODUCT_CARD_SIGNATURE_AXIS_NAMES = PRODUCT_CARD_SIGNATURE_AXES.map((axis) => axis.name);

// The axis VALUES, as an array rather than a joined string, because the absorb
// pass below compares axis by axis. Splitting the joined signature back apart
// is not the same operation: a CTA label containing a `|` would split into the
// wrong number of pieces and silently shift every axis after it.
function productCardSignatureAxes(card) {
  return PRODUCT_CARD_SIGNATURE_AXES.map((axis) => axis.read(card));
}

function productCardVisualSignature(card) {
  if (!card || typeof card !== "object") return "";
  return productCardSignatureAxes(card).join("|");
}

// An axis with no value is not a variant boundary. It is a measurement that
// did not land, and it must not decide which record represents the card.
//
// WHAT THIS REPLACES AND WHY. The pass that stood here read exactly one axis
// that way — `surface.backgroundColor` — and it read it by splitting the
// signature at its last `|`. So the reading was right and its reach was an
// accident of string position. The axis it could not reach is the one that
// decides what an email looks like: a card whose CTA background failed to
// measure and the same card measured land in two groups, strength-based
// selection only runs INSIDE a group, group order is first-seen, and every
// consumer reads productCard[0]. The damaged card therefore stayed
// authoritative however strong its twin was, and correcting the capture did
// not help, because a corrected capture only ever changes which group the
// record lands in.
//
// THE RULE. Absorb A into B when the two signatures differ on EXACTLY ONE
// axis, A has no value there, and at least one axis carries the SAME NON-EMPTY
// value on both. Three consequences are deliberate:
//
//   * At least one shared measured axis, because this pass groups visual
//     styles, not physical DOM identity. Two signatures that match only
//     where BOTH sides are blank have established nothing: a record that
//     measured a price colour and one that measured nothing at all agree on
//     six axes' worth of silence, which is not evidence about a card. Without
//     this, the weakest record in a kit is absorbed into the first record that
//     measured anything, and everything it alone held — a price typography, a
//     padding — is deleted rather than merged, because the absorb carries only
//     the layout-decision keys below.
//     The premise it establishes is only as strong as the axis that carries
//     it, and the weakest pair that can carry it is `cta.isIconLike: false`
//     plus `cta.hasUsableVisibleText: false` — an ordinary text button's
//     measured state, common enough that it says little. It is still a
//     MEASUREMENT and not a silence, which is the distinction `flagString`
//     draws one function up, and there is no coherent "positive value only"
//     narrowing to reach for: `false` is the informative reading on
//     `isIconLike` and `true` is the informative one on
//     `hasUsableVisibleText`. Measured over 95 archived kits / 117 productCard
//     records: zero pairs are licensed by those two axes alone.
//   * Exactly one, not "every differing axis is empty on A". A row that lost
//     several measurements at once is a degenerate row, and the axes it still
//     agrees on are too few to establish that it is the same physical card —
//     a row with no CTA measured at all is not evidence about a card that has
//     one. The 33-entry collapse pinned in the tests turns on this: its 18
//     CTA-less rows differ from the 15 measured ones on four axes and stay a
//     group of their own.
//   * Both sides carrying a value on the differing axis is a variant,
//     whatever the values are. An outline CTA and a solid one, two price
//     colours, two labels: all stay apart, as they did before.
//
// Ambiguous missing measurements remain separate; known conflicts are never bridged.
// Hover coverage is compared as one optional observation, not three variants.
//
// WHAT "NO VALUE" MEANS ON A COLOUR AXIS. The wildcard is `""`, and on the
// three colour axes `colourAxis` produces it for exactly one thing: a state
// of `unavailable`, the probe's record that the colour was never read. A
// colour measured as fully transparent — a real outline button, a card drawn
// on the page background — reads as the value `"transparent"` and is a
// variant boundary like any hex; a record that carries no state at all reads
// as its hex or as `COLOUR_UNSTATED`, and is never absorbed. So a pair the
// signature keeps apart on a colour axis is a pair the probe measured apart.
function absorbUnmeasuredAxisVariants(groups, order, axesBySignature) {
  const absorbed = new Set();
  const absorbedInto = new Map();
  const absorbedAxes = new Map();
  const hoverAxis = index => PRODUCT_CARD_SIGNATURE_AXES[index].name.startsWith("cta.hover");
  const canAbsorb = (signature, other) => {
    const axes = axesBySignature.get(signature);
    const target = axesBySignature.get(other);
    const differences = axes.map((value,index) => value === target[index] ? -1 : index).filter(index => index >= 0);
    if (!differences.length) return false;
    // Hover is one optional coverage observation. Keep the existing bounded
    // single-unavailable-axis rule for every other measurement.
    if (differences.length !== 1 && !differences.every(hoverAxis)) return false;
    if (!differences.every(index => axes[index] === "" && target[index] !== COLOUR_UNSTATED)) return false;
    return axes.some((value,index) => value !== "" && value !== COLOUR_UNSTATED && value === target[index]);
  };
  // Compute all destinations before mutating groups. An incomplete record may
  // match two incompatible measured treatments; it must never bridge them or
  // become assigned by incidental input order. Follow only unique maximal
  // destinations so a partial hover capture can lead to its complete peer.
  const destinations = new Map(order.map(signature => [signature,
    order.filter(other => other !== signature && canAbsorb(signature,other))]));
  const terminals = (signature, seen = new Set()) => {
    if (seen.has(signature)) return new Set();
    const next = destinations.get(signature);
    if (!next.length) return new Set([signature]);
    return new Set(next.flatMap(other => [...terminals(other,new Set([...seen,signature]))]));
  };
  for (const signature of order) {
    const targets = [...terminals(signature)];
    if (targets.length !== 1 || targets[0] === signature) continue;
    const target = targets[0];
    groups.get(target).push(...groups.get(signature));
    absorbed.add(signature);
    absorbedInto.set(signature,target);
    const axes = axesBySignature.get(signature);
    absorbedAxes.set(signature, PRODUCT_CARD_SIGNATURE_AXES.filter((axis,index) =>
      axes[index] !== axesBySignature.get(target)[index]).map(axis => axis.name).join("/"));
  }
  return { absorbed, absorbedInto, absorbedAxes };
}

// Follow a chain of absorptions to the signature that actually survives.
// Chains are possible — A missing one axis that B has, B missing another that
// C has — and a cycle is not, because absorption always moves toward the peer
// with more measured axes.
function survivingSignature(signature, absorbedInto) {
  let current = signature;
  const seen = new Set();
  while (absorbedInto.has(current) && !seen.has(current)) {
    seen.add(current);
    current = absorbedInto.get(current);
  }
  return current;
}

// Absorption is the only step in this pass that removes a record which would
// otherwise have been published in its own right, so SOME of the keys that
// record carried have to survive it.
//
// Measured on a live storefront's kit: `oldPricePosition`, `contentAlign`,
// `recommendedVariantIndex` and `recommendedVariantReason` existed only on the
// card the absorb pass merges away, because the author script wrote the
// variant decision onto the first record. Dropping them silently changes the
// emitted variant and alignment — a kit that disagrees with itself about how
// the card is laid out is worse than one that is merely wrong.
//
// THE RULE FOR WHICH KEYS MAY CROSS. The absorb groups similar visual styles
// when one row failed to read a single axis; it does not prove DOM identity.
// The existing transferable keys describe the CARD SET'S LAYOUT — single-valued for the physical card,
// decided once over the card set rather than read per record — and nothing
// else. The schema says which keys those are without any appeal to a
// storefront: `contentAlign` is defined "across representative rows",
// `oldPricePosition` "on the live product cards", `recommendedVariantIndex`
// and its reason over "the live homepage". Every other key on
// `productCardStyle` is scoped to the one record that holds it, and splits
// into two classes, both refused:
//
//   * EVIDENCE AND PROVENANCE ABOUT THE RECORD ITSELF — `description`,
//     `evidenceQuality`, `confidence`, `missingEvidence`. These say what THIS
//     record observed and how well it observed it. Filling one makes the
//     surviving record assert something about its own evidence that it never
//     observed: a `missingEvidence` note reading "no reusable visible-text
//     product-card CTA observed" landing on a record that HAS one publishes a
//     kit that contradicts its own `cta`.
//   * MEASUREMENTS — every colour, width, padding and typography block, and
//     the whole `cta` and `surface` objects. A measurement is precisely what
//     the absorb collapsed the two records OVER, so grafting one publishes an
//     observation the representative never made. On `cta` it is worse than a
//     wrong value: a representative that measured no CTA at all would acquire
//     a whole component — background, label shape and all — from a peer, i.e.
//     a component the record does not have.
//
// So the permitted set below is not a list of the keys that happened to matter
// on one kit; it is that layout-decision class, and it is closed. A key the
// schema gains later is absent from it and therefore stays ABSENT on the
// merged record, which is the safe direction: a dropped layout decision shows
// up as a missing field, an invented measurement shows up as fact.
const PRODUCT_CARD_LAYOUT_DECISION_KEYS = new Set([
  "contentAlign",             // dominant alignment, read across representative rows
  "oldPricePosition",         // where the struck price sits, over the live cards
  "recommendedVariantIndex",  // which bundled variant the card set matches
  "recommendedVariantReason", // the one-line rationale for that pick
]);

// Fill-only, allowlisted, and only from the record each contributing signature
// WOULD have published: never an overwrite, so nothing the chosen
// representative measured is displaced by a peer that measured it differently.
function fillAbsentKeysFromAbsorbed(canonical, contributors, peersBeforeAbsorb) {
  const out = { ...canonical };
  for (const signature of contributors) {
    const wouldHavePublished = pickCanonicalProductCard(peersBeforeAbsorb.get(signature) || []);
    if (!wouldHavePublished || wouldHavePublished === canonical) continue;
    for (const [key, value] of Object.entries(wouldHavePublished)) {
      if (!PRODUCT_CARD_LAYOUT_DECISION_KEYS.has(key)) continue;
      if (out[key] === undefined && value !== undefined) out[key] = value;
    }
  }
  return out;
}

function evidenceQualityRank(quality) {
  const value = lowerString(quality);
  if (value === "strong") return 3;
  if (value === "medium" || value === "moderate") return 2;
  if (value === "weak") return 1;
  return 0;
}

function ctaLooksUsable(card) {
  const cta = card?.cta;
  if (!cta || typeof cta !== "object") return false;
  return Boolean(cta.text || cta.layoutIntent);
}

function pickCanonicalProductCard(peers) {
  // Prefer entries with: usable CTA → higher evidenceQuality → higher confidence
  // → first seen (stable order).
  let best = peers[0];
  let bestScore = -Infinity;
  for (const peer of peers) {
    let score = 0;
    if (ctaLooksUsable(peer)) score += 100;
    score += evidenceQualityRank(peer.evidenceQuality) * 10;
    const confidence = Number(peer.confidence);
    if (Number.isFinite(confidence)) score += confidence;
    if (score > bestScore) {
      bestScore = score;
      best = peer;
    }
  }
  return best;
}

export function dedupeProductCardComponents(payload, diagnostics = []) {
  const cards = Array.isArray(payload?.brand?.components?.productCard) ? payload.brand.components.productCard : null;
  if (!cards || cards.length < 2) return;

  const groups = new Map();
  const order = [];
  const axesBySignature = new Map();
  const fallbackBucket = [];
  for (const card of cards) {
    const signature = productCardVisualSignature(card);
    if (!signature) {
      fallbackBucket.push(card);
      continue;
    }
    if (!groups.has(signature)) {
      groups.set(signature, []);
      order.push(signature);
      axesBySignature.set(signature, productCardSignatureAxes(card));
    }
    groups.get(signature).push(card);
  }

  // The peers each signature had BEFORE absorption. Kept because absorption is
  // the only step here that removes a record which would otherwise have been
  // published on its own, and the keys that record carried have to survive it.
  const peersBeforeAbsorb = new Map(order.map((signature) => [signature, [...groups.get(signature)]]));

  // Second pass: absorb signatures whose only difference from a peer is an
  // axis they did not measure. See the helper for the rule and its limit.
  const {
    absorbed: absorbedSigs,
    absorbedInto,
    absorbedAxes,
  } = absorbUnmeasuredAxisVariants(groups, order, axesBySignature);

  // How many RECORDS were absorbed, counted from each absorbed signature's own
  // membership BEFORE the pass ran. Absorption pushes a group's peers into its
  // target, so a signature absorbed after something was absorbed into it holds
  // records it never authored: counting the group as it stands at that moment
  // counts those a second time. A chain A -> B -> C is exactly that shape and
  // reported three absorbed records where two exist.
  let absorbedCount = 0;
  for (const signature of absorbedSigs) {
    absorbedCount += (peersBeforeAbsorb.get(signature) || []).length;
  }

  // A merged group takes the EARLIEST position of anything merged into it. The
  // alternative — leaving it where the surviving signature happened to sit —
  // demotes a card below unrelated cards authored after it, which is the same
  // "position decides the representative" accident this pass exists to remove,
  // pointing the other way. Which RECORD represents the group is decided by
  // evidence in pickCanonicalProductCard; only the slot is decided here.
  const positionOf = new Map(order.map((signature, index) => [signature, index]));
  for (const signature of absorbedSigs) {
    const survivor = survivingSignature(signature, absorbedInto);
    positionOf.set(survivor, Math.min(positionOf.get(survivor), positionOf.get(signature)));
  }
  const contributorsOf = new Map(order.filter((s) => !absorbedSigs.has(s)).map((s) => [s, [s]]));
  for (const signature of order) {
    if (!absorbedSigs.has(signature)) continue;
    contributorsOf.get(survivingSignature(signature, absorbedInto)).push(signature);
  }

  const merged = [];
  const survivingOrder = order
    .filter((signature) => !absorbedSigs.has(signature))
    .sort((left, right) => positionOf.get(left) - positionOf.get(right));
  for (const signature of survivingOrder) {
    const peers = groups.get(signature) || [];
    if (peers.length === 1) {
      merged.push(peers[0]);
      continue;
    }
    // Only the surviving signature's own records contain every observation
    // that licensed absorption. Subjective confidence on an unread peer must
    // never discard that measurement; select one coherent measured record.
    const canonical = pickCanonicalProductCard(peersBeforeAbsorb.get(signature) || peers);
    const contributors = contributorsOf.get(signature) || [signature];
    merged.push(contributors.length > 1 ? fillAbsentKeysFromAbsorbed(canonical, contributors, peersBeforeAbsorb) : canonical);
  }
  // Preserve any entries with no signature (extremely unusual); they're
  // appended at the end so they don't displace the canonical entries.
  for (const card of fallbackBucket) merged.push(card);

  // How many entries this pass removed: what came in, less what goes out.
  // Accumulating `peers.length - 1` over the surviving groups instead counts
  // every absorbed record twice, because absorption has already pushed it into
  // the group being counted — three chained records reported five merges.
  const totalMerged = cards.length - merged.length;

  const absorbedAxisNames = [...new Set(order.filter((signature) => absorbedSigs.has(signature)).flatMap((signature) => absorbedAxes.get(signature).split("/")))];

  if (totalMerged > 0) {
    payload.brand.components.productCard = merged;
    diagnostics.push({
      path: "$.brand.components.productCard",
      message: `Merged ${totalMerged} duplicate productCard entries with identical (${PRODUCT_CARD_SIGNATURE_AXIS_NAMES.join(", ")}) signature${absorbedCount > 0 ? ` (${absorbedCount} absorbed as unmeasured-axis variants (${absorbedAxisNames.join(", ")}) of a peer that measured that axis; the merged record keeps only the layout decisions (${[...PRODUCT_CARD_LAYOUT_DECISION_KEYS].join(", ")}) an absorbed peer carried, never its evidence or its measurements)` : ""}; kept one canonical per group preferring usable CTA + strongest evidence. Old-price colour is propagated separately; visible surface shape remains a variant boundary.`,
    });
  }
}

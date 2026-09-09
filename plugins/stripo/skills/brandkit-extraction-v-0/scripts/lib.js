import fs from "node:fs/promises";
import fsSync from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import { chromium } from "playwright";
import { brandkitSocialsFromLinks } from "./social-signals.js";
import { isCtaSuppressedOnHover, swapLowersEvidence, hasSupportedCtaHoverChange } from "./lib/cta-suppression.js";
import { isDiscountOnlyCtaLabel } from "./lib/product-card-cta-label.js";
import { aggregateContentAlign } from "./lib/product-card-content-align.js";
import { buildProductDataArtifact, decideHarvestGate } from "./lib/product-data.js";
import { isBrowserbaseMode, connectViaBrowserbase, connectViaBrowserbaseBlockedFallback, releaseBrowserbaseSession } from "./lib/browserbase-connector.js";
// Shared with save-logo-asset.js, which fetches through the same browser proxy
// via undici and must produce the same actionable message. Kept in its own
// module so the asset fetcher does not have to import Playwright — and imported
// on ONE line: tests/test_request_safety_filter.py strips lib.js imports with a
// single-line regex before running the file in a vm context.
import { rethrowAsBrowserProxyRefusal, defaultBrowserProxyUrl } from "./lib/browser-proxy-refusal.js";
// THE proxy-URL parser (see its header): shared with save-logo-asset.js and the
// Browserbase connector so the three clients cannot drift apart again.
import { parseProxyUrl } from "./lib/browser-proxy-connect-probe.js";
import { createOverlayController } from "./lib/overlay-dismissal.js";
import { createLogoBodyCache } from "./lib/logo-asset-capture.js";
import { contactRowsWithFacts } from "./lib/contact-facts.js";
import { collectHrefLessSocialControls } from "./lib/social-controls.js";
import { classifyHoverError } from "./lib/button-probe-diagnostics.js";

const ACTION_LIMITS = {
  maxActions: 8,
  maxSelectors: 6,
  maxSelectorLength: 200,
  minTimeoutMs: 100,
  maxTimeoutMs: 10000,
  minWaitMs: 100,
  maxWaitMs: 5000,
};

const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "metadata",
  "metadata.google.internal",
  "host.docker.internal",
]);

const BLOCKED_HOST_SUFFIXES = [
  ".localhost",
  ".local",
  ".localdomain",
  ".internal",
  ".home",
  ".home.arpa",
  ".lan",
  ".corp",
];
const SCREENSHOT_SETTLE_WAIT_MS = 3000;
const SCREENSHOT_SCROLL_PAUSE_MS = 750;
const SCREENSHOT_MAX_NETWORK_SETTLE_MS = 5000;
// Cap for openPage's post-navigation networkidle settles. Sites with
// persistent ad/analytics/websocket traffic (e.g. shop-example.com) never reach
// networkidle, so an uncapped settle burns the full args.timeoutMs (45s) per
// call for no extraction value — the DOM/CSSOM probes read state present at
// domcontentloaded, and the screenshot + lazy-grid passes self-settle later
// with their own bounded waits. Mirrors SCREENSHOT_MAX_NETWORK_SETTLE_MS /
// LAZY_GRID_SETTLE_TIMEOUT_MS; only openPage was left uncapped.
const OPEN_PAGE_MAX_NETWORK_SETTLE_MS = 5000;
const LAZY_GRID_SCROLL_PAUSE_MS = 600;
const LAZY_GRID_SETTLE_TIMEOUT_MS = 2500;
const LAZY_GRID_VISIBLE_WAIT_MS = 2500;
const LAZY_GRID_ENDPOINT_WAIT_MS = 3500;
const MAX_HOMEPAGE_DATA_CANDIDATES = 12;
const SAME_ORIGIN_REQUEST_CATEGORY_LIMIT = 60;
// How many of the main frame's own navigation responses the capture keeps.
// A landing is one hop plus its redirects; the largest chain measured live is
// two (a locale-redirecting storefront: `/` 302 -> `/ua/` 200). The list keeps
// the LAST entries rather than the first, so the record a refusal turns on is
// the one thing this cap can never evict -- unlike the per-category bucket
// cap, which keeps the first 60 and would drop a landed document that arrived
// behind 60 frames.
const MAX_MAIN_FRAME_NAVIGATIONS = 12;
// Top-K cap for hover-state probing in collectButtonStyles. Hovering each
// candidate costs up to BUTTON_HOVER_TIMEOUT_MS, so we score base styles
// across all visible matches first and only spend the hover budget on the
// highest-scoring candidates. Buttons beyond the cap keep `hover: null`,
// which downstream already treats as "no hover evidence collected".
const BUTTON_HOVER_BUDGET = 20;
const BUTTON_HOVER_TIMEOUT_MS = 2000;
// Shared post-hover settle. After ``target.hover()`` we wait for either the
// element's own ``transitionend`` to fire OR this timeout, whichever comes
// first. The previous 250ms fallback was too short for sites with slow CSS
// transitions on buttons (one observed regression had a ~500ms
// green→bright green hover captured mid-transition because the timeout fired first,
// leaving ``hoverBackgroundColor`` only ~2 RGB units off the default — i.e.
// visually identical, breaking the rendered hover effect in customised email
// previews). 800ms covers the vast majority of real-world transitions while
// staying inside the per-row hover budget. Sites whose transitions are
// faster (the common case) trigger ``transitionend`` first and don't pay
// the extra wait.
const HOVER_TRANSITION_SETTLE_MS = 800;

/**
 * The overlay controller for one page (lib/overlay-dismissal.js), bound to
 * the hover probe's own constants: the settle that bounds a close animation
 * before each re-detection, and the actionability timeout for a close
 * control's click. Created by the homepage pass and handed to
 * `collectProductCardStyles` and `collectButtonStyles`; either runs exactly as
 * before without it.
 */
export function createPageOverlayController(page) {
  return createOverlayController(page, {
    settleMs: HOVER_TRANSITION_SETTLE_MS,
    clickTimeoutMs: BUTTON_HOVER_TIMEOUT_MS,
  });
}
const STATIC_ASSET_PATH_PATTERN =
  /\.(?:css|js|mjs|map|png|jpe?g|gif|svg|webp|avif|ico|woff2?|ttf|eot|otf|mp4|webm|m3u8|ts|pdf)(?:[?#]|$)/i;
const DATA_HINT_PATTERN =
  /(api|graphql|json|product|products|catalog|category|collection|listing|grid|feed|widget|block|banner|offer|deal|recommend|home|cms|menu|search|promo|carousel)/i;
const FAVICON_REL_PATTERN = /(?:^|\s)(?:icon|shortcut icon|apple-touch-icon)(?:\s|$)/i;
const SALE_BADGE_PATTERN = /(?:sale|discount|deal|save|%\s*off|-[0-9]+%|зниж|скид|акц|розпрод)/i;
const NEW_BADGE_PATTERN = /(?:^|\s)(new|новин|новинка|щойно|just in)(?:$|\s)/i;
const BESTSELLER_BADGE_PATTERN = /(?:best\s*seller|bestseller|top seller|хіт|хит|топ)/i;
const REVIEW_PATTERN = /(?:review|reviews|відгук|відгуки|отзыв|отзывы)/i;
const DELIVERY_PATTERN = /(?:delivery|shipping|ship|доставка|доставим)/i;
const INSTALLMENT_PATTERN = /(?:installment|credit|finance|частин|частями|кредит|оплат[аи]\s+част)/i;
const WISHLIST_PATTERN = /(?:wishlist|favorite|favourite|heart|bookmark|обран|улюблен|избран)/i;
const COMPARE_PATTERN = /(?:compare|comparison|порівн|сравн)/i;

export const BROWSER_PROBE_HELPERS_SOURCE = `
(() => {
  const normalizeWhitespace = (text) => String(text || "").replace(/\\s+/g, " ").trim();
  const normalizeSelectorList = (value) => {
    const rawSelectors = Array.isArray(value)
      ? value
      : (typeof value === "string" ? [value] : []);
    return rawSelectors
      .filter((selector) => typeof selector === "string")
      .map((selector) => selector.trim())
      .filter(Boolean);
  };
  const CTA_PURCHASE_PATTERNS = [
    /(?:^|[^\\p{L}\\p{N}])купити(?=$|[^\\p{L}\\p{N}])/iu,
    /(?:^|[^\\p{L}\\p{N}])купить(?=$|[^\\p{L}\\p{N}])/iu,
    /(?:^|[^\\p{L}\\p{N}])купуй(?=$|[^\\p{L}\\p{N}])/iu,
    /(?:^|[^\\p{L}\\p{N}])придбати(?=$|[^\\p{L}\\p{N}])/iu,
    /(?:^|[^\\p{L}\\p{N}])до\\s+кошика(?=$|[^\\p{L}\\p{N}])/iu,
    /(?:^|[^\\p{L}\\p{N}])в\\s+корзину(?=$|[^\\p{L}\\p{N}])/iu,
    /(?:^|[^\\p{L}\\p{N}])оформ(?:ити|ить|лення|ление)(?=$|[^\\p{L}\\p{N}])/iu,
    /(?:^|[^\\p{L}\\p{N}])замов(?:ити|лення)(?=$|[^\\p{L}\\p{N}])/iu,
    /(?:^|[^\\p{L}\\p{N}])заказ(?:ать|у)?(?=$|[^\\p{L}\\p{N}])/iu,
    /(?:^|[^a-z0-9])add[\\s_-]*to[\\s_-]*(?:cart|basket|bag)(?=$|[^a-z0-9])/i,
    /(?:^|[^a-z0-9])add[\\s_-]*(?:cart|basket|bag)(?=$|[^a-z0-9])/i,
    /(?:^|[^a-z0-9])buy(?:[\\s_-]*(?:now|small|btn|button))?(?=$|[^a-z0-9])/i,
    /(?:^|[^a-z0-9])(?:cart|basket)(?=$|[^a-z0-9])/i,
    /(?:^|[^a-z0-9])checkout(?=$|[^a-z0-9])/i,
    /(?:^|[^a-z0-9])order[\\s_-]*now(?=$|[^a-z0-9])/i,
    /(?:^|[^a-z0-9])shop[\\s_-]*now(?=$|[^a-z0-9])/i,
  ];
  const matchesPurchaseCta = (text) => {
    const normalized = normalizeWhitespace(text);
    return Boolean(normalized && CTA_PURCHASE_PATTERNS.some((pattern) => pattern.test(normalized)));
  };
  // ONE currency alphabet for every price probe on the page. It is shared
  // because the two copies it replaces had already drifted apart: the
  // DOM-mining copy listed € and $, the candidate copy did not, so a clean
  // "€ 2 199" card was mined as a price node and then rejected as a price
  // candidate — price.text "", textSource "none", no price extracted at all.
  // Symbols therefore come from the Unicode currency-symbol property instead
  // of a hand-listed set: an enumeration is precisely what drifted, so a
  // longer enumeration would only postpone the next drift. \\p{Sc} covers
  // ₴ € $ £ ¥ ₽ ₹ ₩ and every symbol Unicode adds later, and it matches no
  // digit, letter or punctuation. Word currencies are letters, so no property
  // can supply them — they stay an explicit list, and this is the one place to
  // extend it. They carry letter-boundary lookarounds so "uah" / "lei" cannot
  // fire inside a word; symbols need no boundary, because no word contains one.
  const CURRENCY_TOKEN = /(?<!\\p{L})(?:грн|uah|usd|eur|gbp|rub|руб|pln|zł|lei)\\.?(?!\\p{L})|\\p{Sc}/u;
  const PRICE_AMOUNT = /\\d[\\d\\s.,]{0,18}/u;
  const PRICE_GAP = /\\s*/u;
  // Published as a source STRING, not as a RegExp, because the two stages need
  // different flags — see the two call sites. Building each stage's own RegExp
  // from one source keeps the alphabet single-sourced while still handing the
  // stages separate objects, so neither can advance the other's lastIndex.
  //
  // The bare alphabet is published alongside the price pattern because a
  // currency is not always set against digits: drawn as an icon font or an
  // <svg> it appears only in an element's NAME, with no amount beside it to
  // anchor. That consumer needs the same alphabet, and taking it from anywhere
  // else is how the two copies this file already had drifted apart.
  const currencyTokenSource = CURRENCY_TOKEN.source;
  const priceTextPatternSource =
    "(?:" + PRICE_AMOUNT.source + PRICE_GAP.source + "(?:" + CURRENCY_TOKEN.source + ")" +
    "|(?:" + CURRENCY_TOKEN.source + ")" + PRICE_GAP.source + PRICE_AMOUNT.source + ")";
  const textMeasureContext = document.createElement("canvas").getContext("2d");
  const colorNormalizationContext = document.createElement("canvas").getContext("2d");
  const parseColorWithAlpha = (value) => {
    if (!value) return { hex: null, alpha: 1 };
    if (!colorNormalizationContext) return { hex: null, alpha: 1 };
    colorNormalizationContext.fillStyle = "#000000";
    try {
      colorNormalizationContext.fillStyle = value;
    } catch {
      return { hex: null, alpha: 1 };
    }
    const normalized = colorNormalizationContext.fillStyle;
    const rgbaMatch = normalized.match(/^rgba?\\(([^)]+)\\)$/);
    if (rgbaMatch) {
      const channels = rgbaMatch[1].split(",").map((part) => part.trim());
      const alpha = channels.length >= 4 ? Number(channels[3]) : 1;
      const safeAlpha = Number.isFinite(alpha) ? Math.max(0, Math.min(1, alpha)) : 1;
      const hex = "#" + channels
        .slice(0, 3)
        .map((channel) => Number(channel).toString(16).padStart(2, "0"))
        .join("");
      return { hex, alpha: safeAlpha };
    }
    const hexMatch = normalized.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
    if (!hexMatch) return { hex: null, alpha: 1 };
    const hex = hexMatch[1];
    const expanded = hex.length === 3
      ? "#" + hex.split("").map((char) => char + char).join("").toLowerCase()
      : "#" + hex.toLowerCase();
    return { hex: expanded, alpha: 1 };
  };
  const toHex = (value) => {
    const parsed = parseColorWithAlpha(value);
    if (!parsed.hex) return null;
    if (parsed.alpha === 0) return null;
    return parsed.hex;
  };
  // A colour read has THREE outcomes and \`toHex\` collapses all of them onto
  // one \`null\`, so every consumer that tests a colour for truthiness is really
  // asking a question the value cannot answer:
  //   "measured"    - a real colour with alpha > 0.
  //   "transparent" - parsed, alpha === 0. The element paints nothing HERE.
  //                   That is a design fact we measured, not a failure.
  //   "unavailable" - no value, unparseable, or no normalisation context.
  //                   WE DO NOT KNOW what the element paints.
  // The last two are opposites: one is evidence, the other is the absence of
  // evidence. Any rule that deletes a measured value must be allowed to fire on
  // "transparent" and must never fire on "unavailable".
  //
  // Additive: \`toHex\` keeps its exact existing return, and \`measureColor().hex\`
  // is equal to it for every input, so a value and its state can never diverge.
  const measureColor = (value) => {
    if (!colorNormalizationContext) return { hex: null, state: "unavailable" };
    const parsed = parseColorWithAlpha(value);
    if (!parsed.hex) return { hex: null, state: "unavailable" };
    if (parsed.alpha === 0) return { hex: null, state: "transparent" };
    return { hex: parsed.hex, state: "measured" };
  };
  const FONT_WEIGHT_KEYWORDS = {
    normal: 400,
    bold: 700,
    lighter: 300,
    bolder: 700,
  };
  const normalizeFontWeight = (value) => {
    if (value === null || value === undefined || value === "") return null;
    const parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) return parsed;
    const keyword = String(value).toLowerCase().trim();
    return Object.prototype.hasOwnProperty.call(FONT_WEIGHT_KEYWORDS, keyword)
      ? FONT_WEIGHT_KEYWORDS[keyword]
      : null;
  };
  const parsePxFromComputed = (value) => {
    if (value === null || value === undefined) return null;
    const parsed = Number.parseFloat(value);
    return Number.isFinite(parsed) ? parsed : null;
  };
  const parseLineHeightPx = (style, fontSizePx) => {
    if (!style) return null;
    const raw = style.lineHeight;
    if (!raw || raw === "normal") return null;
    const parsed = Number.parseFloat(raw);
    if (!Number.isFinite(parsed)) return null;
    if (/px\\s*$/i.test(raw)) return parsed;
    if (/^\\s*[\\d.]+\\s*$/.test(raw)) {
      return Number.isFinite(fontSizePx) && fontSizePx > 0 ? parsed * fontSizePx : null;
    }
    return parsed;
  };
  const pickBorderColor = (style) => {
    if (!style) return null;
    const direct = toHex(style.borderColor);
    if (direct) return direct;
    if (style.borderColor && /\\s/.test(style.borderColor.trim())) {
      const top = toHex(style.borderTopColor);
      if (top) return top;
    }
    return toHex(style.borderTopColor);
  };
  // The measured-state twin of \`pickBorderColor\`, branching identically so
  // \`measureBorderColor(style).hex === pickBorderColor(style)\` for every style.
  // A border is the one paint channel with a second way to be invisible
  // (width 0); the state says only how the COLOUR was read, and a consumer
  // that needs "is a border drawn" reads the width beside it.
  const measureBorderColor = (style) => {
    if (!style) return { hex: null, state: "unavailable" };
    const direct = measureColor(style.borderColor);
    if (direct.hex) return direct;
    if (style.borderColor && /\\s/.test(style.borderColor.trim())) {
      const top = measureColor(style.borderTopColor);
      if (top.hex) return top;
    }
    return measureColor(style.borderTopColor);
  };
  const splitTopLevelCommas = (input) => {
    const parts = [];
    let depth = 0;
    let current = "";
    for (let index = 0; index < input.length; index += 1) {
      const char = input[index];
      if (char === "(") depth += 1;
      else if (char === ")") depth = Math.max(0, depth - 1);
      if (char === "," && depth === 0) {
        parts.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    if (current.trim()) parts.push(current.trim());
    return parts;
  };
  const POSITION_TOKEN_PATTERN = /^(?:-?\\d+(?:\\.\\d+)?(?:px|%|em|rem|vw|vh)?|0)$/i;
  const splitColorAndPositions = (segment) => {
    const tokens = [];
    let depth = 0;
    let current = "";
    for (let index = 0; index < segment.length; index += 1) {
      const char = segment[index];
      if (char === "(") depth += 1;
      else if (char === ")") depth = Math.max(0, depth - 1);
      if (/\\s/.test(char) && depth === 0) {
        if (current) {
          tokens.push(current);
          current = "";
        }
      } else {
        current += char;
      }
    }
    if (current) tokens.push(current);
    const positions = [];
    while (tokens.length > 1 && POSITION_TOKEN_PATTERN.test(tokens[tokens.length - 1])) {
      positions.unshift(tokens.pop());
    }
    return { color: tokens.join(" ").trim(), positions };
  };
  const GRADIENT_LAYER_PATTERN = /^(repeating-)?(linear|radial|conic)-gradient\\(([\\s\\S]+)\\)\\s*$/i;
  const parseGradientLayer = (layer) => {
    const match = layer.match(GRADIENT_LAYER_PATTERN);
    if (!match) return null;
    const repeating = Boolean(match[1]);
    const type = match[2].toLowerCase();
    const inner = match[3];
    const segments = splitTopLevelCommas(inner);
    if (segments.length < 2) return null;
    let direction = null;
    let firstStopIndex = 0;
    const head = segments[0];
    if (/^(?:to\\s+|[-\\d.]+(?:deg|grad|rad|turn))/i.test(head) || /^circle|^ellipse|^at\\s+/i.test(head)) {
      direction = head;
      firstStopIndex = 1;
    }
    const stops = [];
    for (let index = firstStopIndex; index < segments.length; index += 1) {
      const { color, positions } = splitColorAndPositions(segments[index]);
      const parsed = parseColorWithAlpha(color);
      if (!parsed.hex) return null;
      if (positions.length === 0) {
        stops.push({ color: parsed.hex, alpha: parsed.alpha, position: null });
      } else {
        for (const position of positions) {
          stops.push({ color: parsed.hex, alpha: parsed.alpha, position });
        }
      }
    }
    if (stops.length < 2) return null;
    return { type, repeating, direction, stops };
  };
  const parseGradient = (backgroundImage) => {
    if (!backgroundImage || backgroundImage === "none") return null;
    const layers = [];
    for (const rawLayer of splitTopLevelCommas(backgroundImage)) {
      const parsed = parseGradientLayer(rawLayer);
      if (parsed) layers.push(parsed);
    }
    if (layers.length === 0) return null;
    const first = layers[0];
    return {
      type: first.type,
      repeating: first.repeating,
      direction: first.direction,
      stops: first.stops,
      layers,
    };
  };
  const readHoverStyleFor = (element) => {
    if (!(element instanceof Element)) return null;
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const background = measureColor(style.backgroundColor);
    const font = measureColor(style.color);
    const border = measureBorderColor(style);
    return {
      // Existing color / border fields (unchanged contract — downstream relies on these).
      backgroundColor: background.hex,
      fontColor: font.hex,
      borderColor: border.hex,
      borderWidth: Number.parseFloat(style.borderWidth) || 0,
      // Measurement state beside each colour. Same values as above, plus the
      // one bit the hex cannot carry: whether a null means "paints nothing"
      // or "we could not read it". See \`measureColor\`.
      backgroundColorState: background.state,
      fontColorState: font.state,
      borderColorState: border.state,
      // Whether the element still RENDERS under hover. Three more reads on a
      // CSSStyleDeclaration already in hand, and the only direct evidence that
      // an element stopped painting: a colour channel going quiet is not.
      visibility: style.visibility || null,
      display: style.display || null,
      opacity: style.opacity === "" || style.opacity === undefined ? null : style.opacity,
      // Typography on hover — useful when buttons change weight / family / size on :hover.
      // For icon-only CTAs these fields describe the button text style even when no
      // visible glyph exists; downstream may ignore them safely.
      ...readTypographyStyle(style),
      // Layout on hover — surfaces height-collapse and padding/border-radius shifts that
      // are signals for hover-state design changes (and for the suppression gate further
      // down in captureProductCardCtaHoverStates).
      computedWidthPx: Number.isFinite(rect.width) ? rect.width : null,
      computedHeightPx: Number.isFinite(rect.height) ? rect.height : null,
      paddingTopPx: Number.parseFloat(style.paddingTop) || 0,
      paddingRightPx: Number.parseFloat(style.paddingRight) || 0,
      paddingBottomPx: Number.parseFloat(style.paddingBottom) || 0,
      paddingLeftPx: Number.parseFloat(style.paddingLeft) || 0,
      borderRadiusPx: Number.parseFloat(style.borderTopLeftRadius) || 0,
    };
  };
  // CSSOM-based :hover read — fallback for sites where mouse-driven hover() can't
  // reach the element (parent intercepts pointer events; common pattern: a
  // product card wraps its cart button in an outer \`<a>\` link to the product
  // page, swallowing pointer events so Playwright's button-targeted hover()
  // times out and the card-fallback hover never lands on the button itself).
  //
  // Walks every same-origin stylesheet, finds rules whose selectorText contains
  // \`:hover\` and whose stripped selector matches the target element, and
  // overlays those declarations onto the element's normal computed style. Cross
  // -origin sheets (CORS-blocked .cssRules access) are silently skipped.
  //
  // Returns the same shape as readHoverStyleFor so it can be slotted into
  // \`row.cta.hover\` interchangeably.
  const readHoverStyleFromCssRules = (element) => {
    if (!(element instanceof Element)) return null;
    // Hovering an element puts that element AND its ancestors into :hover, but
    // NOT its siblings/cousins. So a :hover compound is only relevant to this
    // element when it sits on the element or one of its ancestors -- i.e. every
    // combinator BETWEEN the :hover compound and the selector subject is
    // descendant or child. A sibling combinator (+ or ~) after the :hover
    // compound means the hovered element is a sibling-relative, not an ancestor,
    // and the rule does NOT fire when THIS element is hovered (the over-match
    // case e.g. ".nav:hover ~ .main .btn").
    const hoverFiresForElement = (sel) => {
      let stripped;
      try {
        stripped = sel.replace(/:hover\\b/g, "");
        if (!stripped || !element.matches(stripped)) return false;
      } catch (err) {
        return false;
      }
      const hoverIdx = sel.indexOf(":hover");
      if (hoverIdx === -1) return false;
      // Only the portion AFTER the :hover compound matters; strip bracketed
      // attribute selectors and pseudo-class argument lists first so their
      // internal ~ / + (e.g. [a~=b], :nth-child(2n+1)) don't false-trigger.
      const after = sel
        .slice(hoverIdx + ":hover".length)
        .replace(/\\[[^\\]]*\\]/g, "")
        .replace(/\\([^)]*\\)/g, "");
      return !/[~+]/.test(after);
    };
    // Collect every :hover declaration that fires when this element is hovered,
    // from same-origin sheets and ACTIVE @media blocks, tracking !important and
    // source order so the cascade can be resolved (vs naive last-write-wins).
    const decls = new Map();
    let order = 0;
    let matchedAny = false;
    const consider = (rule) => {
      const selectorText = rule.selectorText;
      if (!selectorText || selectorText.indexOf(":hover") === -1) return;
      const fires = selectorText
        .split(",")
        .map((part) => part.trim())
        .filter((part) => part.indexOf(":hover") !== -1)
        .some(hoverFiresForElement);
      if (!fires) return;
      matchedAny = true;
      order += 1;
      for (let i = 0; i < rule.style.length; i += 1) {
        const prop = rule.style[i];
        if (!decls.has(prop)) decls.set(prop, []);
        decls.get(prop).push({
          value: rule.style.getPropertyValue(prop),
          important: rule.style.getPropertyPriority(prop) === "important",
          order,
        });
      }
    };
    const walkRules = (rules) => {
      for (const rule of Array.from(rules || [])) {
        if (rule instanceof CSSStyleRule) {
          consider(rule);
        } else if (typeof CSSMediaRule !== "undefined" && rule instanceof CSSMediaRule) {
          // Recurse only into media blocks that currently apply, so a :hover
          // nested in an active @media joins the cascade and an inactive guard
          // (e.g. @media (hover: none)) is correctly ignored.
          let active = true;
          try {
            active = window.matchMedia(rule.conditionText).matches;
          } catch (err) {
            active = true;
          }
          if (active) walkRules(rule.cssRules);
        }
      }
    };
    for (const sheet of Array.from(document.styleSheets || [])) {
      let rules;
      try {
        rules = sheet.cssRules;
      } catch (err) {
        // CORS-blocked sheet -- accessing cssRules throws on cross-origin sheets.
        continue;
      }
      if (!rules) continue;
      walkRules(rules);
    }
    if (!matchedAny) return null;
    // Resolve each property to a single winning value, or AMBIGUOUS. !important
    // declarations win over normal ones; within the winning tier a single
    // distinct value is taken, but CONFLICTING values are ambiguous -- we can't
    // replicate full specificity ordering here, so we defer those (return null)
    // to the live mouse-hover read rather than guess wrong.
    const AMBIGUOUS = Symbol("ambiguous");
    const winner = (prop) => {
      const list = decls.get(prop);
      if (!list || !list.length) return undefined;
      const important = list.filter((d) => d.important);
      const tier = important.length ? important : list;
      const values = new Set(tier.map((d) => String(d.value).trim()));
      return values.size === 1 ? tier[0].value : AMBIGUOUS;
    };
    // A :hover color that is var()/currentColor/gradient cannot be resolved to a
    // concrete hex statically (CSSOM returns the literal; toHex would silently
    // yield #000000) -- treat as unresolvable so the live read resolves it.
    const isUnresolvableColor = (raw) =>
      typeof raw === "string" && /var\\(|currentcolor|gradient\\(/i.test(raw);
    // Confidence gate on the color/border fields (these paint the CTA
    // downstream): if a :hover rule changes one of them but the value is
    // ambiguous or unresolvable, bail to the mouse read for the WHOLE record.
    // And if the matched :hover touches NONE of them, the CSSOM read tells us
    // nothing about the hover appearance (it may be a decoration/cursor-only
    // :hover masking a JS-toggled hover) -- defer to the mouse read too.
    const colorFieldProps = [
      ["background-color", "background"],
      ["color"],
      ["border-color", "border-top-color"],
      ["border-width", "border-top-width"],
    ];
    let changedTrackedField = false;
    for (const props of colorFieldProps) {
      let raw;
      for (const p of props) {
        const wv = winner(p);
        if (wv !== undefined) { raw = wv; break; }
      }
      if (raw === undefined) continue;
      changedTrackedField = true;
      if (raw === AMBIGUOUS) return null;
      if (props[0] !== "border-width" && isUnresolvableColor(raw)) return null;
    }
    if (!changedTrackedField) return null;
    const baseStyle = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const win = (prop) => {
      const v = winner(prop);
      return v === AMBIGUOUS ? undefined : v;
    };
    const pickColor = (raw, fallbackHex) => {
      if (!raw) return fallbackHex;
      const parsed = toHex(raw);
      return parsed === null ? fallbackHex : parsed;
    };
    // The measured-state twin of \`pickColor\`, branching identically (a hover
    // colour that resolves to no hex — unreadable OR transparent — falls back
    // to the base reading, exactly as the hex path already does), so the state
    // always describes the reading actually returned.
    const pickMeasure = (raw, fallbackMeasure) => {
      if (!raw) return fallbackMeasure;
      const parsed = measureColor(raw);
      return parsed.hex === null ? fallbackMeasure : parsed;
    };
    const pickRaw = (raw, fallback) =>
      raw === undefined || raw === null || raw === "" ? fallback : raw;
    const pickPx = (raw, fallback) => {
      if (raw === undefined || raw === null || raw === "") return fallback;
      const parsed = Number.parseFloat(raw);
      return Number.isFinite(parsed) ? parsed : fallback;
    };
    const baseBg = measureColor(baseStyle.backgroundColor);
    const baseFg = measureColor(baseStyle.color);
    const baseBorder = measureBorderColor(baseStyle);
    const baseBgHex = baseBg.hex;
    const baseFgHex = baseFg.hex;
    const baseBorderHex = baseBorder.hex;
    const hoverBgRaw = win("background-color") || win("background");
    const hoverColorRaw = win("color");
    const hoverBorderColorRaw = win("border-color") || win("border-top-color");
    const hoverBorderWidthRaw = win("border-width") || win("border-top-width");
    const overlay = {
      fontFamily: pickRaw(win("font-family"), baseStyle.fontFamily),
      fontWeight: pickRaw(win("font-weight"), baseStyle.fontWeight),
      fontSize: pickRaw(win("font-size"), baseStyle.fontSize),
      lineHeight: pickRaw(win("line-height"), baseStyle.lineHeight),
      letterSpacing: pickRaw(win("letter-spacing"), baseStyle.letterSpacing),
      fontStyle: pickRaw(win("font-style"), baseStyle.fontStyle),
      textTransform: pickRaw(win("text-transform"), baseStyle.textTransform),
    };
    return {
      backgroundColor: pickColor(hoverBgRaw, baseBgHex),
      fontColor: pickColor(hoverColorRaw, baseFgHex),
      borderColor: pickColor(hoverBorderColorRaw, baseBorderHex),
      borderWidth: pickPx(hoverBorderWidthRaw, Number.parseFloat(baseStyle.borderWidth) || 0),
      // Same measurement-state contract as \`readHoverStyleFor\`: this record is
      // slotted into \`row.cta.hover\` interchangeably with that one, and a
      // consumer must not have to know which reader produced it.
      backgroundColorState: pickMeasure(hoverBgRaw, baseBg).state,
      fontColorState: pickMeasure(hoverColorRaw, baseFg).state,
      borderColorState: pickMeasure(hoverBorderColorRaw, baseBorder).state,
      visibility: pickRaw(win("visibility"), baseStyle.visibility) || null,
      display: pickRaw(win("display"), baseStyle.display) || null,
      opacity: pickRaw(win("opacity"), baseStyle.opacity) || null,
      ...readTypographyStyle(overlay),
      // Layout fields -- :hover rarely changes width/height/padding via CSSOM
      // (transforms/scale don't show up here). Use the live rect and base.
      computedWidthPx: Number.isFinite(rect.width) ? rect.width : null,
      computedHeightPx: Number.isFinite(rect.height) ? rect.height : null,
      paddingTopPx: pickPx(win("padding-top"), Number.parseFloat(baseStyle.paddingTop) || 0),
      paddingRightPx: pickPx(win("padding-right"), Number.parseFloat(baseStyle.paddingRight) || 0),
      paddingBottomPx: pickPx(win("padding-bottom"), Number.parseFloat(baseStyle.paddingBottom) || 0),
      paddingLeftPx: pickPx(win("padding-left"), Number.parseFloat(baseStyle.paddingLeft) || 0),
      borderRadiusPx: pickPx(
        win("border-top-left-radius") || win("border-radius"),
        Number.parseFloat(baseStyle.borderTopLeftRadius) || 0,
      ),
    };
  };
  const readTypographyStyle = (style) => {
    if (!style) {
      return {
        fontFamily: null,
        fontWeight: null,
        fontSize: null,
        fontSizePx: null,
        lineHeight: null,
        lineHeightPx: null,
        letterSpacing: null,
        letterSpacingPx: null,
        fontStyle: null,
        textTransform: null,
      };
    }
    const fontSizePx = parsePxFromComputed(style.fontSize);
    return {
      fontFamily: style.fontFamily || null,
      fontWeight: normalizeFontWeight(style.fontWeight),
      fontSize: style.fontSize || null,
      fontSizePx,
      lineHeight: style.lineHeight || null,
      lineHeightPx: parseLineHeightPx(style, fontSizePx),
      letterSpacing: style.letterSpacing || null,
      letterSpacingPx: parsePxFromComputed(style.letterSpacing),
      fontStyle: style.fontStyle || null,
      textTransform: style.textTransform || null,
    };
  };
  const visibleRectFor = (element) => {
    if (!(element instanceof Element)) return null;
    const rect = element.getBoundingClientRect();
    return rect.width > 0 && rect.height > 0 ? rect : null;
  };
  const isVisibleElement = (element) => {
    if (!(element instanceof Element)) return false;
    const style = window.getComputedStyle(element);
    const rect = visibleRectFor(element);
    return (
      Boolean(rect) &&
      style.display !== "none" &&
      style.visibility !== "hidden" &&
      Number.parseFloat(style.opacity) !== 0
    );
  };
  const contentWidthFor = (element) => {
    if (!(element instanceof Element)) return null;
    const rect = visibleRectFor(element);
    if (!rect) return null;
    const style = window.getComputedStyle(element);
    const paddingLeft = Number.parseFloat(style.paddingLeft) || 0;
    const paddingRight = Number.parseFloat(style.paddingRight) || 0;
    return Math.max(0, rect.width - paddingLeft - paddingRight);
  };
  const measureTextWidthPx = (text, elementOrStyle) => {
    const normalizedText = normalizeWhitespace(text);
    if (!normalizedText || !textMeasureContext) return null;
    const style =
      elementOrStyle instanceof CSSStyleDeclaration
        ? elementOrStyle
        : elementOrStyle instanceof Element
          ? window.getComputedStyle(elementOrStyle)
          : null;
    if (!style) return null;
    const fontStyle = style.fontStyle || "normal";
    const fontVariant = style.fontVariant || "normal";
    const fontWeight = style.fontWeight || "400";
    const fontSize = style.fontSize || "16px";
    const fontFamily = style.fontFamily || "sans-serif";
    textMeasureContext.font = [fontStyle, fontVariant, fontWeight, fontSize, fontFamily].join(" ");
    const baseWidth = textMeasureContext.measureText(normalizedText).width;
    const letterSpacing = Number.parseFloat(style.letterSpacing);
    const spacingWidth =
      Number.isFinite(letterSpacing) && normalizedText.length > 1 ? letterSpacing * (normalizedText.length - 1) : 0;
    return baseWidth + Math.max(0, spacingWidth);
  };
  const hasVisuallyUsableLabel = (element, label) => {
    if (!(element instanceof Element)) return false;
    if (!label?.hasUsableVisibleText) return false;
    const labelText = normalizeWhitespace(label.text || "");
    if (!labelText) return false;
    const style = window.getComputedStyle(element);
    const extent = label.extentPx;
    if (extent?.widthPx === 0 || extent?.heightPx === 0) return false;
    // A positive text-node Range survives normal/zero line boxes and a
    // zero-font parent with a sized descendant. Unknown extent uses the
    // control font as fallback; zero geometry never becomes usable text.
    const hasPositiveExtent = extent?.widthPx > 0 && extent?.heightPx > 0;
    if (!hasPositiveExtent && !(Number.parseFloat(style.fontSize) > 0)) return false;
    const rect = visibleRectFor(element);
    const contentWidth = contentWidthFor(element);
    const measuredWidth = measureTextWidthPx(labelText, style);
    if (!rect || !Number.isFinite(contentWidth) || contentWidth <= 0 || !Number.isFinite(measuredWidth)) {
      return true;
    }
    // An auto-width control legitimately fits its text exactly. Reserve no
    // arbitrary percentage of its content box. Range geometry uses the actual
    // descendant font where a single text fragment is available; canvas is
    // the existing fallback for inputs or composite labels. One CSS pixel
    // covers subpixel layout rounding, not an allowance for clipped labels.
    const rangeWidth = label.fragmentCount === 1 ? label.extentPx?.widthPx : null;
    const labelWidth = Number.isFinite(rangeWidth) ? rangeWidth : measuredWidth;
    const borderWidth = (Number.parseFloat(style.borderLeftWidth) || 0) +
      (Number.parseFloat(style.borderRightWidth) || 0);
    return labelWidth <= Math.max(0, contentWidth - borderWidth) + 1;
  };
  // Containers whose text is never a label: hidden from every reader, or not
  // prose at all. Shared by the label recovery and the extent measurement so
  // the two walk the same text nodes.
  const NON_LABEL_TEXT_CONTAINER_SELECTOR =
    "[hidden], [aria-hidden='true'], script, style, noscript, svg, symbol, defs";
  const isSuppressedTextContainer = (element) => {
    if (!(element instanceof Element)) return true;
    if (element.closest(NON_LABEL_TEXT_CONTAINER_SELECTOR)) {
      return true;
    }
    return !isVisibleElement(element);
  };
  // Text-node Range geometry for a control's label (not visible-ink bounds),
  // read with Range.getBoundingClientRect(), as the largest width and height
  // across them; null when there is no text node to measure (an aria-label /
  // title label). Zero on either axis is empty text-node geometry. Positive
  // geometry does not establish visibility through clipping or hidden styles.
  // This is measured on text nodes and not read off the control's
  // CSS, because the two disagree in both directions: \`line-height: 0\` sizes
  // the line box and Chromium still paints the 17px glyph run over it, and
  // \`font-size\` on the control says nothing about a descendant that holds the
  // text at its own size (0px on a 14px child, or 14px on a 0px child).
  //
  // The walk excludes the same non-label containers the recovery excludes,
  // but NOT containers with no box: a text node whose container has no box is
  // exactly the zero extent this measures, and dropping it would turn "the
  // glyphs have no box" into "no text node to measure" — an unmeasured extent
  // manufactured out of a measured one.
  const measureLabelExtentPx = (element) => {
    if (!(element instanceof Element)) return null;
    let widthPx = null;
    let heightPx = null;
    const range = document.createRange();
    const walker = document.createTreeWalker(element, window.NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const text = normalizeWhitespace(node.textContent || "");
        const parent = node.parentElement;
        if (!text || !(parent instanceof Element) || parent.closest(NON_LABEL_TEXT_CONTAINER_SELECTOR)) {
          return window.NodeFilter.FILTER_REJECT;
        }
        return window.NodeFilter.FILTER_ACCEPT;
      },
    });
    while (walker.nextNode()) {
      range.selectNodeContents(walker.currentNode);
      const rect = range.getBoundingClientRect();
      const width = Number.isFinite(rect.width) ? rect.width : 0;
      const height = Number.isFinite(rect.height) ? rect.height : 0;
      widthPx = widthPx === null ? width : Math.max(widthPx, width);
      heightPx = heightPx === null ? height : Math.max(heightPx, height);
    }
    return widthPx === null ? null : { widthPx, heightPx };
  };
  const depthFrom = (root, node) => {
    let depth = 0;
    let current = node;
    while (current && current !== root) {
      current = current.parentElement;
      depth += 1;
    }
    return depth;
  };
  const recoverVisibleLabel = (element) => {
    if (!(element instanceof Element)) {
      return {
        text: "",
        source: "none",
        hasUsableVisibleText: false,
        recoveredFromDescendant: false,
        fragmentCount: 0,
      };
    }
    const directText = normalizeWhitespace(
      element instanceof HTMLInputElement
        ? element.value || element.getAttribute("value") || ""
        : element.innerText || element.textContent || ""
    );
    const fragments = [];
    const seen = new Set();
    const walker = document.createTreeWalker(element, window.NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const text = normalizeWhitespace(node.textContent || "");
        const parent = node.parentElement;
        if (!text || !(parent instanceof Element) || isSuppressedTextContainer(parent)) {
          return window.NodeFilter.FILTER_REJECT;
        }
        return window.NodeFilter.FILTER_ACCEPT;
      },
    });
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const parent = node.parentElement;
      const text = normalizeWhitespace(node.textContent || "");
      if (!(parent instanceof Element) || !text) {
        continue;
      }
      const dedupeKey = \`\${text}::\${parent.tagName.toLowerCase()}::\${depthFrom(element, parent)}\`;
      if (seen.has(dedupeKey)) {
        continue;
      }
      seen.add(dedupeKey);
      const style = window.getComputedStyle(parent);
      const fontSizePx = Number.parseFloat(style.fontSize) || 0;
      fragments.push({
        text,
        sourceTag: parent.tagName.toLowerCase(),
        fontSizePx,
        depth: depthFrom(element, parent),
        score: Math.min(text.length, 80) + fontSizePx / 4,
      });
    }
    fragments.sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      return left.depth - right.depth;
    });
    const bestVisible = fragments[0] || null;
    const ariaLabel = normalizeWhitespace(element.getAttribute("aria-label") || "");
    const title = normalizeWhitespace(element.getAttribute("title") || "");
    const fallbackText = bestVisible?.text || directText || ariaLabel || title || "";
    let source = "none";
    let hasUsableVisibleText = false;
    let recoveredFromDescendant = false;
    if (bestVisible?.text) {
      source = bestVisible.depth > 0 ? "descendant-visible-text" : "self-visible-text";
      hasUsableVisibleText = true;
      recoveredFromDescendant = bestVisible.depth > 0;
    } else if (directText) {
      source = element instanceof HTMLInputElement ? "input-value" : "inner-text";
      hasUsableVisibleText = true;
    } else if (ariaLabel) {
      source = "aria-label";
    } else if (title) {
      source = "title";
    }
    return {
      text: fallbackText,
      source,
      hasUsableVisibleText,
      recoveredFromDescendant,
      fragmentCount: fragments.length,
      // The glyph box of the label, measured beside its text so a consumer
      // never has to re-walk the element to learn whether the text it was
      // handed paints anything.
      extentPx: measureLabelExtentPx(element),
    };
  };
  const HEURISTIC_CTA_INTERACTIVE_SELECTOR =
    "button, a[href], [role='button'], input[type='button'], input[type='submit'], input[type='reset']";
  const HEURISTIC_NON_PURCHASE_CTA_PATTERN =
    /(compare|comparison|wishlist|favorite|favo?urite|bookmark|порівнян|сравнен|обран|улюблен|избран)/i;
  // Score every visible CTA-shaped element within a card and return them sorted
  // descending. Used by:
  //   - findHeuristicCtaWithinCard (single best, default-state CTA discovery)
  //   - captureProductCardCtaHoverStates' alt-CTA discovery path (after card hover)
  // Reasons are recorded for downstream diagnostics so an operator can audit why
  // a particular element won.
  const scoreAllCtaCandidatesWithinCard = (card, textHint) => {
    if (!(card instanceof Element)) return [];
    const hint = normalizeWhitespace(textHint || "").toLowerCase();
    return [card, ...card.querySelectorAll(HEURISTIC_CTA_INTERACTIVE_SELECTOR)]
      .filter(isVisibleElement)
      .map((element) => {
        const label = recoverVisibleLabel(element);
        const meta = [
          label.text,
          element.getAttribute("aria-label") || "",
          element.getAttribute("title") || "",
          element.getAttribute("class") || "",
          element.getAttribute("id") || "",
        ].join(" ");
        const reasons = [];
        let score = 0;
        if (element.matches(HEURISTIC_CTA_INTERACTIVE_SELECTOR)) {
          score += 6;
          reasons.push({ source: "interactive-selector", delta: 6 });
        }
        if (label.hasUsableVisibleText) {
          score += 2;
          reasons.push({ source: "visible-text", delta: 2 });
        }
        if (matchesPurchaseCta(meta)) {
          score += 4;
          reasons.push({ source: "purchase-keyword", delta: 4 });
        }
        if (HEURISTIC_NON_PURCHASE_CTA_PATTERN.test(meta)) {
          score -= 8;
          reasons.push({ source: "non-purchase-pattern", delta: -8 });
        }
        if (hint && label.text && normalizeWhitespace(label.text).toLowerCase() === hint) {
          score += 6;
          reasons.push({ source: "hint-match", delta: 6 });
        }
        return { element, score, reasons };
      })
      .filter((entry) => entry.score > 0)
      .sort((left, right) => right.score - left.score);
  };
  const findHeuristicCtaWithinCard = (card, textHint) =>
    scoreAllCtaCandidatesWithinCard(card, textHint)[0]?.element || null;
  // Shared bounded decorative-glyph measurement for buttons and product CTAs.
  // No element/reader means unknown; a measured text-only control means false.
  // This does not infer pseudo-element, canvas, shadow-DOM or clipped paint.
  const measureCtaHasInlineIcon = (element, hasUsableVisibleText) => {
    if (!(element instanceof Element) || typeof hasUsableVisibleText !== "boolean") return null;
    if (!hasUsableVisibleText) return false;
    return [...element.querySelectorAll('img, svg, [class*="icon"]')].some((child) => {
      if (!isVisibleElement(child) || !child.checkVisibility({opacityProperty:true, visibilityProperty:true, contentVisibilityAuto:true})) return false;
      const rect = child.getBoundingClientRect();
      return rect.width > 4 && rect.height > 4;
    });
  };
  const intentFor = ({ isFullWidth, ratio, cssWidth, display }) => {
    if (isFullWidth) return "full-width";
    if (ratio === null) return "unknown";
    if (
      cssWidth &&
      cssWidth !== "auto" &&
      cssWidth.endsWith("px") &&
      !["inline", "inline-block"].includes(display)
    ) {
      return "fixed-width";
    }
    return "content-sized";
  };
  const productCardLayoutEvidenceFor = (target, parentOverride = null) => {
    const style = window.getComputedStyle(target);
    const rect = target.getBoundingClientRect();
    const parent =
      parentOverride || (target.parentElement && isVisibleElement(target.parentElement) ? target.parentElement : null);
    const parentWidth = contentWidthFor(parent);
    const computedWidth = (Number.isFinite(rect.width) ? rect.width : null);
    const computedHeight = (Number.isFinite(rect.height) ? rect.height : null);
    const ratio = parentWidth && computedWidth !== null ? computedWidth / parentWidth : null;
    const classList = [...target.classList];
    const hintSource = [target.id || "", ...classList].join(" ");
    const cssWidth = target.style.width || style.width || "";
    const lineHeight = Number.parseFloat(style.lineHeight);
    const marginLeft = Number.parseFloat(style.marginLeft);
    const marginRight = Number.parseFloat(style.marginRight);
    const isFullWidth = Boolean(
      (ratio !== null && ratio >= 0.85) ||
        (["block", "flex", "grid"].includes(style.display) && ratio !== null && ratio >= 0.8),
    );
    return {
      intent: intentFor({
        isFullWidth,
        ratio,
        cssWidth,
        display: style.display,
      }),
      isFullWidth,
      computedWidthPx: computedWidth,
      computedHeightPx: computedHeight,
      parentWidthPx: parentWidth,
      widthRatioToParent: ratio === null ? null : Number(ratio.toFixed(4)),
      display: style.display,
      cssWidth,
      cssMinWidth: style.minWidth || "",
      cssMaxWidth: style.maxWidth || "",
      boxSizing: style.boxSizing,
      lineHeightPx: Number.isFinite(lineHeight) ? lineHeight : null,
      alignSelf: style.alignSelf,
      justifyContent: style.justifyContent,
      marginLeftPx: Number.isFinite(marginLeft) ? marginLeft : null,
      marginRightPx: Number.isFinite(marginRight) ? marginRight : null,
      classList,
      id: target.id || "",
      classHintMatched: /(full-width|fullwidth|w-full|block|wide|add-to-cart--full)/i.test(hintSource),
    };
  };
  window.__brandkitProbeHelpers = {
    productCardLayoutEvidenceFor,
    measureCtaHasInlineIcon,
    contentWidthFor,
    findHeuristicCtaWithinCard,
    scoreAllCtaCandidatesWithinCard,
    hasVisuallyUsableLabel,
    measureTextWidthPx,
    normalizeSelectorList,
    normalizeWhitespace,
    // Exposed for lib/salient-text.js, whose selector-free walk needs the
    // SAME suppression rule the label recovery uses. Its own filter caught
    // script/style/noscript but not aria-hidden='true' or svg text, both of
    // which render and would have read as the page's most prominent text.
    // NOTE: this whole object lives inside a template literal -- no backticks.
    isSuppressedTextContainer,
    matchesPurchaseCta,
    currencyTokenSource,
    priceTextPatternSource,
    isVisibleElement,
    recoverVisibleLabel,
    toHex,
    measureColor,
    measureBorderColor,
    parseColorWithAlpha,
    normalizeFontWeight,
    parsePxFromComputed,
    parseLineHeightPx,
    pickBorderColor,
    parseGradient,
    readHoverStyleFor,
    readHoverStyleFromCssRules,
    readTypographyStyle,
  };
})();
`;

function resolvePath(value) {
  return value ? path.resolve(value) : "";
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function normalizeSelectorList(value) {
  const rawSelectors = Array.isArray(value)
    ? value
    : (typeof value === "string" ? [value] : []);
  return rawSelectors
    .filter((selector) => typeof selector === "string")
    .map((selector) => selector.trim())
    .filter(Boolean);
}

function normalize(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function safeParseUrl(value, base = "") {
  try {
    return new URL(value, base || undefined);
  } catch {
    return null;
  }
}

function normalizeUrl(value, base = "") {
  return safeParseUrl(value, base)?.toString() || "";
}

function contentTypeFromHeaders(headers) {
  if (!headers || typeof headers !== "object") {
    return "";
  }
  const value = headers["content-type"] || headers["Content-Type"] || "";
  return typeof value === "string" ? value.split(";")[0].trim().toLowerCase() : "";
}

function dedupeByKey(items, keyFor) {
  const seen = new Set();
  return items.filter((item) => {
    const key = keyFor(item);
    if (!key || seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

function parseSizesToken(value) {
  const normalized = String(value || "").trim().toLowerCase();
  if (!normalized || normalized === "any") {
    return [];
  }
  return normalized
    .split(/\s+/)
    .map((token) => token.match(/^(\d+)x(\d+)$/))
    .filter(Boolean)
    .map((match) => Math.max(Number.parseInt(match[1], 10), Number.parseInt(match[2], 10)))
    .filter((size) => Number.isInteger(size) && size > 0)
    .sort((left, right) => right - left);
}

function parseFaviconEntry(entry) {
  const href = normalizeUrl(entry.href || "");
  const sizeHintsPx = parseSizesToken(entry.sizes);
  return {
    rel: entry.rel || "",
    href,
    type: entry.type || "",
    sizes: entry.sizes || "",
    sizeHintsPx,
    largestSizePx: sizeHintsPx[0] || null,
    isMaskIcon: /(?:^|\s)mask-icon(?:\s|$)/i.test(entry.rel || ""),
  };
}

function parseManifestIconEntry(icon, manifestUrl) {
  const src = normalizeUrl(icon?.src || "", manifestUrl);
  const sizeHintsPx = parseSizesToken(icon?.sizes || "");
  return {
    src,
    type: typeof icon?.type === "string" ? icon.type : "",
    purpose: typeof icon?.purpose === "string" ? icon.purpose : "",
    sizes: typeof icon?.sizes === "string" ? icon.sizes : "",
    sizeHintsPx,
    largestSizePx: sizeHintsPx[0] || null,
  };
}

function classifyObservedRequest(record, pageUrl) {
  const parsed = safeParseUrl(record?.url || "");
  const page = safeParseUrl(pageUrl);
  if (!parsed || !page || parsed.origin !== page.origin) {
    return null;
  }

  const pathname = `${parsed.pathname || ""}${parsed.search || ""}`;
  const resourceType = String(record.resourceType || "").toLowerCase();
  const contentType = String(record.contentType || "").toLowerCase();

  // A NAVIGATION IS A PAGE, whatever its path spells, and that is why this
  // test comes first. `DATA_HINT_PATTERN` is a guess about a URL; a
  // `document` resourceType is the browser telling us it navigated a frame
  // there. Read in the other order, an ordinary storefront landing on
  // `/collections/all` (Shopify's own default), `/catalog/`, `/category/…`,
  // `/products`, `/menu`, `/offers`, `/feedback` ("feed"), or on `/` with
  // `?utm_campaign=promo`, was filed as `data` — so the `page` bucket held no
  // landed document and `detectLandedDocumentError` FAILED OPEN on it:
  // silent on 17 of 28 ordinary landed URLs, and a mistyped storefront URL is
  // more likely than not to contain one of those words. Invisible to the
  // archive: none of the 99 captured runs has a hint word in its landed URL,
  // and none of their 144 document records has one either, so not a single
  // archived record changes bucket under this reordering.
  //
  // Only the resourceType moves. A `text/html` body someone FETCHED at
  // `/api/...` is still data; it is not a navigation and it cannot be the
  // landed page.
  if (resourceType === "document") {
    return "page";
  }
  if (
    resourceType === "xhr" ||
    resourceType === "fetch" ||
    contentType.includes("json") ||
    contentType.includes("graphql") ||
    pathname.endsWith(".json") ||
    DATA_HINT_PATTERN.test(pathname)
  ) {
    return "data";
  }
  if (contentType.includes("text/html") || contentType.includes("application/xhtml+xml")) {
    return "page";
  }
  if (
    resourceType === "image" ||
    resourceType === "media" ||
    contentType.startsWith("image/") ||
    contentType.startsWith("video/") ||
    contentType.startsWith("audio/")
  ) {
    return "media";
  }
  if (
    resourceType === "script" ||
    resourceType === "stylesheet" ||
    resourceType === "font" ||
    contentType.includes("javascript") ||
    contentType.includes("css") ||
    contentType.startsWith("font/") ||
    STATIC_ASSET_PATH_PATTERN.test(pathname)
  ) {
    return "asset";
  }
  return "other";
}

function dataCandidateScore(record) {
  const parsed = safeParseUrl(record?.url || "");
  if (!parsed) {
    return 0;
  }
  const pathWithQuery = `${parsed.pathname || ""}${parsed.search || ""}`;
  const contentType = String(record?.contentType || "").toLowerCase();
  const resourceType = String(record?.resourceType || "").toLowerCase();
  let score = 0;
  if (resourceType === "xhr" || resourceType === "fetch") score += 3;
  if (contentType.includes("json")) score += 4;
  if (contentType.includes("graphql")) score += 4;
  if (contentType.includes("text/html")) score += 2;
  if (pathWithQuery.endsWith(".json")) score += 3;
  if (DATA_HINT_PATTERN.test(pathWithQuery)) score += 4;
  if (STATIC_ASSET_PATH_PATTERN.test(pathWithQuery)) score -= 4;
  if (Number(record?.status) >= 400) score -= 2;
  return score;
}

function dataCandidateReasonTags(record) {
  const parsed = safeParseUrl(record?.url || "");
  const pathWithQuery = parsed ? `${parsed.pathname || ""}${parsed.search || ""}` : "";
  const contentType = String(record?.contentType || "").toLowerCase();
  const resourceType = String(record?.resourceType || "").toLowerCase();
  const reasons = new Set();
  if (resourceType === "xhr" || resourceType === "fetch") reasons.add(resourceType);
  if (contentType.includes("json")) reasons.add("json");
  if (contentType.includes("graphql") || /graphql/i.test(pathWithQuery)) reasons.add("graphql");
  if (contentType.includes("text/html")) reasons.add("html-fragment");
  if (/product|products/i.test(pathWithQuery)) reasons.add("product");
  if (/catalog|category|collection|listing|grid/i.test(pathWithQuery)) reasons.add("catalog");
  if (/home|widget|block|banner|promo|carousel|recommend|feed|offer|deal/i.test(pathWithQuery)) {
    reasons.add("homepage");
  }
  return [...reasons];
}

function isBlockedIpv4(hostname) {
  const octets = hostname.split(".").map((part) => Number.parseInt(part, 10));
  if (octets.length !== 4 || octets.some((value) => !Number.isInteger(value) || value < 0 || value > 255)) {
    return false;
  }

  const [first, second] = octets;
  if (first === 0 || first === 10 || first === 127) {
    return true;
  }
  if (first === 169 && second === 254) {
    return true;
  }
  if (first === 172 && second >= 16 && second <= 31) {
    return true;
  }
  if (first === 192 && second === 0) {
    return true;
  }
  if (first === 192 && second === 0 && octets[2] === 2) {
    return true;
  }
  if (first === 192 && second === 168) {
    return true;
  }
  if (first === 198 && (second === 18 || second === 19)) {
    return true;
  }
  if (first === 198 && second === 51 && octets[2] === 100) {
    return true;
  }
  if (first === 203 && second === 0 && octets[2] === 113) {
    return true;
  }
  if (first === 100 && second >= 64 && second <= 127) {
    return true;
  }
  if (first >= 224) {
    return true;
  }
  return false;
}

function isBlockedIpv6(hostname) {
  const normalized = hostname.toLowerCase().split("%", 1)[0];

  const parseIpv4 = (value) => {
    const octets = value.split(".").map((part) => Number.parseInt(part, 10));
    if (octets.length !== 4 || octets.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) {
      return null;
    }
    return octets;
  };

  const parseIpv6Hextets = (value) => {
    const ipv4Index = value.lastIndexOf(".");
    let suffixHextets = [];
    let working = value;
    if (ipv4Index !== -1) {
      const lastColon = value.lastIndexOf(":");
      if (lastColon === -1) return null;
      const ipv4Octets = parseIpv4(value.slice(lastColon + 1));
      if (!ipv4Octets) return null;
      suffixHextets = [
        ((ipv4Octets[0] << 8) | ipv4Octets[1]).toString(16),
        ((ipv4Octets[2] << 8) | ipv4Octets[3]).toString(16),
      ];
      working = value.slice(0, lastColon);
    }

    const hasCompression = working.includes("::");
    const pieces = working.split("::");
    if (pieces.length > 2) return null;
    const left = pieces[0] ? pieces[0].split(":").filter(Boolean) : [];
    const right = pieces.length === 2 && pieces[1] ? pieces[1].split(":").filter(Boolean) : [];
    const totalHextets = left.length + right.length + suffixHextets.length;
    if ((!hasCompression && totalHextets !== 8) || totalHextets > 8) {
      return null;
    }
    const missing = hasCompression ? 8 - totalHextets : 0;
    const hextets = [
      ...left,
      ...Array.from({ length: missing }, () => "0"),
      ...right,
      ...suffixHextets,
    ];
    if (hextets.length !== 8) return null;
    const parsed = hextets.map((part) => Number.parseInt(part, 16));
    if (parsed.some((part) => !Number.isInteger(part) || part < 0 || part > 0xffff)) {
      return null;
    }
    return parsed;
  };

  const hextets = parseIpv6Hextets(normalized);
  if (!hextets) {
    return true;
  }

  const isAllZero = hextets.every((part) => part === 0);
  if (isAllZero) return true;
  if (hextets.slice(0, 7).every((part) => part === 0) && hextets[7] === 1) return true;

  const isIpv4Mapped =
    hextets[0] === 0 &&
    hextets[1] === 0 &&
    hextets[2] === 0 &&
    hextets[3] === 0 &&
    hextets[4] === 0 &&
    hextets[5] === 0xffff;
  if (isIpv4Mapped) {
    const mappedIpv4 = [
      (hextets[6] >> 8) & 0xff,
      hextets[6] & 0xff,
      (hextets[7] >> 8) & 0xff,
      hextets[7] & 0xff,
    ].join(".");
    return isBlockedIpv4(mappedIpv4);
  }

  const first = hextets[0];
  const second = hextets[1];

  if ((first & 0xfe00) === 0xfc00) return true; // fc00::/7 unique local
  if ((first & 0xffc0) === 0xfe80) return true; // fe80::/10 link-local
  if ((first & 0xffc0) === 0xfec0) return true; // fec0::/10 deprecated site-local
  if ((first & 0xff00) === 0xff00) return true; // ff00::/8 multicast
  if (first === 0x2001 && second === 0x0db8) return true; // 2001:db8::/32 documentation
  if (first === 0x2001 && (second & 0xfff0) === 0x0010) return true; // 2001:10::/28 orchid
  return false;
}

// Wildcard-DNS services (a name that resolves to the address written in it),
// and the OOB-interaction domains whose whole product is "resolve this to
// whatever I want". They are on this list for two different reasons:
//
//   * a STATIC alias carries no address in the name at all — `localtest.me`
//     and `lvh.me` are plain A records for 127.0.0.1, so the window scan below
//     has nothing to find;
//   * these services also answer hex/dword/dashed spellings
//     (`0x7f000001.nip.io`, `127-0-0-1.nip.io`), and a suffix match covers
//     every such spelling at once without teaching the scanner to be clever
//     about them.
//
// Matched on LABEL BOUNDARIES, not as bare string suffixes: `evil-lvh.me` is
// somebody else's domain and `"evil-lvh.me".endsWith("lvh.me")` is true.
const REBINDING_HOST_SUFFIXES = [
  "nip.io",
  "sslip.io",
  "xip.io",
  "xip.name",
  "traefik.me",
  "localtest.me",
  "lvh.me",
  "vcap.me",
  "1u.ms",
  "burpcollaborator.net",
  "oastify.com",
  "interact.sh",
];

// True when the NAME ITSELF spells an address in blocked space, with no
// resolution of any kind. See the "SYNTACTIC SCREEN" section of the block
// comment on `shouldBlockExternalRequest` for what this is and is not for.
//
// Two shapes, both deliberate:
//
// 1. A window of EXACTLY FOUR consecutive dot-labels, decoded by handing it
//    back to `new URL()`. Reusing the WHATWG parser is the point: it is
//    already the octal/hex/dword/short-form decoder (`0177.0.0.1`,
//    `0x7f000001`, `2130706433`, `127.1` all normalize to `127.0.0.1`), so
//    there is no second, hand-rolled IPv4 parser here to disagree with the one
//    the browser will use.
//
//    THE WINDOW WIDTH IS LOAD-BEARING, and so is checking blocked space only.
//    Both were measured, not reasoned about:
//      * a per-label scan blocks `3.basecamp.com` — label `3` decodes to
//        `0.0.0.3`, and `0.0.0.0/8` is blocked space;
//      * blocked-space-only is what keeps public-IP-shaped names like
//        `1.0.0.1.example.com`, `8.8.8.8.example.com` and reverse-DNS-style
//        provider names (`88-99-100-101.static.example`) working.
//    Do not "simplify" either into something broader.
//
// 2. A label whose dashes become dots and yields exactly four groups
//    (`10-0-0-1.attacker.com`), decoded the same way. EVERY label, not just
//    the leftmost: a leftmost-only scan is defeated by prepending one label
//    (`foo.10-0-0-1.attacker.com`), and scanning them all costs no false
//    positives — a name that really encodes a host's own address encodes a
//    PUBLIC one, which rule (1)'s blocked-space test lets through anyway.
//
// A parse failure is NOT a block: `new URL("http://eu.central.1/")` throws
// because the WHATWG parser tries IPv4 on any host ending in a number, and
// `123.456.789.012` throws for the same reason. Neither is an address.
function hostnameEncodesBlockedAddress(hostname) {
  for (const suffix of REBINDING_HOST_SUFFIXES) {
    if (hostname === suffix || hostname.endsWith(`.${suffix}`)) {
      return true;
    }
  }

  const decodesToBlockedIpv4 = (candidate) => {
    let decoded;
    try {
      decoded = new URL(`http://${candidate}/`).hostname;
    } catch {
      return false;
    }
    return net.isIP(decoded) === 4 && isBlockedIpv4(decoded);
  };

  const labels = hostname.split(".");
  for (let start = 0; start + 4 <= labels.length; start += 1) {
    if (decodesToBlockedIpv4(labels.slice(start, start + 4).join("."))) {
      return true;
    }
  }
  for (const label of labels) {
    const groups = label.split("-");
    if (groups.length === 4 && decodesToBlockedIpv4(groups.join("."))) {
      return true;
    }
  }
  return false;
}

// Schemes that reach `context.route` but name nothing outside the browser:
// `data:` and `blob:` are bytes the PAGE ITSELF already holds, and
// `chrome-extension:` is a resource of an installed extension. None can carry
// network egress and none can name a path on the worker filesystem, so none
// is an "external request" in this function's sense. The list is MEASURED,
// not guessed — see the note on the scheme gate below — and the bar for
// adding to it is exactly that pair of properties: no egress, no filesystem.
const NON_EGRESS_REQUEST_SCHEMES = new Set(["data:", "blob:", "chrome-extension:"]);

// True = BLOCK. It reads as an allowlist and it now behaves like one:
// a scheme this function cannot positively vet is blocked.
//
// FAIL CLOSED ON THE SCHEME. Both branches below used to `return false`
// (= ALLOW), which made every non-http(s) URL invisible to the guard. That
// matters at the `context.route("**/*")` caller in `openPage`, which is the
// only thing standing between a page-chosen URL and the browser. What
// actually reaches `route` was verified against real Chromium rather than
// reasoned about:
//
//   * page SUBRESOURCES are routed only over http(s) — `data:`/`blob:` images
//     decode without being routed at all, and Chromium refuses a `file:`
//     subresource of an http page outright;
//   * a TOP-LEVEL navigation to `file:` IS routed — and `fetchSvgViaBrowser`
//     opens exactly such a navigation, on a URL the PAGE supplied. So the old
//     `false` waved through the one non-http(s) case that can actually occur,
//     and the one that reads a local file;
//   * `chrome-extension:` IS routed. A blanket `return true` here therefore
//     aborts an injected extension's own resource loads — measured, with a
//     loaded extension: its `<img>` went from `naturalWidth` 150 to 0 and its
//     `fetch()` of its own asset returned nothing. Browserbase's captcha
//     solver is injected machinery on precisely the path this file already
//     babysits (`browserbase-solving-started` / `-finished`), so blocking it
//     would be a silent, hard-to-diagnose production failure. Hence the
//     carve-out above rather than a bare `return true`.
//
// `file:` is deliberately NOT carved out: it is the one non-egress scheme
// that can still name the worker filesystem, which is the whole point.
//
// Neither caller can present a non-http(s) URL by any other route in
// production: `fetchManifests` reaches this only after an origin-equality
// check against an http(s) page URL, and Playwright always hands `route` an
// absolute URL, so the unparseable branch is unreachable there.
//
// NO RESOLVER. This filter is a STATIC, resolver-free pre-screen: its verdict
// is a pure function of the URL string. It deliberately does NOT resolve the
// hostname to decide.
//
// This used to end in a DNS lookup that blocked any hostname resolving to a
// private address — and whose `catch` blocked on lookup failure. That guard was
// vendored from brandkit-agent, where it ran in a pod that HAD egress and DNS.
// Here it cannot work: the publisher-runtime container sits on an
// `internal=True` Docker network and is explicitly barred from the egress
// network (`publisher_runtime_manager.py`), so EXTERNAL DNS DOES NOT RESOLVE —
// `dns.lookup("acme.example")` raises EAI_AGAIN. Every external hostname therefore
// read as "blocked", the `context.route("**/*")` filter below aborted the
// top-level navigation, and Chromium reported ERR_BLOCKED_BY_CLIENT. It never
// worked in this repo — the network isolation predates the vendoring — so the
// lookup bought nothing but a universal outage.
//
// (Note the "external" in "no external DNS": Docker's embedded resolver still
// answers CONTAINER names. That is why the Browserbase mint's `fetch` to
// `PUBLISHER_PROXY_BASE_URL` and the proxy CONNECT dial both work. Those are
// correct and unrelated.)
//
// The egress controls it appeared to provide live — and always lived — in
// `browser_proxy.py`, which every request must transit, and which is strictly
// stronger than what was removed:
//
//   * a per-session HOST ALLOWLIST (`is_connect_allowed`), which this filter
//     never had at all;
//   * a PUBLIC-IP check on every resolved address (`is_public_ip_address`),
//     rejecting loopback/link-local/private/reserved/multicast;
//   * a DNS-REBINDING defence this filter structurally could not offer: the
//     proxy dials `targets[0].ip` — the address it just vetted — instead of
//     re-resolving the hostname, so there is no window between check and
//     connect. Checking here and connecting there is exactly the TOCTOU gap
//     the removed code could not close.
//
// CONSEQUENCE — THE NO-DOT RULE BELOW IS NOW LOAD-BEARING. With resolution
// gone, `!hostname.includes(".")` is the only thing that rejects single-label
// names, and those are precisely the names Docker's embedded resolver DOES
// answer: `reteno-publisher-proxy-11`, `metadata`, sibling containers on the
// bridge. Previously it was a cheap shortcut in front of a lookup that would
// have caught them anyway. It is now the check itself. Deleting it — or
// "simplifying" it into the dotted path — opens a real hole to the internal
// network. Do not.
//
// ---------------------------------------------------------------------
// THE SYNTACTIC SCREEN, AND EXACTLY HOW FAR IT GOES
// ---------------------------------------------------------------------
//
// `hostnameEncodesBlockedAddress` above is a STATIC screen: no resolver, no
// I/O, no clock. That is not a limitation to work around, it is the property
// that makes it shippable here — it CANNOT fail the way the removed lookup
// failed, because there is nothing for it to fail at. Its verdict is the same
// inside the runtime's `internal=True` network as it is anywhere else, so it
// has no failure mode in EITHER browser mode.
//
// It exists because the removed lookup was not equally redundant in both
// modes:
//
//   * LOCAL-CHROMIUM MODE — redundant. Every request transits
//     `browser_proxy.py`, which is CONNECT-only, 443-only, host-allowlisted
//     per session, checks the RESOLVED address, and dials that address rather
//     than re-resolving. Nothing this function decides can loosen that.
//   * BROWSERBASE MODE — NOT redundant. The remote browser owns its own
//     egress; our proxy is not in the path at all. There, this
//     `context.route("**/*")` filter is the only control on the wire, and with
//     the lookup gone `127.0.0.1.nip.io` was simply allowed. Measured against
//     real Chromium with `--host-resolver-rules` and no proxy: the request
//     reached a loopback server.
//
// WHAT IT REMOVES: every publicly-documented turnkey shape — the wildcard-DNS
// services (nip.io & friends), the static loopback aliases (localtest.me,
// lvh.me), an address embedded in a name (`169.254.169.254.evil.example`),
// its dashed spelling (`10-0-0-1.attacker.com`), and — via `new URL()` — the
// whole octal/hex/dword/short-form family of IP literals.
//
// WHAT IT DOES NOT REMOVE, AND CANNOT: `evil.example.com` with an A record
// pointing into private space. No string check reaches that, this one
// included; the name carries no evidence of where it resolves. This screen is
// therefore DELIBERATELY PARTIAL. Do not read it, or describe it, as an SSRF
// boundary.
//
// THE HUMAN-APPROVAL BOUNDARY, which is a DIFFERENT control and now exists:
// publisher-proxy returns the thread's `allowed_hosts` on the mint response and
// `openPage` enforces them on primary-main-frame navigations
// (`isNavigationWithinAllowedHosts` below). Read what that is and is not at its
// own comment — in particular it is NOT the missing SSRF control, because the
// residual is exploited by a subresource `fetch()`, which it deliberately
// leaves to this screen.
//
// The earlier version of this paragraph also proposed extending that list to
// `fetchSvgViaBrowser`'s Tier-2 SVG fetches. That was measured and WITHDRAWN:
// Tier 2 fires precisely when the render did NOT fetch the candidate
// (`logo-asset-capture.js`, `if (!buffer)`), the canonical case being a
// `<link rel=icon>` on a CDN that served nothing else, so gating it on hosts
// this thread declared loses logos — and it buys nothing, because a hostile
// page attests any host by loading one subresource from it and that load IS
// the SSRF. Tier 2 stays governed by its own scheme check plus this screen.
//
// TRUE CONTAINMENT, deliberately not attempted: routing Browserbase egress
// through a proxy we can enforce (or a Browserbase-side allowlist).
// `publisher_proxy_app.py:1246-1250` already reached exactly that conclusion
// about exactly this boundary — "a live thread on a Browserbase-armed
// deployment can reach any public site ... do not mistake this check for
// either". This screen does not change that sentence; it only removes the
// off-the-shelf exploits from in front of it.
export async function shouldBlockExternalRequest(requestUrl) {
  let parsed;
  try {
    parsed = new URL(requestUrl);
  } catch {
    return true;
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return !NON_EGRESS_REQUEST_SCHEMES.has(parsed.protocol);
  }

  const hostname = (parsed.hostname || "").toLowerCase().replace(/\.$/, "");
  if (!hostname) {
    return true;
  }
  if (BLOCKED_HOSTNAMES.has(hostname)) {
    return true;
  }
  if (BLOCKED_HOST_SUFFIXES.some((suffix) => hostname.endsWith(suffix))) {
    return true;
  }

  const ipVersion = net.isIP(hostname);
  if (ipVersion === 4) {
    return isBlockedIpv4(hostname);
  }
  if (ipVersion === 6) {
    return isBlockedIpv6(hostname);
  }

  // A name that SPELLS an address in blocked space, or belongs to a service
  // whose product is resolving to one. Static, resolver-free, and deliberately
  // partial — see "THE SYNTACTIC SCREEN, AND EXACTLY HOW FAR IT GOES" above.
  if (hostnameEncodesBlockedAddress(hostname)) {
    return true;
  }

  // LOAD-BEARING — see "THE NO-DOT RULE BELOW IS NOW LOAD-BEARING" above.
  // Single-label names are what Docker's embedded resolver answers.
  if (!hostname.includes(".")) {
    return true;
  }
  // A dotted, non-IP-literal hostname that cleared the static blocklists.
  // Resolving it here is impossible in either mode — the runtime has no
  // external DNS — and what stands behind this `false` differs by mode. The
  // previous wording said only "`browser_proxy.py` vets the resolved IP and
  // dials it directly", which is true in one mode and FALSE in the other; that
  // single sentence is what justified deleting the resolver, so it is spelled
  // out rather than deleted:
  //
  //   * LOCAL-CHROMIUM MODE — every request transits `browser_proxy.py`, which
  //     checks the RESOLVED address and dials that address rather than
  //     re-resolving. So allowing here loosens nothing.
  //   * BROWSERBASE MODE — our proxy is NOT in the request path; it carries the
  //     CDP control channel only, and the remote browser owns its egress.
  //     NOTHING vets the resolved IP. What stands here instead is the syntactic
  //     screen above (off-the-shelf shapes only, deliberately partial) and, for
  //     primary-main-frame navigations, the thread's `allowed_hosts`
  //     (`isNavigationWithinAllowedHosts`). A subresource `fetch()` to an
  //     attacker-owned name resolving into private space is covered by neither.
  //     That residual is stated in the SYNTACTIC SCREEN section above; it is
  //     accepted, not closed.
  return false;
}

// ---------------------------------------------------------------------
// THE THREAD'S allowed_hosts, ON PRIMARY-MAIN-FRAME NAVIGATIONS
// ---------------------------------------------------------------------
//
// WHAT THIS IS, in its own words, because the next reader will otherwise ask
// why the mint check is not enough and delete it as dead weight.
//
// It is NOT an SSRF control and never was. The residual described in the
// SYNTACTIC SCREEN section above is exploited by a subresource `fetch()` to an
// attacker-owned name, and this gate deliberately leaves every subresource to
// that screen. It is a HUMAN-APPROVAL-BOUNDARY control for the actions-file
// path.
//
// WHAT IT ACTUALLY PERMITS AND REFUSES. Read this before believing anything
// the name suggests, because an earlier version of this comment claimed the
// click vector was CLOSED and it is not.
//
// The four predicates below are ORed, and predicate (3) reads the page's
// CURRENTLY COMMITTED document. At route-interception time a click-driven
// navigation has not committed yet, so the committed document is still the
// approved page and (3) is satisfied by it. Measured, not reasoned:
//
//   approved.example -> evil.example        ALLOWED (committed doc approved)
//   evil.example     -> evil.example/other  ALLOWED (same host — see (4))
//   evil.example     -> evil2.example       REFUSED (a NEW off-list host)
//
// So this gate PERMITS ONE HOP off the approved host, deliberately. The first
// hop off an approved host is where every ccTLD split, locale redirect,
// consent-provider bounce and rebrand lives, and at route time a hostile first
// hop is BYTE-IDENTICAL to a legitimate one: committed document approved,
// target off-list, no 30x chain to read. Refusing the one refuses the other,
// and a refused legitimate hop is a failed extraction — the failure this
// feature is least allowed to have. Narrowing (3) is therefore foreclosed, not
// merely unimplemented.
//
// What it DOES buy is a bound on CONTINUED DRIFT: once the main frame is on an
// off-list document, every later main-frame navigation to a DIFFERENT host is
// refused. A click cannot be walked hop by hop across the open internet, and
// the run stops with a host a human can act on rather than wherever it drifted.
//
// It is NOT an SSRF control — see the section head above. Only primary
// main-frame navigations reach it; every subresource (the `fetch()` in the
// residual described above, images, XHR, workers) is screened by the syntactic
// screen ALONE.
//
// Predicates (1) and (2) are worth less than they look, and a reader budgeting
// trust should discount both:
//
//   * (1), the target host itself, is redundant with the mint on the first
//     `goto` in via-proxy production. `openPage` passes `targetUrl: args.url`
//     to the connector, `_require_browserbase_target_approved` 403s an off-list
//     value before a session exists, and the string then handed to
//     `page.goto(args.url)` is that same already-matched value. It decides
//     something only on the dev rig, where no mint ran at all.
//   * (2), the redirect-chain root, is INERT against pinned playwright 1.60.0:
//     `context.route` + `route.continue()` invokes the handler once, so a
//     routed request never carries a `redirectedFrom()` chain (the measurement
//     is written out above the predicate list below). It is kept as a
//     forward-compat guard held in place by a cell, not as a control that fires
//     today.
//
// SCOPE, and why it is this narrow. `request.isNavigationRequest()` is NOT
// main-frame-only: playwright-core computes it as
// `requestId === loaderId && type === "Document"` with no main-frame test, so
// EVERY iframe document load qualifies. Gating those would abort the captcha
// challenge iframe `openPage` explicitly waits for and clicks inside, and every
// CMP/consent iframe with it. So the caller ANDs in
// `req.frame() === primaryPage.mainFrame()`, and everything else — iframes,
// subresources, workers — keeps today's behaviour: the syntactic screen only.

// THE GATE'S ONE HOST NORMALIZATION. Every predicate below compares hosts, and
// they must all fold the same way or two of them disagree about whether two
// spellings are the same host. Case and a trailing root dot are folded here;
// punycode/IDNA is folded by `new URL(...).hostname` in `normalizedUrlHost`,
// which is the only way a URL's host is ever read.
function normalizeGateHost(hostname) {
  return String(hostname || "").trim().toLowerCase().replace(/\.$/, "");
}

// The normalized host of a URL, or "" when there is not one to compare: an
// unparseable string, `about:blank`, or any URL with no host. "" is NOT a host
// — no caller may treat two empty results as a match.
function normalizedUrlHost(url) {
  if (!url || url === "about:blank") return "";
  try {
    return normalizeGateHost(new URL(url).hostname);
  } catch {
    return "";
  }
}

// Exact-or-subdomain, the same rule `browser_proxy.py::is_connect_allowed` and
// `_require_browserbase_target_approved` apply, so a host the mint accepted
// cannot be refused here (and vice versa).
export function hostMatchesAllowedHosts(hostname, allowedHosts) {
  const host = normalizeGateHost(hostname);
  if (!host || !Array.isArray(allowedHosts)) return false;
  return allowedHosts.some(
    (allowed) => host === allowed || host.endsWith(`.${allowed}`),
  );
}

function urlHostMatchesAllowedHosts(url, allowedHosts) {
  return hostMatchesAllowedHosts(normalizedUrlHost(url), allowedHosts);
}

// PREDICATE (4): the target host IS the host the document is already on.
//
// The gate bounds CONTINUED DRIFT — moving to NEW hosts. Navigating within the
// host you are already sitting on is not drift, and without this predicate the
// gate refuses it: after the one permitted hop lands, the committed document is
// off-list, so (3) is false, and if the target is that same off-list host (1) is
// false too. Net effect, and it is the live failure this predicate fixes: once
// redirected onto an off-list host the page could not navigate ANYWHERE,
// including to the host it was already on. A run died on
// `www.atom.com/name/Eva` -> `www.atom.com/premium-domains-for-sale` with
// `code: target_not_approved, host: www.atom.com` — a refused SAME-HOST
// navigation. That row was a parked domain, but the shape is a legitimate
// `brand.com` -> `brand.co.uk` rebrand that then navigates its own site, and a
// refused legitimate site is this feature's cardinal sin.
//
// THE SECURITY PROPERTY IS UNCHANGED, exactly: from an off-list document a hop
// to a DIFFERENT off-list host is still refused (the row the live B3(b) test
// pinned — `example.com` -> `www.iana.org` allowed, then -> `www.wikipedia.org`
// refused). Only same-host navigation is newly permitted, and reaching that host
// already required passing this gate once.
//
// EQUALITY, not exact-or-subdomain: `shop.evil.example` is a different host from
// `evil.example` and moving between them IS drift. And "" is not a host — an
// `about:blank` or unparseable committed document must not match an equally
// hostless target into a blanket allow, which is what the two emptiness tests
// below prevent.
function isSameHostAsCommittedDocument(requestUrl, committedDocumentUrl) {
  const targetHost = normalizedUrlHost(requestUrl);
  const committedHost = normalizedUrlHost(committedDocumentUrl);
  if (!targetHost || !committedHost) return false;
  return targetHost === committedHost;
}

// FOUR PREDICATES, ORed. All four are load-bearing; the composition is not
// redundant and dropping any one of them breaks a shape that occurs constantly.
//
//   1. the target host itself is on the list;
//   2. the request is a redirect hop whose CHAIN ROOTS at an allowed host —
//      `request.redirectedFrom()` links HTTP 30x hops, so this is what carries
//      `www.example.com` -> apex `example.com` (the apex is not a subdomain of
//      `www.`), ccTLD splits, rebrands and shortlinks;
//   3. the primary page's CURRENTLY COMMITTED DOCUMENT is on an allowed host;
//   4. the target host IS the committed document's host — navigating within the
//      host you are already on is not drift. See its own comment above.
//
// (3) IS NOT OPTIONAL, and it is the one a reviewer deletes. `redirectedFrom()`
// links only 30x hops: a `<meta http-equiv="refresh">` or a JS
// `location.href =` is a NEW navigation with no `redirectedFrom` link at all.
// With (2) alone, a 302 to `evil.example` is allowed and a `location.href` to
// `example.co.uk` is refused — same trust, opposite verdict, and the refused
// shape is the common one for geo/locale/consent hops. At route time for a
// client-side navigation the committed document is still the OLD (approved)
// one, which is exactly what makes (3) decidable.
//
// THE TRADE, STATED: an approved host can redirect anywhere. That is the same
// trust we already extend to it for subresources and for running its own JS.
//
// ---------------------------------------------------------------------
// MEASURED: (2) IS CURRENTLY UNREACHABLE FROM THE ROUTE HANDLER
// ---------------------------------------------------------------------
//
// This was designed on the premise that "Playwright re-routes each redirect
// hop". Against pinned playwright 1.60.0 that premise is FALSE for
// `context.route(...)` + `route.continue()`. Measured, cross-origin 302:
//
//   page.on("request")  fires TWICE, and the second carries
//                       redirectedFrom() -> the first
//   the route handler   is invoked ONCE, for the initial request only
//   the server          receives both hits, and page.url() ends on the
//                       redirect target
//
// So a routed request never HAS a `redirectedFrom()` chain: Chromium follows
// the 30x internally and the resulting request is not re-intercepted. (2)
// therefore decides nothing today, and no live cell can make it decide
// anything — its unit coverage is the pure-function test, which is honest
// about being a test of the function rather than of the path.
//
// It is kept rather than deleted for one reason, and it is not "defensive
// programming": if a Playwright upgrade DOES start re-routing hops, every
// `www.` -> apex storefront redirect becomes a refusal on the same day, and
// (2) is what makes that a no-op instead of an outage. The integration cell
// asserts the mechanism as measured, so the upgrade that changes it fails a
// test and sends the reader here rather than to production.
//
// The consequence to be clear-eyed about: an approved host's 30x moves the
// main frame to an unapproved host WITHOUT this gate seeing it at all. That
// lands on the same side as the stated trade above — it is the behaviour the
// design wanted — but it is Playwright's doing, not ours.
//
// (3) is unaffected and IS reached: a `location.href =` is a genuinely new
// navigation, is routed, and is refused or allowed here.
export function isNavigationWithinAllowedHosts({
  requestUrl,
  redirectChainRootUrl = "",
  committedDocumentUrl = "",
  allowedHosts,
}) {
  return (
    urlHostMatchesAllowedHosts(requestUrl, allowedHosts)
    || urlHostMatchesAllowedHosts(redirectChainRootUrl, allowedHosts)
    || urlHostMatchesAllowedHosts(committedDocumentUrl, allowedHosts)
    || isSameHostAsCommittedDocument(requestUrl, committedDocumentUrl)
  );
}

// The root of a Playwright redirect chain, "" when the request is not a
// redirect hop. Bounded: Chromium's own redirect limit is 20, so 32 is slack
// rather than a policy, and a cycle cannot hang the route handler.
const REDIRECT_CHAIN_MAX_HOPS = 32;
function redirectChainRootUrl(request) {
  let root = null;
  let cursor = request;
  for (let hops = 0; hops < REDIRECT_CHAIN_MAX_HOPS; hops += 1) {
    let previous = null;
    try {
      previous = cursor.redirectedFrom();
    } catch {
      previous = null;
    }
    if (!previous) break;
    cursor = previous;
    root = cursor;
  }
  if (!root) return "";
  try {
    return root.url();
  } catch {
    return "";
  }
}

// Is this routed request a navigation of the PRIMARY page's MAIN frame — the
// only thing the gate above may touch?
//
// `isNavigationRequest()` alone is not that question. playwright-core computes
// it as `requestId === loaderId && type === "Document"`, with no main-frame
// test, so every iframe document load answers yes; the identity comparison
// against `primaryPage.mainFrame()` is what makes the answer mean what the name
// says.
//
// BOTH FAILURE ARMS FAIL OPEN — they return false, which means "not gated", so
// the request falls through to the syntactic screen that already ran. There are
// three, and none of them is hypothetical:
//
//   * `frame()` THROWS "Service Worker requests do not have an associated
//     frame." for a service-worker request;
//   * `frame()` THROWS "Frame for this navigation request is not available,
//     because the request was issued before the frame is created.";
//   * `primaryPage` is not assigned yet — the route is registered before the
//     page exists, and in Browserbase mode the page is pre-attached and can be
//     issuing requests during that window.
//
// A guard that cannot decide must not be the thing that decides. Blocking on an
// undecidable frame would abort real navigations for a reason nobody could read
// off the error, which is this feature's entire failure history.
export function isPrimaryMainFrameNavigation(request, primaryPage) {
  if (!primaryPage) return false;
  try {
    return request.isNavigationRequest() && request.frame() === primaryPage.mainFrame();
  } catch {
    return false;
  }
}

// The refusal the human can act on. `route.abort("blockedbyclient")` on a
// main-frame navigation makes `page.goto` reject with a message BYTE-IDENTICAL
// to the outage this branch fixed (`ERR_BLOCKED_BY_CLIENT`), naming no host —
// and in Browserbase mode the tunnel classifier returns null by design
// (`browserProxyConfigured:false`), so nothing downstream will add one. So the
// route handler records the refusal and `openPage` converts it here, into the
// same `target_not_approved` family the mint refusal uses: the skill's one
// carve-out from its Browserbase stop rule is keyed on exactly that code, so
// this reaches the agent as "ask a human for this host", not as a platform
// fault.
//
// The literal is duplicated rather than imported from the connector on purpose:
// a probe contract pins that the connector emits `target_not_approved` at
// exactly ONE place, which is the mint. This is a second, different site.
const NAVIGATION_NOT_APPROVED_CODE = "target_not_approved";
export function navigationNotApprovedError({ host, url, allowedHosts }) {
  const error = new Error(
    `Navigation to ${host} was refused: it is not a host this thread's `
    + `browser-proxy session carries (${(allowedHosts || []).join(", ") || "none"}). `
    + "Nothing about the site was read. Ask a human for the website_access approval, "
    + "for exactly the host named here, then RUN THE EXTRACTION AGAIN — the approval "
    + "lands on the thread's hosts, but this run cannot resume from where it stopped; "
    + "the browser session it was refused in is already gone.",
  );
  error.code = NAVIGATION_NOT_APPROVED_CODE;
  error.host = host;
  error.url = url;
  return error;
}

async function ensureParentDir(targetPath) {
  if (!targetPath) return;
  await fs.mkdir(path.dirname(targetPath), { recursive: true });
}

async function readJsonFile(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

export function parseArgs(argv) {
  const args = {
    url: "",
    out: "",
    outDir: "",
    artifactsRoot: "",
    slug: "",
    screenshot: "",
    pretty: false,
    actionsFile: "",
    selectors: [],
    backgroundSelectors: [],
    textSelectors: [],
    buttonSelectors: [],
    productCardSelectors: [],
    languageSelectors: [],
    priceSelectors: [],
    oldPriceSelectors: [],
    ctaSelectors: [],
    waitUntil: "domcontentloaded",
    timeoutMs: 45000,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--url") {
      args.url = argv[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (token === "--out" || token === "--output") {
      args.out = argv[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (token === "--slug") {
      args.slug = argv[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (token === "--artifacts-root") {
      args.artifactsRoot = argv[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (token === "--out-dir") {
      args.outDir = argv[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (token === "--screenshot") {
      args.screenshot = argv[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (token === "--actions-file") {
      args.actionsFile = argv[index + 1] ?? "";
      index += 1;
      continue;
    }
    if (token === "--selector") {
      args.selectors.push(argv[index + 1] ?? "");
      index += 1;
      continue;
    }
    if (token === "--background-selector") {
      args.backgroundSelectors.push(argv[index + 1] ?? "");
      index += 1;
      continue;
    }
    if (token === "--text-selector") {
      args.textSelectors.push(argv[index + 1] ?? "");
      index += 1;
      continue;
    }
    if (token === "--button-selector") {
      args.buttonSelectors.push(argv[index + 1] ?? "");
      index += 1;
      continue;
    }
    if (token === "--product-card-selector") {
      args.productCardSelectors.push(argv[index + 1] ?? "");
      index += 1;
      continue;
    }
    if (token === "--language-selector") {
      args.languageSelectors.push(argv[index + 1] ?? "");
      index += 1;
      continue;
    }
    if (token === "--price-selector") {
      args.priceSelectors.push(argv[index + 1] ?? "");
      index += 1;
      continue;
    }
    if (token === "--old-price-selector") {
      args.oldPriceSelectors.push(argv[index + 1] ?? "");
      index += 1;
      continue;
    }
    if (token === "--cta-selector") {
      args.ctaSelectors.push(argv[index + 1] ?? "");
      index += 1;
      continue;
    }
    if (token === "--wait-until") {
      args.waitUntil = argv[index + 1] ?? args.waitUntil;
      index += 1;
      continue;
    }
    if (token === "--timeout-ms") {
      args.timeoutMs = Number.parseInt(argv[index + 1] ?? "", 10) || args.timeoutMs;
      index += 1;
      continue;
    }
    if (token === "--pretty") {
      args.pretty = true;
    }
  }

  args.out = resolvePath(args.out);
  args.outDir = resolvePath(args.outDir);
  args.artifactsRoot = resolvePath(args.artifactsRoot);
  args.screenshot = resolvePath(args.screenshot);
  args.actionsFile = resolvePath(args.actionsFile);

  if (!args.outDir && args.artifactsRoot && args.slug) {
    args.outDir = resolvePath(path.join(args.artifactsRoot, "technical", args.slug));
  }

  if (!args.url) {
    throw new Error("Missing required flag: --url <url>");
  }

  return args;
}

export function selectorSummary(selectors) {
  const activeSelectors = normalizeSelectorList(selectors);
  if (!activeSelectors.length) {
    return;
  }

  const summary = activeSelectors.join(", ");
  process.stderr.write(`Selectors: ${summary}\n`);
}

export async function writeJson(payload, outPath = "", pretty = false) {
  const serialized = `${JSON.stringify(payload, null, pretty ? 2 : 0)}\n`;
  if (outPath) {
    await ensureParentDir(outPath);
    await fs.writeFile(outPath, serialized, "utf8");
    return;
  }
  process.stdout.write(serialized);
}

export async function writeScreenshot(page, screenshotPath) {
  if (!screenshotPath) {
    return "";
  }

  await ensureParentDir(screenshotPath);
  await page.screenshot({
    path: screenshotPath,
    fullPage: true,
  });
  return screenshotPath;
}

export function deriveSiblingArtifactPath(referencePath, fileName) {
  if (!referencePath || !fileName) {
    return "";
  }
  return path.join(path.dirname(referencePath), fileName);
}

export function deriveArtifactPath(outDir, fileName) {
  if (!outDir || !fileName) {
    return "";
  }
  return path.join(outDir, fileName);
}

export async function readJsonFileIfExists(filePath) {
  if (!filePath) {
    return null;
  }
  try {
    return await readJsonFile(filePath);
  } catch (error) {
    if (error?.code === "ENOENT") {
      return null;
    }
    throw error;
  }
}

export async function loadNearbyCaptureMetadata(args) {
  const referencePath = args.out || args.screenshot;
  const capturePath = deriveSiblingArtifactPath(referencePath, "capture.json");
  const payload = await readJsonFileIfExists(capturePath);
  return {
    capturePath,
    payload: isPlainObject(payload) ? payload : null,
  };
}

export async function settlePageForScreenshot(page, timeoutMs = 45000) {
  const settleTimeoutMs = Math.min(
    Math.max(Number.parseInt(String(timeoutMs), 10) || SCREENSHOT_MAX_NETWORK_SETTLE_MS, 1000),
    SCREENSHOT_MAX_NETWORK_SETTLE_MS,
  );

  await page.waitForTimeout(SCREENSHOT_SETTLE_WAIT_MS);
  await page.evaluate(() => {
    const doc = document.documentElement;
    const maxScrollY = Math.max(doc.scrollHeight - window.innerHeight, 0);
    const targetY = Math.min(Math.round(window.innerHeight * 1.5), maxScrollY);
    window.scrollTo(0, targetY);
  });
  await page.waitForLoadState("networkidle", { timeout: settleTimeoutMs }).catch(() => {});
  await page.waitForTimeout(SCREENSHOT_SCROLL_PAUSE_MS);
  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });
  await page.waitForLoadState("networkidle", { timeout: settleTimeoutMs }).catch(() => {});
  await page.waitForTimeout(SCREENSHOT_SCROLL_PAUSE_MS);
}

export async function runControlledLazyScroll(page, timeoutMs = LAZY_GRID_SETTLE_TIMEOUT_MS) {
  const settleTimeoutMs = Math.min(
    Math.max(Number.parseInt(String(timeoutMs), 10) || LAZY_GRID_SETTLE_TIMEOUT_MS, 1000),
    LAZY_GRID_SETTLE_TIMEOUT_MS,
  );
  const scrollSteps = [0.2, 0.45, 0.7, 0.92, 0];

  for (const step of scrollSteps) {
    await page.evaluate((fraction) => {
      const doc = document.documentElement;
      const maxScrollY = Math.max(doc.scrollHeight - window.innerHeight, 0);
      window.scrollTo(0, Math.round(maxScrollY * fraction));
    }, step);
    await page.waitForLoadState("networkidle", { timeout: settleTimeoutMs }).catch(() => {});
    await page.waitForTimeout(LAZY_GRID_SCROLL_PAUSE_MS);
  }
}

export async function waitForAnyVisibleSelector(
  page,
  selectors,
  timeoutMs = LAZY_GRID_VISIBLE_WAIT_MS,
  pollMs = 250,
) {
  const startedAt = Date.now();
  const activeSelectors = normalizeSelectorList(selectors);
  if (!activeSelectors.length) {
    return { matchedSelector: "", visibleCount: 0 };
  }

  while (Date.now() - startedAt < timeoutMs) {
    for (const selector of activeSelectors) {
      try {
        const locator = page.locator(selector);
        const count = Math.min(await locator.count().catch(() => 0), 6);
        let visibleCount = 0;
        for (let index = 0; index < count; index += 1) {
          if (await locator.nth(index).isVisible().catch(() => false)) {
            visibleCount += 1;
          }
        }
        if (visibleCount > 0) {
          return {
            matchedSelector: selector,
            visibleCount,
          };
        }
      } catch {
        // Ignore selectors that fail during retry polling.
      }
    }
    await page.waitForTimeout(pollMs);
  }

  return {
    matchedSelector: "",
    visibleCount: 0,
  };
}

export async function waitForHomepageDataCandidate(page, candidates, timeoutMs = LAZY_GRID_ENDPOINT_WAIT_MS) {
  const activeCandidates = Array.isArray(candidates)
    ? candidates
        .filter((candidate) => isPlainObject(candidate) && typeof candidate.url === "string" && candidate.url.trim())
        .slice(0, 6)
    : [];
  if (!activeCandidates.length) {
    return null;
  }

  const candidateMatchers = activeCandidates
    .map((candidate) => {
      const parsed = safeParseUrl(candidate.url);
      return parsed
        ? {
            fullUrl: candidate.url,
            origin: parsed.origin,
            pathname: parsed.pathname,
          }
        : null;
    })
    .filter(Boolean);
  try {
    const response = await page.waitForResponse(
      (candidateResponse) => {
        const responseUrl = safeParseUrl(candidateResponse.url());
        if (!responseUrl) {
          return false;
        }
        return candidateMatchers.some(
          (candidate) =>
            candidate.fullUrl === responseUrl.toString() ||
            (candidate.origin === responseUrl.origin && candidate.pathname === responseUrl.pathname),
        );
      },
      { timeout: timeoutMs },
    );
    return {
      url: response.url(),
      status: response.status(),
      contentType: contentTypeFromHeaders(response.headers()),
    };
  } catch {
    return null;
  }
}

export async function safePageEvaluate(page, pageFunction, arg) {
  return page.evaluate(pageFunction, arg);
}

function assertIntegerInRange(value, label, minimum, maximum) {
  if (!Number.isInteger(value) || value < minimum || value > maximum) {
    throw new Error(`${label} must be an integer between ${minimum} and ${maximum}`);
  }
}

function validateSelectors(selectors, label) {
  if (!Array.isArray(selectors) || selectors.length < 1 || selectors.length > ACTION_LIMITS.maxSelectors) {
    throw new Error(`${label} must contain between 1 and ${ACTION_LIMITS.maxSelectors} selectors`);
  }

  for (const selector of selectors) {
    if (typeof selector !== "string" || !selector.trim()) {
      throw new Error(`${label} selectors must be non-empty strings`);
    }
    if (selector.length > ACTION_LIMITS.maxSelectorLength) {
      throw new Error(`${label} selectors must be at most ${ACTION_LIMITS.maxSelectorLength} characters`);
    }
  }
}

function validateAction(action, index) {
  if (!isPlainObject(action)) {
    throw new Error(`Action at index ${index} must be an object`);
  }

  const keys = Object.keys(action);
  if (!("type" in action)) {
    throw new Error(`Action at index ${index} is missing required field: type`);
  }

  if (action.type === "click" || action.type === "wait_for_selector") {
    const allowedKeys = new Set(["type", "selectors", "timeoutMs"]);
    if (keys.some((key) => !allowedKeys.has(key))) {
      throw new Error(`Action at index ${index} contains unsupported fields`);
    }
    validateSelectors(action.selectors, `Action ${index} selectors`);
    const timeoutMs = action.timeoutMs ?? 3000;
    assertIntegerInRange(
      timeoutMs,
      `Action ${index} timeoutMs`,
      ACTION_LIMITS.minTimeoutMs,
      ACTION_LIMITS.maxTimeoutMs,
    );
    return {
      type: action.type,
      selectors: action.selectors.map((selector) => selector.trim()),
      timeoutMs,
    };
  }

  if (action.type === "wait_for_timeout") {
    const allowedKeys = new Set(["type", "ms"]);
    if (keys.some((key) => !allowedKeys.has(key))) {
      throw new Error(`Action at index ${index} contains unsupported fields`);
    }
    assertIntegerInRange(
      action.ms,
      `Action ${index} ms`,
      ACTION_LIMITS.minWaitMs,
      ACTION_LIMITS.maxWaitMs,
    );
    return {
      type: action.type,
      ms: action.ms,
    };
  }

  throw new Error(`Unsupported action type at index ${index}: ${String(action.type)}`);
}

export function validateActions(actions) {
  if (!Array.isArray(actions) || actions.length < 1 || actions.length > ACTION_LIMITS.maxActions) {
    throw new Error(`Actions must contain between 1 and ${ACTION_LIMITS.maxActions} entries`);
  }
  return actions.map((action, index) => validateAction(action, index));
}

export async function loadActionsFile(actionsFile) {
  if (!actionsFile) {
    return;
  }

  let payload;
  try {
    payload = JSON.parse(await fs.readFile(actionsFile, "utf8"));
  } catch (error) {
    throw new Error(`Failed to parse actions file ${actionsFile}: ${error.message}`);
  }

  if (!isPlainObject(payload)) {
    throw new Error(`Actions file must contain a JSON object: ${actionsFile}`);
  }
  if (!Array.isArray(payload.actions)) {
    throw new Error(`Actions file must contain an "actions" array: ${actionsFile}`);
  }
  if (Object.keys(payload).some((key) => key !== "actions")) {
    throw new Error(`Actions file contains unsupported top-level fields: ${actionsFile}`);
  }

  return {
    actions: validateActions(payload.actions),
  };
}

async function runSelectorAction(page, action, actionIndex, mode) {
  const errors = [];

  for (const selector of action.selectors) {
    try {
      const locator = page.locator(selector).first();
      await locator.waitFor({
        state: "visible",
        timeout: action.timeoutMs,
      });
      if (mode === "click") {
        await locator.click({ timeout: action.timeoutMs });
      }
      return selector;
    } catch (error) {
      errors.push(`${selector}: ${error.message}`);
    }
  }

  throw new Error(
    `Action ${actionIndex} (${mode}) did not match any selector. ${errors.join(" | ")}`,
  );
}

export async function runActions(page, payload) {
  if (!payload?.actions?.length) {
    return [];
  }

  const executed = [];

  for (let index = 0; index < payload.actions.length; index += 1) {
    const action = payload.actions[index];

    if (action.type === "click") {
      const matchedSelector = await runSelectorAction(page, action, index, "click");
      executed.push({ ...action, matchedSelector });
      continue;
    }

    if (action.type === "wait_for_selector") {
      const matchedSelector = await runSelectorAction(page, action, index, "wait_for_selector");
      executed.push({ ...action, matchedSelector });
      continue;
    }

    if (action.type === "wait_for_timeout") {
      await page.waitForTimeout(action.ms);
      executed.push(action);
      continue;
    }
  }

  return executed;
}

async function maybeRunActionsFile(args, page) {
  if (!args.actionsFile) {
    return [];
  }

  const payload = await loadActionsFile(args.actionsFile);
  return runActions(page, payload);
}

export function deriveCaptureMetadataPath(screenshotPath) {
  if (!screenshotPath) {
    return "";
  }

  return path.join(path.dirname(screenshotPath), "capture.json");
}

export function parseHeadAssetMetadata(headAssets) {
  const parsedFavicons = dedupeByKey(
    [...(headAssets?.icons || []), ...(headAssets?.maskIcons || [])]
      .filter(
        (entry) =>
          entry &&
          (FAVICON_REL_PATTERN.test(entry.rel || "") || /(?:^|\s)mask-icon(?:\s|$)/i.test(entry.rel || "")),
      )
      .map(parseFaviconEntry)
      .filter((entry) => entry.href),
    (entry) => `${entry.rel}::${entry.href}`,
  ).sort((left, right) => (right.largestSizePx || 0) - (left.largestSizePx || 0));

  return {
    favicons: parsedFavicons,
  };
}

export async function parseManifestEntries(page, manifestLinks, timeoutMs = 45000) {
  const pageUrl = page.url();
  const pageOrigin = safeParseUrl(pageUrl)?.origin || "";
  const manifestEntries = Array.isArray(manifestLinks) ? manifestLinks : [];
  const results = [];

  for (const manifestLink of manifestEntries) {
    const manifestUrl = normalizeUrl(manifestLink?.href || "", pageUrl);
    if (!manifestUrl) {
      results.push({
        href: "",
        rel: manifestLink?.rel || "",
        fetchStatus: "invalid-url",
        sameOrigin: false,
      });
      continue;
    }

    const parsedManifestUrl = safeParseUrl(manifestUrl);
    const sameOrigin = Boolean(parsedManifestUrl && parsedManifestUrl.origin === pageOrigin);
    if (!sameOrigin) {
      results.push({
        href: manifestUrl,
        rel: manifestLink?.rel || "",
        fetchStatus: "skipped-cross-origin",
        sameOrigin: false,
      });
      continue;
    }
    if (await shouldBlockExternalRequest(manifestUrl)) {
      results.push({
        href: manifestUrl,
        rel: manifestLink?.rel || "",
        fetchStatus: "skipped-blocked",
        sameOrigin,
      });
      continue;
    }

    try {
      const response = await page.context().request.get(manifestUrl, {
        timeout: Math.min(timeoutMs, 10000),
      });
      const contentType = contentTypeFromHeaders(response.headers());
      const body = await response.text();
      let manifest = null;
      let parseError = "";

      try {
        manifest = JSON.parse(body);
      } catch (error) {
        parseError = error.message;
      }

      results.push({
        href: manifestUrl,
        rel: manifestLink?.rel || "",
        sameOrigin,
        fetchStatus: response.ok() && manifest ? "ok" : response.ok() ? "parse-error" : "http-error",
        status: response.status(),
        contentType,
        parseError,
        parsed: manifest && isPlainObject(manifest)
          ? {
              name: typeof manifest.name === "string" ? manifest.name : "",
              shortName: typeof manifest.short_name === "string" ? manifest.short_name : "",
              startUrl: normalizeUrl(manifest.start_url || "", manifestUrl),
              scope: normalizeUrl(manifest.scope || "", manifestUrl),
              display: typeof manifest.display === "string" ? manifest.display : "",
              themeColor: typeof manifest.theme_color === "string" ? manifest.theme_color : "",
              backgroundColor: typeof manifest.background_color === "string" ? manifest.background_color : "",
              lang: typeof manifest.lang === "string" ? manifest.lang : "",
              icons: Array.isArray(manifest.icons)
                ? manifest.icons
                    .map((icon) => parseManifestIconEntry(icon, manifestUrl))
                    .filter((icon) => icon.src)
                    .sort((left, right) => (right.largestSizePx || 0) - (left.largestSizePx || 0))
                : [],
            }
          : null,
      });
    } catch (error) {
      results.push({
        href: manifestUrl,
        rel: manifestLink?.rel || "",
        sameOrigin,
        fetchStatus: "fetch-error",
        parseError: error.message,
      });
    }
  }

  return results;
}

// THE ORDER OF THIS CONTAINER IS THE ORDER THE RESPONSES ARRIVED.
//
// `Map.set` on a key that is ALREADY present updates the value and KEEPS the
// original insertion position. The snapshot handed to
// `summarizeObservedRequests` is `[...map.values()]`, so a bare `set` would
// order the records by FIRST sighting while their statuses come from the LAST
// -- two chronologies in one array, in an array whose last entry
// `detectLandedDocumentError` reads as "the document we ended up holding".
//
// Worked through on the cleared-challenge flow `GET / 403` -> `POST / 302` ->
// `GET / 200`: the re-issued GET collapses back onto position 0 carrying its
// 200, which leaves the challenge answer's `POST / 302` as the last document
// and refuses a storefront that WAS served its homepage. Deleting before
// setting re-inserts at the end, so a re-observed request moves to where it
// actually happened.
//
// That three-hop chain is a shape the container's key semantics can produce,
// NOT one anything has recorded. What the archive holds is `GET / 403` ->
// `POST / 200` (6 distinct captures, two archived storefronts) and one
// `GET / 403` -> `POST / 302` -> `GET /ua/ 200` where the third hop is at a
// DIFFERENT URL -- in both, the two records carry different keys and nothing
// collapses. What IS recorded, on 11 of 25 live runs, is the same-key re-issue
// this fixes in the general case: `GET / 307` then `GET / 403` on a challenged
// host, and a re-issued asset carried to the end on 7 of 9 live sites.
//
// The key is `method::resourceType::url` because that is what makes two
// responses the same request; a repeat of that key is a RE-ISSUE of one
// request, not a second one, which is why the entry moves rather than
// doubling.
//
// TWO THINGS READ THIS ORDER, and both had to be checked.
//
// The per-category cap in `summarizeObservedRequests` keeps the first 60 of a
// category for the agent to read. A re-issued asset now sits at its re-issue
// time rather than its first sighting, and in a category that overflows it
// can fall past the cap. Two things read those buckets. `detectSecurityInterstitial`
// walks the whole capture payload STRUCTURALLY, so every bucket URL is in its
// haystack whatever the bucket is called -- a name-based search for the
// buckets does not find it; the cap can only shrink that haystack, and its
// resource evidence never sets `blocked` on its own. `detectLandedDocumentError`
// no longer reads the buckets at all when the producer supplied
// `landedMainFrameDocuments`, which is exactly so that no cap on a bucket can
// evict the one record a refusal turns on. `likelyHomepageDataCandidates` is
// collected before the cap and does not depend on the bucket at all.
//
// `homepage-pass.js` collapses this container to one content type per URL for
// the logo path. It USED to do that first-wins over the container, which made
// a URL's content type depend on which of its records was re-issued last --
// see `resolveContentTypeByUrl` below, which now resolves it from what the
// server said instead of from where the record sits.
export function recordObservedRequest(observedRequests, { url, method, resourceType, status, contentType }) {
  const key = `${method}::${resourceType}::${url}`;
  observedRequests.delete(key);
  observedRequests.set(key, { url, method, resourceType, status, contentType });
  return observedRequests;
}

// WHICH DOCUMENT THE MAIN FRAME COMMITTED -- a fact the census above cannot
// carry, and the reason it is recorded separately.
//
// `observedRequests` is keyed `method::resourceType::url`, which deliberately
// merges a main-frame navigation with a same-URL SUB-FRAME navigation: they
// are the same request as far as "what did this origin serve" is concerned,
// and that is the question the buckets answer. `detectLandedDocumentError`
// asks a different one -- "what did the browser put on the screen" -- and the
// merge destroys its answer before it can read it: a `<iframe src="/">` at the
// landed URL overwrites the navigation's status with the frame's, and no
// filter downstream can undo it. Two questions, one data structure; recording
// the second question's answer where it is still knowable is the fix.
//
// BOTH HALVES OF THE TEST ARE LOAD-BEARING, measured live across 7 storefronts
// and 657 responses: `isNavigationRequest()` alone is TRUE for a doubleclick
// activity frame, an owox service-worker frame, a Criteo `syncframe` and
// Cloudflare's own Turnstile frame -- 9 sub-frame documents that a
// navigation-only test would have accepted. Only `frame() === page.mainFrame()`
// separates them. Every landed document in those runs answered true to both.
//
// THE RULE IS `isPrimaryMainFrameNavigation`'s, not a second copy of it. This
// wrapper exists only to ask it about a RESPONSE -- the `response` listener has
// no request in hand -- and to swallow a `response.request()` that throws.
// Spelling the two halves out again here would put two implementations of one
// rule in one file, both gating the same class of customer-facing refusal, so a
// hardening of either would silently miss the other.
//
// Never throws: `request.frame()` is documented to be unavailable for a
// service-worker request, and this is called from the `response` listener,
// where a throw would cost the responses after it. `Boolean` is what makes the
// delegation exact rather than merely equivalent: `&&` inside
// `isPrimaryMainFrameNavigation` yields its own left operand, so a
// `isNavigationRequest()` that answered `0` would come back as `0` and not
// `false` -- unreachable through Playwright, and measured either way.
export function isMainFrameNavigationResponse(response, page) {
  try {
    return Boolean(isPrimaryMainFrameNavigation(response.request(), page));
  } catch {
    return false;
  }
}

// Appends one main-frame navigation, oldest dropped first. Arrival order, no
// keyed collapse: two navigations to one URL are two navigations -- a reload
// really did happen -- and it is the LAST of them the page is showing.
export function recordMainFrameNavigation(navigations, { url, method, resourceType, status, contentType }) {
  navigations.push({ url, method, resourceType, status, contentType });
  while (navigations.length > MAX_MAIN_FRAME_NAVIGATIONS) {
    navigations.shift();
  }
  return navigations;
}

// The navigations that answered for the URL the capture landed on. The
// redirect hops before it are dropped here rather than in the detector: they
// are at OTHER urls, and a URL that reaches the capture payload reaches
// `detectSecurityInterstitial`'s haystack with it.
export function mainFrameDocumentsAtUrl(navigations, landedUrl) {
  const landed = typeof landedUrl === "string" ? landedUrl.split("#")[0] : "";
  if (!landed) {
    return [];
  }
  const records = (Array.isArray(navigations) ? navigations : []).filter(
    (record) => isPlainObject(record) && typeof record.url === "string",
  );
  // A later token document followed by replaceState can restore an earlier
  // URL without restoring that earlier document. Never resurrect its error.
  if (records.at(-1)?.url.split("#")[0] !== landed) return [];
  return records.filter((record) => record.url.split("#")[0] === landed);
}

// The observed-request container, however the caller is holding it.
//
// `openPage` keeps it as a `Map` keyed `method::resourceType::url` and hands
// callers `[...map.values()]`, so both shapes are live in this file, and the
// inline loop these functions generalise consumed any iterable. Accepting only
// an array made the exported function stricter than the code it replaced: a
// `Map` or a `map.values()` iterator answered `{}` -- an empty answer that
// looks exactly like "nothing was observed" and cannot be told from it.
// A string is iterable too, and is never a list of records.
function observedRecordsOf(observedRequests) {
  if (Array.isArray(observedRequests)) {
    return observedRequests;
  }
  if (observedRequests instanceof Map) {
    return observedRequests.values();
  }
  if (
    observedRequests
    && typeof observedRequests !== "string"
    && typeof observedRequests[Symbol.iterator] === "function"
  ) {
    return observedRequests;
  }
  return [];
}

// Content types HTTP itself defines as "I do not know what these bytes are".
// They are the placeholder a CDN falls back to, so they may not outvote a
// type that actually names a format.
const OPAQUE_CONTENT_TYPES = new Set(["application/octet-stream", "binary/octet-stream"]);

// ONE CONTENT TYPE PER URL, resolved from WHAT THE SERVER SAID -- never from
// where a record sits in the container.
//
// One URL can be observed under several `method::resourceType` keys: an
// `<img>` load and a `fetch()` of the same CDN logo are two records. The
// consumer (`collectLogoAssets`) holds only a URL, so the several have to
// collapse to one, and the collapse used to be "whichever record comes first
// in the container wins". That handed the answer to `recordObservedRequest`'s
// ordering: re-issue the `<img>` and it moves to the end, so the `fetch`
// record's content type wins instead -- the same wire exchange resolving
// `image/svg+xml` or `application/octet-stream` on the strength of a repeat
// that says nothing about the bytes. `isSvgAsset` reads exactly this for an
// extensionless CDN logo, so the flip is a logo silently ceasing to be an
// SVG.
//
// The rule, and it depends only on the SET of things observed:
//   * an EMPTY content type is not an answer and never counts (unchanged --
//     the first-wins version skipped empties too);
//   * an opaque type loses to any type that names a format;
//   * what is left has to AGREE. Two different concrete types for one URL is
//     the server contradicting itself, and picking between them by position
//     is the thing being removed -- so the URL gets no observed type, and the
//     Tier-1 response body and the path extension decide, as they already do
//     for every URL that was never observed at all.
//
// "AGREE" IS ABOUT THE MEDIA TYPE, NOT THE HEADER STRING. `Content-Type`
// carries parameters, and one server answers `image/svg+xml` to the `<img>`
// load and `image/svg+xml; charset=utf-8` to the `fetch()` of the same URL --
// two spellings of one type, not two types. Compared whole they looked like
// the contradiction above and collapsed to "", which is a logo silently
// ceasing to be an SVG on exactly the extensionless CDN URL this rescue
// exists for. The consumer already reads only the media type
// (`isSvgAsset` splits on `;`), so this splits at the same place, and the
// resolved value is the bare media type the consumer compares.
//
// The `trim().toLowerCase()` is not decoration either: `Content-Type` is
// case-insensitive and header whitespace is not significant, so ` IMAGE/SVG+XML`
// and `image/svg+xml` are the same answer and must not read as two.
export function resolveContentTypeByUrl(observedRequests) {
  const observedTypes = new Map();
  for (const record of observedRecordsOf(observedRequests)) {
    const url = typeof record?.url === "string" ? record.url : "";
    if (!url) {
      continue;
    }
    if (!observedTypes.has(url)) {
      observedTypes.set(url, new Set());
    }
    const contentType = String(record?.contentType || "").split(";")[0].trim().toLowerCase();
    if (contentType) {
      observedTypes.get(url).add(contentType);
    }
  }
  const resolved = {};
  for (const [url, types] of observedTypes) {
    const named = [...types].filter((type) => !OPAQUE_CONTENT_TYPES.has(type));
    const candidates = named.length ? named : [...types];
    resolved[url] = candidates.length === 1 ? candidates[0] : "";
  }
  return resolved;
}

export function summarizeObservedRequests(observedRequests, pageUrl) {
  const buckets = {
    data: [],
    page: [],
    media: [],
    asset: [],
    other: [],
  };
  const candidates = [];

  const normalizedRequests = dedupeByKey(
    [...observedRecordsOf(observedRequests)].filter(
      (record) => isPlainObject(record) && typeof record.url === "string" && record.url.trim(),
    ),
    (record) => `${record.method || ""}::${record.resourceType || ""}::${record.url}`,
  );

  for (const record of normalizedRequests) {
    const category = classifyObservedRequest(record, pageUrl);
    if (!category) {
      continue;
    }

    const compactRecord = {
      url: record.url,
      method: record.method || "GET",
      resourceType: record.resourceType || "",
      status: Number.isInteger(record.status) ? record.status : null,
      contentType: record.contentType || "",
    };

    if (buckets[category].length < SAME_ORIGIN_REQUEST_CATEGORY_LIMIT) {
      buckets[category].push(compactRecord);
    }

    const score = dataCandidateScore(record);
    if (score <= 0) {
      continue;
    }
    candidates.push({
      ...compactRecord,
      score,
      reasonTags: dataCandidateReasonTags(record),
    });
  }

  const likelyHomepageDataCandidates = candidates
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }
      // (score, url) is not a total order: one URL can be observed under two
      // `method::resourceType` keys and score the same on both, and `sort` is
      // stable, so input order -- i.e. arrival order -- decided which came
      // first. The consumer dedupes by URL so nothing downstream can tell,
      // but the request key is what makes two such records distinguishable,
      // so it is what breaks the tie.
      //
      // COLLATION-EQUAL IS NOT EQUAL. `localeCompare` answers 0 for two
      // DIFFERENT strings whenever they differ only by something the
      // collation ignores -- a soft hyphen, a compatibility form -- so
      // ordering by it alone leaves those pairs back where they started: in
      // arrival order, which is the dependence this tie-break exists to
      // remove. Code units are the last resort because they are the only
      // comparison that separates every pair of distinct strings.
      const byUrl = left.url.localeCompare(right.url);
      if (byUrl !== 0) {
        return byUrl;
      }
      const leftKey = `${left.method}::${left.resourceType}`;
      const rightKey = `${right.method}::${right.resourceType}`;
      const byKey = leftKey.localeCompare(rightKey);
      if (byKey !== 0) {
        return byKey;
      }
      if (left.url !== right.url) {
        return left.url < right.url ? -1 : 1;
      }
      if (leftKey !== rightKey) {
        return leftKey < rightKey ? -1 : 1;
      }
      return 0;
    })
    .slice(0, MAX_HOMEPAGE_DATA_CANDIDATES);

  return {
    sameOriginObservedRequests: buckets,
    likelyHomepageDataCandidates,
  };
}

export function homepageDataCandidatesFromCapture(capturePayload, pageUrl) {
  if (!isPlainObject(capturePayload)) {
    return [];
  }

  const fromCandidates = Array.isArray(capturePayload.likelyHomepageDataCandidates)
    ? capturePayload.likelyHomepageDataCandidates
    : [];
  const normalizedCandidates = dedupeByKey(
    fromCandidates
      .filter((entry) => isPlainObject(entry) && typeof entry.url === "string" && entry.url.trim())
      .map((entry) => ({
        url: normalizeUrl(entry.url || ""),
        method: typeof entry.method === "string" ? entry.method : "GET",
        resourceType: typeof entry.resourceType === "string" ? entry.resourceType : "",
        status: Number.isInteger(entry.status) ? entry.status : null,
        contentType: typeof entry.contentType === "string" ? entry.contentType : "",
        score: Number.isFinite(entry.score) ? entry.score : 0,
        reasonTags: Array.isArray(entry.reasonTags) ? entry.reasonTags.filter((value) => typeof value === "string") : [],
      }))
      .filter((entry) => entry.url),
    (entry) => entry.url,
  );

  if (normalizedCandidates.length) {
    return normalizedCandidates;
  }

  const fallbackObserved = Array.isArray(capturePayload.observedAssetUrls) ? capturePayload.observedAssetUrls : [];
  const pageOrigin = safeParseUrl(pageUrl)?.origin || "";
  return dedupeByKey(
    fallbackObserved
      .map((value) => normalizeUrl(value || ""))
      .filter((value) => value && safeParseUrl(value)?.origin === pageOrigin && dataCandidateScore({ url: value }) > 0)
      .map((url) => ({
        url,
        method: "GET",
        resourceType: "",
        status: null,
        contentType: "",
        score: dataCandidateScore({ url }),
        reasonTags: dataCandidateReasonTags({ url }),
      })),
    (entry) => entry.url,
  ).slice(0, 6);
}

// Fallback discovery of the baked-in Chromium build. Mirrors the sibling
// workflow-designer skill's `_fallback_chromium_roots()`: the publisher
// image installs Playwright's Chromium under /ms-playwright, but the agent
// child process may not carry PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH or
// PLAYWRIGHT_BROWSERS_PATH, in which case Playwright would look in its
// default browsers root — deliberately left empty by the image build
// (PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1) — and every capture would die.
// Glob the known roots for the newest installed build first; only when
// nothing is found do we let Playwright resolve its default.
//
// Layouts are playwright-core's own EXECUTABLE_PATHS table (verified against
// the vendored 1.60.0 coreBundle.js and against a real ms-playwright cache).
// The headless-shell entries come first so the smaller binary wins when both
// are installed; within each family the order is linux, mac, win, then the
// pre-1.49 layouts kept for older caches. Mac and linux-arm64 headless shell
// were missing entirely, which is why an arm64 image build (and a local mac
// run) found nothing and fell through to Playwright's empty default root.
const FALLBACK_CHROMIUM_GLOB_PATTERNS = [
  // chromium-headless-shell
  "chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell",
  "chromium_headless_shell-*/chrome-linux/headless_shell", // linux-arm64 (non-cft)
  "chromium_headless_shell-*/chrome-headless-shell-mac-arm64/chrome-headless-shell",
  "chromium_headless_shell-*/chrome-headless-shell-mac-x64/chrome-headless-shell",
  "chromium_headless_shell-*/chrome-headless-shell-win64/chrome-headless-shell.exe",
  "chromium_headless_shell-*/chrome-mac/headless_shell", // pre-1.49 mac layout
  // chromium
  "chromium-*/chrome-linux64/chrome",
  "chromium-*/chrome-linux/chrome", // linux-arm64 (non-cft)
  "chromium-*/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  "chromium-*/chrome-mac-x64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  "chromium-*/chrome-win64/chrome.exe",
  "chromium-*/chrome-mac/Chromium.app/Contents/MacOS/Chromium", // pre-1.49 mac layout
];

export function fallbackChromiumRoots(env = process.env) {
  const roots = [];
  const configuredRoot = (env.PLAYWRIGHT_BROWSERS_PATH || "").trim();
  if (configuredRoot) roots.push(configuredRoot);
  roots.push("/ms-playwright");
  const home = os.homedir();
  if (home) {
    roots.push(path.join(home, ".cache", "ms-playwright"));
    roots.push(path.join(home, "AppData", "Local", "ms-playwright"));
    roots.push(path.join(home, "Library", "Caches", "ms-playwright"));
  }
  return [...new Set(roots)];
}

// Revision number carried by a Playwright build directory name
// ("chromium-1181" -> 1181, "chromium_headless_shell-988" -> 988). Playwright
// numbers revisions monotonically but with varying width, so a lexical sort
// ranks "chromium-988" above "chromium-1181" and picks a browser three years
// stale. Take the LAST digit run so variant dirs ("chromium-tip-of-tree-1234")
// still rank by revision; a suffix with no digits sorts last.
function chromiumBuildRevision(dirName, prefix) {
  const digitRuns = dirName.slice(prefix.length).match(/\d+/g);
  return digitRuns ? Number(digitRuns[digitRuns.length - 1]) : -1;
}

export function discoverFallbackChromiumExecutable(roots = fallbackChromiumRoots()) {
  for (const root of roots) {
    let entries;
    try {
      entries = fsSync.readdirSync(root);
    } catch {
      continue; // root missing or unreadable — try the next root
    }
    for (const pattern of FALLBACK_CHROMIUM_GLOB_PATTERNS) {
      const [dirGlob, ...restSegments] = pattern.split("/");
      const prefix = dirGlob.slice(0, dirGlob.indexOf("*"));
      // Newest build wins, compared numerically (see chromiumBuildRevision).
      const buildDirs = entries
        .filter((name) => name.startsWith(prefix))
        .sort((a, b) => {
          const byRevision = chromiumBuildRevision(b, prefix) - chromiumBuildRevision(a, prefix);
          if (byRevision !== 0) return byRevision;
          return b.localeCompare(a); // stable tiebreak for equal revisions
        });
      for (const buildDir of buildDirs) {
        const candidate = path.join(root, buildDir, ...restSegments);
        try {
          if (fsSync.statSync(candidate).isFile()) return candidate;
        } catch {
          // This build dir doesn't carry the pattern's platform shape.
        }
      }
    }
  }
  return null;
}

// Resolve the Chromium binary openPage should launch. The env pin wins ONLY
// when it points at a file that exists: publisher-runtime's manager always
// sets PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH, so trusting it unchecked made the
// /ms-playwright fallback unreachable in the exact deployment it was written
// for — a pin left over from a previous image tag failed the launch instead of
// falling through. Mirrors the sibling Python
// `playwright_health.discover_chromium_executable`, which has always done the
// `candidate.is_file()` check.
export function resolveChromiumExecutable(env = process.env) {
  const pinned = (env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH || "").trim();
  const pinnedExists = pinned !== "" && (() => {
    try {
      return fsSync.statSync(pinned).isFile();
    } catch {
      return false;
    }
  })();
  if (pinnedExists) return { executablePath: pinned, source: "env_pin" };
  const discovered = discoverFallbackChromiumExecutable(fallbackChromiumRoots(env));
  if (discovered) {
    return {
      executablePath: discovered,
      source: pinned ? "fallback_after_missing_pin" : "fallback",
    };
  }
  // Nothing found: leave executablePath unset and let Playwright resolve its
  // own default, exactly as before.
  return {
    executablePath: null,
    source: pinned ? "missing_pin_no_fallback" : "playwright_default",
  };
}

export async function openPage(args, { blockedFallbackSource = null } = {}) {
  // Browser-proxy URL chain, shared with save-logo-asset.js and the refusal
  // classifier: the publisher-issued proxy URL wins over the legacy
  // brandkit-agent variable and the chain ENDS there. PUBLISHER_PROXY_BASE_URL
  // is deliberately NOT in it — that is the publisher-proxy REST origin (a
  // FastAPI app with no CONNECT support), so pointing Chromium's
  // --proxy-server at it would turn a missing website_access approval into
  // ERR_TUNNEL_CONNECTION_FAILED instead of an actionable error.
  const browserProxyUrl = defaultBrowserProxyUrl();
  // Resolved ONCE. It is a pure read of three env vars that cannot change
  // mid-call, and every branch below (launch, context, page, init script,
  // teardown) must agree with the branch that actually opened the browser.
  const browserbaseMode = isBrowserbaseMode();
  const launchOptions = {
    headless: true,
    args: [
      "--disable-gpu",
      "--start-maximized",
      "--disable-blink-features=AutomationControlled",
      "--log-level=3",
    ],
  };
  if (browserProxyUrl) {
    // Chromium ignores credentials embedded in the proxy URL; Playwright
    // needs them split out or every CONNECT through the publisher browser
    // proxy (http://token:secret@host:port) fails with 407.
    // parseProxyUrl already percent-decodes the credentials.
    const parsedProxy = parseProxyUrl(browserProxyUrl);
    if (!parsedProxy) {
      throw new Error(
        `PUBLISHER_BROWSER_PROXY_URL is not a usable http(s) proxy URL: ${browserProxyUrl}`,
      );
    }
    launchOptions.proxy = { server: `${parsedProxy.protocol}//${parsedProxy.host}` };
    if (parsedProxy.username) {
      launchOptions.proxy.username = parsedProxy.username;
      launchOptions.proxy.password = parsedProxy.password;
    }
  } else if (!browserbaseMode) {
    // No approved browser proxy and no Browserbase session path: local
    // Chromium would dial the target directly, which the publisher runtime
    // forbids. Fail with the same actionable message save-logo-asset.js and
    // the Browserbase connector use for this state.
    throw new Error(
      "PUBLISHER_BROWSER_PROXY_URL is not set. Website access has not been approved for this thread yet — request the website_access permission first, then retry.",
    );
  }
  if (!browserbaseMode) {
    const resolvedChromium = resolveChromiumExecutable();
    if (resolvedChromium.executablePath) {
      launchOptions.executablePath = resolvedChromium.executablePath;
    }
    if (resolvedChromium.source !== "env_pin") {
      process.stderr.write(JSON.stringify({
        level: resolvedChromium.executablePath ? "info" : "warn",
        event: "openPage.chromium_executable_fallback",
        source: resolvedChromium.source,
        executablePath: resolvedChromium.executablePath,
      }) + "\n");
    }
  }
  // Only the local-Chromium path tunnels through the publisher browser proxy;
  // in Browserbase mode the remote browser owns its own egress, so a tunnel
  // error there is not an approval problem.
  //
  // A `Boolean(browserProxyUrl) &&` conjunct used to lead this. It is implied:
  // the branch above THROWS for (no proxy URL AND not Browserbase), so by here
  // "no proxy URL" already means Browserbase mode.
  const proxiedLocalChromium = !browserbaseMode;
  let browser;
  let browserbaseSessionId = null;
  let browserbaseSession = null;
  // The thread's declared hosts, from the mint. Null in every state that has no
  // thread behind it — local-Chromium mode, and Browserbase's direct-API-key
  // dev rig — and null is what turns the navigation gate OFF. See the gate's
  // own comment above `isNavigationWithinAllowedHosts`.
  let allowedHosts = null;
  let browserHandedToCaller = false;
  try {
  if (browserbaseMode) {
    process.stderr.write(JSON.stringify({
      level: "info",
      event: "openPage.browser_mode",
      mode: "browserbase",
    }) + "\n");
    // Pass the target URL so the connector can auto-derive a proxy
    // country from its ccTLD (store-example.ua → UA, etc.). Pass observable
    // metadata so on-call can filter sessions in the Browserbase
    // dashboard by jobId / slug — KEEP VALUES SIMPLE: alphanumeric,
    // dash, underscore only. A raw URL value (with "://") triggered an
    // API rejection on 2026-05-28 in production (run
    // 01KSQ5WJJ1SV0B84YTS3RWZEM9), so the URL is intentionally NOT in
    // the payload — slug already encodes the site.
    const metadata = {
      ...(process.env.BRANDKIT_JOB_ID ? { jobId: process.env.BRANDKIT_JOB_ID } : {}),
      ...(args.slug ? { slug: args.slug } : {}),
    };
    let replayUrl = null;
    const connection = blockedFallbackSource
      ? await connectViaBrowserbaseBlockedFallback({
          sourceBrowser: blockedFallbackSource.browser,
          sourceSessionId: blockedFallbackSource.sessionId,
        })
      : await connectViaBrowserbase({
          targetUrl: args.url,
          metadata,
        });
    ({ browser, sessionId: browserbaseSessionId, replayUrl, allowedHosts } = connection);
    browserbaseSession = {
      sessionId: browserbaseSessionId,
      viaProxy: connection.viaProxy === true,
      proxiesEnabled: connection.proxiesEnabled === true,
      proxyCountry: connection.proxyCountry || null,
      residentialFallbackAvailable: connection.residentialFallbackAvailable === true,
    };
    process.stderr.write(JSON.stringify({
      level: "info",
      event: "openPage.browserbase_session",
      sessionId: browserbaseSessionId,
      replayUrl,
    }) + "\n");
    // FAIL OPEN, LOUDLY. A mint that returns no hosts is the dev rig (direct
    // API key, no mint at all) — but it is also what a renamed or dropped wire
    // field looks like, and that would silently disable the gate everywhere
    // while every test stayed green. Refusing to run instead would trade a
    // missing approval-boundary check for a universal outage, which is the
    // exact trade that broke this feature in the first place. So: allow, and
    // say so. A production run that logs this is a bug report.
    if (!Array.isArray(allowedHosts) || !allowedHosts.length) {
      allowedHosts = null;
      process.stderr.write(JSON.stringify({
        level: "warn",
        event: "openPage.navigation_gate_disabled",
        reason: "mint returned no allowedHosts",
        sessionId: browserbaseSessionId,
      }) + "\n");
    }
    // Wrap close() so the existing `finally { await browser.close(); }`
    // pattern in every caller also releases the Browserbase session.
    // Otherwise sessions linger at the 60-minute default timeout
    // (billed per-minute). Plan §1, §2.2 — zero call-site edits.
    const originalClose = browser.close.bind(browser);
    browser.close = async (...closeArgs) => {
      let released = false;
      try {
        await originalClose(...closeArgs);
      } finally {
        released = await releaseBrowserbaseSession(browserbaseSessionId);
      }
      return released;
    };
  } else {
    process.stderr.write(JSON.stringify({
      level: "info",
      event: "openPage.browser_mode",
      mode: "playwright-local",
    }) + "\n");
    try {
      browser = await chromium.launch(launchOptions);
    } catch (err) {
      // Awaited: the classifier probes the proxy's real CONNECT status rather
      // than reading approval state out of Chromium's collapsed code.
      await rethrowAsBrowserProxyRefusal(err, {
        targetUrl: args.url,
        browserProxyConfigured: proxiedLocalChromium,
        proxyUrl: browserProxyUrl,
      });
    }
  }
  // Browserbase pre-attaches a managed context with a coherent
  // fingerprint (real desktop UA, matching Accept-Language, timezone,
  // canvas/webgl noise, and webdriver hidden). Layering our own
  // userAgent + uk-UA locale + Europe/Kyiv timezone on top creates a
  // mismatched fingerprint that Cloudflare Turnstile refuses to clear
  // (confirmed empirically on store-example.ua — default context clears in ~13s,
  // overridden context times out at 60s). Reuse the pre-attached
  // context as-is.
  const context = browserbaseMode
    ? browser.contexts()[0] || (await browser.newContext())
    : await browser.newContext({
        userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
        viewport: { width: 1920, height: 1080 },
        locale: "uk-UA",
        timezoneId: "Europe/Kyiv",
        colorScheme: "light",
      });
  // TDZ, and it is not theoretical. This handler needs the primary page to ask
  // "is this the main frame?", but `const page` is created BELOW the
  // registration — and in Browserbase mode the page is PRE-ATTACHED, so it can
  // already be issuing requests while the handler is being installed. Reading a
  // `const` from its temporal dead zone throws ReferenceError INSIDE the
  // handler, which is a request with no verdict rather than a refusal. Hence a
  // hoisted `let`, assigned the moment the page exists, and a handler that
  // treats "not assigned yet" as "cannot be the primary main frame" — the same
  // fail-open the `frame()` catch below takes, for the same reason.
  let primaryPage = null;
  // The last primary-main-frame navigation this gate refused, so `page.goto`'s
  // catch can name the host. Chromium collapses the abort into
  // ERR_BLOCKED_BY_CLIENT, which is byte-identical to the outage signature and
  // names nothing.
  let refusedNavigation = null;
  await context.route("**/*", async (route) => {
    const req = route.request();
    const requestUrl = req.url();
    if (await shouldBlockExternalRequest(requestUrl)) {
      await route.abort("blockedbyclient");
      return;
    }
    // PRIMARY MAIN FRAME ONLY — iframes (the captcha challenge this function
    // waits for and clicks inside, every CMP/consent frame) and subresources
    // keep today's behaviour, the syntactic screen alone. See
    // `isPrimaryMainFrameNavigation`, which owns the fail-open arms.
    if (
      isPrimaryMainFrameNavigation(req, primaryPage)
      && allowedHosts
      && !isNavigationWithinAllowedHosts({
        requestUrl,
        redirectChainRootUrl: redirectChainRootUrl(req),
        committedDocumentUrl: primaryPage.url(),
        allowedHosts,
      })
    ) {
      let host = "";
      try {
        host = new URL(requestUrl).hostname;
      } catch {
        host = "";
      }
      refusedNavigation = { host, url: requestUrl };
      process.stderr.write(JSON.stringify({
        level: "warn",
        event: "openPage.navigation_outside_allowed_hosts",
        host,
        allowedHosts,
        // The committed document is what predicates (3) and (4) read; on a
        // refusal it is the difference between "the click left the approved
        // site" and "the run was pointed somewhere it never had approval for".
        from: primaryPage.url(),
      }) + "\n");
      await route.abort("blockedbyclient");
      return;
    }
    await route.continue();
  });
  // WEBSOCKETS ARE NOT SCREENED, deliberately, and the cost of screening them
  // was measured rather than estimated. `context.route` does not see `ws:`/
  // `wss:` at all, and Playwright's only interception API for them,
  // `context.routeWebSocket`, is implemented as a page init script that
  // REPLACES `globalThis.WebSocket`. Measured against pinned playwright 1.60.0,
  // with a matcher that matches nothing:
  //
  //   before: String(WebSocket) === "function WebSocket() { [native code] }",
  //           8+ own properties on WebSocket.prototype, no `__pw*` globals
  //   after:  "class WebSocket extends WebSocketMock {}", prototype own
  //           properties collapsed to ["constructor"], and TWO enumerable
  //           globals — `__pwWebSocketBinding`, `__pwWebSocketDispatch` —
  //           readable by any script on the page
  //
  // That is a page-visible "an automation framework is here" marker, strictly
  // louder than the `navigator.webdriver` double-getter this same function
  // refuses to install below because Cloudflare Turnstile flags it. Paying it
  // on every document, on the one path where a captcha has to clear, buys a
  // screen over a channel that can port-scan but cannot read an HTTP response
  // body. Not worth it. If it is ever revisited, re-run that measurement first
  // — the trade is entirely in Playwright's implementation, not in the idea.
  const page = browserbaseMode
    ? context.pages()[0] || (await context.newPage())
    : await context.newPage();
  primaryPage = page;
  const observedAssetUrls = new Set();
  const observedRequests = new Map();
  // Kept beside the census, not inside it: see `recordMainFrameNavigation`.
  const mainFrameNavigations = [];
  // Keeps the SVG logo bytes this render already downloaded, so `svgPath`
  // does not have to be re-fetched through the publisher browser proxy (which
  // admits only the hosts the thread's egress grant covers — a CDN-hosted
  // logo is refused there). See lib/logo-asset-capture.js.
  const logoBodyCache = createLogoBodyCache();

  // Captcha-solving handshake — only Browserbase emits these console
  // messages, but listening unconditionally is harmless on local
  // Playwright. Mirrors the official sdk-node example
  // (examples/playwright-captcha.ts): track when solving starts so we
  // know to wait for "finished" after navigation. networkidle alone is
  // not a reliable signal — a checkbox-hCaptcha solve does not trigger
  // a navigation, so the page can hit networkidle while Browserbase is
  // still solving in the background and we would exit on a challenge
  // page. Per the docs, solving can take up to ~30s.
  let captchaSolvingStarted = false;
  let captchaSolvingFinished = false;
  page.on("console", (msg) => {
    const text = msg.text();
    if (text === "browserbase-solving-started") {
      captchaSolvingStarted = true;
      process.stderr.write(JSON.stringify({
        level: "info",
        event: "openPage.captcha_solving_started",
      }) + "\n");
    } else if (text === "browserbase-solving-finished") {
      captchaSolvingFinished = true;
      process.stderr.write(JSON.stringify({
        level: "info",
        event: "openPage.captcha_solving_finished",
      }) + "\n");
    }
  });

  page.on("response", (response) => {
    try {
      const url = new URL(response.url());
      const status = response.status();
      const resourceType = response.request().resourceType();
      const method = response.request().method();
      const contentType = contentTypeFromHeaders(response.headers());
      recordObservedRequest(observedRequests, {
        url: url.toString(),
        method,
        resourceType,
        status,
        contentType,
      });
      if ((url.protocol === "http:" || url.protocol === "https:") && status < 400 && resourceType !== "document") {
        observedAssetUrls.add(url.toString());
      }
      // Tier 1 of the logo capture. `offer` is synchronous and never throws
      // (an exception out of this listener would kill it for every LATER
      // response, taking observedRequests / observedAssetUrls with it), and
      // it issues the body read immediately — waiting would let the page
      // navigate away and evict the CDP body.
      logoBodyCache.offer({
        url: url.toString(),
        status,
        resourceType,
        contentType,
        contentLength: Number(response.headers()["content-length"] ?? NaN),
        body: () => response.body(),
      });
      // LAST in this handler on purpose. Everything above is what the capture
      // has always collected; this is additive, and putting it here means a
      // surprise out of the Playwright frame API cannot cost a response its
      // record or its logo body. (`isMainFrameNavigationResponse` swallows its
      // own errors as well, so this is belt and braces.)
      if (isMainFrameNavigationResponse(response, page)) {
        recordMainFrameNavigation(mainFrameNavigations, {
          url: url.toString(),
          method,
          resourceType,
          status,
          contentType,
        });
      }
    } catch {
      // Ignore malformed URLs from the browser runtime.
    }
  });

  page.setDefaultTimeout(args.timeoutMs);
  page.setDefaultNavigationTimeout(args.timeoutMs);

  // Browserbase already hides navigator.webdriver via its managed
  // fingerprint; redefining the property on top of that produces a
  // detectable double-getter pattern that Cloudflare Turnstile flags.
  if (!browserbaseMode) {
    await page.addInitScript(() => {
      Object.defineProperty(navigator, "webdriver", {
        get: () => undefined,
      });
    });
  }
  await page.addInitScript({
    content: BROWSER_PROBE_HELPERS_SOURCE,
  });

  try {
    await page.goto(args.url, {
      waitUntil: args.waitUntil,
      timeout: args.timeoutMs,
    });
  } catch (err) {
    // An unapproved thread reaches HERE, not the "PUBLISHER_BROWSER_PROXY_URL
    // is not set" branch above: the proxy URL is minted every turn regardless
    // of approval, so the launch succeeds and the CONNECT is what gets denied.
    // A target site that is merely DOWN reaches here identically (Chromium
    // reports both as ERR_TUNNEL_CONNECTION_FAILED), which is why the
    // classifier probes the proxy instead of trusting that code.
    //
    // Close the browser FIRST: every path out of this catch throws, so the
    // launched browser would otherwise outlive `openPage` with no handle to
    // reach it. The publisher scripts exit the process on this error so the
    // leak was invisible there; any in-process caller (the integration
    // harness, a retry loop) accumulates one headless Chromium per failed
    // navigation. In Browserbase mode `close()` is also what releases the
    // remote session, which is billed per minute.
    const browserToClose = browser;
    browser = null;
    await browserToClose.close().catch(() => {});
    // OUR OWN refusal comes first, and it is checked rather than classified.
    // The abort reaches here as a bare ERR_BLOCKED_BY_CLIENT — the same string
    // the resolver outage produced — and in Browserbase mode the tunnel
    // classifier is called with `browserProxyConfigured:false` and returns null
    // by design, so `rethrowAsBrowserProxyRefusal` would pass that bare string
    // straight through, naming no host and pointing at the wrong cause. The
    // route handler already knows which host it refused; this is the only place
    // that can attach it.
    if (refusedNavigation) {
      throw navigationNotApprovedError({
        host: refusedNavigation.host,
        url: refusedNavigation.url,
        allowedHosts,
      });
    }
    await rethrowAsBrowserProxyRefusal(err, {
      targetUrl: args.url,
      browserProxyConfigured: proxiedLocalChromium,
      proxyUrl: browserProxyUrl,
    });
  }
  await page.waitForLoadState("networkidle", { timeout: Math.min(args.timeoutMs, OPEN_PAGE_MAX_NETWORK_SETTLE_MS) }).catch(() => {});

  // hCaptcha-checkbox handoff: Browserbase's auto-solver does not engage
  // on click-required captchas until they are activated. Imperva
  // specifically uses the "I am human" hCaptcha checkbox variant for
  // this reason. Replay evidence on shop-example.com (session
  // b085-4a8aba1c038f, 0:13 duration vs store-example.ua's 1:58) confirmed no
  // browserbase-solving-* events fired — the solver never saw an active
  // challenge. Click the checkbox iframe ourselves so the solver can
  // pick up the resulting puzzle / verification.
  //
  // Best-effort. Looks for an iframe whose src includes "hcaptcha" with
  // 3s for it to appear, then clicks #checkbox inside it. No-op on
  // pages with no hCaptcha widget. Errors swallowed — never block the
  // main path on captcha-helper failure.
  try {
    await page.waitForFunction(
      () => Array.from(document.querySelectorAll("iframe")).some((f) =>
        /hcaptcha/i.test(f.src || ""),
      ),
      null,
      { timeout: 3000 },
    );
    const checkboxFrame = page.frames().find((f) => {
      const u = f.url();
      return /hcaptcha/i.test(u) && /(checkbox|frame=checkbox|hcaptcha-checkbox)/i.test(u);
    });
    if (checkboxFrame) {
      await checkboxFrame.click("#checkbox", { timeout: 3000 }).catch(async () => {
        // Some hCaptcha builds use a different inner selector — try a
        // generic ARIA fallback before giving up.
        await checkboxFrame.click('div[role="checkbox"]', { timeout: 3000 }).catch(() => {});
      });
      process.stderr.write(JSON.stringify({
        level: "info",
        event: "openPage.hcaptcha_checkbox_clicked",
        frameUrl: checkboxFrame.url().slice(0, 200),
      }) + "\n");
      // Give Browserbase's solver a beat to register the now-active
      // challenge and emit browserbase-solving-started.
      await page.waitForTimeout(2000);
      await page.waitForLoadState("networkidle", { timeout: Math.min(args.timeoutMs, OPEN_PAGE_MAX_NETWORK_SETTLE_MS) }).catch(() => {});
    }
  } catch {
    // No hCaptcha iframe appeared within 3s — proceed normally.
  }

  // If a Browserbase captcha-solve has begun but not yet emitted
  // "finished", block here up to 60s. Conditional on captchaSolvingStarted
  // so non-captcha pages do not pay the wait. Aligns with the canonical
  // pattern in browserbase/sdk-node@main:examples/playwright-captcha.ts.
  if (captchaSolvingStarted && !captchaSolvingFinished) {
    const captchaDeadline = Date.now() + 60_000;
    while (!captchaSolvingFinished && Date.now() < captchaDeadline) {
      await page.waitForTimeout(500);
    }
    process.stderr.write(JSON.stringify({
      level: captchaSolvingFinished ? "info" : "warn",
      event: captchaSolvingFinished ? "openPage.captcha_wait_resolved" : "openPage.captcha_wait_timeout",
      waitedMs: Date.now() - (captchaDeadline - 60_000),
    }) + "\n");
    // The captcha-solve typically triggers a navigation; let the page
    // settle one more time so DOM-based probes see the final content.
    await page.waitForLoadState("networkidle", { timeout: Math.min(args.timeoutMs, OPEN_PAGE_MAX_NETWORK_SETTLE_MS) }).catch(() => {});
  }

  // THE REFUSAL PRODUCTION CAN ACTUALLY REACH IS THIS ONE, NOT THE `goto` ONE.
  // The catch above converts `refusedNavigation` for the INITIAL navigation —
  // and in via-proxy production that navigation can never be gate-refused,
  // because `_require_browserbase_target_approved` already 403'd an off-list
  // `args.url` before the session existed. Every refusal a real run can hit is
  // a mid-run drift: `runActions` clicks an agent-chosen selector, the page
  // walks off the approved document, and a LATER hop off that off-list document
  // is refused (one hop is permitted by design — see the gate's own comment).
  // That happens after the try/catch has closed, so before this the refusal
  // surfaced only as the `navigation_outside_allowed_hosts` WARN and then either
  // aborted quietly or came back as `runActions`' generic "did not match any
  // selector" — nothing that tells a human WHICH host to approve. This is not a
  // new failure: the navigation was already aborted and the page already stuck.
  // It is the same failure, named.
  let executedActions = [];
  try {
    executedActions = await maybeRunActionsFile(args, page);
    await page.waitForLoadState("networkidle", { timeout: Math.min(args.timeoutMs, OPEN_PAGE_MAX_NETWORK_SETTLE_MS) }).catch(() => {});
  } catch (err) {
    // An aborted main-frame navigation can also break the click that caused it.
    // Our own refusal is the better diagnosis whenever we have one; anything
    // else is a genuine actions failure and keeps its own error.
    if (!refusedNavigation) throw err;
  }
  if (refusedNavigation) {
    // Close first, for the same reason the `goto` catch does: this throws, so
    // the caller never gets the handle and the browser (and, in Browserbase
    // mode, the per-minute-billed remote session) would outlive the run.
    const browserToClose = browser;
    browser = null;
    await browserToClose.close().catch(() => {});
    throw navigationNotApprovedError({
      host: refusedNavigation.host,
      url: refusedNavigation.url,
      allowedHosts,
    });
  }
  await page.waitForTimeout(1000);

  browserHandedToCaller = true;
  return {
    browser,
    context,
    page,
    executedActions,
    observedAssetUrls,
    observedRequests: () => [...observedRequests.values()],
    mainFrameNavigations: () => [...mainFrameNavigations],
    // Additive: every other caller destructures a subset of this object, so
    // adding a key breaks nothing. `homepage-pass.js` is the only consumer.
    logoBodyCache,
    browserbaseSession,
  };
  } finally {
    // connectViaBrowserbase can succeed before context/page/routes/init-script
    // setup does. Until the full handle is returned, openPage owns the browser
    // and must close it so a paid standard or residential session is released.
    if (!browserHandedToCaller && browser) {
      await browser.close().catch(() => {});
    }
  }
}

export async function collectCaptureArtifacts(
  page,
  {
    args = {},
    screenshotPath = "",
    observedAssetUrls = new Set(),
    observedRequests = [],
    // NOT defaulted to `[]`. An absent list has to be distinguishable from an
    // empty one: absent means "a producer that did not record this" and the
    // detector falls back to the buckets; empty means "this producer recorded
    // no main-frame navigation at the landed URL", which is undecidable and
    // fails open. Defaulting would turn every caller that has not been wired
    // up into a silent fail-open.
    mainFrameNavigations = null,
    executedActions = [],
  } = {},
) {
  await settlePageForScreenshot(page, args.timeoutMs);
  await writeScreenshot(page, screenshotPath);
  const observedRequestSnapshot =
    typeof observedRequests === "function" ? observedRequests() : observedRequests;
  const mainFrameNavigationSnapshot =
    typeof mainFrameNavigations === "function" ? mainFrameNavigations() : mainFrameNavigations;

  const headAssets = await page.evaluate(() => {
    const normalize = (value) => String(value || "").replace(/\s+/g, " ").trim();
    const visibleText = (element) => {
      if (!(element instanceof Element)) return "";
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      if (style.display === "none" || style.visibility === "hidden" || rect.width <= 0 || rect.height <= 0) return "";
      const text = normalize(element.innerText || element.textContent || "");
      if (text.length < 3 || text.length > 220) return "";
      return text;
    };
    const observedHomepageCopy = { headings: [], hero: [], subheads: [], ctas: [] };
    const seenCopy = new Set();
    let copyCount = 0;
    const pushCopy = (bucket, text, limit = 3) => {
      const normalized = normalize(text).slice(0, 220);
      if (!normalized || observedHomepageCopy[bucket].length >= limit || seenCopy.has(normalized) || copyCount >= 8) return;
      seenCopy.add(normalized);
      observedHomepageCopy[bucket].push(normalized);
      copyCount += 1;
    };

    for (const element of [...document.querySelectorAll("h1, h2, h3")].slice(0, 24)) {
      pushCopy("headings", visibleText(element), 3);
    }
    for (const root of [...document.querySelectorAll("[class*='hero' i], [class*='banner' i], [class*='promo' i], main section, [role='banner']")].slice(0, 8)) {
      const rootText = visibleText(root);
      if (rootText && rootText.length <= 180) pushCopy("hero", rootText, 2);
      for (const element of [...root.querySelectorAll("h1, h2, p, [class*='title' i], [class*='subtitle' i]")].slice(0, 8)) {
        pushCopy("hero", visibleText(element), 2);
      }
    }
    for (const element of [...document.querySelectorAll("p, [class*='subtitle' i], [class*='description' i]")].slice(0, 32)) {
      pushCopy("subheads", visibleText(element), 2);
    }
    for (const element of [...document.querySelectorAll("button, [role='button'], a[href][class*='btn' i], a[href][class*='button' i]")].slice(0, 32)) {
      pushCopy("ctas", visibleText(element), 3);
    }

    const links = [...document.querySelectorAll("link[rel][href]")].map((element) => ({
      rel: element.getAttribute("rel") || "",
      href: element.href || element.getAttribute("href") || "",
      sizes: element.getAttribute("sizes") || "",
      type: element.getAttribute("type") || "",
    }));

    const icons = links.filter((item) => /(?:^|\s)(?:icon|shortcut icon|apple-touch-icon)(?:\s|$)/i.test(item.rel));
    const manifests = links.filter((item) => /(?:^|\s)manifest(?:\s|$)/i.test(item.rel));
    const maskIcons = links.filter((item) => /(?:^|\s)mask-icon(?:\s|$)/i.test(item.rel));
    const ogImage = document.querySelector('meta[property="og:image"]')?.getAttribute("content") || "";
    const description = document.querySelector('meta[name="description"]')?.getAttribute("content") || "";
    const themeColor = document.querySelector('meta[name="theme-color"]')?.getAttribute("content") || "";

    return {
      description,
      ogImage,
      themeColor,
      icons,
      manifests,
      maskIcons,
      observedHomepageCopy,
    };
  });

  const parsedHeadAssets = parseHeadAssetMetadata(headAssets);
  const parsedManifests = await parseManifestEntries(page, headAssets.manifests, args.timeoutMs);
  const landedUrl = page.url().split("#")[0];
  const observedRequestSummary = summarizeObservedRequests(observedRequestSnapshot, page.url());
  const mergedObservedAssetUrls = new Set([
    ...(observedAssetUrls instanceof Set ? [...observedAssetUrls] : Array.isArray(observedAssetUrls) ? observedAssetUrls : []),
    ...headAssets.icons.map((item) => item.href).filter(Boolean),
    ...headAssets.manifests.map((item) => item.href).filter(Boolean),
    ...headAssets.maskIcons.map((item) => item.href).filter(Boolean),
    ...parsedHeadAssets.favicons.map((item) => item.href).filter(Boolean),
    ...parsedManifests.flatMap((manifest) => manifest?.parsed?.icons?.map((icon) => icon.src) || []),
    headAssets.ogImage,
  ].filter(Boolean));

  return {
    url: page.url(),
    // The URL this pass was LAUNCHED with, recorded verbatim before any
    // redirect. `url` above is `page.url()` — where the capture landed.
    //
    // The satellites' site-match check needs the pre-redirect URL (apex ->
    // shop subdomain, ccTLD -> .com and post-rebrand consolidation all change
    // `landed` and never `requested`), and until now the only place that held
    // it was `brand.organization.website`, which SKILL.md mandates the AGENT
    // rewrite from scratch. An agent that recorded the canonical URL it
    // browsed turned `requested` into a second `landed`, and the satellite
    // then hard-stopped on its own site. This field is written by the runtime
    // from argv, so it cannot drift with the agent's judgement.
    requestedUrl: typeof args?.url === "string" ? args.url : "",
    // Sanitized actions that openPage actually executed to reach this render.
    // Recovery replays this hash-bound list; it never trusts an actions file by
    // path after capture.
    executedActions: Array.isArray(executedActions) ? executedActions : [],
    title: await page.title(),
    screenshotPath,
    viewport: page.viewportSize(),
    metadata: {
      description: headAssets.description,
      themeColor: headAssets.themeColor,
    },
    observedHomepageCopy: headAssets.observedHomepageCopy,
    headAssets: {
      icons: headAssets.icons,
      manifests: headAssets.manifests,
      maskIcons: headAssets.maskIcons,
      ogImage: headAssets.ogImage,
      parsedFavicons: parsedHeadAssets.favicons,
      parsedManifests,
    },
    observedAssetUrls: [...mergedObservedAssetUrls].sort(),
    sameOriginObservedRequests: observedRequestSummary.sameOriginObservedRequests,
    likelyHomepageDataCandidates: observedRequestSummary.likelyHomepageDataCandidates,
    // LAST in this object, and filtered to the landed URL, and both are about
    // `detectSecurityInterstitial` rather than about this field. That detector
    // walks the whole capture payload STRUCTURALLY -- every string is evidence
    // and every `https?://` string is a URL in its haystack, whatever key it
    // sits under -- with a 180-item budget filled in `Object.values` order.
    // Landed-URL-only means the sole URL this contributes is `url` above, a
    // string already in that haystack; last means anything it does add is
    // added after every existing field, so nothing that used to reach the
    // haystack can be displaced out of it. `[]` is written rather than the key
    // omitted whenever the producer supplied a list, because "the producer
    // looked and found nothing" is a different fact from "no producer looked".
    ...(mainFrameNavigationSnapshot === null || mainFrameNavigationSnapshot === undefined
      ? {}
      : { landedMainFrameDocuments: mainFrameDocumentsAtUrl(mainFrameNavigationSnapshot, landedUrl) }),
  };
}

function collectStringEvidence(value, target, limit = 180) {
  if (target.length >= limit) return;
  if (typeof value === "string") {
    const normalized = normalize(value);
    if (normalized) target.push(normalized);
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      collectStringEvidence(item, target, limit);
      if (target.length >= limit) return;
    }
    return;
  }
  if (isPlainObject(value)) {
    for (const item of Object.values(value)) {
      collectStringEvidence(item, target, limit);
      if (target.length >= limit) return;
    }
  }
}

function collectUrlEvidence(value, target, limit = 180) {
  if (target.length >= limit) return;
  if (typeof value === "string") {
    if (/^https?:\/\//i.test(value) || value.includes("/cdn-cgi/")) {
      target.push(value);
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      collectUrlEvidence(item, target, limit);
      if (target.length >= limit) return;
    }
    return;
  }
  if (isPlainObject(value)) {
    for (const item of Object.values(value)) {
      collectUrlEvidence(item, target, limit);
      if (target.length >= limit) return;
    }
  }
}

function collectVisibleInterstitialText({ capturePayload, domPayload }) {
  const visible = [];
  const add = (value) => {
    if (typeof value !== "string" || visible.length >= 180) return;
    const normalized = normalize(value);
    if (normalized) visible.push(normalized);
  };
  add(capturePayload?.title);
  add(capturePayload?.body);
  collectStringEvidence(capturePayload?.observedHomepageCopy, visible);
  const walkDom = (value) => {
    if (!value || visible.length >= 180) return;
    if (Array.isArray(value)) {
      for (const item of value) walkDom(item);
      return;
    }
    if (!isPlainObject(value)) return;
    add(value.text);
    for (const child of Array.isArray(value.children) ? value.children : []) walkDom(child);
  };
  walkDom(domPayload);
  return visible.join(" ").slice(0, 60000).toLowerCase();
}

export function detectSecurityInterstitial({
  capturePayload = null,
  domPayload = null,
  pageSignalsPayload = null,
} = {}) {
  const strings = [];
  const urls = [];
  collectStringEvidence(capturePayload, strings);
  collectStringEvidence(domPayload, strings);
  collectStringEvidence(pageSignalsPayload, strings);
  collectUrlEvidence(capturePayload, urls);
  collectUrlEvidence(pageSignalsPayload, urls);

  const title = typeof capturePayload?.title === "string" ? capturePayload.title : "";
  const textHaystack = strings.join(" ").slice(0, 60000).toLowerCase();
  const urlHaystack = urls.join(" ").toLowerCase();
  const titleHaystack = title.toLowerCase();
  const titleAndBody = `${titleHaystack} ${textHaystack}`;
  // Fallback eligibility has a deliberately narrower evidence channel than
  // broad blocker detection: only visible title/body/DOM text. Request URLs,
  // href/src attributes and residual challenge resources never enter it.
  const visibleHaystack = collectVisibleInterstitialText({ capturePayload, domPayload });

  // Live-content evidence — only appears while the page is actually
  // displaying the challenge. Cannot persist past a successful bypass:
  // when Cloudflare's challenge-platform redirects to real content the
  // DOM is replaced, so any of these patterns mean we are still on
  // the interstitial right now.
  const liveEvidence = [];
  if (/трохи зачекайте|just a moment|checking your browser|security check|перевірка безпеки|проверка безопасности/.test(titleAndBody)) {
    liveEvidence.push("security waiting/check text observed");
  }
  if (/підтвердьте,\s*що ви людина|confirm that you are human|verify you are human|verify.*human|not a bot|не бот/.test(textHaystack)) {
    liveEvidence.push("human verification text observed");
  }
  // `\b` on the bare `ray:` arm, and it is load-bearing rather than cosmetic.
  // `textHaystack` includes `dom.json` text, ONE live-evidence match sets
  // `blocked` with `fallbackEligible` false, and without the boundary the
  // substring matched `Array:`, `spray:`, `stray:` and `betray:` -- so a real
  // storefront that printed any of those anywhere in its DOM became a
  // homepage-blocked exit 3 with no residential retry.
  //
  // The boundary does NOT retire `X-Ray:`: a hyphen is itself a word boundary.
  // That one is left, named rather than papered over -- narrowing further
  // (requiring a hex id, say) is a different change needing its own evidence.
  if (/\bray id\b|\brayid\b|\bray\s*:/.test(textHaystack)) {
    liveEvidence.push("cloudflare ray id observed");
  }
  if (/incapsula incident id/i.test(textHaystack)) {
    liveEvidence.push("incapsula incident id observed");
  }

  // Resource evidence — recorded for diagnostics but never flips
  // blocked=true on its own. Browserbase's solveCaptchas loads
  // challenge-platform scripts and Cloudflare resources while
  // clearing the interstitial; those URLs remain in the request log
  // even after the page has navigated to real content.
  const resourceEvidence = [];
  if (/cdn-cgi\/challenge-platform|cf-turnstile|turnstile/.test(urlHaystack)) {
    resourceEvidence.push("cloudflare challenge-platform request observed");
  }
  if (/cloudflare/.test(textHaystack) || /cloudflare/.test(urlHaystack)) {
    resourceEvidence.push("cloudflare text or link observed");
  }
  if (/_incapsula_resource|imperva|incapsula/.test(urlHaystack)) {
    resourceEvidence.push("imperva/incapsula resource observed");
  }

  const evidence = [...liveEvidence, ...resourceEvidence];
  // BLANK RENDER. An anti-bot answer that carries no challenge text at all --
  // an empty document -- matches none of the provider rules above, so the pass
  // went on to report `completed` over a page with no title, no copy, no logo
  // candidate and no link, and a kit composed from that REPLACED a customer's
  // Brand Kit with nothing.
  //
  // All four signals are required. Alone, each one has a legitimate sparse-page
  // reading: a landing page with no nav links, a storefront whose mark is an
  // inline <svg> and leaves zero logo candidates. Replayed over every distinct
  // saved capture available (106 after de-duplicating byte-identical ones),
  // the conjunction trips the blank answer and nothing else; the sparsest
  // legitimate page in that set (6 text rows, 0 important links, 2 logo
  // candidates) is held out by the copy, title and logo conjuncts.
  //
  // All four are read from `capture.json` / `page-signals.json`, both written
  // at collect time, before the text and background probes run -- which is
  // where this branch is decided.
  //
  // ABSENT IS NOT BLANK, on either payload. A pass that died before
  // page-signals ran has no evidence the page was empty, and reading a missing
  // artifact as "0 candidates, 0 links" would turn every such pass into a
  // homepage block; `isPlainObject(pageSignalsPayload)` is what refuses that.
  // The capture side needs no separate guard: `copyEmpty` is false unless
  // `observedHomepageCopy` is itself an object, so a null/absent capture can
  // never satisfy the conjunction.
  const copy = capturePayload?.observedHomepageCopy;
  const copyEmpty = isPlainObject(copy)
    && Object.values(copy).every((list) => !Array.isArray(list) || list.length === 0);
  const logoCandidateCount = Array.isArray(pageSignalsPayload?.logoCandidates)
    ? pageSignalsPayload.logoCandidates.length
    : 0;
  const importantLinkCount = Array.isArray(pageSignalsPayload?.importantLinks)
    ? pageSignalsPayload.importantLinks.length
    : 0;
  const blankRender = liveEvidence.length === 0
    && isPlainObject(pageSignalsPayload)
    && title.trim() === ""
    && copyEmpty
    && logoCandidateCount === 0
    && importantLinkCount === 0;
  if (blankRender) {
    evidence.push("blank render: empty title, no homepage copy, 0 logo candidates, 0 important links");
  }
  const visibleHumanOrDenial = /confirm that you are human|verify you are human|verify.*human|not a bot|access denied|request unsuccessful|refused|forbidden|підтвердьте,\s*що ви людина|не бот/.test(visibleHaystack);
  const visibleWaiting = /just a moment|checking your browser|security check|трохи зачекайте|перевірка безпеки|проверка безопасности/.test(visibleHaystack);
  // Same pattern, same boundary. This arm decides the PROVIDER label and
  // `fallbackEligible`, so an unbounded `ray:` in the visible text of a
  // non-Cloudflare wall labelled it "cloudflare" and spent a paid residential
  // session on it.
  const visibleCloudflareProvider = /cloudflare|\bray id\b|\brayid\b|\bray\s*:/.test(visibleHaystack);
  const visibleImpervaIncident = /incapsula incident id/i.test(visibleHaystack);
  const exactCloudflareChallengeTitle = /^(?:just a moment(?:\.{0,3})?|трохи зачекайте(?:…|\.{0,3})?)$/i.test(title.trim());
  const cloudflareChallengeResource = /cdn-cgi\/challenge-platform/.test(urlHaystack);
  const impervaResource = /_incapsula_resource|imperva|incapsula/.test(urlHaystack);
  const impervaFallbackEligible = visibleImpervaIncident && visibleHumanOrDenial;
  const cloudflareFallbackEligible = (
    visibleCloudflareProvider && (visibleHumanOrDenial || visibleWaiting)
  ) || (exactCloudflareChallengeTitle && cloudflareChallengeResource);
  const fallbackEligible = impervaFallbackEligible || cloudflareFallbackEligible;
  const provider = (visibleImpervaIncident || impervaResource)
    ? "imperva"
    : (visibleCloudflareProvider || exactCloudflareChallengeTitle || cloudflareChallengeResource)
      ? "cloudflare"
      : "unknown";
  const blocked = liveEvidence.length >= 1 || blankRender;

  return {
    blocked,
    // A blank render only ever reaches here with zero live evidence (it is a
    // conjunct), so a live challenge always keeps the interstitial type.
    type: blankRender ? "blank_render" : (blocked ? "security_interstitial" : ""),
    provider: blocked ? provider : "",
    // `fallbackEligible: true` + `confidence: "high"` is exactly what
    // `initialFallbackStatus` requires to engage the residential retry, and a
    // blank document is the case where retrying from another egress is the
    // whole remedy -- the same URL renders normally through the proxy.
    confidence: blankRender
      ? "high"
      : blocked && (fallbackEligible || liveEvidence.length >= 2)
        ? "high"
        : blocked ? "medium" : "none",
    fallbackEligible: blankRender ? true : (blocked && fallbackEligible),
    fallbackReason: blankRender
      ? "blank_document_no_visible_evidence"
      : impervaFallbackEligible
        ? "imperva_live_incident_and_denial"
        : cloudflareFallbackEligible
          ? "cloudflare_live_provider_and_challenge"
          : "insufficient_provider_specific_live_evidence",
    title,
    evidence,
  };
}

// THE DOCUMENT WE GOT WAS NOT THE PAGE.
//
// `detectSecurityInterstitial` above asks what the rendered document SAYS.
// This asks what the server said when it SERVED it -- a different question,
// and the one nothing in this repo was asking: `page.goto`'s return value is
// discarded, and `capture.json` has carried the answer all along in
// `sameOriginObservedRequests.page[]`, unread.
//
// A run whose homepage was a 404 composed a kit from that error page, and
// because the save REPLACES the account it cleared eleven sections where the
// same site's real homepage clears five: six sections of real customer data
// destroyed. Nothing was fabricated -- a branded 404 carries the site's own
// chrome, so the colours and the logo matched -- the damage was deletion. The
// agent's own summary named the page as a branded 404 and saved anyway, so
// prose was not the place to fix it.
//
// ONLY THE LAST DOCUMENT THE MAIN FRAME NAVIGATED TO AT THE LANDED PAGE IS
// THE TRUTH, and every clause of that is load-bearing -- the last one because
// `resourceType: "document"` covers sub-frame navigations too. Measured
// over 50 archived captures: "any non-2xx anywhere in the chain" flags 10 of
// them, including legitimate storefronts whose Cloudflare challenge CLEARED
// (`[403, ..., 200]`). An UNCLEARED deny leaves a non-2xx as the last
// document; a cleared one does not. Reading the last entry separates the two
// with nothing tuned: the boundary is 2xx, which is the protocol's own line
// between "here is what you asked for" and "here is something else", not a
// number chosen because it happens to split this corpus.
//
// FAIL OPEN on everything undecidable -- no document request recorded, none
// recorded for the landed URL, or no integer status on the last one. A capture
// that recorded nothing is not evidence that the server refused; it is the
// absence of evidence, and a refusal that deletes a run may not be guessed at.
//
// NOT COVERED, deliberately: a soft 404 (an error page served with 200). This
// reads the status the server sent, and a 200 is a 200.
export function detectLandedDocumentError({ capturePayload = null } = {}) {
  const buckets = capturePayload?.sameOriginObservedRequests;
  const pageRequests = isPlainObject(buckets) && Array.isArray(buckets.page) ? buckets.page : [];
  // TWO FILTERS, because neither alone names the page.
  //
  // `page` is a CATEGORY, not a frame: `classifyObservedRequest` files any
  // same-origin `text/html` response there, whatever fetched it. Only a
  // `document` request is a navigation, so only those are candidates.
  //
  // And `document` is not the MAIN frame. Chromium reports `resourceType:
  // "document"` for a SUB-FRAME navigation exactly as it does for the top one,
  // so a consent iframe, an edge-provider resource frame or a shop-login
  // callback frame is a `document` too. Measured over the archived captures: 8
  // of 49 already have a sub-frame document as the last one — all 2xx today,
  // which is the only reason nothing has been refused over one yet. So the
  // deciding document has to be the one whose URL IS the page we landed on;
  // anything else can hold a status that says nothing about the site.
  //
  // Fragments are stripped because a document request never carries one while
  // `url` can. If no document matches the landed URL — an SPA that rewrote its
  // own address after load leaves none — this decides nothing, which is the
  // same fail-open the no-document case takes.
  //
  // AND THE THIRD FILTER, WHERE THE PRODUCER SUPPLIED IT: the document has to
  // be one the MAIN FRAME NAVIGATED TO. The two filters above are all a bucket
  // record can support -- it carries `{url, method, resourceType, status,
  // contentType}` and nothing that says which frame committed it -- so a
  // same-URL document that is NOT the navigation's answer (a `<iframe src="/">`,
  // an html body fetched at the landed URL, a later re-issue) was
  // indistinguishable from it, and would have refused a storefront that was
  // served its homepage. `landedMainFrameDocuments` is that missing fact,
  // recorded at the only place it is knowable: see
  // `isMainFrameNavigationResponse`. Same-origin SUB-FRAME documents are
  // routine live -- a Shopify shop-login callback, a GTM `sw_iframe`, a Criteo
  // `syncframe` -- and one of them at the landed URL is the whole exposure.
  //
  // ABSENT means an older producer wrote this capture, and the buckets are
  // read exactly as before rather than the refusal being silently switched
  // off. PRESENT AND EMPTY means this producer looked and saw no main-frame
  // navigation at the landed URL, which is undecidable, and fails open.
  const landedUrl = typeof capturePayload?.url === "string" ? capturePayload.url.split("#")[0] : "";
  const declaredDocuments = Array.isArray(capturePayload?.landedMainFrameDocuments)
    ? capturePayload.landedMainFrameDocuments
    : null;
  const documents = landedUrl
    ? (declaredDocuments || pageRequests).filter(
      (record) => isPlainObject(record)
        && String(record.resourceType || "").toLowerCase() === "document"
        && String(record.url || "").split("#")[0] === landedUrl,
    )
    : [];
  const last = documents.length ? documents[documents.length - 1] : null;
  if (!last) {
    return { blocked: false, status: null, url: "", documentCount: 0, evidence: [] };
  }
  const status = Number.isInteger(last.status) && last.status >= 100 && last.status <= 599 ? last.status : null;
  const url = typeof last.url === "string" ? last.url : "";
  const blocked = status !== null && (status < 200 || status >= 300);
  return {
    blocked,
    status,
    url,
    documentCount: documents.length,
    evidence: blocked
      ? [`final main-frame document returned HTTP ${status}${url ? ` for ${url}` : ""}`]
      : [],
  };
}

export async function collectDomHierarchy(page) {
  return safePageEvaluate(page, () => {
    const normalize = (text) => String(text || "").replace(/\s+/g, " ").trim();
    const isVisible = (element) => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity || "1") > 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    };

    const build = (element) => {
      if (!isVisible(element)) return null;
      const href = element.getAttribute("href");
      const src = element.getAttribute("src");
      const node = {
        tag: element.tagName.toLowerCase(),
        id: element.id || "",
        class: typeof element.className === "string" ? element.className : "",
        text: normalize(element.innerText || element.textContent || "").slice(0, 160),
        url: href ? new URL(href, window.location.href).toString() : "",
        src: src ? new URL(src, window.location.href).toString() : "",
        children: [],
      };

      for (const child of element.children) {
        const childNode = build(child);
        if (childNode) {
          node.children.push(childNode);
        }
      }

      if (!node.children.length && !node.text && !node.id && !node.class && !node.url && !node.src) {
        return null;
      }

      return node;
    };

    return build(document.body);
  });
}

export async function collectBackgroundStyles(page, selectors) {
  return page.evaluate((activeSelectors) => {
    const probeHelpers = window.__brandkitProbeHelpers || {};
    const normalize = probeHelpers.normalizeWhitespace || ((text) => String(text || "").replace(/\s+/g, " ").trim());
    const toHex = probeHelpers.toHex || (() => null);
    const pickBorderColor = probeHelpers.pickBorderColor || ((style) => toHex(style?.borderColor));
    const parseGradient = probeHelpers.parseGradient || (() => null);
    const isVisible =
      probeHelpers.isVisibleElement ||
      ((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      });

    const rows = [];
    const viewportArea = Math.max(1, window.innerWidth * window.innerHeight);
    const colorChannelDelta = (hex) => {
      if (!/^#[0-9a-f]{6}$/i.test(hex || "")) return 0;
      const red = Number.parseInt(hex.slice(1, 3), 16);
      const green = Number.parseInt(hex.slice(3, 5), 16);
      const blue = Number.parseInt(hex.slice(5, 7), 16);
      return Math.max(red, green, blue) - Math.min(red, green, blue);
    };
    const isNeutralColor = (hex) => {
      if (!/^#[0-9a-f]{6}$/i.test(hex || "")) return false;
      const red = Number.parseInt(hex.slice(1, 3), 16);
      const green = Number.parseInt(hex.slice(3, 5), 16);
      const blue = Number.parseInt(hex.slice(5, 7), 16);
      const delta = Math.max(red, green, blue) - Math.min(red, green, blue);
      return delta <= 10;
    };
    const roleHintFor = (element) => {
      const tag = element.tagName.toLowerCase();
      const meta = [
        tag,
        element.getAttribute("role") || "",
        element.getAttribute("aria-label") || "",
        element.getAttribute("id") || "",
        element.getAttribute("class") || "",
      ].join(" ").toLowerCase();
      if (tag === "header" || /\bheader\b|site-header|topbar|top-bar/.test(meta)) return "header";
      if (tag === "footer" || /\bfooter\b|site-footer/.test(meta)) return "footer";
      if (tag === "nav" || /\bnav\b|navigation|menu|catalog|каталог|категор|категор/.test(meta)) return "navigation";
      if (/hero|banner|promo|promotion|campaign|sale|deal|акц|зниж|скид|розпрод|реклам/.test(meta)) return "promo";
      if (/category|categories|tile|card|section|grid/.test(meta)) return "content-surface";
      if (/modal|popup|popover|toast|drawer/.test(meta)) return "overlay";
      if (tag === "main") return "main";
      if (tag === "body") return "page";
      return "surface";
    };
    const rowForElement = (element, selector, matchIndex, source) => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      const backgroundImage = style.backgroundImage === "none" ? "" : style.backgroundImage;
      const backgroundColor = toHex(style.backgroundColor);
      const borderColor = pickBorderColor(style);
      const gradient = backgroundImage ? parseGradient(backgroundImage) : null;
      const area = Math.max(0, rect.width) * Math.max(0, rect.height);
      const roleHint = roleHintFor(element);
      const hasGradientColor = Boolean(gradient?.stops?.some?.((stop) => stop?.color));
      let score = 0;
      if (backgroundColor) score += 8;
      if (backgroundColor && !isNeutralColor(backgroundColor)) score += 10 + Math.min(20, colorChannelDelta(backgroundColor) / 6);
      if (hasGradientColor) score += 14;
      if (borderColor && !isNeutralColor(borderColor)) score += 4;
      if (["header", "footer", "navigation", "promo", "main", "page"].includes(roleHint)) score += 8;
      score += Math.min(24, area / viewportArea * 40);
      return {
        selector,
        matchIndex,
        source,
        roleHint,
        tag: element.tagName.toLowerCase(),
        text: normalize(element.innerText || element.textContent || "").slice(0, 140),
        backgroundColor,
        borderColor,
        backgroundImage,
        gradient,
        rect: {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
        },
        areaPx: Math.round(area),
        viewportCoverage: Number((area / viewportArea).toFixed(4)),
        isNeutralBackground: Boolean(backgroundColor && isNeutralColor(backgroundColor)),
        evidenceScore: Number(score.toFixed(2)),
      };
    };

    for (const selector of activeSelectors) {
      let elements = [];
      try {
        elements = [...document.querySelectorAll(selector)].filter(isVisible);
      } catch {
        continue;
      }
      elements.forEach((element, index) => {
        rows.push(rowForElement(element, selector, index, "selector"));
      });
    }

    const autoRows = [];
    const seen = new Set();
    for (const element of [...document.querySelectorAll("body, header, nav, main, footer, section, aside, [role='banner'], [role='navigation'], [role='contentinfo'], [class*='hero'], [class*='banner'], [class*='promo'], [class*='sale'], [class*='category'], [class*='catalog'], [class*='menu'], [class*='footer'], [class*='header'], [class*='top'], [class*='app'], [class*='subscribe'], div")]) {
      if (!isVisible(element)) continue;
      const rect = element.getBoundingClientRect();
      if (rect.width < 24 || rect.height < 16) continue;
      const row = rowForElement(element, "", autoRows.length, "visible-surface");
      const hasUsefulColor = Boolean(
        row.backgroundColor ||
          row.gradient?.stops?.length ||
          (row.borderColor && !row.isNeutralBackground && row.borderColor !== "#000000"),
      );
      if (!hasUsefulColor) continue;
      if (row.areaPx < 700 && !["header", "footer", "navigation", "promo"].includes(row.roleHint)) continue;
      const key = [
        row.roleHint,
        row.tag,
        row.backgroundColor || "",
        row.borderColor || "",
        Math.round(row.rect.x / 20),
        Math.round(row.rect.y / 20),
        Math.round(row.rect.width / 20),
        Math.round(row.rect.height / 20),
      ].join("|");
      if (seen.has(key)) continue;
      seen.add(key);
      autoRows.push(row);
    }
    autoRows.sort((left, right) => right.evidenceScore - left.evidenceScore);

    // Rendered-canvas-pixel sample (Fix B). When both `<body>` and
    // `<html>` are transparent — common on Tailwind / SSR / modern-
    // React sites including store-example.ua and shop-example.com — the DOM doesn't
    // tell us what canvas color the user actually sees. The visible
    // canvas is either painted by a wide opaque ancestor below body
    // OR the browser's UA default (universally white). Without this
    // sample, the canvas ranker falls back to weighted DOM evidence —
    // typically a tinted footer strip wins and the customise pipeline
    // renders the email wrapper in the wrong color (the store-example.ua gray-
    // body regression). We probe-side this by walking up from the
    // viewport-center element to the first opaque ancestor; if the
    // ancestor covers > 80% of viewport width (i.e. is a real canvas-
    // class surface, not a hero/modal) we emit its bg as a synthetic
    // canvas-pixel row. If no opaque ancestor exists at all, UA
    // default applies and we emit white. The row is only emitted when
    // the resulting hex is neutral (low saturation) — rejects hero
    // splashes and brand-colored full-bleed banners that could fool
    // the sample. The ranker treats `selector === "(rendered-canvas-
    // pixel)"` as a high-weight anchor (see assemble-candidates.js
    // CANVAS_ANCHOR_WEIGHTS) so this row wins over footer/header
    // aggregates when it fires.
    try {
      const bodyBg = toHex(window.getComputedStyle(document.body).backgroundColor);
      const htmlBg = toHex(window.getComputedStyle(document.documentElement).backgroundColor);
      if (!bodyBg && !htmlBg) {
        const sampleX = window.innerWidth * 0.5;
        const sampleY = window.innerHeight * 0.45;
        const sampleEl = document.elementFromPoint(sampleX, sampleY);
        let opaqueAncestor = sampleEl;
        while (opaqueAncestor) {
          const rawBg = window.getComputedStyle(opaqueAncestor).backgroundColor;
          if (rawBg && rawBg !== "rgba(0, 0, 0, 0)" && rawBg !== "transparent") break;
          opaqueAncestor = opaqueAncestor.parentElement;
        }
        let sampledHex = null;
        let sampledTag = "html";
        if (opaqueAncestor) {
          const rect = opaqueAncestor.getBoundingClientRect();
          const widthRatio = window.innerWidth > 0 ? rect.width / window.innerWidth : 0;
          if (widthRatio > 0.8) {
            sampledHex = toHex(window.getComputedStyle(opaqueAncestor).backgroundColor);
            sampledTag = opaqueAncestor.tagName.toLowerCase();
          }
          // else: opaque ancestor too narrow (hero / modal / card) — skip
        } else {
          // No opaque ancestor anywhere up the tree. UA default canvas
          // color is white in every mainstream browser+OS combination.
          sampledHex = "#ffffff";
          sampledTag = "ua-default";
        }
        if (sampledHex && isNeutralColor(sampledHex)) {
          rows.push({
            selector: "(rendered-canvas-pixel)",
            matchIndex: 0,
            source: "pixel-sample",
            roleHint: "page",
            tag: sampledTag,
            text: "",
            backgroundColor: sampledHex,
            borderColor: null,
            backgroundImage: "",
            gradient: null,
            rect: {
              x: 0,
              y: 0,
              width: Math.round(window.innerWidth),
              height: Math.round(window.innerHeight),
            },
            areaPx: Math.round(window.innerWidth * window.innerHeight),
            viewportCoverage: 1,
            isNeutralBackground: true,
            evidenceScore: 100,
          });
        }
      }
    } catch {
      // Defensive: pixel sampling must never block the rest of the probe.
    }

    return [...rows, ...autoRows.slice(0, 80)];
  }, Array.isArray(selectors) ? selectors.filter(Boolean) : []);
}

export async function collectTextStyles(page, selectors) {
  return page.evaluate((activeSelectors) => {
    const probeHelpers = window.__brandkitProbeHelpers || {};
    const normalize = probeHelpers.normalizeWhitespace || ((text) => String(text || "").replace(/\s+/g, " ").trim());
    const recoverVisibleLabel =
      probeHelpers.recoverVisibleLabel ||
      ((element) => ({
        text: normalize(element?.innerText || element?.textContent || ""),
        source: "inner-text",
        hasUsableVisibleText: true,
        recoveredFromDescendant: false,
        fragmentCount: 0,
      }));
    const toHex = probeHelpers.toHex || (() => null);
    const normalizeFontWeight = probeHelpers.normalizeFontWeight || ((value) => Number.parseInt(value, 10) || null);
    const parsePxFromComputed = probeHelpers.parsePxFromComputed || ((value) => {
      const parsed = Number.parseFloat(value);
      return Number.isFinite(parsed) ? parsed : null;
    });
    const parseLineHeightPx = probeHelpers.parseLineHeightPx || ((style) => {
      const parsed = Number.parseFloat(style?.lineHeight);
      return Number.isFinite(parsed) ? parsed : null;
    });
    const readTypographyStyle =
      probeHelpers.readTypographyStyle ||
      ((style) => {
        const fontSizePx = parsePxFromComputed(style?.fontSize);
        return {
          fontFamily: style?.fontFamily || null,
          fontWeight: normalizeFontWeight(style?.fontWeight),
          fontSize: style?.fontSize || null,
          fontSizePx,
          lineHeight: style?.lineHeight || null,
          lineHeightPx: parseLineHeightPx(style, fontSizePx),
          letterSpacing: style?.letterSpacing || null,
          letterSpacingPx: parsePxFromComputed(style?.letterSpacing),
          fontStyle: style?.fontStyle || null,
          textTransform: style?.textTransform || null,
        };
      });
    const isVisible =
      probeHelpers.isVisibleElement ||
      ((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      });

    const rows = [];
    for (const selector of activeSelectors) {
      let elements = [];
      try {
        elements = [...document.querySelectorAll(selector)].filter(isVisible);
      } catch {
        continue;
      }
      elements.forEach((element, index) => {
        const style = window.getComputedStyle(element);
        const rawText = normalize(element.innerText || element.textContent || "");
        const label = recoverVisibleLabel(element);
        rows.push({
          selector,
          matchIndex: index,
          tag: element.tagName.toLowerCase(),
          text: (label.hasUsableVisibleText ? label.text : rawText || label.text).slice(0, 140),
          textSource: label.source || "inner-text",
          color: toHex(style.color),
          ...readTypographyStyle(style),
          selectionSignals: {
            hasUsableVisibleText: Boolean(label.hasUsableVisibleText),
            recoveredFromDescendant: Boolean(label.recoveredFromDescendant),
            labelFragmentCount: Number.isInteger(label.fragmentCount) ? label.fragmentCount : 0,
          },
        });
      });
    }
    return rows;
    // `normalizeSelectorList`, not a local `filter(Boolean)`: the probed
    // list is recorded to `text-styles.probed.json` as provenance, and a
    // record that normalises differently from the probe is not provenance.
  }, normalizeSelectorList(selectors));
}

export async function collectLanguageSubtree(page, selectors) {
  const activeSelectors = Array.isArray(selectors) ? selectors.filter(Boolean) : [];
  if (!activeSelectors.length) {
    return {
      pageUrl: page.url(),
      matches: [],
    };
  }

  return safePageEvaluate(
    page,
    ({ selectors: collectorSelectors }) => {
      const normalize = (text) => String(text || "").replace(/\s+/g, " ").trim();
      const isVisible = (element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity || "1") > 0 &&
          rect.width > 0 &&
          rect.height > 0
        );
      };

      const build = (element) => {
        if (!isVisible(element)) return null;

        const href = element.getAttribute("href");
        const node = {
          tag: element.tagName.toLowerCase(),
          id: element.id || "",
          class: typeof element.className === "string" ? element.className : "",
          text: normalize(element.innerText || element.textContent || ""),
          url: href ? new URL(href, window.location.href).toString() : "",
          children: [],
        };

        for (const child of element.children) {
          const childNode = build(child);
          if (childNode) {
            node.children.push(childNode);
          }
        }

        if (!node.children.length && !node.text && !node.id && !node.class && !node.url) {
          return null;
        }

        return node;
      };

      const matches = [];
      for (const selector of collectorSelectors) {
        let elements = [];
        try {
          elements = Array.from(document.querySelectorAll(selector)).filter(isVisible);
        } catch {
          elements = [];
        }
        for (const element of elements) {
          const subtree = build(element);
          if (!subtree) continue;
          matches.push({
            selector,
            subtree,
          });
        }
      }

      return {
        pageUrl: window.location.href,
        matches,
      };
    },
    { selectors: activeSelectors },
  );
}

export async function collectPageSignals(page) {
  const payload = await safePageEvaluate(page, () => {
    const normalize = (text) => String(text || "").replace(/\s+/g, " ").trim();
    const isVisible = (element) => {
      if (!(element instanceof Element)) return false;
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        Number(style.opacity || "1") > 0 &&
        rect.width > 0 &&
        rect.height > 0
      );
    };
    const uniqueBy = (items, keyFor) => {
      const seen = new Set();
      return items.filter((item) => {
        const key = keyFor(item);
        if (!key || seen.has(key)) {
          return false;
        }
        seen.add(key);
        return true;
      });
    };
    const absoluteUrl = (value) => {
      if (!value) return "";
      try {
        return new URL(value, window.location.href).toString();
      } catch {
        return "";
      }
    };
    const cssEscape = (value) => {
      const stringValue = String(value || "");
      if (!stringValue) return "";
      if (window.CSS && typeof window.CSS.escape === "function") {
        return window.CSS.escape(stringValue);
      }
      return stringValue.replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`);
    };
    const simpleSelectorFor = (element) => {
      if (!(element instanceof Element)) return "";
      if (element.id) {
        return `#${cssEscape(element.id)}`;
      }
      const classNames = typeof element.className === "string"
        ? element.className
            .split(/\s+/)
            .map((value) => value.trim())
            .filter(Boolean)
            .map(cssEscape)
            .slice(0, 3)
        : [];
      if (classNames.length) {
        return `${element.tagName.toLowerCase()}.${classNames.join(".")}`;
      }
      return element.tagName.toLowerCase();
    };
    // A HOST is a domain, not a substring. `/facebook\.com/` over the whole
    // URL string called `notfacebook.com.evil.test`, `myfacebook.com.br` and
    // `example.com/redirect?to=facebook.com` all Facebook profiles, and
    // `/wa\.me/` matched `/wa.mexico`. Parsing the URL and comparing whole
    // domain labels is the only spelling that has a boundary at all. This is
    // the same rule `social-signals.js` `socialUrlScore` already applies when
    // it ranks the rows this function classifies -- one question, one answer.
    const urlParts = (value) => {
      try {
        const parsed = new URL(String(value || ""));
        return {
          scheme: parsed.protocol.toLowerCase(),
          host: parsed.hostname.toLowerCase().replace(/^www\./, ""),
          path: parsed.pathname.toLowerCase(),
          // The QUERY, never the host. `api.whatsapp.com/send?phone=` and
          // `api.whatsapp.com/send?text=` are the same path: one names a
          // recipient, the other posts the current page. A path-only share
          // test cannot tell them apart and called both profiles.
          query: parsed.search.toLowerCase(),
        };
      } catch {
        return { scheme: "", host: "", path: "", query: "" };
      }
    };
    // `host === domain` or a subdomain of it. `uk-ua.facebook.com` is a real
    // localized profile host and must pass; `notfacebook.com` must not.
    const hostIsUnder = (host, domains) =>
      !!host && domains.some((domain) => host === domain || host.endsWith(`.${domain}`));
    // Platforms that publish under many ccTLDs (pinterest.co.uk, yelp.fr)
    // cannot be listed host-by-host, so the registrable label is matched
    // against an explicit set of REAL public suffixes.
    //
    // "At most two trailing alphabetic labels" was one level too shallow to
    // be a boundary: `pinterest.blogspot.com`, `pinterest.evil.test` and
    // `yelp.example.test` every one satisfied it, so the same lookalike class
    // the host test exists to refuse walked in through the two platforms that
    // use this path. A suffix must now BE a suffix.
    //
    // The list is the TLDs these two platforms actually publish under plus the
    // markets this pipeline serves; it is deliberately finite, and the failure
    // mode of a missing entry is silence about one real profile rather than a
    // fabricated one, which is the direction this file errs in everywhere.
    const PUBLIC_SUFFIX_TLDS = new Set([
      "com", "net", "org", "info", "biz",
      "at", "au", "be", "br", "ca", "ch", "cl", "cz", "de", "dk", "es", "fi",
      "fr", "gr", "hu", "ie", "in", "it", "jp", "kr", "kz", "lt", "lv", "md",
      "mx", "nl", "no", "nz", "ph", "pl", "pt", "ro", "rs", "ru", "se", "sg",
      "sk", "th", "tr", "ua", "uk", "us", "za",
    ]);
    // The generic second level of a two-part public suffix: `pinterest.co.uk`,
    // `yelp.com.au`. Nothing else may occupy that slot -- that is exactly what
    // lets `blogspot.com` and `evil.test` through when it is unconstrained.
    const PUBLIC_SUFFIX_SECOND_LEVEL = new Set(["co", "com", "net", "org"]);
    const hostRegistrableLabelIs = (host, label) => {
      const parts = String(host || "").split(".");
      const index = parts.lastIndexOf(label);
      if (index < 0) return false;
      const suffix = parts.slice(index + 1);
      if (suffix.length === 1) return PUBLIC_SUFFIX_TLDS.has(suffix[0]);
      if (suffix.length === 2) {
        return (
          PUBLIC_SUFFIX_SECOND_LEVEL.has(suffix[0]) && PUBLIC_SUFFIX_TLDS.has(suffix[1])
        );
      }
      return false;
    };
    // A SHARE / AUTH endpoint on a social host is a button that posts the
    // CURRENT page to that network. It is evidence the site has a share
    // widget, never evidence the brand owns a profile there -- and a
    // storefront carries one per product card, so they arrive by the dozen.
    // Matched on whole path segments so a brand really called `/sharekitchen`
    // survives.
    //
    // The token list is deliberately SHORT and observed, not exhaustive. Each
    // entry is a real endpoint on the platform that owns it (facebook
    // `/sharer/`, `/dialog/`, `/plugins/`; twitter `/intent/`; linkedin
    // `/shareArticle`, `/sharing/share-offsite/`; pinterest `/pin/create/`;
    // telegram `/share/url`; `/login` and `/oauth` auth walls). Plausible
    // vanity handles -- `connect`, `signup`, `widgets` -- are left OUT on
    // purpose: this gate is advisory, and refusing a brand's real profile is
    // a worse error than staying quiet about a share button.
    // THE QUERY, for the share shapes whose PATH is indistinguishable from a
    // real one. `api.whatsapp.com/send?text=...` posts the current page and
    // `api.whatsapp.com/send?phone=...` opens a chat with the brand: same
    // host, same path, and only the parameters say which. `wa.me/?text=...`
    // is the same button with no path at all.
    //
    // `u=`, `url=` and `text=` name the CONTENT being posted. They are only
    // decisive on a COMPOSE path (`/` or `/send`), because on any other path
    // the URL has already named a recipient and the text is a prefilled
    // message TO that account -- `wa.me/380441234567?text=Hi` and
    // `m.me/acme?text=Hi` are published profiles in this market, and reading
    // `text=` alone would trade a false positive for a false negative on a
    // link the brand owns. `phone=` says the same thing on the compose path
    // itself, so it is carved out explicitly.
    const SHARE_QUERY_RE = /[?&](?:u|url|text)=/;
    const RECIPIENT_QUERY_RE = /[?&]phone=\d/;
    const COMPOSE_PATH_RE = /^\/?$|^\/send\/?$/;
    const isSocialShareEndpoint = (path, query) =>
      /(^|\/)(sharer|share|sharing|share-offsite|sharearticle|intent|dialog|plugins|oauth|oauth2|login|signin)(\/|$|\.)/.test(path) ||
      /(^|\/)pin\/create(\/|$)/.test(path) ||
      (SHARE_QUERY_RE.test(query) &&
        COMPOSE_PATH_RE.test(path) &&
        !RECIPIENT_QUERY_RE.test(query));
    // A CONTENT permalink is a post, a video, a reel -- a thing the brand (or
    // anyone) published, not the account that published it. `youtube.com/watch
    // ?v=`, `youtu.be/<id>` and `instagram.com/p/<id>` are the shapes a
    // storefront embeds next to a product, and every one of them classified as
    // "the brand has a YouTube/Instagram profile" with a URL the Brand Kit
    // would then store as that profile.
    //
    // Their PATHS are indistinguishable from a profile's by any generic rule
    // (`/watch` and `/acme` are both one segment), so the discrimination has
    // to be per-platform and therefore OBSERVED, not exhaustive -- the same
    // stance the share-token list above takes, and for the same reason: a
    // missing shape stays a profile, which is the quiet failure.
    //
    // youtu.be is total rather than path-matched because it serves nothing but
    // video shortlinks: there is no channel URL on that host to lose.
    const isSocialContentPermalink = (host, path) => {
      if (hostIsUnder(host, ["youtu.be"])) return /^\/.+/.test(path);
      if (hostIsUnder(host, ["youtube.com"])) return /^\/watch(\/|$)/.test(path);
      if (hostIsUnder(host, ["instagram.com"])) return /^\/p\/.+/.test(path);
      return false;
    };
    const socialPlatformFor = ({ url, text, label, title, className }) => {
      const normalizedUrl = String(url || "").toLowerCase();
      const normalizedHints = [
        text,
        label,
        title,
        typeof className === "string" ? className : "",
      ]
        .map((value) => normalize(value).toLowerCase())
        .filter(Boolean)
        .join(" ");
      const { scheme, host, path, query } = urlParts(url);
      const platformFromHost = (() => {
        if (hostIsUnder(host, ["facebook.com", "fb.com", "fb.me"])) return "facebook";
        if (hostIsUnder(host, ["instagram.com"])) return "instagram";
        if (hostIsUnder(host, ["t.me", "telegram.me", "telegram.org", "telegram.dog"])) return "telegram";
        if (scheme === "tg:") return "telegram";
        if (hostIsUnder(host, ["youtube.com", "youtu.be"])) return "youtube";
        if (hostIsUnder(host, ["tiktok.com"])) return "tiktok";
        if (hostIsUnder(host, ["linkedin.com"])) return "linkedin";
        if (hostIsUnder(host, ["twitter.com"])) return "twitter";
        if (hostIsUnder(host, ["x.com"])) return "x";
        if (hostRegistrableLabelIs(host, "pinterest")) return "pinterest";
        if (hostIsUnder(host, ["snapchat.com"])) return "snapchat";
        if (hostIsUnder(host, ["threads.net"])) return "threads";
        if (hostIsUnder(host, ["discord.com", "discordapp.com", "discord.gg"])) return "discord";
        if (hostIsUnder(host, ["twitch.tv"])) return "twitch";
        if (hostRegistrableLabelIs(host, "yelp")) return "yelp";
        if (hostIsUnder(host, ["m.me", "messenger.com"])) return "messenger";
        if (hostIsUnder(host, ["wa.me", "whatsapp.com"])) return "whatsapp";
        if (hostIsUnder(host, ["viber.com"]) || scheme === "viber:") return "viber";
        if (hostIsUnder(host, ["play.google.com"]) || scheme === "market:") return "android";
        if (hostIsUnder(host, ["apps.apple.com", "itunes.apple.com"])) return "apple";
        return "";
      })();
      if (platformFromHost) {
        // HARD VETO, deliberately ahead of the hint arms. A share button's
        // own label reads "Share on Facebook", so falling through to the
        // text/aria matchers below would re-classify exactly the anchors this
        // branch just refused. When the URL is a known social endpoint we
        // KNOW what the anchor is; no label can outvote that.
          if (isSocialShareEndpoint(path, query)) return "";
        // Same hard veto, same placement, same reason: a product page's
        // "Watch on YouTube" link is labelled youtube, so falling through to
        // the hint arms would re-classify exactly what the URL just refused.
        if (isSocialContentPermalink(host, path)) return "";
        return platformFromHost;
      }
      // Path AND QUERY, never the host. Restricting the test to `pathname`
      // fixed `https://feed.acme.test/` (a hostname, not a feed) but lost
      // every query-carried feed with it: `index.php?route=feed/rss` is how
      // OpenCart, PrestaShop and CS-Cart publish theirs, and those are real
      // storefronts in this pipeline's markets. The host is the part that has
      // to stay out, so the query comes back and the host does not.
      const pathAndQuery = `${path}${query}`;
      if (
        (/(^|[/?&=])(rss|feed|atom)(?:[/?#.&=]|$)/.test(pathAndQuery) ||
          /\.xml(?:[?#&]|$)/.test(pathAndQuery)) &&
        !/\b(feedback|feed-back)\b/.test(normalizedUrl)
      ) {
        return "rss";
      }
      if (/\bgoogle play\b|\bplay market\b|\bandroid app\b/.test(normalizedHints)) return "android";
      if (/\bapp store\b|\bapple app\b|\bios app\b/.test(normalizedHints)) return "apple";
      if (/\bfacebook\b/.test(normalizedHints)) return "facebook";
      if (/\binstagram\b/.test(normalizedHints)) return "instagram";
      if (/\btelegram\b/.test(normalizedHints)) return "telegram";
      if (/\byoutube\b/.test(normalizedHints)) return "youtube";
      if (/\btiktok\b/.test(normalizedHints)) return "tiktok";
      if (/\blinkedin\b/.test(normalizedHints)) return "linkedin";
      if (/\bpinterest\b/.test(normalizedHints)) return "pinterest";
      if (/\bsnapchat\b/.test(normalizedHints)) return "snapchat";
      if (/\btwitch\b/.test(normalizedHints)) return "twitch";
      if (/\byelp\b/.test(normalizedHints)) return "yelp";
      if (/\bwhatsapp\b/.test(normalizedHints)) return "whatsapp";
      if (/\bmessenger\b/.test(normalizedHints)) return "messenger";
      if (/\bviber\b/.test(normalizedHints)) return "viber";
      if (/\bdiscord\b/.test(normalizedHints)) return "discord";
      if (/\bthreads\b/.test(normalizedHints)) return "threads";
      if (/\brss\b|\batom\b/.test(normalizedHints)) return "rss";
      return "";
    };
    const localeCodePattern = /^(ua|uk|ru|en|de|fr|es|it|pl|ro|hu|cz|cs|sk|pt|tr|nl)$/i;
    const languageNamePattern =
      /\b(english|ukrainian|українська|украинский|русский|російська|russian|deutsch|german|français|francais|french|español|espanol|spanish|italiano|italian|polski|polish|română|romana|romanian|magyar|hungarian|čeština|cestina|czech|slovenčina|slovencina|slovak|português|portugues|portuguese|türkçe|turkce|turkish|nederlands|dutch)\b/i;
    const localeQueryPattern = /[?&](?:lang|locale|hl)=\s*(ua|uk|ru|en|de|fr|es|it|pl|ro|hu|cz|cs|sk|pt|tr|nl)(?:[&#]|$)/i;
    const localeContainerPattern = /(lang|locale|language|i18n|translate)/i;
    const localeUrlSignalFor = (value) => {
      if (!value) return false;
      try {
        const parsed = new URL(value, window.location.href);
        if (localeQueryPattern.test(parsed.search)) {
          return true;
        }
        const segments = parsed.pathname
          .split("/")
          .map((segment) => segment.trim().toLowerCase())
          .filter(Boolean);
        return segments.length === 1 && localeCodePattern.test(segments[0]);
      } catch {
        return false;
      }
    };
    const languageContainerFor = (element) =>
      element.closest(
        "[class*='lang'], [class*='locale'], [id*='lang'], [id*='locale'], nav, header, form",
      ) || element.parentElement;
    const allVisibleAnchors = [...document.querySelectorAll("a[href]")].filter(isVisible);
    const visibleLanguageHints = uniqueBy(
      [
        ...allVisibleAnchors.map((element) => ({
          text: normalize(element.innerText || element.textContent || ""),
          url: absoluteUrl(element.getAttribute("href") || ""),
          lang: element.getAttribute("lang") || element.getAttribute("hreflang") || "",
          containerSelector: simpleSelectorFor(languageContainerFor(element)),
        })),
        ...[...document.querySelectorAll("button, [role='button'], option, [lang], [hreflang]")]
          .filter(isVisible)
          .map((element) => ({
            text: normalize(element.innerText || element.textContent || ""),
            url: absoluteUrl(element.getAttribute("href") || ""),
            lang: element.getAttribute("lang") || element.getAttribute("hreflang") || "",
            containerSelector: simpleSelectorFor(languageContainerFor(element)),
          })),
      ].filter((entry) => {
        const compactText = entry.text.trim();
        const normalizedText = compactText.replace(/[^a-zа-яіїєґ]/gi, "");
        const normalizedLanguageText = compactText
          .toLowerCase()
          .replace(/[()[\]{}.,/\\:_-]+/g, " ")
          .replace(/\s+/g, " ")
          .trim();
        const textCode = normalizedText.slice(0, 4);
        const lang = entry.lang.trim().toLowerCase();
        const langCode = lang.split(/[-_]/)[0];
        const localeWordCount = normalizedLanguageText ? normalizedLanguageText.split(/\s+/).length : 0;
        const shortLocaleText =
          compactText.length > 0 &&
          compactText.length <= 24 &&
          localeCodePattern.test(textCode);
        const fullLanguageNameText =
          compactText.length > 0 &&
          compactText.length <= 32 &&
          localeWordCount <= 3 &&
          languageNamePattern.test(normalizedLanguageText);
        const explicitLocaleAttr = Boolean(langCode && localeCodePattern.test(langCode));
        const localeUrl = localeUrlSignalFor(entry.url);
        const localeContainerSignal = Boolean(
          entry.containerSelector && localeContainerPattern.test(entry.containerSelector),
        );
        return Boolean(
          (
            shortLocaleText ||
            explicitLocaleAttr ||
            localeUrl ||
            fullLanguageNameText ||
            (localeContainerSignal &&
              compactText.length > 0 &&
              compactText.length <= 48 &&
              localeWordCount <= 4 &&
              languageNamePattern.test(normalizedLanguageText))
          ) &&
            compactText.length <= 64,
        );
      }),
      (entry) => `${entry.text}::${entry.url}::${entry.lang}`,
    ).slice(0, 12);

    const languageContainerSelectors = uniqueBy(
      visibleLanguageHints.map((entry) => entry.containerSelector).filter(Boolean),
      (value) => value,
    ).slice(0, 6);
    const documentLanguageHints = uniqueBy(
      [
        {
          source: "html-lang",
          lang: document.documentElement?.getAttribute("lang") || "",
          url: window.location.href,
        },
        ...[...document.querySelectorAll("meta[http-equiv], meta[name]")]
          .map((element) => {
            const name = `${element.getAttribute("http-equiv") || ""} ${element.getAttribute("name") || ""}`;
            if (!/content-language|language|locale/i.test(name)) return null;
            return {
              source: "meta",
              lang: element.getAttribute("content") || "",
              url: window.location.href,
            };
          })
          .filter(Boolean),
        ...[...document.querySelectorAll("link[rel~='alternate'][hreflang]")]
          .map((element) => ({
            source: "alternate-hreflang",
            lang: element.getAttribute("hreflang") || "",
            url: absoluteUrl(element.getAttribute("href") || ""),
          })),
      ]
        .map((entry) => ({
          source: entry.source,
          lang: String(entry.lang || "").trim(),
          url: entry.url || "",
        }))
        .filter((entry) => entry.lang),
      (entry) => `${entry.source}::${entry.lang}::${entry.url}`,
    ).slice(0, 16);

    const contactContainers = [
      ...document.querySelectorAll(
        "header, footer, address, [class*='contact'], [class*='phone'], [class*='support'], [class*='footer'], [id*='contact'], [id*='phone'], [id*='support'], [id*='footer']",
      ),
    ].filter(isVisible);
    const contactTextSegments = contactContainers
      .flatMap((element) =>
        normalize(element.innerText || element.textContent || "")
          .split(/\n| {2,}|\s(?:•|\|)\s/)
          .map((text) => text.trim())
      )
      .filter(Boolean);
    const emailPattern = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
    const phonePattern = /(?:\+?\d[\d\s().-]{7,}\d)/g;
    // A DECIMAL separator inside a digit run is a price, a rating or a
    // version, never a subscriber number. A GROUP separator is not: `.` is how
    // French and Belgian numbers are printed (`01.23.45.67.89`), and the flat
    // `\d[.,]\d` this used to be threw those away -- measured through the real
    // scan, that number survived the pre-change code and did not survive the
    // rule meant to remove prices.
    //
    // What separates them is what FOLLOWS the dot, not the dot: a decimal
    // fraction is the end of its run, a group separator has more of the group
    // behind it. So a dot is a decimal only when exactly one digit follows it
    // (`4.8`, `428.0`), and a dotted group -- two or more digits -- is left
    // alone. `,` needs no such test: no phone format groups on a comma.
    //
    // The residual, stated rather than hidden: a two-place decimal written
    // with a dot (`1234.56`) no longer trips this rule. It is not free, and it
    // is the smaller cost -- such a run has to reach 10 digits on ONE rendered
    // line to become a candidate at all, while dropping a printed phone number
    // loses the contact outright.
    const DECIMAL_INSIDE_DIGITS = /\d,\d|\d\.\d(?!\d)/;
    // The accepted digit window for a number printed as TEXT (an href says
    // "this is a phone"; a paragraph does not). Pre-existing values, named
    // here because the join rule below reads them too.
    const PHONE_MIN_DIGITS = 10;
    const PHONE_MAX_DIGITS = 15;
    // PHONES read their own segment list; emails and addresses keep
    // `contactTextSegments` byte-for-byte. Two rules differ from it:
    //
    //   innerText ONLY, no `textContent` fallback. A VISIBLE wrapper whose
    //   only text is an inline <style> -- an image-only footer section --
    //   has innerText "" and textContent = the stylesheet, whose generated
    //   ids carry 14-digit runs. Measured live: a storefront section id was
    //   persisted to a customer's Brand Kit as a phone number.
    //
    //   split BEFORE normalize. `normalize` collapses "\n" into a space, so
    //   splitting after it never split on a line at all: a whole footer
    //   arrived as one segment and digit runs from adjacent RENDERED lines
    //   fused ("Артикул 531 (1057168)" + "2 099 ₴" -> tel:53110571682099).
    //
    //   A number wrapped by <br> reaches innerText as TWO lines and the split
    //   above would lose it (`+38 (044)` / `123 45 67` -> nothing). Two
    //   adjacent lines are rejoined -- beside the originals, never instead of
    //   them -- only when BOTH are made of phone characters alone, the first
    //   is a phone HEAD, and NEITHER alone already reaches the window (two
    //   complete numbers on adjacent lines stay two numbers). A phone head is
    //   what a number starts with and a quantity or a price never does: "+"
    //   (the E.164 international prefix), a trunk "0" (the national dialling
    //   prefix), an opening bracket (an area-code group), or a digit followed
    //   by a bracketed group (`8 (800)`, `1 (800)`). A currency sign, a
    //   letter or a bare price on either line stops the join.
    const PHONE_CHARS_ONLY = /^[+\d\s().\-–]+$/;
    const PHONE_HEAD = /^(?:[+(0]|\d[\d\s.\-–]*\(\d)/;
    const joinWrappedPhoneLines = (lines) => {
      const out = [...lines];
      for (let index = 0; index + 1 < lines.length; index += 1) {
        const head = lines[index];
        const tail = lines[index + 1];
        if (!PHONE_CHARS_ONLY.test(head) || !PHONE_CHARS_ONLY.test(tail)) continue;
        if (!PHONE_HEAD.test(head)) continue;
        const headDigits = head.replace(/\D/g, "").length;
        const tailDigits = tail.replace(/\D/g, "").length;
        if (headDigits >= PHONE_MIN_DIGITS || tailDigits >= PHONE_MIN_DIGITS) continue;
        out.push(`${head} ${tail}`);
      }
      return out;
    };
    const contactLineSegments = contactContainers
      .flatMap((element) =>
        joinWrappedPhoneLines(
          String(element.innerText || "")
            .split(/\n|\s(?:•|\|)\s/)
            .map((text) => normalize(text))
            .filter(Boolean),
        )
      );
    const textEmails = contactTextSegments.flatMap((text) =>
      [...text.matchAll(emailPattern)].map((match) => ({
        text: match[0],
        email: match[0],
        url: `mailto:${match[0]}`,
        source: "visible-text",
      }))
    );
    const textPhones = contactLineSegments
      .flatMap((text) =>
        [...text.matchAll(phonePattern)].map((match) => normalize(match[0]))
      )
      .filter((phone) => {
        // A DIFFERENT question from `isRealTelTarget` below, deliberately
        // stricter: this scans free prose, where a short digit run is a price,
        // a year, a postcode or a SKU. An href says "this is a phone number"
        // and only has to be non-empty; a paragraph says nothing, so the
        // length window is what stands in for the missing declaration. A short
        // hotline printed as TEXT and nowhere as a tel: href is therefore
        // still missed -- pre-existing, unchanged, and out of scope here.
        //
        // The window stays 10-15 on purpose: narrowing it to 9-12 was scored
        // on every text-tier candidate the producer has ever emitted and
        // removed nothing the rendered-line split above does not already
        // remove, while rejecting legitimate 00-prefixed international forms.
        if (DECIMAL_INSIDE_DIGITS.test(phone)) return false;
        const digits = phone.replace(/\D/g, "");
        // A parenthesised group is a PREFIX (a country, trunk or area code),
        // and a prefix is shorter than the subscriber number it prefixes --
        // that is the E.164 structure, not a threshold. A match whose
        // bracketed digits OUTNUMBER the digits outside the brackets is not a
        // phone number: `531 (1057168)` is an article code with its variant
        // in brackets. Judged only when digits sit on both sides: a number
        // printed wholly inside brackets is a bracketed phone, not a prefixed
        // one, and is left to the window. `phonePattern` has to END on a
        // digit, so a match cuts a trailing `)` off its last group --
        // `531 (1057168` is what reaches here -- and an unclosed group at
        // the end of the match is counted like a closed one.
        const insideBrackets = (phone.match(/\(([^()]*)(?:\)|$)/g) || []).join("").replace(/\D/g, "").length;
        const outsideBrackets = digits.length - insideBrackets;
        if (insideBrackets > 0 && outsideBrackets > 0 && insideBrackets > outsideBrackets) return false;
        return digits.length >= PHONE_MIN_DIGITS && digits.length <= PHONE_MAX_DIGITS && !/^\d{4}$/.test(digits);
      })
      .map((phone) => ({
        text: phone,
        phone,
        url: `tel:${phone.replace(/[^\d+]/g, "")}`,
        source: "visible-text",
      }));
    // ONE validity rule for contact hrefs, asked by the VISIBLE collector and
    // by the unfiltered sweep alike. They used to disagree: the unfiltered
    // count refused `mailto:?subject=` share buttons and 3-digit `tel:`, the
    // visible collector took both. Asymmetry there is worse than either rule
    // on its own -- a share button became "the probe saw an email the kit
    // dropped", which is the mapper-dropped warning firing on a site that
    // publishes no email at all.
    //
    // `decodeURIComponent` THROWS a URIError on a lone `%` or any truncated
    // escape, and this whole function body runs inside one `page.evaluate`:
    // an unguarded throw here does not reject one anchor, it takes down
    // socials, contacts, logos, fonts, languages and important links
    // together, and `collectPageSignals` has no catch above it.
    //
    // THE CATCH DOES NOT REJECT THE ANCHOR. It returns the RAW string, and the
    // caller then judges that exactly as it judges a decoded one -- so
    // `mailto:%zz@acme.test` is ACCEPTED as a recipient on the strength of the
    // `@` that is already there undecoded, and only an href whose recipient
    // exists solely inside the broken escape is lost. That is the intended
    // behaviour, not an oversight: a percent-escape this browser cannot decode
    // is far more often a mis-encoded real address than a fabricated one, and
    // best-effort judging of the raw string keeps a contact that a hard reject
    // would throw away. What must never happen is the throw.
    const decodeHrefTarget = (value) => {
      const raw = String(value || "");
      try {
        return decodeURIComponent(raw);
      } catch {
        return raw;
      }
    };
    const schemeTarget = (href, scheme) => {
      const value = String(href || "").trim();
      return value.toLowerCase().startsWith(scheme) ? value.slice(scheme.length) : null;
    };
    // A scheme alone does not make a contact: `mailto:?subject=...&body=...`
    // with no recipient is a SHARE button, and a `tel:` with no digit at all
    // is not a number. THAT IS THE WHOLE RULE -- there is no length floor.
    //
    // A five-digit floor was invented here by analogy with the mailto share
    // case, and `tel:` has no share analogue to defend against: nothing posts
    // the current page through the tel: scheme, so short is not suspicious.
    // What the floor did instead was silently drop the 3-4 digit retail
    // hotlines (`tel:1580`) that are standard in this pipeline's markets --
    // carried in `contacts.phones` before it existed, absent after.
    //
    // The recipient test is ANCHORLESS so the display-name form parses:
    // `mailto:Acme Support <info@acme.test>` is a legal RFC 6068 target and a
    // real one, and the `^`-anchored pattern rejected it over the space in the
    // name. The character class excludes `<`, `>` and whitespace, so what
    // matches is the address itself rather than the wrapper around it.
    const isRealMailtoTarget = (rest) =>
      /[^\s<>@]+@[^\s<>@]+/.test(decodeHrefTarget(String(rest || "").split("?")[0] || ""));
    const isRealTelTarget = (rest) => {
      const rawSubscriber = String(rest || "").split(/[;?]/, 1)[0];
      let decodedSubscriber;
      try {
        decodedSubscriber = decodeURIComponent(rawSubscriber);
      } catch {
        return false;
      }
      if (decodedSubscriber.includes("%")) return false;
      const subscriber = decodedSubscriber.split(/[;?]/, 1)[0];
      return /\d/.test(subscriber);
    };
    const hasRealContactHref = (element, scheme, isReal) => {
      const rest = schemeTarget(element.getAttribute("href") || "", scheme);
      return rest === null ? false : isReal(rest);
    };
    const contacts = {
      phones: uniqueBy(
        [
          ...allVisibleAnchors
            .filter((element) => hasRealContactHref(element, "tel:", isRealTelTarget))
            .map((element) => ({
              text: normalize(element.innerText || element.textContent || ""),
              url: absoluteUrl(element.getAttribute("href") || ""),
              source: "href",
            })),
          ...textPhones,
        ],
        (entry) => (entry.url || entry.phone || entry.text || "").replace(/\D/g, "") || entry.text,
      ).slice(0, 8),
      emails: uniqueBy(
        [
          ...allVisibleAnchors
            .filter((element) => hasRealContactHref(element, "mailto:", isRealMailtoTarget))
            .map((element) => ({
              text: normalize(element.innerText || element.textContent || ""),
              url: absoluteUrl(element.getAttribute("href") || ""),
              source: "href",
            })),
          ...textEmails,
        ],
        // URL precedes display text for href rows. Two links can both read
        // "Email us" while addressing different mailboxes; collapsing them
        // here would lose a fact before canonicalization gets a chance to
        // distinguish the targets.
        (entry) => (entry.email || entry.url || entry.text || "").toLowerCase(),
      ).slice(0, 8),
      addresses: uniqueBy(
        contactTextSegments
          .filter((text) =>
            text.length >= 18 &&
            text.length <= 180 &&
            /(street|st\.|ave|avenue|road|rd\.|blvd|suite|office|address|адрес|адреса|вул\.|вулиц|просп|площа|шосе|буд\.|офіс|київ|львів|одеса|харків|дніпро|м\.)/i.test(text) &&
            !/@/.test(text) &&
            !/^tel:/i.test(text)
          )
          .map((text) => ({ text, address: text, source: "visible-text" })),
        (entry) => entry.text.toLowerCase(),
      ).slice(0, 6),
    };

    const socialAnchorRows = uniqueBy(
      allVisibleAnchors
        .map((element) => {
          const url = absoluteUrl(element.getAttribute("href") || "");
          const platform = socialPlatformFor({
            url,
            text: element.innerText || element.textContent || "",
            label: element.getAttribute("aria-label") || "",
            title: element.getAttribute("title") || "",
            className: element.className,
          });
          if (!platform) return null;
          return {
            platform,
            text: normalize(element.innerText || element.textContent || ""),
            url,
          };
        })
        .filter(Boolean),
      (entry) => entry.url,
    );
    const socials = socialAnchorRows.slice(0, 20);
    // KNOWN RESIDUAL, not fixed here: this cap still truncates the data, not
    // just the diagnosis. `socialsForBrandkit` is built from THIS array
    // (`brandkitSocialsFromLinks(payload?.socials)` at the bottom of this
    // file), so a platform whose only anchor sits past row 20 is genuinely
    // lost from the kit -- the pre-cap `visibleSocialPlatforms` below makes
    // the gate report that loss HONESTLY instead of blaming visibility, which
    // is a different fix from not losing it. Out of scope deliberately:
    // ranking the rows before capping (footer profiles first) is a change to
    // what the agent is handed, and it predates this gate.
    //
    // The 20-row cap above is a payload guard, not a claim about what was
    // VISIBLE. Twenty per-card share links exhaust it and push a real footer
    // profile out, and comparing the capped rows against the uncapped sweep
    // below would then report "no visible anchor matched" about an anchor that
    // matched perfectly well. The platform set is therefore taken PRE-cap.
    //
    // http(s) ONLY, for the same reason the write has: the Brand Kit stores
    // only http(s) URLs and `_drop_unwritable_socials` deliberately EMPTIES
    // anything else (a `viber://chat?number=...` footer link, which is
    // ubiquitous in this market). A platform reachable only by a custom scheme
    // is therefore CORRECTLY absent from the kit, and counting it as seen
    // would report the pipeline's own intentional normalisation as data loss.
    const isWritableSocialUrl = (url) => /^https?:\/\//i.test(String(url || ""));
    // URL-QUALIFIED, which is why `entry.platform` is deliberately NOT reused.
    // `socialPlatformFor` also classifies on text/aria-label/title/class, and
    // those arms fire whatever the href says: a footer
    // `<a href="/privacy" aria-label="Facebook">` classified as `facebook`,
    // and a resolved relative URL is still http(s), so it passed the writable
    // filter below and landed in this set. This set is the `seen` side of the
    // section-evidence gate, so a kit that CORRECTLY omits a Facebook profile
    // the brand does not have was reported as mapper loss -- a claim that real
    // data was destroyed, made on the evidence of a label.
    //
    // Re-asking the same classifier with the URL alone is exactly what the
    // unfiltered sweep below already does, and the two sides must agree: a
    // stricter rule here (host membership only, refusing the URL-derived `rss`
    // arm) would make an ordinary `/feed/` link seen-by-nobody and
    // unfiltered-by-everyone, and `capture-unproven` would cry wolf on the
    // same page instead of `mapper-dropped`.
    //
    // Nothing real leaves. A URL this classifier answers on cannot have been
    // dropped from `socialAnchorRows`, because the host branch (with its share
    // and permalink vetoes) and the feed branch both return BEFORE the hint
    // arms in the hinted call as well -- so a URL-classified anchor is in the
    // rows already, under this same platform name. Only label-only rows leave,
    // which is the point. `socials` and `socialsForBrandkit` are untouched:
    // what the ranker does with label evidence is its own business, and this
    // gate simply may not warn from it.
    const visibleSocialPlatforms = [
      ...new Set(
        socialAnchorRows
          .filter((entry) => isWritableSocialUrl(entry.url))
          .map((entry) => socialPlatformFor({ url: entry.url }))
          .filter(Boolean),
      ),
    ].sort();

    // BACKLOG item 31 — the capture-unproven signal. `allVisibleAnchors` is
    // filtered by `isVisible`, which demands opacity > 0 and a non-zero rect ON
    // THE ANCHOR. A footer social icon whose <a> collapses to zero size around
    // an absolutely-positioned glyph, or one inside a lazily-hydrated footer,
    // is invisible to the collector above — so `socials` comes back EMPTY and
    // an empty kit then looks like an honest absence.
    //
    // These counts are the same question asked of the raw DOM. When a platform
    // appears here and not above, the CAPTURE is unproven; that is a different
    // fact from the site not having the link, and the two must not be
    // conflated. Deliberately platform names and integers only: no URLs, no
    // anchor text, nothing that could carry PII into a public artifact.
    const allAnchorsUnfiltered = [...document.querySelectorAll("a[href]")];
    // URL ONLY, the same rule `visibleSocialPlatforms` now applies, so the two
    // sides of this gate answer one question the same way.
    // `socialPlatformFor` also classifies on text/aria-label/title/class,
    // which is sound where the `socials` ROWS are built -- an icon-sized
    // anchor's own label IS its identity, and those rows feed the ranker, not
    // this gate. It is NOT sound for either evidence set. On a
    // display:none element `innerText` falls back to `textContent`, i.e. every
    // descendant string, so a hidden cookie drawer reading "we share data with
    // Facebook Pixel and TikTok Ads" would classify as two platforms and this
    // gate would report a capture failure on a site with no social presence at
    // all -- inverting exactly what it exists to distinguish.
    const unfilteredSocialPlatforms = [
      ...new Set(
        allAnchorsUnfiltered
          .map((element) => absoluteUrl(element.getAttribute("href") || ""))
          .filter(isWritableSocialUrl)
          .map((url) => socialPlatformFor({ url }))
          .filter(Boolean),
      ),
    ].sort();
    // The href-LESS social controls belong beside `unfilteredSocialPlatforms`
    // — same question, third answer — but they are counted by
    // `lib/social-controls.js` in a second `page.evaluate` rather than here.
    // Both evidence sets above are `a[href]`-only, so on a site whose social
    // icons are `<a>` with no href both come back empty and the run reports an
    // honest absence it never established. That count is merged into this
    // payload as `hrefLessSocialControls` on the node side below; it lives in
    // its own module because a function Playwright ships as source text cannot
    // close over this closure, and a copy of it inside here would be a twin of
    // the one the unit tests drive.
    //
    // The SAME `hasRealContactHref` the visible collector asks, so the two
    // sides cannot drift into disagreeing about what a contact is. When they
    // disagree the grade inverts: a share button counted as "seen" but not
    // "unfiltered" reports mapper-dropped on a site with no email.
    const countUnfilteredContacts = (scheme, isReal) =>
      allAnchorsUnfiltered.filter((element) => hasRealContactHref(element, scheme, isReal)).length;
    const unfilteredContactAnchors = {
      tel: countUnfilteredContacts("tel:", isRealTelTarget),
      mailto: countUnfilteredContacts("mailto:", isRealMailtoTarget),
    };

    // Region rank: nearest ancestor landmark decides sort priority BEFORE
    // the cap is applied, so header/footer nav survives a body flood
    // (category listings, promo rails) instead of losing to raw DOM order.
    const NAV_REGION_RANK = { header: 0, footer: 1, body: 2 };
    // Footer is tested FIRST: a <nav> nested inside a <footer> is footer
    // navigation, and asking for the nearest landmark of a combined selector
    // would answer "nav" and promote it. <nav>/[role=navigation] count as
    // header-scoped on their own because a bare top-level <nav> with no
    // wrapping <header> is a standard layout — the same selector set
    // header-link-backfill.js already treats as header evidence.
    //
    // Measured caveat: on 36% of 1502 real captures there is no <nav> in
    // either landmark, so body sidebars and breadcrumbs fall through to
    // "body". Rank 0 therefore means "header-scoped OR a bare top-level nav",
    // not "provably the masthead" — it is a sort key, not a classification
    // anyone downstream should trust as ground truth.
    const navRegionFor = (element) => {
      if (element.closest("footer, [role='contentinfo']")) return "footer";
      if (element.closest("header, [role='banner'], nav, [role='navigation']")) return "header";
      return "body";
    };
    // Only http(s) reaches the payload. `absoluteUrl` returns "" solely when
    // `new URL()` throws, and `javascript:void(0)` / `mailto:` / `#` all parse
    // cleanly — so without this they ride the `||` chain through the empty
    // check and land in the evidence an agent is told to trust.
    const httpUrl = (raw) => {
      const url = absoluteUrl(raw);
      return /^https?:\/\//i.test(url) ? url : "";
    };
    // JS-driven nav controls (span.jslink, dropdown triggers) often carry no
    // href at all; their real destination only exists on an equivalent
    // anchor elsewhere in the document (often the footer). Text is the only
    // stable join key, so resolve through same-origin anchors by normalized
    // text — never synthesize a URL for a control that resolves to nothing.
    const sameOriginUrlByText = new Map();
    for (const anchor of allVisibleAnchors) {
      const url = httpUrl(anchor.getAttribute("href") || "");
      const text = normalize(anchor.innerText || anchor.textContent || "");
      if (!url || !text || new URL(url).origin !== window.location.origin) continue;
      if (!sameOriginUrlByText.has(text)) sameOriginUrlByText.set(text, url);
    }
    const importantLinkPattern =
      /(about|contact|support|help|faq|delivery|shipping|payment|returns?|refund|privacy|terms|catalog|sale|blog|company|brands?|stores?|locations?|gift|cards?|certificate|outlet|clearance|trade[-\s]?in|career|warranty|loyalty|app|customer|promo|discount|про нас|про компан|контакти|доставка|оплата|повернення|гарант|допомога|підтримка|каталог|акції|розпродаж|бренд|магазин|подарунков|сертифікат|кар'єра|лояльн|додаток|покупцям)/i;
    // Second admission route, matched against host+path. Measured need: the
    // text vocabulary above is Ukrainian-only and nominative-only, so real
    // labels miss it three ways — Russian locales ("Подарочные карты",
    // "Распродажа"), inflection (`допомога` in the pattern vs a storefront
    // spelling it "<BRAND> допомагає" on the page), and brand-specific naming
    // ("<Brand> Гроші" for a loyalty programme, "<Brand> Обмін" for trade-in,
    // which share no generic token at all). For those the slug is the only
    // stable machine-readable identity.
    //
    // Deliberately NOT here: promo, sale, shop, app, brand, catalog, and bare
    // `card`. Those are the tokens that flooded the list from URLs alone —
    // /promotion/<campaign> banners with empty text and /shop/<product-slug>
    // pages — which is the flood this branch exists to stop. `gift-card` is
    // kept because it is spelled out, so it cannot match a bare product card.
    // Matched against host+path, so `help.acme.example/` and `acme.example/help/` both
    // qualify. `_` is a slug separator exactly like `-`; omitting it silently
    // drops real pages (`/terms_of_use/`, `/contact_media.html`).
    const informationalUrlPattern =
      /(^|[._/-])(about([-_]?us)?|contacts?|support|help|faq|delivery|shipping|payments?|returns?|refund|privacy([-_]?policy)?|terms|warranty|guarantee|trade[-_]?in|loyalty|bonus|gifts?|gift[-_]?cards?|giftcard|certificate|outlet|clearance|careers?|vacanc|blog)([._/?#-]|$)/i;
    // Path-only, never the host: `.store` is a real TLD (a corpus domain uses
    // it), and matching it against the host admits EVERY url on that domain —
    // measured at 98% of its 32170 anchors, i.e. precisely the flood this
    // ranking exists to remove. `news` is deliberately absent from both: its
    // only legitimate corpus hit is a `blog.` host that `blog` already matches,
    // while it admits press-article rails by the hundred.
    const informationalPathPattern = /(^|[._/-])(stores?|locations?)([._/?#-]|$)/i;
    const importantLinks = uniqueBy(
      [...document.querySelectorAll("a[href], [role='link'], [data-href], [data-url], .jslink")]
        .filter(isVisible)
        .map((element, documentOrderIndex) => {
          const text = normalize(element.innerText || element.textContent || "");
          const url =
            httpUrl(
              element.getAttribute("href") ||
                element.getAttribute("data-href") ||
                element.getAttribute("data-url") ||
                "",
            ) || sameOriginUrlByText.get(text) || "";
          if (!url) return null; // no href AND no same-text anchor elsewhere: drop it, never invent one
          const { host, pathname } = new URL(url);
          if (
            !importantLinkPattern.test(text) &&
            !informationalUrlPattern.test(host + pathname) &&
            !informationalPathPattern.test(pathname)
          ) {
            return null;
          }
          const region = navRegionFor(element);
          return { text, url, region, rank: NAV_REGION_RANK[region], documentOrderIndex };
        })
        .filter(Boolean)
        .sort((a, b) => a.rank - b.rank || a.documentOrderIndex - b.documentOrderIndex)
        .map(({ text, url, region }) => ({ text, url, region })),
      (entry) => entry.url,
    ).slice(0, 24);

    // `isVisible` is shared by every collection in this probe and must keep
    // its meaning for them, so the logo lane's relaxation is a predicate of
    // its own. Everything but `opacity` is asked exactly as `isVisible` asks
    // it; a row admitted here but rejected there therefore failed on opacity
    // alone. Measured need: a masthead mark faded in on scroll (`cm-image`,
    // `[data-aos]`, any IntersectionObserver reveal) computes `opacity: 0` in
    // a probe that never scrolls, so the brand's own logo is invisible to the
    // collector and only a footer instance survives to represent it.
    const visibleIgnoringOpacity = (element) => {
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        rect.width > 0 &&
        rect.height > 0
      );
    };
    const collectedLogoRows = uniqueBy(
      [
        ...document.querySelectorAll(
          "img, picture img, svg, [class*='logo'] img, [class*='logo'] svg, [id*='logo'] img, [id*='logo'] svg",
        ),
      ]
        .map((element) => {
          const rect = element.getBoundingClientRect();
          const src =
            absoluteUrl(element.getAttribute("src") || "") ||
            absoluteUrl(element.getAttribute("href") || "");
          // The collector's own `[class*='logo'] …` / `[id*='logo'] …` arms,
          // re-asked as an ancestor test so the two can never disagree about
          // what a logo context is. It reaches what no selector STRING can:
          // `simpleSelectorFor` collapses to `#<id>` and discards every class
          // whenever the element has an id (which on CS-Cart is every <img>,
          // `det_img_*`), and a classless <img> inside a `.logo-container`
          // never had a class of its own to carry.
          const inLogoContext = !!element.closest("[class*='logo'],[id*='logo']");
          // Opacity is forgiven ONLY for a row that already looks like a logo.
          // `opacity: 0` is the standard lazyload / fade-in idiom, so an
          // unguarded relaxation would admit every below-fold product image on
          // an infinite-scroll page.
          const visible = isVisible(element);
          if (!visible && !(inLogoContext || /logo/i.test(src))) return null;
          if (!visible && !visibleIgnoringOpacity(element)) return null;
          // The nearest ancestor link pointing at this origin's own root — the
          // masthead idiom, and a structurally stronger statement than
          // `region`, whose rank 0 also covers a bare top-level <nav>.
          //
          // The RAW href is rejected first, BEFORE resolving. `absoluteUrl`
          // resolves against the current document, so `absoluteUrl("#")`
          // yields pathname "/" and a dead-linked footer badge would read as a
          // home link — escaping the confidence cap entirely. Empty,
          // fragment-only, `javascript:`, `mailto:` and `tel:` hrefs all say
          // "this anchor points nowhere on this site".
          const anchor = element.closest("a[href]");
          const rawHref = anchor ? String(anchor.getAttribute("href") || "").trim() : "";
          const deadHref = !rawHref || /^(#|javascript:|mailto:|tel:)/i.test(rawHref);
          const anchorUrl = deadHref ? "" : absoluteUrl(rawHref);
          // `absoluteUrl` returns "" unless `new URL` already parsed the
          // value, so re-parsing a non-empty result cannot throw.
          const anchorLocation = anchorUrl ? new URL(anchorUrl) : null;
          // Root only, with an optional locale prefix: "/", "/ua", "/ua/",
          // "/uk-ua/" are the masthead idiom; "/ua/catalog" is not. This is
          // deliberately NOT `localeUrlSignalFor` — that predicate exists to
          // flag locale SWITCH links and matches non-root paths, so reusing it
          // would call every localized deep link a home link. A tight
          // root-only anchor is the honest tool for this question.
          const homePathPattern = /^\/(?:[a-z]{2}(?:[-_][a-z]{2,4})?)?\/?$/;
          const homeLink = !!anchorLocation
            && anchorLocation.origin === window.location.origin
            && homePathPattern.test(anchorLocation.pathname);
          return {
            tag: element.tagName.toLowerCase(),
            src,
            alt: element.getAttribute("alt") || "",
            widthPx: Math.round(rect.width) || 0,
            heightPx: Math.round(rect.height) || 0,
            selector: simpleSelectorFor(element),
            // Facts only. Ranking these — or reordering the rows by them —
            // belongs to assemble-candidates.js; this probe reports what the
            // DOM says and nothing else, so a replayed capture can be
            // re-scored without being re-collected.
            inLogoContext,
            region: navRegionFor(element),
            homeLink,
            opacityHidden: !visible,
            // Free — the rect is already in hand. It is the only fact that
            // reaches a masthead on a page with ZERO landmark elements, where
            // `navRegionFor` answers "body" for every row. Probes never
            // scroll (the same property the opacity relaxation above relies
            // on), so this is the distance from the top of the document.
            topPx: Math.round(rect.top),
          };
        })
        .filter((entry) => entry && (entry.src || /logo/i.test(entry.selector))),
      (entry) => `${entry.tag}::${entry.src}::${entry.selector}`,
    );

    // THE KEEP RULE — a literal copy of `logoCandidateKeepRule` in
    // assemble-candidates.js, repeated rather than imported because this body
    // runs inside `page.evaluate`, a scope boundary no import crosses. The two
    // are pinned to each other behaviourally by the collector parity test.
    //
    // Sizing the cap by "the worst page we measured" was the wrong instrument
    // and the measurement was wrong too: 100 was chosen against 75 rows, and 75
    // was ONE site. A live 21-site sweep measured 1471 visible matching
    // elements on the worst page, 310 and 145 on the next two, so the cap bound
    // on 4 of 21 sites and silently decided the slate in raw document order.
    //
    // So do not pick a bigger number: keep exactly the rows the ranker could
    // conceivably emit. The ranker now refuses any row that carries neither a
    // text signal nor placement corroboration, which makes its admissibility
    // contract explicit and this filter a statement of that contract. It is
    // deliberately COARSER — substring `logo` rather than the scorer's
    // word-boundary and path-shaped tests, and no knowledge of the impostor
    // vocabulary or the band rule — so it is a strict SUPERSET of what can be
    // emitted, and dropping a row here can never drop one the ranker wanted.
    const LOGO_KEEP_MAX_TOP_PX = 400;
    const logoRowIsAdmissible = (entry) =>
      entry.inLogoContext === true
      // Case-insensitive on purpose, and NOT redundant with `inLogoContext`:
      // that fact comes from a CSS attribute match, which is case-sensitive on
      // values, while the scorer lowercases before matching. Without this arm a
      // `class="Logo-img"` mark is emittable by the ranker yet dropped here.
      || /logo/i.test(entry.selector || "")
      || /logo/i.test(entry.src || "")
      || /logo/i.test(entry.alt || "")
      || entry.region === "header"
      || entry.homeLink === true
      || (Number.isFinite(entry.topPx) && entry.topPx <= LOGO_KEEP_MAX_TOP_PX);
    // A pathology backstop, and nothing more. It is NOT a claim that 300 rows
    // is enough for any page — the keep rule is what makes the collection
    // lossless, and this only bounds a DOM that defeats it.
    const logoCandidates = collectedLogoRows.filter(logoRowIsAdmissible).slice(0, 300);
    // Coverage, reported rather than re-measured. `seen` counts the deduped
    // visible matching rows the collector built, `kept` the rows that survived
    // the keep rule and the backstop, so the next sweep reads its own coverage
    // straight out of page-signals.json instead of re-running live selectors.
    const logoCandidateStats = { seen: collectedLogoRows.length, kept: logoCandidates.length };

    const webFonts = (() => {
      const SOURCE_PATTERNS = [
        { pattern: /fonts\.googleapis\.com|fonts\.gstatic\.com/i, source: "google-fonts" },
        { pattern: /use\.typekit\.net|p\.typekit\.net/i, source: "typekit" },
        { pattern: /fast\.fonts\.net|use\.fontawesome\.com|fontawesome/i, source: "fontawesome" },
        { pattern: /fonts\.shopifycdn\.com/i, source: "shopify-fonts" },
      ];
      const classifySource = (url) => {
        if (!url) return "";
        for (const { pattern, source } of SOURCE_PATTERNS) {
          if (pattern.test(url)) return source;
        }
        return "";
      };
      const stripQuotes = (value) =>
        String(value || "")
          .replace(/^['"]/, "")
          .replace(/['"]$/, "")
          .trim();
      const stylesheetHits = [];
      const seenSheetUrls = new Set();
      try {
        document.querySelectorAll("link[rel='stylesheet'], link[rel='preconnect'], link[rel='preload']").forEach((link) => {
          const href = absoluteUrl(link.getAttribute("href") || "");
          if (!href || seenSheetUrls.has(href)) return;
          const source = classifySource(href);
          if (!source) return;
          seenSheetUrls.add(href);
          stylesheetHits.push({ href, source });
        });
      } catch {
        // Ignore DOM errors.
      }
      const fontFaceUrls = [];
      try {
        for (const sheet of Array.from(document.styleSheets || [])) {
          let rules = null;
          try {
            rules = sheet.cssRules;
          } catch {
            rules = null;
          }
          if (!rules) continue;
          for (const rule of Array.from(rules)) {
            if (!rule || rule.type !== window.CSSRule.FONT_FACE_RULE) continue;
            const family = stripQuotes(rule.style?.getPropertyValue("font-family") || "");
            const src = rule.style?.getPropertyValue("src") || "";
            if (!family) continue;
            const urlMatches = Array.from(src.matchAll(/url\(([^)]+)\)/g)).map((match) => stripQuotes(match[1]));
            urlMatches.forEach((rawUrl) => {
              const absUrl = absoluteUrl(rawUrl);
              if (!absUrl) return;
              fontFaceUrls.push({ family, url: absUrl, source: classifySource(absUrl) || "custom" });
            });
          }
        }
      } catch {
        // Ignore stylesheet enumeration errors.
      }
      const familyMap = new Map();
      const upsert = (family, source, url) => {
        const normalized = stripQuotes(family);
        if (!normalized) return;
        const key = normalized.toLowerCase();
        if (!familyMap.has(key)) {
          familyMap.set(key, { family: normalized, sources: new Set(), urls: new Set() });
        }
        const entry = familyMap.get(key);
        if (source) entry.sources.add(source);
        if (url) entry.urls.add(url);
      };
      try {
        if (window.document.fonts && typeof window.document.fonts.forEach === "function") {
          window.document.fonts.forEach((fontFace) => {
            const family = stripQuotes(fontFace.family || "");
            if (!family) return;
            const matchingFace = fontFaceUrls.find(
              (entry) => entry.family.toLowerCase() === family.toLowerCase(),
            );
            const sourceFromFace = matchingFace?.source || "";
            const sourceFromSheets = stylesheetHits[0]?.source || "";
            upsert(family, sourceFromFace || sourceFromSheets || "system", matchingFace?.url || "");
          });
        }
      } catch {
        // Ignore document.fonts enumeration errors.
      }
      fontFaceUrls.forEach((entry) => upsert(entry.family, entry.source, entry.url));
      return Array.from(familyMap.values())
        .map((entry) => ({
          family: entry.family,
          sources: Array.from(entry.sources).sort(),
          urls: Array.from(entry.urls).slice(0, 4),
        }))
        .sort((left, right) => left.family.localeCompare(right.family))
        .slice(0, 24);
    })();

    return {
      pageUrl: window.location.href,
      contacts,
      socials,
      importantLinks,
      visibleLanguageHints,
      documentLanguageHints,
      languageContainerSelectors,
      logoCandidates,
      logoCandidateStats,
      webFonts,
      visibleSocialPlatforms,
      unfilteredSocialPlatforms,
      unfilteredContactAnchors,
    };
  });
  // Its OWN evaluate, and `null` when it cannot answer. The block above runs as
  // one page function with no catch around it — an unguarded throw there loses
  // socials, contacts, logos, fonts, languages and important links together —
  // and this signal is worth none of that. A `null` here simply omits the
  // field, which the finalizer reads exactly as it reads a zero.
  const hrefLessSocialControls = await collectHrefLessSocialControls(page);
  return {
    ...payload,
    ...(hrefLessSocialControls ? { hrefLessSocialControls } : {}),
    contacts: {
      ...(payload?.contacts || {}),
      emails: contactRowsWithFacts(payload?.contacts?.emails, "email"),
      phones: contactRowsWithFacts(payload?.contacts?.phones, "phone"),
    },
    socialsForBrandkit: brandkitSocialsFromLinks(payload?.socials),
    // `region` stays on the raw `importantLinks` evidence, where it informs the
    // agent's curation, and is deliberately absent here: this array is shaped
    // to be copied VERBATIM into the brandkit, and schema.json's
    // `$defs.importantLinks.items` is `additionalProperties: false` over
    // {name, url}. Emitting a third key invites a validation failure on the
    // JS validate path, which compiles that schema against the agent-authored
    // payload before any normalization strips extras.
    importantLinksForBrandkit: Array.isArray(payload?.importantLinks)
      ? payload.importantLinks.map((entry) => ({
          name: entry.text || "",
          url: entry.url || "",
        }))
      : [],
  };
}

// The per-element base read of the button probe's phase 1, at module scope.
// It was hoisted so a batched variant could interpolate this function's own
// source and the two paths could not drift; `deb5a9a` deleted that variant,
// and the hoist stays because it is also what makes the body readable as one
// unit and testable by name. Playwright transports it the same way either way
// (it stringifies a function argument), so the scope changes nothing about
// what runs in the page.
//
// SELF-CONTAINED BY CONTRACT: it may reference nothing outside its own
// parameters and the page's globals (`window`, `Element`, `Number`, ...). A
// closure reference would be silently undefined inside the page.
export function buttonProbeBaseEvaluate(element, wantElementKey) {
  const probeHelpers = window.__brandkitProbeHelpers || {};
  const toHex = probeHelpers.toHex || (() => null);
  const pickBorderColor = probeHelpers.pickBorderColor || ((style) => toHex(style?.borderColor));
  const normalizeFontWeight =
    probeHelpers.normalizeFontWeight || ((value) => Number.parseInt(value, 10) || null);
  const readTypographyStyle =
    probeHelpers.readTypographyStyle ||
    ((style) => ({
      fontFamily: style?.fontFamily || null,
      fontWeight: normalizeFontWeight(style?.fontWeight),
      fontSize: style?.fontSize || null,
      fontSizePx: Number.isFinite(Number.parseFloat(style?.fontSize))
        ? Number.parseFloat(style?.fontSize)
        : null,
      lineHeight: style?.lineHeight || null,
      lineHeightPx: Number.isFinite(Number.parseFloat(style?.lineHeight))
        ? Number.parseFloat(style?.lineHeight)
        : null,
      letterSpacing: style?.letterSpacing || null,
      letterSpacingPx: Number.isFinite(Number.parseFloat(style?.letterSpacing))
        ? Number.parseFloat(style?.letterSpacing)
        : null,
      fontStyle: style?.fontStyle || null,
      textTransform: style?.textTransform || null,
    }));
  const normalize = probeHelpers.normalizeWhitespace || ((text) => String(text || "").replace(/\s+/g, " ").trim());
  const recoverVisibleLabel =
    probeHelpers.recoverVisibleLabel ||
    ((candidate) => ({
      text: normalize(candidate?.innerText || candidate?.textContent || ""),
      source: "inner-text",
      hasUsableVisibleText: true,
      recoveredFromDescendant: false,
      fragmentCount: 0,
    }));
  const INTERACTIVE_SELECTOR =
    "button, a[href], [role='button'], input[type='button'], input[type='submit'], input[type='reset']";
  const NON_PURCHASE_CTA_PATTERN =
    /(wishlist|favorite|favourite|heart|compare|share|quick|view|details|детал|порівн|сравн|избран|обран|favorite|перегляд)/i;
  const matchesPurchaseCta =
    probeHelpers.matchesPurchaseCta ||
    ((text) => /(?:^|[^\p{L}\p{N}])(?:купити|купить|купуй|придбати|до\s+кошика|в\s+корзину|оформ(?:ити|ить|лення|ление)|замов(?:ити|лення)|заказ(?:ать|у)?|add[\s_-]*to[\s_-]*(?:cart|basket|bag)|add[\s_-]*(?:cart|basket|bag)|buy(?:[\s_-]*(?:now|small|btn|button))?|cart|basket|checkout|order[\s_-]*now|shop[\s_-]*now)(?=$|[^\p{L}\p{N}])/iu.test(text || ""));
  const FULL_WIDTH_HINT_PATTERN = /(full-width|fullwidth|w-full|block|wide|add-to-cart--full)/i;
  // A consent control captured as a brand button. Two facts, both judged on
  // the live element: it sits in an OVERLAY (a modal role, or a fixed
  // ancestor -- geometry, not class names) and its accessible name is a
  // consent CHOICE verb. Both are required: a sticky-header purchase CTA is
  // fixed but not a choice, a body "Accept order" is choice-shaped but not
  // fixed. The literals are the ones lib/overlay-dismissal.js exports; a page
  // function closes over NOTHING and this one's signature is fixed by its
  // callers, so it cannot take them as an argument and repeats them instead,
  // and overlay-dismissal.test.js pins the copies equal.
  const OVERLAY_ROOT_SELECTOR = "dialog[open], [aria-modal='true'], [role='dialog'], [role='alertdialog']";
  const CONSENT_CHOICE_PATTERN = /^\s*(?:accept(?:\s+all)?(?:\s+cookies)?|allow(?:\s+all)?(?:\s+cookies)?|(?:i\s+)?agree|i\s+accept|got\s+it|ok(?:ay)?|decline|reject(?:\s+all)?|deny|manage(?:\s+(?:preferences|settings|cookies))?|cookie\s+settings|customi[sz]e|прийняти(?:\s+вс[іе])?|принять(?:\s+вс[её])?|погоджуюс[ья]|согласен|відхилити|отклонить|налаштування|настройки|akzeptieren|alle\s+akzeptieren|ablehnen|zustimmen|einverstanden|akceptuj[ęe]?|zaakceptuj|odrzuć|zgadzam\s+się|accetta(?:\s+tutt[oie])?|rifiuta|acconsento|aceptar(?:\s+tod[oa]s?)?|rechazar|de\s+acuerdo|accepter|tout\s+accepter|refuser|j['’]accepte|aceitar(?:\s+tudo)?|recusar|concordo)\s*$/iu;
  const isInOverlay = (node) => {
    if (!(node instanceof Element)) return false;
    if (node.closest(OVERLAY_ROOT_SELECTOR)) return true;
    for (let cursor = node; cursor instanceof Element; cursor = cursor.parentElement) {
      if (window.getComputedStyle(cursor).position === "fixed") return true;
    }
    return false;
  };
  const accessibleName = (node) =>
    normalize(node.getAttribute("aria-label") || node.getAttribute("title") || recoverVisibleLabel(node).text || "");
  const looksLikeConsentChoice = (node) => CONSENT_CHOICE_PATTERN.test(accessibleName(node));
  const numberOrNull = (value) => (Number.isFinite(value) ? value : null);
  const isVisible =
    probeHelpers.isVisibleElement ||
    ((candidate) => {
      if (!(candidate instanceof Element)) return false;
      const candidateStyle = window.getComputedStyle(candidate);
      const rect = candidate.getBoundingClientRect();
      return (
        candidateStyle.display !== "none" &&
        candidateStyle.visibility !== "hidden" &&
        rect.width > 0 &&
        rect.height > 0
      );
    });
  const scoreCandidate = (candidate) => {
    if (!(candidate instanceof Element)) return Number.NEGATIVE_INFINITY;
    const candidateStyle = window.getComputedStyle(candidate);
    const candidateLabel = recoverVisibleLabel(candidate);
    const candidateText = candidateLabel.text;
    const candidateMeta = [
      candidateText,
      candidate.getAttribute("aria-label") || "",
      candidate.getAttribute("title") || "",
      candidate.getAttribute("class") || "",
      candidate.getAttribute("id") || "",
    ].join(" ");
    let score = 0;
    if (candidate.matches(INTERACTIVE_SELECTOR)) score += 6;
    if (toHex(candidateStyle.backgroundColor)) score += 3;
    if ((Number.parseFloat(candidateStyle.borderWidth) || 0) > 0) score += 1;
    if (candidateText) score += 1;
    if (matchesPurchaseCta(candidateMeta)) score += 4;
    if (NON_PURCHASE_CTA_PATTERN.test(candidateMeta)) score -= 8;
    // The same weight the non-purchase vocabulary carries, so the two
    // demotions are commensurate: a consent control in an overlay scores
    // below any filled interactive button with text (11 -> 3) and sits
    // outside the hover budget instead of spending it.
    if (isInOverlay(candidate) && looksLikeConsentChoice(candidate)) score -= 8;
    return score;
  };
  const contentWidthFor = (candidate) => {
    if (!(candidate instanceof Element)) return null;
    const style = window.getComputedStyle(candidate);
    const rect = candidate.getBoundingClientRect();
    const paddingLeft = Number.parseFloat(style.paddingLeft) || 0;
    const paddingRight = Number.parseFloat(style.paddingRight) || 0;
    return numberOrNull(Math.max(0, rect.width - paddingLeft - paddingRight));
  };
  const intentFor = ({ isFullWidth, ratio, cssWidth, display }) => {
    if (isFullWidth) return "full-width";
    if (ratio === null) return "unknown";
    if (
      cssWidth &&
      cssWidth !== "auto" &&
      cssWidth.endsWith("px") &&
      !["inline", "inline-block"].includes(display)
    ) {
      return "fixed-width";
    }
    return "content-sized";
  };
  const layoutEvidenceFor = (target) => {
    const style = window.getComputedStyle(target);
    const rect = target.getBoundingClientRect();
    const parent = target.parentElement && isVisible(target.parentElement) ? target.parentElement : null;
    const parentWidth = contentWidthFor(parent);
    const computedWidth = numberOrNull(rect.width);
    const computedHeight = numberOrNull(rect.height);
    const ratio = parentWidth && computedWidth !== null ? computedWidth / parentWidth : null;
    const classList = [...target.classList];
    const hintSource = [target.id || "", ...classList].join(" ");
    const cssWidth = target.style.width || style.width || "";
    const lineHeight = Number.parseFloat(style.lineHeight);
    const marginLeft = Number.parseFloat(style.marginLeft);
    const marginRight = Number.parseFloat(style.marginRight);
    const isFullWidth = Boolean(
      (ratio !== null && ratio >= 0.85) ||
      cssWidth.trim() === "100%" ||
      (["block", "flex", "grid"].includes(style.display) && ratio !== null && ratio >= 0.8)
    );
    return {
      intent: intentFor({
        isFullWidth,
        ratio,
        cssWidth,
        display: style.display,
      }),
      isFullWidth,
      computedWidthPx: computedWidth,
      computedHeightPx: computedHeight,
      parentWidthPx: parentWidth,
      widthRatioToParent: ratio === null ? null : Number(ratio.toFixed(4)),
      display: style.display,
      cssWidth,
      cssMinWidth: style.minWidth || "",
      cssMaxWidth: style.maxWidth || "",
      boxSizing: style.boxSizing,
      lineHeightPx: Number.isFinite(lineHeight) ? lineHeight : null,
      alignSelf: style.alignSelf,
      justifyContent: style.justifyContent,
      marginLeftPx: Number.isFinite(marginLeft) ? marginLeft : null,
      marginRightPx: Number.isFinite(marginRight) ? marginRight : null,
      classList,
      id: target.id || "",
      classHintMatched: FULL_WIDTH_HINT_PATTERN.test(hintSource),
    };
  };
  const resolveProbeTarget = (candidate) => {
    if (!(candidate instanceof Element)) {
      return { node: element, resolvedFrom: "self" };
    }
    const candidates = [
      { node: candidate, resolvedFrom: "self" },
      {
        node: candidate.closest(INTERACTIVE_SELECTOR),
        resolvedFrom: "closest-interactive-ancestor",
      },
      {
        node: [...candidate.querySelectorAll(INTERACTIVE_SELECTOR)].find(isVisible) || null,
        resolvedFrom: "interactive-descendant",
      },
    ]
      .filter((entry) => entry.node instanceof Element && isVisible(entry.node))
      .sort((left, right) => scoreCandidate(right.node) - scoreCandidate(left.node));

    return candidates[0] || { node: element, resolvedFrom: "self" };
  };
  const resolved = resolveProbeTarget(element);
  const targetElement = resolved.node || element;
  const targetStyle = window.getComputedStyle(targetElement);
  const layout = layoutEvidenceFor(targetElement);
  const targetLabel = recoverVisibleLabel(targetElement);
  const targetText = targetLabel.text || normalize(targetElement.innerText || targetElement.textContent || "");
  const visuallyUsableText = Boolean(
    probeHelpers.hasVisuallyUsableLabel
      ? probeHelpers.hasVisuallyUsableLabel(targetElement, targetLabel)
      : targetLabel.hasUsableVisibleText,
  );
  const signalText = [
    targetText,
    targetElement.getAttribute("aria-label") || "",
    targetElement.getAttribute("title") || "",
    targetElement.getAttribute("class") || "",
    targetElement.getAttribute("id") || "",
  ].join(" ");
  const hasUsableVisibleText = visuallyUsableText;
  const looksLikeNonPurchaseCta = NON_PURCHASE_CTA_PATTERN.test(signalText);
  const looksLikePurchaseCta = matchesPurchaseCta(signalText) && !looksLikeNonPurchaseCta;
  const ctaResolvedToIconOnly = Boolean(
    looksLikePurchaseCta &&
    !hasUsableVisibleText &&
    layout.computedWidthPx !== null &&
    layout.computedHeightPx !== null &&
    layout.computedWidthPx <= 64 &&
    layout.computedHeightPx <= 64 &&
    Math.abs(layout.computedWidthPx - layout.computedHeightPx) <= 16
  );
  const ctaLabelNotUsable = Boolean(looksLikePurchaseCta && !hasUsableVisibleText);
  const ctaIsIconLike = Boolean(ctaResolvedToIconOnly);
  const homepageCtaNotReusableAsText = Boolean(
    looksLikePurchaseCta && (ctaIsIconLike || ctaLabelNotUsable)
  );
  const ctaHasInlineIcon = typeof probeHelpers.measureCtaHasInlineIcon === "function"
    ? probeHelpers.measureCtaHasInlineIcon(targetElement, hasUsableVisibleText)
    : null;
  const record = {
    tag: targetElement.tagName.toLowerCase(),
    text: targetText.slice(0, 120),
    textSource: targetLabel.source || "inner-text",
    backgroundColor: toHex(targetStyle.backgroundColor),
    fontColor: toHex(targetStyle.color),
    borderColor: pickBorderColor(targetStyle),
    borderWidth: Number.parseFloat(targetStyle.borderWidth) || 0,
    borderRadius: Number.parseFloat(targetStyle.borderRadius) || 0,
    padding: {
      left: Number.parseFloat(targetStyle.paddingLeft) || 0,
      right: Number.parseFloat(targetStyle.paddingRight) || 0,
      top: Number.parseFloat(targetStyle.paddingTop) || 0,
      bottom: Number.parseFloat(targetStyle.paddingBottom) || 0,
    },
    ...readTypographyStyle(targetStyle),
    matchedTag: element.tagName.toLowerCase(),
    resolvedFrom: resolved.resolvedFrom,
    layout,
    selectionSignals: {
      hasFilledBackground: Boolean(toHex(targetStyle.backgroundColor)),
      looksLikePurchaseCta,
      looksLikeNonPurchaseCta,
      candidateScore: scoreCandidate(targetElement),
      hasUsableVisibleText,
      ctaHasUsableVisibleText: hasUsableVisibleText,
      ctaLabelNotUsable,
      ctaIsIconLike,
      ctaResolvedToIconOnly,
      ctaHasInlineIcon,
      homepageCtaNotReusableAsText,
      labelRecoveredFromDescendant: Boolean(targetLabel.recoveredFromDescendant),
      labelFragmentCount: Number.isInteger(targetLabel.fragmentCount) ? targetLabel.fragmentCount : 0,
      isFullWidth: layout.isFullWidth,
      widthRatioToParent: layout.widthRatioToParent,
      inOverlay: isInOverlay(targetElement),
      looksLikeConsentControl: looksLikeConsentChoice(targetElement),
    },
  };
  if (wantElementKey) {
    // Stable per-ELEMENT identity for the diagnostics sidecar, minted
    // here because this is the one evaluate that already runs for every
    // matched row — a separate identity call would double phase 1's
    // round trips, the very cost being measured.
    //
    // The key is taken on `targetElement`, the RESOLVED probe target
    // (the node phase 2 actually hovers), not on the raw match: three
    // overlapping selectors reaching one button must produce one key,
    // which is what makes `redundantRowsInBudget` meaningful.
    //
    // A WeakMap keeps the page from retaining detached nodes; the id is
    // an opaque counter, never a selector or any page text, so nothing
    // page-authored can reach the sidecar through it. The transport is
    // an own property appended LAST to the record and deleted by the
    // caller before the row is used, so `button-styles.json` keeps both
    // its field set and its key order.
    const store =
      window.__brandkitProbeElementIds ||
      (window.__brandkitProbeElementIds = { map: new WeakMap(), next: 1 });
    let assigned = store.map.get(targetElement);
    if (!assigned) {
      assigned = `e${store.next}`;
      store.next += 1;
      store.map.set(targetElement, assigned);
    }
    record.__brandkitElementKey = assigned;
  }
  return record;
}

// Pull the in-page element key off the base record and back into the row.
// The key rides on the record because the base read is the one evaluate that
// already runs for every match; it is deleted here so `button-styles.json`
// keeps exactly the field set (and key order) it had before identity existed.
function detachButtonProbeElementKey(base, wantElementKey) {
  if (!wantElementKey || !base || typeof base !== "object") return null;
  const key = base.__brandkitElementKey ?? null;
  delete base.__brandkitElementKey;
  return key;
}

/**
 * Phase 1, one row at a time — the path that has always run.
 *
 * Two remote round trips per MATCH (`isVisible()` then the base evaluate) plus
 * one `count()` per selector. This is the only path: the batched variant it
 * was the reference for was deleted at `deb5a9a`.
 */
async function collectButtonPhase1PerRow(page, activeSelectors, { wantElementKey, diagnosticsOn }) {
  const rows = [];
  for (const selector of activeSelectors) {
    const locator = page.locator(selector);
    const count = await locator.count();
    for (let index = 0; index < count; index += 1) {
      const target = locator.nth(index);
      // Phase 1 is two remote round trips per match (`isVisible` + the base
      // evaluate) and that is the hypothesis `phase1Ms` sizes, so the clock
      // starts before the visibility probe, not after it.
      const rowStartedAt = Date.now();
      if (!(await target.isVisible().catch(() => false))) {
        continue;
      }

      const base = await target.evaluate(buttonProbeBaseEvaluate, wantElementKey);
      const elementKey = detachButtonProbeElementKey(base, wantElementKey);
      rows.push({
        selector,
        matchIndex: index,
        target,
        base,
        elementKey,
        phase1Ms: diagnosticsOn ? Date.now() - rowStartedAt : null,
      });
    }
  }
  return rows;
}

// `diagnostics` is an optional passive sink (lib/button-probe-diagnostics.js).
// When it is absent this collector runs EXACTLY as it did before instrumentation
// existed: no extra evaluate, no extra in-page state, no stderr event. When it is
// present the collector additionally records, per emitted row, which hover path
// ran and how long each stage took — see the module header for why. The returned
// rows are the same either way; nothing recorded here feeds the assembler.
export async function collectButtonStyles(
  page,
  selectors,
  { diagnostics = null, overlay = null } = {},
) {
  // `overlay` (lib/overlay-dismissal.js, created per page by the homepage
  // pass) is asked to clear whatever covers the target before the FIRST
  // pointer hover of this probe, and again -- once per interceptor -- when a
  // hover is refused for intercepting pointer events. Absent, the probe runs
  // exactly as before; present but idle (nothing covers the page), it costs
  // one read before the first pointer hover and nothing else.
  let overlayCheckedBeforeFirstPointerHover = false;
  const activeSelectors = Array.isArray(selectors) ? selectors.filter(Boolean) : [];
  const diagnosticsOn = Boolean(diagnostics);
  // In-page element identity is minted by the base read only when the sidecar
  // needs it to report duplicates; without a sidecar it is not minted at all,
  // so the default path takes no extra reads and leaves no page state.
  const wantElementKey = diagnosticsOn;
  const phase1StartedAt = Date.now();

  // Phase 1: collect base styles for every visible match without hovering.
  // Each hover costs up to BUTTON_HOVER_TIMEOUT_MS, so phase 1 is intentionally
  // hover-free; we score afterwards and reserve the hover budget for the
  // highest-scoring candidates in phase 2.
  //
  // MINIMUM TAP-TARGET FLOOR — rows whose SHORTER side measures under
  // `MIN_BUTTON_TAP_TARGET_PX` are dropped here, before the score sort.
  //
  // Why here and not downstream: the ranker buckets candidates by colour and
  // ranks by row count, so a strip of identical carousel-pagination dots
  // outvotes the page's single real CTA and gets crowned
  // `button-primary-background`. That hint is mapped to `brand_primary`
  // downstream, so one 6x6 dot's colour reaches every module colour, not just
  // one button. Measured on one live storefront: twelve dots buried a 300x40
  // subscribe button out of the emitted candidate window entirely.
  //
  // Why at capture and not in `applyButtonNoiseFilter`: that filter runs
  // BEFORE `backfillButtonDimensionsFromProbe` (extraction-pass-helpers.js
  // :407 vs :424) and agents routinely strip layout dimensions from the rows
  // it sees — which is precisely why the backfill exists — so a floor there
  // would silently no-op on the rows it most needs to judge. Capture is the
  // single choke point feeding the scaffold rows, the ranker, the colour
  // pre-emit, `buildCandidates`, the dimension backfill and the focused-pass
  // fallback.
  //
  // The threshold is EMPIRICAL, not an accessibility rule. WCAG SC 2.5.8 does
  // name 24 CSS px, but it carries a spacing exception: a sub-24 target is
  // legal, and a carousel dot is a legitimate control — just never a brand's
  // primary button. 24 is a standards-anchored round number chosen because it
  // sits inside a gap measured on twelve live storefronts at this collector's
  // capture viewport (1920x1080). In that survey NO genuine primary CTA fell
  // below 24px on its shorter side anywhere; every sub-24 solid-background
  // row was chrome, the largest being price-badge links at 20px. The smallest
  // genuine CTA in the fleet measures 116x32. So the measured gap is
  // (20 ... 32): 4px of margin below the floor and 8px above it. That margin
  // is real but NOT generous — moving this number requires re-measuring the
  // gap, and raising it past 32 is known to start cutting real CTAs.
  //
  // The comparison is strictly-less-than on purpose, and that is load-bearing
  // today rather than a hypothetical: one surveyed storefront renders
  // solid-background rows at exactly 24x24. `<= 24` would discard them.
  //
  // Applied uniformly to solid and empty backgrounds. Rows whose dimensions
  // are not measurable are KEPT — the floor only drops on a measurement it
  // actually has.
  const MIN_BUTTON_TAP_TARGET_PX = 24;
  let droppedBelowMinTapTarget = 0;
  // Phase 1 rows, one row at a time: `count()` plus `isVisible()` + the base
  // evaluate per match. The tap target floor, the sort and phase 2 below read
  // only the row shape.
  const phase1Rows = await collectButtonPhase1PerRow(page, activeSelectors, { wantElementKey, diagnosticsOn });

  const candidates = [];
  for (const row of phase1Rows) {
    const base = row.base;
    const targetWidthPx = base?.layout?.computedWidthPx;
    const targetHeightPx = base?.layout?.computedHeightPx;
    if (
      Number.isFinite(targetWidthPx) &&
      Number.isFinite(targetHeightPx) &&
      Math.min(targetWidthPx, targetHeightPx) < MIN_BUTTON_TAP_TARGET_PX
    ) {
      droppedBelowMinTapTarget += 1;
      continue;
    }

    candidates.push({
      selector: row.selector,
      matchIndex: row.matchIndex,
      target: row.target,
      base,
      elementKey: row.elementKey,
      phase1Ms: row.phase1Ms,
    });
  }
  const phase1ElapsedMs = diagnosticsOn ? Date.now() - phase1StartedAt : null;

  // Drop count is logged so a false drop is observable in production rather
  // than silent: a site whose real CTA vanished from the brandkit shows a
  // non-zero count here against a small `kept`.
  if (droppedBelowMinTapTarget > 0) {
    process.stderr.write(JSON.stringify({
      level: "info",
      event: "collectButtonStyles.below_min_tap_target_dropped",
      dropped: droppedBelowMinTapTarget,
      kept: candidates.length,
      minTapTargetPx: MIN_BUTTON_TAP_TARGET_PX,
    }) + "\n");
  }

  // Score-sort so the hover budget covers the most prominent buttons first.
  // Ties resolve by selector match order to keep output stable across runs
  // (this preserves the ordering semantics the previous trailing sort had).
  candidates.sort((left, right) => {
    const leftScore = left.base?.selectionSignals?.candidateScore || 0;
    const rightScore = right.base?.selectionSignals?.candidateScore || 0;
    if (rightScore !== leftScore) {
      return rightScore - leftScore;
    }
    return left.matchIndex - right.matchIndex;
  });

  // Phase 2: hover only the top-K and capture hover state. Buttons beyond
  // the budget keep `hover: null`, which downstream treats the same as a
  // hover failure (the catch-block path below already produced `hover: null`
  // for individual hover failures, so this is a strict superset of that
  // behavior, not new semantics).
  const result = [];
  const phase2StartedAt = Date.now();
  for (let i = 0; i < candidates.length; i += 1) {
    const { selector, matchIndex, target, base, elementKey, phase1Ms } = candidates[i];
    let hover = null;
    // One row of the diagnostics sidecar, pre-seeded with the "never got that
    // far" values so a row past the hover budget is reported as such rather
    // than as a silent absence.
    const diagnosticsRow = diagnosticsOn
      ? {
          selector,
          matchIndex,
          elementKey,
          phase1Ms,
          hoverPath: "none",
          cssomNull: null,
          hoverOutcome: "skipped-budget",
          hoverMs: null,
          settleEnd: null,
          settleMs: null,
          errorClass: null,
          interceptor: null,
          preSettle: null,
          postSettle: null,
        }
      : null;
    if (i < BUTTON_HOVER_BUDGET) {
      // Resolve the probe target inside the page and read its hover state either
      // from matching CSS :hover rules (useCssom=true — no pointer hover, no
      // transition settle) or from the live computed style after a mouse hover
      // (useCssom=false). Both paths share the same target-resolution logic and
      // return the same 4-field record (or null).
      const captureHoverEval = (element, useCssom) => {
        const probeHelpers = window.__brandkitProbeHelpers || {};
        const toHex = probeHelpers.toHex || (() => null);
        const pickBorderColor = probeHelpers.pickBorderColor || ((style) => toHex(style?.borderColor));
        const normalize = probeHelpers.normalizeWhitespace || ((text) => String(text || "").replace(/\s+/g, " ").trim());
        const recoverVisibleLabel =
          probeHelpers.recoverVisibleLabel ||
          ((candidate) => ({
            text: normalize(candidate?.innerText || candidate?.textContent || ""),
            source: "inner-text",
            hasUsableVisibleText: true,
            recoveredFromDescendant: false,
            fragmentCount: 0,
          }));
        const INTERACTIVE_SELECTOR =
          "button, a[href], [role='button'], input[type='button'], input[type='submit'], input[type='reset']";
        const matchesPurchaseCta =
          probeHelpers.matchesPurchaseCta ||
          ((text) => /(?:^|[^\p{L}\p{N}])(?:купити|купить|купуй|придбати|до\s+кошика|в\s+корзину|оформ(?:ити|ить|лення|ление)|замов(?:ити|лення)|заказ(?:ать|у)?|add[\s_-]*to[\s_-]*(?:cart|basket|bag)|add[\s_-]*(?:cart|basket|bag)|buy(?:[\s_-]*(?:now|small|btn|button))?|cart|basket|checkout|order[\s_-]*now|shop[\s_-]*now)(?=$|[^\p{L}\p{N}])/iu.test(text || ""));
        const isVisible =
          probeHelpers.isVisibleElement ||
          ((candidate) => {
            if (!(candidate instanceof Element)) return false;
            const candidateStyle = window.getComputedStyle(candidate);
            const rect = candidate.getBoundingClientRect();
            return (
              candidateStyle.display !== "none" &&
              candidateStyle.visibility !== "hidden" &&
              rect.width > 0 &&
              rect.height > 0
            );
          });
        const scoreCandidate = (candidate) => {
          if (!(candidate instanceof Element)) return Number.NEGATIVE_INFINITY;
          const candidateStyle = window.getComputedStyle(candidate);
          const candidateLabel = recoverVisibleLabel(candidate);
          const candidateText = candidateLabel.text;
          const candidateMeta = [
            candidateText,
            candidate.getAttribute("aria-label") || "",
            candidate.getAttribute("title") || "",
            candidate.getAttribute("class") || "",
            candidate.getAttribute("id") || "",
          ].join(" ");
          let score = 0;
          if (candidate.matches(INTERACTIVE_SELECTOR)) score += 6;
          if (toHex(candidateStyle.backgroundColor)) score += 3;
          if ((Number.parseFloat(candidateStyle.borderWidth) || 0) > 0) score += 1;
          if (candidateText) score += 1;
          if (matchesPurchaseCta(candidateMeta)) score += 4;
          return score;
        };
        const resolveProbeTarget = (candidate) => {
          if (!(candidate instanceof Element)) {
            return element;
          }
          const candidates = [
            candidate,
            candidate.closest(INTERACTIVE_SELECTOR),
            [...candidate.querySelectorAll(INTERACTIVE_SELECTOR)].find(isVisible) || null,
          ]
            .filter((entry) => entry instanceof Element && isVisible(entry))
            .sort((left, right) => scoreCandidate(right) - scoreCandidate(left));

          return candidates[0] || element;
        };
        const targetElement = resolveProbeTarget(element);
        if (useCssom) {
          const readCss = probeHelpers.readHoverStyleFromCssRules;
          const cssHover = typeof readCss === "function" ? readCss(targetElement) : null;
          // null when no :hover rule matches (e.g. JS-toggled hover classes) —
          // the mouse fallback below then runs to recover those states.
          return cssHover
            ? {
                backgroundColor: cssHover.backgroundColor,
                fontColor: cssHover.fontColor,
                borderColor: cssHover.borderColor,
                borderWidth: cssHover.borderWidth,
              }
            : null;
        }
        const style = window.getComputedStyle(targetElement);
        return {
          backgroundColor: toHex(style.backgroundColor),
          fontColor: toHex(style.color),
          borderColor: pickBorderColor(style),
          borderWidth: Number.parseFloat(style.borderWidth) || 0,
        };
      };

      // CSSOM-first: cheap, and (unlike a pointer hover) still resolves when a
      // wrapping <a> swallows pointer events — the pattern that left these fields
      // empty on real ecom sites while still paying the full hover+settle cost.
      hover = await target.evaluate(captureHoverEval, true).catch(() => null);
      if (diagnosticsRow) {
        // True for both "no :hover rule matched" and "the CSSOM read threw"
        // (the `.catch` above collapses them). Either way the pointer
        // fallback is what runs next, which is what this counter sizes.
        diagnosticsRow.cssomNull = hover === null;
      }
      if (hover === null) {
        // Fall back to mouse-driven hover only when no :hover rule matched, so
        // `hover: null` stays a strict subset of the prior mouse-only failures.
        if (diagnosticsRow) diagnosticsRow.hoverPath = "pointer";
        if (overlay && !overlayCheckedBeforeFirstPointerHover) {
          // Proactive, on the first row that needs a pointer at all: a
          // popup that opened after settle is cleared here for the price
          // of one read, instead of every budget row paying the timeout
          // and only then learning why. Never throws (the controller
          // reports its own failures in the status record).
          overlayCheckedBeforeFirstPointerHover = true;
          await overlay.clearFor(target);
        }
        const pointerHoverStartedAt = Date.now();
        const attemptPointerHover = async () => {
          await target.hover({ timeout: BUTTON_HOVER_TIMEOUT_MS });
          if (diagnosticsRow) {
            diagnosticsRow.hoverMs = Date.now() - pointerHoverStartedAt;
            // SHADOW READ for the deferred "skip the settle" idea: the hover
            // value as it stands the instant `hover()` resolves, before the
            // settle wait. Read-only (getComputedStyle plus the same
            // read-only target resolution the capture uses), taken here
            // because after the settle the pre-settle state is gone.
            diagnosticsRow.preSettle = await target.evaluate(captureHoverEval, false).catch(() => null);
          }
          // Wait for the button's own ``transitionend`` OR
          // ``HOVER_TRANSITION_SETTLE_MS``, whichever comes first. Without this
          // the next ``evaluate(getComputedStyle)`` call reads the style mid-
          // transition on sites with slow hover animations (see
          // ``HOVER_TRANSITION_SETTLE_MS`` comment for the slow-transition
          // regression that motivated this). Failures (no transitionend, evaluate errors)
          // are swallowed so the settle is best-effort and never blocks the
          // hover read itself.
          // The resolved value says WHICH of the two ends the settle — the
          // count of `timeout` endings is what tells the deferred settle-skip
          // idea whether a transition is involved at all. It was previously
          // discarded, so reporting it changes nothing that is read.
          const settleStartedAt = Date.now();
          const settleEnd = await target.evaluate((el, settle) => new Promise((resolve) => {
            let done = false;
            const finish = (reason) => {
              if (done) return;
              done = true;
              try { el.removeEventListener("transitionend", onTransitionEnd); } catch {}
              resolve(reason);
            };
            const onTransitionEnd = () => finish("transitionend");
            try { el.addEventListener("transitionend", onTransitionEnd, { once: true }); } catch {}
            setTimeout(() => finish("timeout"), settle);
          }), HOVER_TRANSITION_SETTLE_MS).catch(() => {});
          if (diagnosticsRow) {
            diagnosticsRow.settleMs = Date.now() - settleStartedAt;
            diagnosticsRow.settleEnd =
              settleEnd === "transitionend" || settleEnd === "timeout" ? settleEnd : null;
          }
          const captured = await target.evaluate(captureHoverEval, false);
          if (diagnosticsRow) {
            diagnosticsRow.hoverOutcome = "ok";
            diagnosticsRow.postSettle = captured;
          }
          return captured;
        };
        const recordPointerHoverFailure = (error) => {
          if (!diagnosticsRow) return classifyHoverError(error);
          if (diagnosticsRow.hoverMs === null) {
            // The throw came from `hover()` itself, so the elapsed time IS
            // the cost of the failure — the number that sizes "a failed
            // hover burns its full actionability timeout".
            diagnosticsRow.hoverMs = Date.now() - pointerHoverStartedAt;
          }
          const classified = classifyHoverError(error);
          diagnosticsRow.hoverOutcome = classified.outcome;
          diagnosticsRow.errorClass = classified.errorClass;
          diagnosticsRow.interceptor = classified.interceptor;
          return classified;
        };
        try {
          hover = await attemptPointerHover();
        } catch (error) {
          hover = null;
          const classified = recordPointerHoverFailure(error);
          if (overlay && classified.errorClass === "intercepts pointer events") {
            // Reactive: the platform named an element covering the target.
            // The controller re-detects it, escalates once per interceptor
            // and says whether ONE retry is worth its cost. The row keeps
            // the first failure's class and interceptor beside the retried
            // outcome. A retry that fails again is recorded as a failure
            // like any other and is not retried a second time.
            overlay.noteIntercepted();
            const cleared = await overlay.dismissNamed(classified.interceptor, target);
            if (cleared.retryable) {
              overlay.noteRetried();
              if (diagnosticsRow) {
                diagnosticsRow.hoverRetried = true;
                diagnosticsRow.hoverMs = null;
              }
              try {
                hover = await attemptPointerHover();
              } catch (retryError) {
                hover = null;
                recordPointerHoverFailure(retryError);
              }
            }
          }
        }
      } else if (diagnosticsRow) {
        diagnosticsRow.hoverPath = "cssom";
        diagnosticsRow.hoverOutcome = "ok";
        diagnosticsRow.postSettle = hover;
      }
    }

    if (diagnostics) {
      diagnostics.recordRow(diagnosticsRow);
    }

    result.push({
      selector,
      matchIndex,
      default: base,
      hover,
    });
  }

  if (diagnostics) {
    diagnostics.setPhaseTimings({
      phase1Ms: phase1ElapsedMs,
      phase2Ms: Date.now() - phase2StartedAt,
    });
    diagnostics.writeStderrEvent();
  }

  return result;
}

// Score threshold an alternative CTA must meet to be preferred over the
// originally-captured one. 12 = interactive-selector(+6) + visible-text(+2)
// + purchase-keyword(+4) — i.e. the alt must look like a real buy/cart action,
// not a quick-view / wishlist overlay. Lowering this makes alt swaps more
// aggressive; raising it makes them more conservative.
const MIN_ALT_CTA_SCORE = 12;

// Initializes provenance fields on row.cta with default values (no swap).
// Always called for every row that finishes hover capture, so downstream sees a
// consistent shape regardless of whether alt discovery ran.
function _initCtaProvenance(row) {
  if (!row?.cta || typeof row.cta !== "object") return;
  if (row.cta.source === undefined) row.cta.source = "default";
  if (row.cta.alternativeReason === undefined) row.cta.alternativeReason = null;
  if (row.cta.alternativeRejectedReason === undefined) row.cta.alternativeRejectedReason = null;
  // False until a swap lands. Initialised here rather than left undefined so
  // "this default was read at rest" is a claim the artifact makes, not one a
  // consumer has to infer from a missing key.
  if (row.cta.stylesReadUnderHover === undefined) row.cta.stylesReadUnderHover = false;
  if (row.cta.originalCandidate === undefined) row.cta.originalCandidate = null;
}

// Runs alt-CTA discovery for a single row when the original CTA's hover state
// shows an own-style/box suppression signal (zero area, display, visibility,
// or opacity). Transparent colour alone is not suppression. Ancestor opacity,
// clipping, generated paint, and offscreen suppression are not fully modeled.
// Mutates row.cta in place when a higher-scoring alternative is found that's
// distinct from the originally-captured element. Otherwise leaves row.cta
// untouched and source remains "default".
//
// Preconditions: cursor is positioned over the original CTA (descendant of
// cardLocator), so the card is implicitly in :hover state and alt elements
// revealed by `.card:hover .alt {...}` are already visible at evaluate-time.
async function _maybeSwapToHoverRevealedAltCta(row, cardLocator, originalElement) {
  _initCtaProvenance(row);
  if (!row?.cta || typeof row.cta !== "object") return;
  const defaultRecord = {
    backgroundColor: row.cta.backgroundColor,
    computedHeightPx: row.cta.layout?.computedHeightPx,
  };
  const gate = isCtaSuppressedOnHover(defaultRecord, row.cta.hover);
  if (!gate.suppressed) return;

  // Playwright's locator.evaluate(fn, arg) only accepts a single arg; multiple
  // params must be wrapped in one object.
  const altResult = await cardLocator
    .evaluate((card, { originalSelector, originalText, originalElement, MIN_SCORE }) => {
      const helpers = window.__brandkitProbeHelpers || {};
      const scorer = helpers.scoreAllCtaCandidatesWithinCard;
      const reader = helpers.readHoverStyleFor;
      const recover = helpers.recoverVisibleLabel;
      if (typeof scorer !== "function" || typeof reader !== "function") return null;

      // Re-locate the original element so we can exclude it from candidates.
      // Prefer the captured selector; fall back to the heuristic finder when
      // the row had no selector (heuristic-discovered originals).
      let originalEl = originalElement || null;
      if (!originalEl && originalSelector) {
        try {
          originalEl = card.querySelector(originalSelector);
        } catch {
          originalEl = null;
        }
      }
      if (!originalEl && typeof helpers.findHeuristicCtaWithinCard === "function") {
        originalEl = helpers.findHeuristicCtaWithinCard(card, originalText || "");
      }

      const ranked = scorer(card, originalText || "");
      if (!ranked.length) return null;

      const cardRect = card.getBoundingClientRect();
      const visibleCard = {
        left: Math.max(0, cardRect.left), top: Math.max(0, cardRect.top),
        right: Math.min(window.innerWidth, cardRect.right),
        bottom: Math.min(window.innerHeight, cardRect.bottom),
      };
      const overlapsVisibleCard = (element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 &&
          Math.max(rect.left, visibleCard.left) < Math.min(rect.right, visibleCard.right) &&
          Math.max(rect.top, visibleCard.top) < Math.min(rect.bottom, visibleCard.bottom);
      };
      const altEntry = ranked.find(
        (entry) => entry.element !== originalEl && entry.score >= MIN_SCORE &&
          // A plain card can match its child's label without being an action;
          // custom card-root actions may instead expose a live DOM click handler.
          (entry.reasons.some((reason) => reason.source === "interactive-selector") ||
            (entry.element === card && typeof card.onclick === "function")) &&
          // The shared scorer checks only the element's own styles. Admission
          // needs browser visibility through ancestors, in the same evaluation
          // as the style read below (no intervening pointer movement).
          entry.element.checkVisibility({
            opacityProperty: true,
            visibilityProperty: true,
            contentVisibilityAuto: true,
          }) && overlapsVisibleCard(entry.element),
      );
      if (!altEntry) return null;

      const altLabel = typeof recover === "function"
        ? recover(altEntry.element)
        : { text: "", source: null, hasUsableVisibleText: false };
      const altStyles = reader(altEntry.element);
      // The alt's own `:hover`, read from CSSOM. A mouse-driven read is not
      // available here: the cursor must stay on the original CTA for the alt
      // to remain revealed at all, so the alt can never be hovered in this
      // pass. `readHoverStyleFromCssRules` is the reader the mouse-driven
      // path already falls back to for exactly this situation (the element
      // cannot be reached by the pointer), and it returns null when no
      // `:hover` declaration touches a colour field.
      const altHoverReader = helpers.readHoverStyleFromCssRules;
      const altHover =
        typeof altHoverReader === "function" ? altHoverReader(altEntry.element) : null;
      const rect = altEntry.element.getBoundingClientRect();
      const usableText = Boolean(altLabel.hasUsableVisibleText &&
        (typeof helpers.hasVisuallyUsableLabel !== "function" || helpers.hasVisuallyUsableLabel(altEntry.element, altLabel)));
      const layout = typeof helpers.productCardLayoutEvidenceFor === "function"
        ? helpers.productCardLayoutEvidenceFor(altEntry.element, card) : null;
      const compact = rect.width <= 80 && rect.height <= 56 &&
        (layout?.widthRatioToParent == null || layout.widthRatioToParent <= 0.35);
      const zeroLabel = altLabel.extentPx?.widthPx === 0 || altLabel.extentPx?.heightPx === 0;
      const meta = [altLabel.text, altEntry.element.getAttribute("aria-label") || "",
        altEntry.element.getAttribute("title") || "", altEntry.element.className || "",
        altEntry.element.id || "", altEntry.element instanceof HTMLAnchorElement ? altEntry.element.href : ""].join(" ");
      return {
        hover: altHover,
        purchaseKeyword: typeof helpers.matchesPurchaseCta === "function" ? helpers.matchesPurchaseCta(meta) : false,
        looksNonPurchaseLike: /(wishlist|favorite|favourite|heart|compare|share|quick|view|details|детал|порівн|сравн|избран|обран|favorite|перегляд)/i.test(meta),
        layout,
        labelRecoveredFromDescendant: Boolean(altLabel.recoveredFromDescendant),
        text: altLabel.text || "",
        textSource: altLabel.source || null,
        hasUsableVisibleText: usableText,
        isIconLike: !usableText && (compact || zeroLabel),
        isCompact: compact,
        labelExtentPx: altLabel.extentPx ?? null,
        hasInlineIcon: typeof helpers.measureCtaHasInlineIcon === "function"
          ? helpers.measureCtaHasInlineIcon(altEntry.element, usableText) : null,
        score: altEntry.score,
        reasons: altEntry.reasons,
        tag: altEntry.element.tagName.toLowerCase(),
        classList: altEntry.element.className || "",
        styles: altStyles,
        boundingBox: {
          width: Number.isFinite(rect.width) ? rect.width : null,
          height: Number.isFinite(rect.height) ? rect.height : null,
        },
      };
    }, {
      originalElement,
      originalSelector: row.cta.selector || "",
      originalText: row.cta.text || "",
      MIN_SCORE: MIN_ALT_CTA_SCORE,
    })
    .catch(() => null);

  if (!altResult || !altResult.styles) return;

  // A swap may not LOWER the evidence. The alternative is allowed to be a
  // different design; it is not allowed to be a less-known one. Refusing here
  // rather than after the writes is the point: `row.cta` is overwritten field
  // by field a few lines below with no comparison to what it held, so an
  // alternative whose colours could not be read would silently replace
  // measured ones with nulls — which is how a measured product CTA became a
  // colourless row on a live storefront.
  const evidence = swapLowersEvidence(row.cta, {...altResult.styles, hasInlineIcon: altResult.hasInlineIcon});
  if (evidence.lowers) {
    row.cta.alternativeRejectedReason =
      `Alternative CTA scoring ${altResult.score} rejected: it would lower the ` +
      `evidence (known fields ${evidence.knownBefore} -> ${evidence.knownAfter}` +
      (evidence.lowered.length ? `; would unknow ${evidence.lowered.join(", ")}` : "") +
      `). Keeping the default-state capture.`;
    return;
  }

  // Snapshot the original before mutating row.cta.
  const originalSnapshot = {
    selector: row.cta.selector ?? null,
    resolvedFrom: row.cta.resolvedFrom ?? null,
    labelExtentPx: row.cta.labelExtentPx ?? null,
    isCompact: row.cta.isCompact ?? null,
    selectionSignals: row.selectionSignals ? {...row.selectionSignals} : null,
    text: row.cta.text ?? null,
    textSource: row.cta.textSource ?? null,
    hasUsableVisibleText: row.cta.hasUsableVisibleText ?? row.selectionSignals?.ctaHasUsableVisibleText ?? null,
    isIconLike: row.cta.isIconLike ?? row.selectionSignals?.ctaIsIconLike ?? null,
    hasInlineIcon: row.cta.hasInlineIcon ?? null,
    backgroundColor: row.cta.backgroundColor ?? null,
    fontColor: row.cta.fontColor ?? null,
    borderColor: row.cta.borderColor ?? null,
    backgroundColorState: row.cta.backgroundColorState ?? null,
    fontColorState: row.cta.fontColorState ?? null,
    borderColorState: row.cta.borderColorState ?? null,
    borderWidth: row.cta.borderWidth ?? null,
    borderRadius: row.cta.borderRadius ?? null,
    padding: row.cta.padding ?? null,
    fontFamily: row.cta.fontFamily ?? null,
    fontWeight: row.cta.fontWeight ?? null,
    fontSize: row.cta.fontSize ?? null,
    fontSizePx: row.cta.fontSizePx ?? null,
    lineHeight: row.cta.lineHeight ?? null,
    lineHeightPx: row.cta.lineHeightPx ?? null,
    letterSpacing: row.cta.letterSpacing ?? null,
    letterSpacingPx: row.cta.letterSpacingPx ?? null,
    fontStyle: row.cta.fontStyle ?? null,
    textTransform: row.cta.textTransform ?? null,
    layout: row.cta.layout ?? null,
    hover: row.cta.hover ?? null,
    // How that hover was read: a direct pointer hover, a card-fallback (the
    // pointer sat on the card at (8,8), so the element's own `:hover` never
    // applied) or a CSSOM walk. The snapshot preserved the reading and dropped
    // the one field saying how much it is worth; provenance for a measurement
    // has to survive the record that replaces it.
    hoverCaptureMode: row.cta.hoverCaptureMode ?? null,
  };

  const styles = altResult.styles;
  // Map readHoverStyleFor's flat shape onto the existing cta record. Px fields
  // become non-Px-suffixed numbers to match the row.cta convention.
  row.cta.text = altResult.text || row.cta.text;
  row.cta.textSource = altResult.textSource ?? row.cta.textSource;
  row.cta.hasUsableVisibleText = altResult.hasUsableVisibleText;
  row.cta.hasInlineIcon = altResult.hasInlineIcon ?? null;
  row.cta.isIconLike = altResult.isIconLike ?? (altResult.hasUsableVisibleText ? false : null);
  row.cta.isCompact = altResult.isCompact ?? null;
  row.cta.labelExtentPx = altResult.labelExtentPx ?? null;
  if (row.selectionSignals) {
    const discountOnly = isDiscountOnlyCtaLabel(altResult.text);
    const inferredPurchase = Boolean(!altResult.looksNonPurchaseLike && !discountOnly && altResult.isCompact &&
      (row.price?.text || row.oldPrice?.text) && (row.productUrl || row.selectionSignals.hasGridSiblings));
    const looksPurchaseLike = Boolean((altResult.purchaseKeyword || inferredPurchase) && !altResult.looksNonPurchaseLike && !discountOnly);
    Object.assign(row.selectionSignals, {
      ctaLooksPurchaseLike: looksPurchaseLike,
      ctaLooksDiscountOnly: discountOnly,
      ctaLooksNonPurchaseLike: altResult.looksNonPurchaseLike ?? false,
      ctaPurchaseIntentInferredFromCardContext: inferredPurchase,
      ctaIsFullWidth: altResult.layout?.isFullWidth ?? false,
      ctaVisibleTextFitsControl: altResult.hasUsableVisibleText,
      ctaLabelRecoveredFromDescendant: altResult.labelRecoveredFromDescendant ?? false,
      ctaHasUsableVisibleText: altResult.hasUsableVisibleText,
      ctaHasInlineIcon: row.cta.hasInlineIcon,
      ctaIsIconLike: row.cta.isIconLike,
      ctaResolvedToIconOnly: row.cta.isIconLike === true && !altResult.hasUsableVisibleText,
      ctaLabelNotUsable: !altResult.hasUsableVisibleText,
      homepageCtaNotReusableAsText: looksPurchaseLike && !altResult.hasUsableVisibleText,
    });
  }
  row.cta.backgroundColor = styles.backgroundColor ?? null;
  row.cta.fontColor = styles.fontColor ?? null;
  row.cta.borderColor = styles.borderColor ?? null;
  // The states travel WITH the hexes. Left behind, the row would carry the
  // alternative's colours beside the original's states — a `transparent` or
  // `unavailable` describing a value that was never read that way — and the
  // variant signature downstream reads the state to decide what the hex means.
  row.cta.backgroundColorState = styles.backgroundColorState ?? null;
  row.cta.fontColorState = styles.fontColorState ?? null;
  row.cta.borderColorState = styles.borderColorState ?? null;
  row.cta.borderWidth = styles.borderWidth ?? null;
  row.cta.borderRadius = Number.isFinite(styles.borderRadiusPx) ? styles.borderRadiusPx : null;
  row.cta.padding = {
    top: styles.paddingTopPx ?? 0,
    right: styles.paddingRightPx ?? 0,
    bottom: styles.paddingBottomPx ?? 0,
    left: styles.paddingLeftPx ?? 0,
  };
  row.cta.fontFamily = styles.fontFamily ?? null;
  row.cta.fontWeight = styles.fontWeight ?? null;
  row.cta.fontSize = styles.fontSize ?? null;
  row.cta.fontSizePx = styles.fontSizePx ?? null;
  row.cta.lineHeight = styles.lineHeight ?? null;
  row.cta.lineHeightPx = styles.lineHeightPx ?? null;
  row.cta.letterSpacing = styles.letterSpacing ?? null;
  row.cta.letterSpacingPx = styles.letterSpacingPx ?? null;
  row.cta.fontStyle = styles.fontStyle ?? null;
  row.cta.textTransform = styles.textTransform ?? null;

  // The alt CTA's "visible while card is hovered" state is what users see, so
  // it stands in as the alt's DEFAULT. It is not its hover state. Writing the
  // one sample under both keys manufactures `hover == default` for every
  // swapped row — measured on a real storefront run: 12 of 12 rows carrying a
  // hover key, all with signature ('#e31837','#ffffff'), while the site's
  // actual cart-button hover (#f97988) appears nowhere in that artifact.
  // Use the alt's own `:hover` declarations instead, and when it has none,
  // report no hover rather than inventing one. The original CTA's own hover
  // record is cleared with it: it was read off a different element and the
  // row no longer describes that element.
  const altHover = altResult.hover;
  const hasAltHover = hasSupportedCtaHoverChange(altResult.styles, altHover);
  row.cta.hover = hasAltHover ? altHover : null;
  row.cta.hoverBackgroundColor = hasAltHover ? altHover.backgroundColor : null;
  row.cta.hoverFontColor = hasAltHover ? altHover.fontColor ?? null : null;
  row.cta.hoverBorderColor = hasAltHover ? altHover.borderColor ?? null : null;
  for (const key of ["backgroundColor", "fontColor", "borderColor"]) {
    const stateKey = `hover${key[0].toUpperCase()}${key.slice(1)}State`;
    if (hasAltHover && altHover[`${key}State`]) row.cta[stateKey] = altHover[`${key}State`];
    else delete row.cta[stateKey];
  }
  row.cta.hoverBorderWidth = hasAltHover ? altHover.borderWidth ?? null : null;
  row.cta.hoverCaptureMode = hasAltHover ? "cssom-fallback" : undefined;

  // Replace the whole layout: dimensions, ratios and intent must describe one node.
  row.cta.layout = {
    ...(altResult.layout || {}),
    computedWidthPx: altResult.boundingBox?.width ?? null,
    computedHeightPx: altResult.boundingBox?.height ?? null,
  };

  // The original selector is misleading once swapped — the alt is a different
  // DOM element. Null it out so downstream consumers don't re-query a stale
  // shape; they should rely on the captured colours / typography instead.
  row.cta.selector = null;
  row.cta.resolvedFrom = "card-hover-alternative";

  // Provenance.
  row.cta.source = "card-hover-alternative";
  row.cta.alternativeRejectedReason = null;
  // The alt's styles were read while the pointer sat on the ORIGINAL CTA, so
  // the card — and therefore the alt — was in `:hover` the whole time. That
  // reading is stored in the DEFAULT slot by design (it is what a user looking
  // at the card sees), and saying so here is the only way downstream can tell
  // this default from one measured at rest.
  row.cta.stylesReadUnderHover = true;
  const gateSignals = gate.reasons.map((r) => r.signal).join(", ");
  const altReasons = (altResult.reasons || []).map((r) => `${r.source}(+${r.delta})`).join(", ");
  row.cta.alternativeReason =
    `Original CTA suppressed on hover (${gateSignals}); ` +
    `card-hover revealed alt scoring ${altResult.score} ` +
    `(${altReasons || "no-detail"}).`;
  row.cta.originalCandidate = originalSnapshot;
}

// `maxRows` bumped from 3 → 12 (2026-05-12). On lazy-grid-recovered
// sites matchIndex can land on a wrapper element where direct hover
// silently fails; sampling more rows gives at least one CTA whose direct
// hover succeeds. The per-row cost is bounded by Playwright's fast bail on
// visible/scroll failures (hoverTimeoutMs=1500) and remains well within the
// homepage-pass envelope.
async function captureProductCardCtaHoverStates(
  page,
  rows,
  selectedRow,
  { maxRows = 12, hoverTimeoutMs = 1500, transitionSettleMs = HOVER_TRANSITION_SETTLE_MS, overlay = null } = {},
) {
  if (!Array.isArray(rows) || rows.length === 0 || !page) {
    return;
  }
  // The same overlay controller the button probe uses (lib/overlay-dismissal.js):
  // asked once, before the first CTA hover, to clear whatever covers it. The
  // card-fallback hover below stays as it is.
  let overlayCheckedBeforeFirstHover = false;
  const targets = [];
  const seen = new Set();
  const enqueue = (row) => {
    if (!row || !row.cta || !row.selector) return;
    const key = `${row.selector}::${row.matchIndex}`;
    if (seen.has(key)) return;
    seen.add(key);
    targets.push(row);
  };
  enqueue(selectedRow);
  for (const row of rows) {
    if (targets.length >= maxRows) break;
    enqueue(row);
  }
  // Hover the CTA target; if the direct hover fails (commonly: a parent
  // element intercepts pointer events — e.g. the cart button is nested inside
  // an outer product-card link that wraps the whole card), fall back
  // to hovering the card itself at a safe top-left position. The CTA is a
  // descendant, so card-hover still triggers the `:hover` cascade for any
  // rules of the form `.card:hover .cta { ... }`. Returns:
  //   "direct"        — CTA was hovered directly; button-level :hover applies
  //   "card-fallback" — only the card was hovered; button-level :hover may not
  //                     apply but card-level cascade does
  //   "failed"        — neither hover succeeded; skip hover capture for this row
  const tryHoverOrFallbackToCard = async (target, cardLocator) => {
    try {
      await target.hover({ timeout: hoverTimeoutMs, trial: false });
      return "direct";
    } catch {
      try {
        await page.mouse.move(0, 0);
        await cardLocator.hover({ timeout: hoverTimeoutMs, position: { x: 8, y: 8 } });
        return "card-fallback";
      } catch {
        return "failed";
      }
    }
  };
  // Wait for either a transitionend on the target OR `transitionSettleMs` ms,
  // whichever comes first. Used after every hover to let CSS transitions settle.
  const settleAfterHover = (target) =>
    target.evaluate((el, settle) => new Promise((resolve) => {
      let done = false;
      const finish = () => {
        if (done) return;
        done = true;
        try { el.removeEventListener("transitionend", finish); } catch {}
        resolve();
      };
      try { el.addEventListener("transitionend", finish, { once: true }); } catch {}
      setTimeout(finish, settle);
    }), transitionSettleMs).catch(() => {});
  // A hover can change any supported paint channel independently. Unchanged
  // fill does not erase a text/border change, including CSS variables or JS.
  // Walk CSSOM via the injected probe helper to extract :hover declarations
  // for an element when the mouse-driven hover came back useless. Resolves to
  // a readHoverStyleFor-shaped record or null.
  const readCssomHoverFor = (target) =>
    target.evaluate((node) => {
      const helpers = window.__brandkitProbeHelpers || {};
      if (typeof helpers.readHoverStyleFromCssRules === "function") {
        return helpers.readHoverStyleFromCssRules(node);
      }
      return null;
    }).catch(() => null);
  // Read hover styles from a bound ElementHandle, with a CSSOM-walk fallback
  // when the mouse-driven hover never reached the element. Returns
  // { hover, hoverViaCssom, renderingOnly }; `hover` is null only if both
  // reads failed. `renderingOnly` marks a record kept solely because it says
  // the element stopped rendering (see below); its colours reproduced the
  // default and must not outlive the suppression gate's reading of it.
  const captureHoverFromHandle = async (element, defaultRecord) => {
    let renderingOnly = false;
    let hover = await element.evaluate((node) => {
      const helpers = window.__brandkitProbeHelpers || {};
      if (typeof helpers.readHoverStyleFor === "function") {
        return helpers.readHoverStyleFor(node);
      }
      const style = window.getComputedStyle(node);
      return {
        backgroundColor: null,
        fontColor: null,
        borderColor: null,
        borderWidth: Number.parseFloat(style.borderWidth) || 0,
      };
    }).catch(() => null);
    let hoverViaCssom = false;
    if (!hasSupportedCtaHoverChange(defaultRecord, hover)) {
      const cssomHover = await readCssomHoverFor(element);
      // A confident CSSOM declaration is authored hover evidence even when
      // it deliberately repeats the default paint. A mouse-only no-change
      // sample has no such witness and still falls through to suppression.
      if (cssomHover?.backgroundColor || hasSupportedCtaHoverChange(defaultRecord, cssomHover)) {
        hover = cssomHover;
        hoverViaCssom = true;
      } else if (hover && hover.backgroundColor && hover.backgroundColor === defaultRecord?.backgroundColor) {
        // Both reads agree there is no hover COLOUR: the mouse-driven read
        // reproduced the DEFAULT colour, and the CSSOM walk found no `:hover`
        // declaration touching a colour field. Keeping the mouse read here
        // stores the default state under the `hover` key, which is a hover
        // effect the site does not have — and nothing downstream can tell
        // that fabrication from a measured hover. Report no hover instead.
        //
        // Unless the same read says the element STOPPED RENDERING. A colour
        // that reproduced the default says nothing about whether the element
        // is still drawn, and the mouse read carries that too: display,
        // visibility, opacity and the box. A placeholder that hides itself
        // under card hover without touching a colour — `display: none`,
        // `visibility: hidden`, `opacity: 0` — is exactly a hover state, and
        // the disappearance is the only evidence `isCtaSuppressedOnHover` acts
        // on. Nulling the record here kept every such placeholder from ever
        // reaching the gate. The gate itself is asked, so "stopped rendering"
        // has one definition; the record then lives exactly as long as the
        // gate needs it — `captureHoverForBoundHandle` drops it again when no
        // alternative is adopted, for the reason in the paragraph above.
        if (isCtaSuppressedOnHover(defaultRecord, hover).suppressed) {
          renderingOnly = true;
        } else {
          hover = null;
        }
      }
    }
    return { hover, hoverViaCssom, renderingOnly };
  };
  // Capture hover-state styles for a single row using a bound ElementHandle.
  // Locking the handle up-front (rather than re-resolving via a Locator on
  // each step) prevents the captured hover-state from drifting onto a
  // sibling DOM node when the card mutates between default and hover passes
  // — common pattern: the title link sits next to the cart button, and a
  // re-evaluated `cardLocator.locator(cta-selector).first()` could pick a
  // different node if the DOM changes mid-pass.
  //
  // The caller is responsible for disposing `element`.
  const captureHoverForBoundHandle = async (row, cardLocator, element) => {
    if (!(await element.isVisible().catch(() => false))) return;
    await element.scrollIntoViewIfNeeded({ timeout: hoverTimeoutMs }).catch(() => {});
    if (overlay && !overlayCheckedBeforeFirstHover) {
      overlayCheckedBeforeFirstHover = true;
      await overlay.clearFor(element);
    }
    const hoverMode = await tryHoverOrFallbackToCard(element, cardLocator);
    if (hoverMode === "failed") return;
    await settleAfterHover(element);
    const { hover, hoverViaCssom, renderingOnly } = await captureHoverFromHandle(element, row.cta);
    const hoverBeforeRead = row.cta.hover;
    if (hover && typeof hover === "object") {
      row.cta.hover = hover;
      // A rendering-only record is provisional (see below), so it carries no
      // capture mode: the row either ends up swapped, with the mode recorded
      // on `originalCandidate`, or ends up reporting no hover at all.
      if (hoverViaCssom) row.cta.hoverCaptureMode = "cssom-fallback";
      else if (hoverMode === "card-fallback" && !renderingOnly) row.cta.hoverCaptureMode = "card-fallback";
    }
    // Run alt-CTA discovery while cursor is still on the original CTA — the
    // card is implicitly in :hover state, so any hover-revealed alt elements
    // are visible at evaluate-time.
    await _maybeSwapToHoverRevealedAltCta(row, cardLocator, element);
    if (renderingOnly && row.cta.source !== "card-hover-alternative") {
      // The record was kept only so the gate could read the disappearance.
      // Nothing was adopted in its place, so what is left of it is the
      // default colour under the `hover` key — the fabrication
      // `captureHoverFromHandle` refuses. The row goes back to reporting no
      // hover, exactly as it did before the gate was consulted; a swapped row
      // keeps the reading, on `originalCandidate.hover`, as the evidence the
      // swap rests on.
      row.cta.hover = hoverBeforeRead;
    }
  };
  for (const row of targets.slice(0, maxRows)) {
    try {
      const cardLocator = page.locator(row.selector).nth(row.matchIndex);
      const hasSelectorCta = Boolean(row.cta?.selector);
      // Resolve the CTA element ONCE up-front to an ElementHandle, locking
      // the captured DOM node identity for the entire hover sequence. We try
      // the configured selector first; on miss we fall back to the same
      // heuristic that produced the default-state CTA. Without this binding,
      // Playwright's lazy locator would re-resolve `.first()` on every call,
      // and any DOM mutation between scroll/hover/read could swap the
      // captured node onto a sibling.
      let element = null;
      if (hasSelectorCta) {
        const ctaLocator = cardLocator.locator(row.cta.selector).first();
        if ((await ctaLocator.count().catch(() => 0)) > 0) {
          element = await ctaLocator.elementHandle().catch(() => null);
        } else if (
          await cardLocator
            .evaluate((el, sel) => el.matches(sel), row.cta.selector)
            .catch(() => false)
        ) {
          element = await cardLocator.elementHandle().catch(() => null);
        }
        // Stale-cardLocator guard: when the row had an explicit CTA selector
        // at collection time but it can't be resolved now (and the card
        // itself doesn't match it), the cardLocator points at a different
        // DOM element than collection time — typically because matchIndex
        // is unstable on broad selectors like `[class*='product']` that
        // match many sibling elements (one observed run had 154+ matches,
        // including title-link wrappers that happened to fall at the same
        // matchIndex after late lazy-loaded cards shifted the ordering).
        // Falling through to the heuristic branch in this case lets it
        // score-pick whatever interactive element is inside the wrong card
        // — usually the title `<a>` — and the captured hover styles drift
        // onto that unrelated element. Skip hover for this row instead;
        // the default-state
        // CTA (already captured during collection) is the safer answer.
        if (!element) continue;
        // `cta.selector` names the node the selector MATCHED, not the node
        // whose default-state styles were recorded. Collection resolves the
        // match to an interactive element inside it and reports the two
        // separately: the matched selector in `cta.selector`, the resolution
        // in `cta.resolvedFrom`. Re-resolving the selector here therefore
        // binds the CONTAINER, and every hover reading below describes an
        // element whose styles were never reported. Measured on a real
        // storefront run: default `#e31837` at 40x40 (the cart button), hover
        // read transparent at 231x40 (its wrapper) — the wrapper has no
        // background, so the null read then trips the suppression gate and
        // the button's own `:hover` is never sampled at all.
        //
        // Honour the recorded resolution and descend the same way, so the
        // hover sample and the default sample describe one element.
        //
        // The `resolvedFrom` test confines this to rows that recorded a
        // descent, and it is load-bearing: it is what forbids this pass from
        // OVERRULING a resolution collection already made — the same
        // element-drift defect, in the other direction. The two are decided
        // by DIFFERENT scorers carrying DIFFERENT non-purchase vocabularies
        // (`heart|share|quick|view|details` in collection's
        // `NON_PURCHASE_CTA_PATTERN`, `bookmark|comparison|улюблен` in the
        // probe helper's `HEURISTIC_NON_PURCHASE_CTA_PATTERN`), so any class
        // word in the symmetric difference is penalised by exactly one of
        // them and the two disagree. Pinned by
        // `collection-resolved-self-under-a-split-vocabulary-class` in
        // lib/product-card-cta-hover-shapes.test.js: drop this test and that
        // card's anchor loses to its own transparent child, whose null
        // background then reads as suppression and destroys the row.
        if (String(row.cta.resolvedFrom || "").endsWith("interactive-descendant")) {
          const descendedHandle = await element
            .evaluateHandle((node, ctaTextHint) => {
              const helpers = window.__brandkitProbeHelpers || {};
              const findHeuristicCta = helpers.findHeuristicCtaWithinCard;
              return typeof findHeuristicCta === "function"
                ? findHeuristicCta(node, ctaTextHint || "") || node
                : node;
            }, row.cta?.text || "")
            .catch(() => null);
          const descendedElement = descendedHandle ? descendedHandle.asElement() : null;
          if (descendedElement) {
            await element.dispose().catch(() => {});
            element = descendedElement;
          } else if (descendedHandle) {
            await descendedHandle.dispose().catch(() => {});
          }
        }
      } else {
        // Heuristic branch: row was originally heuristic-discovered (no
        // selector). Re-run findHeuristicCtaWithinCard with the captured
        // text hint and bind the result to a JSHandle. This is the only
        // legitimate use of the heuristic finder during hover capture —
        // selector-equipped rows take the early-return path above.
        const handle = await cardLocator
          .evaluateHandle(
            (card, ctaTextHint) => {
              const helpers = window.__brandkitProbeHelpers || {};
              const findHeuristicCta = helpers.findHeuristicCtaWithinCard;
              if (typeof findHeuristicCta !== "function") return null;
              return findHeuristicCta(card, ctaTextHint || "");
            },
            row.cta?.text || "",
          )
          .catch(() => null);
        if (!handle) continue;
        element = handle.asElement();
        if (!element) {
          await handle.dispose().catch(() => {});
          continue;
        }
      }
      try {
        await captureHoverForBoundHandle(row, cardLocator, element);
      } finally {
        await element.dispose().catch(() => {});
      }
    } catch {
      // Best-effort; leave row.cta.hover unset on failure.
    }
  }
  // Initialize provenance fields on EVERY row so downstream consumers see a
  // consistent shape — even rows beyond maxRows or rows whose hover capture
  // failed get source: "default" with null originalCandidate / alternativeReason.
  for (const row of rows) {
    if (row?.cta && typeof row.cta === "object") {
      _initCtaProvenance(row);
    }
  }
  try {
    await page.mouse.move(0, 0);
  } catch {
    // Ignore mouse-reset errors.
  }
}

export async function collectProductCardStyles(
  page,
  args,
  {
    capturePayload = null,
    capturePath = "",
    overlay = null,
  } = {},
) {
  function isFallbackRepresentativeRow(row) {
    const signals = row?.selectionSignals;
    if (signals?.supportingBoundaryEvidence) return false;
    return Boolean(
      signals?.hasCurrentPrice &&
        !signals?.looksWrapperLike &&
        !signals?.priceLooksMergedLike &&
        (signals?.hasCta || signals?.hasProductUrl),
    );
  }

  function isPurchaseRepresentativeRow(row) {
    const signals = row?.selectionSignals;
    if (signals?.supportingBoundaryEvidence) return false;
    return Boolean(
      signals?.hasCurrentPrice &&
        !signals?.looksWrapperLike &&
        !signals?.priceLooksMergedLike &&
          signals?.hasCta &&
        (
          signals?.ctaLooksPurchaseLike ||
          signals?.homepageCtaNotReusableAsText ||
          (signals?.ctaHasUsableVisibleText && !signals?.ctaLooksNonPurchaseLike)
        ),
    );
  }

  function isPurchaseCandidateRow(row) {
    const signals = row?.selectionSignals;
    if (signals?.supportingBoundaryEvidence) return false;
    return Boolean(
          signals?.hasCurrentPrice &&
        signals?.hasCta &&
        (
          signals?.ctaLooksPurchaseLike ||
          signals?.homepageCtaNotReusableAsText ||
          (signals?.ctaHasUsableVisibleText && !signals?.ctaLooksNonPurchaseLike)
        ),
    );
  }

  function isHomepageCtaNotReusableCandidateRow(row) {
    const signals = row?.selectionSignals;
    if (signals?.supportingBoundaryEvidence) return false;
    return Boolean(
      isPurchaseCandidateRow(row) &&
        signals?.hasProductUrl &&
        signals?.homepageCtaNotReusableAsText,
    );
  }

  function needsRecovery(rows) {
    return !Array.isArray(rows) || !rows.length || !rows.some(isPurchaseRepresentativeRow);
  }

  function addFailureSignal(summary, signal) {
    if (!signal || summary.failureSignals.includes(signal)) {
      return;
    }
    summary.failureSignals.push(signal);
  }

  function summarizeAttempt(phase, rows, extras = {}) {
    const rowList = Array.isArray(rows) ? rows : [];
    return {
      phase,
      rowCount: rowList.length,
      representativeRowCount: rowList.filter(isFallbackRepresentativeRow).length,
      purchaseRepresentativeRowCount: rowList.filter(isPurchaseRepresentativeRow).length,
      purchaseCandidateRowCount: rowList.filter(isPurchaseCandidateRow).length,
      homepageCtaNotReusableCandidateRowCount: rowList.filter(isHomepageCtaNotReusableCandidateRow).length,
      bestRepresentativeScore: rowList[0]?.selectionSignals?.representativeScore || 0,
      cardsLikelyLazyLoaded: Boolean(extras.cardsLikelyLazyLoaded),
      recoveryAttempted: phase !== "initial",
      recoverySource: phase,
      noVisibleRows: rowList.length === 0,
      selectorsMatchedButSurfaceInvisible: Boolean(extras.selectorsMatchedButSurfaceInvisible),
      ...extras,
    };
  }

  function attemptQualityScore(attempt) {
    if (!attempt || typeof attempt !== "object") {
      return Number.NEGATIVE_INFINITY;
    }
    const purchaseRepresentativeCount = Number(attempt.purchaseRepresentativeRowCount || 0);
    const representativeCount = Number(attempt.representativeRowCount || 0);
    const purchaseCandidateCount = Number(attempt.purchaseCandidateRowCount || 0);
    const homepageCtaNotReusableCandidateCount = Number(attempt.homepageCtaNotReusableCandidateRowCount || 0);
    const rowCount = Number(attempt.rowCount || 0);
    const bestRepresentativeScore = Number(attempt.bestRepresentativeScore || 0);
    return (
      (purchaseRepresentativeCount > 0 ? 100000 : 0) +
      Math.min(purchaseRepresentativeCount, 5) * 5000 +
      (representativeCount > 0 ? 50000 : 0) +
      Math.min(representativeCount, 5) * 1000 +
      (purchaseCandidateCount > 0 ? 20000 : 0) +
      Math.min(purchaseCandidateCount, 20) * 200 +
      (homepageCtaNotReusableCandidateCount > 0 ? 5000 : 0) +
      Math.min(homepageCtaNotReusableCandidateCount, 20) * 50 +
      (rowCount > 0 ? 1000 : 0) +
      Math.min(rowCount, 50) * 10 +
      bestRepresentativeScore -
      (attempt.noVisibleRows ? 5000 : 0) -
      (attempt.selectorsMatchedButSurfaceInvisible ? 1000 : 0)
    );
  }

  function shouldAttemptEndpointAssistedRetry(rows) {
    return Boolean(
      needsRecovery(rows) &&
        (
          !Array.isArray(rows) ||
          !rows.length ||
          !rows.some(isPurchaseCandidateRow)
        ),
    );
  }

  const normalizedArgs = {
    ...args,
    selectors: normalizeSelectorList(args?.selectors),
    priceSelectors: normalizeSelectorList(args?.priceSelectors),
    oldPriceSelectors: normalizeSelectorList(args?.oldPriceSelectors),
    ctaSelectors: normalizeSelectorList(args?.ctaSelectors),
  };

  async function deriveDomMinedProductCardSelectors() {
    const startedAt = Date.now();
    try {
      const mined = await page.evaluate(() => {
        const MAX_PRICE_NODES = 80;
        const MAX_SELECTORS = 6;
        const MAX_ANCESTOR_DEPTH = 5;
        // Non-global: this .test()s one element at a time, and a global regex
        // would carry lastIndex between calls and miss every second element.
        const PRICE_TEXT_PATTERN = new RegExp(window.__brandkitProbeHelpers.priceTextPatternSource, "iu");
        const INTERACTIVE_SELECTOR =
          "button, a[href], [role='button'], input[type='button'], input[type='submit'], input[type='reset']";
        const PURCHASE_PATTERN =
          /(?:^|[^\p{L}\p{N}])(?:купити|купить|купуй|придбати|до\s+кошика|в\s+корзину|add[\s_-]*to[\s_-]*(?:cart|basket|bag)|buy(?:[\s_-]*now)?|checkout|order[\s_-]*now|shop[\s_-]*now)(?=$|[^\p{L}\p{N}])/iu;

        const normalize = (text) => String(text || "").replace(/\s+/g, " ").trim();
        const isVisible = (element) => {
          if (!(element instanceof Element)) return false;
          const style = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            Number.parseFloat(style.opacity || "1") > 0.01 &&
            rect.width >= 20 &&
            rect.height >= 12
          );
        };
        const hasPriceText = (element) => PRICE_TEXT_PATTERN.test(normalize(element.innerText || element.textContent || ""));
        const escapeAttr = (value) => String(value || "").replace(/\\/g, "\\\\").replace(/"/g, '\\"');
        const classSelector = (className) => {
          if (window.CSS && typeof window.CSS.escape === "function") {
            return `.${window.CSS.escape(className)}`;
          }
          return `[class~="${escapeAttr(className)}"]`;
        };
        const classTokenScore = (className) => {
          const token = String(className || "");
          if (!token || token.length < 3 || token.length > 48) return Number.NEGATIVE_INFINITY;
          let score = 0;
          if (/product|goods|catalog|sku|offer|listing|merch/i.test(token)) score += 8;
          if (/card|tile|item/i.test(token)) score += 5;
          if (/wrapper|container|row|grid|slider|swiper|carousel|banner|promo|header|footer|menu|nav|filter|search|price|cost|amount|button|btn|wishlist|favorite|heart|compare/i.test(token)) {
            score -= 8;
          }
          if (/^[a-z][a-z0-9_-]{2,}$/i.test(token)) score += 1;
          return score;
        };
        const productLinkScore = (candidate) => {
          const links = [...candidate.querySelectorAll("a[href]")].filter(isVisible);
          let score = 0;
          for (const link of links.slice(0, 8)) {
            let parsed;
            try {
              parsed = new URL(link.href, window.location.href);
            } catch {
              continue;
            }
            if (!["http:", "https:"].includes(parsed.protocol)) continue;
            if (parsed.origin !== window.location.origin) continue;
            const text = normalize(link.innerText || link.textContent || "");
            const meta = [text, link.getAttribute("class") || "", link.getAttribute("title") || "", parsed.pathname].join(" ");
            let linkScore = 2;
            if (parsed.pathname && parsed.pathname !== "/") linkScore += 2;
            if (/product|goods|item|sku|catalog|товар|tovar/i.test(meta)) linkScore += 3;
            if (text.length >= 8) linkScore += 2;
            if (link.querySelector("img, picture, svg")) linkScore += 2;
            score = Math.max(score, linkScore);
          }
          return score;
        };
        const purchaseCtaScore = (candidate) => {
          const controls = [...candidate.querySelectorAll(INTERACTIVE_SELECTOR)].filter(isVisible);
          let score = 0;
          for (const control of controls.slice(0, 10)) {
            const text = normalize(control.innerText || control.textContent || "");
            const meta = [
              text,
              control.getAttribute("aria-label") || "",
              control.getAttribute("title") || "",
              control.getAttribute("class") || "",
              control.getAttribute("id") || "",
            ].join(" ");
            if (PURCHASE_PATTERN.test(meta)) score = Math.max(score, text ? 8 : 4);
          }
          return score;
        };
        const visibleSimilarCount = (selector, width) => {
          let elements = [];
          try {
            elements = [...document.querySelectorAll(selector)].filter(isVisible);
          } catch {
            return 0;
          }
          if (!elements.length) return 0;
          return elements.filter((element) => {
            const rect = element.getBoundingClientRect();
            if (rect.width <= 0) return false;
            if (!width || width <= 0) return true;
            return Math.abs(rect.width - width) / Math.max(rect.width, width) <= 0.12;
          }).length;
        };
        const bestSelectorFor = (candidate) => {
          const rect = candidate.getBoundingClientRect();
          return [...candidate.classList]
            .map((className) => {
              const selector = classSelector(className);
              const visibleCount = visibleSimilarCount(selector, rect.width);
              return {
                selector,
                className,
                visibleCount,
                score: classTokenScore(className) + Math.min(visibleCount, 8),
              };
            })
            .filter((entry) => entry.visibleCount >= 2 && Number.isFinite(entry.score) && entry.score > 0)
            .sort((left, right) => right.score - left.score)[0] || null;
        };

        const priceNodes = [...document.querySelectorAll("s, del, ins, strong, b, small, span, p, div, a, [class], [itemprop]")]
          .filter((element) => isVisible(element) && hasPriceText(element))
          .slice(0, MAX_PRICE_NODES);
        const candidates = [];
        const seen = new Set();
        for (const priceNode of priceNodes) {
          let candidate = priceNode;
          for (let depth = 0; candidate instanceof Element && depth <= MAX_ANCESTOR_DEPTH; depth += 1) {
            if (seen.has(candidate)) {
              candidate = candidate.parentElement;
              continue;
            }
            seen.add(candidate);
            if (!isVisible(candidate)) {
              candidate = candidate.parentElement;
              continue;
            }
            const rect = candidate.getBoundingClientRect();
            const text = normalize(candidate.innerText || candidate.textContent || "");
            const wordCount = text ? text.split(/\s+/).length : 0;
            const selectorInfo = bestSelectorFor(candidate);
            if (!selectorInfo) {
              candidate = candidate.parentElement;
              continue;
            }
            const productScore = productLinkScore(candidate);
            const ctaScore = purchaseCtaScore(candidate);
            const hasImage = Boolean(candidate.querySelector("img, picture, video, source"));
            const interactiveCount = [...candidate.querySelectorAll(INTERACTIVE_SELECTOR)].filter(isVisible).length;
            let score = 8 + selectorInfo.score + productScore + ctaScore;
            if (hasImage) score += 4;
            if (rect.width >= 100 && rect.width <= Math.max(520, window.innerWidth * 0.45)) score += 3;
            if (rect.height >= 90 && rect.height <= 760) score += 3;
            if (selectorInfo.visibleCount >= 3) score += 4;
            if (!productScore) score -= 6;
            if (wordCount > 70) score -= 8;
            if (interactiveCount > 8) score -= 6;
            if (rect.width >= window.innerWidth * 0.75 && rect.height >= 260) score -= 10;
            candidates.push({
              selector: selectorInfo.selector,
              visibleCount: selectorInfo.visibleCount,
              score,
              evidence: {
                hasPrice: true,
                hasProductLink: productScore > 0,
                hasImage,
                hasPurchaseCta: ctaScore > 0,
                widthPx: Math.round(rect.width),
                heightPx: Math.round(rect.height),
              },
            });
            candidate = candidate.parentElement;
          }
        }
        const bySelector = new Map();
        for (const candidate of candidates) {
          const previous = bySelector.get(candidate.selector);
          if (!previous || candidate.score > previous.score) {
            bySelector.set(candidate.selector, candidate);
          }
        }
        const ranked = [...bySelector.values()]
          .filter((candidate) => candidate.score >= 18)
          .sort((left, right) => right.score - left.score)
          .slice(0, MAX_SELECTORS);
        return {
          domProductEvidenceDetected: priceNodes.length > 0,
          priceNodeCount: priceNodes.length,
          selectorCandidates: ranked,
          selectors: ranked.map((candidate) => candidate.selector),
        };
      });
      return {
        domProductEvidenceDetected: Boolean(mined?.domProductEvidenceDetected),
        priceNodeCount: Number.isInteger(mined?.priceNodeCount) ? mined.priceNodeCount : 0,
        selectors: Array.isArray(mined?.selectors) ? mined.selectors.filter(Boolean).slice(0, 6) : [],
        selectorCandidates: Array.isArray(mined?.selectorCandidates) ? mined.selectorCandidates.slice(0, 6) : [],
        durationMs: Date.now() - startedAt,
        error: null,
      };
    } catch (error) {
      return {
        domProductEvidenceDetected: false,
        priceNodeCount: 0,
        selectors: [],
        selectorCandidates: [],
        durationMs: Date.now() - startedAt,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  }

  async function collectRows(recoveryContext, overrideSelectors = null) {
    const overrideSelectorList = normalizeSelectorList(overrideSelectors);
    const activeSelectors = overrideSelectorList.length
      ? overrideSelectorList
      : normalizedArgs.selectors;
    return page.evaluate(
      ({ selectors, priceSelectors, oldPriceSelectors, ctaSelectors, recoveryContext: activeRecoveryContext }) => {
        const probeHelpers = window.__brandkitProbeHelpers || {};
        const normalizeSelectorList =
          probeHelpers.normalizeSelectorList ||
          ((value) => {
            const rawSelectors = Array.isArray(value)
              ? value
              : (typeof value === "string" ? [value] : []);
            return rawSelectors
              .filter((selector) => typeof selector === "string")
              .map((selector) => selector.trim())
              .filter(Boolean);
          });
        const toSelectorArray = (value) => {
          const list = normalizeSelectorList(value);
          if (Array.isArray(list)) return list;
          try {
            return Array.from(list || []);
          } catch {
            return [];
          }
        };
        const cardSelectors = toSelectorArray(selectors);
        const activePriceSelectors = toSelectorArray(priceSelectors);
        const activeOldPriceSelectors = toSelectorArray(oldPriceSelectors);
        const activeCtaSelectors = toSelectorArray(ctaSelectors);
        const normalize =
          probeHelpers.normalizeWhitespace || ((text) => String(text || "").replace(/\s+/g, " ").trim());
        const recoverVisibleLabel =
          probeHelpers.recoverVisibleLabel ||
          ((element) => ({
            text: normalize(element?.innerText || element?.textContent || ""),
            source: "inner-text",
            hasUsableVisibleText: true,
            recoveredFromDescendant: false,
            fragmentCount: 0,
            extentPx: null,
          }));
        const INTERACTIVE_SELECTOR =
          "button, a[href], [role='button'], input[type='button'], input[type='submit'], input[type='reset']";
        const NON_PURCHASE_CTA_PATTERN =
          /(wishlist|favorite|favourite|heart|compare|share|quick|view|details|детал|порівн|сравн|избран|обран|favorite|перегляд)/i;
        // Whole-label promotion badges are not actions. This stays separate
        // from NON_PURCHASE_CTA_PATTERN because sale words in a real
        // purchase-verb label (for example "Buy now -20%") must not suppress
        // the CTA. Keep the anchored shapes in lockstep with
        // lib/product-card-cta-label.js, which is the normalize boundary.
        const PURCHASE_VERB_LABEL_PATTERN =
          /(?:^|[^\p{L}\p{N}])(?:buy|add(?: +to)? +(?:cart|basket|bag)|cart|order|shop|checkout|purchase|get|купити|купить|купуй|придбати|до +кошика|у +кошик|в +кошик|в +корзину|замовити|замовляти|заказать|оплатить|оформить|приобрести|положить)(?=$|[^\p{L}\p{N}])/iu;
        const DISCOUNT_LABEL_WHITESPACE =
          /[\u0009-\u000D\u0020\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+/gu;
        // Pinned Unicode 16.0 Decimal_Number (Nd) ranges. Runtime Unicode
        // property tables differ between supported Node/Python versions, so
        // the browser probe uses the same explicit contract as both twins.
        const DECIMAL_NUMBER_RANGES = [
          [0x0030, 0x0039], [0x0660, 0x0669], [0x06f0, 0x06f9], [0x07c0, 0x07c9],
          [0x0966, 0x096f], [0x09e6, 0x09ef], [0x0a66, 0x0a6f], [0x0ae6, 0x0aef],
          [0x0b66, 0x0b6f], [0x0be6, 0x0bef], [0x0c66, 0x0c6f], [0x0ce6, 0x0cef],
          [0x0d66, 0x0d6f], [0x0de6, 0x0def], [0x0e50, 0x0e59], [0x0ed0, 0x0ed9],
          [0x0f20, 0x0f29], [0x1040, 0x1049], [0x1090, 0x1099], [0x17e0, 0x17e9],
          [0x1810, 0x1819], [0x1946, 0x194f], [0x19d0, 0x19d9], [0x1a80, 0x1a89],
          [0x1a90, 0x1a99], [0x1b50, 0x1b59], [0x1bb0, 0x1bb9], [0x1c40, 0x1c49],
          [0x1c50, 0x1c59], [0xa620, 0xa629], [0xa8d0, 0xa8d9], [0xa900, 0xa909],
          [0xa9d0, 0xa9d9], [0xa9f0, 0xa9f9], [0xaa50, 0xaa59], [0xabf0, 0xabf9],
          [0xff10, 0xff19], [0x104a0, 0x104a9], [0x10d30, 0x10d39], [0x10d40, 0x10d49],
          [0x11066, 0x1106f], [0x110f0, 0x110f9], [0x11136, 0x1113f], [0x111d0, 0x111d9],
          [0x112f0, 0x112f9], [0x11450, 0x11459], [0x114d0, 0x114d9], [0x11650, 0x11659],
          [0x116c0, 0x116c9], [0x116d0, 0x116e3], [0x11730, 0x11739], [0x118e0, 0x118e9],
          [0x11950, 0x11959], [0x11bf0, 0x11bf9], [0x11c50, 0x11c59], [0x11d50, 0x11d59],
          [0x11da0, 0x11da9], [0x11f50, 0x11f59], [0x16130, 0x16139], [0x16a60, 0x16a69],
          [0x16ac0, 0x16ac9], [0x16b50, 0x16b59], [0x16d70, 0x16d79], [0x1ccf0, 0x1ccf9],
          [0x1d7ce, 0x1d7ff], [0x1e140, 0x1e149], [0x1e2f0, 0x1e2f9], [0x1e4f0, 0x1e4f9],
          [0x1e5f1, 0x1e5fa], [0x1e950, 0x1e959], [0x1fbf0, 0x1fbf9],
        ];
        const regexCodePointEscape = (codePoint) => `\\u{${codePoint.toString(16)}}`;
        const codePointCharacterClass = (codePoints) =>
          `[${codePoints.map(regexCodePointEscape).join("")}]`;
        const DISCOUNT_LABEL_BIDI_FORMAT_CODEPOINTS = [0x061c, 0x200e, 0x200f, 0x202a, 0x202b, 0x202c, 0x202d, 0x202e, 0x2066, 0x2067, 0x2068, 0x2069];
        const DISCOUNT_LABEL_BIDI_FORMAT_PATTERN = new RegExp(
          codePointCharacterClass(DISCOUNT_LABEL_BIDI_FORMAT_CODEPOINTS),
          "gu",
        );
        const DECIMAL_NUMBER = `[${DECIMAL_NUMBER_RANGES.map(
          ([start, end]) => `${regexCodePointEscape(start)}-${regexCodePointEscape(end)}`,
        ).join("")}]`;
        // Punctuation is pinned and used only by this whole-label grammar.
        const RATE_SIGN_CODEPOINTS = [0x0025, 0x0609, 0x060a, 0x066a, 0x2030, 0x2031, 0xfe6a, 0xff05];
        const NUMBER_SEPARATOR_CODEPOINTS = [0x002c, 0x002e, 0x060c, 0x066b, 0x066c, 0xfe50, 0xfe52, 0xff0c, 0xff0e];
        const RATE_PREFIX_SIGN_CODEPOINTS = [0x002b, 0x002d, 0x00b1, 0x2010, 0x2011, 0x2012, 0x2013, 0x2014, 0x2212, 0x2213, 0xfe58, 0xfe62, 0xfe63, 0xff0b, 0xff0d];
        const OPEN_PAREN_CODEPOINTS = [0x0028, 0xfe59, 0xff08];
        const CLOSE_PAREN_CODEPOINTS = [0x0029, 0xfe5a, 0xff09];
        const PROMOTION_SEPARATOR_CODEPOINTS = [0x002d, 0x003a, 0x2010, 0x2011, 0x2012, 0x2013, 0x2014, 0x2212, 0xfe55, 0xfe58, 0xfe63, 0xff0d, 0xff1a];
        const TERMINAL_PUNCTUATION_CODEPOINTS = [0x0021, 0x002c, 0x002e, 0x003a, 0x003b, 0x003f, 0x060c, 0x061b, 0x061f, 0x06d4, 0x3002, 0xfe50, 0xfe52, 0xfe54, 0xfe55, 0xfe56, 0xfe57, 0xff01, 0xff0c, 0xff0e, 0xff1a, 0xff1b, 0xff1f];
        const RATE_SIGN = codePointCharacterClass(RATE_SIGN_CODEPOINTS);
        const NUMBER_SEPARATOR = codePointCharacterClass(NUMBER_SEPARATOR_CODEPOINTS);
        const RATE_PREFIX_SIGN = codePointCharacterClass(RATE_PREFIX_SIGN_CODEPOINTS);
        const OPEN_PAREN = codePointCharacterClass(OPEN_PAREN_CODEPOINTS);
        const CLOSE_PAREN = codePointCharacterClass(CLOSE_PAREN_CODEPOINTS);
        const PROMOTION_SEPARATOR = codePointCharacterClass(PROMOTION_SEPARATOR_CODEPOINTS);
        const TERMINAL_PUNCTUATION = codePointCharacterClass(TERMINAL_PUNCTUATION_CODEPOINTS);
        const RATE_NUMBER = `${DECIMAL_NUMBER}+(?:(?:${NUMBER_SEPARATOR}| +)${DECIMAL_NUMBER}+)*`;
        const RATE_SUFFIX_AMOUNT = `${RATE_PREFIX_SIGN}? *${RATE_NUMBER} *${RATE_SIGN}`;
        const RATE_PREFIX_AMOUNT = `${RATE_PREFIX_SIGN}? *${RATE_SIGN} *${RATE_NUMBER}`;
        const RATE_AMOUNT = `(?:${RATE_SUFFIX_AMOUNT}|${RATE_PREFIX_AMOUNT})`;
        const RATE_VALUE = `(?:${RATE_AMOUNT}|${RATE_SIGN})`;
        const PROMOTION_QUALIFIER =
          "(?:up +to|bis +zu|jusqu['’]?à|hasta|fino +a|até|tot|до|do|až|până +la|op +til|upp +till|opptil|jopa)";
        // Shared suffix/standalone vocabulary; keep in lockstep with the
        // module and Python twins.
        const PROMOTION_TERM =
          "(?:off|sale|discount|savings?|offer|deal|clearance|promo(?:tion)?|special +offer|save|rabatt|remise|réduction|descuento|sconto|desconto|korting|rabat|sleva|zľava|reducere|зниж(?:ка|ки|ок|ення)?|скид(?:ка|ки|ок)?|акц(?:ія|ії|ій|ия|ии|ий)?|розпродаж)";
        const PROMOTION_JOINER = `(?: *${PROMOTION_SEPARATOR} *)? *`;
        const PERCENT_FIRST = `${RATE_VALUE}(?:${PROMOTION_JOINER}${PROMOTION_TERM})?`;
        const SALE_LEAD = `${PROMOTION_TERM}(?: *${PROMOTION_SEPARATOR}? *(?:${PROMOTION_QUALIFIER} +)?${RATE_VALUE}(?:${PROMOTION_JOINER}${PROMOTION_TERM})?)?`;
        const QUALIFIER_FIRST = `${PROMOTION_QUALIFIER} +${RATE_VALUE}(?:${PROMOTION_JOINER}${PROMOTION_TERM})?`;
        const PROMOTION_BODY = `(?:${PERCENT_FIRST}|${SALE_LEAD}|${QUALIFIER_FIRST})`;
        const DISCOUNT_ONLY_CTA_PATTERN = new RegExp(
          `^(?:${OPEN_PAREN} *)?${PROMOTION_BODY}(?: *${CLOSE_PAREN})? *${TERMINAL_PUNCTUATION}*$`,
          "u",
        );
        const isDiscountOnlyCtaLabel = (value) => {
          const label = String(value ?? "")
            .replace(DISCOUNT_LABEL_BIDI_FORMAT_PATTERN, "")
            .replace(DISCOUNT_LABEL_WHITESPACE, " ")
            .replace(/^ +| +$/g, "");
          if (!label || PURCHASE_VERB_LABEL_PATTERN.test(label)) return false;
          // Python re.IGNORECASE accepts extra Unicode folds such as
          // dotless-ı "dıscount"; lowercasing first keeps both twins exact.
          const grammarLabel = label.toLowerCase();
          return DISCOUNT_ONLY_CTA_PATTERN.test(grammarLabel);
        };
        const matchesPurchaseCta =
          probeHelpers.matchesPurchaseCta ||
          ((text) => /(?:^|[^\p{L}\p{N}])(?:купити|купить|купуй|придбати|до\s+кошика|в\s+корзину|оформ(?:ити|ить|лення|ление)|замов(?:ити|лення)|заказ(?:ать|у)?|add[\s_-]*to[\s_-]*(?:cart|basket|bag)|add[\s_-]*(?:cart|basket|bag)|buy(?:[\s_-]*(?:now|small|btn|button))?|cart|basket|checkout|order[\s_-]*now|shop[\s_-]*now)(?=$|[^\p{L}\p{N}])/iu.test(text || ""));
        const FULL_WIDTH_HINT_PATTERN = /(full-width|fullwidth|w-full|block|wide|add-to-cart--full)/i;
        const SALE_BADGE_PATTERN = /(?:sale|discount|deal|save|%\s*off|-[0-9]+%|зниж|скид|акц|розпрод)/i;
        const NEW_BADGE_PATTERN = /(?:^|\s)(new|новин|новинка|щойно|just in)(?:$|\s)/i;
        const BESTSELLER_BADGE_PATTERN = /(?:best\s*seller|bestseller|top seller|хіт|хит|топ)/i;
        const REVIEW_PATTERN = /(?:review|reviews|відгук|відгуки|отзыв|отзывы)/i;
        const DELIVERY_PATTERN = /(?:delivery|shipping|ship|доставка|доставим)/i;
        const INSTALLMENT_PATTERN = /(?:installment|credit|finance|частин|частями|кредит|оплат[аи]\s+част)/i;
        const WISHLIST_PATTERN = /(?:wishlist|favorite|favourite|heart|bookmark|обран|улюблен|избран)/i;
        const COMPARE_PATTERN = /(?:compare|comparison|порівн|сравн)/i;
        const numberOrNull = (value) => (Number.isFinite(value) ? value : null);
        const toHex = probeHelpers.toHex || (() => null);
        const pickBorderColor = probeHelpers.pickBorderColor || ((style) => toHex(style?.borderColor));
        // Fallbacks deliberately never claim "transparent": without the shared
        // normalisation context there is no way to tell a zero-alpha colour
        // from an unreadable one, and guessing is the bug this type exists to
        // stop. Not knowing is reported as not knowing.
        const measureColor =
          probeHelpers.measureColor ||
          ((value) => {
            const hex = toHex(value);
            return { hex, state: hex ? "measured" : "unavailable" };
          });
        const measureBorderColor =
          probeHelpers.measureBorderColor ||
          ((style) => {
            const hex = pickBorderColor(style);
            return { hex, state: hex ? "measured" : "unavailable" };
          });
        const normalizeFontWeight =
          probeHelpers.normalizeFontWeight || ((value) => Number.parseInt(value, 10) || null);
        const readTypographyStyle =
          probeHelpers.readTypographyStyle ||
          ((style) => ({
            fontFamily: style?.fontFamily || null,
            fontWeight: normalizeFontWeight(style?.fontWeight),
            fontSize: style?.fontSize || null,
            fontSizePx: Number.isFinite(Number.parseFloat(style?.fontSize))
              ? Number.parseFloat(style?.fontSize)
              : null,
            lineHeight: style?.lineHeight || null,
            lineHeightPx: Number.isFinite(Number.parseFloat(style?.lineHeight))
              ? Number.parseFloat(style?.lineHeight)
              : null,
            letterSpacing: style?.letterSpacing || null,
            letterSpacingPx: Number.isFinite(Number.parseFloat(style?.letterSpacing))
              ? Number.parseFloat(style?.letterSpacing)
              : null,
            fontStyle: style?.fontStyle || null,
            textTransform: style?.textTransform || null,
          }));
        // Shallow-copy the four numeric edges of a DOMRect we need
        // downstream. DOMRect itself doesn't JSON-serialize cleanly
        // through page.evaluate's structured clone — its enumerable
        // properties round-trip but its accessor shape is brittle, so
        // we materialise the values ourselves. Used by the price /
        // oldPrice bounding boxes that feed
        // lib/product-card-old-price-position.js.
        const rectToBoundingBox = (rect) =>
          rect
            ? {
                x: Number.isFinite(rect.x) ? rect.x : null,
                y: Number.isFinite(rect.y) ? rect.y : null,
                width: Number.isFinite(rect.width) ? rect.width : null,
                height: Number.isFinite(rect.height) ? rect.height : null,
              }
            : null;
        const isVisible =
          probeHelpers.isVisibleElement ||
          ((element) => {
            const style = window.getComputedStyle(element);
            const rect = element.getBoundingClientRect();
            return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
          });
        const scoreInteractiveCandidate = (element) => {
          if (!(element instanceof Element)) return Number.NEGATIVE_INFINITY;
          const style = window.getComputedStyle(element);
          const label = recoverVisibleLabel(element);
          const elementText = label.text;
          const elementMeta = [
            elementText,
            element.getAttribute("aria-label") || "",
            element.getAttribute("title") || "",
            element.getAttribute("class") || "",
            element.getAttribute("id") || "",
          ].join(" ");
          let score = 0;
          if (element.matches(INTERACTIVE_SELECTOR)) score += 6;
          if (toHex(style.backgroundColor)) score += 3;
          if ((Number.parseFloat(style.borderWidth) || 0) > 0) score += 1;
          if (label.hasUsableVisibleText) score += 2;
          if (matchesPurchaseCta(elementMeta)) score += 4;
          if (NON_PURCHASE_CTA_PATTERN.test(elementMeta)) score -= 8;
          return score;
        };
        const layoutEvidenceFor = probeHelpers.productCardLayoutEvidenceFor;
        const resolveInteractiveElement = (element) => {
          if (!(element instanceof Element)) {
            return { element: null, resolvedFrom: "self" };
          }
          const candidates = [
            { element, resolvedFrom: "self" },
            {
              element: element.closest(INTERACTIVE_SELECTOR),
              resolvedFrom: "closest-interactive-ancestor",
            },
            {
              element: [...element.querySelectorAll(INTERACTIVE_SELECTOR)].find(isVisible) || null,
              resolvedFrom: "interactive-descendant",
            },
          ]
            .filter((entry) => entry.element instanceof Element && isVisible(entry.element))
            .sort((left, right) => scoreInteractiveCandidate(right.element) - scoreInteractiveCandidate(left.element));
          return candidates[0] || { element, resolvedFrom: "self" };
        };
        const findHeuristicCtaWithinCard = (card) => {
          const rootLabel = recoverVisibleLabel(card);
          const rootMeta = [
            rootLabel.text,
            card.getAttribute("aria-label") || "",
            card.getAttribute("title") || "",
            card.getAttribute("class") || "",
            card.getAttribute("id") || "",
          ].join(" ");
          const heuristicSeed = matchesPurchaseCta(rootMeta) ? [card] : [];
          const candidates = [...heuristicSeed, ...card.querySelectorAll(INTERACTIVE_SELECTOR)]
            .filter(isVisible)
            .map((element) => {
              const label = recoverVisibleLabel(element);
              const meta = [
                label.text,
                element.getAttribute("aria-label") || "",
                element.getAttribute("title") || "",
                element.getAttribute("class") || "",
                element.getAttribute("id") || "",
              ].join(" ");
              return {
                element,
                score: scoreInteractiveCandidate(element) + (matchesPurchaseCta(meta) ? 4 : 0),
              };
            })
            .filter((entry) => entry.score > 0)
            .sort((left, right) => right.score - left.score);
          if (!candidates.length) {
            return { element: null, selector: "", resolvedFrom: "none" };
          }
          const resolved = resolveInteractiveElement(candidates[0].element);
          return {
            element: resolved.element,
            selector: "",
            resolvedFrom: resolved.resolvedFrom === "self" ? "heuristic-self" : `heuristic-${resolved.resolvedFrom}`,
          };
        };
        const hasProductContentOutsideCta = (candidate, ctaElement, priceElement) => {
          // Only the selected current-price node establishes product ownership;
          // arbitrary cart labels, decorations or a second price do not.
          if (!priceElement || priceElement === candidate || !candidate.contains(priceElement) ||
              ctaElement.contains(priceElement) || priceElement.contains(ctaElement)) return false;
          const priceControl = priceElement.closest(INTERACTIVE_SELECTOR);
          if (priceControl && priceControl !== candidate) return false;
          return [...candidate.querySelectorAll("img,video")].some(element => {
            if (ctaElement.contains(element) || !isVisible(element) ||
                !element.checkVisibility({opacityProperty:true, visibilityProperty:true, contentVisibilityAuto:true})) return false;
            const control = element.closest(INTERACTIVE_SELECTOR);
            return !control || control === candidate;
          });
        };
        const scoreProductLinkCandidate = (candidate, ctaElement, priceElement) => {
          if (!(candidate instanceof HTMLAnchorElement) || !isVisible(candidate)) {
            return Number.NEGATIVE_INFINITY;
          }
          let parsedUrl;
          try {
            parsedUrl = new URL(candidate.href, window.location.href);
          } catch {
            return Number.NEGATIVE_INFINITY;
          }
          if (!["http:", "https:"].includes(parsedUrl.protocol)) {
            return Number.NEGATIVE_INFINITY;
          }
          if (parsedUrl.origin !== window.location.origin) {
            return Number.NEGATIVE_INFINITY;
          }
          const linkText = normalize(candidate.innerText || candidate.textContent || "");
          let score = 6;
          if (parsedUrl.pathname && parsedUrl.pathname !== "/") score += 1;
          if (linkText) score += 2;
          if (candidate.querySelector("img, picture, video, svg")) score += 2;
          if ((candidate.getAttribute("aria-label") || "").trim()) score += 1;
          if ((candidate.getAttribute("title") || "").trim()) score += 1;
          if (
            ctaElement instanceof Element &&
            (candidate === ctaElement || ctaElement.contains(candidate) ||
              (candidate.contains(ctaElement) && !hasProductContentOutsideCta(candidate, ctaElement, priceElement)))
          ) {
            score -= 4;
          }
          return score;
        };
        const findProductUrlWithinCard = (card, ctaElement, priceElement) => {
          const candidates = [card, ...card.querySelectorAll("a[href]")]
            .filter(
              (candidate, index, items) => candidate instanceof HTMLAnchorElement && items.indexOf(candidate) === index,
            )
            .map((candidate) => ({
              element: candidate,
              score: scoreProductLinkCandidate(candidate, ctaElement, priceElement),
            }))
            .filter((entry) => Number.isFinite(entry.score) && entry.score > 0)
            .sort((left, right) => right.score - left.score);
          return candidates[0]?.element?.href || "";
        };
        const titleMaxLinesFor = (element, style) => {
          if (!(element instanceof Element) || !style) return null;
          const clampCandidates = [
            style.webkitLineClamp,
            style.lineClamp,
            element.style?.webkitLineClamp,
            element.style?.lineClamp,
          ];
          for (const candidate of clampCandidates) {
            const parsed = Number.parseInt(String(candidate || ""), 10);
            if (Number.isFinite(parsed) && parsed > 0) return parsed;
          }
          const lineHeight = Number.parseFloat(style.lineHeight);
          const rect = element.getBoundingClientRect();
          if (Number.isFinite(lineHeight) && lineHeight > 0 && rect.height > 0) {
            const estimated = Math.round(rect.height / lineHeight);
            if (estimated > 0 && estimated <= 8) return estimated;
          }
          return null;
        };
        const normalizedAlignment = (value) => {
          const normalized = normalize(value).toLowerCase();
          if (["left", "center", "right"].includes(normalized)) return normalized;
          return "unknown";
        };
        const scoreTitleCandidate = (candidate, ctaElement, productUrl, priceElements) => {
          if (!(candidate instanceof Element) || !isVisible(candidate)) return Number.NEGATIVE_INFINITY;
          const text = normalize(candidate.innerText || candidate.textContent || "");
          if (!text) return Number.NEGATIVE_INFINITY;
          if (
            ctaElement instanceof Element &&
            (candidate === ctaElement || candidate.contains(ctaElement) || ctaElement.contains(candidate))
          ) {
            return Number.NEGATIVE_INFINITY;
          }
          if (priceElements.some(price => price && (candidate === price || price.contains(candidate) ||
            (candidate.contains(price) && text === normalize(price.innerText || price.textContent || ""))))) {
            return Number.NEGATIVE_INFINITY;
          }
          const meta = [
            candidate.getAttribute("class") || "",
            candidate.getAttribute("id") || "",
            candidate.getAttribute("title") || "",
            candidate.getAttribute("itemprop") || "",
          ].join(" ");
          const explicitTitle = /title|name/i.test(meta) || candidate.matches("h1,h2,h3,h4,h5,h6,[itemprop='name']");
          if (!explicitTitle && isDiscountOnlyCtaLabel(text)) return Number.NEGATIVE_INFINITY;
          let score = 6;
          if (/title|name/i.test(meta)) score += 8;
          else if (/product/i.test(meta)) score += 2;
          if (candidate.matches("h1, h2, h3, h4, h5, h6, [itemprop='name']")) score += 5;
          if (candidate instanceof HTMLAnchorElement) {
            score += 2;
            if (productUrl && candidate.href === productUrl) score += 5;
          }
          if (candidate.querySelector("img, picture, video, svg")) score -= 5;
          if (text.length > 140) score -= 4;
          if (text.length < 3) score -= 4;
          return score;
        };
        const findTitleWithinCard = (card, ctaElement, productUrl, priceElements = []) => {
          const selector = "h1, h2, h3, h4, h5, h6, [itemprop='name'], [class*='title'], [class*='name'], a[href], p, span, div";
          const candidates = [...card.querySelectorAll(selector)]
            .filter(isVisible)
            .map((candidate, index) => {
              const text = normalize(candidate.innerText || candidate.textContent || "");
              return {
                element: candidate,
                text,
                score: scoreTitleCandidate(candidate, ctaElement, productUrl, priceElements),
                index,
              };
            })
            .filter((entry) => Number.isFinite(entry.score) && entry.score > 0)
            .sort((left, right) => {
              if (right.score !== left.score) return right.score - left.score;
              return left.index - right.index;
            });
          return candidates[0] || null;
        };
        const visibleTextSnippets = (card) =>
          [...card.querySelectorAll("span, div, a, p, li, small, strong, b")]
            .filter(isVisible)
            .map((element) => normalize(element.innerText || element.textContent || ""))
            .filter((text) => text && text.length <= 80);
        const compactUniqueTexts = (values) => {
          const seen = new Set();
          return values.filter((value) => {
            if (!value || seen.has(value)) return false;
            seen.add(value);
            return true;
          });
        };
        const badgeSummaryForCard = (card, cardText) => {
          const visibleTexts = visibleTextSnippets(card);
          const labels = compactUniqueTexts(
            visibleTexts.filter((text) =>
              SALE_BADGE_PATTERN.test(text) || NEW_BADGE_PATTERN.test(text) || BESTSELLER_BADGE_PATTERN.test(text),
            ),
          ).slice(0, 6);
          const combined = [cardText, ...labels].join(" ");
          const hasSaleBadge = SALE_BADGE_PATTERN.test(combined);
          const hasNewBadge = NEW_BADGE_PATTERN.test(combined);
          const hasBestsellerBadge = BESTSELLER_BADGE_PATTERN.test(combined);
          const hasAnyBadge = hasSaleBadge || hasNewBadge || hasBestsellerBadge;
          return {
            text: labels.join(" | "),
            labels,
            hasSaleBadge,
            hasNewBadge,
            hasBestsellerBadge,
            badgePlacement: hasAnyBadge ? "unknown" : "none",
          };
        };
        const metaSummaryForCard = (card, cardText) => {
          const visibleTexts = visibleTextSnippets(card);
          const interactiveMeta = [...card.querySelectorAll(INTERACTIVE_SELECTOR)]
            .filter(isVisible)
            .map((element) =>
              [
                element.getAttribute("aria-label") || "",
                element.getAttribute("title") || "",
                element.getAttribute("class") || "",
                element.getAttribute("id") || "",
              ].join(" "),
            )
            .join(" ");
          const combined = [cardText, ...visibleTexts, interactiveMeta].join(" ");
          const ratingText = visibleTexts.find((text) => /[★☆⭐]/.test(text) || /\b\d(?:[.,]\d)?\s*\/\s*5\b/.test(text)) || "";
          const reviewText = visibleTexts.find((text) => REVIEW_PATTERN.test(text)) || "";
          const deliveryText = visibleTexts.find((text) => DELIVERY_PATTERN.test(text)) || "";
          const installmentText = visibleTexts.find((text) => INSTALLMENT_PATTERN.test(text)) || "";
          return {
            text: combined.slice(0, 220),
            ratingText,
            reviewText,
            deliveryText,
            installmentText,
            hasRating: Boolean(ratingText),
            hasReviewCount: Boolean(reviewText),
            hasWishlist: WISHLIST_PATTERN.test(combined),
            hasCompare: COMPARE_PATTERN.test(combined),
            hasDeliveryChip: Boolean(deliveryText),
            hasInstallmentChip: Boolean(installmentText),
          };
        };
        const getBorderSummary = (style) => {
          const sides = [
            {
              color: toHex(style.borderTopColor),
              width: Number.parseFloat(style.borderTopWidth) || 0,
              style: style.borderTopStyle,
            },
            {
              color: toHex(style.borderRightColor),
              width: Number.parseFloat(style.borderRightWidth) || 0,
              style: style.borderRightStyle,
            },
            {
              color: toHex(style.borderBottomColor),
              width: Number.parseFloat(style.borderBottomWidth) || 0,
              style: style.borderBottomStyle,
            },
            {
              color: toHex(style.borderLeftColor),
              width: Number.parseFloat(style.borderLeftWidth) || 0,
              style: style.borderLeftStyle,
            },
          ].filter((side) => side.width > 0 && side.color);

          if (sides.length) {
            const colorFrequency = new Map();
            for (const side of sides) {
              colorFrequency.set(side.color, (colorFrequency.get(side.color) || 0) + 1);
            }
            const sortedColors = [...colorFrequency.entries()].sort((left, right) => right[1] - left[1]);
            return {
              borderColor: sortedColors[0][0],
              borderWidth: Math.max(...sides.map((side) => side.width)),
              // The email surface supports one border style. A multi-side
              // shorthand is not a valid style inside its border shorthand.
              borderStyle: sides.every((side) => side.style === sides[0].style) ? sides[0].style : null,
            };
          }

          return {
            borderColor: pickBorderColor(style),
            borderWidth: Number.parseFloat(style.borderWidth) || 0,
            borderStyle: null,
          };
        };
        // A number written with grouped thousands is ONE number. Its separator is a space,
        // so counting `\d+` runs read "₴ 1 199" as two numbers and `priceLooksMergedLike`
        // docked a perfectly clean single-price card as a merged blob. A group must be
        // exactly three digits with no fourth behind it, or "1 29999" — a grouped integer
        // glued to superscript cents — would swallow "299" as a group and hide the split.
        // Same blindness the host resolver above had; this is its other site.
        const NUMBER_TOKEN_PATTERN = /\d+(?: \d{3}(?!\d))*(?:[.,]\d+)?/g;
        const countNumberTokens = (text) => (normalize(text).match(NUMBER_TOKEN_PATTERN) || []).length;
        // Global: priceMatches() below counts every price in a card, not just
        // the first. String.match resets lastIndex itself, so it stays safe.
        const PRICE_TEXT_PATTERN = new RegExp(window.__brandkitProbeHelpers.priceTextPatternSource, "giu");
        const PRICE_META_PATTERN =
          /price|cost|amount|sum|current|actual|sale|special|ціна|цена|варт|стоим|грн|uah/i;
        // Names that can only mean "the price before this one". Bare tokens do
        // not qualify: `regular` names the sole price on a card that has no
        // discount, and unanchored `old`/`was`/`cross` match `font-bold`,
        // `household`, `washing` and `crossbody` — this decides the old-price
        // slot, so a substring that merely contains the word is not evidence.
        const OLD_PRICE_META_PATTERN =
          /(?:^|[^a-z])old(?:$|[^a-z])|old[-_]?price|price[-_]?old|was[-_]?price|previous[-_]?price|compare[-_]?at|original[-_]?price|стар[а-я]*\s*ц[іен]|поперед/i;
        const CURRENT_PRICE_META_PATTERN =
          /current|actual|sale|special|final|new|price|cost|amount|sum|ціна|цена/i;
        const priceMatches = (text) => normalize(text).match(PRICE_TEXT_PATTERN) || [];
        // Tier R — reject loyalty / bonus / cashback taglines that
        // happen to contain a currency-shaped substring. These siblings
        // live inside `[class*='price']` wrappers on multiple Ukrainian
        // ecommerce sites and would otherwise win the price candidate
        // race because they're textually "price-shaped" but
        // semantically a points / bonus award, not the product price.
        // Patterns:
        //   ^\s*\+\s*\d        — leading-plus prefix (`+46 ₴ ...`); the
        //                        plus marks "additive bonus", never a
        //                        real product price
        //   на\s+бонус|бонусн[а-я]*\s+рахун — Ukrainian loyalty phrases
        //   кешбек|cashback|cash\s*back     — cashback messaging
        //   earn\s+\d|\d+\s+points?         — English points-reward
        const LOYALTY_TAGLINE_PATTERN =
          /^\s*\+\s*\d|на\s+бонус|бонусн[а-я]*\s+рахун|кешбек|cashback|cash\s*back|earn\s+\d|\d+\s+points?/i;
        // `getComputedStyle().content` is a CSS *value*, so a string literal arrives
        // quoted and everything else — `none`, `url(...)`, `counter(...)` — arrives as a
        // keyword or a function that is not text and must not be pasted into any. Only a
        // whole-value string literal is text. Chromium has already resolved `\20B4` and
        // `attr()` by this point, so the quoted body is the characters on screen.
        const generatedText = (element, pseudo) => {
          const value = window.getComputedStyle(element, pseudo).content;
          const literal = /^"((?:[^"\\]|\\.)*)"$/.exec(value) || /^'((?:[^'\\]|\\.)*)'$/.exec(value);
          return literal ? literal[1] : "";
        };
        // A currency drawn instead of written — an icon font, an inline <svg>. It puts no
        // character in any text node and none in generated content either, so no amount of
        // reading text can find it; what it has is a NAME, on the same alphabet every other
        // currency is matched by. All three halves are required, and each rejects a
        // different impostor:
        //   renders no text of its own — a glyph placeholder is empty, while
        //     `class="price-usd"` on the wrapper that also holds the digits is a label.
        //   named on the currency alphabet — with the letter boundaries that keep "lei"
        //     and "uah" from firing inside a word.
        //   occupies pixels — a currency that is DRAWN is by definition painted, so a
        //     zero-size element draws no currency whatever its name says.
        //   DRAWS SOMETHING — see `drawsSomething`. Occupying pixels is not the same as
        //     painting a glyph in them, and a name plus a rectangle is what let a
        //     decorative rule stand in for a currency.
        // Searched for over the SUBTREE, because the glyph is a sibling of the digits,
        // never their ancestor.
        //
        // The zero-size test also refuses a glyph that IS painted from a zero-rect box —
        // an absolutely-positioned ::before on a 0x0 host, a 0x0 <svg> with
        // overflow:visible. Those are on screen and are missed. The written path missed
        // them too, for the same reason: nothing in either path reads paint.
        const CURRENCY_NAME_PATTERN = new RegExp(
          "(?:" + window.__brandkitProbeHelpers.currencyTokenSource + ")",
          "iu",
        );
        // Does this element paint a glyph, or is it just a named rectangle?
        //
        // A name is weaker evidence than a character, so a currency-NAMED empty box has
        // to earn the currency it claims. It earns it by demonstrably drawing, and every
        // way a real icon system draws leaves a trace in the computed style that a
        // decorative box does not have:
        //   generated content — an icon font's `content: "\e900"` computes to the quoted
        //     PUA string even when the font never loads, because Chromium resolves the
        //     escape at parse time. Measured, not assumed: it is the reason this works at
        //     all offline. A rule drawn with `content: ""` computes to the empty literal
        //     and earns nothing.
        //   an image asset — `url()` or `image-set()` in `background-image`, `mask-image`,
        //     or a pseudo's `content`. A flat background COLOUR and a gradient are not
        //     assets, which is exactly what separates a sprite icon from a 10x2px rule.
        //   an svg or an img — the element ITSELF or a descendant. Both halves are
        //     needed: the ordinary SVG-sprite convention puts the currency class on the
        //     <svg> itself, and an element is not its own descendant, so a subtree-only
        //     test silently drops that whole markup family.
        // This is not an icon-name vocabulary — it asks what the element PAINTS, which is
        // what the currency-alphabet comment above warns enumeration cannot do. It is not
        // open-ended either; the residuals below say exactly where it stops.
        //
        // KNOWN RESIDUALS, measured. Two admit shapes that are not currencies:
        //   a currency-named element painting an IMAGE ASSET that is not a currency icon
        //     — nothing here reads the asset's pixels.
        //   a currency-named element painting a GENERATED-CONTENT decoration — an icon
        //     font divider (`content: "\e901"`, class `rub-sep`) or a star glyph
        //     (`content: "★"`, class `icon-star-uah`) beside a rating passes exactly as a
        //     currency icon does. Only emptiness is tested, so `content: " "` counts as
        //     drawing too.
        // And three shapes that DRAW but are refused, because nothing here reads paint:
        // a glyph inside shadow DOM, a <canvas>, and a paint worklet.
        // All five are far narrower than admitting on the name alone. The rejection
        // shapes in lib/product-card-price-shapes.test.js pin where the line actually is.
        const IMAGE_ASSET_PATTERN = /\b(?:url|image-set)\(/i;
        const drawsSomething = (element) => {
          const own = window.getComputedStyle(element);
          if (
            IMAGE_ASSET_PATTERN.test(own.backgroundImage) ||
            IMAGE_ASSET_PATTERN.test(own.maskImage)
          ) {
            return true;
          }
          if (element.matches("svg, img") || element.querySelector("svg, img")) return true;
          return ["::before", "::after"].some((pseudo) => {
            const style = window.getComputedStyle(element, pseudo);
            return (
              generatedText(element, pseudo) !== "" ||
              IMAGE_ASSET_PATTERN.test(style.content) ||
              IMAGE_ASSET_PATTERN.test(style.backgroundImage) ||
              IMAGE_ASSET_PATTERN.test(style.maskImage)
            );
          });
        };
        const drawsCurrencyGlyph = (element) =>
          !normalize(element.textContent) &&
          CURRENCY_NAME_PATTERN.test(elementMeta(element)) &&
          isVisible(element) &&
          drawsSomething(element);
        // ONE definition of "price", whether the currency is written or drawn: stand a
        // currency character where the glyph is painted and ask the same pattern the
        // written path asks. The test this replaces was a second, weaker definition — a
        // digit anywhere in the element plus a currency-named element anywhere in its
        // subtree — and it accepted "Артикул 12345 назва <icon>", which the written
        // pattern rejects because nothing but whitespace may sit between an amount and
        // its currency. U+00A4 CURRENCY SIGN is the stand-in: it is \p{Sc}, so the
        // alphabet already carries it, and no storefront writes it.
        //
        // The probe reads textContent, not innerText, so it can see an amount that
        // `rendered` would have dropped as hidden. That is why the caller still requires
        // `rendered` to carry an amount of its own before this is consulted.
        const DRAWN_CURRENCY_STAND_IN = "¤";
        const drawnPriceIn = (element) => {
          const range = document.createRange();
          // Descendants only. `drawsCurrencyGlyph` demands an element that renders no
          // text, so the element itself could never hold the digits this currency marks.
          return [...element.querySelectorAll("*")].filter(drawsCurrencyGlyph).some((glyph) => {
            range.selectNodeContents(element);
            range.setEndBefore(glyph);
            const before = range.toString();
            range.selectNodeContents(element);
            range.setStartAfter(glyph);
            return priceMatches(before + DRAWN_CURRENCY_STAND_IN + range.toString()).length > 0;
          });
        };
        // The price text an element RENDERS, or "" when it renders none.
        //
        // `innerText` is not what is on screen, and the gap is exactly where prices hide.
        // Currency evidence reaches an element in three ways and `innerText` carries only
        // the first:
        //   in a text node       — the ordinary case.
        //   in generated content — `::before`/`::after` are rendered text that lives in no
        //     text node. Spliced back at the two positions they are drawn, so the currency
        //     lands beside the digits it marks; appended at the end of a wrapper instead,
        //     it would fuse that wrapper's two prices into one price-shaped run.
        //   drawn as a glyph     — see `drawnPriceIn`. It contributes no character, so
        //     the digits stay bare: the text remains "119" and it is the ELEMENT that
        //     carries the evidence, not any string taken off it.
        // Deciding this on the flattened text alone is what let the node actually drawing
        // the price be passed over, leaving the card to report a neighbouring struck price
        // — or nothing at all — as the price the shopper pays.
        const priceTextOf = (element) => {
          const rendered = normalize(
            generatedText(element, "::before") +
              (element.innerText || element.textContent || "") +
              generatedText(element, "::after"),
          );
          if (!rendered || rendered.length > 90) return "";
          if (LOYALTY_TAGLINE_PATTERN.test(rendered)) return "";
          if (priceMatches(rendered).length) return rendered;
          return /\d/.test(rendered) && drawnPriceIn(element) ? rendered : "";
        };
        const parsePriceValue = (text) => {
          if (!text) return null;
          const match = String(text).match(/(\d[\d\s.,]*)/);
          if (!match) return null;
          const cleaned = match[1].replace(/\s/g, "");
          if (!cleaned) return null;
          const dotMatches = (cleaned.match(/\./g) || []).length;
          const commaMatches = (cleaned.match(/,/g) || []).length;
          let normalized;
          if (dotMatches === 1 && commaMatches === 0 && /\.\d{1,2}$/.test(cleaned)) {
            normalized = cleaned;
          } else if (commaMatches === 1 && dotMatches === 0 && /,\d{1,2}$/.test(cleaned)) {
            normalized = cleaned.replace(",", ".");
          } else {
            normalized = cleaned.replace(/[.,]/g, "");
          }
          const value = Number.parseFloat(normalized);
          return Number.isFinite(value) && value > 0 ? value : null;
        };
        // Returns evidence detail rather than a bare boolean so downstream code
        // can distinguish leaf-element strikethrough from ancestor-cascade
        // strikethrough. The candidate-selection step uses this to prefer the
        // most-specific match (a leaf <span class="line-through">299 ₴</span>
        // over a wrapper that mashes the strikethrough span with sibling
        // discount-badge text).
        const oldPriceEvidenceFor = (element, style, text) => {
          const empty = {
            isOld: false,
            hasDirectLineThrough: false,
            hasDirectStrikeTag: false,
            hasAncestorLineThrough: false,
            metaMatch: false,
          };
          // `text` is the price text its caller already resolved off this element, so
          // re-deciding here whether it looks like a price could only disagree — and it
          // would disagree in exactly one direction: a price whose currency is drawn
          // rather than written reads as a bare number, so a text-only re-check would
          // strip an icon-currency old price of its strikethrough and promote it to the
          // current slot. Emptiness is the only thing left to reject.
          if (!(element instanceof Element) || !text) return empty;
          const meta = elementMeta(element);
          const tag = element.tagName.toLowerCase();
          const decoration = [
            style?.textDecorationLine || "",
            style?.textDecoration || "",
          ].join(" ");
          const hasDirectStrikeTag = tag === "s" || tag === "del" || tag === "strike";
          const hasDirectLineThrough = /line-through/i.test(decoration);
          // Walk up to 3 ancestors so cascade-applied strikethrough on a parent
          // (e.g. <s><span class="price">…</span></s>, or a class whose
          // text-decoration only inherits to descendants) is detected.
          let ancestorDecoration = "";
          let ancestorTagMatch = false;
          let ancestor = element.parentElement;
          let ancestorDepth = 0;
          while (ancestor && ancestorDepth < 3) {
            const ancestorTag = ancestor.tagName ? ancestor.tagName.toLowerCase() : "";
            if (ancestorTag === "s" || ancestorTag === "del" || ancestorTag === "strike") {
              ancestorTagMatch = true;
              break;
            }
            const ancestorStyle = window.getComputedStyle(ancestor);
            if (ancestorStyle) {
              ancestorDecoration += ` ${ancestorStyle.textDecorationLine || ""} ${ancestorStyle.textDecoration || ""}`;
            }
            ancestor = ancestor.parentElement;
            ancestorDepth += 1;
          }
          const hasAncestorLineThrough = ancestorTagMatch || /line-through/i.test(ancestorDecoration);
          const metaMatch = OLD_PRICE_META_PATTERN.test(meta);
          // Tier R — class-name match alone is a weak signal. Class
          // tokens like `regular`, `previous`, `compare`, `was`, `old`,
          // `cross` appear on retail-framework wrappers ambiguously
          // (e.g. `.c-prices__regular` on a SALE price wrapper that
          // groups the strikethrough sibling, or `.previous-price-row`
          // labelling the row of the now-current price). Strikethrough
          // decoration is the unambiguous signal — limit meta-only
          // `isOld` to explicit strikethrough-naming tokens; broader
          // matches degrade to "candidate, decide by score / numeric
          // tiebreaker" downstream.
          const hasStrikeEvidence =
            hasDirectStrikeTag || hasDirectLineThrough || hasAncestorLineThrough;
          const STRONG_OLD_META_PATTERN =
            /strike|strikethrough|line-through|crossed|обовний|стар[а-я]*\s+ц[іе]н|поперед/i;
          const strongMetaMatch = STRONG_OLD_META_PATTERN.test(meta);
          const isOld = Boolean(hasStrikeEvidence || strongMetaMatch);
          return {
            isOld,
            hasDirectLineThrough,
            hasDirectStrikeTag,
            hasAncestorLineThrough,
            metaMatch,
          };
        };
        // A price a site COLOURED is a price a site EMPHASISED. That is the rule the two hue
        // tests below are reaching for, and what went wrong was not WHICH hues they name: it
        // was that naming a hue by its channels does not exclude the absence of hue, and the
        // green one duly failed to. Chroma, the spread between a colour's strongest and
        // weakest channel, is what separates a hue from a neutral, and no grey can fake it,
        // because a grey's three channels are equal at every lightness. It is already this
        // file's answer to "how coloured is this" — `colorChannelDelta` / `isNeutralColor`
        // compute the same subtraction to decide whether an element has a real background —
        // and it is repeated rather than shared because those live in a different
        // page.evaluate block, a scope boundary no import crosses.
        //
        // THE DEFECT. A per-channel test is a bounding BOX around a hue, and a box around a
        // hue swallows the neutral axis wherever it straddles r=g=b. The green one straddled
        // it across 110..120, so every grey from #6e6e6e to #787878 scored the same +3 as a
        // true green — #757575 among them, which is Material Grey 600, the design-system
        // default for secondary text and therefore the colour sites paint the per-unit rates,
        // instalment chips and fine print this score exists to rank BELOW the price.
        // Enumerated over all 2^24 colours: the green box admitted 11 exact greys, the red
        // box none. The red box was never the same defect — red>=150 with green<=100 forces
        // the channels 50 apart, so its floor is already chroma 50 at #966464 — but it is
        // guarded by the same floor, because one neutrality test for both is what makes this
        // a rule instead of two coincidences.
        //
        // WHY THE BOXES SURVIVE. Replacing them with "any saturated hue scores, red scores
        // most" reads better and measures worse. Driven through collectProductCardStyles on
        // fourteen cards carrying a coloured teaser beside a real split-markup price, it took
        // the price slot away on 11 of 14 against this file's 5 of 14, because orange sale
        // badges jump 0 -> 5 and every brand navy, teal and cyan jumps 0 -> 3. The floor
        // alone leaves 4 of 14 — strictly better than the 5 it replaces, the one repaired
        // case being exactly the grey above. So the boxes stay, and their hue boundaries are
        // INHERITED here rather than endorsed: they reject 28 of 43 emphasis tokens sampled,
        // every dark 900-shade among them. Widening them is a real improvement still waiting
        // to be made, and what it needs first is the teaser rejecter, not a bolder score.
        //
        // THAT FOURTEEN-CARD SET IS NOT IN THE REPO. It was built during review and thrown
        // away; only its worst case is committed, as the orange-teaser-beside-price pin in
        // product-card-price-shapes.test.js. So 11-of-14 and 4-of-14 are reported numbers, not
        // reproducible ones — rebuild the set from that pin's card by varying the teaser
        // colour alone if you need to check them. Every other figure in this comment is
        // reproducible from the repo or from arithmetic over the colour space.
        //
        // WHY 64, HONESTLY. Measure this on REACHABLE colours or the numbers are fiction.
        // The floor never sees a colour a box has already rejected, so both edges have to be
        // computed over box-admitted tokens only — and applying that lens in one direction
        // while quoting raw minima in the other is exactly the error it exists to catch.
        // Across 45 muted and 35 emphasis design-system tokens, only 4 muted ones reach the
        // floor at all, and three of those are pure greys: the reachable muted ceiling is 12
        // (Tailwind stone-500 #78716c). 13 emphasis tokens reach it, the lowest at 79
        // (Material Green 800 #2e7d32) — everything between is rejected on hue, Material
        // Green 900 #1b5e20 at chroma 67, Tailwind green-900 #14532d at 63 and teal-900
        // #134e4a at 59 all failing `green >= 110` whatever this floor says. So the interval
        // that misclassifies nothing is 13..79, and 64 sits at its 77th percentile with 52
        // points of clearance below and 15 above.
        //
        // Which means the number is NOT pinned by the data — 67 values would serve, and 56
        // and 64 are indistinguishable on both the shape pins and the fourteen attack cards.
        // What the data pins is the interval; 64 is the quarter-of-range mark inside it,
        // chosen because a round fraction is a reason a later reader can check. It runs
        // conservative on both edges, and deliberately: the sampled tokens are what five
        // design systems ship, not what every storefront writes by hand.
        //
        // THE COST OF HAVING A FLOOR AT ALL. Exhaustively, 138,400 colours are admitted by a
        // box and then rejected by this floor — 137,385 through the green box, 1,015 through
        // the red — every one of them at chroma 63 or below, topping out at #2f6e2f, a muted
        // forest green sitting exactly on `green >= 110`. Not one of the 35 emphasis tokens
        // lands in that set. It is narrow and empty of known price colours, but it is real,
        // and it exists at every threshold, not just this one.
        //
        // AND NOT FOR THE REASON FIRST GIVEN. An earlier draft argued the floor should be
        // bought high because a false positive steals the price slot while a false negative
        // "only forfeits a bonus". That is wrong, and this file's own
        // green-price-beside-grey-chip pin disproves it: there the bonus is load-bearing, and
        // a green price that lost it would lose the slot to the chip beside it. Both errors
        // cost the slot. The floor is not safe in one direction; it sits in the interval the
        // tokens leave open, and the tokens are why it is 64 rather than 40 or 100.
        const priceColorScore = (color) => {
          if (!/^#[0-9a-f]{6}$/i.test(color || "")) return 0;
          const red = Number.parseInt(color.slice(1, 3), 16);
          const green = Number.parseInt(color.slice(3, 5), 16);
          const blue = Number.parseInt(color.slice(5, 7), 16);
          const chroma = Math.max(red, green, blue) - Math.min(red, green, blue);
          if (chroma < 64) return 0;
          if (red >= 150 && green <= 100 && blue <= 100) return 5;
          if (green >= 110 && red <= 120 && blue <= 120) return 3;
          return 0;
        };
        // Split number/currency markup leaves the matched container carrying a font nobody
        // sees, so typography has to be measured on the node that actually draws the digits.
        // Two rules decide which node that is, and they are NOT the same rule.
        //
        // EXCLUSION. A strikethrough strictly inside the candidate marks a DIFFERENT price —
        // the one the shopper is no longer charged — so those subtrees are dropped before
        // anything is measured. Membership alone does not prevent this and it was wrong to
        // claim it did: "199" is a substring of "1199", so a card showing a bare 199 beside a
        // struck "1199 грн" hands the struck leaf MORE of the digits and it wins. Measured on
        // four shapes, not imagined. When the candidate IS the old price the strikethrough is
        // its own and nothing is dropped — otherwise a struck price wrapped in a div would
        // lose every node it has.
        //
        // DOMINANCE. Among what survives, the node drawing the most of this price's digits
        // wins, ties going to the larger rendered digit run and then to document order. This
        // is what makes split groups RESOLVE rather than abstain: "1 299"+"99" and "1"+"1"+"9"
        // are pieces of one number however the markup cuts them up, where searching for a
        // needle group found no node holding it and silently returned the container.
        //
        // The digits are anchored on what SURVIVES, not on the candidate's whole text. A
        // container holding two prices has two currency-anchored runs, and taking the first
        // would anchor on the old price wherever a site prints the old price first.
        //
        // Nothing survives only when no visible text node drew the digits — a price rendered
        // as an image — and there the container is the honest answer.
        const DIGIT_RUN_PATTERN = /\d[\s\S]*\d|\d/;
        const struckWithin = (node, root) => {
          for (let current = node; current && current !== root; current = current.parentElement) {
            const tag = current.tagName.toLowerCase();
            if (tag === "s" || tag === "del" || tag === "strike") return true;
            const style = window.getComputedStyle(current);
            if (/line-through/i.test(`${style.textDecorationLine || ""} ${style.textDecoration || ""}`)) return true;
          }
          return false;
        };
        const numericTokenHost = (element, candidateIsOld) => {
          const walker = document.createTreeWalker(element, window.NodeFilter.SHOW_TEXT);
          const drawn = [];
          for (let node = walker.nextNode(); node; node = walker.nextNode()) {
            const host = node.parentElement;
            if (!isVisible(host)) continue;
            if (!candidateIsOld && struckWithin(host, element)) continue;
            drawn.push({ node, host, text: normalize(node.nodeValue) });
          }
          const own = drawn.map((entry) => entry.text).join(" ");
          const digits = (priceMatches(own)[0] || own).replace(/\D/g, "");
          const range = document.createRange();
          let best = null;
          for (const entry of drawn) {
            const glyphs = entry.text.replace(/\D/g, "");
            if (!glyphs || !digits.includes(glyphs)) continue;
            // Measured on the DIGIT RUN, not the whole text node. A 12px "1099 грн" node is
            // wider than a 16px "1099" one, so measuring whole nodes let a trailing currency
            // word decide which of two equal-length prices was the price being charged.
            const span = DIGIT_RUN_PATTERN.exec(entry.node.nodeValue);
            range.setStart(entry.node, span.index);
            range.setEnd(entry.node, span.index + span[0].length);
            const rect = range.getBoundingClientRect();
            const area = rect.width * rect.height;
            if (best && (glyphs.length < best.count || (glyphs.length === best.count && area <= best.area))) continue;
            best = { host: entry.host, count: glyphs.length, area };
          }
          return best ? best.host : element;
        };
        // KNOWN DISAGREEMENT, recorded because it is the reason the colour bonus can decide
        // anything at all. The two halves of this function measure DIFFERENT NODES. `score`
        // below reads fontSize, fontWeight and colour off `element` — the node that carries
        // the price's class — while `glyphStyle` reads them off `numericTokenHost(...)`, the
        // node that actually draws the digits. On split markup those are not the same node
        // and not the same type: the CS-Cart shape puts the class on a 14px/400 grey wrapper
        // and the 20px/700 red on a leaf inside it, so the candidate is scored as small,
        // light and grey while the artifact correctly reports it as large, heavy and red.
        // Isolated against the code BEFORE the chroma floor, on three cards whose rendered
        // digits and teaser were identical and whose price WRAPPER varied alone: 14px/400
        // grey lost the slot to a 12px grey teaser, 20px/700 grey held it, 20px/700 red held
        // it. All three hold today, because the teaser's grey no longer scores — but the gap
        // that let it in is untouched. A wrapper at 14px/400 claims one size point and no
        // weight point where the leaf's 20px/700 would claim four and two, so scoring the
        // wrapper hands away five points, and a colour bonus is worth three or five. That is
        // why colour can decide a split-markup card and can never decide a single-node one.
        //
        // NOT FIXED HERE, and the sizing is why: scoring off `numericTokenHost`'s style
        // passes 32 of the 33 price-shape pins and breaks after-currency-shared-wrapper, which
        // then emits "1099 1299 грн" where the card shows "1099 ₴" — the shared wrapper's two
        // prices stop being separable once the wrapper is scored by its inner leaf. That
        // needs its own tie-break work, not a one-line swap.
        const priceCandidateFromElement = (element, source, selector = "") => {
          if (!(element instanceof Element) || !isVisible(element)) return null;
          const text = priceTextOf(element);
          if (!text) return null;
          const style = window.getComputedStyle(element);
          const meta = elementMeta(element);
          const fontSize = Number.parseFloat(style.fontSize);
          const fontWeight = Number.parseInt(style.fontWeight, 10);
          const color = toHex(style.color);
          let score = 0;
          if (PRICE_META_PATTERN.test(meta)) score += 5;
          if (CURRENT_PRICE_META_PATTERN.test(meta)) score += 3;
          if (Number.isFinite(fontWeight) && fontWeight >= 600) score += 2;
          if (Number.isFinite(fontSize) && fontSize >= 14) score += Math.min(4, (fontSize - 12) / 2);
          score += priceColorScore(color);
          const count = priceMatches(text).length;
          if (count === 1) score += 4;
          if (count > 1) score -= 4;
          if (text.length > 48) score -= 3;
          const oldEvidence = oldPriceEvidenceFor(element, style, text);
          return {
            element,
            selector,
            source,
            text,
            style,
            // `isOld` decides whether a strikethrough inside this element marks someone
            // else's price or its own — see numericTokenHost's EXCLUSION rule.
            glyphStyle: window.getComputedStyle(numericTokenHost(element, oldEvidence.isOld)),
            // The container's colour is deliberately NOT published. It is a scoring input
            // above — "does this element look like a price" — and nothing else may read it,
            // because the container is by definition not the node whose colour is on
            // screen whenever the two differ. Published, it was preferred over the glyph
            // node's, and the emitted record described a split-span price in the invisible
            // wrapper's grey at the digit leaf's size and weight: a combination the page
            // never rendered.
            isOld: oldEvidence.isOld,
            hasDirectLineThrough: oldEvidence.hasDirectLineThrough,
            hasDirectStrikeTag: oldEvidence.hasDirectStrikeTag,
            hasAncestorLineThrough: oldEvidence.hasAncestorLineThrough,
            metaMatch: oldEvidence.metaMatch,
            priceCount: count,
            score,
          };
        };
        // Every distinct price the card's text shows, in reading order.
        const cardPriceTexts = (cardText) =>
          compactUniqueTexts(priceMatches(cardText).map((match) => normalize(match)).filter(Boolean));
        // Mirror of lib/old-price-evidence.js#selectBestOldPriceCandidate.
        // Lives inline because this code path runs in browser context; the
        // pure ES module is the unit-tested source of truth for the rules.
        const compareOldCandidates = (a, b) => {
          const aDirect = Boolean(a.hasDirectLineThrough || a.hasDirectStrikeTag);
          const bDirect = Boolean(b.hasDirectLineThrough || b.hasDirectStrikeTag);
          const aSingle = (a.priceCount || 0) === 1;
          const bSingle = (b.priceCount || 0) === 1;
          // Tier 1: direct + single-price wins.
          const aClean = aDirect && aSingle;
          const bClean = bDirect && bSingle;
          if (aClean !== bClean) return aClean ? -1 : 1;
          if (aClean && bClean) {
            const aLen = (a.text || "").length;
            const bLen = (b.text || "").length;
            if (aLen !== bLen) return aLen - bLen;
            return (b.score || 0) - (a.score || 0);
          }
          // Tier 2: any direct evidence beats ancestor-only.
          if (aDirect !== bDirect) return aDirect ? -1 : 1;
          // Tier 3: prefer single-price texts.
          if (aSingle !== bSingle) return aSingle ? -1 : 1;
          // Tier 4: shorter text — wrappers are longer than leaf spans.
          const aLen = (a.text || "").length;
          const bLen = (b.text || "").length;
          if (aLen !== bLen) return aLen - bLen;
          // Tier 5: higher score.
          return (b.score || 0) - (a.score || 0);
        };
        const findPriceEvidenceWithinCard = (card, explicitPriceMatch, explicitOldPriceMatch, cardText) => {
          const candidates = [];
          const add = (element, source, selector = "") => {
            const candidate = priceCandidateFromElement(element, source, selector);
            if (candidate) candidates.push(candidate);
          };
          if (explicitPriceMatch?.element) add(explicitPriceMatch.element, "explicit-selector", explicitPriceMatch.selector);
          if (explicitOldPriceMatch?.element) add(explicitOldPriceMatch.element, "explicit-old-selector", explicitOldPriceMatch.selector);
          for (const element of [
            ...card.querySelectorAll("s, del, ins, strong, b, small, span, p, div, a, [class], [itemprop]"),
          ]) {
            add(element, "heuristic-text");
          }
          // One candidate per element. Duplicates are what the two passes above
          // produce — a selector match and the walk reaching the same node —
          // and the first keeps the selector that found it. Two *elements*
          // rendering the same text are never duplicates: they are a wrapper
          // and the node inside it that draws the glyphs, differing in the
          // fonts and colours they carry and in `text-decoration-line`, which
          // does not inherit. Keying this by rendered text dropped whichever
          // the walk reached second — always the inner one, the only node
          // holding the strikethrough. `compareOldCandidates` and the score
          // are what choose between them.
          const byElement = new Map();
          for (const candidate of candidates) {
            if (!byElement.has(candidate.element)) byElement.set(candidate.element, candidate);
          }
          const pool = [...byElement.values()];

          // Old price first, on its own evidence: strikethrough where a node
          // carries it, else an old-price class name — the only evidence a
          // site that greys its old price instead of striking it ever gives.
          // Tier R keeps those names out of `isOld` because `regular` and
          // `previous` are ambiguous, and what disambiguates them is the card:
          // a name marks a price as superseded only where the card shows a
          // second price to have superseded it. Where it shows one,
          // `*__regular` names the price the shopper pays. Nothing numeric
          // belongs here — a card's smallest price is as often a per-unit
          // rate, a delivery teaser or a bonus as it is what the shopper pays.
          const cardPrices = cardPriceTexts(cardText);
          let old = pool.filter((candidate) => candidate.isOld).sort(compareOldCandidates)[0]
            || (cardPrices.length > 1
              ? pool.filter((candidate) => candidate.metaMatch).sort(compareOldCandidates)[0]
              : null)
            || null;
          let current = pool
            .filter((candidate) => candidate !== old && !candidate.isOld)
            .sort((left, right) => right.score - left.score)[0] || null;
          if (!current || current.text.length > 90 || priceMatches(current.text).length > 1) {
            const compactCurrent = pool
              .filter((candidate) => candidate !== old && !candidate.isOld && priceMatches(candidate.text).length === 1)
              .sort((left, right) => right.score - left.score)[0];
            if (compactCurrent) current = compactCurrent;
          }
          if (!old) {
            old = pool
              .filter((candidate) => candidate !== current && candidate.source === "explicit-old-selector")
              .sort((left, right) => right.score - left.score)[0] || null;
          }
          // Nothing rendered the price on its own — it is drawn as an image, or
          // split so no node holds both the digits and the currency. Report the
          // last price the card's text shows, and no old price: a token list
          // carries no evidence of age, and an old price guessed from text
          // order reaches the emitted brandkit as a struck price on cards the
          // site never struck.
          if (!current && cardPrices.length) {
            current = { element: null, selector: "text-pattern", source: "text-pattern", text: cardPrices[cardPrices.length - 1], style: null, score: 1 };
          }
          // Inverted-pair recovery: when both `current` and `old` are populated
          // but the numeric values are backwards (current > old by >5%) AND the
          // `old` candidate was identified by soft evidence only (class-name
          // match — no <s>/<del>/<strike> tag, no line-through on the element
          // or its ancestors), swap them. Sites where strikethrough or strong
          // tags reliably mark the old price keep their original pairing
          // because the strong-evidence check fails. Targets sites where
          // misleading class names like "*-old" sit on the sale price
          // element (rather than the original-price element). This is the one
          // place a number may overrule the DOM, and it can only demote a
          // class name back to nothing — both sides are elements the site
          // drew, so neither reading invents a price the card never showed.
          if (current && old) {
            const currentValue = parsePriceValue(current.text);
            const oldValue = parsePriceValue(old.text);
            const oldHasStrongEvidence = (() => {
              const el = old.element;
              const tag = (el.tagName || "").toLowerCase();
              if (tag === "s" || tag === "del" || tag === "strike") return true;
              const directDeco = [old.style?.textDecorationLine || "", old.style?.textDecoration || ""].join(" ");
              if (/line-through/i.test(directDeco)) return true;
              let ancestor = el.parentElement;
              let depth = 0;
              while (ancestor && depth < 3) {
                const aTag = ancestor.tagName ? ancestor.tagName.toLowerCase() : "";
                if (aTag === "s" || aTag === "del" || aTag === "strike") return true;
                const aStyle = window.getComputedStyle(ancestor);
                if (aStyle && /line-through/i.test([(aStyle.textDecorationLine || ""), (aStyle.textDecoration || "")].join(" "))) return true;
                ancestor = ancestor.parentElement;
                depth += 1;
              }
              return false;
            })();
            if (
              !oldHasStrongEvidence &&
              currentValue !== null &&
              oldValue !== null &&
              currentValue > oldValue * 1.05
            ) {
              const swapped = current;
              current = old;
              old = swapped;
            }
          }
          return { current, old };
        };
        const isGenericProductSelector = (selector) =>
          /\[class\*=['"]product['"]\]|^article$/.test(selector);
        const selectorSpecificityScore = (selector, selectorIndex) => {
          let score = Math.max(0, cardSelectors.length - selectorIndex);
          if (/\[data-[^\]]+\]/.test(selector)) score += 3;
          if (/#/.test(selector)) score += 2;
          if (/\.[A-Za-z0-9_-]+/.test(selector)) score += 1;
          if (/product-card|card.+product|product.+card|data-product/i.test(selector)) score += 3;
          if (/goods|catalog|product-item|goods-item|goodsItem|item-card|card-item|listing|offer/i.test(selector)) {
            score += 2;
          }
          if (isGenericProductSelector(selector)) score -= 5;
          return score;
        };
        const findWithinCard = (card, selectorList, { resolveInteractive = false, allowHeuristicCta = false } = {}) => {
          const activeSelectorList = normalizeSelectorList(selectorList);
          if (resolveInteractive) {
            const candidates = [];
            activeSelectorList.forEach((selector, selectorIndex) => {
              if (!selector) return;
              try {
                if (card.matches(selector) && isVisible(card)) {
                  const resolved = resolveInteractiveElement(card);
                  if (resolved.element) {
                    candidates.push({
                      element: resolved.element,
                      selector,
                      resolvedFrom: resolved.resolvedFrom,
                      score: scoreInteractiveCandidate(resolved.element) + Math.max(0, 6 - selectorIndex),
                    });
                  }
                }
              } catch {
                // Ignore invalid relative match for this card.
              }
              try {
                [...card.querySelectorAll(selector)]
                  .filter(isVisible)
                  .forEach((match) => {
                    const resolved = resolveInteractiveElement(match);
                    if (resolved.element) {
                      candidates.push({
                        element: resolved.element,
                        selector,
                        resolvedFrom: resolved.resolvedFrom,
                        score: scoreInteractiveCandidate(resolved.element) + Math.max(0, 6 - selectorIndex),
                      });
                    }
                  });
              } catch {
                // Ignore invalid selectors and continue.
              }
            });

            if (candidates.length) {
              candidates.sort((left, right) => {
                if (right.score !== left.score) {
                  return right.score - left.score;
                }
                if (left.selector !== right.selector) {
                  return left.selector.localeCompare(right.selector);
                }
                return 0;
              });
              return {
                element: candidates[0].element,
                selector: candidates[0].selector,
                resolvedFrom: candidates[0].resolvedFrom,
              };
            }
            if (allowHeuristicCta) {
              return findHeuristicCtaWithinCard(card);
            }
            return { element: null, selector: "", resolvedFrom: "none" };
          }

          for (const selector of activeSelectorList) {
            if (!selector) continue;
            try {
              if (card.matches(selector) && isVisible(card)) {
                return { element: card, selector, resolvedFrom: "self" };
              }
            } catch {
              // Ignore invalid relative match for this card.
            }
            try {
              const match = [...card.querySelectorAll(selector)].find(isVisible);
              if (match) {
                return { element: match, selector, resolvedFrom: "self" };
              }
            } catch {
              // Ignore invalid selectors and continue.
            }
          }
          if (allowHeuristicCta) {
            return findHeuristicCtaWithinCard(card);
          }
          return { element: null, selector: "", resolvedFrom: "none" };
        };
        const elementMeta = (element) =>
          [
            element?.getAttribute?.("class") || "",
            element?.getAttribute?.("id") || "",
            element?.getAttribute?.("title") || "",
            element?.getAttribute?.("aria-label") || "",
            element?.getAttribute?.("itemprop") || "",
            element?.getAttribute?.("data-testid") || "",
            element?.getAttribute?.("data-test") || "",
          ].join(" ");
        const hasMediaEvidence = (element) => Boolean(element.querySelector("img, picture, video, source"));

        const rows = [];
        const rowNodes = new Map();
        const rowEvidence = new Map();
        for (let selectorIndex = 0; selectorIndex < cardSelectors.length; selectorIndex += 1) {
          const selector = cardSelectors[selectorIndex];
          let cards = [];
          let matchIndexes;
          try {
            const matches = [...document.querySelectorAll(selector)];
            matchIndexes = new Map(matches.map((card, index) => [card, index]));
            cards = matches.filter(isVisible);
          } catch {
            continue;
          }
          const cardGridInfo = new Map();
          {
            const cardWidths = new Map();
            for (const card of cards) {
              cardWidths.set(card, card.getBoundingClientRect().width);
            }
            const findGridContainer = (card) => {
              let container = card.parentElement;
              let depth = 0;
              while (container && depth < 4) {
                const peers = cards.filter((other) => other === card || container.contains(other));
                if (peers.length >= 2) {
                  return { container, peers };
                }
                container = container.parentElement;
                depth += 1;
              }
              return { container: card.parentElement, peers: [card] };
            };
            for (const card of cards) {
              const { peers } = findGridContainer(card);
              const cardWidth = cardWidths.get(card) || 0;
              let similarSiblingCount = 0;
              if (cardWidth > 0) {
                for (const peer of peers) {
                  if (peer === card) continue;
                  const peerWidth = cardWidths.get(peer) || 0;
                  if (peerWidth <= 0) continue;
                  const ratio = Math.abs(peerWidth - cardWidth) / Math.max(peerWidth, cardWidth);
                  if (ratio <= 0.08) similarSiblingCount += 1;
                }
              }
              cardGridInfo.set(card, {
                hasGridSiblings: similarSiblingCount >= 1,
                similarSiblingCount,
                siblingCandidateCount: peers.length,
              });
            }
          }
          // Card-like sanity filter: reject elements that are clearly multi-card
          // wrappers / page-level containers, not individual product cards. A
          // wrapper is typically caught by ANY of three independent signals:
          //   (a) FILLS the viewport AND has no grid sibling — common for
          //       page-level `<main>` / list containers when broad fallbacks
          //       like `[class*='product']` match.
          //   (b) cardText length > 600 chars — a single product card has at
          //       most title + brand + price + 1-2 badges (~50-300 chars).
          //       Long text means multiple products' content is concatenated.
          //   (c) >= 4 distinct price-text matches inside the card — a single
          //       product card shows at most 2 price strings (current + old).
          //       4+ means multiple products in the same container.
          // These signals stack: any one is sufficient evidence of a wrapper.
          // Each is conservative enough that a legitimate single card with a
          // long description (~400 chars) or a card with one promotional
          // pricing block (2-3 prices) is preserved.
          const viewportWidth = (window.innerWidth || document.documentElement.clientWidth || 0);
          if (cards.length > 0) {
            const looksLikeWrapperByGeometry = (card) => {
              if (viewportWidth <= 0) return false;
              const cardWidth = card.getBoundingClientRect().width || 0;
              if (cardWidth <= 0) return false;
              const grid = cardGridInfo.get(card);
              return cardWidth >= viewportWidth * 0.9 && !(grid && grid.hasGridSiblings);
            };
            const looksLikeWrapperByContent = (card) => {
              const cardText = normalize(card.innerText || card.textContent || "");
              if (cardText.length > 600) return true;
              const priceCount = priceMatches(cardText).length;
              if (priceCount >= 4) return true;
              return false;
            };
            cards = cards.filter((card) => {
              if (looksLikeWrapperByGeometry(card)) return false;
              if (looksLikeWrapperByContent(card)) return false;
              return true;
            });
          }
          cards.forEach((card) => {
            // Locator.nth uses the unfiltered selector list, including hidden
            // and wrapper matches. Keep that identity for later hover reads.
            const index = matchIndexes.get(card);
            const cardStyle = window.getComputedStyle(card);
            const border = getBorderSummary(cardStyle);
            const cardRect = card.getBoundingClientRect();
            const cardText = normalize(card.innerText || card.textContent || "");
            const cardWordCount = cardText ? cardText.split(/\s+/).length : 0;
            const visibleInteractiveCount = [...card.querySelectorAll(INTERACTIVE_SELECTOR)].filter(isVisible).length;
            const priceMatch = findWithinCard(card, activePriceSelectors);
            const oldPriceMatch = findWithinCard(card, activeOldPriceSelectors);
            const ctaMatch = findWithinCard(card, activeCtaSelectors, {
              resolveInteractive: true,
              allowHeuristicCta: true,
            });
            const cta = ctaMatch.element;
            const ctaStyle = cta ? window.getComputedStyle(cta) : null;
            const ctaLayout = cta ? layoutEvidenceFor(cta, card) : null;
            // Default-state CTA colours carry their measurement state, so a
            // later hover comparison can tell a colour measured as absent from
            // one that was simply never read.
            const ctaBgMeasure = measureColor(ctaStyle ? ctaStyle.backgroundColor : null);
            const ctaFontMeasure = measureColor(ctaStyle ? ctaStyle.color : null);
            const ctaBorderMeasure = measureBorderColor(ctaStyle);
            const ctaLabel = cta
              ? recoverVisibleLabel(cta)
              : {
                  text: "",
                  source: "none",
                  hasUsableVisibleText: false,
                  recoveredFromDescendant: false,
                  fragmentCount: 0,
                  extentPx: null,
                };
            // `{widthPx, heightPx}` of the label's text-node Range, or null when the
            // control holds no text node to measure. See `measureLabelExtentPx`.
            const ctaLabelExtentPx =
              ctaLabel.extentPx && typeof ctaLabel.extentPx === "object" ? ctaLabel.extentPx : null;
            const ctaText = ctaLabel.text;
            const ctaMeta = cta
              ? [
                  ctaText,
                  cta.getAttribute("aria-label") || "",
                  cta.getAttribute("title") || "",
                  cta.getAttribute("class") || "",
                  cta.getAttribute("id") || "",
                  cta instanceof HTMLAnchorElement ? cta.href || "" : "",
                ].join(" ")
              : "";
            const ctaVisibleTextFitsControl = Boolean(
              cta &&
                ctaText &&
                (probeHelpers.hasVisuallyUsableLabel
                  ? probeHelpers.hasVisuallyUsableLabel(cta, ctaLabel)
                  : ctaLabel.hasUsableVisibleText)
            );
            const ctaHasUsableVisibleText = Boolean(
              cta &&
                ctaText &&
                ctaVisibleTextFitsControl,
            );
            const ctaLooksCompact = Boolean(
              cta &&
                ctaLayout &&
                ctaLayout.computedWidthPx !== null &&
                ctaLayout.computedHeightPx !== null &&
                ctaLayout.computedWidthPx <= 80 &&
                ctaLayout.computedHeightPx <= 56 &&
                (ctaLayout.widthRatioToParent === null || ctaLayout.widthRatioToParent <= 0.35),
            );
            // Empty text-node Range geometry is an icon-like signal. This is
            // not a complete visible-ink test: hidden/clipped text can retain
            // positive Range geometry, and null means no measured text node.
            const ctaLabelHasZeroRenderedExtent = Boolean(
              cta &&
                ctaLabelExtentPx &&
                (ctaLabelExtentPx.widthPx === 0 || ctaLabelExtentPx.heightPx === 0),
            );
            const priceEvidence = findPriceEvidenceWithinCard(card, priceMatch, oldPriceMatch, cardText);
            const price = priceEvidence.current?.element || null;
            const productUrl = findProductUrlWithinCard(card, cta, price);
            const oldPrice = priceEvidence.old?.element || null;
            const priceText = priceEvidence.current?.text || "";
            const oldPriceText = priceEvidence.old?.text || "";
            const priceStyle = priceEvidence.current?.style || (price ? window.getComputedStyle(price) : null);
            const oldPriceStyle = priceEvidence.old?.style || (oldPrice ? window.getComputedStyle(oldPrice) : null);
            // Everything the GLYPHS have — typography and colour — is measured on the node
            // that renders them: split number/currency markup leaves the container carrying a
            // font and a colour nobody sees. The container is still read for what belongs to
            // the box rather than to the glyphs: alignment, the bounding box, and the
            // strikethrough, which is on the container because `text-decoration-line` does not
            // inherit — the <s> knows it is struck and the leaf inside it computes to "none".
            const priceGlyphStyle = priceEvidence.current?.glyphStyle || priceStyle;
            const oldPriceGlyphStyle = priceEvidence.old?.glyphStyle || oldPriceStyle;
            const priceNumberCount = countNumberTokens(priceText);
            const oldPriceNumberCount = countNumberTokens(oldPriceText);
            const titleCandidate = findTitleWithinCard(card, cta, productUrl, [price, oldPrice]);
            const titleElement = titleCandidate?.element || null;
            const titleStyle = titleElement ? window.getComputedStyle(titleElement) : null;
            const titleText = titleCandidate?.text || "";
            const selectorScore = selectorSpecificityScore(selector, selectorIndex);
            const hasImage = hasMediaEvidence(card);
            const gridInfo = cardGridInfo.get(card) || {
              hasGridSiblings: false,
              similarSiblingCount: 0,
              siblingCandidateCount: 1,
            };
            const ctaLooksNonPurchaseLike = NON_PURCHASE_CTA_PATTERN.test(ctaMeta);
            const ctaLooksDiscountOnly = isDiscountOnlyCtaLabel(ctaText);
            const inferredPurchaseCta = Boolean(
              cta &&
                !ctaLooksNonPurchaseLike &&
                !ctaLooksDiscountOnly &&
                ctaLooksCompact &&
                (priceText || oldPriceText) &&
                (productUrl || gridInfo?.hasGridSiblings),
            );
            const ctaLooksPurchaseLike = Boolean(
              (matchesPurchaseCta(ctaMeta) || inferredPurchaseCta) &&
                !ctaLooksNonPurchaseLike &&
                !ctaLooksDiscountOnly,
            );
            // ICON-LIKE IS RESOLVED HERE, below `ctaLooksPurchaseLike`, because
            // one of its two routes reads that signal. Nothing between the
            // `ctaLooksCompact` definition above and this line consumes
            // `ctaIsIconLike`, so the move is order-only.
            //
            // TWO ROUTES TO THE SAME CONCLUSION -- "this control offers no
            // reusable text label":
            //   * the geometric one, unchanged: a small box with no usable
            //     label is an icon button;
            //   * the typographic one: a PURCHASE control whose label has zero
            //     rendered extent presents no text whatever its box measures.
            //     A round 76px buy button with `font-size: 0` and a sprite
            //     glyph is the shape this exists for; it failed the geometric
            //     route on height alone, and the variant tree then had no
            //     branch for the (isIconLike=false, hasUsableVisibleText=false)
            //     pair it fell into and abstained, shipping no variant index.
            //
            // The purchase-intent conjunct is what keeps the second route
            // narrow: a zero-extent label on a control that is not a buy
            // control says nothing about the product card's CTA repertoire.
            // NOTE the caps above are untouched -- widening 80/56, or adding an
            // aspect-ratio tolerance, would be picking numbers that separate a
            // corpus rather than naming a mechanism.
            const ctaIsIconLike = Boolean(
              cta &&
                !ctaHasUsableVisibleText &&
                (ctaLooksCompact || (ctaLooksPurchaseLike && ctaLabelHasZeroRenderedExtent)),
            );
            const ctaResolvedToIconOnly = Boolean(cta && ctaIsIconLike && !ctaHasUsableVisibleText);
            const ctaLabelNotUsable = Boolean(cta && !ctaHasUsableVisibleText);
            const homepageCtaNotReusableAsText = Boolean(
              cta &&
                ctaLooksPurchaseLike &&
                (!ctaHasUsableVisibleText || ctaIsIconLike),
            );
            const strongRepeatedProductEvidence = Boolean(
              productUrl &&
                priceText &&
                (hasImage || cta || gridInfo?.hasGridSiblings),
            );
            const looksWrapperLike = Boolean(
              !strongRepeatedProductEvidence &&
                (
                  cardText.length > 320 ||
                  cardWordCount > 52 ||
                  visibleInteractiveCount >= 10 ||
                  (cardRect.width >= window.innerWidth * 0.75 &&
                    cardRect.height >= 260 &&
                    visibleInteractiveCount >= 8) ||
                  (isGenericProductSelector(selector) && (cardText.length > 240 || visibleInteractiveCount >= 5))
                ),
            );
            // Mirror of lib/old-price-evidence.js#computePriceLooksMergedLike.
            // Two-side gate: only flag merged-like when BOTH price texts look
            // noisy (or when they're identical, which is its own merged-blob
            // signal). Previously a single-side noisy text tripped the flag,
            // which on Tailwind-style sites where every discount card had a
            // wrappery current-price field penalised every discount card and
            // pushed productCard[0] onto a non-discount card.
            const priceTextLooksNoisy = (text, numberCount) => {
              if (!text) return false;
              if ((numberCount || 0) >= 2) return true;
              if (text.length > 32) return true;
              if (text.includes("\n")) return true;
              if (/-\s*[0-9]{1,3}\s*%/.test(text)) return true;
              return false;
            };
            const priceNoisy = priceTextLooksNoisy(priceText, priceNumberCount);
            const oldNoisy = priceTextLooksNoisy(oldPriceText, oldPriceNumberCount);
            const priceLooksMergedLike = Boolean(
              (priceText && oldPriceText && priceText === oldPriceText) ||
                (priceText && oldPriceText && priceNoisy && oldNoisy) ||
                (priceText && !oldPriceText && priceNoisy) ||
                (!priceText && oldPriceText && oldNoisy),
            );
            // Quality of the strikethrough evidence captured for the old
            // price. "direct" means line-through was on the leaf element;
            // "wrapper" means it inherited from an ancestor. Boost only fires
            // for direct evidence — wrapper evidence is too easy to get
            // wrong (the walker mashed the leaf with sibling content).
            const oldPriceEvidenceQuality = priceEvidence.old
              ? (priceEvidence.old.hasDirectLineThrough || priceEvidence.old.hasDirectStrikeTag
                  ? "direct"
                  : (priceEvidence.old.hasAncestorLineThrough ? "wrapper" : "none"))
              : "none";
            const cleanOldPriceEvidence = oldPriceEvidenceQuality === "direct";
            const selectionSignals = {
              // A matched purchase control is evidence inside a card, never
              // itself an email card, even when its selector has grid peers.
              ...(card === cta && !hasImage && (!price || price === card)
                ? { supportingBoundaryEvidence: true } : {}),
              hasCurrentPrice: Boolean(priceText),
              hasOldPrice: Boolean(oldPriceText),
              hasCta: Boolean(cta),
              ctaLooksPurchaseLike,
              ctaLooksDiscountOnly,
              ctaLooksNonPurchaseLike,
              ctaPurchaseIntentInferredFromCardContext: inferredPurchaseCta,
              ctaIsFullWidth: Boolean(ctaLayout?.isFullWidth),
              ctaHasUsableVisibleText,
              ctaVisibleTextFitsControl,
              ctaLabelRecoveredFromDescendant: Boolean(ctaLabel.recoveredFromDescendant),
              ctaIsIconLike,
              ctaResolvedToIconOnly,
              ctaLabelNotUsable,
              homepageCtaNotReusableAsText,
              hasProductUrl: Boolean(productUrl),
              hasTitle: Boolean(titleText),
              hasImage,
              looksWrapperLike,
              priceLooksMergedLike,
              oldPriceEvidenceQuality,
              cleanOldPriceEvidence,
              priceRecoveredFromText: Boolean(priceText && !price),
              oldPriceRecoveredFromText: Boolean(oldPriceText && !oldPrice),
              visibleInteractiveCount,
              selectorSpecificityScore: selectorScore,
              hasGridSiblings: gridInfo.hasGridSiblings,
              similarSiblingCount: gridInfo.similarSiblingCount,
              siblingCandidateCount: gridInfo.siblingCandidateCount,
              recoveredByLazyGridRetry: Boolean(activeRecoveryContext?.usedLazyGridRetry),
              recoveredByEndpointAssistedRetry: Boolean(activeRecoveryContext?.usedEndpointAssistedRetry),
            };
            const representativeScore =
              (selectionSignals.hasCurrentPrice ? 6 : 0) +
              (selectionSignals.hasOldPrice ? 1 : 0) +
              (selectionSignals.hasTitle ? 5 : 0) +
              (selectionSignals.hasImage ? 3 : 0) +
              (selectionSignals.hasGridSiblings ? 4 : 0) +
              (selectionSignals.hasCta ? 7 : 0) +
              (selectionSignals.ctaLooksPurchaseLike ? 8 : 0) +
              (selectionSignals.ctaHasUsableVisibleText ? 3 : 0) +
              (selectionSignals.hasProductUrl ? 3 : 0) +
              (selectionSignals.homepageCtaNotReusableAsText ? 2 : 0) +
              // +6 boost when the old-price strikethrough was captured DIRECTLY
              // on the leaf element (not just inherited from an ancestor cascade).
              // Rewards rows with proper old-price evidence and offsets the
              // priceLooksMergedLike penalty for sites where some discount cards
              // have a clean leaf and others have a wrappery match.
              (selectionSignals.cleanOldPriceEvidence ? 6 : 0) +
              selectorScore -
              (selectionSignals.ctaLooksNonPurchaseLike ? 10 : 0) -
              (selectionSignals.looksWrapperLike ? 12 : 0) -
              (selectionSignals.priceLooksMergedLike ? 8 : 0);
            const badgeSummary = badgeSummaryForCard(card, cardText);
            const metaSummary = metaSummaryForCard(card, cardText);

            const row = {
              selector,
              matchIndex: index,
              tag: card.tagName.toLowerCase(),
              text: cardText.slice(0, 220),
              productUrl,
              // Per-row text-align signals for title + price. Surfaced as
              // top-level row fields (rather than buried under title/price)
              // so the deterministic aggregator in
              // lib/product-card-content-align.js can vote without re-deriving
              // them. `normalizedAlignment` maps the computed style to
              // "left" | "center" | "right" | "unknown". Missing element ⇒ null.
              titleTextAlign: titleStyle ? normalizedAlignment(titleStyle.textAlign) : null,
              priceTextAlign: priceStyle ? normalizedAlignment(priceStyle.textAlign) : null,
              title: titleElement
                ? {
                    text: titleText,
                    color: toHex(titleStyle.color),
                    ...readTypographyStyle(titleStyle),
                    alignment: normalizedAlignment(titleStyle.textAlign),
                    maxLines: titleMaxLinesFor(titleElement, titleStyle),
                  }
                : null,
              badges: badgeSummary,
              meta: metaSummary,
              card: {
                backgroundColor: toHex(cardStyle.backgroundColor),
                // The measurement state beside the hex, as the CTA colours
                // carry it: a card drawn straight on the page background is
                // `transparent` (a value the variant signature may compare),
                // not `unavailable` (the one reading the absorb may treat as
                // "never measured"). See `measureColor`.
                backgroundColorState: measureColor(cardStyle.backgroundColor).state,
                backgroundImage: cardStyle.backgroundImage,
                borderColor: border.borderColor,
                borderWidth: border.borderWidth,
                borderStyle: border.borderStyle,
                borderRadius: Number.parseFloat(cardStyle.borderRadius) || 0,
                // boxShadow carries visible tile chrome that
                // border/radius alone don't capture. Modern card
                // templates often render their boundary via shadow
                // rather than a literal border; without this signal
                // a tile-using brand collapses into the same
                // {bg:white, border:0, radius:0} shape as a bare
                // brand and the downstream email renders both
                // identically. Pass through the resolved CSS string
                // (CSS guarantees "none" or a valid shadow); the
                // compiler defaults to "none" when absent so the
                // customise pipeline always has a definite override.
                boxShadow: typeof cardStyle.boxShadow === "string"
                  ? cardStyle.boxShadow
                  : null,
              },
              // Carry x/y/width/height for price + oldPrice so the
              // deterministic aggregator in
              // lib/product-card-old-price-position.js can vote on
              // `productCard[0].oldPricePosition` without re-running the
              // browser. DOMRect doesn't JSON-serialize cleanly, so we
              // shallow-copy the four numeric edges we need. Null when
              // the price was text-recovered (no DOM element to measure).
              price: {
                selector: priceEvidence.current?.selector || priceMatch.selector,
                text: priceText,
                // One record describes ONE node. Colour is read off the same node the
                // typography below is read off — the one drawing the glyphs — because a
                // record that mixes them describes something nobody can see: the split-span
                // card emitted the digit leaf's 32px/700 wearing the wrapper's grey, and the
                // wrapper is invisible precisely because the leaf covers it. Gaining a value
                // here can promote a row to evidenceQuality medium (`priceColorPresent`,
                // extraction-pass-helpers), which is another reason it must be the real one.
                color: priceGlyphStyle ? toHex(priceGlyphStyle.color) : null,
                // State beside the hex, same contract as `card.backgroundColorState`.
                // No price node is `unavailable`: nothing was read.
                colorState: priceGlyphStyle ? measureColor(priceGlyphStyle.color).state : "unavailable",
                textSource: priceEvidence.current?.source || "none",
                ...(priceGlyphStyle ? readTypographyStyle(priceGlyphStyle) : {}),
                textDecoration: priceStyle?.textDecorationLine || priceStyle?.textDecoration || null,
                boundingBox: price ? rectToBoundingBox(price.getBoundingClientRect()) : null,
              },
              oldPrice: {
                selector: priceEvidence.old?.selector || oldPriceMatch.selector,
                text: oldPriceText,
                color: oldPriceGlyphStyle ? toHex(oldPriceGlyphStyle.color) : null,
                textSource: priceEvidence.old?.source || "none",
                ...(oldPriceGlyphStyle ? readTypographyStyle(oldPriceGlyphStyle) : {}),
                textDecoration: oldPriceStyle?.textDecorationLine || oldPriceStyle?.textDecoration || null,
                boundingBox: oldPrice ? rectToBoundingBox(oldPrice.getBoundingClientRect()) : null,
              },
              cta: cta
                ? {
                    selector: ctaMatch.selector,
                    text: ctaText,
                    textSource: ctaLabel.source || "inner-text",
                    labelExtentPx: ctaLabelExtentPx,
                    hasInlineIcon: typeof probeHelpers.measureCtaHasInlineIcon === "function"
                      ? probeHelpers.measureCtaHasInlineIcon(cta, ctaHasUsableVisibleText) : null,
                    backgroundColor: ctaBgMeasure.hex,
                    fontColor: ctaFontMeasure.hex,
                    borderColor: ctaBorderMeasure.hex,
                    backgroundColorState: ctaBgMeasure.state,
                    fontColorState: ctaFontMeasure.state,
                    borderColorState: ctaBorderMeasure.state,
                    borderWidth: Number.parseFloat(ctaStyle.borderWidth) || 0,
                    borderRadius: Number.parseFloat(ctaStyle.borderRadius) || 0,
                    resolvedFrom: ctaMatch.resolvedFrom,
                    ...readTypographyStyle(ctaStyle),
                    layout: ctaLayout,
                    padding: {
                      left: Number.parseFloat(ctaStyle.paddingLeft) || 0,
                      right: Number.parseFloat(ctaStyle.paddingRight) || 0,
                      top: Number.parseFloat(ctaStyle.paddingTop) || 0,
                      bottom: Number.parseFloat(ctaStyle.paddingBottom) || 0,
                    },
                  }
                : null,
              selectionSignals: {
                ...selectionSignals,
                representativeScore,
              },
              recoverySignals: {
                phase: activeRecoveryContext?.phase || "initial",
                cardsLikelyLazyLoaded: Boolean(activeRecoveryContext?.cardsLikelyLazyLoaded),
                recoveryAttempted: Boolean(
                  activeRecoveryContext?.usedLazyGridRetry ||
                    activeRecoveryContext?.usedEndpointAssistedRetry ||
                    activeRecoveryContext?.usedDomMinedSelectorRetry,
                ),
                recoverySource: activeRecoveryContext?.phase || "initial",
                noVisibleRows: Boolean(activeRecoveryContext?.noVisibleRows),
                selectorsMatchedButSurfaceInvisible: Boolean(
                  activeRecoveryContext?.selectorsMatchedButSurfaceInvisible,
                ),
                captureEvidenceUsed: Boolean(activeRecoveryContext?.captureEvidenceUsed),
                usedLazyGridRetry: Boolean(activeRecoveryContext?.usedLazyGridRetry),
                usedEndpointAssistedRetry: Boolean(activeRecoveryContext?.usedEndpointAssistedRetry),
                usedDomMinedSelectorRetry: Boolean(activeRecoveryContext?.usedDomMinedSelectorRetry),
                usedCardHoverRetry: Boolean(activeRecoveryContext?.usedCardHoverRetry),
                visibleRetryMatchedSelector: activeRecoveryContext?.visibleRetryMatchedSelector || "",
                visibleRetryCount: Number.isInteger(activeRecoveryContext?.visibleRetryCount)
                  ? activeRecoveryContext.visibleRetryCount
                  : null,
                domProductEvidenceDetected: Boolean(activeRecoveryContext?.domProductEvidenceDetected),
                domMinedSelectorCount: Number.isInteger(activeRecoveryContext?.domMinedSelectorCount)
                  ? activeRecoveryContext.domMinedSelectorCount
                  : 0,
                endpointCandidateUrl: activeRecoveryContext?.endpointCandidateUrl || "",
                endpointMatchedUrl: activeRecoveryContext?.endpointMatchedUrl || "",
                endpointResponseStatus: Number.isInteger(activeRecoveryContext?.endpointResponseStatus)
                  ? activeRecoveryContext.endpointResponseStatus
                  : null,
                failureSignals: Array.isArray(activeRecoveryContext?.failureSignals)
                  ? activeRecoveryContext.failureSignals.slice(0, 6)
                  : [],
              },
            };
            rows.push(row);
            rowNodes.set(row, card);
            // Keep node identity until nested boundaries have been resolved.
            // Ancillary text and controls belong to a product, not its spine.
            {
              const titleLink = titleElement?.closest("a[href]");
              rowEvidence.set(row, {
                spine: [titleElement, price, oldPrice, cta],
                media: [...card.querySelectorAll("img, picture, video, source")],
                controls: [...card.querySelectorAll(INTERACTIVE_SELECTOR)].filter(isVisible),
                backgroundImage: cardStyle.backgroundImage,
                titleUrl: titleLink ? titleLink.href : "",
              });
            }
          });
        }
        rows.sort((left, right) => {
          const leftScore = left.selectionSignals?.representativeScore || 0;
          const rightScore = right.selectionSignals?.representativeScore || 0;
          if (rightScore !== leftScore) {
            return rightScore - leftScore;
          }
          return left.matchIndex - right.matchIndex;
        });
        // Selector-specific grid/quality evidence can differ for the exact
        // same element. Retain its strongest coherent row before resolving
        // nested boundaries, using the existing stable ranking above.
        const representativeByNode = new Map();
        for (const row of rows) {
          const node = rowNodes.get(row);
          if (!representativeByNode.has(node)) representativeByNode.set(node, row);
        }
        const replacement = new Map();
        const candidates = [...representativeByNode.values()].filter(row => {
          const [title,price,,cta] = rowEvidence.get(row).spine;
          return title && title !== rowNodes.get(row) && (price || cta) &&
            !row.selectionSignals.looksWrapperLike && !row.selectionSignals.priceLooksMergedLike;
        });
        const contains = (outer, inner) => rowNodes.get(outer).contains(rowNodes.get(inner));
        const sharedSpine = (left, right) => rowEvidence.get(left).spine.every((node, index) =>
          node === rowEvidence.get(right).spine[index]);
        // A wrapper containing two independent product cores is never a card,
        // even when the products have identical URLs, text and prices.
        const independentNodes = (a,b) => a && b && a !== b && !a.contains(b) && !b.contains(a);
        const multiCore = new Set(candidates.filter(outer => candidates.some(inner =>
          outer !== inner && contains(outer, inner) &&
          rowEvidence.get(outer).spine[0] !== rowEvidence.get(inner).spine[0] &&
          !rowEvidence.get(outer).spine[0].contains(rowEvidence.get(inner).spine[0]) &&
          !rowEvidence.get(inner).spine[0].contains(rowEvidence.get(outer).spine[0]) &&
          ![1,3].some(index => rowEvidence.get(outer).spine[index] &&
            rowEvidence.get(outer).spine[index] === rowEvidence.get(inner).spine[index]) &&
          (independentNodes(rowEvidence.get(outer).spine[1],rowEvidence.get(inner).spine[1]) ||
            (outer.selectionSignals.ctaLooksPurchaseLike && inner.selectionSignals.ctaLooksPurchaseLike &&
              independentNodes(rowEvidence.get(outer).spine[3],rowEvidence.get(inner).spine[3]))))));
        const hasPaintedSurface = row =>
          row.card.backgroundColorState !== "transparent" ||
          row.card.borderWidth !== 0 || row.card.boxShadow !== "none" ||
          rowEvidence.get(row).backgroundImage !== "none";
        const supportedBody = row => rowEvidence.get(row).backgroundImage === "none" &&
          row.card.backgroundColorState !== "unavailable" &&
          (row.card.borderWidth === 0 || Boolean(row.card.borderColor)) &&
          (row.card.backgroundColorState === "measured" || row.card.borderWidth > 0);
        const sameFamily = (outer, inner) => {
          if (!contains(outer, inner) || !sharedSpine(outer, inner)) return false;
          const core = rowEvidence.get(inner);
          const evidence = rowEvidence.get(outer);
          const titleUrl = core.titleUrl || inner.productUrl;
          // A semantic second title/price outside the shared core is evidence
          // of another product even if its card was not a supplied selector.
          const semantic = [...rowNodes.get(outer).querySelectorAll(
            "h1,h2,h3,h4,h5,h6,[itemprop='name'],[class*='title'],[class*='name']")].filter(isVisible);
          if (semantic.some(node => !rowNodes.get(inner).contains(node) &&
            !node.contains(core.spine[0]) && normalize(node.textContent) &&
            !node.closest(INTERACTIVE_SELECTOR))) return false;
          return evidence.controls.every(node => {
            if (rowNodes.get(inner).contains(node) || node.contains(rowNodes.get(inner))) return true;
            const meta = [node.textContent, node.getAttribute("aria-label"), node.title,
              node.className, node.id].join(" ");
            if (NON_PURCHASE_CTA_PATTERN.test(meta) && !matchesPurchaseCta(meta)) return true;
            const linkText = normalize(node.textContent);
            if (!node.matches("a[href]") || !titleUrl ||
                (linkText && !isDiscountOnlyCtaLabel(linkText)) ||
                !evidence.media.some(media => node.contains(media))) return false;
            try { return node.href === new URL(titleUrl, document.baseURI).href; }
            catch { return false; }
          });
        };
        const resolved = new Set();
        // Start outside and resolve an entire chain together; a middle row
        // that omits a sibling image must not become a transitive winner.
        const outerFirst = candidates.filter(row => !multiCore.has(row)).sort((a,b) =>
          contains(a,b) ? -1 : contains(b,a) ? 1 : 0);
        for (const outer of outerFirst) {
          if (resolved.has(outer)) continue;
          const family = outerFirst.filter(inner => !resolved.has(inner) &&
            (inner === outer || sameFamily(outer, inner)));
          if (family.length < 2) continue;
          const media = [...new Set(family.flatMap(row => rowEvidence.get(row).media))];
          const complete = family.filter(row => media.every(node => rowNodes.get(row).contains(node)));
          // Within one proven physical family choose an intact supported body.
          // A shadow-only enclosing decoration does not outrank that body.
          const bodies = complete.filter(supportedBody);
          const choices = bodies.length ? bodies : complete.filter(hasPaintedSurface);
          const canonical = choices.length ? choices.reduce((best,row) => contains(best,row) ? row : best) : complete[0];
          if (!canonical) continue;
          for (const row of family) {
            resolved.add(row);
            replacement.set(row, canonical);
            const uniqueAncillaryEvidence = row !== canonical && (
              row.text !== canonical.text || rowEvidence.get(row).controls.some(node =>
                !rowNodes.get(canonical).contains(node) && !node.contains(rowNodes.get(canonical)))
            );
            if (row !== canonical && (hasPaintedSurface(row) || uniqueAncillaryEvidence)) {
              row.selectionSignals.supportingBoundaryEvidence = true;
            }
          }
        }
        // A price/action-only descendant can have no valid title and thus
        // cannot enter the complete-card family. Exact owned nodes plus a
        // complete containing product still prove it is supporting evidence.
        for (const fragment of representativeByNode.values()) {
          const [title,price,oldPrice,cta] = rowEvidence.get(fragment).spine;
          if (title || fragment.selectionSignals.hasImage) continue;
          const owner = candidates.find(outer => outer !== fragment && !multiCore.has(outer) && contains(outer,fragment) &&
            (outer.selectionSignals.hasImage || (rowEvidence.get(outer).spine[1] && rowEvidence.get(outer).spine[3])) &&
            (price || cta) && [price,oldPrice].every(node => !node ||
              rowEvidence.get(outer).spine.slice(1,3).includes(node)) &&
            (!cta || cta === rowEvidence.get(outer).spine[3]));
          if (owner) fragment.selectionSignals.supportingBoundaryEvidence = true;
        }
        const emitted = new Set();
        return rows.flatMap((row) => {
          const representative = representativeByNode.get(rowNodes.get(row));
          if (multiCore.has(representative)) return [];
          if (row === representative && row.selectionSignals.supportingBoundaryEvidence) {
            if (emitted.has(row)) return [];
            emitted.add(row);
            return [row];
          }
          let canonical = representative;
          const visited = new Set();
          while (replacement.has(canonical) && !visited.has(canonical)) {
            visited.add(canonical);
            canonical = replacement.get(canonical);
          }
          if (emitted.has(canonical)) return [];
          emitted.add(canonical);
          return [canonical];
        }).sort((a,b) => Number(Boolean(a.selectionSignals.supportingBoundaryEvidence)) - Number(Boolean(b.selectionSignals.supportingBoundaryEvidence)));
      },
      {
        selectors: activeSelectors,
        priceSelectors: normalizedArgs.priceSelectors,
        oldPriceSelectors: normalizedArgs.oldPriceSelectors,
        ctaSelectors: normalizedArgs.ctaSelectors,
        recoveryContext,
      },
    );
  }

  let effectiveCapturePayload = isPlainObject(capturePayload) ? capturePayload : null;
  let effectiveCapturePath = capturePath || "";
  if (!effectiveCapturePayload) {
    const nearbyCapture = await loadNearbyCaptureMetadata(args);
    effectiveCapturePayload = nearbyCapture.payload;
    effectiveCapturePath = nearbyCapture.capturePath;
  }

  const homepageDataCandidates = homepageDataCandidatesFromCapture(effectiveCapturePayload, page.url());
  const recoverySummary = {
    capturePath: effectiveCapturePayload ? effectiveCapturePath : "",
    captureEvidenceUsed: Boolean(effectiveCapturePayload),
    homepageDataCandidates: homepageDataCandidates.slice(0, 6),
    domMinedSelectorRecovery: {
      attempted: false,
      domProductEvidenceDetected: false,
      priceNodeCount: 0,
      minedSelectorCount: 0,
      minedSelectors: [],
      selectorCandidates: [],
      durationMs: 0,
      error: null,
    },
    attempts: [],
    failureSignals: [],
  };
  let result = await collectRows({
    phase: "initial",
    captureEvidenceUsed: Boolean(effectiveCapturePayload),
    usedLazyGridRetry: false,
    usedEndpointAssistedRetry: false,
    failureSignals: recoverySummary.failureSignals,
  });
  const initialAttempt = summarizeAttempt("initial", result);
  recoverySummary.attempts.push(initialAttempt);
  let bestResult = Array.isArray(result) ? result : [];
  let bestAttempt = initialAttempt;

  function preserveBestAttempt(candidateRows, candidateAttempt) {
    if (attemptQualityScore(candidateAttempt) > attemptQualityScore(bestAttempt)) {
      bestResult = Array.isArray(candidateRows) ? candidateRows : [];
      bestAttempt = candidateAttempt;
    }
  }

  async function hoverLikelyProductCards(candidateRows, { maxRows = 3, hoverTimeoutMs = 1200, settleMs = HOVER_TRANSITION_SETTLE_MS } = {}) {
    const candidates = (Array.isArray(candidateRows) ? candidateRows : [])
      .filter((row) =>
        !row?.selectionSignals?.supportingBoundaryEvidence &&
        row?.selector &&
        Number.isInteger(row?.matchIndex) &&
        !row?.selectionSignals?.hasCta &&
        (
          row?.selectionSignals?.hasProductUrl ||
          row?.selectionSignals?.hasImage ||
          row?.selectionSignals?.hasTitle ||
          row?.selectionSignals?.hasGridSiblings
        )
      )
      .sort((left, right) =>
        (right.selectionSignals?.representativeScore || 0) -
        (left.selectionSignals?.representativeScore || 0)
      )
      .slice(0, maxRows);
    const hovered = [];
    let overlayCheckedBeforeFirstHover = false;
    for (const row of candidates) {
      try {
        const locator = page.locator(row.selector).nth(row.matchIndex);
        if (!(await locator.isVisible().catch(() => false))) continue;
        await locator.scrollIntoViewIfNeeded({ timeout: hoverTimeoutMs }).catch(() => {});
        if (overlay && !overlayCheckedBeforeFirstHover) {
          // lib/overlay-dismissal.js: clear whatever covers the first card
          // before hovering it (a modal that opened after settle covers the
          // grid exactly as it covers the buttons).
          overlayCheckedBeforeFirstHover = true;
          await overlay.clearFor(locator);
        }
        await locator.hover({ timeout: hoverTimeoutMs, trial: false });
        await page.waitForTimeout(settleMs).catch(() => {});
        hovered.push({ selector: row.selector, matchIndex: row.matchIndex });
      } catch {
        // Best-effort recovery; leave status evidence to the attempt summary.
      }
    }
    return hovered;
  }

  if (!result.length) {
    addFailureSignal(recoverySummary, "no-visible-cards-in-initial-dom");
  } else if (!result.some(isFallbackRepresentativeRow)) {
    addFailureSignal(recoverySummary, "initial-cards-missing-price-or-cta");
  } else if (!result.some(isPurchaseRepresentativeRow)) {
    addFailureSignal(recoverySummary, "initial-representative-cta-not-purchase-like");
  }

  if (needsRecovery(result)) {
    await runControlledLazyScroll(page, args.timeoutMs);
    const visibleRetry = await waitForAnyVisibleSelector(page, normalizedArgs.selectors);
    const cardsLikelyLazyLoaded = Boolean(!result.length || visibleRetry.visibleCount > 0);
    const selectorsMatchedButSurfaceInvisible = Boolean(result.length > 0 && !visibleRetry.visibleCount);
    if (!visibleRetry.visibleCount) {
      addFailureSignal(recoverySummary, "lazy-grid-scroll-retry-found-no-visible-cards");
    }
    result = await collectRows({
      phase: "lazy-grid-scroll-retry",
      captureEvidenceUsed: Boolean(effectiveCapturePayload),
      usedLazyGridRetry: true,
      usedEndpointAssistedRetry: false,
      cardsLikelyLazyLoaded,
      noVisibleRows: visibleRetry.visibleCount === 0,
      selectorsMatchedButSurfaceInvisible,
      visibleRetryMatchedSelector: visibleRetry.matchedSelector,
      visibleRetryCount: visibleRetry.visibleCount,
      failureSignals: recoverySummary.failureSignals,
    });
    const lazyGridAttempt = summarizeAttempt("lazy-grid-scroll-retry", result, {
      cardsLikelyLazyLoaded,
      selectorsMatchedButSurfaceInvisible,
      visibleRetryMatchedSelector: visibleRetry.matchedSelector,
      visibleRetryCount: visibleRetry.visibleCount,
    });
    recoverySummary.attempts.push(lazyGridAttempt);
    preserveBestAttempt(result, lazyGridAttempt);
  }

  if (needsRecovery(result)) {
    const minedSelectors = await deriveDomMinedProductCardSelectors();
    recoverySummary.domMinedSelectorRecovery = {
      attempted: true,
      domProductEvidenceDetected: minedSelectors.domProductEvidenceDetected,
      priceNodeCount: minedSelectors.priceNodeCount,
      minedSelectorCount: minedSelectors.selectors.length,
      minedSelectors: minedSelectors.selectors,
      selectorCandidates: minedSelectors.selectorCandidates,
      durationMs: minedSelectors.durationMs,
      error: minedSelectors.error,
    };
    if (minedSelectors.error) {
      addFailureSignal(recoverySummary, "dom-mined-selector-retry-failed");
    } else if (minedSelectors.domProductEvidenceDetected && !minedSelectors.selectors.length) {
      addFailureSignal(recoverySummary, "dom-product-evidence-without-stable-card-selector");
    }
    if (minedSelectors.selectors.length) {
      result = await collectRows(
        {
          phase: "dom-mined-selector-retry",
          captureEvidenceUsed: Boolean(effectiveCapturePayload),
          usedLazyGridRetry: true,
          usedEndpointAssistedRetry: false,
          usedDomMinedSelectorRetry: true,
          cardsLikelyLazyLoaded: true,
          noVisibleRows: false,
          selectorsMatchedButSurfaceInvisible: false,
          domProductEvidenceDetected: minedSelectors.domProductEvidenceDetected,
          domMinedSelectorCount: minedSelectors.selectors.length,
          failureSignals: recoverySummary.failureSignals,
        },
        minedSelectors.selectors,
      );
      const domMinedAttempt = summarizeAttempt("dom-mined-selector-retry", result, {
        cardsLikelyLazyLoaded: true,
        selectorsMatchedButSurfaceInvisible: false,
        domProductEvidenceDetected: minedSelectors.domProductEvidenceDetected,
        domMinedSelectorCount: minedSelectors.selectors.length,
      });
      if (!result.length) {
        addFailureSignal(recoverySummary, "dom-mined-selector-retry-found-no-visible-cards");
      } else if (!result.some(isFallbackRepresentativeRow)) {
        addFailureSignal(recoverySummary, "dom-mined-selector-retry-missing-price-or-cta");
      } else if (!result.some(isPurchaseRepresentativeRow)) {
        addFailureSignal(recoverySummary, "dom-mined-selector-retry-cta-not-purchase-like");
      }
      recoverySummary.attempts.push(domMinedAttempt);
      preserveBestAttempt(result, domMinedAttempt);
    }
  }

  if (needsRecovery(result) && Array.isArray(result) && result.length > 0) {
    const hoveredRows = await hoverLikelyProductCards(result);
    if (!hoveredRows.length) {
      addFailureSignal(recoverySummary, "card-hover-retry-found-no-hoverable-cards");
    } else {
      result = await collectRows({
        phase: "card-hover-retry",
        captureEvidenceUsed: Boolean(effectiveCapturePayload),
        usedLazyGridRetry: true,
        usedEndpointAssistedRetry: false,
        usedDomMinedSelectorRetry: recoverySummary.domMinedSelectorRecovery?.attempted || false,
        usedCardHoverRetry: true,
        cardsLikelyLazyLoaded: true,
        noVisibleRows: false,
        selectorsMatchedButSurfaceInvisible: false,
        hoveredRowCount: hoveredRows.length,
        failureSignals: recoverySummary.failureSignals,
      });
      const hoverAttempt = summarizeAttempt("card-hover-retry", result, {
        cardsLikelyLazyLoaded: true,
        hoveredRowCount: hoveredRows.length,
      });
      if (!result.length) {
        addFailureSignal(recoverySummary, "card-hover-retry-found-no-visible-cards");
      } else if (!result.some(isFallbackRepresentativeRow)) {
        addFailureSignal(recoverySummary, "card-hover-retry-missing-price-or-cta");
      } else if (!result.some(isPurchaseRepresentativeRow)) {
        addFailureSignal(recoverySummary, "card-hover-retry-cta-not-purchase-like");
      }
      recoverySummary.attempts.push(hoverAttempt);
      preserveBestAttempt(result, hoverAttempt);
    }
  }

  if (shouldAttemptEndpointAssistedRetry(result)) {
    if (!homepageDataCandidates.length) {
      addFailureSignal(recoverySummary, "no-capture-homepage-data-candidates");
    } else {
      const candidateWait = waitForHomepageDataCandidate(page, homepageDataCandidates);
      try {
        await page.reload({
          waitUntil: args.waitUntil,
          timeout: args.timeoutMs,
        });
        await page.waitForLoadState("networkidle", { timeout: Math.min(args.timeoutMs, 4500) }).catch(() => {});
      } catch {
        addFailureSignal(recoverySummary, "endpoint-assisted-reload-failed");
      }
      await runControlledLazyScroll(page, args.timeoutMs);
      const matchedCandidate = await candidateWait;
      const cardsLikelyLazyLoaded = true;
      if (!matchedCandidate) {
        addFailureSignal(recoverySummary, "capture-endpoint-candidate-did-not-refire");
      }
      const visibleRetry = await waitForAnyVisibleSelector(page, normalizedArgs.selectors);
      const selectorsMatchedButSurfaceInvisible = Boolean(result.length > 0 && !visibleRetry.visibleCount);
      result = await collectRows({
        phase: "endpoint-assisted-retry",
        captureEvidenceUsed: Boolean(effectiveCapturePayload),
        usedLazyGridRetry: true,
        usedEndpointAssistedRetry: true,
        cardsLikelyLazyLoaded,
        noVisibleRows: visibleRetry.visibleCount === 0,
        selectorsMatchedButSurfaceInvisible,
        visibleRetryMatchedSelector: visibleRetry.matchedSelector,
        visibleRetryCount: visibleRetry.visibleCount,
        endpointCandidateUrl: homepageDataCandidates[0]?.url || "",
        endpointMatchedUrl: matchedCandidate?.url || "",
        endpointResponseStatus: matchedCandidate?.status ?? null,
        failureSignals: recoverySummary.failureSignals,
      });
      const endpointAttempt = summarizeAttempt("endpoint-assisted-retry", result, {
        cardsLikelyLazyLoaded,
        selectorsMatchedButSurfaceInvisible,
        visibleRetryMatchedSelector: visibleRetry.matchedSelector,
        visibleRetryCount: visibleRetry.visibleCount,
        endpointCandidateUrl: homepageDataCandidates[0]?.url || "",
        endpointMatchedUrl: matchedCandidate?.url || "",
        endpointResponseStatus: matchedCandidate?.status ?? null,
      });
      recoverySummary.attempts.push(endpointAttempt);
      preserveBestAttempt(result, endpointAttempt);
    }
  }

  const finalRows = Array.isArray(bestResult) ? bestResult : [];

  if (needsRecovery(finalRows)) {
    addFailureSignal(recoverySummary, "recovery-exhausted-without-representative-card");
  }

  const selectedRepresentativeRow = finalRows.length
    ? finalRows.find(isPurchaseRepresentativeRow) || finalRows.find(isFallbackRepresentativeRow) || null
    : null;

  await captureProductCardCtaHoverStates(page, finalRows.filter(row => !row.selectionSignals?.supportingBoundaryEvidence), selectedRepresentativeRow, { overlay });

  const compactRepresentativeRow = selectedRepresentativeRow
    ? {
        selector: selectedRepresentativeRow.selector,
        matchIndex: selectedRepresentativeRow.matchIndex,
        productUrl: selectedRepresentativeRow.productUrl,
        title: selectedRepresentativeRow.title,
        price: selectedRepresentativeRow.price,
        oldPrice: selectedRepresentativeRow.oldPrice,
        cta: selectedRepresentativeRow.cta,
        card: selectedRepresentativeRow.card,
        selectionSignals: selectedRepresentativeRow.selectionSignals,
        recoverySignals: selectedRepresentativeRow.recoverySignals,
      }
    : null;

  recoverySummary.bestAttempt = bestAttempt;
  recoverySummary.bestPhase = bestAttempt?.phase || "initial";
  recoverySummary.finalRowCount = finalRows.length;
  recoverySummary.finalRepresentativeRowCount = finalRows.filter(isFallbackRepresentativeRow).length;
  recoverySummary.finalPurchaseRepresentativeRowCount = finalRows.length
    ? finalRows.filter(isPurchaseRepresentativeRow).length
    : 0;
  recoverySummary.finalPurchaseCandidateRowCount = finalRows.length
    ? finalRows.filter(isPurchaseCandidateRow).length
    : 0;
  recoverySummary.finalHomepageCtaNotReusableCandidateRowCount = finalRows.length
    ? finalRows.filter(isHomepageCtaNotReusableCandidateRow).length
    : 0;
  recoverySummary.finalPhase = recoverySummary.attempts.at(-1)?.phase || "initial";
  recoverySummary.selectedRepresentativeRow = compactRepresentativeRow;
  // Aggregate the per-row title/price text-align signals across the
  // representative rows. Surfaced here so the agent (and the assembly
  // diagnostics that read product-card-styles.recovery.json) can see the
  // dominant signal without re-running the aggregator. The contract is
  // intentionally conservative — see lib/product-card-content-align.js —
  // and falls back to `null` when evidence is thin or mixed.
  const representativeRowsForAlign = finalRows.filter(isFallbackRepresentativeRow);
  recoverySummary.dominantContentAlign = aggregateContentAlign(representativeRowsForAlign);
  recoverySummary.summary = {
    bestPhase: recoverySummary.bestPhase,
    hasRepresentativeRow: Boolean(finalRows.some(isFallbackRepresentativeRow)),
    hasPurchaseLikeRepresentative: Boolean(finalRows.some(isPurchaseRepresentativeRow)),
    purchaseCandidateRowCount: finalRows.filter(isPurchaseCandidateRow).length,
    homepageCtaNotReusableCandidateRowCount: finalRows.filter(isHomepageCtaNotReusableCandidateRow).length,
    homepageCtaNotReusableAsText: Boolean(
      selectedRepresentativeRow?.selectionSignals?.homepageCtaNotReusableAsText
    ),
    selectedCtaLooksPurchaseLike: Boolean(selectedRepresentativeRow?.selectionSignals?.ctaLooksPurchaseLike),
    selectedCtaLooksNonPurchaseLike: Boolean(selectedRepresentativeRow?.selectionSignals?.ctaLooksNonPurchaseLike),
    selectedRowLooksWrapperLike: Boolean(selectedRepresentativeRow?.selectionSignals?.looksWrapperLike),
    selectedPriceLooksMergedLike: Boolean(selectedRepresentativeRow?.selectionSignals?.priceLooksMergedLike),
    selectedProductUrl: selectedRepresentativeRow?.productUrl || "",
    selectedCtaText: selectedRepresentativeRow?.cta?.text || "",
    dominantContentAlign: recoverySummary.dominantContentAlign,
  };
  return {
    rows: finalRows,
    recoverySummary,
  };
}

// --- Product-data harvest (product-data.json) -------------------------------
//
// New, additive collector for the demo product-data artifact. It does NOT
// touch collectProductCardStyles or any existing probe internals: it reads
// the already-collected probe rows + recovery summary, runs ONE extra
// page.evaluate (no navigation / scroll / hover / reload / fetch), and feeds
// everything through the pure pipeline in lib/product-data.js.

// Price-selector vocabulary for the in-page product-data extraction. Mirrors
// DEFAULT_PRICE_SELECTORS / DEFAULT_OLD_PRICE_SELECTORS in homepage-pass.js
// (which owns the probe defaults; lib.js cannot import from the entry
// script) plus generic strike markup for old prices.
const PRODUCT_DATA_PRICE_SELECTORS = [
  ".price",
  "[class*='price']",
  "[class*='Price']",
  "[data-price]",
  ".sum",
  "[class*='sum']",
  "[class*='Sum']",
  "[class*='cost']",
  "[class*='Cost']",
  "[class*='amount']",
  "[class*='Amount']",
];
const PRODUCT_DATA_OLD_PRICE_SELECTORS = [
  ".old-price",
  "[class*='old-price']",
  "[class*='oldPrice']",
  "[class*='OldPrice']",
  "[class*='was-price']",
  "[class*='strikethrough']",
  "[class*='strike-through']",
  "[class*='strike']",
  "[class*='line-through']",
  "[class*='lineThrough']",
  "[class*='compare-at']",
  "[class*='compareAt']",
  "[class*='comparePrice']",
  "[class*='regular-price']",
  "[class*='regularPrice']",
  "[class*='original-price']",
  "[class*='originalPrice']",
  "[class*='price-old']",
  "[class*='price__old']",
  "[class*='priceOld']",
  "s",
  "del",
  "strike",
];
const PRODUCT_DATA_MAX_SEED_URLS = 24;
const PRODUCT_DATA_MAX_HARVEST_ANCHORS = 500;
// Hard cap on TOTAL anchors iterated (skipped-or-not) so a mega-menu page
// with thousands of nav links cannot starve the harvest loop; the 1500ms
// time budget remains the true guard.
const PRODUCT_DATA_MAX_HARVEST_ITERATIONS = 3000;
const PRODUCT_DATA_MAX_ANCESTOR_WALK = 4;
const PRODUCT_DATA_MAX_HARVEST_CANDIDATES = 24;
const PRODUCT_DATA_TIME_BUDGET_MS = 1500;
const PRODUCT_DATA_MAX_JSONLD_BYTES = 200000;
const PRODUCT_DATA_TIER1_COMPLETE_TARGET = 5;

/**
 * Collect real homepage product data for demo consumers.
 *
 * Tier 1 (always): join the probe rows' product URLs back to the live DOM to
 * add the card image, title fallbacks (anchor title / aria-label / img alt),
 * and a sup-aware price-text re-extraction (the kopiyka collapse one
 * storefront's <sup> markup produces).
 * Tier 2 (only when the harvest gate is open AND tier 1 yielded fewer than
 * 5 complete records): bounded generic anchor harvest in document order.
 */
export async function collectProductData(page, { probeRows = [], recoverySummary = null } = {}) {
  const rows = Array.isArray(probeRows) ? probeRows : [];
  const seedByUrl = new Map();
  for (const row of rows) {
    const url = typeof row?.productUrl === "string" ? row.productUrl.trim() : "";
    if (!url) continue;
    if (!seedByUrl.has(url)) {
      if (seedByUrl.size >= PRODUCT_DATA_MAX_SEED_URLS) continue;
      seedByUrl.set(url, { url, hasTitle: false, hasPrice: false });
    }
    const seed = seedByUrl.get(url);
    if (typeof row?.title?.text === "string" && row.title.text.trim()) seed.hasTitle = true;
    if (typeof row?.price?.text === "string" && row.price.text.trim()) seed.hasPrice = true;
  }
  const gateFromSummary = decideHarvestGate(recoverySummary, 0);
  const pageData = await safePageEvaluate(
    page,
    (input) => {
      const startedAt = Date.now();
      const bounds = input.bounds || {};
      const out = { jsonLdBlocks: [], domJoin: [], harvested: [], partial: false };
      const overBudget = () => Date.now() - startedAt > (bounds.timeBudgetMs || 1500);

      // Currency-anchored-price predicate, mirrors the node-side
      // CURRENCY_TOKEN_SOURCE: a letter token with letter boundaries, or a
      // bare symbol. Used to pick the smallest ancestor whose text actually
      // carries a price (so the link AND its price are both inside it).
      const CURRENCY_IN_TEXT_RE =
        /(?<![\p{L}])(?:грн\.?|uah|usd|eur|gbp|pln|zł)(?![\p{L}])|[₴$€£]/iu;
      const hasCurrencyAnchoredPrice = (el) => {
        if (!el) return false;
        // Measure RENDERED text, not source formatting: a pretty-printed
        // card blows a raw-length cap that the same card, minified, passes.
        const t = (el.textContent || "").replace(/\s+/g, " ").trim();
        if (t.length > 400) return false;
        return /\d/.test(t) && CURRENCY_IN_TEXT_RE.test(t);
      };

      const absolutize = (value) => {
        if (!value || typeof value !== "string") return "";
        try {
          const url = new URL(value, location.href);
          return url.protocol === "http:" || url.protocol === "https:" ? url.toString() : "";
        } catch {
          return "";
        }
      };

      // --- JSON-LD scan (always): raw blocks, size-capped; node side parses.
      let jsonLdBytes = 0;
      let roughJsonLdProductCount = 0;
      for (const script of document.querySelectorAll('script[type="application/ld+json"]')) {
        const text = (script.textContent || "").trim();
        if (!text) continue;
        if (jsonLdBytes + text.length > (bounds.maxJsonLdBytes || 200000)) break;
        jsonLdBytes += text.length;
        out.jsonLdBlocks.push(text);
        const typed = text.match(/"@type"\s*:\s*(?:"Product"|\[[^\]]*"Product")/g);
        if (typed) roughJsonLdProductCount += typed.length;
      }

      // Sup-aware text: a trailing <sup>/<small> 2-digit fragment after a
      // digit run is a mashed kopiyka decimal ("747<sup>97</sup>грн." →
      // "747.97грн.").
      // `marker` (optional) is a mutable sink: its `.injected` flag is set true
      // when a kopiyka decimal is actually spliced in, so the caller can tell
      // a sup-corrected price apart from a plain one.
      const supAwareText = (root, marker) => {
        if (!root) return "";
        let text = "";
        const visit = (node) => {
          if (node.nodeType === 3) {
            text += node.textContent;
            return;
          }
          if (node.nodeType !== 1) return;
          const tag = node.tagName ? node.tagName.toLowerCase() : "";
          if (tag === "script" || tag === "style") return;
          if (tag === "sup" || tag === "small") {
            const fragment = (node.textContent || "").replace(/\s+/g, "");
            if (/^\d{2}$/.test(fragment) && /\d\s*$/.test(text)) {
              text += `.${fragment}`;
              if (marker) marker.injected = true;
              return;
            }
          }
          for (const child of node.childNodes) visit(child);
        };
        visit(root);
        return text.replace(/\s+/g, " ").trim().slice(0, 200);
      };

      const largestImage = (container) => {
        let best = null;
        let bestArea = -1;
        for (const img of container.querySelectorAll("img")) {
          let source = img.currentSrc || img.src || img.getAttribute("data-src") || "";
          if (!source) {
            const srcset = img.getAttribute("srcset") || img.getAttribute("data-srcset") || "";
            source = ((srcset.split(",")[0] || "").trim().split(/\s+/)[0]) || "";
          }
          const absolute = absolutize(source);
          if (!absolute || absolute.length >= 2048 || absolute.startsWith("data:")) continue;
          const rect = img.getBoundingClientRect();
          const area = rect.width * rect.height;
          if (area > bestArea) {
            bestArea = area;
            best = {
              url: absolute,
              loaded: (img.naturalWidth || 0) > 0,
              alt: (img.getAttribute("alt") || "").slice(0, 300),
            };
          }
        }
        return best;
      };

      const priceTextsOf = (container) => {
        const result = { priceText: "", oldPriceText: "" };
        let oldNode = null;
        try {
          oldNode = container.querySelector(input.oldPriceSelector);
        } catch {
          oldNode = null;
        }
        if (oldNode) result.oldPriceText = supAwareText(oldNode);
        let inspected = 0;
        try {
          for (const node of container.querySelectorAll(input.priceSelector)) {
            inspected += 1;
            if (inspected > 10) break;
            // Skip the old-price node itself and wrappers that merge both
            // prices into one blob.
            if (oldNode && (node === oldNode || oldNode.contains(node) || node.contains(oldNode))) continue;
            const marker = { injected: false };
            result.priceText = supAwareText(node, marker);
            // Flag only when the sup-aware path actually spliced in a kopiyka
            // decimal, so merge() unshifts (prioritizes) only the corrected
            // text — otherwise the dom price stays an append-only candidate.
            if (marker.injected) result.supCorrected = true;
            break;
          }
        } catch {
          // selector engine hiccup — leave priceText empty
        }
        return result;
      };

      // Smallest ancestor (within the 4-walk budget) whose text carries a
      // currency-anchored price. Because the anchor is inside it, the link and
      // its price are co-located, so priceTextsOf/largestImage read the right
      // card. Returns null when no ancestor in budget has a price — the old
      // class-name heuristic returned the FIRST class-matching node (often a
      // sub-component like one storefront's price-less "product-tile-title") or,
      // on a class miss, a too-wide fallback (another's 12-card list, binding one bogus
      // price to every product). Class names are NOT consulted: this is purely
      // structural, so it stays general across sites.
      const cardContainerFor = (anchor) => {
        let node = anchor;
        const maxWalk = bounds.maxAncestorWalk || 4;
        for (let depth = 0; depth < maxWalk; depth += 1) {
          node = node.parentElement;
          if (!node || node === document.body || node === document.documentElement) break;
          if (hasCurrencyAnchoredPrice(node)) return node;
        }
        return null;
      };

      const anchors = document.querySelectorAll("a[href]");

      // --- Tier 1: probe-row join (always).
      const seedByAbsoluteHref = new Map();
      for (const seed of input.seeds || []) {
        const absolute = absolutize(seed.url);
        if (absolute && !seedByAbsoluteHref.has(absolute)) {
          seedByAbsoluteHref.set(absolute, { ...seed, done: false });
        }
      }
      let tier1CompleteCount = 0;
      if (seedByAbsoluteHref.size > 0) {
        let remaining = seedByAbsoluteHref.size;
        for (const anchor of anchors) {
          if (remaining <= 0) break;
          if (overBudget()) {
            out.partial = true;
            break;
          }
          const href = absolutize(anchor.getAttribute("href") || "");
          const seed = href ? seedByAbsoluteHref.get(href) : null;
          if (!seed || seed.done) continue;
          seed.done = true;
          remaining -= 1;
          const container = cardContainerFor(anchor);
          // No priced ancestor: still emit the row so the probe price/title
          // survive (append-only). Take the image from the immediate parent so
          // a storefront's empty-probe-title products keep an image and complete-first
          // selection keeps them. Prices stay empty → probe value wins.
          const image = container
            ? largestImage(container)
            : largestImage(anchor.parentElement || anchor);
          const prices = container
            ? priceTextsOf(container)
            : { priceText: "", oldPriceText: "" };
          out.domJoin.push({
            url: seed.url,
            imageUrl: image ? image.url : "",
            imageLoaded: image ? image.loaded : false,
            priceText: prices.priceText,
            oldPriceText: prices.oldPriceText,
            supCorrected: prices.supCorrected === true,
            titleAttr: (anchor.getAttribute("title") || "").slice(0, 300),
            ariaLabel: (anchor.getAttribute("aria-label") || "").slice(0, 300),
            imgAlt: image ? image.alt : "",
          });
          if (seed.hasTitle && seed.hasPrice && image) tier1CompleteCount += 1;
        }
      }

      // --- Tier 2: generic anchor harvest, only when the gate is open and
      // tier 1 did not already produce enough complete records.
      out.roughJsonLdProductCount = roughJsonLdProductCount;
      const gateOpen = Boolean(input.gateOpenFromSummary) || roughJsonLdProductCount >= 1;
      if (gateOpen && tier1CompleteCount < (bounds.tier1CompleteTarget || 5)) {
        const seenHrefs = new Set(seedByAbsoluteHref.keys());
        // `examined` counts only anchors OUTSIDE skipped (nav/header/footer)
        // subtrees so mega-menus cannot eat the 500-anchor budget; `iterated`
        // is the hard cap on total loop work either way.
        let iterated = 0;
        let examined = 0;
        let accepted = 0;
        for (const anchor of anchors) {
          if (iterated >= (bounds.maxHarvestIterations || 3000)) break;
          if (examined >= (bounds.maxHarvestAnchors || 500)) break;
          if (accepted >= (bounds.maxHarvestCandidates || 24)) break;
          if (overBudget()) {
            out.partial = true;
            break;
          }
          iterated += 1;
          if (
            anchor.closest(
              "header, nav, footer, [role='navigation'], [role='banner'], [role='contentinfo']",
            )
          ) {
            continue;
          }
          examined += 1;
          const href = absolutize(anchor.getAttribute("href") || "");
          if (!href || seenHrefs.has(href)) continue;
          const container = cardContainerFor(anchor);
          if (!container) continue;
          const prices = priceTextsOf(container);
          if (!prices.priceText) continue;
          seenHrefs.add(href);
          accepted += 1;
          const image = largestImage(container);
          out.harvested.push({
            url: href,
            titleText: (anchor.innerText || anchor.textContent || "").slice(0, 300),
            titleAttr: (anchor.getAttribute("title") || "").slice(0, 300),
            ariaLabel: (anchor.getAttribute("aria-label") || "").slice(0, 300),
            imgAlt: image ? image.alt : "",
            imageUrl: image ? image.url : "",
            imageLoaded: image ? image.loaded : false,
            priceText: prices.priceText,
            oldPriceText: prices.oldPriceText,
          });
        }
      }
      return out;
    },
    {
      seeds: [...seedByUrl.values()],
      gateOpenFromSummary: gateFromSummary.open,
      priceSelector: PRODUCT_DATA_PRICE_SELECTORS.join(", "),
      oldPriceSelector: PRODUCT_DATA_OLD_PRICE_SELECTORS.join(", "),
      bounds: {
        maxJsonLdBytes: PRODUCT_DATA_MAX_JSONLD_BYTES,
        maxAncestorWalk: PRODUCT_DATA_MAX_ANCESTOR_WALK,
        maxHarvestAnchors: PRODUCT_DATA_MAX_HARVEST_ANCHORS,
        maxHarvestIterations: PRODUCT_DATA_MAX_HARVEST_ITERATIONS,
        maxHarvestCandidates: PRODUCT_DATA_MAX_HARVEST_CANDIDATES,
        timeBudgetMs: PRODUCT_DATA_TIME_BUDGET_MS,
        tier1CompleteTarget: PRODUCT_DATA_TIER1_COMPLETE_TARGET,
      },
    },
  );
  return buildProductDataArtifact({
    pageUrl: page.url(),
    probeRows: rows,
    domJoin: pageData?.domJoin || [],
    harvested: pageData?.harvested || [],
    jsonLdBlocks: pageData?.jsonLdBlocks || [],
    recoverySummary,
    roughJsonLdProductCount: pageData?.roughJsonLdProductCount ?? 0,
  });
}

// Test-only export: exposes captureProductCardCtaHoverStates so the
// Playwright-based integration tests in scripts/lib/ can drive the function
// directly with synthetic fixtures (placeholder-with-revealed-alt,
// persistent-icon-only, etc.) without going through the full
// collectProductCardStyles orchestration. Not part of the public API —
// see scripts/lib/cta-hover-capture.test.js.
export const __captureProductCardCtaHoverStatesForTests = captureProductCardCtaHoverStates;

// Test-only export: `_maybeSwapToHoverRevealedAltCta` takes exactly ONE thing
// from its `cardLocator` — a single `evaluate` returning the alternative it
// found — so a stub locator can hand it readings a real browser will not
// produce. That seam is necessary, not a convenience: in Chromium every field
// of `readHoverStyleFor` always comes back with a value, so the degraded
// alternative that the evidence check exists to refuse is unreachable from any
// fixture, and without this the check would be unpinned code. Not part of the
// public API — see scripts/lib/cta-hover-capture.test.js.
export const __maybeSwapToHoverRevealedAltCtaForTests = _maybeSwapToHoverRevealedAltCta;

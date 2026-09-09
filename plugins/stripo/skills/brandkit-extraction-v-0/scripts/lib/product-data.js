// Pure node-side helpers for the homepage product-data harvest
// (`product-data.json`). The in-page collection lives in
// `lib.js#collectProductData`; everything here is browser-free and unit
// tested in product-data.test.js against REAL fleet failure cases:
//
//   - site A / site B: clean "369 ₴" / "1 299 ₴" prices, space thousands.
//   - site C: merged price blobs ("169 ₴ -41% 99 ₴") and review rows
//     ("4.7 4.7 333") that must not become products.
//   - site D: title blobs carrying review counts + price + CTA bleed
//     ("2 відгуки Набір-сюрприз ... 795 ₴ Бонуси") — any title containing a
//     currency token is rejected so anchor-title/img-alt fallbacks engage.
//   - site E: badge-only titles ("ХІТ 3").
//   - site F: kopiyka <sup> fragments mashed into the text
//     ("74797грн." is really 747.97). Text alone is ambiguous, so the
//     in-page extractor passes sup-corrected text; here we additionally
//     reject price/oldPrice pairs whose ratio exceeds
//     SUSPICIOUS_OLD_PRICE_RATIO (no real discount is 95%+ on this fleet).
//
// The output of `buildProductDataArtifact` is a TECHNICAL artifact; the
// runtime (reteno_agent/brandkit_finalize/compose.py) projects it down and embeds the
// validated products into the final brandkit.json as `brand.products`.
// Purpose is demos: no freshness machinery; selection puts complete records
// (with an image) first, then keeps document order within each group (see
// selectProducts).

export const MAX_SELECTED_PRODUCTS = 8;
export const MIN_TARGET_PRODUCTS = 5;
export const SUSPICIOUS_OLD_PRICE_RATIO = 20;
export const MAX_REJECTION_DIAGNOSTICS = 20;
const MAX_PRICE_TEXT_LENGTH = 160;
const MAX_URL_LENGTH = 2048;
const MIN_NAME_LENGTH = 8;
const MAX_NAME_LENGTH = 120;

// Currency vocabulary. Letter tokens are matched with letter-boundary
// lookarounds so "грн" never fires inside a word; symbol tokens match
// anywhere. Order matters: longest token first so "грн." wins over "грн".
const CURRENCY_TOKEN_CODES = [
  ["грн.", "UAH"],
  ["грн", "UAH"],
  ["uah", "UAH"],
  ["₴", "UAH"],
  ["usd", "USD"],
  ["$", "USD"],
  ["eur", "EUR"],
  ["€", "EUR"],
  ["gbp", "GBP"],
  ["£", "GBP"],
  ["pln", "PLN"],
  ["zł", "PLN"],
];

const CURRENCY_TOKEN_SOURCE =
  "(?:(?<![\\p{L}])(?:грн\\.?|uah|usd|eur|gbp|pln|zł)(?![\\p{L}])|[₴$€£])";
const AMOUNT_SOURCE = "\\d+(?:[ .,]\\d+)*";
const ANCHORED_PRICE_RE = new RegExp(
  `(?<![\\d.,])(${AMOUNT_SOURCE})\\s*(${CURRENCY_TOKEN_SOURCE})` +
    `|(${CURRENCY_TOKEN_SOURCE})\\s*(${AMOUNT_SOURCE})(?![\\d.,])`,
  "giu",
);
const CURRENCY_TOKEN_RE = new RegExp(CURRENCY_TOKEN_SOURCE, "giu");
// SaaS tier / subscription pricing, not a product price. The period words end
// on `(?![\p{L}])`, not `\b`: `\b` is an ASCII-word boundary, so after a
// Cyrillic letter it can never hold and every Cyrillic period below was dead.
// Russian `год` is deliberately absent — it is also the Ukrainian abbreviation
// for `година` (hour), and `500 грн/год` is an hourly rate, which IS the price.
//
// KNOWN RESIDUAL: these are word FORMS, not stems, so inflections still leak —
// measured, `грн/року`, `грн/місяця`, `грн/місяці` and `грн/тижня` all salvage as
// prices. This is the same size as the gap English already has (`$29/monthly`
// leaks identically), and closing it properly means matching Ukrainian and
// Russian stems with an inflectional tail, not listing more forms.
const PER_PERIOD_RE =
  /\/\s*(mo|month|months|yr|year|wk|week|місяць|міс|месяц|мес|тиждень|неделя|рік)(?![\p{L}])|per\s+(month|year|user|seat|week)|billed\s+(annually|monthly|yearly)|на\s+місяць|в\s+месяц|щомісяця/iu;
// "from 99 ₴" / "від 99 ₴" — category tile, not a concrete product price.
const FROM_PREFIX_RE = /^(from|від|от|desde|ab)(?![\p{L}])/iu;
// "$5M", "5 млн" — marketing magnitude, not a price.
const MAGNITUDE_RE = /\d\s*(?:[kmb](?![\p{L}])|млн|млрд|тис\.?|mln|mlrd|bn)/iu;
// A percentage merged into a price node is a discount badge whether or not the
// theme prints its sign ("169 ₴ -41%", "2 499 ₴ 20%"): a percentage is a ratio,
// never an amount of money, so it is stripped before the anchored scan and the
// sign is optional because it is the theme's typography, not meaning. Three
// digits is the whole range a percentage of a price can take. The strip can
// never CREATE a price: a badge alone ("20%") strips to nothing and is refused;
// a percent that is the tail of a decimal ("2.5%") is not matched as a whole
// and leaves digits behind, which the residual-digit guard rejects -- a blob
// is refused rather than guessed, as before.
const DISCOUNT_TOKEN_RE = /(?:[-+−–]\s*)?\d{1,3}\s*%/gu;
// Loyalty-bonus accrual mashed into the price node ("на бонусний рахунок
// +210 ₴", site C). A leading "+" before a digit, or an explicit bonus word.
// Checked BEFORE the discount-token strip so the "+210" survives to match.
const BONUS_CONTEXT_RE = /(^|\s)[+＋]\s*\d|bonus|бонус|на\s+бонусн\w*\s+рахун\w*/iu;
// Per-currency lower bound below which a LONE single amount is implausible as
// a real product price (a stray "1 ₴" bonus/placeholder, not a price). A
// two-amount old/current pair is exempt — the ratio guard handles those.
const PRICE_FLOORS = { UAH: 1, RUB: 1, PLN: 0.5, USD: 0.5, EUR: 0.5, GBP: 0.5 };
function priceFloorFor(currency) {
  return PRICE_FLOORS[currency] ?? 0.5;
}

const ZERO_WIDTH_RE = /[\u200b\u200c\u200d\ufeff]/g;
// Leading review-count tokens observed on site D: "2 відгуки …", "0 відгуків …".
const LEADING_REVIEW_COUNT_RE =
  /^\d+\s*(відгуків|відгуки|відгук|отзывов|отзыва|отзыв|reviews|review)(?![\p{L}])[\s:,–-]*/iu;
// Leading badge tokens ("ХІТ 3 Ніж …") — stripped only when real text follows.
// Cyrillic-only on purpose: Latin marketing words (new/top/sale/hit/promo)
// start real product names ("New Balance 574", "Top Gun Maverick",
// "Sale Mango сукня") and stripping them corrupts the name; Cyrillic badge
// tokens cannot begin a Latin brand name on this fleet.
const LEADING_BADGE_RE =
  /^(?:хіт|хит|топ|акція|акция|промо)(?![\p{L}])[\s\d]*(?=\p{L})/iu;

const DENY_URL_SEGMENTS = new Set([
  "pricing",
  "plans",
  "cart",
  "checkout",
  "login",
  "register",
  "category",
  "catalog",
  "collection",
  "campaign",
  // A dedicated review PATH segment (".../x/reviews/") is a review page, not
  // the product page. (A review QUERY param — allo's "?tab=discussion" — is
  // canonicalized off below instead: those rows carry the real price and have
  // no clean twin, so denying them would delete the products.)
  "reviews",
  "review",
  "otzyvy",
  "otzyv",
  "vidguky",
  "comments",
]);

// Query keys that select a sub-tab/section of a product page; when the value
// names a review/discussion section the param is review chrome and is dropped
// so "...x.html?tab=discussion" canonicalizes onto the clean product URL.
const REVIEW_QUERY_KEY_RE = /^(tab|view|section)$/i;
const REVIEW_QUERY_VALUE_RE =
  /^(discussion|reviews?|otzyv\w*|vidgu\w*|otzyvy|comments?|rating)$/i;

// A hyphen-delimited review token at the END of a product slug marks a review
// TWIN of the product page (site C ".../<slug>-otzyvy.html"). Closed alternation
// (no \w* wildcards) so it cannot swallow real slug words; hyphen-left anchored
// so a prefix segment ("vidguki-pro-magazin") and a mid-slug token
// ("samsung-review-edition") are both untouched.
const REVIEW_SUFFIX_RE =
  /-(?:otzyvy|otzyvov|otzyva|otzyv|vidguky|vidgukiv|vidhuky|reviews|opinie|comments)$/;

export function normalizeCurrencyCode(token) {
  if (typeof token !== "string") return null;
  const needle = token.trim().toLowerCase();
  for (const [candidate, code] of CURRENCY_TOKEN_CODES) {
    if (needle === candidate) return code;
  }
  return null;
}

function normalizeWhitespace(value) {
  return String(value)
    .replace(ZERO_WIDTH_RE, "")
    .replace(/[\u00a0\u202f\u2009]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Turn a matched digit run into a number, or null when the grouping is not
// a recognizable price shape. Handles "1 299" (space thousands), "1,299",
// "950.00"/"950,00" (decimals), "1 299.95", and the site F kopiyka split
// "344 47" (a trailing TWO-digit space group is a mashed <sup> decimal).
function normalizeAmountText(raw) {
  const text = normalizeWhitespace(raw);
  if (!text) return null;
  if (/^\d+$/.test(text)) return Number(text);
  if (/^\d{1,3}(?: \d{3})+$/.test(text)) return Number(text.replace(/ /g, ""));
  if (/^\d{1,3}(?:,\d{3})+$/.test(text)) return Number(text.replace(/,/g, ""));
  if (/^\d+[.,]\d{1,2}$/.test(text)) return Number(text.replace(",", "."));
  if (/^\d{1,3}(?: \d{3})+[.,]\d{1,2}$/.test(text)) {
    return Number(text.replace(/ /g, "").replace(",", "."));
  }
  if (/^\d{1,3}(?:,\d{3})+\.\d{1,2}$/.test(text)) {
    return Number(text.replace(/,/g, ""));
  }
  // Kopiyka split: last space-separated group has exactly 2 digits, every
  // earlier separator is a valid 3-digit thousands group ("344 47" → 344.47,
  // "12 345 67" → 12345.67).
  const kopiyka = /^(\d{1,3}(?: \d{3})*) (\d{2})$/.exec(text);
  if (kopiyka) return Number(`${kopiyka[1].replace(/ /g, "")}.${kopiyka[2]}`);
  return null;
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

/**
 * Parse a price text into `{value, currency, impliedOldValue, amountCount}`.
 * Currency-anchored only — bare numbers are rejected. Returns null on any
 * ambiguity; strictness is the contract (a missing demo product beats a
 * wrong price).
 */
export function parsePriceText(rawText) {
  if (typeof rawText !== "string") return null;
  let text = normalizeWhitespace(rawText);
  if (!text || text.length > MAX_PRICE_TEXT_LENGTH) return null;
  if (PER_PERIOD_RE.test(text)) return null;
  if (FROM_PREFIX_RE.test(text)) return null;
  if (MAGNITUDE_RE.test(text)) return null;
  // Reject loyalty-bonus accrual ("+210 ₴", "на бонусний рахунок +210 ₴")
  // before the "-NN%/+NN%" discount strip removes the leading "+" signal.
  if (BONUS_CONTEXT_RE.test(text)) return null;
  text = normalizeWhitespace(text.replace(DISCOUNT_TOKEN_RE, " "));
  if (!text) return null;

  const amounts = [];
  let residual = "";
  let cursor = 0;
  ANCHORED_PRICE_RE.lastIndex = 0;
  for (const match of text.matchAll(ANCHORED_PRICE_RE)) {
    const amountText = match[1] ?? match[4];
    const currencyToken = match[2] ?? match[3];
    const value = normalizeAmountText(amountText);
    const currency = normalizeCurrencyCode(currencyToken);
    if (value === null || !Number.isFinite(value) || value <= 0 || !currency) {
      return null;
    }
    amounts.push({ value: roundMoney(value), currency });
    residual += text.slice(cursor, match.index);
    cursor = match.index + match[0].length;
  }
  residual += text.slice(cursor);
  if (amounts.length === 0 || amounts.length > 2) return null;
  // Any leftover letters mean the node carried more than a price ("599 ₴
  // Купити" CTA bleed, site D title blobs) — reject rather than guess.
  if (/\p{L}/u.test(residual.replace(CURRENCY_TOKEN_RE, " "))) return null;
  // Any leftover digits mean an unanchored amount sat next to the anchored
  // one — a merged blob that did not split cleanly.
  if (/\d/.test(residual)) return null;
  if (amounts.length === 1) {
    // A lone amount at or below the currency floor (e.g. "1 ₴") is a
    // placeholder/bonus marker, not a real price. A two-amount pair is exempt
    // (handled by the ratio guard below / in validateProduct).
    if (amounts[0].value <= priceFloorFor(amounts[0].currency)) return null;
    return {
      value: amounts[0].value,
      currency: amounts[0].currency,
      impliedOldValue: null,
      amountCount: 1,
    };
  }
  const [first, second] = amounts;
  if (first.currency !== second.currency) return null;
  // Merged old+current blob ("169 ₴ -41% 99 ₴" after badge strip) splits
  // cleanly only when the first amount is strictly greater.
  if (first.value <= second.value) return null;
  return {
    value: second.value,
    currency: second.currency,
    impliedOldValue: first.value,
    amountCount: 2,
  };
}

/**
 * Clean a raw title candidate. Returns the cleaned name or null when the
 * candidate cannot be a product name (currency token present, too short or
 * long, no letters). Null tells the caller to try the next fallback
 * (anchor title attr → aria-label → img alt).
 */
/**
 * Does this text hold a letter at all?
 *
 * `cleanTitle` below has always asked it: a candidate with no letter in it is
 * a number, not a name. It is exported because the same question is the ONLY
 * thing that separates a bare-numeral price from a headline once the currency
 * parsers have declined — `parsePriceText` and `salvageAnchoredPrice` are both
 * currency-anchored, and "bare numbers are rejected" is their contract, so a
 * caller looking at `["100", "101", "102"]` gets `null` from both and has to
 * ask this instead. One copy, here, beside the parsers it completes: a second
 * `\p{L}` test spelled at the call site is a rule that can drift from this one
 * silently, and the drift direction is unsafe (a price admitted as a heading).
 */
export function hasLetters(rawText) {
  return /\p{L}/u.test(typeof rawText === "string" ? rawText : "");
}

/**
 * Does this text carry a currency token at all — "грн.", "₴", "€", "zł"?
 *
 * Exported for the same reason `hasLetters` is: it is one of the three tests
 * `cleanTitle` runs, and callers outside this module need that one test
 * without the other two (`cleanTitle`'s 8-character floor is calibrated for
 * product NAMES and says nothing about text in general). Sharing the compiled
 * `CURRENCY_TOKEN_RE` is the point — a second currency alphabet spelled at a
 * call site is a list that drifts from this one the day a currency is added,
 * and the drift direction is unsafe.
 *
 * `CURRENCY_TOKEN_RE` is a `g` regex, so `lastIndex` is reset before the test
 * exactly as `cleanTitle` resets it; without that, alternate calls return
 * alternate answers.
 */
export function holdsCurrencyToken(rawText) {
  if (typeof rawText !== "string") return false;
  CURRENCY_TOKEN_RE.lastIndex = 0;
  return CURRENCY_TOKEN_RE.test(rawText);
}

/**
 * Does this text read as a currency-anchored price?
 *
 * Both price readers, in the order the rest of this module already composes
 * them (`parsePriceText` first, `salvageAnchoredPrice` on its reject path),
 * reduced to the yes/no that callers asking "is this row a price?" actually
 * want. It exists so that question has ONE answer: the alternative is a
 * caller re-spelling `parsePriceText(t) || salvageAnchoredPrice(t)` with its
 * own trimming and its own empty-string handling, which is a second currency
 * parser however short it looks.
 *
 * Deliberately NOT the whole of "is this row a price". Both readers are
 * currency-anchored and decline a bare numeral by contract, so a price whose
 * currency sits in a sibling span or a background image returns false here.
 * That residue is what a caller's other arms are for — `hasLetters` in
 * `salientRowReadsAsPrice`, the selector in `isPriceProbeRow`.
 *
 * No local type guard, no local trim. Both readers open with
 * `typeof rawText !== "string"` and run `normalizeWhitespace`, so a guard here
 * would be a second copy of a rule they already own — and the first draft of
 * this function carried both, where a mutation that deleted the trim killed no
 * test because it could not change an answer. Delegation is the whole point;
 * the tests below pin the delegated contract (`null`, `1299`, `"   "`,
 * `"  169 ₴  "`) rather than a local restatement of it.
 */
export function textReadsAsAnchoredPrice(rawText) {
  return Boolean(parsePriceText(rawText) || salvageAnchoredPrice(rawText));
}

export function cleanTitle(rawText) {
  if (typeof rawText !== "string") return null;
  let text = normalizeWhitespace(rawText);
  text = text.replace(LEADING_REVIEW_COUNT_RE, "");
  text = text.replace(LEADING_BADGE_RE, "");
  text = text.trim();
  if (!text) return null;
  CURRENCY_TOKEN_RE.lastIndex = 0;
  if (CURRENCY_TOKEN_RE.test(text)) return null;
  if (text.length < MIN_NAME_LENGTH || text.length > MAX_NAME_LENGTH) return null;
  if (!hasLetters(text)) return null;
  return text;
}

/**
 * Canonicalize a product URL: absolute http(s), same-origin with the page
 * (modulo a leading "www."), real pathname, no denied path segments,
 * tracking params stripped. Returns the canonical string or null.
 */
export function canonicalProductUrl(rawUrl, pageUrl) {
  if (typeof rawUrl !== "string" || !rawUrl.trim()) return null;
  let url;
  let page;
  try {
    page = new URL(String(pageUrl));
    url = new URL(rawUrl.trim(), page);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  const stripWww = (host) => host.replace(/^www\./i, "");
  if (stripWww(url.hostname).toLowerCase() !== stripWww(page.hostname).toLowerCase()) {
    return null;
  }
  if (!url.pathname || url.pathname === "/") return null;
  const segments = url.pathname.split("/").filter(Boolean);
  for (const segment of segments) {
    if (DENY_URL_SEGMENTS.has(segment.toLowerCase())) return null;
  }
  // A review TWIN of a product page repeats the product slug with a review
  // suffix on the LAST path segment (site C ".../<slug>-otzyvy.html"). The
  // DENY_URL_SEGMENTS loop above only catches a dedicated review PATH SEGMENT
  // (".../reviews/"); this catches the suffix form. Strip a known web
  // extension first, then reject when the slug ends in a hyphen-delimited
  // review token.
  const lastSegment = (segments[segments.length - 1] || "").toLowerCase();
  const slug = lastSegment.replace(/\.(?:html?|php|aspx?|jsp)$/, "");
  if (REVIEW_SUFFIX_RE.test(slug)) return null;
  const params = new URLSearchParams(url.search);
  for (const key of [...params.keys()]) {
    if (/^utm_/i.test(key) || /^(gclid|fbclid)$/i.test(key)) {
      params.delete(key);
      continue;
    }
    // Drop a review/discussion sub-tab selector ("?tab=discussion") so the
    // row collapses onto the clean product URL. Only when BOTH the key is a
    // tab/view/section selector AND a value names a review section; other
    // params (site D's "sc_content=…", "?color=red") survive.
    if (
      REVIEW_QUERY_KEY_RE.test(key) &&
      params.getAll(key).some((value) => REVIEW_QUERY_VALUE_RE.test(value))
    ) {
      params.delete(key);
    }
  }
  const search = params.toString();
  const canonical = `${url.origin}${url.pathname}${search ? `?${search}` : ""}`;
  if (canonical.length > MAX_URL_LENGTH) return null;
  return canonical;
}

/** Absolute http(s), no data:, bounded length. Off-origin CDNs are fine. */
export function canonicalImageUrl(rawUrl) {
  if (typeof rawUrl !== "string") return null;
  const text = rawUrl.trim();
  if (!text || text.length >= MAX_URL_LENGTH) return null;
  let url;
  try {
    url = new URL(text);
  } catch {
    return null;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") return null;
  return url.toString();
}

/**
 * Harvest gate: only run the generic tier-2 anchor harvest when the page
 * showed SOME purchase-like signal. Mirrors the brandkit `productCard: []`
 * convention — a closed gate is semantic absence ("non-ecommerce"), not a
 * failed probe. All key paths are optional-chained: recovery summaries from
 * older probe versions may miss any of them.
 */
export function decideHarvestGate(recoverySummary, jsonLdProductCount = 0) {
  const reasons = [];
  if ((recoverySummary?.finalPurchaseCandidateRowCount ?? 0) >= 1) {
    reasons.push("purchase-candidate-rows");
  }
  if (recoverySummary?.summary?.hasPurchaseLikeRepresentative === true) {
    reasons.push("purchase-like-representative");
  }
  if ((jsonLdProductCount ?? 0) >= 1) {
    reasons.push("json-ld-products");
  }
  if ((recoverySummary?.domMinedSelectorRecovery?.minedSelectorCount ?? 0) >= 1) {
    reasons.push("dom-mined-selectors");
  }
  return { open: reasons.length > 0, reasons };
}

function jsonLdNodeTypes(node) {
  const type = node?.["@type"];
  if (typeof type === "string") return [type];
  if (Array.isArray(type)) return type.filter((item) => typeof item === "string");
  return [];
}

function jsonLdFirstString(value) {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = jsonLdFirstString(item);
      if (found) return found;
    }
    return null;
  }
  if (value && typeof value === "object") {
    return jsonLdFirstString(value.url ?? value.contentUrl ?? null);
  }
  return null;
}

function jsonLdOfferPrice(offers) {
  const list = Array.isArray(offers) ? offers : offers ? [offers] : [];
  for (const offer of list) {
    if (!offer || typeof offer !== "object") continue;
    const types = jsonLdNodeTypes(offer);
    const isAggregate = types.includes("AggregateOffer");
    const rawPrice = isAggregate
      ? offer.lowPrice ?? offer.price
      : offer.price ?? (offer.priceSpecification && offer.priceSpecification.price);
    // String prices go through normalizeAmountText so locale grouping is
    // handled like the DOM path: "1,299" is thousands (1299) and "299,99" is
    // a decimal comma (299.99). The previous ad-hoc replace turned "1,299"
    // into 1.299 — a 1000x error.
    const price =
      typeof rawPrice === "number"
        ? rawPrice
        : typeof rawPrice === "string"
          ? (normalizeAmountText(rawPrice) ?? NaN)
          : NaN;
    if (!Number.isFinite(price) || price <= 0) continue;
    const rawCurrency =
      offer.priceCurrency ??
      (offer.priceSpecification && offer.priceSpecification.priceCurrency);
    const currency =
      typeof rawCurrency === "string" && /^[A-Za-z]{3}$/.test(rawCurrency.trim())
        ? rawCurrency.trim().toUpperCase()
        : null;
    if (!currency) continue;
    return { price: roundMoney(price), currency };
  }
  return null;
}

function collectJsonLdProductNodes(node, out, depth = 0) {
  if (!node || depth > 6) return;
  if (Array.isArray(node)) {
    for (const item of node) collectJsonLdProductNodes(item, out, depth + 1);
    return;
  }
  if (typeof node !== "object") return;
  if (jsonLdNodeTypes(node).includes("Product")) {
    out.push(node);
  }
  if (Array.isArray(node["@graph"])) {
    collectJsonLdProductNodes(node["@graph"], out, depth + 1);
  }
  if (Array.isArray(node.itemListElement)) {
    for (const element of node.itemListElement) {
      if (!element || typeof element !== "object") continue;
      collectJsonLdProductNodes(element.item ?? element, out, depth + 1);
    }
  }
}

/**
 * Walk raw JSON-LD blocks (strings or pre-parsed values) and return
 * `{products, productNodeCount}`. A node counts as a product only when it
 * carries offers with a usable price; it becomes a mergeable candidate only
 * when its URL canonicalizes against the page.
 */
export function walkJsonLdProducts(blocks, pageUrl) {
  const nodes = [];
  for (const block of Array.isArray(blocks) ? blocks : []) {
    let parsed = block;
    if (typeof block === "string") {
      try {
        parsed = JSON.parse(block);
      } catch {
        continue;
      }
    }
    collectJsonLdProductNodes(parsed, nodes);
  }
  const products = [];
  let productNodeCount = 0;
  for (const node of nodes) {
    const offer = jsonLdOfferPrice(node.offers);
    if (!offer) continue;
    productNodeCount += 1;
    const url = canonicalProductUrl(jsonLdFirstString(node.url ?? node["@id"]), pageUrl);
    if (!url) continue;
    products.push({
      source: "json-ld",
      url,
      name: typeof node.name === "string" ? node.name : null,
      imageUrl: canonicalImageUrl(jsonLdFirstString(node.image)),
      price: offer.price,
      currency: offer.currency,
    });
  }
  return { products, productNodeCount };
}

function probeRowText(field) {
  if (typeof field === "string") return field;
  if (field && typeof field === "object" && typeof field.text === "string") {
    return field.text;
  }
  return "";
}

function pushUnique(list, value) {
  if (typeof value === "string" && value.trim() && !list.includes(value)) {
    list.push(value);
  }
}

function newCandidate(url, source, docOrder) {
  return {
    url,
    source,
    docOrder,
    titleCandidates: [],
    priceTexts: [],
    // Probe-sourced price texts only. Several PROBE rows landing on one URL
    // is the taxonomy-link signature the shared-across-cards guard keys on;
    // dom-join/harvest texts never join this list (harvest dedupes by URL,
    // dom-join re-reads the same card), so cross-pass disagreement over one
    // card cannot masquerade as a multi-card collision.
    probePriceTexts: [],
    oldPriceTexts: [],
    imageUrl: null,
    imageLoaded: null,
    directName: null,
    directPrice: null,
    directCurrency: null,
  };
}

/**
 * Merge probe rows (tier-1 seed), in-page DOM join results, JSON-LD
 * products, and tier-2 harvested anchors into one deduped candidate list.
 * Dedup is by canonical URL, first wins; later sources only fill gaps.
 */
export function mergeProductCandidates({
  pageUrl,
  probeRows = [],
  domJoin = [],
  jsonLdProducts = [],
  harvested = [],
} = {}) {
  const byUrl = new Map();
  let docOrder = 0;

  for (const row of Array.isArray(probeRows) ? probeRows : []) {
    const url = canonicalProductUrl(row?.productUrl, pageUrl);
    if (!url) continue;
    let candidate = byUrl.get(url);
    if (!candidate) {
      candidate = newCandidate(url, "probe", docOrder++);
      byUrl.set(url, candidate);
    }
    pushUnique(candidate.titleCandidates, probeRowText(row?.title));
    pushUnique(candidate.priceTexts, probeRowText(row?.price));
    pushUnique(candidate.probePriceTexts, probeRowText(row?.price));
    pushUnique(candidate.oldPriceTexts, probeRowText(row?.oldPrice));
  }

  for (const entry of Array.isArray(domJoin) ? domJoin : []) {
    const url = canonicalProductUrl(entry?.url, pageUrl);
    if (!url) continue;
    const candidate = byUrl.get(url);
    if (!candidate) continue;
    // DOM re-extraction is an ADDITIONAL price candidate; the probe value
    // wins when present (selection takes the first candidate that validates),
    // so dom-join prices are appended. The ONE exception is the sup-aware
    // kopiyka correction (site F "747<sup>97</sup>" → "747.97"): that text is
    // strictly cleaner than the probe's collapsed "74797", so it is
    // prioritized only when the in-page extractor actually injected a decimal
    // (entry.supCorrected === true).
    const priceUnshift = entry.supCorrected === true;
    if (typeof entry.priceText === "string" && entry.priceText.trim()) {
      if (priceUnshift) candidate.priceTexts.unshift(entry.priceText);
      else candidate.priceTexts.push(entry.priceText);
    }
    if (typeof entry.oldPriceText === "string" && entry.oldPriceText.trim()) {
      if (priceUnshift) candidate.oldPriceTexts.unshift(entry.oldPriceText);
      else candidate.oldPriceTexts.push(entry.oldPriceText);
    }
    pushUnique(candidate.titleCandidates, entry.titleAttr);
    pushUnique(candidate.titleCandidates, entry.ariaLabel);
    pushUnique(candidate.titleCandidates, entry.imgAlt);
    const imageUrl = canonicalImageUrl(entry.imageUrl);
    if (imageUrl && !candidate.imageUrl) {
      candidate.imageUrl = imageUrl;
      candidate.imageLoaded = entry.imageLoaded === true;
    }
  }

  for (const product of Array.isArray(jsonLdProducts) ? jsonLdProducts : []) {
    let candidate = byUrl.get(product.url);
    if (!candidate) {
      candidate = newCandidate(product.url, "json-ld", docOrder++);
      byUrl.set(product.url, candidate);
    }
    pushUnique(candidate.titleCandidates, product.name);
    if (!candidate.imageUrl && product.imageUrl) {
      candidate.imageUrl = product.imageUrl;
      candidate.imageLoaded = null;
    }
    if (candidate.directPrice === null) {
      candidate.directPrice = product.price;
      candidate.directCurrency = product.currency;
    }
  }

  for (const entry of Array.isArray(harvested) ? harvested : []) {
    const url = canonicalProductUrl(entry?.url, pageUrl);
    if (!url || byUrl.has(url)) continue;
    const candidate = newCandidate(url, "harvest", docOrder++);
    byUrl.set(url, candidate);
    pushUnique(candidate.titleCandidates, entry.titleText);
    pushUnique(candidate.titleCandidates, entry.titleAttr);
    pushUnique(candidate.titleCandidates, entry.ariaLabel);
    pushUnique(candidate.titleCandidates, entry.imgAlt);
    pushUnique(candidate.priceTexts, entry.priceText);
    pushUnique(candidate.oldPriceTexts, entry.oldPriceText);
    candidate.imageUrl = canonicalImageUrl(entry.imageUrl);
    candidate.imageLoaded = entry.imageLoaded === true ? true : candidate.imageUrl ? false : null;
  }

  return [...byUrl.values()].sort((a, b) => a.docOrder - b.docOrder);
}

// A "from" word immediately before an amount marks a category tile price
// ("from 99 UAH"), not a concrete product price.
const FROM_WORD_BEFORE_RE = /(?:^|[\s(>])(?:from|від|вiд|от|desde|ab)\s*$/iu;

/**
 * Last-resort price read for text `parsePriceText` refused. It is reached ONLY
 * on the reject path, so it can never change a value that already parses.
 *
 * Where parsePriceText requires the WHOLE node text to be a price, this pulls
 * the currency-anchored amounts out of a noisy blob (card text bleed, rating
 * text, screen-reader "Original price:/Current price:" spans) and keeps the
 * existing pair semantics: <=2 DISTINCT amounts, same currency, higher = old.
 * Anything ambiguous returns null — a missing demo product still beats a
 * wrong price.
 *
 * A 2-amount reading is a CLAIM, not a result: free text cannot distinguish
 * a real sale pair ("Оригінальна ціна: 14 … 11") from an installment plan
 * ("3000 грн … 250 грн х 12"), so validateProduct accepts it only when the
 * high amount is independently corroborated by the card's own old-price
 * node evidence (oldPriceTexts). Uncorroborated pairs are skipped there.
 */
export function salvageAnchoredPrice(rawText) {
  if (typeof rawText !== "string") return null;
  let text = normalizeWhitespace(rawText);
  if (!text || text.length > 600) return null;
  if (PER_PERIOD_RE.test(text)) return null;
  if (BONUS_CONTEXT_RE.test(text)) return null;
  if (MAGNITUDE_RE.test(text)) return null;
  text = normalizeWhitespace(text.replace(DISCOUNT_TOKEN_RE, " "));
  const seen = [];
  ANCHORED_PRICE_RE.lastIndex = 0;
  for (const match of text.matchAll(ANCHORED_PRICE_RE)) {
    if (FROM_WORD_BEFORE_RE.test(text.slice(Math.max(0, match.index - 12), match.index))) {
      return null;
    }
    const value = normalizeAmountText(match[1] ?? match[4]);
    const currency = normalizeCurrencyCode(match[2] ?? match[3]);
    if (value === null || !Number.isFinite(value) || value <= 0 || !currency) return null;
    const rounded = roundMoney(value);
    if (!seen.some((entry) => entry.value === rounded && entry.currency === currency)) {
      seen.push({ value: rounded, currency });
    }
    if (seen.length > 2) return null;
  }
  if (seen.length === 0) return null;
  if (seen.length === 1) {
    if (seen[0].value <= priceFloorFor(seen[0].currency)) return null;
    return { value: seen[0].value, currency: seen[0].currency, impliedOldValue: null, amountCount: 1 };
  }
  const [first, second] = seen;
  if (first.currency !== second.currency) return null;
  const high = Math.max(first.value, second.value);
  const low = Math.min(first.value, second.value);
  if (low <= priceFloorFor(first.currency)) return null;
  if (high / low > SUSPICIOUS_OLD_PRICE_RATIO) return null;
  return { value: low, currency: first.currency, impliedOldValue: high, amountCount: 2 };
}

/**
 * Distinct current prices among the PROBE-sourced texts only. One card carries
 * one current price, and only the probe can put several cards' prices on one
 * URL (several probe rows electing the same taxonomy link); dom-join re-reads
 * the same card and harvest dedupes by URL, so their texts are excluded — a
 * cross-pass disagreement over one card (probe "99 ₴" vs a dom-join read that
 * landed on an unrecognized old-price node) is measurement noise, not
 * evidence of a second card. This also makes the site F decimal-collapse
 * twin a non-case: the sup-corrected spelling arrives via dom-join, never as
 * a second probe text. Vocabulary-free, so it holds on any CMS or language.
 */
function distinctProbePrices(candidate) {
  const values = [];
  for (const text of candidate.probePriceTexts || []) {
    const parsed = parsePriceText(text) || salvageAnchoredPrice(text);
    if (!parsed) continue;
    const known = values.some(
      (entry) => entry.currency === parsed.currency && entry.value === parsed.value,
    );
    if (!known) values.push({ value: parsed.value, currency: parsed.currency });
  }
  return values.length;
}

/**
 * True when the card's own old-price node evidence independently confirms
 * `value` as the old price. The corroborating read must be single-amount —
 * an old-price NODE holding a pair is itself a merged blob, not evidence.
 */
function oldTextsCorroborate(candidate, value, currency) {
  for (const text of candidate.oldPriceTexts || []) {
    const parsed = parsePriceText(text) || salvageAnchoredPrice(text);
    if (parsed && parsed.amountCount === 1 && parsed.currency === currency && parsed.value === value) {
      return true;
    }
  }
  return false;
}

/**
 * Validate one merged candidate into a public product record.
 * Returns `{ok: true, product}` or `{ok: false, reason}`.
 */
export function validateProduct(candidate) {
  if (!candidate || typeof candidate !== "object" || !candidate.url) {
    return { ok: false, reason: "no-url" };
  }
  let name = null;
  for (const titleCandidate of candidate.titleCandidates || []) {
    name = cleanTitle(titleCandidate);
    if (name) break;
  }
  if (!name) return { ok: false, reason: "no-valid-name" };

  // A candidate whose PROBE texts resolve to more than one current price is
  // bound to more than one card — a category/tag link, not a product. Drop it
  // rather than publishing whichever card's price happened to be read first.
  if (distinctProbePrices(candidate) >= 2) {
    return { ok: false, reason: "shared-across-cards" };
  }

  let price = null;
  let currency = null;
  let impliedOldValue = null;
  for (const priceText of candidate.priceTexts || []) {
    const parsed = parsePriceText(priceText);
    if (parsed) {
      price = parsed.value;
      currency = parsed.currency;
      impliedOldValue = parsed.impliedOldValue;
      break;
    }
  }
  if (price === null) {
    for (const priceText of candidate.priceTexts || []) {
      const parsed = salvageAnchoredPrice(priceText);
      if (!parsed) continue;
      // A salvaged PAIR needs corroboration (see salvageAnchoredPrice's
      // docblock): without the card's own old-price node confirming the high
      // amount, "3000 грн … 250 грн х 12" (installments) is indistinguishable
      // from a real sale pair, and skipping it beats shipping a wrong price.
      if (
        parsed.amountCount === 2 &&
        !oldTextsCorroborate(candidate, parsed.impliedOldValue, parsed.currency)
      ) {
        continue;
      }
      price = parsed.value;
      currency = parsed.currency;
      impliedOldValue = parsed.impliedOldValue;
      break;
    }
  }
  if (price === null && Number.isFinite(candidate.directPrice) && candidate.directPrice > 0) {
    price = roundMoney(candidate.directPrice);
    currency = typeof candidate.directCurrency === "string" ? candidate.directCurrency : null;
  }
  if (price === null || !currency) return { ok: false, reason: "no-valid-price" };

  let oldPrice = impliedOldValue;
  if (oldPrice === null) {
    for (const oldText of candidate.oldPriceTexts || []) {
      const parsed = parsePriceText(oldText);
      if (parsed && parsed.amountCount === 1) {
        // Currency must match the current price's; otherwise the strike
        // node belongs to something else.
        if (parsed.currency === currency) {
          oldPrice = parsed.value;
        }
        break;
      }
    }
  }
  // oldPrice is only meaningful when strictly greater than the price.
  if (oldPrice !== null && oldPrice <= price) oldPrice = null;
  // Decimal-collapse cross-check (site F): a >20x "discount" means one of
  // the pair lost its decimal point — both values are untrustworthy.
  if (oldPrice !== null && oldPrice / price > SUSPICIOUS_OLD_PRICE_RATIO) {
    return { ok: false, reason: "suspicious-price-ratio" };
  }

  return {
    ok: true,
    product: {
      name,
      url: candidate.url,
      imageUrl: candidate.imageUrl || null,
      price,
      oldPrice,
      currency,
      source: candidate.source,
    },
  };
}

/**
 * Document order, complete records (with an image) first, cap at 8.
 */
export function selectProducts(products, cap = MAX_SELECTED_PRODUCTS) {
  const list = Array.isArray(products) ? products : [];
  const complete = list.filter((product) => Boolean(product.imageUrl));
  const imageless = list.filter((product) => !product.imageUrl);
  return [...complete, ...imageless].slice(0, cap);
}

function determineStatus({ blocked, gateOpen, validCount }) {
  if (blocked) return "blocked";
  if (validCount >= MIN_TARGET_PRODUCTS) return "ok";
  if (validCount >= 1) return "below-target";
  return gateOpen ? "empty" : "non-ecommerce";
}

/** Empty artifact shape shared by the blocked branch and degraded writes. */
export function emptyProductDataArtifact({ pageUrl = "", status = "empty", error = null } = {}) {
  return {
    version: 1,
    source: "homepage-pass/product-data",
    pageUrl,
    collectedAt: new Date().toISOString(),
    status,
    gate: { open: false, reasons: [] },
    counts: {
      probeRowCount: 0,
      jsonLdProductCount: 0,
      harvestedCount: 0,
      candidateCount: 0,
      validCount: 0,
      selectedCount: 0,
    },
    products: [],
    diagnostics: { rejections: [], error: error || null },
  };
}

/**
 * Assemble the full technical artifact from probe rows, in-page collection
 * output, and the recovery summary. Pure — fully replayable offline from
 * cached fixtures (see tests/test_product_data_fleet_replay.py).
 */
export function buildProductDataArtifact({
  pageUrl,
  probeRows = [],
  domJoin = [],
  harvested = [],
  jsonLdBlocks = [],
  recoverySummary = null,
  roughJsonLdProductCount = 0,
  blocked = false,
} = {}) {
  if (blocked) {
    return emptyProductDataArtifact({ pageUrl, status: "blocked" });
  }
  const { products: jsonLdProducts, productNodeCount } = walkJsonLdProducts(
    jsonLdBlocks,
    pageUrl,
  );
  // The in-page tier-2 gate opens on a ROUGH regex count of JSON-LD Product
  // nodes (lib.js#collectProductData cannot parse strictly in-budget). Feed
  // the larger of the rough and strictly-parsed counts into the recorded
  // gate so `gate.open` reflects the decision actually used in-page, not a
  // stricter after-the-fact recomputation.
  const gate = decideHarvestGate(
    recoverySummary,
    Math.max(
      productNodeCount,
      Number.isFinite(roughJsonLdProductCount) ? roughJsonLdProductCount : 0,
    ),
  );
  const candidates = mergeProductCandidates({
    pageUrl,
    probeRows,
    domJoin,
    jsonLdProducts,
    harvested,
  });
  const valid = [];
  const rejections = [];
  for (const candidate of candidates) {
    const result = validateProduct(candidate);
    if (result.ok) {
      valid.push(result.product);
    } else if (rejections.length < MAX_REJECTION_DIAGNOSTICS) {
      rejections.push({ url: candidate.url || null, reason: result.reason });
    }
  }
  const selected = selectProducts(valid);
  return {
    version: 1,
    source: "homepage-pass/product-data",
    pageUrl,
    collectedAt: new Date().toISOString(),
    status: determineStatus({
      blocked: false,
      gateOpen: gate.open,
      validCount: valid.length,
    }),
    gate,
    counts: {
      probeRowCount: Array.isArray(probeRows) ? probeRows.length : 0,
      jsonLdProductCount: productNodeCount,
      harvestedCount: Array.isArray(harvested) ? harvested.length : 0,
      candidateCount: candidates.length,
      validCount: valid.length,
      selectedCount: selected.length,
    },
    products: selected,
    diagnostics: { rejections, error: null },
  };
}

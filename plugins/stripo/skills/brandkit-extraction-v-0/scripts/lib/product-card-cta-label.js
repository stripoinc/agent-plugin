// Conservative hard negatives for labels that describe a promotion rather
// than an action. Keep this separate from the broad non-purchase vocabulary:
// these expressions are anchored to the whole visible label, so words such as
// "sale" elsewhere in a real CTA do not suppress it.

const PURCHASE_VERB_LABEL_PATTERN =
  /(?:^|[^\p{L}\p{N}])(?:buy|add(?: +to)? +(?:cart|basket|bag)|cart|order|shop|checkout|purchase|get|купити|купить|купуй|придбати|до +кошика|у +кошик|в +кошик|в +корзину|замовити|замовляти|заказать|оплатить|оформить|приобрести|положить)(?=$|[^\p{L}\p{N}])/iu;

// Exactly the code points consumed by ECMAScript String.prototype.trim and
// \s. Spell them out so the Python twin cannot accidentally inherit Python's
// broader whitespace definition (notably U+0085 and U+001C..U+001F).
const DISCOUNT_LABEL_WHITESPACE =
  /[\u0009-\u000D\u0020\u00A0\u1680\u2000-\u200A\u2028\u2029\u202F\u205F\u3000\uFEFF]+/gu;

// Pinned Unicode 16.0 Decimal_Number (Nd) ranges. Do not replace this with a
// Unicode property escape: the Node and Python runtimes can ship different
// Unicode databases, which would make the shared evidence policy disagree.
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
// Punctuation is pinned for the same cross-runtime reason as Nd above. These
// sets are deliberately consumed only by the whole-label promotion grammar.
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
// One vocabulary for both suffix and standalone positions. A term admitted
// after "50%" must not silently become reusable when it is the whole label.
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

export function normalizeDiscountCtaLabel(value) {
  if (typeof value !== "string") return "";
  return value
    .replace(DISCOUNT_LABEL_BIDI_FORMAT_PATTERN, "")
    .replace(DISCOUNT_LABEL_WHITESPACE, " ")
    .replace(/^ +| +$/g, "");
}

export function hasPurchaseVerbLabel(value) {
  if (typeof value !== "string") return false;
  return PURCHASE_VERB_LABEL_PATTERN.test(normalizeDiscountCtaLabel(value));
}

export function isDiscountOnlyCtaLabel(value) {
  if (typeof value !== "string") return false;
  const label = normalizeDiscountCtaLabel(value);
  if (!label || hasPurchaseVerbLabel(label)) return false;
  // Lowercase before matching: Python re.IGNORECASE accepts extra spellings
  // such as dotless-ı "dıscount" that JavaScript /iu rejects.
  const grammarLabel = label.toLowerCase();
  return DISCOUNT_ONLY_CTA_PATTERN.test(grammarLabel);
}

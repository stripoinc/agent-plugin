"""Canonical product-card CTA evidence policy shared by Python consumers."""

from __future__ import annotations

import re
from typing import Any


# Exactly the code points removed by ECMAScript ``String.prototype.trim``.
# Python's default ``str.strip`` differs in both directions: it keeps U+FEFF
# and removes U+001C..U+001F, so callers must use this explicit set.
JS_TRIM_CHARS = "".join(
    [" \t\n\v\f\r\u00a0\u1680\u2028\u2029\u202f\u205f\u3000\ufeff"]
    + [chr(codepoint) for codepoint in range(0x2000, 0x200B)]
)


def js_trim(value: str) -> str:
    """Return ``value`` with ECMAScript ``String.trim`` characters removed."""

    return value.strip(JS_TRIM_CHARS)


def js_trimmed_nonempty(value: Any) -> bool:
    """Mirror ``typeof value === 'string' && value.trim().length > 0``."""

    return isinstance(value, str) and bool(js_trim(value))


_JS_WHITESPACE_RUN_PATTERN = re.compile(f"[{re.escape(JS_TRIM_CHARS)}]+")


def normalize_discount_cta_label(value: Any) -> str:
    """Remove pinned bidi controls and collapse ECMAScript whitespace."""

    if not isinstance(value, str):
        return ""
    without_bidi_controls = _DISCOUNT_LABEL_BIDI_FORMAT_PATTERN.sub("", value)
    return _JS_WHITESPACE_RUN_PATTERN.sub(" ", without_bidi_controls).strip(" ")


_PURCHASE_VERB_LABEL_PATTERN = re.compile(
    r"(?:^|[^\w])(?:buy|add(?: +to)? +(?:cart|basket|bag)|cart|order|shop|checkout|purchase|get|"
    r"купити|купить|купуй|придбати|до +кошика|у +кошик|в +кошик|в +корзину|замовити|"
    r"замовляти|заказать|оплатить|оформить|приобрести|положить)(?=$|[^\w])",
    re.IGNORECASE,
)
# Pinned Unicode 16.0 Decimal_Number (Nd) ranges. Do not replace this with
# ``\d``: Python and Node can ship different Unicode databases, which would
# make this shared evidence policy disagree for newly assigned digits.
_DECIMAL_NUMBER_RANGES = (
    (0x0030, 0x0039), (0x0660, 0x0669), (0x06F0, 0x06F9), (0x07C0, 0x07C9),
    (0x0966, 0x096F), (0x09E6, 0x09EF), (0x0A66, 0x0A6F), (0x0AE6, 0x0AEF),
    (0x0B66, 0x0B6F), (0x0BE6, 0x0BEF), (0x0C66, 0x0C6F), (0x0CE6, 0x0CEF),
    (0x0D66, 0x0D6F), (0x0DE6, 0x0DEF), (0x0E50, 0x0E59), (0x0ED0, 0x0ED9),
    (0x0F20, 0x0F29), (0x1040, 0x1049), (0x1090, 0x1099), (0x17E0, 0x17E9),
    (0x1810, 0x1819), (0x1946, 0x194F), (0x19D0, 0x19D9), (0x1A80, 0x1A89),
    (0x1A90, 0x1A99), (0x1B50, 0x1B59), (0x1BB0, 0x1BB9), (0x1C40, 0x1C49),
    (0x1C50, 0x1C59), (0xA620, 0xA629), (0xA8D0, 0xA8D9), (0xA900, 0xA909),
    (0xA9D0, 0xA9D9), (0xA9F0, 0xA9F9), (0xAA50, 0xAA59), (0xABF0, 0xABF9),
    (0xFF10, 0xFF19), (0x104A0, 0x104A9), (0x10D30, 0x10D39), (0x10D40, 0x10D49),
    (0x11066, 0x1106F), (0x110F0, 0x110F9), (0x11136, 0x1113F), (0x111D0, 0x111D9),
    (0x112F0, 0x112F9), (0x11450, 0x11459), (0x114D0, 0x114D9), (0x11650, 0x11659),
    (0x116C0, 0x116C9), (0x116D0, 0x116E3), (0x11730, 0x11739), (0x118E0, 0x118E9),
    (0x11950, 0x11959), (0x11BF0, 0x11BF9), (0x11C50, 0x11C59), (0x11D50, 0x11D59),
    (0x11DA0, 0x11DA9), (0x11F50, 0x11F59), (0x16130, 0x16139), (0x16A60, 0x16A69),
    (0x16AC0, 0x16AC9), (0x16B50, 0x16B59), (0x16D70, 0x16D79), (0x1CCF0, 0x1CCF9),
    (0x1D7CE, 0x1D7FF), (0x1E140, 0x1E149), (0x1E2F0, 0x1E2F9), (0x1E4F0, 0x1E4F9),
    (0x1E5F1, 0x1E5FA), (0x1E950, 0x1E959), (0x1FBF0, 0x1FBF9),
)
_DECIMAL_NUMBER = "[" + "".join(
    rf"\U{start:08X}-\U{end:08X}" for start, end in _DECIMAL_NUMBER_RANGES
) + "]"


def _codepoint_character_class(codepoints: tuple[int, ...]) -> str:
    return "[" + "".join(rf"\U{codepoint:08X}" for codepoint in codepoints) + "]"


# Bidi marks emitted around localized numbers by Intl and storefront formatters.
# Removal is private to discount-label normalization, not general CTA text.
_DISCOUNT_LABEL_BIDI_FORMAT_CODEPOINTS = (0x061C, 0x200E, 0x200F, 0x202A, 0x202B, 0x202C, 0x202D, 0x202E, 0x2066, 0x2067, 0x2068, 0x2069)
_DISCOUNT_LABEL_BIDI_FORMAT_PATTERN = re.compile(
    _codepoint_character_class(_DISCOUNT_LABEL_BIDI_FORMAT_CODEPOINTS),
)


# Explicit punctuation used only inside the anchored promotion grammar.
_RATE_SIGN_CODEPOINTS = (0x0025, 0x0609, 0x060A, 0x066A, 0x2030, 0x2031, 0xFE6A, 0xFF05)
_NUMBER_SEPARATOR_CODEPOINTS = (0x002C, 0x002E, 0x060C, 0x066B, 0x066C, 0xFE50, 0xFE52, 0xFF0C, 0xFF0E)
_RATE_PREFIX_SIGN_CODEPOINTS = (0x002B, 0x002D, 0x00B1, 0x2010, 0x2011, 0x2012, 0x2013, 0x2014, 0x2212, 0x2213, 0xFE58, 0xFE62, 0xFE63, 0xFF0B, 0xFF0D)
_OPEN_PAREN_CODEPOINTS = (0x0028, 0xFE59, 0xFF08)
_CLOSE_PAREN_CODEPOINTS = (0x0029, 0xFE5A, 0xFF09)
_PROMOTION_SEPARATOR_CODEPOINTS = (0x002D, 0x003A, 0x2010, 0x2011, 0x2012, 0x2013, 0x2014, 0x2212, 0xFE55, 0xFE58, 0xFE63, 0xFF0D, 0xFF1A)
_TERMINAL_PUNCTUATION_CODEPOINTS = (0x0021, 0x002C, 0x002E, 0x003A, 0x003B, 0x003F, 0x060C, 0x061B, 0x061F, 0x06D4, 0x3002, 0xFE50, 0xFE52, 0xFE54, 0xFE55, 0xFE56, 0xFE57, 0xFF01, 0xFF0C, 0xFF0E, 0xFF1A, 0xFF1B, 0xFF1F)

_RATE_SIGN = _codepoint_character_class(_RATE_SIGN_CODEPOINTS)
_NUMBER_SEPARATOR = _codepoint_character_class(_NUMBER_SEPARATOR_CODEPOINTS)
_RATE_PREFIX_SIGN = _codepoint_character_class(_RATE_PREFIX_SIGN_CODEPOINTS)
_OPEN_PAREN = _codepoint_character_class(_OPEN_PAREN_CODEPOINTS)
_CLOSE_PAREN = _codepoint_character_class(_CLOSE_PAREN_CODEPOINTS)
_PROMOTION_SEPARATOR = _codepoint_character_class(_PROMOTION_SEPARATOR_CODEPOINTS)
_TERMINAL_PUNCTUATION = _codepoint_character_class(_TERMINAL_PUNCTUATION_CODEPOINTS)
_RATE_NUMBER = rf"{_DECIMAL_NUMBER}+(?:(?:{_NUMBER_SEPARATOR}| +){_DECIMAL_NUMBER}+)*"
_RATE_SUFFIX_AMOUNT = rf"{_RATE_PREFIX_SIGN}? *{_RATE_NUMBER} *{_RATE_SIGN}"
_RATE_PREFIX_AMOUNT = rf"{_RATE_PREFIX_SIGN}? *{_RATE_SIGN} *{_RATE_NUMBER}"
_RATE_AMOUNT = rf"(?:{_RATE_SUFFIX_AMOUNT}|{_RATE_PREFIX_AMOUNT})"
_RATE_VALUE = rf"(?:{_RATE_AMOUNT}|{_RATE_SIGN})"
_PROMOTION_QUALIFIER = (
    r"(?:up +to|bis +zu|jusqu['’]?à|hasta|fino +a|até|tot|до|do|až|până +la|"
    r"op +til|upp +till|opptil|jopa)"
)
_PROMOTION_TERM = (
    r"(?:off|sale|discount|savings?|offer|deal|clearance|promo(?:tion)?|special +offer|save|"
    r"rabatt|remise|réduction|descuento|sconto|desconto|korting|rabat|sleva|zľava|reducere|"
    r"зниж(?:ка|ки|ок|ення)?|скид(?:ка|ки|ок)?|акц(?:ія|ії|ій|ия|ии|ий)?|розпродаж)"
)
_PROMOTION_JOINER = rf"(?: *{_PROMOTION_SEPARATOR} *)? *"
_PERCENT_FIRST = rf"{_RATE_VALUE}(?:{_PROMOTION_JOINER}{_PROMOTION_TERM})?"
_SALE_LEAD = rf"{_PROMOTION_TERM}(?: *{_PROMOTION_SEPARATOR}? *(?:{_PROMOTION_QUALIFIER} +)?{_RATE_VALUE}(?:{_PROMOTION_JOINER}{_PROMOTION_TERM})?)?"
_QUALIFIER_FIRST = rf"{_PROMOTION_QUALIFIER} +{_RATE_VALUE}(?:{_PROMOTION_JOINER}{_PROMOTION_TERM})?"
_PROMOTION_BODY = rf"(?:{_PERCENT_FIRST}|{_SALE_LEAD}|{_QUALIFIER_FIRST})"
_DISCOUNT_ONLY_CTA_PATTERN = re.compile(
    rf"^(?:{_OPEN_PAREN} *)?{_PROMOTION_BODY}(?: *{_CLOSE_PAREN})? *{_TERMINAL_PUNCTUATION}*$",
)


def product_card_cta_label_is_discount_only(value: Any) -> bool:
    """Return whether the whole visible label is only a promotion badge."""

    if not isinstance(value, str):
        return False
    label = normalize_discount_cta_label(value)
    if not label or _PURCHASE_VERB_LABEL_PATTERN.search(label):
        return False
    # Avoid Python re.IGNORECASE's extra Unicode folds (for example dotless-ı
    # "dıscount"), which JavaScript /iu does not accept.
    grammar_label = label.lower()
    return _DISCOUNT_ONLY_CTA_PATTERN.fullmatch(grammar_label) is not None


def product_card_cta_is_reusable(card: Any) -> bool:
    """Return whether assembled CTA evidence is safe for reusable tokens."""

    if not isinstance(card, dict):
        return False
    quality = card.get("evidenceQuality")
    if not isinstance(quality, str) or js_trim(quality).lower() not in {"medium", "strong"}:
        return False
    cta = card.get("cta")
    return (
        isinstance(cta, dict)
        and js_trimmed_nonempty(cta.get("text"))
        and not product_card_cta_label_is_discount_only(cta.get("text"))
        and cta.get("textSource") == "visible-text"
        and cta.get("hasUsableVisibleText") is True
        and cta.get("isIconLike") is not True
    )

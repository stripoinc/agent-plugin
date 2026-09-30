"""Authoritative deterministic native Brand Kit validators.

This module owns the publisher-runtime finalization policy. Schema locations
are resolved from the installed ``business-profile`` skill directory
through :class:`SchemaPaths` rather than module-level environment defaults.
"""

from __future__ import annotations

import copy

from dataclasses import dataclass

import hashlib

import ipaddress

import json

import re

import stat

import unicodedata

from functools import lru_cache

from pathlib import Path

from typing import Any

from urllib.parse import unquote, urlparse

from xml.parsers import expat

import idna

import jsonschema

from publicsuffixlist import PublicSuffixList

from .product_card_cta_evidence import (
    JS_TRIM_CHARS,
    js_trimmed_nonempty,
    product_card_cta_label_is_discount_only,
    product_card_cta_is_reusable,
)

@dataclass(frozen=True)
class SchemaPaths:
    """Resolve schema locations from an explicit skill root.

    Replaces the source repo's ``skill_bundle`` container/repo dual-path
    constants: this runtime always reads schemas from the installed skill
    tree, where ``skill_root`` is the top-level ``business-profile`` skill
    directory and every schema is in its flat ``references`` directory.
    """

    skill_root: Path

    @property
    def skill_schema_path(self) -> Path:
        return self.skill_root / "references" / "schema.json"

PLATFORM_DOMAIN_ALLOWLIST: dict[str, tuple[str, ...]] = {
    "facebook": ("facebook.com", "fb.com", "fb.me"),
    "youtube": ("youtube.com", "youtu.be"),
    "instagram": ("instagram.com",),
    "tiktok": ("tiktok.com",),
    "twitter": ("twitter.com", "x.com"),
    "x": ("x.com", "twitter.com"),
    "snapchat": ("snapchat.com",),
    "pinterest": ("pinterest.com",),
    "linkedin": ("linkedin.com",),
    "android": ("play.google.com",),
    "apple": ("apps.apple.com", "itunes.apple.com"),
    "rss": ("feedburner.com",),
    "yelp": ("yelp.com",),
    "threads": ("threads.net",),
    "discord": ("discord.com", "discordapp.com", "discord.gg"),
    "twitch": ("twitch.tv",),
    "whatsapp": ("wa.me", "whatsapp.com"),
    "viber": ("viber.com",),
    "telegram": ("t.me", "telegram.me", "telegram.org", "telegram.dog"),
    "messenger": ("m.me", "messenger.com", "facebook.com"),
}

SVG_DANGEROUS_PATTERNS = [
    re.compile(r"<\s*(?:[a-z_][\w.-]*:)?script\b", re.IGNORECASE),
    re.compile(r"\bon\w+\s*=", re.IGNORECASE),
    re.compile(r"javascript\s*:", re.IGNORECASE),
    re.compile(r"<\s*(?:[a-z_][\w.-]*:)?iframe\b", re.IGNORECASE),
    # `@import` inside an SVG's own `<style>` pulls a remote stylesheet at
    # RENDER time, and `<foreignObject>` re-opens the full HTML parser inside
    # the image.
    re.compile(r"@import", re.IGNORECASE),
    re.compile(r"<\s*(?:[a-z_][\w.-]*:)?foreignObject\b", re.IGNORECASE),
    # In HTML parsing, an unnamespaced meta element inside SVG can pop out of
    # the foreign-content context and execute a refresh navigation.
    re.compile(r"<\s*(?:[a-z_][\w.-]*:)?meta\b", re.IGNORECASE),
    # Chromium treats elements in the XHTML namespace as live HTML even when
    # they are direct children of an SVG. Rejecting that namespace closes
    # `<h:img>`, `<h:video>`, refresh-meta, and the rest of HTML's growing set
    # of fetch surfaces without trying to enumerate every HTML element.
    re.compile(
        r"xmlns(?:\s*:\s*[a-z_][\w.-]*)?\s*=\s*[\x22\x27]http://www\.w3\.org/1999/xhtml[\x22\x27]",
        re.IGNORECASE,
    ),
    re.compile(
        r"(?<![\w.-])(?:href|xlink:href)\s*=\s*(?:\x22(?!#)|\x27(?!#)|(?![\x22\x27#]))",
        re.IGNORECASE,
    ),
    # Resource-bearing attributes are unsafe unless they point at an internal
    # fragment. The XHTML namespace is rejected above, but this also protects
    # unusual renderer extensions and future SVG elements.
    re.compile(
        r"(?<![\w.-])(?:[a-z_][\w.-]*:)?(?:src|srcset|data|poster|background)\s*=\s*(?:\x22(?!#)|\x27(?!#)|(?![\x22\x27#]))",
        re.IGNORECASE,
    ),
    re.compile(
        r"\burl\s*\(\s*(?:\x22(?!#)|\x27(?!#)|(?![\x22\x27#]))",
        re.IGNORECASE,
    ),
    # CSS treats a backslash as an escape, so raw-string scans can otherwise
    # miss `u\72l(...)` and `@\69mport`. Public logo markup has no legitimate
    # need for CSS escapes; reject them instead of embedding a CSS tokenizer.
    re.compile(r"\\"),
    # After canonicalizing numeric and the five XML named references below,
    # any remaining entity is invalid XML or an HTML-only spelling that a
    # later render pass could decode into active syntax.
    re.compile(r"&(?:#(?:x[0-9a-f]+|[0-9]+)|[a-z][a-z0-9]+);", re.IGNORECASE),
    # HTML parsing accepts numeric references without a trailing semicolon.
    # svgPath can later be embedded in HTML, so reject any undecoded numeric
    # reference start left after the strict XML-reference canonicalization.
    re.compile(r"&#"),
    # SMIL mutation can create a remote href at render time without a literal
    # href attribute in the source (`<set attributeName=\"href\" to=...>`).
    re.compile(r"<\s*(?:[a-z_][\w.-]*:)?animate", re.IGNORECASE),
    re.compile(r"<\s*(?:[a-z_][\w.-]*:)?set\b", re.IGNORECASE),
    # CSS image-set accepts a bare string URL, so the existing url() screen is
    # insufficient. Reject both standard and Chromium-prefixed spellings.
    re.compile(r"(?:-webkit-)?image-set\s*\(", re.IGNORECASE),
]

LOGO_ASSET_MAX_BYTES = 256 * 1024

LOGO_SVG_PATH_MAX_CHARS = 16 * 1024

LOGO_MANIFEST_MAX_BYTES = 1024 * 1024

LOGO_MANIFEST_MAX_OBSERVED_URLS = 128

LOGO_MANIFEST_MAX_ENTRIES = 128

SVG_NAMESPACE = "http://www.w3.org/2000/svg"

XLINK_NAMESPACE = "http://www.w3.org/1999/xlink"

XML_NAMESPACE = "http://www.w3.org/XML/1998/namespace"

_SVG_XML_NAMED_REFERENCES = {
    "amp": "&",
    "lt": "<",
    "gt": ">",
    "quot": '"',
    "apos": "'",
}

_SVG_CHARACTER_REFERENCE_RE = re.compile(
    r"&#(?:x([0-9a-f]+)|([0-9]+));|&([a-z][a-z0-9]+);",
    re.IGNORECASE,
)

def _canonicalize_svg_for_safety_scan(svg: str) -> str:
    """Decode render-active XML references before applying safety patterns.

    Repeated passes cover values escaped for more than one serialization
    boundary (for example ``&amp;#114;``). Unknown or invalid references are
    retained so the residual-reference safety pattern rejects them.
    """

    def decode(match: re.Match[str]) -> str:
        hexadecimal, decimal, named = match.groups()
        if named is not None:
            return _SVG_XML_NAMED_REFERENCES.get(named.lower(), match.group(0))
        try:
            codepoint = int(hexadecimal, 16) if hexadecimal is not None else int(decimal)
        except (TypeError, ValueError):
            return match.group(0)
        if codepoint > 0x10FFFF or 0xD800 <= codepoint <= 0xDFFF:
            return match.group(0)
        return chr(codepoint)

    canonical = svg
    for _ in range(8):
        decoded = _SVG_CHARACTER_REFERENCE_RE.sub(decode, canonical)
        if decoded == canonical:
            break
        canonical = decoded
    return canonical

_SVG_FRAGMENT_WRAPPER_START = (
    '<svg xmlns="http://www.w3.org/2000/svg" '
    'xmlns:xlink="http://www.w3.org/1999/xlink">'
)

_SVG_ASCII_XML_NAME_RE = re.compile(r"[A-Za-z_][A-Za-z0-9_.:-]*\Z")

_SVG_ROOT_RE = re.compile(r"<svg\b[^>]*>(.*)</svg>", re.IGNORECASE | re.DOTALL)

_SVG_SHAPE_RE = re.compile(
    r"<(path|rect|circle|ellipse|line|polyline|polygon)\b[^>]*\s*/>"
    r"|<(path|rect|circle|ellipse|line|polyline|polygon)\b[^>]*>.*?</\2>",
    re.IGNORECASE | re.DOTALL,
)

_JS_TRIM_RE = re.compile(
    r"^[\u0009\u000b\u000c\u0020\u00a0\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff\n\r\u2028\u2029]+"
    r"|[\u0009\u000b\u000c\u0020\u00a0\u1680\u2000-\u200a\u202f\u205f\u3000\ufeff\n\r\u2028\u2029]+$"
)

_SVG_RESOURCE_ATTRIBUTE_NAMES = frozenset(
    {"href", "src", "srcset", "data", "poster", "background"}
)

_SVG_LOCAL_FRAGMENT_RE = re.compile(r"#[^\s,]*\Z")

_SHA256_HEX_RE = re.compile(r"[0-9a-f]{64}\Z")

def _svg_inner_markup_is_unsafe(svg: str) -> bool:
    """Fail closed unless ``svg`` is safe under XML and HTML parsing.

    ``svgPath`` is inserted as the inner markup of an outer SVG. Strictly
    parsing the wrapped fragment gives comments, CDATA, entities, attributes,
    and nested SVG elements their real structural meaning. Two XML constructs
    still diverge when the fragment is embedded by an HTML parser: processing
    instructions become bogus comments, and CDATA inside SVG ``title``/``desc``
    integration points is tokenized as HTML. Reject those constructs so their
    contents cannot disguise a tag that closes the consumer's wrapper.
    """

    invalid_name = False
    unsafe_html_embedding = False
    open_elements: list[str] = []

    def check_names(name: str, attributes: dict[str, str]) -> None:
        nonlocal invalid_name, unsafe_html_embedding
        if any(parent in {"title", "desc"} for parent in open_elements):
            unsafe_html_embedding = True
        if _SVG_ASCII_XML_NAME_RE.fullmatch(name) is None or any(
            _SVG_ASCII_XML_NAME_RE.fullmatch(attribute) is None
            for attribute in attributes
        ):
            invalid_name = True
        open_elements.append(name.lower())

    def close_element(_name: str) -> None:
        if open_elements:
            open_elements.pop()

    def reject_processing_instruction(_target: str, _data: str) -> None:
        nonlocal unsafe_html_embedding
        unsafe_html_embedding = True

    def check_cdata() -> None:
        nonlocal unsafe_html_embedding
        if any(name in {"title", "desc"} for name in open_elements):
            unsafe_html_embedding = True

    parser = expat.ParserCreate()
    parser.StartElementHandler = check_names
    parser.EndElementHandler = close_element
    parser.ProcessingInstructionHandler = reject_processing_instruction
    parser.StartCdataSectionHandler = check_cdata
    parser.SetParamEntityParsing(expat.XML_PARAM_ENTITY_PARSING_NEVER)
    try:
        parser.Parse(f"{_SVG_FRAGMENT_WRAPPER_START}{svg}</svg>", True)
    except (expat.ExpatError, ValueError):
        return True
    return invalid_name or unsafe_html_embedding

URL_PATTERN = re.compile(r"https?://[^\s\"')]+", re.IGNORECASE)

PRODUCT_CARD_CTA_HINT = "product-card-cta"

BUTTON_PRIMARY_HOVER_BACKGROUND_HINT = "button-primary-hover-background"

CANONICAL_USAGE_HINTS = {
    "brand-primary-accent",
    "brand-secondary-accent",
    "promo-accent",
    "promo-surface-accent",
    "promo-surface-background",
    "canvas-background",
    "content-background",
    "header-background",
    "footer-background",
    "product-card-surface-background",
    "heading-text",
    "body-text",
    "link",
    "link-text",
    "link-promo",
    "header-link",
    "footer-text",
    "footer-link",
    "button-primary-background",
    "button-primary-text",
    "button-primary-hover-background",
    "button-secondary-background",
    "button-secondary-text",
    "product-card-cta-background",
    "product-card-cta-text",
    "product-card-cta-hover-background",
    "product-card-cta-border",
    "price-current",
    "price-old",
    "divider",
    "border-subtle",
    "body-typography",
    "heading-typography",
    "header-typography",
    "footer-typography",
    "button-typography",
    "product-name-typography",
    "product-price-typography",
    "product-old-price-typography",
    "product-card-cta",
}

NONCANONICAL_USAGE_HINT_WARNING = (
    "Final brandkit contains usageHints outside the canonical extraction contract."
)

PRODUCT_CARD_CTA_FALLBACK_ADVISORY = (
    "Product-card CTA lacks medium/strong reusable visible-text evidence; downstream should use primary button fallback for reusable text CTA tokens."
)

PRODUCT_CARD_CTA_AUTHORED_ADAPTATION_ADVISORY = (
    "Product-card CTA uses an explicit authored adaptation instead of observed reusable visible-text evidence; downstream may use the encoded label while retaining that distinction."
)

PRODUCT_CARD_CTA_REUSABLE_HINT_WARNING = (
    "Reusable product-card-cta hint is present, but no medium/strong visible-text product-card CTA evidence supports it."
)

WRONG_SITE_IDENTITY_BLOCKER = (
    "Final brandkit website identifies a different site than this extraction run"
)

INVENTED_ASSET_URL_BLOCKER = (
    "Final brandkit logo URL is absent from this run's captured asset evidence"
)

UNSAFE_ASSET_URL_BLOCKER = "Final brandkit logo URL is not a safe public asset URL"

UNSAFE_SVG_BLOCKER = "Final brandkit logo SVG contains a dangerous pattern"

UNBOUND_SVG_BLOCKER = (
    "Final brandkit logo SVG is not exactly bound to this run's captured logo evidence"
)

PRODUCT_CARD_CTA_ICON_ONLY_MIRROR_LEAK_BLOCKER = (
    "Product-card CTA layoutIntent is icon-only, so no brand.components.button or brand.typography entry may carry the product-card-cta usage hint; the icon-only path must keep that hint exclusive to productCard.cta."
)

PRODUCT_CARD_CTA_LAYOUT_INTENT_INCOHERENT_BLOCKER = (
    "Product-card CTA layoutIntent and hasUsableVisibleText are incoherent: icon-only requires hasUsableVisibleText=false, while content-sized or full-width requires hasUsableVisibleText=true."
)

WORKER_LOCAL_PUBLIC_PATH_TOKEN_RE = re.compile(
    r"(^|[\s\"'(<\[{:=,;>])"
    r"(?:file://)?"
    r"/(?:app/artifacts|etc/codex|workspace|output|home/codex)"
    r"(?=$|[\/\\\s\"'`\)\]}>:,;])",
    re.IGNORECASE,
)

SCRATCH_PUBLIC_ARTIFACT_TOKEN_RE = re.compile(
    r"(^|[\s\"'(<\[{:=,;>])"
    r"(?:\./)?scratch/[^\s\"'`\)\]}>:,;]*",
    re.IGNORECASE,
)

PUBLIC_DEBUG_FIELD_NAMES = {
    "selector",
    "selectors",
    "localPath",
    "local_path",
    "path",
    "paths",
    "debug",
    "trace",
    "screenshot",
    "screenshots",
    "scratchPath",
    "scratch_path",
    "domId",
    "dom_id",
    "className",
    "classList",
    "coordinates",
}

@dataclass
class SemanticValidationResult:
    errors: list[str]
    warnings: list[str]

class SchemaLoadError(RuntimeError):
    """The installed public schema is missing, unreadable, or corrupt."""

@lru_cache(maxsize=None)
def load_schema(schema_path: Path) -> dict[str, Any]:
    # The runtime resolves one installed path through SchemaPaths. Missing or
    # corrupt schema bytes are installation failures, never input findings.
    try:
        return json.loads(schema_path.read_text(encoding="utf-8"))
    except OSError as exc:
        raise SchemaLoadError(f"Cannot load skill schema at {schema_path}: {exc}") from exc
    except ValueError as exc:
        # Covers json.JSONDecodeError and UnicodeDecodeError: the schema file
        # exists but its bytes are not a valid JSON document.
        raise SchemaLoadError(f"Skill schema at {schema_path} is corrupt: {exc}") from exc

def validate_brandkit_payload(
    payload: dict[str, Any],
    schema_path: Path,
    *,
    semantic_warnings_out: list[str] | None = None,
) -> dict[str, Any]:
    """Validate one in-memory public Brand Kit before any persistence."""
    jsonschema.validate(payload, load_schema(schema_path))
    findings = validate_brandkit_semantics(payload)
    if findings.errors:
        raise jsonschema.ValidationError("\n".join(findings.errors))
    if semantic_warnings_out is not None:
        semantic_warnings_out.extend(findings.warnings)
    return payload

def validate_brandkit_file(
    json_path: Path,
    schema_path: Path,
    *,
    semantic_warnings_out: list[str] | None = None,
) -> dict[str, Any]:
    """Read-only file entry point used by the installed JavaScript validator."""
    payload = json.loads(json_path.read_text(encoding="utf-8"))
    return validate_brandkit_payload(
        payload,
        schema_path,
        semantic_warnings_out=semantic_warnings_out,
    )


def _decode_for_path_scan(value: str) -> str:
    decoded = value.replace("\\", "/")
    for _ in range(3):
        next_decoded = unquote(decoded).replace("\\", "/")
        if next_decoded == decoded:
            break
        decoded = next_decoded
    return decoded

def _contains_worker_local_public_path(value: str) -> bool:
    decoded = _decode_for_path_scan(value)
    scan_text = URL_PATTERN.sub(" ", decoded)
    return WORKER_LOCAL_PUBLIC_PATH_TOKEN_RE.search(scan_text) is not None

def _contains_public_scratch_artifact_ref(value: str) -> bool:
    decoded = _decode_for_path_scan(value)
    scan_text = URL_PATTERN.sub(" ", decoded)
    return SCRATCH_PUBLIC_ARTIFACT_TOKEN_RE.search(scan_text) is not None

def _raise_on_unsafe_public_strings(value: Any, *, path: str = "$") -> None:
    if isinstance(value, str):
        if _contains_worker_local_public_path(value):
            raise jsonschema.ValidationError(f"Unsafe worker-local path at {path}")
        if _contains_public_scratch_artifact_ref(value):
            raise jsonschema.ValidationError(f"Unsafe scratch artifact reference at {path}")
        return
    if isinstance(value, list):
        for index, item in enumerate(value):
            _raise_on_unsafe_public_strings(item, path=f"{path}[{index}]")
        return
    if isinstance(value, dict):
        for key, child in value.items():
            if key in PUBLIC_DEBUG_FIELD_NAMES:
                raise jsonschema.ValidationError(f"Unsafe debug field at {path}.{key}")
            _raise_on_unsafe_public_strings(child, path=f"{path}.{key}")

def _iter_usage_hint_records(brandkit: dict[str, Any]):
    brand = brandkit.get("brand", {})
    colors = brand.get("colors", {})
    if isinstance(colors, dict):
        for color_group in ("accentColors", "backgroundColors", "textColors"):
            records = colors.get(color_group, [])
            if isinstance(records, list):
                for index, record in enumerate(records):
                    yield f"brand.colors.{color_group}[{index}]", record

    typography = brand.get("typography", [])
    if isinstance(typography, list):
        for index, record in enumerate(typography):
            yield f"brand.typography[{index}]", record

    buttons = brand.get("components", {}).get("button", [])
    if isinstance(buttons, list):
        for index, record in enumerate(buttons):
            yield f"brand.components.button[{index}]", record

def _record_usage_hints(record: Any) -> list[str]:
    if not isinstance(record, dict):
        return []
    usage_hints = record.get("usageHints")
    if not isinstance(usage_hints, list):
        return []
    return [hint for hint in usage_hints if isinstance(hint, str) and hint.strip()]

def _has_product_card_cta_usage_hint(brandkit: dict[str, Any]) -> bool:
    return _has_product_card_cta_button(brandkit) or _has_product_card_cta_typography(brandkit)

def _product_card_cta_is_reusable(card: Any) -> bool:
    """Compatibility alias for the shared product-card CTA predicate."""

    return product_card_cta_is_reusable(card)

def _product_card_cta_needs_text_fallback(card: Any) -> bool:
    if not isinstance(card, dict):
        return False
    return not _product_card_cta_is_reusable(card)


def _product_card_cta_is_authored_adaptation(card: Any) -> bool:
    if not isinstance(card, dict):
        return False
    cta = card.get("cta")
    return (
        isinstance(cta, dict)
        and js_trimmed_nonempty(cta.get("text"))
        and cta.get("textSource") == "inferred"
    )

def _product_card_cta_contract_warnings(brandkit: dict[str, Any]) -> list[str]:
    cards = brandkit.get("brand", {}).get("components", {}).get("productCard", [])
    if not isinstance(cards, list):
        return []
    warnings: list[str] = []
    has_reusable_hint = _has_product_card_cta_usage_hint(brandkit)
    has_reusable_card = any(_product_card_cta_is_reusable(card) for card in cards)
    for card in cards:
        if not isinstance(card, dict):
            continue
        if _product_card_cta_needs_text_fallback(card):
            warnings.append(
                PRODUCT_CARD_CTA_AUTHORED_ADAPTATION_ADVISORY
                if _product_card_cta_is_authored_adaptation(card)
                else PRODUCT_CARD_CTA_FALLBACK_ADVISORY
            )
        if has_reusable_hint and not has_reusable_card and not _product_card_cta_is_reusable(card):
            warnings.append(PRODUCT_CARD_CTA_REUSABLE_HINT_WARNING)
    return _dedupe_messages(warnings)

def _dedupe_messages(messages: list[str]) -> list[str]:
    return list(dict.fromkeys(messages))

def _numeric_value(record: Any, key: str) -> float | None:
    if not isinstance(record, dict):
        return None
    raw = record.get(key)
    if isinstance(raw, bool) or not isinstance(raw, (int, float)):
        return None
    try:
        value = float(raw)
    except (TypeError, ValueError):
        return None
    return value if value > 0 else None

def validate_brandkit_semantics(brandkit: dict[str, Any]) -> SemanticValidationResult:
    errors: list[str] = []
    warnings: list[str] = []
    hover_coherence: list[str] = []

    for record_path, record in _iter_usage_hint_records(brandkit):
        usage_hints = _record_usage_hints(record)
        if not usage_hints:
            errors.append(f"{record_path} must include a non-empty usageHints array.")
        for hint in usage_hints:
            if hint not in CANONICAL_USAGE_HINTS:
                warnings.append(f"{NONCANONICAL_USAGE_HINT_WARNING} {record_path}: {hint}")
        if (
            record_path.startswith("brand.components.button[")
            and BUTTON_PRIMARY_HOVER_BACKGROUND_HINT in usage_hints
            and (not isinstance(record, dict) or record.get("hoverBackgroundColor") is None)
        ):
            # A WARNING, NOT AN ERROR. Pure styling coherence: a button row
            # claims a hover role and carries no hover colour, so the compiler
            # falls through to its own default. Nothing false is published --
            # the field is absent, not wrong -- and refusing the run persists no
            # kit at all.
            #
            hover_coherence.append(
                f"{record_path} uses '{BUTTON_PRIMARY_HOVER_BACKGROUND_HINT}' but is missing "
                "hoverBackgroundColor."
            )

    try:
        _raise_on_unsafe_public_strings(brandkit)
    except jsonschema.ValidationError as exc:
        errors.append(str(exc))
    warnings.extend(_product_card_cta_contract_warnings(brandkit))

    # The compiler's icon-only fallback ignores a leaked mirror, so a warning
    # catches the authoring regression without refusing the whole kit.
    if _product_card_icon_only_mirror_leak(brandkit):
        warnings.append(PRODUCT_CARD_CTA_ICON_ONLY_MIRROR_LEAK_BLOCKER)
    # Component-role coherence is styling; report the contradiction without
    # refusing an otherwise valid public kit.
    if _product_card_cta_layout_intent_incoherent(brandkit):
        warnings.append(PRODUCT_CARD_CTA_LAYOUT_INTENT_INCOHERENT_BLOCKER)
    warnings.extend(hover_coherence)

    return SemanticValidationResult(
        errors=_dedupe_messages(errors),
        warnings=_dedupe_messages(warnings),
    )

def _normalize_host(url: str) -> str:
    try:
        host = (urlparse(url).hostname or "").lower().removeprefix("www.")
        if host:
            try:
                address = ipaddress.ip_address(host)
            except ValueError:
                pass
            else:
                # WHATWG URL.hostname keeps brackets around IPv6 literals;
                # mirror that representation so both validator paths compare
                # the same website identity and canonical factual URLs.
                return f"[{address.compressed}]" if address.version == 6 else address.compressed
        return idna.encode(host, uts46=True).decode("ascii") if host else ""
    except (idna.IDNAError, UnicodeError, ValueError):
        return ""

def _url_matches_domain(url: str, target_base: str) -> bool:
    host = _normalize_host(url)
    if not host or not target_base:
        return False
    return host == target_base or host.endswith(f".{target_base}")

def _url_matches_allowed_domains(url: str, allowed_domains: tuple[str, ...]) -> bool:
    host = _normalize_host(url)
    if not host:
        return False
    return any(host == domain or host.endswith(f".{domain}") for domain in allowed_domains)

def _social_url_matches_platform(platform: str, url: str) -> bool:
    if _url_matches_allowed_domains(url, PLATFORM_DOMAIN_ALLOWLIST.get(platform, ())):
        return True
    host = _normalize_host(url)
    if platform in {"pinterest", "yelp"} and host:
        registrable = _social_public_suffix_list().privatesuffix(host) or ""
        return registrable.split(".", 1)[0] == platform
    return False

@lru_cache(maxsize=1)
def _social_public_suffix_list() -> PublicSuffixList:
    """ICANN-only PSL for recognizing a platform's registrable domain."""
    return PublicSuffixList(only_icann=True)

def _iter_description_values(value: Any):
    if isinstance(value, dict):
        for key, child in value.items():
            if key == "description" and isinstance(child, str):
                yield child
            else:
                yield from _iter_description_values(child)
    elif isinstance(value, list):
        for item in value:
            yield from _iter_description_values(item)

def _allowed_text_domains() -> tuple[str, ...]:
    return tuple(sorted({domain for domains in PLATFORM_DOMAIN_ALLOWLIST.values() for domain in domains}))

class TechnicalArtifactUnreadableError(RuntimeError):
    """A present current-run evidence artifact is unreadable or malformed."""

def _has_product_card_cta_button(brandkit: dict[str, Any]) -> bool:
    buttons = brandkit.get("brand", {}).get("components", {}).get("button", [])
    if not isinstance(buttons, list):
        return False
    return any(PRODUCT_CARD_CTA_HINT in _record_usage_hints(record) for record in buttons)

def _has_product_card_cta_typography(brandkit: dict[str, Any]) -> bool:
    typography = brandkit.get("brand", {}).get("typography", [])
    if not isinstance(typography, list):
        return False
    return any(
        PRODUCT_CARD_CTA_HINT in _record_usage_hints(record) and _has_useful_typography(record)
        for record in typography
    )

def _has_useful_typography(record: Any) -> bool:
    if not isinstance(record, dict):
        return False
    return bool(str(record.get("family") or "").strip() and _numeric_value(record, "sizePx") is not None)

def _product_card_icon_only_mirror_leak(brandkit: dict[str, Any]) -> bool:
    cards = brandkit.get("brand", {}).get("components", {}).get("productCard")
    if not isinstance(cards, list):
        return False
    for card in cards:
        if not isinstance(card, dict):
            continue
        cta = card.get("cta") if isinstance(card.get("cta"), dict) else None
        if not cta:
            continue
        if cta.get("layoutIntent") != "icon-only":
            continue
        if _has_product_card_cta_button(brandkit) or _has_product_card_cta_typography(brandkit):
            return True
    return False

def _product_card_cta_layout_intent_incoherent(brandkit: dict[str, Any]) -> bool:
    cards = brandkit.get("brand", {}).get("components", {}).get("productCard")
    if not isinstance(cards, list):
        return False
    for card in cards:
        if not isinstance(card, dict):
            continue
        cta = card.get("cta") if isinstance(card.get("cta"), dict) else None
        if not cta:
            continue
        if cta.get("layoutIntent") == "icon-only" and cta.get("hasUsableVisibleText") is True:
            return True
    return False

def _collect_unknown_text_urls(
    value: Any,
    *,
    target_base: str,
    observed_asset_urls: set[str],
) -> list[str]:
    warnings: list[str] = []
    allowed_domains = _allowed_text_domains()
    if isinstance(value, str):
        for match in URL_PATTERN.findall(value):
            if not (
                _url_matches_domain(match, target_base)
                or _url_matches_allowed_domains(match, allowed_domains)
                or match in observed_asset_urls
            ):
                warnings.append(f"Text field contains URL to unexpected domain: {match}")
    elif isinstance(value, list):
        for item in value:
            warnings.extend(
                _collect_unknown_text_urls(
                    item,
                    target_base=target_base,
                    observed_asset_urls=observed_asset_urls,
                )
            )
    elif isinstance(value, dict):
        for child in value.values():
            warnings.extend(
                _collect_unknown_text_urls(
                    child,
                    target_base=target_base,
                    observed_asset_urls=observed_asset_urls,
                )
            )
    return warnings

def _identity_host(value: Any) -> str | None:
    """Strict, cross-language host parser for the public website identity."""
    if not isinstance(value, str) or not value.strip():
        return None
    raw = value.strip()
    candidate = f"https:{raw}" if raw.startswith("//") else raw
    if "\\" in candidate:
        return None
    try:
        parsed = urlparse(candidate)
        if (
            parsed.scheme.lower() not in {"http", "https"}
            or not parsed.hostname
            or parsed.username is not None
            or parsed.password is not None
            or "%" in parsed.netloc
            or any(character.isspace() for character in parsed.netloc)
        ):
            return None
        parsed.port
    except ValueError:
        return None
    return _normalize_host(candidate) or None

def _identity_hosts_match(host: str, target: str) -> bool:
    if host == target:
        return True
    host_domain = _identity_public_suffix_list().privatesuffix(host) or ""
    target_domain = _identity_public_suffix_list().privatesuffix(target) or ""
    return bool(host_domain and target_domain and host_domain == target_domain)

@lru_cache(maxsize=1)
def _identity_public_suffix_list() -> PublicSuffixList:
    """Bundled Mozilla PSL, including its private section; never network-backed."""
    return PublicSuffixList()

_ASSET_LOCAL_HOST_SUFFIXES = ("localhost", ".localhost", ".local", ".internal")

def _valid_asset_port(value: str) -> bool:
    if not value or not re.fullmatch(r"[0-9]+", value):
        return False
    try:
        port = int(value, 10)
    except ValueError:
        return False
    return 1 <= port <= 65535

def _global_asset_ip(ip: ipaddress.IPv4Address | ipaddress.IPv6Address) -> bool:
    """Return whether an IP literal is usable as a public asset host.

    This is a string-policy check only; it performs no DNS resolution and makes
    no SSRF claim for DNS names that later resolve somewhere else.
    """

    # Older Python patch releases classify part of this IANA block as global.
    # Pin the IANA exceptions explicitly across supported Python patch levels.
    if isinstance(ip, ipaddress.IPv4Address) and ip in ipaddress.IPv4Network("192.0.0.0/24"):
        return ip in (ipaddress.IPv4Address("192.0.0.9"), ipaddress.IPv4Address("192.0.0.10"))

    if (
        ip.is_loopback
        or ip.is_private
        or ip.is_link_local
        or ip.is_unspecified
        or ip.is_multicast
        or ip.is_reserved
        or not ip.is_global
    ):
        return False
    if isinstance(ip, ipaddress.IPv6Address):
        # Publicly routed IPv6 unicast lives under 2000::/3. Keep the asset URL
        # gate narrow and reject protocol/documentation ranges even if a
        # language runtime's broad `is_global` classification changes.
        if ip not in ipaddress.IPv6Network("2000::/3"):
            return False
        if ip in ipaddress.IPv6Network("2001:db8::/32"):
            return False
    return True

def _valid_dns_asset_host(host: str) -> bool:
    host = host[:-1] if host.endswith(".") else host
    if not host or "." not in host:
        return False
    try:
        ascii_host = idna.encode(host, uts46=True).decode("ascii").lower()
    except idna.IDNAError:
        return False
    if (
        not ascii_host
        or "." not in ascii_host
        or ascii_host == "localhost"
        or any(ascii_host.endswith(suffix) for suffix in _ASSET_LOCAL_HOST_SUFFIXES[1:])
    ):
        return False
    labels = ascii_host.split(".")
    return all(0 < len(label) <= 63 for label in labels) and len(ascii_host) <= 253

def _valid_asset_authority(authority: str) -> bool:
    if (
        not authority
        or "@" in authority
        or "\\" in authority
        or "%" in authority
        or any(character.isspace() or ord(character) < 32 or ord(character) == 127 for character in authority)
    ):
        return False

    if authority.startswith("["):
        bracket = authority.find("]")
        if bracket <= 1:
            return False
        host = authority[1:bracket]
        port_suffix = authority[bracket + 1 :]
        if port_suffix and not (
            port_suffix.startswith(":") and _valid_asset_port(port_suffix[1:])
        ):
            return False
        try:
            ip = ipaddress.IPv6Address(host)
        except ValueError:
            return False
        return _global_asset_ip(ip)

    if "[" in authority or "]" in authority or authority.count(":") > 1:
        return False
    if ":" in authority:
        host, port = authority.rsplit(":", 1)
        if not _valid_asset_port(port):
            return False
    else:
        host = authority
    if not host:
        return False

    host_without_trailing_dot = host[:-1] if host.endswith(".") else host
    try:
        ip = ipaddress.IPv4Address(host_without_trailing_dot)
    except ValueError:
        if re.fullmatch(r"[0-9]+(?:\.[0-9]+){3}", host_without_trailing_dot):
            return False
        return _valid_dns_asset_host(host)
    return not host.endswith(".") and _global_asset_ip(ip)

def _exact_public_asset_url(value: Any) -> str:
    """Return a byte-exact public HTTP(S) asset URL, or ``""``.

    Same-workflow asset evidence licenses one resource string for consistency
    checks, not a canonical URL identity or authenticated provenance.
    The grammar is deliberately narrower than browser URL parsing: the scheme
    must be exactly lowercase ``http://`` or ``https://``; the authority must
    be non-empty and contain no userinfo, percent escapes, whitespace, control
    bytes, or backslashes; host strings must be public DNS names or globally
    routable IP literals. The returned value is therefore suitable for exact
    set membership only.
    """

    if not isinstance(value, str) or not value or value != value.strip():
        return ""
    if not (value.startswith("http://") or value.startswith("https://")):
        return ""
    if any(character.isspace() or ord(character) < 32 or ord(character) == 127 for character in value):
        return ""
    if "\\" in value:
        return ""
    rest = value[8:] if value.startswith("https://") else value[7:]
    authority = re.split(r"[/?#]", rest, maxsplit=1)[0]
    if not _valid_asset_authority(authority):
        return ""
    try:
        parsed = urlparse(value)
        if (
            parsed.scheme not in {"http", "https"}
            or parsed.netloc != authority
            or not parsed.hostname
            or parsed.username is not None
            or parsed.password is not None
        ):
            return ""
        parsed.port
    except ValueError:
        return ""
    return value


def _is_finite_json_number(value: Any) -> bool:
    return (
        isinstance(value, (int, float))
        and not isinstance(value, bool)
        and value not in {float("inf"), float("-inf")}
        and value == value
    )

def _svg_markup_is_safe(svg: Any) -> bool:
    if not isinstance(svg, str) or not svg:
        return False
    canonical_svg = _canonicalize_svg_for_safety_scan(svg)
    return not any(pattern.search(canonical_svg) for pattern in SVG_DANGEROUS_PATTERNS) and not _svg_inner_markup_is_unsafe(svg)

def _svg_markup_sha256(svg: str) -> str:
    return hashlib.sha256(svg.encode("utf-8")).hexdigest()

def _is_sha256_hex(value: Any) -> bool:
    return isinstance(value, str) and _SHA256_HEX_RE.fullmatch(value) is not None

def _split_expanded_xml_name(name: str) -> tuple[str, str]:
    if "}" not in name:
        return "", name
    namespace, local_name = name.rsplit("}", 1)
    return namespace, local_name

def _producer_svg_payload(svg: str) -> tuple[str, int, int]:
    """Reproduce ``svgPathPayloadFromMarkup`` fields used by the JS producer."""

    root_match = _SVG_ROOT_RE.search(svg)
    svg_path = _JS_TRIM_RE.sub("", root_match.group(1)) if root_match else ""
    shapes = list(_SVG_SHAPE_RE.finditer(svg))
    path_count = sum(
        1
        for shape in shapes
        if (shape.group(1) or shape.group(2) or "").lower() == "path"
    )
    return svg_path, path_count, len(shapes)

class SvgSidecarValidationError(ValueError):
    """The local SVG sidecar is unsafe, corrupt, or not its manifest asset."""

def _validate_standalone_svg_document(svg: str) -> None:
    """Reject a standalone SVG unless its complete XML document is inert."""

    canonical_svg = _canonicalize_svg_for_safety_scan(svg)
    for pattern in SVG_DANGEROUS_PATTERNS:
        if pattern.search(canonical_svg):
            raise SvgSidecarValidationError(
                f"document contains dangerous SVG pattern {pattern.pattern}"
            )

    unsafe = False
    unsafe_reason = ""
    depth = 0
    root_count = 0

    def reject(reason: str) -> None:
        nonlocal unsafe, unsafe_reason
        unsafe = True
        if not unsafe_reason:
            unsafe_reason = reason

    def check_element(name: str, attributes: dict[str, str]) -> None:
        nonlocal depth, root_count
        namespace, local_name = _split_expanded_xml_name(name)
        if depth == 0:
            root_count += 1
            if namespace != SVG_NAMESPACE or local_name.lower() != "svg":
                reject("document root is not an SVG element in the SVG namespace")
        if namespace != SVG_NAMESPACE:
            reject("document contains an element outside the SVG namespace")
        if _SVG_ASCII_XML_NAME_RE.fullmatch(local_name) is None:
            reject("document contains a non-ASCII XML element name")

        for raw_name, value in attributes.items():
            attribute_namespace, attribute_name = _split_expanded_xml_name(raw_name)
            if attribute_namespace not in {"", XLINK_NAMESPACE, XML_NAMESPACE}:
                reject("document contains an attribute in an unsafe XML namespace")
            if _SVG_ASCII_XML_NAME_RE.fullmatch(attribute_name) is None:
                reject("document contains a non-ASCII XML attribute name")
            lowered_name = attribute_name.lower()
            if lowered_name.startswith("on"):
                reject("document contains an event-handler attribute")
            if lowered_name in _SVG_RESOURCE_ATTRIBUTE_NAMES:
                if (
                    not isinstance(value, str)
                    or _SVG_LOCAL_FRAGMENT_RE.fullmatch(value.strip()) is None
                ):
                    reject("document contains an external resource reference")
        depth += 1

    def close_element(_name: str) -> None:
        nonlocal depth
        depth -= 1

    def check_xml_declaration(
        _version: str, encoding: str | None, _standalone: int
    ) -> None:
        if encoding is not None and encoding.lower().replace("_", "-") != "utf-8":
            reject("document declares a non-UTF-8 encoding")

    parser = expat.ParserCreate(namespace_separator="}")
    # Declarations are inert on their own. Expat expands every namespace use,
    # and the element/attribute checks above reject foreign expanded names.
    parser.StartElementHandler = check_element
    parser.EndElementHandler = close_element
    parser.XmlDeclHandler = check_xml_declaration
    parser.ProcessingInstructionHandler = lambda _target, _data: reject(
        "document contains a processing instruction"
    )
    parser.StartDoctypeDeclHandler = lambda *_args: reject(
        "document contains a doctype declaration"
    )
    parser.EntityDeclHandler = lambda *_args: reject(
        "document contains an entity declaration"
    )
    parser.ExternalEntityRefHandler = lambda *_args: (
        reject("document contains an external entity reference") or 0
    )
    parser.SetParamEntityParsing(expat.XML_PARAM_ENTITY_PARSING_NEVER)
    try:
        parser.Parse(svg.removeprefix("\ufeff"), True)
    except (expat.ExpatError, ValueError) as exc:
        raise SvgSidecarValidationError("document is malformed XML") from exc

    if root_count != 1:
        raise SvgSidecarValidationError("document must contain exactly one SVG root")
    if unsafe:
        raise SvgSidecarValidationError(unsafe_reason or "document is unsafe")

@dataclass(frozen=True)
class ValidatedSvgSidecar:
    """A bounded, safe local SVG sidecar with re-derived producer metadata."""

    path: Path
    data: bytes
    svg_path: str
    byte_length: int
    path_count: int
    shape_count: int
    svg_path_sha256: str

def validate_svg_sidecar_for_upload(
    sidecar_path: Path,
    entry: dict[str, Any],
    *,
    enforce_svg_path_cap: bool = True,
) -> ValidatedSvgSidecar:
    """Validate and bind the exact local SVG bytes before any remote call.

    ``enforce_svg_path_cap`` is ``False`` on exactly one path: an entry the
    producer suppressed as ``over-cap``.  ``LOGO_SVG_PATH_MAX_CHARS`` is a cap
    on the string this pipeline PUBLISHES as ``brand.logos[].svgPath``, and
    hosting uploads the ORIGINAL DOCUMENT instead — a safe 22 KB mark whose
    reduction is too long to publish is still a safe 22 KB mark.  Nothing else
    relaxes: the byte cap, the standalone-document scan, the dangerous-pattern
    scan and the inner-markup scan all still decide, so the producer's label is
    a routing hint and never the safety authority.  Two checks TIGHTEN in that
    mode instead — the manifest must carry the empty ``svgPath`` that
    suppression implies, and the re-derived payload must actually exceed the
    cap, so a mislabelled row cannot take this door.
    """

    with sidecar_path.open("rb") as sidecar_file:
        data = sidecar_file.read(LOGO_ASSET_MAX_BYTES + 1)
    if not data:
        raise SvgSidecarValidationError("sidecar is empty")
    if len(data) > LOGO_ASSET_MAX_BYTES:
        raise SvgSidecarValidationError(
            f"sidecar exceeds the {LOGO_ASSET_MAX_BYTES}-byte safety limit"
        )
    try:
        svg = data.decode("utf-8", errors="strict")
    except UnicodeDecodeError as exc:
        raise SvgSidecarValidationError("sidecar is not strict UTF-8") from exc

    _validate_standalone_svg_document(svg)
    svg_path, path_count, shape_count = _producer_svg_payload(svg)
    if not svg_path:
        raise SvgSidecarValidationError("producer svgPath is empty")
    svg_path_js_length = len(svg_path.encode("utf-16-le")) // 2
    if enforce_svg_path_cap:
        if svg_path_js_length > LOGO_SVG_PATH_MAX_CHARS:
            raise SvgSidecarValidationError(
                f"producer svgPath exceeds the {LOGO_SVG_PATH_MAX_CHARS}-character safety limit"
            )
    elif svg_path_js_length <= LOGO_SVG_PATH_MAX_CHARS:
        raise SvgSidecarValidationError(
            "sidecar producer svgPath is within the cap, so it was not suppressed as over-cap"
        )
    canonical_svg_path = _canonicalize_svg_for_safety_scan(svg_path)
    if any(pattern.search(canonical_svg_path) for pattern in SVG_DANGEROUS_PATTERNS):
        raise SvgSidecarValidationError("producer svgPath contains dangerous markup")
    if _svg_inner_markup_is_unsafe(svg_path):
        raise SvgSidecarValidationError("producer svgPath is not safe XML/HTML markup")

    manifest_svg_path = entry.get("svgPath")
    # An over-cap row published NOTHING, so the manifest must say so; any other
    # row must carry the exact string the sidecar reduces to.
    expected_manifest_svg_path = svg_path if enforce_svg_path_cap else ""
    if (
        not isinstance(manifest_svg_path, str)
        or manifest_svg_path != expected_manifest_svg_path
    ):
        raise SvgSidecarValidationError(
            "sidecar producer svgPath does not match logo-assets.json"
        )

    for field, actual in {
        "byteLength": len(data),
        "pathCount": path_count,
        "shapeCount": shape_count,
    }.items():
        if field not in entry:
            continue
        expected = entry[field]
        if (
            isinstance(expected, bool)
            or not isinstance(expected, int)
            or expected != actual
        ):
            raise SvgSidecarValidationError(
                f"sidecar {field} does not match logo-assets.json"
            )

    return ValidatedSvgSidecar(
        path=sidecar_path,
        data=data,
        svg_path=svg_path,
        byte_length=len(data),
        path_count=path_count,
        shape_count=shape_count,
        svg_path_sha256=_svg_markup_sha256(svg_path),
    )

_RASTER_MAGIC_PREFIXES: tuple[tuple[bytes, str], ...] = (
    (b"\x89PNG\r\n\x1a\n", "png"),
    (b"\xff\xd8\xff", "jpg"),
    (b"GIF87a", "gif"),
    (b"GIF89a", "gif"),
)

def _raster_image_format(data: bytes) -> str:
    """Return the sniffed raster format, or "" when the bytes are not an image."""

    for prefix, name in _RASTER_MAGIC_PREFIXES:
        if data.startswith(prefix):
            return name
    if len(data) >= 12:
        if data[0:4] == b"RIFF" and data[8:12] == b"WEBP":
            return "webp"
        if data[4:8] == b"ftyp" and data[8:12] in {b"avif", b"avis"}:
            return "avif"
    return ""

@dataclass(frozen=True)
class ValidatedRasterSidecar:
    """Bounded local raster logo bytes bound to the digest the capture recorded."""

    path: Path
    data: bytes
    byte_length: int
    sha256: str
    image_format: str

def validate_raster_sidecar_for_upload(
    sidecar_path: Path,
    entry: dict[str, Any],
) -> ValidatedRasterSidecar:
    """Bind the exact local raster bytes before any remote call.

    The SVG sibling re-derives a publishable string and compares it with the
    manifest; a raster asset has no such projection, so the DIGEST is the whole
    binding: the capture recorded what the browser delivered, and this checks
    that the bytes on disk are still those bytes.  Nothing here decodes — that
    is the conversion's job and its failure is fail-open.
    """

    with sidecar_path.open("rb") as sidecar_file:
        data = sidecar_file.read(LOGO_ASSET_MAX_BYTES + 1)
    if not data:
        raise SvgSidecarValidationError("sidecar is empty")
    if len(data) > LOGO_ASSET_MAX_BYTES:
        raise SvgSidecarValidationError(
            f"sidecar exceeds the {LOGO_ASSET_MAX_BYTES}-byte safety limit"
        )
    image_format = _raster_image_format(data)
    if not image_format:
        raise SvgSidecarValidationError("sidecar bytes are not a recognised raster image")
    digest = hashlib.sha256(data).hexdigest()
    manifest_digest = entry.get("sha256")
    if not _is_sha256_hex(manifest_digest) or manifest_digest != digest:
        raise SvgSidecarValidationError("sidecar sha256 does not match logo-assets.json")
    manifest_length = _manifest_int(entry, "byteLength")
    if manifest_length is None or manifest_length != len(data):
        raise SvgSidecarValidationError("sidecar byteLength does not match logo-assets.json")
    return ValidatedRasterSidecar(
        path=sidecar_path,
        data=data,
        byte_length=len(data),
        sha256=digest,
        image_format=image_format,
    )

def _manifest_int(row: dict[str, Any], field: str) -> int | None:
    value = row.get(field)
    if isinstance(value, bool) or not isinstance(value, int):
        return None
    return value

def _logo_asset_entry_kind_is_svg(row: dict[str, Any]) -> bool:
    kind = row.get("kind")
    return kind is None or kind == "svg"

def _logo_asset_suppression_matches(row: dict[str, Any], *, over_cap: bool) -> bool:
    if over_cap:
        return (
            row.get("svgPathSuppressed") is True
            and row.get("svgPathSuppressedReason") == "over-cap"
        )
    return row.get("svgPathSuppressed") is False

def _is_complete_external_logo_asset_entry(row: Any, *, over_cap: bool = False) -> bool:
    return (
        isinstance(row, dict)
        and _logo_asset_entry_kind_is_svg(row)
        and row.get("source") == "page-response"
        and bool(_exact_public_asset_url(row.get("url")))
        and isinstance(row.get("contentType"), str)
        and _manifest_int(row, "byteLength") is not None
        and row["byteLength"] > 0
        and isinstance(row.get("localPath"), str)
        and isinstance(row.get("sidecarPath"), str)
        and isinstance(row.get("svgPath"), str)
        and _logo_asset_suppression_matches(row, over_cap=over_cap)
        and _manifest_int(row, "pathCount") is not None
        and row["pathCount"] >= 0
        and _manifest_int(row, "shapeCount") is not None
        and row["shapeCount"] >= 0
    )

def _is_complete_raster_logo_asset_entry(row: Any) -> bool:
    """A capture that kept RASTER bytes for finalizer-owned PNG conversion.

    Deliberately NOT a relaxation of the SVG predicate: a raster row has no
    reduced markup and never will, so ``svgPath``/``pathCount``/``shapeCount``
    are pinned to their empty values rather than merely permitted, and
    ``sha256`` - which the SVG path does not carry at all - is required,
    because the digest is the only thing binding these bytes to what the
    browser delivered.
    """

    return (
        isinstance(row, dict)
        and row.get("kind") == "raster"
        # Native bytes come from the exact retained response for the selection.
        and row.get("source") == "page-response"
        and bool(_exact_public_asset_url(row.get("url")))
        and isinstance(row.get("contentType"), str)
        and _manifest_int(row, "byteLength") is not None
        and row["byteLength"] > 0
        and isinstance(row.get("localPath"), str)
        and row.get("sidecarPath") == ""
        and row.get("svgPath") == ""
        and row.get("svgPathSuppressed") is False
        and _is_sha256_hex(row.get("sha256"))
        and _manifest_int(row, "pathCount") == 0
        and _manifest_int(row, "shapeCount") == 0
    )

def _is_complete_inline_logo_asset_entry(row: Any, *, over_cap: bool = False) -> bool:
    return (
        isinstance(row, dict)
        and _logo_asset_entry_kind_is_svg(row)
        and row.get("url") == ""
        and row.get("source") == "inline-svg"
        and isinstance(row.get("contentType"), str)
        and _manifest_int(row, "byteLength") is not None
        and row["byteLength"] > 0
        and isinstance(row.get("localPath"), str)
        and isinstance(row.get("sidecarPath"), str)
        and isinstance(row.get("svgPath"), str)
        and _logo_asset_suppression_matches(row, over_cap=over_cap)
        and _manifest_int(row, "pathCount") is not None
        and row["pathCount"] >= 0
        and _manifest_int(row, "shapeCount") is not None
        and row["shapeCount"] > 0
        and isinstance(row.get("selectionId"), str)
        and bool(row["selectionId"].strip())
        and row.get("sourceKind") in {"inline-svg", "embedded-svg-image"}
        and isinstance(row.get("notes"), dict)
    )

def _resolved_logo_asset_file(technical_dir: Path, raw_path: Any) -> Path | None:
    if not isinstance(raw_path, str) or not raw_path:
        return None
    try:
        assets_root = technical_dir / "logo-assets"
        root_stat = assets_root.lstat()
        if stat.S_ISLNK(root_stat.st_mode) or not stat.S_ISDIR(root_stat.st_mode):
            return None
        assets_root_resolved = assets_root.resolve(strict=True)
        candidate = Path(raw_path)
        # Native manifests are relocatable whole-run artifacts. Absolute paths
        # are stale machine identity, never evidence.
        if candidate.is_absolute():
            return None
        candidate = technical_dir / candidate
        relative_candidate = candidate.relative_to(technical_dir)
        current = technical_dir
        for component in relative_candidate.parts:
            current = current / component
            component_stat = current.lstat()
            if stat.S_ISLNK(component_stat.st_mode):
                return None
        candidate_stat = candidate.lstat()
        if not stat.S_ISREG(candidate_stat.st_mode):
            return None
        resolved = candidate.resolve(strict=True)
        resolved.relative_to(assets_root_resolved)
    except (FileNotFoundError, OSError, RuntimeError, ValueError):
        return None
    return resolved

@dataclass(frozen=True)
class VerifiedLogoSvgAsset:
    """A manifest row bound to the exact local SVG bytes it claims."""

    source_url: str
    source: str
    sidecar: ValidatedSvgSidecar

    @property
    def svg_path(self) -> str:
        return self.sidecar.svg_path

    @property
    def svg_path_sha256(self) -> str:
        return self.sidecar.svg_path_sha256

@dataclass(frozen=True)
class VerifiedLogoRasterAsset:
    """A raster manifest row bound to the exact local bytes it claims."""

    source_url: str
    source: str
    sidecar: ValidatedRasterSidecar

    @property
    def sha256(self) -> str:
        return self.sidecar.sha256

@dataclass(frozen=True)
class LogoAssetEvidence:
    """Closed current-run consistency surfaces for public logo fields.

    The packet catches accidental drift between cooperative same-workflow
    artifacts and final output. It is not an authenticated boundary against
    deliberate same-UID artifact forgery.
    """

    authorized_urls: frozenset[str]
    authorized_svg_bindings: frozenset[tuple[str, str]]
    authorized_inline_svg_hashes: frozenset[str]
    verified_svg_assets: tuple[VerifiedLogoSvgAsset, ...]
    # Hostable sources whose `svgPath` is EMPTY, so neither binding set above
    # can name them: raster bytes (no reduced markup exists) and a safe mark
    # whose reduction was suppressed as over-cap. Neither authorizes a URL -
    # `authorized_urls` still does that - they only say which bytes the
    # finalizer may convert and upload.
    verified_raster_assets: tuple[VerifiedLogoRasterAsset, ...] = ()
    verified_over_cap_svg_assets: tuple[VerifiedLogoSvgAsset, ...] = ()

def _logo_asset_evidence_from_payloads(
    logo_assets: Any,
    *,
    technical_dir: Path,
) -> LogoAssetEvidence:
    authorized_urls: set[str] = set()
    native_observed = (
        logo_assets.get("observedAssetUrls") if isinstance(logo_assets, dict) else None
    )
    for value in native_observed if isinstance(native_observed, list) else []:
        exact = _exact_public_asset_url(value)
        if exact:
            authorized_urls.add(exact)

    authorized_svg_bindings: set[tuple[str, str]] = set()
    authorized_inline_svg_hashes: set[str] = set()
    verified_svg_assets: list[VerifiedLogoSvgAsset] = []
    verified_raster_assets: list[VerifiedLogoRasterAsset] = []
    verified_over_cap_svg_assets: list[VerifiedLogoSvgAsset] = []
    entries = logo_assets.get("entries") if isinstance(logo_assets, dict) else None
    for row in entries if isinstance(entries, list) else []:
        if _is_complete_raster_logo_asset_entry(row):
            # Same evidence discipline as the SVG tier: the page must have
            # published this URL. A raster row grants no URL of its own.
            if row["url"] not in authorized_urls:
                continue
            raster_path = _resolved_logo_asset_file(technical_dir, row.get("localPath"))
            if raster_path is None:
                continue
            try:
                raster_sidecar = validate_raster_sidecar_for_upload(raster_path, row)
            except (OSError, SvgSidecarValidationError):
                continue
            verified_raster_assets.append(
                VerifiedLogoRasterAsset(
                    source_url=row["url"],
                    source=row["source"],
                    sidecar=raster_sidecar,
                )
            )
            continue

        is_external = _is_complete_external_logo_asset_entry(row)
        is_inline = _is_complete_inline_logo_asset_entry(row)
        over_cap = False
        if not is_external and not is_inline:
            # A suppression the producer labelled `over-cap` published nothing,
            # so it cannot appear in either binding set - but its bytes are
            # safe and hostable, and refusing them is what left a real brand
            # mark unusable. The Python validator below still decides safety.
            over_cap = _is_complete_external_logo_asset_entry(
                row, over_cap=True
            ) or _is_complete_inline_logo_asset_entry(row, over_cap=True)
            if not over_cap:
                continue
            is_external = bool(_exact_public_asset_url(row.get("url")))
        source_url = row["url"] if is_external else ""
        if is_external and source_url not in authorized_urls:
            continue
        sidecar_path = _resolved_logo_asset_file(technical_dir, row.get("localPath"))
        if sidecar_path is None:
            continue
        try:
            sidecar = validate_svg_sidecar_for_upload(
                sidecar_path, row, enforce_svg_path_cap=not over_cap
            )
        except (OSError, SvgSidecarValidationError):
            continue
        if (
            sidecar.byte_length != row["byteLength"]
            or sidecar.path_count != row["pathCount"]
            or sidecar.shape_count != row["shapeCount"]
        ):
            continue
        asset = VerifiedLogoSvgAsset(
            source_url=source_url,
            source=row["source"],
            sidecar=sidecar,
        )
        if over_cap:
            # NOT in `verified_svg_assets` and NOT in either binding set: the
            # published `svgPath` is empty, so there is nothing here that could
            # authorize a markup value. Hosting is the only consumer.
            verified_over_cap_svg_assets.append(asset)
            continue
        verified_svg_assets.append(asset)
        if is_external:
            authorized_svg_bindings.add((source_url, sidecar.svg_path_sha256))
        else:
            authorized_inline_svg_hashes.add(sidecar.svg_path_sha256)

    return LogoAssetEvidence(
        authorized_urls=frozenset(authorized_urls),
        authorized_svg_bindings=frozenset(authorized_svg_bindings),
        authorized_inline_svg_hashes=frozenset(authorized_inline_svg_hashes),
        verified_svg_assets=tuple(verified_svg_assets),
        verified_raster_assets=tuple(verified_raster_assets),
        verified_over_cap_svg_assets=tuple(verified_over_cap_svg_assets),
    )

def load_logo_asset_evidence(technical_dir: Path) -> LogoAssetEvidence:
    """Load the bounded canonical native logo manifest.

    A missing manifest authorizes nothing and is valid for a kit without a
    logo. A present malformed manifest fails closed because it may be hiding
    the exact selection/byte binding needed by a public logo.
    """

    manifest_path = technical_dir / "logo-assets.json"
    if not manifest_path.exists():
        manifest = None
    else:
        try:
            manifest_stat = manifest_path.lstat()
            if stat.S_ISLNK(manifest_stat.st_mode) or not stat.S_ISREG(
                manifest_stat.st_mode
            ):
                raise TechnicalArtifactUnreadableError(
                    f"Logo evidence {manifest_path} must be a regular non-symlink file."
                )
            with manifest_path.open("rb") as handle:
                raw = handle.read(LOGO_MANIFEST_MAX_BYTES + 1)
            if len(raw) > LOGO_MANIFEST_MAX_BYTES:
                raise TechnicalArtifactUnreadableError(
                    f"Logo evidence {manifest_path} exceeds the "
                    f"{LOGO_MANIFEST_MAX_BYTES}-byte limit."
                )
            manifest = json.loads(raw.decode("utf-8", errors="strict"))
        except TechnicalArtifactUnreadableError:
            raise
        except (OSError, UnicodeError, json.JSONDecodeError) as exc:
            raise TechnicalArtifactUnreadableError(
                f"Logo evidence {manifest_path} is unreadable: "
                f"{exc.__class__.__name__}: {exc}."
            ) from exc
        if not isinstance(manifest, dict):
            raise TechnicalArtifactUnreadableError(
                f"Logo evidence {manifest_path} must be an object."
            )
        observed = manifest.get("observedAssetUrls")
        entries = manifest.get("entries")
        if manifest.get("artifact") != "logo-assets" or manifest.get("version") != 1:
            raise TechnicalArtifactUnreadableError(
                f"Logo evidence {manifest_path} has an unsupported artifact/version."
            )
        if (
            not isinstance(observed, list)
            or len(observed) > LOGO_MANIFEST_MAX_OBSERVED_URLS
            or not all(isinstance(value, str) for value in observed)
        ):
            raise TechnicalArtifactUnreadableError(
                f"Logo evidence {manifest_path}.observedAssetUrls is malformed or over limit."
            )
        if (
            not isinstance(entries, list)
            or len(entries) > LOGO_MANIFEST_MAX_ENTRIES
            or not all(isinstance(value, dict) for value in entries)
        ):
            raise TechnicalArtifactUnreadableError(
                f"Logo evidence {manifest_path}.entries is malformed or over limit."
            )
        skipped = manifest.get("skipped", [])
        if (
            not isinstance(skipped, list)
            or len(skipped) > LOGO_MANIFEST_MAX_ENTRIES
            or not all(isinstance(value, dict) for value in skipped)
        ):
            raise TechnicalArtifactUnreadableError(
                f"Logo evidence {manifest_path}.skipped is malformed or over limit."
            )
        for index, entry in enumerate(entries):
            if not (
                _is_complete_raster_logo_asset_entry(entry)
                or _is_complete_external_logo_asset_entry(entry)
                or _is_complete_external_logo_asset_entry(entry, over_cap=True)
                or _is_complete_inline_logo_asset_entry(entry)
                or _is_complete_inline_logo_asset_entry(entry, over_cap=True)
            ):
                raise TechnicalArtifactUnreadableError(
                    f"Logo evidence {manifest_path}.entries[{index}] is incomplete or unsupported."
                )

    return _logo_asset_evidence_from_payloads(
        manifest,
        technical_dir=technical_dir,
    )

def _normalized_runtime_logo_bindings(
    runtime_asset_bindings: set[tuple[str, str]] | None,
) -> frozenset[tuple[str, str]]:
    return frozenset(
        (url, digest)
        for url, digest in (runtime_asset_bindings or set())
        if _exact_public_asset_url(url) and _is_sha256_hex(digest)
    )

def _runtime_bound_logo_url(
    url: Any,
    svg_hash: str,
    bindings: frozenset[tuple[str, str]],
) -> bool:
    """Whether this run's own hosting minted *url*.

    TWO ARMS, because a hosted logo row can carry markup or carry none.

    * markup present - the pair must match exactly. That is what rejects a
      one-character or canonical-equivalent mutation of a minted URL: the
      digest names the source the URL was minted FROM.
    * `svgPath` EMPTY - there is no digest on the row to pair with, and there
      never will be: a hosted PNG converted from raster bytes (or from an
      over-cap SVG whose reduction is unpublishable) has no publishable
      markup. The proof is then the URL alone, which is sound because the
      binding set holds only URLs THIS PROCESS received from `upload_image`
      moments ago - it is not an allowlist and nothing agent-authored reaches
      it. Without this arm the finalizer's own mint is reported as an invented
      URL and the run exits 4 on the asset it just created.
    """

    if not isinstance(url, str) or not url:
        return False
    if svg_hash:
        return (url, svg_hash) in bindings
    return any(bound_url == url for bound_url, _ in bindings)

def logo_svg_safety_blockers(brandkit: dict[str, Any]) -> list[str]:
    """Return unsafe/malformed SVG findings without attempting reconciliation."""

    blockers: list[str] = []
    logos = brandkit.get("brand", {}).get("logos", [])
    for index, logo in enumerate(logos if isinstance(logos, list) else []):
        if not isinstance(logo, dict):
            continue
        svg = logo.get("svgPath")
        if not isinstance(svg, str) or not svg:
            continue
        canonical_svg = _canonicalize_svg_for_safety_scan(svg)
        for pattern in SVG_DANGEROUS_PATTERNS:
            if pattern.search(canonical_svg):
                blockers.append(
                    f"{UNSAFE_SVG_BLOCKER}: brand.logos[{index}].svgPath matches "
                    f"{pattern.pattern}."
                )
        if _svg_inner_markup_is_unsafe(svg):
            blockers.append(
                f"{UNSAFE_SVG_BLOCKER}: brand.logos[{index}].svgPath is not "
                "safe well-formed inner markup."
            )
    return _dedupe_messages(blockers)

def detect_native_brandkit_blockers(
    brandkit: dict[str, Any],
    *,
    target_url: str,
    logo_evidence: LogoAssetEvidence,
    runtime_asset_bindings: set[tuple[str, str]] | None = None,
) -> list[str]:
    """Return the final native acceptance blockers.

    Native authoring already produces the public document. Contacts, products,
    voice, context, and social links therefore survive without legacy capture
    sidecars. Machine acceptance remains deliberately narrow: requested-site
    identity, public URL safety, original SVG safety, and exact current-run
    selected-logo binding.
    """

    blockers: list[str] = []
    website = brandkit.get("brand", {}).get("organization", {}).get("website", "")
    website_host = _identity_host(website)
    target_host = _identity_host(target_url)
    if (
        website_host is None
        or target_host is None
        or not _identity_hosts_match(website_host, target_host)
    ):
        blockers.append(
            f"{WRONG_SITE_IDENTITY_BLOCKER}: {website} (run target: {target_url})."
        )

    exact_runtime_bindings = _normalized_runtime_logo_bindings(
        runtime_asset_bindings
    )
    logos = brandkit.get("brand", {}).get("logos", [])
    for index, logo in enumerate(logos if isinstance(logos, list) else []):
        if not isinstance(logo, dict):
            continue
        url = logo.get("url")
        svg = logo.get("svgPath")
        svg_hash = _svg_markup_sha256(svg) if isinstance(svg, str) and svg else ""
        safe_url = _exact_public_asset_url(url) if isinstance(url, str) and url else ""
        runtime_bound = bool(
            safe_url
            and _runtime_bound_logo_url(url, svg_hash, exact_runtime_bindings)
        )
        if isinstance(url, str) and url:
            if not safe_url:
                blockers.append(
                    f"{UNSAFE_ASSET_URL_BLOCKER}: brand.logos[{index}].url contains {url}."
                )
            elif url not in logo_evidence.authorized_urls and not runtime_bound:
                blockers.append(
                    f"{INVENTED_ASSET_URL_BLOCKER}: brand.logos[{index}].url contains {url}."
                )
        if not isinstance(svg, str) or not svg:
            continue
        if not _svg_markup_is_safe(svg):
            blockers.append(
                f"{UNSAFE_SVG_BLOCKER}: brand.logos[{index}].svgPath is unsafe."
            )
            continue
        if safe_url:
            if (
                (url, svg_hash) not in logo_evidence.authorized_svg_bindings
                and not runtime_bound
            ):
                blockers.append(
                    f"{UNBOUND_SVG_BLOCKER}: brand.logos[{index}].svgPath has no exact "
                    "URL/SVG evidence binding."
                )
        elif svg_hash not in logo_evidence.authorized_inline_svg_hashes:
            blockers.append(
                f"{UNBOUND_SVG_BLOCKER}: brand.logos[{index}].svgPath has no exact "
                "inline-SVG evidence binding."
            )
    return _dedupe_messages(blockers)

def validate_brandkit_content(
    brandkit: dict[str, Any],
    *,
    target_url: str,
    observed_asset_urls: set[str] | None = None,
    runtime_asset_bindings: set[tuple[str, str]] | None = None,
) -> list[str]:
    warnings: list[str] = []
    observed_asset_urls = {
        exact
        for value in (observed_asset_urls or set())
        if (exact := _exact_public_asset_url(value))
    }
    target_base = _normalize_host(target_url)

    for logo in brandkit.get("brand", {}).get("logos", []):
        url = logo.get("url", "")
        svg = logo.get("svgPath", "")
        svg_hash = _svg_markup_sha256(svg) if isinstance(svg, str) and svg else ""
        runtime_bound = _runtime_bound_logo_url(
            url, svg_hash, _normalized_runtime_logo_bindings(runtime_asset_bindings)
        )
        if url and not (
            _url_matches_domain(url, target_base)
            or url in observed_asset_urls
            or runtime_bound
        ):
            warnings.append(f"Logo URL points to unexpected domain: {url}")

        if svg:
            canonical_svg = _canonicalize_svg_for_safety_scan(svg)
            for pattern in SVG_DANGEROUS_PATTERNS:
                if pattern.search(canonical_svg):
                    warnings.append(f"SVG path contains dangerous pattern: {pattern.pattern}")
            if _svg_inner_markup_is_unsafe(svg):
                warnings.append("SVG path is not safe well-formed inner markup")

    socials = brandkit.get("socials", {})
    if isinstance(socials, dict):
        for platform, url in socials.items():
            if not isinstance(url, str) or not url.strip():
                continue
            allowed_domains = PLATFORM_DOMAIN_ALLOWLIST.get(platform)
            if _url_matches_domain(url, target_base):
                continue
            if allowed_domains is None:
                continue
            if not _social_url_matches_platform(platform, url):
                warnings.append(f"Social URL '{platform}' points to unexpected domain: {url}")

    for link in brandkit.get("importantLinks", []):
        url = link.get("url", "")
        if url and not _url_matches_domain(url, target_base):
            warnings.append(f"Important link points to unexpected domain: {url}")

    for description in _iter_description_values(brandkit.get("brand", {})):
        warnings.extend(
            _collect_unknown_text_urls(
                description,
                target_base=target_base,
                observed_asset_urls=observed_asset_urls,
            )
        )

    warnings.extend(
        _collect_unknown_text_urls(
            brandkit.get("brand", {}).get("brandVoice", {}),
            target_base=target_base,
            observed_asset_urls=observed_asset_urls,
        )
    )

    warnings.extend(
        _collect_unknown_text_urls(
            brandkit.get("brand", {}).get("businessContext", {}),
            target_base=target_base,
            observed_asset_urls=observed_asset_urls,
        )
    )

    return list(dict.fromkeys(warnings))

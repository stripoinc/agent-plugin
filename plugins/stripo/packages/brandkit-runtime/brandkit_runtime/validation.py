"""Authoritative deterministic brandkit validators and normalizers.

This module owns the publisher-runtime finalization policy. Schema locations
are resolved from the installed ``brandkit-extraction-v-0`` skill directory
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

TONE_SKILL_NAME = "brandkit-tone-of-voice-v-0"
BUSINESS_CONTEXT_SKILL_NAME = "brandkit-business-context-v-0"


@dataclass(frozen=True)
class SchemaPaths:
    """Resolve schema locations from an explicit skill root.

    Replaces the source repo's ``skill_bundle`` container/repo dual-path
    constants: this runtime always reads schemas from the installed skill
    tree, where ``skill_root`` is the ``brandkit-extraction-v-0`` skill
    directory and the satellite skills are its siblings.
    """

    skill_root: Path

    @property
    def skill_schema_path(self) -> Path:
        return self.skill_root / "references" / "schema.json"

    @property
    def extraction_stage_schema_path(self) -> Path:
        return self.skill_root / "references" / "extraction-stage.schema.json"

    @property
    def brand_voice_schema_path(self) -> Path:
        return (
            self.skill_root.parent
            / TONE_SKILL_NAME
            / "references"
            / "brand-voice.schema.json"
        )

    @property
    def business_context_schema_path(self) -> Path:
        return (
            self.skill_root.parent
            / BUSINESS_CONTEXT_SKILL_NAME
            / "references"
            / "business-context.schema.json"
        )

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
SOCIAL_PLATFORM_KEYS = tuple(PLATFORM_DOMAIN_ALLOWLIST.keys())
# Query keys whose removal cannot change the identity of a social profile.
# Keep this list deliberately narrow: every unlisted query component remains
# part of the factual evidence comparison. Mirrored in content-validators.js.
_GENERIC_SOCIAL_TRACKING_QUERY_KEYS = frozenset({"fbclid", "gclid"})
_SOCIAL_TRACKING_QUERY_KEYS: dict[str, frozenset[str]] = {
    "instagram": frozenset({"igshid"}),
}
SVG_DANGEROUS_PATTERNS = [
    re.compile(r"<\s*(?:[a-z_][\w.-]*:)?script\b", re.IGNORECASE),
    re.compile(r"\bon\w+\s*=", re.IGNORECASE),
    re.compile(r"javascript\s*:", re.IGNORECASE),
    re.compile(r"<\s*(?:[a-z_][\w.-]*:)?iframe\b", re.IGNORECASE),
    # `@import` inside an SVG's own `<style>` pulls a remote stylesheet at
    # RENDER time, and `<foreignObject>` re-opens the full HTML parser inside
    # the image. Mirrored verbatim in the JS twin
    # (skills/brandkit-extraction-v-0/scripts/lib/content-validators.js) —
    # `pattern.pattern` is surfaced in the warning string, so the two lists must
    # stay identical in content AND order.
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
BUTTON_TYPOGRAPHY_HINT = "button-typography"
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
PRODUCT_CARD_CTA_LAYOUT_WARNING = (
    "Product-card CTA layout was not captured; downstream may render a default/content-sized CTA."
)
PRODUCT_CARD_CTA_FALLBACK_ADVISORY = (
    "Product-card CTA lacks medium/strong reusable visible-text evidence; downstream should use primary button fallback for reusable text CTA tokens."
)
PRODUCT_CARD_CTA_REUSABLE_HINT_WARNING = (
    "Reusable product-card-cta hint is present, but no medium/strong visible-text product-card CTA evidence supports it."
)
TECHNICAL_BUTTON_EVIDENCE_WARNING = (
    "Technical button probe captured reusable visible-text button evidence, but the final brandkit emitted no button styles."
)
TECHNICAL_BUTTON_PROBE_DEGRADED_WARNING = (
    "Technical homepage button probe degraded; legacy CTA/button compatibility evidence may be incomplete."
)
TECHNICAL_PRODUCT_CARD_CTA_BUTTON_WARNING = (
    "Technical product-card probe captured reusable visible-text product-card CTA evidence, but the final brandkit emitted no product-card-cta button style."
)
TECHNICAL_PRODUCT_CARD_CTA_TYPOGRAPHY_WARNING = (
    "Technical product-card probe captured reusable visible-text product-card CTA evidence, but the final brandkit emitted no product-card-cta typography style."
)
TECHNICAL_PRODUCT_CARD_CTA_HOVER_WARNING = (
    "Technical product-card probe captured product-card CTA hover evidence, but the final brandkit product-card CTA hover does not match that evidence."
)
TECHNICAL_PRODUCT_CARD_WEAK_EVIDENCE_WARNING = (
    "Technical product-card recovery exhausted without a representative card, and the final brandkit product-card evidence is weak or incomplete."
)
# Fires alongside WEAK_EVIDENCE when the captured probe rows were too few to
# represent a populated homepage (typically a partial / loading render). Helps
# distinguish "homepage failed to hydrate" from "homepage rendered fine but
# genuinely had no shoppable cards". Re-running extraction usually recovers
# the full card set on the next pass.
TECHNICAL_PRODUCT_CARD_HOMEPAGE_PROBE_LIKELY_PARTIAL_WARNING = (
    "Technical product-card probe captured very few card-shape rows; "
    "the homepage likely rendered as a partial / loading state. "
    "Re-running the extraction usually recovers the full card set."
)
# Threshold for the homepage-likely-partial canary. Selected to fire on the
# bi-ua fix35 case (3 rows of `/action/` promo banners) and stay quiet for
# fix29-style runs (33 rows of real product cards). Keep in sync with the
# Node constant in skills/brandkit-extraction-v-0/scripts/lib/technical-artifact-warnings.js.
HOMEPAGE_PROBE_LIKELY_PARTIAL_MAX_ROWS = 5
TECHNICAL_PRODUCT_CARD_RECOVERY_REGRESSION_WARNING = (
    "Technical product-card recovery found purchase-like homepage candidates in an earlier attempt, but the final saved homepage product-card artifacts preserved none."
)
TECHNICAL_LANGUAGE_EVIDENCE_WARNING = (
    "Technical homepage artifacts suggest multiple visible site languages, but the final brandkit captured fewer than two languages."
)
# BACKLOG item 31 — section-evidence warnings. Two DISTINCT grades, and
# collapsing them is the defect these exist to prevent:
#
#   mapper-dropped    the probe classified the value and the kit lost it
#   capture-unproven  the raw DOM holds it and the visibility filter did not
#
# An empty probe is not evidence of an empty site. Only the third case —
# nothing visible, nothing unfiltered — is an honest absence, and it stays
# silent. Keep string-for-string with technical-artifact-warnings.js.
TECHNICAL_SOCIAL_MAPPER_DROPPED_WARNING = (
    "Technical page signals classified social profile links that the final brandkit socials do not carry."
)
TECHNICAL_SOCIAL_CAPTURE_UNPROVEN_WARNING = (
    "Technical page signals found social profile links in the raw DOM that no visible anchor matched, so the socials capture is unproven rather than absent."
)
# The THIRD answer to the same question, and the one neither grade above can
# give. Both `visibleSocialPlatforms` and `unfilteredSocialPlatforms` are built
# from `a[href]`, so a site whose social icons are `<a>` elements with no href
# at all — the click wired in JS — leaves both empty, and "nothing visible,
# nothing unfiltered" is then read as the honest absence it is not. Measured on
# two live storefronts in one day's fleet (6 and 2 such anchors inside a
# social-classed container); both runs reported no social presence and the
# replace-only save cleared the account's socials.
#
# The count is a fact; the platform behind an href-less icon is not (the class
# is the same on every one of them), so nothing here names one. `{count}` is
# substituted by `_hrefless_social_controls_warning`, whose JS twin
# `hrefLessSocialControlsWarning` must produce the byte-identical string.
TECHNICAL_SOCIAL_HREFLESS_CONTROLS_WARNING = (
    "Technical page signals found {count} social-looking controls without an href in a social container; they are JS-driven, so the socials capture is unproven rather than absent."
)

TECHNICAL_CONTACT_EMAIL_MAPPER_DROPPED_WARNING = (
    "Technical page signals captured contact email evidence that the final brandkit contacts do not carry."
)
TECHNICAL_CONTACT_EMAIL_CAPTURE_UNPROVEN_WARNING = (
    "Technical page signals found mailto links in the raw DOM that no visible anchor matched, so the contact email capture is unproven rather than absent."
)
TECHNICAL_CONTACT_PHONE_MAPPER_DROPPED_WARNING = (
    "Technical page signals captured contact phone evidence that the final brandkit contacts do not carry."
)
TECHNICAL_CONTACT_PHONE_CAPTURE_UNPROVEN_WARNING = (
    "Technical page signals found tel links in the raw DOM that no visible anchor matched, so the contact phone capture is unproven rather than absent."
)
TECHNICAL_IMPORTANT_LINKS_MAPPER_DROPPED_WARNING = (
    "Technical page signals captured important-link evidence that the final brandkit importantLinks do not carry."
)

# Email and phone only: `addresses` is collected from visible TEXT segments,
# not from anchors, so it has no unfiltered href spelling and no honest
# `capture-unproven` signal.
CONTACT_CHANNELS = (
    (
        "emails",
        "mailto",
        TECHNICAL_CONTACT_EMAIL_MAPPER_DROPPED_WARNING,
        TECHNICAL_CONTACT_EMAIL_CAPTURE_UNPROVEN_WARNING,
    ),
    (
        "phones",
        "tel",
        TECHNICAL_CONTACT_PHONE_MAPPER_DROPPED_WARNING,
        TECHNICAL_CONTACT_PHONE_CAPTURE_UNPROVEN_WARNING,
    ),
)
TECHNICAL_HOMEPAGE_PASS_INCOMPLETE_WARNING = (
    "Technical homepage batch pass did not complete cleanly, so the final brandkit may have been assembled from partial homepage artifacts."
)
TECHNICAL_HOMEPAGE_BLOCKED_BLOCKER = (
    "Homepage appears blocked by a security interstitial, so brand extraction cannot continue from reliable homepage evidence."
)
# NOT named `TECHNICAL_*` on purpose. That prefix is the two-sided finding
# vocabulary `test_technical_finding_constants_js_python_parity` holds in
# lockstep between `validation.py` and the JS validator twins, and every member
# of it is raised by `detect_technical_artifact_blockers` (exit 4) on both
# sides. This blocker belongs to the COMPOSE gate (exit 3), which is Python-only
# — `compose.resolve_homepage_gate` has no JS twin — so adding it to that
# vocabulary would mean exporting a string from the JS module that nothing on
# that side can ever produce.
HOMEPAGE_FAILED_WITHOUT_EVIDENCE_BLOCKER = (
    "Homepage pass failed before capturing any evidence, so brand extraction cannot continue; "
    "nothing is written to the account."
)
# Also compose-gate-only, and named for the same reason as the constant above.
# It is the SAME exit-3 stop as TECHNICAL_HOMEPAGE_BLOCKED_BLOCKER, for the
# other reason a pass can record a block, and it exists because the two reasons
# are not interchangeable to the person reading the line. A landed document
# outside 2xx is a 404, a 410 or an uncleared deny -- nothing claimed a
# challenge, `blockedBySecurityInterstitial` is `false`, and no residential
# retry was spent. Telling that operator the homepage "appears blocked by a
# security interstitial" sends them looking for an anti-bot wall that is not
# there, when the fix is usually the URL they typed. The tri-state exists
# precisely so the artifact stops asserting a challenge that did not happen;
# the blocker line is the one place a human actually reads it, so it may not
# assert one either.
HOMEPAGE_LANDED_DOCUMENT_ERROR_BLOCKER = (
    "Homepage did not serve a page: the final main-frame document came back outside 2xx, "
    "so brand extraction cannot continue from an error document rather than the site."
)
# The THIRD reason a pass records a block, and the last one still telling the
# operator something that did not happen. `detectSecurityInterstitial` returns
# `type: "blank_render"` when the document came back with no title, no copy, no
# logo candidate and no link -- an empty page, which matches none of the
# provider rules, so nothing named a challenge. It is the same misattribution
# the landed-document constant above exists to end: "appears blocked by a
# security interstitial" sends that operator looking for an anti-bot wall,
# when what the run holds is a page with nothing on it and the remedy is
# usually a different egress or a site that is simply down. Compose-gate-only,
# and named for the same reason as the two constants above.
HOMEPAGE_BLANK_RENDER_BLOCKER = (
    "Homepage rendered an empty document: no title, no copy, no logo candidate and no link, "
    "so brand extraction cannot continue from a blank page rather than the site."
)
# `blocker.type` for that state, written by `detectSecurityInterstitial` in
# scripts/lib.js. Same relationship to `status` as the constant below it.
BLANK_RENDER_BLOCKER_TYPE = "blank_render"
# `blocker.type` the producer writes for that state (homepage-pass.js
# `landedDocumentErrorBlocker`). It is the CLASSIFICATION, not the status
# string: `status` says "blocked" for both reasons.
LANDED_DOCUMENT_ERROR_BLOCKER_TYPE = "landed_document_error_status"
HOMEPAGE_EVIDENCE_ARTIFACTS = (
    "text-styles.json",
    "background-styles.json",
    "button-styles.json",
    "product-card-styles.json",
)
TECHNICAL_FALSE_FALLBACK_BLOCKER = (
    "Final brandkit looks like an empty fallback bundle even though homepage technical artifacts completed and were ready for assembly."
)
WRONG_SITE_IDENTITY_BLOCKER = (
    "Final brandkit website identifies a different site than this extraction run"
)
INVENTED_CONTACT_BLOCKER = (
    "Final brandkit contact is absent from this run's page-signals evidence"
)
INVENTED_SOCIAL_BLOCKER = (
    "Final brandkit social URL is absent from this run's page-signals evidence"
)
INVENTED_ASSET_URL_BLOCKER = (
    "Final brandkit logo URL is absent from this run's captured asset evidence"
)
UNSAFE_ASSET_URL_BLOCKER = "Final brandkit logo URL is not a safe public asset URL"
SAFE_ASSET_URL_VERDICT = "safe"
UNSAFE_ASSET_URL_VERDICT = "unsafe"
UNSAFE_SVG_BLOCKER = "Final brandkit logo SVG contains a dangerous pattern"
UNBOUND_SVG_BLOCKER = (
    "Final brandkit logo SVG is not exactly bound to this run's captured logo evidence"
)
REQUIRED_WITH_EVIDENCE_BACKGROUND_COLORS_BLOCKER = (
    "Final brandkit brand.colors.backgroundColors is empty even though assembly-diagnostics canvas-background candidates exist with confidence at or above 0.3."
)
REQUIRED_WITH_EVIDENCE_TYPOGRAPHY_BLOCKER = (
    "Final brandkit brand.typography is empty even though assembly-diagnostics body-typography or heading-typography candidates exist with confidence at or above 0.3."
)
REQUIRED_WITH_EVIDENCE_BUTTON_BLOCKER = (
    "Final brandkit brand.components.button is empty even though assembly-diagnostics button-primary candidates exist with confidence at or above 0.3."
)
REQUIRED_WITH_EVIDENCE_LOGOS_BLOCKER = (
    "Final brandkit brand.logos is empty even though assembly-diagnostics logos candidates exist with confidence at or above 0.3."
)
PRODUCT_CARD_CTA_ICON_ONLY_MIRROR_LEAK_BLOCKER = (
    "Product-card CTA layoutIntent is icon-only, so no brand.components.button or brand.typography entry may carry the product-card-cta usage hint; the icon-only path must keep that hint exclusive to productCard.cta."
)
PRODUCT_CARD_CTA_VISIBLE_TEXT_MIRROR_MISSING_BLOCKER = (
    "Product-card CTA layoutIntent indicates reusable visible-text, so brand.components.button and brand.typography must each carry an entry with the product-card-cta usage hint."
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
    """A skill schema file could not be loaded (missing/unreadable/corrupt).

    Schemas ship with the installed skill tree, so a load failure is an
    installation fault — it can never be attributed to agent- or
    satellite-authored OUTPUT. Callers that fall back on invalid satellite
    output (``load_brand_voice`` / ``load_business_context``) must re-raise
    this instead of swallowing it into their "output was invalid; using empty
    fallback" warning, so a broken install fails the run loudly and the
    report names the missing schema path.
    """


@lru_cache(maxsize=None)
def load_schema(schema_path: Path) -> dict[str, Any]:
    # Source had a container→repo fallback map here; this runtime resolves a
    # single explicit path (via SchemaPaths), so a missing schema file fails
    # loudly instead of silently falling back. The failure is typed
    # (SchemaLoadError) so satellite fallback paths can tell an install fault
    # apart from invalid satellite output.
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
    """In-memory equivalent of ``validate_brandkit_file``.

    Lets callers validate a composed/merged brandkit BEFORE persisting it,
    so an invalid merge can never overwrite a previously-good cached
    ``brandkit.json`` on disk.
    """
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
    payload = json.loads(json_path.read_text(encoding="utf-8"))
    return validate_brandkit_payload(
        payload,
        schema_path,
        semantic_warnings_out=semantic_warnings_out,
    )


def validate_extraction_stage_file(
    json_path: Path,
    schema_path: Path,
) -> dict[str, Any]:
    payload = json.loads(json_path.read_text(encoding="utf-8"))
    jsonschema.validate(payload, load_schema(schema_path))
    _raise_on_unsafe_public_strings(payload)
    return payload


def _empty_socials() -> dict[str, str]:
    return {platform: "" for platform in SOCIAL_PLATFORM_KEYS}


def _social_url_score(platform: str, url: str) -> int:
    normalized = (url or "").strip().lower().replace("\\", "/")
    if not normalized:
        return 0
    score = 1 if normalized.startswith(("http://", "https://")) else 0
    allowed_domains = PLATFORM_DOMAIN_ALLOWLIST.get(platform, ())
    try:
        parsed = urlparse(normalized)
    except ValueError:
        parsed = None
    hostname = (parsed.hostname or "").lower() if parsed else ""
    if any(hostname == domain or hostname.endswith(f".{domain}") for domain in allowed_domains):
        score += 3
    if platform == "android" and normalized.startswith("market://"):
        score += 3
    if platform == "rss" and re.search(r"(^|/)(rss|feed|atom)(?:[/?#.]|$)|\.xml(?:[?#]|$)", normalized):
        score += 3
    if platform == "viber" and normalized.startswith("viber:"):
        score += 2
    return score


def _socials_from_links(links: Any, *, existing: dict[str, Any] | None = None) -> dict[str, str]:
    result = _empty_socials()
    scores = {platform: 0 for platform in SOCIAL_PLATFORM_KEYS}
    if isinstance(existing, dict):
        for platform in SOCIAL_PLATFORM_KEYS:
            value = existing.get(platform)
            if isinstance(value, str) and value.strip():
                result[platform] = value.strip()
                scores[platform] = _social_url_score(platform, result[platform])
    for entry in links if isinstance(links, list) else []:
        if not isinstance(entry, dict):
            continue
        platform = entry.get("platform")
        url = entry.get("url")
        if not isinstance(platform, str) or not isinstance(url, str):
            continue
        normalized_platform = platform.strip().lower()
        normalized_url = url.strip()
        if normalized_platform not in SOCIAL_PLATFORM_KEYS or not normalized_url:
            continue
        score = _social_url_score(normalized_platform, normalized_url)
        if not result[normalized_platform] or score > scores[normalized_platform]:
            result[normalized_platform] = normalized_url
            scores[normalized_platform] = score
    return result


_BRANDKIT_WRITE_HTTP_URL_RE = re.compile(r"^https?://", re.IGNORECASE)


def _brandkit_write_takes_url(value: Any) -> bool:
    """Would the Brand Kit write STORE this URL, or refuse the whole document?

    A verbatim port of reteno-mcp's ``_writer_takes_url`` -- same ``urlparse``,
    same order, same answers -- and verbatim is the point. The write types every
    URL field strict http(s) and raises on the FIRST value it cannot store, so
    one bad string refuses the ENTIRE document: a prod extraction for
    horoshop.ua composed ``socials.viber = "viber://chat?..."`` from a Viber
    button the homepage genuinely shows, and the account received nothing at all
    -- no colours, no typography, no components, no logos -- after ~8 minutes of
    extraction and two human approvals.

    PORTED rather than re-derived, because the alternative was measured. A
    JavaScript version of this predicate has to reimplement CPython's
    ``urlsplit`` to know what CPython refuses, and three rounds of differential
    fuzzing over ~500k inputs found FIVE families where the reimplementation
    kept a value the write refuses -- each invisible to the corpus before it,
    twice after a run had already reported zero. Calling the same parser the
    write calls has none of those families by construction, and drift between
    two copies of these 20 lines is a diff a reviewer can see rather than a
    behaviour only a fuzz can find.

    Scheme-less is deliberately NOT a refusal: the write coerces ``t.me/acme``
    to ``https://t.me/acme`` and stores it, so demanding a literal ``https?://``
    here would empty a value the account would have held -- the same
    producer/consumer divergence, pointed the other way.
    """
    if not isinstance(value, str):
        return False
    text = value.strip()
    if not text:
        return False
    try:
        parsed_input = urlparse(text)
        if parsed_input.scheme and parsed_input.scheme.lower() not in {"http", "https"}:
            return False
        candidate = text if _BRANDKIT_WRITE_HTTP_URL_RE.match(text) else f"https://{text}"
        parsed = urlparse(candidate)
    except ValueError:
        # `urlparse` raises on e.g. "https://[invalid", and the write calls it
        # without a try/except -- so a raise there refuses the document exactly
        # like an explicit refusal does. Not storable either way.
        return False
    return bool(
        parsed.scheme.lower() in {"http", "https"}
        and parsed.netloc
        and parsed.hostname
        and not any(char.isspace() for char in candidate)
    )


def _drop_unwritable_socials(socials: Any) -> None:
    """Empty the social URLs the write refuses, so the rest of the document lives.

    EMPTIED, not removed, because ``""`` is already what "this run found no
    public URL for that platform" means to the write: reteno-mcp's rule 3
    prunes the blank -- rule 9 is the pass that empties, rule 3 the one that
    prunes -- and the document stays writable instead of being refused whole
    over one deep link.

    What this does NOT do is save the handle the account already had. The save
    is replace-only, so a platform absent from the outgoing document is
    CLEARED, and the run reports it under ``cleared``. That is why the warning
    this pairs with tells the reader to fix the value at its source: emptying
    buys the rest of the brandkit, not the social link.
    """
    if not isinstance(socials, dict):
        return
    for platform, value in socials.items():
        if isinstance(value, str) and value.strip() and not _brandkit_write_takes_url(value):
            socials[platform] = ""


def _important_link_pair(entry: Any) -> tuple[str, str] | None:
    """The (name, url) one raw row states, or ``None`` if it states no row at all.

    Shared by the normalizer and by the warning that reports what the normalizer
    dropped, so the two can never describe different rows. A report that
    disagrees with the behaviour it reports on is worse than no report.
    """
    if not isinstance(entry, dict):
        return None
    name = entry.get("name")
    if not isinstance(name, str) or not name.strip():
        name = entry.get("text") or entry.get("label") or ""
    url = entry.get("url") or entry.get("href") or ""
    if not isinstance(name, str) or not isinstance(url, str):
        return None
    return name.strip(), url.strip()


def _shown_gate_value(value: str) -> str:
    return repr(value if len(value) <= 60 else f"{value[:57]}...")


def write_refusal_gate_warnings(payload: Any) -> list[str]:
    """Name the values the write-refusal gate is about to remove.

    Call on the RAW payload, before ``normalize_extraction_stage_payload``
    removes them. Advisory only: the run succeeds, this is visibility.

    Visibility is the entire reason this exists. reteno-mcp reports its own
    drops in the write's ``sanitized`` list -- but only for values that REACH
    the write, and this gate's whole job is that they never do. Skip this and a
    run that quietly dropped a brand's Viber link says nothing about it
    anywhere, leaving a customer asking where it went nothing to read but an
    artifact the runtime rewrote. Under reteno-mcp's half alone they at least
    got a sentence.
    """
    if not isinstance(payload, dict):
        return []
    warnings: list[str] = []
    socials = payload.get("socials")
    if isinstance(socials, dict):
        for platform in sorted(socials):
            value = socials[platform]
            if isinstance(value, str) and value.strip() and not _brandkit_write_takes_url(value):
                warnings.append(
                    f"socials.{platform}: emptied {_shown_gate_value(value.strip())} — the Brand "
                    "Kit write stores only http(s) URLs and refuses the whole document on anything "
                    f"else. The write is replace-only, so the account will hold NO {platform} "
                    "handle after this run — fix the value at its source if the brand has one."
                )
    links = payload.get("importantLinks")
    if isinstance(links, list):
        for index, entry in enumerate(links):
            pair = _important_link_pair(entry)
            if pair is None:
                continue
            name, url = pair
            if name and _brandkit_write_takes_url(url):
                continue
            reason = (
                "it states no name"
                if not name
                else f"{_shown_gate_value(url)} is not an http(s) URL"
            )
            warnings.append(
                f"importantLinks[{index}]: dropped the row, {reason} — the Brand Kit write refuses "
                "the whole document over it, and the header modules built from this brandkit delete "
                "the nav slot it would have filled."
            )
    return warnings


def _normalize_important_links(value: Any) -> Any:
    if not isinstance(value, list):
        return value
    normalized: list[dict[str, str]] = []
    for entry in value:
        pair = _important_link_pair(entry)
        if pair is None:
            continue
        name, url = pair
        # The ROW goes, the way an unwritable logo row goes. This one refuses the
        # document twice over -- a non-http(s) url, and independently a blank
        # name, which the write's `_require_name_and_url` rejects and only its
        # READ path forgives. Dropping costs one link; keeping costs every link
        # and everything else in the document with them.
        if not name or not _brandkit_write_takes_url(url):
            continue
        normalized.append({"name": name, "url": url})
    return normalized


def _normalize_contact_list(value: Any, *, scheme: str) -> Any:
    if not isinstance(value, list):
        return value
    normalized: list[str] = []
    for entry in value:
        if isinstance(entry, str):
            item = entry.strip()
        elif isinstance(entry, dict):
            raw = entry.get("url") or entry.get("text") or entry.get("value") or ""
            item = raw.strip() if isinstance(raw, str) else ""
            if item.lower().startswith(scheme):
                item = item[len(scheme):]
        else:
            item = ""
        if item:
            normalized.append(item)
    return list(dict.fromkeys(normalized))


def _normalize_layout_intent(value: Any, *, cta: dict[str, Any] | None = None) -> str:
    raw = str(value or "").strip().lower().replace("_", "-")
    if raw in {"full-width", "content-sized", "fixed-width", "icon-only", "unknown"}:
        return raw
    if raw in {"content-width", "inline"}:
        return "content-sized"
    if raw == "compact":
        if isinstance(cta, dict) and (cta.get("isIconLike") is True or cta.get("hasUsableVisibleText") is False):
            return "icon-only"
        if isinstance(cta, dict) and cta.get("hasUsableVisibleText") is True and cta.get("isIconLike") is not True:
            return "content-sized"
        return "unknown"
    return "unknown" if raw else ""


def _normalize_component_fields(payload: dict[str, Any]) -> None:
    components = payload.get("brand", {}).get("components", {})
    if not isinstance(components, dict):
        return
    for button in components.get("button", []) if isinstance(components.get("button"), list) else []:
        # A zero-width `transparent` border is real evidence (the site draws no
        # border) but not a value the Brand Kit write stores: `buttonStyle.borderColor`
        # is a REQUIRED string in both skill schemas, and the write drops any non-hex
        # button colour from the row (reteno-mcp `_sanitize_button_rows`). The
        # background hex is the one colour that can never draw a visible edge, and
        # it is what `product_card_builder.product_card_cta_style` falls back to for
        # a missing CTA borderColor anyway. The product-card SURFACE is normalized
        # the OTHER way -- `productCardFromRow` nulls a zero-width
        # `surface.borderColor` and `card_tokens._has_zero_border_width` ignores it
        # -- because that field is nullable and feeds the `border_subtle`/`divider`
        # tokens the email paints. Both rules, side by side:
        # references/role-decision-rules.md, "A fully transparent value ...".
        if (
            isinstance(button, dict)
            and button.get("borderColor") == "transparent"
            and button.get("borderWidth") == 0
            and isinstance(button.get("backgroundColor"), str)
            and re.fullmatch(r"#[0-9a-f]{6}", button["backgroundColor"])
        ):
            button["borderColor"] = button["backgroundColor"]
        layout = button.get("layout") if isinstance(button, dict) else None
        if isinstance(layout, dict):
            layout["intent"] = _normalize_layout_intent(layout.get("intent")) or "unknown"
    for card in components.get("productCard", []) if isinstance(components.get("productCard"), list) else []:
        cta = card.get("cta") if isinstance(card, dict) else None
        if isinstance(cta, dict):
            cta["layoutIntent"] = _normalize_layout_intent(cta.get("layoutIntent"), cta=cta) or "unknown"


# Common non-ISO-639-1 codes seen in the wild, mapped to canonical ISO 639-1.
# Ukrainian sites ubiquitously self-tag "ua" (the country TLD, not the language
# code "uk"); Czech sites use "cz" (the TLD, not "cs").
_LANGUAGE_CODE_ALIASES = {"ua": "uk", "cz": "cs"}

# Defensive language-name -> code recovery. The agent is instructed to author
# lowercase ISO 639-1 codes (SKILL.md), but if it slips in a language *name* we
# recover the common ones rather than dropping the language. Not exhaustive: an
# unmapped name is dropped because it is not a usable code.
_LANGUAGE_NAME_TO_CODE = {
    "english": "en",
    "russian": "ru",
    "русский": "ru",
    "ukrainian": "uk",
    "українська": "uk",
    "украинский": "uk",
    "bulgarian": "bg",
    "български": "bg",
    "romanian": "ro",
    "română": "ro",
    "romana": "ro",
    "french": "fr",
    "français": "fr",
    "francais": "fr",
    "german": "de",
    "deutsch": "de",
    "italian": "it",
    "italiano": "it",
    "polish": "pl",
    "polski": "pl",
    "portuguese": "pt",
    "português": "pt",
    "portugues": "pt",
    "spanish": "es",
    "español": "es",
    "espanol": "es",
}

_ISO_639_1_RE = re.compile(r"[a-z]{2}")


def _normalize_languages(value: Any) -> list[str]:
    """Canonicalize an authored ``languages`` array to ISO 639-1 codes.

    Each entry is reduced to its primary subtag (``uk-UA`` -> ``uk``,
    ``pt_BR`` -> ``pt``), lowercased, alias-mapped (``ua`` -> ``uk``,
    ``cz`` -> ``cs``), and — as a fallback — resolved from a common language
    name (``"Ukrainian"`` -> ``uk``). Anything that is still not a two-letter
    code is dropped, and the result is deduped preserving first-occurrence
    order. This is a coercion, never a rejection: a malformed ``languages``
    array yields a shorter (possibly empty) list, which is schema-valid.
    """
    if not isinstance(value, list):
        return []
    out: list[str] = []
    seen: set[str] = set()
    for entry in value:
        if not isinstance(entry, str):
            continue
        token = entry.strip().lower()
        if not token:
            continue
        primary = re.split(r"[-_]", token, maxsplit=1)[0]
        code = _LANGUAGE_NAME_TO_CODE.get(token) or _LANGUAGE_CODE_ALIASES.get(
            primary, primary
        )
        if _ISO_639_1_RE.fullmatch(code) and code not in seen:
            seen.add(code)
            out.append(code)
    return out


# ``_provenance`` is an internal scaffolder sentinel
# (skills/brandkit-extraction-v-0/scripts/lib/provenance-marker.js
# ``markScaffoldSynthesised``) tagging synth-derived draft rows for the
# shrinkage gate. The JS normalize strips it before its own schema check — but
# only on a SUCCESSFUL pass: if a role-coverage hard gate throws first, the
# agent can hand off an artifact still carrying the marker, and every
# extraction-stage ``$def`` is ``additionalProperties: false``, so it fails the
# runtime schema gate with a confusing ``'_provenance' was unexpected`` error
# that masks the real (role-coverage) problem. The runtime is the authoritative
# gate, so it strips the internal marker unconditionally here.
_PROVENANCE_FIELD = "_provenance"


def _strip_provenance_markers(value: Any) -> Any:
    """Recursively delete the internal ``_provenance`` sentinel. In place."""
    if isinstance(value, list):
        for item in value:
            _strip_provenance_markers(item)
    elif isinstance(value, dict):
        value.pop(_PROVENANCE_FIELD, None)
        for child in value.values():
            _strip_provenance_markers(child)
    return value


# ---------------------------------------------------------------------------
# `logos[].background`: resolve "unknown" from the artwork the run captured.
# ---------------------------------------------------------------------------
# WHY HERE, AND WHY IT MATTERS DOWNSTREAM. Every URL-sourced logo candidate
# `rankLogoCandidates` mints states `background: "unknown"` (only the inline-
# `<svg>` capture measures the band it sits on), and SKILL.md tells the agent to
# copy the candidate verbatim. So a run that DID capture the mark's markup ships
# `background: "unknown"` beside a `svgPath` that answers the question.
#
# The two readers then diverge by SOURCE. `contrast_pairs.logo_background_need`
# falls back to that `svgPath`, so a `brandkit: <path>` run reaches the right
# surface. A `brandkit: "account"` run does not: reteno-mcp's rule 4 strips
# `svgPath` (kilobytes of markup) and DROPS `background: "unknown"`, so the
# stored kit carries no evidence at all -- `logo_background_need` returns None,
# `pick_surface` degrades to preference-only, and
# `static_module_builder`'s `logo_surface_contrast_failed` gate is skipped
# outright (`if need is not None`). Measured: white artwork that reaches
# 21.00:1 on a path kit reaches 1.00:1 on the account kit of the SAME brand,
# every gate green.
#
# A RESOLVED `light`/`dark` survives that projection -- it is endpoint-modeled.
# So the fix is to state the conclusion here, once, rather than to re-derive it
# in reteno-mcp from bytes it deliberately does not store.
#
# THE MIRROR. This is `contrast_pairs.logo_background_need`'s `svgPath` fallback
# re-stated: same `fill="..."` channel, same per-occurrence mean, same 0.7/0.3
# bands. It is a mirror and not an import because that module lives in a skill
# tree `publisher_skill_installer.py` copies STANDALONE, and it says in its own
# header why it will not import across that line either. The cost of a mirror is
# drift, paid down the same way: `tests/test_brandkit_finalize.py::
# test_logo_background_resolution_agrees_with_its_downstream_reader` drives the
# real reader as the ORACLE over a table of artwork shapes, so the two cannot
# disagree without a red test.
#
# WHAT IT DOES NOT DO. The mid band stays `"unknown"` -- a mid-luminance or
# multi-colour mark carries no honest constraint, and the account path stays
# starved for those kits (as it does for every logo with no `svgPath` at all:
# a raster asset, a favicon, an `og:image`). That residual is real and is named
# where the gap is accounted for; this closes the captured-artwork case only.
_LOGO_SVG_FILL_RE = re.compile(r"""\bfill\s*=\s*(?:"([^"]*)"|'([^']*)')""", re.IGNORECASE)
# The five names `contrast_pairs.parse_hex` accepts. `fill="white"` is ordinary
# in hand-authored logo markup, and dropping it would silently halve the sample.
_LOGO_FILL_NAMED_COLORS: dict[str, tuple[int, int, int]] = {
    "black": (0, 0, 0),
    "white": (255, 255, 255),
    "gray": (128, 128, 128),
    "grey": (128, 128, 128),
    "silver": (192, 192, 192),
}
_LIGHT_ARTWORK_MEAN_LUMINANCE = 0.7
_DARK_ARTWORK_MEAN_LUMINANCE = 0.3
UNKNOWN_LOGO_BACKGROUND = "unknown"


def _logo_fill_rgb(value: str) -> tuple[int, int, int] | None:
    """`contrast_pairs.parse_hex`, mirrored: `#rgb`/`#rrggbb` (leading `#`
    optional) or one of five CSS names. Anything else -- `rgba(...)`,
    `url(#grad)`, `currentColor`, `none` -- is an honest None and is left out
    of the mean rather than guessed at."""
    raw = value.strip().lower()
    if not raw:
        return None
    if not raw.startswith("#"):
        if raw in _LOGO_FILL_NAMED_COLORS:
            return _LOGO_FILL_NAMED_COLORS[raw]
        if len(raw) in (3, 6) and all(char in "0123456789abcdef" for char in raw):
            raw = "#" + raw
        else:
            return None
    body = raw[1:]
    # `#12g4f6` reaches here (it was `#`-prefixed, so the char check above never
    # ran) and must be a None, not a ValueError — the oracle catches it too.
    try:
        if len(body) == 3:
            return (int(body[0] * 2, 16), int(body[1] * 2, 16), int(body[2] * 2, 16))
        if len(body) == 6:
            return (int(body[0:2], 16), int(body[2:4], 16), int(body[4:6], 16))
    except ValueError:
        return None
    # #rgba / #rrggbbaa are deliberately not interpreted: alpha changes the
    # effective colour over a backdrop nothing here can see.
    return None


def _logo_fill_luminance(rgb: tuple[int, int, int]) -> float:
    """WCAG relative luminance of an (r, g, b) 0-255 triple."""
    channels = []
    for value in rgb:
        c = value / 255.0
        channels.append(c / 12.92 if c <= 0.03928 else ((c + 0.055) / 1.055) ** 2.4)
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]


def logo_background_from_artwork(svg_path: Any) -> str | None:
    """The surface this artwork is meant to sit on, or None when it says
    nothing: `"dark"` for light artwork, `"light"` for dark artwork."""
    if not isinstance(svg_path, str) or not svg_path:
        return None
    luminances: list[float] = []
    for match in _LOGO_SVG_FILL_RE.finditer(svg_path):
        raw = match.group(1) if match.group(1) is not None else match.group(2)
        rgb = _logo_fill_rgb(raw)
        if rgb is not None:
            luminances.append(_logo_fill_luminance(rgb))
    if not luminances:
        return None
    mean = sum(luminances) / len(luminances)
    if mean >= _LIGHT_ARTWORK_MEAN_LUMINANCE:
        return "dark"
    if mean <= _DARK_ARTWORK_MEAN_LUMINANCE:
        return "light"
    return None


def _resolve_unknown_logo_backgrounds(brand: Any) -> None:
    """Replace `background: "unknown"` with the artwork's own answer. In place.

    Only ever narrows an `"unknown"`: a stated `light`/`dark` is evidence the
    agent or the inline capture already had (the capture MEASURES the live band,
    which beats reasoning from the artwork) and is never overwritten.
    """
    if not isinstance(brand, dict):
        return
    logos = brand.get("logos")
    if not isinstance(logos, list):
        return
    for logo in logos:
        if not isinstance(logo, dict):
            continue
        if logo.get("background") != UNKNOWN_LOGO_BACKGROUND:
            continue
        resolved = logo_background_from_artwork(logo.get("svgPath"))
        if resolved is not None:
            logo["background"] = resolved


# Stale-normalize recovery guards — production incidents 2026-07-10 (gpt-5.6
# eval): agents edited ``brandkit.extraction.json`` AFTER their last
# successful JS ``--mode normalize`` and handed off slips the JS safety nets
# (``lib/empty-usagehints-strip.js``, ``lib/logo-description-strip.js``) would
# have fixed deterministically. The runtime's Python normalize does not run
# those JS helpers, so the raw slip hit the schema gate and failed the run:
#   - typography/button rows still carrying ``usageHints: []`` (minItems: 1)
#   - a stray ``logos[].description`` (additionalProperties: false)
# Mirror ONLY those two strips here, like ``_strip_provenance_markers`` above.
# Conservative rail: never drop the last remaining row of an array — a slip
# this guard cannot fix safely must fail exactly as before. Recoveries are
# surfaced as content warnings via ``stale_normalize_recovery_warnings``.


def _pruned_empty_hint_rows(rows: Any) -> Any:
    """Return ``rows`` without ``usageHints: []`` entries; unchanged if that
    would empty the array (or if ``rows`` is not a list)."""
    if not isinstance(rows, list):
        return rows
    kept = [
        row
        for row in rows
        if not (isinstance(row, dict) and row.get("usageHints") == [])
    ]
    if not kept or len(kept) == len(rows):
        return rows
    return kept


def _strip_stale_normalize_slips(brand: Any) -> None:
    """Apply the two guard strips to a ``brand`` dict. In place."""
    if not isinstance(brand, dict):
        return
    if isinstance(brand.get("typography"), list):
        brand["typography"] = _pruned_empty_hint_rows(brand["typography"])
    components = brand.get("components")
    if isinstance(components, dict) and isinstance(components.get("button"), list):
        components["button"] = _pruned_empty_hint_rows(components["button"])
    logos = brand.get("logos")
    if isinstance(logos, list):
        for logo in logos:
            if isinstance(logo, dict):
                logo.pop("description", None)


def stale_normalize_recovery_warnings(payload: Any) -> list[str]:
    """Report the slips the stale-normalize guard is about to fix.

    Call on the RAW payload before ``normalize_extraction_stage_payload``
    persists the fixes; the returned strings are advisory content warnings
    (the run succeeds — this is visibility, not a gate).
    """
    if not isinstance(payload, dict):
        return []
    brand = payload.get("brand")
    if not isinstance(brand, dict):
        return []
    warnings: list[str] = []

    def count_empty(rows: Any) -> int:
        if not isinstance(rows, list):
            return 0
        empty = sum(
            1 for row in rows if isinstance(row, dict) and row.get("usageHints") == []
        )
        return empty if 0 < empty < len(rows) else 0

    typo_empty = count_empty(brand.get("typography"))
    if typo_empty:
        warnings.append(
            f"Runtime normalize dropped {typo_empty} typography row(s) with empty "
            "usageHints left by an edit made after the agent's last normalize pass."
        )
    components = brand.get("components")
    button_empty = count_empty(components.get("button")) if isinstance(components, dict) else 0
    if button_empty:
        warnings.append(
            f"Runtime normalize dropped {button_empty} button row(s) with empty "
            "usageHints left by an edit made after the agent's last normalize pass."
        )
    logos = brand.get("logos")
    if isinstance(logos, list) and any(
        isinstance(logo, dict) and "description" in logo for logo in logos
    ):
        warnings.append(
            "Runtime normalize stripped a stray logos[].description left by an "
            "edit made after the agent's last normalize pass."
        )
    return warnings


def normalize_extraction_stage_payload(payload: Any) -> Any:
    if not isinstance(payload, dict):
        return payload
    normalized = copy.deepcopy(payload)
    _strip_provenance_markers(normalized)
    _strip_stale_normalize_slips(normalized.get("brand"))
    _resolve_unknown_logo_backgrounds(normalized.get("brand"))
    socials = normalized.get("socials")
    if isinstance(socials, list):
        normalized["socials"] = _socials_from_links(socials)
    elif isinstance(socials, dict) and "links" in socials:
        normalized["socials"] = _socials_from_links(socials.get("links"), existing=socials)
    # After the shape branches above, never inside one: the flat 20-key dict is
    # what a real run emits and neither branch touches it, which is exactly how
    # `viber://` reached the write.
    _drop_unwritable_socials(normalized.get("socials"))
    important_links = normalized.get("importantLinks")
    normalized["importantLinks"] = _normalize_important_links(important_links)
    contacts = normalized.get("contacts")
    if isinstance(contacts, dict):
        contacts["emails"] = _normalize_contact_list(contacts.get("emails"), scheme="mailto:")
        contacts["phones"] = _normalize_contact_list(contacts.get("phones"), scheme="tel:")
    _normalize_component_fields(normalized)
    # Only canonicalize a well-typed array — leaving a missing/mistyped
    # ``languages`` untouched so the schema still flags it as before.
    languages = normalized.get("languages")
    if isinstance(languages, list):
        normalized["languages"] = _normalize_languages(languages)
    return normalized


def normalize_extraction_stage_file(
    json_path: Path,
    schema_path: Path,
) -> dict[str, Any]:
    payload = json.loads(json_path.read_text(encoding="utf-8"))
    normalized = normalize_extraction_stage_payload(payload)
    if normalized != payload:
        # Validate the normalized dict against the same gates as
        # validate_extraction_stage_file before persisting, so a normalizer
        # bug or malformed input can't overwrite the agent-authored artifact
        # with a payload that subsequently fails validation.
        jsonschema.validate(normalized, load_schema(schema_path))
        _raise_on_unsafe_public_strings(normalized)
        json_path.write_text(
            json.dumps(normalized, ensure_ascii=False, indent=2) + "\n",
            encoding="utf-8",
        )
    return normalized


def validate_brand_voice_payload(
    payload: dict[str, Any],
    schema_path: Path,
) -> dict[str, Any]:
    jsonschema.validate(payload, load_schema(schema_path))
    return payload


def validate_business_context_payload(
    payload: dict[str, Any],
    schema_path: Path,
) -> dict[str, Any]:
    jsonschema.validate(payload, load_schema(schema_path))
    return payload


PRODUCTS_PAYLOAD_STATUS_VALUES = ("ok", "below-target", "non-ecommerce", "empty", "blocked")
PRODUCTS_PAYLOAD_MAX_PRODUCTS = 8
_PRODUCTS_PAYLOAD_MAX_URL_LENGTH = 2048
_PRODUCTS_PAYLOAD_MAX_NAME_LENGTH = 200


def _public_http_url(value: Any) -> str | None:
    if not isinstance(value, str):
        return None
    candidate = value.strip()
    if not candidate or len(candidate) >= _PRODUCTS_PAYLOAD_MAX_URL_LENGTH:
        return None
    try:
        parsed = urlparse(candidate)
    except ValueError:
        # urlparse raises on e.g. "http://[invalid" (Invalid IPv6 URL). The
        # products projection must never raise, so treat it as not-a-URL.
        return None
    if parsed.scheme not in ("http", "https") or not parsed.netloc:
        return None
    return candidate


def _contains_control_chars(value: str) -> bool:
    return any(ord(ch) < 32 or ord(ch) == 127 for ch in value)


def _coerce_public_product(entry: Any) -> dict[str, Any] | None:
    if not isinstance(entry, dict):
        return None
    name = entry.get("name")
    if not isinstance(name, str):
        return None
    name = name.strip()
    if (
        not name
        or len(name) > _PRODUCTS_PAYLOAD_MAX_NAME_LENGTH
        or _contains_control_chars(name)
        or _contains_worker_local_public_path(name)
    ):
        return None
    url = _public_http_url(entry.get("url"))
    if url is None:
        return None
    image_url = _public_http_url(entry.get("imageUrl"))
    price = entry.get("price")
    if isinstance(price, bool) or not isinstance(price, (int, float)):
        return None
    # NaN fails `price > 0`; +inf needs the explicit check.
    if not price > 0 or price == float("inf"):
        return None
    old_price = entry.get("oldPrice")
    if isinstance(old_price, bool) or not isinstance(old_price, (int, float)):
        old_price = None
    elif not old_price > price or old_price == float("inf"):
        old_price = None
    currency = entry.get("currency")
    if not isinstance(currency, str) or not 1 <= len(currency.strip()) <= 8:
        return None
    candidate = {
        "name": name,
        "url": url,
        "imageUrl": image_url,
        "price": price,
        "oldPrice": old_price,
        "currency": currency.strip(),
    }
    # Products are embedded into the validated, UTF-8-written brandkit
    # (brand.products), so a value harvested from untrusted homepage content can
    # no longer be isolated the way the old never-raises sidecar did. Two
    # downstream gates would otherwise abort an otherwise-healthy turn on a junk
    # product: a lone UTF-16 surrogate crashes the brandkit UTF-8 write, and a
    # worker-local / scratch-artifact token raises in the public unsafe-string
    # scan (`_raise_on_unsafe_public_strings`, which also runs over
    # brand.products). Run those exact gates here and drop the product if it
    # would fail — demo data must never fail a healthy run, and reusing the real
    # checks keeps this in lockstep with the validator instead of re-deriving it.
    try:
        _raise_on_unsafe_public_strings(candidate)
        json.dumps(candidate, ensure_ascii=False).encode("utf-8")
    except (jsonschema.ValidationError, UnicodeError):
        return None
    return candidate


def validate_products_payload(payload: Any) -> dict[str, Any]:
    """Project the technical product-data artifact to the public product shape.

    The technical artifact (`technical/<slug>/product-data.json`, written by
    the homepage pass) carries diagnostics, gate decisions, and counts; this
    projection keeps only `status`, `collectedAt`, and the six public product
    fields. The runtime embeds the projected `products` array into the final
    brandkit as `brand.products` (demo-only data; see `_load_products` /
    `_compose_final_brandkit` in runner.py). Hand-rolled checks on purpose:
    this is demo data and must NEVER fail or warn a healthy run — any invalid
    input degrades to ``{"status": "empty", "products": []}`` instead of
    raising, and an empty array is schema-valid because `brand.products` is
    optional.
    """
    fallback: dict[str, Any] = {"status": "empty", "products": []}
    if not isinstance(payload, dict):
        return fallback
    status = payload.get("status")
    if status not in PRODUCTS_PAYLOAD_STATUS_VALUES:
        status = "empty"
    products_raw = payload.get("products")
    products: list[dict[str, Any]] = []
    if isinstance(products_raw, list):
        for entry in products_raw:
            coerced = _coerce_public_product(entry)
            if coerced is not None:
                products.append(coerced)
            if len(products) >= PRODUCTS_PAYLOAD_MAX_PRODUCTS:
                break
    if not products and status in ("ok", "below-target"):
        # The artifact claimed products but none survived projection — the
        # honest public status is "empty".
        status = "empty"
    out: dict[str, Any] = {"status": status, "products": products}
    collected_at = payload.get("collectedAt")
    if (
        isinstance(collected_at, str)
        and 0 < len(collected_at) < 64
        and not _contains_control_chars(collected_at)
        and not _contains_worker_local_public_path(collected_at)
    ):
        out["collectedAt"] = collected_at
    return out


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


def _format_record_paths(paths: list[str]) -> str:
    return ", ".join(paths) if paths else "none"


def _has_product_card_cta_usage_hint(brandkit: dict[str, Any]) -> bool:
    return _has_product_card_cta_button(brandkit) or _has_product_card_cta_typography(brandkit)


def _product_card_cta_is_reusable(card: Any) -> bool:
    """Compatibility alias for the shared product-card CTA predicate."""

    return product_card_cta_is_reusable(card)


def _product_card_cta_needs_text_fallback(card: Any) -> bool:
    if not isinstance(card, dict):
        return False
    return not _product_card_cta_is_reusable(card)


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
            warnings.append(PRODUCT_CARD_CTA_FALLBACK_ADVISORY)
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
    # See the append site: kept out of `warnings` until after the record loop so
    # the ordered semantic-parity oracle sees the same list on both sides.
    hover_coherence: list[str] = []

    for record_path, record in _iter_usage_hint_records(brandkit):
        usage_hints = _record_usage_hints(record)
        if not usage_hints:
            # Typography rows only. Every canonical hint such a row can carry is
            # a deterministic role, so the only edit that clears this error there
            # is a forbidden authoring. A colour row's hints are the agent's.
            suffix = (
                " DO NOT satisfy this by adding a hint: every canonical hint a typography row"
                " carries is a deterministic role the agent may not author. Re-run normalize,"
                " which strips a genuinely hintless row, and report the row if it survives."
                if record_path.startswith("brand.typography")
                else ""
            )
            errors.append(f"{record_path} must include a non-empty usageHints array.{suffix}")
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
            # Collected and appended AFTER the loop rather than into `warnings`
            # in place: this function is under the ordered `_assert_semantic_parity`
            # oracle and the JS twin appends at one point after its own loop.
            hover_coherence.append(
                f"{record_path} uses '{BUTTON_PRIMARY_HOVER_BACKGROUND_HINT}' but is missing "
                "hoverBackgroundColor."
            )

    try:
        _raise_on_unsafe_public_strings(brandkit)
    except jsonschema.ValidationError as exc:
        errors.append(str(exc))
    warnings.extend(_product_card_cta_contract_warnings(brandkit))

    # Demoted from error → warning to mirror semantic-validators.js. The
    # compiler's icon-only fallback already ignores any leaked mirror, so
    # surfacing this as a warning is enough to catch the agent regression
    # without hard-failing extraction.
    if _product_card_icon_only_mirror_leak(brandkit):
        warnings.append(PRODUCT_CARD_CTA_ICON_ONLY_MIRROR_LEAK_BLOCKER)
    # AND THE LAYOUT-INTENT INCOHERENCE JOINS ITS SIBLING. Component-role
    # coherence is styling: the compiler's icon-only fallback already ignores a
    # leaked mirror, which is why the sibling above was demoted first, and
    # refusing the run over the contradiction publishes nothing at all.
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


def _read_optional_json(path: Path) -> Any:
    """Lenient reader for artifacts that only feed ADVISORY warnings.

    ValueError covers json.JSONDecodeError AND UnicodeDecodeError: a truncated
    write from a killed probe can leave invalid UTF-8 in an optional technical
    artifact, and a best-effort warning reader must degrade to "absent" rather
    than crash the run.

    NEVER use this for an artifact a BLOCKER decision reads — degrading a
    corrupt file to "absent" there silently converts "we cannot tell whether
    this run is blocked" into "this run is not blocked". Blocker-gate reads go
    through :func:`_read_gate_json`, which fails loudly instead.
    """
    if not path.is_file():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None


class TechnicalArtifactUnreadableError(RuntimeError):
    """A technical artifact the BLOCKER GATE decides on could not be read.

    An absent artifact is a legitimate, decidable state ("no evidence
    recorded"). A *corrupt* one is not: a truncated ``homepage-pass-status.json``
    can be concealing ``{"status": "blocked"}``, and a corrupt
    ``assembly-diagnostics.json`` can be concealing the evidence that makes an
    empty role fatal. Degrading either to "absent" makes the gate report an
    empty blocker list — a success signal derived from unreadable input. The
    gate fails loudly instead; the CLI turns this into an exit-4 blocker with
    the file named in ``finalize-report.json``.
    """


def _read_gate_json(path: Path) -> Any:
    """Strict reader for artifacts consulted by :func:`detect_technical_artifact_blockers`.

    Absent -> ``None`` (decidable). Unreadable -> raise
    :class:`TechnicalArtifactUnreadableError` naming the file.
    """
    if not path.is_file():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        raise TechnicalArtifactUnreadableError(
            f"Blocker gate cannot read technical artifact {path}: "
            f"{exc.__class__.__name__}: {exc}. A corrupt artifact may be "
            "concealing a blocker, so the gate fails closed instead of "
            "reporting an empty blocker list."
        ) from exc


def _status_indicates_incomplete(status_payload: Any) -> bool:
    if not isinstance(status_payload, dict):
        return False
    if status_payload.get("status") != "completed":
        return True
    if status_payload.get("degraded") is True:
        return True
    if status_payload.get("readyForAssembly") is False:
        return True
    missing_required = status_payload.get("missingRequiredArtifacts")
    if isinstance(missing_required, list) and missing_required:
        return True
    return False


def homepage_status_indicates_blocked(status_payload: Any) -> bool:
    return (
        isinstance(status_payload, dict)
        and (
            status_payload.get("status") == "blocked"
            or status_payload.get("blockedBySecurityInterstitial") is True
        )
    )


def _artifact_cannot_be_shown_empty(path: Path) -> bool:
    """True unless the artifact is DECIDABLY without rows.

    Absent -> False: a pass that never wrote the file recorded nothing, which
    is exactly the state the caller is looking for.

    Present but unparsable -> True, which is the opposite of
    :func:`_read_optional_json`'s degradation and deliberately so. This
    predicate's True answer PROMOTES and its False answer refuses, so a
    truncated write from a killed probe -- the likeliest corruption on a
    ``failed`` pass -- must not be read as "the probe captured nothing". It
    also may not raise: the gate this feeds is a never-fail path, and an
    unreadable optional artifact is not worth converting a promotable run into
    an exit-1 crash.
    """
    if not path.is_file():
        return False
    try:
        rows = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return True
    return isinstance(rows, list) and any(isinstance(row, dict) for row in rows)


def homepage_status_failed_without_evidence(
    status_payload: Any, technical_dir: Path
) -> bool:
    """A ``failed`` homepage pass that captured nothing: no probe rows, no logo.

    Scoped on purpose to the empty case. Today a ``failed`` status reaches
    ``resolve_homepage_gate``, which keys on ``blocked`` alone, and the run
    promotes a kit assembled from zero evidence -- replacing a customer's Brand
    Kit with nothing. What is closed here is only that: a pass that died AFTER
    a probe wrote rows keeps today's path (promote, plus
    ``TECHNICAL_HOMEPAGE_PASS_INCOMPLETE_WARNING``).

    The evidence test is deliberately loose in the promoting direction -- any
    row in any of the four probe artifacts counts, including a transparent body
    background, and so does a single logo candidate. Erring toward promotion is
    the never-fail side of this gate, and the class being refused is "the
    account is replaced with nothing", not "the extraction is thin".
    """
    if not isinstance(status_payload, dict) or status_payload.get("status") != "failed":
        return False
    for name in HOMEPAGE_EVIDENCE_ARTIFACTS:
        if _artifact_cannot_be_shown_empty(technical_dir / name):
            return False
    signals = _read_optional_json(technical_dir / "page-signals.json")
    if (
        isinstance(signals, dict)
        and isinstance(signals.get("logoCandidates"), list)
        and signals["logoCandidates"]
    ):
        return False
    return True


def _has_reusable_visible_text_button_evidence(button_rows: Any) -> bool:
    if not isinstance(button_rows, list):
        return False
    for row in button_rows:
        if not isinstance(row, dict):
            continue
        default = row.get("default")
        if not isinstance(default, dict):
            continue
        signals = default.get("selectionSignals")
        if not isinstance(signals, dict):
            continue
        if _signals_show_reusable_visible_text_cta(signals):
            return True
    return False


def _signals_show_reusable_visible_text_cta(signals: dict[str, Any]) -> bool:
    if signals.get("looksLikePurchaseCta") is not True:
        return False
    if signals.get("homepageCtaNotReusableAsText") is True:
        return False
    if signals.get("ctaLabelNotUsable") is True:
        return False
    if signals.get("ctaIsIconLike") is True:
        return False
    visible_text = signals.get("ctaHasUsableVisibleText")
    if visible_text is None:
        visible_text = signals.get("hasUsableVisibleText")
    return visible_text is True


def _has_useful_button_record(record: Any) -> bool:
    if not isinstance(record, dict):
        return False
    if not _record_usage_hints(record):
        return False
    return any(
        record.get(key) is not None
        for key in (
            "backgroundColor",
            "fontColor",
            "borderColor",
            "hoverBackgroundColor",
            "hoverFontColor",
            "hoverBorderColor",
            "padding",
            "layout",
        )
    )


def _has_recovered_button_probe_evidence(final_buttons: Any, button_rows: Any) -> bool:
    return (
        isinstance(final_buttons, list)
        and any(_has_useful_button_record(record) for record in final_buttons)
        and isinstance(button_rows, list)
        and len(button_rows) > 0
    )


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


def _row_has_reusable_product_card_cta_evidence(row: Any) -> bool:
    if not isinstance(row, dict):
        return False
    signals = row.get("selectionSignals")
    if not isinstance(signals, dict):
        return False
    cta = row.get("cta")
    cta_text = cta.get("text") if isinstance(cta, dict) else None
    return (
        not product_card_cta_label_is_discount_only(cta_text)
        and signals.get("hasCta") is True
        and signals.get("ctaLooksPurchaseLike") is True
        and signals.get("ctaHasUsableVisibleText") is True
        and signals.get("ctaIsIconLike") is not True
        and signals.get("ctaLabelNotUsable") is not True
        and signals.get("homepageCtaNotReusableAsText") is not True
        and _signals_show_product_card_context(signals)
    )


def _has_reusable_product_card_cta_evidence(product_rows: Any) -> bool:
    return isinstance(product_rows, list) and any(_row_has_reusable_product_card_cta_evidence(row) for row in product_rows)


def _normalize_public_color(value: Any) -> str | None:
    if value is None:
        return None
    if not isinstance(value, str):
        return None
    raw = value.strip().lower()
    if not raw:
        return None
    match = re.fullmatch(r"#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})", raw)
    if not match:
        return raw
    body = match.group(1)
    if len(body) in {3, 4}:
        return "#" + "".join(char * 2 for char in body)
    return "#" + body


def _hover_key_from_values(background: Any, font: Any, border: Any) -> tuple[str | None, str | None, str | None] | None:
    values = (
        _normalize_public_color(background),
        _normalize_public_color(font),
        _normalize_public_color(border),
    )
    return None if values == (None, None, None) else values


def _technical_product_card_cta_hover_keys(product_rows: Any) -> set[tuple[str | None, str | None, str | None]]:
    keys: set[tuple[str | None, str | None, str | None]] = set()
    if not isinstance(product_rows, list):
        return keys
    for row in product_rows:
        if not _row_has_reusable_product_card_cta_evidence(row):
            continue
        cta = row.get("cta") if isinstance(row, dict) else None
        hover = cta.get("hover") if isinstance(cta, dict) else None
        if not isinstance(hover, dict):
            continue
        key = _hover_key_from_values(
            hover.get("backgroundColor"),
            hover.get("fontColor"),
            hover.get("borderColor"),
        )
        if key is not None:
            keys.add(key)
    return keys


def _final_product_card_cta_hover_mismatches_technical_evidence(brandkit: dict[str, Any], product_rows: Any) -> bool:
    technical_keys = _technical_product_card_cta_hover_keys(product_rows)
    if not technical_keys:
        return False
    cards = brandkit.get("brand", {}).get("components", {}).get("productCard", [])
    if not isinstance(cards, list):
        return False
    for card in cards:
        if not _product_card_cta_is_reusable(card):
            continue
        cta = card.get("cta")
        if not isinstance(cta, dict):
            continue
        key = _hover_key_from_values(
            cta.get("hoverBackgroundColor"),
            cta.get("hoverFontColor"),
            cta.get("hoverBorderColor"),
        )
        if key is not None and key not in technical_keys:
            return True
    return False


def _signals_show_product_card_context(signals: dict[str, Any]) -> bool:
    context_keys = (
        "hasProductUrl",
        "hasTitle",
        "hasImage",
        "hasCurrentPrice",
        "hasOldPrice",
    )
    return sum(1 for key in context_keys if signals.get(key) is True) >= 2


def _homepage_probe_likely_partial(product_rows: Any) -> bool:
    """Fires when the probe captured >0 but <HOMEPAGE_PROBE_LIKELY_PARTIAL_MAX_ROWS
    card-shape rows. A zero-row probe is covered by other blockers
    (homepage-blocked, false-fallback); a tiny non-zero count is the
    "homepage hydrated only its hero / promo banners" signature we see on
    bi-ua-style partial renders.
    """
    if not isinstance(product_rows, list):
        return False
    n = len(product_rows)
    return 0 < n < HOMEPAGE_PROBE_LIKELY_PARTIAL_MAX_ROWS


def _product_card_recovery_exhausted_without_representative(recovery_payload: Any, product_rows: Any) -> bool:
    if not isinstance(recovery_payload, dict):
        return False
    failure_signals = recovery_payload.get("failureSignals")
    summary = recovery_payload.get("summary")
    attempts = recovery_payload.get("attempts")
    row_count = _numeric_value(recovery_payload, "finalRowCount") or 0
    representative_count = _numeric_value(recovery_payload, "finalRepresentativeRowCount")
    if isinstance(product_rows, list):
        row_count = max(row_count, len(product_rows))
    if isinstance(attempts, list):
        for attempt in attempts:
            row_count = max(row_count, _numeric_value(attempt, "rowCount") or 0)
    exhausted = isinstance(failure_signals, list) and "recovery-exhausted-without-representative-card" in failure_signals
    if not exhausted:
        return False
    if row_count <= 0:
        return False
    if representative_count is not None and representative_count > 0:
        return False
    if isinstance(summary, dict) and summary.get("hasRepresentativeRow") is True:
        return False
    return True


def _has_non_empty_public_value(value: Any) -> bool:
    if value is None:
        return False
    if isinstance(value, str):
        return bool(value.strip())
    if isinstance(value, (dict, list)):
        return bool(value)
    return True


def _has_surface_or_border_evidence(card: dict[str, Any]) -> bool:
    surface = card.get("surface")
    if isinstance(surface, dict) and any(_has_non_empty_public_value(value) for value in surface.values()):
        return True
    return any(
        _has_non_empty_public_value(card.get(key))
        for key in (
            "backgroundColor",
            "borderColor",
            "borderWidth",
        )
    )


def _has_product_card_price_evidence(card: dict[str, Any]) -> bool:
    return (
        _has_non_empty_public_value(card.get("priceColor"))
        or _has_non_empty_public_value(card.get("oldPriceColor"))
        or _has_useful_typography(card.get("priceTypography"))
        or _has_useful_typography(card.get("oldPriceTypography"))
    )


def _has_product_card_cta_evidence(card: dict[str, Any]) -> bool:
    cta = card.get("cta")
    if not isinstance(cta, dict):
        return False
    return any(
        _has_non_empty_public_value(cta.get(key))
        for key in (
            "text",
            "textSource",
            "layoutIntent",
            "backgroundColor",
            "fontColor",
            "borderColor",
            "padding",
            "hoverBackgroundColor",
            "hoverFontColor",
            "hoverBorderColor",
        )
    )


def _has_product_card_core_component_evidence(card: dict[str, Any]) -> bool:
    return (
        _has_product_card_price_evidence(card)
        and _has_useful_typography(card.get("titleTypography"))
        and _has_surface_or_border_evidence(card)
        and _has_product_card_cta_evidence(card)
    )


def _final_product_card_evidence_is_weak_or_incomplete(brandkit: dict[str, Any]) -> bool:
    cards = brandkit.get("brand", {}).get("components", {}).get("productCard", [])
    if not isinstance(cards, list) or not cards:
        return True
    for card in cards:
        if not isinstance(card, dict):
            continue
        quality = str(card.get("evidenceQuality") or "").strip().lower()
        confidence = _numeric_value(card, "confidence") or 0
        has_price_evidence = bool(card.get("priceColor") or card.get("oldPriceColor") or card.get("priceTypography") or card.get("oldPriceTypography"))
        has_cta_evidence = isinstance(card.get("cta"), dict)
        has_surface_evidence = bool(card.get("surface") or card.get("backgroundColor") or card.get("borderColor"))
        if quality in {"medium", "strong"} and confidence >= 0.5 and (has_price_evidence or has_cta_evidence or has_surface_evidence):
            return False
        if _has_product_card_core_component_evidence(card):
            return False
    return True


def _social_values(brandkit: dict[str, Any]) -> list[str]:
    socials = brandkit.get("socials", {})
    if not isinstance(socials, dict):
        return []
    values: list[str] = []
    for value in socials.values():
        if isinstance(value, str) and value.strip():
            values.append(value.strip())
    return values


def _looks_like_empty_site_fallback_bundle(brandkit: dict[str, Any]) -> bool:
    brand = brandkit.get("brand", {})
    components = brand.get("components", {}) if isinstance(brand, dict) else {}
    colors = brand.get("colors", {}) if isinstance(brand, dict) else {}
    contacts = brandkit.get("contacts", {})

    accent_colors = colors.get("accentColors", []) if isinstance(colors, dict) else []
    background_colors = colors.get("backgroundColors", []) if isinstance(colors, dict) else []
    text_colors = colors.get("textColors", []) if isinstance(colors, dict) else []
    typography = brand.get("typography", []) if isinstance(brand, dict) else []
    buttons = components.get("button", []) if isinstance(components, dict) else []
    product_cards = components.get("productCard", []) if isinstance(components, dict) else []
    important_links = brandkit.get("importantLinks", [])
    languages = brandkit.get("languages", [])
    emails = contacts.get("emails", []) if isinstance(contacts, dict) else []
    phones = contacts.get("phones", []) if isinstance(contacts, dict) else []
    addresses = contacts.get("addresses", []) if isinstance(contacts, dict) else []

    return not any(
        (
            isinstance(accent_colors, list) and accent_colors,
            isinstance(background_colors, list) and background_colors,
            isinstance(text_colors, list) and text_colors,
            isinstance(typography, list) and typography,
            isinstance(buttons, list) and buttons,
            _has_product_card_extraction_evidence(product_cards),
            isinstance(important_links, list) and important_links,
            isinstance(languages, list) and languages,
            isinstance(emails, list) and emails,
            isinstance(phones, list) and phones,
            isinstance(addresses, list) and addresses,
            _social_values(brandkit),
        )
    )


def _has_product_card_extraction_evidence(product_cards: Any) -> bool:
    if not isinstance(product_cards, list):
        return False
    for card in product_cards:
        if not isinstance(card, dict):
            continue
        if card.get("evidenceQuality") == "none":
            continue
        if card.get("confidence") == 0 and not any(
            card.get(key)
            for key in (
                "backgroundColor",
                "borderColor",
                "priceColor",
                "oldPriceColor",
                "titleTypography",
                "cta",
            )
        ):
            continue
        return True
    return False


def _status_completed_and_ready(status_payload: Any) -> bool:
    return (
        isinstance(status_payload, dict)
        and status_payload.get("status") == "completed"
        and status_payload.get("degraded") is not True
        and status_payload.get("readyForAssembly") is True
        and not (isinstance(status_payload.get("missingRequiredArtifacts"), list) and status_payload.get("missingRequiredArtifacts"))
    )


def _extract_locale_hint(entry: Any) -> str:
    if not isinstance(entry, dict):
        return ""
    known_language_names = {
        "english": "en",
        "ukrainian": "uk",
        "українська": "uk",
        "украинский": "uk",
        "русский": "ru",
        "російська": "ru",
        "russian": "ru",
        "deutsch": "de",
        "german": "de",
        "français": "fr",
        "francais": "fr",
        "french": "fr",
        "español": "es",
        "espanol": "es",
        "spanish": "es",
        "italiano": "it",
        "italian": "it",
        "polski": "pl",
        "polish": "pl",
        "română": "ro",
        "romana": "ro",
        "romanian": "ro",
        "magyar": "hu",
        "hungarian": "hu",
        "čeština": "cs",
        "cestina": "cs",
        "czech": "cs",
        "slovenčina": "sk",
        "slovencina": "sk",
        "slovak": "sk",
        "português": "pt",
        "portugues": "pt",
        "portuguese": "pt",
        "türkçe": "tr",
        "turkce": "tr",
        "turkish": "tr",
        "nederlands": "nl",
        "dutch": "nl",
    }
    lang = entry.get("lang")
    if isinstance(lang, str):
        normalized = lang.strip().lower()
        lang_code = re.split(r"[-_,;\s]+", normalized, maxsplit=1)[0]
        if normalized in {"ua", "uk", "ru", "en", "de", "fr", "es", "it", "pl", "ro", "hu", "cz", "cs", "sk", "pt", "tr", "nl"}:
            return normalized
        if lang_code in {"ua", "uk", "ru", "en", "de", "fr", "es", "it", "pl", "ro", "hu", "cz", "cs", "sk", "pt", "tr", "nl"}:
            return lang_code
    text = entry.get("text")
    if isinstance(text, str):
        compact = text.strip().lower()
        if compact in {"ua", "uk", "ru", "en", "de", "fr", "es", "it", "pl", "ro", "hu", "cz", "cs", "sk", "pt", "tr", "nl"}:
            return compact
        if compact in known_language_names:
            return known_language_names[compact]
    url = entry.get("url")
    if isinstance(url, str):
        query_match = re.search(
            r"[?&](?:lang|locale|hl)=\s*(ua|uk|ru|en|de|fr|es|it|pl|ro|hu|cz|cs|sk|pt|tr|nl)(?:[&#]|$)",
            url,
            re.IGNORECASE,
        )
        if query_match:
            return query_match.group(1).lower()
        try:
            parsed = urlparse(url)
            segments = [segment.strip().lower() for segment in parsed.path.split("/") if segment.strip()]
        except ValueError:
            segments = []
        if len(segments) == 1 and segments[0] in {
            "ua",
            "uk",
            "ru",
            "en",
            "de",
            "fr",
            "es",
            "it",
            "pl",
            "ro",
            "hu",
            "cz",
            "cs",
            "sk",
            "pt",
            "tr",
            "nl",
        }:
            return segments[0]
    return ""


CANDIDATE_CONFIDENCE_FLOOR = 0.3

# Canonicalize alternate locale spellings so a single site that emits both
# forms doesn't register as multi-lingual. Codes accepted by _extract_locale_hint
# stay in the allowlist; this only applies to multilingual-evidence counting.
_LOCALE_HINT_ALIASES = {"cz": "cs", "ua": "uk"}


def _locale_hint_entry_is_same_site(entry: Any, target_host: str) -> bool:
    """True unless the hint's own link points at a DIFFERENT registrable domain.

    A visible language hint is only evidence about THIS site's languages when it
    belongs to this site. A vendor credit in the footer
    (``<a href="https://vendor.example/ua/">Built with Vendor</a>``) contributes
    the VENDOR's locale path segment, which made a single-language site register
    as multilingual and emit a false warning. Entries without a resolvable link
    (page copy, ``lang`` attributes, relative hrefs) are kept: they are the
    site's own text.

    Same-site is registrable-domain equality via the ``_identity_host`` /
    ``_identity_hosts_match`` pair, whose JS twins are ``identityHost`` /
    ``identityHostsMatch`` in ``lib/content-validators.js``. Mirrored by
    ``localeHintEntryIsSameSite`` in ``lib/technical-artifact-warnings.js``.
    """
    if not target_host or not isinstance(entry, dict):
        return True
    host = _identity_host(entry.get("url"))
    if not host:
        return True
    return _identity_hosts_match(host, target_host)


def _pool_has_confident_candidate(candidates: Any, role: str, *, threshold: float = CANDIDATE_CONFIDENCE_FLOOR) -> bool:
    if not isinstance(candidates, dict):
        return False
    entries = candidates.get(role)
    if not isinstance(entries, list):
        return False
    for entry in entries:
        if not isinstance(entry, dict):
            continue
        confidence = entry.get("confidence")
        try:
            value = float(confidence)
        except (TypeError, ValueError):
            continue
        if value >= threshold:
            return True
    return False


def _has_role_choice_justification(diagnostics: Any, field_paths: tuple[str, ...]) -> bool:
    if not isinstance(diagnostics, dict):
        return False
    justifications = diagnostics.get("roleChoiceJustifications")
    if not isinstance(justifications, dict):
        return False
    for path in field_paths:
        value = justifications.get(path)
        if isinstance(value, str) and value.strip():
            return True
    return False


def _required_with_evidence_findings(
    brandkit: dict[str, Any], technical_dir: Path
) -> tuple[list[str], list[str]]:
    """The four "confident candidate, empty public field" findings, split.

    Returns ``(styling, logos)``. The three styling findings -- background
    colours, typography, button -- and the logos one used to be one list that
    :func:`detect_technical_artifact_blockers` concatenated into six other fatal
    conditions, so any change to "the required-with-evidence blockers" moved the
    logo row by accident. A logo is the one field on this list that is also an
    ASSET URL, which is the factual family, so it is named separately even
    though the owner ruled it a warning too: the condition here is an EMPTY
    ``brand.logos``, an absence, and an absence cannot publish a false URL.

    Mirrors ``requiredWithEvidenceFindings`` in
    ``lib/technical-artifact-blockers.js``.
    """
    # Gate-only read semantics kept from when this was a blocker helper — see
    # _read_gate_json.
    diagnostics = _read_gate_json(technical_dir / "assembly-diagnostics.json")
    if not isinstance(diagnostics, dict):
        return [], []
    candidates = diagnostics.get("candidates")
    if not isinstance(candidates, dict):
        return [], []

    brand = brandkit.get("brand") if isinstance(brandkit, dict) else {}
    if not isinstance(brand, dict):
        brand = {}
    colors = brand.get("colors") if isinstance(brand.get("colors"), dict) else {}
    components = brand.get("components") if isinstance(brand.get("components"), dict) else {}

    styling: list[str] = []
    logo_findings: list[str] = []
    if _pool_has_confident_candidate(candidates, "canvas-background"):
        backgrounds = colors.get("backgroundColors")
        if (not isinstance(backgrounds, list) or len(backgrounds) == 0) and not _has_role_choice_justification(
            diagnostics, ("brand.colors.backgroundColors", "colors.backgroundColors")
        ):
            styling.append(REQUIRED_WITH_EVIDENCE_BACKGROUND_COLORS_BLOCKER)
    if _pool_has_confident_candidate(candidates, "body-typography") or _pool_has_confident_candidate(
        candidates, "heading-typography"
    ):
        typography = brand.get("typography")
        if (not isinstance(typography, list) or len(typography) == 0) and not _has_role_choice_justification(
            diagnostics, ("brand.typography", "typography")
        ):
            styling.append(REQUIRED_WITH_EVIDENCE_TYPOGRAPHY_BLOCKER)
    if _pool_has_confident_candidate(candidates, "button-primary"):
        buttons = components.get("button")
        if (not isinstance(buttons, list) or len(buttons) == 0) and not _has_role_choice_justification(
            diagnostics, ("brand.components.button", "components.button")
        ):
            styling.append(REQUIRED_WITH_EVIDENCE_BUTTON_BLOCKER)
    if _pool_has_confident_candidate(candidates, "logos"):
        logos = brand.get("logos")
        if (not isinstance(logos, list) or len(logos) == 0) and not _has_role_choice_justification(
            diagnostics, ("brand.logos", "logos")
        ):
            logo_findings.append(REQUIRED_WITH_EVIDENCE_LOGOS_BLOCKER)
    return styling, logo_findings


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


def _product_card_visible_text_mirror_missing(brandkit: dict[str, Any], product_rows: Any) -> list[str]:
    if not _has_reusable_product_card_cta_evidence(product_rows):
        return []
    blockers: list[str] = []
    if not _has_product_card_cta_button(brandkit):
        blockers.append(PRODUCT_CARD_CTA_VISIBLE_TEXT_MIRROR_MISSING_BLOCKER)
    if not _has_product_card_cta_typography(brandkit) and PRODUCT_CARD_CTA_VISIBLE_TEXT_MIRROR_MISSING_BLOCKER not in blockers:
        blockers.append(PRODUCT_CARD_CTA_VISIBLE_TEXT_MIRROR_MISSING_BLOCKER)
    return blockers


# EVERY codepoint JS `\s` matches, plus the C0 controls and DEL the JS regex
# names explicitly. Enumerated rather than delegated to `str.strip()` because
# the two languages' defaults disagree in BOTH directions: `str.strip()` does
# not remove U+FEFF or U+200B-family separators that JS `\s` does, and it DOES
# remove U+001C-U+001F, which JS `\s` does not.
#
# The list below is the JS `\s` production verbatim \u2014 <TAB> <VT> <FF> <SP>
# <NBSP> <ZWNBSP> plus every Unicode Zs, <LF> <CR> <LS> <PS> \u2014 so a name padded
# with a non-breaking space canonicalises identically on both sides. It used to
# not: `"\u00a0facebook"` reached the kit comparison as "facebook" in JS and as
# "\u00a0facebook" in Python, and the two languages then disagreed about
# whether the platform had been dropped.
_ASCII_LOWER_MAP = {ord(c): ord(c) + 32 for c in "ABCDEFGHIJKLMNOPQRSTUVWXYZ"}

# EXACTLY the set `String.prototype.trim` removes, derived by measuring V8 over
# U+0000..U+FFFF rather than from memory. Deliberately NOT _PLATFORM_STRIP_CHARS:
# that one also strips C0 controls, which is right for a platform NAME and wrong
# here. Python's bare `str.strip()` removes U+001C-U+001F (they are isspace() in
# Python and not JS whitespace), so a socials value of only C0 separators read as
# carried in JS and empty in Python -- a divergence in the one line both socials
# warnings depend on.
_JS_TRIM_CHARS = JS_TRIM_CHARS


def _js_trimmed_nonempty(value: Any) -> bool:
    """Mirror of JS `typeof v === "string" && v.trim().length > 0`."""
    return js_trimmed_nonempty(value)


_PLATFORM_STRIP_CHARS = "".join(
    [" \t\n\r\v\f\ufeff\u00a0\u1680\u2028\u2029\u202f\u205f\u3000"]
    + [chr(c) for c in range(0x2000, 0x200B)]  # U+2000..U+200A (Zs)
    + [chr(c) for c in range(0x00, 0x20)]
    + [chr(0x7F)]
)


def _canonical_platform_name(value: Any) -> str:
    r"""ONE spelling of canonicalisation, mirroring JS `canonicalPlatformName`.

    `str.strip()` and JS `\s` disagree on exotic whitespace in both directions
    (U+FEFF, U+00A0, U+001F), so both sides strip the same explicit character
    class instead of each language's default.
    """
    if not isinstance(value, str):
        return ""
    # ASCII-ONLY lowering, mirroring the JS twin. `str.lower()` and
    # `String.prototype.toLowerCase` resolve against each runtime's own
    # Unicode table and V8 is ahead of CPython 3.11 (U+1C89 lowers in JS,
    # not in Python), so one payload would yield two different warning
    # lists. Platform names are a closed ASCII enum, so this is equivalent
    # on real input and removes the divergence class by construction.
    return value.strip(_PLATFORM_STRIP_CHARS).translate(_ASCII_LOWER_MAP)


def _canonical_platform_set(values: Any) -> set[str]:
    if not isinstance(values, list):
        return set()
    platforms: set[str] = set()
    for value in values:
        name = _canonical_platform_name(value)
        if name:
            platforms.add(name)
    return platforms


def _social_platforms_seen(page_signals: Any) -> set[str]:
    """Platforms the visible probe classified AND the write could store.

    THE COMPARISON IS PER CANONICAL VALUE, NEVER PER RAW COUNT. Two Instagram
    anchors legitimately collapse to one ``socials.instagram`` field
    (``brandkitSocialsFromLinks`` keeps the best-scoring URL per platform), so
    "2 seen vs 1 carried" is CORRECT behaviour and must stay silent.

    Prefers ``visibleSocialPlatforms``, which the probe computes BEFORE the
    20-row cap on ``socials`` and filters to http(s). Falls back to deriving it
    from the capped rows for older captures.

    THE TWO PATHS AGREE ON http(s) AND DISAGREE ON WHAT A PLATFORM IS. This
    docstring used to say the identical http(s) rule made disagreement
    impossible. The http(s) rule IS identical; the CLASSIFICATION is not.
    ``visibleSocialPlatforms`` is written by today's probe, whose
    ``socialPlatformFor`` hard-vetoes a social CONTENT PERMALINK --
    ``youtube.com/watch``, ``youtu.be/<id>``, ``instagram.com/p/<id>``
    (``lib.js``, ``isSocialContentPermalink``) -- and returns "" so the row
    names no platform. A legacy row's ``platform`` STRING predates that veto,
    so the fallback reads a video permalink as a YouTube profile.

    Measured over the archived composed kits: 725 kits, every one of them
    legacy, 3 socials ``mapper-dropped`` warnings and exactly 1 false through
    this gap. Closing it means a third spelling of a per-platform list the
    probe itself calls "observed, not exhaustive"; the warning is advisory, so
    the disagreement is stated rather than denied. Mirrors the same note on
    ``socialPlatformsSeen`` in ``lib/technical-artifact-warnings.js``.
    """
    if not isinstance(page_signals, dict):
        return set()
    pre_cap = page_signals.get("visibleSocialPlatforms")
    if isinstance(pre_cap, list):
        return _canonical_platform_set(pre_cap)
    rows = page_signals.get("socials")
    if not isinstance(rows, list):
        return set()
    platforms: set[str] = set()
    for row in rows:
        if not isinstance(row, dict):
            continue
        url = row.get("url")
        # The write's OWN constant, not a second spelling of its rule.
        if not isinstance(url, str) or not _BRANDKIT_WRITE_HTTP_URL_RE.match(url):
            continue
        name = _canonical_platform_name(row.get("platform"))
        if name:
            platforms.add(name)
    return platforms


def _social_platforms_unfiltered(page_signals: Any) -> set[str]:
    """Platforms the UNFILTERED DOM sweep classified.

    Absent on captures written before this signal existed, which reads as an
    empty set: ``capture-unproven`` then cannot fire and ``mapper-dropped``
    still works. That is the intended soft failure, not a gap.
    """
    rows = (
        page_signals.get("unfilteredSocialPlatforms")
        if isinstance(page_signals, dict)
        else None
    )
    return _canonical_platform_set(rows)


def _social_platforms_in_kit(brandkit: Any) -> set[str]:
    """Platforms the final kit actually carries a non-empty value for."""
    socials = brandkit.get("socials") if isinstance(brandkit, dict) else None
    if not isinstance(socials, dict):
        return set()
    platforms: set[str] = set()
    for platform, value in socials.items():
        # THE EMPTINESS TEST IS LOAD-BEARING, not defensive. schema.json's
        # `$defs.socials` REQUIRES all 20 platform keys and the mapper fills
        # absent ones with "", so a real kit always carries 20 keys. Treating
        # key presence as carriage returns all 20 and makes both socials
        # warnings permanently unreachable.
        if _js_trimmed_nonempty(value):
            name = _canonical_platform_name(platform)
            if name:
                platforms.add(name)
    return platforms


def _any_value_dropped(seen: set[str], carried: set[str]) -> bool:
    return any(value not in carried for value in seen)


def _any_value_unproven(seen: set[str], unfiltered: set[str], carried: set[str]) -> bool:
    """True when the unfiltered sweep offers a value nothing else accounts for.

    This is the whole point of the grade: an empty probe is not evidence of an
    empty site.
    """
    return any(value not in seen and value not in carried for value in unfiltered)


def _has_contact_channel(container: Any, key: str) -> bool:
    bucket = container.get(key) if isinstance(container, dict) else None
    return isinstance(bucket, list) and len(bucket) > 0


def _js_integer_or_zero(value: Any) -> int:
    """`Number.isInteger(value) && value > 0 ? value : 0`, in Python terms.

    THE TWO SIDES READ THE SAME BYTES THROUGH DIFFERENT PARSERS. `JSON.parse`
    has ONE numeric type, so `3.0` and `1e30` arrive in JS as integer-valued
    Numbers that `Number.isInteger` accepts; `json.loads` gives Python a
    `float` for the same bytes, and `isinstance(value, int)` rejected it. The
    artifact `{"tel": 3.0}` therefore warned in JS and stayed silent in
    Python. The predicate is INTEGER-VALUED, not int-typed, so both parsers
    reach the same verdict on the same file.

    `bool` is excluded because `typeof true` is `"boolean"`, not `"number"`.
    Non-finite floats are excluded because `Number.isInteger(Infinity)` and
    `Number.isInteger(NaN)` are both false -- `float("inf").is_integer()` and
    `float("nan").is_integer()` are false too, so no explicit test is needed.
    An integer literal too large for a finite double parses to `Infinity` in
    JS, and `float()` raises OverflowError on exactly the same magnitudes, so
    the round-trip is the boundary test rather than a hand-written constant.
    """
    if isinstance(value, bool):
        return 0
    if isinstance(value, int):
        numeric = value
    elif isinstance(value, float):
        if not value.is_integer():
            return 0
        numeric = int(value)
    else:
        return 0
    try:
        float(numeric)
    except OverflowError:
        return 0
    return numeric if numeric > 0 else 0


def _hrefless_social_control_count(page_signals: Any) -> int:
    """`page-signals.json.hrefLessSocialControls.count`, or 0.

    An ABSENT field is a zero: every artifact produced before this signal
    existed has no such key, and a run whose page could not answer omits it
    rather than publishing a count it did not measure. Both must stay silent,
    which is the same thing the count-of-zero does. Shares
    `_js_integer_or_zero` with the unfiltered anchor counts so the two sides of
    the twin cannot disagree about what `3.0` means.
    """
    controls = (
        page_signals.get("hrefLessSocialControls")
        if isinstance(page_signals, dict)
        else None
    )
    if not isinstance(controls, dict):
        return 0
    return _js_integer_or_zero(controls.get("count"))


def _hrefless_social_controls_warning(count: int) -> str:
    return TECHNICAL_SOCIAL_HREFLESS_CONTROLS_WARNING.format(count=count)


def _unfiltered_anchor_count(page_signals: Any, scheme: str) -> int:
    anchors = (
        page_signals.get("unfilteredContactAnchors")
        if isinstance(page_signals, dict)
        else None
    )
    if not isinstance(anchors, dict):
        return 0
    value = anchors.get(scheme)
    return _js_integer_or_zero(value)


# BACKLOG item 31 — WRITABLE, NAVIGATION-ELIGIBLE important-link evidence.
#
# Two rungs, in this order:
#
#   1. WRITABLE — `_is_writable_important_link`, the mirror of the predicate
#      `linksFromSignals` filters with. Not a curation rule at all: a row
#      failing it cannot reach the kit no matter how the agent curates, so
#      counting it as loss reports the pipeline's own required drop as a
#      defect.
#   2. NAV-ELIGIBLE — the legal-page and over-cap filters below, which model
#      what SKILL.md instructs the agent to leave out.
#
# The probe admits legal pages on purpose: `privacy` and `terms` are literal
# alternatives in BOTH of its admission patterns. SKILL.md's "Important links
# flow" then instructs the agent to do the opposite — "EXCLUDE long product
# titles, article slugs, promo prose with dates/SKU codes, locale toggles,
# account/wishlist, and legal pages — those belong in body copy, not nav".
# A run that curated exactly as instructed lands ``importantLinks: []``, and
# grading the raw probe rows against that empty array reported the skill's own
# instruction as data loss.
#
# Over-cap names are excluded for the second half of the same reason:
# ``dropLongImportantLinkNames`` removes every ``name.length > 40`` entry
# unconditionally, so such a row CANNOT be carried and counting it as loss
# reports the pipeline's own normalisation as a defect.
#
# Mirrors JS `navEligibleImportantLinks` in technical-artifact-warnings.js.
# The token set is deliberately narrow. "Cookies" is a bakery category as often
# as it is a banner policy, so it qualifies here only when paired with
# policy/notice wording; a bare ``/cookies`` stays eligible and may still warn.
# Under-warning on one site is a smaller harm than silencing a real drop on
# another, so every token below is one no storefront uses as a nav label.
# KNOWN RESIDUAL, not fixed here: `re.IGNORECASE` folds Unicode and the JS
# twin's `/i` (no `/u` flag) does not, so "\u0130mprint" matches HERE and not
# there and the two warning lists diverge. Swept over all 1,114,112 codepoints
# against the 33 letters these two patterns are built from, the divergence is
# EXACTLY FOUR codepoints, every one folding on this side only: U+0130 and
# U+0131 to "i", U+017F to "s", U+212A to "k". Closing it means an explicit
# fold table on both sides or dropping the flag entirely, in lockstep.
_LEGAL_LINK_NAME_RE = re.compile(
    r"(privacy|terms|gdpr|legal|disclaimer|imprint|impressum|eula"
    r"|cookies?[\s_-]*(policy|notice|settings|preferences)"
    r"|конфіденц|конфиденц|оферт|правова)",
    re.IGNORECASE,
)
_LEGAL_LINK_PATH_RE = re.compile(
    r"(^|[._/-])(privacy([-_]?policy)?|terms([-_]?(of[-_]?)?(use|service|sale))?"
    r"|cookies?[-_]?(policy|notice)|gdpr|legal|disclaimer|imprint|impressum|eula)([._/?#-]|$)",
    re.IGNORECASE,
)
_IMPORTANT_LINK_SCHEME_RE = re.compile(r"^[a-z][a-z0-9+.\-]*://", re.IGNORECASE)

# Keep in sync with `IMPORTANT_LINK_NAME_LENGTH_CAP` in
# scripts/lib/important-link-name-cap.js — the normalize-time cap that decides
# whether an entry can be carried at all.
IMPORTANT_LINK_NAME_LENGTH_CAP = 40


def _important_link_path(url: Any) -> str:
    """Scheme + authority stripped WITHOUT a URL parser.

    A relative ``/help`` and an absolute ``https://acme.test/help`` must reduce
    to the same string, and the two languages must not disagree about what
    their respective parsers do. Host is deliberately excluded:
    ``legal-shop.test/delivery`` is a storefront, not a legal page.
    """
    without_scheme = _IMPORTANT_LINK_SCHEME_RE.sub("", url if isinstance(url, str) else "", count=1)
    slash = without_scheme.find("/")
    return "" if slash < 0 else without_scheme[slash:]


def _important_link_name_length(name: str) -> int:
    r"""UTF-16 code units, which is what JS `String.prototype.length` counts.

    The cap this mirrors is enforced in JS, so the unit must be JS's; on a name
    containing an astral character `len(name)` and `name.length` disagree.

    COUNTED, NEVER ENCODED. ``name.encode("utf-16-le")`` raises
    UnicodeEncodeError on a lone surrogate, and a lone surrogate is exactly
    what `JSON.stringify` emits for an unpaired `\ud800` in probe text --
    `json.loads` then hands it straight to this helper. The raise propagated
    out of an advisory warning gate and failed the whole finalize where the JS
    twin merely returns a length. Every codepoint contributes 1 unit, or 2
    when it is astral; a surrogate codepoint is already a single unit.
    """
    return sum(2 if ord(char) > 0xFFFF else 1 for char in name)


# Mirror of JS `normalizeText` in scripts/lib/extraction-pass-helpers.js --
# the normaliser the writable mapper runs on every `importantLinks` name.
#
# The character class is `_JS_TRIM_CHARS`, NOT `\s`. Python's `\s` matches
# U+001C-U+001F and U+0085 that JS's does not, and misses U+FEFF that JS's
# matches, so ``re.sub(r"\s+", " ", name).strip()`` would call a name empty
# here and non-empty there -- the exact divergence `_js_trimmed_nonempty`
# already exists to avoid on the socials channel. Swept over all 1,114,112
# codepoints against the JS twin: 0 mismatches.
_JS_WHITESPACE_RUN_RE = re.compile(f"[{re.escape(_JS_TRIM_CHARS)}]+")


def _normalize_important_link_text(value: str) -> str:
    return _JS_WHITESPACE_RUN_RE.sub(" ", value).strip(_JS_TRIM_CHARS)


# Mirror of JS `IMPORTANT_LINK_SCHEME_RE`: ``ALPHA *( ALPHA / DIGIT / "+" /
# "-" / "." ) ":"`` (RFC 3986 3.1). No relative reference can carry one before
# its first `/`.
_IMPORTANT_LINK_ANY_SCHEME_RE = re.compile(r"^[a-z][a-z0-9+.\-]*:", re.IGNORECASE)
_IMPORTANT_LINK_HTTP_SCHEME_RE = re.compile(r"^https?:$", re.IGNORECASE)


def _important_link_is_public_url(value: str) -> bool:
    """Mirror of JS `importantLinkIsPublicUrl`.

    PARSER-FREE on both sides. The JS mapper's `publicUrl` calls `new URL`,
    which has no Python equivalent, and `_important_link_path` above already
    documents why the two languages must never each ask their own URL parser.
    So this asks only what both can answer identically: is the normalised url
    non-empty, and is its scheme -- if it has one at all -- http(s)?

    MEASURED, and re-measured on every run by
    scripts/lib/important-link-writable.test.js: over its 1392-url corpus this
    rule and ``publicUrl(url, <any http(s) base>)`` disagree 106 times and ALL
    106 go one way -- this rule admits what `new URL` rejects (``http://``,
    ``http://[``, ``:99999``), never the reverse (0 of 1392), so it can
    over-warn and never under-warn. None of the 106 is reachable: `lib.js`'s
    `httpUrl` only emits urls `new URL` accepted.
    """
    raw = _normalize_important_link_text(value)
    if not raw:
        return False
    scheme = _IMPORTANT_LINK_ANY_SCHEME_RE.match(raw)
    return bool(_IMPORTANT_LINK_HTTP_SCHEME_RE.match(scheme.group(0))) if scheme else True


def _is_writable_important_link(name: str, url: str) -> bool:
    """Mirror of JS `isWritableImportantLink` (extraction-pass-helpers.js).

    THE predicate `linksFromSignals` filters with. One rule, and the gate asks
    it rather than re-deciding, so a row this gate grades as evidence is a row
    that mapper carries.
    """
    return bool(_normalize_important_link_text(name)) and _important_link_is_public_url(url)


def _is_nav_eligible_important_link(entry: Any) -> bool:
    if not isinstance(entry, dict):
        return False
    name = entry.get("name") if isinstance(entry.get("name"), str) else ""
    url = entry.get("url") if isinstance(entry.get("url"), str) else ""
    # WRITABLE FIRST. The probe admits rows the writable mapper is REQUIRED to
    # drop -- `lib.js` builds each row as ``name: entry.text || ""``, so a
    # visible icon-only ``/delivery`` link arrives as ``{name: "", url: ...}``
    # -- and `linksFromSignals` removes them. Grading those rows against the
    # kit reported the mapper's own correct drop as data loss.
    if not _is_writable_important_link(name, url):
        return False
    # The mapper's normaliser, not the raw field: the cap and the legal-name
    # test must judge the string the kit would actually carry.
    normalized_name = _normalize_important_link_text(name)
    if _important_link_name_length(normalized_name) > IMPORTANT_LINK_NAME_LENGTH_CAP:
        return False
    if _LEGAL_LINK_NAME_RE.search(normalized_name):
        return False
    if _LEGAL_LINK_PATH_RE.search(_important_link_path(url)):
        return False
    return True


def _nav_eligible_important_links(rows: Any) -> list[Any]:
    if not isinstance(rows, list):
        return []
    return [row for row in rows if _is_nav_eligible_important_link(row)]


def validate_brandkit_against_technical_artifacts(
    brandkit: dict[str, Any],
    technical_dir: Path,
) -> list[str]:
    if not technical_dir.is_dir():
        return []

    warnings: list[str] = []
    final_buttons = brandkit.get("brand", {}).get("components", {}).get("button", [])
    has_any_final_buttons = isinstance(final_buttons, list) and len(final_buttons) > 0

    button_rows = _read_optional_json(technical_dir / "button-styles.json")
    if not has_any_final_buttons and _has_reusable_visible_text_button_evidence(button_rows):
        warnings.append(TECHNICAL_BUTTON_EVIDENCE_WARNING)

    product_rows = _read_optional_json(technical_dir / "product-card-styles.json")
    if _has_reusable_product_card_cta_evidence(product_rows):
        if not _has_product_card_cta_button(brandkit):
            warnings.append(TECHNICAL_PRODUCT_CARD_CTA_BUTTON_WARNING)
        if not _has_product_card_cta_typography(brandkit):
            warnings.append(TECHNICAL_PRODUCT_CARD_CTA_TYPOGRAPHY_WARNING)
    if _final_product_card_cta_hover_mismatches_technical_evidence(brandkit, product_rows):
        warnings.append(TECHNICAL_PRODUCT_CARD_CTA_HOVER_WARNING)

    product_recovery = _read_optional_json(technical_dir / "product-card-styles.recovery.json")
    if not isinstance(product_recovery, dict):
        homepage_status = _read_optional_json(technical_dir / "homepage-pass-status.json")
        product_recovery = homepage_status.get("productCardRecovery") if isinstance(homepage_status, dict) else None
    if (
        _product_card_recovery_exhausted_without_representative(product_recovery, product_rows)
        and _final_product_card_evidence_is_weak_or_incomplete(brandkit)
    ):
        warnings.append(TECHNICAL_PRODUCT_CARD_WEAK_EVIDENCE_WARNING)
        if _homepage_probe_likely_partial(product_rows):
            warnings.append(TECHNICAL_PRODUCT_CARD_HOMEPAGE_PROBE_LIKELY_PARTIAL_WARNING)

    page_signals = _read_optional_json(technical_dir / "page-signals.json")
    final_languages = brandkit.get("languages", [])
    if isinstance(page_signals, dict):
        target_host = _identity_host(page_signals.get("pageUrl")) or ""
        visible_hints = page_signals.get("visibleLanguageHints")
        if isinstance(visible_hints, list):
            locale_hints = {
                _LOCALE_HINT_ALIASES.get(hint, hint)
                for hint in (
                    _extract_locale_hint(entry)
                    for entry in visible_hints
                    if _locale_hint_entry_is_same_site(entry, target_host)
                )
                if hint
            }
            if len(locale_hints) >= 2 and (not isinstance(final_languages, list) or len(final_languages) < 2):
                warnings.append(TECHNICAL_LANGUAGE_EVIDENCE_WARNING)
        document_hints = page_signals.get("documentLanguageHints")
        if isinstance(document_hints, list):
            locale_hints = {
                _LOCALE_HINT_ALIASES.get(hint, hint)
                for hint in (_extract_locale_hint(entry) for entry in document_hints)
                if hint
            }
            if len(locale_hints) >= 2 and (not isinstance(final_languages, list) or len(final_languages) == 0):
                warnings.append(TECHNICAL_LANGUAGE_EVIDENCE_WARNING)

    # BACKLOG item 31 — section evidence. `languages` is deliberately NOT here:
    # the two locale-hint checks above already own that channel, and a second
    # warning on the same evidence would be a duplicate.
    #
    # `importantLinks` gets `mapper-dropped` ONLY. Its probe rows are curated
    # {name, url} pairs with no independent unfiltered spelling, so there is no
    # honest `capture-unproven` signal to compute; inventing one would be the
    # same correlate-instead-of-question mistake this gate exists to catch.
    if isinstance(page_signals, dict):
        socials_seen = _social_platforms_seen(page_signals)
        socials_unfiltered = _social_platforms_unfiltered(page_signals)
        socials_carried = _social_platforms_in_kit(brandkit)
        if _any_value_dropped(socials_seen, socials_carried):
            warnings.append(TECHNICAL_SOCIAL_MAPPER_DROPPED_WARNING)
        if _any_value_unproven(socials_seen, socials_unfiltered, socials_carried):
            warnings.append(TECHNICAL_SOCIAL_CAPTURE_UNPROVEN_WARNING)
        # The href-less arm. Gated on the KIT carrying no social url at all,
        # not on the per-platform comparison above: this evidence names no
        # platform, so it can only speak to the whole channel, and a site whose
        # visible anchors already produced socials has had that channel proven
        # — the icons drawn without an href beside them are then a duplicate
        # rendering, not a missed capture.
        hrefless_social_controls = _hrefless_social_control_count(page_signals)
        if hrefless_social_controls > 0 and not socials_carried:
            warnings.append(_hrefless_social_controls_warning(hrefless_social_controls))

        # Email and phone are evaluated INDEPENDENTLY: a site that publishes a
        # phone number and no address must not have its phone finding masked by
        # the email channel, and vice versa.
        signal_contacts = page_signals.get("contacts")
        final_contacts = brandkit.get("contacts") if isinstance(brandkit, dict) else None
        for channel_key, scheme, mapper_dropped, capture_unproven in CONTACT_CHANNELS:
            if _has_contact_channel(final_contacts, channel_key):
                continue
            if _has_contact_channel(signal_contacts, channel_key):
                warnings.append(mapper_dropped)
            elif _unfiltered_anchor_count(page_signals, scheme) > 0:
                warnings.append(capture_unproven)

        links_seen = _nav_eligible_important_links(page_signals.get("importantLinksForBrandkit"))
        links_carried = brandkit.get("importantLinks") if isinstance(brandkit, dict) else None
        if (
            len(links_seen) > 0
            and (not isinstance(links_carried, list) or len(links_carried) == 0)
        ):
            warnings.append(TECHNICAL_IMPORTANT_LINKS_MAPPER_DROPPED_WARNING)

    homepage_status = _read_optional_json(technical_dir / "homepage-pass-status.json")
    if homepage_status_indicates_blocked(homepage_status):
        warnings.append(TECHNICAL_HOMEPAGE_BLOCKED_BLOCKER)
    if isinstance(homepage_status, dict):
        completed_phases = homepage_status.get("completedPhases")
        button_probe_degraded = homepage_status.get("buttonProbeDegraded") or (
            isinstance(completed_phases, list) and "buttons-degraded" in completed_phases
        )
        if button_probe_degraded and not _has_recovered_button_probe_evidence(final_buttons, button_rows):
            warnings.append(TECHNICAL_BUTTON_PROBE_DEGRADED_WARNING)
    if _status_indicates_incomplete(homepage_status):
        warnings.append(TECHNICAL_HOMEPAGE_PASS_INCOMPLETE_WARNING)

    # THE FOUR REQUIRED-WITH-EVIDENCE FINDINGS, demoted from blockers.
    #
    # APPENDED AT THE TAIL, and the position is load-bearing rather than
    # convenient: ``_assert_technical_artifact_warnings_parity`` compares this
    # list to the JS one with an ORDERED ``assertEqual``, so the twin appends at
    # the same place or nine existing fixtures fail at once. The tail is also
    # the only position that leaves every existing warning at the index it had.
    #
    # The ``_status_completed_and_ready`` guard is carried over from
    # :func:`detect_technical_artifact_blockers` verbatim. Without it these
    # findings would start firing on captures the blocker never judged -- a
    # blocked or half-finished homepage -- which would be a new condition rather
    # than a moved one. Styling first, then logos, matching the split's order.
    if _status_completed_and_ready(homepage_status):
        required_styling, required_logos = _required_with_evidence_findings(
            brandkit, technical_dir
        )
        warnings.extend(required_styling)
        warnings.extend(required_logos)

    return _dedupe_messages(warnings)


def detect_technical_artifact_blockers(
    brandkit: dict[str, Any],
    technical_dir: Path,
) -> list[str]:
    """Blocker gate over the technical artifacts.

    Every artifact read here is STRICT (:func:`_read_gate_json`): an absent
    artifact is decidable ("no evidence"), an unreadable one is not, and
    swallowing it would emit an empty blocker list — a clean-run signal derived
    from a file that may be concealing a blocker. Unreadable artifacts raise
    :class:`TechnicalArtifactUnreadableError`.
    """
    if not technical_dir.is_dir():
        return []

    homepage_status = _read_gate_json(technical_dir / "homepage-pass-status.json")
    blockers: list[str] = []
    if homepage_status is not None and not isinstance(homepage_status, dict):
        raise TechnicalArtifactUnreadableError(
            "Blocker gate requires technical artifact "
            f"{technical_dir / 'homepage-pass-status.json'} to be a JSON object. "
            "A wrong-shaped status may conceal a blocked homepage."
        )

    if homepage_status_indicates_blocked(homepage_status):
        return [TECHNICAL_HOMEPAGE_BLOCKED_BLOCKER]

    if not _status_completed_and_ready(homepage_status):
        return blockers

    # FAIL-CLOSED ON THE FILE, EVEN THOUGH NOTHING HERE READS ITS CONTENT.
    # ``assembly-diagnostics.json`` was a gate input only because the
    # required-with-evidence findings read it; moving those to warnings would
    # have moved this strict read with them and quietly turned "we could not
    # check" back into "we checked and it was fine" for the blocker gate. The
    # read stays, on purpose and by itself, so a corrupt or non-UTF-8
    # diagnostics file still raises here exactly as it did -- row J9, which is
    # on the BLOCK list and does not move in this change.
    diagnostics = _read_gate_json(technical_dir / "assembly-diagnostics.json")
    if diagnostics is not None and not isinstance(diagnostics, dict):
        raise TechnicalArtifactUnreadableError(
            "Blocker gate requires technical artifact "
            f"{technical_dir / 'assembly-diagnostics.json'} to be a JSON object. "
            "A wrong-shaped diagnostics artifact may conceal a blocker."
        )

    # NOT EXTENDED HERE ANY MORE. All four required-with-evidence findings say
    # "a confident candidate exists and the public field is empty", which
    # publishes NO value and therefore cannot publish a false one. Blocking on
    # them yields no kit at all, and a refused run under replace-only
    # persistence leaves the account with the previous site's kit or with
    # nothing. They are emitted as warnings by
    # :func:`validate_brandkit_against_technical_artifacts`, in lockstep with
    # the JS twin -- this function is the FALLBACK used whenever the node
    # subprocess produces no verdict, so moving one side alone would restore
    # the old blocking behaviour on any run where node failed.

    # The product-card visible-text mirror check is now a warning rather than
    # a blocker (mirrored in technical-artifact-blockers.js). The same
    # condition is surfaced by validate_brandkit_against_technical_artifacts
    # as TECHNICAL_PRODUCT_CARD_CTA_BUTTON/TYPOGRAPHY_WARNING.

    if not _looks_like_empty_site_fallback_bundle(brandkit):
        return _dedupe_messages(blockers)

    page_signals = _read_gate_json(technical_dir / "page-signals.json")
    button_rows = _read_gate_json(technical_dir / "button-styles.json")
    run_notes = _read_gate_json(technical_dir / "run-notes.json")
    for filename, value, valid in (
        ("page-signals.json", page_signals, isinstance(page_signals, dict)),
        ("button-styles.json", button_rows, isinstance(button_rows, list)),
        ("run-notes.json", run_notes, isinstance(run_notes, dict)),
    ):
        if value is not None and not valid:
            raise TechnicalArtifactUnreadableError(
                "Blocker gate requires technical artifact "
                f"{technical_dir / filename} to have its producer-defined JSON shape. "
                "A wrong-shaped artifact may conceal a blocker."
            )

    has_page_signal_evidence = False
    if isinstance(page_signals, dict):
        socials = page_signals.get("socials")
        important_links = page_signals.get("importantLinks")
        visible_language_hints = page_signals.get("visibleLanguageHints")
        document_language_hints = page_signals.get("documentLanguageHints")
        has_page_signal_evidence = any(
            (
                isinstance(socials, list) and len(socials) > 0,
                isinstance(important_links, list) and len(important_links) > 0,
                isinstance(visible_language_hints, list) and len(visible_language_hints) > 0,
                isinstance(document_language_hints, list) and len(document_language_hints) > 0,
            )
        )

    has_button_evidence = _has_reusable_visible_text_button_evidence(button_rows)

    run_notes_claim_fallback = (
        isinstance(run_notes, dict)
        and run_notes.get("assemblyMode") == "fallback-with-empty-site-extraction-fields"
    )

    if has_page_signal_evidence or has_button_evidence or run_notes_claim_fallback:
        blockers.append(TECHNICAL_FALSE_FALLBACK_BLOCKER)
    return _dedupe_messages(blockers)


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


#: ``reason`` spellings the JS coverage gates put on an entry the run could not
#: stand behind. Mirrors ``role-coverage-reasons.js`` in
#: ``skills/brandkit-extraction-v-0/scripts/lib/``. Kept as named constants
#: because several readers below branch on them and a loose string literal is
#: how two conditions get merged back together.
#:
#: The first two describe a role that is PRESENT on a row; the third describes
#: one that is ABSENT although the capture offered what a producer needed. All
#: three used to be identifiable by ``severity: "high"``; under the severity
#: split they carry ``"gap"``, so the reason is the only thing that tells them
#: from the honest gap (``no_evidence``).
ROLE_REASON_AUTHORED_WITHOUT_EVIDENCE = "authored_without_evidence"
ROLE_REASON_VALUE_NOT_MEASURED = "value_not_measured"
ROLE_REASON_ROLE_NOT_PRODUCED = "role_not_produced"

# The two `kind` values `role_coverage_gaps` emits.
#
# `kind` DESCRIBES THE PAGE, never the value on the row -- that is what
# `roleProvenance` on the artifact is for. `missing_role` says the kit is not
# carrying this role at all. `authored_value` says it IS carrying one and the
# capture offers the role nothing, so whatever is on the row was authored.
#
# Both were spelled `missing_role` until this split, which put a role the kit
# carries into the report under a label saying it does not, one line away from a
# sibling warning saying "the role is present on a row". The MEMBERSHIP is
# unchanged and deliberately so: excluding the authored entry would make an
# authored run QUIETER than an honest one, which is the whole argument in this
# function's docstring. Only the label moved.
ROLE_GAP_KIND_MISSING = "missing_role"
ROLE_GAP_KIND_AUTHORED = "authored_value"

#: The `code` the JS variant-decision diagnostic stamps on its "cards present,
#: no usable index" entry. Mirrors ``VARIANT_INDEX_ABSENT_CODE`` in
#: ``skills/brandkit-extraction-v-0/scripts/lib/extraction-pass-helpers.js``.
#: Selected by CODE and never by the message prose, so rewording the producer's
#: repair text cannot silently stop this reader from finding the entry.
VARIANT_INDEX_ABSENT_CODE = "variant_index_absent"

#: The ``kind`` / ``role`` / ``reason`` this module puts on that gap.
#:
#: A NEW ``kind``, deliberately, rather than reusing ``missing_role``: the two
#: existing kinds are about REGION ROLES (a typography or text-colour role the
#: page could not supply) and the onboarding SKILL's prose reads them that way.
#: A variant index is not a role -- it is a pick from a bundled repertoire --
#: and filing it under ``missing_role`` would make a consumer explain it as
#: styling the site does not have.
VARIANT_INDEX_GAP_KIND = "missing_variant_index"
VARIANT_INDEX_GAP_CHANNEL = "product-card"
VARIANT_INDEX_GAP_ROLE = "product-card-variant-index"
VARIANT_INDEX_GAP_REASON = "no_variant_index"

#: The three reasons that mean "the run could not stand behind this role", as
#: opposed to the HONEST GAPS, which are properties of the page: ``no_evidence``
#: (nothing could have produced the role) and ``illegible_on_canvas`` (the
#: capture holds the role's rows and every colour on them is under 3:1 against
#: the page's own canvas, so the synthesiser declines to publish one). Neither
#: names something an agent, a re-probe or a recovery pass can act on, so
#: neither belongs here: membership drives the finalize warning list, the
#: recovery summary and the retry budget. Mirrors ``UNRESOLVED_ROLE_REASONS`` in
#: ``role-coverage-reasons.js``.
UNRESOLVED_ROLE_REASONS = frozenset(
    {
        ROLE_REASON_AUTHORED_WITHOUT_EVIDENCE,
        ROLE_REASON_VALUE_NOT_MEASURED,
        ROLE_REASON_ROLE_NOT_PRODUCED,
    }
)

#: The marker ``--mode normalize`` stamps into ``assembly-diagnostics.json`` on
#: the pass that validated the artifact. Mirrors ``ROLE_COVERAGE_GATE_FIELD`` in
#: ``skills/brandkit-extraction-v-0/scripts/lib/role-coverage-recheck.js``.
#:
#: READ BY PRESENCE HERE, BY EXACT VALUE THERE, and the blocker text below has
#: to say so. :func:`role_coverage_recheck_is_mandatory` tests the KEY, never
#: its value, so a dir stamped by ANY normalize in this lineage -- version 1
#: through the current one -- is in the population this blocker speaks for. The
#: text used to say "`--mode normalize` in this build", which is true only of
#: the newest version and describes the wrong dirs for every older one.
ROLE_COVERAGE_GATE_FIELD = "roleCoverageGateVersion"

#: What finalize says when the JS validator could not run over a technical dir
#: that carries the marker. "We could not check" must never be reported as
#: "we checked and it was fine"; see
#: :func:`role_coverage_recheck_is_mandatory` for the population split.
#: A WARNING NOW, NOT A BLOCKER, and the name is deliberately unchanged so the
#: string a reader greps for still finds the same condition. What it guards is a
#: STYLING re-check: every finding inside ``roleCoverageRecheckFindings`` is a
#: typography or colour provenance note, and under the severity policy those
#: warn. The one finding that is not -- a hand-edited diagnostics file -- has a
#: Python twin of its own now (:func:`role_coverage_stale_artifact_blocker`), so
#: losing the subprocess no longer loses a fatal check.
ROLE_COVERAGE_RECHECK_UNAVAILABLE_WARNING = (
    "Role-coverage provenance re-check could not run: assembly-diagnostics.json carries the "
    f"`{ROLE_COVERAGE_GATE_FIELD}` marker, so some `--mode normalize` in this lineage stamped "
    "this technical dir and validate-skill-output.js owns the re-check that judges "
    "brandkit.extraction.json as it stands on disk — but the node subprocess produced no usable "
    "result (missing/failed `node`, a missing or crashing validate-skill-output.js, a timeout, or "
    "unparseable output). The separate pre-compose path already re-derived roleProvenance or "
    "removed the optional map rather than retaining an unverifiable positive grade. Styling "
    "remains advisory; Python still enforces the factual and artifact-integrity blockers. Fix "
    "the node runtime or skill install and re-run for the complete late validation report; a "
    "technical dir written before this marker existed is unaffected."
)

#: The pre-split name, kept bound to the new string so an importer that has not
#: been updated gets the current text rather than a stale copy of the old one.
ROLE_COVERAGE_RECHECK_UNAVAILABLE_BLOCKER = ROLE_COVERAGE_RECHECK_UNAVAILABLE_WARNING


#: The Python twin of ``ROLE_COVERAGE_STALE_ARTIFACT_BLOCKER`` in
#: ``lib/role-coverage-recheck.js``. BYTE-IDENTICAL to the JS constant: the two
#: describe one condition and a reader comparing a finalize report against a
#: node run must not have to decide whether two spellings are the same finding.
ROLE_COVERAGE_STALE_ARTIFACT_BLOCKER = (
    "assembly-diagnostics.json is internally inconsistent: it carries the role-coverage gate "
    "marker, which `--mode normalize` writes only on the pass that validated the artifact, and "
    "yet reports `schemaValidated` other than `true`. No normalize pass writes that pair, so the "
    "file has been edited by hand and nothing here can say what judged brandkit.extraction.json. "
    "Re-run `--mode normalize` on the current input and fix what it reports."
)


def role_coverage_stale_artifact_blocker(technical_dir: Path) -> str | None:
    """The one role-coverage finding that stays fatal, checkable without node.

    THIS EXISTS SO THE UNAVAILABLE-RE-CHECK BLOCKER CAN STOP BEING ONE.
    ``ROLE_COVERAGE_RECHECK_UNAVAILABLE_BLOCKER`` fires when the node subprocess
    yields no verdict, and it was fatal because losing the re-check lost every
    finding inside it. Most of those findings are styling ones and now warn --
    but one is not: the JS module also returns
    ``ROLE_COVERAGE_STALE_ARTIFACT_BLOCKER`` on a diagnostics file that carries
    the gate marker while denying its own normalize validated anything. That is
    artifact tampering, it is correctly fatal, and until this function existed
    there was no Python twin for it. Demoting the unavailable blocker without
    building this one would have dropped the tampering check on exactly the path
    where node is not answering.

    WIDER THAN THE JS TWIN, ON PURPOSE. ``diagnosticsCarryRoleCoverageGate``
    requires the marker to EQUAL the current gate version, because the JS side
    is deciding which dirs today's predicates may judge. This function decides
    something else: whether the file contradicts itself. The marker goes on at
    the same statement as ``schemaValidated = true`` in every version of the
    producer, so the pair is impossible for a marker of ANY value, and reading
    presence keeps ONE source of truth for the version number -- the same
    argument :func:`role_coverage_recheck_is_mandatory` makes for itself.

    Lenient about the file, like both of its neighbours: a missing, unreadable
    or non-object diagnostics file is not this population.
    """
    diagnostics = _read_optional_json(technical_dir / "assembly-diagnostics.json")
    if not isinstance(diagnostics, dict):
        return None
    if ROLE_COVERAGE_GATE_FIELD not in diagnostics:
        return None
    if diagnostics.get("schemaValidated") is True:
        return None
    return ROLE_COVERAGE_STALE_ARTIFACT_BLOCKER


def role_coverage_recheck_is_mandatory(technical_dir: Path) -> bool:
    """Does this technical dir belong to the population the JS re-check judges?

    TRUE when ``assembly-diagnostics.json`` carries the gate marker at all —
    the presence of the KEY, not a particular value. The JS side acts only on
    its own version, and deliberately: replaying today's predicates over dirs
    written by ~May 2026 producers refuses a majority of them, so an ungated
    check would refuse legitimate re-finalizes. That argument is about which
    dirs the gate may JUDGE. This function answers a different question — may
    finalize proceed having not run it at all — and there the safe direction is
    the other one: a dir carrying a marker of any value was stamped by some
    normalize in this lineage, and finalizing it on validators that have no
    provenance check reports an unchecked artifact as checked.

    Reading presence rather than equality also keeps ONE source of truth for the
    version number, which lives in the JS module and exists to be bumped. A
    Python copy of it would be a second one, and would fail open on exactly the
    dirs the newest normalize wrote.

    Lenient, like ``diagnosticsCarryRoleCoverageGate``: a missing, unreadable or
    non-object diagnostics file is NOT this population and keeps today's
    behaviour, which is what a legacy technical dir has.
    """
    diagnostics = _read_optional_json(technical_dir / "assembly-diagnostics.json")
    return isinstance(diagnostics, dict) and ROLE_COVERAGE_GATE_FIELD in diagnostics


def role_coverage_gaps(technical_dir: Path) -> list[dict[str, Any]]:
    """Structured record of region roles no deterministic producer derived.

    A ``severity: "gap"`` entry means the deterministic selectors did not
    derive the role from this capture. The visual role may still exist outside
    those selectors, and a later recovery pass may fill it. That uncertainty is
    not a fault and must not stop the run: a kit with a named gap is worth more
    than no kit.

    A ``severity: "high"`` entry whose ``reason`` is
    ``authored_without_evidence`` describes the SAME evidence state — the
    capture offers the role nothing — and is reported here too, under its own
    ``reason``. Without that, authoring a value for a gapped role makes the run
    QUIETER than the honest one: the gate flips the entry from
    ``gap``/``no_evidence`` to ``high``/``authored_without_evidence``, the
    ``severity == "gap"`` filter stops matching, and the gap the honest run
    would have named disappears from the report. ``value_not_measured`` is
    deliberately NOT included: that reason is graded ``evidence_present``, so
    the role IS derivable here and the honest run covers it rather than gapping
    it.

    Current technical artifacts omit a PRESENT role from ``gaps`` whenever
    their ``roleProvenance`` grade is non-missing. Recovery uncertainty belongs
    in the provenance warnings, not in a list consumed as absent functionality.
    The legacy ``authored_value`` shape remains only for artifacts without such
    a grade, so old technical dirs do not become quieter when re-finalized.

    These are returned SEPARATELY from ``blockers`` on purpose. The onboarding
    consumer stops on any named blocker, so filing a gap there would defeat at
    the consumer exactly what the gate change achieves upstream.
    """
    diagnostics = _read_optional_json(technical_dir / "assembly-diagnostics.json")
    if not isinstance(diagnostics, dict):
        return []
    # Read leniently and separately from the diagnostics: an artifact written
    # before `roleProvenance` existed is a supported re-finalize, and it simply
    # gets the pre-existing gap shape.
    artifact = _read_optional_json(technical_dir / "brandkit.extraction.json")
    role_provenance = (
        artifact.get("roleProvenance") if isinstance(artifact, dict) else None
    )
    if not isinstance(role_provenance, dict):
        role_provenance = {}
    gaps: list[dict[str, Any]] = []
    for key, channel in (
        ("typographyRoleCoverage", "typography"),
        ("textColorRoleCoverage", "text-color"),
    ):
        entries = diagnostics.get(key)
        if not isinstance(entries, list):
            continue
        for entry in entries:
            if not isinstance(entry, dict):
                continue
            severity = entry.get("severity")
            reason = entry.get("reason")
            # THE SEVERITY SPLIT MADE THIS RULE LOAD-BEARING IN A WAY IT WAS
            # NOT. It used to read "any `gap`, plus `high` + authored", and any
            # `gap` was unambiguous because the only reason a `gap` entry could
            # carry was `no_evidence`. Now three more reasons reach `"gap"`, and
            # admitting them all would put a `value_not_measured` role in
            # `gaps[]` -- a role that IS present on a row, whose value is merely
            # unproven. The docstring above says that exclusion is deliberate;
            # without this branch the docstring would have quietly become false.
            #
            # `role_not_produced` IS admitted, and only at `"gap"`. Before the
            # split a missing-with-evidence role made normalize THROW, so no kit
            # shipped without it and `gaps[]` never had to name it. Now the kit
            # ships, so a consumer reading `gaps[]` has to learn the role is
            # absent. At `"high"` it still means a run that stopped, and the
            # membership there stays exactly as it was.
            if severity == "gap":
                if reason == ROLE_REASON_VALUE_NOT_MEASURED:
                    continue
            elif reason != ROLE_REASON_AUTHORED_WITHOUT_EVIDENCE:
                continue
            hint = entry.get("hint")
            if not isinstance(hint, str) or not hint:
                continue
            graded = role_provenance.get(hint)
            if isinstance(graded, dict) and graded.get("provenance") in {
                "dom-measured",
                "agent-recovered",
                "screenshot-sampled",
                "defaulted",
            }:
                # The role is present in the Brand Kit and its standing is
                # carried by the technical artifact. Reporting it as a gap
                # would make recovered styling read as missing downstream.
                continue
            # THE SAME GRADE THE TECHNICAL ARTIFACT CARRIES, read from it
            # rather than re-derived. `roleProvenance` is written by
            # `--mode normalize` from the very entries this function is
            # reading, so a second derivation here could only ever drift --
            # and a report that disagrees with its technical evidence is worse
            # than one that says less.
            entry_gap: dict[str, Any] = {
                # See ROLE_GAP_KIND_MISSING / ROLE_GAP_KIND_AUTHORED. The
                # authored entry is the ONE admitted reason that describes a
                # role the kit is carrying, so it is the one that gets the
                # other label.
                "kind": (
                    ROLE_GAP_KIND_AUTHORED
                    if reason == ROLE_REASON_AUTHORED_WITHOUT_EVIDENCE
                    else ROLE_GAP_KIND_MISSING
                ),
                "channel": channel,
                "role": hint,
                "reason": str(reason or "no_evidence"),
            }
            if isinstance(graded, dict):
                provenance = graded.get("provenance")
                confidence = graded.get("confidence")
                if isinstance(provenance, str):
                    entry_gap["provenance"] = provenance
                if isinstance(confidence, (int, float)) and not isinstance(confidence, bool):
                    entry_gap["confidence"] = float(confidence)
            gaps.append(entry_gap)
    return gaps


def product_card_variant_index_gaps(technical_dir: Path) -> list[dict[str, Any]]:
    """Report a carded page that ships no resolvable product-card variant index.

    NOT A BLOCKER, and it must never become one. A variant index is styling:
    the Brand Kit is complete and correct without it, and never-fail says a
    styling gap cannot stop a kit. What the gap buys is that the run SAYS the
    index is absent, in the report the onboarding skill already reads, one run
    before ``build_product_card_bundle.py --variant auto`` raises
    ``WorkflowError`` and costs an operator a turn guessing which variant the
    site looked like. Same shape as an unsuppliable region role: reported,
    never fatal, and kept out of ``blockers``.

    READ FROM THE DIAGNOSTIC, NOT RE-DERIVED FROM THE KIT. The producer
    already decided this -- ``productCardVariantDecisionDiagnostics`` walks the
    same rows and stamps ``code: "variant_index_absent"`` -- and a second
    derivation here could only ever drift from it. The entry is selected by
    that ``code``; a prose match on the message would break the next time the
    producer rewords its repair text, and would break silently.
    """
    diagnostics = _read_optional_json(technical_dir / "assembly-diagnostics.json")
    if not isinstance(diagnostics, dict):
        return []
    entries = diagnostics.get("productCardVariantDecision")
    if not isinstance(entries, list):
        return []
    for entry in entries:
        if not isinstance(entry, dict) or entry.get("code") != VARIANT_INDEX_ABSENT_CODE:
            continue
        raw_count = entry.get("cardCount")
        card_count = (
            raw_count
            if isinstance(raw_count, int) and not isinstance(raw_count, bool) and raw_count > 0
            else None
        )
        cards_phrase = (
            f"product cards present ({card_count})"
            if card_count is not None
            else "product cards present"
        )
        # ONE ENTRY PER RUN. The diagnostic is scoped to productCard[0], so a
        # second entry with this code would be a producer bug, not a second
        # gap, and reporting it twice would only make the report louder about
        # one fact.
        return [
            {
                "kind": VARIANT_INDEX_GAP_KIND,
                "channel": VARIANT_INDEX_GAP_CHANNEL,
                "role": VARIANT_INDEX_GAP_ROLE,
                "reason": VARIANT_INDEX_GAP_REASON,
                "cards": card_count,
                # A fact about the kit and its consequence, not an instruction:
                # the axes that made the tree abstain stay in
                # `assembly-diagnostics.json`, which is where a reader who wants
                # to know WHY should look. Repeating them here would grow the
                # report for a consumer that cannot act on them.
                "detail": (
                    f"{cards_phrase}; no variant index; downstream "
                    "`--variant auto` will require an operator value."
                ),
            }
        ]
    return []


def role_coverage_gap_warnings(technical_dir: Path) -> list[str]:
    """Surface an unresolved role-coverage gap as a content warning.

    The JS ``--mode normalize`` hard-gates on ``typographyRoleCoverage`` /
    ``textColorRoleCoverage`` severity ``high`` (a required role the deterministic
    synthesis should have covered but didn't — e.g. an icon-only-CTA site with no
    CTA-typography text to derive from). When the agent can't close the gap it may
    hand off an artifact whose last normalize failed that gate; the runtime only
    schema-validates (not role-coverage), so the gap would otherwise ship
    silently. A ``severity: high`` entry survives in ``assembly-diagnostics.json``
    only when the last normalize threw on it (a clean pass would have thrown too,
    leaving no artifact), so emitting these keeps the gap visible without failing
    an otherwise-usable brandkit — downstream falls back on missing roles.

    FOUR conditions reach this function and they do not describe the same
    thing, so it branches on ``reason`` rather than printing one sentence for
    all of them. ``role_not_produced`` and the legacy ``reason``-less form are
    the missing-role shapes.
    ``authored_without_evidence`` and ``value_not_measured`` both mean the role
    IS on a row and the value there was authored — the exact inverse of "a
    required role is missing; downstream falls back", which told the reader the
    kit was short a value when it is in fact carrying an invented one. The
    spellings are named in :data:`ROLE_REASON_AUTHORED_WITHOUT_EVIDENCE` /
    :data:`ROLE_REASON_VALUE_NOT_MEASURED` and mirror ``role-evidence.js``.

    Still advisory, all three. The blocking decision for the two provenance
    reasons is made by the JS re-check wired into ``validate-skill-output.js``,
    which judges the artifact on disk rather than what a past normalize
    recorded; this function only has to describe what it reads truthfully.
    """
    diagnostics = _read_optional_json(technical_dir / "assembly-diagnostics.json")
    if not isinstance(diagnostics, dict):
        return []
    artifact = _read_optional_json(technical_dir / "brandkit.extraction.json")
    role_provenance = (
        artifact.get("roleProvenance") if isinstance(artifact, dict) else None
    )
    if not isinstance(role_provenance, dict):
        role_provenance = {}
    warnings: list[str] = []
    warned_provenance_roles: set[str] = set()
    for key in ("typographyRoleCoverage", "textColorRoleCoverage"):
        entries = diagnostics.get(key)
        if not isinstance(entries, list):
            continue
        for entry in entries:
            if not isinstance(entry, dict):
                continue
            severity = entry.get("severity")
            reason = entry.get("reason")
            # THE TRAP THIS FUNCTION WALKED INTO. Its filter was
            # `severity != "high" -> continue`, which was the whole population
            # while every one of these conditions was fatal. Demoting them to
            # `"gap"` would have stopped every sentence below being emitted --
            # the change would have made the run report LESS, which is the exact
            # inverse of its purpose.
            #
            # Widened NARROWLY, by reason and not by severity. A plain
            # `severity in ("high", "gap")` would start emitting for honest
            # `no_evidence` gaps too: a large share of captures, none of them
            # something the agent can act on, and an ordered warning list that
            # existing tests pin.
            if severity != "high" and not (
                severity == "gap" and reason in UNRESOLVED_ROLE_REASONS
            ):
                continue
            hint = entry.get("hint")
            hint_text = f" ({hint})" if isinstance(hint, str) and hint else ""
            grade = role_provenance.get(hint) if isinstance(hint, str) else None
            provenance = grade.get("provenance") if isinstance(grade, dict) else None
            confidence = grade.get("confidence") if isinstance(grade, dict) else None
            if provenance == "agent-recovered":
                continue
            if provenance in {"screenshot-sampled", "defaulted"}:
                if hint in warned_provenance_roles:
                    continue
                warned_provenance_roles.add(hint)
                detail = (
                    "The exact agent-selected DOM locator was re-probed first and failed; "
                    "the published colour was then sampled from the screenshot bound to this run."
                    if provenance == "screenshot-sampled"
                    else "No exact deterministic or agent-selected DOM measurement supports every "
                    "published carrier of this role; the value remains usable but should be treated "
                    "as overridable."
                )
                warnings.append(
                    f"Styling role provenance is uncertain ({hint}): {provenance} at confidence "
                    f"{confidence}. {detail}"
                )
                continue
            if reason == ROLE_REASON_AUTHORED_WITHOUT_EVIDENCE:
                warnings.append(
                    "Role-coverage value authored without evidence at extraction "
                    f"handoff: {key}{hint_text} — the role is present on a row, but "
                    "the capture holds no element any deterministic producer could "
                    "have derived it from, so the value on that row was authored. "
                    "The honest outcome for this role is a gap."
                )
            elif reason == ROLE_REASON_VALUE_NOT_MEASURED:
                warnings.append(
                    "Role-coverage value not measured at extraction handoff: "
                    f"{key}{hint_text} — the role is derivable from this capture, "
                    "but the value on at least one row carrying it is not one the "
                    "capture measured."
                )
            else:
                warnings.append(
                    "Role-coverage gap left unresolved at extraction handoff: "
                    f"{key}{hint_text} — a required role is missing; downstream falls "
                    "back where the schema permits."
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


def _canonical_factual_url(value: Any) -> str:
    if not isinstance(value, str) or not value.strip():
        return ""
    try:
        parsed = urlparse(value.strip())
        if parsed.scheme.lower() not in {"http", "https"} or not parsed.hostname:
            return ""
        port = parsed.port
    except ValueError:
        return ""
    host = _normalize_host(value)
    default_port = (parsed.scheme.lower() == "http" and port == 80) or (
        parsed.scheme.lower() == "https" and port == 443
    )
    authority = host if port is None or default_port else f"{host}:{port}"
    path = parsed.path.rstrip("/") or "/"
    query = f"?{parsed.query}" if parsed.query else ""
    return f"{parsed.scheme.lower()}://{authority}{path}{query}"


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
    # Keep the same explicit policy as the JavaScript validator on every runtime.
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


def _is_producer_logo_candidate(row: Any) -> bool:
    return (
        isinstance(row, dict)
        and isinstance(row.get("src"), str)
        and isinstance(row.get("tag"), str)
        and isinstance(row.get("alt"), str)
        and _is_finite_json_number(row.get("widthPx"))
        and _is_finite_json_number(row.get("heightPx"))
        and isinstance(row.get("selector"), str)
        and isinstance(row.get("inLogoContext"), bool)
        and isinstance(row.get("region"), str)
        and isinstance(row.get("homeLink"), bool)
        and isinstance(row.get("opacityHidden"), bool)
        and _is_finite_json_number(row.get("topPx"))
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


# Magic-byte prefixes, keyed by the extension the finalizer names the upload
# with. THE CONTENT-TYPE IS NOT EVIDENCE: these bytes reached disk from an
# extensionless CDN path or a `.webp`/`.avif` URL precisely because the URL said
# nothing, and a CDN routinely answers `application/octet-stream` — or an HTML
# error page under `image/webp`. Pillow decodes them a few lines later, so a
# body that is not an image must be refused here rather than becoming a
# `convert-failed` after an upload session already exists.
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


# The `kind` a manifest row must carry to be read as an SVG capture. Rows
# written before the field existed carry nothing, and saying nothing is not a
# claim to be a different kind - but an explicit `kind: "raster"` must never be
# fed to the SVG validators, whose first act is to decode the bytes as UTF-8.
def _logo_asset_entry_kind_is_svg(row: dict[str, Any]) -> bool:
    kind = row.get("kind")
    return kind is None or kind == "svg"


# The suppression pair a row must carry for the caller's purpose.
#
# `over_cap=True` selects the ONE suppression that leaves hostable bytes behind:
# a safe mark whose reduced markup is longer than the cap on a PUBLISHED
# `svgPath`. `"unsafe"` never selects, and a row that predates the reason field
# never selects either - an unlabelled suppression cannot be told apart from an
# unsafe one, and guessing in the permissive direction is the one guess this
# gate must not make.
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
        and row.get("source") in {"page-response", "browser-navigation"}
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
        # Tier 1 admits SVG only (`logoBodyKeepRule`), so a raster body can
        # only ever have arrived through a Tier-2 navigation.
        and row.get("source") == "browser-navigation"
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
        and isinstance(row.get("selector"), str)
        and isinstance(row.get("label"), str)
        and row.get("background") in {"light", "dark", "unknown"}
        and isinstance(row.get("placement"), bool)
        and isinstance(row.get("textSignal"), bool)
        and _is_finite_json_number(row.get("widthPx"))
        and _is_finite_json_number(row.get("heightPx"))
        and _is_finite_json_number(row.get("score"))
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
        if not candidate.is_absolute():
            candidate = technical_dir / candidate
        candidate_stat = candidate.lstat()
        if stat.S_ISLNK(candidate_stat.st_mode) or not stat.S_ISREG(
            candidate_stat.st_mode
        ):
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

    def to_json_payload(self, *, final_brandkit: Any | None = None) -> dict[str, Any]:
        """Return the non-byte evidence packet passed to the JS validator."""

        payload: dict[str, Any] = {
            "authorizedUrls": sorted(self.authorized_urls),
            "authorizedSvgBindings": [
                [url, digest] for url, digest in sorted(self.authorized_svg_bindings)
            ],
            "authorizedInlineSvgHashes": sorted(self.authorized_inline_svg_hashes),
        }
        if final_brandkit is not None:
            payload["logoUrlSafety"] = [
                [url, verdict]
                for url, verdict in _logo_url_safety_verdicts(final_brandkit)
            ]
        return payload


def _asset_url_safety_verdict(value: str) -> str:
    return SAFE_ASSET_URL_VERDICT if _exact_public_asset_url(value) else UNSAFE_ASSET_URL_VERDICT


def _logo_url_safety_verdicts(brandkit: Any) -> tuple[tuple[str, str], ...]:
    """Classify every exact, non-blank final logo URL in first-seen order."""

    brand = brandkit.get("brand") if isinstance(brandkit, dict) else None
    logos = brand.get("logos") if isinstance(brand, dict) else None
    verdicts: dict[str, str] = {}
    for logo in logos if isinstance(logos, list) else []:
        if not isinstance(logo, dict):
            continue
        url = logo.get("url")
        if not isinstance(url, str) or not url.strip() or url in verdicts:
            continue
        verdicts[url] = _asset_url_safety_verdict(url)
    return tuple(verdicts.items())


def _logo_asset_evidence_from_payloads(
    capture: Any,
    page_signals: Any,
    logo_assets: Any,
    *,
    technical_dir: Path,
) -> LogoAssetEvidence:
    authorized_urls: set[str] = set()
    observed = capture.get("observedAssetUrls") if isinstance(capture, dict) else None
    for value in observed if isinstance(observed, list) else []:
        exact = _exact_public_asset_url(value)
        if exact:
            authorized_urls.add(exact)

    candidates = page_signals.get("logoCandidates") if isinstance(page_signals, dict) else None
    for row in candidates if isinstance(candidates, list) else []:
        if not _is_producer_logo_candidate(row):
            continue
        exact = _exact_public_asset_url(row.get("src"))
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
    """Load logo authorization evidence without granting malformed rows power."""

    return _logo_asset_evidence_from_payloads(
        _read_gate_json(technical_dir / "capture.json"),
        _read_gate_json(technical_dir / "page-signals.json"),
        _read_gate_json(technical_dir / "logo-assets.json"),
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


def _canonical_social_evidence_url(platform: str, value: Any) -> str:
    """Canonicalize a social URL without known non-identity tracking keys."""
    canonical = _canonical_factual_url(value)
    if not canonical or "?" not in canonical:
        return canonical

    base, raw_query = canonical.split("?", 1)
    platform_keys = _SOCIAL_TRACKING_QUERY_KEYS.get(platform, frozenset())

    def is_tracking(component: str) -> bool:
        key = component.split("=", 1)[0].lower()
        return (
            key in platform_keys
            or key in _GENERIC_SOCIAL_TRACKING_QUERY_KEYS
            or key.startswith("utm_")
        )

    substantive = [
        component for component in raw_query.split("&") if not is_tracking(component)
    ]
    return f"{base}?{'&'.join(substantive)}" if substantive else base


def _contact_evidence_values(rows: Any, channel: str) -> set[str]:
    if not isinstance(rows, list):
        return set()

    values: set[str] = set()
    for row in rows:
        if channel == "addresses":
            candidates = (
                [row]
                if isinstance(row, str)
                else [
                    row[key]
                    for key in ("address", "text", "value")
                    if isinstance(row, dict) and isinstance(row.get(key), str)
                ]
            )
            for candidate in candidates:
                text = _normalized_contact_text(candidate)
                if text:
                    values.add(text)
            continue

        if isinstance(row, str):
            trusted_candidates: list[str] = []
            literal_candidates = [row]
        elif isinstance(row, dict):
            typed_key = "email" if channel == "emails" else "phone"
            trusted_candidates = [
                row[key]
                for key in (typed_key, "url")
                if isinstance(row.get(key), str)
            ]
            literal_candidates = [
                row[key]
                for key in ("text", "value")
                if isinstance(row.get(key), str)
            ]
        else:
            continue

        for candidate in trusted_candidates:
            canonical = _canonical_contact(candidate, channel)
            if canonical:
                values.add(canonical)
        for candidate in literal_candidates:
            if not _contact_value_is_strict_fact(candidate, channel):
                continue
            canonical = _canonical_contact(candidate, channel)
            if canonical:
                values.add(canonical)
    return values


# The contact helpers below normalize on the ECMAScript whitespace set, NOT on
# Python's. `str.split()` / `str.strip()` and `re`'s `\s` take U+001C-U+001F and
# U+0085 as whitespace where JavaScript does not, and miss U+FEFF where it does.
# The JS twin (`content-validators.js` `canonicalContact` / `normalizedContactText`
# / `contactValueIsStrictFact`) splits on `/\s+/u` and trims with `String.trim`,
# and it RE-DECIDES the staged brandkit -- so a value Python canonicalizes one way
# and JavaScript another is kept here and refused there, which is exit 4 with
# nothing persisted. `"+1\x85555 000 0000"` against page-signals
# `"+1 555 000 0000"` did exactly that.
#
# `_JS_TRIM_CHARS` / `_JS_WHITESPACE_RUN_RE` are the sets the socials and
# important-links mirrors already use for the same reason; nothing new is
# invented here.
_JS_WHITESPACE_CLASS = re.escape(_JS_TRIM_CHARS)
# `[^\s<>@]` in the JS twin's mailbox pattern is JS `\s`, so this class has to
# be the JS one too: a U+0085 after an address is INSIDE the JS match and
# outside a Python `\s` one, which is a different canonical email.
_CONTACT_MAILBOX_RE = re.compile(
    f"[^{_JS_WHITESPACE_CLASS}<>@]+@[^{_JS_WHITESPACE_CLASS}<>@]+"
)
_CONTACT_PHONE_FACT_RE = re.compile(rf"(?:tel:)?[+()\-.{_JS_WHITESPACE_CLASS}\d]+")


def _js_normalized_contact_whitespace(value: str) -> str:
    r"""Mirror of JS `value.split(/\s+/u).filter(Boolean).join(" ").trim()`."""

    return _JS_WHITESPACE_RUN_RE.sub(" ", value).strip(_JS_TRIM_CHARS)


def _normalized_contact_text(value: Any) -> str:
    return (
        _js_normalized_contact_whitespace(value).lower()
        if isinstance(value, str)
        else ""
    )


def _canonical_tel_digits(value: str) -> str:
    """Return only the RFC 3966 subscriber digits, never URI parameters."""
    raw_subscriber = re.split(r"[;?]", value[4:], maxsplit=1)[0]
    # Match the producer's fail-closed tel parsing. Raw percent-escape digits
    # cannot safely be distinguished from subscriber digits after a decode
    # failure, so malformed targets authorize no phone fact.
    if re.search(r"%(?![0-9a-fA-F]{2})", raw_subscriber):
        return ""
    try:
        raw_subscriber = unquote(raw_subscriber, errors="strict")
    except UnicodeDecodeError:
        return ""
    if "%" in raw_subscriber:
        return ""
    subscriber = re.split(r"[;?]", raw_subscriber, maxsplit=1)[0].strip()
    return "".join(character for character in subscriber if "0" <= character <= "9")


def _canonical_contact(value: Any, channel: str) -> str:
    if not isinstance(value, str):
        return ""
    text = _js_normalized_contact_whitespace(value)
    if not text:
        return ""
    if channel == "emails":
        if text.lower().startswith("mailto:"):
            text = unquote(text[7:].split("?", 1)[0])
        match = _CONTACT_MAILBOX_RE.search(text)
        return match.group(0).lower() if match else ""
    if channel == "phones":
        if text.lower().startswith("tel:"):
            return _canonical_tel_digits(text)
        return "".join(character for character in text if character.isdecimal())
    return text.lower()


def _contact_value_is_strict_fact(value: Any, channel: str) -> bool:
    """Return whether a free-form value is itself a fact rather than prose."""
    if not isinstance(value, str):
        return False
    canonical = _canonical_contact(value, channel)
    trimmed_lower = value.strip(_JS_TRIM_CHARS).lower()
    if channel == "emails":
        return bool(canonical and trimmed_lower in {canonical, f"mailto:{canonical}"})
    if channel == "phones":
        return bool(canonical and _CONTACT_PHONE_FACT_RE.fullmatch(trimmed_lower))
    return bool(_normalized_contact_text(value))


def _contact_value_is_evidenced(value: Any, channel: str, evidence: set[str]) -> bool:
    """THE contact accept rule. ONE definition, both callers.

    `reconcile_contacts` decides what survives and
    `detect_brandkit_content_blockers` decides what refuses the run, over the
    same evidence. While the rule was written out twice, dropping the
    strict-fact term from the reconcile copy alone was invisible to every
    contact test and turned `contacts.phones: ["Call 0 800 000 000"]` -- prose
    whose digits an evidence row happens to carry -- into a kept value here and
    an `INVENTED_CONTACT_BLOCKER` exit 4 at the gate. Shape checks alone were
    not enough to make "cannot drift" true.
    """

    if channel == "addresses":
        return _normalized_contact_text(value) in evidence
    return (
        _contact_value_is_strict_fact(value, channel)
        and _canonical_contact(value, channel) in evidence
    )


def _gate_object(technical_dir: Path, filename: str) -> dict[str, Any] | None:
    """Read a current-run gate artifact, failing loudly on a wrong shape."""

    path = technical_dir / filename
    value = _read_gate_json(path)
    if value is not None and not isinstance(value, dict):
        raise TechnicalArtifactUnreadableError(
            f"Blocker gate requires technical artifact {path} to be a JSON object. "
            "A wrong-shaped current-run artifact cannot be treated as absent evidence."
        )
    return value


def _wrong_gate_shape(technical_dir: Path, filename: str, field: str) -> None:
    path = technical_dir / filename
    raise TechnicalArtifactUnreadableError(
        f"Blocker gate requires {path}:{field} to have its producer-defined JSON shape. "
        "A wrong-shaped current-run evidence field cannot be treated as absent evidence."
    )


def _check_page_signals_contact_shape(page_signals: Any, technical_dir: Path) -> None:
    """The gate's `page-signals.json` contact shape checks, shared with reconcile.

    `reconcile_contacts` decides which contacts survive using the SAME evidence
    the blocker gate reads. If one side tolerated a shape the other refused, a
    value could be stripped on evidence the gate calls corrupt, or kept on
    evidence the gate refuses to read. One function, both callers, no drift.
    """

    if not isinstance(page_signals, dict):
        return
    if "contacts" in page_signals and not isinstance(page_signals["contacts"], dict):
        _wrong_gate_shape(technical_dir, "page-signals.json", "contacts")
    for channel in ("emails", "phones", "addresses"):
        if (
            isinstance(page_signals.get("contacts"), dict)
            and channel in page_signals["contacts"]
            and not isinstance(page_signals["contacts"][channel], list)
        ):
            _wrong_gate_shape(
                technical_dir, "page-signals.json", f"contacts.{channel}"
            )


#: Character categories that render as nothing in a report a human reads:
#: C0/C1 controls, format characters (bidi overrides, ZWJ, U+FEFF), and the
#: line/paragraph separators.
_INVISIBLE_UNICODE_CATEGORIES = frozenset({"Cc", "Cf", "Zl", "Zp"})


def _displayable_contact_value(value: Any) -> str:
    """Spell invisible characters so a removed value can be read and retyped.

    The strip warning is the reader's ONLY notice, and it embeds the value. A
    number carrying U+0085 or a bidi override is removed precisely BECAUSE of
    the character the report would otherwise not show, leaving a warning that
    names a value the reader is sure is already correct.
    """

    text = value if isinstance(value, str) else str(value)
    return "".join(
        character
        if unicodedata.category(character) not in _INVISIBLE_UNICODE_CATEGORIES
        else (
            f"\\u{ord(character):04x}"
            if ord(character) <= 0xFFFF
            else f"\\U{ord(character):08x}"
        )
        for character in text
    )


def reconcile_contacts(brandkit: dict[str, Any], technical_dir: Path) -> list[str]:
    """Strip contacts this run cannot evidence, instead of refusing the run.

    `INVENTED_CONTACT_BLOCKER` stays in place as the backstop, but it must not
    be the OUTCOME: one unprovable phone number used to exit 4 and persist
    nothing, discarding a complete brandkit over a single field the reader can
    retype in seconds.

    `page-signals.json` is the ONLY contact evidence, and the accept rule is
    not merely equal to the gate's but the SAME function
    (`_contact_value_is_evidenced`), read through the same shape check
    (`_check_page_signals_contact_shape`), so neither the evidence nor the rule
    can drift. Reading the captured page text here instead was tried
    and dropped: the finalizer has no DOM context, so every text rule is a
    guess at what the page meant, and a fabricated phone number in a customer's
    email is worse than a reported gap. The right place to widen contact
    coverage is the PRODUCER that writes `page-signals.json`.

    The blocker still fires for every caller that does NOT run this reconcile:
    `detect_brandkit_content_blockers` / `detectBrandkitContentBlockers` invoked
    directly -- including `validate-skill-output.js` run standalone by
    `tools/brandkit-draft-coverage-sweep/finalize-verdict-sweep.mjs` over raw
    technical artifacts -- and the Python fallback inside
    `__main__._collect_validator_findings`.
    """

    warnings: list[str] = []
    contacts = brandkit.get("contacts") if isinstance(brandkit, dict) else None
    if not isinstance(contacts, dict):
        return warnings

    page_signals = _gate_object(technical_dir, "page-signals.json")
    _check_page_signals_contact_shape(page_signals, technical_dir)
    evidence_container = (
        page_signals.get("contacts") if isinstance(page_signals, dict) else None
    )

    for channel in ("emails", "phones", "addresses"):
        values = contacts.get(channel)
        if not isinstance(values, list):
            continue
        evidence_rows = (
            evidence_container.get(channel)
            if isinstance(evidence_container, dict)
            else None
        )
        evidence = _contact_evidence_values(evidence_rows, channel)
        kept: list[Any] = []
        for value in values:
            if _contact_value_is_evidenced(value, channel, evidence):
                kept.append(value)
                continue
            warnings.append(
                f"Removed contacts.{channel} value "
                f"{_displayable_contact_value(value)}: absent from this run's "
                "page-signals evidence — add it by hand if the site shows it."
            )
        contacts[channel] = kept
    return warnings


def reconcile_socials(brandkit: dict[str, Any]) -> list[str]:
    """Empty every social URL the Brand Kit write would refuse, naming each in a
    warning, so one unstorable value never refuses the composed document.

    The rule is the endpoint's own acceptance and nothing else. reteno-mcp's
    ``Socials`` model runs ``_normalize_optional_url`` over each of its twenty
    declared fields under strict semantics: an http(s) URL is stored whatever
    its host, anything else raises and the WHOLE document is refused.
    ``_brandkit_write_takes_url`` is the verbatim port of that predicate, so a
    value emptied here is exactly a value the account could not have held.

    There is deliberately no domain rule here: the endpoint has none. A store
    link on the brand's own short domain, a lookalike host, a link filed under
    the wrong platform -- all real, page-evidenced and storable -- flow through
    and are NAMED by `validate_brandkit_content`'s shape warning (both twins)
    for the reader to judge. The domain arm this replaces refused a whole kit
    (exit 4, nothing persisted) over two app-store links the page genuinely
    showed; a list of platform hosts can only ever describe the platforms it
    already knows, and the next branded short domain is not on it.

    Same predicate and the same sentence as the write-refusal gate that runs on
    the RAW extraction artifact (`normalize_extraction_stage_payload` ->
    `_drop_unwritable_socials`, reported by `write_refusal_gate_warnings`), so
    the two cannot drift. On the CLI path the composed kit has already been
    through that gate and this pass finds nothing -- it is the guarantee for
    the document that is actually written, wherever it was composed, and it is
    idempotent, so a caller wiring it after compose pays nothing on a run the
    gate already cleaned. Mirrors `reconcile_contacts` in posture: strip and
    say so, never refuse.
    """
    socials = brandkit.get("socials") if isinstance(brandkit, dict) else None
    if not isinstance(socials, dict):
        return []
    warnings = write_refusal_gate_warnings({"socials": socials})
    _drop_unwritable_socials(socials)
    return warnings


def detect_brandkit_content_blockers(
    brandkit: dict[str, Any],
    technical_dir: Path,
    *,
    target_url: str,
    runtime_asset_bindings: set[tuple[str, str]] | None = None,
    logo_evidence: LogoAssetEvidence | None = None,
) -> list[str]:
    """Block unsafe or invented factual fields using this run's evidence.

    Every non-empty factual value needs positive evidence from this run.
    Missing evidence therefore authorizes no contacts, social URLs, or logo
    asset URLs; present but malformed evidence fails closed as corruption.
    """
    blockers: list[str] = []
    website = brandkit.get("brand", {}).get("organization", {}).get("website", "")
    if isinstance(website, str) and website.strip():
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

    def gate_object(filename: str) -> dict[str, Any] | None:
        return _gate_object(technical_dir, filename)

    page_signals = gate_object("page-signals.json")
    capture = gate_object("capture.json")
    logo_assets = gate_object("logo-assets.json")

    def wrong_shape(filename: str, field: str) -> None:
        _wrong_gate_shape(technical_dir, filename, field)

    if isinstance(page_signals, dict):
        _check_page_signals_contact_shape(page_signals, technical_dir)
        if "socials" in page_signals and not isinstance(page_signals["socials"], list):
            wrong_shape("page-signals.json", "socials")
        if "socialsForBrandkit" in page_signals and not isinstance(
            page_signals["socialsForBrandkit"], dict
        ):
            wrong_shape("page-signals.json", "socialsForBrandkit")
        if "logoCandidates" in page_signals and not isinstance(
            page_signals["logoCandidates"], list
        ):
            wrong_shape("page-signals.json", "logoCandidates")
    if isinstance(capture, dict) and "observedAssetUrls" in capture and not isinstance(
        capture["observedAssetUrls"], list
    ):
        wrong_shape("capture.json", "observedAssetUrls")
    if isinstance(logo_assets, dict) and "entries" in logo_assets and not isinstance(
        logo_assets["entries"], list
    ):
        wrong_shape("logo-assets.json", "entries")
    contacts = page_signals.get("contacts") if isinstance(page_signals, dict) else None
    final_contacts = brandkit.get("contacts") if isinstance(brandkit, dict) else None
    for channel in ("emails", "phones", "addresses"):
        evidence_rows = contacts.get(channel) if isinstance(contacts, dict) else None
        evidence = _contact_evidence_values(evidence_rows, channel)
        final_values = final_contacts.get(channel) if isinstance(final_contacts, dict) else None
        for value in final_values if isinstance(final_values, list) else []:
            if not _contact_value_is_evidenced(value, channel, evidence):
                blockers.append(
                    f"{INVENTED_CONTACT_BLOCKER}: contacts.{channel} contains {value}."
                )

    social_evidence = (
        page_signals.get("socialsForBrandkit") if isinstance(page_signals, dict) else None
    )
    raw_social_evidence = (
        page_signals.get("socials") if isinstance(page_signals, dict) else None
    )
    social_urls_by_platform: dict[str, set[str]] = {
        platform: set() for platform in SOCIAL_PLATFORM_KEYS
    }
    if isinstance(social_evidence, dict):
        for platform, value in social_evidence.items():
            if platform not in social_urls_by_platform:
                continue
            canonical = _canonical_social_evidence_url(platform, value)
            if canonical:
                social_urls_by_platform[platform].add(canonical)
    if isinstance(raw_social_evidence, list):
        for row in raw_social_evidence:
            if not isinstance(row, dict):
                continue
            platform = row.get("platform")
            value = row.get("url")
            if platform not in social_urls_by_platform:
                continue
            canonical = _canonical_social_evidence_url(platform, value)
            if canonical:
                social_urls_by_platform[platform].add(canonical)
    # A social URL whose host is neither the platform's nor the brand's own is
    # NOT a blocker. The Brand Kit write stores any http(s) URL whatever its
    # host, so once the evidence gate below has established the value is real,
    # a host that merely is not the platform's is a shape finding on a real
    # value -- a warning (`validate_brandkit_content`, both twins), like every
    # other shape mismatch. Refusing the run over one persisted a whole kit's
    # worth of nothing: exit 4 on two app-store links hosted on the brand's
    # own short domain.
    final_socials = brandkit.get("socials") if isinstance(brandkit, dict) else None
    if isinstance(final_socials, dict):
        for platform, value in final_socials.items():
            if not isinstance(value, str) or not value.strip():
                continue
            canonical_value = _canonical_social_evidence_url(platform, value)
            expected_values = social_urls_by_platform.get(platform, set())
            if not canonical_value or canonical_value not in expected_values:
                blockers.append(
                    f"{INVENTED_SOCIAL_BLOCKER}: socials.{platform} contains {value}."
                )

    if logo_evidence is None:
        logo_evidence = _logo_asset_evidence_from_payloads(
            capture,
            page_signals,
            logo_assets,
            technical_dir=technical_dir,
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
        if isinstance(url, str) and url.strip():
            safe_url = _exact_public_asset_url(url)
            runtime_bound = bool(
                safe_url
                and _runtime_bound_logo_url(url, svg_hash, exact_runtime_bindings)
            )
            if not safe_url:
                blockers.append(
                    f"{UNSAFE_ASSET_URL_BLOCKER}: brand.logos[{index}].url contains {url}."
                )
            elif url not in logo_evidence.authorized_urls and not runtime_bound:
                blockers.append(
                    f"{INVENTED_ASSET_URL_BLOCKER}: brand.logos[{index}].url contains {url}."
                )
        if isinstance(svg, str) and svg:
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
            if not (
                (
                    isinstance(url, str)
                    and (url, svg_hash) in logo_evidence.authorized_svg_bindings
                )
                or (url == "" and svg_hash in logo_evidence.authorized_inline_svg_hashes)
                or (isinstance(url, str) and (url, svg_hash) in exact_runtime_bindings)
            ):
                blockers.append(
                    f"{UNBOUND_SVG_BLOCKER}: brand.logos[{index}].svgPath has no exact "
                    "URL/SVG or inline-SVG evidence binding."
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

"""Brand Kit logo/contact reporting and read-only stored-profile comparison."""
from __future__ import annotations

import hashlib
import json
import math
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

REPORT_LINE_PREFIX = "REPORT_LINE: "
PERSIST_READBACK_FILENAME = "persist-readback.json"

LOGO_OUTCOME_TABLE: tuple[tuple[str, str | None], ...] = (
    (
        "empty",
        "No brand logo was found — provide a logo file or URL before "
        "customizing an email.",
    ),
    (
        "no `primary` entry (favicon and/or alternative entries only)",
        "No usable brand logo was found (no primary logo) — provide a logo "
        "file or URL before customizing an email.",
    ),
    (
        "the `primary` entry whose `url` is the hosted `.png` the finalizer "
        "minted this run",
        "The brand logo was converted to a hosted PNG for email use: <url>.",
    ),
    (
        "the `primary` entry, but none with a non-empty `url`",
        "The brand logo was captured as markup only, with no image URL — "
        "provide a logo file or URL before customizing an email.",
    ),
    (
        "the `primary` entry with a non-empty `.svg` `url`, finalizer hosting "
        "having failed or been skipped",
        "The brand logo is an SVG the run could not convert to a hosted PNG "
        "(<recorded reason>). No hosted PNG exists for this brand; an email "
        "built from this kit references the SVG directly. Conversion is still "
        "required and has not been verified.",
    ),
    (
        "the `primary` entry with a non-empty `url` that is neither `.svg` nor "
        "confirmed email-safe `.png` / `.jpg` / `.jpeg` / `.gif` (including "
        "WebP, AVIF, extensionless, or unknown formats), the finalizer's "
        "raster hosting having failed or been skipped",
        "The brand logo URL is not confirmed email-safe (WebP, AVIF, "
        "extensionless, or unknown format) — provide a PNG, JPG, JPEG, or GIF "
        "logo before customizing an email.",
    ),
    (
        "the `primary` entry whose `url` is the already-email-safe mark this "
        "run substituted after hosting failed (`logo_hosting.fallback_used`)",
        "The brand logo could not be converted to a hosted PNG (<recorded "
        "reason>), so this run stored an already-email-safe capture of the "
        "same mark instead: <url> — check it against the site before "
        "customizing an email.",
    ),
    ("the `primary` entry with a non-empty `url`", None),
)

EMAIL_SAFE_SUFFIXES: tuple[str, ...] = (".png", ".jpg", ".jpeg", ".gif")

# The row the CONSUMER reads. `yespo-custom-blocks`'s `static_module_builder`
# halts `no_brand_logo` unless `brand.logos` carries a `primary` / `logo` row
# with a non-empty url, and the finalizer's own hosting selects the first row
# whose `type` is `primary`. The local document's schema enum is
# `{primary, alternative, secondary, favicon}`, so `logo` is accepted here for
# parity with the consumer rather than because it occurs.
PRIMARY_LOGO_TYPES: frozenset[str] = frozenset({"primary", "logo"})

# --------------------------------------------------------------------------
# Contact outcome — SKILL.md §"Contact outcome — a contact the run could not
# evidence is named, not silently dropped".
# --------------------------------------------------------------------------

CONTACT_WARNING_PREFIX = "Removed contacts."
CONTACT_WARNING_SUFFIX = (
    ": absent from this run's page-signals evidence — add it by hand if the "
    "site shows it."
)
# The SKILL.md example spells the phones noun ("The phone number 0 800 000 000
# was removed: ..."); the other two channels follow the same sentence with the
# noun their channel names.
CONTACT_CHANNEL_NOUNS: dict[str, str] = {
    "emails": "email address",
    "phones": "phone number",
    "addresses": "address",
}
CONTACT_LINE_TEMPLATE = (
    "The {noun} {value} was removed: this run did not find it in the site's "
    "page evidence — add it by hand if it is correct."
)


def _url_path(url: str) -> str:
    """The path portion of ``url``, query/fragment removed, lowercased."""

    try:
        parts = urlsplit(url)
    except ValueError:
        return url.lower()
    path = parts.path if parts.scheme or parts.netloc else url.split("?")[0].split("#")[0]
    return path.lower()


def _is_email_safe(url: str) -> bool:
    return _url_path(url).endswith(EMAIL_SAFE_SUFFIXES)


def _is_svg(url: str) -> bool:
    return _url_path(url).endswith(".svg")


def _recorded_reason(logo_hosting: dict[str, Any]) -> str:
    """`<recorded reason>` for the kept-source-SVG row.

    SKILL.md names ``skipped-unattended`` (an outcome) and
    ``logo_rasterize_failed`` / ``logo_font_unresolved`` (error codes) as the
    same slot, so prefer the error code and fall back to the outcome, then
    append the recorded prose when there is any.
    """

    code = logo_hosting.get("error_code")
    outcome = logo_hosting.get("outcome")
    head = code if isinstance(code, str) and code else outcome
    head = head if isinstance(head, str) and head else "no reason recorded"
    reason = logo_hosting.get("reason")
    if isinstance(reason, str) and reason:
        return f"{head}: {reason}"
    return head


def _hosting_triplet(logo_hosting: dict[str, Any]) -> str:
    """`outcome` / `error_code` / `reason`, appended to the markup-only row."""

    def cell(key: str) -> str:
        value = logo_hosting.get(key)
        return value if isinstance(value, str) and value else "none"

    return f"{cell('outcome')} / {cell('error_code')} / {cell('reason')}"


def logo_report_line(
    logos: list[Any],
    logo_hosting: dict[str, Any] | None,
) -> str | None:
    """Render the Logo-outcome line for the FINAL ``brand.logos``, or None.

    Bound to the PRIMARY row, not to array order. Reading the first
    non-favicon row instead got three shapes wrong, all reproduced:
    ``[alternative.webp, primary hosted.png]`` reported "not confirmed
    email-safe" about a mark the run had just minted; ``[alternative
    other.png, primary.webp]`` claimed the finalizer minted an unrelated URL;
    and a kit with alternatives but NO primary -- which halts the consumer at
    `no_brand_logo` -- was described as an SVG the run could not convert
    rather than as a missing brand logo.
    """

    hosting = logo_hosting if isinstance(logo_hosting, dict) else {}
    rows = [row for row in logos if isinstance(row, dict)]

    if not rows:
        return LOGO_OUTCOME_TABLE[0][1]

    primary = next(
        (row for row in rows if row.get("type") in PRIMARY_LOGO_TYPES), None
    )
    if primary is None:
        return LOGO_OUTCOME_TABLE[1][1]

    raw_url = primary.get("url")
    url = raw_url.strip() if isinstance(raw_url, str) else ""

    if url and hosting.get("outcome") == "minted" and _url_path(url).endswith(".png"):
        template = LOGO_OUTCOME_TABLE[2][1]
        assert template is not None
        return template.replace("<url>", url)

    if not url:
        template = LOGO_OUTCOME_TABLE[3][1]
        assert template is not None
        return f"{template} ({_hosting_triplet(hosting)})"

    if _is_svg(url):
        template = LOGO_OUTCOME_TABLE[4][1]
        assert template is not None
        return template.replace("<recorded reason>", _recorded_reason(hosting))

    if not _is_email_safe(url):
        return LOGO_OUTCOME_TABLE[5][1]

    # The finalizer's own substitution. Without a row of its own it lands on
    # the catch-all and says NOTHING: the kit would carry a mark the run
    # chose, by measurement, over the one the extraction authored, and no
    # sentence anywhere would say so.
    fallback = hosting.get("fallback_used")
    if isinstance(fallback, str) and fallback:
        template = LOGO_OUTCOME_TABLE[6][1]
        assert template is not None
        return template.replace("<recorded reason>", _recorded_reason(hosting)).replace(
            "<url>", url
        )

    return LOGO_OUTCOME_TABLE[7][1]


def parse_removed_contacts(warnings: list[Any]) -> list[tuple[str, str]]:
    """Extract ``(channel, value)`` from every ``Removed contacts.`` warning."""

    removed: list[tuple[str, str]] = []
    for warning in warnings:
        if not isinstance(warning, str) or not warning.startswith(
            CONTACT_WARNING_PREFIX
        ):
            continue
        body = warning[len(CONTACT_WARNING_PREFIX) :]
        channel, separator, remainder = body.partition(" value ")
        if not separator:
            continue
        value = remainder
        if value.endswith(CONTACT_WARNING_SUFFIX):
            value = value[: -len(CONTACT_WARNING_SUFFIX)]
        else:
            # Unknown tail shape: keep everything up to the last ": absent"
            # marker rather than dropping the notice entirely.
            value = value.split(": absent from this run's")[0]
        removed.append((channel, value))
    return removed


def contact_report_lines(warnings: list[Any]) -> list[str]:
    """One Contact-outcome line per stripped contact value."""

    lines: list[str] = []
    for channel, value in parse_removed_contacts(warnings):
        noun = CONTACT_CHANNEL_NOUNS.get(channel, "contact")
        lines.append(CONTACT_LINE_TEMPLATE.format(noun=noun, value=value))
    return lines


# --------------------------------------------------------------------------
def _host(value: Any) -> str | None:
    """Host of ``value``, lowercased, ``www.``-stripped, scheme filled in.

    Mirrors SKILL.md's 5c rule: "only the two HOSTS are compared, case- and
    `www.`-insensitively and with a missing scheme filled in".
    """

    if not isinstance(value, str) or not value.strip():
        return None
    text = value.strip()
    if "//" not in text:
        text = f"https://{text}"
    try:
        host = urlsplit(text).hostname
    except ValueError:
        return None
    if not host:
        return None
    host = host.lower()
    return host[4:] if host.startswith("www.") else host


# The sections of a Brand Kit that witness a write, in the order
# `unconfirmed_reason` names them: seven the write path stores exactly as this
# run composed them, and three it normalises, compared through a projection
# (`persist_fingerprint`).
PERSIST_FINGERPRINT_SECTIONS: tuple[str, ...] = (
    "website",
    "name",
    "logos",
    "languages",
    "contacts",
    "socials",
    "importantLinks",
    "colours",
    "typography",
    "components",
)

# How a differing section is worded. website/name keep their own sentences
# because they can name the two values; the rest are set comparisons whose
# diff would be unreadable in one line.
PERSIST_SECTION_NOUNS: dict[str, str] = {
    "logos": "logos",
    "languages": "languages",
    "contacts": "contacts",
    "socials": "socials",
    "importantLinks": "important links",
    "colours": "colours",
    "typography": "typography",
    "components": "button components",
}


def _drop_empties(value: Any) -> Any:
    """Recursively remove ``None``, ``""``, ``[]`` and ``{}``; strip strings.

    ``0`` and ``False`` are KEPT — they are values a Brand Kit can legitimately
    carry, and dropping them would make two different documents compare equal.
    """

    # `0 == ""`, `False == ""`, `0 == []` and `0 == {}` are all False in
    # Python, so this test drops the four empties and keeps every falsy NUMBER.
    def empty(entry: Any) -> bool:
        return entry is None or entry == "" or entry == [] or entry == {}

    if isinstance(value, dict):
        out: dict[str, Any] = {}
        for key, entry in value.items():
            pruned = _drop_empties(entry)
            if empty(pruned):
                continue
            out[key] = pruned
        return out
    if isinstance(value, list):
        return [
            pruned for pruned in (_drop_empties(entry) for entry in value)
            if not empty(pruned)
        ]
    if isinstance(value, str):
        return value.strip()
    return value


def _rows(value: Any) -> list[dict[str, Any]]:
    """The dict rows of a list, or ``[]`` for anything that is not a list."""

    if not isinstance(value, list):
        return []
    return [row for row in value if isinstance(row, dict)]


def _lower_hex(value: Any) -> str | None:
    """A ``#…`` colour lower-cased, or ``None`` for anything that is not one.

    Case is the ONE transform the server applies to a stored hex (measured:
    ``#ff00c5`` -> ``#FF00C5``), so lower-casing both sides is what makes the
    projection immune to it.
    """

    if not isinstance(value, str):
        return None
    text = value.strip().lower()
    return text if text.startswith("#") and len(text) > 1 else None


def _number_or_none(value: Any) -> float | None:
    """A finite number as stored, or ``None``.

    Compared as the server stores it: the typography sizes and weights came
    back unchanged on every live pair (``sizePx 19.2`` -> ``19.2``). The one
    rounding the server was measured to apply (``padding 12.5`` -> ``12``) is
    on a button field this projection does not compare, so no rounding is
    applied here -- a tolerance for a transform the server does not perform
    would be a rule no test could honestly pin.
    """

    if isinstance(value, bool):
        return None
    if isinstance(value, str):
        try:
            value = float(value.strip())
        except ValueError:
            return None
    if not isinstance(value, (int, float)) or not math.isfinite(value):
        return None
    return float(value)


def persist_fingerprint(brandkit: Any) -> dict[str, Any]:
    """The sections of a Brand Kit that witness a write, projected past the
    server's own transforms.

    Measured on every real write/read-back pair available: organization,
    contacts, socials, importantLinks and languages are stored byte-for-byte;
    logo rows are re-typed (primary -> logo) and gain ``size``, so only their
    URLs are compared. Colours, typography and button components are
    NORMALISED by the server -- hex case (``#ff00c5`` -> ``#FF00C5``), a
    fractional button padding rounded (``12.5`` -> ``12``), ``size`` /
    ``fontFamily`` / ``fontWeight`` / ``dividerColors`` added, empties dropped
    -- so they are compared through a PROJECTION those transforms cannot flip:
    the set of lower-cased colour values, ``(family, weight, size)`` per
    typography row, ``(background, font colour)`` per button row.
    On the three live pairs available (two attended runs of 2026-09-05 and
    one of 2026-09-06) the projection compared EQUAL on all ten sections
    against the account read back after the write, and DIFFERED on colours
    and button components against the previous kit of the same site -- the
    pair the seven identity sections alone could not tell apart (16 of 24
    deterministic same-site pairs compared equal on them, so a failed write
    over a previous kit of the same site minted "persisted despite a failed
    call").

    Products stay out: large, and ``brand.products`` is the one section the
    write may clear.

    Never raises: every branch degrades to an empty section, because a witness
    that crashed would cost the run the persist line it exists to mint.
    """

    top = brandkit if isinstance(brandkit, dict) else {}
    brand = top.get("brand")
    brand = brand if isinstance(brand, dict) else {}
    org = brand.get("organization")
    org = org if isinstance(org, dict) else {}
    logos = _rows(brand.get("logos"))
    colors = brand.get("colors")
    colors = colors if isinstance(colors, dict) else {}
    components = brand.get("components")
    components = components if isinstance(components, dict) else {}
    return {
        "website": _host(org.get("website")),
        "name": _text(org.get("name")).strip(),
        "logos": sorted(
            {
                row["url"].strip()
                for row in logos
                if isinstance(row.get("url"), str) and row["url"].strip()
            }
        ),
        "languages": _drop_empties(top.get("languages")) or [],
        "contacts": _drop_empties(top.get("contacts")) or {},
        "socials": _drop_empties(top.get("socials")) or {},
        "importantLinks": _drop_empties(top.get("importantLinks")) or [],
        "colours": sorted(
            {
                _lower_hex(row.get("value"))
                for key in ("accentColors", "textColors", "backgroundColors")
                for row in _rows(colors.get(key))
                if _lower_hex(row.get("value"))
            }
        ),
        # `key=repr`: a row may carry no weight or size, and a tuple holding
        # `None` beside an int cannot be ordered -- the witness must not raise.
        "typography": sorted(
            {
                (
                    _text(row.get("family")).strip().lower(),
                    _number_or_none(row.get("weight")),
                    _number_or_none(row.get("sizePx")),
                )
                for row in _rows(brand.get("typography"))
                if _text(row.get("family")).strip()
            },
            key=repr,
        ),
        "components": sorted(
            {
                (_lower_hex(row.get("backgroundColor")), _lower_hex(row.get("fontColor")))
                for row in _rows(components.get("button"))
                if _lower_hex(row.get("backgroundColor"))
            },
            key=repr,
        ),
    }


def _text(value: Any) -> str:
    return value if isinstance(value, str) else ""


def comparable_promoted_kit(out_dir: Path) -> tuple[dict[str, Any] | None, str | None]:
    """Only this run's hash-bound promoted JSON may be compared with the account."""
    report = _load_json(out_dir / "finalize-report.json")
    if not isinstance(report, dict) or report.get("promoted") is not True:
        return None, NOT_PROMOTED_REASON
    expected = report.get("brandkit_sha256")
    if not isinstance(expected, str) or not expected:
        return None, "this run has no promoted-file hash"
    try:
        actual = hashlib.sha256((out_dir / "brandkit.json").read_bytes()).hexdigest()
    except OSError:
        return None, "this run's brandkit.json is unreadable"
    if actual != expected:
        return None, PAIR_MISMATCH_REASON
    kit = _load_json(out_dir / "brandkit.json")
    if not isinstance(kit, dict):
        return None, "this run's brandkit.json is unreadable"
    return kit, None


def stored_profile_state_line(promoted: dict[str, Any], readback: Any) -> str:
    """Report current compared fields; never attribute them to a save call."""
    if not isinstance(readback, dict) or readback.get("ok") is not True or not isinstance(readback.get("brandkit"), dict):
        return "Stored profile comparison unavailable (account read failed)."
    intended = persist_fingerprint(promoted)
    stored = persist_fingerprint(readback["brandkit"])
    different = [section for section in PERSIST_FINGERPRINT_SECTIONS if intended[section] != stored[section]]
    if different:
        names = [PERSIST_SECTION_NOUNS.get(section, section) for section in different]
        return "Stored profile differs from this run's promoted kit in the checked fields: " + ", ".join(names) + "."
    return "Stored profile matches this run's promoted kit in the 10 checked fields."


def _load_json(path: Path) -> Any:
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None


PAIR_MISMATCH_REASON = (
    "brandkit.json under --out-dir is not the one this run promoted"
)

# `promoted: false` (a blocked run) or no report at all means this run landed
# no brandkit.json, so any brandkit.json in the out-dir is an EARLIER run's —
# and comparing the account against it certified the previous run's kit as this
# one's ("persisted and verified" over a stale document; reproduced). The
# contract runs Phase 5 only on a promoted run, but agents have been observed
# hand-authoring Phase-5 documents when the prescribed path was unavailable, so
# the off-contract call gets an honest line rather than a gate.
NOT_PROMOTED_REASON = "this run promoted no brandkit.json"


def _load_promoted_pair(out_dir: Path) -> tuple[Any, Any]:
    """``(report, brandkit)``, with ``brandkit`` dropped when it is not the pair.

    ``finalize-report.json.brandkit_sha256`` is the sha256 of the promoted
    ``brandkit.json``'s bytes, set in the same step that promotes it, so the
    two files are a bound pair on every real run (9/9 measured out-dirs).
    When the sha disagrees the file under ``--out-dir`` belongs to some other
    run: describing ITS logo as this run's outcome is exactly the confusion
    the report lines exist to prevent, so it is treated as unreadable.

    A report with no sha (``promoted: false``, or an older report) is left
    alone: this is a report line, never a gate.
    """

    report = _load_json(out_dir / "finalize-report.json")
    brandkit = _load_json(out_dir / "brandkit.json")
    recorded = report.get("brandkit_sha256") if isinstance(report, dict) else None
    if not isinstance(recorded, str) or not recorded:
        return report, brandkit
    try:
        actual = hashlib.sha256(
            (out_dir / "brandkit.json").read_bytes()
        ).hexdigest()
    except OSError:
        return report, None
    return (report, brandkit) if actual == recorded else (report, None)


def _logos_of(brandkit: Any) -> list[Any]:
    if not isinstance(brandkit, dict):
        return []
    brand = brandkit.get("brand")
    if not isinstance(brand, dict):
        return []
    logos = brand.get("logos")
    return list(logos) if isinstance(logos, list) else []


def build_run_report_block(
    report: Any,
    brandkit: Any,
    *,
    exit_code: int,
) -> dict[str, Any]:
    """Project ``finalize-report.json`` into the one line ``run`` prints.

    Every field is read from the report this run just wrote, so the block can
    never disagree with the file. The hosted URL is deliberately NOT in the
    report (`logo_hosting.report_record` keeps it in process memory), so
    ``hosted_url_present`` reports whether hosting minted one this run.
    """

    report_obj = report if isinstance(report, dict) else {}
    warnings = report_obj.get("warnings")
    warnings = list(warnings) if isinstance(warnings, list) else []
    blockers = report_obj.get("blockers")
    blockers = list(blockers) if isinstance(blockers, list) else []
    gaps = report_obj.get("gaps")
    gaps = list(gaps) if isinstance(gaps, list) else []
    hosting = report_obj.get("logo_hosting")
    hosting = hosting if isinstance(hosting, dict) else {}
    promoted = report_obj.get("promoted") is True

    contacts_removed = [value for _channel, value in parse_removed_contacts(warnings)]
    contact_lines = contact_report_lines(warnings)
    # No logo line unless THIS run promoted a brandkit we could actually read:
    # an unreadable file must not be reported as "no brand logo was found".
    logo_line = (
        logo_report_line(_logos_of(brandkit), hosting)
        if promoted and isinstance(brandkit, dict)
        else None
    )

    return {
        "status": report_obj.get("status"),
        "promoted": promoted,
        "brandkit_sha256": report_obj.get("brandkit_sha256"),
        "exit_code": exit_code,
        "blockers": blockers,
        "warnings_count": len(warnings),
        "warnings": warnings[:10],
        "gaps_count": len(gaps),
        "logo_hosting": {
            "outcome": hosting.get("outcome"),
            "error_code": hosting.get("error_code"),
            "reason": hosting.get("reason"),
            "hosted_url_present": hosting.get("outcome") == "minted",
        },
        "contactsRemoved": contacts_removed,
        "reportLines": {"logo": logo_line, "contacts": contact_lines},
    }


def run_report_block_from_out_dir(out_dir: Path, *, exit_code: int) -> dict[str, Any]:
    """Build the ``run`` block from the pair the run just landed."""

    report, brandkit = _load_promoted_pair(out_dir)
    return build_run_report_block(report, brandkit, exit_code=exit_code)

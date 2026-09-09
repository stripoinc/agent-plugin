"""Mint the report lines the agent's final reply owes, from the run's own files.

Three families of line exist in `brandkit-extraction-v-0/SKILL.md`, each with a
markdown table the agent is told to read top-down:

* **Persist outcome** (8 rows) — what Phase 5's write + read-back did;
* **Logo outcome** (7 rows) — whether the FINAL ``brand.logos`` carries a mark
  an email can use;
* **Contact outcome** (1 sentence, one line per stripped value).

The tables below are those rows copied VERBATIM as data, so a reviewer can diff
them against the markdown cell by cell. WP-A5 moves the markdown to
``references/report-lines.md``; when it does, the fixtures in the test module
should be re-pointed at that file and the copies here checked against it rather
than against ``SKILL.md``.

4/9 measured runs skipped a mandatory report line, so these lines are minted by
the CLI and the contract only asks the agent to paste them.
"""

from __future__ import annotations

import hashlib
import json
import math
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable
from urllib.parse import urlsplit


REPORT_LINE_PREFIX = "REPORT_LINE: "

# The two Phase-5 documents move as FILES in the technical dir. The write
# document is written by the 5a/5b/5c cells and read by `report`; the read-back
# is written by `report` ITSELF, from its own `get_brandkit` call, so the agent
# never authors it (the attended run that did wrote a `brand` trimmed to
# organization + logos, and the witness was right by luck). Neither passes
# through a shell argument: the write document embeds the server's raw error
# text, and an apostrophe in it ("can't persist: upstream 502") ended the
# single-quoted argument the contract used to prescribe — exit 2, no REPORT_LINE
# at all — while a crafted error executed. Both reproduced. `prepare` clears
# both names, so a run can never read the PREVIOUS run's Phase-5 documents.
PERSIST_WRITE_FILENAME = "persist-write.json"
PERSIST_READBACK_FILENAME = "persist-readback.json"

# --------------------------------------------------------------------------
# Persist outcome — SKILL.md §"Persist outcome — always reported, never implied"
# --------------------------------------------------------------------------

# (what happened, the line) — the markdown table's two columns, verbatim, with
# the backticks that wrap the `the line` cell stripped. Order = table order.
PERSIST_OUTCOME_TABLE: tuple[tuple[str, str], ...] = (
    (
        "written, `cleared` empty, and confirmed by the 5d read",
        "persisted and verified",
    ),
    (
        "written and confirmed, and `cleared` names one or more sections, or "
        "parts of sections",
        "persisted, cleared from the account: <names>",
    ),
    (
        "written, but the 5d read could not confirm it",
        "persisted but unverified (<reason>)",
    ),
    (
        "the 5c call errored, but the 5d read shows the account holding this "
        "run's identity sections — website, name, logo URLs, languages, "
        "contacts, socials and important links; colours, typography and "
        "button components are compared through a projection that survives "
        "the server's own normalisation (hex case, rounding, added `size` and "
        "font fields)",
        "persisted despite a failed call (<the error, verbatim>)",
    ),
    (
        "approval denied / timed out",
        "not persisted (approval denied) / not persisted (approval timed out)",
    ),
    (
        "unattended run",
        "not persisted (unattended run — Reteno mutations are disabled)",
    ),
    (
        "the write was rejected",
        "not persisted (rejected: <field path>: <message>)",
    ),
    (
        "the call failed for any other reason, and the 5d read does not show "
        "it landed",
        "not persisted (<the error, verbatim>)",
    ),
)

# reteno-mcp's `_sections_cleared_from_account` names each cleared entry as the
# dotted JSON path of the SAVED account document at the shallowest key the patch
# does not write — `socials`, `contacts.emails`, `brand.colors.accentColors` —
# and, for stored logo rows the patch does not restate, appends the row class it
# emptied: `brand.logos[type=alternative]` (`type=?` when the row carries none).
# What is pinned below is that SHAPE — a dotted path with zero or more trailing
# `[...]` groups — and NOT the vocabulary: no rule here knows `logos`, `type`,
# or any qualifier name, so a path or a qualifier nobody has emitted yet still
# renders. Anything that is not that shape renders verbatim (`render_cleared_name`).
#
# An override names a SECTION, and is matched as the longest leading run of path
# segments, so a qualifier or a deeper segment after it is still rendered:
# `brand.products[id=3]` is "leftover product data (id=3)", not "leftover
# product data". `brand.products` is the one cleared name that cannot be
# rendered as a section the reader will find in their Brand Kit (SKILL.md: "Say
# it removed leftover product data and do not send the reader looking for a
# section that is not there.").
CLEARED_NAME_OVERRIDES: dict[str, str] = {
    "brand.products": "leftover product data",
}

# The saved document wraps its brand sections in one envelope key
# (`{brand: {organization, logos, colors, typography, ...}, contacts, socials,
# importantLinks, languages}`), and no reader finds a section called `brand`.
# Dropped in front of a section; never when it stands alone.
CLEARED_PATH_ENVELOPE = "brand"

# ASCII on purpose: `_printable` re-encodes each report line with stdout's codec
# and `replace`, so a non-ASCII separator would print as `?` inside a name.
CLEARED_PATH_SEPARATOR = " / "

# The whole entry must be a bracket-free path followed by balanced `[...]`
# groups that run to the end — anchored at both ends, so an unbalanced or nested
# bracket does not parse as a shorter name.
CLEARED_ENTRY_SHAPE = re.compile(
    r"^(?P<path>[^\[\]]*?)(?P<qualifiers>(?:\[[^\[\]]*\])*)$"
)
CLEARED_QUALIFIER = re.compile(r"\[([^\[\]]*)\]")

# --------------------------------------------------------------------------
# Logo outcome — SKILL.md §"Logo outcome — a missing brand logo is said out
# loud, not footnoted". Read top-down; take the FIRST row that applies.
# --------------------------------------------------------------------------

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
# Persist line
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


def parse_cleared_entry(name: str) -> tuple[list[str], list[str]] | None:
    """Split a cleared entry into its path segments and its qualifier texts.

    ``None`` when the string is not a path followed by balanced trailing
    ``[...]`` groups, or when the path carries no segment at all — the caller
    renders those verbatim rather than guessing at a shorter name.
    """

    shape = CLEARED_ENTRY_SHAPE.match(name)
    if shape is None:
        return None
    segments = [segment for segment in shape.group("path").split(".") if segment]
    if not segments:
        return None
    return segments, CLEARED_QUALIFIER.findall(shape.group("qualifiers"))


def render_cleared_name(raw: Any) -> str:
    """Name a cleared entry the way the reader finds it in their Brand Kit.

    The section, then the part of it that emptied: `socials / android` for a
    field, `logos (type=alternative)` for a row class. Naming only the last
    segment loses both — it told a reader whose `alternative` logo row was
    cleared that their `logos` section had gone.
    """

    if not isinstance(raw, str) or not raw.strip():
        return "an unnamed entry"
    name = raw.strip()
    parsed = parse_cleared_entry(name)
    if parsed is None:
        return name
    segments, qualifiers = parsed
    head: str | None = None
    tail = segments
    for length in range(len(segments), 0, -1):
        override = CLEARED_NAME_OVERRIDES.get(".".join(segments[:length]))
        if override is not None:
            head, tail = override, segments[length:]
            break
    if head is None and len(segments) > 1 and segments[0] == CLEARED_PATH_ENVELOPE:
        tail = segments[1:]
    text = CLEARED_PATH_SEPARATOR.join(([head] if head else []) + tail)
    if qualifiers:
        text = f"{text} ({', '.join(qualifiers)})"
    return text


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


@dataclass(frozen=True)
class PersistRow:
    """One row of the persist table, bound to the shape that selects it."""

    key: str
    table_index: int
    template: str
    matches: Callable[["PersistInputs"], bool]


@dataclass(frozen=True)
class PersistInputs:
    """The normalized 5c write result, 5d read-back, and promoted brandkit."""

    write_ok: bool
    write_error: str
    write_code: str
    cleared: list[Any]
    readback_ok: bool
    # `persist_fingerprint` of the account's document and of this run's
    # `brandkit.json`; `None` when the document was absent or unreadable.
    #
    # These replaced a website+name comparison, which confirmed on the ONE
    # sequence that matters: a re-run of the same site into the same account
    # (32 of 47 technical dirs on the dev publisher are later runs of a slug
    # already extracted there) whose 5c failed for a non-refusal reason. Host
    # and name are page-derived and therefore stable across runs, so the old
    # witness compared two values that could not disagree and printed
    # "persisted despite a failed call" over the PREVIOUS run's kit.
    readback_fingerprint: dict[str, Any] | None = None
    brandkit_fingerprint: dict[str, Any] | None = None
    # Phase 5d owes NO read on a denied/expired approval, an unattended run, a
    # validation rejection, or a run that failed at 5a/5b before any write
    # (`readback_owed`), so `report` performs none there. "No read was owed"
    # and "the read failed" are different facts and must not render the same
    # sentence.
    readback_supplied: bool = True
    # The stage the write document records: "5c" for the write call itself
    # (the default, and what a 5c document means by omission); "5a" / "5b"
    # for a session that could not be minted or an upload that failed BEFORE
    # any write was attempted -- nothing reached the account, so the line is
    # "not persisted" and no read is owed.
    write_stage: str = "5c"
    # False when no write document could be read at all: missing, unreadable,
    # or not a JSON object. Nothing on disk then says whether the write
    # happened -- but the account does, so such a run still owes a read and
    # is decided by it, never by the absence of the file.
    write_recorded: bool = True
    # Why `brandkit_fingerprint` is None. Two causes, and they are different
    # facts: the file was missing/unreadable, or it was readable but is not
    # the one `finalize-report.json.brandkit_sha256` records.
    brandkit_unreadable_reason: str = "this run's brandkit.json could not be read"

    @property
    def unattended(self) -> bool:
        return self.write_code == "-32040" and "proactive_mutation_denied" in (
            self.write_error or ""
        )

    @property
    def confirmed(self) -> bool:
        """Does the 5d read show the account holding THIS run's brandkit?"""

        if not self.readback_ok:
            return False
        if self.readback_fingerprint is None or self.brandkit_fingerprint is None:
            return False
        return self.readback_fingerprint == self.brandkit_fingerprint

    @property
    def unconfirmed_reason(self) -> str:
        reason = self._unconfirmed_reason()
        if not self.write_recorded:
            return f"{UNRECORDED_WRITE_ERROR} and {reason}"
        return reason

    def _unconfirmed_reason(self) -> str:
        if not self.readback_supplied:
            return "no read-back was reported"
        if not self.readback_ok:
            return "the read-back call failed"
        if self.readback_fingerprint is None:
            return "the read-back carries no Brand Kit"
        if self.brandkit_fingerprint is None:
            return self.brandkit_unreadable_reason
        stored = self.readback_fingerprint
        promoted = self.brandkit_fingerprint
        for section in PERSIST_FINGERPRINT_SECTIONS:
            if stored.get(section) == promoted.get(section):
                continue
            if section == "website":
                if promoted.get("website") is None:
                    return "this run's brandkit records no website to compare"
                if stored.get("website") is None:
                    return "the read-back records no website"
                return (
                    f"the account holds {stored['website']}, "
                    f"not {promoted['website']}"
                )
            if section == "name":
                return (
                    f"the account holds the name {_text(stored.get('name'))!r}, "
                    f"not {_text(promoted.get('name'))!r}"
                )
            return (
                f"the account's {PERSIST_SECTION_NOUNS[section]} differ from "
                "this run's"
            )
        # Unreachable while `confirmed` is the negation of this walk; say so
        # rather than crash.
        return "the read-back matches on every section this run compares"


def _text(value: Any) -> str:
    return value if isinstance(value, str) else ""


# What `write_error` carries when no write document was recorded at all.
UNRECORDED_WRITE_ERROR = "no write result was recorded"

# The refusal codes decided BEFORE anything reaches the account (SKILL.md 5d):
# a denied approval and the unattended `proactive_mutation_denied` (both
# -32040), an expired approval (-32041), a schema rejection. A read after any
# of them would witness the PREVIOUS kit, never this run's.
REFUSAL_WRITE_CODES: frozenset[str] = frozenset({"-32040", "-32041", "validation"})

# The write-document stages a run fails at before the write call is made.
PRE_WRITE_STAGES: frozenset[str] = frozenset({"5a", "5b"})


def readback_owed(inputs: PersistInputs) -> bool:
    """Whether the account must be read before the persist line can be decided.

    The ONE place that decides it. No read is owed when the write document
    says the run stopped before the write (`stage` 5a/5b: a session that
    could not be minted or an upload that failed -- nothing reached the
    account), or when the write was refused before anything reached the
    account (a denied/expired approval, an unattended run, a validation
    rejection). Every other case is decided by the read -- a call that
    errored in transit can still have landed, a successful-looking result can
    be an echo, and a MISSING write document says nothing about the account
    at all (24 of 25 local runs hand-forged one; the line minted from its
    absence was "persisted but unverified" for an account nothing wrote).
    """

    if not inputs.write_ok and inputs.write_stage in PRE_WRITE_STAGES:
        return False
    if not inputs.write_ok and inputs.write_code in REFUSAL_WRITE_CODES:
        return False
    return True


# Evaluated in order; the first match wins. The three refusals (-32040/-32041/
# validation) are decided before anything reaches the account, so they are
# terminal regardless of what a read-back says (SKILL.md 5d).
PERSIST_ROWS: tuple[PersistRow, ...] = (
    PersistRow(
        key="unattended",
        table_index=5,
        template="not persisted (unattended run — Reteno mutations are disabled)",
        matches=lambda i: not i.write_ok and i.unattended,
    ),
    PersistRow(
        key="approval_denied",
        table_index=4,
        template="not persisted (approval denied)",
        matches=lambda i: not i.write_ok and i.write_code == "-32040",
    ),
    PersistRow(
        key="approval_timed_out",
        table_index=4,
        template="not persisted (approval timed out)",
        matches=lambda i: not i.write_ok and i.write_code == "-32041",
    ),
    PersistRow(
        key="rejected",
        table_index=6,
        template="not persisted (rejected: {error})",
        matches=lambda i: not i.write_ok and i.write_code == "validation",
    ),
    # A 5a/5b failure is recorded in the same document with its `stage`:
    # nothing reached the account, so the line is the plain failure row and
    # no read-back can turn it into "persisted despite a failed call".
    PersistRow(
        key="not_persisted_before_write",
        table_index=7,
        template="not persisted ({error})",
        matches=lambda i: not i.write_ok and i.write_stage in PRE_WRITE_STAGES,
    ),
    PersistRow(
        key="persisted_despite_failed_call",
        table_index=3,
        template="persisted despite a failed call ({error})",
        matches=lambda i: not i.write_ok and i.confirmed,
    ),
    # No write document AND a read that could not witness: nothing on disk and
    # nothing from the account says what happened, so the honest line is the
    # unverified row, never "not persisted" (a write may well have landed).
    PersistRow(
        key="unrecorded_write_unverified",
        table_index=2,
        template="persisted but unverified ({reason})",
        matches=lambda i: not i.write_ok and not i.write_recorded and not i.readback_ok,
    ),
    PersistRow(
        key="not_persisted",
        table_index=7,
        template="not persisted ({error})",
        matches=lambda i: not i.write_ok,
    ),
    PersistRow(
        key="persisted_but_unverified",
        table_index=2,
        template="persisted but unverified ({reason})",
        matches=lambda i: i.write_ok and not i.confirmed,
    ),
    PersistRow(
        key="persisted_and_verified",
        table_index=0,
        template="persisted and verified",
        matches=lambda i: i.write_ok and not i.cleared,
    ),
    PersistRow(
        key="persisted_with_cleared",
        table_index=1,
        template="persisted, cleared from the account: {names}",
        matches=lambda i: i.write_ok and bool(i.cleared),
    ),
)


def select_persist_row(inputs: PersistInputs) -> PersistRow:
    for row in PERSIST_ROWS:
        if row.matches(inputs):
            return row
    # Unreachable: the last two rows partition write_ok & confirmed. Fail into
    # the unverified row rather than crashing — this CLI never refuses a run
    # over its own reporting. (Looked up by key: a positional index silently
    # pointed at "not persisted" once the rows grew.)
    return next(row for row in PERSIST_ROWS if row.key == "persisted_but_unverified")


def render_persist_line(inputs: PersistInputs) -> str:
    row = select_persist_row(inputs)
    names = ", ".join(render_cleared_name(name) for name in inputs.cleared)
    return row.template.format(
        error=inputs.write_error or "no error message was returned",
        reason=inputs.unconfirmed_reason,
        names=names,
    )


def _coerce_code(raw: Any) -> str:
    if isinstance(raw, str):
        return raw
    if isinstance(raw, int) and not isinstance(raw, bool):
        return str(raw)
    return ""


# The 5c cell prints `code` from the JSON-RPC error, but that carriage is not
# guaranteed: a transport that raises before a result exists, or a server that
# spells the refusal only in prose, leaves `code` null. The refusals are the
# rows the reader most needs, so the error TEXT is a second witness for each.
# Order matters: `proactive_mutation_denied` is a -32040 that must select the
# unattended row, not the bare denial.
#
# The rejection marker is the SERVER'S OWN PHRASE, not the bare word
# "validation". reteno-mcp raises
# ``ValueError("Brand Kit payload failed schema validation: ...")``, which
# FastMCP surfaces as an `isError` text with no structured code — so on the
# prescribed path that text is the only witness of a rejection and a marker
# has to stay. As the bare word it also claimed "upstream validation service
# unavailable" and "the validation service timed out; retry" as proven
# rejections, which SKIPS the read-back the run still owes and reports a
# transport failure as a refusal. Reproduced.
WRITE_CODE_TEXT_MARKERS: tuple[tuple[str, str], ...] = (
    ("proactive_mutation_denied", "-32040"),
    ("-32041", "-32041"),
    ("-32040", "-32040"),
    ("failed schema validation", "validation"),
)


# `mcp.server.fastmcp` wraps every exception a tool raises as an `isError`
# text result and prepends `Error executing tool <name>: ` to it, so the
# rejection the 5c cell now preserves verbatim arrives carrying the tool's own
# name -- `Error executing tool update_brandkit_from_extraction: Brand Kit
# payload failed schema validation: brand.colors[0].hex: ...`. The reader
# already knows which call failed; the row promises `rejected: <field path>:
# <message>`. Stripped once, from the FRONT only, so an error text that merely
# quotes the phrase keeps it. Not stripped inside `code_from_error_text`,
# which must keep seeing the whole text it was handed.
FASTMCP_TOOL_ERROR_PREFIX = re.compile(r"^Error executing tool \S+: ")


def code_from_error_text(error: str) -> str:
    """The refusal code named by an error TEXT, or ``""``.

    Text-only fallback for a 5c result that carries no `code`. It never
    overrides a code the call did return.
    """

    if not error:
        return ""
    haystack = error.lower()
    for marker, code in WRITE_CODE_TEXT_MARKERS:
        # A numeric code is distinctive enough to match as a substring; a
        # textual marker is matched on word boundaries so "revalidation" is
        # not a rejection. The boundaries hold at both ends of a multi-word
        # phrase too (measured: a `" " not in marker` substring branch was a
        # no-op on every fixture and on the server's own text, so it would
        # have been a rule no mutation could kill).
        if marker[0].isalpha():
            found = re.search(rf"\b{re.escape(marker)}\b", haystack) is not None
        else:
            found = marker in haystack
        if found:
            return code
    return ""


def build_persist_inputs(
    write: Any,
    readback: Any,
    brandkit: Any,
    *,
    readback_supplied: bool = True,
    brandkit_unreadable_reason: str | None = None,
) -> PersistInputs:
    """Normalize the write document and the CLI's own read-back; never raise.

    A ``write`` that is not a JSON object -- the file was missing, unreadable,
    or held something else -- is an UNRECORDED write: ``write_ok`` is False,
    ``write_error`` names the absence, and ``write_recorded`` lets the rows
    tell it from a recorded failure.
    """

    write_recorded = isinstance(write, dict)
    write_obj = write if write_recorded else {}
    readback_obj = readback if isinstance(readback, dict) else {}
    # The 5d document carries the account's whole Brand Kit under `brandkit`;
    # a read-back without one cannot witness anything.
    stored = readback_obj.get("brandkit")
    readback_fingerprint = (
        persist_fingerprint(stored) if isinstance(stored, dict) else None
    )
    brandkit_fingerprint = (
        persist_fingerprint(brandkit) if isinstance(brandkit, dict) else None
    )
    cleared = write_obj.get("cleared")
    write_error = FASTMCP_TOOL_ERROR_PREFIX.sub(
        "", _text(write_obj.get("error")), count=1
    )
    write_code = _coerce_code(write_obj.get("code")) or code_from_error_text(
        write_error
    )
    if not write_recorded:
        write_error = UNRECORDED_WRITE_ERROR
    write_stage = _text(write_obj.get("stage")).strip() or "5c"
    return PersistInputs(
        write_ok=write_obj.get("ok") is True,
        write_error=write_error,
        write_code=write_code,
        cleared=list(cleared) if isinstance(cleared, list) else [],
        readback_ok=readback_obj.get("ok") is True,
        readback_fingerprint=readback_fingerprint,
        brandkit_fingerprint=brandkit_fingerprint,
        readback_supplied=readback_supplied,
        write_stage=write_stage,
        write_recorded=write_recorded,
        **(
            {"brandkit_unreadable_reason": brandkit_unreadable_reason}
            if brandkit_unreadable_reason
            else {}
        ),
    )


# --------------------------------------------------------------------------
# Assembling the CLI outputs
# --------------------------------------------------------------------------


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


def build_report_lines(
    out_dir: Path,
    write: Any,
    readback: Any,
    *,
    readback_supplied: bool = True,
) -> list[str]:
    """Every line the final reply owes, in reporting order.

    Persist line first (one per run that reached a promoted Phase 4), then the
    logo line when the table produces one, then one line per stripped contact.

    Both the witness and the logo line read ``brandkit.json`` only when this
    run's own ``finalize-report.json`` says it promoted it: otherwise the
    document belongs to an earlier run of the same out-dir and describing it
    would certify a kit this run never wrote.
    """

    report, brandkit = _load_promoted_pair(out_dir)
    # `_load_promoted_pair` drops a brandkit.json the report's own sha does not
    # bind; say WHY, rather than reusing the missing-file sentence.
    pair_mismatch = brandkit is None and (out_dir / "brandkit.json").exists()
    report_obj = report if isinstance(report, dict) else {}
    # Same rule the `run` block already applies to its logo line: nothing here
    # may describe a document this run did not promote (NOT_PROMOTED_REASON).
    promoted = report_obj.get("promoted") is True
    if not promoted:
        brandkit = None
    warnings = report_obj.get("warnings")
    warnings = list(warnings) if isinstance(warnings, list) else []
    hosting = report_obj.get("logo_hosting")
    hosting = hosting if isinstance(hosting, dict) else {}

    lines = [
        render_persist_line(
            build_persist_inputs(
                write,
                readback,
                brandkit,
                readback_supplied=readback_supplied,
                brandkit_unreadable_reason=(
                    # "this run promoted nothing" is the stronger fact and
                    # subsumes a sha that cannot bind, so it is named first.
                    NOT_PROMOTED_REASON
                    if not promoted
                    else PAIR_MISMATCH_REASON if pair_mismatch else None
                ),
            )
        )
    ]
    if isinstance(brandkit, dict):
        # Same rule as the run block: the logo line describes a brandkit that
        # was read, never the absence of one.
        logo_line = logo_report_line(_logos_of(brandkit), hosting)
        if logo_line is not None:
            lines.append(logo_line)
    lines.extend(contact_report_lines(warnings))
    return lines

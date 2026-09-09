"""Exact port of the satellites' shell site-match block (``regdom`` + verdict).

Both `brandkit-tone-of-voice-v-0` and `brandkit-business-context-v-0` open with
a ~70-line ``bash`` block that derives a registrable domain for the target URL
and for whatever the technical dir recorded, then prints a ``verdict:`` line
that decides whether the satellite may read the artifacts at all. The block is
byte-identical in both files, it needs ``jq`` (absent from the runtime image),
and it is 30 KB of prose the agent re-reads every run.

This module is a **table-for-table port**, not a re-design:

* the ``sld`` / ``cc`` word lists are copied verbatim from the shell ``awk``
  ``BEGIN`` block;
* the normalisation steps run in the shell's order (lowercase → scheme →
  path/query/fragment → userinfo → port → trailing dot → leading ``www.``);
* the verdict branches are evaluated in the shell's ``if/elif`` order and emit
  the same five strings.

It deliberately does **not** use the Public Suffix List. The finalizer's own
``WRONG_SITE_IDENTITY_BLOCKER`` does; the satellites do not, and switching them
would turn the documented "errs toward continuing" cases (``github.io``,
``web.app``) into new false stops.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any


# Copied verbatim from the satellites' awk BEGIN block:
#   split("ac biz co com edu gob gov in info mil ne net or org pp sch", a, " ")
SECOND_LEVEL_LABELS: frozenset[str] = frozenset(
    "ac biz co com edu gob gov in info mil ne net or org pp sch".split(" ")
)

# Copied verbatim from the satellites' awk BEGIN block:
#   split("ae ar au bd br cn co eg hk id il in jp ke kr lk mx my ng nz pe ph
#          pk ru sa sg th tr tw ua ug uk uy ve vn za", b, " ")
# ccTLDs whose registry really is organised under those second labels. A ccTLD
# that is ABSENT here is treated as flat, which is the safe direction.
COUNTRY_CODE_TLDS: frozenset[str] = frozenset(
    (
        "ae ar au bd br cn co eg hk id il in jp ke kr lk mx my ng nz pe ph pk "
        "ru sa sg th tr tw ua ug uk uy ve vn za"
    ).split(" ")
)

# The four `sed -E` expressions, in the shell's order. Each is applied once
# (no /g), and each is anchored, exactly like the original.
_SCHEME_RE = re.compile(r"^[a-z0-9+.-]+://")
_PATH_RE = re.compile(r"[/?#].*$")
_USERINFO_RE = re.compile(r"^[^@]*@")
_PORT_RE = re.compile(r":[0-9]+$")
_TRAILING_DOT_RE = re.compile(r"\.$")
_WWW_RE = re.compile(r"^www\.([^.]+\.[^.]+)")

# awk: /^[0-9]+(\.[0-9]+)*$/ { print; next }
_NUMERIC_RE = re.compile(r"^[0-9]+(\.[0-9]+)*$")

CAPTURE_SOURCE = "capture.json .requestedUrl (recorded by the runtime)"
EXTRACTION_SOURCE = (
    "brandkit.extraction.json .brand.organization.website (agent-authored)"
)
NO_SOURCE = "none recorded"

VERDICT_PROCEED = "PROCEED"
VERDICT_HARD_STOP = "HARD STOP"
VERDICT_NO_ARTIFACTS = "NO ARTIFACTS"

# The satellite that writes the stop file, per stage. Mirrors the `jq -n` block
# each SKILL.md carries under "A hard stop is a written signal".
STOP_FILENAMES: dict[str, str] = {
    "tone-of-voice": "brand-voice.stop.json",
    "business-context": "business-context.stop.json",
}

# The one place the two satellites deliberately differ: tone-of-voice treats an
# empty technical dir as a stop ("An empty technical directory is a stop"),
# business-context explicitly does NOT ("... is not a stop here" — it falls
# through to web search). Keep the asymmetry.
STAGES_STOPPING_ON_NO_ARTIFACTS: frozenset[str] = frozenset({"tone-of-voice"})


def _ascii_lower(text: str) -> str:
    """Lowercase ASCII only — `tr 'A-Z' 'a-z'` does not touch other alphabets."""

    return "".join(
        chr(ord(character) + 32) if "A" <= character <= "Z" else character
        for character in text
    )


def _regdom_line(line: str) -> str:
    """Apply the shell pipeline to ONE line (sed and awk are per-line)."""

    value = _ascii_lower(line)
    value = _SCHEME_RE.sub("", value, count=1)
    value = _PATH_RE.sub("", value, count=1)
    value = _USERINFO_RE.sub("", value, count=1)
    value = _PORT_RE.sub("", value, count=1)
    value = _TRAILING_DOT_RE.sub("", value, count=1)
    value = _WWW_RE.sub(r"\1", value, count=1)

    if _NUMERIC_RE.match(value):
        return value
    fields = value.split(".")
    # awk's NF is 0 for an empty line, 1 for a bare label; both print the line.
    field_count = 0 if value == "" else len(fields)
    if field_count <= 2:
        return value
    if fields[-1] in COUNTRY_CODE_TLDS and fields[-2] in SECOND_LEVEL_LABELS:
        return ".".join(fields[-3:])
    return ".".join(fields[-2:])


def regdom(value: str) -> str:
    """Registrable domain (eTLD+1) per the satellites' shell ``regdom``."""

    if value is None:  # pragma: no cover - callers pass strings
        return ""
    # `printf '%s\n' "$1"` feeds every embedded newline to sed/awk as its own
    # line; keep that shape so a pathological input cannot diverge silently.
    return "\n".join(_regdom_line(line) for line in value.split("\n"))


def _jq_raw(path: Path, *keys: str) -> str:
    """``jq -r '<path> // empty' <file> 2>/dev/null`` — "" on any failure."""

    try:
        payload: Any = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return ""
    for key in keys:
        if not isinstance(payload, dict):
            return ""
        payload = payload.get(key)
    # jq's `// empty` treats null and false as absent.
    if payload is None or payload is False or payload == "":
        return ""
    if isinstance(payload, str):
        return payload
    if payload is True:
        return "true"
    if isinstance(payload, (int, float)):
        return json.dumps(payload)
    return json.dumps(payload, ensure_ascii=False, separators=(",", ":"))


def _stat_mtime_line(path: Path) -> str:
    """``stat -c '%y'`` (GNU coreutils, the runtime image) for ``path``."""

    stamp = path.stat()
    moment = datetime.fromtimestamp(stamp.st_mtime).astimezone()
    nanoseconds = stamp.st_mtime_ns % 1_000_000_000
    return (
        f"{moment.strftime('%Y-%m-%d %H:%M:%S')}."
        f"{nanoseconds:09d} {moment.strftime('%z')}"
    )


@dataclass(frozen=True)
class SiteMatch:
    """The block's printed output plus the decision it encodes."""

    target: str
    requested: str
    landed: str
    source: str
    evidence_path: str | None
    evidence_mtime: str | None
    verdict: str
    verdict_line: str

    @property
    def lines(self) -> list[str]:
        """The exact lines the shell block echoes, in order."""

        rendered = [
            f"target:    {self.target}",
            f"requested: {self.requested}",
            f"landed:    {self.landed}",
            f"source:    {self.source}",
        ]
        if self.evidence_path is not None:
            rendered.append(f"evidence:  {self.evidence_path}")
            if self.evidence_mtime is not None:
                rendered.append(self.evidence_mtime)
        rendered.append(f"verdict:   {self.verdict_line}")
        return rendered


def evaluate_site_match(technical_dir: str, target_url: str) -> SiteMatch:
    """Run the satellites' site-match block over ``technical_dir``.

    ``technical_dir`` is used as given (never resolved): the NO ARTIFACTS
    verdict embeds ``${TECH}`` verbatim, and a resolved path would not be the
    string the operator passed.
    """

    tech = Path(technical_dir)
    capture = tech / "capture.json"
    extraction = tech / "brandkit.extraction.json"

    target = regdom(target_url)
    landed = regdom(_jq_raw(capture, "url"))
    requested = regdom(_jq_raw(capture, "requestedUrl"))
    source = CAPTURE_SOURCE
    if not requested:
        requested = regdom(_jq_raw(extraction, "brand", "organization", "website"))
        source = EXTRACTION_SOURCE
    if not requested:
        source = NO_SOURCE

    evidence_path: str | None = None
    evidence_mtime: str | None = None
    for candidate in (capture, extraction):
        if not candidate.is_file():
            continue
        evidence_path = str(candidate)
        try:
            evidence_mtime = _stat_mtime_line(candidate)
        except OSError:
            # `stat -c ... || stat -f ...` both failing prints nothing usable;
            # the evidence label still went out, exactly as in the shell.
            evidence_mtime = None
        break

    if not capture.is_file() and not extraction.is_file():
        verdict = VERDICT_NO_ARTIFACTS
        line = (
            f"NO ARTIFACTS - {technical_dir} holds no extraction; "
            "apply the empty-technical-directory rule"
        )
    elif requested and requested == target:
        verdict = VERDICT_PROCEED
        line = "PROCEED - requested matches target"
    elif requested:
        verdict = VERDICT_HARD_STOP
        line = f"HARD STOP - artifacts were produced for {requested}, not {target}"
    elif landed and landed == target:
        verdict = VERDICT_PROCEED
        line = "PROCEED - nothing recorded the requested URL; landed matches target"
    elif landed:
        verdict = VERDICT_HARD_STOP
        line = (
            "HARD STOP - nothing recorded the requested URL and landed "
            f"({landed}) is not {target}"
        )
    else:
        verdict = VERDICT_HARD_STOP
        line = "HARD STOP - artifacts are present but record no URL at all"

    return SiteMatch(
        target=target,
        requested=requested,
        landed=landed,
        source=source,
        evidence_path=evidence_path,
        evidence_mtime=evidence_mtime,
        verdict=verdict,
        verdict_line=line,
    )


def stop_file_for(stage: str) -> str | None:
    """The stop filename this stage writes, or None for an unknown stage."""

    return STOP_FILENAMES.get(stage)


def should_write_stop_file(stage: str, verdict: str) -> bool:
    """Whether ``stage`` writes its stop file for ``verdict``.

    Every stage stops on HARD STOP. Only the stages listed in
    ``STAGES_STOPPING_ON_NO_ARTIFACTS`` stop on NO ARTIFACTS — the satellites
    disagree there on purpose.
    """

    if stage not in STOP_FILENAMES:
        return False
    if verdict == VERDICT_HARD_STOP:
        return True
    if verdict == VERDICT_NO_ARTIFACTS:
        return stage in STAGES_STOPPING_ON_NO_ARTIFACTS
    return False

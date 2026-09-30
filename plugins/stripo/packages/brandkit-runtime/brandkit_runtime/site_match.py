"""Source-identity checks for host-owned native browser runs."""

from __future__ import annotations

import json
import stat
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.parse import urlparse

from publicsuffixlist import PublicSuffixList

from .validation import _identity_host as public_identity_host


SESSION_FILENAME = "browser-session.json"
SESSION_MAX_BYTES = 16 * 1024
SESSION_KEYS = frozenset({"requestedUrl", "landedUrl", "createdAt"})

VERDICT_PROCEED = "PROCEED"
VERDICT_HARD_STOP = "HARD STOP"
VERDICT_NO_ARTIFACTS = "NO ARTIFACTS"

STOP_FILENAMES: dict[str, str] = {
    "tone-of-voice": "brand-voice.stop.json",
    "business-context": "business-context.stop.json",
}
STAGES_STOPPING_ON_NO_ARTIFACTS: frozenset[str] = frozenset({"tone-of-voice"})

_PSL = PublicSuffixList()


def _identity_host(value: Any) -> str | None:
    if not isinstance(value, str) or not value or value != value.strip():
        return None
    if "\\" in value or any(ord(char) < 32 or char.isspace() for char in value):
        return None
    try:
        parsed = urlparse(value)
        if (
            parsed.scheme.lower() not in {"http", "https"}
            or not parsed.hostname
            or parsed.username is not None
            or parsed.password is not None
            or "%" in parsed.netloc
        ):
            return None
        parsed.port
    except ValueError:
        return None
    host = public_identity_host(value)
    return host.rstrip(".") if host else None


def _hosts_match(left: str, right: str) -> bool:
    if left == right:
        return True
    left_domain = _PSL.privatesuffix(left) or ""
    right_domain = _PSL.privatesuffix(right) or ""
    return bool(left_domain and right_domain and left_domain == right_domain)


def regdom(value: str) -> str:
    """Return the strict public-suffix identity used in diagnostic output."""

    host = _identity_host(value)
    if host is None:
        return ""
    return _PSL.privatesuffix(host) or host


def _read_session(technical_dir: Path) -> tuple[dict[str, str] | None, str | None]:
    path = technical_dir / SESSION_FILENAME
    try:
        entry = path.lstat()
    except FileNotFoundError:
        return None, None
    except OSError as exc:
        return None, f"cannot inspect {path}: {exc.__class__.__name__}: {exc}"
    if stat.S_ISLNK(entry.st_mode) or not stat.S_ISREG(entry.st_mode):
        return None, f"{path} must be a regular non-symlink file"
    try:
        with path.open("rb") as handle:
            raw = handle.read(SESSION_MAX_BYTES + 1)
    except OSError as exc:
        return None, f"cannot read {path}: {exc.__class__.__name__}: {exc}"
    if len(raw) > SESSION_MAX_BYTES:
        return None, f"{path} exceeds the {SESSION_MAX_BYTES}-byte limit"
    try:
        payload = json.loads(raw.decode("utf-8", errors="strict"))
    except (UnicodeError, json.JSONDecodeError) as exc:
        return None, f"cannot parse {path}: {exc.__class__.__name__}: {exc}"
    if not isinstance(payload, dict) or set(payload) != SESSION_KEYS:
        return None, f"{path} must have exactly requestedUrl, landedUrl, and createdAt"
    if not all(isinstance(payload.get(key), str) and payload[key] for key in SESSION_KEYS):
        return None, f"{path} fields must be non-empty strings"
    if _identity_host(payload["requestedUrl"]) is None or _identity_host(payload["landedUrl"]) is None:
        return None, f"{path} contains an invalid requestedUrl or landedUrl"
    try:
        created_at = datetime.fromisoformat(payload["createdAt"].replace("Z", "+00:00"))
    except ValueError:
        return None, f"{path} contains an invalid createdAt timestamp"
    if created_at.tzinfo is None or created_at.utcoffset() is None or created_at.utcoffset().total_seconds() != 0:
        return None, f"{path} createdAt must be a UTC timestamp"
    return payload, None


@dataclass(frozen=True)
class SiteMatch:
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
        rendered = [
            f"target:    {self.target}",
            f"requested: {self.requested}",
            f"landed:    {self.landed}",
            f"source:    {self.source}",
        ]
        if self.evidence_path is not None:
            rendered.append(f"evidence:  {self.evidence_path}")
        rendered.append(f"verdict:   {self.verdict_line}")
        return rendered


def evaluate_site_match(technical_dir: str, target_url: str) -> SiteMatch:
    """Compare a requested URL with immutable host-produced session identity."""

    tech = Path(technical_dir)
    path = tech / SESSION_FILENAME
    target_host = _identity_host(target_url)
    payload, error = _read_session(tech)
    target = regdom(target_url)
    requested = regdom(payload["requestedUrl"]) if payload else ""
    landed = regdom(payload["landedUrl"]) if payload else ""
    source = f"{SESSION_FILENAME} (host-owned native browser identity)" if payload else "none recorded"

    if target_host is None:
        verdict = VERDICT_HARD_STOP
        line = "HARD STOP - target URL is not a valid credential-free HTTP(S) URL"
    elif payload is None:
        verdict = VERDICT_NO_ARTIFACTS if error is None and not path.exists() else VERDICT_HARD_STOP
        line = (
            f"NO ARTIFACTS - {technical_dir} has no {SESSION_FILENAME}"
            if verdict == VERDICT_NO_ARTIFACTS
            else f"HARD STOP - {error or 'native browser identity is unavailable'}"
        )
    else:
        requested_host = _identity_host(payload["requestedUrl"])
        landed_host = _identity_host(payload["landedUrl"])
        if requested_host and landed_host and _hosts_match(requested_host, target_host) and _hosts_match(landed_host, target_host):
            verdict = VERDICT_PROCEED
            line = "PROCEED - native requested and landed identities match target"
        else:
            verdict = VERDICT_HARD_STOP
            line = f"HARD STOP - native artifacts were produced for {requested or landed}, not {target}"

    return SiteMatch(
        target=target,
        requested=requested,
        landed=landed,
        source=source,
        evidence_path=str(path) if path.exists() else None,
        evidence_mtime=None,
        verdict=verdict,
        verdict_line=line,
    )


def stop_file_for(stage: str) -> str | None:
    return STOP_FILENAMES.get(stage)


def should_write_stop_file(stage: str, verdict: str) -> bool:
    if stage not in STOP_FILENAMES:
        return False
    return verdict == VERDICT_HARD_STOP or (
        verdict == VERDICT_NO_ARTIFACTS and stage in STAGES_STOPPING_ON_NO_ARTIFACTS
    )

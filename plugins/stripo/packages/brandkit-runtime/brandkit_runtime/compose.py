"""Final-brandkit composition: satellite loaders, compose, homepage gate.

Vendored from the sibling brandkit-agent repo (``brandkit_runtime/runner.py``
@ 6077f45): the ``_compose_final_brandkit`` family, the satellite loaders with
their empty/default fallbacks, and the homepage-blocked gate. Function bodies
are kept as close to the source as possible; the differences are:

- functions operate on an explicit ``technical_dir`` (the source addressed
  ``TECHNICAL_ROOT / slug`` inside the worker container);
- satellite validation threads an explicit :class:`SchemaPaths` instead of
  relying on module-level schema-path defaults;
- the homepage gate is simplified for this runtime, where every run is a
  fresh extraction (see :func:`resolve_homepage_gate`);
- :func:`apply_standalone_satellites` is ported and exported for a future
  caching phase but is NOT wired into the CLI pipeline.
"""

from __future__ import annotations

import json
import logging
import os
import re
from pathlib import Path
from typing import Any

from .validation import (
    SchemaLoadError,
    SchemaPaths,
    HOMEPAGE_FAILED_WITHOUT_EVIDENCE_BLOCKER,
    BLANK_RENDER_BLOCKER_TYPE,
    HOMEPAGE_BLANK_RENDER_BLOCKER,
    HOMEPAGE_LANDED_DOCUMENT_ERROR_BLOCKER,
    LANDED_DOCUMENT_ERROR_BLOCKER_TYPE,
    TECHNICAL_HOMEPAGE_BLOCKED_BLOCKER,
    _exact_public_asset_url,
    homepage_status_failed_without_evidence,
    homepage_status_indicates_blocked,
    load_schema,
    validate_brand_voice_payload,
    validate_business_context_payload,
    validate_products_payload,
)

logger = logging.getLogger(__name__)

# Mirrors the source repo's MAX_CONTAINER_READ_BYTES (config.py): a guard
# against pathological artifact sizes, env-overridable the same way.
MAX_READ_BYTES = int(os.getenv("MAX_CONTAINER_READ_BYTES", str(10 * 1024 * 1024)))

DEFAULT_BRAND_VOICE = {
    "toneOfVoice": [],
    "rulesToFollow": {"allowed": [], "forbidden": []},
    "defaultLanguages": [],
    "styles": [],
}
DEFAULT_BUSINESS_CONTEXT = {
    "customerValue": "",
    "revenueModel": "",
}


# --- Satellite hard stops -------------------------------------------------
#
# A satellite skill (tone-of-voice, business-context) can decide it must NOT
# derive its field at all — its own site-match check refuses because the
# artifacts describe a different company, the technical dir holds no
# extraction, and so on. Before this signal existed, refusing looked exactly
# like "the satellite ran and found nothing": no output file, so the loader
# below returned its empty default with a warning and the run composed,
# promoted, and exited 0 carrying `brandVoice: {"toneOfVoice": [], ...}` under
# the message "Tone-of-voice stage did not produce brand-voice.json". A
# redirecting storefront therefore shipped a voiceless brandkit reported as a
# clean compose.
#
# The contract (mirrored in both satellite SKILL.mds): instead of writing its
# normal artifact, the satellite writes a STOP FILE next to it in the same
# technical dir, and writes nothing else.
#
#     ${TECH}/brand-voice.stop.json          (brandkit-tone-of-voice-v-0)
#     ${TECH}/business-context.stop.json     (brandkit-business-context-v-0)
#
#     {"stage": "tone-of-voice", "reason": "<one line: why it stopped>"}
#
# ``reason`` is the only field this runtime reads; ``stage`` and any other key
# are free-form context for a human. PRESENCE ALONE IS THE STOP SIGNAL: an
# empty, malformed, oversized or non-UTF-8 stop file still stops the run (with
# the reason reported as unreadable), because the bytes that would carry the
# refusal are exactly the ones that went missing. Compose turns any recorded
# stop into a BLOCKER — the CLI's exit 4 — so nothing is promoted and the
# previous good brandkit stays in place.
BRAND_VOICE_STOP_FILENAME = "brand-voice.stop.json"
BUSINESS_CONTEXT_STOP_FILENAME = "business-context.stop.json"

#: stop filename -> (satellite skill name, the artifact it did NOT write).
#: Insertion order is the order blockers are reported in.
SATELLITE_STOP_FILES: dict[str, tuple[str, str]] = {
    BRAND_VOICE_STOP_FILENAME: ("brandkit-tone-of-voice-v-0", "brand-voice.json"),
    BUSINESS_CONTEXT_STOP_FILENAME: (
        "brandkit-business-context-v-0",
        "business-context.json",
    ),
}

#: Upper bound on the reason text folded into a blocker message. The stop file
#: is agent-authored, and blockers are surfaced to a human verbatim.
MAX_STOP_REASON_CHARS = 500


class SatelliteHardStopError(RuntimeError):
    """A satellite recorded a hard stop instead of producing its artifact.

    Distinct from "the satellite produced nothing" (a warning + empty
    fallback) and from an install fault (:class:`SchemaLoadError`, exit 1).
    Raised by the satellite loaders; the CLI maps it — and the pre-collected
    :func:`collect_satellite_hard_stops` — onto the blockers exit code, so a
    refusal can never compose an empty brandVoice / businessContext at exit 0.
    """

    def __init__(
        self,
        message: str,
        *,
        satellite: str,
        stop_path: Path,
        reason: str,
    ) -> None:
        super().__init__(message)
        self.satellite = satellite
        self.stop_path = stop_path
        self.reason = reason


def _stop_reason(stop_path: Path) -> str:
    """Best-effort one-line reason from a stop file. Never raises.

    The stop already happened by the time this runs — the file's presence
    decided it — so every read failure degrades to a described placeholder
    rather than changing the outcome.
    """
    if not stop_path.is_file():
        # Present (the caller checked) but not a regular file: a directory or
        # fifo at the stop path is still a stop, with an unreadable reason.
        return "reason unreadable (stop path is not a regular file)"
    try:
        payload = _read_json_file(stop_path)
    except (OSError, ValueError, RuntimeError) as exc:
        # ValueError covers JSONDecodeError and UnicodeDecodeError; RuntimeError
        # is _read_text_file's oversize guard.
        return f"reason unreadable ({exc.__class__.__name__}: {exc})"
    if payload is None:
        return "no reason recorded (stop file is empty)"
    if not isinstance(payload, dict):
        return "reason unreadable (stop file is not a JSON object)"
    reason = payload.get("reason")
    if not isinstance(reason, str) or not reason.strip():
        return "no reason recorded"
    collapsed = " ".join(reason.split())
    if len(collapsed) > MAX_STOP_REASON_CHARS:
        return collapsed[:MAX_STOP_REASON_CHARS] + "…"
    return collapsed


def _read_stop_record(
    technical_dir: Path,
    stop_filename: str,
) -> tuple[str, str, str, Path] | None:
    """``(satellite, artifact, reason, stop_path)`` when a stop is recorded.

    Keyed on EXISTENCE, not readability: the stop file's presence is the
    signal, so a stop path that is a directory, a fifo, a dangling symlink or
    unreadable bytes still stops the run (reason reported as unreadable).
    """
    stop_path = technical_dir / stop_filename
    # exists() follows symlinks, so a dangling one needs the explicit check.
    if not stop_path.exists() and not stop_path.is_symlink():
        return None
    satellite, artifact = SATELLITE_STOP_FILES[stop_filename]
    return satellite, artifact, _stop_reason(stop_path), stop_path


def _format_satellite_hard_stop(
    satellite: str,
    artifact: str,
    reason: str,
    stop_path: Path,
) -> str:
    """Blocker text for an ALREADY-READ stop record.

    Pure formatter over the fields of :func:`_read_stop_record`. Both callers
    format the record they are already holding, so the message and the raised
    error can never describe two different reads of the same stop file.
    """
    return (
        f"Satellite {satellite} hard-stopped and wrote no {artifact}: "
        f"{reason} (recorded in {stop_path})"
    )


def satellite_hard_stop_message(technical_dir: Path, stop_filename: str) -> str | None:
    """Blocker message for a recorded hard stop, or ``None`` when there is none.

    Names the satellite, the artifact it did not write, its reason, and the
    stop file — everything an operator needs without opening the workspace.
    """
    record = _read_stop_record(technical_dir, stop_filename)
    if record is None:
        return None
    satellite, artifact, reason, stop_path = record
    return _format_satellite_hard_stop(satellite, artifact, reason, stop_path)


def collect_satellite_hard_stops(technical_dir: Path) -> list[str]:
    """Every satellite hard stop recorded under ``technical_dir``.

    Returns blocker messages in :data:`SATELLITE_STOP_FILES` order. Collecting
    both satellites in one pass means a run where both refused reports both,
    instead of the operator fixing one and rediscovering the other.
    """
    messages: list[str] = []
    for stop_filename in SATELLITE_STOP_FILES:
        message = satellite_hard_stop_message(technical_dir, stop_filename)
        if message is not None:
            messages.append(message)
    return messages


def _raise_on_satellite_hard_stop(technical_dir: Path, stop_filename: str) -> None:
    """Backstop for direct loader callers: turn a recorded stop into a raise."""
    record = _read_stop_record(technical_dir, stop_filename)
    if record is None:
        return
    satellite, artifact, reason, stop_path = record
    raise SatelliteHardStopError(
        _format_satellite_hard_stop(satellite, artifact, reason, stop_path),
        satellite=satellite,
        stop_path=stop_path,
        reason=reason,
    )


class HomepageBlockedError(RuntimeError):
    """A fresh homepage-blocked blocker recorded by the homepage pass.

    Raised by :func:`resolve_homepage_gate`; maps to the CLI's dedicated
    homepage-blocked exit code.
    """


class HomepageStatusUnreadableError(RuntimeError):
    """``homepage-pass-status.json`` exists but could not be read.

    Distinct from :class:`HomepageBlockedError` (a decided block) and from an
    ABSENT status file (a decidable "no block recorded"). A corrupt or
    truncated status file is undecidable: the very bytes that would say
    ``{"status": "blocked"}`` are the ones that are unreadable. Treating it as
    "not blocked" lets a concealed block compose and promote at exit 0, so the
    gate fails loudly instead — the CLI turns this into an exit-4 blocker with
    the file named in ``finalize-report.json``.
    """


def _assert_satellite_schema_installed(schema_path: Path) -> None:
    """Fail an install fault BEFORE the satellite-output short-circuit.

    ``load_brand_voice`` / ``load_business_context`` fall back to an empty
    default when the satellite produced no output. An uninstalled satellite
    skill produces no output EITHER — and it also has no schema — so a check
    that only runs once output exists never fires for the most common broken
    install, which then ships an empty brandVoice/businessContext at exit 0
    under a warning that blames the satellite's output. Probing the schema
    first makes "is the satellite installed?" independent of "did it run?".

    ``load_schema`` is ``lru_cache``d, so the probe costs one stat per
    distinct schema path per process.
    """
    load_schema(schema_path)  # raises SchemaLoadError when the install is broken


def _read_text_file(path: Path, *, max_bytes: int = MAX_READ_BYTES) -> str | None:
    if not path.is_file():
        return None
    if path.stat().st_size > max_bytes:
        raise RuntimeError(f"Container file is too large to read safely: {path}")
    return path.read_text(encoding="utf-8")


def _read_json_file(path: Path, *, max_bytes: int = MAX_READ_BYTES) -> dict[str, Any] | None:
    text = _read_text_file(path, max_bytes=max_bytes)
    if not text:
        return None
    return json.loads(text)


def default_brand_voice(languages: Any) -> dict[str, Any]:
    voice = json.loads(json.dumps(DEFAULT_BRAND_VOICE))
    if isinstance(languages, list):
        voice["defaultLanguages"] = [item for item in languages if isinstance(item, str)]
    return voice


def load_brand_voice(
    technical_dir: Path,
    *,
    languages: Any,
    schema_paths: SchemaPaths,
) -> tuple[dict[str, Any], list[str]]:
    warnings: list[str] = []
    voice_path = technical_dir / "brand-voice.json"
    fallback = default_brand_voice(languages)
    # Install check first — see _assert_satellite_schema_installed. It must sit
    # on THIS side of the is_file() short-circuit: an uninstalled tone-of-voice
    # skill has neither schema nor output, so a check reachable only when
    # output exists would let exactly that install compose at exit 0.
    _assert_satellite_schema_installed(schema_paths.brand_voice_schema_path)
    # A recorded hard stop outranks BOTH branches below: the satellite refused
    # to derive, so neither its absent output ("didn't produce") nor a leftover
    # output from an earlier run may be composed. Raising here is the backstop
    # for direct callers; the CLI pre-collects stops so it can report both
    # satellites at once (see collect_satellite_hard_stops).
    _raise_on_satellite_hard_stop(technical_dir, BRAND_VOICE_STOP_FILENAME)
    if not voice_path.is_file():
        warnings.append("Tone-of-voice stage did not produce brand-voice.json; using empty fallback.")
        return fallback, warnings
    try:
        payload = json.loads(voice_path.read_text(encoding="utf-8"))
        if not isinstance(payload, dict):
            raise RuntimeError("brand-voice.json must be an object")
        return validate_brand_voice_payload(payload, schema_paths.brand_voice_schema_path), warnings
    except SchemaLoadError:
        # A missing/unreadable satellite SCHEMA is an installation fault, not
        # invalid satellite output — swallowing it into the empty fallback
        # would silently discard a valid brand-voice.json and send the
        # operator to debug the wrong component. Fail the run loudly instead.
        raise
    except Exception as exc:
        warnings.append(f"Tone-of-voice output was invalid; using empty fallback: {exc}")
        return fallback, warnings


def default_business_context() -> dict[str, Any]:
    return json.loads(json.dumps(DEFAULT_BUSINESS_CONTEXT))


def load_business_context(
    technical_dir: Path,
    *,
    schema_paths: SchemaPaths,
) -> tuple[dict[str, Any], list[str]]:
    warnings: list[str] = []
    context_path = technical_dir / "business-context.json"
    fallback = default_business_context()
    # Install check before the output short-circuit — see load_brand_voice.
    _assert_satellite_schema_installed(schema_paths.business_context_schema_path)
    # Hard stop outranks both branches below — see load_brand_voice.
    _raise_on_satellite_hard_stop(technical_dir, BUSINESS_CONTEXT_STOP_FILENAME)
    if not context_path.is_file():
        warnings.append(
            "Business-context stage did not produce business-context.json; using empty fallback."
        )
        return fallback, warnings
    try:
        payload = json.loads(context_path.read_text(encoding="utf-8"))
        if not isinstance(payload, dict):
            raise RuntimeError("business-context.json must be an object")
        return (
            validate_business_context_payload(payload, schema_paths.business_context_schema_path),
            warnings,
        )
    except SchemaLoadError:
        # Install fault, not satellite output — see load_brand_voice.
        raise
    except Exception as exc:
        warnings.append(f"Business-context output was invalid; using empty fallback: {exc}")
        return fallback, warnings


def load_products(technical_dir: Path) -> list[dict[str, Any]]:
    """Project the probe-authored product-data artifact for embedding in the brandkit.

    Products are demo-only data collected by the homepage pass into
    ``technical/<slug>/product-data.json``. Unlike brandVoice / businessContext
    there is no satellite skill that re-authors them, so they are embedded only
    on the fresh-extraction turn (``compose_final_brandkit``) and carried
    forward untouched on cached / standalone turns (the cached brandkit already
    carries ``brand.products``; ``apply_standalone_satellites`` never touches
    them).

    Best-effort by design — products must never fail or warn an otherwise
    healthy run: ``validate_products_payload`` already never raises and projects
    an absent or malformed artifact to ``[]``, which is schema-valid because the
    field is optional. ANY failure (oversized artifact, JSON error, a validator
    bug, a filesystem error) degrades to ``[]`` rather than aborting the turn.
    """
    try:
        text = _read_text_file(technical_dir / "product-data.json")
        if text is None:
            return []
        projected = validate_products_payload(json.loads(text))
        products = projected.get("products")
        return products if isinstance(products, list) else []
    except Exception:  # noqa: BLE001 — demo-only data must never fail the turn
        return []


# The measurement state the probe records beside every productCard colour
# (`measured` / `transparent` / `unavailable`; see `colorMeasurementState` in
# `references/extraction-stage.schema.json`) exists so the normalize pass can
# tell a colour measured as absent from one never read when it dedupes
# variants. That signature is its only consumer, and it has run by the time
# this composes. The persisted Brand Kit keeps the vocabulary the endpoint
# contract and `references/schema.json` describe, so the states stop here, the
# way `roleProvenance` does and for the same reason: extraction diagnostics are
# not Brand Kit values.
_PRODUCT_CARD_COLOUR_STATE_KEYS: tuple[tuple[str | None, str], ...] = (
    (None, "priceColorState"),
    ("surface", "backgroundColorState"),
    ("cta", "backgroundColorState"),
    ("cta", "fontColorState"),
    ("cta", "borderColorState"),
    ("cta", "hoverBackgroundColorState"),
    ("cta", "hoverFontColorState"),
    ("cta", "hoverBorderColorState"),
)


def _strip_product_card_colour_states(product_cards: Any) -> None:
    if not isinstance(product_cards, list):
        return
    for card in product_cards:
        if not isinstance(card, dict):
            continue
        for parent, key in _PRODUCT_CARD_COLOUR_STATE_KEYS:
            holder = card if parent is None else card.get(parent)
            if isinstance(holder, dict):
                holder.pop(key, None)


def compose_final_brandkit(
    extraction: dict[str, Any],
    brand_voice: dict[str, Any],
    business_context: dict[str, Any],
    products: list[dict[str, Any]],
) -> dict[str, Any]:
    brandkit = json.loads(json.dumps(extraction))
    # ``roleProvenance`` is extraction diagnostics, not a Brand Kit value. It is
    # consumed from brandkit.extraction.json by the gap/warning gates above this
    # compose step. No email customizer reads it from the account, and making it
    # part of the persisted document caused every observed post-#143 save to be
    # rejected by the deployed MCP root-shape contract. Keep the evidence in
    # the technical artifact; do not let optional diagnostics block the usable
    # Brand Kit this run extracted.
    brandkit.pop("roleProvenance", None)
    brand = brandkit.setdefault("brand", {})
    if not isinstance(brand, dict):
        raise RuntimeError("Extraction-stage brand field must be an object")
    components = brand.setdefault("components", {})
    if isinstance(components, dict):
        components.pop("productCardArchetypes", None)
        _strip_product_card_colour_states(components.get("productCard"))
    brand["brandVoice"] = brand_voice
    brand["businessContext"] = business_context
    brand["products"] = products
    return brandkit


def apply_standalone_satellites(
    brandkit: dict[str, Any],
    technical_dir: Path,
    *,
    schema_paths: SchemaPaths,
) -> tuple[bool, list[str]]:
    """Merge a satellite skill's output file onto a cached brandkit.

    NOT WIRED in this runtime: every run here is a fresh extraction, so the
    CLI pipeline never calls this. It is ported and exported (unit-usable)
    for a future caching phase, matching the source repo's
    ``_apply_standalone_satellites``.

    Supports invoking a satellite skill (business-context or tone-of-voice) on
    its own against an already-extracted slug: the agent writes only its single
    intermediate file (no ``brandkit.extraction.json``), and the runtime
    patches that one field onto the cached brandkit instead of recomposing
    from a fresh extraction. Returns ``(applied, warnings)``; ``applied`` is
    False when no satellite file was found (e.g. a plain customise turn),
    leaving the cached brandkit untouched.

    NO FRESHNESS GUARANTEE. ``applied`` means "a satellite file exists at that
    path" and nothing more: a file's presence proves neither WHEN it was
    authored nor WHICH SITE it describes. The only thing that deletes these
    files, ``clear_stale_agent_authored_outputs``, has a single call site — the
    ``prepare`` subcommand, invoked only by the extraction skill's Phase 0 — so
    a standalone satellite turn never clears anything, and thread workspaces
    are bind-mounted across runs and persist for weeks. A months-old
    ``brand-voice.json`` written for a different site therefore reads here
    exactly like one written a second ago. Neither this function nor the
    loaders it calls check mtimes, run ids, or the site the file describes;
    they only schema-validate.

    Establishing freshness is the CALLER's job and must happen before the
    call — e.g. clearing the satellite files at the start of its own turn, or
    checking the file's mtime and claimed site against the cached brandkit.
    Do not read ``applied`` as evidence that the merge is current.
    """
    brand = brandkit.setdefault("brand", {})
    if not isinstance(brand, dict):
        raise RuntimeError("Cached brandkit brand field must be an object")
    applied = False
    warnings: list[str] = []
    if (technical_dir / "business-context.json").is_file():
        business_context, bc_warnings = load_business_context(
            technical_dir, schema_paths=schema_paths
        )
        brand["businessContext"] = business_context
        warnings.extend(bc_warnings)
        applied = True
    if (technical_dir / "brand-voice.json").is_file():
        brand_voice, voice_warnings = load_brand_voice(
            technical_dir,
            languages=brandkit.get("languages"),
            schema_paths=schema_paths,
        )
        if not brand_voice.get("defaultLanguages"):
            # A standalone tone-of-voice run has no fresh extraction artifact
            # to read languages from, so its SKILL.md allows an empty
            # defaultLanguages. Backfill from the cached brandkit's top-level
            # languages so the refresh never downgrades a previously-good
            # value (e.g. ["uk", "ru"] -> []).
            languages = brandkit.get("languages")
            if isinstance(languages, list):
                brand_voice["defaultLanguages"] = [
                    item for item in languages if isinstance(item, str)
                ]
        brand["brandVoice"] = brand_voice
        warnings.extend(voice_warnings)
        applied = True
    return applied, warnings


def observed_asset_urls(technical_dir: Path) -> set[str]:
    """Asset URLs observed by the capture pass, from ``technical/<slug>/capture.json``.

    Feeds the content validators' allowlist so brand-owned CDN assets are not
    flagged as unexpected-domain URLs. Best-effort: any read/parse failure
    degrades to an empty set, exactly like the source ``_observed_asset_urls``.
    """
    try:
        capture = _read_json_file(technical_dir / "capture.json")
    except (OSError, RuntimeError, json.JSONDecodeError):
        return set()
    if not isinstance(capture, dict):
        return set()
    values = capture.get("observedAssetUrls")
    if not isinstance(values, list):
        return set()
    return {
        exact
        for value in values
        if (exact := _exact_public_asset_url(value))
    }


# The block types that say WHY in their own evidence, each with the message
# that says it back. Everything not listed here is the security-interstitial
# arm, which is the only one of the three that actually claims a challenge.
_EVIDENCE_LED_BLOCKER_MESSAGES = {
    LANDED_DOCUMENT_ERROR_BLOCKER_TYPE: HOMEPAGE_LANDED_DOCUMENT_ERROR_BLOCKER,
    BLANK_RENDER_BLOCKER_TYPE: HOMEPAGE_BLANK_RENDER_BLOCKER,
}


def _named_blocker_provider(blocker: object) -> str:
    """The provider label a blocker carries, or ``""`` when it names nobody.

    ``detectSecurityInterstitial`` writes ``"unknown"`` when it blocked but no
    provider rule matched, so the string is present far more often than a
    provider is. Rendering it printed ``(unknown)`` at the operator.

    The label is returned STRIPPED, because the same ``.strip()`` already
    decides whether it names anybody: a provider of ``"  cloudflare  "`` was
    judged as ``cloudflare`` and then printed with its padding, inside
    parentheses, at the operator.
    """
    if not isinstance(blocker, dict):
        return ""
    provider = blocker.get("provider")
    if not isinstance(provider, str) or provider.strip().lower() in ("", "unknown"):
        return ""
    return provider.strip()


def homepage_blocked_error(technical_dir: Path) -> str | None:
    """Blocker message the homepage pass earns, or ``None`` if it composes.

    Two conditions, in order: a RECORDED BLOCK (``status: "blocked"`` or the
    interstitial flag — including a blank render, which the producer routes
    here as a block), and a ``failed`` pass that captured NO EVIDENCE AT ALL
    (:func:`homepage_status_failed_without_evidence`). Every other status,
    ``failed`` with any evidence included, composes as before.

    A recorded block says WHY in ``blocker.type``, and the message says it
    back: a landed document outside 2xx is not a security interstitial, and
    the operator reading this line is the one person the distinction is for.

    An ABSENT status file means "no block recorded" and returns ``None``. An
    UNREADABLE one raises :class:`HomepageStatusUnreadableError` — see that
    class for why a corrupt gate input may not degrade to a pass. (An
    oversized file already raises from :func:`_read_json_file` with the path in
    its message; both land on the CLI's exit-1 report.)
    """
    status_path = technical_dir / "homepage-pass-status.json"
    try:
        status = _read_json_file(status_path)
    except (OSError, ValueError) as exc:
        # ValueError covers json.JSONDecodeError AND UnicodeDecodeError: a
        # truncated write from a killed probe can leave invalid UTF-8 in the
        # status file — precisely the case where the concealed content could
        # be {"status": "blocked"}.
        raise HomepageStatusUnreadableError(
            f"Homepage gate cannot read {status_path}: "
            f"{exc.__class__.__name__}: {exc}. A truncated or corrupt status "
            "file may be concealing a recorded homepage block, so the gate "
            "fails closed instead of composing."
        ) from exc
    if status is not None and not isinstance(status, dict):
        raise HomepageStatusUnreadableError(
            f"Homepage gate requires {status_path} to be a JSON object. "
            "A wrong-shaped status may be concealing a recorded homepage block, "
            "so the gate fails closed instead of composing."
        )
    if homepage_status_indicates_blocked(status):
        blocker = status.get("blocker") if isinstance(status, dict) else None
        blocker_type = blocker.get("type") if isinstance(blocker, dict) else None
        # `isinstance` before the lookup, because a dict membership test HASHES
        # its key while the `==` this replaced did not: a status file whose
        # `blocker.type` is a JSON array or object raised `TypeError:
        # unhashable type` out of the gate, and the run that would have exited
        # 3 with a named blocker exited 1 with `status: error` and an EMPTY
        # blocker list. A wrong-shaped gate input is the one this file is least
        # allowed to crash on -- it is exactly what a truncated or hand-edited
        # artifact looks like, and the operator loses the block entirely.
        if isinstance(blocker_type, str) and blocker_type in _EVIDENCE_LED_BLOCKER_MESSAGES:
            # The producer's evidence line already names what it saw, and that
            # is the whole diagnostic: an operator who is told "HTTP 404 for
            # https://example.test/and/", or that the document came back empty,
            # can act on it, while one told "security interstitial" goes
            # looking for a wall. Same flatten-and-cap treatment as the `failed`
            # arm below, because a blocker is rendered one per line and pasted
            # that way.
            #
            # BOTH non-interstitial block types take this arm. A blank render
            # is not a challenge either -- nothing matched a provider rule --
            # and it reached the interstitial wording only because it is the
            # arm everything that is not a landed-document error falls into.
            evidence = blocker.get("evidence") if isinstance(blocker, dict) else None
            lines = evidence if isinstance(evidence, list) else []
            first = next((line for line in lines if isinstance(line, str) and line.strip()), "")
            flat = re.sub(r"\s+", " ", first).strip()
            # The PROVIDER still travels, because routing these two types away
            # from the interstitial arm dropped the one fact that arm carried.
            # A blank render reaches the detector with zero live evidence, so
            # a provider on it can only have come from an edge RESOURCE the
            # page requested -- a `cdn-cgi/challenge-platform` script, an
            # Incapsula resource. That is worth telling an operator staring at
            # an empty document. `"unknown"` is not: it is the detector's word
            # for "no rule matched", and printing it was the other half of
            # what made the old line useless.
            provider = _named_blocker_provider(blocker)
            detail = "; ".join(part for part in (flat[:180], provider) if part)
            suffix = f" ({detail})" if detail else ""
            return f"{_EVIDENCE_LED_BLOCKER_MESSAGES[blocker_type]}{suffix}"
        provider = _named_blocker_provider(blocker)
        suffix = f" ({provider})" if provider else ""
        return f"{TECHNICAL_HOMEPAGE_BLOCKED_BLOCKER}{suffix}"
    # A `failed` pass is not a recorded block, so nothing above catches it --
    # and until this arm existed it composed and PROMOTED a kit built from
    # zero evidence, replacing the customer's Brand Kit with nothing. Refusing
    # is scoped to exactly that: no probe wrote a row and no logo candidate
    # exists. Any evidence at all -- one colour, one typography row, one logo
    # candidate -- still promotes, with the incomplete-pass warning.
    if homepage_status_failed_without_evidence(status, technical_dir):
        # The pass's own `error` is the one diagnostic here, but it is raw
        # driver output: a Playwright timeout carries a multi-line call log and
        # ANSI escapes. A blocker is rendered ONE PER LINE in
        # finalize-report.json and pasted that way by the agent, so it is
        # flattened to a single line and capped rather than dropped.
        error = status.get("error") if isinstance(status, dict) else None
        suffix = ""
        if isinstance(error, str) and error.strip():
            flat = re.sub(r"\s+", " ", re.sub(r"\x1b?\[\d*m", "", error)).strip()
            suffix = f" ({flat[:180]})"
        return f"{HOMEPAGE_FAILED_WITHOUT_EVIDENCE_BLOCKER}{suffix}"
    return None


def resolve_homepage_gate(technical_dir: Path) -> None:
    """Homepage-blocked gate, simplified for this runtime.

    The source ``_resolve_homepage_gate`` arbitrates a five-step precedence
    (fresh extraction / satellite-only turn / customise reconcile against a
    cached brandkit). In this runtime every run is a fresh extraction, which
    is precedence step 2 — "the agent just browsed and was blocked; the
    blocker is fatal" — so a blocker recorded in
    ``technical/<slug>/homepage-pass-status.json`` always raises. The
    satellite-only and cached-brandkit recovery branches are intentionally
    dropped until a caching phase exists (at which point
    :func:`apply_standalone_satellites` gets wired in alongside them).

    Raises :class:`HomepageBlockedError` on a recorded blocker or on a
    ``failed`` pass that captured no evidence at all, and
    :class:`HomepageStatusUnreadableError` when the status file exists but
    cannot be read (an undecidable gate never passes — see
    :func:`homepage_blocked_error`).
    """
    blocked_error = homepage_blocked_error(technical_dir)
    if blocked_error:
        raise HomepageBlockedError(blocked_error)

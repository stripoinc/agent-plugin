"""CLI entry point for the vendored brandkit finalization gauntlet.

Usage::

    python <skill-root>/scripts/finalize.py prepare --technical-dir <dir>
    python <skill-root>/scripts/finalize.py run \
        --technical-dir <dir> --skill-root <dir> --url <url> \
        --slug <slug> --out-dir <dir>

``prepare`` clears stale per-run probe and agent intermediates before an agent run and
prints ``{"cleared": [...], "failures": [...]}``. It exits 0 only when
``failures`` is empty: a stale file it could not remove — most importantly a
satellite stop file, which the reader honours on presence alone — would
otherwise be reported as a clean preparation and then block every later run of
this slug at exit 4 with a reason from a run that is long over.

``run`` executes the deterministic post-agent pipeline (mirroring the source
repo's ``_finalize_fresh_extraction``): stale-normalize recovery check →
normalize → validate extraction stage → satellite hard-stop gate → load
satellites → compose → locally sanitize/prepare the primary logo → validate
the composed brandkit IN MEMORY → stage ``brandkit.json`` → JS skill
validators (with Python fallback) over the STAGED json → preflight blocker
gate → finalizer-owned logo hosting → exact hosted-URL validation through the
same JS/Python paths → render ``brandkit.html`` → write the finished
``finalize-report.json`` to a temp file → promote the staged pair → rename the
report into place.

The report is written BEFORE the promotion and only renamed after it, so the
one step that follows the irreversible one allocates nothing. A full
filesystem therefore fails while the out-dir is still untouched, instead of
promoting a pair and then leaving a 0-byte report behind exit 1.

Concurrent ``run`` invocations against one ``--out-dir`` are **refused**: the
first takes an exclusive advisory lock (``.brandkit-finalize.lock``) and any
second one exits 1 immediately, having written nothing at all — no staging, no
promotion, and no report to contradict the owner's. See
:func:`_acquire_out_dir_lock`.

Promotion is the last IRREVERSIBLE step (only the report's rename follows it)
and happens only on a clean outcome. Every non-clean OUTCOME — i.e. every run
that reaches an exit code: validation failure, homepage block, blockers
(including a satellite hard stop), internal error, or an unwritable report —
leaves a previously-good ``brandkit.json``/``brandkit.html`` pair in the
persistent out-dir byte-identical. The pair is promoted together (see
:func:`_promote_pair`), so no failure this CLI can observe leaves a new
``brandkit.json`` beside a stale or destroyed ``brandkit.html``.

The one thing that is NOT an outcome is a process death: ``SIGKILL`` (or
anything else that runs no handler) between :func:`_promote_pair`'s two
renames leaves the new ``brandkit.html`` beside the previous
``brandkit.json`` and writes no report at all. That order is deliberate — it
is why the html is replaced first — and "no ``finalize-report.json`` for this
run" is its only signal. ``KeyboardInterrupt``/``SystemExit`` ARE handled:
they roll the promotion back, unless the final rename had already completed —
in which case both files advanced, i.e. a full promotion (no report either
way).

``finalize-report.json`` schema::

    status            "composed" | "homepage-blocked" | "blocked" | "error"
    promoted          bool  — did THIS run write brandkit.json/brandkit.html?
    brandkit_sha256   sha256 of the brandkit.json THIS run promoted, else null
    blockers          list[str]
    warnings          list[str]
    timings_ms        dict[str, int]  (always carries "total")
    logo_hosting      finalizer-owned audit outcome; never URL authorization
    error             str, present only when status == "error"

``timings_ms`` is diagnostic only. On a composed run it normally carries a
``promote`` entry; when the filesystem had no room for the refreshed copy the
report that lands is the one reserved before the promotion, which has no
``promote`` entry and a ``total`` measured just before it (see
``land_reserved_report``).

``promoted: false`` (always paired with ``brandkit_sha256: null``) means this
run wrote no artifacts — it does NOT mean the out-dir is empty: any pair from
an earlier successful run is still there, unchanged by this run.

Exit codes: 0 composed, 3 homepage-blocked, 4 blockers present (technical
artifact blockers, or a satellite that recorded a hard stop — see
:data:`~.compose.SATELLITE_STOP_FILES`), 1 internal error, 64 usage error
(malformed invocation / unknown subcommand; argparse's default exit 2 is
remapped so it can never collide with an outcome code). ``prepare`` uses the
same 0 / 1 / 64 codes: 1 means at least one stale artifact survived, named in
the ``failures`` list it prints.

**A non-zero exit always means this run promoted nothing.** ``finalize-report.json``
is written for every outcome and states it (``promoted``/``brandkit_sha256``).
Two exceptions write no report and emit one structured JSON line on stderr
instead — ``{"status": "error", "report_written": false, "promoted": <bool>,
"out_dir": ..., "error": ...}``:

* an out-dir so broken the report cannot be written at all;
* a run refused because another finalize run owns the out-dir — it writes no
  report BY DESIGN, so a refused duplicate cannot overwrite the owning run's
  report with a contradictory one.

That line's ``promoted`` is authoritative, and it is ``false`` in every case
the pipeline can foresee, because the report is fully written to disk before
the promotion (a run can no longer promote and then exit 1 claiming
otherwise).
"""

from __future__ import annotations

import argparse
import hashlib
import json
import logging
import os
import shutil
import subprocess
import sys
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import IO, Any

try:  # POSIX only; the runtime is Linux/macOS. See _acquire_out_dir_lock.
    import fcntl
except ImportError:  # pragma: no cover - non-POSIX
    fcntl = None  # type: ignore[assignment]

from .compose import (
    HomepageBlockedError,
    HomepageStatusUnreadableError,
    SatelliteHardStopError,
    collect_satellite_hard_stops,
    compose_final_brandkit,
    load_brand_voice,
    load_business_context,
    load_products,
    observed_asset_urls,
    resolve_homepage_gate,
)
from . import logo_hosting as logo_hosting_module
from . import report_lines as report_lines_module
from . import site_match as site_match_module
from . import wait as wait_module
from .stale import clear_stale_agent_authored_outputs
from .logo_hosting import (
    LogoHostingResult,
    apply_same_mark_fallback,
    host_primary_logo,
    prepare_primary_logo,
    reconcile_logo_markup,
)
from .validation import (
    ROLE_COVERAGE_RECHECK_UNAVAILABLE_WARNING,
    LogoAssetEvidence,
    SchemaPaths,
    TechnicalArtifactUnreadableError,
    detect_brandkit_content_blockers,
    detect_technical_artifact_blockers,
    load_logo_asset_evidence,
    logo_svg_safety_blockers,
    normalize_extraction_stage_file,
    product_card_variant_index_gaps,
    reconcile_contacts,
    reconcile_socials,
    role_coverage_gap_warnings,
    role_coverage_gaps,
    role_coverage_recheck_is_mandatory,
    role_coverage_stale_artifact_blocker,
    stale_normalize_recovery_warnings,
    validate_brandkit_against_technical_artifacts,
    validate_brandkit_content,
    validate_brandkit_payload,
    validate_extraction_stage_file,
    write_refusal_gate_warnings,
)

logger = logging.getLogger(__name__)

SUBPROCESS_TIMEOUT_SECONDS = 60.0

# Staging area for the brandkit.json/brandkit.html pair: a UNIQUELY NAMED
# directory created under --out-dir on every run and removed in a finally.
# This constant is the shared PREFIX, not the directory itself — every run
# stages into `<prefix>.<random>` (see _create_staging_dir). The dotted prefix
# is owned by this module, so anything found under it is a leftover from a
# crashed run and may be swept; the promotion DESTINATIONS are never cleared.
STAGING_DIR_NAME = ".brandkit-finalize.staging"
PREVIOUS_HTML_BACKUP_NAME = "brandkit.html.previous"

# A staging entry younger than this is NOT swept: it may belong to a live peer
# rather than to a crashed run. The out-dir lock already makes a live peer
# impossible (see _acquire_out_dir_lock), so this is the second line of
# defence, for the platforms/paths where the lock cannot be taken. The budget
# is generous on purpose: the longest gap between two writes into a staging
# dir is the JS validator subprocess (SUBPROCESS_TIMEOUT_SECONDS), and the
# only cost of waiting is that litter from a crashed run is collected one turn
# later than it used to be.
STAGING_LEFTOVER_MIN_AGE_SECONDS = 300.0

REPORT_FILENAME = "finalize-report.json"
# The report is written to a temp file BESIDE its destination and renamed into
# place, so the only step after the irreversible promotion is an os.replace.
# The name is unique per run (not the fixed `.finalize-report.tmp`) so two
# runs racing on one out-dir cannot interleave writes into one buffer file.
REPORT_TMP_PREFIX = ".finalize-report."
REPORT_TMP_SUFFIX = ".tmp"

# Exclusive advisory lock (flock) for one --out-dir. Held for the whole `run`
# and released when the process exits, so a crashed run leaves no stale lock —
# only an empty file, which is never swept (it does not carry STAGING_DIR_NAME).
OUT_DIR_LOCK_NAME = ".brandkit-finalize.lock"

# Exit-code contract (also documented in the module docstring above and in the
# extraction skill's SKILL.md Stop matrix — keep the three in sync):
#   0  composed
#   3  homepage-blocked
#   4  blockers present
#   1  internal error (finalize-report.json written whenever possible)
#   64 usage error (argparse's exit 2 is remapped in main(); 2 must never be
#      an outcome code, so a malformed invocation can't read as "blockers")
EXIT_COMPOSED = 0
EXIT_ERROR = 1
EXIT_HOMEPAGE_BLOCKED = 3
EXIT_BLOCKERS = 4
EXIT_USAGE = 64

# `wait`-only codes. They start at 10 so they can never collide with a
# pipeline outcome: an agent that polls and then finalizes reads both.
#   10 still running when the (clamped) --timeout-ms elapsed (call again)
#   11 stale: the pass stopped advancing (rerun homepage-pass.js once)
#   12 no readable status file after the start-up grace window
EXIT_WAIT_TIMEOUT = 10
EXIT_WAIT_STALE = 11
EXIT_WAIT_MISSING = 12

WAIT_EXIT_CODES: dict[str, int] = {
    "completed": EXIT_COMPOSED,
    "blocked": EXIT_HOMEPAGE_BLOCKED,
    "failed": EXIT_ERROR,
    "running": EXIT_WAIT_TIMEOUT,
    "stale": EXIT_WAIT_STALE,
    "missing": EXIT_WAIT_MISSING,
}

STATUS_COMPOSED = "composed"
STATUS_ERROR = "error"
STATUS_BLOCKED = "blocked"
STATUS_HOMEPAGE_BLOCKED = "homepage-blocked"


def _render_brandkit_html(skill_root: Path, brandkit_path: Path, html_path: Path) -> None:
    """Render brandkit.html via the skill's node renderer (60s timeout).

    Synchronous port of the source ``_render_brandkit_html``; same flags,
    timeout, and error surface. The rendered page is written to ``html_path``
    and never returned: the only caller promotes the FILE, so reading the
    whole page back just to discard it was pure I/O.
    """
    script = skill_root / "scripts" / "render-brand-kit-html.js"
    if not script.is_file():
        raise RuntimeError(f"Missing render script: {script}")
    try:
        process = subprocess.run(
            [
                "node",
                str(script),
                "--json-file",
                str(brandkit_path),
                "--html-file",
                str(html_path),
            ],
            capture_output=True,
            timeout=SUBPROCESS_TIMEOUT_SECONDS,
        )
    except subprocess.TimeoutExpired:
        raise RuntimeError("brandkit HTML render timed out after 60s") from None
    if process.returncode != 0:
        message = process.stderr.decode("utf-8", errors="ignore").strip() or process.stdout.decode(
            "utf-8",
            errors="ignore",
        ).strip()
        raise RuntimeError(message or "Failed to render brandkit HTML")


def _run_js_skill_validators(
    skill_root: Path,
    brandkit_path: Path,
    technical_dir: Path,
    target_url: str,
    observed_urls: set[str] | None,
    runtime_asset_bindings: set[tuple[str, str]] | None = None,
    logo_evidence: LogoAssetEvidence | None = None,
) -> dict[str, Any] | None:
    """Invoke the skill-side JS validator orchestrator (validate-skill-output.js).

    Returns the parsed, shape-checked result dict on success, or None on
    subprocess failure or a malformed result.
    The caller falls back to the Python validators when this returns None,
    keeping standalone-runtime behavior safe during the JS-port transition.
    Synchronous port of the source ``_run_js_skill_validators``.

    NONE IS "NO VERDICT", NOT "NO FINDINGS", and every branch below returns it
    for that reason: a missing script, a missing or unrunnable ``node``, a
    timeout, empty stdout, unparseable stdout, a malformed result, an exit code
    outside ``(0, 1)``. The caller must not read any of them as a clean bill of
    health — see :func:`_collect_validator_findings`, which independently
    checks the shape, retains the Python factual/artifact blockers, and records
    an explicit warning when the late JS styling re-check produced no verdict.
    """
    script = skill_root / "scripts" / "validate-skill-output.js"
    if not script.is_file():
        return None
    cmd: list[str] = [
        "node",
        str(script),
        "--input",
        str(brandkit_path),
        "--technical-dir",
        str(technical_dir),
        "--target-url",
        target_url,
    ]
    if observed_urls is not None:
        cmd.extend(["--observed-asset-urls", json.dumps(sorted(observed_urls))])
    if logo_evidence is not None:
        try:
            final_brandkit_for_packet = json.loads(
                brandkit_path.read_text(encoding="utf-8")
            )
        except (OSError, json.JSONDecodeError, UnicodeError):
            return None
        # This is an internal finalizer bridge only: the public `run` command
        # has no option that lets a caller supply persistence authority. The
        # Python URL verdicts are computed from the same staged JSON file that
        # this subprocess validates, then consumed by JS by exact URL key only.
        cmd.extend(
            [
                "--logo-evidence-packet",
                json.dumps(
                    logo_evidence.to_json_payload(
                        final_brandkit=final_brandkit_for_packet
                    ),
                    sort_keys=True,
                ),
            ]
        )
    if runtime_asset_bindings:
        cmd.extend(
            ["--runtime-asset-bindings", json.dumps(sorted(runtime_asset_bindings))]
        )
    try:
        process = subprocess.run(cmd, capture_output=True, timeout=SUBPROCESS_TIMEOUT_SECONDS)
    except (subprocess.TimeoutExpired, FileNotFoundError, OSError):
        return None
    if not process.stdout:
        return None
    try:
        result = json.loads(process.stdout.decode("utf-8", errors="replace"))
    except json.JSONDecodeError:
        return None
    if not _is_valid_js_validator_result(result):
        return None
    expected_returncode = 0 if result["valid"] else 1
    if process.returncode != expected_returncode:
        # Exit code 0 = clean and 1 = errors/blockers. A mismatch or any other
        # code means the orchestrator response is not a coherent verdict.
        return None
    return result


_JS_VALIDATOR_RESULT_KEYS = frozenset({"valid", "errors", "warnings", "blockers"})


def _is_valid_js_validator_result(result: object) -> bool:
    """Return whether *result* is the validator's exact closed wire shape.

    A partial object is not a partial verdict: accepting ``{}`` or a scalar
    channel as an empty finding list would skip the Python hard-factual
    fallback. ``valid`` must also agree with the fatal channels so a
    contradictory payload cannot masquerade as a clean validator response.
    """
    if not isinstance(result, dict) or set(result) != _JS_VALIDATOR_RESULT_KEYS:
        return False
    if type(result["valid"]) is not bool:
        return False
    for channel in ("errors", "warnings", "blockers"):
        values = result[channel]
        if not isinstance(values, list) or not all(
            isinstance(value, str) for value in values
        ):
            return False
    expected_valid = not result["errors"] and not result["blockers"]
    return result["valid"] is expected_valid


def _reconcile_role_provenance(skill_root: Path, technical_dir: Path) -> list[str]:
    """Repair stale styling provenance before composing the staged outputs.

    The JS module owns the evidence derivation. Running it here, before the
    extraction is loaded and composed, ensures finalize's gaps and warnings use
    current technical grades. The map is omitted from the account-facing Brand
    Kit. If the JS runtime/helper itself is unavailable, remove the optional map
    from the technical artifact instead: retaining no provenance is safer than
    retaining a stale positive claim, and styling uncertainty must not turn
    into a promotion blocker.
    """
    extraction_path = technical_dir / "brandkit.extraction.json"

    def strip_unverifiable_map(reason: str) -> list[str]:
        try:
            payload = json.loads(extraction_path.read_text(encoding="utf-8"))
        except (OSError, json.JSONDecodeError) as exc:
            raise RuntimeError(
                "Could not inspect unverifiable roleProvenance in "
                f"{extraction_path}: {exc.__class__.__name__}: {exc}. "
                "Finalization stopped before publication because the artifact "
                "could not be safely stripped."
            ) from exc
        if not isinstance(payload, dict) or "roleProvenance" not in payload:
            return [
                "Styling role provenance could not be re-derived because "
                f"{reason}; no optional roleProvenance map was present, so no "
                "unverifiable positive provenance claim can be published."
            ]
        del payload["roleProvenance"]
        try:
            extraction_path.write_text(
                json.dumps(payload, ensure_ascii=False, indent=2) + "\n",
                encoding="utf-8",
            )
        except OSError as exc:
            raise RuntimeError(
                "Could not remove unverifiable roleProvenance from "
                f"{extraction_path}: {exc.__class__.__name__}: {exc}. "
                "Finalization stopped before publication because the "
                "stale positive provenance claims are still present."
            ) from exc
        return [
            "Styling role provenance could not be re-derived because "
            f"{reason}; the optional roleProvenance map was removed before "
            "publication instead of retaining stale positive claims."
        ]

    script = skill_root / "scripts" / "reconcile-role-provenance.js"
    if not script.is_file():
        return strip_unverifiable_map("the packaged reconciliation helper is unavailable")
    try:
        process = subprocess.run(
            ["node", str(script), "--technical-dir", str(technical_dir)],
            capture_output=True,
            timeout=SUBPROCESS_TIMEOUT_SECONDS,
        )
    except (subprocess.TimeoutExpired, FileNotFoundError, OSError):
        return strip_unverifiable_map("the Node reconciliation helper could not run")
    if process.returncode not in (0, 1) or not process.stdout:
        return strip_unverifiable_map("the Node reconciliation helper returned no usable result")
    try:
        result = json.loads(process.stdout.decode("utf-8", errors="replace"))
    except json.JSONDecodeError:
        return strip_unverifiable_map("the Node reconciliation helper returned invalid JSON")
    if not isinstance(result, dict):
        return strip_unverifiable_map("the Node reconciliation helper returned an invalid result")
    values = result.get("warnings")
    return [value for value in values if isinstance(value, str)] if isinstance(values, list) else []


class ReportWriteError(RuntimeError):
    """``finalize-report.json`` itself could not be written.

    Every other failure mode in this CLI is reported THROUGH the report file,
    so this is the one class of failure the report cannot describe: the
    out-dir is unwritable (``chmod 000``), ``--out-dir`` names an existing
    regular file, the report path is occupied by a directory, or the
    filesystem is full. It is raised out of :func:`_run_pipeline` — including
    out of its own ``except`` block — and handled once in :func:`_cmd_run`,
    which emits a single structured JSON line on stderr instead of a
    traceback.

    ``promoted`` says whether the pair had ALREADY been promoted when the
    report write failed. It is normally False — the finished report is written
    to a temp file beside its destination BEFORE the promotion (see
    ``reserve_report``), so every "cannot write the report" failure that
    involves allocating anything lands while the out-dir is still untouched.
    The residual case is the out-dir changing shape between that write and the
    rename; the stderr line then carries ``"promoted": true`` explicitly
    rather than letting the agent read exit 1 as "nothing was promoted".
    """

    def __init__(self, message: str, *, promoted: bool = False) -> None:
        super().__init__(message)
        self.promoted = promoted


class PromotionError(RuntimeError):
    """The staged pair could not be promoted, and nothing was promoted.

    Carries a message naming the offending path. Raised only from
    :func:`_promote_pair`, whose contract is all-or-nothing.
    """


class OutDirBusyError(RuntimeError):
    """Another finalize run owns this ``--out-dir``; this one did nothing.

    Concurrent ``run`` invocations against one out-dir are **refused, not
    supported** — see :func:`_acquire_out_dir_lock` for why, and
    :func:`_cmd_run` for how it is reported (the same single structured stderr
    line as an unwritable out-dir, exit 1, no report written).
    """


def _unlink_quietly(path: Path) -> None:
    """Remove ``path`` if it is there; never raise. For temp-file cleanup."""
    try:
        path.unlink(missing_ok=True)
    except OSError:  # pragma: no cover - unwritable dir; the caller is failing anyway
        pass


def _read_lock_owner(handle: IO[str]) -> str:
    """Describe the run holding the lock, from the JSON it wrote. Never raises."""
    try:
        handle.seek(0)
        payload = json.loads(handle.read() or "{}")
    except (OSError, ValueError):
        return "another finalize run"
    if not isinstance(payload, dict):
        return "another finalize run"
    pid = payload.get("pid")
    started = payload.get("started_at")
    if isinstance(pid, int) and isinstance(started, str):
        return f"another finalize run (pid {pid}, started {started})"
    if isinstance(pid, int):
        return f"another finalize run (pid {pid})"
    return "another finalize run"


def _acquire_out_dir_lock(out_dir: Path) -> IO[str] | None:
    """Take the exclusive advisory lock on ``out_dir``, or refuse the run.

    **Concurrent runs against one out-dir are REFUSED.** Making them safe is
    not achievable in this shape and would not be worth it if it were: the
    out-dir has exactly one ``brandkit.json``/``brandkit.html`` pair and one
    ``finalize-report.json``, so two runs finishing at once necessarily leave
    one report describing the other run's pair. The runtime invokes this CLI
    once per turn per slug, so a second concurrent run is a duplicate, and the
    honest outcome for a duplicate is to do nothing and say so.

    What that buys, against the round-4 repro (two real runs, B's sweep
    ``rmtree``d A's live staging, A died, and the out-dir ended with a freshly
    promoted pair beside a report asserting nothing was promoted): the loser
    never sweeps, never stages, never promotes and — critically — **never
    writes a report**, so it cannot contradict the winner's. It exits 1 with
    one structured stderr line naming the owner.

    Returns the open lock file, which the caller must keep open for the whole
    run (closing it, or the process exiting, releases the lock — so a crashed
    run leaves no stale lock, only an empty file).

    Returns ``None`` — locking unavailable, run anyway — in exactly two cases:
    no ``fcntl`` (non-POSIX), or the lock file cannot be created at all (a
    missing/unwritable out-dir, or ``--out-dir`` naming a regular file). The
    second is deliberately NOT reported here: those out-dirs have their own
    failure, reported through the pipeline exactly as before, and a lock is
    not the place to re-diagnose them. :func:`_sweep_staging_leftovers` carries
    its own age guard for that residue.

    Raises :class:`OutDirBusyError` when another process holds the lock.
    """
    if fcntl is None:  # pragma: no cover - POSIX-only runtime
        return None
    try:
        out_dir.mkdir(parents=True, exist_ok=True)
        handle = (out_dir / OUT_DIR_LOCK_NAME).open("a+", encoding="utf-8")
    except OSError:
        return None
    try:
        fcntl.flock(handle.fileno(), fcntl.LOCK_EX | fcntl.LOCK_NB)
    except OSError as exc:
        owner = _read_lock_owner(handle)
        handle.close()
        raise OutDirBusyError(
            f"{owner} holds {out_dir / OUT_DIR_LOCK_NAME} "
            f"({exc.__class__.__name__}: {exc}). Concurrent finalize runs "
            "against one --out-dir are refused: they share one brandkit pair "
            "and one finalize-report.json, so the second run would corrupt "
            "the first's outcome. Nothing was promoted and no report was "
            "written by this run — the owning run's report is intact. Re-run "
            "after it finishes."
        ) from exc
    try:
        handle.seek(0)
        handle.truncate()
        handle.write(
            json.dumps(
                {
                    "pid": os.getpid(),
                    "started_at": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
                }
            )
            + "\n"
        )
        handle.flush()
    except OSError:  # pragma: no cover - diagnostics only; the lock is held
        pass
    return handle


def _write_report_tmp(out_dir: Path, text: str) -> Path:
    """Write ``text`` to a fresh temp file in ``out_dir``; return its path.

    Beside the destination (same filesystem) so landing it is a rename. The
    bytes are written and flushed here, so this — not a zero-byte probe — is
    where "the report does not fit" (``ENOSPC``) surfaces.
    """
    fd, name = tempfile.mkstemp(prefix=REPORT_TMP_PREFIX, suffix=REPORT_TMP_SUFFIX, dir=out_dir)
    tmp_path = Path(name)
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as handle:
            handle.write(text)
    except BaseException:
        _unlink_quietly(tmp_path)
        raise
    return tmp_path


def _sweep_staging_leftovers(out_dir: Path) -> list[str]:
    """Best-effort removal of staging dirs left by crashed earlier runs.

    Returns a warning per leftover that resisted deletion. A leftover is
    litter, never an obstacle — this run stages somewhere else — so a failed
    sweep may not fail the run; it only has to be VISIBLE, with the path and
    the remedy, or the out-dir silently accumulates undeletable directories.

    **A leftover is only litter once nobody is using it.** Round-4 finding:
    two real runs against one out-dir, and the second one's sweep ``rmtree``d
    the FIRST one's live staging dir — the peer then died with an ENOENT
    naming its own staging path, and (depending on which finished last) left
    an ``status: error / promoted: false`` report beside a pair the winner had
    just promoted. Unique per-run names do not help: the sweep is what
    destroys the peer. Two guards now:

    1. ``run`` holds an exclusive lock on the out-dir for its whole duration
       (:func:`_acquire_out_dir_lock`), so a second run refuses before it ever
       reaches this function — no live peer can exist to sweep.
    2. This function additionally skips entries modified within
       :data:`STAGING_LEFTOVER_MIN_AGE_SECONDS`, so it is safe on its own
       terms even where the lock could not be taken (no ``fcntl``, or an
       out-dir the lock file cannot be created in).
    """
    warnings: list[str] = []
    try:
        entries = sorted(out_dir.iterdir())
    except OSError:
        # Nothing to sweep that we can see; the real failure surfaces when
        # this run creates its own staging dir.
        return warnings
    cutoff = time.time() - STAGING_LEFTOVER_MIN_AGE_SECONDS
    for entry in entries:
        if not entry.name.startswith(STAGING_DIR_NAME):
            continue
        try:
            # lstat: a symlink's own timestamp, not its target's.
            recent = entry.lstat().st_mtime > cutoff
        except OSError:
            # Vanished (or unreadable) under us: nothing this run can sweep,
            # and nothing it should warn about.
            continue
        if recent:
            # Too young to be litter — it may be a live peer's staging dir,
            # and destroying that kills a healthy run. Not a warning either:
            # on the normal path this is somebody's working directory.
            continue
        if entry.is_dir() and not entry.is_symlink():
            shutil.rmtree(entry, ignore_errors=True)
        else:
            try:
                entry.unlink()
            except OSError:
                pass
        if entry.exists() or entry.is_symlink():
            warnings.append(
                f"Could not remove a leftover finalize staging entry at {entry}. "
                "It is inert — this run staged in its own directory and is "
                "unaffected — but it will not clear itself. Remove it with: "
                f"chflags -R nouchg {entry} 2>/dev/null; chmod -R u+w {entry}; "
                f"rm -rf {entry}"
            )
    return warnings


def _create_staging_dir(out_dir: Path) -> tuple[Path, list[str]]:
    """Create this run's staging dir under ``out_dir``; return it + warnings.

    Every run gets its OWN directory (``STAGING_DIR_NAME`` + a random suffix,
    via ``tempfile.mkdtemp``) instead of one shared path, because the shared
    path was a single point of PERMANENT failure. ``rmtree(ignore_errors=True)``
    followed by ``mkdir`` meant one undeletable leftover — e.g. a file carrying
    a BSD ``uchg`` flag, which ``shutil.copy2`` used to propagate onto the
    rollback copy — silently survived the reset and then made every LATER run,
    including a perfectly clean one, die with a bare ``FileExistsError`` naming
    a dotted internal directory, until a human ran chflags/chmod by hand. With
    a unique name per run, a poisoned leftover cannot collide with anything:
    one bad run can litter the out-dir but can no longer disable it.
    """
    warnings = _sweep_staging_leftovers(out_dir)
    staging_dir = Path(tempfile.mkdtemp(prefix=f"{STAGING_DIR_NAME}.", dir=out_dir))
    return staging_dir, warnings


def _promote_pair(
    staged_json: Path,
    staged_html: Path,
    brandkit_path: Path,
    html_path: Path,
    *,
    staging_dir: Path,
) -> None:
    """Promote the staged brandkit.json/brandkit.html pair, or promote neither.

    Two independent ``os.replace`` calls are not atomic as a unit, so this
    function constrains every way either of them can fail:

    1. **Pre-flight.** A destination that exists but is not a regular file
       (leftover artifact directory, mount point, fifo) can only fail mid-
       promotion — ``os.replace`` onto a directory raises ``IsADirectoryError``.
       Both destinations are checked BEFORE anything moves, so that case
       aborts with nothing promoted and a message naming the path, not a
       traceback.
    2. **Ordering.** ``brandkit.html`` is replaced first and ``brandkit.json``
       LAST. The forbidden torn state is a new ``brandkit.json`` beside a
       stale or destroyed ``brandkit.html`` (the json is the machine-readable
       artifact downstream trusts, the html is its render). Replacing the json
       last means an interruption between the two can only ever leave the
       *other* order — and rule 3 then removes even that.
    3. **Rollback, for every exception class.** The previous
       ``brandkit.html`` is copied aside before the first replace and restored
       whenever the json did NOT land, so a failure lands back on the previous
       consistent pair rather than a half-new one. This covers ``OSError``
       *and* ``BaseException`` — ``KeyboardInterrupt``/``SystemExit`` delivered
       between the two replaces used to skip the rollback entirely and leave a
       new html beside the old json.

       Whether an interrupted rename landed is not knowable from the exception
       (CPython runs the signal handler after the syscall returns), so it is
       read off the filesystem instead: ``os.replace`` removes the SOURCE, so a
       staged file that still exists proves its rename did not happen. The one
       state that is deliberately left alone is an interrupt delivered *after*
       the json rename completed — both files have advanced, which is the
       fully-promoted pair, not a tear.

    Exactly what is guaranteed: **the pair never advances by halves in the
    forbidden order, and for every failure this function can observe it does
    not advance at all.** What is NOT claimed: a report. An interrupt or a
    process kill exits without writing ``finalize-report.json``, so "no report"
    is the only signal that a run died mid-flight; ``SIGKILL`` between the two
    replaces (unobservable, no handler runs) still leaves a new html beside the
    old json — the safe order, and the reason the ordering rule exists.
    """
    for dest in (html_path, brandkit_path):
        # exists() follows symlinks, so a symlink-to-directory is caught too;
        # a dangling symlink reports False and os.replace overwrites it fine.
        if dest.exists() and not dest.is_file():
            kind = "a directory" if dest.is_dir() else "not a regular file"
            raise PromotionError(
                f"Cannot promote {dest.name}: {dest} exists but is {kind}. "
                "Remove it and re-run. Nothing was promoted — the previous "
                "brandkit.json/brandkit.html pair is untouched."
            )

    backup_html: Path | None = None
    if html_path.is_file():
        backup_html = staging_dir / PREVIOUS_HTML_BACKUP_NAME
        # shutil.copy, NOT copy2: copy2 preserves st_flags, which propagated a
        # BSD `uchg` (immutable) flag from the live brandkit.html onto this
        # backup — making the staging dir undeletable and, before staging dirs
        # became unique per run, bricking the out-dir for every later run.
        # Content + mode is all a rollback copy needs.
        shutil.copy(html_path, backup_html)

    def rollback_html() -> str:
        """Undo the html replace. Returns a note for the error message."""
        try:
            if backup_html is not None:
                os.replace(backup_html, html_path)
            else:
                # There was no previous html; undo the one write we made.
                html_path.unlink(missing_ok=True)
        except OSError as restore_exc:  # pragma: no cover - same-dir replace
            return (
                "and brandkit.html could NOT be rolled back "
                f"({restore_exc.__class__.__name__}: {restore_exc}) — the "
                "out-dir needs manual repair"
            )
        return "the previous pair was restored"

    try:
        os.replace(staged_html, html_path)
    except OSError as exc:
        # The rename did not happen: nothing to undo.
        raise PromotionError(
            f"Cannot promote {html_path}: {exc.__class__.__name__}: {exc}. "
            "Nothing was promoted — the previous brandkit.json/brandkit.html "
            "pair is untouched."
        ) from exc
    except BaseException:
        # KeyboardInterrupt / SystemExit: the rename may already have landed.
        if not staged_html.exists():
            rollback_html()
        raise

    try:
        os.replace(staged_json, brandkit_path)
    except OSError as exc:
        raise PromotionError(
            f"Cannot promote {brandkit_path}: {exc.__class__.__name__}: {exc}; "
            f"{rollback_html()}."
        ) from exc
    except BaseException:
        if staged_json.exists():
            # The json never landed — take the html back so the out-dir keeps
            # the previous consistent pair. (If it DID land, both halves are
            # promoted and there is nothing to undo.)
            rollback_html()
        raise


def _cmd_prepare(args: argparse.Namespace) -> int:
    """Clear stale agent-authored intermediates; 0 when all of them went.

    ``{"cleared": [...], "failures": [...]}`` on stdout. A non-empty
    ``failures`` exits 1 (EXIT_ERROR): round-4 finding — a `prepare` that
    cannot clear a satellite stop file must not report success, because the
    reader honours that file on presence alone and every later run of this
    slug then exits 4 quoting a reason from a run that is long over.
    """
    failures: list[str] = []
    cleared = clear_stale_agent_authored_outputs(
        Path(args.technical_dir),
        failures_out=failures,
    )
    print(json.dumps({"cleared": cleared, "failures": failures}))
    return EXIT_ERROR if failures else EXIT_COMPOSED


def _run_pipeline(args: argparse.Namespace) -> int:
    technical_dir = Path(args.technical_dir)
    skill_root = Path(args.skill_root)
    out_dir = Path(args.out_dir)
    schema_paths = SchemaPaths(skill_root=skill_root)

    total_start = time.monotonic()
    timings_ms: dict[str, int] = {}
    warnings: list[str] = []
    blockers: list[str] = []
    gaps: list[dict[str, str]] = []
    brandkit_sha256: str | None = None
    logo_hosting_result = LogoHostingResult.not_reached()

    def record_timing(step: str, step_start: float) -> None:
        timings_ms[step] = int((time.monotonic() - step_start) * 1000)

    def build_report_text(status: str, *, error: str | None, promoted_sha: str | None) -> str:
        timings_ms["total"] = int((time.monotonic() - total_start) * 1000)
        report: dict[str, Any] = {
            "status": status,
            # promoted == "this run wrote brandkit.json + brandkit.html".
            # False does NOT mean the out-dir is empty: an earlier run's pair
            # may still be there, untouched by this run. brandkit_sha256 is
            # the hash of what THIS run promoted, so the two always agree.
            "promoted": promoted_sha is not None,
            "warnings": warnings,
            "blockers": blockers,
            # Roles this page could not supply. A gap is reported, not fatal:
            # the kit persists without the role and downstream falls through
            # its own token chain.
            "gaps": gaps,
            "brandkit_sha256": promoted_sha,
            # Audit only. The exact hosted URL remains in LogoHostingResult
            # process memory so this record can never authorize a logo fact.
            "logo_hosting": logo_hosting_result.report_record(),
            "timings_ms": timings_ms,
        }
        if error is not None:
            report["error"] = error
        return json.dumps(report, ensure_ascii=False, indent=2) + "\n"

    def land_report_text(text: str, *, promoted: bool) -> None:
        """Write ``text`` to a temp file and rename it onto the report path.

        Atomic from the agent's side: ``finalize-report.json`` is either the
        previous run's report or this one's, never a half-written file.
        """
        try:
            out_dir.mkdir(parents=True, exist_ok=True)
            tmp_path = _write_report_tmp(out_dir, text)
        except OSError as exc:
            # The report is this CLI's entire contract with the agent, so a
            # failure to write it cannot be reported through the report.
            # Raise out to _cmd_run (this runs inside the pipeline's own
            # except block on the error path) for a single structured line.
            # `promoted` mirrors the report field of the same name, from the
            # same source of truth, so the stderr line can never imply
            # "nothing was promoted" about a run that promoted.
            raise ReportWriteError(
                f"Cannot write finalize-report.json under {out_dir}: "
                f"{exc.__class__.__name__}: {exc}",
                promoted=promoted,
            ) from exc
        try:
            os.replace(tmp_path, out_dir / REPORT_FILENAME)
        except OSError as exc:
            _unlink_quietly(tmp_path)
            raise ReportWriteError(
                f"Cannot write finalize-report.json under {out_dir}: "
                f"{exc.__class__.__name__}: {exc}",
                promoted=promoted,
            ) from exc

    def write_report(status: str, *, error: str | None = None) -> None:
        land_report_text(
            build_report_text(status, error=error, promoted_sha=brandkit_sha256),
            promoted=brandkit_sha256 is not None,
        )

    def reserve_report(status: str, *, promoted_sha: str) -> Path:
        """Write the FINISHED report to a temp file before anything is promoted.

        Round-4 finding: the previous pre-flight opened the report path in
        append mode. That proves the path is creatable; it allocates no
        blocks, so it never proved the report FITS. On a full filesystem the
        pre-flight passed, ``_promote_pair`` landed a new pair, and
        ``write_report`` then died with ``ENOSPC`` — exit 1 with
        ``promoted: true`` on stderr, a 0-byte report that fails
        ``json.loads``, and SKILL.md telling the agent exit 1 means nothing
        was promoted.

        Writing the real bytes here removes the gap instead of widening the
        probe. After this returns, the only step left after the irreversible
        promotion is ``os.replace`` of a file that is already complete and on
        the same filesystem.

        Covered, all BEFORE the promotion: the out-dir is unwritable or is a
        regular file (``mkdir``/``mkstemp``), the filesystem is full
        (``ENOSPC`` on the write), the report path is occupied by something
        ``os.replace`` cannot overwrite — a directory, a mount point (checked
        explicitly below, since the temp write would not notice it).

        NOT covered — the honest residue: the out-dir changing shape between
        this call and the rename, and any failure of the rename itself. Those
        still raise :class:`ReportWriteError` with ``promoted=True`` after a
        promotion, which is exactly what that flag exists to say.
        """
        report_path = out_dir / REPORT_FILENAME
        try:
            out_dir.mkdir(parents=True, exist_ok=True)
            occupied = report_path.exists() and not report_path.is_file()
        except OSError as exc:
            raise ReportWriteError(
                f"Cannot write finalize-report.json under {out_dir}: "
                f"{exc.__class__.__name__}: {exc}. Nothing was promoted — the "
                "report is written before the promotion precisely so this "
                "failure cannot follow one.",
                promoted=False,
            ) from exc
        if occupied:
            raise ReportWriteError(
                f"Cannot write finalize-report.json under {out_dir}: "
                f"{report_path} exists and is not a regular file, so it "
                "cannot be replaced. Nothing was promoted — the report is "
                "written before the promotion precisely so this failure "
                "cannot follow one.",
                promoted=False,
            )
        try:
            return _write_report_tmp(
                out_dir,
                build_report_text(status, error=None, promoted_sha=promoted_sha),
            )
        except OSError as exc:
            raise ReportWriteError(
                f"Cannot write finalize-report.json under {out_dir}: "
                f"{exc.__class__.__name__}: {exc}. Nothing was promoted — the "
                "report is written before the promotion precisely so this "
                "failure cannot follow one.",
                promoted=False,
            ) from exc

    def land_reserved_report(reserved_tmp: Path, status: str, promoted_sha: str) -> None:
        """Land the reserved report, refreshed with the promotion's timings.

        The refresh is a best effort and goes to its OWN temp file: if there
        is no room for it (the failure this whole design exists for), the
        reserved copy — already complete and valid on disk — is landed
        instead. It differs only in ``timings_ms``, which then carries no
        ``promote`` entry and a ``total`` measured just before the promotion.
        Either way a promoted run always lands a parseable report.
        """
        landing = reserved_tmp
        try:
            refreshed = _write_report_tmp(
                out_dir,
                build_report_text(status, error=None, promoted_sha=promoted_sha),
            )
        except OSError:
            refreshed = None
        if refreshed is not None:
            _unlink_quietly(reserved_tmp)
            landing = refreshed
        try:
            os.replace(landing, out_dir / REPORT_FILENAME)
        except OSError as exc:
            _unlink_quietly(landing)
            raise ReportWriteError(
                f"Cannot write finalize-report.json under {out_dir}: "
                f"{exc.__class__.__name__}: {exc}",
                promoted=True,
            ) from exc

    try:
        # Homepage-blocked gate first, mirroring the source runner ordering
        # (gate before finalize). Every run here is a fresh extraction, so a
        # recorded blocker is always fatal. The gate runs INSIDE this try so
        # that any unexpected gate failure still writes finalize-report.json
        # — the report is the agent's entire documented contract for this
        # step, so no outcome may exit without one. An UNREADABLE status file
        # is an exit-4 blocker, not a pass: it may be concealing a recorded
        # block (see compose.HomepageStatusUnreadableError).
        try:
            resolve_homepage_gate(technical_dir)
        except HomepageBlockedError as exc:
            blockers.append(str(exc))
            write_report(STATUS_HOMEPAGE_BLOCKED)
            logger.error("Homepage blocked for slug %s: %s", args.slug, exc)
            return EXIT_HOMEPAGE_BLOCKED

        extraction_path = technical_dir / "brandkit.extraction.json"
        if not extraction_path.is_file():
            raise RuntimeError(
                f"No extraction-stage artifact at {extraction_path}: this runtime "
                "finalizes fresh extractions only, so brandkit.extraction.json "
                "must exist before `run` is invoked."
            )

        # Detect stale-normalize slips on the raw bytes BEFORE normalize
        # persists the fixes — the warnings surface the recovery in the report.
        step_start = time.monotonic()
        raw_extraction_payload = json.loads(extraction_path.read_text(encoding="utf-8"))
        stale_recovery_warnings = stale_normalize_recovery_warnings(raw_extraction_payload)
        # Read before normalize for the same reason, reporting a different
        # removal: the write-refusal gate empties the URLs the Brand Kit write
        # would refuse, and reteno-mcp cannot name those in its own `sanitized`
        # list — the gate is what stops them reaching the write at all, so this
        # is the only place the run can say a value was dropped.
        stale_recovery_warnings.extend(write_refusal_gate_warnings(raw_extraction_payload))
        # Recorded into `warnings` the moment they are computed, not at the
        # single rebuild below. Round-4 finding: the hard-stop branch writes
        # its report before that rebuild, so it was the ONE exit path that
        # dropped advisories the run already had — including the notice that
        # the runtime rewrote the agent's extraction artifact, on exactly the
        # runs a human is about to debug. Every exit path from here on carries
        # them; the rebuild dedupes.
        warnings.extend(stale_recovery_warnings)
        record_timing("stale_normalize_check", step_start)

        # A styling-only post-normalize edit may invalidate a formerly positive
        # roleProvenance grade. Reconcile it before Python loads/composes the
        # extraction so stale `dom-measured` / `agent-recovered` claims cannot
        # affect the report. The map remains technical-only and compose omits it
        # from account-facing output. Styling uncertainty warns and promotes;
        # if this helper cannot run, it removes the optional map instead.
        warnings.extend(_reconcile_role_provenance(skill_root, technical_dir))

        step_start = time.monotonic()
        normalize_extraction_stage_file(extraction_path, schema_paths.extraction_stage_schema_path)
        record_timing("normalize_extraction", step_start)

        step_start = time.monotonic()
        extraction_stage = validate_extraction_stage_file(
            extraction_path, schema_paths.extraction_stage_schema_path
        )
        record_timing("validate_extraction", step_start)

        step_start = time.monotonic()
        # A satellite that HARD-STOPPED (its own site-match check refused, its
        # inputs were missing) records a stop file instead of its artifact.
        # Without this gate that is indistinguishable from a satellite that ran
        # and found nothing: the loaders below would return their empty
        # defaults with a warning and the run would compose, promote and exit 0
        # carrying `brandVoice: {"toneOfVoice": [], ...}` — a voiceless
        # brandkit reported as a clean compose. Collected for BOTH satellites
        # in one pass so a run where both refused reports both. Checked before
        # the loaders (which raise SatelliteHardStopError as a backstop for
        # other callers) so a refusal is never masked by a second fault.
        hard_stops = collect_satellite_hard_stops(technical_dir)
        if hard_stops:
            blockers[:] = list(dict.fromkeys(hard_stops))
            record_timing("load_satellites", step_start)
            write_report(STATUS_BLOCKED)
            logger.error(
                "Satellite hard stop for slug %s (nothing promoted): %s",
                args.slug,
                "; ".join(blockers),
            )
            return EXIT_BLOCKERS
        brand_voice, tone_warnings = load_brand_voice(
            technical_dir,
            languages=extraction_stage.get("languages"),
            schema_paths=schema_paths,
        )
        business_context, business_context_warnings = load_business_context(
            technical_dir, schema_paths=schema_paths
        )
        products = load_products(technical_dir)
        record_timing("load_satellites", step_start)

        step_start = time.monotonic()
        composed_brandkit = compose_final_brandkit(
            extraction_stage, brand_voice, business_context, products
        )
        record_timing("compose", step_start)

        # Validate the ORIGINAL composed payload and hard-block unsafe SVG
        # before any reconciliation can clear it. A safe but unbound value is
        # recoverable below; malformed/active markup is not.
        step_start = time.monotonic()
        semantic_warnings: list[str] = []
        validate_brandkit_payload(
            composed_brandkit,
            schema_paths.skill_schema_path,
            semantic_warnings_out=semantic_warnings,
        )
        original_svg_blockers = logo_svg_safety_blockers(composed_brandkit)
        record_timing("validate_original_brandkit", step_start)
        warnings.extend(semantic_warnings)
        if original_svg_blockers:
            blockers[:] = original_svg_blockers
            write_report(STATUS_BLOCKED)
            logger.error(
                "Unsafe original logo SVG blocked finalization for slug %s "
                "(nothing promoted): %s",
                args.slug,
                "; ".join(blockers),
            )
            return EXIT_BLOCKERS

        logo_evidence = load_logo_asset_evidence(technical_dir)

        step_start = time.monotonic()
        warnings.extend(
            reconcile_logo_markup(
                composed_brandkit,
                technical_dir=technical_dir,
                logo_evidence=logo_evidence,
            )
        )
        record_timing("reconcile_logo_markup", step_start)

        # A contact this run cannot evidence is STRIPPED WITH A WARNING, not a
        # run refusal. `INVENTED_CONTACT_BLOCKER` stays as the backstop below;
        # it must not be the outcome, because exiting 4 over one unprovable
        # phone number persisted nothing at all.
        step_start = time.monotonic()
        warnings.extend(reconcile_contacts(composed_brandkit, technical_dir))
        record_timing("reconcile_contacts", step_start)

        # A social URL the Brand Kit write would refuse (a non-http(s) value)
        # is EMPTIED WITH A WARNING, not a run refusal -- the same posture as
        # the contacts above. On this path normalize's `_drop_unwritable_socials`
        # has already emptied them on the raw artifact, so this is idempotent
        # here; it is the composed document's own guarantee for any caller
        # that reaches compose without that pass.
        warnings.extend(reconcile_socials(composed_brandkit))

        # Resolve a matching, already-authorized current-run sidecar before
        # the blocker gate. Preflight itself performs no remote mutation.
        step_start = time.monotonic()
        logo_preflight = prepare_primary_logo(
            composed_brandkit,
            technical_dir=technical_dir,
            logo_evidence=logo_evidence,
        )
        record_timing("logo_preflight", step_start)

        step_start = time.monotonic()
        # Validate the composed payload IN MEMORY before anything touches
        # disk (validate_brandkit_payload exists for exactly this): the
        # out-dir workspace persists across runs, so a payload that fails
        # schema/semantic validation must never overwrite a previously-good
        # brandkit.json/brandkit.html pair.
        brandkit = validate_brandkit_payload(
            composed_brandkit,
            schema_paths.skill_schema_path,
            semantic_warnings_out=semantic_warnings,
        )
        record_timing("validate_brandkit", step_start)

        # Create the finalizer-owned stage before remote hosting, then run the
        # existing validator stack over the locally sanitized brandkit. Every
        # schema/content/technical/artifact blocker that is knowable without a
        # minted URL is therefore decided before any remote mutation.
        out_dir.mkdir(parents=True, exist_ok=True)
        brandkit_path = out_dir / "brandkit.json"
        html_path = out_dir / "brandkit.html"
        brandkit_text = json.dumps(brandkit, ensure_ascii=False, indent=2) + "\n"
        staging_dir, staging_warnings = _create_staging_dir(out_dir)
        warnings.extend(staging_warnings)
        staged_json = staging_dir / "brandkit.json"
        staged_html = staging_dir / "brandkit.html"
        try:
            step_start = time.monotonic()
            staged_json.write_text(brandkit_text, encoding="utf-8")
            observed_urls = observed_asset_urls(technical_dir)
            record_timing("compose_write", step_start)

            step_start = time.monotonic()
            js_result = _run_js_skill_validators(
                skill_root,
                staged_json,
                technical_dir,
                args.url,
                observed_urls,
                set(),
                logo_evidence,
            )
            content_warnings, technical_warnings, technical_blockers = (
                _collect_validator_findings(
                    js_result,
                    brandkit=brandkit,
                    technical_dir=technical_dir,
                    target_url=args.url,
                    observed_urls=observed_urls,
                    semantic_warnings=semantic_warnings,
                    runtime_asset_bindings=set(),
                    logo_evidence=logo_evidence,
                )
            )
            record_timing("skill_validators_preflight", step_start)

            # Surface an unresolved role-coverage gap (a required typography /
            # textColor role the agent's last normalize couldn't close) as an
            # advisory warning — same rationale as the source runner.
            role_coverage_warnings = role_coverage_gap_warnings(technical_dir)
            # Roles the page genuinely could not supply. Reported, never fatal,
            # and kept out of `blockers` so the onboarding consumer does not stop.
            #
            # The variant-index gap rides the SAME channel and the same posture:
            # a carded page whose `recommendedVariantIndex` no consumer can
            # resolve is a fact about the kit, reported here so the onboarding
            # run learns it from the report instead of from
            # `build_product_card_bundle.py --variant auto` raising
            # `WorkflowError` one run later. It is never a blocker.
            gaps[:] = [
                *role_coverage_gaps(technical_dir),
                *product_card_variant_index_gaps(technical_dir),
            ]
            warnings[:] = list(
                dict.fromkeys(
                    [
                        # Warnings recorded before this rebuild must survive —
                        # `stale_recovery_warnings` among them, extended into
                        # `warnings` the moment they were computed so that every
                        # earlier exit path carries them too.
                        *warnings,
                        *semantic_warnings,
                        *tone_warnings,
                        *business_context_warnings,
                        *content_warnings,
                        *technical_warnings,
                        *role_coverage_warnings,
                    ]
                )
            )

            if technical_blockers:
                # Crucially, logo_hosting_result is still "not-reached": no
                # prepare_image_upload session, signed PUT, or upload_image
                # call can be orphaned by an already-known blocker.
                blockers[:] = list(dict.fromkeys(technical_blockers))
                write_report(STATUS_BLOCKED)
                logger.error(
                    "Finalization preflight blocked for slug %s (nothing promoted): %s",
                    args.slug,
                    "; ".join(blockers),
                )
                return EXIT_BLOCKERS

            # The preflight is clean. Hosting is the first remote mutation and
            # consumes only the local decision validated above. Its exact URL
            # stays in process memory until the post-host validator pass.
            step_start = time.monotonic()
            logo_hosting_result = host_primary_logo(
                composed_brandkit,
                technical_dir=technical_dir,
                skill_root=skill_root,
                slug=args.slug,
                preflight=logo_preflight,
            )
            # A failed CONVERSION is not a failed logo. When this run measured
            # an already-email-safe capture of the same mark, the kit stores
            # that instead of a URL no email client can render -- once, and
            # only on measured identity. Local and evidence-bound: it makes no
            # remote call and can introduce no blocker the pass above accepted.
            logo_hosting_result = apply_same_mark_fallback(
                composed_brandkit,
                technical_dir=technical_dir,
                result=logo_hosting_result,
                logo_evidence=logo_evidence,
            )
            record_timing("logo_hosting", step_start)

            step_start = time.monotonic()
            brandkit = validate_brandkit_payload(
                composed_brandkit,
                schema_paths.skill_schema_path,
                semantic_warnings_out=semantic_warnings,
            )
            brandkit_text = json.dumps(brandkit, ensure_ascii=False, indent=2) + "\n"
            staged_json.write_text(brandkit_text, encoding="utf-8")
            runtime_asset_bindings = (
                {logo_hosting_result.authorization_binding}
                if logo_hosting_result.authorization_binding is not None
                else set()
            )
            record_timing("validate_hosted_brandkit", step_start)

            # Re-run the same validator choke point with the exact in-process
            # proof. This is what rejects one-character and canonical-equivalent
            # mutations in both the JS path and the Python fallback.
            step_start = time.monotonic()
            js_result = _run_js_skill_validators(
                skill_root,
                staged_json,
                technical_dir,
                args.url,
                observed_urls,
                runtime_asset_bindings,
                logo_evidence,
            )
            content_warnings, technical_warnings, technical_blockers = (
                _collect_validator_findings(
                    js_result,
                    brandkit=brandkit,
                    technical_dir=technical_dir,
                    target_url=args.url,
                    observed_urls=observed_urls,
                    semantic_warnings=semantic_warnings,
                    runtime_asset_bindings=runtime_asset_bindings,
                    logo_evidence=logo_evidence,
                )
            )
            record_timing("skill_validators", step_start)
            warnings[:] = list(
                dict.fromkeys(
                    [
                        *warnings,
                        *semantic_warnings,
                        *content_warnings,
                        *technical_warnings,
                    ]
                )
            )
            if technical_blockers:
                blockers[:] = list(dict.fromkeys(technical_blockers))
                write_report(STATUS_BLOCKED)
                logger.error(
                    "Hosted-logo validation blocked finalization for slug %s "
                    "(nothing promoted): %s",
                    args.slug,
                    "; ".join(blockers),
                )
                return EXIT_BLOCKERS

            step_start = time.monotonic()
            _render_brandkit_html(skill_root, staged_json, staged_html)
            record_timing("render_html", step_start)

            # Last gate before the only irreversible step: the FINISHED report
            # is written to a temp file here, with the out-dir still untouched,
            # so "exit 1 => this run promoted nothing" stays true even on a
            # full disk. What remains after the promotion is one rename.
            promoted_sha = hashlib.sha256(brandkit_text.encode("utf-8")).hexdigest()
            reserved_report = reserve_report(STATUS_COMPOSED, promoted_sha=promoted_sha)

            try:
                step_start = time.monotonic()
                _promote_pair(
                    staged_json,
                    staged_html,
                    brandkit_path,
                    html_path,
                    staging_dir=staging_dir,
                )
                record_timing("promote", step_start)
            except BaseException:
                # Nothing was promoted (that is _promote_pair's contract), so
                # the reserved report describes a promotion that never
                # happened. Drop it; the outcome is reported by the handler
                # below, which writes its own.
                _unlink_quietly(reserved_report)
                raise
        finally:
            shutil.rmtree(staging_dir, ignore_errors=True)
        # Set only after a successful promotion: a non-null sha in the report
        # means "this run wrote that brandkit.json".
        brandkit_sha256 = promoted_sha

        land_reserved_report(reserved_report, STATUS_COMPOSED, promoted_sha)
        logger.info(
            "Composed brandkit for slug %s at %s (%d warning(s), sha256=%s)",
            args.slug,
            brandkit_path,
            len(warnings),
            brandkit_sha256,
        )
        return EXIT_COMPOSED
    except ReportWriteError:
        # Handled once in _cmd_run; re-reporting is impossible by definition.
        raise
    except (TechnicalArtifactUnreadableError, HomepageStatusUnreadableError) as exc:
        blockers[:] = list(dict.fromkeys([*blockers, str(exc)]))
        write_report(STATUS_BLOCKED)
        logger.error(
            "Corrupt technical artifact blocked finalization for slug %s (nothing promoted): %s",
            args.slug,
            exc,
        )
        return EXIT_BLOCKERS
    except SatelliteHardStopError as exc:
        # Backstop for a stop file that appeared after collect_satellite_hard_stops
        # ran, or a loader reached by a future code path: same outcome as the
        # pre-collected gate above — blockers, exit 4, nothing promoted — so
        # the two routes can never disagree about a refusal's exit code.
        blockers[:] = list(dict.fromkeys([*blockers, str(exc)]))
        write_report(STATUS_BLOCKED)
        logger.error(
            "Satellite hard stop for slug %s (nothing promoted): %s",
            args.slug,
            exc,
        )
        return EXIT_BLOCKERS
    except Exception as exc:  # noqa: BLE001 — CLI boundary: report + exit code
        message = f"{exc.__class__.__name__}: {exc}"
        write_report(STATUS_ERROR, error=message)
        logger.error("Finalization failed for slug %s: %s", args.slug, message)
        return EXIT_ERROR


def _collect_validator_findings(
    js_result: dict[str, Any] | None,
    *,
    brandkit: dict[str, Any],
    technical_dir: Path,
    target_url: str,
    observed_urls: set[str] | None,
    semantic_warnings: list[str],
    runtime_asset_bindings: set[tuple[str, str]] | None = None,
    logo_evidence: LogoAssetEvidence | None = None,
) -> tuple[list[str], list[str], list[str]]:
    """Normalize JS-validator output (or the Python fallback) into findings.

    Returns ``(content_warnings, technical_warnings, technical_blockers)`` and
    appends any fresh semantic findings to ``semantic_warnings`` in place.
    """
    # Validate again at the policy choke point. Tests and future callers may
    # supply this function directly, and malformed output must mean "no
    # verdict", never "no findings".
    if not _is_valid_js_validator_result(js_result):
        js_result = None

    if js_result is not None:
        # JS skill-side validator (validate-skill-output.js) is the single
        # source of truth. Schema + semantic + unsafe-public-strings errors
        # arrive in `errors`; technical-artifact blockers in `blockers`;
        # advisories in `warnings`.
        content_warnings: list[str] = []  # JS warnings include content + technical
        technical_warnings = js_result.get("warnings") or []
        technical_blockers = js_result.get("blockers") or []
        for err in js_result.get("errors") or []:
            # JS errors map to either schema or semantic violations; the
            # Python-side equivalent already raised on schema during
            # validate_brandkit_payload, so anything here is a fresh semantic
            # finding the JS port surfaced. Treat as warning to avoid
            # double-rejection during the transition.
            if err not in semantic_warnings:
                semantic_warnings.append(err)
    else:
        # Subprocess unavailable / failed — fall back to Python validators so
        # standalone-runtime behavior stays safe during the transition.
        content_warnings = validate_brandkit_content(
            brandkit,
            target_url=target_url,
            observed_asset_urls=observed_urls,
            runtime_asset_bindings=runtime_asset_bindings,
        )
        technical_warnings = validate_brandkit_against_technical_artifacts(
            brandkit,
            technical_dir,
        )
        technical_blockers = detect_technical_artifact_blockers(
            brandkit,
            technical_dir,
        )
        technical_blockers = [
            *detect_brandkit_content_blockers(
                brandkit,
                technical_dir,
                target_url=target_url,
                runtime_asset_bindings=runtime_asset_bindings,
                logo_evidence=logo_evidence,
            ),
            *technical_blockers,
        ]
        # AND THE FALLBACK IS NOT A SUBSTITUTE FOR ONE OF THEM. The Python
        # validators above have no role-provenance re-check: that gate lives in
        # `validate-skill-output.js` (`roleCoverageRecheckBlockers`), which
        # re-judges `brandkit.extraction.json` as it stands on disk. So on a
        # dir that the JS gate would have judged, `js_result is None` used to
        # mean the ONE check that can see a post-normalize edit silently did not
        # run — reproduced with the subprocess forced unavailable: exit 0,
        # `status: composed`, `promoted: true`, an unsupported body family
        # published, `blockers: []`.
        #
        # ONE CHOKE POINT ON PURPOSE. `_run_js_skill_validators` returns None
        # for a missing script, a missing/failed `node`, a timeout, empty
        # stdout, unparseable stdout, a non-dict result and an unexpected exit
        # code. They are the same fact to this caller — no verdict — and
        # branching per cause is how one of them stays open.
        #
        # The population split is `role_coverage_recheck_is_mandatory`: a
        # legacy technical dir carrying no marker keeps the fallback exactly as
        # it is today, which is the behaviour this whole branch exists for.
        #
        # THE CHANNEL MOVED; THE POPULATION SPLIT DID NOT. What the lost
        # re-check contains is now almost entirely STYLING findings, and a
        # styling finding warns: refusing the run persists nothing, so the
        # account keeps the previous run's kit or keeps nothing, and neither is
        # better than a kit whose font provenance is unverified and SAID to be.
        #
        # The one finding inside that re-check which is NOT styling -- a
        # diagnostics file carrying the gate marker while denying its own
        # normalize validated anything -- is checked right here instead, by a
        # Python twin built for this move. Without it the demotion would have
        # dropped an artifact-tampering check on exactly the path where node is
        # not answering, which is the reason this blocker was fatal at all.
        if role_coverage_recheck_is_mandatory(technical_dir):
            technical_warnings = [
                *technical_warnings,
                ROLE_COVERAGE_RECHECK_UNAVAILABLE_WARNING,
            ]
        stale_artifact = role_coverage_stale_artifact_blocker(technical_dir)
        if stale_artifact is not None:
            technical_blockers = [*technical_blockers, stale_artifact]
    return list(content_warnings), list(technical_warnings), list(technical_blockers)


def _cmd_run(args: argparse.Namespace) -> int:
    """CLI boundary for ``run``: the pipeline, plus the one failure it cannot report.

    Every pipeline outcome is communicated through ``finalize-report.json``.
    When the out-dir itself is unusable that channel does not exist, so this
    is the only place that writes to stderr directly — one structured JSON
    line, never a traceback.

    The line carries ``promoted`` for the same reason the report does: exit 1
    without a report must not be read as "nothing was promoted" unless that is
    actually true. ``reserve_report`` makes it true in every case it can
    foresee; this field covers the rest.

    The second user of that line is a refused concurrent run
    (:class:`OutDirBusyError`): it deliberately writes NO report, because the
    out-dir's report belongs to the run that owns it and a loser must not
    contradict a winner. Same shape, same exit code, ``promoted: false`` —
    which is true to the letter: it touched nothing.
    """
    def _stderr_line(error: str, *, promoted: bool) -> None:
        print(
            json.dumps(
                {
                    "status": STATUS_ERROR,
                    "report_written": False,
                    "promoted": promoted,
                    "out_dir": str(args.out_dir),
                    "error": error,
                },
                ensure_ascii=False,
            ),
            file=sys.stderr,
        )

    try:
        lock = _acquire_out_dir_lock(Path(args.out_dir))
    except OutDirBusyError as exc:
        # No logger call: the contract for a run with no report is ONE
        # structured line on stderr, and this is one of the two runs that
        # write no report. Everything a human needs is inside it.
        _stderr_line(str(exc), promoted=False)
        return EXIT_ERROR
    try:
        exit_code = _run_pipeline(args)
        # INSIDE the lock. The block projects `finalize-report.json` +
        # `brandkit.json` from the out-dir, and the lock is the only thing
        # that makes those files this run's: released first, a run starting
        # in the gap could land its own pair between the two `read_text`
        # calls and this run would print exit 0 over the other run's blocked
        # status and sha (reproduced with a flock probe). The window is two
        # file reads wide and a concurrent run is refused outright, so this
        # is an ordering defect rather than a live hazard -- and the fix is
        # two lines that change no stdout byte.
        # `_print_run_report_block` catches every exception, so nothing new
        # can escape past the release.
        _print_run_report_block(Path(args.out_dir), exit_code=exit_code)
    except ReportWriteError as exc:
        # No report landed, so there is nothing to project: the one structured
        # stderr line IS the report for this outcome.
        _stderr_line(str(exc), promoted=exc.promoted)
        return EXIT_ERROR
    finally:
        if lock is not None:
            # Releases the flock; a crashed run releases it the same way.
            lock.close()
    return exit_code


def _print_run_report_block(out_dir: Path, *, exit_code: int) -> None:
    """Print ONE JSON line projecting the report this run just wrote.

    Every field comes from ``finalize-report.json`` under ``--out-dir``, which
    the pipeline landed before returning, so the line can never disagree with
    the file. It is printed AFTER the pipeline's own INFO log line and is the
    only thing ``run`` writes to stdout — the agent reads it instead of
    opening the report by hand, and it carries the report lines the final
    reply owes (4/9 measured runs skipped one).

    Called while the out-dir lock is STILL HELD, so the pair it projects is
    this run's: the lock is what made those files this run's in the first
    place.

    A projection failure must not change the run's outcome: the artifacts are
    already promoted and the exit code is already decided.
    """

    try:
        block = report_lines_module.run_report_block_from_out_dir(
            out_dir, exit_code=exit_code
        )
        line = json.dumps(block, ensure_ascii=False)
    except Exception as exc:  # noqa: BLE001 - reporting must never fail a run
        line = json.dumps(
            {
                "status": None,
                "exit_code": exit_code,
                "error": f"{exc.__class__.__name__}: {exc}",
            },
            ensure_ascii=False,
        )
    print(line)


def _cmd_wait(args: argparse.Namespace) -> int:
    """Block on the homepage pass; print one line; write nothing.

    The exit code carries the decision so the agent does not have to parse the
    line to branch: 0/3/1 mirror finalize's own codes for the three terminal
    statuses, and 10/11/12 mean "call again" / "rerun the pass" / "there is no
    pass here".
    """

    # A CEILING, not an override: a smaller `--timeout-ms` is honoured as
    # asked. Above the ceiling there is nothing to honour -- the agent's exec
    # call yields after its `yield_time_ms`, whose DEFAULT is 10 s; the
    # contract asks the wait cell for 15 s, and the ceiling keeps the line
    # inside a 10 s yield when a caller forgets, because a longer block prints
    # the line into a chunk the caller never receives and costs a second
    # request to re-ask. `wait.DEFAULT_TIMEOUT_MS` carries the measurement;
    # clamping here rather than only defaulting is what keeps a caller that
    # still passes the old 12000 out of that trap.
    timeout_ms = min(args.timeout_ms, wait_module.DEFAULT_TIMEOUT_MS)
    outcome = wait_module.wait_for_homepage_pass(
        Path(args.technical_dir),
        timeout_ms=timeout_ms,
        stale_after_ms=args.stale_after_ms,
    )
    # Through `_printable` for the same reason `report` prints through it: the
    # line carries the pass's own `error` field verbatim, `homepage-pass.js`
    # writes that field after a UTF-16 `.slice()`, and a lone surrogate makes
    # `print` raise. That crash exits 1, which the decision table reads as
    # `failed` -- so a COMPLETED capture reported itself as the run's stop
    # condition. Reproduced.
    print(_printable(outcome.line))
    return WAIT_EXIT_CODES.get(outcome.status, EXIT_ERROR)


def _printable(line: str) -> str:
    """``line`` with whatever this stdout cannot encode replaced by ``?``.

    The 5c cell cuts the server's error text with JS ``.slice(0, 300)``, which
    counts UTF-16 code UNITS, so an astral character straddling the cut is left
    as a LONE SURROGATE. ``JSON.stringify`` writes it as ``"\\ud83d"``,
    ``json.loads`` accepts it, and ``print`` then raises UnicodeEncodeError
    ("surrogates not allowed") — exit 1 with no REPORT_LINE at all, the exact
    cost the file transport was introduced to remove, and reachable only
    through that transport (argv cannot carry a lone surrogate). Reproduced.

    Replacing the offending characters keeps the rest of the sentence, which is
    what the reader needs; ``run``'s own JSON line needs no such guard because
    the report it projects is written by this CLI with ``ensure_ascii=False``,
    which cannot land a surrogate in the file in the first place.
    """

    # stdout's OWN codec, so an ASCII-only stdout degrades the same way instead
    # of crashing on the first non-ASCII site name.
    encoding = getattr(sys.stdout, "encoding", None) or "utf-8"
    try:
        return line.encode(encoding, "replace").decode(encoding, "replace")
    except (LookupError, UnicodeError):  # pragma: no cover - exotic codec
        return line.encode("ascii", "replace").decode("ascii")


# Who wrote `persist-readback.json`. The document names its author so a reader
# of the technical dir can tell the CLI's read from a hand-authored one.
READBACK_AUTHOR = "brandkit_finalize report"


def _read_account_brandkit() -> dict[str, Any]:
    """Phase 5d, performed by this CLI: read the account's Brand Kit.

    The read goes through the finalizer's own MCP route (`logo_hosting`'s,
    the one `run` uses for `prepare_image_upload`; a PNG was minted through
    it live on 2026-09-05), so the document the witness compares is the
    tool's whole output, never the agent's transcription of it. Never raises:
    a failed read is a fact the persist line names ("the read-back call
    failed"), not a crash that costs the run its line.
    """

    fetched_at = datetime.now(timezone.utc).isoformat()
    try:
        payload = logo_hosting_module._call_mcp_tool("get_brandkit", {})  # noqa: SLF001
    except Exception as exc:  # noqa: BLE001 - the failure is the fact reported
        return {
            "ok": False,
            "error": f"{exc.__class__.__name__}: {exc}"[:300],
            "brandkit": None,
            "readBy": READBACK_AUTHOR,
            "fetchedAt": fetched_at,
        }
    stored: dict[str, Any] | None = None
    if isinstance(payload, dict):
        if isinstance(payload.get("brandkit"), dict):
            stored = payload["brandkit"]
        elif "brand" in payload:
            stored = payload
    return {
        "ok": stored is not None,
        "error": None if stored is not None else "get_brandkit returned no Brand Kit document",
        "brandkit": stored,
        "readBy": READBACK_AUTHOR,
        "fetchedAt": fetched_at,
    }


def _write_readback_document(path: Path, document: dict[str, Any]) -> None:
    """Keep the read-back beside the write document, as evidence.

    Best effort: the line is decided from the in-memory document, so a
    technical dir this CLI cannot write to costs the evidence, not the line.

    `Exception`, not `OSError`: the account's stored kit is whatever a prior
    run, the dashboard or another tool left there, and `json.loads` accepts a
    lone surrogate in it. `write_text` then raises `UnicodeEncodeError` -- a
    `ValueError`, not an `OSError` -- one statement BEFORE the `try` that
    guards `build_report_lines`, so the run loses EVERY `REPORT_LINE`: the
    persist line, the logo line and every contact line. Reproduced. Anything
    this write can raise costs the evidence; nothing it can raise may cost the
    lines.
    """

    try:
        path.write_text(
            json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
    except Exception:  # noqa: BLE001 - evidence is best effort; the line is not
        pass


def _cmd_report(args: argparse.Namespace) -> int:
    """Mint every REPORT_LINE the final reply owes from this run's own files.

    ``--write-file`` names the document the contract's Phase 5a/5b/5c cells
    WRITE. It is a file, not inline JSON, because it embeds the server's raw
    error text: inside the single-quoted shell argument the contract used to
    prescribe, an ordinary apostrophe ("can't persist: upstream 502") ended
    the string and killed the command with exit 2 and no REPORT_LINE at all,
    and a crafted error executed. Both reproduced.

    The 5d read-back is THIS command's, not the agent's. `report` decides from
    the write document whether a read is owed (:func:`report_lines.readback_owed`
    -- none on the three refusals, none after a failed 5a/5b, one on
    everything else including a MISSING write document), performs it through
    the finalizer's own MCP route, saves the whole tool output beside the
    write document as ``persist-readback.json``, and decides the persist line
    from what the account holds. The agent never authors that file: the
    attended run that did wrote a `brand` trimmed to organization + logos
    while the tool's real output was 18 KB, and the witness was right by luck.

    Every shape this does not recognise degrades to a line ("persisted but
    unverified (...)"), never to a crash: a run that persisted must still be
    able to say so.
    """

    def _read_document(path: str) -> Any:
        """The parsed JSON object, or ``None`` when absent/unreadable/not JSON.

        All three are the same fact to `report_lines`: no write result was
        RECORDED, so the account decides.
        """

        try:
            raw = Path(path).read_text(encoding="utf-8")
        except (OSError, ValueError):
            return None
        try:
            return json.loads(raw)
        except ValueError:
            return None

    write_doc = _read_document(args.write_file)
    read_owed = True
    try:
        read_owed = report_lines_module.readback_owed(
            report_lines_module.build_persist_inputs(write_doc, None, None)
        )
    except Exception:  # noqa: BLE001 - when the decision itself fails, the account decides
        read_owed = True
    readback: dict[str, Any] | None = None
    if read_owed:
        readback = _read_account_brandkit()
        _write_readback_document(
            Path(args.write_file).parent / report_lines_module.PERSIST_READBACK_FILENAME,
            readback,
        )
    try:
        lines = report_lines_module.build_report_lines(
            Path(args.out_dir),
            write_doc,
            readback,
            readback_supplied=read_owed,
        )
    except Exception as exc:  # noqa: BLE001 - reporting must never crash
        lines = [
            "persisted but unverified "
            f"(the report could not be rendered: {exc.__class__.__name__}: {exc})"
        ]
    for line in lines:
        print(f"{report_lines_module.REPORT_LINE_PREFIX}{_printable(line)}")
    return EXIT_COMPOSED


def _cmd_check_site(args: argparse.Namespace) -> int:
    """Port of the satellites' site-match block; the verdict is the decision.

    Prints the same labelled lines the shell block echoed, and — with
    ``--stage`` — writes that stage's stop file on the verdicts that stage
    stops for. It writes NOTHING else under the technical dir.
    """

    match = site_match_module.evaluate_site_match(args.technical_dir, args.url)
    for line in match.lines:
        print(line)

    stage = getattr(args, "stage", None)
    if stage and site_match_module.should_write_stop_file(stage, match.verdict):
        filename = site_match_module.stop_file_for(stage)
        assert filename is not None
        stop_path = Path(args.technical_dir) / filename
        payload = {"stage": stage, "reason": match.verdict_line}
        try:
            stop_path.write_text(
                json.dumps(payload, ensure_ascii=False) + "\n", encoding="utf-8"
            )
        except OSError as exc:
            # The stop file's PRESENCE is the signal the finalizer honours, so
            # a failure to write it must be loud rather than swallowed into a
            # verdict line that reads like a clean stop.
            print(
                f"error:     cannot write {stop_path}: "
                f"{exc.__class__.__name__}: {exc}",
                file=sys.stderr,
            )

    if match.verdict == site_match_module.VERDICT_PROCEED:
        return EXIT_COMPOSED
    if match.verdict == site_match_module.VERDICT_NO_ARTIFACTS:
        return EXIT_HOMEPAGE_BLOCKED
    return EXIT_BLOCKERS


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        prog="python <skill-root>/scripts/finalize.py",
        description="Deterministic brandkit finalization gauntlet (vendored from brandkit-agent).",
    )
    subparsers = parser.add_subparsers(dest="command", required=True)

    prepare = subparsers.add_parser(
        "prepare",
        help="Clear stale agent-authored intermediates from a technical dir.",
    )
    prepare.add_argument(
        "--technical-dir",
        required=True,
        help="Per-slug technical artifacts directory (technical/<slug>).",
    )

    run = subparsers.add_parser(
        "run",
        help="Run the full finalize pipeline on a fresh extraction.",
    )
    run.add_argument(
        "--technical-dir",
        required=True,
        help="Per-slug technical artifacts directory (technical/<slug>).",
    )
    run.add_argument(
        "--skill-root",
        required=True,
        help="Path to the brandkit-extraction-v-0 skill directory.",
    )
    run.add_argument("--url", required=True, help="Target site URL being extracted.")
    run.add_argument("--slug", required=True, help="Slug identifying this extraction run.")
    run.add_argument(
        "--out-dir",
        required=True,
        help="Output directory for brandkit.json, brandkit.html, finalize-report.json.",
    )

    wait_cmd = subparsers.add_parser(
        "wait",
        help="Block on homepage-pass-status.json and print one status line.",
    )
    wait_cmd.add_argument(
        "--technical-dir",
        required=True,
        help="Per-slug technical artifacts directory (technical/<slug>).",
    )
    wait_cmd.add_argument(
        "--timeout-ms",
        type=int,
        default=wait_module.DEFAULT_TIMEOUT_MS,
        help=(
            "Give up waiting after this long and exit 10 (default and ceiling: "
            f"{wait_module.DEFAULT_TIMEOUT_MS}; a larger value is clamped, because the "
            "agent's exec call yields after its yield_time_ms, 10s by default, and "
            "a longer block prints into a chunk the caller never reads)."
        ),
    )
    wait_cmd.add_argument(
        "--stale-after-ms",
        type=int,
        default=wait_module.DEFAULT_STALE_AFTER_MS,
        help="Treat a frozen, unwritten status this old as stale (default: 300000).",
    )

    report = subparsers.add_parser(
        "report",
        help="Print the REPORT_LINE lines the final reply owes.",
        # `allow_abbrev` defaults to True, which would make the RETIRED
        # `--write` an unambiguous prefix of `--write-file` and quietly read a
        # pasted JSON document as a path. The whole point of the file
        # transport is that a document never travels as an argument, so an
        # invocation that still passes one must fail loudly (exit 64) rather
        # than degrade into "the WRITE result could not be parsed".
        allow_abbrev=False,
    )
    report.add_argument(
        "--out-dir",
        required=True,
        help="Directory holding this run's brandkit.json + finalize-report.json.",
    )
    report.add_argument(
        "--write-file",
        required=True,
        help=(
            "Absolute path to the JSON document the Phase 5a/5b/5c cells wrote "
            f"({report_lines_module.PERSIST_WRITE_FILENAME} in the technical "
            "dir). A file, never inline JSON: the document embeds the "
            "server's raw error text. The 5d read-back is this command's own: "
            "it calls get_brandkit itself when a read is owed and saves "
            f"{report_lines_module.PERSIST_READBACK_FILENAME} beside the write "
            "document."
        ),
    )

    check_site = subparsers.add_parser(
        "check-site",
        help="Decide whether a technical dir describes the requested site.",
    )
    check_site.add_argument(
        "--technical-dir",
        required=True,
        help="Per-slug technical artifacts directory (technical/<slug>).",
    )
    check_site.add_argument(
        "--url",
        required=True,
        help="The URL you were asked about, verbatim.",
    )
    check_site.add_argument(
        "--stage",
        choices=sorted(site_match_module.STOP_FILENAMES),
        default=None,
        help="Satellite stage; writes that stage's stop file on a stop verdict.",
    )
    return parser


def main(argv: list[str] | None = None) -> int:
    parser = build_parser()
    try:
        args = parser.parse_args(argv)
    except SystemExit as exc:
        # argparse exits 2 on every usage error (unknown subcommand, missing
        # or malformed arguments) — a code the old contract used for
        # "blockers present". Remap usage errors to the sysexits EX_USAGE
        # convention (64) so a malformed invocation can never be misread as a
        # pipeline outcome; argparse has already printed the usage message to
        # stderr. --help exits (code 0) pass through unchanged.
        if exc.code in (None, 0):
            return 0
        return EXIT_USAGE
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
    if args.command == "prepare":
        return _cmd_prepare(args)
    if args.command == "run":
        return _cmd_run(args)
    if args.command == "wait":
        return _cmd_wait(args)
    if args.command == "report":
        return _cmd_report(args)
    if args.command == "check-site":
        return _cmd_check_site(args)
    # Unreachable with required=True subparsers; fail closed as a usage error
    # rather than crashing if that invariant ever changes.
    parser.print_usage(sys.stderr)
    return EXIT_USAGE


if __name__ == "__main__":
    sys.exit(main())

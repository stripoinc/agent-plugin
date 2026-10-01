"""CLI entry point for native Business Profile finalization.

Usage::

    python <skill-root>/scripts/finalize.py run \
        --technical-dir <dir> --skill-root <dir> --url <url> \
        --slug <slug> --out-dir <dir>

``run`` reads one agent-authored input, ``RUN/brandkit.json``, which is already
in the public schema. Python owns the complete acceptance decision: bounded
input read → public schema and intrinsic validation → native browser-session
site consistency → original SVG safety → current-run logo evidence → safe
markup reconciliation and hosting preflight → pre-host policy → authorized
hosting when needed → exact post-host binding and public revalidation → render
→ reserved report → atomic promotion. The input is never rewritten.

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
that reaches an exit code: validation failure, policy blockers, internal
error, or an unwritable report —
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

    status            "composed" | "blocked" | "error"
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

Exit codes: 0 composed, 4 validation/policy blockers, 1 internal error, and 64
for malformed invocation. Exit 3 remains reserved for compatibility with
historical reports but the native pipeline has no homepage-pass state.

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
import stat
import subprocess
import sys
import tempfile
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import IO, Any

import jsonschema

try:  # POSIX only; the runtime is Linux/macOS. See _acquire_out_dir_lock.
    import fcntl
except ImportError:  # pragma: no cover - non-POSIX
    fcntl = None  # type: ignore[assignment]

from . import logo_hosting as logo_hosting_module
from . import report_lines as report_lines_module
from . import site_match as site_match_module
from .logo_hosting import (
    LogoHostingResult,
    host_primary_logo,
    prepare_primary_logo,
    reconcile_logo_markup,
)
from .validation import (
    SchemaPaths,
    TechnicalArtifactUnreadableError,
    detect_native_brandkit_blockers,
    load_logo_asset_evidence,
    logo_svg_safety_blockers,
    validate_brandkit_content,
    validate_brandkit_payload,
)

logger = logging.getLogger(__name__)

SUBPROCESS_TIMEOUT_SECONDS = 60.0
BRANDKIT_INPUT_MAX_BYTES = 2 * 1024 * 1024

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
# dir is the renderer subprocess (SUBPROCESS_TIMEOUT_SECONDS), and the only
# cost of waiting is that litter from a crashed run is collected one turn
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
#   3  reserved for historical report/check-site compatibility
#   4  blockers present
#   1  internal error (finalize-report.json written whenever possible)
#   64 usage error (argparse's exit 2 is remapped in main(); 2 must never be
#      an outcome code, so a malformed invocation can't read as "blockers")
EXIT_COMPOSED = 0
EXIT_ERROR = 1
EXIT_HOMEPAGE_BLOCKED = 3
EXIT_BLOCKERS = 4
EXIT_USAGE = 64

STATUS_COMPOSED = "composed"
STATUS_ERROR = "error"
STATUS_BLOCKED = "blocked"


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


class NativeInputBlocked(RuntimeError):
    """A deterministic current-run input or policy refusal."""


def _validated_run_directory(path: Path) -> Path:
    """Resolve RUN and reject host-root escapes and symlinked run identity."""

    try:
        run_stat = path.lstat()
    except OSError as exc:
        raise NativeInputBlocked(
            f"Current-run directory is unavailable: {path}: {exc.__class__.__name__}: {exc}"
        ) from exc
    if stat.S_ISLNK(run_stat.st_mode) or not stat.S_ISDIR(run_stat.st_mode):
        raise NativeInputBlocked(f"Current-run path must be a regular non-symlink directory: {path}")
    try:
        resolved = path.resolve(strict=True)
    except (OSError, RuntimeError) as exc:
        raise NativeInputBlocked(f"Current-run directory cannot be resolved: {path}: {exc}") from exc

    host_root_value = os.environ.get("BRANDKIT_ARTIFACTS_ROOT")
    if host_root_value:
        host_root = Path(host_root_value).resolve(strict=True)
        try:
            resolved.relative_to(host_root)
        except ValueError as exc:
            raise NativeInputBlocked(
                f"Current-run directory {resolved} is outside BRANDKIT_ARTIFACTS_ROOT {host_root}."
            ) from exc
        lexical = path.absolute()
        try:
            relative = lexical.relative_to(host_root)
        except ValueError as exc:
            raise NativeInputBlocked(
                f"Current-run path {lexical} is not lexically contained by "
                f"BRANDKIT_ARTIFACTS_ROOT {host_root}."
            ) from exc
        current = host_root
        for component in relative.parts:
            current = current / component
            try:
                if stat.S_ISLNK(current.lstat().st_mode):
                    raise NativeInputBlocked(
                        f"Current-run directory traverses a symlink under the host artifact root: {current}"
                    )
            except OSError as exc:
                raise NativeInputBlocked(
                    f"Current-run directory component is unavailable: {current}: {exc}"
                ) from exc
    return resolved


def _read_native_brandkit(run_dir: Path) -> dict[str, Any]:
    path = run_dir / "brandkit.json"
    try:
        file_stat = path.lstat()
        if stat.S_ISLNK(file_stat.st_mode) or not stat.S_ISREG(file_stat.st_mode):
            raise NativeInputBlocked(f"Native input must be a regular non-symlink file: {path}")
        with path.open("rb") as handle:
            raw = handle.read(BRANDKIT_INPUT_MAX_BYTES + 1)
    except NativeInputBlocked:
        raise
    except OSError as exc:
        raise NativeInputBlocked(
            f"Cannot read native public brandkit {path}: {exc.__class__.__name__}: {exc}"
        ) from exc
    if len(raw) > BRANDKIT_INPUT_MAX_BYTES:
        raise NativeInputBlocked(
            f"Native public brandkit {path} exceeds the {BRANDKIT_INPUT_MAX_BYTES}-byte limit."
        )
    try:
        payload = json.loads(raw.decode("utf-8", errors="strict"))
    except (UnicodeError, json.JSONDecodeError) as exc:
        raise NativeInputBlocked(
            f"Native public brandkit {path} is not strict UTF-8 JSON: {exc.__class__.__name__}: {exc}"
        ) from exc
    if not isinstance(payload, dict):
        raise NativeInputBlocked("Native public brandkit must be a JSON object.")
    return payload


def _primary_logo_requires_hosting(preflight: Any) -> str | None:
    result = getattr(preflight, "result", None)
    if result is not None and result.outcome == "skipped-no-sidecar":
        return result.reason or "primary logo requires hosting but has no exact selected asset bytes"
    return None


def _run_pipeline(args: argparse.Namespace) -> int:
    """Finalize one native public kit without consulting legacy extraction artifacts."""

    technical_dir = Path(args.technical_dir)
    out_dir = Path(args.out_dir)
    skill_root = Path(args.skill_root)
    total_start = time.monotonic()
    timings_ms: dict[str, int] = {}
    warnings: list[str] = []
    blockers: list[str] = []
    logo_hosting_result = LogoHostingResult.not_reached()
    promoted_sha: str | None = None

    def timed(step: str, started: float) -> None:
        timings_ms[step] = int((time.monotonic() - started) * 1000)

    def report_text(status: str, *, error: str | None = None, sha: str | None = None) -> str:
        timings_ms["total"] = int((time.monotonic() - total_start) * 1000)
        payload: dict[str, Any] = {
            "status": status,
            "promoted": sha is not None,
            "warnings": list(dict.fromkeys(warnings)),
            "blockers": list(dict.fromkeys(blockers)),
            "gaps": [],
            "brandkit_sha256": sha,
            "logo_hosting": logo_hosting_result.report_record(),
            "timings_ms": timings_ms,
        }
        if error is not None:
            payload["error"] = error
        return json.dumps(payload, ensure_ascii=False, indent=2) + "\n"

    def land_report(status: str, *, error: str | None = None, sha: str | None = None) -> None:
        try:
            out_dir.mkdir(parents=True, exist_ok=True)
            tmp = _write_report_tmp(out_dir, report_text(status, error=error, sha=sha))
            os.replace(tmp, out_dir / REPORT_FILENAME)
        except OSError as exc:
            raise ReportWriteError(
                f"Cannot write finalize-report.json under {out_dir}: {exc.__class__.__name__}: {exc}",
                promoted=sha is not None,
            ) from exc

    def reserve_report(sha: str) -> Path:
        report_path = out_dir / REPORT_FILENAME
        try:
            out_dir.mkdir(parents=True, exist_ok=True)
            if report_path.exists() and not report_path.is_file():
                raise OSError(f"{report_path} is not a regular file")
            return _write_report_tmp(out_dir, report_text(STATUS_COMPOSED, sha=sha))
        except OSError as exc:
            raise ReportWriteError(
                f"Cannot reserve finalize-report.json under {out_dir}: {exc.__class__.__name__}: {exc}. Nothing was promoted.",
                promoted=False,
            ) from exc

    staging_dir: Path | None = None
    reserved_report: Path | None = None
    try:
        step = time.monotonic()
        run_dir = _validated_run_directory(technical_dir)
        if run_dir == out_dir.resolve(strict=False):
            raise NativeInputBlocked("RUN and OUT must be separate directories.")
        raw_brandkit = _read_native_brandkit(run_dir)
        timed("read_input", step)

        step = time.monotonic()
        semantic_warnings: list[str] = []
        try:
            brandkit = validate_brandkit_payload(
                raw_brandkit,
                SchemaPaths(skill_root=skill_root).skill_schema_path,
                semantic_warnings_out=semantic_warnings,
            )
        except jsonschema.ValidationError as exc:
            raise NativeInputBlocked(f"Public Brand Kit validation failed: {exc.message}") from exc
        warnings.extend(semantic_warnings)
        timed("validate_input", step)

        step = time.monotonic()
        site_match = site_match_module.evaluate_site_match(str(run_dir), args.url)
        if site_match.verdict != site_match_module.VERDICT_PROCEED:
            raise NativeInputBlocked(site_match.verdict_line)
        timed("validate_source_identity", step)

        original_svg_blockers = logo_svg_safety_blockers(brandkit)
        if original_svg_blockers:
            blockers.extend(original_svg_blockers)
            raise NativeInputBlocked("Unsafe original SVG markup was refused.")

        step = time.monotonic()
        logo_evidence = load_logo_asset_evidence(run_dir)
        warnings.extend(
            reconcile_logo_markup(
                brandkit,
                technical_dir=run_dir,
                logo_evidence=logo_evidence,
            )
        )
        logo_preflight = prepare_primary_logo(
            brandkit,
            technical_dir=run_dir,
            logo_evidence=logo_evidence,
        )
        timed("logo_preflight", step)

        step = time.monotonic()
        prehost_blockers = detect_native_brandkit_blockers(
            brandkit,
            target_url=args.url,
            logo_evidence=logo_evidence,
            runtime_asset_bindings=set(),
        )
        hosting_blocker = _primary_logo_requires_hosting(logo_preflight)
        if hosting_blocker:
            prehost_blockers.append(hosting_blocker)
        warnings.extend(
            validate_brandkit_content(
                brandkit,
                target_url=args.url,
                observed_asset_urls=set(logo_evidence.authorized_urls),
            )
        )
        timed("pre_host_policy", step)
        if prehost_blockers:
            blockers.extend(prehost_blockers)
            raise NativeInputBlocked("Native Brand Kit policy validation failed before hosting.")

        out_dir.mkdir(parents=True, exist_ok=True)
        staging_dir, staging_warnings = _create_staging_dir(out_dir)
        warnings.extend(staging_warnings)
        staged_json = staging_dir / "brandkit.json"
        staged_html = staging_dir / "brandkit.html"

        step = time.monotonic()
        logo_hosting_result = host_primary_logo(
            brandkit,
            technical_dir=run_dir,
            skill_root=skill_root,
            slug=args.slug,
            preflight=logo_preflight,
        )
        timed("logo_hosting", step)
        if (
            getattr(logo_preflight, "result", None) is None
            and logo_hosting_result.outcome != "minted"
        ):
            blockers.append(
                logo_hosting_result.reason
                or "Required primary-logo hosting did not return an authorized hosted asset."
            )
            raise NativeInputBlocked("Required primary-logo hosting failed.")

        step = time.monotonic()
        semantic_warnings = []
        try:
            brandkit = validate_brandkit_payload(
                brandkit,
                SchemaPaths(skill_root=skill_root).skill_schema_path,
                semantic_warnings_out=semantic_warnings,
            )
        except jsonschema.ValidationError as exc:
            raise NativeInputBlocked(f"Hosted Brand Kit validation failed: {exc.message}") from exc
        warnings.extend(semantic_warnings)
        runtime_bindings = (
            {logo_hosting_result.authorization_binding}
            if logo_hosting_result.authorization_binding is not None
            else set()
        )
        posthost_blockers = detect_native_brandkit_blockers(
            brandkit,
            target_url=args.url,
            logo_evidence=logo_evidence,
            runtime_asset_bindings=runtime_bindings,
        )
        if posthost_blockers:
            blockers.extend(posthost_blockers)
            raise NativeInputBlocked("Hosted Brand Kit failed exact binding validation.")
        warnings.extend(
            validate_brandkit_content(
                brandkit,
                target_url=args.url,
                observed_asset_urls=set(logo_evidence.authorized_urls),
                runtime_asset_bindings=runtime_bindings,
            )
        )
        brandkit_text = json.dumps(brandkit, ensure_ascii=False, indent=2) + "\n"
        staged_json.write_text(brandkit_text, encoding="utf-8")
        timed("post_host_validation", step)

        step = time.monotonic()
        _render_brandkit_html(skill_root, staged_json, staged_html)
        timed("render_html", step)

        candidate_sha = hashlib.sha256(brandkit_text.encode("utf-8")).hexdigest()
        reserved_report = reserve_report(candidate_sha)
        step = time.monotonic()
        _promote_pair(
            staged_json,
            staged_html,
            out_dir / "brandkit.json",
            out_dir / "brandkit.html",
            staging_dir=staging_dir,
        )
        timed("promote", step)
        promoted_sha = candidate_sha

        landing = reserved_report
        try:
            refreshed = _write_report_tmp(out_dir, report_text(STATUS_COMPOSED, sha=promoted_sha))
        except OSError:
            refreshed = None
        if refreshed is not None:
            _unlink_quietly(reserved_report)
            landing = refreshed
        reserved_report = None
        try:
            os.replace(landing, out_dir / REPORT_FILENAME)
        except OSError as exc:
            _unlink_quietly(landing)
            raise ReportWriteError(
                f"Cannot land finalize-report.json under {out_dir}: {exc.__class__.__name__}: {exc}",
                promoted=True,
            ) from exc
        return EXIT_COMPOSED
    except ReportWriteError:
        raise
    except (NativeInputBlocked, TechnicalArtifactUnreadableError) as exc:
        message = str(exc)
        if message and message not in blockers:
            blockers.append(message)
        if reserved_report is not None:
            _unlink_quietly(reserved_report)
            reserved_report = None
        land_report(STATUS_BLOCKED)
        logger.error("Native finalization blocked for slug %s: %s", args.slug, message)
        return EXIT_BLOCKERS
    except Exception as exc:  # noqa: BLE001 - CLI boundary
        if reserved_report is not None:
            _unlink_quietly(reserved_report)
            reserved_report = None
        message = f"{exc.__class__.__name__}: {exc}"
        land_report(STATUS_ERROR, error=message, sha=promoted_sha)
        logger.error("Native finalization failed for slug %s: %s", args.slug, message)
        return EXIT_ERROR
    finally:
        if staging_dir is not None:
            shutil.rmtree(staging_dir, ignore_errors=True)


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


def _printable(line: str) -> str:
    """Replace characters this stdout cannot encode before printing a report line."""

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
    """Read the selected account's Brand Kit for a post-write state comparison.

    The read goes through the finalizer's own MCP route (`logo_hosting`'s,
    the one `run` uses for `prepare_image_upload`; a PNG was minted through
    it live on 2026-09-05), so the document the witness compares is the
    tool's whole output, never the agent's transcription of it. Never raises:
    a failed read becomes an unavailable comparison line.
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
    """Keep the host's fresh read-back under OUT; writing evidence is best effort."""

    try:
        path.write_text(
            json.dumps(document, ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
        )
    except Exception:  # noqa: BLE001 - evidence is best effort; the line is not
        pass


def _cmd_report(args: argparse.Namespace) -> int:
    """Compare a promoted current-run kit with one fresh selected-account read."""
    out_dir = Path(args.out_dir)
    promoted, unavailable = report_lines_module.comparable_promoted_kit(out_dir)
    if unavailable is not None:
        line = f"Stored profile comparison unavailable ({unavailable})."
    else:
        assert promoted is not None
        readback = _read_account_brandkit()
        _write_readback_document(
            out_dir / report_lines_module.PERSIST_READBACK_FILENAME,
            readback,
        )
        try:
            line = report_lines_module.stored_profile_state_line(promoted, readback)
        except Exception:  # noqa: BLE001 - a report must retain a bounded outcome
            line = "Stored profile comparison unavailable (comparison failed)."
    print(f"{report_lines_module.REPORT_LINE_PREFIX}{_printable(line)}")
    return EXIT_COMPOSED


def _cmd_check_site(args: argparse.Namespace) -> int:
    """Check supplied current-run browser identity before evidence reuse.

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
            # A requested stage consumes the stop file by presence, so a
            # failure to write it must be loud.
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

    run = subparsers.add_parser(
        "run",
        help="Validate and promote RUN/brandkit.json from a native browser run.",
    )
    run.add_argument(
        "--technical-dir",
        required=True,
        help="Per-slug technical artifacts directory (technical/<slug>).",
    )
    run.add_argument(
        "--skill-root",
        required=True,
        help="Path to the business-profile skill directory.",
    )
    run.add_argument("--url", required=True, help="Target site URL being extracted.")
    run.add_argument("--slug", required=True, help="Slug identifying this extraction run.")
    run.add_argument(
        "--out-dir",
        required=True,
        help="Output directory for brandkit.json, brandkit.html, finalize-report.json.",
    )

    report = subparsers.add_parser(
        "report", help="Compare this run's promoted kit with the selected account.",
        allow_abbrev=False,
    )
    report.add_argument(
        "--out-dir",
        required=True,
        help="Directory holding this run's brandkit.json + finalize-report.json.",
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
    if args.command == "run":
        return _cmd_run(args)
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

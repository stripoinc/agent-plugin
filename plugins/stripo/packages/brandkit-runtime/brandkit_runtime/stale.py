"""Stale per-run artifact clearing.

Vendored from the sibling brandkit-agent repo
(``brandkit_runtime/runner.py::_clear_stale_agent_authored_outputs`` @
6077f45). The original agent-output list is retained, and this runtime also
clears the probe evidence that is reused from the bind-mounted technical
directory. Two other deliberate divergences from the source:

* the function operates on an explicit ``technical_dir`` path instead of
  resolving ``TECHNICAL_ROOT / slug`` inside the worker container;
* removal matches the readers' permissive existence test and reports what it
  could not remove instead of swallowing it. The source ran in a container
  whose workspace was rebuilt per run, so an unclearable file was transient
  there. Here the workspace is bind-mounted across runs and this list now
  includes the satellites' stop files, which are honoured on PRESENCE in any
  shape — so a swallowed failure is a permanent exit-4 brick for the slug.
"""

from __future__ import annotations

import logging
import os
import shutil
import stat
from pathlib import Path

logger = logging.getLogger(__name__)


def _exists_in_any_shape(path: Path) -> bool:
    """The READER's existence predicate, verbatim.

    ``compose._read_stop_record`` keys a hard stop on presence alone::

        # exists() follows symlinks, so a dangling one needs the explicit check.
        if not stop_path.exists() and not stop_path.is_symlink():

    This cleaner must use the same test. Anything the reader can see and the
    cleaner cannot is a permanent brick: ``prepare`` reports success, every
    later run of this slug exits 4 quoting a reason from a run that is long
    over, and nothing else in the system deletes these files.
    """
    return path.exists() or path.is_symlink()


def _clear_bsd_flags(path: Path) -> None:
    """Best-effort ``chflags 0`` on ``path`` (and, for a directory, its tree).

    A BSD ``uchg``/``schg`` file cannot be unlinked at all, however writable
    its parent is — the shape that used to hit ``except OSError: continue`` and
    survive every future ``prepare``. Linux has no ``os.chflags``; there the
    equivalent (``chattr +i``) is unreachable from Python and the removal below
    simply fails and is reported.
    """
    chflags = getattr(os, "lchflags", None) or getattr(os, "chflags", None)
    if chflags is None:
        return
    targets = [path]
    if path.is_dir() and not path.is_symlink():
        try:
            targets.extend(sorted(path.rglob("*")))
        except OSError:
            pass
    for target in targets:
        try:
            chflags(target, 0)
        except OSError:
            continue


def _restore_owner_access(path: Path) -> None:
    """Best-effort ``u+rwx`` on a directory tree so ``rmtree`` can empty it.

    Only directories need this: unlinking a read-only FILE needs write
    permission on its parent, not on the file itself.
    """
    if not path.is_dir() or path.is_symlink():
        return
    directories = [path]
    try:
        directories.extend(child for child in path.rglob("*") if child.is_dir())
    except OSError:
        pass
    for directory in directories:
        try:
            directory.chmod(directory.stat().st_mode | stat.S_IRWXU)
        except OSError:
            continue


def _remove_once(path: Path) -> None:
    """Remove ``path`` whatever shape it has. Propagates ``OSError``."""
    if path.is_dir() and not path.is_symlink():
        # NOT ignore_errors: a directory that resists removal must be reported,
        # never swallowed — that swallowing is what made the stop file
        # unclearable.
        shutil.rmtree(path)
    else:
        # Covers a regular file, a fifo/socket/device, and a symlink of either
        # kind: unlink removes the link itself, so a DANGLING symlink (which
        # exists() denies and the reader still honours) goes too.
        path.unlink()


def _force_remove(path: Path) -> None:
    """Remove ``path``, retrying once after clearing flags/modes.

    Raises the second ``OSError`` when the path survives, so the caller can
    report it instead of leaving a stop file the reader will honour forever.
    """
    try:
        _remove_once(path)
        return
    except OSError:
        pass
    _clear_bsd_flags(path)
    _restore_owner_access(path)
    _remove_once(path)


# Every per-run artifact `prepare` clears from a technical dir, as one
# named list so a producer and its entry can be pinned to each other
# (`test_the_clear_list_names_the_producers_constants`). Adding a
# producer without adding its filename here leaves the PREVIOUS site's
# evidence in a bind-mounted workspace.
STALE_PER_RUN_ARTIFACTS: tuple[str, ...] = (
    "brandkit.extraction.json",
    "brand-voice.json",
    "business-context.json",
    # The satellites' hard-stop signals (compose.SATELLITE_STOP_FILES).
    # They MUST be cleared alongside the outputs they stand in for: a stop
    # file is a per-run verdict ("these artifacts describe another site"),
    # and the workspace is bind-mounted across runs, so a leftover one
    # would block every future extraction of this slug at exit 4 with a
    # reason belonging to a run that is long over.
    "brand-voice.stop.json",
    "business-context.stop.json",
    "brandkit.extraction.draft.json",
    # `brandkit.extraction.reviewed-base.json` is the agent's snapshot
    # of the extraction.json AFTER its own review pass — it uses this
    # as a "previous-good baseline" to diff and shortcut subsequent
    # runs. When stale, the agent's `cp reviewed-base extraction.json`
    # shortcut bypasses the fresh draft entirely (one observed run:
    # the dimensions plumbing fix landed in the draft but never
    # reached the assembled brandkit because the agent restored a
    # pre-fix reviewed-base verbatim and skipped re-authoring).
    "brandkit.extraction.reviewed-base.json",
    "assembly-diagnostics.json",
    "assembly-diagnostics.summary.json",
    # The scaffold's review packet: the identity, logos, contacts,
    # socials, links and languages of whatever site was extracted here
    # last. The contract tells the agent to READ it before authoring and
    # to copy its logo rows, so a survivor is the previous brand's mark
    # offered as this run's candidate.
    "review-packet.json",
    # The two Phase-5 documents the 5c/5d exec cells write. `report` reads
    # them by path, so a survivor would let a run that never reached
    # Phase 5 mint a persist line out of the PREVIOUS run's write and
    # read-back.
    "persist-write.json",
    "persist-readback.json",
    "assembly-diagnostics-shrinkage-recovery.json",
    "product-card-probe-binding.json",
    # Every artifact written or consumed as evidence by the homepage pass
    # and its focused fallbacks. A partial new pass is allowed to publish
    # the evidence it actually wrote, but it must never inherit a file from
    # the prior pass. Directories are intentional: logo sidecars and
    # scratch probes are run-local evidence too.
    "home.png",
    "capture.json",
    "dom.json",
    "background-styles.json",
    "text-styles.json",
    "text-styles.probed.json",
    "salient-text.json",
    "button-styles.json",
    "button-styles.focused.json",
    # Diagnostics-only, but a survivor is worse than an absence: an
    # operator tabulating a canary would read the PREVIOUS run's hover
    # timings and interceptors as this run's. The pass rewrites it on
    # every run that reaches the button phase, so only a degraded pass
    # can leave one behind - exactly the run whose numbers must not be
    # trusted.
    "button-styles.diagnostics.json",
    "product-card-styles.json",
    "product-card-styles.recovery.json",
    "logo-assets.json",
    "logo-assets",
    "page-signals.json",
    "language-subtree.json",
    "homepage-pass-status.json",
    "run-notes.json",
    "scratch",
    # Agent-authored styling recovery is bound to capture bytes, but those
    # bytes can legitimately repeat across runs. Clearing both halves at
    # prepare keeps the binding current-run rather than merely same-input.
    "agent-role-recovery.request.json",
    "agent-role-recovery.json",
    # product-data.json must be cleared because the finalizer EMBEDS it
    # into brandkit.json as brand.products (load_products /
    # compose_final_brandkit) — a stale bind-mounted copy from a prior run
    # would be embedded as if collected this turn. The cached brandkit.json
    # itself is intentionally NOT cleared (this function only touches
    # the technical dir by design), so a customise / satellite turn carries
    # the previously-embedded brand.products forward untouched.
    "product-data.json",
)


def clear_stale_agent_authored_outputs(
    technical_dir: Path,
    *,
    failures_out: list[str] | None = None,
) -> list[str]:
    """Clear every per-run intermediate from any prior run for this slug.

    The artifacts cache (`RUNTIME_ARTIFACTS_CACHE_HOST_DIR` -> `/app/artifacts`,
    symlinked to `/workspace/artifacts` in the source runtime) is bind-mounted
    across runs by design so customise can read `brandkit.json` from a prior
    extraction. But that same bind-mount means `brandkit.extraction.json`,
    `brand-voice.json`, and `brandkit.extraction.draft.json` from a prior
    extraction survive into a new extraction run. The agent's SKILL.md Phase 3
    contract treats an existing `brandkit.extraction.json` as authoritative
    ("patch only if diagnostics require"), so probe-side improvements can ship
    in the fresh `product-card-styles.json` and the fresh scaffolder draft yet
    fail to reach the final brandkit because the agent never re-authors.

    Surfaced concretely by a 2026-05-10 batch run: 4 of 6 sites shipped a
    `brandkit.extraction.json` bit-identical to the previous batch (md5 hash
    match), even though the probe and scaffolder ran fresh with new
    selectors, walker logic, and candidate filters. A representative case:
    the probe captured 40 strikethrough rows with `oldPrice.color: "#999999"`,
    the scaffolder draft populated 12 productCard entries each carrying that
    color, but the agent normalized the cached extraction.json (which had
    empty oldPrice fields from a run that predated the selector fix) and
    shipped the stale data.

    Probe evidence must be cleared for the same reason. ``homepage-pass.js``
    can fail after writing only a new status file; if old ``capture.json`` or
    ``page-signals.json`` survives, the factual gate would otherwise license a
    contact or asset from the prior site as though this run observed it.

    Customise jobs don't read these files (they read `brandkit.json`, the
    final output, from `results/<slug>/`), so unconditionally clearing on
    every extraction start is safe — it forces the agent to author from
    current evidence whether the workflow is extract or customise.

    Returns the list of cleared filenames (relative paths) for diagnostics.

    Removal mirrors the readers' EXISTENCE test (:func:`_exists_in_any_shape`)
    and removes whatever shape it finds — a directory, a fifo, a dangling
    symlink, a ``uchg``-flagged file — because the satellites' stop files are
    honoured on presence alone. A path that still resists is appended to
    ``failures_out`` (path, cause, and the exact remedy) instead of being
    swallowed: the ``prepare`` subcommand turns a non-empty ``failures_out``
    into a non-zero exit, so a prepare that could not clear a stop file can
    never report success.
    """
    cleared: list[str] = []
    if not technical_dir.is_dir():
        return cleared
    filenames = list(STALE_PER_RUN_ARTIFACTS)
    try:
        filenames.extend(
            child.name
            for child in sorted(technical_dir.iterdir())
            if child.name.lower().endswith(
                (".svgpath.json", "-svg-path.json", ".svg-path.json")
            )
            and child.name not in filenames
        )
    except OSError as exc:
        message = (
            f"Could not inventory stale per-run artifacts in {technical_dir} "
            f"({exc.__class__.__name__}: {exc}). This run cannot prove that "
            "prior-run logo sidecars were cleared. Restore directory access "
            "and run prepare again."
        )
        logger.error("%s", message)
        if failures_out is not None:
            failures_out.append(message)
        return cleared

    for filename in filenames:
        path = technical_dir / filename
        if not _exists_in_any_shape(path):
            continue
        try:
            _force_remove(path)
        except OSError as exc:
            # Never swallowed. A file that survives `prepare` is either a
            # stale artifact the agent must reconcile or — for the stop files
            # — a permanent exit-4 brick, and the only way the operator learns
            # about it is this message plus the non-zero exit it drives.
            #
            # The remedy is addressed to the OPERATOR, and names no command,
            # because this message used to end `chflags -R nouchg <p>
            # 2>/dev/null; chmod -R u+w <p>; rm -rf <p>` and that was wrong
            # three ways. (1) The agent that reads it cannot run it: the
            # runtime refuses a forced `rm` before any sandbox check
            # (`DangerousCommandMatch::ForcedRm` -> `Decision::Forbidden`
            # under `approvalPolicy: never`), and it decomposes a `sh -lc`
            # compound to find one, so the whole line dies on its third
            # clause. (2) The agent must not run it anyway: a non-zero
            # `prepare` means STOP, and a runnable removal on a stop path
            # invites clearing the brick and carrying on. (3) It repeats what
            # `_force_remove` just did in Python and failed at -- flags, owner
            # access on the directories, then remove -- so the shapes that
            # reach here are the ones neither can fix from this process: the
            # PARENT directory's mode or owner, a Linux immutable flag (which
            # `_clear_bsd_flags` cannot even see -- `os.chflags` is BSD-only,
            # and so is the `chflags` binary the old line called), or a
            # read-only mount. Those are what the operator is pointed at.
            message = (
                f"Could not clear the stale agent-authored artifact {path} "
                f"({exc.__class__.__name__}: {exc}). This run's extraction "
                "would read a file left by an earlier run. `prepare` already "
                "cleared the file flags where the platform allows it, "
                "restored owner access on the directories and retried, so "
                "what survived needs the OPERATOR, not the agent: clear "
                f"{path} on the workspace host, checking the mode and owner "
                "of its PARENT directory, an immutable flag (Linux `chattr`, "
                "macOS `chflags`), and whether the volume is mounted "
                "read-only."
            )
            logger.error("%s", message)
            if failures_out is not None:
                failures_out.append(message)
            continue
        cleared.append(filename)
    return cleared

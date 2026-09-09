"""Block on ``homepage-pass-status.json`` and print ONE line about it.

The agent polls the homepage pass 4.6×/run today with an ad-hoc ``sed``/``jq``
read, and the 5-minute staleness rule it is supposed to apply lives in prose.
This puts both in code: one call blocks up to ``DEFAULT_TIMEOUT_MS``, applies
the staleness rule itself, and prints a single JSON line.

The block has to end before the agent's exec call yields, or the line lands in
a chunk the agent never receives. That yield is the call's own
``yield_time_ms`` argument -- 10 s by DEFAULT, and both runtimes take it -- so
the contract asks the wait cell for 15 s, and ``DEFAULT_TIMEOUT_MS`` is the
ceiling that keeps the line inside a 10 s yield when a caller forgets to ask.

It is READ-ONLY by construction: nothing in this module opens a file for
writing, creates a directory, or removes anything. The homepage pass owns every
file under the technical dir while it runs, and a poller that touched one could
race the producer it is watching.
"""

from __future__ import annotations

import json
import time
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Callable


STATUS_FILENAME = "homepage-pass-status.json"

TERMINAL_STATUSES: frozenset[str] = frozenset({"completed", "blocked", "failed"})

# A pass that has not written its status file yet is not missing — it is
# starting. The producer writes the first status within a second or two; this
# grace window is what separates "too early" from "there is nothing here".
MISSING_GRACE_MS = 5_000

# The one number that says how long a single ``wait`` may block, and the
# ceiling the CLI clamps ``--timeout-ms`` to. It exists because the agent's
# exec call yields after its ``yield_time_ms`` argument, whose DEFAULT is 10 s
# (both runtimes take the argument as a plain parameter; measured on the
# 2026-09-03 production rollouts: 23 wait calls at 10000, 7 pass calls at
# 30000): a call that blocks past the yield still prints its line, but into a
# chunk the caller never receives, so the caller has to spend a second request
# asking for the same answer. Measured over 47 runs of this skill at the old
# 12 000: 4.34 of every 4.5 `wait` cells came back with no status line at all,
# and 3.55 of them were followed by exactly such a second request -- about 12%
# of the run's model calls, spent re-asking a question the first call had
# already answered.
#
# 8 000 rather than 10 000 because the interpreter start-up (0.3 s here, up to
# ~1.4 s on the runtime container) is paid on top of it, and the poll loop
# overshoots its deadline by up to one interval. Measured end to end on this
# machine: 12 000 -> 12.41 s of wall clock (outside the cap), 8 000 -> 8.40 s.
# On the runtime container at 8 000 (2026-09-05, two attended runs) the call
# took 8.27-9.83 s end to end and 2 of 13 still crossed a 10 s yield, which is
# why the contract asks the wait cell for ``yield_time_ms: 15000`` rather than
# trusting the default; this ceiling is the net under a caller that forgets.
#
# Lowering it does not change WHAT this module reports. Replayed over the 100
# distinct real `homepage-pass-status.json` payloads in the run corpus and 1007
# running shapes derived from them, plus the missing / unreadable / stale /
# frozen-but-fresh branches, the printed line is identical at 12 000 and 8 000
# in every field except ``elapsedMs``, which reports this call's own duration.
# The single behavioural difference is a pass that turns terminal between the
# two deadlines: that call now answers "running", which is the answer the
# caller already had to ask twice for.
DEFAULT_TIMEOUT_MS = 8_000
DEFAULT_STALE_AFTER_MS = 300_000
POLL_INTERVAL_MS = 1_000


@dataclass(frozen=True)
class WaitOutcome:
    """The single line ``wait`` prints, plus the status that maps to an exit."""

    status: str
    payload: dict[str, Any]

    @property
    def line(self) -> str:
        return json.dumps(self.payload, ensure_ascii=False)


def _read_status(path: Path) -> dict[str, Any] | None:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return None
    return payload if isinstance(payload, dict) else None


def _int_or_none(value: Any) -> int | None:
    if isinstance(value, bool):
        return None
    if isinstance(value, int):
        return value
    if isinstance(value, float):
        return int(value)
    return None


def _project(status: dict[str, Any], *, elapsed_ms: int) -> dict[str, Any]:
    completed = status.get("completedPhases")
    return {
        "status": status.get("status"),
        "currentPhase": status.get("currentPhase"),
        "currentPhaseElapsedMs": status.get("currentPhaseElapsedMs"),
        "completedPhases": len(completed) if isinstance(completed, list) else 0,
        "readyForAssembly": status.get("readyForAssembly"),
        "blockedBySecurityInterstitial": status.get("blockedBySecurityInterstitial"),
        "error": status.get("error"),
        "elapsedMs": elapsed_ms,
    }


def wait_for_homepage_pass(
    technical_dir: Path,
    *,
    timeout_ms: int = DEFAULT_TIMEOUT_MS,
    stale_after_ms: int = DEFAULT_STALE_AFTER_MS,
    poll_interval_ms: int = POLL_INTERVAL_MS,
    monotonic_ms: Callable[[], int] | None = None,
    wall_ms: Callable[[], int] | None = None,
    sleep: Callable[[float], None] | None = None,
) -> WaitOutcome:
    """Poll until a terminal status, the timeout, staleness, or a missing file.

    ``monotonic_ms`` measures this call's own elapsed time; ``wall_ms`` is the
    clock ``updatedAtMs`` is expressed in. They are separate arguments because
    they answer different questions and because a test must drive both.
    """

    monotonic_ms = monotonic_ms or (lambda: int(time.monotonic() * 1000))
    wall_ms = wall_ms or (lambda: int(time.time() * 1000))
    sleep = sleep or time.sleep

    status_path = Path(technical_dir) / STATUS_FILENAME
    started = monotonic_ms()
    previous_progress: tuple[Any, Any] | None = None
    last_projection: dict[str, Any] | None = None

    while True:
        elapsed = monotonic_ms() - started
        status = _read_status(status_path)

        if status is None:
            if elapsed >= MISSING_GRACE_MS:
                return WaitOutcome(
                    "missing",
                    {
                        "status": "missing",
                        "currentPhase": None,
                        "currentPhaseElapsedMs": None,
                        "completedPhases": 0,
                        "readyForAssembly": False,
                        "blockedBySecurityInterstitial": False,
                        "error": f"{status_path} is missing or unreadable",
                        "elapsedMs": elapsed,
                    },
                )
            projection = {
                "status": "running",
                "currentPhase": None,
                "currentPhaseElapsedMs": None,
                "completedPhases": 0,
                "readyForAssembly": False,
                "blockedBySecurityInterstitial": False,
                "error": None,
                "elapsedMs": elapsed,
            }
        else:
            projection = _project(status, elapsed_ms=elapsed)
            reported = projection["status"]
            if isinstance(reported, str) and reported in TERMINAL_STATUSES:
                return WaitOutcome(reported, projection)

            progress = (status.get("currentPhase"), status.get("currentPhaseElapsedMs"))
            updated = _int_or_none(status.get("updatedAtMs"))
            frozen = previous_progress is not None and previous_progress == progress
            aged = updated is not None and (wall_ms() - updated) > stale_after_ms
            # BOTH conditions, deliberately: a phase that reports the same
            # elapsed twice inside one second is normal, and a status file
            # older than the window whose phase is still advancing is a slow
            # pass, not a dead one.
            if frozen and aged:
                stale = dict(projection)
                stale["status"] = "stale"
                return WaitOutcome("stale", stale)
            previous_progress = progress

        last_projection = projection
        if monotonic_ms() - started >= timeout_ms:
            timed_out = dict(last_projection)
            timed_out["status"] = "running"
            timed_out["elapsedMs"] = monotonic_ms() - started
            return WaitOutcome("running", timed_out)
        sleep(poll_interval_ms / 1000)

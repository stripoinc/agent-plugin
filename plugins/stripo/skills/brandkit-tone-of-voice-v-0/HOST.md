# Host notes: Claude Code and Codex

This skill is installed by the Stripo plugin and runs as a satellite of `brandkit-extraction-v-0`.

- `${BRANDKIT_SKILL_ROOT}` is the sibling `brandkit-extraction-v-0` directory — this file's parent's
  parent, then `brandkit-extraction-v-0`. It owns the finalizer launcher this skill calls.
- `${TECH}` is the absolute path on the `technical dir:` line of your task envelope. Use it
  verbatim; never build it from an environment variable.
- The finalizer needs Python 3.11 or 3.12 (not 3.13+) with the runtime's dependencies. The extraction
  skill's `HOST.md` has the one-time install command; when `finalize.py` reports a missing
  dependency, that is the command to run.
- Write only `brand-voice.json`, in `${TECH}`.

There is no Slack thread and no approval card in this host. This skill performs no MCP write, so
nothing here is gated.

#!/usr/bin/env node

// Extraction-stage orchestrator. Thin dispatch wrapper since the
// BACKLOG-item-15 refactor: parses argv via the shared helpers module,
// then delegates to `runScaffold` (scaffold-pass.js) or `runNormalize`
// (normalize-pass.js). The pass bodies plus every shared helper they
// call live in `scripts/lib/`:
//
//   - `scripts/lib/extraction-pass-helpers.js` — argv parsing, fs I/O,
//     normalisation primitives, `scaffoldPayload`, the
//     `normalizeExtraction` post-process chain, diagnostic builders,
//     schema reader, AJV validation.
//   - `scripts/lib/scaffold-pass.js` — `runScaffold(args)` body verbatim
//     from the pre-refactor orchestrator (lines 831-972 of the
//     pre-refactor file).
//   - `scripts/lib/normalize-pass.js` — `runNormalize(args)` body
//     verbatim from the pre-refactor orchestrator (lines 974-1209). The
//     synth-helper ordering invariants documented in SKILL.md (header-
//     link strip → backfill → logo-SVG synth → text-color synthesis
//     chain → bg-hint synth → variant-decision chain) are preserved
//     verbatim — the parity test in
//     `tests/test_assemble_extraction_stage.py` catches any reordering.
//
// Adding a new helper / synthesiser: put the pure logic in a sibling
// `scripts/lib/*.js` file and import it from `scaffold-pass.js` or
// `normalize-pass.js` (or from `extraction-pass-helpers.js` when both
// passes need it). Keep this orchestrator small — the size guard in
// `tests/test_assemble_extraction_stage.py` is set tight on purpose.

import { USAGE_TEXT, parseArgs } from "./lib/extraction-pass-helpers.js";
import { writeStdoutText } from "./lib/stdout-json.js";
import { runScaffold } from "./lib/scaffold-pass.js";
import { runNormalize } from "./lib/normalize-pass.js";

async function main() {
  const args = parseArgs(process.argv.slice(2));
  // `--help` short-circuits BEFORE either pass, so it never touches the
  // filesystem and never needs a --mode. The text lives in the helpers module
  // (see USAGE_TEXT) to keep this file under its size guard.
  if (args.help) { writeStdoutText(USAGE_TEXT); return; }
  if (args.mode === "scaffold") await runScaffold(args);
  else await runNormalize(args);
}

main().catch((error) => { process.stderr.write(`${error instanceof Error ? error.stack || error.message : String(error)}\n`); process.exit(1); });

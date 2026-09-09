#!/usr/bin/env node

import { collectTextStyles, openPage, parseArgs, selectorSummary, writeJson } from "./lib.js";
import { buildProbedSelectorsRecord, probedSelectorsPathFor } from "./lib/probed-selectors.js";

const args = parseArgs(process.argv.slice(2));
selectorSummary(args.selectors);

const { browser, page } = await openPage(args);

try {
  const result = await collectTextStyles(page, args.selectors);

  // Sidecar FIRST, capture second. A kill between the two writes must fail
  // CLOSED: a narrow sidecar beside the previous wide capture still finds
  // the rows, so roles grade `high` and nothing is lost. The other order
  // leaves a narrow capture under a stale WIDE sidecar, which is the one
  // state that mints a false gap — the exact failure the sidecar exists to
  // prevent, running backwards. This pipeline does kill probes on timeout.
  const probedPath = probedSelectorsPathFor(args.out);
  if (probedPath) {
    await writeJson(buildProbedSelectorsRecord(args.selectors), probedPath, args.pretty);
  }
  await writeJson(result, args.out, args.pretty);
} finally {
  await browser.close();
}

#!/usr/bin/env node

import {
  collectProductCardStyles,
  deriveSiblingArtifactPath,
  openPage,
  parseArgs,
  selectorSummary,
  writeJson,
} from "./lib.js";

const args = parseArgs(process.argv.slice(2));
selectorSummary(args.selectors);

const { browser, page } = await openPage(args);

try {
  const { rows, recoverySummary } = await collectProductCardStyles(page, args);
  const recoveryPath = deriveSiblingArtifactPath(args.out, "product-card-styles.recovery.json");
  if (recoveryPath) {
    await writeJson(recoverySummary, recoveryPath, args.pretty);
  }
  process.stderr.write(
    `Recovery summary: ${JSON.stringify({
      finalPhase: recoverySummary.finalPhase,
      finalRowCount: recoverySummary.finalRowCount,
      failureSignals: recoverySummary.failureSignals,
    })}\n`,
  );

  await writeJson(rows, args.out, args.pretty);
} finally {
  await browser.close();
}

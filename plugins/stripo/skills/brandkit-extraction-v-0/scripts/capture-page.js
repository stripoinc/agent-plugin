#!/usr/bin/env node

import {
  collectCaptureArtifacts,
  deriveCaptureMetadataPath,
  openPage,
  parseArgs,
  writeJson,
} from "./lib.js";

const args = parseArgs(process.argv.slice(2));
const {
  browser,
  page,
  observedAssetUrls: pageObservedAssetUrls,
  observedRequests,
  mainFrameNavigations,
  executedActions,
} = await openPage(args);

try {
  const screenshotPath =
    args.screenshot || (args.out && args.out.toLowerCase().endsWith(".png") ? args.out : "");
  const result = await collectCaptureArtifacts(page, {
    args,
    screenshotPath,
    observedAssetUrls: pageObservedAssetUrls,
    observedRequests,
    mainFrameNavigations,
    executedActions,
  });

  const capturePath = deriveCaptureMetadataPath(screenshotPath);
  if (capturePath) {
    await writeJson(result, capturePath, args.pretty);
  }

  const jsonOut = screenshotPath && args.out === screenshotPath ? "" : args.out;
  await writeJson(result, jsonOut, args.pretty);
} finally {
  await browser.close();
}

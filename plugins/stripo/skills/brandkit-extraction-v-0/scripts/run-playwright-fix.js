#!/usr/bin/env node

import { openPage, parseArgs, writeJson, writeScreenshot } from "./lib.js";

const args = parseArgs(process.argv.slice(2));

if (!args.actionsFile) {
  throw new Error("Missing required flag: --actions-file <path>");
}

const { browser, page, executedActions } = await openPage(args);

try {
  const screenshotPath =
    args.screenshot || (args.out && args.out.toLowerCase().endsWith(".png") ? args.out : "");
  await writeScreenshot(page, screenshotPath);

  await writeJson(
    {
      url: page.url(),
      title: await page.title(),
      screenshotPath,
      actionsFile: args.actionsFile,
      actionsExecuted: executedActions,
    },
    screenshotPath && args.out === screenshotPath ? "" : args.out,
    args.pretty,
  );
} finally {
  await browser.close();
}

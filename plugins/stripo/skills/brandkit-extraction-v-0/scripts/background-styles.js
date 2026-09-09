#!/usr/bin/env node

import { collectBackgroundStyles, openPage, parseArgs, selectorSummary, writeJson } from "./lib.js";

const args = parseArgs(process.argv.slice(2));
selectorSummary(args.selectors);

const { browser, page } = await openPage(args);

try {
  const result = await collectBackgroundStyles(page, args.selectors);

  await writeJson(result, args.out, args.pretty);
} finally {
  await browser.close();
}

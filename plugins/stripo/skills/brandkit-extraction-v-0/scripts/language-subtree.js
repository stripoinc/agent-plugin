#!/usr/bin/env node

import { collectLanguageSubtree, openPage, parseArgs, selectorSummary, writeJson } from "./lib.js";

const args = parseArgs(process.argv.slice(2));

if (!args.selectors.length) {
  throw new Error("Missing required flag: --selector <css>");
}

selectorSummary(args.selectors);

const { browser, page } = await openPage(args);

try {
  const payload = await collectLanguageSubtree(page, args.selectors);

  await writeJson(payload, args.out, args.pretty);
} finally {
  await browser.close();
}

#!/usr/bin/env node

import { collectDomHierarchy, openPage, parseArgs, writeJson } from "./lib.js";

const args = parseArgs(process.argv.slice(2));
const { browser, page } = await openPage(args);

try {
  const tree = await collectDomHierarchy(page);

  await writeJson(tree, args.out, args.pretty);
} finally {
  await browser.close();
}

#!/usr/bin/env node
import {generateMetadata} from "./lib/plugin.mjs";

try {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length === 1 && args[0] !== "--check")) throw new Error("Usage: node scripts/generate-metadata.mjs [--check]");
  const count = generateMetadata(undefined, {check: args.includes("--check")});
  console.log(`${args.includes("--check") ? "Checked" : "Generated"} ${count} metadata, host and integrity files.`);
} catch (error) {
  console.error(`generate-metadata: ${error.message}`);
  process.exitCode = 1;
}

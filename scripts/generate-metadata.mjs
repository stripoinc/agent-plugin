#!/usr/bin/env node
import {generateMetadata} from "./lib/plugin.mjs";

try {
  const args = process.argv.slice(2);
  if (args.length > 1 || (args.length === 1 && args[0] !== "--check")) throw new Error("Usage: node scripts/generate-metadata.mjs [--check]");
  generateMetadata(undefined, {check: args.includes("--check")});
  console.log(`${args.includes("--check") ? "Checked" : "Generated"} Codex compatibility manifest and release inventory.`);
} catch (error) {
  console.error(`generate-metadata: ${error.message}`);
  process.exitCode = 1;
}

#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

// THE reducer, shared with `lib/logo-asset-capture.js` so the CLI and the
// render-time capture path emit the identical payload shape.
import { svgPathPayloadFromMarkup } from "./lib/svg-path-extract.js";

function parseArgs(argv) {
  const args = {
    svgFile: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--svg-file") {
      args.svgFile = argv[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (token === "--pretty") {
      args.pretty = true;
    }
  }

  if (!args.svgFile) {
    throw new Error("Missing required flag: --svg-file <path>");
  }

  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const absolutePath = path.resolve(args.svgFile);
  const svg = await fs.readFile(absolutePath, "utf8");

  // Stdout shape is a contract (`{svgFile, svgPath, pathCount, shapes,
  // shapeCount}`) — the reducer returns it verbatim.
  const result = svgPathPayloadFromMarkup(svg, { svgFile: absolutePath });

  process.stdout.write(`${JSON.stringify(result, null, args.pretty ? 2 : 0)}\n`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

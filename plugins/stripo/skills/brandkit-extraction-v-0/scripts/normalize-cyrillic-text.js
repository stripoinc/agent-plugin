#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

function parseArgs(argv) {
  const args = {
    input: null,
    out: null,
    pretty: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--input") {
      args.input = argv[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (token === "--out") {
      args.out = argv[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (token === "--pretty") {
      args.pretty = true;
    }
  }

  if (!args.input) {
    throw new Error("Missing required flag: --input <path>");
  }

  return args;
}

const LATIN_TO_CYRILLIC = new Map([
  ["A", "\u0410"],
  ["a", "\u0430"],
  ["B", "\u0412"],
  ["C", "\u0421"],
  ["c", "\u0441"],
  ["E", "\u0415"],
  ["e", "\u0435"],
  ["H", "\u041d"],
  ["K", "\u041a"],
  ["k", "\u043a"],
  ["M", "\u041c"],
  ["O", "\u041e"],
  ["o", "\u043e"],
  ["P", "\u0420"],
  ["p", "\u0440"],
  ["T", "\u0422"],
  ["X", "\u0425"],
  ["x", "\u0445"],
  ["Y", "\u0423"],
  ["y", "\u0443"],
  ["I", "\u0406"],
  ["i", "\u0456"],
]);

function normalizeToken(token) {
  const chars = [...token];
  const cyrillicCount = chars.filter((char) => /\p{Script=Cyrillic}/u.test(char)).length;
  const latinConfusableCount = chars.filter((char) => LATIN_TO_CYRILLIC.has(char)).length;

  if (!cyrillicCount || !latinConfusableCount) {
    return token;
  }

  return chars.map((char) => LATIN_TO_CYRILLIC.get(char) || char).join("");
}

function normalizeString(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g, " ")
    .replace(/[\u2018\u2019`´]/g, "'")
    .replace(/[\u201C\u201D\u00AB\u00BB]/g, '"')
    .replace(/\s+/g, " ")
    .trim()
    .split(/(\s+)/)
    .map((token) => (/^\s+$/.test(token) ? token : normalizeToken(token)))
    .join("");
}

function containsCyrillic(value) {
  return /\p{Script=Cyrillic}/u.test(String(value ?? ""));
}

function normalizeValue(value) {
  if (typeof value === "string") {
    if (!containsCyrillic(value)) {
      return value;
    }
    return normalizeString(value);
  }
  if (Array.isArray(value)) {
    return value.map(normalizeValue);
  }
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, nested]) => [key, normalizeValue(nested)]));
  }
  return value;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = path.resolve(args.input);
  const payload = JSON.parse(await fs.readFile(inputPath, "utf8"));
  const normalized = normalizeValue(payload);
  const output = JSON.stringify(normalized, null, args.pretty ? 2 : 0);

  if (args.out) {
    const outPath = path.resolve(args.out);
    await fs.mkdir(path.dirname(outPath), { recursive: true });
    await fs.writeFile(outPath, output, "utf8");
  }

  process.stdout.write(`${output}\n`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

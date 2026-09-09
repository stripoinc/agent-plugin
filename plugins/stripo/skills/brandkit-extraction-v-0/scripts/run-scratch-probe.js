#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";

const STATUS_VALUES = new Set(["answered", "inconclusive", "blocked"]);
const DEFAULT_ARTIFACTS_ROOT = process.env.BRANDKIT_ARTIFACTS_ROOT || "";
const DEFAULT_TIMEOUT_MS = 20000;
const MIN_TIMEOUT_MS = 1000;
const MAX_TIMEOUT_MS = 60000;
const MAX_MAIN_OUTPUT_BYTES = 50 * 1024;
const MAX_SCRATCH_WRITE_BYTES = 100 * 1024;
const MAX_SUMMARY_LENGTH = 1200;
const MAX_FINDINGS = 20;

function parseArgs(argv) {
  const args = {
    url: "",
    slug: "",
    artifactsRoot: DEFAULT_ARTIFACTS_ROOT,
    script: "",
    input: "",
    output: "",
    question: "",
    timeoutMs: DEFAULT_TIMEOUT_MS,
    pretty: false,
    withBrowser: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--url") {
      args.url = argv[index + 1] ?? "";
      index += 1;
    } else if (token === "--slug") {
      args.slug = argv[index + 1] ?? "";
      index += 1;
    } else if (token === "--artifacts-root") {
      args.artifactsRoot = argv[index + 1] ?? args.artifactsRoot;
      index += 1;
    } else if (token === "--script") {
      args.script = argv[index + 1] ?? "";
      index += 1;
    } else if (token === "--input") {
      args.input = argv[index + 1] ?? "";
      index += 1;
    } else if (token === "--output" || token === "--out") {
      args.output = argv[index + 1] ?? "";
      index += 1;
    } else if (token === "--question") {
      args.question = argv[index + 1] ?? "";
      index += 1;
    } else if (token === "--timeout-ms") {
      args.timeoutMs = Number.parseInt(argv[index + 1] ?? "", 10) || args.timeoutMs;
      index += 1;
    } else if (token === "--with-browser") {
      args.withBrowser = true;
    } else if (token === "--pretty") {
      args.pretty = true;
    }
  }

  args.artifactsRoot = path.resolve(args.artifactsRoot || DEFAULT_ARTIFACTS_ROOT);
  args.script = args.script ? path.resolve(args.script) : "";
  args.input = args.input ? path.resolve(args.input) : "";
  args.timeoutMs = Math.min(Math.max(args.timeoutMs, MIN_TIMEOUT_MS), MAX_TIMEOUT_MS);
  return args;
}

function compactError(error) {
  return String(error?.message || error || "unknown error").replace(/\s+/g, " ").trim().slice(0, 500);
}

function relativeInside(parentPath, childPath) {
  const relative = path.relative(parentPath, childPath);
  return Boolean(relative) && !relative.startsWith("..") && !path.isAbsolute(relative);
}

function assertInside(parentPath, childPath, label) {
  if (!relativeInside(parentPath, childPath) && path.resolve(parentPath) !== path.resolve(childPath)) {
    throw new Error(`${label} must be inside ${parentPath}`);
  }
}

function resolveOutputPath(rawOutput, scratchDir, scriptPath) {
  if (!rawOutput) {
    const baseName = path.basename(scriptPath).replace(/\.(?:mjs|cjs|js)$/i, "");
    return path.join(scratchDir, `${baseName}.output.json`);
  }
  return path.isAbsolute(rawOutput) ? path.resolve(rawOutput) : path.resolve(scratchDir, rawOutput);
}

async function readJson(filePath) {
  return JSON.parse(await fs.readFile(filePath, "utf8"));
}

async function writeBoundedJson(filePath, payload, pretty, maxBytes = MAX_SCRATCH_WRITE_BYTES) {
  const serialized = `${JSON.stringify(payload, null, pretty ? 2 : 0)}\n`;
  const byteLength = Buffer.byteLength(serialized, "utf8");
  if (byteLength > maxBytes) {
    throw new Error(`Scratch JSON output is ${byteLength} bytes, above limit ${maxBytes}`);
  }
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, serialized, "utf8");
  return byteLength;
}

function validateProbeResult(value, fallbackQuestion) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new Error("Scratch probe must return a JSON object");
  }
  const status = STATUS_VALUES.has(value.status) ? value.status : "";
  if (!status) {
    throw new Error(`Scratch probe status must be one of: ${[...STATUS_VALUES].join(", ")}`);
  }
  const question = typeof value.question === "string" && value.question.trim()
    ? value.question.trim()
    : fallbackQuestion;
  if (!question) {
    throw new Error("Scratch probe output needs a question");
  }
  const publicSafeSummary = typeof value.publicSafeSummary === "string"
    ? value.publicSafeSummary.trim()
    : "";
  if (!publicSafeSummary) {
    throw new Error("Scratch probe output needs publicSafeSummary");
  }
  if (publicSafeSummary.length > MAX_SUMMARY_LENGTH) {
    throw new Error(`publicSafeSummary is longer than ${MAX_SUMMARY_LENGTH} characters`);
  }
  const findings = Array.isArray(value.findings) ? value.findings : [];
  if (findings.length > MAX_FINDINGS) {
    throw new Error(`Scratch probe returned ${findings.length} findings, above limit ${MAX_FINDINGS}`);
  }
  const rawConfidence = Number(value.confidence);
  if (!Number.isFinite(rawConfidence)) {
    throw new Error("Scratch probe output needs numeric confidence");
  }
  const confidence = Math.max(0, Math.min(1, rawConfidence));
  return {
    ...value,
    question,
    status,
    publicSafeSummary,
    findings,
    confidence,
  };
}

async function updateManifest(manifestPath, entry, pretty) {
  let manifest = { version: 1, entries: [] };
  try {
    const existing = await readJson(manifestPath);
    if (Array.isArray(existing)) {
      manifest.entries = existing;
    } else if (existing && typeof existing === "object" && Array.isArray(existing.entries)) {
      manifest = { version: existing.version || 1, entries: existing.entries };
    }
  } catch (error) {
    if (error?.code !== "ENOENT") throw error;
  }
  manifest.entries.push(entry);
  await writeBoundedJson(manifestPath, manifest, pretty, 200 * 1024);
}

async function runWithTimeout(task, timeoutMs) {
  let timer;
  try {
    return await Promise.race([
      task(),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(`Scratch probe timed out after ${timeoutMs}ms`)), timeoutMs);
      }),
    ]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.slug) throw new Error("Missing required flag: --slug <slug>");
  if (!args.script) throw new Error("Missing required flag: --script <path>");

  const technicalDir = path.join(args.artifactsRoot, "technical", args.slug);
  const scratchDir = path.join(technicalDir, "scratch");
  await fs.mkdir(scratchDir, { recursive: true });

  const scriptPath = path.resolve(args.script);
  const outputPath = resolveOutputPath(args.output, scratchDir, scriptPath);
  const manifestPath = path.join(scratchDir, "scratch-manifest.json");
  assertInside(scratchDir, scriptPath, "Scratch probe script");
  assertInside(scratchDir, outputPath, "Scratch probe output");
  if (args.input) assertInside(technicalDir, args.input, "Scratch probe input");

  const startedAt = Date.now();
  const entry = {
    id: `${Date.now()}-${path.basename(scriptPath).replace(/[^a-z0-9_.-]/gi, "-")}`,
    createdAt: new Date().toISOString(),
    question: args.question,
    script: path.relative(technicalDir, scriptPath).replaceAll(path.sep, "/"),
    input: args.input ? path.relative(technicalDir, args.input).replaceAll(path.sep, "/") : "",
    output: path.relative(technicalDir, outputPath).replaceAll(path.sep, "/"),
    withBrowser: args.withBrowser,
    timeoutMs: args.timeoutMs,
    status: "running",
    durationMs: 0,
    outputBytes: 0,
  };

  let browserHandle = null;
  try {
    const module = await import(`${pathToFileURL(scriptPath).href}?t=${Date.now()}`);
    const probe = module.default || module.probe;
    if (typeof probe !== "function") {
      throw new Error("Scratch probe module must export default async function or named probe()");
    }

    let browserContext = null;
    let page = null;
    if (args.withBrowser) {
      if (!args.url) throw new Error("--with-browser requires --url <url>");
      const { openPage } = await import("./lib.js");
      browserHandle = await openPage({
        url: args.url,
        waitUntil: "domcontentloaded",
        timeoutMs: args.timeoutMs,
        actionsFile: "",
      });
      browserContext = browserHandle.context;
      page = browserHandle.page;
    }

    const input = args.input ? await readJson(args.input) : null;
    const context = Object.freeze({
      url: args.url,
      slug: args.slug,
      question: args.question,
      artifactsRoot: args.artifactsRoot,
      technicalDir,
      scratchDir,
      input,
      page,
      browserContext,
      readTechnicalJson: async (relativePath) => {
        const target = path.resolve(technicalDir, relativePath);
        assertInside(technicalDir, target, "Technical read path");
        return readJson(target);
      },
      readScratchJson: async (relativePath) => {
        const target = path.resolve(scratchDir, relativePath);
        assertInside(scratchDir, target, "Scratch read path");
        return readJson(target);
      },
      writeScratchJson: async (relativePath, payload) => {
        const target = path.resolve(scratchDir, relativePath);
        assertInside(scratchDir, target, "Scratch write path");
        return writeBoundedJson(target, payload, args.pretty);
      },
    });

    const result = await runWithTimeout(() => probe(context), args.timeoutMs);
    const validated = validateProbeResult(result, args.question);
    const outputBytes = await writeBoundedJson(outputPath, validated, args.pretty, MAX_MAIN_OUTPUT_BYTES);
    entry.status = validated.status;
    entry.durationMs = Date.now() - startedAt;
    entry.outputBytes = outputBytes;
    await updateManifest(manifestPath, entry, args.pretty);
    process.stderr.write(`Scratch probe ${entry.status}: ${entry.output} (${outputBytes} bytes)\n`);
    return 0;
  } catch (error) {
    entry.status = "failed";
    entry.durationMs = Date.now() - startedAt;
    entry.error = compactError(error);
    await updateManifest(manifestPath, entry, args.pretty).catch(() => {});
    process.stderr.write(`${entry.error}\n`);
    return 1;
  } finally {
    if (browserHandle?.browser) {
      await browserHandle.browser.close().catch(() => {});
    }
  }
}

const exitCode = await main();
if (exitCode !== 0) process.exit(exitCode);

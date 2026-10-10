var __defProp = Object.defineProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// src/skill-scripts/stripo/shell-host.ts
import { spawn } from "node:child_process";
import { randomUUID as randomUUID2 } from "node:crypto";
import { appendFileSync, closeSync, existsSync as existsSync3, linkSync, mkdirSync as mkdirSync2, openSync, readFileSync as readFileSync2, readdirSync, realpathSync as realpathSync3, unlinkSync, writeFileSync as writeFileSync2 } from "node:fs";
import path4 from "node:path";
import { fileURLToPath as fileURLToPath2, pathToFileURL as pathToFileURL2 } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

// src/skill-scripts/shared/document-files.ts
import { readFile } from "node:fs/promises";
import path2 from "node:path";

// src/skill-scripts/shared/runtime.ts
import { existsSync, mkdirSync, readFileSync, realpathSync, rmSync, statSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) throw new Error(`Unexpected argument: ${arg}`);
    const next2 = argv[index + 1];
    args[arg.slice(2)] = next2 === void 0 || next2.startsWith("--") ? true : next2;
    if (next2 !== void 0 && !next2.startsWith("--")) index += 1;
  }
  return args;
}
function requireString(args, key) {
  const value = optionalString(args, key);
  if (value === void 0) throw new Error(`Missing required --${key} argument.`);
  return value;
}
function optionalString(args, key) {
  const value = args[key];
  return typeof value === "string" && value.trim() !== "" ? value : void 0;
}
function compactError(error) {
  const fields = error instanceof Error || isObject(error) ? error : void 0;
  const errors = fields && "errors" in fields && Array.isArray(fields.errors) ? fields.errors : void 0;
  return {
    name: typeof fields?.name === "string" ? fields.name : "Error",
    message: String(fields?.message ?? error).slice(0, 2e3),
    ...errors ? { errors } : {},
    ...Object.fromEntries(["code", "stage", "input", "path", "issues"].flatMap((key) => fields && key in fields ? [[key, fields[key]]] : []))
  };
}
function resolveSdkDist(startUrl = import.meta.url) {
  const override = process.env.CONVO_EMAIL_AGENT_SDK_PATH;
  let candidate;
  if (override) {
    candidate = path.resolve(override);
  } else {
    const scriptDirectory = path.dirname(fileURLToPath(startUrl));
    const parent = path.dirname(scriptDirectory);
    if (path.basename(scriptDirectory) === "scripts" && path.basename(path.dirname(parent)) === "skills") {
      candidate = path.resolve(scriptDirectory, "../../../packages/convo-email-agent/index.js");
    } else if (path.basename(parent) === "skill-scripts" && path.basename(path.dirname(parent)) === ".build") {
      candidate = path.resolve(scriptDirectory, "../../sdk/index.js");
    }
  }
  if (candidate && existsSync(candidate) && statSync(candidate).isFile()) return candidate;
  throw new Error(
    `Cannot find the packaged convo-email-agent SDK${candidate ? ` at ${candidate}` : ""}. Install skills/ and packages/ together or set CONVO_EMAIL_AGENT_SDK_PATH to an existing index.js.`
  );
}
async function loadSdk(sdkPath) {
  return import(pathToFileURL(sdkPath).href);
}

// src/skill-scripts/shared/document-files.ts
async function validateDocumentFiles(input2) {
  try {
    if (!input2 || !["create", "edit"].includes(input2.mode) || (input2.mode === "edit" ? !input2.baseFile : input2.baseFile !== void 0)) {
      throw new Error("Edit validation requires the untouched base; creation must not supply a base.");
    }
    for (const file of [input2.candidateFile, input2.baseFile].filter((value) => value !== void 0)) {
      if (typeof file !== "string" || !path2.isAbsolute(file)) throw new Error("Candidate/base paths must be absolute.");
    }
    const sdk = await loadSdk(resolveSdkDist());
    const target = JSON.parse(await readFile(input2.candidateFile, "utf8"));
    const current = input2.baseFile ? JSON.parse(await readFile(input2.baseFile, "utf8")) : void 0;
    const validation = sdk.validateChange({ target, current, intent: input2.intent });
    return validation.success ? { valid: true } : { valid: false, errors: validation.issues };
  } catch (error) {
    return { valid: false, errors: compactError(error) };
  }
}

// src/skill-scripts/shared/transfer.ts
import { randomUUID } from "node:crypto";
import { createReadStream, existsSync as existsSync2, realpathSync as realpathSync2 } from "node:fs";
import { link, mkdir, open, readFile as readFile2, rm, stat, writeFile } from "node:fs/promises";
import path3 from "node:path";
import { Readable } from "node:stream";
var TransferFailure = class extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
  code;
};
function transferError(error) {
  const value = error instanceof Error ? error : new Error(String(error));
  const cause = value.cause;
  return {
    code: value instanceof TransferFailure ? value.code : value.name === "TimeoutError" || value.name === "AbortError" ? "TIMEOUT" : "TRANSFER_FAILED",
    // Signed URLs must never enter stdout, diagnostics or workflow journals.
    message: value.message.replace(/https?:\/\/[^\s"'<>]+/gu, "[redacted URL]").slice(0, 2e3),
    ...typeof cause?.code === "string" ? { causeCode: cause.code } : {}
  };
}
function requireValue(condition, code, message) {
  if (!condition) throw new TransferFailure(code, message);
}
function positiveInteger(value) {
  return Number.isSafeInteger(value) && value > 0;
}
function canonical(file) {
  const absolute = path3.resolve(file);
  if (existsSync2(absolute)) return realpathSync2(absolute);
  const parent = path3.dirname(absolute);
  return parent === absolute ? absolute : path3.join(canonical(parent), path3.basename(absolute));
}
function validateUrl(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new TransferFailure("INVALID_URL", "Expected an absolute HTTPS transfer URL.");
  }
  requireValue(
    url.protocol === "https:" && !url.username && !url.password && !url.hash,
    "INVALID_URL",
    "Transfers require HTTPS without URL credentials or fragments."
  );
}
function checkExpiry(value) {
  if (value === void 0) return;
  const expires = Date.parse(value);
  requireValue(Number.isFinite(expires) && expires > Date.now(), "EXPIRED_URL", "The transfer URL has expired or has an invalid expiry. Obtain a fresh ticket through the host.");
}
async function inspectFile(file, item) {
  if (!item.format) return void 0;
  if (item.format === "json") {
    let document;
    try {
      document = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(await readFile2(file)));
    } catch {
      throw new TransferFailure("INVALID_JSON", "Expected one UTF-8 JSON object.");
    }
    requireValue(document && typeof document === "object" && !Array.isArray(document), "INVALID_JSON", "Expected one JSON object.");
    return "application/json";
  }
  const handle = await open(file, "r");
  const header = Buffer.alloc(32);
  const { bytesRead } = await handle.read(header, 0, header.length, 0).finally(() => handle.close());
  let contentType;
  let dimensions;
  if (bytesRead >= 24 && header.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])) && header.toString("ascii", 12, 16) === "IHDR") {
    contentType = "image/png";
    dimensions = { width: header.readUInt32BE(16), height: header.readUInt32BE(20) };
  } else if (bytesRead >= 10 && ["GIF87a", "GIF89a"].includes(header.toString("ascii", 0, 6))) {
    contentType = "image/gif";
    dimensions = { width: header.readUInt16LE(6), height: header.readUInt16LE(8) };
  } else if (bytesRead >= 3 && header[0] === 255 && header[1] === 216 && header[2] === 255) {
    contentType = "image/jpeg";
  }
  requireValue(contentType && (item.format !== "png" || contentType === "image/png"), "UNSUPPORTED_FORMAT", "Expected PNG, JPEG or GIF bytes (PNG for previews).");
  if (item.contentTypes) requireValue(item.contentTypes.includes(contentType), "UNSUPPORTED_FORMAT", "The image MIME type is not accepted by the upload manifest.");
  if (dimensions) {
    requireValue(dimensions.width > 0 && dimensions.height > 0, "INVALID_IMAGE", "Image dimensions must be positive.");
    if (item.method === "PUT" && item.format === "image") {
      const limits = item.imageLimits;
      requireValue(limits && positiveInteger(limits.maxWidth) && positiveInteger(limits.maxHeight), "IMAGE_LIMITS_REQUIRED", "Supply the PNG/GIF pixel limits from the prepare_image_upload instruction.");
      requireValue(dimensions.width <= limits.maxWidth && dimensions.height <= limits.maxHeight, "FILE_TOO_LARGE", `Image ${dimensions.width}x${dimensions.height} exceeds the ${limits.maxWidth}x${limits.maxHeight} upload limit.`);
    }
  }
  return contentType;
}
async function prepare(request) {
  requireValue(
    Array.isArray(request.transfers) && request.transfers.length > 0 && request.transfers.length <= 32,
    "INVALID_REQUEST",
    "Expected 1 to 32 file transfers."
  );
  requireValue(positiveInteger(request.concurrency ?? 3) && (request.concurrency ?? 3) <= 4, "INVALID_REQUEST", "Concurrency must be between 1 and 4.");
  requireValue(positiveInteger(request.timeoutMs ?? 6e4) && (request.timeoutMs ?? 6e4) <= 3e5, "INVALID_REQUEST", "Timeout must be between 1 and 300000 milliseconds.");
  if (request.maxTotalUploadBytes !== void 0) requireValue(positiveInteger(request.maxTotalUploadBytes), "INVALID_REQUEST", "Expected a positive combined upload limit.");
  const ids = /* @__PURE__ */ new Set();
  const paths = /* @__PURE__ */ new Set();
  const prepared = [];
  for (const item of request.transfers) {
    requireValue(typeof item.id === "string" && /^[a-zA-Z0-9_-]{1,80}$/u.test(item.id) && !ids.has(item.id), "INVALID_REQUEST", "Transfer IDs must be unique short identifiers.");
    ids.add(item.id);
    requireValue(item.method === "GET" || item.method === "PUT", "INVALID_REQUEST", "Only GET and PUT transfers are supported.");
    requireValue(typeof item.file === "string" && path3.isAbsolute(item.file), "INVALID_PATH", "Transfer files must have absolute paths.");
    const file = canonical(item.file);
    requireValue(!paths.has(file), "INVALID_PATH", "Transfer paths must be distinct, including symbolic-link aliases.");
    paths.add(file);
    requireValue(positiveInteger(item.maxBytes), "INVALID_REQUEST", "Every transfer needs a positive byte limit.");
    requireValue(item.format === void 0 || ["json", "png", "image"].includes(item.format), "INVALID_REQUEST", "Unsupported file format check.");
    validateUrl(item.url);
    checkExpiry(item.expiresAt);
    for (const [key, value] of Object.entries(item.headers ?? {})) {
      requireValue(!/^(authorization|proxy-authorization|cookie|host)$/iu.test(key) && typeof value === "string", "INVALID_HEADERS", "Transfer headers cannot contain account credentials or override the host.");
    }
    let bytes = 0;
    let contentType;
    if (item.method === "PUT") {
      const info = await stat(item.file);
      requireValue(info.isFile() && info.size > 0, "INVALID_FILE", `${item.id}: upload must be a nonempty regular file.`);
      requireValue(info.size <= item.maxBytes, "FILE_TOO_LARGE", `${item.id}: ${info.size} bytes exceeds the ${item.maxBytes} byte ticket limit.`);
      bytes = info.size;
      contentType = await inspectFile(item.file, item);
      const headers = new Headers(item.headers);
      if (headers.has("Content-Length")) requireValue(Number(headers.get("Content-Length")) === bytes, "INVALID_HEADERS", "Ticket Content-Length does not match the local file size.");
      if (item.format === "image" && headers.has("Content-Type")) requireValue(headers.get("Content-Type") === contentType, "INVALID_HEADERS", "Ticket Content-Type does not match the actual image bytes.");
    } else {
      requireValue(!existsSync2(item.file), "OUTPUT_EXISTS", "Download destination already exists; use a fresh task file to preserve the acquired base.");
    }
    prepared.push({ item, bytes, contentType });
  }
  const total = prepared.reduce((sum, value) => sum + value.bytes, 0);
  requireValue(request.maxTotalUploadBytes === void 0 || total <= request.maxTotalUploadBytes, "FILE_TOO_LARGE", "Candidate and base files together exceed the upload limit.");
  return prepared;
}
async function runTransfers(request, transport = fetch) {
  const startedAt = (/* @__PURE__ */ new Date()).toISOString();
  const started = performance.now();
  const prepared = await prepare(request);
  const results = new Array(prepared.length);
  let next2 = 0;
  async function worker() {
    while (next2 < prepared.length) {
      const index = next2++;
      const { item, bytes, contentType } = prepared[index];
      const tick = performance.now();
      const result = { id: item.id, method: item.method, file: item.file, status: "FAILED", startedAt: (/* @__PURE__ */ new Date()).toISOString(), endedAt: "", durationMs: 0, bytes: 0 };
      const temporary = `${item.file}.${randomUUID()}.part`;
      let input2;
      let response;
      let temporaryCreated = false;
      try {
        checkExpiry(item.expiresAt);
        const headers = new Headers(item.headers);
        if (item.method === "PUT" && item.format === "image" && contentType) headers.set("Content-Type", contentType);
        const init = { method: item.method, headers, redirect: "manual", signal: AbortSignal.timeout(request.timeoutMs ?? 6e4) };
        if (item.method === "PUT") {
          headers.set("Content-Length", String(bytes));
          input2 = createReadStream(item.file);
          const source = input2;
          const bounded = Readable.from((async function* () {
            let sent = 0;
            for await (const chunk of source) {
              sent += Buffer.byteLength(chunk);
              requireValue(sent <= bytes && sent <= item.maxBytes, "FILE_CHANGED", "Upload changed or exceeded its validated byte limit.");
              yield chunk;
            }
            requireValue(sent === bytes, "FILE_CHANGED", "Upload size changed after validation.");
          })());
          init.body = Readable.toWeb(bounded);
          init.duplex = "half";
        }
        response = await transport(item.url, init);
        result.responseMs = Math.round((performance.now() - tick) * 1e3) / 1e3;
        result.httpStatus = response.status;
        if (!response.ok) {
          await response.body?.cancel();
          throw new TransferFailure("HTTP_ERROR", `HTTP ${response.status}; transfer was not successful.`);
        }
        if (item.method === "GET") {
          const length = Number(response.headers.get("Content-Length"));
          requireValue(!Number.isFinite(length) || length <= item.maxBytes, "FILE_TOO_LARGE", "Download exceeds its byte limit.");
          requireValue(response.body, "EMPTY_RESPONSE", "Download returned no body.");
          await mkdir(path3.dirname(item.file), { recursive: true });
          const output = await open(temporary, "wx", 384);
          temporaryCreated = true;
          const reader = response.body.getReader();
          try {
            for (; ; ) {
              const chunk = await reader.read();
              if (chunk.done) break;
              result.bytes += chunk.value.byteLength;
              requireValue(result.bytes <= item.maxBytes, "FILE_TOO_LARGE", "Download exceeded its byte limit while streaming.");
              await output.writeFile(chunk.value);
            }
          } finally {
            await reader.cancel().catch(() => void 0);
            await output.close();
          }
          requireValue(result.bytes > 0, "EMPTY_RESPONSE", "Downloaded file is empty.");
          result.contentType = await inspectFile(temporary, item);
          await link(temporary, item.file);
          await rm(temporary);
          temporaryCreated = false;
        } else {
          await response.body?.cancel();
          result.bytes = bytes;
          result.contentType = contentType;
        }
        result.status = "OK";
      } catch (error) {
        result.error = transferError(error);
      } finally {
        input2?.destroy();
        await response?.body?.cancel().catch(() => void 0);
        if (temporaryCreated) await rm(temporary, { force: true });
        result.endedAt = (/* @__PURE__ */ new Date()).toISOString();
        result.durationMs = Math.round((performance.now() - tick) * 1e3) / 1e3;
        results[index] = result;
      }
    }
  }
  await Promise.all(Array.from({ length: Math.min(request.concurrency ?? 3, prepared.length) }, worker));
  return { status: results.every((result) => result.status === "OK") ? "OK" : "FAILED", startedAt, endedAt: (/* @__PURE__ */ new Date()).toISOString(), durationMs: Math.round((performance.now() - started) * 1e3) / 1e3, results };
}

// src/skill-scripts/stripo/file-workflows.ts
var file_workflows_exports = {};
__export(file_workflows_exports, {
  downloadEmailArtifacts: () => downloadEmailArtifacts,
  saveDocumentState: () => saveDocumentState,
  uploadImage: () => uploadImage
});

// src/skill-scripts/stripo/hosted-image-url.ts
function isHostedImageUrl(value, uploadUrl) {
  try {
    if (typeof value !== "string") return false;
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password && url.href !== uploadUrl && ![...url.searchParams.keys()].some((key) => /^x-(amz|goog)-/iu.test(key));
  } catch {
    return false;
  }
}

// src/skill-scripts/stripo/file-workflows.ts
var WorkflowFailure = class extends Error {
  constructor(code, message, details) {
    super(message);
    this.code = code;
    this.details = details;
  }
  code;
  details;
};
function object(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function requireValue2(condition, code, message) {
  if (!condition) throw new WorkflowFailure(code, message);
}
function redacted(value) {
  if (typeof value === "string") return value.replace(/https?:\/\/[^\s"'<>]+/gu, "[redacted URL]");
  if (Array.isArray(value)) return value.map(redacted);
  if (object(value)) return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, /authorization|cookie|headers|downloadUrl|uploadUrl/iu.test(key) ? "[redacted]" : redacted(item)]));
  return value;
}
function failure(error) {
  if (error instanceof WorkflowFailure) return { code: error.code, message: redacted(error.message), ...error.details === void 0 ? {} : { details: redacted(error.details) } };
  return { code: "HOST_ERROR", message: redacted(error instanceof Error ? error.message : String(error)) };
}
function unwrap(value) {
  requireValue2(object(value), "INVALID_RESPONSE", "Expected an MCP object response.");
  if (value.isError === true) throw new WorkflowFailure("MCP_ERROR", "MCP returned an error.", value);
  if (object(value.structuredContent)) return value.structuredContent;
  if (Array.isArray(value.content)) {
    const text = value.content.filter((item) => object(item) && item.type === "text").map((item) => item.text).join("\n");
    try {
      const result = JSON.parse(text);
      if (object(result)) return result;
    } catch {
    }
    throw new WorkflowFailure("INVALID_RESPONSE", "MCP response did not contain one JSON object.");
  }
  return value;
}
function ok(value) {
  if (value.status !== "OK") throw new WorkflowFailure(String(value.status ?? "INVALID_RESPONSE"), "Stripo did not confirm the operation.", value);
  return value;
}
function string(value, name) {
  requireValue2(typeof value === "string" && value.length > 0, "INVALID_RESPONSE", `Missing ${name}.`);
  return value;
}
function limit(value) {
  requireValue2(Number.isSafeInteger(value) && value > 0, "INVALID_RESPONSE", "Missing positive maxBytes in upload ticket.");
  return value;
}
function targetOf(input2) {
  requireValue2(Number.isSafeInteger(input2.id) && input2.id > 0 && (input2.type === void 0 || input2.type === "EMAIL" || input2.type === "TEMPLATE"), "INVALID_TARGET", "Expected a positive target id and EMAIL or TEMPLATE type.");
  return { id: input2.id, type: input2.type ?? "EMAIL" };
}
function destination(directory, name) {
  return `${directory.replace(/\/$/u, "")}/${name}`;
}
function download(id, response, file, maxBytes, format) {
  return { id, method: "GET", url: string(response.downloadUrl, "downloadUrl"), expiresAt: string(response.expiresAt, "expiresAt"), file, maxBytes, format };
}
function upload(id, response, file) {
  if (response.method !== void 0) requireValue2(response.method === "PUT", "UNSUPPORTED_METHOD", "Upload ticket requires an unsupported HTTP method.");
  return {
    id,
    method: "PUT",
    url: string(response.uploadUrl, "uploadUrl"),
    file,
    maxBytes: limit(response.maxBytes),
    format: "json",
    ...response.expiresAt === void 0 ? {} : { expiresAt: string(response.expiresAt, "expiresAt") },
    ...object(response.headers) ? { headers: response.headers } : {}
  };
}
var Workflow = class {
  constructor(host) {
    this.host = host;
    this.clockSource = host.now ? "host" : typeof globalThis.performance?.now === "function" ? "monotonic" : "wall";
    this.now = host.now ? () => host.now() : this.clockSource === "monotonic" ? () => globalThis.performance.now() : () => Date.now();
  }
  host;
  steps = [];
  clockSource;
  now;
  async event(step) {
    this.steps.push(step);
    await this.host.recordEvent?.(step);
  }
  async step(name, action, args) {
    const start2 = this.now();
    await this.event({ name, phase: "started", at: (/* @__PURE__ */ new Date()).toISOString(), ...args ? { arguments: args } : {} });
    try {
      const result = await action();
      const outcome = object(result) ? result.status ?? result.error_code : void 0;
      await this.event({ name, phase: "completed", at: (/* @__PURE__ */ new Date()).toISOString(), durationMs: Math.max(0, this.now() - start2), ...typeof outcome === "string" ? { outcome } : {} });
      return result;
    } catch (error) {
      await this.event({ name, phase: "failed", at: (/* @__PURE__ */ new Date()).toISOString(), durationMs: Math.max(0, this.now() - start2), error: failure(error) });
      throw error;
    }
  }
  call(name, args) {
    return this.step(name, async () => unwrap(await this.host.callTool(name, args)), args);
  }
  async transfer(request) {
    return this.step("transfer", async () => {
      const report = await this.host.transfer(request);
      if (report.status === "FAILED" && report.error) throw new WorkflowFailure(report.error.code, report.error.message, report);
      requireValue2(Array.isArray(report.results) && report.results.length === request.transfers.length, "INVALID_TRANSFER_RESULT", "Transfer helper did not report every requested file.");
      for (const item of request.transfers) {
        const matches = report.results.filter((result) => result.id === item.id);
        requireValue2(matches.length === 1 && matches[0].file === item.file && matches[0].method === item.method, "INVALID_TRANSFER_RESULT", "Transfer receipt does not match its requested file.");
      }
      return report;
    }, { files: request.transfers.map((item) => ({ id: item.id, file: item.file, method: item.method })) });
  }
};
function transferred(result) {
  return Boolean(result && result.status === "OK" && result.bytes > 0 && result.httpStatus && result.httpStatus >= 200 && result.httpStatus < 300);
}
function requireTransfers(report) {
  if (report.status !== "OK" || !report.results.every(transferred)) {
    throw new WorkflowFailure("TRANSFER_FAILED", "A file transfer failed; finalization was not attempted.", report);
  }
}
async function execute(input2, host, action) {
  const target = targetOf(input2);
  const workflow = new Workflow(host);
  const started = workflow.now();
  let result;
  try {
    result = await action(workflow, target);
  } catch (error) {
    result = { status: "FAILED", error: failure(error) };
  }
  return { ...result, status: result.status, target, durationMs: Math.max(0, workflow.now() - started), clockSource: workflow.clockSource, steps: workflow.steps };
}
function downloadEmailArtifacts(input2, host) {
  return execute(input2, host, async (workflow, target) => {
    const responses = await Promise.allSettled([
      workflow.call("get_content", { id: target.id, type: target.type.toLowerCase(), includeHtml: false }),
      workflow.call("get_document_state", target),
      workflow.call("get_screenshot", { ...target, mode: "BOTH" })
    ]);
    const result = (index) => {
      const value = responses[index];
      if (value.status === "rejected") throw value.reason;
      return value.value;
    };
    const metadata = ok(result(0));
    requireValue2(metadata.id === target.id && metadata.type === target.type.toLowerCase(), "TARGET_MISMATCH", "Metadata belongs to another target.");
    const model = ok(result(1));
    const transfers = [download("model", model, destination(input2.directory, "model.json"), input2.maxBytes ?? 20 * 1024 * 1024, "json")];
    let previewError;
    let previewsComplete = false;
    try {
      const previews = result(2);
      previewsComplete = previews.status === "OK";
      if (previews.status !== "OK" && previews.status !== "PARTIAL") throw new WorkflowFailure("PREVIEW_UNAVAILABLE", "Stripo could not produce previews.", previews);
      requireValue2(Array.isArray(previews.screenshots), "INVALID_RESPONSE", "Missing screenshots array.");
      for (const mode of ["DESKTOP", "MOBILE"]) {
        const entries = previews.screenshots.filter((item) => object(item) && item.mode === mode);
        requireValue2(entries.length <= 1, "INVALID_RESPONSE", `Duplicate ${mode} screenshot.`);
        if (entries[0]) transfers.push(download(mode.toLowerCase(), entries[0], destination(input2.directory, `${mode.toLowerCase()}.png`), input2.maxBytes ?? 20 * 1024 * 1024, "png"));
      }
    } catch (error) {
      previewError = failure(error);
    }
    const report = await workflow.transfer({ transfers });
    const modelReady = transferred(report.results.find((item) => item.id === "model"));
    const complete = report.status === "OK" && report.results.every(transferred) && transfers.length === 3 && previewsComplete && !previewError;
    return {
      status: !modelReady ? "FAILED" : complete ? "OK" : "PARTIAL",
      metadata: { id: metadata.id, type: metadata.type, name: metadata.name, projectId: metadata.projectId, projectName: metadata.projectName, capability: metadata.capability, simulatedFields: metadata.simulatedFields },
      transfer: report,
      ...previewError ? { previewError } : {},
      requiresSemanticAndVisualInspection: true
    };
  });
}
function uploadImage(input2, host) {
  return execute(input2, host, async (workflow, target) => {
    requireValue2(typeof input2.name === "string" && input2.name.length > 0 && input2.name.length <= 100 && !/[\\/]/u.test(input2.name), "INVALID_NAME", "Expected a plain image filename of at most 100 characters.");
    const ticket = await workflow.call("prepare_image_upload", { ...target, name: input2.name });
    if (ticket.status !== void 0 && ticket.status !== "OK") throw new WorkflowFailure(String(ticket.status), "Image upload was refused.", ticket);
    if (ticket.error_code) throw new WorkflowFailure(String(ticket.error_code), String(ticket.reason ?? "Image upload was refused."), ticket);
    const session = string(ticket.uploadSessionId, "uploadSessionId");
    requireValue2(Array.isArray(ticket.uploads), "INVALID_RESPONSE", "Missing image upload manifest.");
    const entries = ticket.uploads.filter((item) => object(item) && item.kind === "image");
    requireValue2(entries.length === 1 && entries[0].method === "PUT", "INVALID_RESPONSE", "Expected exactly one image PUT upload.");
    const entry = entries[0];
    requireValue2(Array.isArray(entry.contentTypes) && entry.contentTypes.every((item) => typeof item === "string"), "INVALID_RESPONSE", "Missing accepted image MIME types.");
    const transfer = await workflow.transfer({ transfers: [{ ...upload("image", entry, input2.file), expiresAt: string(ticket.expiresAt, "expiresAt"), format: "image", contentTypes: entry.contentTypes, imageLimits: input2.imageLimits }] });
    requireTransfers(transfer);
    const args = { ...target, name: input2.name, uploadSessionId: session };
    let hosted;
    try {
      hosted = await workflow.call("upload_image", args);
    } catch (error) {
      return { status: "WRITE_UNCONFIRMED", uploadSessionId: session, error: failure(error), transfer };
    }
    if (hosted.error_code) return { status: ["hosting_failed", "upload_session_not_found"].includes(String(hosted.error_code)) ? "WRITE_UNCONFIRMED" : "FAILED", uploadSessionId: session, error: redacted(hosted), transfer };
    const urls = { url: object(hosted.data) ? hosted.data.url : void 0, uploadUrl: entry.uploadUrl };
    let validUrl = false;
    try {
      validUrl = host.validateImageUrl ? await host.validateImageUrl(urls) : isHostedImageUrl(urls.url, urls.uploadUrl);
    } catch (error) {
      return { status: "WRITE_UNCONFIRMED", uploadSessionId: session, error: failure(error), transfer };
    }
    if (!validUrl) return { status: "WRITE_UNCONFIRMED", uploadSessionId: session, error: { code: "INVALID_HOSTED_URL", message: "Finalization returned no valid hosted HTTPS URL; do not upload again." }, transfer };
    return { status: "OK", image: hosted.data, transfer, requiresVisualInspectionAndModelInsertion: true };
  });
}
function saveDocumentState(input2, host) {
  return execute(input2, host, async (workflow, target) => {
    requireValue2(input2.mode === "create" || input2.mode === "edit", "INVALID_MODE", "Choose create or edit explicitly.");
    requireValue2(input2.mode === "edit" ? Boolean(input2.baseFile) : input2.baseFile === void 0, "BASE_REQUIRED", "Edits require the untouched acquired base; create is only for a newly created, unacquired email.");
    requireValue2(host.validateDocument, "VALIDATOR_REQUIRED", "The host must validate the candidate against its base with the native SDK before preparing tickets.");
    const validation = await workflow.step("validate_document", () => host.validateDocument({ candidateFile: input2.candidateFile, baseFile: input2.baseFile, mode: input2.mode, ...input2.intent ? { intent: input2.intent } : {} }));
    if (validation.valid !== true) throw new WorkflowFailure("VALIDATION_FAILED", "Native document validation failed.", validation.errors);
    const candidate = ok(await workflow.call("prepare_document_state_upload", target));
    const uploadId = string(candidate.uploadId, "uploadId");
    const transfers = [upload("candidate", candidate, input2.candidateFile)];
    let baseUploadId;
    if (input2.baseFile) {
      const base = ok(await workflow.call("prepare_document_state_upload", target));
      baseUploadId = string(base.uploadId, "baseUploadId");
      requireValue2(baseUploadId !== uploadId, "INVALID_RESPONSE", "Candidate and base need different upload tickets.");
      transfers.push(upload("base", base, input2.baseFile));
    }
    const transfer = await workflow.transfer({ transfers, maxTotalUploadBytes: Math.min(...transfers.map((item) => item.maxBytes)) });
    requireTransfers(transfer);
    let written;
    try {
      written = await workflow.call("set_document_state", { ...target, uploadId, ...baseUploadId ? { baseUploadId } : {} });
    } catch (error) {
      written = { status: "WRITE_UNCONFIRMED", error: failure(error) };
    }
    if (written.status !== "OK" && written.status !== "WRITE_UNCONFIRMED") return { status: "FAILED", error: redacted(written), transfer };
    let readback;
    let readbackError;
    try {
      const acquired = ok(await workflow.call("get_document_state", target));
      readback = await workflow.transfer({ transfers: [download("readback", acquired, input2.readbackFile, 20 * 1024 * 1024, "json")] });
      requireTransfers(readback);
    } catch (error) {
      readbackError = failure(error);
    }
    return { status: written.status === "WRITE_UNCONFIRMED" ? "WRITE_UNCONFIRMED" : readbackError ? "PARTIAL" : "OK", write: redacted(written), transfer, readback, ...readbackError ? { readbackError } : {}, requiresSemanticAndVisualInspection: true };
  });
}

// src/stripo/mcp-tools.ts
var STRIPO_MCP_TOOL_MAPPING = Object.freeze({
  brand: "stripo",
  canonicalBrand: "reteno",
  fieldMapping: "adapter",
  tools: Object.freeze({
    // Stripo calls the Brand Kit a Business Profile and scopes it to a project, where Reteno's is
    // account-wide: every brandkit call needs a projectId the adapter resolves through find_projects.
    getBrandkit: "get_business_profile",
    prepareBrandkitUpload: "prepare_business_profile_upload",
    // One tool covers both replacements; the adapter supplies website only for extracted data.
    updateBrandkitFromExtraction: "replace_business_profile",
    updateBrandkit: "replace_business_profile",
    getEmailModel: "get_document_state",
    getEmailModelSchema: "get_document_state_schema",
    getEmailMessagePreview: "get_screenshot",
    createEmailShell: "create_email",
    prepareEmailModelUpload: "prepare_document_state_upload",
    updateEmailModel: "set_document_state",
    prepareImageUpload: "prepare_image_upload",
    uploadImage: "upload_image"
  }),
  auxiliaryTools: Object.freeze({
    identity: "whoami",
    contentMetadata: "get_content",
    recoverCreatedEmail: "find_content",
    folders: "find_folders",
    // Resolves the projectId the Business Profile tools require.
    projects: "find_projects",
    // Supported-field updates are auxiliary operations in both provider mappings.
    patchBrandkit: "patch_business_profile",
    // Stripo hosts completed image jobs in the target letter's gallery.
    generateImage: "generate_image",
    editImage: "edit_image",
    getImageJob: "get_image_job"
  }),
  unsupported: Object.freeze({
    getEmailMessageExport: "No compiled email export tool is available. Read native metadata with getEmailModel.",
    getEmailMessageViewLink: "No hosted email-view link operation is available in this adapter.",
    listCustomBlocks: "No saved-module library tool is available in this adapter.",
    listEmailInterfaces: "This editor has no sending interfaces.",
    updateEmailMetadata: "No write tool for name, project, or folder metadata. Native document title/preheader use updateEmailModel.",
    createTemplate: "Templates can be read, edited and rebuilt; only emails can be created."
  })
});

// src/skill-scripts/stripo/tool-bindings.ts
var workflowTools = [
  STRIPO_MCP_TOOL_MAPPING.auxiliaryTools.contentMetadata,
  STRIPO_MCP_TOOL_MAPPING.tools.getEmailModel,
  STRIPO_MCP_TOOL_MAPPING.tools.getEmailMessagePreview,
  STRIPO_MCP_TOOL_MAPPING.tools.prepareEmailModelUpload,
  STRIPO_MCP_TOOL_MAPPING.tools.updateEmailModel,
  STRIPO_MCP_TOOL_MAPPING.tools.prepareImageUpload,
  STRIPO_MCP_TOOL_MAPPING.tools.uploadImage
];
function resolveWorkflowTools(toolNames, mcpPrefix) {
  const names = new Set(toolNames);
  const suffix = STRIPO_MCP_TOOL_MAPPING.tools.getEmailModel;
  const prefixes = [...names].filter((name) => name.endsWith(suffix)).map((name) => name.slice(0, -suffix.length)).filter((prefix2) => workflowTools.every((name) => names.has(`${prefix2}${name}`)));
  const prefix = mcpPrefix ?? (prefixes.length === 1 ? prefixes[0] : void 0);
  if (prefix === void 0 || !prefixes.includes(prefix)) throw new Error("Select one complete Stripo connection with mcpPrefix from the current tool catalog; discovery found zero or multiple candidates.");
  return new Map(workflowTools.map((name) => [name, `${prefix}${name}`]));
}

// src/skill-scripts/stripo/shell-host.ts
var read = (file) => JSON.parse(readFileSync2(file, "utf8"));
function publish(file, value) {
  const temporary = `${file}.${randomUUID2()}.tmp`;
  writeFileSync2(temporary, `${JSON.stringify(value)}
`, { mode: 384, flag: "wx" });
  try {
    linkSync(temporary, file);
  } finally {
    unlinkSync(temporary);
  }
}
function checkRequest(value) {
  if (!isObject(value) || !["saveDocumentState", "downloadEmailArtifacts", "uploadImage"].includes(String(value.workflow)) || !isObject(value.input) || !Array.isArray(value.toolNames) || !value.toolNames.every((name) => typeof name === "string")) {
    throw new Error("Expected workflow, native workflow input and current MCP toolNames.");
  }
  if (value.responseTimeoutMs !== void 0 && (!Number.isSafeInteger(value.responseTimeoutMs) || Number(value.responseTimeoutMs) < 100 || Number(value.responseTimeoutMs) > 6e5)) {
    throw new Error("responseTimeoutMs must be 100..600000.");
  }
  resolveWorkflowTools(value.toolNames, value.mcpPrefix);
}
async function serve(directory, transport = fetch) {
  const config = read(path4.join(directory, "request.json"));
  checkRequest(config);
  publish(path4.join(directory, "worker.lock"), { pid: process.pid });
  const bindings = resolveWorkflowTools(config.toolNames, config.mcpPrefix);
  let sequence = 0;
  let transferSequence = 0;
  const host = {
    async callTool(name, args) {
      const tool = bindings.get(name);
      if (!tool) throw new Error(`Unsupported workflow tool: ${name}`);
      const id = String(++sequence).padStart(4, "0");
      publish(path4.join(directory, `call-${id}.json`), { id, tool, arguments: args });
      const responseFile = path4.join(directory, `reply-${id}.json`);
      const deadline = Date.now() + (config.responseTimeoutMs ?? 3e5);
      try {
        while (!existsSync3(responseFile)) {
          if (Date.now() >= deadline) throw new Error("Host response timed out; the MCP outcome is unknown. Do not repeat the call.");
          await delay(50);
        }
        const reply2 = read(responseFile);
        if (reply2.error) throw new Error(reply2.error.message);
        return reply2.result;
      } finally {
        publish(path4.join(directory, `settled-${id}.json`), { id });
      }
    },
    async transfer(request) {
      const report = await runTransfers(request, transport);
      publish(path4.join(directory, `transfer-${++transferSequence}.json`), report);
      return report;
    },
    validateDocument: validateDocumentFiles,
    validateImageUrl: async (input2) => isHostedImageUrl(input2.url, input2.uploadUrl),
    recordEvent(event) {
      appendFileSync(path4.join(directory, "events.jsonl"), `${JSON.stringify(event)}
`, { mode: 384 });
    }
  };
  const operation = file_workflows_exports[config.workflow];
  const result = await operation(config.input, host);
  publish(path4.join(directory, "result.json"), result);
}
async function next(directory, waitMs = 5e3) {
  const deadline = Date.now() + waitMs;
  for (; ; ) {
    const result = path4.join(directory, "result.json");
    if (existsSync3(result)) return { status: "COMPLETE", directory, result: read(result) };
    const processInfo = path4.join(directory, "process.json");
    if (existsSync3(processInfo)) {
      try {
        process.kill(read(processInfo).pid, 0);
      } catch {
        return { status: "INTERRUPTED", directory, message: "Worker stopped. Inspect events and pending calls; read live state before starting a new write workflow." };
      }
    }
    const calls = [];
    const awaiting = [];
    for (const file of readdirSync(directory).filter((name) => /^call-\d+\.json$/u.test(name)).sort()) {
      const call = read(path4.join(directory, file));
      if (existsSync3(path4.join(directory, `reply-${call.id}.json`)) || existsSync3(path4.join(directory, `settled-${call.id}.json`))) continue;
      try {
        publish(path4.join(directory, `claimed-${call.id}.json`), { id: call.id });
        calls.push(call);
      } catch (error) {
        if (error.code !== "EEXIST") throw error;
        awaiting.push(call.id);
      }
    }
    if (calls.length) return { status: "NEEDS_MCP", directory, calls };
    if (awaiting.length) return { status: "AWAITING_MCP_RESPONSE", directory, requestIds: awaiting, message: "Return the original results or an explicit unknown-outcome error. Do not repeat MCP calls." };
    if (Date.now() >= deadline) return { status: "RUNNING", directory };
    await delay(50);
  }
}
function reply(directory, values) {
  if (!Array.isArray(values) || !values.length) throw new Error("Supply a non-empty array of {id, result} or {id, error: {message}} replies.");
  for (const value of values) {
    if (!isObject(value) || typeof value.id !== "string" || !/^\d{4,}$/u.test(value.id) || Object.hasOwn(value, "result") === Object.hasOwn(value, "error") || Object.hasOwn(value, "error") && (!isObject(value.error) || typeof value.error.message !== "string")) throw new Error("Invalid MCP reply envelope.");
    if (!existsSync3(path4.join(directory, `claimed-${value.id}.json`))) throw new Error(`Unknown or unclaimed call: ${value.id}`);
    const file = path4.join(directory, `reply-${value.id}.json`);
    if (existsSync3(file)) {
      if (JSON.stringify(read(file)) === JSON.stringify(value)) continue;
      throw new Error(`Call ${value.id} already has a different reply.`);
    }
    publish(file, value);
  }
}
async function start(config, directory) {
  checkRequest(config);
  if (!path4.isAbsolute(directory)) throw new Error("directory must be a new absolute path inside the private task directory.");
  mkdirSync2(directory, { mode: 448 });
  publish(path4.join(directory, "request.json"), config);
  const log = openSync(path4.join(directory, "worker.log"), "wx", 384);
  const environment = Object.fromEntries(["PATH", "TMPDIR", "TEMP", "SystemRoot"].flatMap((key) => process.env[key] ? [[key, process.env[key]]] : []));
  try {
    const child = spawn(process.execPath, [fileURLToPath2(import.meta.url), "serve", "--directory", directory], { env: environment, detached: true, stdio: ["ignore", log, log], cwd: directory });
    await new Promise((resolve, reject) => {
      child.once("spawn", resolve);
      child.once("error", reject);
    });
    publish(path4.join(directory, "process.json"), { pid: child.pid });
    child.unref();
  } finally {
    closeSync(log);
  }
  return next(directory);
}
async function input(file) {
  if (file !== "-") return read(file);
  let text = "";
  for await (const chunk of process.stdin) {
    text += chunk.toString();
    if (Buffer.byteLength(text) > 1024 * 1024) throw new Error("Request exceeds 1 MiB.");
  }
  return JSON.parse(text);
}
async function main() {
  const [command, ...rest] = process.argv.slice(2);
  if (command === "--help") {
    console.log("shell-host.mjs start --directory <new run dir> --request <file|->\nshell-host.mjs reply --directory <run dir> --responses <file|->\nshell-host.mjs next --directory <run dir>\nMCP calls remain with the current agent; replies accept the raw MCP result or an explicit error. Never replay an issued call.");
    return;
  }
  const args = parseArgs(rest);
  const directory = requireString(args, "directory");
  if (!path4.isAbsolute(directory)) throw new Error("directory must be absolute.");
  if (command === "serve") {
    await serve(directory);
    return;
  }
  let result;
  if (command === "start") result = await start(await input(requireString(args, "request")), directory);
  else if (command === "reply") {
    reply(directory, await input(requireString(args, "responses")));
    result = await next(directory);
  } else if (command === "next") result = await next(directory);
  else throw new Error("Expected start, reply or next; use --help.");
  console.log(JSON.stringify(result));
}
if (process.argv[1] && existsSync3(process.argv[1]) && import.meta.url === pathToFileURL2(realpathSync3(process.argv[1])).href) {
  main().catch((error) => {
    console.error(JSON.stringify({ status: "FAILED", error: transferError(error) }));
    process.exitCode = 1;
  });
}
export {
  next,
  reply,
  serve,
  start
};

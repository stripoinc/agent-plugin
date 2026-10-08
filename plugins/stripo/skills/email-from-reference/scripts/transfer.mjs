// src/skill-scripts/shared/transfer.ts
import { randomUUID } from "node:crypto";
import { createReadStream, existsSync, realpathSync } from "node:fs";
import { link, mkdir, open, readFile, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import { Readable } from "node:stream";
import { pathToFileURL } from "node:url";
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
  const absolute = path.resolve(file);
  if (existsSync(absolute)) return realpathSync(absolute);
  const parent = path.dirname(absolute);
  return parent === absolute ? absolute : path.join(canonical(parent), path.basename(absolute));
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
      document = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(await readFile(file)));
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
    requireValue(typeof item.file === "string" && path.isAbsolute(item.file), "INVALID_PATH", "Transfer files must have absolute paths.");
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
      requireValue(!existsSync(item.file), "OUTPUT_EXISTS", "Download destination already exists; use a fresh task file to preserve the acquired base.");
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
  let next = 0;
  async function worker() {
    while (next < prepared.length) {
      const index = next++;
      const { item, bytes, contentType } = prepared[index];
      const tick = performance.now();
      const result = { id: item.id, method: item.method, file: item.file, status: "FAILED", startedAt: (/* @__PURE__ */ new Date()).toISOString(), endedAt: "", durationMs: 0, bytes: 0 };
      const temporary = `${item.file}.${randomUUID()}.part`;
      let input;
      let response;
      let temporaryCreated = false;
      try {
        checkExpiry(item.expiresAt);
        const headers = new Headers(item.headers);
        if (item.method === "PUT" && item.format === "image" && contentType) headers.set("Content-Type", contentType);
        const init = { method: item.method, headers, redirect: "manual", signal: AbortSignal.timeout(request.timeoutMs ?? 6e4) };
        if (item.method === "PUT") {
          headers.set("Content-Length", String(bytes));
          input = createReadStream(item.file);
          const source = input;
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
          await mkdir(path.dirname(item.file), { recursive: true });
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
        input?.destroy();
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
async function main() {
  const args = process.argv.slice(2);
  if (args.length === 1 && args[0] === "--help") {
    console.log("Usage: node transfer.mjs --request <request.json|-> --result <result.json>\nUse - to read the request from stdin. Transfers HTTPS files only; MCP calls, OAuth and network permission remain with the host.");
    return;
  }
  requireValue(args.length === 4 && args[0] === "--request" && args[2] === "--result", "INVALID_ARGUMENT", "Use --request <request.json> --result <result.json>.");
  let source = "";
  if (args[1] === "-") {
    for await (const chunk of process.stdin) {
      source += chunk.toString();
      requireValue(Buffer.byteLength(source) <= 1024 * 1024, "INVALID_REQUEST", "Transfer request exceeds 1 MiB.");
    }
  } else source = await readFile(args[1], "utf8");
  const request = JSON.parse(source);
  const output = canonical(args[3]);
  requireValue((args[1] === "-" || output !== canonical(args[1])) && !request.transfers?.some((item) => output === canonical(item.file)), "INVALID_PATH", "Report must differ from the request and every transfer file.");
  const startedAt = (/* @__PURE__ */ new Date()).toISOString();
  const started = performance.now();
  let report;
  try {
    report = await runTransfers(request);
  } catch (error) {
    report = { status: "FAILED", startedAt, endedAt: (/* @__PURE__ */ new Date()).toISOString(), durationMs: performance.now() - started, results: [], error: transferError(error) };
  }
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(report, null, 2)}
`, { mode: 384 });
  console.log(JSON.stringify(report));
  if (report.status !== "OK") process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch((error) => {
    console.error(JSON.stringify({ status: "FAILED", error: transferError(error) }));
    process.exitCode = 1;
  });
}
export {
  runTransfers,
  transferError
};

"use strict";
var StripoFileWorkflows = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

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
  function requireValue(condition, code, message) {
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
    requireValue(object(value), "INVALID_RESPONSE", "Expected an MCP object response.");
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
    requireValue(typeof value === "string" && value.length > 0, "INVALID_RESPONSE", `Missing ${name}.`);
    return value;
  }
  function limit(value) {
    requireValue(Number.isSafeInteger(value) && value > 0, "INVALID_RESPONSE", "Missing positive maxBytes in upload ticket.");
    return value;
  }
  function targetOf(input) {
    requireValue(Number.isSafeInteger(input.id) && input.id > 0 && (input.type === void 0 || input.type === "EMAIL" || input.type === "TEMPLATE"), "INVALID_TARGET", "Expected a positive target id and EMAIL or TEMPLATE type.");
    return { id: input.id, type: input.type ?? "EMAIL" };
  }
  function destination(directory, name) {
    return `${directory.replace(/\/$/u, "")}/${name}`;
  }
  function download(id, response, file, maxBytes, format) {
    return { id, method: "GET", url: string(response.downloadUrl, "downloadUrl"), expiresAt: string(response.expiresAt, "expiresAt"), file, maxBytes, format };
  }
  function upload(id, response, file) {
    if (response.method !== void 0) requireValue(response.method === "PUT", "UNSUPPORTED_METHOD", "Upload ticket requires an unsupported HTTP method.");
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
      const start = this.now();
      await this.event({ name, phase: "started", at: (/* @__PURE__ */ new Date()).toISOString(), ...args ? { arguments: args } : {} });
      try {
        const result = await action();
        const outcome = object(result) ? result.status ?? result.error_code : void 0;
        await this.event({ name, phase: "completed", at: (/* @__PURE__ */ new Date()).toISOString(), durationMs: Math.max(0, this.now() - start), ...typeof outcome === "string" ? { outcome } : {} });
        return result;
      } catch (error) {
        await this.event({ name, phase: "failed", at: (/* @__PURE__ */ new Date()).toISOString(), durationMs: Math.max(0, this.now() - start), error: failure(error) });
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
        requireValue(Array.isArray(report.results) && report.results.length === request.transfers.length, "INVALID_TRANSFER_RESULT", "Transfer helper did not report every requested file.");
        for (const item of request.transfers) {
          const matches = report.results.filter((result) => result.id === item.id);
          requireValue(matches.length === 1 && matches[0].file === item.file && matches[0].method === item.method, "INVALID_TRANSFER_RESULT", "Transfer receipt does not match its requested file.");
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
  async function execute(input, host, action) {
    const target = targetOf(input);
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
  function downloadEmailArtifacts(input, host) {
    return execute(input, host, async (workflow, target) => {
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
      requireValue(metadata.id === target.id && metadata.type === target.type.toLowerCase(), "TARGET_MISMATCH", "Metadata belongs to another target.");
      const model = ok(result(1));
      const transfers = [download("model", model, destination(input.directory, "model.json"), input.maxBytes ?? 20 * 1024 * 1024, "json")];
      let previewError;
      let previewsComplete = false;
      try {
        const previews = result(2);
        previewsComplete = previews.status === "OK";
        if (previews.status !== "OK" && previews.status !== "PARTIAL") throw new WorkflowFailure("PREVIEW_UNAVAILABLE", "Stripo could not produce previews.", previews);
        requireValue(Array.isArray(previews.screenshots), "INVALID_RESPONSE", "Missing screenshots array.");
        for (const mode of ["DESKTOP", "MOBILE"]) {
          const entries = previews.screenshots.filter((item) => object(item) && item.mode === mode);
          requireValue(entries.length <= 1, "INVALID_RESPONSE", `Duplicate ${mode} screenshot.`);
          if (entries[0]) transfers.push(download(mode.toLowerCase(), entries[0], destination(input.directory, `${mode.toLowerCase()}.png`), input.maxBytes ?? 20 * 1024 * 1024, "png"));
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
  function uploadImage(input, host) {
    return execute(input, host, async (workflow, target) => {
      requireValue(typeof input.name === "string" && input.name.length > 0 && input.name.length <= 100 && !/[\\/]/u.test(input.name), "INVALID_NAME", "Expected a plain image filename of at most 100 characters.");
      const ticket = await workflow.call("prepare_image_upload", { ...target, name: input.name });
      if (ticket.status !== void 0 && ticket.status !== "OK") throw new WorkflowFailure(String(ticket.status), "Image upload was refused.", ticket);
      if (ticket.error_code) throw new WorkflowFailure(String(ticket.error_code), String(ticket.reason ?? "Image upload was refused."), ticket);
      const session = string(ticket.uploadSessionId, "uploadSessionId");
      requireValue(Array.isArray(ticket.uploads), "INVALID_RESPONSE", "Missing image upload manifest.");
      const entries = ticket.uploads.filter((item) => object(item) && item.kind === "image");
      requireValue(entries.length === 1 && entries[0].method === "PUT", "INVALID_RESPONSE", "Expected exactly one image PUT upload.");
      const entry = entries[0];
      requireValue(Array.isArray(entry.contentTypes) && entry.contentTypes.every((item) => typeof item === "string"), "INVALID_RESPONSE", "Missing accepted image MIME types.");
      const transfer = await workflow.transfer({ transfers: [{ ...upload("image", entry, input.file), expiresAt: string(ticket.expiresAt, "expiresAt"), format: "image", contentTypes: entry.contentTypes, imageLimits: input.imageLimits }] });
      requireTransfers(transfer);
      const args = { ...target, name: input.name, uploadSessionId: session };
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
  function saveDocumentState(input, host) {
    return execute(input, host, async (workflow, target) => {
      requireValue(input.mode === "create" || input.mode === "edit", "INVALID_MODE", "Choose create or edit explicitly.");
      requireValue(input.mode === "edit" ? Boolean(input.baseFile) : input.baseFile === void 0, "BASE_REQUIRED", "Edits require the untouched acquired base; create is only for a newly created, unacquired email.");
      requireValue(host.validateDocument, "VALIDATOR_REQUIRED", "The host must validate the candidate against its base with the native SDK before preparing tickets.");
      const validation = await workflow.step("validate_document", () => host.validateDocument({ candidateFile: input.candidateFile, baseFile: input.baseFile, mode: input.mode, ...input.intent ? { intent: input.intent } : {} }));
      if (validation.valid !== true) throw new WorkflowFailure("VALIDATION_FAILED", "Native document validation failed.", validation.errors);
      const candidate = ok(await workflow.call("prepare_document_state_upload", target));
      const uploadId = string(candidate.uploadId, "uploadId");
      const transfers = [upload("candidate", candidate, input.candidateFile)];
      let baseUploadId;
      if (input.baseFile) {
        const base = ok(await workflow.call("prepare_document_state_upload", target));
        baseUploadId = string(base.uploadId, "baseUploadId");
        requireValue(baseUploadId !== uploadId, "INVALID_RESPONSE", "Candidate and base need different upload tickets.");
        transfers.push(upload("base", base, input.baseFile));
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
        readback = await workflow.transfer({ transfers: [download("readback", acquired, input.readbackFile, 20 * 1024 * 1024, "json")] });
        requireTransfers(readback);
      } catch (error) {
        readbackError = failure(error);
      }
      return { status: written.status === "WRITE_UNCONFIRMED" ? "WRITE_UNCONFIRMED" : readbackError ? "PARTIAL" : "OK", write: redacted(written), transfer, readback, ...readbackError ? { readbackError } : {}, requiresSemanticAndVisualInspection: true };
    });
  }
  return __toCommonJS(file_workflows_exports);
})();

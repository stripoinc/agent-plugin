"use strict";
var StripoCodex = (() => {
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

  // src/skill-scripts/stripo/codex-host.ts
  var codex_host_exports = {};
  __export(codex_host_exports, {
    createHost: () => createHost,
    downloadEmailArtifacts: () => downloadEmailArtifacts,
    saveDocumentState: () => saveDocumentState,
    uploadImage: () => uploadImage
  });

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

  // src/skill-scripts/stripo/codex-host.ts
  function object2(value) {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }
  function absolute(value, label) {
    if (typeof value !== "string" || !value.startsWith("/") || /[\0\r\n]/u.test(value)) throw new Error(`${label} must be an absolute POSIX path without line breaks.`);
    return value.length > 1 ? value.replace(/\/$/u, "") : value;
  }
  function quote(value) {
    return `'${value.replace(/'/gu, "'\\''")}'`;
  }
  function createHost(options) {
    const tools = options.tools;
    const names = new Set(options.toolNames);
    const tool = (name) => {
      if (!names.has(name) || typeof tools[name] !== "function") throw new Error(`Missing host tool: ${name}. Refresh the current tool catalog before bootstrapping.`);
      return (args) => tools[name].call(tools, args);
    };
    const bindings = resolveWorkflowTools([...names].filter((name) => typeof tools[name] === "function"), options.mcpPrefix);
    const bound = new Map([...bindings].map(([name, qualified]) => [name, tool(qualified)]));
    const execCommand = tool("exec_command");
    const writeStdin = tool("write_stdin");
    const scripts = `${absolute(options.skillDirectory, "skillDirectory")}/scripts`;
    const directory = absolute(options.taskDirectory, "taskDirectory");
    const executable = options.nodeExecutable ?? "node";
    if (!executable || /[\0\r\n]/u.test(executable)) throw new Error("nodeExecutable must be one executable name or path.");
    if (options.transferPermissions?.sandbox_permissions === "require_escalated" && !options.transferPermissions.justification?.trim()) {
      throw new Error("An escalated transfer requires the host's explicit justification.");
    }
    const runId = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
    let sequence = 0;
    async function run(script, request) {
      const reportFile = `${directory}/stripo-${runId}-${++sequence}-${script}.json`;
      const stdin = JSON.stringify(request);
      const environment = 'env -i PATH="$PATH" TMPDIR="${TMPDIR:-/tmp}"';
      const cmd = `${environment} ${quote(executable)} ${quote(`${scripts}/${script}.mjs`)} --request - --result ${quote(reportFile)} <<'STRIPO_HOST_REQUEST'
${stdin}
STRIPO_HOST_REQUEST`;
      let response = await execCommand({
        cmd,
        workdir: directory,
        login: false,
        shell: "/bin/sh",
        yield_time_ms: 1e3,
        max_output_tokens: 12e3,
        ...script === "transfer" ? options.transferPermissions : {}
      });
      let output = "";
      for (; ; ) {
        if (!object2(response) || typeof response.output !== "string") throw new Error(`Invalid exec response. Inspect ${reportFile}; do not replay a transfer.`);
        output += response.output;
        if (typeof response.exit_code === "number") {
          let result;
          try {
            result = JSON.parse(output);
          } catch {
            throw new Error(`Missing or truncated helper report (exit ${response.exit_code}). Inspect ${reportFile}; do not replay a transfer.`);
          }
          if (!object2(result) || ![0, 1].includes(response.exit_code)) throw new Error(`Helper failed (exit ${response.exit_code}). Inspect ${reportFile}.`);
          return result;
        }
        if (typeof response.session_id !== "number") throw new Error(`Missing exec completion. Inspect ${reportFile}; do not replay a transfer.`);
        response = await writeStdin({ session_id: response.session_id, chars: "", yield_time_ms: 1e3, max_output_tokens: 12e3 });
      }
    }
    return {
      callTool(name, args) {
        const call = bound.get(name);
        if (!call) return Promise.reject(new Error(`Tool is outside the Stripo file workflow: ${name}`));
        return call(args);
      },
      async transfer(request) {
        const result = await run("transfer", request);
        if (!["OK", "FAILED"].includes(String(result.status)) || !Array.isArray(result.results)) throw new Error("Invalid transfer report; inspect the saved report without repeating the transfer.");
        return result;
      },
      async validateDocument(input) {
        const result = await run("host-checks", { kind: "document", ...input });
        if (typeof result.valid !== "boolean") throw new Error("Invalid native validation report.");
        return { valid: result.valid, errors: result.errors };
      },
      async validateImageUrl(input) {
        const result = await run("host-checks", { kind: "image-url", ...input });
        if (typeof result.valid !== "boolean") throw new Error("Invalid hosted image URL validation report.");
        return result.valid;
      },
      ...options.recordEvent ? { recordEvent: options.recordEvent } : {},
      ...options.now ? { now: options.now } : {}
    };
  }
  return __toCommonJS(codex_host_exports);
})();

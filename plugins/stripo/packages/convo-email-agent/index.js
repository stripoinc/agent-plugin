import {
  CANONICAL_MCP_OPERATIONS,
  EMAIL_INTERFACE_MCP_BRANDS,
  RETENO_MCP_TOOL_MAPPING,
  STRIPO_MCP_TOOL_MAPPING,
  getMcpOperationsForBrand,
  getMcpToolMapping,
  supportsEmailInterfaces
} from "./mcp-tools-ee578203cab8.js";
import {
  createEmailBuilder,
  createEmailFromDraft,
  createMinimalEmailSeed,
  minimalEmailComponents
} from "./create-fe297c6d63eb.js";
import {
  createEmailMutationSdk,
  createEmailSdk,
  uniqueUuidFromSeed,
  uuidFromSeed
} from "./content-mutations-15913d881744.js";
import "./styles-961c8e1b984f.js";
import "./parse-html-13fe7bf5afc4.js";
import {
  summarizeEditorJson
} from "./inspection-70055d97b33b.js";
import {
  EmailSdkSchemaError,
  assertValidEmailModel,
  setEmailSchema
} from "./model-2461f952bfd9.js";
import {
  DocumentStateError,
  contractDefaults,
  getCapabilities,
  getContract,
  getJsonSchema,
  jsonIssues,
  nodeSchema,
  requireValid,
  validateChange,
  validateEmailDocument,
  validateSnapshot
} from "./contract-c566956db999.js";
import "./social-f4a8e0da8c68.js";
import {
  EmailSdkError,
  cloneJson,
  describeNodeKind,
  isObject
} from "./errors-3ee69a7e1eb0.js";

// convo-email-agent/src/sdk/value-editor.ts
function createEmailValueEditor(email) {
  const wrappers = /* @__PURE__ */ new WeakMap();
  const structuralMethods = /* @__PURE__ */ new Set(["insert", "insertFrom", "append", "duplicate", "move", "remove", "repeat", "slot"]);
  function wrap(value) {
    if (typeof value === "function") {
      const method = (...args) => wrap(Reflect.apply(value, void 0, args));
      Object.setPrototypeOf(method, null);
      return Object.freeze(method);
    }
    if (value === null || typeof value !== "object") return value;
    if (wrappers.has(value)) return wrappers.get(value);
    if (Array.isArray(value)) return Object.freeze(value.map(wrap));
    const handle = /* @__PURE__ */ Object.create(null);
    wrappers.set(value, handle);
    for (const [key, member] of Object.entries(value)) {
      if (!structuralMethods.has(key)) handle[key] = wrap(member);
    }
    return Object.freeze(handle);
  }
  return wrap(email);
}

// convo-email-agent/src/sdk/document.ts
import { validateBlock } from "./editor-validator/index.mjs";
function openDocument(options) {
  requireValid(validateSnapshot(options.current));
  return createEmailSdk({ ...options, emailJson: options.current });
}
function createDocument({ current, stripes = [], ...options }) {
  requireValid(validateSnapshot(current));
  const old = cloneJson(current);
  const intent = { ...options.intent, removeNodes: [...options.intent?.removeNodes ?? [], ...(old.stripes ?? []).map((stripe) => stripe.id)] };
  return createEmailSdk({ ...options, current, emailJson: { ...old, stripes: cloneJson(stripes) }, intent });
}
function createBlock(type, input) {
  nodeSchema(type);
  const problems = jsonIssues(input);
  if (problems.length) throw new DocumentStateError(problems);
  const complete = (defaults, supplied) => {
    if (!isObject(defaults) || !isObject(supplied)) return cloneJson(supplied);
    if (["mode", "type"].some((key) => supplied[key] !== void 0 && defaults[key] !== void 0 && supplied[key] !== defaults[key])) return cloneJson(supplied);
    return { ...cloneJson(defaults), ...Object.fromEntries(Object.entries(supplied).map(([key, value]) => [key, complete(defaults[key], value)])) };
  };
  const block = { ...cloneJson(input), type, settings: complete(contractDefaults(type), input.settings ?? {}) };
  const result = validateBlock(block);
  if (!result.success) throw new DocumentStateError(result.issues.map((issue) => ({
    code: "INVALID_BLOCK",
    stage: "schema",
    input: "target",
    path: issue.path.join(".") || "<root>",
    message: issue.message,
    nativeCode: issue.code,
    nodeId: input.id,
    nodeType: type
  })));
  const checkKeys = (value, parsed, path) => {
    if (Array.isArray(value) && Array.isArray(parsed)) value.forEach((item, index) => checkKeys(item, parsed[index], `${path}.${index}`));
    else if (isObject(value) && isObject(parsed)) for (const key of Object.keys(value)) {
      if (!Object.hasOwn(parsed, key)) throw new DocumentStateError([{ code: "UNKNOWN_FIELD", stage: "json", input: "target", path: `${path}.${key}`, message: "Unknown factory field." }]);
      checkKeys(value[key], parsed[key], `${path}.${key}`);
    }
  };
  checkKeys(block, result.documentState, type);
  return cloneJson(result.documentState);
}
function createStripe(input) {
  const document = createEmailFromDraft({ emailJson: { stripes: [input] } });
  return document.stripes[0];
}
function createStructure(input, options = {}) {
  const problems = jsonIssues(input);
  if (problems.length) throw new DocumentStateError(problems);
  if (input.columns.some((column) => !Number.isFinite(column.weight) || column.weight <= 0)) throw new Error("Column weights must be positive finite numbers.");
  const seed = { stripes: [{ structures: [{
    id: input.id,
    settings: { ...input.settings, responsiveMobile: input.mobile ?? input.columns.length > 1 },
    columns: input.columns.map((column) => ({ id: column.id, settings: { width: column.weight }, containers: column.containers }))
  }] }] };
  const document = createEmailFromDraft({ emailJson: seed, idFactory: options.idFactory });
  const structure = document.stripes?.[0]?.structures?.[0];
  if (!isObject(structure)) throw new Error("Structure factory did not produce a structure.");
  return structure;
}
export {
  CANONICAL_MCP_OPERATIONS,
  DocumentStateError,
  EMAIL_INTERFACE_MCP_BRANDS,
  EmailSdkError,
  EmailSdkSchemaError,
  RETENO_MCP_TOOL_MAPPING,
  STRIPO_MCP_TOOL_MAPPING,
  assertValidEmailModel,
  createBlock,
  createDocument,
  createEmailBuilder,
  createEmailFromDraft,
  createEmailMutationSdk,
  createEmailSdk,
  createEmailValueEditor,
  createMinimalEmailSeed,
  createStripe,
  createStructure,
  describeNodeKind,
  getCapabilities,
  getContract,
  getJsonSchema,
  getMcpOperationsForBrand,
  getMcpToolMapping,
  minimalEmailComponents,
  openDocument,
  setEmailSchema,
  summarizeEditorJson,
  supportsEmailInterfaces,
  uniqueUuidFromSeed,
  uuidFromSeed,
  validateChange,
  validateEmailDocument,
  validateSnapshot
};

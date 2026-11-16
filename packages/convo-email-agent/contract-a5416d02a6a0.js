import {
  RULE_TABLE
} from "./rule-table-generated-439fbe3342c9.js";
import {
  cloneJson,
  deepFreeze,
  isObject
} from "./errors-3ee69a7e1eb0.js";

// convo-email-agent/src/sdk/contract.ts
import schemaData from "./contract-data/schema.js";
import catalogData from "./contract-data/catalog.js";
import supportData from "./contract-data/support.js";
var blockKinds = {
  text: true,
  image: true,
  video: true,
  timer: true,
  social: true,
  html: true,
  button: true,
  spacer: true,
  menu: true,
  unknown: true
};
var schema = deepFreeze(schemaData);
var nodes = deepFreeze(catalogData.nodes);
function getContract() {
  return Object.freeze({
    editorRevision: catalogData.editorRevision,
    editorDirty: RULE_TABLE.editorDirty,
    profile: "mergeService",
    validation: "contract",
    validatorSha256: RULE_TABLE.rulesSha256
  });
}
function getJsonSchema() {
  return cloneJson(schema);
}
function contractSchema() {
  return schema;
}
function getCapabilities() {
  const groups = supportData.groups;
  return deepFreeze({
    blocks: [...catalogData.blocks],
    nodes: cloneJson(nodes),
    fields: Object.fromEntries(Object.entries(supportData.fields).map(([path, entry]) => [path, cloneJson(groups[entry.group])]))
  });
}
function nodeCapability(kind) {
  const definition = kind in blockKinds ? "".concat(kind, "Block") : kind;
  return nodes.find((node) => node.schemaDefinition === definition);
}
var resolvedNodes = /* @__PURE__ */ new WeakMap();
function resolveSchema(node) {
  if (!node.$ref) return node;
  const cached = resolvedNodes.get(node);
  if (cached) return cached;
  const resolved = node.$ref.slice(2).split("/").reduce((value, key) => isObject(value) ? value[key] : void 0, schema);
  if (!isObject(resolved)) throw new Error("Unresolved contract reference: ".concat(node.$ref));
  const result = Object.freeze({ ...resolveSchema(resolved), ...Object.fromEntries(Object.entries(node).filter(([key]) => key !== "$ref")) });
  resolvedNodes.set(node, result);
  return result;
}
function nodeSchema(kind) {
  const definition = kind in blockKinds ? "".concat(kind, "Block") : kind;
  const result = schema.definitions?.[definition];
  if (!result) throw new Error("Unsupported SDK node kind: ".concat(kind));
  return resolveSchema(result);
}
function contractDefaults(kind) {
  const name = "DEFAULT_".concat(kind.toUpperCase()).concat(kind === "container" ? "" : "_BLOCK", "_SETTINGS");
  const defaults = catalogData.defaults[name];
  return isObject(defaults) ? cloneJson(defaults) : {};
}
var declaredProperties = /* @__PURE__ */ new WeakMap();
var mergedBranches = /* @__PURE__ */ new WeakMap();
function schemaForValue(node, value, resolve = resolveSchema) {
  const resolved = resolve(node);
  const branches = resolved.oneOf ?? resolved.anyOf;
  if (!branches) return resolved;
  const variants = branches.map((branch) => resolve(branch));
  const candidates = variants.filter((branch) => {
    if (!isObject(value)) return branch.type === typeof value || value === null && branch.type === "null";
    return Object.entries(branch.properties ?? {}).every(([key, child]) => {
      const property = resolve(child);
      return !Object.hasOwn(value, key) || property.const === void 0 && !property.enum || (property.const !== void 0 ? property.const === value[key] : property.enum?.includes(value[key]));
    });
  });
  const declared = (resolve === resolveSchema ? declaredProperties.get(resolved) : void 0) ?? Object.freeze(Object.assign({}, ...variants.map((branch) => branch.properties ?? {})));
  if (resolve === resolveSchema) declaredProperties.set(resolved, declared);
  if (candidates.length === 1) {
    const chosen = schemaForValue(candidates[0], value, resolve);
    if (!chosen.properties) return chosen;
    if (resolve !== resolveSchema) return { ...chosen, properties: { ...declared, ...chosen.properties } };
    let merged = mergedBranches.get(resolved);
    if (!merged) {
      merged = /* @__PURE__ */ new WeakMap();
      mergedBranches.set(resolved, merged);
    }
    let result = merged.get(chosen);
    if (!result) {
      result = Object.freeze({ ...chosen, properties: Object.freeze({ ...declared, ...chosen.properties }) });
      merged.set(chosen, result);
    }
    return result;
  }
  return { ...resolved, properties: candidates.length ? Object.assign({}, ...candidates.map((branch) => branch.properties ?? {})) : declared };
}

export {
  getContract,
  getJsonSchema,
  contractSchema,
  getCapabilities,
  nodeCapability,
  resolveSchema,
  nodeSchema,
  contractDefaults,
  schemaForValue
};

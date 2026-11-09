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
function resolveSchema(node) {
  if (!node.$ref) return node;
  const resolved = node.$ref.slice(2).split("/").reduce((value, key) => isObject(value) ? value[key] : void 0, schema);
  if (!isObject(resolved)) throw new Error("Unresolved contract reference: ".concat(node.$ref));
  return { ...resolveSchema(resolved), ...Object.fromEntries(Object.entries(node).filter(([key]) => key !== "$ref")) };
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
function schemaForValue(node, value) {
  const resolved = resolveSchema(node);
  const branches = resolved.oneOf ?? resolved.anyOf;
  if (!branches) return resolved;
  const variants = branches.map(resolveSchema);
  const candidates = variants.filter((branch) => {
    if (!isObject(value)) return branch.type === typeof value || value === null && branch.type === "null";
    return Object.entries(branch.properties ?? {}).every(([key, child]) => {
      const property = resolveSchema(child);
      return !Object.hasOwn(value, key) || property.const === void 0 && !property.enum || (property.const !== void 0 ? property.const === value[key] : property.enum?.includes(value[key]));
    });
  });
  const declared = Object.assign({}, ...variants.map((branch) => branch.properties ?? {}));
  if (candidates.length === 1) {
    const chosen = schemaForValue(candidates[0], value);
    return chosen.properties ? { ...chosen, properties: { ...declared, ...chosen.properties } } : chosen;
  }
  return { ...resolved, properties: candidates.length ? Object.assign({}, ...candidates.map((branch) => branch.properties ?? {})) : declared };
}

// convo-email-agent/src/sdk/validator/structure.ts
var CONTINUABLE = /* @__PURE__ */ new Set(["too_small", "too_big", "not_multiple_of", "custom", "unrecognized_keys"]);
var ABORTING = /* @__PURE__ */ new WeakSet();
var aborts = (issues) => issues.some((issue) => !CONTINUABLE.has(issue.code) || ABORTING.has(issue));
function abort(issues) {
  for (const issue of issues) ABORTING.add(issue);
  return issues;
}
function finish(issues, location, value, path, rules) {
  return aborts(issues) ? issues : [...issues, ...rules(location, value, path)];
}
var quoteAll = (values) => values.map((value) => JSON.stringify(value)).join(", ");
var describe = (value) => value === null ? "null" : Array.isArray(value) ? "array" : typeof value;
var TYPE_NAMES = { integer: "int" };
function matchesType(type, value) {
  switch (type) {
    case "integer":
      return typeof value === "number" && Number.isInteger(value);
    case "number":
      return typeof value === "number" && Number.isFinite(value);
    case "object":
      return isObject(value);
    case "array":
      return Array.isArray(value);
    case "null":
      return value === null;
    default:
      return typeof value === type;
  }
}
var isNullBranch = (node) => resolveSchema(node).type === "null";
function discriminator(branches) {
  return Object.keys(branches[0]?.properties ?? {}).find((key) => {
    const values = branches.map((branch) => branch.properties?.[key] ? allowedValues(branch.properties[key]) : []);
    const all = values.flat();
    return values.every((list) => list.length > 0) && new Set(all).size === all.length;
  });
}
function allowedValues(property) {
  const resolved = resolveSchema(property);
  return resolved.const !== void 0 ? [resolved.const] : resolved.enum ?? [];
}
function checkUnion(branches, discriminated, value, path, location, rules) {
  const resolved = branches.map(resolveSchema);
  const key = isObject(value) ? discriminator(resolved) : void 0;
  if (key !== void 0 && isObject(value)) {
    const index = resolved.findIndex((branch) => allowedValues(branch.properties[key]).includes(value[key]));
    if (index < 0) {
      const allowed = resolved.flatMap((branch) => allowedValues(branch.properties[key]));
      return [{ path: [...path, key], code: discriminated ? "invalid_union" : "invalid_value", values: allowed, message: "must be one of ".concat(quoteAll(allowed)) }];
    }
    return checkValue(branches[index], value, path, "".concat(location, "|").concat(index), rules);
  }
  const results = [];
  for (const [index, branch] of branches.entries()) {
    const issues = checkValue(branch, value, path, "".concat(location, "|").concat(index), rules);
    if (!issues.length) return [];
    results.push(issues);
  }
  const open = results.filter((issues) => !aborts(issues));
  if (open.length === 1) return open[0];
  return abort(results.reduce((closest, issues) => issues.length < closest.length ? issues : closest));
}
function checkValue(node, value, path, location, rules) {
  const schema2 = resolveSchema(node);
  const branches = schema2.oneOf ?? schema2.anyOf;
  if (branches) {
    const nonNull = branches.filter((branch) => !isNullBranch(branch));
    if (value === null && nonNull.length < branches.length) return [];
    if (nonNull.length === 1) return checkValue(nonNull[0], value, path, location, rules);
    return finish(checkUnion(nonNull, schema2.oneOf !== void 0, value, path, location, rules), location, value, path, rules);
  }
  const types = schema2.type === void 0 ? void 0 : Array.isArray(schema2.type) ? schema2.type : [schema2.type];
  if (value === null && types?.includes("null")) return [];
  if (types && !types.some((type) => matchesType(type, value))) {
    const expected = types.filter((type) => type !== "null").map((type) => TYPE_NAMES[type] ?? type).join(" | ");
    return [{ path: [...path], code: "invalid_type", message: "expected ".concat(expected, ", received ").concat(describe(value)) }];
  }
  if (schema2.const !== void 0 && value !== schema2.const) {
    return [{ path: [...path], code: "invalid_value", values: [schema2.const], message: "must be one of ".concat(quoteAll([schema2.const])) }];
  }
  if (Array.isArray(schema2.enum) && !schema2.enum.includes(value)) {
    return [{ path: [...path], code: "invalid_value", values: schema2.enum, message: "must be one of ".concat(quoteAll(schema2.enum)) }];
  }
  const issues = [];
  const limit = (code, message) => {
    issues.push({ path: [...path], code, message });
  };
  if (typeof value === "string") {
    if (typeof schema2.minLength === "number" && value.length < schema2.minLength) limit("too_small", "Too small: expected string to have >=".concat(schema2.minLength, " characters"));
    if (typeof schema2.maxLength === "number" && value.length > schema2.maxLength) limit("too_big", "Too big: expected string to have <=".concat(schema2.maxLength, " characters"));
  }
  if (typeof value === "number") {
    if (typeof schema2.minimum === "number" && value < schema2.minimum) limit("too_small", "Too small: expected number to be >=".concat(schema2.minimum));
    if (typeof schema2.maximum === "number" && value > schema2.maximum) limit("too_big", "Too big: expected number to be <=".concat(schema2.maximum));
    if (typeof schema2.multipleOf === "number" && !Number.isInteger(Number((value / schema2.multipleOf).toFixed(10)))) {
      limit("not_multiple_of", "Invalid number: must be a multiple of ".concat(schema2.multipleOf));
    }
  }
  if (isObject(value)) {
    for (const key of schema2.required ?? []) {
      if (value[key] === void 0) issues.push({ path: [...path], code: "invalid_type", message: "missing required property ".concat(JSON.stringify(key)) });
    }
    const unknown = [];
    for (const [key, child] of Object.entries(value)) {
      if (child === void 0) continue;
      const property = schema2.properties?.[key];
      if (property) issues.push(...checkValue(property, child, [...path, key], "".concat(location, ".").concat(key), rules));
      else if (isObject(schema2.additionalProperties)) issues.push(...checkValue(schema2.additionalProperties, child, [...path, key], "".concat(location, ".*"), rules));
      else if (schema2.additionalProperties === false) unknown.push(key);
    }
    if (unknown.length) {
      issues.push({ path: [...path], code: "unrecognized_keys", keys: unknown, message: unknown.map((key) => "unsupported property ".concat(JSON.stringify(key))).join("; ") });
    }
    if (typeof schema2.minProperties === "number" && Object.keys(value).length < schema2.minProperties) {
      limit("too_small", "Too small: expected object to have >=".concat(schema2.minProperties, " properties"));
    }
  }
  if (Array.isArray(value)) {
    if (schema2.items) value.forEach((item, index) => issues.push(...checkValue(schema2.items, item, [...path, index], "".concat(location, "[]"), rules)));
    if (typeof schema2.minItems === "number" && value.length < schema2.minItems) limit("too_small", "Too small: expected array to have >=".concat(schema2.minItems, " items"));
    if (typeof schema2.maxItems === "number" && value.length > schema2.maxItems) limit("too_big", "Too big: expected array to have <=".concat(schema2.maxItems, " items"));
  }
  return finish(issues, location, value, path, rules);
}
function documentRoot() {
  return { node: contractSchema(), location: "$" };
}
var BLOCK_LOCATION = "$.stripes[].structures[].columns[].containers[].blocks[]";
function blockRoot() {
  const block = contractSchema().definitions?.block;
  if (!block) throw new Error("The pinned contract has no block definition.");
  return { node: block, location: BLOCK_LOCATION };
}

export {
  getContract,
  getJsonSchema,
  getCapabilities,
  nodeCapability,
  resolveSchema,
  nodeSchema,
  contractDefaults,
  schemaForValue,
  abort,
  checkValue,
  documentRoot,
  blockRoot
};

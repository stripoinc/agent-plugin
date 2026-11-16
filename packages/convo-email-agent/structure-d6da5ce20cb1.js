import {
  contractSchema,
  resolveSchema
} from "./contract-a5416d02a6a0.js";
import {
  isThemeBackground
} from "./colors-c40f90dc9241.js";
import {
  RULE_TABLE
} from "./rule-table-generated-439fbe3342c9.js";
import {
  isObject
} from "./errors-3ee69a7e1eb0.js";

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
var INPUT_TYPES = RULE_TABLE.inputTypes;
function allowedValues(property, resolve) {
  const resolved = resolve(property);
  return resolved.const !== void 0 ? [resolved.const] : resolved.enum ?? [];
}
var unions = /* @__PURE__ */ new WeakMap();
function unionOf(schema, branches, resolve) {
  const cached = resolve === resolveSchema ? unions.get(schema) : void 0;
  if (cached) return cached;
  const nonNull = branches.filter((branch) => resolve(branch).type !== "null");
  const resolved = nonNull.map((branch) => resolve(branch));
  const key = Object.keys(resolved[0]?.properties ?? {}).find((name) => {
    const values = resolved.map((branch) => branch.properties?.[name] ? allowedValues(branch.properties[name], resolve) : []);
    const all = values.flat();
    return values.every((list) => list.length > 0) && new Set(all).size === all.length;
  });
  const union = {
    nullable: nonNull.length < branches.length,
    branches: nonNull,
    key,
    allowed: key === void 0 ? [] : resolved.map((branch) => allowedValues(branch.properties[key], resolve))
  };
  if (resolve === resolveSchema) unions.set(schema, union);
  return union;
}
function checkUnion({ branches, key, allowed }, discriminated, value, path, location, rules, resolve) {
  if (key !== void 0 && isObject(value)) {
    const index = allowed.findIndex((values) => values.includes(value[key]));
    if (index < 0) {
      const all = allowed.flat();
      return [{ path: [...path, key], code: discriminated ? "invalid_union" : "invalid_value", values: all, message: "must be one of ".concat(quoteAll(all)) }];
    }
    return checkValue(branches[index], value, path, "".concat(location, "|").concat(index), rules, resolve);
  }
  const results = [];
  for (const [index, branch] of branches.entries()) {
    const issues = checkValue(branch, value, path, "".concat(location, "|").concat(index), rules, resolve);
    if (!issues.length) return [];
    results.push(issues);
  }
  const open = results.filter((issues) => !aborts(issues));
  if (open.length === 1) return open[0];
  return abort(results.reduce((closest, issues) => issues.length < closest.length ? issues : closest));
}
function checkValue(node, value, path, location, rules, resolve = resolveSchema) {
  const schema = resolve(node);
  const branches = schema.oneOf ?? schema.anyOf;
  if (branches) {
    const union = unionOf(schema, branches, resolve);
    if (value === null && union.nullable) return [];
    if (union.branches.length === 1) return checkValue(union.branches[0], value, path, location, rules, resolve);
    return finish(checkUnion(union, schema.oneOf !== void 0, value, path, location, rules, resolve), location, value, path, rules);
  }
  const types = INPUT_TYPES[location] ?? (schema.type === void 0 ? void 0 : Array.isArray(schema.type) ? schema.type : [schema.type]);
  if (value === null && types?.includes("null")) return [];
  if (types && !types.some((type) => matchesType(type, value))) {
    const expected = types.filter((type) => type !== "null").map((type) => TYPE_NAMES[type] ?? type).join(" | ");
    return [{ path: [...path], code: "invalid_type", message: "expected ".concat(expected, ", received ").concat(describe(value)) }];
  }
  if (schema.const !== void 0 && value !== schema.const) {
    return [{ path: [...path], code: "invalid_value", values: [schema.const], message: "must be one of ".concat(quoteAll([schema.const])) }];
  }
  if (Array.isArray(schema.enum) && !schema.enum.includes(value)) {
    return [{ path: [...path], code: "invalid_value", values: schema.enum, message: "must be one of ".concat(quoteAll(schema.enum)) }];
  }
  const issues = [];
  const limit = (code, message) => {
    issues.push({ path: [...path], code, message });
  };
  if (typeof value === "string") {
    if (typeof schema.minLength === "number" && value.length < schema.minLength) limit("too_small", "Too small: expected string to have >=".concat(schema.minLength, " characters"));
    if (typeof schema.maxLength === "number" && value.length > schema.maxLength) limit("too_big", "Too big: expected string to have <=".concat(schema.maxLength, " characters"));
  }
  if (typeof value === "number") {
    if (typeof schema.minimum === "number" && value < schema.minimum) limit("too_small", "Too small: expected number to be >=".concat(schema.minimum));
    if (typeof schema.maximum === "number" && value > schema.maximum) limit("too_big", "Too big: expected number to be <=".concat(schema.maximum));
    if (typeof schema.multipleOf === "number" && !Number.isInteger(Number((value / schema.multipleOf).toFixed(10)))) {
      limit("not_multiple_of", "Invalid number: must be a multiple of ".concat(schema.multipleOf));
    }
  }
  if (isObject(value)) {
    for (const key of schema.required ?? []) {
      if (value[key] === void 0) issues.push({ path: [...path], code: "invalid_type", message: "missing required property ".concat(JSON.stringify(key)) });
    }
    const unknown = [];
    for (const [key, child] of Object.entries(value)) {
      if (child === void 0) continue;
      const property = schema.properties && Object.hasOwn(schema.properties, key) ? schema.properties[key] : void 0;
      if (property) issues.push(...checkValue(property, child, [...path, key], "".concat(location, ".").concat(key), rules, resolve));
      else if (isObject(schema.additionalProperties)) issues.push(...checkValue(schema.additionalProperties, child, [...path, key], "".concat(location, ".*"), rules, resolve));
      else if (schema.additionalProperties === false) unknown.push(key);
    }
    if (unknown.length) {
      issues.push({ path: [...path], code: "unrecognized_keys", keys: unknown, message: unknown.map((key) => "unsupported property ".concat(JSON.stringify(key))).join("; ") });
    }
    if (typeof schema.minProperties === "number" && Object.keys(value).length < schema.minProperties) {
      limit("too_small", "Too small: expected object to have >=".concat(schema.minProperties, " properties"));
    }
  }
  if (Array.isArray(value)) {
    if (schema.items) value.forEach((item, index) => issues.push(...checkValue(schema.items, item, [...path, index], "".concat(location, "[]"), rules, resolve)));
    if (typeof schema.minItems === "number" && value.length < schema.minItems) limit("too_small", "Too small: expected array to have >=".concat(schema.minItems, " items"));
    if (typeof schema.maxItems === "number" && value.length > schema.maxItems) limit("too_big", "Too big: expected array to have <=".concat(schema.maxItems, " items"));
  }
  if (schema.editorThemeBackground && typeof value === "string") {
    if (!isThemeBackground(value)) limit("custom", "Expected a static color or a CSS gradient with a solid fallback.");
    return issues;
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
  abort,
  checkValue,
  documentRoot,
  blockRoot
};

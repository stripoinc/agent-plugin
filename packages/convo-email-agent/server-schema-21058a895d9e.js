import {
  serverFields
} from "./server-fields-generated-06043b8282b8.js";
import {
  nodeSchema,
  resolveSchema
} from "./contract-a5416d02a6a0.js";
import {
  cloneJson,
  deepFreeze,
  isObject,
  stableJson
} from "./errors-3ee69a7e1eb0.js";

// convo-email-agent/src/sdk/server-schema.ts
var shapes = deepFreeze(serverFields.shapes);
var schemaKeywords = [
  "type",
  "const",
  "enum",
  "minimum",
  "maximum",
  "minLength",
  "maxLength",
  "minItems",
  "maxItems",
  "minProperties",
  "maxProperties",
  "multipleOf",
  "pattern",
  "format",
  "exclusiveMinimum",
  "exclusiveMaximum",
  "uniqueItems",
  "not",
  "if",
  "then",
  "else",
  "contains",
  "dependencies",
  "patternProperties"
];
var stripePath = ["stripes", "[]"];
var structurePath = [...stripePath, "structures", "[]"];
var containerPath = [...structurePath, "columns", "[]", "containers", "[]"];
var blockPath = [...containerPath, "blocks", "[]"];
var layoutPaths = /* @__PURE__ */ new Map([["stripe", stripePath], ["structure", structurePath], ["container", containerPath]]);
function properties(node, key) {
  return node?.properties && Object.hasOwn(node.properties, key) ? node.properties[key] : void 0;
}
function remoteResolver(root) {
  return function resolve(node, seen = /* @__PURE__ */ new Set()) {
    if (!isObject(node) || seen.has(node) || seen.size > 32) return void 0;
    const { $ref, allOf, ...rest } = node;
    if ($ref === void 0 && allOf === void 0) return node;
    seen.add(node);
    if (allOf !== void 0 && (!Array.isArray(allOf) || allOf.length !== 1)) return void 0;
    const reference = typeof $ref === "string" && /^#\/(?:definitions|\$defs)\/[^/]+$/.test($ref) ? $ref.slice(2).split("/").reduce((value, part) => isObject(value) && Object.hasOwn(value, part) ? value[part] : void 0, root) : void 0;
    const resolved = resolve($ref === void 0 ? allOf?.[0] : reference, seen);
    return resolved && { ...resolved, ...rest };
  };
}
function liveNodes(root, path, resolve) {
  const node = resolve(root);
  if (!node) return [];
  if (path.length === 0) return [node];
  const branches = node.oneOf ?? node.anyOf;
  if (branches) return branches.flatMap((branch) => liveNodes(branch, path, resolve));
  const [part, ...remaining] = path;
  const child = part === "[]" ? node.items : properties(node, part);
  return child ? liveNodes(child, remaining, resolve) : [];
}
function valueShape(node, resolve, depth = 0) {
  const resolved = resolve(node);
  if (!resolved || depth > 32 || resolved.readOnly) return void 0;
  const shape = Object.fromEntries(schemaKeywords.filter((key) => Object.hasOwn(resolved, key)).map((key) => [key, resolved[key]]));
  for (const key of ["anyOf", "oneOf"]) {
    const branches = resolved[key]?.map((child) => valueShape(child, resolve, depth + 1));
    if (branches?.some((value) => value === void 0)) return void 0;
    if (branches) shape[key] = branches;
  }
  if (resolved.properties) {
    const children = Object.entries(resolved.properties).map(([key, child]) => [key, valueShape(child, resolve, depth + 1)]);
    if (children.some(([, child]) => child === void 0)) return void 0;
    shape.properties = Object.fromEntries(children);
  }
  if (resolved.required) shape.required = [...resolved.required].sort();
  if (resolved.items) {
    const items = valueShape(resolved.items, resolve, depth + 1);
    if (!items) return void 0;
    shape.items = items;
  }
  if (isObject(resolved.additionalProperties)) {
    const extra = valueShape(resolved.additionalProperties, resolve, depth + 1);
    if (!extra) return void 0;
    shape.additionalProperties = extra;
  } else if (typeof resolved.additionalProperties === "boolean") {
    shape.additionalProperties = resolved.additionalProperties;
  }
  return shape;
}
function extend(node, [part, ...path], field) {
  const resolved = resolveSchema(node);
  if (resolved.oneOf) return { ...resolved, oneOf: resolved.oneOf.map((branch) => extend(branch, [part, ...path], field)) };
  if (part === "[]" && resolved.items) return { ...resolved, items: extend(resolved.items, path, field) };
  if (!resolved.properties) throw new Error("Cannot extend a non-object settings schema.");
  const child = properties(resolved, part);
  const replacement = path.length === 0 ? field : child && extend(child, path, field);
  if (!replacement) throw new Error("Cannot resolve an SDK settings path.");
  return { ...resolved, properties: { ...resolved.properties, [part]: replacement } };
}
function advertisesWrite(node) {
  const runtimes = node["x-stripo-setDocumentStateRuntimes"];
  return !isObject(runtimes) || ["insert", "update"].every((action) => {
    const runtime = runtimes[action];
    return !isObject(runtime) || runtime.mergeService !== false;
  });
}
function sameField(nodes, requiredBranches, expected, resolve) {
  return nodes.length === requiredBranches && requiredBranches > 0 && nodes.every((node) => advertisesWrite(node) && stableJson(valueShape(node, resolve)) === stableJson(expected));
}
var ServerDocumentSchema = class {
  #overrides = /* @__PURE__ */ new Map();
  #fields = /* @__PURE__ */ new Set();
  #root;
  #resolveLive;
  constructor(document) {
    if (!isObject(document) || !isObject(document.properties)) throw new Error("Expected a Stripo Document State server schema.");
    const root = this.#root = cloneJson(document);
    const resolve = this.#resolveLive = remoteResolver(root);
    const blocks = liveNodes(root, blockPath, resolve).flatMap((node) => node.oneOf ?? node.anyOf ?? [node]).map((node) => resolve(node));
    if (!blocks.some((node) => resolve(properties(node, "type"))?.const === "text")) {
      throw new Error("Expected a Stripo Document State server schema with the native block definitions.");
    }
    const getOwners = (kind) => {
      const layout = layoutPaths.get(kind);
      if (layout) return liveNodes(root, layout, resolve);
      return blocks.filter((node) => resolve(properties(node, "type"))?.const === kind);
    };
    for (const { kind, path, shape } of serverFields.fields) {
      const owners = getOwners(kind);
      const parts = ["settings", ...path.split(".")];
      const variants = owners.flatMap((owner) => liveNodes(owner, ["settings"], resolve).flatMap((settings) => settings.oneOf ?? settings.anyOf ?? [settings])).length;
      const fields = owners.flatMap((owner) => liveNodes(owner, parts, resolve));
      if (!sameField(fields, variants, shapes[shape], resolve)) continue;
      this.#fields.add(kind + "." + path);
      this.#overrides.set(kind, extend(this.node(kind), parts, { ...shapes[shape], editorExtension: true }));
    }
    for (const kind of ["social", "spacer"]) {
      if (!this.has(kind, "darkTheme")) continue;
      const owners = getOwners(kind);
      const background = owners.flatMap((owner) => liveNodes(owner, ["settings", "backgroundColor"], resolve));
      const dark = owners.flatMap((owner) => liveNodes(owner, ["settings", "darkTheme", "backgroundColor"], resolve));
      if (!background.length || dark.length !== background.length || !dark.every((node, index) => {
        const colors = node.anyOf?.filter((variant) => resolve(variant)?.type !== "null") ?? [];
        return colors.length === 1 && stableJson(resolve(colors[0])) === stableJson(background[index]);
      })) continue;
      this.#fields.add(kind + ".backgroundColor");
      this.#overrides.set(kind, extend(
        this.node(kind),
        ["settings", "backgroundColor"],
        { type: "string", editorThemeBackground: true }
      ));
    }
    for (const shape of this.#overrides.values()) deepFreeze(shape);
  }
  get supportedFields() {
    return [...this.#fields];
  }
  has(kind, path) {
    return this.#fields.has(kind + "." + path);
  }
  isAdditional(kind, path) {
    return this.has(kind, path) && knownServerField(kind, path);
  }
  node(kind) {
    return this.#overrides.get(kind) ?? nodeSchema(kind);
  }
  acceptsAcquiredField(path, blockType) {
    const parts = path.map((part) => typeof part === "number" ? "[]" : part);
    const resolve = this.#resolveLive;
    if (!blockType) return liveNodes(this.#root, parts, resolve).length > 0;
    return liveNodes(this.#root, blockPath, resolve).some((node) => (node.oneOf ?? node.anyOf ?? [node]).some((branch) => resolve(properties(resolve(branch), "type"))?.const === blockType && liveNodes(branch, parts.slice(blockPath.length), resolve).length > 0));
  }
  resolve = (node) => {
    const resolved = resolveSchema(node);
    const name = node.$ref?.match(/^#\/definitions\/([^/]+)$/)?.[1];
    const override = name && this.#overrides.get(name.replace(/Block$/, ""));
    return override ? { ...resolved, ...override } : resolved;
  };
};
function knownServerField(kind, path) {
  return serverFields.fields.some((field) => field.kind === kind && field.path === path);
}

export {
  ServerDocumentSchema
};

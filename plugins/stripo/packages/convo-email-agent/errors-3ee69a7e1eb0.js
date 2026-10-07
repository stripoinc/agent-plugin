// convo-email-agent/src/sdk/errors.ts
var EmailSdkError = class extends Error {
  code = "INVALID_OPERATION";
  stage = "change";
  input = "target";
  path = "<root>";
  constructor(message) {
    super(message);
    this.name = "EmailSdkError";
  }
};

// convo-email-agent/src/sdk/model-utils.ts
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function objectValue(value) {
  return isObject(value) ? value : {};
}
function deepFreeze(value) {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    for (const child of Object.values(value)) deepFreeze(child);
    Object.freeze(value);
  }
  return value;
}
function stableJson(value) {
  return JSON.stringify(value, (_key, item) => isObject(item) ? Object.fromEntries(Object.keys(item).sort().map((key) => [key, item[key]])) : item);
}
function describeNodeKind(value) {
  if (!isObject(value)) return void 0;
  if (Array.isArray(value.structures)) return "stripe";
  if (Array.isArray(value.columns)) return "structure";
  if (Array.isArray(value.containers)) return "column";
  if (Array.isArray(value.blocks)) return "container";
  return typeof value.type === "string" ? "block" : void 0;
}
function collectNodeIds(value, ids = []) {
  if (Array.isArray(value)) {
    for (const item of value) collectNodeIds(item, ids);
    return ids;
  }
  if (!isObject(value)) return ids;
  if (typeof value.id === "string") ids.push(value.id);
  for (const key of ["stripes", "structures", "columns", "containers", "blocks"]) collectNodeIds(value[key], ids);
  return ids;
}
function resolveJsonPointer(root, pointer) {
  if (pointer === "") return root;
  if (!pointer.startsWith("/")) return void 0;
  let current = root;
  for (const rawSegment of pointer.slice(1).split("/")) {
    const segment = rawSegment.replace(/~1/g, "/").replace(/~0/g, "~");
    if (Array.isArray(current)) {
      current = current[Number(segment)];
    } else if (isObject(current)) {
      current = current[segment];
    } else {
      return void 0;
    }
  }
  return current;
}
function sealHandle(members) {
  const handle = Object.assign(/* @__PURE__ */ Object.create(null), members);
  for (const member of Object.values(handle)) {
    if (typeof member === "function") {
      Object.setPrototypeOf(member, null);
      Object.freeze(member);
    }
  }
  return Object.freeze(handle);
}
function cloneJson(value) {
  return structuredClone(value);
}
function collectAllIds(value, ids = []) {
  return collectNodeIds(value, ids);
}
function setNested(root, path, value) {
  let current = root;
  for (const segment of path.slice(0, -1)) {
    if (!isObject(current[segment])) current[segment] = {};
    current = current[segment];
  }
  current[path[path.length - 1]] = cloneJson(value);
  return root;
}
function readNested(root, path) {
  let current = root;
  for (const segment of path) {
    if (!isObject(current)) return void 0;
    current = current[segment];
  }
  return current;
}
function assertMetadataTextLimits(metadata, baseline) {
  const next = isObject(metadata) ? metadata : {};
  const previous = isObject(baseline) ? baseline : {};
  for (const path of [["title"], ["preheader", "text"]]) {
    const text = readNested(next, path);
    if (typeof text === "string" && text !== readNested(previous, path) && text.length > 500) {
      throw new EmailSdkError(`metadata.${path.join(".")} cannot exceed 500 UTF-16 code units when changed.`);
    }
  }
}

export {
  EmailSdkError,
  isObject,
  objectValue,
  deepFreeze,
  stableJson,
  describeNodeKind,
  collectNodeIds,
  resolveJsonPointer,
  sealHandle,
  cloneJson,
  collectAllIds,
  setNested,
  readNested,
  assertMetadataTextLimits
};

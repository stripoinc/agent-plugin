import {
  ROOT_PATH,
  requireValid,
  validateChange,
  validateEmailDocument
} from "./contract-c566956db999.js";

// convo-email-agent/src/sdk/model.ts
var STRUCTURAL_KEYS = /* @__PURE__ */ new Set(["stripes", "structures", "columns", "containers", "blocks"]);
function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function deepClone(value) {
  return structuredClone(value);
}
function randomUUID() {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.randomUUID !== void 0) return cryptoApi.randomUUID();
  throw new EditorJsonMutationError("globalThis.crypto.randomUUID is not available; pass idFactory to createEmailMutationSdk.");
}
function regenerateNestedIds(value, nestedIds, usedNestedIds, generateId) {
  const stack = [value];
  while (stack.length > 0) {
    const current = stack.pop();
    if (isObject(current)) {
      if (typeof current.id === "string") {
        const requestedId = nestedIds.get(current.id);
        if (requestedId) {
          usedNestedIds.add(current.id);
        }
        current.id = requestedId ?? generateId();
      }
      for (const [key, child] of Object.entries(current)) {
        if (!STRUCTURAL_KEYS.has(key)) continue;
        if (isObject(child) || Array.isArray(child)) stack.push(child);
      }
      continue;
    }
    if (Array.isArray(current)) {
      for (let index = current.length - 1; index >= 0; index -= 1) {
        const child = current[index];
        if (isObject(child) || Array.isArray(child)) stack.push(child);
      }
    }
  }
}
function assertUniqueNewIds(draft, newIds) {
  const uniqueIds = /* @__PURE__ */ new Set();
  for (const newId of newIds) {
    if (uniqueIds.has(newId)) {
      throw new EditorJsonMutationError(`Generated clone id "${newId}" is duplicated.`);
    }
    if (findElementById(draft, newId)) {
      throw new EditorJsonMutationError(`Element with id "${newId}" already exists.`);
    }
    uniqueIds.add(newId);
  }
}
function formatError(error) {
  return `${error.path || ROOT_PATH}: ${error.message}`;
}
function formatErrors(errors) {
  if (!errors?.length) return "unknown schema validation error";
  const summary = errors.slice(0, 8).map(formatError).join("; ");
  return summary + (errors.length > 8 ? `; ${errors.length - 8} more error(s) in diagnostics.error.errors` : "");
}
function formatSchemaErrorPrefix(context, details) {
  if (details?.operation === "insert") {
    const direction = details.direction ?? "after";
    const anchor = details.anchorLabel ?? "unknown anchor";
    const file = details.componentFile ?? "unknown component";
    const rollback = details.rolledBack ? " Draft was rolled back." : "";
    const kindDetails = details.componentKind === void 0 && details.anchorKind === void 0 ? "" : ` Component kind: ${details.componentKind ?? "unknown"}; anchor kind: ${details.anchorKind ?? "unknown"}.`;
    return `Insert "${file}" ${direction} ${anchor} produced invalid Stripo editor JSON.${rollback}${kindDetails}`;
  }
  return `${context} does not match the Stripo editor schema.`;
}
function setEmailSchema(schema) {
  if (!isObject(schema) || Object.keys(schema).length === 0) {
    throw new Error("The email schema must be a nonempty JSON object.");
  }
}
function assertValidTemplate(value, context, details, options = {}) {
  const errors = validateEmailDocument(value, { current: options.current });
  if (errors.length > 0) throw new EmailSdkSchemaError(context, errors, details);
}
function assertValidEmailModel(value, options = {}) {
  assertValidTemplate(value, "Initial JSON", void 0, options);
}
function findElementById(value, id, reference) {
  const stack = [
    { value }
  ];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    if (isObject(current.value)) {
      if (reference ? current.value === reference : current.value.id === id) {
        return {
          element: current.value,
          parentArray: current.parentArray,
          index: current.index,
          parentKey: current.parentKey
        };
      }
      for (const [key, child] of Object.entries(current.value)) {
        if (!STRUCTURAL_KEYS.has(key)) continue;
        if (isObject(child) || Array.isArray(child)) {
          stack.push({ value: child, parentKey: key });
        }
      }
      continue;
    }
    if (Array.isArray(current.value)) {
      for (let index = current.value.length - 1; index >= 0; index -= 1) {
        const child = current.value[index];
        if (isObject(child) || Array.isArray(child)) {
          stack.push({ value: child, parentArray: current.value, index, parentKey: current.parentKey });
        }
      }
    }
  }
  return void 0;
}
function hasJsonProperty(object, property) {
  return Object.hasOwn(object, property);
}
function setFirstNestedProperty(value, property, nextValue) {
  const stack = [value];
  while (stack.length > 0) {
    const current = stack.pop();
    if (isObject(current)) {
      if (hasJsonProperty(current, property)) {
        current[property] = nextValue;
        return true;
      }
      for (const child of Object.values(current)) {
        if (isObject(child) || Array.isArray(child)) stack.push(child);
      }
      continue;
    }
    if (Array.isArray(current)) {
      for (let index = current.length - 1; index >= 0; index -= 1) {
        const child = current[index];
        if (isObject(child) || Array.isArray(child)) stack.push(child);
      }
    }
  }
  return false;
}
function deepMerge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (isObject(target[key]) && isObject(value)) {
      deepMerge(target[key], value);
    } else {
      target[key] = deepClone(value);
    }
  }
}
function setKnownContentProperty(element, property, value) {
  if (property === "text" && element.type === "text" && hasJsonProperty(element, "content")) {
    element.content = value;
    return true;
  }
  if (property === "alt") {
    if (isObject(element.settings) && isObject(element.settings.altText)) {
      element.settings.altText.text = value;
      return true;
    }
  }
  if (property === "href") {
    if (isObject(element.settings) && isObject(element.settings.link)) {
      if (hasJsonProperty(element.settings.link, "href")) {
        element.settings.link.href = value;
        return true;
      }
      if (hasJsonProperty(element.settings.link, "value")) {
        element.settings.link.value = value;
        return true;
      }
    }
  }
  if (hasJsonProperty(element, property)) {
    element[property] = value;
    return true;
  }
  if (isObject(element.settings) && hasJsonProperty(element.settings, property)) {
    element.settings[property] = value;
    return true;
  }
  return setFirstNestedProperty(element, property, value);
}
var EmailSdkSchemaError = class extends Error {
  code = "INVALID_DOCUMENT";
  stage = "schema";
  errors;
  context;
  details;
  constructor(context, errors, details) {
    const stableErrors = errors?.map((error) => ({ ...error }));
    super(`${formatSchemaErrorPrefix(context, details)} Errors: ${formatErrors(stableErrors)}`);
    this.name = "EmailSdkSchemaError";
    this.context = context;
    this.errors = stableErrors;
    this.details = details;
  }
};
var EditorJsonMutationError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "EditorJsonMutationError";
  }
};
var WRAPPER_KIND_BY_PARENT_KEY = {
  stripes: "stripe",
  structures: "structure",
  columns: "column",
  containers: "container",
  blocks: "block"
};
var EditorJsonMutationCore = class {
  draft;
  references = /* @__PURE__ */ new Map();
  referenceOrdinal = 0;
  find(id) {
    if (id.startsWith("\0sdk:")) {
      const reference = this.references.get(id);
      return reference ? findElementById(this.draft, "", reference) : void 0;
    }
    return findElementById(this.draft, id);
  }
  reference(path) {
    let value = this.draft;
    for (const key of path) value = value[key];
    if (!isObject(value) || typeof value.id !== "string") throw new EditorJsonMutationError("Invalid structural reference.");
    for (const [token2, item] of this.references) if (item === value) return token2;
    const token = `\0sdk:${this.referenceOrdinal++}`;
    this.references.set(token, value);
    return token;
  }
  referencePath(token) {
    const target = this.references.get(token);
    if (!target) return void 0;
    const visit = (value, path) => {
      if (value === target) return path;
      if (Array.isArray(value)) {
        for (const [index, child] of value.entries()) {
          const found = visit(child, [...path, index]);
          if (found) return found;
        }
      } else if (isObject(value)) for (const key of STRUCTURAL_KEYS) {
        if (Array.isArray(value[key])) {
          const found = visit(value[key], [...path, key]);
          if (found) return found;
        }
      }
      return void 0;
    };
    return visit(this.draft, []);
  }
  // The document state a write of this draft would replace. Rules that depend on it (duplicate
  // IDs, unchanged long metadata, the alignment lock of full-width media) compare against it.
  current;
  idFactory;
  // Most recent clone produced from each source id during this session. cloneElement
  // uses it to keep a run of clones from the same source in command order (see the
  // long comment in cloneElement for the bug this prevents).
  lastCloneBySource = /* @__PURE__ */ new Map();
  // Same idea for insertNode: most recent node inserted at each anchor id, so a run
  // of inserts at one anchor keeps command order instead of reversing.
  lastInsertByAnchor = /* @__PURE__ */ new Map();
  // The draft is always validated with the editor rules bundled in the SDK.
  // `idFactory` supplies ids for cloned descendants that were not remapped via
  // nestedIds (the Email SDK injects a deterministic factory; the default keeps
  // the historical random behaviour). `options.current` is the acquired document
  // an edit replaces; a new document validates against an empty current state.
  constructor(templateJson, idFactory = randomUUID, options = {}) {
    this.current = isObject(options.current) ? deepClone(options.current) : void 0;
    assertValidTemplate(templateJson, "Initial JSON", void 0, { current: this.current });
    this.draft = deepClone(templateJson);
    this.idFactory = idFactory;
  }
  beginTransaction() {
    return {
      draft: deepClone(this.draft),
      lastCloneBySource: new Map(this.lastCloneBySource),
      lastInsertByAnchor: new Map(this.lastInsertByAnchor),
      references: new Map([...this.references.keys()].flatMap((token) => {
        const path = this.referencePath(token);
        return path ? [[token, path]] : [];
      }))
    };
  }
  rollback(transaction) {
    for (const key of Object.keys(this.draft)) {
      delete this.draft[key];
    }
    Object.assign(this.draft, deepClone(transaction.draft));
    this.references.clear();
    for (const [token, path] of transaction.references) {
      let value = this.draft;
      for (const key of path) value = value[key];
      if (isObject(value)) this.references.set(token, value);
    }
    this.lastCloneBySource.clear();
    for (const [key, value] of transaction.lastCloneBySource) this.lastCloneBySource.set(key, value);
    this.lastInsertByAnchor.clear();
    for (const [key, value] of transaction.lastInsertByAnchor) this.lastInsertByAnchor.set(key, value);
    return this;
  }
  validateDraft(context, details) {
    assertValidTemplate(this.draft, context, details, { current: this.current });
    return this;
  }
  // Read-only companion to setContent: the element's `content` when it is a
  // string (the only case the format transplant in the Email SDK needs).
  getContent(id) {
    const location = this.find(id);
    const content = location?.element.content;
    return typeof content === "string" ? content : void 0;
  }
  setContent(id, property, value) {
    const location = this.find(id);
    if (!location) throw new EditorJsonMutationError(`Element with id "${id}" was not found.`);
    if (!setKnownContentProperty(location.element, property, value)) {
      throw new EditorJsonMutationError(`Property "${property}" was not found on element "${id}".`);
    }
    return this;
  }
  setElementProperty(id, property, value) {
    const location = this.find(id);
    if (!location) throw new EditorJsonMutationError(`Element with id "${id}" was not found.`);
    location.element[property] = deepClone(value);
    return this;
  }
  deleteElementProperty(id, path) {
    const element = this.find(id)?.element;
    if (!element) throw new EditorJsonMutationError(`Element "${id}" was not found.`);
    let parent = element;
    for (const key of path.slice(0, -1)) {
      if (!isObject(parent) || !isObject(parent[key])) return this;
      parent = parent[key];
    }
    if (isObject(parent)) delete parent[path[path.length - 1]];
    return this;
  }
  deleteDocumentPath(path) {
    let parent = this.draft;
    for (const key of path.slice(0, -1)) {
      if (!isObject(parent) || !isObject(parent[key])) return this;
      parent = parent[key];
    }
    if (isObject(parent)) delete parent[path[path.length - 1]];
    return this;
  }
  moveElement(id, anchorId, before = false) {
    const source = this.find(id);
    const anchor = this.find(anchorId);
    if (!source?.parentArray || source.index === void 0 || !anchor?.parentArray || anchor.index === void 0) {
      throw new EditorJsonMutationError("Moving requires a source and anchor in structural arrays.");
    }
    if (source.element === anchor.element) return this;
    if (source.parentKey !== anchor.parentKey) throw new EditorJsonMutationError("Move requires the same structural node kind.");
    if (source.parentArray === anchor.parentArray && source.index === anchor.index + (before ? -1 : 1)) return this;
    if (this.collectSubtreeIds(id).includes(anchorId)) throw new EditorJsonMutationError("Cannot move a node into its own subtree.");
    source.parentArray.splice(source.index, 1);
    const refreshed = this.find(anchorId);
    refreshed.parentArray.splice(refreshed.index + (before ? 0 : 1), 0, source.element);
    for (const anchors of [this.lastCloneBySource, this.lastInsertByAnchor]) {
      for (const [originId, previousId] of anchors) {
        if (this.find(originId)?.element === source.element || this.find(previousId)?.element === source.element) anchors.delete(originId);
      }
    }
    return this;
  }
  appendNode(node, parentId) {
    const parent = parentId === void 0 ? this.draft : this.find(parentId)?.element;
    if (!parent) throw new EditorJsonMutationError("Append parent was not found.");
    const childKey = parentId === void 0 ? "stripes" : {
      stripe: "structures",
      structure: "columns",
      column: "containers",
      container: "blocks",
      block: ""
    }[this.describeElement(parentId).kind];
    const nodeKey = typeof node.type === "string" ? "blocks" : [...STRUCTURAL_KEYS].find((key) => Array.isArray(node[key]));
    const expected = nodeKey === "blocks" && typeof node.type !== "string" ? "containers" : nodeKey === "containers" ? "columns" : nodeKey === "columns" ? "structures" : nodeKey === "structures" ? "stripes" : nodeKey;
    if (!childKey || childKey !== expected) throw new EditorJsonMutationError("Append requires the native child kind of its parent.");
    const children = parent[childKey] ?? [];
    if (!Array.isArray(children)) throw new EditorJsonMutationError("Append parent has invalid children.");
    parent[childKey] = children;
    children.push(deepClone(node));
    return this;
  }
  setDocumentPath(path, value, merge = true) {
    if (path.length === 0) {
      throw new EditorJsonMutationError("Document path must not be empty.");
    }
    let current = this.draft;
    for (const segment of path.slice(0, -1)) {
      if (!isObject(current)) {
        throw new EditorJsonMutationError(`Document path "${path.join(".")}" traverses a non-object.`);
      }
      const next = current[segment];
      if (!isObject(next)) {
        current[segment] = {};
      }
      current = current[segment];
    }
    if (!isObject(current)) {
      throw new EditorJsonMutationError(`Document path "${path.join(".")}" traverses a non-object.`);
    }
    const leaf = path[path.length - 1];
    if (merge && isObject(current[leaf]) && isObject(value)) {
      deepMerge(current[leaf], value);
    } else {
      current[leaf] = deepClone(value);
    }
    return this;
  }
  cloneElement(id, newId, isBefore = false, nestedIds = {}) {
    const location = this.find(id);
    if (!location) throw new EditorJsonMutationError(`Element with id "${id}" was not found.`);
    if (!location.parentArray || location.index === void 0) {
      throw new EditorJsonMutationError(`Element "${id}" cannot be cloned because it is not inside an array.`);
    }
    assertUniqueNewIds(this.draft, [newId, ...Object.values(nestedIds)]);
    const clone = deepClone(location.element);
    const nestedIdsMap = new Map(Object.entries(nestedIds));
    const usedNestedIds = /* @__PURE__ */ new Set();
    for (const child of Object.values(clone)) {
      if (isObject(child) || Array.isArray(child)) {
        regenerateNestedIds(child, nestedIdsMap, usedNestedIds, this.idFactory);
      }
    }
    const unusedNestedIds = Object.keys(nestedIds).filter((nestedId) => !usedNestedIds.has(nestedId));
    if (unusedNestedIds.length > 0) {
      throw new EditorJsonMutationError(`Nested element with id "${unusedNestedIds[0]}" was not found inside "${id}".`);
    }
    clone.id = newId;
    const previousCloneId = isBefore ? void 0 : this.lastCloneBySource.get(id);
    const anchor = previousCloneId === void 0 ? void 0 : this.find(previousCloneId);
    if (anchor?.parentArray === location.parentArray && anchor.index !== void 0) {
      anchor.parentArray.splice(anchor.index + 1, 0, clone);
    } else {
      location.parentArray.splice(location.index + (isBefore ? 0 : 1), 0, clone);
    }
    if (!isBefore) this.lastCloneBySource.set(id, newId);
    return this;
  }
  // Inserts an EXTERNAL subtree (e.g. a brand-library component) next to an existing
  // element. The node is deep-cloned and EVERY id inside the clone — the root's
  // included (regenerateNestedIds starts at the clone itself) — is remapped via
  // nestedIds or the id factory, so a component extracted from this very email
  // inserts without id collisions.
  insertNode(node, anchorId, isBefore = false, nestedIds = {}) {
    if (!isObject(node)) {
      throw new EditorJsonMutationError("Inserted node must be a JSON object.");
    }
    const location = this.find(anchorId);
    if (!location) throw new EditorJsonMutationError(`Element with id "${anchorId}" was not found.`);
    if (!location.parentArray || location.index === void 0) {
      throw new EditorJsonMutationError(
        `Element "${anchorId}" cannot anchor an insert because it is not inside an array.`
      );
    }
    assertUniqueNewIds(this.draft, Object.values(nestedIds));
    const clone = deepClone(node);
    const nestedIdsMap = new Map(Object.entries(nestedIds));
    const usedNestedIds = /* @__PURE__ */ new Set();
    regenerateNestedIds(clone, nestedIdsMap, usedNestedIds, this.idFactory);
    const unusedNestedIds = Object.keys(nestedIds).filter((nestedId) => !usedNestedIds.has(nestedId));
    if (unusedNestedIds.length > 0) {
      throw new EditorJsonMutationError(
        `Nested element with id "${unusedNestedIds[0]}" was not found inside the inserted node.`
      );
    }
    const previousInsertId = isBefore ? void 0 : this.lastInsertByAnchor.get(anchorId);
    const previousAnchor = previousInsertId === void 0 ? void 0 : this.find(previousInsertId);
    if (previousAnchor?.parentArray === location.parentArray && previousAnchor.index !== void 0) {
      previousAnchor.parentArray.splice(previousAnchor.index + 1, 0, clone);
    } else {
      location.parentArray.splice(location.index + (isBefore ? 0 : 1), 0, clone);
    }
    if (!isBefore && typeof clone.id === "string") this.lastInsertByAnchor.set(anchorId, clone.id);
    return this;
  }
  deleteElement(id) {
    const location = this.find(id);
    if (!location) throw new EditorJsonMutationError(`Element with id "${id}" was not found.`);
    if (!location.parentArray || location.index === void 0) {
      throw new EditorJsonMutationError(`Element "${id}" cannot be deleted because it is not inside an array.`);
    }
    location.parentArray.splice(location.index, 1);
    return this;
  }
  // Like deleteElement but tolerant: no-ops when the id is absent or not inside an
  // array. Used to prune collapsed repeated-section siblings that may already be gone.
  deleteElementIfPresent(id) {
    const location = this.find(id);
    if (location?.parentArray && location.index !== void 0) {
      location.parentArray.splice(location.index, 1);
    }
    return this;
  }
  hasElement(id) {
    return this.find(id) !== void 0;
  }
  // Ids of the element and all its descendants, in document order. Recursive walk
  // (unlike the stack-based findElementById) because callers rely on the order.
  collectSubtreeIds(id) {
    const location = this.find(id);
    if (!location) throw new EditorJsonMutationError(`Element with id "${id}" was not found.`);
    const ids = [];
    const visit = (value) => {
      if (Array.isArray(value)) {
        for (const item of value) visit(item);
        return;
      }
      if (!isObject(value)) return;
      if (typeof value.id === "string") ids.push(value.id);
      for (const [key, child] of Object.entries(value)) {
        if (!STRUCTURAL_KEYS.has(key)) continue;
        if (isObject(child) || Array.isArray(child)) visit(child);
      }
    };
    visit(location.element);
    return ids;
  }
  describeElement(id) {
    const location = this.find(id);
    if (!location) return void 0;
    const element = location.element;
    if (Array.isArray(element.structures)) return { kind: "stripe" };
    if (Array.isArray(element.columns)) return { kind: "structure" };
    if (Array.isArray(element.containers)) return { kind: "column" };
    if (Array.isArray(element.blocks)) return { kind: "container" };
    if (typeof element.type === "string") return { kind: "block", type: element.type };
    const wrapperKind = location.parentKey === void 0 ? void 0 : WRAPPER_KIND_BY_PARENT_KEY[location.parentKey];
    if (wrapperKind !== void 0) return { kind: wrapperKind };
    return { kind: "block" };
  }
  apply(intent) {
    return deepClone(requireValid(validateChange({ current: this.current, target: this.draft, intent })));
  }
  snapshot() {
    return deepClone(this.draft);
  }
};

export {
  setEmailSchema,
  assertValidEmailModel,
  EmailSdkSchemaError,
  EditorJsonMutationError,
  EditorJsonMutationCore
};

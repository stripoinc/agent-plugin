import {
  DocumentStateError,
  collectNodeIndex,
  isLegacyStructureLayout,
  jsonIssues,
  requireValid,
  validateSnapshot,
  visitDocumentFields
} from "./content-mutations-8d3806a195bd.js";
import {
  isThemeBackground,
  splitLayers
} from "./colors-c40f90dc9241.js";
import {
  cloneJson,
  deepFreeze,
  isObject,
  stableJson
} from "./errors-3ee69a7e1eb0.js";

// convo-email-agent/src/sdk/forward-compatibility.ts
function at(value, path) {
  for (const part of path) {
    if (value === null || typeof value !== "object" || !Object.hasOwn(value, part)) return void 0;
    value = value[part];
  }
  return value;
}
function compatibilityIssue(path, message) {
  return { code: "PRESERVED_FIELD_CONFLICT", stage: "preservation", input: "target", path: path.join(".") || "<root>", message };
}
function project(original, serverSchema) {
  const working = cloneJson(original);
  const fields = [];
  visitDocumentFields(working, (parent, path, known) => {
    const key = String(path.at(-1));
    if (!known) {
      if (isLegacyStructureLayout(path) || path.length === 1 && ["html", "css"].includes(key)) return;
      const owner = path.indexOf("blocks");
      const type = owner === -1 ? void 0 : at(working, [...path.slice(0, owner + 2), "type"]);
      if (serverSchema && !serverSchema.acceptsAcquiredField(path, typeof type === "string" ? type : void 0)) {
        throw new DocumentStateError([{
          code: "SERVER_FIELD_UNAVAILABLE",
          stage: "schema",
          input: "current",
          path: path.join("."),
          message: "The target server schema does not contain this acquired field."
        }]);
      }
      fields.push({ path, kind: "unknown" });
      delete parent[key];
    } else if (key === "backgroundColor" && path.at(-2) === "settings" && path.at(-4) === "blocks") {
      const type = at(working, [...path.slice(0, -2), "type"]);
      const value = parent[key];
      if (type !== "social" && type !== "spacer" || typeof value !== "string") return;
      const layers = splitLayers(value);
      if (layers.length !== 2 || !isThemeBackground(value)) return;
      if (serverSchema) return;
      fields.push({ path, kind: "gradient" });
      parent[key] = layers[1];
    }
  }, serverSchema);
  return { working, fields };
}
function projectAcquiredDocument(input, serverSchema) {
  const issues = jsonIssues(input, "current");
  if (issues.length) throw new DocumentStateError(issues);
  const original = cloneJson(input);
  return { original, ...project(original, serverSchema) };
}
var pathKey = (path) => JSON.stringify(path);
var identity = (node) => JSON.stringify([node.kind, node.blockType, node.id]);
var within = (path, owner) => owner.every((part, index) => part === path[index]);
var equal = (left, right) => left === right || stableJson(left) === stableJson(right);
function trackAcquiredFields(projection, references, serverSchema) {
  const { original, working, fields } = projection;
  const normalized = requireValid(validateSnapshot(working, serverSchema));
  const sourceNodes = collectNodeIndex(working);
  const nodesByPath = new Map(sourceNodes.map((node) => [pathKey(node.path), node]));
  const groups = /* @__PURE__ */ new Map();
  for (const node of sourceNodes) {
    const key = identity(node);
    const group = groups.get(key);
    if (group) group.push(node);
    else groups.set(key, [node]);
  }
  const sharedReferences = Array.from(groups.values()).filter((nodes) => nodes.length > 1).flatMap((nodes) => nodes.map((node) => ({ node, token: references.reference(node.path) })));
  const ownedFields = fields.map((field) => {
    let owner;
    for (let length = field.path.length - 1; length > 0 && !owner; length--) {
      owner = nodesByPath.get(pathKey(field.path.slice(0, length)));
    }
    return { field, owner, relative: field.path.slice(owner?.path.length ?? 0) };
  });
  const summary = deepFreeze({
    preservedCount: fields.length,
    preservedPaths: fields.slice(0, 20).map((field) => field.path.join("."))
  });
  function locate(target) {
    const targetNodes = collectNodeIndex(target);
    const shared = /* @__PURE__ */ new Map();
    for (const { node, token } of sharedReferences) {
      const path = references.referencePath(token);
      if (path) shared.set(pathKey(path), node);
    }
    const sourceToTarget = /* @__PURE__ */ new Map();
    const targetToSource = /* @__PURE__ */ new Map();
    for (const targetNode of targetNodes) {
      const key = pathKey(targetNode.path);
      const group = groups.get(identity(targetNode));
      const source = group?.length === 1 ? group[0] : shared.get(key);
      if (source && identity(source) === identity(targetNode)) {
        sourceToTarget.set(source, targetNode);
        targetToSource.set(key, source);
      }
    }
    const structuralArrays = new Set(targetNodes.map((node) => pathKey(node.path.slice(0, -1))));
    return { sourceToTarget, targetToSource, structuralArrays };
  }
  function check(target, locations = locate(target)) {
    const issues = [];
    for (const { field, owner, relative } of ownedFields) {
      const destination = owner && locations.sourceToTarget.get(owner);
      if (owner && !destination) {
        issues.push(compatibilityIssue(field.path, "This operation removes an acquired field whose owner must be preserved."));
        continue;
      }
      const peers = owner && groups.get(identity(owner));
      if (owner && destination && peers && peers.length > 1) {
        const sourceParent = pathKey(owner.path.slice(0, -2));
        const targetParent = pathKey(destination.path.slice(0, -2));
        const siblingPositions = peers.filter((peer) => pathKey(peer.path.slice(0, -2)) === sourceParent).flatMap((peer) => {
          const moved = locations.sourceToTarget.get(peer);
          return moved && pathKey(moved.path.slice(0, -2)) === targetParent ? [Number(moved.path.at(-1))] : [];
        });
        if (nodesByPath.get(sourceParent) !== locations.targetToSource.get(targetParent) || siblingPositions.some((position, index) => index > 0 && position <= siblingPositions[index - 1])) {
          issues.push(compatibilityIssue(field.path, "This operation changes the placement of a repeated node with acquired fields."));
          continue;
        }
      }
      const parent = destination?.path ?? [];
      const path = [...parent, ...relative];
      const before = owner?.element ?? working;
      const after = at(target, parent);
      if (owner?.blockType === "menu" && relative[0] === "settings" && relative[1] === "items" && !equal(at(before, ["settings", "colors", "mode"]), at(after, ["settings", "colors", "mode"]))) {
        issues.push(compatibilityIssue(path, "Changing the menu color mode would affect an acquired item override."));
        continue;
      }
      for (let index = 0; index < relative.length; index++) {
        const previous = at(before, relative.slice(0, index));
        const next = at(after, relative.slice(0, index));
        if (Array.isArray(previous) && !equal(previous, next)) {
          issues.push(compatibilityIssue(path, "This collection contains acquired fields and must be preserved as a whole."));
          break;
        }
        if (isObject(previous) && !isObject(next)) {
          issues.push(compatibilityIssue(path, "This operation removes the object holding an acquired field."));
          break;
        }
        if (field.kind === "unknown" && isObject(previous) && isObject(next) && ["mode", "textCustomization", "type"].some((key) => at(previous, [key]) !== at(next, [key]))) {
          issues.push(compatibilityIssue(path, "Changing this variant could invalidate an acquired field."));
          break;
        }
        if (index === relative.length - 1 && !equal(at(before, relative), at(after, relative))) {
          issues.push(compatibilityIssue(path, "This field was acquired from the editor and has no compatible write operation."));
        }
      }
    }
    return issues;
  }
  function rehydrate(target, baseline, locations = locate(target)) {
    const merge = (raw, before, after, path) => {
      const source = locations.targetToSource.get(pathKey(path));
      if (source) {
        raw = at(original, source.path);
        before = at(baseline, source.path);
      }
      if (Array.isArray(after) && locations.structuralArrays.has(pathKey(path))) {
        return after.map((node, index) => merge(void 0, void 0, node, [...path, index]));
      }
      if (isObject(after) && (isObject(before) || before === void 0)) {
        const rawObject = isObject(raw) ? raw : {};
        const keys = /* @__PURE__ */ new Set([...Object.keys(rawObject), ...Object.keys(before ?? {}), ...Object.keys(after)]);
        const entries = [...keys].flatMap((key) => {
          const value = merge(at(rawObject, [key]), at(before, [key]), at(after, [key]), [...path, key]);
          return value === void 0 ? [] : [[key, value]];
        });
        return raw === void 0 && entries.length === 0 ? void 0 : Object.fromEntries(entries);
      }
      return equal(before, after) ? raw : after;
    };
    return cloneJson(merge(original, baseline, target, []));
  }
  return {
    summary,
    check,
    draft(target) {
      return rehydrate(target, working);
    },
    complete(target) {
      const locations = locate(target);
      const full = rehydrate(target, normalized, locations);
      for (const { field, owner, relative } of ownedFields) {
        const destination = owner && locations.sourceToTarget.get(owner);
        const path = [...destination?.path ?? [], ...relative];
        if (!equal(at(original, field.path), at(full, path))) {
          return { issues: [compatibilityIssue(path, "The complete result does not preserve this acquired value.")] };
        }
      }
      const roundTrip = validateSnapshot(project(full, serverSchema).working, serverSchema);
      if (!roundTrip.success || !equal(roundTrip.documentState, target)) {
        return { issues: [compatibilityIssue([], "The complete result does not reproduce the validated edit.")] };
      }
      return { documentState: deepFreeze(full) };
    },
    assertCanCopy(target, path) {
      const { sourceToTarget } = locate(target);
      const acquired = ownedFields.find(({ owner }) => {
        const current = owner && sourceToTarget.get(owner);
        return current && within(current.path, path);
      });
      if (acquired) throw new DocumentStateError([compatibilityIssue(acquired.field.path, "This subtree contains acquired fields and cannot be copied.")]);
    },
    assertCanWrite(target, path, relativePath) {
      const { sourceToTarget } = locate(target);
      const acquired = ownedFields.find(({ owner, relative }) => {
        const current = owner && sourceToTarget.get(owner);
        return current && equal(current.path, path) && within(relative, relativePath);
      });
      if (acquired) throw new DocumentStateError([compatibilityIssue([...path, ...acquired.relative], acquired.field.kind === "gradient" ? "This acquired background gradient has no compatible write operation." : "This collection contains acquired fields and must be preserved as a whole.")]);
    }
  };
}

export {
  projectAcquiredDocument,
  trackAcquiredFields
};

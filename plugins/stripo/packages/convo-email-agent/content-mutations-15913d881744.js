import {
  buildStyleValue,
  nodeStyleSpec,
  normalizeColor,
  themeStyleSpec
} from "./styles-961c8e1b984f.js";
import {
  transplantContentFormat
} from "./parse-html-13fe7bf5afc4.js";
import {
  summarizeEditorJson
} from "./inspection-70055d97b33b.js";
import {
  EditorJsonMutationCore,
  EditorJsonMutationError,
  EmailSdkSchemaError
} from "./model-2461f952bfd9.js";
import {
  DocumentStateError,
  collectNodeIndex,
  contractDefaults,
  getJsonSchema,
  hasLink,
  isSupportedThemeReset,
  jsonIssues,
  linkHostContains,
  nodeCapability,
  nodeSchema,
  requireValid,
  resolveSchema,
  schemaForValue,
  validateChange,
  validateSnapshot
} from "./contract-c566956db999.js";
import {
  SOCIAL_ALT_MAX_LENGTH,
  SOCIAL_CUSTOM_NETWORK_TYPE,
  SOCIAL_TITLE_MAX_LENGTH,
  assertSocialTextLimit,
  buildSocialNetwork,
  collectSocialSettingsIssues,
  inferSocialLinkType,
  normalizeIconSize,
  normalizeSpaceBetweenIcons
} from "./social-f4a8e0da8c68.js";
import {
  EmailSdkError,
  assertMetadataTextLimits,
  cloneJson,
  collectAllIds,
  collectNodeIds,
  deepFreeze,
  describeNodeKind,
  isObject,
  readNested,
  resolveJsonPointer,
  sealHandle,
  setNested,
  stableJson
} from "./errors-3ee69a7e1eb0.js";

// convo-email-agent/src/sdk/content-mutations.ts
var ANCHOR_PATTERN = /<a\b([^>]*)>([\s\S]*?)<\/a>/giu;
var HREF_SCHEME = /^([a-zA-Z][a-zA-Z0-9+.-]*):/u;
var ALLOWED_HREF_SCHEMES = /* @__PURE__ */ new Set(["http", "https", "mailto", "tel"]);
function normalizeText(value) {
  return value.replace(/\s+/g, " ").trim();
}
function stripTags(html) {
  return html.replace(/<[^>]*>/gu, "");
}
function assertSafeHref(href) {
  const trimmed = href.trim();
  const match = HREF_SCHEME.exec(trimmed);
  if (match !== null && !ALLOWED_HREF_SCHEMES.has(match[1].toLowerCase())) {
    throw new EmailSdkError(`Unsafe href scheme "${match[1]}". Allowed schemes: http, https, mailto, tel.`);
  }
}
function attrValue(rawAttrs, name) {
  const pattern = new RegExp(`${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`, "iu");
  const match = pattern.exec(rawAttrs);
  return match === null ? void 0 : match[1] ?? match[2] ?? match[3];
}
function setAttr(rawAttrs, name, value) {
  const escaped = value.replaceAll('"', "&quot;");
  const pattern = new RegExp(`(${name}\\s*=\\s*)(?:"[^"]*"|'[^']*'|[^\\s>]+)`, "iu");
  if (pattern.test(rawAttrs)) return rawAttrs.replace(pattern, `$1"${escaped}"`);
  return `${rawAttrs} ${name}="${escaped}"`;
}
function replaceVisibleText(content, matchText, replace, occurrence = 0) {
  if (!Number.isInteger(occurrence) || occurrence < 0) {
    throw new EmailSdkError("replaceText occurrence must be a non-negative integer.");
  }
  const runs = [];
  const tagPattern = /<[^>]*>/gu;
  let cursor = 0;
  for (const tag of content.matchAll(tagPattern)) {
    const tagStart = tag.index ?? 0;
    if (tagStart > cursor) runs.push({ start: cursor, end: tagStart, text: content.slice(cursor, tagStart) });
    cursor = tagStart + tag[0].length;
  }
  if (cursor < content.length) runs.push({ start: cursor, end: content.length, text: content.slice(cursor) });
  const matches = [];
  for (const run of runs) {
    let offset = run.text.indexOf(matchText);
    while (offset !== -1) {
      matches.push({ start: run.start + offset, end: run.start + offset + matchText.length });
      offset = run.text.indexOf(matchText, offset + Math.max(1, matchText.length));
    }
  }
  if (matches.length === 0) {
    throw new EmailSdkError(`Text "${matchText}" was not found inside one visible text run.`);
  }
  if (occurrence >= matches.length) {
    throw new EmailSdkError(`Text "${matchText}" occurrence ${occurrence} is out of range; found ${matches.length}.`);
  }
  const span = matches[occurrence];
  return `${content.slice(0, span.start)}${replace}${content.slice(span.end)}`;
}
function mutateAnchor(content, mutation) {
  const candidates = [];
  let ordinal = 0;
  for (const match of content.matchAll(ANCHOR_PATTERN)) {
    const attrs2 = match[1] ?? "";
    const inner2 = match[2] ?? "";
    const href = attrValue(attrs2, "href");
    if (mutation.match.href !== void 0 && href !== mutation.match.href) {
      ordinal += 1;
      continue;
    }
    if (mutation.match.text !== void 0 && normalizeText(stripTags(inner2)) !== normalizeText(mutation.match.text)) {
      ordinal += 1;
      continue;
    }
    const start = match.index ?? 0;
    candidates.push({ index: ordinal, full: match[0], attrs: attrs2, inner: inner2, start, end: start + match[0].length });
    ordinal += 1;
  }
  if (candidates.length === 0) throw new EmailSdkError("No text anchor matched.");
  if (candidates.length > 1) throw new EmailSdkError(`Text anchor match is ambiguous: ${candidates.length} anchors matched.`);
  const candidate = candidates[0];
  let attrs = candidate.attrs;
  if (mutation.set.href !== void 0) {
    assertSafeHref(mutation.set.href);
    attrs = setAttr(attrs, "href", mutation.set.href);
  }
  if (mutation.set.target !== void 0) {
    attrs = setAttr(attrs, "target", mutation.set.target);
  }
  const inner = mutation.set.text ?? candidate.inner;
  const next = `<a${attrs}>${inner}</a>`;
  return `${content.slice(0, candidate.start)}${next}${content.slice(candidate.end)}`;
}

// convo-email-agent/src/sdk/ids.ts
var SEED_PREFIX = "eds-clone-v1:";
function stableHex(seed) {
  let h1 = 3735928559;
  let h2 = 1103547991;
  let h3 = 2654435769;
  let h4 = 2246822507;
  for (let i = 0; i < seed.length; i += 1) {
    const c = seed.charCodeAt(i);
    h1 = Math.imul(h1 ^ c, 2654435761);
    h2 = Math.imul(h2 ^ c, 1597334677);
    h3 = Math.imul(h3 ^ c, 2246822507);
    h4 = Math.imul(h4 ^ c, 3266489909);
  }
  h1 = Math.imul(h1 ^ h1 >>> 16, 2246822507) ^ Math.imul(h2 ^ h2 >>> 13, 3266489909);
  h2 = Math.imul(h2 ^ h2 >>> 16, 2246822507) ^ Math.imul(h3 ^ h3 >>> 13, 3266489909);
  h3 = Math.imul(h3 ^ h3 >>> 16, 2246822507) ^ Math.imul(h4 ^ h4 >>> 13, 3266489909);
  h4 = Math.imul(h4 ^ h4 >>> 16, 2246822507) ^ Math.imul(h1 ^ h1 >>> 13, 3266489909);
  return [h1, h2, h3, h4].map((value) => (value >>> 0).toString(16).padStart(8, "0")).join("");
}
function uuidFromSeed(seed) {
  const hex = stableHex(SEED_PREFIX + seed);
  const variantNibble = (parseInt(hex[16], 16) & 3 | 8).toString(16);
  const h = hex.slice(0, 12) + "4" + hex.slice(13, 16) + variantNibble + hex.slice(17, 32);
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20, 32)}`;
}
function uniqueUuidFromSeed(seed, isTaken) {
  let candidate = uuidFromSeed(seed);
  for (let retry = 1; isTaken(candidate); retry += 1) {
    candidate = uuidFromSeed(`${seed}#r${retry}`);
  }
  return candidate;
}

// convo-email-agent/src/sdk/edit.ts
import { canonicalFontValue, collectUsedFontValues } from "./editor-validator/index.mjs";
var SETTER_HINTS = "Hints: text block \u2192 setContent(); button \u2192 setText()/setHref(); image \u2192 setSrc()/setHref()/setAlt().";
function assertEditorEmailJson(value) {
  if (!isObject(value)) {
    throw new EmailSdkError("Stripo editor JSON must be a top-level object with settings and stripes.");
  }
  if (typeof value.html === "string" || typeof value.css === "string") {
    throw new EmailSdkError(
      "Campaign export JSON with html/css is not supported. Pass Stripo editor JSON with top-level settings and stripes."
    );
  }
  if (!isObject(value.settings) || value.stripes !== void 0 && !Array.isArray(value.stripes)) {
    throw new EmailSdkError("Stripo editor JSON must include a top-level settings object and an optional stripes array.");
  }
}
function randomUuid(isTaken) {
  const cryptoApi = globalThis.crypto;
  if (cryptoApi?.randomUUID === void 0) {
    throw new EmailSdkError("globalThis.crypto.randomUUID is not available; pass idFactory to createEmailMutationSdk.");
  }
  let id = cryptoApi.randomUUID();
  while (isTaken(id)) id = cryptoApi.randomUUID();
  return id;
}
function normalizeComponentLibrary(library, components) {
  if (library !== void 0) return library;
  if (components === void 0) return void 0;
  const entries = components instanceof Map ? [...components.entries()] : Object.entries(components);
  const normalized = /* @__PURE__ */ new Map();
  for (const [key, component] of entries) {
    const kind = describeNodeKind(component.node);
    normalized.set(key, {
      file: component.file ?? key,
      level: component.level ?? (kind === "stripe" ? "L1" : kind === "block" ? "atoms" : "L2"),
      node: component.node,
      slots: component.slots
    });
  }
  return normalized;
}
function assertNoSchemaOption(options) {
  if (Object.hasOwn(options, "schema")) {
    throw new EmailSdkError(
      "createEmailMutationSdk/createEmailSdk no longer accept a schema option. Validation runs the editor rules bundled with the SDK; no schema setup is needed."
    );
  }
}
function createEmailSdk(options) {
  assertNoSchemaOption(options);
  assertEditorEmailJson(options.emailJson);
  const snapshotValidation = validateSnapshot(options.emailJson);
  if (!snapshotValidation.success && snapshotValidation.issues.some((issue) => issue.stage === "json")) requireValid(snapshotValidation);
  let fallbackOrdinal = 0;
  const generateUniqueId = (seed, isTaken) => options.idFactory?.(seed, isTaken) ?? uniqueUuidFromSeed(seed, isTaken);
  const sdk = new EditorJsonMutationCore(
    options.emailJson,
    () => generateUniqueId(`fallback#${fallbackOrdinal++}`, () => false),
    { current: options.current ?? options.emailJson }
  );
  const initialMetadata = sdk.snapshot().metadata;
  const tempToReal = /* @__PURE__ */ new Map();
  const realToTemp = /* @__PURE__ */ new Map();
  const explicitIdsMap = options.idsMap ?? options.idMap;
  const initialIds = collectAllIds(options.emailJson);
  const initialIdCounts = /* @__PURE__ */ new Map();
  for (const id of initialIds) initialIdCounts.set(id, (initialIdCounts.get(id) ?? 0) + 1);
  const duplicateInitialIds = new Set([...initialIdCounts].filter(([, count]) => count > 1).map(([id]) => id));
  const seedIdsMap = explicitIdsMap ?? Object.fromEntries(initialIds.map((id) => [id, id]));
  for (const [realId, compactId] of Object.entries(seedIdsMap)) {
    if (tempToReal.has(String(compactId))) continue;
    tempToReal.set(String(compactId), realId);
    realToTemp.set(realId, String(compactId));
  }
  const componentLibrary = new Map(normalizeComponentLibrary(options.library, options.components));
  const warnings = [];
  const selectorMisses = [];
  let validation = "pending";
  const repeatSiblings = options.repeatSiblings ?? {};
  const collapsedScopes = /* @__PURE__ */ new Map();
  for (const representativeId of Object.keys(repeatSiblings)) {
    if (!sdk.hasElement(representativeId)) continue;
    collapsedScopes.set(representativeId, new Set(sdk.collectSubtreeIds(representativeId)));
  }
  const repeatedRoots = /* @__PURE__ */ new Set();
  const removedIds = /* @__PURE__ */ new Set();
  const replacedByRepeat = /* @__PURE__ */ new Set();
  const handleRealIds = /* @__PURE__ */ new WeakMap();
  const insertOccurrence = /* @__PURE__ */ new Map();
  let sealed = false;
  let mutationCount = 0;
  const baseline = cloneJson(options.current ?? options.emailJson);
  const journal = [];
  let intent = cloneJson(options.intent ?? {});
  let operationDepth = 0;
  let transactionDepth = 0;
  let transactionOrdinal = 0;
  let transactionId;
  let version = 0;
  let skipped;
  let operationOrigin;
  const snapshotState = () => ({
    core: sdk.beginTransaction(),
    fallbackOrdinal,
    mutationCount,
    validation,
    version,
    transactionOrdinal,
    transactionId,
    skipped,
    intent: cloneJson(intent),
    journal: [...journal],
    maps: [tempToReal, realToTemp, insertOccurrence, collapsedScopes].map((map) => new Map(map)),
    sets: [repeatedRoots, removedIds, replacedByRepeat].map((set) => new Set(set)),
    warnings: [...warnings],
    misses: [...selectorMisses]
  });
  function restoreState(state) {
    sdk.rollback(state.core);
    fallbackOrdinal = state.fallbackOrdinal;
    mutationCount = state.mutationCount;
    validation = state.validation;
    version = state.version;
    transactionOrdinal = state.transactionOrdinal;
    cachedIndexVersion = -1;
    cachedIndex = [];
    transactionId = state.transactionId;
    skipped = state.skipped;
    intent = state.intent;
    journal.splice(0, journal.length, ...state.journal);
    [tempToReal, realToTemp, insertOccurrence, collapsedScopes].forEach((map, index) => {
      map.clear();
      for (const [key, value] of state.maps[index]) map.set(key, value);
    });
    [repeatedRoots, removedIds, replacedByRepeat].forEach((set, index) => {
      set.clear();
      for (const id of state.sets[index]) set.add(id);
    });
    warnings.splice(0, warnings.length, ...state.warnings);
    selectorMisses.splice(0, selectorMisses.length, ...state.misses);
  }
  function addIntent(next) {
    intent = {
      removeNodes: [.../* @__PURE__ */ new Set([...intent.removeNodes ?? [], ...next.removeNodes ?? []])],
      resetFields: [.../* @__PURE__ */ new Set([...intent.resetFields ?? [], ...next.resetFields ?? []])],
      replaceCollections: [.../* @__PURE__ */ new Set([...intent.replaceCollections ?? [], ...next.replaceCollections ?? []])]
    };
  }
  function prepared() {
    return validateChange({ current: baseline, target: sdk.snapshot(), intent });
  }
  function atomic(type, callback) {
    assertNotSealed();
    if (operationDepth > 0) return callback();
    const state = snapshotState();
    const before = sdk.snapshot();
    operationDepth++;
    const previousOrigin = operationOrigin;
    operationOrigin = void 0;
    try {
      const result = callback();
      if (result && typeof result.then === "function") throw new EmailSdkError("SDK transactions and operations must be synchronous.");
      const after = sdk.snapshot();
      if (mutationCount !== state.mutationCount) mutationCount = state.mutationCount + 1;
      if (stableJson(before) !== stableJson(after)) {
        const oldNodes = collectNodeIndex(before);
        const newNodes = collectNodeIndex(after);
        const remainingCounts = /* @__PURE__ */ new Map();
        for (const node of newNodes) {
          const key = `${node.kind}:${node.id}`;
          remainingCounts.set(key, (remainingCounts.get(key) ?? 0) + 1);
        }
        const deleted = oldNodes.filter((node) => {
          const key = `${node.kind}:${node.id}`;
          const count = remainingCounts.get(key) ?? 0;
          if (count === 0) return true;
          remainingCounts.set(key, count - 1);
          return false;
        });
        if (["remove", "repeat"].includes(type)) addIntent({ removeNodes: deleted.map((node) => node.id) });
        const touched = newNodes.filter((node) => stableJson(node.element) !== stableJson(oldNodes.find((item) => item.id === node.id && item.kind === node.kind)?.element));
        const leaf = touched.filter((node) => !touched.some((other) => other.parentChain.includes(node.id)));
        journal.push({
          operation: journal.length + 1,
          type,
          transaction: transactionId,
          nodeId: leaf.length === 1 ? leaf[0].id : void 0,
          nodeType: leaf.length === 1 ? leaf[0].blockType ?? leaf[0].kind : void 0,
          origin: operationOrigin ? cloneJson(operationOrigin) : void 0,
          paths: leaf.map((node) => node.id),
          insertedIds: newNodes.filter((node) => !oldNodes.some((item) => item.id === node.id)).map((node) => node.id),
          intent: cloneJson(intent)
        });
        version++;
        skipped = void 0;
      }
      if (transactionDepth === 0) requireValid(prepared());
      validation = "pending";
      return result;
    } catch (error) {
      restoreState(state);
      if (error instanceof DocumentStateError) {
        throw new DocumentStateError(error.issues.map((issue) => ({ ...issue, operation: journal.length + 1, transaction: transactionId })));
      }
      throw error;
    } finally {
      operationDepth--;
      operationOrigin = previousOrigin;
    }
  }
  const readMethods = /* @__PURE__ */ new Set(["byId", "select", "first", "one", "block", "slot", "inspect", "describe"]);
  function sessionHandle(members) {
    const wrapped = Object.fromEntries(Object.entries(members).map(([key, value]) => [
      key,
      typeof value === "function" && !readMethods.has(key) ? (...args) => atomic(key, () => Reflect.apply(value, void 0, args)) : value
    ]));
    return sealHandle(wrapped);
  }
  function compactLabel(realId) {
    const compactId = realToTemp.get(realId);
    return compactId === void 0 ? `id="${realId}"` : `id=${compactId}`;
  }
  function validIdsSummary() {
    const ids = [...tempToReal.keys()].filter((id) => !removedIds.has(tempToReal.get(id) ?? "")).sort((a, b) => Number(a) - Number(b));
    if (ids.length === 0) return "none";
    if (ids.length <= 60) return ids.join(", ");
    return `${ids[0]}\u2026${ids[ids.length - 1]} (${ids.length} ids)`;
  }
  function assertNotSealed() {
    if (sealed) {
      throw new EmailSdkError(
        "The script already finished \u2014 late or asynchronous mutations are not allowed."
      );
    }
  }
  function assertNotRemoved(realId) {
    if (replacedByRepeat.has(realId)) {
      throw new EmailSdkError(
        `Element ${compactLabel(realId)} was replaced by repeat() \u2014 address the new sections through the handles repeat() returned (e.g. rows[i].byId(...)).`
      );
    }
    if (removedIds.has(realId) || realId.startsWith("\0sdk:") && !sdk.hasElement(realId)) {
      throw new EmailSdkError(
        `Element ${compactLabel(realId)} was removed earlier in this script.`
      );
    }
  }
  function findBlockingCollapsedRoot(realId) {
    for (const [root, scope] of collapsedScopes) {
      if (repeatedRoots.has(root)) continue;
      if (scope.has(realId)) return root;
    }
    return void 0;
  }
  function collapsedGuardError(realId, root) {
    const totalCopies = (repeatSiblings[root]?.length ?? 0) + 1;
    const rootCompact = realToTemp.get(root) ?? root;
    return new EmailSdkError(
      `Element ${compactLabel(realId)} is inside collapsed repeated section ${compactLabel(root)} (repeated ${totalCopies} times). Call email.byId("${rootCompact}").repeat(<totalCount>) first, then edit each returned instance.`
    );
  }
  function assertMutable(realId, opts = {}) {
    assertNotSealed();
    assertNotRemoved(realId);
    const root = findBlockingCollapsedRoot(realId);
    if (root === void 0) return;
    if (opts.allowCollapsedRoot && root === realId) return;
    throw collapsedGuardError(realId, root);
  }
  function assertBlockDeletionSupported(realId, method, label) {
    const source = entryFor(realId);
    if (!initialIdCounts.has(source.id)) return;
    const unsupported = currentIndex().filter((node) => source.path.every((key, index) => node.path[index] === key)).find((node) => !nodeCapability(node.blockType ?? node.kind)?.actions.DELETE.runtimes.mergeService);
    if (unsupported) {
      throw new EmailSdkError(
        `${method}() cannot delete ${unsupported.blockType ?? unsupported.kind} in ${label}: merge-service does not support its deletion.`
      );
    }
  }
  function resolveCompactId(rawId) {
    const compactId = String(rawId).trim();
    const realId = tempToReal.get(compactId);
    if (realId === void 0) {
      throw new EmailSdkError(
        `No element with id "${compactId}". Valid ids: ${validIdsSummary()} (see brief_input).`
      );
    }
    return { compactId, realId };
  }
  let cachedIndexVersion = -1;
  let cachedIndex = [];
  function currentIndex() {
    if (operationDepth > 0) return collectNodeIndex(sdk.snapshot());
    if (cachedIndexVersion !== version) {
      cachedIndex = collectNodeIndex(sdk.snapshot());
      cachedIndexVersion = version;
    }
    return cachedIndex;
  }
  function disambiguateEntries(entries, rawId, disambiguateBy) {
    if (entries.length === 0) {
      throw new EmailSdkError(`No element with id "${rawId}". Valid ids: ${validIdsSummary()}.`);
    }
    if (entries.length === 1 && disambiguateBy === void 0) return entries[0];
    if (disambiguateBy === void 0) {
      throw new EmailSdkError(
        `id "${rawId}" resolves to ${entries.length} nodes; pass disambiguateBy.occurrence, parentContainerId, or parentStripeId.`
      );
    }
    const parentContainerId = disambiguateBy.parentContainerId ?? disambiguateBy.parent_container_id;
    const parentStripeId = disambiguateBy.parentStripeId ?? disambiguateBy.parent_stripe_id;
    let filtered = entries;
    if (disambiguateBy.nodeKind !== void 0) filtered = filtered.filter((entry) => entry.kind === disambiguateBy.nodeKind);
    if (parentContainerId !== void 0) {
      filtered = filtered.filter((entry) => entry.parentChain.at(-1) === parentContainerId);
    }
    if (parentStripeId !== void 0) {
      filtered = filtered.filter((entry) => entry.parentChain[0] === parentStripeId);
    }
    const occurrence = disambiguateBy.occurrence;
    if (occurrence !== void 0) {
      if (!Number.isInteger(occurrence) || occurrence < 0) {
        throw new EmailSdkError("disambiguateBy.occurrence must be a non-negative integer.");
      }
      const entry = filtered[occurrence];
      if (entry === void 0) {
        throw new EmailSdkError(`id "${rawId}" occurrence ${occurrence} is out of range after disambiguation.`);
      }
      return entry;
    }
    if (filtered.length === 1) return filtered[0];
    throw new EmailSdkError(`id "${rawId}" still resolves to ${filtered.length} nodes after disambiguation.`);
  }
  function resolveLookup(rawId, disambiguateBy) {
    const lookupId = String(rawId).trim();
    if (explicitIdsMap !== void 0 || !duplicateInitialIds.has(lookupId)) {
      const realId = tempToReal.get(lookupId);
      if (realId !== void 0 && !duplicateInitialIds.has(realId) && disambiguateBy === void 0) {
        return { compactId: lookupId, realId };
      }
    }
    const matches = currentIndex().filter((entry2) => entry2.id === (tempToReal.get(lookupId) ?? lookupId)).filter((entry2) => !removedIds.has(entry2.id));
    const entry = disambiguateEntries(matches, lookupId, disambiguateBy);
    return { compactId: realToTemp.get(entry.id) ?? entry.id, realId: referenceFor(entry) };
  }
  function referenceFor(entry) {
    return currentIndex().filter((node) => node.id === entry.id).length > 1 ? sdk.reference(entry.path) : entry.id;
  }
  function selectEntries(selector) {
    let entries = currentIndex().filter((entry) => !removedIds.has(entry.id));
    if (selector.within !== void 0) {
      const scope = entryFor(resolveInsertAnchor(selector.within).realId).path;
      entries = entries.filter((entry) => entry.path.length > scope.length && scope.every((part, index) => entry.path[index] === part));
    }
    if (selector.nodeKind !== void 0) entries = entries.filter((entry) => entry.kind === selector.nodeKind);
    if (selector.type !== void 0) entries = entries.filter((entry) => entry.kind === "block" && entry.blockType === selector.type);
    if (selector.inMessageArea !== void 0) entries = entries.filter((entry) => entry.messageArea === selector.inMessageArea);
    if (selector.effectiveVisibility !== void 0) {
      entries = entries.filter((entry) => entry.effectiveVisibility === selector.effectiveVisibility);
    }
    if (selector.moduleId !== void 0) {
      entries = entries.filter((entry) => {
        if (selector.moduleId === "present") return entry.moduleId !== void 0;
        if (selector.moduleId === "absent") return entry.moduleId === void 0;
        return entry.moduleId === selector.moduleId;
      });
    }
    if (selector.hasLink !== void 0) {
      entries = entries.filter((entry) => hasLink(entry.element, entry.blockType) === selector.hasLink);
    }
    if (selector.linkHostContains !== void 0) {
      entries = entries.filter((entry) => linkHostContains(entry.element, entry.blockType, selector.linkHostContains ?? ""));
    }
    if (selector.textContains !== void 0) {
      entries = entries.filter((entry) => {
        if (entry.blockType !== "text" || typeof entry.element.content !== "string") return false;
        return stripTags(entry.element.content).includes(selector.textContains ?? "");
      });
    }
    if (selector.limit !== void 0) {
      if (!Number.isInteger(selector.limit) || selector.limit < 0) {
        throw new EmailSdkError("selector.limit must be a non-negative integer.");
      }
      entries = entries.slice(0, selector.limit);
    }
    return entries;
  }
  function entryFor(realId) {
    const path = sdk.referencePath(realId);
    const entry = currentIndex().find((candidate) => path ? stableJson(candidate.path) === stableJson(path) : candidate.id === realId);
    if (entry === void 0) throw new EmailSdkError(`Element ${compactLabel(realId)} was not found.`);
    return entry;
  }
  function writeSettings(realId, update) {
    assertMutable(realId);
    const entry = entryFor(realId);
    const settings = isObject(entry.element.settings) ? cloneJson(entry.element.settings) : {};
    update(settings, entry);
    for (const key of ["networks", "items"]) {
      if (stableJson(settings[key]) !== stableJson(entry.element.settings?.[key])) {
        addIntent({ replaceCollections: [`/${entry.id}/settings/${key}`] });
      }
    }
    for (const key of ["link", "colors"]) {
      const previous = entry.element.settings?.[key];
      const next = settings[key];
      if (isObject(previous) && (!isObject(next) || previous.type !== next.type || previous.mode !== next.mode)) {
        addIntent({ replaceCollections: [`/${entry.id}/settings/${key}`] });
      }
    }
    sdk.setElementProperty(realId, "settings", settings);
    mutationCount += 1;
  }
  function writeStyle(realId, property, value, styleOptions = {}) {
    writeSettings(realId, (settings, entry) => {
      const spec = nodeStyleSpec(entry.kind, entry.blockType, property, styleOptions);
      const writePath = spec.shape === "textStyle" ? spec.path.slice(0, -1) : spec.path;
      const leaf = spec.shape === "textStyle" ? spec.path.at(-1) : void 0;
      const existing = readNested(settings, writePath);
      setNested(settings, writePath, buildStyleValue(spec.shape, value, styleOptions, existing, leaf));
    });
  }
  function writeMetadata(patch) {
    assertNotSealed();
    if (!isObject(patch) || Object.keys(patch).length === 0 || Object.keys(patch).some((key) => key !== "title" && key !== "preheader")) {
      throw new EmailSdkError("Metadata patch must contain title or preheader, with no other keys.");
    }
    const validateText = (value, label) => {
      if (typeof value !== "string") throw new EmailSdkError(`${label} must be a string.`);
    };
    if (Object.hasOwn(patch, "title")) validateText(patch.title, "metadata.title");
    if (Object.hasOwn(patch, "preheader")) {
      const preheader = patch.preheader;
      if (!isObject(preheader) || typeof preheader.fillSpace !== "boolean" || Object.keys(preheader).some((key) => key !== "text" && key !== "fillSpace")) {
        throw new EmailSdkError("metadata.preheader must contain text and boolean fillSpace, with no other keys.");
      }
      validateText(preheader.text, "metadata.preheader.text");
    }
    assertMetadataTextLimits(patch, initialMetadata);
    sdk.setDocumentPath(["metadata"], patch, true);
    mutationCount += 1;
  }
  function writeTheme(path, value) {
    assertNotSealed();
    const pieces = path.split(".");
    if (pieces.length === 0 || pieces.some((piece) => piece === "")) {
      throw new EmailSdkError(`Invalid theme path "${path}".`);
    }
    if (pieces[0] !== "settings") {
      throw new EmailSdkError(`Theme path must start with "settings.", got "${path}".`);
    }
    for (const piece of pieces) {
      if (/^\d+$/u.test(piece)) throw new EmailSdkError(`Theme path rejects array-index segment "${piece}".`);
    }
    const resets = [];
    const normalize = (child, keys) => {
      if (child === void 0 || child === null) {
        const pointer = "/" + keys.join("/");
        if (!isSupportedThemeReset(pointer)) {
          throw new EmailSdkError(child === null ? `Theme value may not be null at ${keys.join(".")}.` : `No canonical reset is supported for ${keys.join(".")}.`);
        }
        resets.push(pointer);
        return null;
      }
      return isObject(child) ? Object.fromEntries(Object.entries(child).map(([key, nested]) => [key, normalize(nested, [...keys, key])])) : child;
    };
    const candidate = normalize(value, pieces);
    const inputIssues = jsonIssues(candidate);
    if (inputIssues.length) throw new DocumentStateError(inputIssues);
    sdk.setDocumentPath(pieces, candidate, true);
    if (resets.length) addIntent({ resetFields: resets });
    mutationCount += 1;
  }
  function patchObject(current, patch, schema, path) {
    const issues = jsonIssues(patch);
    if (issues.length) throw new DocumentStateError(issues);
    const result = cloneJson(current);
    const description = schemaForValue(schema, { ...current, ...patch });
    for (const [key, value] of Object.entries(patch)) {
      const property = description.properties?.[key];
      if (!property) throw new EmailSdkError(`Unknown settings key: ${path}.${key}.`);
      if (resolveSchema(property).readOnly) throw new EmailSdkError(`Read-only settings key: ${path}.${key}.`);
      if (key === "networks" || key === "items") throw new EmailSdkError(`${path}.${key} must be changed with collection methods.`);
      if (Array.isArray(value)) throw new EmailSdkError(`${path}.${key} has no declared atomic patch operation.`);
      const previous = current[key];
      const switchesVariant = isObject(value) && isObject(previous) && ["type", "mode"].some((discriminator) => Object.hasOwn(value, discriminator) && previous[discriminator] !== value[discriminator]);
      result[key] = isObject(value) ? patchObject(switchesVariant || !isObject(previous) ? {} : previous, value, property, `${path}.${key}`) : cloneJson(value);
    }
    return result;
  }
  function patchNodeSettings(realId, patch) {
    writeSettings(realId, (settings, entry) => {
      const descriptor = nodeSchema(entry.blockType ?? entry.kind).properties?.settings;
      if (!descriptor) throw new EmailSdkError("This node has no editable settings.");
      const result = patchObject(settings, patch, descriptor, `${entry.blockType ?? entry.kind}.settings`);
      for (const key of Object.keys(settings)) delete settings[key];
      Object.assign(settings, result);
    });
  }
  function resetDocumentSettings(paths) {
    for (const path of paths) writeTheme(path.startsWith("settings.") ? path : `settings.${path}`, void 0);
  }
  function writeDocumentStyle(property, value, styleOptions = {}) {
    const spec = themeStyleSpec(property, styleOptions);
    const existing = readNested(sdk.snapshot(), spec.path);
    writeTheme(spec.path.join("."), buildStyleValue(spec.shape, value, styleOptions, existing));
  }
  function replaceText(realId, match, replace, replacementOptions = {}) {
    assertMutable(realId);
    const entry = entryFor(realId);
    if (entry.kind !== "block") throw new EmailSdkError("replaceText() targets a block.");
    if (entry.blockType === "button") {
      const settings = isObject(entry.element.settings) ? cloneJson(entry.element.settings) : {};
      const current = typeof settings.text === "string" ? settings.text : "";
      if (normalizeText(current) !== normalizeText(match)) {
        throw new EmailSdkError(`Button label is "${current}", not "${match}".`);
      }
      settings.text = replace;
      sdk.setElementProperty(realId, "settings", settings);
    } else if (entry.blockType === "text") {
      const content = typeof entry.element.content === "string" ? entry.element.content : "";
      sdk.setElementProperty(
        realId,
        "content",
        replaceVisibleText(content, match, replace, replacementOptions.occurrence ?? 0)
      );
    } else {
      throw new EmailSdkError(`replaceText() supports text and button blocks; got ${entry.blockType ?? entry.kind}.`);
    }
    mutationCount += 1;
  }
  function writeTextLink(realId, mutation) {
    assertMutable(realId);
    const entry = entryFor(realId);
    if (entry.blockType !== "text" || typeof entry.element.content !== "string") {
      throw new EmailSdkError("setTextLink() supports text blocks only.");
    }
    sdk.setElementProperty(realId, "content", mutateAnchor(entry.element.content, mutation));
    mutationCount += 1;
  }
  function writeLink(realId, mutation) {
    writeSettings(realId, (settings, entry) => {
      if (entry.blockType !== "social") assertSafeHref(mutation.url);
      const linkType = mutation.linkType ?? "site";
      if (entry.blockType === "button") {
        settings.link = { type: linkType, value: mutation.url };
        return;
      }
      if (entry.blockType === "image") {
        if (mutation.url === "") {
          delete settings.link;
        } else {
          settings.link = { type: linkType, href: mutation.url };
        }
        return;
      }
      if (entry.blockType === "social") {
        if (mutation.network === void 0) {
          throw new EmailSdkError("setLink() on a social block requires network.");
        }
        const networks = Array.isArray(settings.networks) ? cloneJson(settings.networks) : [];
        const index = networks.findIndex((network) => isObject(network) && network.type === mutation.network);
        if (index === -1 || !isObject(networks[index])) {
          throw new EmailSdkError(`Social network "${mutation.network}" was not found.`);
        }
        if (mutation.url === "") {
          delete networks[index].link;
        } else {
          networks[index].link = { type: mutation.linkType ?? inferSocialLinkType(mutation.url), href: mutation.url };
        }
        settings.networks = networks;
        assertNoSocialIssues(settings, "setLink");
        return;
      }
      throw new EmailSdkError(`setLink() supports button, image, and social blocks; got ${entry.blockType ?? entry.kind}.`);
    });
  }
  function writeMenuItem(realId, itemIndex, set) {
    if (!Number.isInteger(itemIndex) || itemIndex < 0) throw new EmailSdkError("Menu item index must be a non-negative integer.");
    writeSettings(realId, (settings, entry) => {
      if (entry.blockType !== "menu") throw new EmailSdkError("setMenuItem() supports menu blocks only.");
      const items = Array.isArray(settings.items) ? cloneJson(settings.items) : [];
      const item = items[itemIndex];
      if (!isObject(item)) throw new EmailSdkError(`Menu item ${itemIndex} was not found.`);
      const itemLinkColor = set.itemLinkColor ?? set.item_link_color;
      const itemBackgroundColor = set.itemBackgroundColor ?? set.item_background_color;
      const itemLinkValue = set.itemLinkValue ?? set.item_link_value;
      const itemLinkType = set.itemLinkType ?? set.item_link_type;
      const itemName = set.itemName ?? set.item_name;
      if (itemLinkColor !== void 0 || itemBackgroundColor !== void 0) {
        const colors = isObject(item.colors) ? cloneJson(item.colors) : {};
        if (itemLinkColor !== void 0) colors.link = normalizeColor(itemLinkColor, false);
        if (itemBackgroundColor !== void 0) colors.background = normalizeColor(itemBackgroundColor, true);
        if (colors.link === void 0) colors.link = "#000000";
        if (colors.background === void 0) colors.background = "transparent";
        item.colors = colors;
      }
      if (itemLinkValue !== void 0) {
        assertSafeHref(itemLinkValue);
        const link = isObject(item.link) ? cloneJson(item.link) : {};
        link.value = itemLinkValue;
        if (itemLinkType !== void 0) link.type = itemLinkType;
        item.link = link;
      }
      if (itemName !== void 0) {
        if (itemName.trim() === "") throw new EmailSdkError("Menu item name must be non-empty.");
        item.name = itemName;
      }
      items[itemIndex] = item;
      settings.items = items;
    });
  }
  function writeMenuShared(realId, set) {
    writeSettings(realId, (settings, entry) => {
      if (entry.blockType !== "menu") throw new EmailSdkError("setMenuShared() supports menu blocks only.");
      const sharedLinkColor = set.sharedLinkColor ?? set.shared_link_color;
      if (sharedLinkColor === void 0) throw new EmailSdkError("setMenuShared() requires sharedLinkColor.");
      settings.colors = { mode: "shared", link: normalizeColor(sharedLinkColor, false) };
    });
  }
  function assertSocialBlock(entry, method) {
    if (entry.blockType !== "social") {
      throw new EmailSdkError(`${method}() supports social blocks only; got ${entry.blockType ?? entry.kind}.`);
    }
  }
  function assertNoSocialIssues(settings, method) {
    const [issue] = collectSocialSettingsIssues(settings);
    if (issue !== void 0) throw new EmailSdkError(`${method}(): ${issue.message} (settings${issue.path})`);
  }
  function socialNetworksOf(settings, method) {
    if (!Array.isArray(settings.networks) || !settings.networks.every(isObject)) {
      throw new EmailSdkError(`${method}() found no networks array on this social block.`);
    }
    return cloneJson(settings.networks);
  }
  function socialNetworkSummary(networks) {
    return networks.length === 0 ? "none" : networks.map((network, index) => `${index}:${String(network.type)}`).join(", ");
  }
  function resolveSocialNetworkIndex(networks, target, method) {
    if (typeof target === "number") {
      if (!Number.isInteger(target) || target < 0 || target >= networks.length) {
        throw new EmailSdkError(
          `${method}(): network index ${String(target)} is out of range. Networks: ${socialNetworkSummary(networks)}.`
        );
      }
      return target;
    }
    if (typeof target === "string") {
      const matches = networks.flatMap((network, index) => network.type === target ? [index] : []);
      if (matches.length === 1) return matches[0];
      if (matches.length === 0) {
        throw new EmailSdkError(
          `${method}(): social network "${target}" was not found. Networks: ${socialNetworkSummary(networks)}.`
        );
      }
      throw new EmailSdkError(
        `${method}(): ${matches.length} networks have type "${target}"; address one by index (${matches.join(", ")}).`
      );
    }
    throw new EmailSdkError(`${method}() expects a network type or a zero-based network index.`);
  }
  function writeSocialNetwork(realId, target, set) {
    if (!isObject(set)) throw new EmailSdkError("setSocialNetwork() expects a mutation object.");
    writeSettings(realId, (settings, entry) => {
      assertSocialBlock(entry, "setSocialNetwork");
      const networks = socialNetworksOf(settings, "setSocialNetwork");
      const index = resolveSocialNetworkIndex(networks, target, "setSocialNetwork");
      const network = networks[index];
      const linkType = set.linkType ?? set.link_type;
      if (set.url !== void 0) {
        if (set.url === "") {
          delete network.link;
        } else {
          network.link = { type: linkType ?? inferSocialLinkType(set.url), href: set.url };
        }
      } else if (linkType !== void 0 && isObject(network.link)) {
        network.link = { ...network.link, type: linkType };
      }
      if (set.title !== void 0) {
        if (typeof set.title === "string") assertSocialTextLimit(set.title, "title", SOCIAL_TITLE_MAX_LENGTH);
        network.title = set.title;
      }
      if (set.alt !== void 0) {
        if (typeof set.alt === "string") assertSocialTextLimit(set.alt, "alt", SOCIAL_ALT_MAX_LENGTH);
        if (settings.textCustomization !== true) {
          throw new EmailSdkError(
            "setSocialNetwork(): alt requires text customization on the block \u2014 call setSocialShared({textCustomization: true}) first."
          );
        }
        network.alt = set.alt;
      }
      if (set.icon !== void 0) {
        if (network.type !== SOCIAL_CUSTOM_NETWORK_TYPE) {
          throw new EmailSdkError(
            `setSocialNetwork(): icon is only accepted for type "custom"; "${String(network.type)}" takes its icon from type and style.`
          );
        }
        network.icon = set.icon;
      }
      settings.networks = networks;
      assertNoSocialIssues(settings, "setSocialNetwork");
    });
  }
  function writeSocialNetworkAdd(realId, input, position) {
    writeSettings(realId, (settings, entry) => {
      assertSocialBlock(entry, "addSocialNetwork");
      const networks = socialNetworksOf(settings, "addSocialNetwork");
      const network = buildSocialNetwork(input, settings.textCustomization === true);
      let index = networks.length;
      if (position !== void 0) {
        if (!isObject(position) || position.after === void 0 === (position.before === void 0)) {
          throw new EmailSdkError("addSocialNetwork() position must contain exactly one of {after} or {before}.");
        }
        const anchor = resolveSocialNetworkIndex(networks, position.after ?? position.before, "addSocialNetwork");
        index = position.after !== void 0 ? anchor + 1 : anchor;
      }
      networks.splice(index, 0, network);
      settings.networks = networks;
      assertNoSocialIssues(settings, "addSocialNetwork");
    });
  }
  function writeSocialNetworkRemove(realId, target) {
    writeSettings(realId, (settings, entry) => {
      assertSocialBlock(entry, "removeSocialNetwork");
      const networks = socialNetworksOf(settings, "removeSocialNetwork");
      const index = resolveSocialNetworkIndex(networks, target, "removeSocialNetwork");
      if (networks.length === 1) {
        throw new EmailSdkError(
          "removeSocialNetwork() cannot remove the last network: a social block needs at least one, and an existing block cannot be deleted through document state."
        );
      }
      networks.splice(index, 1);
      settings.networks = networks;
    });
  }
  function writeSocialShared(realId, set) {
    if (!isObject(set)) throw new EmailSdkError("setSocialShared() expects a mutation object.");
    writeSettings(realId, (settings, entry) => {
      assertSocialBlock(entry, "setSocialShared");
      const iconSize = set.iconSize ?? set.icon_size;
      const spaceBetweenIcons = set.spaceBetweenIcons ?? set.space_between_icons;
      const textCustomization = set.textCustomization ?? set.text_customization;
      if (set.style === void 0 && iconSize === void 0 && spaceBetweenIcons === void 0 && textCustomization === void 0) {
        throw new EmailSdkError("setSocialShared() requires at least one of style, iconSize, spaceBetweenIcons, textCustomization.");
      }
      if (set.style !== void 0) {
        if (typeof set.style !== "string" || set.style === "") throw new EmailSdkError('setSocialShared() style must be an icon style name such as "logoColored".');
        settings.style = set.style;
      }
      if (iconSize !== void 0) settings.iconSize = normalizeIconSize(iconSize);
      if (spaceBetweenIcons !== void 0) settings.spaceBetweenIcons = normalizeSpaceBetweenIcons(spaceBetweenIcons);
      if (textCustomization !== void 0) {
        if (typeof textCustomization !== "boolean") throw new EmailSdkError("setSocialShared() textCustomization must be a boolean.");
        const networks = socialNetworksOf(settings, "setSocialShared");
        for (const network of networks) {
          if (textCustomization) {
            if (network.alt === void 0) network.alt = network.title;
          } else {
            delete network.alt;
          }
        }
        settings.networks = networks;
        settings.textCustomization = textCustomization;
      }
    });
  }
  function markSubtreeRemoved(realId) {
    if (!sdk.hasElement(realId)) return;
    for (const id of sdk.collectSubtreeIds(realId)) removedIds.add(id);
  }
  function dropRemovedCollapsedScopes() {
    for (const id of removedIds) if (sdk.hasElement(id)) {
      removedIds.delete(id);
      replacedByRepeat.delete(id);
    }
    for (const root of [...collapsedScopes.keys()]) {
      if (removedIds.has(root)) collapsedScopes.delete(root);
    }
  }
  function translateSetterError(error, label, realId, method) {
    if (!(error instanceof EditorJsonMutationError)) {
      return error instanceof Error ? error : new Error(String(error));
    }
    const description = sdk.describeElement(realId);
    const kindLabel = description === void 0 ? "element" : description.type === void 0 ? description.kind : `${description.kind} type="${description.type}"`;
    return new EmailSdkError(
      `${method}() failed on ${kindLabel} ${label}: ${error.message} ${SETTER_HINTS}`
    );
  }
  function slotKeyOf(slot) {
    return slot.context === void 0 ? slot.role : `${slot.role}.${slot.context}`;
  }
  function slotsSummary(inserted) {
    if (inserted.slots.length === 0) return "none";
    return [...new Set(inserted.slots.map(slotKeyOf))].join(", ");
  }
  function makeNodeStyle(realId, getNode) {
    const write = (property, value, options2) => {
      writeStyle(realId, property, value, options2);
      return getNode();
    };
    return sessionHandle({
      set(property, value, options2) {
        return write(property, value, options2);
      },
      background: sessionHandle({
        setColor(value, options2) {
          return write("backgroundColor", value, options2);
        }
      }),
      typography: sessionHandle({
        setColor(value) {
          return write("fontColor", value);
        },
        setSize(value, options2) {
          return write("fontSize", value, options2);
        },
        setFamily(value) {
          return write("fontFamily", value);
        },
        setBold(value) {
          return write("bold", value);
        },
        setItalic(value) {
          return write("italic", value);
        }
      }),
      layout: sessionHandle({
        setAlignment(value, options2) {
          return write("textAlign", value, options2);
        },
        setPadding(value, options2) {
          return write("padding", value, options2);
        },
        setMargin(value, options2) {
          return write("margin", value, options2);
        }
      }),
      border: sessionHandle({
        set(value) {
          return write("border", value);
        },
        setRadius(value, options2) {
          return write("borderRadius", value, options2);
        }
      })
    });
  }
  function makeNode(realId, lookupId, nodeOptions = {}) {
    const { mapping, inserted } = nodeOptions;
    const label = nodeOptions.label ?? `id=${lookupId}`;
    const makeSetter = (method, property) => (value) => {
      assertMutable(realId);
      if (method === "setText" && sdk.describeElement(realId)?.type === "image") {
        throw new EmailSdkError(
          `setText() is not valid on image ${label}: use setAlt() for alt text, setSrc() for the image URL, setHref() for the link. ${SETTER_HINTS}`
        );
      }
      let nextValue = value;
      if ((method === "setContent" || method === "setText") && typeof value === "string" && sdk.describeElement(realId)?.type === "text") {
        nextValue = transplantContentFormat(sdk.getContent(realId) ?? "", value);
      }
      try {
        sdk.setContent(realId, property, nextValue);
      } catch (error) {
        throw translateSetterError(error, label, realId, method);
      }
      mutationCount += 1;
      return node;
    };
    let node;
    const style = makeNodeStyle(realId, () => node);
    node = sessionHandle({
      id: lookupId,
      style,
      inspect() {
        return deepFreeze(cloneJson(entryFor(realId)));
      },
      describe() {
        const entry = entryFor(realId);
        return deepFreeze({
          kind: entry.blockType ?? entry.kind,
          settings: cloneJson(resolveSchema(nodeSchema(entry.blockType ?? entry.kind).properties.settings)),
          capabilities: cloneJson(nodeCapability(entry.blockType ?? entry.kind))
        });
      },
      patchSettings(patch) {
        patchNodeSettings(realId, patch);
        return node;
      },
      resetSettings(paths) {
        assertMutable(realId);
        for (const path of paths) {
          const entry = entryFor(realId);
          if (entry.blockType !== "image" || path !== "link") throw new EmailSdkError(`No confirmed reset for ${entry.blockType ?? entry.kind}.settings.${path}.`);
          sdk.deleteElementProperty(realId, ["settings", path]);
          addIntent({ resetFields: [`/${entry.id}/settings/${path}`] });
          mutationCount++;
        }
        return node;
      },
      setHtml(html) {
        assertMutable(realId);
        if (!["text", "html", "unknown"].includes(entryFor(realId).blockType ?? "")) throw new EmailSdkError("setHtml requires a text, html or unknown block.");
        sdk.setElementProperty(realId, "content", html);
        mutationCount++;
        return node;
      },
      setExtension(enabled) {
        assertMutable(realId);
        if (entryFor(realId).blockType !== "unknown") throw new EmailSdkError("setExtension requires an unknown block.");
        sdk.setElementProperty(realId, "extension", enabled);
        mutationCount++;
        return node;
      },
      setSpacerMode(mode, patch = {}) {
        writeSettings(realId, (settings, entry) => {
          if (entry.blockType !== "spacer") throw new EmailSdkError("setSpacerMode requires a spacer.");
          const defaults = contractDefaults("spacer");
          settings.mode = mode;
          const remove = mode === "line" ? ["height"] : ["width", "border", "mobileBorder", "alignment"];
          for (const key of remove) {
            delete settings[key];
            addIntent({ resetFields: [`/${entry.id}/settings/${key}`] });
          }
          if (mode === "line") for (const key of ["width", "border", "alignment"]) settings[key] ??= defaults[key];
          else settings.height ??= { desktop: 20, mobile: 20 };
          Object.assign(settings, patch);
        });
        return node;
      },
      setMenuMode(mode) {
        writeSettings(realId, (settings, entry) => {
          if (entry.blockType !== "menu" || !["perItem", "links", "icons", "linksWithIcons"].includes(mode)) throw new EmailSdkError("Use perItem, links, icons or linksWithIcons on a menu.");
          const previous = settings.itemType;
          const items = settings.items;
          for (const item of items) {
            if (mode === "perItem") item.type ??= previous.type ?? "links";
            else delete item.type;
            const itemType = mode === "perItem" ? item.type : mode;
            if (itemType === "links") delete item.image;
          }
          settings.itemType = mode === "perItem" ? { mode } : { mode: "shared", type: mode };
          addIntent({ replaceCollections: [`/${entry.id}/settings/itemType`] });
        });
        return node;
      },
      addMenuItem(item, position) {
        writeSettings(realId, (settings, entry) => {
          if (entry.blockType !== "menu") throw new EmailSdkError("addMenuItem requires a menu.");
          const items = settings.items;
          const index = position === void 0 ? items.length : collectionPosition(items.length, position);
          items.splice(index, 0, cloneJson(item));
        });
        return node;
      },
      updateMenuItem(index, patch) {
        writeSettings(realId, (settings, entry) => {
          if (entry.blockType !== "menu") throw new EmailSdkError("updateMenuItem requires a menu.");
          const items = settings.items;
          assertCollectionIndex(items.length, index);
          const settingsSchema = resolveSchema(nodeSchema("menu").properties.settings);
          const itemSchema = resolveSchema(settingsSchema.properties.items).items;
          items[index] = patchObject(items[index], patch, itemSchema, "menu.items");
        });
        return node;
      },
      removeMenuItem(index) {
        writeSettings(realId, (settings, entry) => {
          if (entry.blockType !== "menu") throw new EmailSdkError("removeMenuItem requires a menu.");
          const items = settings.items;
          assertCollectionIndex(items.length, index);
          items.splice(index, 1);
        });
        return node;
      },
      moveMenuItem(index, position) {
        writeSettings(realId, (settings, entry) => {
          if (entry.blockType !== "menu") throw new EmailSdkError("moveMenuItem requires a menu.");
          const items = settings.items;
          assertCollectionIndex(items.length, index);
          const target = collectionPosition(items.length, position);
          const [item] = items.splice(index, 1);
          items.splice(target > index ? target - 1 : target, 0, item);
        });
        return node;
      },
      moveSocialNetwork(target, position) {
        writeSettings(realId, (settings, entry) => {
          assertSocialBlock(entry, "moveSocialNetwork");
          const items = socialNetworksOf(settings, "moveSocialNetwork");
          const from = resolveSocialNetworkIndex(items, target, "moveSocialNetwork");
          const to = resolveSocialNetworkIndex(items, "before" in position ? position.before : position.after, "moveSocialNetwork") + ("before" in position ? 0 : 1);
          const [item] = items.splice(from, 1);
          items.splice(to > from ? to - 1 : to, 0, item);
        });
        return node;
      },
      duplicate(position) {
        assertMutable(realId);
        return insertComponent({ node: entryFor(realId).element, slots: [] }, position ?? { after: node });
      },
      move(position) {
        assertMutable(realId);
        if (!nodeCapability(entryFor(realId).blockType ?? entryFor(realId).kind)?.actions.MOVE.runtimes.mergeService) throw new EmailSdkError("This node does not support MOVE in merge-service.");
        const before = "before" in position;
        const anchor = resolveInsertAnchor(before ? position.before : position.after).realId;
        sdk.moveElement(realId, anchor, before);
        mutationCount++;
        return node;
      },
      byId(rawId, disambiguateBy) {
        if (inserted !== void 0) {
          throw new EmailSdkError(
            `${label} has no compact ids inside \u2014 use slot("role") to address its blocks (slots: ${slotsSummary(inserted)}).`
          );
        }
        assertNotRemoved(realId);
        if (mapping !== void 0) {
          const compactId2 = String(rawId).trim();
          const targetOriginalId2 = tempToReal.get(compactId2) ?? compactId2;
          const targetInstanceId = mapping.get(targetOriginalId2);
          if (targetInstanceId === void 0) {
            throw new EmailSdkError(
              `id "${compactId2}" is not inside section ${label}. Ids inside this section: ${scopeIdsSummary(mapping.keys(), lookupId)}.`
            );
          }
          assertNotRemoved(targetInstanceId);
          const scope2 = entryFor(realId).path;
          const entry = disambiguateEntries(currentIndex().filter((candidate) => candidate.id === targetInstanceId && scope2.every((key, index) => candidate.path[index] === key)), compactId2, disambiguateBy);
          return makeNode(referenceFor(entry), compactId2, { mapping });
        }
        const { compactId, realId: targetOriginalId } = resolveLookup(rawId, disambiguateBy);
        const scope = entryFor(realId).path;
        const target = entryFor(targetOriginalId).path;
        const subtreeIds = new Set(sdk.collectSubtreeIds(realId));
        if (!scope.every((key, index) => target[index] === key)) {
          throw new EmailSdkError(
            `id "${compactId}" is not inside element ${label}. Ids inside this element: ${scopeIdsSummary(subtreeIds.values(), lookupId)}.`
          );
        }
        assertNotRemoved(targetOriginalId);
        return makeNode(targetOriginalId, compactId);
      },
      setContent: makeSetter("setContent", "content"),
      setText: makeSetter("setText", "text"),
      setSrc: makeSetter("setSrc", "src"),
      setHref: makeSetter("setHref", "href"),
      setAlt: makeSetter("setAlt", "alt"),
      setTitle: makeSetter("setTitle", "title"),
      replaceText(match, replace, options2) {
        replaceText(realId, match, replace, options2);
        return node;
      },
      setTextLink(mutation) {
        writeTextLink(realId, mutation);
        return node;
      },
      setLink(mutation) {
        writeLink(realId, mutation);
        return node;
      },
      setStyle(property, value, options2) {
        writeStyle(realId, property, value, options2);
        return node;
      },
      setMenuItem(itemIndex, set) {
        writeMenuItem(realId, itemIndex, set);
        return node;
      },
      setMenuShared(set) {
        writeMenuShared(realId, set);
        return node;
      },
      setSocialNetwork(target, set) {
        writeSocialNetwork(realId, target, set);
        return node;
      },
      addSocialNetwork(network, position) {
        writeSocialNetworkAdd(realId, network, position);
        return node;
      },
      removeSocialNetwork(target) {
        writeSocialNetworkRemove(realId, target);
        return node;
      },
      setSocialShared(set) {
        writeSocialShared(realId, set);
        return node;
      },
      remove() {
        assertMutable(realId, { allowCollapsedRoot: true });
        assertBlockDeletionSupported(realId, "remove", label);
        markSubtreeRemoved(realId);
        sdk.deleteElement(realId);
        for (const siblingId of repeatSiblings[realId] ?? []) {
          markSubtreeRemoved(siblingId);
          sdk.deleteElementIfPresent(siblingId);
        }
        dropRemovedCollapsedScopes();
        mutationCount += 1;
      },
      repeat(totalCount) {
        assertNotSealed();
        if (inserted !== void 0) {
          throw new EmailSdkError(
            `repeat() is not supported on inserted components \u2014 call email.insert("${inserted.file}", {after: <previous handle>}) once per copy instead.`
          );
        }
        if (repeatedRoots.has(realId)) {
          throw new EmailSdkError(
            `Section ${compactLabel(realId)} was already repeated \u2014 call repeat() once with the final total count.`
          );
        }
        assertNotRemoved(realId);
        if (typeof totalCount !== "number" || !Number.isInteger(totalCount) || totalCount < 1) {
          throw new EmailSdkError(
            `repeat(${String(totalCount)}) is invalid: totalCount must be an integer >= 1. Use remove() to delete the section instead.`
          );
        }
        const enclosingRoot = findBlockingCollapsedRoot(realId);
        if (enclosingRoot !== void 0 && enclosingRoot !== realId) {
          throw collapsedGuardError(realId, enclosingRoot);
        }
        assertBlockDeletionSupported(realId, "repeat", label);
        const subtreeIds = sdk.collectSubtreeIds(realId);
        const originalRootId = entryFor(realId).id;
        const instances = [];
        for (let ordinal = 0; ordinal < totalCount; ordinal += 1) {
          const instanceMapping = /* @__PURE__ */ new Map();
          for (const originalId of subtreeIds) {
            instanceMapping.set(
              originalId,
              generateUniqueId(`${originalId}#${ordinal}`, (id) => sdk.hasElement(id))
            );
          }
          const rootCloneId = instanceMapping.get(originalRootId);
          if (rootCloneId === void 0) throw new EmailSdkError("repeat() internal error: missing root clone id.");
          const nestedIds = Object.fromEntries(
            [...instanceMapping].filter(([originalId]) => originalId !== originalRootId)
          );
          sdk.cloneElement(realId, rootCloneId, false, nestedIds);
          instances.push(makeNode(rootCloneId, lookupId, { mapping: instanceMapping }));
        }
        for (const originalId of subtreeIds) {
          removedIds.add(originalId);
          replacedByRepeat.add(originalId);
        }
        sdk.deleteElement(realId);
        replacedByRepeat.add(realId);
        for (const siblingId of repeatSiblings[realId] ?? []) {
          markSubtreeRemoved(siblingId);
          sdk.deleteElementIfPresent(siblingId);
        }
        repeatedRoots.add(realId);
        dropRemovedCollapsedScopes();
        mutationCount += 1;
        return Object.freeze(instances);
      },
      slot(role, context) {
        if (inserted === void 0) {
          throw new EmailSdkError(
            "slot() is only available on handles returned by email.insert() \u2014 address this element's children with byId() and compact ids from brief_input."
          );
        }
        assertNotRemoved(realId);
        if (typeof role !== "string" || role === "") {
          throw new EmailSdkError(
            `slot() expects a slot role string. Slots of ${label}: ${slotsSummary(inserted)}.`
          );
        }
        const roleMatches = inserted.slots.filter((slot) => slot.role === role);
        if (roleMatches.length === 0) {
          throw new EmailSdkError(
            `Component ${label} has no slot "${role}". Slots: ${slotsSummary(inserted)}.`
          );
        }
        const matches = context === void 0 ? roleMatches : roleMatches.filter((slot) => slot.context === context);
        if (matches.length === 0) {
          throw new EmailSdkError(
            `Component ${label} has no slot "${role}" with context "${String(context)}". Available: ${roleMatches.map(slotKeyOf).join(", ")}.`
          );
        }
        if (matches.length > 1) {
          const contexts = [...new Set(matches.map((slot) => slot.context))].filter((value) => value !== void 0);
          if (context === void 0 && contexts.length > 1) {
            throw new EmailSdkError(
              `Slot "${role}" is ambiguous in ${label} \u2014 pass a context: ${contexts.map((value) => `slot("${role}", "${value}")`).join(", ")}.`
            );
          }
          throw new EmailSdkError(
            `Slot "${role}" matches ${matches.length} blocks in ${label} and cannot be disambiguated by context.`
          );
        }
        const target = matches[0];
        assertNotRemoved(target.realId);
        return makeNode(target.realId, slotKeyOf(target), {
          label: `slot "${slotKeyOf(target)}" of ${label}`
        });
      }
    });
    handleRealIds.set(node, realId);
    return node;
  }
  function assertCollectionIndex(length, index) {
    if (!Number.isInteger(index) || index < 0 || index >= length) throw new EmailSdkError("Collection index is out of range.");
  }
  function collectionPosition(length, position) {
    const index = "before" in position ? position.before : position.after;
    assertCollectionIndex(length, index);
    return index + ("before" in position ? 0 : 1);
  }
  function scopeIdsSummary(realIds, excludeCompactId) {
    const compactIds = [...realIds].map((id) => realToTemp.get(id)).filter((id) => id !== void 0 && id !== excludeCompactId).sort((a, b) => Number(a) - Number(b));
    return compactIds.length === 0 ? "none" : compactIds.join(", ");
  }
  function resolveInsertAnchor(rawAnchor) {
    if (typeof rawAnchor === "string" || typeof rawAnchor === "number") {
      const { compactId, realId } = resolveCompactId(rawAnchor);
      assertNotRemoved(realId);
      return { realId, label: `id=${compactId}` };
    }
    if (rawAnchor !== null && typeof rawAnchor === "object") {
      const realId = handleRealIds.get(rawAnchor);
      if (realId !== void 0) {
        assertNotRemoved(realId);
        return { realId, label: compactLabel(realId) };
      }
    }
    throw new EmailSdkError(
      "insert() anchor must be a compact id from brief_input or a handle returned by this script (byId/repeat/insert)."
    );
  }
  function insertComponent(componentFile, position) {
    assertNotSealed();
    if (isObject(componentFile)) {
      const component2 = componentFile;
      operationOrigin ??= { kind: "native", nodeId: String(component2.node?.id) };
      const key = `native:${String(component2.node?.id)}`;
      const saved = componentLibrary.get(key);
      componentLibrary.set(key, { ...component2, file: key, level: describeNodeKind(component2.node) === "stripe" ? "L1" : "atoms", slots: component2.slots ?? [] });
      try {
        return insertComponent(key, position);
      } finally {
        if (saved) componentLibrary.set(key, saved);
        else componentLibrary.delete(key);
      }
    }
    const library = componentLibrary;
    if (library === void 0 || library.size === 0) {
      throw new EmailSdkError(
        "No brand component library is available in this session \u2014 email.insert() cannot be used here."
      );
    }
    if (typeof componentFile !== "string") {
      throw new EmailSdkError("insert() expects a brand_library component file key as the first argument.");
    }
    operationOrigin ??= { kind: "component", source: componentFile };
    const component = library.get(componentFile);
    if (component === void 0) {
      throw new EmailSdkError(
        `Unknown component "${componentFile}". Valid component files: ${[...library.keys()].sort().join(", ")}.`
      );
    }
    if (position === null || typeof position !== "object") {
      throw new EmailSdkError(
        "insert() expects a position object: {after: <id or handle>} or {before: <id or handle>}."
      );
    }
    const { after, before } = position;
    if (after === void 0 === (before === void 0)) {
      throw new EmailSdkError("insert() position must contain exactly one of {after} or {before}.");
    }
    const isBefore = before !== void 0;
    const { realId: anchorRealId, label: anchorLabel } = resolveInsertAnchor(isBefore ? before : after);
    const blockingRoot = findBlockingCollapsedRoot(anchorRealId);
    if (blockingRoot !== void 0 && blockingRoot !== anchorRealId) {
      throw collapsedGuardError(anchorRealId, blockingRoot);
    }
    let effectiveAnchorRealId = anchorRealId;
    if (!isBefore && blockingRoot === anchorRealId) {
      const surviving = (repeatSiblings[anchorRealId] ?? []).filter((id) => sdk.hasElement(id));
      if (surviving.length > 0) effectiveAnchorRealId = surviving[surviving.length - 1];
    }
    const componentKind = describeNodeKind(component.node);
    if (componentKind === void 0 || !isObject(component.node) || typeof component.node.id !== "string") {
      throw new EmailSdkError(`Component "${componentFile}" is malformed and cannot be inserted.`);
    }
    const anchorKind = sdk.describeElement(anchorRealId)?.kind;
    if (componentKind !== anchorKind) {
      throw new EmailSdkError(
        `Component "${componentFile}" is a ${componentKind} and must be inserted next to another ${componentKind}, but anchor ${anchorLabel} is a ${anchorKind ?? "missing element"}. Pick a ${componentKind}-level anchor from brief_input.`
      );
    }
    const occurrenceKey = `${componentFile}@${anchorRealId}`;
    const occurrence = insertOccurrence.get(occurrenceKey) ?? 0;
    const mapping = /* @__PURE__ */ new Map();
    const issued = /* @__PURE__ */ new Set();
    for (const originalId of collectNodeIds(component.node)) {
      if (mapping.has(originalId)) continue;
      const newId = generateUniqueId(
        `insert:${componentFile}@${anchorRealId}#${occurrence}:${originalId}`,
        (id) => issued.has(id) || sdk.hasElement(id)
      );
      mapping.set(originalId, newId);
      issued.add(newId);
    }
    const transaction = sdk.beginTransaction();
    try {
      sdk.insertNode(component.node, effectiveAnchorRealId, isBefore, Object.fromEntries(mapping));
      if (transactionDepth === 0) sdk.validateDraft(`After insert("${componentFile}")`, {
        operation: "insert",
        componentFile,
        direction: isBefore ? "before" : "after",
        anchorLabel,
        componentKind,
        anchorKind,
        rolledBack: true
      });
    } catch (error) {
      sdk.rollback(transaction);
      if (error instanceof EmailSdkSchemaError) {
        validation = "failed";
      }
      throw error;
    }
    insertOccurrence.set(occurrenceKey, occurrence + 1);
    mutationCount += 1;
    validation = "pending";
    const rootRealId = mapping.get(component.node.id);
    if (rootRealId === void 0) {
      throw new EmailSdkError("insert() internal error: missing root id mapping.");
    }
    const slots = [];
    for (const slot of component.slots) {
      const target = resolveJsonPointer(component.node, slot.pointer);
      const originalId = isObject(target) && typeof target.id === "string" ? target.id : void 0;
      const slotRealId = originalId === void 0 ? void 0 : mapping.get(originalId);
      if (slotRealId !== void 0) {
        slots.push({ role: slot.role, context: slot.context, realId: slotRealId });
      }
    }
    const handleId = occurrence === 0 ? componentFile : `${componentFile}#${occurrence + 1}`;
    return makeNode(rootRealId, handleId, {
      label: `component "${handleId}"`,
      inserted: { file: componentFile, slots }
    });
  }
  function makeEmailTheme(getEmail) {
    const write = (property, value, options2) => {
      writeDocumentStyle(property, value, options2);
      return getEmail();
    };
    return sessionHandle({
      set(path, value) {
        writeTheme(path, value);
        return getEmail();
      },
      style: sessionHandle({
        set(property, value, options2) {
          return write(property, value, options2);
        },
        background: sessionHandle({
          setContentColor(value, options2) {
            return write("backgroundColor", value, { ...options2, backgroundTarget: "content" });
          },
          setStripeColor(value, options2) {
            return write("backgroundColor", value, { ...options2, backgroundTarget: "stripe" });
          }
        }),
        typography: sessionHandle({
          setColor(value, options2) {
            return write("fontColor", value, options2);
          },
          setSize(value, options2) {
            return write("fontSize", value, options2);
          },
          setFamily(value) {
            return write("fontFamily", value);
          },
          setLineHeight(value, options2) {
            return write("lineHeight", value, options2);
          }
        }),
        link: sessionHandle({
          setColor(value, options2) {
            return write("linkColor", value, options2);
          }
        })
      })
    });
  }
  let email;
  const theme = makeEmailTheme(() => email);
  email = sessionHandle({
    theme,
    one(selector) {
      return email.first({ ...selector, limit: void 0 });
    },
    block(id, expectedType) {
      const handle = email.byId(id);
      if (handle.inspect().blockType !== expectedType) throw new EmailSdkError(`Expected ${expectedType} block at ${id}.`);
      return handle;
    },
    patchSettings(patch) {
      const settings = sdk.snapshot().settings;
      const candidate = patchObject(settings, patch, resolveSchema(getJsonSchema().properties.settings), "settings");
      sdk.setDocumentPath(["settings"], candidate, false);
      mutationCount++;
      return email;
    },
    resetSettings(paths) {
      resetDocumentSettings(paths);
      return email;
    },
    setFonts(fonts) {
      const issues = jsonIssues(fonts);
      if (issues.length) throw new DocumentStateError(issues);
      sdk.setDocumentPath(["resources", "fonts"], cloneJson(fonts), false);
      addIntent({ replaceCollections: ["/resources/fonts"] });
      mutationCount++;
      return email;
    },
    setMetadata(patch) {
      writeMetadata(patch);
      return email;
    },
    byId(rawId, disambiguateBy) {
      const { compactId, realId } = resolveLookup(rawId, disambiguateBy);
      assertNotRemoved(realId);
      return makeNode(realId, compactId);
    },
    select(selector) {
      const entries = selectEntries(selector);
      if (entries.length === 0) {
        selectorMisses.push({ selector: cloneJson(selector), message: "Selector matched no nodes." });
      }
      return Object.freeze(entries.map((entry) => makeNode(referenceFor(entry), realToTemp.get(entry.id) ?? entry.id)));
    },
    first(selector) {
      const entries = selectEntries({ ...selector, limit: selector.limit ?? 2 });
      if (entries.length === 0) {
        selectorMisses.push({ selector: cloneJson(selector), message: "Selector matched no nodes." });
        throw new EmailSdkError("Selector matched no nodes.");
      }
      if (entries.length > 1 && selector.limit === void 0) {
        throw new EmailSdkError(`Selector matched ${entries.length} nodes; narrow it or use select().`);
      }
      const entry = entries[0];
      return makeNode(referenceFor(entry), realToTemp.get(entry.id) ?? entry.id);
    },
    setContent(id, value, disambiguateBy) {
      return email.byId(id, disambiguateBy).setContent(value);
    },
    setText(id, value, disambiguateBy) {
      return email.byId(id, disambiguateBy).setText(value);
    },
    setSrc(id, url, disambiguateBy) {
      return email.byId(id, disambiguateBy).setSrc(url);
    },
    setHref(id, url, disambiguateBy) {
      return email.byId(id, disambiguateBy).setHref(url);
    },
    setAlt(id, text, disambiguateBy) {
      return email.byId(id, disambiguateBy).setAlt(text);
    },
    setTitle(id, text, disambiguateBy) {
      return email.byId(id, disambiguateBy).setTitle(text);
    },
    remove(id, disambiguateBy) {
      email.byId(id, disambiguateBy).remove();
    },
    repeat(id, totalCount, disambiguateBy) {
      return email.byId(id, disambiguateBy).repeat(totalCount);
    },
    setTheme(path, value) {
      writeTheme(path, value);
      return email;
    },
    setStyle(property, value, options2) {
      writeDocumentStyle(property, value, options2);
      return email;
    },
    insert(componentFile, position) {
      return insertComponent(componentFile, position);
    },
    append(node, parent) {
      const problems = jsonIssues(node);
      if (problems.length) throw new DocumentStateError(problems);
      if (!isObject(node) || typeof node.id !== "string") throw new EmailSdkError("append requires a native node with an ID.");
      operationOrigin = { kind: "native", nodeId: node.id };
      const copy = cloneJson(node);
      const ids = /* @__PURE__ */ new Map();
      const taken = new Set(collectAllIds(sdk.snapshot()));
      for (const id of collectAllIds(copy)) if (!ids.has(id)) {
        const next = generateUniqueId(`append:${version}:${id}`, (candidate) => taken.has(candidate));
        if (taken.has(next)) throw new EmailSdkError("idFactory returned a duplicate id.");
        ids.set(id, next);
        taken.add(next);
      }
      const rewrite = (value) => {
        if (Array.isArray(value)) value.forEach(rewrite);
        else if (isObject(value)) {
          if (typeof value.id === "string") value.id = ids.get(value.id) ?? value.id;
          for (const key of ["stripes", "structures", "columns", "containers", "blocks"]) if (Array.isArray(value[key])) rewrite(value[key]);
        }
      };
      rewrite(copy);
      sdk.appendNode(copy, parent === void 0 ? void 0 : resolveInsertAnchor(parent).realId);
      mutationCount++;
      return makeNode(String(copy.id), String(copy.id));
    },
    insertFrom(reference, nodeId, position) {
      const sourceDocument = requireValid(validateSnapshot(reference));
      const candidates = collectNodeIndex(sourceDocument).filter((node) => node.id === nodeId);
      if (candidates.length !== 1) throw new EmailSdkError("insertFrom requires an unambiguous source node.");
      const source = candidates[0];
      operationOrigin = { kind: "reference", nodeId };
      const subtree = collectNodeIndex(source.element);
      if (subtree.some((node) => node.element.moduleId !== void 0 || node.blockType === "unknown" && node.element.extension === true)) {
        throw new EmailSdkError("Module/extension bindings require host context and cannot be transferred implicitly.");
      }
      const resources = sourceDocument.resources ?? {};
      const currentResources = sdk.snapshot().resources;
      if (Object.keys(resources).some((key) => key !== "fonts")) throw new EmailSdkError("Unclassified resource transfer.");
      if (Array.isArray(resources.fonts)) {
        const fonts = isObject(currentResources) && Array.isArray(currentResources.fonts) ? cloneJson(currentResources.fonts) : [];
        const used = /* @__PURE__ */ new Set();
        const collectFonts = (value) => {
          if (Array.isArray(value)) value.forEach(collectFonts);
          else if (isObject(value)) for (const [key, child] of Object.entries(value)) {
            if (/fontFamily$/i.test(key) && typeof child === "string") used.add(canonicalFontValue(child));
            else if (key === "content" && typeof child === "string") {
              for (const value2 of collectUsedFontValues(child)) used.add(value2);
            } else collectFonts(child);
          }
        };
        collectFonts(source.element);
        for (const font of resources.fonts) {
          if (!isObject(font) || typeof font.fontFamily !== "string" || !used.has(canonicalFontValue(font.fontFamily))) continue;
          const conflict = fonts.find((item) => isObject(item) && typeof item.fontFamily === "string" && canonicalFontValue(item.fontFamily) === canonicalFontValue(font.fontFamily));
          if (conflict && stableJson(conflict) !== stableJson(font)) throw new EmailSdkError(`Conflicting font resource ${font.fontFamily}.`);
          if (!conflict) fonts.push(cloneJson(font));
        }
        if (fonts.length || isObject(currentResources) && Array.isArray(currentResources.fonts)) {
          sdk.setDocumentPath(["resources", "fonts"], fonts, false);
          addIntent({ replaceCollections: ["/resources/fonts"] });
        }
      }
      return insertComponent({ node: source.element, slots: [] }, position);
    }
  });
  return {
    email,
    finish() {
      assertNotSealed();
      if (transactionDepth > 0) throw new EmailSdkError("Finish outside the active transaction.");
      try {
        const result = requireValid(prepared());
        sealed = true;
        validation = "passed";
        return result;
      } catch (error) {
        validation = "failed";
        throw error;
      }
    },
    toJSON() {
      return sdk.snapshot();
    },
    snapshot() {
      return sdk.snapshot();
    },
    validate() {
      const result = prepared();
      validation = result.success ? "passed" : "failed";
      return result;
    },
    changes() {
      return deepFreeze(cloneJson(journal));
    },
    inspect() {
      return summarizeEditorJson(sdk.snapshot());
    },
    skip(reason) {
      assertNotSealed();
      if (!reason.trim()) throw new EmailSdkError("skip requires a reason.");
      if (stableJson(baseline) !== stableJson(sdk.snapshot())) throw new EmailSdkError("skip requires an unchanged draft.");
      skipped = reason;
    },
    transaction(callback) {
      assertNotSealed();
      if (callback.constructor?.name === "AsyncFunction") throw new EmailSdkError("transaction callback must be synchronous.");
      const state = snapshotState();
      const priorId = transactionId;
      if (transactionDepth === 0) transactionId = ++transactionOrdinal;
      transactionDepth++;
      try {
        const result = callback(email);
        if (result && typeof result.then === "function") throw new EmailSdkError("transaction callback must be synchronous.");
        if (transactionDepth === 1) requireValid(prepared());
        return result;
      } catch (error) {
        const failedTransaction = transactionId;
        restoreState(state);
        if (error instanceof DocumentStateError) throw new DocumentStateError(error.issues.map((issue) => ({ ...issue, transaction: failedTransaction })));
        throw error;
      } finally {
        transactionDepth--;
        transactionId = priorId;
      }
    },
    get version() {
      return version;
    },
    get current() {
      return deepFreeze(cloneJson(baseline));
    },
    diagnostics() {
      return {
        mutationCount,
        warnings: Object.freeze([...warnings]),
        selectorMisses: Object.freeze(selectorMisses.map((miss) => cloneJson(miss))),
        validation,
        skipped
      };
    },
    get mutationCount() {
      return mutationCount;
    }
  };
}
function createEmailMutationSdk(options) {
  return createEmailSdk({
    ...options,
    idFactory: options.idFactory ?? ((_seed, isTaken) => randomUuid(isTaken))
  });
}

export {
  uuidFromSeed,
  uniqueUuidFromSeed,
  createEmailSdk,
  createEmailMutationSdk
};

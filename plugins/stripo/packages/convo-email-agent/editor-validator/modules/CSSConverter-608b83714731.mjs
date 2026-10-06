import {
  localizedMessage
} from "./biesbjerg-ngx-translate-extract-marker-6a26f5bc5c0e.mjs";
import {
  normalizeModelTag
} from "./ue-proto-87c1854705b4.mjs";
import {
  BlockType
} from "./index-604a083968ff.mjs";
import {
  ComplexBlock,
  DefaultBlock,
  defaultBlocksMarkers,
  extensionBlockIDAttr,
  serviceSelectorPrefix
} from "./serviceSelectorPrefix-db24995a76b3.mjs";
import {
  formatClassSelector,
  formatLiteral,
  formatString,
  getPortableRe2PatternError,
  getQueryDialect,
  moduleLegacy,
  parseCanonicalQuery,
  q,
  queryParseError
} from "./builders-6d4dedaf957f.mjs";

// editor/ui-editor-ui/src/app/core/block-operations-api/common/node-selectors.ts
var STRIPE_CSS_CLASS = "esd-stripe";
var STRUCTURE_CSS_CLASS = "esd-structure";
var CONTAINER_CSS_CLASS = "esd-container-frame";
var TEXT_BLOCK_CSS_CLASS = "esd-block-text";
var CUSTOM_TEXT_BLOCK_CSS_CLASS = "esd-text";
var IMAGE_BLOCK_CSS_CLASS = "esd-block-image";
var BUTTON_BLOCK_CSS_CLASS = "esd-block-button";
var HTML_BLOCK_CSS_CLASS = "esd-block-html";
var SPACER_BLOCK_CSS_CLASS = "esd-block-spacer";
var SOCIAL_BLOCK_CSS_CLASS = "esd-block-social";
var MENU_BLOCK_CSS_CLASS = "esd-block-menu";
var VIDEO_BLOCK_CSS_CLASS = "esd-block-video";
var TIMER_BLOCK_CSS_CLASS = "esd-block-timer";
var AMP_FORM_SUBMIT_CSS_CLASS = "esd-block-amp-form-submit";
var CSS_CLASS_TO_BLOCK_TYPE = {
  [TEXT_BLOCK_CSS_CLASS]: "text",
  [IMAGE_BLOCK_CSS_CLASS]: "image",
  [SOCIAL_BLOCK_CSS_CLASS]: "social",
  [HTML_BLOCK_CSS_CLASS]: "html",
  [BUTTON_BLOCK_CSS_CLASS]: "button",
  [SPACER_BLOCK_CSS_CLASS]: "spacer",
  [MENU_BLOCK_CSS_CLASS]: "menu",
  [VIDEO_BLOCK_CSS_CLASS]: "video",
  [TIMER_BLOCK_CSS_CLASS]: "timer"
};
var CSS_CLASS_TO_STRUCTURE_TYPE = {
  [STRIPE_CSS_CLASS]: "stripe",
  [STRUCTURE_CSS_CLASS]: "structure",
  [CONTAINER_CSS_CLASS]: "container"
};

// editor/ui-editor-ui/src/app/components/document/default-blocks/custom-block.ts
var CustomBlocks = ((CustomBlocks2) => {
  CustomBlocks2[CustomBlocks2["CUSTOM_BLOCK_LINK"] = BlockType.CUSTOM_BLOCK_LINK] = "CUSTOM_BLOCK_LINK";
  CustomBlocks2[CustomBlocks2["CUSTOM_BLOCK_IMAGE"] = BlockType.CUSTOM_BLOCK_IMAGE] = "CUSTOM_BLOCK_IMAGE";
  CustomBlocks2[CustomBlocks2["CUSTOM_BLOCK_TEXT"] = BlockType.CUSTOM_BLOCK_TEXT] = "CUSTOM_BLOCK_TEXT";
  CustomBlocks2["TEXT_IMAGE"] = "TEXT_IMAGE";
  return CustomBlocks2;
})(CustomBlocks || {});
var CustomBlockNames = {
  CUSTOM_BLOCK_LINK: localizedMessage.BLOCK_LINK_HINT_HEADER,
  CUSTOM_BLOCK_IMAGE: localizedMessage.BLOCK_IMAGE_HINT_HEADER,
  CUSTOM_BLOCK_TEXT: localizedMessage.BLOCK_TEXT_HINT_HEADER,
  TEXT_IMAGE: localizedMessage.TEXT_IMAGE
};
var customBlockMarkers = {
  [CustomBlocks.CUSTOM_BLOCK_LINK]: "esd-container-frame",
  [CustomBlocks.CUSTOM_BLOCK_IMAGE]: "esd-container-frame",
  [CustomBlocks.CUSTOM_BLOCK_TEXT]: CUSTOM_TEXT_BLOCK_CSS_CLASS,
  ["TEXT_IMAGE" /* TEXT_IMAGE */]: "esd-text-image"
};

// editor/ui-editor-ui/src/app/components/document/document-node-component/structural/structural-node.ts
var StructuralNode = ((StructuralNode2) => {
  StructuralNode2["BLOCK_AMP_ACCORDION"] = "BLOCK_AMP_ACCORDION";
  StructuralNode2["BLOCK_AMP_FORM"] = "BLOCK_AMP_FORM";
  StructuralNode2["AMP_ACCORDION_CONTAINER"] = "AMP-ACCORDION-CONTAINER";
  StructuralNode2[StructuralNode2["EMPTY_CONTAINER"] = BlockType.EMPTY_CONTAINER] = "EMPTY_CONTAINER";
  StructuralNode2["BANNER"] = "BANNER";
  StructuralNode2["MERGE_TAG_SELECTOR"] = "MERGE-TAG-SELECTOR";
  StructuralNode2["UI_MERGE_TAG_SELECTOR"] = "UI-MERGE-TAG-SELECTOR";
  StructuralNode2["AMP_FORM_NOTIFICATION"] = "AMP_FORM_NOTIFICATION";
  StructuralNode2["AMP_FORM_TEMPLATE"] = "TEMPLATE";
  StructuralNode2["AMP_FORM_SUBMIT"] = "AMP_FORM_SUBMIT";
  StructuralNode2["AMP_FORM_START_AGAIN"] = "AMP_FORM_START_AGAIN";
  StructuralNode2["AMP_FORM_INPUT"] = "AMP_FORM_INPUT";
  StructuralNode2["AMP_FORM_INPUT_HIDDEN"] = "AMP_FORM_INPUT_HIDDEN";
  StructuralNode2["MERGE_TAG_PREVIEW"] = "MERGE_TAG_PREVIEW";
  StructuralNode2["MERGE_TAG_PREVIEW_RAW"] = "MERGE_TAG_PREVIEW_RAW";
  return StructuralNode2;
})(StructuralNode || {});
var markers = {
  [StructuralNode.EMPTY_CONTAINER]: {
    tag: "TD" /* TD */,
    clss: "".concat(serviceSelectorPrefix, "-empty-container")
  },
  ["AMP-ACCORDION-CONTAINER" /* AMP_ACCORDION_CONTAINER */]: {
    tag: "TD" /* TD */,
    clss: "".concat(serviceSelectorPrefix, "-amp-accordion-container")
  },
  ["BANNER" /* BANNER */]: {
    tag: "IMG" /* IMG */,
    clss: "".concat(serviceSelectorPrefix, "-banner-node"),
    skipDeconstruction: true
  },
  ["AMP_FORM_NOTIFICATION" /* AMP_FORM_NOTIFICATION */]: {
    tag: "TD" /* TD */,
    clss: "".concat(serviceSelectorPrefix, "-amp-form-notification")
  },
  ["TEMPLATE" /* AMP_FORM_TEMPLATE */]: {
    tag: "TEMPLATE" /* TEMPLATE */,
    clss: "",
    skipDeconstruction: true
  },
  ["AMP_FORM_SUBMIT" /* AMP_FORM_SUBMIT */]: {
    tag: "TD" /* TD */,
    clss: AMP_FORM_SUBMIT_CSS_CLASS,
    skipDeconstruction: false
  },
  ["AMP_FORM_START_AGAIN" /* AMP_FORM_START_AGAIN */]: {
    tag: "TD" /* TD */,
    clss: "".concat(serviceSelectorPrefix, "-block-amp-form-start-again"),
    skipDeconstruction: false
  },
  ["AMP_FORM_INPUT" /* AMP_FORM_INPUT */]: {
    tag: "TD" /* TD */,
    clss: "".concat(serviceSelectorPrefix, "-block-amp-form-input-text"),
    skipDeconstruction: false
  },
  ["AMP_FORM_INPUT_HIDDEN" /* AMP_FORM_INPUT_HIDDEN */]: {
    tag: "TD" /* TD */,
    clss: "".concat(serviceSelectorPrefix, "-block-amp-form-input-hidden"),
    skipDeconstruction: false
  }
};
var structuralNodeMarkers = Object.keys(markers).reduce((map, key) => ({ ...map, [key]: markers[key] }), {});
var structuralNodesMarkersMap = Object.keys(markers).reduce((map, key) => ({ ...map, [markers[key].clss]: key }), {});

// editor/ui-editor-ui/src/app/constants/blocks.constants.ts
var ESD_BLOCK_TEXT = "esd-block-text";
var ESD_ANCHOR = "esd-anchor";

// editor/ui-editor-common/master-css/css-converter/CSSConverter.ts
function splitStyleDeclarations(styles) {
  const declarations = [];
  let start = 0;
  let quote;
  let escaped = false;
  let comment = false;
  let depth = 0;
  for (let index = 0; index < styles.length; index++) {
    const character = styles[index];
    const nextCharacter = styles[index + 1];
    if (comment) {
      if (character === "*" && nextCharacter === "/") {
        comment = false;
        index++;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = void 0;
      }
      continue;
    }
    if (character === "/" && nextCharacter === "*") {
      comment = true;
      index++;
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character === "(" || character === "[" || character === "{") {
      depth++;
    } else if (character === ")" || character === "]" || character === "}") {
      depth = Math.max(0, depth - 1);
    } else if (character === ";" && depth === 0) {
      declarations.push(styles.slice(start, index));
      start = index + 1;
    }
  }
  declarations.push(styles.slice(start));
  return declarations;
}
function findDeclarationColon(declaration) {
  let quote;
  let escaped = false;
  let comment = false;
  let depth = 0;
  for (let index = 0; index < declaration.length; index++) {
    const character = declaration[index];
    const nextCharacter = declaration[index + 1];
    if (comment) {
      if (character === "*" && nextCharacter === "/") {
        comment = false;
        index++;
      }
      continue;
    }
    if (quote) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === quote) {
        quote = void 0;
      }
      continue;
    }
    if (character === "/" && nextCharacter === "*") {
      comment = true;
      index++;
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character === "(" || character === "[" || character === "{") {
      depth++;
    } else if (character === ")" || character === "]" || character === "}") {
      depth = Math.max(0, depth - 1);
    } else if (character === ":" && depth === 0) {
      return index;
    }
  }
  return -1;
}
var CSSConverter = class {
  /**
   * Converts style string to object
   * @param styles - styles string
   */
  static stylesToObject(styles = "") {
    const stylesObj = {};
    splitStyleDeclarations(styles).forEach((declaration) => {
      const colonIndex = findDeclarationColon(declaration);
      if (colonIndex < 1) {
        return;
      }
      const property = declaration.slice(0, colonIndex).trim();
      const value = declaration.slice(colonIndex + 1).trim();
      if (property && value) {
        stylesObj[property] = value;
      }
    });
    return stylesObj;
  }
  static objectToStyles(object) {
    return Object.keys(object).map((k) => "".concat(k, ":").concat(object[k])).join(";");
  }
};

// editor/ui-editor-ui/src/app/model-query/adapters/application/HtmlObject.ts
var HtmlObjectGetter = {
  getChildren(node) {
    return node.children;
  },
  getType(node) {
    return node.type;
  },
  getTag(node) {
    return node.tag;
  },
  getContent(node) {
    return node.content;
  },
  getAttributeValue(node, attributeName) {
    return node.attributes?.[attributeName];
  },
  getClasses(node) {
    return (node?.attributes?.class ?? "").split(" ");
  },
  getStyles(node) {
    const styleValue = node.attributes?.style;
    if (typeof styleValue !== "string" || !styleValue) {
      return void 0;
    }
    const styles = CSSConverter.stylesToObject(styleValue);
    if (Object.keys(styles).length === 0) {
      return void 0;
    }
    const result = {};
    for (const key in styles) {
      if (Object.prototype.hasOwnProperty.call(styles, key)) {
        const value = styles[key];
        result[key] = typeof value === "number" ? String(value) : value ?? "";
      }
    }
    return result;
  },
  isElement(node) {
    return node.type === 1 /* ELEMENT_NODE */;
  },
  isText(node) {
    return node.type === 3 /* TEXT_NODE */;
  }
};

// editor/ui-editor-ui/src/app/model-query/compiler.ts
var cssPredicateKinds = /* @__PURE__ */ new Set([
  "css-is-rule",
  "css-property-exists",
  "css-rule-selector-equals",
  "css-rule-selector-contains",
  "css-media-equals",
  "css-media-contains",
  "css-selector-pattern",
  "css-selector-regex"
]);
var htmlPredicateKinds = /* @__PURE__ */ new Set([
  "tag-equals",
  "tag-one-of",
  "class-has",
  "class-one-of",
  "class-starts-with",
  "class-not-starts-with",
  "attribute-exists",
  "attribute-equals",
  "attribute-starts-with",
  "config-exists",
  "config-equals",
  "node-type-equals",
  "text-not-empty",
  "has-styles",
  "nth-child",
  "not-last-child",
  "not-last-element"
]);
function compileQueryAst(ast, options = {}) {
  if (options.validateDomain !== false) {
    validateDomain(ast);
  }
  return {
    domain: ast.domain,
    groups: ast.groups.map(compileChain)
  };
}
function compileChain(chain) {
  return {
    steps: chain.steps.map((step) => ({
      axis: step.axis,
      predicates: step.compound.predicates
    }))
  };
}
function validateDomain(ast) {
  ast.groups.forEach((group) => {
    group.steps.forEach((step) => {
      step.compound.predicates.forEach((predicate) => validatePredicateDomain(ast.domain, predicate));
    });
  });
}
function validatePredicateDomain(domain, predicate) {
  if (domain === "html" && cssPredicateKinds.has(predicate.kind)) {
    throw queryParseError("domain-mismatch", 'Predicate "'.concat(predicate.kind, '" is not available for html queries.'), 0, 0);
  }
  if (domain === "css" && htmlPredicateKinds.has(predicate.kind)) {
    throw queryParseError("domain-mismatch", 'Predicate "'.concat(predicate.kind, '" is not available for css queries.'), 0, 0);
  }
  switch (predicate.kind) {
    case "all-of":
    case "any-of":
      predicate.predicates.forEach((child) => validatePredicateDomain(domain, child));
      break;
    case "not":
      validatePredicateDomain(domain, predicate.predicate);
      break;
    case "has":
      validateChainDomain(domain, predicate.query);
      break;
    case "has-any":
      predicate.queries.forEach((query) => validateChainDomain(domain, query));
      break;
    default:
      break;
  }
}
function validateChainDomain(domain, chain) {
  chain.steps.forEach((step) => step.compound.predicates.forEach((predicate) => validatePredicateDomain(domain, predicate)));
}

// editor/ui-editor-ui/src/app/model-query/evaluator.ts
function assertNever(value) {
  throw new Error("Unsupported query variant: ".concat(String(value)));
}
function executeQuery(options) {
  const rootId = options.fromId ?? options.reader.getRootId();
  switch (options.mode) {
    case "parents":
      return { ids: executeParents(options.reader, rootId, options.plan.groups, false) };
    case "closest-parent":
      return { ids: executeParents(options.reader, rootId, options.plan.groups, true) };
    case "matches-root":
      return { ids: matchesAnyChain(options.reader, rootId, options.plan.groups) ? [rootId] : [] };
    case "first":
      return { ids: executeChildren(options.reader, rootId, options.plan.groups, true) };
    case "all":
      return { ids: executeChildren(options.reader, rootId, options.plan.groups, false) };
    /* istanbul ignore next: exhaustive QueryMode guard */
    default:
      return assertNever(options.mode);
  }
}
function executeChildren(reader, rootId, groups, stopOnFirst) {
  if (groups.length <= 1) {
    return executeChildrenByGroup(reader, rootId, groups, stopOnFirst);
  }
  return executeChildrenInLegacyGroupOrder(reader, rootId, groups, stopOnFirst);
}
function executeChildrenByGroup(reader, rootId, groups, stopOnFirst) {
  const result = /* @__PURE__ */ new Set();
  for (const group of groups) {
    if (group.steps.length === 0) {
      continue;
    }
    const matches = matchChainFrom(reader, rootId, group);
    for (const id of matches) {
      result.add(id);
      if (stopOnFirst) {
        return Array.from(result);
      }
    }
  }
  return Array.from(result);
}
function executeChildrenInLegacyGroupOrder(reader, rootId, groups, stopOnFirst) {
  const result = [];
  const seen = /* @__PURE__ */ new Set();
  const queue = groups.map((chain) => ({ id: rootId, chain, stepIndex: 0, scopeId: rootId }));
  for (let index = 0; index < queue.length; index++) {
    const task = queue[index];
    const step = task.chain.steps[task.stepIndex];
    if (!step) {
      continue;
    }
    const parent = reader.getParent(task.id);
    const context = { reader, rootId: task.scopeId, parent };
    const matched = matchesStep(reader, task.id, step, context);
    const isInitialDescendantRoot = task.id === rootId && task.stepIndex === 0 && step.axis === "descendant";
    if (matched) {
      if (task.stepIndex === task.chain.steps.length - 1) {
        if (!isInitialDescendantRoot && !seen.has(task.id)) {
          seen.add(task.id);
          result.push(task.id);
          if (stopOnFirst) {
            return result;
          }
        }
      } else {
        enqueueNextStep(reader, queue, task);
      }
    }
    if (step.axis === "descendant") {
      for (const child of reader.getChildren(task.id)) {
        queue.push({ ...task, id: child });
      }
    }
  }
  return result;
}
function enqueueNextStep(reader, queue, task) {
  const nextStepIndex = task.stepIndex + 1;
  const nextStep = task.chain.steps[nextStepIndex];
  switch (nextStep.axis) {
    case "self":
      queue.push({ ...task, stepIndex: nextStepIndex, scopeId: task.id });
      break;
    case "child":
    case "descendant":
      for (const child of reader.getChildren(task.id)) {
        queue.push({ id: child, chain: task.chain, stepIndex: nextStepIndex, scopeId: task.id });
      }
      break;
    case "ancestor":
    case "closest-ancestor":
      for (const ancestor of ancestors(reader, task.id, nextStep.axis === "closest-ancestor")) {
        queue.push({ id: ancestor, chain: task.chain, stepIndex: nextStepIndex, scopeId: task.id });
      }
      break;
    /* istanbul ignore next: exhaustive QueryAxis guard */
    default:
      assertNever(nextStep.axis);
  }
}
function executeParents(reader, rootId, groups, stopOnFirst) {
  const result = [];
  const seen = /* @__PURE__ */ new Set();
  const candidates = parentsIncludingSelf(reader, rootId);
  const groupMatchers = groups.map((group) => createParentGroupMatcher(reader, candidates, group));
  for (const parent of candidates) {
    if (matchesAnyParentGroup(reader, parent, groupMatchers)) {
      if (!seen.has(parent)) {
        seen.add(parent);
        result.push(parent);
      }
      if (stopOnFirst) {
        break;
      }
    }
  }
  return result;
}
function parentsIncludingSelf(reader, rootId) {
  const result = [];
  for (let parent = rootId; parent !== void 0; parent = reader.getParent(parent)) {
    result.push(parent);
  }
  return result;
}
function createParentGroupMatcher(reader, candidates, group) {
  const hasParentlessScopeMatch = candidates.some((candidate) => matchesParentChainAt(reader, candidate, group, group.steps.length - 1));
  return {
    group,
    useImplicitScopeFallback: !hasParentlessScopeMatch && canUseImplicitScopeFallback(group)
  };
}
function matchesAnyParentGroup(reader, id, groupMatchers) {
  return groupMatchers.some(({ group, useImplicitScopeFallback }) => useImplicitScopeFallback ? matchesImplicitScopeParentChainAt(reader, id, group) : matchesParentChainAt(reader, id, group, group.steps.length - 1));
}
function canUseImplicitScopeFallback(group) {
  return group.steps.length > 1 && stepIsPureScope(group.steps[0]);
}
function matchesImplicitScopeParentChainAt(reader, id, group) {
  const fallbackGroup = { ...group, steps: group.steps.slice(1) };
  return matchesParentChainAt(reader, id, fallbackGroup, fallbackGroup.steps.length - 1);
}
function matchesParentChainAt(reader, id, chain, stepIndex) {
  const step = chain.steps[stepIndex];
  if (!step || !matchesStep(reader, id, step, {
    reader,
    rootId: id,
    parent: reader.getParent(id),
    scopeMode: "parentless"
  })) {
    return false;
  }
  if (stepIndex === 0) {
    return true;
  }
  switch (step.axis) {
    case "child": {
      const parent = reader.getParent(id);
      return parent !== void 0 && matchesParentChainAt(reader, parent, chain, stepIndex - 1);
    }
    case "descendant":
      for (let parent = reader.getParent(id); parent !== void 0; parent = reader.getParent(parent)) {
        if (matchesParentChainAt(reader, parent, chain, stepIndex - 1)) {
          return true;
        }
      }
      return false;
    case "self":
      return matchesParentChainAt(reader, id, chain, stepIndex - 1);
    case "ancestor":
    case "closest-ancestor":
      return false;
    /* istanbul ignore next: exhaustive QueryAxis guard */
    default:
      return assertNever(step.axis);
  }
}
function matchesAnyChain(reader, id, groups) {
  return groups.some((group) => matchesChainAt(reader, id, group));
}
function matchesChainAt(reader, id, chain) {
  if (chain.steps.length === 0) {
    return false;
  }
  const lastStep = chain.steps[chain.steps.length - 1];
  if (!matchesStep(reader, id, lastStep, { reader, rootId: id, parent: reader.getParent(id) })) {
    return false;
  }
  if (chain.steps.length === 1) {
    return true;
  }
  return hasAncestorChain(reader, reader.getParent(id), chain.steps.slice(0, -1), id);
}
function hasAncestorChain(reader, id, steps, scopeId) {
  if (id === void 0 || steps.length === 0) {
    return steps.length === 0;
  }
  const step = steps[steps.length - 1];
  for (let current = id; current !== void 0; current = reader.getParent(current)) {
    if (matchesStep(reader, current, step, { reader, rootId: scopeId, parent: reader.getParent(current) }) && hasAncestorChain(reader, reader.getParent(current), steps.slice(0, -1), scopeId)) {
      return true;
    }
    if (step.axis === "child") {
      return false;
    }
  }
  return false;
}
function matchChainFrom(reader, rootId, chain) {
  let contexts = [{ reader, rootId }];
  for (const step of chain.steps) {
    const nextContexts = [];
    for (const context of contexts) {
      for (const candidate of candidatesForStep(reader, context.rootId, step)) {
        const parent = reader.getParent(candidate);
        if (matchesStep(reader, candidate, step, { reader, rootId: context.rootId, parent })) {
          nextContexts.push({ reader, rootId: candidate, parent });
        }
      }
    }
    contexts = nextContexts;
    if (contexts.length === 0) {
      break;
    }
  }
  return contexts.map((context) => context.rootId);
}
function candidatesForStep(reader, rootId, step) {
  switch (step.axis) {
    case "self":
      return [rootId];
    case "child":
      return reader.getChildren(rootId);
    case "descendant":
      return descendants(reader, rootId);
    case "ancestor":
    case "closest-ancestor":
      return ancestors(reader, rootId, step.axis === "closest-ancestor");
    /* istanbul ignore next: exhaustive QueryAxis guard */
    default:
      return assertNever(step.axis);
  }
}
function descendants(reader, rootId) {
  const result = [];
  const queue = [...reader.getChildren(rootId)];
  for (let index = 0; index < queue.length; index++) {
    const node = queue[index];
    result.push(node);
    queue.push(...reader.getChildren(node));
  }
  return result;
}
function ancestors(reader, rootId, closestOnly) {
  const result = [];
  for (let parent = reader.getParent(rootId); parent !== void 0; parent = reader.getParent(parent)) {
    result.push(parent);
    if (closestOnly) {
      break;
    }
  }
  return result;
}
function matchesStep(reader, id, step, context) {
  return step.predicates.every((predicate) => matchesPredicate(reader, id, predicate, context));
}
function matchesPredicate(reader, id, predicate, context) {
  switch (predicate.kind) {
    case "any":
      return true;
    case "scope":
      return context.scopeMode === "parentless" ? context.reader.getParent(id) === void 0 : id === context.rootId;
    case "all-of":
      return predicate.predicates.every((child) => matchesPredicate(reader, id, child, context));
    case "any-of":
      return predicate.predicates.some((child) => matchesPredicate(reader, id, child, context));
    case "tag-equals":
      return tagEquals(reader.getTag(id), predicate.tag, predicate.normalizeModelTag);
    case "tag-one-of":
      return predicate.tags.some((tag) => tagEquals(reader.getTag(id), tag, predicate.normalizeModelTag));
    case "class-has":
      return reader.getClasses(id).includes(predicate.className);
    case "class-one-of":
      return predicate.classNames.some((className) => reader.getClasses(id).includes(className));
    case "class-starts-with":
      return reader.getClasses(id).some((className) => className.startsWith(predicate.prefix));
    case "class-not-starts-with":
      return reader.getClasses(id).every((className) => !className.startsWith(predicate.prefix));
    case "attribute-exists":
      return reader.getAttribute(id, predicate.name) !== void 0;
    case "attribute-equals":
      return literalEquals(reader.getAttribute(id, predicate.name), predicate.value);
    case "attribute-starts-with":
      return String(reader.getAttribute(id, predicate.name) ?? "").startsWith(predicate.prefix);
    case "config-exists":
      return reader.getConfig(id, predicate.name) !== void 0;
    case "config-equals":
      return literalEquals(reader.getConfig(id, predicate.name), predicate.value);
    case "node-type-equals":
      return nodeKindEquals(reader.getNodeKind(id), predicate.value);
    case "text-not-empty":
      return reader.getNodeKind(id) !== "text" || (reader.getContent(id)?.replace(/[\n\r\t\s]/gm, "").length ?? 0) > 0;
    case "content-equals":
      return reader.getContent(id) === predicate.value;
    case "content-contains":
      return reader.getContent(id)?.includes(predicate.value) ?? false;
    case "has-styles":
      return Object.keys(reader.getStyles(id) ?? {}).length > 0;
    case "not":
      return !matchesPredicate(reader, id, predicate.predicate, context);
    case "has":
      return matchChainFrom(reader, id, compileNestedChain(predicate.query)).length > 0;
    case "has-any":
      return predicate.queries.some((query) => matchChainFrom(reader, id, compileNestedChain(query)).length > 0);
    case "nth-child":
      return isNthChild(reader, id, context.parent, predicate.index);
    case "not-last-child":
      return isNotLastChild(reader, id, context.parent);
    case "not-last-element":
      return isNotLastElement(reader, id, context.parent);
    case "css-is-rule":
      return reader.getNodeKind(id) === "rule" || reader.getNodeKind(id) === "media";
    case "css-is-comment":
      return reader.getNodeKind(id) === "comment";
    case "css-property-exists":
      return reader.getCssPropertyName(id) === predicate.name || reader.getCssPropertyValue(id, predicate.name) !== void 0;
    case "css-rule-selector-equals":
      return cssEquals(reader.getCssSelector(id), predicate.selector, predicate.minifiedCompare);
    case "css-rule-selector-contains":
      return cssContains(reader.getCssSelector(id), predicate.selector, predicate.minifiedCompare);
    case "css-media-equals":
      return cssEquals(reader.getCssSelector(id), predicate.selector, predicate.minifiedCompare);
    case "css-media-contains":
      return reader.getCssSelector(id)?.includes(predicate.selector) ?? false;
    case "css-selector-pattern": {
      const patternError = getPortableRe2PatternError(predicate.pattern.source, predicate.pattern.flags);
      if (patternError) {
        throw new Error(patternError);
      }
      return new RegExp(predicate.pattern.source, predicate.pattern.flags).test(reader.getCssSelector(id) ?? "");
    }
    case "css-selector-regex":
      return predicate.patterns.some((pattern) => new RegExp(pattern.source, pattern.flags).test(reader.getCssSelector(id) ?? ""));
    /* istanbul ignore next: exhaustive Predicate guard */
    default:
      return assertNever(predicate);
  }
}
function compileNestedChain(chain) {
  return {
    steps: chain.steps.map((step) => ({
      axis: step.axis,
      predicates: step.compound.predicates
    }))
  };
}
function stepIsPureScope(step) {
  return step.predicates.length === 1 && predicateIsPureScope(step.predicates[0]);
}
function predicateIsPureScope(predicate) {
  switch (predicate.kind) {
    case "scope":
      return true;
    case "all-of":
      return predicate.predicates.length === 1 && predicateIsPureScope(predicate.predicates[0]);
    default:
      return false;
  }
}
function tagEquals(currentTag, expectedTag, shouldNormalizeModelTag) {
  const normalized = shouldNormalizeModelTag ? normalizeModelTag(currentTag) : currentTag ?? "";
  return normalized.toUpperCase() === expectedTag.toUpperCase();
}
function literalEquals(actual, expected) {
  if (typeof actual === "string" && typeof expected === "number") {
    return Number.parseFloat(actual) === expected;
  }
  if (typeof expected === "string") {
    return String(actual) === expected;
  }
  return actual === expected;
}
function nodeKindEquals(actual, expected) {
  const normalizedExpected = normalizeHtmlNodeTypeValue(expected);
  return normalizedExpected === void 0 ? literalEquals(actual, expected) : actual === normalizedExpected;
}
function normalizeHtmlNodeTypeValue(value) {
  switch (value) {
    case 1:
      return "element";
    case 3:
      return "text";
    case 8:
      return "comment";
    case 9:
      return "document";
    case 10:
      return "doctype";
    case 11:
      return "documentFragment";
    default:
      return void 0;
  }
}
function isNthChild(reader, id, parent, index) {
  if (parent === void 0) {
    return false;
  }
  return reader.getChildren(parent)[index - 1] === id;
}
function isNotLastChild(reader, id, parent) {
  if (parent === void 0) {
    return false;
  }
  const children = reader.getChildren(parent);
  return children.length > 0 && children[children.length - 1] !== id;
}
function isNotLastElement(reader, id, parent) {
  if (parent === void 0) {
    return false;
  }
  const children = reader.getChildren(parent).filter((child) => reader.getNodeKind(child) === "element" || reader.getTag(child) !== void 0);
  return children.length > 0 && children[children.length - 1] !== id;
}
function cssEquals(actual, expected, minifiedCompare) {
  return minifiedCompare ? normalizeCss(actual) === normalizeCss(expected) : actual === expected;
}
function cssContains(actual, expected, minifiedCompare) {
  if (!actual) {
    return false;
  }
  return minifiedCompare ? normalizeCss(actual).includes(normalizeCss(expected)) : actual.includes(expected);
}
function normalizeCss(value) {
  return (value ?? "").replace(/\n/g, " ").replace(/\s+/g, " ").replace(/\s*>\s*/g, ">").replace(/,\s/g, ",").trim();
}

// editor/ui-editor-ui/src/app/model-query/object-reader.ts
function createObjectQueryReader(getter, root, domain = "html") {
  const getterRecord = asRecord(getter);
  const fallbackParents = /* @__PURE__ */ new Map();
  let fallbackParentsBuilt = false;
  function readChildren(id) {
    return call(getterRecord, "getChildren", id) ?? [];
  }
  function readParent(id) {
    const parent = call(getterRecord, "getParent", id);
    if (parent !== void 0) {
      return parent;
    }
    buildFallbackParents();
    return fallbackParents.get(id);
  }
  function buildFallbackParents() {
    if (fallbackParentsBuilt) {
      return;
    }
    fallbackParentsBuilt = true;
    const queue = [root];
    for (let index = 0; index < queue.length; index++) {
      const parent = queue[index];
      for (const child of readChildren(parent)) {
        if (!fallbackParents.has(child)) {
          fallbackParents.set(child, parent);
          queue.push(child);
        }
      }
    }
  }
  return {
    getRootId() {
      return root;
    },
    getChildren(id) {
      return readChildren(id);
    },
    getParent(id) {
      return readParent(id);
    },
    getNodeKind(id) {
      if (call(getterRecord, "isComment", id) === true) {
        return "comment";
      }
      if (call(getterRecord, "isProperty", id) === true) {
        return "attr";
      }
      if (call(getterRecord, "isRule", id) === true) {
        const selector = readCssSelector(getterRecord, id);
        return selector?.trim().startsWith("@media") ? "media" : "rule";
      }
      return normalizeNodeKind(call(getterRecord, "getType", id) ?? callNode(id, "getType") ?? getProp(id, "type"), domain);
    },
    getTag(id) {
      return toStringOrUndefined(call(getterRecord, "getTag", id) ?? callNode(id, "getTag") ?? getProp(id, "tag"));
    },
    getClasses(id) {
      const classes = call(getterRecord, "getClasses", id) ?? callNode(id, "getClasses");
      if (classes instanceof Set) {
        return Array.from(classes).map(String);
      }
      if (Array.isArray(classes)) {
        return classes.map(String);
      }
      const attributes = getRecord(callNode(id, "getAttributes") ?? getProp(id, "attributes"));
      const classValue = attributes?.["class"];
      return typeof classValue === "string" ? classValue.split(/\s+/).filter(Boolean) : [];
    },
    getAttribute(id, name) {
      return toLiteral(
        call(getterRecord, "getAttributeValue", id, name) ?? callNode(id, "getAttribute", name) ?? getRecord(callNode(id, "getAttributes") ?? getProp(id, "attributes"))?.[name]
      );
    },
    getConfig(id, name) {
      return call(getterRecord, "getConfig", id, name) ?? callNode(id, "getNodeConfigProp", name) ?? getRecord(callNode(id, "getNodeConfig") ?? getProp(id, "config"))?.[name];
    },
    getContent(id) {
      return toStringOrUndefined(call(asRecord(getter), "getContent", id) ?? callNode(id, "getContent") ?? getProp(id, "content"));
    },
    getStyles(id) {
      return toStringRecord(call(getterRecord, "getStyles", id) ?? callNode(id, "getStyles") ?? getProp(id, "styles"));
    },
    getCssSelector(id) {
      return readCssSelector(getterRecord, id);
    },
    getCssPropertyName(id) {
      return toStringOrUndefined(
        call(getterRecord, "getPropertyName", id) ?? callNode(id, "getAttributeName") ?? getProp(id, "attributeName") ?? getProp(id, "attribute")
      );
    },
    getCssPropertyValue(id, name) {
      return toStringOrUndefined(call(getterRecord, "getPropertyValue", id, name) ?? propertyValueFromNode(id, name));
    }
  };
}
function asRecord(value) {
  return isRecord(value) ? value : {};
}
function call(target, methodName, ...args) {
  const method = target[methodName];
  return typeof method === "function" ? method.call(target, ...args) : void 0;
}
function callNode(target, methodName, ...args) {
  if (!isRecord(target)) {
    return void 0;
  }
  return call(target, methodName, ...args);
}
function getProp(target, property) {
  return isRecord(target) ? target[property] : void 0;
}
function getRecord(value) {
  return isRecord(value) ? value : void 0;
}
function isRecord(value) {
  return typeof value === "object" && value !== null;
}
function toStringOrUndefined(value) {
  return value === void 0 || value === null ? void 0 : String(value);
}
function normalizeNodeKind(value, domain) {
  if (domain === "html") {
    switch (value) {
      case 1:
        return "element";
      case 3:
        return "text";
      case 8:
        return "comment";
      case 9:
        return "document";
      case 10:
        return "doctype";
      case 11:
        return "documentFragment";
      default:
        return toStringOrUndefined(value);
    }
  }
  switch (value) {
    case 0:
      return "attr";
    case 1:
      return "comment";
    case 2:
      return "rule";
    case 3:
      return "media";
    default:
      return toStringOrUndefined(value);
  }
}
function readCssSelector(getterRecord, id) {
  return toStringOrUndefined(call(getterRecord, "getSelector", id) ?? callNode(id, "getSelector") ?? getProp(id, "selector"));
}
function toLiteral(value) {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean" ? value : void 0;
}
function toStringRecord(value) {
  const record = getRecord(value);
  if (!record) {
    return void 0;
  }
  const result = {};
  Object.entries(record).forEach(([key, item]) => {
    if (item !== void 0 && item !== null) {
      result[key] = String(item);
    }
  });
  return result;
}
function propertyValueFromNode(target, name) {
  const attrName = callNode(target, "getAttributeName") ?? getProp(target, "attributeName");
  if (attrName !== name) {
    return void 0;
  }
  return callNode(target, "getAttributeValue") ?? getProp(target, "attributeValue");
}

// editor/ui-editor-ui/src/app/model-query/formatter.ts
var identifierPattern = /^[a-zA-Z_][a-zA-Z0-9_-]*$/;
function assertNever2(value) {
  throw new Error("Unsupported predicate: ".concat(String(value)));
}
function formatCanonicalQuery(ast) {
  return ast.groups.map(formatChain).join(", ");
}
function formatChain(chain) {
  return chain.steps.map((step, index) => {
    const compound = formatCompound(step.compound.predicates);
    if (index === 0) {
      return step.axis === "child" ? "> ".concat(compound) : compound;
    }
    return "".concat(step.axis === "child" ? " > " : " ").concat(compound);
  }).join("");
}
function formatCompound(predicates) {
  return predicates.map(formatPredicate).join("");
}
function formatPredicate(predicate) {
  switch (predicate.kind) {
    case "any":
      return "*";
    case "scope":
      return ":scope";
    case "all-of":
      return predicate.predicates.map(formatPredicate).join("");
    case "any-of":
      return ":any-of(".concat(predicate.predicates.map(formatPredicate).join(","), ")");
    case "tag-equals":
      return predicate.normalizeModelTag && identifierPattern.test(predicate.tag) ? predicate.tag.toLowerCase() : ":tag-exact(".concat(formatIdentifierOrString(predicate.tag), ")");
    case "tag-one-of":
      return predicate.normalizeModelTag ? ":tag-one-of(".concat(formatString(predicate.tags.join("|")), ")") : ":tag-one-of-exact(".concat(formatString(predicate.tags.join("|")), ")");
    case "class-has":
      return formatClassSelector(predicate.className);
    case "class-one-of":
      return ":class-one-of(".concat(formatString(predicate.classNames.join("|")), ")");
    case "class-starts-with":
      return "[class*=".concat(formatString(predicate.prefix), "]");
    case "class-not-starts-with":
      return ":not-class-starts-with(".concat(formatString(predicate.prefix), ")");
    case "attribute-exists":
      return "[".concat(formatIdentifierOrString(predicate.name), "]");
    case "attribute-equals":
      return "[".concat(formatIdentifierOrString(predicate.name), "=").concat(formatLiteral(predicate.value), "]");
    case "attribute-starts-with":
      return "[".concat(formatIdentifierOrString(predicate.name), "^=").concat(formatString(predicate.prefix), "]");
    case "config-exists":
      return ":config-exists(".concat(formatIdentifierOrString(predicate.name), ")");
    case "config-equals":
      return ":config-equals(".concat(formatIdentifierOrString(predicate.name), ",").concat(formatLiteral(predicate.value), ")");
    case "node-type-equals":
      return ":node-type(".concat(formatLiteral(predicate.value), ")");
    case "text-not-empty":
      return ":text-not-empty";
    case "content-equals":
      return ":content-equals(".concat(formatString(predicate.value), ")");
    case "content-contains":
      return ":content-contains(".concat(formatString(predicate.value), ")");
    case "has-styles":
      return ":has-styles";
    case "not":
      return ":not(".concat(formatPredicate(predicate.predicate), ")");
    case "has":
      return ":has(".concat(formatChain(predicate.query), ")");
    case "has-any":
      return ":has(".concat(predicate.queries.map(formatChain).join(", "), ")");
    case "nth-child":
      return ":nth-child(".concat(predicate.index, ")");
    case "not-last-child":
      return ":not-last-child";
    case "not-last-element":
      return ":not-last-element";
    case "css-is-rule":
      return ":is-rule";
    case "css-is-comment":
      return ":is-comment";
    case "css-property-exists":
      return ":property-exists(".concat(formatIdentifierOrString(predicate.name), ")");
    case "css-rule-selector-equals":
      return ":rule-selector-equals(".concat(formatString(predicate.selector)).concat(predicate.minifiedCompare ? "" : ",false", ")");
    case "css-rule-selector-contains":
      return ":rule-selector-contains(".concat(formatString(predicate.selector)).concat(predicate.minifiedCompare ? "" : ",false", ")");
    case "css-media-equals":
      return ":media-equals(".concat(formatString(predicate.selector)).concat(predicate.minifiedCompare ? ",true" : "", ")");
    case "css-media-contains":
      return ":media-contains(".concat(formatString(predicate.selector), ")");
    case "css-selector-pattern":
      return formatPattern(predicate.pattern);
    case "css-selector-regex":
      return ":selector-regex(".concat(predicate.patterns.map((pattern) => formatString(pattern.source)).join(","), ")");
    /* istanbul ignore next: exhaustive Predicate guard */
    default:
      return assertNever2(predicate);
  }
}
function formatPattern(pattern) {
  const args = pattern.flags ? '"'.concat(pattern.syntax, '",').concat(formatString(pattern.source), ",").concat(formatString(pattern.flags)) : '"'.concat(pattern.syntax, '",').concat(formatString(pattern.source));
  return ":selector-pattern(".concat(args, ")");
}
function formatIdentifierOrString(value) {
  return identifierPattern.test(value) ? value : formatString(value);
}

// editor/ui-editor-ui/src/app/model-query/module-legacy-parser.ts
var unsupportedInternalPredicates = [
  ":config-exists",
  ":config-equals",
  ":node-type",
  ":has-one-of-classes",
  ":not-class-starts-with",
  ":tag-exact",
  ":has-styles",
  ":selector-regex",
  ":selector-pattern",
  ":rule-selector-equals",
  ":rule-selector-contains",
  ":media-equals",
  ":media-contains",
  ":property-exists",
  ":is-rule",
  ":is-comment"
];
function parseModuleLegacySelector(domain, selector) {
  const source = String(selector);
  const moduleSelector = moduleLegacy(source);
  if (unsupportedInternalPredicates.some((predicate) => source.includes(predicate)) || hasUnsupportedSiblingCombinator(source)) {
    return { selector: moduleSelector, ast: emptyModuleLegacyAst(domain), supported: false };
  }
  const ast = domain === "css" ? parseCssModuleLegacyQuery(source) : parseHtmlModuleLegacyQuery(source);
  if (!ast || ast.groups.length === 0) {
    return { selector: moduleSelector, ast: emptyModuleLegacyAst(domain), supported: false };
  }
  return { selector: moduleSelector, ast, supported: true };
}
function parseHtmlModuleLegacyQuery(source) {
  const groups = splitSelectorGroups(source);
  if (!groups || groups.length === 0) {
    return void 0;
  }
  const chains = groups.map((group) => new HtmlLegacyParser(group).parse());
  return chains.some((chain) => !chain) ? void 0 : { domain: "html", groups: chains };
}
function parseCssModuleLegacyQuery(source) {
  if (!isValidCssLegacySource(source)) {
    return void 0;
  }
  const groups = splitSelectorGroups(source);
  if (!groups || groups.length === 0) {
    return void 0;
  }
  const chains = groups.map((group) => new CssLegacyParser(group).parse());
  return chains.some((chain) => !chain) ? void 0 : { domain: "css", groups: chains };
}
function isValidCssLegacySource(source) {
  if (!source || source.replace(/\s/g, "").length === 0) {
    return false;
  }
  if (/^[>\s,]+$/.test(source) || /^[>\s,]/.test(source) || /[>\s,]$/.test(source)) {
    return false;
  }
  return !source.match(/>{2,}|,{2,}|>\s+>|,\s+,/);
}
var HtmlLegacyParser = class {
  constructor(source) {
    this.source = source;
    this.index = 0;
  }
  parse() {
    this.skipWhitespace();
    if (this.isEnd() || this.peek() === ">") {
      return void 0;
    }
    const firstPredicates = this.parseCompound();
    if (!firstPredicates) {
      return void 0;
    }
    const steps = [{
      axis: firstPredicates.some((predicate) => predicate.kind === "scope") ? "self" : "descendant",
      compound: { predicates: firstPredicates }
    }];
    for (; ; ) {
      const hadWhitespace = this.skipWhitespace();
      if (this.isEnd()) {
        return { steps };
      }
      let axis;
      if (this.peek() === ">") {
        axis = "child";
        this.index++;
        this.skipWhitespace();
      } else {
        if (!hadWhitespace) {
          return void 0;
        }
        axis = "descendant";
      }
      if (this.isEnd() || this.peek() === ">") {
        return void 0;
      }
      const predicates = this.parseCompound();
      if (!predicates) {
        return void 0;
      }
      steps.push({ axis, compound: { predicates } });
    }
  }
  parseCompound() {
    const predicates = [];
    while (!this.isEnd() && !this.isHtmlCombinator(this.peek())) {
      const predicate = this.parseSimpleSelector();
      if (!predicate) {
        return void 0;
      }
      predicates.push(predicate);
    }
    if (predicates.length > 0) {
      return predicates;
    }
    return void 0;
  }
  parseSimpleSelector() {
    const current = this.peek();
    if (current === "*") {
      this.index++;
      return { kind: "any" };
    }
    if (current === ".") {
      this.index++;
      const className = this.readName();
      return className ? { kind: "class-has", className } : void 0;
    }
    if (current === "#") {
      this.index++;
      const id = this.readName();
      return id ? { kind: "attribute-equals", name: "id", value: id } : void 0;
    }
    if (current === "[") {
      return this.parseAttributeSelector();
    }
    if (current === ":") {
      return this.parsePseudoSelector();
    }
    const tag = this.readName();
    return tag ? { kind: "tag-equals", tag, normalizeModelTag: true } : void 0;
  }
  parseAttributeSelector() {
    this.index++;
    this.skipWhitespace();
    const name = this.readUntil((char) => char === "]" || char === "=" || char === "*" || char === "^" || char === "~" || char === "$" || char === "|").trim();
    if (!name) {
      return void 0;
    }
    this.skipWhitespace();
    if (this.peek() === "]") {
      this.index++;
      return { kind: "attribute-exists", name };
    }
    let operator;
    if (this.source.startsWith("*=", this.index)) {
      operator = "*=";
      this.index += 2;
    } else if (this.peek() === "=") {
      operator = "=";
      this.index++;
    } else {
      return void 0;
    }
    this.skipWhitespace();
    const value = this.readAttributeValue();
    this.skipWhitespace();
    if (value === void 0 || this.peek() !== "]") {
      return void 0;
    }
    this.index++;
    if (operator === "=") {
      return { kind: "attribute-equals", name, value };
    }
    return name === "class" ? { kind: "class-starts-with", prefix: value } : { kind: "attribute-starts-with", name, prefix: value };
  }
  parsePseudoSelector() {
    this.index++;
    const name = this.readName();
    if (name === "scope") {
      return { kind: "scope" };
    }
    if (name === "not") {
      const content = this.readParenthesized();
      if (content === ":last-child") {
        return { kind: "not-last-child" };
      }
      if (content === ":last-element") {
        return { kind: "not-last-element" };
      }
      if (content?.startsWith(".")) {
        const className = content.slice(1);
        return className ? { kind: "not", predicate: { kind: "class-has", className } } : void 0;
      }
      const attributeName = content?.match(/^\[\s*([\w:-]+)\s*\]$/)?.[1];
      if (attributeName) {
        return { kind: "not", predicate: { kind: "attribute-exists", name: attributeName } };
      }
      return void 0;
    }
    if (name === "nth-child") {
      const content = this.readParenthesized();
      const index = Number(content);
      return Number.isInteger(index) && index > 0 ? { kind: "nth-child", index } : void 0;
    }
    return void 0;
  }
  readAttributeValue() {
    const quote = this.peek();
    if (quote === '"' || quote === "'") {
      this.index++;
      let value2 = "";
      while (!this.isEnd()) {
        const current = this.peek();
        if (current === quote) {
          this.index++;
          return value2;
        }
        if (current === "\\") {
          this.index++;
          if (this.isEnd()) {
            return void 0;
          }
        }
        value2 += this.peek();
        this.index++;
      }
      return void 0;
    }
    const value = this.readUntil((char) => char === "]").trim();
    return value || void 0;
  }
  readParenthesized() {
    this.skipWhitespace();
    if (this.peek() !== "(") {
      return void 0;
    }
    this.index++;
    const start = this.index;
    let depth = 1;
    while (!this.isEnd()) {
      const current = this.peek();
      if (current === "(") {
        depth++;
      } else if (current === ")") {
        depth--;
        if (depth === 0) {
          const content = this.source.slice(start, this.index).trim();
          this.index++;
          return content;
        }
      }
      this.index++;
    }
    return void 0;
  }
  readName() {
    return this.readUntil((char) => this.isHtmlCombinator(char) || char === "." || char === "#" || char === "[" || char === ":" || char === "(" || char === ")");
  }
  readUntil(stop) {
    const start = this.index;
    while (!this.isEnd() && !stop(this.peek())) {
      this.index++;
    }
    return this.source.slice(start, this.index);
  }
  skipWhitespace() {
    const start = this.index;
    while (!this.isEnd() && /\s/.test(this.peek())) {
      this.index++;
    }
    return this.index > start;
  }
  isHtmlCombinator(char) {
    return char === ">" || /\s/.test(char);
  }
  peek() {
    return this.source[this.index] ?? "";
  }
  isEnd() {
    return this.index >= this.source.length;
  }
};
var CssLegacyParser = class {
  constructor(source) {
    this.source = source;
    this.index = 0;
  }
  parse() {
    this.skipWhitespace();
    if (this.isEnd() || this.peek() === ">") {
      return void 0;
    }
    const first = this.parseToken();
    if (!first) {
      return void 0;
    }
    const steps = [{ axis: "descendant", compound: { predicates: [cssTokenToPredicate(first)] } }];
    for (; ; ) {
      const axis = this.readCombinator();
      if (axis === void 0) {
        return this.isEnd() ? { steps } : void 0;
      }
      const token = this.parseToken();
      if (!token) {
        return void 0;
      }
      steps.push({ axis, compound: { predicates: [cssTokenToPredicate(token)] } });
    }
  }
  parseToken() {
    this.skipWhitespace();
    if (this.source.startsWith("@*{", this.index)) {
      return this.parseBracedToken("@*{", "media-contains");
    }
    if (this.source.startsWith("@{", this.index)) {
      return this.parseBracedToken("@{", "media-exact");
    }
    if (this.source.startsWith("&*{", this.index)) {
      return this.parseBracedToken("&*{", "comment-contains");
    }
    if (this.source.startsWith("&{", this.index)) {
      return this.parseBracedToken("&{", "comment-exact");
    }
    if (this.peek() === "{") {
      return this.parseBracedToken("{", "property");
    }
    return this.parseRuleToken();
  }
  parseBracedToken(prefix, kind) {
    this.index += prefix.length;
    const start = this.index;
    while (!this.isEnd() && this.peek() !== "}") {
      this.index++;
    }
    if (this.isEnd()) {
      return void 0;
    }
    const value = this.source.slice(start, this.index);
    if (!value.trim()) {
      return void 0;
    }
    this.index++;
    return { kind, value };
  }
  parseRuleToken() {
    const start = this.index;
    while (!this.isEnd()) {
      const current = this.peek();
      if (current === "+" || current === "~" || current === ",") {
        return void 0;
      }
      if (current === ">" && this.isSpecialStart(this.nextNonWhitespace(this.index + 1))) {
        break;
      }
      if (/\s/.test(current) && this.isSpecialStart(this.nextNonWhitespace(this.index))) {
        break;
      }
      this.index++;
    }
    const value = this.source.slice(start, this.index).trim();
    if (!value || this.isSpecialStart(value[0]) || value.startsWith(":")) {
      return void 0;
    }
    return { kind: "rule", value };
  }
  readCombinator() {
    const hadWhitespace = this.skipWhitespace();
    if (this.isEnd()) {
      return void 0;
    }
    if (this.peek() === ">") {
      this.index++;
      this.skipWhitespace();
      return this.isEnd() ? void 0 : "child";
    }
    return hadWhitespace ? "descendant" : void 0;
  }
  nextNonWhitespace(start) {
    let i = start;
    while (i < this.source.length && /\s/.test(this.source[i])) {
      i++;
    }
    return this.source[i] ?? "";
  }
  isSpecialStart(char) {
    return char === "@" || char === "&" || char === "{";
  }
  skipWhitespace() {
    const start = this.index;
    while (!this.isEnd() && /\s/.test(this.peek())) {
      this.index++;
    }
    return this.index > start;
  }
  peek() {
    return this.source[this.index] ?? "";
  }
  isEnd() {
    return this.index >= this.source.length;
  }
};
function cssTokenToPredicate(token) {
  switch (token.kind) {
    case "media-exact":
      return { kind: "css-media-equals", selector: "@".concat(token.value), minifiedCompare: false };
    case "media-contains":
      return { kind: "css-media-contains", selector: token.value };
    case "comment-exact":
      return { kind: "content-equals", value: token.value };
    case "comment-contains":
      return { kind: "content-contains", value: token.value };
    case "property":
      return { kind: "css-property-exists", name: token.value };
    case "rule":
      return token.value.startsWith("*") && token.value.length > 1 ? { kind: "css-rule-selector-contains", selector: token.value.slice(1), minifiedCompare: false } : { kind: "css-rule-selector-equals", selector: token.value, minifiedCompare: true };
  }
  throw new Error("Unsupported CSS legacy token: ".concat(token.kind));
}
function splitSelectorGroups(source) {
  const groups = [];
  let quote;
  let bracketDepth = 0;
  let parenDepth = 0;
  let braceDepth = 0;
  let start = 0;
  for (let i = 0; i < source.length; i++) {
    const current = source[i];
    if (quote) {
      if (current === quote && source[i - 1] !== "\\") {
        quote = void 0;
      }
      continue;
    }
    if (current === '"' || current === "'") {
      quote = current;
      continue;
    }
    if (current === "[") {
      bracketDepth++;
      continue;
    }
    if (current === "]") {
      bracketDepth = Math.max(bracketDepth - 1, 0);
      continue;
    }
    if (current === "(") {
      parenDepth++;
      continue;
    }
    if (current === ")") {
      parenDepth = Math.max(parenDepth - 1, 0);
      continue;
    }
    if (current === "{") {
      braceDepth++;
      continue;
    }
    if (current === "}") {
      braceDepth = Math.max(braceDepth - 1, 0);
      continue;
    }
    if (current === "," && bracketDepth === 0 && parenDepth === 0 && braceDepth === 0) {
      const group = source.slice(start, i).trim();
      if (!group) {
        return void 0;
      }
      groups.push(group);
      start = i + 1;
    }
  }
  if (quote || bracketDepth !== 0 || parenDepth !== 0 || braceDepth !== 0) {
    return void 0;
  }
  const lastGroup = source.slice(start).trim();
  if (!lastGroup) {
    return void 0;
  }
  groups.push(lastGroup);
  return groups;
}
function emptyModuleLegacyAst(domain) {
  return { domain, groups: [] };
}
function hasUnsupportedSiblingCombinator(selector) {
  let quote;
  let depth = 0;
  for (let i = 0; i < selector.length; i++) {
    const current = selector[i];
    if (quote) {
      if (current === quote && selector[i - 1] !== "\\") {
        quote = void 0;
      }
      continue;
    }
    if (current === '"' || current === "'") {
      quote = current;
      continue;
    }
    if (current === "[" || current === "(" || current === "{") {
      depth++;
      continue;
    }
    if (current === "]" || current === ")" || current === "}") {
      depth = Math.max(depth - 1, 0);
      continue;
    }
    if (depth === 0 && (current === "+" || current === "~")) {
      return true;
    }
  }
  return false;
}

// editor/ui-editor-ui/src/app/model-query/port-query.ts
function toCanonicalPortQuery(domain, selectors) {
  const selectorGroups = Array.isArray(selectors) ? selectors : [selectors];
  const queries = [];
  for (const selector of selectorGroups) {
    if (getQueryDialect(selector) === "canonical") {
      queries.push(String(selector));
      continue;
    }
    const parsed = parseModuleLegacySelector(domain, selector);
    if (!parsed.supported) {
      return void 0;
    }
    queries.push(formatCanonicalQuery(parsed.ast));
  }
  return queries.length === 0 ? void 0 : queries.join(", ");
}

// editor/ui-editor-ui/src/app/model-query/query-children.ts
function isEmptyObject(obj) {
  if (obj === void 0 || obj === null) {
    return true;
  }
  return Object.keys(obj).length === 0 && Object.getPrototypeOf(obj) === Object.prototype;
}
function queryRootsChildren(getter, roots, selectors, stopOnFirst, domain = "html") {
  const result = /* @__PURE__ */ new Set();
  const query = toCanonicalPortQuery(domain, selectors);
  if (query === void 0) {
    return [];
  }
  const plan = compileQueryAst(parseCanonicalQuery(domain, query));
  for (const root of roots) {
    if (isEmptyObject(root)) {
      continue;
    }
    const reader = createObjectQueryReader(getter, root, domain);
    const queryResult = executeQuery({
      plan,
      reader,
      fromId: root,
      mode: stopOnFirst ? "first" : "all"
    });
    for (const id of queryResult.ids) {
      result.add(id);
      if (stopOnFirst) {
        return Array.from(result);
      }
    }
  }
  return Array.from(result.values());
}

// editor/ui-editor-ui/src/app/tools/value-accessors/HtmlObject/query/query-children.ts
function queryHtmlObjectChildren(root, selectors, stopOnFirst) {
  return queryHtmlObjectsChildren([root], selectors, stopOnFirst);
}
function queryHtmlObjectFirstChild(root, selectors) {
  const result = queryHtmlObjectChildren(root, selectors, true);
  return result.length > 0 ? result[0] : void 0;
}
function queryHtmlObjectsChildren(roots, selectors, stopOnFirst) {
  return queryRootsChildren(HtmlObjectGetter, roots, selectors, stopOnFirst);
}

// editor/ui-editor-ui/src/app/constants/className.constants.ts
var ESDEV_MSO_CLASS_TABLE = "esdev-mso-table";
var ESDEV_MSO_CLASS_TD = "esdev-mso-td";
var ES_HIDDEN_CLASS = "es-hidden";
var ESD_EMPTY_CONTAINER_CLASS = "esd-empty-container";
var AMP_ACCORDION_EMPTY_CONTAINER_CLASS = "esd-amp-accordion-container";
var ES_M_WIDTH_0_CLASS = "es-m-w0";
var AMP_FORM_START_AGAIN_CLASS = "esd-block-amp-form-start-again";

// editor/ui-editor-ui/src/app/constants/css.constants.ts
var CSS_MOBILE_MEDIA_SELECTOR = "@media only screen and (max-width: 600px)";
var CSS_IMPORTANT_COMMENT_BLOCK_SELECTOR = "IMPORTANT THIS STYLES MUST BE ON FINAL EMAIL";
var CSS_IMPORTANT_COMMENT_BLOCK_END_SELECTOR = "END OF IMPORTANT";

// editor/ui-editor-ui/src/app/constants/node-selectors.constants.ts
var SELECTABLE_DEFAULT_BLOCK_DOM_SELECTOR = ".default-block-component.selectable:not(.hidden-by-view-options)";
var CHILDREN_WITH_TABLE_TAG = [
  q.select.children().root().next(q.select.children().tag("TABLE" /* TABLE */)).end(),
  q.select.children().root().next(
    q.select.children().tag("A" /* A */).hasClass("es-module-link").next(q.select.children().tag("TABLE" /* TABLE */))
  ).end()
];
var CHILDREN_WITH_TR_TAG = [q.select.children().root().next(q.select.children().tag("TR" /* TR */)).end()];
var TABLE_SELECTOR = [q.select.descendants().tag("TABLE" /* TABLE */).end()];
var TBODY_SELECTOR = [q.select.descendants().tag("TBODY" /* TBODY */).end()];
var TD_SELECTOR = [q.select.descendants().tag("TD" /* TD */).end()];
var CHILD_TD_SELECTOR = [q.select.children().tag("TD" /* TD */).end()];
var TR_SELECTOR = [q.select.descendants().tag("TR" /* TR */).end()];
var LISTS_SELECTOR = [q.select.descendants().tag("UL" /* UL */).end(), q.select.descendants().tag("OL" /* OL */).end()];
var LIST_ITEM_SELECTOR = [q.select.descendants().tag("LI" /* LI */).end()];
var P_SELECTOR = [q.select.descendants().tag("P" /* P */).end()];
var HEAD_SELECTOR = [q.select.descendants().tag("HEAD" /* HEAD */).end()];
var A_SELECTOR = [q.select.descendants().tag("A" /* A */).end()];
var A_NOT_ANCHOR_SELECTOR = [q.select.descendants().tag("A" /* A */).notHasClass(ESD_ANCHOR).end()];
var ANCHOR_SELECTOR = [q.select.descendants().hasClass(ESD_ANCHOR).end()];
var IMG_SELECTOR = [q.select.descendants().tag("IMG" /* IMG */).end()];
var IMG_OR_BANNER_SELECTOR = [q.select.descendants().tag(["IMG" /* IMG */, "BANNER"]).end()];
var BANNER_NODE = [q.select.descendants().tag("banner").end()];
var HTML_SELECTOR = [q.select.descendants().tag("HTML" /* HTML */).end()];
var BODY_SELECTOR = [q.select.descendants().tag("BODY" /* BODY */).end()];
var EMPTY_CONTAINER_SELECTOR = [q.select.descendants().hasClass(ESD_EMPTY_CONTAINER_CLASS).end()];
var SPACER_BLOCK = [q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers[DefaultBlock.BLOCK_SPACER]).end()];
var VIDEO_BLOCK = [q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers[DefaultBlock.BLOCK_VIDEO]).end()];
var VIDEO_BLOCK_IMAGE = [q.select.descendants().tag("TD" /* TD */).hasClass("esd-block-video").next(q.select.children().tag("A" /* A */).next(q.select.children().tag("IMG" /* IMG */))).end()];
var IMAGE_BLOCK_SELECTOR = [q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers[DefaultBlock.BLOCK_IMAGE]).end()];
var BANNER_BLOCK = [q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers[DefaultBlock.BLOCK_BANNER]).end()];
var BUTTON_BLOCK_SELECTOR = [q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers[DefaultBlock.BLOCK_BUTTON]).end()];
var HTML_BLOCK_SELECTOR = [q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers[DefaultBlock.BLOCK_HTML]).end()];
var TEXT_BLOCK = [q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers[DefaultBlock.BLOCK_TEXT]).end()];
var CUSTOM_TEXT_BLOCK = [q.select.descendants().hasClass(customBlockMarkers[CustomBlocks.CUSTOM_BLOCK_TEXT]).end()];
var SOCIAL_BLOCK_ICONS_SELECTOR = [
  q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers[DefaultBlock.BLOCK_SOCIAL]).next(
    q.select.descendants().tag("TD" /* TD */)
  ).end()
];
var CONTAINER_BLOCK_SELECTOR_TABLE = [
  q.select.descendants().hasClass(defaultBlocksMarkers[ComplexBlock.CONTAINER]).next(q.select.children().tag("TABLE" /* TABLE */)).end(),
  q.select.descendants().hasClass(defaultBlocksMarkers[ComplexBlock.CONTAINER]).next(q.select.children().tag("A" /* A */).hasClass("es-module-link").next(q.select.children().tag("TABLE" /* TABLE */))).end()
];
var SOCIAL_BLOCK = [
  q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers[DefaultBlock.BLOCK_SOCIAL]).end()
];
var PARENT_TABLE_CONTAINER_SELECTOR = [
  q.select.children().root().next(q.select.children().tag("TABLE" /* TABLE */)).end(),
  q.select.children().root().next(q.select.children().tag("A" /* A */).hasClass("es-module-link").next(q.select.children().tag("TABLE" /* TABLE */))).end()
];
var CONTAINER_BLOCK_SELECTOR = [q.select.descendants().hasClass(defaultBlocksMarkers[ComplexBlock.CONTAINER]).end()];
var STRUCTURE_BLOCK_SELECTOR = [q.select.descendants().hasClass(defaultBlocksMarkers[ComplexBlock.STRUCTURE]).end()];
var STRIPE_BLOCK_SELECTOR = [q.select.descendants().hasClass(defaultBlocksMarkers[ComplexBlock.STRIPE]).end()];
var MOBILE_GAP_NOT_RESPONSIVE = [q.select.descendants().hasClass(ES_M_WIDTH_0_CLASS).end()];
var ES_INFOBLOCK_SELECTOR = [q.select.descendants().hasClass("es-infoblock").end()];
var TEXT_IMAGE = [q.select.descendants().tag("TEXT_IMAGE" /* TEXT_IMAGE */).end()];
var TEXT_IMAGE_ATTRIBUTE = [q.select.descendants().hasAttr(customBlockMarkers["TEXT_IMAGE" /* TEXT_IMAGE */]).end()];
var TEXT_NODE_SELECTOR = [q.select.descendants().nodeType(3 /* TEXT_NODE */).end()];
var QUERY_HTML_NODE_TEXT_NODE_SELECTOR = [q.select.descendants().nodeType("text").end()];
var CHILDREN_MSO_COMMENTS = [q.select.children().root().next(q.select.children().contentContains("[if mso]>")).end()];
var ES_HIDDEN_NODE = [q.select.descendants().tag("TD" /* TD */).hasClass(ES_HIDDEN_CLASS).end()];
var CHILDREN_ESD_BLOCKS_SELECTOR = [q.select.children().root().next(q.select.children().classStartsWith("esd-block-")).end()];
var CHILDREN_TD_SELECTOR = [q.select.children().root().next(q.select.children().tag("TD" /* TD */)).end()];
var ampFormSubmitMarker = structuralNodeMarkers["AMP_FORM_SUBMIT" /* AMP_FORM_SUBMIT */];
if (!ampFormSubmitMarker) {
  throw new Error("structuralNodeMarkers is missing the required AMP_FORM_SUBMIT entry");
}
var AMP_FORM_SUBMIT_CLASS = ampFormSubmitMarker.clss;
var ESD_BLOCKS_SELECTOR = [q.select.descendants().classStartsWith("esd-block-").end()];
var ESD_AMP_BLOCKS_SELECTOR = [q.select.descendants().classStartsWith("esd-amp-").end()];
var ESD_AMP_FORM_BLOCKS_SELECTOR = [q.select.descendants().classStartsWith("esd-block-amp-form").end()];
var AMP_STEP_FORM = [q.select.descendants().tag("FORM" /* FORM */).end()];
var AMP_FORM_INPUT_AREA_SELECTOR = [q.select.descendants().hasClass("esd-amp-form-input-area").end()];
var AMP_FORM_INPUT_TD_SELECTOR = [q.select.descendants().hasClass("esd-block-amp-form-input-text").end()];
var AMP_FORM_INPUT_HIDDEN_TD_SELECTOR = [q.select.descendants().hasClass("esd-block-amp-form-input-hidden").end()];
var AMP_FORM_NOTIFICATION_SELECTOR = [q.select.descendants().hasClass("esd-amp-form-notification").end()];
var AMP_FORM_WITH_ID = [q.select.descendants().tag("FORM" /* FORM */).hasAttr("id").end()];
var AMP_INPUT_SELECTOR = [q.select.descendants().tag("INPUT").end(), q.select.descendants().tag("TEXTAREA").end()];
var AMP_LABEL_SELECTOR = [q.select.descendants().tag("LABEL").end()];
var SPAN = [q.select.descendants().tag("SPAN").end()];
var AMP_SUBMIT_SELECTOR = [q.select.descendants().hasClass(AMP_FORM_SUBMIT_CLASS).end()];
var AMP_FORM_VISIBLE_WHEN_INVALID = [q.select.descendants().hasAttr("visible-when-invalid").end()];
var AMP_START_AGAIN_SELECTOR = [q.select.descendants().hasClass(AMP_FORM_START_AGAIN_CLASS).end()];
var AMP_START_AGAIN_BUTTON_SELECTOR = [q.select.descendants().hasClass(AMP_FORM_START_AGAIN_CLASS).next(q.select.descendants().tag("BUTTON")).end()];
var AMP_SUCCESS_SELECTOR = [q.select.descendants().hasAttr("submit-success").end()];
var AMP_FORM_SUBMIT_IMG_SELECTOR = [
  q.select.descendants().hasClass(AMP_FORM_SUBMIT_CLASS).next(q.select.descendants().tag("IMG" /* IMG */)).end()
];
var AMP_FORM_START_AGAIN_IMG_SELECTOR = [q.select.descendants().hasClass(AMP_FORM_START_AGAIN_CLASS).next(q.select.descendants().tag("IMG" /* IMG */)).end()];
var ESD_BLOCKS_SELECTOR_WITHOUT_MENU_ITEMS = [
  q.select.descendants().classStartsWith("esd-block-").notHasClass("esd-block-menu-item").notHasClass(AMP_FORM_SUBMIT_CLASS).end()
];
var HIDDEN_ON_DESKTOP = [q.select.descendants().configEquals("deskHidden", true).end()];
var HIDDEN_ON_MOBILE = [q.select.descendants().configEquals("mobileHidden", true).end()];
var MIME_TYPE_SELECTOR = [q.select.descendants().configExists("mimeType").end()];
var DISPLAY_CONDITIONS_SELECTOR = [q.select.descendants().configExists("displayCondition").end()];
var ESD_BLOCKS_TEXT = [q.select.descendants().hasClass(ESD_BLOCK_TEXT).end()];
var ANY_SELECTOR = [q.select.descendants().any().end()];
var STRUCTURE_NOT_EXTENSION_CLASS_SELECTOR = [q.select.descendants().hasClass("esd-structure").notHasClass("esd-extension-internal-block").end()];
var CONTAINER_NOT_EXTENSION_CLASS_SELECTOR = [q.select.descendants().hasClass("esd-structure").notHasClass("esd-extension-internal-block").end()];
var CONTAINER_WITH_DROPZONE = q.select.descendants().hasClass("esd-container-frame").notHasClass("esd-extension-internal-block").next(q.select.descendants().tag("table").hasClass("esd-insideblock-dropzone"));
var BLOCK_DROPPABLE_COMPONENT_SELECTOR = [CONTAINER_WITH_DROPZONE.next(q.select.descendants().tag("table")).next(q.select.descendants().tag("tbody")).end()];
var BLOCK_INSIDE_BLOCK_DROPPABLE_ELEMENT = [CONTAINER_WITH_DROPZONE.next(q.select.descendants().tag("table").hasClass("esd-insideblock-dropzone").next(q.select.descendants().tag("tbody"))).end()];
var ESDEV_MSO_TD_SELECTOR = [q.select.descendants().hasClass(ESDEV_MSO_CLASS_TD).next(q.select.children().tag("TABLE" /* TABLE */)).end()];
var ESDEV_MSO_CLASS_TD_SELECTOR = [q.select.descendants().hasClass(ESDEV_MSO_CLASS_TD).end()];
var ESDEV_MSO_CLASS_TABLE_SELECTOR = [q.select.descendants().hasClass(ESDEV_MSO_CLASS_TABLE).end()];
var ESDEV_MSO_CLASS_TABLE_TR = [q.select.descendants().hasClass(ESDEV_MSO_CLASS_TABLE).next(q.select.descendants().tag("TR" /* TR */)).end()];
var TABLE_FIRST_TR_SELECTOR = [q.select.descendants().tag("TBODY" /* TBODY */).next(q.select.children().tag("TR" /* TR */)).end()];
var MENU_ITEM_IMAGE_SELECTOR = [q.select.descendants().tag("A" /* A */).next(q.select.children().tag("IMG" /* IMG */)).end()];
var MENU_ITEM_IMAGE_SELECTOR_WITH_INDENT = [
  q.select.descendants().tag("A" /* A */).next(q.select.children().tag("IMG" /* IMG */).classStartsWith("es-p")).end()
];
var MENU_ITEM_TEXT_SELECTOR = [q.select.descendants().nodeType("text").end()];
var MENU_ITEM_BR_SELECTOR = [q.select.descendants().tag("BR" /* BR */).end()];
var MENU_ITEMS_SELECTOR = [q.select.descendants().tag("TABLE" /* TABLE */).next(q.select.descendants().tag("TR" /* TR */).next(q.select.children().tag("TD" /* TD */))).end()];
var MENU_TABLE_SELECTOR = [q.select.descendants().tag("TABLE" /* TABLE */).hasClass("es-menu").end()];
var MENU_BLOCK_SELECTOR = [q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers[DefaultBlock.BLOCK_MENU]).end()];
var MENU_ITEM_SELECTOR = [q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers[DefaultBlock.BLOCK_MENU_ITEM]).end()];
var BLOCKS_SELECTOR = [
  q.select.descendants().classStartsWith("esd-block-").notHasClass("esd-block-menu-item").notHasClass(AMP_FORM_SUBMIT_CLASS).end()
];
var NON_ANCHOR_LINK_SELECTOR = [q.select.descendants().hasClass("esd-block-image").next(q.select.children().tag("a").notHasClass("esd-anchor")).end()];
var ROLLOVER_IMAGE_SELECTOR = [q.select.descendants().tag("img").hasClass("rollover-second").end()];
var AMP_ROLLOVER_SELECTOR = [q.select.descendants().hasClass("rollover-amp").end()];
var STRIPE_SELECTOR = [q.select.descendants().hasClass(defaultBlocksMarkers[ComplexBlock.STRIPE]).end()];
var STRIPE_SELECTOR_WITH_HIDDEN_CONFIG = [
  q.select.descendants().hasClass(defaultBlocksMarkers[ComplexBlock.STRIPE]).configExists("deskHidden").end(),
  q.select.descendants().hasClass(defaultBlocksMarkers[ComplexBlock.STRIPE]).configExists("mobileHidden").end()
];
var STRUCTURE_SELECTOR = [q.select.descendants().hasClass(defaultBlocksMarkers[ComplexBlock.STRUCTURE]).end()];
var DIV_SELECTOR = [q.select.descendants().tag("DIV" /* DIV */).end()];
var AMP_FORM_SELECTOR = [q.select.descendants().hasClass(defaultBlocksMarkers[DefaultBlock.BLOCK_AMP_FORM]).end()];
var AMP_FORM_INNER_FORM_SELECTOR = [q.select.descendants().hasClass(defaultBlocksMarkers[DefaultBlock.BLOCK_AMP_FORM]).next(q.select.children().tag("FORM" /* FORM */)).end()];
var FORM_CHILD_TR_WITH_ID = [q.select.descendants().tag("FORM" /* FORM */).next(q.select.descendants().hasAttr("id").tag("TR" /* TR */)).end()];
var AMP_ACCORDION_SELECTOR = [q.select.descendants().hasClass(defaultBlocksMarkers[DefaultBlock.BLOCK_AMP_ACCORDION]).end()];
var AMP_ACCORDION_BODY_SELECTOR = [q.select.descendants().hasClass("accordion").end()];
var AMP_ACCORDION_TITLE_SELECTOR = [q.select.descendants().hasClass("section-title").end()];
var AMP_CAROUSEL_SELECTOR = [q.select.descendants().hasClass(defaultBlocksMarkers[DefaultBlock.BLOCK_AMP_CAROUSEL]).end()];
var AMP_CAROUSEL_INNER = [q.select.descendants().tag("AMP-CAROUSEL" /* AMP_CAROUSEL */).end()];
var AMP_CAROUSEL_AMP_IMG = [q.select.descendants().next(q.select.descendants().tag("AMP-CAROUSEL" /* AMP_CAROUSEL */).next(q.select.descendants().tag("AMP-IMG" /* AMP_IMG */))).end()];
var AMP_CAROUSEL_ELEMENT_SELECTOR = [q.select.descendants().tag("amp-carousel").end()];
var AMP_CAROUSEL_PREVIEW_SELECTOR = [q.select.descendants().hasClass("carousel-preview").end()];
var AMP_ACCORDION_EMPTY_CONTAINER_SELECTOR = [q.select.descendants().hasClass(AMP_ACCORDION_EMPTY_CONTAINER_CLASS).end()];
var ESD_EMAIL_PADDINGS_SELECTOR = [q.select.descendants().hasClass("esd-email-paddings").end()];
var AMP_BLOCK_SELECTORS = [...AMP_FORM_SELECTOR, ...AMP_ACCORDION_SELECTOR, ...AMP_CAROUSEL_SELECTOR];
var CONTAINER_TABLE_SELECTOR = [
  q.select.descendants().hasClass(defaultBlocksMarkers[ComplexBlock.CONTAINER]).next(q.select.children().tag("TABLE" /* TABLE */)).end(),
  q.select.descendants().hasClass(defaultBlocksMarkers[ComplexBlock.CONTAINER]).next(q.select.children().tag("A" /* A */).hasClass("es-module-link").next(q.select.children().tag("TABLE" /* TABLE */))).end()
];
var SECTION_SELECTOR = [q.select.descendants().tag("SECTION" /* SECTION */).end()];
var CONTENT_BODY_SELECTOR = [q.select.descendants().hasClass("es-content-body").end()];
var HEADER_BODY_SELECTOR = [q.select.descendants().hasClass("es-header-body").end()];
var FOOTER_BODY_SELECTOR = [q.select.descendants().hasClass("es-footer-body").end()];
var STRIPE_BODY_SELECTOR = [
  ...CONTENT_BODY_SELECTOR,
  ...HEADER_BODY_SELECTOR,
  ...FOOTER_BODY_SELECTOR
];
var TIMER_BLOCK_SELECTOR = [q.select.descendants().hasClass("esd-block-timer").end()];
var LINK_TAG_SELECTOR = [q.select.descendants().tag("LINK" /* LINK */).end()];
var ESD_BLOCK_CONFIG_TAG = "esd-config-block";
var ESD_CONFIG_BLOCK_VARIABLES_ATTRIBUTE_NAME = "variables";
var ESD_CONFIG_BLOCK_VARIABLES_SELECTOR = q.select.descendants().tag(ESD_BLOCK_CONFIG_TAG).hasAttr(ESD_CONFIG_BLOCK_VARIABLES_ATTRIBUTE_NAME).end();
var ESD_CALENDAR_EVENT_TAG = "esd-calendar-event";
var ESD_CALENDAR_EVENT_UUID_ATTRIBUTE = "uuid";
var ESD_CALENDAR_EVENT_DATA_ATTRIBUTE = "data-event";
var ESD_CALENDAR_EVENT_SELECTOR = [q.select.descendants().tag(ESD_CALENDAR_EVENT_TAG, false).end()];
var CALENDAR_EVENT_LINK_UUID_ATTRIBUTE = "esd-calendar-event-uuid";
var CALENDAR_EVENTS_ATTRIBUTE = "esd-calendar-events";
var CALENDAR_EVENTS_BLOCK_SELECTOR = [q.select.descendants().configExists("calendarEvents").end()];
var CALENDAR_EVENT_BOUND_LINK_SELECTOR = [
  q.select.descendants().tag("A" /* A */).hasAttr(CALENDAR_EVENT_LINK_UUID_ATTRIBUTE).end()
];
var START_COMMENT_OF_IMPORTANT_SECTION_SELECTOR = [
  q.select.descendants().isComment().contentContains(CSS_IMPORTANT_COMMENT_BLOCK_SELECTOR).end()
];
var END_COMMENT_OF_IMPORTANT_SECTION_SELECTOR = [
  q.select.descendants().isComment().contentContains(CSS_IMPORTANT_COMMENT_BLOCK_END_SELECTOR).end()
];
var COMMENT_SELECTOR = [q.select.descendants().isComment().end()];
var ES_WRAPPER_SELECTOR = [q.select.descendants().hasClass("es-wrapper").end()];
var ES_WRAPPER_COLOR_SELECTOR = [q.select.descendants().hasClass("es-wrapper-color").end()];
var ES_WRAPPER__FIRST_LEVEL_TABLE_SELECTOR = [
  q.select.descendants().next(q.select.children().tag("TBODY" /* TBODY */).next(
    q.select.children().tag("TR" /* TR */).next(q.select.children().tag("TD" /* TD */).next(q.select.children().tag("TABLE" /* TABLE */)))
  )).end()
];
var ESD_BLOCK_BUTTON_SELECTOR = [q.select.descendants().hasClass("esd-block-button").end()];
var BUTTON_BORDER_SELECTOR = [q.select.descendants().hasClass("es-button-border").end()];
var ES_LINK_SELECTOR = [q.select.descendants().hasClass("es-button").end()];
function getBodyFromHtml(html) {
  return queryHtmlObjectFirstChild(html, BODY_SELECTOR);
}
function getHtmlFromHtml(html) {
  return queryHtmlObjectFirstChild(html, HTML_SELECTOR);
}
var AMP_IMAGE_SELECTOR = [q.select.descendants().tag("AMP-IMG" /* AMP_IMG */).end()];
var AMP_CAROUSEL_PREVIEW = [q.select.descendants().tag("DIV" /* DIV */).hasClass("carousel-preview").end()];
var CAROUSEL_SELECTOR = [q.select.descendants().tag("AMP-CAROUSEL" /* AMP_CAROUSEL */).end()];
var CAROUSEL_PREVIEW_SELECTOR = [q.select.descendants().tag("AMP-SELECTOR" /* AMP_SELECTOR */).end()];
var FORM_SELECTOR = [q.select.descendants().tag("FORM" /* FORM */).end()];
var ESD_HIDDEN_PREHEADER_SELECTOR = [q.select.descendants().hasClass("esd-hidden-preheader").end()];
var MEDIA_SELECTOR = q.select.descendants().selectorEquals(CSS_MOBILE_MEDIA_SELECTOR).end();
function getMobileSelector(selector) {
  return q.select.descendants().selectorEquals(CSS_MOBILE_MEDIA_SELECTOR).next(selector).end();
}
var TITLE_SELECTOR = [q.select.descendants().tag("title").end()];
var IMAGE_TAG_SELECTOR = [q.select.descendants().tag("IMG" /* IMG */).notHasClass("rollover-second").end()];
var EXTENSION_BLOCK_SELECTOR = [q.select.descendants().hasAttr(extensionBlockIDAttr).end()];
function getNodeByConfigSelector(configName, configValue) {
  return q.select.descendants().configEquals(configName, configValue).end();
}
function getNodeByConfigExistsSelector(configName) {
  return q.select.descendants().configExists(configName).end();
}
var PARAGRAPHS_SELECTORS = [
  q.select.descendants().tag("P" /* P */).end(),
  q.select.descendants().tag("H1" /* H1 */).end(),
  q.select.descendants().tag("H2" /* H2 */).end(),
  q.select.descendants().tag("H3" /* H3 */).end(),
  q.select.descendants().tag("H4" /* H4 */).end(),
  q.select.descendants().tag("H5" /* H5 */).end(),
  q.select.descendants().tag("H6" /* H6 */).end()
];
var SELECTORS_FOR_AXE_CORE_MAP_ID = [q.select.descendants().nodeType("doctype").end(), q.select.descendants().nodeType("element").end()];
var LANG_SELECTOR = [q.select.descendants().hasAttr("lang").end()];
var AXE_ISSUE_IGNORED_SELECTOR = [q.select.descendants().configExists("accessibility").end()];
var ELEMENT_NODE_SELECTOR = [q.select.descendants().nodeType("element").end()];

export {
  SELECTABLE_DEFAULT_BLOCK_DOM_SELECTOR,
  CHILDREN_WITH_TABLE_TAG,
  CHILDREN_WITH_TR_TAG,
  TABLE_SELECTOR,
  TBODY_SELECTOR,
  TD_SELECTOR,
  CHILD_TD_SELECTOR,
  TR_SELECTOR,
  LISTS_SELECTOR,
  LIST_ITEM_SELECTOR,
  P_SELECTOR,
  HEAD_SELECTOR,
  A_SELECTOR,
  A_NOT_ANCHOR_SELECTOR,
  ANCHOR_SELECTOR,
  IMG_SELECTOR,
  IMG_OR_BANNER_SELECTOR,
  BANNER_NODE,
  HTML_SELECTOR,
  BODY_SELECTOR,
  EMPTY_CONTAINER_SELECTOR,
  SPACER_BLOCK,
  VIDEO_BLOCK,
  VIDEO_BLOCK_IMAGE,
  IMAGE_BLOCK_SELECTOR,
  BANNER_BLOCK,
  BUTTON_BLOCK_SELECTOR,
  HTML_BLOCK_SELECTOR,
  TEXT_BLOCK,
  CUSTOM_TEXT_BLOCK,
  SOCIAL_BLOCK_ICONS_SELECTOR,
  CONTAINER_BLOCK_SELECTOR_TABLE,
  SOCIAL_BLOCK,
  PARENT_TABLE_CONTAINER_SELECTOR,
  CONTAINER_BLOCK_SELECTOR,
  STRUCTURE_BLOCK_SELECTOR,
  STRIPE_BLOCK_SELECTOR,
  MOBILE_GAP_NOT_RESPONSIVE,
  ES_INFOBLOCK_SELECTOR,
  TEXT_IMAGE,
  TEXT_IMAGE_ATTRIBUTE,
  TEXT_NODE_SELECTOR,
  QUERY_HTML_NODE_TEXT_NODE_SELECTOR,
  CHILDREN_MSO_COMMENTS,
  ES_HIDDEN_NODE,
  CHILDREN_ESD_BLOCKS_SELECTOR,
  CHILDREN_TD_SELECTOR,
  ESD_BLOCKS_SELECTOR,
  ESD_AMP_BLOCKS_SELECTOR,
  ESD_AMP_FORM_BLOCKS_SELECTOR,
  AMP_STEP_FORM,
  AMP_FORM_INPUT_AREA_SELECTOR,
  AMP_FORM_INPUT_TD_SELECTOR,
  AMP_FORM_INPUT_HIDDEN_TD_SELECTOR,
  AMP_FORM_NOTIFICATION_SELECTOR,
  AMP_FORM_WITH_ID,
  AMP_INPUT_SELECTOR,
  AMP_LABEL_SELECTOR,
  SPAN,
  AMP_SUBMIT_SELECTOR,
  AMP_FORM_VISIBLE_WHEN_INVALID,
  AMP_START_AGAIN_SELECTOR,
  AMP_START_AGAIN_BUTTON_SELECTOR,
  AMP_SUCCESS_SELECTOR,
  AMP_FORM_SUBMIT_IMG_SELECTOR,
  AMP_FORM_START_AGAIN_IMG_SELECTOR,
  ESD_BLOCKS_SELECTOR_WITHOUT_MENU_ITEMS,
  HIDDEN_ON_DESKTOP,
  HIDDEN_ON_MOBILE,
  MIME_TYPE_SELECTOR,
  DISPLAY_CONDITIONS_SELECTOR,
  ESD_BLOCKS_TEXT,
  ANY_SELECTOR,
  STRUCTURE_NOT_EXTENSION_CLASS_SELECTOR,
  CONTAINER_NOT_EXTENSION_CLASS_SELECTOR,
  CONTAINER_WITH_DROPZONE,
  BLOCK_DROPPABLE_COMPONENT_SELECTOR,
  BLOCK_INSIDE_BLOCK_DROPPABLE_ELEMENT,
  ESDEV_MSO_TD_SELECTOR,
  ESDEV_MSO_CLASS_TD_SELECTOR,
  ESDEV_MSO_CLASS_TABLE_SELECTOR,
  ESDEV_MSO_CLASS_TABLE_TR,
  TABLE_FIRST_TR_SELECTOR,
  MENU_ITEM_IMAGE_SELECTOR,
  MENU_ITEM_IMAGE_SELECTOR_WITH_INDENT,
  MENU_ITEM_TEXT_SELECTOR,
  MENU_ITEM_BR_SELECTOR,
  MENU_ITEMS_SELECTOR,
  MENU_TABLE_SELECTOR,
  MENU_BLOCK_SELECTOR,
  MENU_ITEM_SELECTOR,
  BLOCKS_SELECTOR,
  NON_ANCHOR_LINK_SELECTOR,
  ROLLOVER_IMAGE_SELECTOR,
  AMP_ROLLOVER_SELECTOR,
  STRIPE_SELECTOR,
  STRIPE_SELECTOR_WITH_HIDDEN_CONFIG,
  STRUCTURE_SELECTOR,
  DIV_SELECTOR,
  AMP_FORM_SELECTOR,
  AMP_FORM_INNER_FORM_SELECTOR,
  FORM_CHILD_TR_WITH_ID,
  AMP_ACCORDION_SELECTOR,
  AMP_ACCORDION_BODY_SELECTOR,
  AMP_ACCORDION_TITLE_SELECTOR,
  AMP_CAROUSEL_SELECTOR,
  AMP_CAROUSEL_INNER,
  AMP_CAROUSEL_AMP_IMG,
  AMP_CAROUSEL_ELEMENT_SELECTOR,
  AMP_CAROUSEL_PREVIEW_SELECTOR,
  AMP_ACCORDION_EMPTY_CONTAINER_SELECTOR,
  ESD_EMAIL_PADDINGS_SELECTOR,
  AMP_BLOCK_SELECTORS,
  CONTAINER_TABLE_SELECTOR,
  SECTION_SELECTOR,
  CONTENT_BODY_SELECTOR,
  HEADER_BODY_SELECTOR,
  FOOTER_BODY_SELECTOR,
  STRIPE_BODY_SELECTOR,
  TIMER_BLOCK_SELECTOR,
  LINK_TAG_SELECTOR,
  ESD_BLOCK_CONFIG_TAG,
  ESD_CONFIG_BLOCK_VARIABLES_ATTRIBUTE_NAME,
  ESD_CONFIG_BLOCK_VARIABLES_SELECTOR,
  ESD_CALENDAR_EVENT_TAG,
  ESD_CALENDAR_EVENT_UUID_ATTRIBUTE,
  ESD_CALENDAR_EVENT_DATA_ATTRIBUTE,
  ESD_CALENDAR_EVENT_SELECTOR,
  CALENDAR_EVENT_LINK_UUID_ATTRIBUTE,
  CALENDAR_EVENTS_ATTRIBUTE,
  CALENDAR_EVENTS_BLOCK_SELECTOR,
  CALENDAR_EVENT_BOUND_LINK_SELECTOR,
  START_COMMENT_OF_IMPORTANT_SECTION_SELECTOR,
  END_COMMENT_OF_IMPORTANT_SECTION_SELECTOR,
  COMMENT_SELECTOR,
  ES_WRAPPER_SELECTOR,
  ES_WRAPPER_COLOR_SELECTOR,
  ES_WRAPPER__FIRST_LEVEL_TABLE_SELECTOR,
  ESD_BLOCK_BUTTON_SELECTOR,
  BUTTON_BORDER_SELECTOR,
  ES_LINK_SELECTOR,
  getBodyFromHtml,
  getHtmlFromHtml,
  AMP_IMAGE_SELECTOR,
  AMP_CAROUSEL_PREVIEW,
  CAROUSEL_SELECTOR,
  CAROUSEL_PREVIEW_SELECTOR,
  FORM_SELECTOR,
  ESD_HIDDEN_PREHEADER_SELECTOR,
  MEDIA_SELECTOR,
  getMobileSelector,
  TITLE_SELECTOR,
  IMAGE_TAG_SELECTOR,
  EXTENSION_BLOCK_SELECTOR,
  getNodeByConfigSelector,
  getNodeByConfigExistsSelector,
  PARAGRAPHS_SELECTORS,
  SELECTORS_FOR_AXE_CORE_MAP_ID,
  LANG_SELECTOR,
  AXE_ISSUE_IGNORED_SELECTOR,
  ELEMENT_NODE_SELECTOR
};

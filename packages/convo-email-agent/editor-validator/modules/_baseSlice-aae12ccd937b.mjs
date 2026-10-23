import {
  require_baseGet,
  require_baseSet,
  require_castPath,
  require_toKey
} from "./_Hash-6a5a8be86833.mjs";
import {
  ComplexBlock,
  DefaultBlock,
  defaultBlocksMarkers
} from "./serviceSelectorPrefix-db24995a76b3.mjs";
import {
  q
} from "./builders-6d4dedaf957f.mjs";
import {
  copy
} from "./index-8c9fdc3b457a.mjs";
import {
  __commonJS,
  __toESM
} from "./shared-4f53cda18c2b.mjs";

// editor/ui-editor-common/node_modules/lodash/set.js
var require_set = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/set.js"(exports, module) {
    "use strict";
    var baseSet = require_baseSet();
    function set2(object, path, value) {
      return object == null ? object : baseSet(object, path, value);
    }
    module.exports = set2;
  }
});

// editor/ui-editor-common/node_modules/lodash/last.js
var require_last = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/last.js"(exports, module) {
    "use strict";
    function last(array) {
      var length = array == null ? 0 : array.length;
      return length ? array[length - 1] : void 0;
    }
    module.exports = last;
  }
});

// editor/ui-editor-common/node_modules/lodash/_baseSlice.js
var require_baseSlice = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_baseSlice.js"(exports, module) {
    "use strict";
    function baseSlice(array, start, end) {
      var index = -1, length = array.length;
      if (start < 0) {
        start = -start > length ? 0 : length + start;
      }
      end = end > length ? length : end;
      if (end < 0) {
        end += length;
      }
      length = start > end ? 0 : end - start >>> 0;
      start >>>= 0;
      var result = Array(length);
      while (++index < length) {
        result[index] = array[index + start];
      }
      return result;
    }
    module.exports = baseSlice;
  }
});

// editor/ui-editor-common/node_modules/lodash/_parent.js
var require_parent = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_parent.js"(exports, module) {
    "use strict";
    var baseGet = require_baseGet();
    var baseSlice = require_baseSlice();
    function parent(object, path) {
      return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
    }
    module.exports = parent;
  }
});

// editor/ui-editor-common/node_modules/lodash/_baseUnset.js
var require_baseUnset = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_baseUnset.js"(exports, module) {
    "use strict";
    var castPath = require_castPath();
    var last = require_last();
    var parent = require_parent();
    var toKey = require_toKey();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function baseUnset(object, path) {
      path = castPath(path, object);
      var index = -1, length = path.length;
      if (!length) {
        return true;
      }
      while (++index < length) {
        var key = toKey(path[index]);
        if (key === "__proto__" && !hasOwnProperty.call(object, "__proto__")) {
          return false;
        }
        if ((key === "constructor" || key === "prototype") && index < length - 1) {
          return false;
        }
      }
      var obj = parent(object, path);
      return obj == null || delete obj[toKey(last(path))];
    }
    module.exports = baseUnset;
  }
});

// editor/ui-editor-common/node_modules/lodash/unset.js
var require_unset = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/unset.js"(exports, module) {
    "use strict";
    var baseUnset = require_baseUnset();
    function unset2(object, path) {
      return object == null ? true : baseUnset(object, path);
    }
    module.exports = unset2;
  }
});

// editor/ui-editor-ui/src/app/tools/utils/GUID.ts
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 256).toString(16).substring(1);
}
function bytesToUuid(buf) {
  let i = 0;
  const bth = byteToHex;
  return [
    bth[buf[i++]],
    bth[buf[i++]],
    bth[buf[i++]],
    bth[buf[i++]],
    "-",
    bth[buf[i++]],
    bth[buf[i++]],
    "-",
    bth[buf[i++]],
    bth[buf[i++]],
    "-",
    bth[buf[i++]],
    bth[buf[i++]],
    "-",
    bth[buf[i++]],
    bth[buf[i++]],
    bth[buf[i++]],
    bth[buf[i++]],
    bth[buf[i++]],
    bth[buf[i++]]
  ].join("");
}
function rng() {
  const randoms = new Array(16);
  for (let i = 0, r = 0; i < 16; i++) {
    if ((i & 3) === 0) {
      r = Math.random() * 4294967296;
    }
    randoms[i] = r >>> ((i & 3) << 3) & 255;
  }
  return randoms;
}
function GUID() {
  const randoms = rng();
  randoms[6] = randoms[6] & 15 | 64;
  randoms[8] = randoms[8] & 63 | 128;
  return bytesToUuid(randoms);
}

// editor/ui-editor-common/tools/node-utils/NodeUtils.ts
var import_set = __toESM(require_set());
var import_unset = __toESM(require_unset());
var NodeUtils = class _NodeUtils {
  static getPositionInParent(path) {
    const position = path[path.length - 1];
    if (position === void 0) {
      throw new Error("NodeUtils.getPositionInParent: path must not be empty.");
    }
    return position;
  }
  static reindexNode(node, pathInParent, startingWith) {
    const path = [...pathInParent || node.path || []];
    node.path = path;
    node.children = node.children || [];
    const from = startingWith?.length ? this.getPositionInParent(startingWith) : 0;
    for (let i = from; i < node.children.length; i++) {
      _NodeUtils.reindexNode(node.children[i], [...path, i]);
    }
  }
  static generateNewRandomId(node) {
    node.id = GUID();
    node?.children?.forEach((child) => {
      _NodeUtils.generateNewRandomId(child);
    });
    return node;
  }
  static getAllChildrenIds(htmlObject) {
    const collectedIds = [];
    if (htmlObject?.id) {
      collectedIds.push(htmlObject.id);
    }
    for (const child of htmlObject?.children || []) {
      collectedIds.push(...this.getAllChildrenIds(child));
    }
    return collectedIds;
  }
  /**
   To prevent blinking img on update
   issue https://kanbanflow.com/t/7RTiugYV
   @todo remove after attributes are detached from node
   */
  static getNodeForUpdate(node) {
    if (!node) {
      return null;
    }
    const replaceNodeOnUpdate = node["tag"] !== "IMG" /* IMG */;
    return replaceNodeOnUpdate ? { ...node } : node;
  }
  static setProperty(node, property, value) {
    const isClearingTheContentPropertyInTextNode = value === "" && property === "content" && node.type === 3 /* TEXT_NODE */;
    if (value !== void 0 && value !== "" || isClearingTheContentPropertyInTextNode) {
      (0, import_set.default)(node, property, value);
    } else {
      (0, import_unset.default)(node, property);
    }
  }
  static isComment(node) {
    return node.type === 8 /* COMMENT_NODE */;
  }
  static isText(node) {
    return node?.type === 3 /* TEXT_NODE */;
  }
  static getIsStructureSelector() {
    const orSelector = q.select.descendants().hasClass(defaultBlocksMarkers[ComplexBlock.STRUCTURE]);
    return q.select.descendants().tag(ComplexBlock.STRUCTURE).or(orSelector).end();
  }
  static isStructure(node) {
    return node?.tag === ComplexBlock.STRUCTURE || !!node?.attributes?.class?.includes(defaultBlocksMarkers[ComplexBlock.STRUCTURE]);
  }
  static isStructureCRDT(node) {
    return node?.getTag() === ComplexBlock.STRUCTURE || !!node?.getClasses().has(defaultBlocksMarkers[ComplexBlock.STRUCTURE]);
  }
  static isStripe(node) {
    return node?.tag === ComplexBlock.STRIPE || !!node?.attributes?.class?.includes(defaultBlocksMarkers[ComplexBlock.STRIPE]);
  }
  static isStripeCRDT(node) {
    return node?.getTag() === ComplexBlock.STRIPE || !!node?.getClasses().has(defaultBlocksMarkers[ComplexBlock.STRIPE]);
  }
  static getIsStripeSelector() {
    const orSelector = q.select.descendants().hasClass(defaultBlocksMarkers[ComplexBlock.STRIPE]);
    return q.select.descendants().tag(ComplexBlock.STRIPE).or(orSelector).end();
  }
  static getContainerSelector() {
    const orSelector = q.select.descendants().hasClass(defaultBlocksMarkers[ComplexBlock.CONTAINER]);
    return q.select.descendants().tag(ComplexBlock.CONTAINER).or(orSelector).end();
  }
  static isContainer(node) {
    return node?.tag === ComplexBlock.CONTAINER || !!node?.attributes?.class?.includes(defaultBlocksMarkers[ComplexBlock.CONTAINER]);
  }
  static isContainerCRDT(node) {
    return node?.getTag() === ComplexBlock.CONTAINER || !!node?.getClasses().has(defaultBlocksMarkers[ComplexBlock.CONTAINER]);
  }
  static isDefaultBlock(node) {
    return Object.values(DefaultBlock).includes(node.tag);
  }
  static isDefaultBlockCRDT(node) {
    return Object.values(DefaultBlock).includes(node?.getTag());
  }
  static isMenuItem(node) {
    return node?.tag === DefaultBlock.BLOCK_MENU_ITEM || !!node?.attributes?.class?.includes("esd-block-menu-item");
  }
  static isImageBlock(node) {
    return node?.tag === DefaultBlock.BLOCK_IMAGE || !!node?.attributes?.class?.includes(defaultBlocksMarkers[DefaultBlock.BLOCK_IMAGE]);
  }
  static isVideoBlock(node) {
    return node?.tag === DefaultBlock.BLOCK_VIDEO || !!node?.attributes?.class?.includes(defaultBlocksMarkers[DefaultBlock.BLOCK_VIDEO]);
  }
  static isBannerBlock(node) {
    return node?.tag === DefaultBlock.BLOCK_BANNER || !!node?.attributes?.class?.includes(defaultBlocksMarkers[DefaultBlock.BLOCK_BANNER]);
  }
  static isAmpBlock(node) {
    return node?.tag === DefaultBlock.BLOCK_AMP_ACCORDION || node?.tag === DefaultBlock.BLOCK_AMP_CAROUSEL || node?.tag === DefaultBlock.BLOCK_AMP_FORM;
  }
  static isAmpCarousel(node) {
    return node?.tag === "AMP-CAROUSEL" /* AMP_CAROUSEL */;
  }
  static isAmpImg(node) {
    return node?.tag === "AMP-IMG" /* AMP_IMG */;
  }
  static isAccordionBlock(node) {
    return node?.tag === DefaultBlock.BLOCK_AMP_ACCORDION;
  }
  static isAmpFormBlock(node) {
    return node?.tag === DefaultBlock.BLOCK_AMP_FORM;
  }
  /**
   * @description updates node by path.
   * @param root root in which target node is taken by path
   * @param path path of updated node RELATIVE to root
   * @param property node property to update
   * @param value new property value
   */
  static updateNode(root, path, property, value) {
    const correspondingParent = _NodeUtils.getChildByPath(root, _NodeUtils.getParentPath(path), false);
    const updatedNode = property ? _NodeUtils.getNodeForUpdate(_NodeUtils.getChildByPath(root, path, false)) : value;
    if (!correspondingParent || !updatedNode) {
      console.error("Cannot find node to update!");
      return null;
    }
    const parentIsComment = _NodeUtils.isComment(correspondingParent);
    if (path.length && !parentIsComment && !correspondingParent.children) {
      console.error("Cannot find children of the node to update!");
      return null;
    }
    property && this.setProperty(updatedNode, property, value);
    if (path.length) {
      if (!parentIsComment) {
        const parentChildren = correspondingParent.children;
        if (parentChildren) {
          parentChildren[this.getPositionInParent(path)] = updatedNode;
        }
      }
    } else {
      Object.assign(correspondingParent, updatedNode);
    }
    !property && _NodeUtils.reindexNode(correspondingParent, void 0, path);
    return updatedNode;
  }
  static pureNodeUpdate(root, path, property, value) {
    const updatedNode = property ? _NodeUtils.getNodeForUpdate(_NodeUtils.getChildByPath(root, path, false)) : value;
    if (!updatedNode) {
      console.error("Cannot find node to update!");
      return null;
    }
    property && this.setProperty(updatedNode, property, value);
    return updatedNode;
  }
  static updateNodeModelWithoutReRendering(root, path, property, value) {
    const correspondingParent = _NodeUtils.getChildByPath(root, _NodeUtils.getParentPath(path), false);
    const updatedNode = _NodeUtils.getChildByPath(root, path, false);
    if (!correspondingParent || !updatedNode) {
      console.error("Cannot find node to update!");
      return null;
    }
    if (path.length && !correspondingParent.children) {
      console.error("Cannot find children of the node to update!");
      return null;
    }
    property ? this.setProperty(updatedNode, property, value) : Object.assign(updatedNode, value);
    if (path.length) {
      const parentChildren = correspondingParent.children;
      if (parentChildren) {
        parentChildren[this.getPositionInParent(path)] = updatedNode;
      }
    } else {
      Object.assign(correspondingParent, updatedNode);
    }
    return updatedNode;
  }
  static insertNodes(root, path, nodes) {
    const correspondingParent = _NodeUtils.getChildByPath(root, _NodeUtils.getParentPath(path), false);
    if (!correspondingParent?.children) {
      console.error("Cannot find container to insert into!");
      return null;
    }
    const position = this.getPositionInParent(path);
    correspondingParent.children.splice(position, 0, ...nodes);
    _NodeUtils.reindexNode(correspondingParent, void 0, path);
    return nodes;
  }
  static arePathsEqual(p1, p2) {
    return !!p1 && !!p2 && p1?.length === p2?.length && p1.every((e, i) => e === p2[i]);
  }
  static areSiblings(paths) {
    return paths.every((p1) => paths.every((p2) => p1 === p2 || !_NodeUtils.arePathsEqual(p1, p2) && _NodeUtils.arePathsEqual(_NodeUtils.getParentPath(p1), _NodeUtils.getParentPath(p2))));
  }
  /**
   * @description used to determine if two paths are related (equal, parent-child, or sibling)
   * @param p1
   * @param p2
   */
  static isRelatedPaths(p1, p2) {
    return _NodeUtils.arePathsEqual(p1, p2) || this.isParent(p1, p2, true) || this.isParent(p2, p1, true);
  }
  /**
   * @description used to determine if child path is direct child/descendant of parent path
   * @param deep - check if deeply nested descendant
   */
  static isParent(parent, child, deep = false) {
    if (!parent || !child || parent.length >= child.length) {
      return false;
    }
    const childParent = deep ? child.slice(0, parent.length - child.length) : _NodeUtils.getParentPath(child);
    return _NodeUtils.arePathsEqual(parent, childParent);
  }
  static isPreviousSibling(p1, p2) {
    return p1.length === p2.length && _NodeUtils.arePathsEqual(_NodeUtils.getParentPath(p1), _NodeUtils.getParentPath(p2)) && this.getPositionInParent(p2) > this.getPositionInParent(p1);
  }
  static getParentPath(path) {
    return path?.slice(0, -1);
  }
  /**
   * "Move a node from one place to another."
   *
   * The function takes three arguments:
   *
   * 1. The root node of the tree.
   * 2. The path to the node to be moved.
   * 3. The path to the destination node
   * @param {NodeObject} root - The root node of the tree.
   * @param {Path} targetPath - The path to the node you want to move.
   * @param {Path} destinationPath - The path to the node that you want to move the target node to.
   * @returns The root node with the moved node.
   */
  static moveNode(root, targetPath, destinationPath) {
    const removedNodes = _NodeUtils.removeNodes(root, targetPath, 1);
    if (!removedNodes) {
      return null;
    }
    return _NodeUtils.insertNodes(root, destinationPath, removedNodes);
  }
  static removeNodes(root, path, count) {
    const parentPath = this.getParentPath(path);
    const startingIndex = this.getPositionInParent(path);
    const correspondingParent = _NodeUtils.getChildByPath(root, parentPath, false);
    if (!correspondingParent?.children) {
      console.error("Cannot find container to delete from!");
      return null;
    }
    const removedNodes = correspondingParent.children.splice(startingIndex, count);
    _NodeUtils.reindexNode(correspondingParent, void 0, path);
    removedNodes.forEach((node) => this.clearNodePath(node));
    return removedNodes;
  }
  static clearNodePath(node) {
    node.path = void 0;
    if (node.children) {
      node.children.forEach((ch) => this.clearNodePath(ch));
    }
  }
  static getChildByPath(node, path, closest = true) {
    for (const i of path) {
      const child = node.children?.[i];
      if (child) {
        node = child;
      } else if (closest) {
        break;
      } else {
        return null;
      }
    }
    return node;
  }
  static getChildByID(node, id) {
    return this.findFirst(node, (n) => n.id === id);
  }
  /**
   * @description used to determine if {@param dependable} changes after removal of {@param on}
   * @returns
   * x < 0 if {@param on} is structurally before {@param dependable}
   * x = 0 if {@param on} is structurally on the same level as {@param dependable}
   * x > 0 if {@param on} is structurally after {@param dependable}
   */
  static getStructuralDependency(dependable, on) {
    const isOnMoreNestedThanDependable = dependable.length < on.length;
    if (isOnMoreNestedThanDependable) {
      return 1;
    }
    const onParent = this.getParentPath(on);
    const onParentLevelDependableAncestor = dependable.slice(0, on.length - 1);
    const onParentIsNotCommonAncestor = !_NodeUtils.arePathsEqual(onParentLevelDependableAncestor, onParent);
    if (onParentIsNotCommonAncestor) {
      return 1;
    }
    return on[on.length - 1] - dependable[on.length - 1];
  }
  /**
   * @description Similar to {@link getStructuralDependency} but determines if {@param on} is met earlier in the tree by determining
   * the relative position dependency between two paths in the tree.
   * This method helps determine if one node is encountered before another when traversing the tree.
   * @param dependable - The path of the node being checked
   * @param on - The reference path to compare against
   * @param allowIntersection - If true, allows paths of different lengths to be considered equal if their common parts match
   * @returns
   * -1: if 'dependable' comes after 'on' in the tree traversal
   *  0: if the paths are at the same position or intersect (when allowIntersection is true)
   *  1: if 'dependable' comes before 'on' in the tree traversal
   */
  static getPositionDependency(dependable, on, allowIntersection = true) {
    const [dependableContainer, onContainer] = this.getSameLevelPaths(dependable, on);
    for (let i = 0; i < dependableContainer.length; i++) {
      if (dependableContainer[i] > onContainer[i]) {
        return -1;
      } else if (dependableContainer[i] < onContainer[i]) {
        return 1;
      }
    }
    if (!allowIntersection) {
      if (dependable?.length > on?.length) {
        return -1;
      }
      if (dependable?.length < on?.length) {
        return 1;
      }
    }
    return 0;
  }
  static getPathToInsert(insertNear, previousPath, insertPosition, move = false) {
    if (!insertNear.path) {
      throw new Error("NodeUtils.getPathToInsert: insertNear has no path. Check that the node is positioned in the tree.");
    }
    const targetPath = [...insertNear.path];
    if (move && _NodeUtils.areSiblings([insertNear.path, previousPath]) && _NodeUtils.isPreviousSibling(previousPath, insertNear.path)) {
      targetPath[targetPath.length - 1]--;
    }
    if (insertPosition === "BEFORE" /* BEFORE */) {
      return targetPath;
    } else if (insertPosition === "AFTER" /* AFTER */) {
      return [...targetPath.slice(0, targetPath.length - 1), this.getPositionInParent(targetPath) + 1];
    } else if (insertPosition === "INSIDE_START" /* INSIDE_START */) {
      return [...targetPath, 0];
    }
    return [...targetPath, insertNear.children?.length ?? 0];
  }
  static getParent(root, path, getClosest = false) {
    if (path?.length) {
      return this.getChildByPath(root, this.getParentPath(path), getClosest);
    }
    return null;
  }
  static getClosest(root, path, predicate, self = false) {
    if (!root || !path) {
      return null;
    }
    path = this.getRelativePath(path, root.path);
    if (self) {
      const node = this.getChildByPath(root, path, false);
      if (node && predicate(node)) {
        return node;
      }
    }
    if (!path.length) {
      return null;
    }
    return this.getClosest(root, this.getParentPath(path), predicate, true);
  }
  static getParents(root, path, predicate) {
    if (!root || !path || !path.length) {
      return [];
    }
    const res = [];
    const parent = this.getChildByPath(root, this.getParentPath(path));
    if (!parent || _NodeUtils.arePathsEqual(parent.path, path)) {
      return res;
    }
    if (predicate(parent)) {
      res.push(parent);
    }
    if (parent.path) {
      res.push(...this.getParents(root, parent.path, predicate));
    }
    return res;
  }
  static isObject(value) {
    return typeof value === "object" && !Array.isArray(value) && value !== null;
  }
  /**
   * @description returns closest common ancestor path for {@param p1} and {@param p2} paths.
   */
  static getCommonAncestorPath(p1, p2) {
    const path = [];
    for (let i = 0; i < p1.length - 1; i++) {
      if (p1[i] === p2[i]) {
        path.push(p1[i]);
      } else {
        break;
      }
    }
    return path;
  }
  /**
   * @description returns closest common ancestor for {@param n1} and {@param n2} nodes.
   */
  static getCommonAncestor(root, n1, n2) {
    if (!n1.path || !n2.path) {
      return null;
    }
    return this.getChildByPath(root, this.getCommonAncestorPath(n1.path, n2.path));
  }
  /**
   * @description returns part of {@param path} relative to node located at {@param relativeTo}.
   */
  static getRelativePath(path, relativeTo) {
    if (!relativeTo) {
      return path;
    }
    if (path.length === relativeTo.length) {
      return [];
    }
    if (path.length < relativeTo.length) {
      return path;
    }
    return path.slice(relativeTo.length - path.length);
  }
  /**
   * @description cuts search off early to avoid searching container structures in nested ones
   */
  static shouldContinueSearchInChildren(node, predicate) {
    const n = node;
    if (predicate === this.isStripe && (this.isStripe(n) || this.isStructure(n) || this.isContainer(n) || this.isDefaultBlock(n))) {
      return false;
    } else if (predicate === this.isStructure && (this.isStructure(n) || this.isContainer(n) || this.isDefaultBlock(n))) {
      return false;
    } else if (predicate === this.isContainer && (this.isContainer(n) || this.isDefaultBlock(n))) {
      return false;
    }
    return true;
  }
  /**
   * @description returns all nodes from node and all its descendants that match predicate
   */
  static find(node, predicate) {
    const res = [];
    if (predicate(node)) {
      res.push(node);
    }
    if (node?.children?.length && this.shouldContinueSearchInChildren(node, predicate)) {
      for (const child of node.children) {
        res.push(..._NodeUtils.find(child, predicate));
      }
    }
    return res;
  }
  /**
   * @description returns first node from node and all its descendants that match predicate
   */
  static findFirst(node, predicate) {
    if (predicate(node)) {
      return node;
    }
    if (node?.children) {
      const found = node.children.find((child) => predicate(child));
      if (found) {
        return found;
      }
      for (const child of node.children) {
        const foundInChild = _NodeUtils.findFirst(child, predicate);
        if (foundInChild) {
          return foundInChild;
        }
      }
    }
    return null;
  }
  /**
   * @description returns first node from node and all its descendants that match predicate
   */
  static findFirstCRDT(node, predicate) {
    if (predicate(node)) {
      return node;
    }
    if (node?.getChildren()) {
      const found = node.getChildren().find((child) => predicate(child));
      if (found) {
        return found;
      }
      for (const child of node.getChildren()) {
        const foundInChild = _NodeUtils.findFirstCRDT(child, predicate);
        if (foundInChild) {
          return foundInChild;
        }
      }
    }
    return null;
  }
  static foreachNode(node, callbackfn) {
    callbackfn(node);
    node.children?.forEach((ch) => this.foreachNode(ch, callbackfn));
  }
  static foreachNodeCRDT(node, callbackfn) {
    callbackfn(node);
    node.getChildren() && node.getChildren().forEach((ch) => this.foreachNodeCRDT(ch, callbackfn));
  }
  /**
   * @description returns first node from node or its children that match predicate
   */
  static findFirst3(node, predicate) {
    if (predicate(node)) {
      return node;
    }
    const found = node.children && node.children.find((child) => predicate(child));
    return found;
  }
  /**
   * @description returns paths which are on the same depth of nesting
   */
  static getSameLevelPaths(p1, p2) {
    const sameLevelPathLen = p1.length > p2.length ? p2.length : p1.length;
    return [p1.slice(0, sameLevelPathLen), p2.slice(0, sameLevelPathLen)];
  }
  static getStructuralParentBlock(root, path) {
    const pathCopy = copy(path);
    const nodeIdentifiers = ["esd-block", "esd-structure", "esd-stripe"];
    for (; pathCopy.length; ) {
      const nodeByPath = _NodeUtils.getChildByPath(root, pathCopy);
      const className = nodeByPath?.attributes?.class;
      if (className && new RegExp(nodeIdentifiers.join("|")).test(className)) {
        return nodeByPath;
      }
      pathCopy.pop();
    }
    return null;
  }
  static getSiblingPath(p, next = true) {
    const parentPath = this.getParentPath(p);
    const nodeIndex = this.getPositionInParent(p);
    if (next) {
      return [...parentPath, nodeIndex + 1];
    }
    return !nodeIndex ? null : [...parentPath, nodeIndex - 1];
  }
  static getSibling(root, node, next = true) {
    if (!node.path?.length) {
      return null;
    }
    const siblingPath = this.getSiblingPath(node.path, next);
    return siblingPath ? this.getChildByPath(root, this.getRelativePath(siblingPath, root.path), false) : null;
  }
  static getLastChild(node, predicate) {
    const children = node?.children || [];
    for (let i = children.length - 1; i >= 0; i--) {
      const child = children[i];
      if (!predicate || predicate(child)) {
        return child;
      }
    }
    return void 0;
  }
  static getFirstChild(node) {
    return node.children?.[0];
  }
  static excludeFieldsDeep(node, fields) {
    const res = { ...node };
    fields.forEach((key) => (0, import_unset.default)(res, key));
    if (res.children) {
      res.children = res.children.map((child) => _NodeUtils.excludeFieldsDeep(child, fields));
    }
    return res;
  }
  static isTag(tag) {
    return function(node) {
      return node?.tag?.toUpperCase() === tag?.toUpperCase();
    };
  }
  static hasParent(node) {
    return !!node?.path?.length;
  }
};
globalThis["NodeUtils"] = NodeUtils;

export {
  NodeUtils
};

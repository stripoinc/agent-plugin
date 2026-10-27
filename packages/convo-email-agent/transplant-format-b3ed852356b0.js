import {
  isElement,
  makeElement,
  parseHtml,
  serializeHtml
} from "./parse-html-7b561a99741a.js";

// convo-email-agent/src/sdk/transplant-format.ts
var BLOCK_TAGS = /* @__PURE__ */ new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "div", "blockquote"]);
var HEADING_TAGS = /* @__PURE__ */ new Set(["h1", "h2", "h3", "h4", "h5", "h6"]);
var BLOCK_CONTAINER_TAGS = /* @__PURE__ */ new Set(["div", "blockquote"]);
var INLINE_WRAP_TAGS = /* @__PURE__ */ new Set(["strong", "em", "b", "i", "u", "s", "span"]);
var SEMANTIC_TAGS = /* @__PURE__ */ new Set([
  "p",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "br",
  "strong",
  "em",
  "u",
  "s",
  "a",
  "ul",
  "ol",
  "li"
]);
var TAG_ALIASES = { b: "strong", i: "em" };
function normalizeTag(tag) {
  return TAG_ALIASES[tag] ?? tag;
}
function cloneAttrs(attrs) {
  return attrs.map((attr) => ({ ...attr }));
}
function isWhitespaceText(node) {
  return node.kind === "text" && node.text.trim() === "";
}
function significantChildren(element) {
  const children = element.children.filter((child) => !isWhitespaceText(child));
  while (children.length > 0) {
    const lastChild = children[children.length - 1];
    if (isElement(lastChild) && lastChild.tag === "br") children.pop();
    else break;
  }
  return children;
}
function wholeContentChain(element) {
  const chain = [];
  let current = element;
  for (; ; ) {
    const significant = significantChildren(current);
    const only = significant.length === 1 ? significant[0] : void 0;
    if (only !== void 0 && isElement(only) && INLINE_WRAP_TAGS.has(only.tag)) {
      chain.push(only);
      current = only;
    } else {
      return chain;
    }
  }
}
function visitElements(nodes, visit) {
  for (const node of nodes) {
    if (!isElement(node)) continue;
    visit(node);
    visitElements(node.children, visit);
  }
}
function registerBlockTemplates(nodes, template) {
  for (const node of nodes) {
    if (!isElement(node) || !BLOCK_TAGS.has(node.tag)) continue;
    if (!template.blocks.has(node.tag)) {
      template.blocks.set(node.tag, {
        attrs: cloneAttrs(node.attrs),
        inlineChain: wholeContentChain(node).map((wrapper) => ({
          tag: normalizeTag(wrapper.tag),
          attrs: cloneAttrs(wrapper.attrs)
        }))
      });
      template.defaultBlockTag ??= node.tag;
      if (HEADING_TAGS.has(node.tag) && template.headingTag === void 0) {
        template.headingTag = node.tag;
      }
    }
    if ((node.tag === "ul" || node.tag === "ol") && template.liAttrs === void 0) {
      const item = node.children.find((child) => isElement(child) && child.tag === "li");
      if (item) template.liAttrs = cloneAttrs(item.attrs);
    }
    if (BLOCK_CONTAINER_TAGS.has(node.tag)) {
      registerBlockTemplates(node.children, template);
    }
  }
}
function extractFormatTemplate(originalHtml) {
  const template = { blocks: /* @__PURE__ */ new Map(), inlineAttrs: /* @__PURE__ */ new Map() };
  const nodes = parseHtml(originalHtml);
  registerBlockTemplates(nodes, template);
  visitElements(nodes, (element) => {
    if (element.tag === "a" && template.anchorAttrs === void 0) {
      template.anchorAttrs = cloneAttrs(element.attrs.filter((attr) => attr.name !== "href"));
    }
    if (INLINE_WRAP_TAGS.has(element.tag)) {
      const key = normalizeTag(element.tag);
      if (!template.inlineAttrs.has(key)) template.inlineAttrs.set(key, cloneAttrs(element.attrs));
    }
  });
  return template;
}
function sanitizeNodes(nodes) {
  const result = [];
  for (const node of nodes) {
    if (node.kind === "text") {
      result.push({ ...node });
      continue;
    }
    const tag = normalizeTag(node.tag);
    if (tag === "br") {
      result.push(makeElement("br", [], []));
      continue;
    }
    if (!SEMANTIC_TAGS.has(tag)) {
      result.push(...sanitizeNodes(node.children));
      continue;
    }
    const attrs = tag === "a" ? cloneAttrs(node.attrs.filter((attr) => attr.name === "href" || attr.name === "target")) : [];
    result.push(makeElement(tag, attrs, sanitizeNodes(node.children)));
  }
  return result;
}
function sanitizeSemanticHtml(html) {
  return sanitizeNodes(parseHtml(html));
}
function groupIntoBlocks(nodes, defaultTag) {
  const result = [];
  let run = [];
  const flushRun = () => {
    if (run.some((node) => !isWhitespaceText(node))) {
      result.push(makeElement(defaultTag, [], run));
    }
    run = [];
  };
  for (const node of nodes) {
    if (isElement(node) && BLOCK_TAGS.has(node.tag)) {
      flushRun();
      result.push(node);
    } else {
      run.push(node);
    }
  }
  flushRun();
  return result;
}
function decorateInlineElements(block, template) {
  visitElements(block.children, (element) => {
    if (element.tag === "a") {
      if (template.anchorAttrs !== void 0) {
        const href = element.attrs.find((attr) => attr.name === "href");
        element.attrs = [
          ...href ? [{ ...href }] : [],
          ...cloneAttrs(template.anchorAttrs)
        ];
      }
      return;
    }
    if (INLINE_WRAP_TAGS.has(element.tag)) {
      const attrs = template.inlineAttrs.get(element.tag);
      if (attrs !== void 0 && attrs.length > 0) element.attrs = cloneAttrs(attrs);
    }
  });
}
function applyBlockTemplate(block, template) {
  const blockTemplate = template.blocks.get(block.tag) ?? (HEADING_TAGS.has(block.tag) && template.headingTag !== void 0 ? template.blocks.get(template.headingTag) : void 0);
  decorateInlineElements(block, template);
  if (blockTemplate === void 0) return;
  block.attrs = cloneAttrs(blockTemplate.attrs);
  if ((block.tag === "ul" || block.tag === "ol") && template.liAttrs !== void 0) {
    for (const child of block.children) {
      if (isElement(child) && child.tag === "li") child.attrs = cloneAttrs(template.liAttrs);
    }
  }
  if (blockTemplate.inlineChain.length > 0) {
    const ownChain = wholeContentChain(block);
    const missing = [];
    for (const wrapper of blockTemplate.inlineChain) {
      const ownMatch = ownChain.find((element) => element.tag === wrapper.tag);
      if (ownMatch) ownMatch.attrs = cloneAttrs(wrapper.attrs);
      else missing.push(wrapper);
    }
    for (let index = missing.length - 1; index >= 0; index -= 1) {
      block.children = [makeElement(missing[index].tag, cloneAttrs(missing[index].attrs), block.children)];
    }
  }
}
function transplantContentFormat(originalHtml, newHtml) {
  if (newHtml.trim() === "") return newHtml;
  const template = extractFormatTemplate(originalHtml);
  const sanitized = sanitizeSemanticHtml(newHtml);
  if (template.defaultBlockTag === void 0) return serializeHtml(sanitized);
  const blocks = groupIntoBlocks(sanitized, template.defaultBlockTag);
  for (const block of blocks) {
    if (isElement(block)) applyBlockTemplate(block, template);
  }
  return serializeHtml(blocks);
}

export {
  extractFormatTemplate,
  sanitizeSemanticHtml,
  transplantContentFormat
};

// convo-email-agent/src/sdk/parse-html.ts
var VOID_TAGS = /* @__PURE__ */ new Set(["br", "hr", "img"]);
var CLOSE_TAG_PATTERN = /^<\/\s*([a-zA-Z][a-zA-Z0-9-]*)\s*>/;
var OPEN_TAG_PATTERN = /^<([a-zA-Z][a-zA-Z0-9-]*)((?:"[^"]*"|'[^']*'|[^>"'])*)>/;
var ATTR_PATTERN = /([^\s=/>"']+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]*)))?/g;
function makeElement(tag, attrs, children) {
  return { kind: "element", tag, attrs, children };
}
function isElement(node) {
  return node.kind === "element";
}
function parseAttrs(rawAttrs) {
  const attrs = [];
  for (const match of rawAttrs.matchAll(ATTR_PATTERN)) {
    const [, name, doubleQuoted, singleQuoted, bare] = match;
    const value = doubleQuoted ?? singleQuoted ?? bare;
    attrs.push({ name: name.toLowerCase(), value: value === void 0 || match[0] === name ? null : value });
  }
  return attrs;
}
function parseHtml(html) {
  const roots = [];
  const stack = [];
  const currentChildren = () => stack.length > 0 ? stack[stack.length - 1].children : roots;
  const pushText = (text) => {
    if (text.length > 0) currentChildren().push({ kind: "text", text });
  };
  const closeTag = (tag) => {
    for (let openIndex = stack.length - 1; openIndex >= 0; openIndex -= 1) {
      if (stack[openIndex].tag === tag) {
        stack.length = openIndex;
        return;
      }
    }
  };
  let position = 0;
  while (position < html.length) {
    const tagStart = html.indexOf("<", position);
    if (tagStart === -1) {
      pushText(html.slice(position));
      break;
    }
    pushText(html.slice(position, tagStart));
    const rest = html.slice(tagStart);
    if (rest.startsWith("<!--")) {
      const commentEnd = html.indexOf("-->", tagStart + 4);
      position = commentEnd === -1 ? html.length : commentEnd + 3;
      continue;
    }
    const closeMatch = CLOSE_TAG_PATTERN.exec(rest);
    if (closeMatch) {
      closeTag(closeMatch[1].toLowerCase());
      position = tagStart + closeMatch[0].length;
      continue;
    }
    const openMatch = OPEN_TAG_PATTERN.exec(rest);
    if (openMatch) {
      const tag = openMatch[1].toLowerCase();
      const selfClosing = /\/\s*$/.test(openMatch[2]);
      const element = makeElement(tag, parseAttrs(openMatch[2].replace(/\/\s*$/, "")), []);
      currentChildren().push(element);
      if (!selfClosing && !VOID_TAGS.has(tag)) {
        stack.push({ tag, children: element.children });
      }
      position = tagStart + openMatch[0].length;
      continue;
    }
    pushText("<");
    position = tagStart + 1;
  }
  return roots;
}
function serializeAttrs(attrs) {
  return attrs.map((attr) => attr.value === null ? ` ${attr.name}` : ` ${attr.name}="${attr.value.replaceAll('"', "&quot;")}"`).join("");
}
function serializeNode(node) {
  if (node.kind === "text") return node.text;
  if (VOID_TAGS.has(node.tag)) return `<${node.tag}${serializeAttrs(node.attrs)}>`;
  return `<${node.tag}${serializeAttrs(node.attrs)}>${serializeHtml(node.children)}</${node.tag}>`;
}
function serializeHtml(nodes) {
  return nodes.map(serializeNode).join("");
}

export {
  makeElement,
  isElement,
  parseHtml,
  serializeHtml
};

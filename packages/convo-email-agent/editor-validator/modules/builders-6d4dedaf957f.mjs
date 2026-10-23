// editor/ui-editor-ui/src/app/model-query/query-error.ts
var QueryParseException = class extends Error {
  constructor(error) {
    super(error.message);
    this.error = error;
    this.name = "QueryParseException";
  }
};
function queryParseError(code, message, _index, _length = 1) {
  return new QueryParseException({ code, message });
}

// editor/ui-editor-ui/src/app/model-query/canonical-parser.ts
var identifierStart = /[a-zA-Z_]/;
var identifierPart = /[a-zA-Z0-9_-]/;
var supportedPatternFlags = /^[im]*$/;
function parseCanonicalQuery(domain, source) {
  return new CanonicalParser(domain, source).parse();
}
function getPortableRe2PatternError(source, flags) {
  if (typeof source !== "string") {
    return "Selector pattern source must be a portable re2 string.";
  }
  if (flags !== void 0 && typeof flags !== "string") {
    return "Selector pattern flags must be a string.";
  }
  const patternFlags = flags === void 0 ? "" : flags;
  if (patternFlags && !supportedPatternFlags.test(patternFlags)) {
    return "Unsupported selector pattern flags.";
  }
  if (patternFlags && new Set(patternFlags).size !== patternFlags.length) {
    return "Duplicate selector pattern flags are not supported.";
  }
  if (hasUnescapedToken(source, "(?=") || hasUnescapedToken(source, "(?!") || hasUnescapedToken(source, "(?<=") || hasUnescapedToken(source, "(?<!")) {
    return "RE2 selector patterns do not support lookaround.";
  }
  if (hasUnescapedToken(source, "(?<")) {
    return "RE2 selector patterns do not support JavaScript named capture groups.";
  }
  if (hasBackReference(source)) {
    return "RE2 selector patterns do not support backreferences.";
  }
  return void 0;
}
function hasUnescapedToken(source, token) {
  let escaped = false;
  for (let i = 0; i < source.length; i++) {
    if (escaped) {
      escaped = false;
      continue;
    }
    if (source[i] === "\\") {
      escaped = true;
      continue;
    }
    if (source.startsWith(token, i)) {
      return true;
    }
  }
  return false;
}
function hasBackReference(source) {
  let escaped = false;
  for (let i = 0; i < source.length; i++) {
    const current = source[i];
    if (escaped) {
      if (/[1-9]/.test(current) || current === "k" && source[i + 1] === "<") {
        return true;
      }
      escaped = false;
      continue;
    }
    if (current === "\\") {
      escaped = true;
    }
  }
  return false;
}
var CanonicalParser = class {
  constructor(domain, source) {
    this.domain = domain;
    this.source = source;
    this.index = 0;
  }
  parse() {
    this.skipWhitespace();
    if (this.isEnd()) {
      throw queryParseError("empty-selector", "Selector is empty.", 0, 0);
    }
    const groups = this.parseSelectorList();
    this.skipWhitespace();
    if (!this.isEnd()) {
      throw queryParseError("unexpected-token", 'Unexpected token "'.concat(this.peek(), '".'), this.index);
    }
    return { domain: this.domain, groups };
  }
  parseSelectorList(stopChar) {
    const groups = [];
    for (; ; ) {
      this.skipWhitespace();
      if (this.isEnd() || this.peek() === stopChar) {
        break;
      }
      groups.push(this.parseSelectorChain(stopChar));
      this.skipWhitespace();
      if (this.peek() !== ",") {
        break;
      }
      this.index++;
      this.skipWhitespace();
      if (this.isEnd() || this.peek() === stopChar || this.peek() === ",") {
        throw queryParseError("invalid-combinator", "Selector group is missing after comma.", this.index);
      }
    }
    if (groups.length === 0) {
      throw queryParseError("empty-selector", "Selector is empty.", this.index, 0);
    }
    return groups;
  }
  parseSelectorChain(stopChar) {
    const steps = [];
    steps.push({
      axis: "descendant",
      compound: { predicates: this.parseCompound() }
    });
    steps[0].axis = this.isScopeStep(steps[0]) ? "self" : "descendant";
    for (; ; ) {
      const whitespaceIndex = this.index;
      const hadWhitespace = this.skipWhitespace();
      const current = this.peek();
      if (this.isEnd() || current === "," || current === stopChar || current === ")") {
        break;
      }
      let axis;
      if (current === ">") {
        axis = "child";
        this.index++;
        this.skipWhitespace();
        if (this.isEnd() || this.peek() === "," || this.peek() === stopChar || this.peek() === ">" || this.peek() === ")") {
          throw queryParseError("invalid-combinator", "Child combinator is missing a right selector.", this.index);
        }
      } else {
        if (!hadWhitespace) {
          throw queryParseError("unexpected-token", 'Unexpected token "'.concat(current, '".'), whitespaceIndex);
        }
        axis = "descendant";
      }
      steps.push({ axis, compound: { predicates: this.parseCompound() } });
    }
    return { steps };
  }
  parseCompound() {
    const predicates = [];
    for (; ; ) {
      const current = this.peek();
      if (this.isEnd() || current === "," || current === ">" || current === ")" || this.isWhitespace(current)) {
        break;
      }
      predicates.push(this.parseSimpleSelector());
    }
    if (predicates.length === 0) {
      throw queryParseError("unexpected-token", "Compound selector is missing.", this.index, 0);
    }
    return predicates;
  }
  parseSimpleSelector() {
    const current = this.peek();
    if (current === "*") {
      this.index++;
      return { kind: "any" };
    }
    if (current === ".") {
      this.index++;
      return { kind: "class-has", className: this.parseIdentifier("class name") };
    }
    if (current === "[") {
      return this.parseAttributeSelector();
    }
    if (current === ":") {
      return this.parsePseudoPredicate();
    }
    if (identifierStart.test(current)) {
      return { kind: "tag-equals", tag: this.parseIdentifier("tag"), normalizeModelTag: true };
    }
    throw queryParseError("unexpected-token", 'Unexpected token "'.concat(current, '".'), this.index);
  }
  parseAttributeSelector() {
    const start = this.index;
    this.expect("[");
    this.skipWhitespace();
    const name = this.parseIdentifier("attribute name");
    this.skipWhitespace();
    if (this.peek() === "]") {
      this.index++;
      return { kind: "attribute-exists", name };
    }
    const operator = this.parseAttributeOperator();
    this.skipWhitespace();
    const value = this.parseLiteral();
    this.skipWhitespace();
    if (this.peek() !== "]") {
      throw queryParseError("unexpected-token", "Attribute selector must end with ].", this.index);
    }
    this.index++;
    if (operator === "=") {
      return { kind: "attribute-equals", name, value };
    }
    if (typeof value !== "string") {
      throw queryParseError("invalid-literal", "Attribute prefix value must be a string.", start, this.index - start);
    }
    if (name === "class" && operator === "*=") {
      return { kind: "class-starts-with", prefix: value };
    }
    return { kind: "attribute-starts-with", name, prefix: value };
  }
  parseAttributeOperator() {
    if (this.source.startsWith("^=", this.index)) {
      this.index += 2;
      return "^=";
    }
    if (this.source.startsWith("*=", this.index)) {
      this.index += 2;
      return "*=";
    }
    if (this.peek() === "=") {
      this.index++;
      return "=";
    }
    throw queryParseError("unexpected-token", "Unsupported attribute operator.", this.index);
  }
  parsePseudoPredicate() {
    const start = this.index;
    this.expect(":");
    const name = this.parseIdentifier("pseudo predicate");
    if (name === "scope") {
      return this.noArgs(name, start, { kind: "scope" });
    }
    if (name === "has-styles") {
      return this.noArgs(name, start, { kind: "has-styles" });
    }
    if (name === "not-last-child") {
      return this.noArgs(name, start, { kind: "not-last-child" });
    }
    if (name === "not-last-element") {
      return this.noArgs(name, start, { kind: "not-last-element" });
    }
    if (name === "is-rule") {
      return this.noArgs(name, start, { kind: "css-is-rule" });
    }
    if (name === "is-comment") {
      return this.noArgs(name, start, { kind: "css-is-comment" });
    }
    if (name === "text-not-empty") {
      return this.noArgs(name, start, { kind: "text-not-empty" });
    }
    const args = this.parseArguments(name, start);
    return this.predicateFromArgs(name, args, start);
  }
  noArgs(name, start, predicate) {
    if (this.peek() === "(") {
      const args = this.parseArguments(name, start);
      this.assertArgCount(name, args, 0, start);
    }
    return predicate;
  }
  predicateFromArgs(name, args, start) {
    switch (name) {
      case "not":
        this.assertArgCount(name, args, 1, start);
        return { kind: "not", predicate: this.selectorArgumentToPredicate(args[0]) };
      case "any-of":
        this.assertArgCountAtLeast(name, args, 1, start);
        return { kind: "any-of", predicates: args.flatMap((arg) => this.selectorArgumentToPredicates(arg)) };
      case "has": {
        this.assertArgCountAtLeast(name, args, 1, start);
        const chains = this.selectorArgumentToChains(args[0]);
        return chains.length === 1 ? { kind: "has", query: chains[0] } : { kind: "has-any", queries: chains };
      }
      case "tag-one-of":
        this.assertArgCount(name, args, 1, start);
        return { kind: "tag-one-of", tags: this.listArg(name, args[0], start), normalizeModelTag: true };
      case "tag-one-of-exact":
        this.assertArgCount(name, args, 1, start);
        return { kind: "tag-one-of", tags: this.listArg(name, args[0], start), normalizeModelTag: false };
      case "class-one-of":
        this.assertArgCount(name, args, 1, start);
        return { kind: "class-one-of", classNames: this.listArg(name, args[0], start) };
      case "nth-child":
        this.assertArgCount(name, args, 1, start);
        return { kind: "nth-child", index: this.numberArg(name, args[0], start) };
      case "config-exists":
        this.assertArgCount(name, args, 1, start);
        return { kind: "config-exists", name: this.stringArg(name, args[0], start) };
      case "config-equals":
        this.assertArgCount(name, args, 2, start);
        return { kind: "config-equals", name: this.stringArg(name, args[0], start), value: this.literalArg(name, args[1], start) };
      case "node-type":
        this.assertArgCount(name, args, 1, start);
        return { kind: "node-type-equals", value: this.literalArg(name, args[0], start) };
      case "content-equals":
        this.assertArgCount(name, args, 1, start);
        return { kind: "content-equals", value: this.stringArg(name, args[0], start) };
      case "content-contains":
        this.assertArgCount(name, args, 1, start);
        return { kind: "content-contains", value: this.stringArg(name, args[0], start) };
      case "tag-exact":
        this.assertArgCount(name, args, 1, start);
        return { kind: "tag-equals", tag: this.stringArg(name, args[0], start), normalizeModelTag: false };
      case "not-class-starts-with":
        this.assertArgCount(name, args, 1, start);
        return { kind: "class-not-starts-with", prefix: this.stringArg(name, args[0], start) };
      case "property-exists":
        this.assertArgCount(name, args, 1, start);
        return { kind: "css-property-exists", name: this.stringArg(name, args[0], start) };
      case "rule-selector-equals":
        this.assertArgCountRange(name, args, 1, 2, start);
        return {
          kind: "css-rule-selector-equals",
          selector: this.stringArg(name, args[0], start),
          minifiedCompare: args[1] === void 0 ? true : this.booleanArg(name, args[1], start)
        };
      case "rule-selector-contains":
        this.assertArgCountRange(name, args, 1, 2, start);
        return {
          kind: "css-rule-selector-contains",
          selector: this.stringArg(name, args[0], start),
          minifiedCompare: args[1] === void 0 ? true : this.booleanArg(name, args[1], start)
        };
      case "media-equals":
        this.assertArgCountRange(name, args, 1, 2, start);
        return {
          kind: "css-media-equals",
          selector: this.stringArg(name, args[0], start),
          minifiedCompare: args[1] === void 0 ? false : this.booleanArg(name, args[1], start)
        };
      case "media-contains":
        this.assertArgCount(name, args, 1, start);
        return { kind: "css-media-contains", selector: this.stringArg(name, args[0], start) };
      case "selector-pattern":
        return { kind: "css-selector-pattern", pattern: this.patternArg(name, args, start) };
      default:
        throw queryParseError("unsupported-predicate", 'Unsupported predicate ":'.concat(name, '".'), start, name.length + 1);
    }
  }
  parseArguments(name, start) {
    if (this.peek() !== "(") {
      throw queryParseError("invalid-argument-count", 'Predicate ":'.concat(name, '" requires arguments.'), start, name.length + 1);
    }
    this.index++;
    this.skipWhitespace();
    const args = [];
    if (this.peek() === ")") {
      this.index++;
      return args;
    }
    for (; ; ) {
      const argIndex = this.index;
      args.push({
        value: this.isSelectorArgument(name) ? this.parseSelectorList(")") : this.parseLiteral(),
        index: argIndex
      });
      this.skipWhitespace();
      if (this.peek() === ")") {
        this.index++;
        return args;
      }
      if (this.peek() !== ",") {
        throw queryParseError("unexpected-token", "Function arguments must be comma-separated.", this.index);
      }
      this.index++;
      this.skipWhitespace();
    }
  }
  isSelectorArgument(name) {
    return name === "not" || name === "has" || name === "any-of";
  }
  parseLiteral() {
    const current = this.peek();
    if (current === '"' || current === "'") {
      return this.parseString();
    }
    if (current === "-" || /[0-9]/.test(current)) {
      return this.parseNumber();
    }
    const identifier = this.parseIdentifier("literal");
    if (identifier === "true") {
      return true;
    }
    if (identifier === "false") {
      return false;
    }
    return identifier;
  }
  parseString() {
    const quote = this.peek();
    const start = this.index;
    this.index++;
    let value = "";
    while (!this.isEnd()) {
      const current = this.peek();
      if (current === quote) {
        this.index++;
        return value;
      }
      if (current === "\\") {
        this.index++;
        if (this.isEnd()) {
          break;
        }
        value += this.peek();
        this.index++;
      } else {
        value += current;
        this.index++;
      }
    }
    throw queryParseError("unterminated-string", "String literal is not terminated.", start, this.index - start);
  }
  parseNumber() {
    const start = this.index;
    if (this.peek() === "-") {
      this.index++;
    }
    while (!this.isEnd() && /[0-9]/.test(this.peek())) {
      this.index++;
    }
    if (this.peek() === ".") {
      this.index++;
      while (!this.isEnd() && /[0-9]/.test(this.peek())) {
        this.index++;
      }
    }
    const raw = this.source.slice(start, this.index);
    if (raw === "-" || raw.endsWith(".")) {
      throw queryParseError("invalid-literal", "Invalid number literal.", start, raw.length);
    }
    return Number(raw);
  }
  parseIdentifier(label) {
    const start = this.index;
    if (!identifierStart.test(this.peek())) {
      throw queryParseError("invalid-literal", "Expected ".concat(label, "."), this.index);
    }
    this.index++;
    while (!this.isEnd() && identifierPart.test(this.peek())) {
      this.index++;
    }
    return this.source.slice(start, this.index);
  }
  selectorArgumentToPredicate(arg) {
    const predicates = this.selectorArgumentToPredicates(arg);
    if (predicates.length !== 1) {
      throw queryParseError("unsupported-predicate", ":not(...) supports a single compound selector.", arg.index);
    }
    return predicates[0];
  }
  selectorArgumentToPredicates(arg) {
    const chains = this.selectorArgumentToChains(arg);
    return chains.map((chain) => {
      if (chain.steps.length !== 1) {
        throw queryParseError("unsupported-predicate", ":not(...) supports a single compound selector.", arg.index);
      }
      const predicates = chain.steps[0].compound.predicates;
      return predicates.length === 1 ? predicates[0] : { kind: "all-of", predicates };
    });
  }
  selectorArgumentToChains(arg) {
    if (!Array.isArray(arg.value)) {
      throw queryParseError("invalid-literal", "Expected selector argument.", arg.index);
    }
    return arg.value;
  }
  literalArg(name, arg, start) {
    if (Array.isArray(arg.value)) {
      throw queryParseError("invalid-literal", 'Predicate ":'.concat(name, '" expects a literal argument.'), start);
    }
    return arg.value;
  }
  stringArg(name, arg, start) {
    const value = this.literalArg(name, arg, start);
    if (typeof value !== "string") {
      throw queryParseError("invalid-literal", 'Predicate ":'.concat(name, '" expects a string argument.'), arg.index);
    }
    return value;
  }
  numberArg(name, arg, start) {
    const value = this.literalArg(name, arg, start);
    if (typeof value !== "number" || !Number.isInteger(value) || value < 1) {
      throw queryParseError("invalid-literal", 'Predicate ":'.concat(name, '" expects a positive integer.'), arg.index);
    }
    return value;
  }
  booleanArg(name, arg, start) {
    const value = this.literalArg(name, arg, start);
    if (typeof value !== "boolean") {
      throw queryParseError("invalid-literal", 'Predicate ":'.concat(name, '" expects a boolean argument.'), arg.index);
    }
    return value;
  }
  listArg(name, arg, start) {
    const value = this.stringArg(name, arg, start);
    return value.split("|").map((item) => item.trim()).filter(Boolean);
  }
  patternArg(name, args, start) {
    if (args.length !== 2 && args.length !== 3) {
      throw queryParseError("invalid-argument-count", 'Predicate ":'.concat(name, '" expects 2 or 3 arguments.'), start, name.length + 1);
    }
    const syntax = this.stringArg(name, args[0], start);
    const source = this.stringArg(name, args[1], start);
    const flags = args[2] ? this.stringArg(name, args[2], start) : void 0;
    if (syntax !== "re2") {
      throw queryParseError("invalid-literal", "Only re2 selector patterns are supported.", args[0].index);
    }
    const patternError = getPortableRe2PatternError(source, flags);
    if (patternError) {
      throw queryParseError("invalid-literal", patternError, args[2]?.index ?? args[1].index);
    }
    return { syntax, source, flags };
  }
  assertArgCount(name, args, count, start) {
    if (args.length !== count) {
      throw queryParseError(
        "invalid-argument-count",
        'Predicate ":'.concat(name, '" expects ').concat(count, " argument").concat(count === 1 ? "" : "s", "."),
        start,
        name.length + 1
      );
    }
  }
  assertArgCountAtLeast(name, args, count, start) {
    if (args.length < count) {
      throw queryParseError(
        "invalid-argument-count",
        'Predicate ":'.concat(name, '" expects at least ').concat(count, " argument."),
        start,
        name.length + 1
      );
    }
  }
  assertArgCountRange(name, args, min, max, start) {
    if (args.length < min || args.length > max) {
      throw queryParseError(
        "invalid-argument-count",
        'Predicate ":'.concat(name, '" expects ').concat(min, " to ").concat(max, " arguments."),
        start,
        name.length + 1
      );
    }
  }
  isScopeStep(step) {
    return step.compound.predicates.some((predicate) => predicate.kind === "scope");
  }
  expect(char) {
    if (this.peek() !== char) {
      throw queryParseError("unexpected-token", 'Expected "'.concat(char, '".'), this.index);
    }
    this.index++;
  }
  skipWhitespace() {
    const start = this.index;
    while (!this.isEnd() && this.isWhitespace(this.peek())) {
      this.index++;
    }
    return this.index > start;
  }
  isWhitespace(value) {
    return /\s/.test(value);
  }
  peek() {
    return this.source[this.index] ?? "";
  }
  isEnd() {
    return this.index >= this.source.length;
  }
};

// editor/ui-editor-ui/src/app/model-query/builders.ts
var identifierPattern = /^[a-zA-Z_][a-zA-Z0-9_-]*$/;
var moduleLegacyQueryDialect = /* @__PURE__ */ Symbol("moduleLegacyQueryDialect");
function isQueryGroup(selector) {
  return Array.isArray(selector);
}
function canonicalQuery(selector) {
  return selector;
}
function moduleLegacy(selector) {
  const value = Object(selector);
  Object.defineProperty(value, moduleLegacyQueryDialect, { value: "module-legacy" });
  return value;
}
function getQueryDialect(selector) {
  return selector[moduleLegacyQueryDialect] ?? "canonical";
}
function normalizeCanonicalSelector(selector) {
  return isQueryGroup(selector) ? q.group(...selector) : selector;
}
function formatClassSelector(className) {
  return identifierPattern.test(className) ? ".".concat(className) : ":class-one-of(".concat(formatString(className), ")");
}
function escapeIdentifier(identifier) {
  if (identifierPattern.test(identifier)) {
    return identifier;
  }
  return formatString(identifier);
}
function formatString(value) {
  return '"'.concat(value.replace(/\\/g, "\\\\").replace(/"/g, '\\"'), '"');
}
function formatLiteral(value) {
  if (typeof value === "string") {
    return formatString(value);
  }
  return String(value);
}
var html = Object.assign(
  (selector) => canonicalQuery(selector),
  {
    any: () => canonicalQuery("*"),
    tag: (tag, normalizeModelTag = true) => {
      if (Array.isArray(tag)) {
        const predicate = normalizeModelTag ? ":tag-one-of" : ":tag-one-of-exact";
        return canonicalQuery("".concat(predicate, "(").concat(formatString(tag.join("|")), ")"));
      }
      return normalizeModelTag ? canonicalQuery(escapeIdentifier(tag)) : canonicalQuery(":tag-exact(".concat(escapeIdentifier(tag), ")"));
    },
    tagExact: (tag) => canonicalQuery(":tag-exact(".concat(escapeIdentifier(tag), ")")),
    tagOneOf: (tags, normalizeModelTag = true) => {
      const predicate = normalizeModelTag ? ":tag-one-of" : ":tag-one-of-exact";
      return canonicalQuery("".concat(predicate, "(").concat(formatString(tags.join("|")), ")"));
    },
    className: (className) => canonicalQuery(formatClassSelector(className)),
    classOneOf: (classNames) => canonicalQuery(":class-one-of(".concat(formatString(classNames.join("|")), ")")),
    classStartsWith: (prefix) => canonicalQuery("[class*=".concat(formatString(prefix), "]")),
    notClassName: (className) => canonicalQuery(":not(".concat(formatClassSelector(className), ")")),
    notClassStartsWith: (prefix) => canonicalQuery(":not-class-starts-with(".concat(formatString(prefix), ")")),
    attrExists: (name) => canonicalQuery("[".concat(escapeIdentifier(name), "]")),
    attrEquals: (name, value) => canonicalQuery("[".concat(escapeIdentifier(name), "=").concat(formatLiteral(value), "]")),
    attrStartsWith: (name, prefix) => canonicalQuery("[".concat(escapeIdentifier(name), "^=").concat(formatString(prefix), "]")),
    configExists: (name) => canonicalQuery(":config-exists(".concat(escapeIdentifier(name), ")")),
    configEquals: (name, value) => canonicalQuery(":config-equals(".concat(escapeIdentifier(name), ",").concat(formatLiteral(value), ")")),
    nodeType: (value) => canonicalQuery(":node-type(".concat(formatLiteral(value), ")")),
    contentContains: (value) => canonicalQuery(":content-contains(".concat(formatString(value), ")")),
    contentEquals: (value) => canonicalQuery(":content-equals(".concat(formatString(value), ")")),
    textNotEmpty: () => canonicalQuery(":text-not-empty"),
    hasStyles: () => canonicalQuery(":has-styles"),
    not: (selector) => canonicalQuery(":not(".concat(selector, ")")),
    has: (selector) => canonicalQuery(":has(".concat(selector, ")")),
    nthChild: (index) => canonicalQuery(":nth-child(".concat(index, ")")),
    notLastChild: () => canonicalQuery(":not-last-child"),
    notLastElement: () => canonicalQuery(":not-last-element"),
    child: (left, right) => canonicalQuery("".concat(left, " > ").concat(right)),
    descendant: (left, right) => canonicalQuery("".concat(left, " ").concat(right))
  }
);
var css = Object.assign(
  (selector) => canonicalQuery(selector),
  {
    ruleSelectorEquals: (selector, minifiedCompare = true) => canonicalQuery(":rule-selector-equals(".concat(formatString(selector)).concat(minifiedCompare ? "" : ",false", ")")),
    ruleSelectorContains: (selector, minifiedCompare = true) => canonicalQuery(":rule-selector-contains(".concat(formatString(selector)).concat(minifiedCompare ? "" : ",false", ")")),
    mediaEquals: (selector, minifiedCompare = false) => canonicalQuery(":media-equals(".concat(formatString(selector)).concat(minifiedCompare ? ",true" : "", ")")),
    mediaContains: (selector) => canonicalQuery(":media-contains(".concat(formatString(selector), ")")),
    propertyExists: (name) => canonicalQuery(":property-exists(".concat(escapeIdentifier(name), ")")),
    isRule: () => canonicalQuery(":is-rule"),
    isComment: () => canonicalQuery(":is-comment"),
    selectorPattern: (source, flags = "") => {
      const patternError = getPortableRe2PatternError(source, flags || void 0);
      if (patternError) {
        throw new Error(patternError);
      }
      const args = flags ? '"re2",'.concat(formatString(source), ",").concat(formatString(flags)) : '"re2",'.concat(formatString(source));
      return canonicalQuery(":selector-pattern(".concat(args, ")"));
    }
  }
);
var CanonicalSelectBuilder = class _CanonicalSelectBuilder {
  constructor(area, predicates = [], children = [], target = false, orSelectors = []) {
    this.area = area;
    this.predicates = predicates;
    this.children = children;
    this.target = target;
    this.orSelectors = orSelectors;
  }
  static descendants() {
    return new _CanonicalSelectBuilder("descendants");
  }
  static children() {
    return new _CanonicalSelectBuilder("children");
  }
  clone(props) {
    return new _CanonicalSelectBuilder(
      this.area,
      props.predicates ?? this.predicates,
      props.children ?? this.children,
      props.target ?? this.target,
      props.orSelectors ?? this.orSelectors
    );
  }
  withPredicate(predicate) {
    return this.clone({ predicates: [...this.predicates, predicate] });
  }
  any() {
    return this.withPredicate(html.any());
  }
  root() {
    return this.withPredicate(canonicalQuery(":scope"));
  }
  tag(tag, normalizeModelTag = true) {
    return this.withPredicate(html.tag(tag, normalizeModelTag));
  }
  notTag(tag, normalizeModelTag = true) {
    return this.withPredicate(html.not(html.tag(tag, normalizeModelTag)));
  }
  attr(name, value) {
    return this.withPredicate(html.attrEquals(name, value));
  }
  hasAttr(name) {
    return this.withPredicate(html.attrExists(name));
  }
  attrStartsWith(name, prefix) {
    return this.withPredicate(html.attrStartsWith(name, prefix));
  }
  contentContains(value) {
    return this.withPredicate(html.contentContains(value));
  }
  contentEquals(value) {
    return this.withPredicate(html.contentEquals(value));
  }
  cssAttributeNameEquals(name) {
    return this.withPredicate(css.propertyExists(name));
  }
  nodeType(type) {
    return this.withPredicate(html.nodeType(type));
  }
  hasClass(className) {
    return this.withPredicate(html.className(className));
  }
  hasOneOfClasses(classNames) {
    return this.withPredicate(html.classOneOf(classNames));
  }
  notHasClass(className) {
    return this.withPredicate(html.notClassName(className));
  }
  classStartsWith(classPrefix) {
    return this.withPredicate(html.classStartsWith(classPrefix));
  }
  notClassStartsWith(classPrefix) {
    return this.withPredicate(html.notClassStartsWith(classPrefix));
  }
  hasStyles() {
    return this.withPredicate(html.hasStyles());
  }
  notLastChild() {
    return this.withPredicate(html.notLastChild());
  }
  nthChild(child) {
    return this.withPredicate(html.nthChild(child));
  }
  notLastElement() {
    return this.withPredicate(html.notLastElement());
  }
  notEmptyText() {
    return this.withPredicate(html.textNotEmpty());
  }
  isRule() {
    return this.withPredicate(css.isRule());
  }
  isComment() {
    return this.withPredicate(css.isComment());
  }
  selectorEquals(selector, minifiedCompare = false) {
    return this.withPredicate(css.ruleSelectorEquals(selector, minifiedCompare));
  }
  selectorContains(selector, minifiedCompare = false) {
    return this.withPredicate(css.ruleSelectorContains(selector, minifiedCompare));
  }
  mediaEquals(selector, minifiedCompare = false) {
    return this.withPredicate(css.mediaEquals(selector, minifiedCompare));
  }
  mediaContains(selector) {
    return this.withPredicate(css.mediaContains(selector));
  }
  selectorPattern(source, flags = "") {
    return this.withPredicate(css.selectorPattern(source, flags));
  }
  hasProperty(propertyName) {
    return this.withPredicate(css.propertyExists(propertyName));
  }
  configEquals(name, value) {
    return this.withPredicate(html.configEquals(name, value));
  }
  configExists(name) {
    return this.withPredicate(html.configExists(name));
  }
  or(selector) {
    return this.clone({ orSelectors: [...this.orSelectors, selector] });
  }
  next(selector) {
    return this.clone({ children: [...this.children, selector] });
  }
  contains(selector) {
    return this.clone({ target: true, children: [...this.children, selector] });
  }
  end() {
    return canonicalQuery(this.toChains(true).join(", "));
  }
  toChains(isTopLevel = false) {
    const compound = this.compound();
    if (this.target && this.children.length > 0) {
      const nested = this.children.flatMap((child) => child.toChains(false));
      const targetCompound = "".concat(compound, ":has(").concat(nested.join(", "), ")");
      return this.withTopLevelScopeAlternative([joinCompound(this.area, targetCompound, true)], targetCompound, isTopLevel);
    }
    if (this.children.length === 0) {
      return [joinCompound(this.area, compound, true)];
    }
    return this.children.flatMap((child) => child.toChains().map(
      (chain) => this.withTopLevelScopeAlternative(
        ["".concat(joinCompound(this.area, compound, true)).concat(joinChain(this.childArea(child), chain))],
        compound,
        isTopLevel,
        joinChain(this.childArea(child), chain)
      )
    )).flat();
  }
  withTopLevelScopeAlternative(chains, compound, isTopLevel, suffix = "") {
    if (!isTopLevel) {
      return chains;
    }
    if (this.area === "children" && suffix) {
      return ["".concat(scopeCompound(compound)).concat(suffix)];
    }
    if (this.area === "children") {
      return [scopeCompound(compound)];
    }
    return Array.from(/* @__PURE__ */ new Set([
      "".concat(scopeCompound(compound)).concat(suffix),
      ...chains
    ]));
  }
  childArea(child) {
    return child.area;
  }
  compound() {
    const compound = this.predicates.length > 0 ? this.predicates.join("") : "*";
    if (this.orSelectors.length === 0) {
      return compound;
    }
    return ":any-of(".concat([compound, ...this.orSelectors.map((selector) => selector.compound())].join(","), ")");
  }
};
function scopeCompound(compound) {
  return compound === ":scope" ? compound : "".concat(compound, ":scope");
}
function joinCompound(area, compound, first) {
  if (first && area === "children" && compound !== ":scope") {
    return ":scope > ".concat(compound);
  }
  return compound;
}
function joinChain(area, chain) {
  return area === "children" ? " > ".concat(stripScopePrefix(chain)) : " ".concat(chain);
}
function stripScopePrefix(chain) {
  return chain.startsWith(":scope > ") ? chain.slice(":scope > ".length) : chain;
}
var q = {
  canonical: canonicalQuery,
  moduleLegacy,
  html,
  css,
  select: CanonicalSelectBuilder,
  group(...selectors) {
    return canonicalQuery(selectors.join(", "));
  }
};

export {
  queryParseError,
  parseCanonicalQuery,
  getPortableRe2PatternError,
  canonicalQuery,
  moduleLegacy,
  getQueryDialect,
  normalizeCanonicalSelector,
  formatClassSelector,
  escapeIdentifier,
  formatString,
  formatLiteral,
  CanonicalSelectBuilder,
  q
};

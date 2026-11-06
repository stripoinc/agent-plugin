// editor/ui-editor-ui/src/app/model-query/canonical-parser.ts
var supportedPatternFlags = /^[im]*$/;
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

// editor/ui-editor-ui/src/app/model-query/builders.ts
var identifierPattern = /^[a-zA-Z_][a-zA-Z0-9_-]*$/;
var moduleLegacyQueryDialect = /* @__PURE__ */ Symbol("moduleLegacyQueryDialect");
function canonicalQuery(selector) {
  return selector;
}
function moduleLegacy(selector) {
  const value = Object(selector);
  Object.defineProperty(value, moduleLegacyQueryDialect, { value: "module-legacy" });
  return value;
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
  q
};

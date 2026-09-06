/*!
ajv 8.20.0
The MIT License (MIT)

Copyright (c) 2015-2021 Evgeny Poberezkin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.



---

fast-deep-equal 3.1.3
MIT License

Copyright (c) 2017 Evgeny Poberezkin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.


---

fast-uri 3.1.6
Copyright (c) 2011-2021, Gary Court until https://github.com/garycourt/uri-js/commit/a1acf730b4bba3f1097c9f52e7d9d3aba8cdcaae
Copyright (c) 2021-present The Fastify team <https://github.com/fastify/fastify#team>
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
    * Redistributions of source code must retain the above copyright
      notice, this list of conditions and the following disclaimer.
    * Redistributions in binary form must reproduce the above copyright
      notice, this list of conditions and the following disclaimer in the
      documentation and/or other materials provided with the distribution.
    * The names of any contributors may not be used to endorse or promote
      products derived from this software without specific prior written
      permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDERS AND CONTRIBUTORS BE LIABLE FOR ANY
DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
(INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
(INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

                                  *   *   *

The complete list of contributors can be found at:
- https://github.com/garycourt/uri-js/graphs/contributors

---

json-schema-traverse 1.0.0
MIT License

Copyright (c) 2017 Evgeny Poberezkin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

*/
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/ajv/dist/compile/codegen/code.js
var require_code = __commonJS({
  "node_modules/ajv/dist/compile/codegen/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.regexpCode = exports.getEsmExportName = exports.getProperty = exports.safeStringify = exports.stringify = exports.strConcat = exports.addCodeArg = exports.str = exports._ = exports.nil = exports._Code = exports.Name = exports.IDENTIFIER = exports._CodeOrName = void 0;
    var _CodeOrName = class {
    };
    exports._CodeOrName = _CodeOrName;
    exports.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    var Name = class extends _CodeOrName {
      constructor(s) {
        super();
        if (!exports.IDENTIFIER.test(s))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = s;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return false;
      }
      get names() {
        return { [this.str]: 1 };
      }
    };
    exports.Name = Name;
    var _Code = class extends _CodeOrName {
      constructor(code) {
        super();
        this._items = typeof code === "string" ? [code] : code;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return false;
        const item = this._items[0];
        return item === "" || item === '""';
      }
      get str() {
        var _a;
        return (_a = this._str) !== null && _a !== void 0 ? _a : this._str = this._items.reduce((s, c) => `${s}${c}`, "");
      }
      get names() {
        var _a;
        return (_a = this._names) !== null && _a !== void 0 ? _a : this._names = this._items.reduce((names, c) => {
          if (c instanceof Name)
            names[c.str] = (names[c.str] || 0) + 1;
          return names;
        }, {});
      }
    };
    exports._Code = _Code;
    exports.nil = new _Code("");
    function _(strs, ...args) {
      const code = [strs[0]];
      let i = 0;
      while (i < args.length) {
        addCodeArg(code, args[i]);
        code.push(strs[++i]);
      }
      return new _Code(code);
    }
    exports._ = _;
    var plus = new _Code("+");
    function str(strs, ...args) {
      const expr = [safeStringify(strs[0])];
      let i = 0;
      while (i < args.length) {
        expr.push(plus);
        addCodeArg(expr, args[i]);
        expr.push(plus, safeStringify(strs[++i]));
      }
      optimize(expr);
      return new _Code(expr);
    }
    exports.str = str;
    function addCodeArg(code, arg) {
      if (arg instanceof _Code)
        code.push(...arg._items);
      else if (arg instanceof Name)
        code.push(arg);
      else
        code.push(interpolate(arg));
    }
    exports.addCodeArg = addCodeArg;
    function optimize(expr) {
      let i = 1;
      while (i < expr.length - 1) {
        if (expr[i] === plus) {
          const res = mergeExprItems(expr[i - 1], expr[i + 1]);
          if (res !== void 0) {
            expr.splice(i - 1, 3, res);
            continue;
          }
          expr[i++] = "+";
        }
        i++;
      }
    }
    function mergeExprItems(a, b) {
      if (b === '""')
        return a;
      if (a === '""')
        return b;
      if (typeof a == "string") {
        if (b instanceof Name || a[a.length - 1] !== '"')
          return;
        if (typeof b != "string")
          return `${a.slice(0, -1)}${b}"`;
        if (b[0] === '"')
          return a.slice(0, -1) + b.slice(1);
        return;
      }
      if (typeof b == "string" && b[0] === '"' && !(a instanceof Name))
        return `"${a}${b.slice(1)}`;
      return;
    }
    function strConcat(c1, c2) {
      return c2.emptyStr() ? c1 : c1.emptyStr() ? c2 : str`${c1}${c2}`;
    }
    exports.strConcat = strConcat;
    function interpolate(x) {
      return typeof x == "number" || typeof x == "boolean" || x === null ? x : safeStringify(Array.isArray(x) ? x.join(",") : x);
    }
    function stringify(x) {
      return new _Code(safeStringify(x));
    }
    exports.stringify = stringify;
    function safeStringify(x) {
      return JSON.stringify(x).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    exports.safeStringify = safeStringify;
    function getProperty(key) {
      return typeof key == "string" && exports.IDENTIFIER.test(key) ? new _Code(`.${key}`) : _`[${key}]`;
    }
    exports.getProperty = getProperty;
    function getEsmExportName(key) {
      if (typeof key == "string" && exports.IDENTIFIER.test(key)) {
        return new _Code(`${key}`);
      }
      throw new Error(`CodeGen: invalid export name: ${key}, use explicit $id name mapping`);
    }
    exports.getEsmExportName = getEsmExportName;
    function regexpCode(rx) {
      return new _Code(rx.toString());
    }
    exports.regexpCode = regexpCode;
  }
});

// node_modules/ajv/dist/compile/codegen/scope.js
var require_scope = __commonJS({
  "node_modules/ajv/dist/compile/codegen/scope.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ValueScope = exports.ValueScopeName = exports.Scope = exports.varKinds = exports.UsedValueState = void 0;
    var code_1 = require_code();
    var ValueError = class extends Error {
      constructor(name) {
        super(`CodeGen: "code" for ${name} not defined`);
        this.value = name.value;
      }
    };
    var UsedValueState;
    (function(UsedValueState2) {
      UsedValueState2[UsedValueState2["Started"] = 0] = "Started";
      UsedValueState2[UsedValueState2["Completed"] = 1] = "Completed";
    })(UsedValueState || (exports.UsedValueState = UsedValueState = {}));
    exports.varKinds = {
      const: new code_1.Name("const"),
      let: new code_1.Name("let"),
      var: new code_1.Name("var")
    };
    var Scope = class {
      constructor({ prefixes, parent } = {}) {
        this._names = {};
        this._prefixes = prefixes;
        this._parent = parent;
      }
      toName(nameOrPrefix) {
        return nameOrPrefix instanceof code_1.Name ? nameOrPrefix : this.name(nameOrPrefix);
      }
      name(prefix) {
        return new code_1.Name(this._newName(prefix));
      }
      _newName(prefix) {
        const ng = this._names[prefix] || this._nameGroup(prefix);
        return `${prefix}${ng.index++}`;
      }
      _nameGroup(prefix) {
        var _a, _b;
        if (((_b = (_a = this._parent) === null || _a === void 0 ? void 0 : _a._prefixes) === null || _b === void 0 ? void 0 : _b.has(prefix)) || this._prefixes && !this._prefixes.has(prefix)) {
          throw new Error(`CodeGen: prefix "${prefix}" is not allowed in this scope`);
        }
        return this._names[prefix] = { prefix, index: 0 };
      }
    };
    exports.Scope = Scope;
    var ValueScopeName = class extends code_1.Name {
      constructor(prefix, nameStr) {
        super(nameStr);
        this.prefix = prefix;
      }
      setValue(value, { property, itemIndex }) {
        this.value = value;
        this.scopePath = (0, code_1._)`.${new code_1.Name(property)}[${itemIndex}]`;
      }
    };
    exports.ValueScopeName = ValueScopeName;
    var line = (0, code_1._)`\n`;
    var ValueScope = class extends Scope {
      constructor(opts) {
        super(opts);
        this._values = {};
        this._scope = opts.scope;
        this.opts = { ...opts, _n: opts.lines ? line : code_1.nil };
      }
      get() {
        return this._scope;
      }
      name(prefix) {
        return new ValueScopeName(prefix, this._newName(prefix));
      }
      value(nameOrPrefix, value) {
        var _a;
        if (value.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const name = this.toName(nameOrPrefix);
        const { prefix } = name;
        const valueKey = (_a = value.key) !== null && _a !== void 0 ? _a : value.ref;
        let vs = this._values[prefix];
        if (vs) {
          const _name = vs.get(valueKey);
          if (_name)
            return _name;
        } else {
          vs = this._values[prefix] = /* @__PURE__ */ new Map();
        }
        vs.set(valueKey, name);
        const s = this._scope[prefix] || (this._scope[prefix] = []);
        const itemIndex = s.length;
        s[itemIndex] = value.ref;
        name.setValue(value, { property: prefix, itemIndex });
        return name;
      }
      getValue(prefix, keyOrRef) {
        const vs = this._values[prefix];
        if (!vs)
          return;
        return vs.get(keyOrRef);
      }
      scopeRefs(scopeName, values = this._values) {
        return this._reduceValues(values, (name) => {
          if (name.scopePath === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return (0, code_1._)`${scopeName}${name.scopePath}`;
        });
      }
      scopeCode(values = this._values, usedValues, getCode) {
        return this._reduceValues(values, (name) => {
          if (name.value === void 0)
            throw new Error(`CodeGen: name "${name}" has no value`);
          return name.value.code;
        }, usedValues, getCode);
      }
      _reduceValues(values, valueCode, usedValues = {}, getCode) {
        let code = code_1.nil;
        for (const prefix in values) {
          const vs = values[prefix];
          if (!vs)
            continue;
          const nameSet = usedValues[prefix] = usedValues[prefix] || /* @__PURE__ */ new Map();
          vs.forEach((name) => {
            if (nameSet.has(name))
              return;
            nameSet.set(name, UsedValueState.Started);
            let c = valueCode(name);
            if (c) {
              const def = this.opts.es5 ? exports.varKinds.var : exports.varKinds.const;
              code = (0, code_1._)`${code}${def} ${name} = ${c};${this.opts._n}`;
            } else if (c = getCode === null || getCode === void 0 ? void 0 : getCode(name)) {
              code = (0, code_1._)`${code}${c}${this.opts._n}`;
            } else {
              throw new ValueError(name);
            }
            nameSet.set(name, UsedValueState.Completed);
          });
        }
        return code;
      }
    };
    exports.ValueScope = ValueScope;
  }
});

// node_modules/ajv/dist/compile/codegen/index.js
var require_codegen = __commonJS({
  "node_modules/ajv/dist/compile/codegen/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.or = exports.and = exports.not = exports.CodeGen = exports.operators = exports.varKinds = exports.ValueScopeName = exports.ValueScope = exports.Scope = exports.Name = exports.regexpCode = exports.stringify = exports.getProperty = exports.nil = exports.strConcat = exports.str = exports._ = void 0;
    var code_1 = require_code();
    var scope_1 = require_scope();
    var code_2 = require_code();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return code_2._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return code_2.str;
    } });
    Object.defineProperty(exports, "strConcat", { enumerable: true, get: function() {
      return code_2.strConcat;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return code_2.nil;
    } });
    Object.defineProperty(exports, "getProperty", { enumerable: true, get: function() {
      return code_2.getProperty;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return code_2.stringify;
    } });
    Object.defineProperty(exports, "regexpCode", { enumerable: true, get: function() {
      return code_2.regexpCode;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return code_2.Name;
    } });
    var scope_2 = require_scope();
    Object.defineProperty(exports, "Scope", { enumerable: true, get: function() {
      return scope_2.Scope;
    } });
    Object.defineProperty(exports, "ValueScope", { enumerable: true, get: function() {
      return scope_2.ValueScope;
    } });
    Object.defineProperty(exports, "ValueScopeName", { enumerable: true, get: function() {
      return scope_2.ValueScopeName;
    } });
    Object.defineProperty(exports, "varKinds", { enumerable: true, get: function() {
      return scope_2.varKinds;
    } });
    exports.operators = {
      GT: new code_1._Code(">"),
      GTE: new code_1._Code(">="),
      LT: new code_1._Code("<"),
      LTE: new code_1._Code("<="),
      EQ: new code_1._Code("==="),
      NEQ: new code_1._Code("!=="),
      NOT: new code_1._Code("!"),
      OR: new code_1._Code("||"),
      AND: new code_1._Code("&&"),
      ADD: new code_1._Code("+")
    };
    var Node = class {
      optimizeNodes() {
        return this;
      }
      optimizeNames(_names, _constants) {
        return this;
      }
    };
    var Def = class extends Node {
      constructor(varKind, name, rhs) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.rhs = rhs;
      }
      render({ es5, _n }) {
        const varKind = es5 ? scope_1.varKinds.var : this.varKind;
        const rhs = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${varKind} ${this.name}${rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (!names[this.name.str])
          return;
        if (this.rhs)
          this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        return this.rhs instanceof code_1._CodeOrName ? this.rhs.names : {};
      }
    };
    var Assign = class extends Node {
      constructor(lhs, rhs, sideEffects) {
        super();
        this.lhs = lhs;
        this.rhs = rhs;
        this.sideEffects = sideEffects;
      }
      render({ _n }) {
        return `${this.lhs} = ${this.rhs};` + _n;
      }
      optimizeNames(names, constants) {
        if (this.lhs instanceof code_1.Name && !names[this.lhs.str] && !this.sideEffects)
          return;
        this.rhs = optimizeExpr(this.rhs, names, constants);
        return this;
      }
      get names() {
        const names = this.lhs instanceof code_1.Name ? {} : { ...this.lhs.names };
        return addExprNames(names, this.rhs);
      }
    };
    var AssignOp = class extends Assign {
      constructor(lhs, op, rhs, sideEffects) {
        super(lhs, rhs, sideEffects);
        this.op = op;
      }
      render({ _n }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + _n;
      }
    };
    var Label = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        return `${this.label}:` + _n;
      }
    };
    var Break = class extends Node {
      constructor(label) {
        super();
        this.label = label;
        this.names = {};
      }
      render({ _n }) {
        const label = this.label ? ` ${this.label}` : "";
        return `break${label};` + _n;
      }
    };
    var Throw = class extends Node {
      constructor(error) {
        super();
        this.error = error;
      }
      render({ _n }) {
        return `throw ${this.error};` + _n;
      }
      get names() {
        return this.error.names;
      }
    };
    var AnyCode = class extends Node {
      constructor(code) {
        super();
        this.code = code;
      }
      render({ _n }) {
        return `${this.code};` + _n;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(names, constants) {
        this.code = optimizeExpr(this.code, names, constants);
        return this;
      }
      get names() {
        return this.code instanceof code_1._CodeOrName ? this.code.names : {};
      }
    };
    var ParentNode = class extends Node {
      constructor(nodes = []) {
        super();
        this.nodes = nodes;
      }
      render(opts) {
        return this.nodes.reduce((code, n) => code + n.render(opts), "");
      }
      optimizeNodes() {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i].optimizeNodes();
          if (Array.isArray(n))
            nodes.splice(i, 1, ...n);
          else if (n)
            nodes[i] = n;
          else
            nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      optimizeNames(names, constants) {
        const { nodes } = this;
        let i = nodes.length;
        while (i--) {
          const n = nodes[i];
          if (n.optimizeNames(names, constants))
            continue;
          subtractNames(names, n.names);
          nodes.splice(i, 1);
        }
        return nodes.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((names, n) => addNames(names, n.names), {});
      }
    };
    var BlockNode = class extends ParentNode {
      render(opts) {
        return "{" + opts._n + super.render(opts) + "}" + opts._n;
      }
    };
    var Root = class extends ParentNode {
    };
    var Else = class extends BlockNode {
    };
    Else.kind = "else";
    var If = class _If extends BlockNode {
      constructor(condition, nodes) {
        super(nodes);
        this.condition = condition;
      }
      render(opts) {
        let code = `if(${this.condition})` + super.render(opts);
        if (this.else)
          code += "else " + this.else.render(opts);
        return code;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const cond = this.condition;
        if (cond === true)
          return this.nodes;
        let e = this.else;
        if (e) {
          const ns = e.optimizeNodes();
          e = this.else = Array.isArray(ns) ? new Else(ns) : ns;
        }
        if (e) {
          if (cond === false)
            return e instanceof _If ? e : e.nodes;
          if (this.nodes.length)
            return this;
          return new _If(not(cond), e instanceof _If ? [e] : e.nodes);
        }
        if (cond === false || !this.nodes.length)
          return void 0;
        return this;
      }
      optimizeNames(names, constants) {
        var _a;
        this.else = (_a = this.else) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
        if (!(super.optimizeNames(names, constants) || this.else))
          return;
        this.condition = optimizeExpr(this.condition, names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        addExprNames(names, this.condition);
        if (this.else)
          addNames(names, this.else.names);
        return names;
      }
    };
    If.kind = "if";
    var For = class extends BlockNode {
    };
    For.kind = "for";
    var ForLoop = class extends For {
      constructor(iteration) {
        super();
        this.iteration = iteration;
      }
      render(opts) {
        return `for(${this.iteration})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iteration = optimizeExpr(this.iteration, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iteration.names);
      }
    };
    var ForRange = class extends For {
      constructor(varKind, name, from, to) {
        super();
        this.varKind = varKind;
        this.name = name;
        this.from = from;
        this.to = to;
      }
      render(opts) {
        const varKind = opts.es5 ? scope_1.varKinds.var : this.varKind;
        const { name, from, to } = this;
        return `for(${varKind} ${name}=${from}; ${name}<${to}; ${name}++)` + super.render(opts);
      }
      get names() {
        const names = addExprNames(super.names, this.from);
        return addExprNames(names, this.to);
      }
    };
    var ForIter = class extends For {
      constructor(loop, varKind, name, iterable) {
        super();
        this.loop = loop;
        this.varKind = varKind;
        this.name = name;
        this.iterable = iterable;
      }
      render(opts) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(opts);
      }
      optimizeNames(names, constants) {
        if (!super.optimizeNames(names, constants))
          return;
        this.iterable = optimizeExpr(this.iterable, names, constants);
        return this;
      }
      get names() {
        return addNames(super.names, this.iterable.names);
      }
    };
    var Func = class extends BlockNode {
      constructor(name, args, async) {
        super();
        this.name = name;
        this.args = args;
        this.async = async;
      }
      render(opts) {
        const _async = this.async ? "async " : "";
        return `${_async}function ${this.name}(${this.args})` + super.render(opts);
      }
    };
    Func.kind = "func";
    var Return = class extends ParentNode {
      render(opts) {
        return "return " + super.render(opts);
      }
    };
    Return.kind = "return";
    var Try = class extends BlockNode {
      render(opts) {
        let code = "try" + super.render(opts);
        if (this.catch)
          code += this.catch.render(opts);
        if (this.finally)
          code += this.finally.render(opts);
        return code;
      }
      optimizeNodes() {
        var _a, _b;
        super.optimizeNodes();
        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNodes();
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNodes();
        return this;
      }
      optimizeNames(names, constants) {
        var _a, _b;
        super.optimizeNames(names, constants);
        (_a = this.catch) === null || _a === void 0 ? void 0 : _a.optimizeNames(names, constants);
        (_b = this.finally) === null || _b === void 0 ? void 0 : _b.optimizeNames(names, constants);
        return this;
      }
      get names() {
        const names = super.names;
        if (this.catch)
          addNames(names, this.catch.names);
        if (this.finally)
          addNames(names, this.finally.names);
        return names;
      }
    };
    var Catch = class extends BlockNode {
      constructor(error) {
        super();
        this.error = error;
      }
      render(opts) {
        return `catch(${this.error})` + super.render(opts);
      }
    };
    Catch.kind = "catch";
    var Finally = class extends BlockNode {
      render(opts) {
        return "finally" + super.render(opts);
      }
    };
    Finally.kind = "finally";
    var CodeGen = class {
      constructor(extScope, opts = {}) {
        this._values = {};
        this._blockStarts = [];
        this._constants = {};
        this.opts = { ...opts, _n: opts.lines ? "\n" : "" };
        this._extScope = extScope;
        this._scope = new scope_1.Scope({ parent: extScope });
        this._nodes = [new Root()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(prefix) {
        return this._scope.name(prefix);
      }
      // reserves unique name in the external scope
      scopeName(prefix) {
        return this._extScope.name(prefix);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(prefixOrName, value) {
        const name = this._extScope.value(prefixOrName, value);
        const vs = this._values[name.prefix] || (this._values[name.prefix] = /* @__PURE__ */ new Set());
        vs.add(name);
        return name;
      }
      getScopeValue(prefix, keyOrRef) {
        return this._extScope.getValue(prefix, keyOrRef);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(scopeName) {
        return this._extScope.scopeRefs(scopeName, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(varKind, nameOrPrefix, rhs, constant) {
        const name = this._scope.toName(nameOrPrefix);
        if (rhs !== void 0 && constant)
          this._constants[name.str] = rhs;
        this._leafNode(new Def(varKind, name, rhs));
        return name;
      }
      // `const` declaration (`var` in es5 mode)
      const(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.const, nameOrPrefix, rhs, _constant);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.let, nameOrPrefix, rhs, _constant);
      }
      // `var` declaration with optional assignment
      var(nameOrPrefix, rhs, _constant) {
        return this._def(scope_1.varKinds.var, nameOrPrefix, rhs, _constant);
      }
      // assignment code
      assign(lhs, rhs, sideEffects) {
        return this._leafNode(new Assign(lhs, rhs, sideEffects));
      }
      // `+=` code
      add(lhs, rhs) {
        return this._leafNode(new AssignOp(lhs, exports.operators.ADD, rhs));
      }
      // appends passed SafeExpr to code or executes Block
      code(c) {
        if (typeof c == "function")
          c();
        else if (c !== code_1.nil)
          this._leafNode(new AnyCode(c));
        return this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...keyValues) {
        const code = ["{"];
        for (const [key, value] of keyValues) {
          if (code.length > 1)
            code.push(",");
          code.push(key);
          if (key !== value || this.opts.es5) {
            code.push(":");
            (0, code_1.addCodeArg)(code, value);
          }
        }
        code.push("}");
        return new code_1._Code(code);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(condition, thenBody, elseBody) {
        this._blockNode(new If(condition));
        if (thenBody && elseBody) {
          this.code(thenBody).else().code(elseBody).endIf();
        } else if (thenBody) {
          this.code(thenBody).endIf();
        } else if (elseBody) {
          throw new Error('CodeGen: "else" body without "then" body');
        }
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(condition) {
        return this._elseNode(new If(condition));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new Else());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(If, Else);
      }
      _for(node, forBody) {
        this._blockNode(node);
        if (forBody)
          this.code(forBody).endFor();
        return this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(iteration, forBody) {
        return this._for(new ForLoop(iteration), forBody);
      }
      // `for` statement for a range of values
      forRange(nameOrPrefix, from, to, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.let) {
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForRange(varKind, name, from, to), () => forBody(name));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(nameOrPrefix, iterable, forBody, varKind = scope_1.varKinds.const) {
        const name = this._scope.toName(nameOrPrefix);
        if (this.opts.es5) {
          const arr = iterable instanceof code_1.Name ? iterable : this.var("_arr", iterable);
          return this.forRange("_i", 0, (0, code_1._)`${arr}.length`, (i) => {
            this.var(name, (0, code_1._)`${arr}[${i}]`);
            forBody(name);
          });
        }
        return this._for(new ForIter("of", varKind, name, iterable), () => forBody(name));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(nameOrPrefix, obj, forBody, varKind = this.opts.es5 ? scope_1.varKinds.var : scope_1.varKinds.const) {
        if (this.opts.ownProperties) {
          return this.forOf(nameOrPrefix, (0, code_1._)`Object.keys(${obj})`, forBody);
        }
        const name = this._scope.toName(nameOrPrefix);
        return this._for(new ForIter("in", varKind, name, obj), () => forBody(name));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(For);
      }
      // `label` statement
      label(label) {
        return this._leafNode(new Label(label));
      }
      // `break` statement
      break(label) {
        return this._leafNode(new Break(label));
      }
      // `return` statement
      return(value) {
        const node = new Return();
        this._blockNode(node);
        this.code(value);
        if (node.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(Return);
      }
      // `try` statement
      try(tryBody, catchCode, finallyCode) {
        if (!catchCode && !finallyCode)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const node = new Try();
        this._blockNode(node);
        this.code(tryBody);
        if (catchCode) {
          const error = this.name("e");
          this._currNode = node.catch = new Catch(error);
          catchCode(error);
        }
        if (finallyCode) {
          this._currNode = node.finally = new Finally();
          this.code(finallyCode);
        }
        return this._endBlockNode(Catch, Finally);
      }
      // `throw` statement
      throw(error) {
        return this._leafNode(new Throw(error));
      }
      // start self-balancing block
      block(body, nodeCount) {
        this._blockStarts.push(this._nodes.length);
        if (body)
          this.code(body).endBlock(nodeCount);
        return this;
      }
      // end the current self-balancing block
      endBlock(nodeCount) {
        const len = this._blockStarts.pop();
        if (len === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const toClose = this._nodes.length - len;
        if (toClose < 0 || nodeCount !== void 0 && toClose !== nodeCount) {
          throw new Error(`CodeGen: wrong number of nodes: ${toClose} vs ${nodeCount} expected`);
        }
        this._nodes.length = len;
        return this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(name, args = code_1.nil, async, funcBody) {
        this._blockNode(new Func(name, args, async));
        if (funcBody)
          this.code(funcBody).endFunc();
        return this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(Func);
      }
      optimize(n = 1) {
        while (n-- > 0) {
          this._root.optimizeNodes();
          this._root.optimizeNames(this._root.names, this._constants);
        }
      }
      _leafNode(node) {
        this._currNode.nodes.push(node);
        return this;
      }
      _blockNode(node) {
        this._currNode.nodes.push(node);
        this._nodes.push(node);
      }
      _endBlockNode(N1, N2) {
        const n = this._currNode;
        if (n instanceof N1 || N2 && n instanceof N2) {
          this._nodes.pop();
          return this;
        }
        throw new Error(`CodeGen: not in block "${N2 ? `${N1.kind}/${N2.kind}` : N1.kind}"`);
      }
      _elseNode(node) {
        const n = this._currNode;
        if (!(n instanceof If)) {
          throw new Error('CodeGen: "else" without "if"');
        }
        this._currNode = n.else = node;
        return this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const ns = this._nodes;
        return ns[ns.length - 1];
      }
      set _currNode(node) {
        const ns = this._nodes;
        ns[ns.length - 1] = node;
      }
    };
    exports.CodeGen = CodeGen;
    function addNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) + (from[n] || 0);
      return names;
    }
    function addExprNames(names, from) {
      return from instanceof code_1._CodeOrName ? addNames(names, from.names) : names;
    }
    function optimizeExpr(expr, names, constants) {
      if (expr instanceof code_1.Name)
        return replaceName(expr);
      if (!canOptimize(expr))
        return expr;
      return new code_1._Code(expr._items.reduce((items, c) => {
        if (c instanceof code_1.Name)
          c = replaceName(c);
        if (c instanceof code_1._Code)
          items.push(...c._items);
        else
          items.push(c);
        return items;
      }, []));
      function replaceName(n) {
        const c = constants[n.str];
        if (c === void 0 || names[n.str] !== 1)
          return n;
        delete names[n.str];
        return c;
      }
      function canOptimize(e) {
        return e instanceof code_1._Code && e._items.some((c) => c instanceof code_1.Name && names[c.str] === 1 && constants[c.str] !== void 0);
      }
    }
    function subtractNames(names, from) {
      for (const n in from)
        names[n] = (names[n] || 0) - (from[n] || 0);
    }
    function not(x) {
      return typeof x == "boolean" || typeof x == "number" || x === null ? !x : (0, code_1._)`!${par(x)}`;
    }
    exports.not = not;
    var andCode = mappend(exports.operators.AND);
    function and(...args) {
      return args.reduce(andCode);
    }
    exports.and = and;
    var orCode = mappend(exports.operators.OR);
    function or(...args) {
      return args.reduce(orCode);
    }
    exports.or = or;
    function mappend(op) {
      return (x, y) => x === code_1.nil ? y : y === code_1.nil ? x : (0, code_1._)`${par(x)} ${op} ${par(y)}`;
    }
    function par(x) {
      return x instanceof code_1.Name ? x : (0, code_1._)`(${x})`;
    }
  }
});

// node_modules/ajv/dist/compile/util.js
var require_util = __commonJS({
  "node_modules/ajv/dist/compile/util.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.checkStrictMode = exports.getErrorPath = exports.Type = exports.useFunc = exports.setEvaluated = exports.evaluatedPropsToName = exports.mergeEvaluated = exports.eachItem = exports.unescapeJsonPointer = exports.escapeJsonPointer = exports.escapeFragment = exports.unescapeFragment = exports.schemaRefOrVal = exports.schemaHasRulesButRef = exports.schemaHasRules = exports.checkUnknownRules = exports.alwaysValidSchema = exports.toHash = void 0;
    var codegen_1 = require_codegen();
    var code_1 = require_code();
    function toHash(arr) {
      const hash = {};
      for (const item of arr)
        hash[item] = true;
      return hash;
    }
    exports.toHash = toHash;
    function alwaysValidSchema(it, schema) {
      if (typeof schema == "boolean")
        return schema;
      if (Object.keys(schema).length === 0)
        return true;
      checkUnknownRules(it, schema);
      return !schemaHasRules(schema, it.self.RULES.all);
    }
    exports.alwaysValidSchema = alwaysValidSchema;
    function checkUnknownRules(it, schema = it.schema) {
      const { opts, self } = it;
      if (!opts.strictSchema)
        return;
      if (typeof schema === "boolean")
        return;
      const rules = self.RULES.keywords;
      for (const key in schema) {
        if (!rules[key])
          checkStrictMode(it, `unknown keyword: "${key}"`);
      }
    }
    exports.checkUnknownRules = checkUnknownRules;
    function schemaHasRules(schema, rules) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (rules[key])
          return true;
      return false;
    }
    exports.schemaHasRules = schemaHasRules;
    function schemaHasRulesButRef(schema, RULES) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (key !== "$ref" && RULES.all[key])
          return true;
      return false;
    }
    exports.schemaHasRulesButRef = schemaHasRulesButRef;
    function schemaRefOrVal({ topSchemaRef, schemaPath }, schema, keyword, $data) {
      if (!$data) {
        if (typeof schema == "number" || typeof schema == "boolean")
          return schema;
        if (typeof schema == "string")
          return (0, codegen_1._)`${schema}`;
      }
      return (0, codegen_1._)`${topSchemaRef}${schemaPath}${(0, codegen_1.getProperty)(keyword)}`;
    }
    exports.schemaRefOrVal = schemaRefOrVal;
    function unescapeFragment(str) {
      return unescapeJsonPointer(decodeURIComponent(str));
    }
    exports.unescapeFragment = unescapeFragment;
    function escapeFragment(str) {
      return encodeURIComponent(escapeJsonPointer(str));
    }
    exports.escapeFragment = escapeFragment;
    function escapeJsonPointer(str) {
      if (typeof str == "number")
        return `${str}`;
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
    exports.escapeJsonPointer = escapeJsonPointer;
    function unescapeJsonPointer(str) {
      return str.replace(/~1/g, "/").replace(/~0/g, "~");
    }
    exports.unescapeJsonPointer = unescapeJsonPointer;
    function eachItem(xs, f) {
      if (Array.isArray(xs)) {
        for (const x of xs)
          f(x);
      } else {
        f(xs);
      }
    }
    exports.eachItem = eachItem;
    function makeMergeEvaluated({ mergeNames, mergeToName, mergeValues, resultToName }) {
      return (gen, from, to, toName) => {
        const res = to === void 0 ? from : to instanceof codegen_1.Name ? (from instanceof codegen_1.Name ? mergeNames(gen, from, to) : mergeToName(gen, from, to), to) : from instanceof codegen_1.Name ? (mergeToName(gen, to, from), from) : mergeValues(from, to);
        return toName === codegen_1.Name && !(res instanceof codegen_1.Name) ? resultToName(gen, res) : res;
      };
    }
    exports.mergeEvaluated = {
      props: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => {
          gen.if((0, codegen_1._)`${from} === true`, () => gen.assign(to, true), () => gen.assign(to, (0, codegen_1._)`${to} || {}`).code((0, codegen_1._)`Object.assign(${to}, ${from})`));
        }),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => {
          if (from === true) {
            gen.assign(to, true);
          } else {
            gen.assign(to, (0, codegen_1._)`${to} || {}`);
            setEvaluated(gen, to, from);
          }
        }),
        mergeValues: (from, to) => from === true ? true : { ...from, ...to },
        resultToName: evaluatedPropsToName
      }),
      items: makeMergeEvaluated({
        mergeNames: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true && ${from} !== undefined`, () => gen.assign(to, (0, codegen_1._)`${from} === true ? true : ${to} > ${from} ? ${to} : ${from}`)),
        mergeToName: (gen, from, to) => gen.if((0, codegen_1._)`${to} !== true`, () => gen.assign(to, from === true ? true : (0, codegen_1._)`${to} > ${from} ? ${to} : ${from}`)),
        mergeValues: (from, to) => from === true ? true : Math.max(from, to),
        resultToName: (gen, items) => gen.var("items", items)
      })
    };
    function evaluatedPropsToName(gen, ps) {
      if (ps === true)
        return gen.var("props", true);
      const props = gen.var("props", (0, codegen_1._)`{}`);
      if (ps !== void 0)
        setEvaluated(gen, props, ps);
      return props;
    }
    exports.evaluatedPropsToName = evaluatedPropsToName;
    function setEvaluated(gen, props, ps) {
      Object.keys(ps).forEach((p) => gen.assign((0, codegen_1._)`${props}${(0, codegen_1.getProperty)(p)}`, true));
    }
    exports.setEvaluated = setEvaluated;
    var snippets = {};
    function useFunc(gen, f) {
      return gen.scopeValue("func", {
        ref: f,
        code: snippets[f.code] || (snippets[f.code] = new code_1._Code(f.code))
      });
    }
    exports.useFunc = useFunc;
    var Type;
    (function(Type2) {
      Type2[Type2["Num"] = 0] = "Num";
      Type2[Type2["Str"] = 1] = "Str";
    })(Type || (exports.Type = Type = {}));
    function getErrorPath(dataProp, dataPropType, jsPropertySyntax) {
      if (dataProp instanceof codegen_1.Name) {
        const isNumber = dataPropType === Type.Num;
        return jsPropertySyntax ? isNumber ? (0, codegen_1._)`"[" + ${dataProp} + "]"` : (0, codegen_1._)`"['" + ${dataProp} + "']"` : isNumber ? (0, codegen_1._)`"/" + ${dataProp}` : (0, codegen_1._)`"/" + ${dataProp}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
      }
      return jsPropertySyntax ? (0, codegen_1.getProperty)(dataProp).toString() : "/" + escapeJsonPointer(dataProp);
    }
    exports.getErrorPath = getErrorPath;
    function checkStrictMode(it, msg, mode = it.opts.strictSchema) {
      if (!mode)
        return;
      msg = `strict mode: ${msg}`;
      if (mode === true)
        throw new Error(msg);
      it.self.logger.warn(msg);
    }
    exports.checkStrictMode = checkStrictMode;
  }
});

// node_modules/ajv/dist/compile/names.js
var require_names = __commonJS({
  "node_modules/ajv/dist/compile/names.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var names = {
      // validation function arguments
      data: new codegen_1.Name("data"),
      // data passed to validation function
      // args passed from referencing schema
      valCxt: new codegen_1.Name("valCxt"),
      // validation/data context - should not be used directly, it is destructured to the names below
      instancePath: new codegen_1.Name("instancePath"),
      parentData: new codegen_1.Name("parentData"),
      parentDataProperty: new codegen_1.Name("parentDataProperty"),
      rootData: new codegen_1.Name("rootData"),
      // root data - same as the data passed to the first/top validation function
      dynamicAnchors: new codegen_1.Name("dynamicAnchors"),
      // used to support recursiveRef and dynamicRef
      // function scoped variables
      vErrors: new codegen_1.Name("vErrors"),
      // null or array of validation errors
      errors: new codegen_1.Name("errors"),
      // counter of validation errors
      this: new codegen_1.Name("this"),
      // "globals"
      self: new codegen_1.Name("self"),
      scope: new codegen_1.Name("scope"),
      // JTD serialize/parse name for JSON string and position
      json: new codegen_1.Name("json"),
      jsonPos: new codegen_1.Name("jsonPos"),
      jsonLen: new codegen_1.Name("jsonLen"),
      jsonPart: new codegen_1.Name("jsonPart")
    };
    exports.default = names;
  }
});

// node_modules/ajv/dist/compile/errors.js
var require_errors = __commonJS({
  "node_modules/ajv/dist/compile/errors.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendErrors = exports.resetErrorsCount = exports.reportExtraError = exports.reportError = exports.keyword$DataError = exports.keywordError = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    exports.keywordError = {
      message: ({ keyword }) => (0, codegen_1.str)`must pass "${keyword}" keyword validation`
    };
    exports.keyword$DataError = {
      message: ({ keyword, schemaType }) => schemaType ? (0, codegen_1.str)`"${keyword}" keyword must be ${schemaType} ($data)` : (0, codegen_1.str)`"${keyword}" keyword is invalid ($data)`
    };
    function reportError(cxt, error = exports.keywordError, errorPaths, overrideAllErrors) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      if (overrideAllErrors !== null && overrideAllErrors !== void 0 ? overrideAllErrors : compositeRule || allErrors) {
        addError(gen, errObj);
      } else {
        returnErrors(it, (0, codegen_1._)`[${errObj}]`);
      }
    }
    exports.reportError = reportError;
    function reportExtraError(cxt, error = exports.keywordError, errorPaths) {
      const { it } = cxt;
      const { gen, compositeRule, allErrors } = it;
      const errObj = errorObjectCode(cxt, error, errorPaths);
      addError(gen, errObj);
      if (!(compositeRule || allErrors)) {
        returnErrors(it, names_1.default.vErrors);
      }
    }
    exports.reportExtraError = reportExtraError;
    function resetErrorsCount(gen, errsCount) {
      gen.assign(names_1.default.errors, errsCount);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} !== null`, () => gen.if(errsCount, () => gen.assign((0, codegen_1._)`${names_1.default.vErrors}.length`, errsCount), () => gen.assign(names_1.default.vErrors, null)));
    }
    exports.resetErrorsCount = resetErrorsCount;
    function extendErrors({ gen, keyword, schemaValue, data, errsCount, it }) {
      if (errsCount === void 0)
        throw new Error("ajv implementation error");
      const err = gen.name("err");
      gen.forRange("i", errsCount, names_1.default.errors, (i) => {
        gen.const(err, (0, codegen_1._)`${names_1.default.vErrors}[${i}]`);
        gen.if((0, codegen_1._)`${err}.instancePath === undefined`, () => gen.assign((0, codegen_1._)`${err}.instancePath`, (0, codegen_1.strConcat)(names_1.default.instancePath, it.errorPath)));
        gen.assign((0, codegen_1._)`${err}.schemaPath`, (0, codegen_1.str)`${it.errSchemaPath}/${keyword}`);
        if (it.opts.verbose) {
          gen.assign((0, codegen_1._)`${err}.schema`, schemaValue);
          gen.assign((0, codegen_1._)`${err}.data`, data);
        }
      });
    }
    exports.extendErrors = extendErrors;
    function addError(gen, errObj) {
      const err = gen.const("err", errObj);
      gen.if((0, codegen_1._)`${names_1.default.vErrors} === null`, () => gen.assign(names_1.default.vErrors, (0, codegen_1._)`[${err}]`), (0, codegen_1._)`${names_1.default.vErrors}.push(${err})`);
      gen.code((0, codegen_1._)`${names_1.default.errors}++`);
    }
    function returnErrors(it, errs) {
      const { gen, validateName, schemaEnv } = it;
      if (schemaEnv.$async) {
        gen.throw((0, codegen_1._)`new ${it.ValidationError}(${errs})`);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, errs);
        gen.return(false);
      }
    }
    var E = {
      keyword: new codegen_1.Name("keyword"),
      schemaPath: new codegen_1.Name("schemaPath"),
      // also used in JTD errors
      params: new codegen_1.Name("params"),
      propertyName: new codegen_1.Name("propertyName"),
      message: new codegen_1.Name("message"),
      schema: new codegen_1.Name("schema"),
      parentSchema: new codegen_1.Name("parentSchema")
    };
    function errorObjectCode(cxt, error, errorPaths) {
      const { createErrors } = cxt.it;
      if (createErrors === false)
        return (0, codegen_1._)`{}`;
      return errorObject(cxt, error, errorPaths);
    }
    function errorObject(cxt, error, errorPaths = {}) {
      const { gen, it } = cxt;
      const keyValues = [
        errorInstancePath(it, errorPaths),
        errorSchemaPath(cxt, errorPaths)
      ];
      extraErrorProps(cxt, error, keyValues);
      return gen.object(...keyValues);
    }
    function errorInstancePath({ errorPath }, { instancePath }) {
      const instPath = instancePath ? (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(instancePath, util_1.Type.Str)}` : errorPath;
      return [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, instPath)];
    }
    function errorSchemaPath({ keyword, it: { errSchemaPath } }, { schemaPath, parentSchema }) {
      let schPath = parentSchema ? errSchemaPath : (0, codegen_1.str)`${errSchemaPath}/${keyword}`;
      if (schemaPath) {
        schPath = (0, codegen_1.str)`${schPath}${(0, util_1.getErrorPath)(schemaPath, util_1.Type.Str)}`;
      }
      return [E.schemaPath, schPath];
    }
    function extraErrorProps(cxt, { params, message }, keyValues) {
      const { keyword, data, schemaValue, it } = cxt;
      const { opts, propertyName, topSchemaRef, schemaPath } = it;
      keyValues.push([E.keyword, keyword], [E.params, typeof params == "function" ? params(cxt) : params || (0, codegen_1._)`{}`]);
      if (opts.messages) {
        keyValues.push([E.message, typeof message == "function" ? message(cxt) : message]);
      }
      if (opts.verbose) {
        keyValues.push([E.schema, schemaValue], [E.parentSchema, (0, codegen_1._)`${topSchemaRef}${schemaPath}`], [names_1.default.data, data]);
      }
      if (propertyName)
        keyValues.push([E.propertyName, propertyName]);
    }
  }
});

// node_modules/ajv/dist/compile/validate/boolSchema.js
var require_boolSchema = __commonJS({
  "node_modules/ajv/dist/compile/validate/boolSchema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.boolOrEmptySchema = exports.topBoolOrEmptySchema = void 0;
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var boolError = {
      message: "boolean schema is false"
    };
    function topBoolOrEmptySchema(it) {
      const { gen, schema, validateName } = it;
      if (schema === false) {
        falseSchemaError(it, false);
      } else if (typeof schema == "object" && schema.$async === true) {
        gen.return(names_1.default.data);
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, null);
        gen.return(true);
      }
    }
    exports.topBoolOrEmptySchema = topBoolOrEmptySchema;
    function boolOrEmptySchema(it, valid) {
      const { gen, schema } = it;
      if (schema === false) {
        gen.var(valid, false);
        falseSchemaError(it);
      } else {
        gen.var(valid, true);
      }
    }
    exports.boolOrEmptySchema = boolOrEmptySchema;
    function falseSchemaError(it, overrideAllErrors) {
      const { gen, data } = it;
      const cxt = {
        gen,
        keyword: "false schema",
        data,
        schema: false,
        schemaCode: false,
        schemaValue: false,
        params: {},
        it
      };
      (0, errors_1.reportError)(cxt, boolError, void 0, overrideAllErrors);
    }
  }
});

// node_modules/ajv/dist/compile/rules.js
var require_rules = __commonJS({
  "node_modules/ajv/dist/compile/rules.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getRules = exports.isJSONType = void 0;
    var _jsonTypes = ["string", "number", "integer", "boolean", "null", "object", "array"];
    var jsonTypes = new Set(_jsonTypes);
    function isJSONType(x) {
      return typeof x == "string" && jsonTypes.has(x);
    }
    exports.isJSONType = isJSONType;
    function getRules() {
      const groups = {
        number: { type: "number", rules: [] },
        string: { type: "string", rules: [] },
        array: { type: "array", rules: [] },
        object: { type: "object", rules: [] }
      };
      return {
        types: { ...groups, integer: true, boolean: true, null: true },
        rules: [{ rules: [] }, groups.number, groups.string, groups.array, groups.object],
        post: { rules: [] },
        all: {},
        keywords: {}
      };
    }
    exports.getRules = getRules;
  }
});

// node_modules/ajv/dist/compile/validate/applicability.js
var require_applicability = __commonJS({
  "node_modules/ajv/dist/compile/validate/applicability.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.shouldUseRule = exports.shouldUseGroup = exports.schemaHasRulesForType = void 0;
    function schemaHasRulesForType({ schema, self }, type) {
      const group = self.RULES.types[type];
      return group && group !== true && shouldUseGroup(schema, group);
    }
    exports.schemaHasRulesForType = schemaHasRulesForType;
    function shouldUseGroup(schema, group) {
      return group.rules.some((rule) => shouldUseRule(schema, rule));
    }
    exports.shouldUseGroup = shouldUseGroup;
    function shouldUseRule(schema, rule) {
      var _a;
      return schema[rule.keyword] !== void 0 || ((_a = rule.definition.implements) === null || _a === void 0 ? void 0 : _a.some((kwd) => schema[kwd] !== void 0));
    }
    exports.shouldUseRule = shouldUseRule;
  }
});

// node_modules/ajv/dist/compile/validate/dataType.js
var require_dataType = __commonJS({
  "node_modules/ajv/dist/compile/validate/dataType.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.reportTypeError = exports.checkDataTypes = exports.checkDataType = exports.coerceAndCheckDataType = exports.getJSONTypes = exports.getSchemaTypes = exports.DataType = void 0;
    var rules_1 = require_rules();
    var applicability_1 = require_applicability();
    var errors_1 = require_errors();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var DataType;
    (function(DataType2) {
      DataType2[DataType2["Correct"] = 0] = "Correct";
      DataType2[DataType2["Wrong"] = 1] = "Wrong";
    })(DataType || (exports.DataType = DataType = {}));
    function getSchemaTypes(schema) {
      const types = getJSONTypes(schema.type);
      const hasNull = types.includes("null");
      if (hasNull) {
        if (schema.nullable === false)
          throw new Error("type: null contradicts nullable: false");
      } else {
        if (!types.length && schema.nullable !== void 0) {
          throw new Error('"nullable" cannot be used without "type"');
        }
        if (schema.nullable === true)
          types.push("null");
      }
      return types;
    }
    exports.getSchemaTypes = getSchemaTypes;
    function getJSONTypes(ts) {
      const types = Array.isArray(ts) ? ts : ts ? [ts] : [];
      if (types.every(rules_1.isJSONType))
        return types;
      throw new Error("type must be JSONType or JSONType[]: " + types.join(","));
    }
    exports.getJSONTypes = getJSONTypes;
    function coerceAndCheckDataType(it, types) {
      const { gen, data, opts } = it;
      const coerceTo = coerceToTypes(types, opts.coerceTypes);
      const checkTypes = types.length > 0 && !(coerceTo.length === 0 && types.length === 1 && (0, applicability_1.schemaHasRulesForType)(it, types[0]));
      if (checkTypes) {
        const wrongType = checkDataTypes(types, data, opts.strictNumbers, DataType.Wrong);
        gen.if(wrongType, () => {
          if (coerceTo.length)
            coerceData(it, types, coerceTo);
          else
            reportTypeError(it);
        });
      }
      return checkTypes;
    }
    exports.coerceAndCheckDataType = coerceAndCheckDataType;
    var COERCIBLE = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
    function coerceToTypes(types, coerceTypes) {
      return coerceTypes ? types.filter((t) => COERCIBLE.has(t) || coerceTypes === "array" && t === "array") : [];
    }
    function coerceData(it, types, coerceTo) {
      const { gen, data, opts } = it;
      const dataType = gen.let("dataType", (0, codegen_1._)`typeof ${data}`);
      const coerced = gen.let("coerced", (0, codegen_1._)`undefined`);
      if (opts.coerceTypes === "array") {
        gen.if((0, codegen_1._)`${dataType} == 'object' && Array.isArray(${data}) && ${data}.length == 1`, () => gen.assign(data, (0, codegen_1._)`${data}[0]`).assign(dataType, (0, codegen_1._)`typeof ${data}`).if(checkDataTypes(types, data, opts.strictNumbers), () => gen.assign(coerced, data)));
      }
      gen.if((0, codegen_1._)`${coerced} !== undefined`);
      for (const t of coerceTo) {
        if (COERCIBLE.has(t) || t === "array" && opts.coerceTypes === "array") {
          coerceSpecificType(t);
        }
      }
      gen.else();
      reportTypeError(it);
      gen.endIf();
      gen.if((0, codegen_1._)`${coerced} !== undefined`, () => {
        gen.assign(data, coerced);
        assignParentData(it, coerced);
      });
      function coerceSpecificType(t) {
        switch (t) {
          case "string":
            gen.elseIf((0, codegen_1._)`${dataType} == "number" || ${dataType} == "boolean"`).assign(coerced, (0, codegen_1._)`"" + ${data}`).elseIf((0, codegen_1._)`${data} === null`).assign(coerced, (0, codegen_1._)`""`);
            return;
          case "number":
            gen.elseIf((0, codegen_1._)`${dataType} == "boolean" || ${data} === null
              || (${dataType} == "string" && ${data} && ${data} == +${data})`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "integer":
            gen.elseIf((0, codegen_1._)`${dataType} === "boolean" || ${data} === null
              || (${dataType} === "string" && ${data} && ${data} == +${data} && !(${data} % 1))`).assign(coerced, (0, codegen_1._)`+${data}`);
            return;
          case "boolean":
            gen.elseIf((0, codegen_1._)`${data} === "false" || ${data} === 0 || ${data} === null`).assign(coerced, false).elseIf((0, codegen_1._)`${data} === "true" || ${data} === 1`).assign(coerced, true);
            return;
          case "null":
            gen.elseIf((0, codegen_1._)`${data} === "" || ${data} === 0 || ${data} === false`);
            gen.assign(coerced, null);
            return;
          case "array":
            gen.elseIf((0, codegen_1._)`${dataType} === "string" || ${dataType} === "number"
              || ${dataType} === "boolean" || ${data} === null`).assign(coerced, (0, codegen_1._)`[${data}]`);
        }
      }
    }
    function assignParentData({ gen, parentData, parentDataProperty }, expr) {
      gen.if((0, codegen_1._)`${parentData} !== undefined`, () => gen.assign((0, codegen_1._)`${parentData}[${parentDataProperty}]`, expr));
    }
    function checkDataType(dataType, data, strictNums, correct = DataType.Correct) {
      const EQ = correct === DataType.Correct ? codegen_1.operators.EQ : codegen_1.operators.NEQ;
      let cond;
      switch (dataType) {
        case "null":
          return (0, codegen_1._)`${data} ${EQ} null`;
        case "array":
          cond = (0, codegen_1._)`Array.isArray(${data})`;
          break;
        case "object":
          cond = (0, codegen_1._)`${data} && typeof ${data} == "object" && !Array.isArray(${data})`;
          break;
        case "integer":
          cond = numCond((0, codegen_1._)`!(${data} % 1) && !isNaN(${data})`);
          break;
        case "number":
          cond = numCond();
          break;
        default:
          return (0, codegen_1._)`typeof ${data} ${EQ} ${dataType}`;
      }
      return correct === DataType.Correct ? cond : (0, codegen_1.not)(cond);
      function numCond(_cond = codegen_1.nil) {
        return (0, codegen_1.and)((0, codegen_1._)`typeof ${data} == "number"`, _cond, strictNums ? (0, codegen_1._)`isFinite(${data})` : codegen_1.nil);
      }
    }
    exports.checkDataType = checkDataType;
    function checkDataTypes(dataTypes, data, strictNums, correct) {
      if (dataTypes.length === 1) {
        return checkDataType(dataTypes[0], data, strictNums, correct);
      }
      let cond;
      const types = (0, util_1.toHash)(dataTypes);
      if (types.array && types.object) {
        const notObj = (0, codegen_1._)`typeof ${data} != "object"`;
        cond = types.null ? notObj : (0, codegen_1._)`!${data} || ${notObj}`;
        delete types.null;
        delete types.array;
        delete types.object;
      } else {
        cond = codegen_1.nil;
      }
      if (types.number)
        delete types.integer;
      for (const t in types)
        cond = (0, codegen_1.and)(cond, checkDataType(t, data, strictNums, correct));
      return cond;
    }
    exports.checkDataTypes = checkDataTypes;
    var typeError = {
      message: ({ schema }) => `must be ${schema}`,
      params: ({ schema, schemaValue }) => typeof schema == "string" ? (0, codegen_1._)`{type: ${schema}}` : (0, codegen_1._)`{type: ${schemaValue}}`
    };
    function reportTypeError(it) {
      const cxt = getTypeErrorContext(it);
      (0, errors_1.reportError)(cxt, typeError);
    }
    exports.reportTypeError = reportTypeError;
    function getTypeErrorContext(it) {
      const { gen, data, schema } = it;
      const schemaCode = (0, util_1.schemaRefOrVal)(it, schema, "type");
      return {
        gen,
        keyword: "type",
        data,
        schema: schema.type,
        schemaCode,
        schemaValue: schemaCode,
        parentSchema: schema,
        params: {},
        it
      };
    }
  }
});

// node_modules/ajv/dist/compile/validate/defaults.js
var require_defaults = __commonJS({
  "node_modules/ajv/dist/compile/validate/defaults.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.assignDefaults = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function assignDefaults(it, ty) {
      const { properties, items } = it.schema;
      if (ty === "object" && properties) {
        for (const key in properties) {
          assignDefault(it, key, properties[key].default);
        }
      } else if (ty === "array" && Array.isArray(items)) {
        items.forEach((sch, i) => assignDefault(it, i, sch.default));
      }
    }
    exports.assignDefaults = assignDefaults;
    function assignDefault(it, prop, defaultValue) {
      const { gen, compositeRule, data, opts } = it;
      if (defaultValue === void 0)
        return;
      const childData = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(prop)}`;
      if (compositeRule) {
        (0, util_1.checkStrictMode)(it, `default is ignored for: ${childData}`);
        return;
      }
      let condition = (0, codegen_1._)`${childData} === undefined`;
      if (opts.useDefaults === "empty") {
        condition = (0, codegen_1._)`${condition} || ${childData} === null || ${childData} === ""`;
      }
      gen.if(condition, (0, codegen_1._)`${childData} = ${(0, codegen_1.stringify)(defaultValue)}`);
    }
  }
});

// node_modules/ajv/dist/vocabularies/code.js
var require_code2 = __commonJS({
  "node_modules/ajv/dist/vocabularies/code.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateUnion = exports.validateArray = exports.usePattern = exports.callValidateCode = exports.schemaProperties = exports.allSchemaProperties = exports.noPropertyInData = exports.propertyInData = exports.isOwnProperty = exports.hasPropFunc = exports.reportMissingProp = exports.checkMissingProp = exports.checkReportMissingProp = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var names_1 = require_names();
    var util_2 = require_util();
    function checkReportMissingProp(cxt, prop) {
      const { gen, data, it } = cxt;
      gen.if(noPropertyInData(gen, data, prop, it.opts.ownProperties), () => {
        cxt.setParams({ missingProperty: (0, codegen_1._)`${prop}` }, true);
        cxt.error();
      });
    }
    exports.checkReportMissingProp = checkReportMissingProp;
    function checkMissingProp({ gen, data, it: { opts } }, properties, missing) {
      return (0, codegen_1.or)(...properties.map((prop) => (0, codegen_1.and)(noPropertyInData(gen, data, prop, opts.ownProperties), (0, codegen_1._)`${missing} = ${prop}`)));
    }
    exports.checkMissingProp = checkMissingProp;
    function reportMissingProp(cxt, missing) {
      cxt.setParams({ missingProperty: missing }, true);
      cxt.error();
    }
    exports.reportMissingProp = reportMissingProp;
    function hasPropFunc(gen) {
      return gen.scopeValue("func", {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        ref: Object.prototype.hasOwnProperty,
        code: (0, codegen_1._)`Object.prototype.hasOwnProperty`
      });
    }
    exports.hasPropFunc = hasPropFunc;
    function isOwnProperty(gen, data, property) {
      return (0, codegen_1._)`${hasPropFunc(gen)}.call(${data}, ${property})`;
    }
    exports.isOwnProperty = isOwnProperty;
    function propertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} !== undefined`;
      return ownProperties ? (0, codegen_1._)`${cond} && ${isOwnProperty(gen, data, property)}` : cond;
    }
    exports.propertyInData = propertyInData;
    function noPropertyInData(gen, data, property, ownProperties) {
      const cond = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(property)} === undefined`;
      return ownProperties ? (0, codegen_1.or)(cond, (0, codegen_1.not)(isOwnProperty(gen, data, property))) : cond;
    }
    exports.noPropertyInData = noPropertyInData;
    function allSchemaProperties(schemaMap) {
      return schemaMap ? Object.keys(schemaMap).filter((p) => p !== "__proto__") : [];
    }
    exports.allSchemaProperties = allSchemaProperties;
    function schemaProperties(it, schemaMap) {
      return allSchemaProperties(schemaMap).filter((p) => !(0, util_1.alwaysValidSchema)(it, schemaMap[p]));
    }
    exports.schemaProperties = schemaProperties;
    function callValidateCode({ schemaCode, data, it: { gen, topSchemaRef, schemaPath, errorPath }, it }, func, context, passSchema) {
      const dataAndSchema = passSchema ? (0, codegen_1._)`${schemaCode}, ${data}, ${topSchemaRef}${schemaPath}` : data;
      const valCxt = [
        [names_1.default.instancePath, (0, codegen_1.strConcat)(names_1.default.instancePath, errorPath)],
        [names_1.default.parentData, it.parentData],
        [names_1.default.parentDataProperty, it.parentDataProperty],
        [names_1.default.rootData, names_1.default.rootData]
      ];
      if (it.opts.dynamicRef)
        valCxt.push([names_1.default.dynamicAnchors, names_1.default.dynamicAnchors]);
      const args = (0, codegen_1._)`${dataAndSchema}, ${gen.object(...valCxt)}`;
      return context !== codegen_1.nil ? (0, codegen_1._)`${func}.call(${context}, ${args})` : (0, codegen_1._)`${func}(${args})`;
    }
    exports.callValidateCode = callValidateCode;
    var newRegExp = (0, codegen_1._)`new RegExp`;
    function usePattern({ gen, it: { opts } }, pattern) {
      const u = opts.unicodeRegExp ? "u" : "";
      const { regExp } = opts.code;
      const rx = regExp(pattern, u);
      return gen.scopeValue("pattern", {
        key: rx.toString(),
        ref: rx,
        code: (0, codegen_1._)`${regExp.code === "new RegExp" ? newRegExp : (0, util_2.useFunc)(gen, regExp)}(${pattern}, ${u})`
      });
    }
    exports.usePattern = usePattern;
    function validateArray(cxt) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      if (it.allErrors) {
        const validArr = gen.let("valid", true);
        validateItems(() => gen.assign(validArr, false));
        return validArr;
      }
      gen.var(valid, true);
      validateItems(() => gen.break());
      return valid;
      function validateItems(notValid) {
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        gen.forRange("i", 0, len, (i) => {
          cxt.subschema({
            keyword,
            dataProp: i,
            dataPropType: util_1.Type.Num
          }, valid);
          gen.if((0, codegen_1.not)(valid), notValid);
        });
      }
    }
    exports.validateArray = validateArray;
    function validateUnion(cxt) {
      const { gen, schema, keyword, it } = cxt;
      if (!Array.isArray(schema))
        throw new Error("ajv implementation error");
      const alwaysValid = schema.some((sch) => (0, util_1.alwaysValidSchema)(it, sch));
      if (alwaysValid && !it.opts.unevaluated)
        return;
      const valid = gen.let("valid", false);
      const schValid = gen.name("_valid");
      gen.block(() => schema.forEach((_sch, i) => {
        const schCxt = cxt.subschema({
          keyword,
          schemaProp: i,
          compositeRule: true
        }, schValid);
        gen.assign(valid, (0, codegen_1._)`${valid} || ${schValid}`);
        const merged = cxt.mergeValidEvaluated(schCxt, schValid);
        if (!merged)
          gen.if((0, codegen_1.not)(valid));
      }));
      cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
    }
    exports.validateUnion = validateUnion;
  }
});

// node_modules/ajv/dist/compile/validate/keyword.js
var require_keyword = __commonJS({
  "node_modules/ajv/dist/compile/validate/keyword.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateKeywordUsage = exports.validSchemaType = exports.funcKeywordCode = exports.macroKeywordCode = void 0;
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var code_1 = require_code2();
    var errors_1 = require_errors();
    function macroKeywordCode(cxt, def) {
      const { gen, keyword, schema, parentSchema, it } = cxt;
      const macroSchema = def.macro.call(it.self, schema, parentSchema, it);
      const schemaRef = useKeyword(gen, keyword, macroSchema);
      if (it.opts.validateSchema !== false)
        it.self.validateSchema(macroSchema, true);
      const valid = gen.name("valid");
      cxt.subschema({
        schema: macroSchema,
        schemaPath: codegen_1.nil,
        errSchemaPath: `${it.errSchemaPath}/${keyword}`,
        topSchemaRef: schemaRef,
        compositeRule: true
      }, valid);
      cxt.pass(valid, () => cxt.error(true));
    }
    exports.macroKeywordCode = macroKeywordCode;
    function funcKeywordCode(cxt, def) {
      var _a;
      const { gen, keyword, schema, parentSchema, $data, it } = cxt;
      checkAsyncKeyword(it, def);
      const validate = !$data && def.compile ? def.compile.call(it.self, schema, parentSchema, it) : def.validate;
      const validateRef = useKeyword(gen, keyword, validate);
      const valid = gen.let("valid");
      cxt.block$data(valid, validateKeyword);
      cxt.ok((_a = def.valid) !== null && _a !== void 0 ? _a : valid);
      function validateKeyword() {
        if (def.errors === false) {
          assignValid();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => cxt.error());
        } else {
          const ruleErrs = def.async ? validateAsync() : validateSync();
          if (def.modifying)
            modifyData(cxt);
          reportErrs(() => addErrs(cxt, ruleErrs));
        }
      }
      function validateAsync() {
        const ruleErrs = gen.let("ruleErrs", null);
        gen.try(() => assignValid((0, codegen_1._)`await `), (e) => gen.assign(valid, false).if((0, codegen_1._)`${e} instanceof ${it.ValidationError}`, () => gen.assign(ruleErrs, (0, codegen_1._)`${e}.errors`), () => gen.throw(e)));
        return ruleErrs;
      }
      function validateSync() {
        const validateErrs = (0, codegen_1._)`${validateRef}.errors`;
        gen.assign(validateErrs, null);
        assignValid(codegen_1.nil);
        return validateErrs;
      }
      function assignValid(_await = def.async ? (0, codegen_1._)`await ` : codegen_1.nil) {
        const passCxt = it.opts.passContext ? names_1.default.this : names_1.default.self;
        const passSchema = !("compile" in def && !$data || def.schema === false);
        gen.assign(valid, (0, codegen_1._)`${_await}${(0, code_1.callValidateCode)(cxt, validateRef, passCxt, passSchema)}`, def.modifying);
      }
      function reportErrs(errors) {
        var _a2;
        gen.if((0, codegen_1.not)((_a2 = def.valid) !== null && _a2 !== void 0 ? _a2 : valid), errors);
      }
    }
    exports.funcKeywordCode = funcKeywordCode;
    function modifyData(cxt) {
      const { gen, data, it } = cxt;
      gen.if(it.parentData, () => gen.assign(data, (0, codegen_1._)`${it.parentData}[${it.parentDataProperty}]`));
    }
    function addErrs(cxt, errs) {
      const { gen } = cxt;
      gen.if((0, codegen_1._)`Array.isArray(${errs})`, () => {
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`).assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
        (0, errors_1.extendErrors)(cxt);
      }, () => cxt.error());
    }
    function checkAsyncKeyword({ schemaEnv }, def) {
      if (def.async && !schemaEnv.$async)
        throw new Error("async keyword in sync schema");
    }
    function useKeyword(gen, keyword, result) {
      if (result === void 0)
        throw new Error(`keyword "${keyword}" failed to compile`);
      return gen.scopeValue("keyword", typeof result == "function" ? { ref: result } : { ref: result, code: (0, codegen_1.stringify)(result) });
    }
    function validSchemaType(schema, schemaType, allowUndefined = false) {
      return !schemaType.length || schemaType.some((st) => st === "array" ? Array.isArray(schema) : st === "object" ? schema && typeof schema == "object" && !Array.isArray(schema) : typeof schema == st || allowUndefined && typeof schema == "undefined");
    }
    exports.validSchemaType = validSchemaType;
    function validateKeywordUsage({ schema, opts, self, errSchemaPath }, def, keyword) {
      if (Array.isArray(def.keyword) ? !def.keyword.includes(keyword) : def.keyword !== keyword) {
        throw new Error("ajv implementation error");
      }
      const deps = def.dependencies;
      if (deps === null || deps === void 0 ? void 0 : deps.some((kwd) => !Object.prototype.hasOwnProperty.call(schema, kwd))) {
        throw new Error(`parent schema must have dependencies of ${keyword}: ${deps.join(",")}`);
      }
      if (def.validateSchema) {
        const valid = def.validateSchema(schema[keyword]);
        if (!valid) {
          const msg = `keyword "${keyword}" value is invalid at path "${errSchemaPath}": ` + self.errorsText(def.validateSchema.errors);
          if (opts.validateSchema === "log")
            self.logger.error(msg);
          else
            throw new Error(msg);
        }
      }
    }
    exports.validateKeywordUsage = validateKeywordUsage;
  }
});

// node_modules/ajv/dist/compile/validate/subschema.js
var require_subschema = __commonJS({
  "node_modules/ajv/dist/compile/validate/subschema.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.extendSubschemaMode = exports.extendSubschemaData = exports.getSubschema = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    function getSubschema(it, { keyword, schemaProp, schema, schemaPath, errSchemaPath, topSchemaRef }) {
      if (keyword !== void 0 && schema !== void 0) {
        throw new Error('both "keyword" and "schema" passed, only one allowed');
      }
      if (keyword !== void 0) {
        const sch = it.schema[keyword];
        return schemaProp === void 0 ? {
          schema: sch,
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}`
        } : {
          schema: sch[schemaProp],
          schemaPath: (0, codegen_1._)`${it.schemaPath}${(0, codegen_1.getProperty)(keyword)}${(0, codegen_1.getProperty)(schemaProp)}`,
          errSchemaPath: `${it.errSchemaPath}/${keyword}/${(0, util_1.escapeFragment)(schemaProp)}`
        };
      }
      if (schema !== void 0) {
        if (schemaPath === void 0 || errSchemaPath === void 0 || topSchemaRef === void 0) {
          throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
        }
        return {
          schema,
          schemaPath,
          topSchemaRef,
          errSchemaPath
        };
      }
      throw new Error('either "keyword" or "schema" must be passed');
    }
    exports.getSubschema = getSubschema;
    function extendSubschemaData(subschema, it, { dataProp, dataPropType: dpType, data, dataTypes, propertyName }) {
      if (data !== void 0 && dataProp !== void 0) {
        throw new Error('both "data" and "dataProp" passed, only one allowed');
      }
      const { gen } = it;
      if (dataProp !== void 0) {
        const { errorPath, dataPathArr, opts } = it;
        const nextData = gen.let("data", (0, codegen_1._)`${it.data}${(0, codegen_1.getProperty)(dataProp)}`, true);
        dataContextProps(nextData);
        subschema.errorPath = (0, codegen_1.str)`${errorPath}${(0, util_1.getErrorPath)(dataProp, dpType, opts.jsPropertySyntax)}`;
        subschema.parentDataProperty = (0, codegen_1._)`${dataProp}`;
        subschema.dataPathArr = [...dataPathArr, subschema.parentDataProperty];
      }
      if (data !== void 0) {
        const nextData = data instanceof codegen_1.Name ? data : gen.let("data", data, true);
        dataContextProps(nextData);
        if (propertyName !== void 0)
          subschema.propertyName = propertyName;
      }
      if (dataTypes)
        subschema.dataTypes = dataTypes;
      function dataContextProps(_nextData) {
        subschema.data = _nextData;
        subschema.dataLevel = it.dataLevel + 1;
        subschema.dataTypes = [];
        it.definedProperties = /* @__PURE__ */ new Set();
        subschema.parentData = it.data;
        subschema.dataNames = [...it.dataNames, _nextData];
      }
    }
    exports.extendSubschemaData = extendSubschemaData;
    function extendSubschemaMode(subschema, { jtdDiscriminator, jtdMetadata, compositeRule, createErrors, allErrors }) {
      if (compositeRule !== void 0)
        subschema.compositeRule = compositeRule;
      if (createErrors !== void 0)
        subschema.createErrors = createErrors;
      if (allErrors !== void 0)
        subschema.allErrors = allErrors;
      subschema.jtdDiscriminator = jtdDiscriminator;
      subschema.jtdMetadata = jtdMetadata;
    }
    exports.extendSubschemaMode = extendSubschemaMode;
  }
});

// node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "node_modules/fast-deep-equal/index.js"(exports, module) {
    "use strict";
    module.exports = function equal(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; )
            if (!equal(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// node_modules/json-schema-traverse/index.js
var require_json_schema_traverse = __commonJS({
  "node_modules/json-schema-traverse/index.js"(exports, module) {
    "use strict";
    var traverse = module.exports = function(schema, opts, cb) {
      if (typeof opts == "function") {
        cb = opts;
        opts = {};
      }
      cb = opts.cb || cb;
      var pre = typeof cb == "function" ? cb : cb.pre || function() {
      };
      var post = cb.post || function() {
      };
      _traverse(opts, pre, post, schema, "", schema);
    };
    traverse.keywords = {
      additionalItems: true,
      items: true,
      contains: true,
      additionalProperties: true,
      propertyNames: true,
      not: true,
      if: true,
      then: true,
      else: true
    };
    traverse.arrayKeywords = {
      items: true,
      allOf: true,
      anyOf: true,
      oneOf: true
    };
    traverse.propsKeywords = {
      $defs: true,
      definitions: true,
      properties: true,
      patternProperties: true,
      dependencies: true
    };
    traverse.skipKeywords = {
      default: true,
      enum: true,
      const: true,
      required: true,
      maximum: true,
      minimum: true,
      exclusiveMaximum: true,
      exclusiveMinimum: true,
      multipleOf: true,
      maxLength: true,
      minLength: true,
      pattern: true,
      format: true,
      maxItems: true,
      minItems: true,
      uniqueItems: true,
      maxProperties: true,
      minProperties: true
    };
    function _traverse(opts, pre, post, schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex) {
      if (schema && typeof schema == "object" && !Array.isArray(schema)) {
        pre(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
        for (var key in schema) {
          var sch = schema[key];
          if (Array.isArray(sch)) {
            if (key in traverse.arrayKeywords) {
              for (var i = 0; i < sch.length; i++)
                _traverse(opts, pre, post, sch[i], jsonPtr + "/" + key + "/" + i, rootSchema, jsonPtr, key, schema, i);
            }
          } else if (key in traverse.propsKeywords) {
            if (sch && typeof sch == "object") {
              for (var prop in sch)
                _traverse(opts, pre, post, sch[prop], jsonPtr + "/" + key + "/" + escapeJsonPtr(prop), rootSchema, jsonPtr, key, schema, prop);
            }
          } else if (key in traverse.keywords || opts.allKeys && !(key in traverse.skipKeywords)) {
            _traverse(opts, pre, post, sch, jsonPtr + "/" + key, rootSchema, jsonPtr, key, schema);
          }
        }
        post(schema, jsonPtr, rootSchema, parentJsonPtr, parentKeyword, parentSchema, keyIndex);
      }
    }
    function escapeJsonPtr(str) {
      return str.replace(/~/g, "~0").replace(/\//g, "~1");
    }
  }
});

// node_modules/ajv/dist/compile/resolve.js
var require_resolve = __commonJS({
  "node_modules/ajv/dist/compile/resolve.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getSchemaRefs = exports.resolveUrl = exports.normalizeId = exports._getFullPath = exports.getFullPath = exports.inlineRef = void 0;
    var util_1 = require_util();
    var equal = require_fast_deep_equal();
    var traverse = require_json_schema_traverse();
    var SIMPLE_INLINED = /* @__PURE__ */ new Set([
      "type",
      "format",
      "pattern",
      "maxLength",
      "minLength",
      "maxProperties",
      "minProperties",
      "maxItems",
      "minItems",
      "maximum",
      "minimum",
      "uniqueItems",
      "multipleOf",
      "required",
      "enum",
      "const"
    ]);
    function inlineRef(schema, limit = true) {
      if (typeof schema == "boolean")
        return true;
      if (limit === true)
        return !hasRef(schema);
      if (!limit)
        return false;
      return countKeys(schema) <= limit;
    }
    exports.inlineRef = inlineRef;
    var REF_KEYWORDS = /* @__PURE__ */ new Set([
      "$ref",
      "$recursiveRef",
      "$recursiveAnchor",
      "$dynamicRef",
      "$dynamicAnchor"
    ]);
    function hasRef(schema) {
      for (const key in schema) {
        if (REF_KEYWORDS.has(key))
          return true;
        const sch = schema[key];
        if (Array.isArray(sch) && sch.some(hasRef))
          return true;
        if (typeof sch == "object" && hasRef(sch))
          return true;
      }
      return false;
    }
    function countKeys(schema) {
      let count = 0;
      for (const key in schema) {
        if (key === "$ref")
          return Infinity;
        count++;
        if (SIMPLE_INLINED.has(key))
          continue;
        if (typeof schema[key] == "object") {
          (0, util_1.eachItem)(schema[key], (sch) => count += countKeys(sch));
        }
        if (count === Infinity)
          return Infinity;
      }
      return count;
    }
    function getFullPath(resolver, id = "", normalize) {
      if (normalize !== false)
        id = normalizeId(id);
      const p = resolver.parse(id);
      return _getFullPath(resolver, p);
    }
    exports.getFullPath = getFullPath;
    function _getFullPath(resolver, p) {
      const serialized = resolver.serialize(p);
      return serialized.split("#")[0] + "#";
    }
    exports._getFullPath = _getFullPath;
    var TRAILING_SLASH_HASH = /#\/?$/;
    function normalizeId(id) {
      return id ? id.replace(TRAILING_SLASH_HASH, "") : "";
    }
    exports.normalizeId = normalizeId;
    function resolveUrl(resolver, baseId, id) {
      id = normalizeId(id);
      return resolver.resolve(baseId, id);
    }
    exports.resolveUrl = resolveUrl;
    var ANCHOR = /^[a-z_][-a-z0-9._]*$/i;
    function getSchemaRefs(schema, baseId) {
      if (typeof schema == "boolean")
        return {};
      const { schemaId, uriResolver } = this.opts;
      const schId = normalizeId(schema[schemaId] || baseId);
      const baseIds = { "": schId };
      const pathPrefix = getFullPath(uriResolver, schId, false);
      const localRefs = {};
      const schemaRefs = /* @__PURE__ */ new Set();
      traverse(schema, { allKeys: true }, (sch, jsonPtr, _, parentJsonPtr) => {
        if (parentJsonPtr === void 0)
          return;
        const fullPath = pathPrefix + jsonPtr;
        let innerBaseId = baseIds[parentJsonPtr];
        if (typeof sch[schemaId] == "string")
          innerBaseId = addRef.call(this, sch[schemaId]);
        addAnchor.call(this, sch.$anchor);
        addAnchor.call(this, sch.$dynamicAnchor);
        baseIds[jsonPtr] = innerBaseId;
        function addRef(ref) {
          const _resolve = this.opts.uriResolver.resolve;
          ref = normalizeId(innerBaseId ? _resolve(innerBaseId, ref) : ref);
          if (schemaRefs.has(ref))
            throw ambiguos(ref);
          schemaRefs.add(ref);
          let schOrRef = this.refs[ref];
          if (typeof schOrRef == "string")
            schOrRef = this.refs[schOrRef];
          if (typeof schOrRef == "object") {
            checkAmbiguosRef(sch, schOrRef.schema, ref);
          } else if (ref !== normalizeId(fullPath)) {
            if (ref[0] === "#") {
              checkAmbiguosRef(sch, localRefs[ref], ref);
              localRefs[ref] = sch;
            } else {
              this.refs[ref] = fullPath;
            }
          }
          return ref;
        }
        function addAnchor(anchor) {
          if (typeof anchor == "string") {
            if (!ANCHOR.test(anchor))
              throw new Error(`invalid anchor "${anchor}"`);
            addRef.call(this, `#${anchor}`);
          }
        }
      });
      return localRefs;
      function checkAmbiguosRef(sch1, sch2, ref) {
        if (sch2 !== void 0 && !equal(sch1, sch2))
          throw ambiguos(ref);
      }
      function ambiguos(ref) {
        return new Error(`reference "${ref}" resolves to more than one schema`);
      }
    }
    exports.getSchemaRefs = getSchemaRefs;
  }
});

// node_modules/ajv/dist/compile/validate/index.js
var require_validate = __commonJS({
  "node_modules/ajv/dist/compile/validate/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.getData = exports.KeywordCxt = exports.validateFunctionCode = void 0;
    var boolSchema_1 = require_boolSchema();
    var dataType_1 = require_dataType();
    var applicability_1 = require_applicability();
    var dataType_2 = require_dataType();
    var defaults_1 = require_defaults();
    var keyword_1 = require_keyword();
    var subschema_1 = require_subschema();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var errors_1 = require_errors();
    function validateFunctionCode(it) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          topSchemaObjCode(it);
          return;
        }
      }
      validateFunction(it, () => (0, boolSchema_1.topBoolOrEmptySchema)(it));
    }
    exports.validateFunctionCode = validateFunctionCode;
    function validateFunction({ gen, validateName, schema, schemaEnv, opts }, body) {
      if (opts.code.es5) {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${names_1.default.valCxt}`, schemaEnv.$async, () => {
          gen.code((0, codegen_1._)`"use strict"; ${funcSourceUrl(schema, opts)}`);
          destructureValCxtES5(gen, opts);
          gen.code(body);
        });
      } else {
        gen.func(validateName, (0, codegen_1._)`${names_1.default.data}, ${destructureValCxt(opts)}`, schemaEnv.$async, () => gen.code(funcSourceUrl(schema, opts)).code(body));
      }
    }
    function destructureValCxt(opts) {
      return (0, codegen_1._)`{${names_1.default.instancePath}="", ${names_1.default.parentData}, ${names_1.default.parentDataProperty}, ${names_1.default.rootData}=${names_1.default.data}${opts.dynamicRef ? (0, codegen_1._)`, ${names_1.default.dynamicAnchors}={}` : codegen_1.nil}}={}`;
    }
    function destructureValCxtES5(gen, opts) {
      gen.if(names_1.default.valCxt, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.instancePath}`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentData}`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.parentDataProperty}`);
        gen.var(names_1.default.rootData, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.rootData}`);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`${names_1.default.valCxt}.${names_1.default.dynamicAnchors}`);
      }, () => {
        gen.var(names_1.default.instancePath, (0, codegen_1._)`""`);
        gen.var(names_1.default.parentData, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.parentDataProperty, (0, codegen_1._)`undefined`);
        gen.var(names_1.default.rootData, names_1.default.data);
        if (opts.dynamicRef)
          gen.var(names_1.default.dynamicAnchors, (0, codegen_1._)`{}`);
      });
    }
    function topSchemaObjCode(it) {
      const { schema, opts, gen } = it;
      validateFunction(it, () => {
        if (opts.$comment && schema.$comment)
          commentKeyword(it);
        checkNoDefault(it);
        gen.let(names_1.default.vErrors, null);
        gen.let(names_1.default.errors, 0);
        if (opts.unevaluated)
          resetEvaluated(it);
        typeAndKeywords(it);
        returnResults(it);
      });
      return;
    }
    function resetEvaluated(it) {
      const { gen, validateName } = it;
      it.evaluated = gen.const("evaluated", (0, codegen_1._)`${validateName}.evaluated`);
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicProps`, () => gen.assign((0, codegen_1._)`${it.evaluated}.props`, (0, codegen_1._)`undefined`));
      gen.if((0, codegen_1._)`${it.evaluated}.dynamicItems`, () => gen.assign((0, codegen_1._)`${it.evaluated}.items`, (0, codegen_1._)`undefined`));
    }
    function funcSourceUrl(schema, opts) {
      const schId = typeof schema == "object" && schema[opts.schemaId];
      return schId && (opts.code.source || opts.code.process) ? (0, codegen_1._)`/*# sourceURL=${schId} */` : codegen_1.nil;
    }
    function subschemaCode(it, valid) {
      if (isSchemaObj(it)) {
        checkKeywords(it);
        if (schemaCxtHasRules(it)) {
          subSchemaObjCode(it, valid);
          return;
        }
      }
      (0, boolSchema_1.boolOrEmptySchema)(it, valid);
    }
    function schemaCxtHasRules({ schema, self }) {
      if (typeof schema == "boolean")
        return !schema;
      for (const key in schema)
        if (self.RULES.all[key])
          return true;
      return false;
    }
    function isSchemaObj(it) {
      return typeof it.schema != "boolean";
    }
    function subSchemaObjCode(it, valid) {
      const { schema, gen, opts } = it;
      if (opts.$comment && schema.$comment)
        commentKeyword(it);
      updateContext(it);
      checkAsyncSchema(it);
      const errsCount = gen.const("_errs", names_1.default.errors);
      typeAndKeywords(it, errsCount);
      gen.var(valid, (0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
    }
    function checkKeywords(it) {
      (0, util_1.checkUnknownRules)(it);
      checkRefsAndKeywords(it);
    }
    function typeAndKeywords(it, errsCount) {
      if (it.opts.jtd)
        return schemaKeywords(it, [], false, errsCount);
      const types = (0, dataType_1.getSchemaTypes)(it.schema);
      const checkedTypes = (0, dataType_1.coerceAndCheckDataType)(it, types);
      schemaKeywords(it, types, !checkedTypes, errsCount);
    }
    function checkRefsAndKeywords(it) {
      const { schema, errSchemaPath, opts, self } = it;
      if (schema.$ref && opts.ignoreKeywordsWithRef && (0, util_1.schemaHasRulesButRef)(schema, self.RULES)) {
        self.logger.warn(`$ref: keywords ignored in schema at path "${errSchemaPath}"`);
      }
    }
    function checkNoDefault(it) {
      const { schema, opts } = it;
      if (schema.default !== void 0 && opts.useDefaults && opts.strictSchema) {
        (0, util_1.checkStrictMode)(it, "default is ignored in the schema root");
      }
    }
    function updateContext(it) {
      const schId = it.schema[it.opts.schemaId];
      if (schId)
        it.baseId = (0, resolve_1.resolveUrl)(it.opts.uriResolver, it.baseId, schId);
    }
    function checkAsyncSchema(it) {
      if (it.schema.$async && !it.schemaEnv.$async)
        throw new Error("async schema in sync schema");
    }
    function commentKeyword({ gen, schemaEnv, schema, errSchemaPath, opts }) {
      const msg = schema.$comment;
      if (opts.$comment === true) {
        gen.code((0, codegen_1._)`${names_1.default.self}.logger.log(${msg})`);
      } else if (typeof opts.$comment == "function") {
        const schemaPath = (0, codegen_1.str)`${errSchemaPath}/$comment`;
        const rootName = gen.scopeValue("root", { ref: schemaEnv.root });
        gen.code((0, codegen_1._)`${names_1.default.self}.opts.$comment(${msg}, ${schemaPath}, ${rootName}.schema)`);
      }
    }
    function returnResults(it) {
      const { gen, schemaEnv, validateName, ValidationError, opts } = it;
      if (schemaEnv.$async) {
        gen.if((0, codegen_1._)`${names_1.default.errors} === 0`, () => gen.return(names_1.default.data), () => gen.throw((0, codegen_1._)`new ${ValidationError}(${names_1.default.vErrors})`));
      } else {
        gen.assign((0, codegen_1._)`${validateName}.errors`, names_1.default.vErrors);
        if (opts.unevaluated)
          assignEvaluated(it);
        gen.return((0, codegen_1._)`${names_1.default.errors} === 0`);
      }
    }
    function assignEvaluated({ gen, evaluated, props, items }) {
      if (props instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.props`, props);
      if (items instanceof codegen_1.Name)
        gen.assign((0, codegen_1._)`${evaluated}.items`, items);
    }
    function schemaKeywords(it, types, typeErrors, errsCount) {
      const { gen, schema, data, allErrors, opts, self } = it;
      const { RULES } = self;
      if (schema.$ref && (opts.ignoreKeywordsWithRef || !(0, util_1.schemaHasRulesButRef)(schema, RULES))) {
        gen.block(() => keywordCode(it, "$ref", RULES.all.$ref.definition));
        return;
      }
      if (!opts.jtd)
        checkStrictTypes(it, types);
      gen.block(() => {
        for (const group of RULES.rules)
          groupKeywords(group);
        groupKeywords(RULES.post);
      });
      function groupKeywords(group) {
        if (!(0, applicability_1.shouldUseGroup)(schema, group))
          return;
        if (group.type) {
          gen.if((0, dataType_2.checkDataType)(group.type, data, opts.strictNumbers));
          iterateKeywords(it, group);
          if (types.length === 1 && types[0] === group.type && typeErrors) {
            gen.else();
            (0, dataType_2.reportTypeError)(it);
          }
          gen.endIf();
        } else {
          iterateKeywords(it, group);
        }
        if (!allErrors)
          gen.if((0, codegen_1._)`${names_1.default.errors} === ${errsCount || 0}`);
      }
    }
    function iterateKeywords(it, group) {
      const { gen, schema, opts: { useDefaults } } = it;
      if (useDefaults)
        (0, defaults_1.assignDefaults)(it, group.type);
      gen.block(() => {
        for (const rule of group.rules) {
          if ((0, applicability_1.shouldUseRule)(schema, rule)) {
            keywordCode(it, rule.keyword, rule.definition, group.type);
          }
        }
      });
    }
    function checkStrictTypes(it, types) {
      if (it.schemaEnv.meta || !it.opts.strictTypes)
        return;
      checkContextTypes(it, types);
      if (!it.opts.allowUnionTypes)
        checkMultipleTypes(it, types);
      checkKeywordTypes(it, it.dataTypes);
    }
    function checkContextTypes(it, types) {
      if (!types.length)
        return;
      if (!it.dataTypes.length) {
        it.dataTypes = types;
        return;
      }
      types.forEach((t) => {
        if (!includesType(it.dataTypes, t)) {
          strictTypesError(it, `type "${t}" not allowed by context "${it.dataTypes.join(",")}"`);
        }
      });
      narrowSchemaTypes(it, types);
    }
    function checkMultipleTypes(it, ts) {
      if (ts.length > 1 && !(ts.length === 2 && ts.includes("null"))) {
        strictTypesError(it, "use allowUnionTypes to allow union type keyword");
      }
    }
    function checkKeywordTypes(it, ts) {
      const rules = it.self.RULES.all;
      for (const keyword in rules) {
        const rule = rules[keyword];
        if (typeof rule == "object" && (0, applicability_1.shouldUseRule)(it.schema, rule)) {
          const { type } = rule.definition;
          if (type.length && !type.some((t) => hasApplicableType(ts, t))) {
            strictTypesError(it, `missing type "${type.join(",")}" for keyword "${keyword}"`);
          }
        }
      }
    }
    function hasApplicableType(schTs, kwdT) {
      return schTs.includes(kwdT) || kwdT === "number" && schTs.includes("integer");
    }
    function includesType(ts, t) {
      return ts.includes(t) || t === "integer" && ts.includes("number");
    }
    function narrowSchemaTypes(it, withTypes) {
      const ts = [];
      for (const t of it.dataTypes) {
        if (includesType(withTypes, t))
          ts.push(t);
        else if (withTypes.includes("integer") && t === "number")
          ts.push("integer");
      }
      it.dataTypes = ts;
    }
    function strictTypesError(it, msg) {
      const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
      msg += ` at "${schemaPath}" (strictTypes)`;
      (0, util_1.checkStrictMode)(it, msg, it.opts.strictTypes);
    }
    var KeywordCxt = class {
      constructor(it, def, keyword) {
        (0, keyword_1.validateKeywordUsage)(it, def, keyword);
        this.gen = it.gen;
        this.allErrors = it.allErrors;
        this.keyword = keyword;
        this.data = it.data;
        this.schema = it.schema[keyword];
        this.$data = def.$data && it.opts.$data && this.schema && this.schema.$data;
        this.schemaValue = (0, util_1.schemaRefOrVal)(it, this.schema, keyword, this.$data);
        this.schemaType = def.schemaType;
        this.parentSchema = it.schema;
        this.params = {};
        this.it = it;
        this.def = def;
        if (this.$data) {
          this.schemaCode = it.gen.const("vSchema", getData(this.$data, it));
        } else {
          this.schemaCode = this.schemaValue;
          if (!(0, keyword_1.validSchemaType)(this.schema, def.schemaType, def.allowUndefined)) {
            throw new Error(`${keyword} value must be ${JSON.stringify(def.schemaType)}`);
          }
        }
        if ("code" in def ? def.trackErrors : def.errors !== false) {
          this.errsCount = it.gen.const("_errs", names_1.default.errors);
        }
      }
      result(condition, successAction, failAction) {
        this.failResult((0, codegen_1.not)(condition), successAction, failAction);
      }
      failResult(condition, successAction, failAction) {
        this.gen.if(condition);
        if (failAction)
          failAction();
        else
          this.error();
        if (successAction) {
          this.gen.else();
          successAction();
          if (this.allErrors)
            this.gen.endIf();
        } else {
          if (this.allErrors)
            this.gen.endIf();
          else
            this.gen.else();
        }
      }
      pass(condition, failAction) {
        this.failResult((0, codegen_1.not)(condition), void 0, failAction);
      }
      fail(condition) {
        if (condition === void 0) {
          this.error();
          if (!this.allErrors)
            this.gen.if(false);
          return;
        }
        this.gen.if(condition);
        this.error();
        if (this.allErrors)
          this.gen.endIf();
        else
          this.gen.else();
      }
      fail$data(condition) {
        if (!this.$data)
          return this.fail(condition);
        const { schemaCode } = this;
        this.fail((0, codegen_1._)`${schemaCode} !== undefined && (${(0, codegen_1.or)(this.invalid$data(), condition)})`);
      }
      error(append, errorParams, errorPaths) {
        if (errorParams) {
          this.setParams(errorParams);
          this._error(append, errorPaths);
          this.setParams({});
          return;
        }
        this._error(append, errorPaths);
      }
      _error(append, errorPaths) {
        ;
        (append ? errors_1.reportExtraError : errors_1.reportError)(this, this.def.error, errorPaths);
      }
      $dataError() {
        (0, errors_1.reportError)(this, this.def.$dataError || errors_1.keyword$DataError);
      }
      reset() {
        if (this.errsCount === void 0)
          throw new Error('add "trackErrors" to keyword definition');
        (0, errors_1.resetErrorsCount)(this.gen, this.errsCount);
      }
      ok(cond) {
        if (!this.allErrors)
          this.gen.if(cond);
      }
      setParams(obj, assign) {
        if (assign)
          Object.assign(this.params, obj);
        else
          this.params = obj;
      }
      block$data(valid, codeBlock, $dataValid = codegen_1.nil) {
        this.gen.block(() => {
          this.check$data(valid, $dataValid);
          codeBlock();
        });
      }
      check$data(valid = codegen_1.nil, $dataValid = codegen_1.nil) {
        if (!this.$data)
          return;
        const { gen, schemaCode, schemaType, def } = this;
        gen.if((0, codegen_1.or)((0, codegen_1._)`${schemaCode} === undefined`, $dataValid));
        if (valid !== codegen_1.nil)
          gen.assign(valid, true);
        if (schemaType.length || def.validateSchema) {
          gen.elseIf(this.invalid$data());
          this.$dataError();
          if (valid !== codegen_1.nil)
            gen.assign(valid, false);
        }
        gen.else();
      }
      invalid$data() {
        const { gen, schemaCode, schemaType, def, it } = this;
        return (0, codegen_1.or)(wrong$DataType(), invalid$DataSchema());
        function wrong$DataType() {
          if (schemaType.length) {
            if (!(schemaCode instanceof codegen_1.Name))
              throw new Error("ajv implementation error");
            const st = Array.isArray(schemaType) ? schemaType : [schemaType];
            return (0, codegen_1._)`${(0, dataType_2.checkDataTypes)(st, schemaCode, it.opts.strictNumbers, dataType_2.DataType.Wrong)}`;
          }
          return codegen_1.nil;
        }
        function invalid$DataSchema() {
          if (def.validateSchema) {
            const validateSchemaRef = gen.scopeValue("validate$data", { ref: def.validateSchema });
            return (0, codegen_1._)`!${validateSchemaRef}(${schemaCode})`;
          }
          return codegen_1.nil;
        }
      }
      subschema(appl, valid) {
        const subschema = (0, subschema_1.getSubschema)(this.it, appl);
        (0, subschema_1.extendSubschemaData)(subschema, this.it, appl);
        (0, subschema_1.extendSubschemaMode)(subschema, appl);
        const nextContext = { ...this.it, ...subschema, items: void 0, props: void 0 };
        subschemaCode(nextContext, valid);
        return nextContext;
      }
      mergeEvaluated(schemaCxt, toName) {
        const { it, gen } = this;
        if (!it.opts.unevaluated)
          return;
        if (it.props !== true && schemaCxt.props !== void 0) {
          it.props = util_1.mergeEvaluated.props(gen, schemaCxt.props, it.props, toName);
        }
        if (it.items !== true && schemaCxt.items !== void 0) {
          it.items = util_1.mergeEvaluated.items(gen, schemaCxt.items, it.items, toName);
        }
      }
      mergeValidEvaluated(schemaCxt, valid) {
        const { it, gen } = this;
        if (it.opts.unevaluated && (it.props !== true || it.items !== true)) {
          gen.if(valid, () => this.mergeEvaluated(schemaCxt, codegen_1.Name));
          return true;
        }
      }
    };
    exports.KeywordCxt = KeywordCxt;
    function keywordCode(it, keyword, def, ruleType) {
      const cxt = new KeywordCxt(it, def, keyword);
      if ("code" in def) {
        def.code(cxt, ruleType);
      } else if (cxt.$data && def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      } else if ("macro" in def) {
        (0, keyword_1.macroKeywordCode)(cxt, def);
      } else if (def.compile || def.validate) {
        (0, keyword_1.funcKeywordCode)(cxt, def);
      }
    }
    var JSON_POINTER = /^\/(?:[^~]|~0|~1)*$/;
    var RELATIVE_JSON_POINTER = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
    function getData($data, { dataLevel, dataNames, dataPathArr }) {
      let jsonPointer;
      let data;
      if ($data === "")
        return names_1.default.rootData;
      if ($data[0] === "/") {
        if (!JSON_POINTER.test($data))
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        jsonPointer = $data;
        data = names_1.default.rootData;
      } else {
        const matches = RELATIVE_JSON_POINTER.exec($data);
        if (!matches)
          throw new Error(`Invalid JSON-pointer: ${$data}`);
        const up = +matches[1];
        jsonPointer = matches[2];
        if (jsonPointer === "#") {
          if (up >= dataLevel)
            throw new Error(errorMsg("property/index", up));
          return dataPathArr[dataLevel - up];
        }
        if (up > dataLevel)
          throw new Error(errorMsg("data", up));
        data = dataNames[dataLevel - up];
        if (!jsonPointer)
          return data;
      }
      let expr = data;
      const segments = jsonPointer.split("/");
      for (const segment of segments) {
        if (segment) {
          data = (0, codegen_1._)`${data}${(0, codegen_1.getProperty)((0, util_1.unescapeJsonPointer)(segment))}`;
          expr = (0, codegen_1._)`${expr} && ${data}`;
        }
      }
      return expr;
      function errorMsg(pointerType, up) {
        return `Cannot access ${pointerType} ${up} levels up, current level is ${dataLevel}`;
      }
    }
    exports.getData = getData;
  }
});

// node_modules/ajv/dist/runtime/validation_error.js
var require_validation_error = __commonJS({
  "node_modules/ajv/dist/runtime/validation_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var ValidationError = class extends Error {
      constructor(errors) {
        super("validation failed");
        this.errors = errors;
        this.ajv = this.validation = true;
      }
    };
    exports.default = ValidationError;
  }
});

// node_modules/ajv/dist/compile/ref_error.js
var require_ref_error = __commonJS({
  "node_modules/ajv/dist/compile/ref_error.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var resolve_1 = require_resolve();
    var MissingRefError = class extends Error {
      constructor(resolver, baseId, ref, msg) {
        super(msg || `can't resolve reference ${ref} from id ${baseId}`);
        this.missingRef = (0, resolve_1.resolveUrl)(resolver, baseId, ref);
        this.missingSchema = (0, resolve_1.normalizeId)((0, resolve_1.getFullPath)(resolver, this.missingRef));
      }
    };
    exports.default = MissingRefError;
  }
});

// node_modules/ajv/dist/compile/index.js
var require_compile = __commonJS({
  "node_modules/ajv/dist/compile/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.resolveSchema = exports.getCompilingSchema = exports.resolveRef = exports.compileSchema = exports.SchemaEnv = void 0;
    var codegen_1 = require_codegen();
    var validation_error_1 = require_validation_error();
    var names_1 = require_names();
    var resolve_1 = require_resolve();
    var util_1 = require_util();
    var validate_1 = require_validate();
    var SchemaEnv = class {
      constructor(env) {
        var _a;
        this.refs = {};
        this.dynamicAnchors = {};
        let schema;
        if (typeof env.schema == "object")
          schema = env.schema;
        this.schema = env.schema;
        this.schemaId = env.schemaId;
        this.root = env.root || this;
        this.baseId = (_a = env.baseId) !== null && _a !== void 0 ? _a : (0, resolve_1.normalizeId)(schema === null || schema === void 0 ? void 0 : schema[env.schemaId || "$id"]);
        this.schemaPath = env.schemaPath;
        this.localRefs = env.localRefs;
        this.meta = env.meta;
        this.$async = schema === null || schema === void 0 ? void 0 : schema.$async;
        this.refs = {};
      }
    };
    exports.SchemaEnv = SchemaEnv;
    function compileSchema(sch) {
      const _sch = getCompilingSchema.call(this, sch);
      if (_sch)
        return _sch;
      const rootId = (0, resolve_1.getFullPath)(this.opts.uriResolver, sch.root.baseId);
      const { es5, lines } = this.opts.code;
      const { ownProperties } = this.opts;
      const gen = new codegen_1.CodeGen(this.scope, { es5, lines, ownProperties });
      let _ValidationError;
      if (sch.$async) {
        _ValidationError = gen.scopeValue("Error", {
          ref: validation_error_1.default,
          code: (0, codegen_1._)`require("ajv/dist/runtime/validation_error").default`
        });
      }
      const validateName = gen.scopeName("validate");
      sch.validateName = validateName;
      const schemaCxt = {
        gen,
        allErrors: this.opts.allErrors,
        data: names_1.default.data,
        parentData: names_1.default.parentData,
        parentDataProperty: names_1.default.parentDataProperty,
        dataNames: [names_1.default.data],
        dataPathArr: [codegen_1.nil],
        // TODO can its length be used as dataLevel if nil is removed?
        dataLevel: 0,
        dataTypes: [],
        definedProperties: /* @__PURE__ */ new Set(),
        topSchemaRef: gen.scopeValue("schema", this.opts.code.source === true ? { ref: sch.schema, code: (0, codegen_1.stringify)(sch.schema) } : { ref: sch.schema }),
        validateName,
        ValidationError: _ValidationError,
        schema: sch.schema,
        schemaEnv: sch,
        rootId,
        baseId: sch.baseId || rootId,
        schemaPath: codegen_1.nil,
        errSchemaPath: sch.schemaPath || (this.opts.jtd ? "" : "#"),
        errorPath: (0, codegen_1._)`""`,
        opts: this.opts,
        self: this
      };
      let sourceCode;
      try {
        this._compilations.add(sch);
        (0, validate_1.validateFunctionCode)(schemaCxt);
        gen.optimize(this.opts.code.optimize);
        const validateCode = gen.toString();
        sourceCode = `${gen.scopeRefs(names_1.default.scope)}return ${validateCode}`;
        if (this.opts.code.process)
          sourceCode = this.opts.code.process(sourceCode, sch);
        const makeValidate = new Function(`${names_1.default.self}`, `${names_1.default.scope}`, sourceCode);
        const validate = makeValidate(this, this.scope.get());
        this.scope.value(validateName, { ref: validate });
        validate.errors = null;
        validate.schema = sch.schema;
        validate.schemaEnv = sch;
        if (sch.$async)
          validate.$async = true;
        if (this.opts.code.source === true) {
          validate.source = { validateName, validateCode, scopeValues: gen._values };
        }
        if (this.opts.unevaluated) {
          const { props, items } = schemaCxt;
          validate.evaluated = {
            props: props instanceof codegen_1.Name ? void 0 : props,
            items: items instanceof codegen_1.Name ? void 0 : items,
            dynamicProps: props instanceof codegen_1.Name,
            dynamicItems: items instanceof codegen_1.Name
          };
          if (validate.source)
            validate.source.evaluated = (0, codegen_1.stringify)(validate.evaluated);
        }
        sch.validate = validate;
        return sch;
      } catch (e) {
        delete sch.validate;
        delete sch.validateName;
        if (sourceCode)
          this.logger.error("Error compiling schema, function code:", sourceCode);
        throw e;
      } finally {
        this._compilations.delete(sch);
      }
    }
    exports.compileSchema = compileSchema;
    function resolveRef(root, baseId, ref) {
      var _a;
      ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, ref);
      const schOrFunc = root.refs[ref];
      if (schOrFunc)
        return schOrFunc;
      let _sch = resolve.call(this, root, ref);
      if (_sch === void 0) {
        const schema = (_a = root.localRefs) === null || _a === void 0 ? void 0 : _a[ref];
        const { schemaId } = this.opts;
        if (schema)
          _sch = new SchemaEnv({ schema, schemaId, root, baseId });
      }
      if (_sch === void 0)
        return;
      return root.refs[ref] = inlineOrCompile.call(this, _sch);
    }
    exports.resolveRef = resolveRef;
    function inlineOrCompile(sch) {
      if ((0, resolve_1.inlineRef)(sch.schema, this.opts.inlineRefs))
        return sch.schema;
      return sch.validate ? sch : compileSchema.call(this, sch);
    }
    function getCompilingSchema(schEnv) {
      for (const sch of this._compilations) {
        if (sameSchemaEnv(sch, schEnv))
          return sch;
      }
    }
    exports.getCompilingSchema = getCompilingSchema;
    function sameSchemaEnv(s1, s2) {
      return s1.schema === s2.schema && s1.root === s2.root && s1.baseId === s2.baseId;
    }
    function resolve(root, ref) {
      let sch;
      while (typeof (sch = this.refs[ref]) == "string")
        ref = sch;
      return sch || this.schemas[ref] || resolveSchema.call(this, root, ref);
    }
    function resolveSchema(root, ref) {
      const p = this.opts.uriResolver.parse(ref);
      const refPath = (0, resolve_1._getFullPath)(this.opts.uriResolver, p);
      let baseId = (0, resolve_1.getFullPath)(this.opts.uriResolver, root.baseId, void 0);
      if (Object.keys(root.schema).length > 0 && refPath === baseId) {
        return getJsonPointer.call(this, p, root);
      }
      const id = (0, resolve_1.normalizeId)(refPath);
      const schOrRef = this.refs[id] || this.schemas[id];
      if (typeof schOrRef == "string") {
        const sch = resolveSchema.call(this, root, schOrRef);
        if (typeof (sch === null || sch === void 0 ? void 0 : sch.schema) !== "object")
          return;
        return getJsonPointer.call(this, p, sch);
      }
      if (typeof (schOrRef === null || schOrRef === void 0 ? void 0 : schOrRef.schema) !== "object")
        return;
      if (!schOrRef.validate)
        compileSchema.call(this, schOrRef);
      if (id === (0, resolve_1.normalizeId)(ref)) {
        const { schema } = schOrRef;
        const { schemaId } = this.opts;
        const schId = schema[schemaId];
        if (schId)
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        return new SchemaEnv({ schema, schemaId, root, baseId });
      }
      return getJsonPointer.call(this, p, schOrRef);
    }
    exports.resolveSchema = resolveSchema;
    var PREVENT_SCOPE_CHANGE = /* @__PURE__ */ new Set([
      "properties",
      "patternProperties",
      "enum",
      "dependencies",
      "definitions"
    ]);
    function getJsonPointer(parsedRef, { baseId, schema, root }) {
      var _a;
      if (((_a = parsedRef.fragment) === null || _a === void 0 ? void 0 : _a[0]) !== "/")
        return;
      for (const part of parsedRef.fragment.slice(1).split("/")) {
        if (typeof schema === "boolean")
          return;
        const partSchema = schema[(0, util_1.unescapeFragment)(part)];
        if (partSchema === void 0)
          return;
        schema = partSchema;
        const schId = typeof schema === "object" && schema[this.opts.schemaId];
        if (!PREVENT_SCOPE_CHANGE.has(part) && schId) {
          baseId = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schId);
        }
      }
      let env;
      if (typeof schema != "boolean" && schema.$ref && !(0, util_1.schemaHasRulesButRef)(schema, this.RULES)) {
        const $ref = (0, resolve_1.resolveUrl)(this.opts.uriResolver, baseId, schema.$ref);
        env = resolveSchema.call(this, root, $ref);
      }
      const { schemaId } = this.opts;
      env = env || new SchemaEnv({ schema, schemaId, root, baseId });
      if (env.schema !== env.root.schema)
        return env;
      return void 0;
    }
  }
});

// node_modules/ajv/dist/refs/data.json
var require_data = __commonJS({
  "node_modules/ajv/dist/refs/data.json"(exports, module) {
    module.exports = {
      $id: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#",
      description: "Meta-schema for $data reference (JSON AnySchema extension proposal)",
      type: "object",
      required: ["$data"],
      properties: {
        $data: {
          type: "string",
          anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }]
        }
      },
      additionalProperties: false
    };
  }
});

// node_modules/fast-uri/lib/utils.js
var require_utils = __commonJS({
  "node_modules/fast-uri/lib/utils.js"(exports, module) {
    "use strict";
    var isUUID = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu);
    var isIPv4 = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u);
    var isHexPair = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu);
    var isUnreserved = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu);
    var isPathCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/]$/u);
    var isQueryFragmentCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/?]$/u);
    var isUserinfoCharacter = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:]$/u);
    var BYTE_HEX = new Array(256);
    {
      const HEX_DIGITS = "0123456789ABCDEF";
      for (let i = 0; i < 256; i++) {
        BYTE_HEX[i] = "%" + HEX_DIGITS[i >> 4] + HEX_DIGITS[i & 15];
      }
    }
    function percentEncodeNonAscii(cp) {
      if (cp < 2048) {
        return BYTE_HEX[192 | cp >> 6] + BYTE_HEX[128 | cp & 63];
      }
      if (cp < 65536) {
        return BYTE_HEX[224 | cp >> 12] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
      }
      return BYTE_HEX[240 | cp >> 18] + BYTE_HEX[128 | cp >> 12 & 63] + BYTE_HEX[128 | cp >> 6 & 63] + BYTE_HEX[128 | cp & 63];
    }
    function stringArrayToHexStripped(input) {
      let acc = "";
      let code = 0;
      let i = 0;
      for (i = 0; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (code === 48) {
          continue;
        }
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
        break;
      }
      for (i += 1; i < input.length; i++) {
        code = input[i].charCodeAt(0);
        if (!(code >= 48 && code <= 57 || code >= 65 && code <= 70 || code >= 97 && code <= 102)) {
          return "";
        }
        acc += input[i];
      }
      return acc;
    }
    var isHextet = RegExp.prototype.test.bind(/^[\dA-Fa-f]{1,4}$/);
    var isIPvFuture = RegExp.prototype.test.bind(/^[vV][\dA-Fa-f]+\.[A-Za-z\d\-._~!$&'()*+,;=:]+$/);
    var isZoneCharacter = RegExp.prototype.test.bind(/^[A-Za-z\d\-._~]$/);
    var nonSimpleDomain = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
    function isZoneIdentifier(zone) {
      if (zone.length === 0) return false;
      for (let i = 0; i < zone.length; i++) {
        if (isZoneCharacter(zone[i])) continue;
        if (zone[i] === "%" && i + 2 < zone.length && isHexPair(zone.slice(i + 1, i + 3))) {
          i += 2;
          continue;
        }
        return false;
      }
      return true;
    }
    function compressIPv6ZeroRun(hextets) {
      let bestStart = -1;
      let bestLength = 0;
      let runStart = -1;
      let runLength = 0;
      for (let i = 0; i < hextets.length; i++) {
        if (hextets[i] === "0") {
          if (runStart === -1) runStart = i;
          runLength++;
          if (runLength > bestLength) {
            bestLength = runLength;
            bestStart = runStart;
          }
        } else {
          runStart = -1;
          runLength = 0;
        }
      }
      if (bestLength < 2) return hextets.join(":");
      const head = hextets.slice(0, bestStart).join(":");
      const tail = hextets.slice(bestStart + bestLength).join(":");
      return head + "::" + tail;
    }
    function normalizeIPv6Address(input) {
      const compression = input.indexOf("::");
      if (compression !== -1 && input.indexOf("::", compression + 1) !== -1) return void 0;
      const left = compression === -1 ? input.split(":") : input.slice(0, compression).split(":");
      const right = compression === -1 ? [] : input.slice(compression + 2).split(":");
      if (compression !== -1) {
        if (left.length === 1 && left[0] === "") left.length = 0;
        if (right.length === 1 && right[0] === "") right.length = 0;
      }
      const parts = left.concat(right);
      let hextetCount = 0;
      for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part === "") return void 0;
        if (part.indexOf(".") !== -1) {
          if (i !== parts.length - 1 || compression !== -1 && right.length === 0 || !isIPv4(part)) return void 0;
          hextetCount += 2;
          continue;
        }
        if (!isHextet(part)) return void 0;
        parts[i] = parseInt(part, 16).toString(16);
        hextetCount++;
      }
      if (compression === -1) {
        if (hextetCount !== 8) return void 0;
        return compressIPv6ZeroRun(parts);
      }
      if (hextetCount >= 8) return void 0;
      const expanded = parts.slice(0, left.length);
      for (let i = hextetCount; i < 8; i++) expanded.push("0");
      for (let i = left.length; i < parts.length; i++) expanded.push(parts[i]);
      return compressIPv6ZeroRun(expanded);
    }
    function normalizeIPv6(host) {
      const bracketed = host[0] === "[" && host[host.length - 1] === "]";
      const hasBracket = host[0] === "[" || host[host.length - 1] === "]";
      if (hasBracket && !bracketed) return { host, isIPV6: false, error: true };
      let input = bracketed ? host.slice(1, -1) : host;
      if (bracketed && isIPvFuture(input)) {
        input = input.toLowerCase();
        return { host: `[${input}]`, escapedHost: input, isIPV6: false, isIPVFuture: true };
      }
      if (findToken(input, ":") < 2) {
        return { host, isIPV6: false, error: bracketed };
      }
      let zoneIdentifier = "";
      const zoneSeparator = input.indexOf("%");
      if (zoneSeparator !== -1) {
        const separatorLength = input.slice(zoneSeparator, zoneSeparator + 3).toLowerCase() === "%25" ? 3 : 1;
        zoneIdentifier = input.slice(zoneSeparator + separatorLength);
        if (!isZoneIdentifier(zoneIdentifier)) return { host, isIPV6: false, error: true };
        input = input.slice(0, zoneSeparator);
      }
      const address = normalizeIPv6Address(input);
      if (address === void 0) return { host, isIPV6: false, error: true };
      return {
        host: address + (zoneIdentifier ? "%" + zoneIdentifier : ""),
        escapedHost: address + (zoneIdentifier ? "%25" + zoneIdentifier : ""),
        isIPV6: true
      };
    }
    function findToken(str, token) {
      let ind = 0;
      for (let i = 0; i < str.length; i++) {
        if (str[i] === token) ind++;
      }
      return ind;
    }
    function removeDotSegments(path) {
      let input = path;
      const output = [];
      let nextSlash = -1;
      let len = 0;
      while (len = input.length) {
        if (len === 1) {
          if (input === ".") {
            break;
          } else if (input === "/") {
            output.push("/");
            break;
          } else {
            output.push(input);
            break;
          }
        } else if (len === 2) {
          if (input[0] === ".") {
            if (input[1] === ".") {
              break;
            } else if (input[1] === "/") {
              input = input.slice(2);
              continue;
            }
          } else if (input[0] === "/") {
            if (input[1] === "." || input[1] === "/") {
              output.push("/");
              break;
            }
          }
        } else if (len === 3) {
          if (input === "/..") {
            if (output.length !== 0) {
              output.pop();
            }
            output.push("/");
            break;
          }
        }
        if (input[0] === ".") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(3);
              continue;
            }
          } else if (input[1] === "/") {
            input = input.slice(2);
            continue;
          }
        } else if (input[0] === "/") {
          if (input[1] === ".") {
            if (input[2] === "/") {
              input = input.slice(2);
              continue;
            } else if (input[2] === ".") {
              if (input[3] === "/") {
                input = input.slice(3);
                if (output.length !== 0) {
                  output.pop();
                }
                continue;
              }
            }
          }
        }
        if ((nextSlash = input.indexOf("/", 1)) === -1) {
          output.push(input);
          break;
        } else {
          output.push(input.slice(0, nextSlash));
          input = input.slice(nextSlash);
        }
      }
      return output.join("");
    }
    var HOST_DELIMS = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" };
    var HOST_DELIM_RE = /[@/?#:]/g;
    var HOST_DELIM_NO_COLON_RE = /[@/?#]/g;
    function reescapeHostDelimiters(host, isIP) {
      const re = isIP ? HOST_DELIM_NO_COLON_RE : HOST_DELIM_RE;
      re.lastIndex = 0;
      return host.replace(re, (ch) => HOST_DELIMS[ch]);
    }
    function normalizePercentEncoding(input, decodeUnreserved = false) {
      if (input.indexOf("%") === -1) {
        return input;
      }
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decodeUnreserved && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        output += input[i];
      }
      return output;
    }
    function normalizePathEncoding(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (decoded !== "." && isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        if (isPathCharacter(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function serializePathEncoding(input, pathNoScheme = false) {
      let output = "";
      let firstSegment = pathNoScheme && input[0] !== "/";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        if (ch === "/") {
          firstSegment = false;
        }
        if (isPathCharacter(ch) && (ch !== ":" || !firstSegment)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function encodeComponent(input, isAllowed) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        if (isAllowed(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function encodeUserinfo(input) {
      return encodeComponent(input, isUserinfoCharacter);
    }
    function encodeQuery(input) {
      return encodeComponent(input, isQueryFragmentCharacter);
    }
    function encodeFragment(input) {
      return encodeComponent(input, isQueryFragmentCharacter);
    }
    function isEscapeSafe(cp) {
      return cp >= 48 && cp <= 57 || cp >= 65 && cp <= 90 || cp >= 97 && cp <= 122 || cp === 42 || cp === 43 || cp === 45 || cp === 46 || cp === 47 || cp === 64 || cp === 95;
    }
    function normalizeQueryFragmentEncoding(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        const ch = input[i];
        if (ch === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            const normalizedHex = hex.toUpperCase();
            const decoded = String.fromCharCode(parseInt(normalizedHex, 16));
            if (isUnreserved(decoded)) {
              output += decoded;
            } else {
              output += "%" + normalizedHex;
            }
            i += 2;
            continue;
          }
        }
        if (isQueryFragmentCharacter(ch)) {
          output += ch;
        } else {
          const code = input.charCodeAt(i);
          if (code < 128) {
            output += isEscapeSafe(code) ? ch : BYTE_HEX[code];
          } else if (code < 55296 || code > 57343) {
            output += percentEncodeNonAscii(code);
          } else if (code <= 56319 && i + 1 < input.length) {
            const low = input.charCodeAt(i + 1);
            if (low >= 56320 && low <= 57343) {
              output += percentEncodeNonAscii(65536 + (code - 55296 << 10) + (low - 56320));
              i++;
            } else {
              output += percentEncodeNonAscii(65533);
            }
          } else {
            output += percentEncodeNonAscii(65533);
          }
        }
      }
      return output;
    }
    function escapePreservingEscapes(input) {
      let output = "";
      for (let i = 0; i < input.length; i++) {
        if (input[i] === "%" && i + 2 < input.length) {
          const hex = input.slice(i + 1, i + 3);
          if (isHexPair(hex)) {
            output += "%" + hex.toUpperCase();
            i += 2;
            continue;
          }
        }
        output += escape(input[i]);
      }
      return output;
    }
    function recomposeAuthority(component) {
      const uriTokens = [];
      if (component.userinfo !== void 0) {
        uriTokens.push(encodeUserinfo(component.userinfo));
        uriTokens.push("@");
      }
      if (component.host !== void 0) {
        let host = component.host;
        if (!isIPv4(host)) {
          let ipV6res = normalizeIPv6(host);
          if (ipV6res.isIPV6 !== true && ipV6res.isIPVFuture !== true) {
            host = normalizePercentEncoding(host, true);
            ipV6res = normalizeIPv6(host);
          }
          if (ipV6res.isIPV6 === true || ipV6res.isIPVFuture === true) {
            host = `[${ipV6res.escapedHost}]`;
          } else {
            host = reescapeHostDelimiters(host, false);
          }
        }
        uriTokens.push(host);
      }
      if (typeof component.port === "number" || typeof component.port === "string") {
        uriTokens.push(":");
        uriTokens.push(String(component.port));
      }
      return uriTokens.length ? uriTokens.join("") : void 0;
    }
    module.exports = {
      nonSimpleDomain,
      recomposeAuthority,
      reescapeHostDelimiters,
      normalizePercentEncoding,
      normalizePathEncoding,
      serializePathEncoding,
      normalizeQueryFragmentEncoding,
      encodeUserinfo,
      encodeQuery,
      encodeFragment,
      escapePreservingEscapes,
      removeDotSegments,
      isIPv4,
      isUUID,
      normalizeIPv6,
      stringArrayToHexStripped
    };
  }
});

// node_modules/fast-uri/lib/schemes.js
var require_schemes = __commonJS({
  "node_modules/fast-uri/lib/schemes.js"(exports, module) {
    "use strict";
    var { isUUID } = require_utils();
    var URN_REG = /^([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-./:;=@]|%[\da-f]{2})+)$/iu;
    var supportedSchemeNames = (
      /** @type {const} */
      [
        "http",
        "https",
        "ws",
        "wss",
        "urn",
        "urn:uuid"
      ]
    );
    function isValidSchemeName(name) {
      return supportedSchemeNames.indexOf(
        /** @type {*} */
        name
      ) !== -1;
    }
    function wsIsSecure(wsComponent) {
      if (wsComponent.secure === true) {
        return true;
      } else if (wsComponent.secure === false) {
        return false;
      } else if (wsComponent.scheme) {
        return wsComponent.scheme.length === 3 && (wsComponent.scheme[0] === "w" || wsComponent.scheme[0] === "W") && (wsComponent.scheme[1] === "s" || wsComponent.scheme[1] === "S") && (wsComponent.scheme[2] === "s" || wsComponent.scheme[2] === "S");
      } else {
        return false;
      }
    }
    function httpParse(component) {
      if (!component.host) {
        component.error = component.error || "HTTP URIs must have a host.";
      }
      return component;
    }
    function httpSerialize(component) {
      const secure = String(component.scheme).toLowerCase() === "https";
      if (component.port === (secure ? 443 : 80) || component.port === "") {
        component.port = void 0;
      }
      if (!component.path) {
        component.path = "/";
      }
      return component;
    }
    function wsParse(wsComponent) {
      wsComponent.secure = wsIsSecure(wsComponent);
      wsComponent.resourceName = (wsComponent.path || "/") + (wsComponent.query ? "?" + wsComponent.query : "");
      wsComponent.path = void 0;
      wsComponent.query = void 0;
      return wsComponent;
    }
    function wsSerialize(wsComponent) {
      if (wsComponent.port === (wsIsSecure(wsComponent) ? 443 : 80) || wsComponent.port === "") {
        wsComponent.port = void 0;
      }
      if (typeof wsComponent.secure === "boolean") {
        wsComponent.scheme = wsComponent.secure ? "wss" : "ws";
        wsComponent.secure = void 0;
      }
      if (wsComponent.resourceName) {
        const queryIndex = wsComponent.resourceName.indexOf("?");
        const path = queryIndex === -1 ? wsComponent.resourceName : wsComponent.resourceName.slice(0, queryIndex);
        wsComponent.path = path && path !== "/" ? path : void 0;
        wsComponent.query = queryIndex === -1 ? void 0 : wsComponent.resourceName.slice(queryIndex + 1);
        wsComponent.resourceName = void 0;
      }
      wsComponent.fragment = void 0;
      return wsComponent;
    }
    function urnParse(urnComponent, options) {
      if (!urnComponent.path) {
        urnComponent.error = "URN can not be parsed";
        return urnComponent;
      }
      const matches = urnComponent.path.match(URN_REG);
      if (matches && matches[0] === urnComponent.path) {
        const scheme = options.scheme || urnComponent.scheme || "urn";
        urnComponent.nid = matches[1].toLowerCase();
        urnComponent.nss = matches[2];
        const urnScheme = `${scheme}:${options.nid || urnComponent.nid}`;
        const schemeHandler = getSchemeHandler(urnScheme);
        urnComponent.path = void 0;
        if (schemeHandler) {
          urnComponent = schemeHandler.parse(urnComponent, options);
        }
      } else {
        urnComponent.error = urnComponent.error || "URN can not be parsed.";
      }
      return urnComponent;
    }
    function urnSerialize(urnComponent, options) {
      if (urnComponent.nid === void 0) {
        throw new Error("URN without nid cannot be serialized");
      }
      const scheme = options.scheme || urnComponent.scheme || "urn";
      const nid = urnComponent.nid.toLowerCase();
      const urnScheme = `${scheme}:${options.nid || nid}`;
      const schemeHandler = getSchemeHandler(urnScheme);
      if (schemeHandler) {
        urnComponent = schemeHandler.serialize(urnComponent, options);
      }
      const uriComponent = urnComponent;
      const nss = urnComponent.nss;
      uriComponent.path = `${nid || options.nid}:${nss}`;
      options.skipEscape = true;
      return uriComponent;
    }
    function urnuuidParse(urnComponent, options) {
      const uuidComponent = urnComponent;
      uuidComponent.uuid = uuidComponent.nss;
      uuidComponent.nss = void 0;
      if (!options.tolerant && (!uuidComponent.uuid || !isUUID(uuidComponent.uuid))) {
        uuidComponent.error = uuidComponent.error || "UUID is not valid.";
      }
      return uuidComponent;
    }
    function urnuuidSerialize(uuidComponent) {
      const urnComponent = uuidComponent;
      urnComponent.nss = (uuidComponent.uuid || "").toLowerCase();
      return urnComponent;
    }
    var http = (
      /** @type {SchemeHandler} */
      {
        scheme: "http",
        domainHost: true,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var https = (
      /** @type {SchemeHandler} */
      {
        scheme: "https",
        domainHost: http.domainHost,
        parse: httpParse,
        serialize: httpSerialize
      }
    );
    var ws = (
      /** @type {SchemeHandler} */
      {
        scheme: "ws",
        domainHost: true,
        parse: wsParse,
        serialize: wsSerialize
      }
    );
    var wss = (
      /** @type {SchemeHandler} */
      {
        scheme: "wss",
        domainHost: ws.domainHost,
        parse: ws.parse,
        serialize: ws.serialize
      }
    );
    var urn = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn",
        parse: urnParse,
        serialize: urnSerialize,
        skipNormalize: true
      }
    );
    var urnuuid = (
      /** @type {SchemeHandler} */
      {
        scheme: "urn:uuid",
        parse: urnuuidParse,
        serialize: urnuuidSerialize,
        skipNormalize: true
      }
    );
    var SCHEMES = (
      /** @type {Record<SchemeName, SchemeHandler>} */
      {
        http,
        https,
        ws,
        wss,
        urn,
        "urn:uuid": urnuuid
      }
    );
    Object.setPrototypeOf(SCHEMES, null);
    function getSchemeHandler(scheme) {
      return scheme && (SCHEMES[
        /** @type {SchemeName} */
        scheme
      ] || SCHEMES[
        /** @type {SchemeName} */
        scheme.toLowerCase()
      ]) || void 0;
    }
    module.exports = {
      wsIsSecure,
      SCHEMES,
      isValidSchemeName,
      getSchemeHandler
    };
  }
});

// node_modules/fast-uri/index.js
var require_fast_uri = __commonJS({
  "node_modules/fast-uri/index.js"(exports, module) {
    "use strict";
    var { normalizeIPv6, removeDotSegments, recomposeAuthority, normalizePercentEncoding, normalizePathEncoding, serializePathEncoding, normalizeQueryFragmentEncoding, encodeQuery, encodeFragment, reescapeHostDelimiters, isIPv4, nonSimpleDomain } = require_utils();
    var { SCHEMES, getSchemeHandler } = require_schemes();
    var VALID_SCHEME = /^[A-Za-z][A-Za-z0-9+.-]*$/u;
    var MALFORMED_SCHEME_ERROR = "URI scheme is malformed.";
    function decodeValidScheme(scheme) {
      const decodedScheme = unescape(String(scheme));
      if (!VALID_SCHEME.test(decodedScheme)) {
        throw new TypeError(MALFORMED_SCHEME_ERROR);
      }
      return decodedScheme;
    }
    function normalize(uri, options) {
      if (typeof uri === "string") {
        uri = /** @type {T} */
        normalizeString(uri, options);
      } else if (typeof uri === "object") {
        uri = /** @type {T} */
        parse(serialize(uri, options), options);
      }
      return uri;
    }
    function resolve(baseURI, relativeURI, options) {
      const schemelessOptions = options ? Object.assign({ scheme: "null" }, options) : { scheme: "null" };
      const {
        parsed: baseParsed,
        malformedAuthorityOrPort: baseMalformed,
        malformedPercentEncoding: baseMalformedPercentEncoding,
        malformedSchemeSpecific: baseMalformedSchemeSpecific,
        malformedHost: baseMalformedHost,
        malformedScheme: baseMalformedScheme
      } = parseWithStatus(baseURI, schemelessOptions);
      const {
        parsed: relativeParsed,
        malformedAuthorityOrPort: relativeMalformed,
        malformedPercentEncoding: relativeMalformedPercentEncoding,
        malformedSchemeSpecific: relativeMalformedSchemeSpecific,
        malformedHost: relativeMalformedHost,
        malformedScheme: relativeMalformedScheme
      } = parseWithStatus(relativeURI, schemelessOptions);
      if (baseMalformed || relativeMalformed || baseMalformedPercentEncoding || relativeMalformedPercentEncoding || baseMalformedSchemeSpecific || relativeMalformedSchemeSpecific || baseMalformedHost || relativeMalformedHost || baseMalformedScheme || relativeMalformedScheme) {
        throw new Error(baseParsed.error || relativeParsed.error || "URI is malformed.");
      }
      const resolved = resolveComponent(baseParsed, relativeParsed, schemelessOptions, true);
      const resolvedSchemeHandler = getSchemeHandler(options && options.scheme || resolved.scheme);
      const resolvedHost = resolved.host;
      const resolvedHostIsIP = resolvedHost !== void 0 && resolvedHost !== "" && (isIPv4(resolvedHost) || normalizeIPv6(resolvedHost).isIPV6);
      canonicalizeHost(resolved, options || {}, resolvedSchemeHandler, resolvedHostIsIP);
      const encodedASCIIHost = resolvedHost && resolvedHost.indexOf("%") !== -1 && !/\P{ASCII}/u.test(resolvedHost);
      if (resolved.error && !encodedASCIIHost) {
        throw new Error(resolved.error);
      }
      schemelessOptions.skipEscape = true;
      return serialize(resolved, schemelessOptions);
    }
    function resolveComponent(base, relative, options, skipNormalization) {
      const target = {};
      if (!skipNormalization) {
        base = parse(serialize(base, options), options);
        relative = parse(serialize(relative, options), options);
      }
      options = options || {};
      if (!options.tolerant && relative.scheme) {
        target.scheme = relative.scheme;
        target.userinfo = relative.userinfo;
        target.host = relative.host;
        target.port = relative.port;
        target.path = removeDotSegments(relative.path || "");
        target.query = relative.query;
      } else {
        if (relative.userinfo !== void 0 || relative.host !== void 0 || relative.port !== void 0) {
          target.userinfo = relative.userinfo;
          target.host = relative.host;
          target.port = relative.port;
          target.path = removeDotSegments(relative.path || "");
          target.query = relative.query;
        } else {
          if (!relative.path) {
            target.path = base.path;
            if (relative.query !== void 0) {
              target.query = relative.query;
            } else {
              target.query = base.query;
            }
          } else {
            if (relative.path[0] === "/") {
              target.path = removeDotSegments(relative.path);
            } else {
              if ((base.userinfo !== void 0 || base.host !== void 0 || base.port !== void 0) && !base.path) {
                target.path = "/" + relative.path;
              } else if (!base.path) {
                target.path = relative.path;
              } else {
                target.path = base.path.slice(0, base.path.lastIndexOf("/") + 1) + relative.path;
              }
              target.path = removeDotSegments(target.path);
            }
            target.query = relative.query;
          }
          target.userinfo = base.userinfo;
          target.host = base.host;
          target.port = base.port;
        }
        target.scheme = base.scheme;
      }
      target.fragment = relative.fragment;
      return target;
    }
    function equal(uriA, uriB, options) {
      const normalizedA = normalizeComparableURI(uriA, options);
      const normalizedB = normalizeComparableURI(uriB, options);
      return normalizedA !== void 0 && normalizedB !== void 0 && normalizedA === normalizedB;
    }
    function serialize(cmpts, opts) {
      const component = {
        host: cmpts.host,
        scheme: cmpts.scheme,
        userinfo: cmpts.userinfo,
        port: cmpts.port,
        path: cmpts.path,
        query: cmpts.query,
        nid: cmpts.nid,
        nss: cmpts.nss,
        uuid: cmpts.uuid,
        fragment: cmpts.fragment,
        reference: cmpts.reference,
        resourceName: cmpts.resourceName,
        secure: cmpts.secure,
        error: ""
      };
      const options = Object.assign({}, opts);
      const uriTokens = [];
      if (component.scheme) {
        component.scheme = decodeValidScheme(component.scheme);
      }
      const schemeHandler = getSchemeHandler(options.scheme || component.scheme);
      if (schemeHandler && schemeHandler.serialize) schemeHandler.serialize(component, options);
      const hasAuthority = component.userinfo !== void 0 || component.host !== void 0 || component.port !== void 0;
      const pathNoScheme = !options.skipEscape && component.scheme === void 0 && !hasAuthority;
      if (component.path !== void 0) {
        if (!options.skipEscape) {
          component.path = serializePathEncoding(component.path, pathNoScheme);
        } else {
          component.path = normalizePercentEncoding(component.path);
        }
      }
      if (options.reference !== "suffix" && component.scheme) {
        component.scheme = decodeValidScheme(component.scheme);
        uriTokens.push(component.scheme, ":");
      }
      const authority = recomposeAuthority(component);
      if (authority !== void 0) {
        if (options.reference !== "suffix") {
          uriTokens.push("//");
        }
        uriTokens.push(authority);
        if (component.path && component.path[0] !== "/") {
          uriTokens.push("/");
        }
      }
      if (component.path !== void 0) {
        let s = component.path;
        if (!options.absolutePath && (!schemeHandler || !schemeHandler.absolutePath)) {
          s = removeDotSegments(s);
        }
        if (pathNoScheme) {
          s = serializePathEncoding(s, true);
        }
        if (authority === void 0 && s[0] === "/" && s[1] === "/") {
          s = "/%2F" + s.slice(2);
        }
        uriTokens.push(s);
      }
      if (component.query !== void 0) {
        uriTokens.push("?", encodeQuery(component.query));
      }
      if (component.fragment !== void 0) {
        uriTokens.push("#", encodeFragment(component.fragment));
      }
      return uriTokens.join("");
    }
    var URI_PARSE = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u;
    var AUTHORITY_PREFIX = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/;
    var AUTHORITY_INTRODUCER_REGION = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
    function getParseError(parsed, matches) {
      if (matches[2] !== void 0 && parsed.path && parsed.path[0] !== "/") {
        return 'URI path must start with "/" when authority is present.';
      }
      if (typeof parsed.port === "number" && (parsed.port < 0 || parsed.port > 65535)) {
        return "URI port is malformed.";
      }
      return void 0;
    }
    function hasMalformedPercentEncoding(component) {
      if (component === void 0) return false;
      let percent = component.indexOf("%");
      while (percent !== -1) {
        if (percent + 2 >= component.length || !/^[\da-f]{2}$/iu.test(component.slice(percent + 1, percent + 3))) {
          return true;
        }
        percent = component.indexOf("%", percent + 3);
      }
      return false;
    }
    function hasMalformedComponentPercentEncoding(matches) {
      const host = matches[4];
      return hasMalformedPercentEncoding(matches[3]) || host !== void 0 && !(host[0] === "[" && host[host.length - 1] === "]") && hasMalformedPercentEncoding(host) || hasMalformedPercentEncoding(matches[6]) || hasMalformedPercentEncoding(matches[7]) || hasMalformedPercentEncoding(matches[8]);
    }
    function canonicalizeHost(parsed, options, schemeHandler, isIP) {
      if (!options.unicodeSupport && (!schemeHandler || !schemeHandler.unicodeSupport) && parsed.host && parsed.host[0] !== "[" && (options.domainHost || schemeHandler && schemeHandler.domainHost) && isIP === false && nonSimpleDomain(parsed.host)) {
        try {
          parsed.host = new URL("http://" + parsed.host).hostname;
        } catch (e) {
          parsed.error = parsed.error || "Host's domain name can not be converted to ASCII: " + e;
          return true;
        }
      }
      return false;
    }
    function parseWithStatus(uri, opts) {
      const options = Object.assign({}, opts);
      const parsed = {
        scheme: void 0,
        userinfo: void 0,
        host: "",
        port: void 0,
        path: "",
        query: void 0,
        fragment: void 0
      };
      let malformedAuthorityOrPort = false;
      let malformedPercentEncoding = false;
      let malformedSchemeSpecific = false;
      let malformedHost = false;
      let malformedIPLiteral = false;
      let malformedScheme = false;
      let isIP = false;
      if (options.reference === "suffix") {
        if (options.scheme) {
          uri = options.scheme + ":" + uri;
        } else {
          uri = "//" + uri;
        }
      }
      const authorityMatch = uri.match(AUTHORITY_PREFIX);
      if (authorityMatch !== null && authorityMatch[1].indexOf("\\") !== -1) {
        parsed.error = "URI authority must not contain a literal backslash.";
        malformedAuthorityOrPort = true;
      }
      const introducerMatch = uri.match(AUTHORITY_INTRODUCER_REGION);
      if (introducerMatch !== null) {
        const region = introducerMatch[1];
        const normalizedRegion = region.replace(/[\t\n\r]/g, "");
        if (normalizedRegion.length >= 2) {
          if (normalizedRegion.slice(0, 2) !== "//") {
            parsed.error = parsed.error || "URI authority must not contain a literal backslash.";
            malformedAuthorityOrPort = true;
          } else if (region.length !== normalizedRegion.length) {
            parsed.error = parsed.error || "URI authority introducer must not contain whitespace.";
            malformedAuthorityOrPort = true;
          }
        }
      }
      const matches = uri.match(URI_PARSE);
      if (matches) {
        parsed.scheme = matches[1];
        parsed.userinfo = matches[3];
        parsed.host = matches[4];
        parsed.port = parseInt(matches[5], 10);
        parsed.path = matches[6] || "";
        parsed.query = matches[7];
        parsed.fragment = matches[8];
        if (parsed.scheme !== void 0) {
          const decodedScheme = unescape(parsed.scheme);
          if (VALID_SCHEME.test(decodedScheme)) {
            parsed.scheme = decodedScheme.toLowerCase();
          } else {
            parsed.error = parsed.error || MALFORMED_SCHEME_ERROR;
            malformedScheme = true;
          }
        }
        malformedPercentEncoding = hasMalformedComponentPercentEncoding(matches);
        if (malformedPercentEncoding) {
          parsed.error = parsed.error || "URI contains malformed percent-encoding.";
        }
        if (isNaN(parsed.port)) {
          parsed.port = matches[5];
        }
        const parseError = getParseError(parsed, matches);
        if (parseError !== void 0) {
          parsed.error = parsed.error || parseError;
          malformedAuthorityOrPort = true;
        }
        if (parsed.host) {
          const ipv4result = isIPv4(parsed.host);
          if (ipv4result === false) {
            const bracketedIPLiteral = parsed.host[0] === "[" && parsed.host[parsed.host.length - 1] === "]";
            const ipv6result = normalizeIPv6(parsed.host);
            isIP = ipv6result.isIPV6 || ipv6result.isIPVFuture === true;
            malformedIPLiteral = bracketedIPLiteral && ipv6result.error === true;
            parsed.host = isIP ? ipv6result.host : ipv6result.host.toLowerCase();
            if (malformedIPLiteral) {
              parsed.error = parsed.error || "URI host is malformed.";
              malformedAuthorityOrPort = true;
            }
          } else {
            isIP = true;
          }
        }
        if (parsed.scheme === void 0 && parsed.userinfo === void 0 && parsed.host === void 0 && parsed.port === void 0 && parsed.query === void 0 && !parsed.path) {
          parsed.reference = "same-document";
        } else if (parsed.scheme === void 0) {
          parsed.reference = "relative";
        } else if (parsed.fragment === void 0) {
          parsed.reference = "absolute";
        } else {
          parsed.reference = "uri";
        }
        if (options.reference && options.reference !== "suffix" && options.reference !== parsed.reference) {
          parsed.error = parsed.error || "URI is not a " + options.reference + " reference.";
        }
        const schemeHandler = getSchemeHandler(options.scheme || parsed.scheme);
        malformedHost = canonicalizeHost(parsed, options, schemeHandler, isIP);
        if (!schemeHandler || schemeHandler && !schemeHandler.skipNormalize) {
          if (uri.indexOf("%") !== -1) {
            if (parsed.host !== void 0 && !malformedIPLiteral) {
              const host = isIP ? parsed.host : normalizePercentEncoding(parsed.host, true);
              parsed.host = reescapeHostDelimiters(host, isIP);
            }
          }
          if (parsed.path) {
            parsed.path = normalizePathEncoding(parsed.path);
          }
          if (parsed.query) {
            parsed.query = normalizeQueryFragmentEncoding(parsed.query);
          }
          if (parsed.fragment) {
            parsed.fragment = normalizeQueryFragmentEncoding(parsed.fragment);
          }
        }
        if (schemeHandler && schemeHandler.parse) {
          schemeHandler.parse(parsed, options);
          if (schemeHandler === SCHEMES.urn && parsed.nid === void 0) {
            malformedSchemeSpecific = true;
          }
        }
      } else {
        parsed.error = parsed.error || "URI can not be parsed.";
      }
      return { parsed, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme };
    }
    function parse(uri, opts) {
      return parseWithStatus(uri, opts).parsed;
    }
    function normalizeString(uri, opts) {
      return normalizeStringWithStatus(uri, opts).normalized;
    }
    function normalizeStringWithStatus(uri, opts) {
      const { parsed, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = parseWithStatus(uri, opts);
      return {
        normalized: malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? uri : serialize(parsed, opts),
        malformedAuthorityOrPort,
        malformedPercentEncoding,
        malformedSchemeSpecific,
        malformedHost,
        malformedScheme
      };
    }
    function normalizeComparableURI(uri, opts) {
      if (typeof uri !== "string" && typeof uri !== "object") {
        return void 0;
      }
      let value;
      try {
        value = typeof uri === "string" ? uri : serialize(uri, opts);
      } catch {
        return void 0;
      }
      const { normalized, malformedAuthorityOrPort, malformedPercentEncoding, malformedSchemeSpecific, malformedHost, malformedScheme } = normalizeStringWithStatus(value, opts);
      return malformedAuthorityOrPort || malformedPercentEncoding || malformedSchemeSpecific || malformedHost || malformedScheme ? void 0 : normalized;
    }
    var fastUri = {
      SCHEMES,
      normalize,
      resolve,
      resolveComponent,
      equal,
      serialize,
      parse
    };
    module.exports = fastUri;
    module.exports.default = fastUri;
    module.exports.fastUri = fastUri;
  }
});

// node_modules/ajv/dist/runtime/uri.js
var require_uri = __commonJS({
  "node_modules/ajv/dist/runtime/uri.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var uri = require_fast_uri();
    uri.code = 'require("ajv/dist/runtime/uri").default';
    exports.default = uri;
  }
});

// node_modules/ajv/dist/core.js
var require_core = __commonJS({
  "node_modules/ajv/dist/core.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = void 0;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    var ref_error_1 = require_ref_error();
    var rules_1 = require_rules();
    var compile_1 = require_compile();
    var codegen_2 = require_codegen();
    var resolve_1 = require_resolve();
    var dataType_1 = require_dataType();
    var util_1 = require_util();
    var $dataRefSchema = require_data();
    var uri_1 = require_uri();
    var defaultRegExp = (str, flags) => new RegExp(str, flags);
    defaultRegExp.code = "new RegExp";
    var META_IGNORE_OPTIONS = ["removeAdditional", "useDefaults", "coerceTypes"];
    var EXT_SCOPE_NAMES = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]);
    var removedOptions = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    };
    var deprecatedOptions = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    };
    var MAX_EXPRESSION = 200;
    function requiredOptions(o) {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0;
      const s = o.strict;
      const _optz = (_a = o.code) === null || _a === void 0 ? void 0 : _a.optimize;
      const optimize = _optz === true || _optz === void 0 ? 1 : _optz || 0;
      const regExp = (_c = (_b = o.code) === null || _b === void 0 ? void 0 : _b.regExp) !== null && _c !== void 0 ? _c : defaultRegExp;
      const uriResolver = (_d = o.uriResolver) !== null && _d !== void 0 ? _d : uri_1.default;
      return {
        strictSchema: (_f = (_e = o.strictSchema) !== null && _e !== void 0 ? _e : s) !== null && _f !== void 0 ? _f : true,
        strictNumbers: (_h = (_g = o.strictNumbers) !== null && _g !== void 0 ? _g : s) !== null && _h !== void 0 ? _h : true,
        strictTypes: (_k = (_j = o.strictTypes) !== null && _j !== void 0 ? _j : s) !== null && _k !== void 0 ? _k : "log",
        strictTuples: (_m = (_l = o.strictTuples) !== null && _l !== void 0 ? _l : s) !== null && _m !== void 0 ? _m : "log",
        strictRequired: (_p = (_o = o.strictRequired) !== null && _o !== void 0 ? _o : s) !== null && _p !== void 0 ? _p : false,
        code: o.code ? { ...o.code, optimize, regExp } : { optimize, regExp },
        loopRequired: (_q = o.loopRequired) !== null && _q !== void 0 ? _q : MAX_EXPRESSION,
        loopEnum: (_r = o.loopEnum) !== null && _r !== void 0 ? _r : MAX_EXPRESSION,
        meta: (_s = o.meta) !== null && _s !== void 0 ? _s : true,
        messages: (_t = o.messages) !== null && _t !== void 0 ? _t : true,
        inlineRefs: (_u = o.inlineRefs) !== null && _u !== void 0 ? _u : true,
        schemaId: (_v = o.schemaId) !== null && _v !== void 0 ? _v : "$id",
        addUsedSchema: (_w = o.addUsedSchema) !== null && _w !== void 0 ? _w : true,
        validateSchema: (_x = o.validateSchema) !== null && _x !== void 0 ? _x : true,
        validateFormats: (_y = o.validateFormats) !== null && _y !== void 0 ? _y : true,
        unicodeRegExp: (_z = o.unicodeRegExp) !== null && _z !== void 0 ? _z : true,
        int32range: (_0 = o.int32range) !== null && _0 !== void 0 ? _0 : true,
        uriResolver
      };
    }
    var Ajv2 = class {
      constructor(opts = {}) {
        this.schemas = {};
        this.refs = {};
        this.formats = /* @__PURE__ */ Object.create(null);
        this._compilations = /* @__PURE__ */ new Set();
        this._loading = {};
        this._cache = /* @__PURE__ */ new Map();
        opts = this.opts = { ...opts, ...requiredOptions(opts) };
        const { es5, lines } = this.opts.code;
        this.scope = new codegen_2.ValueScope({ scope: {}, prefixes: EXT_SCOPE_NAMES, es5, lines });
        this.logger = getLogger(opts.logger);
        const formatOpt = opts.validateFormats;
        opts.validateFormats = false;
        this.RULES = (0, rules_1.getRules)();
        checkOptions.call(this, removedOptions, opts, "NOT SUPPORTED");
        checkOptions.call(this, deprecatedOptions, opts, "DEPRECATED", "warn");
        this._metaOpts = getMetaSchemaOptions.call(this);
        if (opts.formats)
          addInitialFormats.call(this);
        this._addVocabularies();
        this._addDefaultMetaSchema();
        if (opts.keywords)
          addInitialKeywords.call(this, opts.keywords);
        if (typeof opts.meta == "object")
          this.addMetaSchema(opts.meta);
        addInitialSchemas.call(this);
        opts.validateFormats = formatOpt;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data, meta, schemaId } = this.opts;
        let _dataRefSchema = $dataRefSchema;
        if (schemaId === "id") {
          _dataRefSchema = { ...$dataRefSchema };
          _dataRefSchema.id = _dataRefSchema.$id;
          delete _dataRefSchema.$id;
        }
        if (meta && $data)
          this.addMetaSchema(_dataRefSchema, _dataRefSchema[schemaId], false);
      }
      defaultMeta() {
        const { meta, schemaId } = this.opts;
        return this.opts.defaultMeta = typeof meta == "object" ? meta[schemaId] || meta : void 0;
      }
      validate(schemaKeyRef, data) {
        let v;
        if (typeof schemaKeyRef == "string") {
          v = this.getSchema(schemaKeyRef);
          if (!v)
            throw new Error(`no schema with key or ref "${schemaKeyRef}"`);
        } else {
          v = this.compile(schemaKeyRef);
        }
        const valid = v(data);
        if (!("$async" in v))
          this.errors = v.errors;
        return valid;
      }
      compile(schema, _meta) {
        const sch = this._addSchema(schema, _meta);
        return sch.validate || this._compileSchemaEnv(sch);
      }
      compileAsync(schema, meta) {
        if (typeof this.opts.loadSchema != "function") {
          throw new Error("options.loadSchema should be a function");
        }
        const { loadSchema } = this.opts;
        return runCompileAsync.call(this, schema, meta);
        async function runCompileAsync(_schema, _meta) {
          await loadMetaSchema.call(this, _schema.$schema);
          const sch = this._addSchema(_schema, _meta);
          return sch.validate || _compileAsync.call(this, sch);
        }
        async function loadMetaSchema($ref) {
          if ($ref && !this.getSchema($ref)) {
            await runCompileAsync.call(this, { $ref }, true);
          }
        }
        async function _compileAsync(sch) {
          try {
            return this._compileSchemaEnv(sch);
          } catch (e) {
            if (!(e instanceof ref_error_1.default))
              throw e;
            checkLoaded.call(this, e);
            await loadMissingSchema.call(this, e.missingSchema);
            return _compileAsync.call(this, sch);
          }
        }
        function checkLoaded({ missingSchema: ref, missingRef }) {
          if (this.refs[ref]) {
            throw new Error(`AnySchema ${ref} is loaded but ${missingRef} cannot be resolved`);
          }
        }
        async function loadMissingSchema(ref) {
          const _schema = await _loadSchema.call(this, ref);
          if (!this.refs[ref])
            await loadMetaSchema.call(this, _schema.$schema);
          if (!this.refs[ref])
            this.addSchema(_schema, ref, meta);
        }
        async function _loadSchema(ref) {
          const p = this._loading[ref];
          if (p)
            return p;
          try {
            return await (this._loading[ref] = loadSchema(ref));
          } finally {
            delete this._loading[ref];
          }
        }
      }
      // Adds schema to the instance
      addSchema(schema, key, _meta, _validateSchema = this.opts.validateSchema) {
        if (Array.isArray(schema)) {
          for (const sch of schema)
            this.addSchema(sch, void 0, _meta, _validateSchema);
          return this;
        }
        let id;
        if (typeof schema === "object") {
          const { schemaId } = this.opts;
          id = schema[schemaId];
          if (id !== void 0 && typeof id != "string") {
            throw new Error(`schema ${schemaId} must be string`);
          }
        }
        key = (0, resolve_1.normalizeId)(key || id);
        this._checkUnique(key);
        this.schemas[key] = this._addSchema(schema, _meta, key, _validateSchema, true);
        return this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(schema, key, _validateSchema = this.opts.validateSchema) {
        this.addSchema(schema, key, true, _validateSchema);
        return this;
      }
      //  Validate schema against its meta-schema
      validateSchema(schema, throwOrLogError) {
        if (typeof schema == "boolean")
          return true;
        let $schema;
        $schema = schema.$schema;
        if ($schema !== void 0 && typeof $schema != "string") {
          throw new Error("$schema must be a string");
        }
        $schema = $schema || this.opts.defaultMeta || this.defaultMeta();
        if (!$schema) {
          this.logger.warn("meta-schema not available");
          this.errors = null;
          return true;
        }
        const valid = this.validate($schema, schema);
        if (!valid && throwOrLogError) {
          const message = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(message);
          else
            throw new Error(message);
        }
        return valid;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(keyRef) {
        let sch;
        while (typeof (sch = getSchEnv.call(this, keyRef)) == "string")
          keyRef = sch;
        if (sch === void 0) {
          const { schemaId } = this.opts;
          const root = new compile_1.SchemaEnv({ schema: {}, schemaId });
          sch = compile_1.resolveSchema.call(this, root, keyRef);
          if (!sch)
            return;
          this.refs[keyRef] = sch;
        }
        return sch.validate || this._compileSchemaEnv(sch);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(schemaKeyRef) {
        if (schemaKeyRef instanceof RegExp) {
          this._removeAllSchemas(this.schemas, schemaKeyRef);
          this._removeAllSchemas(this.refs, schemaKeyRef);
          return this;
        }
        switch (typeof schemaKeyRef) {
          case "undefined":
            this._removeAllSchemas(this.schemas);
            this._removeAllSchemas(this.refs);
            this._cache.clear();
            return this;
          case "string": {
            const sch = getSchEnv.call(this, schemaKeyRef);
            if (typeof sch == "object")
              this._cache.delete(sch.schema);
            delete this.schemas[schemaKeyRef];
            delete this.refs[schemaKeyRef];
            return this;
          }
          case "object": {
            const cacheKey = schemaKeyRef;
            this._cache.delete(cacheKey);
            let id = schemaKeyRef[this.opts.schemaId];
            if (id) {
              id = (0, resolve_1.normalizeId)(id);
              delete this.schemas[id];
              delete this.refs[id];
            }
            return this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(definitions) {
        for (const def of definitions)
          this.addKeyword(def);
        return this;
      }
      addKeyword(kwdOrDef, def) {
        let keyword;
        if (typeof kwdOrDef == "string") {
          keyword = kwdOrDef;
          if (typeof def == "object") {
            this.logger.warn("these parameters are deprecated, see docs for addKeyword");
            def.keyword = keyword;
          }
        } else if (typeof kwdOrDef == "object" && def === void 0) {
          def = kwdOrDef;
          keyword = def.keyword;
          if (Array.isArray(keyword) && !keyword.length) {
            throw new Error("addKeywords: keyword must be string or non-empty array");
          }
        } else {
          throw new Error("invalid addKeywords parameters");
        }
        checkKeyword.call(this, keyword, def);
        if (!def) {
          (0, util_1.eachItem)(keyword, (kwd) => addRule.call(this, kwd));
          return this;
        }
        keywordMetaschema.call(this, def);
        const definition = {
          ...def,
          type: (0, dataType_1.getJSONTypes)(def.type),
          schemaType: (0, dataType_1.getJSONTypes)(def.schemaType)
        };
        (0, util_1.eachItem)(keyword, definition.type.length === 0 ? (k) => addRule.call(this, k, definition) : (k) => definition.type.forEach((t) => addRule.call(this, k, definition, t)));
        return this;
      }
      getKeyword(keyword) {
        const rule = this.RULES.all[keyword];
        return typeof rule == "object" ? rule.definition : !!rule;
      }
      // Remove keyword
      removeKeyword(keyword) {
        const { RULES } = this;
        delete RULES.keywords[keyword];
        delete RULES.all[keyword];
        for (const group of RULES.rules) {
          const i = group.rules.findIndex((rule) => rule.keyword === keyword);
          if (i >= 0)
            group.rules.splice(i, 1);
        }
        return this;
      }
      // Add format
      addFormat(name, format) {
        if (typeof format == "string")
          format = new RegExp(format);
        this.formats[name] = format;
        return this;
      }
      errorsText(errors = this.errors, { separator = ", ", dataVar = "data" } = {}) {
        if (!errors || errors.length === 0)
          return "No errors";
        return errors.map((e) => `${dataVar}${e.instancePath} ${e.message}`).reduce((text, msg) => text + separator + msg);
      }
      $dataMetaSchema(metaSchema, keywordsJsonPointers) {
        const rules = this.RULES.all;
        metaSchema = JSON.parse(JSON.stringify(metaSchema));
        for (const jsonPointer of keywordsJsonPointers) {
          const segments = jsonPointer.split("/").slice(1);
          let keywords = metaSchema;
          for (const seg of segments)
            keywords = keywords[seg];
          for (const key in rules) {
            const rule = rules[key];
            if (typeof rule != "object")
              continue;
            const { $data } = rule.definition;
            const schema = keywords[key];
            if ($data && schema)
              keywords[key] = schemaOrData(schema);
          }
        }
        return metaSchema;
      }
      _removeAllSchemas(schemas, regex) {
        for (const keyRef in schemas) {
          const sch = schemas[keyRef];
          if (!regex || regex.test(keyRef)) {
            if (typeof sch == "string") {
              delete schemas[keyRef];
            } else if (sch && !sch.meta) {
              this._cache.delete(sch.schema);
              delete schemas[keyRef];
            }
          }
        }
      }
      _addSchema(schema, meta, baseId, validateSchema = this.opts.validateSchema, addSchema = this.opts.addUsedSchema) {
        let id;
        const { schemaId } = this.opts;
        if (typeof schema == "object") {
          id = schema[schemaId];
        } else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          else if (typeof schema != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let sch = this._cache.get(schema);
        if (sch !== void 0)
          return sch;
        baseId = (0, resolve_1.normalizeId)(id || baseId);
        const localRefs = resolve_1.getSchemaRefs.call(this, schema, baseId);
        sch = new compile_1.SchemaEnv({ schema, schemaId, meta, baseId, localRefs });
        this._cache.set(sch.schema, sch);
        if (addSchema && !baseId.startsWith("#")) {
          if (baseId)
            this._checkUnique(baseId);
          this.refs[baseId] = sch;
        }
        if (validateSchema)
          this.validateSchema(schema, true);
        return sch;
      }
      _checkUnique(id) {
        if (this.schemas[id] || this.refs[id]) {
          throw new Error(`schema with key or id "${id}" already exists`);
        }
      }
      _compileSchemaEnv(sch) {
        if (sch.meta)
          this._compileMetaSchema(sch);
        else
          compile_1.compileSchema.call(this, sch);
        if (!sch.validate)
          throw new Error("ajv implementation error");
        return sch.validate;
      }
      _compileMetaSchema(sch) {
        const currentOpts = this.opts;
        this.opts = this._metaOpts;
        try {
          compile_1.compileSchema.call(this, sch);
        } finally {
          this.opts = currentOpts;
        }
      }
    };
    Ajv2.ValidationError = validation_error_1.default;
    Ajv2.MissingRefError = ref_error_1.default;
    exports.default = Ajv2;
    function checkOptions(checkOpts, options, msg, log = "error") {
      for (const key in checkOpts) {
        const opt = key;
        if (opt in options)
          this.logger[log](`${msg}: option ${key}. ${checkOpts[opt]}`);
      }
    }
    function getSchEnv(keyRef) {
      keyRef = (0, resolve_1.normalizeId)(keyRef);
      return this.schemas[keyRef] || this.refs[keyRef];
    }
    function addInitialSchemas() {
      const optsSchemas = this.opts.schemas;
      if (!optsSchemas)
        return;
      if (Array.isArray(optsSchemas))
        this.addSchema(optsSchemas);
      else
        for (const key in optsSchemas)
          this.addSchema(optsSchemas[key], key);
    }
    function addInitialFormats() {
      for (const name in this.opts.formats) {
        const format = this.opts.formats[name];
        if (format)
          this.addFormat(name, format);
      }
    }
    function addInitialKeywords(defs) {
      if (Array.isArray(defs)) {
        this.addVocabulary(defs);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const keyword in defs) {
        const def = defs[keyword];
        if (!def.keyword)
          def.keyword = keyword;
        this.addKeyword(def);
      }
    }
    function getMetaSchemaOptions() {
      const metaOpts = { ...this.opts };
      for (const opt of META_IGNORE_OPTIONS)
        delete metaOpts[opt];
      return metaOpts;
    }
    var noLogs = { log() {
    }, warn() {
    }, error() {
    } };
    function getLogger(logger) {
      if (logger === false)
        return noLogs;
      if (logger === void 0)
        return console;
      if (logger.log && logger.warn && logger.error)
        return logger;
      throw new Error("logger must implement log, warn and error methods");
    }
    var KEYWORD_NAME = /^[a-z_$][a-z0-9_$:-]*$/i;
    function checkKeyword(keyword, def) {
      const { RULES } = this;
      (0, util_1.eachItem)(keyword, (kwd) => {
        if (RULES.keywords[kwd])
          throw new Error(`Keyword ${kwd} is already defined`);
        if (!KEYWORD_NAME.test(kwd))
          throw new Error(`Keyword ${kwd} has invalid name`);
      });
      if (!def)
        return;
      if (def.$data && !("code" in def || "validate" in def)) {
        throw new Error('$data keyword must have "code" or "validate" function');
      }
    }
    function addRule(keyword, definition, dataType) {
      var _a;
      const post = definition === null || definition === void 0 ? void 0 : definition.post;
      if (dataType && post)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES } = this;
      let ruleGroup = post ? RULES.post : RULES.rules.find(({ type: t }) => t === dataType);
      if (!ruleGroup) {
        ruleGroup = { type: dataType, rules: [] };
        RULES.rules.push(ruleGroup);
      }
      RULES.keywords[keyword] = true;
      if (!definition)
        return;
      const rule = {
        keyword,
        definition: {
          ...definition,
          type: (0, dataType_1.getJSONTypes)(definition.type),
          schemaType: (0, dataType_1.getJSONTypes)(definition.schemaType)
        }
      };
      if (definition.before)
        addBeforeRule.call(this, ruleGroup, rule, definition.before);
      else
        ruleGroup.rules.push(rule);
      RULES.all[keyword] = rule;
      (_a = definition.implements) === null || _a === void 0 ? void 0 : _a.forEach((kwd) => this.addKeyword(kwd));
    }
    function addBeforeRule(ruleGroup, rule, before) {
      const i = ruleGroup.rules.findIndex((_rule) => _rule.keyword === before);
      if (i >= 0) {
        ruleGroup.rules.splice(i, 0, rule);
      } else {
        ruleGroup.rules.push(rule);
        this.logger.warn(`rule ${before} is not defined`);
      }
    }
    function keywordMetaschema(def) {
      let { metaSchema } = def;
      if (metaSchema === void 0)
        return;
      if (def.$data && this.opts.$data)
        metaSchema = schemaOrData(metaSchema);
      def.validateSchema = this.compile(metaSchema, true);
    }
    var $dataRef = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function schemaOrData(schema) {
      return { anyOf: [schema, $dataRef] };
    }
  }
});

// node_modules/ajv/dist/vocabularies/core/id.js
var require_id = __commonJS({
  "node_modules/ajv/dist/vocabularies/core/id.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var def = {
      keyword: "id",
      code() {
        throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/core/ref.js
var require_ref = __commonJS({
  "node_modules/ajv/dist/vocabularies/core/ref.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.callRef = exports.getValidate = void 0;
    var ref_error_1 = require_ref_error();
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var compile_1 = require_compile();
    var util_1 = require_util();
    var def = {
      keyword: "$ref",
      schemaType: "string",
      code(cxt) {
        const { gen, schema: $ref, it } = cxt;
        const { baseId, schemaEnv: env, validateName, opts, self } = it;
        const { root } = env;
        if (($ref === "#" || $ref === "#/") && baseId === root.baseId)
          return callRootRef();
        const schOrEnv = compile_1.resolveRef.call(self, root, baseId, $ref);
        if (schOrEnv === void 0)
          throw new ref_error_1.default(it.opts.uriResolver, baseId, $ref);
        if (schOrEnv instanceof compile_1.SchemaEnv)
          return callValidate(schOrEnv);
        return inlineRefSchema(schOrEnv);
        function callRootRef() {
          if (env === root)
            return callRef(cxt, validateName, env, env.$async);
          const rootName = gen.scopeValue("root", { ref: root });
          return callRef(cxt, (0, codegen_1._)`${rootName}.validate`, root, root.$async);
        }
        function callValidate(sch) {
          const v = getValidate(cxt, sch);
          callRef(cxt, v, sch, sch.$async);
        }
        function inlineRefSchema(sch) {
          const schName = gen.scopeValue("schema", opts.code.source === true ? { ref: sch, code: (0, codegen_1.stringify)(sch) } : { ref: sch });
          const valid = gen.name("valid");
          const schCxt = cxt.subschema({
            schema: sch,
            dataTypes: [],
            schemaPath: codegen_1.nil,
            topSchemaRef: schName,
            errSchemaPath: $ref
          }, valid);
          cxt.mergeEvaluated(schCxt);
          cxt.ok(valid);
        }
      }
    };
    function getValidate(cxt, sch) {
      const { gen } = cxt;
      return sch.validate ? gen.scopeValue("validate", { ref: sch.validate }) : (0, codegen_1._)`${gen.scopeValue("wrapper", { ref: sch })}.validate`;
    }
    exports.getValidate = getValidate;
    function callRef(cxt, v, sch, $async) {
      const { gen, it } = cxt;
      const { allErrors, schemaEnv: env, opts } = it;
      const passCxt = opts.passContext ? names_1.default.this : codegen_1.nil;
      if ($async)
        callAsyncRef();
      else
        callSyncRef();
      function callAsyncRef() {
        if (!env.$async)
          throw new Error("async schema referenced by sync schema");
        const valid = gen.let("valid");
        gen.try(() => {
          gen.code((0, codegen_1._)`await ${(0, code_1.callValidateCode)(cxt, v, passCxt)}`);
          addEvaluatedFrom(v);
          if (!allErrors)
            gen.assign(valid, true);
        }, (e) => {
          gen.if((0, codegen_1._)`!(${e} instanceof ${it.ValidationError})`, () => gen.throw(e));
          addErrorsFrom(e);
          if (!allErrors)
            gen.assign(valid, false);
        });
        cxt.ok(valid);
      }
      function callSyncRef() {
        cxt.result((0, code_1.callValidateCode)(cxt, v, passCxt), () => addEvaluatedFrom(v), () => addErrorsFrom(v));
      }
      function addErrorsFrom(source) {
        const errs = (0, codegen_1._)`${source}.errors`;
        gen.assign(names_1.default.vErrors, (0, codegen_1._)`${names_1.default.vErrors} === null ? ${errs} : ${names_1.default.vErrors}.concat(${errs})`);
        gen.assign(names_1.default.errors, (0, codegen_1._)`${names_1.default.vErrors}.length`);
      }
      function addEvaluatedFrom(source) {
        var _a;
        if (!it.opts.unevaluated)
          return;
        const schEvaluated = (_a = sch === null || sch === void 0 ? void 0 : sch.validate) === null || _a === void 0 ? void 0 : _a.evaluated;
        if (it.props !== true) {
          if (schEvaluated && !schEvaluated.dynamicProps) {
            if (schEvaluated.props !== void 0) {
              it.props = util_1.mergeEvaluated.props(gen, schEvaluated.props, it.props);
            }
          } else {
            const props = gen.var("props", (0, codegen_1._)`${source}.evaluated.props`);
            it.props = util_1.mergeEvaluated.props(gen, props, it.props, codegen_1.Name);
          }
        }
        if (it.items !== true) {
          if (schEvaluated && !schEvaluated.dynamicItems) {
            if (schEvaluated.items !== void 0) {
              it.items = util_1.mergeEvaluated.items(gen, schEvaluated.items, it.items);
            }
          } else {
            const items = gen.var("items", (0, codegen_1._)`${source}.evaluated.items`);
            it.items = util_1.mergeEvaluated.items(gen, items, it.items, codegen_1.Name);
          }
        }
      }
    }
    exports.callRef = callRef;
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/core/index.js
var require_core2 = __commonJS({
  "node_modules/ajv/dist/vocabularies/core/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var id_1 = require_id();
    var ref_1 = require_ref();
    var core = [
      "$schema",
      "$id",
      "$defs",
      "$vocabulary",
      { keyword: "$comment" },
      "definitions",
      id_1.default,
      ref_1.default
    ];
    exports.default = core;
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitNumber.js
var require_limitNumber = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitNumber.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var ops = codegen_1.operators;
    var KWDs = {
      maximum: { okStr: "<=", ok: ops.LTE, fail: ops.GT },
      minimum: { okStr: ">=", ok: ops.GTE, fail: ops.LT },
      exclusiveMaximum: { okStr: "<", ok: ops.LT, fail: ops.GTE },
      exclusiveMinimum: { okStr: ">", ok: ops.GT, fail: ops.LTE }
    };
    var error = {
      message: ({ keyword, schemaCode }) => (0, codegen_1.str)`must be ${KWDs[keyword].okStr} ${schemaCode}`,
      params: ({ keyword, schemaCode }) => (0, codegen_1._)`{comparison: ${KWDs[keyword].okStr}, limit: ${schemaCode}}`
    };
    var def = {
      keyword: Object.keys(KWDs),
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        cxt.fail$data((0, codegen_1._)`${data} ${KWDs[keyword].fail} ${schemaCode} || isNaN(${data})`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/multipleOf.js
var require_multipleOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/multipleOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must be multiple of ${schemaCode}`,
      params: ({ schemaCode }) => (0, codegen_1._)`{multipleOf: ${schemaCode}}`
    };
    var def = {
      keyword: "multipleOf",
      type: "number",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, schemaCode, it } = cxt;
        const prec = it.opts.multipleOfPrecision;
        const res = gen.let("res");
        const invalid = prec ? (0, codegen_1._)`Math.abs(Math.round(${res}) - ${res}) > 1e-${prec}` : (0, codegen_1._)`${res} !== parseInt(${res})`;
        cxt.fail$data((0, codegen_1._)`(${schemaCode} === 0 || (${res} = ${data}/${schemaCode}, ${invalid}))`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/runtime/ucs2length.js
var require_ucs2length = __commonJS({
  "node_modules/ajv/dist/runtime/ucs2length.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function ucs2length(str) {
      const len = str.length;
      let length = 0;
      let pos = 0;
      let value;
      while (pos < len) {
        length++;
        value = str.charCodeAt(pos++);
        if (value >= 55296 && value <= 56319 && pos < len) {
          value = str.charCodeAt(pos);
          if ((value & 64512) === 56320)
            pos++;
        }
      }
      return length;
    }
    exports.default = ucs2length;
    ucs2length.code = 'require("ajv/dist/runtime/ucs2length").default';
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitLength.js
var require_limitLength = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitLength.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var ucs2length_1 = require_ucs2length();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxLength" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} characters`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxLength", "minLength"],
      type: "string",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode, it } = cxt;
        const op = keyword === "maxLength" ? codegen_1.operators.GT : codegen_1.operators.LT;
        const len = it.opts.unicode === false ? (0, codegen_1._)`${data}.length` : (0, codegen_1._)`${(0, util_1.useFunc)(cxt.gen, ucs2length_1.default)}(${data})`;
        cxt.fail$data((0, codegen_1._)`${len} ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/pattern.js
var require_pattern = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/pattern.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var util_1 = require_util();
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match pattern "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{pattern: ${schemaCode}}`
    };
    var def = {
      keyword: "pattern",
      type: "string",
      schemaType: "string",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const u = it.opts.unicodeRegExp ? "u" : "";
        if ($data) {
          const { regExp } = it.opts.code;
          const regExpCode = regExp.code === "new RegExp" ? (0, codegen_1._)`new RegExp` : (0, util_1.useFunc)(gen, regExp);
          const valid = gen.let("valid");
          gen.try(() => gen.assign(valid, (0, codegen_1._)`${regExpCode}(${schemaCode}, ${u}).test(${data})`), () => gen.assign(valid, false));
          cxt.fail$data((0, codegen_1._)`!${valid}`);
        } else {
          const regExp = (0, code_1.usePattern)(cxt, schema);
          cxt.fail$data((0, codegen_1._)`!${regExp}.test(${data})`);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitProperties.js
var require_limitProperties = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxProperties" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} properties`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxProperties", "minProperties"],
      type: "object",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxProperties" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`Object.keys(${data}).length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/required.js
var require_required = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/required.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { missingProperty } }) => (0, codegen_1.str)`must have required property '${missingProperty}'`,
      params: ({ params: { missingProperty } }) => (0, codegen_1._)`{missingProperty: ${missingProperty}}`
    };
    var def = {
      keyword: "required",
      type: "object",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, schema, schemaCode, data, $data, it } = cxt;
        const { opts } = it;
        if (!$data && schema.length === 0)
          return;
        const useLoop = schema.length >= opts.loopRequired;
        if (it.allErrors)
          allErrorsMode();
        else
          exitOnErrorMode();
        if (opts.strictRequired) {
          const props = cxt.parentSchema.properties;
          const { definedProperties } = cxt.it;
          for (const requiredKey of schema) {
            if ((props === null || props === void 0 ? void 0 : props[requiredKey]) === void 0 && !definedProperties.has(requiredKey)) {
              const schemaPath = it.schemaEnv.baseId + it.errSchemaPath;
              const msg = `required property "${requiredKey}" is not defined at "${schemaPath}" (strictRequired)`;
              (0, util_1.checkStrictMode)(it, msg, it.opts.strictRequired);
            }
          }
        }
        function allErrorsMode() {
          if (useLoop || $data) {
            cxt.block$data(codegen_1.nil, loopAllRequired);
          } else {
            for (const prop of schema) {
              (0, code_1.checkReportMissingProp)(cxt, prop);
            }
          }
        }
        function exitOnErrorMode() {
          const missing = gen.let("missing");
          if (useLoop || $data) {
            const valid = gen.let("valid", true);
            cxt.block$data(valid, () => loopUntilMissing(missing, valid));
            cxt.ok(valid);
          } else {
            gen.if((0, code_1.checkMissingProp)(cxt, schema, missing));
            (0, code_1.reportMissingProp)(cxt, missing);
            gen.else();
          }
        }
        function loopAllRequired() {
          gen.forOf("prop", schemaCode, (prop) => {
            cxt.setParams({ missingProperty: prop });
            gen.if((0, code_1.noPropertyInData)(gen, data, prop, opts.ownProperties), () => cxt.error());
          });
        }
        function loopUntilMissing(missing, valid) {
          cxt.setParams({ missingProperty: missing });
          gen.forOf(missing, schemaCode, () => {
            gen.assign(valid, (0, code_1.propertyInData)(gen, data, missing, opts.ownProperties));
            gen.if((0, codegen_1.not)(valid), () => {
              cxt.error();
              gen.break();
            });
          }, codegen_1.nil);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/limitItems.js
var require_limitItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/limitItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message({ keyword, schemaCode }) {
        const comp = keyword === "maxItems" ? "more" : "fewer";
        return (0, codegen_1.str)`must NOT have ${comp} than ${schemaCode} items`;
      },
      params: ({ schemaCode }) => (0, codegen_1._)`{limit: ${schemaCode}}`
    };
    var def = {
      keyword: ["maxItems", "minItems"],
      type: "array",
      schemaType: "number",
      $data: true,
      error,
      code(cxt) {
        const { keyword, data, schemaCode } = cxt;
        const op = keyword === "maxItems" ? codegen_1.operators.GT : codegen_1.operators.LT;
        cxt.fail$data((0, codegen_1._)`${data}.length ${op} ${schemaCode}`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/runtime/equal.js
var require_equal = __commonJS({
  "node_modules/ajv/dist/runtime/equal.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var equal = require_fast_deep_equal();
    equal.code = 'require("ajv/dist/runtime/equal").default';
    exports.default = equal;
  }
});

// node_modules/ajv/dist/vocabularies/validation/uniqueItems.js
var require_uniqueItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/uniqueItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dataType_1 = require_dataType();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: ({ params: { i, j } }) => (0, codegen_1.str)`must NOT have duplicate items (items ## ${j} and ${i} are identical)`,
      params: ({ params: { i, j } }) => (0, codegen_1._)`{i: ${i}, j: ${j}}`
    };
    var def = {
      keyword: "uniqueItems",
      type: "array",
      schemaType: "boolean",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, parentSchema, schemaCode, it } = cxt;
        if (!$data && !schema)
          return;
        const valid = gen.let("valid");
        const itemTypes = parentSchema.items ? (0, dataType_1.getSchemaTypes)(parentSchema.items) : [];
        cxt.block$data(valid, validateUniqueItems, (0, codegen_1._)`${schemaCode} === false`);
        cxt.ok(valid);
        function validateUniqueItems() {
          const i = gen.let("i", (0, codegen_1._)`${data}.length`);
          const j = gen.let("j");
          cxt.setParams({ i, j });
          gen.assign(valid, true);
          gen.if((0, codegen_1._)`${i} > 1`, () => (canOptimize() ? loopN : loopN2)(i, j));
        }
        function canOptimize() {
          return itemTypes.length > 0 && !itemTypes.some((t) => t === "object" || t === "array");
        }
        function loopN(i, j) {
          const item = gen.name("item");
          const wrongType = (0, dataType_1.checkDataTypes)(itemTypes, item, it.opts.strictNumbers, dataType_1.DataType.Wrong);
          const indices = gen.const("indices", (0, codegen_1._)`{}`);
          gen.for((0, codegen_1._)`;${i}--;`, () => {
            gen.let(item, (0, codegen_1._)`${data}[${i}]`);
            gen.if(wrongType, (0, codegen_1._)`continue`);
            if (itemTypes.length > 1)
              gen.if((0, codegen_1._)`typeof ${item} == "string"`, (0, codegen_1._)`${item} += "_"`);
            gen.if((0, codegen_1._)`typeof ${indices}[${item}] == "number"`, () => {
              gen.assign(j, (0, codegen_1._)`${indices}[${item}]`);
              cxt.error();
              gen.assign(valid, false).break();
            }).code((0, codegen_1._)`${indices}[${item}] = ${i}`);
          });
        }
        function loopN2(i, j) {
          const eql = (0, util_1.useFunc)(gen, equal_1.default);
          const outer = gen.name("outer");
          gen.label(outer).for((0, codegen_1._)`;${i}--;`, () => gen.for((0, codegen_1._)`${j} = ${i}; ${j}--;`, () => gen.if((0, codegen_1._)`${eql}(${data}[${i}], ${data}[${j}])`, () => {
            cxt.error();
            gen.assign(valid, false).break(outer);
          })));
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/const.js
var require_const = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/const.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to constant",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValue: ${schemaCode}}`
    };
    var def = {
      keyword: "const",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schemaCode, schema } = cxt;
        if ($data || schema && typeof schema == "object") {
          cxt.fail$data((0, codegen_1._)`!${(0, util_1.useFunc)(gen, equal_1.default)}(${data}, ${schemaCode})`);
        } else {
          cxt.fail((0, codegen_1._)`${schema} !== ${data}`);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/enum.js
var require_enum = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/enum.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var equal_1 = require_equal();
    var error = {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode }) => (0, codegen_1._)`{allowedValues: ${schemaCode}}`
    };
    var def = {
      keyword: "enum",
      schemaType: "array",
      $data: true,
      error,
      code(cxt) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        if (!$data && schema.length === 0)
          throw new Error("enum must have non-empty array");
        const useLoop = schema.length >= it.opts.loopEnum;
        let eql;
        const getEql = () => eql !== null && eql !== void 0 ? eql : eql = (0, util_1.useFunc)(gen, equal_1.default);
        let valid;
        if (useLoop || $data) {
          valid = gen.let("valid");
          cxt.block$data(valid, loopEnum);
        } else {
          if (!Array.isArray(schema))
            throw new Error("ajv implementation error");
          const vSchema = gen.const("vSchema", schemaCode);
          valid = (0, codegen_1.or)(...schema.map((_x, i) => equalCode(vSchema, i)));
        }
        cxt.pass(valid);
        function loopEnum() {
          gen.assign(valid, false);
          gen.forOf("v", schemaCode, (v) => gen.if((0, codegen_1._)`${getEql()}(${data}, ${v})`, () => gen.assign(valid, true).break()));
        }
        function equalCode(vSchema, i) {
          const sch = schema[i];
          return typeof sch === "object" && sch !== null ? (0, codegen_1._)`${getEql()}(${data}, ${vSchema}[${i}])` : (0, codegen_1._)`${data} === ${sch}`;
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/validation/index.js
var require_validation = __commonJS({
  "node_modules/ajv/dist/vocabularies/validation/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var limitNumber_1 = require_limitNumber();
    var multipleOf_1 = require_multipleOf();
    var limitLength_1 = require_limitLength();
    var pattern_1 = require_pattern();
    var limitProperties_1 = require_limitProperties();
    var required_1 = require_required();
    var limitItems_1 = require_limitItems();
    var uniqueItems_1 = require_uniqueItems();
    var const_1 = require_const();
    var enum_1 = require_enum();
    var validation = [
      // number
      limitNumber_1.default,
      multipleOf_1.default,
      // string
      limitLength_1.default,
      pattern_1.default,
      // object
      limitProperties_1.default,
      required_1.default,
      // array
      limitItems_1.default,
      uniqueItems_1.default,
      // any
      { keyword: "type", schemaType: ["string", "array"] },
      { keyword: "nullable", schemaType: "boolean" },
      const_1.default,
      enum_1.default
    ];
    exports.default = validation;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/additionalItems.js
var require_additionalItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/additionalItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateAdditionalItems = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "additionalItems",
      type: "array",
      schemaType: ["boolean", "object"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { parentSchema, it } = cxt;
        const { items } = parentSchema;
        if (!Array.isArray(items)) {
          (0, util_1.checkStrictMode)(it, '"additionalItems" is ignored when "items" is not an array of schemas');
          return;
        }
        validateAdditionalItems(cxt, items);
      }
    };
    function validateAdditionalItems(cxt, items) {
      const { gen, schema, data, keyword, it } = cxt;
      it.items = true;
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      if (schema === false) {
        cxt.setParams({ len: items.length });
        cxt.pass((0, codegen_1._)`${len} <= ${items.length}`);
      } else if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
        const valid = gen.var("valid", (0, codegen_1._)`${len} <= ${items.length}`);
        gen.if((0, codegen_1.not)(valid), () => validateItems(valid));
        cxt.ok(valid);
      }
      function validateItems(valid) {
        gen.forRange("i", items.length, len, (i) => {
          cxt.subschema({ keyword, dataProp: i, dataPropType: util_1.Type.Num }, valid);
          if (!it.allErrors)
            gen.if((0, codegen_1.not)(valid), () => gen.break());
        });
      }
    }
    exports.validateAdditionalItems = validateAdditionalItems;
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/items.js
var require_items = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/items.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateTuple = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "array", "boolean"],
      before: "uniqueItems",
      code(cxt) {
        const { schema, it } = cxt;
        if (Array.isArray(schema))
          return validateTuple(cxt, "additionalItems", schema);
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    function validateTuple(cxt, extraItems, schArr = cxt.schema) {
      const { gen, parentSchema, data, keyword, it } = cxt;
      checkStrictTuple(parentSchema);
      if (it.opts.unevaluated && schArr.length && it.items !== true) {
        it.items = util_1.mergeEvaluated.items(gen, schArr.length, it.items);
      }
      const valid = gen.name("valid");
      const len = gen.const("len", (0, codegen_1._)`${data}.length`);
      schArr.forEach((sch, i) => {
        if ((0, util_1.alwaysValidSchema)(it, sch))
          return;
        gen.if((0, codegen_1._)`${len} > ${i}`, () => cxt.subschema({
          keyword,
          schemaProp: i,
          dataProp: i
        }, valid));
        cxt.ok(valid);
      });
      function checkStrictTuple(sch) {
        const { opts, errSchemaPath } = it;
        const l = schArr.length;
        const fullTuple = l === sch.minItems && (l === sch.maxItems || sch[extraItems] === false);
        if (opts.strictTuples && !fullTuple) {
          const msg = `"${keyword}" is ${l}-tuple, but minItems or maxItems/${extraItems} are not specified or different at path "${errSchemaPath}"`;
          (0, util_1.checkStrictMode)(it, msg, opts.strictTuples);
        }
      }
    }
    exports.validateTuple = validateTuple;
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/prefixItems.js
var require_prefixItems = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/prefixItems.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var items_1 = require_items();
    var def = {
      keyword: "prefixItems",
      type: "array",
      schemaType: ["array"],
      before: "uniqueItems",
      code: (cxt) => (0, items_1.validateTuple)(cxt, "items")
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/items2020.js
var require_items2020 = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/items2020.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    var additionalItems_1 = require_additionalItems();
    var error = {
      message: ({ params: { len } }) => (0, codegen_1.str)`must NOT have more than ${len} items`,
      params: ({ params: { len } }) => (0, codegen_1._)`{limit: ${len}}`
    };
    var def = {
      keyword: "items",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      error,
      code(cxt) {
        const { schema, parentSchema, it } = cxt;
        const { prefixItems } = parentSchema;
        it.items = true;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        if (prefixItems)
          (0, additionalItems_1.validateAdditionalItems)(cxt, prefixItems);
        else
          cxt.ok((0, code_1.validateArray)(cxt));
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/contains.js
var require_contains = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/contains.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1.str)`must contain at least ${min} valid item(s)` : (0, codegen_1.str)`must contain at least ${min} and no more than ${max} valid item(s)`,
      params: ({ params: { min, max } }) => max === void 0 ? (0, codegen_1._)`{minContains: ${min}}` : (0, codegen_1._)`{minContains: ${min}, maxContains: ${max}}`
    };
    var def = {
      keyword: "contains",
      type: "array",
      schemaType: ["object", "boolean"],
      before: "uniqueItems",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        let min;
        let max;
        const { minContains, maxContains } = parentSchema;
        if (it.opts.next) {
          min = minContains === void 0 ? 1 : minContains;
          max = maxContains;
        } else {
          min = 1;
        }
        const len = gen.const("len", (0, codegen_1._)`${data}.length`);
        cxt.setParams({ min, max });
        if (max === void 0 && min === 0) {
          (0, util_1.checkStrictMode)(it, `"minContains" == 0 without "maxContains": "contains" keyword ignored`);
          return;
        }
        if (max !== void 0 && min > max) {
          (0, util_1.checkStrictMode)(it, `"minContains" > "maxContains" is always invalid`);
          cxt.fail();
          return;
        }
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          let cond = (0, codegen_1._)`${len} >= ${min}`;
          if (max !== void 0)
            cond = (0, codegen_1._)`${cond} && ${len} <= ${max}`;
          cxt.pass(cond);
          return;
        }
        it.items = true;
        const valid = gen.name("valid");
        if (max === void 0 && min === 1) {
          validateItems(valid, () => gen.if(valid, () => gen.break()));
        } else if (min === 0) {
          gen.let(valid, true);
          if (max !== void 0)
            gen.if((0, codegen_1._)`${data}.length > 0`, validateItemsWithCount);
        } else {
          gen.let(valid, false);
          validateItemsWithCount();
        }
        cxt.result(valid, () => cxt.reset());
        function validateItemsWithCount() {
          const schValid = gen.name("_valid");
          const count = gen.let("count", 0);
          validateItems(schValid, () => gen.if(schValid, () => checkLimits(count)));
        }
        function validateItems(_valid, block) {
          gen.forRange("i", 0, len, (i) => {
            cxt.subschema({
              keyword: "contains",
              dataProp: i,
              dataPropType: util_1.Type.Num,
              compositeRule: true
            }, _valid);
            block();
          });
        }
        function checkLimits(count) {
          gen.code((0, codegen_1._)`${count}++`);
          if (max === void 0) {
            gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true).break());
          } else {
            gen.if((0, codegen_1._)`${count} > ${max}`, () => gen.assign(valid, false).break());
            if (min === 1)
              gen.assign(valid, true);
            else
              gen.if((0, codegen_1._)`${count} >= ${min}`, () => gen.assign(valid, true));
          }
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/dependencies.js
var require_dependencies = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/dependencies.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validateSchemaDeps = exports.validatePropertyDeps = exports.error = void 0;
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var code_1 = require_code2();
    exports.error = {
      message: ({ params: { property, depsCount, deps } }) => {
        const property_ies = depsCount === 1 ? "property" : "properties";
        return (0, codegen_1.str)`must have ${property_ies} ${deps} when property ${property} is present`;
      },
      params: ({ params: { property, depsCount, deps, missingProperty } }) => (0, codegen_1._)`{property: ${property},
    missingProperty: ${missingProperty},
    depsCount: ${depsCount},
    deps: ${deps}}`
      // TODO change to reference
    };
    var def = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: exports.error,
      code(cxt) {
        const [propDeps, schDeps] = splitDependencies(cxt);
        validatePropertyDeps(cxt, propDeps);
        validateSchemaDeps(cxt, schDeps);
      }
    };
    function splitDependencies({ schema }) {
      const propertyDeps = {};
      const schemaDeps = {};
      for (const key in schema) {
        if (key === "__proto__")
          continue;
        const deps = Array.isArray(schema[key]) ? propertyDeps : schemaDeps;
        deps[key] = schema[key];
      }
      return [propertyDeps, schemaDeps];
    }
    function validatePropertyDeps(cxt, propertyDeps = cxt.schema) {
      const { gen, data, it } = cxt;
      if (Object.keys(propertyDeps).length === 0)
        return;
      const missing = gen.let("missing");
      for (const prop in propertyDeps) {
        const deps = propertyDeps[prop];
        if (deps.length === 0)
          continue;
        const hasProperty = (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties);
        cxt.setParams({
          property: prop,
          depsCount: deps.length,
          deps: deps.join(", ")
        });
        if (it.allErrors) {
          gen.if(hasProperty, () => {
            for (const depProp of deps) {
              (0, code_1.checkReportMissingProp)(cxt, depProp);
            }
          });
        } else {
          gen.if((0, codegen_1._)`${hasProperty} && (${(0, code_1.checkMissingProp)(cxt, deps, missing)})`);
          (0, code_1.reportMissingProp)(cxt, missing);
          gen.else();
        }
      }
    }
    exports.validatePropertyDeps = validatePropertyDeps;
    function validateSchemaDeps(cxt, schemaDeps = cxt.schema) {
      const { gen, data, keyword, it } = cxt;
      const valid = gen.name("valid");
      for (const prop in schemaDeps) {
        if ((0, util_1.alwaysValidSchema)(it, schemaDeps[prop]))
          continue;
        gen.if(
          (0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties),
          () => {
            const schCxt = cxt.subschema({ keyword, schemaProp: prop }, valid);
            cxt.mergeValidEvaluated(schCxt, valid);
          },
          () => gen.var(valid, true)
          // TODO var
        );
        cxt.ok(valid);
      }
    }
    exports.validateSchemaDeps = validateSchemaDeps;
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/propertyNames.js
var require_propertyNames = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/propertyNames.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: "property name must be valid",
      params: ({ params }) => (0, codegen_1._)`{propertyName: ${params.propertyName}}`
    };
    var def = {
      keyword: "propertyNames",
      type: "object",
      schemaType: ["object", "boolean"],
      error,
      code(cxt) {
        const { gen, schema, data, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema))
          return;
        const valid = gen.name("valid");
        gen.forIn("key", data, (key) => {
          cxt.setParams({ propertyName: key });
          cxt.subschema({
            keyword: "propertyNames",
            data: key,
            dataTypes: ["string"],
            propertyName: key,
            compositeRule: true
          }, valid);
          gen.if((0, codegen_1.not)(valid), () => {
            cxt.error(true);
            if (!it.allErrors)
              gen.break();
          });
        });
        cxt.ok(valid);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js
var require_additionalProperties = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/additionalProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var names_1 = require_names();
    var util_1 = require_util();
    var error = {
      message: "must NOT have additional properties",
      params: ({ params }) => (0, codegen_1._)`{additionalProperty: ${params.additionalProperty}}`
    };
    var def = {
      keyword: "additionalProperties",
      type: ["object"],
      schemaType: ["boolean", "object"],
      allowUndefined: true,
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, data, errsCount, it } = cxt;
        if (!errsCount)
          throw new Error("ajv implementation error");
        const { allErrors, opts } = it;
        it.props = true;
        if (opts.removeAdditional !== "all" && (0, util_1.alwaysValidSchema)(it, schema))
          return;
        const props = (0, code_1.allSchemaProperties)(parentSchema.properties);
        const patProps = (0, code_1.allSchemaProperties)(parentSchema.patternProperties);
        checkAdditionalProperties();
        cxt.ok((0, codegen_1._)`${errsCount} === ${names_1.default.errors}`);
        function checkAdditionalProperties() {
          gen.forIn("key", data, (key) => {
            if (!props.length && !patProps.length)
              additionalPropertyCode(key);
            else
              gen.if(isAdditional(key), () => additionalPropertyCode(key));
          });
        }
        function isAdditional(key) {
          let definedProp;
          if (props.length > 8) {
            const propsSchema = (0, util_1.schemaRefOrVal)(it, parentSchema.properties, "properties");
            definedProp = (0, code_1.isOwnProperty)(gen, propsSchema, key);
          } else if (props.length) {
            definedProp = (0, codegen_1.or)(...props.map((p) => (0, codegen_1._)`${key} === ${p}`));
          } else {
            definedProp = codegen_1.nil;
          }
          if (patProps.length) {
            definedProp = (0, codegen_1.or)(definedProp, ...patProps.map((p) => (0, codegen_1._)`${(0, code_1.usePattern)(cxt, p)}.test(${key})`));
          }
          return (0, codegen_1.not)(definedProp);
        }
        function deleteAdditional(key) {
          gen.code((0, codegen_1._)`delete ${data}[${key}]`);
        }
        function additionalPropertyCode(key) {
          if (opts.removeAdditional === "all" || opts.removeAdditional && schema === false) {
            deleteAdditional(key);
            return;
          }
          if (schema === false) {
            cxt.setParams({ additionalProperty: key });
            cxt.error();
            if (!allErrors)
              gen.break();
            return;
          }
          if (typeof schema == "object" && !(0, util_1.alwaysValidSchema)(it, schema)) {
            const valid = gen.name("valid");
            if (opts.removeAdditional === "failing") {
              applyAdditionalSchema(key, valid, false);
              gen.if((0, codegen_1.not)(valid), () => {
                cxt.reset();
                deleteAdditional(key);
              });
            } else {
              applyAdditionalSchema(key, valid);
              if (!allErrors)
                gen.if((0, codegen_1.not)(valid), () => gen.break());
            }
          }
        }
        function applyAdditionalSchema(key, valid, errors) {
          const subschema = {
            keyword: "additionalProperties",
            dataProp: key,
            dataPropType: util_1.Type.Str
          };
          if (errors === false) {
            Object.assign(subschema, {
              compositeRule: true,
              createErrors: false,
              allErrors: false
            });
          }
          cxt.subschema(subschema, valid);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/properties.js
var require_properties = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/properties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var validate_1 = require_validate();
    var code_1 = require_code2();
    var util_1 = require_util();
    var additionalProperties_1 = require_additionalProperties();
    var def = {
      keyword: "properties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, parentSchema, data, it } = cxt;
        if (it.opts.removeAdditional === "all" && parentSchema.additionalProperties === void 0) {
          additionalProperties_1.default.code(new validate_1.KeywordCxt(it, additionalProperties_1.default, "additionalProperties"));
        }
        const allProps = (0, code_1.allSchemaProperties)(schema);
        for (const prop of allProps) {
          it.definedProperties.add(prop);
        }
        if (it.opts.unevaluated && allProps.length && it.props !== true) {
          it.props = util_1.mergeEvaluated.props(gen, (0, util_1.toHash)(allProps), it.props);
        }
        const properties = allProps.filter((p) => !(0, util_1.alwaysValidSchema)(it, schema[p]));
        if (properties.length === 0)
          return;
        const valid = gen.name("valid");
        for (const prop of properties) {
          if (hasDefault(prop)) {
            applyPropertySchema(prop);
          } else {
            gen.if((0, code_1.propertyInData)(gen, data, prop, it.opts.ownProperties));
            applyPropertySchema(prop);
            if (!it.allErrors)
              gen.else().var(valid, true);
            gen.endIf();
          }
          cxt.it.definedProperties.add(prop);
          cxt.ok(valid);
        }
        function hasDefault(prop) {
          return it.opts.useDefaults && !it.compositeRule && schema[prop].default !== void 0;
        }
        function applyPropertySchema(prop) {
          cxt.subschema({
            keyword: "properties",
            schemaProp: prop,
            dataProp: prop
          }, valid);
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/patternProperties.js
var require_patternProperties = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/patternProperties.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var util_2 = require_util();
    var def = {
      keyword: "patternProperties",
      type: "object",
      schemaType: "object",
      code(cxt) {
        const { gen, schema, data, parentSchema, it } = cxt;
        const { opts } = it;
        const patterns = (0, code_1.allSchemaProperties)(schema);
        const alwaysValidPatterns = patterns.filter((p) => (0, util_1.alwaysValidSchema)(it, schema[p]));
        if (patterns.length === 0 || alwaysValidPatterns.length === patterns.length && (!it.opts.unevaluated || it.props === true)) {
          return;
        }
        const checkProperties = opts.strictSchema && !opts.allowMatchingProperties && parentSchema.properties;
        const valid = gen.name("valid");
        if (it.props !== true && !(it.props instanceof codegen_1.Name)) {
          it.props = (0, util_2.evaluatedPropsToName)(gen, it.props);
        }
        const { props } = it;
        validatePatternProperties();
        function validatePatternProperties() {
          for (const pat of patterns) {
            if (checkProperties)
              checkMatchingProperties(pat);
            if (it.allErrors) {
              validateProperties(pat);
            } else {
              gen.var(valid, true);
              validateProperties(pat);
              gen.if(valid);
            }
          }
        }
        function checkMatchingProperties(pat) {
          for (const prop in checkProperties) {
            if (new RegExp(pat).test(prop)) {
              (0, util_1.checkStrictMode)(it, `property ${prop} matches pattern ${pat} (use allowMatchingProperties)`);
            }
          }
        }
        function validateProperties(pat) {
          gen.forIn("key", data, (key) => {
            gen.if((0, codegen_1._)`${(0, code_1.usePattern)(cxt, pat)}.test(${key})`, () => {
              const alwaysValid = alwaysValidPatterns.includes(pat);
              if (!alwaysValid) {
                cxt.subschema({
                  keyword: "patternProperties",
                  schemaProp: pat,
                  dataProp: key,
                  dataPropType: util_2.Type.Str
                }, valid);
              }
              if (it.opts.unevaluated && props !== true) {
                gen.assign((0, codegen_1._)`${props}[${key}]`, true);
              } else if (!alwaysValid && !it.allErrors) {
                gen.if((0, codegen_1.not)(valid), () => gen.break());
              }
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/not.js
var require_not = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/not.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "not",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      code(cxt) {
        const { gen, schema, it } = cxt;
        if ((0, util_1.alwaysValidSchema)(it, schema)) {
          cxt.fail();
          return;
        }
        const valid = gen.name("valid");
        cxt.subschema({
          keyword: "not",
          compositeRule: true,
          createErrors: false,
          allErrors: false
        }, valid);
        cxt.failResult(valid, () => cxt.reset(), () => cxt.error());
      },
      error: { message: "must NOT be valid" }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/anyOf.js
var require_anyOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/anyOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var code_1 = require_code2();
    var def = {
      keyword: "anyOf",
      schemaType: "array",
      trackErrors: true,
      code: code_1.validateUnion,
      error: { message: "must match a schema in anyOf" }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/oneOf.js
var require_oneOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/oneOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: "must match exactly one schema in oneOf",
      params: ({ params }) => (0, codegen_1._)`{passingSchemas: ${params.passing}}`
    };
    var def = {
      keyword: "oneOf",
      schemaType: "array",
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, schema, parentSchema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        if (it.opts.discriminator && parentSchema.discriminator)
          return;
        const schArr = schema;
        const valid = gen.let("valid", false);
        const passing = gen.let("passing", null);
        const schValid = gen.name("_valid");
        cxt.setParams({ passing });
        gen.block(validateOneOf);
        cxt.result(valid, () => cxt.reset(), () => cxt.error(true));
        function validateOneOf() {
          schArr.forEach((sch, i) => {
            let schCxt;
            if ((0, util_1.alwaysValidSchema)(it, sch)) {
              gen.var(schValid, true);
            } else {
              schCxt = cxt.subschema({
                keyword: "oneOf",
                schemaProp: i,
                compositeRule: true
              }, schValid);
            }
            if (i > 0) {
              gen.if((0, codegen_1._)`${schValid} && ${valid}`).assign(valid, false).assign(passing, (0, codegen_1._)`[${passing}, ${i}]`).else();
            }
            gen.if(schValid, () => {
              gen.assign(valid, true);
              gen.assign(passing, i);
              if (schCxt)
                cxt.mergeEvaluated(schCxt, codegen_1.Name);
            });
          });
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/allOf.js
var require_allOf = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/allOf.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: "allOf",
      schemaType: "array",
      code(cxt) {
        const { gen, schema, it } = cxt;
        if (!Array.isArray(schema))
          throw new Error("ajv implementation error");
        const valid = gen.name("valid");
        schema.forEach((sch, i) => {
          if ((0, util_1.alwaysValidSchema)(it, sch))
            return;
          const schCxt = cxt.subschema({ keyword: "allOf", schemaProp: i }, valid);
          cxt.ok(valid);
          cxt.mergeEvaluated(schCxt);
        });
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/if.js
var require_if = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/if.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var util_1 = require_util();
    var error = {
      message: ({ params }) => (0, codegen_1.str)`must match "${params.ifClause}" schema`,
      params: ({ params }) => (0, codegen_1._)`{failingKeyword: ${params.ifClause}}`
    };
    var def = {
      keyword: "if",
      schemaType: ["object", "boolean"],
      trackErrors: true,
      error,
      code(cxt) {
        const { gen, parentSchema, it } = cxt;
        if (parentSchema.then === void 0 && parentSchema.else === void 0) {
          (0, util_1.checkStrictMode)(it, '"if" without "then" and "else" is ignored');
        }
        const hasThen = hasSchema(it, "then");
        const hasElse = hasSchema(it, "else");
        if (!hasThen && !hasElse)
          return;
        const valid = gen.let("valid", true);
        const schValid = gen.name("_valid");
        validateIf();
        cxt.reset();
        if (hasThen && hasElse) {
          const ifClause = gen.let("ifClause");
          cxt.setParams({ ifClause });
          gen.if(schValid, validateClause("then", ifClause), validateClause("else", ifClause));
        } else if (hasThen) {
          gen.if(schValid, validateClause("then"));
        } else {
          gen.if((0, codegen_1.not)(schValid), validateClause("else"));
        }
        cxt.pass(valid, () => cxt.error(true));
        function validateIf() {
          const schCxt = cxt.subschema({
            keyword: "if",
            compositeRule: true,
            createErrors: false,
            allErrors: false
          }, schValid);
          cxt.mergeEvaluated(schCxt);
        }
        function validateClause(keyword, ifClause) {
          return () => {
            const schCxt = cxt.subschema({ keyword }, schValid);
            gen.assign(valid, schValid);
            cxt.mergeValidEvaluated(schCxt, valid);
            if (ifClause)
              gen.assign(ifClause, (0, codegen_1._)`${keyword}`);
            else
              cxt.setParams({ ifClause: keyword });
          };
        }
      }
    };
    function hasSchema(it, keyword) {
      const schema = it.schema[keyword];
      return schema !== void 0 && !(0, util_1.alwaysValidSchema)(it, schema);
    }
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/thenElse.js
var require_thenElse = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/thenElse.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var util_1 = require_util();
    var def = {
      keyword: ["then", "else"],
      schemaType: ["object", "boolean"],
      code({ keyword, parentSchema, it }) {
        if (parentSchema.if === void 0)
          (0, util_1.checkStrictMode)(it, `"${keyword}" without "if" is ignored`);
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/applicator/index.js
var require_applicator = __commonJS({
  "node_modules/ajv/dist/vocabularies/applicator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var additionalItems_1 = require_additionalItems();
    var prefixItems_1 = require_prefixItems();
    var items_1 = require_items();
    var items2020_1 = require_items2020();
    var contains_1 = require_contains();
    var dependencies_1 = require_dependencies();
    var propertyNames_1 = require_propertyNames();
    var additionalProperties_1 = require_additionalProperties();
    var properties_1 = require_properties();
    var patternProperties_1 = require_patternProperties();
    var not_1 = require_not();
    var anyOf_1 = require_anyOf();
    var oneOf_1 = require_oneOf();
    var allOf_1 = require_allOf();
    var if_1 = require_if();
    var thenElse_1 = require_thenElse();
    function getApplicator(draft2020 = false) {
      const applicator = [
        // any
        not_1.default,
        anyOf_1.default,
        oneOf_1.default,
        allOf_1.default,
        if_1.default,
        thenElse_1.default,
        // object
        propertyNames_1.default,
        additionalProperties_1.default,
        dependencies_1.default,
        properties_1.default,
        patternProperties_1.default
      ];
      if (draft2020)
        applicator.push(prefixItems_1.default, items2020_1.default);
      else
        applicator.push(additionalItems_1.default, items_1.default);
      applicator.push(contains_1.default);
      return applicator;
    }
    exports.default = getApplicator;
  }
});

// node_modules/ajv/dist/vocabularies/format/format.js
var require_format = __commonJS({
  "node_modules/ajv/dist/vocabularies/format/format.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var error = {
      message: ({ schemaCode }) => (0, codegen_1.str)`must match format "${schemaCode}"`,
      params: ({ schemaCode }) => (0, codegen_1._)`{format: ${schemaCode}}`
    };
    var def = {
      keyword: "format",
      type: ["number", "string"],
      schemaType: "string",
      $data: true,
      error,
      code(cxt, ruleType) {
        const { gen, data, $data, schema, schemaCode, it } = cxt;
        const { opts, errSchemaPath, schemaEnv, self } = it;
        if (!opts.validateFormats)
          return;
        if ($data)
          validate$DataFormat();
        else
          validateFormat();
        function validate$DataFormat() {
          const fmts = gen.scopeValue("formats", {
            ref: self.formats,
            code: opts.code.formats
          });
          const fDef = gen.const("fDef", (0, codegen_1._)`${fmts}[${schemaCode}]`);
          const fType = gen.let("fType");
          const format = gen.let("format");
          gen.if((0, codegen_1._)`typeof ${fDef} == "object" && !(${fDef} instanceof RegExp)`, () => gen.assign(fType, (0, codegen_1._)`${fDef}.type || "string"`).assign(format, (0, codegen_1._)`${fDef}.validate`), () => gen.assign(fType, (0, codegen_1._)`"string"`).assign(format, fDef));
          cxt.fail$data((0, codegen_1.or)(unknownFmt(), invalidFmt()));
          function unknownFmt() {
            if (opts.strictSchema === false)
              return codegen_1.nil;
            return (0, codegen_1._)`${schemaCode} && !${format}`;
          }
          function invalidFmt() {
            const callFormat = schemaEnv.$async ? (0, codegen_1._)`(${fDef}.async ? await ${format}(${data}) : ${format}(${data}))` : (0, codegen_1._)`${format}(${data})`;
            const validData = (0, codegen_1._)`(typeof ${format} == "function" ? ${callFormat} : ${format}.test(${data}))`;
            return (0, codegen_1._)`${format} && ${format} !== true && ${fType} === ${ruleType} && !${validData}`;
          }
        }
        function validateFormat() {
          const formatDef = self.formats[schema];
          if (!formatDef) {
            unknownFormat();
            return;
          }
          if (formatDef === true)
            return;
          const [fmtType, format, fmtRef] = getFormat(formatDef);
          if (fmtType === ruleType)
            cxt.pass(validCondition());
          function unknownFormat() {
            if (opts.strictSchema === false) {
              self.logger.warn(unknownMsg());
              return;
            }
            throw new Error(unknownMsg());
            function unknownMsg() {
              return `unknown format "${schema}" ignored in schema at path "${errSchemaPath}"`;
            }
          }
          function getFormat(fmtDef) {
            const code = fmtDef instanceof RegExp ? (0, codegen_1.regexpCode)(fmtDef) : opts.code.formats ? (0, codegen_1._)`${opts.code.formats}${(0, codegen_1.getProperty)(schema)}` : void 0;
            const fmt = gen.scopeValue("formats", { key: schema, ref: fmtDef, code });
            if (typeof fmtDef == "object" && !(fmtDef instanceof RegExp)) {
              return [fmtDef.type || "string", fmtDef.validate, (0, codegen_1._)`${fmt}.validate`];
            }
            return ["string", fmtDef, fmt];
          }
          function validCondition() {
            if (typeof formatDef == "object" && !(formatDef instanceof RegExp) && formatDef.async) {
              if (!schemaEnv.$async)
                throw new Error("async format in sync schema");
              return (0, codegen_1._)`await ${fmtRef}(${data})`;
            }
            return typeof format == "function" ? (0, codegen_1._)`${fmtRef}(${data})` : (0, codegen_1._)`${fmtRef}.test(${data})`;
          }
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/vocabularies/format/index.js
var require_format2 = __commonJS({
  "node_modules/ajv/dist/vocabularies/format/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var format_1 = require_format();
    var format = [format_1.default];
    exports.default = format;
  }
});

// node_modules/ajv/dist/vocabularies/metadata.js
var require_metadata = __commonJS({
  "node_modules/ajv/dist/vocabularies/metadata.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.contentVocabulary = exports.metadataVocabulary = void 0;
    exports.metadataVocabulary = [
      "title",
      "description",
      "default",
      "deprecated",
      "readOnly",
      "writeOnly",
      "examples"
    ];
    exports.contentVocabulary = [
      "contentMediaType",
      "contentEncoding",
      "contentSchema"
    ];
  }
});

// node_modules/ajv/dist/vocabularies/draft7.js
var require_draft7 = __commonJS({
  "node_modules/ajv/dist/vocabularies/draft7.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var core_1 = require_core2();
    var validation_1 = require_validation();
    var applicator_1 = require_applicator();
    var format_1 = require_format2();
    var metadata_1 = require_metadata();
    var draft7Vocabularies = [
      core_1.default,
      validation_1.default,
      (0, applicator_1.default)(),
      format_1.default,
      metadata_1.metadataVocabulary,
      metadata_1.contentVocabulary
    ];
    exports.default = draft7Vocabularies;
  }
});

// node_modules/ajv/dist/vocabularies/discriminator/types.js
var require_types = __commonJS({
  "node_modules/ajv/dist/vocabularies/discriminator/types.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DiscrError = void 0;
    var DiscrError;
    (function(DiscrError2) {
      DiscrError2["Tag"] = "tag";
      DiscrError2["Mapping"] = "mapping";
    })(DiscrError || (exports.DiscrError = DiscrError = {}));
  }
});

// node_modules/ajv/dist/vocabularies/discriminator/index.js
var require_discriminator = __commonJS({
  "node_modules/ajv/dist/vocabularies/discriminator/index.js"(exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var codegen_1 = require_codegen();
    var types_1 = require_types();
    var compile_1 = require_compile();
    var ref_error_1 = require_ref_error();
    var util_1 = require_util();
    var error = {
      message: ({ params: { discrError, tagName } }) => discrError === types_1.DiscrError.Tag ? `tag "${tagName}" must be string` : `value of tag "${tagName}" must be in oneOf`,
      params: ({ params: { discrError, tag, tagName } }) => (0, codegen_1._)`{error: ${discrError}, tag: ${tagName}, tagValue: ${tag}}`
    };
    var def = {
      keyword: "discriminator",
      type: "object",
      schemaType: "object",
      error,
      code(cxt) {
        const { gen, data, schema, parentSchema, it } = cxt;
        const { oneOf } = parentSchema;
        if (!it.opts.discriminator) {
          throw new Error("discriminator: requires discriminator option");
        }
        const tagName = schema.propertyName;
        if (typeof tagName != "string")
          throw new Error("discriminator: requires propertyName");
        if (schema.mapping)
          throw new Error("discriminator: mapping is not supported");
        if (!oneOf)
          throw new Error("discriminator: requires oneOf keyword");
        const valid = gen.let("valid", false);
        const tag = gen.const("tag", (0, codegen_1._)`${data}${(0, codegen_1.getProperty)(tagName)}`);
        gen.if((0, codegen_1._)`typeof ${tag} == "string"`, () => validateMapping(), () => cxt.error(false, { discrError: types_1.DiscrError.Tag, tag, tagName }));
        cxt.ok(valid);
        function validateMapping() {
          const mapping = getMapping();
          gen.if(false);
          for (const tagValue in mapping) {
            gen.elseIf((0, codegen_1._)`${tag} === ${tagValue}`);
            gen.assign(valid, applyTagSchema(mapping[tagValue]));
          }
          gen.else();
          cxt.error(false, { discrError: types_1.DiscrError.Mapping, tag, tagName });
          gen.endIf();
        }
        function applyTagSchema(schemaProp) {
          const _valid = gen.name("valid");
          const schCxt = cxt.subschema({ keyword: "oneOf", schemaProp }, _valid);
          cxt.mergeEvaluated(schCxt, codegen_1.Name);
          return _valid;
        }
        function getMapping() {
          var _a;
          const oneOfMapping = {};
          const topRequired = hasRequired(parentSchema);
          let tagRequired = true;
          for (let i = 0; i < oneOf.length; i++) {
            let sch = oneOf[i];
            if ((sch === null || sch === void 0 ? void 0 : sch.$ref) && !(0, util_1.schemaHasRulesButRef)(sch, it.self.RULES)) {
              const ref = sch.$ref;
              sch = compile_1.resolveRef.call(it.self, it.schemaEnv.root, it.baseId, ref);
              if (sch instanceof compile_1.SchemaEnv)
                sch = sch.schema;
              if (sch === void 0)
                throw new ref_error_1.default(it.opts.uriResolver, it.baseId, ref);
            }
            const propSch = (_a = sch === null || sch === void 0 ? void 0 : sch.properties) === null || _a === void 0 ? void 0 : _a[tagName];
            if (typeof propSch != "object") {
              throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${tagName}"`);
            }
            tagRequired = tagRequired && (topRequired || hasRequired(sch));
            addMappings(propSch, i);
          }
          if (!tagRequired)
            throw new Error(`discriminator: "${tagName}" must be required`);
          return oneOfMapping;
          function hasRequired({ required }) {
            return Array.isArray(required) && required.includes(tagName);
          }
          function addMappings(sch, i) {
            if (sch.const) {
              addMapping(sch.const, i);
            } else if (sch.enum) {
              for (const tagValue of sch.enum) {
                addMapping(tagValue, i);
              }
            } else {
              throw new Error(`discriminator: "properties/${tagName}" must have "const" or "enum"`);
            }
          }
          function addMapping(tagValue, i) {
            if (typeof tagValue != "string" || tagValue in oneOfMapping) {
              throw new Error(`discriminator: "${tagName}" values must be unique strings`);
            }
            oneOfMapping[tagValue] = i;
          }
        }
      }
    };
    exports.default = def;
  }
});

// node_modules/ajv/dist/refs/json-schema-draft-07.json
var require_json_schema_draft_07 = __commonJS({
  "node_modules/ajv/dist/refs/json-schema-draft-07.json"(exports, module) {
    module.exports = {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: "http://json-schema.org/draft-07/schema#",
      title: "Core schema meta-schema",
      definitions: {
        schemaArray: {
          type: "array",
          minItems: 1,
          items: { $ref: "#" }
        },
        nonNegativeInteger: {
          type: "integer",
          minimum: 0
        },
        nonNegativeIntegerDefault0: {
          allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }]
        },
        simpleTypes: {
          enum: ["array", "boolean", "integer", "null", "number", "object", "string"]
        },
        stringArray: {
          type: "array",
          items: { type: "string" },
          uniqueItems: true,
          default: []
        }
      },
      type: ["object", "boolean"],
      properties: {
        $id: {
          type: "string",
          format: "uri-reference"
        },
        $schema: {
          type: "string",
          format: "uri"
        },
        $ref: {
          type: "string",
          format: "uri-reference"
        },
        $comment: {
          type: "string"
        },
        title: {
          type: "string"
        },
        description: {
          type: "string"
        },
        default: true,
        readOnly: {
          type: "boolean",
          default: false
        },
        examples: {
          type: "array",
          items: true
        },
        multipleOf: {
          type: "number",
          exclusiveMinimum: 0
        },
        maximum: {
          type: "number"
        },
        exclusiveMaximum: {
          type: "number"
        },
        minimum: {
          type: "number"
        },
        exclusiveMinimum: {
          type: "number"
        },
        maxLength: { $ref: "#/definitions/nonNegativeInteger" },
        minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        pattern: {
          type: "string",
          format: "regex"
        },
        additionalItems: { $ref: "#" },
        items: {
          anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }],
          default: true
        },
        maxItems: { $ref: "#/definitions/nonNegativeInteger" },
        minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        uniqueItems: {
          type: "boolean",
          default: false
        },
        contains: { $ref: "#" },
        maxProperties: { $ref: "#/definitions/nonNegativeInteger" },
        minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" },
        required: { $ref: "#/definitions/stringArray" },
        additionalProperties: { $ref: "#" },
        definitions: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        properties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          default: {}
        },
        patternProperties: {
          type: "object",
          additionalProperties: { $ref: "#" },
          propertyNames: { format: "regex" },
          default: {}
        },
        dependencies: {
          type: "object",
          additionalProperties: {
            anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }]
          }
        },
        propertyNames: { $ref: "#" },
        const: true,
        enum: {
          type: "array",
          items: true,
          minItems: 1,
          uniqueItems: true
        },
        type: {
          anyOf: [
            { $ref: "#/definitions/simpleTypes" },
            {
              type: "array",
              items: { $ref: "#/definitions/simpleTypes" },
              minItems: 1,
              uniqueItems: true
            }
          ]
        },
        format: { type: "string" },
        contentMediaType: { type: "string" },
        contentEncoding: { type: "string" },
        if: { $ref: "#" },
        then: { $ref: "#" },
        else: { $ref: "#" },
        allOf: { $ref: "#/definitions/schemaArray" },
        anyOf: { $ref: "#/definitions/schemaArray" },
        oneOf: { $ref: "#/definitions/schemaArray" },
        not: { $ref: "#" }
      },
      default: true
    };
  }
});

// node_modules/ajv/dist/ajv.js
var require_ajv = __commonJS({
  "node_modules/ajv/dist/ajv.js"(exports, module) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.MissingRefError = exports.ValidationError = exports.CodeGen = exports.Name = exports.nil = exports.stringify = exports.str = exports._ = exports.KeywordCxt = exports.Ajv = void 0;
    var core_1 = require_core();
    var draft7_1 = require_draft7();
    var discriminator_1 = require_discriminator();
    var draft7MetaSchema = require_json_schema_draft_07();
    var META_SUPPORT_DATA = ["/properties"];
    var META_SCHEMA_ID = "http://json-schema.org/draft-07/schema";
    var Ajv2 = class extends core_1.default {
      _addVocabularies() {
        super._addVocabularies();
        draft7_1.default.forEach((v) => this.addVocabulary(v));
        if (this.opts.discriminator)
          this.addKeyword(discriminator_1.default);
      }
      _addDefaultMetaSchema() {
        super._addDefaultMetaSchema();
        if (!this.opts.meta)
          return;
        const metaSchema = this.opts.$data ? this.$dataMetaSchema(draft7MetaSchema, META_SUPPORT_DATA) : draft7MetaSchema;
        this.addMetaSchema(metaSchema, META_SCHEMA_ID, false);
        this.refs["http://json-schema.org/schema"] = META_SCHEMA_ID;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(META_SCHEMA_ID) ? META_SCHEMA_ID : void 0);
      }
    };
    exports.Ajv = Ajv2;
    module.exports = exports = Ajv2;
    module.exports.Ajv = Ajv2;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Ajv2;
    var validate_1 = require_validate();
    Object.defineProperty(exports, "KeywordCxt", { enumerable: true, get: function() {
      return validate_1.KeywordCxt;
    } });
    var codegen_1 = require_codegen();
    Object.defineProperty(exports, "_", { enumerable: true, get: function() {
      return codegen_1._;
    } });
    Object.defineProperty(exports, "str", { enumerable: true, get: function() {
      return codegen_1.str;
    } });
    Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
      return codegen_1.stringify;
    } });
    Object.defineProperty(exports, "nil", { enumerable: true, get: function() {
      return codegen_1.nil;
    } });
    Object.defineProperty(exports, "Name", { enumerable: true, get: function() {
      return codegen_1.Name;
    } });
    Object.defineProperty(exports, "CodeGen", { enumerable: true, get: function() {
      return codegen_1.CodeGen;
    } });
    var validation_error_1 = require_validation_error();
    Object.defineProperty(exports, "ValidationError", { enumerable: true, get: function() {
      return validation_error_1.default;
    } });
    var ref_error_1 = require_ref_error();
    Object.defineProperty(exports, "MissingRefError", { enumerable: true, get: function() {
      return ref_error_1.default;
    } });
  }
});

// src/sdk/model.ts
var import_ajv = __toESM(require_ajv(), 1);
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
  const path = error.instancePath || "/";
  let message = error.message ?? "is invalid";
  if (error.keyword === "required" && typeof error.params?.missingProperty === "string") {
    message = `missing required property "${error.params.missingProperty}"`;
  } else if (error.keyword === "additionalProperties" && typeof error.params?.additionalProperty === "string") {
    message = `unsupported property "${error.params.additionalProperty}"`;
  } else if (error.keyword === "type" && error.params?.type !== void 0) {
    message = `expected ${String(error.params.type)}`;
  } else if (error.keyword === "enum" && Array.isArray(error.params?.allowedValues)) {
    message = `must be one of ${error.params.allowedValues.map((value) => JSON.stringify(value)).join(", ")}`;
  } else if (error.keyword === "const" && error.params?.allowedValue !== void 0) {
    message = `must equal ${JSON.stringify(error.params.allowedValue)}`;
  }
  return `${path}: ${message} [${error.keyword}; schemaPath=${error.schemaPath}]`;
}
function formatErrors(errors) {
  if (!errors?.length) return "unknown schema validation error";
  return errors.slice(0, 8).map(formatError).join("; ");
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
  return `${context} does not match the loaded Stripo editor schema.`;
}
var stripoEmailValidator;
function setEmailSchema(schema) {
  stripoEmailValidator = void 0;
  if (!isObject(schema) || Object.keys(schema).length === 0) {
    throw new Error("The email schema must be a nonempty JSON object.");
  }
  stripoEmailValidator = new import_ajv.Ajv({ allErrors: true, strict: false }).compile(schema);
}
function getStripoEmailValidator() {
  if (!stripoEmailValidator) {
    throw new Error("Load the downloaded schema with setEmailSchema before using the email SDK.");
  }
  return stripoEmailValidator;
}
function assertValidTemplate(value, context, validate, details) {
  if (validate(value)) return;
  throw new EmailSdkSchemaError(context, validate.errors, details);
}
function assertValidEmailModel(value) {
  assertValidTemplate(value, "Initial JSON", getStripoEmailValidator());
}
function findElementById(value, id) {
  const stack = [
    { value }
  ];
  while (stack.length > 0) {
    const current = stack.pop();
    if (!current) continue;
    if (isObject(current.value)) {
      if (current.value.id === id) {
        return {
          element: current.value,
          parentArray: current.parentArray,
          index: current.index,
          parentKey: current.parentKey
        };
      }
      for (const [key, child] of Object.entries(current.value)) {
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
  errors;
  context;
  details;
  constructor(context, errors, details) {
    const stableErrors = errors?.map((error) => ({
      ...error,
      params: isObject(error.params) ? { ...error.params } : error.params
    }));
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
  validate = getStripoEmailValidator();
  draft;
  idFactory;
  // Most recent clone produced from each source id during this session. cloneElement
  // uses it to keep a run of clones from the same source in command order (see the
  // long comment in cloneElement for the bug this prevents).
  lastCloneBySource = /* @__PURE__ */ new Map();
  // Same idea for insertNode: most recent node inserted at each anchor id, so a run
  // of inserts at one anchor keeps command order instead of reversing.
  lastInsertByAnchor = /* @__PURE__ */ new Map();
  // The draft is always validated against the loaded Stripo editor schema.
  // `idFactory` supplies ids for cloned descendants that were not remapped via
  // nestedIds (the Email SDK injects a deterministic factory; the default keeps
  // the historical random behaviour).
  constructor(templateJson, idFactory = randomUUID) {
    assertValidTemplate(templateJson, "Initial JSON", this.validate);
    this.draft = deepClone(templateJson);
    this.idFactory = idFactory;
  }
  beginTransaction() {
    return {
      draft: deepClone(this.draft),
      lastCloneBySource: new Map(this.lastCloneBySource),
      lastInsertByAnchor: new Map(this.lastInsertByAnchor)
    };
  }
  rollback(transaction) {
    for (const key of Object.keys(this.draft)) {
      delete this.draft[key];
    }
    Object.assign(this.draft, deepClone(transaction.draft));
    this.lastCloneBySource.clear();
    for (const [key, value] of transaction.lastCloneBySource) this.lastCloneBySource.set(key, value);
    this.lastInsertByAnchor.clear();
    for (const [key, value] of transaction.lastInsertByAnchor) this.lastInsertByAnchor.set(key, value);
    return this;
  }
  validateDraft(context, details) {
    assertValidTemplate(this.draft, context, this.validate, details);
    return this;
  }
  // Read-only companion to setContent: the element's `content` when it is a
  // string (the only case the format transplant in the Email SDK needs).
  getContent(id) {
    const location = findElementById(this.draft, id);
    const content = location?.element.content;
    return typeof content === "string" ? content : void 0;
  }
  setContent(id, property, value) {
    const location = findElementById(this.draft, id);
    if (!location) throw new EditorJsonMutationError(`Element with id "${id}" was not found.`);
    if (!setKnownContentProperty(location.element, property, value)) {
      throw new EditorJsonMutationError(`Property "${property}" was not found on element "${id}".`);
    }
    return this;
  }
  setElementProperty(id, property, value) {
    const location = findElementById(this.draft, id);
    if (!location) throw new EditorJsonMutationError(`Element with id "${id}" was not found.`);
    location.element[property] = deepClone(value);
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
    const location = findElementById(this.draft, id);
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
    const anchor = previousCloneId === void 0 ? void 0 : findElementById(this.draft, previousCloneId);
    if (anchor?.parentArray !== void 0 && anchor.index !== void 0) {
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
    const location = findElementById(this.draft, anchorId);
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
    const previousAnchor = previousInsertId === void 0 ? void 0 : findElementById(this.draft, previousInsertId);
    if (previousAnchor?.parentArray !== void 0 && previousAnchor.index !== void 0) {
      previousAnchor.parentArray.splice(previousAnchor.index + 1, 0, clone);
    } else {
      location.parentArray.splice(location.index + (isBefore ? 0 : 1), 0, clone);
    }
    if (!isBefore && typeof clone.id === "string") this.lastInsertByAnchor.set(anchorId, clone.id);
    return this;
  }
  deleteElement(id) {
    const location = findElementById(this.draft, id);
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
    const location = findElementById(this.draft, id);
    if (location?.parentArray && location.index !== void 0) {
      location.parentArray.splice(location.index, 1);
    }
    return this;
  }
  hasElement(id) {
    return findElementById(this.draft, id) !== void 0;
  }
  // Ids of the element and all its descendants, in document order. Recursive walk
  // (unlike the stack-based findElementById) because callers rely on the order.
  collectSubtreeIds(id) {
    const location = findElementById(this.draft, id);
    if (!location) throw new EditorJsonMutationError(`Element with id "${id}" was not found.`);
    const ids = [];
    const visit = (value) => {
      if (Array.isArray(value)) {
        for (const item of value) visit(item);
        return;
      }
      if (!isObject(value)) return;
      if (typeof value.id === "string") ids.push(value.id);
      for (const child of Object.values(value)) {
        if (isObject(child) || Array.isArray(child)) visit(child);
      }
    };
    visit(location.element);
    return ids;
  }
  describeElement(id) {
    const location = findElementById(this.draft, id);
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
  apply() {
    assertValidTemplate(this.draft, "Final JSON", this.validate);
    return deepClone(this.draft);
  }
  snapshot() {
    return deepClone(this.draft);
  }
};

// src/sdk/value-editor.ts
function createEmailValueEditor(email) {
  const wrappers = /* @__PURE__ */ new WeakMap();
  const structuralMethods = /* @__PURE__ */ new Set(["insert", "remove", "repeat", "slot"]);
  function wrap(value) {
    if (typeof value === "function") {
      const method = (...args) => wrap(Reflect.apply(value, void 0, args));
      Object.setPrototypeOf(method, null);
      return Object.freeze(method);
    }
    if (value === null || typeof value !== "object") return value;
    if (wrappers.has(value)) return wrappers.get(value);
    if (Array.isArray(value)) return Object.freeze(value.map(wrap));
    const handle = /* @__PURE__ */ Object.create(null);
    wrappers.set(value, handle);
    for (const [key, member] of Object.entries(value)) {
      if (!structuralMethods.has(key)) handle[key] = wrap(member);
    }
    return Object.freeze(handle);
  }
  return wrap(email);
}

// src/sdk/errors.ts
var EmailSdkError = class extends Error {
  constructor(message) {
    super(message);
    this.name = "EmailSdkError";
  }
};

// src/sdk/model-utils.ts
function isObject2(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function describeNodeKind(value) {
  if (!isObject2(value)) return void 0;
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
  if (!isObject2(value)) return ids;
  if (typeof value.id === "string") ids.push(value.id);
  for (const child of Object.values(value)) collectNodeIds(child, ids);
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
    } else if (isObject2(current)) {
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
  if (Array.isArray(value)) {
    for (const item of value) collectAllIds(item, ids);
    return ids;
  }
  if (!isObject2(value)) return ids;
  if (typeof value.id === "string") ids.push(value.id);
  for (const child of Object.values(value)) collectAllIds(child, ids);
  return ids;
}
function setNested(root, path, value) {
  let current = root;
  for (const segment of path.slice(0, -1)) {
    if (!isObject2(current[segment])) current[segment] = {};
    current = current[segment];
  }
  current[path[path.length - 1]] = cloneJson(value);
  return root;
}
function readNested(root, path) {
  let current = root;
  for (const segment of path) {
    if (!isObject2(current)) return void 0;
    current = current[segment];
  }
  return current;
}
function rejectNullLeaves(value, path) {
  if (value === null) {
    throw new EmailSdkError(`Theme value may not be null at ${path}.`);
  }
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      rejectNullLeaves(value[index], `${path}.${index}`);
    }
    return;
  }
  if (isObject2(value)) {
    for (const [key, nestedValue] of Object.entries(value)) {
      rejectNullLeaves(nestedValue, `${path}.${key}`);
    }
  }
}

// src/sdk/selectors.ts
var LIST_KEY_KIND = {
  stripes: "stripe",
  structures: "structure",
  columns: "column",
  containers: "container",
  blocks: "block"
};
function collectNodeIndex(value) {
  const entries = [];
  const hideElementValue = (current) => {
    if (!isObject2(current.settings)) return void 0;
    const value2 = current.settings.hideElement;
    return value2 === "no" || value2 === "mobile" || value2 === "desktop" ? value2 : void 0;
  };
  const visibilityFor = (hiddenOn) => {
    if (hiddenOn.has("desktop") && hiddenOn.has("mobile")) return "neither";
    if (hiddenOn.has("desktop")) return "mobile-only";
    if (hiddenOn.has("mobile")) return "desktop-only";
    return "both";
  };
  const visit = (current, kindFromParent, parentChain, messageArea, inheritedModuleId, inheritedHiddenOn) => {
    if (Array.isArray(current)) {
      for (const item of current) {
        visit(item, kindFromParent, parentChain, messageArea, inheritedModuleId, inheritedHiddenOn);
      }
      return;
    }
    if (!isObject2(current)) return;
    const ownKind = describeNodeKind(current) ?? kindFromParent;
    const ownId = typeof current.id === "string" ? current.id : void 0;
    const settingsArea = isObject2(current.settings) && typeof current.settings.messageArea === "string" ? current.settings.messageArea : void 0;
    const ownArea = typeof current.messageArea === "string" ? current.messageArea : settingsArea ?? messageArea;
    const moduleValue = current.moduleId;
    const ownModuleId = typeof moduleValue === "string" || typeof moduleValue === "number" ? moduleValue : inheritedModuleId;
    const ownHideElement = hideElementValue(current);
    const hiddenOn = new Set(inheritedHiddenOn);
    if (ownHideElement === "desktop") hiddenOn.add("desktop");
    if (ownHideElement === "mobile") hiddenOn.add("mobile");
    if (ownId !== void 0 && ownKind !== void 0) {
      entries.push({
        id: ownId,
        kind: ownKind,
        blockType: typeof current.type === "string" ? current.type : void 0,
        messageArea: ownArea,
        ownHideElement,
        effectiveVisibility: visibilityFor(hiddenOn),
        moduleId: ownModuleId,
        parentChain,
        element: current
      });
    }
    const nextParentChain = ownId === void 0 || ownKind === "block" ? parentChain : [...parentChain, ownId];
    for (const [key, child] of Object.entries(current)) {
      const childKind = LIST_KEY_KIND[key];
      if (childKind !== void 0) {
        visit(child, childKind, nextParentChain, ownArea, ownModuleId, hiddenOn);
      } else if (isObject2(child) || Array.isArray(child)) {
        visit(child, void 0, nextParentChain, ownArea, ownModuleId, hiddenOn);
      }
    }
  };
  visit(value, void 0, [], void 0, void 0, /* @__PURE__ */ new Set());
  return entries;
}
function hasLink(element, blockType) {
  const settings = isObject2(element.settings) ? element.settings : {};
  if (blockType === "text" && typeof element.content === "string") {
    return /<a\b[^>]*href=/iu.test(element.content);
  }
  if (blockType === "button") {
    const link = settings.link;
    return isObject2(link) && (typeof link.value === "string" || typeof link.href === "string");
  }
  if (blockType === "image") {
    const link = settings.link;
    return isObject2(link) && typeof link.href === "string" && link.href.length > 0;
  }
  if (blockType === "social" && Array.isArray(settings.networks)) {
    return settings.networks.some(
      (network) => isObject2(network) && isObject2(network.link) && typeof network.link.href === "string" && network.link.href.length > 0
    );
  }
  return false;
}
function linkHostContains(element, blockType, needle) {
  const lowerNeedle = needle.toLowerCase();
  const settings = isObject2(element.settings) ? element.settings : {};
  const urls = [];
  if (blockType === "text" && typeof element.content === "string") {
    for (const match of element.content.matchAll(/<a\b[^>]*href=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/giu)) {
      urls.push(match[1] ?? match[2] ?? match[3] ?? "");
    }
  } else if (blockType === "button" && isObject2(settings.link)) {
    if (typeof settings.link.value === "string") urls.push(settings.link.value);
    if (typeof settings.link.href === "string") urls.push(settings.link.href);
  } else if (blockType === "image" && isObject2(settings.link) && typeof settings.link.href === "string") {
    urls.push(settings.link.href);
  } else if (blockType === "social" && Array.isArray(settings.networks)) {
    for (const network of settings.networks) {
      if (isObject2(network) && isObject2(network.link) && typeof network.link.href === "string") {
        urls.push(network.link.href);
      }
    }
  }
  return urls.some((url) => url.toLowerCase().includes(lowerNeedle));
}

// src/sdk/content-mutations.ts
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

// src/sdk/styles.ts
var NAMED_COLORS = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#FF0000",
  green: "#008000",
  blue: "#0000FF",
  yellow: "#FFFF00",
  orange: "#FFA500",
  purple: "#800080",
  gray: "#808080",
  grey: "#808080",
  pink: "#FFC0CB",
  brown: "#A52A2A",
  cyan: "#00FFFF",
  magenta: "#FF00FF",
  silver: "#C0C0C0",
  gold: "#FFD700",
  navy: "#000080",
  teal: "#008080",
  lime: "#00FF00",
  maroon: "#800000",
  olive: "#808000"
};
var HEX_COLOR = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/u;
var RGB_COLOR = /^rgba?\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*(?:,\s*(?:\d*\.?\d+)\s*)?\)$/u;
function normalizeColor(value, allowTransparent) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new EmailSdkError("Color must be a non-empty string.");
  }
  const raw = value.trim();
  const lower = raw.toLowerCase();
  if (lower === "transparent") {
    if (!allowTransparent) throw new EmailSdkError("Transparent is not allowed for this color field.");
    return "transparent";
  }
  if (HEX_COLOR.test(raw) || RGB_COLOR.test(lower)) return raw;
  const named = NAMED_COLORS[lower];
  if (named !== void 0) return named;
  throw new EmailSdkError(`Unsupported color "${value}". Use hex, rgb(), rgba(), or a common named color.`);
}
var SIDES = ["top", "right", "bottom", "left"];
var CORNERS = ["topLeft", "topRight", "bottomRight", "bottomLeft"];
var BREAKPOINTS = ["desktop", "mobile"];
var NODE_STYLE_SPECS = {
  button: {
    backgroundColor: { property: "backgroundColor", path: ["backgroundColor"], shape: "color" },
    fontColor: { property: "fontColor", path: ["fontColor"], shape: "colorNoTransparent" },
    fontSize: { property: "fontSize", path: ["fontSize"], shape: "sizeResponsive" },
    fontFamily: { property: "fontFamily", path: ["fontFamily"], shape: "fontFamily" },
    bold: { property: "bold", path: ["textStyle", "bold"], shape: "textStyle" },
    italic: { property: "italic", path: ["textStyle", "italic"], shape: "textStyle" },
    textAlign: { property: "textAlign", path: ["alignment"], shape: "alignResponsive" },
    padding: { property: "padding", path: ["padding"], shape: "paddingResponsive" },
    margin: { property: "margin", path: ["margins"], shape: "marginsResponsive" },
    border: { property: "border", path: ["border"], shape: "border" },
    borderRadius: { property: "borderRadius", path: ["borderRadius"], shape: "radiusCorner" }
  },
  image: {
    textAlign: { property: "textAlign", path: ["alignment"], shape: "alignResponsive" },
    margin: { property: "margin", path: ["margins"], shape: "marginsResponsive" },
    borderRadius: { property: "borderRadius", path: ["radius"], shape: "radiusResponsiveCorner" }
  },
  social: {
    backgroundColor: { property: "backgroundColor", path: ["backgroundColor"], shape: "color" },
    textAlign: { property: "textAlign", path: ["alignment"], shape: "alignResponsive" },
    margin: { property: "margin", path: ["margins"], shape: "marginsResponsive" }
  },
  text: {
    fontColor: { property: "fontColor", path: ["fontColor"], shape: "colorNoTransparent" },
    textAlign: { property: "textAlign", path: ["alignment"], shape: "textAlignResponsive" }
  },
  container: {
    backgroundColor: { property: "backgroundColor", path: ["backgroundColor"], shape: "color" },
    padding: { property: "padding", path: ["padding"], shape: "paddingResponsive" },
    border: { property: "border", path: ["border"], shape: "border" },
    borderRadius: { property: "borderRadius", path: ["radius"], shape: "radiusCorner" }
  },
  structure: {
    backgroundColor: { property: "backgroundColor", path: ["backgroundColor"], shape: "color" },
    padding: { property: "padding", path: ["padding"], shape: "paddingResponsive" },
    margin: { property: "margin", path: ["margins"], shape: "marginsResponsive" },
    border: { property: "border", path: ["border"], shape: "border" },
    borderRadius: { property: "borderRadius", path: ["borderRadius"], shape: "radiusCorner" }
  },
  stripe: {
    padding: { property: "padding", path: ["padding"], shape: "paddingMobileOnly" },
    border: { property: "border", path: ["contentBorder"], shape: "border" }
  }
};
var THEME_STYLE_SPECS = {
  lineHeight: {
    shape: "lineHeight",
    path: () => ["settings", "stripes", "lineHeight"]
  },
  fontSize: {
    shape: "sizeResponsive",
    path: (options) => ["settings", "stripes", normalizeStyleArea(options.area), "fontSize"]
  },
  fontFamily: {
    shape: "fontFamily",
    path: () => ["settings", "stripes", "fontFamily"]
  },
  linkColor: {
    shape: "colorNoTransparent",
    path: (options) => ["settings", "stripes", normalizeStyleArea(options.area), "linkColor"]
  },
  fontColor: {
    shape: "colorNoTransparent",
    path: (options) => ["settings", "stripes", normalizeStyleArea(options.area), "fontColor"]
  },
  backgroundColor: {
    shape: "color",
    path: (options) => [
      "settings",
      "stripes",
      normalizeStyleArea(options.area),
      normalizeBackgroundTarget(options.backgroundTarget) === "stripe" ? "stripeBackgroundColor" : "contentBackgroundColor"
    ]
  }
};
function normalizeStyleArea(area) {
  if (area === void 0) return "content";
  if (typeof area !== "string" || area.trim() === "") {
    throw new EmailSdkError("Style area must be a non-empty string.");
  }
  return area;
}
function normalizeBreakpoint(breakpoint) {
  if (breakpoint === void 0) return "both";
  if (breakpoint === "desktop" || breakpoint === "mobile" || breakpoint === "both") return breakpoint;
  throw new EmailSdkError(`Style breakpoint must be desktop, mobile, or both; got "${String(breakpoint)}".`);
}
function normalizeBackgroundTarget(target) {
  if (target === void 0) return "content";
  if (target === "content" || target === "stripe") return target;
  throw new EmailSdkError(`backgroundTarget must be content or stripe; got "${String(target)}".`);
}
function checkUnusedStyleOptions(property, options) {
  if (options.backgroundTarget !== void 0 && property !== "backgroundColor") {
    throw new EmailSdkError("backgroundTarget applies only to backgroundColor.");
  }
  normalizeBreakpoint(options.breakpoint);
  if (options.area !== void 0) normalizeStyleArea(options.area);
  if (options.backgroundTarget !== void 0) normalizeBackgroundTarget(options.backgroundTarget);
}
function selectorKeyForEntry(kind, blockType) {
  return kind === "block" ? blockType : kind;
}
function addressableStyleProperties(selectorKey) {
  if (selectorKey === void 0) return [];
  const spec = NODE_STYLE_SPECS[selectorKey];
  if (spec === void 0) return [];
  return [...new Set(Object.values(spec).map((entry) => entry.property))].sort();
}
function nodeStyleSpec(kind, blockType, property, options) {
  if (options.area !== void 0) {
    throw new EmailSdkError("Style area applies only to document-level theme styles.");
  }
  checkUnusedStyleOptions(property, options);
  const selectorKey = selectorKeyForEntry(kind, blockType);
  if (selectorKey === "stripe" && property === "backgroundColor") {
    return {
      property,
      path: [normalizeBackgroundTarget(options.backgroundTarget) === "stripe" ? "stripeBackgroundColor" : "contentBackgroundColor"],
      shape: "color"
    };
  }
  const spec = selectorKey === void 0 ? void 0 : NODE_STYLE_SPECS[selectorKey]?.[property];
  if (spec !== void 0) return spec;
  const valid = addressableStyleProperties(selectorKey);
  const suffix = valid.length > 0 ? ` Valid properties: ${valid.join(", ")}.` : "";
  throw new EmailSdkError(
    `Style property "${property}" is not supported on ${kind ?? "element"}${blockType ? ` type="${blockType}"` : ""}.${suffix}`
  );
}
function themeStyleSpec(property, options) {
  checkUnusedStyleOptions(property, options);
  const spec = THEME_STYLE_SPECS[property];
  if (spec === void 0) {
    throw new EmailSdkError(
      `Style property "${property}" has no document-level theme target. Valid theme properties: ${Object.keys(THEME_STYLE_SPECS).sort().join(", ")}.`
    );
  }
  return { path: spec.path(options), shape: spec.shape };
}
function assertNumber(value, lo, hi, label) {
  if (typeof value !== "number" || Number.isNaN(value) || typeof value === "boolean") {
    throw new EmailSdkError(`${label} must be a number.`);
  }
  if (value < lo || value > hi) {
    throw new EmailSdkError(`${label} must be between ${lo} and ${hi}.`);
  }
  return value;
}
function resolveBreakpoints(breakpoint) {
  if (breakpoint === "both") return [...BREAKPOINTS];
  return [breakpoint];
}
function buildResponsiveScalar(value, existing, breakpoint, lo, hi, label) {
  const base = isObject2(existing) ? cloneJson(existing) : {};
  if (isObject2(value)) {
    const extras = Object.keys(value).filter((key) => !BREAKPOINTS.includes(key));
    if (extras.length > 0) throw new EmailSdkError(`${label} rejects keys: ${extras.join(", ")}.`);
    if (Object.keys(value).length === 0) throw new EmailSdkError(`${label} object may not be empty.`);
    for (const breakpointKey of BREAKPOINTS) {
      if (Object.hasOwn(value, breakpointKey)) {
        base[breakpointKey] = assertNumber(value[breakpointKey], lo, hi, `${label}.${breakpointKey}`);
      }
    }
  } else {
    const next = assertNumber(value, lo, hi, label);
    for (const breakpointKey of resolveBreakpoints(breakpoint)) base[breakpointKey] = next;
  }
  for (const breakpointKey of BREAKPOINTS) {
    if (base[breakpointKey] === void 0) {
      const present = BREAKPOINTS.map((key) => base[key]).find((candidate) => candidate !== void 0);
      base[breakpointKey] = present ?? lo;
    }
  }
  return base;
}
function buildAlignment(value, existing, breakpoint, allowJustify = false) {
  const allowed = allowJustify ? ["left", "center", "right", "justify"] : ["left", "center", "right"];
  const valid = new Set(allowed);
  const base = isObject2(existing) ? cloneJson(existing) : {};
  const check = (candidate, label) => {
    if (typeof candidate !== "string" || !valid.has(candidate)) {
      throw new EmailSdkError(`${label} must be ${allowed.join(", ")}.`);
    }
    return candidate;
  };
  if (isObject2(value)) {
    const extras = Object.keys(value).filter((key) => !BREAKPOINTS.includes(key));
    if (extras.length > 0) throw new EmailSdkError(`textAlign rejects keys: ${extras.join(", ")}.`);
    if (Object.keys(value).length === 0) throw new EmailSdkError("textAlign object may not be empty.");
    for (const breakpointKey of BREAKPOINTS) {
      if (Object.hasOwn(value, breakpointKey)) base[breakpointKey] = check(value[breakpointKey], `textAlign.${breakpointKey}`);
    }
  } else {
    const next = check(value, "textAlign");
    for (const breakpointKey of resolveBreakpoints(breakpoint)) base[breakpointKey] = next;
  }
  for (const breakpointKey of BREAKPOINTS) {
    if (base[breakpointKey] === void 0) {
      const present = BREAKPOINTS.map((key) => base[key]).find((candidate) => candidate !== void 0);
      base[breakpointKey] = present ?? "left";
    }
  }
  return base;
}
function buildSides(value, existing) {
  const base = {};
  if (isObject2(existing)) {
    for (const side of SIDES) {
      if (typeof existing[side] === "number") base[side] = existing[side];
    }
  }
  if (isObject2(value)) {
    const extras = Object.keys(value).filter((key) => !SIDES.includes(key));
    if (extras.length > 0) throw new EmailSdkError(`Side object rejects keys: ${extras.join(", ")}.`);
    if (Object.keys(value).length === 0) throw new EmailSdkError("Side object may not be empty.");
    for (const side of SIDES) {
      if (Object.hasOwn(value, side)) base[side] = assertNumber(value[side], -1e6, 1e6, `side.${side}`);
    }
  } else {
    const next = assertNumber(value, -1e6, 1e6, "spacing");
    for (const side of SIDES) base[side] = next;
  }
  for (const side of SIDES) {
    base[side] ??= 0;
  }
  return base;
}
function buildResponsiveSides(value, existing, breakpoint, allowedBreakpoints, label) {
  const base = isObject2(existing) ? cloneJson(existing) : {};
  if (isObject2(value) && BREAKPOINTS.some((key) => Object.hasOwn(value, key))) {
    const extras = Object.keys(value).filter((key) => !BREAKPOINTS.includes(key));
    if (extras.length > 0) throw new EmailSdkError(`${label} rejects keys: ${extras.join(", ")}.`);
    for (const breakpointKey of BREAKPOINTS) {
      if (!Object.hasOwn(value, breakpointKey)) continue;
      if (!allowedBreakpoints.includes(breakpointKey)) {
        throw new EmailSdkError(`${label} does not support ${breakpointKey} breakpoint.`);
      }
      base[breakpointKey] = buildSides(value[breakpointKey], base[breakpointKey]);
    }
  } else {
    const targetBreakpoints = breakpoint === "both" ? allowedBreakpoints : allowedBreakpoints.includes(breakpoint) ? [breakpoint] : [];
    if (targetBreakpoints.length === 0) throw new EmailSdkError(`${label} does not support ${breakpoint} breakpoint.`);
    for (const breakpointKey of targetBreakpoints) base[breakpointKey] = buildSides(value, base[breakpointKey]);
  }
  for (const breakpointKey of allowedBreakpoints) {
    if (base[breakpointKey] === void 0) {
      const present = allowedBreakpoints.map((key) => base[key]).find((candidate) => candidate !== void 0);
      base[breakpointKey] = present === void 0 ? buildSides(0, void 0) : cloneJson(present);
    }
  }
  for (const breakpointKey of BREAKPOINTS) {
    if (!allowedBreakpoints.includes(breakpointKey)) delete base[breakpointKey];
  }
  return base;
}
function buildBorder(value, existing) {
  if (!isObject2(value)) {
    throw new EmailSdkError("border must be an object.");
  }
  const validStyles = /* @__PURE__ */ new Set(["solid", "dashed", "dotted"]);
  const base = isObject2(existing) ? cloneJson(existing) : {};
  const extras = Object.keys(value).filter((key) => !SIDES.includes(key) && !["width", "color", "style"].includes(key));
  if (extras.length > 0) throw new EmailSdkError(`border rejects keys: ${extras.join(", ")}.`);
  const sideDefault = () => ({ width: 0, color: "transparent" });
  const buildSide = (src, current) => {
    if (src !== void 0 && !isObject2(src)) throw new EmailSdkError("border side must be an object.");
    const side = isObject2(current) ? cloneJson(current) : sideDefault();
    if (isObject2(src)) {
      const sideExtras = Object.keys(src).filter((key) => !["width", "color"].includes(key));
      if (sideExtras.length > 0) throw new EmailSdkError(`border side rejects keys: ${sideExtras.join(", ")}.`);
      if (Object.hasOwn(src, "width")) side.width = assertNumber(src.width, 0, 100, "border.width");
      if (Object.hasOwn(src, "color")) side.color = normalizeColor(src.color, true);
    }
    side.width ??= 0;
    side.color ??= "transparent";
    return side;
  };
  if (Object.hasOwn(value, "style")) {
    if (typeof value.style !== "string" || !validStyles.has(value.style)) {
      throw new EmailSdkError("border.style must be solid, dashed, or dotted.");
    }
    base.style = value.style;
  }
  const hasSugar = Object.hasOwn(value, "width") || Object.hasOwn(value, "color");
  const hasPerSide = SIDES.some((side) => Object.hasOwn(value, side));
  if (hasSugar && hasPerSide) {
    throw new EmailSdkError("border accepts either width/color shorthand or per-side values, not both.");
  }
  if (hasSugar) {
    const sideValue = {};
    if (Object.hasOwn(value, "width")) sideValue.width = value.width;
    if (Object.hasOwn(value, "color")) sideValue.color = value.color;
    for (const side of SIDES) base[side] = buildSide(sideValue, base[side]);
  } else if (hasPerSide) {
    for (const side of SIDES) {
      if (Object.hasOwn(value, side)) base[side] = buildSide(value[side], base[side]);
    }
  }
  for (const side of SIDES) {
    if (!isObject2(base[side])) base[side] = sideDefault();
  }
  base.style ??= "solid";
  return base;
}
function buildCorner(value, existing) {
  const base = isObject2(existing) ? cloneJson(existing) : {};
  if (isObject2(value)) {
    const extras = Object.keys(value).filter((key) => !CORNERS.includes(key));
    if (extras.length > 0) throw new EmailSdkError(`borderRadius rejects keys: ${extras.join(", ")}.`);
    if (Object.keys(value).length === 0) throw new EmailSdkError("borderRadius object may not be empty.");
    for (const corner of CORNERS) {
      if (Object.hasOwn(value, corner)) base[corner] = assertNumber(value[corner], 0, 1e3, `borderRadius.${corner}`);
    }
  } else {
    const next = assertNumber(value, 0, 1e3, "borderRadius");
    for (const corner of CORNERS) base[corner] = next;
  }
  for (const corner of CORNERS) {
    base[corner] ??= 0;
  }
  return base;
}
function buildResponsiveCorner(value, existing, breakpoint) {
  const base = isObject2(existing) ? cloneJson(existing) : {};
  if (isObject2(value) && BREAKPOINTS.some((key) => Object.hasOwn(value, key))) {
    const extras = Object.keys(value).filter((key) => !BREAKPOINTS.includes(key));
    if (extras.length > 0) throw new EmailSdkError(`borderRadius rejects keys: ${extras.join(", ")}.`);
    for (const breakpointKey of BREAKPOINTS) {
      if (Object.hasOwn(value, breakpointKey)) base[breakpointKey] = buildCorner(value[breakpointKey], base[breakpointKey]);
    }
  } else {
    for (const breakpointKey of resolveBreakpoints(breakpoint)) {
      base[breakpointKey] = buildCorner(value, base[breakpointKey]);
    }
  }
  for (const breakpointKey of BREAKPOINTS) {
    if (base[breakpointKey] === void 0) {
      const present = BREAKPOINTS.map((key) => base[key]).find((candidate) => candidate !== void 0);
      base[breakpointKey] = present === void 0 ? buildCorner(0, void 0) : cloneJson(present);
    }
  }
  return base;
}
function buildTextStyle(leaf, value, existing) {
  if (typeof value !== "boolean") throw new EmailSdkError(`${leaf} must be a boolean.`);
  const base = isObject2(existing) ? cloneJson(existing) : {};
  base.bold ??= false;
  base.italic ??= false;
  base[leaf] = value;
  return base;
}
function buildStyleValue(shape, value, options, existing, leaf) {
  const breakpoint = normalizeBreakpoint(options.breakpoint);
  switch (shape) {
    case "color":
      return normalizeColor(value, true);
    case "colorNoTransparent":
      return normalizeColor(value, false);
    case "fontFamily":
      if (typeof value !== "string" || value.trim() === "") throw new EmailSdkError("fontFamily must be a non-empty string.");
      return value;
    case "textStyle":
      if (leaf === void 0) throw new EmailSdkError("Internal style error: textStyle leaf is missing.");
      return buildTextStyle(leaf, value, existing);
    case "sizeResponsive":
      return buildResponsiveScalar(value, existing, breakpoint, 8, 72, "fontSize");
    case "lineHeight":
      return buildResponsiveScalar(value, existing, breakpoint, 0, 5, "lineHeight");
    case "alignResponsive":
      return buildAlignment(value, existing, breakpoint);
    case "textAlignResponsive":
      return buildAlignment(value, existing, breakpoint, true);
    case "paddingResponsive":
      return buildResponsiveSides(value, existing, breakpoint, BREAKPOINTS, "padding");
    case "marginsResponsive":
      return buildResponsiveSides(value, existing, breakpoint, BREAKPOINTS, "margin");
    case "paddingMobileOnly":
      return buildResponsiveSides(value, existing, breakpoint, ["mobile"], "stripe padding");
    case "border":
      return buildBorder(value, existing);
    case "radiusCorner":
      return buildCorner(value, existing);
    case "radiusResponsiveCorner":
      return buildResponsiveCorner(value, existing, breakpoint);
  }
}

// src/sdk/parse-html.ts
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

// src/sdk/transplant-format.ts
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

// src/sdk/ids.ts
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

// src/sdk/edit.ts
var SETTER_HINTS = "Hints: text block \u2192 setContent(); button \u2192 setText()/setHref(); image \u2192 setSrc()/setHref()/setAlt().";
function assertEditorEmailJson(value) {
  if (!isObject2(value)) {
    throw new EmailSdkError("Stripo editor JSON must be a top-level object with settings and stripes.");
  }
  if (typeof value.html === "string" || typeof value.css === "string") {
    throw new EmailSdkError(
      "Campaign export JSON with html/css is not supported. Pass Stripo editor JSON with top-level settings and stripes."
    );
  }
  if (!isObject2(value.settings) || !Array.isArray(value.stripes)) {
    throw new EmailSdkError("Stripo editor JSON must include a top-level settings object and stripes array.");
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
      "createEmailMutationSdk/createEmailSdk no longer accept a schema option. Load the downloaded schema with setEmailSchema; validation is mandatory."
    );
  }
}
function createEmailSdk(options) {
  assertNoSchemaOption(options);
  assertEditorEmailJson(options.emailJson);
  let fallbackOrdinal = 0;
  const generateUniqueId = (seed, isTaken) => options.idFactory?.(seed, isTaken) ?? uniqueUuidFromSeed(seed, isTaken);
  const sdk = new EditorJsonMutationCore(
    options.emailJson,
    () => generateUniqueId(`fallback#${fallbackOrdinal++}`, () => false)
  );
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
  const componentLibrary = normalizeComponentLibrary(options.library, options.components);
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
    if (removedIds.has(realId)) {
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
  function currentIndex() {
    return collectNodeIndex(sdk.snapshot());
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
      if (realId !== void 0 && disambiguateBy === void 0) {
        return { compactId: lookupId, realId };
      }
    }
    const matches = currentIndex().filter((entry2) => entry2.id === lookupId).filter((entry2) => !removedIds.has(entry2.id));
    const entry = disambiguateEntries(matches, lookupId, disambiguateBy);
    return { compactId: realToTemp.get(entry.id) ?? entry.id, realId: entry.id };
  }
  function selectEntries(selector) {
    let entries = currentIndex().filter((entry) => !removedIds.has(entry.id));
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
    const entry = currentIndex().find((candidate) => candidate.id === realId);
    if (entry === void 0) throw new EmailSdkError(`Element ${compactLabel(realId)} was not found.`);
    return entry;
  }
  function writeSettings(realId, update) {
    assertMutable(realId);
    const entry = entryFor(realId);
    const settings = isObject2(entry.element.settings) ? cloneJson(entry.element.settings) : {};
    update(settings, entry);
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
    rejectNullLeaves(value, path);
    sdk.setDocumentPath(pieces, value, true);
    mutationCount += 1;
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
      const settings = isObject2(entry.element.settings) ? cloneJson(entry.element.settings) : {};
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
    assertSafeHref(mutation.url);
    writeSettings(realId, (settings, entry) => {
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
        const index = networks.findIndex((network) => isObject2(network) && network.type === mutation.network);
        if (index === -1 || !isObject2(networks[index])) {
          throw new EmailSdkError(`Social network "${mutation.network}" was not found.`);
        }
        if (mutation.url === "") {
          delete networks[index].link;
        } else {
          networks[index].link = { type: linkType, href: mutation.url };
        }
        settings.networks = networks;
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
      if (!isObject2(item)) throw new EmailSdkError(`Menu item ${itemIndex} was not found.`);
      const itemLinkColor = set.itemLinkColor ?? set.item_link_color;
      const itemBackgroundColor = set.itemBackgroundColor ?? set.item_background_color;
      const itemLinkValue = set.itemLinkValue ?? set.item_link_value;
      const itemLinkType = set.itemLinkType ?? set.item_link_type;
      const itemName = set.itemName ?? set.item_name;
      if (itemLinkColor !== void 0 || itemBackgroundColor !== void 0) {
        const colors = isObject2(item.colors) ? cloneJson(item.colors) : {};
        if (itemLinkColor !== void 0) colors.link = normalizeColor(itemLinkColor, false);
        if (itemBackgroundColor !== void 0) colors.background = normalizeColor(itemBackgroundColor, true);
        if (colors.link === void 0) colors.link = "#000000";
        if (colors.background === void 0) colors.background = "transparent";
        item.colors = colors;
      }
      if (itemLinkValue !== void 0) {
        assertSafeHref(itemLinkValue);
        const link = isObject2(item.link) ? cloneJson(item.link) : {};
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
  function markSubtreeRemoved(realId) {
    if (!sdk.hasElement(realId)) return;
    for (const id of sdk.collectSubtreeIds(realId)) removedIds.add(id);
  }
  function dropRemovedCollapsedScopes() {
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
    return sealHandle({
      set(property, value, options2) {
        return write(property, value, options2);
      },
      background: sealHandle({
        setColor(value, options2) {
          return write("backgroundColor", value, options2);
        }
      }),
      typography: sealHandle({
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
      layout: sealHandle({
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
      border: sealHandle({
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
    node = sealHandle({
      id: lookupId,
      style,
      byId(rawId, disambiguateBy) {
        if (inserted !== void 0) {
          throw new EmailSdkError(
            `${label} has no compact ids inside \u2014 use slot("role") to address its blocks (slots: ${slotsSummary(inserted)}).`
          );
        }
        assertNotRemoved(realId);
        const { compactId, realId: targetOriginalId } = resolveLookup(rawId, disambiguateBy);
        if (mapping !== void 0) {
          const targetInstanceId = mapping.get(targetOriginalId);
          if (targetInstanceId === void 0) {
            throw new EmailSdkError(
              `id "${compactId}" is not inside section ${label}. Ids inside this section: ${scopeIdsSummary(mapping.keys(), lookupId)}.`
            );
          }
          assertNotRemoved(targetInstanceId);
          return makeNode(targetInstanceId, compactId, { mapping });
        }
        const subtreeIds = new Set(sdk.collectSubtreeIds(realId));
        if (!subtreeIds.has(targetOriginalId)) {
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
      remove() {
        assertMutable(realId, { allowCollapsedRoot: true });
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
        const subtreeIds = sdk.collectSubtreeIds(realId);
        const instances = [];
        for (let ordinal = 0; ordinal < totalCount; ordinal += 1) {
          const instanceMapping = /* @__PURE__ */ new Map();
          for (const originalId of subtreeIds) {
            instanceMapping.set(
              originalId,
              generateUniqueId(`${originalId}#${ordinal}`, (id) => sdk.hasElement(id))
            );
          }
          const rootCloneId = instanceMapping.get(realId);
          if (rootCloneId === void 0) throw new EmailSdkError("repeat() internal error: missing root clone id.");
          const nestedIds = Object.fromEntries(
            [...instanceMapping].filter(([originalId]) => originalId !== realId)
          );
          sdk.cloneElement(realId, rootCloneId, false, nestedIds);
          instances.push(makeNode(rootCloneId, lookupId, { mapping: instanceMapping }));
        }
        for (const originalId of subtreeIds) {
          removedIds.add(originalId);
          replacedByRepeat.add(originalId);
        }
        sdk.deleteElement(realId);
        for (const siblingId of repeatSiblings[realId] ?? []) {
          markSubtreeRemoved(siblingId);
          sdk.deleteElementIfPresent(siblingId);
        }
        repeatedRoots.add(realId);
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
    const library = componentLibrary;
    if (library === void 0 || library.size === 0) {
      throw new EmailSdkError(
        "No brand component library is available in this session \u2014 email.insert() cannot be used here."
      );
    }
    if (typeof componentFile !== "string") {
      throw new EmailSdkError("insert() expects a brand_library component file key as the first argument.");
    }
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
    if (componentKind === void 0 || !isObject2(component.node) || typeof component.node.id !== "string") {
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
      sdk.validateDraft(`After insert("${componentFile}")`, {
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
      const originalId = isObject2(target) && typeof target.id === "string" ? target.id : void 0;
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
    return sealHandle({
      set(path, value) {
        writeTheme(path, value);
        return getEmail();
      },
      style: sealHandle({
        set(property, value, options2) {
          return write(property, value, options2);
        },
        background: sealHandle({
          setContentColor(value, options2) {
            return write("backgroundColor", value, { ...options2, backgroundTarget: "content" });
          },
          setStripeColor(value, options2) {
            return write("backgroundColor", value, { ...options2, backgroundTarget: "stripe" });
          }
        }),
        typography: sealHandle({
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
        link: sealHandle({
          setColor(value, options2) {
            return write("linkColor", value, options2);
          }
        })
      })
    });
  }
  let email;
  const theme = makeEmailTheme(() => email);
  email = sealHandle({
    theme,
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
      return Object.freeze(entries.map((entry) => makeNode(entry.id, realToTemp.get(entry.id) ?? entry.id)));
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
      return makeNode(entry.id, realToTemp.get(entry.id) ?? entry.id);
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
    }
  });
  return {
    email,
    finish() {
      assertNotSealed();
      sealed = true;
      try {
        const result = sdk.apply();
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
    diagnostics() {
      return {
        mutationCount,
        warnings: Object.freeze([...warnings]),
        selectorMisses: Object.freeze(selectorMisses.map((miss) => cloneJson(miss))),
        validation
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

// src/sdk/create.ts
var DEFAULT_THEME = {
  contentWidth: 600,
  backgroundColor: "#ffffff",
  contentBackgroundColor: "#ffffff",
  fontFamily: "Arial, sans-serif",
  fontColor: "#333333",
  linkColor: "#1376c8",
  buttonColor: "#1376c8",
  buttonTextColor: "#ffffff"
};
function isObject3(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function cloneJson2(value) {
  return structuredClone(value);
}
function mergeJson(base, override) {
  if (override === void 0) return cloneJson2(base);
  if (!isObject3(override)) throw new EmailSdkError("Email settings must be an object.");
  rejectNullLeaves2(override, "Email settings");
  const result = cloneJson2(base);
  for (const [key, value] of Object.entries(override)) {
    if (isObject3(result[key]) && isObject3(value)) {
      result[key] = mergeJson(result[key], value);
    } else {
      result[key] = cloneJson2(value);
    }
  }
  return result;
}
function normalizeTheme(theme) {
  return { ...DEFAULT_THEME, ...theme };
}
function sides(value = 0) {
  return { top: value, right: value, bottom: value, left: value };
}
function responsiveSides(desktop = 0, mobile = desktop) {
  return {
    desktop: sides(desktop),
    mobile: sides(mobile)
  };
}
function border(color = "transparent", width = 0) {
  return {
    top: { color, width },
    right: { color, width },
    bottom: { color, width },
    left: { color, width },
    style: "solid"
  };
}
function radius(value = 0) {
  return {
    topLeft: value,
    topRight: value,
    bottomRight: value,
    bottomLeft: value
  };
}
function responsiveRadius(value = 0) {
  return {
    desktop: radius(value),
    mobile: radius(value)
  };
}
function collectIds(value) {
  const ids = [];
  const stack = [value];
  while (stack.length > 0) {
    const current = stack.pop();
    if (Array.isArray(current)) {
      for (const child of current) stack.push(child);
      continue;
    }
    if (!isObject3(current)) continue;
    if (typeof current.id === "string") ids.push(current.id);
    for (const child of Object.values(current)) stack.push(child);
  }
  return ids;
}
function idIssuer(idFactory, initialTaken = []) {
  const issued = new Set(initialTaken);
  return (seed) => {
    const id = idFactory?.(seed, (candidate) => issued.has(candidate)) ?? uniqueUuidFromSeed(`email-builder:${seed}`, (candidate) => issued.has(candidate));
    if (issued.has(id)) {
      throw new EmailSdkError(`idFactory returned duplicate id "${id}" for seed "${seed}".`);
    }
    issued.add(id);
    return id;
  };
}
function assertNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new EmailSdkError(`${label} must be a non-empty string.`);
  }
}
function assertEditorSeed(value) {
  if (!isObject3(value)) {
    throw new EmailSdkError("Seed email JSON must be a Stripo editor JSON object.");
  }
  if (typeof value.html === "string" || typeof value.css === "string") {
    throw new EmailSdkError(
      "Campaign export JSON with html/css cannot be used as a builder seed. Pass Stripo editor JSON."
    );
  }
  if (!isObject3(value.settings) || !Array.isArray(value.stripes)) {
    throw new EmailSdkError("Seed email JSON must include a top-level settings object and stripes array.");
  }
}
function rejectNullLeaves2(value, label) {
  if (value === null) throw new EmailSdkError(`${label} must not contain null.`);
  if (Array.isArray(value)) {
    for (const item of value) rejectNullLeaves2(item, label);
    return;
  }
  if (isObject3(value)) {
    for (const child of Object.values(value)) rejectNullLeaves2(child, label);
  }
}
function setPath(target, path, value) {
  if (path.length === 0 || path.some((part) => part === "")) {
    throw new EmailSdkError("Theme path must not be empty.");
  }
  if (path[0] !== "settings") {
    throw new EmailSdkError(`Theme path must start with "settings.", got "${path.join(".")}".`);
  }
  let current = target;
  for (const segment of path.slice(0, -1)) {
    const next = current[segment];
    if (!isObject3(next)) {
      current[segment] = {};
    }
    current = current[segment];
  }
  current[path[path.length - 1]] = cloneJson2(value);
}
function buttonLink(href) {
  return { type: /^mailto:/iu.test(href) ? "email" : "site", value: href };
}
function buttonBlock(id, options) {
  return {
    id,
    type: "button",
    settings: {
      alignment: { desktop: "center", mobile: "center" },
      anchorLink: "",
      text: options.text,
      hideElement: "no",
      padding: responsiveSides(12),
      margins: responsiveSides(0),
      includeInOutput: "both",
      backgroundColor: options.theme.buttonColor,
      fontFamily: options.theme.fontFamily,
      fontSize: { desktop: 16, mobile: 16 },
      textStyle: { bold: false, italic: false },
      fitContainer: { desktop: false, mobile: true },
      blockBackgroundColor: "transparent",
      borderRadius: radius(8),
      border: border(options.theme.buttonColor, 0),
      fontColor: options.theme.buttonTextColor,
      link: buttonLink(options.href)
    }
  };
}
function textBlock(id, html, theme = DEFAULT_THEME) {
  return {
    id,
    type: "text",
    content: html,
    settings: {
      backgroundColor: theme.contentBackgroundColor,
      fontColor: theme.fontColor,
      hideElement: "no",
      includeInOutput: "both",
      padding: responsiveSides(0),
      rightToLeftTextDirection: false
    }
  };
}
function imageBlock(id, options) {
  const settings = {
    src: options.src,
    altText: { addToTitle: true, text: options.alt ?? "" },
    size: {
      // The live Stripo editor requires mobile size to MATCH desktop size when
      // responsiveMobile is enabled (updateSchema VALIDATION_ERROR otherwise).
      desktop: { mode: "width", px: 600 },
      mobile: { mode: "width", px: 600 }
    },
    alignment: { desktop: "center", mobile: "center" },
    radius: responsiveRadius(0),
    hideElement: "no",
    margins: responsiveSides(0),
    includeInOutput: "both",
    anchorLinkName: "",
    responsiveMobile: true
  };
  if (options.href !== void 0) {
    settings.link = { type: "site", href: options.href };
  }
  return {
    id,
    type: "image",
    settings
  };
}
function spacerBlock(id) {
  return {
    id,
    type: "spacer",
    settings: {
      mode: "space",
      height: { desktop: 20, mobile: 20 },
      backgroundColor: "transparent",
      margins: responsiveSides(0),
      anchorLinkName: "",
      includeInOutput: "both",
      hideElement: "no"
    }
  };
}
var SPACER_LINE_DEFAULTS = {
  width: {
    desktop: { value: 100, unit: "percent" },
    mobile: { value: 100, unit: "percent" }
  },
  border: { size: 1, style: "solid", color: "#cccccc" },
  alignment: { desktop: "center", mobile: "center" }
};
function stripeSettings(area, theme) {
  return {
    contentBackgroundColor: area === "content" ? theme.contentBackgroundColor : "transparent",
    contentBorder: border(),
    hideElement: "no",
    includeInOutput: "both",
    messageArea: area,
    padding: {
      mobile: sides(0)
    },
    stripeBackgroundColor: area === "content" ? theme.backgroundColor : "transparent"
  };
}
function structureSettings() {
  return {
    backgroundColor: "transparent",
    border: border(),
    borderRadius: radius(0),
    columnsGap: { desktop: 0, mobile: 0 },
    hideElement: "no",
    includeInOutput: "both",
    margins: responsiveSides(0),
    padding: responsiveSides(0),
    responsiveMobileContainersInversion: false
  };
}
function containerSettings(theme) {
  return {
    backgroundColor: "transparent",
    border: border(),
    hideElement: "no",
    includeInOutput: "both",
    padding: responsiveSides(0),
    radius: radius(0)
  };
}
function sectionStripe(ids, area, blocks, theme = DEFAULT_THEME) {
  return {
    id: ids.stripe,
    settings: stripeSettings(area, theme),
    structures: [
      {
        id: ids.structure,
        settings: structureSettings(),
        columns: [
          {
            id: ids.column,
            settings: { width: theme.contentWidth },
            containers: [
              {
                id: ids.container,
                settings: containerSettings(theme),
                blocks
              }
            ]
          }
        ]
      }
    ]
  };
}
function componentStripe(idPrefix, area, blocks) {
  return sectionStripe(
    {
      stripe: `${idPrefix}-stripe`,
      structure: `${idPrefix}-structure`,
      column: `${idPrefix}-column`,
      container: `${idPrefix}-container`
    },
    area,
    blocks
  );
}
function baseSettings(themeInput) {
  const theme = normalizeTheme(themeInput);
  return {
    general: {
      backgroundColor: theme.backgroundColor,
      defaultStructurePadding: responsiveSides(0),
      defaultStyles: true,
      hideImageDownloadIcons: false,
      marginsAroundMessage: responsiveSides(0),
      messageAlignment: "center",
      messageContentWidth: theme.contentWidth,
      responsiveDesign: true,
      rightToLeftTextDirection: false,
      underlineLinks: true
    },
    stripes: {
      fontFamily: theme.fontFamily,
      fontWeight: 400,
      lineHeight: { desktop: 1.5, mobile: 1.5 },
      letterSpacing: { unit: "px", value: 0 },
      content: {
        fontColor: theme.fontColor,
        linkColor: theme.linkColor,
        contentBackgroundColor: theme.contentBackgroundColor,
        fontSize: { desktop: 14, mobile: 16 }
      },
      header: {
        fontColor: theme.fontColor,
        linkColor: theme.linkColor,
        contentBackgroundColor: theme.contentBackgroundColor,
        stripeBackgroundColor: theme.backgroundColor,
        fontSize: { desktop: 14, mobile: 16 }
      },
      footer: {
        fontColor: theme.fontColor,
        linkColor: theme.linkColor,
        contentBackgroundColor: theme.contentBackgroundColor,
        stripeBackgroundColor: theme.backgroundColor,
        fontSize: { desktop: 12, mobile: 12 }
      },
      infoArea: {
        fontColor: theme.fontColor,
        linkColor: theme.linkColor,
        fontSize: { desktop: 12, mobile: 12 }
      }
    },
    buttons: {
      border: border(theme.buttonColor, 0),
      borderRadius: radius(8),
      buttonColor: theme.buttonColor,
      fitContainer: { desktop: false, mobile: true },
      fontColor: theme.buttonTextColor,
      fontFamily: theme.fontFamily,
      fontSize: { desktop: 16, mobile: 16 },
      hoverButtonStyles: {
        backgroundColor: theme.buttonColor,
        borderColor: {
          top: theme.buttonColor,
          right: theme.buttonColor,
          bottom: theme.buttonColor,
          left: theme.buttonColor
        },
        fontColor: theme.buttonTextColor
      },
      letterSpacing: { unit: "px", value: 0 },
      outlookSupport: true,
      padding: responsiveSides(12),
      textStyle: { bold: false, italic: false },
      textTransform: "none"
    },
    headings: {
      fontFamily: theme.fontFamily,
      h1: { fontColor: theme.fontColor, fontSize: { desktop: 32, mobile: 30 }, fontWeight: 400, lineHeight: { desktop: 1.2, mobile: 1.2 }, textAlign: { mobile: "center" }, textStyle: { italic: false } },
      h2: { fontColor: theme.fontColor, fontSize: { desktop: 24, mobile: 22 }, fontWeight: 400, lineHeight: { desktop: 1.2, mobile: 1.2 }, textAlign: { mobile: "center" }, textStyle: { italic: false } },
      h3: { fontColor: theme.fontColor, fontSize: { desktop: 20, mobile: 18 }, fontWeight: 400, lineHeight: { desktop: 1.2, mobile: 1.2 }, textAlign: { mobile: "center" }, textStyle: { italic: false } },
      h4: { fontColor: theme.fontColor, fontSize: { desktop: 18, mobile: 18 }, fontWeight: 400, lineHeight: { desktop: 1.2, mobile: 1.2 }, textAlign: { mobile: "left" }, textStyle: { italic: false } },
      h5: { fontColor: theme.fontColor, fontSize: { desktop: 16, mobile: 16 }, fontWeight: 400, lineHeight: { desktop: 1.2, mobile: 1.2 }, textAlign: { mobile: "left" }, textStyle: { italic: false } },
      h6: { fontColor: theme.fontColor, fontSize: { desktop: 14, mobile: 14 }, fontWeight: 400, lineHeight: { desktop: 1.2, mobile: 1.2 }, textAlign: { mobile: "left" }, textStyle: { italic: false } },
      letterSpacing: { unit: "px", value: 0 }
    }
  };
}
function createMinimalEmailSeed(options = {}) {
  const issueId = idIssuer(options.idFactory);
  const theme = normalizeTheme(options.theme);
  const ids = {
    stripe: issueId("seed:content-stripe"),
    structure: issueId("seed:content-structure"),
    column: issueId("seed:content-column"),
    container: issueId("seed:content-container"),
    block: issueId("seed:content-block")
  };
  return {
    settings: baseSettings(options.theme),
    stripes: [
      sectionStripe(ids, "content", [textBlock(ids.block, "<p></p>", theme)], theme)
    ]
  };
}
function assertNonEmptyArray(value, label) {
  if (!Array.isArray(value) || value.length === 0) {
    throw new EmailSdkError(`${label} must be a non-empty array.`);
  }
}
function createEmailFromDraft(options) {
  assertNoSchemaOption2(options);
  if (!isObject3(options.emailJson)) throw new EmailSdkError("emailJson must be a native editor JSON object.");
  const draft = cloneJson2(options.emailJson);
  draft.settings = mergeJson(baseSettings(void 0), draft.settings);
  const globalSettings = draft.settings;
  const general = objectValue(globalSettings.general, "settings.general");
  const areas = objectValue(globalSettings.stripes, "settings.stripes");
  const buttons = objectValue(globalSettings.buttons, "settings.buttons");
  const issueId = idIssuer(options.idFactory, collectIds(draft));
  const seenIds = /* @__PURE__ */ new Set();
  function objectValue(value, label) {
    if (!isObject3(value)) throw new EmailSdkError(`${label} must be an object.`);
    return value;
  }
  function settingsOf(node, label) {
    return node.settings === void 0 ? {} : objectValue(node.settings, `${label}.settings`);
  }
  function children(node, key, label) {
    const value = node[key];
    assertNonEmptyArray(value, `${label}.${key}`);
    return value.map((child, index) => objectValue(child, `${label}.${key}[${index}]`));
  }
  function fillNode(node, defaults, label) {
    if (node.id === void 0) node.id = issueId(label);
    assertNonEmptyString(node.id, `${label}.id`);
    if (seenIds.has(node.id)) throw new EmailSdkError(`Duplicate editor id "${node.id}" at ${label}.`);
    seenIds.add(node.id);
    node.settings = mergeJson(defaults, settingsOf(node, label));
  }
  children(draft, "stripes", "emailJson").forEach((stripe, stripeIndex) => {
    const stripePath = `emailJson.stripes[${stripeIndex}]`;
    const area = settingsOf(stripe, stripePath).messageArea ?? "content";
    assertNonEmptyString(area, `${stripePath}.settings.messageArea`);
    const areaSettings = areas[area] === void 0 ? {} : objectValue(areas[area], `settings.stripes.${area}`);
    const stripeDefaults = stripeSettings(area, DEFAULT_THEME);
    stripeDefaults.contentBackgroundColor = areaSettings.contentBackgroundColor ?? DEFAULT_THEME.contentBackgroundColor;
    stripeDefaults.stripeBackgroundColor = areaSettings.stripeBackgroundColor ?? general.backgroundColor;
    fillNode(stripe, stripeDefaults, stripePath);
    children(stripe, "structures", stripePath).forEach((structure, structureIndex) => {
      const structurePath = `${stripePath}.structures[${structureIndex}]`;
      fillNode(structure, structureSettings(), structurePath);
      children(structure, "columns", structurePath).forEach((column, columnIndex) => {
        const columnPath = `${structurePath}.columns[${columnIndex}]`;
        const width = settingsOf(column, columnPath).width;
        if (typeof width !== "number" || !Number.isInteger(width) || width <= 0) {
          throw new EmailSdkError(`${columnPath}.settings.width must be a positive integer in pixels.`);
        }
        fillNode(column, {}, columnPath);
        children(column, "containers", columnPath).forEach((container, containerIndex) => {
          const containerPath = `${columnPath}.containers[${containerIndex}]`;
          fillNode(container, containerSettings(DEFAULT_THEME), containerPath);
          children(container, "blocks", containerPath).forEach((block, blockIndex) => {
            const blockPath = `${containerPath}.blocks[${blockIndex}]`;
            const supplied = settingsOf(block, blockPath);
            let defaults;
            switch (block.type) {
              case "text":
                assertNonEmptyString(block.content, `${blockPath}.content`);
                defaults = textBlock("", "").settings;
                defaults.backgroundColor = areaSettings.contentBackgroundColor ?? DEFAULT_THEME.contentBackgroundColor;
                defaults.fontColor = areaSettings.fontColor ?? DEFAULT_THEME.fontColor;
                break;
              case "image": {
                assertNonEmptyString(supplied.src, `${blockPath}.settings.src`);
                defaults = imageBlock("", { src: supplied.src, alt: "" }).settings;
                const size = isObject3(supplied.size) ? supplied.size : {};
                const desktop = mergeJson({ mode: "width", px: width }, size.desktop);
                defaults.size = { desktop: cloneJson2(desktop), mobile: cloneJson2(desktop) };
                break;
              }
              case "button": {
                assertNonEmptyString(supplied.text, `${blockPath}.settings.text`);
                const link = objectValue(supplied.link, `${blockPath}.settings.link`);
                if (link.type === "email" && typeof link.value === "string" && link.value !== "" && !/^mailto:/iu.test(link.value)) {
                  link.value = `mailto:${link.value}`;
                }
                defaults = buttonBlock("", { text: "", href: "", theme: DEFAULT_THEME }).settings;
                for (const key of Object.keys(defaults)) {
                  if (Object.hasOwn(buttons, key)) defaults[key] = cloneJson2(buttons[key]);
                }
                defaults.backgroundColor = buttons.buttonColor;
                delete defaults.text;
                delete defaults.link;
                break;
              }
              case "spacer":
                defaults = spacerBlock("").settings;
                if (supplied.mode === "line") {
                  delete defaults.height;
                  Object.assign(defaults, cloneJson2(SPACER_LINE_DEFAULTS));
                }
                break;
              default:
                if (!options.preserveNativeBlocks) {
                  throw new EmailSdkError(
                    `${blockPath}.type must be one of text|image|button|spacer; raw HTML and other block types are unsupported.`
                  );
                }
                assertNonEmptyString(block.type, `${blockPath}.type`);
                defaults = {};
            }
            fillNode(block, defaults, blockPath);
          });
        });
      });
    });
  });
  return new EditorJsonMutationCore(draft).apply();
}
var minimalEmailComponents = Object.freeze({
  "L1/text-section.json": {
    level: "L1",
    node: componentStripe(
      "minimal-text",
      "content",
      [textBlock("minimal-text-body", "<p>Text section</p>")]
    ),
    slots: Object.freeze([{ role: "body", blockType: "text", pointer: "/structures/0/columns/0/containers/0/blocks/0" }])
  },
  "L1/image-section.json": {
    level: "L1",
    node: componentStripe(
      "minimal-image",
      "content",
      [imageBlock("minimal-image-image", { src: "https://example.com/image.png", alt: "Image" })]
    ),
    slots: Object.freeze([{ role: "image", blockType: "image", pointer: "/structures/0/columns/0/containers/0/blocks/0" }])
  },
  "L1/button-section.json": {
    level: "L1",
    node: componentStripe(
      "minimal-button",
      "content",
      [buttonBlock("minimal-button-cta", { text: "Start now", href: "https://example.com", theme: DEFAULT_THEME })]
    ),
    slots: Object.freeze([{ role: "cta", blockType: "button", pointer: "/structures/0/columns/0/containers/0/blocks/0" }])
  },
  "L1/footer-section.json": {
    level: "L1",
    node: componentStripe(
      "minimal-footer",
      "footer",
      [
        textBlock("minimal-footer-legal", "<p>You are receiving this email because you subscribed.</p>"),
        textBlock("minimal-footer-unsubscribe", '<p><a href="https://example.com/unsubscribe">Unsubscribe</a></p>')
      ]
    ),
    slots: Object.freeze([
      { role: "legal", blockType: "text", pointer: "/structures/0/columns/0/containers/0/blocks/0" },
      { role: "unsubscribe", blockType: "text", pointer: "/structures/0/columns/0/containers/0/blocks/1" }
    ])
  }
});
function assertNoSchemaOption2(options) {
  if (Object.hasOwn(options, "schema")) {
    throw new EmailSdkError(
      "Email creation no longer accepts a schema option. Load the downloaded schema with setEmailSchema; validation is mandatory."
    );
  }
}
function stripesFromDraft(draft) {
  return Array.isArray(draft.stripes) ? draft.stripes.filter(isObject3) : [];
}
function createEmailBuilder(options = {}) {
  assertNoSchemaOption2(options);
  const theme = normalizeTheme(options.theme);
  let draft = cloneJson2(options.seedEmailJson ?? createMinimalEmailSeed(options));
  assertEditorSeed(draft);
  const seedPlaceholderIds = options.seedEmailJson === void 0 ? new Set(stripesFromDraft(draft).map((stripe) => String(stripe.id))) : /* @__PURE__ */ new Set();
  const issueId = idIssuer(options.idFactory, collectIds(draft));
  const warnings = [];
  let validation = "pending";
  let mutationCount = 0;
  let sectionCount = 0;
  let sealed = false;
  const lastInsertByAnchor = /* @__PURE__ */ new Map();
  function assertNotSealed() {
    if (sealed) throw new EmailSdkError("The builder already finished \u2014 late mutations are not allowed.");
  }
  function stripes() {
    if (!Array.isArray(draft.stripes)) draft.stripes = [];
    return draft.stripes;
  }
  function nextIds(kind) {
    const ordinal = sectionCount + 1;
    return {
      stripe: issueId(`${kind}:${ordinal}:stripe`),
      structure: issueId(`${kind}:${ordinal}:structure`),
      column: issueId(`${kind}:${ordinal}:column`),
      container: issueId(`${kind}:${ordinal}:container`),
      block: issueId(`${kind}:${ordinal}:block`)
    };
  }
  function resolveAfter(after) {
    if (after === void 0) return void 0;
    if (typeof after === "string") return after;
    if (typeof after.id === "string") return after.id;
    throw new EmailSdkError("after must be a section id or a section handle returned by the builder.");
  }
  function insertStripe(stripe, after) {
    const list = stripes();
    const afterId = resolveAfter(after);
    if (afterId !== void 0) {
      const effectiveAfterId = lastInsertByAnchor.get(afterId) ?? afterId;
      const index = list.findIndex((item) => isObject3(item) && item.id === effectiveAfterId);
      if (index === -1) throw new EmailSdkError(`after section "${afterId}" was not found.`);
      list.splice(index + 1, 0, stripe);
      lastInsertByAnchor.set(afterId, String(stripe.id));
    } else {
      list.push(stripe);
    }
    sectionCount += 1;
    mutationCount += 1;
    const area = isObject3(stripe.settings) && typeof stripe.settings.messageArea === "string" ? stripe.settings.messageArea : "content";
    return Object.freeze({ id: String(stripe.id), area });
  }
  function removeUnusedPlaceholders() {
    draft.stripes = stripes().filter((stripe) => !seedPlaceholderIds.has(String(stripe.id)));
  }
  function validateAndClone(context) {
    try {
      const result = context === "finish" ? new EditorJsonMutationCore(draft).apply() : new EditorJsonMutationCore(draft).snapshot();
      if (context === "finish") validation = "passed";
      return result;
    } catch (error) {
      if (context === "finish") validation = "failed";
      throw error;
    }
  }
  const builder = {
    addTextSection(sectionOptions) {
      assertNotSealed();
      assertNonEmptyString(sectionOptions.html, "Text section html");
      const ids = nextIds("text-section");
      const stripe = sectionStripe(ids, sectionOptions.area ?? "content", [textBlock(ids.block, sectionOptions.html, theme)], theme);
      return insertStripe(stripe, sectionOptions.after);
    },
    addImageSection(sectionOptions) {
      assertNotSealed();
      assertNonEmptyString(sectionOptions.src, "Image src");
      const ids = nextIds("image-section");
      const stripe = sectionStripe(ids, sectionOptions.area ?? "content", [imageBlock(ids.block, sectionOptions)], theme);
      return insertStripe(stripe, sectionOptions.after);
    },
    addButtonSection(sectionOptions) {
      assertNotSealed();
      assertNonEmptyString(sectionOptions.text, "Button text");
      assertNonEmptyString(sectionOptions.href, "Button href");
      const ids = nextIds("button-section");
      const stripe = sectionStripe(ids, sectionOptions.area ?? "content", [
        buttonBlock(ids.block, { text: sectionOptions.text, href: sectionOptions.href, theme })
      ], theme);
      return insertStripe(stripe, sectionOptions.after);
    },
    addFooterSection(sectionOptions) {
      assertNotSealed();
      const ids = nextIds("footer-section");
      const blocks = [];
      if (sectionOptions.legalHtml !== void 0) {
        assertNonEmptyString(sectionOptions.legalHtml, "Footer legalHtml");
        blocks.push(textBlock(ids.block, sectionOptions.legalHtml, theme));
      }
      if (sectionOptions.addressHtml !== void 0) {
        assertNonEmptyString(sectionOptions.addressHtml, "Footer addressHtml");
        blocks.push(textBlock(issueId(`footer-section:${sectionCount + 1}:address-block`), sectionOptions.addressHtml, theme));
      }
      if (sectionOptions.unsubscribeHref !== void 0) {
        assertNonEmptyString(sectionOptions.unsubscribeHref, "Footer unsubscribeHref");
        blocks.push(textBlock(
          issueId(`footer-section:${sectionCount + 1}:unsubscribe-block`),
          `<p><a href="${sectionOptions.unsubscribeHref}">Unsubscribe</a></p>`,
          theme
        ));
      }
      if (blocks.length === 0) {
        blocks.push(textBlock(ids.block, "<p>You are receiving this email because you subscribed.</p>", theme));
      }
      const stripe = sectionStripe(ids, sectionOptions.area ?? "footer", blocks, theme);
      return insertStripe(stripe, sectionOptions.after);
    },
    setTheme(path, value) {
      assertNotSealed();
      assertNonEmptyString(path, "Theme path");
      rejectNullLeaves2(value, path);
      setPath(draft, path.split("."), value);
      mutationCount += 1;
      return builder;
    },
    toJSON() {
      return validateAndClone("snapshot");
    },
    toMutationSdk() {
      return createEmailMutationSdk({
        emailJson: builder.toJSON(),
        idFactory: options.idFactory
      });
    },
    finish() {
      assertNotSealed();
      sealed = true;
      removeUnusedPlaceholders();
      return validateAndClone("finish");
    },
    diagnostics() {
      return {
        mutationCount,
        sectionCount,
        warnings: Object.freeze([...warnings]),
        validation
      };
    }
  };
  return builder;
}

// src/reteno/fonts.ts
var MERGE_SERVICE_DEFAULT_FONT_FAMILY = "arial,'helvetica neue',helvetica,sans-serif";
var MERGE_SERVICE_FONT_SUBSTITUTION_REASON = "merge_service_font_connection_unavailable";
var MergeServiceFontCompatibilityError = class extends Error {
  code = "merge_service_font_connection_unavailable";
  violations;
  constructor(violations) {
    const detail = violations.map((violation) => `${violation.path}=${JSON.stringify(violation.fontFamily)}`).join(", ");
    super(
      `Structured fontFamily values sent through Reteno document-state/set must use ${JSON.stringify(MERGE_SERVICE_DEFAULT_FONT_FAMILY)}${detail ? `; incompatible values: ${detail}.` : "."} Normalize with normalizeMergeServiceFonts() and re-run assertMergeServiceFontCompatible() before preparing an MCP upload.`
    );
    this.name = "MergeServiceFontCompatibilityError";
    this.violations = violations.map((violation) => ({ ...violation }));
  }
};
function isObject4(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function cloneAndValidate(value) {
  assertValidEmailModel(value);
  return structuredClone(value);
}
function propertyPath(parts) {
  return parts.reduce(
    (path, part) => typeof part === "number" ? `${path}[${part}]` : `${path}.${part}`,
    "$"
  );
}
function canonicalizeFontFamily(fontFamily) {
  return fontFamily.replace(/["']/gu, "").trim().toLowerCase().split(",").map((part) => part.trim().replace(/\s+/gu, " ")).join(",");
}
function readFont(model, path) {
  let current = model;
  for (const part of path) {
    if (!isObject4(current)) return void 0;
    current = current[part];
  }
  return typeof current === "string" && current.trim() !== "" ? current : void 0;
}
function collectStructuredFonts(value, path = []) {
  const fonts = [];
  if (Array.isArray(value)) {
    value.forEach((child, index) => fonts.push(...collectStructuredFonts(child, [...path, index])));
    return fonts;
  }
  if (!isObject4(value)) return fonts;
  for (const [key, child] of Object.entries(value)) {
    if (key === "fontFamily" && typeof child === "string") {
      fonts.push({ path: propertyPath([...path, key]), value: child });
    } else {
      fonts.push(...collectStructuredFonts(child, [...path, key]));
    }
  }
  return fonts;
}
function resolveBaseline(model, fallbackFontFamily) {
  if (fallbackFontFamily.trim() === "") {
    throw new TypeError("fallbackFontFamily must be a non-empty CSS font stack.");
  }
  const body = readFont(model, ["settings", "stripes", "fontFamily"]) ?? fallbackFontFamily;
  const headings = readFont(model, ["settings", "headings", "fontFamily"]) ?? body;
  const buttons = readFont(model, ["settings", "buttons", "fontFamily"]) ?? body;
  return {
    body,
    headings,
    buttons,
    structuredValues: [MERGE_SERVICE_DEFAULT_FONT_FAMILY]
  };
}
function roleForPath(path, inherited) {
  const strings = path.filter((part) => typeof part === "string");
  if (strings.length >= 2 && strings[0] === "settings") {
    if (strings[1] === "headings") return "headings";
    if (strings[1] === "buttons") return "buttons";
    if (strings[1] === "stripes") return "body";
  }
  return inherited;
}
var FONT_DECLARATION_RE = /(\bfont-family\s*:\s*)((?:'[^']*'|"[^"]*"|[^;}"'])+?)(\s*!important)?(?=\s*(?:;|\}|["'](?:\s|>|\/)|$))/giu;
var HTML_TAG_RE = /<!--[\s\S]*?-->|<\/?\s*[a-zA-Z][^>]*>/gu;
var OPEN_TAG_RE = /^<\s*([a-zA-Z][a-zA-Z0-9-]*)/u;
var CLOSE_TAG_RE = /^<\s*\/\s*([a-zA-Z][a-zA-Z0-9-]*)/u;
var VOID_TAGS2 = /* @__PURE__ */ new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
function roleForTag(tag, inherited) {
  if (/^h[1-6]$/u.test(tag)) return "headings";
  if (tag === "button") return "buttons";
  return inherited;
}
function replaceFontDeclarations(input, role, persisted, path, diagnostics, occurrence) {
  return input.replace(FONT_DECLARATION_RE, (_match, prefix, rawRequested, important = "") => {
    const requested = rawRequested.trim();
    const currentPath = `${path}#font-family[${occurrence.value}]`;
    occurrence.value += 1;
    if (requested === persisted) return `${prefix}${rawRequested}${important}`;
    diagnostics.push({
      path: currentPath,
      source: "inline_css",
      role,
      requested,
      persisted,
      reason: MERGE_SERVICE_FONT_SUBSTITUTION_REASON
    });
    return `${prefix}${persisted}${important}`;
  });
}
function normalizeInlineCss(input, baseRole, baseline, path, diagnostics) {
  if (!/font-family\s*:/iu.test(input)) return input;
  const stack = [];
  const occurrence = { value: 0 };
  let output = "";
  let position = 0;
  for (const match of input.matchAll(HTML_TAG_RE)) {
    const index = match.index;
    const currentRole = stack.at(-1)?.role ?? baseRole;
    output += replaceFontDeclarations(
      input.slice(position, index),
      currentRole,
      baseline[currentRole],
      path,
      diagnostics,
      occurrence
    );
    const rawTag = match[0];
    const close = CLOSE_TAG_RE.exec(rawTag);
    if (close) {
      const tag2 = close[1].toLowerCase();
      for (let stackIndex = stack.length - 1; stackIndex >= 0; stackIndex -= 1) {
        if (stack[stackIndex].tag === tag2) {
          stack.length = stackIndex;
          break;
        }
      }
      output += rawTag;
      position = index + rawTag.length;
      continue;
    }
    const open = OPEN_TAG_RE.exec(rawTag);
    const tag = open?.[1].toLowerCase() ?? "";
    const tagRole = roleForTag(tag, currentRole);
    output += replaceFontDeclarations(rawTag, tagRole, baseline[tagRole], path, diagnostics, occurrence);
    if (tag && !VOID_TAGS2.has(tag) && !/\/\s*>$/u.test(rawTag)) stack.push({ tag, role: tagRole });
    position = index + rawTag.length;
  }
  const finalRole = stack.at(-1)?.role ?? baseRole;
  output += replaceFontDeclarations(input.slice(position), finalRole, baseline[finalRole], path, diagnostics, occurrence);
  return output;
}
function normalizeValue(value, baseline, diagnostics, path = [], inheritedRole = "body") {
  if (Array.isArray(value)) {
    value.forEach((child, index) => normalizeValue(
      child,
      baseline,
      diagnostics,
      [...path, index],
      inheritedRole
    ));
    return;
  }
  if (!isObject4(value)) return;
  const objectRole = value.type === "button" ? "buttons" : roleForPath(path, inheritedRole);
  for (const [key, child] of Object.entries(value)) {
    const childPath = [...path, key];
    const childRole = roleForPath(childPath, objectRole);
    if (key === "fontFamily" && typeof child === "string") {
      const candidatePath = propertyPath(childPath);
      const persisted = MERGE_SERVICE_DEFAULT_FONT_FAMILY;
      if (child !== persisted) {
        diagnostics.push({
          path: candidatePath,
          source: "structured",
          role: childRole,
          requested: child,
          persisted,
          reason: MERGE_SERVICE_FONT_SUBSTITUTION_REASON
        });
        value[key] = persisted;
      }
      continue;
    }
    if (typeof child === "string") {
      value[key] = normalizeInlineCss(
        child,
        childRole,
        baseline,
        propertyPath(childPath),
        diagnostics
      );
      continue;
    }
    normalizeValue(child, baseline, diagnostics, childPath, childRole);
  }
}
function assertMergeServiceFontCompatible(options) {
  const candidate = cloneAndValidate(options.candidateEmailJson);
  const baselineModel = cloneAndValidate(options.baselineEmailJson);
  const fallback = options.fallbackFontFamily ?? MERGE_SERVICE_DEFAULT_FONT_FAMILY;
  resolveBaseline(baselineModel, fallback);
  const safe = canonicalizeFontFamily(MERGE_SERVICE_DEFAULT_FONT_FAMILY);
  const violations = collectStructuredFonts(candidate).filter((entry) => canonicalizeFontFamily(entry.value) !== safe).map((entry) => ({ path: entry.path, fontFamily: entry.value }));
  if (violations.length > 0) throw new MergeServiceFontCompatibilityError(violations);
}
function normalizeMergeServiceFonts(options) {
  const candidate = cloneAndValidate(options.candidateEmailJson);
  const baselineModel = cloneAndValidate(options.baselineEmailJson);
  const fallback = options.fallbackFontFamily ?? MERGE_SERVICE_DEFAULT_FONT_FAMILY;
  const baseline = resolveBaseline(baselineModel, fallback);
  const diagnostics = [];
  normalizeValue(candidate, baseline, diagnostics);
  const emailJson = cloneAndValidate(candidate);
  assertMergeServiceFontCompatible({
    candidateEmailJson: emailJson,
    baselineEmailJson: baselineModel,
    fallbackFontFamily: fallback
  });
  return { emailJson, baseline, diagnostics };
}

// src/reteno/mcp-tools.ts
var RETENO_MCP_TOOL_MAPPING = Object.freeze({
  brand: "reteno",
  canonicalBrand: "reteno",
  fieldMapping: "identity",
  tools: Object.freeze({
    getBrandkit: "get_brandkit",
    listEmailInterfaces: "list_email_interfaces",
    getEmailModel: "get_email_model",
    getEmailModelSchema: "get_email_model_schema",
    getEmailMessagePreview: "get_email_message_preview_png",
    createEmailShell: "create_email_shell",
    prepareEmailModelUpload: "prepare_email_model_upload",
    updateEmailModel: "update_email_model",
    updateEmailMetadata: "update_email_metadata",
    prepareImageUpload: "prepare_image_upload",
    uploadImage: "upload_image"
  })
});

// src/stripo/mcp-tools.ts
var STRIPO_MCP_TOOL_MAPPING = Object.freeze({
  brand: "stripo",
  canonicalBrand: "reteno",
  fieldMapping: "adapter",
  tools: Object.freeze({
    getEmailModel: "get_document_state",
    getEmailModelSchema: "get_document_state_schema",
    getEmailMessagePreview: "get_screenshot",
    createEmailShell: "create_email",
    prepareEmailModelUpload: "prepare_document_state_upload",
    updateEmailModel: "set_document_state"
  }),
  auxiliaryTools: Object.freeze({
    identity: "whoami",
    contentMetadata: "get_content",
    recoverCreatedEmail: "find_content",
    folders: "find_folders"
  }),
  unsupported: Object.freeze({
    getBrandkit: "Use the reference email or template for brand facts.",
    listEmailInterfaces: "This editor has no sending interfaces.",
    updateEmailMetadata: "No metadata write tool is available.",
    prepareImageUpload: "Reuse hosted reference assets or user-supplied hosted assets.",
    uploadImage: "No asset upload tool is available.",
    createTemplate: "Templates can be read, edited and rebuilt; only emails can be created."
  }),
  entityTypes: ["EMAIL", "TEMPLATE"],
  contract: Object.freeze({
    read: { id: "id", type: "type", file: "downloadUrl" },
    prepare: { id: "id", type: "type", file: "uploadUrl", ticket: "uploadId" },
    write: { id: "id", type: "type", ticket: "uploadId", singleUse: true, baseVersion: false },
    preview: { id: "id", type: "type", mode: "BOTH", files: "screenshots" }
  })
});

// src/mcp-tools.ts
var CANONICAL_MCP_OPERATIONS = [
  "getBrandkit",
  "listEmailInterfaces",
  "getEmailModel",
  "getEmailModelSchema",
  "getEmailMessagePreview",
  "createEmailShell",
  "prepareEmailModelUpload",
  "updateEmailModel",
  "updateEmailMetadata",
  "prepareImageUpload",
  "uploadImage"
];
var EMAIL_INTERFACE_MCP_BRANDS = ["reteno", "yespo"];
function supportsEmailInterfaces(brand) {
  return brand === "reteno" || brand === "yespo";
}
function getMcpOperationsForBrand(brand) {
  return CANONICAL_MCP_OPERATIONS.filter(
    (operation) => operation !== "listEmailInterfaces" || supportsEmailInterfaces(brand)
  );
}
function getMcpToolMapping(brand) {
  if (brand === "reteno") return RETENO_MCP_TOOL_MAPPING;
  if (brand === "stripo") return STRIPO_MCP_TOOL_MAPPING;
  throw new Error(`Unsupported brand: ${String(brand)}`);
}
export {
  CANONICAL_MCP_OPERATIONS,
  EMAIL_INTERFACE_MCP_BRANDS,
  EmailSdkError,
  EmailSdkSchemaError,
  MERGE_SERVICE_DEFAULT_FONT_FAMILY,
  MERGE_SERVICE_FONT_SUBSTITUTION_REASON,
  MergeServiceFontCompatibilityError,
  RETENO_MCP_TOOL_MAPPING,
  STRIPO_MCP_TOOL_MAPPING,
  assertMergeServiceFontCompatible,
  canonicalizeFontFamily,
  createEmailBuilder,
  createEmailFromDraft,
  createEmailMutationSdk,
  createEmailSdk,
  createEmailValueEditor,
  createMinimalEmailSeed,
  describeNodeKind,
  getMcpOperationsForBrand,
  getMcpToolMapping,
  minimalEmailComponents,
  normalizeMergeServiceFonts,
  setEmailSchema,
  supportsEmailInterfaces,
  uniqueUuidFromSeed,
  uuidFromSeed
};

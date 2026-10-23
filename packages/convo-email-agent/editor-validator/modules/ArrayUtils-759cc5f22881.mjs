import {
  getContrastedHoveredFontColor,
  isEditableCssGradient,
  isMergeTagColorToken,
  normalizeCopilotDocumentStateColorValue,
  normalizeCssColorOrVar,
  splitTopLevelCsv,
  transformColorToHoverColor
} from "./ColorUtils-a33f32974f73.mjs";
import {
  HEAD_SELECTOR,
  LINK_TAG_SELECTOR
} from "./CSSConverter-608b83714731.mjs";
import {
  THEME_VARIABLE_DESCRIPTORS
} from "./master-css-variables-a84902889746.mjs";
import {
  MASTER_CSS_VARIABLES_DEFAULTS,
  MasterCssVar,
  SGConnectToModelInfoPermissions,
  SGGetConnectToModelInfoPermissions
} from "./ue-proto-87c1854705b4.mjs";
import {
  html
} from "./master-80783f73f1e0.mjs";
import {
  external_exports
} from "./coerce-d38c736de753.mjs";
import {
  require_document,
  require_lazy_result,
  require_parse,
  require_result,
  require_warn_once,
  require_warning
} from "./document-13235feeff49.mjs";
import {
  require_map_generator
} from "./map-generator-a34cf548f9d1.mjs";
import {
  require_at_rule,
  require_list,
  require_root,
  require_rule
} from "./at-rule-2b1e381bfcd5.mjs";
import {
  require_parse as require_parse2
} from "./parse-8126121d6d62.mjs";
import {
  require_comment,
  require_container,
  require_declaration
} from "./comment-c2c2abaee17f.mjs";
import {
  require_node,
  require_stringify
} from "./node-909c4f08098c.mjs";
import {
  require_input
} from "./url-27db039aa4f6.mjs";
import {
  require_previous_map
} from "./fs-064e509bf2cb.mjs";
import {
  require_css_syntax_error
} from "./terminal-highlight-0f20b1c39b48.mjs";
import {
  q
} from "./builders-6d4dedaf957f.mjs";
import {
  __commonJS,
  __toESM
} from "./shared-4f53cda18c2b.mjs";

// editor/ui-editor-ui/node_modules/postcss-value-parser/lib/walk.js
var require_walk = __commonJS({
  "../editor/ui-editor-ui/node_modules/postcss-value-parser/lib/walk.js"(exports, module) {
    "use strict";
    module.exports = function walk(nodes, cb, bubble) {
      var i, max, node, result;
      for (i = 0, max = nodes.length; i < max; i += 1) {
        node = nodes[i];
        if (!bubble) {
          result = cb(node, i, nodes);
        }
        if (result !== false && node.type === "function" && Array.isArray(node.nodes)) {
          walk(node.nodes, cb, bubble);
        }
        if (bubble) {
          cb(node, i, nodes);
        }
      }
    };
  }
});

// editor/ui-editor-ui/node_modules/postcss-value-parser/lib/stringify.js
var require_stringify2 = __commonJS({
  "../editor/ui-editor-ui/node_modules/postcss-value-parser/lib/stringify.js"(exports, module) {
    "use strict";
    function stringifyNode(node, custom) {
      var type = node.type;
      var value = node.value;
      var buf;
      var customResult;
      if (custom && (customResult = custom(node)) !== void 0) {
        return customResult;
      } else if (type === "word" || type === "space") {
        return value;
      } else if (type === "string") {
        buf = node.quote || "";
        return buf + value + (node.unclosed ? "" : buf);
      } else if (type === "comment") {
        return "/*" + value + (node.unclosed ? "" : "*/");
      } else if (type === "div") {
        return (node.before || "") + value + (node.after || "");
      } else if (Array.isArray(node.nodes)) {
        buf = stringify2(node.nodes, custom);
        if (type !== "function") {
          return buf;
        }
        return value + "(" + (node.before || "") + buf + (node.after || "") + (node.unclosed ? "" : ")");
      }
      return value;
    }
    function stringify2(nodes, custom) {
      var result, i;
      if (Array.isArray(nodes)) {
        result = "";
        for (i = nodes.length - 1; ~i; i -= 1) {
          result = stringifyNode(nodes[i], custom) + result;
        }
        return result;
      }
      return stringifyNode(nodes, custom);
    }
    module.exports = stringify2;
  }
});

// editor/ui-editor-ui/node_modules/postcss-value-parser/lib/unit.js
var require_unit = __commonJS({
  "../editor/ui-editor-ui/node_modules/postcss-value-parser/lib/unit.js"(exports, module) {
    "use strict";
    var minus = "-".charCodeAt(0);
    var plus = "+".charCodeAt(0);
    var dot = ".".charCodeAt(0);
    var exp = "e".charCodeAt(0);
    var EXP = "E".charCodeAt(0);
    function likeNumber(value) {
      var code = value.charCodeAt(0);
      var nextCode;
      if (code === plus || code === minus) {
        nextCode = value.charCodeAt(1);
        if (nextCode >= 48 && nextCode <= 57) {
          return true;
        }
        var nextNextCode = value.charCodeAt(2);
        if (nextCode === dot && nextNextCode >= 48 && nextNextCode <= 57) {
          return true;
        }
        return false;
      }
      if (code === dot) {
        nextCode = value.charCodeAt(1);
        if (nextCode >= 48 && nextCode <= 57) {
          return true;
        }
        return false;
      }
      if (code >= 48 && code <= 57) {
        return true;
      }
      return false;
    }
    module.exports = function(value) {
      var pos = 0;
      var length = value.length;
      var code;
      var nextCode;
      var nextNextCode;
      if (length === 0 || !likeNumber(value)) {
        return false;
      }
      code = value.charCodeAt(pos);
      if (code === plus || code === minus) {
        pos++;
      }
      while (pos < length) {
        code = value.charCodeAt(pos);
        if (code < 48 || code > 57) {
          break;
        }
        pos += 1;
      }
      code = value.charCodeAt(pos);
      nextCode = value.charCodeAt(pos + 1);
      if (code === dot && nextCode >= 48 && nextCode <= 57) {
        pos += 2;
        while (pos < length) {
          code = value.charCodeAt(pos);
          if (code < 48 || code > 57) {
            break;
          }
          pos += 1;
        }
      }
      code = value.charCodeAt(pos);
      nextCode = value.charCodeAt(pos + 1);
      nextNextCode = value.charCodeAt(pos + 2);
      if ((code === exp || code === EXP) && (nextCode >= 48 && nextCode <= 57 || (nextCode === plus || nextCode === minus) && nextNextCode >= 48 && nextNextCode <= 57)) {
        pos += nextCode === plus || nextCode === minus ? 3 : 2;
        while (pos < length) {
          code = value.charCodeAt(pos);
          if (code < 48 || code > 57) {
            break;
          }
          pos += 1;
        }
      }
      return {
        number: value.slice(0, pos),
        unit: value.slice(pos)
      };
    };
  }
});

// editor/ui-editor-ui/node_modules/postcss-value-parser/lib/index.js
var require_lib = __commonJS({
  "../editor/ui-editor-ui/node_modules/postcss-value-parser/lib/index.js"(exports, module) {
    "use strict";
    var parse2 = require_parse2();
    var walk = require_walk();
    var stringify2 = require_stringify2();
    function ValueParser(value) {
      if (this instanceof ValueParser) {
        this.nodes = parse2(value);
        return this;
      }
      return new ValueParser(value);
    }
    ValueParser.prototype.toString = function() {
      return Array.isArray(this.nodes) ? stringify2(this.nodes) : "";
    };
    ValueParser.prototype.walk = function(cb, bubble) {
      walk(this.nodes, cb, bubble);
      return this;
    };
    ValueParser.unit = require_unit();
    ValueParser.walk = walk;
    ValueParser.stringify = stringify2;
    module.exports = ValueParser;
  }
});

// editor/ui-editor-ui/node_modules/postcss/lib/fromJSON.js
var require_fromJSON = __commonJS({
  "../editor/ui-editor-ui/node_modules/postcss/lib/fromJSON.js"(exports, module) {
    "use strict";
    var AtRule3 = require_at_rule();
    var Comment2 = require_comment();
    var Declaration2 = require_declaration();
    var Input2 = require_input();
    var PreviousMap = require_previous_map();
    var Root3 = require_root();
    var Rule2 = require_rule();
    function hydrateInputs(json, inputs) {
      if (!json.inputs) return inputs;
      return json.inputs.map((input) => {
        let inputHydrated = { ...input, __proto__: Input2.prototype };
        if (inputHydrated.map) {
          inputHydrated.map = {
            ...inputHydrated.map,
            __proto__: PreviousMap.prototype
          };
        }
        return inputHydrated;
      });
    }
    function constructNode(json, inputs, children) {
      let defaults = { ...json };
      delete defaults.inputs;
      delete defaults.nodes;
      if (defaults.source) {
        let { inputId, ...source } = defaults.source;
        defaults.source = source;
        if (inputId != null) {
          defaults.source.input = inputs[inputId];
        }
      }
      let node;
      if (defaults.type === "root") {
        node = new Root3(defaults);
      } else if (defaults.type === "decl") {
        node = new Declaration2(defaults);
      } else if (defaults.type === "rule") {
        node = new Rule2(defaults);
      } else if (defaults.type === "comment") {
        node = new Comment2(defaults);
      } else if (defaults.type === "atrule") {
        node = new AtRule3(defaults);
      } else {
        throw new Error("Unknown node type: " + json.type);
      }
      if (children) {
        node.nodes = children;
        for (let child of children) child.parent = node;
      }
      return node;
    }
    function fromJSON2(json, inputs) {
      if (Array.isArray(json)) return json.map((n) => fromJSON2(n));
      let result;
      let stack = [
        { childIndex: 0, children: [], inputs: hydrateInputs(json, inputs), json }
      ];
      while (stack.length > 0) {
        let frame = stack[stack.length - 1];
        let jsonNodes = frame.json.nodes;
        if (jsonNodes && frame.childIndex < jsonNodes.length) {
          let childJson = jsonNodes[frame.childIndex];
          frame.childIndex += 1;
          stack.push({
            childIndex: 0,
            children: [],
            inputs: hydrateInputs(childJson, frame.inputs),
            json: childJson
          });
          continue;
        }
        stack.pop();
        let node = constructNode(
          frame.json,
          frame.inputs,
          jsonNodes ? frame.children : void 0
        );
        if (stack.length > 0) {
          stack[stack.length - 1].children.push(node);
        } else {
          result = node;
        }
      }
      return result;
    }
    module.exports = fromJSON2;
    fromJSON2.default = fromJSON2;
  }
});

// editor/ui-editor-ui/node_modules/postcss/lib/no-work-result.js
var require_no_work_result = __commonJS({
  "../editor/ui-editor-ui/node_modules/postcss/lib/no-work-result.js"(exports, module) {
    "use strict";
    var MapGenerator = require_map_generator();
    var parse2 = require_parse();
    var Result2 = require_result();
    var stringify2 = require_stringify();
    var warnOnce = require_warn_once();
    var NoWorkResult = class {
      get content() {
        return this.result.css;
      }
      get css() {
        return this.result.css;
      }
      get map() {
        return this.result.map;
      }
      get messages() {
        return [];
      }
      get opts() {
        return this.result.opts;
      }
      get processor() {
        return this.result.processor;
      }
      get root() {
        if (this._root) {
          return this._root;
        }
        let root2;
        let parser = parse2;
        try {
          root2 = parser(this._css, this._opts);
        } catch (error) {
          this.error = error;
        }
        if (this.error) {
          throw this.error;
        } else {
          this._root = root2;
          return root2;
        }
      }
      get [Symbol.toStringTag]() {
        return "NoWorkResult";
      }
      constructor(processor, css, opts) {
        css = css.toString();
        this.stringified = false;
        this._processor = processor;
        this._css = css;
        this._opts = opts;
        this._map = void 0;
        let str = stringify2;
        this.result = new Result2(this._processor, void 0, this._opts);
        this.result.css = css;
        let self2 = this;
        Object.defineProperty(this.result, "root", {
          get() {
            return self2.root;
          }
        });
        let map = new MapGenerator(str, void 0, this._opts, css);
        if (map.isMap()) {
          let [generatedCSS, generatedMap] = map.generate();
          if (generatedCSS) {
            this.result.css = generatedCSS;
          }
          if (generatedMap) {
            this.result.map = generatedMap;
          }
        } else {
          map.clearAnnotation();
          this.result.css = map.css;
        }
      }
      async() {
        if (this.error) return Promise.reject(this.error);
        return Promise.resolve(this.result);
      }
      catch(onRejected) {
        return this.async().catch(onRejected);
      }
      finally(onFinally) {
        return this.async().then(onFinally, onFinally);
      }
      sync() {
        if (this.error) throw this.error;
        return this.result;
      }
      then(onFulfilled, onRejected) {
        if (true) {
          if (!("from" in this._opts)) {
            warnOnce(
              "Without `from` option PostCSS could generate wrong source map and will not find Browserslist config. Set it to CSS file path or to `undefined` to prevent this warning."
            );
          }
        }
        return this.async().then(onFulfilled, onRejected);
      }
      toString() {
        return this._css;
      }
      warnings() {
        return [];
      }
    };
    module.exports = NoWorkResult;
    NoWorkResult.default = NoWorkResult;
  }
});

// editor/ui-editor-ui/node_modules/postcss/lib/processor.js
var require_processor = __commonJS({
  "../editor/ui-editor-ui/node_modules/postcss/lib/processor.js"(exports, module) {
    "use strict";
    var Document2 = require_document();
    var LazyResult = require_lazy_result();
    var NoWorkResult = require_no_work_result();
    var Root3 = require_root();
    var Processor2 = class {
      constructor(plugins = []) {
        this.version = "8.5.28";
        this.plugins = this.normalize(plugins);
      }
      normalize(plugins) {
        let normalized = [];
        for (let i of plugins) {
          if (i.postcss === true) {
            i = i();
          } else if (i.postcss) {
            i = i.postcss;
          }
          if (typeof i === "object" && Array.isArray(i.plugins)) {
            normalized = normalized.concat(i.plugins);
          } else if (typeof i === "object" && i.postcssPlugin) {
            normalized.push(i);
          } else if (typeof i === "function") {
            normalized.push(i);
          } else if (typeof i === "object" && (i.parse || i.stringify)) {
            if (true) {
              throw new Error(
                "PostCSS syntaxes cannot be used as plugins. Instead, please use one of the syntax/parser/stringifier options as outlined in your PostCSS runner documentation."
              );
            }
          } else {
            throw new Error(i + " is not a PostCSS plugin");
          }
        }
        return normalized;
      }
      process(css, opts = {}) {
        if (!this.plugins.length && !opts.parser && !opts.stringifier && !opts.syntax) {
          return new NoWorkResult(this, css, opts);
        } else {
          return new LazyResult(this, css, opts);
        }
      }
      use(plugin2) {
        this.plugins = this.plugins.concat(this.normalize([plugin2]));
        return this;
      }
    };
    module.exports = Processor2;
    Processor2.default = Processor2;
    Root3.registerProcessor(Processor2);
    Document2.registerProcessor(Processor2);
  }
});

// editor/ui-editor-ui/node_modules/postcss/lib/postcss.js
var require_postcss = __commonJS({
  "../editor/ui-editor-ui/node_modules/postcss/lib/postcss.js"(exports, module) {
    "use strict";
    var AtRule3 = require_at_rule();
    var Comment2 = require_comment();
    var Container2 = require_container();
    var CssSyntaxError2 = require_css_syntax_error();
    var Declaration2 = require_declaration();
    var Document2 = require_document();
    var fromJSON2 = require_fromJSON();
    var Input2 = require_input();
    var LazyResult = require_lazy_result();
    var list2 = require_list();
    var Node2 = require_node();
    var parse2 = require_parse();
    var Processor2 = require_processor();
    var Result2 = require_result();
    var Root3 = require_root();
    var Rule2 = require_rule();
    var stringify2 = require_stringify();
    var Warning2 = require_warning();
    function postcss2(...plugins) {
      if (plugins.length === 1 && Array.isArray(plugins[0])) {
        plugins = plugins[0];
      }
      return new Processor2(plugins);
    }
    postcss2.plugin = function plugin2(name, initializer) {
      let warningPrinted = false;
      function creator(...args) {
        if (console && console.warn && !warningPrinted) {
          warningPrinted = true;
          console.warn(
            name + ": postcss.plugin was deprecated. Migration guide:\nhttps://evilmartians.com/chronicles/postcss-8-plugin-migration"
          );
          if (process.env.LANG && process.env.LANG.startsWith("zh")) {
            console.warn(
              name + ": \u91CC\u9762 postcss.plugin \u88AB\u5F03\u7528. \u8FC1\u79FB\u6307\u5357:\nhttps://www.w3ctech.com/topic/2226"
            );
          }
        }
        let transformer = initializer(...args);
        transformer.postcssPlugin = name;
        transformer.postcssVersion = new Processor2().version;
        return transformer;
      }
      let cache;
      Object.defineProperty(creator, "postcss", {
        get() {
          if (!cache) cache = creator();
          return cache;
        }
      });
      creator.process = function(css, processOpts, pluginOpts) {
        return postcss2([creator(pluginOpts)]).process(css, processOpts);
      };
      return creator;
    };
    postcss2.stringify = stringify2;
    postcss2.parse = parse2;
    postcss2.fromJSON = fromJSON2;
    postcss2.list = list2;
    postcss2.comment = (defaults) => new Comment2(defaults);
    postcss2.atRule = (defaults) => new AtRule3(defaults);
    postcss2.decl = (defaults) => new Declaration2(defaults);
    postcss2.rule = (defaults) => new Rule2(defaults);
    postcss2.root = (defaults) => new Root3(defaults);
    postcss2.document = (defaults) => new Document2(defaults);
    postcss2.CssSyntaxError = CssSyntaxError2;
    postcss2.Declaration = Declaration2;
    postcss2.Container = Container2;
    postcss2.Processor = Processor2;
    postcss2.Document = Document2;
    postcss2.Comment = Comment2;
    postcss2.Warning = Warning2;
    postcss2.AtRule = AtRule3;
    postcss2.Result = Result2;
    postcss2.Input = Input2;
    postcss2.Rule = Rule2;
    postcss2.Root = Root3;
    postcss2.Node = Node2;
    LazyResult.registerPostcss(postcss2);
    module.exports = postcss2;
    postcss2.default = postcss2;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_arrayReduce.js
var require_arrayReduce = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_arrayReduce.js"(exports, module) {
    "use strict";
    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index = -1, length = array == null ? 0 : array.length;
      if (initAccum && length) {
        accumulator = array[++index];
      }
      while (++index < length) {
        accumulator = iteratee(accumulator, array[index], index, array);
      }
      return accumulator;
    }
    module.exports = arrayReduce;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_basePropertyOf.js
var require_basePropertyOf = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_basePropertyOf.js"(exports, module) {
    "use strict";
    function basePropertyOf(object) {
      return function(key) {
        return object == null ? void 0 : object[key];
      };
    }
    module.exports = basePropertyOf;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_deburrLetter.js
var require_deburrLetter = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_deburrLetter.js"(exports, module) {
    "use strict";
    var basePropertyOf = require_basePropertyOf();
    var deburredLetters = {
      // Latin-1 Supplement block.
      "\xC0": "A",
      "\xC1": "A",
      "\xC2": "A",
      "\xC3": "A",
      "\xC4": "A",
      "\xC5": "A",
      "\xE0": "a",
      "\xE1": "a",
      "\xE2": "a",
      "\xE3": "a",
      "\xE4": "a",
      "\xE5": "a",
      "\xC7": "C",
      "\xE7": "c",
      "\xD0": "D",
      "\xF0": "d",
      "\xC8": "E",
      "\xC9": "E",
      "\xCA": "E",
      "\xCB": "E",
      "\xE8": "e",
      "\xE9": "e",
      "\xEA": "e",
      "\xEB": "e",
      "\xCC": "I",
      "\xCD": "I",
      "\xCE": "I",
      "\xCF": "I",
      "\xEC": "i",
      "\xED": "i",
      "\xEE": "i",
      "\xEF": "i",
      "\xD1": "N",
      "\xF1": "n",
      "\xD2": "O",
      "\xD3": "O",
      "\xD4": "O",
      "\xD5": "O",
      "\xD6": "O",
      "\xD8": "O",
      "\xF2": "o",
      "\xF3": "o",
      "\xF4": "o",
      "\xF5": "o",
      "\xF6": "o",
      "\xF8": "o",
      "\xD9": "U",
      "\xDA": "U",
      "\xDB": "U",
      "\xDC": "U",
      "\xF9": "u",
      "\xFA": "u",
      "\xFB": "u",
      "\xFC": "u",
      "\xDD": "Y",
      "\xFD": "y",
      "\xFF": "y",
      "\xC6": "Ae",
      "\xE6": "ae",
      "\xDE": "Th",
      "\xFE": "th",
      "\xDF": "ss",
      // Latin Extended-A block.
      "\u0100": "A",
      "\u0102": "A",
      "\u0104": "A",
      "\u0101": "a",
      "\u0103": "a",
      "\u0105": "a",
      "\u0106": "C",
      "\u0108": "C",
      "\u010A": "C",
      "\u010C": "C",
      "\u0107": "c",
      "\u0109": "c",
      "\u010B": "c",
      "\u010D": "c",
      "\u010E": "D",
      "\u0110": "D",
      "\u010F": "d",
      "\u0111": "d",
      "\u0112": "E",
      "\u0114": "E",
      "\u0116": "E",
      "\u0118": "E",
      "\u011A": "E",
      "\u0113": "e",
      "\u0115": "e",
      "\u0117": "e",
      "\u0119": "e",
      "\u011B": "e",
      "\u011C": "G",
      "\u011E": "G",
      "\u0120": "G",
      "\u0122": "G",
      "\u011D": "g",
      "\u011F": "g",
      "\u0121": "g",
      "\u0123": "g",
      "\u0124": "H",
      "\u0126": "H",
      "\u0125": "h",
      "\u0127": "h",
      "\u0128": "I",
      "\u012A": "I",
      "\u012C": "I",
      "\u012E": "I",
      "\u0130": "I",
      "\u0129": "i",
      "\u012B": "i",
      "\u012D": "i",
      "\u012F": "i",
      "\u0131": "i",
      "\u0134": "J",
      "\u0135": "j",
      "\u0136": "K",
      "\u0137": "k",
      "\u0138": "k",
      "\u0139": "L",
      "\u013B": "L",
      "\u013D": "L",
      "\u013F": "L",
      "\u0141": "L",
      "\u013A": "l",
      "\u013C": "l",
      "\u013E": "l",
      "\u0140": "l",
      "\u0142": "l",
      "\u0143": "N",
      "\u0145": "N",
      "\u0147": "N",
      "\u014A": "N",
      "\u0144": "n",
      "\u0146": "n",
      "\u0148": "n",
      "\u014B": "n",
      "\u014C": "O",
      "\u014E": "O",
      "\u0150": "O",
      "\u014D": "o",
      "\u014F": "o",
      "\u0151": "o",
      "\u0154": "R",
      "\u0156": "R",
      "\u0158": "R",
      "\u0155": "r",
      "\u0157": "r",
      "\u0159": "r",
      "\u015A": "S",
      "\u015C": "S",
      "\u015E": "S",
      "\u0160": "S",
      "\u015B": "s",
      "\u015D": "s",
      "\u015F": "s",
      "\u0161": "s",
      "\u0162": "T",
      "\u0164": "T",
      "\u0166": "T",
      "\u0163": "t",
      "\u0165": "t",
      "\u0167": "t",
      "\u0168": "U",
      "\u016A": "U",
      "\u016C": "U",
      "\u016E": "U",
      "\u0170": "U",
      "\u0172": "U",
      "\u0169": "u",
      "\u016B": "u",
      "\u016D": "u",
      "\u016F": "u",
      "\u0171": "u",
      "\u0173": "u",
      "\u0174": "W",
      "\u0175": "w",
      "\u0176": "Y",
      "\u0177": "y",
      "\u0178": "Y",
      "\u0179": "Z",
      "\u017B": "Z",
      "\u017D": "Z",
      "\u017A": "z",
      "\u017C": "z",
      "\u017E": "z",
      "\u0132": "IJ",
      "\u0133": "ij",
      "\u0152": "Oe",
      "\u0153": "oe",
      "\u0149": "'n",
      "\u017F": "s"
    };
    var deburrLetter = basePropertyOf(deburredLetters);
    module.exports = deburrLetter;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_freeGlobal.js
var require_freeGlobal = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_freeGlobal.js"(exports, module) {
    "use strict";
    var freeGlobal = typeof global == "object" && global && global.Object === Object && global;
    module.exports = freeGlobal;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_root.js
var require_root2 = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_root.js"(exports, module) {
    "use strict";
    var freeGlobal = require_freeGlobal();
    var freeSelf = typeof self == "object" && self && self.Object === Object && self;
    var root2 = freeGlobal || freeSelf || Function("return this")();
    module.exports = root2;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_Symbol.js
var require_Symbol = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_Symbol.js"(exports, module) {
    "use strict";
    var root2 = require_root2();
    var Symbol2 = root2.Symbol;
    module.exports = Symbol2;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_arrayMap.js
var require_arrayMap = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_arrayMap.js"(exports, module) {
    "use strict";
    function arrayMap(array, iteratee) {
      var index = -1, length = array == null ? 0 : array.length, result = Array(length);
      while (++index < length) {
        result[index] = iteratee(array[index], index, array);
      }
      return result;
    }
    module.exports = arrayMap;
  }
});

// editor/ui-editor-ui/node_modules/lodash/isArray.js
var require_isArray = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/isArray.js"(exports, module) {
    "use strict";
    var isArray = Array.isArray;
    module.exports = isArray;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_getRawTag.js
var require_getRawTag = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_getRawTag.js"(exports, module) {
    "use strict";
    var Symbol2 = require_Symbol();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var nativeObjectToString = objectProto.toString;
    var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    function getRawTag(value) {
      var isOwn = hasOwnProperty.call(value, symToStringTag), tag = value[symToStringTag];
      try {
        value[symToStringTag] = void 0;
        var unmasked = true;
      } catch (e) {
      }
      var result = nativeObjectToString.call(value);
      if (unmasked) {
        if (isOwn) {
          value[symToStringTag] = tag;
        } else {
          delete value[symToStringTag];
        }
      }
      return result;
    }
    module.exports = getRawTag;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_objectToString.js
var require_objectToString = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_objectToString.js"(exports, module) {
    "use strict";
    var objectProto = Object.prototype;
    var nativeObjectToString = objectProto.toString;
    function objectToString(value) {
      return nativeObjectToString.call(value);
    }
    module.exports = objectToString;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_baseGetTag.js
var require_baseGetTag = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_baseGetTag.js"(exports, module) {
    "use strict";
    var Symbol2 = require_Symbol();
    var getRawTag = require_getRawTag();
    var objectToString = require_objectToString();
    var nullTag = "[object Null]";
    var undefinedTag = "[object Undefined]";
    var symToStringTag = Symbol2 ? Symbol2.toStringTag : void 0;
    function baseGetTag(value) {
      if (value == null) {
        return value === void 0 ? undefinedTag : nullTag;
      }
      return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
    }
    module.exports = baseGetTag;
  }
});

// editor/ui-editor-ui/node_modules/lodash/isObjectLike.js
var require_isObjectLike = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/isObjectLike.js"(exports, module) {
    "use strict";
    function isObjectLike(value) {
      return value != null && typeof value == "object";
    }
    module.exports = isObjectLike;
  }
});

// editor/ui-editor-ui/node_modules/lodash/isSymbol.js
var require_isSymbol = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/isSymbol.js"(exports, module) {
    "use strict";
    var baseGetTag = require_baseGetTag();
    var isObjectLike = require_isObjectLike();
    var symbolTag = "[object Symbol]";
    function isSymbol(value) {
      return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
    }
    module.exports = isSymbol;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_baseToString.js
var require_baseToString = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_baseToString.js"(exports, module) {
    "use strict";
    var Symbol2 = require_Symbol();
    var arrayMap = require_arrayMap();
    var isArray = require_isArray();
    var isSymbol = require_isSymbol();
    var INFINITY = 1 / 0;
    var symbolProto = Symbol2 ? Symbol2.prototype : void 0;
    var symbolToString = symbolProto ? symbolProto.toString : void 0;
    function baseToString(value) {
      if (typeof value == "string") {
        return value;
      }
      if (isArray(value)) {
        return arrayMap(value, baseToString) + "";
      }
      if (isSymbol(value)) {
        return symbolToString ? symbolToString.call(value) : "";
      }
      var result = value + "";
      return result == "0" && 1 / value == -INFINITY ? "-0" : result;
    }
    module.exports = baseToString;
  }
});

// editor/ui-editor-ui/node_modules/lodash/toString.js
var require_toString = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/toString.js"(exports, module) {
    "use strict";
    var baseToString = require_baseToString();
    function toString(value) {
      return value == null ? "" : baseToString(value);
    }
    module.exports = toString;
  }
});

// editor/ui-editor-ui/node_modules/lodash/deburr.js
var require_deburr = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/deburr.js"(exports, module) {
    "use strict";
    var deburrLetter = require_deburrLetter();
    var toString = require_toString();
    var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
    var rsComboMarksRange = "\\u0300-\\u036f";
    var reComboHalfMarksRange = "\\ufe20-\\ufe2f";
    var rsComboSymbolsRange = "\\u20d0-\\u20ff";
    var rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
    var rsCombo = "[" + rsComboRange + "]";
    var reComboMark = RegExp(rsCombo, "g");
    function deburr(string) {
      string = toString(string);
      return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
    }
    module.exports = deburr;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_asciiWords.js
var require_asciiWords = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_asciiWords.js"(exports, module) {
    "use strict";
    var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
    function asciiWords(string) {
      return string.match(reAsciiWord) || [];
    }
    module.exports = asciiWords;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_hasUnicodeWord.js
var require_hasUnicodeWord = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_hasUnicodeWord.js"(exports, module) {
    "use strict";
    var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
    function hasUnicodeWord(string) {
      return reHasUnicodeWord.test(string);
    }
    module.exports = hasUnicodeWord;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_unicodeWords.js
var require_unicodeWords = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_unicodeWords.js"(exports, module) {
    "use strict";
    var rsAstralRange = "\\ud800-\\udfff";
    var rsComboMarksRange = "\\u0300-\\u036f";
    var reComboHalfMarksRange = "\\ufe20-\\ufe2f";
    var rsComboSymbolsRange = "\\u20d0-\\u20ff";
    var rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
    var rsDingbatRange = "\\u2700-\\u27bf";
    var rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff";
    var rsMathOpRange = "\\xac\\xb1\\xd7\\xf7";
    var rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf";
    var rsPunctuationRange = "\\u2000-\\u206f";
    var rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000";
    var rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde";
    var rsVarRange = "\\ufe0e\\ufe0f";
    var rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
    var rsApos = "['\u2019]";
    var rsBreak = "[" + rsBreakRange + "]";
    var rsCombo = "[" + rsComboRange + "]";
    var rsDigits = "\\d+";
    var rsDingbat = "[" + rsDingbatRange + "]";
    var rsLower = "[" + rsLowerRange + "]";
    var rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]";
    var rsFitz = "\\ud83c[\\udffb-\\udfff]";
    var rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")";
    var rsNonAstral = "[^" + rsAstralRange + "]";
    var rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
    var rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
    var rsUpper = "[" + rsUpperRange + "]";
    var rsZWJ = "\\u200d";
    var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")";
    var rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")";
    var rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?";
    var rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?";
    var reOptMod = rsModifier + "?";
    var rsOptVar = "[" + rsVarRange + "]?";
    var rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*";
    var rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])";
    var rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])";
    var rsSeq = rsOptVar + reOptMod + rsOptJoin;
    var rsEmoji = "(?:" + [rsDingbat, rsRegional, rsSurrPair].join("|") + ")" + rsSeq;
    var reUnicodeWord = RegExp([
      rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")",
      rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [rsBreak, rsUpper + rsMiscLower, "$"].join("|") + ")",
      rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
      rsUpper + "+" + rsOptContrUpper,
      rsOrdUpper,
      rsOrdLower,
      rsDigits,
      rsEmoji
    ].join("|"), "g");
    function unicodeWords(string) {
      return string.match(reUnicodeWord) || [];
    }
    module.exports = unicodeWords;
  }
});

// editor/ui-editor-ui/node_modules/lodash/words.js
var require_words = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/words.js"(exports, module) {
    "use strict";
    var asciiWords = require_asciiWords();
    var hasUnicodeWord = require_hasUnicodeWord();
    var toString = require_toString();
    var unicodeWords = require_unicodeWords();
    function words(string, pattern, guard) {
      string = toString(string);
      pattern = guard ? void 0 : pattern;
      if (pattern === void 0) {
        return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
      }
      return string.match(pattern) || [];
    }
    module.exports = words;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_createCompounder.js
var require_createCompounder = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_createCompounder.js"(exports, module) {
    "use strict";
    var arrayReduce = require_arrayReduce();
    var deburr = require_deburr();
    var words = require_words();
    var rsApos = "['\u2019]";
    var reApos = RegExp(rsApos, "g");
    function createCompounder(callback) {
      return function(string) {
        return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
      };
    }
    module.exports = createCompounder;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_baseSlice.js
var require_baseSlice = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_baseSlice.js"(exports, module) {
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

// editor/ui-editor-ui/node_modules/lodash/_castSlice.js
var require_castSlice = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_castSlice.js"(exports, module) {
    "use strict";
    var baseSlice = require_baseSlice();
    function castSlice(array, start, end) {
      var length = array.length;
      end = end === void 0 ? length : end;
      return !start && end >= length ? array : baseSlice(array, start, end);
    }
    module.exports = castSlice;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_hasUnicode.js
var require_hasUnicode = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_hasUnicode.js"(exports, module) {
    "use strict";
    var rsAstralRange = "\\ud800-\\udfff";
    var rsComboMarksRange = "\\u0300-\\u036f";
    var reComboHalfMarksRange = "\\ufe20-\\ufe2f";
    var rsComboSymbolsRange = "\\u20d0-\\u20ff";
    var rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
    var rsVarRange = "\\ufe0e\\ufe0f";
    var rsZWJ = "\\u200d";
    var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
    function hasUnicode(string) {
      return reHasUnicode.test(string);
    }
    module.exports = hasUnicode;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_asciiToArray.js
var require_asciiToArray = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_asciiToArray.js"(exports, module) {
    "use strict";
    function asciiToArray(string) {
      return string.split("");
    }
    module.exports = asciiToArray;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_unicodeToArray.js
var require_unicodeToArray = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_unicodeToArray.js"(exports, module) {
    "use strict";
    var rsAstralRange = "\\ud800-\\udfff";
    var rsComboMarksRange = "\\u0300-\\u036f";
    var reComboHalfMarksRange = "\\ufe20-\\ufe2f";
    var rsComboSymbolsRange = "\\u20d0-\\u20ff";
    var rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange;
    var rsVarRange = "\\ufe0e\\ufe0f";
    var rsAstral = "[" + rsAstralRange + "]";
    var rsCombo = "[" + rsComboRange + "]";
    var rsFitz = "\\ud83c[\\udffb-\\udfff]";
    var rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")";
    var rsNonAstral = "[^" + rsAstralRange + "]";
    var rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}";
    var rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]";
    var rsZWJ = "\\u200d";
    var reOptMod = rsModifier + "?";
    var rsOptVar = "[" + rsVarRange + "]?";
    var rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*";
    var rsSeq = rsOptVar + reOptMod + rsOptJoin;
    var rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
    var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
    function unicodeToArray(string) {
      return string.match(reUnicode) || [];
    }
    module.exports = unicodeToArray;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_stringToArray.js
var require_stringToArray = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_stringToArray.js"(exports, module) {
    "use strict";
    var asciiToArray = require_asciiToArray();
    var hasUnicode = require_hasUnicode();
    var unicodeToArray = require_unicodeToArray();
    function stringToArray(string) {
      return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
    }
    module.exports = stringToArray;
  }
});

// editor/ui-editor-ui/node_modules/lodash/_createCaseFirst.js
var require_createCaseFirst = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_createCaseFirst.js"(exports, module) {
    "use strict";
    var castSlice = require_castSlice();
    var hasUnicode = require_hasUnicode();
    var stringToArray = require_stringToArray();
    var toString = require_toString();
    function createCaseFirst(methodName) {
      return function(string) {
        string = toString(string);
        var strSymbols = hasUnicode(string) ? stringToArray(string) : void 0;
        var chr = strSymbols ? strSymbols[0] : string.charAt(0);
        var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
        return chr[methodName]() + trailing;
      };
    }
    module.exports = createCaseFirst;
  }
});

// editor/ui-editor-ui/node_modules/lodash/upperFirst.js
var require_upperFirst = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/upperFirst.js"(exports, module) {
    "use strict";
    var createCaseFirst = require_createCaseFirst();
    var upperFirst = createCaseFirst("toUpperCase");
    module.exports = upperFirst;
  }
});

// editor/ui-editor-ui/node_modules/lodash/startCase.js
var require_startCase = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/startCase.js"(exports, module) {
    "use strict";
    var createCompounder = require_createCompounder();
    var upperFirst = require_upperFirst();
    var startCase2 = createCompounder(function(result, word, index) {
      return result + (index ? " " : "") + upperFirst(word);
    });
    module.exports = startCase2;
  }
});

// editor/ui-editor-ui/src/app/services/api/editor-copilot-api/schema/zod-jitless-bootstrap.ts
external_exports.config({ jitless: true });

// editor/ui-editor-ui/src/app/services/api/editor-copilot-api/schema/email-template-settings.schema.ts
var import_postcss_value_parser2 = __toESM(require_lib());

// editor/ui-editor-ui/src/app/core/block-operations-api/common/border-radius/types.ts
var EMPTY_BORDER_RADIUS = {
  topLeft: 0,
  topRight: 0,
  bottomRight: 0,
  bottomLeft: 0
};
function normalizeBorderRadiusValue(value) {
  const parsedValue = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsedValue) && parsedValue >= 0 ? parsedValue : void 0;
}

// editor/ui-editor-ui/src/app/core/block-operations-api/buttons/settings/border-radius/get-from-model.ts
var BUTTONS_BORDER_RADIUS_VARIABLES = {
  topLeft: MasterCssVar.BUTTON_BORDER_RADIUS_LT,
  topRight: MasterCssVar.BUTTON_BORDER_RADIUS_RT,
  bottomRight: MasterCssVar.BUTTON_BORDER_RADIUS_RB,
  bottomLeft: MasterCssVar.BUTTON_BORDER_RADIUS_LB
};
function getButtonsBorderRadiusVariable(corner) {
  return BUTTONS_BORDER_RADIUS_VARIABLES[corner];
}
function getDefaultButtonsBorderRadius() {
  return {
    topLeft: normalizeBorderRadiusValue(
      MASTER_CSS_VARIABLES_DEFAULTS[getButtonsBorderRadiusVariable("topLeft")]
    ),
    topRight: normalizeBorderRadiusValue(
      MASTER_CSS_VARIABLES_DEFAULTS[getButtonsBorderRadiusVariable("topRight")]
    ),
    bottomRight: normalizeBorderRadiusValue(
      MASTER_CSS_VARIABLES_DEFAULTS[getButtonsBorderRadiusVariable("bottomRight")]
    ),
    bottomLeft: normalizeBorderRadiusValue(
      MASTER_CSS_VARIABLES_DEFAULTS[getButtonsBorderRadiusVariable("bottomLeft")]
    )
  };
}

// editor/ui-editor-ui/src/app/core/block-operations-api/buttons/settings/fit-container/get-from-model.ts
var BUTTONS_FIT_CONTAINER_VARIABLES = {
  desktop: MasterCssVar.BUTTON_DISPLAY,
  mobile: MasterCssVar.ADAPT_BUTTON_DISPLAY
};
var BUTTON_DISPLAY_DEFAULT = "inline-block";
var BUTTON_DISPLAY_ADJUST = "block";
function normalizeButtonsFitContainerValue(value) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();
    if (normalizedValue === BUTTON_DISPLAY_ADJUST) {
      return true;
    }
    if (normalizedValue === BUTTON_DISPLAY_DEFAULT) {
      return false;
    }
  }
  return void 0;
}
function getButtonsFitContainerVariable(platform) {
  return BUTTONS_FIT_CONTAINER_VARIABLES[platform];
}
function getDefaultButtonsFitContainer(platform) {
  return normalizeButtonsFitContainerValue(
    MASTER_CSS_VARIABLES_DEFAULTS[getButtonsFitContainerVariable(platform)]
  ) ?? false;
}

// editor/ui-editor-ui/src/app/core/block-operations-api/buttons/settings/font-size/get-from-model.ts
var BUTTONS_FONT_SIZE_VARIABLES = {
  desktop: MasterCssVar.BUTTON_FONT_SIZE,
  mobile: MasterCssVar.ADAPT_BUTTON_FONT_SIZE
};
function normalizeButtonsFontSizeValue(value) {
  const parsedValue = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : void 0;
}
function getButtonsFontSizeVariable(platform) {
  return BUTTONS_FONT_SIZE_VARIABLES[platform];
}
function getDefaultButtonsFontSize(platform) {
  return normalizeButtonsFontSizeValue(
    MASTER_CSS_VARIABLES_DEFAULTS[getButtonsFontSizeVariable(platform)]
  );
}

// editor/ui-editor-ui/src/app/core/block-operations-api/common/color/normalizers.ts
function normalizeTransparentAllowedColor(value, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  if (value === void 0 || value === null) {
    return void 0;
  }
  const color = String(value);
  return normalizeCopilotDocumentStateColorValue(color, { allowTransparent: true }, colorMergeTagValues);
}
function normalizeOpaqueColor(value, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  if (value === void 0 || value === null) {
    return void 0;
  }
  const color = String(value);
  return normalizeCopilotDocumentStateColorValue(color, { allowTransparent: false }, colorMergeTagValues);
}

// editor/ui-editor-ui/src/app/core/block-operations-api/buttons/settings/hover-button-styles/fallbacks.ts
function resolveButtonsHoverColorFallback(baseColor, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  return normalizeTransparentAllowedColor(transformColorToHoverColor(baseColor, colorMergeTagValues), colorMergeTagValues) ?? baseColor;
}
function resolveButtonsHoverFontColorFallback(baseFontColor, hoverBackgroundColor, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  return normalizeOpaqueColor(getContrastedHoveredFontColor(baseFontColor, hoverBackgroundColor, colorMergeTagValues), colorMergeTagValues) ?? baseFontColor;
}

// editor/ui-editor-ui/src/app/core/block-operations-api/buttons/settings/outlook-support/get-from-model.ts
function getDefaultButtonsOutlookSupport() {
  return Boolean(MASTER_CSS_VARIABLES_DEFAULTS[MasterCssVar.BUTTONS_OUTLOOK_SUPPORT]);
}

// editor/ui-editor-ui/src/app/core/block-operations-api/buttons/settings/padding/get-from-model.ts
var BUTTONS_PADDING_SIDES = ["top", "right", "bottom", "left"];
var BUTTONS_PADDING_VARIABLES = {
  desktop: {
    top: MasterCssVar.BUTTON_PADDING_TOP,
    right: MasterCssVar.BUTTON_PADDING_RIGHT,
    bottom: MasterCssVar.BUTTON_PADDING_BOTTOM,
    left: MasterCssVar.BUTTON_PADDING_LEFT
  },
  mobile: {
    top: MasterCssVar.ADAPT_BUTTON_PADDING_TOP,
    right: MasterCssVar.ADAPT_BUTTON_PADDING_RIGHT,
    bottom: MasterCssVar.ADAPT_BUTTON_PADDING_BOTTOM,
    left: MasterCssVar.ADAPT_BUTTON_PADDING_LEFT
  }
};
function normalizeButtonsPaddingSideValue(value) {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : void 0;
  }
  if (typeof value !== "string") {
    return void 0;
  }
  const normalizedValue = value.trim();
  if (!normalizedValue) {
    return void 0;
  }
  const parsedValue = Number(normalizedValue);
  return Number.isFinite(parsedValue) ? parsedValue : void 0;
}
function toPaddingValue(values, fallbacks) {
  const normalized = {};
  BUTTONS_PADDING_SIDES.forEach((side) => {
    normalized[side] = normalizeButtonsPaddingSideValue(values[side]) ?? fallbacks[side];
  });
  return normalized;
}
function getDefaultPaddingValueFromVariables(variables) {
  return toPaddingValue({
    top: MASTER_CSS_VARIABLES_DEFAULTS[variables.top],
    right: MASTER_CSS_VARIABLES_DEFAULTS[variables.right],
    bottom: MASTER_CSS_VARIABLES_DEFAULTS[variables.bottom],
    left: MASTER_CSS_VARIABLES_DEFAULTS[variables.left]
  }, {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  });
}
function getButtonsPaddingVariables(platform) {
  return BUTTONS_PADDING_VARIABLES[platform];
}
function getDefaultButtonsPadding(platform) {
  return getDefaultPaddingValueFromVariables(getButtonsPaddingVariables(platform));
}

// editor/ui-editor-ui/src/app/core/block-operations-api/common/background-image/types.ts
function normalizeBackgroundImageStringValue(value) {
  return typeof value === "string" ? value.trim() : "";
}
function normalizeBackgroundImageRepeatValue(value) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value !== "string") {
    return void 0;
  }
  const normalizedValue = value.trim().toLowerCase();
  if (normalizedValue === "repeat" || normalizedValue === "true") {
    return true;
  }
  if (normalizedValue === "no-repeat" || normalizedValue === "false") {
    return false;
  }
  return void 0;
}
function normalizeBackgroundImageSizeValue(value) {
  const normalizedValue = normalizeBackgroundImageStringValue(value);
  return normalizedValue || "auto";
}

// editor/ui-editor-common/tools/utils/ArrayUtils.ts
var ArrayUtils = class {
  static onlyUnique(value, index, self2) {
    return self2.indexOf(value) === index;
  }
  static fromPairs(arr) {
    const res = {};
    arr.forEach(([k, v]) => {
      res[k] = v;
    });
    return res;
  }
};

// editor/ui-editor-ui/node_modules/postcss/lib/postcss.mjs
var import_postcss = __toESM(require_postcss(), 1);
var stringify = import_postcss.default.stringify;
var fromJSON = import_postcss.default.fromJSON;
var plugin = import_postcss.default.plugin;
var parse = import_postcss.default.parse;
var list = import_postcss.default.list;
var document2 = import_postcss.default.document;
var comment = import_postcss.default.comment;
var atRule = import_postcss.default.atRule;
var rule = import_postcss.default.rule;
var decl = import_postcss.default.decl;
var root = import_postcss.default.root;
var CssSyntaxError = import_postcss.default.CssSyntaxError;
var Declaration = import_postcss.default.Declaration;
var Container = import_postcss.default.Container;
var Processor = import_postcss.default.Processor;
var Document = import_postcss.default.Document;
var Comment = import_postcss.default.Comment;
var Warning = import_postcss.default.Warning;
var AtRule = import_postcss.default.AtRule;
var Result = import_postcss.default.Result;
var Input = import_postcss.default.Input;
var Rule = import_postcss.default.Rule;
var Root = import_postcss.default.Root;
var Node = import_postcss.default.Node;

// editor/ui-editor-ui/src/app/core/block-operations-api/common/comment-node.ts
var TOP_FONT_COMMENT_CONTENT = "[if !mso]><!-- ";
var BOTTOM_FONT_COMMENT_CONTENT = "<![endif]";
var commentNode = {
  tag: "",
  type: 8 /* COMMENT_NODE */,
  content: void 0,
  specificContent: void 0,
  config: {},
  children: [],
  path: [],
  attributes: {}
};
function getCommentBlockCRDT(parent) {
  let insideComment = false;
  const res = [];
  parent.getChildren().forEach((child) => {
    if (child.getContent() === TOP_FONT_COMMENT_CONTENT) {
      insideComment = true;
    }
    if (insideComment) {
      res.push(child);
    }
    if (child.getContent() === BOTTOM_FONT_COMMENT_CONTENT) {
      insideComment = false;
    }
  });
  return res;
}

// editor/ui-editor-ui/src/app/tools/debugger/debugger.ts
var STRIPO_DEBUG_MODE = "STRIPO_DEBUG_MODE";
var debug = {};
for (const prop in console) {
  if (console[prop].call) {
    debug[prop] = function(...args) {
      if (isDebugModeEnabled()) {
        const result = console[prop].call(console, ...args);
        if (prop === "error") {
          console.groupCollapsed("Error trace");
          console.trace();
          console.groupEnd();
        }
        return result;
      }
      return void 0;
    };
  }
}
globalThis["breakAfter"] = breakAfter;
globalThis["enableDebugMode"] = function() {
  globalThis.localStorage?.setItem(STRIPO_DEBUG_MODE, "true");
};
globalThis["disableDebugMode"] = function() {
  globalThis.localStorage?.setItem(STRIPO_DEBUG_MODE, "");
};
var defaultLogOptions = {
  color: "DarkBlue" /* DarkBlue */,
  bg: "White" /* White */,
  fontSize: "12px",
  logTrace: true,
  logTime: true,
  collapsed: false,
  logContext: true,
  logSetters: true,
  logMethods: true,
  rethrowError: true
};
var isDebugModeEnabled = () => {
  return (
    /*!environment.production ||*/
    !!globalThis.localStorage?.getItem(STRIPO_DEBUG_MODE)
  );
};
function breakAfter(timeout = 3e3) {
  setTimeout(() => {
    debugger;
  }, timeout);
}

// editor/ui-editor-ui/src/app/tools/utils/fonts/font-family-name.utils.ts
function getPrimaryFontFamilyName(fontFamilyValue) {
  return (fontFamilyValue || "").replace(/["'“”]/g, "").split(",")[0].trim().toLowerCase();
}

// editor/ui-editor-ui/src/app/tools/utils/fonts/font-style.constants.ts
var FONT_STYLE_ATTR = "esd-font-style";
var FONT_STYLE_URL_ATTR = "esd-font-url";
var FONT_STYLE_IMPORT = "import";
var FONT_STYLE_FONT_FACE = "fontFace";
var FONT_METHOD_ENTRY_SEPARATOR = "|";
var FONT_METHOD_KV_SEPARATOR = "::";
var FONT_FAMILY_ATTR = "esd-font-family";
var FONT_FAMILIES_ATTR = "esd-font-families";
function parseFontFamiliesAttr(attr) {
  if (!attr) {
    return [];
  }
  return attr.split(FONT_METHOD_ENTRY_SEPARATOR).map((entry) => {
    const [value, url] = entry.split(FONT_METHOD_KV_SEPARATOR);
    return { value: value?.trim() || "", url: url?.trim() || "" };
  }).filter((entry) => entry.value && entry.url);
}
function serializeFontFamiliesAttr(entries) {
  return entries.filter((entry) => entry.value && entry.url).map((entry) => "".concat(entry.value).concat(FONT_METHOD_KV_SEPARATOR).concat(entry.url)).join(FONT_METHOD_ENTRY_SEPARATOR);
}

// editor/ui-editor-ui/src/app/tools/utils/fonts/defaultWebFontUrls.ts
var defaultWebFontUrls = {
  "Arvo": "https://fonts.googleapis.com/css2?family=Arvo:ital,wght@0,400;0,700;1,400;1,700&display=swap",
  "Lato": "https://fonts.googleapis.com/css2?family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100;1,300;1,400;1,700;1,900&display=swap",
  "Lora": "https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400..700;1,400..700&display=swap",
  "Merriweather": "https://fonts.googleapis.com/css2?family=Merriweather:ital,opsz,wght@0,18..144,300..900;1,18..144,300..900&display=swap",
  "Merriweather Sans": "https://fonts.googleapis.com/css2?family=Merriweather+Sans:ital,wght@0,300..800;1,300..800&display=swap",
  "Noticia Text": "https://fonts.googleapis.com/css2?family=Noticia+Text:ital,wght@0,400;0,700;1,400;1,700&display=swap",
  "Open Sans": "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap",
  "Playfair Display": "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..900;1,400..900&display=swap",
  "Roboto": "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap",
  "Source Sans Pro": "https://fonts.googleapis.com/css?family=Source+Sans+Pro:200,200i,300,300i,400,400i,600,600i,700,700i,900,900i"
};

// editor/ui-editor-ui/src/app/tools/utils/fonts/fontFamilyWeights.ts
var defaultFontFamilyWeights = {
  "Arial": [400, 700],
  "Comic Sans MS": [400, 700],
  "Courier New": [400, 700],
  "Georgia": [400, 700],
  "Helvetica": [200, 300, 400, 700],
  "Lucida Sans Unicode": [400, 700],
  "Tahoma": [400, 700],
  "Times New Roman": [400, 700],
  "Trebuchet MS": [400, 700],
  "Verdana": [400, 700],
  "Arvo": [400, 700],
  "Lato": [100, 300, 400, 700, 900],
  "Lora": [400, 700],
  "Merriweather": [300, 400, 500, 600, 700, 800, 900],
  "Merriweather Sans": [300, 400, 500, 600, 700, 800],
  "Noticia Text": [400, 700],
  "Open Sans": [300, 400, 500, 600, 700, 800],
  "Playfair Display": [400, 500, 600, 700, 800, 900],
  "Roboto": [100, 200, 300, 400, 500, 600, 700, 800, 900],
  "Source Sans Pro": [200, 300, 400, 600, 700, 900],
  "-apple-system": [400, 700]
};

// editor/ui-editor-ui/src/app/tools/utils/UrlUtils.ts
var urlRegex = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=*]{1,256}\.[a-zA-Z0-9()]{1,15}\b(?=[:/?#]|$)(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=*]*)$/;
var imgURLRegex = /^(?:(?:https?:)?\/\/)?(?:[\w-]+\.)*[\w-]+(?::\d+)?(?:\/[^\s]*)?$|^\/[^\s]*$|^data:image\//i;
var INTERNAL_ICON_SRC = /^[a-zA-Z0-9_-]+$/;
var WWW_PREFIX = "www.";
var IPV4_HOST = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
var IPV4_MAPPED_IPV6 = /^::ffff:([\da-f]{1,4}):([\da-f]{1,4})$/;
var INTERNAL_HOST_SUFFIXES = [".localhost", ".local"];
var UrlUtils = class _UrlUtils {
  static isRelativeUrl(url) {
    const startsWithProtocolRegexp = new RegExp("^(?:[a-z]+:)?//", "i");
    return !startsWithProtocolRegexp.test(url);
  }
  static isExternalIconUrl(url) {
    return !(url && INTERNAL_ICON_SRC.test(url));
  }
  static isUrl(url) {
    if (!url) {
      return false;
    }
    if (urlRegex.test(url)) {
      return true;
    }
    if (url.startsWith(WWW_PREFIX)) {
      return urlRegex.test("https://".concat(url));
    }
    return false;
  }
  /** True for an absolute url the browser can parse whose protocol is one of the given ones. */
  static isUrlWithProtocol(url, protocols) {
    try {
      const parsed = new URL(url);
      return protocols.includes(parsed.protocol) && !!parsed.hostname;
    } catch (_error) {
      return false;
    }
  }
  /**
   * Absolute http(s) url check for places that accept any external address, e.g. a data feed source.
   * Unlike `isUrl()` it does not judge the top level domain, which rejects valid long gTLDs.
   */
  static isAbsoluteHttpUrl(url) {
    return _UrlUtils.isUrlWithProtocol(url, ["http:", "https:"]);
  }
  /**
   * True for an address only the user's own machine or LAN can resolve. The services that fetch the
   * urls of the editor — video generation, the link validator, the image proxy — run on their own
   * network, so such a url can never be downloaded: the job fails after a pointless round trip
   * (ED-9198).
   *
   * The judgement is syntactic, on the host alone. A public name that happens to resolve into a
   * private range (`127.0.0.1.nip.io`) passes here — only dns knows that, and the backend answers it
   * with BLOCKED_HOST. A value the browser cannot parse is not "internal" either, it is malformed:
   * that is a separate error the caller reports.
   */
  static isInternalAddressUrl(url) {
    let host;
    try {
      host = new URL(url).hostname.toLowerCase();
    } catch (_error) {
      return false;
    }
    if (!host) {
      return false;
    }
    if (host.startsWith("[")) {
      return _UrlUtils.isInternalIpv6Literal(host.slice(1, -1));
    }
    const name = host.endsWith(".") ? host.slice(0, -1) : host;
    return _UrlUtils.isInternalIpv4(name) || !name.includes(".") || INTERNAL_HOST_SUFFIXES.some((suffix) => name.endsWith(suffix));
  }
  /** RFC 1918 private ranges plus loopback, link-local and "this host". */
  static isInternalIpv4(host) {
    const octets = IPV4_HOST.exec(host);
    if (!octets) {
      return false;
    }
    const first = Number(octets[1]);
    const second = Number(octets[2]);
    return first === 0 || first === 10 || first === 127 || first === 169 && second === 254 || first === 172 && second >= 16 && second <= 31 || first === 192 && second === 168;
  }
  /** `address` is the literal without its brackets, already normalised by the url parser. */
  static isInternalIpv6Literal(address) {
    if (address === "::1" || address === "::") {
      return true;
    }
    const mapped = IPV4_MAPPED_IPV6.exec(address);
    if (mapped) {
      const high = parseInt(mapped[1], 16);
      const low = parseInt(mapped[2], 16);
      return _UrlUtils.isInternalIpv4("".concat(high >> 8, ".").concat(high & 255, ".").concat(low >> 8, ".").concat(low & 255));
    }
    const firstHextet = parseInt(address.split(":")[0], 16);
    return firstHextet >= 64512 && firstHextet <= 65023 || firstHextet >= 65152 && firstHextet <= 65215;
  }
  static isImgUrl(url) {
    return imgURLRegex.test(url);
  }
  static getUrlWithoutQueryParams(url) {
    return url.split("?")[0];
  }
  static extractFileName(url) {
    try {
      const urlObject = new URL(url);
      const pathname = urlObject.pathname;
      const fileName = pathname.substring(pathname.lastIndexOf("/") + 1);
      return fileName;
    } catch (error) {
      console.error("Invalid URL:", error);
      return null;
    }
  }
  static escapeHref(href) {
    if (!href || !href.replace) {
      return href;
    }
    return href.replace(/"/g, "&quot;");
  }
};

// editor/ui-editor-ui/src/app/tools/utils/fonts/FontUtils.pure.ts
function isFontConnectionUrl(value) {
  return /^https?:\/\//i.test(value) && !/[\s\\]/.test(value) && UrlUtils.isAbsoluteHttpUrl(value);
}
function createWebFontLink(fontName) {
  const mappedUrl = defaultWebFontUrls[fontName];
  if (mappedUrl) {
    return mappedUrl;
  }
  const weights = defaultFontFamilyWeights[fontName] || [400, 700];
  const weightsParams = weights.map((weight) => "".concat(weight, ",").concat(weight, "i")).join(",");
  return "https://fonts.googleapis.com/css?family=".concat(fontName.split(" ").join("+"), ":").concat(weightsParams);
}
function clearFontValue(fontValue) {
  if (!fontValue) {
    return fontValue;
  }
  return fontValue.replace(/,\s*/g, ",").replace(/('|"|;)/g, "").toLowerCase();
}
function getUniformFontFamilyValue(value = "") {
  return value.replace('"system-ui"', "BlinkMacSystemFont").replace(/"/g, "'").replace(/, /g, ",");
}

// editor/ui-editor-ui/src/app/tools/utils/fonts/FontFaceUtils.pure.ts
function getFontFaceCssDetails(css) {
  try {
    const root2 = parse(css);
    const faces = root2.nodes.filter((node) => node.type === "atrule" && node.name.toLowerCase() === "font-face");
    if (!faces.length) {
      return { families: [], error: "Expected at least one top-level @font-face rule." };
    }
    if (root2.nodes.some((node) => node.type !== "comment" && !faces.includes(node))) {
      return { families: [], error: "Only top-level @font-face rules and comments are supported." };
    }
    for (const face of faces) {
      if (!face.nodes || face.params || face.nodes.some((node) => node.type !== "decl" && node.type !== "comment")) {
        return { families: [], error: "Expected @font-face declarations without nested rules." };
      }
      for (const declaration of face.nodes) {
        if (declaration.type !== "decl") {
          continue;
        }
        const urls = declaration.value.matchAll(/url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)/gi);
        for (const match of urls) {
          const url = match[1] ?? match[2] ?? match[3];
          if (!url || url.includes("\\") || !url.startsWith("data:") && !isFontConnectionUrl(url)) {
            return { families: [], error: "Font CSS url() must contain an absolute HTTP/HTTPS or data: URL." };
          }
        }
        if (declaration.prop.toLowerCase() === "src" && declaration.value.includes("\\")) {
          return { families: [], error: "Escaped font source URLs are not supported." };
        }
      }
    }
    return { families: [...new Set(faces.map(getDeclaredFontFamily).filter(Boolean))] };
  } catch {
    return { families: [], error: "Invalid font-face CSS syntax." };
  }
}
function getFontImportUrls(css) {
  try {
    const root2 = parse(css);
    const urls = [];
    for (const node of root2.nodes) {
      if (node.type === "comment") {
        continue;
      }
      if (node.type !== "atrule" || node.name.toLowerCase() !== "import" || node.nodes) {
        return void 0;
      }
      const match = node.params.match(/^(?:url\(\s*(?:"([^"]*)"|'([^']*)'|([^)]*?))\s*\)|"([^"]*)"|'([^']*)')$/i);
      if (!match) {
        return void 0;
      }
      urls.push(match.slice(1).find((value) => value !== void 0) ?? "");
    }
    return urls;
  } catch {
    return void 0;
  }
}
var getDeclaredFontFamily = (rule2) => {
  let declared = "";
  rule2.walkDecls((declaration) => {
    if (declaration.prop.toLowerCase() === "font-family") {
      declared = declaration.value;
    }
  });
  return getPrimaryFontFamilyName(declared);
};

// editor/ui-editor-ui/src/app/tools/utils/fonts/FontUtils.node-safe.ts
var ANY_DESCENDANT_SELECTOR = [q.select.descendants().any().end()];
var BODY_SELECTOR = [q.select.descendants().tag("body").end()];
var COMMENT_WRAPPER_COUNT = 2;
var FONT_FAMILY_DECLARATION_REGEXP = /font-family\s*:\s*([^;{}<"]+)/gi;
var FONT_FACE_ATTR_REGEXP = /<font[^>]*\sface\s*=\s*["']([^"']+)["']/gi;
var QUOTE_ENTITY_REGEXP = /&(?:quot|apos|#0*34|#0*39);/gi;
var GENERIC_FONT_FAMILIES = /* @__PURE__ */ new Set([
  "serif",
  "sans-serif",
  "monospace",
  "cursive",
  "fantasy",
  "math",
  "emoji",
  "fangsong",
  "system-ui",
  "ui-serif",
  "ui-sans-serif",
  "ui-monospace",
  "ui-rounded",
  "-apple-system",
  "blinkmacsystemfont",
  "inherit",
  "initial",
  "unset",
  "revert",
  "revert-layer"
]);
var FontUtils = class _FontUtils {
  /** Model-only inventory. A damaged node never hides a healthy sibling connection. */
  static collectHeadFontConnections(api) {
    const resolvedApi = _FontUtils.resolveApi(api);
    const head = resolvedApi.htmlApi.find(void 0, HEAD_SELECTOR);
    if (!head) {
      return [];
    }
    const connections = [];
    const nodes = resolvedApi.htmlApi.findAll(head.getId(), [q.select.descendants().tag(["link", "style"]).end()]);
    for (const node of nodes) {
      try {
        const nodeId = node.getId();
        const stamped = _FontUtils.getStampedFontFamily(node);
        const families = stamped ? [stamped] : [];
        if (node.getTag()?.toLowerCase() === "link") {
          const url = String(node.getAttribute("href") ?? "");
          if (node.getAttribute("rel") === "stylesheet") {
            connections.push({
              nodeId,
              importMethod: "link" /* LINK */,
              url,
              families,
              familyNames: _FontUtils.getKnownFontUrlFamilies(url),
              supported: isFontConnectionUrl(url)
            });
          }
          continue;
        }
        const css = node.getChildren().filter((child) => child.getType() === "text").map((child) => child.getContent() ?? "").join("");
        const marker = node.getAttribute(FONT_STYLE_ATTR);
        if (marker === FONT_STYLE_FONT_FACE || !marker && /@font-face\b/i.test(css)) {
          const url = String(node.getAttribute(FONT_STYLE_URL_ATTR) ?? "") || void 0;
          const details = getFontFaceCssDetails(css);
          connections.push({
            nodeId,
            importMethod: "fontFace" /* FONT_FACE */,
            url,
            css,
            families,
            familyNames: details.families,
            supported: !details.error && (url === void 0 || isFontConnectionUrl(url))
          });
        } else if (marker === FONT_STYLE_IMPORT || !marker && /@import\b/i.test(css)) {
          const urls = getFontImportUrls(css);
          const mapping = _FontUtils.getFontFamiliesMapping(node);
          if (!urls) {
            connections.push({
              nodeId,
              importMethod: "import" /* IMPORT */,
              families: mapping.map((entry) => entry.value),
              familyNames: [],
              supported: false
            });
            continue;
          }
          for (const url of new Set(urls)) {
            connections.push({
              nodeId,
              importMethod: "import" /* IMPORT */,
              url,
              families: mapping.filter((entry) => entry.url === url).map((entry) => _FontUtils.clearFontValue(entry.value)),
              familyNames: _FontUtils.getKnownFontUrlFamilies(url),
              supported: isFontConnectionUrl(url)
            });
          }
        }
      } catch {
      }
    }
    return connections;
  }
  /** Opaque URLs carry no family evidence, even when an arbitrary query parameter resembles a name. */
  static getKnownFontUrlFamilies(url) {
    try {
      const parsed = new URL(url);
      if (parsed.hostname !== "fonts.googleapis.com") {
        return [];
      }
      return [...new Set(parsed.searchParams.getAll("family").flatMap((value) => value.split("|")).map((value) => getPrimaryFontFamilyName(value.split(":")[0])).filter((value) => !!value && !value.includes("\uFFFD")))];
    } catch {
      return [];
    }
  }
  /** Projection keeps full stamped keys; cleanup may conservatively retain other fallback stacks of that primary family. */
  static getHeadConnectionUsedValues(connection, usedValues, includeStampedFallbackVariants = false) {
    return usedValues.filter((value) => connection.families.includes(value) || connection.familyNames.includes(getPrimaryFontFamilyName(value)) || includeStampedFallbackVariants && connection.families.some((family) => getPrimaryFontFamilyName(family) === getPrimaryFontFamilyName(value)));
  }
  static resolveApi(api) {
    if (_FontUtils.isCrdtApi(api)) {
      return {
        htmlApi: api.html(),
        cssApi: api.css(),
        variablesApi: api.variables(),
        actionsApi: api.actions(),
        serializerApi: api.serializer()
      };
    }
    return api;
  }
  static isCrdtApi(api) {
    return typeof api.html === "function";
  }
  static createWebFontLink(fontName) {
    return createWebFontLink(fontName);
  }
  static getFontValuesFromNodeCRDT(node, excludedFonts, api) {
    const { htmlApi } = _FontUtils.resolveApi(api);
    const fontsFamily = [
      node.getStyle("font-family"),
      ...htmlApi.findAll(node.getId(), ANY_DESCENDANT_SELECTOR).map((n) => n.getStyle("font-family"))
    ];
    return fontsFamily.filter((f) => Boolean(f)).filter((f) => !excludedFonts.some((font) => _FontUtils.clearFontValue(font.value) === _FontUtils.clearFontValue(f)));
  }
  static getFontsUsedOnlyInCurrentNodeCRDT(node, excludedFonts, api) {
    const resolvedApi = _FontUtils.resolveApi(api);
    const customFonts = _FontUtils.getFontValuesFromNodeCRDT(node, excludedFonts, resolvedApi).map((font) => font?.trim()).filter(Boolean).filter(ArrayUtils.onlyUnique);
    if (!customFonts.length) {
      return [];
    }
    const body = resolvedApi.htmlApi.find(void 0, BODY_SELECTOR);
    const stringBody = body ? resolvedApi.serializerApi.htmlNode(body)?.toString({}).buffer : void 0;
    const stringNode = resolvedApi.serializerApi.htmlNode(node)?.toString({}).buffer ?? "";
    return customFonts.filter((font) => {
      const fontVariants = font.split(",").map((f) => f.trim().replace(/'/g, "&#39;"));
      return fontVariants.every((variant) => {
        const searchRegExp = new RegExp(variant, "gi");
        return (stringBody?.match(searchRegExp) || []).length === (stringNode.match(searchRegExp) || []).length;
      });
    });
  }
  /**
   * Removes the head connections (link / @font-face style / @import lines) of the given font urls.
   *
   * `fontValues` narrows the removal of @font-face styles to the listed families: since ED-8366
   * one stylesheet can back several <style> nodes, one per font-family, and dropping one font
   * must not take its neighbours down. Omit it to remove every @font-face style of the urls.
   * Styles written before ED-6994 carry no family stamp and are always removed with their url.
   */
  static removeFontActionsCRDT(fontsUrls, api, fontValues) {
    const resolvedApi = _FontUtils.resolveApi(api);
    const head = resolvedApi.htmlApi.find(void 0, HEAD_SELECTOR);
    if (!head || !fontsUrls.length) {
      return [];
    }
    const removedNodeIds = [];
    const contentActions = [];
    const removedFamilies = fontValues && _FontUtils.getClearedFontValues(fontValues);
    const fontLinks = _FontUtils.collectFontLinks(head, resolvedApi);
    fontsUrls.map((url) => fontLinks.find((link) => String(link.getAttribute("href") || "").startsWith(url))).filter((f) => Boolean(f)).forEach((fN) => removedNodeIds.push(fN.getId()));
    const { importStyle, fontFaceStyles } = _FontUtils.getEditorFontStyleNodes(head, resolvedApi);
    fontFaceStyles.filter((node) => fontsUrls.includes(String(node.getAttribute(FONT_STYLE_URL_ATTR) || ""))).filter((node) => {
      const stamped = _FontUtils.getStampedFontFamily(node);
      return !removedFamilies || !stamped || removedFamilies.includes(stamped);
    }).forEach((node) => removedNodeIds.push(node.getId()));
    if (importStyle) {
      const textChild = importStyle.getChildren().find((c) => c.getType() === "text");
      const content = textChild?.getContent() || "";
      const lines = content.split("\n");
      const remaining = lines.filter((line) => !fontsUrls.some((url) => url && line.includes(url)));
      if (remaining.length !== lines.length) {
        if (!remaining.some((line) => line.trim())) {
          removedNodeIds.push(importStyle.getId());
        } else if (textChild) {
          contentActions.push(resolvedApi.actionsApi.createSetHtmlNodeContentAction(textChild.getId(), remaining.join("\n")));
          const mappingEntries = _FontUtils.getFontFamiliesMapping(importStyle);
          const remainingEntries = mappingEntries.filter((entry) => !fontsUrls.includes(entry.url));
          if (remainingEntries.length !== mappingEntries.length) {
            contentActions.push(resolvedApi.actionsApi.createSetHtmlNodeConfigAction(
              importStyle.getId(),
              { fontFamilies: serializeFontFamiliesAttr(remainingEntries) || void 0 }
            ));
          }
        }
      }
    }
    if (!removedNodeIds.length && !contentActions.length) {
      return [];
    }
    const removeFontActions = resolvedApi.actionsApi.createRemoveHtmlNodesAction(removedNodeIds);
    const fontNodesWithWrapperComments = getCommentBlockCRDT(head);
    if (removeFontActions.length && removeFontActions.length === fontNodesWithWrapperComments.length - COMMENT_WRAPPER_COUNT) {
      removeFontActions.push(...resolvedApi.actionsApi.createRemoveHtmlNodesAction([fontNodesWithWrapperComments[0].getId()]));
    }
    return [...removeFontActions, ...contentActions];
  }
  /**
   * Removes only the @font-face <style> nodes stamped with one of `fontValues` for the given urls.
   * Complements {@link removeFontActionsCRDT} for a stylesheet url shared with a still-used sibling
   * family: the url-wide connections (<link>, @import lines, legacy unstamped styles) must survive,
   * while the dropped family's own scoped style still has to go (ED-8366).
   */
  static removeStampedFontFaceActionsCRDT(fontsUrls, api, fontValues) {
    const resolvedApi = _FontUtils.resolveApi(api);
    const head = resolvedApi.htmlApi.find(void 0, HEAD_SELECTOR);
    if (!head || !fontsUrls.length || !fontValues.length) {
      return [];
    }
    const removedFamilies = _FontUtils.getClearedFontValues(fontValues);
    const { fontFaceStyles } = _FontUtils.getEditorFontStyleNodes(head, resolvedApi);
    const removedNodeIds = fontFaceStyles.filter((node) => fontsUrls.includes(String(node.getAttribute(FONT_STYLE_URL_ATTR) || ""))).filter((node) => {
      const stamped = _FontUtils.getStampedFontFamily(node);
      return !!stamped && removedFamilies.includes(stamped);
    }).map((node) => node.getId());
    return removedNodeIds.length ? resolvedApi.actionsApi.createRemoveHtmlNodesAction(removedNodeIds) : [];
  }
  /**
   * The cleared font-family a head connection node was stamped with at insertion time (ED-6994).
   * Primary storage is the node config (invisible in the code editor); the esd-font-family
   * attribute is read as a fallback (e.g. code-editor edits before the config migration ran).
   */
  static getStampedFontFamily(node) {
    if (!node) {
      return "";
    }
    const value = node.getNodeConfigProp("fontFamily") ?? node.getAttribute(FONT_FAMILY_ATTR) ?? "";
    return _FontUtils.clearFontValue(String(value));
  }
  /** The `value::url` mapping of the shared @import style (ED-6994); config first, attribute fallback. */
  static getFontFamiliesMapping(node) {
    if (!node) {
      return [];
    }
    const value = node.getNodeConfigProp("fontFamilies") ?? node.getAttribute(FONT_FAMILIES_ATTR) ?? "";
    return parseFontFamiliesAttr(String(value));
  }
  /**
   * Collects the editor-managed font <style> nodes from the head (ED-8052):
   * the single shared `@import` style and any per-font `@font-face` styles.
   */
  static getEditorFontStyleNodes(head, api) {
    const styles = api.htmlApi.findAll(head.getId(), [q.select.descendants().tag("style").end()]);
    let importStyle;
    const fontFaceStyles = [];
    styles.forEach((node) => {
      const marker = node.getAttribute(FONT_STYLE_ATTR);
      if (marker === FONT_STYLE_IMPORT) {
        importStyle = node;
      } else if (marker === FONT_STYLE_FONT_FACE) {
        fontFaceStyles.push(node);
      }
    });
    return { importStyle, fontFaceStyles };
  }
  /**
   * Identifies and removes editor-managed font <style> connections (@import lines and
   * @font-face blocks) whose font is no longer used anywhere in the document.
   * Companion of {@link removeUnusedFontsCRDT} which only handles <link> nodes.
   */
  static removeUnusedFontStylesCRDT(api, fontsCategories) {
    try {
      const resolvedApi = _FontUtils.resolveApi(api);
      const documentNodes = _FontUtils.getDocumentNodes(resolvedApi);
      if (!documentNodes) {
        return [];
      }
      const { head, body } = documentNodes;
      const { importStyle, fontFaceStyles } = _FontUtils.getEditorFontStyleNodes(head, resolvedApi);
      if (!importStyle && !fontFaceStyles.length) {
        return [];
      }
      const fonts = _FontUtils.prepareFonts(fontsCategories);
      const usageContext = _FontUtils.collectFontUsageContext(body, resolvedApi);
      const unusedUrls = /* @__PURE__ */ new Set();
      const unusedFontFaceFamilies = /* @__PURE__ */ new Set();
      const isEveryFamilyUnused = (families) => families.length > 0 && families.every((fontValue) => !_FontUtils.isFontValueUsed(fontValue, usageContext.usedFontValues));
      const orphansRemovable = _FontUtils.areUsedFontsResolvable(usageContext.usedFontValues, fonts, head, resolvedApi);
      fontFaceStyles.forEach((node) => {
        const url = String(node.getAttribute(FONT_STYLE_URL_ATTR) || "");
        if (!url) {
          return;
        }
        const stamped = _FontUtils.getStampedFontFamily(node);
        const families = stamped ? [stamped] : _FontUtils.getFontFaceStyleFamilies(node, url, fonts);
        if (families.length ? isEveryFamilyUnused(families) : orphansRemovable) {
          unusedUrls.add(url);
          families.forEach((family) => unusedFontFaceFamilies.add(family));
        }
      });
      if (importStyle) {
        const importContent = importStyle.getChildren().find((c) => c.getType() === "text")?.getContent() || "";
        const mappingEntries = _FontUtils.getFontFamiliesMapping(importStyle);
        const mappingValuesByUrl = (url) => mappingEntries.filter((entry) => entry.url === url).map((entry) => entry.value);
        const candidateUrls = [
          ...mappingEntries.map((entry) => entry.url),
          ...fonts.map((font) => font.link).filter((link) => Boolean(link)),
          // Lines the mapping and the config say nothing about — orphan candidates (ED-8856).
          ..._FontUtils.getImportedUrls(importContent)
        ].filter(ArrayUtils.onlyUnique);
        candidateUrls.forEach((url) => {
          if (!importContent.includes(url)) {
            return;
          }
          const families = _FontUtils.getConnectionFontFamilies(mappingValuesByUrl(url), url, fonts);
          if (families.length ? isEveryFamilyUnused(families) : orphansRemovable) {
            unusedUrls.add(url);
          }
        });
      }
      return unusedUrls.size ? _FontUtils.removeFontActionsCRDT(Array.from(unusedUrls), resolvedApi, Array.from(unusedFontFaceFamilies)) : [];
    } catch (error) {
      debug.error("FontUtils.removeUnusedFontStylesCRDT: Error removing unused font styles", error);
      return [];
    }
  }
  static getFontsFrom(fonts, source) {
    return source.filter((webFont) => fonts.find((f) => _FontUtils.clearFontValue(f) === _FontUtils.clearFontValue(webFont.value)));
  }
  static getUsedFont(fontValues, head) {
    const links = head?.findAll?.(LINK_TAG_SELECTOR) ?? [];
    const regexList = _FontUtils.getFontFamilyUrlMatchers(fontValues);
    const targetValues = _FontUtils.getClearedFontValues(fontValues);
    return links.filter((link) => {
      const href = String(link.getAttribute("href") || "");
      return regexList.some((rgx) => rgx.test(href)) || targetValues.includes(_FontUtils.getStampedFontFamily(link));
    }).map((link) => link.getAttribute("href"));
  }
  /**
   * Method-agnostic counterpart of {@link getUsedFont}: returns the head connection
   * URLs for the given font values across all import methods (ED-8052) —
   * `<link>` (matched by `href`), `@import` (shared style lines matched by the
   * `family=` URL param) and `@font-face` (per-font style matched by the
   * `font-family` declared inside the @font-face CSS → its `esd-font-url`).
   *
   * Used by deletion / font-family-change cleanup so editor-managed
   * `@import`/`@font-face` connections are removed too, including cross-account
   * fonts unknown to the destination config.
   */
  static getUsedFontUrls(fontValues, head, api) {
    if (!head) {
      return [];
    }
    const resolvedApi = _FontUtils.resolveApi(api);
    const urls = new Set(_FontUtils.getUsedFont(fontValues, head));
    const familyUrlMatchers = _FontUtils.getFontFamilyUrlMatchers(fontValues);
    const targetNames = _FontUtils.getFontFamilyNames(fontValues);
    const targetValues = _FontUtils.getClearedFontValues(fontValues);
    const { importStyle, fontFaceStyles } = _FontUtils.getEditorFontStyleNodes(head, resolvedApi);
    fontFaceStyles.forEach((node) => {
      const url = String(node.getAttribute(FONT_STYLE_URL_ATTR) || "");
      if (!url) {
        return;
      }
      const stampedFamily = _FontUtils.getStampedFontFamily(node);
      if (stampedFamily && targetValues.includes(stampedFamily)) {
        urls.add(url);
        return;
      }
      const css = node.getChildren().find((c) => c.getType() === "text")?.getContent() || "";
      if (_FontUtils.getFontFaceFamilies(css).some((family) => targetNames.includes(family))) {
        urls.add(url);
      }
    });
    if (importStyle) {
      _FontUtils.getFontFamiliesMapping(importStyle).filter((entry) => targetValues.includes(_FontUtils.clearFontValue(entry.value))).forEach((entry) => urls.add(entry.url));
      const content = importStyle.getChildren().find((c) => c.getType() === "text")?.getContent() || "";
      content.split("\n").forEach((line) => {
        if (!familyUrlMatchers.some((rgx) => rgx.test(line))) {
          return;
        }
        const url = line.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/i)?.[1];
        if (url) {
          urls.add(url);
        }
      });
    }
    return Array.from(urls);
  }
  /** First (cleared, lowercased) font-family name for each value, e.g. `Arvo, serif` → `arvo`. */
  static getFontFamilyNames(fontValues) {
    return fontValues.map(getPrimaryFontFamilyName).filter(Boolean);
  }
  /** Full cleared value for each font value, e.g. `'Arvo', serif` → `arvo,serif`. */
  static getClearedFontValues(fontValues) {
    return fontValues.map((v) => _FontUtils.clearFontValue(v)).filter(Boolean);
  }
  /** Regexes matching the `family=<name>` URL param of a connection link for each font value. */
  static getFontFamilyUrlMatchers(fontValues) {
    return fontValues.map((v) => v.replace(/["'“”]/g, "").split(",")[0].trim()).filter(Boolean).map((name) => new RegExp("family=".concat(name.replace(/\s+/g, "\\+?"), "(?:[+:&]|$)"), "i"));
  }
  /**
   * The font-family values an unstamped @font-face <style> serves: the fonts-config entries on its
   * url, or — failing that — the families its own @font-face CSS declares. The latter resolves
   * pre-stamp nodes whose url is unknown to the config, so they no longer live forever (ED-8856).
   */
  static getFontFaceStyleFamilies(node, url, fonts) {
    const configFamilies = _FontUtils.getConnectionFontFamilies([], url, fonts);
    if (configFamilies.length) {
      return configFamilies;
    }
    const css = node.getChildren().find((c) => c.getType() === "text")?.getContent() || "";
    return _FontUtils.getFontFaceFamilies(css).filter(ArrayUtils.onlyUnique);
  }
  /** Every url referenced by the `@import url(...)` lines of the shared import style. */
  static getImportedUrls(importContent) {
    return Array.from(importContent.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/gi)).map((match) => match[1]?.trim()).filter(Boolean);
  }
  /** Extracts the (cleared, lowercased) `font-family` names declared inside @font-face CSS. */
  static getFontFaceFamilies(css) {
    return (css.match(/font-family\s*:\s*([^;}]+)/gi) || []).map((decl2) => decl2.replace(/font-family\s*:\s*/i, "").replace(/["'“”]/g, "").trim().toLowerCase()).filter(Boolean);
  }
  /**
   * Collects font link nodes from the document header
   * @param head Header node
   * @param api Font utils scoped API
   * @returns Array of font link nodes
   */
  static collectFontLinks(head, api) {
    return api.htmlApi.findAll(head.getId(), [q.select.descendants().tag("link").end()]).filter((link) => {
      const rel = link.getAttribute("rel");
      const href = link.getAttribute("href");
      return rel === "stylesheet" && href;
    });
  }
  /**
   * Prepares font entries with their links
   * @param fontsCategories Font categories to process
   * @returns Array of font entries with links
   */
  static prepareFonts(fontsCategories) {
    return fontsCategories?.flatMap((c) => c.entries)?.map((font) => {
      if (!font.link) {
        font.link = _FontUtils.createWebFontLink(font.name);
      }
      return font;
    }) || [];
  }
  /**
   * Checks whether a head connection's font-family is used by any of the document's
   * font-family declarations.
   *
   * @param fontValue Cleared font value carried by the connection
   * @param usedFontValues Cleared font values declared in the document ({@link collectUsedFontValues})
   */
  static isFontValueUsed(fontValue, usedFontValues) {
    return !!fontValue && usedFontValues.some((declared) => declared.includes(fontValue));
  }
  /**
   * The font-family values a document actually declares: `font-family` declarations of the body
   * (inline styles and `<style>` blocks), the legacy `<font face>` tag, the custom CSS rules and
   * the master font variables — all cleared.
   *
   * Deliberately narrower than a raw substring scan of the serialized body (ED-8856): the font
   * name may occur in the letter's text or inside a service `esd-*` attribute without the font
   * being used, which used to keep its head connection alive forever.
   */
  static collectUsedFontValues(api) {
    const resolvedApi = _FontUtils.resolveApi(api);
    const body = resolvedApi.htmlApi.find(void 0, BODY_SELECTOR);
    return body ? _FontUtils.collectFontUsageContext(body, resolvedApi).usedFontValues : [];
  }
  /**
   * Same rule as {@link collectUsedFontValues} for callers that read the document themselves:
   * the body's `font-family` declarations plus the given raw values (custom CSS rules, master
   * font variables), all cleared and deduplicated.
   */
  static toUsedFontValues(bodyString, declaredValues = []) {
    return [
      ..._FontUtils.collectDeclaredFontValues(bodyString),
      ...declaredValues
    ].map((value) => {
      const rawValue = String(value ?? "").trim();
      try {
        const declaration = parse("font-family: ".concat(rawValue)).first;
        return _FontUtils.clearFontValue(declaration?.type === "decl" ? declaration.value : rawValue);
      } catch {
        return _FontUtils.clearFontValue(rawValue);
      }
    }).filter(Boolean).filter(ArrayUtils.onlyUnique);
  }
  /** Extracts the `font-family` declarations (and legacy `<font face>` values) of a serialized body. */
  static collectDeclaredFontValues(bodyString) {
    if (!bodyString) {
      return [];
    }
    const html2 = bodyString.replace(QUOTE_ENTITY_REGEXP, "");
    return [
      ...Array.from(html2.matchAll(FONT_FAMILY_DECLARATION_REGEXP)),
      ...Array.from(html2.matchAll(FONT_FACE_ATTR_REGEXP))
    ].map((match) => (match[1] || "").trim());
  }
  /**
   * Creates removal actions for unused font links
   * @param unusedLinks Array of unused link nodes
   * @param allLinks Array of all link nodes
   * @param head Header node
   * @param api Font utils scoped API
   * @returns Array of VersionedAction for removal
   */
  static createRemovalActions(unusedLinks, allLinks, head, api) {
    const removeFontActions = [];
    for (const linkNode of unusedLinks) {
      removeFontActions.push(...api.actionsApi.createRemoveHtmlNodesAction([linkNode.getId()]));
    }
    if (removeFontActions.length && removeFontActions.length === allLinks.length) {
      const fontNodesWithWrapperComments = getCommentBlockCRDT(head);
      if (fontNodesWithWrapperComments.length > COMMENT_WRAPPER_COUNT) {
        const wrapperCommentId = fontNodesWithWrapperComments[0].getId();
        removeFontActions.push(...api.actionsApi.createRemoveHtmlNodesAction([wrapperCommentId]));
      }
    }
    return removeFontActions;
  }
  /**
   * Gets document content for font usage analysis
   * @param api Font utils scoped API
   * @returns Object with head and body nodes, or null if not found
   */
  static getDocumentNodes(api) {
    const head = api.htmlApi.find(void 0, HEAD_SELECTOR);
    const body = api.htmlApi.find(void 0, BODY_SELECTOR);
    if (!head || !body) {
      return null;
    }
    return { head, body };
  }
  /**
   * Collects font-related data from the document
   * @param body Body node
   * @param api Font utils scoped API
   * @returns Font usage context data
   */
  static collectFontUsageContext(body, api) {
    const bodyString = api.serializerApi.htmlNode(body)?.toString({}).buffer || "";
    const fontVariables = [
      api.variablesApi.getVariable(MasterCssVar.BUTTON_FONT),
      api.variablesApi.getVariable(MasterCssVar.TITLE_FONT),
      api.variablesApi.getVariable(MasterCssVar.FONT)
    ].filter(Boolean).map(String);
    const customCssNodes = api.cssApi.findAll?.(void 0, [
      q.select.descendants().hasProperty("font-family").end()
    ]) || [];
    return {
      usedFontValues: _FontUtils.toUsedFontValues(bodyString, [
        ...fontVariables,
        ...customCssNodes.map((node) => String(node.getAttributeValue?.() ?? ""))
      ])
    };
  }
  /**
   * Identifies unused font links in the document
   * @param linkNodes Font link nodes to check
   * @param fonts Available fonts with their metadata
   * @param usedFontValues Font values declared in the document
   * @param head Header node
   * @param api Font utils scoped API
   * @returns Array of unused link nodes
   */
  static identifyUnusedFontLinks(linkNodes, fonts, usedFontValues, head, api) {
    const unusedLinks = [];
    const opaqueLinks = [];
    for (const linkNode of linkNodes) {
      const linkHref = String(linkNode.getAttribute("href") || "");
      if (!linkHref) {
        continue;
      }
      const linkFamilies = _FontUtils.getConnectionFontFamilies(_FontUtils.getStampedFontFamily(linkNode), linkHref, fonts);
      if (!linkFamilies.length) {
        opaqueLinks.push(linkNode);
        continue;
      }
      if (linkFamilies.every((fontValue) => !_FontUtils.isFontValueUsed(fontValue, usedFontValues))) {
        unusedLinks.push(linkNode);
      }
    }
    unusedLinks.push(..._FontUtils.identifyOrphanConnections(opaqueLinks, usedFontValues, fonts, head, api));
    return unusedLinks;
  }
  /**
   * Head connections whose font-family cannot be resolved at all — no stamp, no fonts-config entry
   * with this url (opaque `use.typekit.net/*.css` kits, direct `.woff` urls, bare domains). Such a
   * connection used to be immortal, which is how a letter ends up with dozens of dead font links
   * while a single font is in use (ED-8856).
   *
   * Removing them is gated twice, because an unresolvable connection carries no proof of its own:
   * - {@link areUsedFontsResolvable} — while any used font-family is unaccounted for, the letter may
   *   well be relying on one of these connections, so none of them is touched;
   * - the node must sit inside the editor-managed MSO font region, so `<link>`s written by the
   *   template or by hand in the code editor are left alone.
   */
  static identifyOrphanConnections(opaqueLinks, usedFontValues, fonts, head, api) {
    if (!opaqueLinks.length || !_FontUtils.areUsedFontsResolvable(usedFontValues, fonts, head, api)) {
      return [];
    }
    const editorRegionIds = new Set(getCommentBlockCRDT(head).map((node) => node.getId()));
    return opaqueLinks.filter((link) => editorRegionIds.has(link.getId()));
  }
  /**
   * True when every font-family the document declares is accounted for: it is a generic/keyword
   * family, a configured font (standard fonts need no connection at all), or a family some
   * resolvable head connection is stamped with. Compared by primary family name so a differing
   * fallback stack does not hide the match.
   */
  static areUsedFontsResolvable(usedFontValues, fonts, head, api) {
    const resolvedApi = _FontUtils.resolveApi(api);
    const knownNames = new Set([
      ...fonts.map((font) => font.value),
      ..._FontUtils.collectHeadConnectionFamilies(head, resolvedApi),
      ..._FontUtils.collectHeadFontConnections(resolvedApi).flatMap((connection) => connection.familyNames)
    ].map(getPrimaryFontFamilyName).filter(Boolean));
    return usedFontValues.map(getPrimaryFontFamilyName).filter(Boolean).every((name) => GENERIC_FONT_FAMILIES.has(name) || knownNames.has(name));
  }
  /** Every font-family the head connections are stamped with (link / @font-face stamps, @import mapping). */
  static collectHeadConnectionFamilies(head, api) {
    const families = api.htmlApi.findAll(head.getId(), [q.select.descendants().tag("link").end()]).map((node) => _FontUtils.getStampedFontFamily(node));
    const { importStyle, fontFaceStyles } = _FontUtils.getEditorFontStyleNodes(head, api);
    fontFaceStyles.forEach((node) => families.push(_FontUtils.getStampedFontFamily(node)));
    if (importStyle) {
      _FontUtils.getFontFamiliesMapping(importStyle).forEach((entry) => families.push(_FontUtils.clearFontValue(entry.value)));
    }
    return families.filter(Boolean).filter(ArrayUtils.onlyUnique);
  }
  /**
   * All cleared font-family values a head connection url serves, resolved from the head nodes
   * (link/fontFace stamps, import mapping) and every fonts-config entry with this url (ED-6994).
   * A single url can carry several families (e.g. one Google Fonts link with two family params).
   */
  static getHeadConnectionFamilies(url, head, fonts, api) {
    if (!head) {
      return _FontUtils.getConnectionFontFamilies([], url, fonts);
    }
    const resolvedApi = _FontUtils.resolveApi(api);
    const stamps = [];
    _FontUtils.collectFontLinks(head, resolvedApi).filter((link) => String(link.getAttribute("href") || "").startsWith(url)).forEach((link) => stamps.push(_FontUtils.getStampedFontFamily(link)));
    const { importStyle, fontFaceStyles } = _FontUtils.getEditorFontStyleNodes(head, resolvedApi);
    fontFaceStyles.filter((node) => String(node.getAttribute(FONT_STYLE_URL_ATTR) || "") === url).forEach((node) => stamps.push(_FontUtils.getStampedFontFamily(node)));
    if (importStyle) {
      _FontUtils.getFontFamiliesMapping(importStyle).filter((entry) => entry.url === url).forEach((entry) => stamps.push(entry.value));
    }
    return _FontUtils.getConnectionFontFamilies(stamps, url, fonts);
  }
  /** All cleared font-family values a head connection url may serve: the stamped ones + every config entry with this url. */
  static getConnectionFontFamilies(stampedFamilies, url, fonts) {
    const stamped = (Array.isArray(stampedFamilies) ? stampedFamilies : [stampedFamilies]).map((v) => _FontUtils.clearFontValue(v));
    const configFamilies = fonts.filter((f) => f.link === url).map((f) => _FontUtils.clearFontValue(f.value));
    return [...stamped, ...configFamilies].filter(Boolean).filter(ArrayUtils.onlyUnique);
  }
  /**
   * Removes unused font links from the document header
   * @param api Font utils scoped API or CRDT API
   * @param fontsCategories Optional font categories to check against
   * @returns Array of VersionedAction to remove unused font links
   */
  static removeUnusedFontsCRDT(api, fontsCategories) {
    try {
      const resolvedApi = _FontUtils.resolveApi(api);
      const documentNodes = _FontUtils.getDocumentNodes(resolvedApi);
      if (!documentNodes) {
        return [];
      }
      const { head, body } = documentNodes;
      const linkNodes = _FontUtils.collectFontLinks(head, resolvedApi);
      if (!linkNodes.length) {
        return _FontUtils.removeUnusedFontStylesCRDT(resolvedApi, fontsCategories);
      }
      const fonts = _FontUtils.prepareFonts(fontsCategories);
      const usageContext = _FontUtils.collectFontUsageContext(body, resolvedApi);
      const unusedLinks = _FontUtils.identifyUnusedFontLinks(linkNodes, fonts, usageContext.usedFontValues, head, resolvedApi);
      return [
        ..._FontUtils.createRemovalActions(unusedLinks, linkNodes, head, resolvedApi),
        ..._FontUtils.removeUnusedFontStylesCRDT(resolvedApi, fontsCategories)
      ];
    } catch (error) {
      debug.error("FontUtils.removeUnusedFontsCRDT: Error removing unused fonts", error);
      return [];
    }
  }
  static clearFontValue(fontValue) {
    return clearFontValue(fontValue);
  }
  static getUniformFontFamilyValue(value = "") {
    return getUniformFontFamilyValue(value);
  }
};

// editor/ui-editor-ui/src/app/core/block-operations-api/common/font-family.ts
function getDefaultFontFamily(variable) {
  return FontUtils.getUniformFontFamilyValue(
    String(MASTER_CSS_VARIABLES_DEFAULTS[variable] ?? "")
  ) || "";
}

// editor/ui-editor-ui/src/app/constants/image-utils.const.ts
var DEFAULT_IMAGE_PREVIEW_SVG = "assets/icons/preview/image.svg";
var IMAGE_MAX_ALT_TEXT_LENGTH = 500;

// editor/ui-editor-ui/src/app/configs/predefined-permissions.ts
function withUrlValidationPermission(permissions, read, write) {
  return {
    ...permissions,
    urlValidation: SGConnectToModelInfoPermissions.create({ read, write })
  };
}
var adminPermissions = withUrlValidationPermission(SGGetConnectToModelInfoPermissions.create({
  appearance: {
    read: true,
    write: true
  },
  content: {
    read: true,
    write: true,
    textOnly: false
  },
  modules: {
    read: true,
    write: true
  },
  codeEditor: {
    read: true,
    write: true
  },
  versionHistory: {
    read: true,
    write: true
  },
  templateThemes: {
    read: true,
    write: true
  },
  manageOwnComments: {
    read: true,
    write: true
  },
  manageAllComments: {
    read: true,
    write: true
  }
}), true, true);
var writerPermissions = SGGetConnectToModelInfoPermissions.create({
  appearance: {
    read: false,
    write: false
  },
  content: {
    read: true,
    write: true
  },
  modules: {
    read: true,
    write: false
  },
  codeEditor: {
    read: true,
    write: true
  },
  versionHistory: {
    read: true,
    write: true
  }
});
var proofreaderPermissions = SGGetConnectToModelInfoPermissions.create({
  appearance: {
    read: false,
    write: false
  },
  content: {
    read: true,
    write: true,
    textOnly: true
  },
  modules: {
    read: true,
    write: false
  },
  codeEditor: {
    read: false,
    write: false
  },
  versionHistory: {
    read: true,
    write: true
  }
});
var viewerPermissions = SGGetConnectToModelInfoPermissions.create({
  appearance: {
    read: false,
    write: false
  },
  content: {
    read: true,
    write: false
  },
  modules: {
    read: false,
    write: false
  },
  codeEditor: {
    read: false,
    write: false
  },
  versionHistory: {
    read: true,
    write: false
  }
});
var disabledPermissions = SGGetConnectToModelInfoPermissions.create({
  appearance: {
    read: false,
    write: false
  },
  content: {
    read: true,
    write: false
  },
  modules: {
    read: false,
    write: false
  },
  codeEditor: {
    read: false,
    write: false
  },
  versionHistory: {
    read: false,
    write: false
  },
  manageOwnComments: {
    read: true,
    write: false
  },
  manageAllComments: {
    read: true,
    write: false
  }
});

// editor/ui-editor-ui/src/environments/environment.ts
var environment = {
  production: false,
  elements: false,
  cdnAssetsPath: "https://odhvxu.stripocdn.email/content/assets/",
  editorMode: "demo" /* DEMO */,
  metadata: {
    // this is default guid for the demo mode
    // replace it with your own guid if required
    guid: "63a6c30a-466e-40e0-ae34-1be5deed5071"
  },
  html,
  cooperativeMode: false,
  // make request relative to the local domain
  // and in development mode it will be proxied to the dev-account.stripo.email
  coeditingBasePath: "/bapi/coediting",
  coeditingWsUrl: "wss://dev-account.stripo.email/bapi/coediting/ws/coediting",
  probeWsUrl: "wss://dev-account.stripo.email/bapi/coediting/ws/probe",
  apiBaseUrl: "",
  permissions: adminPermissions,
  ownHeader: true,
  proxyUrl: "https://dev-account.stripo.email/bapi/documents/v1/proxy"
};

// editor/ui-editor-ui/src/app/tools/assets/asset-path.provider.ts
var DEFAULT_IMAGE_PATH = "assets/previews/default-img.png";
var AssetPathProvider = class _AssetPathProvider {
  static {
    this.baseEditorScriptPath = void 0;
  }
  static createAbsolutePath(relativePath, getEditorScriptSrc = _AssetPathProvider.getEditorScriptSrc) {
    if (typeof window === "undefined" || typeof document === "undefined") {
      return relativePath;
    }
    if (environment.testMode) {
      return "/".concat(relativePath);
    }
    if (!_AssetPathProvider.baseEditorScriptPath) {
      const scriptSrc = getEditorScriptSrc() || "";
      let scriptNameIndex;
      if (scriptSrc.indexOf("UIEditor.js") !== -1) {
        scriptNameIndex = scriptSrc.indexOf("UIEditor.js");
      } else {
        scriptNameIndex = scriptSrc.indexOf("main.js");
      }
      _AssetPathProvider.baseEditorScriptPath = scriptSrc ? scriptSrc.substring(0, scriptNameIndex - 1) : "";
    }
    return !_AssetPathProvider.baseEditorScriptPath.length ? "".concat(window.location.href).concat(relativePath) : "".concat(_AssetPathProvider.baseEditorScriptPath).concat(relativePath.startsWith("/") ? "" : "/").concat(relativePath);
  }
  static getEditorScriptSrc() {
    if (typeof document === "undefined") {
      return void 0;
    }
    const stripoScript = document.getElementById("UiEditorScript") || document.currentScript;
    return stripoScript?.src;
  }
  static getOrigin(url) {
    if (!url) {
      return void 0;
    }
    try {
      if (typeof window === "undefined") {
        return new URL(url).origin;
      }
      return new URL(url, window.location.href).origin;
    } catch {
      return void 0;
    }
  }
  static getAssetOrigin(relativePath) {
    return this.getOrigin(this.createAbsolutePath(relativePath));
  }
  static getDefaultImagePath() {
    return this.createAbsolutePath(DEFAULT_IMAGE_PATH);
  }
};

// editor/ui-editor-ui/src/app/constants/form.constants.ts
var DEFAULT_LETTER_SPACING = 0;
var MAX_QUANTITY_CONTAINERS = 11;
var DEFAULT_CAROUSEL_SLIDE_PREVIEW_DIMENSIONS = {
  width: 60,
  height: 40,
  src: AssetPathProvider.createAbsolutePath(DEFAULT_IMAGE_PREVIEW_SVG)
};
var DEFAULT_CAROUSEL_SLIDE_OPTIONS = {
  width: 20,
  height: 20,
  layout: "flex-item",
  src: AssetPathProvider.createAbsolutePath(DEFAULT_IMAGE_PREVIEW_SVG)
};

// editor/ui-editor-ui/src/app/core/block-operations-api/common/letter-spacing/types.ts
var DEFAULT_UNIT = "px";
function getDefaultLetterSpacingValue() {
  return {
    value: DEFAULT_LETTER_SPACING,
    unit: DEFAULT_UNIT
  };
}

// editor/ui-editor-ui/src/app/core/block-operations-api/common/text-style/types.ts
function normalizeTextStyleValue(value) {
  return {
    bold: value?.bold === true,
    italic: value?.italic === true
  };
}
function getDefaultTextStyleValue() {
  return normalizeTextStyleValue(void 0);
}

// editor/ui-editor-ui/src/app/core/block-operations-api/common/text-transform.ts
var BUTTONS_TEXT_TRANSFORM_VALUES = [
  "none",
  "uppercase",
  "capitalize",
  "lowercase"
];
var DEFAULT_BUTTONS_TEXT_TRANSFORM = "none";

// editor/ui-editor-ui/src/app/core/block-operations-api/general/settings/hide-image-download-icons/get-from-model.ts
function getDefaultGeneralHideImageDownloadIcons() {
  return true;
}

// editor/ui-editor-ui/src/app/core/block-operations-api/headings/settings/font-size/get-from-model.ts
var HEADINGS_FONT_SIZE_VARIABLES = {
  h1: {
    desktop: MasterCssVar.H1_FONT_SIZE,
    mobile: MasterCssVar.ADAPT_H1_FONT_SIZE
  },
  h2: {
    desktop: MasterCssVar.H2_FONT_SIZE,
    mobile: MasterCssVar.ADAPT_H2_FONT_SIZE
  },
  h3: {
    desktop: MasterCssVar.H3_FONT_SIZE,
    mobile: MasterCssVar.ADAPT_H3_FONT_SIZE
  },
  h4: {
    desktop: MasterCssVar.H4_FONT_SIZE,
    mobile: MasterCssVar.ADAPT_H4_FONT_SIZE
  },
  h5: {
    desktop: MasterCssVar.H5_FONT_SIZE,
    mobile: MasterCssVar.ADAPT_H5_FONT_SIZE
  },
  h6: {
    desktop: MasterCssVar.H6_FONT_SIZE,
    mobile: MasterCssVar.ADAPT_H6_FONT_SIZE
  }
};
function normalizeHeadingsFontSizeValue(value) {
  const parsedValue = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : void 0;
}
function getHeadingsFontSizeVariable(heading, platform) {
  return HEADINGS_FONT_SIZE_VARIABLES[heading][platform];
}
function getDefaultHeadingsFontSize(heading, platform) {
  return normalizeHeadingsFontSizeValue(
    MASTER_CSS_VARIABLES_DEFAULTS[getHeadingsFontSizeVariable(heading, platform)]
  );
}

// editor/ui-editor-ui/src/app/core/block-operations-api/common/line-height/types.ts
function normalizeLineHeightValue(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value > 5 ? value / 100 : value;
  }
  if (typeof value !== "string") {
    return void 0;
  }
  const trimmed = value.trim();
  if (!trimmed) {
    return void 0;
  }
  const numericValue = trimmed.endsWith("%") ? Number(trimmed.slice(0, -1)) : Number(trimmed);
  if (!Number.isFinite(numericValue)) {
    return void 0;
  }
  return numericValue > 5 ? numericValue / 100 : numericValue;
}

// editor/ui-editor-ui/src/app/core/block-operations-api/headings/settings/line-height/get-from-model.ts
var HEADINGS_LINE_HEIGHT_VARIABLES = {
  h1: {
    desktop: MasterCssVar.H1_LINE_HEIGHT,
    mobile: MasterCssVar.ADAPT_H1_LINE_HEIGHT
  },
  h2: {
    desktop: MasterCssVar.H2_LINE_HEIGHT,
    mobile: MasterCssVar.ADAPT_H2_LINE_HEIGHT
  },
  h3: {
    desktop: MasterCssVar.H3_LINE_HEIGHT,
    mobile: MasterCssVar.ADAPT_H3_LINE_HEIGHT
  },
  h4: {
    desktop: MasterCssVar.H4_LINE_HEIGHT,
    mobile: MasterCssVar.ADAPT_H4_LINE_HEIGHT
  },
  h5: {
    desktop: MasterCssVar.H5_LINE_HEIGHT,
    mobile: MasterCssVar.ADAPT_H5_LINE_HEIGHT
  },
  h6: {
    desktop: MasterCssVar.H6_LINE_HEIGHT,
    mobile: MasterCssVar.ADAPT_H6_LINE_HEIGHT
  }
};
var normalizeHeadingsLineHeightValue = normalizeLineHeightValue;
function getHeadingsLineHeightVariable(heading, platform) {
  return HEADINGS_LINE_HEIGHT_VARIABLES[heading][platform];
}
function getDefaultHeadingsLineHeight(heading, platform) {
  return normalizeHeadingsLineHeightValue(
    MASTER_CSS_VARIABLES_DEFAULTS[getHeadingsLineHeightVariable(heading, platform)]
  ) ?? 1.2;
}

// editor/ui-editor-ui/src/app/core/block-operations-api/headings/settings/text-align/types.ts
var DEFAULT_HEADINGS_TEXT_ALIGN_VALUE = {
  mobile: "left" /* left */
};
function getDefaultHeadingsTextAlignValue() {
  return {
    ...DEFAULT_HEADINGS_TEXT_ALIGN_VALUE
  };
}

// editor/ui-editor-ui/src/app/core/block-operations-api/headings/settings/text-style/types.ts
var HEADING_TEXT_STYLE_VARIABLES = {
  h1: { italic: MasterCssVar.H1_FONT_STYLE },
  h2: { italic: MasterCssVar.H2_FONT_STYLE },
  h3: { italic: MasterCssVar.H3_FONT_STYLE },
  h4: { italic: MasterCssVar.H4_FONT_STYLE },
  h5: { italic: MasterCssVar.H5_FONT_STYLE },
  h6: { italic: MasterCssVar.H6_FONT_STYLE }
};
function getDefaultHeadingsTextStyleValue() {
  return { italic: false };
}

// editor/ui-editor-ui/src/app/core/block-operations-api/stripes/settings/font-size/get-from-model.ts
var STRIPES_SECTION_FONT_SIZE_VARIABLES = {
  header: {
    desktop: MasterCssVar.HEADER_FONT_SIZE,
    mobile: MasterCssVar.ADAPT_HEADER_FONT_SIZE
  },
  content: {
    desktop: MasterCssVar.CONTENT_FONT_SIZE,
    mobile: MasterCssVar.ADAPT_FONT_SIZE
  },
  footer: {
    desktop: MasterCssVar.FOOTER_FONT_SIZE,
    mobile: MasterCssVar.ADAPT_FOOTER_FONT_SIZE
  },
  infoArea: {
    desktop: MasterCssVar.INFO_FONT_SIZE,
    mobile: MasterCssVar.ADAPT_INFO_FONT_SIZE
  }
};
function normalizeStripesSectionFontSizeValue(value) {
  const parsedValue = Number.parseInt(String(value ?? ""), 10);
  return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : void 0;
}
function getStripesSectionFontSizeVariable(section, platform) {
  return STRIPES_SECTION_FONT_SIZE_VARIABLES[section][platform];
}
function getDefaultStripesSectionFontSize(section, platform) {
  return normalizeStripesSectionFontSizeValue(
    MASTER_CSS_VARIABLES_DEFAULTS[getStripesSectionFontSizeVariable(section, platform)]
  );
}

// editor/ui-editor-ui/src/app/tools/utils/fonts/fontWeights.ts
var import_startCase = __toESM(require_startCase());
var fallbackWeight = 400;
var fontWeights = {
  Thin: 100,
  ExtraLight: 200,
  Light: 300,
  Normal: 400,
  Medium: 500,
  SemiBold: 600,
  Bold: 700,
  ExtraBold: 800,
  Black: 900
};
var fontWeightsNames = Object.keys(fontWeights).reduce((names, name) => ({
  ...names,
  [fontWeights[name]]: (0, import_startCase.default)(name)
}), {});
var supportedFontWeights = Object.values(fontWeights);

// editor/ui-editor-ui/src/app/tools/utils/fonts/FontWeightUtils.pure.ts
var HEADING_FONT_WEIGHT_VARIABLES = {
  h1: MasterCssVar.H1_FONT_WEIGHT,
  h2: MasterCssVar.H2_FONT_WEIGHT,
  h3: MasterCssVar.H3_FONT_WEIGHT,
  h4: MasterCssVar.H4_FONT_WEIGHT,
  h5: MasterCssVar.H5_FONT_WEIGHT,
  h6: MasterCssVar.H6_FONT_WEIGHT
};
function getNumWeight(weight) {
  if (weight === void 0) {
    return void 0;
  }
  switch (weight) {
    case "normal":
      return 400;
    case "bold":
      return 700;
    default: {
      const numberValue = parseInt(weight, 10);
      return Number.isNaN(numberValue) ? void 0 : numberValue;
    }
  }
}

// editor/ui-editor-ui/src/app/core/block-operations-api/stripes/settings/font-weight/get-from-model.ts
function getDefaultStripesFontWeight() {
  return getNumWeight(String(MASTER_CSS_VARIABLES_DEFAULTS[MasterCssVar.STRIPES_FONT_WEIGHT] ?? "")) ?? fallbackWeight;
}

// editor/ui-editor-ui/src/app/core/block-operations-api/stripes/settings/line-height/get-from-model.ts
var normalizeStripesLineHeightValue = normalizeLineHeightValue;
function getDefaultStripesLineHeight(platform) {
  const variable = platform === "desktop" ? MasterCssVar.LINE_HEIGHT : MasterCssVar.ADAPT_LINE_HEIGHT;
  return normalizeStripesLineHeightValue(MASTER_CSS_VARIABLES_DEFAULTS[variable]) ?? 1.5;
}

// editor/ui-editor-ui/src/app/core/background/background-image-layer-composition.ts
var import_postcss_value_parser = __toESM(require_lib());
var CSS_GRADIENT_LAYER_PATTERN = /^(?:(?:repeating-)?(?:linear|radial|conic))-gradient\s*\(/i;
var DYNAMIC_BACKGROUND_VALUE_PATTERN = /\b(?:(?:var|env)\s*\(|currentcolor\b)/i;
var IMPORTANT_SUFFIX = /\s*!\s*important\s*$/i;
var CSS_WIDE_KEYWORDS = /* @__PURE__ */ new Set(["inherit", "initial", "revert", "revert-layer", "unset"]);
var NON_IMAGE_BACKGROUND_LAYERS = /* @__PURE__ */ new Set(["none", ...CSS_WIDE_KEYWORDS]);
var ENVIRONMENT_DEPENDENT_COLOR_KEYWORDS = /* @__PURE__ */ new Set([
  "accentcolor",
  "accentcolortext",
  "activeborder",
  "activecaption",
  "activetext",
  "appworkspace",
  "background",
  "buttonborder",
  "buttonface",
  "buttonhighlight",
  "buttonshadow",
  "buttontext",
  "canvas",
  "canvastext",
  "captiontext",
  "field",
  "fieldtext",
  "graytext",
  "highlight",
  "highlighttext",
  "inactiveborder",
  "inactivecaption",
  "inactivecaptiontext",
  "infobackground",
  "infotext",
  "linktext",
  "mark",
  "marktext",
  "menu",
  "menutext",
  "scrollbar",
  "selecteditem",
  "selecteditemtext",
  "threeddarkshadow",
  "threedface",
  "threedhighlight",
  "threedlightshadow",
  "threedshadow",
  "visitedtext",
  "window",
  "windowframe",
  "windowtext"
]);
function isCssWideKeyword(value) {
  return CSS_WIDE_KEYWORDS.has(value.toLowerCase());
}
function isGradientLayer(layer) {
  return CSS_GRADIENT_LAYER_PATTERN.test(layer.trim());
}
function splitImportantPriority(value) {
  const rawValue = value?.trim() ?? "";
  return {
    value: rawValue.replace(IMPORTANT_SUFFIX, "").trim(),
    important: IMPORTANT_SUFFIX.test(rawValue)
  };
}
function isRuntimeDependentBackgroundValue(value) {
  const normalizedValue = splitImportantPriority(value).value;
  return DYNAMIC_BACKGROUND_VALUE_PATTERN.test(normalizedValue) || isCssWideKeyword(normalizedValue) || containsEnvironmentDependentColor(normalizedValue);
}
function containsEnvironmentDependentColor(value) {
  let environmentDependent = false;
  (0, import_postcss_value_parser.default)(value).walk((node) => {
    const name = node.value.toLowerCase();
    environmentDependent ||= node.type === "function" && name === "light-dark";
    environmentDependent ||= node.type === "word" && (ENVIRONMENT_DEPENDENT_COLOR_KEYWORDS.has(name) || name.startsWith("-"));
  });
  return environmentDependent;
}
function isStrictStaticCssColor(value) {
  if (isGradientLayer(value) || isRuntimeDependentBackgroundValue(value)) {
    return false;
  }
  const parsed = (0, import_postcss_value_parser.default)(value);
  const nodes = parsed.nodes.filter((node2) => node2.type !== "space" && node2.type !== "comment");
  if (hasUnclosedCssFunction(value) || nodes.length !== 1) {
    return false;
  }
  const node = nodes[0];
  const validShape = node.type === "word" ? /^(?:#[\da-f]{3,4}|#[\da-f]{6}|#[\da-f]{8}|[a-z]+)$/i.test(node.value) : node.type === "function" && /^(?:rgba?|hsla?)$/i.test(node.value);
  const normalizedValue = normalizeCssColorOrVar(value);
  return validShape && normalizedValue !== void 0 && !/^var\(/i.test(normalizedValue);
}
function hasUnclosedCssFunction(value) {
  let unclosed = false;
  (0, import_postcss_value_parser.default)(value).walk((node) => {
    unclosed ||= "unclosed" in node && node.unclosed === true;
  });
  return unclosed;
}

// editor/ui-editor-ui/src/app/services/api/editor-copilot-api/utils/descriptor-settings-path.ts
function isPathRecord(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}
function getDescriptorSettingsPathValue(source, path) {
  let current = source;
  for (const key of path) {
    if (!isPathRecord(current)) {
      return void 0;
    }
    current = current[key];
  }
  return current;
}
function setDescriptorSettingsPathValue(target, path, value) {
  if (path.length === 0) {
    throw new Error("Theme settings descriptor paths must not be empty.");
  }
  let current = target;
  path.forEach((key, index) => {
    if (index === path.length - 1) {
      current[key] = value;
      return;
    }
    const nested = current[key];
    if (isPathRecord(nested)) {
      current = nested;
      return;
    }
    const created = {};
    current[key] = created;
    current = created;
  });
}

// editor/ui-editor-ui/src/app/services/api/editor-copilot-api/schema/email-template-settings.schema.ts
var THEME_SETTINGS_SECTIONS = /* @__PURE__ */ new Set([
  "general",
  "stripes",
  "headings",
  "buttons"
]);
function isStaticCssGradient(value) {
  return isGradientLayer(value) && !isRuntimeDependentBackgroundValue(value) && isEditableCssGradient(value);
}
function hasEmptyTopLevelCsvLayer(value) {
  const nodes = (0, import_postcss_value_parser2.default)(value).nodes.filter((node) => node.type !== "space" && node.type !== "comment");
  const isComma = (index) => nodes[index]?.type === "div" && nodes[index].value === ",";
  return !nodes.length || nodes.some((_, index) => isComma(index) && (index === 0 || index === nodes.length - 1 || isComma(index - 1)));
}
function getThemeDescriptorSection(descriptor) {
  const section = descriptor.semanticOwner.split(".")[0];
  if (!THEME_SETTINGS_SECTIONS.has(section)) {
    throw new Error("Unsupported theme settings section for ".concat(descriptor.semanticOwner));
  }
  return section;
}
function setSchemaAtPath(shape, path, schema) {
  const [key, ...rest] = path;
  if (!key) {
    throw new Error("Theme settings descriptor paths must not be empty.");
  }
  if (!rest.length) {
    if (shape[key] !== void 0) {
      throw new Error("Duplicate theme settings schema path: ".concat(path.join(".")));
    }
    shape[key] = schema;
    return;
  }
  const existing = shape[key];
  if (existing instanceof external_exports.ZodType) {
    throw new Error("Theme settings schema path conflicts at: ".concat(path.join(".")));
  }
  const nested = existing ?? {};
  shape[key] = nested;
  setSchemaAtPath(nested, rest, schema);
}
function materializeStrictObjectSchema(shape) {
  return external_exports.object(Object.fromEntries(Object.entries(shape).map(([key, value]) => [
    key,
    value instanceof external_exports.ZodType ? value : materializeStrictObjectSchema(value)
  ]))).strict();
}
var canonicalBackgroundImageSizeSchema = external_exports.string().refine(
  (value) => Boolean(value) && value === value.trim(),
  { message: "Expected a non-empty normalized background image size." }
);
var canonicalBackgroundImagePathSchema = external_exports.string().refine(
  (value) => Boolean(value) && value === value.trim(),
  { message: "Expected a non-empty normalized background image path." }
);
var canonicalBackgroundImageSchema = external_exports.object({
  path: canonicalBackgroundImagePathSchema,
  repeat: external_exports.boolean(),
  x: external_exports.string(),
  y: external_exports.string(),
  sizeX: canonicalBackgroundImageSizeSchema,
  sizeY: canonicalBackgroundImageSizeSchema
}).strict();
var canonicalFullSideValuesSchema = external_exports.object({
  top: external_exports.number(),
  right: external_exports.number(),
  bottom: external_exports.number(),
  left: external_exports.number()
}).strict();
var canonicalResponsiveSidesSchema = external_exports.object({
  desktop: canonicalFullSideValuesSchema,
  mobile: canonicalFullSideValuesSchema
}).strict();
var canonicalSpacingValueSchema = external_exports.object({
  value: external_exports.number(),
  unit: external_exports.enum(["px", "em"])
}).strict();
var canonicalLineHeightSchema = external_exports.object({
  desktop: external_exports.number().min(0).max(5),
  mobile: external_exports.number().min(0).max(5)
}).strict();
var canonicalParagraphBottomSpaceSchema = external_exports.object({
  desktop: external_exports.number().min(0).max(100),
  mobile: external_exports.number().min(0).max(100)
}).strict();
var canonicalFontSizeSchema = external_exports.object({
  desktop: external_exports.number().min(8).max(72),
  mobile: external_exports.number().min(8).max(72)
}).strict();
var canonicalFontFamilySchema = external_exports.string().min(1, "Font family cannot be empty.").refine((value) => value.trim().length > 0, { message: "Font family cannot be blank." });
var canonicalFontWeightSchema = external_exports.number().int().min(100).max(900).multipleOf(100);
var generalNonThemeCustomListStylesSchema = external_exports.object({
  leftIndent: external_exports.number().min(0).max(300),
  listItemsBottomSpace: external_exports.number().min(0).max(100),
  listTopBottomMargin: external_exports.number().min(0).max(100)
}).strict();
var generalNonThemeSchema = external_exports.object({
  defaultStyles: external_exports.boolean(),
  hideImageDownloadIcons: external_exports.boolean(),
  underlineLinks: external_exports.boolean(),
  responsiveDesign: external_exports.boolean(),
  messageAlignment: external_exports.enum(["left", "center", "right"]),
  messageContentWidth: external_exports.number().int().min(320).max(900),
  backgroundImage: canonicalBackgroundImageSchema.nullable(),
  rightToLeftTextDirection: external_exports.boolean(),
  marginsAroundMessage: canonicalResponsiveSidesSchema,
  defaultStructurePadding: canonicalResponsiveSidesSchema,
  customListStyles: generalNonThemeCustomListStylesSchema.nullable()
}).strict();
var stripesCommonNonThemeShape = {
  fontSize: canonicalFontSizeSchema,
  paragraphBottomSpace: canonicalParagraphBottomSpaceSchema.nullable()
};
var stripesHeaderNonThemeSchema = external_exports.object({
  ...stripesCommonNonThemeShape,
  backgroundImage: canonicalBackgroundImageSchema.nullable()
}).strict();
var stripesContentNonThemeSchema = external_exports.object(stripesCommonNonThemeShape).strict();
var stripesFooterNonThemeSchema = external_exports.object({
  ...stripesCommonNonThemeShape,
  backgroundImage: canonicalBackgroundImageSchema.nullable()
}).strict();
var stripesInfoAreaNonThemeSchema = external_exports.object(stripesCommonNonThemeShape).strict();
var stripesNonThemeSchema = external_exports.object({
  letterSpacing: canonicalSpacingValueSchema,
  lineHeight: canonicalLineHeightSchema,
  fontFamily: canonicalFontFamilySchema,
  fontWeight: canonicalFontWeightSchema,
  header: stripesHeaderNonThemeSchema,
  content: stripesContentNonThemeSchema,
  footer: stripesFooterNonThemeSchema,
  infoArea: stripesInfoAreaNonThemeSchema
}).strict();
var headingNonThemeSchema = external_exports.object({
  textAlign: external_exports.object({ mobile: external_exports.enum(["left", "center", "right"]).nullable() }).strict(),
  textStyle: external_exports.object({ italic: external_exports.boolean() }).strict(),
  fontWeight: canonicalFontWeightSchema.nullable(),
  fontSize: canonicalFontSizeSchema.extend({
    desktop: canonicalFontSizeSchema.shape.desktop.nullable(),
    mobile: canonicalFontSizeSchema.shape.mobile.nullable()
  }),
  lineHeight: canonicalLineHeightSchema.extend({
    desktop: canonicalLineHeightSchema.shape.desktop.nullable(),
    mobile: canonicalLineHeightSchema.shape.mobile.nullable()
  }),
  paragraphBottomSpace: canonicalParagraphBottomSpaceSchema.nullable()
}).strict();
var headingsNonThemeSchema = external_exports.object({
  letterSpacing: canonicalSpacingValueSchema,
  fontFamily: canonicalFontFamilySchema,
  h1: headingNonThemeSchema,
  h2: headingNonThemeSchema,
  h3: headingNonThemeSchema,
  h4: headingNonThemeSchema,
  h5: headingNonThemeSchema,
  h6: headingNonThemeSchema
}).strict();
var borderWidthSideSchema = external_exports.object({ width: external_exports.number().min(0).max(100) }).strict();
var buttonsNonThemeBorderSchema = external_exports.object({
  top: borderWidthSideSchema,
  right: borderWidthSideSchema,
  bottom: borderWidthSideSchema,
  left: borderWidthSideSchema,
  style: external_exports.enum(["solid", "dashed", "dotted"])
}).strict();
var buttonsNonThemeSchema = external_exports.object({
  outlookSupport: external_exports.boolean(),
  textStyle: external_exports.object({ bold: external_exports.boolean(), italic: external_exports.boolean() }).strict(),
  textTransform: external_exports.enum(["none", "uppercase", "capitalize", "lowercase"]),
  fontFamily: canonicalFontFamilySchema,
  letterSpacing: canonicalSpacingValueSchema,
  fontSize: canonicalFontSizeSchema,
  borderRadius: external_exports.object({
    topLeft: external_exports.number().min(0).max(1e3),
    topRight: external_exports.number().min(0).max(1e3),
    bottomRight: external_exports.number().min(0).max(1e3),
    bottomLeft: external_exports.number().min(0).max(1e3)
  }).strict(),
  fitContainer: external_exports.object({ desktop: external_exports.boolean(), mobile: external_exports.boolean() }).strict(),
  border: buttonsNonThemeBorderSchema,
  hoverButtonStyles: external_exports.boolean(),
  padding: canonicalResponsiveSidesSchema
}).strict();
var productionLegacyFontFamilySchema = external_exports.string().min(1, "Font family cannot be empty.").refine((value) => value.trim().length > 0, { message: "Font family cannot be blank." });
var productionLegacyFullSideValuesSchema = external_exports.object({
  top: external_exports.number(),
  right: external_exports.number(),
  bottom: external_exports.number(),
  left: external_exports.number()
}).strict();
var productionLegacyResponsiveSidesSchema = external_exports.object({
  desktop: productionLegacyFullSideValuesSchema,
  mobile: productionLegacyFullSideValuesSchema
}).strict();
var productionLegacySpacingValueSchema = external_exports.object({
  value: external_exports.number(),
  unit: external_exports.enum(["px", "em"])
}).strict();
var productionLegacyLineHeightSchema = external_exports.object({
  desktop: external_exports.number().min(0).max(5),
  mobile: external_exports.number().min(0).max(5)
}).strict();
var productionLegacyParagraphBottomSpaceSchema = external_exports.object({
  desktop: external_exports.number().min(0).max(100),
  mobile: external_exports.number().min(0).max(100)
}).strict();
var productionLegacyFontSizeSchema = external_exports.object({
  desktop: external_exports.number().min(8).max(72),
  mobile: external_exports.number().min(8).max(72)
}).strict();
var productionLegacyFontWeightSchema = external_exports.number().int().min(100).max(900).multipleOf(100);
var productionLegacyBackgroundRepeatSchema = external_exports.union([external_exports.boolean(), external_exports.string()]).transform((value, context) => {
  const normalizedValue = normalizeBackgroundImageRepeatValue(value);
  if (normalizedValue !== void 0) {
    return normalizedValue;
  }
  context.addIssue({
    code: external_exports.ZodIssueCode.custom,
    message: "Invalid repeat value. Expected boolean or repeat/no-repeat."
  });
  return external_exports.NEVER;
});
var productionLegacyBackgroundImageSchema = external_exports.object({
  path: external_exports.string(),
  repeat: productionLegacyBackgroundRepeatSchema,
  x: external_exports.string(),
  y: external_exports.string(),
  sizeX: external_exports.string().transform(normalizeBackgroundImageSizeValue),
  sizeY: external_exports.string().transform(normalizeBackgroundImageSizeValue)
}).strict();
function createEmailTemplateSettingsSchemas(colorMergeTagValues = /* @__PURE__ */ new Set()) {
  const canonicalColorAllowTransparentSchema = external_exports.string().refine(
    (value) => (isMergeTagColorToken(value, colorMergeTagValues) || isStrictStaticCssColor(value)) && normalizeTransparentAllowedColor(value, colorMergeTagValues) !== void 0,
    { message: "Expected a valid static CSS color value." }
  );
  const canonicalColorDisallowTransparentSchema = external_exports.string().refine(
    (value) => (isMergeTagColorToken(value, colorMergeTagValues) || isStrictStaticCssColor(value)) && normalizeOpaqueColor(value, colorMergeTagValues) !== void 0,
    { message: "Expected a valid static non-transparent CSS color value." }
  );
  function isCanonicalThemeBackground(value) {
    if (isMergeTagColorToken(value, colorMergeTagValues)) {
      return true;
    }
    if (hasEmptyTopLevelCsvLayer(value)) {
      return false;
    }
    const layers = splitTopLevelCsv(value);
    if (layers.length === 1) {
      return canonicalColorAllowTransparentSchema.safeParse(layers[0]).success;
    }
    return layers.length === 2 && isStaticCssGradient(layers[0]) && isStrictStaticCssColor(layers[1]) && canonicalColorAllowTransparentSchema.safeParse(layers[1]).success;
  }
  const productionLegacyColorAllowTransparentSchema = external_exports.string().refine(
    (value) => normalizeTransparentAllowedColor(value, colorMergeTagValues) !== void 0,
    { message: "Expected a valid CSS color value." }
  );
  const productionLegacyColorDisallowTransparentSchema = external_exports.string().refine(
    (value) => normalizeOpaqueColor(value, colorMergeTagValues) !== void 0,
    { message: "Expected a valid non-transparent CSS color value." }
  );
  const canonicalThemeBackgroundSchema2 = external_exports.string().refine(isCanonicalThemeBackground, {
    message: "Expected a static solid color or one static CSS gradient followed by a solid fallback."
  }).describe("Canonical theme background: a solid color or `<gradient>, <solid fallback>`.");
  function getDescriptorValueSchema(descriptor) {
    if (descriptor.valueKind === "background") {
      return canonicalThemeBackgroundSchema2;
    }
    return descriptor.settings.allowTransparent ? canonicalColorAllowTransparentSchema : canonicalColorDisallowTransparentSchema;
  }
  function createThemeBranchSchema(section, nullable) {
    const shape = {};
    THEME_VARIABLE_DESCRIPTORS.filter((descriptor) => getThemeDescriptorSection(descriptor) === section).forEach((descriptor) => {
      const schema = getDescriptorValueSchema(descriptor);
      setSchemaAtPath(shape, descriptor.settings.path, nullable ? schema.nullable() : schema);
    });
    return materializeStrictObjectSchema(shape);
  }
  const canonicalEmailTemplateSettingsSchema2 = external_exports.object({
    general: generalNonThemeSchema.extend({
      lightTheme: createThemeBranchSchema("general", false),
      darkTheme: createThemeBranchSchema("general", true)
    }).strict(),
    stripes: stripesNonThemeSchema.extend({
      lightTheme: createThemeBranchSchema("stripes", false),
      darkTheme: createThemeBranchSchema("stripes", true)
    }).strict(),
    headings: headingsNonThemeSchema.extend({
      lightTheme: createThemeBranchSchema("headings", false),
      darkTheme: createThemeBranchSchema("headings", true)
    }).strict(),
    buttons: buttonsNonThemeSchema.extend({
      lightTheme: createThemeBranchSchema("buttons", false),
      darkTheme: createThemeBranchSchema("buttons", true)
    }).strict()
  }).strict().describe("Canonical theme-aware email template settings.");
  const productionLegacyHoverLinkColorSchema = external_exports.object({
    value: productionLegacyColorDisallowTransparentSchema
  }).strict();
  const productionLegacyGeneralCustomListStylesSchema = external_exports.object({
    leftIndent: external_exports.number().min(0).max(300),
    listItemsBottomSpace: external_exports.number().min(0).max(100),
    listTopBottomMargin: external_exports.number().min(0).max(100),
    listMarkerColor: productionLegacyColorAllowTransparentSchema,
    listNumberMarkerColor: productionLegacyColorAllowTransparentSchema
  }).strict();
  const productionLegacyGeneralSchema = external_exports.object({
    defaultStyles: external_exports.boolean(),
    hideImageDownloadIcons: external_exports.boolean().optional(),
    underlineLinks: external_exports.boolean(),
    responsiveDesign: external_exports.boolean(),
    messageAlignment: external_exports.enum(["left", "center", "right"]),
    messageContentWidth: external_exports.number().int().min(320).max(900),
    backgroundColor: productionLegacyColorAllowTransparentSchema,
    backgroundImage: productionLegacyBackgroundImageSchema.optional(),
    rightToLeftTextDirection: external_exports.boolean(),
    marginsAroundMessage: productionLegacyResponsiveSidesSchema,
    defaultStructurePadding: productionLegacyResponsiveSidesSchema,
    customListStyles: productionLegacyGeneralCustomListStylesSchema.optional()
  }).strict();
  const productionLegacyStripesCommonShape = {
    fontSize: productionLegacyFontSizeSchema.optional(),
    fontColor: productionLegacyColorDisallowTransparentSchema.optional(),
    linkColor: productionLegacyColorDisallowTransparentSchema.optional(),
    linkColorHover: productionLegacyHoverLinkColorSchema.optional(),
    paragraphBottomSpace: productionLegacyParagraphBottomSpaceSchema.optional()
  };
  const productionLegacyStripesHeaderSchema = external_exports.object({
    ...productionLegacyStripesCommonShape,
    contentBackgroundColor: productionLegacyColorAllowTransparentSchema.optional(),
    stripeBackgroundColor: productionLegacyColorAllowTransparentSchema.optional(),
    backgroundImage: productionLegacyBackgroundImageSchema.optional()
  }).strict();
  const productionLegacyStripesContentSchema = external_exports.object({
    ...productionLegacyStripesCommonShape,
    contentBackgroundColor: productionLegacyColorAllowTransparentSchema.optional()
  }).strict();
  const productionLegacyStripesFooterSchema = external_exports.object({
    ...productionLegacyStripesCommonShape,
    contentBackgroundColor: productionLegacyColorAllowTransparentSchema.optional(),
    stripeBackgroundColor: productionLegacyColorAllowTransparentSchema.optional(),
    backgroundImage: productionLegacyBackgroundImageSchema.optional()
  }).strict();
  const productionLegacyStripesInfoAreaSchema = external_exports.object({
    ...productionLegacyStripesCommonShape
  }).strict();
  const productionLegacyStripesSchema = external_exports.object({
    letterSpacing: productionLegacySpacingValueSchema.optional(),
    lineHeight: productionLegacyLineHeightSchema.optional(),
    fontFamily: productionLegacyFontFamilySchema.optional(),
    fontWeight: productionLegacyFontWeightSchema.optional(),
    header: productionLegacyStripesHeaderSchema.optional(),
    content: productionLegacyStripesContentSchema.optional(),
    footer: productionLegacyStripesFooterSchema.optional(),
    infoArea: productionLegacyStripesInfoAreaSchema.optional()
  }).strict();
  const productionLegacyHeadingSchema = external_exports.object({
    fontColor: productionLegacyColorDisallowTransparentSchema.optional(),
    textAlign: external_exports.object({ mobile: external_exports.enum(["left", "center", "right"]) }).strict().optional(),
    textStyle: external_exports.object({ italic: external_exports.boolean() }).strict().optional(),
    fontWeight: productionLegacyFontWeightSchema.optional(),
    fontSize: productionLegacyFontSizeSchema.optional(),
    lineHeight: productionLegacyLineHeightSchema.optional(),
    paragraphBottomSpace: productionLegacyParagraphBottomSpaceSchema.optional()
  }).strict();
  const productionLegacyHeadingsSchema = external_exports.object({
    letterSpacing: productionLegacySpacingValueSchema.optional(),
    fontFamily: productionLegacyFontFamilySchema.optional(),
    h1: productionLegacyHeadingSchema.optional(),
    h2: productionLegacyHeadingSchema.optional(),
    h3: productionLegacyHeadingSchema.optional(),
    h4: productionLegacyHeadingSchema.optional(),
    h5: productionLegacyHeadingSchema.optional(),
    h6: productionLegacyHeadingSchema.optional()
  }).strict();
  const productionLegacyBorderSideSchema = external_exports.object({
    width: external_exports.number().min(0).max(100),
    color: productionLegacyColorAllowTransparentSchema
  }).strict();
  const productionLegacyBorderSchema = external_exports.object({
    top: productionLegacyBorderSideSchema,
    right: productionLegacyBorderSideSchema,
    bottom: productionLegacyBorderSideSchema,
    left: productionLegacyBorderSideSchema,
    style: external_exports.enum(["solid", "dashed", "dotted"])
  }).strict();
  const productionLegacyButtonsHoverBorderColorSchema = external_exports.object({
    top: productionLegacyColorAllowTransparentSchema,
    right: productionLegacyColorAllowTransparentSchema,
    bottom: productionLegacyColorAllowTransparentSchema,
    left: productionLegacyColorAllowTransparentSchema
  }).strict();
  const productionLegacyButtonsHoverSchema = external_exports.object({
    backgroundColor: productionLegacyColorAllowTransparentSchema,
    fontColor: productionLegacyColorDisallowTransparentSchema,
    borderColor: productionLegacyButtonsHoverBorderColorSchema
  }).strict();
  const productionLegacyButtonsSchema = external_exports.object({
    outlookSupport: external_exports.boolean().optional(),
    fontColor: productionLegacyColorDisallowTransparentSchema.optional(),
    textStyle: external_exports.object({ bold: external_exports.boolean(), italic: external_exports.boolean() }).strict().optional(),
    textTransform: external_exports.enum(["none", "uppercase", "capitalize", "lowercase"]).optional(),
    fontFamily: productionLegacyFontFamilySchema.optional(),
    buttonColor: productionLegacyColorAllowTransparentSchema.optional(),
    letterSpacing: productionLegacySpacingValueSchema.optional(),
    fontSize: productionLegacyFontSizeSchema.optional(),
    borderRadius: external_exports.object({
      topLeft: external_exports.number().min(0).max(1e3),
      topRight: external_exports.number().min(0).max(1e3),
      bottomRight: external_exports.number().min(0).max(1e3),
      bottomLeft: external_exports.number().min(0).max(1e3)
    }).strict().optional(),
    fitContainer: external_exports.object({ desktop: external_exports.boolean(), mobile: external_exports.boolean() }).strict().optional(),
    border: productionLegacyBorderSchema,
    hoverButtonStyles: productionLegacyButtonsHoverSchema.optional(),
    padding: productionLegacyResponsiveSidesSchema.optional()
  }).strict();
  const productionLegacyEmailTemplateSettingsSchema2 = external_exports.object({
    general: productionLegacyGeneralSchema,
    stripes: productionLegacyStripesSchema.optional(),
    headings: productionLegacyHeadingsSchema.optional(),
    buttons: productionLegacyButtonsSchema.optional()
  }).strict().superRefine((value, context) => {
    if (value.stripes === void 0) {
      context.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: ["stripes"],
        message: "Stripe settings are required."
      });
    }
    if (value.headings === void 0) {
      context.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: ["headings"],
        message: "Heading settings are required."
      });
    }
    if (value.buttons === void 0) {
      context.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: ["buttons"],
        message: "Button settings are required."
      });
    }
  }).describe("Frozen production light-only email template settings.");
  return {
    canonicalThemeBackgroundSchema: canonicalThemeBackgroundSchema2,
    getDescriptorValueSchema,
    canonicalEmailTemplateSettingsSchema: canonicalEmailTemplateSettingsSchema2,
    productionLegacyEmailTemplateSettingsSchema: productionLegacyEmailTemplateSettingsSchema2
  };
}
var {
  canonicalThemeBackgroundSchema,
  canonicalEmailTemplateSettingsSchema,
  productionLegacyEmailTemplateSettingsSchema
} = createEmailTemplateSettingsSchemas();
function getDescriptorDefault(descriptor) {
  const value = descriptor.valueKind === "background" ? MASTER_CSS_VARIABLES_DEFAULTS[descriptor.variables.light.solid] : MASTER_CSS_VARIABLES_DEFAULTS[descriptor.variables.light];
  if (typeof value !== "string") {
    throw new Error("Missing theme settings fallback for ".concat(descriptor.semanticOwner));
  }
  return value;
}
function normalizeLegacyThemeValue(value, descriptor, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  const normalized = descriptor.settings.allowTransparent ? normalizeTransparentAllowedColor(value, colorMergeTagValues) : normalizeOpaqueColor(value, colorMergeTagValues);
  if (normalized === void 0) {
    throw new Error("Invalid production legacy theme value for ".concat(descriptor.semanticOwner));
  }
  return normalized;
}
function resolveThemeDescriptorValues(readDirectValue, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  const { getDescriptorValueSchema } = createEmailTemplateSettingsSchemas(colorMergeTagValues);
  const descriptorsByOwner = new Map(THEME_VARIABLE_DESCRIPTORS.map((descriptor) => [
    descriptor.semanticOwner,
    descriptor
  ]));
  const resolvedValues = /* @__PURE__ */ new Map();
  const resolvingOwners = /* @__PURE__ */ new Set();
  const resolveValue = (owner) => {
    const resolvedValue = resolvedValues.get(owner);
    if (resolvedValue !== void 0) {
      return resolvedValue;
    }
    if (resolvingOwners.has(owner)) {
      throw new Error("Cyclic theme settings fallback dependency: ".concat(owner));
    }
    const descriptor = descriptorsByOwner.get(owner);
    if (!descriptor) {
      throw new Error("Unknown theme settings fallback owner: ".concat(owner));
    }
    resolvingOwners.add(owner);
    const directValue = readDirectValue(descriptor);
    const validDirectValue = directValue !== void 0 && getDescriptorValueSchema(descriptor).safeParse(directValue).success ? directValue : void 0;
    let value;
    if (validDirectValue !== void 0) {
      value = validDirectValue;
    } else if (descriptor.settings.legacyFallbackOwner) {
      const fallbackValue = resolveValue(descriptor.settings.legacyFallbackOwner);
      switch (descriptor.settings.legacyFallbackTransform) {
        case "button-hover-color":
          value = resolveButtonsHoverColorFallback(fallbackValue, colorMergeTagValues);
          break;
        case "button-hover-font-contrast": {
          const contextOwner = descriptor.settings.legacyFallbackContextOwner;
          if (!contextOwner) {
            throw new Error("Missing context owner for ".concat(descriptor.semanticOwner));
          }
          value = resolveButtonsHoverFontColorFallback(fallbackValue, resolveValue(contextOwner), colorMergeTagValues);
          break;
        }
        default:
          value = fallbackValue;
      }
    } else {
      value = getDescriptorDefault(descriptor);
    }
    resolvingOwners.delete(owner);
    resolvedValues.set(owner, value);
    return value;
  };
  THEME_VARIABLE_DESCRIPTORS.forEach((descriptor) => resolveValue(descriptor.semanticOwner));
  return resolvedValues;
}
function createCanonicalThemeBranches(legacy, section, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  const lightTheme = {};
  const darkTheme = {};
  const resolvedValues = resolveThemeDescriptorValues((descriptor) => {
    const legacySection = legacy[getThemeDescriptorSection(descriptor)];
    const directValue = getDescriptorSettingsPathValue(legacySection, descriptor.settings.legacyPath);
    return typeof directValue === "string" ? normalizeLegacyThemeValue(directValue, descriptor, colorMergeTagValues) : void 0;
  }, colorMergeTagValues);
  THEME_VARIABLE_DESCRIPTORS.filter((descriptor) => getThemeDescriptorSection(descriptor) === section).forEach((descriptor) => {
    const value = resolvedValues.get(descriptor.semanticOwner);
    if (value === void 0) {
      throw new Error("Missing resolved theme settings value for ".concat(descriptor.semanticOwner));
    }
    setDescriptorSettingsPathValue(
      lightTheme,
      descriptor.settings.path,
      value
    );
    setDescriptorSettingsPathValue(darkTheme, descriptor.settings.path, null);
  });
  return { lightTheme, darkTheme };
}
function omitKeys(value, keys) {
  return Object.fromEntries(Object.entries(value).filter(([key]) => !keys.includes(key)));
}
function normalizeLegacyBackgroundImage(value) {
  const path = typeof value?.path === "string" ? value.path.trim() : "";
  return path ? { ...value, path } : null;
}
function createCanonicalStripeNonThemeSection(legacySection, section) {
  const canonical = {
    fontSize: legacySection?.fontSize ?? {
      desktop: getDefaultStripesSectionFontSize(section, "desktop"),
      mobile: getDefaultStripesSectionFontSize(section, "mobile")
    },
    paragraphBottomSpace: legacySection?.paragraphBottomSpace ?? null
  };
  if (section === "header" || section === "footer") {
    canonical.backgroundImage = normalizeLegacyBackgroundImage(
      legacySection?.backgroundImage
    );
  }
  return canonical;
}
function createCanonicalHeadingNonThemeSection(legacySection, heading) {
  return {
    textAlign: legacySection?.textAlign ?? getDefaultHeadingsTextAlignValue(),
    textStyle: legacySection?.textStyle ?? getDefaultHeadingsTextStyleValue(),
    fontWeight: legacySection?.fontWeight ?? null,
    fontSize: legacySection?.fontSize ?? {
      desktop: getDefaultHeadingsFontSize(heading, "desktop"),
      mobile: getDefaultHeadingsFontSize(heading, "mobile")
    },
    lineHeight: legacySection?.lineHeight ?? {
      desktop: getDefaultHeadingsLineHeight(heading, "desktop"),
      mobile: getDefaultHeadingsLineHeight(heading, "mobile")
    },
    paragraphBottomSpace: legacySection?.paragraphBottomSpace ?? null
  };
}
function normalizeLegacySettings(legacy, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  const { canonicalEmailTemplateSettingsSchema: canonicalEmailTemplateSettingsSchema2 } = createEmailTemplateSettingsSchemas(colorMergeTagValues);
  if (!legacy.stripes || !legacy.headings || !legacy.buttons) {
    throw new Error("Production legacy settings passed validation without their required sections.");
  }
  const generalCustomListStyles = legacy.general.customListStyles ? omitKeys(legacy.general.customListStyles, ["listMarkerColor", "listNumberMarkerColor"]) : null;
  const general = {
    ...omitKeys(legacy.general, ["backgroundColor", "customListStyles"]),
    hideImageDownloadIcons: legacy.general.hideImageDownloadIcons ?? getDefaultGeneralHideImageDownloadIcons(),
    backgroundImage: normalizeLegacyBackgroundImage(legacy.general.backgroundImage),
    customListStyles: generalCustomListStyles,
    ...createCanonicalThemeBranches(legacy, "general", colorMergeTagValues)
  };
  const stripes = {
    letterSpacing: legacy.stripes.letterSpacing ?? getDefaultLetterSpacingValue(),
    lineHeight: legacy.stripes.lineHeight ?? {
      desktop: getDefaultStripesLineHeight("desktop"),
      mobile: getDefaultStripesLineHeight("mobile")
    },
    fontFamily: legacy.stripes.fontFamily ?? getDefaultFontFamily(MasterCssVar.FONT),
    fontWeight: legacy.stripes.fontWeight ?? getDefaultStripesFontWeight(),
    header: createCanonicalStripeNonThemeSection(legacy.stripes.header, "header"),
    content: createCanonicalStripeNonThemeSection(legacy.stripes.content, "content"),
    footer: createCanonicalStripeNonThemeSection(legacy.stripes.footer, "footer"),
    infoArea: createCanonicalStripeNonThemeSection(legacy.stripes.infoArea, "infoArea"),
    ...createCanonicalThemeBranches(legacy, "stripes", colorMergeTagValues)
  };
  const headings = {
    letterSpacing: legacy.headings.letterSpacing ?? getDefaultLetterSpacingValue(),
    fontFamily: legacy.headings.fontFamily ?? getDefaultFontFamily(MasterCssVar.TITLE_FONT),
    h1: createCanonicalHeadingNonThemeSection(legacy.headings.h1, "h1"),
    h2: createCanonicalHeadingNonThemeSection(legacy.headings.h2, "h2"),
    h3: createCanonicalHeadingNonThemeSection(legacy.headings.h3, "h3"),
    h4: createCanonicalHeadingNonThemeSection(legacy.headings.h4, "h4"),
    h5: createCanonicalHeadingNonThemeSection(legacy.headings.h5, "h5"),
    h6: createCanonicalHeadingNonThemeSection(legacy.headings.h6, "h6"),
    ...createCanonicalThemeBranches(legacy, "headings", colorMergeTagValues)
  };
  const border = {
    top: omitKeys(legacy.buttons.border.top, ["color"]),
    right: omitKeys(legacy.buttons.border.right, ["color"]),
    bottom: omitKeys(legacy.buttons.border.bottom, ["color"]),
    left: omitKeys(legacy.buttons.border.left, ["color"]),
    style: legacy.buttons.border.style
  };
  const buttons = {
    outlookSupport: legacy.buttons.outlookSupport ?? getDefaultButtonsOutlookSupport(),
    textStyle: legacy.buttons.textStyle ?? getDefaultTextStyleValue(),
    textTransform: legacy.buttons.textTransform ?? DEFAULT_BUTTONS_TEXT_TRANSFORM,
    fontFamily: legacy.buttons.fontFamily ?? getDefaultFontFamily(MasterCssVar.BUTTON_FONT),
    letterSpacing: legacy.buttons.letterSpacing ?? getDefaultLetterSpacingValue(),
    fontSize: legacy.buttons.fontSize ?? {
      desktop: getDefaultButtonsFontSize("desktop"),
      mobile: getDefaultButtonsFontSize("mobile")
    },
    borderRadius: legacy.buttons.borderRadius ?? getDefaultButtonsBorderRadius(),
    fitContainer: legacy.buttons.fitContainer ?? {
      desktop: getDefaultButtonsFitContainer("desktop"),
      mobile: getDefaultButtonsFitContainer("mobile")
    },
    border,
    hoverButtonStyles: legacy.buttons.hoverButtonStyles !== void 0,
    padding: legacy.buttons.padding ?? {
      desktop: getDefaultButtonsPadding("desktop"),
      mobile: getDefaultButtonsPadding("mobile")
    },
    ...createCanonicalThemeBranches(legacy, "buttons", colorMergeTagValues)
  };
  return canonicalEmailTemplateSettingsSchema2.parse({ general, stripes, headings, buttons });
}
function normalizeReleasedHeadingTextStyles(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }
  const settings = value;
  const headings = settings.headings;
  if (!headings || typeof headings !== "object" || Array.isArray(headings)) {
    return value;
  }
  let normalizedHeadings;
  for (const heading of ["h1", "h2", "h3", "h4", "h5", "h6"]) {
    const section = headings[heading];
    if (!section || typeof section !== "object" || Array.isArray(section)) {
      continue;
    }
    const textStyle = section.textStyle;
    if (!textStyle || typeof textStyle !== "object" || Array.isArray(textStyle)) {
      continue;
    }
    const textStyleRecord = textStyle;
    const keys = Object.keys(textStyleRecord);
    if (!keys.includes("bold") || !keys.every((key) => key === "bold" || key === "italic") || typeof textStyleRecord.bold !== "boolean" || typeof textStyleRecord.italic !== "boolean") {
      continue;
    }
    normalizedHeadings ??= { ...headings };
    normalizedHeadings[heading] = {
      ...section,
      textStyle: { italic: textStyleRecord.italic }
    };
  }
  return normalizedHeadings ? { ...settings, headings: normalizedHeadings } : value;
}
function materializeCanonicalNonThemeSettings(legacy, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  const { productionLegacyEmailTemplateSettingsSchema: productionLegacyEmailTemplateSettingsSchema2, canonicalEmailTemplateSettingsSchema: canonicalEmailTemplateSettingsSchema2 } = createEmailTemplateSettingsSchemas(colorMergeTagValues);
  const hoverStylesEnabled = legacy.buttons?.hoverButtonStyles !== void 0;
  const customListStylesEnabled = Boolean(legacy.general.customListStyles);
  const projection = JSON.parse(JSON.stringify(legacy));
  const defaultThemeValues = resolveThemeDescriptorValues(() => void 0, colorMergeTagValues);
  THEME_VARIABLE_DESCRIPTORS.forEach((descriptor) => {
    if (descriptor.displayPolicy?.settingsActivation === "custom-list-styles" && !customListStylesEnabled || descriptor.displayPolicy?.settingsActivation === "button-hover-styles" && !hoverStylesEnabled) {
      return;
    }
    const section = projection[getThemeDescriptorSection(descriptor)];
    const value = defaultThemeValues.get(descriptor.semanticOwner);
    if (value === void 0) {
      throw new Error("Missing default theme settings value for ".concat(descriptor.semanticOwner));
    }
    setDescriptorSettingsPathValue(section, descriptor.settings.legacyPath, value);
  });
  const parsedProjection = productionLegacyEmailTemplateSettingsSchema2.parse(projection);
  const canonical = normalizeLegacySettings(parsedProjection, colorMergeTagValues);
  canonical.buttons.hoverButtonStyles = hoverStylesEnabled;
  if (!customListStylesEnabled) {
    canonical.general.customListStyles = null;
  }
  return canonicalEmailTemplateSettingsSchema2.parse(canonical);
}
var SettingsNormalizationError = class extends Error {
  constructor(canonicalIssues, legacyIssues) {
    super("Email template settings match neither canonical nor production legacy schema.");
    this.canonicalIssues = canonicalIssues;
    this.legacyIssues = legacyIssues;
    this.name = "SettingsNormalizationError";
  }
};
function settingsNormalization(value, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  const { canonicalEmailTemplateSettingsSchema: canonicalEmailTemplateSettingsSchema2, productionLegacyEmailTemplateSettingsSchema: productionLegacyEmailTemplateSettingsSchema2 } = createEmailTemplateSettingsSchemas(colorMergeTagValues);
  const canonicalResult = canonicalEmailTemplateSettingsSchema2.safeParse(value);
  if (canonicalResult.success) {
    return value;
  }
  const legacyCompatibleValue = normalizeReleasedHeadingTextStyles(value);
  const legacyResult = productionLegacyEmailTemplateSettingsSchema2.safeParse(legacyCompatibleValue);
  if (legacyResult.success) {
    return normalizeLegacySettings(legacyResult.data, colorMergeTagValues);
  }
  throw new SettingsNormalizationError(canonicalResult.error.issues, legacyResult.error.issues);
}

export {
  EMPTY_BORDER_RADIUS,
  normalizeBackgroundImageSizeValue,
  ArrayUtils,
  require_postcss,
  parse,
  isFontConnectionUrl,
  clearFontValue,
  getFontFaceCssDetails,
  require_basePropertyOf,
  require_toString,
  BUTTONS_TEXT_TRANSFORM_VALUES,
  IMAGE_MAX_ALT_TEXT_LENGTH,
  MAX_QUANTITY_CONTAINERS,
  normalizeTransparentAllowedColor,
  normalizeOpaqueColor,
  getThemeDescriptorSection,
  createEmailTemplateSettingsSchemas,
  canonicalThemeBackgroundSchema,
  canonicalEmailTemplateSettingsSchema,
  productionLegacyEmailTemplateSettingsSchema,
  resolveThemeDescriptorValues,
  materializeCanonicalNonThemeSettings,
  SettingsNormalizationError,
  settingsNormalization
};

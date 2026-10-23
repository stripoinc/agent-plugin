import {
  require_path,
  require_previous_map,
  require_source_map
} from "./fs-064e509bf2cb.mjs";
import {
  require_css_syntax_error,
  require_terminal_highlight
} from "./terminal-highlight-0f20b1c39b48.mjs";
import {
  __commonJS
} from "./shared-4f53cda18c2b.mjs";

// editor/ui-editor-ui/node_modules/nanoid/non-secure/index.cjs
var require_non_secure = __commonJS({
  "../editor/ui-editor-ui/node_modules/nanoid/non-secure/index.cjs"(exports, module) {
    "use strict";
    var urlAlphabet = "useandom-26T198340PX75pxJACKVERYMINDBUSHWOLF_GQZbfghjklqvwyzrict";
    var customAlphabet = (alphabet, defaultSize = 21) => {
      return (size = defaultSize) => {
        let id = "";
        let i = size | 0;
        while (i-- > 0) {
          id += alphabet[Math.random() * alphabet.length | 0];
        }
        return id;
      };
    };
    var nanoid = (size = 21) => {
      let id = "";
      let i = size | 0;
      while (i-- > 0) {
        id += urlAlphabet[Math.random() * 64 | 0];
      }
      return id;
    };
    module.exports = { nanoid, customAlphabet };
  }
});

// (disabled):convo-email-agent/url
var require_url = __commonJS({
  "(disabled):url"() {
    "use strict";
  }
});

// editor/ui-editor-ui/node_modules/postcss/lib/input.js
var require_input = __commonJS({
  "../editor/ui-editor-ui/node_modules/postcss/lib/input.js"(exports, module) {
    var { nanoid } = require_non_secure();
    var { isAbsolute, resolve } = require_path();
    var { SourceMapConsumer, SourceMapGenerator } = require_source_map();
    var { fileURLToPath, pathToFileURL } = require_url();
    var CssSyntaxError = require_css_syntax_error();
    var PreviousMap = require_previous_map();
    var terminalHighlight = require_terminal_highlight();
    var lineToIndexCache = /* @__PURE__ */ Symbol("lineToIndexCache");
    var sourceMapAvailable = Boolean(SourceMapConsumer && SourceMapGenerator);
    var pathAvailable = Boolean(resolve && isAbsolute);
    function getLineToIndex(input) {
      if (input[lineToIndexCache]) return input[lineToIndexCache];
      let lines = input.css.split("\n");
      let lineToIndex = new Array(lines.length);
      let prevIndex = 0;
      for (let i = 0, l = lines.length; i < l; i++) {
        lineToIndex[i] = prevIndex;
        prevIndex += lines[i].length + 1;
      }
      input[lineToIndexCache] = lineToIndex;
      return lineToIndex;
    }
    var Input = class {
      get from() {
        return this.file || this.id;
      }
      constructor(css, opts = {}) {
        if (css === null || typeof css === "undefined" || typeof css === "object" && !css.toString) {
          throw new Error("PostCSS received ".concat(css, " instead of CSS string"));
        }
        this.css = css.toString();
        if (this.css[0] === "\uFEFF" || this.css[0] === "\uFFFE") {
          this.hasBOM = true;
          this.css = this.css.slice(1);
        } else {
          this.hasBOM = false;
        }
        this.document = this.css;
        if (opts.document) this.document = opts.document.toString();
        if (opts.from) {
          if (!pathAvailable || /^\w+:\/\//.test(opts.from) || isAbsolute(opts.from)) {
            this.file = opts.from;
          } else {
            this.file = resolve(opts.from);
          }
        }
        if (pathAvailable && sourceMapAvailable) {
          let map = new PreviousMap(this.css, opts);
          if (map.text) {
            this.map = map;
            let file = map.consumer().file;
            if (!this.file && file) this.file = this.mapResolve(file);
          }
        }
        if (!this.file) {
          this.id = "<input css " + nanoid(6) + ">";
        }
        if (this.map) this.map.file = this.from;
      }
      error(message, line, column, opts = {}) {
        let endColumn, endLine, endOffset, offset, result;
        if (line && typeof line === "object") {
          let start = line;
          let end = column;
          if (typeof start.offset === "number") {
            offset = start.offset;
            let pos = this.fromOffset(offset);
            line = pos.line;
            column = pos.col;
          } else {
            line = start.line;
            column = start.column;
            offset = this.fromLineAndColumn(line, column);
          }
          if (typeof end.offset === "number") {
            endOffset = end.offset;
            let pos = this.fromOffset(endOffset);
            endLine = pos.line;
            endColumn = pos.col;
          } else {
            endLine = end.line;
            endColumn = end.column;
            endOffset = this.fromLineAndColumn(end.line, end.column);
          }
        } else if (!column) {
          offset = line;
          let pos = this.fromOffset(offset);
          line = pos.line;
          column = pos.col;
        } else {
          offset = this.fromLineAndColumn(line, column);
        }
        let origin = this.origin(line, column, endLine, endColumn);
        if (origin) {
          result = new CssSyntaxError(
            message,
            origin.endLine === void 0 ? origin.line : { column: origin.column, line: origin.line },
            origin.endLine === void 0 ? origin.column : { column: origin.endColumn, line: origin.endLine },
            origin.source,
            origin.file,
            opts.plugin
          );
        } else {
          result = new CssSyntaxError(
            message,
            endLine === void 0 ? line : { column, line },
            endLine === void 0 ? column : { column: endColumn, line: endLine },
            this.css,
            this.file,
            opts.plugin
          );
        }
        result.input = {
          column,
          endColumn,
          endLine,
          endOffset,
          line,
          offset,
          source: this.css
        };
        if (this.file) {
          if (pathToFileURL) {
            result.input.url = pathToFileURL(this.file).toString();
          }
          result.input.file = this.file;
        }
        return result;
      }
      fromLineAndColumn(line, column) {
        let lineToIndex = getLineToIndex(this);
        let index = lineToIndex[line - 1];
        return index + column - 1;
      }
      fromOffset(offset) {
        let lineToIndex = getLineToIndex(this);
        let lastLine = lineToIndex[lineToIndex.length - 1];
        let min = 0;
        if (offset >= lastLine) {
          min = lineToIndex.length - 1;
        } else {
          let max = lineToIndex.length - 2;
          let mid;
          while (min < max) {
            mid = min + (max - min >> 1);
            if (offset < lineToIndex[mid]) {
              max = mid - 1;
            } else if (offset >= lineToIndex[mid + 1]) {
              min = mid + 1;
            } else {
              min = mid;
              break;
            }
          }
        }
        return {
          col: offset - lineToIndex[min] + 1,
          line: min + 1
        };
      }
      mapResolve(file) {
        if (/^\w+:\/\//.test(file)) {
          return file;
        }
        return resolve(this.map.consumer().sourceRoot || this.map.root || ".", file);
      }
      origin(line, column, endLine, endColumn) {
        if (!this.map) return false;
        let consumer = this.map.consumer();
        let from = consumer.originalPositionFor({ column: column - 1, line });
        if (!from.source) return false;
        let to;
        if (typeof endLine === "number") {
          let toPosition = consumer.originalPositionFor({
            column: endColumn - 1,
            line: endLine
          });
          if (toPosition.source) to = toPosition;
        }
        let fromUrl;
        if (isAbsolute(from.source)) {
          fromUrl = pathToFileURL(from.source);
        } else {
          fromUrl = new URL(
            from.source,
            this.map.consumer().sourceRoot || pathToFileURL(this.map.mapFile)
          );
        }
        let result = {
          column: from.column + 1,
          endColumn: to && to.column + 1,
          endLine: to && to.line,
          line: from.line,
          url: fromUrl.toString()
        };
        if (fromUrl.protocol === "file:") {
          if (fileURLToPath) {
            result.file = fileURLToPath(fromUrl);
          } else {
            throw new Error("file: protocol is not available in this PostCSS build");
          }
        }
        let source = consumer.sourceContentFor(from.source);
        if (source) result.source = source;
        return result;
      }
      toJSON() {
        let json = {};
        for (let name of ["hasBOM", "css", "file", "id"]) {
          if (this[name] != null) {
            json[name] = this[name];
          }
        }
        if (this.map) {
          json.map = { ...this.map };
          if (json.map.consumerCache) {
            json.map.consumerCache = void 0;
          }
        }
        return json;
      }
    };
    module.exports = Input;
    Input.default = Input;
    if (terminalHighlight && terminalHighlight.registerInput) {
      terminalHighlight.registerInput(Input);
    }
  }
});

export {
  require_url,
  require_input
};

import {
  __commonJS
} from "./shared-4f53cda18c2b.mjs";

// (disabled):convo-email-agent/fs
var require_fs = __commonJS({
  "(disabled):fs"() {
    "use strict";
  }
});

// (disabled):convo-email-agent/path
var require_path = __commonJS({
  "(disabled):path"() {
    "use strict";
  }
});

// (disabled):editor/ui-editor-ui/node_modules/source-map-js/source-map.js
var require_source_map = __commonJS({
  "(disabled):../editor/ui-editor-ui/node_modules/source-map-js/source-map.js"() {
    "use strict";
  }
});

// editor/ui-editor-ui/node_modules/postcss/lib/previous-map.js
var require_previous_map = __commonJS({
  "../editor/ui-editor-ui/node_modules/postcss/lib/previous-map.js"(exports, module) {
    var { existsSync, readFileSync, realpathSync } = require_fs();
    var { dirname, isAbsolute, join, relative, sep } = require_path();
    var { SourceMapConsumer, SourceMapGenerator } = require_source_map();
    function realPath(path) {
      try {
        return realpathSync(path);
      } catch {
        return path;
      }
    }
    function fromBase64(str) {
      if (Buffer) {
        return Buffer.from(str, "base64").toString();
      } else {
        return window.atob(str);
      }
    }
    var PreviousMap = class {
      constructor(css, opts) {
        if (opts.map === false) return;
        if (opts.unsafeMap) this.unsafeMap = true;
        this.loadAnnotation(css);
        this.inline = this.startWith(this.annotation, "data:");
        let prev = opts.map ? opts.map.prev : void 0;
        let text = this.loadMap(opts.from, prev);
        if (!this.mapFile && opts.from) {
          this.mapFile = opts.from;
        }
        if (this.mapFile) this.root = dirname(this.mapFile);
        if (text) this.text = text;
      }
      consumer() {
        if (!this.consumerCache) {
          this.consumerCache = new SourceMapConsumer(this.json || this.text);
        }
        return this.consumerCache;
      }
      decodeInline(text) {
        let baseCharsetUri = /^data:application\/json;charset=utf-?8;base64,/;
        let baseUri = /^data:application\/json;base64,/;
        let charsetUri = /^data:application\/json;charset=utf-?8,/;
        let uri = /^data:application\/json,/;
        let uriMatch = text.match(charsetUri) || text.match(uri);
        if (uriMatch) {
          return decodeURIComponent(text.substr(uriMatch[0].length));
        }
        let baseUriMatch = text.match(baseCharsetUri) || text.match(baseUri);
        if (baseUriMatch) {
          return fromBase64(text.substr(baseUriMatch[0].length));
        }
        let encoding = text.slice("data:application/json;".length);
        encoding = encoding.slice(0, encoding.indexOf(","));
        throw new Error("Unsupported source map encoding " + encoding);
      }
      getAnnotationURL(sourceMapString) {
        return sourceMapString.replace(/^\/\*\s*# sourceMappingURL=/, "").trim();
      }
      isMap(map) {
        if (typeof map !== "object") return false;
        return typeof map.mappings === "string" || typeof map._mappings === "string" || Array.isArray(map.sections);
      }
      loadAnnotation(css) {
        let comments = css.match(/\/\*\s*# sourceMappingURL=/g);
        if (!comments) return;
        let start = css.lastIndexOf(comments.pop());
        let end = css.indexOf("*/", start);
        if (start > -1 && end > -1) {
          this.annotation = this.getAnnotationURL(css.substring(start, end));
        }
      }
      loadFile(path, cssFile, trusted) {
        if (!trusted && !this.unsafeMap) {
          if (!/\.map$/i.test(path)) return void 0;
          if (!cssFile) return void 0;
          let rel = relative(realPath(dirname(cssFile)), realPath(path));
          if (rel === ".." || rel.startsWith(".." + sep) || isAbsolute(rel)) {
            return void 0;
          }
        }
        this.root = dirname(path);
        if (existsSync(path)) {
          this.mapFile = path;
          return readFileSync(path, "utf-8").toString().trim();
        }
      }
      loadMap(file, prev) {
        if (prev === false) return false;
        if (prev) {
          if (typeof prev === "string") {
            return prev;
          } else if (typeof prev === "function") {
            let prevPath = prev(file);
            if (prevPath) {
              let map = this.loadFile(prevPath, file, true);
              if (!map) {
                throw new Error(
                  "Unable to load previous source map: " + prevPath.toString()
                );
              }
              return map;
            }
          } else if (prev instanceof SourceMapConsumer) {
            return SourceMapGenerator.fromSourceMap(prev).toString();
          } else if (prev instanceof SourceMapGenerator) {
            return prev.toString();
          } else if (this.isMap(prev)) {
            return JSON.stringify(prev);
          } else {
            throw new Error(
              "Unsupported previous source map format: " + prev.toString()
            );
          }
        } else if (this.inline) {
          return this.decodeInline(this.annotation);
        } else if (this.annotation) {
          let map = this.annotation;
          if (file) map = join(dirname(file), map);
          let unknown = this.loadFile(map, file, false);
          if (unknown) {
            try {
              this.json = JSON.parse(unknown.replace(/^\)]}'[^\n]*\n/, ""));
            } catch {
              return void 0;
            }
          }
          return unknown;
        }
      }
      startWith(string, start) {
        if (!string) return false;
        return string.substr(0, start.length) === start;
      }
      withContent() {
        return !!(this.consumer().sourcesContent && this.consumer().sourcesContent.length > 0);
      }
    };
    module.exports = PreviousMap;
    PreviousMap.default = PreviousMap;
  }
});

export {
  require_path,
  require_source_map,
  require_previous_map
};

import {
  LINK_COLOR_HOVER_VARS,
  MasterCssVar
} from "./ue-proto-87c1854705b4.mjs";
import {
  require_ListCache,
  require_Map,
  require_MapCache,
  require_Symbol,
  require_arrayMap,
  require_baseGet,
  require_baseGetTag,
  require_baseSet,
  require_castPath,
  require_eq,
  require_freeGlobal,
  require_getNative,
  require_isArray,
  require_isFunction,
  require_isIndex,
  require_isKey,
  require_isObject,
  require_isObjectLike,
  require_root,
  require_toKey,
  require_toSource
} from "./_Hash-6a5a8be86833.mjs";
import {
  __commonJS,
  __toESM
} from "./shared-4f53cda18c2b.mjs";

// editor/ui-editor-common/node_modules/lodash/_stackClear.js
var require_stackClear = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_stackClear.js"(exports, module) {
    "use strict";
    var ListCache = require_ListCache();
    function stackClear() {
      this.__data__ = new ListCache();
      this.size = 0;
    }
    module.exports = stackClear;
  }
});

// editor/ui-editor-common/node_modules/lodash/_stackDelete.js
var require_stackDelete = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_stackDelete.js"(exports, module) {
    "use strict";
    function stackDelete(key) {
      var data = this.__data__, result = data["delete"](key);
      this.size = data.size;
      return result;
    }
    module.exports = stackDelete;
  }
});

// editor/ui-editor-common/node_modules/lodash/_stackGet.js
var require_stackGet = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_stackGet.js"(exports, module) {
    "use strict";
    function stackGet(key) {
      return this.__data__.get(key);
    }
    module.exports = stackGet;
  }
});

// editor/ui-editor-common/node_modules/lodash/_stackHas.js
var require_stackHas = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_stackHas.js"(exports, module) {
    "use strict";
    function stackHas(key) {
      return this.__data__.has(key);
    }
    module.exports = stackHas;
  }
});

// editor/ui-editor-common/node_modules/lodash/_stackSet.js
var require_stackSet = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_stackSet.js"(exports, module) {
    "use strict";
    var ListCache = require_ListCache();
    var Map = require_Map();
    var MapCache = require_MapCache();
    var LARGE_ARRAY_SIZE = 200;
    function stackSet(key, value) {
      var data = this.__data__;
      if (data instanceof ListCache) {
        var pairs = data.__data__;
        if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
          pairs.push([key, value]);
          this.size = ++data.size;
          return this;
        }
        data = this.__data__ = new MapCache(pairs);
      }
      data.set(key, value);
      this.size = data.size;
      return this;
    }
    module.exports = stackSet;
  }
});

// editor/ui-editor-common/node_modules/lodash/_Stack.js
var require_Stack = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_Stack.js"(exports, module) {
    "use strict";
    var ListCache = require_ListCache();
    var stackClear = require_stackClear();
    var stackDelete = require_stackDelete();
    var stackGet = require_stackGet();
    var stackHas = require_stackHas();
    var stackSet = require_stackSet();
    function Stack(entries) {
      var data = this.__data__ = new ListCache(entries);
      this.size = data.size;
    }
    Stack.prototype.clear = stackClear;
    Stack.prototype["delete"] = stackDelete;
    Stack.prototype.get = stackGet;
    Stack.prototype.has = stackHas;
    Stack.prototype.set = stackSet;
    module.exports = Stack;
  }
});

// editor/ui-editor-common/node_modules/lodash/_setCacheAdd.js
var require_setCacheAdd = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_setCacheAdd.js"(exports, module) {
    "use strict";
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    function setCacheAdd(value) {
      this.__data__.set(value, HASH_UNDEFINED);
      return this;
    }
    module.exports = setCacheAdd;
  }
});

// editor/ui-editor-common/node_modules/lodash/_setCacheHas.js
var require_setCacheHas = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_setCacheHas.js"(exports, module) {
    "use strict";
    function setCacheHas(value) {
      return this.__data__.has(value);
    }
    module.exports = setCacheHas;
  }
});

// editor/ui-editor-common/node_modules/lodash/_SetCache.js
var require_SetCache = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_SetCache.js"(exports, module) {
    "use strict";
    var MapCache = require_MapCache();
    var setCacheAdd = require_setCacheAdd();
    var setCacheHas = require_setCacheHas();
    function SetCache(values) {
      var index = -1, length = values == null ? 0 : values.length;
      this.__data__ = new MapCache();
      while (++index < length) {
        this.add(values[index]);
      }
    }
    SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
    SetCache.prototype.has = setCacheHas;
    module.exports = SetCache;
  }
});

// editor/ui-editor-common/node_modules/lodash/_arraySome.js
var require_arraySome = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_arraySome.js"(exports, module) {
    "use strict";
    function arraySome(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length;
      while (++index < length) {
        if (predicate(array[index], index, array)) {
          return true;
        }
      }
      return false;
    }
    module.exports = arraySome;
  }
});

// editor/ui-editor-common/node_modules/lodash/_cacheHas.js
var require_cacheHas = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_cacheHas.js"(exports, module) {
    "use strict";
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    module.exports = cacheHas;
  }
});

// editor/ui-editor-common/node_modules/lodash/_equalArrays.js
var require_equalArrays = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_equalArrays.js"(exports, module) {
    "use strict";
    var SetCache = require_SetCache();
    var arraySome = require_arraySome();
    var cacheHas = require_cacheHas();
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
      if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
        return false;
      }
      var arrStacked = stack.get(array);
      var othStacked = stack.get(other);
      if (arrStacked && othStacked) {
        return arrStacked == other && othStacked == array;
      }
      var index = -1, result = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : void 0;
      stack.set(array, other);
      stack.set(other, array);
      while (++index < arrLength) {
        var arrValue = array[index], othValue = other[index];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, arrValue, index, other, array, stack) : customizer(arrValue, othValue, index, array, other, stack);
        }
        if (compared !== void 0) {
          if (compared) {
            continue;
          }
          result = false;
          break;
        }
        if (seen) {
          if (!arraySome(other, function(othValue2, othIndex) {
            if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
              return seen.push(othIndex);
            }
          })) {
            result = false;
            break;
          }
        } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
          result = false;
          break;
        }
      }
      stack["delete"](array);
      stack["delete"](other);
      return result;
    }
    module.exports = equalArrays;
  }
});

// editor/ui-editor-common/node_modules/lodash/_Uint8Array.js
var require_Uint8Array = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_Uint8Array.js"(exports, module) {
    "use strict";
    var root = require_root();
    var Uint8Array = root.Uint8Array;
    module.exports = Uint8Array;
  }
});

// editor/ui-editor-common/node_modules/lodash/_mapToArray.js
var require_mapToArray = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_mapToArray.js"(exports, module) {
    "use strict";
    function mapToArray(map) {
      var index = -1, result = Array(map.size);
      map.forEach(function(value, key) {
        result[++index] = [key, value];
      });
      return result;
    }
    module.exports = mapToArray;
  }
});

// editor/ui-editor-common/node_modules/lodash/_setToArray.js
var require_setToArray = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_setToArray.js"(exports, module) {
    "use strict";
    function setToArray(set) {
      var index = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index] = value;
      });
      return result;
    }
    module.exports = setToArray;
  }
});

// editor/ui-editor-common/node_modules/lodash/_equalByTag.js
var require_equalByTag = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_equalByTag.js"(exports, module) {
    "use strict";
    var Symbol = require_Symbol();
    var Uint8Array = require_Uint8Array();
    var eq = require_eq();
    var equalArrays = require_equalArrays();
    var mapToArray = require_mapToArray();
    var setToArray = require_setToArray();
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var symbolTag = "[object Symbol]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var symbolProto = Symbol ? Symbol.prototype : void 0;
    var symbolValueOf = symbolProto ? symbolProto.valueOf : void 0;
    function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
      switch (tag) {
        case dataViewTag:
          if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
            return false;
          }
          object = object.buffer;
          other = other.buffer;
        case arrayBufferTag:
          if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
            return false;
          }
          return true;
        case boolTag:
        case dateTag:
        case numberTag:
          return eq(+object, +other);
        case errorTag:
          return object.name == other.name && object.message == other.message;
        case regexpTag:
        case stringTag:
          return object == other + "";
        case mapTag:
          var convert = mapToArray;
        case setTag:
          var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
          convert || (convert = setToArray);
          if (object.size != other.size && !isPartial) {
            return false;
          }
          var stacked = stack.get(object);
          if (stacked) {
            return stacked == other;
          }
          bitmask |= COMPARE_UNORDERED_FLAG;
          stack.set(object, other);
          var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
          stack["delete"](object);
          return result;
        case symbolTag:
          if (symbolValueOf) {
            return symbolValueOf.call(object) == symbolValueOf.call(other);
          }
      }
      return false;
    }
    module.exports = equalByTag;
  }
});

// editor/ui-editor-common/node_modules/lodash/_arrayPush.js
var require_arrayPush = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_arrayPush.js"(exports, module) {
    "use strict";
    function arrayPush(array, values) {
      var index = -1, length = values.length, offset = array.length;
      while (++index < length) {
        array[offset + index] = values[index];
      }
      return array;
    }
    module.exports = arrayPush;
  }
});

// editor/ui-editor-common/node_modules/lodash/_baseGetAllKeys.js
var require_baseGetAllKeys = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_baseGetAllKeys.js"(exports, module) {
    "use strict";
    var arrayPush = require_arrayPush();
    var isArray = require_isArray();
    function baseGetAllKeys(object, keysFunc, symbolsFunc) {
      var result = keysFunc(object);
      return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
    }
    module.exports = baseGetAllKeys;
  }
});

// editor/ui-editor-common/node_modules/lodash/_arrayFilter.js
var require_arrayFilter = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_arrayFilter.js"(exports, module) {
    "use strict";
    function arrayFilter(array, predicate) {
      var index = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
      while (++index < length) {
        var value = array[index];
        if (predicate(value, index, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }
    module.exports = arrayFilter;
  }
});

// editor/ui-editor-common/node_modules/lodash/stubArray.js
var require_stubArray = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/stubArray.js"(exports, module) {
    "use strict";
    function stubArray() {
      return [];
    }
    module.exports = stubArray;
  }
});

// editor/ui-editor-common/node_modules/lodash/_getSymbols.js
var require_getSymbols = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_getSymbols.js"(exports, module) {
    "use strict";
    var arrayFilter = require_arrayFilter();
    var stubArray = require_stubArray();
    var objectProto = Object.prototype;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var nativeGetSymbols = Object.getOwnPropertySymbols;
    var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
      if (object == null) {
        return [];
      }
      object = Object(object);
      return arrayFilter(nativeGetSymbols(object), function(symbol) {
        return propertyIsEnumerable.call(object, symbol);
      });
    };
    module.exports = getSymbols;
  }
});

// editor/ui-editor-common/node_modules/lodash/_baseTimes.js
var require_baseTimes = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_baseTimes.js"(exports, module) {
    "use strict";
    function baseTimes(n, iteratee) {
      var index = -1, result = Array(n);
      while (++index < n) {
        result[index] = iteratee(index);
      }
      return result;
    }
    module.exports = baseTimes;
  }
});

// editor/ui-editor-common/node_modules/lodash/_baseIsArguments.js
var require_baseIsArguments = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_baseIsArguments.js"(exports, module) {
    "use strict";
    var baseGetTag = require_baseGetTag();
    var isObjectLike = require_isObjectLike();
    var argsTag = "[object Arguments]";
    function baseIsArguments(value) {
      return isObjectLike(value) && baseGetTag(value) == argsTag;
    }
    module.exports = baseIsArguments;
  }
});

// editor/ui-editor-common/node_modules/lodash/isArguments.js
var require_isArguments = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/isArguments.js"(exports, module) {
    "use strict";
    var baseIsArguments = require_baseIsArguments();
    var isObjectLike = require_isObjectLike();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    var propertyIsEnumerable = objectProto.propertyIsEnumerable;
    var isArguments = baseIsArguments(/* @__PURE__ */ (function() {
      return arguments;
    })()) ? baseIsArguments : function(value) {
      return isObjectLike(value) && hasOwnProperty.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
    };
    module.exports = isArguments;
  }
});

// editor/ui-editor-common/node_modules/lodash/stubFalse.js
var require_stubFalse = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/stubFalse.js"(exports, module) {
    "use strict";
    function stubFalse() {
      return false;
    }
    module.exports = stubFalse;
  }
});

// editor/ui-editor-common/node_modules/lodash/isBuffer.js
var require_isBuffer = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/isBuffer.js"(exports, module) {
    "use strict";
    var root = require_root();
    var stubFalse = require_stubFalse();
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var Buffer = moduleExports ? root.Buffer : void 0;
    var nativeIsBuffer = Buffer ? Buffer.isBuffer : void 0;
    var isBuffer = nativeIsBuffer || stubFalse;
    module.exports = isBuffer;
  }
});

// editor/ui-editor-common/node_modules/lodash/isLength.js
var require_isLength = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/isLength.js"(exports, module) {
    "use strict";
    var MAX_SAFE_INTEGER = 9007199254740991;
    function isLength(value) {
      return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
    }
    module.exports = isLength;
  }
});

// editor/ui-editor-common/node_modules/lodash/_baseIsTypedArray.js
var require_baseIsTypedArray = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_baseIsTypedArray.js"(exports, module) {
    "use strict";
    var baseGetTag = require_baseGetTag();
    var isLength = require_isLength();
    var isObjectLike = require_isObjectLike();
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var boolTag = "[object Boolean]";
    var dateTag = "[object Date]";
    var errorTag = "[object Error]";
    var funcTag = "[object Function]";
    var mapTag = "[object Map]";
    var numberTag = "[object Number]";
    var objectTag = "[object Object]";
    var regexpTag = "[object RegExp]";
    var setTag = "[object Set]";
    var stringTag = "[object String]";
    var weakMapTag = "[object WeakMap]";
    var arrayBufferTag = "[object ArrayBuffer]";
    var dataViewTag = "[object DataView]";
    var float32Tag = "[object Float32Array]";
    var float64Tag = "[object Float64Array]";
    var int8Tag = "[object Int8Array]";
    var int16Tag = "[object Int16Array]";
    var int32Tag = "[object Int32Array]";
    var uint8Tag = "[object Uint8Array]";
    var uint8ClampedTag = "[object Uint8ClampedArray]";
    var uint16Tag = "[object Uint16Array]";
    var uint32Tag = "[object Uint32Array]";
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    function baseIsTypedArray(value) {
      return isObjectLike(value) && isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
    }
    module.exports = baseIsTypedArray;
  }
});

// editor/ui-editor-common/node_modules/lodash/_baseUnary.js
var require_baseUnary = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_baseUnary.js"(exports, module) {
    "use strict";
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    module.exports = baseUnary;
  }
});

// editor/ui-editor-common/node_modules/lodash/_nodeUtil.js
var require_nodeUtil = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_nodeUtil.js"(exports, module) {
    "use strict";
    var freeGlobal = require_freeGlobal();
    var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
    var freeModule = freeExports && typeof module == "object" && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal.process;
    var nodeUtil = (function() {
      try {
        var types = freeModule && freeModule.require && freeModule.require("util").types;
        if (types) {
          return types;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e) {
      }
    })();
    module.exports = nodeUtil;
  }
});

// editor/ui-editor-common/node_modules/lodash/isTypedArray.js
var require_isTypedArray = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/isTypedArray.js"(exports, module) {
    "use strict";
    var baseIsTypedArray = require_baseIsTypedArray();
    var baseUnary = require_baseUnary();
    var nodeUtil = require_nodeUtil();
    var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
    module.exports = isTypedArray;
  }
});

// editor/ui-editor-common/node_modules/lodash/_arrayLikeKeys.js
var require_arrayLikeKeys = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_arrayLikeKeys.js"(exports, module) {
    "use strict";
    var baseTimes = require_baseTimes();
    var isArguments = require_isArguments();
    var isArray = require_isArray();
    var isBuffer = require_isBuffer();
    var isIndex = require_isIndex();
    var isTypedArray = require_isTypedArray();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function arrayLikeKeys(value, inherited) {
      var isArr = isArray(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result = skipIndexes ? baseTimes(value.length, String) : [], length = result.length;
      for (var key in value) {
        if ((inherited || hasOwnProperty.call(value, key)) && !(skipIndexes && // Safari 9 has enumerable `arguments.length` in strict mode.
        (key == "length" || // Node.js 0.10 has enumerable non-index properties on buffers.
        isBuff && (key == "offset" || key == "parent") || // PhantomJS 2 has enumerable non-index properties on typed arrays.
        isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || // Skip index properties.
        isIndex(key, length)))) {
          result.push(key);
        }
      }
      return result;
    }
    module.exports = arrayLikeKeys;
  }
});

// editor/ui-editor-common/node_modules/lodash/_isPrototype.js
var require_isPrototype = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_isPrototype.js"(exports, module) {
    "use strict";
    var objectProto = Object.prototype;
    function isPrototype(value) {
      var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto;
      return value === proto;
    }
    module.exports = isPrototype;
  }
});

// editor/ui-editor-common/node_modules/lodash/_overArg.js
var require_overArg = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_overArg.js"(exports, module) {
    "use strict";
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    module.exports = overArg;
  }
});

// editor/ui-editor-common/node_modules/lodash/_nativeKeys.js
var require_nativeKeys = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_nativeKeys.js"(exports, module) {
    "use strict";
    var overArg = require_overArg();
    var nativeKeys = overArg(Object.keys, Object);
    module.exports = nativeKeys;
  }
});

// editor/ui-editor-common/node_modules/lodash/_baseKeys.js
var require_baseKeys = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_baseKeys.js"(exports, module) {
    "use strict";
    var isPrototype = require_isPrototype();
    var nativeKeys = require_nativeKeys();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function baseKeys(object) {
      if (!isPrototype(object)) {
        return nativeKeys(object);
      }
      var result = [];
      for (var key in Object(object)) {
        if (hasOwnProperty.call(object, key) && key != "constructor") {
          result.push(key);
        }
      }
      return result;
    }
    module.exports = baseKeys;
  }
});

// editor/ui-editor-common/node_modules/lodash/isArrayLike.js
var require_isArrayLike = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/isArrayLike.js"(exports, module) {
    "use strict";
    var isFunction = require_isFunction();
    var isLength = require_isLength();
    function isArrayLike(value) {
      return value != null && isLength(value.length) && !isFunction(value);
    }
    module.exports = isArrayLike;
  }
});

// editor/ui-editor-common/node_modules/lodash/keys.js
var require_keys = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/keys.js"(exports, module) {
    "use strict";
    var arrayLikeKeys = require_arrayLikeKeys();
    var baseKeys = require_baseKeys();
    var isArrayLike = require_isArrayLike();
    function keys(object) {
      return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
    }
    module.exports = keys;
  }
});

// editor/ui-editor-common/node_modules/lodash/_getAllKeys.js
var require_getAllKeys = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_getAllKeys.js"(exports, module) {
    "use strict";
    var baseGetAllKeys = require_baseGetAllKeys();
    var getSymbols = require_getSymbols();
    var keys = require_keys();
    function getAllKeys(object) {
      return baseGetAllKeys(object, keys, getSymbols);
    }
    module.exports = getAllKeys;
  }
});

// editor/ui-editor-common/node_modules/lodash/_equalObjects.js
var require_equalObjects = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_equalObjects.js"(exports, module) {
    "use strict";
    var getAllKeys = require_getAllKeys();
    var COMPARE_PARTIAL_FLAG = 1;
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
      var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
      if (objLength != othLength && !isPartial) {
        return false;
      }
      var index = objLength;
      while (index--) {
        var key = objProps[index];
        if (!(isPartial ? key in other : hasOwnProperty.call(other, key))) {
          return false;
        }
      }
      var objStacked = stack.get(object);
      var othStacked = stack.get(other);
      if (objStacked && othStacked) {
        return objStacked == other && othStacked == object;
      }
      var result = true;
      stack.set(object, other);
      stack.set(other, object);
      var skipCtor = isPartial;
      while (++index < objLength) {
        key = objProps[index];
        var objValue = object[key], othValue = other[key];
        if (customizer) {
          var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
        }
        if (!(compared === void 0 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
          result = false;
          break;
        }
        skipCtor || (skipCtor = key == "constructor");
      }
      if (result && !skipCtor) {
        var objCtor = object.constructor, othCtor = other.constructor;
        if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
          result = false;
        }
      }
      stack["delete"](object);
      stack["delete"](other);
      return result;
    }
    module.exports = equalObjects;
  }
});

// editor/ui-editor-common/node_modules/lodash/_DataView.js
var require_DataView = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_DataView.js"(exports, module) {
    "use strict";
    var getNative = require_getNative();
    var root = require_root();
    var DataView = getNative(root, "DataView");
    module.exports = DataView;
  }
});

// editor/ui-editor-common/node_modules/lodash/_Promise.js
var require_Promise = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_Promise.js"(exports, module) {
    "use strict";
    var getNative = require_getNative();
    var root = require_root();
    var Promise2 = getNative(root, "Promise");
    module.exports = Promise2;
  }
});

// editor/ui-editor-common/node_modules/lodash/_Set.js
var require_Set = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_Set.js"(exports, module) {
    "use strict";
    var getNative = require_getNative();
    var root = require_root();
    var Set = getNative(root, "Set");
    module.exports = Set;
  }
});

// editor/ui-editor-common/node_modules/lodash/_WeakMap.js
var require_WeakMap = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_WeakMap.js"(exports, module) {
    "use strict";
    var getNative = require_getNative();
    var root = require_root();
    var WeakMap = getNative(root, "WeakMap");
    module.exports = WeakMap;
  }
});

// editor/ui-editor-common/node_modules/lodash/_getTag.js
var require_getTag = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_getTag.js"(exports, module) {
    "use strict";
    var DataView = require_DataView();
    var Map = require_Map();
    var Promise2 = require_Promise();
    var Set = require_Set();
    var WeakMap = require_WeakMap();
    var baseGetTag = require_baseGetTag();
    var toSource = require_toSource();
    var mapTag = "[object Map]";
    var objectTag = "[object Object]";
    var promiseTag = "[object Promise]";
    var setTag = "[object Set]";
    var weakMapTag = "[object WeakMap]";
    var dataViewTag = "[object DataView]";
    var dataViewCtorString = toSource(DataView);
    var mapCtorString = toSource(Map);
    var promiseCtorString = toSource(Promise2);
    var setCtorString = toSource(Set);
    var weakMapCtorString = toSource(WeakMap);
    var getTag = baseGetTag;
    if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
      getTag = function(value) {
        var result = baseGetTag(value), Ctor = result == objectTag ? value.constructor : void 0, ctorString = Ctor ? toSource(Ctor) : "";
        if (ctorString) {
          switch (ctorString) {
            case dataViewCtorString:
              return dataViewTag;
            case mapCtorString:
              return mapTag;
            case promiseCtorString:
              return promiseTag;
            case setCtorString:
              return setTag;
            case weakMapCtorString:
              return weakMapTag;
          }
        }
        return result;
      };
    }
    module.exports = getTag;
  }
});

// editor/ui-editor-common/node_modules/lodash/_baseIsEqualDeep.js
var require_baseIsEqualDeep = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_baseIsEqualDeep.js"(exports, module) {
    "use strict";
    var Stack = require_Stack();
    var equalArrays = require_equalArrays();
    var equalByTag = require_equalByTag();
    var equalObjects = require_equalObjects();
    var getTag = require_getTag();
    var isArray = require_isArray();
    var isBuffer = require_isBuffer();
    var isTypedArray = require_isTypedArray();
    var COMPARE_PARTIAL_FLAG = 1;
    var argsTag = "[object Arguments]";
    var arrayTag = "[object Array]";
    var objectTag = "[object Object]";
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
      var objIsArr = isArray(object), othIsArr = isArray(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
      objTag = objTag == argsTag ? objectTag : objTag;
      othTag = othTag == argsTag ? objectTag : othTag;
      var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
      if (isSameTag && isBuffer(object)) {
        if (!isBuffer(other)) {
          return false;
        }
        objIsArr = true;
        objIsObj = false;
      }
      if (isSameTag && !objIsObj) {
        stack || (stack = new Stack());
        return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
      }
      if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
        var objIsWrapped = objIsObj && hasOwnProperty.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty.call(other, "__wrapped__");
        if (objIsWrapped || othIsWrapped) {
          var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
          stack || (stack = new Stack());
          return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
        }
      }
      if (!isSameTag) {
        return false;
      }
      stack || (stack = new Stack());
      return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
    }
    module.exports = baseIsEqualDeep;
  }
});

// editor/ui-editor-common/node_modules/lodash/_baseIsEqual.js
var require_baseIsEqual = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_baseIsEqual.js"(exports, module) {
    "use strict";
    var baseIsEqualDeep = require_baseIsEqualDeep();
    var isObjectLike = require_isObjectLike();
    function baseIsEqual(value, other, bitmask, customizer, stack) {
      if (value === other) {
        return true;
      }
      if (value == null || other == null || !isObjectLike(value) && !isObjectLike(other)) {
        return value !== value && other !== other;
      }
      return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
    }
    module.exports = baseIsEqual;
  }
});

// editor/ui-editor-common/node_modules/lodash/_baseIsMatch.js
var require_baseIsMatch = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_baseIsMatch.js"(exports, module) {
    "use strict";
    var Stack = require_Stack();
    var baseIsEqual = require_baseIsEqual();
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    function baseIsMatch(object, source, matchData, customizer) {
      var index = matchData.length, length = index, noCustomizer = !customizer;
      if (object == null) {
        return !length;
      }
      object = Object(object);
      while (index--) {
        var data = matchData[index];
        if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
          return false;
        }
      }
      while (++index < length) {
        data = matchData[index];
        var key = data[0], objValue = object[key], srcValue = data[1];
        if (noCustomizer && data[2]) {
          if (objValue === void 0 && !(key in object)) {
            return false;
          }
        } else {
          var stack = new Stack();
          if (customizer) {
            var result = customizer(objValue, srcValue, key, object, source, stack);
          }
          if (!(result === void 0 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result)) {
            return false;
          }
        }
      }
      return true;
    }
    module.exports = baseIsMatch;
  }
});

// editor/ui-editor-common/node_modules/lodash/_isStrictComparable.js
var require_isStrictComparable = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_isStrictComparable.js"(exports, module) {
    "use strict";
    var isObject = require_isObject();
    function isStrictComparable(value) {
      return value === value && !isObject(value);
    }
    module.exports = isStrictComparable;
  }
});

// editor/ui-editor-common/node_modules/lodash/_getMatchData.js
var require_getMatchData = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_getMatchData.js"(exports, module) {
    "use strict";
    var isStrictComparable = require_isStrictComparable();
    var keys = require_keys();
    function getMatchData(object) {
      var result = keys(object), length = result.length;
      while (length--) {
        var key = result[length], value = object[key];
        result[length] = [key, value, isStrictComparable(value)];
      }
      return result;
    }
    module.exports = getMatchData;
  }
});

// editor/ui-editor-common/node_modules/lodash/_matchesStrictComparable.js
var require_matchesStrictComparable = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_matchesStrictComparable.js"(exports, module) {
    "use strict";
    function matchesStrictComparable(key, srcValue) {
      return function(object) {
        if (object == null) {
          return false;
        }
        return object[key] === srcValue && (srcValue !== void 0 || key in Object(object));
      };
    }
    module.exports = matchesStrictComparable;
  }
});

// editor/ui-editor-common/node_modules/lodash/_baseMatches.js
var require_baseMatches = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_baseMatches.js"(exports, module) {
    "use strict";
    var baseIsMatch = require_baseIsMatch();
    var getMatchData = require_getMatchData();
    var matchesStrictComparable = require_matchesStrictComparable();
    function baseMatches(source) {
      var matchData = getMatchData(source);
      if (matchData.length == 1 && matchData[0][2]) {
        return matchesStrictComparable(matchData[0][0], matchData[0][1]);
      }
      return function(object) {
        return object === source || baseIsMatch(object, source, matchData);
      };
    }
    module.exports = baseMatches;
  }
});

// editor/ui-editor-common/node_modules/lodash/get.js
var require_get = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/get.js"(exports, module) {
    "use strict";
    var baseGet = require_baseGet();
    function get(object, path, defaultValue) {
      var result = object == null ? void 0 : baseGet(object, path);
      return result === void 0 ? defaultValue : result;
    }
    module.exports = get;
  }
});

// editor/ui-editor-common/node_modules/lodash/_baseHasIn.js
var require_baseHasIn = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_baseHasIn.js"(exports, module) {
    "use strict";
    function baseHasIn(object, key) {
      return object != null && key in Object(object);
    }
    module.exports = baseHasIn;
  }
});

// editor/ui-editor-common/node_modules/lodash/_hasPath.js
var require_hasPath = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_hasPath.js"(exports, module) {
    "use strict";
    var castPath = require_castPath();
    var isArguments = require_isArguments();
    var isArray = require_isArray();
    var isIndex = require_isIndex();
    var isLength = require_isLength();
    var toKey = require_toKey();
    function hasPath(object, path, hasFunc) {
      path = castPath(path, object);
      var index = -1, length = path.length, result = false;
      while (++index < length) {
        var key = toKey(path[index]);
        if (!(result = object != null && hasFunc(object, key))) {
          break;
        }
        object = object[key];
      }
      if (result || ++index != length) {
        return result;
      }
      length = object == null ? 0 : object.length;
      return !!length && isLength(length) && isIndex(key, length) && (isArray(object) || isArguments(object));
    }
    module.exports = hasPath;
  }
});

// editor/ui-editor-common/node_modules/lodash/hasIn.js
var require_hasIn = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/hasIn.js"(exports, module) {
    "use strict";
    var baseHasIn = require_baseHasIn();
    var hasPath = require_hasPath();
    function hasIn(object, path) {
      return object != null && hasPath(object, path, baseHasIn);
    }
    module.exports = hasIn;
  }
});

// editor/ui-editor-common/node_modules/lodash/_baseMatchesProperty.js
var require_baseMatchesProperty = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_baseMatchesProperty.js"(exports, module) {
    "use strict";
    var baseIsEqual = require_baseIsEqual();
    var get = require_get();
    var hasIn = require_hasIn();
    var isKey = require_isKey();
    var isStrictComparable = require_isStrictComparable();
    var matchesStrictComparable = require_matchesStrictComparable();
    var toKey = require_toKey();
    var COMPARE_PARTIAL_FLAG = 1;
    var COMPARE_UNORDERED_FLAG = 2;
    function baseMatchesProperty(path, srcValue) {
      if (isKey(path) && isStrictComparable(srcValue)) {
        return matchesStrictComparable(toKey(path), srcValue);
      }
      return function(object) {
        var objValue = get(object, path);
        return objValue === void 0 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
      };
    }
    module.exports = baseMatchesProperty;
  }
});

// editor/ui-editor-common/node_modules/lodash/identity.js
var require_identity = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/identity.js"(exports, module) {
    "use strict";
    function identity(value) {
      return value;
    }
    module.exports = identity;
  }
});

// editor/ui-editor-common/node_modules/lodash/_baseProperty.js
var require_baseProperty = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_baseProperty.js"(exports, module) {
    "use strict";
    function baseProperty(key) {
      return function(object) {
        return object == null ? void 0 : object[key];
      };
    }
    module.exports = baseProperty;
  }
});

// editor/ui-editor-common/node_modules/lodash/_basePropertyDeep.js
var require_basePropertyDeep = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_basePropertyDeep.js"(exports, module) {
    "use strict";
    var baseGet = require_baseGet();
    function basePropertyDeep(path) {
      return function(object) {
        return baseGet(object, path);
      };
    }
    module.exports = basePropertyDeep;
  }
});

// editor/ui-editor-common/node_modules/lodash/property.js
var require_property = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/property.js"(exports, module) {
    "use strict";
    var baseProperty = require_baseProperty();
    var basePropertyDeep = require_basePropertyDeep();
    var isKey = require_isKey();
    var toKey = require_toKey();
    function property(path) {
      return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
    }
    module.exports = property;
  }
});

// editor/ui-editor-common/node_modules/lodash/_baseIteratee.js
var require_baseIteratee = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_baseIteratee.js"(exports, module) {
    "use strict";
    var baseMatches = require_baseMatches();
    var baseMatchesProperty = require_baseMatchesProperty();
    var identity = require_identity();
    var isArray = require_isArray();
    var property = require_property();
    function baseIteratee(value) {
      if (typeof value == "function") {
        return value;
      }
      if (value == null) {
        return identity;
      }
      if (typeof value == "object") {
        return isArray(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
      }
      return property(value);
    }
    module.exports = baseIteratee;
  }
});

// editor/ui-editor-common/node_modules/lodash/_basePickBy.js
var require_basePickBy = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_basePickBy.js"(exports, module) {
    "use strict";
    var baseGet = require_baseGet();
    var baseSet = require_baseSet();
    var castPath = require_castPath();
    function basePickBy(object, paths, predicate) {
      var index = -1, length = paths.length, result = {};
      while (++index < length) {
        var path = paths[index], value = baseGet(object, path);
        if (predicate(value, path)) {
          baseSet(result, castPath(path, object), value);
        }
      }
      return result;
    }
    module.exports = basePickBy;
  }
});

// editor/ui-editor-common/node_modules/lodash/_getPrototype.js
var require_getPrototype = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_getPrototype.js"(exports, module) {
    "use strict";
    var overArg = require_overArg();
    var getPrototype = overArg(Object.getPrototypeOf, Object);
    module.exports = getPrototype;
  }
});

// editor/ui-editor-common/node_modules/lodash/_getSymbolsIn.js
var require_getSymbolsIn = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_getSymbolsIn.js"(exports, module) {
    "use strict";
    var arrayPush = require_arrayPush();
    var getPrototype = require_getPrototype();
    var getSymbols = require_getSymbols();
    var stubArray = require_stubArray();
    var nativeGetSymbols = Object.getOwnPropertySymbols;
    var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
      var result = [];
      while (object) {
        arrayPush(result, getSymbols(object));
        object = getPrototype(object);
      }
      return result;
    };
    module.exports = getSymbolsIn;
  }
});

// editor/ui-editor-common/node_modules/lodash/_nativeKeysIn.js
var require_nativeKeysIn = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_nativeKeysIn.js"(exports, module) {
    "use strict";
    function nativeKeysIn(object) {
      var result = [];
      if (object != null) {
        for (var key in Object(object)) {
          result.push(key);
        }
      }
      return result;
    }
    module.exports = nativeKeysIn;
  }
});

// editor/ui-editor-common/node_modules/lodash/_baseKeysIn.js
var require_baseKeysIn = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_baseKeysIn.js"(exports, module) {
    "use strict";
    var isObject = require_isObject();
    var isPrototype = require_isPrototype();
    var nativeKeysIn = require_nativeKeysIn();
    var objectProto = Object.prototype;
    var hasOwnProperty = objectProto.hasOwnProperty;
    function baseKeysIn(object) {
      if (!isObject(object)) {
        return nativeKeysIn(object);
      }
      var isProto = isPrototype(object), result = [];
      for (var key in object) {
        if (!(key == "constructor" && (isProto || !hasOwnProperty.call(object, key)))) {
          result.push(key);
        }
      }
      return result;
    }
    module.exports = baseKeysIn;
  }
});

// editor/ui-editor-common/node_modules/lodash/keysIn.js
var require_keysIn = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/keysIn.js"(exports, module) {
    "use strict";
    var arrayLikeKeys = require_arrayLikeKeys();
    var baseKeysIn = require_baseKeysIn();
    var isArrayLike = require_isArrayLike();
    function keysIn(object) {
      return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
    }
    module.exports = keysIn;
  }
});

// editor/ui-editor-common/node_modules/lodash/_getAllKeysIn.js
var require_getAllKeysIn = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/_getAllKeysIn.js"(exports, module) {
    "use strict";
    var baseGetAllKeys = require_baseGetAllKeys();
    var getSymbolsIn = require_getSymbolsIn();
    var keysIn = require_keysIn();
    function getAllKeysIn(object) {
      return baseGetAllKeys(object, keysIn, getSymbolsIn);
    }
    module.exports = getAllKeysIn;
  }
});

// editor/ui-editor-common/node_modules/lodash/pickBy.js
var require_pickBy = __commonJS({
  "../editor/ui-editor-common/node_modules/lodash/pickBy.js"(exports, module) {
    "use strict";
    var arrayMap = require_arrayMap();
    var baseIteratee = require_baseIteratee();
    var basePickBy = require_basePickBy();
    var getAllKeysIn = require_getAllKeysIn();
    function pickBy2(object, predicate) {
      if (object == null) {
        return {};
      }
      var props = arrayMap(getAllKeysIn(object), function(prop) {
        return [prop];
      });
      predicate = baseIteratee(predicate);
      return basePickBy(object, props, function(value, path) {
        return predicate(value, path[0]);
      });
    }
    module.exports = pickBy2;
  }
});

// editor/ui-editor-common/tools/operators.ts
var import_pickBy = __toESM(require_pickBy());
var isString = (v) => typeof v === "string" || v instanceof String;
var isNumber = (v) => !isNaN(parseFloat(v)) && isFinite(v);

// editor/ui-editor-ui/src/app/tools/utils/VariablesUtils.ts
var VariablesUtils = class _VariablesUtils {
  static {
    /**
     * @description Some document.variables and their selectors which are responsible for hiding the element
     */
    this.varsPropertySelectors = {
      [MasterCssVar.BUTTONS_OUTLOOK_SUPPORT]: [{ selectors: [".es-button-border"], attributes: ["mso-hide"] }],
      [MasterCssVar.ADAPT_DESIGN]: [{ selectors: ["@media only screen and (max-width: 600px)"] }, {
        selectors: ["@media only screen and (max-width: 0px)"],
        /* need to replace @media only screen and (max-width: 0px) to @media only screen and (max-width: 600px)
          in case when responsive design is off (we need remove @media only screen and (max-width: 600px)) and add
          media section with Styles for hidden elements only
         */
        selectorReplace: "@media only screen and (max-width: 600px)",
        varValueFunc: ((v) => !v)
      }],
      [MasterCssVar.RTL_TEXT]: [
        { selectors: ["h1, h2, h3, h4, h5, h6, input, label, textarea, p, ol, ul, .es-menu a, .es-table", ".es-table[dir]"] },
        { selectors: ["ul, ol"], varValueFunc: (rtlVar, _variables) => !rtlVar },
        { selectors: ["ol, ul"], varValueFunc: (rtlVar, _variables) => !!rtlVar }
      ],
      [MasterCssVar.ADAPT_BUTTON_PADDING]: [{ selectors: ["a.es-button, button.es-button"], attributes: ["padding"], isResponsive: true }],
      [MasterCssVar.BUTTON_HAS_HOVER]: [
        { selectors: [".es-button-border:hover"] },
        { selectors: [".es-button-border:hover a.es-button,.es-button-border:hover button.es-button,.es-button-border:hover label.es-button"] },
        {
          selectors: [".es-button-border:hover > a.es-button"],
          varValueFunc: ((buttonsHasHover, variables) => {
            return !buttonsHasHover && LINK_COLOR_HOVER_VARS.some((varName) => variables[varName]);
          })
        }
      ],
      [MasterCssVar.HEADER_LINK_COLOR_HOVER]: [
        { selectors: [".es-header-body a:hover"] }
      ],
      [MasterCssVar.CONTENT_LINK_COLOR_HOVER]: [
        { selectors: [".es-content-body a:hover"] }
      ],
      [MasterCssVar.FOOTER_LINK_COLOR_HOVER]: [
        { selectors: [".es-footer-body a:hover"] }
      ],
      [MasterCssVar.INFO_LINK_COLOR_HOVER]: [
        { selectors: [".es-infoblock a:hover"] }
      ],
      [MasterCssVar.MESSAGE_HAS_AMP_AND_ROLLOVER]: [
        { selectors: ["@media only screen and (max-width: 3000px)"] }
      ],
      [MasterCssVar.MESSAGE_HAS_AMP_ACCORDION]: [
        { selectors: [".section-title", ".section-title amp-img", "section[expanded] .section-title amp-img"] }
      ],
      [MasterCssVar.MESSAGE_HAS_AMP_FORM]: [
        { selectors: [
          "input, textarea",
          "textarea",
          "form button",
          "form div[submit-error]",
          "form div[submit-error] p, form div[submit-error] li, form div[submit-error] h1, form div[submit-error] h2, form div[submit-error] h3, form div[submit-error] h4, form div[submit-error] h5, form div[submit-error] h6"
        ] }
      ],
      [MasterCssVar.MESSAGE_HAS_AMP_CAROUSEL]: [
        { selectors: ["u + .body img ~ div #htmlfallback, u + .body img ~ div #fallback"] }
      ],
      [MasterCssVar.HIDE_IMAGE_DOWNLOAD_ICONS]: [
        {
          selectors: ["u + .body img ~ div div"],
          varValueFunc: (value) => value === void 0 ? true : Boolean(value)
        }
      ]
    };
  }
  static {
    this.varsOutlookPropertySelectors = {};
  }
  static {
    this.varsCustomPropertySelectors = {
      [MasterCssVar.ADAPT_DESIGN]: [{ selectors: ["@media only screen and (max-width: 600px)"] }, {
        selectors: ["@media only screen and (max-width: 0px)"],
        selectorReplace: "@media only screen and (max-width: 600px)",
        varValueFunc: ((v) => !v)
      }]
    };
  }
  static {
    this.varsPropertySelectorsMap = {
      [0 /* MASTER_CSS */]: _VariablesUtils.varsPropertySelectors,
      [1 /* MASTER_OUTLOOK_CSS */]: _VariablesUtils.varsOutlookPropertySelectors,
      [2 /* CUSTOM_CSS */]: _VariablesUtils.varsCustomPropertySelectors
    };
  }
  static {
    this.selectorsCache = {};
  }
  static getSpecialDisplayVariableProperty(selector, masterCssType = 0 /* MASTER_CSS */, isResponsive) {
    if (!selector) {
      return null;
    }
    const match = _VariablesUtils.findSelectorMatch(
      selector,
      masterCssType,
      isResponsive,
      (value2) => value2.attributes === void 0
    );
    if (!match) {
      return null;
    }
    const { key, value } = match;
    const { selectorReplace, varValueFunc } = value;
    return {
      name: key,
      replace: selectorReplace,
      valueFunc: varValueFunc || ((v) => value.isNegative ? !v : Boolean(v))
    };
  }
  static getSpecialDisplayAttributeProperty(selector, attribute, masterCssType = 0 /* MASTER_CSS */, isResponsive) {
    if (!selector) {
      return null;
    }
    const match = _VariablesUtils.findSelectorMatch(
      selector,
      masterCssType,
      isResponsive,
      (value) => {
        const attributes = value.attributes ?? [];
        return attributes.length > 0 && attributes.includes(attribute);
      }
    );
    return match ? { name: match.key } : null;
  }
  static allowsSpaceCombinator(char) {
    return !!char && char !== " " && char !== "," && char !== "\n" && char !== "\r" && char !== ">";
  }
  static getMinifiedSelector(s) {
    if (!this.selectorsCache[s]) {
      const characters = [];
      for (let i = 0; i < s.length; i++) {
        const c = s.charAt(i);
        if (c === "\n" || c === "\r") {
          continue;
        } else if (c === " ") {
          const prevC = characters[characters.length - 1];
          const nextC = s.charAt(i + 1);
          if (this.allowsSpaceCombinator(prevC) && this.allowsSpaceCombinator(nextC)) {
            characters.push(c);
          }
        } else {
          characters.push(c);
        }
      }
      this.selectorsCache[s] = characters.join("");
    }
    return this.selectorsCache[s];
  }
  static areSelectorsEqual(s1, compare) {
    if (!s1 || !compare) {
      return false;
    }
    if (compare instanceof RegExp) {
      return compare.test(s1);
    }
    if (s1 === compare) {
      return true;
    }
    return _VariablesUtils.getMinifiedSelector(s1) === _VariablesUtils.getMinifiedSelector(compare);
  }
  static getValue(variables, name) {
    const value = variables[name];
    if (isNumber(value)) {
      return value;
    }
    if (isString(value)) {
      const referenceVariable = value?.match(/var\((.+)\)/)?.[1];
      if (referenceVariable) {
        return variables[referenceVariable];
      }
    }
    return value;
  }
  static findSelectorMatch(selector, masterCssType, isResponsive, filter) {
    const propertySelectors = _VariablesUtils.varsPropertySelectorsMap[masterCssType] || {};
    for (const [key, values] of Object.entries(propertySelectors)) {
      for (const value of values) {
        if (value.isResponsive !== void 0 && value.isResponsive !== isResponsive) {
          continue;
        }
        if (!filter(value)) {
          continue;
        }
        for (const candidate of value.selectors) {
          if (_VariablesUtils.areSelectorsEqual(selector, candidate)) {
            return { key, value };
          }
        }
      }
    }
    return null;
  }
  static clearSelectorsCache() {
    this.selectorsCache = {};
  }
};

export {
  VariablesUtils
};

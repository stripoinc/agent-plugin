// editor/ui-editor-common/node_modules/fast-copy/dist/es/index.mjs
var MaxDepthExceededError = class extends RangeError {
  constructor(maxDepth) {
    super("Maximum copy depth of ".concat(String(maxDepth), " exceeded; the value copied is nested too deeply."));
    this.maxDepth = maxDepth;
    this.name = "MaxDepthExceededError";
  }
};
var toStringFunction = Function.prototype.toString;
var toStringObject = Object.prototype.toString;
function getCleanClone(prototype) {
  if (!prototype) {
    return /* @__PURE__ */ Object.create(null);
  }
  const Constructor = prototype.constructor;
  if (Constructor === Object) {
    return prototype === Object.prototype ? {} : Object.create(prototype);
  }
  if (Constructor && ~toStringFunction.call(Constructor).indexOf("[native code]")) {
    try {
      return new Constructor();
    } catch (_a) {
    }
  }
  return Object.create(prototype);
}
function getTag(value) {
  const stringTag = value[Symbol.toStringTag];
  if (stringTag) {
    return stringTag;
  }
  const type = toStringObject.call(value);
  return type.substring(8, type.length - 1);
}
var { propertyIsEnumerable } = Object.prototype;
function copyOwnDescriptor(original, clone, property, state) {
  const ownDescriptor = Object.getOwnPropertyDescriptor(original, property) || {
    configurable: true,
    enumerable: true,
    value: original[property],
    writable: true
  };
  const descriptor = ownDescriptor.get || ownDescriptor.set ? ownDescriptor : {
    configurable: ownDescriptor.configurable,
    enumerable: ownDescriptor.enumerable,
    value: state.copier(ownDescriptor.value, state),
    writable: ownDescriptor.writable
  };
  try {
    Object.defineProperty(clone, property, descriptor);
  } catch (_a) {
    clone[property] = descriptor.get ? descriptor.get() : descriptor.value;
  }
}
function copyOwnPropertiesStrict(value, clone, state) {
  for (const name of Object.getOwnPropertyNames(value)) {
    copyOwnDescriptor(value, clone, name, state);
  }
  for (const symbol of Object.getOwnPropertySymbols(value)) {
    copyOwnDescriptor(value, clone, symbol, state);
  }
  return clone;
}
function copyArrayLoose(array, state) {
  const clone = new state.Constructor();
  state.cache.set(array, clone);
  for (let index = 0; index < array.length; ++index) {
    clone[index] = state.copier(array[index], state);
  }
  return clone;
}
function copyArrayStrict(array, state) {
  const clone = new state.Constructor();
  state.cache.set(array, clone);
  return copyOwnPropertiesStrict(array, clone, state);
}
function copyArrayBuffer(arrayBuffer, _state) {
  return arrayBuffer.slice(0);
}
function copyBlob(blob, _state) {
  return blob.slice(0, blob.size, blob.type);
}
function copyDataView(dataView, state) {
  return new state.Constructor(copyArrayBuffer(dataView.buffer));
}
function copyDate(date, state) {
  return new state.Constructor(date.getTime());
}
function copyMapLoose(map, state) {
  const clone = new state.Constructor();
  state.cache.set(map, clone);
  for (const [key, value] of map) {
    clone.set(key, state.copier(value, state));
  }
  return clone;
}
function copyMapStrict(map, state) {
  return copyOwnPropertiesStrict(map, copyMapLoose(map, state), state);
}
function copyObjectLoose(object, state) {
  const clone = getCleanClone(state.prototype);
  state.cache.set(object, clone);
  for (const key of Object.keys(object)) {
    clone[key] = state.copier(object[key], state);
  }
  for (const symbol of Object.getOwnPropertySymbols(object)) {
    if (propertyIsEnumerable.call(object, symbol)) {
      clone[symbol] = state.copier(object[symbol], state);
    }
  }
  return clone;
}
function copyObjectStrict(object, state) {
  const clone = getCleanClone(state.prototype);
  state.cache.set(object, clone);
  return copyOwnPropertiesStrict(object, clone, state);
}
function copyPrimitiveWrapper(primitiveObject, state) {
  return new state.Constructor(primitiveObject.valueOf());
}
function copyRegExp(regExp, state) {
  const clone = new state.Constructor(regExp.source, regExp.flags);
  clone.lastIndex = regExp.lastIndex;
  return clone;
}
function copySelf(value, _state) {
  return value;
}
function copySetLoose(set, state) {
  const clone = new state.Constructor();
  state.cache.set(set, clone);
  for (const value of set) {
    clone.add(state.copier(value, state));
  }
  return clone;
}
function copySetStrict(set, state) {
  return copyOwnPropertiesStrict(set, copySetLoose(set, state), state);
}
var DEFAULT_MAX_DEPTH = 1e3;
function createDefaultCache() {
  return /* @__PURE__ */ new WeakMap();
}
function getOptions({ createCache: createCacheOverride, maxDepth, methods: methodsOverride, strict }) {
  const defaultMethods = {
    array: strict ? copyArrayStrict : copyArrayLoose,
    arrayBuffer: copyArrayBuffer,
    asyncGenerator: copySelf,
    blob: copyBlob,
    dataView: copyDataView,
    date: copyDate,
    error: copySelf,
    generator: copySelf,
    map: strict ? copyMapStrict : copyMapLoose,
    object: strict ? copyObjectStrict : copyObjectLoose,
    regExp: copyRegExp,
    set: strict ? copySetStrict : copySetLoose
  };
  const methods = methodsOverride ? Object.assign(defaultMethods, methodsOverride) : defaultMethods;
  const copiers = getTagSpecificCopiers(methods);
  const createCache = createCacheOverride || createDefaultCache;
  if (!copiers.Object || !copiers.Array) {
    throw new Error("An object and array copier must be provided.");
  }
  return {
    createCache,
    copiers,
    maxDepth: maxDepth == null ? DEFAULT_MAX_DEPTH : maxDepth,
    methods,
    strict: Boolean(strict)
  };
}
function getTagSpecificCopiers(methods) {
  return {
    Arguments: methods.object,
    Array: methods.array,
    ArrayBuffer: methods.arrayBuffer,
    AsyncGenerator: methods.asyncGenerator,
    BigInt64Array: methods.arrayBuffer,
    BigUint64Array: methods.arrayBuffer,
    Blob: methods.blob,
    Boolean: copyPrimitiveWrapper,
    DataView: methods.dataView,
    Date: methods.date,
    Error: methods.error,
    Float32Array: methods.arrayBuffer,
    Float64Array: methods.arrayBuffer,
    Generator: methods.generator,
    Int8Array: methods.arrayBuffer,
    Int16Array: methods.arrayBuffer,
    Int32Array: methods.arrayBuffer,
    Map: methods.map,
    Number: copyPrimitiveWrapper,
    Object: methods.object,
    Promise: copySelf,
    RegExp: methods.regExp,
    Set: methods.set,
    String: copyPrimitiveWrapper,
    WeakMap: copySelf,
    WeakSet: copySelf,
    Uint8Array: methods.arrayBuffer,
    Uint8ClampedArray: methods.arrayBuffer,
    Uint16Array: methods.arrayBuffer,
    Uint32Array: methods.arrayBuffer
  };
}
function createCopier(options = {}) {
  const { createCache, copiers, maxDepth } = getOptions(options);
  const { Array: copyArray, Object: copyObject } = copiers;
  function copier(value, state) {
    state.prototype = state.Constructor = void 0;
    if (!value || typeof value !== "object") {
      return value;
    }
    if (state.cache.has(value)) {
      return state.cache.get(value);
    }
    if (++state.depth > maxDepth) {
      throw new MaxDepthExceededError(maxDepth);
    }
    state.prototype = Object.getPrototypeOf(value);
    state.Constructor = state.prototype && state.prototype.constructor;
    let clone;
    if (!state.Constructor || state.Constructor === Object) {
      clone = copyObject(value, state);
    } else if (Array.isArray(value)) {
      clone = copyArray(value, state);
    } else {
      const tagSpecificCopier = copiers[getTag(value)];
      if (tagSpecificCopier) {
        clone = tagSpecificCopier(value, state);
      } else {
        clone = typeof value.then === "function" ? value : copyObject(value, state);
      }
    }
    --state.depth;
    return clone;
  }
  return function copy2(value) {
    return copier(value, {
      Constructor: void 0,
      cache: createCache(),
      copier,
      depth: 0,
      prototype: void 0
    });
  };
}
var copyStrict = createCopier({ strict: true });
var copy = createCopier();

export {
  MaxDepthExceededError,
  createCopier,
  copyStrict,
  copy
};

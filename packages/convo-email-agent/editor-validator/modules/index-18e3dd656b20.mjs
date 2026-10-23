import {
  ru_default
} from "./ru-bc4e3a9b0c5d.mjs";
import {
  ta_default
} from "./ta-db52cb61dd13.mjs";
import {
  th_default
} from "./th-0b76e62dab96.mjs";
import {
  uk_default
} from "./uk-e0f612ccc576.mjs";
import {
  ur_default
} from "./ur-d062d4183cb7.mjs";
import {
  vi_default
} from "./vi-b05b5337c3b0.mjs";
import {
  yo_default
} from "./yo-9342d8b90769.mjs";
import {
  ko_default
} from "./ko-27b7a94f5634.mjs";
import {
  lt_default
} from "./lt-52aa05368ec0.mjs";
import {
  mk_default
} from "./mk-67b5345704f5.mjs";
import {
  ne_default
} from "./ne-f804b66c7871.mjs";
import {
  pl_default
} from "./pl-0edcc52c11a6.mjs";
import {
  ps_default
} from "./ps-57feece82f75.mjs";
import {
  pt_BR_default
} from "./pt-BR-4ca29f9ccdf1.mjs";
import {
  pt_default
} from "./pt-2b6363a9f827.mjs";
import {
  gu_default
} from "./gu-0e230c44f6bd.mjs";
import {
  he_default
} from "./he-3eb1c1845d9e.mjs";
import {
  hi_default
} from "./hi-bdb199026ff7.mjs";
import {
  hy_default
} from "./hy-a38fb7e4f9ec.mjs";
import {
  ja_default
} from "./ja-6478150f8d7a.mjs";
import {
  ka_default
} from "./ka-337898cedd2a.mjs";
import {
  km_default
} from "./km-d158ab990ee9.mjs";
import {
  kn_default
} from "./kn-ccd0d66753b1.mjs";
import {
  be_default
} from "./be-72979be88390.mjs";
import {
  bg_default
} from "./bg-542c84614fee.mjs";
import {
  bn_default
} from "./bn-60307a2c0766.mjs";
import {
  ckb_default
} from "./ckb-ddc82ea9c77a.mjs";
import {
  el_default
} from "./el-d2b74d96868d.mjs";
import {
  es_default
} from "./es-fc2f1ee63cca.mjs";
import {
  fa_default
} from "./fa-b54c803455c1.mjs";
import {
  fr_default
} from "./fr-4b4663c3d230.mjs";
import {
  allProcessors,
  toJSONSchema
} from "./json-schema-processors-0c244c7c3151.mjs";
import {
  createStandardJSONSchemaMethod,
  createToJSONSchemaMethod,
  extractDefs,
  finalize,
  handleUnrepresentable,
  initializeContext,
  process
} from "./to-json-schema-b5fe38b46dc6.mjs";
import {
  ar_default
} from "./ar-e1d58fdd0495.mjs";
import {
  TimePrecision,
  _any,
  _array,
  _base64,
  _base64url,
  _bigint,
  _boolean,
  _catch,
  _check,
  _cidrv4,
  _cidrv6,
  _coercedBigint,
  _coercedBoolean,
  _coercedDate,
  _coercedNumber,
  _coercedString,
  _creditCard,
  _cuid,
  _cuid2,
  _custom,
  _date,
  _default,
  _discriminatedUnion,
  _e164,
  _email,
  _emoji,
  _endsWith,
  _enum,
  _file,
  _float32,
  _float64,
  _gt,
  _gte,
  _guid,
  _includes,
  _int,
  _int32,
  _int64,
  _intersection,
  _ipv4,
  _ipv6,
  _isoDate,
  _isoDateTime,
  _isoDuration,
  _isoTime,
  _jwt,
  _ksuid,
  _lazy,
  _length,
  _literal,
  _lowercase,
  _lt,
  _lte,
  _mac,
  _map,
  _maxLength,
  _maxSize,
  _mime,
  _minLength,
  _minSize,
  _multipleOf,
  _nan,
  _nanoid,
  _nativeEnum,
  _negative,
  _never,
  _nonnegative,
  _nonoptional,
  _nonpositive,
  _normalize,
  _null,
  _nullable,
  _number,
  _optional,
  _overwrite,
  _pipe,
  _positive,
  _promise,
  _properties,
  _property,
  _readonly,
  _record,
  _refine,
  _regex,
  _set,
  _size,
  _slugify,
  _startsWith,
  _string,
  _stringFormat,
  _stringbool,
  _success,
  _superRefine,
  _symbol,
  _templateLiteral,
  _toLowerCase,
  _toUpperCase,
  _transform,
  _trim,
  _tuple,
  _uint32,
  _uint64,
  _ulid,
  _undefined,
  _union,
  _unknown,
  _uppercase,
  _url,
  _uuid,
  _uuidv4,
  _uuidv6,
  _uuidv7,
  _void,
  _xid,
  _xor,
  describe,
  meta
} from "./api-7ec6d993fe84.mjs";
import {
  $ZodRegistry,
  $input,
  $output,
  globalRegistry,
  registry
} from "./registries-3ceb92ae3dab.mjs";
import {
  INVALID,
  ZodCompileAsyncError,
  ZodCompileUnsupportedError,
  compile,
  compileFn
} from "./compile-fe1f1936d44e.mjs";
import {
  $ZodCyclicError,
  isBackEdge,
  isRecursiveSchema,
  memoizer
} from "./memoizer-c00f0bc54290.mjs";
import {
  $ZodAny,
  $ZodArray,
  $ZodBase64,
  $ZodBase64URL,
  $ZodBigInt,
  $ZodBigIntFormat,
  $ZodBoolean,
  $ZodCIDRv4,
  $ZodCIDRv6,
  $ZodCUID,
  $ZodCUID2,
  $ZodCatch,
  $ZodCodec,
  $ZodCreditCard,
  $ZodCustom,
  $ZodCustomStringFormat,
  $ZodDate,
  $ZodDefault,
  $ZodDiscriminatedUnion,
  $ZodE164,
  $ZodEmail,
  $ZodEmoji,
  $ZodEnum,
  $ZodExactOptional,
  $ZodFile,
  $ZodFunction,
  $ZodGUID,
  $ZodIPv4,
  $ZodIPv6,
  $ZodISODate,
  $ZodISODateTime,
  $ZodISODuration,
  $ZodISOTime,
  $ZodIntersection,
  $ZodJWT,
  $ZodKSUID,
  $ZodLazy,
  $ZodLiteral,
  $ZodMAC,
  $ZodMap,
  $ZodNaN,
  $ZodNanoID,
  $ZodNever,
  $ZodNonOptional,
  $ZodNull,
  $ZodNullable,
  $ZodNumber,
  $ZodNumberFormat,
  $ZodObject,
  $ZodObjectJIT,
  $ZodOptional,
  $ZodPipe,
  $ZodPrefault,
  $ZodPreprocess,
  $ZodPromise,
  $ZodReadonly,
  $ZodRecord,
  $ZodSet,
  $ZodString,
  $ZodStringFormat,
  $ZodSuccess,
  $ZodSymbol,
  $ZodTemplateLiteral,
  $ZodTransform,
  $ZodTuple,
  $ZodType,
  $ZodULID,
  $ZodURL,
  $ZodUUID,
  $ZodUndefined,
  $ZodUnion,
  $ZodUnknown,
  $ZodVoid,
  $ZodXID,
  $ZodXor,
  Doc,
  URL_BAD_FORMAT,
  URL_UNPARSEABLE,
  getDiscriminatedOption,
  isValidBase64,
  isValidBase64URL,
  isValidCIDRv6,
  isValidCreditCard,
  isValidIPv6,
  isValidJWT,
  mergeValues,
  parseURLObject,
  standardProps,
  stripTabAndNewline,
  urlHostnameOk,
  urlProtocolOk,
  version
} from "./doc-85ae2b2bbd32.mjs";
import {
  _decode,
  _decodeAsync,
  _encode,
  _encodeAsync,
  _parse,
  _parseAsync,
  _safeDecode,
  _safeDecodeAsync,
  _safeEncode,
  _safeEncodeAsync,
  _safeParse,
  _safeParseAsync,
  decode,
  decodeAsync,
  encode,
  encodeAsync,
  parse,
  parseAsync,
  safeDecode,
  safeDecodeAsync,
  safeEncode,
  safeEncodeAsync,
  safeParse,
  safeParseAsync,
  validate,
  validateAsync
} from "./parse-545b503fc4ed.mjs";
import {
  $ZodCheck,
  $ZodCheckBigIntFormat,
  $ZodCheckEndsWith,
  $ZodCheckGreaterThan,
  $ZodCheckIncludes,
  $ZodCheckLengthEquals,
  $ZodCheckLessThan,
  $ZodCheckLowerCase,
  $ZodCheckMaxLength,
  $ZodCheckMaxSize,
  $ZodCheckMimeType,
  $ZodCheckMinLength,
  $ZodCheckMinSize,
  $ZodCheckMultipleOf,
  $ZodCheckNumberFormat,
  $ZodCheckOverwrite,
  $ZodCheckProperty,
  $ZodCheckRegex,
  $ZodCheckSizeEquals,
  $ZodCheckStartsWith,
  $ZodCheckStringFormat,
  $ZodCheckUpperCase
} from "./checks-f4a190521e0d.mjs";
import {
  regexes_exports
} from "./regexes-d1711c96e64b.mjs";
import {
  $ZodError,
  $ZodRealError,
  flattenError,
  formatError,
  prettifyError,
  toDotPath,
  treeifyError
} from "./errors-095a9cd7e5fd.mjs";
import {
  $ZodAsyncError,
  $ZodEncodeError,
  $brand,
  $constructor,
  NEVER,
  clone,
  config,
  globalConfig,
  joinValues,
  parsedType,
  stringifyPrimitive,
  toZod,
  util_exports
} from "./core-d6ef11a90708.mjs";
import {
  __export
} from "./shared-4f53cda18c2b.mjs";

// editor/ui-editor-ui/node_modules/zod/v4/core/index.js
var core_exports = {};
__export(core_exports, {
  $ZodAny: () => $ZodAny,
  $ZodArray: () => $ZodArray,
  $ZodAsyncError: () => $ZodAsyncError,
  $ZodBase64: () => $ZodBase64,
  $ZodBase64URL: () => $ZodBase64URL,
  $ZodBigInt: () => $ZodBigInt,
  $ZodBigIntFormat: () => $ZodBigIntFormat,
  $ZodBoolean: () => $ZodBoolean,
  $ZodCIDRv4: () => $ZodCIDRv4,
  $ZodCIDRv6: () => $ZodCIDRv6,
  $ZodCUID: () => $ZodCUID,
  $ZodCUID2: () => $ZodCUID2,
  $ZodCatch: () => $ZodCatch,
  $ZodCheck: () => $ZodCheck,
  $ZodCheckBigIntFormat: () => $ZodCheckBigIntFormat,
  $ZodCheckEndsWith: () => $ZodCheckEndsWith,
  $ZodCheckGreaterThan: () => $ZodCheckGreaterThan,
  $ZodCheckIncludes: () => $ZodCheckIncludes,
  $ZodCheckLengthEquals: () => $ZodCheckLengthEquals,
  $ZodCheckLessThan: () => $ZodCheckLessThan,
  $ZodCheckLowerCase: () => $ZodCheckLowerCase,
  $ZodCheckMaxLength: () => $ZodCheckMaxLength,
  $ZodCheckMaxSize: () => $ZodCheckMaxSize,
  $ZodCheckMimeType: () => $ZodCheckMimeType,
  $ZodCheckMinLength: () => $ZodCheckMinLength,
  $ZodCheckMinSize: () => $ZodCheckMinSize,
  $ZodCheckMultipleOf: () => $ZodCheckMultipleOf,
  $ZodCheckNumberFormat: () => $ZodCheckNumberFormat,
  $ZodCheckOverwrite: () => $ZodCheckOverwrite,
  $ZodCheckProperty: () => $ZodCheckProperty,
  $ZodCheckRegex: () => $ZodCheckRegex,
  $ZodCheckSizeEquals: () => $ZodCheckSizeEquals,
  $ZodCheckStartsWith: () => $ZodCheckStartsWith,
  $ZodCheckStringFormat: () => $ZodCheckStringFormat,
  $ZodCheckUpperCase: () => $ZodCheckUpperCase,
  $ZodCodec: () => $ZodCodec,
  $ZodCreditCard: () => $ZodCreditCard,
  $ZodCustom: () => $ZodCustom,
  $ZodCustomStringFormat: () => $ZodCustomStringFormat,
  $ZodCyclicError: () => $ZodCyclicError,
  $ZodDate: () => $ZodDate,
  $ZodDefault: () => $ZodDefault,
  $ZodDiscriminatedUnion: () => $ZodDiscriminatedUnion,
  $ZodE164: () => $ZodE164,
  $ZodEmail: () => $ZodEmail,
  $ZodEmoji: () => $ZodEmoji,
  $ZodEncodeError: () => $ZodEncodeError,
  $ZodEnum: () => $ZodEnum,
  $ZodError: () => $ZodError,
  $ZodExactOptional: () => $ZodExactOptional,
  $ZodFile: () => $ZodFile,
  $ZodFunction: () => $ZodFunction,
  $ZodGUID: () => $ZodGUID,
  $ZodIPv4: () => $ZodIPv4,
  $ZodIPv6: () => $ZodIPv6,
  $ZodISODate: () => $ZodISODate,
  $ZodISODateTime: () => $ZodISODateTime,
  $ZodISODuration: () => $ZodISODuration,
  $ZodISOTime: () => $ZodISOTime,
  $ZodIntersection: () => $ZodIntersection,
  $ZodJWT: () => $ZodJWT,
  $ZodKSUID: () => $ZodKSUID,
  $ZodLazy: () => $ZodLazy,
  $ZodLiteral: () => $ZodLiteral,
  $ZodMAC: () => $ZodMAC,
  $ZodMap: () => $ZodMap,
  $ZodNaN: () => $ZodNaN,
  $ZodNanoID: () => $ZodNanoID,
  $ZodNever: () => $ZodNever,
  $ZodNonOptional: () => $ZodNonOptional,
  $ZodNull: () => $ZodNull,
  $ZodNullable: () => $ZodNullable,
  $ZodNumber: () => $ZodNumber,
  $ZodNumberFormat: () => $ZodNumberFormat,
  $ZodObject: () => $ZodObject,
  $ZodObjectJIT: () => $ZodObjectJIT,
  $ZodOptional: () => $ZodOptional,
  $ZodPipe: () => $ZodPipe,
  $ZodPrefault: () => $ZodPrefault,
  $ZodPreprocess: () => $ZodPreprocess,
  $ZodPromise: () => $ZodPromise,
  $ZodReadonly: () => $ZodReadonly,
  $ZodRealError: () => $ZodRealError,
  $ZodRecord: () => $ZodRecord,
  $ZodRegistry: () => $ZodRegistry,
  $ZodSet: () => $ZodSet,
  $ZodString: () => $ZodString,
  $ZodStringFormat: () => $ZodStringFormat,
  $ZodSuccess: () => $ZodSuccess,
  $ZodSymbol: () => $ZodSymbol,
  $ZodTemplateLiteral: () => $ZodTemplateLiteral,
  $ZodTransform: () => $ZodTransform,
  $ZodTuple: () => $ZodTuple,
  $ZodType: () => $ZodType,
  $ZodULID: () => $ZodULID,
  $ZodURL: () => $ZodURL,
  $ZodUUID: () => $ZodUUID,
  $ZodUndefined: () => $ZodUndefined,
  $ZodUnion: () => $ZodUnion,
  $ZodUnknown: () => $ZodUnknown,
  $ZodVoid: () => $ZodVoid,
  $ZodXID: () => $ZodXID,
  $ZodXor: () => $ZodXor,
  $brand: () => $brand,
  $constructor: () => $constructor,
  $input: () => $input,
  $output: () => $output,
  Doc: () => Doc,
  INVALID: () => INVALID,
  JSONSchema: () => json_schema_exports,
  JSONSchemaGenerator: () => JSONSchemaGenerator,
  NEVER: () => NEVER,
  TimePrecision: () => TimePrecision,
  URL_BAD_FORMAT: () => URL_BAD_FORMAT,
  URL_UNPARSEABLE: () => URL_UNPARSEABLE,
  ZodCompileAsyncError: () => ZodCompileAsyncError,
  ZodCompileUnsupportedError: () => ZodCompileUnsupportedError,
  _any: () => _any,
  _array: () => _array,
  _base64: () => _base64,
  _base64url: () => _base64url,
  _bigint: () => _bigint,
  _boolean: () => _boolean,
  _catch: () => _catch,
  _check: () => _check,
  _cidrv4: () => _cidrv4,
  _cidrv6: () => _cidrv6,
  _coercedBigint: () => _coercedBigint,
  _coercedBoolean: () => _coercedBoolean,
  _coercedDate: () => _coercedDate,
  _coercedNumber: () => _coercedNumber,
  _coercedString: () => _coercedString,
  _creditCard: () => _creditCard,
  _cuid: () => _cuid,
  _cuid2: () => _cuid2,
  _custom: () => _custom,
  _date: () => _date,
  _decode: () => _decode,
  _decodeAsync: () => _decodeAsync,
  _default: () => _default,
  _discriminatedUnion: () => _discriminatedUnion,
  _e164: () => _e164,
  _email: () => _email,
  _emoji: () => _emoji,
  _encode: () => _encode,
  _encodeAsync: () => _encodeAsync,
  _endsWith: () => _endsWith,
  _enum: () => _enum,
  _file: () => _file,
  _float32: () => _float32,
  _float64: () => _float64,
  _gt: () => _gt,
  _gte: () => _gte,
  _guid: () => _guid,
  _includes: () => _includes,
  _int: () => _int,
  _int32: () => _int32,
  _int64: () => _int64,
  _intersection: () => _intersection,
  _ipv4: () => _ipv4,
  _ipv6: () => _ipv6,
  _isoDate: () => _isoDate,
  _isoDateTime: () => _isoDateTime,
  _isoDuration: () => _isoDuration,
  _isoTime: () => _isoTime,
  _jwt: () => _jwt,
  _ksuid: () => _ksuid,
  _lazy: () => _lazy,
  _length: () => _length,
  _literal: () => _literal,
  _lowercase: () => _lowercase,
  _lt: () => _lt,
  _lte: () => _lte,
  _mac: () => _mac,
  _map: () => _map,
  _max: () => _lte,
  _maxLength: () => _maxLength,
  _maxSize: () => _maxSize,
  _mime: () => _mime,
  _min: () => _gte,
  _minLength: () => _minLength,
  _minSize: () => _minSize,
  _multipleOf: () => _multipleOf,
  _nan: () => _nan,
  _nanoid: () => _nanoid,
  _nativeEnum: () => _nativeEnum,
  _negative: () => _negative,
  _never: () => _never,
  _nonnegative: () => _nonnegative,
  _nonoptional: () => _nonoptional,
  _nonpositive: () => _nonpositive,
  _normalize: () => _normalize,
  _null: () => _null,
  _nullable: () => _nullable,
  _number: () => _number,
  _optional: () => _optional,
  _overwrite: () => _overwrite,
  _parse: () => _parse,
  _parseAsync: () => _parseAsync,
  _pipe: () => _pipe,
  _positive: () => _positive,
  _promise: () => _promise,
  _properties: () => _properties,
  _property: () => _property,
  _readonly: () => _readonly,
  _record: () => _record,
  _refine: () => _refine,
  _regex: () => _regex,
  _safeDecode: () => _safeDecode,
  _safeDecodeAsync: () => _safeDecodeAsync,
  _safeEncode: () => _safeEncode,
  _safeEncodeAsync: () => _safeEncodeAsync,
  _safeParse: () => _safeParse,
  _safeParseAsync: () => _safeParseAsync,
  _set: () => _set,
  _size: () => _size,
  _slugify: () => _slugify,
  _startsWith: () => _startsWith,
  _string: () => _string,
  _stringFormat: () => _stringFormat,
  _stringbool: () => _stringbool,
  _success: () => _success,
  _superRefine: () => _superRefine,
  _symbol: () => _symbol,
  _templateLiteral: () => _templateLiteral,
  _toLowerCase: () => _toLowerCase,
  _toUpperCase: () => _toUpperCase,
  _transform: () => _transform,
  _trim: () => _trim,
  _tuple: () => _tuple,
  _uint32: () => _uint32,
  _uint64: () => _uint64,
  _ulid: () => _ulid,
  _undefined: () => _undefined,
  _union: () => _union,
  _unknown: () => _unknown,
  _uppercase: () => _uppercase,
  _url: () => _url,
  _uuid: () => _uuid,
  _uuidv4: () => _uuidv4,
  _uuidv6: () => _uuidv6,
  _uuidv7: () => _uuidv7,
  _void: () => _void,
  _xid: () => _xid,
  _xor: () => _xor,
  clone: () => clone,
  compile: () => compile,
  compileFn: () => compileFn,
  config: () => config,
  createStandardJSONSchemaMethod: () => createStandardJSONSchemaMethod,
  createToJSONSchemaMethod: () => createToJSONSchemaMethod,
  decode: () => decode,
  decodeAsync: () => decodeAsync,
  describe: () => describe,
  encode: () => encode,
  encodeAsync: () => encodeAsync,
  extractDefs: () => extractDefs,
  finalize: () => finalize,
  flattenError: () => flattenError,
  formatError: () => formatError,
  getDiscriminatedOption: () => getDiscriminatedOption,
  globalConfig: () => globalConfig,
  globalRegistry: () => globalRegistry,
  handleUnrepresentable: () => handleUnrepresentable,
  initializeContext: () => initializeContext,
  isBackEdge: () => isBackEdge,
  isRecursiveSchema: () => isRecursiveSchema,
  isValidBase64: () => isValidBase64,
  isValidBase64URL: () => isValidBase64URL,
  isValidCIDRv6: () => isValidCIDRv6,
  isValidCreditCard: () => isValidCreditCard,
  isValidIPv6: () => isValidIPv6,
  isValidJWT: () => isValidJWT,
  locales: () => locales_exports,
  memoizer: () => memoizer,
  mergeValues: () => mergeValues,
  meta: () => meta,
  parse: () => parse,
  parseAsync: () => parseAsync,
  parseURLObject: () => parseURLObject,
  prettifyError: () => prettifyError,
  process: () => process,
  regexes: () => regexes_exports,
  registry: () => registry,
  safeDecode: () => safeDecode,
  safeDecodeAsync: () => safeDecodeAsync,
  safeEncode: () => safeEncode,
  safeEncodeAsync: () => safeEncodeAsync,
  safeParse: () => safeParse,
  safeParseAsync: () => safeParseAsync,
  standardProps: () => standardProps,
  stripTabAndNewline: () => stripTabAndNewline,
  toDotPath: () => toDotPath,
  toJSONSchema: () => toJSONSchema,
  toZod: () => toZod,
  treeifyError: () => treeifyError,
  urlHostnameOk: () => urlHostnameOk,
  urlProtocolOk: () => urlProtocolOk,
  util: () => util_exports,
  validate: () => validate,
  validateAsync: () => validateAsync,
  version: () => version
});

// editor/ui-editor-ui/node_modules/zod/v4/locales/index.js
var locales_exports = {};
__export(locales_exports, {
  ar: () => ar_default,
  az: () => az_default,
  be: () => be_default,
  bg: () => bg_default,
  bn: () => bn_default,
  ca: () => ca_default,
  ckb: () => ckb_default,
  cs: () => cs_default,
  da: () => da_default,
  de: () => de_default,
  el: () => el_default,
  en: () => en_default,
  eo: () => eo_default,
  es: () => es_default,
  fa: () => fa_default,
  fi: () => fi_default,
  fr: () => fr_default,
  frCA: () => fr_CA_default,
  gu: () => gu_default,
  he: () => he_default,
  hi: () => hi_default,
  hr: () => hr_default,
  hu: () => hu_default,
  hy: () => hy_default,
  id: () => id_default,
  is: () => is_default,
  it: () => it_default,
  ja: () => ja_default,
  ka: () => ka_default,
  kh: () => kh_default,
  km: () => km_default,
  kn: () => kn_default,
  ko: () => ko_default,
  lt: () => lt_default,
  mk: () => mk_default,
  ms: () => ms_default,
  ne: () => ne_default,
  nl: () => nl_default,
  nn: () => nn_default,
  no: () => no_default,
  ota: () => ota_default,
  pl: () => pl_default,
  ps: () => ps_default,
  pt: () => pt_default,
  ptBR: () => pt_BR_default,
  ro: () => ro_default,
  ru: () => ru_default,
  sk: () => sk_default,
  sl: () => sl_default,
  sv: () => sv_default,
  ta: () => ta_default,
  th: () => th_default,
  tk: () => tk_default,
  tr: () => tr_default,
  ua: () => ua_default,
  uk: () => uk_default,
  ur: () => ur_default,
  uz: () => uz_default,
  vi: () => vi_default,
  yo: () => yo_default,
  zhCN: () => zh_CN_default,
  zhTW: () => zh_TW_default
});

// editor/ui-editor-ui/node_modules/zod/v4/locales/az.js
var error = () => {
  const Sizable = {
    string: { unit: "simvol", verb: "olmal\u0131d\u0131r" },
    file: { unit: "bayt", verb: "olmal\u0131d\u0131r" },
    array: { unit: "element", verb: "olmal\u0131d\u0131r" },
    set: { unit: "element", verb: "olmal\u0131d\u0131r" },
    map: { unit: "element", verb: "olmal\u0131d\u0131r" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    mac: "MAC address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    credit_card: "kredit kart\u0131 n\xF6mr\u0259si",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n instanceof ".concat(issue.expected, ", daxil olan ").concat(received);
        }
        return "Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n ".concat(expected, ", daxil olan ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Yanl\u0131\u015F d\u0259y\u0259r: g\xF6zl\u0259nil\u0259n ".concat(stringifyPrimitive(issue.values[0]));
        return "Yanl\u0131\u015F se\xE7im: a\u015Fa\u011F\u0131dak\u0131lardan biri olmal\u0131d\u0131r: ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "\xC7ox b\xF6y\xFCk: g\xF6zl\u0259nil\u0259n ".concat(issue.origin ?? "d\u0259y\u0259r", " ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "element");
        return "\xC7ox b\xF6y\xFCk: g\xF6zl\u0259nil\u0259n ".concat(issue.origin ?? "d\u0259y\u0259r", " ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "\xC7ox ki\xE7ik: g\xF6zl\u0259nil\u0259n ".concat(issue.origin, " ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        return "\xC7ox ki\xE7ik: g\xF6zl\u0259nil\u0259n ".concat(issue.origin, " ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'Yanl\u0131\u015F m\u0259tn: "'.concat(_issue.prefix, '" il\u0259 ba\u015Flamal\u0131d\u0131r');
        if (_issue.format === "ends_with")
          return 'Yanl\u0131\u015F m\u0259tn: "'.concat(_issue.suffix, '" il\u0259 bitm\u0259lidir');
        if (_issue.format === "includes")
          return 'Yanl\u0131\u015F m\u0259tn: "'.concat(_issue.includes, '" daxil olmal\u0131d\u0131r');
        if (_issue.format === "regex")
          return "Yanl\u0131\u015F m\u0259tn: ".concat(_issue.pattern, " \u015Fablonuna uy\u011Fun olmal\u0131d\u0131r");
        return "Yanl\u0131\u015F ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Yanl\u0131\u015F \u0259d\u0259d: ".concat(issue.divisor, " il\u0259 b\xF6l\xFCn\u0259 bil\u0259n olmal\u0131d\u0131r");
      case "unrecognized_keys":
        return "Tan\u0131nmayan a\xE7ar".concat(issue.keys.length > 1 ? "lar" : "", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "".concat(issue.origin, " daxilind\u0259 yanl\u0131\u015F a\xE7ar");
      case "invalid_union":
        return "Yanl\u0131\u015F d\u0259y\u0259r";
      case "invalid_element":
        return "".concat(issue.origin, " daxilind\u0259 yanl\u0131\u015F d\u0259y\u0259r");
      default:
        return "Yanl\u0131\u015F d\u0259y\u0259r";
    }
  };
};
function az_default() {
  return {
    localeError: error()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/ca.js
var error2 = () => {
  const Sizable = {
    string: { unit: "car\xE0cters", verb: "contenir" },
    file: { unit: "bytes", verb: "contenir" },
    array: { unit: "elements", verb: "contenir" },
    set: { unit: "elements", verb: "contenir" },
    map: { unit: "elements", verb: "contenir" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "entrada",
    email: "adre\xE7a electr\xF2nica",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data i hora ISO",
    date: "data ISO",
    time: "hora ISO",
    duration: "durada ISO",
    ipv4: "adre\xE7a IPv4",
    ipv6: "adre\xE7a IPv6",
    mac: "adre\xE7a MAC",
    cidrv4: "rang IPv4",
    cidrv6: "rang IPv6",
    base64: "cadena codificada en base64",
    base64url: "cadena codificada en base64url",
    json_string: "cadena JSON",
    e164: "n\xFAmero E.164",
    credit_card: "n\xFAmero de targeta de cr\xE8dit",
    jwt: "JWT",
    template_literal: "entrada"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Tipus inv\xE0lid: s'esperava instanceof ".concat(issue.expected, ", s'ha rebut ").concat(received);
        }
        return "Tipus inv\xE0lid: s'esperava ".concat(expected, ", s'ha rebut ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Valor inv\xE0lid: s'esperava ".concat(stringifyPrimitive(issue.values[0]));
        return "Opci\xF3 inv\xE0lida: s'esperava una de ".concat(joinValues(issue.values, " o "));
      case "too_big": {
        const adj = issue.inclusive ? "com a m\xE0xim" : "menys de";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "Massa gran: s'esperava que ".concat(issue.origin ?? "el valor", " contingu\xE9s ").concat(adj, " ").concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "elements");
        return "Massa gran: s'esperava que ".concat(issue.origin ?? "el valor", " fos ").concat(adj, " ").concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? "com a m\xEDnim" : "m\xE9s de";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Massa petit: s'esperava que ".concat(issue.origin, " contingu\xE9s ").concat(adj, " ").concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "Massa petit: s'esperava que ".concat(issue.origin, " fos ").concat(adj, " ").concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return 'Format inv\xE0lid: ha de comen\xE7ar amb "'.concat(_issue.prefix, '"');
        }
        if (_issue.format === "ends_with")
          return "Format inv\xE0lid: ha d'acabar amb \"".concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return "Format inv\xE0lid: ha d'incloure \"".concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "Format inv\xE0lid: ha de coincidir amb el patr\xF3 ".concat(_issue.pattern);
        return "Format inv\xE0lid per a ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "N\xFAmero inv\xE0lid: ha de ser m\xFAltiple de ".concat(issue.divisor);
      case "unrecognized_keys":
        return "Clau".concat(issue.keys.length > 1 ? "s" : "", " no reconeguda").concat(issue.keys.length > 1 ? "s" : "", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Clau inv\xE0lida a ".concat(issue.origin);
      case "invalid_union":
        return "Entrada inv\xE0lida";
      // Could also be "Tipus d'unió invàlid" but "Entrada invàlida" is more general
      case "invalid_element":
        return "Element inv\xE0lid a ".concat(issue.origin);
      default:
        return "Entrada inv\xE0lida";
    }
  };
};
function ca_default() {
  return {
    localeError: error2()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/cs.js
var error3 = () => {
  const Sizable = {
    string: { unit: "znak\u016F", verb: "m\xEDt" },
    file: { unit: "bajt\u016F", verb: "m\xEDt" },
    array: { unit: "prvk\u016F", verb: "m\xEDt" },
    set: { unit: "prvk\u016F", verb: "m\xEDt" },
    map: { unit: "prvk\u016F", verb: "m\xEDt" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "regul\xE1rn\xED v\xFDraz",
    email: "e-mailov\xE1 adresa",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "datum a \u010Das ve form\xE1tu ISO",
    date: "datum ve form\xE1tu ISO",
    time: "\u010Das ve form\xE1tu ISO",
    duration: "doba trv\xE1n\xED ISO",
    ipv4: "IPv4 adresa",
    ipv6: "IPv6 adresa",
    mac: "MAC adresa",
    cidrv4: "rozsah IPv4",
    cidrv6: "rozsah IPv6",
    base64: "\u0159et\u011Bzec zak\xF3dovan\xFD ve form\xE1tu base64",
    base64url: "\u0159et\u011Bzec zak\xF3dovan\xFD ve form\xE1tu base64url",
    json_string: "\u0159et\u011Bzec ve form\xE1tu JSON",
    e164: "\u010D\xEDslo E.164",
    credit_card: "\u010D\xEDslo kreditn\xED karty",
    jwt: "JWT",
    template_literal: "vstup"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "\u010D\xEDslo",
    string: "\u0159et\u011Bzec",
    function: "funkce",
    array: "pole"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no instanceof ".concat(issue.expected, ", obdr\u017Eeno ").concat(received);
        }
        return "Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no ".concat(expected, ", obdr\u017Eeno ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Neplatn\xFD vstup: o\u010Dek\xE1v\xE1no ".concat(stringifyPrimitive(issue.values[0]));
        return "Neplatn\xE1 mo\u017Enost: o\u010Dek\xE1v\xE1na jedna z hodnot ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Hodnota je p\u0159\xEDli\u0161 velk\xE1: ".concat(issue.origin ?? "hodnota", " mus\xED m\xEDt ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "prvk\u016F");
        }
        return "Hodnota je p\u0159\xEDli\u0161 velk\xE1: ".concat(issue.origin ?? "hodnota", " mus\xED b\xFDt ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Hodnota je p\u0159\xEDli\u0161 mal\xE1: ".concat(issue.origin ?? "hodnota", " mus\xED m\xEDt ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit ?? "prvk\u016F");
        }
        return "Hodnota je p\u0159\xEDli\u0161 mal\xE1: ".concat(issue.origin ?? "hodnota", " mus\xED b\xFDt ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'Neplatn\xFD \u0159et\u011Bzec: mus\xED za\u010D\xEDnat na "'.concat(_issue.prefix, '"');
        if (_issue.format === "ends_with")
          return 'Neplatn\xFD \u0159et\u011Bzec: mus\xED kon\u010Dit na "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'Neplatn\xFD \u0159et\u011Bzec: mus\xED obsahovat "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "Neplatn\xFD \u0159et\u011Bzec: mus\xED odpov\xEDdat vzoru ".concat(_issue.pattern);
        return "Neplatn\xFD form\xE1t ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Neplatn\xE9 \u010D\xEDslo: mus\xED b\xFDt n\xE1sobkem ".concat(issue.divisor);
      case "unrecognized_keys":
        return "Nezn\xE1m\xE9 kl\xED\u010De: ".concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Neplatn\xFD kl\xED\u010D v ".concat(issue.origin);
      case "invalid_union":
        return "Neplatn\xFD vstup";
      case "invalid_element":
        return "Neplatn\xE1 hodnota v ".concat(issue.origin);
      default:
        return "Neplatn\xFD vstup";
    }
  };
};
function cs_default() {
  return {
    localeError: error3()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/da.js
var error4 = () => {
  const Sizable = {
    string: { unit: "tegn", verb: "havde" },
    file: { unit: "bytes", verb: "havde" },
    array: { unit: "elementer", verb: "indeholdt" },
    set: { unit: "elementer", verb: "indeholdt" },
    map: { unit: "elementer", verb: "indeholdt" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "e-mailadresse",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dato- og klokkesl\xE6t",
    date: "ISO-dato",
    time: "ISO-klokkesl\xE6t",
    duration: "ISO-varighed",
    ipv4: "IPv4-adresse",
    ipv6: "IPv6-adresse",
    mac: "MAC-adresse",
    cidrv4: "IPv4-spektrum",
    cidrv6: "IPv6-spektrum",
    base64: "base64-kodet streng",
    base64url: "base64url-kodet streng",
    json_string: "JSON-streng",
    e164: "E.164-nummer",
    credit_card: "kreditkortnummer",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    string: "streng",
    number: "tal",
    boolean: "boolean",
    array: "liste",
    object: "objekt",
    set: "s\xE6t",
    file: "fil"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Ugyldigt input: forventede instanceof ".concat(issue.expected, ", fik ").concat(received);
        }
        return "Ugyldigt input: forventede ".concat(expected, ", fik ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Ugyldig v\xE6rdi: forventede ".concat(stringifyPrimitive(issue.values[0]));
        return "Ugyldigt valg: forventede en af f\xF8lgende ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        const origin = TypeDictionary[issue.origin] ?? issue.origin;
        if (sizing)
          return "For stor: forventede ".concat(origin ?? "value", " ").concat(sizing.verb, " ").concat(adj, " ").concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "elementer");
        return "For stor: forventede ".concat(origin ?? "value", " havde ").concat(adj, " ").concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        const origin = TypeDictionary[issue.origin] ?? issue.origin;
        if (sizing) {
          return "For lille: forventede ".concat(origin, " ").concat(sizing.verb, " ").concat(adj, " ").concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "For lille: forventede ".concat(origin, " havde ").concat(adj, " ").concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'Ugyldig streng: skal starte med "'.concat(_issue.prefix, '"');
        if (_issue.format === "ends_with")
          return 'Ugyldig streng: skal ende med "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'Ugyldig streng: skal indeholde "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "Ugyldig streng: skal matche m\xF8nsteret ".concat(_issue.pattern);
        return "Ugyldig ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Ugyldigt tal: skal v\xE6re deleligt med ".concat(issue.divisor);
      case "unrecognized_keys":
        return "".concat(issue.keys.length > 1 ? "Ukendte n\xF8gler" : "Ukendt n\xF8gle", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Ugyldig n\xF8gle i ".concat(issue.origin);
      case "invalid_union":
        return "Ugyldigt input: matcher ingen af de tilladte typer";
      case "invalid_element":
        return "Ugyldig v\xE6rdi i ".concat(issue.origin);
      default:
        return "Ugyldigt input";
    }
  };
};
function da_default() {
  return {
    localeError: error4()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/de.js
var error5 = () => {
  const Sizable = {
    string: { unit: "Zeichen", verb: "zu haben" },
    file: { unit: "Bytes", verb: "zu haben" },
    array: { unit: "Elemente", verb: "zu haben" },
    set: { unit: "Elemente", verb: "zu haben" },
    map: { unit: "Elemente", verb: "zu haben" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "Eingabe",
    email: "E-Mail-Adresse",
    url: "URL",
    emoji: "Emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-Datum und -Uhrzeit",
    date: "ISO-Datum",
    time: "ISO-Uhrzeit",
    duration: "ISO-Dauer",
    ipv4: "IPv4-Adresse",
    ipv6: "IPv6-Adresse",
    mac: "MAC-Adresse",
    cidrv4: "IPv4-Bereich",
    cidrv6: "IPv6-Bereich",
    base64: "Base64-codierter String",
    base64url: "Base64-URL-codierter String",
    json_string: "JSON-String",
    e164: "E.164-Nummer",
    credit_card: "Kreditkartennummer",
    jwt: "JWT",
    template_literal: "Eingabe"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "Zahl",
    array: "Array"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Ung\xFCltige Eingabe: erwartet instanceof ".concat(issue.expected, ", erhalten ").concat(received);
        }
        return "Ung\xFCltige Eingabe: erwartet ".concat(expected, ", erhalten ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Ung\xFCltige Eingabe: erwartet ".concat(stringifyPrimitive(issue.values[0]));
        return "Ung\xFCltige Option: erwartet eine von ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "Zu gro\xDF: erwartet, dass ".concat(issue.origin ?? "Wert", " ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "Elemente", " hat");
        return "Zu gro\xDF: erwartet, dass ".concat(issue.origin ?? "Wert", " ").concat(adj).concat(issue.maximum.toString(), " ist");
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Zu klein: erwartet, dass ".concat(issue.origin, " ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit, " hat");
        }
        return "Zu klein: erwartet, dass ".concat(issue.origin, " ").concat(adj).concat(issue.minimum.toString(), " ist");
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'Ung\xFCltiger String: muss mit "'.concat(_issue.prefix, '" beginnen');
        if (_issue.format === "ends_with")
          return 'Ung\xFCltiger String: muss mit "'.concat(_issue.suffix, '" enden');
        if (_issue.format === "includes")
          return 'Ung\xFCltiger String: muss "'.concat(_issue.includes, '" enthalten');
        if (_issue.format === "regex")
          return "Ung\xFCltiger String: muss dem Muster ".concat(_issue.pattern, " entsprechen");
        return "Ung\xFCltig: ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Ung\xFCltige Zahl: muss ein Vielfaches von ".concat(issue.divisor, " sein");
      case "unrecognized_keys":
        return "".concat(issue.keys.length > 1 ? "Unbekannte Schl\xFCssel" : "Unbekannter Schl\xFCssel", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Ung\xFCltiger Schl\xFCssel in ".concat(issue.origin);
      case "invalid_union":
        return "Ung\xFCltige Eingabe";
      case "invalid_element":
        return "Ung\xFCltiger Wert in ".concat(issue.origin);
      default:
        return "Ung\xFCltige Eingabe";
    }
  };
};
function de_default() {
  return {
    localeError: error5()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/en.js
var error6 = () => {
  const Sizable = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" },
    map: { unit: "entries", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    mac: "MAC address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    credit_card: "credit card number",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    // Compatibility: "nan" -> "NaN" for display
    nan: "NaN"
    // All other type names omitted - they fall back to raw values via ?? operator
  };
  function getTypeName(type, input) {
    if (type === "number" && typeof input === "number" && !Number.isFinite(input)) {
      return String(input);
    }
    return TypeDictionary[type] ?? type;
  }
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = getTypeName(issue.expected);
        const receivedType = parsedType(issue.input);
        const received = getTypeName(receivedType, issue.input);
        return "Invalid input: expected ".concat(expected, ", received ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Invalid input: expected ".concat(stringifyPrimitive(issue.values[0]));
        return "Invalid option: expected one of ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.exact ? "exactly " : issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "Too big: expected ".concat(issue.origin ?? "value", " to have ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "elements");
        return "Too big: expected ".concat(issue.origin ?? "value", " to be ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.exact ? "exactly " : issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Too small: expected ".concat(issue.origin, " to have ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "Too small: expected ".concat(issue.origin, " to be ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return 'Invalid string: must start with "'.concat(_issue.prefix, '"');
        }
        if (_issue.format === "ends_with")
          return 'Invalid string: must end with "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'Invalid string: must include "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "Invalid string: must match pattern ".concat(_issue.pattern);
        return "Invalid ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Invalid number: must be a multiple of ".concat(issue.divisor);
      case "unrecognized_keys":
        return "Unrecognized key".concat(issue.keys.length > 1 ? "s" : "", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Invalid key in ".concat(issue.origin);
      case "invalid_union":
        if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) {
          const opts = issue.options.map((o) => "'".concat(o, "'")).join(" | ");
          return "Invalid discriminator value. Expected ".concat(opts);
        }
        if (issue.inclusive === false) {
          return "Invalid input: more than one option matched";
        }
        return "Invalid input";
      case "invalid_element":
        return "Invalid value in ".concat(issue.origin);
      default:
        return "Invalid input";
    }
  };
};
function en_default() {
  return {
    localeError: error6()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/eo.js
var error7 = () => {
  const Sizable = {
    string: { unit: "karaktrojn", verb: "havi" },
    file: { unit: "bajtojn", verb: "havi" },
    array: { unit: "elementojn", verb: "havi" },
    set: { unit: "elementojn", verb: "havi" },
    map: { unit: "elementojn", verb: "havi" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "enigo",
    email: "retadreso",
    url: "URL",
    emoji: "emo\u011Dio",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-datotempo",
    date: "ISO-dato",
    time: "ISO-tempo",
    duration: "ISO-da\u016Dro",
    ipv4: "IPv4-adreso",
    ipv6: "IPv6-adreso",
    mac: "MAC-adreso",
    cidrv4: "IPv4-rango",
    cidrv6: "IPv6-rango",
    base64: "64-ume kodita karaktraro",
    base64url: "URL-64-ume kodita karaktraro",
    json_string: "JSON-karaktraro",
    e164: "E.164-nombro",
    credit_card: "kreditkarta numero",
    jwt: "JWT",
    template_literal: "enigo"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "nombro",
    array: "tabelo",
    null: "senvalora"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Nevalida enigo: atendi\u011Dis instanceof ".concat(issue.expected, ", ricevi\u011Dis ").concat(received);
        }
        return "Nevalida enigo: atendi\u011Dis ".concat(expected, ", ricevi\u011Dis ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Nevalida enigo: atendi\u011Dis ".concat(stringifyPrimitive(issue.values[0]));
        return "Nevalida opcio: atendi\u011Dis unu el ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "Tro granda: atendi\u011Dis ke ".concat(issue.origin ?? "valoro", " havu ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "elementojn");
        return "Tro granda: atendi\u011Dis ke ".concat(issue.origin ?? "valoro", " havu ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Tro malgranda: atendi\u011Dis ke ".concat(issue.origin, " havu ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "Tro malgranda: atendi\u011Dis ke ".concat(issue.origin, " estu ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'Nevalida karaktraro: devas komenci\u011Di per "'.concat(_issue.prefix, '"');
        if (_issue.format === "ends_with")
          return 'Nevalida karaktraro: devas fini\u011Di per "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'Nevalida karaktraro: devas inkluzivi "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "Nevalida karaktraro: devas kongrui kun la modelo ".concat(_issue.pattern);
        return "Nevalida ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Nevalida nombro: devas esti oblo de ".concat(issue.divisor);
      case "unrecognized_keys":
        return "Nekonata".concat(issue.keys.length > 1 ? "j" : "", " \u015Dlosilo").concat(issue.keys.length > 1 ? "j" : "", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Nevalida \u015Dlosilo en ".concat(issue.origin);
      case "invalid_union":
        return "Nevalida enigo";
      case "invalid_element":
        return "Nevalida valoro en ".concat(issue.origin);
      default:
        return "Nevalida enigo";
    }
  };
};
function eo_default() {
  return {
    localeError: error7()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/fi.js
var error8 = () => {
  const Sizable = {
    string: { unit: "merkki\xE4", subject: "merkkijonon" },
    file: { unit: "tavua", subject: "tiedoston" },
    array: { unit: "alkiota", subject: "listan" },
    set: { unit: "alkiota", subject: "joukon" },
    map: { unit: "alkiota", subject: "kuvauksen" },
    number: { unit: "", subject: "luvun" },
    bigint: { unit: "", subject: "suuren kokonaisluvun" },
    int: { unit: "", subject: "kokonaisluvun" },
    date: { unit: "", subject: "p\xE4iv\xE4m\xE4\xE4r\xE4n" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "s\xE4\xE4nn\xF6llinen lauseke",
    email: "s\xE4hk\xF6postiosoite",
    url: "URL-osoite",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-aikaleima",
    date: "ISO-p\xE4iv\xE4m\xE4\xE4r\xE4",
    time: "ISO-aika",
    duration: "ISO-kesto",
    ipv4: "IPv4-osoite",
    ipv6: "IPv6-osoite",
    mac: "MAC-osoite",
    cidrv4: "IPv4-alue",
    cidrv6: "IPv6-alue",
    base64: "base64-koodattu merkkijono",
    base64url: "base64url-koodattu merkkijono",
    json_string: "JSON-merkkijono",
    e164: "E.164-luku",
    credit_card: "luottokortin numero",
    jwt: "JWT",
    template_literal: "templaattimerkkijono"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Virheellinen tyyppi: odotettiin instanceof ".concat(issue.expected, ", oli ").concat(received);
        }
        return "Virheellinen tyyppi: odotettiin ".concat(expected, ", oli ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Virheellinen sy\xF6te: t\xE4ytyy olla ".concat(stringifyPrimitive(issue.values[0]));
        return "Virheellinen valinta: t\xE4ytyy olla yksi seuraavista: ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Liian suuri: ".concat(sizing.subject, " t\xE4ytyy olla ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit).trim();
        }
        return "Liian suuri: arvon t\xE4ytyy olla ".concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Liian pieni: ".concat(sizing.subject, " t\xE4ytyy olla ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit).trim();
        }
        return "Liian pieni: arvon t\xE4ytyy olla ".concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'Virheellinen sy\xF6te: t\xE4ytyy alkaa "'.concat(_issue.prefix, '"');
        if (_issue.format === "ends_with")
          return 'Virheellinen sy\xF6te: t\xE4ytyy loppua "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'Virheellinen sy\xF6te: t\xE4ytyy sis\xE4lt\xE4\xE4 "'.concat(_issue.includes, '"');
        if (_issue.format === "regex") {
          return "Virheellinen sy\xF6te: t\xE4ytyy vastata s\xE4\xE4nn\xF6llist\xE4 lauseketta ".concat(_issue.pattern);
        }
        return "Virheellinen ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Virheellinen luku: t\xE4ytyy olla luvun ".concat(issue.divisor, " monikerta");
      case "unrecognized_keys":
        return "".concat(issue.keys.length > 1 ? "Tuntemattomat avaimet" : "Tuntematon avain", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Virheellinen avain tietueessa";
      case "invalid_union":
        return "Virheellinen unioni";
      case "invalid_element":
        return "Virheellinen arvo joukossa";
      default:
        return "Virheellinen sy\xF6te";
    }
  };
};
function fi_default() {
  return {
    localeError: error8()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/fr-CA.js
var error9 = () => {
  const Sizable = {
    string: { unit: "caract\xE8res", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "\xE9l\xE9ments", verb: "avoir" },
    set: { unit: "\xE9l\xE9ments", verb: "avoir" },
    map: { unit: "\xE9l\xE9ments", verb: "avoir" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "entr\xE9e",
    email: "adresse courriel",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "date-heure ISO",
    date: "date ISO",
    time: "heure ISO",
    duration: "dur\xE9e ISO",
    ipv4: "adresse IPv4",
    ipv6: "adresse IPv6",
    mac: "adresse MAC",
    cidrv4: "plage IPv4",
    cidrv6: "plage IPv6",
    base64: "cha\xEEne encod\xE9e en base64",
    base64url: "cha\xEEne encod\xE9e en base64url",
    json_string: "cha\xEEne JSON",
    e164: "num\xE9ro E.164",
    credit_card: "num\xE9ro de carte de cr\xE9dit",
    jwt: "JWT",
    template_literal: "entr\xE9e"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Entr\xE9e invalide : attendu instanceof ".concat(issue.expected, ", re\xE7u ").concat(received);
        }
        return "Entr\xE9e invalide : attendu ".concat(expected, ", re\xE7u ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Entr\xE9e invalide : attendu ".concat(stringifyPrimitive(issue.values[0]));
        return "Option invalide : attendu l'une des valeurs suivantes ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "\u2264" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "Trop grand : attendu que ".concat(issue.origin ?? "la valeur", " ait ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit);
        return "Trop grand : attendu que ".concat(issue.origin ?? "la valeur", " soit ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? "\u2265" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Trop petit : attendu que ".concat(issue.origin, " ait ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "Trop petit : attendu que ".concat(issue.origin, " soit ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return 'Cha\xEEne invalide : doit commencer par "'.concat(_issue.prefix, '"');
        }
        if (_issue.format === "ends_with")
          return 'Cha\xEEne invalide : doit se terminer par "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'Cha\xEEne invalide : doit inclure "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "Cha\xEEne invalide : doit correspondre au motif ".concat(_issue.pattern);
        return "".concat(FormatDictionary[_issue.format] ?? issue.format, " invalide");
      }
      case "not_multiple_of":
        return "Nombre invalide : doit \xEAtre un multiple de ".concat(issue.divisor);
      case "unrecognized_keys":
        return "Cl\xE9".concat(issue.keys.length > 1 ? "s" : "", " non reconnue").concat(issue.keys.length > 1 ? "s" : "", " : ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Cl\xE9 invalide dans ".concat(issue.origin);
      case "invalid_union":
        return "Entr\xE9e invalide";
      case "invalid_element":
        return "Valeur invalide dans ".concat(issue.origin);
      default:
        return "Entr\xE9e invalide";
    }
  };
};
function fr_CA_default() {
  return {
    localeError: error9()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/hr.js
var error10 = () => {
  const Sizable = {
    string: { unit: "znakova", verb: "imati" },
    file: { unit: "bajtova", verb: "imati" },
    array: { unit: "stavki", verb: "imati" },
    set: { unit: "stavki", verb: "imati" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "unos",
    email: "email adresa",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum i vrijeme",
    date: "ISO datum",
    time: "ISO vrijeme",
    duration: "ISO trajanje",
    ipv4: "IPv4 adresa",
    ipv6: "IPv6 adresa",
    mac: "MAC adresa",
    cidrv4: "IPv4 raspon",
    cidrv6: "IPv6 raspon",
    base64: "base64 kodirani tekst",
    base64url: "base64url kodirani tekst",
    json_string: "JSON tekst",
    e164: "E.164 broj",
    credit_card: "broj kreditne kartice",
    jwt: "JWT",
    template_literal: "unos"
  };
  const TypeDictionary = {
    nan: "NaN",
    string: "tekst",
    number: "broj",
    boolean: "boolean",
    array: "niz",
    object: "objekt",
    set: "skup",
    file: "datoteka",
    date: "datum",
    bigint: "bigint",
    symbol: "simbol",
    undefined: "undefined",
    null: "null",
    function: "funkcija",
    map: "mapa"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Neispravan unos: o\u010Dekuje se instanceof ".concat(issue.expected, ", a primljeno je ").concat(received);
        }
        return "Neispravan unos: o\u010Dekuje se ".concat(expected, ", a primljeno je ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Neispravna vrijednost: o\u010Dekivano ".concat(stringifyPrimitive(issue.values[0]));
        return "Neispravna opcija: o\u010Dekivano jedno od ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        const origin = TypeDictionary[issue.origin] ?? issue.origin;
        if (sizing)
          return "Preveliko: o\u010Dekivano da ".concat(origin ?? "vrijednost", " ima ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "elemenata");
        return "Preveliko: o\u010Dekivano da ".concat(origin ?? "vrijednost", " bude ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        const origin = TypeDictionary[issue.origin] ?? issue.origin;
        if (sizing) {
          return "Premalo: o\u010Dekivano da ".concat(origin, " ima ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "Premalo: o\u010Dekivano da ".concat(origin, " bude ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'Neispravan tekst: mora zapo\u010Dinjati s "'.concat(_issue.prefix, '"');
        if (_issue.format === "ends_with")
          return 'Neispravan tekst: mora zavr\u0161avati s "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'Neispravan tekst: mora sadr\u017Eavati "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "Neispravan tekst: mora odgovarati uzorku ".concat(_issue.pattern);
        return "Neispravna ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Neispravan broj: mora biti vi\u0161ekratnik od ".concat(issue.divisor);
      case "unrecognized_keys":
        return "Neprepoznat".concat(issue.keys.length > 1 ? "i klju\u010Devi" : " klju\u010D", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Neispravan klju\u010D u ".concat(TypeDictionary[issue.origin] ?? issue.origin);
      case "invalid_union":
        return "Neispravan unos";
      case "invalid_element":
        return "Neispravna vrijednost u ".concat(TypeDictionary[issue.origin] ?? issue.origin);
      default:
        return "Neispravan unos";
    }
  };
};
function hr_default() {
  return {
    localeError: error10()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/hu.js
var error11 = () => {
  const Sizable = {
    string: { unit: "karakter", verb: "legyen" },
    file: { unit: "byte", verb: "legyen" },
    array: { unit: "elem", verb: "legyen" },
    set: { unit: "elem", verb: "legyen" },
    map: { unit: "elem", verb: "legyen" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "bemenet",
    email: "email c\xEDm",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO id\u0151b\xE9lyeg",
    date: "ISO d\xE1tum",
    time: "ISO id\u0151",
    duration: "ISO id\u0151intervallum",
    ipv4: "IPv4 c\xEDm",
    ipv6: "IPv6 c\xEDm",
    mac: "MAC c\xEDm",
    cidrv4: "IPv4 tartom\xE1ny",
    cidrv6: "IPv6 tartom\xE1ny",
    base64: "base64-k\xF3dolt string",
    base64url: "base64url-k\xF3dolt string",
    json_string: "JSON string",
    e164: "E.164 sz\xE1m",
    credit_card: "hitelk\xE1rtyasz\xE1m",
    jwt: "JWT",
    template_literal: "bemenet"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "sz\xE1m",
    array: "t\xF6mb"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k instanceof ".concat(issue.expected, ", a kapott \xE9rt\xE9k ").concat(received);
        }
        return "\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k ".concat(expected, ", a kapott \xE9rt\xE9k ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "\xC9rv\xE9nytelen bemenet: a v\xE1rt \xE9rt\xE9k ".concat(stringifyPrimitive(issue.values[0]));
        return "\xC9rv\xE9nytelen opci\xF3: valamelyik \xE9rt\xE9k v\xE1rt ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "T\xFAl nagy: ".concat(issue.origin ?? "\xE9rt\xE9k", " m\xE9rete t\xFAl nagy ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "elem");
        return "T\xFAl nagy: a bemeneti \xE9rt\xE9k ".concat(issue.origin ?? "\xE9rt\xE9k", " t\xFAl nagy: ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "T\xFAl kicsi: a bemeneti \xE9rt\xE9k ".concat(issue.origin, " m\xE9rete t\xFAl kicsi ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "T\xFAl kicsi: a bemeneti \xE9rt\xE9k ".concat(issue.origin, " t\xFAl kicsi ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return '\xC9rv\xE9nytelen string: "'.concat(_issue.prefix, '" \xE9rt\xE9kkel kell kezd\u0151dnie');
        if (_issue.format === "ends_with")
          return '\xC9rv\xE9nytelen string: "'.concat(_issue.suffix, '" \xE9rt\xE9kkel kell v\xE9gz\u0151dnie');
        if (_issue.format === "includes")
          return '\xC9rv\xE9nytelen string: "'.concat(_issue.includes, '" \xE9rt\xE9ket kell tartalmaznia');
        if (_issue.format === "regex")
          return "\xC9rv\xE9nytelen string: ".concat(_issue.pattern, " mint\xE1nak kell megfelelnie");
        return "\xC9rv\xE9nytelen ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "\xC9rv\xE9nytelen sz\xE1m: ".concat(issue.divisor, " t\xF6bbsz\xF6r\xF6s\xE9nek kell lennie");
      case "unrecognized_keys":
        return "Ismeretlen kulcs".concat(issue.keys.length > 1 ? "s" : "", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "\xC9rv\xE9nytelen kulcs ".concat(issue.origin);
      case "invalid_union":
        return "\xC9rv\xE9nytelen bemenet";
      case "invalid_element":
        return "\xC9rv\xE9nytelen \xE9rt\xE9k: ".concat(issue.origin);
      default:
        return "\xC9rv\xE9nytelen bemenet";
    }
  };
};
function hu_default() {
  return {
    localeError: error11()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/id.js
var error12 = () => {
  const Sizable = {
    string: { unit: "karakter", verb: "memiliki" },
    file: { unit: "byte", verb: "memiliki" },
    array: { unit: "item", verb: "memiliki" },
    set: { unit: "item", verb: "memiliki" },
    map: { unit: "item", verb: "memiliki" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "alamat email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "tanggal dan waktu format ISO",
    date: "tanggal format ISO",
    time: "jam format ISO",
    duration: "durasi format ISO",
    ipv4: "alamat IPv4",
    ipv6: "alamat IPv6",
    mac: "alamat MAC",
    cidrv4: "rentang alamat IPv4",
    cidrv6: "rentang alamat IPv6",
    base64: "string dengan enkode base64",
    base64url: "string dengan enkode base64url",
    json_string: "string JSON",
    e164: "angka E.164",
    credit_card: "nomor kartu kredit",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Input tidak valid: diharapkan instanceof ".concat(issue.expected, ", diterima ").concat(received);
        }
        return "Input tidak valid: diharapkan ".concat(expected, ", diterima ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Input tidak valid: diharapkan ".concat(stringifyPrimitive(issue.values[0]));
        return "Pilihan tidak valid: diharapkan salah satu dari ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "Terlalu besar: diharapkan ".concat(issue.origin ?? "value", " memiliki ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "elemen");
        return "Terlalu besar: diharapkan ".concat(issue.origin ?? "value", " menjadi ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Terlalu kecil: diharapkan ".concat(issue.origin, " memiliki ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "Terlalu kecil: diharapkan ".concat(issue.origin, " menjadi ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'String tidak valid: harus dimulai dengan "'.concat(_issue.prefix, '"');
        if (_issue.format === "ends_with")
          return 'String tidak valid: harus berakhir dengan "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'String tidak valid: harus menyertakan "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "String tidak valid: harus sesuai pola ".concat(_issue.pattern);
        return "".concat(FormatDictionary[_issue.format] ?? issue.format, " tidak valid");
      }
      case "not_multiple_of":
        return "Angka tidak valid: harus kelipatan dari ".concat(issue.divisor);
      case "unrecognized_keys":
        return "Kunci tidak dikenali ".concat(issue.keys.length > 1 ? "s" : "", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Kunci tidak valid di ".concat(issue.origin);
      case "invalid_union":
        return "Input tidak valid";
      case "invalid_element":
        return "Nilai tidak valid di ".concat(issue.origin);
      default:
        return "Input tidak valid";
    }
  };
};
function id_default() {
  return {
    localeError: error12()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/is.js
var error13 = () => {
  const Sizable = {
    string: { unit: "stafi", verb: "a\xF0 hafa" },
    file: { unit: "b\xE6ti", verb: "a\xF0 hafa" },
    array: { unit: "hluti", verb: "a\xF0 hafa" },
    set: { unit: "hluti", verb: "a\xF0 hafa" },
    map: { unit: "hluti", verb: "a\xF0 hafa" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "gildi",
    email: "netfang",
    url: "vefsl\xF3\xF0",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dagsetning og t\xEDmi",
    date: "ISO dagsetning",
    time: "ISO t\xEDmi",
    duration: "ISO t\xEDmalengd",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    mac: "MAC address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded strengur",
    base64url: "base64url-encoded strengur",
    json_string: "JSON strengur",
    e164: "E.164 t\xF6lugildi",
    credit_card: "kreditkortan\xFAmer",
    jwt: "JWT",
    template_literal: "gildi"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "n\xFAmer",
    array: "fylki"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Rangt gildi: \xDE\xFA sl\xF3st inn ".concat(received, " \xFEar sem \xE1 a\xF0 vera instanceof ").concat(issue.expected);
        }
        return "Rangt gildi: \xDE\xFA sl\xF3st inn ".concat(received, " \xFEar sem \xE1 a\xF0 vera ").concat(expected);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Rangt gildi: gert r\xE1\xF0 fyrir ".concat(stringifyPrimitive(issue.values[0]));
        return "\xD3gilt val: m\xE1 vera eitt af eftirfarandi ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "Of st\xF3rt: gert er r\xE1\xF0 fyrir a\xF0 ".concat(issue.origin ?? "gildi", " hafi ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "hluti");
        return "Of st\xF3rt: gert er r\xE1\xF0 fyrir a\xF0 ".concat(issue.origin ?? "gildi", " s\xE9 ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Of l\xEDti\xF0: gert er r\xE1\xF0 fyrir a\xF0 ".concat(issue.origin, " hafi ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "Of l\xEDti\xF0: gert er r\xE1\xF0 fyrir a\xF0 ".concat(issue.origin, " s\xE9 ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return '\xD3gildur strengur: ver\xF0ur a\xF0 byrja \xE1 "'.concat(_issue.prefix, '"');
        }
        if (_issue.format === "ends_with")
          return '\xD3gildur strengur: ver\xF0ur a\xF0 enda \xE1 "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return '\xD3gildur strengur: ver\xF0ur a\xF0 innihalda "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "\xD3gildur strengur: ver\xF0ur a\xF0 fylgja mynstri ".concat(_issue.pattern);
        return "Rangt ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "R\xF6ng tala: ver\xF0ur a\xF0 vera margfeldi af ".concat(issue.divisor);
      case "unrecognized_keys":
        return "\xD3\xFEekkt ".concat(issue.keys.length > 1 ? "ir lyklar" : "ur lykill", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Rangur lykill \xED ".concat(issue.origin);
      case "invalid_union":
        return "Rangt gildi";
      case "invalid_element":
        return "Rangt gildi \xED ".concat(issue.origin);
      default:
        return "Rangt gildi";
    }
  };
};
function is_default() {
  return {
    localeError: error13()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/it.js
var error14 = () => {
  const Sizable = {
    string: { unit: "caratteri", verb: "avere" },
    file: { unit: "byte", verb: "avere" },
    array: { unit: "elementi", verb: "avere" },
    set: { unit: "elementi", verb: "avere" },
    map: { unit: "elementi", verb: "avere" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "indirizzo email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "data e ora ISO",
    date: "data ISO",
    time: "ora ISO",
    duration: "durata ISO",
    ipv4: "indirizzo IPv4",
    ipv6: "indirizzo IPv6",
    mac: "indirizzo MAC",
    cidrv4: "intervallo IPv4",
    cidrv6: "intervallo IPv6",
    base64: "stringa codificata in base64",
    base64url: "URL codificata in base64",
    json_string: "stringa JSON",
    e164: "numero E.164",
    credit_card: "numero di carta di credito",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "numero",
    array: "vettore"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Input non valido: atteso instanceof ".concat(issue.expected, ", ricevuto ").concat(received);
        }
        return "Input non valido: atteso ".concat(expected, ", ricevuto ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Input non valido: atteso ".concat(stringifyPrimitive(issue.values[0]));
        return "Opzione non valida: atteso uno tra ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "Troppo grande: ".concat(issue.origin ?? "valore", " deve avere ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "elementi");
        return "Troppo grande: ".concat(issue.origin ?? "valore", " deve essere ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Troppo piccolo: ".concat(issue.origin, " deve avere ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "Troppo piccolo: ".concat(issue.origin, " deve essere ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'Stringa non valida: deve iniziare con "'.concat(_issue.prefix, '"');
        if (_issue.format === "ends_with")
          return 'Stringa non valida: deve terminare con "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'Stringa non valida: deve includere "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "Stringa non valida: deve corrispondere al pattern ".concat(_issue.pattern);
        return "Input non valido: ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Numero non valido: deve essere un multiplo di ".concat(issue.divisor);
      case "unrecognized_keys":
        return "Chiav".concat(issue.keys.length > 1 ? "i" : "e", " non riconosciut").concat(issue.keys.length > 1 ? "e" : "a", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Chiave non valida in ".concat(issue.origin);
      case "invalid_union":
        return "Input non valido";
      case "invalid_element":
        return "Valore non valido in ".concat(issue.origin);
      default:
        return "Input non valido";
    }
  };
};
function it_default() {
  return {
    localeError: error14()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/kh.js
function kh_default() {
  return km_default();
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/ms.js
var error15 = () => {
  const Sizable = {
    string: { unit: "aksara", verb: "mempunyai" },
    file: { unit: "bait", verb: "mempunyai" },
    array: { unit: "elemen", verb: "mempunyai" },
    set: { unit: "elemen", verb: "mempunyai" },
    map: { unit: "elemen", verb: "mempunyai" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "alamat e-mel",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "tarikh masa ISO",
    date: "tarikh ISO",
    time: "masa ISO",
    duration: "tempoh ISO",
    ipv4: "alamat IPv4",
    ipv6: "alamat IPv6",
    mac: "alamat MAC",
    cidrv4: "julat IPv4",
    cidrv6: "julat IPv6",
    base64: "string dikodkan base64",
    base64url: "string dikodkan base64url",
    json_string: "string JSON",
    e164: "nombor E.164",
    credit_card: "nombor kad kredit",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "nombor"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Input tidak sah: dijangka instanceof ".concat(issue.expected, ", diterima ").concat(received);
        }
        return "Input tidak sah: dijangka ".concat(expected, ", diterima ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Input tidak sah: dijangka ".concat(stringifyPrimitive(issue.values[0]));
        return "Pilihan tidak sah: dijangka salah satu daripada ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "Terlalu besar: dijangka ".concat(issue.origin ?? "nilai", " ").concat(sizing.verb, " ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "elemen");
        return "Terlalu besar: dijangka ".concat(issue.origin ?? "nilai", " adalah ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Terlalu kecil: dijangka ".concat(issue.origin, " ").concat(sizing.verb, " ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "Terlalu kecil: dijangka ".concat(issue.origin, " adalah ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'String tidak sah: mesti bermula dengan "'.concat(_issue.prefix, '"');
        if (_issue.format === "ends_with")
          return 'String tidak sah: mesti berakhir dengan "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'String tidak sah: mesti mengandungi "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "String tidak sah: mesti sepadan dengan corak ".concat(_issue.pattern);
        return "".concat(FormatDictionary[_issue.format] ?? issue.format, " tidak sah");
      }
      case "not_multiple_of":
        return "Nombor tidak sah: perlu gandaan ".concat(issue.divisor);
      case "unrecognized_keys":
        return "Kunci tidak dikenali: ".concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Kunci tidak sah dalam ".concat(issue.origin);
      case "invalid_union":
        return "Input tidak sah";
      case "invalid_element":
        return "Nilai tidak sah dalam ".concat(issue.origin);
      default:
        return "Input tidak sah";
    }
  };
};
function ms_default() {
  return {
    localeError: error15()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/nl.js
var error16 = () => {
  const Sizable = {
    string: { unit: "tekens", verb: "heeft" },
    file: { unit: "bytes", verb: "heeft" },
    array: { unit: "elementen", verb: "heeft" },
    set: { unit: "elementen", verb: "heeft" },
    map: { unit: "elementen", verb: "heeft" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "invoer",
    email: "emailadres",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum en tijd",
    date: "ISO datum",
    time: "ISO tijd",
    duration: "ISO duur",
    ipv4: "IPv4-adres",
    ipv6: "IPv6-adres",
    mac: "MAC-adres",
    cidrv4: "IPv4-bereik",
    cidrv6: "IPv6-bereik",
    base64: "base64-gecodeerde tekst",
    base64url: "base64 URL-gecodeerde tekst",
    json_string: "JSON string",
    e164: "E.164-nummer",
    credit_card: "creditcardnummer",
    jwt: "JWT",
    template_literal: "invoer"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "getal"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Ongeldige invoer: verwacht instanceof ".concat(issue.expected, ", ontving ").concat(received);
        }
        return "Ongeldige invoer: verwacht ".concat(expected, ", ontving ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Ongeldige invoer: verwacht ".concat(stringifyPrimitive(issue.values[0]));
        return "Ongeldige optie: verwacht \xE9\xE9n van ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        const longName = issue.origin === "date" ? "laat" : issue.origin === "string" ? "lang" : "groot";
        if (sizing)
          return "Te ".concat(longName, ": verwacht dat ").concat(issue.origin ?? "waarde", " ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "elementen", " ").concat(sizing.verb);
        return "Te ".concat(longName, ": verwacht dat ").concat(issue.origin ?? "waarde", " ").concat(adj).concat(issue.maximum.toString(), " is");
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        const shortName = issue.origin === "date" ? "vroeg" : issue.origin === "string" ? "kort" : "klein";
        if (sizing) {
          return "Te ".concat(shortName, ": verwacht dat ").concat(issue.origin, " ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit, " ").concat(sizing.verb);
        }
        return "Te ".concat(shortName, ": verwacht dat ").concat(issue.origin, " ").concat(adj).concat(issue.minimum.toString(), " is");
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return 'Ongeldige tekst: moet met "'.concat(_issue.prefix, '" beginnen');
        }
        if (_issue.format === "ends_with")
          return 'Ongeldige tekst: moet op "'.concat(_issue.suffix, '" eindigen');
        if (_issue.format === "includes")
          return 'Ongeldige tekst: moet "'.concat(_issue.includes, '" bevatten');
        if (_issue.format === "regex")
          return "Ongeldige tekst: moet overeenkomen met patroon ".concat(_issue.pattern);
        return "Ongeldig: ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Ongeldig getal: moet een veelvoud van ".concat(issue.divisor, " zijn");
      case "unrecognized_keys":
        return "Onbekende key".concat(issue.keys.length > 1 ? "s" : "", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Ongeldige key in ".concat(issue.origin);
      case "invalid_union":
        return "Ongeldige invoer";
      case "invalid_element":
        return "Ongeldige waarde in ".concat(issue.origin);
      default:
        return "Ongeldige invoer";
    }
  };
};
function nl_default() {
  return {
    localeError: error16()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/nn.js
var error17 = () => {
  const Sizable = {
    string: { unit: "teikn", verb: "\xE5 ha" },
    file: { unit: "bytes", verb: "\xE5 ha" },
    array: { unit: "element", verb: "\xE5 innehalde" },
    set: { unit: "element", verb: "\xE5 innehalde" },
    map: { unit: "element", verb: "\xE5 innehalde" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "e-postadresse",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dato- og klokkeslett",
    date: "ISO-dato",
    time: "ISO-klokkeslett",
    duration: "ISO-varigheit",
    ipv4: "IPv4-adresse",
    ipv6: "IPv6-adresse",
    mac: "MAC-adresse",
    cidrv4: "IPv4-spekter",
    cidrv6: "IPv6-spekter",
    base64: "base64-enkoda streng",
    base64url: "base64url-enkoda streng",
    json_string: "JSON-streng",
    e164: "E.164-nummer",
    credit_card: "kredittkortnummer",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "tal",
    array: "liste"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Ugyldig input: forventa instanceof ".concat(issue.expected, ", fekk ").concat(received);
        }
        return "Ugyldig input: forventa ".concat(expected, ", fekk ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Ugyldig verdi: forventa ".concat(stringifyPrimitive(issue.values[0]));
        return "Ugyldig val: forventa eitt av ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "For stor(t): forventa ".concat(issue.origin ?? "value", " til \xE5 ha ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "element");
        return "For stor(t): forventa ".concat(issue.origin ?? "value", " til \xE5 ha ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "For lite(n): forventa ".concat(issue.origin, " til \xE5 ha ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "For lite(n): forventa ".concat(issue.origin, " til \xE5 ha ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'Ugyldig streng: m\xE5 starte med "'.concat(_issue.prefix, '"');
        if (_issue.format === "ends_with")
          return 'Ugyldig streng: m\xE5 slutte med "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'Ugyldig streng: m\xE5 innehalde "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "Ugyldig streng: m\xE5 matche m\xF8nsteret ".concat(_issue.pattern);
        return "Ugyldig ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Ugyldig tal: m\xE5 vere eit multiplum av ".concat(issue.divisor);
      case "unrecognized_keys":
        return "".concat(issue.keys.length > 1 ? "Ukjende n\xF8klar" : "Ukjend n\xF8kkel", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Ugyldig n\xF8kkel i ".concat(issue.origin);
      case "invalid_union":
        return "Ugyldig input";
      case "invalid_element":
        return "Ugyldig verdi i ".concat(issue.origin);
      default:
        return "Ugyldig input";
    }
  };
};
function nn_default() {
  return {
    localeError: error17()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/no.js
var error18 = () => {
  const Sizable = {
    string: { unit: "tegn", verb: "\xE5 ha" },
    file: { unit: "bytes", verb: "\xE5 ha" },
    array: { unit: "elementer", verb: "\xE5 inneholde" },
    set: { unit: "elementer", verb: "\xE5 inneholde" },
    map: { unit: "elementer", verb: "\xE5 inneholde" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "e-postadresse",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO dato- og klokkeslett",
    date: "ISO-dato",
    time: "ISO-klokkeslett",
    duration: "ISO-varighet",
    ipv4: "IPv4-adresse",
    ipv6: "IPv6-adresse",
    mac: "MAC-adresse",
    cidrv4: "IPv4-spekter",
    cidrv6: "IPv6-spekter",
    base64: "base64-enkodet streng",
    base64url: "base64url-enkodet streng",
    json_string: "JSON-streng",
    e164: "E.164-nummer",
    credit_card: "kredittkortnummer",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "tall",
    array: "liste"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Ugyldig input: forventet instanceof ".concat(issue.expected, ", fikk ").concat(received);
        }
        return "Ugyldig input: forventet ".concat(expected, ", fikk ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Ugyldig verdi: forventet ".concat(stringifyPrimitive(issue.values[0]));
        return "Ugyldig valg: forventet en av ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "For stor(t): forventet ".concat(issue.origin ?? "value", " til \xE5 ha ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "elementer");
        return "For stor(t): forventet ".concat(issue.origin ?? "value", " til \xE5 ha ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "For lite(n): forventet ".concat(issue.origin, " til \xE5 ha ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "For lite(n): forventet ".concat(issue.origin, " til \xE5 ha ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'Ugyldig streng: m\xE5 starte med "'.concat(_issue.prefix, '"');
        if (_issue.format === "ends_with")
          return 'Ugyldig streng: m\xE5 ende med "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'Ugyldig streng: m\xE5 inneholde "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "Ugyldig streng: m\xE5 matche m\xF8nsteret ".concat(_issue.pattern);
        return "Ugyldig ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Ugyldig tall: m\xE5 v\xE6re et multiplum av ".concat(issue.divisor);
      case "unrecognized_keys":
        return "".concat(issue.keys.length > 1 ? "Ukjente n\xF8kler" : "Ukjent n\xF8kkel", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Ugyldig n\xF8kkel i ".concat(issue.origin);
      case "invalid_union":
        return "Ugyldig input";
      case "invalid_element":
        return "Ugyldig verdi i ".concat(issue.origin);
      default:
        return "Ugyldig input";
    }
  };
};
function no_default() {
  return {
    localeError: error18()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/ota.js
var error19 = () => {
  const Sizable = {
    string: { unit: "harf", verb: "olmal\u0131d\u0131r" },
    file: { unit: "bayt", verb: "olmal\u0131d\u0131r" },
    array: { unit: "unsur", verb: "olmal\u0131d\u0131r" },
    set: { unit: "unsur", verb: "olmal\u0131d\u0131r" },
    map: { unit: "unsur", verb: "olmal\u0131d\u0131r" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "giren",
    email: "epostag\xE2h",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO heng\xE2m\u0131",
    date: "ISO tarihi",
    time: "ISO zaman\u0131",
    duration: "ISO m\xFCddeti",
    ipv4: "IPv4 ni\u015F\xE2n\u0131",
    ipv6: "IPv6 ni\u015F\xE2n\u0131",
    mac: "MAC ni\u015F\xE2n\u0131",
    cidrv4: "IPv4 menzili",
    cidrv6: "IPv6 menzili",
    base64: "base64-\u015Fifreli metin",
    base64url: "base64url-\u015Fifreli metin",
    json_string: "JSON metin",
    e164: "E.164 say\u0131s\u0131",
    credit_card: "i'tib\xE2r kart\u0131 numaras\u0131",
    jwt: "JWT",
    template_literal: "giren"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "numara",
    array: "saf",
    null: "gayb"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "F\xE2sit giren: umulan instanceof ".concat(issue.expected, ", al\u0131nan ").concat(received);
        }
        return "F\xE2sit giren: umulan ".concat(expected, ", al\u0131nan ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "F\xE2sit giren: umulan ".concat(stringifyPrimitive(issue.values[0]));
        return "F\xE2sit tercih: m\xFBteberler ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "Fazla b\xFCy\xFCk: ".concat(issue.origin ?? "value", ", ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "elements", " sahip olmal\u0131yd\u0131.");
        return "Fazla b\xFCy\xFCk: ".concat(issue.origin ?? "value", ", ").concat(adj).concat(issue.maximum.toString(), " olmal\u0131yd\u0131.");
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Fazla k\xFC\xE7\xFCk: ".concat(issue.origin, ", ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit, " sahip olmal\u0131yd\u0131.");
        }
        return "Fazla k\xFC\xE7\xFCk: ".concat(issue.origin, ", ").concat(adj).concat(issue.minimum.toString(), " olmal\u0131yd\u0131.");
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'F\xE2sit metin: "'.concat(_issue.prefix, '" ile ba\u015Flamal\u0131.');
        if (_issue.format === "ends_with")
          return 'F\xE2sit metin: "'.concat(_issue.suffix, '" ile bitmeli.');
        if (_issue.format === "includes")
          return 'F\xE2sit metin: "'.concat(_issue.includes, '" ihtiv\xE2 etmeli.');
        if (_issue.format === "regex")
          return "F\xE2sit metin: ".concat(_issue.pattern, " nak\u015F\u0131na uymal\u0131.");
        return "F\xE2sit ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "F\xE2sit say\u0131: ".concat(issue.divisor, " kat\u0131 olmal\u0131yd\u0131.");
      case "unrecognized_keys":
        return "Tan\u0131nmayan anahtar ".concat(issue.keys.length > 1 ? "s" : "", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "".concat(issue.origin, " i\xE7in tan\u0131nmayan anahtar var.");
      case "invalid_union":
        return "Giren tan\u0131namad\u0131.";
      case "invalid_element":
        return "".concat(issue.origin, " i\xE7in tan\u0131nmayan k\u0131ymet var.");
      default:
        return "K\u0131ymet tan\u0131namad\u0131.";
    }
  };
};
function ota_default() {
  return {
    localeError: error19()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/ro.js
var error20 = () => {
  const Sizable = {
    string: { unit: "caractere", verb: "s\u0103 aib\u0103" },
    file: { unit: "octe\u021Bi", verb: "s\u0103 aib\u0103" },
    array: { unit: "elemente", verb: "s\u0103 aib\u0103" },
    set: { unit: "elemente", verb: "s\u0103 aib\u0103" },
    map: { unit: "intr\u0103ri", verb: "s\u0103 aib\u0103" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "intrare",
    email: "adres\u0103 de email",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "dat\u0103 \u0219i or\u0103 ISO",
    date: "dat\u0103 ISO",
    time: "or\u0103 ISO",
    duration: "durat\u0103 ISO",
    ipv4: "adres\u0103 IPv4",
    ipv6: "adres\u0103 IPv6",
    mac: "adres\u0103 MAC",
    cidrv4: "interval IPv4",
    cidrv6: "interval IPv6",
    base64: "\u0219ir codat base64",
    base64url: "\u0219ir codat base64url",
    json_string: "\u0219ir JSON",
    e164: "num\u0103r E.164",
    credit_card: "num\u0103r de card de credit",
    jwt: "JWT",
    template_literal: "intrare"
  };
  const TypeDictionary = {
    nan: "NaN",
    string: "\u0219ir",
    number: "num\u0103r",
    boolean: "boolean",
    function: "func\u021Bie",
    array: "matrice",
    object: "obiect",
    undefined: "nedefinit",
    symbol: "simbol",
    bigint: "num\u0103r mare",
    void: "void",
    never: "never",
    map: "hart\u0103",
    set: "set"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        return "Intrare invalid\u0103: a\u0219teptat ".concat(expected, ", primit ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Intrare invalid\u0103: a\u0219teptat ".concat(stringifyPrimitive(issue.values[0]));
        return "Op\u021Biune invalid\u0103: a\u0219teptat una dintre ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "Prea mare: a\u0219teptat ca ".concat(issue.origin ?? "valoarea", " ").concat(sizing.verb, " ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "elemente");
        return "Prea mare: a\u0219teptat ca ".concat(issue.origin ?? "valoarea", " s\u0103 fie ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Prea mic: a\u0219teptat ca ".concat(issue.origin, " ").concat(sizing.verb, " ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "Prea mic: a\u0219teptat ca ".concat(issue.origin, " s\u0103 fie ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return '\u0218ir invalid: trebuie s\u0103 \xEEnceap\u0103 cu "'.concat(_issue.prefix, '"');
        }
        if (_issue.format === "ends_with")
          return '\u0218ir invalid: trebuie s\u0103 se termine cu "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return '\u0218ir invalid: trebuie s\u0103 includ\u0103 "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "\u0218ir invalid: trebuie s\u0103 se potriveasc\u0103 cu modelul ".concat(_issue.pattern);
        return "Format invalid: ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Num\u0103r invalid: trebuie s\u0103 fie multiplu de ".concat(issue.divisor);
      case "unrecognized_keys":
        return "Chei nerecunoscute: ".concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Cheie invalid\u0103 \xEEn ".concat(issue.origin);
      case "invalid_union":
        return "Intrare invalid\u0103";
      case "invalid_element":
        return "Valoare invalid\u0103 \xEEn ".concat(issue.origin);
      default:
        return "Intrare invalid\u0103";
    }
  };
};
function ro_default() {
  return {
    localeError: error20()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/sk.js
var error21 = () => {
  const Sizable = {
    string: { unit: "znakov", verb: "ma\u0165" },
    file: { unit: "bajtov", verb: "ma\u0165" },
    array: { unit: "prvkov", verb: "ma\u0165" },
    set: { unit: "prvkov", verb: "ma\u0165" },
    map: { unit: "polo\u017Eiek", verb: "ma\u0165" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "regul\xE1rny v\xFDraz",
    email: "e-mailov\xE1 adresa",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "d\xE1tum a \u010Das vo form\xE1te ISO",
    date: "d\xE1tum vo form\xE1te ISO",
    time: "\u010Das vo form\xE1te ISO",
    duration: "doba trvania ISO",
    ipv4: "IPv4 adresa",
    ipv6: "IPv6 adresa",
    mac: "MAC adresa",
    cidrv4: "rozsah IPv4",
    cidrv6: "rozsah IPv6",
    base64: "re\u0165azec zak\xF3dovan\xFD vo form\xE1te base64",
    base64url: "re\u0165azec zak\xF3dovan\xFD vo form\xE1te base64url",
    json_string: "re\u0165azec vo form\xE1te JSON",
    e164: "\u010D\xEDslo E.164",
    credit_card: "\u010D\xEDslo kreditnej karty",
    jwt: "JWT",
    template_literal: "vstup"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "\u010D\xEDslo",
    string: "re\u0165azec",
    function: "funkcia",
    array: "pole"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Neplatn\xFD vstup: o\u010Dak\xE1van\xE9 instanceof ".concat(issue.expected, ", obdr\u017Ean\xE9 ").concat(received);
        }
        return "Neplatn\xFD vstup: o\u010Dak\xE1van\xE9 ".concat(expected, ", obdr\u017Ean\xE9 ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Neplatn\xFD vstup: o\u010Dak\xE1van\xE9 ".concat(stringifyPrimitive(issue.values[0]));
        return "Neplatn\xFD vstup: o\u010Dak\xE1van\xE1 jedna z hodn\xF4t ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Hodnota je pr\xEDli\u0161 ve\u013Ek\xE1: ".concat(issue.origin ?? "hodnota", " mus\xED ma\u0165 ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "prvkov");
        }
        return "Hodnota je pr\xEDli\u0161 ve\u013Ek\xE1: ".concat(issue.origin ?? "hodnota", " mus\xED by\u0165 ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Hodnota je pr\xEDli\u0161 mal\xE1: ".concat(issue.origin ?? "hodnota", " mus\xED ma\u0165 ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit ?? "prvkov");
        }
        return "Hodnota je pr\xEDli\u0161 mal\xE1: ".concat(issue.origin ?? "hodnota", " mus\xED by\u0165 ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'Neplatn\xFD re\u0165azec: mus\xED za\u010D\xEDna\u0165 na "'.concat(_issue.prefix, '"');
        if (_issue.format === "ends_with")
          return 'Neplatn\xFD re\u0165azec: mus\xED kon\u010Di\u0165 na "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'Neplatn\xFD re\u0165azec: mus\xED obsahova\u0165 "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "Neplatn\xFD re\u0165azec: mus\xED zodpoveda\u0165 vzoru ".concat(_issue.pattern);
        return "Neplatn\xFD form\xE1t ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Neplatn\xE9 \u010D\xEDslo: mus\xED by\u0165 n\xE1sobkom ".concat(issue.divisor);
      case "unrecognized_keys":
        return "Nezn\xE1me kl\xFA\u010De: ".concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Neplatn\xFD kl\xFA\u010D v ".concat(issue.origin);
      case "invalid_union":
        return "Neplatn\xFD vstup";
      case "invalid_element":
        return "Neplatn\xE1 hodnota v ".concat(issue.origin);
      default:
        return "Neplatn\xFD vstup";
    }
  };
};
function sk_default() {
  return {
    localeError: error21()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/sl.js
var error22 = () => {
  const Sizable = {
    string: { unit: "znakov", verb: "imeti" },
    file: { unit: "bajtov", verb: "imeti" },
    array: { unit: "elementov", verb: "imeti" },
    set: { unit: "elementov", verb: "imeti" },
    map: { unit: "elementov", verb: "imeti" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "vnos",
    email: "e-po\u0161tni naslov",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datum in \u010Das",
    date: "ISO datum",
    time: "ISO \u010Das",
    duration: "ISO trajanje",
    ipv4: "IPv4 naslov",
    ipv6: "IPv6 naslov",
    mac: "MAC naslov",
    cidrv4: "obseg IPv4",
    cidrv6: "obseg IPv6",
    base64: "base64 kodiran niz",
    base64url: "base64url kodiran niz",
    json_string: "JSON niz",
    e164: "E.164 \u0161tevilka",
    credit_card: "\u0161tevilka kreditne kartice",
    jwt: "JWT",
    template_literal: "vnos"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "\u0161tevilo",
    array: "tabela"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Neveljaven vnos: pri\u010Dakovano instanceof ".concat(issue.expected, ", prejeto ").concat(received);
        }
        return "Neveljaven vnos: pri\u010Dakovano ".concat(expected, ", prejeto ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Neveljaven vnos: pri\u010Dakovano ".concat(stringifyPrimitive(issue.values[0]));
        return "Neveljavna mo\u017Enost: pri\u010Dakovano eno izmed ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "Preveliko: pri\u010Dakovano, da bo ".concat(issue.origin ?? "vrednost", " imelo ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "elementov");
        return "Preveliko: pri\u010Dakovano, da bo ".concat(issue.origin ?? "vrednost", " ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Premajhno: pri\u010Dakovano, da bo ".concat(issue.origin, " imelo ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "Premajhno: pri\u010Dakovano, da bo ".concat(issue.origin, " ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return 'Neveljaven niz: mora se za\u010Deti z "'.concat(_issue.prefix, '"');
        }
        if (_issue.format === "ends_with")
          return 'Neveljaven niz: mora se kon\u010Dati z "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'Neveljaven niz: mora vsebovati "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "Neveljaven niz: mora ustrezati vzorcu ".concat(_issue.pattern);
        return "Neveljaven ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Neveljavno \u0161tevilo: mora biti ve\u010Dkratnik ".concat(issue.divisor);
      case "unrecognized_keys":
        return "Neprepoznan".concat(issue.keys.length > 1 ? "i klju\u010Di" : " klju\u010D", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Neveljaven klju\u010D v ".concat(issue.origin);
      case "invalid_union":
        return "Neveljaven vnos";
      case "invalid_element":
        return "Neveljavna vrednost v ".concat(issue.origin);
      default:
        return "Neveljaven vnos";
    }
  };
};
function sl_default() {
  return {
    localeError: error22()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/sv.js
var error23 = () => {
  const Sizable = {
    string: { unit: "tecken", verb: "att ha" },
    file: { unit: "bytes", verb: "att ha" },
    array: { unit: "objekt", verb: "att inneh\xE5lla" },
    set: { unit: "objekt", verb: "att inneh\xE5lla" },
    map: { unit: "objekt", verb: "att inneh\xE5lla" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "regulj\xE4rt uttryck",
    email: "e-postadress",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO-datum och tid",
    date: "ISO-datum",
    time: "ISO-tid",
    duration: "ISO-varaktighet",
    ipv4: "IPv4-adress",
    ipv6: "IPv6-adress",
    mac: "MAC-adress",
    cidrv4: "IPv4-spektrum",
    cidrv6: "IPv6-spektrum",
    base64: "base64-kodad str\xE4ng",
    base64url: "base64url-kodad str\xE4ng",
    json_string: "JSON-str\xE4ng",
    e164: "E.164-nummer",
    credit_card: "kreditkortsnummer",
    jwt: "JWT",
    template_literal: "mall-literal"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "antal",
    array: "lista"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Ogiltig inmatning: f\xF6rv\xE4ntat instanceof ".concat(issue.expected, ", fick ").concat(received);
        }
        return "Ogiltig inmatning: f\xF6rv\xE4ntat ".concat(expected, ", fick ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Ogiltig inmatning: f\xF6rv\xE4ntat ".concat(stringifyPrimitive(issue.values[0]));
        return "Ogiltigt val: f\xF6rv\xE4ntade en av ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "F\xF6r stor(t): f\xF6rv\xE4ntade ".concat(issue.origin ?? "v\xE4rdet", " att ha ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "element");
        }
        return "F\xF6r stor(t): f\xF6rv\xE4ntat ".concat(issue.origin ?? "v\xE4rdet", " att ha ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "F\xF6r lite(t): f\xF6rv\xE4ntade ".concat(issue.origin ?? "v\xE4rdet", " att ha ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "F\xF6r lite(t): f\xF6rv\xE4ntade ".concat(issue.origin ?? "v\xE4rdet", " att ha ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return 'Ogiltig str\xE4ng: m\xE5ste b\xF6rja med "'.concat(_issue.prefix, '"');
        }
        if (_issue.format === "ends_with")
          return 'Ogiltig str\xE4ng: m\xE5ste sluta med "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'Ogiltig str\xE4ng: m\xE5ste inneh\xE5lla "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return 'Ogiltig str\xE4ng: m\xE5ste matcha m\xF6nstret "'.concat(_issue.pattern, '"');
        return "Ogiltig(t) ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Ogiltigt tal: m\xE5ste vara en multipel av ".concat(issue.divisor);
      case "unrecognized_keys":
        return "".concat(issue.keys.length > 1 ? "Ok\xE4nda nycklar" : "Ok\xE4nd nyckel", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Ogiltig nyckel i ".concat(issue.origin ?? "v\xE4rdet");
      case "invalid_union":
        return "Ogiltig input";
      case "invalid_element":
        return "Ogiltigt v\xE4rde i ".concat(issue.origin ?? "v\xE4rdet");
      default:
        return "Ogiltig input";
    }
  };
};
function sv_default() {
  return {
    localeError: error23()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/tk.js
var error24 = () => {
  const Sizable = {
    string: { unit: "simwol", verb: "bolmaly" },
    file: { unit: "ba\xFDt", verb: "bolmaly" },
    array: { unit: "elementler", verb: "bolmaly" },
    set: { unit: "elementler", verb: "bolmaly" },
    map: { unit: "elementler", verb: "bolmaly" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "giri\u015F",
    email: "e-po\xE7ta salgysy",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO sene we wagt",
    date: "ISO sene",
    time: "ISO wagt",
    duration: "ISO wagt aralygy",
    ipv4: "IPv4 salgysy",
    ipv6: "IPv6 salgysy",
    mac: "MAC salgysy",
    cidrv4: "IPv4 aralygy",
    cidrv6: "IPv6 aralygy",
    base64: "base64 bilen \u015Fifrlenen setir",
    base64url: "base64url bilen \u015Fifrlenen setir",
    json_string: "JSON setiri",
    e164: "E.164 nomeri",
    credit_card: "kredit kartyny\u0148 nomeri",
    jwt: "JWT",
    template_literal: "\u015Fablon"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        return "N\xE4dogry baha: gara\u015Fylan ".concat(expected, " \xFDerine ").concat(received, " alyndy");
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "N\xE4dogry baha: ".concat(stringifyPrimitive(issue.values[0]), " bolmaly");
        return "N\xE4dogry sa\xFDlaw: a\u015Fakdakylardan biri bolmaly: ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "Has uly: gara\u015Fyl\xFDan ".concat(issue.origin ?? "baha", " ").concat(adj, " ").concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "element");
        return "Has uly: gara\u015Fyl\xFDan ".concat(issue.origin ?? "baha", " ").concat(adj, " ").concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "Has ki\xE7i: gara\u015Fyl\xFDan ".concat(issue.origin, " ").concat(adj, " ").concat(issue.minimum.toString(), " ").concat(sizing.unit);
        return "Has ki\xE7i: gara\u015Fyl\xFDan ".concat(issue.origin, " ").concat(adj, " ").concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'N\xE4dogry setir: "'.concat(_issue.prefix, '" bilen ba\u015Flamaly');
        if (_issue.format === "ends_with")
          return 'N\xE4dogry setir: "'.concat(_issue.suffix, '" bilen gutarmaly');
        if (_issue.format === "includes")
          return 'N\xE4dogry setir: "'.concat(_issue.includes, '" saklamaly');
        if (_issue.format === "regex")
          return "N\xE4dogry setir: ".concat(_issue.pattern, " nusga la\xFDyk bolmaly");
        return "N\xE4dogry ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "N\xE4dogry san: ".concat(issue.divisor, " bilen galyndysyz b\xF6l\xFCnmeli");
      case "unrecognized_keys":
        return "Tanalma\xFDan a\xE7ar".concat(issue.keys.length > 1 ? "lar" : "", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "".concat(issue.origin, " i\xE7inde n\xE4dogry a\xE7ar");
      case "invalid_union":
        return "N\xE4dogry baha";
      case "invalid_element":
        return "".concat(issue.origin, " i\xE7inde n\xE4dogry baha");
      default:
        return "N\xE4dogry baha";
    }
  };
};
function tk_default() {
  return {
    localeError: error24()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/tr.js
var error25 = () => {
  const Sizable = {
    string: { unit: "karakter", verb: "olmal\u0131" },
    file: { unit: "bayt", verb: "olmal\u0131" },
    array: { unit: "\xF6\u011Fe", verb: "olmal\u0131" },
    set: { unit: "\xF6\u011Fe", verb: "olmal\u0131" },
    map: { unit: "\xF6\u011Fe", verb: "olmal\u0131" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "girdi",
    email: "e-posta adresi",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO tarih ve saat",
    date: "ISO tarih",
    time: "ISO saat",
    duration: "ISO s\xFCre",
    ipv4: "IPv4 adresi",
    ipv6: "IPv6 adresi",
    mac: "MAC adresi",
    cidrv4: "IPv4 aral\u0131\u011F\u0131",
    cidrv6: "IPv6 aral\u0131\u011F\u0131",
    base64: "base64 ile \u015Fifrelenmi\u015F metin",
    base64url: "base64url ile \u015Fifrelenmi\u015F metin",
    json_string: "JSON dizesi",
    e164: "E.164 say\u0131s\u0131",
    credit_card: "kredi kart\u0131 numaras\u0131",
    jwt: "JWT",
    template_literal: "\u015Eablon dizesi"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Ge\xE7ersiz de\u011Fer: beklenen instanceof ".concat(issue.expected, ", al\u0131nan ").concat(received);
        }
        return "Ge\xE7ersiz de\u011Fer: beklenen ".concat(expected, ", al\u0131nan ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Ge\xE7ersiz de\u011Fer: beklenen ".concat(stringifyPrimitive(issue.values[0]));
        return "Ge\xE7ersiz se\xE7enek: a\u015Fa\u011F\u0131dakilerden biri olmal\u0131: ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "\xC7ok b\xFCy\xFCk: beklenen ".concat(issue.origin ?? "de\u011Fer", " ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "\xF6\u011Fe");
        return "\xC7ok b\xFCy\xFCk: beklenen ".concat(issue.origin ?? "de\u011Fer", " ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "\xC7ok k\xFC\xE7\xFCk: beklenen ".concat(issue.origin, " ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        return "\xC7ok k\xFC\xE7\xFCk: beklenen ".concat(issue.origin, " ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'Ge\xE7ersiz metin: "'.concat(_issue.prefix, '" ile ba\u015Flamal\u0131');
        if (_issue.format === "ends_with")
          return 'Ge\xE7ersiz metin: "'.concat(_issue.suffix, '" ile bitmeli');
        if (_issue.format === "includes")
          return 'Ge\xE7ersiz metin: "'.concat(_issue.includes, '" i\xE7ermeli');
        if (_issue.format === "regex")
          return "Ge\xE7ersiz metin: ".concat(_issue.pattern, " desenine uymal\u0131");
        return "Ge\xE7ersiz ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Ge\xE7ersiz say\u0131: ".concat(issue.divisor, " ile tam b\xF6l\xFCnebilmeli");
      case "unrecognized_keys":
        return "Tan\u0131nmayan anahtar".concat(issue.keys.length > 1 ? "lar" : "", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "".concat(issue.origin, " i\xE7inde ge\xE7ersiz anahtar");
      case "invalid_union":
        return "Ge\xE7ersiz de\u011Fer";
      case "invalid_element":
        return "".concat(issue.origin, " i\xE7inde ge\xE7ersiz de\u011Fer");
      default:
        return "Ge\xE7ersiz de\u011Fer";
    }
  };
};
function tr_default() {
  return {
    localeError: error25()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/ua.js
function ua_default() {
  return uk_default();
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/uz.js
var error26 = () => {
  const Sizable = {
    string: { unit: "belgi", verb: "bo\u2018lishi kerak" },
    file: { unit: "bayt", verb: "bo\u2018lishi kerak" },
    array: { unit: "element", verb: "bo\u2018lishi kerak" },
    set: { unit: "element", verb: "bo\u2018lishi kerak" },
    map: { unit: "yozuv", verb: "bo\u2018lishi kerak" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "kirish",
    email: "elektron pochta manzili",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO sana va vaqti",
    date: "ISO sana",
    time: "ISO vaqt",
    duration: "ISO davomiylik",
    ipv4: "IPv4 manzil",
    ipv6: "IPv6 manzil",
    mac: "MAC manzil",
    cidrv4: "IPv4 diapazon",
    cidrv6: "IPv6 diapazon",
    base64: "base64 kodlangan satr",
    base64url: "base64url kodlangan satr",
    json_string: "JSON satr",
    e164: "E.164 raqam",
    credit_card: "kredit karta raqami",
    jwt: "JWT",
    template_literal: "kirish"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "raqam",
    array: "massiv"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Noto\u2018g\u2018ri kirish: kutilgan instanceof ".concat(issue.expected, ", qabul qilingan ").concat(received);
        }
        return "Noto\u2018g\u2018ri kirish: kutilgan ".concat(expected, ", qabul qilingan ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Noto\u2018g\u2018ri kirish: kutilgan ".concat(stringifyPrimitive(issue.values[0]));
        return "Noto\u2018g\u2018ri variant: quyidagilardan biri kutilgan ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "Juda katta: kutilgan ".concat(issue.origin ?? "qiymat", " ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit, " ").concat(sizing.verb);
        return "Juda katta: kutilgan ".concat(issue.origin ?? "qiymat", " ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Juda kichik: kutilgan ".concat(issue.origin, " ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit, " ").concat(sizing.verb);
        }
        return "Juda kichik: kutilgan ".concat(issue.origin, " ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'Noto\u2018g\u2018ri satr: "'.concat(_issue.prefix, '" bilan boshlanishi kerak');
        if (_issue.format === "ends_with")
          return 'Noto\u2018g\u2018ri satr: "'.concat(_issue.suffix, '" bilan tugashi kerak');
        if (_issue.format === "includes")
          return 'Noto\u2018g\u2018ri satr: "'.concat(_issue.includes, '" ni o\u2018z ichiga olishi kerak');
        if (_issue.format === "regex")
          return "Noto\u2018g\u2018ri satr: ".concat(_issue.pattern, " shabloniga mos kelishi kerak");
        return "Noto\u2018g\u2018ri ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Noto\u2018g\u2018ri raqam: ".concat(issue.divisor, " ning karralisi bo\u2018lishi kerak");
      case "unrecognized_keys":
        return "Noma\u2019lum kalit".concat(issue.keys.length > 1 ? "lar" : "", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "".concat(issue.origin, " dagi kalit noto\u2018g\u2018ri");
      case "invalid_union":
        return "Noto\u2018g\u2018ri kirish";
      case "invalid_element":
        return "".concat(issue.origin, " da noto\u2018g\u2018ri qiymat");
      default:
        return "Noto\u2018g\u2018ri kirish";
    }
  };
};
function uz_default() {
  return {
    localeError: error26()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/zh-CN.js
var error27 = () => {
  const Sizable = {
    string: { unit: "\u5B57\u7B26", verb: "\u5305\u542B" },
    file: { unit: "\u5B57\u8282", verb: "\u5305\u542B" },
    array: { unit: "\u9879", verb: "\u5305\u542B" },
    set: { unit: "\u9879", verb: "\u5305\u542B" },
    map: { unit: "\u9879", verb: "\u5305\u542B" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "\u8F93\u5165",
    email: "\u7535\u5B50\u90AE\u4EF6",
    url: "URL",
    emoji: "\u8868\u60C5\u7B26\u53F7",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO\u65E5\u671F\u65F6\u95F4",
    date: "ISO\u65E5\u671F",
    time: "ISO\u65F6\u95F4",
    duration: "ISO\u65F6\u957F",
    ipv4: "IPv4\u5730\u5740",
    ipv6: "IPv6\u5730\u5740",
    mac: "MAC\u5730\u5740",
    cidrv4: "IPv4\u7F51\u6BB5",
    cidrv6: "IPv6\u7F51\u6BB5",
    base64: "base64\u7F16\u7801\u5B57\u7B26\u4E32",
    base64url: "base64url\u7F16\u7801\u5B57\u7B26\u4E32",
    json_string: "JSON\u5B57\u7B26\u4E32",
    e164: "E.164\u53F7\u7801",
    credit_card: "\u4FE1\u7528\u5361\u53F7",
    jwt: "JWT",
    template_literal: "\u8F93\u5165"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "\u6570\u5B57",
    array: "\u6570\u7EC4",
    null: "\u7A7A\u503C(null)"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B instanceof ".concat(issue.expected, "\uFF0C\u5B9E\u9645\u63A5\u6536 ").concat(received);
        }
        return "\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B ".concat(expected, "\uFF0C\u5B9E\u9645\u63A5\u6536 ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "\u65E0\u6548\u8F93\u5165\uFF1A\u671F\u671B ".concat(stringifyPrimitive(issue.values[0]));
        return "\u65E0\u6548\u9009\u9879\uFF1A\u671F\u671B\u4EE5\u4E0B\u4E4B\u4E00 ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "\u6570\u503C\u8FC7\u5927\uFF1A\u671F\u671B ".concat(issue.origin ?? "\u503C", " ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "\u4E2A\u5143\u7D20");
        return "\u6570\u503C\u8FC7\u5927\uFF1A\u671F\u671B ".concat(issue.origin ?? "\u503C", " ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "\u6570\u503C\u8FC7\u5C0F\uFF1A\u671F\u671B ".concat(issue.origin, " ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "\u6570\u503C\u8FC7\u5C0F\uFF1A\u671F\u671B ".concat(issue.origin, " ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return '\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u4EE5 "'.concat(_issue.prefix, '" \u5F00\u5934');
        if (_issue.format === "ends_with")
          return '\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u4EE5 "'.concat(_issue.suffix, '" \u7ED3\u5C3E');
        if (_issue.format === "includes")
          return '\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u5305\u542B "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "\u65E0\u6548\u5B57\u7B26\u4E32\uFF1A\u5FC5\u987B\u6EE1\u8DB3\u6B63\u5219\u8868\u8FBE\u5F0F ".concat(_issue.pattern);
        return "\u65E0\u6548".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "\u65E0\u6548\u6570\u5B57\uFF1A\u5FC5\u987B\u662F ".concat(issue.divisor, " \u7684\u500D\u6570");
      case "unrecognized_keys":
        return "\u51FA\u73B0\u672A\u77E5\u7684\u952E(key): ".concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "".concat(issue.origin, " \u4E2D\u7684\u952E(key)\u65E0\u6548");
      case "invalid_union":
        return "\u65E0\u6548\u8F93\u5165";
      case "invalid_element":
        return "".concat(issue.origin, " \u4E2D\u5305\u542B\u65E0\u6548\u503C(value)");
      default:
        return "\u65E0\u6548\u8F93\u5165";
    }
  };
};
function zh_CN_default() {
  return {
    localeError: error27()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/locales/zh-TW.js
var error28 = () => {
  const Sizable = {
    string: { unit: "\u5B57\u5143", verb: "\u64C1\u6709" },
    file: { unit: "\u4F4D\u5143\u7D44", verb: "\u64C1\u6709" },
    array: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" },
    set: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" },
    map: { unit: "\u9805\u76EE", verb: "\u64C1\u6709" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "\u8F38\u5165",
    email: "\u90F5\u4EF6\u5730\u5740",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO \u65E5\u671F\u6642\u9593",
    date: "ISO \u65E5\u671F",
    time: "ISO \u6642\u9593",
    duration: "ISO \u671F\u9593",
    ipv4: "IPv4 \u4F4D\u5740",
    ipv6: "IPv6 \u4F4D\u5740",
    mac: "MAC \u4F4D\u5740",
    cidrv4: "IPv4 \u7BC4\u570D",
    cidrv6: "IPv6 \u7BC4\u570D",
    base64: "base64 \u7DE8\u78BC\u5B57\u4E32",
    base64url: "base64url \u7DE8\u78BC\u5B57\u4E32",
    json_string: "JSON \u5B57\u4E32",
    e164: "E.164 \u6578\u503C",
    credit_card: "\u4FE1\u7528\u5361\u865F",
    jwt: "JWT",
    template_literal: "\u8F38\u5165"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA instanceof ".concat(issue.expected, "\uFF0C\u4F46\u6536\u5230 ").concat(received);
        }
        return "\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA ".concat(expected, "\uFF0C\u4F46\u6536\u5230 ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "\u7121\u6548\u7684\u8F38\u5165\u503C\uFF1A\u9810\u671F\u70BA ".concat(stringifyPrimitive(issue.values[0]));
        return "\u7121\u6548\u7684\u9078\u9805\uFF1A\u9810\u671F\u70BA\u4EE5\u4E0B\u5176\u4E2D\u4E4B\u4E00 ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "\u6578\u503C\u904E\u5927\uFF1A\u9810\u671F ".concat(issue.origin ?? "\u503C", " \u61C9\u70BA ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "\u500B\u5143\u7D20");
        return "\u6578\u503C\u904E\u5927\uFF1A\u9810\u671F ".concat(issue.origin ?? "\u503C", " \u61C9\u70BA ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "\u6578\u503C\u904E\u5C0F\uFF1A\u9810\u671F ".concat(issue.origin, " \u61C9\u70BA ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "\u6578\u503C\u904E\u5C0F\uFF1A\u9810\u671F ".concat(issue.origin, " \u61C9\u70BA ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return '\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u4EE5 "'.concat(_issue.prefix, '" \u958B\u982D');
        }
        if (_issue.format === "ends_with")
          return '\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u4EE5 "'.concat(_issue.suffix, '" \u7D50\u5C3E');
        if (_issue.format === "includes")
          return '\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u5305\u542B "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "\u7121\u6548\u7684\u5B57\u4E32\uFF1A\u5FC5\u9808\u7B26\u5408\u683C\u5F0F ".concat(_issue.pattern);
        return "\u7121\u6548\u7684 ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "\u7121\u6548\u7684\u6578\u5B57\uFF1A\u5FC5\u9808\u70BA ".concat(issue.divisor, " \u7684\u500D\u6578");
      case "unrecognized_keys":
        return "\u7121\u6CD5\u8B58\u5225\u7684\u9375\u503C".concat(issue.keys.length > 1 ? "\u5011" : "", "\uFF1A").concat(joinValues(issue.keys, "\u3001"));
      case "invalid_key":
        return "".concat(issue.origin, " \u4E2D\u6709\u7121\u6548\u7684\u9375\u503C");
      case "invalid_union":
        return "\u7121\u6548\u7684\u8F38\u5165\u503C";
      case "invalid_element":
        return "".concat(issue.origin, " \u4E2D\u6709\u7121\u6548\u7684\u503C");
      default:
        return "\u7121\u6548\u7684\u8F38\u5165\u503C";
    }
  };
};
function zh_TW_default() {
  return {
    localeError: error28()
  };
}

// editor/ui-editor-ui/node_modules/zod/v4/core/json-schema-generator.js
var JSONSchemaGenerator = class {
  /** @deprecated Access via ctx instead */
  get metadataRegistry() {
    return this.ctx.metadataRegistry;
  }
  /** @deprecated Access via ctx instead */
  get target() {
    return this.ctx.target;
  }
  // annotated so the .d.cts emits an indexed access rather than an inline `import()` of an ESM path
  /** @deprecated Access via ctx instead */
  get unrepresentable() {
    return this.ctx.unrepresentable;
  }
  /** @deprecated Access via ctx instead */
  get override() {
    return this.ctx.override;
  }
  /** @deprecated Access via ctx instead */
  get io() {
    return this.ctx.io;
  }
  /** @deprecated Access via ctx instead */
  get counter() {
    return this.ctx.counter;
  }
  set counter(value) {
    this.ctx.counter = value;
  }
  /** @deprecated Access via ctx instead */
  get seen() {
    return this.ctx.seen;
  }
  constructor(params) {
    let normalizedTarget = params?.target ?? "draft-2020-12";
    if (normalizedTarget === "draft-4")
      normalizedTarget = "draft-04";
    if (normalizedTarget === "draft-7")
      normalizedTarget = "draft-07";
    this.ctx = initializeContext({
      processors: allProcessors,
      target: normalizedTarget,
      ...params?.metadata && { metadata: params.metadata },
      ...params?.unrepresentable && { unrepresentable: params.unrepresentable },
      ...params?.override && { override: params.override },
      ...params?.io && { io: params.io }
    });
  }
  /**
   * Process a schema to prepare it for JSON Schema generation.
   * This must be called before emit().
   */
  process(schema, _params = { path: [], schemaPath: [] }) {
    return process(schema, this.ctx, _params);
  }
  /**
   * Emit the final JSON Schema after processing.
   * Must call process() first.
   */
  emit(schema, _params) {
    if (_params) {
      if (_params.cycles)
        this.ctx.cycles = _params.cycles;
      if (_params.reused)
        this.ctx.reused = _params.reused;
      if (_params.external)
        this.ctx.external = _params.external;
    }
    this.ctx.sharedDefsExtractedFor = void 0;
    this.ctx.sharedEmitDoneFor = void 0;
    extractDefs(this.ctx, schema);
    const result = finalize(this.ctx, schema);
    const { "~standard": _, ...plainResult } = result;
    return plainResult;
  }
};

// editor/ui-editor-ui/node_modules/zod/v4/core/json-schema.js
var json_schema_exports = {};

export {
  en_default,
  locales_exports,
  JSONSchemaGenerator,
  json_schema_exports,
  core_exports
};

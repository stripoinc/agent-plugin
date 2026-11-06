import {
  DecodingMode,
  EntityDecoder
} from "./decode-codepoint-de4ce2c8771f.mjs";
import {
  htmlDecodeTree
} from "./decode-data-html-482e5b7a6675.mjs";

// editor/ui-editor-ui/src/app/serdes/tree/html/protected-template-regions.ts
var DELIMITERS = [
  { kind: "ampscript-block", opening: "%%[", closing: "]%%" },
  { kind: "ampscript-output", opening: "%%=", closing: "=%%" },
  { kind: "twig-control", opening: "{%", closing: "%}" }
];
function scanProtectedTemplateRegionsInternal(source) {
  const stats = {
    sourceOffsetsVisited: 0,
    delimiterChecks: 0,
    closingCandidatesVisited: 0
  };
  const findDelimiter = (delimiter, fromOffset = 0) => {
    const offset = source.indexOf(delimiter, fromOffset);
    stats.delimiterChecks++;
    stats.sourceOffsetsVisited += offset === -1 ? source.length - fromOffset : offset - fromOffset + 1;
    return offset;
  };
  const openingOffsets = DELIMITERS.map(({ opening }) => findDelimiter(opening));
  if (openingOffsets.every((offset) => offset === -1)) {
    return { regions: [], stats };
  }
  const closingOffsets = DELIMITERS.map(() => []);
  const closingIndexes = DELIMITERS.map(() => 0);
  DELIMITERS.forEach((delimiter, delimiterIndex) => {
    let offset = findDelimiter(delimiter.closing);
    while (offset !== -1) {
      closingOffsets[delimiterIndex].push(offset);
      offset = findDelimiter(delimiter.closing, offset + 1);
    }
  });
  const regions = [];
  let cursor = 0;
  while (cursor < source.length) {
    let openingDelimiterIndex = -1;
    let openingOffset = source.length;
    DELIMITERS.forEach((delimiter2, delimiterIndex) => {
      let offset = openingOffsets[delimiterIndex];
      if (offset !== -1 && offset < cursor) {
        offset = findDelimiter(delimiter2.opening, cursor);
        openingOffsets[delimiterIndex] = offset;
      }
      if (offset !== -1 && offset < openingOffset) {
        openingDelimiterIndex = delimiterIndex;
        openingOffset = offset;
      }
    });
    if (openingDelimiterIndex === -1) {
      break;
    }
    cursor = openingOffset;
    const delimiter = DELIMITERS[openingDelimiterIndex];
    const minimumClosingOffset = cursor + delimiter.opening.length;
    const delimiterClosingOffsets = closingOffsets[openingDelimiterIndex];
    let closingIndex = closingIndexes[openingDelimiterIndex];
    while (closingIndex < delimiterClosingOffsets.length && delimiterClosingOffsets[closingIndex] < minimumClosingOffset) {
      closingIndex++;
      stats.closingCandidatesVisited++;
    }
    closingIndexes[openingDelimiterIndex] = closingIndex;
    const closingOffset = delimiterClosingOffsets[closingIndex];
    if (closingOffset === void 0) {
      cursor += delimiter.opening.length;
      continue;
    }
    closingIndexes[openingDelimiterIndex]++;
    stats.closingCandidatesVisited++;
    const endOffset = closingOffset + delimiter.closing.length;
    regions.push({
      kind: delimiter.kind,
      startOffset: cursor,
      endOffset
    });
    cursor = endOffset;
  }
  return { regions, stats };
}
function scanProtectedTemplateRegions(source) {
  return scanProtectedTemplateRegionsInternal(source).regions;
}
function transformOutsideProtectedTemplateRegions(source, transform, regions = scanProtectedTemplateRegions(source)) {
  if (regions.length === 0) {
    return transform(source, 0);
  }
  let result = "";
  let cursor = 0;
  for (const region of regions) {
    result += transform(source.slice(cursor, region.startOffset), cursor);
    result += source.slice(region.startOffset, region.endOffset);
    cursor = region.endOffset;
  }
  result += transform(source.slice(cursor), cursor);
  return result;
}

// editor/ui-editor-ui/src/app/serdes/tree/html/html-entity-policy.ts
var STRUCTURAL_ENTITY_NAMES = /* @__PURE__ */ new Set(["lt", "gt", "amp", "quot", "apos"]);
var SOFT_HYPHEN_ENTITY_NAME = "shy";
var CURRENCY_ENTITY_NAMES = ["euro", "pound", "yen", "cent", "curren"];
var SIGN_ENTITY_NAMES = ["copy", "reg", "trade", "deg", "plusmn", "times", "divide"];
var GREEK_ENTITY_NAMES = [
  "Alpha",
  "Beta",
  "Gamma",
  "Delta",
  "Epsilon",
  "Zeta",
  "Eta",
  "Theta",
  "Iota",
  "Kappa",
  "Lambda",
  "Mu",
  "Nu",
  "Xi",
  "Omicron",
  "Pi",
  "Rho",
  "Sigma",
  "Tau",
  "Upsilon",
  "Phi",
  "Chi",
  "Psi",
  "Omega",
  "alpha",
  "beta",
  "gamma",
  "delta",
  "epsilon",
  "zeta",
  "eta",
  "theta",
  "iota",
  "kappa",
  "lambda",
  "mu",
  "nu",
  "xi",
  "omicron",
  "pi",
  "rho",
  "sigmaf",
  "sigma",
  "tau",
  "upsilon",
  "phi",
  "chi",
  "psi",
  "omega",
  "thetasym",
  "upsih",
  "piv"
];
var MATH_ENTITY_NAMES = ["sum", "prod", "infin", "int", "radic", "asymp", "ne", "le", "ge"];
var CURRENCY_NUMERIC_CODE_POINTS = /* @__PURE__ */ new Set([8364, 163, 165, 162, 164]);
var CURRENCY_NAMES = new Set(CURRENCY_ENTITY_NAMES);
var SIGN_NAMES = new Set(SIGN_ENTITY_NAMES);
var GREEK_NAMES = new Set(GREEK_ENTITY_NAMES);
var MATH_NAMES = new Set(MATH_ENTITY_NAMES);
var CONTROLLED_ENTITY_NAMES = [
  SOFT_HYPHEN_ENTITY_NAME,
  ...CURRENCY_ENTITY_NAMES,
  ...SIGN_ENTITY_NAMES,
  ...GREEK_ENTITY_NAMES,
  ...MATH_ENTITY_NAMES
];
function getDecodingMode(context) {
  return context === "attribute" ? DecodingMode.Attribute : DecodingMode.Legacy;
}
function getEntitySyntax(raw) {
  if (/^&#x/i.test(raw)) {
    return "hexadecimal";
  }
  if (raw.startsWith("&#")) {
    return "decimal";
  }
  return "named";
}
function getNumericCodePoint(raw, syntax) {
  if (syntax === "named") {
    return void 0;
  }
  const value = raw.slice(syntax === "hexadecimal" ? 3 : 2, raw.endsWith(";") ? -1 : void 0);
  return Number.parseInt(value, syntax === "hexadecimal" ? 16 : 10);
}
function getEntityName(raw, syntax) {
  if (syntax !== "named") {
    return void 0;
  }
  return raw.slice(1, raw.endsWith(";") ? -1 : void 0);
}
function getEntityGroup(name, syntax, numericCodePoint) {
  if (syntax !== "named") {
    return numericCodePoint !== void 0 && CURRENCY_NUMERIC_CODE_POINTS.has(numericCodePoint) ? "currency" : "other";
  }
  if (name !== void 0 && STRUCTURAL_ENTITY_NAMES.has(name)) {
    return "structural";
  }
  if (name === "nbsp") {
    return "whitespace";
  }
  if (name === SOFT_HYPHEN_ENTITY_NAME) {
    return "soft-hyphen";
  }
  if (name !== void 0 && CURRENCY_NAMES.has(name)) {
    return "currency";
  }
  if (name !== void 0 && SIGN_NAMES.has(name)) {
    return "sign";
  }
  if (name !== void 0 && GREEK_NAMES.has(name)) {
    return "greek";
  }
  if (name !== void 0 && MATH_NAMES.has(name)) {
    return "math";
  }
  return "other";
}
function getEntityPolicy(group) {
  if (group === "structural" || group === "whitespace") {
    return "normalization-exempt";
  }
  if (group === "soft-hyphen" || group === "currency" || group === "sign" || group === "greek" || group === "math") {
    return "toggle-controlled";
  }
  return "decode";
}
function decodeEntityAt(value, ampersandOffset, context, baseOffset, followingSource = "", followingSourceOffset = 0) {
  let decoded = "";
  const decoder = new EntityDecoder(htmlDecodeTree, (codePoint) => {
    decoded += String.fromCodePoint(codePoint);
  });
  decoder.startEntity(getDecodingMode(context));
  let consumed = -1;
  if (ampersandOffset + 1 < value.length) {
    consumed = decoder.write(value, ampersandOffset + 1);
  }
  if (consumed < 0 && followingSourceOffset < followingSource.length) {
    consumed = decoder.write(followingSource, followingSourceOffset);
  }
  if (consumed < 0) {
    consumed = decoder.end();
  }
  if (consumed <= 0 || decoded.length === 0) {
    return void 0;
  }
  const localLength = value.length - ampersandOffset;
  const raw = consumed <= localLength ? value.slice(ampersandOffset, ampersandOffset + consumed) : value.slice(ampersandOffset) + followingSource.slice(followingSourceOffset, followingSourceOffset + consumed - localLength);
  const syntax = getEntitySyntax(raw);
  const terminatedWithSemicolon = raw.endsWith(";");
  const name = getEntityName(raw, syntax);
  const numericCodePoint = getNumericCodePoint(raw, syntax);
  const group = getEntityGroup(name, syntax, numericCodePoint);
  return {
    startOffset: baseOffset + ampersandOffset,
    endOffset: baseOffset + ampersandOffset + consumed,
    raw,
    decoded,
    context,
    syntax,
    terminatedWithSemicolon,
    name,
    numericCodePoint,
    group,
    policy: getEntityPolicy(group)
  };
}
function tokenizeHtmlEntitiesInGap(value, context, baseOffset) {
  const occurrences = [];
  let cursor = 0;
  while (cursor < value.length) {
    const ampersandOffset = value.indexOf("&", cursor);
    if (ampersandOffset === -1) {
      break;
    }
    const occurrence = decodeEntityAt(value, ampersandOffset, context, baseOffset);
    if (occurrence) {
      occurrences.push(occurrence);
      cursor = occurrence.endOffset - baseOffset;
    } else {
      cursor = ampersandOffset + 1;
    }
  }
  return occurrences;
}
function tokenizeHtmlEntities(value, context = "text", baseOffset = 0) {
  if (context === "raw-text" || context === "comment") {
    return [];
  }
  const occurrences = [];
  transformOutsideProtectedTemplateRegions(value, (gap, gapOffset) => {
    occurrences.push(...tokenizeHtmlEntitiesInGap(gap, context, baseOffset + gapOffset));
    return gap;
  });
  return occurrences;
}
function getCanonicalControlledEntityByCharacter() {
  const result = /* @__PURE__ */ new Map();
  for (const name of CONTROLLED_ENTITY_NAMES) {
    const [occurrence] = tokenizeHtmlEntities("&".concat(name, ";"));
    if (occurrence) {
      result.set(occurrence.decoded, "&".concat(name, ";"));
    }
  }
  return result;
}
var CANONICAL_CONTROLLED_ENTITY_BY_CHARACTER = getCanonicalControlledEntityByCharacter();

import {
  normalizeColor
} from "./styles-961c8e1b984f.js";
import {
  isElement,
  parseHtml
} from "./parse-html-7b561a99741a.js";
import {
  validateEmailDocument
} from "./editor-validator-e41a98b04d42.js";
import {
  cloneJson,
  deepFreeze,
  describeNodeKind,
  isObject,
  objectValue,
  resolveJsonPointer,
  stableJson
} from "./errors-3ee69a7e1eb0.js";

// convo-email-agent/src/sdk/contract.ts
import schemaData from "./contract-data/schema.js";
import catalogData from "./contract-data/catalog.js";

// convo-email-agent/vendor/editor-validator/manifest.json with { type: 'json' }
var manifest_default = {
  editorRevision: "1e786dd4e00a6614b2ace4d88a1df5c68a682d9e",
  editorDirty: false,
  esbuildVersion: "0.28.2",
  zodVersion: "4.6.6",
  format: "esm-modules-v1",
  files: {
    "NOTICE.txt": "71b2398cec127d59452cd0fe0eb870232acf79667615ffb59db61bfe0c98551d",
    "index.mjs": "3f9eaa752cdc31c05042301f9fc3774ea0e3685dc7e4f25812d3a4d135b9896f",
    "modules/AttributeConfigMigration-0b7b83230d08.mjs": "3bf49470ba5d322850d3a40909f63da2d2d5d1179fa61e28f116b5808eff2596",
    "modules/ColorUtils-a33f32974f73.mjs": "3f09e142f3ce22b180dbcd269e71d820e826d85fbf7821822087c4be17fb49a4",
    "modules/SocialNetworkType-57875c573e3d.mjs": "7f956a158766d9770a5f016f5f59a717b769118315c9f4ec60e1723f803552b8",
    "modules/_DataView-3f8d51103b9f.mjs": "18e96eb6062f53576d78988abf5c75d953fe096072a59180a191ac7f7e07f052",
    "modules/_Hash-6a5a8be86833.mjs": "ef27c50579ded4fee93088ce166fafca29c832f3c5dec498e58a68777811f233",
    "modules/_baseSlice-aae12ccd937b.mjs": "7778b0e3119fe9faccd40d3811aad266e5d509807e139dc5ad1b0dd1fc2c322e",
    "modules/api-7ec6d993fe84.mjs": "8e4370746e344d8744b88238ce84c3c9893f1eddf8febc7ee82c8d5be0ddf389",
    "modules/asset-path-config-bce86ed0e1f1.mjs": "495868d59d34ff2dc1da8c1a20c6634a0501b435147e76021a76dc59b90637cf",
    "modules/at-rule-2b1e381bfcd5.mjs": "1fdd1ce501cd307508eabd2be4d9cb479207e61bbb582138360e81a9074481ac",
    "modules/blocks-constants-ce8171b56e4e.mjs": "251feb1f16715815f076c853c0871a0eda8cb6e991a3cf58bff15c5369277964",
    "modules/builders-7d87c6093906.mjs": "8959cbda17e52f48d316ac536a2d0519876f952216f1234bb95a6863abf6e6ab",
    "modules/checks-bd1e5de0ca09.mjs": "36944978086097c908a398a389c932808eeb1007c5d473e766685c5215678876",
    "modules/checks-f4a190521e0d.mjs": "17edf597e28617fee334bb12ca49a57445e0a9a47d7810b655adff7b46673e53",
    "modules/coerce-d38c736de753.mjs": "6d62aea44561195753d2e2bcc052dffa833d04551f6ba52ab71b13c9ba7413d0",
    "modules/comment-c2c2abaee17f.mjs": "6f70b015d5c20e9b2296e0865d77e6016e14d89f9d975e176663af733e1058e5",
    "modules/compile-fe1f1936d44e.mjs": "5a8e72187937a846c539e58963907f6c1dc9d906c0f8a0666a6a1871a3b1f426",
    "modules/core-d6ef11a90708.mjs": "cd8c1ac928a16cdcf7e309ab4cffea07d4c9b59f04f146a7387242c7410e8100",
    "modules/decode-codepoint-de4ce2c8771f.mjs": "7012d3eddca829d178f308b8b39b46f9950082bf6dc0d45d75faf32c0cd06a74",
    "modules/decode-data-html-482e5b7a6675.mjs": "0fbace444376629e18d73838a56c88fe8dd7697f6dc1082f2cbd6e903511c03d",
    "modules/doc-85ae2b2bbd32.mjs": "efdc685335d7ce52da0e478b9963d4e9f9d07eace0d11c280247be1c7154c03f",
    "modules/document-13235feeff49.mjs": "d178b7957dc6a4e255b7be802eeb612d0667fb43c51b3a283c447cb778bb647e",
    "modules/errors-095a9cd7e5fd.mjs": "9ef45253562474efc319fab1fcdb93384da29aaba363030a0dd23132403917d9",
    "modules/from-json-schema-1979beab5102.mjs": "6815bd71e0178c0f6afecc6774b7c907d6933169651ccdfd837018884377b1c3",
    "modules/fs-064e509bf2cb.mjs": "1c095b74fb7d4cbd6338219e018f30934e6e6e670c84870ddc9d0c8c6a970c14",
    "modules/html-entity-policy-11ef1d15ef89.mjs": "9b001be6f89b1d50c834b4b8ae012e42fdbaaacefd58a9f7d69bcbfac68ffe7c",
    "modules/index-578459128e2e.mjs": "070a414f5b69aa548a7f2f399c9f43af4cd5f7176d39e725b9fefa0ff8ef0172",
    "modules/index-829c7f2491ea.mjs": "75e3b2581d261049bfe282a9230df29b0881c3a02d2bbfd61ef4f42a2bf86b92",
    "modules/index-c0aa2829846f.mjs": "43b89dfb7319143c8d1117e297dfc2e310aa591b84b35d6a801ebdfd0f346594",
    "modules/json-schema-processors-0c244c7c3151.mjs": "8d747db808a2578c4078098596fd40f3a544a64da6778baa74d0cb43d203e019",
    "modules/map-generator-a34cf548f9d1.mjs": "ccc7391237434b5b9fddc39a29215b0c12bc7842b336bad53440ed3c9c304863",
    "modules/master-css-6656cf175550.mjs": "6d3848826087701367e8b761853199a2a0d5ca9ba2df974f4f196b4c9e6236de",
    "modules/master-css-variables-a84902889746.mjs": "06e2d56bc5080f3a199e189e31c9a900313b60124ef10d7254d5cbdbfe167e88",
    "modules/master-css-variables-defaults-fd88a551a3d8.mjs": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "modules/memoizer-c00f0bc54290.mjs": "0228f3d867868c9f59fd0b0e44cf5bae0fdc12b161364167503239fbc3c87cb9",
    "modules/node-909c4f08098c.mjs": "cd17184bf256801f40baec5ce88cd23f6efe4de2c16706ed2ff6f584415a26fe",
    "modules/parse-545b503fc4ed.mjs": "0d9109245704e662d12a16a49519324075c090bf342e51ef3ac964ccbcbc44a1",
    "modules/parse-8126121d6d62.mjs": "0a314205ead5edd3af8d50579c57c417a6c32228cc1c9cb88e63b8cc0a0a90e1",
    "modules/regexes-d1711c96e64b.mjs": "8de55ba4ce703a656867dffacb4619627cebceeb48d7029fa76b2f15b038d5d3",
    "modules/registries-3ceb92ae3dab.mjs": "8694e6c3c6f1fafa26a66dc6b42debb2bddd2b99ce022c7d502fbced38c48560",
    "modules/serviceSelectorPrefix-a2f28f143508.mjs": "afa926598ce3a3dcd7ff080133ffcd5dbfc6ba4e8d99d8dd9eead9a1e039015b",
    "modules/shared-4f53cda18c2b.mjs": "0638f4510b6c8992fea95bfddbbccf9f3c9b2931a09bc893ef2511320ff0fc01",
    "modules/social-networks-data-4f7cb53fbb33.mjs": "5b2e6b8506d4696b107e2e7b88754e56246f1f038dd60feaadd1b631aba8f662",
    "modules/stringifier-5d6259805667.mjs": "c42b20b303fd69c7b564c40f7d5df5e124ef82f8acdb74ecf3e8b334f05d2438",
    "modules/terminal-highlight-0f20b1c39b48.mjs": "818191fc1cd9ba431648c0f12437d89cc4ff930c23a074b4371707c76964aa07",
    "modules/time-zones-data-498efe19d3a8.mjs": "18068732c90e99364e90d7c1e52e40c870946cbb7bf213835d748d1a37bbee95",
    "modules/tinycolor-2bf5fc1acbb7.mjs": "5c3a91acf39fefa5ffc62655e2b355846babf9f9efaffdf187de98de77770d57",
    "modules/to-json-schema-b5fe38b46dc6.mjs": "14b4cebe8cea73d53a2ebd9b7c3e36f558abb5847089da8bda983db7d1d2c709",
    "modules/tokenize-acf2d687b44d.mjs": "1bed840cdd95e62ede4e0a5a5b5c27cf1a4679c79c9c5d78619f19e4beffb8a3",
    "modules/ue-proto-87c1854705b4.mjs": "4fe4fcc79f40e20a3f1a01dfff9db2a161901e047313b50e5b3e3e35d550a5ef",
    "modules/url-27db039aa4f6.mjs": "ba6669a72c2b96719ac7f92e517c5119e796d0366ef68158c951a051e00bda7f"
  },
  sizeBytes: 1342429,
  bundleSha256: "0ed4a25c5741dac3fc72b06adc8b08277717dc2026c5d2dcc81e3f6974ec5188"
};

// convo-email-agent/src/sdk/contract.ts
import supportData from "./contract-data/support.js";
var blockKinds = {
  text: true,
  image: true,
  video: true,
  timer: true,
  social: true,
  html: true,
  button: true,
  spacer: true,
  menu: true,
  unknown: true
};
var schema = deepFreeze(schemaData);
var nodes = deepFreeze(catalogData.nodes);
function getContract() {
  return Object.freeze({
    editorRevision: manifest_default.editorRevision,
    editorDirty: manifest_default.editorDirty,
    profile: "mergeService",
    validation: "contract",
    validatorSha256: manifest_default.bundleSha256
  });
}
function getJsonSchema() {
  return cloneJson(schema);
}
function getCapabilities() {
  const groups = supportData.groups;
  return deepFreeze({
    blocks: [...catalogData.blocks],
    nodes: cloneJson(nodes),
    fields: Object.fromEntries(Object.entries(supportData.fields).map(([path, entry]) => [path, cloneJson(groups[entry.group])]))
  });
}
function nodeCapability(kind) {
  const definition = kind in blockKinds ? "".concat(kind, "Block") : kind;
  return nodes.find((node) => node.schemaDefinition === definition);
}
function resolveSchema(node) {
  if (!node.$ref) return node;
  const resolved = node.$ref.slice(2).split("/").reduce((value, key) => isObject(value) ? value[key] : void 0, schema);
  if (!isObject(resolved)) throw new Error("Unresolved contract reference: ".concat(node.$ref));
  return { ...resolveSchema(resolved), ...Object.fromEntries(Object.entries(node).filter(([key]) => key !== "$ref")) };
}
function nodeSchema(kind) {
  const definition = kind in blockKinds ? "".concat(kind, "Block") : kind;
  const result = schema.definitions?.[definition];
  if (!result) throw new Error("Unsupported SDK node kind: ".concat(kind));
  return resolveSchema(result);
}
function contractDefaults(kind) {
  const name = "DEFAULT_".concat(kind.toUpperCase()).concat(kind === "container" ? "" : "_BLOCK", "_SETTINGS");
  const defaults = catalogData.defaults[name];
  return isObject(defaults) ? cloneJson(defaults) : {};
}
function schemaForValue(node, value) {
  const resolved = resolveSchema(node);
  const branches = resolved.oneOf ?? resolved.anyOf;
  if (!branches) return resolved;
  const candidates = branches.map(resolveSchema).filter((branch) => {
    if (!isObject(value)) return branch.type === typeof value || value === null && branch.type === "null";
    return Object.entries(branch.properties ?? {}).every(([key, child]) => {
      const property = resolveSchema(child);
      return !Object.hasOwn(value, key) || property.const === void 0 && !property.enum || (property.const !== void 0 ? property.const === value[key] : property.enum?.includes(value[key]));
    });
  });
  if (candidates.length === 1) return schemaForValue(candidates[0], value);
  return { ...resolved, properties: Object.assign({}, ...candidates.map((branch) => branch.properties ?? {})) };
}

// convo-email-agent/src/sdk/preparation.ts
import { validateDocumentSnapshot, validateDocumentState, getUnavailableMergeServiceSideEffects } from "./editor-validator/index.mjs";

// convo-email-agent/src/sdk/selectors.ts
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
    if (!isObject(current.settings)) return void 0;
    const value2 = current.settings.hideElement;
    return value2 === "no" || value2 === "mobile" || value2 === "desktop" ? value2 : void 0;
  };
  const visibilityFor = (hiddenOn) => {
    if (hiddenOn.has("desktop") && hiddenOn.has("mobile")) return "neither";
    if (hiddenOn.has("desktop")) return "mobile-only";
    if (hiddenOn.has("mobile")) return "desktop-only";
    return "both";
  };
  const visit = (current, kindFromParent, parentChain, messageArea, inheritedModuleId, inheritedHiddenOn, path) => {
    if (Array.isArray(current)) {
      for (const [index, item] of current.entries()) {
        visit(item, kindFromParent, parentChain, messageArea, inheritedModuleId, inheritedHiddenOn, [...path, index]);
      }
      return;
    }
    if (!isObject(current)) return;
    const ownKind = describeNodeKind(current) ?? kindFromParent;
    const ownId = typeof current.id === "string" ? current.id : void 0;
    const settingsArea = isObject(current.settings) && typeof current.settings.messageArea === "string" ? current.settings.messageArea : void 0;
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
        path,
        element: current
      });
    }
    const nextParentChain = ownId === void 0 || ownKind === "block" ? parentChain : [...parentChain, ownId];
    for (const [key, child] of Object.entries(current)) {
      const childKind = LIST_KEY_KIND[key];
      if (childKind !== void 0) {
        visit(child, childKind, nextParentChain, ownArea, ownModuleId, hiddenOn, [...path, key]);
      }
    }
  };
  visit(value, void 0, [], void 0, void 0, /* @__PURE__ */ new Set(), []);
  return entries;
}
function hasLink(element, blockType) {
  const settings = isObject(element.settings) ? element.settings : {};
  if (blockType === "text" && typeof element.content === "string") {
    return /<a\b[^>]*href=/iu.test(element.content);
  }
  if (blockType === "button") {
    const link = settings.link;
    return isObject(link) && (typeof link.value === "string" || typeof link.href === "string");
  }
  if (blockType === "image") {
    const link = settings.link;
    return isObject(link) && typeof link.href === "string" && link.href.length > 0;
  }
  if (blockType === "social" && Array.isArray(settings.networks)) {
    return settings.networks.some(
      (network) => isObject(network) && isObject(network.link) && typeof network.link.href === "string" && network.link.href.length > 0
    );
  }
  return false;
}
function linkHostContains(element, blockType, needle) {
  const lowerNeedle = needle.toLowerCase();
  const settings = isObject(element.settings) ? element.settings : {};
  const urls = [];
  if (blockType === "text" && typeof element.content === "string") {
    for (const match of element.content.matchAll(/<a\b[^>]*href=(?:"([^"]*)"|'([^']*)'|([^\s>]+))/giu)) {
      urls.push(match[1] ?? match[2] ?? match[3] ?? "");
    }
  } else if (blockType === "button" && isObject(settings.link)) {
    if (typeof settings.link.value === "string") urls.push(settings.link.value);
    if (typeof settings.link.href === "string") urls.push(settings.link.href);
  } else if (blockType === "image" && isObject(settings.link) && typeof settings.link.href === "string") {
    urls.push(settings.link.href);
  } else if (blockType === "social" && Array.isArray(settings.networks)) {
    for (const network of settings.networks) {
      if (isObject(network) && isObject(network.link) && typeof network.link.href === "string") {
        urls.push(network.link.href);
      }
    }
  }
  return urls.some((url) => url.toLowerCase().includes(lowerNeedle));
}

// convo-email-agent/src/sdk/lost-keys.ts
var CHILD_ARRAYS = /* @__PURE__ */ new Set(["stripes", "structures", "columns", "containers", "blocks"]);
function acceptsNull(node) {
  const resolved = resolveSchema(node);
  const types = Array.isArray(resolved.type) ? resolved.type : [resolved.type];
  return types.includes("null") || resolved.const === null || [...resolved.anyOf ?? [], ...resolved.oneOf ?? []].some(acceptsNull);
}
function isSupportedThemeReset(pointer) {
  const keys = pointer.split("/").slice(1);
  if (keys[0] !== "settings" || keys.length < 2) return false;
  let node = getJsonSchema();
  for (const key of keys) {
    node = node && resolveSchema(node).properties?.[key];
    if (!node) return false;
  }
  return acceptsNull(node);
}
function findUnintendedLosses(input, output, intent = {}) {
  if (stableJson(input) === stableJson(output)) return [];
  const lost = [];
  const resets = new Set(intent.resetFields ?? []);
  const collections = new Set(intent.replaceCollections ?? []);
  const removals = new Set(intent.removeNodes ?? []);
  const permitted = (pointer) => resets.has(pointer) || [...collections].some((path) => pointer === path || pointer.startsWith(path + "/"));
  const compare = (before2, after2, pointer) => {
    if (stableJson(before2) === stableJson(after2)) return;
    if (Array.isArray(before2)) {
      if (!collections.has(pointer)) lost.push(pointer);
      return;
    }
    if (!isObject(before2)) return;
    if (!isObject(after2)) {
      if (!permitted(pointer)) lost.push(pointer);
      return;
    }
    for (const [key, value] of Object.entries(before2)) {
      const address = "".concat(pointer, "/").concat(key);
      if (!Object.hasOwn(after2, key)) {
        if (!permitted(address)) lost.push(address);
      } else compare(value, after2[key], address);
    }
  };
  const before = objectValue(input);
  const after = objectValue(output);
  for (const key of Object.keys(before)) {
    if (CHILD_ARRAYS.has(key)) continue;
    if (!Object.hasOwn(after, key)) {
      if (!permitted("/".concat(key))) lost.push("/".concat(key));
    } else compare(before[key], after[key], "/".concat(key));
  }
  const remaining = collectNodeIndex(output);
  const occurrences = /* @__PURE__ */ new Map();
  for (const node of collectNodeIndex(input)) {
    const key = "".concat(node.kind, ":").concat(node.id);
    const index = occurrences.get(key) ?? 0;
    occurrences.set(key, index + 1);
    const candidates = remaining.filter((item) => item.id === node.id && item.kind === node.kind);
    const survivor = candidates[index];
    if (!survivor) {
      if (!removals.has(node.id) && !node.parentChain.some((id) => removals.has(id))) lost.push("/".concat(node.id));
      continue;
    }
    const withoutChildren = (item) => Object.fromEntries(
      Object.entries(item).filter(([key2]) => !CHILD_ARRAYS.has(key2))
    );
    compare(withoutChildren(node.element), withoutChildren(survivor.element), "/".concat(node.id));
  }
  return [...new Set(lost)];
}

// convo-email-agent/src/sdk/text-font-color.ts
var RECOLORED_TAGS = /* @__PURE__ */ new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "span"]);
var RGB_FUNCTION = /^rgba?\(\s*(\d{1,3})(?:\s*,\s*|\s+)(\d{1,3})(?:\s*,\s*|\s+)(\d{1,3})(?:\s*[,/]\s*(\d*\.?\d+)(%)?)?\s*\)$/u;
function inlineColor(element) {
  const style = element.attrs.find((attr) => attr.name === "style")?.value ?? "";
  return /(?:^|;)\s*color\s*:\s*([^;!]+)/iu.exec(style)?.[1].trim() || void 0;
}
function collectColors(nodes2, found) {
  for (const node of nodes2) {
    if (!isElement(node)) continue;
    const color = RECOLORED_TAGS.has(node.tag) ? inlineColor(node) : void 0;
    if (color) found.push(color);
    collectColors(node.children, found);
  }
  return found;
}
function recoloredInlineColors(content) {
  return typeof content === "string" ? collectColors(parseHtml(content), []) : [];
}
function colorKey(color) {
  if (typeof color !== "string") return void 0;
  const value = color.trim().toLowerCase();
  const rgb = RGB_FUNCTION.exec(value);
  let hex;
  if (rgb) {
    const channels = rgb.slice(1, 4).map(Number);
    if (channels.some((channel) => channel > 255)) return void 0;
    const alpha = rgb[4] === void 0 ? 1 : Number(rgb[4]) / (rgb[5] ? 100 : 1);
    hex = "#".concat(channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")) + (alpha >= 1 ? "" : Math.round(alpha * 255).toString(16).padStart(2, "0"));
  } else {
    try {
      hex = normalizeColor(value, true).toLowerCase();
    } catch {
      return void 0;
    }
  }
  const short = /^#([0-9a-f])([0-9a-f])([0-9a-f])$/u.exec(hex);
  if (short) hex = "#".concat(short[1]).concat(short[1]).concat(short[2]).concat(short[2]).concat(short[3]).concat(short[3]);
  return /^#[0-9a-f]{6}ff$/u.test(hex) ? hex.slice(0, 7) : hex;
}
var fontColorOf = (block) => isObject(block.settings) ? block.settings.fontColor : void 0;
function hasRecoloredInlineColor(content) {
  return recoloredInlineColors(content).length > 0;
}
function textBlockColors(block) {
  return [fontColorOf(block), ...recoloredInlineColors(block.content)];
}
function overwrittenInlineColors(before, after, inherited = []) {
  const requested = colorKey(fontColorOf(after));
  if (requested === void 0) return [];
  if (before && (after.content === before.content || colorKey(fontColorOf(before)) === requested)) return [];
  const known = new Set((before ? textBlockColors(before) : inherited).map(colorKey));
  const replaced = recoloredInlineColors(after.content).filter((color) => {
    const key = colorKey(color);
    return key !== void 0 && key !== requested && !known.has(key);
  });
  return [...new Set(replaced)];
}
var THEME_COLORED_TAGS = /* @__PURE__ */ new Set(["p", "h1", "h2", "h3", "h4", "h5", "h6", "li", "a"]);
function hasBlockColoredText(nodes2) {
  return nodes2.some((node) => !isElement(node) ? node.text.trim() !== "" : !THEME_COLORED_TAGS.has(node.tag) && !inlineColor(node) && hasBlockColoredText(node.children));
}
function releaseCopiedFontColors(value) {
  if (Array.isArray(value)) {
    for (const child of value) releaseCopiedFontColors(child);
    return;
  }
  if (!isObject(value)) return;
  if (value.type === "text" && isObject(value.settings) && overwrittenInlineColors(void 0, value).length && typeof value.content === "string" && !hasBlockColoredText(parseHtml(value.content))) delete value.settings.fontColor;
  for (const child of Object.values(value)) releaseCopiedFontColors(child);
}

// convo-email-agent/src/sdk/preparation.ts
var DocumentStateError = class extends Error {
  constructor(issues) {
    super(issues.map((issue) => "".concat(issue.path, ": ").concat(issue.message)).join("; "));
    this.issues = issues;
    this.name = "DocumentStateError";
    this.code = issues[0]?.code ?? "INVALID_DOCUMENT";
    this.stage = issues[0]?.stage;
    this.input = issues[0]?.input;
    this.path = issues[0]?.path;
  }
  issues;
  code;
  stage;
  input;
  path;
};
function normalizedPaths(before, after, path = "") {
  if (stableJson(before) === stableJson(after)) return [];
  if (Array.isArray(before) && Array.isArray(after) && before.length === after.length) {
    return after.flatMap((value, index) => normalizedPaths(before[index], value, path ? "".concat(path, ".").concat(index) : String(index)));
  }
  if (isObject(before) && isObject(after)) return [.../* @__PURE__ */ new Set([...Object.keys(before), ...Object.keys(after)])].flatMap((key) => normalizedPaths(before[key], after[key], path ? "".concat(path, ".").concat(key) : key));
  return [path || "<root>"];
}
function jsonIssues(value, input = "target") {
  const issues = [];
  const ancestors = /* @__PURE__ */ new Set();
  const visit = (item, path) => {
    const fail = (message) => {
      issues.push({ code: "NON_JSON_VALUE", stage: "json", input, path, message });
    };
    if (item === null || typeof item === "string" || typeof item === "boolean") return;
    if (typeof item === "number") {
      if (!Number.isFinite(item)) fail("Expected a finite JSON number.");
      return;
    }
    if (typeof item !== "object") {
      fail("Value of type ".concat(typeof item, " is not JSON."));
      return;
    }
    if (ancestors.has(item)) {
      fail("Cyclic data is not JSON.");
      return;
    }
    if (!Array.isArray(item) && Object.getPrototypeOf(item) !== Object.prototype && Object.getPrototypeOf(item) !== null) {
      fail("Expected a plain JSON object.");
      return;
    }
    if (Object.getOwnPropertySymbols(item).length) fail("Symbol keys are not JSON.");
    ancestors.add(item);
    if (Array.isArray(item)) {
      if (Object.getPrototypeOf(item) !== Array.prototype) fail("Expected a plain JSON array.");
      for (let i = 0; i < item.length; i++) {
        const descriptor = Object.getOwnPropertyDescriptor(item, i);
        if (!descriptor) fail("Sparse array entry at ".concat(i, "."));
        else if (descriptor.get || descriptor.set || !descriptor.enumerable) fail("Array entry ".concat(i, " is not a JSON data property."));
        else visit(descriptor.value, "".concat(path, ".").concat(i));
      }
      if (Object.getOwnPropertyNames(item).some((key) => key !== "length" && (String(Number(key)) !== key || !Number.isInteger(Number(key)) || Number(key) < 0 || Number(key) >= item.length))) fail("Array properties would be discarded.");
    } else for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(item))) {
      if (descriptor.get || descriptor.set || !descriptor.enumerable) fail("Property ".concat(key, " is not a JSON data property."));
      else visit(descriptor.value, path === "<root>" ? key : "".concat(path, ".").concat(key));
    }
    ancestors.delete(item);
  };
  visit(value, "<root>");
  return issues;
}
function unknownIssues(value, input) {
  const issues = [];
  const visit = (value2, rawSchema, path) => {
    const schema2 = schemaForValue(rawSchema, value2);
    if (Array.isArray(value2)) {
      if (schema2.items) value2.forEach((child, i) => visit(child, schema2.items, "".concat(path, ".").concat(i)));
      return;
    }
    if (!isObject(value2) || !schema2.properties) return;
    for (const [key, child] of Object.entries(value2)) {
      const childPath = path ? "".concat(path, ".").concat(key) : key;
      if (Object.hasOwn(schema2.properties, key)) visit(child, schema2.properties[key], childPath);
      else if (isObject(schema2.additionalProperties)) visit(child, schema2.additionalProperties, childPath);
      else issues.push({
        code: key === "containers" && path.includes("structures.") ? "LEGACY_LAYOUT_UNSUPPORTED" : "UNKNOWN_FIELD",
        stage: "json",
        input,
        path: childPath,
        message: "This field is not part of the pinned SDK format."
      });
    }
  };
  visit(value, getJsonSchema(), "");
  return issues;
}
function validateSnapshot(document) {
  const json = jsonIssues(document, "current");
  if (json.length) return { success: false, issues: json };
  const unknown = unknownIssues(document, "current");
  if (unknown.length) return { success: false, issues: unknown };
  const result = validateDocumentSnapshot(document);
  if (!result.success) return { success: false, issues: result.issues.map((issue) => ({
    code: "INVALID_SNAPSHOT",
    stage: "schema",
    input: "current",
    path: issue.path.join(".") || "<root>",
    message: issue.message,
    nativeCode: issue.code
  })) };
  return { success: true, documentState: deepFreeze(cloneJson(result.documentState)), normalizations: [], issues: [], verification: "contract" };
}
function validateChange({ current, target, intent }) {
  const currentResult = current === void 0 ? void 0 : validateSnapshot(current);
  if (currentResult && !currentResult.success) return currentResult;
  const json = jsonIssues(target);
  if (json.length) return { success: false, issues: json };
  const unknown = unknownIssues(target, "target");
  if (unknown.length) return { success: false, issues: unknown };
  const native = validateDocumentState(target, current);
  const validation = validateEmailDocument(target, { current });
  if (!native.success || validation.length) return { success: false, issues: validation.length ? validation.map((issue) => ({ ...issue, nativeCode: issue.code, code: "INVALID_DOCUMENT", stage: "schema", input: native.input ?? "target" })) : native.issues.map((issue) => ({ code: "INVALID_DOCUMENT", nativeCode: issue.code, stage: "schema", input: native.input ?? "target", path: issue.path.join("."), message: issue.message })) };
  const candidate = native.documentState;
  const before = collectNodeIndex(currentResult?.success ? currentResult.documentState : { stripes: [] });
  const after = collectNodeIndex(candidate);
  const issues = [];
  for (const pointer of intent?.resetFields ?? []) {
    const match = /^\/([^/]+)\/settings\/(.+)$/.exec(pointer);
    const node = match && before.find((entry) => entry.id === match[1]);
    const themeReset = isSupportedThemeReset(pointer);
    const supported = themeReset || node && (node.blockType === "image" && match[2] === "link" || node.blockType === "spacer" && ["height", "width", "border", "mobileBorder", "alignment"].includes(match[2]));
    if (!supported) issues.push({ code: "UNSUPPORTED_RESET", stage: "change", input: "target", path: pointer, message: "No reviewed native reset exists for this path." });
    else if (themeReset && resolveJsonPointer(candidate, pointer) === void 0) {
      issues.push({
        code: "UNSUPPORTED_RESET",
        stage: "change",
        input: "target",
        path: pointer,
        message: "A theme reset requires an explicit null; omitting an optional setting leaves its acquired value unchanged."
      });
    }
  }
  for (const pointer of intent?.replaceCollections ?? []) {
    const match = /^\/([^/]+)\/settings\/([^/]+)$/.exec(pointer);
    const node = match && [...after, ...before].find((entry) => entry.id === match[1]);
    const supported = pointer === "/resources/fonts" || node && (node.blockType === "social" && match[2] === "networks" || node.blockType === "menu" && ["items", "itemType", "colors"].includes(match[2]) || ["image", "button"].includes(node.blockType ?? "") && match[2] === "link");
    if (!supported) issues.push({ code: "UNSUPPORTED_COLLECTION_REPLACEMENT", stage: "change", input: "target", path: pointer, message: "No reviewed native atomic replacement exists for this path." });
  }
  for (const entry of before) {
    const survivor = after.find((node) => node.kind === entry.kind && node.id === entry.id);
    if (entry.kind === "block" && survivor && survivor.blockType !== entry.blockType) {
      issues.push({
        code: "BLOCK_TYPE_REPLACEMENT_UNSUPPORTED",
        stage: "change",
        input: "target",
        path: entry.id,
        nodeId: entry.id,
        nodeType: entry.blockType,
        message: "Replacing an existing block type under the same ID is unsupported."
      });
    }
    const capability = nodeCapability(entry.blockType ?? entry.kind);
    const moved = survivor && stableJson(entry.parentChain) !== stableJson(survivor.parentChain);
    if (!survivor && !capability?.actions.DELETE.runtimes.mergeService || moved && !capability?.actions.MOVE.runtimes.mergeService) {
      issues.push({
        code: "UNSUPPORTED_OPERATION",
        stage: "change",
        input: "target",
        path: entry.id,
        nodeId: entry.id,
        nodeType: entry.blockType ?? entry.kind,
        reason: survivor ? "MOVE_UNSUPPORTED" : "DELETE_UNSUPPORTED",
        message: "".concat(survivor ? "Moving" : "Deleting", " this node (including through its parent) is not supported by merge-service.")
      });
    }
    if (survivor) for (const key of capability?.readOnlyProperties ?? []) {
      if (stableJson(entry.element[key]) !== stableJson(survivor.element[key])) issues.push({
        code: "READ_ONLY_FIELD",
        stage: "change",
        input: "target",
        path: "".concat(entry.id, ".").concat(key),
        nodeId: entry.id,
        message: "A read-only field changed."
      });
    }
  }
  const inherited = before.filter((node) => node.blockType === "text").flatMap((node) => textBlockColors(node.element));
  for (const entry of after) if (entry.blockType === "text") {
    const previous = before.find((node) => node.id === entry.id && node.blockType === "text");
    const replaced = overwrittenInlineColors(previous?.element, entry.element, inherited);
    if (replaced.length) issues.push({
      code: "INLINE_COLOR_OVERWRITTEN",
      stage: "change",
      input: "target",
      path: "".concat(entry.id, ".content"),
      nodeId: entry.id,
      nodeType: "text",
      message: previous ? "This write changes both content and fontColor; the editor applies fontColor to every p, h1-h6, li and span, replacing the newly supplied inline colors ".concat(replaced.join(", "), ". Align or remove them, or keep the acquired fontColor for intentional multicolor text.") : "The editor applies a new text block's fontColor to every p, h1-h6, li and span, replacing the inline colors ".concat(replaced.join(", "), ". Omit fontColor to keep the content's colors, or align or remove them.")
    });
  }
  for (const entry of after) if (!before.some((node) => node.kind === entry.kind && node.id === entry.id)) {
    const capability = nodeCapability(entry.blockType ?? entry.kind);
    if (!capability?.actions.INSERT.runtimes.mergeService) issues.push({
      code: "UNSUPPORTED_OPERATION",
      stage: "change",
      input: "target",
      path: entry.id,
      nodeId: entry.id,
      nodeType: entry.blockType ?? entry.kind,
      reason: "INSERT_UNSUPPORTED",
      message: "Inserting this node is unsupported by merge-service."
    });
    for (const key of capability?.readOnlyProperties ?? []) {
      if (entry.element[key] !== void 0) issues.push({
        code: "READ_ONLY_FIELD",
        stage: "change",
        input: "target",
        path: "".concat(entry.id, ".").concat(key),
        nodeId: entry.id,
        message: "A read-only field cannot be inserted on a new node. Preserve the existing node or create a detached content copy."
      });
    }
  }
  for (const effect of getUnavailableMergeServiceSideEffects(currentResult?.success ? currentResult.documentState : { stripes: [] }, candidate)) {
    for (const id of effect.affectedBlockIds) issues.push({
      code: "SIDE_EFFECT_UNAVAILABLE",
      stage: "change",
      input: "target",
      path: id,
      nodeId: id,
      reason: effect.kind,
      message: "This change requires ".concat(effect.kind, ", unavailable in the mergeService profile.")
    });
  }
  if (current !== void 0) for (const loss of findUnintendedLosses(currentResult?.success ? currentResult.documentState : current, candidate, intent)) {
    issues.push({
      code: "UNINTENDED_DATA_LOSS",
      stage: "preservation",
      input: "target",
      path: loss,
      message: "The candidate drops or replaces data without a matching explicit intent."
    });
  }
  if (issues.length) return { success: false, issues };
  const prepared = stableJson(current) === stableJson(target) ? target : candidate;
  if (stableJson(JSON.parse(JSON.stringify(prepared))) !== stableJson(prepared)) throw new Error("JSON serialization changed the candidate.");
  return {
    success: true,
    documentState: deepFreeze(cloneJson(prepared)),
    normalizations: normalizedPaths(target, prepared),
    issues: [],
    verification: "contract"
  };
}
function requireValid(result) {
  if (!result.success) throw new DocumentStateError(result.issues);
  return result.documentState;
}

export {
  getContract,
  getJsonSchema,
  getCapabilities,
  nodeCapability,
  resolveSchema,
  nodeSchema,
  contractDefaults,
  schemaForValue,
  collectNodeIndex,
  hasLink,
  linkHostContains,
  isSupportedThemeReset,
  hasRecoloredInlineColor,
  releaseCopiedFontColors,
  DocumentStateError,
  jsonIssues,
  validateSnapshot,
  validateChange,
  requireValid
};

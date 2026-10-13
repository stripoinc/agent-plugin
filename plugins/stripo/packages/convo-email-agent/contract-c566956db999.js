import {
  collectSocialDocumentIssues
} from "./social-f4a8e0da8c68.js";
import {
  LINE_HEIGHT_HINT,
  cloneJson,
  deepFreeze,
  describeNodeKind,
  isObject,
  objectValue,
  stableJson
} from "./errors-3ee69a7e1eb0.js";

// convo-email-agent/src/sdk/preparation.ts
import { validateDocumentSnapshot, validateDocumentState as validateDocumentState2, getUnavailableMergeServiceSideEffects } from "./editor-validator/index.mjs";

// convo-email-agent/src/sdk/contract.ts
import schemaData from "./contract-data/schema.js";
import catalogData from "./contract-data/catalog.js";

// convo-email-agent/vendor/editor-validator/manifest.json with { type: 'json' }
var manifest_default = {
  editorRevision: "2a78eba954846a7d42c2f544142d08e22cbb571b",
  editorDirty: false,
  esbuildVersion: "0.28.2",
  zodVersion: "4.6.5",
  format: "esm-modules-v1",
  files: {
    "NOTICE.txt": "a9d923687d1186a7374f3ec536f6b76fb2dbeec011e7608878917e3df6e3e117",
    "index.mjs": "7e5f7a07db5ce10247e7824352007a2885ec88a38317bcdc46d271bef90fe222",
    "modules/ArrayUtils-8063398e6404.mjs": "a2157e3b903ff9f67a66b440a4cb180f83edc861ac4dbdf08c6b0ad746bbcd0c",
    "modules/AttributeConfigMigration-32d6d41af503.mjs": "9375240d1018fcd8ecdb403c2df45947250305adf62038ca6fe102dde334870d",
    "modules/CSSConverter-608b83714731.mjs": "45866e2ed3555ed90b560533552bdfbfde6499285921a658e5f70d2ee709882b",
    "modules/ColorUtils-a33f32974f73.mjs": "9b8c4125697dd9811d153216c56fb2fbc9e85cb8e9fffb78e332afc4e21cb874",
    "modules/Parser-f35812371386.mjs": "deba79817cf7b5d0b0ddde49aee6daacf8ea5228671a091d4cb598cde3f10974",
    "modules/SocialNetworkType-57875c573e3d.mjs": "613717404da6dff18e45050463e6056916620c57ee30c595891ea0fc5f5ae696",
    "modules/_DataView-3f8d51103b9f.mjs": "7f76257f099b6f504299dc915c97f29ffebc8b6e97d7fcd9aeb53af4cb8c3162",
    "modules/_Hash-6a5a8be86833.mjs": "fe97d69789b9a7c4bba78355a5ee6b57e724144b83bd412b028c70492389a12e",
    "modules/_baseSlice-aae12ccd937b.mjs": "ab30a83cb89dd445da6cc311a0869f4b183ed254e08091da63f2672f3825a501",
    "modules/api-7ec6d993fe84.mjs": "8e4370746e344d8744b88238ce84c3c9893f1eddf8febc7ee82c8d5be0ddf389",
    "modules/ar-e1d58fdd0495.mjs": "536076fbd47a6cb798bcf5e34133aaee61d27847aa58b0ff0b430e42e33a0023",
    "modules/at-rule-2b1e381bfcd5.mjs": "0d6b26e32e4c73eb1faaa04603dbf7a5909feb5f4f2e51ab6486753dc8fbd512",
    "modules/be-72979be88390.mjs": "2b81ac9041e544aa117d17f57ee26dbb83b82efb631f254ae1c0737b86b864d2",
    "modules/bg-542c84614fee.mjs": "e412dba4c0205e1409f88bf6bcea6343e8409a6555b62ca2a1a693ab94bfbb93",
    "modules/biesbjerg-ngx-translate-extract-marker-6a26f5bc5c0e.mjs": "f22462ff2b619e1a7104436adfeb0c45e31a9ee0c27d623743fc1bf916bada69",
    "modules/bn-60307a2c0766.mjs": "e597076645e9fa47034122c853b73bb536c270182cdc006170643632689c47f3",
    "modules/builders-6d4dedaf957f.mjs": "351959a3d64b14057c3779a44481b38b6680d9faab377d2d535a30c5fa0b9cdc",
    "modules/checks-bd1e5de0ca09.mjs": "03dde7cc8cff126350ec6884b19fe98b21a8dded9d0d9ed6829fbfbbed70cbdc",
    "modules/checks-f4a190521e0d.mjs": "17edf597e28617fee334bb12ca49a57445e0a9a47d7810b655adff7b46673e53",
    "modules/ckb-ddc82ea9c77a.mjs": "cc824dcb1892748de1a708824f962f18ead2e0451b1789a00487a8a0f65ab627",
    "modules/coerce-d38c736de753.mjs": "a08e486e579d920179ff94cd99febf6708899d0dabb16a67349f7e6027752651",
    "modules/comment-c2c2abaee17f.mjs": "0394714545fc708a5f4e27b2ba1cf90d94f6067f95768a3dcadcd40bfbd5fe75",
    "modules/compile-fe1f1936d44e.mjs": "9f841c66665dfcf550454387b9fce2afe6798ed95a33221f8f495ac4ac5434ae",
    "modules/core-d6ef11a90708.mjs": "132a1ea8bb2a6c6576985215d3d5b8fd431758361bf2166264d31d79871ddd34",
    "modules/decode-codepoint-de4ce2c8771f.mjs": "112f9c8e2fa8203ea2da7c133c279380a085076e133fadf0ad034da7d064acfa",
    "modules/decode-data-html-482e5b7a6675.mjs": "0fbace444376629e18d73838a56c88fe8dd7697f6dc1082f2cbd6e903511c03d",
    "modules/doc-85ae2b2bbd32.mjs": "9dc6371f0e46b23aa8512e4d965f4f5d68c91268ca576db5342f4d2ac89762f8",
    "modules/document-13235feeff49.mjs": "765f271eac34eae29391ce75d4e1d533c13d055f4a7289b8e6f5544fc4d4304c",
    "modules/el-d2b74d96868d.mjs": "ec22a0c83e5747dd667eb58b7359de91336ff005b8719fbbc3ec160f5e472372",
    "modules/errors-095a9cd7e5fd.mjs": "9ef45253562474efc319fab1fcdb93384da29aaba363030a0dd23132403917d9",
    "modules/es-fc2f1ee63cca.mjs": "37e3419cce2ec172e35829e22188600eed9114c93a77aadc19b1e6b1122bff08",
    "modules/fa-b54c803455c1.mjs": "76c6609fb0599d91add9c274260f87a1197cc508d2912f891c98001b7bf84077",
    "modules/fr-4b4663c3d230.mjs": "03d3ec139085af6fd46b869f6dd49dddca0f19de45107c5ed8df6382d94de837",
    "modules/from-json-schema-1979beab5102.mjs": "6815bd71e0178c0f6afecc6774b7c907d6933169651ccdfd837018884377b1c3",
    "modules/fs-064e509bf2cb.mjs": "b30642eb4b8d9160fc1471b4304a36a75cc801cbaa8fd2007efd21bb3147ef62",
    "modules/gu-0e230c44f6bd.mjs": "8a4797a775d7f8fe142fa18dfa08994852023f6c6e40c6eff07d84da5bed8306",
    "modules/he-3eb1c1845d9e.mjs": "8c8d9570ed1282c0e7e6da47d9215d9e3b9a3c6d155b65df71ef254f47736b70",
    "modules/hi-bdb199026ff7.mjs": "5a7b89218d29381e259ad99cc608cfd157831c208ebe01a564d6c9a2299d82df",
    "modules/history-keys-1e69b42223b4.mjs": "9748dc87b9eebffceb10120e975aca9467f8390702afb6cb06ed5246f8d155ac",
    "modules/hy-a38fb7e4f9ec.mjs": "96add88bb259845244a79b97f6b205f889f37169bb5c75b84625ea5c2c34ad06",
    "modules/index-578459128e2e.mjs": "8a8eaacda01bc2ab36178c6b14b5bd50725196e20503d6ef1c42b7217a5046f0",
    "modules/index-604a083968ff.mjs": "0cc077e8b11140fa0bbc62d1e171d07c524f92ba334b677156293d3c7227ffbe",
    "modules/index-829c7f2491ea.mjs": "a6da3478189ffa599173f3a388fa5825e8efccd3e9e4da78a5a1ca2b98e88bde",
    "modules/index-83a196bff650.mjs": "d9b1c97f5c92bc2413075cb2a775cce27552682122020638c3aa0d74ff4d35a1",
    "modules/index-95be4dc08d9c.mjs": "a233139868e17d1453ac45e3e9d0d9f1df56b5164ddc9d162a39f98494168349",
    "modules/index-abd71ade49d1.mjs": "44c80931e3fa412738b270616beff193ea3a19af064e410718cf87a3c10692b9",
    "modules/ja-6478150f8d7a.mjs": "13bf7fa9ab4fd8595bd32caa9ccd5931a6f3b853bfd1857a90aa6099f1c3846f",
    "modules/json-schema-processors-0c244c7c3151.mjs": "8d747db808a2578c4078098596fd40f3a544a64da6778baa74d0cb43d203e019",
    "modules/ka-337898cedd2a.mjs": "14b3db7a073272b5a56115dd19dbe00a216aa493075db832b684bfe94c56c7fa",
    "modules/km-d158ab990ee9.mjs": "91f25adc3a066bd31d4fdd8acb21def8701376652890ce6899e2bca4746dfc79",
    "modules/kn-ccd0d66753b1.mjs": "f827fad5381473c32cf807428df5be7c21e5598b5d93082437777f5febd27037",
    "modules/ko-27b7a94f5634.mjs": "64a2740969746bf9ea3f7f0460e0be8a3db6f5bfa47ff26c84de590213121a9f",
    "modules/lt-52aa05368ec0.mjs": "e9fcd63d809b04023b520b56b18516ecb28561e66ff6629a957a7caf85b957fc",
    "modules/map-generator-a34cf548f9d1.mjs": "6c8cdc940b6a6233cbb8ffda1c40b85338f2151a863ed89644facd80cee40561",
    "modules/master-80783f73f1e0.mjs": "59d4c37bd6997999ea5499d0cfa53704772e47b6786485f7ba4454b05930de73",
    "modules/master-css-6656cf175550.mjs": "56dc24e629b941e39dbb3da4a7879426dcd6cabe334ffa0c481a90fcb786d2e1",
    "modules/master-css-variables-a84902889746.mjs": "cd4e97edbe3c9c183746579f68371006642ef2f8b176ed312e56f1b144224b4d",
    "modules/master-css-variables-defaults-fd88a551a3d8.mjs": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "modules/memoizer-c00f0bc54290.mjs": "0228f3d867868c9f59fd0b0e44cf5bae0fdc12b161364167503239fbc3c87cb9",
    "modules/mk-67b5345704f5.mjs": "48908f52cdbff588e168380d6892eb7bfc6db4fc05f5d1776ca18a25157e66d6",
    "modules/ne-f804b66c7871.mjs": "dcf5db015a923aed38a9ecaa46c2af17862ea578b1c796ba0b7aa14bb377e65e",
    "modules/node-909c4f08098c.mjs": "940e9e2d3ac26a65771f9a10ad6d95a57d0b452a07a486ed66094759249b1517",
    "modules/parse-545b503fc4ed.mjs": "0d9109245704e662d12a16a49519324075c090bf342e51ef3ac964ccbcbc44a1",
    "modules/parse-8126121d6d62.mjs": "f74e35b621b9f40eae3a8f7cea5a36ac51dc6683cba7c9a1fc3a05a325518fc6",
    "modules/pl-0edcc52c11a6.mjs": "9f94902d4e758f25b0d07de7898cd04fb52fdb7a70312b2cc4f73d61e0b8a813",
    "modules/proto-int64-27d7cd28885a.mjs": "0ecc5f695acda4ca429fb8ccc9a3ce2d7dc0d84af5900b9817fec84ec26307ad",
    "modules/ps-57feece82f75.mjs": "6d7faad5c74d0916eec08cd7e1400688fbdc84e3d7b752c74541ffeaca7364c5",
    "modules/pt-2b6363a9f827.mjs": "7539f524c2f0bdb22e8b1d4b02faf1aaaa2f3871ab0cfc22c354a7e5a3e43883",
    "modules/pt-BR-4ca29f9ccdf1.mjs": "78b812a60ee722a6d0409681274d6419dd7c53ae3fa2ead67e4135b9f1622cac",
    "modules/regexes-d1711c96e64b.mjs": "30e6656bcb14321fd118e2a97804814eacfd9adbb5ba06c01676b2359360711d",
    "modules/registries-3ceb92ae3dab.mjs": "8694e6c3c6f1fafa26a66dc6b42debb2bddd2b99ce022c7d502fbced38c48560",
    "modules/ru-bc4e3a9b0c5d.mjs": "b58f588de4058762e7749bd6275bae326b23087f16df0d9e8ba3e4a6cbacfbea",
    "modules/serviceSelectorPrefix-db24995a76b3.mjs": "f21e746980077b8c9e902e5af3288719d123743e194ae37c07675d0b168f5103",
    "modules/shared-4f53cda18c2b.mjs": "0638f4510b6c8992fea95bfddbbccf9f3c9b2931a09bc893ef2511320ff0fc01",
    "modules/social-networks-data-4f7cb53fbb33.mjs": "edcfa146a72e358d35aa94ef8137ba6d5a362c672046b5a5c7396a7bc26bbef2",
    "modules/stringifier-5d6259805667.mjs": "cb3c1e67fd872b906309c3b8ae19a041df52ad057c46ab0148155a89c9f06673",
    "modules/ta-db52cb61dd13.mjs": "8cb41814bb5b4e6287d53970c1e42701b2f1d4a02e1242b0559c23a2f32d6d07",
    "modules/terminal-highlight-0f20b1c39b48.mjs": "38038ee55ca58ab684007912e0701823fd09b98f6bba43753533e3d40209005b",
    "modules/tg-a3abd3dcaab9.mjs": "9d66d21864ab7d0463a9b4d08cedd0f8eec2024572e3488159b81d2eb5d47a91",
    "modules/th-0b76e62dab96.mjs": "8dbfe2ab4e4e4eb195d75a96836b5fb2fd9bb07e7e1690da5b72e62cd49a83dd",
    "modules/time-zones-data-498efe19d3a8.mjs": "18068732c90e99364e90d7c1e52e40c870946cbb7bf213835d748d1a37bbee95",
    "modules/tinycolor-2bf5fc1acbb7.mjs": "5c3a91acf39fefa5ffc62655e2b355846babf9f9efaffdf187de98de77770d57",
    "modules/to-json-schema-b5fe38b46dc6.mjs": "14b4cebe8cea73d53a2ebd9b7c3e36f558abb5847089da8bda983db7d1d2c709",
    "modules/tokenize-acf2d687b44d.mjs": "99168f8fa7bfe3f9e9f4013fc0d8272f393abc20d3a4edf892b23ce6ffa92d02",
    "modules/ue-proto-87c1854705b4.mjs": "c43b6efc449badb32b5602defc77f5af651ac51ddee47a08e0afccc754fff402",
    "modules/uk-e0f612ccc576.mjs": "21bb3dfbc7ee53eb4a9038646e9880d2e8c8cf78463fb87d0a80d07fb308ea79",
    "modules/ur-d062d4183cb7.mjs": "3636eb1e5529439b6f4c3c08749c98181423a65dc107c90cbbb9965883656699",
    "modules/url-27db039aa4f6.mjs": "dede4e6f9d09df89a77d730012a180cecae5f99feb0d986284233ea9e9620447",
    "modules/vi-b05b5337c3b0.mjs": "468530294579e4546eaaae869fa5f99007525996daab7d2ce1efff895a91f89e",
    "modules/yo-9342d8b90769.mjs": "e3a29e39e085122bab1c4ffe23ab34834c4c6d965ee91fdee971d2ed4b091ab9",
    "modules/zh-TW-74f07ebb2b3a.mjs": "848fe12bc44f694a16e3198d55ad52d31d6441be8b83f41d2b3788dd43c356f7"
  },
  sizeBytes: 2698305,
  bundleSha256: "8b68ecbfa523ec1a20f0aabc9382eb1962a1f49c01b019d4d14a98df5c1a8dad"
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
  const definition = kind in blockKinds ? `${kind}Block` : kind;
  return nodes.find((node) => node.schemaDefinition === definition);
}
function resolveSchema(node) {
  if (!node.$ref) return node;
  const resolved = node.$ref.slice(2).split("/").reduce((value, key) => isObject(value) ? value[key] : void 0, schema);
  if (!isObject(resolved)) throw new Error(`Unresolved contract reference: ${node.$ref}`);
  return { ...resolveSchema(resolved), ...Object.fromEntries(Object.entries(node).filter(([key]) => key !== "$ref")) };
}
function nodeSchema(kind) {
  const definition = kind in blockKinds ? `${kind}Block` : kind;
  const result = schema.definitions?.[definition];
  if (!result) throw new Error(`Unsupported SDK node kind: ${kind}`);
  return resolveSchema(result);
}
function contractDefaults(kind) {
  const name = `DEFAULT_${kind.toUpperCase()}${kind === "container" ? "" : "_BLOCK"}_SETTINGS`;
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

// convo-email-agent/src/sdk/editor-validator.ts
import {
  validateDocumentState
} from "./editor-validator/index.mjs";
var ROOT_PATH = "<root>";
function dotPath(segments) {
  return segments.length === 0 ? ROOT_PATH : segments.map(String).join(".");
}
function pointerToPath(pointer) {
  const segments = pointer.split("/").slice(1).map((segment) => segment.replace(/~1/gu, "/").replace(/~0/gu, "~"));
  return dotPath(segments);
}
function quoteAll(values) {
  return values.map((value) => JSON.stringify(value)).join(", ");
}
var DISCRIMINATOR_MESSAGE = /^Invalid discriminator value\. Expected (.+)$/u;
var TYPE_MESSAGE = /^Invalid input: expected (.+?), received (.+)$/u;
function formatIssue(issue) {
  const path = dotPath(issue.path);
  if (/^settings\.(?:stripes|headings\.h[1-6])\.lineHeight(?:\.(?:desktop|mobile))?$/u.test(path) && issue.code !== "unrecognized_keys") {
    return [{ path, code: issue.code, message: `${issue.message} ${LINE_HEIGHT_HINT}` }];
  }
  if (issue.code === "unrecognized_keys" && issue.keys && issue.keys.length > 0) {
    return issue.keys.map((key) => ({ path, code: issue.code, message: `unsupported property ${JSON.stringify(key)}` }));
  }
  if (issue.code === "invalid_type") {
    const match = TYPE_MESSAGE.exec(issue.message);
    if (match?.[2] === "undefined" && issue.path.length > 0) {
      const property = String(issue.path[issue.path.length - 1]);
      return [{
        path: dotPath(issue.path.slice(0, -1)),
        code: issue.code,
        message: `missing required property ${JSON.stringify(property)}`
      }];
    }
    return [{ path, code: issue.code, message: match ? `expected ${match[1]}, received ${match[2]}` : issue.message }];
  }
  if (issue.code === "invalid_union") {
    const discriminator = DISCRIMINATOR_MESSAGE.exec(issue.message);
    if (discriminator) {
      const allowed = discriminator[1].split("|").map((value) => value.trim().replace(/^'(.*)'$/u, "$1"));
      return [{ path, code: issue.code, message: `must be one of ${quoteAll(allowed)}` }];
    }
    let candidates = issue.branches ?? [];
    for (const property of ["type", "mode"]) {
      const mismatches = candidates.map((branch) => branch.find((nested) => nested.code === "invalid_value" && nested.path.length === 1 && nested.path[0] === property && nested.values && nested.values.length > 0));
      if (mismatches.length > 0 && mismatches.every(Boolean)) {
        const allowed = [...new Set(mismatches.flatMap((mismatch) => mismatch?.values ?? []))];
        return [{
          path: dotPath([...issue.path, property]),
          code: "invalid_value",
          message: `must be one of ${quoteAll(allowed)}`
        }];
      }
      candidates = candidates.filter((_, index) => !mismatches[index]);
    }
    const branches = candidates.map((branch) => branch.flatMap((nested) => formatIssue({ ...nested, path: [...issue.path, ...nested.path] })));
    const closest = branches.filter((branch) => branch.length > 0).sort((left, right) => left.length - right.length)[0];
    if (closest) return closest;
    return [{ path, code: issue.code, message: issue.message }];
  }
  if (issue.code === "invalid_value" && issue.values && issue.values.length > 0) {
    return [{ path, code: issue.code, message: `must be one of ${quoteAll(issue.values)}` }];
  }
  return [{ path, code: issue.code, message: issue.message }];
}
function validateEmailDocument(model, options = {}) {
  const result = validateDocumentState(model, options.current);
  const issues = result.issues.flatMap(formatIssue);
  const reported = new Set(issues.map((issue) => issue.path));
  for (const social of collectSocialDocumentIssues(model)) {
    const path = pointerToPath(social.instancePath);
    if (reported.has(path)) continue;
    reported.add(path);
    issues.push({ path, code: "editor_rule", message: social.message });
  }
  return issues;
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
      const address = `${pointer}/${key}`;
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
      if (!permitted(`/${key}`)) lost.push(`/${key}`);
    } else compare(before[key], after[key], `/${key}`);
  }
  const remaining = collectNodeIndex(output);
  const occurrences = /* @__PURE__ */ new Map();
  for (const node of collectNodeIndex(input)) {
    const key = `${node.kind}:${node.id}`;
    const index = occurrences.get(key) ?? 0;
    occurrences.set(key, index + 1);
    const candidates = remaining.filter((item) => item.id === node.id && item.kind === node.kind);
    const survivor = candidates[index];
    if (!survivor) {
      if (!removals.has(node.id) && !node.parentChain.some((id) => removals.has(id))) lost.push(`/${node.id}`);
      continue;
    }
    const withoutChildren = (item) => Object.fromEntries(
      Object.entries(item).filter(([key2]) => !CHILD_ARRAYS.has(key2))
    );
    compare(withoutChildren(node.element), withoutChildren(survivor.element), `/${node.id}`);
  }
  return [...new Set(lost)];
}

// convo-email-agent/src/sdk/preparation.ts
var DocumentStateError = class extends Error {
  constructor(issues) {
    super(issues.map((issue) => `${issue.path}: ${issue.message}`).join("; "));
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
    return after.flatMap((value, index) => normalizedPaths(before[index], value, path ? `${path}.${index}` : String(index)));
  }
  if (isObject(before) && isObject(after)) return [.../* @__PURE__ */ new Set([...Object.keys(before), ...Object.keys(after)])].flatMap((key) => normalizedPaths(before[key], after[key], path ? `${path}.${key}` : key));
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
      fail(`Value of type ${typeof item} is not JSON.`);
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
        if (!descriptor) fail(`Sparse array entry at ${i}.`);
        else if (descriptor.get || descriptor.set || !descriptor.enumerable) fail(`Array entry ${i} is not a JSON data property.`);
        else visit(descriptor.value, `${path}.${i}`);
      }
      if (Object.getOwnPropertyNames(item).some((key) => key !== "length" && (String(Number(key)) !== key || !Number.isInteger(Number(key)) || Number(key) < 0 || Number(key) >= item.length))) fail("Array properties would be discarded.");
    } else for (const [key, descriptor] of Object.entries(Object.getOwnPropertyDescriptors(item))) {
      if (descriptor.get || descriptor.set || !descriptor.enumerable) fail(`Property ${key} is not a JSON data property.`);
      else visit(descriptor.value, path === "<root>" ? key : `${path}.${key}`);
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
      if (schema2.items) value2.forEach((child, i) => visit(child, schema2.items, `${path}.${i}`));
      return;
    }
    if (!isObject(value2) || !schema2.properties) return;
    for (const [key, child] of Object.entries(value2)) {
      const childPath = path ? `${path}.${key}` : key;
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
  const native = validateDocumentState2(target, current);
  const validation = validateEmailDocument(target, { current });
  if (!native.success || validation.length) return { success: false, issues: validation.length ? validation.map((issue) => ({ ...issue, nativeCode: issue.code, code: "INVALID_DOCUMENT", stage: "schema", input: native.input ?? "target" })) : native.issues.map((issue) => ({ code: "INVALID_DOCUMENT", nativeCode: issue.code, stage: "schema", input: native.input ?? "target", path: issue.path.join("."), message: issue.message })) };
  const candidate = native.documentState;
  const before = collectNodeIndex(currentResult?.success ? currentResult.documentState : { stripes: [] });
  const after = collectNodeIndex(candidate);
  const issues = [];
  for (const pointer of intent?.resetFields ?? []) {
    const match = /^\/([^/]+)\/settings\/(.+)$/.exec(pointer);
    const node = match && before.find((entry) => entry.id === match[1]);
    const supported = isSupportedThemeReset(pointer) || node && (node.blockType === "image" && match[2] === "link" || node.blockType === "spacer" && ["height", "width", "border", "mobileBorder", "alignment"].includes(match[2]));
    if (!supported) issues.push({ code: "UNSUPPORTED_RESET", stage: "change", input: "target", path: pointer, message: "No reviewed native reset exists for this path." });
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
        message: `${survivor ? "Moving" : "Deleting"} this node (including through its parent) is not supported by merge-service.`
      });
    }
    if (survivor) for (const key of capability?.readOnlyProperties ?? []) {
      if (stableJson(entry.element[key]) !== stableJson(survivor.element[key])) issues.push({
        code: "READ_ONLY_FIELD",
        stage: "change",
        input: "target",
        path: `${entry.id}.${key}`,
        nodeId: entry.id,
        message: "A read-only field changed."
      });
    }
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
        path: `${entry.id}.${key}`,
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
      message: `This change requires ${effect.kind}, unavailable in the mergeService profile.`
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
  ROOT_PATH,
  validateEmailDocument,
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
  DocumentStateError,
  jsonIssues,
  validateSnapshot,
  validateChange,
  requireValid
};

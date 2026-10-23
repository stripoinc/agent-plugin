import {
  collectSocialDocumentIssues
} from "./social-f4a8e0da8c68.js";
import {
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
  editorRevision: "9fe0771bd1219868d7053ef7e323dc3406329de3",
  editorDirty: false,
  esbuildVersion: "0.28.2",
  zodVersion: "4.5.4",
  format: "esm-modules-v1",
  files: {
    "NOTICE.txt": "ee40bc55426c522cb974520e8de80f9cdb781ee4502e7701685eabe1427fea6e",
    "index.mjs": "97f4113ff73240f0a2078fe19d0b5aea56d563de2397d39ce61ec7791c2cbb0c",
    "modules/ArrayUtils-759cc5f22881.mjs": "397ed4aee92f93127905031b41526c5c5f5647ef574c2c7b4d2f5214e1e093b1",
    "modules/AttributeConfigMigration-32d6d41af503.mjs": "c55f1650f00f1325fa61fefa859253b8805cc5cf95bb73a47e90acd41ba39f6d",
    "modules/CSSConverter-608b83714731.mjs": "1c8c36013fa7e10e3cd9916cbc41cec8c299b269a675899c737dba5dc17cb1c2",
    "modules/ColorUtils-a33f32974f73.mjs": "4c4189e10d3ba9ab3543f27c7c5557ad6829454a85d8409602bd290db9b0a745",
    "modules/Parser-f35812371386.mjs": "3b2d43a89477a7364e50d1a8b2937f58587f7158e9dee3809c151b5a9cc79fa2",
    "modules/SocialNetworkType-57875c573e3d.mjs": "613717404da6dff18e45050463e6056916620c57ee30c595891ea0fc5f5ae696",
    "modules/_DataView-3f8d51103b9f.mjs": "f3502d4b1b91312f28d4e12b8de4dd4fc32fcf9393825e31e7a367444aad2810",
    "modules/_Hash-6a5a8be86833.mjs": "fe97d69789b9a7c4bba78355a5ee6b57e724144b83bd412b028c70492389a12e",
    "modules/_baseSlice-aae12ccd937b.mjs": "da73192b7cfa0967c8a88d4bc2a0b4d4ff75ba32b13a1fe8b8ed6490b5869512",
    "modules/api-7ec6d993fe84.mjs": "a1031ecbe990167de769b05766272d3dbb7a0b4d3c2e7b2dd9585a9fcc9efadc",
    "modules/ar-e1d58fdd0495.mjs": "3f58f1d1e9c99504625393f7ffc2ffb68ac3ff58a3e1cece6300d7fcba7c5d8a",
    "modules/at-rule-2b1e381bfcd5.mjs": "6e9341a4c14c238db9bd13cf828fe176fa8d47314e923abe7eb5fccee4241d37",
    "modules/be-72979be88390.mjs": "ebabd947787d2c6e0a54a4c092e3a39e17a5011e1ca80485f3dc5479abb53ec8",
    "modules/bg-542c84614fee.mjs": "51725aa5a95d58d1b688d448a82de7b07b340e89a557128bd04a3a6d814307eb",
    "modules/biesbjerg-ngx-translate-extract-marker-6a26f5bc5c0e.mjs": "f881be157189eff626a2ac194a62aae6b9d347d7c79127e9e916f54ec855dee2",
    "modules/bn-60307a2c0766.mjs": "3a9517d729fbff6fc65ef262b81ffcc574e898cd7431a52c32097faf4c8d501b",
    "modules/builders-6d4dedaf957f.mjs": "ea0ffee7a2ea4491416c539b5c4940391e06a6bf67dda5452ffa73a239ff3fa6",
    "modules/checks-bd1e5de0ca09.mjs": "51650c67bf40d0da4218352fd8332fd8635fef1a23464f65bbbe26678944d8dd",
    "modules/checks-f4a190521e0d.mjs": "2de114af85fda9dbb3061a28263845fed9b5947fb4803a32574fc5d14609c3ad",
    "modules/ckb-ddc82ea9c77a.mjs": "01144b3938e13db95dd936638733c2691f44f79b20fa9c67c32746811198c273",
    "modules/coerce-d38c736de753.mjs": "243fe113ad8a5af67b40199958f470e6664b4af5247025b9b183885a6915b948",
    "modules/comment-c2c2abaee17f.mjs": "0394714545fc708a5f4e27b2ba1cf90d94f6067f95768a3dcadcd40bfbd5fe75",
    "modules/compile-fe1f1936d44e.mjs": "46ce130db2a8ef2d63ad0a2319d86cddda2ddd5781d100b6e7c892c37af792e7",
    "modules/core-d6ef11a90708.mjs": "5708dcc3a8c39a7534d6d14c8eab1420d5e4a40c3053b9f3a601b3cd5aefa438",
    "modules/decode-codepoint-de4ce2c8771f.mjs": "54e4b4c457a4b40ab3b98723ac6ecc879c99ca016cca4fabdc99079ceea2d511",
    "modules/decode-data-html-482e5b7a6675.mjs": "de42590ec91dcfef9a8f038f2f48167970db411b6fc1c04814e2c7a1dddcadd9",
    "modules/doc-85ae2b2bbd32.mjs": "19de2985c87d6fc12d8ef064b7e088060950f8e884d07348ac5b9c8d80d93e05",
    "modules/document-13235feeff49.mjs": "765f271eac34eae29391ce75d4e1d533c13d055f4a7289b8e6f5544fc4d4304c",
    "modules/el-d2b74d96868d.mjs": "c43eecc7ecd8cd0759085832f59b4329eb41dc804b222e6008e5b97689e62abb",
    "modules/errors-095a9cd7e5fd.mjs": "38c2f240cfdc532c62c2d7984eed53ceb9995c6974ccfba8818f36bdfe7fc444",
    "modules/es-fc2f1ee63cca.mjs": "c8a0ca964dfdb0fe75cf6385bd6ed9bc9ecef262bdcd0c21b9e0cf7aff6bf09a",
    "modules/fa-b54c803455c1.mjs": "e37727328bbca07fc8798f690aa98dfc6902a6eaa2d9fafd174b4fa1757a8729",
    "modules/fr-4b4663c3d230.mjs": "cdd9594a56180983d0eb6353d0f0e29827e8a2296ceae6a47e884d84e441ceb7",
    "modules/from-json-schema-1979beab5102.mjs": "a08e15b69e67a95336499304d77ea1ac5b502a5475b7953dc0b7bc7a5858bc92",
    "modules/fs-064e509bf2cb.mjs": "b30642eb4b8d9160fc1471b4304a36a75cc801cbaa8fd2007efd21bb3147ef62",
    "modules/gu-0e230c44f6bd.mjs": "95a018aed04783007e3eaf56f8052d51f3867c09784bd501dabe2783bcbece43",
    "modules/he-3eb1c1845d9e.mjs": "fe1231a8981c17343d4557333522684dd9e0b3bf64c0dc010251880331236749",
    "modules/hi-bdb199026ff7.mjs": "00e3f3d47f725cae9a0d03e1a9fbbcfaf094b4374c65199f0fb24193a065ff73",
    "modules/history-keys-1e69b42223b4.mjs": "9748dc87b9eebffceb10120e975aca9467f8390702afb6cb06ed5246f8d155ac",
    "modules/hy-a38fb7e4f9ec.mjs": "0e1b65d44f2b00726efbfeb7ccfae4e30d916a50304b4af596eea07714a5333e",
    "modules/index-18e3dd656b20.mjs": "c982ece63fc90082b02acfad2e1d13ceb6240f227651ccc5aed0b0aea5300156",
    "modules/index-578459128e2e.mjs": "8a8eaacda01bc2ab36178c6b14b5bd50725196e20503d6ef1c42b7217a5046f0",
    "modules/index-604a083968ff.mjs": "0cc077e8b11140fa0bbc62d1e171d07c524f92ba334b677156293d3c7227ffbe",
    "modules/index-829c7f2491ea.mjs": "a6da3478189ffa599173f3a388fa5825e8efccd3e9e4da78a5a1ca2b98e88bde",
    "modules/index-83a196bff650.mjs": "10997237a71e43a9b8d6212694889db2f60fb0ee025b7fb9de037d7a817ee888",
    "modules/index-8c9fdc3b457a.mjs": "5c66bd5de768f1b8c3d05d976f1910e93e8ca3dc459961abae170225ffcaa320",
    "modules/index-95be4dc08d9c.mjs": "a233139868e17d1453ac45e3e9d0d9f1df56b5164ddc9d162a39f98494168349",
    "modules/ja-6478150f8d7a.mjs": "b6b86fe5008706ecf191c483943e598771de4020940c5fb39a2eb6f2668620f9",
    "modules/json-schema-processors-0c244c7c3151.mjs": "383ae0e19eb306346152868aec816503e34e9daef782c74df3e443e4cdc593b4",
    "modules/ka-337898cedd2a.mjs": "7be8dfa3fa8c13b0f79effd80b401d364a41bfdf16d901dd4e705c9c03ab5a0c",
    "modules/km-d158ab990ee9.mjs": "27381592d2bb543c05ed5e0d5d938ef423a6d63f286df02d3428efdf47fe779c",
    "modules/kn-ccd0d66753b1.mjs": "c8db2e3bf743c5d216db0eea86202705b9b4198b310ab9acd0a04861cda3b2fc",
    "modules/ko-27b7a94f5634.mjs": "4bec62207a8f7a1d4634ced3e4d42657a48fd83770600e0ba14d6393784e525e",
    "modules/lt-52aa05368ec0.mjs": "4428c3d06814c09a492d9e5af428b93cc00fca5ec584019f7e75653717f82537",
    "modules/map-generator-a34cf548f9d1.mjs": "e1a46cde0580eaec9b7367044b58c7c0d0e1d0236153e2fae8dc4ae56fbb21f1",
    "modules/master-80783f73f1e0.mjs": "59d4c37bd6997999ea5499d0cfa53704772e47b6786485f7ba4454b05930de73",
    "modules/master-css-6656cf175550.mjs": "f5904d5004a7dec74db828a59a3aea70694d34fe71003a3c2d2504f3260e763a",
    "modules/master-css-variables-a84902889746.mjs": "785d0ddfabe758a01402c1172c6559b6f95f9f4e4842ae41eeab47892dd9866f",
    "modules/master-css-variables-defaults-fd88a551a3d8.mjs": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    "modules/memoizer-c00f0bc54290.mjs": "66469cab5eeb24c878f04e9f746831bbba9abf3e8b3b94ce1ffa0e3bd1f74fdc",
    "modules/mk-67b5345704f5.mjs": "ebb9a69292d0eb1441d5e26127aa88e3f2d83e16ee4c1e22b0fed3dfed73b2ad",
    "modules/ne-f804b66c7871.mjs": "423147ef0ea1111db3dc8395c2c79ee3bcf7b0d2e82deeed2f6111e812694269",
    "modules/node-909c4f08098c.mjs": "40d27018035d962953acfad9b568451a633f3a587687f3d7e8834e3ff7bdf30e",
    "modules/parse-545b503fc4ed.mjs": "17cbd37ae53bcac060e8bf46af8528cd2268579cc489105bd9c67a828a54cf18",
    "modules/parse-8126121d6d62.mjs": "f74e35b621b9f40eae3a8f7cea5a36ac51dc6683cba7c9a1fc3a05a325518fc6",
    "modules/pl-0edcc52c11a6.mjs": "0d19cc427e16c4efa578687dfcb7681f62ecfd2d3ef196520a14af55567b3dca",
    "modules/proto-int64-27d7cd28885a.mjs": "dbbdd40e23727608b93edabed96d8810cedbcb1cd56d8b3ea0e9866716e6a259",
    "modules/ps-57feece82f75.mjs": "ec2d245ddabd608f3a7664d2247a1cc99d366d2bb3666ca63d92ebf45df19e77",
    "modules/pt-2b6363a9f827.mjs": "8b7ecaad038605c3646d7d2eb303ef887af684619b3c6d9286145ecbfb134e2f",
    "modules/pt-BR-4ca29f9ccdf1.mjs": "f8778e28be8e7f7b4bb9f60da05fb3c1ffdf32f488f2e0cdf4a6c1394bc09a40",
    "modules/regexes-d1711c96e64b.mjs": "366172b2423286cc556340be17f17b272215779b64b40616708333d938d5b6e0",
    "modules/registries-3ceb92ae3dab.mjs": "8694e6c3c6f1fafa26a66dc6b42debb2bddd2b99ce022c7d502fbced38c48560",
    "modules/ru-bc4e3a9b0c5d.mjs": "5cd7ff659c19d3d3dece11c629c03fa3869ce135af265c9257544b0bb6d21be8",
    "modules/serviceSelectorPrefix-db24995a76b3.mjs": "f3e19b3900a2a4e3c0cf70b768fa036fa3408aa59f98b6d6e7792aadf91be1b7",
    "modules/shared-4f53cda18c2b.mjs": "0638f4510b6c8992fea95bfddbbccf9f3c9b2931a09bc893ef2511320ff0fc01",
    "modules/social-networks-data-4f7cb53fbb33.mjs": "a47443fbee6aedd6df147430dddbc41d4122fd7fae6c5663fc54331b987d20f6",
    "modules/stringifier-5d6259805667.mjs": "03e1a8275e3a59bf53d463be261f72d33a2b2aa90fee43d7d5a1f4aacc9b2f19",
    "modules/ta-db52cb61dd13.mjs": "6faeb91472d2d0dac03aa894719921913e72c83b4ec3c3b34521a78a1dbb5bed",
    "modules/terminal-highlight-0f20b1c39b48.mjs": "38038ee55ca58ab684007912e0701823fd09b98f6bba43753533e3d40209005b",
    "modules/th-0b76e62dab96.mjs": "eefd25252ee444d9ceab56c376f5c9694ef4a2be72247812b0227f6f8ded94bd",
    "modules/time-zones-data-498efe19d3a8.mjs": "18068732c90e99364e90d7c1e52e40c870946cbb7bf213835d748d1a37bbee95",
    "modules/tinycolor-2bf5fc1acbb7.mjs": "5c3a91acf39fefa5ffc62655e2b355846babf9f9efaffdf187de98de77770d57",
    "modules/to-json-schema-b5fe38b46dc6.mjs": "42f17864fd04a0617651184d21decbc1c1fd8b03fccc8152fbce822f3cc7bbe1",
    "modules/tokenize-acf2d687b44d.mjs": "99168f8fa7bfe3f9e9f4013fc0d8272f393abc20d3a4edf892b23ce6ffa92d02",
    "modules/ue-proto-87c1854705b4.mjs": "92389e05ff681015458ddde48d8aec4a1c28a43db86adf59f8567fe9b4f19eed",
    "modules/uk-e0f612ccc576.mjs": "9b510f7471d042e22ef60bcde8cc2b1dc0fd35d759876393c2a15ed2d69f0264",
    "modules/ur-d062d4183cb7.mjs": "910d93b94413c170fc20f3dfee5691c554416bb30d8c046ca210b82af11c54f3",
    "modules/url-27db039aa4f6.mjs": "dede4e6f9d09df89a77d730012a180cecae5f99feb0d986284233ea9e9620447",
    "modules/vi-b05b5337c3b0.mjs": "62f670e0491a3de45b8919a3026eff3e181c6eb7d537eebfe3d9409a23d9109b",
    "modules/yo-9342d8b90769.mjs": "f77cea978e6a4a95d7f216c6674f7490ea47913071eca8f18ddc259784bac5b4"
  },
  sizeBytes: 2663378,
  bundleSha256: "601faa25df39ad27525959006264950f84645b3b7132d338b5b8867867f27e2c"
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

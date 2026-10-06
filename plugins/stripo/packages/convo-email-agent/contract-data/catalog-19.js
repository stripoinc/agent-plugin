
export default {
["spacerBlock.type"]: {
  "required": true,
  "type": "string",
  "const": "spacer",
  "schemaHash": "9d4f33effe2b9b036dc301ee73725cfc1625ab329ab8fde450e2715b8c812164"
},
["spacerBlock.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "26fab8170f8ad11360bc9dc96857e6a7dd0cfe6a3b0fcd68ffdc2cc5f3e9bbe9"
},
["spacerBlock.settings.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "line",
    "space"
  ],
  "schemaHash": "07f9770e97b1b279bf5da42e0850f18c63ade40a67d45f2b8a7186a743be3dcf"
},
["spacerBlock.settings.width"]: {
  "required": false,
  "type": "object",
  "schemaHash": "0d0acdc7319eef3e0cee7438501389df831f35627368feec21505c812033706e"
},
["spacerBlock.settings.width.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "153f2c944860bdccb7e8821d4f9d9dd97bf55ae1ee21e837ad8d00f1fc857fd4"
},
["spacerBlock.settings.width.desktop.value"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "4b67692ce872706ad410b2f24d823889659cfc9fd6e76eb4858a8f4296af7abf"
},
["spacerBlock.settings.width.desktop.unit"]: {
  "required": true,
  "type": "string",
  "enum": [
    "percent",
    "px"
  ],
  "schemaHash": "b84407bfa9f1b636e542b53f31222fc37c430b176a80163697f82db706fb5134"
},
["spacerBlock.settings.width.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "8031b991a1a7753c209020cc13da6518133f7412480c0543d3bd1b344c0a9ff0"
},
["spacerBlock.settings.width.mobile.value"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "4b67692ce872706ad410b2f24d823889659cfc9fd6e76eb4858a8f4296af7abf"
},
["spacerBlock.settings.width.mobile.unit"]: {
  "required": true,
  "type": "string",
  "enum": [
    "percent",
    "px"
  ],
  "schemaHash": "b84407bfa9f1b636e542b53f31222fc37c430b176a80163697f82db706fb5134"
},
["spacerBlock.settings.height"]: {
  "required": false,
  "type": "object",
  "schemaHash": "ab963238e532d7ed6336aff24bc3c7cd2d072f3e28423b347029a56f94d064e2"
},
["spacerBlock.settings.height.desktop"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "d4ef91b875c2cf2be938dafbc028f627d93034c1a975c51b6b940fcb4b8cd6f2"
},
["spacerBlock.settings.height.mobile"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "6329eaefb6ca8e765099b97f056380082b70ca25b205cc00e339b996453b98ab"
},
["spacerBlock.settings.border"]: {
  "required": false,
  "type": "object",
  "schemaHash": "f75f664ccddf5f7f5cb8a2d87193bd9884c654fc99087ea319dc621665464929"
},
["spacerBlock.settings.border.size"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "8bc2ebf055a0c118998eb1843ec0ae37be7f9073d5a30f29b62a9369cd77860e"
},
["spacerBlock.settings.border.style"]: {
  "required": true,
  "type": "string",
  "enum": [
    "solid",
    "dashed",
    "dotted"
  ],
  "schemaHash": "6b87aae70f3438944f91a6bbce41c69a57c2fb978c696f801c2a12b5dea717de"
},
["spacerBlock.settings.border.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["spacerBlock.settings.mobileBorder"]: {
  "required": false,
  "schemaHash": "d8e6815c12a1c05383ef2329e695bd9861b695a463a95ffea2ab8e9673503ead"
},
["spacerBlock.settings.mobileBorder|0"]: {
  "required": false,
  "type": "object",
  "schemaHash": "baa1b4066517d3e9574818e0c12d1ec7338da69550b498fe5f5cb8f82b7eced3"
},
["spacerBlock.settings.mobileBorder|0.size"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "8bc2ebf055a0c118998eb1843ec0ae37be7f9073d5a30f29b62a9369cd77860e"
},
["spacerBlock.settings.mobileBorder|0.style"]: {
  "required": true,
  "type": "string",
  "enum": [
    "solid",
    "dashed",
    "dotted"
  ],
  "schemaHash": "6b87aae70f3438944f91a6bbce41c69a57c2fb978c696f801c2a12b5dea717de"
},
["spacerBlock.settings.mobileBorder|0.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["spacerBlock.settings.mobileBorder|1"]: {
  "required": false,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["spacerBlock.settings.alignment"]: {
  "required": false,
  "type": "object",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["spacerBlock.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["spacerBlock.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["spacerBlock.settings.backgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["spacerBlock.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "3e5eee7308d3622a69d9eb605084a10fb4c0ebf8c2e7674279cea5fe431db47c"
},
["spacerBlock.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "e31d20feaf228b124f55b5ecfa2335a60c09a3da9120dca60b35d0de9dae56dc"
},
["spacerBlock.settings.margins.desktop.top"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "ba949aff5ae5ee83d62cb030597ef18aabdeb64285dbe1467e369987243cb99e"
},
["spacerBlock.settings.margins.desktop.right"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "83ecd61a2d2909a24e4a28d144bf25eca937b7af66ae42ba3ea7b83feaf70a98"
},
["spacerBlock.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "5a7f7e6ab6991ebe9f113ccb0fa51d9c81958cca42aeb1d94a3e1fcba7d373c7"
},
["spacerBlock.settings.margins.desktop.left"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "93806dde06fa7a2c94661a4ccd1cc773f6d6e106276a560158186336f8544f52"
},
["spacerBlock.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "e31d20feaf228b124f55b5ecfa2335a60c09a3da9120dca60b35d0de9dae56dc"
},
["spacerBlock.settings.margins.mobile.top"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "ba949aff5ae5ee83d62cb030597ef18aabdeb64285dbe1467e369987243cb99e"
},
["spacerBlock.settings.margins.mobile.right"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "83ecd61a2d2909a24e4a28d144bf25eca937b7af66ae42ba3ea7b83feaf70a98"
},
["spacerBlock.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "5a7f7e6ab6991ebe9f113ccb0fa51d9c81958cca42aeb1d94a3e1fcba7d373c7"
},
["spacerBlock.settings.margins.mobile.left"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "93806dde06fa7a2c94661a4ccd1cc773f6d6e106276a560158186336f8544f52"
},
["spacerBlock.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c59c64cc82659b3f4d98141fc48d64d75303e9682323d902d0767caca9a19c31"
},
["spacerBlock.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["spacerBlock.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["menuBlock"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "e8033e49d0f9021a34dc1062c1a7f3d6a25c68be2cb9d2a874ba96ddef6a0d7e"
},
["menuBlock.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "987f44fff38a9fcd62e353101b3823e640287645499d853d1e4a670f7d80776d"
},
["menuBlock.type"]: {
  "required": true,
  "type": "string",
  "const": "menu",
  "schemaHash": "637652109513c6cbee0c3e5dc4d9ef1604f726b0eae8cc135b32d89ba39a2b89"
},
["menuBlock.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a18d7ff8e9979d09f4d62fc0313d044e232d7012d0a49094b36c1d6922d175db"
},
["menuBlock.settings.responsiveMenu"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "258e2bc002695b4d5327b9abd421767c9e6d97f13bac76cfa47ce4edd6ed2218"
},
["menuBlock.settings.itemType"]: {
  "required": true,
  "schemaHash": "c20d05644774083c0f77f06cdfa0dc43739e588171b713618a04207aba3140fd"
},
["menuBlock.settings.itemType|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b076da2f23f288fbed7fc62a013f68f6111279a3b3c96e561dbb01f147fa283b"
},
["menuBlock.settings.itemType|0.mode"]: {
  "required": true,
  "type": "string",
  "const": "shared",
  "schemaHash": "1fbcfb8821f7f57078257deae4d212f4434a2837c86343c1d8870461a34ad008"
},
["menuBlock.settings.itemType|0.type"]: {
  "required": true,
  "type": "string",
  "enum": [
    "links",
    "icons",
    "linksWithIcons"
  ],
  "schemaHash": "a6306d5fe6442b041d1c98f1191744e401fe9fc12d8f8ad7a9d5a8dc54171a38"
},
["menuBlock.settings.itemType|1"]: {
  "required": true,
  "type": "object",
  "schemaHash": "1d3d888ccbcd1037f232b9d8090319f42e4c5eaad0db37e55fbd7c9536226df9"
},
["menuBlock.settings.itemType|1.mode"]: {
  "required": true,
  "type": "string",
  "const": "perItem",
  "schemaHash": "02933c27236a2ea9f68a8b22ac63f9963ca588343255322ad23f6472edb02128"
},
["menuBlock.settings.fitToContainer"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "5b279184e9835bc3e8b361d8c8305d63cec763221dda4971183b0a4299972386"
},
["menuBlock.settings.itemPadding"]: {
  "required": true,
  "type": "object",
  "schemaHash": "424c8b880bc06a8962a1f64241384bcb4af1e3747dfdf3ca4894d4e4c0cafbf8"
},
["menuBlock.settings.itemPadding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ab15e46494490e83a081f6e0baa4e145cc536dbab5e67bc6602bccc08ef22187"
},
["menuBlock.settings.itemPadding.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["menuBlock.settings.itemPadding.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["menuBlock.settings.itemPadding.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["menuBlock.settings.itemPadding.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["menuBlock.settings.itemPadding.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ab15e46494490e83a081f6e0baa4e145cc536dbab5e67bc6602bccc08ef22187"
},
["menuBlock.settings.itemPadding.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["menuBlock.settings.itemPadding.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["menuBlock.settings.itemPadding.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["menuBlock.settings.itemPadding.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["menuBlock.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "424c8b880bc06a8962a1f64241384bcb4af1e3747dfdf3ca4894d4e4c0cafbf8"
},
["menuBlock.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ab15e46494490e83a081f6e0baa4e145cc536dbab5e67bc6602bccc08ef22187"
},
["menuBlock.settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["menuBlock.settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["menuBlock.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["menuBlock.settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["menuBlock.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ab15e46494490e83a081f6e0baa4e145cc536dbab5e67bc6602bccc08ef22187"
},
["menuBlock.settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["menuBlock.settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["menuBlock.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["menuBlock.settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["menuBlock.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c59c64cc82659b3f4d98141fc48d64d75303e9682323d902d0767caca9a19c31"
},
["menuBlock.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["menuBlock.settings.separator"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b3cb813276ec28b48bed4550a177fb109d6400f8e1242cf5517a6666e81d996e"
},
["menuBlock.settings.separator.width"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "0921a8e76f389dc7d08580a195f53d15f075b462e36e89f2d649594adc5007ed"
},
["menuBlock.settings.separator.style"]: {
  "required": true,
  "type": "string",
  "enum": [
    "none",
    "line",
    "dashed",
    "dotted"
  ],
  "schemaHash": "04aab43d56e72e18b3288884e5f8bcc4040d0027920f86649923a5f3b3751af1"
},
["menuBlock.settings.separator.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["menuBlock.settings.fontFamily"]: {
  "required": true,
  "type": "string",
  "schemaHash": "78035a700913e51bf0090fc676344739af2d24e9b225273c8da3c117f1254168"
},
["menuBlock.settings.fontSize"]: {
  "required": true,
  "type": "object",
  "schemaHash": "53415842ab6e3e1d40d9834d7380b3b174ceafe86078d8be32cc742f9831a34e"
},
["menuBlock.settings.fontSize.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "80304402b75f89ccbbb32dc24b6aff8ad83cc5d733a182d752f507c5553c3b3e"
},
["menuBlock.settings.fontSize.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "032fa92b76ca7c5881e6acbc05fa44b2a70d438a23ad393c3676dba8b99fef26"
},
["menuBlock.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["menuBlock.settings.textStyle"]: {
  "required": true,
  "type": "object",
  "schemaHash": "097867f06168ff20676d7e496ad6c1f778fa8254e52cc247c4190619123aa7f4"
},
["menuBlock.settings.textStyle.bold"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "4622d6cc98183ddb84605c0dbb8fcb3fe4026fe6e3ffe14f86a80834f911c24b"
},
["menuBlock.settings.textStyle.italic"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "8e43c016953f2915ee5f9f070fddec6e2d87062815e4ff0f35ae790c8e38d785"
},
["menuBlock.settings.colors"]: {
  "required": true,
  "schemaHash": "37c278bba54aa91fc6da77acdb75cf92bc457dc432668d2d8172f0a632a6ed88"
},
["menuBlock.settings.colors|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "5416d6de635a80a43a160d01f44dad7c972d14d5772dbbbf659528157b78ac19"
},
["menuBlock.settings.colors|0.mode"]: {
  "required": true,
  "type": "string",
  "const": "shared",
  "schemaHash": "1fbcfb8821f7f57078257deae4d212f4434a2837c86343c1d8870461a34ad008"
},
["menuBlock.settings.colors|0.link"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["menuBlock.settings.colors|1"]: {
  "required": true,
  "type": "object",
  "schemaHash": "0f745e2518c1ca692813ee55636d008ba021361f22aa88b3853f80060bb190af"
},
["menuBlock.settings.colors|1.mode"]: {
  "required": true,
  "type": "string",
  "const": "perItem",
  "schemaHash": "02933c27236a2ea9f68a8b22ac63f9963ca588343255322ad23f6472edb02128"
},
["menuBlock.settings.items"]: {
  "required": true,
  "type": "array",
  "schemaHash": "fe6bb182b452b7635fb96db632fb78c84f645e0b23cb2cbfa91c6704efb54358"
},
["menuBlock.settings.items[]"]: {
  "required": true,
  "type": "object",
  "schemaHash": "2bd23c3d0ad27b8338568ddbe8ad78cfe8eed8d2a56f7536af3ad4ed8c66c3af"
},
["menuBlock.settings.items[].type"]: {
  "required": false,
  "type": "string",
  "enum": [
    "links",
    "icons",
    "linksWithIcons"
  ],
  "schemaHash": "e176716081727d356ee723bc3404dcf5d9468367fffaa90a7670d5a580e754f2"
},
["menuBlock.settings.items[].name"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9ec4ce52e820681b1289a56c658086a3e9230298e9dd7dfa287c6392d4d4c135"
},
["menuBlock.settings.items[].link"]: {
  "required": true,
  "type": "object",
  "schemaHash": "03ceeef39336e46ff66013e831b48bf162860eb1449e7a4c028f71778426b0fe"
},
["menuBlock.settings.items[].link.type"]: {
  "required": true,
  "type": "string",
  "enum": [
    "site",
    "email",
    "phone",
    "anchor"
  ],
  "schemaHash": "e633ec0ac2a67e5c27011eb42a60a15152c225cf49621418c6ed7a0a89c9903f"
},
["menuBlock.settings.items[].link.value"]: {
  "required": true,
  "type": "string",
  "schemaHash": "8a81a5c513461d5d8534067a1bf32236034dffcbe2b8d13babf92714febabf6f"
},
["menuBlock.settings.items[].image"]: {
  "required": false,
  "type": "object",
  "schemaHash": "a3049eb948cd2442f383a70aa8b7fa5a724394898101edebf8848c4d1ad820a8"
},
["menuBlock.settings.items[].image.src"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b28f78a889310be49835099cb1f1827e2beb4e4fdcd2148fb37b729ceeb87084"
},
["menuBlock.settings.items[].image.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "bc243feabbb0415d6d54a4bc9f58c1b4a7d19d96677b86f37eddc547dca403ee"
},
["menuBlock.settings.items[].image.size.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "50af508b096b217143c7db8b499808ab3f857c0874a91e803fbdf689f80b23b6"
},
["menuBlock.settings.items[].image.size.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "b061442e44206d675cf7875e3503d7e8be9c03beef0aa104600cf5a3c4beb93e"
},
["menuBlock.settings.items[].image.alignment"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "62abdcc2c56bdf3f241c1c7a30b1ddecea459292e841ed6531bce0659329661d"
},
["menuBlock.settings.items[].image.indent"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "2d001cc3e51211d1913ef6d98aa431eb29dd5351aa6dc67f77f75a97a8a13285"
},
["menuBlock.settings.items[].image.altText"]: {
  "required": true,
  "type": "string",
  "schemaHash": "8ec6f1f96b0ab15c7e353f5de46badff477995efa88b0ae8c4dbedceb058653a"
},
["menuBlock.settings.items[].hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["menuBlock.settings.items[].colors"]: {
  "required": false,
  "type": "object",
  "schemaHash": "0d24cb6ed26a629460d9b14c4fe5ac88712cda45809cb264ef752809c0bf0dde"
},
["menuBlock.settings.items[].colors.link"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["menuBlock.settings.items[].colors.background"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["unknownBlock"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "ba42dd9f491fabd38e24b0a5c12a058403cebb1509deb3d650e1bce26a6d4913"
},
["unknownBlock.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "987f44fff38a9fcd62e353101b3823e640287645499d853d1e4a670f7d80776d"
},
["unknownBlock.type"]: {
  "required": true,
  "type": "string",
  "const": "unknown",
  "schemaHash": "45efa89ab4e28a09898565634f4734cbd5168c9f477a3ba376e6bffdd98bf1d7"
},
["unknownBlock.settings"]: {
  "required": false,
  "type": "object",
  "schemaHash": "3b2717c5fefe666dcb4421b8b66fa42db96ae03042b08732cd1b298318cdc300"
},
["unknownBlock.content"]: {
  "required": true,
  "type": "string",
  "schemaHash": "ef03ba765c158a011bfa9cbddf997af051446505bb1f039d2daababb7390ef0c"
},
["unknownBlock.extension"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "70b148906c066e204257904b506ca35b8f1a1332060cfdd5f65f768926f82e7b"
}
};

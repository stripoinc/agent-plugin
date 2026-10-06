
export default {
["container.blocks[]|7.type"]: {
  "required": true,
  "type": "string",
  "const": "spacer",
  "schemaHash": "9d4f33effe2b9b036dc301ee73725cfc1625ab329ab8fde450e2715b8c812164"
},
["container.blocks[]|7.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "26fab8170f8ad11360bc9dc96857e6a7dd0cfe6a3b0fcd68ffdc2cc5f3e9bbe9"
},
["container.blocks[]|7.settings.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "line",
    "space"
  ],
  "schemaHash": "07f9770e97b1b279bf5da42e0850f18c63ade40a67d45f2b8a7186a743be3dcf"
},
["container.blocks[]|7.settings.width"]: {
  "required": false,
  "type": "object",
  "schemaHash": "0d0acdc7319eef3e0cee7438501389df831f35627368feec21505c812033706e"
},
["container.blocks[]|7.settings.width.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "153f2c944860bdccb7e8821d4f9d9dd97bf55ae1ee21e837ad8d00f1fc857fd4"
},
["container.blocks[]|7.settings.width.desktop.value"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "4b67692ce872706ad410b2f24d823889659cfc9fd6e76eb4858a8f4296af7abf"
},
["container.blocks[]|7.settings.width.desktop.unit"]: {
  "required": true,
  "type": "string",
  "enum": [
    "percent",
    "px"
  ],
  "schemaHash": "b84407bfa9f1b636e542b53f31222fc37c430b176a80163697f82db706fb5134"
},
["container.blocks[]|7.settings.width.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "8031b991a1a7753c209020cc13da6518133f7412480c0543d3bd1b344c0a9ff0"
},
["container.blocks[]|7.settings.width.mobile.value"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "4b67692ce872706ad410b2f24d823889659cfc9fd6e76eb4858a8f4296af7abf"
},
["container.blocks[]|7.settings.width.mobile.unit"]: {
  "required": true,
  "type": "string",
  "enum": [
    "percent",
    "px"
  ],
  "schemaHash": "b84407bfa9f1b636e542b53f31222fc37c430b176a80163697f82db706fb5134"
},
["container.blocks[]|7.settings.height"]: {
  "required": false,
  "type": "object",
  "schemaHash": "ab963238e532d7ed6336aff24bc3c7cd2d072f3e28423b347029a56f94d064e2"
},
["container.blocks[]|7.settings.height.desktop"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "d4ef91b875c2cf2be938dafbc028f627d93034c1a975c51b6b940fcb4b8cd6f2"
},
["container.blocks[]|7.settings.height.mobile"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "6329eaefb6ca8e765099b97f056380082b70ca25b205cc00e339b996453b98ab"
},
["container.blocks[]|7.settings.border"]: {
  "required": false,
  "type": "object",
  "schemaHash": "f75f664ccddf5f7f5cb8a2d87193bd9884c654fc99087ea319dc621665464929"
},
["container.blocks[]|7.settings.border.size"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "8bc2ebf055a0c118998eb1843ec0ae37be7f9073d5a30f29b62a9369cd77860e"
},
["container.blocks[]|7.settings.border.style"]: {
  "required": true,
  "type": "string",
  "enum": [
    "solid",
    "dashed",
    "dotted"
  ],
  "schemaHash": "6b87aae70f3438944f91a6bbce41c69a57c2fb978c696f801c2a12b5dea717de"
},
["container.blocks[]|7.settings.border.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["container.blocks[]|7.settings.mobileBorder"]: {
  "required": false,
  "schemaHash": "d8e6815c12a1c05383ef2329e695bd9861b695a463a95ffea2ab8e9673503ead"
},
["container.blocks[]|7.settings.mobileBorder|0"]: {
  "required": false,
  "type": "object",
  "schemaHash": "baa1b4066517d3e9574818e0c12d1ec7338da69550b498fe5f5cb8f82b7eced3"
},
["container.blocks[]|7.settings.mobileBorder|0.size"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "8bc2ebf055a0c118998eb1843ec0ae37be7f9073d5a30f29b62a9369cd77860e"
},
["container.blocks[]|7.settings.mobileBorder|0.style"]: {
  "required": true,
  "type": "string",
  "enum": [
    "solid",
    "dashed",
    "dotted"
  ],
  "schemaHash": "6b87aae70f3438944f91a6bbce41c69a57c2fb978c696f801c2a12b5dea717de"
},
["container.blocks[]|7.settings.mobileBorder|0.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["container.blocks[]|7.settings.mobileBorder|1"]: {
  "required": false,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["container.blocks[]|7.settings.alignment"]: {
  "required": false,
  "type": "object",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["container.blocks[]|7.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["container.blocks[]|7.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["container.blocks[]|7.settings.backgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["container.blocks[]|7.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "3e5eee7308d3622a69d9eb605084a10fb4c0ebf8c2e7674279cea5fe431db47c"
},
["container.blocks[]|7.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "e31d20feaf228b124f55b5ecfa2335a60c09a3da9120dca60b35d0de9dae56dc"
},
["container.blocks[]|7.settings.margins.desktop.top"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "ba949aff5ae5ee83d62cb030597ef18aabdeb64285dbe1467e369987243cb99e"
},
["container.blocks[]|7.settings.margins.desktop.right"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "83ecd61a2d2909a24e4a28d144bf25eca937b7af66ae42ba3ea7b83feaf70a98"
},
["container.blocks[]|7.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "5a7f7e6ab6991ebe9f113ccb0fa51d9c81958cca42aeb1d94a3e1fcba7d373c7"
},
["container.blocks[]|7.settings.margins.desktop.left"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "93806dde06fa7a2c94661a4ccd1cc773f6d6e106276a560158186336f8544f52"
},
["container.blocks[]|7.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "e31d20feaf228b124f55b5ecfa2335a60c09a3da9120dca60b35d0de9dae56dc"
},
["container.blocks[]|7.settings.margins.mobile.top"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "ba949aff5ae5ee83d62cb030597ef18aabdeb64285dbe1467e369987243cb99e"
},
["container.blocks[]|7.settings.margins.mobile.right"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "83ecd61a2d2909a24e4a28d144bf25eca937b7af66ae42ba3ea7b83feaf70a98"
},
["container.blocks[]|7.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "5a7f7e6ab6991ebe9f113ccb0fa51d9c81958cca42aeb1d94a3e1fcba7d373c7"
},
["container.blocks[]|7.settings.margins.mobile.left"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "93806dde06fa7a2c94661a4ccd1cc773f6d6e106276a560158186336f8544f52"
},
["container.blocks[]|7.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c59c64cc82659b3f4d98141fc48d64d75303e9682323d902d0767caca9a19c31"
},
["container.blocks[]|7.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["container.blocks[]|7.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["container.blocks[]|8"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "973f2b26c120a6f9d27fa11bac95a01346dbf7d612e8387590de255a632b6129"
},
["container.blocks[]|8.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "987f44fff38a9fcd62e353101b3823e640287645499d853d1e4a670f7d80776d"
},
["container.blocks[]|8.type"]: {
  "required": true,
  "type": "string",
  "const": "menu",
  "schemaHash": "637652109513c6cbee0c3e5dc4d9ef1604f726b0eae8cc135b32d89ba39a2b89"
},
["container.blocks[]|8.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a18d7ff8e9979d09f4d62fc0313d044e232d7012d0a49094b36c1d6922d175db"
},
["container.blocks[]|8.settings.responsiveMenu"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "258e2bc002695b4d5327b9abd421767c9e6d97f13bac76cfa47ce4edd6ed2218"
},
["container.blocks[]|8.settings.itemType"]: {
  "required": true,
  "schemaHash": "c20d05644774083c0f77f06cdfa0dc43739e588171b713618a04207aba3140fd"
},
["container.blocks[]|8.settings.itemType|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b076da2f23f288fbed7fc62a013f68f6111279a3b3c96e561dbb01f147fa283b"
},
["container.blocks[]|8.settings.itemType|0.mode"]: {
  "required": true,
  "type": "string",
  "const": "shared",
  "schemaHash": "1fbcfb8821f7f57078257deae4d212f4434a2837c86343c1d8870461a34ad008"
},
["container.blocks[]|8.settings.itemType|0.type"]: {
  "required": true,
  "type": "string",
  "enum": [
    "links",
    "icons",
    "linksWithIcons"
  ],
  "schemaHash": "a6306d5fe6442b041d1c98f1191744e401fe9fc12d8f8ad7a9d5a8dc54171a38"
},
["container.blocks[]|8.settings.itemType|1"]: {
  "required": true,
  "type": "object",
  "schemaHash": "1d3d888ccbcd1037f232b9d8090319f42e4c5eaad0db37e55fbd7c9536226df9"
},
["container.blocks[]|8.settings.itemType|1.mode"]: {
  "required": true,
  "type": "string",
  "const": "perItem",
  "schemaHash": "02933c27236a2ea9f68a8b22ac63f9963ca588343255322ad23f6472edb02128"
},
["container.blocks[]|8.settings.fitToContainer"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "5b279184e9835bc3e8b361d8c8305d63cec763221dda4971183b0a4299972386"
},
["container.blocks[]|8.settings.itemPadding"]: {
  "required": true,
  "type": "object",
  "schemaHash": "424c8b880bc06a8962a1f64241384bcb4af1e3747dfdf3ca4894d4e4c0cafbf8"
},
["container.blocks[]|8.settings.itemPadding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ab15e46494490e83a081f6e0baa4e145cc536dbab5e67bc6602bccc08ef22187"
},
["container.blocks[]|8.settings.itemPadding.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["container.blocks[]|8.settings.itemPadding.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["container.blocks[]|8.settings.itemPadding.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["container.blocks[]|8.settings.itemPadding.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["container.blocks[]|8.settings.itemPadding.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ab15e46494490e83a081f6e0baa4e145cc536dbab5e67bc6602bccc08ef22187"
},
["container.blocks[]|8.settings.itemPadding.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["container.blocks[]|8.settings.itemPadding.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["container.blocks[]|8.settings.itemPadding.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["container.blocks[]|8.settings.itemPadding.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["container.blocks[]|8.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "424c8b880bc06a8962a1f64241384bcb4af1e3747dfdf3ca4894d4e4c0cafbf8"
},
["container.blocks[]|8.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ab15e46494490e83a081f6e0baa4e145cc536dbab5e67bc6602bccc08ef22187"
},
["container.blocks[]|8.settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["container.blocks[]|8.settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["container.blocks[]|8.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["container.blocks[]|8.settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["container.blocks[]|8.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ab15e46494490e83a081f6e0baa4e145cc536dbab5e67bc6602bccc08ef22187"
},
["container.blocks[]|8.settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["container.blocks[]|8.settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["container.blocks[]|8.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["container.blocks[]|8.settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["container.blocks[]|8.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c59c64cc82659b3f4d98141fc48d64d75303e9682323d902d0767caca9a19c31"
},
["container.blocks[]|8.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["container.blocks[]|8.settings.separator"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b3cb813276ec28b48bed4550a177fb109d6400f8e1242cf5517a6666e81d996e"
},
["container.blocks[]|8.settings.separator.width"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "0921a8e76f389dc7d08580a195f53d15f075b462e36e89f2d649594adc5007ed"
},
["container.blocks[]|8.settings.separator.style"]: {
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
["container.blocks[]|8.settings.separator.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["container.blocks[]|8.settings.fontFamily"]: {
  "required": true,
  "type": "string",
  "schemaHash": "78035a700913e51bf0090fc676344739af2d24e9b225273c8da3c117f1254168"
},
["container.blocks[]|8.settings.fontSize"]: {
  "required": true,
  "type": "object",
  "schemaHash": "53415842ab6e3e1d40d9834d7380b3b174ceafe86078d8be32cc742f9831a34e"
},
["container.blocks[]|8.settings.fontSize.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "80304402b75f89ccbbb32dc24b6aff8ad83cc5d733a182d752f507c5553c3b3e"
},
["container.blocks[]|8.settings.fontSize.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "032fa92b76ca7c5881e6acbc05fa44b2a70d438a23ad393c3676dba8b99fef26"
},
["container.blocks[]|8.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["container.blocks[]|8.settings.textStyle"]: {
  "required": true,
  "type": "object",
  "schemaHash": "097867f06168ff20676d7e496ad6c1f778fa8254e52cc247c4190619123aa7f4"
},
["container.blocks[]|8.settings.textStyle.bold"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "4622d6cc98183ddb84605c0dbb8fcb3fe4026fe6e3ffe14f86a80834f911c24b"
},
["container.blocks[]|8.settings.textStyle.italic"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "8e43c016953f2915ee5f9f070fddec6e2d87062815e4ff0f35ae790c8e38d785"
},
["container.blocks[]|8.settings.colors"]: {
  "required": true,
  "schemaHash": "37c278bba54aa91fc6da77acdb75cf92bc457dc432668d2d8172f0a632a6ed88"
},
["container.blocks[]|8.settings.colors|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "5416d6de635a80a43a160d01f44dad7c972d14d5772dbbbf659528157b78ac19"
},
["container.blocks[]|8.settings.colors|0.mode"]: {
  "required": true,
  "type": "string",
  "const": "shared",
  "schemaHash": "1fbcfb8821f7f57078257deae4d212f4434a2837c86343c1d8870461a34ad008"
},
["container.blocks[]|8.settings.colors|0.link"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["container.blocks[]|8.settings.colors|1"]: {
  "required": true,
  "type": "object",
  "schemaHash": "0f745e2518c1ca692813ee55636d008ba021361f22aa88b3853f80060bb190af"
},
["container.blocks[]|8.settings.colors|1.mode"]: {
  "required": true,
  "type": "string",
  "const": "perItem",
  "schemaHash": "02933c27236a2ea9f68a8b22ac63f9963ca588343255322ad23f6472edb02128"
},
["container.blocks[]|8.settings.items"]: {
  "required": true,
  "type": "array",
  "schemaHash": "fe6bb182b452b7635fb96db632fb78c84f645e0b23cb2cbfa91c6704efb54358"
},
["container.blocks[]|8.settings.items[]"]: {
  "required": true,
  "type": "object",
  "schemaHash": "2bd23c3d0ad27b8338568ddbe8ad78cfe8eed8d2a56f7536af3ad4ed8c66c3af"
},
["container.blocks[]|8.settings.items[].type"]: {
  "required": false,
  "type": "string",
  "enum": [
    "links",
    "icons",
    "linksWithIcons"
  ],
  "schemaHash": "e176716081727d356ee723bc3404dcf5d9468367fffaa90a7670d5a580e754f2"
},
["container.blocks[]|8.settings.items[].name"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9ec4ce52e820681b1289a56c658086a3e9230298e9dd7dfa287c6392d4d4c135"
},
["container.blocks[]|8.settings.items[].link"]: {
  "required": true,
  "type": "object",
  "schemaHash": "03ceeef39336e46ff66013e831b48bf162860eb1449e7a4c028f71778426b0fe"
},
["container.blocks[]|8.settings.items[].link.type"]: {
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
["container.blocks[]|8.settings.items[].link.value"]: {
  "required": true,
  "type": "string",
  "schemaHash": "8a81a5c513461d5d8534067a1bf32236034dffcbe2b8d13babf92714febabf6f"
},
["container.blocks[]|8.settings.items[].image"]: {
  "required": false,
  "type": "object",
  "schemaHash": "a3049eb948cd2442f383a70aa8b7fa5a724394898101edebf8848c4d1ad820a8"
},
["container.blocks[]|8.settings.items[].image.src"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b28f78a889310be49835099cb1f1827e2beb4e4fdcd2148fb37b729ceeb87084"
},
["container.blocks[]|8.settings.items[].image.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "bc243feabbb0415d6d54a4bc9f58c1b4a7d19d96677b86f37eddc547dca403ee"
},
["container.blocks[]|8.settings.items[].image.size.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "50af508b096b217143c7db8b499808ab3f857c0874a91e803fbdf689f80b23b6"
},
["container.blocks[]|8.settings.items[].image.size.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "b061442e44206d675cf7875e3503d7e8be9c03beef0aa104600cf5a3c4beb93e"
},
["container.blocks[]|8.settings.items[].image.alignment"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "62abdcc2c56bdf3f241c1c7a30b1ddecea459292e841ed6531bce0659329661d"
},
["container.blocks[]|8.settings.items[].image.indent"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "2d001cc3e51211d1913ef6d98aa431eb29dd5351aa6dc67f77f75a97a8a13285"
},
["container.blocks[]|8.settings.items[].image.altText"]: {
  "required": true,
  "type": "string",
  "schemaHash": "8ec6f1f96b0ab15c7e353f5de46badff477995efa88b0ae8c4dbedceb058653a"
},
["container.blocks[]|8.settings.items[].hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["container.blocks[]|8.settings.items[].colors"]: {
  "required": false,
  "type": "object",
  "schemaHash": "0d24cb6ed26a629460d9b14c4fe5ac88712cda45809cb264ef752809c0bf0dde"
},
["container.blocks[]|8.settings.items[].colors.link"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["container.blocks[]|8.settings.items[].colors.background"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["container.blocks[]|9"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "2af42dc48d0a803fd38c843cb4bf3e3ed5a814199af6b2c15f201cf4a34d9557"
},
["container.blocks[]|9.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "987f44fff38a9fcd62e353101b3823e640287645499d853d1e4a670f7d80776d"
},
["container.blocks[]|9.type"]: {
  "required": true,
  "type": "string",
  "const": "unknown",
  "schemaHash": "45efa89ab4e28a09898565634f4734cbd5168c9f477a3ba376e6bffdd98bf1d7"
},
["container.blocks[]|9.settings"]: {
  "required": false,
  "type": "object",
  "schemaHash": "3b2717c5fefe666dcb4421b8b66fa42db96ae03042b08732cd1b298318cdc300"
},
["container.blocks[]|9.content"]: {
  "required": true,
  "type": "string",
  "schemaHash": "ef03ba765c158a011bfa9cbddf997af051446505bb1f039d2daababb7390ef0c"
},
["container.blocks[]|9.extension"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "70b148906c066e204257904b506ca35b8f1a1332060cfdd5f65f768926f82e7b"
},
["textBlock"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "e80aae6d25df8b6e7bd6ff16228ff5eeb5dbc2bfdb692164c56be705c26f6315"
},
["textBlock.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "987f44fff38a9fcd62e353101b3823e640287645499d853d1e4a670f7d80776d"
},
["textBlock.type"]: {
  "required": true,
  "type": "string",
  "const": "text",
  "schemaHash": "cc22f8ec14817471274ae0fddcdc70ee916ee0e4e058c2adf4ccefed5b83163f"
},
["textBlock.settings"]: {
  "required": false,
  "type": "object",
  "schemaHash": "796892a0a67d7975ad6b69e46842aed905ee794b205e0c0f6e0841569314f221"
},
["textBlock.settings.fontColor"]: {
  "required": false,
  "type": "string",
  "schemaHash": "b61b2b9f199526eb3295f9e2ced901958e0497a6c2750820f57bee70b1158827"
},
["textBlock.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["textBlock.settings.rightToLeftTextDirection"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["textBlock.settings.alignment"]: {
  "required": false,
  "type": "object",
  "schemaHash": "33fb0a82c6cdbd2ecde9ae2b5b6c12efe76921b42baa0b9c6449d8591e9b3944"
},
["textBlock.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right",
    "justify"
  ],
  "schemaHash": "fa375d8d3921bf6853043c6e3e9230051e2eb38d8de4a20ed66b4198059036f5"
},
["textBlock.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right",
    "justify"
  ],
  "schemaHash": "fa375d8d3921bf6853043c6e3e9230051e2eb38d8de4a20ed66b4198059036f5"
},
["textBlock.settings.fixedHeight"]: {
  "required": false,
  "type": "object",
  "schemaHash": "b46d2a654ee1874c1cc2d636d4e4786dc32c1f15ae0cc77c3eebc5883ed11be8"
},
["textBlock.settings.fixedHeight.desktop"]: {
  "required": false,
  "type": "object",
  "schemaHash": "8ae8bf286545f6c3b1f6f73573264a9f61fa09fb6bfa2447aa5ce9bb8617ab6f"
},
["textBlock.settings.fixedHeight.desktop.height"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "a4475867ad83c5cd99c199dfddf0b8e799ebe5f636bf765a2f4ec2d69e7ead09"
},
["textBlock.settings.fixedHeight.desktop.verticalAlignment"]: {
  "required": false,
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ],
  "schemaHash": "b4b3a153ebf7f9907edcb00945ab363971246387c038cfb94b5a08fffd84a3e8"
},
["textBlock.settings.fixedHeight.mobile"]: {
  "required": false,
  "type": "object",
  "schemaHash": "e930d6bfd7e624cc404d6ac9111b7f5169a3f9e6ccda3f7a9c208027be48f312"
},
["textBlock.settings.fixedHeight.mobile.height"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "a4475867ad83c5cd99c199dfddf0b8e799ebe5f636bf765a2f4ec2d69e7ead09"
},
["textBlock.settings.fixedHeight.mobile.verticalAlignment"]: {
  "required": false,
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ],
  "schemaHash": "b4b3a153ebf7f9907edcb00945ab363971246387c038cfb94b5a08fffd84a3e8"
},
["textBlock.settings.padding"]: {
  "required": true,
  "type": "object",
  "schemaHash": "2fb4ba346d619aa1f724ab26d5dd469a53ac8b687e36c5231e523f34f496aafc"
},
["textBlock.settings.padding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "37536e5cdca2c6a99d26bcca81988a492aa2df1ee3034744cc62643936f6c8ab"
},
["textBlock.settings.padding.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["textBlock.settings.padding.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["textBlock.settings.padding.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["textBlock.settings.padding.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["textBlock.settings.padding.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "37536e5cdca2c6a99d26bcca81988a492aa2df1ee3034744cc62643936f6c8ab"
},
["textBlock.settings.padding.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["textBlock.settings.padding.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["textBlock.settings.padding.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["textBlock.settings.padding.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["textBlock.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["textBlock.settings.backgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["textBlock.settings.letterSpacing"]: {
  "required": false,
  "type": "object",
  "schemaHash": "7b91cafbb4bd70c075dabec2ee8400c032157eb69f2f1c14d94225aed001db05"
},
["textBlock.settings.letterSpacing.value"]: {
  "required": true,
  "type": "number",
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
},
["textBlock.settings.letterSpacing.unit"]: {
  "required": true,
  "type": "string",
  "enum": [
    "px",
    "em"
  ],
  "schemaHash": "35dd650fb6a5f62fe7fc20739ab6b54f5f4aea29f3f5841fc40e61b1e3b89a95"
},
["textBlock.content"]: {
  "required": false,
  "type": "string",
  "schemaHash": "5a6d40dd19c05ee913025262e4a5001671aac6913feb634ce0e68f5f65bf6790"
},
["imageBlock"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "ccd2a1b17243da59ea252a075b546f2cc5225f4d7313384b34e27946a983c663"
},
["imageBlock.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "987f44fff38a9fcd62e353101b3823e640287645499d853d1e4a670f7d80776d"
},
["imageBlock.type"]: {
  "required": true,
  "type": "string",
  "const": "image",
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["imageBlock.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "77491c918f72594148ebce95e4c92d11695538b6f547a6767d2fff890ae7a68a"
},
["imageBlock.settings.src"]: {
  "required": true,
  "type": "string",
  "schemaHash": "efb2498bfd7c3a684731d96285b8c29553f2e46b13fac6d897a5f507ebc3c9ae"
},
["imageBlock.settings.link"]: {
  "required": false,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["imageBlock.settings.link.type"]: {
  "required": true,
  "type": "string",
  "enum": [
    "site",
    "anchor",
    "email",
    "phone",
    "file",
    "sms",
    "telegram",
    "viber",
    "other"
  ],
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["imageBlock.settings.link.href"]: {
  "required": true,
  "type": "string",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["imageBlock.settings.altText"]: {
  "required": true,
  "type": "object",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["imageBlock.settings.altText.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["imageBlock.settings.altText.addToTitle"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "5488d5a30aa799c16d2a2e70182680c408d6b79973e0120c2259b2a142a87363"
},
["imageBlock.settings.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "fc90ddf303f474b1fad5c7baadbf1773f3bb6c2dacaf669c10b0fc256521730f"
},
["imageBlock.settings.size.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["imageBlock.settings.size.desktop.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["imageBlock.settings.size.desktop.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["imageBlock.settings.size.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["imageBlock.settings.size.mobile.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["imageBlock.settings.size.mobile.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["imageBlock.settings.alignment"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ffeb13b7004005b19938145b546d5ceb08d7dcade8822f2213892c866f7cb1fa"
},
["imageBlock.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["imageBlock.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["imageBlock.settings.radius"]: {
  "required": true,
  "type": "object",
  "schemaHash": "341814eb6aff7d91bd84e9006aba1a60303f85af77dc4b114c35299d29ccec79"
},
["imageBlock.settings.radius.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["imageBlock.settings.radius.desktop.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d4ea49530b875e80d3ed20028edc09f574018c4371f79e53656eaeeeadc83699"
},
["imageBlock.settings.radius.desktop.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dd31199631720a98a43b2f0d848983a49cf1c662a61d0aae5eeca7716eb2eeb7"
},
["imageBlock.settings.radius.desktop.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1e4a3971a198b7cbe0dbc8b55521142df63a6f4714a4688bb033dec1d61665d7"
},
["imageBlock.settings.radius.desktop.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "380155b942a4d8b8cd37f1baf475c42f30bf72f300cb6191489845e054b57df4"
},
["imageBlock.settings.radius.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["imageBlock.settings.radius.mobile.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d4ea49530b875e80d3ed20028edc09f574018c4371f79e53656eaeeeadc83699"
},
["imageBlock.settings.radius.mobile.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dd31199631720a98a43b2f0d848983a49cf1c662a61d0aae5eeca7716eb2eeb7"
},
["imageBlock.settings.radius.mobile.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1e4a3971a198b7cbe0dbc8b55521142df63a6f4714a4688bb033dec1d61665d7"
},
["imageBlock.settings.radius.mobile.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "380155b942a4d8b8cd37f1baf475c42f30bf72f300cb6191489845e054b57df4"
},
["imageBlock.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["imageBlock.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "82cdc2e20bff7e777b2055cc1783d43dc19e28df76b38edeb403fbcd81b24d9d"
},
["imageBlock.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a7e49c9de944eb59b182b4170e11f27246a9a6b97991efb30eb44167d8e6e96a"
},
["imageBlock.settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "512befe9ea2fc6099da95661f8b6f26434831be23e431b5670423c8f8cbc163d"
},
["imageBlock.settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a60791c7bd997624175e5ce942b961e03be8caff0688d64714c220d3e3069018"
},
["imageBlock.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f16d2a1c75e4e368c52096f5f392478b7362f12092f61565b2505fc4904bfda5"
},
["imageBlock.settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b462dde7c9edde64ea0ef3b7baa66de119ee6b45e1275970be7d07062ca8e996"
},
["imageBlock.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a7e49c9de944eb59b182b4170e11f27246a9a6b97991efb30eb44167d8e6e96a"
},
["imageBlock.settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "512befe9ea2fc6099da95661f8b6f26434831be23e431b5670423c8f8cbc163d"
},
["imageBlock.settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a60791c7bd997624175e5ce942b961e03be8caff0688d64714c220d3e3069018"
},
["imageBlock.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f16d2a1c75e4e368c52096f5f392478b7362f12092f61565b2505fc4904bfda5"
},
["imageBlock.settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b462dde7c9edde64ea0ef3b7baa66de119ee6b45e1275970be7d07062ca8e996"
},
["imageBlock.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["imageBlock.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c59c64cc82659b3f4d98141fc48d64d75303e9682323d902d0767caca9a19c31"
},
["imageBlock.settings.responsiveMobile"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "3954de1555ee8336646468d5dad24e0136cabe4665ebb85a3b60f14913067a69"
},
["videoBlock"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "39c755b7aba5f69cd92c0a6c89fe74ecf1b0d1c724d676627320f00756cfc4d1"
},
["videoBlock.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "987f44fff38a9fcd62e353101b3823e640287645499d853d1e4a670f7d80776d"
},
["videoBlock.type"]: {
  "required": true,
  "type": "string",
  "const": "video",
  "schemaHash": "0a4857291fe8770b399d2f933a25d2c3f94ec8ec39e68be73d3918997d7f3d7b"
},
["videoBlock.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "3272677b3785aec173d0170f736bbcda85be6fcff62315f9cf5407f812c12a9c"
},
["videoBlock.settings.videoLink"]: {
  "required": true,
  "type": "string",
  "schemaHash": "5c951508c542a492ea27007225a1c8d93656bc868ca3dd23369d2586fcad9b55"
},
["videoBlock.settings.altText"]: {
  "required": true,
  "type": "object",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["videoBlock.settings.altText.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["videoBlock.settings.altText.addToTitle"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "5488d5a30aa799c16d2a2e70182680c408d6b79973e0120c2259b2a142a87363"
},
["videoBlock.settings.customThumbnail"]: {
  "required": false,
  "type": "object",
  "schemaHash": "efd732b80d28c0122ee3a66deffd934c4ce1b8e509136a46f1965cd3af5f03a5"
},
["videoBlock.settings.customThumbnail.src"]: {
  "required": true,
  "type": "string",
  "schemaHash": "8252330452d3e452f1f9e987f5f9fcc0c1563a90eb85bcf1b9a45c227808d935"
},
["videoBlock.settings.playButtonStyle"]: {
  "required": true,
  "type": "string",
  "enum": [
    "NONE",
    "red",
    "white",
    "black",
    "blue",
    "whiteCircle",
    "blackCircle",
    "greyCircle",
    "blackCircleInverse"
  ],
  "schemaHash": "a349091f76fcc6df5d76f39577c2d279d637698d36ed086028c7f8ea197c7493"
},
["videoBlock.settings.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "fc90ddf303f474b1fad5c7baadbf1773f3bb6c2dacaf669c10b0fc256521730f"
},
["videoBlock.settings.size.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["videoBlock.settings.size.desktop.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["videoBlock.settings.size.desktop.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["videoBlock.settings.size.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["videoBlock.settings.size.mobile.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["videoBlock.settings.size.mobile.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["videoBlock.settings.alignment"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ffeb13b7004005b19938145b546d5ceb08d7dcade8822f2213892c866f7cb1fa"
},
["videoBlock.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["videoBlock.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["videoBlock.settings.radius"]: {
  "required": true,
  "type": "object",
  "schemaHash": "341814eb6aff7d91bd84e9006aba1a60303f85af77dc4b114c35299d29ccec79"
},
["videoBlock.settings.radius.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["videoBlock.settings.radius.desktop.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d4ea49530b875e80d3ed20028edc09f574018c4371f79e53656eaeeeadc83699"
},
["videoBlock.settings.radius.desktop.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dd31199631720a98a43b2f0d848983a49cf1c662a61d0aae5eeca7716eb2eeb7"
},
["videoBlock.settings.radius.desktop.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1e4a3971a198b7cbe0dbc8b55521142df63a6f4714a4688bb033dec1d61665d7"
},
["videoBlock.settings.radius.desktop.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "380155b942a4d8b8cd37f1baf475c42f30bf72f300cb6191489845e054b57df4"
},
["videoBlock.settings.radius.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["videoBlock.settings.radius.mobile.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d4ea49530b875e80d3ed20028edc09f574018c4371f79e53656eaeeeadc83699"
},
["videoBlock.settings.radius.mobile.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dd31199631720a98a43b2f0d848983a49cf1c662a61d0aae5eeca7716eb2eeb7"
},
["videoBlock.settings.radius.mobile.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1e4a3971a198b7cbe0dbc8b55521142df63a6f4714a4688bb033dec1d61665d7"
},
["videoBlock.settings.radius.mobile.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "380155b942a4d8b8cd37f1baf475c42f30bf72f300cb6191489845e054b57df4"
},
["videoBlock.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["videoBlock.settings.paddings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "9997efdcca77945c766ad1cbab2d82d5ea2f1aed6bbd59e8c6299bc16c7d33eb"
},
["videoBlock.settings.paddings.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a7e49c9de944eb59b182b4170e11f27246a9a6b97991efb30eb44167d8e6e96a"
},
["videoBlock.settings.paddings.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "512befe9ea2fc6099da95661f8b6f26434831be23e431b5670423c8f8cbc163d"
},
["videoBlock.settings.paddings.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a60791c7bd997624175e5ce942b961e03be8caff0688d64714c220d3e3069018"
},
["videoBlock.settings.paddings.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f16d2a1c75e4e368c52096f5f392478b7362f12092f61565b2505fc4904bfda5"
},
["videoBlock.settings.paddings.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b462dde7c9edde64ea0ef3b7baa66de119ee6b45e1275970be7d07062ca8e996"
},
["videoBlock.settings.paddings.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a7e49c9de944eb59b182b4170e11f27246a9a6b97991efb30eb44167d8e6e96a"
},
["videoBlock.settings.paddings.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "512befe9ea2fc6099da95661f8b6f26434831be23e431b5670423c8f8cbc163d"
},
["videoBlock.settings.paddings.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a60791c7bd997624175e5ce942b961e03be8caff0688d64714c220d3e3069018"
},
["videoBlock.settings.paddings.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f16d2a1c75e4e368c52096f5f392478b7362f12092f61565b2505fc4904bfda5"
},
["videoBlock.settings.paddings.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b462dde7c9edde64ea0ef3b7baa66de119ee6b45e1275970be7d07062ca8e996"
},
["videoBlock.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["videoBlock.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c59c64cc82659b3f4d98141fc48d64d75303e9682323d902d0767caca9a19c31"
},
["videoBlock.settings.responsiveMobile"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "70025b1e6ecca2a5db83b40897d93e15e79a2c51694481f46e5521d01ea7be36"
},
["timerBlock"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "9a125506a32560f4d77ad95745a1ae3b6916a72812a043de4875bcd7682fffe9"
},
["timerBlock.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "987f44fff38a9fcd62e353101b3823e640287645499d853d1e4a670f7d80776d"
},
["timerBlock.type"]: {
  "required": true,
  "type": "string",
  "const": "timer",
  "schemaHash": "479e5a71f296ad92630207e93e6dde8b2f86a8493380ac828d40047b8debb0af"
},
["timerBlock.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "d550fb40997b8dc11db9d0dee42d6446b3389c63bb3791a51f50f858588c2ba5"
},
["timerBlock.settings.altText"]: {
  "required": true,
  "type": "object",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["timerBlock.settings.altText.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["timerBlock.settings.altText.addToTitle"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "5488d5a30aa799c16d2a2e70182680c408d6b79973e0120c2259b2a142a87363"
},
["timerBlock.settings.responsiveMobile"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "b04708d549cbaaaa4c51ae8d00b79ec10afa37b5ab5aa0a95d636f8def292db6"
},
["timerBlock.settings.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "fc90ddf303f474b1fad5c7baadbf1773f3bb6c2dacaf669c10b0fc256521730f"
},
["timerBlock.settings.size.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["timerBlock.settings.size.desktop.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["timerBlock.settings.size.desktop.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["timerBlock.settings.size.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["timerBlock.settings.size.mobile.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["timerBlock.settings.size.mobile.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["timerBlock.settings.alignment"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ffeb13b7004005b19938145b546d5ceb08d7dcade8822f2213892c866f7cb1fa"
},
["timerBlock.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["timerBlock.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["timerBlock.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "82cdc2e20bff7e777b2055cc1783d43dc19e28df76b38edeb403fbcd81b24d9d"
},
["timerBlock.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a7e49c9de944eb59b182b4170e11f27246a9a6b97991efb30eb44167d8e6e96a"
}
};

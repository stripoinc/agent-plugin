
export default {
["column.containers[].blocks[]|8.settings.separator.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["column.containers[].blocks[]|8.settings.fontFamily"]: {
  "required": true,
  "type": "string",
  "schemaHash": "78035a700913e51bf0090fc676344739af2d24e9b225273c8da3c117f1254168"
},
["column.containers[].blocks[]|8.settings.fontSize"]: {
  "required": true,
  "type": "object",
  "schemaHash": "53415842ab6e3e1d40d9834d7380b3b174ceafe86078d8be32cc742f9831a34e"
},
["column.containers[].blocks[]|8.settings.fontSize.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "37a816d815e6dbdf6a8fefb6902097a07c3a8cf81fad8280cee2524b1803daaa"
},
["column.containers[].blocks[]|8.settings.fontSize.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f4a7861268e296034c8838cc047dfd4d8eeb4e1714073ae6be48740b4b5a6ab2"
},
["column.containers[].blocks[]|8.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["column.containers[].blocks[]|8.settings.textStyle"]: {
  "required": true,
  "type": "object",
  "schemaHash": "55f84de7664e4c3a3497e105a238d1404386c7f88c13adb56f7032630cebfaeb"
},
["column.containers[].blocks[]|8.settings.textStyle.bold"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "3b99ebeb89671d9886088bd336817526f52cc0c80c7eab43b21c2e5795bedc67"
},
["column.containers[].blocks[]|8.settings.textStyle.italic"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "31a22d79e498a049f58f727ecd2c3d327d0dfd7801f0aa50a680ac78fb1b685e"
},
["column.containers[].blocks[]|8.settings.textStyle.underline"]: {
  "required": false,
  "type": "boolean",
  "schemaHash": "ba949aff5ae5ee83d62cb030597ef18aabdeb64285dbe1467e369987243cb99e"
},
["column.containers[].blocks[]|8.settings.colors"]: {
  "required": true,
  "schemaHash": "5a7f7e6ab6991ebe9f113ccb0fa51d9c81958cca42aeb1d94a3e1fcba7d373c7"
},
["column.containers[].blocks[]|8.settings.colors|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "93806dde06fa7a2c94661a4ccd1cc773f6d6e106276a560158186336f8544f52"
},
["column.containers[].blocks[]|8.settings.colors|0.mode"]: {
  "required": true,
  "type": "string",
  "const": "shared",
  "schemaHash": "1fbcfb8821f7f57078257deae4d212f4434a2837c86343c1d8870461a34ad008"
},
["column.containers[].blocks[]|8.settings.colors|0.link"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["column.containers[].blocks[]|8.settings.colors|1"]: {
  "required": true,
  "type": "object",
  "schemaHash": "637652109513c6cbee0c3e5dc4d9ef1604f726b0eae8cc135b32d89ba39a2b89"
},
["column.containers[].blocks[]|8.settings.colors|1.mode"]: {
  "required": true,
  "type": "string",
  "const": "perItem",
  "schemaHash": "02933c27236a2ea9f68a8b22ac63f9963ca588343255322ad23f6472edb02128"
},
["column.containers[].blocks[]|8.settings.items"]: {
  "required": true,
  "type": "array",
  "schemaHash": "258e2bc002695b4d5327b9abd421767c9e6d97f13bac76cfa47ce4edd6ed2218"
},
["column.containers[].blocks[]|8.settings.items[]"]: {
  "required": true,
  "type": "object",
  "schemaHash": "2bd23c3d0ad27b8338568ddbe8ad78cfe8eed8d2a56f7536af3ad4ed8c66c3af"
},
["column.containers[].blocks[]|8.settings.items[].type"]: {
  "required": false,
  "type": "string",
  "enum": [
    "links",
    "icons",
    "linksWithIcons"
  ],
  "schemaHash": "c20d05644774083c0f77f06cdfa0dc43739e588171b713618a04207aba3140fd"
},
["column.containers[].blocks[]|8.settings.items[].name"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b076da2f23f288fbed7fc62a013f68f6111279a3b3c96e561dbb01f147fa283b"
},
["column.containers[].blocks[]|8.settings.items[].link"]: {
  "required": true,
  "type": "object",
  "schemaHash": "03ceeef39336e46ff66013e831b48bf162860eb1449e7a4c028f71778426b0fe"
},
["column.containers[].blocks[]|8.settings.items[].link.type"]: {
  "required": true,
  "type": "string",
  "enum": [
    "site",
    "email",
    "phone",
    "anchor"
  ],
  "schemaHash": "1d3d888ccbcd1037f232b9d8090319f42e4c5eaad0db37e55fbd7c9536226df9"
},
["column.containers[].blocks[]|8.settings.items[].link.value"]: {
  "required": true,
  "type": "string",
  "schemaHash": "5b279184e9835bc3e8b361d8c8305d63cec763221dda4971183b0a4299972386"
},
["column.containers[].blocks[]|8.settings.items[].image"]: {
  "required": false,
  "type": "object",
  "schemaHash": "424c8b880bc06a8962a1f64241384bcb4af1e3747dfdf3ca4894d4e4c0cafbf8"
},
["column.containers[].blocks[]|8.settings.items[].image.src"]: {
  "required": true,
  "type": "string",
  "schemaHash": "ab15e46494490e83a081f6e0baa4e145cc536dbab5e67bc6602bccc08ef22187"
},
["column.containers[].blocks[]|8.settings.items[].image.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "bc243feabbb0415d6d54a4bc9f58c1b4a7d19d96677b86f37eddc547dca403ee"
},
["column.containers[].blocks[]|8.settings.items[].image.size.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["column.containers[].blocks[]|8.settings.items[].image.size.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "0921a8e76f389dc7d08580a195f53d15f075b462e36e89f2d649594adc5007ed"
},
["column.containers[].blocks[]|8.settings.items[].image.alignment"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "04aab43d56e72e18b3288884e5f8bcc4040d0027920f86649923a5f3b3751af1"
},
["column.containers[].blocks[]|8.settings.items[].image.indent"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "37c278bba54aa91fc6da77acdb75cf92bc457dc432668d2d8172f0a632a6ed88"
},
["column.containers[].blocks[]|8.settings.items[].image.altText"]: {
  "required": true,
  "type": "string",
  "schemaHash": "5416d6de635a80a43a160d01f44dad7c972d14d5772dbbbf659528157b78ac19"
},
["column.containers[].blocks[]|8.settings.items[].hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["column.containers[].blocks[]|8.settings.items[].colors"]: {
  "required": false,
  "type": "object",
  "schemaHash": "0f745e2518c1ca692813ee55636d008ba021361f22aa88b3853f80060bb190af"
},
["column.containers[].blocks[]|8.settings.items[].colors.link"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["column.containers[].blocks[]|8.settings.items[].colors.background"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["column.containers[].blocks[]|9"]: {
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
["column.containers[].blocks[]|9.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["column.containers[].blocks[]|9.type"]: {
  "required": true,
  "type": "string",
  "const": "unknown",
  "schemaHash": "fe6bb182b452b7635fb96db632fb78c84f645e0b23cb2cbfa91c6704efb54358"
},
["column.containers[].blocks[]|9.settings"]: {
  "required": false,
  "type": "object",
  "schemaHash": "e176716081727d356ee723bc3404dcf5d9468367fffaa90a7670d5a580e754f2"
},
["column.containers[].blocks[]|9.content"]: {
  "required": true,
  "type": "string",
  "schemaHash": "8a81a5c513461d5d8534067a1bf32236034dffcbe2b8d13babf92714febabf6f"
},
["column.containers[].blocks[]|9.extension"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "a3049eb948cd2442f383a70aa8b7fa5a724394898101edebf8848c4d1ad820a8"
},
["container"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "013d1fbe2f2d19334c61c1154c93da3e974993e64a0569054215550ee2351fec"
},
["container.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "380155b942a4d8b8cd37f1baf475c42f30bf72f300cb6191489845e054b57df4"
},
["container.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "22c9c58113a9510e9ac16edc66a390310a7353f25ed2920baa8d0284ee6e60bd"
},
["container.settings.padding"]: {
  "required": true,
  "type": "object",
  "schemaHash": "2f13dc68b2b8d2e768b8ddc88b73d0ebec7b6bad5067323262c7ea3d99ffed14"
},
["container.settings.padding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b0436d0d3e471e0145a05542ee662b3c21bb774c2c6dca85be780661b52d914e"
},
["container.settings.padding.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dedd9a125b9b24dc461951aefa50c4abaf1a6fc4d072d7cc50e97525ce82f60d"
},
["container.settings.padding.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "0de0b1b8b4e02994b9415b401b414015f9024e9336e605c66dc0bce7679cf65d"
},
["container.settings.padding.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9a3a2949896ce1f3f7048146819d3fa9c52198d7a2a872211526cc1643540a62"
},
["container.settings.padding.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76eb193d1dc62ed65e8fa68c05ddf8c469b5d2f74365e34f38707b2c39eab506"
},
["container.settings.padding.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b0436d0d3e471e0145a05542ee662b3c21bb774c2c6dca85be780661b52d914e"
},
["container.settings.padding.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dedd9a125b9b24dc461951aefa50c4abaf1a6fc4d072d7cc50e97525ce82f60d"
},
["container.settings.padding.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "0de0b1b8b4e02994b9415b401b414015f9024e9336e605c66dc0bce7679cf65d"
},
["container.settings.padding.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9a3a2949896ce1f3f7048146819d3fa9c52198d7a2a872211526cc1643540a62"
},
["container.settings.padding.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76eb193d1dc62ed65e8fa68c05ddf8c469b5d2f74365e34f38707b2c39eab506"
},
["container.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["container.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["container.settings.backgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["container.settings.backgroundImage"]: {
  "required": false,
  "type": "object",
  "schemaHash": "bb7e79c55a455f275b417bb6cba33dd77279eec722e6f721cf7f76e208111b91"
},
["container.settings.backgroundImage.path"]: {
  "required": true,
  "type": "string",
  "schemaHash": "16208d1e33d8319d4694e51b4edb93a5da5b954b3bc79281887f27e7894ee3ca"
},
["container.settings.backgroundImage.repeat"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["container.settings.backgroundImage.x"]: {
  "required": true,
  "type": "string",
  "schemaHash": "da6e1d7cd61492fddf768d0ab72afbd2a51e56e6a3bc744db9449992f030f3c1"
},
["container.settings.backgroundImage.y"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c202195a934f3206caad05d4917edf359b473fcbd618ac0e8c7be3504bfda45e"
},
["container.settings.backgroundImage.sizeX"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["container.settings.backgroundImage.sizeY"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["container.settings.border"]: {
  "required": true,
  "type": "object",
  "schemaHash": "dd0a3c911e673ccbedf16997b948eee2a85e978a8001e2fdde28ff8af0eb0684"
},
["container.settings.border.top"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["container.settings.border.top.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["container.settings.border.top.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["container.settings.border.right"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["container.settings.border.right.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["container.settings.border.right.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["container.settings.border.bottom"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["container.settings.border.bottom.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["container.settings.border.bottom.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["container.settings.border.left"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["container.settings.border.left.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["container.settings.border.left.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["container.settings.border.style"]: {
  "required": true,
  "type": "string",
  "enum": [
    "solid",
    "dashed",
    "dotted"
  ],
  "schemaHash": "4dccba551d73ee1e024ebf753a1823f51e085b0195de30d1842495dae37ae465"
},
["container.settings.radius"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["container.settings.radius.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "c6a7ff699a4fa712c9fa55a9c2b0d3ad74f2c553003f34c77f684d541148a799"
},
["container.settings.radius.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76aafbb93390c3dff8b2ae02b12097a3d3738647f00ac4e4e7aa4fb38cee5c2b"
},
["container.settings.radius.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "3bfb5286fc5028d5eabaa11a8db3f7678318acc269d485f50ce2d47c675a58b4"
},
["container.settings.radius.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "65b696cd36e9bba1b6772e1f1b30b41c7c1ead9b9bc4011ef1ee8e9098bd84ca"
},
["container.settings.darkTheme"]: {
  "required": false,
  "type": "object",
  "schemaHash": "4a24b457315f176574d9b069c09ffc196f8aeab1b4de744bebe8c635213db3b3"
},
["container.settings.darkTheme.backgroundColor"]: {
  "required": false,
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "b38b60f81b8e789d4a2c399ed472748d2898acf4dae3f74cc5ee567c748fb26f"
},
["container.settings.darkTheme.backgroundColor|0"]: {
  "required": false,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["container.settings.darkTheme.backgroundColor|1"]: {
  "required": false,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["container.settings.darkTheme.backgroundImage"]: {
  "required": false,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "a825fc1dbd81a008442d27f8bc82af36b428c1c748702fe9a4e73e635f2939ff"
},
["container.moduleId"]: {
  "required": false,
  "type": "number",
  "readOnly": true,
  "schemaHash": "a594f2ebe0fc5c004b152ee01878131ef29c9684917a24fb2155715457fed61c"
},
["container.blocks"]: {
  "required": false,
  "type": "array",
  "schemaHash": "641e285ac00c8aac980b3c626ef6471ba0b55ff7349a1acdc4cd38ed25120a78"
},
["container.blocks[]"]: {
  "required": true,
  "schemaHash": "ada97c1ed3413f8637fe2aea69bbe0add20beee79f6fbae7e5b29bd1aa7acae1"
},
["container.blocks[]|0"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "fde0e043848147d151f330a15c4cb37069edbb219885baad902ae71f4fb6b162"
},
["container.blocks[]|0.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["container.blocks[]|0.type"]: {
  "required": true,
  "type": "string",
  "const": "text",
  "schemaHash": "e9a1c4855d31ed99336125118d369a2b7e0313cbe83dad4c864eb3c031eb698c"
},
["container.blocks[]|0.settings"]: {
  "required": false,
  "type": "object",
  "schemaHash": "9119e37ac31455c3e3b497658119c983af4e84a814b0672d2229b91880f5f37b"
},
["container.blocks[]|0.settings.fontColor"]: {
  "required": false,
  "type": "string",
  "schemaHash": "b61b2b9f199526eb3295f9e2ced901958e0497a6c2750820f57bee70b1158827"
},
["container.blocks[]|0.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["container.blocks[]|0.settings.rightToLeftTextDirection"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["container.blocks[]|0.settings.alignment"]: {
  "required": false,
  "type": "object",
  "schemaHash": "c0cbe70569a2b9985283a85c0412d3816f80ab79f635ce40fbf5887bad3e8f4e"
},
["container.blocks[]|0.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right",
    "justify"
  ],
  "schemaHash": "545169c5e967251714bdc95b8e24b2661d0aab9e0c47d252eea521a99ad79df7"
},
["container.blocks[]|0.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right",
    "justify"
  ],
  "schemaHash": "545169c5e967251714bdc95b8e24b2661d0aab9e0c47d252eea521a99ad79df7"
},
["container.blocks[]|0.settings.fixedHeight"]: {
  "required": false,
  "type": "object",
  "schemaHash": "a39f50192654cd59cc8e85339d6978fa5dee0fb021cb44b41699b414f214ecb5"
},
["container.blocks[]|0.settings.fixedHeight.desktop"]: {
  "required": false,
  "type": "object",
  "schemaHash": "db8061168303c6be1f45c9923089167dbd85cbaa25f9f67f2eb3565207a3e327"
},
["container.blocks[]|0.settings.fixedHeight.desktop.height"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "474f4d9296fe9ab42673b8752a6fed0e522587f12abaf9751a03797acb4d96b5"
},
["container.blocks[]|0.settings.fixedHeight.desktop.verticalAlignment"]: {
  "required": false,
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ],
  "schemaHash": "c145b8d0e8d0ecce2a0a2622ad17ecd4c5584fda7205631d1cb263a76928fba8"
},
["container.blocks[]|0.settings.fixedHeight.mobile"]: {
  "required": false,
  "type": "object",
  "schemaHash": "b1801ad48db8da15cc2a86a1d31e4251c1eda78abb0a74c1f8be0e8a756a940f"
},
["container.blocks[]|0.settings.fixedHeight.mobile.height"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "474f4d9296fe9ab42673b8752a6fed0e522587f12abaf9751a03797acb4d96b5"
},
["container.blocks[]|0.settings.fixedHeight.mobile.verticalAlignment"]: {
  "required": false,
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ],
  "schemaHash": "c145b8d0e8d0ecce2a0a2622ad17ecd4c5584fda7205631d1cb263a76928fba8"
},
["container.blocks[]|0.settings.padding"]: {
  "required": true,
  "type": "object",
  "schemaHash": "42aeaafa11852293724925168414611fb3309ce210ecc601a17568e4c4506fff"
},
["container.blocks[]|0.settings.padding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "923752398804419d65fd5fa6d63fb00fbdfdee1a47e0296f69434adc03e29e78"
},
["container.blocks[]|0.settings.padding.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["container.blocks[]|0.settings.padding.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["container.blocks[]|0.settings.padding.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["container.blocks[]|0.settings.padding.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["container.blocks[]|0.settings.padding.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "923752398804419d65fd5fa6d63fb00fbdfdee1a47e0296f69434adc03e29e78"
},
["container.blocks[]|0.settings.padding.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["container.blocks[]|0.settings.padding.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["container.blocks[]|0.settings.padding.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["container.blocks[]|0.settings.padding.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["container.blocks[]|0.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["container.blocks[]|0.settings.backgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["container.blocks[]|0.settings.letterSpacing"]: {
  "required": false,
  "type": "object",
  "schemaHash": "6c0a48468186e0c8d560f840814d1fecd1737259415b326aae6ee0c5787405d9"
},
["container.blocks[]|0.settings.letterSpacing.value"]: {
  "required": true,
  "type": "number",
  "schemaHash": "92ecef150d33ac7d09603020589d690900d2fd2ae8d10a0a9cfd6936384e8b05"
},
["container.blocks[]|0.settings.letterSpacing.unit"]: {
  "required": true,
  "type": "string",
  "enum": [
    "px",
    "em"
  ],
  "schemaHash": "c679b09b2ab5a8c336c639b8750e66205b88ff18864947604378c69a6944f97e"
},
["container.blocks[]|0.content"]: {
  "required": false,
  "type": "string",
  "schemaHash": "60103c69a46aa5e06fb8015ba33f2629730adca94ed2130a7319cc99447e3fa1"
},
["container.blocks[]|1"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "855c0c82d0cae51f704f7d611bce37e00f9458922ff847dfb93fcd32d511ca59"
},
["container.blocks[]|1.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["container.blocks[]|1.type"]: {
  "required": true,
  "type": "string",
  "const": "image",
  "schemaHash": "f91d29b5ca92f549d52a1729a378abdde7d9b342856784a42f81c4e7251303a7"
},
["container.blocks[]|1.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "987f44fff38a9fcd62e353101b3823e640287645499d853d1e4a670f7d80776d"
},
["container.blocks[]|1.settings.src"]: {
  "required": true,
  "type": "string",
  "schemaHash": "cc22f8ec14817471274ae0fddcdc70ee916ee0e4e058c2adf4ccefed5b83163f"
},
["container.blocks[]|1.settings.link"]: {
  "required": false,
  "type": "object",
  "schemaHash": "796892a0a67d7975ad6b69e46842aed905ee794b205e0c0f6e0841569314f221"
},
["container.blocks[]|1.settings.link.type"]: {
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
  "schemaHash": "8ae8bf286545f6c3b1f6f73573264a9f61fa09fb6bfa2447aa5ce9bb8617ab6f"
},
["container.blocks[]|1.settings.link.href"]: {
  "required": true,
  "type": "string",
  "schemaHash": "56d55f6fcdb01c0c00118da460ddac6a6ae331e81fa89660e48ae90eeceb01bd"
},
["container.blocks[]|1.settings.altText"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a4475867ad83c5cd99c199dfddf0b8e799ebe5f636bf765a2f4ec2d69e7ead09"
},
["container.blocks[]|1.settings.altText.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b4b3a153ebf7f9907edcb00945ab363971246387c038cfb94b5a08fffd84a3e8"
},
["container.blocks[]|1.settings.altText.addToTitle"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "e930d6bfd7e624cc404d6ac9111b7f5169a3f9e6ccda3f7a9c208027be48f312"
},
["container.blocks[]|1.settings.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "37536e5cdca2c6a99d26bcca81988a492aa2df1ee3034744cc62643936f6c8ab"
},
["container.blocks[]|1.settings.size.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["container.blocks[]|1.settings.size.desktop.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
},
["container.blocks[]|1.settings.size.desktop.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "35dd650fb6a5f62fe7fc20739ab6b54f5f4aea29f3f5841fc40e61b1e3b89a95"
},
["container.blocks[]|1.settings.size.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["container.blocks[]|1.settings.size.mobile.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
},
["container.blocks[]|1.settings.size.mobile.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "35dd650fb6a5f62fe7fc20739ab6b54f5f4aea29f3f5841fc40e61b1e3b89a95"
},
["container.blocks[]|1.settings.alignment"]: {
  "required": true,
  "type": "object",
  "schemaHash": "5a6d40dd19c05ee913025262e4a5001671aac6913feb634ce0e68f5f65bf6790"
},
["container.blocks[]|1.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["container.blocks[]|1.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["container.blocks[]|1.settings.radius"]: {
  "required": true,
  "type": "object",
  "schemaHash": "77491c918f72594148ebce95e4c92d11695538b6f547a6767d2fff890ae7a68a"
},
["container.blocks[]|1.settings.radius.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["container.blocks[]|1.settings.radius.desktop.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "c6a7ff699a4fa712c9fa55a9c2b0d3ad74f2c553003f34c77f684d541148a799"
},
["container.blocks[]|1.settings.radius.desktop.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76aafbb93390c3dff8b2ae02b12097a3d3738647f00ac4e4e7aa4fb38cee5c2b"
},
["container.blocks[]|1.settings.radius.desktop.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "3bfb5286fc5028d5eabaa11a8db3f7678318acc269d485f50ce2d47c675a58b4"
},
["container.blocks[]|1.settings.radius.desktop.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "65b696cd36e9bba1b6772e1f1b30b41c7c1ead9b9bc4011ef1ee8e9098bd84ca"
},
["container.blocks[]|1.settings.radius.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["container.blocks[]|1.settings.radius.mobile.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "c6a7ff699a4fa712c9fa55a9c2b0d3ad74f2c553003f34c77f684d541148a799"
},
["container.blocks[]|1.settings.radius.mobile.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76aafbb93390c3dff8b2ae02b12097a3d3738647f00ac4e4e7aa4fb38cee5c2b"
},
["container.blocks[]|1.settings.radius.mobile.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "3bfb5286fc5028d5eabaa11a8db3f7678318acc269d485f50ce2d47c675a58b4"
},
["container.blocks[]|1.settings.radius.mobile.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "65b696cd36e9bba1b6772e1f1b30b41c7c1ead9b9bc4011ef1ee8e9098bd84ca"
},
["container.blocks[]|1.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["container.blocks[]|1.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "efb2498bfd7c3a684731d96285b8c29553f2e46b13fac6d897a5f507ebc3c9ae"
},
["container.blocks[]|1.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["container.blocks[]|1.settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["container.blocks[]|1.settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["container.blocks[]|1.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["container.blocks[]|1.settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["container.blocks[]|1.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["container.blocks[]|1.settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["container.blocks[]|1.settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["container.blocks[]|1.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["container.blocks[]|1.settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["container.blocks[]|1.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["container.blocks[]|1.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["container.blocks[]|1.settings.responsiveMobile"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "5488d5a30aa799c16d2a2e70182680c408d6b79973e0120c2259b2a142a87363"
},
["container.blocks[]|2"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "8441b3e9d7955c4ac8db7f346ca037617bad501bf7a3a9963a23268c83dcbd41"
},
["container.blocks[]|2.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["container.blocks[]|2.type"]: {
  "required": true,
  "type": "string",
  "const": "video",
  "schemaHash": "fc90ddf303f474b1fad5c7baadbf1773f3bb6c2dacaf669c10b0fc256521730f"
},
["container.blocks[]|2.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "3272677b3785aec173d0170f736bbcda85be6fcff62315f9cf5407f812c12a9c"
},
["container.blocks[]|2.settings.videoLink"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["container.blocks[]|2.settings.altText"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a4475867ad83c5cd99c199dfddf0b8e799ebe5f636bf765a2f4ec2d69e7ead09"
},
["container.blocks[]|2.settings.altText.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b4b3a153ebf7f9907edcb00945ab363971246387c038cfb94b5a08fffd84a3e8"
},
["container.blocks[]|2.settings.altText.addToTitle"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "e930d6bfd7e624cc404d6ac9111b7f5169a3f9e6ccda3f7a9c208027be48f312"
},
["container.blocks[]|2.settings.customThumbnail"]: {
  "required": false,
  "type": "object",
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["container.blocks[]|2.settings.customThumbnail.src"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["container.blocks[]|2.settings.playButtonStyle"]: {
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
  "schemaHash": "ffeb13b7004005b19938145b546d5ceb08d7dcade8822f2213892c866f7cb1fa"
},
["container.blocks[]|2.settings.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "37536e5cdca2c6a99d26bcca81988a492aa2df1ee3034744cc62643936f6c8ab"
},
["container.blocks[]|2.settings.size.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["container.blocks[]|2.settings.size.desktop.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
},
["container.blocks[]|2.settings.size.desktop.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "35dd650fb6a5f62fe7fc20739ab6b54f5f4aea29f3f5841fc40e61b1e3b89a95"
},
["container.blocks[]|2.settings.size.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["container.blocks[]|2.settings.size.mobile.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
},
["container.blocks[]|2.settings.size.mobile.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "35dd650fb6a5f62fe7fc20739ab6b54f5f4aea29f3f5841fc40e61b1e3b89a95"
},
["container.blocks[]|2.settings.alignment"]: {
  "required": true,
  "type": "object",
  "schemaHash": "5a6d40dd19c05ee913025262e4a5001671aac6913feb634ce0e68f5f65bf6790"
},
["container.blocks[]|2.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["container.blocks[]|2.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["container.blocks[]|2.settings.radius"]: {
  "required": true,
  "type": "object",
  "schemaHash": "77491c918f72594148ebce95e4c92d11695538b6f547a6767d2fff890ae7a68a"
},
["container.blocks[]|2.settings.radius.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["container.blocks[]|2.settings.radius.desktop.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "c6a7ff699a4fa712c9fa55a9c2b0d3ad74f2c553003f34c77f684d541148a799"
},
["container.blocks[]|2.settings.radius.desktop.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76aafbb93390c3dff8b2ae02b12097a3d3738647f00ac4e4e7aa4fb38cee5c2b"
},
["container.blocks[]|2.settings.radius.desktop.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "3bfb5286fc5028d5eabaa11a8db3f7678318acc269d485f50ce2d47c675a58b4"
},
["container.blocks[]|2.settings.radius.desktop.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "65b696cd36e9bba1b6772e1f1b30b41c7c1ead9b9bc4011ef1ee8e9098bd84ca"
},
["container.blocks[]|2.settings.radius.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["container.blocks[]|2.settings.radius.mobile.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "c6a7ff699a4fa712c9fa55a9c2b0d3ad74f2c553003f34c77f684d541148a799"
},
["container.blocks[]|2.settings.radius.mobile.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76aafbb93390c3dff8b2ae02b12097a3d3738647f00ac4e4e7aa4fb38cee5c2b"
},
["container.blocks[]|2.settings.radius.mobile.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "3bfb5286fc5028d5eabaa11a8db3f7678318acc269d485f50ce2d47c675a58b4"
},
["container.blocks[]|2.settings.radius.mobile.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "65b696cd36e9bba1b6772e1f1b30b41c7c1ead9b9bc4011ef1ee8e9098bd84ca"
},
["container.blocks[]|2.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["container.blocks[]|2.settings.paddings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["container.blocks[]|2.settings.paddings.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["container.blocks[]|2.settings.paddings.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["container.blocks[]|2.settings.paddings.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["container.blocks[]|2.settings.paddings.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["container.blocks[]|2.settings.paddings.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["container.blocks[]|2.settings.paddings.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["container.blocks[]|2.settings.paddings.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["container.blocks[]|2.settings.paddings.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["container.blocks[]|2.settings.paddings.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["container.blocks[]|2.settings.paddings.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["container.blocks[]|2.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["container.blocks[]|2.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["container.blocks[]|2.settings.responsiveMobile"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "341814eb6aff7d91bd84e9006aba1a60303f85af77dc4b114c35299d29ccec79"
},
["container.blocks[]|3"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "7c38ec0df6179cd18b353445e01d84672e8fe5443eb59b2facf08ba39ecc52ae"
},
["container.blocks[]|3.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["container.blocks[]|3.type"]: {
  "required": true,
  "type": "string",
  "const": "timer",
  "schemaHash": "82cdc2e20bff7e777b2055cc1783d43dc19e28df76b38edeb403fbcd81b24d9d"
},
["container.blocks[]|3.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "d550fb40997b8dc11db9d0dee42d6446b3389c63bb3791a51f50f858588c2ba5"
},
["container.blocks[]|3.settings.altText"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a4475867ad83c5cd99c199dfddf0b8e799ebe5f636bf765a2f4ec2d69e7ead09"
},
["container.blocks[]|3.settings.altText.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b4b3a153ebf7f9907edcb00945ab363971246387c038cfb94b5a08fffd84a3e8"
},
["container.blocks[]|3.settings.altText.addToTitle"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "e930d6bfd7e624cc404d6ac9111b7f5169a3f9e6ccda3f7a9c208027be48f312"
},
["container.blocks[]|3.settings.responsiveMobile"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "a7e49c9de944eb59b182b4170e11f27246a9a6b97991efb30eb44167d8e6e96a"
},
["container.blocks[]|3.settings.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "37536e5cdca2c6a99d26bcca81988a492aa2df1ee3034744cc62643936f6c8ab"
},
["container.blocks[]|3.settings.size.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["container.blocks[]|3.settings.size.desktop.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
},
["container.blocks[]|3.settings.size.desktop.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "35dd650fb6a5f62fe7fc20739ab6b54f5f4aea29f3f5841fc40e61b1e3b89a95"
},
["container.blocks[]|3.settings.size.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["container.blocks[]|3.settings.size.mobile.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
},
["container.blocks[]|3.settings.size.mobile.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "35dd650fb6a5f62fe7fc20739ab6b54f5f4aea29f3f5841fc40e61b1e3b89a95"
},
["container.blocks[]|3.settings.alignment"]: {
  "required": true,
  "type": "object",
  "schemaHash": "5a6d40dd19c05ee913025262e4a5001671aac6913feb634ce0e68f5f65bf6790"
},
["container.blocks[]|3.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["container.blocks[]|3.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["container.blocks[]|3.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "efb2498bfd7c3a684731d96285b8c29553f2e46b13fac6d897a5f507ebc3c9ae"
},
["container.blocks[]|3.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["container.blocks[]|3.settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["container.blocks[]|3.settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["container.blocks[]|3.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["container.blocks[]|3.settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["container.blocks[]|3.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["container.blocks[]|3.settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["container.blocks[]|3.settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["container.blocks[]|3.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["container.blocks[]|3.settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["container.blocks[]|3.settings.endDate"]: {
  "required": true,
  "type": "string",
  "schemaHash": "512befe9ea2fc6099da95661f8b6f26434831be23e431b5670423c8f8cbc163d"
}
};

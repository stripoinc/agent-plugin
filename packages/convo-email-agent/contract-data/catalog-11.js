
export default {
["structure.columns[].containers[].blocks[]|0"]: {
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
["structure.columns[].containers[].blocks[]|0.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["structure.columns[].containers[].blocks[]|0.type"]: {
  "required": true,
  "type": "string",
  "const": "text",
  "schemaHash": "e9a1c4855d31ed99336125118d369a2b7e0313cbe83dad4c864eb3c031eb698c"
},
["structure.columns[].containers[].blocks[]|0.settings"]: {
  "required": false,
  "type": "object",
  "schemaHash": "9119e37ac31455c3e3b497658119c983af4e84a814b0672d2229b91880f5f37b"
},
["structure.columns[].containers[].blocks[]|0.settings.fontColor"]: {
  "required": false,
  "type": "string",
  "schemaHash": "b61b2b9f199526eb3295f9e2ced901958e0497a6c2750820f57bee70b1158827"
},
["structure.columns[].containers[].blocks[]|0.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["structure.columns[].containers[].blocks[]|0.settings.rightToLeftTextDirection"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["structure.columns[].containers[].blocks[]|0.settings.alignment"]: {
  "required": false,
  "type": "object",
  "schemaHash": "c0cbe70569a2b9985283a85c0412d3816f80ab79f635ce40fbf5887bad3e8f4e"
},
["structure.columns[].containers[].blocks[]|0.settings.alignment.desktop"]: {
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
["structure.columns[].containers[].blocks[]|0.settings.alignment.mobile"]: {
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
["structure.columns[].containers[].blocks[]|0.settings.fixedHeight"]: {
  "required": false,
  "type": "object",
  "schemaHash": "a39f50192654cd59cc8e85339d6978fa5dee0fb021cb44b41699b414f214ecb5"
},
["structure.columns[].containers[].blocks[]|0.settings.fixedHeight.desktop"]: {
  "required": false,
  "type": "object",
  "schemaHash": "db8061168303c6be1f45c9923089167dbd85cbaa25f9f67f2eb3565207a3e327"
},
["structure.columns[].containers[].blocks[]|0.settings.fixedHeight.desktop.height"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "474f4d9296fe9ab42673b8752a6fed0e522587f12abaf9751a03797acb4d96b5"
},
["structure.columns[].containers[].blocks[]|0.settings.fixedHeight.desktop.verticalAlignment"]: {
  "required": false,
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ],
  "schemaHash": "c145b8d0e8d0ecce2a0a2622ad17ecd4c5584fda7205631d1cb263a76928fba8"
},
["structure.columns[].containers[].blocks[]|0.settings.fixedHeight.mobile"]: {
  "required": false,
  "type": "object",
  "schemaHash": "b1801ad48db8da15cc2a86a1d31e4251c1eda78abb0a74c1f8be0e8a756a940f"
},
["structure.columns[].containers[].blocks[]|0.settings.fixedHeight.mobile.height"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "474f4d9296fe9ab42673b8752a6fed0e522587f12abaf9751a03797acb4d96b5"
},
["structure.columns[].containers[].blocks[]|0.settings.fixedHeight.mobile.verticalAlignment"]: {
  "required": false,
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ],
  "schemaHash": "c145b8d0e8d0ecce2a0a2622ad17ecd4c5584fda7205631d1cb263a76928fba8"
},
["structure.columns[].containers[].blocks[]|0.settings.padding"]: {
  "required": true,
  "type": "object",
  "schemaHash": "42aeaafa11852293724925168414611fb3309ce210ecc601a17568e4c4506fff"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "923752398804419d65fd5fa6d63fb00fbdfdee1a47e0296f69434adc03e29e78"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "923752398804419d65fd5fa6d63fb00fbdfdee1a47e0296f69434adc03e29e78"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["structure.columns[].containers[].blocks[]|0.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["structure.columns[].containers[].blocks[]|0.settings.backgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["structure.columns[].containers[].blocks[]|0.settings.letterSpacing"]: {
  "required": false,
  "type": "object",
  "schemaHash": "6c0a48468186e0c8d560f840814d1fecd1737259415b326aae6ee0c5787405d9"
},
["structure.columns[].containers[].blocks[]|0.settings.letterSpacing.value"]: {
  "required": true,
  "type": "number",
  "schemaHash": "92ecef150d33ac7d09603020589d690900d2fd2ae8d10a0a9cfd6936384e8b05"
},
["structure.columns[].containers[].blocks[]|0.settings.letterSpacing.unit"]: {
  "required": true,
  "type": "string",
  "enum": [
    "px",
    "em"
  ],
  "schemaHash": "c679b09b2ab5a8c336c639b8750e66205b88ff18864947604378c69a6944f97e"
},
["structure.columns[].containers[].blocks[]|0.content"]: {
  "required": false,
  "type": "string",
  "schemaHash": "60103c69a46aa5e06fb8015ba33f2629730adca94ed2130a7319cc99447e3fa1"
},
["structure.columns[].containers[].blocks[]|1"]: {
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
["structure.columns[].containers[].blocks[]|1.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["structure.columns[].containers[].blocks[]|1.type"]: {
  "required": true,
  "type": "string",
  "const": "image",
  "schemaHash": "f91d29b5ca92f549d52a1729a378abdde7d9b342856784a42f81c4e7251303a7"
},
["structure.columns[].containers[].blocks[]|1.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "987f44fff38a9fcd62e353101b3823e640287645499d853d1e4a670f7d80776d"
},
["structure.columns[].containers[].blocks[]|1.settings.src"]: {
  "required": true,
  "type": "string",
  "schemaHash": "cc22f8ec14817471274ae0fddcdc70ee916ee0e4e058c2adf4ccefed5b83163f"
},
["structure.columns[].containers[].blocks[]|1.settings.link"]: {
  "required": false,
  "type": "object",
  "schemaHash": "796892a0a67d7975ad6b69e46842aed905ee794b205e0c0f6e0841569314f221"
},
["structure.columns[].containers[].blocks[]|1.settings.link.type"]: {
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
["structure.columns[].containers[].blocks[]|1.settings.link.href"]: {
  "required": true,
  "type": "string",
  "schemaHash": "56d55f6fcdb01c0c00118da460ddac6a6ae331e81fa89660e48ae90eeceb01bd"
},
["structure.columns[].containers[].blocks[]|1.settings.altText"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a4475867ad83c5cd99c199dfddf0b8e799ebe5f636bf765a2f4ec2d69e7ead09"
},
["structure.columns[].containers[].blocks[]|1.settings.altText.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b4b3a153ebf7f9907edcb00945ab363971246387c038cfb94b5a08fffd84a3e8"
},
["structure.columns[].containers[].blocks[]|1.settings.altText.addToTitle"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "e930d6bfd7e624cc404d6ac9111b7f5169a3f9e6ccda3f7a9c208027be48f312"
},
["structure.columns[].containers[].blocks[]|1.settings.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "37536e5cdca2c6a99d26bcca81988a492aa2df1ee3034744cc62643936f6c8ab"
},
["structure.columns[].containers[].blocks[]|1.settings.size.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["structure.columns[].containers[].blocks[]|1.settings.size.desktop.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
},
["structure.columns[].containers[].blocks[]|1.settings.size.desktop.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "35dd650fb6a5f62fe7fc20739ab6b54f5f4aea29f3f5841fc40e61b1e3b89a95"
},
["structure.columns[].containers[].blocks[]|1.settings.size.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["structure.columns[].containers[].blocks[]|1.settings.size.mobile.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
},
["structure.columns[].containers[].blocks[]|1.settings.size.mobile.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "35dd650fb6a5f62fe7fc20739ab6b54f5f4aea29f3f5841fc40e61b1e3b89a95"
},
["structure.columns[].containers[].blocks[]|1.settings.alignment"]: {
  "required": true,
  "type": "object",
  "schemaHash": "5a6d40dd19c05ee913025262e4a5001671aac6913feb634ce0e68f5f65bf6790"
},
["structure.columns[].containers[].blocks[]|1.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["structure.columns[].containers[].blocks[]|1.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["structure.columns[].containers[].blocks[]|1.settings.radius"]: {
  "required": true,
  "type": "object",
  "schemaHash": "77491c918f72594148ebce95e4c92d11695538b6f547a6767d2fff890ae7a68a"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.desktop.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "c6a7ff699a4fa712c9fa55a9c2b0d3ad74f2c553003f34c77f684d541148a799"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.desktop.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76aafbb93390c3dff8b2ae02b12097a3d3738647f00ac4e4e7aa4fb38cee5c2b"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.desktop.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "3bfb5286fc5028d5eabaa11a8db3f7678318acc269d485f50ce2d47c675a58b4"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.desktop.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "65b696cd36e9bba1b6772e1f1b30b41c7c1ead9b9bc4011ef1ee8e9098bd84ca"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.mobile.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "c6a7ff699a4fa712c9fa55a9c2b0d3ad74f2c553003f34c77f684d541148a799"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.mobile.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76aafbb93390c3dff8b2ae02b12097a3d3738647f00ac4e4e7aa4fb38cee5c2b"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.mobile.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "3bfb5286fc5028d5eabaa11a8db3f7678318acc269d485f50ce2d47c675a58b4"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.mobile.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "65b696cd36e9bba1b6772e1f1b30b41c7c1ead9b9bc4011ef1ee8e9098bd84ca"
},
["structure.columns[].containers[].blocks[]|1.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["structure.columns[].containers[].blocks[]|1.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "efb2498bfd7c3a684731d96285b8c29553f2e46b13fac6d897a5f507ebc3c9ae"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["structure.columns[].containers[].blocks[]|1.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["structure.columns[].containers[].blocks[]|1.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["structure.columns[].containers[].blocks[]|1.settings.responsiveMobile"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "5488d5a30aa799c16d2a2e70182680c408d6b79973e0120c2259b2a142a87363"
},
["structure.columns[].containers[].blocks[]|2"]: {
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
["structure.columns[].containers[].blocks[]|2.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["structure.columns[].containers[].blocks[]|2.type"]: {
  "required": true,
  "type": "string",
  "const": "video",
  "schemaHash": "fc90ddf303f474b1fad5c7baadbf1773f3bb6c2dacaf669c10b0fc256521730f"
},
["structure.columns[].containers[].blocks[]|2.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "3272677b3785aec173d0170f736bbcda85be6fcff62315f9cf5407f812c12a9c"
},
["structure.columns[].containers[].blocks[]|2.settings.videoLink"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["structure.columns[].containers[].blocks[]|2.settings.altText"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a4475867ad83c5cd99c199dfddf0b8e799ebe5f636bf765a2f4ec2d69e7ead09"
},
["structure.columns[].containers[].blocks[]|2.settings.altText.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b4b3a153ebf7f9907edcb00945ab363971246387c038cfb94b5a08fffd84a3e8"
},
["structure.columns[].containers[].blocks[]|2.settings.altText.addToTitle"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "e930d6bfd7e624cc404d6ac9111b7f5169a3f9e6ccda3f7a9c208027be48f312"
},
["structure.columns[].containers[].blocks[]|2.settings.customThumbnail"]: {
  "required": false,
  "type": "object",
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["structure.columns[].containers[].blocks[]|2.settings.customThumbnail.src"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["structure.columns[].containers[].blocks[]|2.settings.playButtonStyle"]: {
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
["structure.columns[].containers[].blocks[]|2.settings.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "37536e5cdca2c6a99d26bcca81988a492aa2df1ee3034744cc62643936f6c8ab"
},
["structure.columns[].containers[].blocks[]|2.settings.size.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["structure.columns[].containers[].blocks[]|2.settings.size.desktop.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
},
["structure.columns[].containers[].blocks[]|2.settings.size.desktop.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "35dd650fb6a5f62fe7fc20739ab6b54f5f4aea29f3f5841fc40e61b1e3b89a95"
},
["structure.columns[].containers[].blocks[]|2.settings.size.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["structure.columns[].containers[].blocks[]|2.settings.size.mobile.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
},
["structure.columns[].containers[].blocks[]|2.settings.size.mobile.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "35dd650fb6a5f62fe7fc20739ab6b54f5f4aea29f3f5841fc40e61b1e3b89a95"
},
["structure.columns[].containers[].blocks[]|2.settings.alignment"]: {
  "required": true,
  "type": "object",
  "schemaHash": "5a6d40dd19c05ee913025262e4a5001671aac6913feb634ce0e68f5f65bf6790"
},
["structure.columns[].containers[].blocks[]|2.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["structure.columns[].containers[].blocks[]|2.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["structure.columns[].containers[].blocks[]|2.settings.radius"]: {
  "required": true,
  "type": "object",
  "schemaHash": "77491c918f72594148ebce95e4c92d11695538b6f547a6767d2fff890ae7a68a"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.desktop.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "c6a7ff699a4fa712c9fa55a9c2b0d3ad74f2c553003f34c77f684d541148a799"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.desktop.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76aafbb93390c3dff8b2ae02b12097a3d3738647f00ac4e4e7aa4fb38cee5c2b"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.desktop.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "3bfb5286fc5028d5eabaa11a8db3f7678318acc269d485f50ce2d47c675a58b4"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.desktop.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "65b696cd36e9bba1b6772e1f1b30b41c7c1ead9b9bc4011ef1ee8e9098bd84ca"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.mobile.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "c6a7ff699a4fa712c9fa55a9c2b0d3ad74f2c553003f34c77f684d541148a799"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.mobile.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76aafbb93390c3dff8b2ae02b12097a3d3738647f00ac4e4e7aa4fb38cee5c2b"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.mobile.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "3bfb5286fc5028d5eabaa11a8db3f7678318acc269d485f50ce2d47c675a58b4"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.mobile.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "65b696cd36e9bba1b6772e1f1b30b41c7c1ead9b9bc4011ef1ee8e9098bd84ca"
},
["structure.columns[].containers[].blocks[]|2.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["structure.columns[].containers[].blocks[]|2.settings.paddings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["structure.columns[].containers[].blocks[]|2.settings.paddings.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["structure.columns[].containers[].blocks[]|2.settings.paddings.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["structure.columns[].containers[].blocks[]|2.settings.paddings.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["structure.columns[].containers[].blocks[]|2.settings.paddings.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["structure.columns[].containers[].blocks[]|2.settings.paddings.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["structure.columns[].containers[].blocks[]|2.settings.paddings.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["structure.columns[].containers[].blocks[]|2.settings.paddings.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["structure.columns[].containers[].blocks[]|2.settings.paddings.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["structure.columns[].containers[].blocks[]|2.settings.paddings.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["structure.columns[].containers[].blocks[]|2.settings.paddings.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["structure.columns[].containers[].blocks[]|2.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["structure.columns[].containers[].blocks[]|2.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["structure.columns[].containers[].blocks[]|2.settings.responsiveMobile"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "341814eb6aff7d91bd84e9006aba1a60303f85af77dc4b114c35299d29ccec79"
},
["structure.columns[].containers[].blocks[]|3"]: {
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
["structure.columns[].containers[].blocks[]|3.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["structure.columns[].containers[].blocks[]|3.type"]: {
  "required": true,
  "type": "string",
  "const": "timer",
  "schemaHash": "82cdc2e20bff7e777b2055cc1783d43dc19e28df76b38edeb403fbcd81b24d9d"
},
["structure.columns[].containers[].blocks[]|3.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "d550fb40997b8dc11db9d0dee42d6446b3389c63bb3791a51f50f858588c2ba5"
},
["structure.columns[].containers[].blocks[]|3.settings.altText"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a4475867ad83c5cd99c199dfddf0b8e799ebe5f636bf765a2f4ec2d69e7ead09"
},
["structure.columns[].containers[].blocks[]|3.settings.altText.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b4b3a153ebf7f9907edcb00945ab363971246387c038cfb94b5a08fffd84a3e8"
},
["structure.columns[].containers[].blocks[]|3.settings.altText.addToTitle"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "e930d6bfd7e624cc404d6ac9111b7f5169a3f9e6ccda3f7a9c208027be48f312"
},
["structure.columns[].containers[].blocks[]|3.settings.responsiveMobile"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "a7e49c9de944eb59b182b4170e11f27246a9a6b97991efb30eb44167d8e6e96a"
},
["structure.columns[].containers[].blocks[]|3.settings.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "37536e5cdca2c6a99d26bcca81988a492aa2df1ee3034744cc62643936f6c8ab"
},
["structure.columns[].containers[].blocks[]|3.settings.size.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["structure.columns[].containers[].blocks[]|3.settings.size.desktop.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
},
["structure.columns[].containers[].blocks[]|3.settings.size.desktop.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "35dd650fb6a5f62fe7fc20739ab6b54f5f4aea29f3f5841fc40e61b1e3b89a95"
},
["structure.columns[].containers[].blocks[]|3.settings.size.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["structure.columns[].containers[].blocks[]|3.settings.size.mobile.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
},
["structure.columns[].containers[].blocks[]|3.settings.size.mobile.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "35dd650fb6a5f62fe7fc20739ab6b54f5f4aea29f3f5841fc40e61b1e3b89a95"
},
["structure.columns[].containers[].blocks[]|3.settings.alignment"]: {
  "required": true,
  "type": "object",
  "schemaHash": "5a6d40dd19c05ee913025262e4a5001671aac6913feb634ce0e68f5f65bf6790"
},
["structure.columns[].containers[].blocks[]|3.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["structure.columns[].containers[].blocks[]|3.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["structure.columns[].containers[].blocks[]|3.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "efb2498bfd7c3a684731d96285b8c29553f2e46b13fac6d897a5f507ebc3c9ae"
},
["structure.columns[].containers[].blocks[]|3.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["structure.columns[].containers[].blocks[]|3.settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["structure.columns[].containers[].blocks[]|3.settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["structure.columns[].containers[].blocks[]|3.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["structure.columns[].containers[].blocks[]|3.settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["structure.columns[].containers[].blocks[]|3.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["structure.columns[].containers[].blocks[]|3.settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["structure.columns[].containers[].blocks[]|3.settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["structure.columns[].containers[].blocks[]|3.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["structure.columns[].containers[].blocks[]|3.settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["structure.columns[].containers[].blocks[]|3.settings.endDate"]: {
  "required": true,
  "type": "string",
  "schemaHash": "512befe9ea2fc6099da95661f8b6f26434831be23e431b5670423c8f8cbc163d"
},
["structure.columns[].containers[].blocks[]|3.settings.timeZone"]: {
  "required": true,
  "type": "string",
  "enum": [
    "Africa/Abidjan",
    "Africa/Accra",
    "Africa/Addis_Ababa",
    "Africa/Algiers",
    "Africa/Asmara",
    "Africa/Bamako",
    "Africa/Bangui",
    "Africa/Banjul",
    "Africa/Bissau",
    "Africa/Blantyre",
    "Africa/Brazzaville",
    "Africa/Bujumbura",
    "Africa/Cairo",
    "Africa/Casablanca",
    "Africa/Ceuta",
    "Africa/Conakry",
    "Africa/Dakar",
    "Africa/Dar_es_Salaam",
    "Africa/Djibouti",
    "Africa/Douala",
    "Africa/El_Aaiun",
    "Africa/Freetown",
    "Africa/Gaborone",
    "Africa/Harare",
    "Africa/Johannesburg",
    "Africa/Juba",
    "Africa/Kampala",
    "Africa/Khartoum",
    "Africa/Kigali",
    "Africa/Kinshasa",
    "Africa/Lagos",
    "Africa/Libreville",
    "Africa/Lome",
    "Africa/Luanda",
    "Africa/Lubumbashi",
    "Africa/Lusaka",
    "Africa/Malabo",
    "Africa/Maputo",
    "Africa/Maseru",
    "Africa/Mbabane",
    "Africa/Mogadishu",
    "Africa/Monrovia",
    "Africa/Nairobi",
    "Africa/Ndjamena",
    "Africa/Niamey",
    "Africa/Nouakchott",
    "Africa/Ouagadougou",
    "Africa/Porto-Novo",
    "Africa/Sao_Tome",
    "Africa/Tripoli",
    "Africa/Tunis",
    "Africa/Windhoek",
    "America/Adak",
    "America/Anchorage",
    "America/Anguilla",
    "America/Antigua",
    "America/Araguaina",
    "America/Argentina/Buenos_Aires",
    "America/Argentina/Catamarca",
    "America/Argentina/Cordoba",
    "America/Argentina/Jujuy",
    "America/Argentina/La_Rioja",
    "America/Argentina/Mendoza",
    "America/Argentina/Rio_Gallegos",
    "America/Argentina/Salta",
    "America/Argentina/San_Juan",
    "America/Argentina/San_Luis",
    "America/Argentina/Tucuman",
    "America/Argentina/Ushuaia",
    "America/Aruba",
    "America/Asuncion",
    "America/Atikokan",
    "America/Bahia",
    "America/Bahia_Banderas",
    "America/Barbados",
    "America/Belem",
    "America/Belize",
    "America/Blanc-Sablon",
    "America/Boa_Vista",
    "America/Bogota",
    "America/Boise",
    "America/Cambridge_Bay",
    "America/Campo_Grande",
    "America/Cancun",
    "America/Caracas",
    "America/Cayenne",
    "America/Cayman",
    "America/Chicago",
    "America/Chihuahua",
    "America/Costa_Rica",
    "America/Creston",
    "America/Cuiaba",
    "America/Curacao",
    "America/Danmarkshavn",
    "America/Dawson",
    "America/Dawson_Creek",
    "America/Denver",
    "America/Detroit",
    "America/Dominica",
    "America/Edmonton",
    "America/Eirunepe",
    "America/El_Salvador",
    "America/Fort_Nelson",
    "America/Fortaleza",
    "America/Glace_Bay",
    "America/Godthab",
    "America/Goose_Bay",
    "America/Grand_Turk",
    "America/Grenada",
    "America/Guadeloupe",
    "America/Guatemala",
    "America/Guayaquil",
    "America/Guyana",
    "America/Halifax",
    "America/Havana",
    "America/Hermosillo",
    "America/Indiana/Indianapolis",
    "America/Indiana/Knox",
    "America/Indiana/Marengo",
    "America/Indiana/Petersburg",
    "America/Indiana/Tell_City",
    "America/Indiana/Vevay",
    "America/Indiana/Vincennes",
    "America/Indiana/Winamac",
    "America/Inuvik",
    "America/Iqaluit",
    "America/Jamaica",
    "America/Juneau",
    "America/Kentucky/Louisville",
    "Asia/Novokuznetsk",
    "America/Kentucky/Monticello",
    "America/Kralendijk",
    "America/La_Paz",
    "America/Lima",
    "America/Los_Angeles",
    "America/Lower_Princes",
    "America/Maceio",
    "America/Managua",
    "America/Manaus",
    "America/Marigot",
    "America/Martinique",
    "America/Matamoros",
    "America/Mazatlan",
    "America/Menominee",
    "America/Merida",
    "America/Metlakatla",
    "America/Mexico_City",
    "America/Miquelon",
    "America/Moncton",
    "America/Monterrey",
    "America/Montevideo",
    "America/Montserrat",
    "America/Nassau",
    "America/New_York",
    "America/Nipigon",
    "America/Nome",
    "America/Noronha",
    "America/North_Dakota/Beulah",
    "America/North_Dakota/Center",
    "America/North_Dakota/New_Salem",
    "America/Ojinaga",
    "America/Panama",
    "America/Pangnirtung",
    "America/Paramaribo",
    "America/Phoenix",
    "America/Port-au-Prince",
    "America/Port_of_Spain",
    "America/Porto_Velho",
    "America/Puerto_Rico",
    "America/Punta_Arenas",
    "America/Rainy_River",
    "America/Rankin_Inlet",
    "America/Recife",
    "America/Regina",
    "America/Resolute",
    "America/Rio_Branco",
    "America/Santarem",
    "America/Santiago",
    "America/Santo_Domingo",
    "America/Sao_Paulo",
    "America/Scoresbysund",
    "America/Sitka",
    "America/St_Barthelemy",
    "America/St_Johns",
    "America/St_Kitts",
    "America/St_Lucia",
    "America/St_Thomas",
    "America/St_Vincent",
    "America/Swift_Current",
    "America/Tegucigalpa",
    "America/Thule",
    "America/Thunder_Bay",
    "America/Tijuana",
    "America/Toronto",
    "America/Tortola",
    "America/Vancouver",
    "America/Whitehorse",
    "America/Winnipeg",
    "America/Yakutat",
    "America/Yellowknife",
    "Antarctica/Casey",
    "Antarctica/Davis",
    "Antarctica/DumontDUrville",
    "Antarctica/Macquarie",
    "Antarctica/Mawson",
    "Antarctica/McMurdo",
    "Antarctica/Palmer",
    "Antarctica/Rothera",
    "Antarctica/Syowa",
    "Antarctica/Troll",
    "Antarctica/Vostok",
    "Arctic/Longyearbyen",
    "Asia/Aden",
    "Asia/Almaty",
    "Asia/Amman",
    "Asia/Anadyr",
    "Asia/Aqtau",
    "Asia/Aqtobe",
    "Asia/Ashgabat",
    "Asia/Atyrau",
    "Asia/Baghdad",
    "Asia/Bahrain",
    "Asia/Baku",
    "Asia/Bangkok",
    "Asia/Barnaul",
    "Asia/Beirut",
    "Asia/Bishkek",
    "Asia/Brunei",
    "Asia/Chita",
    "Asia/Choibalsan",
    "Asia/Colombo",
    "Asia/Damascus",
    "Asia/Dhaka",
    "Asia/Dili",
    "Asia/Dubai",
    "Asia/Dushanbe",
    "Asia/Famagusta",
    "Asia/Gaza",
    "Asia/Hebron",
    "Asia/Ho_Chi_Minh",
    "Asia/Hong_Kong",
    "Asia/Hovd",
    "Asia/Irkutsk",
    "Asia/Jakarta",
    "Asia/Jayapura",
    "Asia/Jerusalem",
    "Asia/Kabul",
    "Asia/Kamchatka",
    "Asia/Karachi",
    "Asia/Kathmandu",
    "Asia/Khandyga",
    "Asia/Kolkata",
    "Asia/Krasnoyarsk",
    "Asia/Kuala_Lumpur",
    "Asia/Kuching",
    "Asia/Kuwait",
    "Asia/Macau",
    "Asia/Magadan",
    "Asia/Makassar",
    "Asia/Manila",
    "Asia/Muscat",
    "Asia/Nicosia",
    "Asia/Novosibirsk",
    "Asia/Omsk",
    "Asia/Oral",
    "Asia/Phnom_Penh",
    "Asia/Pontianak",
    "Asia/Pyongyang",
    "Asia/Qatar",
    "Asia/Qyzylorda",
    "Asia/Riyadh",
    "Asia/Sakhalin",
    "Asia/Samarkand",
    "Asia/Seoul",
    "Asia/Shanghai",
    "Asia/Singapore",
    "Asia/Srednekolymsk",
    "Asia/Taipei",
    "Asia/Tashkent",
    "Asia/Tbilisi",
    "Asia/Tehran",
    "Asia/Thimphu",
    "Asia/Tokyo",
    "Asia/Tomsk",
    "Asia/Ulaanbaatar",
    "Asia/Urumqi",
    "Asia/Ust-Nera",
    "Asia/Vientiane",
    "Asia/Vladivostok",
    "Asia/Yakutsk",
    "Asia/Yangon",
    "Asia/Yekaterinburg",
    "Asia/Yerevan",
    "Atlantic/Azores",
    "Atlantic/Bermuda",
    "Atlantic/Canary",
    "Atlantic/Cape_Verde",
    "Atlantic/Faroe",
    "Atlantic/Madeira",
    "Atlantic/Reykjavik",
    "Atlantic/South_Georgia",
    "Atlantic/St_Helena",
    "Atlantic/Stanley",
    "Australia/Adelaide",
    "Australia/Brisbane",
    "Australia/Broken_Hill",
    "Australia/Currie",
    "Australia/Darwin",
    "Australia/Eucla",
    "Australia/Hobart",
    "Australia/Lindeman",
    "Australia/Lord_Howe",
    "Australia/Melbourne",
    "Australia/Perth",
    "Australia/Sydney",
    "Canada/Atlantic",
    "Canada/Central",
    "Canada/Eastern",
    "Canada/Mountain",
    "Canada/Newfoundland",
    "Canada/Pacific",
    "Europe/Amsterdam",
    "Europe/Andorra",
    "Europe/Astrakhan",
    "Europe/Athens",
    "Europe/Belgrade",
    "Europe/Berlin",
    "Europe/Bratislava",
    "Europe/Brussels",
    "Europe/Bucharest",
    "Europe/Budapest",
    "Europe/Busingen",
    "Europe/Chisinau",
    "Europe/Copenhagen",
    "Europe/Dublin",
    "Europe/Gibraltar",
    "Europe/Guernsey",
    "Europe/Helsinki",
    "Europe/Isle_of_Man",
    "Europe/Istanbul",
    "Europe/Jersey",
    "Europe/Kaliningrad",
    "Europe/Kiev",
    "Europe/Kyiv",
    "Europe/Kirov",
    "Europe/Lisbon",
    "Europe/Ljubljana",
    "Europe/London",
    "Europe/Luxembourg",
    "Europe/Madrid",
    "Europe/Malta",
    "Europe/Mariehamn",
    "Europe/Minsk",
    "Europe/Monaco",
    "Europe/Moscow",
    "Europe/Oslo",
    "Europe/Paris",
    "Europe/Podgorica",
    "Europe/Prague",
    "Europe/Riga",
    "Europe/Rome",
    "Europe/Samara",
    "Europe/San_Marino",
    "Europe/Sarajevo",
    "Europe/Saratov",
    "Europe/Simferopol",
    "Europe/Skopje",
    "Europe/Sofia",
    "Europe/Stockholm",
    "Europe/Tallinn",
    "Europe/Tirane",
    "Europe/Ulyanovsk",
    "Europe/Uzhgorod",
    "Europe/Vaduz",
    "Europe/Vatican",
    "Europe/Vienna",
    "Europe/Vilnius",
    "Europe/Volgograd",
    "Europe/Warsaw",
    "Europe/Zagreb",
    "Europe/Zaporozhye",
    "Europe/Zaporizhia",
    "Europe/Zurich",
    "GMT",
    "Indian/Antananarivo",
    "Indian/Chagos",
    "Indian/Christmas",
    "Indian/Cocos",
    "Indian/Comoro",
    "Indian/Kerguelen",
    "Indian/Mahe",
    "Indian/Maldives",
    "Indian/Mauritius",
    "Indian/Mayotte",
    "Indian/Reunion",
    "Pacific/Apia",
    "Pacific/Auckland",
    "Pacific/Bougainville",
    "Pacific/Chatham",
    "Pacific/Chuuk",
    "Pacific/Easter",
    "Pacific/Efate",
    "Pacific/Enderbury",
    "Pacific/Fakaofo",
    "Pacific/Fiji",
    "Pacific/Funafuti",
    "Pacific/Galapagos",
    "Pacific/Gambier",
    "Pacific/Guadalcanal",
    "Pacific/Guam",
    "Pacific/Honolulu",
    "Pacific/Kiritimati",
    "Pacific/Kosrae",
    "Pacific/Kwajalein",
    "Pacific/Majuro",
    "Pacific/Marquesas",
    "Pacific/Midway",
    "Pacific/Nauru",
    "Pacific/Niue",
    "Pacific/Norfolk",
    "Pacific/Noumea",
    "Pacific/Pago_Pago",
    "Pacific/Palau",
    "Pacific/Pitcairn",
    "Pacific/Pohnpei",
    "Pacific/Port_Moresby",
    "Pacific/Rarotonga",
    "Pacific/Saipan",
    "Pacific/Tahiti",
    "Pacific/Tarawa",
    "Pacific/Tongatapu",
    "Pacific/Wake",
    "Pacific/Wallis",
    "US/Alaska",
    "US/Arizona",
    "US/Central",
    "US/Eastern",
    "US/Hawaii",
    "US/Mountain",
    "US/Pacific",
    "UTC"
  ],
  "schemaHash": "a60791c7bd997624175e5ce942b961e03be8caff0688d64714c220d3e3069018"
},
["structure.columns[].containers[].blocks[]|3.settings.link"]: {
  "required": true,
  "schemaHash": "f16d2a1c75e4e368c52096f5f392478b7362f12092f61565b2505fc4904bfda5"
},
["structure.columns[].containers[].blocks[]|3.settings.link|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "fa375d8d3921bf6853043c6e3e9230051e2eb38d8de4a20ed66b4198059036f5"
},
["structure.columns[].containers[].blocks[]|3.settings.link|0.type"]: {
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
["structure.columns[].containers[].blocks[]|3.settings.link|0.href"]: {
  "required": true,
  "type": "string",
  "schemaHash": "56d55f6fcdb01c0c00118da460ddac6a6ae331e81fa89660e48ae90eeceb01bd"
},
["structure.columns[].containers[].blocks[]|3.settings.link|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["structure.columns[].containers[].blocks[]|3.settings.displayDays"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "b462dde7c9edde64ea0ef3b7baa66de119ee6b45e1275970be7d07062ca8e996"
},
["structure.columns[].containers[].blocks[]|3.settings.labelsLetterCase"]: {
  "required": false,
  "type": "string",
  "enum": [
    "CAPITALIZE",
    "UPPER",
    "LOWER"
  ],
  "schemaHash": "c59c64cc82659b3f4d98141fc48d64d75303e9682323d902d0767caca9a19c31"
},
["structure.columns[].containers[].blocks[]|3.settings.separator"]: {
  "required": true,
  "type": "string",
  "schemaHash": "3954de1555ee8336646468d5dad24e0136cabe4665ebb85a3b60f14913067a69"
},
["structure.columns[].containers[].blocks[]|3.settings.labelsLanguage"]: {
  "required": true,
  "type": "string",
  "enum": [
    "id",
    "ms",
    "bs",
    "bg",
    "da",
    "de",
    "et",
    "en",
    "es",
    "fr",
    "hr",
    "it",
    "lv",
    "lt",
    "hu",
    "nl",
    "no",
    "pl",
    "pt",
    "ro",
    "sk",
    "sl",
    "sr",
    "fi",
    "sv",
    "vi",
    "tr",
    "cz",
    "el",
    "ru",
    "uk",
    "he",
    "ar",
    "th",
    "zh",
    "ja",
    "ko"
  ],
  "schemaHash": "0a4857291fe8770b399d2f933a25d2c3f94ec8ec39e68be73d3918997d7f3d7b"
},
["structure.columns[].containers[].blocks[]|3.settings.retinaDisplaySupport"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "5c951508c542a492ea27007225a1c8d93656bc868ca3dd23369d2586fcad9b55"
},
["structure.columns[].containers[].blocks[]|3.settings.expirationImageSrc"]: {
  "required": true,
  "type": "string",
  "schemaHash": "cc22f8ec14817471274ae0fddcdc70ee916ee0e4e058c2adf4ccefed5b83163f"
},
["structure.columns[].containers[].blocks[]|3.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["structure.columns[].containers[].blocks[]|3.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["structure.columns[].containers[].blocks[]|3.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["structure.columns[].containers[].blocks[]|3.settings.digitsFontFamily"]: {
  "required": true,
  "type": "string",
  "enum": [
    "arial,'helvetica neue',helvetica,sans-serif",
    "'comic sans ms','marker felt-thin',arial,sans-serif",
    "'courier new',courier,'lucida sans typewriter','lucida typewriter',monospace",
    "georgia,times,'times new roman',serif",
    "helvetica,'helvetica neue',arial,verdana,sans-serif",
    "'lucida sans unicode','lucida grande',sans-serif",
    "tahoma,verdana,segoe,sans-serif",
    "'times new roman',times,baskerville,georgia,serif",
    "'trebuchet ms','lucida grande','lucida sans unicode','lucida sans',tahoma,sans-serif",
    "verdana,geneva,sans-serif",
    "arvo,courier,georgia,serif",
    "lato,'helvetica neue',helvetica,arial,sans-serif",
    "lora,georgia,'times new roman',serif",
    "merriweather,georgia,'times new roman',serif",
    "'merriweather sans','helvetica neue',helvetica,arial,sans-serif",
    "'noticia text',georgia,'times new roman',serif",
    "'open sans','helvetica neue',helvetica,arial,sans-serif",
    "'playfair display',georgia,'times new roman',serif",
    "roboto,'helvetica neue',helvetica,arial,sans-serif",
    "'source sans pro','helvetica neue',helvetica,arial,sans-serif"
  ],
  "schemaHash": "efd732b80d28c0122ee3a66deffd934c4ce1b8e509136a46f1965cd3af5f03a5"
},
["structure.columns[].containers[].blocks[]|3.settings.digitsFontSize"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "8252330452d3e452f1f9e987f5f9fcc0c1563a90eb85bcf1b9a45c227808d935"
}
};


export default {
["$.stripes[].settings.darkTheme"]: {
  "required": false,
  "type": "object",
  "schemaHash": "1e8a04f99e2fd64ca31ef52e0ec6acef4ef0d81594d1dc87c628667f12819915"
},
["$.stripes[].settings.darkTheme.stripeBackgroundColor"]: {
  "required": false,
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "a153cd90584c3ccdbe9d03b34cb3c655257eacd24f535b5a005fdbf1390316cd"
},
["$.stripes[].settings.darkTheme.stripeBackgroundColor|0"]: {
  "required": false,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["$.stripes[].settings.darkTheme.stripeBackgroundColor|1"]: {
  "required": false,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.stripes[].settings.darkTheme.contentBackgroundColor"]: {
  "required": false,
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "ab665432e97d6e8d8cb98836a612df3f41a10812490e6689b4e1cd6c2be7f084"
},
["$.stripes[].settings.darkTheme.contentBackgroundColor|0"]: {
  "required": false,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["$.stripes[].settings.darkTheme.contentBackgroundColor|1"]: {
  "required": false,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.stripes[].settings.darkTheme.backgroundImage"]: {
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
["$.stripes[].moduleId"]: {
  "required": false,
  "type": "number",
  "readOnly": true,
  "schemaHash": "768d6e5c5fa0cf67b2e8bcbc82c696165408441bf04787bb4a06c387ed7169f9"
},
["$.stripes[].structures"]: {
  "required": false,
  "type": "array",
  "schemaHash": "14742721b8a86341ea55e901918ec812b80a90e3b2f7b76a75fed5a0026f2a87"
},
["$.stripes[].structures[]"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "d61a9383c0829f0ec5ed787d6a85fbc255607185fe33cc2b6fce744cbd9812a7"
},
["$.stripes[].structures[].id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "42004ea51dea97fe2e0b8d4d5e6bba05f0a347199ac57211be31970cd6b963a7"
},
["$.stripes[].structures[].settings"]: {
  "required": false,
  "type": "object",
  "schemaHash": "f9e09cca51410ea0413d68e607f324f9203c85b109e0381c201966ca609e2758"
},
["$.stripes[].structures[].settings.backgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["$.stripes[].structures[].settings.backgroundImage"]: {
  "required": false,
  "type": "object",
  "schemaHash": "dfc42a1ddc8b79848f31da91a65e321673f0bed88a7497438803eef0b8014e50"
},
["$.stripes[].structures[].settings.backgroundImage.path"]: {
  "required": true,
  "type": "string",
  "schemaHash": "16208d1e33d8319d4694e51b4edb93a5da5b954b3bc79281887f27e7894ee3ca"
},
["$.stripes[].structures[].settings.backgroundImage.repeat"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["$.stripes[].structures[].settings.backgroundImage.x"]: {
  "required": true,
  "type": "string",
  "schemaHash": "da6e1d7cd61492fddf768d0ab72afbd2a51e56e6a3bc744db9449992f030f3c1"
},
["$.stripes[].structures[].settings.backgroundImage.y"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c202195a934f3206caad05d4917edf359b473fcbd618ac0e8c7be3504bfda45e"
},
["$.stripes[].structures[].settings.backgroundImage.sizeX"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.stripes[].structures[].settings.backgroundImage.sizeY"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.stripes[].structures[].settings.border"]: {
  "required": true,
  "type": "object",
  "schemaHash": "dd0a3c911e673ccbedf16997b948eee2a85e978a8001e2fdde28ff8af0eb0684"
},
["$.stripes[].structures[].settings.border.top"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["$.stripes[].structures[].settings.border.top.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["$.stripes[].structures[].settings.border.top.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["$.stripes[].structures[].settings.border.right"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["$.stripes[].structures[].settings.border.right.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["$.stripes[].structures[].settings.border.right.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["$.stripes[].structures[].settings.border.bottom"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["$.stripes[].structures[].settings.border.bottom.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["$.stripes[].structures[].settings.border.bottom.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["$.stripes[].structures[].settings.border.left"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["$.stripes[].structures[].settings.border.left.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["$.stripes[].structures[].settings.border.left.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["$.stripes[].structures[].settings.border.style"]: {
  "required": true,
  "type": "string",
  "enum": [
    "solid",
    "dashed",
    "dotted"
  ],
  "schemaHash": "4dccba551d73ee1e024ebf753a1823f51e085b0195de30d1842495dae37ae465"
},
["$.stripes[].structures[].settings.borderRadius"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["$.stripes[].structures[].settings.borderRadius.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "c6a7ff699a4fa712c9fa55a9c2b0d3ad74f2c553003f34c77f684d541148a799"
},
["$.stripes[].structures[].settings.borderRadius.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76aafbb93390c3dff8b2ae02b12097a3d3738647f00ac4e4e7aa4fb38cee5c2b"
},
["$.stripes[].structures[].settings.borderRadius.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "3bfb5286fc5028d5eabaa11a8db3f7678318acc269d485f50ce2d47c675a58b4"
},
["$.stripes[].structures[].settings.borderRadius.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "65b696cd36e9bba1b6772e1f1b30b41c7c1ead9b9bc4011ef1ee8e9098bd84ca"
},
["$.stripes[].structures[].settings.columnsGap"]: {
  "required": false,
  "type": "object",
  "schemaHash": "e314dc885a5be620ab9989d35db6525c5fce6109a2df110933a1aa18bad88b37"
},
["$.stripes[].structures[].settings.columnsGap.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f8e86c85e3c13598b52d2fcaf5b9a04f06b9c1880f2f570cba3fa2164a90034f"
},
["$.stripes[].structures[].settings.columnsGap.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1c608db105fddec886256a3c10e55e6d615c523ae85ff8151473e5691eecf214"
},
["$.stripes[].structures[].settings.responsiveMobile"]: {
  "required": false,
  "type": "boolean",
  "schemaHash": "a1c705f2dc6432c9ae215a12a167d72e50f92806a89ddc9f4ffdd7f21a16f86c"
},
["$.stripes[].structures[].settings.responsiveMobileContainersInversion"]: {
  "required": false,
  "type": "boolean",
  "schemaHash": "0f71ec7dfe52440e2025b2edda7f5aa848d637a7506ac6fbefefc9926a49086a"
},
["$.stripes[].structures[].settings.padding"]: {
  "required": false,
  "type": "object",
  "schemaHash": "dec38504fdc6a6c698fb266ec9063472b4fa167eacf73db80423b577083027fe"
},
["$.stripes[].structures[].settings.padding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b0436d0d3e471e0145a05542ee662b3c21bb774c2c6dca85be780661b52d914e"
},
["$.stripes[].structures[].settings.padding.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dedd9a125b9b24dc461951aefa50c4abaf1a6fc4d072d7cc50e97525ce82f60d"
},
["$.stripes[].structures[].settings.padding.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "0de0b1b8b4e02994b9415b401b414015f9024e9336e605c66dc0bce7679cf65d"
},
["$.stripes[].structures[].settings.padding.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9a3a2949896ce1f3f7048146819d3fa9c52198d7a2a872211526cc1643540a62"
},
["$.stripes[].structures[].settings.padding.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76eb193d1dc62ed65e8fa68c05ddf8c469b5d2f74365e34f38707b2c39eab506"
},
["$.stripes[].structures[].settings.padding.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b0436d0d3e471e0145a05542ee662b3c21bb774c2c6dca85be780661b52d914e"
},
["$.stripes[].structures[].settings.padding.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dedd9a125b9b24dc461951aefa50c4abaf1a6fc4d072d7cc50e97525ce82f60d"
},
["$.stripes[].structures[].settings.padding.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "0de0b1b8b4e02994b9415b401b414015f9024e9336e605c66dc0bce7679cf65d"
},
["$.stripes[].structures[].settings.padding.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9a3a2949896ce1f3f7048146819d3fa9c52198d7a2a872211526cc1643540a62"
},
["$.stripes[].structures[].settings.padding.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76eb193d1dc62ed65e8fa68c05ddf8c469b5d2f74365e34f38707b2c39eab506"
},
["$.stripes[].structures[].settings.margins"]: {
  "required": false,
  "type": "object",
  "schemaHash": "9b058bc6b0923ddd47fc45c6470fe9e0dcc26877eca8cc56ec6bd3536c846bfa"
},
["$.stripes[].structures[].settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b0436d0d3e471e0145a05542ee662b3c21bb774c2c6dca85be780661b52d914e"
},
["$.stripes[].structures[].settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dedd9a125b9b24dc461951aefa50c4abaf1a6fc4d072d7cc50e97525ce82f60d"
},
["$.stripes[].structures[].settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "0de0b1b8b4e02994b9415b401b414015f9024e9336e605c66dc0bce7679cf65d"
},
["$.stripes[].structures[].settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9a3a2949896ce1f3f7048146819d3fa9c52198d7a2a872211526cc1643540a62"
},
["$.stripes[].structures[].settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76eb193d1dc62ed65e8fa68c05ddf8c469b5d2f74365e34f38707b2c39eab506"
},
["$.stripes[].structures[].settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b0436d0d3e471e0145a05542ee662b3c21bb774c2c6dca85be780661b52d914e"
},
["$.stripes[].structures[].settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dedd9a125b9b24dc461951aefa50c4abaf1a6fc4d072d7cc50e97525ce82f60d"
},
["$.stripes[].structures[].settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "0de0b1b8b4e02994b9415b401b414015f9024e9336e605c66dc0bce7679cf65d"
},
["$.stripes[].structures[].settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9a3a2949896ce1f3f7048146819d3fa9c52198d7a2a872211526cc1643540a62"
},
["$.stripes[].structures[].settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76eb193d1dc62ed65e8fa68c05ddf8c469b5d2f74365e34f38707b2c39eab506"
},
["$.stripes[].structures[].settings.includeInOutput"]: {
  "required": false,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "0ba72a350c5ed10a54488496b876d8253b024afc31114371c4aa85b6f0853c90"
},
["$.stripes[].structures[].settings.hideElement"]: {
  "required": false,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "43c2c295c17ab9927211612d970c0a5f393fd3806e9ae4a07049579758b3fe42"
},
["$.stripes[].structures[].settings.darkTheme"]: {
  "required": false,
  "type": "object",
  "schemaHash": "6b87aae70f3438944f91a6bbce41c69a57c2fb978c696f801c2a12b5dea717de"
},
["$.stripes[].structures[].settings.darkTheme.backgroundColor"]: {
  "required": false,
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "b38b60f81b8e789d4a2c399ed472748d2898acf4dae3f74cc5ee567c748fb26f"
},
["$.stripes[].structures[].settings.darkTheme.backgroundColor|0"]: {
  "required": false,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["$.stripes[].structures[].settings.darkTheme.backgroundColor|1"]: {
  "required": false,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.stripes[].structures[].settings.darkTheme.backgroundImage"]: {
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
["$.stripes[].structures[].moduleId"]: {
  "required": false,
  "type": "number",
  "readOnly": true,
  "schemaHash": "776d2d8294aba1b49b377658141df44b3edc272a1e5c24153529484508e3b764"
},
["$.stripes[].structures[].columns"]: {
  "required": false,
  "type": "array",
  "schemaHash": "0a2a18eb99a10b6334d48845f971e66cd324ecd6cf1552a4604fb23b739d2e1a"
},
["$.stripes[].structures[].columns[]"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "6e93598985d12f26d1501e8bf015207dd75b347b5e0dd0ddd051d69b01fba8dc"
},
["$.stripes[].structures[].columns[].id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c027226944be8128711739cc24995fbc3653b0f4bd0e3d4e28dcc439735be130"
},
["$.stripes[].structures[].columns[].settings"]: {
  "required": false,
  "type": "object",
  "schemaHash": "d4ea49530b875e80d3ed20028edc09f574018c4371f79e53656eaeeeadc83699"
},
["$.stripes[].structures[].columns[].settings.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "5b79844cc40029b38f51f2c2ffd918fc95b0e6782ad8f95952f297e55d6673ae"
},
["$.stripes[].structures[].columns[].containers"]: {
  "required": true,
  "type": "array",
  "schemaHash": "1e4a3971a198b7cbe0dbc8b55521142df63a6f4714a4688bb033dec1d61665d7"
},
["$.stripes[].structures[].columns[].containers[]"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "08e7e579170c563faaa68c2ba2ae8d02ea6ee7c94020fca2137a1c40e1575147"
},
["$.stripes[].structures[].columns[].containers[].id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "380155b942a4d8b8cd37f1baf475c42f30bf72f300cb6191489845e054b57df4"
},
["$.stripes[].structures[].columns[].containers[].settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "22c9c58113a9510e9ac16edc66a390310a7353f25ed2920baa8d0284ee6e60bd"
},
["$.stripes[].structures[].columns[].containers[].settings.padding"]: {
  "required": true,
  "type": "object",
  "schemaHash": "2f13dc68b2b8d2e768b8ddc88b73d0ebec7b6bad5067323262c7ea3d99ffed14"
},
["$.stripes[].structures[].columns[].containers[].settings.padding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b0436d0d3e471e0145a05542ee662b3c21bb774c2c6dca85be780661b52d914e"
},
["$.stripes[].structures[].columns[].containers[].settings.padding.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dedd9a125b9b24dc461951aefa50c4abaf1a6fc4d072d7cc50e97525ce82f60d"
},
["$.stripes[].structures[].columns[].containers[].settings.padding.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "0de0b1b8b4e02994b9415b401b414015f9024e9336e605c66dc0bce7679cf65d"
},
["$.stripes[].structures[].columns[].containers[].settings.padding.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9a3a2949896ce1f3f7048146819d3fa9c52198d7a2a872211526cc1643540a62"
},
["$.stripes[].structures[].columns[].containers[].settings.padding.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76eb193d1dc62ed65e8fa68c05ddf8c469b5d2f74365e34f38707b2c39eab506"
},
["$.stripes[].structures[].columns[].containers[].settings.padding.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b0436d0d3e471e0145a05542ee662b3c21bb774c2c6dca85be780661b52d914e"
},
["$.stripes[].structures[].columns[].containers[].settings.padding.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dedd9a125b9b24dc461951aefa50c4abaf1a6fc4d072d7cc50e97525ce82f60d"
},
["$.stripes[].structures[].columns[].containers[].settings.padding.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "0de0b1b8b4e02994b9415b401b414015f9024e9336e605c66dc0bce7679cf65d"
},
["$.stripes[].structures[].columns[].containers[].settings.padding.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9a3a2949896ce1f3f7048146819d3fa9c52198d7a2a872211526cc1643540a62"
},
["$.stripes[].structures[].columns[].containers[].settings.padding.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76eb193d1dc62ed65e8fa68c05ddf8c469b5d2f74365e34f38707b2c39eab506"
},
["$.stripes[].structures[].columns[].containers[].settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["$.stripes[].structures[].columns[].containers[].settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["$.stripes[].structures[].columns[].containers[].settings.backgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["$.stripes[].structures[].columns[].containers[].settings.backgroundImage"]: {
  "required": false,
  "type": "object",
  "schemaHash": "bb7e79c55a455f275b417bb6cba33dd77279eec722e6f721cf7f76e208111b91"
},
["$.stripes[].structures[].columns[].containers[].settings.backgroundImage.path"]: {
  "required": true,
  "type": "string",
  "schemaHash": "16208d1e33d8319d4694e51b4edb93a5da5b954b3bc79281887f27e7894ee3ca"
},
["$.stripes[].structures[].columns[].containers[].settings.backgroundImage.repeat"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["$.stripes[].structures[].columns[].containers[].settings.backgroundImage.x"]: {
  "required": true,
  "type": "string",
  "schemaHash": "da6e1d7cd61492fddf768d0ab72afbd2a51e56e6a3bc744db9449992f030f3c1"
},
["$.stripes[].structures[].columns[].containers[].settings.backgroundImage.y"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c202195a934f3206caad05d4917edf359b473fcbd618ac0e8c7be3504bfda45e"
},
["$.stripes[].structures[].columns[].containers[].settings.backgroundImage.sizeX"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.stripes[].structures[].columns[].containers[].settings.backgroundImage.sizeY"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.stripes[].structures[].columns[].containers[].settings.border"]: {
  "required": true,
  "type": "object",
  "schemaHash": "dd0a3c911e673ccbedf16997b948eee2a85e978a8001e2fdde28ff8af0eb0684"
},
["$.stripes[].structures[].columns[].containers[].settings.border.top"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["$.stripes[].structures[].columns[].containers[].settings.border.top.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["$.stripes[].structures[].columns[].containers[].settings.border.top.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["$.stripes[].structures[].columns[].containers[].settings.border.right"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["$.stripes[].structures[].columns[].containers[].settings.border.right.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["$.stripes[].structures[].columns[].containers[].settings.border.right.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["$.stripes[].structures[].columns[].containers[].settings.border.bottom"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["$.stripes[].structures[].columns[].containers[].settings.border.bottom.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["$.stripes[].structures[].columns[].containers[].settings.border.bottom.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["$.stripes[].structures[].columns[].containers[].settings.border.left"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["$.stripes[].structures[].columns[].containers[].settings.border.left.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["$.stripes[].structures[].columns[].containers[].settings.border.left.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["$.stripes[].structures[].columns[].containers[].settings.border.style"]: {
  "required": true,
  "type": "string",
  "enum": [
    "solid",
    "dashed",
    "dotted"
  ],
  "schemaHash": "4dccba551d73ee1e024ebf753a1823f51e085b0195de30d1842495dae37ae465"
},
["$.stripes[].structures[].columns[].containers[].settings.radius"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["$.stripes[].structures[].columns[].containers[].settings.radius.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "c6a7ff699a4fa712c9fa55a9c2b0d3ad74f2c553003f34c77f684d541148a799"
},
["$.stripes[].structures[].columns[].containers[].settings.radius.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76aafbb93390c3dff8b2ae02b12097a3d3738647f00ac4e4e7aa4fb38cee5c2b"
},
["$.stripes[].structures[].columns[].containers[].settings.radius.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "3bfb5286fc5028d5eabaa11a8db3f7678318acc269d485f50ce2d47c675a58b4"
},
["$.stripes[].structures[].columns[].containers[].settings.radius.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "65b696cd36e9bba1b6772e1f1b30b41c7c1ead9b9bc4011ef1ee8e9098bd84ca"
},
["$.stripes[].structures[].columns[].containers[].settings.darkTheme"]: {
  "required": false,
  "type": "object",
  "schemaHash": "4a24b457315f176574d9b069c09ffc196f8aeab1b4de744bebe8c635213db3b3"
},
["$.stripes[].structures[].columns[].containers[].settings.darkTheme.backgroundColor"]: {
  "required": false,
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "b38b60f81b8e789d4a2c399ed472748d2898acf4dae3f74cc5ee567c748fb26f"
},
["$.stripes[].structures[].columns[].containers[].settings.darkTheme.backgroundColor|0"]: {
  "required": false,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["$.stripes[].structures[].columns[].containers[].settings.darkTheme.backgroundColor|1"]: {
  "required": false,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.stripes[].structures[].columns[].containers[].settings.darkTheme.backgroundImage"]: {
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
["$.stripes[].structures[].columns[].containers[].moduleId"]: {
  "required": false,
  "type": "number",
  "readOnly": true,
  "schemaHash": "a594f2ebe0fc5c004b152ee01878131ef29c9684917a24fb2155715457fed61c"
},
["$.stripes[].structures[].columns[].containers[].blocks"]: {
  "required": false,
  "type": "array",
  "schemaHash": "641e285ac00c8aac980b3c626ef6471ba0b55ff7349a1acdc4cd38ed25120a78"
},
["$.stripes[].structures[].columns[].containers[].blocks[]"]: {
  "required": true,
  "schemaHash": "ada97c1ed3413f8637fe2aea69bbe0add20beee79f6fbae7e5b29bd1aa7acae1"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0"]: {
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
["$.stripes[].structures[].columns[].containers[].blocks[]|0.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.type"]: {
  "required": true,
  "type": "string",
  "const": "text",
  "schemaHash": "e9a1c4855d31ed99336125118d369a2b7e0313cbe83dad4c864eb3c031eb698c"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings"]: {
  "required": false,
  "type": "object",
  "schemaHash": "9119e37ac31455c3e3b497658119c983af4e84a814b0672d2229b91880f5f37b"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.fontColor"]: {
  "required": false,
  "type": "string",
  "schemaHash": "b61b2b9f199526eb3295f9e2ced901958e0497a6c2750820f57bee70b1158827"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.rightToLeftTextDirection"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.alignment"]: {
  "required": false,
  "type": "object",
  "schemaHash": "c0cbe70569a2b9985283a85c0412d3816f80ab79f635ce40fbf5887bad3e8f4e"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.alignment.desktop"]: {
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
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.alignment.mobile"]: {
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
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.fixedHeight"]: {
  "required": false,
  "type": "object",
  "schemaHash": "a39f50192654cd59cc8e85339d6978fa5dee0fb021cb44b41699b414f214ecb5"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.fixedHeight.desktop"]: {
  "required": false,
  "type": "object",
  "schemaHash": "db8061168303c6be1f45c9923089167dbd85cbaa25f9f67f2eb3565207a3e327"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.fixedHeight.desktop.height"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "474f4d9296fe9ab42673b8752a6fed0e522587f12abaf9751a03797acb4d96b5"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.fixedHeight.desktop.verticalAlignment"]: {
  "required": false,
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ],
  "schemaHash": "c145b8d0e8d0ecce2a0a2622ad17ecd4c5584fda7205631d1cb263a76928fba8"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.fixedHeight.mobile"]: {
  "required": false,
  "type": "object",
  "schemaHash": "b1801ad48db8da15cc2a86a1d31e4251c1eda78abb0a74c1f8be0e8a756a940f"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.fixedHeight.mobile.height"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "474f4d9296fe9ab42673b8752a6fed0e522587f12abaf9751a03797acb4d96b5"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.fixedHeight.mobile.verticalAlignment"]: {
  "required": false,
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ],
  "schemaHash": "c145b8d0e8d0ecce2a0a2622ad17ecd4c5584fda7205631d1cb263a76928fba8"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.padding"]: {
  "required": true,
  "type": "object",
  "schemaHash": "42aeaafa11852293724925168414611fb3309ce210ecc601a17568e4c4506fff"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.padding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "923752398804419d65fd5fa6d63fb00fbdfdee1a47e0296f69434adc03e29e78"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.padding.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.padding.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.padding.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.padding.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.padding.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "923752398804419d65fd5fa6d63fb00fbdfdee1a47e0296f69434adc03e29e78"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.padding.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.padding.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.padding.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.padding.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.backgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.letterSpacing"]: {
  "required": false,
  "type": "object",
  "schemaHash": "6c0a48468186e0c8d560f840814d1fecd1737259415b326aae6ee0c5787405d9"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.letterSpacing.value"]: {
  "required": true,
  "type": "number",
  "schemaHash": "92ecef150d33ac7d09603020589d690900d2fd2ae8d10a0a9cfd6936384e8b05"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.letterSpacing.unit"]: {
  "required": true,
  "type": "string",
  "enum": [
    "px",
    "em"
  ],
  "schemaHash": "c679b09b2ab5a8c336c639b8750e66205b88ff18864947604378c69a6944f97e"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|0.content"]: {
  "required": false,
  "type": "string",
  "schemaHash": "60103c69a46aa5e06fb8015ba33f2629730adca94ed2130a7319cc99447e3fa1"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1"]: {
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
["$.stripes[].structures[].columns[].containers[].blocks[]|1.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.type"]: {
  "required": true,
  "type": "string",
  "const": "image",
  "schemaHash": "f91d29b5ca92f549d52a1729a378abdde7d9b342856784a42f81c4e7251303a7"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "987f44fff38a9fcd62e353101b3823e640287645499d853d1e4a670f7d80776d"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.src"]: {
  "required": true,
  "type": "string",
  "schemaHash": "cc22f8ec14817471274ae0fddcdc70ee916ee0e4e058c2adf4ccefed5b83163f"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.link"]: {
  "required": false,
  "type": "object",
  "schemaHash": "796892a0a67d7975ad6b69e46842aed905ee794b205e0c0f6e0841569314f221"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.link.type"]: {
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
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.link.href"]: {
  "required": true,
  "type": "string",
  "schemaHash": "56d55f6fcdb01c0c00118da460ddac6a6ae331e81fa89660e48ae90eeceb01bd"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.altText"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a4475867ad83c5cd99c199dfddf0b8e799ebe5f636bf765a2f4ec2d69e7ead09"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.altText.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b4b3a153ebf7f9907edcb00945ab363971246387c038cfb94b5a08fffd84a3e8"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.altText.addToTitle"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "e930d6bfd7e624cc404d6ac9111b7f5169a3f9e6ccda3f7a9c208027be48f312"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "37536e5cdca2c6a99d26bcca81988a492aa2df1ee3034744cc62643936f6c8ab"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.size.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.size.desktop.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.size.desktop.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "35dd650fb6a5f62fe7fc20739ab6b54f5f4aea29f3f5841fc40e61b1e3b89a95"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.size.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.size.mobile.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.size.mobile.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "35dd650fb6a5f62fe7fc20739ab6b54f5f4aea29f3f5841fc40e61b1e3b89a95"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.alignment"]: {
  "required": true,
  "type": "object",
  "schemaHash": "5a6d40dd19c05ee913025262e4a5001671aac6913feb634ce0e68f5f65bf6790"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.radius"]: {
  "required": true,
  "type": "object",
  "schemaHash": "77491c918f72594148ebce95e4c92d11695538b6f547a6767d2fff890ae7a68a"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.radius.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.radius.desktop.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "c6a7ff699a4fa712c9fa55a9c2b0d3ad74f2c553003f34c77f684d541148a799"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.radius.desktop.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76aafbb93390c3dff8b2ae02b12097a3d3738647f00ac4e4e7aa4fb38cee5c2b"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.radius.desktop.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "3bfb5286fc5028d5eabaa11a8db3f7678318acc269d485f50ce2d47c675a58b4"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.radius.desktop.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "65b696cd36e9bba1b6772e1f1b30b41c7c1ead9b9bc4011ef1ee8e9098bd84ca"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.radius.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.radius.mobile.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "c6a7ff699a4fa712c9fa55a9c2b0d3ad74f2c553003f34c77f684d541148a799"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.radius.mobile.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76aafbb93390c3dff8b2ae02b12097a3d3738647f00ac4e4e7aa4fb38cee5c2b"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.radius.mobile.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "3bfb5286fc5028d5eabaa11a8db3f7678318acc269d485f50ce2d47c675a58b4"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.radius.mobile.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "65b696cd36e9bba1b6772e1f1b30b41c7c1ead9b9bc4011ef1ee8e9098bd84ca"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "efb2498bfd7c3a684731d96285b8c29553f2e46b13fac6d897a5f507ebc3c9ae"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.responsiveMobile"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "5488d5a30aa799c16d2a2e70182680c408d6b79973e0120c2259b2a142a87363"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|2"]: {
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
["$.stripes[].structures[].columns[].containers[].blocks[]|2.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|2.type"]: {
  "required": true,
  "type": "string",
  "const": "video",
  "schemaHash": "fc90ddf303f474b1fad5c7baadbf1773f3bb6c2dacaf669c10b0fc256521730f"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|2.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "3272677b3785aec173d0170f736bbcda85be6fcff62315f9cf5407f812c12a9c"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|2.settings.videoLink"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|2.settings.altText"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a4475867ad83c5cd99c199dfddf0b8e799ebe5f636bf765a2f4ec2d69e7ead09"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|2.settings.altText.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b4b3a153ebf7f9907edcb00945ab363971246387c038cfb94b5a08fffd84a3e8"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|2.settings.altText.addToTitle"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "e930d6bfd7e624cc404d6ac9111b7f5169a3f9e6ccda3f7a9c208027be48f312"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|2.settings.customThumbnail"]: {
  "required": false,
  "type": "object",
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|2.settings.customThumbnail.src"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|2.settings.playButtonStyle"]: {
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
["$.stripes[].structures[].columns[].containers[].blocks[]|2.settings.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "37536e5cdca2c6a99d26bcca81988a492aa2df1ee3034744cc62643936f6c8ab"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|2.settings.size.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|2.settings.size.desktop.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|2.settings.size.desktop.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "35dd650fb6a5f62fe7fc20739ab6b54f5f4aea29f3f5841fc40e61b1e3b89a95"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|2.settings.size.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["$.stripes[].structures[].columns[].containers[].blocks[]|2.settings.size.mobile.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
}
};

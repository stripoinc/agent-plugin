
export default {
["stripe.structures[].columns[].containers[].blocks[]|8.settings.items[].image.size.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "b061442e44206d675cf7875e3503d7e8be9c03beef0aa104600cf5a3c4beb93e"
},
["stripe.structures[].columns[].containers[].blocks[]|8.settings.items[].image.alignment"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "62abdcc2c56bdf3f241c1c7a30b1ddecea459292e841ed6531bce0659329661d"
},
["stripe.structures[].columns[].containers[].blocks[]|8.settings.items[].image.indent"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "2d001cc3e51211d1913ef6d98aa431eb29dd5351aa6dc67f77f75a97a8a13285"
},
["stripe.structures[].columns[].containers[].blocks[]|8.settings.items[].image.altText"]: {
  "required": true,
  "type": "string",
  "schemaHash": "8ec6f1f96b0ab15c7e353f5de46badff477995efa88b0ae8c4dbedceb058653a"
},
["stripe.structures[].columns[].containers[].blocks[]|8.settings.items[].hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["stripe.structures[].columns[].containers[].blocks[]|8.settings.items[].colors"]: {
  "required": false,
  "type": "object",
  "schemaHash": "0d24cb6ed26a629460d9b14c4fe5ac88712cda45809cb264ef752809c0bf0dde"
},
["stripe.structures[].columns[].containers[].blocks[]|8.settings.items[].colors.link"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["stripe.structures[].columns[].containers[].blocks[]|8.settings.items[].colors.background"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["stripe.structures[].columns[].containers[].blocks[]|9"]: {
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
["stripe.structures[].columns[].containers[].blocks[]|9.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "987f44fff38a9fcd62e353101b3823e640287645499d853d1e4a670f7d80776d"
},
["stripe.structures[].columns[].containers[].blocks[]|9.type"]: {
  "required": true,
  "type": "string",
  "const": "unknown",
  "schemaHash": "45efa89ab4e28a09898565634f4734cbd5168c9f477a3ba376e6bffdd98bf1d7"
},
["stripe.structures[].columns[].containers[].blocks[]|9.settings"]: {
  "required": false,
  "type": "object",
  "schemaHash": "3b2717c5fefe666dcb4421b8b66fa42db96ae03042b08732cd1b298318cdc300"
},
["stripe.structures[].columns[].containers[].blocks[]|9.content"]: {
  "required": true,
  "type": "string",
  "schemaHash": "ef03ba765c158a011bfa9cbddf997af051446505bb1f039d2daababb7390ef0c"
},
["stripe.structures[].columns[].containers[].blocks[]|9.extension"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "70b148906c066e204257904b506ca35b8f1a1332060cfdd5f65f768926f82e7b"
},
["structure"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "d3ed700eb685f5562da4ec280ae8326d691808138ab048f662b37f1b91f3114e"
},
["structure.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e39228ecadfa5ae035b2d2737d59808662a1a1267336338ad5ea9c35d9f740c9"
},
["structure.settings"]: {
  "required": false,
  "type": "object",
  "schemaHash": "0a2a18eb99a10b6334d48845f971e66cd324ecd6cf1552a4604fb23b739d2e1a"
},
["structure.settings.backgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["structure.settings.backgroundImage"]: {
  "required": false,
  "type": "object",
  "schemaHash": "c027226944be8128711739cc24995fbc3653b0f4bd0e3d4e28dcc439735be130"
},
["structure.settings.backgroundImage.path"]: {
  "required": true,
  "type": "string",
  "schemaHash": "3bfb5286fc5028d5eabaa11a8db3f7678318acc269d485f50ce2d47c675a58b4"
},
["structure.settings.backgroundImage.repeat"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["structure.settings.backgroundImage.x"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f8e86c85e3c13598b52d2fcaf5b9a04f06b9c1880f2f570cba3fa2164a90034f"
},
["structure.settings.backgroundImage.y"]: {
  "required": true,
  "type": "string",
  "schemaHash": "1c608db105fddec886256a3c10e55e6d615c523ae85ff8151473e5691eecf214"
},
["structure.settings.backgroundImage.sizeX"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["structure.settings.backgroundImage.sizeY"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["structure.settings.border"]: {
  "required": true,
  "type": "object",
  "schemaHash": "dd0a3c911e673ccbedf16997b948eee2a85e978a8001e2fdde28ff8af0eb0684"
},
["structure.settings.border.top"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["structure.settings.border.top.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "43c2c295c17ab9927211612d970c0a5f393fd3806e9ae4a07049579758b3fe42"
},
["structure.settings.border.top.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["structure.settings.border.right"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["structure.settings.border.right.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "43c2c295c17ab9927211612d970c0a5f393fd3806e9ae4a07049579758b3fe42"
},
["structure.settings.border.right.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["structure.settings.border.bottom"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["structure.settings.border.bottom.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "43c2c295c17ab9927211612d970c0a5f393fd3806e9ae4a07049579758b3fe42"
},
["structure.settings.border.bottom.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["structure.settings.border.left"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["structure.settings.border.left.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "43c2c295c17ab9927211612d970c0a5f393fd3806e9ae4a07049579758b3fe42"
},
["structure.settings.border.left.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["structure.settings.border.style"]: {
  "required": true,
  "type": "string",
  "enum": [
    "solid",
    "dashed",
    "dotted"
  ],
  "schemaHash": "6b87aae70f3438944f91a6bbce41c69a57c2fb978c696f801c2a12b5dea717de"
},
["structure.settings.borderRadius"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["structure.settings.borderRadius.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d4ea49530b875e80d3ed20028edc09f574018c4371f79e53656eaeeeadc83699"
},
["structure.settings.borderRadius.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dd31199631720a98a43b2f0d848983a49cf1c662a61d0aae5eeca7716eb2eeb7"
},
["structure.settings.borderRadius.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1e4a3971a198b7cbe0dbc8b55521142df63a6f4714a4688bb033dec1d61665d7"
},
["structure.settings.borderRadius.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "380155b942a4d8b8cd37f1baf475c42f30bf72f300cb6191489845e054b57df4"
},
["structure.settings.columnsGap"]: {
  "required": false,
  "type": "object",
  "schemaHash": "22c9c58113a9510e9ac16edc66a390310a7353f25ed2920baa8d0284ee6e60bd"
},
["structure.settings.columnsGap.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "bb7e79c55a455f275b417bb6cba33dd77279eec722e6f721cf7f76e208111b91"
},
["structure.settings.columnsGap.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "4a24b457315f176574d9b069c09ffc196f8aeab1b4de744bebe8c635213db3b3"
},
["structure.settings.responsiveMobile"]: {
  "required": false,
  "type": "boolean",
  "schemaHash": "5e4c9927ca146a09f1043669b9db1643f13a9b23a26dc0e95fbc5b378cc75f32"
},
["structure.settings.responsiveMobileContainersInversion"]: {
  "required": false,
  "type": "boolean",
  "schemaHash": "641e285ac00c8aac980b3c626ef6471ba0b55ff7349a1acdc4cd38ed25120a78"
},
["structure.settings.padding"]: {
  "required": false,
  "type": "object",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["structure.settings.padding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b0436d0d3e471e0145a05542ee662b3c21bb774c2c6dca85be780661b52d914e"
},
["structure.settings.padding.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "71896eba121f89ff51f4f07f56bd8b77f6468285c2f87369266849f2c5630bbf"
},
["structure.settings.padding.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "14742721b8a86341ea55e901918ec812b80a90e3b2f7b76a75fed5a0026f2a87"
},
["structure.settings.padding.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "42004ea51dea97fe2e0b8d4d5e6bba05f0a347199ac57211be31970cd6b963a7"
},
["structure.settings.padding.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f9e09cca51410ea0413d68e607f324f9203c85b109e0381c201966ca609e2758"
},
["structure.settings.padding.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b0436d0d3e471e0145a05542ee662b3c21bb774c2c6dca85be780661b52d914e"
},
["structure.settings.padding.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "71896eba121f89ff51f4f07f56bd8b77f6468285c2f87369266849f2c5630bbf"
},
["structure.settings.padding.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "14742721b8a86341ea55e901918ec812b80a90e3b2f7b76a75fed5a0026f2a87"
},
["structure.settings.padding.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "42004ea51dea97fe2e0b8d4d5e6bba05f0a347199ac57211be31970cd6b963a7"
},
["structure.settings.padding.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f9e09cca51410ea0413d68e607f324f9203c85b109e0381c201966ca609e2758"
},
["structure.settings.margins"]: {
  "required": false,
  "type": "object",
  "schemaHash": "e9a1c4855d31ed99336125118d369a2b7e0313cbe83dad4c864eb3c031eb698c"
},
["structure.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b0436d0d3e471e0145a05542ee662b3c21bb774c2c6dca85be780661b52d914e"
},
["structure.settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "71896eba121f89ff51f4f07f56bd8b77f6468285c2f87369266849f2c5630bbf"
},
["structure.settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "14742721b8a86341ea55e901918ec812b80a90e3b2f7b76a75fed5a0026f2a87"
},
["structure.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "42004ea51dea97fe2e0b8d4d5e6bba05f0a347199ac57211be31970cd6b963a7"
},
["structure.settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f9e09cca51410ea0413d68e607f324f9203c85b109e0381c201966ca609e2758"
},
["structure.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b0436d0d3e471e0145a05542ee662b3c21bb774c2c6dca85be780661b52d914e"
},
["structure.settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "71896eba121f89ff51f4f07f56bd8b77f6468285c2f87369266849f2c5630bbf"
},
["structure.settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "14742721b8a86341ea55e901918ec812b80a90e3b2f7b76a75fed5a0026f2a87"
},
["structure.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "42004ea51dea97fe2e0b8d4d5e6bba05f0a347199ac57211be31970cd6b963a7"
},
["structure.settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f9e09cca51410ea0413d68e607f324f9203c85b109e0381c201966ca609e2758"
},
["structure.settings.includeInOutput"]: {
  "required": false,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "9119e37ac31455c3e3b497658119c983af4e84a814b0672d2229b91880f5f37b"
},
["structure.settings.hideElement"]: {
  "required": false,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "545169c5e967251714bdc95b8e24b2661d0aab9e0c47d252eea521a99ad79df7"
},
["structure.moduleId"]: {
  "required": false,
  "type": "number",
  "readOnly": true,
  "schemaHash": "86e082881794e221da90dd516534b6909d10679f0836012073c838a870672e5f"
},
["structure.columns"]: {
  "required": false,
  "type": "array",
  "schemaHash": "1a56c91ea1411ad60b7b9ba11d3ad03e31a7b29766e00d7bc41f9fe23b4a0abe"
},
["structure.columns[]"]: {
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
["structure.columns[].id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "474f4d9296fe9ab42673b8752a6fed0e522587f12abaf9751a03797acb4d96b5"
},
["structure.columns[].settings"]: {
  "required": false,
  "type": "object",
  "schemaHash": "c145b8d0e8d0ecce2a0a2622ad17ecd4c5584fda7205631d1cb263a76928fba8"
},
["structure.columns[].settings.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "c0e0a0e2f970a4c4bc25c4a234f9f8f1ceed9af7d119ef1d22ecb661c162494b"
},
["structure.columns[].containers"]: {
  "required": true,
  "type": "array",
  "schemaHash": "923752398804419d65fd5fa6d63fb00fbdfdee1a47e0296f69434adc03e29e78"
},
["structure.columns[].containers[]"]: {
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
["structure.columns[].containers[].id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "1b26ba4a13d211700ebbd8d2d85a193233d853508272739304475edfdd7d1c6e"
},
["structure.columns[].containers[].settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "92ecef150d33ac7d09603020589d690900d2fd2ae8d10a0a9cfd6936384e8b05"
},
["structure.columns[].containers[].settings.padding"]: {
  "required": true,
  "type": "object",
  "schemaHash": "2f13dc68b2b8d2e768b8ddc88b73d0ebec7b6bad5067323262c7ea3d99ffed14"
},
["structure.columns[].containers[].settings.padding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b0436d0d3e471e0145a05542ee662b3c21bb774c2c6dca85be780661b52d914e"
},
["structure.columns[].containers[].settings.padding.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "71896eba121f89ff51f4f07f56bd8b77f6468285c2f87369266849f2c5630bbf"
},
["structure.columns[].containers[].settings.padding.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "14742721b8a86341ea55e901918ec812b80a90e3b2f7b76a75fed5a0026f2a87"
},
["structure.columns[].containers[].settings.padding.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "42004ea51dea97fe2e0b8d4d5e6bba05f0a347199ac57211be31970cd6b963a7"
},
["structure.columns[].containers[].settings.padding.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f9e09cca51410ea0413d68e607f324f9203c85b109e0381c201966ca609e2758"
},
["structure.columns[].containers[].settings.padding.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b0436d0d3e471e0145a05542ee662b3c21bb774c2c6dca85be780661b52d914e"
},
["structure.columns[].containers[].settings.padding.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "71896eba121f89ff51f4f07f56bd8b77f6468285c2f87369266849f2c5630bbf"
},
["structure.columns[].containers[].settings.padding.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "14742721b8a86341ea55e901918ec812b80a90e3b2f7b76a75fed5a0026f2a87"
},
["structure.columns[].containers[].settings.padding.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "42004ea51dea97fe2e0b8d4d5e6bba05f0a347199ac57211be31970cd6b963a7"
},
["structure.columns[].containers[].settings.padding.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f9e09cca51410ea0413d68e607f324f9203c85b109e0381c201966ca609e2758"
},
["structure.columns[].containers[].settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["structure.columns[].containers[].settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["structure.columns[].containers[].settings.backgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["structure.columns[].containers[].settings.backgroundImage"]: {
  "required": false,
  "type": "object",
  "schemaHash": "c679b09b2ab5a8c336c639b8750e66205b88ff18864947604378c69a6944f97e"
},
["structure.columns[].containers[].settings.backgroundImage.path"]: {
  "required": true,
  "type": "string",
  "schemaHash": "3bfb5286fc5028d5eabaa11a8db3f7678318acc269d485f50ce2d47c675a58b4"
},
["structure.columns[].containers[].settings.backgroundImage.repeat"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["structure.columns[].containers[].settings.backgroundImage.x"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f8e86c85e3c13598b52d2fcaf5b9a04f06b9c1880f2f570cba3fa2164a90034f"
},
["structure.columns[].containers[].settings.backgroundImage.y"]: {
  "required": true,
  "type": "string",
  "schemaHash": "1c608db105fddec886256a3c10e55e6d615c523ae85ff8151473e5691eecf214"
},
["structure.columns[].containers[].settings.backgroundImage.sizeX"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["structure.columns[].containers[].settings.backgroundImage.sizeY"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["structure.columns[].containers[].settings.border"]: {
  "required": true,
  "type": "object",
  "schemaHash": "dd0a3c911e673ccbedf16997b948eee2a85e978a8001e2fdde28ff8af0eb0684"
},
["structure.columns[].containers[].settings.border.top"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["structure.columns[].containers[].settings.border.top.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "43c2c295c17ab9927211612d970c0a5f393fd3806e9ae4a07049579758b3fe42"
},
["structure.columns[].containers[].settings.border.top.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["structure.columns[].containers[].settings.border.right"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["structure.columns[].containers[].settings.border.right.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "43c2c295c17ab9927211612d970c0a5f393fd3806e9ae4a07049579758b3fe42"
},
["structure.columns[].containers[].settings.border.right.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["structure.columns[].containers[].settings.border.bottom"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["structure.columns[].containers[].settings.border.bottom.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "43c2c295c17ab9927211612d970c0a5f393fd3806e9ae4a07049579758b3fe42"
},
["structure.columns[].containers[].settings.border.bottom.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["structure.columns[].containers[].settings.border.left"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["structure.columns[].containers[].settings.border.left.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "43c2c295c17ab9927211612d970c0a5f393fd3806e9ae4a07049579758b3fe42"
},
["structure.columns[].containers[].settings.border.left.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["structure.columns[].containers[].settings.border.style"]: {
  "required": true,
  "type": "string",
  "enum": [
    "solid",
    "dashed",
    "dotted"
  ],
  "schemaHash": "6b87aae70f3438944f91a6bbce41c69a57c2fb978c696f801c2a12b5dea717de"
},
["structure.columns[].containers[].settings.radius"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["structure.columns[].containers[].settings.radius.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d4ea49530b875e80d3ed20028edc09f574018c4371f79e53656eaeeeadc83699"
},
["structure.columns[].containers[].settings.radius.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dd31199631720a98a43b2f0d848983a49cf1c662a61d0aae5eeca7716eb2eeb7"
},
["structure.columns[].containers[].settings.radius.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1e4a3971a198b7cbe0dbc8b55521142df63a6f4714a4688bb033dec1d61665d7"
},
["structure.columns[].containers[].settings.radius.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "380155b942a4d8b8cd37f1baf475c42f30bf72f300cb6191489845e054b57df4"
},
["structure.columns[].containers[].moduleId"]: {
  "required": false,
  "type": "number",
  "readOnly": true,
  "schemaHash": "59a792b6fd6449983da4a267d6f87b1174de981519abfffca4599122ed460de9"
},
["structure.columns[].containers[].blocks"]: {
  "required": false,
  "type": "array",
  "schemaHash": "f91d29b5ca92f549d52a1729a378abdde7d9b342856784a42f81c4e7251303a7"
},
["structure.columns[].containers[].blocks[]"]: {
  "required": true,
  "schemaHash": "ada97c1ed3413f8637fe2aea69bbe0add20beee79f6fbae7e5b29bd1aa7acae1"
},
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
  "schemaHash": "987f44fff38a9fcd62e353101b3823e640287645499d853d1e4a670f7d80776d"
},
["structure.columns[].containers[].blocks[]|0.type"]: {
  "required": true,
  "type": "string",
  "const": "text",
  "schemaHash": "cc22f8ec14817471274ae0fddcdc70ee916ee0e4e058c2adf4ccefed5b83163f"
},
["structure.columns[].containers[].blocks[]|0.settings"]: {
  "required": false,
  "type": "object",
  "schemaHash": "796892a0a67d7975ad6b69e46842aed905ee794b205e0c0f6e0841569314f221"
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
  "schemaHash": "33fb0a82c6cdbd2ecde9ae2b5b6c12efe76921b42baa0b9c6449d8591e9b3944"
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
  "schemaHash": "fa375d8d3921bf6853043c6e3e9230051e2eb38d8de4a20ed66b4198059036f5"
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
  "schemaHash": "fa375d8d3921bf6853043c6e3e9230051e2eb38d8de4a20ed66b4198059036f5"
},
["structure.columns[].containers[].blocks[]|0.settings.fixedHeight"]: {
  "required": false,
  "type": "object",
  "schemaHash": "b46d2a654ee1874c1cc2d636d4e4786dc32c1f15ae0cc77c3eebc5883ed11be8"
},
["structure.columns[].containers[].blocks[]|0.settings.fixedHeight.desktop"]: {
  "required": false,
  "type": "object",
  "schemaHash": "8ae8bf286545f6c3b1f6f73573264a9f61fa09fb6bfa2447aa5ce9bb8617ab6f"
},
["structure.columns[].containers[].blocks[]|0.settings.fixedHeight.desktop.height"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "a4475867ad83c5cd99c199dfddf0b8e799ebe5f636bf765a2f4ec2d69e7ead09"
},
["structure.columns[].containers[].blocks[]|0.settings.fixedHeight.desktop.verticalAlignment"]: {
  "required": false,
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ],
  "schemaHash": "b4b3a153ebf7f9907edcb00945ab363971246387c038cfb94b5a08fffd84a3e8"
},
["structure.columns[].containers[].blocks[]|0.settings.fixedHeight.mobile"]: {
  "required": false,
  "type": "object",
  "schemaHash": "e930d6bfd7e624cc404d6ac9111b7f5169a3f9e6ccda3f7a9c208027be48f312"
},
["structure.columns[].containers[].blocks[]|0.settings.fixedHeight.mobile.height"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "a4475867ad83c5cd99c199dfddf0b8e799ebe5f636bf765a2f4ec2d69e7ead09"
},
["structure.columns[].containers[].blocks[]|0.settings.fixedHeight.mobile.verticalAlignment"]: {
  "required": false,
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ],
  "schemaHash": "b4b3a153ebf7f9907edcb00945ab363971246387c038cfb94b5a08fffd84a3e8"
},
["structure.columns[].containers[].blocks[]|0.settings.padding"]: {
  "required": true,
  "type": "object",
  "schemaHash": "2fb4ba346d619aa1f724ab26d5dd469a53ac8b687e36c5231e523f34f496aafc"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "37536e5cdca2c6a99d26bcca81988a492aa2df1ee3034744cc62643936f6c8ab"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "37536e5cdca2c6a99d26bcca81988a492aa2df1ee3034744cc62643936f6c8ab"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["structure.columns[].containers[].blocks[]|0.settings.padding.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
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
  "schemaHash": "7b91cafbb4bd70c075dabec2ee8400c032157eb69f2f1c14d94225aed001db05"
},
["structure.columns[].containers[].blocks[]|0.settings.letterSpacing.value"]: {
  "required": true,
  "type": "number",
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
},
["structure.columns[].containers[].blocks[]|0.settings.letterSpacing.unit"]: {
  "required": true,
  "type": "string",
  "enum": [
    "px",
    "em"
  ],
  "schemaHash": "35dd650fb6a5f62fe7fc20739ab6b54f5f4aea29f3f5841fc40e61b1e3b89a95"
},
["structure.columns[].containers[].blocks[]|0.content"]: {
  "required": false,
  "type": "string",
  "schemaHash": "5a6d40dd19c05ee913025262e4a5001671aac6913feb634ce0e68f5f65bf6790"
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
  "schemaHash": "987f44fff38a9fcd62e353101b3823e640287645499d853d1e4a670f7d80776d"
},
["structure.columns[].containers[].blocks[]|1.type"]: {
  "required": true,
  "type": "string",
  "const": "image",
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["structure.columns[].containers[].blocks[]|1.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "77491c918f72594148ebce95e4c92d11695538b6f547a6767d2fff890ae7a68a"
},
["structure.columns[].containers[].blocks[]|1.settings.src"]: {
  "required": true,
  "type": "string",
  "schemaHash": "efb2498bfd7c3a684731d96285b8c29553f2e46b13fac6d897a5f507ebc3c9ae"
},
["structure.columns[].containers[].blocks[]|1.settings.link"]: {
  "required": false,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
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
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["structure.columns[].containers[].blocks[]|1.settings.link.href"]: {
  "required": true,
  "type": "string",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["structure.columns[].containers[].blocks[]|1.settings.altText"]: {
  "required": true,
  "type": "object",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["structure.columns[].containers[].blocks[]|1.settings.altText.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["structure.columns[].containers[].blocks[]|1.settings.altText.addToTitle"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "5488d5a30aa799c16d2a2e70182680c408d6b79973e0120c2259b2a142a87363"
},
["structure.columns[].containers[].blocks[]|1.settings.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "fc90ddf303f474b1fad5c7baadbf1773f3bb6c2dacaf669c10b0fc256521730f"
},
["structure.columns[].containers[].blocks[]|1.settings.size.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["structure.columns[].containers[].blocks[]|1.settings.size.desktop.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["structure.columns[].containers[].blocks[]|1.settings.size.desktop.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["structure.columns[].containers[].blocks[]|1.settings.size.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["structure.columns[].containers[].blocks[]|1.settings.size.mobile.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["structure.columns[].containers[].blocks[]|1.settings.size.mobile.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["structure.columns[].containers[].blocks[]|1.settings.alignment"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ffeb13b7004005b19938145b546d5ceb08d7dcade8822f2213892c866f7cb1fa"
},
["structure.columns[].containers[].blocks[]|1.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["structure.columns[].containers[].blocks[]|1.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["structure.columns[].containers[].blocks[]|1.settings.radius"]: {
  "required": true,
  "type": "object",
  "schemaHash": "341814eb6aff7d91bd84e9006aba1a60303f85af77dc4b114c35299d29ccec79"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.desktop.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d4ea49530b875e80d3ed20028edc09f574018c4371f79e53656eaeeeadc83699"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.desktop.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dd31199631720a98a43b2f0d848983a49cf1c662a61d0aae5eeca7716eb2eeb7"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.desktop.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1e4a3971a198b7cbe0dbc8b55521142df63a6f4714a4688bb033dec1d61665d7"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.desktop.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "380155b942a4d8b8cd37f1baf475c42f30bf72f300cb6191489845e054b57df4"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.mobile.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d4ea49530b875e80d3ed20028edc09f574018c4371f79e53656eaeeeadc83699"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.mobile.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dd31199631720a98a43b2f0d848983a49cf1c662a61d0aae5eeca7716eb2eeb7"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.mobile.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1e4a3971a198b7cbe0dbc8b55521142df63a6f4714a4688bb033dec1d61665d7"
},
["structure.columns[].containers[].blocks[]|1.settings.radius.mobile.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "380155b942a4d8b8cd37f1baf475c42f30bf72f300cb6191489845e054b57df4"
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
  "schemaHash": "82cdc2e20bff7e777b2055cc1783d43dc19e28df76b38edeb403fbcd81b24d9d"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a7e49c9de944eb59b182b4170e11f27246a9a6b97991efb30eb44167d8e6e96a"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "512befe9ea2fc6099da95661f8b6f26434831be23e431b5670423c8f8cbc163d"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a60791c7bd997624175e5ce942b961e03be8caff0688d64714c220d3e3069018"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f16d2a1c75e4e368c52096f5f392478b7362f12092f61565b2505fc4904bfda5"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b462dde7c9edde64ea0ef3b7baa66de119ee6b45e1275970be7d07062ca8e996"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a7e49c9de944eb59b182b4170e11f27246a9a6b97991efb30eb44167d8e6e96a"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "512befe9ea2fc6099da95661f8b6f26434831be23e431b5670423c8f8cbc163d"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a60791c7bd997624175e5ce942b961e03be8caff0688d64714c220d3e3069018"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f16d2a1c75e4e368c52096f5f392478b7362f12092f61565b2505fc4904bfda5"
},
["structure.columns[].containers[].blocks[]|1.settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b462dde7c9edde64ea0ef3b7baa66de119ee6b45e1275970be7d07062ca8e996"
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
  "schemaHash": "c59c64cc82659b3f4d98141fc48d64d75303e9682323d902d0767caca9a19c31"
},
["structure.columns[].containers[].blocks[]|1.settings.responsiveMobile"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "3954de1555ee8336646468d5dad24e0136cabe4665ebb85a3b60f14913067a69"
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
  "schemaHash": "987f44fff38a9fcd62e353101b3823e640287645499d853d1e4a670f7d80776d"
},
["structure.columns[].containers[].blocks[]|2.type"]: {
  "required": true,
  "type": "string",
  "const": "video",
  "schemaHash": "0a4857291fe8770b399d2f933a25d2c3f94ec8ec39e68be73d3918997d7f3d7b"
},
["structure.columns[].containers[].blocks[]|2.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "3272677b3785aec173d0170f736bbcda85be6fcff62315f9cf5407f812c12a9c"
},
["structure.columns[].containers[].blocks[]|2.settings.videoLink"]: {
  "required": true,
  "type": "string",
  "schemaHash": "5c951508c542a492ea27007225a1c8d93656bc868ca3dd23369d2586fcad9b55"
},
["structure.columns[].containers[].blocks[]|2.settings.altText"]: {
  "required": true,
  "type": "object",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["structure.columns[].containers[].blocks[]|2.settings.altText.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["structure.columns[].containers[].blocks[]|2.settings.altText.addToTitle"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "5488d5a30aa799c16d2a2e70182680c408d6b79973e0120c2259b2a142a87363"
},
["structure.columns[].containers[].blocks[]|2.settings.customThumbnail"]: {
  "required": false,
  "type": "object",
  "schemaHash": "efd732b80d28c0122ee3a66deffd934c4ce1b8e509136a46f1965cd3af5f03a5"
},
["structure.columns[].containers[].blocks[]|2.settings.customThumbnail.src"]: {
  "required": true,
  "type": "string",
  "schemaHash": "8252330452d3e452f1f9e987f5f9fcc0c1563a90eb85bcf1b9a45c227808d935"
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
  "schemaHash": "a349091f76fcc6df5d76f39577c2d279d637698d36ed086028c7f8ea197c7493"
},
["structure.columns[].containers[].blocks[]|2.settings.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "fc90ddf303f474b1fad5c7baadbf1773f3bb6c2dacaf669c10b0fc256521730f"
},
["structure.columns[].containers[].blocks[]|2.settings.size.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["structure.columns[].containers[].blocks[]|2.settings.size.desktop.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["structure.columns[].containers[].blocks[]|2.settings.size.desktop.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["structure.columns[].containers[].blocks[]|2.settings.size.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["structure.columns[].containers[].blocks[]|2.settings.size.mobile.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["structure.columns[].containers[].blocks[]|2.settings.size.mobile.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["structure.columns[].containers[].blocks[]|2.settings.alignment"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ffeb13b7004005b19938145b546d5ceb08d7dcade8822f2213892c866f7cb1fa"
},
["structure.columns[].containers[].blocks[]|2.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["structure.columns[].containers[].blocks[]|2.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["structure.columns[].containers[].blocks[]|2.settings.radius"]: {
  "required": true,
  "type": "object",
  "schemaHash": "341814eb6aff7d91bd84e9006aba1a60303f85af77dc4b114c35299d29ccec79"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.desktop.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d4ea49530b875e80d3ed20028edc09f574018c4371f79e53656eaeeeadc83699"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.desktop.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dd31199631720a98a43b2f0d848983a49cf1c662a61d0aae5eeca7716eb2eeb7"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.desktop.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1e4a3971a198b7cbe0dbc8b55521142df63a6f4714a4688bb033dec1d61665d7"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.desktop.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "380155b942a4d8b8cd37f1baf475c42f30bf72f300cb6191489845e054b57df4"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.mobile.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d4ea49530b875e80d3ed20028edc09f574018c4371f79e53656eaeeeadc83699"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.mobile.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dd31199631720a98a43b2f0d848983a49cf1c662a61d0aae5eeca7716eb2eeb7"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.mobile.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1e4a3971a198b7cbe0dbc8b55521142df63a6f4714a4688bb033dec1d61665d7"
},
["structure.columns[].containers[].blocks[]|2.settings.radius.mobile.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "380155b942a4d8b8cd37f1baf475c42f30bf72f300cb6191489845e054b57df4"
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
  "schemaHash": "9997efdcca77945c766ad1cbab2d82d5ea2f1aed6bbd59e8c6299bc16c7d33eb"
},
["structure.columns[].containers[].blocks[]|2.settings.paddings.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a7e49c9de944eb59b182b4170e11f27246a9a6b97991efb30eb44167d8e6e96a"
},
["structure.columns[].containers[].blocks[]|2.settings.paddings.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "512befe9ea2fc6099da95661f8b6f26434831be23e431b5670423c8f8cbc163d"
},
["structure.columns[].containers[].blocks[]|2.settings.paddings.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a60791c7bd997624175e5ce942b961e03be8caff0688d64714c220d3e3069018"
},
["structure.columns[].containers[].blocks[]|2.settings.paddings.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f16d2a1c75e4e368c52096f5f392478b7362f12092f61565b2505fc4904bfda5"
},
["structure.columns[].containers[].blocks[]|2.settings.paddings.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b462dde7c9edde64ea0ef3b7baa66de119ee6b45e1275970be7d07062ca8e996"
}
};

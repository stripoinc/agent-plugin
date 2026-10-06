
export default {
["column.containers[].blocks[]|0.settings.fixedHeight.desktop.verticalAlignment"]: {
  "required": false,
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ],
  "schemaHash": "b4b3a153ebf7f9907edcb00945ab363971246387c038cfb94b5a08fffd84a3e8"
},
["column.containers[].blocks[]|0.settings.fixedHeight.mobile"]: {
  "required": false,
  "type": "object",
  "schemaHash": "e930d6bfd7e624cc404d6ac9111b7f5169a3f9e6ccda3f7a9c208027be48f312"
},
["column.containers[].blocks[]|0.settings.fixedHeight.mobile.height"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "a4475867ad83c5cd99c199dfddf0b8e799ebe5f636bf765a2f4ec2d69e7ead09"
},
["column.containers[].blocks[]|0.settings.fixedHeight.mobile.verticalAlignment"]: {
  "required": false,
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ],
  "schemaHash": "b4b3a153ebf7f9907edcb00945ab363971246387c038cfb94b5a08fffd84a3e8"
},
["column.containers[].blocks[]|0.settings.padding"]: {
  "required": true,
  "type": "object",
  "schemaHash": "2fb4ba346d619aa1f724ab26d5dd469a53ac8b687e36c5231e523f34f496aafc"
},
["column.containers[].blocks[]|0.settings.padding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "37536e5cdca2c6a99d26bcca81988a492aa2df1ee3034744cc62643936f6c8ab"
},
["column.containers[].blocks[]|0.settings.padding.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["column.containers[].blocks[]|0.settings.padding.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["column.containers[].blocks[]|0.settings.padding.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["column.containers[].blocks[]|0.settings.padding.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["column.containers[].blocks[]|0.settings.padding.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "37536e5cdca2c6a99d26bcca81988a492aa2df1ee3034744cc62643936f6c8ab"
},
["column.containers[].blocks[]|0.settings.padding.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["column.containers[].blocks[]|0.settings.padding.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["column.containers[].blocks[]|0.settings.padding.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["column.containers[].blocks[]|0.settings.padding.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "98609b7a886726a632398fee0e273681e74eb2efb659858513cca301786b629f"
},
["column.containers[].blocks[]|0.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["column.containers[].blocks[]|0.settings.backgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["column.containers[].blocks[]|0.settings.letterSpacing"]: {
  "required": false,
  "type": "object",
  "schemaHash": "7b91cafbb4bd70c075dabec2ee8400c032157eb69f2f1c14d94225aed001db05"
},
["column.containers[].blocks[]|0.settings.letterSpacing.value"]: {
  "required": true,
  "type": "number",
  "schemaHash": "ccabffbf0f31f4f4f23d00588199cf15516a64811ff178802912c942e7de8ec3"
},
["column.containers[].blocks[]|0.settings.letterSpacing.unit"]: {
  "required": true,
  "type": "string",
  "enum": [
    "px",
    "em"
  ],
  "schemaHash": "35dd650fb6a5f62fe7fc20739ab6b54f5f4aea29f3f5841fc40e61b1e3b89a95"
},
["column.containers[].blocks[]|0.content"]: {
  "required": false,
  "type": "string",
  "schemaHash": "5a6d40dd19c05ee913025262e4a5001671aac6913feb634ce0e68f5f65bf6790"
},
["column.containers[].blocks[]|1"]: {
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
["column.containers[].blocks[]|1.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "987f44fff38a9fcd62e353101b3823e640287645499d853d1e4a670f7d80776d"
},
["column.containers[].blocks[]|1.type"]: {
  "required": true,
  "type": "string",
  "const": "image",
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["column.containers[].blocks[]|1.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "77491c918f72594148ebce95e4c92d11695538b6f547a6767d2fff890ae7a68a"
},
["column.containers[].blocks[]|1.settings.src"]: {
  "required": true,
  "type": "string",
  "schemaHash": "efb2498bfd7c3a684731d96285b8c29553f2e46b13fac6d897a5f507ebc3c9ae"
},
["column.containers[].blocks[]|1.settings.link"]: {
  "required": false,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["column.containers[].blocks[]|1.settings.link.type"]: {
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
["column.containers[].blocks[]|1.settings.link.href"]: {
  "required": true,
  "type": "string",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["column.containers[].blocks[]|1.settings.altText"]: {
  "required": true,
  "type": "object",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["column.containers[].blocks[]|1.settings.altText.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["column.containers[].blocks[]|1.settings.altText.addToTitle"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "5488d5a30aa799c16d2a2e70182680c408d6b79973e0120c2259b2a142a87363"
},
["column.containers[].blocks[]|1.settings.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "fc90ddf303f474b1fad5c7baadbf1773f3bb6c2dacaf669c10b0fc256521730f"
},
["column.containers[].blocks[]|1.settings.size.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["column.containers[].blocks[]|1.settings.size.desktop.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["column.containers[].blocks[]|1.settings.size.desktop.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["column.containers[].blocks[]|1.settings.size.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["column.containers[].blocks[]|1.settings.size.mobile.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["column.containers[].blocks[]|1.settings.size.mobile.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["column.containers[].blocks[]|1.settings.alignment"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ffeb13b7004005b19938145b546d5ceb08d7dcade8822f2213892c866f7cb1fa"
},
["column.containers[].blocks[]|1.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["column.containers[].blocks[]|1.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["column.containers[].blocks[]|1.settings.radius"]: {
  "required": true,
  "type": "object",
  "schemaHash": "341814eb6aff7d91bd84e9006aba1a60303f85af77dc4b114c35299d29ccec79"
},
["column.containers[].blocks[]|1.settings.radius.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["column.containers[].blocks[]|1.settings.radius.desktop.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d4ea49530b875e80d3ed20028edc09f574018c4371f79e53656eaeeeadc83699"
},
["column.containers[].blocks[]|1.settings.radius.desktop.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dd31199631720a98a43b2f0d848983a49cf1c662a61d0aae5eeca7716eb2eeb7"
},
["column.containers[].blocks[]|1.settings.radius.desktop.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1e4a3971a198b7cbe0dbc8b55521142df63a6f4714a4688bb033dec1d61665d7"
},
["column.containers[].blocks[]|1.settings.radius.desktop.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "380155b942a4d8b8cd37f1baf475c42f30bf72f300cb6191489845e054b57df4"
},
["column.containers[].blocks[]|1.settings.radius.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["column.containers[].blocks[]|1.settings.radius.mobile.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d4ea49530b875e80d3ed20028edc09f574018c4371f79e53656eaeeeadc83699"
},
["column.containers[].blocks[]|1.settings.radius.mobile.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dd31199631720a98a43b2f0d848983a49cf1c662a61d0aae5eeca7716eb2eeb7"
},
["column.containers[].blocks[]|1.settings.radius.mobile.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1e4a3971a198b7cbe0dbc8b55521142df63a6f4714a4688bb033dec1d61665d7"
},
["column.containers[].blocks[]|1.settings.radius.mobile.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "380155b942a4d8b8cd37f1baf475c42f30bf72f300cb6191489845e054b57df4"
},
["column.containers[].blocks[]|1.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["column.containers[].blocks[]|1.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "82cdc2e20bff7e777b2055cc1783d43dc19e28df76b38edeb403fbcd81b24d9d"
},
["column.containers[].blocks[]|1.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a7e49c9de944eb59b182b4170e11f27246a9a6b97991efb30eb44167d8e6e96a"
},
["column.containers[].blocks[]|1.settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "512befe9ea2fc6099da95661f8b6f26434831be23e431b5670423c8f8cbc163d"
},
["column.containers[].blocks[]|1.settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a60791c7bd997624175e5ce942b961e03be8caff0688d64714c220d3e3069018"
},
["column.containers[].blocks[]|1.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f16d2a1c75e4e368c52096f5f392478b7362f12092f61565b2505fc4904bfda5"
},
["column.containers[].blocks[]|1.settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b462dde7c9edde64ea0ef3b7baa66de119ee6b45e1275970be7d07062ca8e996"
},
["column.containers[].blocks[]|1.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a7e49c9de944eb59b182b4170e11f27246a9a6b97991efb30eb44167d8e6e96a"
},
["column.containers[].blocks[]|1.settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "512befe9ea2fc6099da95661f8b6f26434831be23e431b5670423c8f8cbc163d"
},
["column.containers[].blocks[]|1.settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a60791c7bd997624175e5ce942b961e03be8caff0688d64714c220d3e3069018"
},
["column.containers[].blocks[]|1.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f16d2a1c75e4e368c52096f5f392478b7362f12092f61565b2505fc4904bfda5"
},
["column.containers[].blocks[]|1.settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b462dde7c9edde64ea0ef3b7baa66de119ee6b45e1275970be7d07062ca8e996"
},
["column.containers[].blocks[]|1.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["column.containers[].blocks[]|1.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c59c64cc82659b3f4d98141fc48d64d75303e9682323d902d0767caca9a19c31"
},
["column.containers[].blocks[]|1.settings.responsiveMobile"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "3954de1555ee8336646468d5dad24e0136cabe4665ebb85a3b60f14913067a69"
},
["column.containers[].blocks[]|2"]: {
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
["column.containers[].blocks[]|2.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "987f44fff38a9fcd62e353101b3823e640287645499d853d1e4a670f7d80776d"
},
["column.containers[].blocks[]|2.type"]: {
  "required": true,
  "type": "string",
  "const": "video",
  "schemaHash": "0a4857291fe8770b399d2f933a25d2c3f94ec8ec39e68be73d3918997d7f3d7b"
},
["column.containers[].blocks[]|2.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "3272677b3785aec173d0170f736bbcda85be6fcff62315f9cf5407f812c12a9c"
},
["column.containers[].blocks[]|2.settings.videoLink"]: {
  "required": true,
  "type": "string",
  "schemaHash": "5c951508c542a492ea27007225a1c8d93656bc868ca3dd23369d2586fcad9b55"
},
["column.containers[].blocks[]|2.settings.altText"]: {
  "required": true,
  "type": "object",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["column.containers[].blocks[]|2.settings.altText.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["column.containers[].blocks[]|2.settings.altText.addToTitle"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "5488d5a30aa799c16d2a2e70182680c408d6b79973e0120c2259b2a142a87363"
},
["column.containers[].blocks[]|2.settings.customThumbnail"]: {
  "required": false,
  "type": "object",
  "schemaHash": "efd732b80d28c0122ee3a66deffd934c4ce1b8e509136a46f1965cd3af5f03a5"
},
["column.containers[].blocks[]|2.settings.customThumbnail.src"]: {
  "required": true,
  "type": "string",
  "schemaHash": "8252330452d3e452f1f9e987f5f9fcc0c1563a90eb85bcf1b9a45c227808d935"
},
["column.containers[].blocks[]|2.settings.playButtonStyle"]: {
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
["column.containers[].blocks[]|2.settings.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "fc90ddf303f474b1fad5c7baadbf1773f3bb6c2dacaf669c10b0fc256521730f"
},
["column.containers[].blocks[]|2.settings.size.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["column.containers[].blocks[]|2.settings.size.desktop.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["column.containers[].blocks[]|2.settings.size.desktop.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["column.containers[].blocks[]|2.settings.size.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["column.containers[].blocks[]|2.settings.size.mobile.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["column.containers[].blocks[]|2.settings.size.mobile.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["column.containers[].blocks[]|2.settings.alignment"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ffeb13b7004005b19938145b546d5ceb08d7dcade8822f2213892c866f7cb1fa"
},
["column.containers[].blocks[]|2.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["column.containers[].blocks[]|2.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["column.containers[].blocks[]|2.settings.radius"]: {
  "required": true,
  "type": "object",
  "schemaHash": "341814eb6aff7d91bd84e9006aba1a60303f85af77dc4b114c35299d29ccec79"
},
["column.containers[].blocks[]|2.settings.radius.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["column.containers[].blocks[]|2.settings.radius.desktop.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d4ea49530b875e80d3ed20028edc09f574018c4371f79e53656eaeeeadc83699"
},
["column.containers[].blocks[]|2.settings.radius.desktop.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dd31199631720a98a43b2f0d848983a49cf1c662a61d0aae5eeca7716eb2eeb7"
},
["column.containers[].blocks[]|2.settings.radius.desktop.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1e4a3971a198b7cbe0dbc8b55521142df63a6f4714a4688bb033dec1d61665d7"
},
["column.containers[].blocks[]|2.settings.radius.desktop.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "380155b942a4d8b8cd37f1baf475c42f30bf72f300cb6191489845e054b57df4"
},
["column.containers[].blocks[]|2.settings.radius.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["column.containers[].blocks[]|2.settings.radius.mobile.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d4ea49530b875e80d3ed20028edc09f574018c4371f79e53656eaeeeadc83699"
},
["column.containers[].blocks[]|2.settings.radius.mobile.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "dd31199631720a98a43b2f0d848983a49cf1c662a61d0aae5eeca7716eb2eeb7"
},
["column.containers[].blocks[]|2.settings.radius.mobile.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "1e4a3971a198b7cbe0dbc8b55521142df63a6f4714a4688bb033dec1d61665d7"
},
["column.containers[].blocks[]|2.settings.radius.mobile.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "380155b942a4d8b8cd37f1baf475c42f30bf72f300cb6191489845e054b57df4"
},
["column.containers[].blocks[]|2.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["column.containers[].blocks[]|2.settings.paddings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "9997efdcca77945c766ad1cbab2d82d5ea2f1aed6bbd59e8c6299bc16c7d33eb"
},
["column.containers[].blocks[]|2.settings.paddings.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a7e49c9de944eb59b182b4170e11f27246a9a6b97991efb30eb44167d8e6e96a"
},
["column.containers[].blocks[]|2.settings.paddings.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "512befe9ea2fc6099da95661f8b6f26434831be23e431b5670423c8f8cbc163d"
},
["column.containers[].blocks[]|2.settings.paddings.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a60791c7bd997624175e5ce942b961e03be8caff0688d64714c220d3e3069018"
},
["column.containers[].blocks[]|2.settings.paddings.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f16d2a1c75e4e368c52096f5f392478b7362f12092f61565b2505fc4904bfda5"
},
["column.containers[].blocks[]|2.settings.paddings.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b462dde7c9edde64ea0ef3b7baa66de119ee6b45e1275970be7d07062ca8e996"
},
["column.containers[].blocks[]|2.settings.paddings.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a7e49c9de944eb59b182b4170e11f27246a9a6b97991efb30eb44167d8e6e96a"
},
["column.containers[].blocks[]|2.settings.paddings.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "512befe9ea2fc6099da95661f8b6f26434831be23e431b5670423c8f8cbc163d"
},
["column.containers[].blocks[]|2.settings.paddings.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a60791c7bd997624175e5ce942b961e03be8caff0688d64714c220d3e3069018"
},
["column.containers[].blocks[]|2.settings.paddings.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f16d2a1c75e4e368c52096f5f392478b7362f12092f61565b2505fc4904bfda5"
},
["column.containers[].blocks[]|2.settings.paddings.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b462dde7c9edde64ea0ef3b7baa66de119ee6b45e1275970be7d07062ca8e996"
},
["column.containers[].blocks[]|2.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["column.containers[].blocks[]|2.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c59c64cc82659b3f4d98141fc48d64d75303e9682323d902d0767caca9a19c31"
},
["column.containers[].blocks[]|2.settings.responsiveMobile"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "70025b1e6ecca2a5db83b40897d93e15e79a2c51694481f46e5521d01ea7be36"
},
["column.containers[].blocks[]|3"]: {
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
["column.containers[].blocks[]|3.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "987f44fff38a9fcd62e353101b3823e640287645499d853d1e4a670f7d80776d"
},
["column.containers[].blocks[]|3.type"]: {
  "required": true,
  "type": "string",
  "const": "timer",
  "schemaHash": "479e5a71f296ad92630207e93e6dde8b2f86a8493380ac828d40047b8debb0af"
},
["column.containers[].blocks[]|3.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "d550fb40997b8dc11db9d0dee42d6446b3389c63bb3791a51f50f858588c2ba5"
},
["column.containers[].blocks[]|3.settings.altText"]: {
  "required": true,
  "type": "object",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["column.containers[].blocks[]|3.settings.altText.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["column.containers[].blocks[]|3.settings.altText.addToTitle"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "5488d5a30aa799c16d2a2e70182680c408d6b79973e0120c2259b2a142a87363"
},
["column.containers[].blocks[]|3.settings.responsiveMobile"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "b04708d549cbaaaa4c51ae8d00b79ec10afa37b5ab5aa0a95d636f8def292db6"
},
["column.containers[].blocks[]|3.settings.size"]: {
  "required": true,
  "type": "object",
  "schemaHash": "fc90ddf303f474b1fad5c7baadbf1773f3bb6c2dacaf669c10b0fc256521730f"
},
["column.containers[].blocks[]|3.settings.size.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["column.containers[].blocks[]|3.settings.size.desktop.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["column.containers[].blocks[]|3.settings.size.desktop.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["column.containers[].blocks[]|3.settings.size.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "9ecfde2c177d1d8e70740eaf7ff476cb44b3c6c7506108b1f594dbd0e7386ec0"
},
["column.containers[].blocks[]|3.settings.size.mobile.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "width",
    "height"
  ],
  "schemaHash": "c03f794cbcb25b907b25bf853ae71341379a35ddfcfc001f28e718613fb241eb"
},
["column.containers[].blocks[]|3.settings.size.mobile.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "e27ccbc8542e7d9efb79ddbf88f2e7938ec2b252a620ca5541f867926cb70f10"
},
["column.containers[].blocks[]|3.settings.alignment"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ffeb13b7004005b19938145b546d5ceb08d7dcade8822f2213892c866f7cb1fa"
},
["column.containers[].blocks[]|3.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["column.containers[].blocks[]|3.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "df231449337f06d6d6b616cb574c508c77812efbbd2a02829ccdb35926d62c3e"
},
["column.containers[].blocks[]|3.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "82cdc2e20bff7e777b2055cc1783d43dc19e28df76b38edeb403fbcd81b24d9d"
},
["column.containers[].blocks[]|3.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a7e49c9de944eb59b182b4170e11f27246a9a6b97991efb30eb44167d8e6e96a"
},
["column.containers[].blocks[]|3.settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "512befe9ea2fc6099da95661f8b6f26434831be23e431b5670423c8f8cbc163d"
},
["column.containers[].blocks[]|3.settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a60791c7bd997624175e5ce942b961e03be8caff0688d64714c220d3e3069018"
},
["column.containers[].blocks[]|3.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f16d2a1c75e4e368c52096f5f392478b7362f12092f61565b2505fc4904bfda5"
},
["column.containers[].blocks[]|3.settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b462dde7c9edde64ea0ef3b7baa66de119ee6b45e1275970be7d07062ca8e996"
},
["column.containers[].blocks[]|3.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a7e49c9de944eb59b182b4170e11f27246a9a6b97991efb30eb44167d8e6e96a"
},
["column.containers[].blocks[]|3.settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "512befe9ea2fc6099da95661f8b6f26434831be23e431b5670423c8f8cbc163d"
},
["column.containers[].blocks[]|3.settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a60791c7bd997624175e5ce942b961e03be8caff0688d64714c220d3e3069018"
},
["column.containers[].blocks[]|3.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f16d2a1c75e4e368c52096f5f392478b7362f12092f61565b2505fc4904bfda5"
},
["column.containers[].blocks[]|3.settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b462dde7c9edde64ea0ef3b7baa66de119ee6b45e1275970be7d07062ca8e996"
},
["column.containers[].blocks[]|3.settings.endDate"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f7ed56572064408d6cdf46176b0f5fb1caed0be67697b71d632ef36c28bb2b6a"
},
["column.containers[].blocks[]|3.settings.timeZone"]: {
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
  "schemaHash": "acb2dc5fb6371efe566c75343d2ac338c779db34b4e3d891aba927c8e24def6a"
},
["column.containers[].blocks[]|3.settings.link"]: {
  "required": true,
  "schemaHash": "09f0d6050dec887da138d7564376bfbc58a2272df7edd7062bebe9d0f623f5ec"
},
["column.containers[].blocks[]|3.settings.link|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["column.containers[].blocks[]|3.settings.link|0.type"]: {
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
["column.containers[].blocks[]|3.settings.link|0.href"]: {
  "required": true,
  "type": "string",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["column.containers[].blocks[]|3.settings.link|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["column.containers[].blocks[]|3.settings.displayDays"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "a120dae208683cac8eb71bba21d28099808c2a5a18c66b7b73b7522733845f2d"
},
["column.containers[].blocks[]|3.settings.labelsLetterCase"]: {
  "required": false,
  "type": "string",
  "enum": [
    "CAPITALIZE",
    "UPPER",
    "LOWER"
  ],
  "schemaHash": "bad59b05d8a47dd8584bb58885892234e746b7288ed2ddc374e4f765fc9de520"
},
["column.containers[].blocks[]|3.settings.separator"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e78aa562ff5c55cf163bec2ce650f69c930529b63b49bd38f471f7e5b49914dd"
},
["column.containers[].blocks[]|3.settings.labelsLanguage"]: {
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
  "schemaHash": "a72cc3300cbe156ababc83a49b26bf1d8e0c434e06e779d884223db2c025b3d5"
},
["column.containers[].blocks[]|3.settings.retinaDisplaySupport"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "2be3ee80dd1e194de193b4844ca8dbd4e9e1866dbaa8128afe1f061cf309bb99"
},
["column.containers[].blocks[]|3.settings.expirationImageSrc"]: {
  "required": true,
  "type": "string",
  "schemaHash": "efb2498bfd7c3a684731d96285b8c29553f2e46b13fac6d897a5f507ebc3c9ae"
},
["column.containers[].blocks[]|3.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["column.containers[].blocks[]|3.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["column.containers[].blocks[]|3.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c59c64cc82659b3f4d98141fc48d64d75303e9682323d902d0767caca9a19c31"
},
["column.containers[].blocks[]|3.settings.digitsFontFamily"]: {
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
  "schemaHash": "53fd593d288acf21b522225268e83354d990b8d9a52f4eaf601f8e2d6600bbac"
},
["column.containers[].blocks[]|3.settings.digitsFontSize"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "943f96b10e4a120f3b97f8a2823867f37d210fc0affad81efe7d534f40c3bc14"
},
["column.containers[].blocks[]|3.settings.digitsFontColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["column.containers[].blocks[]|3.settings.digitsAdvancedColorSettings"]: {
  "required": false,
  "type": "object",
  "schemaHash": "2af4ba420a23a7134874c1b643e7e0d977f1dd386d181e771417ef2a3d1c51d6"
},
["column.containers[].blocks[]|3.settings.digitsAdvancedColorSettings.days"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["column.containers[].blocks[]|3.settings.digitsAdvancedColorSettings.hours"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["column.containers[].blocks[]|3.settings.digitsAdvancedColorSettings.minutes"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["column.containers[].blocks[]|3.settings.digitsAdvancedColorSettings.seconds"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["column.containers[].blocks[]|3.settings.labelsFontFamily"]: {
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
  "schemaHash": "53fd593d288acf21b522225268e83354d990b8d9a52f4eaf601f8e2d6600bbac"
},
["column.containers[].blocks[]|3.settings.labelsFontSize"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "943f96b10e4a120f3b97f8a2823867f37d210fc0affad81efe7d534f40c3bc14"
},
["column.containers[].blocks[]|3.settings.labelsFontColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["column.containers[].blocks[]|3.settings.labelsAdvancedColorSettings"]: {
  "required": false,
  "type": "object",
  "schemaHash": "7995e7231586d8a9c6e90199d7d8f3a56b2dbce178575493f776f6ab7813175f"
},
["column.containers[].blocks[]|3.settings.labelsAdvancedColorSettings.days"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["column.containers[].blocks[]|3.settings.labelsAdvancedColorSettings.hours"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["column.containers[].blocks[]|3.settings.labelsAdvancedColorSettings.minutes"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["column.containers[].blocks[]|3.settings.labelsAdvancedColorSettings.seconds"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
}
};

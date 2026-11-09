
export default {
["socialBlock.settings|1.networks[]|0.type"]: {
  "required": true,
  "type": "string",
  "enum": [
    "twitter",
    "xcom",
    "facebook",
    "youtube",
    "askfm",
    "behance",
    "dribbble",
    "flickr",
    "foursquare",
    "googleplus",
    "instagram",
    "lastfm",
    "linkedin",
    "myspace",
    "pinterest",
    "soundcloud",
    "tumblr",
    "vimeo",
    "hangouts",
    "messenger",
    "skype",
    "snapchat",
    "telegram",
    "viber",
    "whatsapp",
    "email",
    "website",
    "mapmarker",
    "world",
    "address",
    "phone",
    "share",
    "rss",
    "appstore",
    "googleplay",
    "windowsstore",
    "wechat",
    "weibo",
    "blogger",
    "medium",
    "dropbox",
    "googledrive",
    "slack",
    "github",
    "pdf",
    "doc",
    "xls",
    "ppt",
    "xing",
    "meetup",
    "fleeped",
    "tripAdvisor",
    "spotify",
    "tiktok",
    "workplace",
    "gmail",
    "iTunesPodcasts",
    "zoom",
    "teams",
    "onedrive",
    "discord",
    "twitch",
    "line",
    "patreon",
    "kofi",
    "yammer",
    "buyMeACoffee",
    "huaweiAppGallery",
    "googleBusiness",
    "reddit",
    "strava",
    "goodreads",
    "yelp",
    "google",
    "mastodon",
    "glassdoor",
    "threads",
    "bluesky",
    "digg",
    "meet"
  ],
  "schemaHash": "49ec7455eeff4d53d30116d105ca1b3d6815753ed41d0dbc7d4a5529e32aa00b"
},
["socialBlock.settings|1.networks[]|0.link"]: {
  "required": false,
  "type": "object",
  "schemaHash": "32bb75116fb407750dcc3074334a6c1371288dfb0eb4199e9afa97a840cce676"
},
["socialBlock.settings|1.networks[]|0.link.type"]: {
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
["socialBlock.settings|1.networks[]|0.link.href"]: {
  "required": true,
  "type": "string",
  "schemaHash": "4af1f3f421635d3c1cf829b6a639a53e97d05ce88f56ddcf1cb17fc2fc8756ce"
},
["socialBlock.settings|1.networks[]|0.title"]: {
  "required": true,
  "type": "string",
  "schemaHash": "41a284743e9c4263b58a017a2e26003d15bb3ceec595098f7b3d4ed7179babfa"
},
["socialBlock.settings|1.networks[]|0.alt"]: {
  "required": true,
  "type": "string",
  "schemaHash": "74dd59f9b6d0cadba3367ea53c1b2175526392f52bd6af0257d84155112cf22b"
},
["socialBlock.settings|1.networks[]|1"]: {
  "required": true,
  "type": "object",
  "schemaHash": "c4c1495fd9f1e4ac198057d5d5c43ba6b464446828c92590b7c6da185de15657"
},
["socialBlock.settings|1.networks[]|1.type"]: {
  "required": true,
  "type": "string",
  "const": "custom",
  "schemaHash": "da640290cf80e31dc61f18ed62b68bb7a49d4493854301250aec3b50c911478f"
},
["socialBlock.settings|1.networks[]|1.link"]: {
  "required": false,
  "type": "object",
  "schemaHash": "32bb75116fb407750dcc3074334a6c1371288dfb0eb4199e9afa97a840cce676"
},
["socialBlock.settings|1.networks[]|1.link.type"]: {
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
["socialBlock.settings|1.networks[]|1.link.href"]: {
  "required": true,
  "type": "string",
  "schemaHash": "4af1f3f421635d3c1cf829b6a639a53e97d05ce88f56ddcf1cb17fc2fc8756ce"
},
["socialBlock.settings|1.networks[]|1.title"]: {
  "required": true,
  "type": "string",
  "schemaHash": "41a284743e9c4263b58a017a2e26003d15bb3ceec595098f7b3d4ed7179babfa"
},
["socialBlock.settings|1.networks[]|1.alt"]: {
  "required": true,
  "type": "string",
  "schemaHash": "74dd59f9b6d0cadba3367ea53c1b2175526392f52bd6af0257d84155112cf22b"
},
["socialBlock.settings|1.networks[]|1.icon"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f38785d6f90bc3b830d1127ca0e1c62678c6f971e0053c2e983ade6b21cc518f"
},
["socialBlock.settings|1.textCustomization"]: {
  "required": true,
  "type": "boolean",
  "const": true,
  "schemaHash": "81d9ae98d803ffa2ecd89c0e510270cf2fc85fab150a51af462b34dbabed0011"
},
["htmlBlock"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "6f6288e1669ad1e37377b03cd2f2ed1c6ff8849792253c83b718944ba53c2797"
},
["htmlBlock.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["htmlBlock.type"]: {
  "required": true,
  "type": "string",
  "const": "html",
  "schemaHash": "b564d29dcc564c44080dfb30ea6618c52274f2b10d11ceab7985e6ae6191ba17"
},
["htmlBlock.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "0f095c3a12bd3abb1c1e67625ab6a0a26b0805ce0bdd676fa8afa4d25cdd00bc"
},
["htmlBlock.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "efb2498bfd7c3a684731d96285b8c29553f2e46b13fac6d897a5f507ebc3c9ae"
},
["htmlBlock.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["htmlBlock.settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["htmlBlock.settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["htmlBlock.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["htmlBlock.settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["htmlBlock.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["htmlBlock.settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["htmlBlock.settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["htmlBlock.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["htmlBlock.settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["htmlBlock.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["htmlBlock.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["htmlBlock.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["htmlBlock.content"]: {
  "required": false,
  "type": "string",
  "schemaHash": "f74eeb05658277953b41f91919dc54bbff64a5d5a8f429a69d14e564a41f8251"
},
["buttonBlock"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "80ac70f063ca2ac79b77b210c62cca45a15aa25099b47407170fbc7f73716c85"
},
["buttonBlock.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["buttonBlock.type"]: {
  "required": true,
  "type": "string",
  "const": "button",
  "schemaHash": "890a2d705fe1b9bb52da3e4ba7b2d00c28049aa7ae5ea53c29f873bd9546fc2e"
},
["buttonBlock.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f94d80de9cc71ba62c05fcc95b354ee652ad64e49149f1673b204b920b76b4c3"
},
["buttonBlock.settings.link"]: {
  "required": false,
  "schemaHash": "f4d18896c6c543ad6f767d40d58ce47dcdbc7d7780a8726d5766138e91756cb7"
},
["buttonBlock.settings.link|0"]: {
  "required": false,
  "type": "object",
  "schemaHash": "bedaf821791c986093afd0ea9e0b0c0c6feb368166d1300bdd330465d7e83ce7"
},
["buttonBlock.settings.link|0.type"]: {
  "required": true,
  "type": "string",
  "enum": [
    "site",
    "anchor",
    "email",
    "phone",
    "sms",
    "telegram",
    "viber",
    "file",
    "other"
  ],
  "schemaHash": "5f75f04e22da5d74107c195139ac89d1a0dce66b3afd8f28b8f75d832b493c02"
},
["buttonBlock.settings.link|0.value"]: {
  "required": true,
  "type": "string",
  "schemaHash": "787b8b040c1ec311f4a5a67e677278d3c17251d2e96400bfb5f07dd05cfbc20b"
},
["buttonBlock.settings.link|1"]: {
  "required": false,
  "type": "object",
  "schemaHash": "13032ab10ace6af7a014092748b32bdc3805582205e93fbeba5aa3dd3cc02227"
},
["buttonBlock.settings.link|1.type"]: {
  "required": true,
  "type": "string",
  "const": "salesforce_mc",
  "schemaHash": "f295d2c26fcca2b2a87fbf813c3a5e72c33e05766cb936a89db82a1ce8556bea"
},
["buttonBlock.settings.link|1.value"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9fccccc0a6161ea0a6492e575a6e987c974f141aedb3ef48405d06169b600cd7"
},
["buttonBlock.settings.link|1.salesforce"]: {
  "required": true,
  "type": "object",
  "schemaHash": "c070635a0b3b95f344516ed8c36e3be7c43f6e742a0e3f16be275ac046b2d549"
},
["buttonBlock.settings.link|1.salesforce.trackingAlias"]: {
  "required": true,
  "type": "string",
  "schemaHash": "0197908a56f16fdf07670c39cd3aeb4e5a792f3209d5eff76414518c5b98f347"
},
["buttonBlock.settings.link|1.salesforce.linkTo"]: {
  "required": true,
  "type": "string",
  "schemaHash": "4be9ab3882f7482cb8e8b3ab49b728b083fff2bb0edb71e62a99a8ce6cda6b64"
},
["buttonBlock.settings.link|1.salesforce.conversion"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "e13f5b000b6fb84056a7b4cb5bf8b5e1aad2190d58e741f84ad4951c84a3f5a7"
},
["buttonBlock.settings.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "0451958f62b2c97228ae8b8074f43d378097c8e50b3dca38a5dea0a431101af4"
},
["buttonBlock.settings.alignment"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a6d1cbfbbda2baf0738220f470e19118e348c0f26b7667a2c680eff5f498a6c2"
},
["buttonBlock.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["buttonBlock.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["buttonBlock.settings.fixedHeight"]: {
  "required": false,
  "type": "object",
  "schemaHash": "7148655db542490be44d5600efa7efc72b7dffbe15f04c51d7bcfedc681a9518"
},
["buttonBlock.settings.fixedHeight.height"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "5675bf3b48cc71530dfaffb22f0e7bbf2377300e650baf36a469d2f0ad37a719"
},
["buttonBlock.settings.fixedHeight.alignment"]: {
  "required": false,
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ],
  "schemaHash": "dc6b57efee1ab477ecaf7ed64c674509f7b75bc0346dde2d0ccf430ac62e9304"
},
["buttonBlock.settings.icon"]: {
  "required": false,
  "type": "object",
  "schemaHash": "16d95f29d529ca22cc49b1bf33ab52cac4a1beefff21b16f4a6e5afe9174cd47"
},
["buttonBlock.settings.icon.src"]: {
  "required": true,
  "type": "string",
  "schemaHash": "2677517d907eeb77fc483c1df0683cfb020b2533bfa02234249226fb0bea442d"
},
["buttonBlock.settings.icon.width"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "61deefde391b3a714b439be4655000cd32fb0b2498443c1447300c8241e3cfb4"
},
["buttonBlock.settings.icon.align"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "right"
  ],
  "schemaHash": "f20e5dda6dd254139c64ce8375a86c4ce1d08f200aad343e8d8044223370dde3"
},
["buttonBlock.settings.icon.indent"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "d347387756f9155616a3b4e6badf26e271c0f8ebf4fa6007080d7c61170b5b3b"
},
["buttonBlock.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["buttonBlock.settings.padding"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ac9151ad4a5d4554e1bdc923d842f21f2c8f1e7923c1791712e1e97ce4b44833"
},
["buttonBlock.settings.padding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "bbd310725f63a51f3d1aba438d08be25e30905966b4e5e9b284a059359c6747f"
},
["buttonBlock.settings.padding.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["buttonBlock.settings.padding.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["buttonBlock.settings.padding.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["buttonBlock.settings.padding.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["buttonBlock.settings.padding.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "bbd310725f63a51f3d1aba438d08be25e30905966b4e5e9b284a059359c6747f"
},
["buttonBlock.settings.padding.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["buttonBlock.settings.padding.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["buttonBlock.settings.padding.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["buttonBlock.settings.padding.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["buttonBlock.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ac9151ad4a5d4554e1bdc923d842f21f2c8f1e7923c1791712e1e97ce4b44833"
},
["buttonBlock.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "bbd310725f63a51f3d1aba438d08be25e30905966b4e5e9b284a059359c6747f"
},
["buttonBlock.settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["buttonBlock.settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["buttonBlock.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["buttonBlock.settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["buttonBlock.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "bbd310725f63a51f3d1aba438d08be25e30905966b4e5e9b284a059359c6747f"
},
["buttonBlock.settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["buttonBlock.settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["buttonBlock.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["buttonBlock.settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["buttonBlock.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["buttonBlock.settings.anchorLink"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b54a3cf83c496f68e0ecccf6f542d29acefdcadde87904b794e896cb4da4fa9b"
},
["buttonBlock.settings.backgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["buttonBlock.settings.fontFamily"]: {
  "required": true,
  "type": "string",
  "schemaHash": "78035a700913e51bf0090fc676344739af2d24e9b225273c8da3c117f1254168"
},
["buttonBlock.settings.fontSize"]: {
  "required": true,
  "type": "object",
  "schemaHash": "53415842ab6e3e1d40d9834d7380b3b174ceafe86078d8be32cc742f9831a34e"
},
["buttonBlock.settings.fontSize.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "37a816d815e6dbdf6a8fefb6902097a07c3a8cf81fad8280cee2524b1803daaa"
},
["buttonBlock.settings.fontSize.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f4a7861268e296034c8838cc047dfd4d8eeb4e1714073ae6be48740b4b5a6ab2"
},
["buttonBlock.settings.textStyle"]: {
  "required": true,
  "type": "object",
  "schemaHash": "097867f06168ff20676d7e496ad6c1f778fa8254e52cc247c4190619123aa7f4"
},
["buttonBlock.settings.textStyle.bold"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "3b99ebeb89671d9886088bd336817526f52cc0c80c7eab43b21c2e5795bedc67"
},
["buttonBlock.settings.textStyle.italic"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "31a22d79e498a049f58f727ecd2c3d327d0dfd7801f0aa50a680ac78fb1b685e"
},
["buttonBlock.settings.fitContainer"]: {
  "required": true,
  "type": "object",
  "schemaHash": "4c211d98bbdeedd5307ec190150565ad4fbb7d697d84d58a9cc565c3c8b9013b"
},
["buttonBlock.settings.fitContainer.desktop"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "92f298c52e8ba4adc92717164346d78a711232b0383dbda9e98a80bbba0f131a"
},
["buttonBlock.settings.fitContainer.mobile"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "fd36a7fb98c48c355707352a8fd5370f8bfb62b54ceeb7834509800a360f638e"
},
["buttonBlock.settings.blockBackgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["buttonBlock.settings.borderRadius"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["buttonBlock.settings.borderRadius.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "c6a7ff699a4fa712c9fa55a9c2b0d3ad74f2c553003f34c77f684d541148a799"
},
["buttonBlock.settings.borderRadius.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76aafbb93390c3dff8b2ae02b12097a3d3738647f00ac4e4e7aa4fb38cee5c2b"
},
["buttonBlock.settings.borderRadius.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "3bfb5286fc5028d5eabaa11a8db3f7678318acc269d485f50ce2d47c675a58b4"
},
["buttonBlock.settings.borderRadius.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "65b696cd36e9bba1b6772e1f1b30b41c7c1ead9b9bc4011ef1ee8e9098bd84ca"
},
["buttonBlock.settings.border"]: {
  "required": true,
  "type": "object",
  "schemaHash": "dd0a3c911e673ccbedf16997b948eee2a85e978a8001e2fdde28ff8af0eb0684"
},
["buttonBlock.settings.border.top"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["buttonBlock.settings.border.top.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["buttonBlock.settings.border.top.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["buttonBlock.settings.border.right"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["buttonBlock.settings.border.right.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["buttonBlock.settings.border.right.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["buttonBlock.settings.border.bottom"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["buttonBlock.settings.border.bottom.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["buttonBlock.settings.border.bottom.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["buttonBlock.settings.border.left"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["buttonBlock.settings.border.left.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["buttonBlock.settings.border.left.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["buttonBlock.settings.border.style"]: {
  "required": true,
  "type": "string",
  "enum": [
    "solid",
    "dashed",
    "dotted"
  ],
  "schemaHash": "4dccba551d73ee1e024ebf753a1823f51e085b0195de30d1842495dae37ae465"
},
["buttonBlock.settings.fontColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["spacerBlock"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "8c432112413b27e8f649078f90e0013afc735a3d8bc88ae3b46eaf0bd446e656"
},
["spacerBlock.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["spacerBlock.type"]: {
  "required": true,
  "type": "string",
  "const": "spacer",
  "schemaHash": "7fb569cb979025f3d49b186083158d32c38d5ab99cdc1c4eb4f629c53d9baab9"
},
["spacerBlock.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "37833f27705b11acb7d96180c00566952b933482c9803d0320fdba732accd624"
},
["spacerBlock.settings.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "line",
    "space"
  ],
  "schemaHash": "1beabef25c885746e0ccd1a65d2f11e50594e9db027e5c03bf69b3b2fa88f6a3"
},
["spacerBlock.settings.width"]: {
  "required": false,
  "type": "object",
  "schemaHash": "1d8f25df2380bda3ca95e069dc8453b95f04988265eb1cfffc04a191a92fec03"
},
["spacerBlock.settings.width.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "3281c2e46369e0da89b887472e61a6f00fcee785333da934643502032b2344c1"
},
["spacerBlock.settings.width.desktop.value"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "5060ed159defc264e5077a427132f212c8fe96d1d8cd69126ab488d4fb6405c3"
},
["spacerBlock.settings.width.desktop.unit"]: {
  "required": true,
  "type": "string",
  "enum": [
    "percent",
    "px"
  ],
  "schemaHash": "d8192b9d7b6927ca2f5d48b4a34841d831952eb17b0eb602891ec124249ae7af"
},
["spacerBlock.settings.width.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "683a0345a21b9257906b20ea39eda80236fceda11a244830bdcfcad08d99b115"
},
["spacerBlock.settings.width.mobile.value"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "5060ed159defc264e5077a427132f212c8fe96d1d8cd69126ab488d4fb6405c3"
},
["spacerBlock.settings.width.mobile.unit"]: {
  "required": true,
  "type": "string",
  "enum": [
    "percent",
    "px"
  ],
  "schemaHash": "d8192b9d7b6927ca2f5d48b4a34841d831952eb17b0eb602891ec124249ae7af"
},
["spacerBlock.settings.height"]: {
  "required": false,
  "type": "object",
  "schemaHash": "80304402b75f89ccbbb32dc24b6aff8ad83cc5d733a182d752f507c5553c3b3e"
},
["spacerBlock.settings.height.desktop"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "032fa92b76ca7c5881e6acbc05fa44b2a70d438a23ad393c3676dba8b99fef26"
},
["spacerBlock.settings.height.mobile"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "4622d6cc98183ddb84605c0dbb8fcb3fe4026fe6e3ffe14f86a80834f911c24b"
},
["spacerBlock.settings.border"]: {
  "required": false,
  "type": "object",
  "schemaHash": "8e43c016953f2915ee5f9f070fddec6e2d87062815e4ff0f35ae790c8e38d785"
},
["spacerBlock.settings.border.size"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "57dd47f8986f116b767407fb03819307aeae4b1a68b07da8637a996f1d4328b6"
},
["spacerBlock.settings.border.style"]: {
  "required": true,
  "type": "string",
  "enum": [
    "solid",
    "dashed",
    "dotted"
  ],
  "schemaHash": "4dccba551d73ee1e024ebf753a1823f51e085b0195de30d1842495dae37ae465"
},
["spacerBlock.settings.border.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["spacerBlock.settings.mobileBorder"]: {
  "required": false,
  "schemaHash": "9d4f33effe2b9b036dc301ee73725cfc1625ab329ab8fde450e2715b8c812164"
},
["spacerBlock.settings.mobileBorder|0"]: {
  "required": false,
  "type": "object",
  "schemaHash": "2e950681652a28155be6078f26dea6e09f3d0b7719141538ddb7139eac5a68b5"
},
["spacerBlock.settings.mobileBorder|0.size"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "57dd47f8986f116b767407fb03819307aeae4b1a68b07da8637a996f1d4328b6"
},
["spacerBlock.settings.mobileBorder|0.style"]: {
  "required": true,
  "type": "string",
  "enum": [
    "solid",
    "dashed",
    "dotted"
  ],
  "schemaHash": "4dccba551d73ee1e024ebf753a1823f51e085b0195de30d1842495dae37ae465"
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
  "schemaHash": "07f9770e97b1b279bf5da42e0850f18c63ade40a67d45f2b8a7186a743be3dcf"
},
["spacerBlock.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["spacerBlock.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["spacerBlock.settings.backgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["spacerBlock.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "0d0acdc7319eef3e0cee7438501389df831f35627368feec21505c812033706e"
},
["spacerBlock.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "153f2c944860bdccb7e8821d4f9d9dd97bf55ae1ee21e837ad8d00f1fc857fd4"
},
["spacerBlock.settings.margins.desktop.top"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "4b67692ce872706ad410b2f24d823889659cfc9fd6e76eb4858a8f4296af7abf"
},
["spacerBlock.settings.margins.desktop.right"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "b84407bfa9f1b636e542b53f31222fc37c430b176a80163697f82db706fb5134"
},
["spacerBlock.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "ef41541766d2a4342e8556b29715d84b9dc1cedf19777d5ddcbaab3606a88495"
},
["spacerBlock.settings.margins.desktop.left"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "8031b991a1a7753c209020cc13da6518133f7412480c0543d3bd1b344c0a9ff0"
},
["spacerBlock.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "153f2c944860bdccb7e8821d4f9d9dd97bf55ae1ee21e837ad8d00f1fc857fd4"
},
["spacerBlock.settings.margins.mobile.top"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "4b67692ce872706ad410b2f24d823889659cfc9fd6e76eb4858a8f4296af7abf"
},
["spacerBlock.settings.margins.mobile.right"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "b84407bfa9f1b636e542b53f31222fc37c430b176a80163697f82db706fb5134"
},
["spacerBlock.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "ef41541766d2a4342e8556b29715d84b9dc1cedf19777d5ddcbaab3606a88495"
},
["spacerBlock.settings.margins.mobile.left"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "8031b991a1a7753c209020cc13da6518133f7412480c0543d3bd1b344c0a9ff0"
},
["spacerBlock.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
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
  "schemaHash": "580d4b54c2b33c066e8b29ec6b42a5b3288f9aa29f506003353bb693ceeb8260"
},
["menuBlock.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["menuBlock.type"]: {
  "required": true,
  "type": "string",
  "const": "menu",
  "schemaHash": "ab963238e532d7ed6336aff24bc3c7cd2d072f3e28423b347029a56f94d064e2"
},
["menuBlock.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a18d7ff8e9979d09f4d62fc0313d044e232d7012d0a49094b36c1d6922d175db"
},
["menuBlock.settings.responsiveMenu"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "d4ef91b875c2cf2be938dafbc028f627d93034c1a975c51b6b940fcb4b8cd6f2"
},
["menuBlock.settings.itemType"]: {
  "required": true,
  "schemaHash": "6329eaefb6ca8e765099b97f056380082b70ca25b205cc00e339b996453b98ab"
},
["menuBlock.settings.itemType|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f75f664ccddf5f7f5cb8a2d87193bd9884c654fc99087ea319dc621665464929"
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
  "schemaHash": "baa1b4066517d3e9574818e0c12d1ec7338da69550b498fe5f5cb8f82b7eced3"
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
  "schemaHash": "8bc2ebf055a0c118998eb1843ec0ae37be7f9073d5a30f29b62a9369cd77860e"
},
["menuBlock.settings.itemPadding"]: {
  "required": true,
  "type": "object",
  "schemaHash": "d8e6815c12a1c05383ef2329e695bd9861b695a463a95ffea2ab8e9673503ead"
},
["menuBlock.settings.itemPadding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b865ea01c469d7a59729bcfd5dfc59a59a62bf9f8beed9108d5c54c95bbcc8ce"
},
["menuBlock.settings.itemPadding.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["menuBlock.settings.itemPadding.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["menuBlock.settings.itemPadding.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["menuBlock.settings.itemPadding.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["menuBlock.settings.itemPadding.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b865ea01c469d7a59729bcfd5dfc59a59a62bf9f8beed9108d5c54c95bbcc8ce"
},
["menuBlock.settings.itemPadding.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["menuBlock.settings.itemPadding.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["menuBlock.settings.itemPadding.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["menuBlock.settings.itemPadding.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["menuBlock.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "d8e6815c12a1c05383ef2329e695bd9861b695a463a95ffea2ab8e9673503ead"
},
["menuBlock.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b865ea01c469d7a59729bcfd5dfc59a59a62bf9f8beed9108d5c54c95bbcc8ce"
},
["menuBlock.settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["menuBlock.settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["menuBlock.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["menuBlock.settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["menuBlock.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b865ea01c469d7a59729bcfd5dfc59a59a62bf9f8beed9108d5c54c95bbcc8ce"
},
["menuBlock.settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["menuBlock.settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["menuBlock.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["menuBlock.settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["menuBlock.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
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
  "schemaHash": "3e5eee7308d3622a69d9eb605084a10fb4c0ebf8c2e7674279cea5fe431db47c"
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
  "schemaHash": "e31d20feaf228b124f55b5ecfa2335a60c09a3da9120dca60b35d0de9dae56dc"
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
  "schemaHash": "37a816d815e6dbdf6a8fefb6902097a07c3a8cf81fad8280cee2524b1803daaa"
},
["menuBlock.settings.fontSize.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f4a7861268e296034c8838cc047dfd4d8eeb4e1714073ae6be48740b4b5a6ab2"
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
  "schemaHash": "55f84de7664e4c3a3497e105a238d1404386c7f88c13adb56f7032630cebfaeb"
},
["menuBlock.settings.textStyle.bold"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "3b99ebeb89671d9886088bd336817526f52cc0c80c7eab43b21c2e5795bedc67"
},
["menuBlock.settings.textStyle.italic"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "31a22d79e498a049f58f727ecd2c3d327d0dfd7801f0aa50a680ac78fb1b685e"
},
["menuBlock.settings.textStyle.underline"]: {
  "required": false,
  "type": "boolean",
  "schemaHash": "ba949aff5ae5ee83d62cb030597ef18aabdeb64285dbe1467e369987243cb99e"
},
["menuBlock.settings.colors"]: {
  "required": true,
  "schemaHash": "5a7f7e6ab6991ebe9f113ccb0fa51d9c81958cca42aeb1d94a3e1fcba7d373c7"
},
["menuBlock.settings.colors|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "93806dde06fa7a2c94661a4ccd1cc773f6d6e106276a560158186336f8544f52"
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
  "schemaHash": "637652109513c6cbee0c3e5dc4d9ef1604f726b0eae8cc135b32d89ba39a2b89"
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
  "schemaHash": "258e2bc002695b4d5327b9abd421767c9e6d97f13bac76cfa47ce4edd6ed2218"
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
  "schemaHash": "c20d05644774083c0f77f06cdfa0dc43739e588171b713618a04207aba3140fd"
},
["menuBlock.settings.items[].name"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b076da2f23f288fbed7fc62a013f68f6111279a3b3c96e561dbb01f147fa283b"
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
  "schemaHash": "1d3d888ccbcd1037f232b9d8090319f42e4c5eaad0db37e55fbd7c9536226df9"
},
["menuBlock.settings.items[].link.value"]: {
  "required": true,
  "type": "string",
  "schemaHash": "5b279184e9835bc3e8b361d8c8305d63cec763221dda4971183b0a4299972386"
},
["menuBlock.settings.items[].image"]: {
  "required": false,
  "type": "object",
  "schemaHash": "424c8b880bc06a8962a1f64241384bcb4af1e3747dfdf3ca4894d4e4c0cafbf8"
},
["menuBlock.settings.items[].image.src"]: {
  "required": true,
  "type": "string",
  "schemaHash": "ab15e46494490e83a081f6e0baa4e145cc536dbab5e67bc6602bccc08ef22187"
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
  "schemaHash": "9f071eafff10120d0f12cb6d907c9f7e2033c748bf97e71e19e3fe399cb00f79"
},
["menuBlock.settings.items[].image.size.px"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "0921a8e76f389dc7d08580a195f53d15f075b462e36e89f2d649594adc5007ed"
},
["menuBlock.settings.items[].image.alignment"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "04aab43d56e72e18b3288884e5f8bcc4040d0027920f86649923a5f3b3751af1"
},
["menuBlock.settings.items[].image.indent"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "37c278bba54aa91fc6da77acdb75cf92bc457dc432668d2d8172f0a632a6ed88"
},
["menuBlock.settings.items[].image.altText"]: {
  "required": true,
  "type": "string",
  "schemaHash": "5416d6de635a80a43a160d01f44dad7c972d14d5772dbbbf659528157b78ac19"
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
  "schemaHash": "0f745e2518c1ca692813ee55636d008ba021361f22aa88b3853f80060bb190af"
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
  "schemaHash": "b2b37b4021155289853eaf52e48fdc00bb1a125933cff239bd85ff86e7fea956"
},
["unknownBlock.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["unknownBlock.type"]: {
  "required": true,
  "type": "string",
  "const": "unknown",
  "schemaHash": "fe6bb182b452b7635fb96db632fb78c84f645e0b23cb2cbfa91c6704efb54358"
},
["unknownBlock.settings"]: {
  "required": false,
  "type": "object",
  "schemaHash": "e176716081727d356ee723bc3404dcf5d9468367fffaa90a7670d5a580e754f2"
},
["unknownBlock.content"]: {
  "required": true,
  "type": "string",
  "schemaHash": "8a81a5c513461d5d8534067a1bf32236034dffcbe2b8d13babf92714febabf6f"
},
["unknownBlock.extension"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "a3049eb948cd2442f383a70aa8b7fa5a724394898101edebf8848c4d1ad820a8"
}
};

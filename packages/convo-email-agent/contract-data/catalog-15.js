
export default {
["column.containers[].blocks[]|4.settings|0.networks[]|0.link.type"]: {
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
["column.containers[].blocks[]|4.settings|0.networks[]|0.link.href"]: {
  "required": true,
  "type": "string",
  "schemaHash": "4af1f3f421635d3c1cf829b6a639a53e97d05ce88f56ddcf1cb17fc2fc8756ce"
},
["column.containers[].blocks[]|4.settings|0.networks[]|0.title"]: {
  "required": true,
  "type": "string",
  "schemaHash": "41a284743e9c4263b58a017a2e26003d15bb3ceec595098f7b3d4ed7179babfa"
},
["column.containers[].blocks[]|4.settings|0.networks[]|1"]: {
  "required": true,
  "type": "object",
  "schemaHash": "66eb9eae6a9e88001f4d5294803cb9c6c1172c71c92b548af22680726dbc19de"
},
["column.containers[].blocks[]|4.settings|0.networks[]|1.type"]: {
  "required": true,
  "type": "string",
  "const": "custom",
  "schemaHash": "da640290cf80e31dc61f18ed62b68bb7a49d4493854301250aec3b50c911478f"
},
["column.containers[].blocks[]|4.settings|0.networks[]|1.link"]: {
  "required": false,
  "type": "object",
  "schemaHash": "32bb75116fb407750dcc3074334a6c1371288dfb0eb4199e9afa97a840cce676"
},
["column.containers[].blocks[]|4.settings|0.networks[]|1.link.type"]: {
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
["column.containers[].blocks[]|4.settings|0.networks[]|1.link.href"]: {
  "required": true,
  "type": "string",
  "schemaHash": "4af1f3f421635d3c1cf829b6a639a53e97d05ce88f56ddcf1cb17fc2fc8756ce"
},
["column.containers[].blocks[]|4.settings|0.networks[]|1.title"]: {
  "required": true,
  "type": "string",
  "schemaHash": "41a284743e9c4263b58a017a2e26003d15bb3ceec595098f7b3d4ed7179babfa"
},
["column.containers[].blocks[]|4.settings|0.networks[]|1.icon"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f38785d6f90bc3b830d1127ca0e1c62678c6f971e0053c2e983ade6b21cc518f"
},
["column.containers[].blocks[]|4.settings|0.textCustomization"]: {
  "required": true,
  "type": "boolean",
  "const": false,
  "schemaHash": "fda4eaa284429022ba95513b7302e9ee6a000cc2078363da191eb44a4fbea301"
},
["column.containers[].blocks[]|4.settings|1"]: {
  "required": true,
  "type": "object",
  "schemaHash": "08f8bf937bb2d37a2f6c82d875857ad27efb1ed74a6346259311451b19124fd9"
},
["column.containers[].blocks[]|4.settings|1.style"]: {
  "required": true,
  "type": "string",
  "enum": [
    "custom",
    "logoColored",
    "logoBlack",
    "logoGray",
    "logoWhite",
    "circleColored",
    "circleColoredBordered",
    "roundedColored",
    "roundedColoredBordered",
    "squareColored",
    "squareColoredBordered",
    "circleBlack",
    "circleBlackBordered",
    "roundedBlack",
    "roundedBlackBordered",
    "squareBlack",
    "squareBlackBordered",
    "circleGray",
    "circleGrayBordered",
    "roundedGray",
    "roundedGrayBordered",
    "squareGray",
    "squareGrayBordered",
    "circleWhite",
    "circleWhiteBordered",
    "roundedWhite",
    "roundedWhiteBordered",
    "squareWhite",
    "squareWhiteBordered"
  ],
  "schemaHash": "acb2dc5fb6371efe566c75343d2ac338c779db34b4e3d891aba927c8e24def6a"
},
["column.containers[].blocks[]|4.settings|1.iconSize"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "09f0d6050dec887da138d7564376bfbc58a2272df7edd7062bebe9d0f623f5ec"
},
["column.containers[].blocks[]|4.settings|1.spaceBetweenIcons"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a120dae208683cac8eb71bba21d28099808c2a5a18c66b7b73b7522733845f2d"
},
["column.containers[].blocks[]|4.settings|1.spaceBetweenIcons.desktop"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "bad59b05d8a47dd8584bb58885892234e746b7288ed2ddc374e4f765fc9de520"
},
["column.containers[].blocks[]|4.settings|1.spaceBetweenIcons.mobile"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "e78aa562ff5c55cf163bec2ce650f69c930529b63b49bd38f471f7e5b49914dd"
},
["column.containers[].blocks[]|4.settings|1.alignment"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a72cc3300cbe156ababc83a49b26bf1d8e0c434e06e779d884223db2c025b3d5"
},
["column.containers[].blocks[]|4.settings|1.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["column.containers[].blocks[]|4.settings|1.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["column.containers[].blocks[]|4.settings|1.backgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["column.containers[].blocks[]|4.settings|1.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["column.containers[].blocks[]|4.settings|1.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "2be3ee80dd1e194de193b4844ca8dbd4e9e1866dbaa8128afe1f061cf309bb99"
},
["column.containers[].blocks[]|4.settings|1.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "53fd593d288acf21b522225268e83354d990b8d9a52f4eaf601f8e2d6600bbac"
},
["column.containers[].blocks[]|4.settings|1.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "943f96b10e4a120f3b97f8a2823867f37d210fc0affad81efe7d534f40c3bc14"
},
["column.containers[].blocks[]|4.settings|1.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "2af4ba420a23a7134874c1b643e7e0d977f1dd386d181e771417ef2a3d1c51d6"
},
["column.containers[].blocks[]|4.settings|1.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "2605c621f4a8babb5d5245952d46d9d0378cbf2fb56c439e73e40f103939843e"
},
["column.containers[].blocks[]|4.settings|1.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7995e7231586d8a9c6e90199d7d8f3a56b2dbce178575493f776f6ab7813175f"
},
["column.containers[].blocks[]|4.settings|1.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "53fd593d288acf21b522225268e83354d990b8d9a52f4eaf601f8e2d6600bbac"
},
["column.containers[].blocks[]|4.settings|1.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "943f96b10e4a120f3b97f8a2823867f37d210fc0affad81efe7d534f40c3bc14"
},
["column.containers[].blocks[]|4.settings|1.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "2af4ba420a23a7134874c1b643e7e0d977f1dd386d181e771417ef2a3d1c51d6"
},
["column.containers[].blocks[]|4.settings|1.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "2605c621f4a8babb5d5245952d46d9d0378cbf2fb56c439e73e40f103939843e"
},
["column.containers[].blocks[]|4.settings|1.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7995e7231586d8a9c6e90199d7d8f3a56b2dbce178575493f776f6ab7813175f"
},
["column.containers[].blocks[]|4.settings|1.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["column.containers[].blocks[]|4.settings|1.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["column.containers[].blocks[]|4.settings|1.networks"]: {
  "required": true,
  "type": "array",
  "schemaHash": "7feafb94dc863ca604ef4ebcb7be84d0961d0b85b5632cc09a26834a55f4ded6"
},
["column.containers[].blocks[]|4.settings|1.networks[]"]: {
  "required": true,
  "schemaHash": "dc9eb80a323389f58e0321ca45ecd3c568bed7b95481ebe71913d85affc63713"
},
["column.containers[].blocks[]|4.settings|1.networks[]|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "54b639765e03b411c6fa05420841cdd0d6fe82ba7ab02fbd2593dcae2a2ded45"
},
["column.containers[].blocks[]|4.settings|1.networks[]|0.type"]: {
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
["column.containers[].blocks[]|4.settings|1.networks[]|0.link"]: {
  "required": false,
  "type": "object",
  "schemaHash": "32bb75116fb407750dcc3074334a6c1371288dfb0eb4199e9afa97a840cce676"
},
["column.containers[].blocks[]|4.settings|1.networks[]|0.link.type"]: {
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
["column.containers[].blocks[]|4.settings|1.networks[]|0.link.href"]: {
  "required": true,
  "type": "string",
  "schemaHash": "4af1f3f421635d3c1cf829b6a639a53e97d05ce88f56ddcf1cb17fc2fc8756ce"
},
["column.containers[].blocks[]|4.settings|1.networks[]|0.title"]: {
  "required": true,
  "type": "string",
  "schemaHash": "41a284743e9c4263b58a017a2e26003d15bb3ceec595098f7b3d4ed7179babfa"
},
["column.containers[].blocks[]|4.settings|1.networks[]|0.alt"]: {
  "required": true,
  "type": "string",
  "schemaHash": "74dd59f9b6d0cadba3367ea53c1b2175526392f52bd6af0257d84155112cf22b"
},
["column.containers[].blocks[]|4.settings|1.networks[]|1"]: {
  "required": true,
  "type": "object",
  "schemaHash": "c4c1495fd9f1e4ac198057d5d5c43ba6b464446828c92590b7c6da185de15657"
},
["column.containers[].blocks[]|4.settings|1.networks[]|1.type"]: {
  "required": true,
  "type": "string",
  "const": "custom",
  "schemaHash": "da640290cf80e31dc61f18ed62b68bb7a49d4493854301250aec3b50c911478f"
},
["column.containers[].blocks[]|4.settings|1.networks[]|1.link"]: {
  "required": false,
  "type": "object",
  "schemaHash": "32bb75116fb407750dcc3074334a6c1371288dfb0eb4199e9afa97a840cce676"
},
["column.containers[].blocks[]|4.settings|1.networks[]|1.link.type"]: {
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
["column.containers[].blocks[]|4.settings|1.networks[]|1.link.href"]: {
  "required": true,
  "type": "string",
  "schemaHash": "4af1f3f421635d3c1cf829b6a639a53e97d05ce88f56ddcf1cb17fc2fc8756ce"
},
["column.containers[].blocks[]|4.settings|1.networks[]|1.title"]: {
  "required": true,
  "type": "string",
  "schemaHash": "41a284743e9c4263b58a017a2e26003d15bb3ceec595098f7b3d4ed7179babfa"
},
["column.containers[].blocks[]|4.settings|1.networks[]|1.alt"]: {
  "required": true,
  "type": "string",
  "schemaHash": "74dd59f9b6d0cadba3367ea53c1b2175526392f52bd6af0257d84155112cf22b"
},
["column.containers[].blocks[]|4.settings|1.networks[]|1.icon"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f38785d6f90bc3b830d1127ca0e1c62678c6f971e0053c2e983ade6b21cc518f"
},
["column.containers[].blocks[]|4.settings|1.textCustomization"]: {
  "required": true,
  "type": "boolean",
  "const": true,
  "schemaHash": "81d9ae98d803ffa2ecd89c0e510270cf2fc85fab150a51af462b34dbabed0011"
},
["column.containers[].blocks[]|5"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "f1b6b701ce0066727ebedd1e2a34a606cfc2fa94cbaba84a9b84e05b0fca91e4"
},
["column.containers[].blocks[]|5.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["column.containers[].blocks[]|5.type"]: {
  "required": true,
  "type": "string",
  "const": "html",
  "schemaHash": "b564d29dcc564c44080dfb30ea6618c52274f2b10d11ceab7985e6ae6191ba17"
},
["column.containers[].blocks[]|5.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "0f095c3a12bd3abb1c1e67625ab6a0a26b0805ce0bdd676fa8afa4d25cdd00bc"
},
["column.containers[].blocks[]|5.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "efb2498bfd7c3a684731d96285b8c29553f2e46b13fac6d897a5f507ebc3c9ae"
},
["column.containers[].blocks[]|5.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["column.containers[].blocks[]|5.settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["column.containers[].blocks[]|5.settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["column.containers[].blocks[]|5.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["column.containers[].blocks[]|5.settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["column.containers[].blocks[]|5.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f0974842225d8b0fbd8ba7aab50640a6355e945036a7294dc4fdbf021b88812d"
},
["column.containers[].blocks[]|5.settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b67221dc100f049ba504d1a2dff45ed221a9781a040e75344bd0a22af55234f4"
},
["column.containers[].blocks[]|5.settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "802befecff7fb4e19d2d319ec6f9b19df56b12ccc44284523ea564f3cfbc63a7"
},
["column.containers[].blocks[]|5.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7c1162100ac24e267b04a084f30aa335e5ad5dfe2712e7130507ddb00588d0ea"
},
["column.containers[].blocks[]|5.settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "24cbcf3cacdd3be29730331e06c047439882c9a9efad7a5ce3d7a75a1eeb32ca"
},
["column.containers[].blocks[]|5.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["column.containers[].blocks[]|5.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["column.containers[].blocks[]|5.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["column.containers[].blocks[]|5.content"]: {
  "required": false,
  "type": "string",
  "schemaHash": "f74eeb05658277953b41f91919dc54bbff64a5d5a8f429a69d14e564a41f8251"
},
["column.containers[].blocks[]|6"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "69307c0535942b5059edb7ee77e0a76047ae0f27e08d60a340c7112baf331042"
},
["column.containers[].blocks[]|6.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["column.containers[].blocks[]|6.type"]: {
  "required": true,
  "type": "string",
  "const": "button",
  "schemaHash": "890a2d705fe1b9bb52da3e4ba7b2d00c28049aa7ae5ea53c29f873bd9546fc2e"
},
["column.containers[].blocks[]|6.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f94d80de9cc71ba62c05fcc95b354ee652ad64e49149f1673b204b920b76b4c3"
},
["column.containers[].blocks[]|6.settings.link"]: {
  "required": false,
  "schemaHash": "f4d18896c6c543ad6f767d40d58ce47dcdbc7d7780a8726d5766138e91756cb7"
},
["column.containers[].blocks[]|6.settings.link|0"]: {
  "required": false,
  "type": "object",
  "schemaHash": "bedaf821791c986093afd0ea9e0b0c0c6feb368166d1300bdd330465d7e83ce7"
},
["column.containers[].blocks[]|6.settings.link|0.type"]: {
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
["column.containers[].blocks[]|6.settings.link|0.value"]: {
  "required": true,
  "type": "string",
  "schemaHash": "787b8b040c1ec311f4a5a67e677278d3c17251d2e96400bfb5f07dd05cfbc20b"
},
["column.containers[].blocks[]|6.settings.link|1"]: {
  "required": false,
  "type": "object",
  "schemaHash": "13032ab10ace6af7a014092748b32bdc3805582205e93fbeba5aa3dd3cc02227"
},
["column.containers[].blocks[]|6.settings.link|1.type"]: {
  "required": true,
  "type": "string",
  "const": "salesforce_mc",
  "schemaHash": "f295d2c26fcca2b2a87fbf813c3a5e72c33e05766cb936a89db82a1ce8556bea"
},
["column.containers[].blocks[]|6.settings.link|1.value"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9fccccc0a6161ea0a6492e575a6e987c974f141aedb3ef48405d06169b600cd7"
},
["column.containers[].blocks[]|6.settings.link|1.salesforce"]: {
  "required": true,
  "type": "object",
  "schemaHash": "c070635a0b3b95f344516ed8c36e3be7c43f6e742a0e3f16be275ac046b2d549"
},
["column.containers[].blocks[]|6.settings.link|1.salesforce.trackingAlias"]: {
  "required": true,
  "type": "string",
  "schemaHash": "0197908a56f16fdf07670c39cd3aeb4e5a792f3209d5eff76414518c5b98f347"
},
["column.containers[].blocks[]|6.settings.link|1.salesforce.linkTo"]: {
  "required": true,
  "type": "string",
  "schemaHash": "4be9ab3882f7482cb8e8b3ab49b728b083fff2bb0edb71e62a99a8ce6cda6b64"
},
["column.containers[].blocks[]|6.settings.link|1.salesforce.conversion"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "e13f5b000b6fb84056a7b4cb5bf8b5e1aad2190d58e741f84ad4951c84a3f5a7"
},
["column.containers[].blocks[]|6.settings.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "0451958f62b2c97228ae8b8074f43d378097c8e50b3dca38a5dea0a431101af4"
},
["column.containers[].blocks[]|6.settings.alignment"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a6d1cbfbbda2baf0738220f470e19118e348c0f26b7667a2c680eff5f498a6c2"
},
["column.containers[].blocks[]|6.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["column.containers[].blocks[]|6.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["column.containers[].blocks[]|6.settings.fixedHeight"]: {
  "required": false,
  "type": "object",
  "schemaHash": "7148655db542490be44d5600efa7efc72b7dffbe15f04c51d7bcfedc681a9518"
},
["column.containers[].blocks[]|6.settings.fixedHeight.height"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "5675bf3b48cc71530dfaffb22f0e7bbf2377300e650baf36a469d2f0ad37a719"
},
["column.containers[].blocks[]|6.settings.fixedHeight.alignment"]: {
  "required": false,
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ],
  "schemaHash": "dc6b57efee1ab477ecaf7ed64c674509f7b75bc0346dde2d0ccf430ac62e9304"
},
["column.containers[].blocks[]|6.settings.icon"]: {
  "required": false,
  "type": "object",
  "schemaHash": "16d95f29d529ca22cc49b1bf33ab52cac4a1beefff21b16f4a6e5afe9174cd47"
},
["column.containers[].blocks[]|6.settings.icon.src"]: {
  "required": true,
  "type": "string",
  "schemaHash": "2677517d907eeb77fc483c1df0683cfb020b2533bfa02234249226fb0bea442d"
},
["column.containers[].blocks[]|6.settings.icon.width"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "61deefde391b3a714b439be4655000cd32fb0b2498443c1447300c8241e3cfb4"
},
["column.containers[].blocks[]|6.settings.icon.align"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "right"
  ],
  "schemaHash": "f20e5dda6dd254139c64ce8375a86c4ce1d08f200aad343e8d8044223370dde3"
},
["column.containers[].blocks[]|6.settings.icon.indent"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "d347387756f9155616a3b4e6badf26e271c0f8ebf4fa6007080d7c61170b5b3b"
},
["column.containers[].blocks[]|6.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["column.containers[].blocks[]|6.settings.padding"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ac9151ad4a5d4554e1bdc923d842f21f2c8f1e7923c1791712e1e97ce4b44833"
},
["column.containers[].blocks[]|6.settings.padding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "bbd310725f63a51f3d1aba438d08be25e30905966b4e5e9b284a059359c6747f"
},
["column.containers[].blocks[]|6.settings.padding.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["column.containers[].blocks[]|6.settings.padding.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["column.containers[].blocks[]|6.settings.padding.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["column.containers[].blocks[]|6.settings.padding.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["column.containers[].blocks[]|6.settings.padding.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "bbd310725f63a51f3d1aba438d08be25e30905966b4e5e9b284a059359c6747f"
},
["column.containers[].blocks[]|6.settings.padding.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["column.containers[].blocks[]|6.settings.padding.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["column.containers[].blocks[]|6.settings.padding.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["column.containers[].blocks[]|6.settings.padding.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["column.containers[].blocks[]|6.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ac9151ad4a5d4554e1bdc923d842f21f2c8f1e7923c1791712e1e97ce4b44833"
},
["column.containers[].blocks[]|6.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "bbd310725f63a51f3d1aba438d08be25e30905966b4e5e9b284a059359c6747f"
},
["column.containers[].blocks[]|6.settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["column.containers[].blocks[]|6.settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["column.containers[].blocks[]|6.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["column.containers[].blocks[]|6.settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["column.containers[].blocks[]|6.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "bbd310725f63a51f3d1aba438d08be25e30905966b4e5e9b284a059359c6747f"
},
["column.containers[].blocks[]|6.settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["column.containers[].blocks[]|6.settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["column.containers[].blocks[]|6.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["column.containers[].blocks[]|6.settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "b952094d83e56f3ac1796c2385be7852fdcfc7a5044670446d83f639e819be78"
},
["column.containers[].blocks[]|6.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["column.containers[].blocks[]|6.settings.anchorLink"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b54a3cf83c496f68e0ecccf6f542d29acefdcadde87904b794e896cb4da4fa9b"
},
["column.containers[].blocks[]|6.settings.backgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["column.containers[].blocks[]|6.settings.fontFamily"]: {
  "required": true,
  "type": "string",
  "schemaHash": "78035a700913e51bf0090fc676344739af2d24e9b225273c8da3c117f1254168"
},
["column.containers[].blocks[]|6.settings.fontSize"]: {
  "required": true,
  "type": "object",
  "schemaHash": "53415842ab6e3e1d40d9834d7380b3b174ceafe86078d8be32cc742f9831a34e"
},
["column.containers[].blocks[]|6.settings.fontSize.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "37a816d815e6dbdf6a8fefb6902097a07c3a8cf81fad8280cee2524b1803daaa"
},
["column.containers[].blocks[]|6.settings.fontSize.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "f4a7861268e296034c8838cc047dfd4d8eeb4e1714073ae6be48740b4b5a6ab2"
},
["column.containers[].blocks[]|6.settings.textStyle"]: {
  "required": true,
  "type": "object",
  "schemaHash": "097867f06168ff20676d7e496ad6c1f778fa8254e52cc247c4190619123aa7f4"
},
["column.containers[].blocks[]|6.settings.textStyle.bold"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "3b99ebeb89671d9886088bd336817526f52cc0c80c7eab43b21c2e5795bedc67"
},
["column.containers[].blocks[]|6.settings.textStyle.italic"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "31a22d79e498a049f58f727ecd2c3d327d0dfd7801f0aa50a680ac78fb1b685e"
},
["column.containers[].blocks[]|6.settings.fitContainer"]: {
  "required": true,
  "type": "object",
  "schemaHash": "4c211d98bbdeedd5307ec190150565ad4fbb7d697d84d58a9cc565c3c8b9013b"
},
["column.containers[].blocks[]|6.settings.fitContainer.desktop"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "92f298c52e8ba4adc92717164346d78a711232b0383dbda9e98a80bbba0f131a"
},
["column.containers[].blocks[]|6.settings.fitContainer.mobile"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "fd36a7fb98c48c355707352a8fd5370f8bfb62b54ceeb7834509800a360f638e"
},
["column.containers[].blocks[]|6.settings.blockBackgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["column.containers[].blocks[]|6.settings.borderRadius"]: {
  "required": true,
  "type": "object",
  "schemaHash": "601d28fffdb4e535fb11ddf53e6ee82d731ef89ba19ba7d6345ed87cf4889381"
},
["column.containers[].blocks[]|6.settings.borderRadius.topLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "c6a7ff699a4fa712c9fa55a9c2b0d3ad74f2c553003f34c77f684d541148a799"
},
["column.containers[].blocks[]|6.settings.borderRadius.topRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76aafbb93390c3dff8b2ae02b12097a3d3738647f00ac4e4e7aa4fb38cee5c2b"
},
["column.containers[].blocks[]|6.settings.borderRadius.bottomRight"]: {
  "required": true,
  "type": "number",
  "schemaHash": "3bfb5286fc5028d5eabaa11a8db3f7678318acc269d485f50ce2d47c675a58b4"
},
["column.containers[].blocks[]|6.settings.borderRadius.bottomLeft"]: {
  "required": true,
  "type": "number",
  "schemaHash": "65b696cd36e9bba1b6772e1f1b30b41c7c1ead9b9bc4011ef1ee8e9098bd84ca"
},
["column.containers[].blocks[]|6.settings.border"]: {
  "required": true,
  "type": "object",
  "schemaHash": "dd0a3c911e673ccbedf16997b948eee2a85e978a8001e2fdde28ff8af0eb0684"
},
["column.containers[].blocks[]|6.settings.border.top"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["column.containers[].blocks[]|6.settings.border.top.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["column.containers[].blocks[]|6.settings.border.top.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["column.containers[].blocks[]|6.settings.border.right"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["column.containers[].blocks[]|6.settings.border.right.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["column.containers[].blocks[]|6.settings.border.right.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["column.containers[].blocks[]|6.settings.border.bottom"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["column.containers[].blocks[]|6.settings.border.bottom.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["column.containers[].blocks[]|6.settings.border.bottom.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["column.containers[].blocks[]|6.settings.border.left"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f8a164c82b38ac7dace45998a4b99d512dd9f236a1721556bf02574b9af1a537"
},
["column.containers[].blocks[]|6.settings.border.left.width"]: {
  "required": true,
  "type": "number",
  "schemaHash": "e6eb09dafc3ddb01f64e722f3e21df06f0645e475e1759376545721b3b5c8a69"
},
["column.containers[].blocks[]|6.settings.border.left.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["column.containers[].blocks[]|6.settings.border.style"]: {
  "required": true,
  "type": "string",
  "enum": [
    "solid",
    "dashed",
    "dotted"
  ],
  "schemaHash": "4dccba551d73ee1e024ebf753a1823f51e085b0195de30d1842495dae37ae465"
},
["column.containers[].blocks[]|6.settings.fontColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["column.containers[].blocks[]|7"]: {
  "required": true,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "schemaHash": "0b9674574df09bc8af75678c6fe5009dae921bd23095143a13385641e82ec74f"
},
["column.containers[].blocks[]|7.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["column.containers[].blocks[]|7.type"]: {
  "required": true,
  "type": "string",
  "const": "spacer",
  "schemaHash": "7fb569cb979025f3d49b186083158d32c38d5ab99cdc1c4eb4f629c53d9baab9"
},
["column.containers[].blocks[]|7.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "37833f27705b11acb7d96180c00566952b933482c9803d0320fdba732accd624"
},
["column.containers[].blocks[]|7.settings.mode"]: {
  "required": true,
  "type": "string",
  "enum": [
    "line",
    "space"
  ],
  "schemaHash": "1beabef25c885746e0ccd1a65d2f11e50594e9db027e5c03bf69b3b2fa88f6a3"
},
["column.containers[].blocks[]|7.settings.width"]: {
  "required": false,
  "type": "object",
  "schemaHash": "1d8f25df2380bda3ca95e069dc8453b95f04988265eb1cfffc04a191a92fec03"
},
["column.containers[].blocks[]|7.settings.width.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "3281c2e46369e0da89b887472e61a6f00fcee785333da934643502032b2344c1"
},
["column.containers[].blocks[]|7.settings.width.desktop.value"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "5060ed159defc264e5077a427132f212c8fe96d1d8cd69126ab488d4fb6405c3"
},
["column.containers[].blocks[]|7.settings.width.desktop.unit"]: {
  "required": true,
  "type": "string",
  "enum": [
    "percent",
    "px"
  ],
  "schemaHash": "d8192b9d7b6927ca2f5d48b4a34841d831952eb17b0eb602891ec124249ae7af"
},
["column.containers[].blocks[]|7.settings.width.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "683a0345a21b9257906b20ea39eda80236fceda11a244830bdcfcad08d99b115"
},
["column.containers[].blocks[]|7.settings.width.mobile.value"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "5060ed159defc264e5077a427132f212c8fe96d1d8cd69126ab488d4fb6405c3"
},
["column.containers[].blocks[]|7.settings.width.mobile.unit"]: {
  "required": true,
  "type": "string",
  "enum": [
    "percent",
    "px"
  ],
  "schemaHash": "d8192b9d7b6927ca2f5d48b4a34841d831952eb17b0eb602891ec124249ae7af"
},
["column.containers[].blocks[]|7.settings.height"]: {
  "required": false,
  "type": "object",
  "schemaHash": "80304402b75f89ccbbb32dc24b6aff8ad83cc5d733a182d752f507c5553c3b3e"
},
["column.containers[].blocks[]|7.settings.height.desktop"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "032fa92b76ca7c5881e6acbc05fa44b2a70d438a23ad393c3676dba8b99fef26"
},
["column.containers[].blocks[]|7.settings.height.mobile"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "4622d6cc98183ddb84605c0dbb8fcb3fe4026fe6e3ffe14f86a80834f911c24b"
},
["column.containers[].blocks[]|7.settings.border"]: {
  "required": false,
  "type": "object",
  "schemaHash": "8e43c016953f2915ee5f9f070fddec6e2d87062815e4ff0f35ae790c8e38d785"
},
["column.containers[].blocks[]|7.settings.border.size"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "57dd47f8986f116b767407fb03819307aeae4b1a68b07da8637a996f1d4328b6"
},
["column.containers[].blocks[]|7.settings.border.style"]: {
  "required": true,
  "type": "string",
  "enum": [
    "solid",
    "dashed",
    "dotted"
  ],
  "schemaHash": "4dccba551d73ee1e024ebf753a1823f51e085b0195de30d1842495dae37ae465"
},
["column.containers[].blocks[]|7.settings.border.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["column.containers[].blocks[]|7.settings.mobileBorder"]: {
  "required": false,
  "schemaHash": "9d4f33effe2b9b036dc301ee73725cfc1625ab329ab8fde450e2715b8c812164"
},
["column.containers[].blocks[]|7.settings.mobileBorder|0"]: {
  "required": false,
  "type": "object",
  "schemaHash": "2e950681652a28155be6078f26dea6e09f3d0b7719141538ddb7139eac5a68b5"
},
["column.containers[].blocks[]|7.settings.mobileBorder|0.size"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "57dd47f8986f116b767407fb03819307aeae4b1a68b07da8637a996f1d4328b6"
},
["column.containers[].blocks[]|7.settings.mobileBorder|0.style"]: {
  "required": true,
  "type": "string",
  "enum": [
    "solid",
    "dashed",
    "dotted"
  ],
  "schemaHash": "4dccba551d73ee1e024ebf753a1823f51e085b0195de30d1842495dae37ae465"
},
["column.containers[].blocks[]|7.settings.mobileBorder|0.color"]: {
  "required": true,
  "type": "string",
  "schemaHash": "e2a279620bb75ecf86b55101a4bf235bb9fcf27bec60bd4cd1c411436fb57e38"
},
["column.containers[].blocks[]|7.settings.mobileBorder|1"]: {
  "required": false,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["column.containers[].blocks[]|7.settings.alignment"]: {
  "required": false,
  "type": "object",
  "schemaHash": "07f9770e97b1b279bf5da42e0850f18c63ade40a67d45f2b8a7186a743be3dcf"
},
["column.containers[].blocks[]|7.settings.alignment.desktop"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["column.containers[].blocks[]|7.settings.alignment.mobile"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "cea782e61d1a555b5c4bebddf5e1bf422ddcc83a0eb361b406b8d09d70ed7f88"
},
["column.containers[].blocks[]|7.settings.backgroundColor"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f606b7cec987cb653b92ac0840d09cec1dfe35a1bdf121212817f060bd4ab3e3"
},
["column.containers[].blocks[]|7.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "0d0acdc7319eef3e0cee7438501389df831f35627368feec21505c812033706e"
},
["column.containers[].blocks[]|7.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "153f2c944860bdccb7e8821d4f9d9dd97bf55ae1ee21e837ad8d00f1fc857fd4"
},
["column.containers[].blocks[]|7.settings.margins.desktop.top"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "4b67692ce872706ad410b2f24d823889659cfc9fd6e76eb4858a8f4296af7abf"
},
["column.containers[].blocks[]|7.settings.margins.desktop.right"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "b84407bfa9f1b636e542b53f31222fc37c430b176a80163697f82db706fb5134"
},
["column.containers[].blocks[]|7.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "ef41541766d2a4342e8556b29715d84b9dc1cedf19777d5ddcbaab3606a88495"
},
["column.containers[].blocks[]|7.settings.margins.desktop.left"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "8031b991a1a7753c209020cc13da6518133f7412480c0543d3bd1b344c0a9ff0"
},
["column.containers[].blocks[]|7.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "153f2c944860bdccb7e8821d4f9d9dd97bf55ae1ee21e837ad8d00f1fc857fd4"
},
["column.containers[].blocks[]|7.settings.margins.mobile.top"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "4b67692ce872706ad410b2f24d823889659cfc9fd6e76eb4858a8f4296af7abf"
},
["column.containers[].blocks[]|7.settings.margins.mobile.right"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "b84407bfa9f1b636e542b53f31222fc37c430b176a80163697f82db706fb5134"
},
["column.containers[].blocks[]|7.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "ef41541766d2a4342e8556b29715d84b9dc1cedf19777d5ddcbaab3606a88495"
},
["column.containers[].blocks[]|7.settings.margins.mobile.left"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "8031b991a1a7753c209020cc13da6518133f7412480c0543d3bd1b344c0a9ff0"
},
["column.containers[].blocks[]|7.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["column.containers[].blocks[]|7.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["column.containers[].blocks[]|7.settings.hideElement"]: {
  "required": true,
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "schemaHash": "b7571603839ed66295f268b8b98c6caeef06907f950caf17ef53fb63d5bf7abc"
},
["column.containers[].blocks[]|8"]: {
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
["column.containers[].blocks[]|8.id"]: {
  "required": true,
  "type": "string",
  "schemaHash": "9378496996ae3dece3ebf32dfd38c47a83af7f0406b4e7d7db208f433ffcee42"
},
["column.containers[].blocks[]|8.type"]: {
  "required": true,
  "type": "string",
  "const": "menu",
  "schemaHash": "ab963238e532d7ed6336aff24bc3c7cd2d072f3e28423b347029a56f94d064e2"
},
["column.containers[].blocks[]|8.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a18d7ff8e9979d09f4d62fc0313d044e232d7012d0a49094b36c1d6922d175db"
},
["column.containers[].blocks[]|8.settings.responsiveMenu"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "d4ef91b875c2cf2be938dafbc028f627d93034c1a975c51b6b940fcb4b8cd6f2"
},
["column.containers[].blocks[]|8.settings.itemType"]: {
  "required": true,
  "schemaHash": "6329eaefb6ca8e765099b97f056380082b70ca25b205cc00e339b996453b98ab"
},
["column.containers[].blocks[]|8.settings.itemType|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f75f664ccddf5f7f5cb8a2d87193bd9884c654fc99087ea319dc621665464929"
},
["column.containers[].blocks[]|8.settings.itemType|0.mode"]: {
  "required": true,
  "type": "string",
  "const": "shared",
  "schemaHash": "1fbcfb8821f7f57078257deae4d212f4434a2837c86343c1d8870461a34ad008"
},
["column.containers[].blocks[]|8.settings.itemType|0.type"]: {
  "required": true,
  "type": "string",
  "enum": [
    "links",
    "icons",
    "linksWithIcons"
  ],
  "schemaHash": "a6306d5fe6442b041d1c98f1191744e401fe9fc12d8f8ad7a9d5a8dc54171a38"
},
["column.containers[].blocks[]|8.settings.itemType|1"]: {
  "required": true,
  "type": "object",
  "schemaHash": "baa1b4066517d3e9574818e0c12d1ec7338da69550b498fe5f5cb8f82b7eced3"
},
["column.containers[].blocks[]|8.settings.itemType|1.mode"]: {
  "required": true,
  "type": "string",
  "const": "perItem",
  "schemaHash": "02933c27236a2ea9f68a8b22ac63f9963ca588343255322ad23f6472edb02128"
},
["column.containers[].blocks[]|8.settings.fitToContainer"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "8bc2ebf055a0c118998eb1843ec0ae37be7f9073d5a30f29b62a9369cd77860e"
},
["column.containers[].blocks[]|8.settings.itemPadding"]: {
  "required": true,
  "type": "object",
  "schemaHash": "d8e6815c12a1c05383ef2329e695bd9861b695a463a95ffea2ab8e9673503ead"
},
["column.containers[].blocks[]|8.settings.itemPadding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b865ea01c469d7a59729bcfd5dfc59a59a62bf9f8beed9108d5c54c95bbcc8ce"
},
["column.containers[].blocks[]|8.settings.itemPadding.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["column.containers[].blocks[]|8.settings.itemPadding.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["column.containers[].blocks[]|8.settings.itemPadding.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["column.containers[].blocks[]|8.settings.itemPadding.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["column.containers[].blocks[]|8.settings.itemPadding.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b865ea01c469d7a59729bcfd5dfc59a59a62bf9f8beed9108d5c54c95bbcc8ce"
},
["column.containers[].blocks[]|8.settings.itemPadding.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["column.containers[].blocks[]|8.settings.itemPadding.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["column.containers[].blocks[]|8.settings.itemPadding.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["column.containers[].blocks[]|8.settings.itemPadding.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["column.containers[].blocks[]|8.settings.margins"]: {
  "required": true,
  "type": "object",
  "schemaHash": "d8e6815c12a1c05383ef2329e695bd9861b695a463a95ffea2ab8e9673503ead"
},
["column.containers[].blocks[]|8.settings.margins.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b865ea01c469d7a59729bcfd5dfc59a59a62bf9f8beed9108d5c54c95bbcc8ce"
},
["column.containers[].blocks[]|8.settings.margins.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["column.containers[].blocks[]|8.settings.margins.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["column.containers[].blocks[]|8.settings.margins.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["column.containers[].blocks[]|8.settings.margins.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["column.containers[].blocks[]|8.settings.margins.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b865ea01c469d7a59729bcfd5dfc59a59a62bf9f8beed9108d5c54c95bbcc8ce"
},
["column.containers[].blocks[]|8.settings.margins.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["column.containers[].blocks[]|8.settings.margins.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["column.containers[].blocks[]|8.settings.margins.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["column.containers[].blocks[]|8.settings.margins.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "639417b92edfbf6d9fca7162649e0e39c96b666de56876b3f89aa953866140af"
},
["column.containers[].blocks[]|8.settings.anchorLinkName"]: {
  "required": true,
  "type": "string",
  "schemaHash": "b85d15de86db3d5b4310adcf51daf7f021273f8024b917f8cd74e8cda32fe834"
},
["column.containers[].blocks[]|8.settings.includeInOutput"]: {
  "required": true,
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "schemaHash": "52e3402be3437c71fe10c40c6cdb1fd5aa95baa6a99786e8eacbea179002175e"
},
["column.containers[].blocks[]|8.settings.separator"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b3cb813276ec28b48bed4550a177fb109d6400f8e1242cf5517a6666e81d996e"
},
["column.containers[].blocks[]|8.settings.separator.width"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "3e5eee7308d3622a69d9eb605084a10fb4c0ebf8c2e7674279cea5fe431db47c"
},
["column.containers[].blocks[]|8.settings.separator.style"]: {
  "required": true,
  "type": "string",
  "enum": [
    "none",
    "line",
    "dashed",
    "dotted"
  ],
  "schemaHash": "e31d20feaf228b124f55b5ecfa2335a60c09a3da9120dca60b35d0de9dae56dc"
}
};

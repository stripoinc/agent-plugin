
export default {
["$"]: {
  "required": true,
  "type": "object",
  "schemaHash": "55646cb30ebfecdb2fcb05e1b2e74fa69869d9b29970569def88612d8a97014b"
},
["$.metadata"]: {
  "required": false,
  "type": "object",
  "schemaHash": "5e790af96268a84586bf810aba00c1e4691b57d7f1d9f520b8a4b316a48e4901"
},
["$.metadata.title"]: {
  "required": false,
  "type": "string",
  "actions": {
    "insert": "supported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "1e6131079576be39514506227fb528c68ed337241abd0f9959cde01f2cacb865"
},
["$.metadata.preheader"]: {
  "required": false,
  "type": "object",
  "actions": {
    "insert": "supported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "0b50e5ab15d8cafb1890d20d2e717c112ce56bd4855a1f1f9552a51c5ce6901c"
},
["$.metadata.preheader.text"]: {
  "required": true,
  "type": "string",
  "schemaHash": "75aee6d79d51f8d5371ba9e72cbad493b0bf3b9dad9555b21f9d7d45e51cbbad"
},
["$.metadata.preheader.fillSpace"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "a67d57b24b9786ad3e96ef51c45c37921d4218d27087ca624f2611658ae5e850"
},
["$.resources"]: {
  "required": false,
  "type": "object",
  "schemaHash": "a12d60faae896f1b8e0f7a2701fe059d0516c6f3b4fe601296c8483d9ecbbcba"
},
["$.resources.fonts"]: {
  "required": false,
  "type": "array",
  "actions": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "b6a995887904ad8077cb55d880766c70d085afe83a9f74c0d43e64f8191c2003"
},
["$.resources.fonts[]"]: {
  "required": true,
  "schemaHash": "bda3982141830f7ae21d019a71cfcb51b592b528c3b084afdfe0b843ba7d3c9f"
},
["$.resources.fonts[]|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "78d13b014b4e713d4d4fd643e487d07fa30ea5ef5bcfdbba70faa420d052ccf7"
},
["$.resources.fonts[]|0.fontFamily"]: {
  "required": true,
  "type": "string",
  "schemaHash": "78035a700913e51bf0090fc676344739af2d24e9b225273c8da3c117f1254168"
},
["$.resources.fonts[]|0.importMethod"]: {
  "required": true,
  "type": "string",
  "const": "link",
  "schemaHash": "bfbfdf71dc2d61afa58a8ab987d38b9a2d08ed01a3a1fcccc30d0fc52d4d8f2e"
},
["$.resources.fonts[]|0.url"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f0ebe3aa93e19c80180d6d6225c66c39cd7ad20e6c32e30d129c6cb933d720b7"
},
["$.resources.fonts[]|1"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ea3fd11776fac1e4d7960962572921d6aeb4f4f8222eb3d70c9ba0b7b24cf0dd"
},
["$.resources.fonts[]|1.fontFamily"]: {
  "required": true,
  "type": "string",
  "schemaHash": "78035a700913e51bf0090fc676344739af2d24e9b225273c8da3c117f1254168"
},
["$.resources.fonts[]|1.importMethod"]: {
  "required": true,
  "type": "string",
  "const": "import",
  "schemaHash": "7f7045db8313d9a0b7b1f52b8bd635d0c5ae45616587c8750476f69e04985e84"
},
["$.resources.fonts[]|1.url"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f0ebe3aa93e19c80180d6d6225c66c39cd7ad20e6c32e30d129c6cb933d720b7"
},
["$.resources.fonts[]|2"]: {
  "required": true,
  "type": "object",
  "schemaHash": "0e429ef44d6c102269f34f56ffbbc1790862de174cca29a26d4a6c7caa3a6d6d"
},
["$.resources.fonts[]|2.fontFamily"]: {
  "required": true,
  "type": "string",
  "schemaHash": "78035a700913e51bf0090fc676344739af2d24e9b225273c8da3c117f1254168"
},
["$.resources.fonts[]|2.importMethod"]: {
  "required": true,
  "type": "string",
  "const": "fontFace",
  "schemaHash": "ecf866424b427d60f144f0bc400b187c285aec5e9658470f9a0fe64b41bc32c9"
},
["$.resources.fonts[]|2.url"]: {
  "required": false,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.resources.fonts[]|2.css"]: {
  "required": true,
  "type": "string",
  "schemaHash": "f0ebe3aa93e19c80180d6d6225c66c39cd7ad20e6c32e30d129c6cb933d720b7"
},
["$.settings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "5b335fb1295b918d03cf7ecdc55152e409d170796a896978eb80bf4da87697ed"
},
["$.settings.general"]: {
  "required": true,
  "type": "object",
  "schemaHash": "106d324c503e53e3372a9b43b39741b1b6c70d42d2f7f7e08d22632a8f961a71"
},
["$.settings.general.defaultStyles"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["$.settings.general.hideImageDownloadIcons"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["$.settings.general.underlineLinks"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["$.settings.general.responsiveDesign"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["$.settings.general.messageAlignment"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "e494aa666465b1cc779625a66e8a6119485e09965b15791b5ec35afb222eec32"
},
["$.settings.general.messageContentWidth"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "7569d5ebd586436c92fd850ca6378e4cce96d6e927f038b0397f4d2fdcc9d8ee"
},
["$.settings.general.backgroundImage"]: {
  "required": true,
  "schemaHash": "6afb94e70e416e401b102aff7bcc29f6b51ba26eb20d686278effcc65a5dd334"
},
["$.settings.general.backgroundImage|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b86c1bcda56ecdbe6957c4cac32b7f661b7d1b0f8dfb6d0b8cdb83d5b12def95"
},
["$.settings.general.backgroundImage|0.path"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.settings.general.backgroundImage|0.repeat"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["$.settings.general.backgroundImage|0.x"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.settings.general.backgroundImage|0.y"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.settings.general.backgroundImage|0.sizeX"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.settings.general.backgroundImage|0.sizeY"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.settings.general.backgroundImage|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.general.rightToLeftTextDirection"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["$.settings.general.marginsAroundMessage"]: {
  "required": true,
  "type": "object",
  "schemaHash": "4dcd2f701dc0554da8add74c990730308eaca988d3b5512ebfffef76242d81ee"
},
["$.settings.general.marginsAroundMessage.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "6632627b851c9ee31664ca2a973c4708c4d1d0f228b09fdcfa2bc45850a51a88"
},
["$.settings.general.marginsAroundMessage.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "cddf8275afa15408533079581ad27f95be579f4eeafbb1fba9fb6f32a4a64387"
},
["$.settings.general.marginsAroundMessage.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "cddf8275afa15408533079581ad27f95be579f4eeafbb1fba9fb6f32a4a64387"
},
["$.settings.general.marginsAroundMessage.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "cddf8275afa15408533079581ad27f95be579f4eeafbb1fba9fb6f32a4a64387"
},
["$.settings.general.marginsAroundMessage.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "cddf8275afa15408533079581ad27f95be579f4eeafbb1fba9fb6f32a4a64387"
},
["$.settings.general.marginsAroundMessage.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "6632627b851c9ee31664ca2a973c4708c4d1d0f228b09fdcfa2bc45850a51a88"
},
["$.settings.general.marginsAroundMessage.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "cddf8275afa15408533079581ad27f95be579f4eeafbb1fba9fb6f32a4a64387"
},
["$.settings.general.marginsAroundMessage.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "cddf8275afa15408533079581ad27f95be579f4eeafbb1fba9fb6f32a4a64387"
},
["$.settings.general.marginsAroundMessage.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "cddf8275afa15408533079581ad27f95be579f4eeafbb1fba9fb6f32a4a64387"
},
["$.settings.general.marginsAroundMessage.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "cddf8275afa15408533079581ad27f95be579f4eeafbb1fba9fb6f32a4a64387"
},
["$.settings.general.defaultStructurePadding"]: {
  "required": true,
  "type": "object",
  "schemaHash": "4dcd2f701dc0554da8add74c990730308eaca988d3b5512ebfffef76242d81ee"
},
["$.settings.general.defaultStructurePadding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "6632627b851c9ee31664ca2a973c4708c4d1d0f228b09fdcfa2bc45850a51a88"
},
["$.settings.general.defaultStructurePadding.desktop.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "cddf8275afa15408533079581ad27f95be579f4eeafbb1fba9fb6f32a4a64387"
},
["$.settings.general.defaultStructurePadding.desktop.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "cddf8275afa15408533079581ad27f95be579f4eeafbb1fba9fb6f32a4a64387"
},
["$.settings.general.defaultStructurePadding.desktop.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "cddf8275afa15408533079581ad27f95be579f4eeafbb1fba9fb6f32a4a64387"
},
["$.settings.general.defaultStructurePadding.desktop.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "cddf8275afa15408533079581ad27f95be579f4eeafbb1fba9fb6f32a4a64387"
},
["$.settings.general.defaultStructurePadding.mobile"]: {
  "required": true,
  "type": "object",
  "schemaHash": "6632627b851c9ee31664ca2a973c4708c4d1d0f228b09fdcfa2bc45850a51a88"
},
["$.settings.general.defaultStructurePadding.mobile.top"]: {
  "required": true,
  "type": "number",
  "schemaHash": "cddf8275afa15408533079581ad27f95be579f4eeafbb1fba9fb6f32a4a64387"
},
["$.settings.general.defaultStructurePadding.mobile.right"]: {
  "required": true,
  "type": "number",
  "schemaHash": "cddf8275afa15408533079581ad27f95be579f4eeafbb1fba9fb6f32a4a64387"
},
["$.settings.general.defaultStructurePadding.mobile.bottom"]: {
  "required": true,
  "type": "number",
  "schemaHash": "cddf8275afa15408533079581ad27f95be579f4eeafbb1fba9fb6f32a4a64387"
},
["$.settings.general.defaultStructurePadding.mobile.left"]: {
  "required": true,
  "type": "number",
  "schemaHash": "cddf8275afa15408533079581ad27f95be579f4eeafbb1fba9fb6f32a4a64387"
},
["$.settings.general.customListStyles"]: {
  "required": true,
  "schemaHash": "56b7aae82038c7546adc1ddbee09362ad2c480d582da9816eab7f698595bf795"
},
["$.settings.general.customListStyles|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "448b581ab1cae1ae6c5254a2a122e41c6386c9d0ed677e4e4ab99a44c572c125"
},
["$.settings.general.customListStyles|0.leftIndent"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d5cf3cc7dc92e5724b1b130a6c2298519819cd076103f031b098316eb22bb13c"
},
["$.settings.general.customListStyles|0.listItemsBottomSpace"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a9a7f43895d5ef0107196cd9b83a85b6e3c33194dd54e4a18b5db6f0ffa591a7"
},
["$.settings.general.customListStyles|0.listTopBottomMargin"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a9a7f43895d5ef0107196cd9b83a85b6e3c33194dd54e4a18b5db6f0ffa591a7"
},
["$.settings.general.customListStyles|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.general.lightTheme"]: {
  "required": true,
  "type": "object",
  "schemaHash": "04adba0ca97dd7923c426479001a1b16ea76e98ef6f4457ab1c2314fa32ef4a6"
},
["$.settings.general.lightTheme.backgroundColor"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.general.lightTheme.customListStyles"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b5ac425a27240f7da03f894b873558021b313c3d8d21346d8e5ae3b8cba8c7b6"
},
["$.settings.general.lightTheme.customListStyles.listMarkerColor"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.general.lightTheme.customListStyles.listNumberMarkerColor"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.general.darkTheme"]: {
  "required": true,
  "type": "object",
  "schemaHash": "c8b7dbdb74ff718ac2cbbb46973a29c66483d192a4279ae997b327b7c2893129"
},
["$.settings.general.darkTheme.backgroundColor"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.general.darkTheme.customListStyles"]: {
  "required": true,
  "type": "object",
  "schemaHash": "7c5327ee62bfe8d661fe73c2ae61fe2d44bc6af85534c03663cb7be0a8d5d600"
},
["$.settings.general.darkTheme.customListStyles.listMarkerColor"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.general.darkTheme.customListStyles.listNumberMarkerColor"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.general.darkTheme.backgroundImage"]: {
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
  "schemaHash": "37386421f902fdc4ad2ca9a93b8cfa8895d701619a61df82172d29e348373718"
},
["$.settings.stripes"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a288ddf1780c6f8df7d84335a031ed57eebf3dd8e8cd1dd0fbdd23747fb3da42"
},
["$.settings.stripes.letterSpacing"]: {
  "required": true,
  "type": "object",
  "schemaHash": "e041038993406558f3251aee53bbb8da59e50c8a247b544d167d79b60def9f7e"
},
["$.settings.stripes.letterSpacing.value"]: {
  "required": true,
  "type": "number",
  "schemaHash": "cddf8275afa15408533079581ad27f95be579f4eeafbb1fba9fb6f32a4a64387"
},
["$.settings.stripes.letterSpacing.unit"]: {
  "required": true,
  "type": "string",
  "enum": [
    "px",
    "em"
  ],
  "schemaHash": "c59dfb674ccf39627972e1db962f353d121d9936af136cae8ab7b4f879ee7685"
},
["$.settings.stripes.lineHeight"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b364b73c3961994098627a5c8ce92594a28ffce0fd95190834464b3231e157f8"
},
["$.settings.stripes.lineHeight.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7b2898b5b4fc3e78f0a01fa3191adb1f9084d4b9ef9cbc33087b12ae3ea603fc"
},
["$.settings.stripes.lineHeight.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7b2898b5b4fc3e78f0a01fa3191adb1f9084d4b9ef9cbc33087b12ae3ea603fc"
},
["$.settings.stripes.fontFamily"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "supported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "5e36559bdb676ae61cefd2ebc722a11421199c2bc0d2de1e204864d907059aec"
},
["$.settings.stripes.fontWeight"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "c2c1be9e2417ecaff89c98d8436c76bcee539e1e8652b5d608ea44b0516cfac3"
},
["$.settings.stripes.header"]: {
  "required": true,
  "type": "object",
  "schemaHash": "4aa51b530e1c411e80114fce121d58b6e48ffa4dde331c15c9fdef666a043697"
},
["$.settings.stripes.header.fontSize"]: {
  "required": true,
  "type": "object",
  "schemaHash": "13fb9bb104f38c41be265a6dc88205f458f5e8a00121f644a2828e04d82ee863"
},
["$.settings.stripes.header.fontSize.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "aa2bb185cd32fbe435af596b02ace64cfe621e90c88944a07c25430c14a34522"
},
["$.settings.stripes.header.fontSize.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "aa2bb185cd32fbe435af596b02ace64cfe621e90c88944a07c25430c14a34522"
},
["$.settings.stripes.header.paragraphBottomSpace"]: {
  "required": true,
  "schemaHash": "3cbe409006f30f23de4251ed46e6b26367f5af820782283a370f94227332301b"
},
["$.settings.stripes.header.paragraphBottomSpace|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "071fa34defb14cc44e99db685ab447392c67f9fb2b4911cb9a5ce318539c5eb1"
},
["$.settings.stripes.header.paragraphBottomSpace|0.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a9a7f43895d5ef0107196cd9b83a85b6e3c33194dd54e4a18b5db6f0ffa591a7"
},
["$.settings.stripes.header.paragraphBottomSpace|0.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a9a7f43895d5ef0107196cd9b83a85b6e3c33194dd54e4a18b5db6f0ffa591a7"
},
["$.settings.stripes.header.paragraphBottomSpace|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.header.backgroundImage"]: {
  "required": true,
  "schemaHash": "6afb94e70e416e401b102aff7bcc29f6b51ba26eb20d686278effcc65a5dd334"
},
["$.settings.stripes.header.backgroundImage|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b86c1bcda56ecdbe6957c4cac32b7f661b7d1b0f8dfb6d0b8cdb83d5b12def95"
},
["$.settings.stripes.header.backgroundImage|0.path"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.settings.stripes.header.backgroundImage|0.repeat"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["$.settings.stripes.header.backgroundImage|0.x"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.settings.stripes.header.backgroundImage|0.y"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.settings.stripes.header.backgroundImage|0.sizeX"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.settings.stripes.header.backgroundImage|0.sizeY"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.settings.stripes.header.backgroundImage|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.content"]: {
  "required": true,
  "type": "object",
  "schemaHash": "38cb21ff585a87d49c3a8f92bc75906d698291c1ae47d0aabe43e7dde83f0db9"
},
["$.settings.stripes.content.fontSize"]: {
  "required": true,
  "type": "object",
  "schemaHash": "13fb9bb104f38c41be265a6dc88205f458f5e8a00121f644a2828e04d82ee863"
},
["$.settings.stripes.content.fontSize.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "aa2bb185cd32fbe435af596b02ace64cfe621e90c88944a07c25430c14a34522"
},
["$.settings.stripes.content.fontSize.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "aa2bb185cd32fbe435af596b02ace64cfe621e90c88944a07c25430c14a34522"
},
["$.settings.stripes.content.paragraphBottomSpace"]: {
  "required": true,
  "schemaHash": "3cbe409006f30f23de4251ed46e6b26367f5af820782283a370f94227332301b"
},
["$.settings.stripes.content.paragraphBottomSpace|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "071fa34defb14cc44e99db685ab447392c67f9fb2b4911cb9a5ce318539c5eb1"
},
["$.settings.stripes.content.paragraphBottomSpace|0.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a9a7f43895d5ef0107196cd9b83a85b6e3c33194dd54e4a18b5db6f0ffa591a7"
},
["$.settings.stripes.content.paragraphBottomSpace|0.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a9a7f43895d5ef0107196cd9b83a85b6e3c33194dd54e4a18b5db6f0ffa591a7"
},
["$.settings.stripes.content.paragraphBottomSpace|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.footer"]: {
  "required": true,
  "type": "object",
  "schemaHash": "4aa51b530e1c411e80114fce121d58b6e48ffa4dde331c15c9fdef666a043697"
},
["$.settings.stripes.footer.fontSize"]: {
  "required": true,
  "type": "object",
  "schemaHash": "13fb9bb104f38c41be265a6dc88205f458f5e8a00121f644a2828e04d82ee863"
},
["$.settings.stripes.footer.fontSize.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "aa2bb185cd32fbe435af596b02ace64cfe621e90c88944a07c25430c14a34522"
},
["$.settings.stripes.footer.fontSize.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "aa2bb185cd32fbe435af596b02ace64cfe621e90c88944a07c25430c14a34522"
},
["$.settings.stripes.footer.paragraphBottomSpace"]: {
  "required": true,
  "schemaHash": "3cbe409006f30f23de4251ed46e6b26367f5af820782283a370f94227332301b"
},
["$.settings.stripes.footer.paragraphBottomSpace|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "071fa34defb14cc44e99db685ab447392c67f9fb2b4911cb9a5ce318539c5eb1"
},
["$.settings.stripes.footer.paragraphBottomSpace|0.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a9a7f43895d5ef0107196cd9b83a85b6e3c33194dd54e4a18b5db6f0ffa591a7"
},
["$.settings.stripes.footer.paragraphBottomSpace|0.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a9a7f43895d5ef0107196cd9b83a85b6e3c33194dd54e4a18b5db6f0ffa591a7"
},
["$.settings.stripes.footer.paragraphBottomSpace|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.footer.backgroundImage"]: {
  "required": true,
  "schemaHash": "6afb94e70e416e401b102aff7bcc29f6b51ba26eb20d686278effcc65a5dd334"
},
["$.settings.stripes.footer.backgroundImage|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "b86c1bcda56ecdbe6957c4cac32b7f661b7d1b0f8dfb6d0b8cdb83d5b12def95"
},
["$.settings.stripes.footer.backgroundImage|0.path"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.settings.stripes.footer.backgroundImage|0.repeat"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["$.settings.stripes.footer.backgroundImage|0.x"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.settings.stripes.footer.backgroundImage|0.y"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.settings.stripes.footer.backgroundImage|0.sizeX"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.settings.stripes.footer.backgroundImage|0.sizeY"]: {
  "required": true,
  "type": "string",
  "schemaHash": "00404e686415370f1711c4d7acfa2905444d3cf23cef2e10c47d445ebe690f96"
},
["$.settings.stripes.footer.backgroundImage|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.infoArea"]: {
  "required": true,
  "type": "object",
  "schemaHash": "38cb21ff585a87d49c3a8f92bc75906d698291c1ae47d0aabe43e7dde83f0db9"
},
["$.settings.stripes.infoArea.fontSize"]: {
  "required": true,
  "type": "object",
  "schemaHash": "13fb9bb104f38c41be265a6dc88205f458f5e8a00121f644a2828e04d82ee863"
},
["$.settings.stripes.infoArea.fontSize.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "aa2bb185cd32fbe435af596b02ace64cfe621e90c88944a07c25430c14a34522"
},
["$.settings.stripes.infoArea.fontSize.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "aa2bb185cd32fbe435af596b02ace64cfe621e90c88944a07c25430c14a34522"
},
["$.settings.stripes.infoArea.paragraphBottomSpace"]: {
  "required": true,
  "schemaHash": "3cbe409006f30f23de4251ed46e6b26367f5af820782283a370f94227332301b"
},
["$.settings.stripes.infoArea.paragraphBottomSpace|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "071fa34defb14cc44e99db685ab447392c67f9fb2b4911cb9a5ce318539c5eb1"
},
["$.settings.stripes.infoArea.paragraphBottomSpace|0.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a9a7f43895d5ef0107196cd9b83a85b6e3c33194dd54e4a18b5db6f0ffa591a7"
},
["$.settings.stripes.infoArea.paragraphBottomSpace|0.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a9a7f43895d5ef0107196cd9b83a85b6e3c33194dd54e4a18b5db6f0ffa591a7"
},
["$.settings.stripes.infoArea.paragraphBottomSpace|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.lightTheme"]: {
  "required": true,
  "type": "object",
  "schemaHash": "7670faff4c5b7aa3649b56b00e716594ac22fa6b7d0f13872caa7071030506d2"
},
["$.settings.stripes.lightTheme.header"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a853037409c3c295d08eb7d07dbde6ae7b5e86646254be72f16bdf9b9d38391c"
},
["$.settings.stripes.lightTheme.header.stripeBackgroundColor"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.stripes.lightTheme.header.contentBackgroundColor"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.stripes.lightTheme.header.fontColor"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.stripes.lightTheme.header.linkColor"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.stripes.lightTheme.header.linkColorHover"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.stripes.lightTheme.content"]: {
  "required": true,
  "type": "object",
  "schemaHash": "2cdf6c1dd68edfe4610003044d002c3700fdcffe993ce554f2f6a893ce4b3b76"
},
["$.settings.stripes.lightTheme.content.contentBackgroundColor"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.stripes.lightTheme.content.fontColor"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.stripes.lightTheme.content.linkColor"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.stripes.lightTheme.content.linkColorHover"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.stripes.lightTheme.footer"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a853037409c3c295d08eb7d07dbde6ae7b5e86646254be72f16bdf9b9d38391c"
},
["$.settings.stripes.lightTheme.footer.stripeBackgroundColor"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.stripes.lightTheme.footer.contentBackgroundColor"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.stripes.lightTheme.footer.fontColor"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.stripes.lightTheme.footer.linkColor"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.stripes.lightTheme.footer.linkColorHover"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.stripes.lightTheme.infoArea"]: {
  "required": true,
  "type": "object",
  "schemaHash": "6b11ffc2ba43fd2eabc519d9a3666714e34024de12ad748659f0853d07d33829"
},
["$.settings.stripes.lightTheme.infoArea.fontColor"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.stripes.lightTheme.infoArea.linkColor"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.stripes.lightTheme.infoArea.linkColorHover"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "e36cd8fcc6548e5ea85ef9d79117d92d023d30d7a838b7c4b0426d8326891b43"
},
["$.settings.stripes.darkTheme"]: {
  "required": true,
  "type": "object",
  "schemaHash": "3b8cef264af4c2c235655e740b83bc65fd979b61d1027a4233ab9315d5a9921e"
},
["$.settings.stripes.darkTheme.header"]: {
  "required": true,
  "type": "object",
  "schemaHash": "aa45f7d76cc1b9f67e93a89c4b5e1b519c1fc7ec65745aeb3f273bd9a5310ccf"
},
["$.settings.stripes.darkTheme.header.stripeBackgroundColor"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.stripes.darkTheme.header.contentBackgroundColor"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.stripes.darkTheme.header.fontColor"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.stripes.darkTheme.header.linkColor"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.stripes.darkTheme.header.linkColorHover"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.stripes.darkTheme.content"]: {
  "required": true,
  "type": "object",
  "schemaHash": "43f566df3f9037173648dee0ab4f53c73fa5856656705e4c8a7ac9737e306323"
},
["$.settings.stripes.darkTheme.content.contentBackgroundColor"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.stripes.darkTheme.content.fontColor"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.stripes.darkTheme.content.linkColor"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.stripes.darkTheme.content.linkColorHover"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.stripes.darkTheme.footer"]: {
  "required": true,
  "type": "object",
  "schemaHash": "aa45f7d76cc1b9f67e93a89c4b5e1b519c1fc7ec65745aeb3f273bd9a5310ccf"
},
["$.settings.stripes.darkTheme.footer.stripeBackgroundColor"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.stripes.darkTheme.footer.contentBackgroundColor"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.stripes.darkTheme.footer.fontColor"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.stripes.darkTheme.footer.linkColor"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.stripes.darkTheme.footer.linkColorHover"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.stripes.darkTheme.infoArea"]: {
  "required": true,
  "type": "object",
  "schemaHash": "911d039bc69dabffff1adecac57fc308350004210788f34be7665bc399e3d708"
},
["$.settings.stripes.darkTheme.infoArea.fontColor"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.stripes.darkTheme.infoArea.linkColor"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.stripes.darkTheme.infoArea.linkColorHover"]: {
  "required": true,
  "type": [
    "string",
    "null"
  ],
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "53d4c32bf4bc2f91980241d23122c34ef6134cb79a9396ba8e162a7536e418cb"
},
["$.settings.headings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "55e6ba0dbb45a93fba9561bc2ac8a18a1482104a0cb3f83bef43b6e2fc2c9f3e"
},
["$.settings.headings.letterSpacing"]: {
  "required": true,
  "type": "object",
  "schemaHash": "e041038993406558f3251aee53bbb8da59e50c8a247b544d167d79b60def9f7e"
},
["$.settings.headings.letterSpacing.value"]: {
  "required": true,
  "type": "number",
  "schemaHash": "cddf8275afa15408533079581ad27f95be579f4eeafbb1fba9fb6f32a4a64387"
},
["$.settings.headings.letterSpacing.unit"]: {
  "required": true,
  "type": "string",
  "enum": [
    "px",
    "em"
  ],
  "schemaHash": "c59dfb674ccf39627972e1db962f353d121d9936af136cae8ab7b4f879ee7685"
},
["$.settings.headings.fontFamily"]: {
  "required": true,
  "type": "string",
  "actions": {
    "insert": "supported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "5e36559bdb676ae61cefd2ebc722a11421199c2bc0d2de1e204864d907059aec"
},
["$.settings.headings.h1"]: {
  "required": true,
  "type": "object",
  "schemaHash": "3ef248a78dff46a2fdbc67f7ed4b582845a3612407eae17cb5a4f92a6a54f5d6"
},
["$.settings.headings.h1.textAlign"]: {
  "required": true,
  "type": "object",
  "schemaHash": "290d3b49ace85903ca1b82e095e4bbb8c188c18584461ed098fbe1372d85528f"
},
["$.settings.headings.h1.textAlign.mobile"]: {
  "required": true,
  "schemaHash": "e0a247f269f9cafbfb9ba11cf99650b5f90fd96f0dcf6de4304770527c06c5ad"
},
["$.settings.headings.h1.textAlign.mobile|0"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "e494aa666465b1cc779625a66e8a6119485e09965b15791b5ec35afb222eec32"
},
["$.settings.headings.h1.textAlign.mobile|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.headings.h1.textStyle"]: {
  "required": true,
  "type": "object",
  "schemaHash": "5184a9cd6f4eac53c7dc0835ba8f6b269352988554eb850ce2bed2bdd5008486"
},
["$.settings.headings.h1.textStyle.italic"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["$.settings.headings.h1.fontWeight"]: {
  "required": true,
  "schemaHash": "6e05f2f96c27b4c937eff5ef33a1575c632544d7a3e814348f1598e311747074"
},
["$.settings.headings.h1.fontWeight|0"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "c2c1be9e2417ecaff89c98d8436c76bcee539e1e8652b5d608ea44b0516cfac3"
},
["$.settings.headings.h1.fontWeight|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.headings.h1.fontSize"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ff6b6e2ccdbd40525b5a28daaceb8c375bbd712eb3652de5fd21c37d9d7dbaf8"
},
["$.settings.headings.h1.fontSize.desktop"]: {
  "required": true,
  "schemaHash": "25d7b7f0994300a4d4f3e522679208f4e3a47b60a0f959bb195963ac999f2f7b"
},
["$.settings.headings.h1.fontSize.desktop|0"]: {
  "required": true,
  "type": "number",
  "schemaHash": "aa2bb185cd32fbe435af596b02ace64cfe621e90c88944a07c25430c14a34522"
},
["$.settings.headings.h1.fontSize.desktop|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.headings.h1.fontSize.mobile"]: {
  "required": true,
  "schemaHash": "25d7b7f0994300a4d4f3e522679208f4e3a47b60a0f959bb195963ac999f2f7b"
},
["$.settings.headings.h1.fontSize.mobile|0"]: {
  "required": true,
  "type": "number",
  "schemaHash": "aa2bb185cd32fbe435af596b02ace64cfe621e90c88944a07c25430c14a34522"
},
["$.settings.headings.h1.fontSize.mobile|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.headings.h1.lineHeight"]: {
  "required": true,
  "type": "object",
  "schemaHash": "5e6f771511fd27f4d5ae525a932ad77b685c7796b873b2f62af3b68683a904d5"
},
["$.settings.headings.h1.lineHeight.desktop"]: {
  "required": true,
  "schemaHash": "4f255e55847ee8833e3f99d2f9953de91126696be531013c4386d8c58db7fcc1"
},
["$.settings.headings.h1.lineHeight.desktop|0"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7b2898b5b4fc3e78f0a01fa3191adb1f9084d4b9ef9cbc33087b12ae3ea603fc"
},
["$.settings.headings.h1.lineHeight.desktop|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.headings.h1.lineHeight.mobile"]: {
  "required": true,
  "schemaHash": "4f255e55847ee8833e3f99d2f9953de91126696be531013c4386d8c58db7fcc1"
},
["$.settings.headings.h1.lineHeight.mobile|0"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7b2898b5b4fc3e78f0a01fa3191adb1f9084d4b9ef9cbc33087b12ae3ea603fc"
},
["$.settings.headings.h1.lineHeight.mobile|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.headings.h1.paragraphBottomSpace"]: {
  "required": true,
  "schemaHash": "3cbe409006f30f23de4251ed46e6b26367f5af820782283a370f94227332301b"
},
["$.settings.headings.h1.paragraphBottomSpace|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "071fa34defb14cc44e99db685ab447392c67f9fb2b4911cb9a5ce318539c5eb1"
},
["$.settings.headings.h1.paragraphBottomSpace|0.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a9a7f43895d5ef0107196cd9b83a85b6e3c33194dd54e4a18b5db6f0ffa591a7"
},
["$.settings.headings.h1.paragraphBottomSpace|0.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a9a7f43895d5ef0107196cd9b83a85b6e3c33194dd54e4a18b5db6f0ffa591a7"
},
["$.settings.headings.h1.paragraphBottomSpace|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.headings.h2"]: {
  "required": true,
  "type": "object",
  "schemaHash": "3ef248a78dff46a2fdbc67f7ed4b582845a3612407eae17cb5a4f92a6a54f5d6"
},
["$.settings.headings.h2.textAlign"]: {
  "required": true,
  "type": "object",
  "schemaHash": "290d3b49ace85903ca1b82e095e4bbb8c188c18584461ed098fbe1372d85528f"
},
["$.settings.headings.h2.textAlign.mobile"]: {
  "required": true,
  "schemaHash": "e0a247f269f9cafbfb9ba11cf99650b5f90fd96f0dcf6de4304770527c06c5ad"
},
["$.settings.headings.h2.textAlign.mobile|0"]: {
  "required": true,
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ],
  "schemaHash": "e494aa666465b1cc779625a66e8a6119485e09965b15791b5ec35afb222eec32"
},
["$.settings.headings.h2.textAlign.mobile|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.headings.h2.textStyle"]: {
  "required": true,
  "type": "object",
  "schemaHash": "5184a9cd6f4eac53c7dc0835ba8f6b269352988554eb850ce2bed2bdd5008486"
},
["$.settings.headings.h2.textStyle.italic"]: {
  "required": true,
  "type": "boolean",
  "schemaHash": "7cb541e84f226754a46c21c79f131fa2898354e1242456e6fd1c162bce319553"
},
["$.settings.headings.h2.fontWeight"]: {
  "required": true,
  "schemaHash": "6e05f2f96c27b4c937eff5ef33a1575c632544d7a3e814348f1598e311747074"
},
["$.settings.headings.h2.fontWeight|0"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "c2c1be9e2417ecaff89c98d8436c76bcee539e1e8652b5d608ea44b0516cfac3"
},
["$.settings.headings.h2.fontWeight|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.headings.h2.fontSize"]: {
  "required": true,
  "type": "object",
  "schemaHash": "ff6b6e2ccdbd40525b5a28daaceb8c375bbd712eb3652de5fd21c37d9d7dbaf8"
},
["$.settings.headings.h2.fontSize.desktop"]: {
  "required": true,
  "schemaHash": "25d7b7f0994300a4d4f3e522679208f4e3a47b60a0f959bb195963ac999f2f7b"
},
["$.settings.headings.h2.fontSize.desktop|0"]: {
  "required": true,
  "type": "number",
  "schemaHash": "aa2bb185cd32fbe435af596b02ace64cfe621e90c88944a07c25430c14a34522"
},
["$.settings.headings.h2.fontSize.desktop|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.headings.h2.fontSize.mobile"]: {
  "required": true,
  "schemaHash": "25d7b7f0994300a4d4f3e522679208f4e3a47b60a0f959bb195963ac999f2f7b"
},
["$.settings.headings.h2.fontSize.mobile|0"]: {
  "required": true,
  "type": "number",
  "schemaHash": "aa2bb185cd32fbe435af596b02ace64cfe621e90c88944a07c25430c14a34522"
},
["$.settings.headings.h2.fontSize.mobile|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.headings.h2.lineHeight"]: {
  "required": true,
  "type": "object",
  "schemaHash": "5e6f771511fd27f4d5ae525a932ad77b685c7796b873b2f62af3b68683a904d5"
},
["$.settings.headings.h2.lineHeight.desktop"]: {
  "required": true,
  "schemaHash": "4f255e55847ee8833e3f99d2f9953de91126696be531013c4386d8c58db7fcc1"
},
["$.settings.headings.h2.lineHeight.desktop|0"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7b2898b5b4fc3e78f0a01fa3191adb1f9084d4b9ef9cbc33087b12ae3ea603fc"
},
["$.settings.headings.h2.lineHeight.desktop|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.headings.h2.lineHeight.mobile"]: {
  "required": true,
  "schemaHash": "4f255e55847ee8833e3f99d2f9953de91126696be531013c4386d8c58db7fcc1"
},
["$.settings.headings.h2.lineHeight.mobile|0"]: {
  "required": true,
  "type": "number",
  "schemaHash": "7b2898b5b4fc3e78f0a01fa3191adb1f9084d4b9ef9cbc33087b12ae3ea603fc"
},
["$.settings.headings.h2.lineHeight.mobile|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.headings.h2.paragraphBottomSpace"]: {
  "required": true,
  "schemaHash": "3cbe409006f30f23de4251ed46e6b26367f5af820782283a370f94227332301b"
},
["$.settings.headings.h2.paragraphBottomSpace|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "071fa34defb14cc44e99db685ab447392c67f9fb2b4911cb9a5ce318539c5eb1"
},
["$.settings.headings.h2.paragraphBottomSpace|0.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "a9a7f43895d5ef0107196cd9b83a85b6e3c33194dd54e4a18b5db6f0ffa591a7"
}
};

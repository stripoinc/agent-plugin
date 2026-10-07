
export default {
["$"]: {
  "required": true,
  "type": "object",
  "schemaHash": "f7db70a9cf93f0f90e206c300f572b404f5909c87c43820acf7cb81f025b55dd"
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
  "schemaHash": "efb8885927bff591681672d92b2bd76467725a8d8b86e0ddeaaec020c971c696"
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
  "schemaHash": "781e11b4062ce50ce49389863a2beee4b6bf685b74acfb0da43b923965ce71f6"
},
["$.settings.general.backgroundImage|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "e312426cc686452f07482e6d815dbe230e24dadc225f90cce3283accd3fcccfa"
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
  "schemaHash": "d4f568e94371b461d0ec45ce0be979a251a8b1faf76247d8288aa1932d6ccc5d"
},
["$.settings.general.backgroundImage|0.sizeY"]: {
  "required": true,
  "type": "string",
  "schemaHash": "d4f568e94371b461d0ec45ce0be979a251a8b1faf76247d8288aa1932d6ccc5d"
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
  "schemaHash": "319db074a35b4649b85edb3696b651230c7f64e4d6556bca3ecf190d1e48781c"
},
["$.settings.general.marginsAroundMessage.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "332ef3d6aec272885e3e314451ee8da1b6b1622fd0eb2a6c327e6645d839ec34"
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
  "schemaHash": "332ef3d6aec272885e3e314451ee8da1b6b1622fd0eb2a6c327e6645d839ec34"
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
  "schemaHash": "319db074a35b4649b85edb3696b651230c7f64e4d6556bca3ecf190d1e48781c"
},
["$.settings.general.defaultStructurePadding.desktop"]: {
  "required": true,
  "type": "object",
  "schemaHash": "332ef3d6aec272885e3e314451ee8da1b6b1622fd0eb2a6c327e6645d839ec34"
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
  "schemaHash": "332ef3d6aec272885e3e314451ee8da1b6b1622fd0eb2a6c327e6645d839ec34"
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
  "schemaHash": "7bab433e2cfea4e247913e46ee9f51692cab947c72c5f431cb50fb01b9d70a6f"
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
  "schemaHash": "ef666b9c6516e71504b1cd7b19a7338229e2767545d6aea488970475665835ce"
},
["$.settings.general.lightTheme.customListStyles"]: {
  "required": true,
  "type": "object",
  "schemaHash": "15d1a0a0460ba1a5ac879136591164ecad2a4061bd77f2de49e505da3087d8c5"
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
  "schemaHash": "155c8ece6c5b100957c1b09bea54723c2bc2ec4750b1b6784012fe1f79cdf927"
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
  "schemaHash": "155c8ece6c5b100957c1b09bea54723c2bc2ec4750b1b6784012fe1f79cdf927"
},
["$.settings.general.darkTheme"]: {
  "required": true,
  "type": "object",
  "schemaHash": "7132ffa96e62577b3ebda7ac65549e39ec35705ea4e577bce397c634df9267d2"
},
["$.settings.general.darkTheme.backgroundColor"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "de9d3c37be70a351034e0ac762fc39a4305f9319c0fe1a78043296360a1685e1"
},
["$.settings.general.darkTheme.backgroundColor|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "57b236f9cf9fd34f4edc262820c73281988d46f8b11a5f5615459dc7201ce982"
},
["$.settings.general.darkTheme.backgroundColor|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.general.darkTheme.customListStyles"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a5777b6b33371ed183c78ca50e8886304d9c6590abbfc40259c9c35badc84bb5"
},
["$.settings.general.darkTheme.customListStyles.listMarkerColor"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "1aee4f2df24d9dd16cd6b1448074444b5e005a8f38872d2b4fcf11ecc5be4547"
},
["$.settings.general.darkTheme.customListStyles.listMarkerColor|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "1c27c1067708cc6b70818f9cb1841641441677551b2160e8d27566cf80d9838b"
},
["$.settings.general.darkTheme.customListStyles.listMarkerColor|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.general.darkTheme.customListStyles.listNumberMarkerColor"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "1aee4f2df24d9dd16cd6b1448074444b5e005a8f38872d2b4fcf11ecc5be4547"
},
["$.settings.general.darkTheme.customListStyles.listNumberMarkerColor|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "1c27c1067708cc6b70818f9cb1841641441677551b2160e8d27566cf80d9838b"
},
["$.settings.general.darkTheme.customListStyles.listNumberMarkerColor|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes"]: {
  "required": true,
  "type": "object",
  "schemaHash": "dedd9a125b9b24dc461951aefa50c4abaf1a6fc4d072d7cc50e97525ce82f60d"
},
["$.settings.stripes.letterSpacing"]: {
  "required": true,
  "type": "object",
  "schemaHash": "0de0b1b8b4e02994b9415b401b414015f9024e9336e605c66dc0bce7679cf65d"
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
  "schemaHash": "b4c8c94ffb2a4fd9122852a9ce9cfa28b8f66520393ee0c6c8503dda5d05f883"
},
["$.settings.stripes.lineHeight.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "9a3a2949896ce1f3f7048146819d3fa9c52198d7a2a872211526cc1643540a62"
},
["$.settings.stripes.lineHeight.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "76eb193d1dc62ed65e8fa68c05ddf8c469b5d2f74365e34f38707b2c39eab506"
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
  "schemaHash": "bd316f5ff4c075a9d91ea3e66d11d9e2ca47f313a434b8b9741fa64b14753350"
},
["$.settings.stripes.fontWeight"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "85e9ffd8ec4fc5facbb9ce2e3080baadbdb68639a524135d6a6e7ca4d4c83b74"
},
["$.settings.stripes.header"]: {
  "required": true,
  "type": "object",
  "schemaHash": "cfb69e53e7713ba9f8e34125247c609c5e13846695b14fd01380627f6f127575"
},
["$.settings.stripes.header.fontSize"]: {
  "required": true,
  "type": "object",
  "schemaHash": "85efbce02ce8566bfbf6cdc3ba512be5e3a93dc63c8dc7713146874b64d54f9e"
},
["$.settings.stripes.header.fontSize.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "16208d1e33d8319d4694e51b4edb93a5da5b954b3bc79281887f27e7894ee3ca"
},
["$.settings.stripes.header.fontSize.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d58099902cab7262b22d647c167a33cf123d31cb377fca7a9d1d6bf0b30e2a43"
},
["$.settings.stripes.header.paragraphBottomSpace"]: {
  "required": true,
  "schemaHash": "5f5faa90ccf7db107ec32bff03797c01c2cc067e17b264aff40eb49500961cff"
},
["$.settings.stripes.header.paragraphBottomSpace|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "da6e1d7cd61492fddf768d0ab72afbd2a51e56e6a3bc744db9449992f030f3c1"
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
  "schemaHash": "781e11b4062ce50ce49389863a2beee4b6bf685b74acfb0da43b923965ce71f6"
},
["$.settings.stripes.header.backgroundImage|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "e312426cc686452f07482e6d815dbe230e24dadc225f90cce3283accd3fcccfa"
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
  "schemaHash": "d4f568e94371b461d0ec45ce0be979a251a8b1faf76247d8288aa1932d6ccc5d"
},
["$.settings.stripes.header.backgroundImage|0.sizeY"]: {
  "required": true,
  "type": "string",
  "schemaHash": "d4f568e94371b461d0ec45ce0be979a251a8b1faf76247d8288aa1932d6ccc5d"
},
["$.settings.stripes.header.backgroundImage|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.content"]: {
  "required": true,
  "type": "object",
  "schemaHash": "e4a686a92368ccc42740b35541e927e68f2cc96673fe57852dd1f952c386d78c"
},
["$.settings.stripes.content.fontSize"]: {
  "required": true,
  "type": "object",
  "schemaHash": "85efbce02ce8566bfbf6cdc3ba512be5e3a93dc63c8dc7713146874b64d54f9e"
},
["$.settings.stripes.content.fontSize.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "16208d1e33d8319d4694e51b4edb93a5da5b954b3bc79281887f27e7894ee3ca"
},
["$.settings.stripes.content.fontSize.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d58099902cab7262b22d647c167a33cf123d31cb377fca7a9d1d6bf0b30e2a43"
},
["$.settings.stripes.content.paragraphBottomSpace"]: {
  "required": true,
  "schemaHash": "5f5faa90ccf7db107ec32bff03797c01c2cc067e17b264aff40eb49500961cff"
},
["$.settings.stripes.content.paragraphBottomSpace|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "da6e1d7cd61492fddf768d0ab72afbd2a51e56e6a3bc744db9449992f030f3c1"
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
  "schemaHash": "cfb69e53e7713ba9f8e34125247c609c5e13846695b14fd01380627f6f127575"
},
["$.settings.stripes.footer.fontSize"]: {
  "required": true,
  "type": "object",
  "schemaHash": "85efbce02ce8566bfbf6cdc3ba512be5e3a93dc63c8dc7713146874b64d54f9e"
},
["$.settings.stripes.footer.fontSize.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "16208d1e33d8319d4694e51b4edb93a5da5b954b3bc79281887f27e7894ee3ca"
},
["$.settings.stripes.footer.fontSize.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d58099902cab7262b22d647c167a33cf123d31cb377fca7a9d1d6bf0b30e2a43"
},
["$.settings.stripes.footer.paragraphBottomSpace"]: {
  "required": true,
  "schemaHash": "5f5faa90ccf7db107ec32bff03797c01c2cc067e17b264aff40eb49500961cff"
},
["$.settings.stripes.footer.paragraphBottomSpace|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "da6e1d7cd61492fddf768d0ab72afbd2a51e56e6a3bc744db9449992f030f3c1"
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
  "schemaHash": "781e11b4062ce50ce49389863a2beee4b6bf685b74acfb0da43b923965ce71f6"
},
["$.settings.stripes.footer.backgroundImage|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "e312426cc686452f07482e6d815dbe230e24dadc225f90cce3283accd3fcccfa"
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
  "schemaHash": "d4f568e94371b461d0ec45ce0be979a251a8b1faf76247d8288aa1932d6ccc5d"
},
["$.settings.stripes.footer.backgroundImage|0.sizeY"]: {
  "required": true,
  "type": "string",
  "schemaHash": "d4f568e94371b461d0ec45ce0be979a251a8b1faf76247d8288aa1932d6ccc5d"
},
["$.settings.stripes.footer.backgroundImage|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.infoArea"]: {
  "required": true,
  "type": "object",
  "schemaHash": "e4a686a92368ccc42740b35541e927e68f2cc96673fe57852dd1f952c386d78c"
},
["$.settings.stripes.infoArea.fontSize"]: {
  "required": true,
  "type": "object",
  "schemaHash": "85efbce02ce8566bfbf6cdc3ba512be5e3a93dc63c8dc7713146874b64d54f9e"
},
["$.settings.stripes.infoArea.fontSize.desktop"]: {
  "required": true,
  "type": "number",
  "schemaHash": "16208d1e33d8319d4694e51b4edb93a5da5b954b3bc79281887f27e7894ee3ca"
},
["$.settings.stripes.infoArea.fontSize.mobile"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d58099902cab7262b22d647c167a33cf123d31cb377fca7a9d1d6bf0b30e2a43"
},
["$.settings.stripes.infoArea.paragraphBottomSpace"]: {
  "required": true,
  "schemaHash": "5f5faa90ccf7db107ec32bff03797c01c2cc067e17b264aff40eb49500961cff"
},
["$.settings.stripes.infoArea.paragraphBottomSpace|0"]: {
  "required": true,
  "type": "object",
  "schemaHash": "da6e1d7cd61492fddf768d0ab72afbd2a51e56e6a3bc744db9449992f030f3c1"
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
  "schemaHash": "3862918940cabda0619ee9428f62a46f1bff1f191060915701447de09bb7a2db"
},
["$.settings.stripes.lightTheme.header"]: {
  "required": true,
  "type": "object",
  "schemaHash": "0590b062e8ed7bb3438fa7379158a711c67a9d977f640ca4420211f8191d3f4b"
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
  "schemaHash": "ef666b9c6516e71504b1cd7b19a7338229e2767545d6aea488970475665835ce"
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
  "schemaHash": "ef666b9c6516e71504b1cd7b19a7338229e2767545d6aea488970475665835ce"
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
  "schemaHash": "ece99b5df0cba565e15db8047c28da8ca49c9f63c12f20cd052580331e8e7866"
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
  "schemaHash": "ece99b5df0cba565e15db8047c28da8ca49c9f63c12f20cd052580331e8e7866"
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
  "schemaHash": "ece99b5df0cba565e15db8047c28da8ca49c9f63c12f20cd052580331e8e7866"
},
["$.settings.stripes.lightTheme.content"]: {
  "required": true,
  "type": "object",
  "schemaHash": "348dc8ec7763fde131cc2d7cf3a425af7ba3f29afa68783456ee9624b6c426dd"
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
  "schemaHash": "ef666b9c6516e71504b1cd7b19a7338229e2767545d6aea488970475665835ce"
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
  "schemaHash": "ece99b5df0cba565e15db8047c28da8ca49c9f63c12f20cd052580331e8e7866"
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
  "schemaHash": "ece99b5df0cba565e15db8047c28da8ca49c9f63c12f20cd052580331e8e7866"
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
  "schemaHash": "ece99b5df0cba565e15db8047c28da8ca49c9f63c12f20cd052580331e8e7866"
},
["$.settings.stripes.lightTheme.footer"]: {
  "required": true,
  "type": "object",
  "schemaHash": "0590b062e8ed7bb3438fa7379158a711c67a9d977f640ca4420211f8191d3f4b"
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
  "schemaHash": "ef666b9c6516e71504b1cd7b19a7338229e2767545d6aea488970475665835ce"
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
  "schemaHash": "ef666b9c6516e71504b1cd7b19a7338229e2767545d6aea488970475665835ce"
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
  "schemaHash": "ece99b5df0cba565e15db8047c28da8ca49c9f63c12f20cd052580331e8e7866"
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
  "schemaHash": "ece99b5df0cba565e15db8047c28da8ca49c9f63c12f20cd052580331e8e7866"
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
  "schemaHash": "ece99b5df0cba565e15db8047c28da8ca49c9f63c12f20cd052580331e8e7866"
},
["$.settings.stripes.lightTheme.infoArea"]: {
  "required": true,
  "type": "object",
  "schemaHash": "adb01b685b4f76df14cce60ab1d0499d6f783f9e706b9b9293356c0265171560"
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
  "schemaHash": "ece99b5df0cba565e15db8047c28da8ca49c9f63c12f20cd052580331e8e7866"
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
  "schemaHash": "ece99b5df0cba565e15db8047c28da8ca49c9f63c12f20cd052580331e8e7866"
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
  "schemaHash": "ece99b5df0cba565e15db8047c28da8ca49c9f63c12f20cd052580331e8e7866"
},
["$.settings.stripes.darkTheme"]: {
  "required": true,
  "type": "object",
  "schemaHash": "8f961b07f0e90d12306ec445fe52d538f099f13f2da8366b463975738270cda5"
},
["$.settings.stripes.darkTheme.header"]: {
  "required": true,
  "type": "object",
  "schemaHash": "5848fc165a7caacef9b97f4bc83abac1b68d39e92e6bae64be037bed5e9043e9"
},
["$.settings.stripes.darkTheme.header.stripeBackgroundColor"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "de9d3c37be70a351034e0ac762fc39a4305f9319c0fe1a78043296360a1685e1"
},
["$.settings.stripes.darkTheme.header.stripeBackgroundColor|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "57b236f9cf9fd34f4edc262820c73281988d46f8b11a5f5615459dc7201ce982"
},
["$.settings.stripes.darkTheme.header.stripeBackgroundColor|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.darkTheme.header.contentBackgroundColor"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "de9d3c37be70a351034e0ac762fc39a4305f9319c0fe1a78043296360a1685e1"
},
["$.settings.stripes.darkTheme.header.contentBackgroundColor|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "57b236f9cf9fd34f4edc262820c73281988d46f8b11a5f5615459dc7201ce982"
},
["$.settings.stripes.darkTheme.header.contentBackgroundColor|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.darkTheme.header.fontColor"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "73f9193d8e1aa7408e72192f2bb8916ac650874e1a44bd04e64d5c23ea11ccd9"
},
["$.settings.stripes.darkTheme.header.fontColor|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c202195a934f3206caad05d4917edf359b473fcbd618ac0e8c7be3504bfda45e"
},
["$.settings.stripes.darkTheme.header.fontColor|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.darkTheme.header.linkColor"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "73f9193d8e1aa7408e72192f2bb8916ac650874e1a44bd04e64d5c23ea11ccd9"
},
["$.settings.stripes.darkTheme.header.linkColor|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c202195a934f3206caad05d4917edf359b473fcbd618ac0e8c7be3504bfda45e"
},
["$.settings.stripes.darkTheme.header.linkColor|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.darkTheme.header.linkColorHover"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "73f9193d8e1aa7408e72192f2bb8916ac650874e1a44bd04e64d5c23ea11ccd9"
},
["$.settings.stripes.darkTheme.header.linkColorHover|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c202195a934f3206caad05d4917edf359b473fcbd618ac0e8c7be3504bfda45e"
},
["$.settings.stripes.darkTheme.header.linkColorHover|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.darkTheme.content"]: {
  "required": true,
  "type": "object",
  "schemaHash": "96533ba2108ed8f107f6692a32e21830ca80155e704d72cecb5f633537857da0"
},
["$.settings.stripes.darkTheme.content.contentBackgroundColor"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "de9d3c37be70a351034e0ac762fc39a4305f9319c0fe1a78043296360a1685e1"
},
["$.settings.stripes.darkTheme.content.contentBackgroundColor|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "57b236f9cf9fd34f4edc262820c73281988d46f8b11a5f5615459dc7201ce982"
},
["$.settings.stripes.darkTheme.content.contentBackgroundColor|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.darkTheme.content.fontColor"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "73f9193d8e1aa7408e72192f2bb8916ac650874e1a44bd04e64d5c23ea11ccd9"
},
["$.settings.stripes.darkTheme.content.fontColor|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c202195a934f3206caad05d4917edf359b473fcbd618ac0e8c7be3504bfda45e"
},
["$.settings.stripes.darkTheme.content.fontColor|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.darkTheme.content.linkColor"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "73f9193d8e1aa7408e72192f2bb8916ac650874e1a44bd04e64d5c23ea11ccd9"
},
["$.settings.stripes.darkTheme.content.linkColor|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c202195a934f3206caad05d4917edf359b473fcbd618ac0e8c7be3504bfda45e"
},
["$.settings.stripes.darkTheme.content.linkColor|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.darkTheme.content.linkColorHover"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "73f9193d8e1aa7408e72192f2bb8916ac650874e1a44bd04e64d5c23ea11ccd9"
},
["$.settings.stripes.darkTheme.content.linkColorHover|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c202195a934f3206caad05d4917edf359b473fcbd618ac0e8c7be3504bfda45e"
},
["$.settings.stripes.darkTheme.content.linkColorHover|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.darkTheme.footer"]: {
  "required": true,
  "type": "object",
  "schemaHash": "5848fc165a7caacef9b97f4bc83abac1b68d39e92e6bae64be037bed5e9043e9"
},
["$.settings.stripes.darkTheme.footer.stripeBackgroundColor"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "de9d3c37be70a351034e0ac762fc39a4305f9319c0fe1a78043296360a1685e1"
},
["$.settings.stripes.darkTheme.footer.stripeBackgroundColor|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "57b236f9cf9fd34f4edc262820c73281988d46f8b11a5f5615459dc7201ce982"
},
["$.settings.stripes.darkTheme.footer.stripeBackgroundColor|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.darkTheme.footer.contentBackgroundColor"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "de9d3c37be70a351034e0ac762fc39a4305f9319c0fe1a78043296360a1685e1"
},
["$.settings.stripes.darkTheme.footer.contentBackgroundColor|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "57b236f9cf9fd34f4edc262820c73281988d46f8b11a5f5615459dc7201ce982"
},
["$.settings.stripes.darkTheme.footer.contentBackgroundColor|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.darkTheme.footer.fontColor"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "73f9193d8e1aa7408e72192f2bb8916ac650874e1a44bd04e64d5c23ea11ccd9"
},
["$.settings.stripes.darkTheme.footer.fontColor|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c202195a934f3206caad05d4917edf359b473fcbd618ac0e8c7be3504bfda45e"
},
["$.settings.stripes.darkTheme.footer.fontColor|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.darkTheme.footer.linkColor"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "73f9193d8e1aa7408e72192f2bb8916ac650874e1a44bd04e64d5c23ea11ccd9"
},
["$.settings.stripes.darkTheme.footer.linkColor|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c202195a934f3206caad05d4917edf359b473fcbd618ac0e8c7be3504bfda45e"
},
["$.settings.stripes.darkTheme.footer.linkColor|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.darkTheme.footer.linkColorHover"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "73f9193d8e1aa7408e72192f2bb8916ac650874e1a44bd04e64d5c23ea11ccd9"
},
["$.settings.stripes.darkTheme.footer.linkColorHover|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c202195a934f3206caad05d4917edf359b473fcbd618ac0e8c7be3504bfda45e"
},
["$.settings.stripes.darkTheme.footer.linkColorHover|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.darkTheme.infoArea"]: {
  "required": true,
  "type": "object",
  "schemaHash": "a80dba57a213ed4fe04216cc328a755588f06301c67b804ec0a570ca80d3a321"
},
["$.settings.stripes.darkTheme.infoArea.fontColor"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "73f9193d8e1aa7408e72192f2bb8916ac650874e1a44bd04e64d5c23ea11ccd9"
},
["$.settings.stripes.darkTheme.infoArea.fontColor|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c202195a934f3206caad05d4917edf359b473fcbd618ac0e8c7be3504bfda45e"
},
["$.settings.stripes.darkTheme.infoArea.fontColor|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.darkTheme.infoArea.linkColor"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "73f9193d8e1aa7408e72192f2bb8916ac650874e1a44bd04e64d5c23ea11ccd9"
},
["$.settings.stripes.darkTheme.infoArea.linkColor|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c202195a934f3206caad05d4917edf359b473fcbd618ac0e8c7be3504bfda45e"
},
["$.settings.stripes.darkTheme.infoArea.linkColor|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.stripes.darkTheme.infoArea.linkColorHover"]: {
  "required": true,
  "actions": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "schemaHash": "73f9193d8e1aa7408e72192f2bb8916ac650874e1a44bd04e64d5c23ea11ccd9"
},
["$.settings.stripes.darkTheme.infoArea.linkColorHover|0"]: {
  "required": true,
  "type": "string",
  "schemaHash": "c202195a934f3206caad05d4917edf359b473fcbd618ac0e8c7be3504bfda45e"
},
["$.settings.stripes.darkTheme.infoArea.linkColorHover|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.headings"]: {
  "required": true,
  "type": "object",
  "schemaHash": "055c6d4727086599be832b36b7a1ffae35ceb93db54024bcf5efdcff62496290"
},
["$.settings.headings.letterSpacing"]: {
  "required": true,
  "type": "object",
  "schemaHash": "0de0b1b8b4e02994b9415b401b414015f9024e9336e605c66dc0bce7679cf65d"
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
  "schemaHash": "bd316f5ff4c075a9d91ea3e66d11d9e2ca47f313a434b8b9741fa64b14753350"
},
["$.settings.headings.h1"]: {
  "required": true,
  "type": "object",
  "schemaHash": "e00b956ff6ecbac26ec4ca8424356ddbb836d29dd871e3e1fd083f02ce2ccc12"
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
  "schemaHash": "35cba8ee1cb9881c5a1f03b1b2254a8f77e7e7e277dd40e7eb4f0a8020f0973d"
},
["$.settings.headings.h1.fontWeight|0"]: {
  "required": true,
  "type": "integer",
  "schemaHash": "85e9ffd8ec4fc5facbb9ce2e3080baadbdb68639a524135d6a6e7ca4d4c83b74"
},
["$.settings.headings.h1.fontWeight|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.headings.h1.fontSize"]: {
  "required": true,
  "type": "object",
  "schemaHash": "01a8bff8b46694c6933fa0be8ab4dfabb4c7b3c9d064c449fd52e46a6c2c1675"
},
["$.settings.headings.h1.fontSize.desktop"]: {
  "required": true,
  "schemaHash": "9b2bae7d409ca26ab487992fc273f59ebcd2789bb08baf448ca044e3e58ceb6f"
},
["$.settings.headings.h1.fontSize.desktop|0"]: {
  "required": true,
  "type": "number",
  "schemaHash": "16208d1e33d8319d4694e51b4edb93a5da5b954b3bc79281887f27e7894ee3ca"
},
["$.settings.headings.h1.fontSize.desktop|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.headings.h1.fontSize.mobile"]: {
  "required": true,
  "schemaHash": "9603d59c32a1d0cd904b0880c19199b473bc049c4c0e17fc56ea118770a6201f"
},
["$.settings.headings.h1.fontSize.mobile|0"]: {
  "required": true,
  "type": "number",
  "schemaHash": "d58099902cab7262b22d647c167a33cf123d31cb377fca7a9d1d6bf0b30e2a43"
},
["$.settings.headings.h1.fontSize.mobile|1"]: {
  "required": true,
  "type": "null",
  "schemaHash": "bcde375ebd4cbacf651311181173836b169d5a360c6ac158c6a2cdaf49be3f61"
},
["$.settings.headings.h1.lineHeight"]: {
  "required": true,
  "type": "object",
  "schemaHash": "bdb67060d4cea550249f08631c0dffd7c77f4b7dd284ff6f9f61b050d2170edf"
},
["$.settings.headings.h1.lineHeight.desktop"]: {
  "required": true,
  "schemaHash": "68eee80ea9fa38f1725f82a79541e00f4199c66d5b81253092284fc55b09a628"
}
};

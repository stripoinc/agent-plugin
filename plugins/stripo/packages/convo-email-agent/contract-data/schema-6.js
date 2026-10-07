import value0 from './schema-2.js';
export default {
["__schema152"]: {
  "type": "object",
  "properties": {
    "networks": {
      "$ref": "#/definitions/__schema153"
    },
    "style": {
      "$ref": "#/definitions/__schema161"
    },
    "iconSize": {
      "$ref": "#/definitions/__schema162"
    },
    "spaceBetweenIcons": {
      "$ref": "#/definitions/__schema163"
    },
    "textCustomization": {
      "$ref": "#/definitions/__schema166"
    },
    "alignment": {
      "$ref": "#/definitions/__schema167"
    },
    "backgroundColor": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "margins": {
      "$ref": "#/definitions/__schema168"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema127"
    }
  },
  "required": [
    "networks",
    "style",
    "iconSize",
    "spaceBetweenIcons",
    "textCustomization",
    "alignment",
    "backgroundColor",
    "hideElement",
    "margins",
    "includeInOutput",
    "anchorLinkName"
  ],
  "additionalProperties": false
},
["__schema153"]: {
  "minItems": 1,
  "type": "array",
  "items": {
    "$ref": "#/definitions/__schema154"
  }
},
["__schema154"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema155"
    },
    "link": {
      "$ref": "#/definitions/__schema156"
    },
    "icon": {
      "$ref": "#/definitions/__schema158"
    },
    "title": {
      "$ref": "#/definitions/__schema159"
    },
    "alt": {
      "$ref": "#/definitions/__schema160"
    }
  },
  "required": [
    "type",
    "title"
  ],
  "additionalProperties": false
},
["__schema155"]: {
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
    "custom",
    "yelp",
    "google",
    "mastodon",
    "glassdoor",
    "threads",
    "bluesky",
    "digg",
    "meet"
  ]
},
["__schema156"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema109"
    },
    "href": {
      "$ref": "#/definitions/__schema157"
    }
  },
  "required": [
    "type",
    "href"
  ],
  "additionalProperties": false
},
["__schema157"]: {
  "type": "string",
  "minLength": 1
},
["__schema158"]: {
  "type": "string"
},
["__schema159"]: {
  "type": "string",
  "maxLength": 100
},
["__schema160"]: {
  "type": "string",
  "maxLength": 500
},
["__schema161"]: {
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
  ]
},
["__schema162"]: {
  "type": "integer",
  "minimum": 16,
  "maximum": 64
},
["__schema163"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema164"
    },
    "mobile": {
      "$ref": "#/definitions/__schema165"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema164"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 40
},
["__schema165"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 40
},
["__schema166"]: {
  "type": "boolean"
},
["__schema167"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema119"
    },
    "mobile": {
      "$ref": "#/definitions/__schema119"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema168"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema169"
    },
    "mobile": {
      "$ref": "#/definitions/__schema169"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema169"]: {
  "type": "object",
  "properties": {
    "top": {
      "$ref": "#/definitions/__schema170"
    },
    "right": {
      "$ref": "#/definitions/__schema171"
    },
    "bottom": {
      "$ref": "#/definitions/__schema172"
    },
    "left": {
      "$ref": "#/definitions/__schema173"
    }
  },
  "required": [
    "top",
    "right",
    "bottom",
    "left"
  ],
  "additionalProperties": false
},
["__schema170"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema171"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema172"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema173"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["htmlBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema90"
    },
    "type": {
      "$ref": "#/definitions/__schema174"
    },
    "settings": {
      "$ref": "#/definitions/__schema175"
    },
    "content": {
      "$ref": "#/definitions/__schema176"
    }
  },
  "required": [
    "id",
    "type",
    "settings"
  ],
  "description": "HTML block.",
  "x-stripo-setDocumentState": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "x-stripo-setDocumentStateRuntimes": {
    "insert": {
      "browser": true,
      "mergeService": true
    },
    "delete": {
      "browser": true,
      "mergeService": true
    },
    "update": {
      "browser": true,
      "mergeService": true
    },
    "move": {
      "browser": true,
      "mergeService": true
    }
  },
  "x-stripo-setDocumentStateUnavailableSideEffects": {
    "insert": {
      "browser": [],
      "mergeService": []
    },
    "delete": {
      "browser": [],
      "mergeService": []
    },
    "update": {
      "browser": [],
      "mergeService": []
    },
    "move": {
      "browser": [],
      "mergeService": []
    }
  },
  "additionalProperties": false
},
["__schema174"]: {
  "type": "string",
  "const": "html"
},
["__schema175"]: {
  "type": "object",
  "properties": {
    "margins": {
      "$ref": "#/definitions/__schema121"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema127"
    }
  },
  "required": [
    "margins",
    "includeInOutput",
    "hideElement",
    "anchorLinkName"
  ],
  "additionalProperties": false
},
["__schema176"]: {
  "type": "string"
},
["buttonBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema90"
    },
    "type": {
      "$ref": "#/definitions/__schema177"
    },
    "settings": {
      "$ref": "#/definitions/buttonBlockSettings"
    }
  },
  "required": [
    "id",
    "type",
    "settings"
  ],
  "description": "Button block.",
  "x-stripo-setDocumentState": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "x-stripo-setDocumentStateRuntimes": {
    "insert": {
      "browser": true,
      "mergeService": true
    },
    "delete": {
      "browser": true,
      "mergeService": true
    },
    "update": {
      "browser": true,
      "mergeService": true
    },
    "move": {
      "browser": true,
      "mergeService": true
    }
  },
  "x-stripo-setDocumentStateUnavailableSideEffects": {
    "insert": {
      "browser": [],
      "mergeService": []
    },
    "delete": {
      "browser": [],
      "mergeService": []
    },
    "update": {
      "browser": [],
      "mergeService": []
    },
    "move": {
      "browser": [],
      "mergeService": []
    }
  },
  "additionalProperties": false
},
["__schema177"]: {
  "type": "string",
  "const": "button"
},
["buttonBlockSettings"]: {
  "type": "object",
  "properties": {
    "link": {
      "$ref": "#/definitions/__schema178"
    },
    "text": {
      "$ref": "#/definitions/__schema190"
    },
    "alignment": {
      "$ref": "#/definitions/__schema191"
    },
    "fixedHeight": {
      "$ref": "#/definitions/__schema192"
    },
    "icon": {
      "$ref": "#/definitions/__schema195"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "padding": {
      "$ref": "#/definitions/__schema200"
    },
    "margins": {
      "$ref": "#/definitions/__schema200"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "anchorLink": {
      "$ref": "#/definitions/__schema203"
    },
    "backgroundColor": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    },
    "fontFamily": {
      "$ref": "#/definitions/__schema8"
    },
    "fontSize": {
      "$ref": "#/definitions/fontSize"
    },
    "textStyle": {
      "$ref": "#/definitions/buttonsTextStyle"
    },
    "fitContainer": {
      "$ref": "#/definitions/responsiveBoolean"
    },
    "blockBackgroundColor": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    },
    "borderRadius": {
      "$ref": "#/definitions/borderRadius"
    },
    "border": {
      "$ref": "#/definitions/border"
    },
    "fontColor": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    }
  },
  "required": [
    "text",
    "alignment",
    "hideElement",
    "padding",
    "margins",
    "includeInOutput",
    "anchorLink",
    "backgroundColor",
    "fontFamily",
    "fontSize",
    "textStyle",
    "fitContainer",
    "blockBackgroundColor",
    "borderRadius",
    "border",
    "fontColor"
  ],
  "additionalProperties": false,
  "description": "Button block settings."
},
["__schema178"]: {
  "anyOf": [
    {
      "$ref": "#/definitions/__schema180"
    },
    {
      "$ref": "#/definitions/__schema183"
    }
  ]
},
["__schema179"]: {
  "anyOf": [
    {
      "$ref": "#/definitions/__schema180"
    },
    {
      "$ref": "#/definitions/__schema183"
    }
  ]
},
["__schema180"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema181"
    },
    "value": {
      "$ref": "#/definitions/__schema182"
    }
  },
  "required": [
    "type",
    "value"
  ],
  "additionalProperties": false
},
["__schema181"]: {
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
  ]
},
["__schema182"]: {
  "type": "string"
},
["__schema183"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema184"
    },
    "value": {
      "$ref": "#/definitions/__schema185"
    },
    "salesforce": {
      "$ref": "#/definitions/__schema186"
    }
  },
  "required": [
    "type",
    "value",
    "salesforce"
  ],
  "additionalProperties": false
},
["__schema184"]: {
  "type": "string",
  "const": "salesforce_mc"
},
["__schema185"]: {
  "type": "string"
},
["__schema186"]: {
  "type": "object",
  "properties": {
    "trackingAlias": {
      "$ref": "#/definitions/__schema187"
    },
    "linkTo": {
      "$ref": "#/definitions/__schema188"
    },
    "conversion": {
      "$ref": "#/definitions/__schema189"
    }
  },
  "required": [
    "trackingAlias",
    "linkTo",
    "conversion"
  ],
  "additionalProperties": false
},
["__schema187"]: {
  "type": "string",
  "maxLength": 100
},
["__schema188"]: {
  "type": "string"
},
["__schema189"]: {
  "type": "boolean"
},
["__schema190"]: {
  "type": "string"
},
["__schema191"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema119"
    },
    "mobile": {
      "$ref": "#/definitions/__schema119"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema192"]: {
  "type": "object",
  "properties": {
    "height": {
      "$ref": "#/definitions/__schema193"
    },
    "alignment": {
      "$ref": "#/definitions/__schema194"
    }
  },
  "required": [
    "height"
  ],
  "additionalProperties": false
},
["__schema193"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 9007199254740991
},
["__schema194"]: {
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ]
},
["__schema195"]: {
  "type": "object",
  "properties": {
    "src": {
      "$ref": "#/definitions/__schema196"
    },
    "width": {
      "$ref": "#/definitions/__schema197"
    },
    "align": {
      "$ref": "#/definitions/__schema198"
    },
    "indent": {
      "$ref": "#/definitions/__schema199"
    }
  },
  "required": [
    "src",
    "width",
    "align",
    "indent"
  ],
  "additionalProperties": false
},
["__schema196"]: {
  "type": "string",
  "minLength": 1
},
["__schema197"]: {
  "type": "integer",
  "minimum": 3,
  "maximum": 128
},
["__schema198"]: {
  "type": "string",
  "enum": [
    "left",
    "right"
  ]
},
["__schema199"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 400
},
["__schema200"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema201"
    },
    "mobile": {
      "$ref": "#/definitions/__schema201"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema201"]: {
  "type": "object",
  "properties": {
    "top": {
      "$ref": "#/definitions/__schema202"
    },
    "right": {
      "$ref": "#/definitions/__schema202"
    },
    "bottom": {
      "$ref": "#/definitions/__schema202"
    },
    "left": {
      "$ref": "#/definitions/__schema202"
    }
  },
  "required": [
    "top",
    "right",
    "bottom",
    "left"
  ],
  "additionalProperties": false
},
["__schema202"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema203"]: {
  "type": "string",
  "maxLength": 150
},
["fontSize"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema204"
    },
    "mobile": {
      "$ref": "#/definitions/__schema205"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false,
  "description": "Responsive font sizes for desktop and mobile."
},
["__schema204"]: {
  "type": "number",
  "minimum": 8,
  "maximum": 72
},
["__schema205"]: {
  "type": "number",
  "minimum": 8,
  "maximum": 72
},
["buttonsTextStyle"]: {
  "type": "object",
  "properties": {
    "bold": {
      "$ref": "#/definitions/__schema206"
    },
    "italic": {
      "$ref": "#/definitions/__schema207"
    }
  },
  "required": [
    "bold",
    "italic"
  ],
  "additionalProperties": false,
  "description": "Button text style settings."
},
["__schema206"]: {
  "type": "boolean"
},
["__schema207"]: {
  "type": "boolean"
},
["responsiveBoolean"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema208"
    },
    "mobile": {
      "$ref": "#/definitions/__schema209"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false,
  "description": "Responsive boolean values for desktop and mobile."
},
["__schema208"]: {
  "type": "boolean"
},
["__schema209"]: {
  "type": "boolean"
},
["spacerBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema90"
    },
    "type": {
      "$ref": "#/definitions/__schema210"
    },
    "settings": {
      "$ref": "#/definitions/__schema211"
    }
  },
  "required": [
    "id",
    "type",
    "settings"
  ],
  "description": "Spacer block.",
  "x-stripo-setDocumentState": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "x-stripo-setDocumentStateRuntimes": {
    "insert": {
      "browser": true,
      "mergeService": true
    },
    "delete": {
      "browser": true,
      "mergeService": true
    },
    "update": {
      "browser": true,
      "mergeService": true
    },
    "move": {
      "browser": true,
      "mergeService": true
    }
  },
  "x-stripo-setDocumentStateUnavailableSideEffects": {
    "insert": {
      "browser": [],
      "mergeService": []
    },
    "delete": {
      "browser": [],
      "mergeService": []
    },
    "update": {
      "browser": [],
      "mergeService": []
    },
    "move": {
      "browser": [],
      "mergeService": []
    }
  },
  "additionalProperties": false
},
["__schema210"]: {
  "type": "string",
  "const": "spacer"
},
["__schema211"]: {
  "type": "object",
  "properties": {
    "mode": {
      "$ref": "#/definitions/__schema212"
    },
    "width": {
      "$ref": "#/definitions/__schema213"
    },
    "height": {
      "$ref": "#/definitions/__schema219"
    },
    "border": {
      "$ref": "#/definitions/__schema222"
    },
    "mobileBorder": {
      "$ref": "#/definitions/__schema225"
    },
    "alignment": {
      "$ref": "#/definitions/__schema227"
    },
    "backgroundColor": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    },
    "margins": {
      "$ref": "#/definitions/__schema228"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema127"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    }
  },
  "required": [
    "mode",
    "backgroundColor",
    "margins",
    "anchorLinkName",
    "includeInOutput",
    "hideElement"
  ],
  "additionalProperties": false
},
["__schema212"]: {
  "type": "string",
  "enum": [
    "line",
    "space"
  ]
},
["__schema213"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema214"
    },
    "mobile": {
      "$ref": "#/definitions/__schema218"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema214"]: {
  "type": "object",
  "properties": {
    "value": {
      "$ref": "#/definitions/__schema215"
    },
    "unit": {
      "$ref": "#/definitions/__schema216"
    }
  },
  "required": [
    "value",
    "unit"
  ],
  "additionalProperties": false
},
["__schema215"]: {
  "type": "integer",
  "minimum": 5,
  "maximum": 1000
},
["__schema216"]: {
  "type": "string",
  "enum": [
    "percent",
    "px"
  ]
},
["__schema217"]: {
  "type": "object",
  "properties": {
    "value": {
      "$ref": "#/definitions/__schema215"
    },
    "unit": {
      "$ref": "#/definitions/__schema216"
    }
  },
  "required": [
    "value",
    "unit"
  ],
  "additionalProperties": false
},
["__schema218"]: {
  "type": "object",
  "properties": {
    "value": {
      "$ref": "#/definitions/__schema215"
    },
    "unit": {
      "$ref": "#/definitions/__schema216"
    }
  },
  "required": [
    "value",
    "unit"
  ],
  "additionalProperties": false
},
["__schema219"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema220"
    },
    "mobile": {
      "$ref": "#/definitions/__schema221"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema220"]: {
  "type": "integer",
  "minimum": 5,
  "maximum": 1000
},
["__schema221"]: {
  "type": "integer",
  "minimum": 5,
  "maximum": 1000
},
["__schema222"]: {
  "type": "object",
  "properties": {
    "size": {
      "$ref": "#/definitions/__schema224"
    },
    "style": {
      "$ref": "#/definitions/__schema60"
    },
    "color": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    }
  },
  "required": [
    "size",
    "style",
    "color"
  ],
  "additionalProperties": false
},
["__schema223"]: {
  "type": "object",
  "properties": {
    "size": {
      "$ref": "#/definitions/__schema224"
    },
    "style": {
      "$ref": "#/definitions/__schema60"
    },
    "color": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    }
  },
  "required": [
    "size",
    "style",
    "color"
  ],
  "additionalProperties": false
},
["__schema224"]: {
  "type": "integer",
  "minimum": 1,
  "maximum": 40
},
["__schema225"]: {
  "anyOf": [
    {
      "$ref": "#/definitions/__schema223"
    },
    {
      "type": "null"
    }
  ]
},
["__schema226"]: {
  "anyOf": [
    {
      "$ref": "#/definitions/__schema223"
    },
    {
      "type": "null"
    }
  ]
},
["__schema227"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema119"
    },
    "mobile": {
      "$ref": "#/definitions/__schema119"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema228"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema229"
    },
    "mobile": {
      "$ref": "#/definitions/__schema229"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema229"]: {
  "type": "object",
  "properties": {
    "top": {
      "$ref": "#/definitions/__schema230"
    },
    "right": {
      "$ref": "#/definitions/__schema231"
    },
    "bottom": {
      "$ref": "#/definitions/__schema232"
    },
    "left": {
      "$ref": "#/definitions/__schema233"
    }
  },
  "required": [
    "top",
    "right",
    "bottom",
    "left"
  ],
  "additionalProperties": false
},
["__schema230"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 1000
},
["__schema231"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 1000
},
["__schema232"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 1000
},
["__schema233"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 1000
},
["menuBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema90"
    },
    "type": {
      "$ref": "#/definitions/__schema234"
    },
    "settings": {
      "$ref": "#/definitions/menuBlockSettings"
    }
  },
  "required": [
    "id",
    "type",
    "settings"
  ],
  "description": "Menu block.",
  "x-stripo-setDocumentState": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "x-stripo-setDocumentStateRuntimes": {
    "insert": {
      "browser": true,
      "mergeService": true
    },
    "delete": {
      "browser": true,
      "mergeService": true
    },
    "update": {
      "browser": true,
      "mergeService": true
    },
    "move": {
      "browser": true,
      "mergeService": true
    }
  },
  "x-stripo-setDocumentStateUnavailableSideEffects": {
    "insert": {
      "browser": [],
      "mergeService": []
    },
    "delete": {
      "browser": [],
      "mergeService": []
    },
    "update": {
      "browser": [],
      "mergeService": []
    },
    "move": {
      "browser": [],
      "mergeService": []
    }
  },
  "additionalProperties": false
},
["__schema234"]: {
  "type": "string",
  "const": "menu"
},
["menuBlockSettings"]: {
  "type": "object",
  "properties": {
    "responsiveMenu": {
      "$ref": "#/definitions/__schema235"
    },
    "itemType": {
      "$ref": "#/definitions/__schema236"
    },
    "fitToContainer": {
      "$ref": "#/definitions/__schema239"
    },
    "itemPadding": {
      "$ref": "#/definitions/__schema240"
    },
    "margins": {
      "$ref": "#/definitions/__schema240"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema127"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "separator": {
      "$ref": "#/definitions/menuSeparator"
    },
    "fontFamily": {
      "$ref": "#/definitions/__schema8"
    },
    "fontSize": {
      "$ref": "#/definitions/fontSize"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "textStyle": {
      "$ref": "#/definitions/buttonsTextStyle"
    },
    "colors": {
      "$ref": "#/definitions/__schema245"
    },
    "items": {
      "$ref": "#/definitions/__schema248"
    }
  },
  "required": [
    "responsiveMenu",
    "itemType",
    "fitToContainer",
    "itemPadding",
    "margins",
    "anchorLinkName",
    "includeInOutput",
    "separator",
    "fontFamily",
    "fontSize",
    "hideElement",
    "textStyle",
    "colors",
    "items"
  ],
  "additionalProperties": false,
  "description": "Menu block settings."
},
["__schema235"]: {
  "type": "boolean"
},
["__schema236"]: {
  "oneOf": [
    {
      "$ref": "#/definitions/__schema237"
    },
    {
      "$ref": "#/definitions/__schema238"
    }
  ]
},
["__schema237"]: {
  "type": "object",
  "properties": {
    "mode": {
      "type": "string",
      "const": "shared"
    },
    "type": {
      "$ref": "#/definitions/menuItemType"
    }
  },
  "required": [
    "mode",
    "type"
  ],
  "additionalProperties": false
},
["menuItemType"]: {
  "type": "string",
  "enum": [
    "links",
    "icons",
    "linksWithIcons"
  ],
  "description": "Menu item type: links, icons, or links with icons."
},
["__schema238"]: {
  "type": "object",
  "properties": {
    "mode": {
      "type": "string",
      "const": "perItem"
    }
  },
  "required": [
    "mode"
  ],
  "additionalProperties": false
},
["__schema239"]: {
  "type": "boolean"
},
["__schema240"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema241"
    },
    "mobile": {
      "$ref": "#/definitions/__schema241"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema241"]: {
  "type": "object",
  "properties": {
    "top": {
      "$ref": "#/definitions/__schema242"
    },
    "right": {
      "$ref": "#/definitions/__schema242"
    },
    "bottom": {
      "$ref": "#/definitions/__schema242"
    },
    "left": {
      "$ref": "#/definitions/__schema242"
    }
  },
  "required": [
    "top",
    "right",
    "bottom",
    "left"
  ],
  "additionalProperties": false
},
["__schema242"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["menuSeparator"]: {
  "type": "object",
  "properties": {
    "width": {
      "$ref": "#/definitions/__schema243"
    },
    "style": {
      "$ref": "#/definitions/__schema244"
    },
    "color": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    }
  },
  "required": [
    "width",
    "style",
    "color"
  ],
  "additionalProperties": false,
  "description": "Menu separator settings."
},
["__schema243"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 20
},
["__schema244"]: {
  "type": "string",
  "enum": [
    "none",
    "line",
    "dashed",
    "dotted"
  ]
},
["__schema245"]: {
  "oneOf": [
    {
      "$ref": "#/definitions/__schema246"
    },
    {
      "$ref": "#/definitions/__schema247"
    }
  ]
},
["__schema246"]: {
  "type": "object",
  "properties": {
    "mode": {
      "type": "string",
      "const": "shared"
    },
    "link": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    }
  },
  "required": [
    "mode",
    "link"
  ],
  "additionalProperties": false
},
["__schema247"]: {
  "type": "object",
  "properties": {
    "mode": {
      "type": "string",
      "const": "perItem"
    }
  },
  "required": [
    "mode"
  ],
  "additionalProperties": false
},
["__schema248"]: {
  "minItems": 1,
  "maxItems": 30,
  "type": "array",
  "items": {
    "$ref": "#/definitions/menuItem"
  }
},
["menuItem"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema249"
    },
    "name": {
      "$ref": "#/definitions/__schema250"
    },
    "link": {
      "$ref": "#/definitions/menuLink"
    },
    "image": {
      "$ref": "#/definitions/__schema253"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "colors": {
      "$ref": "#/definitions/__schema260"
    }
  },
  "required": [
    "name",
    "link",
    "hideElement"
  ],
  "additionalProperties": false,
  "description": "Menu item settings."
},
["__schema249"]: {
  "type": "string",
  "enum": [
    "links",
    "icons",
    "linksWithIcons"
  ],
  "description": "Menu item type: links, icons, or links with icons."
},
["__schema250"]: {
  "type": "string",
  "maxLength": 500
},
["menuLink"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema251"
    },
    "value": {
      "$ref": "#/definitions/__schema252"
    }
  },
  "required": [
    "type",
    "value"
  ],
  "additionalProperties": false,
  "description": "Menu item link type and URL/value."
},
["__schema251"]: {
  "type": "string",
  "enum": [
    "site",
    "email",
    "phone",
    "anchor"
  ]
},
["__schema252"]: {
  "type": "string"
},
["__schema253"]: {
  "type": "object",
  "properties": {
    "src": {
      "$ref": "#/definitions/__schema254"
    },
    "size": {
      "$ref": "#/definitions/menuImageSize"
    },
    "alignment": {
      "$ref": "#/definitions/__schema257"
    },
    "indent": {
      "$ref": "#/definitions/__schema258"
    },
    "altText": {
      "$ref": "#/definitions/__schema259"
    }
  },
  "required": [
    "src",
    "size",
    "alignment",
    "indent",
    "altText"
  ],
  "additionalProperties": false,
  "description": "Menu item image settings."
},
["menuItemImage"]: {
  "type": "object",
  "properties": {
    "src": {
      "$ref": "#/definitions/__schema254"
    },
    "size": {
      "$ref": "#/definitions/menuImageSize"
    },
    "alignment": {
      "$ref": "#/definitions/__schema257"
    },
    "indent": {
      "$ref": "#/definitions/__schema258"
    },
    "altText": {
      "$ref": "#/definitions/__schema259"
    }
  },
  "required": [
    "src",
    "size",
    "alignment",
    "indent",
    "altText"
  ],
  "additionalProperties": false,
  "description": "Menu item image settings."
},
["__schema254"]: {
  "type": "string",
  "minLength": 1
},
["menuImageSize"]: {
  "type": "object",
  "properties": {
    "mode": {
      "$ref": "#/definitions/__schema255"
    },
    "px": {
      "$ref": "#/definitions/__schema256"
    }
  },
  "required": [
    "mode",
    "px"
  ],
  "additionalProperties": false,
  "description": "Menu item image size settings."
},
["__schema255"]: {
  "type": "string",
  "enum": [
    "width",
    "height"
  ]
},
["__schema256"]: {
  "type": "integer",
  "minimum": 3,
  "maximum": 100
},
["__schema257"]: {
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ]
},
["__schema258"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 1000
},
["__schema259"]: {
  "type": "string",
  "maxLength": 500
},
["__schema260"]: {
  "type": "object",
  "properties": {
    "link": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "background": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    }
  },
  "required": [
    "link",
    "background"
  ],
  "additionalProperties": false
},
["unknownBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema90"
    },
    "type": {
      "$ref": "#/definitions/__schema261"
    },
    "settings": {
      "$ref": "#/definitions/__schema262"
    },
    "content": {
      "$ref": "#/definitions/__schema265"
    },
    "extension": {
      "$ref": "#/definitions/__schema266"
    }
  },
  "required": [
    "id",
    "type",
    "content",
    "extension"
  ],
  "additionalProperties": false,
  "description": "Unknown or extension block.",
  "x-stripo-setDocumentState": {
    "insert": "supported",
    "delete": "supported",
    "update": "supported",
    "move": "supported"
  },
  "x-stripo-setDocumentStateRuntimes": {
    "insert": {
      "browser": true,
      "mergeService": true
    },
    "delete": {
      "browser": true,
      "mergeService": true
    },
    "update": {
      "browser": true,
      "mergeService": true
    },
    "move": {
      "browser": true,
      "mergeService": true
    }
  },
  "x-stripo-setDocumentStateUnavailableSideEffects": {
    "insert": {
      "browser": [],
      "mergeService": []
    },
    "delete": {
      "browser": [],
      "mergeService": []
    },
    "update": {
      "browser": [],
      "mergeService": []
    },
    "move": {
      "browser": [],
      "mergeService": []
    }
  }
},
["__schema261"]: {
  "type": "string",
  "const": "unknown"
},
["__schema262"]: {
  "type": "object",
  "propertyNames": {
    "$ref": "#/definitions/__schema263"
  },
  "additionalProperties": {
    "$ref": "#/definitions/__schema264"
  }
},
["__schema263"]: {
  "type": "string"
},
["__schema264"]: {},
["__schema265"]: {
  "type": "string"
},
["__schema266"]: {
  "type": "boolean"
}
};

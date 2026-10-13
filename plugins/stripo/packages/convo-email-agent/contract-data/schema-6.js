import value0 from './schema-2.js';
export default {
["__schema151"]: {
  "type": "object",
  "properties": {
    "days": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "hours": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "minutes": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "seconds": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    }
  },
  "required": [
    "days",
    "hours",
    "minutes",
    "seconds"
  ],
  "additionalProperties": false
},
["socialBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema91"
    },
    "type": {
      "$ref": "#/definitions/__schema152"
    },
    "settings": {
      "$ref": "#/definitions/__schema153"
    }
  },
  "required": [
    "id",
    "type",
    "settings"
  ],
  "description": "Social block.",
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
["__schema152"]: {
  "type": "string",
  "const": "social"
},
["__schema153"]: {
  "type": "object",
  "properties": {
    "networks": {
      "$ref": "#/definitions/__schema154"
    },
    "style": {
      "$ref": "#/definitions/__schema162"
    },
    "iconSize": {
      "$ref": "#/definitions/__schema163"
    },
    "spaceBetweenIcons": {
      "$ref": "#/definitions/__schema164"
    },
    "textCustomization": {
      "$ref": "#/definitions/__schema167"
    },
    "alignment": {
      "$ref": "#/definitions/__schema168"
    },
    "backgroundColor": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "margins": {
      "$ref": "#/definitions/__schema169"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema128"
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
["__schema154"]: {
  "minItems": 1,
  "type": "array",
  "items": {
    "$ref": "#/definitions/__schema155"
  }
},
["__schema155"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema156"
    },
    "link": {
      "$ref": "#/definitions/__schema157"
    },
    "icon": {
      "$ref": "#/definitions/__schema159"
    },
    "title": {
      "$ref": "#/definitions/__schema160"
    },
    "alt": {
      "$ref": "#/definitions/__schema161"
    }
  },
  "required": [
    "type",
    "title"
  ],
  "additionalProperties": false
},
["__schema156"]: {
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
["__schema157"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema110"
    },
    "href": {
      "$ref": "#/definitions/__schema158"
    }
  },
  "required": [
    "type",
    "href"
  ],
  "additionalProperties": false
},
["__schema158"]: {
  "type": "string",
  "minLength": 1
},
["__schema159"]: {
  "type": "string"
},
["__schema160"]: {
  "type": "string",
  "maxLength": 100
},
["__schema161"]: {
  "type": "string",
  "maxLength": 500
},
["__schema162"]: {
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
["__schema163"]: {
  "type": "integer",
  "minimum": 16,
  "maximum": 64
},
["__schema164"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema165"
    },
    "mobile": {
      "$ref": "#/definitions/__schema166"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema165"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 40
},
["__schema166"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 40
},
["__schema167"]: {
  "type": "boolean"
},
["__schema168"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema120"
    },
    "mobile": {
      "$ref": "#/definitions/__schema120"
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
    "desktop": {
      "$ref": "#/definitions/__schema170"
    },
    "mobile": {
      "$ref": "#/definitions/__schema170"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema170"]: {
  "type": "object",
  "properties": {
    "top": {
      "$ref": "#/definitions/__schema171"
    },
    "right": {
      "$ref": "#/definitions/__schema172"
    },
    "bottom": {
      "$ref": "#/definitions/__schema173"
    },
    "left": {
      "$ref": "#/definitions/__schema174"
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
["__schema174"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["htmlBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema91"
    },
    "type": {
      "$ref": "#/definitions/__schema175"
    },
    "settings": {
      "$ref": "#/definitions/__schema176"
    },
    "content": {
      "$ref": "#/definitions/__schema177"
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
["__schema175"]: {
  "type": "string",
  "const": "html"
},
["__schema176"]: {
  "type": "object",
  "properties": {
    "margins": {
      "$ref": "#/definitions/__schema122"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema128"
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
["__schema177"]: {
  "type": "string"
},
["buttonBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema91"
    },
    "type": {
      "$ref": "#/definitions/__schema178"
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
["__schema178"]: {
  "type": "string",
  "const": "button"
},
["buttonBlockSettings"]: {
  "type": "object",
  "properties": {
    "link": {
      "$ref": "#/definitions/__schema179"
    },
    "text": {
      "$ref": "#/definitions/__schema191"
    },
    "alignment": {
      "$ref": "#/definitions/__schema192"
    },
    "fixedHeight": {
      "$ref": "#/definitions/__schema193"
    },
    "icon": {
      "$ref": "#/definitions/__schema196"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "padding": {
      "$ref": "#/definitions/__schema201"
    },
    "margins": {
      "$ref": "#/definitions/__schema201"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "anchorLink": {
      "$ref": "#/definitions/__schema204"
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
["__schema179"]: {
  "anyOf": [
    {
      "$ref": "#/definitions/__schema181"
    },
    {
      "$ref": "#/definitions/__schema184"
    }
  ]
},
["__schema180"]: {
  "anyOf": [
    {
      "$ref": "#/definitions/__schema181"
    },
    {
      "$ref": "#/definitions/__schema184"
    }
  ]
},
["__schema181"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema182"
    },
    "value": {
      "$ref": "#/definitions/__schema183"
    }
  },
  "required": [
    "type",
    "value"
  ],
  "additionalProperties": false
},
["__schema182"]: {
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
["__schema183"]: {
  "type": "string"
},
["__schema184"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema185"
    },
    "value": {
      "$ref": "#/definitions/__schema186"
    },
    "salesforce": {
      "$ref": "#/definitions/__schema187"
    }
  },
  "required": [
    "type",
    "value",
    "salesforce"
  ],
  "additionalProperties": false
},
["__schema185"]: {
  "type": "string",
  "const": "salesforce_mc"
},
["__schema186"]: {
  "type": "string"
},
["__schema187"]: {
  "type": "object",
  "properties": {
    "trackingAlias": {
      "$ref": "#/definitions/__schema188"
    },
    "linkTo": {
      "$ref": "#/definitions/__schema189"
    },
    "conversion": {
      "$ref": "#/definitions/__schema190"
    }
  },
  "required": [
    "trackingAlias",
    "linkTo",
    "conversion"
  ],
  "additionalProperties": false
},
["__schema188"]: {
  "type": "string",
  "maxLength": 100
},
["__schema189"]: {
  "type": "string"
},
["__schema190"]: {
  "type": "boolean"
},
["__schema191"]: {
  "type": "string"
},
["__schema192"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema120"
    },
    "mobile": {
      "$ref": "#/definitions/__schema120"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema193"]: {
  "type": "object",
  "properties": {
    "height": {
      "$ref": "#/definitions/__schema194"
    },
    "alignment": {
      "$ref": "#/definitions/__schema195"
    }
  },
  "required": [
    "height"
  ],
  "additionalProperties": false
},
["__schema194"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 9007199254740991
},
["__schema195"]: {
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ]
},
["__schema196"]: {
  "type": "object",
  "properties": {
    "src": {
      "$ref": "#/definitions/__schema197"
    },
    "width": {
      "$ref": "#/definitions/__schema198"
    },
    "align": {
      "$ref": "#/definitions/__schema199"
    },
    "indent": {
      "$ref": "#/definitions/__schema200"
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
["__schema197"]: {
  "type": "string",
  "minLength": 1
},
["__schema198"]: {
  "type": "integer",
  "minimum": 3,
  "maximum": 128
},
["__schema199"]: {
  "type": "string",
  "enum": [
    "left",
    "right"
  ]
},
["__schema200"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 400
},
["__schema201"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema202"
    },
    "mobile": {
      "$ref": "#/definitions/__schema202"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema202"]: {
  "type": "object",
  "properties": {
    "top": {
      "$ref": "#/definitions/__schema203"
    },
    "right": {
      "$ref": "#/definitions/__schema203"
    },
    "bottom": {
      "$ref": "#/definitions/__schema203"
    },
    "left": {
      "$ref": "#/definitions/__schema203"
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
["__schema203"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema204"]: {
  "type": "string",
  "maxLength": 150
},
["fontSize"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema205"
    },
    "mobile": {
      "$ref": "#/definitions/__schema206"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false,
  "description": "Responsive font sizes for desktop and mobile."
},
["__schema205"]: {
  "type": "number",
  "minimum": 8,
  "maximum": 72
},
["__schema206"]: {
  "type": "number",
  "minimum": 8,
  "maximum": 72
},
["buttonsTextStyle"]: {
  "type": "object",
  "properties": {
    "bold": {
      "$ref": "#/definitions/__schema207"
    },
    "italic": {
      "$ref": "#/definitions/__schema208"
    }
  },
  "required": [
    "bold",
    "italic"
  ],
  "additionalProperties": false,
  "description": "Button text style settings."
},
["__schema207"]: {
  "type": "boolean"
},
["__schema208"]: {
  "type": "boolean"
},
["responsiveBoolean"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema209"
    },
    "mobile": {
      "$ref": "#/definitions/__schema210"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false,
  "description": "Responsive boolean values for desktop and mobile."
},
["__schema209"]: {
  "type": "boolean"
},
["__schema210"]: {
  "type": "boolean"
},
["spacerBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema91"
    },
    "type": {
      "$ref": "#/definitions/__schema211"
    },
    "settings": {
      "$ref": "#/definitions/__schema212"
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
["__schema211"]: {
  "type": "string",
  "const": "spacer"
},
["__schema212"]: {
  "type": "object",
  "properties": {
    "mode": {
      "$ref": "#/definitions/__schema213"
    },
    "width": {
      "$ref": "#/definitions/__schema214"
    },
    "height": {
      "$ref": "#/definitions/__schema220"
    },
    "border": {
      "$ref": "#/definitions/__schema223"
    },
    "mobileBorder": {
      "$ref": "#/definitions/__schema226"
    },
    "alignment": {
      "$ref": "#/definitions/__schema228"
    },
    "backgroundColor": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    },
    "margins": {
      "$ref": "#/definitions/__schema229"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema128"
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
["__schema213"]: {
  "type": "string",
  "enum": [
    "line",
    "space"
  ]
},
["__schema214"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema215"
    },
    "mobile": {
      "$ref": "#/definitions/__schema219"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema215"]: {
  "type": "object",
  "properties": {
    "value": {
      "$ref": "#/definitions/__schema216"
    },
    "unit": {
      "$ref": "#/definitions/__schema217"
    }
  },
  "required": [
    "value",
    "unit"
  ],
  "additionalProperties": false
},
["__schema216"]: {
  "type": "integer",
  "minimum": 5,
  "maximum": 1000
},
["__schema217"]: {
  "type": "string",
  "enum": [
    "percent",
    "px"
  ]
},
["__schema218"]: {
  "type": "object",
  "properties": {
    "value": {
      "$ref": "#/definitions/__schema216"
    },
    "unit": {
      "$ref": "#/definitions/__schema217"
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
    "value": {
      "$ref": "#/definitions/__schema216"
    },
    "unit": {
      "$ref": "#/definitions/__schema217"
    }
  },
  "required": [
    "value",
    "unit"
  ],
  "additionalProperties": false
},
["__schema220"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema221"
    },
    "mobile": {
      "$ref": "#/definitions/__schema222"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema221"]: {
  "type": "integer",
  "minimum": 5,
  "maximum": 1000
},
["__schema222"]: {
  "type": "integer",
  "minimum": 5,
  "maximum": 1000
},
["__schema223"]: {
  "type": "object",
  "properties": {
    "size": {
      "$ref": "#/definitions/__schema225"
    },
    "style": {
      "$ref": "#/definitions/__schema61"
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
  "type": "object",
  "properties": {
    "size": {
      "$ref": "#/definitions/__schema225"
    },
    "style": {
      "$ref": "#/definitions/__schema61"
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
["__schema225"]: {
  "type": "integer",
  "minimum": 1,
  "maximum": 40
},
["__schema226"]: {
  "anyOf": [
    {
      "$ref": "#/definitions/__schema224"
    },
    {
      "type": "null"
    }
  ]
},
["__schema227"]: {
  "anyOf": [
    {
      "$ref": "#/definitions/__schema224"
    },
    {
      "type": "null"
    }
  ]
},
["__schema228"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema120"
    },
    "mobile": {
      "$ref": "#/definitions/__schema120"
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
    "desktop": {
      "$ref": "#/definitions/__schema230"
    },
    "mobile": {
      "$ref": "#/definitions/__schema230"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema230"]: {
  "type": "object",
  "properties": {
    "top": {
      "$ref": "#/definitions/__schema231"
    },
    "right": {
      "$ref": "#/definitions/__schema232"
    },
    "bottom": {
      "$ref": "#/definitions/__schema233"
    },
    "left": {
      "$ref": "#/definitions/__schema234"
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
["__schema234"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 1000
},
["menuBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema91"
    },
    "type": {
      "$ref": "#/definitions/__schema235"
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
["__schema235"]: {
  "type": "string",
  "const": "menu"
},
["menuBlockSettings"]: {
  "type": "object",
  "properties": {
    "responsiveMenu": {
      "$ref": "#/definitions/__schema236"
    },
    "itemType": {
      "$ref": "#/definitions/__schema237"
    },
    "fitToContainer": {
      "$ref": "#/definitions/__schema240"
    },
    "itemPadding": {
      "$ref": "#/definitions/__schema241"
    },
    "margins": {
      "$ref": "#/definitions/__schema241"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema128"
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
      "$ref": "#/definitions/__schema246"
    },
    "items": {
      "$ref": "#/definitions/__schema249"
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
["__schema236"]: {
  "type": "boolean"
},
["__schema237"]: {
  "oneOf": [
    {
      "$ref": "#/definitions/__schema238"
    },
    {
      "$ref": "#/definitions/__schema239"
    }
  ]
},
["__schema238"]: {
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
["__schema239"]: {
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
["__schema240"]: {
  "type": "boolean"
},
["__schema241"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema242"
    },
    "mobile": {
      "$ref": "#/definitions/__schema242"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema242"]: {
  "type": "object",
  "properties": {
    "top": {
      "$ref": "#/definitions/__schema243"
    },
    "right": {
      "$ref": "#/definitions/__schema243"
    },
    "bottom": {
      "$ref": "#/definitions/__schema243"
    },
    "left": {
      "$ref": "#/definitions/__schema243"
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
["__schema243"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["menuSeparator"]: {
  "type": "object",
  "properties": {
    "width": {
      "$ref": "#/definitions/__schema244"
    },
    "style": {
      "$ref": "#/definitions/__schema245"
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
["__schema244"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 20
},
["__schema245"]: {
  "type": "string",
  "enum": [
    "none",
    "line",
    "dashed",
    "dotted"
  ]
},
["__schema246"]: {
  "oneOf": [
    {
      "$ref": "#/definitions/__schema247"
    },
    {
      "$ref": "#/definitions/__schema248"
    }
  ]
},
["__schema247"]: {
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
["__schema248"]: {
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
["__schema249"]: {
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
      "$ref": "#/definitions/__schema250"
    },
    "name": {
      "$ref": "#/definitions/__schema251"
    },
    "link": {
      "$ref": "#/definitions/menuLink"
    },
    "image": {
      "$ref": "#/definitions/__schema254"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "colors": {
      "$ref": "#/definitions/__schema261"
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
["__schema250"]: {
  "type": "string",
  "enum": [
    "links",
    "icons",
    "linksWithIcons"
  ],
  "description": "Menu item type: links, icons, or links with icons."
},
["__schema251"]: {
  "type": "string",
  "maxLength": 500
},
["menuLink"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema252"
    },
    "value": {
      "$ref": "#/definitions/__schema253"
    }
  },
  "required": [
    "type",
    "value"
  ],
  "additionalProperties": false,
  "description": "Menu item link type and URL/value."
},
["__schema252"]: {
  "type": "string",
  "enum": [
    "site",
    "email",
    "phone",
    "anchor"
  ]
},
["__schema253"]: {
  "type": "string"
},
["__schema254"]: {
  "type": "object",
  "properties": {
    "src": {
      "$ref": "#/definitions/__schema255"
    },
    "size": {
      "$ref": "#/definitions/menuImageSize"
    },
    "alignment": {
      "$ref": "#/definitions/__schema258"
    },
    "indent": {
      "$ref": "#/definitions/__schema259"
    },
    "altText": {
      "$ref": "#/definitions/__schema260"
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
      "$ref": "#/definitions/__schema255"
    },
    "size": {
      "$ref": "#/definitions/menuImageSize"
    },
    "alignment": {
      "$ref": "#/definitions/__schema258"
    },
    "indent": {
      "$ref": "#/definitions/__schema259"
    },
    "altText": {
      "$ref": "#/definitions/__schema260"
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
["__schema255"]: {
  "type": "string",
  "minLength": 1
},
["menuImageSize"]: {
  "type": "object",
  "properties": {
    "mode": {
      "$ref": "#/definitions/__schema256"
    },
    "px": {
      "$ref": "#/definitions/__schema257"
    }
  },
  "required": [
    "mode",
    "px"
  ],
  "additionalProperties": false,
  "description": "Menu item image size settings."
},
["__schema256"]: {
  "type": "string",
  "enum": [
    "width",
    "height"
  ]
},
["__schema257"]: {
  "type": "integer",
  "minimum": 3,
  "maximum": 100
},
["__schema258"]: {
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ]
},
["__schema259"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 1000
},
["__schema260"]: {
  "type": "string",
  "maxLength": 500
},
["__schema261"]: {
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
      "$ref": "#/definitions/__schema91"
    },
    "type": {
      "$ref": "#/definitions/__schema262"
    },
    "settings": {
      "$ref": "#/definitions/__schema263"
    },
    "content": {
      "$ref": "#/definitions/__schema266"
    },
    "extension": {
      "$ref": "#/definitions/__schema267"
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
["__schema262"]: {
  "type": "string",
  "const": "unknown"
},
["__schema263"]: {
  "type": "object",
  "propertyNames": {
    "$ref": "#/definitions/__schema264"
  },
  "additionalProperties": {
    "$ref": "#/definitions/__schema265"
  }
},
["__schema264"]: {
  "type": "string"
},
["__schema265"]: {},
["__schema266"]: {
  "type": "string"
},
["__schema267"]: {
  "type": "boolean"
}
};

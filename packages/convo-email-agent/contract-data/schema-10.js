import value0 from './schema-2.js';
export default {
["__schema196"]: {
  "type": "object",
  "properties": {
    "mode": {
      "$ref": "#/definitions/__schema197"
    },
    "width": {
      "$ref": "#/definitions/__schema198"
    },
    "height": {
      "$ref": "#/definitions/__schema204"
    },
    "border": {
      "$ref": "#/definitions/__schema207"
    },
    "mobileBorder": {
      "$ref": "#/definitions/__schema210"
    },
    "alignment": {
      "$ref": "#/definitions/__schema212"
    },
    "backgroundColor": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    },
    "margins": {
      "$ref": "#/definitions/__schema213"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema112"
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
["__schema197"]: {
  "type": "string",
  "enum": [
    "line",
    "space"
  ]
},
["__schema198"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema199"
    },
    "mobile": {
      "$ref": "#/definitions/__schema203"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema199"]: {
  "type": "object",
  "properties": {
    "value": {
      "$ref": "#/definitions/__schema200"
    },
    "unit": {
      "$ref": "#/definitions/__schema201"
    }
  },
  "required": [
    "value",
    "unit"
  ],
  "additionalProperties": false
},
["__schema200"]: {
  "type": "integer",
  "minimum": 5,
  "maximum": 1000
},
["__schema201"]: {
  "type": "string",
  "enum": [
    "percent",
    "px"
  ]
},
["__schema202"]: {
  "type": "object",
  "properties": {
    "value": {
      "$ref": "#/definitions/__schema200"
    },
    "unit": {
      "$ref": "#/definitions/__schema201"
    }
  },
  "required": [
    "value",
    "unit"
  ],
  "additionalProperties": false
},
["__schema203"]: {
  "type": "object",
  "properties": {
    "value": {
      "$ref": "#/definitions/__schema200"
    },
    "unit": {
      "$ref": "#/definitions/__schema201"
    }
  },
  "required": [
    "value",
    "unit"
  ],
  "additionalProperties": false
},
["__schema204"]: {
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
  "additionalProperties": false
},
["__schema205"]: {
  "type": "integer",
  "minimum": 5,
  "maximum": 1000
},
["__schema206"]: {
  "type": "integer",
  "minimum": 5,
  "maximum": 1000
},
["__schema207"]: {
  "type": "object",
  "properties": {
    "size": {
      "$ref": "#/definitions/__schema209"
    },
    "style": {
      "$ref": "#/definitions/__schema37"
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
["__schema208"]: {
  "type": "object",
  "properties": {
    "size": {
      "$ref": "#/definitions/__schema209"
    },
    "style": {
      "$ref": "#/definitions/__schema37"
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
["__schema209"]: {
  "type": "integer",
  "minimum": 1,
  "maximum": 40
},
["__schema210"]: {
  "anyOf": [
    {
      "$ref": "#/definitions/__schema208"
    },
    {
      "type": "null"
    }
  ]
},
["__schema211"]: {
  "anyOf": [
    {
      "$ref": "#/definitions/__schema208"
    },
    {
      "type": "null"
    }
  ]
},
["__schema212"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema104"
    },
    "mobile": {
      "$ref": "#/definitions/__schema104"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema213"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema214"
    },
    "mobile": {
      "$ref": "#/definitions/__schema214"
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
    "top": {
      "$ref": "#/definitions/__schema215"
    },
    "right": {
      "$ref": "#/definitions/__schema216"
    },
    "bottom": {
      "$ref": "#/definitions/__schema217"
    },
    "left": {
      "$ref": "#/definitions/__schema218"
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
["__schema215"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 1000
},
["__schema216"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 1000
},
["__schema217"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 1000
},
["__schema218"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 1000
},
["menuBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema75"
    },
    "type": {
      "$ref": "#/definitions/__schema219"
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
  "additionalProperties": false,
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
  }
},
["__schema219"]: {
  "type": "string",
  "const": "menu"
},
["menuBlockSettings"]: {
  "type": "object",
  "properties": {
    "responsiveMenu": {
      "$ref": "#/definitions/__schema220"
    },
    "itemType": {
      "$ref": "#/definitions/__schema221"
    },
    "fitToContainer": {
      "$ref": "#/definitions/__schema224"
    },
    "itemPadding": {
      "$ref": "#/definitions/__schema225"
    },
    "margins": {
      "$ref": "#/definitions/__schema225"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema112"
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
      "$ref": "#/definitions/menuTextStyle"
    },
    "colors": {
      "$ref": "#/definitions/__schema232"
    },
    "items": {
      "$ref": "#/definitions/__schema235"
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
["__schema220"]: {
  "type": "boolean"
},
["__schema221"]: {
  "oneOf": [
    {
      "$ref": "#/definitions/__schema222"
    },
    {
      "$ref": "#/definitions/__schema223"
    }
  ]
},
["__schema222"]: {
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
["__schema223"]: {
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
["__schema224"]: {
  "type": "boolean"
},
["__schema225"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema226"
    },
    "mobile": {
      "$ref": "#/definitions/__schema226"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema226"]: {
  "type": "object",
  "properties": {
    "top": {
      "$ref": "#/definitions/__schema227"
    },
    "right": {
      "$ref": "#/definitions/__schema227"
    },
    "bottom": {
      "$ref": "#/definitions/__schema227"
    },
    "left": {
      "$ref": "#/definitions/__schema227"
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
["__schema227"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["menuSeparator"]: {
  "type": "object",
  "properties": {
    "width": {
      "$ref": "#/definitions/__schema228"
    },
    "style": {
      "$ref": "#/definitions/__schema229"
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
["__schema228"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 20
},
["__schema229"]: {
  "type": "string",
  "enum": [
    "none",
    "line",
    "dashed",
    "dotted"
  ]
},
["menuTextStyle"]: {
  "type": "object",
  "properties": {
    "bold": {
      "$ref": "#/definitions/__schema191"
    },
    "italic": {
      "$ref": "#/definitions/__schema192"
    },
    "underline": {
      "$ref": "#/definitions/__schema230"
    }
  },
  "required": [
    "bold",
    "italic"
  ],
  "additionalProperties": false,
  "description": "Menu text style settings."
},
["__schema230"]: {
  "type": "boolean"
},
["__schema231"]: {
  "type": "boolean"
},
["__schema232"]: {
  "oneOf": [
    {
      "$ref": "#/definitions/__schema233"
    },
    {
      "$ref": "#/definitions/__schema234"
    }
  ]
},
["__schema233"]: {
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
["__schema234"]: {
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
["__schema235"]: {
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
      "$ref": "#/definitions/__schema236"
    },
    "name": {
      "$ref": "#/definitions/__schema237"
    },
    "link": {
      "$ref": "#/definitions/menuLink"
    },
    "image": {
      "$ref": "#/definitions/__schema240"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "colors": {
      "$ref": "#/definitions/__schema247"
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
["__schema236"]: {
  "type": "string",
  "enum": [
    "links",
    "icons",
    "linksWithIcons"
  ],
  "description": "Menu item type: links, icons, or links with icons."
},
["__schema237"]: {
  "type": "string",
  "maxLength": 500
},
["menuLink"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema238"
    },
    "value": {
      "$ref": "#/definitions/__schema239"
    }
  },
  "required": [
    "type",
    "value"
  ],
  "additionalProperties": false,
  "description": "Menu item link type and URL/value."
},
["__schema238"]: {
  "type": "string",
  "enum": [
    "site",
    "email",
    "phone",
    "anchor"
  ]
},
["__schema239"]: {
  "type": "string"
},
["__schema240"]: {
  "type": "object",
  "properties": {
    "src": {
      "$ref": "#/definitions/__schema241"
    },
    "size": {
      "$ref": "#/definitions/menuImageSize"
    },
    "alignment": {
      "$ref": "#/definitions/__schema244"
    },
    "indent": {
      "$ref": "#/definitions/__schema245"
    },
    "altText": {
      "$ref": "#/definitions/__schema246"
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
      "$ref": "#/definitions/__schema241"
    },
    "size": {
      "$ref": "#/definitions/menuImageSize"
    },
    "alignment": {
      "$ref": "#/definitions/__schema244"
    },
    "indent": {
      "$ref": "#/definitions/__schema245"
    },
    "altText": {
      "$ref": "#/definitions/__schema246"
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
["__schema241"]: {
  "type": "string",
  "minLength": 1
},
["menuImageSize"]: {
  "type": "object",
  "properties": {
    "mode": {
      "$ref": "#/definitions/__schema242"
    },
    "px": {
      "$ref": "#/definitions/__schema243"
    }
  },
  "required": [
    "mode",
    "px"
  ],
  "additionalProperties": false,
  "description": "Menu item image size settings."
},
["__schema242"]: {
  "type": "string",
  "enum": [
    "width",
    "height"
  ]
},
["__schema243"]: {
  "type": "integer",
  "minimum": 3,
  "maximum": 100
},
["__schema244"]: {
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ]
},
["__schema245"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 1000
},
["__schema246"]: {
  "type": "string",
  "maxLength": 500
},
["__schema247"]: {
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
      "$ref": "#/definitions/__schema75"
    },
    "type": {
      "$ref": "#/definitions/__schema248"
    },
    "settings": {
      "$ref": "#/definitions/__schema249"
    },
    "content": {
      "$ref": "#/definitions/__schema252"
    },
    "extension": {
      "$ref": "#/definitions/__schema253"
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
["__schema248"]: {
  "type": "string",
  "const": "unknown"
},
["__schema249"]: {
  "type": "object",
  "propertyNames": {
    "$ref": "#/definitions/__schema250"
  },
  "additionalProperties": {
    "$ref": "#/definitions/__schema251"
  }
},
["__schema250"]: {
  "type": "string"
},
["__schema251"]: {},
["__schema252"]: {
  "type": "string"
},
["__schema253"]: {
  "type": "boolean"
}
};

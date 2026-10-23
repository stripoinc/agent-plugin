import value0 from './schema-2.js';
export default {
["__schema51"]: {
  "type": [
    "boolean",
    "string"
  ]
},
["__schema52"]: {
  "type": "string"
},
["__schema53"]: {
  "type": "string"
},
["__schema54"]: {
  "type": "string"
},
["__schema55"]: {
  "type": "string"
},
["__schema56"]: {
  "type": "string"
},
["__schema57"]: {
  "type": "string"
},
["__schema58"]: {
  "type": "object",
  "properties": {
    "top": {
      "$ref": "#/definitions/borderSide"
    },
    "right": {
      "$ref": "#/definitions/borderSide"
    },
    "bottom": {
      "$ref": "#/definitions/borderSide"
    },
    "left": {
      "$ref": "#/definitions/borderSide"
    },
    "style": {
      "$ref": "#/definitions/__schema60"
    }
  },
  "required": [
    "top",
    "right",
    "bottom",
    "left",
    "style"
  ],
  "additionalProperties": false,
  "description": "Border configuration for all sides and shared style."
},
["border"]: {
  "type": "object",
  "properties": {
    "top": {
      "$ref": "#/definitions/borderSide"
    },
    "right": {
      "$ref": "#/definitions/borderSide"
    },
    "bottom": {
      "$ref": "#/definitions/borderSide"
    },
    "left": {
      "$ref": "#/definitions/borderSide"
    },
    "style": {
      "$ref": "#/definitions/__schema60"
    }
  },
  "required": [
    "top",
    "right",
    "bottom",
    "left",
    "style"
  ],
  "additionalProperties": false,
  "description": "Border configuration for all sides and shared style."
},
["borderSide"]: {
  "type": "object",
  "properties": {
    "width": {
      "$ref": "#/definitions/__schema59"
    },
    "color": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    }
  },
  "required": [
    "width",
    "color"
  ],
  "additionalProperties": false,
  "description": "Border settings for a single side."
},
["__schema59"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 100
},
["__schema60"]: {
  "type": "string",
  "enum": [
    "solid",
    "dashed",
    "dotted"
  ]
},
["__schema61"]: {
  "type": "number"
},
["__schema62"]: {
  "minItems": 1,
  "type": "array",
  "items": {
    "$ref": "#/definitions/structure"
  }
},
["structure"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema63"
    },
    "settings": {
      "$ref": "#/definitions/__schema64"
    },
    "moduleId": {
      "$ref": "#/definitions/__schema79",
      "readOnly": true
    },
    "columns": {
      "$ref": "#/definitions/__schema80"
    }
  },
  "required": [
    "id"
  ],
  "additionalProperties": false,
  "description": "Structure that groups columns.",
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
["__schema63"]: {
  "type": "string",
  "minLength": 1
},
["__schema64"]: {
  "type": "object",
  "properties": {
    "backgroundColor": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    },
    "backgroundImage": {
      "$ref": "#/definitions/__schema65"
    },
    "border": {
      "$ref": "#/definitions/border"
    },
    "borderRadius": {
      "$ref": "#/definitions/borderRadius"
    },
    "columnsGap": {
      "$ref": "#/definitions/__schema70"
    },
    "responsiveMobile": {
      "$ref": "#/definitions/__schema73"
    },
    "responsiveMobileContainersInversion": {
      "$ref": "#/definitions/__schema74"
    },
    "padding": {
      "$ref": "#/definitions/__schema75"
    },
    "margins": {
      "$ref": "#/definitions/__schema76"
    },
    "includeInOutput": {
      "$ref": "#/definitions/__schema77"
    },
    "hideElement": {
      "$ref": "#/definitions/__schema78"
    }
  },
  "required": [
    "backgroundColor",
    "border",
    "borderRadius"
  ],
  "additionalProperties": false
},
["__schema65"]: {
  "type": "object",
  "properties": {
    "path": {
      "$ref": "#/definitions/__schema49"
    },
    "repeat": {
      "type": "boolean"
    },
    "x": {
      "$ref": "#/definitions/__schema52"
    },
    "y": {
      "$ref": "#/definitions/__schema53"
    },
    "sizeX": {
      "type": "string"
    },
    "sizeY": {
      "type": "string"
    }
  },
  "required": [
    "path",
    "repeat",
    "x",
    "y",
    "sizeX",
    "sizeY"
  ],
  "additionalProperties": false,
  "description": "Background image settings."
},
["borderRadius"]: {
  "type": "object",
  "properties": {
    "topLeft": {
      "$ref": "#/definitions/__schema66"
    },
    "topRight": {
      "$ref": "#/definitions/__schema67"
    },
    "bottomRight": {
      "$ref": "#/definitions/__schema68"
    },
    "bottomLeft": {
      "$ref": "#/definitions/__schema69"
    }
  },
  "required": [
    "topLeft",
    "topRight",
    "bottomRight",
    "bottomLeft"
  ],
  "additionalProperties": false,
  "description": "Border radius values for each corner."
},
["__schema66"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema67"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema68"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema69"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema70"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema71"
    },
    "mobile": {
      "$ref": "#/definitions/__schema72"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false,
  "description": "Responsive numeric values for desktop and mobile."
},
["responsiveNumber"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema71"
    },
    "mobile": {
      "$ref": "#/definitions/__schema72"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false,
  "description": "Responsive numeric values for desktop and mobile."
},
["__schema71"]: {
  "type": "number"
},
["__schema72"]: {
  "type": "number"
},
["__schema73"]: {
  "type": "boolean"
},
["__schema74"]: {
  "type": "boolean"
},
["__schema75"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/fullSideValues"
    },
    "mobile": {
      "$ref": "#/definitions/fullSideValues"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false,
  "description": "Responsive top, right, bottom, and left side values for desktop and mobile."
},
["responsivePadding"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/fullSideValues"
    },
    "mobile": {
      "$ref": "#/definitions/fullSideValues"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false,
  "description": "Responsive top, right, bottom, and left side values for desktop and mobile."
},
["__schema76"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/fullSideValues"
    },
    "mobile": {
      "$ref": "#/definitions/fullSideValues"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false,
  "description": "Responsive top, right, bottom, and left side values for desktop and mobile."
},
["__schema77"]: {
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "description": "Include in email output formats: both, html, or ampHtml."
},
["__schema78"]: {
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "description": "Hide element mode: no, desktop, or mobile."
},
["__schema79"]: {
  "type": "number"
},
["__schema80"]: {
  "minItems": 1,
  "maxItems": 11,
  "type": "array",
  "items": {
    "$ref": "#/definitions/column"
  }
},
["column"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema81"
    },
    "settings": {
      "$ref": "#/definitions/__schema82"
    },
    "containers": {
      "$ref": "#/definitions/__schema84"
    }
  },
  "required": [
    "id",
    "containers"
  ],
  "additionalProperties": false,
  "description": "Structure column that groups one or more containers.",
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
["__schema81"]: {
  "type": "string",
  "minLength": 1
},
["__schema82"]: {
  "type": "object",
  "properties": {
    "width": {
      "$ref": "#/definitions/__schema83",
      "description": "Informational column width. In setDocumentState this value is treated as a ratio weight rather than absolute pixels. The actual widths in the resulting email can differ from the values passed in the schema. getDocumentState returns the current absolute widths in px."
    }
  },
  "required": [
    "width"
  ],
  "additionalProperties": false
},
["__schema83"]: {
  "type": "number"
},
["__schema84"]: {
  "minItems": 1,
  "type": "array",
  "items": {
    "$ref": "#/definitions/container"
  }
},
["container"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema85"
    },
    "settings": {
      "$ref": "#/definitions/__schema86"
    },
    "moduleId": {
      "$ref": "#/definitions/__schema88",
      "readOnly": true
    },
    "blocks": {
      "$ref": "#/definitions/__schema89"
    }
  },
  "required": [
    "id",
    "settings"
  ],
  "description": "Container that groups blocks.",
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
["__schema85"]: {
  "type": "string",
  "minLength": 1
},
["__schema86"]: {
  "type": "object",
  "properties": {
    "padding": {
      "$ref": "#/definitions/responsivePadding"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "backgroundColor": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    },
    "backgroundImage": {
      "$ref": "#/definitions/__schema87"
    },
    "border": {
      "$ref": "#/definitions/border"
    },
    "radius": {
      "$ref": "#/definitions/borderRadius"
    }
  },
  "required": [
    "padding",
    "includeInOutput",
    "hideElement",
    "backgroundColor",
    "border",
    "radius"
  ],
  "additionalProperties": false
},
["__schema87"]: {
  "type": "object",
  "properties": {
    "path": {
      "$ref": "#/definitions/__schema49"
    },
    "repeat": {
      "type": "boolean"
    },
    "x": {
      "$ref": "#/definitions/__schema52"
    },
    "y": {
      "$ref": "#/definitions/__schema53"
    },
    "sizeX": {
      "type": "string"
    },
    "sizeY": {
      "type": "string"
    }
  },
  "required": [
    "path",
    "repeat",
    "x",
    "y",
    "sizeX",
    "sizeY"
  ],
  "additionalProperties": false,
  "description": "Background image settings."
},
["__schema88"]: {
  "type": "number"
},
["__schema89"]: {
  "type": "array",
  "items": {
    "$ref": "#/definitions/block"
  }
},
["block"]: {
  "oneOf": [
    {
      "$ref": "#/definitions/textBlock"
    },
    {
      "$ref": "#/definitions/imageBlock"
    },
    {
      "$ref": "#/definitions/videoBlock"
    },
    {
      "$ref": "#/definitions/timerBlock"
    },
    {
      "$ref": "#/definitions/socialBlock"
    },
    {
      "$ref": "#/definitions/htmlBlock"
    },
    {
      "$ref": "#/definitions/buttonBlock"
    },
    {
      "$ref": "#/definitions/spacerBlock"
    },
    {
      "$ref": "#/definitions/menuBlock"
    },
    {
      "$ref": "#/definitions/unknownBlock"
    }
  ]
},
["textBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema90"
    },
    "type": {
      "$ref": "#/definitions/__schema91"
    },
    "settings": {
      "$ref": "#/definitions/__schema92"
    },
    "content": {
      "$ref": "#/definitions/__schema103"
    }
  },
  "required": [
    "id",
    "type"
  ],
  "description": "Text block.",
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
["__schema90"]: {
  "type": "string",
  "minLength": 1
},
["__schema91"]: {
  "type": "string",
  "const": "text"
},
["__schema92"]: {
  "type": "object",
  "properties": {
    "fontColor": {
      "type": "string",
      "description": "Valid CSS color value that does not allow transparency."
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "rightToLeftTextDirection": {
      "type": "boolean"
    },
    "alignment": {
      "type": "object",
      "properties": {
        "desktop": {
          "$ref": "#/definitions/__schema93"
        },
        "mobile": {
          "$ref": "#/definitions/__schema93"
        }
      },
      "required": [
        "desktop",
        "mobile"
      ],
      "additionalProperties": false
    },
    "fixedHeight": {
      "type": "object",
      "properties": {
        "desktop": {
          "$ref": "#/definitions/__schema94"
        },
        "mobile": {
          "$ref": "#/definitions/__schema98"
        }
      },
      "additionalProperties": false,
      "minProperties": 1,
      "description": "Text block fixed height settings. Desktop and mobile are independent; an absent mode disables it and absence of fixedHeight disables both."
    },
    "padding": {
      "type": "object",
      "properties": {
        "desktop": {
          "$ref": "#/definitions/__schema99"
        },
        "mobile": {
          "$ref": "#/definitions/__schema99"
        }
      },
      "required": [
        "desktop",
        "mobile"
      ],
      "additionalProperties": false
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "backgroundColor": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    },
    "letterSpacing": {
      "type": "object",
      "properties": {
        "value": {
          "$ref": "#/definitions/__schema101"
        },
        "unit": {
          "$ref": "#/definitions/__schema102"
        }
      },
      "required": [
        "value",
        "unit"
      ],
      "additionalProperties": false,
      "description": "Spacing value with a numeric value and unit."
    }
  },
  "required": [
    "hideElement",
    "rightToLeftTextDirection",
    "padding",
    "includeInOutput",
    "backgroundColor"
  ],
  "additionalProperties": false
},
["colorValueDisallowTransparent"]: {
  "type": "string",
  "description": "Valid CSS color value that does not allow transparency."
},
["__schema93"]: {
  "type": "string",
  "enum": [
    "left",
    "center",
    "right",
    "justify"
  ]
},
["__schema94"]: {
  "type": "object",
  "properties": {
    "height": {
      "$ref": "#/definitions/__schema96"
    },
    "verticalAlignment": {
      "$ref": "#/definitions/__schema97"
    }
  },
  "required": [
    "height"
  ],
  "additionalProperties": false,
  "description": "Text fixed-height mode. Omitted verticalAlignment preserves the previous effective alignment; top is used when none exists."
},
["__schema95"]: {
  "type": "object",
  "properties": {
    "height": {
      "$ref": "#/definitions/__schema96"
    },
    "verticalAlignment": {
      "$ref": "#/definitions/__schema97"
    }
  },
  "required": [
    "height"
  ],
  "additionalProperties": false
},
["__schema96"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 9007199254740991
},
["__schema97"]: {
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ]
},
["__schema98"]: {
  "type": "object",
  "properties": {
    "height": {
      "$ref": "#/definitions/__schema96"
    },
    "verticalAlignment": {
      "$ref": "#/definitions/__schema97"
    }
  },
  "required": [
    "height"
  ],
  "additionalProperties": false,
  "description": "Text fixed-height mode. Omitted verticalAlignment preserves the previous effective alignment; top is used when none exists."
},
["__schema99"]: {
  "type": "object",
  "properties": {
    "top": {
      "$ref": "#/definitions/__schema100"
    },
    "right": {
      "$ref": "#/definitions/__schema100"
    },
    "bottom": {
      "$ref": "#/definitions/__schema100"
    },
    "left": {
      "$ref": "#/definitions/__schema100"
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
["__schema100"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["spacingValue"]: {
  "type": "object",
  "properties": {
    "value": {
      "$ref": "#/definitions/__schema101"
    },
    "unit": {
      "$ref": "#/definitions/__schema102"
    }
  },
  "required": [
    "value",
    "unit"
  ],
  "additionalProperties": false,
  "description": "Spacing value with a numeric value and unit."
},
["__schema101"]: {
  "type": "number"
},
["__schema102"]: {
  "type": "string",
  "enum": [
    "px",
    "em"
  ]
},
["__schema103"]: {
  "type": "string"
},
["imageBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema90"
    },
    "type": {
      "$ref": "#/definitions/__schema104"
    },
    "settings": {
      "$ref": "#/definitions/__schema105"
    }
  },
  "required": [
    "id",
    "type",
    "settings"
  ],
  "description": "Image block.",
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
["__schema104"]: {
  "type": "string",
  "const": "image"
},
["__schema105"]: {
  "type": "object",
  "properties": {
    "src": {
      "$ref": "#/definitions/__schema106"
    },
    "link": {
      "$ref": "#/definitions/__schema107"
    },
    "altText": {
      "$ref": "#/definitions/__schema111"
    },
    "size": {
      "$ref": "#/definitions/__schema114"
    },
    "alignment": {
      "$ref": "#/definitions/__schema118"
    },
    "radius": {
      "$ref": "#/definitions/__schema120"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "margins": {
      "$ref": "#/definitions/__schema121"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema127"
    },
    "responsiveMobile": {
      "$ref": "#/definitions/__schema128"
    }
  },
  "required": [
    "src",
    "altText",
    "size",
    "alignment",
    "radius",
    "hideElement",
    "margins",
    "includeInOutput",
    "anchorLinkName",
    "responsiveMobile"
  ],
  "additionalProperties": false
},
["__schema106"]: {
  "type": "string"
},
["__schema107"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema109"
    },
    "href": {
      "$ref": "#/definitions/__schema110"
    }
  },
  "required": [
    "type",
    "href"
  ],
  "additionalProperties": false
},
["__schema108"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema109"
    },
    "href": {
      "$ref": "#/definitions/__schema110"
    }
  },
  "required": [
    "type",
    "href"
  ],
  "additionalProperties": false
},
["__schema109"]: {
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
  ]
},
["__schema110"]: {
  "type": "string",
  "minLength": 1
},
["__schema111"]: {
  "type": "object",
  "properties": {
    "text": {
      "$ref": "#/definitions/__schema112"
    },
    "addToTitle": {
      "$ref": "#/definitions/__schema113"
    }
  },
  "required": [
    "text",
    "addToTitle"
  ],
  "additionalProperties": false
},
["__schema112"]: {
  "type": "string",
  "maxLength": 500
},
["__schema113"]: {
  "type": "boolean"
},
["__schema114"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema115"
    },
    "mobile": {
      "$ref": "#/definitions/__schema115"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema115"]: {
  "type": "object",
  "properties": {
    "mode": {
      "$ref": "#/definitions/__schema116"
    },
    "px": {
      "$ref": "#/definitions/__schema117"
    }
  },
  "required": [
    "mode",
    "px"
  ],
  "additionalProperties": false
},
["__schema116"]: {
  "type": "string",
  "enum": [
    "width",
    "height"
  ]
},
["__schema117"]: {
  "type": "integer",
  "minimum": 3,
  "maximum": 9007199254740991
},
["__schema118"]: {
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
["__schema119"]: {
  "type": "string",
  "enum": [
    "left",
    "center",
    "right"
  ]
},
["__schema120"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/borderRadius"
    },
    "mobile": {
      "$ref": "#/definitions/borderRadius"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema121"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema122"
    },
    "mobile": {
      "$ref": "#/definitions/__schema122"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema122"]: {
  "type": "object",
  "properties": {
    "top": {
      "$ref": "#/definitions/__schema123"
    },
    "right": {
      "$ref": "#/definitions/__schema124"
    },
    "bottom": {
      "$ref": "#/definitions/__schema125"
    },
    "left": {
      "$ref": "#/definitions/__schema126"
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
["__schema123"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema124"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema125"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema126"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema127"]: {
  "type": "string",
  "maxLength": 150
},
["__schema128"]: {
  "type": "boolean"
},
["videoBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema90"
    },
    "type": {
      "$ref": "#/definitions/__schema129"
    },
    "settings": {
      "$ref": "#/definitions/videoBlockSettings"
    }
  },
  "required": [
    "id",
    "type",
    "settings"
  ],
  "description": "Video block.",
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
      "mergeService": [
        "VIDEO_PREVIEW"
      ]
    },
    "delete": {
      "browser": [],
      "mergeService": []
    },
    "update": {
      "browser": [],
      "mergeService": [
        "VIDEO_PREVIEW"
      ]
    },
    "move": {
      "browser": [],
      "mergeService": []
    }
  },
  "additionalProperties": false
},
["__schema129"]: {
  "type": "string",
  "const": "video"
},
["videoBlockSettings"]: {
  "type": "object",
  "properties": {
    "videoLink": {
      "$ref": "#/definitions/__schema130"
    },
    "altText": {
      "$ref": "#/definitions/__schema111"
    },
    "customThumbnail": {
      "$ref": "#/definitions/__schema131"
    },
    "playButtonStyle": {
      "$ref": "#/definitions/__schema133"
    },
    "size": {
      "$ref": "#/definitions/__schema114"
    },
    "alignment": {
      "$ref": "#/definitions/__schema118"
    },
    "radius": {
      "$ref": "#/definitions/__schema120"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "paddings": {
      "$ref": "#/definitions/__schema134"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema127"
    },
    "responsiveMobile": {
      "$ref": "#/definitions/__schema135"
    }
  },
  "required": [
    "videoLink",
    "altText",
    "playButtonStyle",
    "size",
    "alignment",
    "radius",
    "hideElement",
    "paddings",
    "includeInOutput",
    "anchorLinkName",
    "responsiveMobile"
  ],
  "additionalProperties": false,
  "description": "Video block settings."
},
["__schema130"]: {
  "type": "string"
},
["__schema131"]: {
  "type": "object",
  "properties": {
    "src": {
      "$ref": "#/definitions/__schema132"
    }
  },
  "required": [
    "src"
  ],
  "additionalProperties": false,
  "description": "Custom thumbnail settings for a video block. Absence disables custom thumbnail."
},
["videoCustomThumbnail"]: {
  "type": "object",
  "properties": {
    "src": {
      "$ref": "#/definitions/__schema132"
    }
  },
  "required": [
    "src"
  ],
  "additionalProperties": false,
  "description": "Custom thumbnail settings for a video block. Absence disables custom thumbnail."
},
["__schema132"]: {
  "type": "string"
},
["__schema133"]: {
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
  ]
},
["__schema134"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema122"
    },
    "mobile": {
      "$ref": "#/definitions/__schema122"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema135"]: {
  "type": "boolean"
},
["timerBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema90"
    },
    "type": {
      "$ref": "#/definitions/__schema136"
    },
    "settings": {
      "$ref": "#/definitions/timerBlockSettings"
    }
  },
  "required": [
    "id",
    "type",
    "settings"
  ],
  "description": "Timer block.",
  "x-stripo-setDocumentState": {
    "insert": "unsupported",
    "delete": "unsupported",
    "update": "supported",
    "move": "unsupported"
  },
  "x-stripo-setDocumentStateRuntimes": {
    "insert": {
      "browser": false,
      "mergeService": false
    },
    "delete": {
      "browser": false,
      "mergeService": false
    },
    "update": {
      "browser": true,
      "mergeService": true
    },
    "move": {
      "browser": false,
      "mergeService": false
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
      "mergeService": [
        "TIMER_PREVIEW"
      ]
    },
    "move": {
      "browser": [],
      "mergeService": []
    }
  },
  "additionalProperties": false
},
["__schema136"]: {
  "type": "string",
  "const": "timer"
},
["timerBlockSettings"]: {
  "type": "object",
  "properties": {
    "altText": {
      "$ref": "#/definitions/__schema111"
    },
    "responsiveMobile": {
      "$ref": "#/definitions/__schema137"
    },
    "size": {
      "$ref": "#/definitions/__schema114"
    },
    "alignment": {
      "$ref": "#/definitions/__schema118"
    },
    "margins": {
      "$ref": "#/definitions/__schema121"
    },
    "endDate": {
      "$ref": "#/definitions/__schema138"
    },
    "timeZone": {
      "$ref": "#/definitions/__schema139"
    },
    "link": {
      "$ref": "#/definitions/__schema140"
    },
    "displayDays": {
      "$ref": "#/definitions/__schema141"
    },
    "labelsLetterCase": {
      "$ref": "#/definitions/__schema142"
    },
    "separator": {
      "$ref": "#/definitions/__schema143"
    },
    "labelsLanguage": {
      "$ref": "#/definitions/__schema144"
    },
    "retinaDisplaySupport": {
      "$ref": "#/definitions/__schema145"
    },
    "expirationImageSrc": {
      "$ref": "#/definitions/__schema106"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema127"
    },
    "digitsFontFamily": {
      "$ref": "#/definitions/__schema146"
    },
    "digitsFontSize": {
      "$ref": "#/definitions/__schema147"
    },
    "digitsFontColor": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "digitsAdvancedColorSettings": {
      "$ref": "#/definitions/__schema148"
    },
    "labelsFontFamily": {
      "$ref": "#/definitions/__schema146"
    },
    "labelsFontSize": {
      "$ref": "#/definitions/__schema147"
    },
    "labelsFontColor": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "labelsAdvancedColorSettings": {
      "$ref": "#/definitions/__schema150"
    },
    "separatorFontFamily": {
      "$ref": "#/definitions/__schema146"
    },
    "separatorFontSize": {
      "$ref": "#/definitions/__schema147"
    },
    "separatorFontColor": {
      "$ref": "#/definitions/colorValueDisallowTransparent"
    },
    "backgroundColor": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    }
  },
  "required": [
    "altText",
    "responsiveMobile",
    "size",
    "alignment",
    "margins",
    "endDate",
    "timeZone",
    "link",
    "displayDays",
    "separator",
    "labelsLanguage",
    "retinaDisplaySupport",
    "expirationImageSrc",
    "hideElement",
    "includeInOutput",
    "anchorLinkName",
    "digitsFontFamily",
    "digitsFontSize",
    "digitsFontColor",
    "labelsFontFamily",
    "labelsFontSize",
    "labelsFontColor",
    "separatorFontFamily",
    "separatorFontSize",
    "separatorFontColor",
    "backgroundColor"
  ],
  "additionalProperties": false,
  "description": "Timer block settings."
},
["__schema137"]: {
  "type": "boolean"
},
["__schema138"]: {
  "type": "string"
},
["__schema139"]: {
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
  ]
},
["__schema140"]: {
  "anyOf": [
    {
      "$ref": "#/definitions/__schema108"
    },
    {
      "type": "null"
    }
  ]
},
["__schema141"]: {
  "type": "boolean"
},
["__schema142"]: {
  "type": "string",
  "enum": [
    "CAPITALIZE",
    "UPPER",
    "LOWER"
  ]
},
["__schema143"]: {
  "type": "string",
  "maxLength": 100
},
["__schema144"]: {
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
  ]
},
["__schema145"]: {
  "type": "boolean"
},
["__schema146"]: {
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
  ]
},
["__schema147"]: {
  "type": "integer",
  "minimum": 8,
  "maximum": 72
},
["__schema148"]: {
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
["__schema149"]: {
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
["__schema150"]: {
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
      "$ref": "#/definitions/__schema90"
    },
    "type": {
      "$ref": "#/definitions/__schema151"
    },
    "settings": {
      "$ref": "#/definitions/__schema152"
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
["__schema151"]: {
  "type": "string",
  "const": "social"
}
};

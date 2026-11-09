import value0 from './schema-2.js';
export default {
["__schema0"]: {
  "type": "object",
  "properties": {
    "title": {
      "$ref": "#/definitions/__schema1",
      "description": "Email <head><title> value. Changed values are limited to 500 UTF-16 code units.",
      "x-stripo-setDocumentState": {
        "insert": "supported",
        "delete": "unsupported",
        "update": "supported",
        "move": "unsupported"
      },
      "x-stripo-setDocumentStateRuntimes": {
        "insert": {
          "browser": true,
          "mergeService": true
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
          "mergeService": []
        },
        "move": {
          "browser": [],
          "mergeService": []
        }
      }
    },
    "preheader": {
      "$ref": "#/definitions/__schema2",
      "x-stripo-setDocumentState": {
        "insert": "supported",
        "delete": "unsupported",
        "update": "supported",
        "move": "unsupported"
      },
      "x-stripo-setDocumentStateRuntimes": {
        "insert": {
          "browser": true,
          "mergeService": true
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
          "mergeService": []
        },
        "move": {
          "browser": [],
          "mergeService": []
        }
      }
    }
  },
  "additionalProperties": false,
  "description": "Patch-compatible document metadata: omitted fields preserve their current values; preheader requires both fields."
},
["documentMetadata"]: {
  "type": "object",
  "properties": {
    "title": {
      "$ref": "#/definitions/__schema1",
      "description": "Email <head><title> value. Changed values are limited to 500 UTF-16 code units.",
      "x-stripo-setDocumentState": {
        "insert": "supported",
        "delete": "unsupported",
        "update": "supported",
        "move": "unsupported"
      },
      "x-stripo-setDocumentStateRuntimes": {
        "insert": {
          "browser": true,
          "mergeService": true
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
          "mergeService": []
        },
        "move": {
          "browser": [],
          "mergeService": []
        }
      }
    },
    "preheader": {
      "$ref": "#/definitions/__schema2",
      "x-stripo-setDocumentState": {
        "insert": "supported",
        "delete": "unsupported",
        "update": "supported",
        "move": "unsupported"
      },
      "x-stripo-setDocumentStateRuntimes": {
        "insert": {
          "browser": true,
          "mergeService": true
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
          "mergeService": []
        },
        "move": {
          "browser": [],
          "mergeService": []
        }
      }
    }
  },
  "additionalProperties": false,
  "description": "Patch-compatible document metadata: omitted fields preserve their current values; preheader requires both fields."
},
["__schema1"]: {
  "type": "string"
},
["__schema2"]: {
  "type": "object",
  "properties": {
    "text": {
      "$ref": "#/definitions/__schema3"
    },
    "fillSpace": {
      "$ref": "#/definitions/__schema4"
    }
  },
  "required": [
    "text",
    "fillSpace"
  ],
  "additionalProperties": false,
  "description": "Hidden preheader semantic value."
},
["documentMetadataPreheader"]: {
  "type": "object",
  "properties": {
    "text": {
      "$ref": "#/definitions/__schema3"
    },
    "fillSpace": {
      "$ref": "#/definitions/__schema4"
    }
  },
  "required": [
    "text",
    "fillSpace"
  ],
  "additionalProperties": false,
  "description": "Hidden preheader semantic value."
},
["__schema3"]: {
  "type": "string"
},
["__schema4"]: {
  "type": "boolean"
},
["__schema5"]: {
  "type": "object",
  "properties": {
    "fonts": {
      "$ref": "#/definitions/__schema6",
      "x-stripo-setDocumentState": {
        "insert": "supported",
        "delete": "supported",
        "update": "supported",
        "move": "unsupported"
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
          "mergeService": []
        },
        "move": {
          "browser": [],
          "mergeService": []
        }
      }
    }
  },
  "additionalProperties": false
},
["documentResources"]: {
  "type": "object",
  "properties": {
    "fonts": {
      "$ref": "#/definitions/__schema6",
      "x-stripo-setDocumentState": {
        "insert": "supported",
        "delete": "supported",
        "update": "supported",
        "move": "unsupported"
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
          "mergeService": []
        },
        "move": {
          "browser": [],
          "mergeService": []
        }
      }
    }
  },
  "additionalProperties": false
},
["__schema6"]: {
  "type": "array",
  "items": {
    "$ref": "#/definitions/fontResource"
  }
},
["fontResource"]: {
  "oneOf": [
    {
      "$ref": "#/definitions/__schema7"
    },
    {
      "$ref": "#/definitions/__schema9"
    },
    {
      "$ref": "#/definitions/__schema10"
    }
  ],
  "description": "Used custom font connection. fontFace CSS is ready to inline, with an optional source URL; local is unsupported."
},
["__schema7"]: {
  "type": "object",
  "properties": {
    "fontFamily": {
      "$ref": "#/definitions/__schema8"
    },
    "importMethod": {
      "type": "string",
      "const": "link"
    },
    "url": {
      "type": "string",
      "minLength": 1
    }
  },
  "required": [
    "fontFamily",
    "importMethod",
    "url"
  ],
  "additionalProperties": false
},
["__schema8"]: {
  "type": "string",
  "minLength": 1
},
["__schema9"]: {
  "type": "object",
  "properties": {
    "fontFamily": {
      "$ref": "#/definitions/__schema8"
    },
    "importMethod": {
      "type": "string",
      "const": "import"
    },
    "url": {
      "type": "string",
      "minLength": 1
    }
  },
  "required": [
    "fontFamily",
    "importMethod",
    "url"
  ],
  "additionalProperties": false
},
["__schema10"]: {
  "type": "object",
  "properties": {
    "fontFamily": {
      "$ref": "#/definitions/__schema8"
    },
    "importMethod": {
      "type": "string",
      "const": "fontFace"
    },
    "url": {
      "type": "string"
    },
    "css": {
      "type": "string",
      "minLength": 1
    }
  },
  "required": [
    "fontFamily",
    "importMethod",
    "css"
  ],
  "additionalProperties": false
},
["__schema11"]: value0,
["__schema12"]: {
  "type": "array",
  "items": {
    "$ref": "#/definitions/stripe"
  }
},
["__schema13"]: {
  "type": "array",
  "items": {
    "$ref": "#/definitions/stripe"
  }
},
["stripe"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema14"
    },
    "settings": {
      "$ref": "#/definitions/__schema15"
    },
    "moduleId": {
      "$ref": "#/definitions/__schema42",
      "readOnly": true
    },
    "structures": {
      "$ref": "#/definitions/__schema43"
    }
  },
  "required": [
    "id"
  ],
  "additionalProperties": false,
  "description": "Stripe that groups structures.",
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
["__schema14"]: {
  "type": "string",
  "minLength": 1
},
["__schema15"]: {
  "type": "object",
  "properties": {
    "messageArea": {
      "$ref": "#/definitions/__schema16"
    },
    "includeInOutput": {
      "$ref": "#/definitions/__schema17"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "padding": {
      "$ref": "#/definitions/__schema18"
    },
    "stripeBackgroundColor": {
      "$ref": "#/definitions/__schema23"
    },
    "contentBackgroundColor": {
      "$ref": "#/definitions/__schema24"
    },
    "backgroundImage": {
      "$ref": "#/definitions/__schema25"
    },
    "contentBorder": {
      "$ref": "#/definitions/__schema35"
    },
    "darkTheme": {
      "$ref": "#/definitions/__schema38"
    }
  },
  "required": [
    "hideElement"
  ],
  "additionalProperties": false,
  "description": "Stripe-level settings."
},
["stripeSettings"]: {
  "type": "object",
  "properties": {
    "messageArea": {
      "$ref": "#/definitions/__schema16"
    },
    "includeInOutput": {
      "$ref": "#/definitions/__schema17"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "padding": {
      "$ref": "#/definitions/__schema18"
    },
    "stripeBackgroundColor": {
      "$ref": "#/definitions/__schema23"
    },
    "contentBackgroundColor": {
      "$ref": "#/definitions/__schema24"
    },
    "backgroundImage": {
      "$ref": "#/definitions/__schema25"
    },
    "contentBorder": {
      "$ref": "#/definitions/__schema35"
    },
    "darkTheme": {
      "$ref": "#/definitions/__schema38"
    }
  },
  "required": [
    "hideElement"
  ],
  "additionalProperties": false,
  "description": "Stripe-level settings."
},
["__schema16"]: {
  "type": "string",
  "enum": [
    "header",
    "content",
    "footer",
    "infoArea"
  ]
},
["__schema17"]: {
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "description": "Include in email output formats: both, html, or ampHtml."
},
["outputInclusion"]: {
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "description": "Include in email output formats: both, html, or ampHtml."
},
["hideElement"]: {
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "description": "Hide element mode: no, desktop, or mobile."
},
["__schema18"]: {
  "type": "object",
  "properties": {
    "mobile": {
      "$ref": "#/definitions/fullSideValues"
    }
  },
  "required": [
    "mobile"
  ],
  "additionalProperties": false,
  "description": "Mobile-only top, right, bottom, and left side values."
},
["mobilePadding"]: {
  "type": "object",
  "properties": {
    "mobile": {
      "$ref": "#/definitions/fullSideValues"
    }
  },
  "required": [
    "mobile"
  ],
  "additionalProperties": false,
  "description": "Mobile-only top, right, bottom, and left side values."
},
["fullSideValues"]: {
  "type": "object",
  "properties": {
    "top": {
      "$ref": "#/definitions/__schema19"
    },
    "right": {
      "$ref": "#/definitions/__schema20"
    },
    "bottom": {
      "$ref": "#/definitions/__schema21"
    },
    "left": {
      "$ref": "#/definitions/__schema22"
    }
  },
  "required": [
    "top",
    "right",
    "bottom",
    "left"
  ],
  "additionalProperties": false,
  "description": "Numeric values for top, right, bottom, and left sides."
},
["__schema19"]: {
  "type": "number"
},
["__schema20"]: {
  "type": "number"
},
["__schema21"]: {
  "type": "number"
},
["__schema22"]: {
  "type": "number"
},
["__schema23"]: {
  "type": "string",
  "description": "Valid CSS color value that allows transparent values."
},
["colorValueAllowTransparent"]: {
  "type": "string",
  "description": "Valid CSS color value that allows transparent values."
},
["__schema24"]: {
  "type": "string",
  "description": "Valid CSS color value that allows transparent values."
},
["__schema25"]: {
  "type": "object",
  "properties": {
    "path": {
      "$ref": "#/definitions/__schema26"
    },
    "repeat": {
      "type": "boolean"
    },
    "x": {
      "$ref": "#/definitions/__schema29"
    },
    "y": {
      "$ref": "#/definitions/__schema30"
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
["backgroundImage"]: {
  "type": "object",
  "properties": {
    "path": {
      "$ref": "#/definitions/__schema26"
    },
    "repeat": {
      "type": "boolean"
    },
    "x": {
      "$ref": "#/definitions/__schema29"
    },
    "y": {
      "$ref": "#/definitions/__schema30"
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
["__schema26"]: {
  "type": "string"
},
["__schema27"]: {
  "type": [
    "boolean",
    "string"
  ]
},
["__schema28"]: {
  "type": [
    "boolean",
    "string"
  ]
},
["__schema29"]: {
  "type": "string"
},
["__schema30"]: {
  "type": "string"
},
["__schema31"]: {
  "type": "string"
},
["__schema32"]: {
  "type": "string"
},
["__schema33"]: {
  "type": "string"
},
["__schema34"]: {
  "type": "string"
},
["__schema35"]: {
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
      "$ref": "#/definitions/__schema37"
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
      "$ref": "#/definitions/__schema37"
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
      "$ref": "#/definitions/__schema36"
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
["__schema36"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 100
},
["__schema37"]: {
  "type": "string",
  "enum": [
    "solid",
    "dashed",
    "dotted"
  ]
},
["__schema38"]: {
  "type": "object",
  "properties": {
    "stripeBackgroundColor": {
      "$ref": "#/definitions/__schema39",
      "x-stripo-setDocumentState": {
        "insert": "supported",
        "delete": "supported",
        "update": "supported",
        "move": "unsupported"
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
          "mergeService": []
        },
        "move": {
          "browser": [],
          "mergeService": []
        }
      }
    },
    "contentBackgroundColor": {
      "$ref": "#/definitions/__schema40",
      "x-stripo-setDocumentState": {
        "insert": "supported",
        "delete": "supported",
        "update": "supported",
        "move": "unsupported"
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
          "mergeService": []
        },
        "move": {
          "browser": [],
          "mergeService": []
        }
      }
    },
    "backgroundImage": {
      "$ref": "#/definitions/__schema41",
      "x-stripo-setDocumentState": {
        "insert": "supported",
        "delete": "supported",
        "update": "supported",
        "move": "unsupported"
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
          "mergeService": []
        },
        "move": {
          "browser": [],
          "mergeService": []
        }
      }
    }
  },
  "additionalProperties": false
},
["__schema39"]: {
  "anyOf": [
    {
      "$ref": "#/definitions/colorValueAllowTransparent"
    },
    {
      "type": "null"
    }
  ]
},
["__schema40"]: {
  "anyOf": [
    {
      "$ref": "#/definitions/colorValueAllowTransparent"
    },
    {
      "type": "null"
    }
  ]
},
["__schema41"]: {
  "type": [
    "string",
    "null"
  ]
},
["__schema42"]: {
  "type": "number"
},
["__schema43"]: {
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
      "$ref": "#/definitions/__schema44"
    },
    "settings": {
      "$ref": "#/definitions/__schema45"
    },
    "moduleId": {
      "$ref": "#/definitions/__schema63",
      "readOnly": true
    },
    "columns": {
      "$ref": "#/definitions/__schema64"
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
["__schema44"]: {
  "type": "string",
  "minLength": 1
},
["__schema45"]: {
  "type": "object",
  "properties": {
    "backgroundColor": {
      "$ref": "#/definitions/colorValueAllowTransparent"
    },
    "backgroundImage": {
      "$ref": "#/definitions/__schema46"
    },
    "border": {
      "$ref": "#/definitions/border"
    },
    "borderRadius": {
      "$ref": "#/definitions/borderRadius"
    },
    "columnsGap": {
      "$ref": "#/definitions/__schema51"
    },
    "responsiveMobile": {
      "$ref": "#/definitions/__schema54"
    },
    "responsiveMobileContainersInversion": {
      "$ref": "#/definitions/__schema55"
    },
    "padding": {
      "$ref": "#/definitions/__schema56"
    },
    "margins": {
      "$ref": "#/definitions/__schema57"
    },
    "includeInOutput": {
      "$ref": "#/definitions/__schema58"
    },
    "hideElement": {
      "$ref": "#/definitions/__schema59"
    },
    "darkTheme": {
      "$ref": "#/definitions/__schema60"
    }
  },
  "required": [
    "backgroundColor",
    "border",
    "borderRadius"
  ],
  "additionalProperties": false
},
["__schema46"]: {
  "type": "object",
  "properties": {
    "path": {
      "$ref": "#/definitions/__schema26"
    },
    "repeat": {
      "type": "boolean"
    },
    "x": {
      "$ref": "#/definitions/__schema29"
    },
    "y": {
      "$ref": "#/definitions/__schema30"
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
      "$ref": "#/definitions/__schema47"
    },
    "topRight": {
      "$ref": "#/definitions/__schema48"
    },
    "bottomRight": {
      "$ref": "#/definitions/__schema49"
    },
    "bottomLeft": {
      "$ref": "#/definitions/__schema50"
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
["__schema47"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema48"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema49"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema50"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["__schema51"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema52"
    },
    "mobile": {
      "$ref": "#/definitions/__schema53"
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
      "$ref": "#/definitions/__schema52"
    },
    "mobile": {
      "$ref": "#/definitions/__schema53"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false,
  "description": "Responsive numeric values for desktop and mobile."
},
["__schema52"]: {
  "type": "number"
},
["__schema53"]: {
  "type": "number"
},
["__schema54"]: {
  "type": "boolean"
},
["__schema55"]: {
  "type": "boolean"
},
["__schema56"]: {
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
["__schema57"]: {
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
["__schema58"]: {
  "type": "string",
  "enum": [
    "both",
    "html",
    "ampHtml"
  ],
  "description": "Include in email output formats: both, html, or ampHtml."
},
["__schema59"]: {
  "type": "string",
  "enum": [
    "no",
    "desktop",
    "mobile"
  ],
  "description": "Hide element mode: no, desktop, or mobile."
},
["__schema60"]: {
  "type": "object",
  "properties": {
    "backgroundColor": {
      "$ref": "#/definitions/__schema62",
      "x-stripo-setDocumentState": {
        "insert": "supported",
        "delete": "supported",
        "update": "supported",
        "move": "unsupported"
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
          "mergeService": []
        },
        "move": {
          "browser": [],
          "mergeService": []
        }
      }
    },
    "backgroundImage": {
      "$ref": "#/definitions/__schema41",
      "x-stripo-setDocumentState": {
        "insert": "supported",
        "delete": "supported",
        "update": "supported",
        "move": "unsupported"
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
          "mergeService": []
        },
        "move": {
          "browser": [],
          "mergeService": []
        }
      }
    }
  },
  "additionalProperties": false
},
["__schema61"]: {
  "type": "object",
  "properties": {
    "backgroundColor": {
      "$ref": "#/definitions/__schema62",
      "x-stripo-setDocumentState": {
        "insert": "supported",
        "delete": "supported",
        "update": "supported",
        "move": "unsupported"
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
          "mergeService": []
        },
        "move": {
          "browser": [],
          "mergeService": []
        }
      }
    },
    "backgroundImage": {
      "$ref": "#/definitions/__schema41",
      "x-stripo-setDocumentState": {
        "insert": "supported",
        "delete": "supported",
        "update": "supported",
        "move": "unsupported"
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
          "mergeService": []
        },
        "move": {
          "browser": [],
          "mergeService": []
        }
      }
    }
  },
  "additionalProperties": false
},
["__schema62"]: {
  "anyOf": [
    {
      "$ref": "#/definitions/colorValueAllowTransparent"
    },
    {
      "type": "null"
    }
  ]
},
["__schema63"]: {
  "type": "number"
},
["__schema64"]: {
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
      "$ref": "#/definitions/__schema65"
    },
    "settings": {
      "$ref": "#/definitions/__schema66"
    },
    "containers": {
      "$ref": "#/definitions/__schema68"
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
["__schema65"]: {
  "type": "string",
  "minLength": 1
},
["__schema66"]: {
  "type": "object",
  "properties": {
    "width": {
      "$ref": "#/definitions/__schema67",
      "description": "Informational column width. In setDocumentState this value is treated as a ratio weight rather than absolute pixels. The actual widths in the resulting email can differ from the values passed in the schema. getDocumentState returns the current absolute widths in px."
    }
  },
  "required": [
    "width"
  ],
  "additionalProperties": false
},
["__schema67"]: {
  "type": "number"
},
["__schema68"]: {
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
      "$ref": "#/definitions/__schema69"
    },
    "settings": {
      "$ref": "#/definitions/__schema70"
    },
    "moduleId": {
      "$ref": "#/definitions/__schema73",
      "readOnly": true
    },
    "blocks": {
      "$ref": "#/definitions/__schema74"
    }
  },
  "required": [
    "id",
    "settings"
  ],
  "additionalProperties": false,
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
  }
},
["__schema69"]: {
  "type": "string",
  "minLength": 1
},
["__schema70"]: {
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
      "$ref": "#/definitions/__schema71"
    },
    "border": {
      "$ref": "#/definitions/border"
    },
    "radius": {
      "$ref": "#/definitions/borderRadius"
    },
    "darkTheme": {
      "$ref": "#/definitions/__schema72"
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
["__schema71"]: {
  "type": "object",
  "properties": {
    "path": {
      "$ref": "#/definitions/__schema26"
    },
    "repeat": {
      "type": "boolean"
    },
    "x": {
      "$ref": "#/definitions/__schema29"
    },
    "y": {
      "$ref": "#/definitions/__schema30"
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
["__schema72"]: {
  "type": "object",
  "properties": {
    "backgroundColor": {
      "$ref": "#/definitions/__schema62",
      "x-stripo-setDocumentState": {
        "insert": "supported",
        "delete": "supported",
        "update": "supported",
        "move": "unsupported"
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
          "mergeService": []
        },
        "move": {
          "browser": [],
          "mergeService": []
        }
      }
    },
    "backgroundImage": {
      "$ref": "#/definitions/__schema41",
      "x-stripo-setDocumentState": {
        "insert": "supported",
        "delete": "supported",
        "update": "supported",
        "move": "unsupported"
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
          "mergeService": []
        },
        "move": {
          "browser": [],
          "mergeService": []
        }
      }
    }
  },
  "additionalProperties": false
},
["__schema73"]: {
  "type": "number"
},
["__schema74"]: {
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
      "$ref": "#/definitions/__schema75"
    },
    "type": {
      "$ref": "#/definitions/__schema76"
    },
    "settings": {
      "$ref": "#/definitions/__schema77"
    },
    "content": {
      "$ref": "#/definitions/__schema88"
    }
  },
  "required": [
    "id",
    "type"
  ],
  "additionalProperties": false,
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
  }
},
["__schema75"]: {
  "type": "string",
  "minLength": 1
},
["__schema76"]: {
  "type": "string",
  "const": "text"
},
["__schema77"]: {
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
          "$ref": "#/definitions/__schema78"
        },
        "mobile": {
          "$ref": "#/definitions/__schema78"
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
          "$ref": "#/definitions/__schema79"
        },
        "mobile": {
          "$ref": "#/definitions/__schema83"
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
          "$ref": "#/definitions/__schema84"
        },
        "mobile": {
          "$ref": "#/definitions/__schema84"
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
          "$ref": "#/definitions/__schema86"
        },
        "unit": {
          "$ref": "#/definitions/__schema87"
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
["__schema78"]: {
  "type": "string",
  "enum": [
    "left",
    "center",
    "right",
    "justify"
  ]
},
["__schema79"]: {
  "type": "object",
  "properties": {
    "height": {
      "$ref": "#/definitions/__schema81"
    },
    "verticalAlignment": {
      "$ref": "#/definitions/__schema82"
    }
  },
  "required": [
    "height"
  ],
  "additionalProperties": false,
  "description": "Text fixed-height mode. Omitted verticalAlignment preserves the previous effective alignment; legacy height without valign is effectively middle, and top is used when none exists."
},
["__schema80"]: {
  "type": "object",
  "properties": {
    "height": {
      "$ref": "#/definitions/__schema81"
    },
    "verticalAlignment": {
      "$ref": "#/definitions/__schema82"
    }
  },
  "required": [
    "height"
  ],
  "additionalProperties": false
},
["__schema81"]: {
  "type": "integer",
  "minimum": 0,
  "maximum": 9007199254740991
},
["__schema82"]: {
  "type": "string",
  "enum": [
    "top",
    "middle",
    "bottom"
  ]
},
["__schema83"]: {
  "type": "object",
  "properties": {
    "height": {
      "$ref": "#/definitions/__schema81"
    },
    "verticalAlignment": {
      "$ref": "#/definitions/__schema82"
    }
  },
  "required": [
    "height"
  ],
  "additionalProperties": false,
  "description": "Text fixed-height mode. Omitted verticalAlignment preserves the previous effective alignment; legacy height without valign is effectively middle, and top is used when none exists."
},
["__schema84"]: {
  "type": "object",
  "properties": {
    "top": {
      "$ref": "#/definitions/__schema85"
    },
    "right": {
      "$ref": "#/definitions/__schema85"
    },
    "bottom": {
      "$ref": "#/definitions/__schema85"
    },
    "left": {
      "$ref": "#/definitions/__schema85"
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
["__schema85"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 1000
},
["spacingValue"]: {
  "type": "object",
  "properties": {
    "value": {
      "$ref": "#/definitions/__schema86"
    },
    "unit": {
      "$ref": "#/definitions/__schema87"
    }
  },
  "required": [
    "value",
    "unit"
  ],
  "additionalProperties": false,
  "description": "Spacing value with a numeric value and unit."
},
["__schema86"]: {
  "type": "number"
},
["__schema87"]: {
  "type": "string",
  "enum": [
    "px",
    "em"
  ]
},
["__schema88"]: {
  "type": "string"
},
["imageBlock"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema75"
    },
    "type": {
      "$ref": "#/definitions/__schema89"
    },
    "settings": {
      "$ref": "#/definitions/__schema90"
    }
  },
  "required": [
    "id",
    "type",
    "settings"
  ],
  "additionalProperties": false,
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
  }
},
["__schema89"]: {
  "type": "string",
  "const": "image"
},
["__schema90"]: {
  "type": "object",
  "properties": {
    "src": {
      "$ref": "#/definitions/__schema91"
    },
    "link": {
      "$ref": "#/definitions/__schema92"
    },
    "altText": {
      "$ref": "#/definitions/__schema96"
    },
    "size": {
      "$ref": "#/definitions/__schema99"
    },
    "alignment": {
      "$ref": "#/definitions/__schema103"
    },
    "radius": {
      "$ref": "#/definitions/__schema105"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "margins": {
      "$ref": "#/definitions/__schema106"
    },
    "includeInOutput": {
      "$ref": "#/definitions/outputInclusion"
    },
    "anchorLinkName": {
      "$ref": "#/definitions/__schema112"
    },
    "responsiveMobile": {
      "$ref": "#/definitions/__schema113"
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
["__schema91"]: {
  "type": "string"
},
["__schema92"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema94"
    },
    "href": {
      "$ref": "#/definitions/__schema95"
    }
  },
  "required": [
    "type",
    "href"
  ],
  "additionalProperties": false
},
["__schema93"]: {
  "type": "object",
  "properties": {
    "type": {
      "$ref": "#/definitions/__schema94"
    },
    "href": {
      "$ref": "#/definitions/__schema95"
    }
  },
  "required": [
    "type",
    "href"
  ],
  "additionalProperties": false
},
["__schema94"]: {
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
["__schema95"]: {
  "type": "string",
  "minLength": 1
}
};

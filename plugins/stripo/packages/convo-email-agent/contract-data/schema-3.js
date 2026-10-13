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
["__schema11"]: {
  "type": "object",
  "properties": {
    "general": {
      "$ref": "#/definitions/__schema12"
    },
    "stripes": {
      "$ref": "#/definitions/__schema20"
    },
    "headings": {
      "$ref": "#/definitions/__schema32"
    },
    "buttons": {
      "$ref": "#/definitions/__schema34"
    }
  },
  "required": [
    "general",
    "stripes",
    "headings",
    "buttons"
  ],
  "additionalProperties": false
},
["__schema12"]: {
  "type": "object",
  "properties": {
    "defaultStyles": {
      "type": "boolean"
    },
    "hideImageDownloadIcons": {
      "type": "boolean"
    },
    "underlineLinks": {
      "type": "boolean"
    },
    "responsiveDesign": {
      "type": "boolean"
    },
    "messageAlignment": {
      "type": "string",
      "enum": [
        "left",
        "center",
        "right"
      ]
    },
    "messageContentWidth": {
      "type": "integer",
      "minimum": 320,
      "maximum": 900
    },
    "backgroundImage": {
      "anyOf": [
        {
          "$ref": "#/definitions/__schema13"
        },
        {
          "type": "null"
        }
      ]
    },
    "rightToLeftTextDirection": {
      "type": "boolean"
    },
    "marginsAroundMessage": {
      "$ref": "#/definitions/__schema16"
    },
    "defaultStructurePadding": {
      "$ref": "#/definitions/__schema16"
    },
    "customListStyles": {
      "anyOf": [
        {
          "type": "object",
          "properties": {
            "leftIndent": {
              "type": "number",
              "minimum": 0,
              "maximum": 300
            },
            "listItemsBottomSpace": {
              "type": "number",
              "minimum": 0,
              "maximum": 100
            },
            "listTopBottomMargin": {
              "type": "number",
              "minimum": 0,
              "maximum": 100
            }
          },
          "required": [
            "leftIndent",
            "listItemsBottomSpace",
            "listTopBottomMargin"
          ],
          "additionalProperties": false
        },
        {
          "type": "null"
        }
      ]
    },
    "lightTheme": {
      "type": "object",
      "properties": {
        "backgroundColor": {
          "$ref": "#/definitions/__schema18",
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
              "mergeService": []
            },
            "move": {
              "browser": [],
              "mergeService": []
            }
          }
        },
        "customListStyles": {
          "type": "object",
          "properties": {
            "listMarkerColor": {
              "$ref": "#/definitions/__schema19",
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
                  "mergeService": []
                },
                "move": {
                  "browser": [],
                  "mergeService": []
                }
              }
            },
            "listNumberMarkerColor": {
              "$ref": "#/definitions/__schema19",
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
                  "mergeService": []
                },
                "move": {
                  "browser": [],
                  "mergeService": []
                }
              }
            }
          },
          "required": [
            "listMarkerColor",
            "listNumberMarkerColor"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "backgroundColor",
        "customListStyles"
      ],
      "additionalProperties": false
    },
    "darkTheme": {
      "type": "object",
      "properties": {
        "backgroundColor": {
          "anyOf": [
            {
              "$ref": "#/definitions/__schema18"
            },
            {
              "type": "null"
            }
          ],
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
              "mergeService": []
            },
            "move": {
              "browser": [],
              "mergeService": []
            }
          }
        },
        "customListStyles": {
          "type": "object",
          "properties": {
            "listMarkerColor": {
              "anyOf": [
                {
                  "$ref": "#/definitions/__schema19"
                },
                {
                  "type": "null"
                }
              ],
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
                  "mergeService": []
                },
                "move": {
                  "browser": [],
                  "mergeService": []
                }
              }
            },
            "listNumberMarkerColor": {
              "anyOf": [
                {
                  "$ref": "#/definitions/__schema19"
                },
                {
                  "type": "null"
                }
              ],
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
                  "mergeService": []
                },
                "move": {
                  "browser": [],
                  "mergeService": []
                }
              }
            }
          },
          "required": [
            "listMarkerColor",
            "listNumberMarkerColor"
          ],
          "additionalProperties": false
        },
        "backgroundImage": {
          "anyOf": [
            {
              "$ref": "#/definitions/__schema14"
            },
            {
              "type": "null"
            }
          ],
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
      "required": [
        "backgroundColor",
        "customListStyles"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "defaultStyles",
    "hideImageDownloadIcons",
    "underlineLinks",
    "responsiveDesign",
    "messageAlignment",
    "messageContentWidth",
    "backgroundImage",
    "rightToLeftTextDirection",
    "marginsAroundMessage",
    "defaultStructurePadding",
    "customListStyles",
    "lightTheme",
    "darkTheme"
  ],
  "additionalProperties": false
},
["__schema13"]: {
  "type": "object",
  "properties": {
    "path": {
      "$ref": "#/definitions/__schema14"
    },
    "repeat": {
      "type": "boolean"
    },
    "x": {
      "type": "string"
    },
    "y": {
      "type": "string"
    },
    "sizeX": {
      "$ref": "#/definitions/__schema15"
    },
    "sizeY": {
      "$ref": "#/definitions/__schema15"
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
  "additionalProperties": false
},
["__schema14"]: {
  "type": "string"
},
["__schema15"]: {
  "type": "string"
},
["__schema16"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema17"
    },
    "mobile": {
      "$ref": "#/definitions/__schema17"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema17"]: {
  "type": "object",
  "properties": {
    "top": {
      "type": "number"
    },
    "right": {
      "type": "number"
    },
    "bottom": {
      "type": "number"
    },
    "left": {
      "type": "number"
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
["__schema18"]: {
  "type": "string"
},
["__schema19"]: {
  "type": "string"
},
["__schema20"]: value0,
["__schema21"]: {
  "type": "object",
  "properties": {
    "value": {
      "type": "number"
    },
    "unit": {
      "type": "string",
      "enum": [
        "px",
        "em"
      ]
    }
  },
  "required": [
    "value",
    "unit"
  ],
  "additionalProperties": false
},
["__schema22"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 5
},
["__schema23"]: {
  "type": "number",
  "minimum": 0,
  "maximum": 5
},
["__schema24"]: {
  "type": "string",
  "minLength": 1
},
["__schema25"]: {
  "type": "integer",
  "minimum": 100,
  "maximum": 900,
  "multipleOf": 100
},
["__schema26"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "$ref": "#/definitions/__schema27"
    },
    "mobile": {
      "$ref": "#/definitions/__schema28"
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema27"]: {
  "type": "number",
  "minimum": 8,
  "maximum": 72
},
["__schema28"]: {
  "type": "number",
  "minimum": 8,
  "maximum": 72
},
["__schema29"]: {
  "anyOf": [
    {
      "$ref": "#/definitions/__schema30"
    },
    {
      "type": "null"
    }
  ]
},
["__schema30"]: {
  "type": "object",
  "properties": {
    "desktop": {
      "type": "number",
      "minimum": 0,
      "maximum": 100
    },
    "mobile": {
      "type": "number",
      "minimum": 0,
      "maximum": 100
    }
  },
  "required": [
    "desktop",
    "mobile"
  ],
  "additionalProperties": false
},
["__schema31"]: {
  "type": "string"
},
["__schema32"]: {
  "type": "object",
  "properties": {
    "letterSpacing": {
      "$ref": "#/definitions/__schema21"
    },
    "fontFamily": {
      "$ref": "#/definitions/__schema24",
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
    "h1": {
      "$ref": "#/definitions/__schema33"
    },
    "h2": {
      "$ref": "#/definitions/__schema33"
    },
    "h3": {
      "$ref": "#/definitions/__schema33"
    },
    "h4": {
      "$ref": "#/definitions/__schema33"
    },
    "h5": {
      "$ref": "#/definitions/__schema33"
    },
    "h6": {
      "$ref": "#/definitions/__schema33"
    },
    "lightTheme": {
      "type": "object",
      "properties": {
        "h1": {
          "type": "object",
          "properties": {
            "fontColor": {
              "$ref": "#/definitions/__schema31",
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
                  "mergeService": []
                },
                "move": {
                  "browser": [],
                  "mergeService": []
                }
              }
            }
          },
          "required": [
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h2": {
          "type": "object",
          "properties": {
            "fontColor": {
              "$ref": "#/definitions/__schema31",
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
                  "mergeService": []
                },
                "move": {
                  "browser": [],
                  "mergeService": []
                }
              }
            }
          },
          "required": [
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h3": {
          "type": "object",
          "properties": {
            "fontColor": {
              "$ref": "#/definitions/__schema31",
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
                  "mergeService": []
                },
                "move": {
                  "browser": [],
                  "mergeService": []
                }
              }
            }
          },
          "required": [
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h4": {
          "type": "object",
          "properties": {
            "fontColor": {
              "$ref": "#/definitions/__schema31",
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
                  "mergeService": []
                },
                "move": {
                  "browser": [],
                  "mergeService": []
                }
              }
            }
          },
          "required": [
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h5": {
          "type": "object",
          "properties": {
            "fontColor": {
              "$ref": "#/definitions/__schema31",
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
                  "mergeService": []
                },
                "move": {
                  "browser": [],
                  "mergeService": []
                }
              }
            }
          },
          "required": [
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h6": {
          "type": "object",
          "properties": {
            "fontColor": {
              "$ref": "#/definitions/__schema31",
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
                  "mergeService": []
                },
                "move": {
                  "browser": [],
                  "mergeService": []
                }
              }
            }
          },
          "required": [
            "fontColor"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6"
      ],
      "additionalProperties": false
    },
    "darkTheme": {
      "type": "object",
      "properties": {
        "h1": {
          "type": "object",
          "properties": {
            "fontColor": {
              "anyOf": [
                {
                  "$ref": "#/definitions/__schema31"
                },
                {
                  "type": "null"
                }
              ],
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
                  "mergeService": []
                },
                "move": {
                  "browser": [],
                  "mergeService": []
                }
              }
            }
          },
          "required": [
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h2": {
          "type": "object",
          "properties": {
            "fontColor": {
              "anyOf": [
                {
                  "$ref": "#/definitions/__schema31"
                },
                {
                  "type": "null"
                }
              ],
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
                  "mergeService": []
                },
                "move": {
                  "browser": [],
                  "mergeService": []
                }
              }
            }
          },
          "required": [
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h3": {
          "type": "object",
          "properties": {
            "fontColor": {
              "anyOf": [
                {
                  "$ref": "#/definitions/__schema31"
                },
                {
                  "type": "null"
                }
              ],
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
                  "mergeService": []
                },
                "move": {
                  "browser": [],
                  "mergeService": []
                }
              }
            }
          },
          "required": [
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h4": {
          "type": "object",
          "properties": {
            "fontColor": {
              "anyOf": [
                {
                  "$ref": "#/definitions/__schema31"
                },
                {
                  "type": "null"
                }
              ],
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
                  "mergeService": []
                },
                "move": {
                  "browser": [],
                  "mergeService": []
                }
              }
            }
          },
          "required": [
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h5": {
          "type": "object",
          "properties": {
            "fontColor": {
              "anyOf": [
                {
                  "$ref": "#/definitions/__schema31"
                },
                {
                  "type": "null"
                }
              ],
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
                  "mergeService": []
                },
                "move": {
                  "browser": [],
                  "mergeService": []
                }
              }
            }
          },
          "required": [
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h6": {
          "type": "object",
          "properties": {
            "fontColor": {
              "anyOf": [
                {
                  "$ref": "#/definitions/__schema31"
                },
                {
                  "type": "null"
                }
              ],
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
                  "mergeService": []
                },
                "move": {
                  "browser": [],
                  "mergeService": []
                }
              }
            }
          },
          "required": [
            "fontColor"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "h1",
        "h2",
        "h3",
        "h4",
        "h5",
        "h6"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "letterSpacing",
    "fontFamily",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "lightTheme",
    "darkTheme"
  ],
  "additionalProperties": false
}
};

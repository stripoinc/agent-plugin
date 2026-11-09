import value0 from './schema-4.js';
export default {
["general"]: {
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
          "type": "object",
          "properties": {
            "path": {
              "type": "string"
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
          "additionalProperties": false
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
      "type": "object",
      "properties": {
        "desktop": {
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
        "mobile": {
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
        }
      },
      "required": [
        "desktop",
        "mobile"
      ],
      "additionalProperties": false
    },
    "defaultStructurePadding": {
      "type": "object",
      "properties": {
        "desktop": {
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
        "mobile": {
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
        }
      },
      "required": [
        "desktop",
        "mobile"
      ],
      "additionalProperties": false
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
          "type": "string",
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
              "type": "string",
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
              "type": "string",
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
          "type": [
            "string",
            "null"
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
              "type": [
                "string",
                "null"
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
              "type": [
                "string",
                "null"
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
          "type": [
            "string",
            "null"
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
["stripes"]: value0
};

import value0 from './schema-4.js';
export default {
["headings"]: {
  "type": "object",
  "properties": {
    "letterSpacing": {
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
    "fontFamily": {
      "type": "string",
      "minLength": 1,
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
      "type": "object",
      "properties": {
        "textAlign": {
          "type": "object",
          "properties": {
            "mobile": {
              "anyOf": [
                {
                  "type": "string",
                  "enum": [
                    "left",
                    "center",
                    "right"
                  ]
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "mobile"
          ],
          "additionalProperties": false
        },
        "textStyle": {
          "type": "object",
          "properties": {
            "italic": {
              "type": "boolean"
            }
          },
          "required": [
            "italic"
          ],
          "additionalProperties": false
        },
        "fontWeight": {
          "anyOf": [
            {
              "type": "integer",
              "minimum": 100,
              "maximum": 900,
              "multipleOf": 100
            },
            {
              "type": "null"
            }
          ]
        },
        "fontSize": {
          "type": "object",
          "properties": {
            "desktop": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 8,
                  "maximum": 72
                },
                {
                  "type": "null"
                }
              ]
            },
            "mobile": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 8,
                  "maximum": 72
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "desktop",
            "mobile"
          ],
          "additionalProperties": false
        },
        "lineHeight": {
          "type": "object",
          "properties": {
            "desktop": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 5
                },
                {
                  "type": "null"
                }
              ]
            },
            "mobile": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 5
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "desktop",
            "mobile"
          ],
          "additionalProperties": false
        },
        "paragraphBottomSpace": {
          "anyOf": [
            {
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
            {
              "type": "null"
            }
          ]
        }
      },
      "required": [
        "textAlign",
        "textStyle",
        "fontWeight",
        "fontSize",
        "lineHeight",
        "paragraphBottomSpace"
      ],
      "additionalProperties": false
    },
    "h2": {
      "type": "object",
      "properties": {
        "textAlign": {
          "type": "object",
          "properties": {
            "mobile": {
              "anyOf": [
                {
                  "type": "string",
                  "enum": [
                    "left",
                    "center",
                    "right"
                  ]
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "mobile"
          ],
          "additionalProperties": false
        },
        "textStyle": {
          "type": "object",
          "properties": {
            "italic": {
              "type": "boolean"
            }
          },
          "required": [
            "italic"
          ],
          "additionalProperties": false
        },
        "fontWeight": {
          "anyOf": [
            {
              "type": "integer",
              "minimum": 100,
              "maximum": 900,
              "multipleOf": 100
            },
            {
              "type": "null"
            }
          ]
        },
        "fontSize": {
          "type": "object",
          "properties": {
            "desktop": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 8,
                  "maximum": 72
                },
                {
                  "type": "null"
                }
              ]
            },
            "mobile": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 8,
                  "maximum": 72
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "desktop",
            "mobile"
          ],
          "additionalProperties": false
        },
        "lineHeight": {
          "type": "object",
          "properties": {
            "desktop": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 5
                },
                {
                  "type": "null"
                }
              ]
            },
            "mobile": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 5
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "desktop",
            "mobile"
          ],
          "additionalProperties": false
        },
        "paragraphBottomSpace": {
          "anyOf": [
            {
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
            {
              "type": "null"
            }
          ]
        }
      },
      "required": [
        "textAlign",
        "textStyle",
        "fontWeight",
        "fontSize",
        "lineHeight",
        "paragraphBottomSpace"
      ],
      "additionalProperties": false
    },
    "h3": {
      "type": "object",
      "properties": {
        "textAlign": {
          "type": "object",
          "properties": {
            "mobile": {
              "anyOf": [
                {
                  "type": "string",
                  "enum": [
                    "left",
                    "center",
                    "right"
                  ]
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "mobile"
          ],
          "additionalProperties": false
        },
        "textStyle": {
          "type": "object",
          "properties": {
            "italic": {
              "type": "boolean"
            }
          },
          "required": [
            "italic"
          ],
          "additionalProperties": false
        },
        "fontWeight": {
          "anyOf": [
            {
              "type": "integer",
              "minimum": 100,
              "maximum": 900,
              "multipleOf": 100
            },
            {
              "type": "null"
            }
          ]
        },
        "fontSize": {
          "type": "object",
          "properties": {
            "desktop": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 8,
                  "maximum": 72
                },
                {
                  "type": "null"
                }
              ]
            },
            "mobile": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 8,
                  "maximum": 72
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "desktop",
            "mobile"
          ],
          "additionalProperties": false
        },
        "lineHeight": {
          "type": "object",
          "properties": {
            "desktop": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 5
                },
                {
                  "type": "null"
                }
              ]
            },
            "mobile": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 5
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "desktop",
            "mobile"
          ],
          "additionalProperties": false
        },
        "paragraphBottomSpace": {
          "anyOf": [
            {
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
            {
              "type": "null"
            }
          ]
        }
      },
      "required": [
        "textAlign",
        "textStyle",
        "fontWeight",
        "fontSize",
        "lineHeight",
        "paragraphBottomSpace"
      ],
      "additionalProperties": false
    },
    "h4": {
      "type": "object",
      "properties": {
        "textAlign": {
          "type": "object",
          "properties": {
            "mobile": {
              "anyOf": [
                {
                  "type": "string",
                  "enum": [
                    "left",
                    "center",
                    "right"
                  ]
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "mobile"
          ],
          "additionalProperties": false
        },
        "textStyle": {
          "type": "object",
          "properties": {
            "italic": {
              "type": "boolean"
            }
          },
          "required": [
            "italic"
          ],
          "additionalProperties": false
        },
        "fontWeight": {
          "anyOf": [
            {
              "type": "integer",
              "minimum": 100,
              "maximum": 900,
              "multipleOf": 100
            },
            {
              "type": "null"
            }
          ]
        },
        "fontSize": {
          "type": "object",
          "properties": {
            "desktop": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 8,
                  "maximum": 72
                },
                {
                  "type": "null"
                }
              ]
            },
            "mobile": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 8,
                  "maximum": 72
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "desktop",
            "mobile"
          ],
          "additionalProperties": false
        },
        "lineHeight": {
          "type": "object",
          "properties": {
            "desktop": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 5
                },
                {
                  "type": "null"
                }
              ]
            },
            "mobile": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 5
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "desktop",
            "mobile"
          ],
          "additionalProperties": false
        },
        "paragraphBottomSpace": {
          "anyOf": [
            {
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
            {
              "type": "null"
            }
          ]
        }
      },
      "required": [
        "textAlign",
        "textStyle",
        "fontWeight",
        "fontSize",
        "lineHeight",
        "paragraphBottomSpace"
      ],
      "additionalProperties": false
    },
    "h5": {
      "type": "object",
      "properties": {
        "textAlign": {
          "type": "object",
          "properties": {
            "mobile": {
              "anyOf": [
                {
                  "type": "string",
                  "enum": [
                    "left",
                    "center",
                    "right"
                  ]
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "mobile"
          ],
          "additionalProperties": false
        },
        "textStyle": {
          "type": "object",
          "properties": {
            "italic": {
              "type": "boolean"
            }
          },
          "required": [
            "italic"
          ],
          "additionalProperties": false
        },
        "fontWeight": {
          "anyOf": [
            {
              "type": "integer",
              "minimum": 100,
              "maximum": 900,
              "multipleOf": 100
            },
            {
              "type": "null"
            }
          ]
        },
        "fontSize": {
          "type": "object",
          "properties": {
            "desktop": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 8,
                  "maximum": 72
                },
                {
                  "type": "null"
                }
              ]
            },
            "mobile": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 8,
                  "maximum": 72
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "desktop",
            "mobile"
          ],
          "additionalProperties": false
        },
        "lineHeight": {
          "type": "object",
          "properties": {
            "desktop": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 5
                },
                {
                  "type": "null"
                }
              ]
            },
            "mobile": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 5
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "desktop",
            "mobile"
          ],
          "additionalProperties": false
        },
        "paragraphBottomSpace": {
          "anyOf": [
            {
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
            {
              "type": "null"
            }
          ]
        }
      },
      "required": [
        "textAlign",
        "textStyle",
        "fontWeight",
        "fontSize",
        "lineHeight",
        "paragraphBottomSpace"
      ],
      "additionalProperties": false
    },
    "h6": {
      "type": "object",
      "properties": {
        "textAlign": {
          "type": "object",
          "properties": {
            "mobile": {
              "anyOf": [
                {
                  "type": "string",
                  "enum": [
                    "left",
                    "center",
                    "right"
                  ]
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "mobile"
          ],
          "additionalProperties": false
        },
        "textStyle": {
          "type": "object",
          "properties": {
            "italic": {
              "type": "boolean"
            }
          },
          "required": [
            "italic"
          ],
          "additionalProperties": false
        },
        "fontWeight": {
          "anyOf": [
            {
              "type": "integer",
              "minimum": 100,
              "maximum": 900,
              "multipleOf": 100
            },
            {
              "type": "null"
            }
          ]
        },
        "fontSize": {
          "type": "object",
          "properties": {
            "desktop": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 8,
                  "maximum": 72
                },
                {
                  "type": "null"
                }
              ]
            },
            "mobile": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 8,
                  "maximum": 72
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "desktop",
            "mobile"
          ],
          "additionalProperties": false
        },
        "lineHeight": {
          "type": "object",
          "properties": {
            "desktop": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 5
                },
                {
                  "type": "null"
                }
              ]
            },
            "mobile": {
              "anyOf": [
                {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 5
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "desktop",
            "mobile"
          ],
          "additionalProperties": false
        },
        "paragraphBottomSpace": {
          "anyOf": [
            {
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
            {
              "type": "null"
            }
          ]
        }
      },
      "required": [
        "textAlign",
        "textStyle",
        "fontWeight",
        "fontSize",
        "lineHeight",
        "paragraphBottomSpace"
      ],
      "additionalProperties": false
    },
    "lightTheme": {
      "type": "object",
      "properties": {
        "h1": {
          "type": "object",
          "properties": {
            "fontColor": {
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
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h2": {
          "type": "object",
          "properties": {
            "fontColor": {
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
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h3": {
          "type": "object",
          "properties": {
            "fontColor": {
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
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h4": {
          "type": "object",
          "properties": {
            "fontColor": {
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
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h5": {
          "type": "object",
          "properties": {
            "fontColor": {
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
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h6": {
          "type": "object",
          "properties": {
            "fontColor": {
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
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h2": {
          "type": "object",
          "properties": {
            "fontColor": {
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
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h3": {
          "type": "object",
          "properties": {
            "fontColor": {
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
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h4": {
          "type": "object",
          "properties": {
            "fontColor": {
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
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h5": {
          "type": "object",
          "properties": {
            "fontColor": {
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
            "fontColor"
          ],
          "additionalProperties": false
        },
        "h6": {
          "type": "object",
          "properties": {
            "fontColor": {
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

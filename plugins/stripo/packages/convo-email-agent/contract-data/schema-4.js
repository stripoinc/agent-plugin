import value0 from './schema-2.js';
export default {
["__schema33"]: {
  "type": "object",
  "properties": {
    "outlookSupport": {
      "type": "boolean"
    },
    "textStyle": {
      "type": "object",
      "properties": {
        "bold": {
          "type": "boolean"
        },
        "italic": {
          "type": "boolean"
        }
      },
      "required": [
        "bold",
        "italic"
      ],
      "additionalProperties": false
    },
    "textTransform": {
      "type": "string",
      "enum": [
        "none",
        "uppercase",
        "capitalize",
        "lowercase"
      ]
    },
    "fontFamily": {
      "$ref": "#/definitions/__schema23",
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
    "letterSpacing": {
      "$ref": "#/definitions/__schema20"
    },
    "fontSize": {
      "$ref": "#/definitions/__schema25"
    },
    "borderRadius": {
      "type": "object",
      "properties": {
        "topLeft": {
          "type": "number",
          "minimum": 0,
          "maximum": 1000
        },
        "topRight": {
          "type": "number",
          "minimum": 0,
          "maximum": 1000
        },
        "bottomRight": {
          "type": "number",
          "minimum": 0,
          "maximum": 1000
        },
        "bottomLeft": {
          "type": "number",
          "minimum": 0,
          "maximum": 1000
        }
      },
      "required": [
        "topLeft",
        "topRight",
        "bottomRight",
        "bottomLeft"
      ],
      "additionalProperties": false
    },
    "fitContainer": {
      "type": "object",
      "properties": {
        "desktop": {
          "type": "boolean"
        },
        "mobile": {
          "type": "boolean"
        }
      },
      "required": [
        "desktop",
        "mobile"
      ],
      "additionalProperties": false
    },
    "border": {
      "type": "object",
      "properties": {
        "top": {
          "$ref": "#/definitions/__schema34"
        },
        "right": {
          "$ref": "#/definitions/__schema34"
        },
        "bottom": {
          "$ref": "#/definitions/__schema34"
        },
        "left": {
          "$ref": "#/definitions/__schema34"
        },
        "style": {
          "type": "string",
          "enum": [
            "solid",
            "dashed",
            "dotted"
          ]
        }
      },
      "required": [
        "top",
        "right",
        "bottom",
        "left",
        "style"
      ],
      "additionalProperties": false
    },
    "hoverButtonStyles": {
      "type": "boolean"
    },
    "padding": {
      "$ref": "#/definitions/__schema15"
    },
    "lightTheme": {
      "type": "object",
      "properties": {
        "buttonColor": {
          "$ref": "#/definitions/__schema17",
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
        "fontColor": {
          "$ref": "#/definitions/__schema30",
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
        "hoverButtonStyles": {
          "type": "object",
          "properties": {
            "backgroundColor": {
              "$ref": "#/definitions/__schema17",
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
            "fontColor": {
              "$ref": "#/definitions/__schema30",
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
            "borderColor": {
              "type": "object",
              "properties": {
                "top": {
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
                "right": {
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
                "bottom": {
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
                "left": {
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
            "backgroundColor",
            "fontColor",
            "borderColor"
          ],
          "additionalProperties": false
        },
        "borderColor": {
          "type": "object",
          "properties": {
            "top": {
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
            "right": {
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
            "bottom": {
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
            "left": {
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
        "buttonColor",
        "fontColor",
        "hoverButtonStyles",
        "borderColor"
      ],
      "additionalProperties": false
    },
    "darkTheme": {
      "type": "object",
      "properties": {
        "buttonColor": {
          "anyOf": [
            {
              "$ref": "#/definitions/__schema17"
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
        "fontColor": {
          "anyOf": [
            {
              "$ref": "#/definitions/__schema30"
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
        "hoverButtonStyles": {
          "type": "object",
          "properties": {
            "backgroundColor": {
              "anyOf": [
                {
                  "$ref": "#/definitions/__schema17"
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
            "fontColor": {
              "anyOf": [
                {
                  "$ref": "#/definitions/__schema30"
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
            "borderColor": {
              "type": "object",
              "properties": {
                "top": {
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
                "right": {
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
                "bottom": {
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
                "left": {
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
            "backgroundColor",
            "fontColor",
            "borderColor"
          ],
          "additionalProperties": false
        },
        "borderColor": {
          "type": "object",
          "properties": {
            "top": {
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
            "right": {
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
            "bottom": {
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
            "left": {
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
        "buttonColor",
        "fontColor",
        "hoverButtonStyles",
        "borderColor"
      ],
      "additionalProperties": false
    }
  },
  "required": [
    "outlookSupport",
    "textStyle",
    "textTransform",
    "fontFamily",
    "letterSpacing",
    "fontSize",
    "borderRadius",
    "fitContainer",
    "border",
    "hoverButtonStyles",
    "padding",
    "lightTheme",
    "darkTheme"
  ],
  "additionalProperties": false
},
["__schema34"]: {
  "type": "object",
  "properties": {
    "width": {
      "type": "number",
      "minimum": 0,
      "maximum": 100
    }
  },
  "required": [
    "width"
  ],
  "additionalProperties": false
},
["__schema35"]: {
  "type": "array",
  "items": {
    "$ref": "#/definitions/stripe"
  }
},
["__schema36"]: {
  "type": "array",
  "items": {
    "$ref": "#/definitions/stripe"
  }
},
["stripe"]: {
  "type": "object",
  "properties": {
    "id": {
      "$ref": "#/definitions/__schema37"
    },
    "settings": {
      "$ref": "#/definitions/__schema38"
    },
    "moduleId": {
      "$ref": "#/definitions/__schema61",
      "readOnly": true
    },
    "structures": {
      "$ref": "#/definitions/__schema62"
    }
  },
  "required": [
    "id"
  ],
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
  },
  "additionalProperties": false
},
["__schema37"]: {
  "type": "string",
  "minLength": 1
},
["__schema38"]: {
  "type": "object",
  "properties": {
    "messageArea": {
      "$ref": "#/definitions/__schema39"
    },
    "includeInOutput": {
      "$ref": "#/definitions/__schema40"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "padding": {
      "$ref": "#/definitions/__schema41"
    },
    "stripeBackgroundColor": {
      "$ref": "#/definitions/__schema46"
    },
    "contentBackgroundColor": {
      "$ref": "#/definitions/__schema47"
    },
    "backgroundImage": {
      "$ref": "#/definitions/__schema48"
    },
    "contentBorder": {
      "$ref": "#/definitions/__schema58"
    }
  },
  "required": [
    "hideElement"
  ],
  "description": "Stripe-level settings.",
  "additionalProperties": false
},
["stripeSettings"]: {
  "type": "object",
  "properties": {
    "messageArea": {
      "$ref": "#/definitions/__schema39"
    },
    "includeInOutput": {
      "$ref": "#/definitions/__schema40"
    },
    "hideElement": {
      "$ref": "#/definitions/hideElement"
    },
    "padding": {
      "$ref": "#/definitions/__schema41"
    },
    "stripeBackgroundColor": {
      "$ref": "#/definitions/__schema46"
    },
    "contentBackgroundColor": {
      "$ref": "#/definitions/__schema47"
    },
    "backgroundImage": {
      "$ref": "#/definitions/__schema48"
    },
    "contentBorder": {
      "$ref": "#/definitions/__schema58"
    }
  },
  "required": [
    "hideElement"
  ],
  "description": "Stripe-level settings.",
  "additionalProperties": false
},
["__schema39"]: {
  "type": "string",
  "enum": [
    "header",
    "content",
    "footer",
    "infoArea"
  ]
},
["__schema40"]: {
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
["__schema41"]: {
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
      "$ref": "#/definitions/__schema42"
    },
    "right": {
      "$ref": "#/definitions/__schema43"
    },
    "bottom": {
      "$ref": "#/definitions/__schema44"
    },
    "left": {
      "$ref": "#/definitions/__schema45"
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
["__schema42"]: {
  "type": "number"
},
["__schema43"]: {
  "type": "number"
},
["__schema44"]: {
  "type": "number"
},
["__schema45"]: {
  "type": "number"
},
["__schema46"]: {
  "type": "string",
  "description": "Valid CSS color value that allows transparent values."
},
["colorValueAllowTransparent"]: {
  "type": "string",
  "description": "Valid CSS color value that allows transparent values."
},
["__schema47"]: {
  "type": "string",
  "description": "Valid CSS color value that allows transparent values."
},
["__schema48"]: {
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
["backgroundImage"]: {
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
["__schema49"]: {
  "type": "string"
},
["__schema50"]: {
  "type": [
    "boolean",
    "string"
  ]
}
};

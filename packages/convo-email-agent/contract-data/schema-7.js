import value0 from './schema-4.js';
export default {
["buttons"]: {
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
    "fontSize": {
      "type": "object",
      "properties": {
        "desktop": {
          "type": "number",
          "minimum": 8,
          "maximum": 72
        },
        "mobile": {
          "type": "number",
          "minimum": 8,
          "maximum": 72
        }
      },
      "required": [
        "desktop",
        "mobile"
      ],
      "additionalProperties": false
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
        "right": {
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
        "bottom": {
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
        "left": {
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
    "lightTheme": {
      "type": "object",
      "properties": {
        "buttonColor": {
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
        },
        "hoverButtonStyles": {
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
            },
            "borderColor": {
              "type": "object",
              "properties": {
                "top": {
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
                "right": {
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
                "bottom": {
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
                "left": {
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
            "right": {
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
            "bottom": {
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
            "left": {
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
        },
        "hoverButtonStyles": {
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
            },
            "borderColor": {
              "type": "object",
              "properties": {
                "top": {
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
                "right": {
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
                "bottom": {
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
                "left": {
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
            "right": {
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
            "bottom": {
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
            "left": {
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
}
};

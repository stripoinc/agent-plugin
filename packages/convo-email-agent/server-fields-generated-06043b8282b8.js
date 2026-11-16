// convo-email-agent/src/sdk/validator/server-fields.generated.ts
var serverFields = {
  "editorRevision": "e059fd55ac7162fd1d7679c1d42cc2e5441b2c85",
  "fields": [
    {
      "kind": "stripe",
      "path": "stripeBackgroundGradient",
      "shape": "gradient"
    },
    {
      "kind": "stripe",
      "path": "contentBackgroundGradient",
      "shape": "gradient"
    },
    {
      "kind": "stripe",
      "path": "mobileContentBorder",
      "shape": "border"
    },
    {
      "kind": "stripe",
      "path": "darkTheme.stripeBackgroundGradient",
      "shape": "gradient"
    },
    {
      "kind": "stripe",
      "path": "darkTheme.contentBackgroundGradient",
      "shape": "gradient"
    },
    {
      "kind": "stripe",
      "path": "darkTheme.contentBorderColors",
      "shape": "borderColors"
    },
    {
      "kind": "structure",
      "path": "backgroundGradient",
      "shape": "gradient"
    },
    {
      "kind": "structure",
      "path": "mobileBorder",
      "shape": "border"
    },
    {
      "kind": "structure",
      "path": "darkTheme.backgroundGradient",
      "shape": "gradient"
    },
    {
      "kind": "structure",
      "path": "darkTheme.borderColors",
      "shape": "borderColors"
    },
    {
      "kind": "container",
      "path": "backgroundGradient",
      "shape": "gradient"
    },
    {
      "kind": "container",
      "path": "mobileBorder",
      "shape": "border"
    },
    {
      "kind": "container",
      "path": "darkTheme.backgroundGradient",
      "shape": "gradient"
    },
    {
      "kind": "container",
      "path": "darkTheme.borderColors",
      "shape": "borderColors"
    },
    {
      "kind": "stripe",
      "path": "link",
      "shape": "link"
    },
    {
      "kind": "stripe",
      "path": "lock",
      "shape": "lock"
    },
    {
      "kind": "stripe",
      "path": "smartBlock",
      "shape": "smartBlock"
    },
    {
      "kind": "structure",
      "path": "link",
      "shape": "link"
    },
    {
      "kind": "structure",
      "path": "lock",
      "shape": "lock"
    },
    {
      "kind": "structure",
      "path": "smartBlock",
      "shape": "smartBlock"
    },
    {
      "kind": "container",
      "path": "link",
      "shape": "link"
    },
    {
      "kind": "container",
      "path": "lock",
      "shape": "lock"
    },
    {
      "kind": "container",
      "path": "smartBlock",
      "shape": "smartBlock"
    },
    {
      "kind": "image",
      "path": "darkTheme",
      "shape": "imageDark"
    },
    {
      "kind": "video",
      "path": "darkTheme",
      "shape": "videoDark"
    },
    {
      "kind": "button",
      "path": "darkTheme",
      "shape": "buttonDark"
    },
    {
      "kind": "spacer",
      "path": "darkTheme",
      "shape": "spacerDark"
    },
    {
      "kind": "social",
      "path": "darkTheme",
      "shape": "socialDark"
    },
    {
      "kind": "menu",
      "path": "darkTheme",
      "shape": "menuDark"
    },
    {
      "kind": "menu",
      "path": "items.[].darkTheme",
      "shape": "menuItemDark"
    }
  ],
  "shapes": {
    "gradient": {
      "anyOf": [
        {
          "type": "object",
          "required": [
            "angle",
            "gradientItems",
            "gradientType"
          ],
          "properties": {
            "gradientType": {
              "type": "string",
              "enum": [
                "linear",
                "radial"
              ]
            },
            "angle": {
              "type": "number",
              "minimum": 0,
              "maximum": 359
            },
            "gradientItems": {
              "type": "array",
              "minItems": 2,
              "items": {
                "type": "object",
                "required": [
                  "color",
                  "opacity",
                  "position"
                ],
                "properties": {
                  "position": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 100
                  },
                  "color": {
                    "type": "string"
                  },
                  "opacity": {
                    "type": "number",
                    "minimum": 0,
                    "maximum": 100
                  }
                },
                "additionalProperties": false
              }
            }
          },
          "additionalProperties": false
        },
        {
          "type": "null"
        }
      ]
    },
    "border": {
      "anyOf": [
        {
          "type": "object",
          "required": [
            "bottom",
            "left",
            "right",
            "style",
            "top"
          ],
          "properties": {
            "top": {
              "type": "object",
              "required": [
                "color",
                "width"
              ],
              "properties": {
                "width": {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 100
                },
                "color": {
                  "type": "string"
                }
              },
              "additionalProperties": false
            },
            "right": {
              "type": "object",
              "required": [
                "color",
                "width"
              ],
              "properties": {
                "width": {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 100
                },
                "color": {
                  "type": "string"
                }
              },
              "additionalProperties": false
            },
            "bottom": {
              "type": "object",
              "required": [
                "color",
                "width"
              ],
              "properties": {
                "width": {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 100
                },
                "color": {
                  "type": "string"
                }
              },
              "additionalProperties": false
            },
            "left": {
              "type": "object",
              "required": [
                "color",
                "width"
              ],
              "properties": {
                "width": {
                  "type": "number",
                  "minimum": 0,
                  "maximum": 100
                },
                "color": {
                  "type": "string"
                }
              },
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
          "additionalProperties": false
        },
        {
          "type": "null"
        }
      ]
    },
    "borderColors": {
      "anyOf": [
        {
          "type": "object",
          "required": [
            "bottom",
            "left",
            "right",
            "top"
          ],
          "properties": {
            "top": {
              "type": "string"
            },
            "right": {
              "type": "string"
            },
            "bottom": {
              "type": "string"
            },
            "left": {
              "type": "string"
            }
          },
          "additionalProperties": false
        },
        {
          "type": "null"
        }
      ]
    },
    "link": {
      "anyOf": [
        {
          "type": "object",
          "required": [
            "href"
          ],
          "properties": {
            "href": {
              "type": "string",
              "minLength": 1
            },
            "salesforce": {
              "type": "object",
              "required": [
                "conversion",
                "linkTo",
                "trackingAlias"
              ],
              "properties": {
                "trackingAlias": {
                  "type": "string"
                },
                "linkTo": {
                  "type": "string"
                },
                "conversion": {
                  "type": "boolean"
                }
              },
              "additionalProperties": false
            },
            "calendarEvent": {
              "type": "object",
              "required": [
                "uuid"
              ],
              "properties": {
                "uuid": {
                  "type": "string",
                  "minLength": 1
                },
                "type": {
                  "type": "string",
                  "enum": [
                    "stripo",
                    "google",
                    "outlook",
                    "yahoo",
                    "aol",
                    "apple",
                    "ics"
                  ]
                },
                "event": {
                  "anyOf": [
                    {
                      "type": "object",
                      "required": [
                        "params",
                        "urls",
                        "uuid"
                      ],
                      "properties": {
                        "uuid": {
                          "type": "string",
                          "minLength": 1
                        },
                        "params": {
                          "type": "object",
                          "required": [
                            "description",
                            "end",
                            "start",
                            "title"
                          ],
                          "properties": {
                            "title": {
                              "type": "string"
                            },
                            "description": {
                              "type": "string"
                            },
                            "start": {
                              "type": "string"
                            },
                            "end": {
                              "type": "string"
                            },
                            "location": {
                              "type": "string"
                            },
                            "timezone": {
                              "type": "string"
                            },
                            "onlineEvent": {
                              "type": "boolean"
                            },
                            "allDayEvent": {
                              "type": "boolean"
                            },
                            "repeatSettings": {
                              "type": "object",
                              "required": [
                                "frequency"
                              ],
                              "properties": {
                                "frequency": {
                                  "type": "object",
                                  "required": [
                                    "periodic",
                                    "value"
                                  ],
                                  "properties": {
                                    "periodic": {
                                      "type": "string",
                                      "enum": [
                                        "DAILY",
                                        "WEEKLY",
                                        "MONTHLY",
                                        "YEARLY"
                                      ]
                                    },
                                    "value": {
                                      "type": "integer",
                                      "maximum": 9007199254740991,
                                      "exclusiveMinimum": 0
                                    }
                                  },
                                  "additionalProperties": false
                                },
                                "days": {
                                  "type": "array",
                                  "items": {
                                    "type": "string",
                                    "enum": [
                                      "MO",
                                      "TU",
                                      "WE",
                                      "TH",
                                      "FR",
                                      "SA",
                                      "SU"
                                    ]
                                  }
                                },
                                "ending": {
                                  "type": "object",
                                  "properties": {
                                    "on": {
                                      "type": "string"
                                    },
                                    "after": {
                                      "type": "integer",
                                      "maximum": 9007199254740991,
                                      "exclusiveMinimum": 0
                                    }
                                  },
                                  "additionalProperties": false
                                }
                              },
                              "additionalProperties": false
                            }
                          },
                          "additionalProperties": false
                        },
                        "urls": {
                          "type": "object",
                          "required": [
                            "landingUrl"
                          ],
                          "properties": {
                            "google": {
                              "type": "string"
                            },
                            "yahoo": {
                              "type": "string"
                            },
                            "outlook": {
                              "type": "string"
                            },
                            "aol": {
                              "type": "string"
                            },
                            "ics": {
                              "type": "string"
                            },
                            "apple": {
                              "type": "string"
                            },
                            "landingUrl": {
                              "type": "string",
                              "minLength": 1
                            }
                          },
                          "additionalProperties": false
                        }
                      },
                      "additionalProperties": false
                    },
                    {
                      "type": "null"
                    }
                  ]
                }
              },
              "additionalProperties": false
            }
          },
          "additionalProperties": false
        },
        {
          "type": "null"
        }
      ]
    },
    "lock": {
      "type": "object",
      "required": [
        "enabled",
        "options"
      ],
      "properties": {
        "enabled": {
          "type": "boolean"
        },
        "options": {
          "type": "object",
          "required": [
            "preventContentEdit",
            "preventStyleEdit"
          ],
          "properties": {
            "preventContentEdit": {
              "type": "boolean"
            },
            "preventStyleEdit": {
              "type": "boolean"
            }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "smartBlock": {
      "anyOf": [
        {
          "type": "object",
          "required": [
            "blockMappings",
            "dataSourceName",
            "dataSourceType",
            "sourceType",
            "value",
            "variables"
          ],
          "properties": {
            "blockMappings": {
              "type": "array",
              "items": {
                "type": "object",
                "required": [
                  "selector"
                ],
                "properties": {
                  "selector": {
                    "type": "string"
                  },
                  "attribute": {
                    "type": "string"
                  },
                  "custom": {
                    "type": "boolean"
                  }
                },
                "additionalProperties": false
              }
            },
            "value": {
              "type": "string"
            },
            "variables": {
              "type": "array",
              "items": {
                "type": "object",
                "required": [
                  "variable"
                ],
                "properties": {
                  "variable": {
                    "type": "string",
                    "minLength": 1
                  },
                  "name": {
                    "type": "string"
                  },
                  "blockMapping": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "required": [
                        "selector"
                      ],
                      "properties": {
                        "selector": {
                          "type": "string"
                        },
                        "attribute": {
                          "type": "string"
                        },
                        "custom": {
                          "type": "boolean"
                        }
                      },
                      "additionalProperties": false
                    }
                  },
                  "externalMapping": {
                    "type": "object",
                    "properties": {
                      "pageSelector": {
                        "type": "object",
                        "properties": {
                          "selector": {
                            "type": "string"
                          },
                          "attribute": {
                            "type": "string"
                          }
                        },
                        "additionalProperties": false
                      },
                      "pageLinkSelector": {
                        "type": "object",
                        "properties": {
                          "selector": {
                            "type": "string"
                          },
                          "attribute": {
                            "type": "string"
                          }
                        },
                        "additionalProperties": false
                      },
                      "modifier": {
                        "type": "object",
                        "properties": {
                          "format": {
                            "type": [
                              "string",
                              "null"
                            ]
                          },
                          "formatSeparator": {
                            "type": "string"
                          },
                          "regexs": {
                            "type": "array",
                            "items": {
                              "type": "object",
                              "properties": {
                                "regex": {
                                  "type": "string"
                                },
                                "replacement": {
                                  "type": "string"
                                },
                                "replaceAll": {
                                  "type": "boolean"
                                }
                              },
                              "additionalProperties": false
                            }
                          }
                        },
                        "additionalProperties": false
                      }
                    },
                    "additionalProperties": false
                  },
                  "htmlSupport": {
                    "type": "boolean"
                  },
                  "dataFeedField": {
                    "type": "string"
                  }
                },
                "additionalProperties": false
              }
            },
            "sourceType": {
              "anyOf": [
                {
                  "type": "number",
                  "const": 0
                },
                {
                  "type": "number",
                  "const": 1
                },
                {
                  "type": "number",
                  "const": 2
                }
              ]
            },
            "dataSourceName": {
              "type": "string"
            },
            "dataSourceType": {
              "type": "string"
            },
            "values": {
              "type": "object",
              "additionalProperties": {
                "type": "string"
              }
            }
          },
          "additionalProperties": false
        },
        {
          "type": "null"
        }
      ]
    },
    "imageDark": {
      "type": "object",
      "properties": {
        "src": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        }
      },
      "additionalProperties": false
    },
    "videoDark": {
      "type": "object",
      "properties": {
        "customThumbnail": {
          "anyOf": [
            {
              "type": "object",
              "required": [
                "src"
              ],
              "properties": {
                "src": {
                  "type": "string"
                }
              },
              "additionalProperties": false
            },
            {
              "type": "null"
            }
          ]
        }
      },
      "additionalProperties": false
    },
    "buttonDark": {
      "type": "object",
      "properties": {
        "backgroundColor": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "fontColor": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "border": {
          "type": "object",
          "properties": {
            "top": {
              "type": "object",
              "properties": {
                "color": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ]
                }
              },
              "additionalProperties": false
            },
            "right": {
              "type": "object",
              "properties": {
                "color": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ]
                }
              },
              "additionalProperties": false
            },
            "bottom": {
              "type": "object",
              "properties": {
                "color": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ]
                }
              },
              "additionalProperties": false
            },
            "left": {
              "type": "object",
              "properties": {
                "color": {
                  "anyOf": [
                    {
                      "type": "string"
                    },
                    {
                      "type": "null"
                    }
                  ]
                }
              },
              "additionalProperties": false
            }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "spacerDark": {
      "type": "object",
      "properties": {
        "backgroundColor": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "border": {
          "type": "object",
          "properties": {
            "color": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "socialDark": {
      "type": "object",
      "properties": {
        "backgroundColor": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        }
      },
      "additionalProperties": false
    },
    "menuDark": {
      "type": "object",
      "properties": {
        "backgroundColor": {
          "anyOf": [
            {
              "type": "string"
            },
            {
              "type": "null"
            }
          ]
        },
        "colors": {
          "type": "object",
          "properties": {
            "link": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "additionalProperties": false
        },
        "separator": {
          "type": "object",
          "properties": {
            "color": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    },
    "menuItemDark": {
      "type": "object",
      "properties": {
        "colors": {
          "type": "object",
          "properties": {
            "link": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            },
            "background": {
              "anyOf": [
                {
                  "type": "string"
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "additionalProperties": false
        }
      },
      "additionalProperties": false
    }
  }
};

export {
  serverFields
};

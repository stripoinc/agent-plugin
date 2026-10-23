import value0 from './schema-1.js';
export default {
["$schema"]: "http://json-schema.org/draft-07/schema#",
["type"]: "object",
["properties"]: {
  "metadata": {
    "$ref": "#/definitions/__schema0"
  },
  "resources": {
    "$ref": "#/definitions/__schema5"
  },
  "settings": {
    "$ref": "#/definitions/__schema11"
  },
  "stripes": {
    "$ref": "#/definitions/__schema35"
  }
},
["required"]: [
  "settings"
],
["additionalProperties"]: false,
["definitions"]: value0,
["description"]: "Runtime JSON schema used by the Editor Copilot API.",
["title"]: "Stripo Email Template Schema"
};

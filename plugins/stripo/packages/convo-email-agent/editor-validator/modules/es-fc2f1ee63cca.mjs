import {
  joinValues,
  parsedType,
  stringifyPrimitive
} from "./core-d6ef11a90708.mjs";

// editor/ui-editor-ui/node_modules/zod/v4/locales/es.js
var error = () => {
  const Sizable = {
    string: { unit: "caracteres", verb: "tener" },
    file: { unit: "bytes", verb: "tener" },
    array: { unit: "elementos", verb: "tener" },
    set: { unit: "elementos", verb: "tener" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "entrada",
    email: "direcci\xF3n de correo electr\xF3nico",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "fecha y hora ISO",
    date: "fecha ISO",
    time: "hora ISO",
    duration: "duraci\xF3n ISO",
    ipv4: "direcci\xF3n IPv4",
    ipv6: "direcci\xF3n IPv6",
    mac: "direcci\xF3n MAC",
    cidrv4: "rango IPv4",
    cidrv6: "rango IPv6",
    base64: "cadena codificada en base64",
    base64url: "URL codificada en base64",
    json_string: "cadena JSON",
    e164: "n\xFAmero E.164",
    credit_card: "n\xFAmero de tarjeta de cr\xE9dito",
    jwt: "JWT",
    template_literal: "entrada"
  };
  const TypeDictionary = {
    nan: "NaN",
    string: "texto",
    number: "n\xFAmero",
    boolean: "booleano",
    array: "arreglo",
    object: "objeto",
    set: "conjunto",
    file: "archivo",
    date: "fecha",
    bigint: "n\xFAmero grande",
    symbol: "s\xEDmbolo",
    undefined: "indefinido",
    null: "nulo",
    function: "funci\xF3n",
    map: "mapa",
    record: "registro",
    tuple: "tupla",
    enum: "enumeraci\xF3n",
    union: "uni\xF3n",
    literal: "literal",
    promise: "promesa",
    void: "vac\xEDo",
    never: "nunca",
    unknown: "desconocido",
    any: "cualquiera"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Entrada inv\xE1lida: se esperaba instanceof ".concat(issue.expected, ", recibido ").concat(received);
        }
        return "Entrada inv\xE1lida: se esperaba ".concat(expected, ", recibido ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Entrada inv\xE1lida: se esperaba ".concat(stringifyPrimitive(issue.values[0]));
        return "Opci\xF3n inv\xE1lida: se esperaba una de ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        const origin = TypeDictionary[issue.origin] ?? issue.origin;
        if (sizing)
          return "Demasiado grande: se esperaba que ".concat(origin ?? "valor", " tuviera ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "elementos");
        return "Demasiado grande: se esperaba que ".concat(origin ?? "valor", " fuera ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        const origin = TypeDictionary[issue.origin] ?? issue.origin;
        if (sizing) {
          return "Demasiado peque\xF1o: se esperaba que ".concat(origin, " tuviera ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        }
        return "Demasiado peque\xF1o: se esperaba que ".concat(origin, " fuera ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'Cadena inv\xE1lida: debe comenzar con "'.concat(_issue.prefix, '"');
        if (_issue.format === "ends_with")
          return 'Cadena inv\xE1lida: debe terminar en "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'Cadena inv\xE1lida: debe incluir "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "Cadena inv\xE1lida: debe coincidir con el patr\xF3n ".concat(_issue.pattern);
        return "Inv\xE1lido ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "N\xFAmero inv\xE1lido: debe ser m\xFAltiplo de ".concat(issue.divisor);
      case "unrecognized_keys":
        return "Llave".concat(issue.keys.length > 1 ? "s" : "", " desconocida").concat(issue.keys.length > 1 ? "s" : "", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Llave inv\xE1lida en ".concat(TypeDictionary[issue.origin] ?? issue.origin);
      case "invalid_union":
        return "Entrada inv\xE1lida";
      case "invalid_element":
        return "Valor inv\xE1lido en ".concat(TypeDictionary[issue.origin] ?? issue.origin);
      default:
        return "Entrada inv\xE1lida";
    }
  };
};
function es_default() {
  return {
    localeError: error()
  };
}

export {
  es_default
};

import {
  joinValues,
  parsedType,
  stringifyPrimitive
} from "./core-d6ef11a90708.mjs";

// editor/ui-editor-ui/node_modules/zod/v4/locales/pt.js
var error = () => {
  const Sizable = {
    string: { unit: "caracteres" },
    file: { unit: "bytes" },
    array: { unit: "elementos" },
    set: { unit: "elementos" },
    map: { unit: "entradas" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "a entrada",
    email: "o endere\xE7o de e-mail",
    url: "o URL",
    emoji: "o emoji",
    uuid: "o UUID",
    uuidv4: "o UUIDv4",
    uuidv6: "o UUIDv6",
    nanoid: "o nanoid",
    guid: "o GUID",
    cuid: "o cuid",
    cuid2: "o cuid2",
    ulid: "o ULID",
    xid: "o XID",
    ksuid: "o KSUID",
    datetime: "a data e hora ISO",
    date: "a data ISO",
    time: "a hora ISO",
    duration: "a dura\xE7\xE3o ISO",
    ipv4: "o endere\xE7o IPv4",
    ipv6: "o endere\xE7o IPv6",
    mac: "o endere\xE7o MAC",
    cidrv4: "o intervalo de endere\xE7os IPv4",
    cidrv6: "o intervalo de endere\xE7os IPv6",
    base64: "o texto codificado em base64",
    base64url: "o texto codificado em base64url",
    json_string: "o texto JSON",
    e164: "o n\xFAmero E.164",
    credit_card: "o n\xFAmero de cart\xE3o de cr\xE9dito",
    jwt: "o JWT",
    template_literal: "a entrada"
  };
  const Gender = {
    masculine: { definite: "o", indefinite: "um" },
    feminine: { definite: "a", indefinite: "uma" }
  };
  const TypeDictionary = {
    string: { name: "texto", articles: Gender.masculine },
    number: { name: "n\xFAmero", articles: Gender.masculine },
    int: { name: "n\xFAmero inteiro", articles: Gender.masculine },
    boolean: { name: "valor booleano", articles: Gender.masculine },
    bigint: { name: "n\xFAmero bigint", articles: Gender.masculine },
    symbol: { name: "s\xEDmbolo", articles: Gender.masculine },
    undefined: { name: 'valor "undefined"', articles: Gender.masculine },
    null: { name: 'valor "nulo"', articles: Gender.masculine },
    never: { name: 'valor "never"', articles: Gender.masculine },
    void: { name: 'valor "void"', articles: Gender.masculine },
    date: { name: "data", articles: Gender.feminine },
    array: { name: "vetor", articles: Gender.masculine },
    object: { name: "objeto", articles: Gender.masculine },
    tuple: { name: "tuplo", articles: Gender.masculine },
    record: { name: "registo", articles: Gender.masculine },
    map: { name: "mapa", articles: Gender.masculine },
    set: { name: "conjunto", articles: Gender.masculine },
    file: { name: "ficheiro", articles: Gender.masculine },
    nonoptional: { name: "valor n\xE3o opcional", articles: Gender.masculine },
    nan: { name: 'valor "NaN"', articles: Gender.masculine },
    // Compatibility: "nan" -> "NaN" for display
    function: { name: "fun\xE7\xE3o", articles: Gender.feminine }
  };
  function translateOriginWithArticle(type, articleType) {
    const translatedValue = TypeDictionary[type] ?? { name: 'valor "'.concat(type, '"'), articles: Gender.masculine };
    return "".concat(translatedValue.articles[articleType], " ").concat(translatedValue.name);
  }
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = translateOriginWithArticle(issue.expected, "indefinite");
        const receivedType = parsedType(issue.input);
        const received = translateOriginWithArticle(receivedType, "indefinite");
        return "Entrada inv\xE1lida: esperava ".concat(expected, ", recebeu ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Entrada inv\xE1lida: esperava ".concat(stringifyPrimitive(issue.values[0]));
        return "Op\xE7\xE3o inv\xE1lida: esperava uma das seguintes op\xE7\xF5es: ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "Demasiado grande: esperava que ".concat(translateOriginWithArticle(issue.origin, "definite"), " tivesse ").concat(adj, " ").concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "elementos");
        return "Demasiado grande: esperava que ".concat(translateOriginWithArticle(issue.origin, "definite"), " fosse ").concat(adj, " ").concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Demasiado pequeno: esperava que ".concat(translateOriginWithArticle(issue.origin, "definite"), " tivesse ").concat(adj, " ").concat(issue.minimum.toString(), " ").concat(sizing.unit ?? "elementos");
        }
        return "Demasiado pequeno: esperava que ".concat(translateOriginWithArticle(issue.origin, "definite"), " fosse ").concat(adj, " ").concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'Texto inv\xE1lido: deve come\xE7ar por "'.concat(_issue.prefix, '"');
        if (_issue.format === "ends_with")
          return 'Texto inv\xE1lido: deve terminar em "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'Texto inv\xE1lido: deve incluir "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "Texto inv\xE1lido: deve corresponder ao padr\xE3o ".concat(_issue.pattern);
        return "Formato d".concat(FormatDictionary[_issue.format] ?? issue.format, " inv\xE1lido");
      }
      case "not_multiple_of":
        return "N\xFAmero inv\xE1lido: deve ser m\xFAltiplo de ".concat(issue.divisor);
      case "unrecognized_keys": {
        const plural = issue.keys.length > 1 ? "s" : "";
        return "Chave".concat(plural, " inv\xE1lida").concat(plural, ": ").concat(joinValues(issue.keys, ", "));
      }
      case "invalid_key":
        return "Entrada inv\xE1lida n".concat(translateOriginWithArticle(issue.origin, "definite"));
      case "invalid_union":
        if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) {
          const opts = issue.options.map((o) => "'".concat(o, "'")).join(" | ");
          return "Valor de discrimina\xE7\xE3o inv\xE1lido. Esperava ".concat(opts);
        }
        return "Entrada inv\xE1lida";
      case "invalid_element":
        return "Entrada inv\xE1lida n".concat(translateOriginWithArticle(issue.origin, "definite"));
      default:
        return "Entrada inv\xE1lida";
    }
  };
};
function pt_default() {
  return {
    localeError: error()
  };
}

export {
  pt_default
};

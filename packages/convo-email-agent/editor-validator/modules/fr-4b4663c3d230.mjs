import {
  joinValues,
  parsedType,
  stringifyPrimitive
} from "./core-d6ef11a90708.mjs";

// editor/ui-editor-ui/node_modules/zod/v4/locales/fr.js
var error = () => {
  const Sizable = {
    string: { unit: "caract\xE8res", verb: "avoir" },
    file: { unit: "octets", verb: "avoir" },
    array: { unit: "\xE9l\xE9ments", verb: "avoir" },
    set: { unit: "\xE9l\xE9ments", verb: "avoir" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "expression r\xE9guli\xE8re",
    email: "adresse e-mail",
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
    datetime: "date et heure ISO",
    date: "date ISO",
    time: "heure ISO",
    duration: "dur\xE9e ISO",
    ipv4: "adresse IPv4",
    ipv6: "adresse IPv6",
    mac: "adresse MAC",
    cidrv4: "plage IPv4",
    cidrv6: "plage IPv6",
    base64: "cha\xEEne de caract\xE8res encod\xE9e en base64",
    base64url: "cha\xEEne de caract\xE8res encod\xE9e en base64url",
    json_string: "cha\xEEne de caract\xE8res JSON",
    e164: "num\xE9ro au format E.164",
    credit_card: "num\xE9ro de carte de cr\xE9dit",
    jwt: "JWT",
    template_literal: "entr\xE9e"
  };
  const TypeDictionary = {
    string: "cha\xEEne de caract\xE8res",
    number: "nombre",
    int: "entier",
    boolean: "bool\xE9en",
    bigint: "grand entier",
    symbol: "symbole",
    undefined: "ind\xE9fini",
    null: "null",
    never: "jamais",
    void: "vide",
    date: "date",
    array: "tableau",
    object: "objet",
    tuple: "tuple",
    record: "record",
    map: "map",
    set: "ensemble",
    file: "fichier",
    nonoptional: "non optionnel",
    nan: "NaN",
    function: "fonction"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Entr\xE9e invalide : instance de ".concat(issue.expected, " attendu, ").concat(received, " re\xE7u");
        }
        return "Entr\xE9e invalide : ".concat(expected, " attendu, ").concat(received, " re\xE7u");
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Entr\xE9e invalide : ".concat(stringifyPrimitive(issue.values[0]), " attendu");
        return "Option invalide : une valeur parmi ".concat(joinValues(issue.values, "|"), " attendue");
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "Trop grand : ".concat(TypeDictionary[issue.origin] ?? "valeur", " doit ").concat(sizing.verb, " ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "\xE9l\xE9ment(s)");
        return "Trop grand : ".concat(TypeDictionary[issue.origin] ?? "valeur", " doit \xEAtre ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "Trop petit : ".concat(TypeDictionary[issue.origin] ?? "valeur", " doit ").concat(sizing.verb, " ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit);
        return "Trop petit : ".concat(TypeDictionary[issue.origin] ?? "valeur", " doit \xEAtre ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'Cha\xEEne de caract\xE8res invalide : doit commencer par "'.concat(_issue.prefix, '"');
        if (_issue.format === "ends_with")
          return 'Cha\xEEne de caract\xE8res invalide : doit se terminer par "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'Cha\xEEne de caract\xE8res invalide : doit inclure "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "Cha\xEEne de caract\xE8res invalide : doit correspondre au motif ".concat(_issue.pattern);
        return "".concat(FormatDictionary[_issue.format] ?? issue.format, " invalide");
      }
      case "not_multiple_of":
        return "Nombre invalide : doit \xEAtre un multiple de ".concat(issue.divisor);
      case "unrecognized_keys":
        return "Cl\xE9".concat(issue.keys.length > 1 ? "s" : "", " non reconnue").concat(issue.keys.length > 1 ? "s" : "", " : ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Cl\xE9 invalide dans ".concat(issue.origin);
      case "invalid_union":
        return "Entr\xE9e invalide";
      case "invalid_element":
        return "Valeur invalide dans ".concat(issue.origin);
      default:
        return "Entr\xE9e invalide";
    }
  };
};
function fr_default() {
  return {
    localeError: error()
  };
}

export {
  fr_default
};

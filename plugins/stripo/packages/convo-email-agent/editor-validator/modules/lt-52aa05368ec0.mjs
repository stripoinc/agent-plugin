import {
  joinValues,
  parsedType,
  stringifyPrimitive
} from "./core-d6ef11a90708.mjs";

// editor/ui-editor-ui/node_modules/zod/v4/locales/lt.js
var capitalizeFirstCharacter = (text) => {
  return text.charAt(0).toUpperCase() + text.slice(1);
};
function getUnitTypeFromNumber(number) {
  const abs = Math.abs(number);
  const last = abs % 10;
  const last2 = abs % 100;
  if (last2 >= 11 && last2 <= 19 || last === 0)
    return "many";
  if (last === 1)
    return "one";
  return "few";
}
var error = () => {
  const Sizable = {
    string: {
      unit: {
        one: "simbolis",
        few: "simboliai",
        many: "simboli\u0173"
      },
      verb: {
        smaller: {
          inclusive: "turi b\u016Bti ne ilgesn\u0117 kaip",
          notInclusive: "turi b\u016Bti trumpesn\u0117 kaip"
        },
        bigger: {
          inclusive: "turi b\u016Bti ne trumpesn\u0117 kaip",
          notInclusive: "turi b\u016Bti ilgesn\u0117 kaip"
        }
      }
    },
    file: {
      unit: {
        one: "baitas",
        few: "baitai",
        many: "bait\u0173"
      },
      verb: {
        smaller: {
          inclusive: "turi b\u016Bti ne didesnis kaip",
          notInclusive: "turi b\u016Bti ma\u017Eesnis kaip"
        },
        bigger: {
          inclusive: "turi b\u016Bti ne ma\u017Eesnis kaip",
          notInclusive: "turi b\u016Bti didesnis kaip"
        }
      }
    },
    array: {
      unit: {
        one: "element\u0105",
        few: "elementus",
        many: "element\u0173"
      },
      verb: {
        smaller: {
          inclusive: "turi tur\u0117ti ne daugiau kaip",
          notInclusive: "turi tur\u0117ti ma\u017Eiau kaip"
        },
        bigger: {
          inclusive: "turi tur\u0117ti ne ma\u017Eiau kaip",
          notInclusive: "turi tur\u0117ti daugiau kaip"
        }
      }
    },
    set: {
      unit: {
        one: "element\u0105",
        few: "elementus",
        many: "element\u0173"
      },
      verb: {
        smaller: {
          inclusive: "turi tur\u0117ti ne daugiau kaip",
          notInclusive: "turi tur\u0117ti ma\u017Eiau kaip"
        },
        bigger: {
          inclusive: "turi tur\u0117ti ne ma\u017Eiau kaip",
          notInclusive: "turi tur\u0117ti daugiau kaip"
        }
      }
    }
  };
  function getSizing(origin, unitType, inclusive, targetShouldBe) {
    const result = Sizable[origin] ?? null;
    if (result === null)
      return result;
    return {
      unit: result.unit[unitType],
      verb: result.verb[targetShouldBe][inclusive ? "inclusive" : "notInclusive"]
    };
  }
  const FormatDictionary = {
    regex: "\u012Fvestis",
    email: "el. pa\u0161to adresas",
    url: "URL",
    emoji: "jaustukas",
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
    datetime: "ISO data ir laikas",
    date: "ISO data",
    time: "ISO laikas",
    duration: "ISO trukm\u0117",
    ipv4: "IPv4 adresas",
    ipv6: "IPv6 adresas",
    mac: "MAC adresas",
    cidrv4: "IPv4 tinklo prefiksas (CIDR)",
    cidrv6: "IPv6 tinklo prefiksas (CIDR)",
    base64: "base64 u\u017Ekoduota eilut\u0117",
    base64url: "base64url u\u017Ekoduota eilut\u0117",
    json_string: "JSON eilut\u0117",
    e164: "E.164 numeris",
    credit_card: "kredito kortel\u0117s numeris",
    jwt: "JWT",
    template_literal: "\u012Fvestis"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "skai\u010Dius",
    bigint: "sveikasis skai\u010Dius",
    string: "eilut\u0117",
    boolean: "login\u0117 reik\u0161m\u0117",
    undefined: "neapibr\u0117\u017Eta reik\u0161m\u0117",
    function: "funkcija",
    symbol: "simbolis",
    array: "masyvas",
    object: "objektas",
    null: "nulin\u0117 reik\u0161m\u0117"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Gautas tipas ".concat(received, ", o tik\u0117tasi - instanceof ").concat(issue.expected);
        }
        return "Gautas tipas ".concat(received, ", o tik\u0117tasi - ").concat(expected);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Privalo b\u016Bti ".concat(stringifyPrimitive(issue.values[0]));
        return "Privalo b\u016Bti vienas i\u0161 ".concat(joinValues(issue.values, "|"), " pasirinkim\u0173");
      case "too_big": {
        const origin = TypeDictionary[issue.origin] ?? issue.origin;
        const sizing = getSizing(issue.origin, getUnitTypeFromNumber(Number(issue.maximum)), issue.inclusive ?? false, "smaller");
        if (sizing?.verb)
          return "".concat(capitalizeFirstCharacter(origin ?? issue.origin ?? "reik\u0161m\u0117"), " ").concat(sizing.verb, " ").concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "element\u0173");
        const adj = issue.inclusive ? "ne didesnis kaip" : "ma\u017Eesnis kaip";
        return "".concat(capitalizeFirstCharacter(origin ?? issue.origin ?? "reik\u0161m\u0117"), " turi b\u016Bti ").concat(adj, " ").concat(issue.maximum.toString(), " ").concat(sizing?.unit);
      }
      case "too_small": {
        const origin = TypeDictionary[issue.origin] ?? issue.origin;
        const sizing = getSizing(issue.origin, getUnitTypeFromNumber(Number(issue.minimum)), issue.inclusive ?? false, "bigger");
        if (sizing?.verb)
          return "".concat(capitalizeFirstCharacter(origin ?? issue.origin ?? "reik\u0161m\u0117"), " ").concat(sizing.verb, " ").concat(issue.minimum.toString(), " ").concat(sizing.unit ?? "element\u0173");
        const adj = issue.inclusive ? "ne ma\u017Eesnis kaip" : "didesnis kaip";
        return "".concat(capitalizeFirstCharacter(origin ?? issue.origin ?? "reik\u0161m\u0117"), " turi b\u016Bti ").concat(adj, " ").concat(issue.minimum.toString(), " ").concat(sizing?.unit);
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return 'Eilut\u0117 privalo prasid\u0117ti "'.concat(_issue.prefix, '"');
        }
        if (_issue.format === "ends_with")
          return 'Eilut\u0117 privalo pasibaigti "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'Eilut\u0117 privalo \u012Ftraukti "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "Eilut\u0117 privalo atitikti ".concat(_issue.pattern);
        return "Neteisingas ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Skai\u010Dius privalo b\u016Bti ".concat(issue.divisor, " kartotinis.");
      case "unrecognized_keys":
        return "Neatpa\u017Eint".concat(issue.keys.length > 1 ? "i" : "as", " rakt").concat(issue.keys.length > 1 ? "ai" : "as", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Rastas klaidingas raktas";
      case "invalid_union":
        return "Klaidinga \u012Fvestis";
      case "invalid_element": {
        const origin = TypeDictionary[issue.origin] ?? issue.origin;
        return "".concat(capitalizeFirstCharacter(origin ?? issue.origin ?? "reik\u0161m\u0117"), " turi klaiding\u0105 \u012Fvest\u012F");
      }
      default:
        return "Klaidinga \u012Fvestis";
    }
  };
};
function lt_default() {
  return {
    localeError: error()
  };
}

export {
  lt_default
};

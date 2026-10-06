import {
  joinValues,
  parsedType,
  stringifyPrimitive
} from "./core-d6ef11a90708.mjs";

// editor/ui-editor-ui/node_modules/zod/v4/locales/pl.js
var error = () => {
  const Sizable = {
    string: { unit: "znak\xF3w", verb: "mie\u0107" },
    file: { unit: "bajt\xF3w", verb: "mie\u0107" },
    array: { unit: "element\xF3w", verb: "mie\u0107" },
    set: { unit: "element\xF3w", verb: "mie\u0107" },
    map: { unit: "element\xF3w", verb: "mie\u0107" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "wyra\u017Cenie",
    email: "adres email",
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
    datetime: "data i godzina w formacie ISO",
    date: "data w formacie ISO",
    time: "godzina w formacie ISO",
    duration: "czas trwania ISO",
    ipv4: "adres IPv4",
    ipv6: "adres IPv6",
    mac: "adres MAC",
    cidrv4: "zakres IPv4",
    cidrv6: "zakres IPv6",
    base64: "ci\u0105g znak\xF3w zakodowany w formacie base64",
    base64url: "ci\u0105g znak\xF3w zakodowany w formacie base64url",
    json_string: "ci\u0105g znak\xF3w w formacie JSON",
    e164: "liczba E.164",
    credit_card: "numer karty kredytowej",
    jwt: "JWT",
    template_literal: "wej\u015Bcie"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "liczba",
    array: "tablica"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano instanceof ".concat(issue.expected, ", otrzymano ").concat(received);
        }
        return "Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano ".concat(expected, ", otrzymano ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "Nieprawid\u0142owe dane wej\u015Bciowe: oczekiwano ".concat(stringifyPrimitive(issue.values[0]));
        return "Nieprawid\u0142owa opcja: oczekiwano jednej z warto\u015Bci ".concat(joinValues(issue.values, "|"));
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Za du\u017Ca warto\u015B\u0107: oczekiwano, \u017Ce ".concat(issue.origin ?? "warto\u015B\u0107", " b\u0119dzie mie\u0107 ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "element\xF3w");
        }
        return "Zbyt du\u017C(y/a/e): oczekiwano, \u017Ce ".concat(issue.origin ?? "warto\u015B\u0107", " b\u0119dzie wynosi\u0107 ").concat(adj).concat(issue.maximum.toString());
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "Za ma\u0142a warto\u015B\u0107: oczekiwano, \u017Ce ".concat(issue.origin ?? "warto\u015B\u0107", " b\u0119dzie mie\u0107 ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit ?? "element\xF3w");
        }
        return "Zbyt ma\u0142(y/a/e): oczekiwano, \u017Ce ".concat(issue.origin ?? "warto\u015B\u0107", " b\u0119dzie wynosi\u0107 ").concat(adj).concat(issue.minimum.toString());
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with")
          return 'Nieprawid\u0142owy ci\u0105g znak\xF3w: musi zaczyna\u0107 si\u0119 od "'.concat(_issue.prefix, '"');
        if (_issue.format === "ends_with")
          return 'Nieprawid\u0142owy ci\u0105g znak\xF3w: musi ko\u0144czy\u0107 si\u0119 na "'.concat(_issue.suffix, '"');
        if (_issue.format === "includes")
          return 'Nieprawid\u0142owy ci\u0105g znak\xF3w: musi zawiera\u0107 "'.concat(_issue.includes, '"');
        if (_issue.format === "regex")
          return "Nieprawid\u0142owy ci\u0105g znak\xF3w: musi odpowiada\u0107 wzorcowi ".concat(_issue.pattern);
        return "Nieprawid\u0142ow(y/a/e) ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "Nieprawid\u0142owa liczba: musi by\u0107 wielokrotno\u015Bci\u0105 ".concat(issue.divisor);
      case "unrecognized_keys":
        return "Nierozpoznane klucze".concat(issue.keys.length > 1 ? "s" : "", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "Nieprawid\u0142owy klucz w ".concat(issue.origin);
      case "invalid_union":
        return "Nieprawid\u0142owe dane wej\u015Bciowe";
      case "invalid_element":
        return "Nieprawid\u0142owa warto\u015B\u0107 w ".concat(issue.origin);
      default:
        return "Nieprawid\u0142owe dane wej\u015Bciowe";
    }
  };
};
function pl_default() {
  return {
    localeError: error()
  };
}

export {
  pl_default
};

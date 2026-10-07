import {
  joinValues,
  parsedType,
  stringifyPrimitive
} from "./core-d6ef11a90708.mjs";

// editor/ui-editor-ui/node_modules/zod/v4/locales/gu.js
var error = () => {
  const Sizable = {
    string: { unit: "\u0A85\u0A95\u0ACD\u0AB7\u0AB0", verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F" },
    file: { unit: "\u0AAC\u0ABE\u0AAF\u0A9F", verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F" },
    array: { unit: "\u0A86\u0A87\u0A9F\u0AAE", verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F" },
    set: { unit: "\u0A86\u0A87\u0A9F\u0AAE", verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F" },
    map: { unit: "\u0A8F\u0AA8\u0ACD\u0A9F\u0ACD\u0AB0\u0AC0", verb: "\u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "\u0A87\u0AA8\u0AAA\u0AC1\u0A9F",
    email: "\u0A88\u0AAE\u0AC7\u0A87\u0AB2 \u0A8F\u0AA1\u0ACD\u0AB0\u0AC7\u0AB8",
    url: "URL",
    emoji: "\u0A87\u0AAE\u0ACB\u0A9C\u0AC0",
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
    datetime: "ISO \u0AA4\u0ABE\u0AB0\u0AC0\u0A96 \u0A85\u0AA8\u0AC7 \u0AB8\u0AAE\u0AAF",
    date: "ISO \u0AA4\u0ABE\u0AB0\u0AC0\u0A96",
    time: "ISO \u0AB8\u0AAE\u0AAF",
    duration: "ISO \u0A85\u0AB5\u0AA7\u0ABF",
    ipv4: "IPv4 \u0A8F\u0AA1\u0ACD\u0AB0\u0AC7\u0AB8",
    ipv6: "IPv6 \u0A8F\u0AA1\u0ACD\u0AB0\u0AC7\u0AB8",
    mac: "MAC \u0A8F\u0AA1\u0ACD\u0AB0\u0AC7\u0AB8",
    cidrv4: "IPv4 \u0AB6\u0ACD\u0AB0\u0AC7\u0AA3\u0AC0",
    cidrv6: "IPv6 \u0AB6\u0ACD\u0AB0\u0AC7\u0AA3\u0AC0",
    base64: "base64-\u0A8F\u0AA8\u0ACD\u0A95\u0ACB\u0AA1\u0AC7\u0AA1 \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97",
    base64url: "base64url-\u0A8F\u0AA8\u0ACD\u0A95\u0ACB\u0AA1\u0AC7\u0AA1 \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97",
    json_string: "JSON \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97",
    e164: "E.164 \u0AA8\u0A82\u0AAC\u0AB0",
    credit_card: "\u0A95\u0ACD\u0AB0\u0AC7\u0AA1\u0ABF\u0A9F \u0A95\u0ABE\u0AB0\u0ACD\u0AA1 \u0AA8\u0A82\u0AAC\u0AB0",
    jwt: "JWT",
    template_literal: "\u0A87\u0AA8\u0AAA\u0AC1\u0A9F"
  };
  const TypeDictionary = {
    nan: "NaN"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A87\u0AA8\u0AAA\u0AC1\u0A9F: \u0A85\u0AAA\u0AC7\u0A95\u0ACD\u0AB7\u0ABF\u0AA4 ".concat(expected, ", \u0AAA\u0ACD\u0AB0\u0ABE\u0AAA\u0ACD\u0AA4 ").concat(received);
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A87\u0AA8\u0AAA\u0AC1\u0A9F: \u0A85\u0AAA\u0AC7\u0A95\u0ACD\u0AB7\u0ABF\u0AA4 ".concat(stringifyPrimitive(issue.values[0]));
        return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB5\u0ABF\u0A95\u0AB2\u0ACD\u0AAA: ".concat(joinValues(issue.values, " | "), " \u0AAE\u0ABE\u0AA7\u0ACD\u0AAF\u0AAE\u0AA5\u0AC0 \u0A8F\u0A95 \u0A85\u0AAA\u0AC7\u0A95\u0ACD\u0AB7\u0ABF\u0AA4");
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing)
          return "\u0A96\u0AC2\u0AAC \u0AAE\u0ACB\u0A9F\u0AC1\u0A82: ".concat(issue.origin ?? "\u0AAE\u0AC2\u0AB2\u0ACD\u0AAF", " ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "\u0A8F\u0AB2\u0ABF\u0AAE\u0AC7\u0AA8\u0ACD\u0A9F", " \u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F");
        return "\u0A96\u0AC2\u0AAC \u0AAE\u0ACB\u0A9F\u0AC1\u0A82: ".concat(issue.origin ?? "\u0AAE\u0AC2\u0AB2\u0ACD\u0AAF", " ").concat(adj).concat(issue.maximum.toString(), " \u0AB9\u0ACB\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F");
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "\u0A96\u0AC2\u0AAC \u0AA8\u0ABE\u0AA8\u0AC1\u0A82: ".concat(issue.origin, " ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit, " \u0AB9\u0ACB\u0AB5\u0ABE \u0A9C\u0ACB\u0A88\u0A8F");
        }
        return "\u0A96\u0AC2\u0AAC \u0AA8\u0ABE\u0AA8\u0AC1\u0A82: ".concat(issue.origin, " ").concat(adj).concat(issue.minimum.toString(), " \u0AB9\u0ACB\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F");
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return '\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97: "'.concat(_issue.prefix, '" \u0AA5\u0AC0 \u0AB6\u0AB0\u0AC2 \u0AA5\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F');
        }
        if (_issue.format === "ends_with")
          return '\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97: "'.concat(_issue.suffix, '" \u0AAA\u0AB0 \u0AB8\u0AAE\u0ABE\u0AAA\u0ACD\u0AA4 \u0AA5\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F');
        if (_issue.format === "includes")
          return '\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97: "'.concat(_issue.includes, '" \u0AB6\u0ABE\u0AAE\u0AC7\u0AB2 \u0AB9\u0ACB\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F');
        if (_issue.format === "regex")
          return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AB8\u0ACD\u0A9F\u0ACD\u0AB0\u0ABF\u0A82\u0A97: \u0AAA\u0AC7\u0A9F\u0AB0\u0ACD\u0AA8 ".concat(_issue.pattern, " \u0AB8\u0ABE\u0AA5\u0AC7 \u0AAE\u0AC7\u0AB3 \u0A96\u0ABE\u0AB5\u0AC1\u0A82 \u0A9C\u0ACB\u0A88\u0A8F");
        return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AA8\u0A82\u0AAC\u0AB0: ".concat(issue.divisor, " \u0AA8\u0ACB \u0A97\u0AC1\u0AA3\u0ABE\u0A82\u0A95 \u0AB9\u0ACB\u0AB5\u0ACB \u0A9C\u0ACB\u0A88\u0A8F");
      case "unrecognized_keys":
        return "\u0A93\u0AB3\u0A96\u0AC0 \u0AB6\u0A95\u0ABE\u0AA4\u0ABE \u0AA8\u0AB9\u0AC0\u0A82 \u0AA4\u0AC7 \u0A95\u0AC0".concat(issue.keys.length > 1 ? "\u0A93" : "", ": ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "".concat(issue.origin, " \u0AAE\u0ABE\u0A82 \u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A95\u0AC0");
      case "invalid_union":
        if (issue.options && Array.isArray(issue.options) && issue.options.length > 0) {
          const opts = issue.options.map((o) => "'".concat(o, "'")).join(" | ");
          return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AA1\u0ABF\u0AB8\u0ACD\u0A95\u0ACD\u0AB0\u0ABF\u0AAE\u0ABF\u0AA8\u0AC7\u0A9F\u0AB0 \u0AAE\u0AC2\u0AB2\u0ACD\u0AAF. \u0A85\u0AAA\u0AC7\u0A95\u0ACD\u0AB7\u0ABF\u0AA4 ".concat(opts);
        }
        return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A87\u0AA8\u0AAA\u0AC1\u0A9F";
      case "invalid_element":
        return "".concat(issue.origin, " \u0AAE\u0ABE\u0A82 \u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0AAE\u0AC2\u0AB2\u0ACD\u0AAF");
      default:
        return "\u0A85\u0AAE\u0ABE\u0AA8\u0ACD\u0AAF \u0A87\u0AA8\u0AAA\u0AC1\u0A9F";
    }
  };
};
function gu_default() {
  return {
    localeError: error()
  };
}

export {
  gu_default
};

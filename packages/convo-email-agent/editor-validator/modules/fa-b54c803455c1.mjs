import {
  joinValues,
  parsedType,
  stringifyPrimitive
} from "./core-d6ef11a90708.mjs";

// editor/ui-editor-ui/node_modules/zod/v4/locales/fa.js
var error = () => {
  const Sizable = {
    string: { unit: "\u06A9\u0627\u0631\u0627\u06A9\u062A\u0631", verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F" },
    file: { unit: "\u0628\u0627\u06CC\u062A", verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F" },
    array: { unit: "\u0622\u06CC\u062A\u0645", verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F" },
    set: { unit: "\u0622\u06CC\u062A\u0645", verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F" },
    map: { unit: "\u0622\u06CC\u062A\u0645", verb: "\u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "\u0648\u0631\u0648\u062F\u06CC",
    email: "\u0622\u062F\u0631\u0633 \u0627\u06CC\u0645\u06CC\u0644",
    url: "URL",
    emoji: "\u0627\u06CC\u0645\u0648\u062C\u06CC",
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
    datetime: "\u062A\u0627\u0631\u06CC\u062E \u0648 \u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
    date: "\u062A\u0627\u0631\u06CC\u062E \u0627\u06CC\u0632\u0648",
    time: "\u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
    duration: "\u0645\u062F\u062A \u0632\u0645\u0627\u0646 \u0627\u06CC\u0632\u0648",
    ipv4: "IPv4 \u0622\u062F\u0631\u0633",
    ipv6: "IPv6 \u0622\u062F\u0631\u0633",
    mac: "MAC \u0622\u062F\u0631\u0633",
    cidrv4: "IPv4 \u062F\u0627\u0645\u0646\u0647",
    cidrv6: "IPv6 \u062F\u0627\u0645\u0646\u0647",
    base64: "base64-encoded \u0631\u0634\u062A\u0647",
    base64url: "base64url-encoded \u0631\u0634\u062A\u0647",
    json_string: "JSON \u0631\u0634\u062A\u0647",
    e164: "E.164 \u0639\u062F\u062F",
    credit_card: "\u0634\u0645\u0627\u0631\u0647 \u06A9\u0627\u0631\u062A \u0627\u0639\u062A\u0628\u0627\u0631\u06CC",
    jwt: "JWT",
    template_literal: "\u0648\u0631\u0648\u062F\u06CC"
  };
  const TypeDictionary = {
    nan: "NaN",
    number: "\u0639\u062F\u062F",
    array: "\u0622\u0631\u0627\u06CC\u0647"
  };
  return (issue) => {
    switch (issue.code) {
      case "invalid_type": {
        const expected = TypeDictionary[issue.expected] ?? issue.expected;
        const receivedType = parsedType(issue.input);
        const received = TypeDictionary[receivedType] ?? receivedType;
        if (/^[A-Z]/.test(issue.expected)) {
          return "\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A instanceof ".concat(issue.expected, " \u0645\u06CC\u200C\u0628\u0648\u062F\u060C ").concat(received, " \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F");
        }
        return "\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A ".concat(expected, " \u0645\u06CC\u200C\u0628\u0648\u062F\u060C ").concat(received, " \u062F\u0631\u06CC\u0627\u0641\u062A \u0634\u062F");
      }
      case "invalid_value":
        if (issue.values.length === 1) {
          return "\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A ".concat(stringifyPrimitive(issue.values[0]), " \u0645\u06CC\u200C\u0628\u0648\u062F");
        }
        return "\u06AF\u0632\u06CC\u0646\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0645\u06CC\u200C\u0628\u0627\u06CC\u0633\u062A \u06CC\u06A9\u06CC \u0627\u0632 ".concat(joinValues(issue.values, "|"), " \u0645\u06CC\u200C\u0628\u0648\u062F");
      case "too_big": {
        const adj = issue.inclusive ? "<=" : "<";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "\u062E\u06CC\u0644\u06CC \u0628\u0632\u0631\u06AF: ".concat(issue.origin ?? "\u0645\u0642\u062F\u0627\u0631", " \u0628\u0627\u06CC\u062F ").concat(adj).concat(issue.maximum.toString(), " ").concat(sizing.unit ?? "\u0639\u0646\u0635\u0631", " \u0628\u0627\u0634\u062F");
        }
        return "\u062E\u06CC\u0644\u06CC \u0628\u0632\u0631\u06AF: ".concat(issue.origin ?? "\u0645\u0642\u062F\u0627\u0631", " \u0628\u0627\u06CC\u062F ").concat(adj).concat(issue.maximum.toString(), " \u0628\u0627\u0634\u062F");
      }
      case "too_small": {
        const adj = issue.inclusive ? ">=" : ">";
        const sizing = getSizing(issue.origin);
        if (sizing) {
          return "\u062E\u06CC\u0644\u06CC \u06A9\u0648\u0686\u06A9: ".concat(issue.origin, " \u0628\u0627\u06CC\u062F ").concat(adj).concat(issue.minimum.toString(), " ").concat(sizing.unit, " \u0628\u0627\u0634\u062F");
        }
        return "\u062E\u06CC\u0644\u06CC \u06A9\u0648\u0686\u06A9: ".concat(issue.origin, " \u0628\u0627\u06CC\u062F ").concat(adj).concat(issue.minimum.toString(), " \u0628\u0627\u0634\u062F");
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return '\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 "'.concat(_issue.prefix, '" \u0634\u0631\u0648\u0639 \u0634\u0648\u062F');
        }
        if (_issue.format === "ends_with") {
          return '\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 "'.concat(_issue.suffix, '" \u062A\u0645\u0627\u0645 \u0634\u0648\u062F');
        }
        if (_issue.format === "includes") {
          return '\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0634\u0627\u0645\u0644 "'.concat(_issue.includes, '" \u0628\u0627\u0634\u062F');
        }
        if (_issue.format === "regex") {
          return "\u0631\u0634\u062A\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0628\u0627 \u0627\u0644\u06AF\u0648\u06CC ".concat(_issue.pattern, " \u0645\u0637\u0627\u0628\u0642\u062A \u062F\u0627\u0634\u062A\u0647 \u0628\u0627\u0634\u062F");
        }
        return "".concat(FormatDictionary[_issue.format] ?? issue.format, " \u0646\u0627\u0645\u0639\u062A\u0628\u0631");
      }
      case "not_multiple_of":
        return "\u0639\u062F\u062F \u0646\u0627\u0645\u0639\u062A\u0628\u0631: \u0628\u0627\u06CC\u062F \u0645\u0636\u0631\u0628 ".concat(issue.divisor, " \u0628\u0627\u0634\u062F");
      case "unrecognized_keys":
        return "\u06A9\u0644\u06CC\u062F".concat(issue.keys.length > 1 ? "\u0647\u0627\u06CC" : "", " \u0646\u0627\u0634\u0646\u0627\u0633: ").concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "\u06A9\u0644\u06CC\u062F \u0646\u0627\u0634\u0646\u0627\u0633 \u062F\u0631 ".concat(issue.origin);
      case "invalid_union":
        return "\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631";
      case "invalid_element":
        return "\u0645\u0642\u062F\u0627\u0631 \u0646\u0627\u0645\u0639\u062A\u0628\u0631 \u062F\u0631 ".concat(issue.origin);
      default:
        return "\u0648\u0631\u0648\u062F\u06CC \u0646\u0627\u0645\u0639\u062A\u0628\u0631";
    }
  };
};
function fa_default() {
  return {
    localeError: error()
  };
}

export {
  fa_default
};

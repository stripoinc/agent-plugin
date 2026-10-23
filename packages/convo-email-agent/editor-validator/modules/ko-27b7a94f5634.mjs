import {
  joinValues,
  parsedType,
  stringifyPrimitive
} from "./core-d6ef11a90708.mjs";

// editor/ui-editor-ui/node_modules/zod/v4/locales/ko.js
var error = () => {
  const Sizable = {
    string: { unit: "\uBB38\uC790", verb: "to have" },
    file: { unit: "\uBC14\uC774\uD2B8", verb: "to have" },
    array: { unit: "\uAC1C", verb: "to have" },
    set: { unit: "\uAC1C", verb: "to have" },
    map: { unit: "\uAC1C", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "\uC785\uB825",
    email: "\uC774\uBA54\uC77C \uC8FC\uC18C",
    url: "URL",
    emoji: "\uC774\uBAA8\uC9C0",
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
    datetime: "ISO \uB0A0\uC9DC\uC2DC\uAC04",
    date: "ISO \uB0A0\uC9DC",
    time: "ISO \uC2DC\uAC04",
    duration: "ISO \uAE30\uAC04",
    ipv4: "IPv4 \uC8FC\uC18C",
    ipv6: "IPv6 \uC8FC\uC18C",
    mac: "MAC \uC8FC\uC18C",
    cidrv4: "IPv4 \uBC94\uC704",
    cidrv6: "IPv6 \uBC94\uC704",
    base64: "base64 \uC778\uCF54\uB529 \uBB38\uC790\uC5F4",
    base64url: "base64url \uC778\uCF54\uB529 \uBB38\uC790\uC5F4",
    json_string: "JSON \uBB38\uC790\uC5F4",
    e164: "E.164 \uBC88\uD638",
    credit_card: "\uC2E0\uC6A9\uCE74\uB4DC \uBC88\uD638",
    jwt: "JWT",
    template_literal: "\uC785\uB825"
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
        if (/^[A-Z]/.test(issue.expected)) {
          return "\uC798\uBABB\uB41C \uC785\uB825: \uC608\uC0C1 \uD0C0\uC785\uC740 instanceof ".concat(issue.expected, ", \uBC1B\uC740 \uD0C0\uC785\uC740 ").concat(received, "\uC785\uB2C8\uB2E4");
        }
        return "\uC798\uBABB\uB41C \uC785\uB825: \uC608\uC0C1 \uD0C0\uC785\uC740 ".concat(expected, ", \uBC1B\uC740 \uD0C0\uC785\uC740 ").concat(received, "\uC785\uB2C8\uB2E4");
      }
      case "invalid_value":
        if (issue.values.length === 1)
          return "\uC798\uBABB\uB41C \uC785\uB825: \uAC12\uC740 ".concat(stringifyPrimitive(issue.values[0]), " \uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4");
        return "\uC798\uBABB\uB41C \uC635\uC158: ".concat(joinValues(issue.values, "\uB610\uB294 "), " \uC911 \uD558\uB098\uC5EC\uC57C \uD569\uB2C8\uB2E4");
      case "too_big": {
        const adj = issue.inclusive ? "\uC774\uD558" : "\uBBF8\uB9CC";
        const suffix = adj === "\uBBF8\uB9CC" ? "\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4" : "\uC5EC\uC57C \uD569\uB2C8\uB2E4";
        const sizing = getSizing(issue.origin);
        const unit = sizing?.unit ?? "\uC694\uC18C";
        if (sizing)
          return "".concat(issue.origin ?? "\uAC12", "\uC774 \uB108\uBB34 \uD07D\uB2C8\uB2E4: ").concat(issue.maximum.toString()).concat(unit, " ").concat(adj).concat(suffix);
        return "".concat(issue.origin ?? "\uAC12", "\uC774 \uB108\uBB34 \uD07D\uB2C8\uB2E4: ").concat(issue.maximum.toString(), " ").concat(adj).concat(suffix);
      }
      case "too_small": {
        const adj = issue.inclusive ? "\uC774\uC0C1" : "\uCD08\uACFC";
        const suffix = adj === "\uC774\uC0C1" ? "\uC774\uC5B4\uC57C \uD569\uB2C8\uB2E4" : "\uC5EC\uC57C \uD569\uB2C8\uB2E4";
        const sizing = getSizing(issue.origin);
        const unit = sizing?.unit ?? "\uC694\uC18C";
        if (sizing) {
          return "".concat(issue.origin ?? "\uAC12", "\uC774 \uB108\uBB34 \uC791\uC2B5\uB2C8\uB2E4: ").concat(issue.minimum.toString()).concat(unit, " ").concat(adj).concat(suffix);
        }
        return "".concat(issue.origin ?? "\uAC12", "\uC774 \uB108\uBB34 \uC791\uC2B5\uB2C8\uB2E4: ").concat(issue.minimum.toString(), " ").concat(adj).concat(suffix);
      }
      case "invalid_format": {
        const _issue = issue;
        if (_issue.format === "starts_with") {
          return '\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "'.concat(_issue.prefix, '"(\uC73C)\uB85C \uC2DC\uC791\uD574\uC57C \uD569\uB2C8\uB2E4');
        }
        if (_issue.format === "ends_with")
          return '\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "'.concat(_issue.suffix, '"(\uC73C)\uB85C \uB05D\uB098\uC57C \uD569\uB2C8\uB2E4');
        if (_issue.format === "includes")
          return '\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: "'.concat(_issue.includes, '"\uC744(\uB97C) \uD3EC\uD568\uD574\uC57C \uD569\uB2C8\uB2E4');
        if (_issue.format === "regex")
          return "\uC798\uBABB\uB41C \uBB38\uC790\uC5F4: \uC815\uADDC\uC2DD ".concat(_issue.pattern, " \uD328\uD134\uACFC \uC77C\uCE58\uD574\uC57C \uD569\uB2C8\uB2E4");
        return "\uC798\uBABB\uB41C ".concat(FormatDictionary[_issue.format] ?? issue.format);
      }
      case "not_multiple_of":
        return "\uC798\uBABB\uB41C \uC22B\uC790: ".concat(issue.divisor, "\uC758 \uBC30\uC218\uC5EC\uC57C \uD569\uB2C8\uB2E4");
      case "unrecognized_keys":
        return "\uC778\uC2DD\uD560 \uC218 \uC5C6\uB294 \uD0A4: ".concat(joinValues(issue.keys, ", "));
      case "invalid_key":
        return "\uC798\uBABB\uB41C \uD0A4: ".concat(issue.origin);
      case "invalid_union":
        return "\uC798\uBABB\uB41C \uC785\uB825";
      case "invalid_element":
        return "\uC798\uBABB\uB41C \uAC12: ".concat(issue.origin);
      default:
        return "\uC798\uBABB\uB41C \uC785\uB825";
    }
  };
};
function ko_default() {
  return {
    localeError: error()
  };
}

export {
  ko_default
};

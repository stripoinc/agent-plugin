import {
  isEditorColor,
  isStaticThemeColor,
  isThemeBackground
} from "./colors-c40f90dc9241.js";
import {
  fontResourceIssues
} from "./fonts-82d1d39f0f33.js";
import {
  abort
} from "./contract-79faab52de2a.js";
import {
  RULE_TABLE
} from "./rule-table-generated-439fbe3342c9.js";
import {
  isObject
} from "./errors-3ee69a7e1eb0.js";

// convo-email-agent/src/sdk/validator/rules.ts
import catalogData from "./contract-data/catalog.js";
var custom = (path, message) => ({ path: [...path], code: "custom", message });
var text = (value) => typeof value === "string" ? value : "";
function refine(test, message) {
  return (value, path) => test(value) ? [] : [custom(path, message)];
}
var LINK_PREFIXES = {
  site: { test: /^https?:\/\//i, prefix: "http:// or https://", name: "Site", length: (value) => value.toLowerCase().startsWith("https://") ? 8 : 7 },
  anchor: { test: /^#/, prefix: "#", name: "Anchor", length: () => 1 },
  email: { test: /^mailto:/, prefix: "mailto:", name: "Email", length: () => 7 },
  phone: { test: /^tel:/, prefix: "tel:", name: "Phone", length: () => 4 },
  file: { test: /^ftps?:\/\//i, prefix: "ftp:// or ftps://", name: "File", length: (value) => value.toLowerCase().startsWith("ftps://") ? 7 : 6 },
  sms: { test: /^sms:/, prefix: "sms:", name: "SMS", length: () => 4 },
  telegram: { test: /^tg:\/\//, prefix: "tg://", name: "Telegram", length: () => 5 },
  viber: { test: /^viber:/, prefix: "viber:", name: "Viber", length: () => 6 }
};
var afterPrefix = (prefix, type) => type === "site" || type === "file" ? "the protocol" : prefix;
function hrefLink(label, allowEmptyAnchor) {
  return (value, path) => {
    if (!isObject(value)) return [];
    const raw = text(value.href), href = raw.trim(), at = [...path, "href"], issues = [];
    const noun = "".concat(label.toLowerCase(), "s");
    if (href !== raw) issues.push(custom(at, "".concat(label, " href must not contain leading or trailing spaces.")));
    if (!href) return [...issues, custom(at, "".concat(label, " href cannot be blank."))];
    const rule = LINK_PREFIXES[String(value.type)];
    if (!rule) return issues;
    if (!rule.test.test(href)) issues.push(custom(at, "".concat(rule.name, " ").concat(noun, " must start with ").concat(rule.prefix, ".")));
    else if (!(allowEmptyAnchor && value.type === "anchor") && !href.slice(rule.length(href)).trim()) {
      issues.push(custom(at, "".concat(rule.name, " ").concat(noun, " must include a value after ").concat(afterPrefix(rule.prefix, String(value.type)), ".")));
    }
    return issues;
  };
}
function valueLink(subject) {
  return (value, path) => {
    if (!isObject(value)) return [];
    const raw = text(value.value), trimmed = raw.trim(), at = [...path, "value"], issues = [];
    if (raw !== trimmed) issues.push(custom(at, "".concat(subject, " link value must not contain leading or trailing spaces.")));
    if (!trimmed) {
      if (value.type !== "site") issues.push(custom(at, "Blank ".concat(subject.toLowerCase(), " links are only allowed for site links.")));
      return issues;
    }
    const rule = LINK_PREFIXES[String(value.type)];
    if (!rule) return issues;
    const noun = "".concat(subject.toLowerCase(), " links");
    if (!rule.test.test(trimmed)) issues.push(custom(at, "".concat(rule.name, " ").concat(noun, " must start with ").concat(rule.prefix, ".")));
    else if (!trimmed.slice(rule.length(trimmed)).trim()) {
      issues.push(custom(at, "".concat(rule.name, " ").concat(noun, " must include a value after ").concat(afterPrefix(rule.prefix, String(value.type)), ".")));
    }
    return issues;
  };
}
var blockKind = (location) => {
  const index = /\.blocks\[\]\|(\d+)/.exec(location)?.[1];
  return index === void 0 ? void 0 : catalogData.blocks[Number(index)];
};
var KINDS = {
  // Refinements.
  nonblank: refine((value) => typeof value !== "string" || value.trim().length > 0, "Font family cannot be blank."),
  normalizedNonempty: refine(
    (value) => typeof value !== "string" || value.length > 0 && value.trim() === value,
    "Expected a non-empty value without leading or trailing spaces."
  ),
  color: refine((value) => typeof value !== "string" || isEditorColor(value, false), "Expected a valid non-transparent CSS color value."),
  colorTransparent: refine((value) => typeof value !== "string" || isEditorColor(value, true), "Expected a valid CSS color value."),
  staticColor: refine((value) => typeof value !== "string" || isStaticThemeColor(value, false), "Expected a valid static non-transparent CSS color value."),
  staticColorTransparent: refine((value) => typeof value !== "string" || isStaticThemeColor(value, true), "Expected a valid static CSS color value."),
  themeBackground: refine(
    (value) => typeof value !== "string" || isThemeBackground(value),
    "Expected a static solid color or one static CSS gradient followed by a solid fallback."
  ),
  fixedHeightTarget: refine(
    (value) => !isObject(value) || value.desktop !== void 0 || value.mobile !== void 0,
    "At least one fixed-height target must be provided."
  ),
  emptySettings: refine((value) => !isObject(value) || Object.keys(value).length === 0, "Unknown block settings are not supported."),
  nonemptyThumbnail: refine((value) => value !== "", "Custom thumbnail path cannot be empty."),
  // Object rules.
  fontResources: (value, path) => Array.isArray(value) ? fontResourceIssues(value).map((issue) => custom([...path, ...issue.path], issue.message)) : [],
  structureColumns: (value, path) => {
    if (!isObject(value)) return [];
    const settings = isObject(value.settings) ? value.settings : {};
    const columns = Array.isArray(value.columns) ? value.columns.length : 0;
    const gap = isObject(settings.columnsGap) && typeof settings.columnsGap.mobile === "number" ? settings.columnsGap.mobile : 0;
    const issues = [];
    if (gap > 0 && columns <= 1) issues.push(custom([...path, "settings", "columnsGap", "mobile"], "Structure mobile columns gap requires more than one column."));
    if (settings.responsiveMobile === true && columns <= 1) issues.push(custom([...path, "settings", "responsiveMobile"], "Responsive structure requires more than one column."));
    if (settings.responsiveMobileContainersInversion === true && columns !== 2) {
      issues.push(custom([...path, "settings", "responsiveMobileContainersInversion"], "Structure containers inversion requires exactly two columns."));
    }
    return issues;
  },
  mediaResponsive: (value, path, location) => {
    if (!isObject(value) || value.responsiveMobile !== true || !isObject(value.size) || !isObject(value.alignment)) return [];
    const subject = blockKind(location) ?? "image";
    const desktop = value.size.desktop, mobile = value.size.mobile, issues = [];
    if (!isObject(desktop) || !isObject(mobile) || desktop.mode !== mobile.mode || desktop.px !== mobile.px) {
      issues.push(custom([...path, "size", "mobile"], "Mobile ".concat(subject, " size must match desktop size when responsive image is enabled.")));
    }
    if (value.alignment.desktop !== value.alignment.mobile) {
      issues.push(custom([...path, "alignment", "mobile"], "Mobile ".concat(subject, " alignment must match desktop alignment when responsive image is enabled.")));
    }
    return issues;
  },
  imageLink: hrefLink("Image link", false),
  socialLink: hrefLink("Social network link", true),
  buttonLink: valueLink("Button"),
  menuLink: valueLink("Menu item"),
  salesforceLink: (value, path) => isObject(value) && text(value.value) !== text(value.value).trim() ? [custom([...path, "value"], "Salesforce button link value must not contain leading or trailing spaces.")] : [],
  imageSrc: (value, path) => {
    if (typeof value !== "string" || value === "") return [];
    if (!value.trim()) return [custom(path, "Image path must be empty or contain a non-whitespace value.")];
    return value.trim() !== value ? [custom(path, "Image path must not contain leading or trailing spaces.")] : [];
  },
  videoLink: (value, path) => {
    if (typeof value !== "string") return [];
    const issues = [];
    if (value.trim() !== value) issues.push(custom(path, "Video link must not contain leading or trailing spaces."));
    if (value && !value.trim()) issues.push(custom(path, "Video link must be empty or contain a non-whitespace value."));
    return issues;
  },
  socialIcon: (value, path) => {
    if (typeof value !== "string") return [];
    if (!value.trim()) return [custom(path, "Social network custom icon must contain a non-whitespace value.")];
    return value.trim() !== value ? [custom(path, "Social network custom icon must not contain leading or trailing spaces.")] : [];
  },
  anchorLinkName: (value, path) => {
    if (typeof value !== "string") return [];
    const issues = [];
    if (value.trim() !== value) issues.push(custom(path, "Anchor link name must not contain leading or trailing spaces."));
    if (value.trim().startsWith("#")) issues.push(custom(path, "Anchor link name must not start with #."));
    return issues;
  },
  timerEndDate: (value, path) => {
    if (typeof value !== "string" || value === "") return [];
    const match = /^(\d{4})-(\d{2})-(\d{2}) ([01]\d|2[0-3]):([0-5]\d):00$/.exec(value);
    if (!match) return [custom(path, "Timer endDate must be empty or use YYYY-MM-DD HH:mm:00 with valid hours and minutes.")];
    const [year, month, day] = [Number(match[1]), Number(match[2]), Number(match[3])];
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day ? [custom(path, "Timer endDate must contain a valid calendar date.")] : [];
  },
  spacerMode: (value, path) => {
    if (!isObject(value)) return [];
    const issues = [], add = (key, message) => {
      issues.push(custom([...path, key], message));
    };
    if (value.mode === "line") {
      if (!value.width) add("width", "Spacer line mode requires width settings.");
      if (!value.border) add("border", "Spacer line mode requires border settings.");
      if (!value.alignment) add("alignment", "Spacer line mode requires alignment settings.");
      if (value.height !== void 0) add("height", "Spacer height is available only in space mode.");
      return issues;
    }
    if (!value.height) add("height", "Spacer space mode requires height settings.");
    if (value.width !== void 0) add("width", "Spacer width is available only in line mode.");
    if (value.border !== void 0) add("border", "Spacer border is available only in line mode.");
    if (value.mobileBorder !== void 0) add("mobileBorder", "Spacer mobile border is available only in line mode.");
    if (value.alignment !== void 0) add("alignment", "Spacer alignment is available only in line mode.");
    return issues;
  },
  spacerWidthPercent: (value, path) => isObject(value) && value.unit === "percent" && typeof value.value === "number" && value.value > 100 ? [custom([...path, "value"], "Spacer percent width must be between 5 and 100.")] : [],
  spacerWidthDesktopPx: (value, path) => isObject(value) && value.unit === "px" && typeof value.value === "number" && value.value > 580 ? [custom([...path, "value"], "Desktop spacer line width in px must be between 5 and 580.")] : [],
  spacerWidthMobilePx: (value, path) => isObject(value) && value.unit === "px" && typeof value.value === "number" && value.value > 355 ? [custom([...path, "value"], "Mobile spacer line width in px must be between 5 and 355.")] : [],
  menuItems: (value, path) => {
    if (!isObject(value) || !Array.isArray(value.items) || !isObject(value.itemType) || !isObject(value.colors)) return [];
    const itemType = value.itemType, colors = value.colors, issues = [];
    value.items.forEach((item, index) => {
      if (!isObject(item)) return;
      const at = (key) => [...path, "items", index, key];
      const type = itemType.mode === "shared" ? itemType.type : item.type;
      if (itemType.mode === "shared" && item.type !== void 0) issues.push(custom(at("type"), "Menu item type must be omitted when itemType mode is shared."));
      if (itemType.mode === "perItem" && item.type === void 0) issues.push(custom(at("type"), "Menu item type is required when itemType mode is perItem."));
      if (type === "links" && item.image !== void 0) {
        issues.push(custom(at("image"), "Menu item image is available only for icon and link-with-icon menu item types."));
      }
      if (type && type !== "links" && !item.image) issues.push(custom(at("image"), "Icon and link-with-icon menu items require image settings."));
      if (colors.mode === "perItem") {
        if (item.colors === void 0) issues.push(custom(at("colors"), "Menu item colors are required when colors mode is perItem."));
      } else if (item.colors !== void 0) {
        issues.push(custom(at("colors"), "Menu item colors must be omitted when colors mode is shared."));
      }
    });
    return issues;
  },
  // Transforms that reject values.
  // A transform's rejection stops the rules above it.
  backgroundRepeat: (value, path) => typeof value === "string" && !["repeat", "no-repeat", "true", "false"].includes(value.trim().toLowerCase()) ? abort([custom(path, "Invalid repeat value. Expected boolean or repeat/no-repeat.")]) : [],
  backgroundSize: () => [],
  canonicalFontResources: () => [],
  dropUndefinedResources: () => []
};
var tables = RULE_TABLE;
for (const table of [tables.refines, tables.rules, tables.transforms]) {
  for (const kinds of Object.values(table)) for (const kind of kinds) if (!KINDS[kind]) throw new Error("Unported validator rule kind: ".concat(kind));
}
var locationRules = (location, value, path) => [...tables.refines[location] ?? [], ...tables.rules[location] ?? [], ...tables.transforms[location] ?? []].flatMap((kind) => KINDS[kind](value, path, location));

export {
  locationRules
};

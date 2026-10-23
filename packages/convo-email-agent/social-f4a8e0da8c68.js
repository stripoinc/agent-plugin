import {
  EmailSdkError,
  cloneJson,
  isObject
} from "./errors-3ee69a7e1eb0.js";

// convo-email-agent/src/sdk/social.ts
var SOCIAL_CUSTOM_NETWORK_TYPE = "custom";
var SOCIAL_LINK_TYPES = ["site", "anchor", "email", "phone", "file", "sms", "telegram", "viber", "other"];
var SOCIAL_LINK_TYPE_SET = new Set(SOCIAL_LINK_TYPES);
var SOCIAL_NETWORK_TYPES = [
  "twitter",
  "xcom",
  "facebook",
  "youtube",
  "askfm",
  "behance",
  "dribbble",
  "flickr",
  "foursquare",
  "googleplus",
  "instagram",
  "lastfm",
  "linkedin",
  "myspace",
  "pinterest",
  "soundcloud",
  "tumblr",
  "vimeo",
  "hangouts",
  "messenger",
  "skype",
  "snapchat",
  "telegram",
  "viber",
  "whatsapp",
  "email",
  "website",
  "mapmarker",
  "world",
  "address",
  "phone",
  "share",
  "rss",
  "appstore",
  "googleplay",
  "windowsstore",
  "wechat",
  "weibo",
  "blogger",
  "medium",
  "dropbox",
  "googledrive",
  "slack",
  "github",
  "pdf",
  "doc",
  "xls",
  "ppt",
  "xing",
  "meetup",
  "fleeped",
  "tripAdvisor",
  "spotify",
  "tiktok",
  "workplace",
  "gmail",
  "iTunesPodcasts",
  "zoom",
  "teams",
  "onedrive",
  "discord",
  "twitch",
  "line",
  "patreon",
  "kofi",
  "yammer",
  "buyMeACoffee",
  "huaweiAppGallery",
  "googleBusiness",
  "reddit",
  "strava",
  "goodreads",
  "custom",
  "yelp",
  "google",
  "mastodon",
  "glassdoor",
  "threads",
  "bluesky",
  "digg",
  "meet"
];
var SOCIAL_NETWORK_TYPE_SET = new Set(SOCIAL_NETWORK_TYPES);
var SOCIAL_TITLE_MAX_LENGTH = 100;
var SOCIAL_ALT_MAX_LENGTH = 500;
var SOCIAL_BLOCK_DEFAULT_SETTINGS = Object.freeze({
  style: "logoColored",
  iconSize: 32,
  spaceBetweenIcons: { desktop: 10, mobile: 10 },
  textCustomization: false,
  alignment: { desktop: "center", mobile: "center" },
  backgroundColor: "transparent",
  hideElement: "no",
  margins: {
    desktop: { top: 0, right: 0, bottom: 0, left: 0 },
    mobile: { top: 0, right: 0, bottom: 0, left: 0 }
  },
  includeInOutput: "both",
  anchorLinkName: ""
});
var DEFAULT_TITLES = {
  facebook: "Facebook",
  xcom: "X",
  twitter: "Twitter",
  instagram: "Instagram",
  youtube: "YouTube",
  linkedin: "LinkedIn",
  tiktok: "TikTok",
  telegram: "Telegram",
  pinterest: "Pinterest",
  whatsapp: "WhatsApp",
  viber: "Viber",
  threads: "Threads",
  snapchat: "Snapchat",
  discord: "Discord",
  twitch: "Twitch",
  reddit: "Reddit",
  spotify: "Spotify",
  medium: "Medium",
  github: "GitHub",
  behance: "Behance",
  dribbble: "Dribbble",
  vimeo: "Vimeo",
  tumblr: "Tumblr",
  bluesky: "Bluesky",
  mastodon: "Mastodon",
  email: "Email",
  website: "Website",
  phone: "Phone",
  custom: "Custom"
};
function defaultSocialTitle(type) {
  return DEFAULT_TITLES[type] ?? type.charAt(0).toUpperCase() + type.slice(1);
}
function inferSocialLinkType(href) {
  if (href.startsWith("#")) return "anchor";
  if (href.startsWith("mailto:")) return "email";
  if (href.startsWith("tel:")) return "phone";
  if (/^ftps?:\/\//iu.test(href)) return "file";
  if (href.startsWith("sms:")) return "sms";
  if (href.startsWith("tg://")) return "telegram";
  if (href.startsWith("viber:")) return "viber";
  if (/^https?:\/\//iu.test(href)) return "site";
  return "other";
}
function hasValueAfterPrefix(href, prefix) {
  return href.slice(prefix.length).trim().length > 0;
}
function socialLinkIssue(link) {
  if (!isObject(link)) return "Social network link must be an object with type and href.";
  const { type, href } = link;
  if (typeof type !== "string" || !SOCIAL_LINK_TYPE_SET.has(type)) {
    return `Social network link type must be one of ${SOCIAL_LINK_TYPES.join(", ")}.`;
  }
  if (typeof href !== "string" || href === "") return "Social network link href cannot be empty.";
  if (href.trim() !== href) return "Social network link href must not contain leading or trailing spaces.";
  const lower = href.toLowerCase();
  switch (type) {
    case "site":
      if (!/^https?:\/\//iu.test(href)) return "Site social network links must start with http:// or https://.";
      if (!hasValueAfterPrefix(href, lower.startsWith("https://") ? "https://" : "http://")) {
        return "Site social network links must include a value after the protocol.";
      }
      return void 0;
    case "anchor":
      return href.startsWith("#") ? void 0 : "Anchor social network links must start with #.";
    case "email":
      if (!href.startsWith("mailto:")) return "Email social network links must start with mailto:.";
      return hasValueAfterPrefix(href, "mailto:") ? void 0 : "Email social network links must include a value after mailto:.";
    case "phone":
      if (!href.startsWith("tel:")) return "Phone social network links must start with tel:.";
      return hasValueAfterPrefix(href, "tel:") ? void 0 : "Phone social network links must include a value after tel:.";
    case "file":
      if (!/^ftps?:\/\//iu.test(href)) return "File social network links must start with ftp:// or ftps://.";
      return hasValueAfterPrefix(href, lower.startsWith("ftps://") ? "ftps://" : "ftp://") ? void 0 : "File social network links must include a value after the protocol.";
    case "sms":
      if (!href.startsWith("sms:")) return "SMS social network links must start with sms:.";
      return hasValueAfterPrefix(href, "sms:") ? void 0 : "SMS social network links must include a value after sms:.";
    case "telegram":
      if (!href.startsWith("tg://")) return "Telegram social network links must start with tg://.";
      return hasValueAfterPrefix(href, "tg://") ? void 0 : "Telegram social network links must include a value after tg://.";
    case "viber":
      if (!href.startsWith("viber:")) return "Viber social network links must start with viber:.";
      return hasValueAfterPrefix(href, "viber:") ? void 0 : "Viber social network links must include a value after viber:.";
    default:
      return void 0;
  }
}
function collectSocialSettingsIssues(settings) {
  const issues = [];
  if (!isObject(settings) || !Array.isArray(settings.networks)) return issues;
  const textCustomization = settings.textCustomization === true;
  settings.networks.forEach((network, index) => {
    if (!isObject(network)) return;
    const base = `/networks/${index}`;
    const hasIcon = Object.hasOwn(network, "icon");
    if (network.type === SOCIAL_CUSTOM_NETWORK_TYPE && !hasIcon) {
      issues.push({ path: `${base}/icon`, message: "Social network icon is required for custom social networks." });
    }
    if (network.type !== SOCIAL_CUSTOM_NETWORK_TYPE && hasIcon) {
      issues.push({
        path: `${base}/icon`,
        message: "Social network icon can only be provided for custom social networks; known networks take their icon from type and style."
      });
    }
    if (hasIcon && typeof network.icon === "string") {
      if (network.icon.trim() === "") {
        issues.push({ path: `${base}/icon`, message: "Social network custom icon must contain a non-whitespace value." });
      } else if (network.icon.trim() !== network.icon) {
        issues.push({ path: `${base}/icon`, message: "Social network custom icon must not contain leading or trailing spaces." });
      }
    }
    const hasAlt = Object.hasOwn(network, "alt");
    if (textCustomization && !hasAlt) {
      issues.push({ path: `${base}/alt`, message: "Social network alt is required when text customization is enabled." });
    }
    if (!textCustomization && hasAlt) {
      issues.push({
        path: `${base}/alt`,
        message: "Social network alt can only be provided when text customization is enabled (settings.textCustomization)."
      });
    }
    if (network.link !== void 0) {
      const linkIssue = socialLinkIssue(network.link);
      if (linkIssue !== void 0) issues.push({ path: `${base}/link/href`, message: linkIssue });
    }
  });
  return issues;
}
var CHILD_ARRAYS = ["stripes", "structures", "columns", "containers", "blocks"];
function collectSocialDocumentIssues(document) {
  const issues = [];
  const visit = (node, pointer) => {
    if (!isObject(node)) return;
    if (node.type === "social") {
      for (const issue of collectSocialSettingsIssues(node.settings)) {
        issues.push({ ...issue, instancePath: `${pointer}/settings${issue.path}` });
      }
    }
    for (const key of CHILD_ARRAYS) {
      const children = node[key];
      if (!Array.isArray(children)) continue;
      children.forEach((child, index) => visit(child, `${pointer}/${key}/${index}`));
    }
  };
  visit(document, "");
  return issues;
}
function requireNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") throw new EmailSdkError(`${label} must be a non-empty string.`);
  return value;
}
function assertSocialNetworkType(type) {
  if (!SOCIAL_NETWORK_TYPE_SET.has(type)) {
    throw new EmailSdkError(
      `Social network type "${type}" is not one the editor ships an icon for. Use one of its ${SOCIAL_NETWORK_TYPES.length} native types, or type "custom" with an icon URL.`
    );
  }
  return type;
}
function assertSocialTextLimit(value, field, limit) {
  if (value.length > limit) {
    throw new EmailSdkError(`Social network ${field} must be at most ${limit} characters; got ${value.length}.`);
  }
}
function socialLink(url, linkType) {
  const link = { type: linkType ?? inferSocialLinkType(url), href: url };
  const issue = socialLinkIssue(link);
  if (issue !== void 0) throw new EmailSdkError(issue);
  return link;
}
function buildSocialNetwork(input, textCustomization) {
  if (!isObject(input)) throw new EmailSdkError("A social network must be an object with at least a type.");
  const type = assertSocialNetworkType(requireNonEmptyString(input.type, "Social network type"));
  const network = { type };
  if (input.url !== void 0 && input.url !== "") {
    network.link = socialLink(requireNonEmptyString(input.url, "Social network url"), input.linkType);
  }
  if (type === SOCIAL_CUSTOM_NETWORK_TYPE) {
    const icon = requireNonEmptyString(input.icon, `Social network "${type}" icon`);
    if (icon.trim() !== icon) throw new EmailSdkError("Social network custom icon must not contain leading or trailing spaces.");
    network.icon = icon;
  } else if (input.icon !== void 0) {
    throw new EmailSdkError(
      `Social network "${type}" does not accept icon; known networks take their icon from type and the block style. Use type "custom" for an own icon.`
    );
  }
  const title = input.title ?? defaultSocialTitle(type);
  if (typeof title !== "string") throw new EmailSdkError("Social network title must be a string.");
  assertSocialTextLimit(title, "title", SOCIAL_TITLE_MAX_LENGTH);
  network.title = title;
  if (textCustomization) {
    const alt = input.alt ?? title;
    if (typeof alt !== "string") throw new EmailSdkError("Social network alt must be a string.");
    assertSocialTextLimit(alt, "alt", SOCIAL_ALT_MAX_LENGTH);
    network.alt = alt;
  } else if (input.alt !== void 0) {
    throw new EmailSdkError(
      "Social network alt requires textCustomization: true on the block; the editor rejects alt otherwise."
    );
  }
  return network;
}
function completeNativeSocialNetwork(network, textCustomization) {
  const result = cloneJson(network);
  if (typeof result.link === "string") {
    result.link = result.link === "" ? void 0 : { type: inferSocialLinkType(result.link), href: result.link };
    if (result.link === void 0) delete result.link;
  } else if (isObject(result.link) && typeof result.link.href === "string" && result.link.type === void 0) {
    result.link = { type: inferSocialLinkType(result.link.href), href: result.link.href };
  }
  if (result.title === void 0 && typeof result.type === "string") result.title = defaultSocialTitle(result.type);
  if (textCustomization && result.alt === void 0 && typeof result.title === "string") result.alt = result.title;
  if (typeof result.title === "string") assertSocialTextLimit(result.title, "title", SOCIAL_TITLE_MAX_LENGTH);
  if (typeof result.alt === "string") assertSocialTextLimit(result.alt, "alt", SOCIAL_ALT_MAX_LENGTH);
  return result;
}
function resolveTextCustomization(settings, networks) {
  if (typeof settings.textCustomization === "boolean") return settings.textCustomization;
  return networks.some((network) => isObject(network) && network.alt !== void 0);
}
function isSpacing(value) {
  return typeof value === "number" && Number.isInteger(value) && value >= 0 && value <= 40;
}
function normalizeSpaceBetweenIcons(value) {
  if (isSpacing(value)) return { desktop: value, mobile: value };
  if (isObject(value) && isSpacing(value.desktop) && isSpacing(value.mobile)) {
    return { desktop: value.desktop, mobile: value.mobile };
  }
  throw new EmailSdkError("spaceBetweenIcons must be an integer 0..40, or {desktop, mobile} integers 0..40.");
}
function normalizeIconSize(value) {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 16 || value > 64) {
    throw new EmailSdkError("iconSize must be an integer between 16 and 64.");
  }
  return value;
}
function normalizeSocialAlignment(value) {
  if (value === "left" || value === "center" || value === "right") return { desktop: value, mobile: value };
  if (isObject(value) && typeof value.desktop === "string" && typeof value.mobile === "string") {
    return { desktop: value.desktop, mobile: value.mobile };
  }
  throw new EmailSdkError("Social alignment must be left, center, right, or {desktop, mobile}.");
}

export {
  SOCIAL_CUSTOM_NETWORK_TYPE,
  SOCIAL_LINK_TYPES,
  SOCIAL_NETWORK_TYPES,
  SOCIAL_TITLE_MAX_LENGTH,
  SOCIAL_ALT_MAX_LENGTH,
  SOCIAL_BLOCK_DEFAULT_SETTINGS,
  defaultSocialTitle,
  inferSocialLinkType,
  socialLinkIssue,
  collectSocialSettingsIssues,
  collectSocialDocumentIssues,
  assertSocialTextLimit,
  buildSocialNetwork,
  completeNativeSocialNetwork,
  resolveTextCustomization,
  normalizeSpaceBetweenIcons,
  normalizeIconSize,
  normalizeSocialAlignment
};

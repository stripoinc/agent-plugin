export const SOCIAL_PLATFORM_KEYS = [
  "facebook",
  "youtube",
  "instagram",
  "tiktok",
  "twitter",
  "x",
  "snapchat",
  "pinterest",
  "linkedin",
  "android",
  "apple",
  "rss",
  "yelp",
  "threads",
  "discord",
  "twitch",
  "whatsapp",
  "viber",
  "telegram",
  "messenger",
];

const SOCIAL_PLATFORM_SET = new Set(SOCIAL_PLATFORM_KEYS);

export function emptyBrandkitSocials() {
  return Object.fromEntries(SOCIAL_PLATFORM_KEYS.map((platform) => [platform, ""]));
}

function socialUrlScore(platform, url) {
  const normalized = String(url || "").trim().toLowerCase();
  if (!normalized) return 0;
  let score = /^https?:\/\//.test(normalized) ? 1 : 0;
  const platformDomainPatterns = {
    facebook: /(?:^|\/\/|\.)(facebook\.com|fb\.com|fb\.me)(?:[/:?#]|$)/,
    youtube: /(?:^|\/\/|\.)(youtube\.com|youtu\.be)(?:[/:?#]|$)/,
    instagram: /(?:^|\/\/|\.)instagram\.com(?:[/:?#]|$)/,
    tiktok: /(?:^|\/\/|\.)tiktok\.com(?:[/:?#]|$)/,
    twitter: /(?:^|\/\/|\.)twitter\.com(?:[/:?#]|$)/,
    x: /(?:^|\/\/|\.)x\.com(?:[/:?#]|$)/,
    snapchat: /(?:^|\/\/|\.)snapchat\.com(?:[/:?#]|$)/,
    pinterest: /(?:^|\/\/|\.)pinterest\.[a-z.]+(?:[/:?#]|$)/,
    linkedin: /(?:^|\/\/|\.)linkedin\.com(?:[/:?#]|$)/,
    android: /(?:^|\/\/|\.)play\.google\.com(?:[/:?#]|$)|^market:\/\//,
    apple: /(?:^|\/\/|\.)(apps\.apple\.com|itunes\.apple\.com)(?:[/:?#]|$)/,
    rss: /(^|\/)(rss|feed|atom)(?:[/?#.]|$)|\.xml(?:[?#]|$)/,
    yelp: /(?:^|\/\/|\.)yelp\.[a-z.]+(?:[/:?#]|$)/,
    threads: /(?:^|\/\/|\.)threads\.net(?:[/:?#]|$)/,
    discord: /(?:^|\/\/|\.)(discord(?:app)?\.com|discord\.gg)(?:[/:?#]|$)/,
    twitch: /(?:^|\/\/|\.)twitch\.tv(?:[/:?#]|$)/,
    whatsapp: /(?:^|\/\/|\.)(wa\.me|api\.whatsapp\.com|whatsapp\.com)(?:[/:?#]|$)/,
    viber: /(?:^|\/\/|\.)viber\.com(?:[/:?#]|$)|^viber:/,
    telegram: /(?:^|\/\/|\.)(t\.me|telegram\.me|telegram\.org)(?:[/:?#]|$)/,
    messenger: /(?:^|\/\/|\.)(m\.me|messenger\.com)(?:[/:?#]|$)/,
  };
  if (platformDomainPatterns[platform]?.test(normalized)) {
    score += 3;
  }
  return score;
}

export function brandkitSocialsFromLinks(links) {
  const result = emptyBrandkitSocials();
  const scores = Object.fromEntries(SOCIAL_PLATFORM_KEYS.map((platform) => [platform, 0]));
  for (const entry of Array.isArray(links) ? links : []) {
    if (!entry || typeof entry !== "object") continue;
    const platform = String(entry.platform || "").trim().toLowerCase();
    const url = String(entry.url || "").trim();
    if (!SOCIAL_PLATFORM_SET.has(platform) || !url) continue;
    const score = socialUrlScore(platform, url);
    if (!result[platform] || score > scores[platform]) {
      result[platform] = url;
      scores[platform] = score;
    }
  }
  return result;
}

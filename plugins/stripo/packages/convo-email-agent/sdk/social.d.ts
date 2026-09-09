import { type JsonObject } from "./model-utils.js";
export declare const SOCIAL_CUSTOM_NETWORK_TYPE = "custom";
export declare const SOCIAL_LINK_TYPES: readonly ["site", "anchor", "email", "phone", "file", "sms", "telegram", "viber", "other"];
export type SocialLinkType = typeof SOCIAL_LINK_TYPES[number];
export declare const SOCIAL_NETWORK_TYPES: readonly ["twitter", "xcom", "facebook", "youtube", "askfm", "behance", "dribbble", "flickr", "foursquare", "googleplus", "instagram", "lastfm", "linkedin", "myspace", "pinterest", "soundcloud", "tumblr", "vimeo", "hangouts", "messenger", "skype", "snapchat", "telegram", "viber", "whatsapp", "email", "website", "mapmarker", "world", "address", "phone", "share", "rss", "appstore", "googleplay", "windowsstore", "wechat", "weibo", "blogger", "medium", "dropbox", "googledrive", "slack", "github", "pdf", "doc", "xls", "ppt", "xing", "meetup", "fleeped", "tripAdvisor", "spotify", "tiktok", "workplace", "gmail", "iTunesPodcasts", "zoom", "teams", "onedrive", "discord", "twitch", "line", "patreon", "kofi", "yammer", "buyMeACoffee", "huaweiAppGallery", "googleBusiness", "reddit", "strava", "goodreads", "custom", "yelp", "google", "mastodon", "glassdoor", "threads", "bluesky", "digg", "meet"];
/** Native insertion limits in UTF-16 code units (String.length), not Unicode code points. */
export declare const SOCIAL_TITLE_MAX_LENGTH = 100;
export declare const SOCIAL_ALT_MAX_LENGTH = 500;
export declare const SOCIAL_BLOCK_DEFAULT_SETTINGS: Readonly<JsonObject>;
/** Caller-facing network description accepted by socialBlock() and addSocialNetwork(). */
export interface SocialNetworkInput {
    type: string;
    url?: string;
    linkType?: string;
    title?: string;
    /** Only when textCustomization is enabled on the block. */
    alt?: string;
    /** Required for type "custom", rejected for every other type. */
    icon?: string;
}
export declare function defaultSocialTitle(type: string): string;
/** Port of inferSocialNetworkLinkType: the editor re-derives the type from the href on read-back. */
export declare function inferSocialLinkType(href: string): SocialLinkType;
/** Port of validateLinkSettings for "Social network link" (anchors may be a bare "#"). */
export declare function socialLinkIssue(link: unknown): string | undefined;
export interface SocialSettingsIssue {
    /** JSON pointer relative to the block's settings object, e.g. "/networks/1/icon". */
    path: string;
    message: string;
}
/** The editor's superRefine rules for one social block's settings (schema shape is assumed valid). */
export declare function collectSocialSettingsIssues(settings: unknown): SocialSettingsIssue[];
export interface SocialDocumentIssue extends SocialSettingsIssue {
    /** Absolute JSON pointer into the document. */
    instancePath: string;
}
/** Every social-block rule violation in a native document, with absolute instance paths. */
export declare function collectSocialDocumentIssues(document: unknown): SocialDocumentIssue[];
/** Native caption limits; a longer value is rejected here rather than at schema validation. */
export declare function assertSocialTextLimit(value: string, field: "title" | "alt", limit: number): void;
/**
 * Build one native network entry from caller input, applying the editor's rules:
 * known networks never carry `icon`, custom networks require it, `alt` exists only when
 * the block has textCustomization enabled (it defaults to the title).
 */
export declare function buildSocialNetwork(input: SocialNetworkInput, textCustomization: boolean): JsonObject;
/**
 * Complete a network written in native draft shape: a string `link` or one without `type`
 * gets the type inferred from its href, a missing title gets the network's default caption,
 * and a missing alt falls back to the title when textCustomization is enabled. Native
 * insertion text limits are checked here; other rule violations (icon, alt, href) are
 * left in place for validation to report.
 */
export declare function completeNativeSocialNetwork(network: JsonObject, textCustomization: boolean): JsonObject;
/** textCustomization requested explicitly, else implied by any network carrying alt. */
export declare function resolveTextCustomization(settings: JsonObject, networks: readonly unknown[]): boolean;
export declare function normalizeSpaceBetweenIcons(value: unknown): JsonObject;
/** Shared by the builder and setSocialShared so both reject out-of-range sizes at the call site. */
export declare function normalizeIconSize(value: unknown): number;
export declare function normalizeSocialAlignment(value: unknown): JsonObject;

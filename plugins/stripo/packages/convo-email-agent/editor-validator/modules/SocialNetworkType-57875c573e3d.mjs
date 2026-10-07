// editor/ui-editor-common/entities/SocialNetworkType.ts
var SocialNetworkStyle = /* @__PURE__ */ ((SocialNetworkStyle2) => {
  SocialNetworkStyle2["custom"] = "custom";
  SocialNetworkStyle2["logoColored"] = "logo-colored";
  SocialNetworkStyle2["logoBlack"] = "logo-black";
  SocialNetworkStyle2["logoGray"] = "logo-gray";
  SocialNetworkStyle2["logoWhite"] = "logo-white";
  SocialNetworkStyle2["circleColored"] = "circle-colored";
  SocialNetworkStyle2["circleColoredBordered"] = "circle-colored-bordered";
  SocialNetworkStyle2["roundedColored"] = "rounded-colored";
  SocialNetworkStyle2["roundedColoredBordered"] = "rounded-colored-bordered";
  SocialNetworkStyle2["squareColored"] = "square-colored";
  SocialNetworkStyle2["squareColoredBordered"] = "square-colored-bordered";
  SocialNetworkStyle2["circleBlack"] = "circle-black";
  SocialNetworkStyle2["circleBlackBordered"] = "circle-black-bordered";
  SocialNetworkStyle2["roundedBlack"] = "rounded-black";
  SocialNetworkStyle2["roundedBlackBordered"] = "rounded-black-bordered";
  SocialNetworkStyle2["squareBlack"] = "square-black";
  SocialNetworkStyle2["squareBlackBordered"] = "square-black-bordered";
  SocialNetworkStyle2["circleGray"] = "circle-gray";
  SocialNetworkStyle2["circleGrayBordered"] = "circle-gray-bordered";
  SocialNetworkStyle2["roundedGray"] = "rounded-gray";
  SocialNetworkStyle2["roundedGrayBordered"] = "rounded-gray-bordered";
  SocialNetworkStyle2["squareGray"] = "square-gray";
  SocialNetworkStyle2["squareGrayBordered"] = "square-gray-bordered";
  SocialNetworkStyle2["circleWhite"] = "circle-white";
  SocialNetworkStyle2["circleWhiteBordered"] = "circle-white-bordered";
  SocialNetworkStyle2["roundedWhite"] = "rounded-white";
  SocialNetworkStyle2["roundedWhiteBordered"] = "rounded-white-bordered";
  SocialNetworkStyle2["squareWhite"] = "square-white";
  SocialNetworkStyle2["squareWhiteBordered"] = "square-white-bordered";
  return SocialNetworkStyle2;
})(SocialNetworkStyle || {});
var socialNetworkStyleTranslations = {
  ["custom" /* custom */]: "history_val_sn_style_custom",
  ["logo-colored" /* logoColored */]: "history_val_sn_style_logo_colored",
  ["logo-black" /* logoBlack */]: "history_val_sn_style_logo_black",
  ["logo-gray" /* logoGray */]: "history_val_sn_style_logo_gray",
  ["logo-white" /* logoWhite */]: "history_val_sn_style_logo_white",
  ["circle-colored" /* circleColored */]: "history_val_sn_style_circle_colored",
  ["circle-colored-bordered" /* circleColoredBordered */]: "history_val_sn_style_circle_colored_bordered",
  ["rounded-colored" /* roundedColored */]: "history_val_sn_style_rounded_colored",
  ["rounded-colored-bordered" /* roundedColoredBordered */]: "history_val_sn_style_rounded_colored_bordered",
  ["square-colored" /* squareColored */]: "history_val_sn_style_square_colored",
  ["square-colored-bordered" /* squareColoredBordered */]: "history_val_sn_style_square_colored_bordered",
  ["circle-black" /* circleBlack */]: "history_val_sn_style_circle_black",
  ["circle-black-bordered" /* circleBlackBordered */]: "history_val_sn_style_circle_black_bordered",
  ["rounded-black" /* roundedBlack */]: "history_val_sn_style_rounded_black",
  ["rounded-black-bordered" /* roundedBlackBordered */]: "history_val_sn_style_rounded_black_bordered",
  ["square-black" /* squareBlack */]: "history_val_sn_style_square_black",
  ["square-black-bordered" /* squareBlackBordered */]: "history_val_sn_style_square_black_bordered",
  ["circle-gray" /* circleGray */]: "history_val_sn_style_circle_gray",
  ["circle-gray-bordered" /* circleGrayBordered */]: "history_val_sn_style_circle_gray_bordered",
  ["rounded-gray" /* roundedGray */]: "history_val_sn_style_rounded_gray",
  ["rounded-gray-bordered" /* roundedGrayBordered */]: "history_val_sn_style_rounded_gray_bordered",
  ["square-gray" /* squareGray */]: "history_val_sn_style_square_gray",
  ["square-gray-bordered" /* squareGrayBordered */]: "history_val_sn_style_square_gray_bordered",
  ["circle-white" /* circleWhite */]: "history_val_sn_style_circle_white",
  ["circle-white-bordered" /* circleWhiteBordered */]: "history_val_sn_style_circle_white_bordered",
  ["rounded-white" /* roundedWhite */]: "history_val_sn_style_rounded_white",
  ["rounded-white-bordered" /* roundedWhiteBordered */]: "history_val_sn_style_rounded_white_bordered",
  ["square-white" /* squareWhite */]: "history_val_sn_style_square_white",
  ["square-white-bordered" /* squareWhiteBordered */]: "history_val_sn_style_square_white_bordered"
};
var SOCIAL_NETWORK_ALIASES = {
  "logo-colored-bordered": "circle-colored-bordered"
};
var SOCIAL_NETWORK_STYLES = Object.values(SocialNetworkStyle);
var SocialNetworkType = /* @__PURE__ */ ((SocialNetworkType2) => {
  SocialNetworkType2["twitter"] = "twitter";
  SocialNetworkType2["xcom"] = "xcom";
  SocialNetworkType2["facebook"] = "facebook";
  SocialNetworkType2["youtube"] = "youtube";
  SocialNetworkType2["vkontakte"] = "vkontakte";
  SocialNetworkType2["askfm"] = "askfm";
  SocialNetworkType2["behance"] = "behance";
  SocialNetworkType2["dribbble"] = "dribbble";
  SocialNetworkType2["flickr"] = "flickr";
  SocialNetworkType2["foursquare"] = "foursquare";
  SocialNetworkType2["googleplus"] = "googleplus";
  SocialNetworkType2["instagram"] = "instagram";
  SocialNetworkType2["lastfm"] = "lastfm";
  SocialNetworkType2["linkedin"] = "linkedin";
  SocialNetworkType2["livejournal"] = "livejournal";
  SocialNetworkType2["myspace"] = "myspace";
  SocialNetworkType2["odnoklassniki"] = "odnoklassniki";
  SocialNetworkType2["pinterest"] = "pinterest";
  SocialNetworkType2["soundcloud"] = "soundcloud";
  SocialNetworkType2["tumblr"] = "tumblr";
  SocialNetworkType2["vimeo"] = "vimeo";
  SocialNetworkType2["hangouts"] = "hangouts";
  SocialNetworkType2["icq"] = "icq";
  SocialNetworkType2["mailruagent"] = "mailruagent";
  SocialNetworkType2["messenger"] = "messenger";
  SocialNetworkType2["skype"] = "skype";
  SocialNetworkType2["snapchat"] = "snapchat";
  SocialNetworkType2["telegram"] = "telegram";
  SocialNetworkType2["viber"] = "viber";
  SocialNetworkType2["whatsapp"] = "whatsapp";
  SocialNetworkType2["email"] = "email";
  SocialNetworkType2["website"] = "website";
  SocialNetworkType2["mapmarker"] = "mapmarker";
  SocialNetworkType2["world"] = "world";
  SocialNetworkType2["address"] = "address";
  SocialNetworkType2["phone"] = "phone";
  SocialNetworkType2["share"] = "share";
  SocialNetworkType2["rss"] = "rss";
  SocialNetworkType2["appstore"] = "appstore";
  SocialNetworkType2["googleplay"] = "googleplay";
  SocialNetworkType2["windowsstore"] = "windowsstore";
  SocialNetworkType2["wechat"] = "wechat";
  SocialNetworkType2["weibo"] = "weibo";
  SocialNetworkType2["blogger"] = "blogger";
  SocialNetworkType2["medium"] = "medium";
  SocialNetworkType2["dropbox"] = "dropbox";
  SocialNetworkType2["googledrive"] = "googledrive";
  SocialNetworkType2["slack"] = "slack";
  SocialNetworkType2["github"] = "github";
  SocialNetworkType2["pdf"] = "pdf";
  SocialNetworkType2["doc"] = "doc";
  SocialNetworkType2["xls"] = "xls";
  SocialNetworkType2["ppt"] = "ppt";
  SocialNetworkType2["xing"] = "xing";
  SocialNetworkType2["meetup"] = "meetup";
  SocialNetworkType2["yandexdzen"] = "yandexdzen";
  SocialNetworkType2["fleeped"] = "fleeped";
  SocialNetworkType2["yandexZnatoki"] = "yandexZnatoki";
  SocialNetworkType2["yandexQ"] = "yandexQ";
  SocialNetworkType2["tripAdvisor"] = "tripAdvisor";
  SocialNetworkType2["spotify"] = "spotify";
  SocialNetworkType2["tiktok"] = "tiktok";
  SocialNetworkType2["workplace"] = "workplace";
  SocialNetworkType2["gmail"] = "gmail";
  SocialNetworkType2["iTunesPodcasts"] = "iTunesPodcasts";
  SocialNetworkType2["zoom"] = "zoom";
  SocialNetworkType2["teams"] = "teams";
  SocialNetworkType2["onedrive"] = "onedrive";
  SocialNetworkType2["discord"] = "discord";
  SocialNetworkType2["twitch"] = "twitch";
  SocialNetworkType2["line"] = "line";
  SocialNetworkType2["patreon"] = "patreon";
  SocialNetworkType2["kofi"] = "kofi";
  SocialNetworkType2["yammer"] = "yammer";
  SocialNetworkType2["buyMeACoffee"] = "buyMeACoffee";
  SocialNetworkType2["huaweiAppGallery"] = "huaweiAppGallery";
  SocialNetworkType2["googleBusiness"] = "googleBusiness";
  SocialNetworkType2["reddit"] = "reddit";
  SocialNetworkType2["strava"] = "strava";
  SocialNetworkType2["goodreads"] = "goodreads";
  SocialNetworkType2["custom"] = "custom";
  SocialNetworkType2["yelp"] = "yelp";
  SocialNetworkType2["google"] = "google";
  SocialNetworkType2["mastodon"] = "mastodon";
  SocialNetworkType2["glassdoor"] = "glassdoor";
  SocialNetworkType2["threads"] = "threads";
  SocialNetworkType2["bluesky"] = "bluesky";
  SocialNetworkType2["digg"] = "digg";
  SocialNetworkType2["meet"] = "meet";
  return SocialNetworkType2;
})(SocialNetworkType || {});

export {
  SocialNetworkStyle,
  socialNetworkStyleTranslations,
  SOCIAL_NETWORK_ALIASES,
  SOCIAL_NETWORK_STYLES,
  SocialNetworkType
};

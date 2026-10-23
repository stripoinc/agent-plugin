import {
  BinaryReader,
  BinaryWriter
} from "./proto-int64-27d7cd28885a.mjs";

// editor/ui-editor-ui/node_modules/ue-proto/fesm2022/ue-proto.mjs
var BrowserReadErrorCode;
(function(BrowserReadErrorCode2) {
  BrowserReadErrorCode2[BrowserReadErrorCode2["BROWSER_READ_ERROR_CODE_UNSPECIFIED"] = 0] = "BROWSER_READ_ERROR_CODE_UNSPECIFIED";
  BrowserReadErrorCode2[BrowserReadErrorCode2["BROWSER_READ_ERROR_CODE_NODE_NOT_FOUND"] = 1] = "BROWSER_READ_ERROR_CODE_NODE_NOT_FOUND";
  BrowserReadErrorCode2[BrowserReadErrorCode2["BROWSER_READ_ERROR_CODE_RENDER_UNAVAILABLE"] = 2] = "BROWSER_READ_ERROR_CODE_RENDER_UNAVAILABLE";
  BrowserReadErrorCode2[BrowserReadErrorCode2["BROWSER_READ_ERROR_CODE_TIMEOUT"] = 3] = "BROWSER_READ_ERROR_CODE_TIMEOUT";
  BrowserReadErrorCode2[BrowserReadErrorCode2["BROWSER_READ_ERROR_CODE_PROVIDER_FAILURE"] = 4] = "BROWSER_READ_ERROR_CODE_PROVIDER_FAILURE";
  BrowserReadErrorCode2[BrowserReadErrorCode2["BROWSER_READ_ERROR_CODE_TRANSPORT_FAILURE"] = 5] = "BROWSER_READ_ERROR_CODE_TRANSPORT_FAILURE";
  BrowserReadErrorCode2[BrowserReadErrorCode2["BROWSER_READ_ERROR_CODE_STALE_SNAPSHOT"] = 6] = "BROWSER_READ_ERROR_CODE_STALE_SNAPSHOT";
  BrowserReadErrorCode2[BrowserReadErrorCode2["BROWSER_READ_ERROR_CODE_RENDER_ERROR"] = 7] = "BROWSER_READ_ERROR_CODE_RENDER_ERROR";
  BrowserReadErrorCode2[BrowserReadErrorCode2["BROWSER_READ_ERROR_CODE_NO_RESPONDER"] = 8] = "BROWSER_READ_ERROR_CODE_NO_RESPONDER";
})(BrowserReadErrorCode || (BrowserReadErrorCode = {}));
var BrowserLayoutMetric;
(function(BrowserLayoutMetric2) {
  BrowserLayoutMetric2[BrowserLayoutMetric2["BROWSER_LAYOUT_METRIC_UNSPECIFIED"] = 0] = "BROWSER_LAYOUT_METRIC_UNSPECIFIED";
  BrowserLayoutMetric2[BrowserLayoutMetric2["BROWSER_LAYOUT_METRIC_BOUNDING_CLIENT_RECT"] = 1] = "BROWSER_LAYOUT_METRIC_BOUNDING_CLIENT_RECT";
  BrowserLayoutMetric2[BrowserLayoutMetric2["BROWSER_LAYOUT_METRIC_CLIENT_WIDTH"] = 2] = "BROWSER_LAYOUT_METRIC_CLIENT_WIDTH";
  BrowserLayoutMetric2[BrowserLayoutMetric2["BROWSER_LAYOUT_METRIC_CLIENT_HEIGHT"] = 3] = "BROWSER_LAYOUT_METRIC_CLIENT_HEIGHT";
  BrowserLayoutMetric2[BrowserLayoutMetric2["BROWSER_LAYOUT_METRIC_OFFSET_WIDTH"] = 4] = "BROWSER_LAYOUT_METRIC_OFFSET_WIDTH";
  BrowserLayoutMetric2[BrowserLayoutMetric2["BROWSER_LAYOUT_METRIC_OFFSET_HEIGHT"] = 5] = "BROWSER_LAYOUT_METRIC_OFFSET_HEIGHT";
  BrowserLayoutMetric2[BrowserLayoutMetric2["BROWSER_LAYOUT_METRIC_SCROLL_WIDTH"] = 6] = "BROWSER_LAYOUT_METRIC_SCROLL_WIDTH";
  BrowserLayoutMetric2[BrowserLayoutMetric2["BROWSER_LAYOUT_METRIC_SCROLL_HEIGHT"] = 7] = "BROWSER_LAYOUT_METRIC_SCROLL_HEIGHT";
})(BrowserLayoutMetric || (BrowserLayoutMetric = {}));
var PatchMetadataActionClass;
(function(PatchMetadataActionClass2) {
  PatchMetadataActionClass2[PatchMetadataActionClass2["CREATE"] = 0] = "CREATE";
  PatchMetadataActionClass2[PatchMetadataActionClass2["INSERT"] = 1] = "INSERT";
  PatchMetadataActionClass2[PatchMetadataActionClass2["MOVE"] = 2] = "MOVE";
  PatchMetadataActionClass2[PatchMetadataActionClass2["DELETE"] = 3] = "DELETE";
  PatchMetadataActionClass2[PatchMetadataActionClass2["UPDATE"] = 4] = "UPDATE";
  PatchMetadataActionClass2[PatchMetadataActionClass2["TEXT_CHANGE"] = 5] = "TEXT_CHANGE";
  PatchMetadataActionClass2[PatchMetadataActionClass2["READ"] = 6] = "READ";
  PatchMetadataActionClass2[PatchMetadataActionClass2["INTERNAL"] = 7] = "INTERNAL";
  PatchMetadataActionClass2[PatchMetadataActionClass2["FORCE_RECREATE"] = 8] = "FORCE_RECREATE";
})(PatchMetadataActionClass || (PatchMetadataActionClass = {}));
var CommentPatchMetadataActionClass;
(function(CommentPatchMetadataActionClass2) {
  CommentPatchMetadataActionClass2[CommentPatchMetadataActionClass2["COMMENT_UNSPECIFIED"] = 0] = "COMMENT_UNSPECIFIED";
  CommentPatchMetadataActionClass2[CommentPatchMetadataActionClass2["COMMENT_CREATE"] = 1] = "COMMENT_CREATE";
  CommentPatchMetadataActionClass2[CommentPatchMetadataActionClass2["COMMENT_EDIT"] = 2] = "COMMENT_EDIT";
  CommentPatchMetadataActionClass2[CommentPatchMetadataActionClass2["COMMENT_REPLY"] = 3] = "COMMENT_REPLY";
  CommentPatchMetadataActionClass2[CommentPatchMetadataActionClass2["COMMENT_DELETE"] = 4] = "COMMENT_DELETE";
  CommentPatchMetadataActionClass2[CommentPatchMetadataActionClass2["COMMENT_VIEW"] = 5] = "COMMENT_VIEW";
  CommentPatchMetadataActionClass2[CommentPatchMetadataActionClass2["COMMENT_RESOLVE"] = 6] = "COMMENT_RESOLVE";
})(CommentPatchMetadataActionClass || (CommentPatchMetadataActionClass = {}));
var PatchMetadataPermissionClass;
(function(PatchMetadataPermissionClass2) {
  PatchMetadataPermissionClass2[PatchMetadataPermissionClass2["CONTENT"] = 0] = "CONTENT";
  PatchMetadataPermissionClass2[PatchMetadataPermissionClass2["TEXT_ONLY"] = 1] = "TEXT_ONLY";
  PatchMetadataPermissionClass2[PatchMetadataPermissionClass2["CODE_EDITOR"] = 2] = "CODE_EDITOR";
  PatchMetadataPermissionClass2[PatchMetadataPermissionClass2["APPEARANCE"] = 3] = "APPEARANCE";
  PatchMetadataPermissionClass2[PatchMetadataPermissionClass2["MODULES"] = 4] = "MODULES";
  PatchMetadataPermissionClass2[PatchMetadataPermissionClass2["ENTITY_IMAGES"] = 5] = "ENTITY_IMAGES";
  PatchMetadataPermissionClass2[PatchMetadataPermissionClass2["PROJECT_IMAGES"] = 6] = "PROJECT_IMAGES";
  PatchMetadataPermissionClass2[PatchMetadataPermissionClass2["VERSION_HISTORY"] = 7] = "VERSION_HISTORY";
  PatchMetadataPermissionClass2[PatchMetadataPermissionClass2["COMMENTS"] = 8] = "COMMENTS";
  PatchMetadataPermissionClass2[PatchMetadataPermissionClass2["EXTENSIONS"] = 9] = "EXTENSIONS";
})(PatchMetadataPermissionClass || (PatchMetadataPermissionClass = {}));
var PatchCause;
(function(PatchCause2) {
  PatchCause2[PatchCause2["PATCH_CAUSE_USER"] = 0] = "PATCH_CAUSE_USER";
  PatchCause2[PatchCause2["PATCH_CAUSE_UNDO"] = 1] = "PATCH_CAUSE_UNDO";
  PatchCause2[PatchCause2["PATCH_CAUSE_REDO"] = 2] = "PATCH_CAUSE_REDO";
  PatchCause2[PatchCause2["PATCH_CAUSE_CORRECTION"] = 3] = "PATCH_CAUSE_CORRECTION";
})(PatchCause || (PatchCause = {}));
var PatchOwner;
(function(PatchOwner2) {
  PatchOwner2[PatchOwner2["PATCH_OWNER_UI"] = 0] = "PATCH_OWNER_UI";
  PatchOwner2[PatchOwner2["PATCH_OWNER_CODE_EDITOR"] = 1] = "PATCH_OWNER_CODE_EDITOR";
  PatchOwner2[PatchOwner2["PATCH_OWNER_RESTORE_ACTION"] = 2] = "PATCH_OWNER_RESTORE_ACTION";
  PatchOwner2[PatchOwner2["PATCH_OWNER_CUSTOM_CSS_SERVICE"] = 3] = "PATCH_OWNER_CUSTOM_CSS_SERVICE";
})(PatchOwner || (PatchOwner = {}));
var SocialNetworkType;
(function(SocialNetworkType2) {
  SocialNetworkType2[SocialNetworkType2["twitter"] = 0] = "twitter";
  SocialNetworkType2[SocialNetworkType2["facebook"] = 1] = "facebook";
  SocialNetworkType2[SocialNetworkType2["youtube"] = 2] = "youtube";
  SocialNetworkType2[SocialNetworkType2["vkontakte"] = 3] = "vkontakte";
  SocialNetworkType2[SocialNetworkType2["askfm"] = 4] = "askfm";
  SocialNetworkType2[SocialNetworkType2["behance"] = 5] = "behance";
  SocialNetworkType2[SocialNetworkType2["dribbble"] = 6] = "dribbble";
  SocialNetworkType2[SocialNetworkType2["flickr"] = 7] = "flickr";
  SocialNetworkType2[SocialNetworkType2["foursquare"] = 8] = "foursquare";
  SocialNetworkType2[SocialNetworkType2["googleplus"] = 9] = "googleplus";
  SocialNetworkType2[SocialNetworkType2["instagram"] = 10] = "instagram";
  SocialNetworkType2[SocialNetworkType2["lastfm"] = 11] = "lastfm";
  SocialNetworkType2[SocialNetworkType2["linkedin"] = 12] = "linkedin";
  SocialNetworkType2[SocialNetworkType2["livejournal"] = 13] = "livejournal";
  SocialNetworkType2[SocialNetworkType2["myspace"] = 14] = "myspace";
  SocialNetworkType2[SocialNetworkType2["odnoklassniki"] = 15] = "odnoklassniki";
  SocialNetworkType2[SocialNetworkType2["pinterest"] = 16] = "pinterest";
  SocialNetworkType2[SocialNetworkType2["soundcloud"] = 17] = "soundcloud";
  SocialNetworkType2[SocialNetworkType2["tumblr"] = 18] = "tumblr";
  SocialNetworkType2[SocialNetworkType2["vimeo"] = 19] = "vimeo";
  SocialNetworkType2[SocialNetworkType2["hangouts"] = 20] = "hangouts";
  SocialNetworkType2[SocialNetworkType2["icq"] = 21] = "icq";
  SocialNetworkType2[SocialNetworkType2["mailruagent"] = 22] = "mailruagent";
  SocialNetworkType2[SocialNetworkType2["messenger"] = 23] = "messenger";
  SocialNetworkType2[SocialNetworkType2["skype"] = 24] = "skype";
  SocialNetworkType2[SocialNetworkType2["snapchat"] = 25] = "snapchat";
  SocialNetworkType2[SocialNetworkType2["telegram"] = 26] = "telegram";
  SocialNetworkType2[SocialNetworkType2["viber"] = 27] = "viber";
  SocialNetworkType2[SocialNetworkType2["whatsapp"] = 28] = "whatsapp";
  SocialNetworkType2[SocialNetworkType2["email"] = 29] = "email";
  SocialNetworkType2[SocialNetworkType2["website"] = 30] = "website";
  SocialNetworkType2[SocialNetworkType2["mapmarker"] = 31] = "mapmarker";
  SocialNetworkType2[SocialNetworkType2["world"] = 32] = "world";
  SocialNetworkType2[SocialNetworkType2["address"] = 33] = "address";
  SocialNetworkType2[SocialNetworkType2["phone"] = 34] = "phone";
  SocialNetworkType2[SocialNetworkType2["share"] = 35] = "share";
  SocialNetworkType2[SocialNetworkType2["rss"] = 36] = "rss";
  SocialNetworkType2[SocialNetworkType2["appstore"] = 37] = "appstore";
  SocialNetworkType2[SocialNetworkType2["googleplay"] = 38] = "googleplay";
  SocialNetworkType2[SocialNetworkType2["windowsstore"] = 39] = "windowsstore";
  SocialNetworkType2[SocialNetworkType2["wechat"] = 40] = "wechat";
  SocialNetworkType2[SocialNetworkType2["weibo"] = 41] = "weibo";
  SocialNetworkType2[SocialNetworkType2["blogger"] = 42] = "blogger";
  SocialNetworkType2[SocialNetworkType2["medium"] = 43] = "medium";
  SocialNetworkType2[SocialNetworkType2["dropbox"] = 44] = "dropbox";
  SocialNetworkType2[SocialNetworkType2["googledrive"] = 45] = "googledrive";
  SocialNetworkType2[SocialNetworkType2["slack"] = 46] = "slack";
  SocialNetworkType2[SocialNetworkType2["github"] = 47] = "github";
  SocialNetworkType2[SocialNetworkType2["pdf"] = 48] = "pdf";
  SocialNetworkType2[SocialNetworkType2["doc"] = 49] = "doc";
  SocialNetworkType2[SocialNetworkType2["xls"] = 50] = "xls";
  SocialNetworkType2[SocialNetworkType2["ppt"] = 51] = "ppt";
  SocialNetworkType2[SocialNetworkType2["xing"] = 52] = "xing";
  SocialNetworkType2[SocialNetworkType2["meetup"] = 53] = "meetup";
  SocialNetworkType2[SocialNetworkType2["yandexdzen"] = 54] = "yandexdzen";
  SocialNetworkType2[SocialNetworkType2["fleeped"] = 55] = "fleeped";
  SocialNetworkType2[SocialNetworkType2["yandexZnatoki"] = 56] = "yandexZnatoki";
  SocialNetworkType2[SocialNetworkType2["yandexQ"] = 57] = "yandexQ";
  SocialNetworkType2[SocialNetworkType2["tripAdvisor"] = 58] = "tripAdvisor";
  SocialNetworkType2[SocialNetworkType2["spotify"] = 59] = "spotify";
  SocialNetworkType2[SocialNetworkType2["tiktok"] = 60] = "tiktok";
  SocialNetworkType2[SocialNetworkType2["workplace"] = 61] = "workplace";
  SocialNetworkType2[SocialNetworkType2["gmail"] = 62] = "gmail";
  SocialNetworkType2[SocialNetworkType2["iTunesPodcasts"] = 63] = "iTunesPodcasts";
  SocialNetworkType2[SocialNetworkType2["zoom"] = 64] = "zoom";
  SocialNetworkType2[SocialNetworkType2["teams"] = 65] = "teams";
  SocialNetworkType2[SocialNetworkType2["onedrive"] = 66] = "onedrive";
  SocialNetworkType2[SocialNetworkType2["discord"] = 67] = "discord";
  SocialNetworkType2[SocialNetworkType2["twitch"] = 68] = "twitch";
  SocialNetworkType2[SocialNetworkType2["line"] = 69] = "line";
  SocialNetworkType2[SocialNetworkType2["patreon"] = 70] = "patreon";
  SocialNetworkType2[SocialNetworkType2["kofi"] = 71] = "kofi";
  SocialNetworkType2[SocialNetworkType2["yammer"] = 72] = "yammer";
  SocialNetworkType2[SocialNetworkType2["buyMeACoffee"] = 73] = "buyMeACoffee";
  SocialNetworkType2[SocialNetworkType2["huaweiAppGallery"] = 74] = "huaweiAppGallery";
  SocialNetworkType2[SocialNetworkType2["googleBusiness"] = 75] = "googleBusiness";
  SocialNetworkType2[SocialNetworkType2["reddit"] = 76] = "reddit";
  SocialNetworkType2[SocialNetworkType2["strava"] = 77] = "strava";
  SocialNetworkType2[SocialNetworkType2["goodreads"] = 78] = "goodreads";
  SocialNetworkType2[SocialNetworkType2["custom"] = 79] = "custom";
  SocialNetworkType2[SocialNetworkType2["yelp"] = 80] = "yelp";
  SocialNetworkType2[SocialNetworkType2["google"] = 81] = "google";
  SocialNetworkType2[SocialNetworkType2["mastodon"] = 82] = "mastodon";
  SocialNetworkType2[SocialNetworkType2["xcom"] = 83] = "xcom";
  SocialNetworkType2[SocialNetworkType2["glassdoor"] = 84] = "glassdoor";
  SocialNetworkType2[SocialNetworkType2["threads"] = 85] = "threads";
  SocialNetworkType2[SocialNetworkType2["bluesky"] = 86] = "bluesky";
  SocialNetworkType2[SocialNetworkType2["digg"] = 87] = "digg";
  SocialNetworkType2[SocialNetworkType2["meet"] = 88] = "meet";
})(SocialNetworkType || (SocialNetworkType = {}));
var MenuType;
(function(MenuType2) {
  MenuType2[MenuType2["links"] = 0] = "links";
  MenuType2[MenuType2["icons"] = 1] = "icons";
  MenuType2[MenuType2["linksWithIcons"] = 2] = "linksWithIcons";
})(MenuType || (MenuType = {}));
var SyncModuleState;
(function(SyncModuleState2) {
  SyncModuleState2[SyncModuleState2["ON_WITHOUT_CHANGES"] = 0] = "ON_WITHOUT_CHANGES";
  SyncModuleState2[SyncModuleState2["ON_WITH_CHANGES"] = 1] = "ON_WITH_CHANGES";
  SyncModuleState2[SyncModuleState2["OFF_WITHOUT_CHANGES"] = 2] = "OFF_WITHOUT_CHANGES";
  SyncModuleState2[SyncModuleState2["OFF_WITH_CHANGES"] = 3] = "OFF_WITH_CHANGES";
})(SyncModuleState || (SyncModuleState = {}));
var CommentViewMode;
(function(CommentViewMode2) {
  CommentViewMode2[CommentViewMode2["DESKTOP"] = 0] = "DESKTOP";
  CommentViewMode2[CommentViewMode2["MOBILE"] = 1] = "MOBILE";
})(CommentViewMode || (CommentViewMode = {}));
var SmartBlockSourceType;
(function(SmartBlockSourceType2) {
  SmartBlockSourceType2[SmartBlockSourceType2["SMART_BLOCK_SOURCE_TYPE_UNSPECIFIED"] = 0] = "SMART_BLOCK_SOURCE_TYPE_UNSPECIFIED";
  SmartBlockSourceType2[SmartBlockSourceType2["SMART_BLOCK_SOURCE_TYPE_WEBSITE_PAGE"] = 1] = "SMART_BLOCK_SOURCE_TYPE_WEBSITE_PAGE";
  SmartBlockSourceType2[SmartBlockSourceType2["SMART_BLOCK_SOURCE_TYPE_DATA_FEED"] = 2] = "SMART_BLOCK_SOURCE_TYPE_DATA_FEED";
})(SmartBlockSourceType || (SmartBlockSourceType = {}));
var ResponseError_ErrorCode;
(function(ResponseError_ErrorCode2) {
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["BAD_REQUEST"] = 0] = "BAD_REQUEST";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["READ_PERMISSIONS"] = 1] = "READ_PERMISSIONS";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["UNAUTHORIZED"] = 2] = "UNAUTHORIZED";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["INTERNAL"] = 3] = "INTERNAL";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["UNIQUE_EMAILS_LIMIT_REACHED"] = 4] = "UNIQUE_EMAILS_LIMIT_REACHED";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["GET_AUTO_SAVE_CONFIG"] = 5] = "GET_AUTO_SAVE_CONFIG";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["SAVE_AND_GET_MODEL"] = 6] = "SAVE_AND_GET_MODEL";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["GET_NEWER_PATCHES"] = 7] = "GET_NEWER_PATCHES";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["SAVE_SCREENSHOT"] = 8] = "SAVE_SCREENSHOT";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["GET_MODEL_WITH_SCREENSHOT_DATA"] = 9] = "GET_MODEL_WITH_SCREENSHOT_DATA";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["GET_SAVE_PACK_DATA"] = 10] = "GET_SAVE_PACK_DATA";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["SAVE_DIRTY_HTML"] = 11] = "SAVE_DIRTY_HTML";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["SAVE_COMPILED_HTML"] = 12] = "SAVE_COMPILED_HTML";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["SAVE_MODEL_WITH_PATCH_FOR_ANALYTICS"] = 13] = "SAVE_MODEL_WITH_PATCH_FOR_ANALYTICS";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["SAVE_UPDATED_MODEL"] = 14] = "SAVE_UPDATED_MODEL";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["GET_CONNECT_TO_MODEL_INFO"] = 15] = "GET_CONNECT_TO_MODEL_INFO";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["GET_MODEL_WITH_DIRTY_INFO"] = 16] = "GET_MODEL_WITH_DIRTY_INFO";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["SAVE_RECEIVED_PATCH"] = 17] = "SAVE_RECEIVED_PATCH";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["GET_MODEL_WITH_COMPILED"] = 18] = "GET_MODEL_WITH_COMPILED";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["GET_MODEL"] = 19] = "GET_MODEL";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["SERIALIZATION_ERROR"] = 20] = "SERIALIZATION_ERROR";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["DESERIALIZATION_ERROR"] = 21] = "DESERIALIZATION_ERROR";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["MERGE_ERROR"] = 22] = "MERGE_ERROR";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["APPLY_PATCH_ERROR"] = 23] = "APPLY_PATCH_ERROR";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["CONVERT_MODEL_TO_HTML_ERROR"] = 24] = "CONVERT_MODEL_TO_HTML_ERROR";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["NOT_ABLE_TO_DELIVER_MESSAGE_FOR_TOO_LONG"] = 25] = "NOT_ABLE_TO_DELIVER_MESSAGE_FOR_TOO_LONG";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["GET_LAST_PATCH_GROUPS"] = 26] = "GET_LAST_PATCH_GROUPS";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["GET_PATCH_GROUPS"] = 27] = "GET_PATCH_GROUPS";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["PATCH_FORBIDDEN"] = 28] = "PATCH_FORBIDDEN";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["NOT_ABLE_TO_SAVE_PATCH"] = 29] = "NOT_ABLE_TO_SAVE_PATCH";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["FAILED_TO_GET_NOT_APPLIED_PATCHES"] = 30] = "FAILED_TO_GET_NOT_APPLIED_PATCHES";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["DECOMPRESS_ERROR"] = 31] = "DECOMPRESS_ERROR";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["FAILED_TO_COMPILE_EMAIL"] = 32] = "FAILED_TO_COMPILE_EMAIL";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["PATCH_APPLICATION_HANGS"] = 33] = "PATCH_APPLICATION_HANGS";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["FORBIDDEN"] = 34] = "FORBIDDEN";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["EMAIL_TEMPLATE_NOT_FOUND"] = 35] = "EMAIL_TEMPLATE_NOT_FOUND";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["PLUGIN_NOT_FOUND"] = 36] = "PLUGIN_NOT_FOUND";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["LONG_POLLING_DESERIALIZATION_ERROR"] = 37] = "LONG_POLLING_DESERIALIZATION_ERROR";
  ResponseError_ErrorCode2[ResponseError_ErrorCode2["LONG_POLLING_SERIALIZATION_ERROR"] = 38] = "LONG_POLLING_SERIALIZATION_ERROR";
})(ResponseError_ErrorCode || (ResponseError_ErrorCode = {}));
var MSRequestDirtyModelRepresentationAtPatchRestoreMode;
(function(MSRequestDirtyModelRepresentationAtPatchRestoreMode2) {
  MSRequestDirtyModelRepresentationAtPatchRestoreMode2[MSRequestDirtyModelRepresentationAtPatchRestoreMode2["NONE"] = 0] = "NONE";
  MSRequestDirtyModelRepresentationAtPatchRestoreMode2[MSRequestDirtyModelRepresentationAtPatchRestoreMode2["FORWARD"] = 1] = "FORWARD";
  MSRequestDirtyModelRepresentationAtPatchRestoreMode2[MSRequestDirtyModelRepresentationAtPatchRestoreMode2["BACKWARD"] = 2] = "BACKWARD";
})(MSRequestDirtyModelRepresentationAtPatchRestoreMode || (MSRequestDirtyModelRepresentationAtPatchRestoreMode = {}));
var MasterCssVar;
(function(MasterCssVar2) {
  MasterCssVar2["WRAPPER_BACKGROUND_COLOR"] = "--common__wrapperBackgroundColor";
  MasterCssVar2["WRAPPER_BACKGROUND_GRADIENT"] = "--common__wrapperBackgroundGradient";
  MasterCssVar2["WRAPPER_BACKGROUND_IMAGE"] = "--common__wrapperBackgroundImage";
  MasterCssVar2["WRAPPER_BACKGROUND_REPEAT"] = "--common__wrapperBackgroundRepeat";
  MasterCssVar2["WRAPPER_BACKGROUND_POSITION_X"] = "--common__wrapperBackgroundPositionX";
  MasterCssVar2["WRAPPER_BACKGROUND_POSITION_Y"] = "--common__wrapperBackgroundPositionY";
  MasterCssVar2["BACKGROUND_IMAGE_WIDTH"] = "--common__backgroundImageWidth";
  MasterCssVar2["BACKGROUND_IMAGE_HEIGHT"] = "--common__backgroundImageHeight";
  MasterCssVar2["EMAIL_CONTENT_WIDTH"] = "--common__emailContentWidth";
  MasterCssVar2["LINK_DECORATION"] = "--common__linkDecoration";
  MasterCssVar2["ADAPT_DESIGN"] = "--adapt__design";
  MasterCssVar2["HIDE_IMAGE_DOWNLOAD_ICONS"] = "--common__hideImageDownloadIcons";
  MasterCssVar2["RTL_TEXT"] = "--common__rtlText";
  MasterCssVar2["CUSTOM_LISTS_STYLES"] = "--common__customListsStyles";
  MasterCssVar2["LIST_TOP_BOTTOM_MARGIN"] = "--common__listTopBottomMargin";
  MasterCssVar2["LIST_LEFT_INDENT"] = "--common__listLeftIndent";
  MasterCssVar2["LIST_MARKER_COLOR"] = "--common__listMarkerColor";
  MasterCssVar2["LIST_NUMBER_MARKER_COLOR"] = "--common__listNumberMarkerColor";
  MasterCssVar2["LIST_ITEMS_BOTTOM_MARGIN"] = "--common__listBottomMargin";
  MasterCssVar2["DEFAULT_STRUCTURE_TOP_PADDING"] = "--common__defaultStructureTopPadding";
  MasterCssVar2["DEFAULT_STRUCTURE_RIGHT_PADDING"] = "--common__defaultStructureRightPadding";
  MasterCssVar2["DEFAULT_STRUCTURE_BOTTOM_PADDING"] = "--common__defaultStructureBottomPadding";
  MasterCssVar2["DEFAULT_STRUCTURE_LEFT_PADDING"] = "--common__defaultStructureLeftPadding";
  MasterCssVar2["ADAPT_DEFAULT_STRUCTURE_TOP_PADDING"] = "--common__defaultMobileStructureTopPadding";
  MasterCssVar2["ADAPT_DEFAULT_STRUCTURE_RIGHT_PADDING"] = "--common__defaultMobileStructureRightPadding";
  MasterCssVar2["ADAPT_DEFAULT_STRUCTURE_BOTTOM_PADDING"] = "--common__defaultMobileStructureBottomPadding";
  MasterCssVar2["ADAPT_DEFAULT_STRUCTURE_LEFT_PADDING"] = "--common__defaultMobileStructureLeftPadding";
  MasterCssVar2["FONT"] = "--stripes__font";
  MasterCssVar2["STRIPES_FONT_WEIGHT"] = "--stripes__fontWeight";
  MasterCssVar2["CONTENT_FONT_SIZE"] = "--stripes__contentFontSize";
  MasterCssVar2["ADAPT_FONT_SIZE"] = "--adapt__fontSize";
  MasterCssVar2["LINE_HEIGHT"] = "--stripes__lineHeight";
  MasterCssVar2["ADAPT_LINE_HEIGHT"] = "--adapt__lineHeight";
  MasterCssVar2["LETTER_SPACING"] = "--stripes__letterSpacing";
  MasterCssVar2["CONTENT_FONT_COLOR"] = "--stripes__contentFontColor";
  MasterCssVar2["CONTENT_LINK_COLOR"] = "--stripes__contentLinkColor";
  MasterCssVar2["CONTENT_LINK_COLOR_HOVER"] = "--stripes__contentLinkColor_hover";
  MasterCssVar2["CONTENT_BACKGROUND_COLOR"] = "--stripes__contentBackgroundColor";
  MasterCssVar2["CONTENT_BACKGROUND_GRADIENT"] = "--stripes__contentBackgroundGradient";
  MasterCssVar2["CONTENT_PARAGRAPH_BOTTOM_MARGIN"] = "--stripes__contentParagraphBottomMargin";
  MasterCssVar2["ADAPT_CONTENT_PARAGRAPH_BOTTOM_MARGIN"] = "--adapt__contentParagraphBottomMargin";
  MasterCssVar2["HEADER_BACKGROUND_COLOR"] = "--stripes__headerBackgroundColor";
  MasterCssVar2["HEADER_BACKGROUND_GRADIENT"] = "--stripes__headerBackgroundGradient";
  MasterCssVar2["HEADER_BACKGROUND_IMAGE"] = "--stripes__headerBackgroundImage";
  MasterCssVar2["HEADER_BACKGROUND_REPEAT"] = "--stripes__headerBackgroundRepeat";
  MasterCssVar2["HEADER_BACKGROUND_POSITION_X"] = "--stripes__headerBackgroundPositionX";
  MasterCssVar2["HEADER_BACKGROUND_POSITION_Y"] = "--stripes__headerBackgroundPositionY";
  MasterCssVar2["HEADER_BACKGROUND_IMAGE_WIDTH"] = "--stripes__headerBackgroundImageWidth";
  MasterCssVar2["HEADER_BACKGROUND_IMAGE_HEIGHT"] = "--stripes__headerBackgroundImageHeight";
  MasterCssVar2["HEADER_CONTENT_BACKGROUND_COLOR"] = "--stripes__headerContentBackgroundColor";
  MasterCssVar2["HEADER_CONTENT_BACKGROUND_GRADIENT"] = "--stripes__headerContentBackgroundGradient";
  MasterCssVar2["HEADER_FONT_SIZE"] = "--stripes__headerFontSize";
  MasterCssVar2["ADAPT_HEADER_FONT_SIZE"] = "--adapt__headerFontSize";
  MasterCssVar2["HEADER_FONT_COLOR"] = "--stripes__headerFontColor";
  MasterCssVar2["HEADER_LINK_COLOR"] = "--stripes__headerLinkColor";
  MasterCssVar2["HEADER_LINK_COLOR_HOVER"] = "--stripes__headerLinkColor_hover";
  MasterCssVar2["HEADER_PARAGRAPH_BOTTOM_MARGIN"] = "--stripes__headerParagraphBottomMargin";
  MasterCssVar2["ADAPT_HEADER_PARAGRAPH_BOTTOM_MARGIN"] = "--adapt__headerParagraphBottomMargin";
  MasterCssVar2["FOOTER_FONT_SIZE"] = "--stripes__footerFontSize";
  MasterCssVar2["ADAPT_FOOTER_FONT_SIZE"] = "--adapt__footerFontSize";
  MasterCssVar2["FOOTER_FONT_COLOR"] = "--stripes__footerFontColor";
  MasterCssVar2["FOOTER_LINK_COLOR"] = "--stripes__footerLinkColor";
  MasterCssVar2["FOOTER_LINK_COLOR_HOVER"] = "--stripes__footerLinkColor_hover";
  MasterCssVar2["FOOTER_BACKGROUND_COLOR"] = "--stripes__footerBackgroundColor";
  MasterCssVar2["FOOTER_BACKGROUND_GRADIENT"] = "--stripes__footerBackgroundGradient";
  MasterCssVar2["FOOTER_BACKGROUND_IMAGE"] = "--stripes__footerBackgroundImage";
  MasterCssVar2["FOOTER_BACKGROUND_REPEAT"] = "--stripes__footerBackgroundRepeat";
  MasterCssVar2["FOOTER_BACKGROUND_POSITION_X"] = "--stripes__footerBackgroundPositionX";
  MasterCssVar2["FOOTER_BACKGROUND_POSITION_Y"] = "--stripes__footerBackgroundPositionY";
  MasterCssVar2["FOOTER_BACKGROUND_IMAGE_WIDTH"] = "--stripes__footerBackgroundImageWidth";
  MasterCssVar2["FOOTER_BACKGROUND_IMAGE_HEIGHT"] = "--stripes__footerBackgroundImageHeight";
  MasterCssVar2["FOOTER_CONTENT_BACKGROUND_COLOR"] = "--stripes__footerContentBackgroundColor";
  MasterCssVar2["FOOTER_CONTENT_BACKGROUND_GRADIENT"] = "--stripes__footerContentBackgroundGradient";
  MasterCssVar2["FOOTER_PARAGRAPH_BOTTOM_MARGIN"] = "--stripes__footerParagraphBottomMargin";
  MasterCssVar2["ADAPT_FOOTER_PARAGRAPH_BOTTOM_MARGIN"] = "--adapt__footerParagraphBottomMargin";
  MasterCssVar2["INFO_FONT_SIZE"] = "--stripes__infoFontSize";
  MasterCssVar2["ADAPT_INFO_FONT_SIZE"] = "--adapt__infoFontSize";
  MasterCssVar2["INFO_FONT_COLOR"] = "--stripes__infoFontColor";
  MasterCssVar2["INFO_LINK_COLOR"] = "--stripes__infoLinkColor";
  MasterCssVar2["INFO_LINK_COLOR_HOVER"] = "--stripes__infoLinkColor_hover";
  MasterCssVar2["INFO_PARAGRAPH_BOTTOM_MARGIN"] = "--stripes__infoParagraphBottomMargin";
  MasterCssVar2["ADAPT_INFO_PARAGRAPH_BOTTOM_MARGIN"] = "--adapt__infoParagraphBottomMargin";
  MasterCssVar2["TITLE_FONT"] = "--title__font";
  MasterCssVar2["TITLE_LETTER_SPACING"] = "--title__letterSpacing";
  MasterCssVar2["H1_FONT_SIZE"] = "--title__h1FontSize";
  MasterCssVar2["ADAPT_H1_FONT_SIZE"] = "--adapt__titleH1FontSize";
  MasterCssVar2["H1_LINE_HEIGHT"] = "--title__h1LineHeight";
  MasterCssVar2["ADAPT_H1_LINE_HEIGHT"] = "--adapt__titleH1LineHeight";
  MasterCssVar2["H1_FONT_COLOR"] = "--title__h1FontColor";
  MasterCssVar2["H1_FONT_STYLE"] = "--title__h1FontStyle";
  MasterCssVar2["H1_FONT_WEIGHT"] = "--title__h1FontWeight";
  MasterCssVar2["H1_PARAGRAPH_BOTTOM_MARGIN"] = "--title__h1ParagraphBottomMargin";
  MasterCssVar2["ADAPT_H1_PARAGRAPH_BOTTOM_MARGIN"] = "--adapt__titleH1ParagraphBottomMargin";
  MasterCssVar2["ADAPT_H1_FONT_ALIGN"] = "--adapt__titleH1FontAlign";
  MasterCssVar2["H2_FONT_SIZE"] = "--title__h2FontSize";
  MasterCssVar2["ADAPT_H2_FONT_SIZE"] = "--adapt__titleH2FontSize";
  MasterCssVar2["H2_LINE_HEIGHT"] = "--title__h2LineHeight";
  MasterCssVar2["ADAPT_H2_LINE_HEIGHT"] = "--adapt__titleH2LineHeight";
  MasterCssVar2["H2_FONT_COLOR"] = "--title__h2FontColor";
  MasterCssVar2["H2_FONT_STYLE"] = "--title__h2FontStyle";
  MasterCssVar2["H2_FONT_WEIGHT"] = "--title__h2FontWeight";
  MasterCssVar2["H2_PARAGRAPH_BOTTOM_MARGIN"] = "--title__h2ParagraphBottomMargin";
  MasterCssVar2["ADAPT_H2_PARAGRAPH_BOTTOM_MARGIN"] = "--adapt__titleH2ParagraphBottomMargin";
  MasterCssVar2["ADAPT_H2_FONT_ALIGN"] = "--adapt__titleH2FontAlign";
  MasterCssVar2["H3_FONT_SIZE"] = "--title__h3FontSize";
  MasterCssVar2["ADAPT_H3_FONT_SIZE"] = "--adapt__titleH3FontSize";
  MasterCssVar2["H3_LINE_HEIGHT"] = "--title__h3LineHeight";
  MasterCssVar2["ADAPT_H3_LINE_HEIGHT"] = "--adapt__titleH3LineHeight";
  MasterCssVar2["H3_FONT_COLOR"] = "--title__h3FontColor";
  MasterCssVar2["H3_FONT_STYLE"] = "--title__h3FontStyle";
  MasterCssVar2["H3_FONT_WEIGHT"] = "--title__h3FontWeight";
  MasterCssVar2["H3_PARAGRAPH_BOTTOM_MARGIN"] = "--title__h3ParagraphBottomMargin";
  MasterCssVar2["ADAPT_H3_PARAGRAPH_BOTTOM_MARGIN"] = "--adapt__titleH3ParagraphBottomMargin";
  MasterCssVar2["ADAPT_H3_FONT_ALIGN"] = "--adapt__titleH3FontAlign";
  MasterCssVar2["H4_FONT_SIZE"] = "--title__h4FontSize";
  MasterCssVar2["ADAPT_H4_FONT_SIZE"] = "--adapt__titleH4FontSize";
  MasterCssVar2["H4_LINE_HEIGHT"] = "--title__h4LineHeight";
  MasterCssVar2["ADAPT_H4_LINE_HEIGHT"] = "--adapt__titleH4LineHeight";
  MasterCssVar2["H4_FONT_COLOR"] = "--title__h4FontColor";
  MasterCssVar2["H4_FONT_STYLE"] = "--title__h4FontStyle";
  MasterCssVar2["H4_FONT_WEIGHT"] = "--title__h4FontWeight";
  MasterCssVar2["H4_PARAGRAPH_BOTTOM_MARGIN"] = "--title__h4ParagraphBottomMargin";
  MasterCssVar2["ADAPT_H4_PARAGRAPH_BOTTOM_MARGIN"] = "--adapt__titleH4ParagraphBottomMargin";
  MasterCssVar2["ADAPT_H4_FONT_ALIGN"] = "--adapt__titleH4FontAlign";
  MasterCssVar2["H5_FONT_SIZE"] = "--title__h5FontSize";
  MasterCssVar2["ADAPT_H5_FONT_SIZE"] = "--adapt__titleH5FontSize";
  MasterCssVar2["H5_LINE_HEIGHT"] = "--title__h5LineHeight";
  MasterCssVar2["ADAPT_H5_LINE_HEIGHT"] = "--adapt__titleH5LineHeight";
  MasterCssVar2["H5_FONT_COLOR"] = "--title__h5FontColor";
  MasterCssVar2["H5_FONT_STYLE"] = "--title__h5FontStyle";
  MasterCssVar2["H5_FONT_WEIGHT"] = "--title__h5FontWeight";
  MasterCssVar2["H5_PARAGRAPH_BOTTOM_MARGIN"] = "--title__h5ParagraphBottomMargin";
  MasterCssVar2["ADAPT_H5_PARAGRAPH_BOTTOM_MARGIN"] = "--adapt__titleH5ParagraphBottomMargin";
  MasterCssVar2["ADAPT_H5_FONT_ALIGN"] = "--adapt__titleH5FontAlign";
  MasterCssVar2["H6_FONT_SIZE"] = "--title__h6FontSize";
  MasterCssVar2["ADAPT_H6_FONT_SIZE"] = "--adapt__titleH6FontSize";
  MasterCssVar2["H6_LINE_HEIGHT"] = "--title__h6LineHeight";
  MasterCssVar2["ADAPT_H6_LINE_HEIGHT"] = "--adapt__titleH6LineHeight";
  MasterCssVar2["H6_FONT_COLOR"] = "--title__h6FontColor";
  MasterCssVar2["H6_FONT_STYLE"] = "--title__h6FontStyle";
  MasterCssVar2["H6_FONT_WEIGHT"] = "--title__h6FontWeight";
  MasterCssVar2["H6_PARAGRAPH_BOTTOM_MARGIN"] = "--title__h6ParagraphBottomMargin";
  MasterCssVar2["ADAPT_H6_PARAGRAPH_BOTTOM_MARGIN"] = "--adapt__titleH6ParagraphBottomMargin";
  MasterCssVar2["ADAPT_H6_FONT_ALIGN"] = "--adapt__titleH6FontAlign";
  MasterCssVar2["BUTTONS_OUTLOOK_SUPPORT"] = "--buttons__outlookSupport";
  MasterCssVar2["BUTTON_FONT"] = "--button__font";
  MasterCssVar2["BUTTON_FONT_SIZE"] = "--button__fontSize";
  MasterCssVar2["ADAPT_BUTTON_FONT_SIZE"] = "--adapt__buttonFontSize";
  MasterCssVar2["BUTTON_LETTER_SPACING"] = "--button__letterSpacing";
  MasterCssVar2["BUTTON_COLOR"] = "--button__color";
  MasterCssVar2["BUTTON_COLOR_GRADIENT_SOLID"] = "--button__color_gradientSolid";
  MasterCssVar2["BUTTON_COLOR_HOVER"] = "--button__color_hover";
  MasterCssVar2["BUTTON_COLOR_HOVER_GRADIENT_SOLID"] = "--button__color_hover_gradientSolid";
  MasterCssVar2["BUTTON_TEXT_COLOR"] = "--button__textColor";
  MasterCssVar2["BUTTON_TEXT_COLOR_HOVER"] = "--button__textColor_hover";
  MasterCssVar2["BUTTON_FONT_STYLE"] = "--button__fontStyle";
  MasterCssVar2["BUTTON_FONT_WEIGHT"] = "--button__fontWeight";
  MasterCssVar2["BUTTON_BORDER_SIZE_TOP"] = "--button__borderSizeTop";
  MasterCssVar2["BUTTON_BORDER_SIZE_RIGHT"] = "--button__borderSizeRight";
  MasterCssVar2["BUTTON_BORDER_SIZE_BOTTOM"] = "--button__borderSizeBottom";
  MasterCssVar2["BUTTON_BORDER_SIZE_LEFT"] = "--button__borderSizeLeft";
  MasterCssVar2["BUTTON_BORDER_COLOR_TOP"] = "--button__borderColorTop";
  MasterCssVar2["BUTTON_BORDER_COLOR_RIGHT"] = "--button__borderColorRight";
  MasterCssVar2["BUTTON_BORDER_COLOR_BOTTOM"] = "--button__borderColorBottom";
  MasterCssVar2["BUTTON_BORDER_COLOR_LEFT"] = "--button__borderColorLeft";
  MasterCssVar2["BUTTON_BORDER_COLOR_TOP_HOVER"] = "--button__borderColorTop_hover";
  MasterCssVar2["BUTTON_BORDER_COLOR_RIGHT_HOVER"] = "--button__borderColorRight_hover";
  MasterCssVar2["BUTTON_BORDER_COLOR_BOTTOM_HOVER"] = "--button__borderColorBottom_hover";
  MasterCssVar2["BUTTON_BORDER_COLOR_LEFT_HOVER"] = "--button__borderColorLeft_hover";
  MasterCssVar2["BUTTON_BORDER_STYLE"] = "--button__borderStyle";
  MasterCssVar2["BUTTON_PADDING_TOP"] = "--button__paddingTop";
  MasterCssVar2["BUTTON_PADDING_RIGHT"] = "--button__paddingRight";
  MasterCssVar2["BUTTON_PADDING_BOTTOM"] = "--button__paddingBottom";
  MasterCssVar2["BUTTON_PADDING_LEFT"] = "--button__paddingLeft";
  MasterCssVar2["BUTTON_HAS_HOVER"] = "--button__has_hover";
  MasterCssVar2["BUTTON_BORDER_RADIUS_LT"] = "--button__borderRadiusLT";
  MasterCssVar2["BUTTON_BORDER_RADIUS_RT"] = "--button__borderRadiusRT";
  MasterCssVar2["BUTTON_BORDER_RADIUS_RB"] = "--button__borderRadiusRB";
  MasterCssVar2["BUTTON_BORDER_RADIUS_LB"] = "--button__borderRadiusLB";
  MasterCssVar2["BUTTON_DISPLAY"] = "--button__display";
  MasterCssVar2["BUTTON_TEXT_TRANSFORM"] = "--button__textTransform";
  MasterCssVar2["ADAPT_BUTTON_DISPLAY"] = "--adapt__buttonDisplay";
  MasterCssVar2["ADAPT_BUTTON_BORDER_TEXT_ALIGN"] = "--adapt__buttonBorderTextAlign";
  MasterCssVar2["ADAPT_BUTTON_PADDING"] = "--adapt_button_padding";
  MasterCssVar2["ADAPT_BUTTON_PADDING_TOP"] = "--adapt__buttonPaddingTop";
  MasterCssVar2["ADAPT_BUTTON_PADDING_RIGHT"] = "--adapt__buttonPaddingRight";
  MasterCssVar2["ADAPT_BUTTON_PADDING_BOTTOM"] = "--adapt__buttonPaddingBottom";
  MasterCssVar2["ADAPT_BUTTON_PADDING_LEFT"] = "--adapt__buttonPaddingLeft";
  MasterCssVar2["ADAPT_BUTTON_BORDER_SIZE_TOP"] = "--adapt__buttonBorderSizeTop";
  MasterCssVar2["ADAPT_BUTTON_BORDER_SIZE_RIGHT"] = "--adapt__buttonBorderSizeRight";
  MasterCssVar2["ADAPT_BUTTON_BORDER_SIZE_BOTTOM"] = "--adapt__buttonBorderSizeBottom";
  MasterCssVar2["ADAPT_BUTTON_BORDER_SIZE_LEFT"] = "--adapt__buttonBorderSizeLeft";
  MasterCssVar2["ADAPT_BUTTON_BORDER_COLOR_TOP"] = "--adapt__buttonBorderColorTop";
  MasterCssVar2["ADAPT_BUTTON_BORDER_COLOR_RIGHT"] = "--adapt__buttonBorderColorRight";
  MasterCssVar2["ADAPT_BUTTON_BORDER_COLOR_BOTTOM"] = "--adapt__buttonBorderColorBottom";
  MasterCssVar2["ADAPT_BUTTON_BORDER_COLOR_LEFT"] = "--adapt__buttonBorderColorLeft";
  MasterCssVar2["ADAPT_BUTTON_BORDER_STYLE"] = "--adapt__buttonBorderStyle";
  MasterCssVar2["ADAPT_BUTTON_BORDER"] = "--adapt_button_border";
  MasterCssVar2["MESSAGE_HAS_AMP_AND_ROLLOVER"] = "--message__hasAmpAndRollover";
  MasterCssVar2["MESSAGE_HAS_AMP_ACCORDION"] = "--message__hasAmpAccordion";
  MasterCssVar2["MESSAGE_HAS_AMP_FORM"] = "--message__hasAmpForm";
  MasterCssVar2["MESSAGE_HAS_AMP_CAROUSEL"] = "--message__hasAmpCarousel";
  MasterCssVar2["TEMPLATE_THEME_SYNC"] = "--common__templateThemeSync";
  MasterCssVar2["BORDER_COLLAPSE"] = "--borderCollapse";
  MasterCssVar2["DEFAULT_STYLES_ENABLED"] = "--defaultStylesEnabled";
  MasterCssVar2["DARK_WRAPPER_BACKGROUND_COLOR"] = "--dark__commonWrapperBackgroundColor";
  MasterCssVar2["DARK_WRAPPER_BACKGROUND_GRADIENT"] = "--dark__commonWrapperBackgroundGradient";
  MasterCssVar2["DARK_LIST_MARKER_COLOR"] = "--dark__commonListMarkerColor";
  MasterCssVar2["DARK_LIST_NUMBER_MARKER_COLOR"] = "--dark__commonListNumberMarkerColor";
  MasterCssVar2["DARK_CONTENT_FONT_COLOR"] = "--dark__contentFontColor";
  MasterCssVar2["DARK_CONTENT_LINK_COLOR"] = "--dark__contentLinkColor";
  MasterCssVar2["DARK_CONTENT_LINK_COLOR_HOVER"] = "--dark__contentLinkColorHover";
  MasterCssVar2["DARK_CONTENT_BACKGROUND_COLOR"] = "--dark__contentBackgroundColor";
  MasterCssVar2["DARK_CONTENT_BACKGROUND_GRADIENT"] = "--dark__contentBackgroundGradient";
  MasterCssVar2["DARK_HEADER_BACKGROUND_COLOR"] = "--dark__headerBackgroundColor";
  MasterCssVar2["DARK_HEADER_BACKGROUND_GRADIENT"] = "--dark__headerBackgroundGradient";
  MasterCssVar2["DARK_HEADER_CONTENT_BACKGROUND_COLOR"] = "--dark__headerContentBackgroundColor";
  MasterCssVar2["DARK_HEADER_CONTENT_BACKGROUND_GRADIENT"] = "--dark__headerContentBackgroundGradient";
  MasterCssVar2["DARK_HEADER_FONT_COLOR"] = "--dark__headerFontColor";
  MasterCssVar2["DARK_HEADER_LINK_COLOR"] = "--dark__headerLinkColor";
  MasterCssVar2["DARK_HEADER_LINK_COLOR_HOVER"] = "--dark__headerLinkColorHover";
  MasterCssVar2["DARK_FOOTER_BACKGROUND_COLOR"] = "--dark__footerBackgroundColor";
  MasterCssVar2["DARK_FOOTER_BACKGROUND_GRADIENT"] = "--dark__footerBackgroundGradient";
  MasterCssVar2["DARK_FOOTER_CONTENT_BACKGROUND_COLOR"] = "--dark__footerContentBackgroundColor";
  MasterCssVar2["DARK_FOOTER_CONTENT_BACKGROUND_GRADIENT"] = "--dark__footerContentBackgroundGradient";
  MasterCssVar2["DARK_FOOTER_FONT_COLOR"] = "--dark__footerFontColor";
  MasterCssVar2["DARK_FOOTER_LINK_COLOR"] = "--dark__footerLinkColor";
  MasterCssVar2["DARK_FOOTER_LINK_COLOR_HOVER"] = "--dark__footerLinkColorHover";
  MasterCssVar2["DARK_INFO_FONT_COLOR"] = "--dark__infoFontColor";
  MasterCssVar2["DARK_INFO_LINK_COLOR"] = "--dark__infoLinkColor";
  MasterCssVar2["DARK_INFO_LINK_COLOR_HOVER"] = "--dark__infoLinkColorHover";
  MasterCssVar2["DARK_H1_FONT_COLOR"] = "--dark__h1FontColor";
  MasterCssVar2["DARK_H2_FONT_COLOR"] = "--dark__h2FontColor";
  MasterCssVar2["DARK_H3_FONT_COLOR"] = "--dark__h3FontColor";
  MasterCssVar2["DARK_H4_FONT_COLOR"] = "--dark__h4FontColor";
  MasterCssVar2["DARK_H5_FONT_COLOR"] = "--dark__h5FontColor";
  MasterCssVar2["DARK_H6_FONT_COLOR"] = "--dark__h6FontColor";
  MasterCssVar2["DARK_BUTTON_COLOR"] = "--dark__buttonColor";
  MasterCssVar2["DARK_BUTTON_COLOR_GRADIENT"] = "--dark__buttonColorGradient";
  MasterCssVar2["DARK_BUTTON_COLOR_HOVER"] = "--dark__buttonColorHover";
  MasterCssVar2["DARK_BUTTON_COLOR_HOVER_GRADIENT"] = "--dark__buttonColorHoverGradient";
  MasterCssVar2["DARK_BUTTON_TEXT_COLOR"] = "--dark__buttonTextColor";
  MasterCssVar2["DARK_BUTTON_TEXT_COLOR_HOVER"] = "--dark__buttonTextColorHover";
  MasterCssVar2["DARK_BUTTON_BORDER_COLOR_TOP"] = "--dark__buttonBorderColorTop";
  MasterCssVar2["DARK_BUTTON_BORDER_COLOR_RIGHT"] = "--dark__buttonBorderColorRight";
  MasterCssVar2["DARK_BUTTON_BORDER_COLOR_BOTTOM"] = "--dark__buttonBorderColorBottom";
  MasterCssVar2["DARK_BUTTON_BORDER_COLOR_LEFT"] = "--dark__buttonBorderColorLeft";
  MasterCssVar2["DARK_BUTTON_BORDER_COLOR_TOP_HOVER"] = "--dark__buttonBorderColorTopHover";
  MasterCssVar2["DARK_BUTTON_BORDER_COLOR_RIGHT_HOVER"] = "--dark__buttonBorderColorRightHover";
  MasterCssVar2["DARK_BUTTON_BORDER_COLOR_BOTTOM_HOVER"] = "--dark__buttonBorderColorBottomHover";
  MasterCssVar2["DARK_BUTTON_BORDER_COLOR_LEFT_HOVER"] = "--dark__buttonBorderColorLeftHover";
})(MasterCssVar || (MasterCssVar = {}));
var MASTER_CSS_VARIABLES_DEFAULTS = {
  [MasterCssVar.CUSTOM_LISTS_STYLES]: false,
  [MasterCssVar.WRAPPER_BACKGROUND_COLOR]: "#f6f6f6",
  [MasterCssVar.WRAPPER_BACKGROUND_GRADIENT]: "",
  [MasterCssVar.WRAPPER_BACKGROUND_IMAGE]: "",
  [MasterCssVar.WRAPPER_BACKGROUND_REPEAT]: "",
  [MasterCssVar.WRAPPER_BACKGROUND_POSITION_X]: "",
  [MasterCssVar.WRAPPER_BACKGROUND_POSITION_Y]: "",
  [MasterCssVar.BACKGROUND_IMAGE_WIDTH]: "",
  [MasterCssVar.BACKGROUND_IMAGE_HEIGHT]: "",
  [MasterCssVar.EMAIL_CONTENT_WIDTH]: 600,
  [MasterCssVar.LIST_TOP_BOTTOM_MARGIN]: 15,
  [MasterCssVar.LIST_LEFT_INDENT]: 40,
  [MasterCssVar.LIST_MARKER_COLOR]: "var(--stripes__contentFontColor)",
  [MasterCssVar.LIST_NUMBER_MARKER_COLOR]: "var(--stripes__contentFontColor)",
  [MasterCssVar.LIST_ITEMS_BOTTOM_MARGIN]: 15,
  [MasterCssVar.LINK_DECORATION]: "underline",
  [MasterCssVar.RTL_TEXT]: false,
  [MasterCssVar.DEFAULT_STRUCTURE_LEFT_PADDING]: 20,
  [MasterCssVar.DEFAULT_STRUCTURE_TOP_PADDING]: 20,
  [MasterCssVar.DEFAULT_STRUCTURE_RIGHT_PADDING]: 20,
  [MasterCssVar.DEFAULT_STRUCTURE_BOTTOM_PADDING]: 0,
  [MasterCssVar.FONT]: "arial, 'helvetica neue', helvetica, sans-serif",
  [MasterCssVar.STRIPES_FONT_WEIGHT]: "normal",
  [MasterCssVar.LINE_HEIGHT]: "150%",
  [MasterCssVar.LETTER_SPACING]: 0,
  [MasterCssVar.HEADER_BACKGROUND_COLOR]: "transparent",
  [MasterCssVar.HEADER_BACKGROUND_GRADIENT]: "",
  [MasterCssVar.HEADER_CONTENT_BACKGROUND_COLOR]: "#ffffff",
  [MasterCssVar.HEADER_CONTENT_BACKGROUND_GRADIENT]: "",
  [MasterCssVar.HEADER_BACKGROUND_IMAGE]: "",
  [MasterCssVar.HEADER_BACKGROUND_REPEAT]: "",
  [MasterCssVar.HEADER_BACKGROUND_POSITION_X]: "",
  [MasterCssVar.HEADER_BACKGROUND_POSITION_Y]: "",
  [MasterCssVar.HEADER_BACKGROUND_IMAGE_WIDTH]: "",
  [MasterCssVar.HEADER_BACKGROUND_IMAGE_HEIGHT]: "",
  [MasterCssVar.HEADER_FONT_SIZE]: 14,
  [MasterCssVar.HEADER_FONT_COLOR]: "#333333",
  [MasterCssVar.HEADER_LINK_COLOR]: "#1376c8",
  [MasterCssVar.HEADER_LINK_COLOR_HOVER]: "",
  [MasterCssVar.HEADER_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.CONTENT_BACKGROUND_COLOR]: "#ffffff",
  [MasterCssVar.CONTENT_BACKGROUND_GRADIENT]: "",
  [MasterCssVar.CONTENT_FONT_SIZE]: 14,
  [MasterCssVar.CONTENT_FONT_COLOR]: "#333333",
  [MasterCssVar.CONTENT_LINK_COLOR]: "#1376c8",
  [MasterCssVar.CONTENT_LINK_COLOR_HOVER]: "",
  [MasterCssVar.CONTENT_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.FOOTER_BACKGROUND_COLOR]: "transparent",
  [MasterCssVar.FOOTER_BACKGROUND_GRADIENT]: "",
  [MasterCssVar.FOOTER_CONTENT_BACKGROUND_COLOR]: "#ffffff",
  [MasterCssVar.FOOTER_CONTENT_BACKGROUND_GRADIENT]: "",
  [MasterCssVar.FOOTER_BACKGROUND_IMAGE]: "",
  [MasterCssVar.FOOTER_BACKGROUND_REPEAT]: "",
  [MasterCssVar.FOOTER_BACKGROUND_POSITION_X]: "",
  [MasterCssVar.FOOTER_BACKGROUND_POSITION_Y]: "",
  [MasterCssVar.FOOTER_BACKGROUND_IMAGE_WIDTH]: "",
  [MasterCssVar.FOOTER_BACKGROUND_IMAGE_HEIGHT]: "",
  [MasterCssVar.FOOTER_FONT_SIZE]: 14,
  [MasterCssVar.FOOTER_FONT_COLOR]: "#333333",
  [MasterCssVar.FOOTER_LINK_COLOR]: "#1376c8",
  [MasterCssVar.FOOTER_LINK_COLOR_HOVER]: "",
  [MasterCssVar.FOOTER_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.INFO_FONT_SIZE]: 12,
  [MasterCssVar.INFO_FONT_COLOR]: "#cccccc",
  [MasterCssVar.INFO_LINK_COLOR]: "#cccccc",
  [MasterCssVar.INFO_LINK_COLOR_HOVER]: "",
  [MasterCssVar.INFO_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.TITLE_FONT]: "arial, 'helvetica neue', helvetica, sans-serif",
  [MasterCssVar.TITLE_LETTER_SPACING]: 0,
  [MasterCssVar.H1_FONT_SIZE]: 40,
  [MasterCssVar.H1_LINE_HEIGHT]: "120%",
  [MasterCssVar.H1_FONT_STYLE]: "normal",
  [MasterCssVar.H1_FONT_WEIGHT]: "normal",
  [MasterCssVar.H1_FONT_COLOR]: "#333333",
  [MasterCssVar.H1_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.H2_FONT_SIZE]: 32,
  [MasterCssVar.H2_LINE_HEIGHT]: "120%",
  [MasterCssVar.H2_FONT_STYLE]: "normal",
  [MasterCssVar.H2_FONT_WEIGHT]: "normal",
  [MasterCssVar.H2_FONT_COLOR]: "#333333",
  [MasterCssVar.H2_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.H3_FONT_SIZE]: 28,
  [MasterCssVar.H3_LINE_HEIGHT]: "120%",
  [MasterCssVar.H3_FONT_STYLE]: "normal",
  [MasterCssVar.H3_FONT_WEIGHT]: "normal",
  [MasterCssVar.H3_FONT_COLOR]: "#333333",
  [MasterCssVar.H3_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.H4_FONT_SIZE]: 24,
  [MasterCssVar.H4_LINE_HEIGHT]: "120%",
  [MasterCssVar.H4_FONT_STYLE]: "normal",
  [MasterCssVar.H4_FONT_WEIGHT]: "normal",
  [MasterCssVar.H4_FONT_COLOR]: "#333333",
  [MasterCssVar.H4_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.H5_FONT_SIZE]: 20,
  [MasterCssVar.H5_LINE_HEIGHT]: "120%",
  [MasterCssVar.H5_FONT_STYLE]: "normal",
  [MasterCssVar.H5_FONT_WEIGHT]: "normal",
  [MasterCssVar.H5_FONT_COLOR]: "#333333",
  [MasterCssVar.H5_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.H6_FONT_SIZE]: 16,
  [MasterCssVar.H6_LINE_HEIGHT]: "120%",
  [MasterCssVar.H6_FONT_STYLE]: "normal",
  [MasterCssVar.H6_FONT_WEIGHT]: "normal",
  [MasterCssVar.H6_FONT_COLOR]: "#333333",
  [MasterCssVar.H6_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.BUTTON_FONT]: "arial, 'helvetica neue', helvetica, sans-serif",
  [MasterCssVar.BUTTON_FONT_SIZE]: 14,
  [MasterCssVar.BUTTON_FONT_STYLE]: "normal",
  [MasterCssVar.BUTTON_FONT_WEIGHT]: "normal",
  [MasterCssVar.BUTTON_TEXT_COLOR]: "#ffffff",
  [MasterCssVar.BUTTON_LETTER_SPACING]: 0,
  [MasterCssVar.BUTTON_COLOR]: "#31cb4b",
  [MasterCssVar.BUTTON_COLOR_GRADIENT_SOLID]: "#31cb4b",
  [MasterCssVar.BUTTON_BORDER_SIZE_TOP]: 0,
  [MasterCssVar.BUTTON_BORDER_SIZE_RIGHT]: 0,
  [MasterCssVar.BUTTON_BORDER_SIZE_BOTTOM]: 2,
  [MasterCssVar.BUTTON_BORDER_SIZE_LEFT]: 0,
  [MasterCssVar.BUTTON_BORDER_COLOR_TOP]: "#2cb543",
  [MasterCssVar.BUTTON_BORDER_COLOR_RIGHT]: "#2cb543",
  [MasterCssVar.BUTTON_BORDER_COLOR_BOTTOM]: "#2cb543",
  [MasterCssVar.BUTTON_BORDER_COLOR_LEFT]: "#2cb543",
  [MasterCssVar.BUTTON_BORDER_STYLE]: "solid",
  [MasterCssVar.BUTTON_BORDER_RADIUS_LT]: 15,
  [MasterCssVar.BUTTON_BORDER_RADIUS_RT]: 15,
  [MasterCssVar.BUTTON_BORDER_RADIUS_RB]: 15,
  [MasterCssVar.BUTTON_BORDER_RADIUS_LB]: 15,
  [MasterCssVar.BUTTON_PADDING_TOP]: 10,
  [MasterCssVar.BUTTON_PADDING_RIGHT]: 20,
  [MasterCssVar.BUTTON_PADDING_BOTTOM]: 10,
  [MasterCssVar.BUTTON_PADDING_LEFT]: 20,
  [MasterCssVar.BUTTON_TEXT_TRANSFORM]: "none",
  [MasterCssVar.BUTTON_HAS_HOVER]: false,
  [MasterCssVar.BUTTON_COLOR_HOVER]: "#2cb543",
  [MasterCssVar.BUTTON_COLOR_HOVER_GRADIENT_SOLID]: "#2cb543",
  [MasterCssVar.BUTTON_DISPLAY]: "inline-block",
  [MasterCssVar.BUTTONS_OUTLOOK_SUPPORT]: false,
  [MasterCssVar.ADAPT_DESIGN]: true,
  [MasterCssVar.ADAPT_LINE_HEIGHT]: "150%",
  [MasterCssVar.ADAPT_HEADER_FONT_SIZE]: 14,
  [MasterCssVar.ADAPT_HEADER_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.ADAPT_FONT_SIZE]: 14,
  [MasterCssVar.ADAPT_CONTENT_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.ADAPT_FOOTER_FONT_SIZE]: 14,
  [MasterCssVar.ADAPT_FOOTER_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.ADAPT_INFO_FONT_SIZE]: 12,
  [MasterCssVar.ADAPT_INFO_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.ADAPT_H1_FONT_SIZE]: 40,
  [MasterCssVar.ADAPT_H1_FONT_ALIGN]: "left",
  [MasterCssVar.ADAPT_H1_LINE_HEIGHT]: "120%",
  [MasterCssVar.ADAPT_H1_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.ADAPT_H2_FONT_SIZE]: 32,
  [MasterCssVar.ADAPT_H2_FONT_ALIGN]: "left",
  [MasterCssVar.ADAPT_H2_LINE_HEIGHT]: "120%",
  [MasterCssVar.ADAPT_H2_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.ADAPT_H3_FONT_SIZE]: 28,
  [MasterCssVar.ADAPT_H3_FONT_ALIGN]: "left",
  [MasterCssVar.ADAPT_H3_LINE_HEIGHT]: "120%",
  [MasterCssVar.ADAPT_H3_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.ADAPT_H4_FONT_SIZE]: 24,
  [MasterCssVar.ADAPT_H4_FONT_ALIGN]: "left",
  [MasterCssVar.ADAPT_H4_LINE_HEIGHT]: "120%",
  [MasterCssVar.ADAPT_H4_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.ADAPT_H5_FONT_SIZE]: 20,
  [MasterCssVar.ADAPT_H5_FONT_ALIGN]: "left",
  [MasterCssVar.ADAPT_H5_LINE_HEIGHT]: "120%",
  [MasterCssVar.ADAPT_H5_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.ADAPT_H6_FONT_SIZE]: 16,
  [MasterCssVar.ADAPT_H6_FONT_ALIGN]: "left",
  [MasterCssVar.ADAPT_H6_LINE_HEIGHT]: "120%",
  [MasterCssVar.ADAPT_H6_PARAGRAPH_BOTTOM_MARGIN]: "",
  [MasterCssVar.ADAPT_BUTTON_FONT_SIZE]: 14,
  [MasterCssVar.ADAPT_BUTTON_PADDING]: false,
  [MasterCssVar.ADAPT_BUTTON_PADDING_TOP]: 10,
  [MasterCssVar.ADAPT_BUTTON_PADDING_RIGHT]: 20,
  [MasterCssVar.ADAPT_BUTTON_PADDING_BOTTOM]: 10,
  [MasterCssVar.ADAPT_BUTTON_PADDING_LEFT]: 20,
  [MasterCssVar.ADAPT_BUTTON_DISPLAY]: "inline-block",
  [MasterCssVar.ADAPT_BUTTON_BORDER_SIZE_TOP]: 0,
  [MasterCssVar.ADAPT_BUTTON_BORDER_SIZE_RIGHT]: 0,
  [MasterCssVar.ADAPT_BUTTON_BORDER_SIZE_BOTTOM]: 2,
  [MasterCssVar.ADAPT_BUTTON_BORDER_SIZE_LEFT]: 0,
  [MasterCssVar.ADAPT_BUTTON_BORDER_COLOR_TOP]: "#2cb543",
  [MasterCssVar.ADAPT_BUTTON_BORDER_COLOR_RIGHT]: "#2cb543",
  [MasterCssVar.ADAPT_BUTTON_BORDER_COLOR_BOTTOM]: "#2cb543",
  [MasterCssVar.ADAPT_BUTTON_BORDER_COLOR_LEFT]: "#2cb543",
  [MasterCssVar.ADAPT_BUTTON_BORDER_STYLE]: "solid",
  [MasterCssVar.ADAPT_BUTTON_BORDER]: false,
  [MasterCssVar.MESSAGE_HAS_AMP_ACCORDION]: false,
  [MasterCssVar.MESSAGE_HAS_AMP_FORM]: false,
  [MasterCssVar.MESSAGE_HAS_AMP_CAROUSEL]: false,
  [MasterCssVar.DEFAULT_STYLES_ENABLED]: true,
  [MasterCssVar.HIDE_IMAGE_DOWNLOAD_ICONS]: true
};
var LINK_COLOR_HOVER_VARS = [
  MasterCssVar.HEADER_LINK_COLOR_HOVER,
  MasterCssVar.CONTENT_LINK_COLOR_HOVER,
  MasterCssVar.FOOTER_LINK_COLOR_HOVER,
  MasterCssVar.INFO_LINK_COLOR_HOVER
];
var TAG_NORMALIZATION_RULES = {
  "BLOCK_IMAGE": "td",
  "BLOCK_TEXT": "td",
  "BLOCK_BUTTON": "td",
  "BLOCK_SPACER": "td",
  "BLOCK_VIDEO": "td",
  "BLOCK_SOCIAL": "td",
  "BLOCK_BANNER": "td",
  "BLOCK_TIMER": "td",
  "BLOCK_MENU": "td",
  "BLOCK_MENU_ITEM": "td",
  "BLOCK_HTML": "td",
  "BLOCK_AMP_CAROUSEL": "td",
  "BLOCK_AMP_ACCORDION": "td",
  "BLOCK_AMP_FORM": "td",
  "CONTAINER": "td",
  "FORM_CONTAINER": "td",
  "STRUCTURE": "td",
  "STRIPE": "td",
  "CUSTOM_BLOCK_LINK": "a",
  "CUSTOM_BLOCK_IMAGE": "img",
  "CUSTOM_BLOCK_TEXT": "a",
  "TEXT_IMAGE": "a",
  "EMPTY_CONTAINER": "td",
  "AMP-ACCORDION-CONTAINER": "td",
  "AMP_FORM_NOTIFICATION": "td",
  "AMP_FORM_SUBMIT": "td",
  "AMP_FORM_START_AGAIN": "td",
  "AMP_FORM_INPUT": "td",
  "AMP_FORM_INPUT_HIDDEN": "td"
};
function normalizeModelTag(tag) {
  const uppercaseTag = tag?.toUpperCase() ?? "";
  return TAG_NORMALIZATION_RULES[uppercaseTag] ?? uppercaseTag.toLowerCase();
}
var SGResponseError_SGErrorCode;
(function(SGResponseError_SGErrorCode2) {
  SGResponseError_SGErrorCode2[SGResponseError_SGErrorCode2["BAD_REQUEST"] = 0] = "BAD_REQUEST";
  SGResponseError_SGErrorCode2[SGResponseError_SGErrorCode2["UNAUTHORIZED"] = 1] = "UNAUTHORIZED";
  SGResponseError_SGErrorCode2[SGResponseError_SGErrorCode2["UNIQUE_EMAILS_LIMIT_REACHED"] = 2] = "UNIQUE_EMAILS_LIMIT_REACHED";
  SGResponseError_SGErrorCode2[SGResponseError_SGErrorCode2["NOT_CONNECTED_TO_MODEL_YET"] = 3] = "NOT_CONNECTED_TO_MODEL_YET";
  SGResponseError_SGErrorCode2[SGResponseError_SGErrorCode2["TOO_MANY_REQUESTS"] = 4] = "TOO_MANY_REQUESTS";
  SGResponseError_SGErrorCode2[SGResponseError_SGErrorCode2["FATAL_RELOAD_MODEL"] = 5] = "FATAL_RELOAD_MODEL";
  SGResponseError_SGErrorCode2[SGResponseError_SGErrorCode2["MODEL_MAX_USERS_REACHED"] = 6] = "MODEL_MAX_USERS_REACHED";
  SGResponseError_SGErrorCode2[SGResponseError_SGErrorCode2["RATE_LIMIT_EXCEEDED"] = 7] = "RATE_LIMIT_EXCEEDED";
  SGResponseError_SGErrorCode2[SGResponseError_SGErrorCode2["INTERNAL_ERROR"] = 8] = "INTERNAL_ERROR";
  SGResponseError_SGErrorCode2[SGResponseError_SGErrorCode2["FORBIDDEN"] = 9] = "FORBIDDEN";
  SGResponseError_SGErrorCode2[SGResponseError_SGErrorCode2["INTERACTIVE_PREVIEW_DISCONNECTED"] = 10] = "INTERACTIVE_PREVIEW_DISCONNECTED";
  SGResponseError_SGErrorCode2[SGResponseError_SGErrorCode2["DESERIALIZATION_ERROR"] = 11] = "DESERIALIZATION_ERROR";
  SGResponseError_SGErrorCode2[SGResponseError_SGErrorCode2["PLUGIN_NOT_FOUND"] = 12] = "PLUGIN_NOT_FOUND";
  SGResponseError_SGErrorCode2[SGResponseError_SGErrorCode2["EMAIL_TEMPLATE_NOT_FOUND"] = 13] = "EMAIL_TEMPLATE_NOT_FOUND";
  SGResponseError_SGErrorCode2[SGResponseError_SGErrorCode2["DEMO_EMAIL_REMOVED"] = 14] = "DEMO_EMAIL_REMOVED";
  SGResponseError_SGErrorCode2[SGResponseError_SGErrorCode2["DISCONNECTED"] = 15] = "DISCONNECTED";
  SGResponseError_SGErrorCode2[SGResponseError_SGErrorCode2["PATCH_GROUPS_REQUEST_FAILED"] = 16] = "PATCH_GROUPS_REQUEST_FAILED";
  SGResponseError_SGErrorCode2[SGResponseError_SGErrorCode2["TEMPLATE_THEMES_LIMIT_REACHED"] = 17] = "TEMPLATE_THEMES_LIMIT_REACHED";
})(SGResponseError_SGErrorCode || (SGResponseError_SGErrorCode = {}));
var SGResponseError_SGErrorReason;
(function(SGResponseError_SGErrorReason2) {
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["PATCH_FORBIDDEN"] = 0] = "PATCH_FORBIDDEN";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["INTERNAL_SERVER_ERROR"] = 1] = "INTERNAL_SERVER_ERROR";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["NOT_ABLE_TO_GET_NEWER_PATCHES"] = 2] = "NOT_ABLE_TO_GET_NEWER_PATCHES";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["NOT_ABLE_TO_GET_CREATE_MODEL"] = 3] = "NOT_ABLE_TO_GET_CREATE_MODEL";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["FAILED_APPLY_PATCH"] = 4] = "FAILED_APPLY_PATCH";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["NOT_FOUND"] = 5] = "NOT_FOUND";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["ILLEGAL_STATE"] = 6] = "ILLEGAL_STATE";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["TEMPLATE_THEMES_DISABLED"] = 7] = "TEMPLATE_THEMES_DISABLED";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["VERSION_CONFLICT"] = 8] = "VERSION_CONFLICT";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["INVALID_JSON"] = 9] = "INVALID_JSON";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["INVALID_SCOPE"] = 10] = "INVALID_SCOPE";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["FORBIDDEN_OPERATION"] = 11] = "FORBIDDEN_OPERATION";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["INVALID_PATCH_GROUPS_FILTER"] = 12] = "INVALID_PATCH_GROUPS_FILTER";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["INVALID_PATCH_ANNOTATIONS"] = 13] = "INVALID_PATCH_ANNOTATIONS";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["LAST_SAVED_PATCH_NOT_FOUND"] = 14] = "LAST_SAVED_PATCH_NOT_FOUND";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["MOVE_PATCH_NAME_SOURCE_NOT_FOUND"] = 15] = "MOVE_PATCH_NAME_SOURCE_NOT_FOUND";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["MOVE_PATCH_NAME_TARGET_NOT_FOUND"] = 16] = "MOVE_PATCH_NAME_TARGET_NOT_FOUND";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["MOVE_PATCH_NAME_SOURCE_HAS_NO_NAME"] = 17] = "MOVE_PATCH_NAME_SOURCE_HAS_NO_NAME";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["MOVE_PATCH_NAME_SAME_PATCH"] = 18] = "MOVE_PATCH_NAME_SAME_PATCH";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["PATCH_NAME_CONFLICT"] = 19] = "PATCH_NAME_CONFLICT";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["VERSION_HISTORY_PATCH_NOT_FOUND"] = 20] = "VERSION_HISTORY_PATCH_NOT_FOUND";
  SGResponseError_SGErrorReason2[SGResponseError_SGErrorReason2["PATCH_TAGS_LIMIT_REACHED"] = 21] = "PATCH_TAGS_LIMIT_REACHED";
})(SGResponseError_SGErrorReason || (SGResponseError_SGErrorReason = {}));
function createBaseSGGetConnectToModelInfoPermissions() {
  return {
    $type: "models.SGGetConnectToModelInfoPermissions",
    codeEditor: void 0,
    appearance: void 0,
    content: void 0,
    modules: void 0,
    entityImages: void 0,
    projectImages: void 0,
    versionHistory: void 0,
    manageOwnComments: void 0,
    manageAllComments: void 0,
    replyAllComments: void 0,
    accessibilityTesting: void 0,
    elementsLock: void 0,
    urlValidation: void 0,
    templateThemes: void 0
  };
}
var SGGetConnectToModelInfoPermissions = {
  $type: "models.SGGetConnectToModelInfoPermissions",
  encode(message, writer = new BinaryWriter()) {
    if (message.codeEditor !== void 0) {
      SGConnectToModelInfoPermissions.encode(message.codeEditor, writer.uint32(10).fork()).join();
    }
    if (message.appearance !== void 0) {
      SGConnectToModelInfoPermissions.encode(message.appearance, writer.uint32(18).fork()).join();
    }
    if (message.content !== void 0) {
      SGConnectToModelInfoPermissionsExtended.encode(message.content, writer.uint32(26).fork()).join();
    }
    if (message.modules !== void 0) {
      SGConnectToModelInfoPermissions.encode(message.modules, writer.uint32(34).fork()).join();
    }
    if (message.entityImages !== void 0) {
      SGConnectToModelInfoPermissions.encode(message.entityImages, writer.uint32(42).fork()).join();
    }
    if (message.projectImages !== void 0) {
      SGConnectToModelInfoPermissions.encode(message.projectImages, writer.uint32(50).fork()).join();
    }
    if (message.versionHistory !== void 0) {
      SGConnectToModelInfoPermissions.encode(message.versionHistory, writer.uint32(58).fork()).join();
    }
    if (message.manageOwnComments !== void 0) {
      SGConnectToModelInfoPermissions.encode(message.manageOwnComments, writer.uint32(66).fork()).join();
    }
    if (message.manageAllComments !== void 0) {
      SGConnectToModelInfoPermissions.encode(message.manageAllComments, writer.uint32(74).fork()).join();
    }
    if (message.replyAllComments !== void 0) {
      SGConnectToModelInfoPermissions.encode(message.replyAllComments, writer.uint32(82).fork()).join();
    }
    if (message.accessibilityTesting !== void 0) {
      SGConnectToModelInfoPermissions.encode(message.accessibilityTesting, writer.uint32(90).fork()).join();
    }
    if (message.elementsLock !== void 0) {
      SGConnectToModelInfoPermissions.encode(message.elementsLock, writer.uint32(98).fork()).join();
    }
    if (message.urlValidation !== void 0) {
      SGConnectToModelInfoPermissions.encode(message.urlValidation, writer.uint32(106).fork()).join();
    }
    if (message.templateThemes !== void 0) {
      SGConnectToModelInfoPermissions.encode(message.templateThemes, writer.uint32(114).fork()).join();
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseSGGetConnectToModelInfoPermissions();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }
          message.codeEditor = SGConnectToModelInfoPermissions.decode(reader, reader.uint32());
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }
          message.appearance = SGConnectToModelInfoPermissions.decode(reader, reader.uint32());
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }
          message.content = SGConnectToModelInfoPermissionsExtended.decode(reader, reader.uint32());
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }
          message.modules = SGConnectToModelInfoPermissions.decode(reader, reader.uint32());
          continue;
        }
        case 5: {
          if (tag !== 42) {
            break;
          }
          message.entityImages = SGConnectToModelInfoPermissions.decode(reader, reader.uint32());
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }
          message.projectImages = SGConnectToModelInfoPermissions.decode(reader, reader.uint32());
          continue;
        }
        case 7: {
          if (tag !== 58) {
            break;
          }
          message.versionHistory = SGConnectToModelInfoPermissions.decode(reader, reader.uint32());
          continue;
        }
        case 8: {
          if (tag !== 66) {
            break;
          }
          message.manageOwnComments = SGConnectToModelInfoPermissions.decode(reader, reader.uint32());
          continue;
        }
        case 9: {
          if (tag !== 74) {
            break;
          }
          message.manageAllComments = SGConnectToModelInfoPermissions.decode(reader, reader.uint32());
          continue;
        }
        case 10: {
          if (tag !== 82) {
            break;
          }
          message.replyAllComments = SGConnectToModelInfoPermissions.decode(reader, reader.uint32());
          continue;
        }
        case 11: {
          if (tag !== 90) {
            break;
          }
          message.accessibilityTesting = SGConnectToModelInfoPermissions.decode(reader, reader.uint32());
          continue;
        }
        case 12: {
          if (tag !== 98) {
            break;
          }
          message.elementsLock = SGConnectToModelInfoPermissions.decode(reader, reader.uint32());
          continue;
        }
        case 13: {
          if (tag !== 106) {
            break;
          }
          message.urlValidation = SGConnectToModelInfoPermissions.decode(reader, reader.uint32());
          continue;
        }
        case 14: {
          if (tag !== 114) {
            break;
          }
          message.templateThemes = SGConnectToModelInfoPermissions.decode(reader, reader.uint32());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  toJSON(message) {
    const obj = {};
    if (message.codeEditor !== void 0) {
      obj.codeEditor = SGConnectToModelInfoPermissions.toJSON(message.codeEditor);
    }
    if (message.appearance !== void 0) {
      obj.appearance = SGConnectToModelInfoPermissions.toJSON(message.appearance);
    }
    if (message.content !== void 0) {
      obj.content = SGConnectToModelInfoPermissionsExtended.toJSON(message.content);
    }
    if (message.modules !== void 0) {
      obj.modules = SGConnectToModelInfoPermissions.toJSON(message.modules);
    }
    if (message.entityImages !== void 0) {
      obj.entityImages = SGConnectToModelInfoPermissions.toJSON(message.entityImages);
    }
    if (message.projectImages !== void 0) {
      obj.projectImages = SGConnectToModelInfoPermissions.toJSON(message.projectImages);
    }
    if (message.versionHistory !== void 0) {
      obj.versionHistory = SGConnectToModelInfoPermissions.toJSON(message.versionHistory);
    }
    if (message.manageOwnComments !== void 0) {
      obj.manageOwnComments = SGConnectToModelInfoPermissions.toJSON(message.manageOwnComments);
    }
    if (message.manageAllComments !== void 0) {
      obj.manageAllComments = SGConnectToModelInfoPermissions.toJSON(message.manageAllComments);
    }
    if (message.replyAllComments !== void 0) {
      obj.replyAllComments = SGConnectToModelInfoPermissions.toJSON(message.replyAllComments);
    }
    if (message.accessibilityTesting !== void 0) {
      obj.accessibilityTesting = SGConnectToModelInfoPermissions.toJSON(message.accessibilityTesting);
    }
    if (message.elementsLock !== void 0) {
      obj.elementsLock = SGConnectToModelInfoPermissions.toJSON(message.elementsLock);
    }
    if (message.urlValidation !== void 0) {
      obj.urlValidation = SGConnectToModelInfoPermissions.toJSON(message.urlValidation);
    }
    if (message.templateThemes !== void 0) {
      obj.templateThemes = SGConnectToModelInfoPermissions.toJSON(message.templateThemes);
    }
    return obj;
  },
  create(base) {
    return SGGetConnectToModelInfoPermissions.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseSGGetConnectToModelInfoPermissions();
    message.codeEditor = object.codeEditor !== void 0 && object.codeEditor !== null ? SGConnectToModelInfoPermissions.fromPartial(object.codeEditor) : void 0;
    message.appearance = object.appearance !== void 0 && object.appearance !== null ? SGConnectToModelInfoPermissions.fromPartial(object.appearance) : void 0;
    message.content = object.content !== void 0 && object.content !== null ? SGConnectToModelInfoPermissionsExtended.fromPartial(object.content) : void 0;
    message.modules = object.modules !== void 0 && object.modules !== null ? SGConnectToModelInfoPermissions.fromPartial(object.modules) : void 0;
    message.entityImages = object.entityImages !== void 0 && object.entityImages !== null ? SGConnectToModelInfoPermissions.fromPartial(object.entityImages) : void 0;
    message.projectImages = object.projectImages !== void 0 && object.projectImages !== null ? SGConnectToModelInfoPermissions.fromPartial(object.projectImages) : void 0;
    message.versionHistory = object.versionHistory !== void 0 && object.versionHistory !== null ? SGConnectToModelInfoPermissions.fromPartial(object.versionHistory) : void 0;
    message.manageOwnComments = object.manageOwnComments !== void 0 && object.manageOwnComments !== null ? SGConnectToModelInfoPermissions.fromPartial(object.manageOwnComments) : void 0;
    message.manageAllComments = object.manageAllComments !== void 0 && object.manageAllComments !== null ? SGConnectToModelInfoPermissions.fromPartial(object.manageAllComments) : void 0;
    message.replyAllComments = object.replyAllComments !== void 0 && object.replyAllComments !== null ? SGConnectToModelInfoPermissions.fromPartial(object.replyAllComments) : void 0;
    message.accessibilityTesting = object.accessibilityTesting !== void 0 && object.accessibilityTesting !== null ? SGConnectToModelInfoPermissions.fromPartial(object.accessibilityTesting) : void 0;
    message.elementsLock = object.elementsLock !== void 0 && object.elementsLock !== null ? SGConnectToModelInfoPermissions.fromPartial(object.elementsLock) : void 0;
    message.urlValidation = object.urlValidation !== void 0 && object.urlValidation !== null ? SGConnectToModelInfoPermissions.fromPartial(object.urlValidation) : void 0;
    message.templateThemes = object.templateThemes !== void 0 && object.templateThemes !== null ? SGConnectToModelInfoPermissions.fromPartial(object.templateThemes) : void 0;
    return message;
  }
};
function createBaseSGConnectToModelInfoPermissions() {
  return { $type: "models.SGConnectToModelInfoPermissions", read: false, write: false };
}
var SGConnectToModelInfoPermissions = {
  $type: "models.SGConnectToModelInfoPermissions",
  encode(message, writer = new BinaryWriter()) {
    if (message.read !== false) {
      writer.uint32(8).bool(message.read);
    }
    if (message.write !== false) {
      writer.uint32(16).bool(message.write);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseSGConnectToModelInfoPermissions();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }
          message.read = reader.bool();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }
          message.write = reader.bool();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  toJSON(message) {
    const obj = {};
    if (message.read !== false) {
      obj.read = message.read;
    }
    if (message.write !== false) {
      obj.write = message.write;
    }
    return obj;
  },
  create(base) {
    return SGConnectToModelInfoPermissions.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseSGConnectToModelInfoPermissions();
    message.read = object.read ?? false;
    message.write = object.write ?? false;
    return message;
  }
};
function createBaseSGConnectToModelInfoPermissionsExtended() {
  return { $type: "models.SGConnectToModelInfoPermissionsExtended", read: false, write: false, textOnly: false };
}
var SGConnectToModelInfoPermissionsExtended = {
  $type: "models.SGConnectToModelInfoPermissionsExtended",
  encode(message, writer = new BinaryWriter()) {
    if (message.read !== false) {
      writer.uint32(8).bool(message.read);
    }
    if (message.write !== false) {
      writer.uint32(16).bool(message.write);
    }
    if (message.textOnly !== false) {
      writer.uint32(24).bool(message.textOnly);
    }
    return writer;
  },
  decode(input, length) {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    const end = length === void 0 ? reader.len : reader.pos + length;
    const message = createBaseSGConnectToModelInfoPermissionsExtended();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }
          message.read = reader.bool();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }
          message.write = reader.bool();
          continue;
        }
        case 3: {
          if (tag !== 24) {
            break;
          }
          message.textOnly = reader.bool();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },
  toJSON(message) {
    const obj = {};
    if (message.read !== false) {
      obj.read = message.read;
    }
    if (message.write !== false) {
      obj.write = message.write;
    }
    if (message.textOnly !== false) {
      obj.textOnly = message.textOnly;
    }
    return obj;
  },
  create(base) {
    return SGConnectToModelInfoPermissionsExtended.fromPartial(base ?? {});
  },
  fromPartial(object) {
    const message = createBaseSGConnectToModelInfoPermissionsExtended();
    message.read = object.read ?? false;
    message.write = object.write ?? false;
    message.textOnly = object.textOnly ?? false;
    return message;
  }
};

export {
  SocialNetworkType,
  SmartBlockSourceType,
  MasterCssVar,
  MASTER_CSS_VARIABLES_DEFAULTS,
  LINK_COLOR_HOVER_VARS,
  normalizeModelTag,
  SGGetConnectToModelInfoPermissions,
  SGConnectToModelInfoPermissions
};

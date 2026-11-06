import {
  defaultBlocksMarkers,
  extensionBlockIDAttr,
  serviceSelectorPrefix
} from "./serviceSelectorPrefix-a2f28f143508.mjs";
import {
  q
} from "./builders-7d87c6093906.mjs";

// editor/ui-editor-ui/src/app/core/block-operations-api/common/node-selectors.ts
var STRIPE_CSS_CLASS = "esd-stripe";
var STRUCTURE_CSS_CLASS = "esd-structure";
var CONTAINER_CSS_CLASS = "esd-container-frame";
var TEXT_BLOCK_CSS_CLASS = "esd-block-text";
var CUSTOM_TEXT_BLOCK_CSS_CLASS = "esd-text";
var IMAGE_BLOCK_CSS_CLASS = "esd-block-image";
var BUTTON_BLOCK_CSS_CLASS = "esd-block-button";
var HTML_BLOCK_CSS_CLASS = "esd-block-html";
var SPACER_BLOCK_CSS_CLASS = "esd-block-spacer";
var SOCIAL_BLOCK_CSS_CLASS = "esd-block-social";
var MENU_BLOCK_CSS_CLASS = "esd-block-menu";
var VIDEO_BLOCK_CSS_CLASS = "esd-block-video";
var TIMER_BLOCK_CSS_CLASS = "esd-block-timer";
var AMP_FORM_SUBMIT_CSS_CLASS = "esd-block-amp-form-submit";
var CSS_CLASS_TO_BLOCK_TYPE = {
  [TEXT_BLOCK_CSS_CLASS]: "text",
  [IMAGE_BLOCK_CSS_CLASS]: "image",
  [SOCIAL_BLOCK_CSS_CLASS]: "social",
  [HTML_BLOCK_CSS_CLASS]: "html",
  [BUTTON_BLOCK_CSS_CLASS]: "button",
  [SPACER_BLOCK_CSS_CLASS]: "spacer",
  [MENU_BLOCK_CSS_CLASS]: "menu",
  [VIDEO_BLOCK_CSS_CLASS]: "video",
  [TIMER_BLOCK_CSS_CLASS]: "timer"
};
var CSS_CLASS_TO_STRUCTURE_TYPE = {
  [STRIPE_CSS_CLASS]: "stripe",
  [STRUCTURE_CSS_CLASS]: "structure",
  [CONTAINER_CSS_CLASS]: "container"
};

// editor/ui-editor-ui/src/app/core/block-operations-api/common/custom-block.ts
var customBlockMarkers = {
  ["CUSTOM_BLOCK_LINK" /* CUSTOM_BLOCK_LINK */]: "esd-container-frame",
  ["CUSTOM_BLOCK_IMAGE" /* CUSTOM_BLOCK_IMAGE */]: "esd-container-frame",
  ["CUSTOM_BLOCK_TEXT" /* CUSTOM_BLOCK_TEXT */]: CUSTOM_TEXT_BLOCK_CSS_CLASS,
  ["TEXT_IMAGE" /* TEXT_IMAGE */]: "esd-text-image"
};

// editor/ui-editor-ui/src/app/core/block-operations-api/common/markup/structural-node.ts
var markers = {
  ["EMPTY_CONTAINER" /* EMPTY_CONTAINER */]: {
    tag: "TD" /* TD */,
    clss: "".concat(serviceSelectorPrefix, "-empty-container")
  },
  ["AMP-ACCORDION-CONTAINER" /* AMP_ACCORDION_CONTAINER */]: {
    tag: "TD" /* TD */,
    clss: "".concat(serviceSelectorPrefix, "-amp-accordion-container")
  },
  ["BANNER" /* BANNER */]: {
    tag: "IMG" /* IMG */,
    clss: "".concat(serviceSelectorPrefix, "-banner-node"),
    skipDeconstruction: true
  },
  ["AMP_FORM_NOTIFICATION" /* AMP_FORM_NOTIFICATION */]: {
    tag: "TD" /* TD */,
    clss: "".concat(serviceSelectorPrefix, "-amp-form-notification")
  },
  ["TEMPLATE" /* AMP_FORM_TEMPLATE */]: {
    tag: "TEMPLATE" /* TEMPLATE */,
    clss: "",
    skipDeconstruction: true
  },
  ["AMP_FORM_SUBMIT" /* AMP_FORM_SUBMIT */]: {
    tag: "TD" /* TD */,
    clss: AMP_FORM_SUBMIT_CSS_CLASS,
    skipDeconstruction: false
  },
  ["AMP_FORM_START_AGAIN" /* AMP_FORM_START_AGAIN */]: {
    tag: "TD" /* TD */,
    clss: "".concat(serviceSelectorPrefix, "-block-amp-form-start-again"),
    skipDeconstruction: false
  },
  ["AMP_FORM_INPUT" /* AMP_FORM_INPUT */]: {
    tag: "TD" /* TD */,
    clss: "".concat(serviceSelectorPrefix, "-block-amp-form-input-text"),
    skipDeconstruction: false
  },
  ["AMP_FORM_INPUT_HIDDEN" /* AMP_FORM_INPUT_HIDDEN */]: {
    tag: "TD" /* TD */,
    clss: "".concat(serviceSelectorPrefix, "-block-amp-form-input-hidden"),
    skipDeconstruction: false
  }
};
var structuralNodeMarkers = Object.keys(markers).reduce((map, key) => ({ ...map, [key]: markers[key] }), {});
var structuralNodesMarkersMap = Object.keys(markers).reduce((map, key) => ({ ...map, [markers[key].clss]: key }), {});

// editor/ui-editor-ui/src/app/constants/blocks.constants.ts
var ESD_BLOCK_TEXT = "esd-block-text";
var ESD_ANCHOR = "esd-anchor";

// editor/ui-editor-ui/src/app/constants/className.constants.ts
var ESDEV_MSO_CLASS_TABLE = "esdev-mso-table";
var ESDEV_MSO_CLASS_TD = "esdev-mso-td";
var ES_HIDDEN_CLASS = "es-hidden";
var ESD_EMPTY_CONTAINER_CLASS = "esd-empty-container";
var AMP_ACCORDION_EMPTY_CONTAINER_CLASS = "esd-amp-accordion-container";
var ES_M_WIDTH_0_CLASS = "es-m-w0";
var AMP_FORM_START_AGAIN_CLASS = "esd-block-amp-form-start-again";

// editor/ui-editor-ui/src/app/constants/css.constants.ts
var CSS_MOBILE_MEDIA_SELECTOR = "@media only screen and (max-width: 600px)";
var CSS_IMPORTANT_COMMENT_BLOCK_SELECTOR = "IMPORTANT THIS STYLES MUST BE ON FINAL EMAIL";
var CSS_IMPORTANT_COMMENT_BLOCK_END_SELECTOR = "END OF IMPORTANT";

// editor/ui-editor-ui/src/app/constants/node-selectors.constants.ts
var CHILDREN_WITH_TABLE_TAG = [
  q.select.children().root().next(q.select.children().tag("TABLE" /* TABLE */)).end(),
  q.select.children().root().next(
    q.select.children().tag("A" /* A */).hasClass("es-module-link").next(q.select.children().tag("TABLE" /* TABLE */))
  ).end()
];
var CHILDREN_WITH_TR_TAG = [q.select.children().root().next(q.select.children().tag("TR" /* TR */)).end()];
var TABLE_SELECTOR = [q.select.descendants().tag("TABLE" /* TABLE */).end()];
var TBODY_SELECTOR = [q.select.descendants().tag("TBODY" /* TBODY */).end()];
var TD_SELECTOR = [q.select.descendants().tag("TD" /* TD */).end()];
var CHILD_TD_SELECTOR = [q.select.children().tag("TD" /* TD */).end()];
var TR_SELECTOR = [q.select.descendants().tag("TR" /* TR */).end()];
var LISTS_SELECTOR = [q.select.descendants().tag("UL" /* UL */).end(), q.select.descendants().tag("OL" /* OL */).end()];
var LIST_ITEM_SELECTOR = [q.select.descendants().tag("LI" /* LI */).end()];
var P_SELECTOR = [q.select.descendants().tag("P" /* P */).end()];
var HEAD_SELECTOR = [q.select.descendants().tag("HEAD" /* HEAD */).end()];
var A_SELECTOR = [q.select.descendants().tag("A" /* A */).end()];
var A_NOT_ANCHOR_SELECTOR = [q.select.descendants().tag("A" /* A */).notHasClass(ESD_ANCHOR).end()];
var ANCHOR_SELECTOR = [q.select.descendants().hasClass(ESD_ANCHOR).end()];
var IMG_SELECTOR = [q.select.descendants().tag("IMG" /* IMG */).end()];
var IMG_OR_BANNER_SELECTOR = [q.select.descendants().tag(["IMG" /* IMG */, "BANNER"]).end()];
var BANNER_NODE = [q.select.descendants().tag("banner").end()];
var HTML_SELECTOR = [q.select.descendants().tag("HTML" /* HTML */).end()];
var BODY_SELECTOR = [q.select.descendants().tag("BODY" /* BODY */).end()];
var EMPTY_CONTAINER_SELECTOR = [q.select.descendants().hasClass(ESD_EMPTY_CONTAINER_CLASS).end()];
var SPACER_BLOCK = [q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers["BLOCK_SPACER" /* BLOCK_SPACER */]).end()];
var VIDEO_BLOCK = [q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers["BLOCK_VIDEO" /* BLOCK_VIDEO */]).end()];
var VIDEO_BLOCK_IMAGE = [q.select.descendants().tag("TD" /* TD */).hasClass("esd-block-video").next(q.select.children().tag("A" /* A */).next(q.select.children().tag("IMG" /* IMG */))).end()];
var IMAGE_BLOCK_SELECTOR = [q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers["BLOCK_IMAGE" /* BLOCK_IMAGE */]).end()];
var BANNER_BLOCK = [q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers["BLOCK_BANNER" /* BLOCK_BANNER */]).end()];
var BUTTON_BLOCK_SELECTOR = [q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers["BLOCK_BUTTON" /* BLOCK_BUTTON */]).end()];
var HTML_BLOCK_SELECTOR = [q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers["BLOCK_HTML" /* BLOCK_HTML */]).end()];
var TEXT_BLOCK = [q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers["BLOCK_TEXT" /* BLOCK_TEXT */]).end()];
var CUSTOM_TEXT_BLOCK = [q.select.descendants().hasClass(customBlockMarkers["CUSTOM_BLOCK_TEXT" /* CUSTOM_BLOCK_TEXT */]).end()];
var SOCIAL_BLOCK_ICONS_SELECTOR = [
  q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers["BLOCK_SOCIAL" /* BLOCK_SOCIAL */]).next(
    q.select.descendants().tag("TD" /* TD */)
  ).end()
];
var CONTAINER_BLOCK_SELECTOR_TABLE = [
  q.select.descendants().hasClass(defaultBlocksMarkers["CONTAINER" /* CONTAINER */]).next(q.select.children().tag("TABLE" /* TABLE */)).end(),
  q.select.descendants().hasClass(defaultBlocksMarkers["CONTAINER" /* CONTAINER */]).next(q.select.children().tag("A" /* A */).hasClass("es-module-link").next(q.select.children().tag("TABLE" /* TABLE */))).end()
];
var SOCIAL_BLOCK = [
  q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers["BLOCK_SOCIAL" /* BLOCK_SOCIAL */]).end()
];
var PARENT_TABLE_CONTAINER_SELECTOR = [
  q.select.children().root().next(q.select.children().tag("TABLE" /* TABLE */)).end(),
  q.select.children().root().next(q.select.children().tag("A" /* A */).hasClass("es-module-link").next(q.select.children().tag("TABLE" /* TABLE */))).end()
];
var CONTAINER_BLOCK_SELECTOR = [q.select.descendants().hasClass(defaultBlocksMarkers["CONTAINER" /* CONTAINER */]).end()];
var STRUCTURE_BLOCK_SELECTOR = [q.select.descendants().hasClass(defaultBlocksMarkers["STRUCTURE" /* STRUCTURE */]).end()];
var STRIPE_BLOCK_SELECTOR = [q.select.descendants().hasClass(defaultBlocksMarkers["STRIPE" /* STRIPE */]).end()];
var MOBILE_GAP_NOT_RESPONSIVE = [q.select.descendants().hasClass(ES_M_WIDTH_0_CLASS).end()];
var ES_INFOBLOCK_SELECTOR = [q.select.descendants().hasClass("es-infoblock").end()];
var TEXT_IMAGE = [q.select.descendants().tag("TEXT_IMAGE" /* TEXT_IMAGE */).end()];
var TEXT_IMAGE_ATTRIBUTE = [q.select.descendants().hasAttr(customBlockMarkers["TEXT_IMAGE" /* TEXT_IMAGE */]).end()];
var TEXT_NODE_SELECTOR = [q.select.descendants().nodeType(3 /* TEXT_NODE */).end()];
var QUERY_HTML_NODE_TEXT_NODE_SELECTOR = [q.select.descendants().nodeType("text").end()];
var CHILDREN_MSO_COMMENTS = [q.select.children().root().next(q.select.children().contentContains("[if mso]>")).end()];
var ES_HIDDEN_NODE = [q.select.descendants().tag("TD" /* TD */).hasClass(ES_HIDDEN_CLASS).end()];
var CHILDREN_ESD_BLOCKS_SELECTOR = [q.select.children().root().next(q.select.children().classStartsWith("esd-block-")).end()];
var CHILDREN_TD_SELECTOR = [q.select.children().root().next(q.select.children().tag("TD" /* TD */)).end()];
var ampFormSubmitMarker = structuralNodeMarkers["AMP_FORM_SUBMIT" /* AMP_FORM_SUBMIT */];
if (!ampFormSubmitMarker) {
  throw new Error("structuralNodeMarkers is missing the required AMP_FORM_SUBMIT entry");
}
var AMP_FORM_SUBMIT_CLASS = ampFormSubmitMarker.clss;
var ESD_BLOCKS_SELECTOR = [q.select.descendants().classStartsWith("esd-block-").end()];
var ESD_AMP_BLOCKS_SELECTOR = [q.select.descendants().classStartsWith("esd-amp-").end()];
var ESD_AMP_FORM_BLOCKS_SELECTOR = [q.select.descendants().classStartsWith("esd-block-amp-form").end()];
var AMP_STEP_FORM = [q.select.descendants().tag("FORM" /* FORM */).end()];
var AMP_FORM_INPUT_AREA_SELECTOR = [q.select.descendants().hasClass("esd-amp-form-input-area").end()];
var AMP_FORM_INPUT_TD_SELECTOR = [q.select.descendants().hasClass("esd-block-amp-form-input-text").end()];
var AMP_FORM_INPUT_HIDDEN_TD_SELECTOR = [q.select.descendants().hasClass("esd-block-amp-form-input-hidden").end()];
var AMP_FORM_NOTIFICATION_SELECTOR = [q.select.descendants().hasClass("esd-amp-form-notification").end()];
var AMP_FORM_WITH_ID = [q.select.descendants().tag("FORM" /* FORM */).hasAttr("id").end()];
var AMP_INPUT_SELECTOR = [q.select.descendants().tag("INPUT").end(), q.select.descendants().tag("TEXTAREA").end()];
var AMP_LABEL_SELECTOR = [q.select.descendants().tag("LABEL").end()];
var SPAN = [q.select.descendants().tag("SPAN").end()];
var AMP_SUBMIT_SELECTOR = [q.select.descendants().hasClass(AMP_FORM_SUBMIT_CLASS).end()];
var AMP_FORM_VISIBLE_WHEN_INVALID = [q.select.descendants().hasAttr("visible-when-invalid").end()];
var AMP_START_AGAIN_SELECTOR = [q.select.descendants().hasClass(AMP_FORM_START_AGAIN_CLASS).end()];
var AMP_START_AGAIN_BUTTON_SELECTOR = [q.select.descendants().hasClass(AMP_FORM_START_AGAIN_CLASS).next(q.select.descendants().tag("BUTTON")).end()];
var AMP_SUCCESS_SELECTOR = [q.select.descendants().hasAttr("submit-success").end()];
var AMP_FORM_SUBMIT_IMG_SELECTOR = [
  q.select.descendants().hasClass(AMP_FORM_SUBMIT_CLASS).next(q.select.descendants().tag("IMG" /* IMG */)).end()
];
var AMP_FORM_START_AGAIN_IMG_SELECTOR = [q.select.descendants().hasClass(AMP_FORM_START_AGAIN_CLASS).next(q.select.descendants().tag("IMG" /* IMG */)).end()];
var ESD_BLOCKS_SELECTOR_WITHOUT_MENU_ITEMS = [
  q.select.descendants().classStartsWith("esd-block-").notHasClass("esd-block-menu-item").notHasClass(AMP_FORM_SUBMIT_CLASS).end()
];
var HIDDEN_ON_DESKTOP = [q.select.descendants().configEquals("deskHidden", true).end()];
var HIDDEN_ON_MOBILE = [q.select.descendants().configEquals("mobileHidden", true).end()];
var MIME_TYPE_SELECTOR = [q.select.descendants().configExists("mimeType").end()];
var DISPLAY_CONDITIONS_SELECTOR = [q.select.descendants().configExists("displayCondition").end()];
var ESD_BLOCKS_TEXT = [q.select.descendants().hasClass(ESD_BLOCK_TEXT).end()];
var ANY_SELECTOR = [q.select.descendants().any().end()];
var STRUCTURE_NOT_EXTENSION_CLASS_SELECTOR = [q.select.descendants().hasClass("esd-structure").notHasClass("esd-extension-internal-block").end()];
var CONTAINER_NOT_EXTENSION_CLASS_SELECTOR = [q.select.descendants().hasClass("esd-structure").notHasClass("esd-extension-internal-block").end()];
var CONTAINER_WITH_DROPZONE = q.select.descendants().hasClass("esd-container-frame").notHasClass("esd-extension-internal-block").next(q.select.descendants().tag("table").hasClass("esd-insideblock-dropzone"));
var BLOCK_DROPPABLE_COMPONENT_SELECTOR = [CONTAINER_WITH_DROPZONE.next(q.select.descendants().tag("table")).next(q.select.descendants().tag("tbody")).end()];
var BLOCK_INSIDE_BLOCK_DROPPABLE_ELEMENT = [CONTAINER_WITH_DROPZONE.next(q.select.descendants().tag("table").hasClass("esd-insideblock-dropzone").next(q.select.descendants().tag("tbody"))).end()];
var ESDEV_MSO_TD_SELECTOR = [q.select.descendants().hasClass(ESDEV_MSO_CLASS_TD).next(q.select.children().tag("TABLE" /* TABLE */)).end()];
var ESDEV_MSO_CLASS_TD_SELECTOR = [q.select.descendants().hasClass(ESDEV_MSO_CLASS_TD).end()];
var ESDEV_MSO_CLASS_TABLE_SELECTOR = [q.select.descendants().hasClass(ESDEV_MSO_CLASS_TABLE).end()];
var ESDEV_MSO_CLASS_TABLE_TR = [q.select.descendants().hasClass(ESDEV_MSO_CLASS_TABLE).next(q.select.descendants().tag("TR" /* TR */)).end()];
var TABLE_FIRST_TR_SELECTOR = [q.select.descendants().tag("TBODY" /* TBODY */).next(q.select.children().tag("TR" /* TR */)).end()];
var MENU_ITEM_IMAGE_SELECTOR = [q.select.descendants().tag("A" /* A */).next(q.select.children().tag("IMG" /* IMG */)).end()];
var MENU_ITEM_IMAGE_SELECTOR_WITH_INDENT = [
  q.select.descendants().tag("A" /* A */).next(q.select.children().tag("IMG" /* IMG */).classStartsWith("es-p")).end()
];
var MENU_ITEM_TEXT_SELECTOR = [q.select.descendants().nodeType("text").end()];
var MENU_ITEM_BR_SELECTOR = [q.select.descendants().tag("BR" /* BR */).end()];
var MENU_ITEMS_SELECTOR = [q.select.descendants().tag("TABLE" /* TABLE */).next(q.select.descendants().tag("TR" /* TR */).next(q.select.children().tag("TD" /* TD */))).end()];
var MENU_TABLE_SELECTOR = [q.select.descendants().tag("TABLE" /* TABLE */).hasClass("es-menu").end()];
var MENU_BLOCK_SELECTOR = [q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers["BLOCK_MENU" /* BLOCK_MENU */]).end()];
var MENU_ITEM_SELECTOR = [q.select.descendants().tag("TD" /* TD */).hasClass(defaultBlocksMarkers["BLOCK_MENU_ITEM" /* BLOCK_MENU_ITEM */]).end()];
var BLOCKS_SELECTOR = [
  q.select.descendants().classStartsWith("esd-block-").notHasClass("esd-block-menu-item").notHasClass(AMP_FORM_SUBMIT_CLASS).end()
];
var NON_ANCHOR_LINK_SELECTOR = [q.select.descendants().hasClass("esd-block-image").next(q.select.children().tag("a").notHasClass("esd-anchor")).end()];
var ROLLOVER_IMAGE_SELECTOR = [q.select.descendants().tag("img").hasClass("rollover-second").end()];
var AMP_ROLLOVER_SELECTOR = [q.select.descendants().hasClass("rollover-amp").end()];
var STRIPE_SELECTOR = [q.select.descendants().hasClass(defaultBlocksMarkers["STRIPE" /* STRIPE */]).end()];
var STRIPE_SELECTOR_WITH_HIDDEN_CONFIG = [
  q.select.descendants().hasClass(defaultBlocksMarkers["STRIPE" /* STRIPE */]).configExists("deskHidden").end(),
  q.select.descendants().hasClass(defaultBlocksMarkers["STRIPE" /* STRIPE */]).configExists("mobileHidden").end()
];
var STRUCTURE_SELECTOR = [q.select.descendants().hasClass(defaultBlocksMarkers["STRUCTURE" /* STRUCTURE */]).end()];
var DIV_SELECTOR = [q.select.descendants().tag("DIV" /* DIV */).end()];
var AMP_FORM_SELECTOR = [q.select.descendants().hasClass(defaultBlocksMarkers["BLOCK_AMP_FORM" /* BLOCK_AMP_FORM */]).end()];
var AMP_FORM_INNER_FORM_SELECTOR = [q.select.descendants().hasClass(defaultBlocksMarkers["BLOCK_AMP_FORM" /* BLOCK_AMP_FORM */]).next(q.select.children().tag("FORM" /* FORM */)).end()];
var FORM_CHILD_TR_WITH_ID = [q.select.descendants().tag("FORM" /* FORM */).next(q.select.descendants().hasAttr("id").tag("TR" /* TR */)).end()];
var AMP_ACCORDION_SELECTOR = [q.select.descendants().hasClass(defaultBlocksMarkers["BLOCK_AMP_ACCORDION" /* BLOCK_AMP_ACCORDION */]).end()];
var AMP_ACCORDION_BODY_SELECTOR = [q.select.descendants().hasClass("accordion").end()];
var AMP_ACCORDION_TITLE_SELECTOR = [q.select.descendants().hasClass("section-title").end()];
var AMP_CAROUSEL_SELECTOR = [q.select.descendants().hasClass(defaultBlocksMarkers["BLOCK_AMP_CAROUSEL" /* BLOCK_AMP_CAROUSEL */]).end()];
var AMP_CAROUSEL_INNER = [q.select.descendants().tag("AMP-CAROUSEL" /* AMP_CAROUSEL */).end()];
var AMP_CAROUSEL_AMP_IMG = [q.select.descendants().next(q.select.descendants().tag("AMP-CAROUSEL" /* AMP_CAROUSEL */).next(q.select.descendants().tag("AMP-IMG" /* AMP_IMG */))).end()];
var AMP_CAROUSEL_ELEMENT_SELECTOR = [q.select.descendants().tag("amp-carousel").end()];
var AMP_CAROUSEL_PREVIEW_SELECTOR = [q.select.descendants().hasClass("carousel-preview").end()];
var AMP_ACCORDION_EMPTY_CONTAINER_SELECTOR = [q.select.descendants().hasClass(AMP_ACCORDION_EMPTY_CONTAINER_CLASS).end()];
var ESD_EMAIL_PADDINGS_SELECTOR = [q.select.descendants().hasClass("esd-email-paddings").end()];
var AMP_BLOCK_SELECTORS = [...AMP_FORM_SELECTOR, ...AMP_ACCORDION_SELECTOR, ...AMP_CAROUSEL_SELECTOR];
var CONTAINER_TABLE_SELECTOR = [
  q.select.descendants().hasClass(defaultBlocksMarkers["CONTAINER" /* CONTAINER */]).next(q.select.children().tag("TABLE" /* TABLE */)).end(),
  q.select.descendants().hasClass(defaultBlocksMarkers["CONTAINER" /* CONTAINER */]).next(q.select.children().tag("A" /* A */).hasClass("es-module-link").next(q.select.children().tag("TABLE" /* TABLE */))).end()
];
var SECTION_SELECTOR = [q.select.descendants().tag("SECTION" /* SECTION */).end()];
var CONTENT_BODY_SELECTOR = [q.select.descendants().hasClass("es-content-body").end()];
var HEADER_BODY_SELECTOR = [q.select.descendants().hasClass("es-header-body").end()];
var FOOTER_BODY_SELECTOR = [q.select.descendants().hasClass("es-footer-body").end()];
var STRIPE_BODY_SELECTOR = [
  ...CONTENT_BODY_SELECTOR,
  ...HEADER_BODY_SELECTOR,
  ...FOOTER_BODY_SELECTOR
];
var TIMER_BLOCK_SELECTOR = [q.select.descendants().hasClass("esd-block-timer").end()];
var LINK_TAG_SELECTOR = [q.select.descendants().tag("LINK" /* LINK */).end()];
var ESD_BLOCK_CONFIG_TAG = "esd-config-block";
var ESD_CONFIG_BLOCK_VARIABLES_ATTRIBUTE_NAME = "variables";
var ESD_CONFIG_BLOCK_VARIABLES_SELECTOR = q.select.descendants().tag(ESD_BLOCK_CONFIG_TAG).hasAttr(ESD_CONFIG_BLOCK_VARIABLES_ATTRIBUTE_NAME).end();
var ESD_CALENDAR_EVENT_TAG = "esd-calendar-event";
var ESD_CALENDAR_EVENT_SELECTOR = [q.select.descendants().tag(ESD_CALENDAR_EVENT_TAG, false).end()];
var CALENDAR_EVENT_LINK_UUID_ATTRIBUTE = "esd-calendar-event-uuid";
var CALENDAR_EVENTS_BLOCK_SELECTOR = [q.select.descendants().configExists("calendarEvents").end()];
var CALENDAR_EVENT_BOUND_LINK_SELECTOR = [
  q.select.descendants().tag("A" /* A */).hasAttr(CALENDAR_EVENT_LINK_UUID_ATTRIBUTE).end()
];
var START_COMMENT_OF_IMPORTANT_SECTION_SELECTOR = [
  q.select.descendants().isComment().contentContains(CSS_IMPORTANT_COMMENT_BLOCK_SELECTOR).end()
];
var END_COMMENT_OF_IMPORTANT_SECTION_SELECTOR = [
  q.select.descendants().isComment().contentContains(CSS_IMPORTANT_COMMENT_BLOCK_END_SELECTOR).end()
];
var COMMENT_SELECTOR = [q.select.descendants().isComment().end()];
var ES_WRAPPER_SELECTOR = [q.select.descendants().hasClass("es-wrapper").end()];
var ES_WRAPPER_COLOR_SELECTOR = [q.select.descendants().hasClass("es-wrapper-color").end()];
var ES_WRAPPER__FIRST_LEVEL_TABLE_SELECTOR = [
  q.select.descendants().next(q.select.children().tag("TBODY" /* TBODY */).next(
    q.select.children().tag("TR" /* TR */).next(q.select.children().tag("TD" /* TD */).next(q.select.children().tag("TABLE" /* TABLE */)))
  )).end()
];
var ESD_BLOCK_BUTTON_SELECTOR = [q.select.descendants().hasClass("esd-block-button").end()];
var BUTTON_BORDER_SELECTOR = [q.select.descendants().hasClass("es-button-border").end()];
var ES_LINK_SELECTOR = [q.select.descendants().hasClass("es-button").end()];
var AMP_IMAGE_SELECTOR = [q.select.descendants().tag("AMP-IMG" /* AMP_IMG */).end()];
var AMP_CAROUSEL_PREVIEW = [q.select.descendants().tag("DIV" /* DIV */).hasClass("carousel-preview").end()];
var CAROUSEL_SELECTOR = [q.select.descendants().tag("AMP-CAROUSEL" /* AMP_CAROUSEL */).end()];
var CAROUSEL_PREVIEW_SELECTOR = [q.select.descendants().tag("AMP-SELECTOR" /* AMP_SELECTOR */).end()];
var FORM_SELECTOR = [q.select.descendants().tag("FORM" /* FORM */).end()];
var ESD_HIDDEN_PREHEADER_SELECTOR = [q.select.descendants().hasClass("esd-hidden-preheader").end()];
var MEDIA_SELECTOR = q.select.descendants().selectorEquals(CSS_MOBILE_MEDIA_SELECTOR).end();
var TITLE_SELECTOR = [q.select.descendants().tag("title").end()];
var IMAGE_TAG_SELECTOR = [q.select.descendants().tag("IMG" /* IMG */).notHasClass("rollover-second").end()];
var EXTENSION_BLOCK_SELECTOR = [q.select.descendants().hasAttr(extensionBlockIDAttr).end()];
var PARAGRAPHS_SELECTORS = [
  q.select.descendants().tag("P" /* P */).end(),
  q.select.descendants().tag("H1" /* H1 */).end(),
  q.select.descendants().tag("H2" /* H2 */).end(),
  q.select.descendants().tag("H3" /* H3 */).end(),
  q.select.descendants().tag("H4" /* H4 */).end(),
  q.select.descendants().tag("H5" /* H5 */).end(),
  q.select.descendants().tag("H6" /* H6 */).end()
];
var SELECTORS_FOR_AXE_CORE_MAP_ID = [q.select.descendants().nodeType("doctype").end(), q.select.descendants().nodeType("element").end()];
var LANG_SELECTOR = [q.select.descendants().hasAttr("lang").end()];
var AXE_ISSUE_IGNORED_SELECTOR = [q.select.descendants().configExists("accessibility").end()];
var ELEMENT_NODE_SELECTOR = [q.select.descendants().nodeType("element").end()];

export {
  IMG_SELECTOR,
  QUERY_HTML_NODE_TEXT_NODE_SELECTOR
};
/* istanbul ignore next: exhaustive switch guard -- @preserve */

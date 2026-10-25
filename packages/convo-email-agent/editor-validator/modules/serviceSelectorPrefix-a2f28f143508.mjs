// editor/ui-editor-common/entities/DefaultBlock.ts
var DefaultBlock = /* @__PURE__ */ ((DefaultBlock2) => {
  DefaultBlock2["BLOCK_IMAGE"] = "BLOCK_IMAGE";
  DefaultBlock2["BLOCK_TEXT"] = "BLOCK_TEXT";
  DefaultBlock2["BLOCK_BUTTON"] = "BLOCK_BUTTON";
  DefaultBlock2["BLOCK_SPACER"] = "BLOCK_SPACER";
  DefaultBlock2["BLOCK_VIDEO"] = "BLOCK_VIDEO";
  DefaultBlock2["BLOCK_SOCIAL"] = "BLOCK_SOCIAL";
  DefaultBlock2["BLOCK_BANNER"] = "BLOCK_BANNER";
  DefaultBlock2["BLOCK_TIMER"] = "BLOCK_TIMER";
  DefaultBlock2["BLOCK_MENU"] = "BLOCK_MENU";
  DefaultBlock2["BLOCK_MENU_ITEM"] = "BLOCK_MENU_ITEM";
  DefaultBlock2["BLOCK_HTML"] = "BLOCK_HTML";
  DefaultBlock2["BLOCK_AMP_CAROUSEL"] = "BLOCK_AMP_CAROUSEL";
  DefaultBlock2["BLOCK_AMP_ACCORDION"] = "BLOCK_AMP_ACCORDION";
  DefaultBlock2["BLOCK_AMP_FORM"] = "BLOCK_AMP_FORM";
  return DefaultBlock2;
})(DefaultBlock || {});
var defaultBlockValues = new Set(Object.values(DefaultBlock));

// editor/ui-editor-common/constants/serviceSelectorPrefix.ts
var serviceSelectorPrefix = "esd";

// editor/ui-editor-common/entities/DefaultBlockMarkers.ts
var markers = {
  ["BLOCK_IMAGE" /* BLOCK_IMAGE */]: "".concat(serviceSelectorPrefix, "-block-image"),
  ["BLOCK_TEXT" /* BLOCK_TEXT */]: "".concat(serviceSelectorPrefix, "-block-text"),
  ["BLOCK_BUTTON" /* BLOCK_BUTTON */]: "".concat(serviceSelectorPrefix, "-block-button"),
  ["BLOCK_SPACER" /* BLOCK_SPACER */]: "".concat(serviceSelectorPrefix, "-block-spacer"),
  ["BLOCK_VIDEO" /* BLOCK_VIDEO */]: "".concat(serviceSelectorPrefix, "-block-video"),
  ["BLOCK_SOCIAL" /* BLOCK_SOCIAL */]: "".concat(serviceSelectorPrefix, "-block-social"),
  ["BLOCK_BANNER" /* BLOCK_BANNER */]: "".concat(serviceSelectorPrefix, "-block-banner"),
  ["BLOCK_TIMER" /* BLOCK_TIMER */]: "".concat(serviceSelectorPrefix, "-block-timer"),
  ["BLOCK_MENU" /* BLOCK_MENU */]: "".concat(serviceSelectorPrefix, "-block-menu"),
  ["BLOCK_MENU_ITEM" /* BLOCK_MENU_ITEM */]: "".concat(serviceSelectorPrefix, "-block-menu-item"),
  ["BLOCK_HTML" /* BLOCK_HTML */]: "".concat(serviceSelectorPrefix, "-block-html"),
  ["BLOCK_AMP_CAROUSEL" /* BLOCK_AMP_CAROUSEL */]: "".concat(serviceSelectorPrefix, "-block-amp-carousel"),
  ["BLOCK_AMP_ACCORDION" /* BLOCK_AMP_ACCORDION */]: "".concat(serviceSelectorPrefix, "-amp-accordion"),
  ["BLOCK_AMP_FORM" /* BLOCK_AMP_FORM */]: "".concat(serviceSelectorPrefix, "-amp-form"),
  ["CONTAINER" /* CONTAINER */]: "".concat(serviceSelectorPrefix, "-container-frame"),
  ["FORM_CONTAINER" /* FORM_CONTAINER */]: "".concat(serviceSelectorPrefix, "-container-form"),
  ["STRUCTURE" /* STRUCTURE */]: "".concat(serviceSelectorPrefix, "-structure"),
  ["STRIPE" /* STRIPE */]: "".concat(serviceSelectorPrefix, "-stripe")
};
var defaultBlocksMarkers = { ...markers };
var pluginBlockMarker = "".concat(serviceSelectorPrefix, "-plugin-block");
var pluginBlockIDAttr = "".concat(serviceSelectorPrefix, "-plugin-block-id");
var extensionBlockMarker = "".concat(serviceSelectorPrefix, "-extension-block");
var extensionBlockIDAttr = "".concat(serviceSelectorPrefix, "-extension-block-id");
var structureMarker = "".concat(serviceSelectorPrefix, "-structure");
var containerMarker = "".concat(serviceSelectorPrefix, "-container-frame");
var stripeMarker = "".concat(serviceSelectorPrefix, "-stripe");

// editor/ui-editor-ui/src/app/core/block-operations-api/common/markup/amp-node.ts
var AmpNode = /* @__PURE__ */ ((AmpNode2) => {
  AmpNode2["AMP_ACCORDION"] = "AMP-ACCORDION";
  AmpNode2["AMP_CAROUSEL"] = "AMP-CAROUSEL";
  AmpNode2["AMP_SELECTOR"] = "AMP-SELECTOR";
  AmpNode2["AMP_IMG"] = "AMP-IMG";
  AmpNode2["AMP_ANIM"] = "AMP-ANIM";
  AmpNode2["AMP_LIST"] = "AMP-LIST";
  AmpNode2["AMP_FORM_TEMPLATE"] = "TEMPLATE";
  AmpNode2["AMP_ACCORDION_SECTION"] = "SECTION";
  return AmpNode2;
})(AmpNode || {});
var ampCheckMap = Object.values(AmpNode).reduce((acc, current) => ({ ...acc, [current]: true, [current.toLowerCase()]: true }), {});
var ampPreviewPrefix = "".concat(serviceSelectorPrefix, "-amp-preview");

export {
  DefaultBlock,
  serviceSelectorPrefix,
  defaultBlocksMarkers,
  extensionBlockIDAttr
};

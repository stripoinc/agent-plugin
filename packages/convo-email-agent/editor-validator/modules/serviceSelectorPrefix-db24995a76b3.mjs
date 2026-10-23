import {
  BlockType
} from "./index-95be4dc08d9c.mjs";

// editor/ui-editor-common/entities/DefaultBlock.ts
var DefaultBlock = ((DefaultBlock2) => {
  DefaultBlock2[DefaultBlock2["BLOCK_IMAGE"] = BlockType.BLOCK_IMAGE] = "BLOCK_IMAGE";
  DefaultBlock2[DefaultBlock2["BLOCK_TEXT"] = BlockType.BLOCK_TEXT] = "BLOCK_TEXT";
  DefaultBlock2[DefaultBlock2["BLOCK_BUTTON"] = BlockType.BLOCK_BUTTON] = "BLOCK_BUTTON";
  DefaultBlock2[DefaultBlock2["BLOCK_SPACER"] = BlockType.BLOCK_SPACER] = "BLOCK_SPACER";
  DefaultBlock2[DefaultBlock2["BLOCK_VIDEO"] = BlockType.BLOCK_VIDEO] = "BLOCK_VIDEO";
  DefaultBlock2[DefaultBlock2["BLOCK_SOCIAL"] = BlockType.BLOCK_SOCIAL] = "BLOCK_SOCIAL";
  DefaultBlock2[DefaultBlock2["BLOCK_BANNER"] = BlockType.BLOCK_BANNER] = "BLOCK_BANNER";
  DefaultBlock2[DefaultBlock2["BLOCK_TIMER"] = BlockType.BLOCK_TIMER] = "BLOCK_TIMER";
  DefaultBlock2[DefaultBlock2["BLOCK_MENU"] = BlockType.BLOCK_MENU] = "BLOCK_MENU";
  DefaultBlock2[DefaultBlock2["BLOCK_MENU_ITEM"] = BlockType.BLOCK_MENU_ITEM] = "BLOCK_MENU_ITEM";
  DefaultBlock2[DefaultBlock2["BLOCK_HTML"] = BlockType.BLOCK_HTML] = "BLOCK_HTML";
  DefaultBlock2[DefaultBlock2["BLOCK_AMP_CAROUSEL"] = BlockType.BLOCK_AMP_CAROUSEL] = "BLOCK_AMP_CAROUSEL";
  DefaultBlock2[DefaultBlock2["BLOCK_AMP_ACCORDION"] = BlockType.BLOCK_AMP_ACCORDION] = "BLOCK_AMP_ACCORDION";
  DefaultBlock2[DefaultBlock2["BLOCK_AMP_FORM"] = BlockType.BLOCK_AMP_FORM] = "BLOCK_AMP_FORM";
  return DefaultBlock2;
})(DefaultBlock || {});
var ComplexBlock = ((ComplexBlock2) => {
  ComplexBlock2[ComplexBlock2["CONTAINER"] = BlockType.CONTAINER] = "CONTAINER";
  ComplexBlock2[ComplexBlock2["FORM_CONTAINER"] = BlockType.FORM_CONTAINER] = "FORM_CONTAINER";
  ComplexBlock2[ComplexBlock2["STRUCTURE"] = BlockType.STRUCTURE] = "STRUCTURE";
  ComplexBlock2[ComplexBlock2["STRIPE"] = BlockType.STRIPE] = "STRIPE";
  return ComplexBlock2;
})(ComplexBlock || {});

// editor/ui-editor-common/constants/serviceSelectorPrefix.ts
var serviceSelectorPrefix = "esd";

// editor/ui-editor-common/entities/DefaultBlockMarkers.ts
var markers = {
  [DefaultBlock.BLOCK_IMAGE]: "".concat(serviceSelectorPrefix, "-block-image"),
  [DefaultBlock.BLOCK_TEXT]: "".concat(serviceSelectorPrefix, "-block-text"),
  [DefaultBlock.BLOCK_BUTTON]: "".concat(serviceSelectorPrefix, "-block-button"),
  [DefaultBlock.BLOCK_SPACER]: "".concat(serviceSelectorPrefix, "-block-spacer"),
  [DefaultBlock.BLOCK_VIDEO]: "".concat(serviceSelectorPrefix, "-block-video"),
  [DefaultBlock.BLOCK_SOCIAL]: "".concat(serviceSelectorPrefix, "-block-social"),
  [DefaultBlock.BLOCK_BANNER]: "".concat(serviceSelectorPrefix, "-block-banner"),
  [DefaultBlock.BLOCK_TIMER]: "".concat(serviceSelectorPrefix, "-block-timer"),
  [DefaultBlock.BLOCK_MENU]: "".concat(serviceSelectorPrefix, "-block-menu"),
  [DefaultBlock.BLOCK_MENU_ITEM]: "".concat(serviceSelectorPrefix, "-block-menu-item"),
  [DefaultBlock.BLOCK_HTML]: "".concat(serviceSelectorPrefix, "-block-html"),
  [DefaultBlock.BLOCK_AMP_CAROUSEL]: "".concat(serviceSelectorPrefix, "-block-amp-carousel"),
  [DefaultBlock.BLOCK_AMP_ACCORDION]: "".concat(serviceSelectorPrefix, "-amp-accordion"),
  [DefaultBlock.BLOCK_AMP_FORM]: "".concat(serviceSelectorPrefix, "-amp-form"),
  [ComplexBlock.CONTAINER]: "".concat(serviceSelectorPrefix, "-container-frame"),
  [ComplexBlock.FORM_CONTAINER]: "".concat(serviceSelectorPrefix, "-container-form"),
  [ComplexBlock.STRUCTURE]: "".concat(serviceSelectorPrefix, "-structure"),
  [ComplexBlock.STRIPE]: "".concat(serviceSelectorPrefix, "-stripe")
};
var defaultBlocksMarkers = Object.keys(markers).reduce((map, key) => ({
  ...map,
  [key]: markers[key]
}), {});
var pluginBlockMarker = "".concat(serviceSelectorPrefix, "-plugin-block");
var pluginBlockIDAttr = "".concat(serviceSelectorPrefix, "-plugin-block-id");
var extensionBlockMarker = "".concat(serviceSelectorPrefix, "-extension-block");
var extensionBlockIDAttr = "".concat(serviceSelectorPrefix, "-extension-block-id");
var structureMarker = "".concat(serviceSelectorPrefix, "-structure");
var containerMarker = "".concat(serviceSelectorPrefix, "-container-frame");
var stripeMarker = "".concat(serviceSelectorPrefix, "-stripe");

// editor/ui-editor-ui/src/app/components/document/document-node-component/amp/AmpNode.ts
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
  ComplexBlock,
  serviceSelectorPrefix,
  defaultBlocksMarkers,
  extensionBlockIDAttr
};

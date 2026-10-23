// editor/ui-editor-ui/node_modules/@stripoinc/ui-editor-extensions/dist/esm/index.js
var _BaseValidatedClass = class _BaseValidatedClass2 {
  /**
   * Validates that all required methods are properly implemented in the subclass.
   * @param requiredMethods - Array of method names that must be implemented
   * @param classRef - Reference to the class constructor for validation caching
   */
  constructor(requiredMethods, classRef) {
    if (classRef !== _BaseValidatedClass2) {
      if (!_BaseValidatedClass2.validatedClasses.has(classRef)) {
        this.validateImplementation(requiredMethods, classRef);
      }
      const errors = _BaseValidatedClass2.validationErrors.get(classRef);
      if (errors && errors.length > 0) {
        throw new Error(
          "".concat(classRef.name, " has validation errors:\n").concat(errors.map((e) => "  - ".concat(e)).join("\n"))
        );
      }
    }
  }
  /**
   * Validates that all required methods are properly implemented in the subclass.
   * This validation runs only once per class type and results are cached.
   */
  validateImplementation(requiredMethods, classRef) {
    const errors = [];
    const className = classRef.name;
    const proto = Object.getPrototypeOf(this);
    requiredMethods.forEach((methodName) => {
      const method = this[methodName];
      if (typeof method !== "function") {
        errors.push("Method ".concat(methodName, "() is not defined"));
        return;
      }
      if (proto[methodName] === classRef.prototype[methodName]) {
        errors.push("Method ".concat(methodName, "() must be implemented (currently using base class error-throwing implementation)"));
      }
    });
    _BaseValidatedClass2.validatedClasses.add(classRef);
    if (errors.length > 0) {
      _BaseValidatedClass2.validationErrors.set(classRef, errors);
      console.error("[".concat(className, " Validation] ").concat(className, " validation failed:"), errors);
    } else {
      if (typeof process !== "undefined" && true) {
        console.log("[".concat(className, " Validation] \u2705 ").concat(className, " validated successfully"));
      }
    }
  }
  /**
   * Lifecycle method for cleaning up resources (e.g., removing DOM artifacts from document.body).
   * Override this method in subclasses to implement custom cleanup logic.
   * Called when the editor is reinitialized or the extension is uninstalled.
   */
  destroy() {
  }
};
_BaseValidatedClass.validatedClasses = /* @__PURE__ */ new Set();
_BaseValidatedClass.validationErrors = /* @__PURE__ */ new Map();
var BaseValidatedClass = _BaseValidatedClass;
var BlockCompositionType = /* @__PURE__ */ ((BlockCompositionType2) => {
  BlockCompositionType2["BLOCK"] = "BLOCK";
  BlockCompositionType2["CONTAINER"] = "CONTAINER";
  BlockCompositionType2["STRUCTURE"] = "STRUCTURE";
  BlockCompositionType2["STRIPE"] = "STRIPE";
  return BlockCompositionType2;
})(BlockCompositionType || {});
var _Block = class _Block2 extends BaseValidatedClass {
  constructor() {
    super(_Block2.REQUIRED_METHODS, _Block2);
  }
  /**
   * Determines if the block should be available for use in the editor.
   * Override to provide custom logic based on editor state or configuration.
   * @returns True if the block is enabled, false otherwise. Defaults to true.
   */
  isEnabled() {
    return true;
  }
  /**
   * Determines if the block can be saved as a reusable module by the user.
   * @returns True if the block can be saved as a module, false otherwise. Defaults to false.
   */
  canBeSavedAsModule() {
    return false;
  }
  /**
   * Specifies the context actions available for this block.
   * If not overridden, the editor might use a default set of actions.
   * Use IDs from {@link ContextActionType} or custom action IDs.
   * @returns An array of context action IDs, or undefined to use defaults (if any).
   */
  getContextActionsIds() {
    return void 0;
  }
  /**
   * Provides a custom renderer class for this block, allowing for specialized rendering logic.
   * @returns A constructor for a class extending {@link BlockRenderer}, or undefined to use the default renderer.
   */
  getCustomRenderer() {
    return void 0;
  }
  /**
   * Gets a unique CSS class name specifically for this block type.
   * Used for targeting styles.
   * @returns A unique CSS class name. Defaults to `esd-{blockId}`.
   */
  getUniqueBlockClassname() {
    return "esd-".concat(this.getId());
  }
  /**
   * Lifecycle hook called when the editor document is initialized.
   * Useful for performing initial setup or modifications on existing block instances in the template.
   */
  onDocumentInit() {
  }
  /**
   * Lifecycle hook called when an instance of this block is selected in the editor.
   * @param node - The immutable HTML node representing the selected block instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSelect(node) {
  }
  /**
   * Lifecycle hook called when an instance of this block is copied.
   * @param modifier - The HTML node modifier to apply changes to the copied block instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCopy(modifier) {
  }
  /**
   * Lifecycle hook called when an instance of this block is deleted.
   * @param node - The immutable HTML node representing the block instance being deleted.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDelete(node) {
  }
  /**
   * Lifecycle hook called after a new instance of this block is created and added to the document (e.g., via drag-and-drop).
   * @param node - The immutable HTML node representing the newly created block instance.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onCreated(node) {
  }
  /**
   * Lifecycle hook called when any part of the document template has changed.
   * This can be frequent; use cautiously for performance-sensitive operations.
   * @param node - The immutable HTML node representing current node instance
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDocumentChanged(node) {
  }
  /**
   * @description Determines if block is atomic or composite.
   * {@link BlockCompositionType.BLOCK} - atomic block which can be inserted inside other container and cannot hold other objects
   * {@link BlockCompositionType.STRUCTURE} - composite block which can serve as a container for another atomic block
   * @returns The type of the block. Defaults to {@link BlockCompositionType.BLOCK}.
   */
  getBlockCompositionType() {
    return "BLOCK";
  }
  /**
   * @description Determines if block should be included in empty container quick insert actions list.
   * @returns True to show a quick-add icon for this block in empty containers, false otherwise. Defaults to false.
   */
  shouldDisplayQuickAddIcon() {
    return false;
  }
  /**
   * Determines if the block should be shown in the blocks panel.
   * Override to hide the block from the blocks panel while keeping it available elsewhere.
   * @returns True if the block should appear in the blocks panel. Defaults to true.
   */
  shouldDisplayInBlocksPanel() {
    return true;
  }
  /**
   * @description Determines if nested blocks selection allowed in extension of type {@link BlockCompositionType.STRUCTURE}
   */
  allowInnerBlocksSelection() {
    return true;
  }
  /**
   * @description Determines if nested blocks drag and drop allowed in extension of type {@link BlockCompositionType.STRUCTURE}
   */
  allowInnerBlocksDND() {
    return true;
  }
  /**
   * Determines whether standard image blocks nested anywhere inside this extension block
   * expose the on-canvas resize control.
   * @returns True to allow nested image resize. Defaults to true.
   */
  isNestedImageResizeEnabled() {
    return true;
  }
  allowInteractWithAMPWhenSelected() {
    return true;
  }
  /**
   * Gets the unique identifier for this block type.
   * This ID is used for registration and referencing the block.
   * @returns A unique string ID.
   */
  getId() {
    throw new Error("Method getId() must be implemented by the subclass");
  }
  /**
   * Gets the HTML template string that defines the initial structure of this block.
   * This template will be used when the block is dragged into the editor.
   * @returns An HTML string.
   */
  getTemplate() {
    throw new Error("Method getTemplate() must be implemented by the subclass");
  }
  /**
   * Gets a CSS template string that contains the custom styles that apply to the block.
   * This CSS will be used when a block is dragged into the editor and removed when the last block is deleted.
   * @returns An CSS string.
   */
  getTemplateStyles() {
    return "";
  }
  /**
   * Gets the URL or path to the icon representing this block in the editor's block panel.
   * @returns A string representing the icon source (e.g., URL, data URI).
   */
  getIcon() {
    throw new Error("Method getIcon() must be implemented by the subclass");
  }
  /**
   * Gets the display name of the block shown to the user in the block panel.
   * Use `this.api.translate()` for localization.
   * @returns The localized block name string.
   */
  getName() {
    throw new Error("Method getName() must be implemented by the subclass");
  }
  /**
   * Retrieves the name of block in the block panel.
   * Can contain html markup
   * If not implemented by the subclass, getName() function will be used to display name in the block panel
   *
   * @return {string} The name of the block panel.
   */
  getSettingsPanelTitleHtml() {
    return "";
  }
  /**
   * Gets a short description of the block shown to the user, often as a tooltip in the block panel.
   * Use `this.api.translate()` for localization.
   * @returns The localized description string.
   */
  getDescription() {
    throw new Error("Method getDescription() must be implemented by the subclass");
  }
};
_Block.REQUIRED_METHODS = ["getId", "getTemplate", "getIcon", "getName", "getDescription"];
var Block = _Block;
var _BlockRenderer = class _BlockRenderer2 extends BaseValidatedClass {
  constructor() {
    super(_BlockRenderer2.REQUIRED_METHODS, _BlockRenderer2);
  }
  /**
   * @deprecated - use {@link getPreviewInnerHtml} instead
   */
  getPreviewHtml(_node) {
    return void 0;
  }
  /**
   * @description returns custom content to be displayed inside the {@link Block} root TD element
   */
  getPreviewInnerHtml(_node) {
    throw new Error("Method getPreviewInnerHtml() must be implemented by the subclass");
  }
};
_BlockRenderer.REQUIRED_METHODS = ["getPreviewInnerHtml"];
var BlockRenderer = _BlockRenderer;
var BlocksPanel = class {
  /**
   * Generates HTML representation for a block item
   * @param block - The block item to generate HTML for
   * @returns HTML string representation of the block or undefined if default representation should be used
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getBlockItemHtml(block) {
    return void 0;
  }
  /**
   * Determines whether a hint should be displayed for the block
   * @param block - The block item to check hint visibility for
   * @returns True if the hint should be visible, false otherwise
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isBlockHintVisible(block) {
    return true;
  }
  /**
   * Determines whether a draggable handle should be displayed in modules panel
   * @returns True if the block panel should be reorderable
   */
  isPanelPlacementChangeEnabled() {
    return true;
  }
  /**
   * Gets the hint text for a block
   * @param block - The block item to get hint for
   * @returns The hint text for the block or undefined if default hint should be used
   */
  getBlockHint(block) {
    return {
      title: block.title,
      description: block.description
    };
  }
  /**
   * Generates HTML representation for the blocks panel header
   * @returns HTML string representation of the blocks panel header or undefined if header should not be shown
   */
  getBlocksPanelHeaderHtml() {
    return void 0;
  }
  /**
   * Generates HTML representation for the modules panel in collapsed state
   * @returns HTML string representation of the collapsed modules panel or undefined if default representation should be used
   */
  getModulesPanelCollapsedHtml() {
    return void 0;
  }
  /**
   * Determines whether a hint should be displayed for the collapsed modules panel
   * @returns True if the hint should be visible, false otherwise
   */
  isModulesPanelCollapsedHintVisible() {
    return true;
  }
  /**
   * Gets the custom delay for showing hints
   * @returns The delay in milliseconds or undefined to use the default delay
   */
  getHintDelay() {
    return void 0;
  }
  /**
   * Gets the hint text for a modules panel block
   * @returns The hint text for the modules panel or undefined if default hint should be used
   */
  getModulesPanelHint() {
    return void 0;
  }
  /**
   * Gets the icon name for the modules tab
   * @returns The icon name for the modules tab or undefined if default icon or text should be used
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getModulesTabIconName(modulesTab) {
    return void 0;
  }
};
var _ContextAction = class _ContextAction2 extends BaseValidatedClass {
  constructor() {
    super(_ContextAction2.REQUIRED_METHODS, _ContextAction2);
  }
  getId() {
    throw new Error("Method getId() must be implemented by the subclass");
  }
  getIcon() {
    throw new Error("Method getIcon() must be implemented by the subclass");
  }
  getLabel() {
    throw new Error("Method getLabel() must be implemented by the subclass");
  }
  onClick(_node) {
    throw new Error("Method onClick() must be implemented by the subclass");
  }
};
_ContextAction.REQUIRED_METHODS = ["getId", "getIcon", "getLabel", "onClick"];
var ContextAction = _ContextAction;
var ADD_CUSTOM_FONT_OPTION = "ADD_CUSTOM_FONT_OPTION";
var AiAssistantValueType = /* @__PURE__ */ ((AiAssistantValueType2) => {
  AiAssistantValueType2["SUBJECT"] = "subject";
  AiAssistantValueType2["HIDDEN_PREHEADER"] = "hiddenPreheader";
  AiAssistantValueType2["TEXT_BLOCK"] = "textBlock";
  return AiAssistantValueType2;
})(AiAssistantValueType || {});
var containerAttributes = {
  widthPercent: "width-percent"
};
var emptyContainerAttributes = {
  ...containerAttributes,
  blocks: "blocks"
};
var imageAttributes = {
  src: "src",
  alt: "alt",
  href: "href",
  width: "width",
  height: "height"
};
var buttonAttributes = {
  href: "href"
};
var BlockAttr = {
  EMPTY_CONTAINER: emptyContainerAttributes,
  CONTAINER: containerAttributes,
  BLOCK_IMAGE: imageAttributes,
  BLOCK_BUTTON: buttonAttributes
};
var ESD_BLOCK_BUTTON = "esd-block-button";
var ESD_BLOCK_TEXT = "esd-block-text";
var ESD_BLOCK_IMAGE = "esd-block-image";
var ESD_BLOCK_STRUCTURE = "esd-structure";
var ESD_BLOCK_VIDEO = "esd-block-video";
var ESD_BLOCK_SOCIAL = "esd-block-social";
var ESD_BLOCK_BANNER = "esd-block-banner";
var ESD_BLOCK_TIMER = "esd-block-timer";
var ESD_BLOCK_MENU = "esd-block-menu";
var ESD_BLOCK_HTML = "esd-block-html";
var ESD_BLOCK_SPACER = "esd-block-spacer";
var ESD_BLOCK_CONTAINER = "esd-container-frame";
var ESD_BLOCK_STRIPE = "esd-stripe";
var ESD_BLOCK_FORM = "esd-amp-form";
var BlockName = /* @__PURE__ */ ((BlockName2) => {
  BlockName2[BlockName2["BUTTON"] = ESD_BLOCK_BUTTON] = "BUTTON";
  BlockName2[BlockName2["TEXT"] = ESD_BLOCK_TEXT] = "TEXT";
  BlockName2[BlockName2["IMAGE"] = ESD_BLOCK_IMAGE] = "IMAGE";
  BlockName2[BlockName2["STRUCTURE"] = ESD_BLOCK_STRUCTURE] = "STRUCTURE";
  BlockName2[BlockName2["VIDEO"] = ESD_BLOCK_VIDEO] = "VIDEO";
  BlockName2[BlockName2["SOCIAL"] = ESD_BLOCK_SOCIAL] = "SOCIAL";
  BlockName2[BlockName2["BANNER"] = ESD_BLOCK_BANNER] = "BANNER";
  BlockName2[BlockName2["TIMER"] = ESD_BLOCK_TIMER] = "TIMER";
  BlockName2[BlockName2["MENU"] = ESD_BLOCK_MENU] = "MENU";
  BlockName2[BlockName2["HTML"] = ESD_BLOCK_HTML] = "HTML";
  BlockName2[BlockName2["SPACER"] = ESD_BLOCK_SPACER] = "SPACER";
  BlockName2[BlockName2["CONTAINER"] = ESD_BLOCK_CONTAINER] = "CONTAINER";
  return BlockName2;
})(BlockName || {});
var BlockSelector = ((BlockSelector2) => {
  BlockSelector2["BUTTON"] = ".".concat(ESD_BLOCK_BUTTON);
  BlockSelector2["TEXT"] = ".".concat(ESD_BLOCK_TEXT);
  BlockSelector2["IMAGE"] = ".".concat(ESD_BLOCK_IMAGE);
  BlockSelector2["STRUCTURE"] = ".".concat(ESD_BLOCK_STRUCTURE);
  BlockSelector2["VIDEO"] = ".".concat(ESD_BLOCK_VIDEO);
  BlockSelector2["SOCIAL"] = ".".concat(ESD_BLOCK_SOCIAL);
  BlockSelector2["BANNER"] = ".".concat(ESD_BLOCK_BANNER);
  BlockSelector2["TIMER"] = ".".concat(ESD_BLOCK_TIMER);
  BlockSelector2["MENU"] = ".".concat(ESD_BLOCK_MENU);
  BlockSelector2["HTML"] = ".".concat(ESD_BLOCK_HTML);
  BlockSelector2["SPACER"] = ".".concat(ESD_BLOCK_SPACER);
  BlockSelector2["CONTAINER"] = ".".concat(ESD_BLOCK_CONTAINER);
  BlockSelector2["STRIPE"] = ".".concat(ESD_BLOCK_STRIPE);
  BlockSelector2["FORM"] = ".".concat(ESD_BLOCK_FORM);
  return BlockSelector2;
})(BlockSelector || {});
var BlockType = /* @__PURE__ */ ((BlockType2) => {
  BlockType2["BLOCK_IMAGE"] = "BLOCK_IMAGE";
  BlockType2["BLOCK_TEXT"] = "BLOCK_TEXT";
  BlockType2["BLOCK_BUTTON"] = "BLOCK_BUTTON";
  BlockType2["BLOCK_SPACER"] = "BLOCK_SPACER";
  BlockType2["BLOCK_VIDEO"] = "BLOCK_VIDEO";
  BlockType2["BLOCK_SOCIAL"] = "BLOCK_SOCIAL";
  BlockType2["BLOCK_BANNER"] = "BLOCK_BANNER";
  BlockType2["BLOCK_TIMER"] = "BLOCK_TIMER";
  BlockType2["BLOCK_MENU"] = "BLOCK_MENU";
  BlockType2["BLOCK_MENU_ITEM"] = "BLOCK_MENU_ITEM";
  BlockType2["BLOCK_HTML"] = "BLOCK_HTML";
  BlockType2["BLOCK_AMP_CAROUSEL"] = "BLOCK_AMP_CAROUSEL";
  BlockType2["BLOCK_AMP_ACCORDION"] = "BLOCK_AMP_ACCORDION";
  BlockType2["BLOCK_AMP_FORM"] = "BLOCK_AMP_FORM";
  BlockType2["CONTAINER"] = "CONTAINER";
  BlockType2["FORM_CONTAINER"] = "FORM_CONTAINER";
  BlockType2["STRUCTURE"] = "STRUCTURE";
  BlockType2["STRIPE"] = "STRIPE";
  BlockType2["EMPTY_CONTAINER"] = "EMPTY_CONTAINER";
  BlockType2["CUSTOM_BLOCK_LINK"] = "CUSTOM_BLOCK_LINK";
  BlockType2["CUSTOM_BLOCK_IMAGE"] = "CUSTOM_BLOCK_IMAGE";
  BlockType2["CUSTOM_BLOCK_TEXT"] = "CUSTOM_BLOCK_TEXT";
  return BlockType2;
})(BlockType || {});
var GeneralControls = /* @__PURE__ */ ((GeneralControls2) => {
  GeneralControls2["ANCHOR_LINK_CONTAINER"] = "anchorLinkFormContainer";
  GeneralControls2["APPLY_CONDITION"] = "applyCondition";
  GeneralControls2["APPLY_CONDITION_SWITCHER"] = "applyConditionSwitcher";
  GeneralControls2["BACKGROUND_COLOR"] = "backgroundColor";
  GeneralControls2["BACKGROUND_IMAGE"] = "generalImageContainer";
  GeneralControls2["TEXT_COLOR"] = "textColor";
  GeneralControls2["TEXT_STYLE"] = "textStyle";
  GeneralControls2["TEXT_SIZE"] = "textSize";
  GeneralControls2["TEXT_LINE_SPACING"] = "textLineSpacing";
  GeneralControls2["TEXT_ALIGN"] = "textAlign";
  GeneralControls2["FIXED_HEIGHT_SWITCHER"] = "fixedHeightSwitcherForm";
  GeneralControls2["HIDDEN_NODE"] = "hiddenNode";
  GeneralControls2["SMART_BLOCK"] = "smartBlock";
  GeneralControls2["SYNCHRONIZED_MODULE"] = "synchronizedModuleForm";
  GeneralControls2["FONT_FAMILY"] = "generalFontFamilyForm";
  GeneralControls2["BLOCK_INTERNAL_INDENTS"] = "generalBlockInternalIndents";
  GeneralControls2["STRUCTURE_INTERNAL_INDENTS"] = "generalStructureInternalIndents";
  return GeneralControls2;
})(GeneralControls || {});
var BannerControls = /* @__PURE__ */ ((BannerControls2) => {
  BannerControls2["ALIGNMENT"] = "bannerAlignment";
  BannerControls2["ALT_TEXT"] = "bannerAltText";
  BannerControls2["ANCHOR_LINK_CONTAINER"] = "bannerAnchorLinkContainerForm";
  BannerControls2["ASPECT_RATIO"] = "bannerAspectRatioForm";
  BannerControls2["BACKGROUND_COLOR"] = "bannerBackgroundColor";
  BannerControls2["BACKGROUND_IMAGE_CONTAINER"] = "bannerBackgroundImageContainer";
  BannerControls2["SIZE"] = "bannerBlockBannerSize";
  BannerControls2["BLOCK_LINK"] = "bannerBlockLink";
  BannerControls2["CHILD_ROTATION"] = "bannerChildRotationForm";
  BannerControls2["CROP"] = "bannerCropForm";
  BannerControls2["FILTER"] = "bannerFilter";
  BannerControls2["EXTERNAL_INDENTS"] = "bannerExternalIndents";
  BannerControls2["MIME_TYPE"] = "bannerMimeTypeForm";
  BannerControls2["RESPONSIVE_IMAGE"] = "bannerResponsiveImageForm";
  return BannerControls2;
})(BannerControls || {});
var BannerChildControls = /* @__PURE__ */ ((BannerChildControls2) => {
  BannerChildControls2["ADDITIONAL_IMAGE"] = "bannerAdditionalImageForm";
  BannerChildControls2["ADDITIONAL_IMAGE_ASPECT_RATIO"] = "bannerAdditionalImageAspectRatioForm";
  BannerChildControls2["CHILD_COLOR"] = "bannerChildColorForm";
  BannerChildControls2["CHILD_FLIP"] = "bannerChildFlipForm";
  BannerChildControls2["CHILD_OPACITY"] = "bannerChildOpacityForm";
  BannerChildControls2["TEXT_ALIGNMENT"] = "bannerTextAlignmentForm";
  BannerChildControls2["TEXT_DIRECTION"] = "bannerTextDirectionForm";
  BannerChildControls2["TEXT_FONT"] = "bannerTextFontContainer";
  BannerChildControls2["TEXT_LETTER_CASE"] = "bannerTextLetterCaseForm";
  BannerChildControls2["TEXT_LINE_HEIGHT"] = "bannerTextLineHeightForm";
  BannerChildControls2["TEXT_STYLE"] = "bannerTextStyleForm";
  return BannerChildControls2;
})(BannerChildControls || {});
var ButtonControls = /* @__PURE__ */ ((ButtonControls2) => {
  ButtonControls2["ADJUST_TO_WIDTH"] = "adjustToWidth";
  ButtonControls2["ALIGNMENT"] = "buttonAlignment";
  ButtonControls2["BORDER"] = "buttonBorder";
  ButtonControls2["BORDER_RADIUS"] = "buttonBorderRadius";
  ButtonControls2["COLOR"] = "buttonColor";
  ButtonControls2["BUTTON_BLOCK_BACKGROUND_COLOR"] = "buttonBlockBackgroundColor";
  ButtonControls2["EXTERNAL_INDENTS"] = "buttonExternalIndents";
  ButtonControls2["FIXED_HEIGHT"] = "buttonFixedHeightForm";
  ButtonControls2["FONT_COLOR"] = "buttonFontColor";
  ButtonControls2["FONT_FAMILY"] = "buttonFontFamily";
  ButtonControls2["FONT_SIZE"] = "buttonFontSize";
  ButtonControls2["FONT_WEIGHT"] = "buttonFontWeight";
  ButtonControls2["ICON"] = "buttonIconContainer";
  ButtonControls2["ICON_ALIGN"] = "buttonIconAlign";
  ButtonControls2["ICON_INDENT"] = "buttonIconIndent";
  ButtonControls2["ICON_WIDTH"] = "buttonIconWidth";
  ButtonControls2["IMAGE"] = "buttonImageForm";
  ButtonControls2["INTERNAL_INDENTS"] = "buttonInternalIndents";
  ButtonControls2["LINK"] = "buttonLink";
  ButtonControls2["MIME_TYPE"] = "buttonMimeTypeForm";
  ButtonControls2["SWITCHER_HOVERED_STYLES"] = "buttonSwitcherHoveredStylesForm";
  ButtonControls2["TEXT"] = "buttonText";
  ButtonControls2["TEXT_STYLE_AND_COLOR"] = "buttonTextStyleAndColorForm";
  ButtonControls2["HOVERED_BORDER_COLOR"] = "hoveredStyleBorderButtonForm";
  ButtonControls2["HOVERED_COLOR"] = "hoveredButtonColorForm";
  ButtonControls2["HOVERED_TEXT_COLOR"] = "hoveredButtonTextColorForm";
  return ButtonControls2;
})(ButtonControls || {});
var TextControls = /* @__PURE__ */ ((TextControls2) => {
  TextControls2["HIDDEN_NODE"] = "hiddenNodeText";
  TextControls2["PARAGRAPH_STYLE"] = "paragraphStyleForm";
  TextControls2["ALIGN"] = "textAlignmentForm";
  TextControls2["ANCHOR_CONTAINER"] = "textAnchorForm";
  TextControls2["FONT_BACKGROUND_COLOR"] = "textBlockFontBackgroundColor";
  TextControls2["TEXT_BLOCK_BACKGROUND_COLOR"] = "textBlockBackgroundColor";
  TextControls2["FONT_COLOR"] = "textBlockFontColor";
  TextControls2["TEXT_BLOCK_FONT_FAMILY"] = "textBlockFontFamily";
  TextControls2["FONT_FAMILY"] = "textFontFamily";
  TextControls2["FONT_SIZE"] = "textBlockFontSize";
  TextControls2["FONT_WEIGHT"] = "textBlockFontWeight";
  TextControls2["DIRECTION"] = "textBlockDirectionForm";
  TextControls2["INSERT_FORM"] = "textBlockInsertForm";
  TextControls2["LETTER_SPACING"] = "textBlockLetterSpacing";
  TextControls2["LINK_DATA"] = "textBlockLinkDataForm";
  TextControls2["FORMAT"] = "textBlockTextFormatForm";
  TextControls2["FIXED_HEIGHT"] = "textFixedHeightForm";
  TextControls2["INTERNAL_INDENTS"] = "textInternalIndents";
  TextControls2["LINE_HEIGHT"] = "textLineHeightForm";
  TextControls2["MIME_TYPE"] = "textMimeTypeForm";
  TextControls2["NO_LINE_WRAPS"] = "textNoLineWrapsForm";
  return TextControls2;
})(TextControls || {});
var AmpFormControls = /* @__PURE__ */ ((AmpFormControls2) => {
  AmpFormControls2["AMP_FORM_HIDDEN_NODE"] = "ampFormHiddenNodeForm";
  AmpFormControls2["AMP_FORM_DATA_COLLECTION"] = "ampFormDataCollectionForm";
  AmpFormControls2["AMP_FORM_MIME_TYPE"] = "ampFormMimeTypeForm";
  AmpFormControls2["BACKGROUND_COLOR"] = "ampFormBackgroundColorForm";
  return AmpFormControls2;
})(AmpFormControls || {});
var VideoControls = /* @__PURE__ */ ((VideoControls2) => {
  VideoControls2["CUSTOM_THUMBNAIL_CONTAINER"] = "customThumbnailContainerForm";
  VideoControls2["METADATA_LINK"] = "metadataLink";
  VideoControls2["PLAY_BUTTON"] = "playButton";
  VideoControls2["ALIGNMENT"] = "videoAlignment";
  VideoControls2["ALT_TEXT"] = "videoAltText";
  VideoControls2["EXTERNAL_INDENTS"] = "videoExternalIndents";
  VideoControls2["FALLBACK_GIF"] = "videoFallbackGif";
  VideoControls2["MIME_TYPE"] = "videoMimeTypeForm";
  VideoControls2["MODE"] = "videoMode";
  VideoControls2["MODE_NOTICE"] = "videoModeNotice";
  VideoControls2["PLAYBACK"] = "videoPlayback";
  VideoControls2["RESPONSIVE"] = "videoResponsive";
  VideoControls2["SIZE"] = "videoSizeContainer";
  VideoControls2["SOURCE"] = "videoSource";
  return VideoControls2;
})(VideoControls || {});
var TimerControls = /* @__PURE__ */ ((TimerControls2) => {
  TimerControls2["ALIGNMENT"] = "timerAlignment";
  TimerControls2["ALT_TEXT"] = "timerAltText";
  TimerControls2["BACKGROUND_COLOR"] = "timerBackgroundColor";
  TimerControls2["DATE_TIME"] = "timeDateTime";
  TimerControls2["DIGITAL_LABELS"] = "timerDigitalLabels";
  TimerControls2["DIGITS_FONT_COLOR_CONTAINER"] = "timerDigitsFontColorContainer";
  TimerControls2["DIGITS_FONT_CONTAINER"] = "timerDigitsFontContainer";
  TimerControls2["DISPLAY_DAYS_SWITCHER"] = "timerDisplayDaysSwitcher";
  TimerControls2["EXPIRATION_IMAGE"] = "timerExpirationImage";
  TimerControls2["EXPIRATION_IMAGE_SWITCHER"] = "timerExpirationSwitcher";
  TimerControls2["EXTERNAL_INDENTS"] = "timerExternalIndents";
  TimerControls2["LABELS_CASE"] = "timerLabelsCase";
  TimerControls2["LABELS_FONT_COLOR_CONTAINER"] = "timerLabelsFontColorContainer";
  TimerControls2["LABELS_FONT_CONTAINER"] = "timerLabelsFontContainer";
  TimerControls2["LABEL_LANGUAGE"] = "timerLabelsLanguage";
  TimerControls2["LINK"] = "timerLink";
  TimerControls2["MIME_TYPE"] = "timerMimeTypeForm";
  TimerControls2["RESPONSIVE"] = "timerResponsive";
  TimerControls2["RETINA_DISPLAY_SUPPORT"] = "timerRetinaDisplaySupport";
  TimerControls2["SEPARATOR"] = "timerSeparator";
  TimerControls2["SEPARATOR_FONT_COLOR"] = "timerSeparatorFontColor";
  TimerControls2["SEPARATOR_FONT_CONTAINER"] = "timerSeparatorFontContainer";
  TimerControls2["SIZE"] = "timerSize";
  TimerControls2["TIME_ZONE"] = "timerTimeZone";
  return TimerControls2;
})(TimerControls || {});
var SpacerControls = /* @__PURE__ */ ((SpacerControls2) => {
  SpacerControls2["ALIGNMENT"] = "spacerAlignment";
  SpacerControls2["BORDER"] = "spacerBorder";
  SpacerControls2["EXTERNAL_INDENTS"] = "spacerExternalIndents";
  SpacerControls2["MIME_TYPE"] = "spacerMimeTypeForm";
  SpacerControls2["MODE"] = "spacerMode";
  SpacerControls2["SIZE"] = "spacerSize";
  SpacerControls2["BACKGROUND_COLOR"] = "spacerBackgroundColor";
  SpacerControls2["BACKGROUND_COLOR_LINE"] = "spacerBackgroundColorLine";
  return SpacerControls2;
})(SpacerControls || {});
var ImageControls = /* @__PURE__ */ ((ImageControls2) => {
  ImageControls2["ALT_TEXT"] = "altText";
  ImageControls2["LINK"] = "blockLink";
  ImageControls2["ALIGNMENT"] = "imageAlignment";
  ImageControls2["ANCHOR_LINK_CONTAINER"] = "imageAnchorLinkContainerForm";
  ImageControls2["BORDER_RADIUS"] = "imageBorderRadiusForm";
  ImageControls2["IMAGE"] = "imageImageForm";
  ImageControls2["EXTERNAL_INDENTS"] = "imageExternalIndents";
  ImageControls2["MIME_TYPE"] = "imageMimeTypeForm";
  ImageControls2["RESPONSIVE"] = "imageResponsive";
  ImageControls2["ROLLOVER_IMAGE"] = "imageRolloverImageForm";
  ImageControls2["ROLLOVER_SWITCHER"] = "imageRolloverSwitcherForm";
  ImageControls2["SIZE"] = "imageSizeContainer";
  return ImageControls2;
})(ImageControls || {});
var HTMLControls = /* @__PURE__ */ ((HTMLControls2) => {
  HTMLControls2["EXTERNAL_INDENTS"] = "htmlExternalIndents";
  HTMLControls2["MIME_TYPE"] = "htmlMimeTypeForm";
  return HTMLControls2;
})(HTMLControls || {});
var CustomLinkControls = /* @__PURE__ */ ((CustomLinkControls2) => {
  CustomLinkControls2["IMAGE"] = "customBlockImageForm";
  CustomLinkControls2["COLOR_FORM"] = "customLinkColorForm";
  CustomLinkControls2["HREF_FORM"] = "customLinkHrefForm";
  CustomLinkControls2["TEXT_FORM"] = "customLinkTextForm";
  CustomLinkControls2["UNDERLINE_FORM"] = "customLinkUnderlineForm";
  CustomLinkControls2["WORD_BREAK_FORM"] = "customLinkWordBreakForm";
  return CustomLinkControls2;
})(CustomLinkControls || {});
var CustomImageControls = /* @__PURE__ */ ((CustomImageControls2) => {
  CustomImageControls2["ALT_TEXT_FORM"] = "customBlockImageAltTextForm";
  CustomImageControls2["WITHOUT_LINK_FORM"] = "customBlockImageWithOutLinkForm";
  return CustomImageControls2;
})(CustomImageControls || {});
var CustomTextControls = /* @__PURE__ */ ((CustomTextControls2) => {
  CustomTextControls2["ALIGN"] = "customTextBlockTextAlign";
  CustomTextControls2["FONT_SIZE"] = "customTextFontSizeController";
  return CustomTextControls2;
})(CustomTextControls || {});
var SocialControls = /* @__PURE__ */ ((SocialControls2) => {
  SocialControls2["ICON_SIZE"] = "iconSize";
  SocialControls2["EXTERNAL_INDENTS"] = "socialExternalIndents";
  SocialControls2["ICON_SPACER"] = "socialIconsSpacer";
  SocialControls2["ICON_TYPE"] = "socialIconTypeForm";
  SocialControls2["ITEM"] = "socialItemForm";
  SocialControls2["ITEM_TEXT_CUSTOMIZATION"] = "socialItemTextCustomizationForm";
  SocialControls2["MIME_TYPE"] = "socialMimeTypeForm";
  SocialControls2["NETWORK_ALIGNMENT"] = "socialNetworkAlignment";
  SocialControls2["BACKGROUND_COLOR"] = "socialBackgroundColor";
  return SocialControls2;
})(SocialControls || {});
var MenuControls = /* @__PURE__ */ ((MenuControls2) => {
  MenuControls2["EXTERNAL_INDENTS"] = "menuExternalIndents";
  MenuControls2["ALIGNMENT"] = "menuAlignment";
  MenuControls2["RESPONSIVE_MENU"] = "menuResponsive";
  MenuControls2["FIT_TO_CONTAINER"] = "menuFitToContainer";
  MenuControls2["FONT_FAMILY"] = "menuFontFamily";
  MenuControls2["FONT_SIZE"] = "menuFontSize";
  MenuControls2["HIDDEN"] = "menuHidden";
  MenuControls2["ICONS_CONFIGURATION"] = "menuIconsConfiguration";
  MenuControls2["ITEMS"] = "menuItemsForm";
  MenuControls2["ITEMS_COUNT"] = "menuItemsCount";
  MenuControls2["ITEM_INTERNAL_INDENTS"] = "menuItemInternalIndents";
  MenuControls2["MIME_TYPE"] = "menuMimeTypeForm";
  MenuControls2["SEPARATE_ITEMS"] = "menuSeparateItems";
  MenuControls2["SEPARATE_ITEMS_COLOR_SWITCHER"] = "menuSeparateItemsColorSwitcher";
  MenuControls2["SEPARATOR"] = "menuSeparatorForm";
  MenuControls2["STYLES"] = "menuStylesForm";
  MenuControls2["TEXT_STYLE_AND_COLOR"] = "menuTextStyleAndColor";
  MenuControls2["TYPE_CONTAINER"] = "menuTypeContainerForm";
  return MenuControls2;
})(MenuControls || {});
var AccordionControls = /* @__PURE__ */ ((AccordionControls2) => {
  AccordionControls2["MIME_TYPE"] = "ampAccordionMimeTypeForm";
  AccordionControls2["ANIMATED_OPENING"] = "ampAccordionAnimatedOpeningForm";
  AccordionControls2["AUTO_COLLAPSING"] = "ampAccordionAutoCollapsingForm";
  AccordionControls2["BORDER_FORM"] = "ampAccordionBorderForm";
  AccordionControls2["FONT_FAMILY"] = "ampAccordionFontFamily";
  AccordionControls2["ICON_SIZE"] = "ampAccordionIconSizeForm";
  AccordionControls2["HIDDEN_NODE"] = "ampAccordionHiddenNodeForm";
  AccordionControls2["SECTIONS_FORM"] = "ampAccordionSectionsForm";
  AccordionControls2["SECTIONS_GAP_FORM"] = "ampAccordionSectionsGapForm";
  AccordionControls2["SECTIONS_MAIN_FORM"] = "ampAccordionSectionsMainForm";
  AccordionControls2["TITLES_BACKGROUND_COLOR"] = "ampAccordionTitlesBackgroundColor";
  AccordionControls2["TITLE_ALIGNMENT_FORM"] = "ampAccordionTitleAlignmentForm";
  AccordionControls2["TITLE_FONT_SIZE"] = "AmpAccordionTitleFontSizeController";
  AccordionControls2["TITLE_RADIUS"] = "ampAccordionTitleRadiusForm";
  AccordionControls2["TITLE_ICON_IMAGE"] = "ampAccordionTitleIconImageForm";
  AccordionControls2["TITLE_ICON_SWITCHER"] = "ampAccordionTitleIconSwitcherForm";
  AccordionControls2["TITLE_TEXT_STYLE_AND_COLOR"] = "AmpAccordionTitleTextStyleAndColorController";
  return AccordionControls2;
})(AccordionControls || {});
var CarouselControls = /* @__PURE__ */ ((CarouselControls2) => {
  CarouselControls2["MIME_TYPE"] = "ampCarouselMimeTypeForm";
  CarouselControls2["AUTOPLAY"] = "ampCarouselAutoplayForm";
  CarouselControls2["AUTOPLAY_DELAY"] = "ampCarouselDelayForm";
  CarouselControls2["HIDDEN_NODE"] = "ampCarouselHiddenNodeForm";
  CarouselControls2["LOOP"] = "ampCarouselLoopForm";
  CarouselControls2["SLIDES"] = "ampSlidesForm";
  CarouselControls2["SLIDE_ALT_TEXT"] = "ampSlideAltTextForm";
  CarouselControls2["SLIDE_IMAGE"] = "ampSlideImageForm";
  CarouselControls2["SLIDE_IMAGE_FIT"] = "ampCarouselSlideImageFitForm";
  CarouselControls2["SLIDE_LINK"] = "ampSlideLinkForm";
  CarouselControls2["SLIDE_RADIUS"] = "ampCarouselSlideRadiusForm";
  CarouselControls2["SLIDE_THUMBNAIL_SWITCHER"] = "ampCarouselSlideThumbnailSwitcherForm";
  CarouselControls2["THUMBNAIL_BORDER_STYLE"] = "ampCarouselThumbnailBorderStyleForm";
  CarouselControls2["THUMBNAIL_CONTAINER"] = "ampCarouselThumbnailContainerForm";
  CarouselControls2["THUMBNAIL_CUSTOM_REVIEW"] = "ampCarouselThumbnailCustomPreviewImageForm";
  CarouselControls2["THUMBNAIL_RADIUS"] = "ampCarouselThumbnailRadiusForm";
  CarouselControls2["THUMBNAIL_COLOR"] = "ampCarouselThumbnailColorForm";
  CarouselControls2["AMP_GENERAL_LINK"] = "AMP_GENERAL_LINK_CONTROLLER";
  CarouselControls2["AMP_GENERAL_LINK_SWITCHER"] = "AMP_GENERAL_LINK_SWITCHER";
  return CarouselControls2;
})(CarouselControls || {});
var StripeControls = /* @__PURE__ */ ((StripeControls2) => {
  StripeControls2["BORDER_FORM"] = "stripeBorderForm";
  StripeControls2["COLOR"] = "stripeColorForm";
  StripeControls2["CONTENT_COLOR"] = "stripeContentColor";
  StripeControls2["IMAGE_CONTAINER"] = "stripeImageContainerForm";
  StripeControls2["INTERNAL_INDENTS"] = "stripeInternalIndents";
  StripeControls2["MESSAGE_AREA"] = "stripeMessageAreaForm";
  StripeControls2["MIME_TYPE"] = "stripeMimeTypeForm";
  return StripeControls2;
})(StripeControls || {});
var StructureControls = /* @__PURE__ */ ((StructureControls2) => {
  StructureControls2["RESPONSIVE_STRUCTURE"] = "responsiveStructure";
  StructureControls2["BACKGROUND_COLOR"] = "structureBackgroundColor";
  StructureControls2["BORDER_RADIUS"] = "structureBorderRadiusForm";
  StructureControls2["CONTAINER_GAP"] = "structureContainerGap";
  StructureControls2["CONTAINER_INVERSION"] = "structureContainerInversion";
  StructureControls2["DYNAMIC_CONTAINERS"] = "structureDynamicContainers";
  StructureControls2["EXTERNAL_INDENTS"] = "structureExternalIndents";
  StructureControls2["IMAGE_CONTAINER"] = "structureImageContainerForm";
  StructureControls2["INTERNAL_INDENTS"] = "structureInternalIndents";
  StructureControls2["ITEM"] = "structureItem";
  StructureControls2["MIME_TYPE"] = "structureMimeType";
  StructureControls2["BORDER_FORM"] = "structureBorderForm";
  return StructureControls2;
})(StructureControls || {});
var ContainerControls = /* @__PURE__ */ ((ContainerControls2) => {
  ContainerControls2["BACKGROUND_COLOR"] = "containerBackgroundColorForm";
  ContainerControls2["BORDER_FORM"] = "containerBorderForm";
  ContainerControls2["BORDER_RADIUS"] = "containerBorderRadiusForm";
  ContainerControls2["EXTERNAL_INDENTS"] = "containerExternalIndentsForm";
  ContainerControls2["IMAGE_CONTAINER"] = "containerImageContainerForm";
  ContainerControls2["MIME_TYPE"] = "containerMimeTypeForm";
  ContainerControls2["DISPLAY_CONDITIONS"] = "displayConditions";
  ContainerControls2["HIDDEN_NODE"] = "containerHiddenNodeForm";
  return ContainerControls2;
})(ContainerControls || {});
var MessageSettingsControls = /* @__PURE__ */ ((MessageSettingsControls2) => {
  MessageSettingsControls2["GMAIL_PROMOTIONS_SWITCHER"] = "gmailPromotionsSwitcherForm";
  MessageSettingsControls2["GMAIL_PROMOTIONS_TAB"] = "gmailPromotionsTabForm";
  MessageSettingsControls2["HIDDEN_PRE_HEADER"] = "hiddenPreHeaderForm";
  MessageSettingsControls2["SUBJECT_TITLE"] = "subjectTitleForm";
  MessageSettingsControls2["UTM_PARAMETERS"] = "utmParametersForm";
  MessageSettingsControls2["UTM_PARAMETERS_CAMPAIGN"] = "utmParameterCampaignForm";
  MessageSettingsControls2["UTM_PARAMETERS_CUSTOM"] = "utmParametersCustomForm";
  MessageSettingsControls2["UTM_PARAMETERS_CUSTOM_ITEM"] = "utmParametersCustomItemForm";
  return MessageSettingsControls2;
})(MessageSettingsControls || {});
var GeneralStylesControls = /* @__PURE__ */ ((GeneralStylesControls2) => {
  GeneralStylesControls2["BUTTONS_ADJUST_TO_WIDTH_CONTAINER"] = "buttonsAdjustToWidthFormContainer";
  GeneralStylesControls2["BUTTONS_BORDER"] = "buttonsBorder";
  GeneralStylesControls2["BUTTONS_BORDER_RADIUS_CONTAINER"] = "buttonsBorderRadiusContainer";
  GeneralStylesControls2["BUTTONS_COLOR_CONTAINER"] = "buttonsColorContainer";
  GeneralStylesControls2["BUTTONS_FONT_FAMILY_CONTAINER"] = "buttonsFontFamilyContainer";
  GeneralStylesControls2["BUTTONS_FONT_SIZE_CONTAINER"] = "buttonsFontSizeFormContainer";
  GeneralStylesControls2["BUTTONS_HOVERED_BUTTON_STYLE"] = "buttonsHoveredButtonStyleForm";
  GeneralStylesControls2["BUTTONS_INTERNAL_INDENTS_CONTAINER"] = "buttonsInternalIndentsContainer";
  GeneralStylesControls2["BUTTONS_LETTER_SPACING_CONTAINER"] = "buttonsLetterSpacingContainer";
  GeneralStylesControls2["BUTTONS_OUTLOOK_SUPPORT_CONTAINER"] = "buttonsOutlookSupportContainer";
  GeneralStylesControls2["BUTTONS_TEXT_STYLE_AND_COLOR_CONTAINER"] = "buttonsTextStyleAndColorFormContainer";
  GeneralStylesControls2["DEFAULT_STRUCTURE_INTERNAL_INDENTS"] = "defaultStructureInternalIndents";
  GeneralStylesControls2["GENERAL_BACKGROUND_COLOR_CONTAINER"] = "generalBackgroundColorContainer";
  GeneralStylesControls2["GENERAL_IMAGE_CONTAINER"] = "generalImageContainer";
  GeneralStylesControls2["HEADINGS_FONT_FAMILY_CONTAINER"] = "headingsFontFamilyContainer";
  GeneralStylesControls2["HEADINGS_H1_CONTROLS_CONTAINER"] = "headingH1controlsContainer";
  GeneralStylesControls2["HEADINGS_H2_CONTROLS_CONTAINER"] = "headingH2controlsContainer";
  GeneralStylesControls2["HEADINGS_H3_CONTROLS_CONTAINER"] = "headingH3controlsContainer";
  GeneralStylesControls2["HEADINGS_H4_CONTROLS_CONTAINER"] = "headingH4controlsContainer";
  GeneralStylesControls2["HEADINGS_H5_CONTROLS_CONTAINER"] = "headingH5controlsContainer";
  GeneralStylesControls2["HEADINGS_H6_CONTROLS_CONTAINER"] = "headingH6controlsContainer";
  GeneralStylesControls2["HEADINGS_LETTER_SPACING_CONTAINER"] = "headingsLetterSpacingFormContainer";
  GeneralStylesControls2["HEADINGS_PARAGRAPH_BOTTOM_MARGIN"] = "headingsParagraphBottomMarginForm";
  GeneralStylesControls2["HEADINGS_TYPES_BUTTON_BAR"] = "headingsTypesButtonBarForm";
  GeneralStylesControls2["LISTS_STYLES"] = "listsStyles";
  GeneralStylesControls2["MARGIN_AROUND_MESSAGE"] = "marginAroundMessage";
  GeneralStylesControls2["MESSAGE_ALIGNMENT"] = "messageAlignment";
  GeneralStylesControls2["MESSAGE_CONTENT_WIDTH"] = "messageContentWidth";
  GeneralStylesControls2["RESPONSIVE_DESIGN"] = "responsiveDesign";
  GeneralStylesControls2["HIDE_IMAGE_DOWNLOAD_ICONS"] = "hideImageDownloadIcons";
  GeneralStylesControls2["DEFAULT_STYLES"] = "defaultStyles";
  GeneralStylesControls2["RIGHT_TO_LEFT_CONTAINER"] = "rightToLeftContainer";
  GeneralStylesControls2["STRIPES_CONTENT_CONTROLS_CONTAINER"] = "stripesContentControlsContainer";
  GeneralStylesControls2["STRIPES_FONT_FAMILY_CONTAINER"] = "stripesFontFamilyFormContainer";
  GeneralStylesControls2["STRIPES_FOOTER_CONTROLS_CONTAINER"] = "stripesFooterControlsContainer";
  GeneralStylesControls2["STRIPES_HEADER_CONTROLS_CONTAINER"] = "stripesHeaderControlsContainer";
  GeneralStylesControls2["STRIPES_INFO_AREA_CONTROLS_CONTAINER"] = "stripesInfoAreaControlsContainer";
  GeneralStylesControls2["STRIPES_LETTER_SPACING_CONTAINER"] = "stripesLetterSpacingFormContainer";
  GeneralStylesControls2["STRIPES_LINE_HEIGHT_CONTAINER"] = "stripesLineHeightFormContainer";
  GeneralStylesControls2["STRIPE_TYPES_BUTTON_BAR"] = "stripeTypesButtonBarForm";
  GeneralStylesControls2["UNDERLINE_LINKS_CONTAINER"] = "underlineLinksContainer";
  return GeneralStylesControls2;
})(GeneralStylesControls || {});
var BuiltInControlTypes = {
  [
    "BLOCK_BANNER"
    /* BLOCK_BANNER */
  ]: BannerControls,
  [
    "BLOCK_BUTTON"
    /* BLOCK_BUTTON */
  ]: ButtonControls,
  [
    "BLOCK_TEXT"
    /* BLOCK_TEXT */
  ]: TextControls,
  [
    "BLOCK_VIDEO"
    /* BLOCK_VIDEO */
  ]: VideoControls,
  [
    "BLOCK_TIMER"
    /* BLOCK_TIMER */
  ]: TimerControls,
  [
    "BLOCK_SPACER"
    /* BLOCK_SPACER */
  ]: SpacerControls,
  [
    "BLOCK_IMAGE"
    /* BLOCK_IMAGE */
  ]: ImageControls,
  [
    "BLOCK_HTML"
    /* BLOCK_HTML */
  ]: HTMLControls,
  [
    "BLOCK_SOCIAL"
    /* BLOCK_SOCIAL */
  ]: SocialControls,
  [
    "BLOCK_MENU"
    /* BLOCK_MENU */
  ]: MenuControls,
  [
    "BLOCK_AMP_FORM"
    /* BLOCK_AMP_FORM */
  ]: AmpFormControls,
  [
    "BLOCK_AMP_ACCORDION"
    /* BLOCK_AMP_ACCORDION */
  ]: AccordionControls,
  [
    "BLOCK_AMP_CAROUSEL"
    /* BLOCK_AMP_CAROUSEL */
  ]: CarouselControls,
  [
    "STRIPE"
    /* STRIPE */
  ]: StripeControls,
  [
    "STRUCTURE"
    /* STRUCTURE */
  ]: StructureControls,
  [
    "CONTAINER"
    /* CONTAINER */
  ]: ContainerControls,
  [
    "CUSTOM_BLOCK_LINK"
    /* CUSTOM_BLOCK_LINK */
  ]: CustomLinkControls,
  [
    "CUSTOM_BLOCK_IMAGE"
    /* CUSTOM_BLOCK_IMAGE */
  ]: CustomImageControls,
  [
    "CUSTOM_BLOCK_TEXT"
    /* CUSTOM_BLOCK_TEXT */
  ]: CustomTextControls,
  BANNER_CHILD: BannerChildControls,
  MESSAGE_SETTINGS: MessageSettingsControls,
  GENERAL_STYLES: GeneralStylesControls,
  GENERAL: GeneralControls
};
var ContextActionType = /* @__PURE__ */ ((ContextActionType2) => {
  ContextActionType2["SAVE_AS_MODULE"] = "saveAsModule";
  ContextActionType2["IMPROVE_WITH_AI"] = "improveWithAI";
  ContextActionType2["MOVE"] = "move";
  ContextActionType2["COPY"] = "copy";
  ContextActionType2["REMOVE"] = "remove";
  ContextActionType2["CLEAR_CONTAINER"] = "clearContainer";
  ContextActionType2["EXTERNAL_DISPLAY_CONDITION"] = "externalDisplayCondition";
  return ContextActionType2;
})(ContextActionType || {});
var EditorStatePropertyType = /* @__PURE__ */ ((EditorStatePropertyType2) => {
  EditorStatePropertyType2["previewDeviceMode"] = "previewDeviceMode";
  EditorStatePropertyType2["panelPosition"] = "panelPosition";
  EditorStatePropertyType2["themeMode"] = "themeMode";
  return EditorStatePropertyType2;
})(EditorStatePropertyType || {});
var ElementLockCategory = /* @__PURE__ */ ((ElementLockCategory2) => {
  ElementLockCategory2["CONTENT"] = "content";
  ElementLockCategory2["STYLE"] = "style";
  return ElementLockCategory2;
})(ElementLockCategory || {});
var OrderableItemIconPosition = /* @__PURE__ */ ((OrderableItemIconPosition2) => {
  OrderableItemIconPosition2["TOP"] = "TOP";
  OrderableItemIconPosition2["LEFT"] = "LEFT";
  return OrderableItemIconPosition2;
})(OrderableItemIconPosition || {});
var PanelPosition = /* @__PURE__ */ ((PanelPosition2) => {
  PanelPosition2["BLOCKS_SETTINGS"] = "BLOCKS_SETTINGS";
  PanelPosition2["SETTINGS_BLOCKS"] = "SETTINGS_BLOCKS";
  return PanelPosition2;
})(PanelPosition || {});
var PopoverSide = /* @__PURE__ */ ((PopoverSide2) => {
  PopoverSide2["TOP"] = "top";
  PopoverSide2["RIGHT"] = "right";
  PopoverSide2["BOTTOM"] = "bottom";
  PopoverSide2["LEFT"] = "left";
  return PopoverSide2;
})(PopoverSide || {});
var ExtensionPopoverType = /* @__PURE__ */ ((ExtensionPopoverType2) => {
  ExtensionPopoverType2["AI_HIDDEN_PREHEADER"] = "aiHiddenPreheader";
  ExtensionPopoverType2["AI_SUBJECT"] = "aiSubject";
  ExtensionPopoverType2["AI_TEXT"] = "aiText";
  return ExtensionPopoverType2;
})(ExtensionPopoverType || {});
var PreviewDeviceMode = /* @__PURE__ */ ((PreviewDeviceMode2) => {
  PreviewDeviceMode2["DESKTOP"] = "DESKTOP";
  PreviewDeviceMode2["MOBILE"] = "MOBILE";
  return PreviewDeviceMode2;
})(PreviewDeviceMode || {});
var SettingsTab = /* @__PURE__ */ ((SettingsTab2) => {
  SettingsTab2["SETTINGS"] = "settings";
  SettingsTab2["STYLES"] = "styles";
  SettingsTab2["DATA"] = "data";
  return SettingsTab2;
})(SettingsTab || {});
var ThemeMode = /* @__PURE__ */ ((ThemeMode2) => {
  ThemeMode2["LIGHT"] = "LIGHT";
  ThemeMode2["DARK"] = "DARK";
  return ThemeMode2;
})(ThemeMode || {});
var UIElementAttributes = {
  name: "name",
  disabled: "disabled"
};
var buttonAttributes2 = {
  ...UIElementAttributes,
  caption: "caption",
  icon: "icon"
};
var checkBoxAttributes = {
  ...UIElementAttributes,
  caption: "caption"
};
var counterAttributes = {
  ...UIElementAttributes,
  minValue: "min-value",
  maxValue: "max-value",
  step: "step",
  counterRangeEnabled: "counter-range-enabled",
  counterRangeHeight: "counter-range-height"
};
var datePickerAttributes = {
  ...UIElementAttributes,
  placeholder: "placeholder",
  minDate: "min-date"
};
var labelAttributes = {
  ...UIElementAttributes,
  text: "text",
  hint: "hint"
};
var messageAttributes = {
  ...UIElementAttributes,
  type: "type",
  icon: "icon"
};
var radioButtonsAttributes = {
  ...UIElementAttributes,
  buttons: "buttons"
};
var selectAttributes = {
  ...UIElementAttributes,
  searchable: "searchable",
  multiSelect: "multi-select",
  placeholder: "placeholder",
  items: "items"
};
var fontFamilySelectAttributes = {
  ...selectAttributes,
  addCustomFontOption: "add-custom-font-option"
};
var selectItemAttributes = {
  ...UIElementAttributes,
  text: "text",
  value: "value"
};
var checkItemAttributes = {
  ...UIElementAttributes,
  text: "text",
  hint: "hint",
  icon: "icon",
  value: "value"
};
var checkButtonsAttributes = {
  ...UIElementAttributes,
  buttons: "buttons"
};
var radioItemAttributes = {
  ...UIElementAttributes,
  text: "text",
  hint: "hint",
  icon: "icon",
  value: "value"
};
var textAttributes = {
  ...UIElementAttributes,
  placeholder: "placeholder"
};
var richTextAttributes = {
  ...textAttributes,
  hasMergeTagIcon: "has-merge-tag-icon",
  maxLength: "max-length",
  singleLine: "single-line"
};
var textAreaAttributes = {
  ...UIElementAttributes,
  resizable: "resizable",
  placeholder: "placeholder"
};
var iconAttributes = {
  ...UIElementAttributes,
  img: "img",
  src: "src",
  title: "title",
  imageClass: "image-class",
  hint: "hint",
  disabled: "disabled",
  isActive: "is-active",
  visibility: "visibility",
  transform: "transform"
};
var nestedControlAttributes = {
  ...UIElementAttributes,
  controlId: "control-id"
};
var expandableAttributes = {
  ...UIElementAttributes,
  expanded: "expanded"
};
var orderableAttributes = {
  ...UIElementAttributes,
  icon: "icon",
  position: "position"
};
var orderableItemAttributes = {
  ...UIElementAttributes
};
var orderableIconAttributes = {
  ...UIElementAttributes,
  icon: "icon"
};
var repeatableAttributes = {
  ...UIElementAttributes
};
var draggableBlockAttributes = {
  ...UIElementAttributes,
  blockId: "block-id"
};
var ampFormServicePickerAttributes = {
  ...UIElementAttributes
};
var MultipleSelectAttributes = {
  ...UIElementAttributes,
  placeholder: "placeholder"
};
var UEAttr = {
  DEFAULT: UIElementAttributes,
  BUTTON: buttonAttributes2,
  CHECKBOX: checkBoxAttributes,
  CHECK_BUTTONS: checkButtonsAttributes,
  COLOR: UIElementAttributes,
  COUNTER: counterAttributes,
  DATEPICKER: datePickerAttributes,
  LABEL: labelAttributes,
  MESSAGE: messageAttributes,
  RADIO_BUTTONS: radioButtonsAttributes,
  SELECTPICKER: selectAttributes,
  FONT_FAMILY_SELECT: fontFamilySelectAttributes,
  SWITCHER: UIElementAttributes,
  TEXT: textAttributes,
  RICH_TEXT: richTextAttributes,
  TEXTAREA: textAreaAttributes,
  ICON: iconAttributes,
  CHECK_ITEM: checkItemAttributes,
  SELECT_ITEM: selectItemAttributes,
  RADIO_ITEM: radioItemAttributes,
  NESTED_CONTROL: nestedControlAttributes,
  EXPANDABLE: expandableAttributes,
  ORDERABLE: orderableAttributes,
  ORDERABLE_ITEM: orderableItemAttributes,
  ORDERABLE_ICON: orderableIconAttributes,
  REPEATABLE: repeatableAttributes,
  DRAGGABLE_BLOCK: draggableBlockAttributes,
  AMP_FORM_SERVICE_PICKER: ampFormServicePickerAttributes,
  MULTIPLE_SELECT: MultipleSelectAttributes
};
var UIElementType = /* @__PURE__ */ ((UIElementType2) => {
  UIElementType2["BUTTON"] = "UE-BUTTON";
  UIElementType2["CHECKBOX"] = "UE-CHECKBOX";
  UIElementType2["CHECK_BUTTONS"] = "UE-CHECK-BUTTONS";
  UIElementType2["COLOR"] = "UE-COLOR";
  UIElementType2["COUNTER"] = "UE-COUNTER";
  UIElementType2["DATEPICKER"] = "UE-DATEPICKER";
  UIElementType2["LABEL"] = "UE-LABEL";
  UIElementType2["MESSAGE"] = "UE-MESSAGE";
  UIElementType2["RADIO_BUTTONS"] = "UE-RADIO-BUTTONS";
  UIElementType2["SELECTPICKER"] = "UE-SELECT";
  UIElementType2["SWITCHER"] = "UE-SWITCHER";
  UIElementType2["TEXT"] = "UE-TEXT";
  UIElementType2["RICH_TEXT"] = "UE-RICH-TEXT";
  UIElementType2["TEXTAREA"] = "UE-TEXTAREA";
  UIElementType2["CHECK_ITEM"] = "UE-CHECK-ITEM";
  UIElementType2["RADIO_ITEM"] = "UE-RADIO-ITEM";
  UIElementType2["SELECT_ITEM"] = "UE-SELECT-ITEM";
  UIElementType2["ICON"] = "UE-ICON";
  UIElementType2["MERGETAGS"] = "UE-MERGETAGS";
  UIElementType2["FONT_FAMILY_SELECT"] = "UE-FONT-FAMILY-SELECT";
  UIElementType2["NESTED_CONTROL"] = "UE-NESTED-CONTROL";
  UIElementType2["EXPANDABLE"] = "UE-EXPANDABLE";
  UIElementType2["EXPANDABLE_HEADER"] = "UE-EXPANDABLE_HEADER";
  UIElementType2["EXPANDABLE_CONTENT"] = "UE-EXPANDABLE_CONTENT";
  UIElementType2["ORDERABLE"] = "UE-ORDERABLE";
  UIElementType2["ORDERABLE_ITEM"] = "UE-ORDERABLE-ITEM";
  UIElementType2["ORDERABLE_ICON"] = "UE-ORDERABLE-ICON";
  UIElementType2["REPEATABLE"] = "UE-REPEATABLE";
  UIElementType2["DRAGGABLE_BLOCK"] = "UE-DRAGGABLE-BLOCK";
  UIElementType2["AMP_FORM_SERVICE_PICKER"] = "UE-AMP-FORM-SERVICE-PICKER";
  UIElementType2["MULTIPLE_SELECT"] = "UE-MULTIPLE_SELECT";
  UIElementType2["SCROLLABLE"] = "UE-SCROLLABLE-CONTAINER";
  UIElementType2["POPUP_PANEL"] = "UE-POPUP-PANEL";
  return UIElementType2;
})(UIElementType || {});
var BuiltInControl = class {
  /**
   * @description returns map of nodes parent control operates on
   */
  getTargetNodes(root) {
    return [root];
  }
  /**
   * @description returns map of labels used by parent control UI
   */
  getLabels() {
    return void 0;
  }
  /**
   * @description returns custom description for parent modifications
   */
  getModificationDescription() {
    return void 0;
  }
  /**
   * @description returns custom modifications to be included in the parent control patch
   */
  getAdditionalModifications(_root) {
    return void 0;
  }
  /**
   * Determines whether the specified HTML node is visible.
   *
   * @param _node - The HTML node to evaluate for visibility, provided as an immutable object.
   * @return A boolean value indicating whether the node is visible. Returns `true` if the node is visible, otherwise `false`.
   */
  isVisible(_node) {
    return true;
  }
  /**
   * Element Lock category of this control. Return `undefined` (the default) to inherit the category of
   * the extended parent control — a control extending a style parent is governed by the style-lock
   * automatically. Override with an explicit {@link ElementLockCategory} only to change that.
   * @returns The Element Lock category, or `undefined` to inherit from the parent control.
   */
  getElementLockCategory() {
    return void 0;
  }
};
var ButtonBuiltInControl = class extends BuiltInControl {
  getTargetNodes(root) {
    const buttons = root.querySelectorAll(BlockSelector.BUTTON);
    const button = root.asElement().hasClass(ESD_BLOCK_BUTTON) ? [root] : [];
    return buttons.length ? buttons : button;
  }
};
var ButtonBorderRadiusBuiltInControl = class extends ButtonBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_BUTTON"
      /* BLOCK_BUTTON */
    ].BORDER_RADIUS;
  }
  getLabels() {
    return void 0;
  }
};
var ButtonAlignBuiltInControl = class extends ButtonBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_BUTTON"
      /* BLOCK_BUTTON */
    ].ALIGNMENT;
  }
};
var ButtonBackgroundColorBuiltInControl = class extends ButtonBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes.GENERAL.BACKGROUND_COLOR;
  }
};
var ButtonBlockBackgroundColorBuiltInControl = class extends ButtonBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_BUTTON"
      /* BLOCK_BUTTON */
    ].BUTTON_BLOCK_BACKGROUND_COLOR;
  }
};
var ButtonBorderBuiltInControl = class extends ButtonBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_BUTTON"
      /* BLOCK_BUTTON */
    ].BORDER;
  }
  getLabels() {
    return void 0;
  }
};
var ButtonColorBuiltInControl = class extends ButtonBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_BUTTON"
      /* BLOCK_BUTTON */
    ].COLOR;
  }
};
var ButtonFitToContainerBuiltInControl = class extends ButtonBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_BUTTON"
      /* BLOCK_BUTTON */
    ].ADJUST_TO_WIDTH;
  }
};
var ButtonFixedHeightBuiltInControl = class extends ButtonBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_BUTTON"
      /* BLOCK_BUTTON */
    ].FIXED_HEIGHT;
  }
  getLabels() {
    return void 0;
  }
};
var ButtonFontFamilyBuiltInControl = class extends ButtonBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_BUTTON"
      /* BLOCK_BUTTON */
    ].FONT_FAMILY;
  }
};
var ButtonHoverBorderColorBuiltInControl = class extends ButtonBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_BUTTON"
      /* BLOCK_BUTTON */
    ].HOVERED_BORDER_COLOR;
  }
};
var ButtonHoverColorBuiltInControl = class extends ButtonBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_BUTTON"
      /* BLOCK_BUTTON */
    ].HOVERED_COLOR;
  }
};
var ButtonHoverTextColorBuiltInControl = class extends ButtonBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_BUTTON"
      /* BLOCK_BUTTON */
    ].HOVERED_TEXT_COLOR;
  }
};
var ButtonMarginsBuiltInControl = class extends ButtonBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_BUTTON"
      /* BLOCK_BUTTON */
    ].EXTERNAL_INDENTS;
  }
};
var ButtonPaddingsBuiltInControl = class extends ButtonBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_BUTTON"
      /* BLOCK_BUTTON */
    ].INTERNAL_INDENTS;
  }
};
var ButtonTextBuiltInControl = class extends ButtonBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_BUTTON"
      /* BLOCK_BUTTON */
    ].TEXT;
  }
};
var ButtonTextSizeBuiltInControl = class extends ButtonBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_BUTTON"
      /* BLOCK_BUTTON */
    ].FONT_SIZE;
  }
};
var ButtonTextStyleAndFontColorBuiltInControl = class extends ButtonBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_BUTTON"
      /* BLOCK_BUTTON */
    ].TEXT_STYLE_AND_COLOR;
  }
  getLabels() {
    return void 0;
  }
};
var ButtonVisibilityBuiltInControl = class extends ButtonBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes.GENERAL.HIDDEN_NODE;
  }
};
var ContainerBuiltInControl = class extends BuiltInControl {
  getTargetNodes(root) {
    const containers = root.querySelectorAll(BlockSelector.CONTAINER);
    const container = root.asElement().hasClass(ESD_BLOCK_CONTAINER) ? [root] : [];
    return containers.length ? containers : container;
  }
};
var ContainerBackgroundColorBuiltInControl = class extends ContainerBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "CONTAINER"
      /* CONTAINER */
    ].BACKGROUND_COLOR;
  }
};
var ContainerBackgroundImageBuiltInControl = class extends ContainerBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "CONTAINER"
      /* CONTAINER */
    ].IMAGE_CONTAINER;
  }
  getLabels() {
    return void 0;
  }
};
var ContainerBorderBuiltInControl = class extends ContainerBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "CONTAINER"
      /* CONTAINER */
    ].BORDER_FORM;
  }
  getLabels() {
    return void 0;
  }
};
var ContainerBorderRadiusBuiltInControl = class extends ContainerBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "CONTAINER"
      /* CONTAINER */
    ].BORDER_RADIUS;
  }
};
var ContainerVisibilityBuiltInControl = class extends ContainerBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "CONTAINER"
      /* CONTAINER */
    ].HIDDEN_NODE;
  }
};
var _Control = class _Control2 extends BaseValidatedClass {
  constructor() {
    super(_Control2.REQUIRED_METHODS, _Control2);
  }
  /**
   * @description Allows to determine if control should be visible or hidden in control panel.
   * Called on every node modification.
   */
  isVisible(_node) {
    return true;
  }
  /**
   * Optional hook called when the control is initially rendered.
   * Use this for setup tasks like attaching event listeners to the control's template elements.
   */
  onRender() {
  }
  /**
   * Optional cleanup hook called when the control is being destroyed.
   * Use this to remove event listeners or perform other cleanup tasks.
   */
  onDestroy() {
  }
  /**
   * Gets the unique identifier for this UI control type.
   * This ID is used for registration and referencing.
   * @returns A unique string ID.
   */
  getId() {
    throw new Error("Method getId() must be implemented by the subclass");
  }
  /**
   * Gets the HTML template string that defines the structure of this UI control,
   * typically containing one or more UI elements (e.g., `<UE-TEXT>`, `<UE-BUTTON>`).
   * @returns An HTML string.
   */
  getTemplate() {
    throw new Error("Method getTemplate() must be implemented by the subclass");
  }
  /**
   * Hook called whenever the underlying template node associated with this control's context
   * (e.g., the selected block's  HTMLnode) is updated.
   * Implement this to react to changes in the block/structure and update the control's UI elements accordingly.
   * @param node - The updated immutable HTML node representing the control's context.
   */
  onTemplateNodeUpdated(_node) {
  }
  /**
   * Lifecycle hook called when any part of the document template has changed.
   * This can be frequent; use cautiously for performance-sensitive operations.
   * @param _node - The immutable HTML node representing current node instance
   */
  onDocumentChanged(_node) {
  }
  /**
   * Element Lock category of this control. Under `preventContentEdit` the editor disables (and rejects
   * patches from) controls categorised as `content`; under `preventStyleEdit` — the `style` ones.
   * Defaults to {@link ElementLockCategory.CONTENT}; override and return {@link ElementLockCategory.STYLE}
   * for controls that edit visual styling so they are governed by the style-lock instead.
   * @returns The Element Lock category governing this control.
   */
  getElementLockCategory() {
    return "content";
  }
};
_Control.REQUIRED_METHODS = ["getId", "getTemplate"];
var Control = _Control;
var _GeneralPanelTab = class _GeneralPanelTab2 extends BaseValidatedClass {
  constructor() {
    super(_GeneralPanelTab2.REQUIRED_METHODS, _GeneralPanelTab2);
  }
  /**
   * Gets the unique identifier for this tab.
   * This ID is used for registration.
   * @returns A unique string ID.
   */
  getId() {
    throw new Error("Method getId() must be implemented by the subclass");
  }
  /**
   * Gets the icon key representing this tab in the header.
   * @returns A string representing the icon key from the IconsRegistry
   */
  getIcon() {
    throw new Error("Method getIcon() must be implemented by the subclass");
  }
  /**
   * Retrieves the index of the tab associated with the panel.
   * The index represents the position/order of the tab in the UI.
   *
   * @returns {number} The index of the tab.
   */
  getTabIndex() {
    throw new Error("Method getTabIndex() must be implemented by the subclass");
  }
  /**
   * Gets the display name of the tab shown to the user in the header hint.
   * Use `this.api.translate()` for localization.
   * @returns The localized tab name string.
   */
  getName() {
    throw new Error("Method getName() must be implemented by the subclass");
  }
  /**
   * Determines if the tab should be available for use in the editor.
   * Override to provide custom logic based on the editor state or configuration.
   * @returns True if the tab is enabled, false otherwise. Defaults to true.
   */
  isEnabled() {
    return true;
  }
  /**
   * Gets the HTML template string that defines the initial template of general tab.
   * @returns An HTML string.
   */
  getTemplate() {
    throw new Error("Method getTemplate() must be implemented by the subclass");
  }
  /**
   * Lifecycle hook called when any part of the document template has changed.
   * This can be frequent; use cautiously for performance-sensitive operations.
   */
  onDocumentChanged() {
  }
  /**
   * Optional hook called when the general panel tab is initially rendered.
   * Use this for setup tasks like attaching event listeners to the panel's template elements.
   */
  onRender() {
  }
  /**
   * Optional cleanup hook called when the general panel tab is being destroyed.
   */
  onDestroy() {
  }
};
_GeneralPanelTab.REQUIRED_METHODS = ["getId", "getIcon", "getName", "getTemplate", "getTabIndex"];
var GeneralPanelTab = _GeneralPanelTab;
var ImageBuiltInControl = class extends BuiltInControl {
  getTargetNodes(root) {
    const images = root.querySelectorAll(BlockSelector.IMAGE);
    const image = root.asElement().hasClass(ESD_BLOCK_IMAGE) ? [root] : [];
    return images.length ? images : image;
  }
};
var ImageAlignmentBuiltInControl = class extends ImageBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_IMAGE"
      /* BLOCK_IMAGE */
    ].ALIGNMENT;
  }
};
var ImageMarginsBuiltInControl = class extends ImageBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_IMAGE"
      /* BLOCK_IMAGE */
    ].EXTERNAL_INDENTS;
  }
};
var ImageSizeBuiltInControl = class extends ImageBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_IMAGE"
      /* BLOCK_IMAGE */
    ].SIZE;
  }
};
var ImageVisibilityBuiltInControl = class extends ImageBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes.GENERAL.HIDDEN_NODE;
  }
};
var _ModulesPanelTab = class _ModulesPanelTab2 extends BaseValidatedClass {
  constructor() {
    super(_ModulesPanelTab2.REQUIRED_METHODS, _ModulesPanelTab2);
  }
  /**
   * Gets the unique identifier for this tab.
   * This ID is used for registration.
   * @returns A unique string ID.
   */
  getId() {
    throw new Error("Method getId() must be implemented by the subclass");
  }
  /**
   * Gets the icon key representing this tab in the header.
   * @returns A string representing the icon key from the IconsRegistry
   */
  getIcon() {
    throw new Error("Method getIcon() must be implemented by the subclass");
  }
  /**
   * Retrieves the index of the tab associated with the panel.
   * The index represents the position/order of the tab in the UI.
   *
   * @returns {number} The index of the tab.
   */
  getTabIndex() {
    throw new Error("Method getTabIndex() must be implemented by the subclass");
  }
  /**
   * Gets the display name of the tab shown to the user in the header hint.
   * Use `this.api.translate()` for localization.
   * @returns The localized tab name string.
   */
  getName() {
    throw new Error("Method getName() must be implemented by the subclass");
  }
  /**
   * Determines if the tab should be available for use in the editor.
   * Override to provide custom logic based on the editor state or configuration.
   * @returns True if the tab is enabled, false otherwise. Defaults to true.
   */
  isEnabled() {
    return true;
  }
  /**
   * Gets the HTML template string that defines the initial structure of this tab.
   * @returns An HTML string.
   */
  getTemplate() {
    throw new Error("Method getTemplate() must be implemented by the subclass");
  }
  /**
   * Optional hook called when the modules panel tab is initially rendered.
   * Use this for setup tasks like attaching event listeners to the panel's template elements.
   */
  onRender() {
  }
  /**
   * Lifecycle hook called when any part of the document template has changed.
   * This can be frequent; use cautiously for performance-sensitive operations.
   */
  onDocumentChanged() {
  }
};
_ModulesPanelTab.REQUIRED_METHODS = ["getId", "getIcon", "getName", "getTemplate", "getTabIndex"];
var ModulesPanelTab = _ModulesPanelTab;
var _SettingsPanelRegistry = class _SettingsPanelRegistry2 extends BaseValidatedClass {
  constructor() {
    super(_SettingsPanelRegistry2.REQUIRED_METHODS, _SettingsPanelRegistry2);
  }
  registerBlockControls(_blockControlsMap) {
    throw new Error("Method registerBlockControls() must be implemented by the subclass");
  }
};
_SettingsPanelRegistry.REQUIRED_METHODS = ["registerBlockControls"];
var SettingsPanelRegistry = _SettingsPanelRegistry;
var SettingsPanelTab = class _SettingsPanelTab {
  constructor(tabId, controls) {
    this.tabId = tabId;
    this.controls = controls.map(_SettingsPanelTab.normalizeControl);
  }
  getTabId() {
    return this.tabId;
  }
  getLabel() {
    return this.label;
  }
  getControlsIds() {
    return this.controls.map((c) => c.id);
  }
  getControls() {
    return this.controls;
  }
  withLabel(label) {
    this.label = label;
    return this;
  }
  addControl(control, position) {
    const normalized = _SettingsPanelTab.normalizeControl(control);
    if (position < 0) {
      this.controls.unshift(normalized);
    } else if (position > this.controls.length) {
      this.controls.push(normalized);
    } else {
      this.controls.splice(position, 0, normalized);
    }
    return this;
  }
  deleteControl(controlId) {
    const index = this.controls.findIndex((c) => c.id === controlId);
    if (index !== -1) {
      this.controls.splice(index, 1);
    }
  }
  static normalizeControl(control) {
    if (typeof control === "string") {
      return { id: control };
    }
    if (!control.id) {
      throw new Error("SettingsPanelTabControlConfig.id is required");
    }
    return {
      ...control,
      id: control.id
    };
  }
};
var SpacerBuildInControl = class extends BuiltInControl {
  getTargetNodes(root) {
    const spacers = root.querySelectorAll(BlockSelector.SPACER);
    const spacer = root.asElement().hasClass(ESD_BLOCK_SPACER) ? [root] : [];
    return spacers.length ? spacers : spacer;
  }
};
var SpacerBackgroundColorBuiltInControl = class extends SpacerBuildInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_SPACER"
      /* BLOCK_SPACER */
    ].BACKGROUND_COLOR;
  }
};
var SpacerMarginsBuiltInControl = class extends SpacerBuildInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_SPACER"
      /* BLOCK_SPACER */
    ].EXTERNAL_INDENTS;
  }
};
var StructureBuiltInControl = class extends BuiltInControl {
  getTargetNodes(root) {
    const structures = root.querySelectorAll(BlockSelector.STRUCTURE);
    const structure = root.asElement().hasClass(ESD_BLOCK_STRUCTURE) ? [root] : [];
    return structures.length ? structures : structure;
  }
};
var StructureAdaptBuiltInControl = class extends StructureBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "STRUCTURE"
      /* STRUCTURE */
    ].RESPONSIVE_STRUCTURE;
  }
  getLabels() {
    return void 0;
  }
};
var StructureBackgroundColorBuiltInControl = class extends StructureBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "STRUCTURE"
      /* STRUCTURE */
    ].BACKGROUND_COLOR;
  }
};
var StructureBackgroundImageBuiltInControl = class extends StructureBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "STRUCTURE"
      /* STRUCTURE */
    ].IMAGE_CONTAINER;
  }
  getLabels() {
    return void 0;
  }
};
var StructureBorderBuiltInControl = class extends StructureBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "STRUCTURE"
      /* STRUCTURE */
    ].BORDER_FORM;
  }
  getLabels() {
    return void 0;
  }
};
var StructureMarginsBuiltInControl = class extends StructureBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "STRUCTURE"
      /* STRUCTURE */
    ].EXTERNAL_INDENTS;
  }
};
var StructurePaddingsBuiltInControl = class extends StructureBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes.GENERAL.STRUCTURE_INTERNAL_INDENTS;
  }
};
var StructureVisibilityBuiltInControl = class extends StructureBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes.GENERAL.HIDDEN_NODE;
  }
};
var TextBuiltInControl = class extends BuiltInControl {
  getTargetNodes(root) {
    const texts = root.querySelectorAll(BlockSelector.TEXT);
    const text = root.asElement().hasClass(ESD_BLOCK_TEXT) ? [root] : [];
    return texts.length ? texts : text;
  }
};
var TextAlignBuiltInControl = class extends TextBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes.GENERAL.TEXT_ALIGN;
  }
};
var TextBlockBackgroundBuiltInControl = class extends TextBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_TEXT"
      /* BLOCK_TEXT */
    ].TEXT_BLOCK_BACKGROUND_COLOR;
  }
};
var TextColorBuiltInControl = class extends TextBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes.GENERAL.TEXT_COLOR;
  }
};
var TextFixedHeightBuiltInControl = class extends TextBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_TEXT"
      /* BLOCK_TEXT */
    ].FIXED_HEIGHT;
  }
  getLabels() {
    return void 0;
  }
};
var TextFontFamilyBuiltInControl = class extends TextBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_TEXT"
      /* BLOCK_TEXT */
    ].FONT_FAMILY;
  }
};
var TextLineSpacingBuiltInControl = class extends TextBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes.GENERAL.TEXT_LINE_SPACING;
  }
};
var TextPaddingsBuiltInControl = class extends TextBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes[
      "BLOCK_TEXT"
      /* BLOCK_TEXT */
    ].INTERNAL_INDENTS;
  }
};
var TextSizeBuiltInControl = class extends TextBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes.GENERAL.TEXT_SIZE;
  }
};
var TextStyleBuiltInControl = class extends TextBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes.GENERAL.TEXT_STYLE;
  }
};
var TextVisibilityBuiltInControl = class extends TextBuiltInControl {
  getParentControlId() {
    return BuiltInControlTypes.GENERAL.HIDDEN_NODE;
  }
};
var Extension = class {
  constructor(options) {
    this.uiElements = [];
    this.controls = [];
    this.contextActions = [];
    this.blocks = [];
    this.generalPanelTabs = [];
    this.modulesPanelTabs = [];
    this.i18n = options?.i18n;
    this.styles = options?.styles;
    this.previewStyles = options?.previewStyles;
    this.uiElements = options?.uiElements ?? [];
    this.uiElementTagRegistry = options?.uiElementTagRegistry;
    this.controls = options?.controls ?? [];
    this.settingsPanelRegistry = options?.settingsPanelRegistry;
    this.contextActions = options?.contextActions ?? [];
    this.blocks = options?.blocks ?? [];
    this.generalPanelTabs = options?.generalPanelTabs ?? [];
    this.modulesPanelTabs = options?.modulesPanelTabs ?? [];
    this.externalSmartElementsLibrary = options?.externalSmartElementsLibrary;
    this.externalImageLibrary = options?.externalImageLibrary;
    this.externalImageLibraryTab = options?.externalImageLibraryTab;
    this.externalMergeTagsLibrary = options?.externalMergeTagsLibrary;
    this.externalAiAssistant = options?.externalAiAssistant;
    this.externalDisplayConditionsLibrary = options?.externalDisplayConditionsLibrary;
    this.externalVideoLibrary = options?.externalVideoLibrary;
    this.blocksPanel = options?.blocksPanel;
    this.iconsRegistry = options?.iconsRegistry;
    this.id = Math.random().toString(36).substring(2);
  }
  getI18n() {
    return this.i18n;
  }
  getStyles() {
    return this.styles;
  }
  getPreviewStyles() {
    return this.previewStyles;
  }
  getUiElements() {
    return this.uiElements;
  }
  getUiElementTagRegistry() {
    return this.uiElementTagRegistry;
  }
  getControls() {
    return this.controls;
  }
  getSettingsPanelRegistry() {
    return this.settingsPanelRegistry;
  }
  getContextActions() {
    return this.contextActions;
  }
  getBlocks() {
    return this.blocks;
  }
  getId() {
    return this.id;
  }
  getExternalSmartElementsLibrary() {
    return this.externalSmartElementsLibrary;
  }
  getExternalImageLibrary() {
    return this.externalImageLibrary;
  }
  getExternalImageLibraryTab() {
    return this.externalImageLibraryTab;
  }
  getExternalMergeTagsLibrary() {
    return this.externalMergeTagsLibrary;
  }
  getExternalAiAssistant() {
    return this.externalAiAssistant;
  }
  getExternalDisplayConditionsLibrary() {
    return this.externalDisplayConditionsLibrary;
  }
  getExternalVideoLibrary() {
    return this.externalVideoLibrary;
  }
  getBlocksPanel() {
    return this.blocksPanel;
  }
  getIconsRegistry() {
    return this.iconsRegistry;
  }
  getGeneralPanelTabs() {
    return this.generalPanelTabs;
  }
  getModulesPanelTabs() {
    return this.modulesPanelTabs;
  }
};
var ExtensionBuilder = class {
  constructor() {
    this.styles = [];
    this.uiElements = [];
    this.controls = [];
    this.contextActions = [];
    this.blocks = [];
    this.generalPanelTabs = [];
    this.modulesPanelTabs = [];
  }
  withLocalization(i18n) {
    this.i18n = i18n;
    return this;
  }
  /**
   * @deprecated Use addStyles() instead. This method will be removed in a future version.
   */
  withStyles(styles) {
    this.styles = [styles];
    return this;
  }
  addStyles(styles) {
    this.styles.push(styles);
    return this;
  }
  /**
   * @description defines custom developer styles to use inside the editor document preview
   */
  withPreviewStyles(styles) {
    this.previewStyles = styles;
    return this;
  }
  addContextAction(contextAction) {
    this.contextActions.push(contextAction);
    return this;
  }
  addUiElement(uiElement) {
    this.uiElements.push(uiElement);
    return this;
  }
  withUiElementTagRegistry(uiElementTagRegistry) {
    this.uiElementTagRegistry = uiElementTagRegistry;
    return this;
  }
  addControl(control) {
    this.controls.push(control);
    return this;
  }
  withSettingsPanelRegistry(settingsPanelRegistry) {
    this.settingsPanelRegistry = settingsPanelRegistry;
    return this;
  }
  withExternalSmartElementsLibrary(externalSmartElementsLibrary) {
    this.externalSmartElementsLibrary = externalSmartElementsLibrary;
    return this;
  }
  withExternalImageLibrary(externalImageLibrary) {
    this.externalImageLibrary = externalImageLibrary;
    return this;
  }
  withExternalImageLibraryTab(externalImageLibraryTab) {
    this.externalImageLibraryTab = externalImageLibraryTab;
    return this;
  }
  withExternalMergeTagsLibrary(externalMergeTagsLibrary) {
    this.externalMergeTagsLibrary = externalMergeTagsLibrary;
    return this;
  }
  withExternalAiAssistant(externalAiAssistant) {
    this.externalAiAssistant = externalAiAssistant;
    return this;
  }
  withExternalDisplayCondition(externalDisplayCondition) {
    this.externalDisplayConditionsLibrary = externalDisplayCondition;
    return this;
  }
  withExternalVideosLibrary(externalVideoLibrary) {
    this.externalVideoLibrary = externalVideoLibrary;
    return this;
  }
  withBlocksPanel(blocksPanel) {
    this.blocksPanel = blocksPanel;
    return this;
  }
  addBlock(block) {
    this.blocks.push(block);
    return this;
  }
  withIconsRegistry(iconsRegistry) {
    this.iconsRegistry = iconsRegistry;
    return this;
  }
  addGeneralPanelTab(tab) {
    this.generalPanelTabs.push(tab);
    return this;
  }
  addModulesPanelTab(tab) {
    this.modulesPanelTabs.push(tab);
    return this;
  }
  build() {
    return new Extension({
      i18n: this.i18n,
      styles: this.styles.map((style) => style.trim()).join("\n"),
      uiElements: this.uiElements,
      uiElementTagRegistry: this.uiElementTagRegistry,
      controls: this.controls,
      settingsPanelRegistry: this.settingsPanelRegistry,
      contextActions: this.contextActions,
      blocks: this.blocks,
      externalSmartElementsLibrary: this.externalSmartElementsLibrary,
      externalImageLibrary: this.externalImageLibrary,
      previewStyles: this.previewStyles,
      externalAiAssistant: this.externalAiAssistant,
      externalDisplayConditionsLibrary: this.externalDisplayConditionsLibrary,
      externalVideoLibrary: this.externalVideoLibrary,
      blocksPanel: this.blocksPanel,
      iconsRegistry: this.iconsRegistry,
      externalImageLibraryTab: this.externalImageLibraryTab,
      externalMergeTagsLibrary: this.externalMergeTagsLibrary,
      generalPanelTabs: this.generalPanelTabs,
      modulesPanelTabs: this.modulesPanelTabs
    });
  }
};
var _ExternalAiAssistant = class _ExternalAiAssistant2 extends BaseValidatedClass {
  constructor() {
    super(_ExternalAiAssistant2.REQUIRED_METHODS, _ExternalAiAssistant2);
  }
  openAiAssistant(_options) {
    throw new Error("Method openAiAssistant() must be implemented by the subclass");
  }
};
_ExternalAiAssistant.REQUIRED_METHODS = ["openAiAssistant"];
var ExternalAiAssistant = _ExternalAiAssistant;
var _ExternalDisplayConditionsLibrary = class _ExternalDisplayConditionsLibrary2 extends BaseValidatedClass {
  constructor() {
    super(_ExternalDisplayConditionsLibrary2.REQUIRED_METHODS, _ExternalDisplayConditionsLibrary2);
  }
  /**
   * Retrieves the name of the category.
   *
   * @return {string} The name of the category.
   */
  getCategoryName() {
    throw new Error("Method getCategoryName() must be implemented by the subclass");
  }
  /**
   * Opens a popup dialog for creating or updating a display condition.
   *
   * @param {DisplayCondition} _currentCondition - The currently selected display condition to edit.
   * @param {ExternalDisplayConditionSelectedCB} _successCallback - Callback executed with the updated or newly created condition upon success.
   * @param {() => void} _cancelCallback - Callback executed when the dialog is closed without making changes.
   */
  openExternalDisplayConditionsDialog(_currentCondition, _successCallback, _cancelCallback) {
    throw new Error("Method openExternalDisplayConditionsDialog() must be implemented by the subclass");
  }
  /**
   * Determines if the context action associated with this library is enabled.
   *
   * @returns {boolean} `true` if the context action is enabled, otherwise `false`.
   */
  getIsContextActionEnabled() {
    throw new Error("Method getIsContextActionEnabled() must be implemented by the subclass");
  }
  /**
   * Retrieves the index of the context action associated with this library.
   * The index represents the position/order of the action in the UI.
   *
   * @returns {number} The index of the context action.
   */
  getContextActionIndex() {
    throw new Error("Method getContextActionIndex() must be implemented by the subclass");
  }
};
_ExternalDisplayConditionsLibrary.REQUIRED_METHODS = ["getCategoryName", "openExternalDisplayConditionsDialog"];
var ExternalDisplayConditionsLibrary = _ExternalDisplayConditionsLibrary;
var _ExternalImageLibrary = class _ExternalImageLibrary2 extends BaseValidatedClass {
  constructor() {
    super(_ExternalImageLibrary2.REQUIRED_METHODS, _ExternalImageLibrary2);
  }
  openImageLibrary(_currentImageUrl, _onImageSelectCallback, _onCancelCallback) {
    throw new Error("Method openImageLibrary() must be implemented by the subclass");
  }
};
_ExternalImageLibrary.REQUIRED_METHODS = ["openImageLibrary"];
var ExternalImageLibrary = _ExternalImageLibrary;
var _ExternalImageLibraryTab = class _ExternalImageLibraryTab2 extends BaseValidatedClass {
  constructor() {
    super(_ExternalImageLibraryTab2.REQUIRED_METHODS, _ExternalImageLibraryTab2);
  }
  /**
   * @description Returns the translated name/label for the tab
   * @returns Translation key or text to display as tab label
   */
  getName() {
    throw new Error("Method getName() must be implemented by the subclass");
  }
  /**
   * @description Opens the external image library tab and provides a container for rendering
   * @param _container - DOM element container where the external library UI should be rendered
   * @param _onImageSelectCallback - Callback to invoke when an image is selected
   * @param _selectedNode - (Optional) Selected node for which the gallery is being opened
   */
  openImageLibraryTab(_container, _onImageSelectCallback, _selectedNode) {
    throw new Error("Method openImageLibraryTab() must be implemented by the subclass");
  }
};
_ExternalImageLibraryTab.REQUIRED_METHODS = ["getName", "openImageLibraryTab"];
var ExternalImageLibraryTab = _ExternalImageLibraryTab;
var _ExternalMergeTagsLibrary = class _ExternalMergeTagsLibrary2 extends BaseValidatedClass {
  constructor() {
    super(_ExternalMergeTagsLibrary2.REQUIRED_METHODS, _ExternalMergeTagsLibrary2);
  }
  openMergeTagsLibrary(_currentValue, _onSelectCallback, _onCancelCallback, _context) {
    throw new Error("Method openMergeTagsLibrary() must be implemented by the subclass");
  }
};
_ExternalMergeTagsLibrary.REQUIRED_METHODS = ["openMergeTagsLibrary"];
var ExternalMergeTagsLibrary = _ExternalMergeTagsLibrary;
var _ExternalSmartElementsLibrary = class _ExternalSmartElementsLibrary2 extends BaseValidatedClass {
  constructor() {
    super(_ExternalSmartElementsLibrary2.REQUIRED_METHODS, _ExternalSmartElementsLibrary2);
  }
  openSmartElementsLibrary(_onDataSelectCallback, _onCancelCallback) {
    throw new Error("Method openSmartElementsLibrary() must be implemented by the subclass");
  }
};
_ExternalSmartElementsLibrary.REQUIRED_METHODS = ["openSmartElementsLibrary"];
var ExternalSmartElementsLibrary = _ExternalSmartElementsLibrary;
var _ExternalVideosLibrary = class _ExternalVideosLibrary2 extends BaseValidatedClass {
  constructor() {
    super(_ExternalVideosLibrary2.REQUIRED_METHODS, _ExternalVideosLibrary2);
  }
  openExternalVideosLibraryDialog(_currentValue, _successCallback, _cancelCallback) {
    throw new Error("Method openExternalVideosLibraryDialog() must be implemented by the subclass");
  }
};
_ExternalVideosLibrary.REQUIRED_METHODS = ["openExternalVideosLibraryDialog"];
var ExternalVideosLibrary = _ExternalVideosLibrary;
var _IconsRegistry = class _IconsRegistry2 extends BaseValidatedClass {
  constructor() {
    super(_IconsRegistry2.REQUIRED_METHODS, _IconsRegistry2);
  }
  registerIconsSvg(_iconsMap) {
    throw new Error("Method registerIconsSvg() must be implemented by the subclass");
  }
};
_IconsRegistry.REQUIRED_METHODS = ["registerIconsSvg"];
var IconsRegistry = _IconsRegistry;
var ModificationDescription = class {
  constructor(key) {
    this.hidden = false;
    this.key = key;
  }
  withParams(params) {
    this.params = params;
    return this;
  }
  /**
   * Marks the modification as a background change.
   *
   * @description
   * The modification is applied to the template as usual, but the patch it produces is kept out of
   * the version history UI and out of undo/redo, so the user never sees (nor can accidentally undo)
   * a change they did not make. The change still belongs to the document, so restoring an older
   * version keeps it consistent with the rest of the template.
   *
   * The patch is saved like any other, but the host application is not notified about it: the
   * `onDataChanged` callback stays silent for background modifications. Do not rely on it to track
   * changes an extension makes this way.
   *
   * @summary Hides the modification from version history and undo/redo.
   *
   * @param hidden - Pass false to keep the modification visible. Defaults to true.
   * @returns The current ModificationDescription instance for method chaining.
   */
  asHidden(hidden = true) {
    this.hidden = hidden;
    return this;
  }
  /**
   * Tells whether the modification was marked as a background change via {@link asHidden}.
   *
   * @returns True when the produced patch must stay out of version history and undo/redo.
   */
  isHidden() {
    return this.hidden;
  }
  getValue() {
    return {
      key: this.key,
      params: this.params
    };
  }
};
var _UIElement = class _UIElement2 extends BaseValidatedClass {
  constructor() {
    super(_UIElement2.REQUIRED_METHODS, _UIElement2);
  }
  /**
   * Called when the UI element should render its content into the provided container.
   * @param container - The HTMLElement where the UI element should be rendered.
   */
  onRender(_container) {
    throw new Error("Method onRender() must be implemented by the subclass");
  }
  /**
   * Optional cleanup hook called when the UI element is being destroyed.
   * Use this to remove event listeners or perform other cleanup tasks.
   */
  onDestroy() {
  }
  /**
   * Optional method to get the current value of the UI element.
   * Implement this if the element manages a state or value (e.g., input fields).
   * @returns The current value of the element.
   */
  getValue() {
  }
  /**
   * Optional method to set the value of the UI element.
   * Implement this if the element manages a state or value and needs to be updated externally.
   * @param value - The new value to set.
   */
  setValue(_value) {
  }
  /**
   * @description Optional hook called when one of the element's supported attributes ({@link UEAttr}) gets updated externally.
   * Implement this to react to attribute changes (e.g., visibility, disabled state).
   * @param name - The name of the attribute that was updated.
   * @param value - The new value of the attribute.
   */
  onAttributeUpdated(_name, _value) {
  }
  /**
   * Gets the unique identifier for this UI element type.
   * This ID is used for registration and referencing within controls.
   * @returns A unique string ID.
   */
  getId() {
    throw new Error("Method getId() must be implemented by the subclass");
  }
  /**
   * Gets the HTML template string that defines the structure of this UI element.
   * @returns An HTML string.
   */
  getTemplate() {
    throw new Error("Method getTemplate() must be implemented by the subclass");
  }
};
_UIElement.REQUIRED_METHODS = ["onRender", "getId", "getTemplate"];
var UIElement = _UIElement;
var _UIElementTagRegistry = class _UIElementTagRegistry2 extends BaseValidatedClass {
  constructor() {
    super(_UIElementTagRegistry2.REQUIRED_METHODS, _UIElementTagRegistry2);
  }
  registerUiElements(_uiElementsTagsMap) {
    throw new Error("Method registerUiElements() must be implemented by the subclass");
  }
};
_UIElementTagRegistry.REQUIRED_METHODS = ["registerUiElements"];
var UIElementTagRegistry = _UIElementTagRegistry;

export {
  BlockCompositionType,
  Block,
  BlockRenderer,
  BlocksPanel,
  ContextAction,
  ADD_CUSTOM_FONT_OPTION,
  AiAssistantValueType,
  BlockAttr,
  BlockName,
  BlockSelector,
  BlockType,
  GeneralControls,
  BannerControls,
  BannerChildControls,
  ButtonControls,
  TextControls,
  AmpFormControls,
  VideoControls,
  TimerControls,
  SpacerControls,
  ImageControls,
  HTMLControls,
  CustomLinkControls,
  CustomImageControls,
  CustomTextControls,
  SocialControls,
  MenuControls,
  AccordionControls,
  CarouselControls,
  StripeControls,
  StructureControls,
  ContainerControls,
  MessageSettingsControls,
  GeneralStylesControls,
  BuiltInControlTypes,
  ContextActionType,
  EditorStatePropertyType,
  ElementLockCategory,
  OrderableItemIconPosition,
  PanelPosition,
  PopoverSide,
  ExtensionPopoverType,
  PreviewDeviceMode,
  SettingsTab,
  ThemeMode,
  UEAttr,
  UIElementType,
  BuiltInControl,
  ButtonBorderRadiusBuiltInControl,
  ButtonAlignBuiltInControl,
  ButtonBackgroundColorBuiltInControl,
  ButtonBlockBackgroundColorBuiltInControl,
  ButtonBorderBuiltInControl,
  ButtonColorBuiltInControl,
  ButtonFitToContainerBuiltInControl,
  ButtonFixedHeightBuiltInControl,
  ButtonFontFamilyBuiltInControl,
  ButtonHoverBorderColorBuiltInControl,
  ButtonHoverColorBuiltInControl,
  ButtonHoverTextColorBuiltInControl,
  ButtonMarginsBuiltInControl,
  ButtonPaddingsBuiltInControl,
  ButtonTextBuiltInControl,
  ButtonTextSizeBuiltInControl,
  ButtonTextStyleAndFontColorBuiltInControl,
  ButtonVisibilityBuiltInControl,
  ContainerBackgroundColorBuiltInControl,
  ContainerBackgroundImageBuiltInControl,
  ContainerBorderBuiltInControl,
  ContainerBorderRadiusBuiltInControl,
  ContainerVisibilityBuiltInControl,
  Control,
  GeneralPanelTab,
  ImageAlignmentBuiltInControl,
  ImageMarginsBuiltInControl,
  ImageSizeBuiltInControl,
  ImageVisibilityBuiltInControl,
  ModulesPanelTab,
  SettingsPanelRegistry,
  SettingsPanelTab,
  SpacerBackgroundColorBuiltInControl,
  SpacerMarginsBuiltInControl,
  StructureAdaptBuiltInControl,
  StructureBackgroundColorBuiltInControl,
  StructureBackgroundImageBuiltInControl,
  StructureBorderBuiltInControl,
  StructureMarginsBuiltInControl,
  StructurePaddingsBuiltInControl,
  StructureVisibilityBuiltInControl,
  TextAlignBuiltInControl,
  TextBlockBackgroundBuiltInControl,
  TextColorBuiltInControl,
  TextFixedHeightBuiltInControl,
  TextFontFamilyBuiltInControl,
  TextLineSpacingBuiltInControl,
  TextPaddingsBuiltInControl,
  TextSizeBuiltInControl,
  TextStyleBuiltInControl,
  TextVisibilityBuiltInControl,
  Extension,
  ExtensionBuilder,
  ExternalAiAssistant,
  ExternalDisplayConditionsLibrary,
  ExternalImageLibrary,
  ExternalImageLibraryTab,
  ExternalMergeTagsLibrary,
  ExternalSmartElementsLibrary,
  ExternalVideosLibrary,
  IconsRegistry,
  ModificationDescription,
  UIElement,
  UIElementTagRegistry
};

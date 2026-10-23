import {
  MasterCssVar
} from "./ue-proto-87c1854705b4.mjs";

// editor/ui-editor-ui/src/app/constants/theme-variable-descriptors.ts
var background = (semanticOwner, selector, settingsPath, semanticBinding, light, dark, options) => ({
  semanticOwner,
  semanticBinding,
  replayAfterOwner: options?.replayAfterOwner,
  valueKind: "background",
  settings: {
    path: settingsPath,
    legacyPath: settingsPath,
    allowTransparent: true,
    legacyFallbackOwner: options?.legacyFallbackOwner,
    legacyFallbackTransform: options?.legacyFallbackTransform,
    legacyFallbackContextOwner: options?.legacyFallbackContextOwner
  },
  variables: { light, dark },
  cssTarget: { selector, additionalSelectors: options?.additionalSelectors },
  displayPolicy: options?.displayPolicy,
  backgroundPolicy: "replace-light-gradient-preserve-image",
  effectiveInlineImage: options?.effectiveInlineImage
});
var color = (semanticOwner, selector, settingsPath, semanticBinding, light, dark, property = "color", displayPolicy, options) => ({
  semanticOwner,
  semanticBinding,
  replayAfterOwner: options?.replayAfterOwner,
  valueKind: property.startsWith("border-") ? "border-color" : "color",
  settings: {
    path: settingsPath,
    legacyPath: options?.legacyPath ?? settingsPath,
    allowTransparent: options?.allowTransparent ?? property.startsWith("border-"),
    legacyFallbackOwner: options?.legacyFallbackOwner,
    legacyFallbackTransform: options?.legacyFallbackTransform,
    legacyFallbackContextOwner: options?.legacyFallbackContextOwner
  },
  variables: { light, dark },
  cssTarget: { selector, property },
  displayPolicy
});
var BUTTON_SELECTORS = "a.es-button, button.es-button, label.es-button, .es-button-border";
var BUTTON_HOVER_INNER_SELECTORS = [
  ".es-button-border:hover a.es-button",
  ".es-button-border:hover button.es-button",
  ".es-button-border:hover label.es-button"
].join(",");
var BUTTON_HOVER_DISPLAY_POLICY = {
  variable: MasterCssVar.BUTTON_HAS_HOVER,
  settingsActivation: "button-hover-styles"
};
var CUSTOM_LIST_STYLES_DISPLAY_POLICY = {
  variable: MasterCssVar.CUSTOM_LISTS_STYLES,
  settingsActivation: "custom-list-styles"
};
var THEME_VARIABLE_DESCRIPTORS = [
  background("general.background", ".es-wrapper-color", ["backgroundColor"], { kind: "general", setting: "background" }, {
    solid: MasterCssVar.WRAPPER_BACKGROUND_COLOR,
    gradient: MasterCssVar.WRAPPER_BACKGROUND_GRADIENT
  }, {
    solid: MasterCssVar.DARK_WRAPPER_BACKGROUND_COLOR,
    gradient: MasterCssVar.DARK_WRAPPER_BACKGROUND_GRADIENT
  }),
  color(
    "general.list.marker",
    "ul li::marker",
    ["customListStyles", "listMarkerColor"],
    { kind: "general", setting: "list-marker" },
    MasterCssVar.LIST_MARKER_COLOR,
    MasterCssVar.DARK_LIST_MARKER_COLOR,
    "color",
    CUSTOM_LIST_STYLES_DISPLAY_POLICY,
    {
      allowTransparent: true,
      legacyFallbackOwner: "stripes.content.font",
      replayAfterOwner: "stripes.content.font"
    }
  ),
  color(
    "general.list.number-marker",
    "ol li::marker",
    ["customListStyles", "listNumberMarkerColor"],
    { kind: "general", setting: "list-number-marker" },
    MasterCssVar.LIST_NUMBER_MARKER_COLOR,
    MasterCssVar.DARK_LIST_NUMBER_MARKER_COLOR,
    "color",
    CUSTOM_LIST_STYLES_DISPLAY_POLICY,
    {
      allowTransparent: true,
      legacyFallbackOwner: "stripes.content.font",
      replayAfterOwner: "stripes.content.font"
    }
  ),
  background(
    "stripes.header.background",
    ".es-header, .esd-header-popover:not(.es-content)",
    ["header", "stripeBackgroundColor"],
    { kind: "stripe", section: "header", setting: "background" },
    {
      solid: MasterCssVar.HEADER_BACKGROUND_COLOR,
      gradient: MasterCssVar.HEADER_BACKGROUND_GRADIENT,
      image: MasterCssVar.HEADER_BACKGROUND_IMAGE
    },
    {
      solid: MasterCssVar.DARK_HEADER_BACKGROUND_COLOR,
      gradient: MasterCssVar.DARK_HEADER_BACKGROUND_GRADIENT
    }
  ),
  background(
    "stripes.header.content-background",
    ".es-header-body",
    ["header", "contentBackgroundColor"],
    { kind: "stripe", section: "header", setting: "content-background" },
    {
      solid: MasterCssVar.HEADER_CONTENT_BACKGROUND_COLOR,
      gradient: MasterCssVar.HEADER_CONTENT_BACKGROUND_GRADIENT
    },
    {
      solid: MasterCssVar.DARK_HEADER_CONTENT_BACKGROUND_COLOR,
      gradient: MasterCssVar.DARK_HEADER_CONTENT_BACKGROUND_GRADIENT
    },
    {
      effectiveInlineImage: {
        className: "es-header-body",
        darkLayerProperty: "--ue-dark-general-header-content-background-layer",
        darkLayerResetProperty: "--ue-dark-general-header-content-background-layer-reset"
      }
    }
  ),
  color(
    "stripes.header.font",
    ".es-header-body p, .es-header-body ul li, .es-header-body ol li",
    ["header", "fontColor"],
    { kind: "stripe", section: "header", setting: "font" },
    MasterCssVar.HEADER_FONT_COLOR,
    MasterCssVar.DARK_HEADER_FONT_COLOR
  ),
  color("stripes.header.link", ".es-header-body a", ["header", "linkColor"], { kind: "stripe", section: "header", setting: "link" }, MasterCssVar.HEADER_LINK_COLOR, MasterCssVar.DARK_HEADER_LINK_COLOR),
  color(
    "stripes.header.link-hover",
    ".es-header-body a:hover",
    ["header", "linkColorHover"],
    { kind: "stripe", section: "header", setting: "link-hover" },
    MasterCssVar.HEADER_LINK_COLOR_HOVER,
    MasterCssVar.DARK_HEADER_LINK_COLOR_HOVER,
    "color",
    void 0,
    {
      legacyPath: ["header", "linkColorHover", "value"],
      legacyFallbackOwner: "stripes.header.link",
      replayAfterOwner: "stripes.header.link"
    }
  ),
  background(
    "stripes.content.background",
    ".es-content-body",
    ["content", "contentBackgroundColor"],
    { kind: "stripe", section: "content", setting: "content-background" },
    {
      solid: MasterCssVar.CONTENT_BACKGROUND_COLOR,
      gradient: MasterCssVar.CONTENT_BACKGROUND_GRADIENT
    },
    {
      solid: MasterCssVar.DARK_CONTENT_BACKGROUND_COLOR,
      gradient: MasterCssVar.DARK_CONTENT_BACKGROUND_GRADIENT
    },
    {
      effectiveInlineImage: {
        className: "es-content-body",
        darkLayerProperty: "--ue-dark-general-content-background-layer",
        darkLayerResetProperty: "--ue-dark-general-content-background-layer-reset"
      }
    }
  ),
  color(
    "stripes.content.font",
    ".es-content-body p, .es-content-body ul li, .es-content-body ol li",
    ["content", "fontColor"],
    { kind: "stripe", section: "content", setting: "font" },
    MasterCssVar.CONTENT_FONT_COLOR,
    MasterCssVar.DARK_CONTENT_FONT_COLOR
  ),
  color("stripes.content.link", ".es-content-body a", ["content", "linkColor"], { kind: "stripe", section: "content", setting: "link" }, MasterCssVar.CONTENT_LINK_COLOR, MasterCssVar.DARK_CONTENT_LINK_COLOR),
  color(
    "stripes.content.link-hover",
    ".es-content-body a:hover",
    ["content", "linkColorHover"],
    { kind: "stripe", section: "content", setting: "link-hover" },
    MasterCssVar.CONTENT_LINK_COLOR_HOVER,
    MasterCssVar.DARK_CONTENT_LINK_COLOR_HOVER,
    "color",
    void 0,
    {
      legacyPath: ["content", "linkColorHover", "value"],
      legacyFallbackOwner: "stripes.content.link",
      replayAfterOwner: "stripes.content.link"
    }
  ),
  background(
    "stripes.footer.background",
    ".es-footer, .esd-footer-popover:not(.es-content)",
    ["footer", "stripeBackgroundColor"],
    { kind: "stripe", section: "footer", setting: "background" },
    {
      solid: MasterCssVar.FOOTER_BACKGROUND_COLOR,
      gradient: MasterCssVar.FOOTER_BACKGROUND_GRADIENT,
      image: MasterCssVar.FOOTER_BACKGROUND_IMAGE
    },
    {
      solid: MasterCssVar.DARK_FOOTER_BACKGROUND_COLOR,
      gradient: MasterCssVar.DARK_FOOTER_BACKGROUND_GRADIENT
    }
  ),
  background(
    "stripes.footer.content-background",
    ".es-footer-body",
    ["footer", "contentBackgroundColor"],
    { kind: "stripe", section: "footer", setting: "content-background" },
    {
      solid: MasterCssVar.FOOTER_CONTENT_BACKGROUND_COLOR,
      gradient: MasterCssVar.FOOTER_CONTENT_BACKGROUND_GRADIENT
    },
    {
      solid: MasterCssVar.DARK_FOOTER_CONTENT_BACKGROUND_COLOR,
      gradient: MasterCssVar.DARK_FOOTER_CONTENT_BACKGROUND_GRADIENT
    },
    {
      effectiveInlineImage: {
        className: "es-footer-body",
        darkLayerProperty: "--ue-dark-general-footer-content-background-layer",
        darkLayerResetProperty: "--ue-dark-general-footer-content-background-layer-reset"
      }
    }
  ),
  color(
    "stripes.footer.font",
    ".es-footer-body p, .es-footer-body ul li, .es-footer-body ol li",
    ["footer", "fontColor"],
    { kind: "stripe", section: "footer", setting: "font" },
    MasterCssVar.FOOTER_FONT_COLOR,
    MasterCssVar.DARK_FOOTER_FONT_COLOR
  ),
  color("stripes.footer.link", ".es-footer-body a", ["footer", "linkColor"], { kind: "stripe", section: "footer", setting: "link" }, MasterCssVar.FOOTER_LINK_COLOR, MasterCssVar.DARK_FOOTER_LINK_COLOR),
  color(
    "stripes.footer.link-hover",
    ".es-footer-body a:hover",
    ["footer", "linkColorHover"],
    { kind: "stripe", section: "footer", setting: "link-hover" },
    MasterCssVar.FOOTER_LINK_COLOR_HOVER,
    MasterCssVar.DARK_FOOTER_LINK_COLOR_HOVER,
    "color",
    void 0,
    {
      legacyPath: ["footer", "linkColorHover", "value"],
      legacyFallbackOwner: "stripes.footer.link",
      replayAfterOwner: "stripes.footer.link"
    }
  ),
  color(
    "stripes.info.font",
    ".es-infoblock, .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li",
    ["infoArea", "fontColor"],
    { kind: "stripe", section: "infoArea", setting: "font" },
    MasterCssVar.INFO_FONT_COLOR,
    MasterCssVar.DARK_INFO_FONT_COLOR
  ),
  color("stripes.info.link", ".es-infoblock a", ["infoArea", "linkColor"], { kind: "stripe", section: "infoArea", setting: "link" }, MasterCssVar.INFO_LINK_COLOR, MasterCssVar.DARK_INFO_LINK_COLOR),
  color(
    "stripes.info.link-hover",
    ".es-infoblock a:hover",
    ["infoArea", "linkColorHover"],
    { kind: "stripe", section: "infoArea", setting: "link-hover" },
    MasterCssVar.INFO_LINK_COLOR_HOVER,
    MasterCssVar.DARK_INFO_LINK_COLOR_HOVER,
    "color",
    void 0,
    {
      legacyPath: ["infoArea", "linkColorHover", "value"],
      legacyFallbackOwner: "stripes.info.link",
      replayAfterOwner: "stripes.info.link"
    }
  ),
  ...[
    ["headings.h1.font", "h1", MasterCssVar.H1_FONT_COLOR, MasterCssVar.DARK_H1_FONT_COLOR],
    ["headings.h2.font", "h2", MasterCssVar.H2_FONT_COLOR, MasterCssVar.DARK_H2_FONT_COLOR],
    ["headings.h3.font", "h3", MasterCssVar.H3_FONT_COLOR, MasterCssVar.DARK_H3_FONT_COLOR],
    ["headings.h4.font", "h4", MasterCssVar.H4_FONT_COLOR, MasterCssVar.DARK_H4_FONT_COLOR],
    ["headings.h5.font", "h5", MasterCssVar.H5_FONT_COLOR, MasterCssVar.DARK_H5_FONT_COLOR],
    ["headings.h6.font", "h6", MasterCssVar.H6_FONT_COLOR, MasterCssVar.DARK_H6_FONT_COLOR]
  ].map(([owner, selector, light, dark]) => color(
    owner,
    selector,
    [owner.split(".")[1], "fontColor"],
    { kind: "heading-font", heading: owner.split(".")[1] },
    light,
    dark
  )),
  background("buttons.background", BUTTON_SELECTORS, ["buttonColor"], { kind: "button", setting: "background" }, {
    solid: MasterCssVar.BUTTON_COLOR_GRADIENT_SOLID,
    gradient: MasterCssVar.BUTTON_COLOR
  }, {
    solid: MasterCssVar.DARK_BUTTON_COLOR,
    gradient: MasterCssVar.DARK_BUTTON_COLOR_GRADIENT
  }),
  color("buttons.text", "a.es-button, button.es-button, label.es-button", ["fontColor"], { kind: "button", setting: "font" }, MasterCssVar.BUTTON_TEXT_COLOR, MasterCssVar.DARK_BUTTON_TEXT_COLOR),
  background(
    "buttons.hover.background",
    ".es-button-border:hover",
    ["hoverButtonStyles", "backgroundColor"],
    { kind: "button-hover", setting: "background" },
    {
      solid: MasterCssVar.BUTTON_COLOR_HOVER_GRADIENT_SOLID,
      gradient: MasterCssVar.BUTTON_COLOR_HOVER
    },
    {
      solid: MasterCssVar.DARK_BUTTON_COLOR_HOVER,
      gradient: MasterCssVar.DARK_BUTTON_COLOR_HOVER_GRADIENT
    },
    {
      additionalSelectors: [BUTTON_HOVER_INNER_SELECTORS],
      displayPolicy: BUTTON_HOVER_DISPLAY_POLICY,
      legacyFallbackOwner: "buttons.background",
      legacyFallbackTransform: "button-hover-color",
      replayAfterOwner: "buttons.background"
    }
  ),
  color(
    "buttons.hover.text",
    BUTTON_HOVER_INNER_SELECTORS,
    ["hoverButtonStyles", "fontColor"],
    { kind: "button-hover", setting: "font" },
    MasterCssVar.BUTTON_TEXT_COLOR_HOVER,
    MasterCssVar.DARK_BUTTON_TEXT_COLOR_HOVER,
    "color",
    BUTTON_HOVER_DISPLAY_POLICY,
    {
      legacyFallbackOwner: "buttons.text",
      legacyFallbackTransform: "button-hover-font-contrast",
      legacyFallbackContextOwner: "buttons.hover.background",
      replayAfterOwner: "buttons.text"
    }
  ),
  ...[
    ["buttons.border.top", "border-top-color", MasterCssVar.BUTTON_BORDER_COLOR_TOP, MasterCssVar.DARK_BUTTON_BORDER_COLOR_TOP],
    ["buttons.border.right", "border-right-color", MasterCssVar.BUTTON_BORDER_COLOR_RIGHT, MasterCssVar.DARK_BUTTON_BORDER_COLOR_RIGHT],
    ["buttons.border.bottom", "border-bottom-color", MasterCssVar.BUTTON_BORDER_COLOR_BOTTOM, MasterCssVar.DARK_BUTTON_BORDER_COLOR_BOTTOM],
    ["buttons.border.left", "border-left-color", MasterCssVar.BUTTON_BORDER_COLOR_LEFT, MasterCssVar.DARK_BUTTON_BORDER_COLOR_LEFT]
  ].map(([owner, property, light, dark]) => {
    const side = owner.split(".")[2];
    return color(
      owner,
      ".es-button-border",
      ["borderColor", side],
      { kind: "button-border", side },
      light,
      dark,
      property,
      void 0,
      {
        legacyPath: ["border", side, "color"]
      }
    );
  }),
  ...[
    ["buttons.hover.border.top", "border-top-color", MasterCssVar.BUTTON_BORDER_COLOR_TOP_HOVER, MasterCssVar.DARK_BUTTON_BORDER_COLOR_TOP_HOVER],
    ["buttons.hover.border.right", "border-right-color", MasterCssVar.BUTTON_BORDER_COLOR_RIGHT_HOVER, MasterCssVar.DARK_BUTTON_BORDER_COLOR_RIGHT_HOVER],
    ["buttons.hover.border.bottom", "border-bottom-color", MasterCssVar.BUTTON_BORDER_COLOR_BOTTOM_HOVER, MasterCssVar.DARK_BUTTON_BORDER_COLOR_BOTTOM_HOVER],
    ["buttons.hover.border.left", "border-left-color", MasterCssVar.BUTTON_BORDER_COLOR_LEFT_HOVER, MasterCssVar.DARK_BUTTON_BORDER_COLOR_LEFT_HOVER]
  ].map(([owner, property, light, dark]) => color(
    owner,
    ".es-button-border:hover",
    ["hoverButtonStyles", "borderColor", owner.split(".")[3]],
    { kind: "button-hover-border", side: owner.split(".")[3] },
    light,
    dark,
    property,
    BUTTON_HOVER_DISPLAY_POLICY,
    {
      legacyFallbackOwner: "buttons.border.".concat(owner.split(".")[3]),
      legacyFallbackTransform: "button-hover-color",
      replayAfterOwner: "buttons.border.".concat(owner.split(".")[3])
    }
  ))
];
function getThemeVariableDescriptorsInReplayOrder() {
  const descriptorsByOwner = new Map(THEME_VARIABLE_DESCRIPTORS.map((descriptor) => [
    descriptor.semanticOwner,
    descriptor
  ]));
  const visited = /* @__PURE__ */ new Set();
  const visiting = /* @__PURE__ */ new Set();
  const result = [];
  const visit = (descriptor) => {
    if (visited.has(descriptor.semanticOwner)) {
      return;
    }
    if (visiting.has(descriptor.semanticOwner)) {
      throw new Error("Cyclic theme replay dependency at ".concat(descriptor.semanticOwner));
    }
    visiting.add(descriptor.semanticOwner);
    if (descriptor.replayAfterOwner) {
      const dependency = descriptorsByOwner.get(descriptor.replayAfterOwner);
      if (!dependency) {
        throw new Error("Missing theme replay dependency ".concat(descriptor.replayAfterOwner));
      }
      visit(dependency);
    }
    visiting.delete(descriptor.semanticOwner);
    visited.add(descriptor.semanticOwner);
    result.push(descriptor);
  };
  THEME_VARIABLE_DESCRIPTORS.forEach(visit);
  return result;
}
function getThemeVariableDescriptorByLightVariable(variable) {
  return THEME_VARIABLE_DESCRIPTORS.find(
    (descriptor) => descriptor.valueKind === "background" ? descriptor.variables.light.solid === variable || descriptor.variables.light.gradient === variable : descriptor.variables.light === variable
  );
}
function getThemeVariableDescriptorByCssTarget(selector) {
  const selectorParts = selector.split(",").map((part) => part.trim()).filter(Boolean);
  if (!selectorParts.length) {
    return void 0;
  }
  return THEME_VARIABLE_DESCRIPTORS.find((descriptor) => [
    descriptor.cssTarget.selector,
    ...descriptor.cssTarget.additionalSelectors ?? []
  ].some((target) => {
    const targetParts = new Set(target.split(",").map((part) => part.trim()).filter(Boolean));
    return selectorParts.every((selectorPart) => targetParts.has(selectorPart));
  }));
}
function getThemeVariableByLightVariable(variable, theme = "light") {
  if (theme === "light") {
    return variable;
  }
  const descriptor = getThemeVariableDescriptorByLightVariable(variable);
  if (!descriptor) {
    return void 0;
  }
  if (descriptor.valueKind !== "background") {
    return descriptor.variables.dark;
  }
  if (descriptor.variables.light.solid === variable) {
    return descriptor.variables.dark.solid;
  }
  if (descriptor.variables.light.gradient === variable) {
    return descriptor.variables.dark.gradient;
  }
  return void 0;
}
function requireThemeVariableByLightVariable(variable, theme = "light") {
  const resolvedVariable = getThemeVariableByLightVariable(variable, theme);
  if (!resolvedVariable) {
    throw new Error("No ".concat(theme, " theme binding is registered for ").concat(variable));
  }
  return resolvedVariable;
}
function getBackgroundThemeVariableDescriptorByDarkGradient(variable) {
  return THEME_VARIABLE_DESCRIPTORS.find(
    (descriptor) => descriptor.valueKind === "background" && descriptor.variables.dark.gradient === variable
  );
}
function getBackgroundThemeVariableDescriptorByCssTarget(selector) {
  return THEME_VARIABLE_DESCRIPTORS.find(
    (descriptor) => descriptor.valueKind === "background" && [
      descriptor.cssTarget.selector,
      ...descriptor.cssTarget.additionalSelectors ?? []
    ].includes(selector.trim())
  );
}
function isRegisteredThemeVariableCssTarget(selector) {
  return getThemeVariableDescriptorByCssTarget(selector) !== void 0;
}
function getBackgroundThemeVariableDescriptorByInlineImageClass(classNames) {
  const classes = new Set(classNames);
  return THEME_VARIABLE_DESCRIPTORS.find(
    (descriptor) => descriptor.valueKind === "background" && descriptor.effectiveInlineImage !== void 0 && classes.has(descriptor.effectiveInlineImage.className)
  );
}
function getBackgroundThemeVariableDescriptorByDarkLayerProperty(property) {
  return THEME_VARIABLE_DESCRIPTORS.find(
    (descriptor) => descriptor.valueKind === "background" && descriptor.effectiveInlineImage !== void 0 && [
      descriptor.effectiveInlineImage.darkLayerProperty,
      descriptor.effectiveInlineImage.darkLayerResetProperty
    ].includes(property)
  );
}
function createDarkThemeMasterCss() {
  const rules = THEME_VARIABLE_DESCRIPTORS.flatMap((descriptor) => [
    descriptor.cssTarget.selector,
    ...descriptor.cssTarget.additionalSelectors ?? []
  ].map((selector) => {
    if (descriptor.valueKind === "background") {
      const imageDeclarations = descriptor.effectiveInlineImage ? "".concat(descriptor.effectiveInlineImage.darkLayerProperty, ": var(").concat(descriptor.variables.dark.gradient, ") !important;\n  ").concat(descriptor.effectiveInlineImage.darkLayerResetProperty, ": var(").concat(descriptor.variables.dark.gradient, ") !important;\n  background-image: var(").concat(descriptor.variables.dark.gradient, ");") : "background-image: var(".concat(descriptor.variables.dark.gradient, ") !important;");
      return "".concat(selector, " {\n  background-color: var(").concat(descriptor.variables.dark.solid, ") !important;\n  ").concat(imageDeclarations, "\n}");
    }
    return "".concat(selector, " {\n  ").concat(descriptor.cssTarget.property, ": var(").concat(descriptor.variables.dark, ") !important;\n}");
  })).join("\n\n");
  return "@media (prefers-color-scheme: dark) {\n".concat(rules, "\n}");
}
function getDarkThemeRuleDisplay(selector, variables) {
  const descriptors = THEME_VARIABLE_DESCRIPTORS.filter((descriptor) => [
    descriptor.cssTarget.selector,
    ...descriptor.cssTarget.additionalSelectors ?? []
  ].includes(selector));
  if (!descriptors.length) {
    return void 0;
  }
  const hasAuthoredValue = (value) => value !== void 0 && value !== null && value !== "";
  const isAuthored = descriptors.some(
    (descriptor) => descriptor.valueKind === "background" ? [descriptor.variables.dark.solid, descriptor.variables.dark.gradient].some((variable) => hasAuthoredValue(variables[variable])) : hasAuthoredValue(variables[descriptor.variables.dark])
  );
  const isEnabled = descriptors.every((descriptor) => !descriptor.displayPolicy || Boolean(variables[descriptor.displayPolicy.variable]));
  return isAuthored && isEnabled;
}

export {
  THEME_VARIABLE_DESCRIPTORS,
  getThemeVariableDescriptorsInReplayOrder,
  getThemeVariableDescriptorByLightVariable,
  getThemeVariableDescriptorByCssTarget,
  getThemeVariableByLightVariable,
  requireThemeVariableByLightVariable,
  getBackgroundThemeVariableDescriptorByDarkGradient,
  getBackgroundThemeVariableDescriptorByCssTarget,
  isRegisteredThemeVariableCssTarget,
  getBackgroundThemeVariableDescriptorByInlineImageClass,
  getBackgroundThemeVariableDescriptorByDarkLayerProperty,
  createDarkThemeMasterCss,
  getDarkThemeRuleDisplay
};

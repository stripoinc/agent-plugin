// convo-email-agent/src/sdk/validator/rule-table.generated.ts
var RULE_TABLE = {
  "editorRevision": "46ab3a6821e8617a8c70f9778f2bb3e1a8b7d8e4",
  "editorDirty": false,
  "rulesSha256": "596c68a272a5a3ffd1c4e39e19bdb9a2ac744d1a9d4a398262775f125052a74a",
  "refines": {
    "$.resources.fonts[]|0.fontFamily": [
      [
        "nonblank",
        "Font family cannot be blank."
      ]
    ],
    "$.resources.fonts[]|1.fontFamily": [
      [
        "nonblank",
        "Font family cannot be blank."
      ]
    ],
    "$.resources.fonts[]|2.fontFamily": [
      [
        "nonblank",
        "Font family cannot be blank."
      ]
    ],
    "$.settings.buttons.darkTheme.borderColor.bottom": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.buttons.darkTheme.borderColor.left": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.buttons.darkTheme.borderColor.right": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.buttons.darkTheme.borderColor.top": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.buttons.darkTheme.buttonColor": [
      [
        "themeBackground",
        "Expected a static solid color or one static CSS gradient followed by a solid fallback."
      ]
    ],
    "$.settings.buttons.darkTheme.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.buttons.darkTheme.hoverButtonStyles.backgroundColor": [
      [
        "themeBackground",
        "Expected a static solid color or one static CSS gradient followed by a solid fallback."
      ]
    ],
    "$.settings.buttons.darkTheme.hoverButtonStyles.borderColor.bottom": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.buttons.darkTheme.hoverButtonStyles.borderColor.left": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.buttons.darkTheme.hoverButtonStyles.borderColor.right": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.buttons.darkTheme.hoverButtonStyles.borderColor.top": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.buttons.darkTheme.hoverButtonStyles.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.buttons.fontFamily": [
      [
        "nonblank",
        "Font family cannot be blank."
      ]
    ],
    "$.settings.buttons.lightTheme.borderColor.bottom": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.buttons.lightTheme.borderColor.left": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.buttons.lightTheme.borderColor.right": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.buttons.lightTheme.borderColor.top": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.buttons.lightTheme.buttonColor": [
      [
        "themeBackground",
        "Expected a static solid color or one static CSS gradient followed by a solid fallback."
      ]
    ],
    "$.settings.buttons.lightTheme.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.buttons.lightTheme.hoverButtonStyles.backgroundColor": [
      [
        "themeBackground",
        "Expected a static solid color or one static CSS gradient followed by a solid fallback."
      ]
    ],
    "$.settings.buttons.lightTheme.hoverButtonStyles.borderColor.bottom": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.buttons.lightTheme.hoverButtonStyles.borderColor.left": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.buttons.lightTheme.hoverButtonStyles.borderColor.right": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.buttons.lightTheme.hoverButtonStyles.borderColor.top": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.buttons.lightTheme.hoverButtonStyles.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.general.backgroundImage.path": [
      [
        "normalizedNonempty",
        "Invalid input"
      ]
    ],
    "$.settings.general.backgroundImage.sizeX": [
      [
        "normalizedNonempty",
        "Invalid input"
      ]
    ],
    "$.settings.general.backgroundImage.sizeY": [
      [
        "normalizedNonempty",
        "Invalid input"
      ]
    ],
    "$.settings.general.darkTheme.backgroundColor": [
      [
        "themeBackground",
        "Expected a static solid color or one static CSS gradient followed by a solid fallback."
      ]
    ],
    "$.settings.general.darkTheme.backgroundImage": [
      [
        "normalizedNonempty",
        "Invalid input"
      ]
    ],
    "$.settings.general.darkTheme.customListStyles.listMarkerColor": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.general.darkTheme.customListStyles.listNumberMarkerColor": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.general.lightTheme.backgroundColor": [
      [
        "themeBackground",
        "Expected a static solid color or one static CSS gradient followed by a solid fallback."
      ]
    ],
    "$.settings.general.lightTheme.customListStyles.listMarkerColor": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.general.lightTheme.customListStyles.listNumberMarkerColor": [
      [
        "staticColorTransparent",
        "Expected a valid static CSS color value."
      ]
    ],
    "$.settings.headings.darkTheme.h1.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.headings.darkTheme.h2.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.headings.darkTheme.h3.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.headings.darkTheme.h4.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.headings.darkTheme.h5.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.headings.darkTheme.h6.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.headings.fontFamily": [
      [
        "nonblank",
        "Font family cannot be blank."
      ]
    ],
    "$.settings.headings.lightTheme.h1.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.headings.lightTheme.h2.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.headings.lightTheme.h3.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.headings.lightTheme.h4.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.headings.lightTheme.h5.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.headings.lightTheme.h6.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.darkTheme.content.contentBackgroundColor": [
      [
        "themeBackground",
        "Expected a static solid color or one static CSS gradient followed by a solid fallback."
      ]
    ],
    "$.settings.stripes.darkTheme.content.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.darkTheme.content.linkColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.darkTheme.content.linkColorHover": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.darkTheme.footer.contentBackgroundColor": [
      [
        "themeBackground",
        "Expected a static solid color or one static CSS gradient followed by a solid fallback."
      ]
    ],
    "$.settings.stripes.darkTheme.footer.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.darkTheme.footer.linkColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.darkTheme.footer.linkColorHover": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.darkTheme.footer.stripeBackgroundColor": [
      [
        "themeBackground",
        "Expected a static solid color or one static CSS gradient followed by a solid fallback."
      ]
    ],
    "$.settings.stripes.darkTheme.header.contentBackgroundColor": [
      [
        "themeBackground",
        "Expected a static solid color or one static CSS gradient followed by a solid fallback."
      ]
    ],
    "$.settings.stripes.darkTheme.header.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.darkTheme.header.linkColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.darkTheme.header.linkColorHover": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.darkTheme.header.stripeBackgroundColor": [
      [
        "themeBackground",
        "Expected a static solid color or one static CSS gradient followed by a solid fallback."
      ]
    ],
    "$.settings.stripes.darkTheme.infoArea.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.darkTheme.infoArea.linkColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.darkTheme.infoArea.linkColorHover": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.fontFamily": [
      [
        "nonblank",
        "Font family cannot be blank."
      ]
    ],
    "$.settings.stripes.footer.backgroundImage.path": [
      [
        "normalizedNonempty",
        "Invalid input"
      ]
    ],
    "$.settings.stripes.footer.backgroundImage.sizeX": [
      [
        "normalizedNonempty",
        "Invalid input"
      ]
    ],
    "$.settings.stripes.footer.backgroundImage.sizeY": [
      [
        "normalizedNonempty",
        "Invalid input"
      ]
    ],
    "$.settings.stripes.header.backgroundImage.path": [
      [
        "normalizedNonempty",
        "Invalid input"
      ]
    ],
    "$.settings.stripes.header.backgroundImage.sizeX": [
      [
        "normalizedNonempty",
        "Invalid input"
      ]
    ],
    "$.settings.stripes.header.backgroundImage.sizeY": [
      [
        "normalizedNonempty",
        "Invalid input"
      ]
    ],
    "$.settings.stripes.lightTheme.content.contentBackgroundColor": [
      [
        "themeBackground",
        "Expected a static solid color or one static CSS gradient followed by a solid fallback."
      ]
    ],
    "$.settings.stripes.lightTheme.content.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.lightTheme.content.linkColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.lightTheme.content.linkColorHover": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.lightTheme.footer.contentBackgroundColor": [
      [
        "themeBackground",
        "Expected a static solid color or one static CSS gradient followed by a solid fallback."
      ]
    ],
    "$.settings.stripes.lightTheme.footer.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.lightTheme.footer.linkColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.lightTheme.footer.linkColorHover": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.lightTheme.footer.stripeBackgroundColor": [
      [
        "themeBackground",
        "Expected a static solid color or one static CSS gradient followed by a solid fallback."
      ]
    ],
    "$.settings.stripes.lightTheme.header.contentBackgroundColor": [
      [
        "themeBackground",
        "Expected a static solid color or one static CSS gradient followed by a solid fallback."
      ]
    ],
    "$.settings.stripes.lightTheme.header.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.lightTheme.header.linkColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.lightTheme.header.linkColorHover": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.lightTheme.header.stripeBackgroundColor": [
      [
        "themeBackground",
        "Expected a static solid color or one static CSS gradient followed by a solid fallback."
      ]
    ],
    "$.settings.stripes.lightTheme.infoArea.fontColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.lightTheme.infoArea.linkColor": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.settings.stripes.lightTheme.infoArea.linkColorHover": [
      [
        "staticColor",
        "Expected a valid static non-transparent CSS color value."
      ]
    ],
    "$.stripes[].settings.contentBackgroundColor": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].settings.contentBorder.bottom.color": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].settings.contentBorder.left.color": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].settings.contentBorder.right.color": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].settings.contentBorder.top.color": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].settings.darkTheme.backgroundImage": [
      [
        "normalizedNonempty",
        "Expected a non-empty normalized background image path."
      ]
    ],
    "$.stripes[].settings.darkTheme.contentBackgroundColor": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].settings.darkTheme.stripeBackgroundColor": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].settings.stripeBackgroundColor": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.backgroundColor": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.fixedHeight": [
      [
        "fixedHeightTarget",
        "At least one fixed-height target must be provided."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|0.settings.fontColor": [
      [
        "color",
        "Expected a valid non-transparent CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|2.settings.customThumbnail.src": [
      [
        "nonemptyThumbnail",
        "Custom thumbnail path cannot be empty."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|3.settings.backgroundColor": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|3.settings.digitsAdvancedColorSettings.days": [
      [
        "color",
        "Expected a valid non-transparent CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|3.settings.digitsAdvancedColorSettings.hours": [
      [
        "color",
        "Expected a valid non-transparent CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|3.settings.digitsAdvancedColorSettings.minutes": [
      [
        "color",
        "Expected a valid non-transparent CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|3.settings.digitsAdvancedColorSettings.seconds": [
      [
        "color",
        "Expected a valid non-transparent CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|3.settings.digitsFontColor": [
      [
        "color",
        "Expected a valid non-transparent CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|3.settings.labelsAdvancedColorSettings.days": [
      [
        "color",
        "Expected a valid non-transparent CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|3.settings.labelsAdvancedColorSettings.hours": [
      [
        "color",
        "Expected a valid non-transparent CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|3.settings.labelsAdvancedColorSettings.minutes": [
      [
        "color",
        "Expected a valid non-transparent CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|3.settings.labelsAdvancedColorSettings.seconds": [
      [
        "color",
        "Expected a valid non-transparent CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|3.settings.labelsFontColor": [
      [
        "color",
        "Expected a valid non-transparent CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|3.settings.separatorFontColor": [
      [
        "color",
        "Expected a valid non-transparent CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|4.settings|0.backgroundColor": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|4.settings|1.backgroundColor": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|6.settings.backgroundColor": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|6.settings.blockBackgroundColor": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|6.settings.border.bottom.color": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|6.settings.border.left.color": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|6.settings.border.right.color": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|6.settings.border.top.color": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|6.settings.fontColor": [
      [
        "color",
        "Expected a valid non-transparent CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|6.settings.fontFamily": [
      [
        "nonblank",
        "Font family cannot be blank."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|7.settings.backgroundColor": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|7.settings.border.color": [
      [
        "color",
        "Expected a valid non-transparent CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|7.settings.mobileBorder.color": [
      [
        "color",
        "Expected a valid non-transparent CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|8.settings.colors|0.link": [
      [
        "color",
        "Expected a valid non-transparent CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|8.settings.fontFamily": [
      [
        "nonblank",
        "Font family cannot be blank."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|8.settings.items[].colors.background": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|8.settings.items[].colors.link": [
      [
        "color",
        "Expected a valid non-transparent CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|8.settings.separator.color": [
      [
        "color",
        "Expected a valid non-transparent CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|9.settings": [
      [
        "emptySettings",
        "Unknown block settings are not supported."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].settings.backgroundColor": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].settings.border.bottom.color": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].settings.border.left.color": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].settings.border.right.color": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].settings.border.top.color": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].settings.darkTheme.backgroundColor": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].columns[].containers[].settings.darkTheme.backgroundImage": [
      [
        "normalizedNonempty",
        "Expected a non-empty normalized background image path."
      ]
    ],
    "$.stripes[].structures[].settings.backgroundColor": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].settings.border.bottom.color": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].settings.border.left.color": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].settings.border.right.color": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].settings.border.top.color": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].settings.darkTheme.backgroundColor": [
      [
        "colorTransparent",
        "Expected a valid CSS color value."
      ]
    ],
    "$.stripes[].structures[].settings.darkTheme.backgroundImage": [
      [
        "normalizedNonempty",
        "Expected a non-empty normalized background image path."
      ]
    ]
  },
  "rules": {
    "$.resources.fonts": [
      "fontResources"
    ],
    "$.stripes[].structures[]": [
      "structureColumns"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|1.settings": [
      "mediaResponsive"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.anchorLinkName": [
      "anchorLinkName"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.link": [
      "imageLink"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|1.settings.src": [
      "imageSrc"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|2.settings": [
      "mediaResponsive"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|2.settings.anchorLinkName": [
      "anchorLinkName"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|2.settings.customThumbnail.src": [
      "imageSrc"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|2.settings.videoLink": [
      "videoLink"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|3.settings": [
      "mediaResponsive"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|3.settings.anchorLinkName": [
      "anchorLinkName"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|3.settings.endDate": [
      "timerEndDate"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|3.settings.expirationImageSrc": [
      "imageSrc"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|3.settings.link": [
      "imageLink"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|4.settings|0.anchorLinkName": [
      "anchorLinkName"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|4.settings|0.networks[]|0.link": [
      "socialLink"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|4.settings|0.networks[]|1.icon": [
      "socialIcon"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|4.settings|0.networks[]|1.link": [
      "socialLink"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|4.settings|1.anchorLinkName": [
      "anchorLinkName"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|4.settings|1.networks[]|0.link": [
      "socialLink"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|4.settings|1.networks[]|1.icon": [
      "socialIcon"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|4.settings|1.networks[]|1.link": [
      "socialLink"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|5.settings.anchorLinkName": [
      "anchorLinkName"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|6.settings.anchorLink": [
      "anchorLinkName"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|6.settings.link|0": [
      "buttonLink"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|6.settings.link|1": [
      "salesforceLink"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|7.settings": [
      "spacerMode"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|7.settings.anchorLinkName": [
      "anchorLinkName"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|7.settings.width.desktop": [
      "spacerWidthPercent",
      "spacerWidthDesktopPx"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|7.settings.width.mobile": [
      "spacerWidthPercent",
      "spacerWidthMobilePx"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|8.settings": [
      "menuItems"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|8.settings.anchorLinkName": [
      "anchorLinkName"
    ],
    "$.stripes[].structures[].columns[].containers[].blocks[]|8.settings.items[].link": [
      "menuLink"
    ]
  },
  "transforms": {
    "$": [
      "dropUndefinedResources"
    ],
    "$.resources": [
      "canonicalFontResources"
    ],
    "$.stripes[].settings.backgroundImage.repeat": [
      "backgroundRepeat"
    ],
    "$.stripes[].settings.backgroundImage.sizeX": [
      "backgroundSize"
    ],
    "$.stripes[].settings.backgroundImage.sizeY": [
      "backgroundSize"
    ],
    "$.stripes[].structures[].columns[].containers[].settings.backgroundImage.repeat": [
      "backgroundRepeat"
    ],
    "$.stripes[].structures[].columns[].containers[].settings.backgroundImage.sizeX": [
      "backgroundSize"
    ],
    "$.stripes[].structures[].columns[].containers[].settings.backgroundImage.sizeY": [
      "backgroundSize"
    ],
    "$.stripes[].structures[].settings.backgroundImage.repeat": [
      "backgroundRepeat"
    ],
    "$.stripes[].structures[].settings.backgroundImage.sizeX": [
      "backgroundSize"
    ],
    "$.stripes[].structures[].settings.backgroundImage.sizeY": [
      "backgroundSize"
    ]
  },
  "inputTypes": {
    "$.stripes[].settings.backgroundImage.repeat": [
      "boolean",
      "string"
    ],
    "$.stripes[].structures[].columns[].containers[].settings.backgroundImage.repeat": [
      "boolean",
      "string"
    ],
    "$.stripes[].structures[].settings.backgroundImage.repeat": [
      "boolean",
      "string"
    ]
  }
};

export {
  RULE_TABLE
};

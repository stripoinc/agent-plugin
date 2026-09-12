export type Native__schema0 = {
    "title"?: Native__schema1;
    "preheader"?: Native__schema2;
};
export type NativeDocumentMetadata = {
    "title"?: Native__schema1;
    "preheader"?: Native__schema2;
};
export type Native__schema1 = string;
export type Native__schema2 = {
    "text": Native__schema3;
    "fillSpace": Native__schema4;
};
export type NativeDocumentMetadataPreheader = {
    "text": Native__schema3;
    "fillSpace": Native__schema4;
};
export type Native__schema3 = string;
export type Native__schema4 = boolean;
export type Native__schema5 = {
    "fonts"?: Native__schema6;
};
export type NativeDocumentResources = {
    "fonts"?: Native__schema6;
};
export type Native__schema6 = Array<NativeFontResource>;
export type NativeFontResource = (Native__schema7) | (Native__schema9) | (Native__schema10);
export type Native__schema7 = {
    "fontFamily": Native__schema8;
    "importMethod": "link";
    "url": string;
};
export type Native__schema8 = string;
export type Native__schema9 = {
    "fontFamily": Native__schema8;
    "importMethod": "import";
    "url": string;
};
export type Native__schema10 = {
    "fontFamily": Native__schema8;
    "importMethod": "fontFace";
    "url"?: string;
    "css": string;
};
export type Native__schema11 = {
    "general": NativeGeneralSettings;
    "stripes": Native__schema37;
    "headings": Native__schema68;
    "buttons": Native__schema86;
};
export type NativeGeneralSettings = {
    "defaultStyles": Native__schema12;
    "hideImageDownloadIcons"?: Native__schema13;
    "underlineLinks": Native__schema14;
    "responsiveDesign": Native__schema15;
    "messageAlignment": Native__schema16;
    "messageContentWidth": Native__schema17;
    "backgroundColor": NativeColorValueAllowTransparent;
    "backgroundImage"?: Native__schema18;
    "rightToLeftTextDirection": Native__schema28;
    "marginsAroundMessage": NativeResponsivePadding;
    "defaultStructurePadding": NativeResponsivePadding;
    "customListStyles"?: Native__schema33;
};
export type Native__schema12 = boolean;
export type Native__schema13 = boolean;
export type Native__schema14 = boolean;
export type Native__schema15 = boolean;
export type Native__schema16 = "left" | "center" | "right";
export type Native__schema17 = number;
export type NativeColorValueAllowTransparent = string;
export type Native__schema18 = {
    "path": Native__schema19;
    "repeat": boolean;
    "x": Native__schema22;
    "y": Native__schema23;
    "sizeX": string;
    "sizeY": string;
};
export type NativeBackgroundImage = {
    "path": Native__schema19;
    "repeat": boolean;
    "x": Native__schema22;
    "y": Native__schema23;
    "sizeX": string;
    "sizeY": string;
};
export type Native__schema19 = string;
export type Native__schema20 = boolean | string;
export type Native__schema21 = boolean | string;
export type Native__schema22 = string;
export type Native__schema23 = string;
export type Native__schema24 = string;
export type Native__schema25 = string;
export type Native__schema26 = string;
export type Native__schema27 = string;
export type Native__schema28 = boolean;
export type NativeResponsivePadding = {
    "desktop": NativeFullSideValues;
    "mobile": NativeFullSideValues;
};
export type NativeFullSideValues = {
    "top": Native__schema29;
    "right": Native__schema30;
    "bottom": Native__schema31;
    "left": Native__schema32;
};
export type Native__schema29 = number;
export type Native__schema30 = number;
export type Native__schema31 = number;
export type Native__schema32 = number;
export type Native__schema33 = {
    "leftIndent": Native__schema34;
    "listItemsBottomSpace": Native__schema35;
    "listTopBottomMargin": Native__schema36;
    "listMarkerColor": NativeColorValueAllowTransparent;
    "listNumberMarkerColor": NativeColorValueAllowTransparent;
};
export type NativeGeneralCustomListStyles = {
    "leftIndent": Native__schema34;
    "listItemsBottomSpace": Native__schema35;
    "listTopBottomMargin": Native__schema36;
    "listMarkerColor": NativeColorValueAllowTransparent;
    "listNumberMarkerColor": NativeColorValueAllowTransparent;
};
export type Native__schema34 = number;
export type Native__schema35 = number;
export type Native__schema36 = number;
export type Native__schema37 = {
    "letterSpacing"?: Native__schema38;
    "lineHeight"?: Native__schema41;
    "fontFamily"?: Native__schema44;
    "fontWeight"?: Native__schema45;
    "header"?: Native__schema47;
    "content"?: Native__schema61;
    "footer"?: Native__schema63;
    "infoArea"?: Native__schema67;
};
export type NativeStripesSettings = {
    "letterSpacing"?: Native__schema38;
    "lineHeight"?: Native__schema41;
    "fontFamily"?: Native__schema44;
    "fontWeight"?: Native__schema45;
    "header"?: Native__schema47;
    "content"?: Native__schema61;
    "footer"?: Native__schema63;
    "infoArea"?: Native__schema67;
};
export type Native__schema38 = {
    "value": Native__schema39;
    "unit": Native__schema40;
};
export type NativeSpacingValue = {
    "value": Native__schema39;
    "unit": Native__schema40;
};
export type Native__schema39 = number;
export type Native__schema40 = "px" | "em";
export type Native__schema41 = {
    "desktop": Native__schema42;
    "mobile": Native__schema43;
};
export type NativeLineHeight = {
    "desktop": Native__schema42;
    "mobile": Native__schema43;
};
export type Native__schema42 = number;
export type Native__schema43 = number;
export type Native__schema44 = string;
export type Native__schema45 = number;
export type Native__schema46 = number;
export type Native__schema47 = {
    "fontSize"?: Native__schema48;
    "fontColor"?: Native__schema51;
    "linkColor"?: Native__schema52;
    "linkColorHover"?: Native__schema53;
    "paragraphBottomSpace"?: Native__schema54;
    "contentBackgroundColor"?: Native__schema58;
    "stripeBackgroundColor"?: Native__schema59;
    "backgroundImage"?: Native__schema60;
};
export type NativeStripesHeaderConfig = {
    "fontSize"?: Native__schema48;
    "fontColor"?: Native__schema51;
    "linkColor"?: Native__schema52;
    "linkColorHover"?: Native__schema53;
    "paragraphBottomSpace"?: Native__schema54;
    "contentBackgroundColor"?: Native__schema58;
    "stripeBackgroundColor"?: Native__schema59;
    "backgroundImage"?: Native__schema60;
};
export type Native__schema48 = {
    "desktop": Native__schema49;
    "mobile": Native__schema50;
};
export type NativeFontSize = {
    "desktop": Native__schema49;
    "mobile": Native__schema50;
};
export type Native__schema49 = number;
export type Native__schema50 = number;
export type Native__schema51 = string;
export type NativeColorValueDisallowTransparent = string;
export type Native__schema52 = string;
export type Native__schema53 = {
    "value": NativeColorValueDisallowTransparent;
};
export type NativeHoverLinkColor = {
    "value": NativeColorValueDisallowTransparent;
};
export type Native__schema54 = {
    "desktop": Native__schema56;
    "mobile": Native__schema57;
};
export type Native__schema55 = {
    "desktop": Native__schema56;
    "mobile": Native__schema57;
};
export type Native__schema56 = number;
export type Native__schema57 = number;
export type Native__schema58 = string;
export type Native__schema59 = string;
export type Native__schema60 = {
    "path": Native__schema19;
    "repeat": boolean;
    "x": Native__schema22;
    "y": Native__schema23;
    "sizeX": string;
    "sizeY": string;
};
export type Native__schema61 = {
    "fontSize"?: Native__schema48;
    "fontColor"?: Native__schema51;
    "linkColor"?: Native__schema52;
    "linkColorHover"?: Native__schema53;
    "paragraphBottomSpace"?: Native__schema54;
    "contentBackgroundColor"?: Native__schema62;
};
export type NativeStripesContentConfig = {
    "fontSize"?: Native__schema48;
    "fontColor"?: Native__schema51;
    "linkColor"?: Native__schema52;
    "linkColorHover"?: Native__schema53;
    "paragraphBottomSpace"?: Native__schema54;
    "contentBackgroundColor"?: Native__schema62;
};
export type Native__schema62 = string;
export type Native__schema63 = {
    "fontSize"?: Native__schema48;
    "fontColor"?: Native__schema51;
    "linkColor"?: Native__schema52;
    "linkColorHover"?: Native__schema53;
    "paragraphBottomSpace"?: Native__schema54;
    "contentBackgroundColor"?: Native__schema64;
    "stripeBackgroundColor"?: Native__schema65;
    "backgroundImage"?: Native__schema66;
};
export type NativeStripesFooterConfig = {
    "fontSize"?: Native__schema48;
    "fontColor"?: Native__schema51;
    "linkColor"?: Native__schema52;
    "linkColorHover"?: Native__schema53;
    "paragraphBottomSpace"?: Native__schema54;
    "contentBackgroundColor"?: Native__schema64;
    "stripeBackgroundColor"?: Native__schema65;
    "backgroundImage"?: Native__schema66;
};
export type Native__schema64 = string;
export type Native__schema65 = string;
export type Native__schema66 = {
    "path": Native__schema19;
    "repeat": boolean;
    "x": Native__schema22;
    "y": Native__schema23;
    "sizeX": string;
    "sizeY": string;
};
export type Native__schema67 = {
    "fontSize"?: Native__schema48;
    "fontColor"?: Native__schema51;
    "linkColor"?: Native__schema52;
    "linkColorHover"?: Native__schema53;
    "paragraphBottomSpace"?: Native__schema54;
};
export type NativeStripesInfoAreaConfig = {
    "fontSize"?: Native__schema48;
    "fontColor"?: Native__schema51;
    "linkColor"?: Native__schema52;
    "linkColorHover"?: Native__schema53;
    "paragraphBottomSpace"?: Native__schema54;
};
export type Native__schema68 = {
    "letterSpacing"?: Native__schema69;
    "fontFamily"?: Native__schema70;
    "h1"?: Native__schema71;
    "h2"?: Native__schema81;
    "h3"?: Native__schema82;
    "h4"?: Native__schema83;
    "h5"?: Native__schema84;
    "h6"?: Native__schema85;
};
export type NativeHeadingsSettings = {
    "letterSpacing"?: Native__schema69;
    "fontFamily"?: Native__schema70;
    "h1"?: Native__schema71;
    "h2"?: Native__schema81;
    "h3"?: Native__schema82;
    "h4"?: Native__schema83;
    "h5"?: Native__schema84;
    "h6"?: Native__schema85;
};
export type Native__schema69 = {
    "value": Native__schema39;
    "unit": Native__schema40;
};
export type Native__schema70 = string;
export type Native__schema71 = {
    "fontColor"?: Native__schema72;
    "textAlign"?: Native__schema73;
    "textStyle"?: Native__schema75;
    "fontWeight"?: Native__schema77;
    "fontSize"?: Native__schema78;
    "lineHeight"?: Native__schema79;
    "paragraphBottomSpace"?: Native__schema80;
};
export type NativeHeadingConfig = {
    "fontColor"?: Native__schema72;
    "textAlign"?: Native__schema73;
    "textStyle"?: Native__schema75;
    "fontWeight"?: Native__schema77;
    "fontSize"?: Native__schema78;
    "lineHeight"?: Native__schema79;
    "paragraphBottomSpace"?: Native__schema80;
};
export type Native__schema72 = string;
export type Native__schema73 = {
    "mobile": Native__schema74;
};
export type NativeHeadingsAlignment = {
    "mobile": Native__schema74;
};
export type Native__schema74 = "left" | "center" | "right";
export type Native__schema75 = {
    "italic": Native__schema76;
};
export type NativeHeadingTextStyle = {
    "italic": Native__schema76;
};
export type Native__schema76 = boolean;
export type Native__schema77 = number;
export type Native__schema78 = {
    "desktop": Native__schema49;
    "mobile": Native__schema50;
};
export type Native__schema79 = {
    "desktop": Native__schema42;
    "mobile": Native__schema43;
};
export type Native__schema80 = {
    "desktop": Native__schema56;
    "mobile": Native__schema57;
};
export type Native__schema81 = {
    "fontColor"?: Native__schema72;
    "textAlign"?: Native__schema73;
    "textStyle"?: Native__schema75;
    "fontWeight"?: Native__schema77;
    "fontSize"?: Native__schema78;
    "lineHeight"?: Native__schema79;
    "paragraphBottomSpace"?: Native__schema80;
};
export type Native__schema82 = {
    "fontColor"?: Native__schema72;
    "textAlign"?: Native__schema73;
    "textStyle"?: Native__schema75;
    "fontWeight"?: Native__schema77;
    "fontSize"?: Native__schema78;
    "lineHeight"?: Native__schema79;
    "paragraphBottomSpace"?: Native__schema80;
};
export type Native__schema83 = {
    "fontColor"?: Native__schema72;
    "textAlign"?: Native__schema73;
    "textStyle"?: Native__schema75;
    "fontWeight"?: Native__schema77;
    "fontSize"?: Native__schema78;
    "lineHeight"?: Native__schema79;
    "paragraphBottomSpace"?: Native__schema80;
};
export type Native__schema84 = {
    "fontColor"?: Native__schema72;
    "textAlign"?: Native__schema73;
    "textStyle"?: Native__schema75;
    "fontWeight"?: Native__schema77;
    "fontSize"?: Native__schema78;
    "lineHeight"?: Native__schema79;
    "paragraphBottomSpace"?: Native__schema80;
};
export type Native__schema85 = {
    "fontColor"?: Native__schema72;
    "textAlign"?: Native__schema73;
    "textStyle"?: Native__schema75;
    "fontWeight"?: Native__schema77;
    "fontSize"?: Native__schema78;
    "lineHeight"?: Native__schema79;
    "paragraphBottomSpace"?: Native__schema80;
};
export type Native__schema86 = {
    "outlookSupport"?: Native__schema87;
    "fontColor"?: Native__schema88;
    "textStyle"?: Native__schema89;
    "textTransform"?: Native__schema92;
    "fontFamily"?: Native__schema93;
    "buttonColor"?: Native__schema94;
    "letterSpacing"?: Native__schema95;
    "fontSize"?: Native__schema96;
    "borderRadius"?: Native__schema97;
    "fitContainer"?: Native__schema102;
    "border": NativeBorder;
    "hoverButtonStyles"?: Native__schema107;
    "padding"?: Native__schema108;
};
export type NativeButtonsSettings = {
    "outlookSupport"?: Native__schema87;
    "fontColor"?: Native__schema88;
    "textStyle"?: Native__schema89;
    "textTransform"?: Native__schema92;
    "fontFamily"?: Native__schema93;
    "buttonColor"?: Native__schema94;
    "letterSpacing"?: Native__schema95;
    "fontSize"?: Native__schema96;
    "borderRadius"?: Native__schema97;
    "fitContainer"?: Native__schema102;
    "border": NativeBorder;
    "hoverButtonStyles"?: Native__schema107;
    "padding"?: Native__schema108;
};
export type Native__schema87 = boolean;
export type Native__schema88 = string;
export type Native__schema89 = {
    "bold": Native__schema90;
    "italic": Native__schema91;
};
export type NativeButtonsTextStyle = {
    "bold": Native__schema90;
    "italic": Native__schema91;
};
export type Native__schema90 = boolean;
export type Native__schema91 = boolean;
export type Native__schema92 = "none" | "uppercase" | "capitalize" | "lowercase";
export type Native__schema93 = string;
export type Native__schema94 = string;
export type Native__schema95 = {
    "value": Native__schema39;
    "unit": Native__schema40;
};
export type Native__schema96 = {
    "desktop": Native__schema49;
    "mobile": Native__schema50;
};
export type Native__schema97 = {
    "topLeft": Native__schema98;
    "topRight": Native__schema99;
    "bottomRight": Native__schema100;
    "bottomLeft": Native__schema101;
};
export type NativeBorderRadius = {
    "topLeft": Native__schema98;
    "topRight": Native__schema99;
    "bottomRight": Native__schema100;
    "bottomLeft": Native__schema101;
};
export type Native__schema98 = number;
export type Native__schema99 = number;
export type Native__schema100 = number;
export type Native__schema101 = number;
export type Native__schema102 = {
    "desktop": Native__schema103;
    "mobile": Native__schema104;
};
export type NativeResponsiveBoolean = {
    "desktop": Native__schema103;
    "mobile": Native__schema104;
};
export type Native__schema103 = boolean;
export type Native__schema104 = boolean;
export type NativeBorder = {
    "top": NativeBorderSide;
    "right": NativeBorderSide;
    "bottom": NativeBorderSide;
    "left": NativeBorderSide;
    "style": Native__schema106;
};
export type NativeBorderSide = {
    "width": Native__schema105;
    "color": NativeColorValueAllowTransparent;
};
export type Native__schema105 = number;
export type Native__schema106 = "solid" | "dashed" | "dotted";
export type Native__schema107 = {
    "backgroundColor": NativeColorValueAllowTransparent;
    "fontColor": NativeColorValueDisallowTransparent;
    "borderColor": NativeButtonsHoverBorderColor;
};
export type NativeButtonsHoverButtonStyles = {
    "backgroundColor": NativeColorValueAllowTransparent;
    "fontColor": NativeColorValueDisallowTransparent;
    "borderColor": NativeButtonsHoverBorderColor;
};
export type NativeButtonsHoverBorderColor = {
    "top": NativeColorValueAllowTransparent;
    "right": NativeColorValueAllowTransparent;
    "bottom": NativeColorValueAllowTransparent;
    "left": NativeColorValueAllowTransparent;
};
export type Native__schema108 = {
    "desktop": NativeFullSideValues;
    "mobile": NativeFullSideValues;
};
export type NativeEmailTemplateSettings = {
    "general": NativeGeneralSettings;
    "stripes"?: Native__schema37;
    "headings"?: Native__schema68;
    "buttons"?: Native__schema86;
};
export type Native__schema109 = Array<NativeStripe>;
export type Native__schema110 = Array<NativeStripe>;
export type NativeStripe = {
    "id": Native__schema111;
    "settings"?: Native__schema112;
    "moduleId"?: Native__schema120;
    "structures"?: Native__schema121;
};
export type Native__schema111 = string;
export type Native__schema112 = {
    "messageArea"?: Native__schema113;
    "includeInOutput"?: Native__schema114;
    "hideElement": NativeHideElement;
    "padding"?: Native__schema115;
    "stripeBackgroundColor"?: Native__schema116;
    "contentBackgroundColor"?: Native__schema117;
    "backgroundImage"?: Native__schema118;
    "contentBorder"?: Native__schema119;
};
export type NativeStripeSettings = {
    "messageArea"?: Native__schema113;
    "includeInOutput"?: Native__schema114;
    "hideElement": NativeHideElement;
    "padding"?: Native__schema115;
    "stripeBackgroundColor"?: Native__schema116;
    "contentBackgroundColor"?: Native__schema117;
    "backgroundImage"?: Native__schema118;
    "contentBorder"?: Native__schema119;
};
export type Native__schema113 = "header" | "content" | "footer" | "infoArea";
export type Native__schema114 = "both" | "html" | "ampHtml";
export type NativeOutputInclusion = "both" | "html" | "ampHtml";
export type NativeHideElement = "no" | "desktop" | "mobile";
export type Native__schema115 = {
    "mobile": NativeFullSideValues;
};
export type NativeMobilePadding = {
    "mobile": NativeFullSideValues;
};
export type Native__schema116 = string;
export type Native__schema117 = string;
export type Native__schema118 = {
    "path": Native__schema19;
    "repeat": boolean;
    "x": Native__schema22;
    "y": Native__schema23;
    "sizeX": string;
    "sizeY": string;
};
export type Native__schema119 = {
    "top": NativeBorderSide;
    "right": NativeBorderSide;
    "bottom": NativeBorderSide;
    "left": NativeBorderSide;
    "style": Native__schema106;
};
export type Native__schema120 = number;
export type Native__schema121 = Array<NativeStructure>;
export type NativeStructure = {
    "id": Native__schema122;
    "settings"?: Native__schema123;
    "moduleId"?: Native__schema134;
    "columns"?: Native__schema135;
};
export type Native__schema122 = string;
export type Native__schema123 = {
    "backgroundColor": NativeColorValueAllowTransparent;
    "backgroundImage"?: Native__schema124;
    "border": NativeBorder;
    "borderRadius": NativeBorderRadius;
    "columnsGap"?: Native__schema125;
    "responsiveMobile"?: Native__schema128;
    "responsiveMobileContainersInversion"?: Native__schema129;
    "padding"?: Native__schema130;
    "margins"?: Native__schema131;
    "includeInOutput"?: Native__schema132;
    "hideElement"?: Native__schema133;
};
export type Native__schema124 = {
    "path": Native__schema19;
    "repeat": boolean;
    "x": Native__schema22;
    "y": Native__schema23;
    "sizeX": string;
    "sizeY": string;
};
export type Native__schema125 = {
    "desktop": Native__schema126;
    "mobile": Native__schema127;
};
export type NativeResponsiveNumber = {
    "desktop": Native__schema126;
    "mobile": Native__schema127;
};
export type Native__schema126 = number;
export type Native__schema127 = number;
export type Native__schema128 = boolean;
export type Native__schema129 = boolean;
export type Native__schema130 = {
    "desktop": NativeFullSideValues;
    "mobile": NativeFullSideValues;
};
export type Native__schema131 = {
    "desktop": NativeFullSideValues;
    "mobile": NativeFullSideValues;
};
export type Native__schema132 = "both" | "html" | "ampHtml";
export type Native__schema133 = "no" | "desktop" | "mobile";
export type Native__schema134 = number;
export type Native__schema135 = Array<NativeColumn>;
export type NativeColumn = {
    "id": Native__schema136;
    "settings"?: Native__schema137;
    "containers": Native__schema139;
};
export type Native__schema136 = string;
export type Native__schema137 = {
    "width": Native__schema138;
};
export type Native__schema138 = number;
export type Native__schema139 = Array<NativeContainer>;
export type NativeContainer = {
    "id": Native__schema140;
    "settings": Native__schema141;
    "moduleId"?: Native__schema143;
    "blocks"?: Native__schema144;
};
export type Native__schema140 = string;
export type Native__schema141 = {
    "padding": NativeResponsivePadding;
    "includeInOutput": NativeOutputInclusion;
    "hideElement": NativeHideElement;
    "backgroundColor": NativeColorValueAllowTransparent;
    "backgroundImage"?: Native__schema142;
    "border": NativeBorder;
    "radius": NativeBorderRadius;
};
export type Native__schema142 = {
    "path": Native__schema19;
    "repeat": boolean;
    "x": Native__schema22;
    "y": Native__schema23;
    "sizeX": string;
    "sizeY": string;
};
export type Native__schema143 = number;
export type Native__schema144 = Array<NativeBlock>;
export type NativeBlock = (NativeTextBlock) | (NativeImageBlock) | (NativeVideoBlock) | (NativeTimerBlock) | (NativeSocialBlock) | (NativeHtmlBlock) | (NativeButtonBlock) | (NativeSpacerBlock) | (NativeMenuBlock) | (NativeUnknownBlock);
export type NativeTextBlock = {
    "id": Native__schema145;
    "type": Native__schema146;
    "settings"?: Native__schema147;
    "content"?: Native__schema156;
};
export type Native__schema145 = string;
export type Native__schema146 = "text";
export type Native__schema147 = {
    "fontColor"?: string;
    "hideElement": NativeHideElement;
    "rightToLeftTextDirection": boolean;
    "alignment"?: {
        "desktop": Native__schema148;
        "mobile": Native__schema148;
    };
    "fixedHeight"?: {
        "desktop"?: Native__schema149;
        "mobile"?: Native__schema153;
    };
    "padding": {
        "desktop": Native__schema154;
        "mobile": Native__schema154;
    };
    "includeInOutput": NativeOutputInclusion;
    "backgroundColor": NativeColorValueAllowTransparent;
    "letterSpacing"?: {
        "value": Native__schema39;
        "unit": Native__schema40;
    };
};
export type Native__schema148 = "left" | "center" | "right" | "justify";
export type Native__schema149 = {
    "height": Native__schema151;
    "verticalAlignment"?: Native__schema152;
};
export type Native__schema150 = {
    "height": Native__schema151;
    "verticalAlignment"?: Native__schema152;
};
export type Native__schema151 = number;
export type Native__schema152 = "top" | "middle" | "bottom";
export type Native__schema153 = {
    "height": Native__schema151;
    "verticalAlignment"?: Native__schema152;
};
export type Native__schema154 = {
    "top": Native__schema155;
    "right": Native__schema155;
    "bottom": Native__schema155;
    "left": Native__schema155;
};
export type Native__schema155 = number;
export type Native__schema156 = string;
export type NativeImageBlock = {
    "id": Native__schema145;
    "type": Native__schema157;
    "settings": Native__schema158;
};
export type Native__schema157 = "image";
export type Native__schema158 = {
    "src": Native__schema159;
    "link"?: Native__schema160;
    "altText": Native__schema164;
    "size": Native__schema167;
    "alignment": Native__schema171;
    "radius": Native__schema172;
    "hideElement": NativeHideElement;
    "margins": Native__schema173;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema179;
    "responsiveMobile": Native__schema180;
};
export type Native__schema159 = string;
export type Native__schema160 = {
    "type": Native__schema162;
    "href": Native__schema163;
};
export type Native__schema161 = {
    "type": Native__schema162;
    "href": Native__schema163;
};
export type Native__schema162 = "site" | "anchor" | "email" | "phone" | "file" | "sms" | "telegram" | "viber" | "other";
export type Native__schema163 = string;
export type Native__schema164 = {
    "text": Native__schema165;
    "addToTitle": Native__schema166;
};
export type Native__schema165 = string;
export type Native__schema166 = boolean;
export type Native__schema167 = {
    "desktop": Native__schema168;
    "mobile": Native__schema168;
};
export type Native__schema168 = {
    "mode": Native__schema169;
    "px": Native__schema170;
};
export type Native__schema169 = "width" | "height";
export type Native__schema170 = number;
export type Native__schema171 = {
    "desktop": Native__schema74;
    "mobile": Native__schema74;
};
export type Native__schema172 = {
    "desktop": NativeBorderRadius;
    "mobile": NativeBorderRadius;
};
export type Native__schema173 = {
    "desktop": Native__schema174;
    "mobile": Native__schema174;
};
export type Native__schema174 = {
    "top": Native__schema175;
    "right": Native__schema176;
    "bottom": Native__schema177;
    "left": Native__schema178;
};
export type Native__schema175 = number;
export type Native__schema176 = number;
export type Native__schema177 = number;
export type Native__schema178 = number;
export type Native__schema179 = string;
export type Native__schema180 = boolean;
export type NativeVideoBlock = {
    "id": Native__schema145;
    "type": Native__schema181;
    "settings": NativeVideoBlockSettings;
};
export type Native__schema181 = "video";
export type NativeVideoBlockSettings = {
    "videoLink": Native__schema182;
    "altText": Native__schema164;
    "customThumbnail"?: Native__schema183;
    "playButtonStyle": Native__schema185;
    "size": Native__schema167;
    "alignment": Native__schema171;
    "radius": Native__schema172;
    "hideElement": NativeHideElement;
    "paddings": Native__schema186;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema179;
    "responsiveMobile": Native__schema187;
};
export type Native__schema182 = string;
export type Native__schema183 = {
    "src": Native__schema184;
};
export type NativeVideoCustomThumbnail = {
    "src": Native__schema184;
};
export type Native__schema184 = string;
export type Native__schema185 = "NONE" | "red" | "white" | "black" | "blue" | "whiteCircle" | "blackCircle" | "greyCircle" | "blackCircleInverse";
export type Native__schema186 = {
    "desktop": Native__schema174;
    "mobile": Native__schema174;
};
export type Native__schema187 = boolean;
export type NativeTimerBlock = {
    "id": Native__schema145;
    "type": Native__schema188;
    "settings": NativeTimerBlockSettings;
};
export type Native__schema188 = "timer";
export type NativeTimerBlockSettings = {
    "altText": Native__schema164;
    "responsiveMobile": Native__schema189;
    "size": Native__schema167;
    "alignment": Native__schema171;
    "margins": Native__schema173;
    "endDate": Native__schema190;
    "timeZone": Native__schema191;
    "link": Native__schema192;
    "displayDays": Native__schema193;
    "labelsLetterCase"?: Native__schema194;
    "separator": Native__schema195;
    "labelsLanguage": Native__schema196;
    "retinaDisplaySupport": Native__schema197;
    "expirationImageSrc": Native__schema159;
    "hideElement": NativeHideElement;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema179;
    "digitsFontFamily": Native__schema198;
    "digitsFontSize": Native__schema199;
    "digitsFontColor": NativeColorValueDisallowTransparent;
    "digitsAdvancedColorSettings"?: Native__schema200;
    "labelsFontFamily": Native__schema198;
    "labelsFontSize": Native__schema199;
    "labelsFontColor": NativeColorValueDisallowTransparent;
    "labelsAdvancedColorSettings"?: Native__schema202;
    "separatorFontFamily": Native__schema198;
    "separatorFontSize": Native__schema199;
    "separatorFontColor": NativeColorValueDisallowTransparent;
    "backgroundColor": NativeColorValueAllowTransparent;
};
export type Native__schema189 = boolean;
export type Native__schema190 = string;
export type Native__schema191 = "Africa/Abidjan" | "Africa/Accra" | "Africa/Addis_Ababa" | "Africa/Algiers" | "Africa/Asmara" | "Africa/Bamako" | "Africa/Bangui" | "Africa/Banjul" | "Africa/Bissau" | "Africa/Blantyre" | "Africa/Brazzaville" | "Africa/Bujumbura" | "Africa/Cairo" | "Africa/Casablanca" | "Africa/Ceuta" | "Africa/Conakry" | "Africa/Dakar" | "Africa/Dar_es_Salaam" | "Africa/Djibouti" | "Africa/Douala" | "Africa/El_Aaiun" | "Africa/Freetown" | "Africa/Gaborone" | "Africa/Harare" | "Africa/Johannesburg" | "Africa/Juba" | "Africa/Kampala" | "Africa/Khartoum" | "Africa/Kigali" | "Africa/Kinshasa" | "Africa/Lagos" | "Africa/Libreville" | "Africa/Lome" | "Africa/Luanda" | "Africa/Lubumbashi" | "Africa/Lusaka" | "Africa/Malabo" | "Africa/Maputo" | "Africa/Maseru" | "Africa/Mbabane" | "Africa/Mogadishu" | "Africa/Monrovia" | "Africa/Nairobi" | "Africa/Ndjamena" | "Africa/Niamey" | "Africa/Nouakchott" | "Africa/Ouagadougou" | "Africa/Porto-Novo" | "Africa/Sao_Tome" | "Africa/Tripoli" | "Africa/Tunis" | "Africa/Windhoek" | "America/Adak" | "America/Anchorage" | "America/Anguilla" | "America/Antigua" | "America/Araguaina" | "America/Argentina/Buenos_Aires" | "America/Argentina/Catamarca" | "America/Argentina/Cordoba" | "America/Argentina/Jujuy" | "America/Argentina/La_Rioja" | "America/Argentina/Mendoza" | "America/Argentina/Rio_Gallegos" | "America/Argentina/Salta" | "America/Argentina/San_Juan" | "America/Argentina/San_Luis" | "America/Argentina/Tucuman" | "America/Argentina/Ushuaia" | "America/Aruba" | "America/Asuncion" | "America/Atikokan" | "America/Bahia" | "America/Bahia_Banderas" | "America/Barbados" | "America/Belem" | "America/Belize" | "America/Blanc-Sablon" | "America/Boa_Vista" | "America/Bogota" | "America/Boise" | "America/Cambridge_Bay" | "America/Campo_Grande" | "America/Cancun" | "America/Caracas" | "America/Cayenne" | "America/Cayman" | "America/Chicago" | "America/Chihuahua" | "America/Costa_Rica" | "America/Creston" | "America/Cuiaba" | "America/Curacao" | "America/Danmarkshavn" | "America/Dawson" | "America/Dawson_Creek" | "America/Denver" | "America/Detroit" | "America/Dominica" | "America/Edmonton" | "America/Eirunepe" | "America/El_Salvador" | "America/Fort_Nelson" | "America/Fortaleza" | "America/Glace_Bay" | "America/Godthab" | "America/Goose_Bay" | "America/Grand_Turk" | "America/Grenada" | "America/Guadeloupe" | "America/Guatemala" | "America/Guayaquil" | "America/Guyana" | "America/Halifax" | "America/Havana" | "America/Hermosillo" | "America/Indiana/Indianapolis" | "America/Indiana/Knox" | "America/Indiana/Marengo" | "America/Indiana/Petersburg" | "America/Indiana/Tell_City" | "America/Indiana/Vevay" | "America/Indiana/Vincennes" | "America/Indiana/Winamac" | "America/Inuvik" | "America/Iqaluit" | "America/Jamaica" | "America/Juneau" | "America/Kentucky/Louisville" | "Asia/Novokuznetsk" | "America/Kentucky/Monticello" | "America/Kralendijk" | "America/La_Paz" | "America/Lima" | "America/Los_Angeles" | "America/Lower_Princes" | "America/Maceio" | "America/Managua" | "America/Manaus" | "America/Marigot" | "America/Martinique" | "America/Matamoros" | "America/Mazatlan" | "America/Menominee" | "America/Merida" | "America/Metlakatla" | "America/Mexico_City" | "America/Miquelon" | "America/Moncton" | "America/Monterrey" | "America/Montevideo" | "America/Montserrat" | "America/Nassau" | "America/New_York" | "America/Nipigon" | "America/Nome" | "America/Noronha" | "America/North_Dakota/Beulah" | "America/North_Dakota/Center" | "America/North_Dakota/New_Salem" | "America/Ojinaga" | "America/Panama" | "America/Pangnirtung" | "America/Paramaribo" | "America/Phoenix" | "America/Port-au-Prince" | "America/Port_of_Spain" | "America/Porto_Velho" | "America/Puerto_Rico" | "America/Punta_Arenas" | "America/Rainy_River" | "America/Rankin_Inlet" | "America/Recife" | "America/Regina" | "America/Resolute" | "America/Rio_Branco" | "America/Santarem" | "America/Santiago" | "America/Santo_Domingo" | "America/Sao_Paulo" | "America/Scoresbysund" | "America/Sitka" | "America/St_Barthelemy" | "America/St_Johns" | "America/St_Kitts" | "America/St_Lucia" | "America/St_Thomas" | "America/St_Vincent" | "America/Swift_Current" | "America/Tegucigalpa" | "America/Thule" | "America/Thunder_Bay" | "America/Tijuana" | "America/Toronto" | "America/Tortola" | "America/Vancouver" | "America/Whitehorse" | "America/Winnipeg" | "America/Yakutat" | "America/Yellowknife" | "Antarctica/Casey" | "Antarctica/Davis" | "Antarctica/DumontDUrville" | "Antarctica/Macquarie" | "Antarctica/Mawson" | "Antarctica/McMurdo" | "Antarctica/Palmer" | "Antarctica/Rothera" | "Antarctica/Syowa" | "Antarctica/Troll" | "Antarctica/Vostok" | "Arctic/Longyearbyen" | "Asia/Aden" | "Asia/Almaty" | "Asia/Amman" | "Asia/Anadyr" | "Asia/Aqtau" | "Asia/Aqtobe" | "Asia/Ashgabat" | "Asia/Atyrau" | "Asia/Baghdad" | "Asia/Bahrain" | "Asia/Baku" | "Asia/Bangkok" | "Asia/Barnaul" | "Asia/Beirut" | "Asia/Bishkek" | "Asia/Brunei" | "Asia/Chita" | "Asia/Choibalsan" | "Asia/Colombo" | "Asia/Damascus" | "Asia/Dhaka" | "Asia/Dili" | "Asia/Dubai" | "Asia/Dushanbe" | "Asia/Famagusta" | "Asia/Gaza" | "Asia/Hebron" | "Asia/Ho_Chi_Minh" | "Asia/Hong_Kong" | "Asia/Hovd" | "Asia/Irkutsk" | "Asia/Jakarta" | "Asia/Jayapura" | "Asia/Jerusalem" | "Asia/Kabul" | "Asia/Kamchatka" | "Asia/Karachi" | "Asia/Kathmandu" | "Asia/Khandyga" | "Asia/Kolkata" | "Asia/Krasnoyarsk" | "Asia/Kuala_Lumpur" | "Asia/Kuching" | "Asia/Kuwait" | "Asia/Macau" | "Asia/Magadan" | "Asia/Makassar" | "Asia/Manila" | "Asia/Muscat" | "Asia/Nicosia" | "Asia/Novosibirsk" | "Asia/Omsk" | "Asia/Oral" | "Asia/Phnom_Penh" | "Asia/Pontianak" | "Asia/Pyongyang" | "Asia/Qatar" | "Asia/Qyzylorda" | "Asia/Riyadh" | "Asia/Sakhalin" | "Asia/Samarkand" | "Asia/Seoul" | "Asia/Shanghai" | "Asia/Singapore" | "Asia/Srednekolymsk" | "Asia/Taipei" | "Asia/Tashkent" | "Asia/Tbilisi" | "Asia/Tehran" | "Asia/Thimphu" | "Asia/Tokyo" | "Asia/Tomsk" | "Asia/Ulaanbaatar" | "Asia/Urumqi" | "Asia/Ust-Nera" | "Asia/Vientiane" | "Asia/Vladivostok" | "Asia/Yakutsk" | "Asia/Yangon" | "Asia/Yekaterinburg" | "Asia/Yerevan" | "Atlantic/Azores" | "Atlantic/Bermuda" | "Atlantic/Canary" | "Atlantic/Cape_Verde" | "Atlantic/Faroe" | "Atlantic/Madeira" | "Atlantic/Reykjavik" | "Atlantic/South_Georgia" | "Atlantic/St_Helena" | "Atlantic/Stanley" | "Australia/Adelaide" | "Australia/Brisbane" | "Australia/Broken_Hill" | "Australia/Currie" | "Australia/Darwin" | "Australia/Eucla" | "Australia/Hobart" | "Australia/Lindeman" | "Australia/Lord_Howe" | "Australia/Melbourne" | "Australia/Perth" | "Australia/Sydney" | "Canada/Atlantic" | "Canada/Central" | "Canada/Eastern" | "Canada/Mountain" | "Canada/Newfoundland" | "Canada/Pacific" | "Europe/Amsterdam" | "Europe/Andorra" | "Europe/Astrakhan" | "Europe/Athens" | "Europe/Belgrade" | "Europe/Berlin" | "Europe/Bratislava" | "Europe/Brussels" | "Europe/Bucharest" | "Europe/Budapest" | "Europe/Busingen" | "Europe/Chisinau" | "Europe/Copenhagen" | "Europe/Dublin" | "Europe/Gibraltar" | "Europe/Guernsey" | "Europe/Helsinki" | "Europe/Isle_of_Man" | "Europe/Istanbul" | "Europe/Jersey" | "Europe/Kaliningrad" | "Europe/Kiev" | "Europe/Kyiv" | "Europe/Kirov" | "Europe/Lisbon" | "Europe/Ljubljana" | "Europe/London" | "Europe/Luxembourg" | "Europe/Madrid" | "Europe/Malta" | "Europe/Mariehamn" | "Europe/Minsk" | "Europe/Monaco" | "Europe/Moscow" | "Europe/Oslo" | "Europe/Paris" | "Europe/Podgorica" | "Europe/Prague" | "Europe/Riga" | "Europe/Rome" | "Europe/Samara" | "Europe/San_Marino" | "Europe/Sarajevo" | "Europe/Saratov" | "Europe/Simferopol" | "Europe/Skopje" | "Europe/Sofia" | "Europe/Stockholm" | "Europe/Tallinn" | "Europe/Tirane" | "Europe/Ulyanovsk" | "Europe/Uzhgorod" | "Europe/Vaduz" | "Europe/Vatican" | "Europe/Vienna" | "Europe/Vilnius" | "Europe/Volgograd" | "Europe/Warsaw" | "Europe/Zagreb" | "Europe/Zaporozhye" | "Europe/Zaporizhia" | "Europe/Zurich" | "GMT" | "Indian/Antananarivo" | "Indian/Chagos" | "Indian/Christmas" | "Indian/Cocos" | "Indian/Comoro" | "Indian/Kerguelen" | "Indian/Mahe" | "Indian/Maldives" | "Indian/Mauritius" | "Indian/Mayotte" | "Indian/Reunion" | "Pacific/Apia" | "Pacific/Auckland" | "Pacific/Bougainville" | "Pacific/Chatham" | "Pacific/Chuuk" | "Pacific/Easter" | "Pacific/Efate" | "Pacific/Enderbury" | "Pacific/Fakaofo" | "Pacific/Fiji" | "Pacific/Funafuti" | "Pacific/Galapagos" | "Pacific/Gambier" | "Pacific/Guadalcanal" | "Pacific/Guam" | "Pacific/Honolulu" | "Pacific/Kiritimati" | "Pacific/Kosrae" | "Pacific/Kwajalein" | "Pacific/Majuro" | "Pacific/Marquesas" | "Pacific/Midway" | "Pacific/Nauru" | "Pacific/Niue" | "Pacific/Norfolk" | "Pacific/Noumea" | "Pacific/Pago_Pago" | "Pacific/Palau" | "Pacific/Pitcairn" | "Pacific/Pohnpei" | "Pacific/Port_Moresby" | "Pacific/Rarotonga" | "Pacific/Saipan" | "Pacific/Tahiti" | "Pacific/Tarawa" | "Pacific/Tongatapu" | "Pacific/Wake" | "Pacific/Wallis" | "US/Alaska" | "US/Arizona" | "US/Central" | "US/Eastern" | "US/Hawaii" | "US/Mountain" | "US/Pacific" | "UTC";
export type Native__schema192 = (Native__schema161) | (null);
export type Native__schema193 = boolean;
export type Native__schema194 = "CAPITALIZE" | "UPPER" | "LOWER";
export type Native__schema195 = string;
export type Native__schema196 = "id" | "ms" | "bs" | "bg" | "da" | "de" | "et" | "en" | "es" | "fr" | "hr" | "it" | "lv" | "lt" | "hu" | "nl" | "no" | "pl" | "pt" | "ro" | "sk" | "sl" | "sr" | "fi" | "sv" | "vi" | "tr" | "cz" | "el" | "ru" | "uk" | "he" | "ar" | "th" | "zh" | "ja" | "ko";
export type Native__schema197 = boolean;
export type Native__schema198 = "arial,'helvetica neue',helvetica,sans-serif" | "'comic sans ms','marker felt-thin',arial,sans-serif" | "'courier new',courier,'lucida sans typewriter','lucida typewriter',monospace" | "georgia,times,'times new roman',serif" | "helvetica,'helvetica neue',arial,verdana,sans-serif" | "'lucida sans unicode','lucida grande',sans-serif" | "tahoma,verdana,segoe,sans-serif" | "'times new roman',times,baskerville,georgia,serif" | "'trebuchet ms','lucida grande','lucida sans unicode','lucida sans',tahoma,sans-serif" | "verdana,geneva,sans-serif" | "arvo,courier,georgia,serif" | "lato,'helvetica neue',helvetica,arial,sans-serif" | "lora,georgia,'times new roman',serif" | "merriweather,georgia,'times new roman',serif" | "'merriweather sans','helvetica neue',helvetica,arial,sans-serif" | "'noticia text',georgia,'times new roman',serif" | "'open sans','helvetica neue',helvetica,arial,sans-serif" | "'playfair display',georgia,'times new roman',serif" | "roboto,'helvetica neue',helvetica,arial,sans-serif" | "'source sans pro','helvetica neue',helvetica,arial,sans-serif";
export type Native__schema199 = number;
export type Native__schema200 = {
    "days": NativeColorValueDisallowTransparent;
    "hours": NativeColorValueDisallowTransparent;
    "minutes": NativeColorValueDisallowTransparent;
    "seconds": NativeColorValueDisallowTransparent;
};
export type Native__schema201 = {
    "days": NativeColorValueDisallowTransparent;
    "hours": NativeColorValueDisallowTransparent;
    "minutes": NativeColorValueDisallowTransparent;
    "seconds": NativeColorValueDisallowTransparent;
};
export type Native__schema202 = {
    "days": NativeColorValueDisallowTransparent;
    "hours": NativeColorValueDisallowTransparent;
    "minutes": NativeColorValueDisallowTransparent;
    "seconds": NativeColorValueDisallowTransparent;
};
export type NativeSocialBlock = {
    "id": Native__schema145;
    "type": Native__schema203;
    "settings": Native__schema204;
};
export type Native__schema203 = "social";
export type Native__schema204 = {
    "networks": Native__schema205;
    "style": Native__schema213;
    "iconSize": Native__schema214;
    "spaceBetweenIcons": Native__schema215;
    "textCustomization": Native__schema218;
    "alignment": Native__schema219;
    "backgroundColor": NativeColorValueAllowTransparent;
    "hideElement": NativeHideElement;
    "margins": Native__schema220;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema179;
};
export type Native__schema205 = Array<Native__schema206>;
export type Native__schema206 = {
    "type": Native__schema207;
    "link"?: Native__schema208;
    "icon"?: Native__schema210;
    "title": Native__schema211;
    "alt"?: Native__schema212;
};
export type Native__schema207 = "twitter" | "xcom" | "facebook" | "youtube" | "askfm" | "behance" | "dribbble" | "flickr" | "foursquare" | "googleplus" | "instagram" | "lastfm" | "linkedin" | "myspace" | "pinterest" | "soundcloud" | "tumblr" | "vimeo" | "hangouts" | "messenger" | "skype" | "snapchat" | "telegram" | "viber" | "whatsapp" | "email" | "website" | "mapmarker" | "world" | "address" | "phone" | "share" | "rss" | "appstore" | "googleplay" | "windowsstore" | "wechat" | "weibo" | "blogger" | "medium" | "dropbox" | "googledrive" | "slack" | "github" | "pdf" | "doc" | "xls" | "ppt" | "xing" | "meetup" | "fleeped" | "tripAdvisor" | "spotify" | "tiktok" | "workplace" | "gmail" | "iTunesPodcasts" | "zoom" | "teams" | "onedrive" | "discord" | "twitch" | "line" | "patreon" | "kofi" | "yammer" | "buyMeACoffee" | "huaweiAppGallery" | "googleBusiness" | "reddit" | "strava" | "goodreads" | "custom" | "yelp" | "google" | "mastodon" | "glassdoor" | "threads" | "bluesky" | "digg" | "meet";
export type Native__schema208 = {
    "type": Native__schema162;
    "href": Native__schema209;
};
export type Native__schema209 = string;
export type Native__schema210 = string;
export type Native__schema211 = string;
export type Native__schema212 = string;
export type Native__schema213 = "custom" | "logoColored" | "logoBlack" | "logoGray" | "logoWhite" | "circleColored" | "circleColoredBordered" | "roundedColored" | "roundedColoredBordered" | "squareColored" | "squareColoredBordered" | "circleBlack" | "circleBlackBordered" | "roundedBlack" | "roundedBlackBordered" | "squareBlack" | "squareBlackBordered" | "circleGray" | "circleGrayBordered" | "roundedGray" | "roundedGrayBordered" | "squareGray" | "squareGrayBordered" | "circleWhite" | "circleWhiteBordered" | "roundedWhite" | "roundedWhiteBordered" | "squareWhite" | "squareWhiteBordered";
export type Native__schema214 = number;
export type Native__schema215 = {
    "desktop": Native__schema216;
    "mobile": Native__schema217;
};
export type Native__schema216 = number;
export type Native__schema217 = number;
export type Native__schema218 = boolean;
export type Native__schema219 = {
    "desktop": Native__schema74;
    "mobile": Native__schema74;
};
export type Native__schema220 = {
    "desktop": Native__schema221;
    "mobile": Native__schema221;
};
export type Native__schema221 = {
    "top": Native__schema222;
    "right": Native__schema223;
    "bottom": Native__schema224;
    "left": Native__schema225;
};
export type Native__schema222 = number;
export type Native__schema223 = number;
export type Native__schema224 = number;
export type Native__schema225 = number;
export type NativeHtmlBlock = {
    "id": Native__schema145;
    "type": Native__schema226;
    "settings": Native__schema227;
    "content"?: Native__schema228;
};
export type Native__schema226 = "html";
export type Native__schema227 = {
    "margins": Native__schema173;
    "includeInOutput": NativeOutputInclusion;
    "hideElement": NativeHideElement;
    "anchorLinkName": Native__schema179;
};
export type Native__schema228 = string;
export type NativeButtonBlock = {
    "id": Native__schema145;
    "type": Native__schema229;
    "settings": NativeButtonBlockSettings;
};
export type Native__schema229 = "button";
export type NativeButtonBlockSettings = {
    "link"?: Native__schema230;
    "text": Native__schema242;
    "alignment": Native__schema243;
    "fixedHeight"?: Native__schema244;
    "icon"?: Native__schema247;
    "hideElement": NativeHideElement;
    "padding": Native__schema252;
    "margins": Native__schema252;
    "includeInOutput": NativeOutputInclusion;
    "anchorLink": Native__schema255;
    "backgroundColor": NativeColorValueAllowTransparent;
    "fontFamily": Native__schema8;
    "fontSize": NativeFontSize;
    "textStyle": NativeButtonsTextStyle;
    "fitContainer": NativeResponsiveBoolean;
    "blockBackgroundColor": NativeColorValueAllowTransparent;
    "borderRadius": NativeBorderRadius;
    "border": NativeBorder;
    "fontColor": NativeColorValueDisallowTransparent;
};
export type Native__schema230 = (Native__schema232) | (Native__schema235);
export type Native__schema231 = (Native__schema232) | (Native__schema235);
export type Native__schema232 = {
    "type": Native__schema233;
    "value": Native__schema234;
};
export type Native__schema233 = "site" | "anchor" | "email" | "phone" | "sms" | "telegram" | "viber" | "file" | "other";
export type Native__schema234 = string;
export type Native__schema235 = {
    "type": Native__schema236;
    "value": Native__schema237;
    "salesforce": Native__schema238;
};
export type Native__schema236 = "salesforce_mc";
export type Native__schema237 = string;
export type Native__schema238 = {
    "trackingAlias": Native__schema239;
    "linkTo": Native__schema240;
    "conversion": Native__schema241;
};
export type Native__schema239 = string;
export type Native__schema240 = string;
export type Native__schema241 = boolean;
export type Native__schema242 = string;
export type Native__schema243 = {
    "desktop": Native__schema74;
    "mobile": Native__schema74;
};
export type Native__schema244 = {
    "height": Native__schema245;
    "alignment"?: Native__schema246;
};
export type Native__schema245 = number;
export type Native__schema246 = "top" | "middle" | "bottom";
export type Native__schema247 = {
    "src": Native__schema248;
    "width": Native__schema249;
    "align": Native__schema250;
    "indent": Native__schema251;
};
export type Native__schema248 = string;
export type Native__schema249 = number;
export type Native__schema250 = "left" | "right";
export type Native__schema251 = number;
export type Native__schema252 = {
    "desktop": Native__schema253;
    "mobile": Native__schema253;
};
export type Native__schema253 = {
    "top": Native__schema254;
    "right": Native__schema254;
    "bottom": Native__schema254;
    "left": Native__schema254;
};
export type Native__schema254 = number;
export type Native__schema255 = string;
export type NativeSpacerBlock = {
    "id": Native__schema145;
    "type": Native__schema256;
    "settings": Native__schema257;
};
export type Native__schema256 = "spacer";
export type Native__schema257 = {
    "mode": Native__schema258;
    "width"?: Native__schema259;
    "height"?: Native__schema265;
    "border"?: Native__schema268;
    "alignment"?: Native__schema270;
    "backgroundColor": NativeColorValueAllowTransparent;
    "margins": Native__schema271;
    "anchorLinkName": Native__schema179;
    "includeInOutput": NativeOutputInclusion;
    "hideElement": NativeHideElement;
};
export type Native__schema258 = "line" | "space";
export type Native__schema259 = {
    "desktop": Native__schema260;
    "mobile": Native__schema264;
};
export type Native__schema260 = {
    "value": Native__schema261;
    "unit": Native__schema262;
};
export type Native__schema261 = number;
export type Native__schema262 = "percent" | "px";
export type Native__schema263 = {
    "value": Native__schema261;
    "unit": Native__schema262;
};
export type Native__schema264 = {
    "value": Native__schema261;
    "unit": Native__schema262;
};
export type Native__schema265 = {
    "desktop": Native__schema266;
    "mobile": Native__schema267;
};
export type Native__schema266 = number;
export type Native__schema267 = number;
export type Native__schema268 = {
    "size": Native__schema269;
    "style": Native__schema106;
    "color": NativeColorValueDisallowTransparent;
};
export type Native__schema269 = number;
export type Native__schema270 = {
    "desktop": Native__schema74;
    "mobile": Native__schema74;
};
export type Native__schema271 = {
    "desktop": Native__schema272;
    "mobile": Native__schema272;
};
export type Native__schema272 = {
    "top": Native__schema273;
    "right": Native__schema274;
    "bottom": Native__schema275;
    "left": Native__schema276;
};
export type Native__schema273 = number;
export type Native__schema274 = number;
export type Native__schema275 = number;
export type Native__schema276 = number;
export type NativeMenuBlock = {
    "id": Native__schema145;
    "type": Native__schema277;
    "settings": NativeMenuBlockSettings;
};
export type Native__schema277 = "menu";
export type NativeMenuBlockSettings = {
    "responsiveMenu": Native__schema278;
    "itemType": Native__schema279;
    "fitToContainer": Native__schema282;
    "itemPadding": Native__schema283;
    "margins": Native__schema283;
    "anchorLinkName": Native__schema179;
    "includeInOutput": NativeOutputInclusion;
    "separator": NativeMenuSeparator;
    "fontFamily": Native__schema8;
    "fontSize": NativeFontSize;
    "hideElement": NativeHideElement;
    "textStyle": NativeButtonsTextStyle;
    "colors": Native__schema288;
    "items": Native__schema291;
};
export type Native__schema278 = boolean;
export type Native__schema279 = (Native__schema280) | (Native__schema281);
export type Native__schema280 = {
    "mode": "shared";
    "type": NativeMenuItemType;
};
export type NativeMenuItemType = "links" | "icons" | "linksWithIcons";
export type Native__schema281 = {
    "mode": "perItem";
};
export type Native__schema282 = boolean;
export type Native__schema283 = {
    "desktop": Native__schema284;
    "mobile": Native__schema284;
};
export type Native__schema284 = {
    "top": Native__schema285;
    "right": Native__schema285;
    "bottom": Native__schema285;
    "left": Native__schema285;
};
export type Native__schema285 = number;
export type NativeMenuSeparator = {
    "width": Native__schema286;
    "style": Native__schema287;
    "color": NativeColorValueDisallowTransparent;
};
export type Native__schema286 = number;
export type Native__schema287 = "none" | "line" | "dashed" | "dotted";
export type Native__schema288 = (Native__schema289) | (Native__schema290);
export type Native__schema289 = {
    "mode": "shared";
    "link": NativeColorValueDisallowTransparent;
};
export type Native__schema290 = {
    "mode": "perItem";
};
export type Native__schema291 = Array<NativeMenuItem>;
export type NativeMenuItem = {
    "type"?: Native__schema292;
    "name": Native__schema293;
    "link": NativeMenuLink;
    "image"?: Native__schema296;
    "hideElement": NativeHideElement;
    "colors"?: Native__schema303;
};
export type Native__schema292 = "links" | "icons" | "linksWithIcons";
export type Native__schema293 = string;
export type NativeMenuLink = {
    "type": Native__schema294;
    "value": Native__schema295;
};
export type Native__schema294 = "site" | "email" | "phone" | "anchor";
export type Native__schema295 = string;
export type Native__schema296 = {
    "src": Native__schema297;
    "size": NativeMenuImageSize;
    "alignment": Native__schema300;
    "indent": Native__schema301;
    "altText": Native__schema302;
};
export type NativeMenuItemImage = {
    "src": Native__schema297;
    "size": NativeMenuImageSize;
    "alignment": Native__schema300;
    "indent": Native__schema301;
    "altText": Native__schema302;
};
export type Native__schema297 = string;
export type NativeMenuImageSize = {
    "mode": Native__schema298;
    "px": Native__schema299;
};
export type Native__schema298 = "width" | "height";
export type Native__schema299 = number;
export type Native__schema300 = "left" | "center" | "right";
export type Native__schema301 = number;
export type Native__schema302 = string;
export type Native__schema303 = {
    "link": NativeColorValueDisallowTransparent;
    "background": NativeColorValueAllowTransparent;
};
export type NativeUnknownBlock = {
    "id": Native__schema145;
    "type": Native__schema304;
    "settings"?: Native__schema305;
    "content": Native__schema308;
    "extension": Native__schema309;
};
export type Native__schema304 = "unknown";
export type Native__schema305 = {
    [key: string]: Native__schema307;
};
export type Native__schema306 = string;
export type Native__schema307 = unknown;
export type Native__schema308 = string;
export type Native__schema309 = boolean;
export type DocumentState = {
    "metadata"?: Native__schema0;
    "resources"?: Native__schema5;
    "settings": Native__schema11;
    "stripes"?: Native__schema109;
};
export type DocumentBlock = NativeBlock;
export type BlockKind = DocumentBlock['type'];
export type BlockOf<K extends BlockKind> = Extract<DocumentBlock, {
    type: K;
}>;
export type BlockSettings<K extends BlockKind> = BlockOf<K>['settings'];

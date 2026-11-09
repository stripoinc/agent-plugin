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
    "general": {
        "defaultStyles": boolean;
        "hideImageDownloadIcons": boolean;
        "underlineLinks": boolean;
        "responsiveDesign": boolean;
        "messageAlignment": "left" | "center" | "right";
        "messageContentWidth": number;
        "backgroundImage": ({
            "path": string;
            "repeat": boolean;
            "x": string;
            "y": string;
            "sizeX": string;
            "sizeY": string;
        }) | (null);
        "rightToLeftTextDirection": boolean;
        "marginsAroundMessage": {
            "desktop": {
                "top": number;
                "right": number;
                "bottom": number;
                "left": number;
            };
            "mobile": {
                "top": number;
                "right": number;
                "bottom": number;
                "left": number;
            };
        };
        "defaultStructurePadding": {
            "desktop": {
                "top": number;
                "right": number;
                "bottom": number;
                "left": number;
            };
            "mobile": {
                "top": number;
                "right": number;
                "bottom": number;
                "left": number;
            };
        };
        "customListStyles": ({
            "leftIndent": number;
            "listItemsBottomSpace": number;
            "listTopBottomMargin": number;
        }) | (null);
        "lightTheme": {
            "backgroundColor": string;
            "customListStyles": {
                "listMarkerColor": string;
                "listNumberMarkerColor": string;
            };
        };
        "darkTheme": {
            "backgroundColor": string | null;
            "customListStyles": {
                "listMarkerColor": string | null;
                "listNumberMarkerColor": string | null;
            };
            "backgroundImage"?: string | null;
        };
    };
    "stripes": {
        "letterSpacing": {
            "value": number;
            "unit": "px" | "em";
        };
        "lineHeight": {
            "desktop": number;
            "mobile": number;
        };
        "fontFamily": string;
        "fontWeight": number;
        "header": {
            "fontSize": {
                "desktop": number;
                "mobile": number;
            };
            "paragraphBottomSpace": ({
                "desktop": number;
                "mobile": number;
            }) | (null);
            "backgroundImage": ({
                "path": string;
                "repeat": boolean;
                "x": string;
                "y": string;
                "sizeX": string;
                "sizeY": string;
            }) | (null);
        };
        "content": {
            "fontSize": {
                "desktop": number;
                "mobile": number;
            };
            "paragraphBottomSpace": ({
                "desktop": number;
                "mobile": number;
            }) | (null);
        };
        "footer": {
            "fontSize": {
                "desktop": number;
                "mobile": number;
            };
            "paragraphBottomSpace": ({
                "desktop": number;
                "mobile": number;
            }) | (null);
            "backgroundImage": ({
                "path": string;
                "repeat": boolean;
                "x": string;
                "y": string;
                "sizeX": string;
                "sizeY": string;
            }) | (null);
        };
        "infoArea": {
            "fontSize": {
                "desktop": number;
                "mobile": number;
            };
            "paragraphBottomSpace": ({
                "desktop": number;
                "mobile": number;
            }) | (null);
        };
        "lightTheme": {
            "header": {
                "stripeBackgroundColor": string;
                "contentBackgroundColor": string;
                "fontColor": string;
                "linkColor": string;
                "linkColorHover": string;
            };
            "content": {
                "contentBackgroundColor": string;
                "fontColor": string;
                "linkColor": string;
                "linkColorHover": string;
            };
            "footer": {
                "stripeBackgroundColor": string;
                "contentBackgroundColor": string;
                "fontColor": string;
                "linkColor": string;
                "linkColorHover": string;
            };
            "infoArea": {
                "fontColor": string;
                "linkColor": string;
                "linkColorHover": string;
            };
        };
        "darkTheme": {
            "header": {
                "stripeBackgroundColor": string | null;
                "contentBackgroundColor": string | null;
                "fontColor": string | null;
                "linkColor": string | null;
                "linkColorHover": string | null;
            };
            "content": {
                "contentBackgroundColor": string | null;
                "fontColor": string | null;
                "linkColor": string | null;
                "linkColorHover": string | null;
            };
            "footer": {
                "stripeBackgroundColor": string | null;
                "contentBackgroundColor": string | null;
                "fontColor": string | null;
                "linkColor": string | null;
                "linkColorHover": string | null;
            };
            "infoArea": {
                "fontColor": string | null;
                "linkColor": string | null;
                "linkColorHover": string | null;
            };
        };
    };
    "headings": {
        "letterSpacing": {
            "value": number;
            "unit": "px" | "em";
        };
        "fontFamily": string;
        "h1": {
            "textAlign": {
                "mobile": ("left" | "center" | "right") | (null);
            };
            "textStyle": {
                "italic": boolean;
            };
            "fontWeight": (number) | (null);
            "fontSize": {
                "desktop": (number) | (null);
                "mobile": (number) | (null);
            };
            "lineHeight": {
                "desktop": (number) | (null);
                "mobile": (number) | (null);
            };
            "paragraphBottomSpace": ({
                "desktop": number;
                "mobile": number;
            }) | (null);
        };
        "h2": {
            "textAlign": {
                "mobile": ("left" | "center" | "right") | (null);
            };
            "textStyle": {
                "italic": boolean;
            };
            "fontWeight": (number) | (null);
            "fontSize": {
                "desktop": (number) | (null);
                "mobile": (number) | (null);
            };
            "lineHeight": {
                "desktop": (number) | (null);
                "mobile": (number) | (null);
            };
            "paragraphBottomSpace": ({
                "desktop": number;
                "mobile": number;
            }) | (null);
        };
        "h3": {
            "textAlign": {
                "mobile": ("left" | "center" | "right") | (null);
            };
            "textStyle": {
                "italic": boolean;
            };
            "fontWeight": (number) | (null);
            "fontSize": {
                "desktop": (number) | (null);
                "mobile": (number) | (null);
            };
            "lineHeight": {
                "desktop": (number) | (null);
                "mobile": (number) | (null);
            };
            "paragraphBottomSpace": ({
                "desktop": number;
                "mobile": number;
            }) | (null);
        };
        "h4": {
            "textAlign": {
                "mobile": ("left" | "center" | "right") | (null);
            };
            "textStyle": {
                "italic": boolean;
            };
            "fontWeight": (number) | (null);
            "fontSize": {
                "desktop": (number) | (null);
                "mobile": (number) | (null);
            };
            "lineHeight": {
                "desktop": (number) | (null);
                "mobile": (number) | (null);
            };
            "paragraphBottomSpace": ({
                "desktop": number;
                "mobile": number;
            }) | (null);
        };
        "h5": {
            "textAlign": {
                "mobile": ("left" | "center" | "right") | (null);
            };
            "textStyle": {
                "italic": boolean;
            };
            "fontWeight": (number) | (null);
            "fontSize": {
                "desktop": (number) | (null);
                "mobile": (number) | (null);
            };
            "lineHeight": {
                "desktop": (number) | (null);
                "mobile": (number) | (null);
            };
            "paragraphBottomSpace": ({
                "desktop": number;
                "mobile": number;
            }) | (null);
        };
        "h6": {
            "textAlign": {
                "mobile": ("left" | "center" | "right") | (null);
            };
            "textStyle": {
                "italic": boolean;
            };
            "fontWeight": (number) | (null);
            "fontSize": {
                "desktop": (number) | (null);
                "mobile": (number) | (null);
            };
            "lineHeight": {
                "desktop": (number) | (null);
                "mobile": (number) | (null);
            };
            "paragraphBottomSpace": ({
                "desktop": number;
                "mobile": number;
            }) | (null);
        };
        "lightTheme": {
            "h1": {
                "fontColor": string;
            };
            "h2": {
                "fontColor": string;
            };
            "h3": {
                "fontColor": string;
            };
            "h4": {
                "fontColor": string;
            };
            "h5": {
                "fontColor": string;
            };
            "h6": {
                "fontColor": string;
            };
        };
        "darkTheme": {
            "h1": {
                "fontColor": string | null;
            };
            "h2": {
                "fontColor": string | null;
            };
            "h3": {
                "fontColor": string | null;
            };
            "h4": {
                "fontColor": string | null;
            };
            "h5": {
                "fontColor": string | null;
            };
            "h6": {
                "fontColor": string | null;
            };
        };
    };
    "buttons": {
        "outlookSupport": boolean;
        "textStyle": {
            "bold": boolean;
            "italic": boolean;
        };
        "textTransform": "none" | "uppercase" | "capitalize" | "lowercase";
        "fontFamily": string;
        "letterSpacing": {
            "value": number;
            "unit": "px" | "em";
        };
        "fontSize": {
            "desktop": number;
            "mobile": number;
        };
        "borderRadius": {
            "topLeft": number;
            "topRight": number;
            "bottomRight": number;
            "bottomLeft": number;
        };
        "fitContainer": {
            "desktop": boolean;
            "mobile": boolean;
        };
        "border": {
            "top": {
                "width": number;
            };
            "right": {
                "width": number;
            };
            "bottom": {
                "width": number;
            };
            "left": {
                "width": number;
            };
            "style": "solid" | "dashed" | "dotted";
        };
        "hoverButtonStyles": boolean;
        "padding": {
            "desktop": {
                "top": number;
                "right": number;
                "bottom": number;
                "left": number;
            };
            "mobile": {
                "top": number;
                "right": number;
                "bottom": number;
                "left": number;
            };
        };
        "lightTheme": {
            "buttonColor": string;
            "fontColor": string;
            "hoverButtonStyles": {
                "backgroundColor": string;
                "fontColor": string;
                "borderColor": {
                    "top": string;
                    "right": string;
                    "bottom": string;
                    "left": string;
                };
            };
            "borderColor": {
                "top": string;
                "right": string;
                "bottom": string;
                "left": string;
            };
        };
        "darkTheme": {
            "buttonColor": string | null;
            "fontColor": string | null;
            "hoverButtonStyles": {
                "backgroundColor": string | null;
                "fontColor": string | null;
                "borderColor": {
                    "top": string | null;
                    "right": string | null;
                    "bottom": string | null;
                    "left": string | null;
                };
            };
            "borderColor": {
                "top": string | null;
                "right": string | null;
                "bottom": string | null;
                "left": string | null;
            };
        };
    };
};
export type Native__schema12 = Array<NativeStripe>;
export type Native__schema13 = Array<NativeStripe>;
export type NativeStripe = {
    "id": Native__schema14;
    "settings"?: Native__schema15;
    "moduleId"?: Native__schema42;
    "structures"?: Native__schema43;
};
export type Native__schema14 = string;
export type Native__schema15 = {
    "messageArea"?: Native__schema16;
    "includeInOutput"?: Native__schema17;
    "hideElement": NativeHideElement;
    "padding"?: Native__schema18;
    "stripeBackgroundColor"?: Native__schema23;
    "contentBackgroundColor"?: Native__schema24;
    "backgroundImage"?: Native__schema25;
    "contentBorder"?: Native__schema35;
    "darkTheme"?: Native__schema38;
};
export type NativeStripeSettings = {
    "messageArea"?: Native__schema16;
    "includeInOutput"?: Native__schema17;
    "hideElement": NativeHideElement;
    "padding"?: Native__schema18;
    "stripeBackgroundColor"?: Native__schema23;
    "contentBackgroundColor"?: Native__schema24;
    "backgroundImage"?: Native__schema25;
    "contentBorder"?: Native__schema35;
    "darkTheme"?: Native__schema38;
};
export type Native__schema16 = "header" | "content" | "footer" | "infoArea";
export type Native__schema17 = "both" | "html" | "ampHtml";
export type NativeOutputInclusion = "both" | "html" | "ampHtml";
export type NativeHideElement = "no" | "desktop" | "mobile";
export type Native__schema18 = {
    "mobile": NativeFullSideValues;
};
export type NativeMobilePadding = {
    "mobile": NativeFullSideValues;
};
export type NativeFullSideValues = {
    "top": Native__schema19;
    "right": Native__schema20;
    "bottom": Native__schema21;
    "left": Native__schema22;
};
export type Native__schema19 = number;
export type Native__schema20 = number;
export type Native__schema21 = number;
export type Native__schema22 = number;
export type Native__schema23 = string;
export type NativeColorValueAllowTransparent = string;
export type Native__schema24 = string;
export type Native__schema25 = {
    "path": Native__schema26;
    "repeat": boolean;
    "x": Native__schema29;
    "y": Native__schema30;
    "sizeX": string;
    "sizeY": string;
};
export type NativeBackgroundImage = {
    "path": Native__schema26;
    "repeat": boolean;
    "x": Native__schema29;
    "y": Native__schema30;
    "sizeX": string;
    "sizeY": string;
};
export type Native__schema26 = string;
export type Native__schema27 = boolean | string;
export type Native__schema28 = boolean | string;
export type Native__schema29 = string;
export type Native__schema30 = string;
export type Native__schema31 = string;
export type Native__schema32 = string;
export type Native__schema33 = string;
export type Native__schema34 = string;
export type Native__schema35 = {
    "top": NativeBorderSide;
    "right": NativeBorderSide;
    "bottom": NativeBorderSide;
    "left": NativeBorderSide;
    "style": Native__schema37;
};
export type NativeBorder = {
    "top": NativeBorderSide;
    "right": NativeBorderSide;
    "bottom": NativeBorderSide;
    "left": NativeBorderSide;
    "style": Native__schema37;
};
export type NativeBorderSide = {
    "width": Native__schema36;
    "color": NativeColorValueAllowTransparent;
};
export type Native__schema36 = number;
export type Native__schema37 = "solid" | "dashed" | "dotted";
export type Native__schema38 = {
    "stripeBackgroundColor"?: Native__schema39;
    "contentBackgroundColor"?: Native__schema40;
    "backgroundImage"?: Native__schema41;
};
export type Native__schema39 = (NativeColorValueAllowTransparent) | (null);
export type Native__schema40 = (NativeColorValueAllowTransparent) | (null);
export type Native__schema41 = string | null;
export type Native__schema42 = number;
export type Native__schema43 = Array<NativeStructure>;
export type NativeStructure = {
    "id": Native__schema44;
    "settings"?: Native__schema45;
    "moduleId"?: Native__schema63;
    "columns"?: Native__schema64;
};
export type Native__schema44 = string;
export type Native__schema45 = {
    "backgroundColor": NativeColorValueAllowTransparent;
    "backgroundImage"?: Native__schema46;
    "border": NativeBorder;
    "borderRadius": NativeBorderRadius;
    "columnsGap"?: Native__schema51;
    "responsiveMobile"?: Native__schema54;
    "responsiveMobileContainersInversion"?: Native__schema55;
    "padding"?: Native__schema56;
    "margins"?: Native__schema57;
    "includeInOutput"?: Native__schema58;
    "hideElement"?: Native__schema59;
    "darkTheme"?: Native__schema60;
};
export type Native__schema46 = {
    "path": Native__schema26;
    "repeat": boolean;
    "x": Native__schema29;
    "y": Native__schema30;
    "sizeX": string;
    "sizeY": string;
};
export type NativeBorderRadius = {
    "topLeft": Native__schema47;
    "topRight": Native__schema48;
    "bottomRight": Native__schema49;
    "bottomLeft": Native__schema50;
};
export type Native__schema47 = number;
export type Native__schema48 = number;
export type Native__schema49 = number;
export type Native__schema50 = number;
export type Native__schema51 = {
    "desktop": Native__schema52;
    "mobile": Native__schema53;
};
export type NativeResponsiveNumber = {
    "desktop": Native__schema52;
    "mobile": Native__schema53;
};
export type Native__schema52 = number;
export type Native__schema53 = number;
export type Native__schema54 = boolean;
export type Native__schema55 = boolean;
export type Native__schema56 = {
    "desktop": NativeFullSideValues;
    "mobile": NativeFullSideValues;
};
export type NativeResponsivePadding = {
    "desktop": NativeFullSideValues;
    "mobile": NativeFullSideValues;
};
export type Native__schema57 = {
    "desktop": NativeFullSideValues;
    "mobile": NativeFullSideValues;
};
export type Native__schema58 = "both" | "html" | "ampHtml";
export type Native__schema59 = "no" | "desktop" | "mobile";
export type Native__schema60 = {
    "backgroundColor"?: Native__schema62;
    "backgroundImage"?: Native__schema41;
};
export type Native__schema61 = {
    "backgroundColor"?: Native__schema62;
    "backgroundImage"?: Native__schema41;
};
export type Native__schema62 = (NativeColorValueAllowTransparent) | (null);
export type Native__schema63 = number;
export type Native__schema64 = Array<NativeColumn>;
export type NativeColumn = {
    "id": Native__schema65;
    "settings"?: Native__schema66;
    "containers": Native__schema68;
};
export type Native__schema65 = string;
export type Native__schema66 = {
    "width": Native__schema67;
};
export type Native__schema67 = number;
export type Native__schema68 = Array<NativeContainer>;
export type NativeContainer = {
    "id": Native__schema69;
    "settings": Native__schema70;
    "moduleId"?: Native__schema73;
    "blocks"?: Native__schema74;
};
export type Native__schema69 = string;
export type Native__schema70 = {
    "padding": NativeResponsivePadding;
    "includeInOutput": NativeOutputInclusion;
    "hideElement": NativeHideElement;
    "backgroundColor": NativeColorValueAllowTransparent;
    "backgroundImage"?: Native__schema71;
    "border": NativeBorder;
    "radius": NativeBorderRadius;
    "darkTheme"?: Native__schema72;
};
export type Native__schema71 = {
    "path": Native__schema26;
    "repeat": boolean;
    "x": Native__schema29;
    "y": Native__schema30;
    "sizeX": string;
    "sizeY": string;
};
export type Native__schema72 = {
    "backgroundColor"?: Native__schema62;
    "backgroundImage"?: Native__schema41;
};
export type Native__schema73 = number;
export type Native__schema74 = Array<NativeBlock>;
export type NativeBlock = (NativeTextBlock) | (NativeImageBlock) | (NativeVideoBlock) | (NativeTimerBlock) | (NativeSocialBlock) | (NativeHtmlBlock) | (NativeButtonBlock) | (NativeSpacerBlock) | (NativeMenuBlock) | (NativeUnknownBlock);
export type NativeTextBlock = {
    "id": Native__schema75;
    "type": Native__schema76;
    "settings"?: Native__schema77;
    "content"?: Native__schema88;
};
export type Native__schema75 = string;
export type Native__schema76 = "text";
export type Native__schema77 = {
    "fontColor"?: string;
    "hideElement": NativeHideElement;
    "rightToLeftTextDirection": boolean;
    "alignment"?: {
        "desktop": Native__schema78;
        "mobile": Native__schema78;
    };
    "fixedHeight"?: {
        "desktop"?: Native__schema79;
        "mobile"?: Native__schema83;
    };
    "padding": {
        "desktop": Native__schema84;
        "mobile": Native__schema84;
    };
    "includeInOutput": NativeOutputInclusion;
    "backgroundColor": NativeColorValueAllowTransparent;
    "letterSpacing"?: {
        "value": Native__schema86;
        "unit": Native__schema87;
    };
};
export type NativeColorValueDisallowTransparent = string;
export type Native__schema78 = "left" | "center" | "right" | "justify";
export type Native__schema79 = {
    "height": Native__schema81;
    "verticalAlignment"?: Native__schema82;
};
export type Native__schema80 = {
    "height": Native__schema81;
    "verticalAlignment"?: Native__schema82;
};
export type Native__schema81 = number;
export type Native__schema82 = "top" | "middle" | "bottom";
export type Native__schema83 = {
    "height": Native__schema81;
    "verticalAlignment"?: Native__schema82;
};
export type Native__schema84 = {
    "top": Native__schema85;
    "right": Native__schema85;
    "bottom": Native__schema85;
    "left": Native__schema85;
};
export type Native__schema85 = number;
export type NativeSpacingValue = {
    "value": Native__schema86;
    "unit": Native__schema87;
};
export type Native__schema86 = number;
export type Native__schema87 = "px" | "em";
export type Native__schema88 = string;
export type NativeImageBlock = {
    "id": Native__schema75;
    "type": Native__schema89;
    "settings": Native__schema90;
};
export type Native__schema89 = "image";
export type Native__schema90 = {
    "src": Native__schema91;
    "link"?: Native__schema92;
    "altText": Native__schema96;
    "size": Native__schema99;
    "alignment": Native__schema103;
    "radius": Native__schema105;
    "hideElement": NativeHideElement;
    "margins": Native__schema106;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema112;
    "responsiveMobile": Native__schema113;
};
export type Native__schema91 = string;
export type Native__schema92 = {
    "type": Native__schema94;
    "href": Native__schema95;
};
export type Native__schema93 = {
    "type": Native__schema94;
    "href": Native__schema95;
};
export type Native__schema94 = "site" | "anchor" | "email" | "phone" | "file" | "sms" | "telegram" | "viber" | "other";
export type Native__schema95 = string;
export type Native__schema96 = {
    "text": Native__schema97;
    "addToTitle": Native__schema98;
};
export type Native__schema97 = string;
export type Native__schema98 = boolean;
export type Native__schema99 = {
    "desktop": Native__schema100;
    "mobile": Native__schema100;
};
export type Native__schema100 = {
    "mode": Native__schema101;
    "px": Native__schema102;
};
export type Native__schema101 = "width" | "height";
export type Native__schema102 = number;
export type Native__schema103 = {
    "desktop": Native__schema104;
    "mobile": Native__schema104;
};
export type Native__schema104 = "left" | "center" | "right";
export type Native__schema105 = {
    "desktop": NativeBorderRadius;
    "mobile": NativeBorderRadius;
};
export type Native__schema106 = {
    "desktop": Native__schema107;
    "mobile": Native__schema107;
};
export type Native__schema107 = {
    "top": Native__schema108;
    "right": Native__schema109;
    "bottom": Native__schema110;
    "left": Native__schema111;
};
export type Native__schema108 = number;
export type Native__schema109 = number;
export type Native__schema110 = number;
export type Native__schema111 = number;
export type Native__schema112 = string;
export type Native__schema113 = boolean;
export type NativeVideoBlock = {
    "id": Native__schema75;
    "type": Native__schema114;
    "settings": NativeVideoBlockSettings;
};
export type Native__schema114 = "video";
export type NativeVideoBlockSettings = {
    "videoLink": Native__schema115;
    "altText": Native__schema96;
    "customThumbnail"?: Native__schema116;
    "playButtonStyle": Native__schema118;
    "size": Native__schema99;
    "alignment": Native__schema103;
    "radius": Native__schema105;
    "hideElement": NativeHideElement;
    "paddings": Native__schema119;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema112;
    "responsiveMobile": Native__schema120;
};
export type Native__schema115 = string;
export type Native__schema116 = {
    "src": Native__schema117;
};
export type NativeVideoCustomThumbnail = {
    "src": Native__schema117;
};
export type Native__schema117 = string;
export type Native__schema118 = "NONE" | "red" | "white" | "black" | "blue" | "whiteCircle" | "blackCircle" | "greyCircle" | "blackCircleInverse";
export type Native__schema119 = {
    "desktop": Native__schema107;
    "mobile": Native__schema107;
};
export type Native__schema120 = boolean;
export type NativeTimerBlock = {
    "id": Native__schema75;
    "type": Native__schema121;
    "settings": NativeTimerBlockSettings;
};
export type Native__schema121 = "timer";
export type NativeTimerBlockSettings = {
    "altText": Native__schema96;
    "responsiveMobile": Native__schema122;
    "size": Native__schema99;
    "alignment": Native__schema103;
    "margins": Native__schema106;
    "endDate": Native__schema123;
    "timeZone": Native__schema124;
    "link": Native__schema125;
    "displayDays": Native__schema126;
    "labelsLetterCase"?: Native__schema127;
    "separator": Native__schema128;
    "labelsLanguage": Native__schema129;
    "retinaDisplaySupport": Native__schema130;
    "expirationImageSrc": Native__schema91;
    "hideElement": NativeHideElement;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema112;
    "digitsFontFamily": Native__schema131;
    "digitsFontSize": Native__schema132;
    "digitsFontColor": NativeColorValueDisallowTransparent;
    "digitsAdvancedColorSettings"?: Native__schema133;
    "labelsFontFamily": Native__schema131;
    "labelsFontSize": Native__schema132;
    "labelsFontColor": NativeColorValueDisallowTransparent;
    "labelsAdvancedColorSettings"?: Native__schema135;
    "separatorFontFamily": Native__schema131;
    "separatorFontSize": Native__schema132;
    "separatorFontColor": NativeColorValueDisallowTransparent;
    "backgroundColor": NativeColorValueAllowTransparent;
};
export type Native__schema122 = boolean;
export type Native__schema123 = string;
export type Native__schema124 = "Africa/Abidjan" | "Africa/Accra" | "Africa/Addis_Ababa" | "Africa/Algiers" | "Africa/Asmara" | "Africa/Bamako" | "Africa/Bangui" | "Africa/Banjul" | "Africa/Bissau" | "Africa/Blantyre" | "Africa/Brazzaville" | "Africa/Bujumbura" | "Africa/Cairo" | "Africa/Casablanca" | "Africa/Ceuta" | "Africa/Conakry" | "Africa/Dakar" | "Africa/Dar_es_Salaam" | "Africa/Djibouti" | "Africa/Douala" | "Africa/El_Aaiun" | "Africa/Freetown" | "Africa/Gaborone" | "Africa/Harare" | "Africa/Johannesburg" | "Africa/Juba" | "Africa/Kampala" | "Africa/Khartoum" | "Africa/Kigali" | "Africa/Kinshasa" | "Africa/Lagos" | "Africa/Libreville" | "Africa/Lome" | "Africa/Luanda" | "Africa/Lubumbashi" | "Africa/Lusaka" | "Africa/Malabo" | "Africa/Maputo" | "Africa/Maseru" | "Africa/Mbabane" | "Africa/Mogadishu" | "Africa/Monrovia" | "Africa/Nairobi" | "Africa/Ndjamena" | "Africa/Niamey" | "Africa/Nouakchott" | "Africa/Ouagadougou" | "Africa/Porto-Novo" | "Africa/Sao_Tome" | "Africa/Tripoli" | "Africa/Tunis" | "Africa/Windhoek" | "America/Adak" | "America/Anchorage" | "America/Anguilla" | "America/Antigua" | "America/Araguaina" | "America/Argentina/Buenos_Aires" | "America/Argentina/Catamarca" | "America/Argentina/Cordoba" | "America/Argentina/Jujuy" | "America/Argentina/La_Rioja" | "America/Argentina/Mendoza" | "America/Argentina/Rio_Gallegos" | "America/Argentina/Salta" | "America/Argentina/San_Juan" | "America/Argentina/San_Luis" | "America/Argentina/Tucuman" | "America/Argentina/Ushuaia" | "America/Aruba" | "America/Asuncion" | "America/Atikokan" | "America/Bahia" | "America/Bahia_Banderas" | "America/Barbados" | "America/Belem" | "America/Belize" | "America/Blanc-Sablon" | "America/Boa_Vista" | "America/Bogota" | "America/Boise" | "America/Cambridge_Bay" | "America/Campo_Grande" | "America/Cancun" | "America/Caracas" | "America/Cayenne" | "America/Cayman" | "America/Chicago" | "America/Chihuahua" | "America/Costa_Rica" | "America/Creston" | "America/Cuiaba" | "America/Curacao" | "America/Danmarkshavn" | "America/Dawson" | "America/Dawson_Creek" | "America/Denver" | "America/Detroit" | "America/Dominica" | "America/Edmonton" | "America/Eirunepe" | "America/El_Salvador" | "America/Fort_Nelson" | "America/Fortaleza" | "America/Glace_Bay" | "America/Godthab" | "America/Goose_Bay" | "America/Grand_Turk" | "America/Grenada" | "America/Guadeloupe" | "America/Guatemala" | "America/Guayaquil" | "America/Guyana" | "America/Halifax" | "America/Havana" | "America/Hermosillo" | "America/Indiana/Indianapolis" | "America/Indiana/Knox" | "America/Indiana/Marengo" | "America/Indiana/Petersburg" | "America/Indiana/Tell_City" | "America/Indiana/Vevay" | "America/Indiana/Vincennes" | "America/Indiana/Winamac" | "America/Inuvik" | "America/Iqaluit" | "America/Jamaica" | "America/Juneau" | "America/Kentucky/Louisville" | "Asia/Novokuznetsk" | "America/Kentucky/Monticello" | "America/Kralendijk" | "America/La_Paz" | "America/Lima" | "America/Los_Angeles" | "America/Lower_Princes" | "America/Maceio" | "America/Managua" | "America/Manaus" | "America/Marigot" | "America/Martinique" | "America/Matamoros" | "America/Mazatlan" | "America/Menominee" | "America/Merida" | "America/Metlakatla" | "America/Mexico_City" | "America/Miquelon" | "America/Moncton" | "America/Monterrey" | "America/Montevideo" | "America/Montserrat" | "America/Nassau" | "America/New_York" | "America/Nipigon" | "America/Nome" | "America/Noronha" | "America/North_Dakota/Beulah" | "America/North_Dakota/Center" | "America/North_Dakota/New_Salem" | "America/Ojinaga" | "America/Panama" | "America/Pangnirtung" | "America/Paramaribo" | "America/Phoenix" | "America/Port-au-Prince" | "America/Port_of_Spain" | "America/Porto_Velho" | "America/Puerto_Rico" | "America/Punta_Arenas" | "America/Rainy_River" | "America/Rankin_Inlet" | "America/Recife" | "America/Regina" | "America/Resolute" | "America/Rio_Branco" | "America/Santarem" | "America/Santiago" | "America/Santo_Domingo" | "America/Sao_Paulo" | "America/Scoresbysund" | "America/Sitka" | "America/St_Barthelemy" | "America/St_Johns" | "America/St_Kitts" | "America/St_Lucia" | "America/St_Thomas" | "America/St_Vincent" | "America/Swift_Current" | "America/Tegucigalpa" | "America/Thule" | "America/Thunder_Bay" | "America/Tijuana" | "America/Toronto" | "America/Tortola" | "America/Vancouver" | "America/Whitehorse" | "America/Winnipeg" | "America/Yakutat" | "America/Yellowknife" | "Antarctica/Casey" | "Antarctica/Davis" | "Antarctica/DumontDUrville" | "Antarctica/Macquarie" | "Antarctica/Mawson" | "Antarctica/McMurdo" | "Antarctica/Palmer" | "Antarctica/Rothera" | "Antarctica/Syowa" | "Antarctica/Troll" | "Antarctica/Vostok" | "Arctic/Longyearbyen" | "Asia/Aden" | "Asia/Almaty" | "Asia/Amman" | "Asia/Anadyr" | "Asia/Aqtau" | "Asia/Aqtobe" | "Asia/Ashgabat" | "Asia/Atyrau" | "Asia/Baghdad" | "Asia/Bahrain" | "Asia/Baku" | "Asia/Bangkok" | "Asia/Barnaul" | "Asia/Beirut" | "Asia/Bishkek" | "Asia/Brunei" | "Asia/Chita" | "Asia/Choibalsan" | "Asia/Colombo" | "Asia/Damascus" | "Asia/Dhaka" | "Asia/Dili" | "Asia/Dubai" | "Asia/Dushanbe" | "Asia/Famagusta" | "Asia/Gaza" | "Asia/Hebron" | "Asia/Ho_Chi_Minh" | "Asia/Hong_Kong" | "Asia/Hovd" | "Asia/Irkutsk" | "Asia/Jakarta" | "Asia/Jayapura" | "Asia/Jerusalem" | "Asia/Kabul" | "Asia/Kamchatka" | "Asia/Karachi" | "Asia/Kathmandu" | "Asia/Khandyga" | "Asia/Kolkata" | "Asia/Krasnoyarsk" | "Asia/Kuala_Lumpur" | "Asia/Kuching" | "Asia/Kuwait" | "Asia/Macau" | "Asia/Magadan" | "Asia/Makassar" | "Asia/Manila" | "Asia/Muscat" | "Asia/Nicosia" | "Asia/Novosibirsk" | "Asia/Omsk" | "Asia/Oral" | "Asia/Phnom_Penh" | "Asia/Pontianak" | "Asia/Pyongyang" | "Asia/Qatar" | "Asia/Qyzylorda" | "Asia/Riyadh" | "Asia/Sakhalin" | "Asia/Samarkand" | "Asia/Seoul" | "Asia/Shanghai" | "Asia/Singapore" | "Asia/Srednekolymsk" | "Asia/Taipei" | "Asia/Tashkent" | "Asia/Tbilisi" | "Asia/Tehran" | "Asia/Thimphu" | "Asia/Tokyo" | "Asia/Tomsk" | "Asia/Ulaanbaatar" | "Asia/Urumqi" | "Asia/Ust-Nera" | "Asia/Vientiane" | "Asia/Vladivostok" | "Asia/Yakutsk" | "Asia/Yangon" | "Asia/Yekaterinburg" | "Asia/Yerevan" | "Atlantic/Azores" | "Atlantic/Bermuda" | "Atlantic/Canary" | "Atlantic/Cape_Verde" | "Atlantic/Faroe" | "Atlantic/Madeira" | "Atlantic/Reykjavik" | "Atlantic/South_Georgia" | "Atlantic/St_Helena" | "Atlantic/Stanley" | "Australia/Adelaide" | "Australia/Brisbane" | "Australia/Broken_Hill" | "Australia/Currie" | "Australia/Darwin" | "Australia/Eucla" | "Australia/Hobart" | "Australia/Lindeman" | "Australia/Lord_Howe" | "Australia/Melbourne" | "Australia/Perth" | "Australia/Sydney" | "Canada/Atlantic" | "Canada/Central" | "Canada/Eastern" | "Canada/Mountain" | "Canada/Newfoundland" | "Canada/Pacific" | "Europe/Amsterdam" | "Europe/Andorra" | "Europe/Astrakhan" | "Europe/Athens" | "Europe/Belgrade" | "Europe/Berlin" | "Europe/Bratislava" | "Europe/Brussels" | "Europe/Bucharest" | "Europe/Budapest" | "Europe/Busingen" | "Europe/Chisinau" | "Europe/Copenhagen" | "Europe/Dublin" | "Europe/Gibraltar" | "Europe/Guernsey" | "Europe/Helsinki" | "Europe/Isle_of_Man" | "Europe/Istanbul" | "Europe/Jersey" | "Europe/Kaliningrad" | "Europe/Kiev" | "Europe/Kyiv" | "Europe/Kirov" | "Europe/Lisbon" | "Europe/Ljubljana" | "Europe/London" | "Europe/Luxembourg" | "Europe/Madrid" | "Europe/Malta" | "Europe/Mariehamn" | "Europe/Minsk" | "Europe/Monaco" | "Europe/Moscow" | "Europe/Oslo" | "Europe/Paris" | "Europe/Podgorica" | "Europe/Prague" | "Europe/Riga" | "Europe/Rome" | "Europe/Samara" | "Europe/San_Marino" | "Europe/Sarajevo" | "Europe/Saratov" | "Europe/Simferopol" | "Europe/Skopje" | "Europe/Sofia" | "Europe/Stockholm" | "Europe/Tallinn" | "Europe/Tirane" | "Europe/Ulyanovsk" | "Europe/Uzhgorod" | "Europe/Vaduz" | "Europe/Vatican" | "Europe/Vienna" | "Europe/Vilnius" | "Europe/Volgograd" | "Europe/Warsaw" | "Europe/Zagreb" | "Europe/Zaporozhye" | "Europe/Zaporizhia" | "Europe/Zurich" | "GMT" | "Indian/Antananarivo" | "Indian/Chagos" | "Indian/Christmas" | "Indian/Cocos" | "Indian/Comoro" | "Indian/Kerguelen" | "Indian/Mahe" | "Indian/Maldives" | "Indian/Mauritius" | "Indian/Mayotte" | "Indian/Reunion" | "Pacific/Apia" | "Pacific/Auckland" | "Pacific/Bougainville" | "Pacific/Chatham" | "Pacific/Chuuk" | "Pacific/Easter" | "Pacific/Efate" | "Pacific/Enderbury" | "Pacific/Fakaofo" | "Pacific/Fiji" | "Pacific/Funafuti" | "Pacific/Galapagos" | "Pacific/Gambier" | "Pacific/Guadalcanal" | "Pacific/Guam" | "Pacific/Honolulu" | "Pacific/Kiritimati" | "Pacific/Kosrae" | "Pacific/Kwajalein" | "Pacific/Majuro" | "Pacific/Marquesas" | "Pacific/Midway" | "Pacific/Nauru" | "Pacific/Niue" | "Pacific/Norfolk" | "Pacific/Noumea" | "Pacific/Pago_Pago" | "Pacific/Palau" | "Pacific/Pitcairn" | "Pacific/Pohnpei" | "Pacific/Port_Moresby" | "Pacific/Rarotonga" | "Pacific/Saipan" | "Pacific/Tahiti" | "Pacific/Tarawa" | "Pacific/Tongatapu" | "Pacific/Wake" | "Pacific/Wallis" | "US/Alaska" | "US/Arizona" | "US/Central" | "US/Eastern" | "US/Hawaii" | "US/Mountain" | "US/Pacific" | "UTC";
export type Native__schema125 = (Native__schema93) | (null);
export type Native__schema126 = boolean;
export type Native__schema127 = "CAPITALIZE" | "UPPER" | "LOWER";
export type Native__schema128 = string;
export type Native__schema129 = "id" | "ms" | "bs" | "bg" | "da" | "de" | "et" | "en" | "es" | "fr" | "hr" | "it" | "lv" | "lt" | "hu" | "nl" | "no" | "pl" | "pt" | "ro" | "sk" | "sl" | "sr" | "fi" | "sv" | "vi" | "tr" | "cz" | "el" | "ru" | "uk" | "he" | "ar" | "th" | "zh" | "ja" | "ko";
export type Native__schema130 = boolean;
export type Native__schema131 = "arial,'helvetica neue',helvetica,sans-serif" | "'comic sans ms','marker felt-thin',arial,sans-serif" | "'courier new',courier,'lucida sans typewriter','lucida typewriter',monospace" | "georgia,times,'times new roman',serif" | "helvetica,'helvetica neue',arial,verdana,sans-serif" | "'lucida sans unicode','lucida grande',sans-serif" | "tahoma,verdana,segoe,sans-serif" | "'times new roman',times,baskerville,georgia,serif" | "'trebuchet ms','lucida grande','lucida sans unicode','lucida sans',tahoma,sans-serif" | "verdana,geneva,sans-serif" | "arvo,courier,georgia,serif" | "lato,'helvetica neue',helvetica,arial,sans-serif" | "lora,georgia,'times new roman',serif" | "merriweather,georgia,'times new roman',serif" | "'merriweather sans','helvetica neue',helvetica,arial,sans-serif" | "'noticia text',georgia,'times new roman',serif" | "'open sans','helvetica neue',helvetica,arial,sans-serif" | "'playfair display',georgia,'times new roman',serif" | "roboto,'helvetica neue',helvetica,arial,sans-serif" | "'source sans pro','helvetica neue',helvetica,arial,sans-serif";
export type Native__schema132 = number;
export type Native__schema133 = {
    "days": NativeColorValueDisallowTransparent;
    "hours": NativeColorValueDisallowTransparent;
    "minutes": NativeColorValueDisallowTransparent;
    "seconds": NativeColorValueDisallowTransparent;
};
export type Native__schema134 = {
    "days": NativeColorValueDisallowTransparent;
    "hours": NativeColorValueDisallowTransparent;
    "minutes": NativeColorValueDisallowTransparent;
    "seconds": NativeColorValueDisallowTransparent;
};
export type Native__schema135 = {
    "days": NativeColorValueDisallowTransparent;
    "hours": NativeColorValueDisallowTransparent;
    "minutes": NativeColorValueDisallowTransparent;
    "seconds": NativeColorValueDisallowTransparent;
};
export type NativeSocialBlock = {
    "id": Native__schema75;
    "type": Native__schema136;
    "settings": Native__schema137;
};
export type Native__schema136 = "social";
export type Native__schema137 = (Native__schema138) | (Native__schema156);
export type Native__schema138 = {
    "style": Native__schema139;
    "iconSize": Native__schema140;
    "spaceBetweenIcons": Native__schema141;
    "alignment": Native__schema144;
    "backgroundColor": NativeColorValueAllowTransparent;
    "hideElement": NativeHideElement;
    "margins": Native__schema145;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema112;
    "networks": Array<Native__schema151>;
    "textCustomization": false;
};
export type Native__schema139 = "custom" | "logoColored" | "logoBlack" | "logoGray" | "logoWhite" | "circleColored" | "circleColoredBordered" | "roundedColored" | "roundedColoredBordered" | "squareColored" | "squareColoredBordered" | "circleBlack" | "circleBlackBordered" | "roundedBlack" | "roundedBlackBordered" | "squareBlack" | "squareBlackBordered" | "circleGray" | "circleGrayBordered" | "roundedGray" | "roundedGrayBordered" | "squareGray" | "squareGrayBordered" | "circleWhite" | "circleWhiteBordered" | "roundedWhite" | "roundedWhiteBordered" | "squareWhite" | "squareWhiteBordered";
export type Native__schema140 = number;
export type Native__schema141 = {
    "desktop": Native__schema142;
    "mobile": Native__schema143;
};
export type Native__schema142 = number;
export type Native__schema143 = number;
export type Native__schema144 = {
    "desktop": Native__schema104;
    "mobile": Native__schema104;
};
export type Native__schema145 = {
    "desktop": Native__schema146;
    "mobile": Native__schema146;
};
export type Native__schema146 = {
    "top": Native__schema147;
    "right": Native__schema148;
    "bottom": Native__schema149;
    "left": Native__schema150;
};
export type Native__schema147 = number;
export type Native__schema148 = number;
export type Native__schema149 = number;
export type Native__schema150 = number;
export type Native__schema151 = ({
    "type": "twitter" | "xcom" | "facebook" | "youtube" | "askfm" | "behance" | "dribbble" | "flickr" | "foursquare" | "googleplus" | "instagram" | "lastfm" | "linkedin" | "myspace" | "pinterest" | "soundcloud" | "tumblr" | "vimeo" | "hangouts" | "messenger" | "skype" | "snapchat" | "telegram" | "viber" | "whatsapp" | "email" | "website" | "mapmarker" | "world" | "address" | "phone" | "share" | "rss" | "appstore" | "googleplay" | "windowsstore" | "wechat" | "weibo" | "blogger" | "medium" | "dropbox" | "googledrive" | "slack" | "github" | "pdf" | "doc" | "xls" | "ppt" | "xing" | "meetup" | "fleeped" | "tripAdvisor" | "spotify" | "tiktok" | "workplace" | "gmail" | "iTunesPodcasts" | "zoom" | "teams" | "onedrive" | "discord" | "twitch" | "line" | "patreon" | "kofi" | "yammer" | "buyMeACoffee" | "huaweiAppGallery" | "googleBusiness" | "reddit" | "strava" | "goodreads" | "yelp" | "google" | "mastodon" | "glassdoor" | "threads" | "bluesky" | "digg" | "meet";
    "link"?: Native__schema152;
    "title": Native__schema154;
}) | ({
    "type": "custom";
    "link"?: Native__schema152;
    "title": Native__schema154;
    "icon": Native__schema155;
});
export type Native__schema152 = {
    "type": Native__schema94;
    "href": Native__schema153;
};
export type Native__schema153 = string;
export type Native__schema154 = string;
export type Native__schema155 = string;
export type Native__schema156 = {
    "style": Native__schema139;
    "iconSize": Native__schema140;
    "spaceBetweenIcons": Native__schema141;
    "alignment": Native__schema144;
    "backgroundColor": NativeColorValueAllowTransparent;
    "hideElement": NativeHideElement;
    "margins": Native__schema145;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema112;
    "networks": Array<Native__schema157>;
    "textCustomization": true;
};
export type Native__schema157 = ({
    "type": "twitter" | "xcom" | "facebook" | "youtube" | "askfm" | "behance" | "dribbble" | "flickr" | "foursquare" | "googleplus" | "instagram" | "lastfm" | "linkedin" | "myspace" | "pinterest" | "soundcloud" | "tumblr" | "vimeo" | "hangouts" | "messenger" | "skype" | "snapchat" | "telegram" | "viber" | "whatsapp" | "email" | "website" | "mapmarker" | "world" | "address" | "phone" | "share" | "rss" | "appstore" | "googleplay" | "windowsstore" | "wechat" | "weibo" | "blogger" | "medium" | "dropbox" | "googledrive" | "slack" | "github" | "pdf" | "doc" | "xls" | "ppt" | "xing" | "meetup" | "fleeped" | "tripAdvisor" | "spotify" | "tiktok" | "workplace" | "gmail" | "iTunesPodcasts" | "zoom" | "teams" | "onedrive" | "discord" | "twitch" | "line" | "patreon" | "kofi" | "yammer" | "buyMeACoffee" | "huaweiAppGallery" | "googleBusiness" | "reddit" | "strava" | "goodreads" | "yelp" | "google" | "mastodon" | "glassdoor" | "threads" | "bluesky" | "digg" | "meet";
    "link"?: Native__schema152;
    "title": Native__schema154;
    "alt": Native__schema158;
}) | ({
    "type": "custom";
    "link"?: Native__schema152;
    "title": Native__schema154;
    "alt": Native__schema158;
    "icon": Native__schema155;
});
export type Native__schema158 = string;
export type NativeHtmlBlock = {
    "id": Native__schema75;
    "type": Native__schema159;
    "settings": Native__schema160;
    "content"?: Native__schema161;
};
export type Native__schema159 = "html";
export type Native__schema160 = {
    "margins": Native__schema106;
    "includeInOutput": NativeOutputInclusion;
    "hideElement": NativeHideElement;
    "anchorLinkName": Native__schema112;
};
export type Native__schema161 = string;
export type NativeButtonBlock = {
    "id": Native__schema75;
    "type": Native__schema162;
    "settings": NativeButtonBlockSettings;
};
export type Native__schema162 = "button";
export type NativeButtonBlockSettings = {
    "link"?: Native__schema163;
    "text": Native__schema175;
    "alignment": Native__schema176;
    "fixedHeight"?: Native__schema177;
    "icon"?: Native__schema180;
    "hideElement": NativeHideElement;
    "padding": Native__schema185;
    "margins": Native__schema185;
    "includeInOutput": NativeOutputInclusion;
    "anchorLink": Native__schema188;
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
export type Native__schema163 = (Native__schema165) | (Native__schema168);
export type Native__schema164 = (Native__schema165) | (Native__schema168);
export type Native__schema165 = {
    "type": Native__schema166;
    "value": Native__schema167;
};
export type Native__schema166 = "site" | "anchor" | "email" | "phone" | "sms" | "telegram" | "viber" | "file" | "other";
export type Native__schema167 = string;
export type Native__schema168 = {
    "type": Native__schema169;
    "value": Native__schema170;
    "salesforce": Native__schema171;
};
export type Native__schema169 = "salesforce_mc";
export type Native__schema170 = string;
export type Native__schema171 = {
    "trackingAlias": Native__schema172;
    "linkTo": Native__schema173;
    "conversion": Native__schema174;
};
export type Native__schema172 = string;
export type Native__schema173 = string;
export type Native__schema174 = boolean;
export type Native__schema175 = string;
export type Native__schema176 = {
    "desktop": Native__schema104;
    "mobile": Native__schema104;
};
export type Native__schema177 = {
    "height": Native__schema178;
    "alignment"?: Native__schema179;
};
export type Native__schema178 = number;
export type Native__schema179 = "top" | "middle" | "bottom";
export type Native__schema180 = {
    "src": Native__schema181;
    "width": Native__schema182;
    "align": Native__schema183;
    "indent": Native__schema184;
};
export type Native__schema181 = string;
export type Native__schema182 = number;
export type Native__schema183 = "left" | "right";
export type Native__schema184 = number;
export type Native__schema185 = {
    "desktop": Native__schema186;
    "mobile": Native__schema186;
};
export type Native__schema186 = {
    "top": Native__schema187;
    "right": Native__schema187;
    "bottom": Native__schema187;
    "left": Native__schema187;
};
export type Native__schema187 = number;
export type Native__schema188 = string;
export type NativeFontSize = {
    "desktop": Native__schema189;
    "mobile": Native__schema190;
};
export type Native__schema189 = number;
export type Native__schema190 = number;
export type NativeButtonsTextStyle = {
    "bold": Native__schema191;
    "italic": Native__schema192;
};
export type Native__schema191 = boolean;
export type Native__schema192 = boolean;
export type NativeResponsiveBoolean = {
    "desktop": Native__schema193;
    "mobile": Native__schema194;
};
export type Native__schema193 = boolean;
export type Native__schema194 = boolean;
export type NativeSpacerBlock = {
    "id": Native__schema75;
    "type": Native__schema195;
    "settings": Native__schema196;
};
export type Native__schema195 = "spacer";
export type Native__schema196 = {
    "mode": Native__schema197;
    "width"?: Native__schema198;
    "height"?: Native__schema204;
    "border"?: Native__schema207;
    "mobileBorder"?: Native__schema210;
    "alignment"?: Native__schema212;
    "backgroundColor": NativeColorValueAllowTransparent;
    "margins": Native__schema213;
    "anchorLinkName": Native__schema112;
    "includeInOutput": NativeOutputInclusion;
    "hideElement": NativeHideElement;
};
export type Native__schema197 = "line" | "space";
export type Native__schema198 = {
    "desktop": Native__schema199;
    "mobile": Native__schema203;
};
export type Native__schema199 = {
    "value": Native__schema200;
    "unit": Native__schema201;
};
export type Native__schema200 = number;
export type Native__schema201 = "percent" | "px";
export type Native__schema202 = {
    "value": Native__schema200;
    "unit": Native__schema201;
};
export type Native__schema203 = {
    "value": Native__schema200;
    "unit": Native__schema201;
};
export type Native__schema204 = {
    "desktop": Native__schema205;
    "mobile": Native__schema206;
};
export type Native__schema205 = number;
export type Native__schema206 = number;
export type Native__schema207 = {
    "size": Native__schema209;
    "style": Native__schema37;
    "color": NativeColorValueDisallowTransparent;
};
export type Native__schema208 = {
    "size": Native__schema209;
    "style": Native__schema37;
    "color": NativeColorValueDisallowTransparent;
};
export type Native__schema209 = number;
export type Native__schema210 = (Native__schema208) | (null);
export type Native__schema211 = (Native__schema208) | (null);
export type Native__schema212 = {
    "desktop": Native__schema104;
    "mobile": Native__schema104;
};
export type Native__schema213 = {
    "desktop": Native__schema214;
    "mobile": Native__schema214;
};
export type Native__schema214 = {
    "top": Native__schema215;
    "right": Native__schema216;
    "bottom": Native__schema217;
    "left": Native__schema218;
};
export type Native__schema215 = number;
export type Native__schema216 = number;
export type Native__schema217 = number;
export type Native__schema218 = number;
export type NativeMenuBlock = {
    "id": Native__schema75;
    "type": Native__schema219;
    "settings": NativeMenuBlockSettings;
};
export type Native__schema219 = "menu";
export type NativeMenuBlockSettings = {
    "responsiveMenu": Native__schema220;
    "itemType": Native__schema221;
    "fitToContainer": Native__schema224;
    "itemPadding": Native__schema225;
    "margins": Native__schema225;
    "anchorLinkName": Native__schema112;
    "includeInOutput": NativeOutputInclusion;
    "separator": NativeMenuSeparator;
    "fontFamily": Native__schema8;
    "fontSize": NativeFontSize;
    "hideElement": NativeHideElement;
    "textStyle": NativeMenuTextStyle;
    "colors": Native__schema232;
    "items": Native__schema235;
};
export type Native__schema220 = boolean;
export type Native__schema221 = (Native__schema222) | (Native__schema223);
export type Native__schema222 = {
    "mode": "shared";
    "type": NativeMenuItemType;
};
export type NativeMenuItemType = "links" | "icons" | "linksWithIcons";
export type Native__schema223 = {
    "mode": "perItem";
};
export type Native__schema224 = boolean;
export type Native__schema225 = {
    "desktop": Native__schema226;
    "mobile": Native__schema226;
};
export type Native__schema226 = {
    "top": Native__schema227;
    "right": Native__schema227;
    "bottom": Native__schema227;
    "left": Native__schema227;
};
export type Native__schema227 = number;
export type NativeMenuSeparator = {
    "width": Native__schema228;
    "style": Native__schema229;
    "color": NativeColorValueDisallowTransparent;
};
export type Native__schema228 = number;
export type Native__schema229 = "none" | "line" | "dashed" | "dotted";
export type NativeMenuTextStyle = {
    "bold": Native__schema191;
    "italic": Native__schema192;
    "underline"?: Native__schema230;
};
export type Native__schema230 = boolean;
export type Native__schema231 = boolean;
export type Native__schema232 = (Native__schema233) | (Native__schema234);
export type Native__schema233 = {
    "mode": "shared";
    "link": NativeColorValueDisallowTransparent;
};
export type Native__schema234 = {
    "mode": "perItem";
};
export type Native__schema235 = Array<NativeMenuItem>;
export type NativeMenuItem = {
    "type"?: Native__schema236;
    "name": Native__schema237;
    "link": NativeMenuLink;
    "image"?: Native__schema240;
    "hideElement": NativeHideElement;
    "colors"?: Native__schema247;
};
export type Native__schema236 = "links" | "icons" | "linksWithIcons";
export type Native__schema237 = string;
export type NativeMenuLink = {
    "type": Native__schema238;
    "value": Native__schema239;
};
export type Native__schema238 = "site" | "email" | "phone" | "anchor";
export type Native__schema239 = string;
export type Native__schema240 = {
    "src": Native__schema241;
    "size": NativeMenuImageSize;
    "alignment": Native__schema244;
    "indent": Native__schema245;
    "altText": Native__schema246;
};
export type NativeMenuItemImage = {
    "src": Native__schema241;
    "size": NativeMenuImageSize;
    "alignment": Native__schema244;
    "indent": Native__schema245;
    "altText": Native__schema246;
};
export type Native__schema241 = string;
export type NativeMenuImageSize = {
    "mode": Native__schema242;
    "px": Native__schema243;
};
export type Native__schema242 = "width" | "height";
export type Native__schema243 = number;
export type Native__schema244 = "left" | "center" | "right";
export type Native__schema245 = number;
export type Native__schema246 = string;
export type Native__schema247 = {
    "link": NativeColorValueDisallowTransparent;
    "background": NativeColorValueAllowTransparent;
};
export type NativeUnknownBlock = {
    "id": Native__schema75;
    "type": Native__schema248;
    "settings"?: Native__schema249;
    "content": Native__schema252;
    "extension": Native__schema253;
};
export type Native__schema248 = "unknown";
export type Native__schema249 = {
    [key: string]: Native__schema251;
};
export type Native__schema250 = string;
export type Native__schema251 = unknown;
export type Native__schema252 = string;
export type Native__schema253 = boolean;
export type DocumentState = {
    "metadata"?: Native__schema0;
    "resources"?: Native__schema5;
    "settings": Native__schema11;
    "stripes"?: Native__schema12;
};
export type DocumentBlock = NativeBlock;
export type BlockKind = DocumentBlock['type'];
export type BlockOf<K extends BlockKind> = Extract<DocumentBlock, {
    type: K;
}>;
export type BlockSettings<K extends BlockKind> = BlockOf<K>['settings'];

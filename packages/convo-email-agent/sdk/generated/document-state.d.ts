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
    "general": Native__schema12;
    "stripes": Native__schema19;
    "headings": Native__schema31;
    "buttons": Native__schema33;
};
export type Native__schema12 = {
    "defaultStyles": boolean;
    "hideImageDownloadIcons": boolean;
    "underlineLinks": boolean;
    "responsiveDesign": boolean;
    "messageAlignment": "left" | "center" | "right";
    "messageContentWidth": number;
    "backgroundImage": (Native__schema13) | (null);
    "rightToLeftTextDirection": boolean;
    "marginsAroundMessage": Native__schema15;
    "defaultStructurePadding": Native__schema15;
    "customListStyles": ({
        "leftIndent": number;
        "listItemsBottomSpace": number;
        "listTopBottomMargin": number;
    }) | (null);
    "lightTheme": {
        "backgroundColor": Native__schema17;
        "customListStyles": {
            "listMarkerColor": Native__schema18;
            "listNumberMarkerColor": Native__schema18;
        };
    };
    "darkTheme": {
        "backgroundColor": (Native__schema17) | (null);
        "customListStyles": {
            "listMarkerColor": (Native__schema18) | (null);
            "listNumberMarkerColor": (Native__schema18) | (null);
        };
    };
};
export type Native__schema13 = {
    "path": string;
    "repeat": boolean;
    "x": string;
    "y": string;
    "sizeX": Native__schema14;
    "sizeY": Native__schema14;
};
export type Native__schema14 = string;
export type Native__schema15 = {
    "desktop": Native__schema16;
    "mobile": Native__schema16;
};
export type Native__schema16 = {
    "top": number;
    "right": number;
    "bottom": number;
    "left": number;
};
export type Native__schema17 = string;
export type Native__schema18 = string;
export type Native__schema19 = {
    "letterSpacing": Native__schema20;
    "lineHeight": {
        "desktop": Native__schema21;
        "mobile": Native__schema22;
    };
    "fontFamily": Native__schema23;
    "fontWeight": Native__schema24;
    "header": {
        "fontSize": Native__schema25;
        "paragraphBottomSpace": Native__schema28;
        "backgroundImage": (Native__schema13) | (null);
    };
    "content": {
        "fontSize": Native__schema25;
        "paragraphBottomSpace": Native__schema28;
    };
    "footer": {
        "fontSize": Native__schema25;
        "paragraphBottomSpace": Native__schema28;
        "backgroundImage": (Native__schema13) | (null);
    };
    "infoArea": {
        "fontSize": Native__schema25;
        "paragraphBottomSpace": Native__schema28;
    };
    "lightTheme": {
        "header": {
            "stripeBackgroundColor": Native__schema17;
            "contentBackgroundColor": Native__schema17;
            "fontColor": Native__schema30;
            "linkColor": Native__schema30;
            "linkColorHover": Native__schema30;
        };
        "content": {
            "contentBackgroundColor": Native__schema17;
            "fontColor": Native__schema30;
            "linkColor": Native__schema30;
            "linkColorHover": Native__schema30;
        };
        "footer": {
            "stripeBackgroundColor": Native__schema17;
            "contentBackgroundColor": Native__schema17;
            "fontColor": Native__schema30;
            "linkColor": Native__schema30;
            "linkColorHover": Native__schema30;
        };
        "infoArea": {
            "fontColor": Native__schema30;
            "linkColor": Native__schema30;
            "linkColorHover": Native__schema30;
        };
    };
    "darkTheme": {
        "header": {
            "stripeBackgroundColor": (Native__schema17) | (null);
            "contentBackgroundColor": (Native__schema17) | (null);
            "fontColor": (Native__schema30) | (null);
            "linkColor": (Native__schema30) | (null);
            "linkColorHover": (Native__schema30) | (null);
        };
        "content": {
            "contentBackgroundColor": (Native__schema17) | (null);
            "fontColor": (Native__schema30) | (null);
            "linkColor": (Native__schema30) | (null);
            "linkColorHover": (Native__schema30) | (null);
        };
        "footer": {
            "stripeBackgroundColor": (Native__schema17) | (null);
            "contentBackgroundColor": (Native__schema17) | (null);
            "fontColor": (Native__schema30) | (null);
            "linkColor": (Native__schema30) | (null);
            "linkColorHover": (Native__schema30) | (null);
        };
        "infoArea": {
            "fontColor": (Native__schema30) | (null);
            "linkColor": (Native__schema30) | (null);
            "linkColorHover": (Native__schema30) | (null);
        };
    };
};
export type Native__schema20 = {
    "value": number;
    "unit": "px" | "em";
};
export type Native__schema21 = number;
export type Native__schema22 = number;
export type Native__schema23 = string;
export type Native__schema24 = number;
export type Native__schema25 = {
    "desktop": Native__schema26;
    "mobile": Native__schema27;
};
export type Native__schema26 = number;
export type Native__schema27 = number;
export type Native__schema28 = (Native__schema29) | (null);
export type Native__schema29 = {
    "desktop": number;
    "mobile": number;
};
export type Native__schema30 = string;
export type Native__schema31 = {
    "letterSpacing": Native__schema20;
    "fontFamily": Native__schema23;
    "h1": Native__schema32;
    "h2": Native__schema32;
    "h3": Native__schema32;
    "h4": Native__schema32;
    "h5": Native__schema32;
    "h6": Native__schema32;
    "lightTheme": {
        "h1": {
            "fontColor": Native__schema30;
        };
        "h2": {
            "fontColor": Native__schema30;
        };
        "h3": {
            "fontColor": Native__schema30;
        };
        "h4": {
            "fontColor": Native__schema30;
        };
        "h5": {
            "fontColor": Native__schema30;
        };
        "h6": {
            "fontColor": Native__schema30;
        };
    };
    "darkTheme": {
        "h1": {
            "fontColor": (Native__schema30) | (null);
        };
        "h2": {
            "fontColor": (Native__schema30) | (null);
        };
        "h3": {
            "fontColor": (Native__schema30) | (null);
        };
        "h4": {
            "fontColor": (Native__schema30) | (null);
        };
        "h5": {
            "fontColor": (Native__schema30) | (null);
        };
        "h6": {
            "fontColor": (Native__schema30) | (null);
        };
    };
};
export type Native__schema32 = {
    "textAlign": {
        "mobile": ("left" | "center" | "right") | (null);
    };
    "textStyle": {
        "italic": boolean;
    };
    "fontWeight": (Native__schema24) | (null);
    "fontSize": {
        "desktop": (Native__schema26) | (null);
        "mobile": (Native__schema27) | (null);
    };
    "lineHeight": {
        "desktop": (Native__schema21) | (null);
        "mobile": (Native__schema22) | (null);
    };
    "paragraphBottomSpace": (Native__schema29) | (null);
};
export type Native__schema33 = {
    "outlookSupport": boolean;
    "textStyle": {
        "bold": boolean;
        "italic": boolean;
    };
    "textTransform": "none" | "uppercase" | "capitalize" | "lowercase";
    "fontFamily": Native__schema23;
    "letterSpacing": Native__schema20;
    "fontSize": Native__schema25;
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
        "top": Native__schema34;
        "right": Native__schema34;
        "bottom": Native__schema34;
        "left": Native__schema34;
        "style": "solid" | "dashed" | "dotted";
    };
    "hoverButtonStyles": boolean;
    "padding": Native__schema15;
    "lightTheme": {
        "buttonColor": Native__schema17;
        "fontColor": Native__schema30;
        "hoverButtonStyles": {
            "backgroundColor": Native__schema17;
            "fontColor": Native__schema30;
            "borderColor": {
                "top": Native__schema18;
                "right": Native__schema18;
                "bottom": Native__schema18;
                "left": Native__schema18;
            };
        };
        "borderColor": {
            "top": Native__schema18;
            "right": Native__schema18;
            "bottom": Native__schema18;
            "left": Native__schema18;
        };
    };
    "darkTheme": {
        "buttonColor": (Native__schema17) | (null);
        "fontColor": (Native__schema30) | (null);
        "hoverButtonStyles": {
            "backgroundColor": (Native__schema17) | (null);
            "fontColor": (Native__schema30) | (null);
            "borderColor": {
                "top": (Native__schema18) | (null);
                "right": (Native__schema18) | (null);
                "bottom": (Native__schema18) | (null);
                "left": (Native__schema18) | (null);
            };
        };
        "borderColor": {
            "top": (Native__schema18) | (null);
            "right": (Native__schema18) | (null);
            "bottom": (Native__schema18) | (null);
            "left": (Native__schema18) | (null);
        };
    };
};
export type Native__schema34 = {
    "width": number;
};
export type Native__schema35 = Array<NativeStripe>;
export type Native__schema36 = Array<NativeStripe>;
export type NativeStripe = {
    "id": Native__schema37;
    "settings"?: Native__schema38;
    "moduleId"?: Native__schema61;
    "structures"?: Native__schema62;
};
export type Native__schema37 = string;
export type Native__schema38 = {
    "messageArea"?: Native__schema39;
    "includeInOutput"?: Native__schema40;
    "hideElement": NativeHideElement;
    "padding"?: Native__schema41;
    "stripeBackgroundColor"?: Native__schema46;
    "contentBackgroundColor"?: Native__schema47;
    "backgroundImage"?: Native__schema48;
    "contentBorder"?: Native__schema58;
};
export type NativeStripeSettings = {
    "messageArea"?: Native__schema39;
    "includeInOutput"?: Native__schema40;
    "hideElement": NativeHideElement;
    "padding"?: Native__schema41;
    "stripeBackgroundColor"?: Native__schema46;
    "contentBackgroundColor"?: Native__schema47;
    "backgroundImage"?: Native__schema48;
    "contentBorder"?: Native__schema58;
};
export type Native__schema39 = "header" | "content" | "footer" | "infoArea";
export type Native__schema40 = "both" | "html" | "ampHtml";
export type NativeOutputInclusion = "both" | "html" | "ampHtml";
export type NativeHideElement = "no" | "desktop" | "mobile";
export type Native__schema41 = {
    "mobile": NativeFullSideValues;
};
export type NativeMobilePadding = {
    "mobile": NativeFullSideValues;
};
export type NativeFullSideValues = {
    "top": Native__schema42;
    "right": Native__schema43;
    "bottom": Native__schema44;
    "left": Native__schema45;
};
export type Native__schema42 = number;
export type Native__schema43 = number;
export type Native__schema44 = number;
export type Native__schema45 = number;
export type Native__schema46 = string;
export type NativeColorValueAllowTransparent = string;
export type Native__schema47 = string;
export type Native__schema48 = {
    "path": Native__schema49;
    "repeat": boolean;
    "x": Native__schema52;
    "y": Native__schema53;
    "sizeX": string;
    "sizeY": string;
};
export type NativeBackgroundImage = {
    "path": Native__schema49;
    "repeat": boolean;
    "x": Native__schema52;
    "y": Native__schema53;
    "sizeX": string;
    "sizeY": string;
};
export type Native__schema49 = string;
export type Native__schema50 = boolean | string;
export type Native__schema51 = boolean | string;
export type Native__schema52 = string;
export type Native__schema53 = string;
export type Native__schema54 = string;
export type Native__schema55 = string;
export type Native__schema56 = string;
export type Native__schema57 = string;
export type Native__schema58 = {
    "top": NativeBorderSide;
    "right": NativeBorderSide;
    "bottom": NativeBorderSide;
    "left": NativeBorderSide;
    "style": Native__schema60;
};
export type NativeBorder = {
    "top": NativeBorderSide;
    "right": NativeBorderSide;
    "bottom": NativeBorderSide;
    "left": NativeBorderSide;
    "style": Native__schema60;
};
export type NativeBorderSide = {
    "width": Native__schema59;
    "color": NativeColorValueAllowTransparent;
};
export type Native__schema59 = number;
export type Native__schema60 = "solid" | "dashed" | "dotted";
export type Native__schema61 = number;
export type Native__schema62 = Array<NativeStructure>;
export type NativeStructure = {
    "id": Native__schema63;
    "settings"?: Native__schema64;
    "moduleId"?: Native__schema79;
    "columns"?: Native__schema80;
};
export type Native__schema63 = string;
export type Native__schema64 = {
    "backgroundColor": NativeColorValueAllowTransparent;
    "backgroundImage"?: Native__schema65;
    "border": NativeBorder;
    "borderRadius": NativeBorderRadius;
    "columnsGap"?: Native__schema70;
    "responsiveMobile"?: Native__schema73;
    "responsiveMobileContainersInversion"?: Native__schema74;
    "padding"?: Native__schema75;
    "margins"?: Native__schema76;
    "includeInOutput"?: Native__schema77;
    "hideElement"?: Native__schema78;
};
export type Native__schema65 = {
    "path": Native__schema49;
    "repeat": boolean;
    "x": Native__schema52;
    "y": Native__schema53;
    "sizeX": string;
    "sizeY": string;
};
export type NativeBorderRadius = {
    "topLeft": Native__schema66;
    "topRight": Native__schema67;
    "bottomRight": Native__schema68;
    "bottomLeft": Native__schema69;
};
export type Native__schema66 = number;
export type Native__schema67 = number;
export type Native__schema68 = number;
export type Native__schema69 = number;
export type Native__schema70 = {
    "desktop": Native__schema71;
    "mobile": Native__schema72;
};
export type NativeResponsiveNumber = {
    "desktop": Native__schema71;
    "mobile": Native__schema72;
};
export type Native__schema71 = number;
export type Native__schema72 = number;
export type Native__schema73 = boolean;
export type Native__schema74 = boolean;
export type Native__schema75 = {
    "desktop": NativeFullSideValues;
    "mobile": NativeFullSideValues;
};
export type NativeResponsivePadding = {
    "desktop": NativeFullSideValues;
    "mobile": NativeFullSideValues;
};
export type Native__schema76 = {
    "desktop": NativeFullSideValues;
    "mobile": NativeFullSideValues;
};
export type Native__schema77 = "both" | "html" | "ampHtml";
export type Native__schema78 = "no" | "desktop" | "mobile";
export type Native__schema79 = number;
export type Native__schema80 = Array<NativeColumn>;
export type NativeColumn = {
    "id": Native__schema81;
    "settings"?: Native__schema82;
    "containers": Native__schema84;
};
export type Native__schema81 = string;
export type Native__schema82 = {
    "width": Native__schema83;
};
export type Native__schema83 = number;
export type Native__schema84 = Array<NativeContainer>;
export type NativeContainer = {
    "id": Native__schema85;
    "settings": Native__schema86;
    "moduleId"?: Native__schema88;
    "blocks"?: Native__schema89;
};
export type Native__schema85 = string;
export type Native__schema86 = {
    "padding": NativeResponsivePadding;
    "includeInOutput": NativeOutputInclusion;
    "hideElement": NativeHideElement;
    "backgroundColor": NativeColorValueAllowTransparent;
    "backgroundImage"?: Native__schema87;
    "border": NativeBorder;
    "radius": NativeBorderRadius;
};
export type Native__schema87 = {
    "path": Native__schema49;
    "repeat": boolean;
    "x": Native__schema52;
    "y": Native__schema53;
    "sizeX": string;
    "sizeY": string;
};
export type Native__schema88 = number;
export type Native__schema89 = Array<NativeBlock>;
export type NativeBlock = (NativeTextBlock) | (NativeImageBlock) | (NativeVideoBlock) | (NativeTimerBlock) | (NativeSocialBlock) | (NativeHtmlBlock) | (NativeButtonBlock) | (NativeSpacerBlock) | (NativeMenuBlock) | (NativeUnknownBlock);
export type NativeTextBlock = {
    "id": Native__schema90;
    "type": Native__schema91;
    "settings"?: Native__schema92;
    "content"?: Native__schema103;
};
export type Native__schema90 = string;
export type Native__schema91 = "text";
export type Native__schema92 = {
    "fontColor"?: string;
    "hideElement": NativeHideElement;
    "rightToLeftTextDirection": boolean;
    "alignment"?: {
        "desktop": Native__schema93;
        "mobile": Native__schema93;
    };
    "fixedHeight"?: {
        "desktop"?: Native__schema94;
        "mobile"?: Native__schema98;
    };
    "padding": {
        "desktop": Native__schema99;
        "mobile": Native__schema99;
    };
    "includeInOutput": NativeOutputInclusion;
    "backgroundColor": NativeColorValueAllowTransparent;
    "letterSpacing"?: {
        "value": Native__schema101;
        "unit": Native__schema102;
    };
};
export type NativeColorValueDisallowTransparent = string;
export type Native__schema93 = "left" | "center" | "right" | "justify";
export type Native__schema94 = {
    "height": Native__schema96;
    "verticalAlignment"?: Native__schema97;
};
export type Native__schema95 = {
    "height": Native__schema96;
    "verticalAlignment"?: Native__schema97;
};
export type Native__schema96 = number;
export type Native__schema97 = "top" | "middle" | "bottom";
export type Native__schema98 = {
    "height": Native__schema96;
    "verticalAlignment"?: Native__schema97;
};
export type Native__schema99 = {
    "top": Native__schema100;
    "right": Native__schema100;
    "bottom": Native__schema100;
    "left": Native__schema100;
};
export type Native__schema100 = number;
export type NativeSpacingValue = {
    "value": Native__schema101;
    "unit": Native__schema102;
};
export type Native__schema101 = number;
export type Native__schema102 = "px" | "em";
export type Native__schema103 = string;
export type NativeImageBlock = {
    "id": Native__schema90;
    "type": Native__schema104;
    "settings": Native__schema105;
};
export type Native__schema104 = "image";
export type Native__schema105 = {
    "src": Native__schema106;
    "link"?: Native__schema107;
    "altText": Native__schema111;
    "size": Native__schema114;
    "alignment": Native__schema118;
    "radius": Native__schema120;
    "hideElement": NativeHideElement;
    "margins": Native__schema121;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema127;
    "responsiveMobile": Native__schema128;
};
export type Native__schema106 = string;
export type Native__schema107 = {
    "type": Native__schema109;
    "href": Native__schema110;
};
export type Native__schema108 = {
    "type": Native__schema109;
    "href": Native__schema110;
};
export type Native__schema109 = "site" | "anchor" | "email" | "phone" | "file" | "sms" | "telegram" | "viber" | "other";
export type Native__schema110 = string;
export type Native__schema111 = {
    "text": Native__schema112;
    "addToTitle": Native__schema113;
};
export type Native__schema112 = string;
export type Native__schema113 = boolean;
export type Native__schema114 = {
    "desktop": Native__schema115;
    "mobile": Native__schema115;
};
export type Native__schema115 = {
    "mode": Native__schema116;
    "px": Native__schema117;
};
export type Native__schema116 = "width" | "height";
export type Native__schema117 = number;
export type Native__schema118 = {
    "desktop": Native__schema119;
    "mobile": Native__schema119;
};
export type Native__schema119 = "left" | "center" | "right";
export type Native__schema120 = {
    "desktop": NativeBorderRadius;
    "mobile": NativeBorderRadius;
};
export type Native__schema121 = {
    "desktop": Native__schema122;
    "mobile": Native__schema122;
};
export type Native__schema122 = {
    "top": Native__schema123;
    "right": Native__schema124;
    "bottom": Native__schema125;
    "left": Native__schema126;
};
export type Native__schema123 = number;
export type Native__schema124 = number;
export type Native__schema125 = number;
export type Native__schema126 = number;
export type Native__schema127 = string;
export type Native__schema128 = boolean;
export type NativeVideoBlock = {
    "id": Native__schema90;
    "type": Native__schema129;
    "settings": NativeVideoBlockSettings;
};
export type Native__schema129 = "video";
export type NativeVideoBlockSettings = {
    "videoLink": Native__schema130;
    "altText": Native__schema111;
    "customThumbnail"?: Native__schema131;
    "playButtonStyle": Native__schema133;
    "size": Native__schema114;
    "alignment": Native__schema118;
    "radius": Native__schema120;
    "hideElement": NativeHideElement;
    "paddings": Native__schema134;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema127;
    "responsiveMobile": Native__schema135;
};
export type Native__schema130 = string;
export type Native__schema131 = {
    "src": Native__schema132;
};
export type NativeVideoCustomThumbnail = {
    "src": Native__schema132;
};
export type Native__schema132 = string;
export type Native__schema133 = "NONE" | "red" | "white" | "black" | "blue" | "whiteCircle" | "blackCircle" | "greyCircle" | "blackCircleInverse";
export type Native__schema134 = {
    "desktop": Native__schema122;
    "mobile": Native__schema122;
};
export type Native__schema135 = boolean;
export type NativeTimerBlock = {
    "id": Native__schema90;
    "type": Native__schema136;
    "settings": NativeTimerBlockSettings;
};
export type Native__schema136 = "timer";
export type NativeTimerBlockSettings = {
    "altText": Native__schema111;
    "responsiveMobile": Native__schema137;
    "size": Native__schema114;
    "alignment": Native__schema118;
    "margins": Native__schema121;
    "endDate": Native__schema138;
    "timeZone": Native__schema139;
    "link": Native__schema140;
    "displayDays": Native__schema141;
    "labelsLetterCase"?: Native__schema142;
    "separator": Native__schema143;
    "labelsLanguage": Native__schema144;
    "retinaDisplaySupport": Native__schema145;
    "expirationImageSrc": Native__schema106;
    "hideElement": NativeHideElement;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema127;
    "digitsFontFamily": Native__schema146;
    "digitsFontSize": Native__schema147;
    "digitsFontColor": NativeColorValueDisallowTransparent;
    "digitsAdvancedColorSettings"?: Native__schema148;
    "labelsFontFamily": Native__schema146;
    "labelsFontSize": Native__schema147;
    "labelsFontColor": NativeColorValueDisallowTransparent;
    "labelsAdvancedColorSettings"?: Native__schema150;
    "separatorFontFamily": Native__schema146;
    "separatorFontSize": Native__schema147;
    "separatorFontColor": NativeColorValueDisallowTransparent;
    "backgroundColor": NativeColorValueAllowTransparent;
};
export type Native__schema137 = boolean;
export type Native__schema138 = string;
export type Native__schema139 = "Africa/Abidjan" | "Africa/Accra" | "Africa/Addis_Ababa" | "Africa/Algiers" | "Africa/Asmara" | "Africa/Bamako" | "Africa/Bangui" | "Africa/Banjul" | "Africa/Bissau" | "Africa/Blantyre" | "Africa/Brazzaville" | "Africa/Bujumbura" | "Africa/Cairo" | "Africa/Casablanca" | "Africa/Ceuta" | "Africa/Conakry" | "Africa/Dakar" | "Africa/Dar_es_Salaam" | "Africa/Djibouti" | "Africa/Douala" | "Africa/El_Aaiun" | "Africa/Freetown" | "Africa/Gaborone" | "Africa/Harare" | "Africa/Johannesburg" | "Africa/Juba" | "Africa/Kampala" | "Africa/Khartoum" | "Africa/Kigali" | "Africa/Kinshasa" | "Africa/Lagos" | "Africa/Libreville" | "Africa/Lome" | "Africa/Luanda" | "Africa/Lubumbashi" | "Africa/Lusaka" | "Africa/Malabo" | "Africa/Maputo" | "Africa/Maseru" | "Africa/Mbabane" | "Africa/Mogadishu" | "Africa/Monrovia" | "Africa/Nairobi" | "Africa/Ndjamena" | "Africa/Niamey" | "Africa/Nouakchott" | "Africa/Ouagadougou" | "Africa/Porto-Novo" | "Africa/Sao_Tome" | "Africa/Tripoli" | "Africa/Tunis" | "Africa/Windhoek" | "America/Adak" | "America/Anchorage" | "America/Anguilla" | "America/Antigua" | "America/Araguaina" | "America/Argentina/Buenos_Aires" | "America/Argentina/Catamarca" | "America/Argentina/Cordoba" | "America/Argentina/Jujuy" | "America/Argentina/La_Rioja" | "America/Argentina/Mendoza" | "America/Argentina/Rio_Gallegos" | "America/Argentina/Salta" | "America/Argentina/San_Juan" | "America/Argentina/San_Luis" | "America/Argentina/Tucuman" | "America/Argentina/Ushuaia" | "America/Aruba" | "America/Asuncion" | "America/Atikokan" | "America/Bahia" | "America/Bahia_Banderas" | "America/Barbados" | "America/Belem" | "America/Belize" | "America/Blanc-Sablon" | "America/Boa_Vista" | "America/Bogota" | "America/Boise" | "America/Cambridge_Bay" | "America/Campo_Grande" | "America/Cancun" | "America/Caracas" | "America/Cayenne" | "America/Cayman" | "America/Chicago" | "America/Chihuahua" | "America/Costa_Rica" | "America/Creston" | "America/Cuiaba" | "America/Curacao" | "America/Danmarkshavn" | "America/Dawson" | "America/Dawson_Creek" | "America/Denver" | "America/Detroit" | "America/Dominica" | "America/Edmonton" | "America/Eirunepe" | "America/El_Salvador" | "America/Fort_Nelson" | "America/Fortaleza" | "America/Glace_Bay" | "America/Godthab" | "America/Goose_Bay" | "America/Grand_Turk" | "America/Grenada" | "America/Guadeloupe" | "America/Guatemala" | "America/Guayaquil" | "America/Guyana" | "America/Halifax" | "America/Havana" | "America/Hermosillo" | "America/Indiana/Indianapolis" | "America/Indiana/Knox" | "America/Indiana/Marengo" | "America/Indiana/Petersburg" | "America/Indiana/Tell_City" | "America/Indiana/Vevay" | "America/Indiana/Vincennes" | "America/Indiana/Winamac" | "America/Inuvik" | "America/Iqaluit" | "America/Jamaica" | "America/Juneau" | "America/Kentucky/Louisville" | "Asia/Novokuznetsk" | "America/Kentucky/Monticello" | "America/Kralendijk" | "America/La_Paz" | "America/Lima" | "America/Los_Angeles" | "America/Lower_Princes" | "America/Maceio" | "America/Managua" | "America/Manaus" | "America/Marigot" | "America/Martinique" | "America/Matamoros" | "America/Mazatlan" | "America/Menominee" | "America/Merida" | "America/Metlakatla" | "America/Mexico_City" | "America/Miquelon" | "America/Moncton" | "America/Monterrey" | "America/Montevideo" | "America/Montserrat" | "America/Nassau" | "America/New_York" | "America/Nipigon" | "America/Nome" | "America/Noronha" | "America/North_Dakota/Beulah" | "America/North_Dakota/Center" | "America/North_Dakota/New_Salem" | "America/Ojinaga" | "America/Panama" | "America/Pangnirtung" | "America/Paramaribo" | "America/Phoenix" | "America/Port-au-Prince" | "America/Port_of_Spain" | "America/Porto_Velho" | "America/Puerto_Rico" | "America/Punta_Arenas" | "America/Rainy_River" | "America/Rankin_Inlet" | "America/Recife" | "America/Regina" | "America/Resolute" | "America/Rio_Branco" | "America/Santarem" | "America/Santiago" | "America/Santo_Domingo" | "America/Sao_Paulo" | "America/Scoresbysund" | "America/Sitka" | "America/St_Barthelemy" | "America/St_Johns" | "America/St_Kitts" | "America/St_Lucia" | "America/St_Thomas" | "America/St_Vincent" | "America/Swift_Current" | "America/Tegucigalpa" | "America/Thule" | "America/Thunder_Bay" | "America/Tijuana" | "America/Toronto" | "America/Tortola" | "America/Vancouver" | "America/Whitehorse" | "America/Winnipeg" | "America/Yakutat" | "America/Yellowknife" | "Antarctica/Casey" | "Antarctica/Davis" | "Antarctica/DumontDUrville" | "Antarctica/Macquarie" | "Antarctica/Mawson" | "Antarctica/McMurdo" | "Antarctica/Palmer" | "Antarctica/Rothera" | "Antarctica/Syowa" | "Antarctica/Troll" | "Antarctica/Vostok" | "Arctic/Longyearbyen" | "Asia/Aden" | "Asia/Almaty" | "Asia/Amman" | "Asia/Anadyr" | "Asia/Aqtau" | "Asia/Aqtobe" | "Asia/Ashgabat" | "Asia/Atyrau" | "Asia/Baghdad" | "Asia/Bahrain" | "Asia/Baku" | "Asia/Bangkok" | "Asia/Barnaul" | "Asia/Beirut" | "Asia/Bishkek" | "Asia/Brunei" | "Asia/Chita" | "Asia/Choibalsan" | "Asia/Colombo" | "Asia/Damascus" | "Asia/Dhaka" | "Asia/Dili" | "Asia/Dubai" | "Asia/Dushanbe" | "Asia/Famagusta" | "Asia/Gaza" | "Asia/Hebron" | "Asia/Ho_Chi_Minh" | "Asia/Hong_Kong" | "Asia/Hovd" | "Asia/Irkutsk" | "Asia/Jakarta" | "Asia/Jayapura" | "Asia/Jerusalem" | "Asia/Kabul" | "Asia/Kamchatka" | "Asia/Karachi" | "Asia/Kathmandu" | "Asia/Khandyga" | "Asia/Kolkata" | "Asia/Krasnoyarsk" | "Asia/Kuala_Lumpur" | "Asia/Kuching" | "Asia/Kuwait" | "Asia/Macau" | "Asia/Magadan" | "Asia/Makassar" | "Asia/Manila" | "Asia/Muscat" | "Asia/Nicosia" | "Asia/Novosibirsk" | "Asia/Omsk" | "Asia/Oral" | "Asia/Phnom_Penh" | "Asia/Pontianak" | "Asia/Pyongyang" | "Asia/Qatar" | "Asia/Qyzylorda" | "Asia/Riyadh" | "Asia/Sakhalin" | "Asia/Samarkand" | "Asia/Seoul" | "Asia/Shanghai" | "Asia/Singapore" | "Asia/Srednekolymsk" | "Asia/Taipei" | "Asia/Tashkent" | "Asia/Tbilisi" | "Asia/Tehran" | "Asia/Thimphu" | "Asia/Tokyo" | "Asia/Tomsk" | "Asia/Ulaanbaatar" | "Asia/Urumqi" | "Asia/Ust-Nera" | "Asia/Vientiane" | "Asia/Vladivostok" | "Asia/Yakutsk" | "Asia/Yangon" | "Asia/Yekaterinburg" | "Asia/Yerevan" | "Atlantic/Azores" | "Atlantic/Bermuda" | "Atlantic/Canary" | "Atlantic/Cape_Verde" | "Atlantic/Faroe" | "Atlantic/Madeira" | "Atlantic/Reykjavik" | "Atlantic/South_Georgia" | "Atlantic/St_Helena" | "Atlantic/Stanley" | "Australia/Adelaide" | "Australia/Brisbane" | "Australia/Broken_Hill" | "Australia/Currie" | "Australia/Darwin" | "Australia/Eucla" | "Australia/Hobart" | "Australia/Lindeman" | "Australia/Lord_Howe" | "Australia/Melbourne" | "Australia/Perth" | "Australia/Sydney" | "Canada/Atlantic" | "Canada/Central" | "Canada/Eastern" | "Canada/Mountain" | "Canada/Newfoundland" | "Canada/Pacific" | "Europe/Amsterdam" | "Europe/Andorra" | "Europe/Astrakhan" | "Europe/Athens" | "Europe/Belgrade" | "Europe/Berlin" | "Europe/Bratislava" | "Europe/Brussels" | "Europe/Bucharest" | "Europe/Budapest" | "Europe/Busingen" | "Europe/Chisinau" | "Europe/Copenhagen" | "Europe/Dublin" | "Europe/Gibraltar" | "Europe/Guernsey" | "Europe/Helsinki" | "Europe/Isle_of_Man" | "Europe/Istanbul" | "Europe/Jersey" | "Europe/Kaliningrad" | "Europe/Kiev" | "Europe/Kyiv" | "Europe/Kirov" | "Europe/Lisbon" | "Europe/Ljubljana" | "Europe/London" | "Europe/Luxembourg" | "Europe/Madrid" | "Europe/Malta" | "Europe/Mariehamn" | "Europe/Minsk" | "Europe/Monaco" | "Europe/Moscow" | "Europe/Oslo" | "Europe/Paris" | "Europe/Podgorica" | "Europe/Prague" | "Europe/Riga" | "Europe/Rome" | "Europe/Samara" | "Europe/San_Marino" | "Europe/Sarajevo" | "Europe/Saratov" | "Europe/Simferopol" | "Europe/Skopje" | "Europe/Sofia" | "Europe/Stockholm" | "Europe/Tallinn" | "Europe/Tirane" | "Europe/Ulyanovsk" | "Europe/Uzhgorod" | "Europe/Vaduz" | "Europe/Vatican" | "Europe/Vienna" | "Europe/Vilnius" | "Europe/Volgograd" | "Europe/Warsaw" | "Europe/Zagreb" | "Europe/Zaporozhye" | "Europe/Zaporizhia" | "Europe/Zurich" | "GMT" | "Indian/Antananarivo" | "Indian/Chagos" | "Indian/Christmas" | "Indian/Cocos" | "Indian/Comoro" | "Indian/Kerguelen" | "Indian/Mahe" | "Indian/Maldives" | "Indian/Mauritius" | "Indian/Mayotte" | "Indian/Reunion" | "Pacific/Apia" | "Pacific/Auckland" | "Pacific/Bougainville" | "Pacific/Chatham" | "Pacific/Chuuk" | "Pacific/Easter" | "Pacific/Efate" | "Pacific/Enderbury" | "Pacific/Fakaofo" | "Pacific/Fiji" | "Pacific/Funafuti" | "Pacific/Galapagos" | "Pacific/Gambier" | "Pacific/Guadalcanal" | "Pacific/Guam" | "Pacific/Honolulu" | "Pacific/Kiritimati" | "Pacific/Kosrae" | "Pacific/Kwajalein" | "Pacific/Majuro" | "Pacific/Marquesas" | "Pacific/Midway" | "Pacific/Nauru" | "Pacific/Niue" | "Pacific/Norfolk" | "Pacific/Noumea" | "Pacific/Pago_Pago" | "Pacific/Palau" | "Pacific/Pitcairn" | "Pacific/Pohnpei" | "Pacific/Port_Moresby" | "Pacific/Rarotonga" | "Pacific/Saipan" | "Pacific/Tahiti" | "Pacific/Tarawa" | "Pacific/Tongatapu" | "Pacific/Wake" | "Pacific/Wallis" | "US/Alaska" | "US/Arizona" | "US/Central" | "US/Eastern" | "US/Hawaii" | "US/Mountain" | "US/Pacific" | "UTC";
export type Native__schema140 = (Native__schema108) | (null);
export type Native__schema141 = boolean;
export type Native__schema142 = "CAPITALIZE" | "UPPER" | "LOWER";
export type Native__schema143 = string;
export type Native__schema144 = "id" | "ms" | "bs" | "bg" | "da" | "de" | "et" | "en" | "es" | "fr" | "hr" | "it" | "lv" | "lt" | "hu" | "nl" | "no" | "pl" | "pt" | "ro" | "sk" | "sl" | "sr" | "fi" | "sv" | "vi" | "tr" | "cz" | "el" | "ru" | "uk" | "he" | "ar" | "th" | "zh" | "ja" | "ko";
export type Native__schema145 = boolean;
export type Native__schema146 = "arial,'helvetica neue',helvetica,sans-serif" | "'comic sans ms','marker felt-thin',arial,sans-serif" | "'courier new',courier,'lucida sans typewriter','lucida typewriter',monospace" | "georgia,times,'times new roman',serif" | "helvetica,'helvetica neue',arial,verdana,sans-serif" | "'lucida sans unicode','lucida grande',sans-serif" | "tahoma,verdana,segoe,sans-serif" | "'times new roman',times,baskerville,georgia,serif" | "'trebuchet ms','lucida grande','lucida sans unicode','lucida sans',tahoma,sans-serif" | "verdana,geneva,sans-serif" | "arvo,courier,georgia,serif" | "lato,'helvetica neue',helvetica,arial,sans-serif" | "lora,georgia,'times new roman',serif" | "merriweather,georgia,'times new roman',serif" | "'merriweather sans','helvetica neue',helvetica,arial,sans-serif" | "'noticia text',georgia,'times new roman',serif" | "'open sans','helvetica neue',helvetica,arial,sans-serif" | "'playfair display',georgia,'times new roman',serif" | "roboto,'helvetica neue',helvetica,arial,sans-serif" | "'source sans pro','helvetica neue',helvetica,arial,sans-serif";
export type Native__schema147 = number;
export type Native__schema148 = {
    "days": NativeColorValueDisallowTransparent;
    "hours": NativeColorValueDisallowTransparent;
    "minutes": NativeColorValueDisallowTransparent;
    "seconds": NativeColorValueDisallowTransparent;
};
export type Native__schema149 = {
    "days": NativeColorValueDisallowTransparent;
    "hours": NativeColorValueDisallowTransparent;
    "minutes": NativeColorValueDisallowTransparent;
    "seconds": NativeColorValueDisallowTransparent;
};
export type Native__schema150 = {
    "days": NativeColorValueDisallowTransparent;
    "hours": NativeColorValueDisallowTransparent;
    "minutes": NativeColorValueDisallowTransparent;
    "seconds": NativeColorValueDisallowTransparent;
};
export type NativeSocialBlock = {
    "id": Native__schema90;
    "type": Native__schema151;
    "settings": Native__schema152;
};
export type Native__schema151 = "social";
export type Native__schema152 = {
    "networks": Native__schema153;
    "style": Native__schema161;
    "iconSize": Native__schema162;
    "spaceBetweenIcons": Native__schema163;
    "textCustomization": Native__schema166;
    "alignment": Native__schema167;
    "backgroundColor": NativeColorValueAllowTransparent;
    "hideElement": NativeHideElement;
    "margins": Native__schema168;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema127;
};
export type Native__schema153 = Array<Native__schema154>;
export type Native__schema154 = {
    "type": Native__schema155;
    "link"?: Native__schema156;
    "icon"?: Native__schema158;
    "title": Native__schema159;
    "alt"?: Native__schema160;
};
export type Native__schema155 = "twitter" | "xcom" | "facebook" | "youtube" | "askfm" | "behance" | "dribbble" | "flickr" | "foursquare" | "googleplus" | "instagram" | "lastfm" | "linkedin" | "myspace" | "pinterest" | "soundcloud" | "tumblr" | "vimeo" | "hangouts" | "messenger" | "skype" | "snapchat" | "telegram" | "viber" | "whatsapp" | "email" | "website" | "mapmarker" | "world" | "address" | "phone" | "share" | "rss" | "appstore" | "googleplay" | "windowsstore" | "wechat" | "weibo" | "blogger" | "medium" | "dropbox" | "googledrive" | "slack" | "github" | "pdf" | "doc" | "xls" | "ppt" | "xing" | "meetup" | "fleeped" | "tripAdvisor" | "spotify" | "tiktok" | "workplace" | "gmail" | "iTunesPodcasts" | "zoom" | "teams" | "onedrive" | "discord" | "twitch" | "line" | "patreon" | "kofi" | "yammer" | "buyMeACoffee" | "huaweiAppGallery" | "googleBusiness" | "reddit" | "strava" | "goodreads" | "custom" | "yelp" | "google" | "mastodon" | "glassdoor" | "threads" | "bluesky" | "digg" | "meet";
export type Native__schema156 = {
    "type": Native__schema109;
    "href": Native__schema157;
};
export type Native__schema157 = string;
export type Native__schema158 = string;
export type Native__schema159 = string;
export type Native__schema160 = string;
export type Native__schema161 = "custom" | "logoColored" | "logoBlack" | "logoGray" | "logoWhite" | "circleColored" | "circleColoredBordered" | "roundedColored" | "roundedColoredBordered" | "squareColored" | "squareColoredBordered" | "circleBlack" | "circleBlackBordered" | "roundedBlack" | "roundedBlackBordered" | "squareBlack" | "squareBlackBordered" | "circleGray" | "circleGrayBordered" | "roundedGray" | "roundedGrayBordered" | "squareGray" | "squareGrayBordered" | "circleWhite" | "circleWhiteBordered" | "roundedWhite" | "roundedWhiteBordered" | "squareWhite" | "squareWhiteBordered";
export type Native__schema162 = number;
export type Native__schema163 = {
    "desktop": Native__schema164;
    "mobile": Native__schema165;
};
export type Native__schema164 = number;
export type Native__schema165 = number;
export type Native__schema166 = boolean;
export type Native__schema167 = {
    "desktop": Native__schema119;
    "mobile": Native__schema119;
};
export type Native__schema168 = {
    "desktop": Native__schema169;
    "mobile": Native__schema169;
};
export type Native__schema169 = {
    "top": Native__schema170;
    "right": Native__schema171;
    "bottom": Native__schema172;
    "left": Native__schema173;
};
export type Native__schema170 = number;
export type Native__schema171 = number;
export type Native__schema172 = number;
export type Native__schema173 = number;
export type NativeHtmlBlock = {
    "id": Native__schema90;
    "type": Native__schema174;
    "settings": Native__schema175;
    "content"?: Native__schema176;
};
export type Native__schema174 = "html";
export type Native__schema175 = {
    "margins": Native__schema121;
    "includeInOutput": NativeOutputInclusion;
    "hideElement": NativeHideElement;
    "anchorLinkName": Native__schema127;
};
export type Native__schema176 = string;
export type NativeButtonBlock = {
    "id": Native__schema90;
    "type": Native__schema177;
    "settings": NativeButtonBlockSettings;
};
export type Native__schema177 = "button";
export type NativeButtonBlockSettings = {
    "link"?: Native__schema178;
    "text": Native__schema190;
    "alignment": Native__schema191;
    "fixedHeight"?: Native__schema192;
    "icon"?: Native__schema195;
    "hideElement": NativeHideElement;
    "padding": Native__schema200;
    "margins": Native__schema200;
    "includeInOutput": NativeOutputInclusion;
    "anchorLink": Native__schema203;
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
export type Native__schema178 = (Native__schema180) | (Native__schema183);
export type Native__schema179 = (Native__schema180) | (Native__schema183);
export type Native__schema180 = {
    "type": Native__schema181;
    "value": Native__schema182;
};
export type Native__schema181 = "site" | "anchor" | "email" | "phone" | "sms" | "telegram" | "viber" | "file" | "other";
export type Native__schema182 = string;
export type Native__schema183 = {
    "type": Native__schema184;
    "value": Native__schema185;
    "salesforce": Native__schema186;
};
export type Native__schema184 = "salesforce_mc";
export type Native__schema185 = string;
export type Native__schema186 = {
    "trackingAlias": Native__schema187;
    "linkTo": Native__schema188;
    "conversion": Native__schema189;
};
export type Native__schema187 = string;
export type Native__schema188 = string;
export type Native__schema189 = boolean;
export type Native__schema190 = string;
export type Native__schema191 = {
    "desktop": Native__schema119;
    "mobile": Native__schema119;
};
export type Native__schema192 = {
    "height": Native__schema193;
    "alignment"?: Native__schema194;
};
export type Native__schema193 = number;
export type Native__schema194 = "top" | "middle" | "bottom";
export type Native__schema195 = {
    "src": Native__schema196;
    "width": Native__schema197;
    "align": Native__schema198;
    "indent": Native__schema199;
};
export type Native__schema196 = string;
export type Native__schema197 = number;
export type Native__schema198 = "left" | "right";
export type Native__schema199 = number;
export type Native__schema200 = {
    "desktop": Native__schema201;
    "mobile": Native__schema201;
};
export type Native__schema201 = {
    "top": Native__schema202;
    "right": Native__schema202;
    "bottom": Native__schema202;
    "left": Native__schema202;
};
export type Native__schema202 = number;
export type Native__schema203 = string;
export type NativeFontSize = {
    "desktop": Native__schema204;
    "mobile": Native__schema205;
};
export type Native__schema204 = number;
export type Native__schema205 = number;
export type NativeButtonsTextStyle = {
    "bold": Native__schema206;
    "italic": Native__schema207;
};
export type Native__schema206 = boolean;
export type Native__schema207 = boolean;
export type NativeResponsiveBoolean = {
    "desktop": Native__schema208;
    "mobile": Native__schema209;
};
export type Native__schema208 = boolean;
export type Native__schema209 = boolean;
export type NativeSpacerBlock = {
    "id": Native__schema90;
    "type": Native__schema210;
    "settings": Native__schema211;
};
export type Native__schema210 = "spacer";
export type Native__schema211 = {
    "mode": Native__schema212;
    "width"?: Native__schema213;
    "height"?: Native__schema219;
    "border"?: Native__schema222;
    "mobileBorder"?: Native__schema225;
    "alignment"?: Native__schema227;
    "backgroundColor": NativeColorValueAllowTransparent;
    "margins": Native__schema228;
    "anchorLinkName": Native__schema127;
    "includeInOutput": NativeOutputInclusion;
    "hideElement": NativeHideElement;
};
export type Native__schema212 = "line" | "space";
export type Native__schema213 = {
    "desktop": Native__schema214;
    "mobile": Native__schema218;
};
export type Native__schema214 = {
    "value": Native__schema215;
    "unit": Native__schema216;
};
export type Native__schema215 = number;
export type Native__schema216 = "percent" | "px";
export type Native__schema217 = {
    "value": Native__schema215;
    "unit": Native__schema216;
};
export type Native__schema218 = {
    "value": Native__schema215;
    "unit": Native__schema216;
};
export type Native__schema219 = {
    "desktop": Native__schema220;
    "mobile": Native__schema221;
};
export type Native__schema220 = number;
export type Native__schema221 = number;
export type Native__schema222 = {
    "size": Native__schema224;
    "style": Native__schema60;
    "color": NativeColorValueDisallowTransparent;
};
export type Native__schema223 = {
    "size": Native__schema224;
    "style": Native__schema60;
    "color": NativeColorValueDisallowTransparent;
};
export type Native__schema224 = number;
export type Native__schema225 = (Native__schema223) | (null);
export type Native__schema226 = (Native__schema223) | (null);
export type Native__schema227 = {
    "desktop": Native__schema119;
    "mobile": Native__schema119;
};
export type Native__schema228 = {
    "desktop": Native__schema229;
    "mobile": Native__schema229;
};
export type Native__schema229 = {
    "top": Native__schema230;
    "right": Native__schema231;
    "bottom": Native__schema232;
    "left": Native__schema233;
};
export type Native__schema230 = number;
export type Native__schema231 = number;
export type Native__schema232 = number;
export type Native__schema233 = number;
export type NativeMenuBlock = {
    "id": Native__schema90;
    "type": Native__schema234;
    "settings": NativeMenuBlockSettings;
};
export type Native__schema234 = "menu";
export type NativeMenuBlockSettings = {
    "responsiveMenu": Native__schema235;
    "itemType": Native__schema236;
    "fitToContainer": Native__schema239;
    "itemPadding": Native__schema240;
    "margins": Native__schema240;
    "anchorLinkName": Native__schema127;
    "includeInOutput": NativeOutputInclusion;
    "separator": NativeMenuSeparator;
    "fontFamily": Native__schema8;
    "fontSize": NativeFontSize;
    "hideElement": NativeHideElement;
    "textStyle": NativeButtonsTextStyle;
    "colors": Native__schema245;
    "items": Native__schema248;
};
export type Native__schema235 = boolean;
export type Native__schema236 = (Native__schema237) | (Native__schema238);
export type Native__schema237 = {
    "mode": "shared";
    "type": NativeMenuItemType;
};
export type NativeMenuItemType = "links" | "icons" | "linksWithIcons";
export type Native__schema238 = {
    "mode": "perItem";
};
export type Native__schema239 = boolean;
export type Native__schema240 = {
    "desktop": Native__schema241;
    "mobile": Native__schema241;
};
export type Native__schema241 = {
    "top": Native__schema242;
    "right": Native__schema242;
    "bottom": Native__schema242;
    "left": Native__schema242;
};
export type Native__schema242 = number;
export type NativeMenuSeparator = {
    "width": Native__schema243;
    "style": Native__schema244;
    "color": NativeColorValueDisallowTransparent;
};
export type Native__schema243 = number;
export type Native__schema244 = "none" | "line" | "dashed" | "dotted";
export type Native__schema245 = (Native__schema246) | (Native__schema247);
export type Native__schema246 = {
    "mode": "shared";
    "link": NativeColorValueDisallowTransparent;
};
export type Native__schema247 = {
    "mode": "perItem";
};
export type Native__schema248 = Array<NativeMenuItem>;
export type NativeMenuItem = {
    "type"?: Native__schema249;
    "name": Native__schema250;
    "link": NativeMenuLink;
    "image"?: Native__schema253;
    "hideElement": NativeHideElement;
    "colors"?: Native__schema260;
};
export type Native__schema249 = "links" | "icons" | "linksWithIcons";
export type Native__schema250 = string;
export type NativeMenuLink = {
    "type": Native__schema251;
    "value": Native__schema252;
};
export type Native__schema251 = "site" | "email" | "phone" | "anchor";
export type Native__schema252 = string;
export type Native__schema253 = {
    "src": Native__schema254;
    "size": NativeMenuImageSize;
    "alignment": Native__schema257;
    "indent": Native__schema258;
    "altText": Native__schema259;
};
export type NativeMenuItemImage = {
    "src": Native__schema254;
    "size": NativeMenuImageSize;
    "alignment": Native__schema257;
    "indent": Native__schema258;
    "altText": Native__schema259;
};
export type Native__schema254 = string;
export type NativeMenuImageSize = {
    "mode": Native__schema255;
    "px": Native__schema256;
};
export type Native__schema255 = "width" | "height";
export type Native__schema256 = number;
export type Native__schema257 = "left" | "center" | "right";
export type Native__schema258 = number;
export type Native__schema259 = string;
export type Native__schema260 = {
    "link": NativeColorValueDisallowTransparent;
    "background": NativeColorValueAllowTransparent;
};
export type NativeUnknownBlock = {
    "id": Native__schema90;
    "type": Native__schema261;
    "settings"?: Native__schema262;
    "content": Native__schema265;
    "extension": Native__schema266;
};
export type Native__schema261 = "unknown";
export type Native__schema262 = {
    [key: string]: Native__schema264;
};
export type Native__schema263 = string;
export type Native__schema264 = unknown;
export type Native__schema265 = string;
export type Native__schema266 = boolean;
export type DocumentState = {
    "metadata"?: Native__schema0;
    "resources"?: Native__schema5;
    "settings": Native__schema11;
    "stripes"?: Native__schema35;
};
export type DocumentBlock = NativeBlock;
export type BlockKind = DocumentBlock['type'];
export type BlockOf<K extends BlockKind> = Extract<DocumentBlock, {
    type: K;
}>;
export type BlockSettings<K extends BlockKind> = BlockOf<K>['settings'];

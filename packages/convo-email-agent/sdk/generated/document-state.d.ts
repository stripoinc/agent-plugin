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
    "stripes": Native__schema20;
    "headings": Native__schema32;
    "buttons": Native__schema34;
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
    "marginsAroundMessage": Native__schema16;
    "defaultStructurePadding": Native__schema16;
    "customListStyles": ({
        "leftIndent": number;
        "listItemsBottomSpace": number;
        "listTopBottomMargin": number;
    }) | (null);
    "lightTheme": {
        "backgroundColor": Native__schema18;
        "customListStyles": {
            "listMarkerColor": Native__schema19;
            "listNumberMarkerColor": Native__schema19;
        };
    };
    "darkTheme": {
        "backgroundColor": (Native__schema18) | (null);
        "customListStyles": {
            "listMarkerColor": (Native__schema19) | (null);
            "listNumberMarkerColor": (Native__schema19) | (null);
        };
        "backgroundImage"?: (Native__schema14) | (null);
    };
};
export type Native__schema13 = {
    "path": Native__schema14;
    "repeat": boolean;
    "x": string;
    "y": string;
    "sizeX": Native__schema15;
    "sizeY": Native__schema15;
};
export type Native__schema14 = string;
export type Native__schema15 = string;
export type Native__schema16 = {
    "desktop": Native__schema17;
    "mobile": Native__schema17;
};
export type Native__schema17 = {
    "top": number;
    "right": number;
    "bottom": number;
    "left": number;
};
export type Native__schema18 = string;
export type Native__schema19 = string;
export type Native__schema20 = {
    "letterSpacing": Native__schema21;
    "lineHeight": {
        "desktop": Native__schema22;
        "mobile": Native__schema23;
    };
    "fontFamily": Native__schema24;
    "fontWeight": Native__schema25;
    "header": {
        "fontSize": Native__schema26;
        "paragraphBottomSpace": Native__schema29;
        "backgroundImage": (Native__schema13) | (null);
    };
    "content": {
        "fontSize": Native__schema26;
        "paragraphBottomSpace": Native__schema29;
    };
    "footer": {
        "fontSize": Native__schema26;
        "paragraphBottomSpace": Native__schema29;
        "backgroundImage": (Native__schema13) | (null);
    };
    "infoArea": {
        "fontSize": Native__schema26;
        "paragraphBottomSpace": Native__schema29;
    };
    "lightTheme": {
        "header": {
            "stripeBackgroundColor": Native__schema18;
            "contentBackgroundColor": Native__schema18;
            "fontColor": Native__schema31;
            "linkColor": Native__schema31;
            "linkColorHover": Native__schema31;
        };
        "content": {
            "contentBackgroundColor": Native__schema18;
            "fontColor": Native__schema31;
            "linkColor": Native__schema31;
            "linkColorHover": Native__schema31;
        };
        "footer": {
            "stripeBackgroundColor": Native__schema18;
            "contentBackgroundColor": Native__schema18;
            "fontColor": Native__schema31;
            "linkColor": Native__schema31;
            "linkColorHover": Native__schema31;
        };
        "infoArea": {
            "fontColor": Native__schema31;
            "linkColor": Native__schema31;
            "linkColorHover": Native__schema31;
        };
    };
    "darkTheme": {
        "header": {
            "stripeBackgroundColor": (Native__schema18) | (null);
            "contentBackgroundColor": (Native__schema18) | (null);
            "fontColor": (Native__schema31) | (null);
            "linkColor": (Native__schema31) | (null);
            "linkColorHover": (Native__schema31) | (null);
        };
        "content": {
            "contentBackgroundColor": (Native__schema18) | (null);
            "fontColor": (Native__schema31) | (null);
            "linkColor": (Native__schema31) | (null);
            "linkColorHover": (Native__schema31) | (null);
        };
        "footer": {
            "stripeBackgroundColor": (Native__schema18) | (null);
            "contentBackgroundColor": (Native__schema18) | (null);
            "fontColor": (Native__schema31) | (null);
            "linkColor": (Native__schema31) | (null);
            "linkColorHover": (Native__schema31) | (null);
        };
        "infoArea": {
            "fontColor": (Native__schema31) | (null);
            "linkColor": (Native__schema31) | (null);
            "linkColorHover": (Native__schema31) | (null);
        };
    };
};
export type Native__schema21 = {
    "value": number;
    "unit": "px" | "em";
};
export type Native__schema22 = number;
export type Native__schema23 = number;
export type Native__schema24 = string;
export type Native__schema25 = number;
export type Native__schema26 = {
    "desktop": Native__schema27;
    "mobile": Native__schema28;
};
export type Native__schema27 = number;
export type Native__schema28 = number;
export type Native__schema29 = (Native__schema30) | (null);
export type Native__schema30 = {
    "desktop": number;
    "mobile": number;
};
export type Native__schema31 = string;
export type Native__schema32 = {
    "letterSpacing": Native__schema21;
    "fontFamily": Native__schema24;
    "h1": Native__schema33;
    "h2": Native__schema33;
    "h3": Native__schema33;
    "h4": Native__schema33;
    "h5": Native__schema33;
    "h6": Native__schema33;
    "lightTheme": {
        "h1": {
            "fontColor": Native__schema31;
        };
        "h2": {
            "fontColor": Native__schema31;
        };
        "h3": {
            "fontColor": Native__schema31;
        };
        "h4": {
            "fontColor": Native__schema31;
        };
        "h5": {
            "fontColor": Native__schema31;
        };
        "h6": {
            "fontColor": Native__schema31;
        };
    };
    "darkTheme": {
        "h1": {
            "fontColor": (Native__schema31) | (null);
        };
        "h2": {
            "fontColor": (Native__schema31) | (null);
        };
        "h3": {
            "fontColor": (Native__schema31) | (null);
        };
        "h4": {
            "fontColor": (Native__schema31) | (null);
        };
        "h5": {
            "fontColor": (Native__schema31) | (null);
        };
        "h6": {
            "fontColor": (Native__schema31) | (null);
        };
    };
};
export type Native__schema33 = {
    "textAlign": {
        "mobile": ("left" | "center" | "right") | (null);
    };
    "textStyle": {
        "italic": boolean;
    };
    "fontWeight": (Native__schema25) | (null);
    "fontSize": {
        "desktop": (Native__schema27) | (null);
        "mobile": (Native__schema28) | (null);
    };
    "lineHeight": {
        "desktop": (Native__schema22) | (null);
        "mobile": (Native__schema23) | (null);
    };
    "paragraphBottomSpace": (Native__schema30) | (null);
};
export type Native__schema34 = {
    "outlookSupport": boolean;
    "textStyle": {
        "bold": boolean;
        "italic": boolean;
    };
    "textTransform": "none" | "uppercase" | "capitalize" | "lowercase";
    "fontFamily": Native__schema24;
    "letterSpacing": Native__schema21;
    "fontSize": Native__schema26;
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
        "top": Native__schema35;
        "right": Native__schema35;
        "bottom": Native__schema35;
        "left": Native__schema35;
        "style": "solid" | "dashed" | "dotted";
    };
    "hoverButtonStyles": boolean;
    "padding": Native__schema16;
    "lightTheme": {
        "buttonColor": Native__schema18;
        "fontColor": Native__schema31;
        "hoverButtonStyles": {
            "backgroundColor": Native__schema18;
            "fontColor": Native__schema31;
            "borderColor": {
                "top": Native__schema19;
                "right": Native__schema19;
                "bottom": Native__schema19;
                "left": Native__schema19;
            };
        };
        "borderColor": {
            "top": Native__schema19;
            "right": Native__schema19;
            "bottom": Native__schema19;
            "left": Native__schema19;
        };
    };
    "darkTheme": {
        "buttonColor": (Native__schema18) | (null);
        "fontColor": (Native__schema31) | (null);
        "hoverButtonStyles": {
            "backgroundColor": (Native__schema18) | (null);
            "fontColor": (Native__schema31) | (null);
            "borderColor": {
                "top": (Native__schema19) | (null);
                "right": (Native__schema19) | (null);
                "bottom": (Native__schema19) | (null);
                "left": (Native__schema19) | (null);
            };
        };
        "borderColor": {
            "top": (Native__schema19) | (null);
            "right": (Native__schema19) | (null);
            "bottom": (Native__schema19) | (null);
            "left": (Native__schema19) | (null);
        };
    };
};
export type Native__schema35 = {
    "width": number;
};
export type Native__schema36 = Array<NativeStripe>;
export type Native__schema37 = Array<NativeStripe>;
export type NativeStripe = {
    "id": Native__schema38;
    "settings"?: Native__schema39;
    "moduleId"?: Native__schema62;
    "structures"?: Native__schema63;
};
export type Native__schema38 = string;
export type Native__schema39 = {
    "messageArea"?: Native__schema40;
    "includeInOutput"?: Native__schema41;
    "hideElement": NativeHideElement;
    "padding"?: Native__schema42;
    "stripeBackgroundColor"?: Native__schema47;
    "contentBackgroundColor"?: Native__schema48;
    "backgroundImage"?: Native__schema49;
    "contentBorder"?: Native__schema59;
};
export type NativeStripeSettings = {
    "messageArea"?: Native__schema40;
    "includeInOutput"?: Native__schema41;
    "hideElement": NativeHideElement;
    "padding"?: Native__schema42;
    "stripeBackgroundColor"?: Native__schema47;
    "contentBackgroundColor"?: Native__schema48;
    "backgroundImage"?: Native__schema49;
    "contentBorder"?: Native__schema59;
};
export type Native__schema40 = "header" | "content" | "footer" | "infoArea";
export type Native__schema41 = "both" | "html" | "ampHtml";
export type NativeOutputInclusion = "both" | "html" | "ampHtml";
export type NativeHideElement = "no" | "desktop" | "mobile";
export type Native__schema42 = {
    "mobile": NativeFullSideValues;
};
export type NativeMobilePadding = {
    "mobile": NativeFullSideValues;
};
export type NativeFullSideValues = {
    "top": Native__schema43;
    "right": Native__schema44;
    "bottom": Native__schema45;
    "left": Native__schema46;
};
export type Native__schema43 = number;
export type Native__schema44 = number;
export type Native__schema45 = number;
export type Native__schema46 = number;
export type Native__schema47 = string;
export type NativeColorValueAllowTransparent = string;
export type Native__schema48 = string;
export type Native__schema49 = {
    "path": Native__schema50;
    "repeat": boolean;
    "x": Native__schema53;
    "y": Native__schema54;
    "sizeX": string;
    "sizeY": string;
};
export type NativeBackgroundImage = {
    "path": Native__schema50;
    "repeat": boolean;
    "x": Native__schema53;
    "y": Native__schema54;
    "sizeX": string;
    "sizeY": string;
};
export type Native__schema50 = string;
export type Native__schema51 = boolean | string;
export type Native__schema52 = boolean | string;
export type Native__schema53 = string;
export type Native__schema54 = string;
export type Native__schema55 = string;
export type Native__schema56 = string;
export type Native__schema57 = string;
export type Native__schema58 = string;
export type Native__schema59 = {
    "top": NativeBorderSide;
    "right": NativeBorderSide;
    "bottom": NativeBorderSide;
    "left": NativeBorderSide;
    "style": Native__schema61;
};
export type NativeBorder = {
    "top": NativeBorderSide;
    "right": NativeBorderSide;
    "bottom": NativeBorderSide;
    "left": NativeBorderSide;
    "style": Native__schema61;
};
export type NativeBorderSide = {
    "width": Native__schema60;
    "color": NativeColorValueAllowTransparent;
};
export type Native__schema60 = number;
export type Native__schema61 = "solid" | "dashed" | "dotted";
export type Native__schema62 = number;
export type Native__schema63 = Array<NativeStructure>;
export type NativeStructure = {
    "id": Native__schema64;
    "settings"?: Native__schema65;
    "moduleId"?: Native__schema80;
    "columns"?: Native__schema81;
};
export type Native__schema64 = string;
export type Native__schema65 = {
    "backgroundColor": NativeColorValueAllowTransparent;
    "backgroundImage"?: Native__schema66;
    "border": NativeBorder;
    "borderRadius": NativeBorderRadius;
    "columnsGap"?: Native__schema71;
    "responsiveMobile"?: Native__schema74;
    "responsiveMobileContainersInversion"?: Native__schema75;
    "padding"?: Native__schema76;
    "margins"?: Native__schema77;
    "includeInOutput"?: Native__schema78;
    "hideElement"?: Native__schema79;
};
export type Native__schema66 = {
    "path": Native__schema50;
    "repeat": boolean;
    "x": Native__schema53;
    "y": Native__schema54;
    "sizeX": string;
    "sizeY": string;
};
export type NativeBorderRadius = {
    "topLeft": Native__schema67;
    "topRight": Native__schema68;
    "bottomRight": Native__schema69;
    "bottomLeft": Native__schema70;
};
export type Native__schema67 = number;
export type Native__schema68 = number;
export type Native__schema69 = number;
export type Native__schema70 = number;
export type Native__schema71 = {
    "desktop": Native__schema72;
    "mobile": Native__schema73;
};
export type NativeResponsiveNumber = {
    "desktop": Native__schema72;
    "mobile": Native__schema73;
};
export type Native__schema72 = number;
export type Native__schema73 = number;
export type Native__schema74 = boolean;
export type Native__schema75 = boolean;
export type Native__schema76 = {
    "desktop": NativeFullSideValues;
    "mobile": NativeFullSideValues;
};
export type NativeResponsivePadding = {
    "desktop": NativeFullSideValues;
    "mobile": NativeFullSideValues;
};
export type Native__schema77 = {
    "desktop": NativeFullSideValues;
    "mobile": NativeFullSideValues;
};
export type Native__schema78 = "both" | "html" | "ampHtml";
export type Native__schema79 = "no" | "desktop" | "mobile";
export type Native__schema80 = number;
export type Native__schema81 = Array<NativeColumn>;
export type NativeColumn = {
    "id": Native__schema82;
    "settings"?: Native__schema83;
    "containers": Native__schema85;
};
export type Native__schema82 = string;
export type Native__schema83 = {
    "width": Native__schema84;
};
export type Native__schema84 = number;
export type Native__schema85 = Array<NativeContainer>;
export type NativeContainer = {
    "id": Native__schema86;
    "settings": Native__schema87;
    "moduleId"?: Native__schema89;
    "blocks"?: Native__schema90;
};
export type Native__schema86 = string;
export type Native__schema87 = {
    "padding": NativeResponsivePadding;
    "includeInOutput": NativeOutputInclusion;
    "hideElement": NativeHideElement;
    "backgroundColor": NativeColorValueAllowTransparent;
    "backgroundImage"?: Native__schema88;
    "border": NativeBorder;
    "radius": NativeBorderRadius;
};
export type Native__schema88 = {
    "path": Native__schema50;
    "repeat": boolean;
    "x": Native__schema53;
    "y": Native__schema54;
    "sizeX": string;
    "sizeY": string;
};
export type Native__schema89 = number;
export type Native__schema90 = Array<NativeBlock>;
export type NativeBlock = (NativeTextBlock) | (NativeImageBlock) | (NativeVideoBlock) | (NativeTimerBlock) | (NativeSocialBlock) | (NativeHtmlBlock) | (NativeButtonBlock) | (NativeSpacerBlock) | (NativeMenuBlock) | (NativeUnknownBlock);
export type NativeTextBlock = {
    "id": Native__schema91;
    "type": Native__schema92;
    "settings"?: Native__schema93;
    "content"?: Native__schema104;
};
export type Native__schema91 = string;
export type Native__schema92 = "text";
export type Native__schema93 = {
    "fontColor"?: string;
    "hideElement": NativeHideElement;
    "rightToLeftTextDirection": boolean;
    "alignment"?: {
        "desktop": Native__schema94;
        "mobile": Native__schema94;
    };
    "fixedHeight"?: {
        "desktop"?: Native__schema95;
        "mobile"?: Native__schema99;
    };
    "padding": {
        "desktop": Native__schema100;
        "mobile": Native__schema100;
    };
    "includeInOutput": NativeOutputInclusion;
    "backgroundColor": NativeColorValueAllowTransparent;
    "letterSpacing"?: {
        "value": Native__schema102;
        "unit": Native__schema103;
    };
};
export type NativeColorValueDisallowTransparent = string;
export type Native__schema94 = "left" | "center" | "right" | "justify";
export type Native__schema95 = {
    "height": Native__schema97;
    "verticalAlignment"?: Native__schema98;
};
export type Native__schema96 = {
    "height": Native__schema97;
    "verticalAlignment"?: Native__schema98;
};
export type Native__schema97 = number;
export type Native__schema98 = "top" | "middle" | "bottom";
export type Native__schema99 = {
    "height": Native__schema97;
    "verticalAlignment"?: Native__schema98;
};
export type Native__schema100 = {
    "top": Native__schema101;
    "right": Native__schema101;
    "bottom": Native__schema101;
    "left": Native__schema101;
};
export type Native__schema101 = number;
export type NativeSpacingValue = {
    "value": Native__schema102;
    "unit": Native__schema103;
};
export type Native__schema102 = number;
export type Native__schema103 = "px" | "em";
export type Native__schema104 = string;
export type NativeImageBlock = {
    "id": Native__schema91;
    "type": Native__schema105;
    "settings": Native__schema106;
};
export type Native__schema105 = "image";
export type Native__schema106 = {
    "src": Native__schema107;
    "link"?: Native__schema108;
    "altText": Native__schema112;
    "size": Native__schema115;
    "alignment": Native__schema119;
    "radius": Native__schema121;
    "hideElement": NativeHideElement;
    "margins": Native__schema122;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema128;
    "responsiveMobile": Native__schema129;
};
export type Native__schema107 = string;
export type Native__schema108 = {
    "type": Native__schema110;
    "href": Native__schema111;
};
export type Native__schema109 = {
    "type": Native__schema110;
    "href": Native__schema111;
};
export type Native__schema110 = "site" | "anchor" | "email" | "phone" | "file" | "sms" | "telegram" | "viber" | "other";
export type Native__schema111 = string;
export type Native__schema112 = {
    "text": Native__schema113;
    "addToTitle": Native__schema114;
};
export type Native__schema113 = string;
export type Native__schema114 = boolean;
export type Native__schema115 = {
    "desktop": Native__schema116;
    "mobile": Native__schema116;
};
export type Native__schema116 = {
    "mode": Native__schema117;
    "px": Native__schema118;
};
export type Native__schema117 = "width" | "height";
export type Native__schema118 = number;
export type Native__schema119 = {
    "desktop": Native__schema120;
    "mobile": Native__schema120;
};
export type Native__schema120 = "left" | "center" | "right";
export type Native__schema121 = {
    "desktop": NativeBorderRadius;
    "mobile": NativeBorderRadius;
};
export type Native__schema122 = {
    "desktop": Native__schema123;
    "mobile": Native__schema123;
};
export type Native__schema123 = {
    "top": Native__schema124;
    "right": Native__schema125;
    "bottom": Native__schema126;
    "left": Native__schema127;
};
export type Native__schema124 = number;
export type Native__schema125 = number;
export type Native__schema126 = number;
export type Native__schema127 = number;
export type Native__schema128 = string;
export type Native__schema129 = boolean;
export type NativeVideoBlock = {
    "id": Native__schema91;
    "type": Native__schema130;
    "settings": NativeVideoBlockSettings;
};
export type Native__schema130 = "video";
export type NativeVideoBlockSettings = {
    "videoLink": Native__schema131;
    "altText": Native__schema112;
    "customThumbnail"?: Native__schema132;
    "playButtonStyle": Native__schema134;
    "size": Native__schema115;
    "alignment": Native__schema119;
    "radius": Native__schema121;
    "hideElement": NativeHideElement;
    "paddings": Native__schema135;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema128;
    "responsiveMobile": Native__schema136;
};
export type Native__schema131 = string;
export type Native__schema132 = {
    "src": Native__schema133;
};
export type NativeVideoCustomThumbnail = {
    "src": Native__schema133;
};
export type Native__schema133 = string;
export type Native__schema134 = "NONE" | "red" | "white" | "black" | "blue" | "whiteCircle" | "blackCircle" | "greyCircle" | "blackCircleInverse";
export type Native__schema135 = {
    "desktop": Native__schema123;
    "mobile": Native__schema123;
};
export type Native__schema136 = boolean;
export type NativeTimerBlock = {
    "id": Native__schema91;
    "type": Native__schema137;
    "settings": NativeTimerBlockSettings;
};
export type Native__schema137 = "timer";
export type NativeTimerBlockSettings = {
    "altText": Native__schema112;
    "responsiveMobile": Native__schema138;
    "size": Native__schema115;
    "alignment": Native__schema119;
    "margins": Native__schema122;
    "endDate": Native__schema139;
    "timeZone": Native__schema140;
    "link": Native__schema141;
    "displayDays": Native__schema142;
    "labelsLetterCase"?: Native__schema143;
    "separator": Native__schema144;
    "labelsLanguage": Native__schema145;
    "retinaDisplaySupport": Native__schema146;
    "expirationImageSrc": Native__schema107;
    "hideElement": NativeHideElement;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema128;
    "digitsFontFamily": Native__schema147;
    "digitsFontSize": Native__schema148;
    "digitsFontColor": NativeColorValueDisallowTransparent;
    "digitsAdvancedColorSettings"?: Native__schema149;
    "labelsFontFamily": Native__schema147;
    "labelsFontSize": Native__schema148;
    "labelsFontColor": NativeColorValueDisallowTransparent;
    "labelsAdvancedColorSettings"?: Native__schema151;
    "separatorFontFamily": Native__schema147;
    "separatorFontSize": Native__schema148;
    "separatorFontColor": NativeColorValueDisallowTransparent;
    "backgroundColor": NativeColorValueAllowTransparent;
};
export type Native__schema138 = boolean;
export type Native__schema139 = string;
export type Native__schema140 = "Africa/Abidjan" | "Africa/Accra" | "Africa/Addis_Ababa" | "Africa/Algiers" | "Africa/Asmara" | "Africa/Bamako" | "Africa/Bangui" | "Africa/Banjul" | "Africa/Bissau" | "Africa/Blantyre" | "Africa/Brazzaville" | "Africa/Bujumbura" | "Africa/Cairo" | "Africa/Casablanca" | "Africa/Ceuta" | "Africa/Conakry" | "Africa/Dakar" | "Africa/Dar_es_Salaam" | "Africa/Djibouti" | "Africa/Douala" | "Africa/El_Aaiun" | "Africa/Freetown" | "Africa/Gaborone" | "Africa/Harare" | "Africa/Johannesburg" | "Africa/Juba" | "Africa/Kampala" | "Africa/Khartoum" | "Africa/Kigali" | "Africa/Kinshasa" | "Africa/Lagos" | "Africa/Libreville" | "Africa/Lome" | "Africa/Luanda" | "Africa/Lubumbashi" | "Africa/Lusaka" | "Africa/Malabo" | "Africa/Maputo" | "Africa/Maseru" | "Africa/Mbabane" | "Africa/Mogadishu" | "Africa/Monrovia" | "Africa/Nairobi" | "Africa/Ndjamena" | "Africa/Niamey" | "Africa/Nouakchott" | "Africa/Ouagadougou" | "Africa/Porto-Novo" | "Africa/Sao_Tome" | "Africa/Tripoli" | "Africa/Tunis" | "Africa/Windhoek" | "America/Adak" | "America/Anchorage" | "America/Anguilla" | "America/Antigua" | "America/Araguaina" | "America/Argentina/Buenos_Aires" | "America/Argentina/Catamarca" | "America/Argentina/Cordoba" | "America/Argentina/Jujuy" | "America/Argentina/La_Rioja" | "America/Argentina/Mendoza" | "America/Argentina/Rio_Gallegos" | "America/Argentina/Salta" | "America/Argentina/San_Juan" | "America/Argentina/San_Luis" | "America/Argentina/Tucuman" | "America/Argentina/Ushuaia" | "America/Aruba" | "America/Asuncion" | "America/Atikokan" | "America/Bahia" | "America/Bahia_Banderas" | "America/Barbados" | "America/Belem" | "America/Belize" | "America/Blanc-Sablon" | "America/Boa_Vista" | "America/Bogota" | "America/Boise" | "America/Cambridge_Bay" | "America/Campo_Grande" | "America/Cancun" | "America/Caracas" | "America/Cayenne" | "America/Cayman" | "America/Chicago" | "America/Chihuahua" | "America/Costa_Rica" | "America/Creston" | "America/Cuiaba" | "America/Curacao" | "America/Danmarkshavn" | "America/Dawson" | "America/Dawson_Creek" | "America/Denver" | "America/Detroit" | "America/Dominica" | "America/Edmonton" | "America/Eirunepe" | "America/El_Salvador" | "America/Fort_Nelson" | "America/Fortaleza" | "America/Glace_Bay" | "America/Godthab" | "America/Goose_Bay" | "America/Grand_Turk" | "America/Grenada" | "America/Guadeloupe" | "America/Guatemala" | "America/Guayaquil" | "America/Guyana" | "America/Halifax" | "America/Havana" | "America/Hermosillo" | "America/Indiana/Indianapolis" | "America/Indiana/Knox" | "America/Indiana/Marengo" | "America/Indiana/Petersburg" | "America/Indiana/Tell_City" | "America/Indiana/Vevay" | "America/Indiana/Vincennes" | "America/Indiana/Winamac" | "America/Inuvik" | "America/Iqaluit" | "America/Jamaica" | "America/Juneau" | "America/Kentucky/Louisville" | "Asia/Novokuznetsk" | "America/Kentucky/Monticello" | "America/Kralendijk" | "America/La_Paz" | "America/Lima" | "America/Los_Angeles" | "America/Lower_Princes" | "America/Maceio" | "America/Managua" | "America/Manaus" | "America/Marigot" | "America/Martinique" | "America/Matamoros" | "America/Mazatlan" | "America/Menominee" | "America/Merida" | "America/Metlakatla" | "America/Mexico_City" | "America/Miquelon" | "America/Moncton" | "America/Monterrey" | "America/Montevideo" | "America/Montserrat" | "America/Nassau" | "America/New_York" | "America/Nipigon" | "America/Nome" | "America/Noronha" | "America/North_Dakota/Beulah" | "America/North_Dakota/Center" | "America/North_Dakota/New_Salem" | "America/Ojinaga" | "America/Panama" | "America/Pangnirtung" | "America/Paramaribo" | "America/Phoenix" | "America/Port-au-Prince" | "America/Port_of_Spain" | "America/Porto_Velho" | "America/Puerto_Rico" | "America/Punta_Arenas" | "America/Rainy_River" | "America/Rankin_Inlet" | "America/Recife" | "America/Regina" | "America/Resolute" | "America/Rio_Branco" | "America/Santarem" | "America/Santiago" | "America/Santo_Domingo" | "America/Sao_Paulo" | "America/Scoresbysund" | "America/Sitka" | "America/St_Barthelemy" | "America/St_Johns" | "America/St_Kitts" | "America/St_Lucia" | "America/St_Thomas" | "America/St_Vincent" | "America/Swift_Current" | "America/Tegucigalpa" | "America/Thule" | "America/Thunder_Bay" | "America/Tijuana" | "America/Toronto" | "America/Tortola" | "America/Vancouver" | "America/Whitehorse" | "America/Winnipeg" | "America/Yakutat" | "America/Yellowknife" | "Antarctica/Casey" | "Antarctica/Davis" | "Antarctica/DumontDUrville" | "Antarctica/Macquarie" | "Antarctica/Mawson" | "Antarctica/McMurdo" | "Antarctica/Palmer" | "Antarctica/Rothera" | "Antarctica/Syowa" | "Antarctica/Troll" | "Antarctica/Vostok" | "Arctic/Longyearbyen" | "Asia/Aden" | "Asia/Almaty" | "Asia/Amman" | "Asia/Anadyr" | "Asia/Aqtau" | "Asia/Aqtobe" | "Asia/Ashgabat" | "Asia/Atyrau" | "Asia/Baghdad" | "Asia/Bahrain" | "Asia/Baku" | "Asia/Bangkok" | "Asia/Barnaul" | "Asia/Beirut" | "Asia/Bishkek" | "Asia/Brunei" | "Asia/Chita" | "Asia/Choibalsan" | "Asia/Colombo" | "Asia/Damascus" | "Asia/Dhaka" | "Asia/Dili" | "Asia/Dubai" | "Asia/Dushanbe" | "Asia/Famagusta" | "Asia/Gaza" | "Asia/Hebron" | "Asia/Ho_Chi_Minh" | "Asia/Hong_Kong" | "Asia/Hovd" | "Asia/Irkutsk" | "Asia/Jakarta" | "Asia/Jayapura" | "Asia/Jerusalem" | "Asia/Kabul" | "Asia/Kamchatka" | "Asia/Karachi" | "Asia/Kathmandu" | "Asia/Khandyga" | "Asia/Kolkata" | "Asia/Krasnoyarsk" | "Asia/Kuala_Lumpur" | "Asia/Kuching" | "Asia/Kuwait" | "Asia/Macau" | "Asia/Magadan" | "Asia/Makassar" | "Asia/Manila" | "Asia/Muscat" | "Asia/Nicosia" | "Asia/Novosibirsk" | "Asia/Omsk" | "Asia/Oral" | "Asia/Phnom_Penh" | "Asia/Pontianak" | "Asia/Pyongyang" | "Asia/Qatar" | "Asia/Qyzylorda" | "Asia/Riyadh" | "Asia/Sakhalin" | "Asia/Samarkand" | "Asia/Seoul" | "Asia/Shanghai" | "Asia/Singapore" | "Asia/Srednekolymsk" | "Asia/Taipei" | "Asia/Tashkent" | "Asia/Tbilisi" | "Asia/Tehran" | "Asia/Thimphu" | "Asia/Tokyo" | "Asia/Tomsk" | "Asia/Ulaanbaatar" | "Asia/Urumqi" | "Asia/Ust-Nera" | "Asia/Vientiane" | "Asia/Vladivostok" | "Asia/Yakutsk" | "Asia/Yangon" | "Asia/Yekaterinburg" | "Asia/Yerevan" | "Atlantic/Azores" | "Atlantic/Bermuda" | "Atlantic/Canary" | "Atlantic/Cape_Verde" | "Atlantic/Faroe" | "Atlantic/Madeira" | "Atlantic/Reykjavik" | "Atlantic/South_Georgia" | "Atlantic/St_Helena" | "Atlantic/Stanley" | "Australia/Adelaide" | "Australia/Brisbane" | "Australia/Broken_Hill" | "Australia/Currie" | "Australia/Darwin" | "Australia/Eucla" | "Australia/Hobart" | "Australia/Lindeman" | "Australia/Lord_Howe" | "Australia/Melbourne" | "Australia/Perth" | "Australia/Sydney" | "Canada/Atlantic" | "Canada/Central" | "Canada/Eastern" | "Canada/Mountain" | "Canada/Newfoundland" | "Canada/Pacific" | "Europe/Amsterdam" | "Europe/Andorra" | "Europe/Astrakhan" | "Europe/Athens" | "Europe/Belgrade" | "Europe/Berlin" | "Europe/Bratislava" | "Europe/Brussels" | "Europe/Bucharest" | "Europe/Budapest" | "Europe/Busingen" | "Europe/Chisinau" | "Europe/Copenhagen" | "Europe/Dublin" | "Europe/Gibraltar" | "Europe/Guernsey" | "Europe/Helsinki" | "Europe/Isle_of_Man" | "Europe/Istanbul" | "Europe/Jersey" | "Europe/Kaliningrad" | "Europe/Kiev" | "Europe/Kyiv" | "Europe/Kirov" | "Europe/Lisbon" | "Europe/Ljubljana" | "Europe/London" | "Europe/Luxembourg" | "Europe/Madrid" | "Europe/Malta" | "Europe/Mariehamn" | "Europe/Minsk" | "Europe/Monaco" | "Europe/Moscow" | "Europe/Oslo" | "Europe/Paris" | "Europe/Podgorica" | "Europe/Prague" | "Europe/Riga" | "Europe/Rome" | "Europe/Samara" | "Europe/San_Marino" | "Europe/Sarajevo" | "Europe/Saratov" | "Europe/Simferopol" | "Europe/Skopje" | "Europe/Sofia" | "Europe/Stockholm" | "Europe/Tallinn" | "Europe/Tirane" | "Europe/Ulyanovsk" | "Europe/Uzhgorod" | "Europe/Vaduz" | "Europe/Vatican" | "Europe/Vienna" | "Europe/Vilnius" | "Europe/Volgograd" | "Europe/Warsaw" | "Europe/Zagreb" | "Europe/Zaporozhye" | "Europe/Zaporizhia" | "Europe/Zurich" | "GMT" | "Indian/Antananarivo" | "Indian/Chagos" | "Indian/Christmas" | "Indian/Cocos" | "Indian/Comoro" | "Indian/Kerguelen" | "Indian/Mahe" | "Indian/Maldives" | "Indian/Mauritius" | "Indian/Mayotte" | "Indian/Reunion" | "Pacific/Apia" | "Pacific/Auckland" | "Pacific/Bougainville" | "Pacific/Chatham" | "Pacific/Chuuk" | "Pacific/Easter" | "Pacific/Efate" | "Pacific/Enderbury" | "Pacific/Fakaofo" | "Pacific/Fiji" | "Pacific/Funafuti" | "Pacific/Galapagos" | "Pacific/Gambier" | "Pacific/Guadalcanal" | "Pacific/Guam" | "Pacific/Honolulu" | "Pacific/Kiritimati" | "Pacific/Kosrae" | "Pacific/Kwajalein" | "Pacific/Majuro" | "Pacific/Marquesas" | "Pacific/Midway" | "Pacific/Nauru" | "Pacific/Niue" | "Pacific/Norfolk" | "Pacific/Noumea" | "Pacific/Pago_Pago" | "Pacific/Palau" | "Pacific/Pitcairn" | "Pacific/Pohnpei" | "Pacific/Port_Moresby" | "Pacific/Rarotonga" | "Pacific/Saipan" | "Pacific/Tahiti" | "Pacific/Tarawa" | "Pacific/Tongatapu" | "Pacific/Wake" | "Pacific/Wallis" | "US/Alaska" | "US/Arizona" | "US/Central" | "US/Eastern" | "US/Hawaii" | "US/Mountain" | "US/Pacific" | "UTC";
export type Native__schema141 = (Native__schema109) | (null);
export type Native__schema142 = boolean;
export type Native__schema143 = "CAPITALIZE" | "UPPER" | "LOWER";
export type Native__schema144 = string;
export type Native__schema145 = "id" | "ms" | "bs" | "bg" | "da" | "de" | "et" | "en" | "es" | "fr" | "hr" | "it" | "lv" | "lt" | "hu" | "nl" | "no" | "pl" | "pt" | "ro" | "sk" | "sl" | "sr" | "fi" | "sv" | "vi" | "tr" | "cz" | "el" | "ru" | "uk" | "he" | "ar" | "th" | "zh" | "ja" | "ko";
export type Native__schema146 = boolean;
export type Native__schema147 = "arial,'helvetica neue',helvetica,sans-serif" | "'comic sans ms','marker felt-thin',arial,sans-serif" | "'courier new',courier,'lucida sans typewriter','lucida typewriter',monospace" | "georgia,times,'times new roman',serif" | "helvetica,'helvetica neue',arial,verdana,sans-serif" | "'lucida sans unicode','lucida grande',sans-serif" | "tahoma,verdana,segoe,sans-serif" | "'times new roman',times,baskerville,georgia,serif" | "'trebuchet ms','lucida grande','lucida sans unicode','lucida sans',tahoma,sans-serif" | "verdana,geneva,sans-serif" | "arvo,courier,georgia,serif" | "lato,'helvetica neue',helvetica,arial,sans-serif" | "lora,georgia,'times new roman',serif" | "merriweather,georgia,'times new roman',serif" | "'merriweather sans','helvetica neue',helvetica,arial,sans-serif" | "'noticia text',georgia,'times new roman',serif" | "'open sans','helvetica neue',helvetica,arial,sans-serif" | "'playfair display',georgia,'times new roman',serif" | "roboto,'helvetica neue',helvetica,arial,sans-serif" | "'source sans pro','helvetica neue',helvetica,arial,sans-serif";
export type Native__schema148 = number;
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
export type Native__schema151 = {
    "days": NativeColorValueDisallowTransparent;
    "hours": NativeColorValueDisallowTransparent;
    "minutes": NativeColorValueDisallowTransparent;
    "seconds": NativeColorValueDisallowTransparent;
};
export type NativeSocialBlock = {
    "id": Native__schema91;
    "type": Native__schema152;
    "settings": Native__schema153;
};
export type Native__schema152 = "social";
export type Native__schema153 = {
    "networks": Native__schema154;
    "style": Native__schema162;
    "iconSize": Native__schema163;
    "spaceBetweenIcons": Native__schema164;
    "textCustomization": Native__schema167;
    "alignment": Native__schema168;
    "backgroundColor": NativeColorValueAllowTransparent;
    "hideElement": NativeHideElement;
    "margins": Native__schema169;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema128;
};
export type Native__schema154 = Array<Native__schema155>;
export type Native__schema155 = {
    "type": Native__schema156;
    "link"?: Native__schema157;
    "icon"?: Native__schema159;
    "title": Native__schema160;
    "alt"?: Native__schema161;
};
export type Native__schema156 = "twitter" | "xcom" | "facebook" | "youtube" | "askfm" | "behance" | "dribbble" | "flickr" | "foursquare" | "googleplus" | "instagram" | "lastfm" | "linkedin" | "myspace" | "pinterest" | "soundcloud" | "tumblr" | "vimeo" | "hangouts" | "messenger" | "skype" | "snapchat" | "telegram" | "viber" | "whatsapp" | "email" | "website" | "mapmarker" | "world" | "address" | "phone" | "share" | "rss" | "appstore" | "googleplay" | "windowsstore" | "wechat" | "weibo" | "blogger" | "medium" | "dropbox" | "googledrive" | "slack" | "github" | "pdf" | "doc" | "xls" | "ppt" | "xing" | "meetup" | "fleeped" | "tripAdvisor" | "spotify" | "tiktok" | "workplace" | "gmail" | "iTunesPodcasts" | "zoom" | "teams" | "onedrive" | "discord" | "twitch" | "line" | "patreon" | "kofi" | "yammer" | "buyMeACoffee" | "huaweiAppGallery" | "googleBusiness" | "reddit" | "strava" | "goodreads" | "custom" | "yelp" | "google" | "mastodon" | "glassdoor" | "threads" | "bluesky" | "digg" | "meet";
export type Native__schema157 = {
    "type": Native__schema110;
    "href": Native__schema158;
};
export type Native__schema158 = string;
export type Native__schema159 = string;
export type Native__schema160 = string;
export type Native__schema161 = string;
export type Native__schema162 = "custom" | "logoColored" | "logoBlack" | "logoGray" | "logoWhite" | "circleColored" | "circleColoredBordered" | "roundedColored" | "roundedColoredBordered" | "squareColored" | "squareColoredBordered" | "circleBlack" | "circleBlackBordered" | "roundedBlack" | "roundedBlackBordered" | "squareBlack" | "squareBlackBordered" | "circleGray" | "circleGrayBordered" | "roundedGray" | "roundedGrayBordered" | "squareGray" | "squareGrayBordered" | "circleWhite" | "circleWhiteBordered" | "roundedWhite" | "roundedWhiteBordered" | "squareWhite" | "squareWhiteBordered";
export type Native__schema163 = number;
export type Native__schema164 = {
    "desktop": Native__schema165;
    "mobile": Native__schema166;
};
export type Native__schema165 = number;
export type Native__schema166 = number;
export type Native__schema167 = boolean;
export type Native__schema168 = {
    "desktop": Native__schema120;
    "mobile": Native__schema120;
};
export type Native__schema169 = {
    "desktop": Native__schema170;
    "mobile": Native__schema170;
};
export type Native__schema170 = {
    "top": Native__schema171;
    "right": Native__schema172;
    "bottom": Native__schema173;
    "left": Native__schema174;
};
export type Native__schema171 = number;
export type Native__schema172 = number;
export type Native__schema173 = number;
export type Native__schema174 = number;
export type NativeHtmlBlock = {
    "id": Native__schema91;
    "type": Native__schema175;
    "settings": Native__schema176;
    "content"?: Native__schema177;
};
export type Native__schema175 = "html";
export type Native__schema176 = {
    "margins": Native__schema122;
    "includeInOutput": NativeOutputInclusion;
    "hideElement": NativeHideElement;
    "anchorLinkName": Native__schema128;
};
export type Native__schema177 = string;
export type NativeButtonBlock = {
    "id": Native__schema91;
    "type": Native__schema178;
    "settings": NativeButtonBlockSettings;
};
export type Native__schema178 = "button";
export type NativeButtonBlockSettings = {
    "link"?: Native__schema179;
    "text": Native__schema191;
    "alignment": Native__schema192;
    "fixedHeight"?: Native__schema193;
    "icon"?: Native__schema196;
    "hideElement": NativeHideElement;
    "padding": Native__schema201;
    "margins": Native__schema201;
    "includeInOutput": NativeOutputInclusion;
    "anchorLink": Native__schema204;
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
export type Native__schema179 = (Native__schema181) | (Native__schema184);
export type Native__schema180 = (Native__schema181) | (Native__schema184);
export type Native__schema181 = {
    "type": Native__schema182;
    "value": Native__schema183;
};
export type Native__schema182 = "site" | "anchor" | "email" | "phone" | "sms" | "telegram" | "viber" | "file" | "other";
export type Native__schema183 = string;
export type Native__schema184 = {
    "type": Native__schema185;
    "value": Native__schema186;
    "salesforce": Native__schema187;
};
export type Native__schema185 = "salesforce_mc";
export type Native__schema186 = string;
export type Native__schema187 = {
    "trackingAlias": Native__schema188;
    "linkTo": Native__schema189;
    "conversion": Native__schema190;
};
export type Native__schema188 = string;
export type Native__schema189 = string;
export type Native__schema190 = boolean;
export type Native__schema191 = string;
export type Native__schema192 = {
    "desktop": Native__schema120;
    "mobile": Native__schema120;
};
export type Native__schema193 = {
    "height": Native__schema194;
    "alignment"?: Native__schema195;
};
export type Native__schema194 = number;
export type Native__schema195 = "top" | "middle" | "bottom";
export type Native__schema196 = {
    "src": Native__schema197;
    "width": Native__schema198;
    "align": Native__schema199;
    "indent": Native__schema200;
};
export type Native__schema197 = string;
export type Native__schema198 = number;
export type Native__schema199 = "left" | "right";
export type Native__schema200 = number;
export type Native__schema201 = {
    "desktop": Native__schema202;
    "mobile": Native__schema202;
};
export type Native__schema202 = {
    "top": Native__schema203;
    "right": Native__schema203;
    "bottom": Native__schema203;
    "left": Native__schema203;
};
export type Native__schema203 = number;
export type Native__schema204 = string;
export type NativeFontSize = {
    "desktop": Native__schema205;
    "mobile": Native__schema206;
};
export type Native__schema205 = number;
export type Native__schema206 = number;
export type NativeButtonsTextStyle = {
    "bold": Native__schema207;
    "italic": Native__schema208;
};
export type Native__schema207 = boolean;
export type Native__schema208 = boolean;
export type NativeResponsiveBoolean = {
    "desktop": Native__schema209;
    "mobile": Native__schema210;
};
export type Native__schema209 = boolean;
export type Native__schema210 = boolean;
export type NativeSpacerBlock = {
    "id": Native__schema91;
    "type": Native__schema211;
    "settings": Native__schema212;
};
export type Native__schema211 = "spacer";
export type Native__schema212 = {
    "mode": Native__schema213;
    "width"?: Native__schema214;
    "height"?: Native__schema220;
    "border"?: Native__schema223;
    "mobileBorder"?: Native__schema226;
    "alignment"?: Native__schema228;
    "backgroundColor": NativeColorValueAllowTransparent;
    "margins": Native__schema229;
    "anchorLinkName": Native__schema128;
    "includeInOutput": NativeOutputInclusion;
    "hideElement": NativeHideElement;
};
export type Native__schema213 = "line" | "space";
export type Native__schema214 = {
    "desktop": Native__schema215;
    "mobile": Native__schema219;
};
export type Native__schema215 = {
    "value": Native__schema216;
    "unit": Native__schema217;
};
export type Native__schema216 = number;
export type Native__schema217 = "percent" | "px";
export type Native__schema218 = {
    "value": Native__schema216;
    "unit": Native__schema217;
};
export type Native__schema219 = {
    "value": Native__schema216;
    "unit": Native__schema217;
};
export type Native__schema220 = {
    "desktop": Native__schema221;
    "mobile": Native__schema222;
};
export type Native__schema221 = number;
export type Native__schema222 = number;
export type Native__schema223 = {
    "size": Native__schema225;
    "style": Native__schema61;
    "color": NativeColorValueDisallowTransparent;
};
export type Native__schema224 = {
    "size": Native__schema225;
    "style": Native__schema61;
    "color": NativeColorValueDisallowTransparent;
};
export type Native__schema225 = number;
export type Native__schema226 = (Native__schema224) | (null);
export type Native__schema227 = (Native__schema224) | (null);
export type Native__schema228 = {
    "desktop": Native__schema120;
    "mobile": Native__schema120;
};
export type Native__schema229 = {
    "desktop": Native__schema230;
    "mobile": Native__schema230;
};
export type Native__schema230 = {
    "top": Native__schema231;
    "right": Native__schema232;
    "bottom": Native__schema233;
    "left": Native__schema234;
};
export type Native__schema231 = number;
export type Native__schema232 = number;
export type Native__schema233 = number;
export type Native__schema234 = number;
export type NativeMenuBlock = {
    "id": Native__schema91;
    "type": Native__schema235;
    "settings": NativeMenuBlockSettings;
};
export type Native__schema235 = "menu";
export type NativeMenuBlockSettings = {
    "responsiveMenu": Native__schema236;
    "itemType": Native__schema237;
    "fitToContainer": Native__schema240;
    "itemPadding": Native__schema241;
    "margins": Native__schema241;
    "anchorLinkName": Native__schema128;
    "includeInOutput": NativeOutputInclusion;
    "separator": NativeMenuSeparator;
    "fontFamily": Native__schema8;
    "fontSize": NativeFontSize;
    "hideElement": NativeHideElement;
    "textStyle": NativeButtonsTextStyle;
    "colors": Native__schema246;
    "items": Native__schema249;
};
export type Native__schema236 = boolean;
export type Native__schema237 = (Native__schema238) | (Native__schema239);
export type Native__schema238 = {
    "mode": "shared";
    "type": NativeMenuItemType;
};
export type NativeMenuItemType = "links" | "icons" | "linksWithIcons";
export type Native__schema239 = {
    "mode": "perItem";
};
export type Native__schema240 = boolean;
export type Native__schema241 = {
    "desktop": Native__schema242;
    "mobile": Native__schema242;
};
export type Native__schema242 = {
    "top": Native__schema243;
    "right": Native__schema243;
    "bottom": Native__schema243;
    "left": Native__schema243;
};
export type Native__schema243 = number;
export type NativeMenuSeparator = {
    "width": Native__schema244;
    "style": Native__schema245;
    "color": NativeColorValueDisallowTransparent;
};
export type Native__schema244 = number;
export type Native__schema245 = "none" | "line" | "dashed" | "dotted";
export type Native__schema246 = (Native__schema247) | (Native__schema248);
export type Native__schema247 = {
    "mode": "shared";
    "link": NativeColorValueDisallowTransparent;
};
export type Native__schema248 = {
    "mode": "perItem";
};
export type Native__schema249 = Array<NativeMenuItem>;
export type NativeMenuItem = {
    "type"?: Native__schema250;
    "name": Native__schema251;
    "link": NativeMenuLink;
    "image"?: Native__schema254;
    "hideElement": NativeHideElement;
    "colors"?: Native__schema261;
};
export type Native__schema250 = "links" | "icons" | "linksWithIcons";
export type Native__schema251 = string;
export type NativeMenuLink = {
    "type": Native__schema252;
    "value": Native__schema253;
};
export type Native__schema252 = "site" | "email" | "phone" | "anchor";
export type Native__schema253 = string;
export type Native__schema254 = {
    "src": Native__schema255;
    "size": NativeMenuImageSize;
    "alignment": Native__schema258;
    "indent": Native__schema259;
    "altText": Native__schema260;
};
export type NativeMenuItemImage = {
    "src": Native__schema255;
    "size": NativeMenuImageSize;
    "alignment": Native__schema258;
    "indent": Native__schema259;
    "altText": Native__schema260;
};
export type Native__schema255 = string;
export type NativeMenuImageSize = {
    "mode": Native__schema256;
    "px": Native__schema257;
};
export type Native__schema256 = "width" | "height";
export type Native__schema257 = number;
export type Native__schema258 = "left" | "center" | "right";
export type Native__schema259 = number;
export type Native__schema260 = string;
export type Native__schema261 = {
    "link": NativeColorValueDisallowTransparent;
    "background": NativeColorValueAllowTransparent;
};
export type NativeUnknownBlock = {
    "id": Native__schema91;
    "type": Native__schema262;
    "settings"?: Native__schema263;
    "content": Native__schema266;
    "extension": Native__schema267;
};
export type Native__schema262 = "unknown";
export type Native__schema263 = {
    [key: string]: Native__schema265;
};
export type Native__schema264 = string;
export type Native__schema265 = unknown;
export type Native__schema266 = string;
export type Native__schema267 = boolean;
export type DocumentState = {
    "metadata"?: Native__schema0;
    "resources"?: Native__schema5;
    "settings": Native__schema11;
    "stripes"?: Native__schema36;
};
export type DocumentBlock = NativeBlock;
export type BlockKind = DocumentBlock['type'];
export type BlockOf<K extends BlockKind> = Extract<DocumentBlock, {
    type: K;
}>;
export type BlockSettings<K extends BlockKind> = BlockOf<K>['settings'];

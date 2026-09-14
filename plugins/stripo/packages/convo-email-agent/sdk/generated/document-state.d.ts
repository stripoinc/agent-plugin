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
export type NativeEmailTemplateSettings = {
    "general": Native__schema11;
    "stripes": Native__schema18;
    "headings": Native__schema27;
    "buttons": Native__schema29;
};
export type Native__schema11 = {
    "defaultStyles": boolean;
    "hideImageDownloadIcons": boolean;
    "underlineLinks": boolean;
    "responsiveDesign": boolean;
    "messageAlignment": "left" | "center" | "right";
    "messageContentWidth": number;
    "backgroundImage": (Native__schema12) | (null);
    "rightToLeftTextDirection": boolean;
    "marginsAroundMessage": Native__schema14;
    "defaultStructurePadding": Native__schema14;
    "customListStyles": ({
        "leftIndent": number;
        "listItemsBottomSpace": number;
        "listTopBottomMargin": number;
    }) | (null);
    "lightTheme": {
        "backgroundColor": Native__schema16;
        "customListStyles": {
            "listMarkerColor": Native__schema17;
            "listNumberMarkerColor": Native__schema17;
        };
    };
    "darkTheme": {
        "backgroundColor": (Native__schema16) | (null);
        "customListStyles": {
            "listMarkerColor": (Native__schema17) | (null);
            "listNumberMarkerColor": (Native__schema17) | (null);
        };
    };
};
export type Native__schema12 = {
    "path": string;
    "repeat": boolean;
    "x": string;
    "y": string;
    "sizeX": Native__schema13;
    "sizeY": Native__schema13;
};
export type Native__schema13 = string;
export type Native__schema14 = {
    "desktop": Native__schema15;
    "mobile": Native__schema15;
};
export type Native__schema15 = {
    "top": number;
    "right": number;
    "bottom": number;
    "left": number;
};
export type Native__schema16 = string;
export type Native__schema17 = string;
export type Native__schema18 = {
    "letterSpacing": Native__schema19;
    "lineHeight": Native__schema20;
    "fontFamily": Native__schema21;
    "fontWeight": Native__schema22;
    "header": {
        "fontSize": Native__schema23;
        "paragraphBottomSpace": Native__schema24;
        "backgroundImage": (Native__schema12) | (null);
    };
    "content": {
        "fontSize": Native__schema23;
        "paragraphBottomSpace": Native__schema24;
    };
    "footer": {
        "fontSize": Native__schema23;
        "paragraphBottomSpace": Native__schema24;
        "backgroundImage": (Native__schema12) | (null);
    };
    "infoArea": {
        "fontSize": Native__schema23;
        "paragraphBottomSpace": Native__schema24;
    };
    "lightTheme": {
        "header": {
            "stripeBackgroundColor": Native__schema16;
            "contentBackgroundColor": Native__schema16;
            "fontColor": Native__schema26;
            "linkColor": Native__schema26;
            "linkColorHover": Native__schema26;
        };
        "content": {
            "contentBackgroundColor": Native__schema16;
            "fontColor": Native__schema26;
            "linkColor": Native__schema26;
            "linkColorHover": Native__schema26;
        };
        "footer": {
            "stripeBackgroundColor": Native__schema16;
            "contentBackgroundColor": Native__schema16;
            "fontColor": Native__schema26;
            "linkColor": Native__schema26;
            "linkColorHover": Native__schema26;
        };
        "infoArea": {
            "fontColor": Native__schema26;
            "linkColor": Native__schema26;
            "linkColorHover": Native__schema26;
        };
    };
    "darkTheme": {
        "header": {
            "stripeBackgroundColor": (Native__schema16) | (null);
            "contentBackgroundColor": (Native__schema16) | (null);
            "fontColor": (Native__schema26) | (null);
            "linkColor": (Native__schema26) | (null);
            "linkColorHover": (Native__schema26) | (null);
        };
        "content": {
            "contentBackgroundColor": (Native__schema16) | (null);
            "fontColor": (Native__schema26) | (null);
            "linkColor": (Native__schema26) | (null);
            "linkColorHover": (Native__schema26) | (null);
        };
        "footer": {
            "stripeBackgroundColor": (Native__schema16) | (null);
            "contentBackgroundColor": (Native__schema16) | (null);
            "fontColor": (Native__schema26) | (null);
            "linkColor": (Native__schema26) | (null);
            "linkColorHover": (Native__schema26) | (null);
        };
        "infoArea": {
            "fontColor": (Native__schema26) | (null);
            "linkColor": (Native__schema26) | (null);
            "linkColorHover": (Native__schema26) | (null);
        };
    };
};
export type Native__schema19 = {
    "value": number;
    "unit": "px" | "em";
};
export type Native__schema20 = {
    "desktop": number;
    "mobile": number;
};
export type Native__schema21 = string;
export type Native__schema22 = number;
export type Native__schema23 = {
    "desktop": number;
    "mobile": number;
};
export type Native__schema24 = (Native__schema25) | (null);
export type Native__schema25 = {
    "desktop": number;
    "mobile": number;
};
export type Native__schema26 = string;
export type Native__schema27 = {
    "letterSpacing": Native__schema19;
    "fontFamily": Native__schema21;
    "h1": Native__schema28;
    "h2": Native__schema28;
    "h3": Native__schema28;
    "h4": Native__schema28;
    "h5": Native__schema28;
    "h6": Native__schema28;
    "lightTheme": {
        "h1": {
            "fontColor": Native__schema26;
        };
        "h2": {
            "fontColor": Native__schema26;
        };
        "h3": {
            "fontColor": Native__schema26;
        };
        "h4": {
            "fontColor": Native__schema26;
        };
        "h5": {
            "fontColor": Native__schema26;
        };
        "h6": {
            "fontColor": Native__schema26;
        };
    };
    "darkTheme": {
        "h1": {
            "fontColor": (Native__schema26) | (null);
        };
        "h2": {
            "fontColor": (Native__schema26) | (null);
        };
        "h3": {
            "fontColor": (Native__schema26) | (null);
        };
        "h4": {
            "fontColor": (Native__schema26) | (null);
        };
        "h5": {
            "fontColor": (Native__schema26) | (null);
        };
        "h6": {
            "fontColor": (Native__schema26) | (null);
        };
    };
};
export type Native__schema28 = {
    "textAlign": {
        "mobile": "left" | "center" | "right";
    };
    "textStyle": {
        "italic": boolean;
    };
    "fontWeight": (Native__schema22) | (null);
    "fontSize": Native__schema23;
    "lineHeight": Native__schema20;
    "paragraphBottomSpace": (Native__schema25) | (null);
};
export type Native__schema29 = {
    "outlookSupport": boolean;
    "textStyle": {
        "bold": boolean;
        "italic": boolean;
    };
    "textTransform": "none" | "uppercase" | "capitalize" | "lowercase";
    "fontFamily": Native__schema21;
    "letterSpacing": Native__schema19;
    "fontSize": Native__schema23;
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
        "top": Native__schema30;
        "right": Native__schema30;
        "bottom": Native__schema30;
        "left": Native__schema30;
        "style": "solid" | "dashed" | "dotted";
    };
    "hoverButtonStyles": boolean;
    "padding": Native__schema14;
    "lightTheme": {
        "buttonColor": Native__schema16;
        "fontColor": Native__schema26;
        "hoverButtonStyles": {
            "backgroundColor": Native__schema16;
            "fontColor": Native__schema26;
            "borderColor": {
                "top": Native__schema17;
                "right": Native__schema17;
                "bottom": Native__schema17;
                "left": Native__schema17;
            };
        };
        "borderColor": {
            "top": Native__schema17;
            "right": Native__schema17;
            "bottom": Native__schema17;
            "left": Native__schema17;
        };
    };
    "darkTheme": {
        "buttonColor": (Native__schema16) | (null);
        "fontColor": (Native__schema26) | (null);
        "hoverButtonStyles": {
            "backgroundColor": (Native__schema16) | (null);
            "fontColor": (Native__schema26) | (null);
            "borderColor": {
                "top": (Native__schema17) | (null);
                "right": (Native__schema17) | (null);
                "bottom": (Native__schema17) | (null);
                "left": (Native__schema17) | (null);
            };
        };
        "borderColor": {
            "top": (Native__schema17) | (null);
            "right": (Native__schema17) | (null);
            "bottom": (Native__schema17) | (null);
            "left": (Native__schema17) | (null);
        };
    };
};
export type Native__schema30 = {
    "width": number;
};
export type Native__schema31 = Array<NativeStripe>;
export type Native__schema32 = Array<NativeStripe>;
export type NativeStripe = {
    "id": Native__schema33;
    "settings"?: Native__schema34;
    "moduleId"?: Native__schema57;
    "structures"?: Native__schema58;
};
export type Native__schema33 = string;
export type Native__schema34 = {
    "messageArea"?: Native__schema35;
    "includeInOutput"?: Native__schema36;
    "hideElement": NativeHideElement;
    "padding"?: Native__schema37;
    "stripeBackgroundColor"?: Native__schema42;
    "contentBackgroundColor"?: Native__schema43;
    "backgroundImage"?: Native__schema44;
    "contentBorder"?: Native__schema54;
};
export type NativeStripeSettings = {
    "messageArea"?: Native__schema35;
    "includeInOutput"?: Native__schema36;
    "hideElement": NativeHideElement;
    "padding"?: Native__schema37;
    "stripeBackgroundColor"?: Native__schema42;
    "contentBackgroundColor"?: Native__schema43;
    "backgroundImage"?: Native__schema44;
    "contentBorder"?: Native__schema54;
};
export type Native__schema35 = "header" | "content" | "footer" | "infoArea";
export type Native__schema36 = "both" | "html" | "ampHtml";
export type NativeOutputInclusion = "both" | "html" | "ampHtml";
export type NativeHideElement = "no" | "desktop" | "mobile";
export type Native__schema37 = {
    "mobile": NativeFullSideValues;
};
export type NativeMobilePadding = {
    "mobile": NativeFullSideValues;
};
export type NativeFullSideValues = {
    "top": Native__schema38;
    "right": Native__schema39;
    "bottom": Native__schema40;
    "left": Native__schema41;
};
export type Native__schema38 = number;
export type Native__schema39 = number;
export type Native__schema40 = number;
export type Native__schema41 = number;
export type Native__schema42 = string;
export type NativeColorValueAllowTransparent = string;
export type Native__schema43 = string;
export type Native__schema44 = {
    "path": Native__schema45;
    "repeat": boolean;
    "x": Native__schema48;
    "y": Native__schema49;
    "sizeX": string;
    "sizeY": string;
};
export type NativeBackgroundImage = {
    "path": Native__schema45;
    "repeat": boolean;
    "x": Native__schema48;
    "y": Native__schema49;
    "sizeX": string;
    "sizeY": string;
};
export type Native__schema45 = string;
export type Native__schema46 = boolean | string;
export type Native__schema47 = boolean | string;
export type Native__schema48 = string;
export type Native__schema49 = string;
export type Native__schema50 = string;
export type Native__schema51 = string;
export type Native__schema52 = string;
export type Native__schema53 = string;
export type Native__schema54 = {
    "top": NativeBorderSide;
    "right": NativeBorderSide;
    "bottom": NativeBorderSide;
    "left": NativeBorderSide;
    "style": Native__schema56;
};
export type NativeBorder = {
    "top": NativeBorderSide;
    "right": NativeBorderSide;
    "bottom": NativeBorderSide;
    "left": NativeBorderSide;
    "style": Native__schema56;
};
export type NativeBorderSide = {
    "width": Native__schema55;
    "color": NativeColorValueAllowTransparent;
};
export type Native__schema55 = number;
export type Native__schema56 = "solid" | "dashed" | "dotted";
export type Native__schema57 = number;
export type Native__schema58 = Array<NativeStructure>;
export type NativeStructure = {
    "id": Native__schema59;
    "settings"?: Native__schema60;
    "moduleId"?: Native__schema75;
    "columns"?: Native__schema76;
};
export type Native__schema59 = string;
export type Native__schema60 = {
    "backgroundColor": NativeColorValueAllowTransparent;
    "backgroundImage"?: Native__schema61;
    "border": NativeBorder;
    "borderRadius": NativeBorderRadius;
    "columnsGap"?: Native__schema66;
    "responsiveMobile"?: Native__schema69;
    "responsiveMobileContainersInversion"?: Native__schema70;
    "padding"?: Native__schema71;
    "margins"?: Native__schema72;
    "includeInOutput"?: Native__schema73;
    "hideElement"?: Native__schema74;
};
export type Native__schema61 = {
    "path": Native__schema45;
    "repeat": boolean;
    "x": Native__schema48;
    "y": Native__schema49;
    "sizeX": string;
    "sizeY": string;
};
export type NativeBorderRadius = {
    "topLeft": Native__schema62;
    "topRight": Native__schema63;
    "bottomRight": Native__schema64;
    "bottomLeft": Native__schema65;
};
export type Native__schema62 = number;
export type Native__schema63 = number;
export type Native__schema64 = number;
export type Native__schema65 = number;
export type Native__schema66 = {
    "desktop": Native__schema67;
    "mobile": Native__schema68;
};
export type NativeResponsiveNumber = {
    "desktop": Native__schema67;
    "mobile": Native__schema68;
};
export type Native__schema67 = number;
export type Native__schema68 = number;
export type Native__schema69 = boolean;
export type Native__schema70 = boolean;
export type Native__schema71 = {
    "desktop": NativeFullSideValues;
    "mobile": NativeFullSideValues;
};
export type NativeResponsivePadding = {
    "desktop": NativeFullSideValues;
    "mobile": NativeFullSideValues;
};
export type Native__schema72 = {
    "desktop": NativeFullSideValues;
    "mobile": NativeFullSideValues;
};
export type Native__schema73 = "both" | "html" | "ampHtml";
export type Native__schema74 = "no" | "desktop" | "mobile";
export type Native__schema75 = number;
export type Native__schema76 = Array<NativeColumn>;
export type NativeColumn = {
    "id": Native__schema77;
    "settings"?: Native__schema78;
    "containers": Native__schema80;
};
export type Native__schema77 = string;
export type Native__schema78 = {
    "width": Native__schema79;
};
export type Native__schema79 = number;
export type Native__schema80 = Array<NativeContainer>;
export type NativeContainer = {
    "id": Native__schema81;
    "settings": Native__schema82;
    "moduleId"?: Native__schema84;
    "blocks"?: Native__schema85;
};
export type Native__schema81 = string;
export type Native__schema82 = {
    "padding": NativeResponsivePadding;
    "includeInOutput": NativeOutputInclusion;
    "hideElement": NativeHideElement;
    "backgroundColor": NativeColorValueAllowTransparent;
    "backgroundImage"?: Native__schema83;
    "border": NativeBorder;
    "radius": NativeBorderRadius;
};
export type Native__schema83 = {
    "path": Native__schema45;
    "repeat": boolean;
    "x": Native__schema48;
    "y": Native__schema49;
    "sizeX": string;
    "sizeY": string;
};
export type Native__schema84 = number;
export type Native__schema85 = Array<NativeBlock>;
export type NativeBlock = (NativeTextBlock) | (NativeImageBlock) | (NativeVideoBlock) | (NativeTimerBlock) | (NativeSocialBlock) | (NativeHtmlBlock) | (NativeButtonBlock) | (NativeSpacerBlock) | (NativeMenuBlock) | (NativeUnknownBlock);
export type NativeTextBlock = {
    "id": Native__schema86;
    "type": Native__schema87;
    "settings"?: Native__schema88;
    "content"?: Native__schema99;
};
export type Native__schema86 = string;
export type Native__schema87 = "text";
export type Native__schema88 = {
    "fontColor"?: string;
    "hideElement": NativeHideElement;
    "rightToLeftTextDirection": boolean;
    "alignment"?: {
        "desktop": Native__schema89;
        "mobile": Native__schema89;
    };
    "fixedHeight"?: {
        "desktop"?: Native__schema90;
        "mobile"?: Native__schema94;
    };
    "padding": {
        "desktop": Native__schema95;
        "mobile": Native__schema95;
    };
    "includeInOutput": NativeOutputInclusion;
    "backgroundColor": NativeColorValueAllowTransparent;
    "letterSpacing"?: {
        "value": Native__schema97;
        "unit": Native__schema98;
    };
};
export type NativeColorValueDisallowTransparent = string;
export type Native__schema89 = "left" | "center" | "right" | "justify";
export type Native__schema90 = {
    "height": Native__schema92;
    "verticalAlignment"?: Native__schema93;
};
export type Native__schema91 = {
    "height": Native__schema92;
    "verticalAlignment"?: Native__schema93;
};
export type Native__schema92 = number;
export type Native__schema93 = "top" | "middle" | "bottom";
export type Native__schema94 = {
    "height": Native__schema92;
    "verticalAlignment"?: Native__schema93;
};
export type Native__schema95 = {
    "top": Native__schema96;
    "right": Native__schema96;
    "bottom": Native__schema96;
    "left": Native__schema96;
};
export type Native__schema96 = number;
export type NativeSpacingValue = {
    "value": Native__schema97;
    "unit": Native__schema98;
};
export type Native__schema97 = number;
export type Native__schema98 = "px" | "em";
export type Native__schema99 = string;
export type NativeImageBlock = {
    "id": Native__schema86;
    "type": Native__schema100;
    "settings": Native__schema101;
};
export type Native__schema100 = "image";
export type Native__schema101 = {
    "src": Native__schema102;
    "link"?: Native__schema103;
    "altText": Native__schema107;
    "size": Native__schema110;
    "alignment": Native__schema114;
    "radius": Native__schema116;
    "hideElement": NativeHideElement;
    "margins": Native__schema117;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema123;
    "responsiveMobile": Native__schema124;
};
export type Native__schema102 = string;
export type Native__schema103 = {
    "type": Native__schema105;
    "href": Native__schema106;
};
export type Native__schema104 = {
    "type": Native__schema105;
    "href": Native__schema106;
};
export type Native__schema105 = "site" | "anchor" | "email" | "phone" | "file" | "sms" | "telegram" | "viber" | "other";
export type Native__schema106 = string;
export type Native__schema107 = {
    "text": Native__schema108;
    "addToTitle": Native__schema109;
};
export type Native__schema108 = string;
export type Native__schema109 = boolean;
export type Native__schema110 = {
    "desktop": Native__schema111;
    "mobile": Native__schema111;
};
export type Native__schema111 = {
    "mode": Native__schema112;
    "px": Native__schema113;
};
export type Native__schema112 = "width" | "height";
export type Native__schema113 = number;
export type Native__schema114 = {
    "desktop": Native__schema115;
    "mobile": Native__schema115;
};
export type Native__schema115 = "left" | "center" | "right";
export type Native__schema116 = {
    "desktop": NativeBorderRadius;
    "mobile": NativeBorderRadius;
};
export type Native__schema117 = {
    "desktop": Native__schema118;
    "mobile": Native__schema118;
};
export type Native__schema118 = {
    "top": Native__schema119;
    "right": Native__schema120;
    "bottom": Native__schema121;
    "left": Native__schema122;
};
export type Native__schema119 = number;
export type Native__schema120 = number;
export type Native__schema121 = number;
export type Native__schema122 = number;
export type Native__schema123 = string;
export type Native__schema124 = boolean;
export type NativeVideoBlock = {
    "id": Native__schema86;
    "type": Native__schema125;
    "settings": NativeVideoBlockSettings;
};
export type Native__schema125 = "video";
export type NativeVideoBlockSettings = {
    "videoLink": Native__schema126;
    "altText": Native__schema107;
    "customThumbnail"?: Native__schema127;
    "playButtonStyle": Native__schema129;
    "size": Native__schema110;
    "alignment": Native__schema114;
    "radius": Native__schema116;
    "hideElement": NativeHideElement;
    "paddings": Native__schema130;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema123;
    "responsiveMobile": Native__schema131;
};
export type Native__schema126 = string;
export type Native__schema127 = {
    "src": Native__schema128;
};
export type NativeVideoCustomThumbnail = {
    "src": Native__schema128;
};
export type Native__schema128 = string;
export type Native__schema129 = "NONE" | "red" | "white" | "black" | "blue" | "whiteCircle" | "blackCircle" | "greyCircle" | "blackCircleInverse";
export type Native__schema130 = {
    "desktop": Native__schema118;
    "mobile": Native__schema118;
};
export type Native__schema131 = boolean;
export type NativeTimerBlock = {
    "id": Native__schema86;
    "type": Native__schema132;
    "settings": NativeTimerBlockSettings;
};
export type Native__schema132 = "timer";
export type NativeTimerBlockSettings = {
    "altText": Native__schema107;
    "responsiveMobile": Native__schema133;
    "size": Native__schema110;
    "alignment": Native__schema114;
    "margins": Native__schema117;
    "endDate": Native__schema134;
    "timeZone": Native__schema135;
    "link": Native__schema136;
    "displayDays": Native__schema137;
    "labelsLetterCase"?: Native__schema138;
    "separator": Native__schema139;
    "labelsLanguage": Native__schema140;
    "retinaDisplaySupport": Native__schema141;
    "expirationImageSrc": Native__schema102;
    "hideElement": NativeHideElement;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema123;
    "digitsFontFamily": Native__schema142;
    "digitsFontSize": Native__schema143;
    "digitsFontColor": NativeColorValueDisallowTransparent;
    "digitsAdvancedColorSettings"?: Native__schema144;
    "labelsFontFamily": Native__schema142;
    "labelsFontSize": Native__schema143;
    "labelsFontColor": NativeColorValueDisallowTransparent;
    "labelsAdvancedColorSettings"?: Native__schema146;
    "separatorFontFamily": Native__schema142;
    "separatorFontSize": Native__schema143;
    "separatorFontColor": NativeColorValueDisallowTransparent;
    "backgroundColor": NativeColorValueAllowTransparent;
};
export type Native__schema133 = boolean;
export type Native__schema134 = string;
export type Native__schema135 = "Africa/Abidjan" | "Africa/Accra" | "Africa/Addis_Ababa" | "Africa/Algiers" | "Africa/Asmara" | "Africa/Bamako" | "Africa/Bangui" | "Africa/Banjul" | "Africa/Bissau" | "Africa/Blantyre" | "Africa/Brazzaville" | "Africa/Bujumbura" | "Africa/Cairo" | "Africa/Casablanca" | "Africa/Ceuta" | "Africa/Conakry" | "Africa/Dakar" | "Africa/Dar_es_Salaam" | "Africa/Djibouti" | "Africa/Douala" | "Africa/El_Aaiun" | "Africa/Freetown" | "Africa/Gaborone" | "Africa/Harare" | "Africa/Johannesburg" | "Africa/Juba" | "Africa/Kampala" | "Africa/Khartoum" | "Africa/Kigali" | "Africa/Kinshasa" | "Africa/Lagos" | "Africa/Libreville" | "Africa/Lome" | "Africa/Luanda" | "Africa/Lubumbashi" | "Africa/Lusaka" | "Africa/Malabo" | "Africa/Maputo" | "Africa/Maseru" | "Africa/Mbabane" | "Africa/Mogadishu" | "Africa/Monrovia" | "Africa/Nairobi" | "Africa/Ndjamena" | "Africa/Niamey" | "Africa/Nouakchott" | "Africa/Ouagadougou" | "Africa/Porto-Novo" | "Africa/Sao_Tome" | "Africa/Tripoli" | "Africa/Tunis" | "Africa/Windhoek" | "America/Adak" | "America/Anchorage" | "America/Anguilla" | "America/Antigua" | "America/Araguaina" | "America/Argentina/Buenos_Aires" | "America/Argentina/Catamarca" | "America/Argentina/Cordoba" | "America/Argentina/Jujuy" | "America/Argentina/La_Rioja" | "America/Argentina/Mendoza" | "America/Argentina/Rio_Gallegos" | "America/Argentina/Salta" | "America/Argentina/San_Juan" | "America/Argentina/San_Luis" | "America/Argentina/Tucuman" | "America/Argentina/Ushuaia" | "America/Aruba" | "America/Asuncion" | "America/Atikokan" | "America/Bahia" | "America/Bahia_Banderas" | "America/Barbados" | "America/Belem" | "America/Belize" | "America/Blanc-Sablon" | "America/Boa_Vista" | "America/Bogota" | "America/Boise" | "America/Cambridge_Bay" | "America/Campo_Grande" | "America/Cancun" | "America/Caracas" | "America/Cayenne" | "America/Cayman" | "America/Chicago" | "America/Chihuahua" | "America/Costa_Rica" | "America/Creston" | "America/Cuiaba" | "America/Curacao" | "America/Danmarkshavn" | "America/Dawson" | "America/Dawson_Creek" | "America/Denver" | "America/Detroit" | "America/Dominica" | "America/Edmonton" | "America/Eirunepe" | "America/El_Salvador" | "America/Fort_Nelson" | "America/Fortaleza" | "America/Glace_Bay" | "America/Godthab" | "America/Goose_Bay" | "America/Grand_Turk" | "America/Grenada" | "America/Guadeloupe" | "America/Guatemala" | "America/Guayaquil" | "America/Guyana" | "America/Halifax" | "America/Havana" | "America/Hermosillo" | "America/Indiana/Indianapolis" | "America/Indiana/Knox" | "America/Indiana/Marengo" | "America/Indiana/Petersburg" | "America/Indiana/Tell_City" | "America/Indiana/Vevay" | "America/Indiana/Vincennes" | "America/Indiana/Winamac" | "America/Inuvik" | "America/Iqaluit" | "America/Jamaica" | "America/Juneau" | "America/Kentucky/Louisville" | "Asia/Novokuznetsk" | "America/Kentucky/Monticello" | "America/Kralendijk" | "America/La_Paz" | "America/Lima" | "America/Los_Angeles" | "America/Lower_Princes" | "America/Maceio" | "America/Managua" | "America/Manaus" | "America/Marigot" | "America/Martinique" | "America/Matamoros" | "America/Mazatlan" | "America/Menominee" | "America/Merida" | "America/Metlakatla" | "America/Mexico_City" | "America/Miquelon" | "America/Moncton" | "America/Monterrey" | "America/Montevideo" | "America/Montserrat" | "America/Nassau" | "America/New_York" | "America/Nipigon" | "America/Nome" | "America/Noronha" | "America/North_Dakota/Beulah" | "America/North_Dakota/Center" | "America/North_Dakota/New_Salem" | "America/Ojinaga" | "America/Panama" | "America/Pangnirtung" | "America/Paramaribo" | "America/Phoenix" | "America/Port-au-Prince" | "America/Port_of_Spain" | "America/Porto_Velho" | "America/Puerto_Rico" | "America/Punta_Arenas" | "America/Rainy_River" | "America/Rankin_Inlet" | "America/Recife" | "America/Regina" | "America/Resolute" | "America/Rio_Branco" | "America/Santarem" | "America/Santiago" | "America/Santo_Domingo" | "America/Sao_Paulo" | "America/Scoresbysund" | "America/Sitka" | "America/St_Barthelemy" | "America/St_Johns" | "America/St_Kitts" | "America/St_Lucia" | "America/St_Thomas" | "America/St_Vincent" | "America/Swift_Current" | "America/Tegucigalpa" | "America/Thule" | "America/Thunder_Bay" | "America/Tijuana" | "America/Toronto" | "America/Tortola" | "America/Vancouver" | "America/Whitehorse" | "America/Winnipeg" | "America/Yakutat" | "America/Yellowknife" | "Antarctica/Casey" | "Antarctica/Davis" | "Antarctica/DumontDUrville" | "Antarctica/Macquarie" | "Antarctica/Mawson" | "Antarctica/McMurdo" | "Antarctica/Palmer" | "Antarctica/Rothera" | "Antarctica/Syowa" | "Antarctica/Troll" | "Antarctica/Vostok" | "Arctic/Longyearbyen" | "Asia/Aden" | "Asia/Almaty" | "Asia/Amman" | "Asia/Anadyr" | "Asia/Aqtau" | "Asia/Aqtobe" | "Asia/Ashgabat" | "Asia/Atyrau" | "Asia/Baghdad" | "Asia/Bahrain" | "Asia/Baku" | "Asia/Bangkok" | "Asia/Barnaul" | "Asia/Beirut" | "Asia/Bishkek" | "Asia/Brunei" | "Asia/Chita" | "Asia/Choibalsan" | "Asia/Colombo" | "Asia/Damascus" | "Asia/Dhaka" | "Asia/Dili" | "Asia/Dubai" | "Asia/Dushanbe" | "Asia/Famagusta" | "Asia/Gaza" | "Asia/Hebron" | "Asia/Ho_Chi_Minh" | "Asia/Hong_Kong" | "Asia/Hovd" | "Asia/Irkutsk" | "Asia/Jakarta" | "Asia/Jayapura" | "Asia/Jerusalem" | "Asia/Kabul" | "Asia/Kamchatka" | "Asia/Karachi" | "Asia/Kathmandu" | "Asia/Khandyga" | "Asia/Kolkata" | "Asia/Krasnoyarsk" | "Asia/Kuala_Lumpur" | "Asia/Kuching" | "Asia/Kuwait" | "Asia/Macau" | "Asia/Magadan" | "Asia/Makassar" | "Asia/Manila" | "Asia/Muscat" | "Asia/Nicosia" | "Asia/Novosibirsk" | "Asia/Omsk" | "Asia/Oral" | "Asia/Phnom_Penh" | "Asia/Pontianak" | "Asia/Pyongyang" | "Asia/Qatar" | "Asia/Qyzylorda" | "Asia/Riyadh" | "Asia/Sakhalin" | "Asia/Samarkand" | "Asia/Seoul" | "Asia/Shanghai" | "Asia/Singapore" | "Asia/Srednekolymsk" | "Asia/Taipei" | "Asia/Tashkent" | "Asia/Tbilisi" | "Asia/Tehran" | "Asia/Thimphu" | "Asia/Tokyo" | "Asia/Tomsk" | "Asia/Ulaanbaatar" | "Asia/Urumqi" | "Asia/Ust-Nera" | "Asia/Vientiane" | "Asia/Vladivostok" | "Asia/Yakutsk" | "Asia/Yangon" | "Asia/Yekaterinburg" | "Asia/Yerevan" | "Atlantic/Azores" | "Atlantic/Bermuda" | "Atlantic/Canary" | "Atlantic/Cape_Verde" | "Atlantic/Faroe" | "Atlantic/Madeira" | "Atlantic/Reykjavik" | "Atlantic/South_Georgia" | "Atlantic/St_Helena" | "Atlantic/Stanley" | "Australia/Adelaide" | "Australia/Brisbane" | "Australia/Broken_Hill" | "Australia/Currie" | "Australia/Darwin" | "Australia/Eucla" | "Australia/Hobart" | "Australia/Lindeman" | "Australia/Lord_Howe" | "Australia/Melbourne" | "Australia/Perth" | "Australia/Sydney" | "Canada/Atlantic" | "Canada/Central" | "Canada/Eastern" | "Canada/Mountain" | "Canada/Newfoundland" | "Canada/Pacific" | "Europe/Amsterdam" | "Europe/Andorra" | "Europe/Astrakhan" | "Europe/Athens" | "Europe/Belgrade" | "Europe/Berlin" | "Europe/Bratislava" | "Europe/Brussels" | "Europe/Bucharest" | "Europe/Budapest" | "Europe/Busingen" | "Europe/Chisinau" | "Europe/Copenhagen" | "Europe/Dublin" | "Europe/Gibraltar" | "Europe/Guernsey" | "Europe/Helsinki" | "Europe/Isle_of_Man" | "Europe/Istanbul" | "Europe/Jersey" | "Europe/Kaliningrad" | "Europe/Kiev" | "Europe/Kyiv" | "Europe/Kirov" | "Europe/Lisbon" | "Europe/Ljubljana" | "Europe/London" | "Europe/Luxembourg" | "Europe/Madrid" | "Europe/Malta" | "Europe/Mariehamn" | "Europe/Minsk" | "Europe/Monaco" | "Europe/Moscow" | "Europe/Oslo" | "Europe/Paris" | "Europe/Podgorica" | "Europe/Prague" | "Europe/Riga" | "Europe/Rome" | "Europe/Samara" | "Europe/San_Marino" | "Europe/Sarajevo" | "Europe/Saratov" | "Europe/Simferopol" | "Europe/Skopje" | "Europe/Sofia" | "Europe/Stockholm" | "Europe/Tallinn" | "Europe/Tirane" | "Europe/Ulyanovsk" | "Europe/Uzhgorod" | "Europe/Vaduz" | "Europe/Vatican" | "Europe/Vienna" | "Europe/Vilnius" | "Europe/Volgograd" | "Europe/Warsaw" | "Europe/Zagreb" | "Europe/Zaporozhye" | "Europe/Zaporizhia" | "Europe/Zurich" | "GMT" | "Indian/Antananarivo" | "Indian/Chagos" | "Indian/Christmas" | "Indian/Cocos" | "Indian/Comoro" | "Indian/Kerguelen" | "Indian/Mahe" | "Indian/Maldives" | "Indian/Mauritius" | "Indian/Mayotte" | "Indian/Reunion" | "Pacific/Apia" | "Pacific/Auckland" | "Pacific/Bougainville" | "Pacific/Chatham" | "Pacific/Chuuk" | "Pacific/Easter" | "Pacific/Efate" | "Pacific/Enderbury" | "Pacific/Fakaofo" | "Pacific/Fiji" | "Pacific/Funafuti" | "Pacific/Galapagos" | "Pacific/Gambier" | "Pacific/Guadalcanal" | "Pacific/Guam" | "Pacific/Honolulu" | "Pacific/Kiritimati" | "Pacific/Kosrae" | "Pacific/Kwajalein" | "Pacific/Majuro" | "Pacific/Marquesas" | "Pacific/Midway" | "Pacific/Nauru" | "Pacific/Niue" | "Pacific/Norfolk" | "Pacific/Noumea" | "Pacific/Pago_Pago" | "Pacific/Palau" | "Pacific/Pitcairn" | "Pacific/Pohnpei" | "Pacific/Port_Moresby" | "Pacific/Rarotonga" | "Pacific/Saipan" | "Pacific/Tahiti" | "Pacific/Tarawa" | "Pacific/Tongatapu" | "Pacific/Wake" | "Pacific/Wallis" | "US/Alaska" | "US/Arizona" | "US/Central" | "US/Eastern" | "US/Hawaii" | "US/Mountain" | "US/Pacific" | "UTC";
export type Native__schema136 = (Native__schema104) | (null);
export type Native__schema137 = boolean;
export type Native__schema138 = "CAPITALIZE" | "UPPER" | "LOWER";
export type Native__schema139 = string;
export type Native__schema140 = "id" | "ms" | "bs" | "bg" | "da" | "de" | "et" | "en" | "es" | "fr" | "hr" | "it" | "lv" | "lt" | "hu" | "nl" | "no" | "pl" | "pt" | "ro" | "sk" | "sl" | "sr" | "fi" | "sv" | "vi" | "tr" | "cz" | "el" | "ru" | "uk" | "he" | "ar" | "th" | "zh" | "ja" | "ko";
export type Native__schema141 = boolean;
export type Native__schema142 = "arial,'helvetica neue',helvetica,sans-serif" | "'comic sans ms','marker felt-thin',arial,sans-serif" | "'courier new',courier,'lucida sans typewriter','lucida typewriter',monospace" | "georgia,times,'times new roman',serif" | "helvetica,'helvetica neue',arial,verdana,sans-serif" | "'lucida sans unicode','lucida grande',sans-serif" | "tahoma,verdana,segoe,sans-serif" | "'times new roman',times,baskerville,georgia,serif" | "'trebuchet ms','lucida grande','lucida sans unicode','lucida sans',tahoma,sans-serif" | "verdana,geneva,sans-serif" | "arvo,courier,georgia,serif" | "lato,'helvetica neue',helvetica,arial,sans-serif" | "lora,georgia,'times new roman',serif" | "merriweather,georgia,'times new roman',serif" | "'merriweather sans','helvetica neue',helvetica,arial,sans-serif" | "'noticia text',georgia,'times new roman',serif" | "'open sans','helvetica neue',helvetica,arial,sans-serif" | "'playfair display',georgia,'times new roman',serif" | "roboto,'helvetica neue',helvetica,arial,sans-serif" | "'source sans pro','helvetica neue',helvetica,arial,sans-serif";
export type Native__schema143 = number;
export type Native__schema144 = {
    "days": NativeColorValueDisallowTransparent;
    "hours": NativeColorValueDisallowTransparent;
    "minutes": NativeColorValueDisallowTransparent;
    "seconds": NativeColorValueDisallowTransparent;
};
export type Native__schema145 = {
    "days": NativeColorValueDisallowTransparent;
    "hours": NativeColorValueDisallowTransparent;
    "minutes": NativeColorValueDisallowTransparent;
    "seconds": NativeColorValueDisallowTransparent;
};
export type Native__schema146 = {
    "days": NativeColorValueDisallowTransparent;
    "hours": NativeColorValueDisallowTransparent;
    "minutes": NativeColorValueDisallowTransparent;
    "seconds": NativeColorValueDisallowTransparent;
};
export type NativeSocialBlock = {
    "id": Native__schema86;
    "type": Native__schema147;
    "settings": Native__schema148;
};
export type Native__schema147 = "social";
export type Native__schema148 = {
    "networks": Native__schema149;
    "style": Native__schema157;
    "iconSize": Native__schema158;
    "spaceBetweenIcons": Native__schema159;
    "textCustomization": Native__schema162;
    "alignment": Native__schema163;
    "backgroundColor": NativeColorValueAllowTransparent;
    "hideElement": NativeHideElement;
    "margins": Native__schema164;
    "includeInOutput": NativeOutputInclusion;
    "anchorLinkName": Native__schema123;
};
export type Native__schema149 = Array<Native__schema150>;
export type Native__schema150 = {
    "type": Native__schema151;
    "link"?: Native__schema152;
    "icon"?: Native__schema154;
    "title": Native__schema155;
    "alt"?: Native__schema156;
};
export type Native__schema151 = "twitter" | "xcom" | "facebook" | "youtube" | "askfm" | "behance" | "dribbble" | "flickr" | "foursquare" | "googleplus" | "instagram" | "lastfm" | "linkedin" | "myspace" | "pinterest" | "soundcloud" | "tumblr" | "vimeo" | "hangouts" | "messenger" | "skype" | "snapchat" | "telegram" | "viber" | "whatsapp" | "email" | "website" | "mapmarker" | "world" | "address" | "phone" | "share" | "rss" | "appstore" | "googleplay" | "windowsstore" | "wechat" | "weibo" | "blogger" | "medium" | "dropbox" | "googledrive" | "slack" | "github" | "pdf" | "doc" | "xls" | "ppt" | "xing" | "meetup" | "fleeped" | "tripAdvisor" | "spotify" | "tiktok" | "workplace" | "gmail" | "iTunesPodcasts" | "zoom" | "teams" | "onedrive" | "discord" | "twitch" | "line" | "patreon" | "kofi" | "yammer" | "buyMeACoffee" | "huaweiAppGallery" | "googleBusiness" | "reddit" | "strava" | "goodreads" | "custom" | "yelp" | "google" | "mastodon" | "glassdoor" | "threads" | "bluesky" | "digg" | "meet";
export type Native__schema152 = {
    "type": Native__schema105;
    "href": Native__schema153;
};
export type Native__schema153 = string;
export type Native__schema154 = string;
export type Native__schema155 = string;
export type Native__schema156 = string;
export type Native__schema157 = "custom" | "logoColored" | "logoBlack" | "logoGray" | "logoWhite" | "circleColored" | "circleColoredBordered" | "roundedColored" | "roundedColoredBordered" | "squareColored" | "squareColoredBordered" | "circleBlack" | "circleBlackBordered" | "roundedBlack" | "roundedBlackBordered" | "squareBlack" | "squareBlackBordered" | "circleGray" | "circleGrayBordered" | "roundedGray" | "roundedGrayBordered" | "squareGray" | "squareGrayBordered" | "circleWhite" | "circleWhiteBordered" | "roundedWhite" | "roundedWhiteBordered" | "squareWhite" | "squareWhiteBordered";
export type Native__schema158 = number;
export type Native__schema159 = {
    "desktop": Native__schema160;
    "mobile": Native__schema161;
};
export type Native__schema160 = number;
export type Native__schema161 = number;
export type Native__schema162 = boolean;
export type Native__schema163 = {
    "desktop": Native__schema115;
    "mobile": Native__schema115;
};
export type Native__schema164 = {
    "desktop": Native__schema165;
    "mobile": Native__schema165;
};
export type Native__schema165 = {
    "top": Native__schema166;
    "right": Native__schema167;
    "bottom": Native__schema168;
    "left": Native__schema169;
};
export type Native__schema166 = number;
export type Native__schema167 = number;
export type Native__schema168 = number;
export type Native__schema169 = number;
export type NativeHtmlBlock = {
    "id": Native__schema86;
    "type": Native__schema170;
    "settings": Native__schema171;
    "content"?: Native__schema172;
};
export type Native__schema170 = "html";
export type Native__schema171 = {
    "margins": Native__schema117;
    "includeInOutput": NativeOutputInclusion;
    "hideElement": NativeHideElement;
    "anchorLinkName": Native__schema123;
};
export type Native__schema172 = string;
export type NativeButtonBlock = {
    "id": Native__schema86;
    "type": Native__schema173;
    "settings": NativeButtonBlockSettings;
};
export type Native__schema173 = "button";
export type NativeButtonBlockSettings = {
    "link"?: Native__schema174;
    "text": Native__schema186;
    "alignment": Native__schema187;
    "fixedHeight"?: Native__schema188;
    "icon"?: Native__schema191;
    "hideElement": NativeHideElement;
    "padding": Native__schema196;
    "margins": Native__schema196;
    "includeInOutput": NativeOutputInclusion;
    "anchorLink": Native__schema199;
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
export type Native__schema174 = (Native__schema176) | (Native__schema179);
export type Native__schema175 = (Native__schema176) | (Native__schema179);
export type Native__schema176 = {
    "type": Native__schema177;
    "value": Native__schema178;
};
export type Native__schema177 = "site" | "anchor" | "email" | "phone" | "sms" | "telegram" | "viber" | "file" | "other";
export type Native__schema178 = string;
export type Native__schema179 = {
    "type": Native__schema180;
    "value": Native__schema181;
    "salesforce": Native__schema182;
};
export type Native__schema180 = "salesforce_mc";
export type Native__schema181 = string;
export type Native__schema182 = {
    "trackingAlias": Native__schema183;
    "linkTo": Native__schema184;
    "conversion": Native__schema185;
};
export type Native__schema183 = string;
export type Native__schema184 = string;
export type Native__schema185 = boolean;
export type Native__schema186 = string;
export type Native__schema187 = {
    "desktop": Native__schema115;
    "mobile": Native__schema115;
};
export type Native__schema188 = {
    "height": Native__schema189;
    "alignment"?: Native__schema190;
};
export type Native__schema189 = number;
export type Native__schema190 = "top" | "middle" | "bottom";
export type Native__schema191 = {
    "src": Native__schema192;
    "width": Native__schema193;
    "align": Native__schema194;
    "indent": Native__schema195;
};
export type Native__schema192 = string;
export type Native__schema193 = number;
export type Native__schema194 = "left" | "right";
export type Native__schema195 = number;
export type Native__schema196 = {
    "desktop": Native__schema197;
    "mobile": Native__schema197;
};
export type Native__schema197 = {
    "top": Native__schema198;
    "right": Native__schema198;
    "bottom": Native__schema198;
    "left": Native__schema198;
};
export type Native__schema198 = number;
export type Native__schema199 = string;
export type NativeFontSize = {
    "desktop": Native__schema200;
    "mobile": Native__schema201;
};
export type Native__schema200 = number;
export type Native__schema201 = number;
export type NativeButtonsTextStyle = {
    "bold": Native__schema202;
    "italic": Native__schema203;
};
export type Native__schema202 = boolean;
export type Native__schema203 = boolean;
export type NativeResponsiveBoolean = {
    "desktop": Native__schema204;
    "mobile": Native__schema205;
};
export type Native__schema204 = boolean;
export type Native__schema205 = boolean;
export type NativeSpacerBlock = {
    "id": Native__schema86;
    "type": Native__schema206;
    "settings": Native__schema207;
};
export type Native__schema206 = "spacer";
export type Native__schema207 = {
    "mode": Native__schema208;
    "width"?: Native__schema209;
    "height"?: Native__schema215;
    "border"?: Native__schema218;
    "alignment"?: Native__schema220;
    "backgroundColor": NativeColorValueAllowTransparent;
    "margins": Native__schema221;
    "anchorLinkName": Native__schema123;
    "includeInOutput": NativeOutputInclusion;
    "hideElement": NativeHideElement;
};
export type Native__schema208 = "line" | "space";
export type Native__schema209 = {
    "desktop": Native__schema210;
    "mobile": Native__schema214;
};
export type Native__schema210 = {
    "value": Native__schema211;
    "unit": Native__schema212;
};
export type Native__schema211 = number;
export type Native__schema212 = "percent" | "px";
export type Native__schema213 = {
    "value": Native__schema211;
    "unit": Native__schema212;
};
export type Native__schema214 = {
    "value": Native__schema211;
    "unit": Native__schema212;
};
export type Native__schema215 = {
    "desktop": Native__schema216;
    "mobile": Native__schema217;
};
export type Native__schema216 = number;
export type Native__schema217 = number;
export type Native__schema218 = {
    "size": Native__schema219;
    "style": Native__schema56;
    "color": NativeColorValueDisallowTransparent;
};
export type Native__schema219 = number;
export type Native__schema220 = {
    "desktop": Native__schema115;
    "mobile": Native__schema115;
};
export type Native__schema221 = {
    "desktop": Native__schema222;
    "mobile": Native__schema222;
};
export type Native__schema222 = {
    "top": Native__schema223;
    "right": Native__schema224;
    "bottom": Native__schema225;
    "left": Native__schema226;
};
export type Native__schema223 = number;
export type Native__schema224 = number;
export type Native__schema225 = number;
export type Native__schema226 = number;
export type NativeMenuBlock = {
    "id": Native__schema86;
    "type": Native__schema227;
    "settings": NativeMenuBlockSettings;
};
export type Native__schema227 = "menu";
export type NativeMenuBlockSettings = {
    "responsiveMenu": Native__schema228;
    "itemType": Native__schema229;
    "fitToContainer": Native__schema232;
    "itemPadding": Native__schema233;
    "margins": Native__schema233;
    "anchorLinkName": Native__schema123;
    "includeInOutput": NativeOutputInclusion;
    "separator": NativeMenuSeparator;
    "fontFamily": Native__schema8;
    "fontSize": NativeFontSize;
    "hideElement": NativeHideElement;
    "textStyle": NativeButtonsTextStyle;
    "colors": Native__schema238;
    "items": Native__schema241;
};
export type Native__schema228 = boolean;
export type Native__schema229 = (Native__schema230) | (Native__schema231);
export type Native__schema230 = {
    "mode": "shared";
    "type": NativeMenuItemType;
};
export type NativeMenuItemType = "links" | "icons" | "linksWithIcons";
export type Native__schema231 = {
    "mode": "perItem";
};
export type Native__schema232 = boolean;
export type Native__schema233 = {
    "desktop": Native__schema234;
    "mobile": Native__schema234;
};
export type Native__schema234 = {
    "top": Native__schema235;
    "right": Native__schema235;
    "bottom": Native__schema235;
    "left": Native__schema235;
};
export type Native__schema235 = number;
export type NativeMenuSeparator = {
    "width": Native__schema236;
    "style": Native__schema237;
    "color": NativeColorValueDisallowTransparent;
};
export type Native__schema236 = number;
export type Native__schema237 = "none" | "line" | "dashed" | "dotted";
export type Native__schema238 = (Native__schema239) | (Native__schema240);
export type Native__schema239 = {
    "mode": "shared";
    "link": NativeColorValueDisallowTransparent;
};
export type Native__schema240 = {
    "mode": "perItem";
};
export type Native__schema241 = Array<NativeMenuItem>;
export type NativeMenuItem = {
    "type"?: Native__schema242;
    "name": Native__schema243;
    "link": NativeMenuLink;
    "image"?: Native__schema246;
    "hideElement": NativeHideElement;
    "colors"?: Native__schema253;
};
export type Native__schema242 = "links" | "icons" | "linksWithIcons";
export type Native__schema243 = string;
export type NativeMenuLink = {
    "type": Native__schema244;
    "value": Native__schema245;
};
export type Native__schema244 = "site" | "email" | "phone" | "anchor";
export type Native__schema245 = string;
export type Native__schema246 = {
    "src": Native__schema247;
    "size": NativeMenuImageSize;
    "alignment": Native__schema250;
    "indent": Native__schema251;
    "altText": Native__schema252;
};
export type NativeMenuItemImage = {
    "src": Native__schema247;
    "size": NativeMenuImageSize;
    "alignment": Native__schema250;
    "indent": Native__schema251;
    "altText": Native__schema252;
};
export type Native__schema247 = string;
export type NativeMenuImageSize = {
    "mode": Native__schema248;
    "px": Native__schema249;
};
export type Native__schema248 = "width" | "height";
export type Native__schema249 = number;
export type Native__schema250 = "left" | "center" | "right";
export type Native__schema251 = number;
export type Native__schema252 = string;
export type Native__schema253 = {
    "link": NativeColorValueDisallowTransparent;
    "background": NativeColorValueAllowTransparent;
};
export type NativeUnknownBlock = {
    "id": Native__schema86;
    "type": Native__schema254;
    "settings"?: Native__schema255;
    "content": Native__schema258;
    "extension": Native__schema259;
};
export type Native__schema254 = "unknown";
export type Native__schema255 = {
    [key: string]: Native__schema257;
};
export type Native__schema256 = string;
export type Native__schema257 = unknown;
export type Native__schema258 = string;
export type Native__schema259 = boolean;
export type DocumentState = {
    "metadata"?: Native__schema0;
    "resources"?: Native__schema5;
    "settings": NativeEmailTemplateSettings;
    "stripes"?: Native__schema31;
};
export type DocumentBlock = NativeBlock;
export type BlockKind = DocumentBlock['type'];
export type BlockOf<K extends BlockKind> = Extract<DocumentBlock, {
    type: K;
}>;
export type BlockSettings<K extends BlockKind> = BlockOf<K>['settings'];

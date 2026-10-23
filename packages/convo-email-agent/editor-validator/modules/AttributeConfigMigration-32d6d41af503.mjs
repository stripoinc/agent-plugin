import {
  timeZones
} from "./time-zones-data-498efe19d3a8.mjs";
import {
  BUTTONS_TEXT_TRANSFORM_VALUES,
  EMPTY_BORDER_RADIUS,
  IMAGE_MAX_ALT_TEXT_LENGTH,
  MAX_QUANTITY_CONTAINERS,
  canonicalEmailTemplateSettingsSchema,
  clearFontValue,
  createEmailTemplateSettingsSchemas,
  getFontFaceCssDetails,
  isFontConnectionUrl,
  normalizeBackgroundImageSizeValue,
  normalizeOpaqueColor,
  normalizeTransparentAllowedColor,
  require_basePropertyOf,
  require_postcss,
  require_toString
} from "./ArrayUtils-759cc5f22881.mjs";
import {
  IMG_SELECTOR,
  QUERY_HTML_NODE_TEXT_NODE_SELECTOR
} from "./CSSConverter-608b83714731.mjs";
import {
  SmartBlockSourceType,
  SocialNetworkType as SocialNetworkType2
} from "./ue-proto-87c1854705b4.mjs";
import {
  external_exports
} from "./coerce-d38c736de753.mjs";
import {
  require_parser
} from "./at-rule-2b1e381bfcd5.mjs";
import {
  require_tokenize
} from "./tokenize-acf2d687b44d.mjs";
import {
  UIElementType
} from "./index-604a083968ff.mjs";
import {
  copy
} from "./index-83a196bff650.mjs";
import {
  require_comment
} from "./comment-c2c2abaee17f.mjs";
import {
  SOCIAL_ICONS_DATA,
  SocialNetworkType as SocialNetworkType3
} from "./social-networks-data-4f7cb53fbb33.mjs";
import {
  SOCIAL_NETWORK_ALIASES,
  SOCIAL_NETWORK_STYLES,
  SocialNetworkType
} from "./SocialNetworkType-57875c573e3d.mjs";
import {
  NodeUtils
} from "./_baseSlice-aae12ccd937b.mjs";
import {
  DefaultBlock
} from "./serviceSelectorPrefix-db24995a76b3.mjs";
import {
  q
} from "./builders-6d4dedaf957f.mjs";
import {
  __commonJS,
  __toESM
} from "./shared-4f53cda18c2b.mjs";

// editor/ui-editor-ui/node_modules/fast-deep-equal/index.js
var require_fast_deep_equal = __commonJS({
  "../editor/ui-editor-ui/node_modules/fast-deep-equal/index.js"(exports, module) {
    "use strict";
    module.exports = function equal(a, b) {
      if (a === b) return true;
      if (a && b && typeof a == "object" && typeof b == "object") {
        if (a.constructor !== b.constructor) return false;
        var length, i, keys;
        if (Array.isArray(a)) {
          length = a.length;
          if (length != b.length) return false;
          for (i = length; i-- !== 0; )
            if (!equal(a[i], b[i])) return false;
          return true;
        }
        if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
        if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
        if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
        keys = Object.keys(a);
        length = keys.length;
        if (length !== Object.keys(b).length) return false;
        for (i = length; i-- !== 0; )
          if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;
        for (i = length; i-- !== 0; ) {
          var key = keys[i];
          if (!equal(a[key], b[key])) return false;
        }
        return true;
      }
      return a !== a && b !== b;
    };
  }
});

// editor/ui-editor-ui/node_modules/lodash/_escapeHtmlChar.js
var require_escapeHtmlChar = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/_escapeHtmlChar.js"(exports, module) {
    "use strict";
    var basePropertyOf = require_basePropertyOf();
    var htmlEscapes = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    var escapeHtmlChar = basePropertyOf(htmlEscapes);
    module.exports = escapeHtmlChar;
  }
});

// editor/ui-editor-ui/node_modules/lodash/escape.js
var require_escape = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/escape.js"(exports, module) {
    "use strict";
    var escapeHtmlChar = require_escapeHtmlChar();
    var toString = require_toString();
    var reUnescapedHtml = /[&<>"']/g;
    var reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
    function escape4(string) {
      string = toString(string);
      return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
    }
    module.exports = escape4;
  }
});

// editor/ui-editor-ui/node_modules/lodash/escapeRegExp.js
var require_escapeRegExp = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/escapeRegExp.js"(exports, module) {
    "use strict";
    var toString = require_toString();
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
    var reHasRegExpChar = RegExp(reRegExpChar.source);
    function escapeRegExp2(string) {
      string = toString(string);
      return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
    }
    module.exports = escapeRegExp2;
  }
});

// editor/ui-editor-ui/node_modules/lodash/isObject.js
var require_isObject = __commonJS({
  "../editor/ui-editor-ui/node_modules/lodash/isObject.js"(exports, module) {
    "use strict";
    function isObject2(value) {
      var type = typeof value;
      return value != null && (type == "object" || type == "function");
    }
    module.exports = isObject2;
  }
});

// editor/ui-editor-ui/node_modules/postcss-safe-parser/lib/safe-parser.js
var require_safe_parser = __commonJS({
  "../editor/ui-editor-ui/node_modules/postcss-safe-parser/lib/safe-parser.js"(exports, module) {
    "use strict";
    var Comment = require_comment();
    var Parser = require_parser();
    var tokenizer = require_tokenize();
    var SafeParser = class extends Parser {
      checkMissedSemicolon() {
      }
      comment(token) {
        let node = new Comment();
        this.init(node, token[2]);
        let pos = this.input.fromOffset(token[3]) || this.input.fromOffset(this.input.css.length - 1);
        node.source.end = {
          column: pos.col,
          line: pos.line,
          offset: token[3] + 1
        };
        let text = token[1].slice(2);
        if (text.slice(-2) === "*/") text = text.slice(0, -2);
        if (/^\s*$/.test(text)) {
          node.text = "";
          node.raws.left = text;
          node.raws.right = "";
        } else {
          let match = text.match(/^(\s*)([^]*\S)(\s*)$/);
          node.text = match[2];
          node.raws.left = match[1];
          node.raws.right = match[3];
        }
      }
      createTokenizer() {
        this.tokenizer = tokenizer(this.input, { ignoreErrors: true });
      }
      decl(tokens) {
        if (tokens.length > 1 && tokens.some((i) => i[0] === "word")) {
          super.decl(tokens);
        }
      }
      doubleColon() {
      }
      endFile() {
        if (this.current.nodes && this.current.nodes.length) {
          this.current.raws.semicolon = this.semicolon;
        }
        this.current.raws.after = (this.current.raws.after || "") + this.spaces;
        while (this.current.parent) {
          this.current = this.current.parent;
          this.current.raws.after = "";
        }
        this.root.source.end = this.getPosition(this.tokenizer.position());
      }
      precheckMissedSemicolon(tokens) {
        let colon = this.colon(tokens);
        if (colon === false) return;
        let nextStart, prevEnd;
        for (nextStart = colon - 1; nextStart >= 0; nextStart--) {
          if (tokens[nextStart][0] === "word") break;
        }
        if (nextStart === 0 || nextStart < 0) return;
        for (prevEnd = nextStart - 1; prevEnd >= 0; prevEnd--) {
          if (tokens[prevEnd][0] !== "space") {
            prevEnd += 1;
            break;
          }
        }
        let other = tokens.slice(nextStart);
        let spaces = tokens.slice(prevEnd, nextStart);
        tokens.splice(prevEnd, tokens.length - prevEnd);
        this.spaces = spaces.map((i) => i[1]).join("");
        this.decl(other);
      }
      unclosedBracket() {
      }
      unexpectedClose() {
        this.current.raws.after += "}";
      }
      unknownWord(tokens) {
        this.spaces += tokens.map((i) => i[1]).join("");
      }
      unnamedAtrule(node) {
        node.name = "";
      }
    };
    module.exports = SafeParser;
  }
});

// editor/ui-editor-ui/node_modules/postcss-safe-parser/lib/safe-parse.js
var require_safe_parse = __commonJS({
  "../editor/ui-editor-ui/node_modules/postcss-safe-parser/lib/safe-parse.js"(exports, module) {
    "use strict";
    var { Input } = require_postcss();
    var SafeParser = require_safe_parser();
    module.exports = function safeParse(css, opts) {
      let input = new Input(css, opts);
      let parser = new SafeParser(input);
      parser.parse();
      return parser.root;
    };
  }
});

// editor/ui-editor-ui/src/app/core/block-operations-api/common/border/types.ts
var DEFAULT_BORDER_STYLE = "solid";
var DEFAULT_BORDER_COLOR = "transparent";
var DEFAULT_BORDER_WIDTH = 0;
var EMPTY_BORDER_SETTINGS = {
  top: { width: DEFAULT_BORDER_WIDTH, color: DEFAULT_BORDER_COLOR },
  right: { width: DEFAULT_BORDER_WIDTH, color: DEFAULT_BORDER_COLOR },
  bottom: { width: DEFAULT_BORDER_WIDTH, color: DEFAULT_BORDER_COLOR },
  left: { width: DEFAULT_BORDER_WIDTH, color: DEFAULT_BORDER_COLOR },
  style: DEFAULT_BORDER_STYLE
};

// editor/ui-editor-ui/src/app/core/block-operations-api/common/email-template-schema-types.ts
var ZERO_SIDE_VALUES = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
var ZERO_RADIUS_VALUES = {
  topLeft: 0,
  topRight: 0,
  bottomRight: 0,
  bottomLeft: 0
};
var DEFAULT_TEXT_BLOCK_SETTINGS = {
  hideElement: "no",
  rightToLeftTextDirection: false,
  alignment: { desktop: "left", mobile: "left" },
  padding: {
    desktop: { ...ZERO_SIDE_VALUES },
    mobile: { ...ZERO_SIDE_VALUES }
  },
  includeInOutput: "both",
  backgroundColor: "transparent"
};
var DEFAULT_IMAGE_BLOCK_SETTINGS = {
  src: "",
  altText: {
    text: "",
    addToTitle: true
  },
  responsiveMobile: false,
  size: {
    desktop: { mode: "width", px: 100 },
    mobile: { mode: "width", px: 100 }
  },
  alignment: {
    desktop: "center",
    mobile: "center"
  },
  radius: {
    desktop: { ...ZERO_RADIUS_VALUES },
    mobile: { ...ZERO_RADIUS_VALUES }
  },
  hideElement: "no",
  margins: {
    desktop: { ...ZERO_SIDE_VALUES },
    mobile: { ...ZERO_SIDE_VALUES }
  },
  includeInOutput: "both",
  anchorLinkName: ""
};
var DEFAULT_VIDEO_BLOCK_SETTINGS = {
  videoLink: "",
  altText: {
    text: "",
    addToTitle: true
  },
  playButtonStyle: "red",
  responsiveMobile: false,
  size: {
    desktop: { mode: "width", px: 100 },
    mobile: { mode: "width", px: 100 }
  },
  alignment: {
    desktop: "center",
    mobile: "center"
  },
  radius: {
    desktop: { ...ZERO_RADIUS_VALUES },
    mobile: { ...ZERO_RADIUS_VALUES }
  },
  hideElement: "no",
  paddings: {
    desktop: { ...ZERO_SIDE_VALUES },
    mobile: { ...ZERO_SIDE_VALUES }
  },
  includeInOutput: "both",
  anchorLinkName: ""
};
var DEFAULT_TIMER_BLOCK_SETTINGS = {
  altText: {
    text: "",
    addToTitle: true
  },
  responsiveMobile: false,
  size: {
    desktop: { mode: "width", px: 100 },
    mobile: { mode: "width", px: 100 }
  },
  alignment: {
    desktop: "center",
    mobile: "center"
  },
  margins: {
    desktop: { ...ZERO_SIDE_VALUES },
    mobile: { ...ZERO_SIDE_VALUES }
  },
  endDate: "",
  timeZone: "UTC",
  link: null,
  displayDays: true,
  labelsLetterCase: "LOWER",
  separator: ":",
  labelsLanguage: "en",
  retinaDisplaySupport: true,
  expirationImageSrc: "",
  hideElement: "no",
  includeInOutput: "both",
  anchorLinkName: "",
  digitsFontFamily: "arial,'helvetica neue',helvetica,sans-serif",
  digitsFontSize: 14,
  digitsFontColor: "#000000",
  labelsFontFamily: "arial,'helvetica neue',helvetica,sans-serif",
  labelsFontSize: 14,
  labelsFontColor: "#000000",
  separatorFontFamily: "arial,'helvetica neue',helvetica,sans-serif",
  separatorFontSize: 14,
  separatorFontColor: "#000000",
  backgroundColor: "#ffffff"
};
var DEFAULT_HTML_BLOCK_SETTINGS = {
  margins: {
    desktop: { ...ZERO_SIDE_VALUES },
    mobile: { ...ZERO_SIDE_VALUES }
  },
  includeInOutput: "both",
  hideElement: "no",
  anchorLinkName: ""
};
var DEFAULT_SPACER_BLOCK_SETTINGS = {
  mode: "space",
  width: {
    desktop: { value: 100, unit: "percent" },
    mobile: { value: 100, unit: "percent" }
  },
  height: {
    desktop: 40,
    mobile: 40
  },
  border: {
    size: 1,
    style: "solid",
    color: "#cccccc"
  },
  alignment: {
    desktop: "center",
    mobile: "center"
  },
  backgroundColor: "transparent",
  margins: {
    desktop: { ...ZERO_SIDE_VALUES },
    mobile: { ...ZERO_SIDE_VALUES }
  },
  anchorLinkName: "",
  includeInOutput: "both",
  hideElement: "no"
};
var DEFAULT_MENU_BLOCK_SETTINGS = {
  responsiveMenu: false,
  itemType: {
    mode: "perItem"
  },
  fitToContainer: true,
  itemPadding: {
    desktop: { ...ZERO_SIDE_VALUES },
    mobile: { ...ZERO_SIDE_VALUES }
  },
  margins: {
    desktop: { ...ZERO_SIDE_VALUES },
    mobile: { ...ZERO_SIDE_VALUES }
  },
  anchorLinkName: "",
  includeInOutput: "both",
  separator: {
    width: 0,
    style: "none",
    color: "#cccccc"
  },
  fontFamily: "arial,helvetica,sans-serif",
  fontSize: {
    desktop: 14,
    mobile: 14
  },
  hideElement: "no",
  textStyle: {
    bold: false,
    italic: false
  },
  colors: {
    mode: "shared",
    link: "#000000"
  },
  items: [
    {
      type: "links",
      name: "",
      link: {
        type: "site",
        value: ""
      },
      hideElement: "no"
    }
  ]
};

// editor/ui-editor-ui/src/app/constants/default-fonts-config.ts
var DEFAULT_SYSTEM_FONT = "-apple-system,BlinkMacSystemFont,Aptos,'Segoe UI',Roboto,Helvetica,Arial,sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol'";
var DEFAULT_FONTS = [
  {
    category: "STANDARD" /* STANDARD */,
    entries: [
      {
        name: "System Font",
        value: DEFAULT_SYSTEM_FONT,
        active: true
      },
      { name: "Arial", value: "arial,'helvetica neue',helvetica,sans-serif", active: true },
      { name: "Comic Sans MS", value: "'comic sans ms','marker felt-thin',arial,sans-serif", active: true },
      {
        name: "Courier New",
        value: "'courier new',courier,'lucida sans typewriter','lucida typewriter',monospace",
        active: true
      },
      { name: "Georgia", value: "georgia,times,'times new roman',serif", active: true },
      { name: "Helvetica", value: "helvetica,'helvetica neue',arial,verdana,sans-serif", active: true },
      { name: "Lucida Sans Unicode", value: "'lucida sans unicode','lucida grande',sans-serif", active: true },
      { name: "Tahoma", value: "tahoma,verdana,segoe,sans-serif", active: true },
      { name: "Times New Roman", value: "'times new roman',times,baskerville,georgia,serif", active: true },
      {
        name: "Trebuchet MS",
        value: "'trebuchet ms','lucida grande','lucida sans unicode','lucida sans',tahoma,sans-serif",
        active: true
      },
      { name: "Verdana", value: "verdana,geneva,sans-serif", active: true }
    ]
  },
  {
    category: "NON_STANDARD" /* NON_STANDARD */,
    entries: [
      { name: "Arvo", value: "arvo,courier,georgia,serif", active: true },
      { name: "Lato", value: "lato,'helvetica neue',helvetica,arial,sans-serif", active: true },
      { name: "Lora", value: "lora,georgia,'times new roman',serif", active: true },
      { name: "Merriweather", value: "merriweather,georgia,'times new roman',serif", active: true },
      {
        name: "Merriweather Sans",
        value: "'merriweather sans','helvetica neue',helvetica,arial,sans-serif",
        active: true
      },
      { name: "Noticia Text", value: "'noticia text',georgia,'times new roman',serif", active: true },
      { name: "Open Sans", value: "'open sans','helvetica neue',helvetica,arial,sans-serif", active: true },
      { name: "Playfair Display", value: "'playfair display',georgia,'times new roman',serif", active: true },
      { name: "Roboto", value: "roboto,'helvetica neue',helvetica,arial,sans-serif", active: true },
      {
        name: "Source Sans Pro",
        value: "'source sans pro','helvetica neue',helvetica,arial,sans-serif",
        active: true
      }
    ]
  },
  {
    category: "CUSTOM" /* CUSTOM */,
    entries: []
  },
  {
    category: "FAVOURITES" /* FAVOURITES */,
    entries: [],
    categoryLabel: ""
  }
];

// editor/ui-editor-ui/src/app/core/models-api/CRDT/register/register.ts
var import_fast_deep_equal = __toESM(require_fast_deep_equal());

// editor/ui-editor-ui/src/app/core/models-api/runtime/id.ts
var byteToHex = [];
for (let i = 0; i < 256; ++i) {
  byteToHex[i] = (i + 256).toString(16).substring(1);
}

// editor/ui-editor-ui/src/app/entities/SmartBlock.ts
var SMART_BLOCK_SOURCE_TYPES = [
  SmartBlockSourceType.SMART_BLOCK_SOURCE_TYPE_WEBSITE_PAGE,
  SmartBlockSourceType.SMART_BLOCK_SOURCE_TYPE_DATA_FEED
];

// editor/ui-editor-ui/src/app/entities/InputType.ts
var InputType = ((InputType2) => {
  InputType2[InputType2["BUTTON"] = UIElementType.BUTTON] = "BUTTON";
  InputType2[InputType2["CHECKBOX"] = UIElementType.CHECKBOX] = "CHECKBOX";
  InputType2[InputType2["CHECK_BUTTONS"] = UIElementType.CHECK_BUTTONS] = "CHECK_BUTTONS";
  InputType2[InputType2["COLOR"] = UIElementType.COLOR] = "COLOR";
  InputType2[InputType2["COUNTER"] = UIElementType.COUNTER] = "COUNTER";
  InputType2[InputType2["DATEPICKER"] = UIElementType.DATEPICKER] = "DATEPICKER";
  InputType2[InputType2["LABEL"] = UIElementType.LABEL] = "LABEL";
  InputType2[InputType2["MESSAGE"] = UIElementType.MESSAGE] = "MESSAGE";
  InputType2[InputType2["RADIO_BUTTONS"] = UIElementType.RADIO_BUTTONS] = "RADIO_BUTTONS";
  InputType2[InputType2["SELECTPICKER"] = UIElementType.SELECTPICKER] = "SELECTPICKER";
  InputType2[InputType2["SWITCHER"] = UIElementType.SWITCHER] = "SWITCHER";
  InputType2[InputType2["TEXT"] = UIElementType.TEXT] = "TEXT";
  InputType2[InputType2["TEXTAREA"] = UIElementType.TEXTAREA] = "TEXTAREA";
  InputType2[InputType2["MERGETAGS"] = UIElementType.MERGETAGS] = "MERGETAGS";
  InputType2[InputType2["FONT_FAMILY_SELECT"] = UIElementType.FONT_FAMILY_SELECT] = "FONT_FAMILY_SELECT";
  InputType2[InputType2["NESTED_CONTROL"] = UIElementType.NESTED_CONTROL] = "NESTED_CONTROL";
  InputType2[InputType2["ICON"] = UIElementType.ICON] = "ICON";
  InputType2[InputType2["EXPANDABLE"] = UIElementType.EXPANDABLE] = "EXPANDABLE";
  InputType2[InputType2["ORDERABLE"] = UIElementType.ORDERABLE] = "ORDERABLE";
  InputType2[InputType2["ORDERABLE_ITEM"] = UIElementType.ORDERABLE_ITEM] = "ORDERABLE_ITEM";
  InputType2[InputType2["ORDERABLE_ICON"] = UIElementType.ORDERABLE_ICON] = "ORDERABLE_ICON";
  InputType2[InputType2["AMP_FORM_SERVICE_PICKER"] = UIElementType.AMP_FORM_SERVICE_PICKER] = "AMP_FORM_SERVICE_PICKER";
  InputType2[InputType2["MULTIPLE_SELECT"] = UIElementType.MULTIPLE_SELECT] = "MULTIPLE_SELECT";
  InputType2[InputType2["POPUP_PANEL"] = UIElementType.POPUP_PANEL] = "POPUP_PANEL";
  InputType2["BANNER_CROPPER"] = "UE-BANNER-CROPPER";
  InputType2["CAPTION"] = "UE-CAPTION";
  InputType2["CAROUSEL"] = "UE-CAROUSEL";
  InputType2["CHECK_BUTTON"] = "UE-CHECK-BUTTON";
  InputType2["DROPZONE"] = "UE-DROPZONE";
  InputType2["ADD_CONTENT_TOGGLE"] = "UE-ADD-CONTENT-TOGGLE";
  InputType2["OPEN_EMOJI"] = "UE-EMOJI-TOGGLE";
  InputType2["EXTENSION"] = "UE-EXTENSION-INPUT";
  InputType2["GRADIENT_SLIDER"] = "UE-GRADIENT-SLIDER";
  InputType2["HIDDEN_PRE_HEADER"] = "UE-HIDDEN-PRE-HEADER";
  InputType2["MERGE_TAG_TOGGLE"] = "UE-MERGE-TAG-TOGGLE";
  InputType2["MESSAGE_SUBJECT_TITLE"] = "UE-MESSAGE-SUBJECT-TITLE";
  InputType2["RICH_TEXT"] = "UE-RICH-TEXT";
  InputType2["IMAGE"] = "UE-IMAGE";
  InputType2["IMAGE_GALLERY"] = "UE-IMAGE-GALLERY";
  InputType2["IMAGE_GALLERY_AI"] = "UE-IMAGE-GALLERY-AI";
  InputType2["LINK"] = "UE-LINK";
  InputType2["LISTBOX"] = "UE-LISTBOX";
  InputType2["NUMBER"] = "UE-NUMBER";
  InputType2["PANEL_NAVIGATION"] = "UE-PANEL-NAVIGATION";
  InputType2["PIXIE"] = "UE-PIXIE";
  InputType2["POPOVER_TOGGLER"] = "UE-POPOVER-TOGGLER";
  InputType2["QUOTAS_BADGE"] = "UE-QUOTAS-BADGE";
  InputType2["SMART_BLOCK_CONFIG"] = "UE-SMART-CONFIG";
  InputType2["SMART_BLOCK_MAPPING"] = "UE-SMART-MAPPING";
  InputType2["SMART_BLOCK_DATA_PREVIEW"] = "UE-SMART-DATA-PREVIEW";
  InputType2["SMART_BLOCK_IMAGE"] = "UE-SMART-IMAGE";
  InputType2["SMART_BLOCK_TEXT"] = "UE-SMART-TEXT";
  InputType2["SMART_BLOCK_VALUES"] = "UE-SMART-BLOCK-VALUES";
  InputType2["SOCIAL_ICONS_TOGGLE"] = "UE-TOGGLE-ICON-PICKER";
  InputType2["TABS_HEADER"] = "UE-TABS-HEADER";
  InputType2["TEMPLATE_THEME_SELECTOR"] = "UE-TEMPLATE-THEME-SELECTOR";
  InputType2["TOGGLE"] = "UE-TOGGLE";
  InputType2["GIF_PREVIEW"] = "UE-GIF-PREVIEW";
  InputType2["VIDEO_DROPZONE"] = "UE-VIDEO-DROPZONE";
  InputType2["AMP_FORM_PANEL_SETTINGS"] = "UE-AMP-FORM-PANEL-SETTINGS";
  return InputType2;
})(InputType || {});

// editor/ui-editor-ui/src/app/entities/UIObjectTypes.ts
var UIObjectType = ((UIObjectType2) => {
  UIObjectType2["CONTAINER"] = "UE-CONTAINER";
  UIObjectType2["RESPONSIVE_CONTAINER"] = "UE-RESPONSIVE-CONTAINER";
  UIObjectType2["FORM"] = "UE-FORM";
  UIObjectType2["GENERIC"] = "GENERIC";
  UIObjectType2["PREVIEW"] = "UE-PREVIEW";
  UIObjectType2["SIMPLE_PANEL"] = "UE-SIMPLE-PANEL";
  UIObjectType2["CODE_EDITOR"] = "UE-CODE-EDITOR";
  UIObjectType2["CONTROLS_PANEL"] = "UE-CONTROLS-PANEL";
  UIObjectType2["STYLES_PANEL"] = "UE-STYLES-PANEL";
  UIObjectType2["MAIN_TABS_PANEL"] = "UE-MAIN-TABS-PANEL";
  UIObjectType2["HEADER"] = "UE-HEADER";
  UIObjectType2["ACCORDION"] = "UE-ACCORDION";
  UIObjectType2["BLOCKS_PANEL"] = "UE-BLOCKS-PANEL";
  UIObjectType2["BLOCKS_PANEL_HEADER"] = "UE-BLOCKS-PANEL-HEADER";
  UIObjectType2["MODULES_PANEL"] = "UE-MODULES-PANEL";
  UIObjectType2["MODULES_PANEL_CONTENT"] = "UE-MODULES-PANEL-CONTENT";
  UIObjectType2["MODULES_CATEGORY"] = "UE-MODULES-CATEGORY";
  UIObjectType2["COMMENTS_PANEL"] = "UE-COMMENTS-PANEL";
  UIObjectType2["MOBILE_COMMENTS_PANEL"] = "UE-MOBILE-COMMENTS-PANEL";
  UIObjectType2["COMMENTS_TREAD"] = "UE-COMMENTS-TREAD";
  UIObjectType2["USER_TAG_LIST"] = "UE-USER-TAG-LIST";
  UIObjectType2["BLOCK_THUMB"] = "UE-BLOCK-THUMB";
  UIObjectType2["STRIPE_THUMB"] = "UE-STRIPE-THUMB";
  UIObjectType2["ELEMENT_HIGHLIGHT"] = "UE-ELEMENT-HIGHLIGHT";
  UIObjectType2["DOCUMENT_PREVIEW_CONTAINER"] = "UE-DOCUMENT-PREVIEW-CONTAINER";
  UIObjectType2["MAIN_EDITOR_CONTAINER"] = "UE-MAIN-EDITOR-CONTAINER";
  UIObjectType2["HISTORY"] = "UE-HISTORY";
  UIObjectType2["DESCRIPTION"] = "UE-DESCRIPTION";
  UIObjectType2["MENU"] = "UE-MENU";
  UIObjectType2["BLOCK_THUMB_HINT"] = "UE-BLOCK-THUMB-HINT";
  UIObjectType2["IMG_HINT"] = "UE-IMG-HINT";
  UIObjectType2["CONTEXT_MENU"] = "UE-CONTEXT-MENU";
  UIObjectType2["MODULE_HINT"] = "UE-MODULE-HINT";
  UIObjectType2["SOCIAL_ICONS_PICKER"] = "UE-SOCIAL-ICONS-PICKER";
  UIObjectType2["INSERT_NEW_ELEMENT"] = "UE-INSERT-NEW-ELEMENT";
  UIObjectType2["TEXT_AI_TOGGLE"] = "TEXT-AI-TOGGLE";
  UIObjectType2["TEXT_AI_LIST"] = "TEXT-AI-LIST";
  UIObjectType2["TEXT_AI_IMPROVE"] = "TEXT-AI-IMPROVE";
  UIObjectType2["TEMPLATE_THEME_HISTORY_RECOVERY"] = "UE-TEMPLATE-THEME-HISTORY-RECOVERY";
  UIObjectType2["COLOR_PICKER"] = "UE-COLOR-PICKER";
  UIObjectType2["COLOR_PICKER_WRAPPER"] = "UE-COLOR-PICKER-WRAPPER";
  UIObjectType2["COLOR_MERGE_TAGS"] = "UE-COLOR-MERGE-TAGS";
  UIObjectType2["MESSAGE"] = "UE-MESSAGE";
  UIObjectType2["CLICKABLE_ITEM"] = "UE-CLICKABLE-ITEM";
  UIObjectType2["NARROW_PANEL_AREA"] = "UE-NARROW-PANEL-AREA";
  UIObjectType2["WIDE_PANEL_AREA"] = "UE-WIDE-PANEL-AREA";
  UIObjectType2["FIXED_PANEL_AREA"] = "UE-FIXED-PANEL-AREA";
  UIObjectType2["IMG_MENU"] = "UE-IMG-MENU";
  UIObjectType2["SOON"] = "UE-SOON";
  UIObjectType2["LOCK"] = "UE-LOCK";
  UIObjectType2["LOCK_CONTAINER"] = "UE-LOCK-CONTAINER";
  UIObjectType2["VISUAL_MODE"] = "UE-VISUAL-MODE";
  UIObjectType2["DYNAMIC_CONTAINERS"] = "UE-DYNAMIC-CONTAINERS";
  UIObjectType2["EQUALIZATION_MODE"] = "UE-EQUALIZATION_MODE";
  UIObjectType2["GMAIL_PROMO_PREVIEW"] = "UE-GMAIL-PROMO_PREVIEW";
  UIObjectType2["DEAL_CARD_PREVIEW"] = "UE-DEAL-CARD-PREVIEW";
  UIObjectType2["TEXT_PANEL"] = "UE-TEXT-PANEL";
  UIObjectType2["TABLE_PANEL"] = "UE-TABLE-PANEL";
  UIObjectType2["BANNER_PANEL"] = "UE-BANNER-PANEL";
  UIObjectType2["MODULE_FORM"] = "UE-MODULE-FORM";
  UIObjectType2["ACCESSIBILITY_PANEL"] = "UE-ACCESSIBILITY-PANEL";
  UIObjectType2["URL_LINK_VALIDATION_PANEL"] = "UE-URL-LINK-VALIDATION-PANEL";
  UIObjectType2["DOTTED_NAV"] = "UE-DOTTED-NAV";
  UIObjectType2["EMOJI_COMPONENT"] = "UE-EMOJI-COMPONENT";
  UIObjectType2["MERGE_TAGS_COMPONENT"] = "UE-MERGE-TAGS-COMPONENT";
  UIObjectType2["LINK_MERGE_TAG_PICKER"] = "UE_LINK_MERGE_TAG_PICKER";
  UIObjectType2["USER_CURSOR"] = "UE-USER-CURSOR";
  UIObjectType2["ACTIVE_USERS"] = "UE-ACTIVE-USERS";
  UIObjectType2["AMP_VALIDATION_VIEW"] = "UE-AMP-VALIDATION-VIEW";
  UIObjectType2["COMMENTS_PIN"] = "UE-COMMENTS-PIN";
  UIObjectType2[UIObjectType2["ICON"] = UIElementType.ICON] = "ICON";
  UIObjectType2[UIObjectType2["ORDERABLE_ITEM"] = UIElementType.ORDERABLE_ITEM] = "ORDERABLE_ITEM";
  UIObjectType2[UIObjectType2["SCROLLABLE_CONTAINER"] = UIElementType.SCROLLABLE] = "SCROLLABLE_CONTAINER";
  UIObjectType2[UIObjectType2["REPEATABLE"] = UIElementType.REPEATABLE] = "REPEATABLE";
  UIObjectType2[UIObjectType2["DRAGGABLE_BLOCK"] = UIElementType.DRAGGABLE_BLOCK] = "DRAGGABLE_BLOCK";
  return UIObjectType2;
})(UIObjectType || {});
var inputTagOverrideMap = Object.values(InputType).reduce((all, tag) => ({ ...all, [tag]: tag }), {});
var originalInputTagOverrideMap = copy(inputTagOverrideMap);

// editor/ui-editor-ui/src/app/core/nodes-api/history/actions/GUID.ts
var byteToHex2 = [];
for (let i = 0; i < 256; ++i) {
  byteToHex2[i] = (i + 256).toString(16).substring(1);
}

// editor/ui-editor-ui/src/app/services/editor-mode/editor-mode.capabilities.ts
var RUNTIME_EDITOR_MODE_CAPABILITIES = {
  ["account" /* ACCOUNT */]: {
    allowsOwnHeader: false,
    configEnrichmentKind: "none",
    otacKind: "account-like",
    uiKind: "standard"
  },
  ["demo" /* DEMO */]: {
    allowsOwnHeader: true,
    configEnrichmentKind: "demo",
    otacKind: "account-like",
    uiKind: "standard"
  },
  ["plugin" /* PLUGIN */]: {
    allowsOwnHeader: true,
    configEnrichmentKind: "plugin",
    otacKind: "plugin",
    uiKind: "standard"
  },
  ["interactive_preview" /* INTERACTIVE_PREVIEW */]: {
    allowsOwnHeader: false,
    configEnrichmentKind: "none",
    otacKind: "interactive-preview",
    uiKind: "interactive-preview"
  }
};

// editor/ui-editor-ui/src/app/tools/utils/UsedFontsGetter.node-safe.ts
var import_escape3 = __toESM(require_escape());
var import_escapeRegExp = __toESM(require_escapeRegExp());

// editor/ui-editor-common/node-config/ConfigMigrationUtils.ts
function ensureAttributes(htmlObject) {
  return htmlObject.attributes ??= {};
}
function ensureConfig(htmlObject) {
  return htmlObject.config ??= {};
}
function isAttributeValue(value) {
  return typeof value === "string" || typeof value === "number" || typeof value === "boolean";
}

// editor/ui-editor-common/node-config/BannerConfigMigration.ts
var BLOCK_BANNER = "BLOCK_BANNER";
var BANNER = "BANNER";
var OLD_EDITOR_BANNER_IMG_CLASS = "esdev-banner-rendered";
var BANNER_CONFIG_BLOCK = "ESD-CONFIG-BLOCK";
var BANNER_CHILDREN_CONFIG = "ESD-BANNER-CHILDREN";
var BANNER_RESOLUTION = "ESD-BANNER-CONTAINER-RESOLUTION";
var BANNER_ASPECT_RATIO = "ESD-ASPECT-RATIO";
var BannerConfigMigration = class _BannerConfigMigration {
  migrateFromOldToNew(htmlObject) {
    const classes = (htmlObject.attributes?.class || "").split(" ");
    if (!classes.length) {
      return;
    }
    if (classes.indexOf("esd-block-banner") !== -1) {
      htmlObject.tag = BLOCK_BANNER;
      this.migrateBannerElementFromOldToNew(htmlObject);
      htmlObject.children = htmlObject.children.filter((c) => !NodeUtils.isTag(BANNER_CONFIG_BLOCK)(c));
      const bannerNode = NodeUtils.findFirst(htmlObject, NodeUtils.isTag(BANNER));
      if (bannerNode?.attributes?.src && !_BannerConfigMigration.isDefaultImagePath(bannerNode.attributes.src)) {
        htmlObject.config = { BANNER_IMG: bannerNode.attributes.src };
      }
      const bannerAttributes = bannerNode?.attributes;
      if (bannerAttributes) {
        const originalSrc = bannerAttributes["esd-src"];
        if (typeof originalSrc === "string") {
          bannerAttributes.src = originalSrc;
          delete bannerAttributes["esd-src"];
        }
      }
    }
  }
  static isDefaultImagePath(path) {
    return path.includes("default-img.png");
  }
  migrateFromNewToOld(htmlObject) {
    if (!htmlObject.config || !NodeUtils.isTag(BLOCK_BANNER)(htmlObject)) {
      return;
    }
    const configuredImgSrc = htmlObject.config["BANNER_IMG" /* BANNER_IMG */];
    const imgSrc = typeof configuredImgSrc === "string" ? configuredImgSrc : void 0;
    htmlObject.tag = "TD" /* TD */;
    this.migrateBannerElementFromNewToOld(htmlObject, imgSrc);
  }
  readConfig(block, banner) {
    const config = NodeUtils.findFirst(block, NodeUtils.isTag(BANNER_CONFIG_BLOCK));
    if (block && banner && config) {
      const childrenConfig = NodeUtils.findFirst(config, NodeUtils.isTag(BANNER_CHILDREN_CONFIG));
      banner.children = [...childrenConfig?.children || []];
      const resolutionConfig = NodeUtils.findFirst(config, NodeUtils.isTag(BANNER_RESOLUTION));
      if (resolutionConfig?.children?.[0]?.content) {
        const [width, height] = resolutionConfig.children[0].content.split("x").map((v) => parseInt(v, 10));
        const attributes = ensureAttributes(banner);
        attributes.width = width;
        attributes.height = height;
      }
      block.children = block.children.filter((c) => c !== config);
    } else if (banner) {
      banner.children = [];
    }
  }
  migrateBannerElementFromOldToNew(htmlObject) {
    const bannerNode = NodeUtils.findFirst(htmlObject, NodeUtils.isTag("IMG" /* IMG */));
    if (bannerNode) {
      this.readConfig(htmlObject, bannerNode);
      const attributes = ensureAttributes(bannerNode);
      const classes = (attributes.class || "").split(" ").filter((v) => !!v);
      if (classes.indexOf(OLD_EDITOR_BANNER_IMG_CLASS) !== -1) {
        attributes.class = classes.filter((cls) => cls !== OLD_EDITOR_BANNER_IMG_CLASS).join(" ");
      }
      bannerNode.tag = BANNER;
    }
  }
  setConfig(block, banner) {
    block.children.push({
      tag: BANNER_CONFIG_BLOCK,
      type: 1 /* ELEMENT_NODE */,
      children: [
        {
          tag: BANNER_CHILDREN_CONFIG,
          type: 1 /* ELEMENT_NODE */,
          children: banner.children,
          path: [],
          attributes: {}
        },
        {
          tag: BANNER_ASPECT_RATIO,
          type: 1 /* ELEMENT_NODE */,
          children: [{
            type: 3 /* TEXT_NODE */,
            content: "-1",
            path: [],
            children: [],
            attributes: {},
            tag: void 0
          }],
          path: [],
          attributes: {}
        }
      ],
      path: [],
      attributes: {}
    });
    banner.children = [];
  }
  migrateBannerElementFromNewToOld(htmlObject, imgSrc) {
    const bannerNode = NodeUtils.findFirst(htmlObject, NodeUtils.isTag(BANNER));
    if (bannerNode) {
      this.setConfig(htmlObject, bannerNode);
      const attributes = ensureAttributes(bannerNode);
      const prevSrc = attributes.src;
      attributes["esd-src"] = prevSrc;
      attributes.src = imgSrc || prevSrc;
      const classes = (attributes.class || "").split(" ").filter((v) => !!v);
      if (classes.indexOf(OLD_EDITOR_BANNER_IMG_CLASS) === -1) {
        classes.push(OLD_EDITOR_BANNER_IMG_CLASS);
        attributes.class = classes.join(" ");
      }
      bannerNode.tag = "IMG" /* IMG */;
    }
  }
};

// editor/ui-editor-common/node-config/AttributeConfigMigration.ts
var AttributeConfigMigration = class {
  constructor(config, attribute) {
    this.config = config;
    this.attribute = attribute;
  }
  migrateFromOldToNew(htmlObject) {
    const attributes = htmlObject.attributes;
    if (!attributes) {
      return;
    }
    Object.keys(attributes).filter((attributeName) => attributeName === this.attribute).forEach((attributeName) => {
      const value = attributes[attributeName];
      if (value !== void 0) {
        ensureConfig(htmlObject)[this.config] = value;
      }
      delete attributes[attributeName];
    });
  }
  migrateFromNewToOld(htmlObject) {
    const value = htmlObject?.config && htmlObject?.config[this.config];
    if (!value || !isAttributeValue(value)) {
      return;
    }
    ensureAttributes(htmlObject)[this.attribute] = value;
  }
};

// editor/ui-editor-common/node-config/ClassConfigMigration.ts
var ClassConfigMigration = class {
  constructor(config, classname) {
    this.config = config;
    this.classname = classname;
  }
  migrateFromOldToNew(htmlObject) {
    const attributes = htmlObject.attributes;
    if (!attributes) {
      return;
    }
    const classes = (attributes?.class || "").split(" ");
    if (!classes.length) {
      return;
    }
    if (classes.indexOf(this.classname) !== -1) {
      ensureConfig(htmlObject)[this.config] = true;
      const newClas = classes.filter((clazz) => clazz !== this.classname).join(" ").trim();
      newClas ? attributes.class = newClas : delete attributes.class;
    }
  }
  migrateFromNewToOld(htmlObject) {
    if (!htmlObject.config?.[this.config]) {
      return;
    }
    const attributes = ensureAttributes(htmlObject);
    if (!attributes.class) {
      attributes.class = this.classname;
      return;
    }
    attributes.class = "".concat(attributes.class, " ").concat(this.classname);
  }
};

// editor/ui-editor-ui/src/app/core-model-adapter/action-transformers/helpers/html-node-interop.ts
function isRecord(value) {
  return value !== null && typeof value === "object";
}
function hasMethod(value, key) {
  return isRecord(value) && typeof value[key] === "function";
}
function isHtmlObjectLike(node) {
  return isRecord(node) && typeof node.id === "string" && Array.isArray(node.children);
}
function isLiveHTMLNodeLike(node) {
  return hasMethod(node, "getId") && hasMethod(node, "getNodeConfigProp") && hasMethod(node, "getNumberAttribute");
}

// editor/ui-editor-ui/src/app/tools/utils/MenuUtils.ts
var MenuUtils = class {
  static getMenuItemNodeAlightType(menuItem) {
    let hasBrNode;
    let hasTextNode;
    let hasImageNode;
    let textNodeIsFirst;
    if (isLiveHTMLNodeLike(menuItem)) {
      const children = menuItem.getChildren();
      hasBrNode = !!menuItem.findOne(q.select.descendants().tag("BR" /* BR */).end());
      hasTextNode = !!menuItem.findOne(QUERY_HTML_NODE_TEXT_NODE_SELECTOR);
      hasImageNode = !!menuItem.findOne(IMG_SELECTOR);
      textNodeIsFirst = children.findIndex((c) => c.getType() === "text") === 0;
    } else if (isHtmlObjectLike(menuItem)) {
      hasBrNode = !!menuItem.children.find((item) => item.tag === "BR" /* BR */);
      hasTextNode = !!menuItem.children.find((item) => item.type === 3 /* TEXT_NODE */);
      hasImageNode = !!menuItem.children.find((item) => item.tag === "IMG" /* IMG */);
      textNodeIsFirst = menuItem.children.findIndex((item) => item.type === 3 /* TEXT_NODE */) === 0;
    } else {
      return "left" /* left */;
    }
    if (hasBrNode && hasTextNode && hasImageNode) {
      return "center" /* center */;
    } else if (textNodeIsFirst) {
      return "right" /* right */;
    } else {
      return "left" /* left */;
    }
  }
};

// editor/ui-editor-common/node-config/MenuTypeConfigMigration.ts
var MenuTypeConfigMigration = class _MenuTypeConfigMigration {
  static {
    this.menuClassTypeMap = {
      "links": "links" /* LINKS */,
      "images": "icons" /* ICONS */,
      "links-images-top": "linksWithIcons" /* LINKS_WITH_ICONS */,
      "links-images-left": "linksWithIcons" /* LINKS_WITH_ICONS */,
      "links-images-right": "linksWithIcons" /* LINKS_WITH_ICONS */
    };
  }
  static {
    this.classByAlign = {
      ["left" /* left */]: "links-images-left",
      ["center" /* center */]: "links-images-top",
      ["right" /* right */]: "links-images-right"
    };
  }
  migrateFromOldToNew(htmlObject) {
    if (htmlObject.type === 1 /* ELEMENT_NODE */) {
      const attributes = htmlObject.attributes;
      if (!attributes) {
        return;
      }
      const classes = (attributes?.class || "").split(" ").filter((v) => !!v);
      if (!classes.length) {
        return;
      }
      Object.keys(_MenuTypeConfigMigration.menuClassTypeMap).forEach((className) => {
        if (classes.indexOf(className) !== -1) {
          const menuItems = NodeUtils.find(htmlObject, (n) => n.tag === DefaultBlock.BLOCK_MENU_ITEM);
          const isLinks = menuItems.every((v) => v.children.every((m) => m.children.every((e) => e.tag !== "IMG" /* IMG */)));
          const isIcons = menuItems.every((v) => v.children.every((m) => m.children.every((e) => e.tag == "IMG" /* IMG */)));
          const isLinksAndIcons = menuItems.every((v) => {
            const imgTag = NodeUtils.find(v, (el) => el.tag == "IMG" /* IMG */);
            const textNode = NodeUtils.find(v, (el) => el.type == 3 /* TEXT_NODE */);
            return imgTag.length > 0 && textNode.length > 0;
          });
          const config = ensureConfig(htmlObject);
          config["MENU_COMMON_ITEMS_TYPE" /* MENU_COMMON_ITEMS_TYPE */] = _MenuTypeConfigMigration.menuClassTypeMap[className];
          config["MENU_COMMON_TYPE" /* MENU_COMMON_TYPE */] = isLinks || isIcons || isLinksAndIcons;
        }
      });
      const newClas = classes.filter((cls) => !_MenuTypeConfigMigration.menuClassTypeMap[cls]).join(" ").trim();
      newClas ? attributes.class = newClas : delete attributes.class;
    }
  }
  migrateFromNewToOld(htmlObject) {
    if (!htmlObject.config) {
      return;
    }
    const menuType = htmlObject.config["MENU_COMMON_ITEMS_TYPE" /* MENU_COMMON_ITEMS_TYPE */];
    if (!menuType) {
      return;
    }
    const attributes = ensureAttributes(htmlObject);
    attributes.class = [attributes.class || "", this.getClassByType(menuType, htmlObject)].join(" ").trim();
  }
  getClassByType(menuType, htmlObject) {
    switch (menuType) {
      case "links" /* LINKS */: {
        return "links";
      }
      case "icons" /* ICONS */: {
        return "images";
      }
      case "linksWithIcons" /* LINKS_WITH_ICONS */: {
        if (!htmlObject.children?.length) {
          return "";
        }
        const menuLinkElement = NodeUtils.findFirst(htmlObject, (node) => node["tag"] === "A" /* A */);
        if (!menuLinkElement) {
          return "";
        }
        const alignType = MenuUtils.getMenuItemNodeAlightType(menuLinkElement);
        return _MenuTypeConfigMigration.classByAlign[alignType];
      }
    }
    return "";
  }
};

// editor/ui-editor-common/node-config/EmptyImageConfigMigration.ts
var EmptyImageConfigMigration = class extends ClassConfigMigration {
  constructor() {
    super("IMG_EMPTY" /* IMG_EMPTY */, "esdev-empty-img");
  }
  migrateFromOldToNew(htmlObject) {
    super.migrateFromOldToNew(htmlObject);
    if (htmlObject?.config?.IMG_EMPTY && htmlObject?.attributes?.style) {
      let style = htmlObject.attributes.style;
      style = style.replace(/display:\snone;/, "");
      htmlObject.attributes.style = style;
    }
  }
};

// editor/ui-editor-common/node-config/ButtonPaddingStyleMigration.ts
var BUTTON_CLASS_NAME = "es-button";
var ButtonPaddingStyleMigration = class {
  migrateFromOldToNew(htmlObject) {
    const attributes = htmlObject.attributes;
    const classes = (attributes?.class || "").split(" ");
    if (!classes.length || classes.indexOf(BUTTON_CLASS_NAME) === -1) {
      return;
    }
    if (attributes?.style) {
      attributes.style = attributes.style.replace("border-width:", "padding:");
    }
  }
  migrateFromNewToOld(_htmlObject) {
  }
};

// editor/ui-editor-common/tools/node-utils/SocialUtils.ts
var SocialUtils = class _SocialUtils {
  static getIconStyleBySrc(src) {
    const test = src.match(/\/(social-icons|other-icons|messenger-icons)\/([^/]*)/);
    const socStyle = test && test[2];
    if (socStyle && SOCIAL_NETWORK_STYLES.includes(socStyle)) {
      return socStyle;
    }
    const alias = socStyle && SOCIAL_NETWORK_ALIASES[socStyle];
    if (socStyle && SOCIAL_NETWORK_STYLES.includes(alias)) {
      return alias;
    }
    return "custom" /* custom */;
  }
  static getSocialIconsStyleFromBlock(htmlObject) {
    if (htmlObject.tag !== "BLOCK_SOCIAL") {
      return void 0;
    }
    const imgs = NodeUtils.find(htmlObject, (n) => n.tag === "IMG" /* IMG */).filter((icon) => typeof icon.attributes?.src === "string");
    for (const img of imgs) {
      const src = img.attributes?.src;
      if (!src) {
        continue;
      }
      const iconStyle = _SocialUtils.getIconStyleBySrc(src);
      if (iconStyle && iconStyle !== "custom" /* custom */) {
        return iconStyle;
      }
    }
    return "custom" /* custom */;
  }
  static getIconTypeBySrc(src) {
    const style = this.getIconStyleBySrc(src);
    if (style === "custom" /* custom */) {
      return null;
    }
    for (const iconType in SOCIAL_ICONS_DATA) {
      if (src.indexOf(SOCIAL_ICONS_DATA[iconType].icons[style]) !== -1) {
        return SocialNetworkType3[Number(iconType)];
      }
    }
    return null;
  }
};

// editor/ui-editor-common/node-config/SocialTypeMigration.ts
var SocialTypeMigration = class {
  constructor(config, attribute) {
    this.config = config;
    this.attribute = attribute;
  }
  migrateFromOldToNew(htmlObject) {
    if (htmlObject.tag !== "BLOCK_SOCIAL") {
      return;
    }
    const cells = NodeUtils.find(htmlObject, (n) => n.tag === "TD" /* TD */);
    cells.forEach((cell) => {
      const imgNode = NodeUtils.findFirst(cell, (n) => n.tag === "IMG" /* IMG */);
      const src = imgNode?.attributes?.src;
      if (!src) {
        return;
      }
      const cellAttrValue = cell.attributes?.["esd-tmp-icon-type"] ?? SocialUtils.getIconTypeBySrc(src);
      if (cellAttrValue !== null && cellAttrValue !== void 0) {
        ensureConfig(cell)["type" /* SOCIAL_TYPE */] = cellAttrValue;
      }
      if (cell.attributes) {
        delete cell.attributes["esd-tmp-icon-type"];
      }
    });
  }
  migrateFromNewToOld(htmlObject) {
    if (htmlObject.tag !== "BLOCK_SOCIAL") {
      return;
    }
    const cells = NodeUtils.find(htmlObject, (n) => n.tag === "TD" /* TD */);
    cells.forEach((cell) => {
      const cellConfigValue = cell.config?.[this.config];
      if (!cellConfigValue || !isAttributeValue(cellConfigValue)) {
        return;
      }
      ensureAttributes(cell)[this.attribute] = cellConfigValue;
    });
  }
};

// editor/ui-editor-common/node-config/SynchronizedModuleConfigMigration.ts
var ESD_SYNCHRONIZABLE_MODULE = "esd-synchronizable-module";
var ESD_SYNCHRONIZABLE_MODULE_DISABLED = "esd-disabled-synchronizable-module";
var SynchronizedModuleConfigMigration = class {
  migrateFromOldToNew(htmlObject) {
    if (!htmlObject?.attributes?.["esd-custom-block-id"] && !htmlObject.config?.MODULE_ID) {
      return;
    }
    const classes = (htmlObject.attributes?.class || "").split(" ");
    if (!classes.length) {
      return;
    }
    const setConfigByClass = (className, configValue) => {
      if (classes.indexOf(className) !== -1) {
        ensureConfig(htmlObject).SYNCHRONIZABLE_MODULE = configValue;
        this.removeClassName(htmlObject, className);
      }
    };
    setConfigByClass(ESD_SYNCHRONIZABLE_MODULE, "ON_WITHOUT_CHANGES" /* ON_WITHOUT_CHANGES */);
    setConfigByClass(ESD_SYNCHRONIZABLE_MODULE_DISABLED, "ON_WITH_CHANGES" /* ON_WITH_CHANGES */);
  }
  migrateFromNewToOld(htmlObject) {
    if (htmlObject.config?.SYNCHRONIZABLE_MODULE === "ON_WITHOUT_CHANGES" /* ON_WITHOUT_CHANGES */) {
      this.setClassName(htmlObject, "esd-synchronizable-module");
    }
    if (htmlObject.config?.SYNCHRONIZABLE_MODULE === "ON_WITH_CHANGES" /* ON_WITH_CHANGES */) {
      this.setClassName(htmlObject, "esd-disabled-synchronizable-module");
    }
  }
  setClassName(htmlObject, className) {
    const attributes = ensureAttributes(htmlObject);
    if (!attributes.class) {
      attributes.class = className;
      return;
    }
    attributes.class = "".concat(attributes.class, " ").concat(className);
  }
  removeClassName(htmlObject, className) {
    const attributes = htmlObject.attributes;
    const classes = (attributes?.class || "").split(" ");
    const newClas = classes.filter((clazz) => clazz !== className).join(" ").trim();
    if (attributes) {
      newClas ? attributes.class = newClas : delete attributes.class;
    }
  }
};

// editor/ui-editor-common/node-config/SocialIconsPaddingMigration.ts
var SocialIconsPaddingMigration = class {
  constructor(config, attribute) {
    this.config = config;
    this.attribute = attribute;
  }
  migrateFromOldToNew(htmlObject) {
    if (htmlObject.tag !== "BLOCK_SOCIAL") {
      return;
    }
    const cells = NodeUtils.find(htmlObject, (n) => n.tag === "TD" /* TD */);
    if (htmlObject.attributes) {
      delete htmlObject.attributes[this.attribute];
    }
    const config = ensureConfig(htmlObject);
    if (cells.length <= 1) {
      config[this.config] = 0;
      return;
    }
    const firstIcon = cells[0];
    const paddingClassNameDesktop = firstIcon?.attributes?.class?.split(/\s+/)?.filter((name) => /es-p[0-9]*r/g.test(name)) || [];
    config["d-indent" /* SOCIAL_D_INDENT */] = this.parseNumberPadding(paddingClassNameDesktop[0]);
    const paddingClassNameMobile = firstIcon?.attributes?.class?.split(/\s+/)?.filter((name) => /es-m-p[0-9]*r/g.test(name)) || [];
    config["m-indent" /* SOCIAL_M_INDENT */] = this.parseNumberPadding(paddingClassNameMobile[0]);
  }
  migrateFromNewToOld(htmlObject) {
    if (htmlObject.tag !== "BLOCK_SOCIAL") {
      return;
    }
    const configValue = htmlObject.config?.[this.config];
    if (typeof configValue !== "number" || !Number.isInteger(configValue)) {
      return;
    }
    ensureAttributes(htmlObject)[this.attribute] = configValue;
  }
  parseNumberPadding(name) {
    const padding = name?.match(/\d+/)?.[0];
    return padding && parseInt(padding, 10) || 0;
  }
};

// editor/ui-editor-common/node-config/MimeTypeConfigMigration.ts
var HTML_ONLY = "es-visible-simple-html-only";
var AMP_HTML_ONLY = "es-visible-amp-html-only";
var BLOCKS_CLASSES_MAP = {
  "container": {
    ["HTML" /* HTML */]: "es-container-visible-simple-html-only",
    ["AMP_HTML" /* AMP_HTML */]: "es-container-visible-amp-html-only"
  },
  "structure": {
    ["HTML" /* HTML */]: "es-struct-html",
    ["AMP_HTML" /* AMP_HTML */]: "es-struct-amp"
  },
  "stripe": {
    ["HTML" /* HTML */]: "es-stripe-html",
    ["AMP_HTML" /* AMP_HTML */]: "es-stripe-amp"
  }
};
var MimeTypeConfigMigration = class {
  migrateFromOldToNew(htmlObject) {
    const classes = (htmlObject.attributes?.class || "").split(" ");
    if (!classes.length) {
      return;
    }
    const setConfigByClass = (className, configValue, forChild = false) => {
      if (classes.indexOf(className) !== -1) {
        let node;
        if (forChild) {
          node = htmlObject.children?.length && htmlObject.children.find((n) => !!n.tag);
          !node && console.error("cant find node child for node", htmlObject);
        } else {
          node = htmlObject;
        }
        if (!node) {
          return;
        }
        node.config = node.config ? { ...node.config } : {};
        node.config.MIME_TYPE = configValue;
        this.removeClassName(htmlObject, className);
      }
    };
    if (htmlObject.tag === "TR" /* TR */) {
      setConfigByClass(HTML_ONLY, "HTML" /* HTML */, true);
      setConfigByClass(AMP_HTML_ONLY, "AMP_HTML" /* AMP_HTML */, true);
    }
    Object.keys(BLOCKS_CLASSES_MAP).forEach((block) => {
      if (htmlObject.tag?.toLowerCase() === block) {
        setConfigByClass(BLOCKS_CLASSES_MAP[block]["HTML" /* HTML */], "HTML" /* HTML */);
        setConfigByClass(BLOCKS_CLASSES_MAP[block]["AMP_HTML" /* AMP_HTML */], "AMP_HTML" /* AMP_HTML */);
      }
    });
  }
  migrateFromNewToOld(htmlObject) {
    this.setMimeTypeClassForTrFromChild(htmlObject);
    this.setMimeTypeForComplexBlock(htmlObject);
  }
  setMimeTypeForComplexBlock(htmlObject) {
    const mimeType = htmlObject.config?.MIME_TYPE;
    if (mimeType !== "HTML" /* HTML */ && mimeType !== "AMP_HTML" /* AMP_HTML */) {
      return;
    }
    Object.keys(BLOCKS_CLASSES_MAP).forEach((block) => {
      if (htmlObject.tag?.toLowerCase() === block) {
        this.setClassName(htmlObject, BLOCKS_CLASSES_MAP[block][mimeType]);
      }
    });
  }
  setMimeTypeClassForTrFromChild(htmlObject) {
    if (htmlObject.tag !== "TR" /* TR */) {
      return;
    }
    const childWithMimeType = htmlObject.children?.length && htmlObject.children.find((ch) => !!ch.config?.MIME_TYPE);
    if (!childWithMimeType) {
      return;
    }
    const childConfig = childWithMimeType.config;
    if (!childConfig) {
      return;
    }
    childConfig.MIME_TYPE === "HTML" /* HTML */ ? this.setClassName(htmlObject, HTML_ONLY) : this.setClassName(htmlObject, AMP_HTML_ONLY);
  }
  setClassName(htmlObject, className) {
    const attributes = ensureAttributes(htmlObject);
    if (!attributes.class) {
      attributes.class = className;
      return;
    }
    if (attributes.class.split(" ").includes(className)) {
      return;
    }
    attributes.class = "".concat(attributes.class, " ").concat(className);
  }
  removeClassName(htmlObject, className) {
    const attributes = htmlObject.attributes;
    const classes = (attributes?.class || "").split(" ");
    const newClas = classes.filter((clazz) => clazz !== className).join(" ").trim();
    if (attributes) {
      newClas ? attributes.class = newClas : delete attributes.class;
    }
  }
};

// editor/ui-editor-common/node-config/ModuleDisplayConditionMigration.ts
var STORED_CONDITION_ATTRIBUTE = "esd-stored-custom-display-condition";
var CONDITION_ATTRIBUTE = "esd-custom-display-condition";
var ModuleDisplayConditionMigration = class {
  migrateFromOldToNew(htmlObject) {
    if (!htmlObject?.config?.MODULE_ID) {
      return;
    }
    NodeUtils.find(htmlObject, (node) => !!node.attributes?.[STORED_CONDITION_ATTRIBUTE]).forEach((node) => {
      const html = node;
      const attributes = html.attributes;
      if (!attributes) {
        return;
      }
      const storedCondition = attributes[STORED_CONDITION_ATTRIBUTE];
      if (typeof storedCondition !== "string") {
        return;
      }
      ensureConfig(html)["DISPLAY_CONDITION" /* DISPLAY_CONDITION */] = JSON.parse(unescapeJSON(storedCondition));
      delete attributes[STORED_CONDITION_ATTRIBUTE];
      delete attributes[CONDITION_ATTRIBUTE];
    });
  }
  migrateFromNewToOld(htmlObject) {
    if (!htmlObject?.config?.MODULE_ID) {
      return;
    }
    NodeUtils.find(htmlObject, (node) => {
      const html = node;
      return !!(html.config && html.config["DISPLAY_CONDITION" /* DISPLAY_CONDITION */]);
    }).forEach((node) => {
      const html = node;
      const displayCondition = html.config?.["DISPLAY_CONDITION" /* DISPLAY_CONDITION */];
      if (!displayCondition || typeof displayCondition !== "object") {
        return;
      }
      const attributes = ensureAttributes(html);
      attributes[STORED_CONDITION_ATTRIBUTE] = escapeJSON(JSON.stringify(displayCondition));
      const id = "id" in displayCondition ? displayCondition.id : void 0;
      if (typeof id === "string" || typeof id === "number") {
        attributes[CONDITION_ATTRIBUTE] = id;
      }
    });
  }
};
function escapeJSON(unescaped) {
  return unescaped.replace(/"/g, "&quot;");
}
function unescapeJSON(escaped) {
  return escaped.replace(/&quot;/g, '"');
}

// editor/ui-editor-common/node-config/SmartBlockMigration.ts
var SMART_BLOCK_ATTRIBUTE = "esd-dynamic-block";
var SmartBlockMigration = class {
  constructor(attribute = SMART_BLOCK_ATTRIBUTE) {
    this.attribute = attribute;
  }
  migrateFromOldToNew(htmlObject) {
    if (!htmlObject.attributes) {
      return;
    }
    const attributes = htmlObject.attributes;
    Object.keys(attributes).filter((attributeName) => attributeName === SMART_BLOCK_ATTRIBUTE).forEach((attributeName) => {
      const attributeValue = attributes[attributeName];
      if (typeof attributeValue !== "string") {
        return;
      }
      try {
        ensureConfig(htmlObject)["SMART_BLOCK" /* SMART_BLOCK */] = JSON.parse(unescapeJSON(attributeValue));
      } catch (e) {
        console.error("Cannot get smart block config from attribute: ".concat(attributeName, ". Value: ").concat(attributeValue));
      }
      delete attributes[attributeName];
    });
  }
  migrateFromNewToOld(htmlObject) {
    const value = htmlObject?.config && htmlObject?.config["SMART_BLOCK" /* SMART_BLOCK */];
    if (!value) {
      return;
    }
    ensureAttributes(htmlObject)[this.attribute] = escapeJSON(JSON.stringify(value));
  }
};

// editor/ui-editor-common/node-config/NodeHiddenConfigMigration.ts
var NodeHiddenConfigMigration = class {
  migrateFromOldToNew(htmlObject) {
    const attributes = htmlObject.attributes;
    if (!attributes) {
      return;
    }
    const classes = (attributes?.class || "").split(" ");
    if (!classes.length) {
      return;
    }
    [
      ["esd-desk-hidden", "DESK_HIDDEN" /* DESK_HIDDEN */],
      ["esd-mobile-hidden", "MOBILE_HIDDEN" /* MOBILE_HIDDEN */]
    ].forEach(([className, config]) => {
      if (classes.indexOf(className) !== -1) {
        ensureConfig(htmlObject)[config] = true;
        const newClas = classes.filter((name) => name !== className).join(" ").trim();
        newClas ? attributes.class = newClas : delete attributes.class;
      }
    });
  }
  migrateFromNewToOld() {
  }
};

// editor/ui-editor-common/node-config/StructureGapConfigMigration.ts
var ESDEV_MSO_CLASS_TABLE = "esdev-mso-table";
var ESDEV_MSO_CLASS_TD = "esdev-mso-td";
var COMMENT_WIDTH_REGEXP = /.*?width="(\d*)"/;
var StructureGapConfigMigration = class {
  setConfig(htmlObject, configName, gap) {
    if (!htmlObject.config) {
      htmlObject.config = {};
    }
    htmlObject.config[configName] = gap;
  }
  setConfigByMsoIfNeeded(target) {
    let wasSetConfig = false;
    let deskTopGapConfig = 0;
    let mobileGapConfig;
    const msoTable = target.children.find((n) => {
      const classes = (n.attributes?.class || "").split(" ");
      return classes.includes(ESDEV_MSO_CLASS_TABLE);
    });
    if (msoTable) {
      const tbody = msoTable?.children?.find((n) => n.tag === "TBODY" /* TBODY */);
      const tr = tbody?.children?.find((n) => n.tag === "TR" /* TR */);
      const tds = tr?.children?.filter((n) => n.tag === "TD" /* TD */);
      const td = tds?.find((n) => {
        const classes = (n.attributes?.class || "").split(" ");
        return !classes.includes(ESDEV_MSO_CLASS_TD);
      });
      if (td) {
        deskTopGapConfig = (td?.attributes && parseInt(td.attributes["width"], 10)) ?? 0;
        this.setConfig(target, "GAP" /* GAP */, deskTopGapConfig);
      }
      wasSetConfig = true;
    }
    return { wasSetConfig };
  }
  setConfigByNoneMsoIfNeeded(target) {
    const comments = target.children.filter((n) => n.type === 8 /* COMMENT_NODE */);
    const [firstContainer] = NodeUtils.find(target, (n) => n.tag === "CONTAINER");
    const widths = comments?.reverse().map((n) => {
      const res = n.content ? COMMENT_WIDTH_REGEXP.exec(n.content) : null;
      return res ? res[1] : null;
    });
    const gapFromComment = widths?.find((width) => width !== null);
    gapFromComment && this.setConfig(target, "GAP" /* GAP */, parseInt(gapFromComment, 10));
    return {
      wasSetConfig: true
    };
  }
  migrateFromOldToNew(htmlObject) {
    if (htmlObject.tag !== "STRUCTURE") {
      return;
    }
    const { wasSetConfig } = this.setConfigByMsoIfNeeded(htmlObject);
    if (wasSetConfig) {
      return;
    }
    this.setConfigByNoneMsoIfNeeded(htmlObject);
  }
  migrateFromNewToOld(_htmlObject) {
  }
};

// editor/ui-editor-common/node-config/ConfigMigrations.ts
var NodeMigrations = class _NodeMigrations {
  static {
    this.migrationRules = [
      new SocialIconsPaddingMigration("d-indent" /* SOCIAL_D_INDENT */, "esd-icons-active-padding"),
      new SocialTypeMigration("type" /* SOCIAL_TYPE */, "esd-tmp-icon-type"),
      new AttributeConfigMigration("IMG_ORIGINAL_WIDTH" /* IMG_ORIGINAL_WIDTH */, "esd-img-orig-w"),
      new AttributeConfigMigration("IMG_PREV_WIDTH" /* IMG_PREV_WIDTH */, "esd-img-prev-w"),
      new AttributeConfigMigration("IMG_PREV_HEIGHT" /* IMG_PREV_HEIGHT */, "esd-img-prev-h"),
      new AttributeConfigMigration("VIDEO_ORIGIN_IMG" /* VIDEO_ORIGIN_IMG */, "esdev-video-origin"),
      new AttributeConfigMigration("VIDEO_ADDITIONAL_IMAGE" /* VIDEO_ADDITIONAL_IMAGE */, "video-img-additional"),
      new AttributeConfigMigration("VIDEO_PLAY_BTN_ACTIVE" /* VIDEO_PLAY_BTN_ACTIVE */, "esd-play-button-active"),
      new AttributeConfigMigration("EQUALIZATION_CONTAINERS" /* EQUALIZATION_CONTAINERS */, "esdev-eq"),
      new AttributeConfigMigration("MODULE_ID" /* MODULE_ID */, "esd-custom-block-id"),
      new AttributeConfigMigration("MODULE_CUSTOM_CSS" /* MODULE_CUSTOM_CSS */, "esd-custom-css"),
      new AttributeConfigMigration("MOBILE_GAP" /* MOBILE_GAP */, "esd-mobile-gap"),
      new ClassConfigMigration("FIT_TO_CONTAINER" /* FIT_TO_CONTAINER */, "esdev-stretch-width"),
      new ClassConfigMigration("VIDEO_EMPTY" /* VIDEO_EMPTY */, "esdev-empty-video"),
      new ClassConfigMigration("MOBILE_HIDDEN" /* MOBILE_HIDDEN */, "es-mobile-hidden"),
      new ClassConfigMigration("DESK_HIDDEN" /* DESK_HIDDEN */, "es-desk-hidden"),
      new ClassConfigMigration("MESSAGE_INFO_AREA" /* MESSAGE_INFO_AREA */, "es-info-area"),
      new ClassConfigMigration("MENU_DESK_HIDDEN" /* MENU_DESK_HIDDEN */, "es-desk-menu-hidden"),
      new StructureGapConfigMigration(),
      new MenuTypeConfigMigration(),
      new NodeHiddenConfigMigration(),
      new EmptyImageConfigMigration(),
      new BannerConfigMigration(),
      new ButtonPaddingStyleMigration(),
      new SynchronizedModuleConfigMigration(),
      new MimeTypeConfigMigration(),
      new ModuleDisplayConditionMigration(),
      new SmartBlockMigration()
    ];
  }
  static migrateFromOldToNew(html) {
    _NodeMigrations.migrationRules.forEach((rule) => rule.migrateFromOldToNew(html));
  }
  static migrateFromNewToOld(html) {
    _NodeMigrations.migrationRules.forEach((rule) => rule.migrateFromNewToOld(html));
  }
};

// editor/ui-editor-ui/src/app/serdes/tree/html/html.ts
var import_escape2 = __toESM(require_escape());
var import_isObject = __toESM(require_isObject());

// editor/ui-editor-ui/src/app/serdes/tree/html/html-entity-source.ts
var import_escape = __toESM(require_escape());

// editor/ui-editor-ui/src/app/tools/utils/BackgroundGradientStyleSerializer.ts
var import_postcss_safe_parser = __toESM(require_safe_parse());

// editor/ui-editor-ui/src/app/serdes/tree/html/html.ts
var HTMLEntitiesNames = /* @__PURE__ */ new Map([
  [new RegExp("<", "g"), "&lt;"],
  [new RegExp(">", "g"), "&gt;"],
  [new RegExp("\xA0", "g"), "&nbsp;"]
]);

// editor/ui-editor-ui/src/app/core/block-operations-api/common/fonts.ts
var FONT_RESOURCE_IMPORT_METHODS = ["link", "import", "fontFace"];
function getFontResourceValidationIssues(resources) {
  const issues = [];
  const keys = /* @__PURE__ */ new Set();
  resources.forEach((resource, index) => {
    const key = clearFontValue(resource.fontFamily.trim());
    const add = (field, message) => {
      issues.push({ path: [index, field], message });
    };
    if (!key || /[;{}]/.test(resource.fontFamily)) {
      add("fontFamily", "Expected a nonempty CSS font-family value.");
    }
    if (keys.has(key)) {
      add("fontFamily", "Duplicate normalized font-family resource key.");
    }
    keys.add(key);
    if (resource.url !== void 0 && !isFontConnectionUrl(resource.url)) {
      add("url", "Expected an absolute HTTP/HTTPS URL.");
    }
    if (resource.importMethod === "fontFace") {
      const error = getFontFaceCssDetails(resource.css).error;
      if (error) {
        add("css", error);
      }
    }
  });
  return issues;
}

// editor/ui-editor-ui/src/app/core/block-operations-api/common/social-block/types.ts
function hasSocialNetworkIcons(type) {
  const protoType = SocialNetworkType2[type];
  return typeof protoType === "number" && SOCIAL_ICONS_DATA[protoType] !== void 0;
}
var SOCIAL_NETWORK_TYPES = Object.values(SocialNetworkType).filter(hasSocialNetworkIcons);
var SOCIAL_ICON_STYLES = [
  "custom",
  "logoColored",
  "logoBlack",
  "logoGray",
  "logoWhite",
  "circleColored",
  "circleColoredBordered",
  "roundedColored",
  "roundedColoredBordered",
  "squareColored",
  "squareColoredBordered",
  "circleBlack",
  "circleBlackBordered",
  "roundedBlack",
  "roundedBlackBordered",
  "squareBlack",
  "squareBlackBordered",
  "circleGray",
  "circleGrayBordered",
  "roundedGray",
  "roundedGrayBordered",
  "squareGray",
  "squareGrayBordered",
  "circleWhite",
  "circleWhiteBordered",
  "roundedWhite",
  "roundedWhiteBordered",
  "squareWhite",
  "squareWhiteBordered"
];
var SOCIAL_ICON_STYLE_TO_INTERNAL = {
  custom: "custom" /* custom */,
  logoColored: "logo-colored" /* logoColored */,
  logoBlack: "logo-black" /* logoBlack */,
  logoGray: "logo-gray" /* logoGray */,
  logoWhite: "logo-white" /* logoWhite */,
  circleColored: "circle-colored" /* circleColored */,
  circleColoredBordered: "circle-colored-bordered" /* circleColoredBordered */,
  roundedColored: "rounded-colored" /* roundedColored */,
  roundedColoredBordered: "rounded-colored-bordered" /* roundedColoredBordered */,
  squareColored: "square-colored" /* squareColored */,
  squareColoredBordered: "square-colored-bordered" /* squareColoredBordered */,
  circleBlack: "circle-black" /* circleBlack */,
  circleBlackBordered: "circle-black-bordered" /* circleBlackBordered */,
  roundedBlack: "rounded-black" /* roundedBlack */,
  roundedBlackBordered: "rounded-black-bordered" /* roundedBlackBordered */,
  squareBlack: "square-black" /* squareBlack */,
  squareBlackBordered: "square-black-bordered" /* squareBlackBordered */,
  circleGray: "circle-gray" /* circleGray */,
  circleGrayBordered: "circle-gray-bordered" /* circleGrayBordered */,
  roundedGray: "rounded-gray" /* roundedGray */,
  roundedGrayBordered: "rounded-gray-bordered" /* roundedGrayBordered */,
  squareGray: "square-gray" /* squareGray */,
  squareGrayBordered: "square-gray-bordered" /* squareGrayBordered */,
  circleWhite: "circle-white" /* circleWhite */,
  circleWhiteBordered: "circle-white-bordered" /* circleWhiteBordered */,
  roundedWhite: "rounded-white" /* roundedWhite */,
  roundedWhiteBordered: "rounded-white-bordered" /* roundedWhiteBordered */,
  squareWhite: "square-white" /* squareWhite */,
  squareWhiteBordered: "square-white-bordered" /* squareWhiteBordered */
};
var INTERNAL_TO_SOCIAL_ICON_STYLE = Object.entries(SOCIAL_ICON_STYLE_TO_INTERNAL).reduce(
  (acc, [schemaValue, internalValue]) => ({
    ...acc,
    [internalValue]: schemaValue
  }),
  {}
);
var DEFAULT_SOCIAL_BLOCK_SIDE_VALUES = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
var DEFAULT_SOCIAL_BLOCK_SETTINGS = {
  networks: [],
  style: "logoColored",
  iconSize: 32,
  spaceBetweenIcons: {
    desktop: 10,
    mobile: 10
  },
  textCustomization: false,
  alignment: {
    desktop: "center",
    mobile: "center"
  },
  backgroundColor: "transparent",
  hideElement: "no",
  margins: {
    desktop: { ...DEFAULT_SOCIAL_BLOCK_SIDE_VALUES },
    mobile: { ...DEFAULT_SOCIAL_BLOCK_SIDE_VALUES }
  },
  includeInOutput: "both",
  anchorLinkName: ""
};

// editor/ui-editor-ui/src/app/core/block-operations-api/common/text-block-alignment.ts
var TEXT_BLOCK_ALIGNMENT_VALUES = ["left", "center", "right", "justify"];

// editor/ui-editor-ui/src/app/core/block-operations-api/document-metadata/types.ts
var DOCUMENT_METADATA_TEXT_MAX_LENGTH = 500;

// editor/ui-editor-ui/src/app/tools/utils/time-zones/time-zones.utils.ts
var DISPLAY_NAME_OVERRIDES = {
  "Europe/Kiev": "Europe/Kyiv",
  "Europe/Zaporozhye": "Europe/Zaporizhia"
};
function getSupportedTimeZoneNames(timeZones2) {
  if (!Array.isArray(timeZones2)) {
    return [];
  }
  return Array.from(new Set(timeZones2.flatMap((timeZone) => [
    timeZone.name,
    DISPLAY_NAME_OVERRIDES[timeZone.name] ?? timeZone.name
  ])));
}

// editor/ui-editor-ui/src/app/tools/utils/timer/timer-labels-language.constants.ts
var TIME_LANGUAGES = [
  { id: 1, locale: "en", label: "English" },
  { id: 9, locale: "pt", label: "Portugu\xEAs" },
  { id: 15, locale: "pl", label: "Polski" },
  { id: 6, locale: "fr", label: "Fran\xE7ais" },
  { id: 4, locale: "de", label: "Deutsch" },
  { id: 5, locale: "es", label: "Espa\xF1ol" },
  { id: 7, locale: "it", label: "Italiano" },
  { id: 8, locale: "sl", label: "Sloven\u0161\u010Dina" },
  { id: 10, locale: "no", label: "Norsk" },
  { id: 11, locale: "sv", label: "Svenska" },
  { id: 12, locale: "fi", label: "Suomi" },
  { id: 13, locale: "et", label: "Eestli" },
  { id: 14, locale: "lv", label: "Latvie\u0161u" },
  { id: 16, locale: "nl", label: "Nederlands" },
  { id: 17, locale: "cz", label: "\u010Ce\u0161tina" },
  { id: 18, locale: "tr", label: "T\xFCrk\xE7e" },
  { id: 19, locale: "ro", label: "Rom\xE2n\u0103" },
  { id: 20, locale: "vi", label: "Ti\u1EBFng Vi\u1EC7t" },
  { id: 21, locale: "zh", label: "\u5EE3\u5E9C\u8A71" },
  { id: 22, locale: "ms", label: "Bahasa Melayu" },
  { id: 23, locale: "id", label: "Bahasa Indonesia" },
  { id: 24, locale: "ar", label: "\u0627\u0644\u0639\u0631\u0628\u064A\u0629" },
  { id: 25, locale: "th", label: "\u0E44\u0E17\u0E22" },
  { id: 26, locale: "da", label: "Dansk" },
  { id: 27, locale: "sk", label: "Sloven\u010Dina" },
  { id: 28, locale: "bs", label: "Bosanski" },
  { id: 29, locale: "hr", label: "Hrvatski" },
  { id: 30, locale: "bg", label: "B\u0103lgarski" },
  { id: 31, locale: "hu", label: "Magyar" },
  { id: 32, locale: "sr", label: "Srpski" },
  { id: 33, locale: "lt", label: "Lietuvi\u0173" },
  { id: 34, locale: "el", label: "\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC" },
  { id: 35, locale: "ja", label: "\u65E5\u672C\u8A9E" },
  { id: 2, locale: "ru", label: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439" },
  { id: 36, locale: "he", label: "\u05E2\u05B4\u05D1\u05E8\u05B4\u05D9\u05EA" },
  { id: 37, locale: "ko", label: "\uD55C\uAD6D\uC778" },
  { id: 3, locale: "uk", label: "\u0423\u043A\u0440\u0430\u0457\u043D\u0441\u044C\u043A\u0430" }
].sort((f1, f2) => {
  if (f1.label < f2.label) {
    return -1;
  }
  if (f1.label > f2.label) {
    return 1;
  }
  return 0;
});
var TIMER_LABEL_LANGUAGE_LOCALES = TIME_LANGUAGES.map(({ locale }) => locale);

// editor/ui-editor-ui/src/app/tools/utils/timer/timer-font-family.utils.ts
var DEFAULT_TIMER_FONT_FAMILY = "arial,'helvetica neue',helvetica,sans-serif";
var TIMER_FONTS_WITH_NON_LINEAR_ID = [
  { currentId: 11, correctId: 11, fontName: "Arvo", fallbackId: 3 },
  { currentId: 12, correctId: 12, fontName: "Lato", fallbackId: 5 },
  { currentId: 15, correctId: 20, fontName: "Merriweather Sans", fallbackId: 5 },
  { currentId: 16, correctId: 15, fontName: "Noticia Text", fallbackId: 4 },
  { currentId: 17, correctId: 16, fontName: "Open Sans" },
  { currentId: 18, correctId: 17, fontName: "Playfair Display" },
  { currentId: 19, correctId: 18, fontName: "Roboto" },
  { currentId: 20, correctId: 19, fontName: "Source Sans Pro" }
];
function getCorrectTimerFontId(id) {
  return TIMER_FONTS_WITH_NON_LINEAR_ID.find((item) => item.currentId === id)?.correctId || id;
}
function getTimerFontFamilyEntries() {
  const standardFonts = DEFAULT_FONTS.find((category) => category.category === "STANDARD" /* STANDARD */)?.entries.filter((entry) => entry.value !== DEFAULT_SYSTEM_FONT) ?? [];
  const nonStandardFonts = DEFAULT_FONTS.find((category) => category.category === "NON_STANDARD" /* NON_STANDARD */)?.entries ?? [];
  return [...standardFonts, ...nonStandardFonts].map((entry, index) => {
    const id = entry.id ?? index + 1;
    return {
      name: entry.name,
      value: entry.value,
      id,
      timerFontId: getCorrectTimerFontId(id)
    };
  });
}
var TIMER_FONT_FAMILY_VALUES = getTimerFontFamilyEntries().map(({ value }) => value);

// editor/ui-editor-ui/src/app/services/api/editor-copilot-api/schema/email-template-color.schema.ts
function createEmailTemplateColorSchemas(colorMergeTagValues = /* @__PURE__ */ new Set()) {
  return {
    colorSchemaDisallowTransparent: external_exports.string().refine(
      (value) => normalizeOpaqueColor(value, colorMergeTagValues) !== void 0,
      { message: "Expected a valid non-transparent CSS color value." }
    ).describe("Valid CSS color value that does not allow transparency."),
    colorSchemaAllowTransparent: external_exports.string().refine(
      (value) => normalizeTransparentAllowedColor(value, colorMergeTagValues) !== void 0,
      { message: "Expected a valid CSS color value." }
    ).describe("Valid CSS color value that allows transparent values.")
  };
}
var { colorSchemaDisallowTransparent, colorSchemaAllowTransparent } = createEmailTemplateColorSchemas();

// editor/ui-editor-ui/src/app/services/api/editor-copilot-api/schema/value-families.ts
var identity = (value) => value;
function cloneBackgroundImageValue(value) {
  if (!value) {
    return void 0;
  }
  return {
    path: value.path,
    repeat: value.repeat,
    x: value.x,
    y: value.y,
    sizeX: value.sizeX,
    sizeY: value.sizeY
  };
}
function cloneResponsiveValue(value, cloneItem = identity) {
  return {
    desktop: cloneItem(value.desktop),
    mobile: cloneItem(value.mobile)
  };
}
function cloneTextStyleValue(value) {
  return {
    bold: value.bold,
    italic: value.italic
  };
}
function cloneRequiredSideValues(value, cloneItem = identity) {
  return {
    top: cloneItem(value.top),
    right: cloneItem(value.right),
    bottom: cloneItem(value.bottom),
    left: cloneItem(value.left)
  };
}
function cloneBorderSideValue(value) {
  if (!value) {
    return void 0;
  }
  return {
    width: value.width,
    color: value.color
  };
}
function cloneBorderValue(value) {
  return {
    top: cloneBorderSideValue(value.top),
    right: cloneBorderSideValue(value.right),
    bottom: cloneBorderSideValue(value.bottom),
    left: cloneBorderSideValue(value.left),
    style: value.style
  };
}

// editor/ui-editor-ui/src/app/services/api/editor-copilot-api/schema/email-template.schema.ts
var fontFamilySchema = external_exports.string().min(1, "Font family cannot be empty.").refine((value) => value.trim().length > 0, {
  message: "Font family cannot be blank."
});
var fullSideValuesSchema = external_exports.object({
  top: external_exports.number(),
  right: external_exports.number(),
  bottom: external_exports.number(),
  left: external_exports.number()
}).strict().describe("Numeric values for top, right, bottom, and left sides.");
var buttonSideValueSchema = external_exports.number().min(0).max(1e3);
var buttonSideValuesSchema = external_exports.object({
  top: buttonSideValueSchema,
  right: buttonSideValueSchema,
  bottom: buttonSideValueSchema,
  left: buttonSideValueSchema
}).strict().describe("Button side values constrained to the UI counter range.");
var buttonResponsiveSidesSchema = external_exports.object({
  desktop: buttonSideValuesSchema,
  mobile: buttonSideValuesSchema
}).strict().describe("Button responsive side values for desktop and mobile.");
var textBlockSideValueSchema = external_exports.number().min(0).max(1e3);
var textBlockSideValuesSchema = external_exports.object({
  top: textBlockSideValueSchema,
  right: textBlockSideValueSchema,
  bottom: textBlockSideValueSchema,
  left: textBlockSideValueSchema
}).strict().describe("Text block side values constrained to the UI counter range.");
var textBlockResponsiveSidesSchema = external_exports.object({
  desktop: textBlockSideValuesSchema,
  mobile: textBlockSideValuesSchema
}).strict().describe("Text block responsive side values for desktop and mobile.");
var fullResponsiveSidesSchema = external_exports.object({
  desktop: fullSideValuesSchema,
  mobile: fullSideValuesSchema
}).strict().describe("Responsive top, right, bottom, and left side values for desktop and mobile.");
var responsiveNumberSchema = external_exports.object({
  desktop: external_exports.number(),
  mobile: external_exports.number()
}).strict().describe("Responsive numeric values for desktop and mobile.");
var borderWidthSchema = external_exports.object({
  top: external_exports.number().min(0).max(100),
  right: external_exports.number().min(0).max(100),
  bottom: external_exports.number().min(0).max(100),
  left: external_exports.number().min(0).max(100)
}).strict().describe("Border widths for top, right, bottom, and left sides.");
var borderStyleValueSchema = external_exports.enum(["solid", "dashed", "dotted"]);
var borderStyleSchema = external_exports.object({
  top: borderStyleValueSchema,
  right: borderStyleValueSchema,
  bottom: borderStyleValueSchema,
  left: borderStyleValueSchema
}).strict().describe("Border styles for top, right, bottom, and left sides.");
var messageAreaSchema = external_exports.enum(["header", "content", "footer", "infoArea"]);
var messageAlignmentSchema = external_exports.enum(["left", "center", "right"]);
var textAlignmentValueSchema = external_exports.enum(["left", "center", "right"]);
var textBlockAlignmentValueSchema = external_exports.enum(TEXT_BLOCK_ALIGNMENT_VALUES);
var textBlockAlignmentSchema = external_exports.object({
  desktop: textBlockAlignmentValueSchema,
  mobile: textBlockAlignmentValueSchema
}).strict().describe("Whole-block responsive Text alignment settings.");
var messageContentWidthSchema = external_exports.number().int().min(320).max(900);
var spacingUnitSchema = external_exports.enum(["px", "em"]);
var spacingValueSchema = external_exports.object({
  value: external_exports.number(),
  unit: spacingUnitSchema
}).strict().describe("Spacing value with a numeric value and unit.");
var lineHeightSchema = external_exports.object({
  desktop: external_exports.number().min(0).max(5),
  mobile: external_exports.number().min(0).max(5)
}).strict().describe("Responsive line height values for desktop and mobile.");
var paragraphBottomSpaceSchema = external_exports.object({
  desktop: external_exports.number().min(0).max(100),
  mobile: external_exports.number().min(0).max(100)
}).strict().describe("Responsive paragraph bottom spacing values for desktop and mobile.");
var fontSizeSchema = external_exports.object({
  desktop: external_exports.number().min(8).max(72),
  mobile: external_exports.number().min(8).max(72)
}).strict().describe("Responsive font sizes for desktop and mobile.");
var fontWeightSchema = external_exports.number().int().min(100).max(900).multipleOf(100).describe("Numeric font weight in 100-step increments.");
var responsiveBooleanSchema = external_exports.object({
  desktop: external_exports.boolean(),
  mobile: external_exports.boolean()
}).strict().describe("Responsive boolean values for desktop and mobile.");
var imageLinkTypeSchema = external_exports.enum([
  "site",
  "anchor",
  "email",
  "phone",
  "file",
  "sms",
  "telegram",
  "viber",
  "other"
]).describe("Image link selector type.");
var imageLinkSchema = external_exports.object({
  type: imageLinkTypeSchema,
  href: external_exports.string().min(1, "Image link href cannot be empty.")
}).strict().superRefine((value, context) => validateLinkSettings(value, context, "Image link"));
var socialNetworkLinkSchema = external_exports.object({
  type: imageLinkTypeSchema,
  href: external_exports.string().min(1, "Social network link href cannot be empty.")
}).strict().superRefine((value, context) => validateLinkSettings(value, context, "Social network link", {
  allowEmptyAnchor: true
}));
function validateLinkSettings(value, context, label, options = {}) {
  const href = value.href.trim();
  const hasValueAfterPrefix = (prefixLength) => href.slice(prefixLength).trim().length > 0;
  const addHrefIssue = (message) => {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["href"],
      message
    });
  };
  if (href !== value.href) {
    addHrefIssue("".concat(label, " href must not contain leading or trailing spaces."));
  }
  if (!href) {
    addHrefIssue("".concat(label, " href cannot be blank."));
    return;
  }
  switch (value.type) {
    case "site":
      if (!/^https?:\/\//i.test(href)) {
        addHrefIssue("Site ".concat(label.toLowerCase(), "s must start with http:// or https://."));
      } else if (!hasValueAfterPrefix(href.toLowerCase().startsWith("https://") ? "https://".length : "http://".length)) {
        addHrefIssue("Site ".concat(label.toLowerCase(), "s must include a value after the protocol."));
      }
      break;
    case "anchor":
      if (!href.startsWith("#")) {
        addHrefIssue("Anchor ".concat(label.toLowerCase(), "s must start with #."));
      } else if (!options.allowEmptyAnchor && !hasValueAfterPrefix("#".length)) {
        addHrefIssue("Anchor ".concat(label.toLowerCase(), "s must include a value after #."));
      }
      break;
    case "email":
      if (!href.startsWith("mailto:")) {
        addHrefIssue("Email ".concat(label.toLowerCase(), "s must start with mailto:."));
      } else if (!hasValueAfterPrefix("mailto:".length)) {
        addHrefIssue("Email ".concat(label.toLowerCase(), "s must include a value after mailto:."));
      }
      break;
    case "phone":
      if (!href.startsWith("tel:")) {
        addHrefIssue("Phone ".concat(label.toLowerCase(), "s must start with tel:."));
      } else if (!hasValueAfterPrefix("tel:".length)) {
        addHrefIssue("Phone ".concat(label.toLowerCase(), "s must include a value after tel:."));
      }
      break;
    case "file":
      if (!/^ftps?:\/\//i.test(href)) {
        addHrefIssue("File ".concat(label.toLowerCase(), "s must start with ftp:// or ftps://."));
      } else if (!hasValueAfterPrefix(href.toLowerCase().startsWith("ftps://") ? "ftps://".length : "ftp://".length)) {
        addHrefIssue("File ".concat(label.toLowerCase(), "s must include a value after the protocol."));
      }
      break;
    case "sms":
      if (!href.startsWith("sms:")) {
        addHrefIssue("SMS ".concat(label.toLowerCase(), "s must start with sms:."));
      } else if (!hasValueAfterPrefix("sms:".length)) {
        addHrefIssue("SMS ".concat(label.toLowerCase(), "s must include a value after sms:."));
      }
      break;
    case "telegram":
      if (!href.startsWith("tg://")) {
        addHrefIssue("Telegram ".concat(label.toLowerCase(), "s must start with tg://."));
      } else if (!hasValueAfterPrefix("tg://".length)) {
        addHrefIssue("Telegram ".concat(label.toLowerCase(), "s must include a value after tg://."));
      }
      break;
    case "viber":
      if (!href.startsWith("viber:")) {
        addHrefIssue("Viber ".concat(label.toLowerCase(), "s must start with viber:."));
      } else if (!hasValueAfterPrefix("viber:".length)) {
        addHrefIssue("Viber ".concat(label.toLowerCase(), "s must include a value after viber:."));
      }
      break;
    case "other":
      break;
  }
}
var hideElementSchema = external_exports.enum(["no", "desktop", "mobile"]).describe("Hide element mode: no, desktop, or mobile.");
var outputInclusionSchema = external_exports.enum(["both", "html", "ampHtml"]).describe("Include in email output formats: both, html, or ampHtml.");
var buttonsTextStyleSchema = external_exports.object({
  bold: external_exports.boolean(),
  italic: external_exports.boolean()
}).strict().describe("Button text style settings.");
var imageAltTextSchema = external_exports.object({
  text: external_exports.string().max(IMAGE_MAX_ALT_TEXT_LENGTH),
  addToTitle: external_exports.boolean()
}).strict().describe("Alternate text settings for an image block.");
var imageSizeValueSchema = external_exports.object({
  mode: external_exports.enum(["width", "height"]),
  px: external_exports.number().int().min(3)
}).strict().describe("Single responsive image size value.");
var imageSizeSchema = external_exports.object({
  desktop: imageSizeValueSchema,
  mobile: imageSizeValueSchema
}).strict().describe("Responsive image size settings.");
var imageAlignmentSchema = external_exports.object({
  desktop: textAlignmentValueSchema,
  mobile: textAlignmentValueSchema
}).strict().describe("Responsive image alignment settings.");
var spacerModeSchema = external_exports.enum(["line", "space"]);
var spacerWidthUnitSchema = external_exports.enum(["percent", "px"]);
var spacerWidthValueSchema = external_exports.object({
  value: external_exports.number().int().min(5).max(1e3),
  unit: spacerWidthUnitSchema
}).strict().superRefine((value, context) => {
  if (value.unit === "percent" && value.value > 100) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["value"],
      message: "Spacer percent width must be between 5 and 100."
    });
  }
}).describe("Spacer line width value.");
var spacerWidthSchema = external_exports.object({
  desktop: spacerWidthValueSchema.superRefine((value, context) => {
    if (value.unit === "px" && value.value > 580) {
      context.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: ["value"],
        message: "Desktop spacer line width in px must be between 5 and 580."
      });
    }
  }),
  mobile: spacerWidthValueSchema.superRefine((value, context) => {
    if (value.unit === "px" && value.value > 355) {
      context.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: ["value"],
        message: "Mobile spacer line width in px must be between 5 and 355."
      });
    }
  })
}).strict().describe("Responsive spacer line width settings.");
var spacerHeightSchema = external_exports.object({
  desktop: external_exports.number().int().min(5).max(1e3),
  mobile: external_exports.number().int().min(5).max(1e3)
}).strict().describe("Responsive spacer space height settings.");
var spacerAlignmentSchema = external_exports.object({
  desktop: textAlignmentValueSchema,
  mobile: textAlignmentValueSchema
}).strict().describe("Responsive spacer line alignment settings.");
var menuItemTypeSchema = external_exports.enum(["links", "icons", "linksWithIcons"]).describe("Menu item type: links, icons, or links with icons.");
var menuLinkTypeSchema = external_exports.enum(["site", "email", "phone", "anchor"]).describe("Menu item link selector type.");
var menuLinkSchema = external_exports.object({
  type: menuLinkTypeSchema,
  value: external_exports.string()
}).strict().superRefine((value, context) => {
  const linkValue = value.value;
  const trimmedValue = linkValue.trim();
  const hasValueAfterPrefix = (prefixLength) => trimmedValue.slice(prefixLength).trim().length > 0;
  const addValueIssue = (message) => {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["value"],
      message
    });
  };
  if (linkValue !== trimmedValue) {
    addValueIssue("Menu item link value must not contain leading or trailing spaces.");
  }
  if (!trimmedValue) {
    if (value.type !== "site") {
      addValueIssue("Blank menu item links are only allowed for site links.");
    }
    return;
  }
  switch (value.type) {
    case "site":
      if (!/^https?:\/\//i.test(trimmedValue)) {
        addValueIssue("Site menu item links must start with http:// or https://.");
      } else if (!hasValueAfterPrefix(trimmedValue.toLowerCase().startsWith("https://") ? "https://".length : "http://".length)) {
        addValueIssue("Site menu item links must include a value after the protocol.");
      }
      break;
    case "anchor":
      if (!trimmedValue.startsWith("#")) {
        addValueIssue("Anchor menu item links must start with #.");
      } else if (!hasValueAfterPrefix("#".length)) {
        addValueIssue("Anchor menu item links must include a value after #.");
      }
      break;
    case "email":
      if (!trimmedValue.startsWith("mailto:")) {
        addValueIssue("Email menu item links must start with mailto:.");
      } else if (!hasValueAfterPrefix("mailto:".length)) {
        addValueIssue("Email menu item links must include a value after mailto:.");
      }
      break;
    case "phone":
      if (!trimmedValue.startsWith("tel:")) {
        addValueIssue("Phone menu item links must start with tel:.");
      } else if (!hasValueAfterPrefix("tel:".length)) {
        addValueIssue("Phone menu item links must include a value after tel:.");
      }
      break;
  }
}).describe("Menu item link type and URL/value.");
var menuImageSizeSchema = external_exports.object({
  mode: external_exports.enum(["width", "height"]),
  px: external_exports.number().int().min(3).max(100)
}).strict().describe("Menu item image size settings.");
var menuItemImageSchema = external_exports.object({
  src: external_exports.string().min(1),
  size: menuImageSizeSchema,
  alignment: external_exports.enum(["left", "center", "right"]),
  indent: external_exports.number().int().min(0).max(1e3),
  altText: external_exports.string().max(IMAGE_MAX_ALT_TEXT_LENGTH)
}).strict().describe("Menu item image settings.");
var menuBlockItemTypeSchema = external_exports.discriminatedUnion("mode", [
  external_exports.object({
    mode: external_exports.literal("shared"),
    type: menuItemTypeSchema
  }).strict(),
  external_exports.object({
    mode: external_exports.literal("perItem")
  }).strict()
]).describe("Menu item type mode.");
var menuSidesValueSchema = external_exports.number().min(0).max(1e3);
var menuSideValuesSchema = external_exports.object({
  top: menuSidesValueSchema,
  right: menuSidesValueSchema,
  bottom: menuSidesValueSchema,
  left: menuSidesValueSchema
}).strict().describe("Menu side values constrained to the UI counter range.");
var menuResponsiveSidesSchema = external_exports.object({
  desktop: menuSideValuesSchema,
  mobile: menuSideValuesSchema
}).strict().describe("Menu responsive side values for desktop and mobile.");
var spacerMarginsSideValuesSchema = external_exports.object({
  top: external_exports.number().int().min(0).max(1e3),
  right: external_exports.number().int().min(0).max(1e3),
  bottom: external_exports.number().int().min(0).max(1e3),
  left: external_exports.number().int().min(0).max(1e3)
}).strict().describe("Spacer margins for each side.");
var spacerMarginsSchema = external_exports.object({
  desktop: spacerMarginsSideValuesSchema,
  mobile: spacerMarginsSideValuesSchema
}).strict().describe("Responsive spacer margins settings.");
var borderRadiusSchema = external_exports.object({
  topLeft: external_exports.number().min(0).max(1e3),
  topRight: external_exports.number().min(0).max(1e3),
  bottomRight: external_exports.number().min(0).max(1e3),
  bottomLeft: external_exports.number().min(0).max(1e3)
}).strict().describe("Border radius values for each corner.");
var imageRadiusSchema = external_exports.object({
  desktop: borderRadiusSchema,
  mobile: borderRadiusSchema
}).strict().describe("Responsive image border radius settings.");
var imageMarginsSideValuesSchema = external_exports.object({
  top: external_exports.number().min(0).max(1e3),
  right: external_exports.number().min(0).max(1e3),
  bottom: external_exports.number().min(0).max(1e3),
  left: external_exports.number().min(0).max(1e3)
}).strict().describe("Image margins for each side.");
var imageMarginsSchema = external_exports.object({
  desktop: imageMarginsSideValuesSchema,
  mobile: imageMarginsSideValuesSchema
}).strict().describe("Responsive image margin settings.");
var videoPaddingsSchema = imageMarginsSchema.describe("Responsive video block padding settings.");
var socialNetworkTypeSchema = external_exports.enum(SOCIAL_NETWORK_TYPES).describe("Supported social network name for a social block item.");
var socialIconStyleSchema = external_exports.enum(SOCIAL_ICON_STYLES).describe("Supported social icon style for a social block.");
var socialNetworkIconSchema = external_exports.string().superRefine((value, context) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "Social network custom icon must contain a non-whitespace value."
    });
    return;
  }
  if (trimmedValue !== value) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "Social network custom icon must not contain leading or trailing spaces."
    });
  }
}).describe("Image path for a custom social network icon.");
var socialNetworkSchema = external_exports.object({
  type: socialNetworkTypeSchema,
  link: socialNetworkLinkSchema.optional(),
  icon: socialNetworkIconSchema.optional(),
  title: external_exports.string().max(100),
  alt: external_exports.string().max(IMAGE_MAX_ALT_TEXT_LENGTH).optional()
}).strict().describe("Social network item with type, URL, title, alternate text, and custom icon.");
var socialBlockSpaceBetweenIconsSchema = external_exports.object({
  desktop: external_exports.number().int().min(0).max(40),
  mobile: external_exports.number().int().min(0).max(40)
}).strict().describe("Responsive spacing between social icons for desktop and mobile.");
var socialBlockAlignmentSchema = external_exports.object({
  desktop: textAlignmentValueSchema,
  mobile: textAlignmentValueSchema
}).strict().describe("Responsive social block alignment settings.");
var socialBlockMarginsSideValuesSchema = external_exports.object({
  top: external_exports.number().min(0).max(1e3),
  right: external_exports.number().min(0).max(1e3),
  bottom: external_exports.number().min(0).max(1e3),
  left: external_exports.number().min(0).max(1e3)
}).strict().describe("Social block margins for each side.");
var socialBlockMarginsSchema = external_exports.object({
  desktop: socialBlockMarginsSideValuesSchema,
  mobile: socialBlockMarginsSideValuesSchema
}).strict().describe("Responsive social block margin settings.");
var anchorLinkNameSchema = external_exports.string().max(150).superRefine((value, context) => {
  const trimmedValue = value.trim();
  if (trimmedValue !== value) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "Anchor link name must not contain leading or trailing spaces."
    });
  }
  if (trimmedValue && trimmedValue.startsWith("#")) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "Anchor link name must not start with #."
    });
  }
}).describe("Anchor name for the block. Empty string disables the anchor link.");
var imageSrcSchema = external_exports.string().superRefine((value, context) => {
  if (value === "") {
    return;
  }
  const trimmedValue = value.trim();
  if (!trimmedValue) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "Image path must be empty or contain a non-whitespace value."
    });
    return;
  }
  if (trimmedValue !== value) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "Image path must not contain leading or trailing spaces."
    });
  }
}).describe("Image path for the image block. Empty string resets the image to the placeholder.");
var videoLinkSchema = external_exports.string().superRefine((value, context) => {
  const trimmedValue = value.trim();
  if (trimmedValue !== value) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "Video link must not contain leading or trailing spaces."
    });
  }
  if (value && !trimmedValue) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "Video link must be empty or contain a non-whitespace value."
    });
  }
}).describe("Video link for the video block. Empty string clears the video link.");
var videoCustomThumbnailSchema = external_exports.object({
  src: imageSrcSchema.refine((value) => value !== "", {
    message: "Custom thumbnail path cannot be empty."
  })
}).strict().describe("Custom thumbnail settings for a video block. Absence disables custom thumbnail.");
var videoPlayButtonStyleSchema = external_exports.enum([
  "NONE",
  "red",
  "white",
  "black",
  "blue",
  "whiteCircle",
  "blackCircle",
  "greyCircle",
  "blackCircleInverse"
]).describe("Video play button style.");
var timerLabelCaseSchema = external_exports.enum(["CAPITALIZE", "UPPER", "LOWER"]);
var timerFontSizeSchema = external_exports.number().int().min(8).max(72);
var timerSeparatorSchema = external_exports.string().max(100);
var timerLanguageSchema = external_exports.enum(TIMER_LABEL_LANGUAGE_LOCALES);
var timerFontFamilySchema = external_exports.enum(TIMER_FONT_FAMILY_VALUES);
var timerTimeZoneSchema = external_exports.enum(getSupportedTimeZoneNames(timeZones));
var timerEndDateSchema = external_exports.string().superRefine((value, context) => {
  if (value === "") {
    return;
  }
  const match = /^(\d{4})-(\d{2})-(\d{2}) ([01]\d|2[0-3]):([0-5]\d):00$/.exec(value);
  if (!match) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "Timer endDate must be empty or use YYYY-MM-DD HH:mm:00 with valid hours and minutes."
    });
    return;
  }
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      message: "Timer endDate must contain a valid calendar date."
    });
  }
});
function areImageSizeValuesEqual(left, right) {
  return left.mode === right.mode && left.px === right.px;
}
var MOBILE_IMAGE_PREVIEW_WIDTH = 375;
function getHorizontalSideWidth(value) {
  return (value?.left ?? 0) + (value?.right ?? 0);
}
function getHorizontalBorderWidth(border) {
  return getHorizontalSideWidth({
    left: border?.left?.width,
    right: border?.right?.width
  });
}
function isFullWidthImageSize(size, availableWidth) {
  return size.mode === "width" && availableWidth !== void 0 && size.px >= availableWidth;
}
var imageBlockSettingsSchema = external_exports.object({
  src: imageSrcSchema,
  link: imageLinkSchema.optional(),
  altText: imageAltTextSchema,
  size: imageSizeSchema,
  alignment: imageAlignmentSchema,
  radius: imageRadiusSchema,
  hideElement: hideElementSchema,
  margins: imageMarginsSchema,
  includeInOutput: outputInclusionSchema,
  anchorLinkName: anchorLinkNameSchema,
  responsiveMobile: external_exports.boolean()
}).strict().superRefine((settings, context) => {
  if (!settings.responsiveMobile) {
    return;
  }
  if (!areImageSizeValuesEqual(settings.size.desktop, settings.size.mobile)) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["size", "mobile"],
      message: "Mobile image size must match desktop size when responsive image is enabled."
    });
  }
  if (settings.alignment.desktop !== settings.alignment.mobile) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["alignment", "mobile"],
      message: "Mobile image alignment must match desktop alignment when responsive image is enabled."
    });
  }
}).describe("Image block settings.");
var videoBlockSettingsSchema = external_exports.object({
  videoLink: videoLinkSchema,
  altText: imageAltTextSchema,
  customThumbnail: videoCustomThumbnailSchema.optional(),
  playButtonStyle: videoPlayButtonStyleSchema,
  size: imageSizeSchema,
  alignment: imageAlignmentSchema,
  radius: imageRadiusSchema,
  hideElement: hideElementSchema,
  paddings: videoPaddingsSchema,
  includeInOutput: outputInclusionSchema,
  anchorLinkName: anchorLinkNameSchema,
  responsiveMobile: external_exports.boolean()
}).strict().superRefine((settings, context) => {
  if (!settings.responsiveMobile) {
    return;
  }
  if (!areImageSizeValuesEqual(settings.size.desktop, settings.size.mobile)) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["size", "mobile"],
      message: "Mobile video size must match desktop size when responsive image is enabled."
    });
  }
  if (settings.alignment.desktop !== settings.alignment.mobile) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["alignment", "mobile"],
      message: "Mobile video alignment must match desktop alignment when responsive image is enabled."
    });
  }
}).describe("Video block settings.");
var htmlBlockSettingsSchema = external_exports.object({
  margins: imageMarginsSchema,
  includeInOutput: outputInclusionSchema,
  hideElement: hideElementSchema,
  anchorLinkName: anchorLinkNameSchema
}).strict().describe("HTML block settings.");
var buttonAlignmentSchema = external_exports.object({
  desktop: textAlignmentValueSchema,
  mobile: textAlignmentValueSchema
}).strict().describe("Button alignment values for desktop and mobile.");
var buttonSalesforceLinkSettingsSchema = external_exports.object({
  trackingAlias: external_exports.string().max(100),
  linkTo: external_exports.string(),
  conversion: external_exports.boolean()
}).strict().describe("Salesforce Marketing Cloud tracking link settings.");
var buttonRegularLinkSchema = external_exports.object({
  type: external_exports.enum(["site", "anchor", "email", "phone", "sms", "telegram", "viber", "file", "other"]),
  value: external_exports.string()
}).strict().superRefine((value, context) => {
  const linkValue = value.value;
  const trimmedValue = linkValue.trim();
  const hasValueAfterPrefix = (prefixLength) => trimmedValue.slice(prefixLength).trim().length > 0;
  const addValueIssue = (message) => {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["value"],
      message
    });
  };
  if (linkValue !== trimmedValue) {
    addValueIssue("Button link value must not contain leading or trailing spaces.");
  }
  if (!trimmedValue) {
    if (value.type !== "site") {
      addValueIssue("Blank button links are only allowed for site links.");
    }
    return;
  }
  switch (value.type) {
    case "site":
      if (!/^https?:\/\//i.test(trimmedValue)) {
        addValueIssue("Site button links must start with http:// or https://.");
      } else if (!hasValueAfterPrefix(trimmedValue.toLowerCase().startsWith("https://") ? "https://".length : "http://".length)) {
        addValueIssue("Site button links must include a value after the protocol.");
      }
      break;
    case "anchor":
      if (!trimmedValue.startsWith("#")) {
        addValueIssue("Anchor button links must start with #.");
      } else if (!hasValueAfterPrefix("#".length)) {
        addValueIssue("Anchor button links must include a value after #.");
      }
      break;
    case "email":
      if (!trimmedValue.startsWith("mailto:")) {
        addValueIssue("Email button links must start with mailto:.");
      } else if (!hasValueAfterPrefix("mailto:".length)) {
        addValueIssue("Email button links must include a value after mailto:.");
      }
      break;
    case "phone":
      if (!trimmedValue.startsWith("tel:")) {
        addValueIssue("Phone button links must start with tel:.");
      } else if (!hasValueAfterPrefix("tel:".length)) {
        addValueIssue("Phone button links must include a value after tel:.");
      }
      break;
    case "sms":
      if (!trimmedValue.startsWith("sms:")) {
        addValueIssue("SMS button links must start with sms:.");
      } else if (!hasValueAfterPrefix("sms:".length)) {
        addValueIssue("SMS button links must include a value after sms:.");
      }
      break;
    case "telegram":
      if (!trimmedValue.startsWith("tg://")) {
        addValueIssue("Telegram button links must start with tg://.");
      } else if (!hasValueAfterPrefix("tg://".length)) {
        addValueIssue("Telegram button links must include a value after tg://.");
      }
      break;
    case "viber":
      if (!trimmedValue.startsWith("viber:")) {
        addValueIssue("Viber button links must start with viber:.");
      } else if (!hasValueAfterPrefix("viber:".length)) {
        addValueIssue("Viber button links must include a value after viber:.");
      }
      break;
    case "file":
      if (!/^ftps?:\/\//i.test(trimmedValue)) {
        addValueIssue("File button links must start with ftp:// or ftps://.");
      } else if (!hasValueAfterPrefix(trimmedValue.toLowerCase().startsWith("ftps://") ? "ftps://".length : "ftp://".length)) {
        addValueIssue("File button links must include a value after the protocol.");
      }
      break;
    case "other":
      break;
  }
});
var buttonSalesforceLinkSchema = external_exports.object({
  type: external_exports.literal("salesforce_mc"),
  value: external_exports.string(),
  salesforce: buttonSalesforceLinkSettingsSchema
}).strict().superRefine((value, context) => {
  if (value.value !== value.value.trim()) {
    context.addIssue({
      code: external_exports.ZodIssueCode.custom,
      path: ["value"],
      message: "Salesforce button link value must not contain leading or trailing spaces."
    });
  }
});
var buttonLinkSchema = external_exports.union([buttonRegularLinkSchema, buttonSalesforceLinkSchema]).describe("Button link type and URL/value.");
var buttonFixedHeightSchema = external_exports.object({
  height: external_exports.number().int().min(0),
  alignment: external_exports.enum(["top", "middle", "bottom"]).optional()
}).strict().describe("Button fixed height settings. The object is optional; absence disables fixed height.");
var TEXT_BLOCK_FIXED_HEIGHT_MODE_DESCRIPTION = "Text fixed-height mode. Omitted verticalAlignment preserves the previous effective alignment; top is used when none exists.";
var TEXT_BLOCK_FIXED_HEIGHT_DESCRIPTION = "Text block fixed height settings. Desktop and mobile are independent; an absent mode disables it and absence of fixedHeight disables both.";
var textBlockFixedHeightModeSchema = external_exports.object({
  height: external_exports.number().int().min(0),
  verticalAlignment: external_exports.enum(["top", "middle", "bottom"]).optional()
}).strict().describe(TEXT_BLOCK_FIXED_HEIGHT_MODE_DESCRIPTION);
var textBlockFixedHeightSchema = external_exports.object({
  desktop: textBlockFixedHeightModeSchema.optional(),
  mobile: textBlockFixedHeightModeSchema.optional()
}).strict().refine((value) => value.desktop !== void 0 || value.mobile !== void 0, {
  message: "At least one fixed-height target must be provided."
}).describe(TEXT_BLOCK_FIXED_HEIGHT_DESCRIPTION);
var buttonIconSchema = external_exports.object({
  src: external_exports.string().min(1),
  width: external_exports.number().int().min(3).max(128),
  align: external_exports.enum(["left", "right"]),
  indent: external_exports.number().int().min(0).max(400)
}).strict().describe("Button icon settings. The object is optional, but all icon fields are required when enabled.");
var buttonAnchorLinkSchema = anchorLinkNameSchema.describe("Anchor name for the button block. Empty string disables the anchor link.");
var headingTextStyleSchema = external_exports.object({
  italic: external_exports.boolean()
}).strict().describe("Heading text style settings.");
var headingsAlignmentSchema = external_exports.object({
  mobile: textAlignmentValueSchema
}).strict().describe("Heading alignment settings.");
var mobilePaddingSchema = external_exports.object({
  mobile: fullSideValuesSchema
}).strict().describe("Mobile-only top, right, bottom, and left side values.");
var generalBackgroundRepeatSchema = external_exports.union([external_exports.boolean(), external_exports.string()]).transform((value, context) => {
  if (typeof value === "boolean") {
    return value;
  }
  const normalizedValue = value.trim().toLowerCase();
  if (normalizedValue === "repeat" || normalizedValue === "true") {
    return true;
  }
  if (normalizedValue === "no-repeat" || normalizedValue === "false") {
    return false;
  }
  context.addIssue({
    code: external_exports.ZodIssueCode.custom,
    message: "Invalid repeat value. Expected boolean or repeat/no-repeat."
  });
  return external_exports.NEVER;
});
var TEXT_TRANSFORM_VALUES = BUTTONS_TEXT_TRANSFORM_VALUES;
var backgroundImageSettingsSchema = external_exports.object({
  path: external_exports.string().describe("Background image URL."),
  repeat: generalBackgroundRepeatSchema.describe("Background repeat mode."),
  x: external_exports.string().describe("Horizontal background position."),
  y: external_exports.string().describe("Vertical background position."),
  sizeX: external_exports.string().transform(normalizeBackgroundImageSizeValue).describe("Background image width."),
  sizeY: external_exports.string().transform(normalizeBackgroundImageSizeValue).describe("Background image height.")
}).strict().describe("Background image settings.");
var baseBlockSchema = external_exports.object({
  id: external_exports.string().min(1, "Block ID cannot be empty"),
  type: external_exports.enum(["text", "image", "video", "timer", "social", "html", "button", "spacer", "menu", "unknown"]),
  settings: external_exports.record(external_exports.string(), external_exports.unknown()).optional()
}).describe("Base block schema.");
var imageBlockSchema = baseBlockSchema.extend({
  type: external_exports.literal("image"),
  settings: imageBlockSettingsSchema
}).describe("Image block.");
var videoBlockSchema = baseBlockSchema.extend({
  type: external_exports.literal("video"),
  settings: videoBlockSettingsSchema
}).describe("Video block.");
var htmlBlockSchema = baseBlockSchema.extend({
  type: external_exports.literal("html"),
  content: external_exports.string().optional(),
  settings: htmlBlockSettingsSchema
}).describe("HTML block.");
var unknownBlockSchema = baseBlockSchema.extend({
  type: external_exports.literal("unknown"),
  content: external_exports.string(),
  extension: external_exports.boolean(),
  settings: external_exports.record(external_exports.string(), external_exports.unknown()).refine((settings) => Object.keys(settings).length === 0, "Unknown block settings are not supported.").optional()
}).strict().describe("Unknown or extension block.");
var STRUCTURE_WIDTH_COLUMNS_DESCRIPTION = "Informational column width. In setDocumentState this value is treated as a ratio weight rather than absolute pixels. The actual widths in the resulting email can differ from the values passed in the schema. getDocumentState returns the current absolute widths in px.";
var columnSettingsSchema = external_exports.object({
  width: external_exports.number().describe(STRUCTURE_WIDTH_COLUMNS_DESCRIPTION)
}).strict().describe("Column-specific layout settings.");
function getDesktopImageAvailableWidth(containerWidth, containerSettings, mediaSettings) {
  if (containerWidth === void 0) {
    return void 0;
  }
  const spacing = "paddings" in mediaSettings ? mediaSettings.paddings : mediaSettings.margins;
  return Math.max(
    1,
    containerWidth - getHorizontalBorderWidth(containerSettings.border) - getHorizontalSideWidth(spacing.desktop)
  );
}
function getMobileImageAvailableWidth(structureSettings, containerSettings, mediaSettings) {
  const spacing = "paddings" in mediaSettings ? mediaSettings.paddings : mediaSettings.margins;
  return Math.max(
    1,
    MOBILE_IMAGE_PREVIEW_WIDTH - getHorizontalSideWidth(structureSettings?.padding?.mobile) - getHorizontalSideWidth(containerSettings.padding.mobile) - getHorizontalSideWidth(spacing.mobile)
  );
}
var DOCUMENT_METADATA_TITLE_DESCRIPTION = "Email <head><title> value. Changed values are limited to ".concat(DOCUMENT_METADATA_TEXT_MAX_LENGTH, " UTF-16 code units.");
var documentMetadataPreheaderSchema = external_exports.object({
  text: external_exports.string().describe(
    "Visible preheader text. Changed text is limited to ".concat(DOCUMENT_METADATA_TEXT_MAX_LENGTH, " UTF-16 code units.")
  ),
  fillSpace: external_exports.boolean().describe("Adds or removes the editor-managed invisible filler after the text.")
}).strict().describe("Hidden preheader semantic value.");
var documentMetadataSchema = external_exports.object({
  title: external_exports.string().describe(DOCUMENT_METADATA_TITLE_DESCRIPTION).optional(),
  preheader: documentMetadataPreheaderSchema.optional()
}).strict().describe(
  "Patch-compatible document metadata: omitted fields preserve their current values; preheader requires both fields."
);
var fontResourceSchema = external_exports.discriminatedUnion("importMethod", [
  external_exports.object({ fontFamily: fontFamilySchema, importMethod: external_exports.literal(FONT_RESOURCE_IMPORT_METHODS[0]), url: external_exports.string().min(1) }).strict(),
  external_exports.object({ fontFamily: fontFamilySchema, importMethod: external_exports.literal(FONT_RESOURCE_IMPORT_METHODS[1]), url: external_exports.string().min(1) }).strict(),
  external_exports.object({ fontFamily: fontFamilySchema, importMethod: external_exports.literal(FONT_RESOURCE_IMPORT_METHODS[2]), url: external_exports.string().optional(), css: external_exports.string().min(1) }).strict()
]).describe("Used custom font connection. fontFace CSS is ready to inline, with an optional source URL; local is unsupported.");
var fontResourcesSchema = external_exports.array(fontResourceSchema).superRefine((resources, context) => {
  getFontResourceValidationIssues(resources).forEach((issue) => context.addIssue({ code: "custom", ...issue }));
});
var documentResourcesSchema = external_exports.object({ fonts: fontResourcesSchema.optional() }).strict().describe("Partial model-only resources. Omitted fonts preserve needed connections; unused fonts are pruned.").transform((resources) => resources.fonts?.length ? {
  fonts: resources.fonts.map((resource) => ({ ...resource, fontFamily: clearFontValue(resource.fontFamily.trim()) }))
} : void 0);
function createEmailTemplateSchemas(colorMergeTagValues = /* @__PURE__ */ new Set()) {
  const { canonicalEmailTemplateSettingsSchema: canonicalEmailTemplateSettingsSchema2 } = createEmailTemplateSettingsSchemas(colorMergeTagValues);
  const { colorSchemaAllowTransparent: colorSchemaAllowTransparent3, colorSchemaDisallowTransparent: colorSchemaDisallowTransparent3 } = createEmailTemplateColorSchemas(colorMergeTagValues);
  const borderColorSchema2 = external_exports.object({
    top: colorSchemaAllowTransparent3,
    right: colorSchemaAllowTransparent3,
    bottom: colorSchemaAllowTransparent3,
    left: colorSchemaAllowTransparent3
  }).strict().describe("Border colors for top, right, bottom, and left sides.");
  const borderSideSchema2 = external_exports.object({
    width: external_exports.number().min(0).max(100),
    color: colorSchemaAllowTransparent3
  }).strict().describe("Border settings for a single side.");
  const borderSchema2 = external_exports.object({
    top: borderSideSchema2,
    right: borderSideSchema2,
    bottom: borderSideSchema2,
    left: borderSideSchema2,
    style: borderStyleValueSchema
  }).strict().describe("Border configuration for all sides and shared style.");
  const hoverLinkColorSchema2 = external_exports.object({
    value: colorSchemaDisallowTransparent3
  }).strict().describe("Hovered link color settings.");
  const buttonsHoverBorderColorSchema2 = external_exports.object({
    top: colorSchemaAllowTransparent3,
    right: colorSchemaAllowTransparent3,
    bottom: colorSchemaAllowTransparent3,
    left: colorSchemaAllowTransparent3
  }).strict().describe("Hovered button border colors for each side.");
  const buttonsHoverButtonStylesSchema2 = external_exports.object({
    backgroundColor: colorSchemaAllowTransparent3,
    fontColor: colorSchemaDisallowTransparent3,
    borderColor: buttonsHoverBorderColorSchema2
  }).strict().describe("Hovered button styles.");
  const spacerBorderSchema = external_exports.object({
    size: external_exports.number().int().min(1).max(40),
    style: borderStyleValueSchema,
    color: colorSchemaDisallowTransparent3
  }).strict().describe("Spacer line border settings.");
  const menuItemColorsSchema = external_exports.object({
    link: colorSchemaDisallowTransparent3,
    background: colorSchemaAllowTransparent3
  }).strict().describe("Menu item link and background colors.");
  const menuItemSchema2 = external_exports.object({
    type: menuItemTypeSchema.optional(),
    name: external_exports.string().max(500),
    link: menuLinkSchema,
    image: menuItemImageSchema.optional(),
    hideElement: hideElementSchema,
    colors: menuItemColorsSchema.optional()
  }).strict().describe("Menu item settings.");
  const menuBlockColorsSchema = external_exports.discriminatedUnion("mode", [
    external_exports.object({
      mode: external_exports.literal("shared"),
      link: colorSchemaDisallowTransparent3
    }).strict(),
    external_exports.object({
      mode: external_exports.literal("perItem")
    }).strict()
  ]).describe("Menu color mode.");
  const menuSeparatorSchema2 = external_exports.object({
    width: external_exports.number().int().min(0).max(20),
    style: external_exports.enum(["none", "line", "dashed", "dotted"]),
    color: colorSchemaDisallowTransparent3
  }).strict().describe("Menu separator settings.");
  const timerAdvancedColorSettingsSchema = external_exports.object({
    days: colorSchemaDisallowTransparent3,
    hours: colorSchemaDisallowTransparent3,
    minutes: colorSchemaDisallowTransparent3,
    seconds: colorSchemaDisallowTransparent3
  }).strict();
  const timerBlockSettingsSchema2 = external_exports.object({
    altText: imageAltTextSchema,
    responsiveMobile: external_exports.boolean(),
    size: imageSizeSchema,
    alignment: imageAlignmentSchema,
    margins: imageMarginsSchema,
    endDate: timerEndDateSchema,
    timeZone: timerTimeZoneSchema,
    link: imageLinkSchema.nullable(),
    displayDays: external_exports.boolean(),
    labelsLetterCase: timerLabelCaseSchema.optional(),
    separator: timerSeparatorSchema,
    labelsLanguage: timerLanguageSchema,
    retinaDisplaySupport: external_exports.boolean(),
    expirationImageSrc: imageSrcSchema,
    hideElement: hideElementSchema,
    includeInOutput: outputInclusionSchema,
    anchorLinkName: anchorLinkNameSchema,
    digitsFontFamily: timerFontFamilySchema,
    digitsFontSize: timerFontSizeSchema,
    digitsFontColor: colorSchemaDisallowTransparent3,
    digitsAdvancedColorSettings: timerAdvancedColorSettingsSchema.optional(),
    labelsFontFamily: timerFontFamilySchema,
    labelsFontSize: timerFontSizeSchema,
    labelsFontColor: colorSchemaDisallowTransparent3,
    labelsAdvancedColorSettings: timerAdvancedColorSettingsSchema.optional(),
    separatorFontFamily: timerFontFamilySchema,
    separatorFontSize: timerFontSizeSchema,
    separatorFontColor: colorSchemaDisallowTransparent3,
    backgroundColor: colorSchemaAllowTransparent3
  }).strict().superRefine((settings, context) => {
    if (!settings.responsiveMobile) {
      return;
    }
    if (!areImageSizeValuesEqual(settings.size.desktop, settings.size.mobile)) {
      context.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: ["size", "mobile"],
        message: "Mobile timer size must match desktop size when responsive image is enabled."
      });
    }
    if (settings.alignment.desktop !== settings.alignment.mobile) {
      context.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: ["alignment", "mobile"],
        message: "Mobile timer alignment must match desktop alignment when responsive image is enabled."
      });
    }
  }).describe("Timer block settings.");
  const socialBlockSettingsSchema = external_exports.object({
    networks: external_exports.array(socialNetworkSchema).min(1),
    style: socialIconStyleSchema,
    iconSize: external_exports.number().int().min(16).max(64),
    spaceBetweenIcons: socialBlockSpaceBetweenIconsSchema,
    textCustomization: external_exports.boolean(),
    alignment: socialBlockAlignmentSchema,
    backgroundColor: colorSchemaAllowTransparent3,
    hideElement: hideElementSchema,
    margins: socialBlockMarginsSchema,
    includeInOutput: outputInclusionSchema,
    anchorLinkName: anchorLinkNameSchema
  }).strict().superRefine((settings, context) => {
    settings.networks.forEach((network, index) => {
      const hasIcon = Object.prototype.hasOwnProperty.call(network, "icon");
      if (network.type === "custom" /* custom */ && !hasIcon) {
        context.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["networks", index, "icon"],
          message: "Social network icon is required for custom social networks."
        });
      }
      if (network.type !== "custom" /* custom */ && hasIcon) {
        context.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["networks", index, "icon"],
          message: "Social network icon can only be provided for custom social networks."
        });
      }
      const hasAlt = Object.prototype.hasOwnProperty.call(network, "alt");
      if (settings.textCustomization && !hasAlt) {
        context.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["networks", index, "alt"],
          message: "Social network alt is required when text customization is enabled."
        });
      }
      if (!settings.textCustomization && hasAlt) {
        context.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["networks", index, "alt"],
          message: "Social network alt can only be provided when text customization is enabled."
        });
      }
    });
  }).describe("Social block settings.");
  const spacerBlockSettingsSchema = external_exports.object({
    mode: spacerModeSchema,
    width: spacerWidthSchema.optional(),
    height: spacerHeightSchema.optional(),
    border: spacerBorderSchema.optional(),
    mobileBorder: spacerBorderSchema.nullable().optional().describe("Explicit mobile line border override. Null inherits desktop; omission preserves an existing line override."),
    alignment: spacerAlignmentSchema.optional(),
    backgroundColor: colorSchemaAllowTransparent3,
    margins: spacerMarginsSchema,
    anchorLinkName: anchorLinkNameSchema,
    includeInOutput: outputInclusionSchema,
    hideElement: hideElementSchema
  }).strict().superRefine((settings, context) => {
    const addIssue = (path, message) => {
      context.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path,
        message
      });
    };
    if (settings.mode === "line") {
      if (!settings.width) {
        addIssue(["width"], "Spacer line mode requires width settings.");
      }
      if (!settings.border) {
        addIssue(["border"], "Spacer line mode requires border settings.");
      }
      if (!settings.alignment) {
        addIssue(["alignment"], "Spacer line mode requires alignment settings.");
      }
      if (settings.height !== void 0) {
        addIssue(["height"], "Spacer height is available only in space mode.");
      }
      return;
    }
    if (!settings.height) {
      addIssue(["height"], "Spacer space mode requires height settings.");
    }
    if (settings.width !== void 0) {
      addIssue(["width"], "Spacer width is available only in line mode.");
    }
    if (settings.border !== void 0) {
      addIssue(["border"], "Spacer border is available only in line mode.");
    }
    if (settings.mobileBorder !== void 0) {
      addIssue(["mobileBorder"], "Spacer mobile border is available only in line mode.");
    }
    if (settings.alignment !== void 0) {
      addIssue(["alignment"], "Spacer alignment is available only in line mode.");
    }
  }).describe("Spacer block settings.");
  const menuBlockSettingsSchema2 = external_exports.object({
    responsiveMenu: external_exports.boolean(),
    itemType: menuBlockItemTypeSchema,
    fitToContainer: external_exports.boolean(),
    itemPadding: menuResponsiveSidesSchema,
    margins: menuResponsiveSidesSchema,
    anchorLinkName: anchorLinkNameSchema,
    includeInOutput: outputInclusionSchema,
    separator: menuSeparatorSchema2,
    fontFamily: fontFamilySchema,
    fontSize: fontSizeSchema,
    hideElement: hideElementSchema,
    textStyle: buttonsTextStyleSchema,
    colors: menuBlockColorsSchema,
    items: external_exports.array(menuItemSchema2).min(1).max(30)
  }).strict().superRefine((settings, context) => {
    settings.items.forEach((item, index) => {
      const itemType = settings.itemType.mode === "shared" ? settings.itemType.type : item.type;
      const hasItemType = item.type !== void 0;
      const hasItemColors = item.colors !== void 0;
      if (settings.itemType.mode === "shared" && hasItemType) {
        context.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["items", index, "type"],
          message: "Menu item type must be omitted when itemType mode is shared."
        });
      }
      if (settings.itemType.mode === "perItem" && !hasItemType) {
        context.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["items", index, "type"],
          message: "Menu item type is required when itemType mode is perItem."
        });
      }
      if (itemType === "links" && item.image !== void 0) {
        context.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["items", index, "image"],
          message: "Menu item image is available only for icon and link-with-icon menu item types."
        });
      }
      if (itemType && itemType !== "links" && !item.image) {
        context.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["items", index, "image"],
          message: "Icon and link-with-icon menu items require image settings."
        });
      }
      if (settings.colors.mode === "perItem") {
        if (!hasItemColors) {
          context.addIssue({
            code: external_exports.ZodIssueCode.custom,
            path: ["items", index, "colors"],
            message: "Menu item colors are required when colors mode is perItem."
          });
        }
        return;
      }
      if (hasItemColors) {
        context.addIssue({
          code: external_exports.ZodIssueCode.custom,
          path: ["items", index, "colors"],
          message: "Menu item colors must be omitted when colors mode is shared."
        });
      }
    });
  }).describe("Menu block settings.");
  const stripesCommonSectionSettingsShape = {
    fontSize: fontSizeSchema.optional(),
    fontColor: colorSchemaDisallowTransparent3.optional(),
    linkColor: colorSchemaDisallowTransparent3.optional(),
    linkColorHover: hoverLinkColorSchema2.optional(),
    paragraphBottomSpace: paragraphBottomSpaceSchema.optional()
  };
  const stripesHeaderSectionSettingsSchema2 = external_exports.object({
    ...stripesCommonSectionSettingsShape,
    contentBackgroundColor: colorSchemaAllowTransparent3.optional(),
    stripeBackgroundColor: colorSchemaAllowTransparent3.optional(),
    backgroundImage: backgroundImageSettingsSchema.optional()
  }).strict().describe("Default settings for header stripes.");
  const stripesContentSectionSettingsSchema2 = external_exports.object({
    ...stripesCommonSectionSettingsShape,
    contentBackgroundColor: colorSchemaAllowTransparent3.optional()
  }).strict().describe("Default settings for content stripes.");
  const stripesFooterSectionSettingsSchema2 = external_exports.object({
    ...stripesCommonSectionSettingsShape,
    contentBackgroundColor: colorSchemaAllowTransparent3.optional(),
    stripeBackgroundColor: colorSchemaAllowTransparent3.optional(),
    backgroundImage: backgroundImageSettingsSchema.optional()
  }).strict().describe("Default settings for footer stripes.");
  const stripesInfoAreaSectionSettingsSchema2 = external_exports.object({
    ...stripesCommonSectionSettingsShape
  }).strict().describe("Default settings for info area stripes.");
  const generalCustomListStylesSchema2 = external_exports.object({
    leftIndent: external_exports.number().min(0).max(300),
    listItemsBottomSpace: external_exports.number().min(0).max(100),
    listTopBottomMargin: external_exports.number().min(0).max(100),
    listMarkerColor: colorSchemaAllowTransparent3,
    listNumberMarkerColor: colorSchemaAllowTransparent3
  }).strict().describe("Custom list styling settings.");
  const generalSettingsSchema2 = external_exports.object({
    defaultStyles: external_exports.boolean(),
    hideImageDownloadIcons: external_exports.boolean().optional(),
    underlineLinks: external_exports.boolean(),
    responsiveDesign: external_exports.boolean(),
    messageAlignment: messageAlignmentSchema,
    messageContentWidth: messageContentWidthSchema,
    backgroundColor: colorSchemaAllowTransparent3,
    backgroundImage: backgroundImageSettingsSchema.optional(),
    rightToLeftTextDirection: external_exports.boolean(),
    marginsAroundMessage: fullResponsiveSidesSchema,
    defaultStructurePadding: fullResponsiveSidesSchema,
    customListStyles: generalCustomListStylesSchema2.optional()
  }).strict().describe("General email template settings.");
  const stripesSettingsSchema2 = external_exports.object({
    letterSpacing: spacingValueSchema.optional(),
    lineHeight: lineHeightSchema.optional(),
    fontFamily: fontFamilySchema.optional(),
    fontWeight: fontWeightSchema.optional(),
    header: stripesHeaderSectionSettingsSchema2.optional(),
    content: stripesContentSectionSettingsSchema2.optional(),
    footer: stripesFooterSectionSettingsSchema2.optional(),
    infoArea: stripesInfoAreaSectionSettingsSchema2.optional()
  }).strict().describe("Default stripe settings.");
  const headingsSectionSettingsSchema2 = external_exports.object({
    fontColor: colorSchemaDisallowTransparent3.optional(),
    textAlign: headingsAlignmentSchema.optional(),
    textStyle: headingTextStyleSchema.optional(),
    fontWeight: fontWeightSchema.optional(),
    fontSize: fontSizeSchema.optional(),
    lineHeight: lineHeightSchema.optional(),
    paragraphBottomSpace: paragraphBottomSpaceSchema.optional()
  }).strict().describe("Heading settings for a single heading level.");
  const headingsSettingsSchema2 = external_exports.object({
    letterSpacing: spacingValueSchema.optional(),
    fontFamily: fontFamilySchema.optional(),
    h1: headingsSectionSettingsSchema2.optional(),
    h2: headingsSectionSettingsSchema2.optional(),
    h3: headingsSectionSettingsSchema2.optional(),
    h4: headingsSectionSettingsSchema2.optional(),
    h5: headingsSectionSettingsSchema2.optional(),
    h6: headingsSectionSettingsSchema2.optional()
  }).strict().describe("Default heading settings.");
  const buttonsSettingsSchema2 = external_exports.object({
    outlookSupport: external_exports.boolean().optional(),
    fontColor: colorSchemaDisallowTransparent3.optional(),
    textStyle: buttonsTextStyleSchema.optional(),
    textTransform: external_exports.enum(TEXT_TRANSFORM_VALUES).optional(),
    fontFamily: fontFamilySchema.optional(),
    buttonColor: colorSchemaAllowTransparent3.optional(),
    letterSpacing: spacingValueSchema.optional(),
    fontSize: fontSizeSchema.optional(),
    borderRadius: borderRadiusSchema.optional(),
    fitContainer: responsiveBooleanSchema.optional(),
    border: borderSchema2,
    hoverButtonStyles: buttonsHoverButtonStylesSchema2.optional(),
    padding: fullResponsiveSidesSchema.optional()
  }).strict().describe("Default button settings.").superRefine((value, context) => {
    if ("borderColor" in value) {
      context.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: ["borderColor"],
        message: "Legacy buttons borderColor is not supported. Use border.<side>.color."
      });
    }
    if ("borderStyle" in value) {
      context.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: ["borderStyle"],
        message: "Legacy buttons borderStyle is not supported. Use border.style."
      });
    }
  });
  const textBlockSchema2 = baseBlockSchema.extend({
    type: external_exports.literal("text"),
    content: external_exports.string().optional(),
    settings: external_exports.object({
      fontColor: colorSchemaDisallowTransparent3.optional(),
      hideElement: hideElementSchema,
      rightToLeftTextDirection: external_exports.boolean(),
      alignment: textBlockAlignmentSchema.optional(),
      fixedHeight: textBlockFixedHeightSchema.optional(),
      padding: textBlockResponsiveSidesSchema,
      includeInOutput: outputInclusionSchema,
      backgroundColor: colorSchemaAllowTransparent3,
      letterSpacing: spacingValueSchema.optional()
    }).optional()
  }).describe("Text block.");
  const timerBlockSchema2 = baseBlockSchema.extend({
    type: external_exports.literal("timer"),
    settings: timerBlockSettingsSchema2
  }).describe("Timer block.");
  const socialBlockSchema2 = baseBlockSchema.extend({
    type: external_exports.literal("social"),
    settings: socialBlockSettingsSchema
  }).describe("Social block.");
  const buttonBlockSettingsSchema2 = external_exports.object({
    link: buttonLinkSchema.optional().describe("Button link. Absence removes the link; an explicit empty site link remains present."),
    text: external_exports.string(),
    alignment: buttonAlignmentSchema,
    fixedHeight: buttonFixedHeightSchema.optional(),
    icon: buttonIconSchema.optional(),
    hideElement: hideElementSchema,
    padding: buttonResponsiveSidesSchema,
    margins: buttonResponsiveSidesSchema,
    includeInOutput: outputInclusionSchema,
    anchorLink: buttonAnchorLinkSchema,
    backgroundColor: colorSchemaAllowTransparent3,
    fontFamily: fontFamilySchema,
    fontSize: fontSizeSchema,
    textStyle: buttonsTextStyleSchema,
    fitContainer: responsiveBooleanSchema,
    blockBackgroundColor: colorSchemaAllowTransparent3,
    borderRadius: borderRadiusSchema,
    border: borderSchema2,
    fontColor: colorSchemaDisallowTransparent3
  }).strict().describe("Button block settings.");
  const buttonBlockSchema2 = baseBlockSchema.extend({
    type: external_exports.literal("button"),
    settings: buttonBlockSettingsSchema2
  }).describe("Button block.");
  const spacerBlockSchema2 = baseBlockSchema.extend({
    type: external_exports.literal("spacer"),
    settings: spacerBlockSettingsSchema
  }).describe("Spacer block.");
  const menuBlockSchema2 = baseBlockSchema.extend({
    type: external_exports.literal("menu"),
    settings: menuBlockSettingsSchema2
  }).describe("Menu block.");
  const blockSchema2 = external_exports.discriminatedUnion("type", [
    textBlockSchema2,
    imageBlockSchema,
    videoBlockSchema,
    timerBlockSchema2,
    socialBlockSchema2,
    htmlBlockSchema,
    buttonBlockSchema2,
    spacerBlockSchema2,
    menuBlockSchema2,
    unknownBlockSchema
  ]);
  const containerSettingsSchema = external_exports.object({
    padding: fullResponsiveSidesSchema,
    includeInOutput: outputInclusionSchema,
    hideElement: hideElementSchema,
    backgroundColor: colorSchemaAllowTransparent3,
    backgroundImage: backgroundImageSettingsSchema.optional(),
    border: borderSchema2,
    radius: borderRadiusSchema
  }).strict().describe("Settings for the container element.");
  const containerSchema2 = external_exports.object({
    id: external_exports.string().min(1, "Container ID cannot be empty"),
    settings: containerSettingsSchema,
    moduleId: external_exports.number().optional(),
    blocks: external_exports.array(blockSchema2).optional()
  }).describe("Container that groups blocks.");
  const columnSchema2 = external_exports.object({
    id: external_exports.string().min(1, "Column ID cannot be empty"),
    settings: columnSettingsSchema.optional(),
    containers: external_exports.array(containerSchema2).min(1)
  }).strict().describe("Structure column that groups one or more containers.");
  const structureSettingsSchema = external_exports.object({
    backgroundColor: colorSchemaAllowTransparent3,
    backgroundImage: backgroundImageSettingsSchema.optional(),
    border: borderSchema2,
    borderRadius: borderRadiusSchema,
    columnsGap: responsiveNumberSchema.optional(),
    responsiveMobile: external_exports.boolean().optional(),
    responsiveMobileContainersInversion: external_exports.boolean().optional(),
    padding: fullResponsiveSidesSchema.optional(),
    margins: fullResponsiveSidesSchema.optional(),
    includeInOutput: outputInclusionSchema.optional(),
    hideElement: hideElementSchema.optional()
  }).strict().describe("Structure-level settings.");
  const structureSchema2 = external_exports.object({
    id: external_exports.string().min(1, "Structure ID cannot be empty"),
    settings: structureSettingsSchema.optional(),
    moduleId: external_exports.number().optional(),
    columns: external_exports.array(columnSchema2).min(1).max(MAX_QUANTITY_CONTAINERS).optional()
  }).strict().describe("Structure that groups columns.").superRefine((value, context) => {
    const columnsCount = value.columns?.length ?? 0;
    if ((value.settings?.columnsGap?.mobile ?? 0) > 0 && columnsCount <= 1) {
      context.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: ["settings", "columnsGap", "mobile"],
        message: "Structure mobile columns gap requires more than one column."
      });
    }
    if (value.settings?.responsiveMobile === true && columnsCount <= 1) {
      context.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: ["settings", "responsiveMobile"],
        message: "Responsive structure requires more than one column."
      });
    }
    if (value.settings?.responsiveMobileContainersInversion === true && columnsCount !== 2) {
      context.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: ["settings", "responsiveMobileContainersInversion"],
        message: "Structure containers inversion requires exactly two columns."
      });
    }
  });
  const stripeSettingsSchema2 = external_exports.object({
    messageArea: messageAreaSchema.optional(),
    includeInOutput: outputInclusionSchema.optional(),
    hideElement: hideElementSchema,
    padding: mobilePaddingSchema.optional(),
    stripeBackgroundColor: colorSchemaAllowTransparent3.optional(),
    contentBackgroundColor: colorSchemaAllowTransparent3.optional(),
    backgroundImage: backgroundImageSettingsSchema.optional(),
    contentBorder: borderSchema2.optional()
  }).describe("Stripe-level settings.");
  const stripeSchema2 = external_exports.object({
    id: external_exports.string().min(1, "Stripe ID cannot be empty"),
    settings: stripeSettingsSchema2.optional(),
    moduleId: external_exports.number().optional(),
    structures: external_exports.array(structureSchema2).min(1).optional()
  }).describe("Stripe that groups structures.");
  const emailTemplateSchema2 = external_exports.object({
    metadata: documentMetadataSchema.optional(),
    resources: documentResourcesSchema.optional(),
    settings: canonicalEmailTemplateSettingsSchema2,
    stripes: external_exports.array(stripeSchema2).optional().describe("Stripes in the email template.")
  }).strict().describe("Runtime JSON schema used by the Editor Copilot API.").transform((template) => {
    if (template.resources === void 0) {
      delete template.resources;
    }
    return template;
  });
  return {
    colorSchemaAllowTransparent: colorSchemaAllowTransparent3,
    colorSchemaDisallowTransparent: colorSchemaDisallowTransparent3,
    borderColorSchema: borderColorSchema2,
    borderSideSchema: borderSideSchema2,
    borderSchema: borderSchema2,
    hoverLinkColorSchema: hoverLinkColorSchema2,
    buttonsHoverBorderColorSchema: buttonsHoverBorderColorSchema2,
    buttonsHoverButtonStylesSchema: buttonsHoverButtonStylesSchema2,
    menuItemSchema: menuItemSchema2,
    menuSeparatorSchema: menuSeparatorSchema2,
    timerBlockSettingsSchema: timerBlockSettingsSchema2,
    menuBlockSettingsSchema: menuBlockSettingsSchema2,
    stripesHeaderSectionSettingsSchema: stripesHeaderSectionSettingsSchema2,
    stripesContentSectionSettingsSchema: stripesContentSectionSettingsSchema2,
    stripesFooterSectionSettingsSchema: stripesFooterSectionSettingsSchema2,
    stripesInfoAreaSectionSettingsSchema: stripesInfoAreaSectionSettingsSchema2,
    generalCustomListStylesSchema: generalCustomListStylesSchema2,
    generalSettingsSchema: generalSettingsSchema2,
    stripesSettingsSchema: stripesSettingsSchema2,
    headingsSectionSettingsSchema: headingsSectionSettingsSchema2,
    headingsSettingsSchema: headingsSettingsSchema2,
    buttonsSettingsSchema: buttonsSettingsSchema2,
    textBlockSchema: textBlockSchema2,
    timerBlockSchema: timerBlockSchema2,
    socialBlockSchema: socialBlockSchema2,
    buttonBlockSettingsSchema: buttonBlockSettingsSchema2,
    buttonBlockSchema: buttonBlockSchema2,
    spacerBlockSchema: spacerBlockSchema2,
    menuBlockSchema: menuBlockSchema2,
    blockSchema: blockSchema2,
    containerSettingsSchema,
    containerSchema: containerSchema2,
    columnSchema: columnSchema2,
    structureSettingsSchema,
    structureSchema: structureSchema2,
    stripeSettingsSchema: stripeSettingsSchema2,
    stripeSchema: stripeSchema2,
    emailTemplateSchema: emailTemplateSchema2
  };
}
var {
  colorSchemaAllowTransparent: colorSchemaAllowTransparent2,
  colorSchemaDisallowTransparent: colorSchemaDisallowTransparent2,
  borderColorSchema,
  borderSideSchema,
  borderSchema,
  hoverLinkColorSchema,
  buttonsHoverBorderColorSchema,
  buttonsHoverButtonStylesSchema,
  menuItemSchema,
  menuSeparatorSchema,
  timerBlockSettingsSchema,
  menuBlockSettingsSchema,
  stripesHeaderSectionSettingsSchema,
  stripesContentSectionSettingsSchema,
  stripesFooterSectionSettingsSchema,
  stripesInfoAreaSectionSettingsSchema,
  generalCustomListStylesSchema,
  generalSettingsSchema,
  stripesSettingsSchema,
  headingsSectionSettingsSchema,
  headingsSettingsSchema,
  buttonsSettingsSchema,
  textBlockSchema,
  timerBlockSchema,
  socialBlockSchema,
  buttonBlockSettingsSchema,
  buttonBlockSchema,
  spacerBlockSchema,
  menuBlockSchema,
  blockSchema,
  containerSchema,
  columnSchema,
  structureSchema,
  stripeSettingsSchema,
  stripeSchema,
  emailTemplateSchema
} = createEmailTemplateSchemas();
var EMAIL_TEMPLATE_SCHEMA_DEFINITIONS = {
  documentResources: documentResourcesSchema,
  fontResource: fontResourceSchema,
  colorValueAllowTransparent: colorSchemaAllowTransparent2,
  colorValueDisallowTransparent: colorSchemaDisallowTransparent2,
  backgroundImage: backgroundImageSettingsSchema,
  fullSideValues: fullSideValuesSchema,
  responsivePadding: fullResponsiveSidesSchema,
  responsiveNumber: responsiveNumberSchema,
  spacingValue: spacingValueSchema,
  lineHeight: lineHeightSchema,
  fontSize: fontSizeSchema,
  mobilePadding: mobilePaddingSchema,
  responsiveBoolean: responsiveBooleanSchema,
  hideElement: hideElementSchema,
  outputInclusion: outputInclusionSchema,
  borderWidth: borderWidthSchema,
  borderColor: borderColorSchema,
  borderStyle: borderStyleSchema,
  borderSide: borderSideSchema,
  border: borderSchema,
  hoverLinkColor: hoverLinkColorSchema,
  buttonsHoverBorderColor: buttonsHoverBorderColorSchema,
  buttonsHoverButtonStyles: buttonsHoverButtonStylesSchema,
  borderRadius: borderRadiusSchema,
  headingTextStyle: headingTextStyleSchema,
  headingsAlignment: headingsAlignmentSchema,
  generalCustomListStyles: generalCustomListStylesSchema,
  generalSettings: generalSettingsSchema,
  stripesHeaderConfig: stripesHeaderSectionSettingsSchema,
  stripesContentConfig: stripesContentSectionSettingsSchema,
  stripesFooterConfig: stripesFooterSectionSettingsSchema,
  stripesInfoAreaConfig: stripesInfoAreaSectionSettingsSchema,
  stripesSettings: stripesSettingsSchema,
  headingConfig: headingsSectionSettingsSchema,
  headingsSettings: headingsSettingsSchema,
  buttonsTextStyle: buttonsTextStyleSchema,
  buttonsSettings: buttonsSettingsSchema,
  emailTemplateSettings: canonicalEmailTemplateSettingsSchema,
  stripeSettings: stripeSettingsSchema,
  stripe: stripeSchema,
  documentMetadata: documentMetadataSchema,
  documentMetadataPreheader: documentMetadataPreheaderSchema,
  structure: structureSchema,
  column: columnSchema,
  container: containerSchema,
  block: blockSchema,
  textBlock: textBlockSchema,
  imageBlock: imageBlockSchema,
  videoCustomThumbnail: videoCustomThumbnailSchema,
  videoBlockSettings: videoBlockSettingsSchema,
  videoBlock: videoBlockSchema,
  timerBlockSettings: timerBlockSettingsSchema,
  timerBlock: timerBlockSchema,
  socialBlock: socialBlockSchema,
  htmlBlock: htmlBlockSchema,
  buttonBlockSettings: buttonBlockSettingsSchema,
  buttonBlock: buttonBlockSchema,
  spacerBlock: spacerBlockSchema,
  menuItemType: menuItemTypeSchema,
  menuLink: menuLinkSchema,
  menuImageSize: menuImageSizeSchema,
  menuItemImage: menuItemImageSchema,
  menuItem: menuItemSchema,
  menuSeparator: menuSeparatorSchema,
  menuBlockSettings: menuBlockSettingsSchema,
  menuBlock: menuBlockSchema,
  unknownBlock: unknownBlockSchema
};
function visitDocumentEntityReferences(schema, visit) {
  schema.stripes?.forEach((stripe, stripeIndex) => {
    const stripePath = ["stripes", stripeIndex];
    visit(stripe.id, ["stripe"], stripePath);
    stripe.structures?.forEach((structure, structureIndex) => {
      const structurePath = [...stripePath, "structures", structureIndex];
      visit(structure.id, ["structure"], structurePath);
      structure.columns?.forEach((column, columnIndex) => {
        const columnPath = [...structurePath, "columns", columnIndex];
        visit(column.id, ["column", structure.id], columnPath);
        column.containers.forEach((container, containerIndex) => {
          const containerPath = [...columnPath, "containers", containerIndex];
          visit(container.id, ["container", column.id], containerPath);
          container.blocks?.forEach((block, blockIndex) => {
            visit(block.id, ["block", block.type, container.id, column.id], [...containerPath, "blocks", blockIndex]);
          });
        });
      });
    });
  });
}
function recordDocumentEntityReference(references, id, reference, path) {
  const entityReferences = references.get(id) ?? /* @__PURE__ */ new Map();
  const referenceKey = JSON.stringify(reference);
  const usage = entityReferences.get(referenceKey) ?? { count: 0, maxSiblingCount: 0, siblings: /* @__PURE__ */ new Map() };
  const collectionKey = JSON.stringify(path.slice(0, -1));
  const siblingCount = (usage.siblings.get(collectionKey) ?? 0) + 1;
  usage.siblings.set(collectionKey, siblingCount);
  usage.count++;
  usage.maxSiblingCount = Math.max(usage.maxSiblingCount, siblingCount);
  entityReferences.set(referenceKey, usage);
  references.set(id, entityReferences);
}
function collectImageAlignmentLockStates(schema) {
  const states = /* @__PURE__ */ new Map();
  schema.stripes?.forEach((stripe) => {
    stripe.structures?.forEach((structure) => {
      structure.columns?.forEach((column) => {
        column.containers.forEach((container) => {
          container.blocks?.forEach((block) => {
            if (block.type !== "image" && block.type !== "video" && block.type !== "timer") {
              return;
            }
            states.set(block.id, {
              desktopAlignment: block.settings.alignment.desktop,
              mobileAlignment: block.settings.alignment.mobile
            });
          });
        });
      });
    });
  });
  return states;
}
function createEmailTemplateSetDocumentStateSchema(currentSchema, colorMergeTagValues = /* @__PURE__ */ new Set()) {
  const alignmentLockStates = collectImageAlignmentLockStates(currentSchema);
  const currentReferences = /* @__PURE__ */ new Map();
  visitDocumentEntityReferences(currentSchema, (id, reference, path) => {
    recordDocumentEntityReference(currentReferences, id, reference, path);
  });
  return createEmailTemplateSchemas(colorMergeTagValues).emailTemplateSchema.superRefine((targetSchema, context) => {
    const targetReferences = /* @__PURE__ */ new Map();
    visitDocumentEntityReferences(targetSchema, (id, reference, path) => {
      const seen = targetReferences.get(id);
      recordDocumentEntityReference(targetReferences, id, reference, path);
      if (seen) {
        const sharedStructureColumn = seen.size === 2 && seen.get(JSON.stringify(["structure"]))?.count === 1 && seen.get(JSON.stringify(["column", id]))?.count === 1;
        const known = currentReferences.get(id);
        const existingProjection = [...seen].every(([referenceKey, usage]) => {
          const current = known?.get(referenceKey);
          return current && usage.count <= current.count && usage.maxSiblingCount <= current.maxSiblingCount;
        });
        if (!sharedStructureColumn && !existingProjection) {
          context.addIssue({
            code: external_exports.ZodIssueCode.custom,
            path: [...path, "id"],
            message: 'Duplicate document entity ID "'.concat(id, '".')
          });
        }
      }
    });
    if (targetSchema.metadata?.title !== void 0 && targetSchema.metadata.title !== currentSchema.metadata?.title && targetSchema.metadata.title.length > DOCUMENT_METADATA_TEXT_MAX_LENGTH) {
      context.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: ["metadata", "title"],
        message: "Title cannot exceed ".concat(DOCUMENT_METADATA_TEXT_MAX_LENGTH, " UTF-16 code units.")
      });
    }
    if (targetSchema.metadata?.preheader !== void 0 && targetSchema.metadata.preheader.text !== currentSchema.metadata?.preheader?.text && targetSchema.metadata.preheader.text.length > DOCUMENT_METADATA_TEXT_MAX_LENGTH) {
      context.addIssue({
        code: external_exports.ZodIssueCode.custom,
        path: ["metadata", "preheader", "text"],
        message: "Preheader cannot exceed ".concat(DOCUMENT_METADATA_TEXT_MAX_LENGTH, " UTF-16 code units.")
      });
    }
    targetSchema.stripes?.forEach((stripe, stripeIndex) => {
      stripe.structures?.forEach((structure, structureIndex) => {
        structure.columns?.forEach((column, columnIndex) => {
          column.containers.forEach((container, containerIndex) => {
            const containerWidth = column.settings?.width;
            container.blocks?.forEach((block, blockIndex) => {
              if (block.type !== "image" && block.type !== "video" && block.type !== "timer") {
                return;
              }
              const lockState = alignmentLockStates.get(block.id);
              if (!lockState) {
                return;
              }
              const desktopAvailableWidth = getDesktopImageAvailableWidth(containerWidth, container.settings, block.settings);
              const desktopIsFullWidth = isFullWidthImageSize(block.settings.size.desktop, desktopAvailableWidth);
              if (desktopIsFullWidth && block.settings.alignment.desktop !== lockState.desktopAlignment) {
                context.addIssue({
                  code: external_exports.ZodIssueCode.custom,
                  path: [
                    "stripes",
                    stripeIndex,
                    "structures",
                    structureIndex,
                    "columns",
                    columnIndex,
                    "containers",
                    containerIndex,
                    "blocks",
                    blockIndex,
                    "settings",
                    "alignment",
                    "desktop"
                  ],
                  message: "Desktop image/video alignment cannot be changed while media is full width."
                });
              }
              const mobileAvailableWidth = getMobileImageAvailableWidth(structure.settings, container.settings, block.settings);
              const mobileIsFullWidth = isFullWidthImageSize(block.settings.size.mobile, mobileAvailableWidth);
              if (mobileIsFullWidth && block.settings.alignment.mobile !== lockState.mobileAlignment) {
                context.addIssue({
                  code: external_exports.ZodIssueCode.custom,
                  path: [
                    "stripes",
                    stripeIndex,
                    "structures",
                    structureIndex,
                    "columns",
                    columnIndex,
                    "containers",
                    containerIndex,
                    "blocks",
                    blockIndex,
                    "settings",
                    "alignment",
                    "mobile"
                  ],
                  message: "Mobile image/video alignment cannot be changed while media is full width."
                });
              }
            });
          });
        });
      });
    });
  });
}
function createEmailTemplateUpdateSchema(currentSchema) {
  return createEmailTemplateSetDocumentStateSchema(currentSchema);
}
var ZERO_CONTAINER_SIDE_VALUES = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
var DEFAULT_CONTAINER_BORDER_SETTINGS = {
  top: { width: 0, color: "transparent" },
  right: { width: 0, color: "transparent" },
  bottom: { width: 0, color: "transparent" },
  left: { width: 0, color: "transparent" },
  style: "solid"
};
var DEFAULT_CONTAINER_RADIUS_SETTINGS = {
  topLeft: 0,
  topRight: 0,
  bottomRight: 0,
  bottomLeft: 0
};
var DEFAULT_CONTAINER_SETTINGS = {
  padding: {
    desktop: { ...ZERO_CONTAINER_SIDE_VALUES },
    mobile: { ...ZERO_CONTAINER_SIDE_VALUES }
  },
  includeInOutput: "both",
  hideElement: "no",
  backgroundColor: "transparent",
  border: {
    top: { ...DEFAULT_CONTAINER_BORDER_SETTINGS.top },
    right: { ...DEFAULT_CONTAINER_BORDER_SETTINGS.right },
    bottom: { ...DEFAULT_CONTAINER_BORDER_SETTINGS.bottom },
    left: { ...DEFAULT_CONTAINER_BORDER_SETTINGS.left },
    style: DEFAULT_CONTAINER_BORDER_SETTINGS.style
  },
  radius: { ...DEFAULT_CONTAINER_RADIUS_SETTINGS }
};
var DEFAULT_IMAGE_BLOCK_SETTINGS2 = {
  src: "",
  altText: {
    text: "",
    addToTitle: true
  },
  responsiveMobile: false,
  size: {
    desktop: { mode: "width", px: 100 },
    mobile: { mode: "width", px: 100 }
  },
  alignment: {
    desktop: "center",
    mobile: "center"
  },
  radius: {
    desktop: { ...DEFAULT_CONTAINER_RADIUS_SETTINGS },
    mobile: { ...DEFAULT_CONTAINER_RADIUS_SETTINGS }
  },
  hideElement: "no",
  margins: {
    desktop: { ...ZERO_CONTAINER_SIDE_VALUES },
    mobile: { ...ZERO_CONTAINER_SIDE_VALUES }
  },
  includeInOutput: "both",
  anchorLinkName: ""
};
var DEFAULT_VIDEO_BLOCK_SETTINGS2 = {
  videoLink: "",
  altText: {
    text: "",
    addToTitle: true
  },
  playButtonStyle: "red",
  responsiveMobile: false,
  size: {
    desktop: { mode: "width", px: 100 },
    mobile: { mode: "width", px: 100 }
  },
  alignment: {
    desktop: "center",
    mobile: "center"
  },
  radius: {
    desktop: { ...DEFAULT_CONTAINER_RADIUS_SETTINGS },
    mobile: { ...DEFAULT_CONTAINER_RADIUS_SETTINGS }
  },
  hideElement: "no",
  paddings: {
    desktop: { ...ZERO_CONTAINER_SIDE_VALUES },
    mobile: { ...ZERO_CONTAINER_SIDE_VALUES }
  },
  includeInOutput: "both",
  anchorLinkName: ""
};
var DEFAULT_TIMER_BLOCK_SETTINGS2 = {
  altText: {
    text: "",
    addToTitle: true
  },
  responsiveMobile: false,
  size: {
    desktop: { mode: "width", px: 100 },
    mobile: { mode: "width", px: 100 }
  },
  alignment: {
    desktop: "center",
    mobile: "center"
  },
  margins: {
    desktop: { ...ZERO_CONTAINER_SIDE_VALUES },
    mobile: { ...ZERO_CONTAINER_SIDE_VALUES }
  },
  endDate: "",
  timeZone: "UTC",
  link: null,
  displayDays: true,
  labelsLetterCase: "LOWER",
  separator: ":",
  labelsLanguage: "en",
  retinaDisplaySupport: true,
  expirationImageSrc: "",
  hideElement: "no",
  includeInOutput: "both",
  anchorLinkName: "",
  digitsFontFamily: DEFAULT_TIMER_FONT_FAMILY,
  digitsFontSize: 14,
  digitsFontColor: "#000000",
  labelsFontFamily: DEFAULT_TIMER_FONT_FAMILY,
  labelsFontSize: 14,
  labelsFontColor: "#000000",
  separatorFontFamily: DEFAULT_TIMER_FONT_FAMILY,
  separatorFontSize: 14,
  separatorFontColor: "#000000",
  backgroundColor: "#ffffff"
};
var DEFAULT_SOCIAL_BLOCK_SETTINGS2 = {
  networks: DEFAULT_SOCIAL_BLOCK_SETTINGS.networks.map((network) => ({ ...network })),
  style: DEFAULT_SOCIAL_BLOCK_SETTINGS.style,
  iconSize: DEFAULT_SOCIAL_BLOCK_SETTINGS.iconSize,
  spaceBetweenIcons: { ...DEFAULT_SOCIAL_BLOCK_SETTINGS.spaceBetweenIcons },
  textCustomization: DEFAULT_SOCIAL_BLOCK_SETTINGS.textCustomization,
  alignment: { ...DEFAULT_SOCIAL_BLOCK_SETTINGS.alignment },
  backgroundColor: DEFAULT_SOCIAL_BLOCK_SETTINGS.backgroundColor,
  hideElement: DEFAULT_SOCIAL_BLOCK_SETTINGS.hideElement,
  margins: {
    desktop: { ...DEFAULT_SOCIAL_BLOCK_SETTINGS.margins.desktop },
    mobile: { ...DEFAULT_SOCIAL_BLOCK_SETTINGS.margins.mobile }
  },
  includeInOutput: DEFAULT_SOCIAL_BLOCK_SETTINGS.includeInOutput,
  anchorLinkName: DEFAULT_SOCIAL_BLOCK_SETTINGS.anchorLinkName
};
var DEFAULT_HTML_BLOCK_SETTINGS2 = {
  margins: {
    desktop: { ...ZERO_CONTAINER_SIDE_VALUES },
    mobile: { ...ZERO_CONTAINER_SIDE_VALUES }
  },
  includeInOutput: "both",
  hideElement: "no",
  anchorLinkName: ""
};
var DEFAULT_SPACER_BLOCK_SETTINGS2 = {
  mode: "space",
  width: {
    desktop: { value: 100, unit: "percent" },
    mobile: { value: 100, unit: "percent" }
  },
  height: {
    desktop: 40,
    mobile: 40
  },
  border: {
    size: 1,
    style: "solid",
    color: "#cccccc"
  },
  alignment: {
    desktop: "center",
    mobile: "center"
  },
  backgroundColor: "transparent",
  margins: {
    desktop: { ...ZERO_CONTAINER_SIDE_VALUES },
    mobile: { ...ZERO_CONTAINER_SIDE_VALUES }
  },
  anchorLinkName: "",
  includeInOutput: "both",
  hideElement: "no"
};
var DEFAULT_MENU_BLOCK_SETTINGS2 = {
  responsiveMenu: false,
  itemType: {
    mode: "perItem"
  },
  fitToContainer: true,
  itemPadding: {
    desktop: { ...ZERO_CONTAINER_SIDE_VALUES },
    mobile: { ...ZERO_CONTAINER_SIDE_VALUES }
  },
  margins: {
    desktop: { ...ZERO_CONTAINER_SIDE_VALUES },
    mobile: { ...ZERO_CONTAINER_SIDE_VALUES }
  },
  anchorLinkName: "",
  includeInOutput: "both",
  separator: {
    width: 0,
    style: "none",
    color: "#cccccc"
  },
  fontFamily: "arial,helvetica,sans-serif",
  fontSize: {
    desktop: 14,
    mobile: 14
  },
  hideElement: "no",
  textStyle: {
    bold: false,
    italic: false
  },
  colors: {
    mode: "shared",
    link: "#000000"
  },
  items: [{
    type: "links",
    name: "",
    link: {
      type: "site",
      value: ""
    },
    hideElement: "no"
  }]
};
var ZERO_BUTTON_SIDE_VALUES = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0
};
var DEFAULT_BUTTON_BLOCK_BORDER_SETTINGS = {
  top: { width: 0, color: "transparent" },
  right: { width: 0, color: "transparent" },
  bottom: { width: 0, color: "transparent" },
  left: { width: 0, color: "transparent" },
  style: "solid"
};
var DEFAULT_BUTTON_BLOCK_SETTINGS = {
  link: { type: "site", value: "" },
  text: "",
  alignment: { desktop: "left", mobile: "left" },
  hideElement: "no",
  padding: {
    desktop: { ...ZERO_BUTTON_SIDE_VALUES },
    mobile: { ...ZERO_BUTTON_SIDE_VALUES }
  },
  margins: {
    desktop: { ...ZERO_BUTTON_SIDE_VALUES },
    mobile: { ...ZERO_BUTTON_SIDE_VALUES }
  },
  includeInOutput: "both",
  anchorLink: "",
  backgroundColor: "transparent",
  fontFamily: "arial,helvetica,sans-serif",
  fontSize: { desktop: 14, mobile: 14 },
  textStyle: { bold: false, italic: false },
  fitContainer: { desktop: false, mobile: false },
  blockBackgroundColor: "transparent",
  borderRadius: { ...EMPTY_BORDER_RADIUS },
  border: {
    top: { ...DEFAULT_BUTTON_BLOCK_BORDER_SETTINGS.top },
    right: { ...DEFAULT_BUTTON_BLOCK_BORDER_SETTINGS.right },
    bottom: { ...DEFAULT_BUTTON_BLOCK_BORDER_SETTINGS.bottom },
    left: { ...DEFAULT_BUTTON_BLOCK_BORDER_SETTINGS.left },
    style: DEFAULT_BUTTON_BLOCK_BORDER_SETTINGS.style
  },
  fontColor: "#ffffff"
};
var DEFAULT_TEXT_BLOCK_SETTINGS2 = {
  ...DEFAULT_TEXT_BLOCK_SETTINGS,
  ...DEFAULT_TEXT_BLOCK_SETTINGS.alignment ? { alignment: { ...DEFAULT_TEXT_BLOCK_SETTINGS.alignment } } : {},
  padding: {
    desktop: { ...DEFAULT_TEXT_BLOCK_SETTINGS.padding.desktop },
    mobile: { ...DEFAULT_TEXT_BLOCK_SETTINGS.padding.mobile }
  }
};
function cloneStripeSettings(settings) {
  if (!settings) {
    return void 0;
  }
  return {
    ...settings.messageArea !== void 0 ? { messageArea: settings.messageArea } : {},
    ...settings.includeInOutput !== void 0 ? { includeInOutput: settings.includeInOutput } : {},
    hideElement: settings.hideElement,
    ...settings.padding ? { padding: { mobile: cloneRequiredSideValues(settings.padding.mobile) } } : {},
    ...settings.stripeBackgroundColor !== void 0 ? { stripeBackgroundColor: settings.stripeBackgroundColor } : {},
    ...settings.contentBackgroundColor !== void 0 ? { contentBackgroundColor: settings.contentBackgroundColor } : {},
    ...settings.backgroundImage ? { backgroundImage: cloneBackgroundImageValue(settings.backgroundImage) } : {},
    ...settings.contentBorder ? { contentBorder: cloneBorderValue(settings.contentBorder) } : {}
  };
}
function cloneMessageArea(messageArea) {
  if (!messageArea) {
    return void 0;
  }
  return messageArea;
}
function cloneMessageAlignment(messageAlignment) {
  return messageAlignment;
}
function cloneRecord(record) {
  if (!record) {
    return void 0;
  }
  return {
    ...record
  };
}
function cloneResponsiveNumber(value) {
  return {
    desktop: value.desktop,
    mobile: value.mobile
  };
}
function cloneButtonsBorderRadiusSettings(settings) {
  return {
    topLeft: settings.topLeft,
    topRight: settings.topRight,
    bottomRight: settings.bottomRight,
    bottomLeft: settings.bottomLeft
  };
}
function cloneContainerSettings(settings) {
  return {
    padding: cloneResponsiveValue(settings.padding, cloneRequiredSideValues),
    includeInOutput: settings.includeInOutput,
    hideElement: settings.hideElement,
    backgroundColor: settings.backgroundColor,
    ...settings.backgroundImage ? { backgroundImage: cloneBackgroundImageValue(settings.backgroundImage) } : {},
    border: cloneBorderValue(settings.border),
    radius: cloneButtonsBorderRadiusSettings(settings.radius)
  };
}
function cloneSpacingValue(value) {
  return {
    value: value.value,
    unit: value.unit
  };
}
function cloneEmailTemplateSettings(settings) {
  return canonicalEmailTemplateSettingsSchema.parse(settings);
}
function cloneBaseBlock(baseBlock) {
  return {
    ...baseBlock,
    settings: cloneRecord(baseBlock.settings)
  };
}
function cloneTextBlock(textBlock) {
  const settings = textBlock.settings;
  return {
    ...cloneBaseBlock(textBlock),
    type: "text",
    content: textBlock.content,
    settings: settings ? {
      ...settings.fontColor !== void 0 ? { fontColor: settings.fontColor } : {},
      hideElement: settings.hideElement,
      rightToLeftTextDirection: settings.rightToLeftTextDirection,
      ...settings.alignment ? { alignment: { ...settings.alignment } } : {},
      ...settings.fixedHeight ? {
        fixedHeight: {
          ...settings.fixedHeight.desktop ? {
            desktop: {
              height: settings.fixedHeight.desktop.height,
              ...settings.fixedHeight.desktop.verticalAlignment ? { verticalAlignment: settings.fixedHeight.desktop.verticalAlignment } : {}
            }
          } : {},
          ...settings.fixedHeight.mobile ? {
            mobile: {
              height: settings.fixedHeight.mobile.height,
              ...settings.fixedHeight.mobile.verticalAlignment ? { verticalAlignment: settings.fixedHeight.mobile.verticalAlignment } : {}
            }
          } : {}
        }
      } : {},
      padding: cloneResponsiveValue(settings.padding, cloneRequiredSideValues),
      includeInOutput: settings.includeInOutput,
      backgroundColor: settings.backgroundColor,
      ...settings.letterSpacing ? { letterSpacing: cloneSpacingValue(settings.letterSpacing) } : {}
    } : void 0
  };
}
function cloneImageBlock(imageBlock) {
  return {
    ...cloneBaseBlock(imageBlock),
    type: "image",
    settings: {
      src: imageBlock.settings.src,
      ...imageBlock.settings.link ? {
        link: {
          type: imageBlock.settings.link.type,
          href: imageBlock.settings.link.href
        }
      } : {},
      altText: {
        text: imageBlock.settings.altText.text,
        addToTitle: imageBlock.settings.altText.addToTitle
      },
      responsiveMobile: imageBlock.settings.responsiveMobile,
      size: cloneResponsiveValue(imageBlock.settings.size, (size) => ({
        mode: size.mode,
        px: size.px
      })),
      alignment: {
        desktop: imageBlock.settings.alignment.desktop,
        mobile: imageBlock.settings.alignment.mobile
      },
      radius: {
        desktop: { ...imageBlock.settings.radius.desktop },
        mobile: { ...imageBlock.settings.radius.mobile }
      },
      hideElement: imageBlock.settings.hideElement,
      margins: {
        desktop: cloneRequiredSideValues(imageBlock.settings.margins.desktop),
        mobile: cloneRequiredSideValues(imageBlock.settings.margins.mobile)
      },
      includeInOutput: imageBlock.settings.includeInOutput,
      anchorLinkName: imageBlock.settings.anchorLinkName
    }
  };
}
function cloneVideoBlock(videoBlock) {
  return {
    ...cloneBaseBlock(videoBlock),
    type: "video",
    settings: {
      videoLink: videoBlock.settings.videoLink,
      altText: {
        text: videoBlock.settings.altText.text,
        addToTitle: videoBlock.settings.altText.addToTitle
      },
      ...videoBlock.settings.customThumbnail ? { customThumbnail: { src: videoBlock.settings.customThumbnail.src } } : {},
      playButtonStyle: videoBlock.settings.playButtonStyle,
      responsiveMobile: videoBlock.settings.responsiveMobile,
      size: cloneResponsiveValue(videoBlock.settings.size, (size) => ({
        mode: size.mode,
        px: size.px
      })),
      alignment: {
        desktop: videoBlock.settings.alignment.desktop,
        mobile: videoBlock.settings.alignment.mobile
      },
      radius: {
        desktop: { ...videoBlock.settings.radius.desktop },
        mobile: { ...videoBlock.settings.radius.mobile }
      },
      hideElement: videoBlock.settings.hideElement,
      paddings: {
        desktop: cloneRequiredSideValues(videoBlock.settings.paddings.desktop),
        mobile: cloneRequiredSideValues(videoBlock.settings.paddings.mobile)
      },
      includeInOutput: videoBlock.settings.includeInOutput,
      anchorLinkName: videoBlock.settings.anchorLinkName
    }
  };
}
function cloneTimerBlock(timerBlock) {
  return {
    ...cloneBaseBlock(timerBlock),
    type: "timer",
    settings: {
      altText: {
        text: timerBlock.settings.altText.text,
        addToTitle: timerBlock.settings.altText.addToTitle
      },
      responsiveMobile: timerBlock.settings.responsiveMobile,
      size: cloneResponsiveValue(timerBlock.settings.size, (size) => ({
        mode: size.mode,
        px: size.px
      })),
      alignment: {
        desktop: timerBlock.settings.alignment.desktop,
        mobile: timerBlock.settings.alignment.mobile
      },
      margins: {
        desktop: cloneRequiredSideValues(timerBlock.settings.margins.desktop),
        mobile: cloneRequiredSideValues(timerBlock.settings.margins.mobile)
      },
      endDate: timerBlock.settings.endDate,
      timeZone: timerBlock.settings.timeZone,
      link: timerBlock.settings.link ? {
        type: timerBlock.settings.link.type,
        href: timerBlock.settings.link.href
      } : null,
      displayDays: timerBlock.settings.displayDays,
      ...timerBlock.settings.labelsLetterCase !== void 0 ? { labelsLetterCase: timerBlock.settings.labelsLetterCase } : {},
      separator: timerBlock.settings.separator,
      labelsLanguage: timerBlock.settings.labelsLanguage,
      retinaDisplaySupport: timerBlock.settings.retinaDisplaySupport,
      expirationImageSrc: timerBlock.settings.expirationImageSrc,
      hideElement: timerBlock.settings.hideElement,
      includeInOutput: timerBlock.settings.includeInOutput,
      anchorLinkName: timerBlock.settings.anchorLinkName,
      digitsFontFamily: timerBlock.settings.digitsFontFamily,
      digitsFontSize: timerBlock.settings.digitsFontSize,
      digitsFontColor: timerBlock.settings.digitsFontColor,
      ...timerBlock.settings.digitsAdvancedColorSettings ? { digitsAdvancedColorSettings: { ...timerBlock.settings.digitsAdvancedColorSettings } } : {},
      labelsFontFamily: timerBlock.settings.labelsFontFamily,
      labelsFontSize: timerBlock.settings.labelsFontSize,
      labelsFontColor: timerBlock.settings.labelsFontColor,
      ...timerBlock.settings.labelsAdvancedColorSettings ? { labelsAdvancedColorSettings: { ...timerBlock.settings.labelsAdvancedColorSettings } } : {},
      separatorFontFamily: timerBlock.settings.separatorFontFamily,
      separatorFontSize: timerBlock.settings.separatorFontSize,
      separatorFontColor: timerBlock.settings.separatorFontColor,
      backgroundColor: timerBlock.settings.backgroundColor
    }
  };
}
function cloneSocialBlock(socialBlock) {
  return {
    ...cloneBaseBlock(socialBlock),
    type: "social",
    settings: {
      networks: socialBlock.settings.networks.map((network) => ({
        type: network.type,
        ...network.link ? { link: { ...network.link } } : {},
        ...network.icon !== void 0 ? { icon: network.icon } : {},
        title: network.title,
        ...network.alt !== void 0 ? { alt: network.alt } : {}
      })),
      style: socialBlock.settings.style,
      iconSize: socialBlock.settings.iconSize,
      spaceBetweenIcons: {
        desktop: socialBlock.settings.spaceBetweenIcons.desktop,
        mobile: socialBlock.settings.spaceBetweenIcons.mobile
      },
      textCustomization: socialBlock.settings.textCustomization,
      alignment: {
        desktop: socialBlock.settings.alignment.desktop,
        mobile: socialBlock.settings.alignment.mobile
      },
      backgroundColor: socialBlock.settings.backgroundColor,
      hideElement: socialBlock.settings.hideElement,
      margins: {
        desktop: cloneRequiredSideValues(socialBlock.settings.margins.desktop),
        mobile: cloneRequiredSideValues(socialBlock.settings.margins.mobile)
      },
      includeInOutput: socialBlock.settings.includeInOutput,
      anchorLinkName: socialBlock.settings.anchorLinkName
    }
  };
}
function cloneHtmlBlock(htmlBlock) {
  return {
    ...cloneBaseBlock(htmlBlock),
    type: "html",
    content: htmlBlock.content,
    settings: {
      margins: {
        desktop: cloneRequiredSideValues(htmlBlock.settings.margins.desktop),
        mobile: cloneRequiredSideValues(htmlBlock.settings.margins.mobile)
      },
      includeInOutput: htmlBlock.settings.includeInOutput,
      hideElement: htmlBlock.settings.hideElement,
      anchorLinkName: htmlBlock.settings.anchorLinkName
    }
  };
}
function cloneButtonLinkSettings(link) {
  return link.type === "salesforce_mc" ? {
    ...link,
    salesforce: { ...link.salesforce }
  } : { ...link };
}
function cloneButtonBlockSettings(settings) {
  return {
    ...settings?.link !== void 0 ? { link: cloneButtonLinkSettings(settings.link) } : {},
    text: settings?.text ?? DEFAULT_BUTTON_BLOCK_SETTINGS.text,
    alignment: settings?.alignment ? cloneResponsiveValue(settings.alignment) : cloneResponsiveValue(DEFAULT_BUTTON_BLOCK_SETTINGS.alignment),
    ...settings?.fixedHeight ? { fixedHeight: { ...settings.fixedHeight } } : {},
    ...settings?.icon ? { icon: { ...settings.icon } } : {},
    hideElement: settings?.hideElement ?? DEFAULT_BUTTON_BLOCK_SETTINGS.hideElement,
    padding: cloneResponsiveValue(settings?.padding ?? DEFAULT_BUTTON_BLOCK_SETTINGS.padding, cloneRequiredSideValues),
    margins: cloneResponsiveValue(settings?.margins ?? DEFAULT_BUTTON_BLOCK_SETTINGS.margins, cloneRequiredSideValues),
    includeInOutput: settings?.includeInOutput ?? DEFAULT_BUTTON_BLOCK_SETTINGS.includeInOutput,
    anchorLink: settings?.anchorLink ?? DEFAULT_BUTTON_BLOCK_SETTINGS.anchorLink,
    backgroundColor: settings?.backgroundColor ?? DEFAULT_BUTTON_BLOCK_SETTINGS.backgroundColor,
    fontFamily: settings?.fontFamily ?? DEFAULT_BUTTON_BLOCK_SETTINGS.fontFamily,
    fontSize: settings?.fontSize ? cloneResponsiveValue(settings.fontSize) : cloneResponsiveValue(DEFAULT_BUTTON_BLOCK_SETTINGS.fontSize),
    textStyle: settings?.textStyle ? cloneTextStyleValue(settings.textStyle) : cloneTextStyleValue(DEFAULT_BUTTON_BLOCK_SETTINGS.textStyle),
    fitContainer: settings?.fitContainer ? cloneResponsiveValue(settings.fitContainer) : cloneResponsiveValue(DEFAULT_BUTTON_BLOCK_SETTINGS.fitContainer),
    blockBackgroundColor: settings?.blockBackgroundColor ?? DEFAULT_BUTTON_BLOCK_SETTINGS.blockBackgroundColor,
    borderRadius: settings?.borderRadius ? { ...settings.borderRadius } : { ...DEFAULT_BUTTON_BLOCK_SETTINGS.borderRadius },
    border: settings?.border ? cloneBorderValue(settings.border) : cloneBorderValue(DEFAULT_BUTTON_BLOCK_SETTINGS.border),
    fontColor: settings?.fontColor ?? DEFAULT_BUTTON_BLOCK_SETTINGS.fontColor
  };
}
function cloneButtonBlock(buttonBlock) {
  return {
    ...cloneBaseBlock(buttonBlock),
    type: "button",
    settings: cloneButtonBlockSettings(buttonBlock.settings)
  };
}
function cloneSpacerBlock(spacerBlock) {
  return {
    ...cloneBaseBlock(spacerBlock),
    type: "spacer",
    settings: {
      mode: spacerBlock.settings.mode,
      ...spacerBlock.settings.width ? {
        width: cloneResponsiveValue(spacerBlock.settings.width, (width) => ({
          value: width.value,
          unit: width.unit
        }))
      } : {},
      ...spacerBlock.settings.height ? { height: { ...spacerBlock.settings.height } } : {},
      ...spacerBlock.settings.border ? { border: { ...spacerBlock.settings.border } } : {},
      ...spacerBlock.settings.mobileBorder !== void 0 ? { mobileBorder: spacerBlock.settings.mobileBorder === null ? null : { ...spacerBlock.settings.mobileBorder } } : {},
      ...spacerBlock.settings.alignment ? { alignment: { ...spacerBlock.settings.alignment } } : {},
      backgroundColor: spacerBlock.settings.backgroundColor,
      margins: {
        desktop: cloneRequiredSideValues(spacerBlock.settings.margins.desktop),
        mobile: cloneRequiredSideValues(spacerBlock.settings.margins.mobile)
      },
      anchorLinkName: spacerBlock.settings.anchorLinkName,
      includeInOutput: spacerBlock.settings.includeInOutput,
      hideElement: spacerBlock.settings.hideElement
    }
  };
}
function cloneMenuItemImageSettings(image) {
  if (!image) {
    return void 0;
  }
  return {
    src: image.src,
    size: {
      mode: image.size.mode,
      px: image.size.px
    },
    alignment: image.alignment,
    indent: image.indent,
    altText: image.altText
  };
}
function cloneMenuItemSettings(item) {
  return {
    ...item.type !== void 0 ? { type: item.type } : {},
    name: item.name,
    link: {
      type: item.link.type,
      value: item.link.value
    },
    ...item.image ? { image: cloneMenuItemImageSettings(item.image) } : {},
    hideElement: item.hideElement,
    ...item.colors ? { colors: { ...item.colors } } : {}
  };
}
function cloneMenuBlockSettings(settings) {
  return {
    responsiveMenu: settings?.responsiveMenu ?? DEFAULT_MENU_BLOCK_SETTINGS2.responsiveMenu,
    itemType: settings?.itemType ? { ...settings.itemType } : { ...DEFAULT_MENU_BLOCK_SETTINGS2.itemType },
    fitToContainer: settings?.fitToContainer ?? DEFAULT_MENU_BLOCK_SETTINGS2.fitToContainer,
    itemPadding: cloneResponsiveValue(settings?.itemPadding ?? DEFAULT_MENU_BLOCK_SETTINGS2.itemPadding, cloneRequiredSideValues),
    margins: cloneResponsiveValue(settings?.margins ?? DEFAULT_MENU_BLOCK_SETTINGS2.margins, cloneRequiredSideValues),
    anchorLinkName: settings?.anchorLinkName ?? DEFAULT_MENU_BLOCK_SETTINGS2.anchorLinkName,
    includeInOutput: settings?.includeInOutput ?? DEFAULT_MENU_BLOCK_SETTINGS2.includeInOutput,
    separator: {
      width: settings?.separator?.width ?? DEFAULT_MENU_BLOCK_SETTINGS2.separator.width,
      style: settings?.separator?.style ?? DEFAULT_MENU_BLOCK_SETTINGS2.separator.style,
      color: settings?.separator?.color ?? DEFAULT_MENU_BLOCK_SETTINGS2.separator.color
    },
    fontFamily: settings?.fontFamily ?? DEFAULT_MENU_BLOCK_SETTINGS2.fontFamily,
    fontSize: settings?.fontSize ? cloneResponsiveValue(settings.fontSize) : cloneResponsiveValue(DEFAULT_MENU_BLOCK_SETTINGS2.fontSize),
    hideElement: settings?.hideElement ?? DEFAULT_MENU_BLOCK_SETTINGS2.hideElement,
    textStyle: settings?.textStyle ? cloneTextStyleValue(settings.textStyle) : cloneTextStyleValue(DEFAULT_MENU_BLOCK_SETTINGS2.textStyle),
    colors: settings?.colors ? { ...settings.colors } : { ...DEFAULT_MENU_BLOCK_SETTINGS2.colors },
    items: settings?.items?.map(cloneMenuItemSettings) ?? DEFAULT_MENU_BLOCK_SETTINGS2.items.map(cloneMenuItemSettings)
  };
}
function cloneMenuBlock(menuBlock) {
  return {
    ...cloneBaseBlock(menuBlock),
    type: "menu",
    settings: cloneMenuBlockSettings(menuBlock.settings)
  };
}
function cloneUnknownBlock(unknownBlock) {
  return {
    ...cloneBaseBlock(unknownBlock),
    type: "unknown",
    content: unknownBlock.content,
    extension: unknownBlock.extension
  };
}
function cloneBlock(block) {
  switch (block.type) {
    case "text":
      return cloneTextBlock(block);
    case "image":
      return cloneImageBlock(block);
    case "video":
      return cloneVideoBlock(block);
    case "timer":
      return cloneTimerBlock(block);
    case "social":
      return cloneSocialBlock(block);
    case "html":
      return cloneHtmlBlock(block);
    case "button":
      return cloneButtonBlock(block);
    case "spacer":
      return cloneSpacerBlock(block);
    case "menu":
      return cloneMenuBlock(block);
    case "unknown":
      return cloneUnknownBlock(block);
    default: {
      const _exhaustiveCheck = block;
      return _exhaustiveCheck;
    }
  }
}
function cloneBlocks(blocks) {
  if (!blocks) {
    return void 0;
  }
  return blocks.map(cloneBlock);
}
function cloneContainer(container) {
  return {
    id: container.id,
    settings: cloneContainerSettings(container.settings),
    ...container.moduleId !== void 0 ? { moduleId: container.moduleId } : {},
    ...container.blocks !== void 0 ? { blocks: cloneBlocks(container.blocks) } : {}
  };
}
function cloneContainers(containers) {
  if (!containers) {
    return void 0;
  }
  return containers.map(cloneContainer);
}
function cloneColumn(column) {
  return {
    id: column.id,
    ...column.settings ? { settings: cloneColumnSettings(column.settings) } : {},
    containers: cloneContainers(column.containers) ?? []
  };
}
function cloneColumnSettings(settings) {
  if (!settings) {
    return void 0;
  }
  return {
    width: settings.width
  };
}
function cloneColumns(columns) {
  if (!columns) {
    return void 0;
  }
  return columns.map(cloneColumn);
}
function cloneStructure(structure) {
  return {
    id: structure.id,
    ...structure.settings ? { settings: cloneStructureSettings(structure.settings) } : {},
    ...structure.moduleId !== void 0 ? { moduleId: structure.moduleId } : {},
    ...structure.columns ? { columns: cloneColumns(structure.columns) } : {}
  };
}
function cloneStructureSettings(settings) {
  if (!settings) {
    return void 0;
  }
  return {
    backgroundColor: settings.backgroundColor ?? "transparent",
    ...settings.backgroundImage ? { backgroundImage: cloneBackgroundImageValue(settings.backgroundImage) } : {},
    border: cloneBorderValue(settings.border ?? EMPTY_BORDER_SETTINGS),
    borderRadius: cloneButtonsBorderRadiusSettings(settings.borderRadius ?? EMPTY_BORDER_RADIUS),
    ...settings.columnsGap ? { columnsGap: cloneResponsiveNumber(settings.columnsGap) } : {},
    ...settings.responsiveMobile !== void 0 ? { responsiveMobile: settings.responsiveMobile } : {},
    ...settings.responsiveMobileContainersInversion !== void 0 ? { responsiveMobileContainersInversion: settings.responsiveMobileContainersInversion } : {},
    ...settings.padding ? { padding: cloneResponsiveValue(settings.padding, cloneRequiredSideValues) } : {},
    ...settings.margins ? { margins: cloneResponsiveValue(settings.margins, cloneRequiredSideValues) } : {},
    ...settings.includeInOutput !== void 0 ? { includeInOutput: settings.includeInOutput } : {},
    ...settings.hideElement !== void 0 ? { hideElement: settings.hideElement } : {}
  };
}
function cloneStructures(structures) {
  if (!structures) {
    return void 0;
  }
  return structures.map(cloneStructure);
}
function cloneStripe(stripe) {
  return {
    id: stripe.id,
    settings: cloneStripeSettings(stripe.settings),
    ...stripe.moduleId !== void 0 ? { moduleId: stripe.moduleId } : {},
    ...stripe.structures ? { structures: cloneStructures(stripe.structures) } : {}
  };
}
function cloneStripes(stripes) {
  if (!stripes) {
    return void 0;
  }
  return stripes.map(cloneStripe);
}
function cloneEmailTemplate(emailTemplate) {
  return {
    ...emailTemplate.resources?.fonts?.length ? { resources: { fonts: emailTemplate.resources.fonts.map((resource) => ({ ...resource })) } } : {},
    ...emailTemplate.metadata ? {
      metadata: {
        ...emailTemplate.metadata.title !== void 0 ? { title: emailTemplate.metadata.title } : {},
        ...emailTemplate.metadata.preheader ? { preheader: { ...emailTemplate.metadata.preheader } } : {}
      }
    } : {},
    settings: cloneEmailTemplateSettings(emailTemplate.settings),
    stripes: cloneStripes(emailTemplate.stripes)
  };
}

export {
  EMPTY_BORDER_SETTINGS,
  DEFAULT_TEXT_BLOCK_SETTINGS,
  DEFAULT_VIDEO_BLOCK_SETTINGS,
  borderWidthSchema,
  borderStyleSchema,
  TEXT_BLOCK_FIXED_HEIGHT_MODE_DESCRIPTION,
  TEXT_BLOCK_FIXED_HEIGHT_DESCRIPTION,
  TEXT_TRANSFORM_VALUES,
  STRUCTURE_WIDTH_COLUMNS_DESCRIPTION,
  DOCUMENT_METADATA_TITLE_DESCRIPTION,
  fontResourceSchema,
  fontResourcesSchema,
  createEmailTemplateSchemas,
  colorSchemaAllowTransparent2 as colorSchemaAllowTransparent,
  colorSchemaDisallowTransparent2 as colorSchemaDisallowTransparent,
  borderColorSchema,
  blockSchema,
  containerSchema,
  columnSchema,
  structureSchema,
  stripeSchema,
  emailTemplateSchema,
  EMAIL_TEMPLATE_SCHEMA_DEFINITIONS,
  createEmailTemplateSetDocumentStateSchema,
  createEmailTemplateUpdateSchema,
  DEFAULT_CONTAINER_SETTINGS,
  DEFAULT_IMAGE_BLOCK_SETTINGS2 as DEFAULT_IMAGE_BLOCK_SETTINGS,
  DEFAULT_VIDEO_BLOCK_SETTINGS2,
  DEFAULT_TIMER_BLOCK_SETTINGS2 as DEFAULT_TIMER_BLOCK_SETTINGS,
  DEFAULT_SOCIAL_BLOCK_SETTINGS2 as DEFAULT_SOCIAL_BLOCK_SETTINGS,
  DEFAULT_HTML_BLOCK_SETTINGS2 as DEFAULT_HTML_BLOCK_SETTINGS,
  DEFAULT_SPACER_BLOCK_SETTINGS2 as DEFAULT_SPACER_BLOCK_SETTINGS,
  DEFAULT_MENU_BLOCK_SETTINGS2 as DEFAULT_MENU_BLOCK_SETTINGS,
  DEFAULT_BUTTON_BLOCK_SETTINGS,
  DEFAULT_TEXT_BLOCK_SETTINGS2,
  cloneMessageArea,
  cloneMessageAlignment,
  cloneEmailTemplateSettings,
  cloneBaseBlock,
  cloneTextBlock,
  cloneImageBlock,
  cloneVideoBlock,
  cloneTimerBlock,
  cloneSocialBlock,
  cloneHtmlBlock,
  cloneButtonBlockSettings,
  cloneButtonBlock,
  cloneSpacerBlock,
  cloneMenuBlockSettings,
  cloneMenuBlock,
  cloneUnknownBlock,
  cloneBlock,
  cloneBlocks,
  cloneContainer,
  cloneContainers,
  cloneColumn,
  cloneColumns,
  cloneStructure,
  cloneStructures,
  cloneStripe,
  cloneStripes,
  cloneEmailTemplate
};

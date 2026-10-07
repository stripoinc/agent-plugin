import {
  DecodingMode,
  EntityDecoder,
  decodeHTML,
  xmlDecodeTree
} from "./decode-codepoint-de4ce2c8771f.mjs";
import {
  htmlDecodeTree
} from "./decode-data-html-482e5b7a6675.mjs";

// editor/ui-editor-ui/node_modules/htmlparser2/dist/Tokenizer.js
var CharCodes;
(function(CharCodes2) {
  CharCodes2[CharCodes2["Tab"] = 9] = "Tab";
  CharCodes2[CharCodes2["NewLine"] = 10] = "NewLine";
  CharCodes2[CharCodes2["FormFeed"] = 12] = "FormFeed";
  CharCodes2[CharCodes2["CarriageReturn"] = 13] = "CarriageReturn";
  CharCodes2[CharCodes2["Space"] = 32] = "Space";
  CharCodes2[CharCodes2["ExclamationMark"] = 33] = "ExclamationMark";
  CharCodes2[CharCodes2["Number"] = 35] = "Number";
  CharCodes2[CharCodes2["Amp"] = 38] = "Amp";
  CharCodes2[CharCodes2["SingleQuote"] = 39] = "SingleQuote";
  CharCodes2[CharCodes2["DoubleQuote"] = 34] = "DoubleQuote";
  CharCodes2[CharCodes2["Dash"] = 45] = "Dash";
  CharCodes2[CharCodes2["Slash"] = 47] = "Slash";
  CharCodes2[CharCodes2["Zero"] = 48] = "Zero";
  CharCodes2[CharCodes2["Nine"] = 57] = "Nine";
  CharCodes2[CharCodes2["Semi"] = 59] = "Semi";
  CharCodes2[CharCodes2["Lt"] = 60] = "Lt";
  CharCodes2[CharCodes2["Eq"] = 61] = "Eq";
  CharCodes2[CharCodes2["Gt"] = 62] = "Gt";
  CharCodes2[CharCodes2["Questionmark"] = 63] = "Questionmark";
  CharCodes2[CharCodes2["UpperA"] = 65] = "UpperA";
  CharCodes2[CharCodes2["LowerA"] = 97] = "LowerA";
  CharCodes2[CharCodes2["UpperF"] = 70] = "UpperF";
  CharCodes2[CharCodes2["LowerF"] = 102] = "LowerF";
  CharCodes2[CharCodes2["UpperZ"] = 90] = "UpperZ";
  CharCodes2[CharCodes2["LowerZ"] = 122] = "LowerZ";
  CharCodes2[CharCodes2["LowerX"] = 120] = "LowerX";
  CharCodes2[CharCodes2["OpeningSquareBracket"] = 91] = "OpeningSquareBracket";
})(CharCodes || (CharCodes = {}));
var State;
(function(State2) {
  State2[State2["Text"] = 1] = "Text";
  State2[State2["BeforeTagName"] = 2] = "BeforeTagName";
  State2[State2["InTagName"] = 3] = "InTagName";
  State2[State2["InSelfClosingTag"] = 4] = "InSelfClosingTag";
  State2[State2["BeforeClosingTagName"] = 5] = "BeforeClosingTagName";
  State2[State2["InClosingTagName"] = 6] = "InClosingTagName";
  State2[State2["AfterClosingTagName"] = 7] = "AfterClosingTagName";
  State2[State2["BeforeAttributeName"] = 8] = "BeforeAttributeName";
  State2[State2["InAttributeName"] = 9] = "InAttributeName";
  State2[State2["AfterAttributeName"] = 10] = "AfterAttributeName";
  State2[State2["BeforeAttributeValue"] = 11] = "BeforeAttributeValue";
  State2[State2["InAttributeValueDq"] = 12] = "InAttributeValueDq";
  State2[State2["InAttributeValueSq"] = 13] = "InAttributeValueSq";
  State2[State2["InAttributeValueNq"] = 14] = "InAttributeValueNq";
  State2[State2["BeforeDeclaration"] = 15] = "BeforeDeclaration";
  State2[State2["InDeclaration"] = 16] = "InDeclaration";
  State2[State2["InProcessingInstruction"] = 17] = "InProcessingInstruction";
  State2[State2["BeforeComment"] = 18] = "BeforeComment";
  State2[State2["CDATASequence"] = 19] = "CDATASequence";
  State2[State2["DeclarationSequence"] = 20] = "DeclarationSequence";
  State2[State2["InSpecialComment"] = 21] = "InSpecialComment";
  State2[State2["InCommentLike"] = 22] = "InCommentLike";
  State2[State2["SpecialStartSequence"] = 23] = "SpecialStartSequence";
  State2[State2["InSpecialTag"] = 24] = "InSpecialTag";
  State2[State2["InPlainText"] = 25] = "InPlainText";
  State2[State2["InEntity"] = 26] = "InEntity";
})(State || (State = {}));
function isWhitespace(c) {
  return c === CharCodes.Space || c === CharCodes.NewLine || c === CharCodes.Tab || c === CharCodes.FormFeed || c === CharCodes.CarriageReturn;
}
function isEndOfTagSection(c) {
  return c === CharCodes.Slash || c === CharCodes.Gt || isWhitespace(c);
}
function isASCIIAlpha(c) {
  return c >= CharCodes.LowerA && c <= CharCodes.LowerZ || c >= CharCodes.UpperA && c <= CharCodes.UpperZ;
}
var QuoteType;
(function(QuoteType2) {
  QuoteType2[QuoteType2["NoValue"] = 0] = "NoValue";
  QuoteType2[QuoteType2["Unquoted"] = 1] = "Unquoted";
  QuoteType2[QuoteType2["Single"] = 2] = "Single";
  QuoteType2[QuoteType2["Double"] = 3] = "Double";
})(QuoteType || (QuoteType = {}));
var Sequences = {
  Empty: new Uint8Array(0),
  Cdata: new Uint8Array([67, 68, 65, 84, 65, 91]),
  // CDATA[
  CdataEnd: new Uint8Array([93, 93, 62]),
  // ]]>
  CommentEnd: new Uint8Array([45, 45, 33, 62]),
  // `--!>`
  Doctype: new Uint8Array([100, 111, 99, 116, 121, 112, 101]),
  // `doctype`
  IframeEnd: new Uint8Array([60, 47, 105, 102, 114, 97, 109, 101]),
  // `</iframe`
  NoembedEnd: new Uint8Array([
    60,
    47,
    110,
    111,
    101,
    109,
    98,
    101,
    100
  ]),
  // `</noembed`
  NoframesEnd: new Uint8Array([
    60,
    47,
    110,
    111,
    102,
    114,
    97,
    109,
    101,
    115
  ]),
  // `</noframes`
  Plaintext: new Uint8Array([
    60,
    47,
    112,
    108,
    97,
    105,
    110,
    116,
    101,
    120,
    116
  ]),
  // `</plaintext`
  ScriptEnd: new Uint8Array([60, 47, 115, 99, 114, 105, 112, 116]),
  // `<\/script`
  StyleEnd: new Uint8Array([60, 47, 115, 116, 121, 108, 101]),
  // `</style`
  TitleEnd: new Uint8Array([60, 47, 116, 105, 116, 108, 101]),
  // `</title`
  TextareaEnd: new Uint8Array([
    60,
    47,
    116,
    101,
    120,
    116,
    97,
    114,
    101,
    97
  ]),
  // `</textarea`
  XmpEnd: new Uint8Array([60, 47, 120, 109, 112])
  // `</xmp`
};
var specialStartSequences = /* @__PURE__ */ new Map([
  [Sequences.IframeEnd[2], Sequences.IframeEnd],
  [Sequences.NoembedEnd[2], Sequences.NoembedEnd],
  [Sequences.Plaintext[2], Sequences.Plaintext],
  [Sequences.ScriptEnd[2], Sequences.ScriptEnd],
  [Sequences.TitleEnd[2], Sequences.TitleEnd],
  [Sequences.XmpEnd[2], Sequences.XmpEnd]
]);
var Tokenizer = class {
  cbs;
  /** The current state the tokenizer is in. */
  state = State.Text;
  /** The read buffer. */
  buffer = "";
  /** The beginning of the section that is currently being read. */
  sectionStart = 0;
  /** The index within the buffer that we are currently looking at. */
  index = 0;
  /** The start of the last entity. */
  entityStart = 0;
  /** Some behavior, eg. when decoding entities, is done while we are in another state. This keeps track of the other state type. */
  baseState = State.Text;
  /** For special parsing behavior inside of script and style tags. */
  isSpecial = false;
  /** Indicates whether the tokenizer has been paused. */
  running = true;
  /** The offset of the current buffer. */
  offset = 0;
  xmlMode;
  decodeEntities;
  recognizeSelfClosing;
  entityDecoder;
  constructor({ xmlMode = false, decodeEntities = true, recognizeSelfClosing = xmlMode }, cbs) {
    this.cbs = cbs;
    this.xmlMode = xmlMode;
    this.decodeEntities = decodeEntities;
    this.recognizeSelfClosing = recognizeSelfClosing;
    this.entityDecoder = new EntityDecoder(xmlMode ? xmlDecodeTree : htmlDecodeTree, (cp, consumed) => this.emitCodePoint(cp, consumed));
  }
  reset() {
    this.state = State.Text;
    this.buffer = "";
    this.sectionStart = 0;
    this.index = 0;
    this.baseState = State.Text;
    this.isSpecial = false;
    this.currentSequence = Sequences.Empty;
    this.sequenceIndex = 0;
    this.running = true;
    this.offset = 0;
  }
  write(chunk) {
    this.offset += this.buffer.length;
    this.buffer = chunk;
    this.parse();
  }
  end() {
    if (this.running)
      this.finish();
  }
  pause() {
    this.running = false;
  }
  resume() {
    this.running = true;
    if (this.index < this.buffer.length + this.offset) {
      this.parse();
    }
  }
  stateText(c) {
    if (c === CharCodes.Lt || !this.decodeEntities && this.fastForwardTo(CharCodes.Lt)) {
      if (this.index > this.sectionStart) {
        this.cbs.ontext(this.sectionStart, this.index);
      }
      this.state = State.BeforeTagName;
      this.sectionStart = this.index;
    } else if (this.decodeEntities && c === CharCodes.Amp) {
      this.startEntity();
    }
  }
  currentSequence = Sequences.Empty;
  sequenceIndex = 0;
  enterTagBody() {
    if (this.currentSequence === Sequences.Plaintext) {
      this.currentSequence = Sequences.Empty;
      this.state = State.InPlainText;
    } else if (this.isSpecial) {
      this.state = State.InSpecialTag;
      this.sequenceIndex = 0;
    } else {
      this.state = State.Text;
    }
  }
  /**
   * Match the opening tag name against an HTML text-only tag sequence.
   *
   * Some tags share an initial prefix (`script`/`style`, `title`/`textarea`,
   * `noembed`/`noframes`), so we may switch to an alternate sequence at the
   * first distinguishing byte.  On a successful full match we fall back to
   * the normal tag-name state; a later `>` will enter raw-text, RCDATA, or
   * plaintext mode based on `currentSequence` / `isSpecial`.
   * @param c Current character code point.
   */
  stateSpecialStartSequence(c) {
    const lower = c | 32;
    if (this.sequenceIndex < this.currentSequence.length) {
      if (lower === this.currentSequence[this.sequenceIndex]) {
        this.sequenceIndex++;
        return;
      }
      if (this.sequenceIndex === 3) {
        if (this.currentSequence === Sequences.ScriptEnd && lower === Sequences.StyleEnd[3]) {
          this.currentSequence = Sequences.StyleEnd;
          this.sequenceIndex = 4;
          return;
        }
        if (this.currentSequence === Sequences.TitleEnd && lower === Sequences.TextareaEnd[3]) {
          this.currentSequence = Sequences.TextareaEnd;
          this.sequenceIndex = 4;
          return;
        }
      } else if (this.sequenceIndex === 4 && this.currentSequence === Sequences.NoembedEnd && lower === Sequences.NoframesEnd[4]) {
        this.currentSequence = Sequences.NoframesEnd;
        this.sequenceIndex = 5;
        return;
      }
    } else if (isEndOfTagSection(c)) {
      this.sequenceIndex = 0;
      this.state = State.InTagName;
      this.stateInTagName(c);
      return;
    }
    this.isSpecial = false;
    this.currentSequence = Sequences.Empty;
    this.sequenceIndex = 0;
    this.state = State.InTagName;
    this.stateInTagName(c);
  }
  stateCDATASequence(c) {
    if (c === Sequences.Cdata[this.sequenceIndex]) {
      if (++this.sequenceIndex === Sequences.Cdata.length) {
        this.state = State.InCommentLike;
        this.currentSequence = Sequences.CdataEnd;
        this.sequenceIndex = 0;
        this.sectionStart = this.index + 1;
      }
    } else {
      this.sequenceIndex = 0;
      if (this.xmlMode) {
        this.state = State.InDeclaration;
        this.stateInDeclaration(c);
      } else {
        this.state = State.InSpecialComment;
        this.stateInSpecialComment(c);
      }
    }
  }
  /**
   * When we wait for one specific character, we can speed things up
   * by skipping through the buffer until we find it.
   * @param c Current character code point.
   * @returns Whether the character was found.
   */
  fastForwardTo(c) {
    while (++this.index < this.buffer.length + this.offset) {
      if (this.buffer.charCodeAt(this.index - this.offset) === c) {
        return true;
      }
    }
    this.index = this.buffer.length + this.offset - 1;
    return false;
  }
  /**
   * Emit a comment token and return to the text state.
   * @param offset Number of characters in the end sequence that have already been matched.
   */
  emitComment(offset) {
    this.cbs.oncomment(this.sectionStart, this.index, offset);
    this.sequenceIndex = 0;
    this.sectionStart = this.index + 1;
    this.state = State.Text;
  }
  /**
   * Comments and CDATA end with `-->` and `]]>`.
   *
   * Their common qualities are:
   * - Their end sequences have a distinct character they start with.
   * - That character is then repeated, so we have to check multiple repeats.
   * - All characters but the start character of the sequence can be skipped.
   * @param c Current character code point.
   */
  stateInCommentLike(c) {
    if (!this.xmlMode && this.currentSequence === Sequences.CommentEnd && this.sequenceIndex <= 1 && /*
     * We're still at the very start of the comment: the only
     * characters consumed since `<!--` are the dashes that
     * advanced sequenceIndex (0 for `<!-->`, 1 for `<!--->`).
     */
    this.index === this.sectionStart + this.sequenceIndex && c === CharCodes.Gt) {
      this.emitComment(this.sequenceIndex);
    } else if (this.currentSequence === Sequences.CommentEnd && this.sequenceIndex === 2 && c === CharCodes.Gt) {
      this.emitComment(2);
    } else if (this.currentSequence === Sequences.CommentEnd && this.sequenceIndex === this.currentSequence.length - 1 && c !== CharCodes.Gt) {
      this.sequenceIndex = Number(c === CharCodes.Dash);
    } else if (c === this.currentSequence[this.sequenceIndex]) {
      if (++this.sequenceIndex === this.currentSequence.length) {
        if (this.currentSequence === Sequences.CdataEnd) {
          this.cbs.oncdata(this.sectionStart, this.index, 2);
        } else {
          this.cbs.oncomment(this.sectionStart, this.index, 3);
        }
        this.sequenceIndex = 0;
        this.sectionStart = this.index + 1;
        this.state = State.Text;
      }
    } else if (this.sequenceIndex === 0) {
      if (this.fastForwardTo(this.currentSequence[0])) {
        this.sequenceIndex = 1;
      }
    } else if (c !== this.currentSequence[this.sequenceIndex - 1]) {
      this.sequenceIndex = 0;
    }
  }
  /**
   * HTML only allows ASCII alpha characters (a-z and A-Z) at the beginning of a tag name.
   *
   * XML allows a lot more characters here (@see https://www.w3.org/TR/REC-xml/#NT-NameStartChar).
   * We allow anything that wouldn't end the tag.
   * @param c Current character code point.
   */
  isTagStartChar(c) {
    return this.xmlMode ? !isEndOfTagSection(c) : isASCIIAlpha(c);
  }
  /**
   * Scan raw-text / RCDATA content for the matching end tag.
   *
   * For RCDATA tags (`<title>`, `<textarea>`) entities are decoded inline.
   * For raw-text tags (`<script>`, `<style>`, etc.) we fast-forward to `<`.
   * @param c Current character code point.
   */
  stateInSpecialTag(c) {
    if (this.sequenceIndex === this.currentSequence.length) {
      if (isEndOfTagSection(c)) {
        const endOfText = this.index - this.currentSequence.length;
        if (this.sectionStart < endOfText) {
          const actualIndex = this.index;
          this.index = endOfText;
          this.cbs.ontext(this.sectionStart, endOfText);
          this.index = actualIndex;
        }
        this.isSpecial = false;
        this.sectionStart = endOfText + 2;
        this.stateInClosingTagName(c);
        return;
      }
      this.sequenceIndex = 0;
    }
    if ((c | 32) === this.currentSequence[this.sequenceIndex]) {
      this.sequenceIndex += 1;
    } else if (this.sequenceIndex === 0) {
      if (this.currentSequence === Sequences.TitleEnd || this.currentSequence === Sequences.TextareaEnd) {
        if (this.decodeEntities && c === CharCodes.Amp) {
          this.startEntity();
        }
      } else if (this.fastForwardTo(CharCodes.Lt)) {
        this.sequenceIndex = 1;
      }
    } else {
      this.sequenceIndex = Number(c === CharCodes.Lt);
    }
  }
  stateBeforeTagName(c) {
    if (c === CharCodes.ExclamationMark) {
      this.state = State.BeforeDeclaration;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes.Questionmark) {
      if (this.xmlMode) {
        this.state = State.InProcessingInstruction;
        this.sequenceIndex = 0;
        this.sectionStart = this.index + 1;
      } else {
        this.state = State.InSpecialComment;
        this.sectionStart = this.index;
      }
    } else if (this.isTagStartChar(c)) {
      this.sectionStart = this.index;
      const special = this.xmlMode || this.cbs.isInForeignContext?.() ? void 0 : specialStartSequences.get(c | 32);
      if (special === void 0) {
        this.state = State.InTagName;
      } else {
        this.isSpecial = true;
        this.currentSequence = special;
        this.sequenceIndex = 3;
        this.state = State.SpecialStartSequence;
      }
    } else if (c === CharCodes.Slash) {
      this.state = State.BeforeClosingTagName;
    } else {
      this.state = State.Text;
      this.stateText(c);
    }
  }
  stateInTagName(c) {
    if (isEndOfTagSection(c)) {
      this.cbs.onopentagname(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    }
  }
  stateBeforeClosingTagName(c) {
    if (isWhitespace(c)) {
      if (this.xmlMode) {
      } else {
        this.state = State.InSpecialComment;
        this.sectionStart = this.index;
      }
    } else if (c === CharCodes.Gt) {
      this.state = State.Text;
      if (!this.xmlMode) {
        this.sectionStart = this.index + 1;
      }
    } else {
      this.state = this.isTagStartChar(c) ? State.InClosingTagName : State.InSpecialComment;
      this.sectionStart = this.index;
    }
  }
  stateInClosingTagName(c) {
    if (isEndOfTagSection(c)) {
      this.cbs.onclosetag(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.state = State.AfterClosingTagName;
      this.stateAfterClosingTagName(c);
    }
  }
  stateAfterClosingTagName(c) {
    if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  stateBeforeAttributeName(c) {
    if (c === CharCodes.Gt) {
      this.cbs.onopentagend(this.index);
      this.enterTagBody();
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes.Slash) {
      this.state = State.InSelfClosingTag;
    } else if (!isWhitespace(c)) {
      this.state = State.InAttributeName;
      this.sectionStart = this.index;
    }
  }
  /**
   * Handle `/` before `>` in an opening tag.
   *
   * In HTML mode, text-only tags ignore the self-closing flag and still enter
   * their raw-text/RCDATA/plaintext state unless self-closing tags are being
   * recognized. In XML mode, or for ordinary tags, the tokenizer returns to
   * regular text parsing after emitting the self-closing callback.
   * @param c Current character code point.
   */
  stateInSelfClosingTag(c) {
    if (c === CharCodes.Gt) {
      this.cbs.onselfclosingtag(this.index);
      this.sectionStart = this.index + 1;
      if (!this.recognizeSelfClosing) {
        this.enterTagBody();
        return;
      }
      this.state = State.Text;
      this.isSpecial = false;
      this.currentSequence = Sequences.Empty;
    } else if (!isWhitespace(c)) {
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    }
  }
  stateInAttributeName(c) {
    if (c === CharCodes.Eq || isEndOfTagSection(c)) {
      this.cbs.onattribname(this.sectionStart, this.index);
      this.sectionStart = this.index;
      this.state = State.AfterAttributeName;
      this.stateAfterAttributeName(c);
    }
  }
  stateAfterAttributeName(c) {
    if (c === CharCodes.Eq) {
      this.state = State.BeforeAttributeValue;
    } else if (c === CharCodes.Slash || c === CharCodes.Gt) {
      this.cbs.onattribend(QuoteType.NoValue, this.sectionStart);
      this.sectionStart = -1;
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    } else if (!isWhitespace(c)) {
      this.cbs.onattribend(QuoteType.NoValue, this.sectionStart);
      this.state = State.InAttributeName;
      this.sectionStart = this.index;
    }
  }
  stateBeforeAttributeValue(c) {
    if (c === CharCodes.DoubleQuote) {
      this.state = State.InAttributeValueDq;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes.SingleQuote) {
      this.state = State.InAttributeValueSq;
      this.sectionStart = this.index + 1;
    } else if (!isWhitespace(c)) {
      this.sectionStart = this.index;
      this.state = State.InAttributeValueNq;
      this.stateInAttributeValueNoQuotes(c);
    }
  }
  handleInAttributeValue(c, quote) {
    if (c === quote || !this.decodeEntities && this.fastForwardTo(quote)) {
      this.cbs.onattribdata(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.cbs.onattribend(quote === CharCodes.DoubleQuote ? QuoteType.Double : QuoteType.Single, this.index + 1);
      this.state = State.BeforeAttributeName;
    } else if (this.decodeEntities && c === CharCodes.Amp) {
      this.startEntity();
    }
  }
  stateInAttributeValueDoubleQuotes(c) {
    this.handleInAttributeValue(c, CharCodes.DoubleQuote);
  }
  stateInAttributeValueSingleQuotes(c) {
    this.handleInAttributeValue(c, CharCodes.SingleQuote);
  }
  stateInAttributeValueNoQuotes(c) {
    if (isWhitespace(c) || c === CharCodes.Gt) {
      this.cbs.onattribdata(this.sectionStart, this.index);
      this.sectionStart = -1;
      this.cbs.onattribend(QuoteType.Unquoted, this.index);
      this.state = State.BeforeAttributeName;
      this.stateBeforeAttributeName(c);
    } else if (this.decodeEntities && c === CharCodes.Amp) {
      this.startEntity();
    }
  }
  /**
   * Distinguish between CDATA, declarations, HTML comments, and HTML bogus
   * comments after `<!`.
   *
   * In HTML mode, only real comments and doctypes stay on declaration paths;
   * everything else becomes a bogus comment terminated by the next `>`.
   * @param c Current character code point.
   */
  stateBeforeDeclaration(c) {
    if (c === CharCodes.OpeningSquareBracket) {
      this.state = State.CDATASequence;
      this.sequenceIndex = 0;
    } else if (this.xmlMode) {
      this.state = c === CharCodes.Dash ? State.BeforeComment : State.InDeclaration;
    } else if ((c | 32) === Sequences.Doctype[0]) {
      this.state = State.DeclarationSequence;
      this.currentSequence = Sequences.Doctype;
      this.sequenceIndex = 1;
    } else if (c === CharCodes.Gt) {
      this.cbs.oncomment(this.sectionStart, this.index, 0);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    } else if (c === CharCodes.Dash) {
      this.state = State.BeforeComment;
    } else {
      this.state = State.InSpecialComment;
    }
  }
  /**
   * Continue matching `doctype` after `<!d`.
   *
   * A full `doctype` match stays on the declaration path; any other name falls
   * back to an HTML bogus comment, which matches browser behavior for
   * non-doctype `<!...>` constructs.
   * @param c Current character code point.
   */
  stateDeclarationSequence(c) {
    if (this.sequenceIndex === this.currentSequence.length) {
      this.state = State.InDeclaration;
      this.stateInDeclaration(c);
    } else if ((c | 32) === this.currentSequence[this.sequenceIndex]) {
      this.sequenceIndex += 1;
    } else if (c === CharCodes.Gt) {
      this.cbs.oncomment(this.sectionStart, this.index, 0);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    } else {
      this.state = State.InSpecialComment;
    }
  }
  stateInDeclaration(c) {
    if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
      this.cbs.ondeclaration(this.sectionStart, this.index);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  /**
   * XML processing instructions (`<?...?>`).
   *
   * In HTML mode `<?` is routed to `InSpecialComment` instead, so this
   * state is only reachable in XML mode.
   * @param c Current character code point.
   */
  stateInProcessingInstruction(c) {
    if (c === CharCodes.Questionmark) {
      this.sequenceIndex = 1;
    } else if (c === CharCodes.Gt && this.sequenceIndex === 1) {
      this.cbs.onprocessinginstruction(this.sectionStart, this.index - 1);
      this.sequenceIndex = 0;
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    } else {
      this.sequenceIndex = Number(this.fastForwardTo(CharCodes.Questionmark));
    }
  }
  stateBeforeComment(c) {
    if (c === CharCodes.Dash) {
      this.state = State.InCommentLike;
      this.currentSequence = Sequences.CommentEnd;
      this.sequenceIndex = 0;
      this.sectionStart = this.index + 1;
    } else if (this.xmlMode) {
      this.state = State.InDeclaration;
    } else if (c === CharCodes.Gt) {
      this.cbs.oncomment(this.sectionStart, this.index, 0);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    } else {
      this.state = State.InSpecialComment;
    }
  }
  stateInSpecialComment(c) {
    if (c === CharCodes.Gt || this.fastForwardTo(CharCodes.Gt)) {
      this.cbs.oncomment(this.sectionStart, this.index, 0);
      this.state = State.Text;
      this.sectionStart = this.index + 1;
    }
  }
  startEntity() {
    this.baseState = this.state;
    this.state = State.InEntity;
    this.entityStart = this.index;
    this.entityDecoder.startEntity(this.xmlMode ? DecodingMode.Strict : this.baseState === State.Text || this.baseState === State.InSpecialTag ? DecodingMode.Legacy : DecodingMode.Attribute);
  }
  stateInEntity() {
    const indexInBuffer = this.index - this.offset;
    const length = this.entityDecoder.write(this.buffer, indexInBuffer);
    if (length >= 0) {
      this.state = this.baseState;
      if (length === 0) {
        this.index -= 1;
      }
    } else {
      if (indexInBuffer < this.buffer.length && this.buffer.charCodeAt(indexInBuffer) === CharCodes.Amp) {
        this.state = this.baseState;
        this.index -= 1;
        return;
      }
      this.index = this.offset + this.buffer.length - 1;
    }
  }
  /**
   * Remove data that has already been consumed from the buffer.
   */
  cleanup() {
    if (this.running && this.sectionStart !== this.index) {
      if (this.state === State.Text || this.state === State.InPlainText || this.state === State.InSpecialTag && this.sequenceIndex === 0) {
        this.cbs.ontext(this.sectionStart, this.index);
        this.sectionStart = this.index;
      } else if (this.state === State.InAttributeValueDq || this.state === State.InAttributeValueSq || this.state === State.InAttributeValueNq) {
        this.cbs.onattribdata(this.sectionStart, this.index);
        this.sectionStart = this.index;
      }
    }
  }
  shouldContinue() {
    return this.index < this.buffer.length + this.offset && this.running;
  }
  /**
   * Iterates through the buffer, calling the function corresponding to the current state.
   *
   * States that are more likely to be hit are higher up, as a performance improvement.
   */
  parse() {
    while (this.shouldContinue()) {
      const c = this.buffer.charCodeAt(this.index - this.offset);
      switch (this.state) {
        case State.Text: {
          this.stateText(c);
          break;
        }
        case State.InPlainText: {
          this.index = this.buffer.length + this.offset - 1;
          break;
        }
        case State.SpecialStartSequence: {
          this.stateSpecialStartSequence(c);
          break;
        }
        case State.InSpecialTag: {
          this.stateInSpecialTag(c);
          break;
        }
        case State.CDATASequence: {
          this.stateCDATASequence(c);
          break;
        }
        case State.DeclarationSequence: {
          this.stateDeclarationSequence(c);
          break;
        }
        case State.InAttributeValueDq: {
          this.stateInAttributeValueDoubleQuotes(c);
          break;
        }
        case State.InAttributeName: {
          this.stateInAttributeName(c);
          break;
        }
        case State.InCommentLike: {
          this.stateInCommentLike(c);
          break;
        }
        case State.InSpecialComment: {
          this.stateInSpecialComment(c);
          break;
        }
        case State.BeforeAttributeName: {
          this.stateBeforeAttributeName(c);
          break;
        }
        case State.InTagName: {
          this.stateInTagName(c);
          break;
        }
        case State.InClosingTagName: {
          this.stateInClosingTagName(c);
          break;
        }
        case State.BeforeTagName: {
          this.stateBeforeTagName(c);
          break;
        }
        case State.AfterAttributeName: {
          this.stateAfterAttributeName(c);
          break;
        }
        case State.InAttributeValueSq: {
          this.stateInAttributeValueSingleQuotes(c);
          break;
        }
        case State.BeforeAttributeValue: {
          this.stateBeforeAttributeValue(c);
          break;
        }
        case State.BeforeClosingTagName: {
          this.stateBeforeClosingTagName(c);
          break;
        }
        case State.AfterClosingTagName: {
          this.stateAfterClosingTagName(c);
          break;
        }
        case State.InAttributeValueNq: {
          this.stateInAttributeValueNoQuotes(c);
          break;
        }
        case State.InSelfClosingTag: {
          this.stateInSelfClosingTag(c);
          break;
        }
        case State.InDeclaration: {
          this.stateInDeclaration(c);
          break;
        }
        case State.BeforeDeclaration: {
          this.stateBeforeDeclaration(c);
          break;
        }
        case State.BeforeComment: {
          this.stateBeforeComment(c);
          break;
        }
        case State.InProcessingInstruction: {
          this.stateInProcessingInstruction(c);
          break;
        }
        case State.InEntity: {
          this.stateInEntity();
          break;
        }
      }
      this.index++;
    }
    this.cleanup();
  }
  finish() {
    if (this.state === State.InEntity) {
      this.entityDecoder.end();
      this.state = this.baseState;
    }
    this.handleTrailingData();
    this.cbs.onend();
  }
  handleTrailingCommentLikeData(endIndex) {
    if (this.state !== State.InCommentLike) {
      return false;
    }
    if (this.currentSequence === Sequences.CdataEnd) {
      if (this.xmlMode) {
        if (this.sectionStart < endIndex) {
          this.cbs.oncdata(this.sectionStart, endIndex, 0);
        }
      } else {
        const cdataStart = this.sectionStart - Sequences.Cdata.length - 1;
        this.cbs.oncomment(cdataStart, endIndex, 0);
      }
    } else {
      const offset = this.xmlMode ? 0 : Math.min(this.sequenceIndex, Sequences.CommentEnd.length - 1);
      this.cbs.oncomment(this.sectionStart, endIndex, offset);
    }
    return true;
  }
  handleTrailingMarkupDeclaration(endIndex) {
    if (this.xmlMode) {
      switch (this.state) {
        case State.InSpecialComment:
        case State.BeforeComment:
        case State.CDATASequence:
        case State.DeclarationSequence:
        case State.InDeclaration: {
          this.cbs.ontext(this.sectionStart, endIndex);
          return true;
        }
        default: {
          return false;
        }
      }
    }
    switch (this.state) {
      case State.BeforeDeclaration:
      case State.InSpecialComment:
      case State.BeforeComment:
      case State.CDATASequence: {
        this.cbs.oncomment(this.sectionStart, endIndex, 0);
        return true;
      }
      case State.DeclarationSequence: {
        if (this.sequenceIndex !== Sequences.Doctype.length) {
          this.cbs.oncomment(this.sectionStart, endIndex, 0);
        }
        return true;
      }
      case State.InDeclaration: {
        return true;
      }
      default: {
        return false;
      }
    }
  }
  /** Handle any trailing data. */
  handleTrailingData() {
    const endIndex = this.buffer.length + this.offset;
    if (this.handleTrailingCommentLikeData(endIndex) || this.handleTrailingMarkupDeclaration(endIndex)) {
      return;
    }
    if (this.sectionStart >= endIndex) {
      return;
    }
    switch (this.state) {
      case State.InTagName:
      case State.BeforeAttributeName:
      case State.BeforeAttributeValue:
      case State.AfterAttributeName:
      case State.InAttributeName:
      case State.InAttributeValueSq:
      case State.InAttributeValueDq:
      case State.InAttributeValueNq:
      case State.InClosingTagName: {
        break;
      }
      default: {
        this.cbs.ontext(this.sectionStart, endIndex);
      }
    }
  }
  emitCodePoint(cp, consumed) {
    if (this.baseState !== State.Text && this.baseState !== State.InSpecialTag) {
      if (this.sectionStart < this.entityStart) {
        this.cbs.onattribdata(this.sectionStart, this.entityStart);
      }
      this.sectionStart = this.entityStart + consumed;
      this.index = this.sectionStart - 1;
      this.cbs.onattribentity(cp);
    } else {
      if (this.sectionStart < this.entityStart) {
        this.cbs.ontext(this.sectionStart, this.entityStart);
      }
      this.sectionStart = this.entityStart + consumed;
      this.index = this.sectionStart - 1;
      this.cbs.ontextentity(cp, this.sectionStart);
    }
  }
};

// editor/ui-editor-ui/node_modules/htmlparser2/dist/Parser.js
var { fromCodePoint } = String;
var formTags = /* @__PURE__ */ new Set([
  "input",
  "option",
  "optgroup",
  "select",
  "button",
  "datalist",
  "textarea"
]);
var pTag = /* @__PURE__ */ new Set(["p"]);
var headingTags = /* @__PURE__ */ new Set(["h1", "h2", "h3", "h4", "h5", "h6", "p"]);
var tableSectionTags = /* @__PURE__ */ new Set(["thead", "tbody"]);
var ddtTags = /* @__PURE__ */ new Set(["dd", "dt"]);
var rtpTags = /* @__PURE__ */ new Set(["rt", "rp"]);
var openImpliesClose = /* @__PURE__ */ new Map([
  ["tr", /* @__PURE__ */ new Set(["tr", "th", "td"])],
  ["th", /* @__PURE__ */ new Set(["th"])],
  ["td", /* @__PURE__ */ new Set(["thead", "th", "td"])],
  ["body", /* @__PURE__ */ new Set(["head", "link", "script"])],
  ["a", /* @__PURE__ */ new Set(["a"])],
  ["li", /* @__PURE__ */ new Set(["li"])],
  ["p", pTag],
  ["h1", headingTags],
  ["h2", headingTags],
  ["h3", headingTags],
  ["h4", headingTags],
  ["h5", headingTags],
  ["h6", headingTags],
  ["select", formTags],
  ["input", formTags],
  ["output", formTags],
  ["button", formTags],
  ["datalist", formTags],
  ["textarea", formTags],
  ["option", /* @__PURE__ */ new Set(["option"])],
  ["optgroup", /* @__PURE__ */ new Set(["optgroup", "option"])],
  ["dd", ddtTags],
  ["dt", ddtTags],
  ["address", pTag],
  ["article", pTag],
  ["aside", pTag],
  ["blockquote", pTag],
  ["details", pTag],
  ["div", pTag],
  ["dl", pTag],
  ["fieldset", pTag],
  ["figcaption", pTag],
  ["figure", pTag],
  ["footer", pTag],
  ["form", pTag],
  ["header", pTag],
  ["hr", pTag],
  ["main", pTag],
  ["nav", pTag],
  ["ol", pTag],
  ["pre", pTag],
  ["section", pTag],
  ["table", pTag],
  ["ul", pTag],
  ["rt", rtpTags],
  ["rp", rtpTags],
  ["tbody", tableSectionTags],
  ["tfoot", tableSectionTags]
]);
var DOCUMENT_TYPE = "doctype";
var voidElements = /* @__PURE__ */ new Set([
  "area",
  "base",
  "basefont",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "img",
  "input",
  "isindex",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
var foreignContextElements = /* @__PURE__ */ new Set(["math", "svg"]);
var htmlIntegrationElements = /* @__PURE__ */ new Set([
  "mi",
  "mo",
  "mn",
  "ms",
  "mtext",
  "annotation-xml",
  "foreignObject",
  "desc",
  "title"
]);
var svgTagNameAdjustments = /* @__PURE__ */ new Map([
  ["altglyph", "altGlyph"],
  ["altglyphdef", "altGlyphDef"],
  ["altglyphitem", "altGlyphItem"],
  ["animatecolor", "animateColor"],
  ["animatemotion", "animateMotion"],
  ["animatetransform", "animateTransform"],
  ["clippath", "clipPath"],
  ["feblend", "feBlend"],
  ["fecolormatrix", "feColorMatrix"],
  ["fecomponenttransfer", "feComponentTransfer"],
  ["fecomposite", "feComposite"],
  ["feconvolvematrix", "feConvolveMatrix"],
  ["fediffuselighting", "feDiffuseLighting"],
  ["fedisplacementmap", "feDisplacementMap"],
  ["fedistantlight", "feDistantLight"],
  ["fedropshadow", "feDropShadow"],
  ["feflood", "feFlood"],
  ["fefunca", "feFuncA"],
  ["fefuncb", "feFuncB"],
  ["fefuncg", "feFuncG"],
  ["fefuncr", "feFuncR"],
  ["fegaussianblur", "feGaussianBlur"],
  ["feimage", "feImage"],
  ["femerge", "feMerge"],
  ["femergenode", "feMergeNode"],
  ["femorphology", "feMorphology"],
  ["feoffset", "feOffset"],
  ["fepointlight", "fePointLight"],
  ["fespecularlighting", "feSpecularLighting"],
  ["fespotlight", "feSpotLight"],
  ["fetile", "feTile"],
  ["feturbulence", "feTurbulence"],
  ["foreignobject", "foreignObject"],
  ["glyphref", "glyphRef"],
  ["lineargradient", "linearGradient"],
  ["radialgradient", "radialGradient"],
  ["textpath", "textPath"]
]);
var ForeignContext;
(function(ForeignContext2) {
  ForeignContext2[ForeignContext2["None"] = 0] = "None";
  ForeignContext2[ForeignContext2["Svg"] = 1] = "Svg";
  ForeignContext2[ForeignContext2["MathML"] = 2] = "MathML";
})(ForeignContext || (ForeignContext = {}));
var reNameEnd = /\s|\//;
var Parser = class {
  options;
  /** The start index of the last event. */
  startIndex = 0;
  /** The end index of the last event. */
  endIndex = 0;
  /**
   * Store the start index of the current open tag,
   * so we can update the start index for attributes.
   */
  openTagStart = 0;
  tagname = "";
  attribname = "";
  attribvalue = "";
  attribs = null;
  stack = [];
  foreignContext;
  cbs;
  lowerCaseTagNames;
  lowerCaseAttributeNames;
  recognizeSelfClosing;
  /** We are parsing HTML. Inverse of the `xmlMode` option. */
  htmlMode;
  tokenizer;
  buffers = [];
  bufferOffset = 0;
  /** The index of the last written buffer. Used when resuming after a `pause()`. */
  writeIndex = 0;
  /** Indicates whether the parser has finished running / `.end` has been called. */
  ended = false;
  constructor(cbs, options = {}) {
    this.options = options;
    this.cbs = cbs ?? {};
    this.htmlMode = !this.options.xmlMode;
    this.lowerCaseTagNames = options.lowerCaseTags ?? this.htmlMode;
    this.lowerCaseAttributeNames = options.lowerCaseAttributeNames ?? this.htmlMode;
    this.recognizeSelfClosing = options.recognizeSelfClosing ?? !this.htmlMode;
    this.tokenizer = new (options.Tokenizer ?? Tokenizer)(this.options, this);
    this.foreignContext = [ForeignContext.None];
    this.cbs.onparserinit?.(this);
  }
  // Tokenizer event handlers
  /**
   * @param start Start index for the current parser event.
   * @param endIndex End index for the current parser event.
   * @internal
   */
  ontext(start, endIndex) {
    const data = this.getSlice(start, endIndex);
    this.endIndex = endIndex - 1;
    this.cbs.ontext?.(data);
    this.startIndex = endIndex;
  }
  /**
   * @param cp Current Unicode code point.
   * @param endIndex End index for the current parser event.
   * @internal
   */
  ontextentity(cp, endIndex) {
    this.endIndex = endIndex - 1;
    this.cbs.ontext?.(fromCodePoint(cp));
    this.startIndex = endIndex;
  }
  /** @internal */
  isInForeignContext() {
    return this.foreignContext[0] !== ForeignContext.None;
  }
  /**
   * Checks if the current tag is a void element. Override this if you want
   * to specify your own additional void elements.
   * @param name Name of the pseudo selector.
   */
  isVoidElement(name) {
    return this.htmlMode && voidElements.has(name);
  }
  /**
   * Read a tag name from the buffer.
   *
   * When `lowerCaseTagNames` is enabled (the default in HTML mode), the name
   * is lowercased and may be adjusted for SVG casing or the `image` → `img`
   * alias.
   * @param start Start index of the tag name in the buffer.
   * @param endIndex End index of the tag name in the buffer.
   */
  readTagName(start, endIndex) {
    const name = this.lowerCaseTagNames ? this.getSlice(start, endIndex).toLowerCase() : this.getSlice(start, endIndex);
    if (!(this.lowerCaseTagNames && this.htmlMode)) {
      return name;
    }
    if (this.foreignContext[0] === ForeignContext.Svg) {
      return svgTagNameAdjustments.get(name) ?? name;
    }
    if (this.foreignContext.length > 1) {
      const adjusted = svgTagNameAdjustments.get(name);
      if (adjusted !== void 0 && this.stack.includes(adjusted)) {
        return adjusted;
      }
    }
    if (!this.isInForeignContext()) {
      return name === "image" ? "img" : name;
    }
    return name;
  }
  /**
   * @param start Start index for the current parser event.
   * @param endIndex End index for the current parser event.
   * @internal
   */
  onopentagname(start, endIndex) {
    this.endIndex = endIndex;
    this.emitOpenTag(this.readTagName(start, endIndex));
  }
  emitOpenTag(name) {
    this.openTagStart = this.startIndex;
    this.tagname = name;
    if (this.htmlMode && name === "form" && this.stack.includes("form")) {
      this.tagname = "";
      return;
    }
    const impliesClose = this.htmlMode && openImpliesClose.get(name);
    if (impliesClose) {
      while (this.stack.length > 0 && impliesClose.has(this.stack[0])) {
        this.popElement(true);
      }
    }
    if (!this.isVoidElement(name)) {
      this.stack.unshift(name);
      if (this.htmlMode) {
        if (name === "svg") {
          this.foreignContext.unshift(ForeignContext.Svg);
        } else if (name === "math") {
          this.foreignContext.unshift(ForeignContext.MathML);
        } else if (htmlIntegrationElements.has(name)) {
          this.foreignContext.unshift(ForeignContext.None);
        }
      }
    }
    this.cbs.onopentagname?.(name);
    if (this.cbs.onopentag)
      this.attribs = {};
  }
  endOpenTag(isImplied) {
    this.startIndex = this.openTagStart;
    if (this.attribs) {
      this.cbs.onopentag?.(this.tagname, this.attribs, isImplied);
      this.attribs = null;
    }
    if (this.cbs.onclosetag && this.isVoidElement(this.tagname)) {
      this.cbs.onclosetag(this.tagname, true);
    }
    this.tagname = "";
  }
  /**
   * @param endIndex End index for the current parser event.
   * @internal
   */
  onopentagend(endIndex) {
    this.endIndex = endIndex;
    this.endOpenTag(false);
    this.startIndex = endIndex + 1;
  }
  /**
   * @param start Start index for the current parser event.
   * @param endIndex End index for the current parser event.
   * @internal
   */
  onclosetag(start, endIndex) {
    this.endIndex = endIndex;
    const name = this.readTagName(start, endIndex);
    if (!this.isVoidElement(name)) {
      const pos = this.stack.indexOf(name);
      if (pos !== -1) {
        for (let index = 0; index < pos; index++) {
          this.popElement(true);
        }
        this.popElement(false);
      } else if (this.htmlMode && name === "p") {
        this.emitOpenTag("p");
        this.closeCurrentTag(true);
      }
    } else if (this.htmlMode && name === "br") {
      this.cbs.onopentagname?.("br");
      this.cbs.onopentag?.("br", {}, true);
      this.cbs.onclosetag?.("br", false);
    }
    this.startIndex = endIndex + 1;
  }
  /**
   * @param endIndex End index for the current parser event.
   * @internal
   */
  onselfclosingtag(endIndex) {
    this.endIndex = endIndex;
    if (this.recognizeSelfClosing || this.isInForeignContext()) {
      this.closeCurrentTag(false);
      this.startIndex = endIndex + 1;
    } else {
      this.onopentagend(endIndex);
    }
  }
  /**
   * Pop the top element off the stack, emit a close event, and maintain
   * the foreign context stack.
   * @param implied Whether this close is implied (not from an explicit end tag).
   */
  popElement(implied) {
    const element = this.stack.shift();
    if (this.htmlMode && (foreignContextElements.has(element) || htmlIntegrationElements.has(element))) {
      this.foreignContext.shift();
    }
    this.cbs.onclosetag?.(element, implied);
  }
  closeCurrentTag(isOpenImplied) {
    const name = this.tagname;
    this.endOpenTag(isOpenImplied);
    if (this.stack[0] === name) {
      this.popElement(!isOpenImplied);
    }
  }
  /**
   * @param start Start index for the current parser event.
   * @param endIndex End index for the current parser event.
   * @internal
   */
  onattribname(start, endIndex) {
    this.startIndex = start;
    const name = this.getSlice(start, endIndex);
    this.attribname = this.lowerCaseAttributeNames ? name.toLowerCase() : name;
  }
  /**
   * @param start Start index for the current parser event.
   * @param endIndex End index for the current parser event.
   * @internal
   */
  onattribdata(start, endIndex) {
    this.attribvalue += this.getSlice(start, endIndex);
  }
  /**
   * @param cp Current Unicode code point.
   * @internal
   */
  onattribentity(cp) {
    this.attribvalue += fromCodePoint(cp);
  }
  /**
   * @param quote Quote type used for the current attribute.
   * @param endIndex End index for the current parser event.
   * @internal
   */
  onattribend(quote, endIndex) {
    this.endIndex = endIndex;
    this.cbs.onattribute?.(this.attribname, this.attribvalue, quote === QuoteType.Double ? '"' : quote === QuoteType.Single ? "'" : quote === QuoteType.NoValue ? void 0 : null);
    if (this.attribs && !Object.hasOwn(this.attribs, this.attribname)) {
      this.attribs[this.attribname] = this.attribvalue;
    }
    this.attribvalue = "";
  }
  getInstructionName(value) {
    const index = value.search(reNameEnd);
    let name = index < 0 ? value : value.substr(0, index);
    if (this.lowerCaseTagNames) {
      name = name.toLowerCase();
    }
    return name;
  }
  /**
   * @param start Start index for the current parser event.
   * @param endIndex End index for the current parser event.
   * @internal
   */
  ondeclaration(start, endIndex) {
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex);
    if (this.cbs.onprocessinginstruction) {
      const name = this.htmlMode ? this.lowerCaseTagNames ? DOCUMENT_TYPE : value.slice(0, DOCUMENT_TYPE.length) : this.getInstructionName(value);
      this.cbs.onprocessinginstruction("!".concat(name), "!".concat(value));
    }
    this.startIndex = endIndex + 1;
  }
  /**
   * @param start Start index for the current parser event.
   * @param endIndex End index for the current parser event.
   * @internal
   */
  onprocessinginstruction(start, endIndex) {
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex);
    if (this.cbs.onprocessinginstruction) {
      const name = this.getInstructionName(value);
      this.cbs.onprocessinginstruction("?".concat(name), "?".concat(value));
    }
    this.startIndex = endIndex + 1;
  }
  /**
   * @param start Start index for the current parser event.
   * @param endIndex End index for the current parser event.
   * @param offset Offset applied when computing parser indices.
   * @internal
   */
  oncomment(start, endIndex, offset) {
    this.endIndex = endIndex;
    this.cbs.oncomment?.(this.getSlice(start, endIndex - offset));
    this.cbs.oncommentend?.();
    this.startIndex = endIndex + 1;
  }
  /**
   * @param start Start index for the current parser event.
   * @param endIndex End index for the current parser event.
   * @param offset Offset applied when computing parser indices.
   * @internal
   */
  oncdata(start, endIndex, offset) {
    this.endIndex = endIndex;
    const value = this.getSlice(start, endIndex - offset);
    if (!this.htmlMode || this.options.recognizeCDATA) {
      this.cbs.oncdatastart?.();
      this.cbs.ontext?.(value);
      this.cbs.oncdataend?.();
    } else if (this.isInForeignContext()) {
      this.cbs.ontext?.(value);
    } else {
      this.cbs.oncomment?.("[CDATA[".concat(value, "]]"));
      this.cbs.oncommentend?.();
    }
    this.startIndex = endIndex + 1;
  }
  /** @internal */
  onend() {
    if (this.cbs.onclosetag) {
      this.endIndex = this.startIndex;
      for (let index = 0; index < this.stack.length; index++) {
        this.cbs.onclosetag(this.stack[index], true);
      }
    }
    this.cbs.onend?.();
  }
  /**
   * Resets the parser to a blank state, ready to parse a new HTML document
   */
  reset() {
    this.cbs.onreset?.();
    this.tokenizer.reset();
    this.tagname = "";
    this.attribname = "";
    this.attribvalue = "";
    this.attribs = null;
    this.stack.length = 0;
    this.startIndex = 0;
    this.endIndex = 0;
    this.cbs.onparserinit?.(this);
    this.buffers.length = 0;
    this.foreignContext.length = 0;
    this.foreignContext.unshift(ForeignContext.None);
    this.bufferOffset = 0;
    this.writeIndex = 0;
    this.ended = false;
  }
  /**
   * Resets the parser, then parses a complete document and
   * pushes it to the handler.
   * @param data Document to parse.
   */
  parseComplete(data) {
    this.reset();
    this.end(data);
  }
  getSlice(start, end) {
    if (start === end) {
      return "";
    }
    while (start - this.bufferOffset >= this.buffers[0].length) {
      this.shiftBuffer();
    }
    let slice = this.buffers[0].slice(start - this.bufferOffset, end - this.bufferOffset);
    while (end - this.bufferOffset > this.buffers[0].length) {
      this.shiftBuffer();
      slice += this.buffers[0].slice(0, end - this.bufferOffset);
    }
    return slice;
  }
  shiftBuffer() {
    this.bufferOffset += this.buffers[0].length;
    this.writeIndex--;
    this.buffers.shift();
  }
  /**
   * Parses a chunk of data and calls the corresponding callbacks.
   * @param chunk Chunk to parse.
   */
  write(chunk) {
    if (this.ended) {
      this.cbs.onerror?.(new Error(".write() after done!"));
      return;
    }
    this.buffers.push(chunk);
    if (this.tokenizer.running) {
      this.tokenizer.write(chunk);
      this.writeIndex++;
    }
  }
  /**
   * Parses the end of the buffer and clears the stack, calls onend.
   * @param chunk Optional final chunk to parse.
   */
  end(chunk) {
    if (this.ended) {
      this.cbs.onerror?.(new Error(".end() after done!"));
      return;
    }
    if (chunk)
      this.write(chunk);
    this.ended = true;
    this.tokenizer.end();
  }
  /**
   * Pauses parsing. The parser won't emit events until `resume` is called.
   */
  pause() {
    this.tokenizer.pause();
  }
  /**
   * Resumes parsing after `pause` was called.
   */
  resume() {
    this.tokenizer.resume();
    while (this.tokenizer.running && this.writeIndex < this.buffers.length) {
      this.tokenizer.write(this.buffers[this.writeIndex++]);
    }
    if (this.ended)
      this.tokenizer.end();
  }
};

// editor/ui-editor-ui/src/app/serdes/tree/html/element-classification.ts
var RAW_TEXT_HTML_ELEMENTS = /* @__PURE__ */ new Set([
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "script",
  "style",
  "xmp"
]);
var normalizeTagName = (tagName) => tagName.toLowerCase();
var isRawTextHtmlElement = (tagName) => RAW_TEXT_HTML_ELEMENTS.has(normalizeTagName(tagName));

// editor/ui-editor-ui/src/app/serdes/tree/html/protected-template-regions.ts
var DELIMITERS = [
  { kind: "ampscript-block", opening: "%%[", closing: "]%%" },
  { kind: "ampscript-output", opening: "%%=", closing: "=%%" },
  { kind: "twig-control", opening: "{%", closing: "%}" }
];
function scanProtectedTemplateRegionsInternal(source) {
  const stats = {
    sourceOffsetsVisited: 0,
    delimiterChecks: 0,
    closingCandidatesVisited: 0
  };
  const findDelimiter = (delimiter, fromOffset = 0) => {
    const offset = source.indexOf(delimiter, fromOffset);
    stats.delimiterChecks++;
    stats.sourceOffsetsVisited += offset === -1 ? source.length - fromOffset : offset - fromOffset + 1;
    return offset;
  };
  const openingOffsets = DELIMITERS.map(({ opening }) => findDelimiter(opening));
  if (openingOffsets.every((offset) => offset === -1)) {
    return { regions: [], stats };
  }
  const closingOffsets = DELIMITERS.map(() => []);
  const closingIndexes = DELIMITERS.map(() => 0);
  DELIMITERS.forEach((delimiter, delimiterIndex) => {
    let offset = findDelimiter(delimiter.closing);
    while (offset !== -1) {
      closingOffsets[delimiterIndex].push(offset);
      offset = findDelimiter(delimiter.closing, offset + 1);
    }
  });
  const regions = [];
  let cursor = 0;
  while (cursor < source.length) {
    let openingDelimiterIndex = -1;
    let openingOffset = source.length;
    DELIMITERS.forEach((delimiter2, delimiterIndex) => {
      let offset = openingOffsets[delimiterIndex];
      if (offset !== -1 && offset < cursor) {
        offset = findDelimiter(delimiter2.opening, cursor);
        openingOffsets[delimiterIndex] = offset;
      }
      if (offset !== -1 && offset < openingOffset) {
        openingDelimiterIndex = delimiterIndex;
        openingOffset = offset;
      }
    });
    if (openingDelimiterIndex === -1) {
      break;
    }
    cursor = openingOffset;
    const delimiter = DELIMITERS[openingDelimiterIndex];
    const minimumClosingOffset = cursor + delimiter.opening.length;
    const delimiterClosingOffsets = closingOffsets[openingDelimiterIndex];
    let closingIndex = closingIndexes[openingDelimiterIndex];
    while (closingIndex < delimiterClosingOffsets.length && delimiterClosingOffsets[closingIndex] < minimumClosingOffset) {
      closingIndex++;
      stats.closingCandidatesVisited++;
    }
    closingIndexes[openingDelimiterIndex] = closingIndex;
    const closingOffset = delimiterClosingOffsets[closingIndex];
    if (closingOffset === void 0) {
      cursor += delimiter.opening.length;
      continue;
    }
    closingIndexes[openingDelimiterIndex]++;
    stats.closingCandidatesVisited++;
    const endOffset = closingOffset + delimiter.closing.length;
    regions.push({
      kind: delimiter.kind,
      startOffset: cursor,
      endOffset
    });
    cursor = endOffset;
  }
  return { regions, stats };
}
function scanProtectedTemplateRegions(source) {
  return scanProtectedTemplateRegionsInternal(source).regions;
}
function findFirstProtectedTemplateRegionIndex(regions, offset) {
  let low = 0;
  let high = regions.length;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (regions[middle].endOffset <= offset) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }
  return low;
}
function maskProtectedTemplateRegions(source, regions = scanProtectedTemplateRegions(source)) {
  if (regions.length === 0) {
    return source;
  }
  let result = "";
  let cursor = 0;
  for (const region of regions) {
    result += source.slice(cursor, region.startOffset);
    result += source.slice(region.startOffset, region.endOffset).replace(/[^\r\n]/g, "x");
    cursor = region.endOffset;
  }
  result += source.slice(cursor);
  return result;
}
function transformOutsideProtectedTemplateRegions(source, transform, regions = scanProtectedTemplateRegions(source)) {
  if (regions.length === 0) {
    return transform(source, 0);
  }
  let result = "";
  let cursor = 0;
  for (const region of regions) {
    result += transform(source.slice(cursor, region.startOffset), cursor);
    result += source.slice(region.startOffset, region.endOffset);
    cursor = region.endOffset;
  }
  result += transform(source.slice(cursor), cursor);
  return result;
}

// editor/ui-editor-ui/src/app/serdes/tree/html/html-entity-policy.ts
var MASKED_SOURCE_BY_DOCUMENT_SCAN = /* @__PURE__ */ new WeakMap();
var HTML_WHITESPACE_CHARS = /* @__PURE__ */ new Set([" ", "	", "\n", "\r", "\f"]);
function isHTMLWhitespace(char) {
  return char !== void 0 && HTML_WHITESPACE_CHARS.has(char);
}
function getBoundedHTMLParserSourceRange(startIndex, endIndex, sourceLength) {
  const boundedLength = Math.max(0, sourceLength);
  const startOffset = Math.max(0, Math.min(startIndex, boundedLength));
  const endOffset = Math.max(startOffset, Math.min(endIndex + 1, boundedLength));
  return { startOffset, endOffset };
}
var STRUCTURAL_ENTITY_NAMES = /* @__PURE__ */ new Set(["lt", "gt", "amp", "quot", "apos"]);
var SOFT_HYPHEN_ENTITY_NAME = "shy";
var CURRENCY_ENTITY_NAMES = ["euro", "pound", "yen", "cent", "curren"];
var SIGN_ENTITY_NAMES = ["copy", "reg", "trade", "deg", "plusmn", "times", "divide"];
var GREEK_ENTITY_NAMES = [
  "Alpha",
  "Beta",
  "Gamma",
  "Delta",
  "Epsilon",
  "Zeta",
  "Eta",
  "Theta",
  "Iota",
  "Kappa",
  "Lambda",
  "Mu",
  "Nu",
  "Xi",
  "Omicron",
  "Pi",
  "Rho",
  "Sigma",
  "Tau",
  "Upsilon",
  "Phi",
  "Chi",
  "Psi",
  "Omega",
  "alpha",
  "beta",
  "gamma",
  "delta",
  "epsilon",
  "zeta",
  "eta",
  "theta",
  "iota",
  "kappa",
  "lambda",
  "mu",
  "nu",
  "xi",
  "omicron",
  "pi",
  "rho",
  "sigmaf",
  "sigma",
  "tau",
  "upsilon",
  "phi",
  "chi",
  "psi",
  "omega",
  "thetasym",
  "upsih",
  "piv"
];
var MATH_ENTITY_NAMES = ["sum", "prod", "infin", "int", "radic", "asymp", "ne", "le", "ge"];
var CURRENCY_NUMERIC_CODE_POINTS = /* @__PURE__ */ new Set([8364, 163, 165, 162, 164]);
var CURRENCY_NAMES = new Set(CURRENCY_ENTITY_NAMES);
var SIGN_NAMES = new Set(SIGN_ENTITY_NAMES);
var GREEK_NAMES = new Set(GREEK_ENTITY_NAMES);
var MATH_NAMES = new Set(MATH_ENTITY_NAMES);
var CONTROLLED_ENTITY_NAMES = [
  SOFT_HYPHEN_ENTITY_NAME,
  ...CURRENCY_ENTITY_NAMES,
  ...SIGN_ENTITY_NAMES,
  ...GREEK_ENTITY_NAMES,
  ...MATH_ENTITY_NAMES
];
function getHtmlEntityContentContext(nodeType, parentTag) {
  switch (nodeType) {
    case "comment":
    case "doctype":
      return "comment";
    case "text":
      return parentTag && isRawTextHtmlElement(parentTag) ? "raw-text" : "text";
    default:
      return "raw-text";
  }
}
function getDecodingMode(context) {
  return context === "attribute" ? DecodingMode.Attribute : DecodingMode.Legacy;
}
function getEntitySyntax(raw) {
  if (/^&#x/i.test(raw)) {
    return "hexadecimal";
  }
  if (raw.startsWith("&#")) {
    return "decimal";
  }
  return "named";
}
function getNumericCodePoint(raw, syntax) {
  if (syntax === "named") {
    return void 0;
  }
  const value = raw.slice(syntax === "hexadecimal" ? 3 : 2, raw.endsWith(";") ? -1 : void 0);
  return Number.parseInt(value, syntax === "hexadecimal" ? 16 : 10);
}
function getEntityName(raw, syntax) {
  if (syntax !== "named") {
    return void 0;
  }
  return raw.slice(1, raw.endsWith(";") ? -1 : void 0);
}
function getEntityGroup(name, syntax, numericCodePoint) {
  if (syntax !== "named") {
    return numericCodePoint !== void 0 && CURRENCY_NUMERIC_CODE_POINTS.has(numericCodePoint) ? "currency" : "other";
  }
  if (name !== void 0 && STRUCTURAL_ENTITY_NAMES.has(name)) {
    return "structural";
  }
  if (name === "nbsp") {
    return "whitespace";
  }
  if (name === SOFT_HYPHEN_ENTITY_NAME) {
    return "soft-hyphen";
  }
  if (name !== void 0 && CURRENCY_NAMES.has(name)) {
    return "currency";
  }
  if (name !== void 0 && SIGN_NAMES.has(name)) {
    return "sign";
  }
  if (name !== void 0 && GREEK_NAMES.has(name)) {
    return "greek";
  }
  if (name !== void 0 && MATH_NAMES.has(name)) {
    return "math";
  }
  return "other";
}
function getEntityPolicy(group) {
  if (group === "structural" || group === "whitespace") {
    return "normalization-exempt";
  }
  if (group === "soft-hyphen" || group === "currency" || group === "sign" || group === "greek" || group === "math") {
    return "toggle-controlled";
  }
  return "decode";
}
function decodeEntityAt(value, ampersandOffset, context, baseOffset, followingSource = "", followingSourceOffset = 0) {
  let decoded = "";
  const decoder = new EntityDecoder(htmlDecodeTree, (codePoint) => {
    decoded += String.fromCodePoint(codePoint);
  });
  decoder.startEntity(getDecodingMode(context));
  let consumed = -1;
  if (ampersandOffset + 1 < value.length) {
    consumed = decoder.write(value, ampersandOffset + 1);
  }
  if (consumed < 0 && followingSourceOffset < followingSource.length) {
    consumed = decoder.write(followingSource, followingSourceOffset);
  }
  if (consumed < 0) {
    consumed = decoder.end();
  }
  if (consumed <= 0 || decoded.length === 0) {
    return void 0;
  }
  const localLength = value.length - ampersandOffset;
  const raw = consumed <= localLength ? value.slice(ampersandOffset, ampersandOffset + consumed) : value.slice(ampersandOffset) + followingSource.slice(followingSourceOffset, followingSourceOffset + consumed - localLength);
  const syntax = getEntitySyntax(raw);
  const terminatedWithSemicolon = raw.endsWith(";");
  const name = getEntityName(raw, syntax);
  const numericCodePoint = getNumericCodePoint(raw, syntax);
  const group = getEntityGroup(name, syntax, numericCodePoint);
  return {
    startOffset: baseOffset + ampersandOffset,
    endOffset: baseOffset + ampersandOffset + consumed,
    raw,
    decoded,
    context,
    syntax,
    terminatedWithSemicolon,
    name,
    numericCodePoint,
    group,
    policy: getEntityPolicy(group)
  };
}
function tokenizeHtmlEntitiesInGap(value, context, baseOffset) {
  const occurrences = [];
  let cursor = 0;
  while (cursor < value.length) {
    const ampersandOffset = value.indexOf("&", cursor);
    if (ampersandOffset === -1) {
      break;
    }
    const occurrence = decodeEntityAt(value, ampersandOffset, context, baseOffset);
    if (occurrence) {
      occurrences.push(occurrence);
      cursor = occurrence.endOffset - baseOffset;
    } else {
      cursor = ampersandOffset + 1;
    }
  }
  return occurrences;
}
function tokenizeHtmlEntities(value, context = "text", baseOffset = 0) {
  if (context === "raw-text" || context === "comment") {
    return [];
  }
  const occurrences = [];
  transformOutsideProtectedTemplateRegions(value, (gap, gapOffset) => {
    occurrences.push(...tokenizeHtmlEntitiesInGap(gap, context, baseOffset + gapOffset));
    return gap;
  });
  return occurrences;
}
function splitHtmlStyleDeclarations(value, options) {
  const source = options?.removeComments ? stripStyleCssComments(value) : value;
  const entitySemicolons = new Set(
    tokenizeHtmlEntities(source, "attribute").filter((occurrence) => occurrence.terminatedWithSemicolon).map((occurrence) => occurrence.endOffset - 1)
  );
  return splitStyleDeclarationsAtSemicolons(source, entitySemicolons);
}
function stripStyleCssComments(value) {
  if (!value.includes("/*") && !value.includes("*/")) {
    return value;
  }
  const protectedRegions = scanProtectedTemplateRegions(value);
  let result = "";
  let protectedRegionIndex = 0;
  let quote;
  const skipMarker = (markerEnd) => {
    let nextOffset = markerEnd;
    const lastCharacter = result[result.length - 1];
    if (isHTMLWhitespace(lastCharacter)) {
      while (nextOffset < value.length && isHTMLWhitespace(value[nextOffset])) {
        nextOffset++;
      }
      return nextOffset;
    }
    const nextCharacter = value[nextOffset];
    const startsAnotherMarker = value.startsWith("/*", nextOffset) || value.startsWith("*/", nextOffset);
    if (lastCharacter !== void 0 && nextCharacter !== void 0 && !isHTMLWhitespace(nextCharacter) && nextCharacter !== ";" && !startsAnotherMarker) {
      result += " ";
    }
    return nextOffset;
  };
  for (let offset = 0; offset < value.length; offset++) {
    while (protectedRegionIndex < protectedRegions.length && protectedRegions[protectedRegionIndex].endOffset <= offset) {
      protectedRegionIndex++;
    }
    const protectedRegion = protectedRegions[protectedRegionIndex];
    if (protectedRegion !== void 0 && protectedRegion.startOffset <= offset && offset < protectedRegion.endOffset) {
      result += value.slice(offset, protectedRegion.endOffset);
      offset = protectedRegion.endOffset - 1;
      continue;
    }
    const character = value[offset];
    if (quote) {
      result += character;
      if (character === "\\" && offset + 1 < value.length) {
        result += value[offset + 1];
        offset++;
      } else if (character === quote) {
        quote = void 0;
      }
      continue;
    }
    if (character === "\\" && offset + 1 < value.length) {
      result += character + value[offset + 1];
      offset++;
      continue;
    }
    const urlEnd = getUnquotedUrlEnd(value, offset);
    if (urlEnd !== void 0) {
      result += value.slice(offset, urlEnd);
      offset = urlEnd - 1;
      continue;
    }
    if (character === "/" && value[offset + 1] === "*") {
      offset = skipMarker(getStyleCommentEnd(value, offset + 2)) - 1;
      continue;
    }
    if (character === "*" && value[offset + 1] === "/") {
      offset = skipMarker(offset + 2) - 1;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
    }
    result += character;
  }
  return result;
}
function getUnquotedUrlEnd(value, offset) {
  const character = value[offset];
  if (character !== "u" && character !== "U" || value.slice(offset, offset + 4).toLowerCase() !== "url(") {
    return void 0;
  }
  let contentStart = offset + 4;
  while (contentStart < value.length && isHTMLWhitespace(value[contentStart])) {
    contentStart++;
  }
  const contentCharacter = value[contentStart];
  if (contentCharacter === '"' || contentCharacter === "'") {
    return void 0;
  }
  return getUnescapedClosingBracket(value, contentStart);
}
function getUnescapedClosingBracket(value, contentStart) {
  for (let offset = contentStart; offset < value.length; offset++) {
    const character = value[offset];
    if (character === "\\") {
      offset++;
      continue;
    }
    if (character === ")") {
      return offset + 1;
    }
  }
  return value.length;
}
function getStyleCommentEnd(value, contentStart) {
  const closingMarker = value.indexOf("*/", contentStart);
  if (closingMarker !== -1) {
    return closingMarker + 2;
  }
  const declarationEnd = value.indexOf(";", contentStart);
  return declarationEnd === -1 ? value.length : declarationEnd;
}
function splitStyleDeclarationsAtSemicolons(value, entitySemicolons) {
  const protectedRegions = scanProtectedTemplateRegions(value);
  const declarations = [];
  let declarationStart = 0;
  let protectedRegionIndex = 0;
  let quote;
  let inComment = false;
  const closingBlocks = [];
  const blockPairs = { "(": ")", "[": "]", "{": "}" };
  for (let offset = 0; offset < value.length; offset++) {
    while (protectedRegionIndex < protectedRegions.length && protectedRegions[protectedRegionIndex].endOffset <= offset) {
      protectedRegionIndex++;
    }
    const protectedRegion = protectedRegions[protectedRegionIndex];
    const isProtected = protectedRegion !== void 0 && protectedRegion.startOffset <= offset && offset < protectedRegion.endOffset;
    if (isProtected) {
      offset = protectedRegion.endOffset - 1;
      continue;
    }
    const character = value[offset];
    if (inComment) {
      if (character === "*" && value[offset + 1] === "/") {
        inComment = false;
        offset++;
      }
      continue;
    }
    if (quote) {
      if (character === "\\") {
        offset++;
      } else if (character === quote) {
        quote = void 0;
      }
      continue;
    }
    if (character === "\\") {
      offset++;
      continue;
    }
    const urlEnd = getUnquotedUrlEnd(value, offset);
    if (urlEnd !== void 0) {
      offset = urlEnd - 1;
      continue;
    }
    if (character === "/" && value[offset + 1] === "*") {
      inComment = true;
      offset++;
      continue;
    }
    if (character === '"' || character === "'") {
      quote = character;
      continue;
    }
    const closingBlock = blockPairs[character];
    if (closingBlock) {
      closingBlocks.push(closingBlock);
      continue;
    }
    if (character === closingBlocks.at(-1)) {
      closingBlocks.pop();
      continue;
    }
    if (character === ";" && closingBlocks.length === 0 && !entitySemicolons.has(offset)) {
      declarations.push(value.slice(declarationStart, offset));
      declarationStart = offset + 1;
    }
  }
  declarations.push(value.slice(declarationStart));
  return declarations;
}
function transformRecognizedEntities(value, context, replacement, occurrences = tokenizeHtmlEntities(value, context)) {
  if (!occurrences.length) {
    return value;
  }
  let result = "";
  let cursor = 0;
  for (const occurrence of occurrences) {
    result += value.slice(cursor, occurrence.startOffset);
    result += replacement(occurrence);
    cursor = occurrence.endOffset;
  }
  return result + value.slice(cursor);
}
function encodeDecodedEntityOccurrences(source, occurrences) {
  if (!occurrences.length) {
    return [];
  }
  const transformedSourceChunks = [];
  const followingSourceOffsets = [];
  let sourceCursor = 0;
  let transformedSourceLength = 0;
  for (const occurrence of occurrences) {
    const sourceGap = source.slice(sourceCursor, occurrence.startOffset);
    transformedSourceChunks.push(sourceGap, occurrence.decoded);
    transformedSourceLength += sourceGap.length + occurrence.decoded.length;
    followingSourceOffsets.push(transformedSourceLength);
    sourceCursor = occurrence.endOffset;
  }
  transformedSourceChunks.push(source.slice(sourceCursor));
  const transformedSource = transformedSourceChunks.join("");
  return occurrences.map((occurrence, index) => encodeHtmlSemanticSource(
    occurrence.decoded,
    occurrence.context,
    transformedSource,
    followingSourceOffsets[index]
  ));
}
function decodeHtmlEntitiesOnce(value, context = "text") {
  if (context === "raw-text" || context === "comment" || !value.includes("&")) {
    return value;
  }
  const mode = getDecodingMode(context);
  return transformOutsideProtectedTemplateRegions(value, (gap) => decodeHTML(gap, mode));
}
function encodeHtmlSemanticSource(value, context = "text", followingSource = "", followingSourceOffset = 0) {
  if (context === "raw-text" || context === "comment") {
    return value;
  }
  const occurrences = value.includes("&") ? tokenizeHtmlEntities(value, context) : [];
  if (followingSourceOffset < followingSource.length && value.includes("&")) {
    const boundaryAmpersandOffset = value.lastIndexOf("&");
    const protectedRegions = scanProtectedTemplateRegions(value);
    const protectedRegion = protectedRegions[findFirstProtectedTemplateRegionIndex(protectedRegions, boundaryAmpersandOffset)];
    const isProtected = protectedRegion !== void 0 && protectedRegion.startOffset <= boundaryAmpersandOffset;
    if (!isProtected) {
      if (occurrences[occurrences.length - 1]?.startOffset === boundaryAmpersandOffset) {
        occurrences.pop();
      }
      const boundaryOccurrence = decodeEntityAt(
        value,
        boundaryAmpersandOffset,
        context,
        0,
        followingSource,
        followingSourceOffset
      );
      if (boundaryOccurrence) {
        occurrences.push(boundaryOccurrence);
      }
    }
  }
  let entityEscapedValue = "";
  let cursor = 0;
  for (const occurrence of occurrences) {
    entityEscapedValue += value.slice(cursor, occurrence.startOffset);
    entityEscapedValue += "&amp;";
    cursor = occurrence.startOffset + 1;
  }
  entityEscapedValue += value.slice(cursor);
  return transformOutsideProtectedTemplateRegions(entityEscapedValue, (gap) => {
    let result = gap.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    if (context === "attribute") {
      result = result.replace(/"/g, "&quot;");
    }
    return result;
  });
}
function preserveConfiguredHtmlEntityLexemes(value, context = "text") {
  const occurrences = tokenizeHtmlEntities(value, context);
  const decodedOccurrences = occurrences.filter((occurrence) => occurrence.policy === "decode");
  const encodedDecodedOccurrences = encodeDecodedEntityOccurrences(value, decodedOccurrences);
  const encodedByOccurrence = new Map(
    decodedOccurrences.map((occurrence, index) => [occurrence, encodedDecodedOccurrences[index]])
  );
  return transformRecognizedEntities(
    value,
    context,
    (occurrence) => encodedByOccurrence.get(occurrence) ?? occurrence.raw,
    occurrences
  );
}
function getHTMLAttributeValueRange(source, startOffset, endOffset) {
  const rawAttribute = source.slice(startOffset, endOffset);
  let cursor = 0;
  while (cursor < rawAttribute.length && !isHTMLWhitespace(rawAttribute[cursor]) && rawAttribute[cursor] !== "=" && rawAttribute[cursor] !== ">" && rawAttribute[cursor] !== "/") {
    cursor++;
  }
  while (cursor < rawAttribute.length && isHTMLWhitespace(rawAttribute[cursor])) {
    cursor++;
  }
  if (rawAttribute[cursor] !== "=") {
    return void 0;
  }
  cursor++;
  while (cursor < rawAttribute.length && isHTMLWhitespace(rawAttribute[cursor])) {
    cursor++;
  }
  const quote = rawAttribute[cursor];
  const valueStart = quote === '"' || quote === "'" ? cursor + 1 : cursor;
  let valueEnd = valueStart;
  if (quote === '"' || quote === "'") {
    while (valueEnd < rawAttribute.length && rawAttribute[valueEnd] !== quote) {
      valueEnd++;
    }
  } else {
    while (valueEnd < rawAttribute.length && !isHTMLWhitespace(rawAttribute[valueEnd]) && rawAttribute[valueEnd] !== ">") {
      valueEnd++;
    }
  }
  return {
    startOffset: startOffset + valueStart,
    endOffset: startOffset + valueEnd
  };
}
function parseHTMLAttributeValueSpansAtTagStart(source, tagStart) {
  let cursor = tagStart + 1;
  if (!/[A-Za-z]/.test(source[cursor] ?? "")) {
    return { isStartTag: false, spans: [] };
  }
  while (cursor < source.length && /[\w:-]/.test(source[cursor])) {
    cursor++;
  }
  const spans = [];
  while (cursor < source.length) {
    while (cursor < source.length && isHTMLWhitespace(source[cursor])) {
      cursor++;
    }
    if (source[cursor] === ">" || source[cursor] === "/" && source[cursor + 1] === ">") {
      break;
    }
    const attributeNameStart = cursor;
    while (cursor < source.length && !isHTMLWhitespace(source[cursor]) && source[cursor] !== "=" && source[cursor] !== ">" && source[cursor] !== "/") {
      cursor++;
    }
    if (cursor === attributeNameStart) {
      break;
    }
    while (cursor < source.length && isHTMLWhitespace(source[cursor])) {
      cursor++;
    }
    if (source[cursor] !== "=") {
      continue;
    }
    cursor++;
    while (cursor < source.length && isHTMLWhitespace(source[cursor])) {
      cursor++;
    }
    const quote = source[cursor];
    const quoted = quote === '"' || quote === "'";
    const valueStart = quoted ? cursor + 1 : cursor;
    let valueEnd = valueStart;
    if (quoted) {
      while (valueEnd < source.length && source[valueEnd] !== quote) {
        valueEnd++;
      }
    } else {
      while (valueEnd < source.length && !isHTMLWhitespace(source[valueEnd]) && source[valueEnd] !== ">") {
        valueEnd++;
      }
    }
    spans.push({ startOffset: valueStart, endOffset: valueEnd, context: "attribute" });
    cursor = quoted && valueEnd < source.length ? valueEnd + 1 : valueEnd;
  }
  return { isStartTag: true, spans };
}
function findHTMLSourceSpanAtOffset(spans, offset) {
  let low = 0;
  let high = spans.length;
  while (low < high) {
    const middle = Math.floor((low + high) / 2);
    if (spans[middle].endOffset <= offset) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }
  const span = spans[low];
  return span?.startOffset <= offset ? span : void 0;
}
function getIncompleteHTMLAttributeValueSpan(source, offset, cache) {
  let tagStart = source.lastIndexOf("<", offset);
  while (tagStart !== -1) {
    let cacheEntry = cache.get(tagStart);
    if (!cacheEntry) {
      cacheEntry = parseHTMLAttributeValueSpansAtTagStart(source, tagStart);
      cache.set(tagStart, cacheEntry);
    }
    if (cacheEntry.isStartTag) {
      const span = findHTMLSourceSpanAtOffset(cacheEntry.spans, offset);
      if (span) {
        return span;
      }
    }
    tagStart = tagStart > 0 ? source.lastIndexOf("<", tagStart - 1) : -1;
  }
  return void 0;
}
function appendUnprotectedEntitySpans(source, startOffset, endOffset, context, excludedSpans, spans, occurrences) {
  let cursor = startOffset;
  const firstRegionIndex = findFirstProtectedTemplateRegionIndex(
    excludedSpans,
    startOffset
  );
  for (let regionIndex = firstRegionIndex; regionIndex < excludedSpans.length; regionIndex++) {
    const region = excludedSpans[regionIndex];
    if (region.startOffset >= endOffset) {
      break;
    }
    const gapEnd = Math.max(cursor, Math.min(region.startOffset, endOffset));
    if (cursor < gapEnd) {
      const span = { startOffset: cursor, endOffset: gapEnd, context };
      spans.push(span);
      occurrences.push(...tokenizeHtmlEntities(source.slice(cursor, gapEnd), context, cursor));
    }
    cursor = Math.max(cursor, Math.min(region.endOffset, endOffset));
  }
  if (cursor < endOffset) {
    const span = { startOffset: cursor, endOffset, context };
    spans.push(span);
    occurrences.push(...tokenizeHtmlEntities(source.slice(cursor, endOffset), context, cursor));
  }
}
function scanHtmlDocumentEntities(source) {
  const occurrences = [];
  const spans = [];
  const protectedRegions = scanProtectedTemplateRegions(source);
  const maskedSource = maskProtectedTemplateRegions(source, protectedRegions);
  const excludedSpans = protectedRegions.map((region) => ({
    startOffset: region.startOffset,
    endOffset: region.endOffset
  }));
  const openTags = [];
  let parser;
  const callbacks = {
    onparserinit: (initializedParser) => {
      parser = initializedParser;
    },
    onopentag: (name) => {
      openTags.push(name.toLowerCase());
    },
    onclosetag: (name) => {
      const normalizedName = name.toLowerCase();
      const index = openTags.lastIndexOf(normalizedName);
      if (index !== -1) {
        openTags.length = index;
      }
    },
    onattribute: () => {
      const parserRange = getBoundedHTMLParserSourceRange(
        parser.startIndex,
        parser.endIndex,
        source.length
      );
      const range = getHTMLAttributeValueRange(
        maskedSource,
        parserRange.startOffset,
        parserRange.endOffset
      );
      if (!range) {
        return;
      }
      appendUnprotectedEntitySpans(
        source,
        range.startOffset,
        range.endOffset,
        "attribute",
        protectedRegions,
        spans,
        occurrences
      );
    },
    ontext: (text) => {
      const { startOffset, endOffset } = getBoundedHTMLParserSourceRange(
        parser.startIndex,
        parser.endIndex,
        source.length
      );
      const maskedText = maskedSource.slice(startOffset, endOffset);
      if (text !== maskedText && maskedText.startsWith("<![CDATA[") && maskedText.endsWith("]]>")) {
        excludedSpans.push({ startOffset, endOffset });
        return;
      }
      const parentTag = openTags[openTags.length - 1];
      if (parentTag !== void 0 && isRawTextHtmlElement(parentTag)) {
        excludedSpans.push({ startOffset, endOffset });
        return;
      }
      appendUnprotectedEntitySpans(
        source,
        startOffset,
        endOffset,
        "text",
        protectedRegions,
        spans,
        occurrences
      );
    },
    oncomment: () => {
      excludedSpans.push(getBoundedHTMLParserSourceRange(
        parser.startIndex,
        parser.endIndex,
        source.length
      ));
    }
  };
  parser = new Parser(callbacks, {
    decodeEntities: true,
    recognizeSelfClosing: true
  });
  parser.end(maskedSource);
  const documentScan = { source, occurrences, spans, excludedSpans };
  MASKED_SOURCE_BY_DOCUMENT_SCAN.set(documentScan, maskedSource);
  return documentScan;
}
function assertHtmlDocumentEntityScanSource(source, documentScan) {
  if (documentScan.source !== source) {
    throw new Error("HTML document entity scan does not match source");
  }
}
function getMaskedSourceForDocumentScan(source, documentScan) {
  assertHtmlDocumentEntityScanSource(source, documentScan);
  const cachedSource = MASKED_SOURCE_BY_DOCUMENT_SCAN.get(documentScan);
  if (cachedSource !== void 0) {
    return cachedSource;
  }
  const maskedSource = maskProtectedTemplateRegions(source);
  MASKED_SOURCE_BY_DOCUMENT_SCAN.set(documentScan, maskedSource);
  return maskedSource;
}
function tokenizeHtmlDocumentEntities(source) {
  return [...scanHtmlDocumentEntities(source).occurrences];
}
function tokenizeHtmlDocumentEntitiesAtOffset(source, offset, documentScan = scanHtmlDocumentEntities(source)) {
  const maskedSource = getMaskedSourceForDocumentScan(source, documentScan);
  const occurrences = [...documentScan.occurrences];
  const covered = documentScan.spans.some((span) => span.startOffset <= offset && offset < span.endOffset) || documentScan.excludedSpans.some((span) => span.startOffset <= offset && offset < span.endOffset);
  if (!covered) {
    const fallbackSpan = getIncompleteHTMLAttributeValueSpan(maskedSource, offset, /* @__PURE__ */ new Map());
    if (fallbackSpan) {
      occurrences.push(...tokenizeHtmlEntities(
        source.slice(fallbackSpan.startOffset, fallbackSpan.endOffset),
        "attribute",
        fallbackSpan.startOffset
      ));
    }
  }
  return occurrences.sort((left, right) => left.startOffset - right.startOffset || left.endOffset - right.endOffset);
}
function intersectsChangedRange(range, startOffset, endOffset) {
  if (range.includeEntityEndingAtStart && endOffset === range.startOffset) {
    return true;
  }
  if (range.startOffset === range.endOffset) {
    return startOffset < range.startOffset && range.startOffset < endOffset;
  }
  return range.startOffset < endOffset && range.endOffset > startOffset;
}
function isInsideAnyRange(ranges, startOffset, endOffset) {
  return ranges.some((range) => intersectsChangedRange(range, startOffset, endOffset));
}
function getCanonicalControlledEntityByCharacter() {
  const result = /* @__PURE__ */ new Map();
  for (const name of CONTROLLED_ENTITY_NAMES) {
    const [occurrence] = tokenizeHtmlEntities("&".concat(name, ";"));
    if (occurrence) {
      result.set(occurrence.decoded, "&".concat(name, ";"));
    }
  }
  return result;
}
var CANONICAL_CONTROLLED_ENTITY_BY_CHARACTER = getCanonicalControlledEntityByCharacter();
function containsControlledHtmlEntityCharacter(value) {
  for (const character of value) {
    if (CANONICAL_CONTROLLED_ENTITY_BY_CHARACTER.has(character)) {
      return true;
    }
  }
  return false;
}
function normalizeHtmlEntitiesInRanges(source, ranges, options, documentScan = scanHtmlDocumentEntities(source)) {
  const maskedSource = getMaskedSourceForDocumentScan(source, documentScan);
  const spans = [...documentScan.spans];
  const occurrences = [...documentScan.occurrences];
  const fallbackSpanKeys = /* @__PURE__ */ new Set();
  const fallbackSpanCache = /* @__PURE__ */ new Map();
  for (const range of ranges) {
    const candidateOffsets = range.startOffset === range.endOffset ? [
      range.startOffset,
      ...range.includeEntityEndingAtStart && range.startOffset > 0 ? [range.startOffset - 1] : []
    ] : [range.startOffset, range.endOffset - 1];
    for (const offset of candidateOffsets) {
      const covered = spans.some((span) => span.startOffset <= offset && offset < span.endOffset) || documentScan.excludedSpans.some((span) => span.startOffset <= offset && offset < span.endOffset);
      if (covered) {
        continue;
      }
      const fallbackSpan = getIncompleteHTMLAttributeValueSpan(maskedSource, offset, fallbackSpanCache);
      if (!fallbackSpan) {
        continue;
      }
      const key = "".concat(fallbackSpan.startOffset, ":").concat(fallbackSpan.endOffset);
      if (fallbackSpanKeys.has(key)) {
        continue;
      }
      fallbackSpanKeys.add(key);
      const fallbackExcludedSpans = documentScan.excludedSpans.filter((span) => span.startOffset < fallbackSpan.endOffset && span.endOffset > fallbackSpan.startOffset);
      appendUnprotectedEntitySpans(
        source,
        fallbackSpan.startOffset,
        fallbackSpan.endOffset,
        "attribute",
        fallbackExcludedSpans,
        spans,
        occurrences
      );
    }
  }
  occurrences.sort((left, right) => left.startOffset - right.startOffset || left.endOffset - right.endOffset);
  const edits = [];
  const decodedOccurrences = [];
  for (const occurrence of occurrences) {
    if (!isInsideAnyRange(ranges, occurrence.startOffset, occurrence.endOffset)) {
      continue;
    }
    if (occurrence.policy === "normalization-exempt") {
      continue;
    }
    if (occurrence.policy === "toggle-controlled" && options.preserveControlledEntities) {
      continue;
    }
    decodedOccurrences.push(occurrence);
  }
  const encodedDecodedOccurrences = encodeDecodedEntityOccurrences(source, decodedOccurrences);
  for (let index = 0; index < decodedOccurrences.length; index++) {
    const occurrence = decodedOccurrences[index];
    edits.push({
      startOffset: occurrence.startOffset,
      endOffset: occurrence.endOffset,
      text: encodedDecodedOccurrences[index]
    });
  }
  if (options.preserveControlledEntities) {
    let occurrenceIndex = 0;
    spans.sort((left, right) => left.startOffset - right.startOffset || left.endOffset - right.endOffset);
    for (const span of spans) {
      while (occurrenceIndex < occurrences.length && occurrences[occurrenceIndex].endOffset <= span.startOffset) {
        occurrenceIndex++;
      }
      let cursor = span.startOffset;
      while (cursor < span.endOffset) {
        while (occurrenceIndex < occurrences.length && occurrences[occurrenceIndex].endOffset <= cursor) {
          occurrenceIndex++;
        }
        const currentOccurrence = occurrences[occurrenceIndex];
        if (currentOccurrence && currentOccurrence.startOffset <= cursor && currentOccurrence.endOffset > cursor) {
          cursor = currentOccurrence.endOffset;
          continue;
        }
        const codePoint = source.codePointAt(cursor);
        if (codePoint === void 0) {
          break;
        }
        const character = String.fromCodePoint(codePoint);
        const endOffset = cursor + character.length;
        const canonicalEntity = CANONICAL_CONTROLLED_ENTITY_BY_CHARACTER.get(character);
        if (canonicalEntity && isInsideAnyRange(ranges, cursor, endOffset)) {
          edits.push({ startOffset: cursor, endOffset, text: canonicalEntity });
        }
        cursor = endOffset;
      }
    }
  }
  edits.sort((left, right) => left.startOffset - right.startOffset || left.endOffset - right.endOffset);
  let normalizedSource = source;
  for (let index = edits.length - 1; index >= 0; index--) {
    const edit = edits[index];
    normalizedSource = normalizedSource.slice(0, edit.startOffset) + edit.text + normalizedSource.slice(edit.endOffset);
  }
  return {
    source: normalizedSource,
    edits,
    occurrences
  };
}

export {
  isHTMLWhitespace,
  getBoundedHTMLParserSourceRange,
  getHtmlEntityContentContext,
  tokenizeHtmlEntities,
  splitHtmlStyleDeclarations,
  decodeHtmlEntitiesOnce,
  encodeHtmlSemanticSource,
  preserveConfiguredHtmlEntityLexemes,
  getHTMLAttributeValueRange,
  scanHtmlDocumentEntities,
  tokenizeHtmlDocumentEntities,
  tokenizeHtmlDocumentEntitiesAtOffset,
  containsControlledHtmlEntityCharacter,
  normalizeHtmlEntitiesInRanges
};

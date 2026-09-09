// Selector-free capture of the page's most prominent visible text.
//
// `DEFAULT_TEXT_SELECTORS` decides a row EXISTS by tag choice, so a heading
// that is not an h1..h3 is not merely unlabelled — it is never captured, and
// nothing downstream can label or even report what was never recorded.
// One storefront is the measured case: zero h1..h3, zero landmarks, and its
// visual heading is a `div` at 32px/700.
//
// This walks text nodes instead of selectors, so tag choice stops deciding
// existence. It over-captures on purpose; ranking and precision are a
// downstream job.
//
// The rows land in their OWN artifact and are deliberately NOT merged into
// `text-styles.json`. `rankTypographyCandidates` (assemble-candidates.js:713,
// called at 990-991) buckets that array by (family, weight, size) and scores
// confidence from bucket counts, so adding rows would move candidates and the
// >=0.3 blocker predicates on every site that works today.

// The currency-anchored parsers that already own "does this text read as a
// price". Imported rather than re-derived: see `salientRowReadsAsPrice`.
import { hasLetters, textReadsAsAnchoredPrice } from "./product-data.js";

const LANDMARK_MATCH =
  "header,nav,main,footer,aside,section,form," +
  "[role='banner'],[role='navigation'],[role='contentinfo'],[role='main'],[role='complementary'],[role='search']";

// Mirrors the background probe's `autoRows` cap (lib.js `slice(0, 80)`).
const SALIENT_ROW_CAP = 80;

function sharedProbeSource() {
  return {
    LANDMARK_MATCH,
    SALIENT_ROW_CAP,
  };
}

export async function collectSalientText(page) {
  return page.evaluate(
    ({ constants }) => {
      const helpers = window.__brandkitProbeHelpers || {};
      const normalize =
        helpers.normalizeWhitespace || ((text) => String(text || "").replace(/\s+/g, " ").trim());
      const toHex = helpers.toHex || (() => null);
      const normalizeFontWeight =
        helpers.normalizeFontWeight || ((value) => Number.parseInt(value, 10) || null);
      const parsePx =
        helpers.parsePxFromComputed ||
        ((value) => {
          const parsed = Number.parseFloat(value);
          return Number.isFinite(parsed) ? parsed : null;
        });
      const isVisible =
        helpers.isVisibleElement ||
        ((element) => {
          const style = window.getComputedStyle(element);
          const rect = element.getBoundingClientRect();
          return (
            style.display !== "none" &&
            style.visibility !== "hidden" &&
            rect.width > 0 &&
            rect.height > 0
          );
        });

      const scrollY = window.scrollY || window.pageYOffset || 0;
      const seen = new Set();
      const candidates = [];

      // Suppression delegates to the probe helpers' own predicate, the one
      // `recoverVisibleLabel` walks with. The first version of this filter
      // rejected only script/style/noscript/title, which let through two
      // classes that RENDER and therefore read as prominent page text:
      // `aria-hidden="true"` (screen-reader scaffolding, visually present)
      // and `svg`/`symbol`/`defs` text. `[hidden]` was caught only
      // incidentally, by the visibility check further down.
      const isSuppressed =
        helpers.isSuppressedTextContainer ||
        ((element) => {
          if (!(element instanceof Element)) return true;
          if (element.closest("[hidden], [aria-hidden='true'], script, style, noscript, svg, symbol, defs")) {
            return true;
          }
          return !isVisible(element);
        });

      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
          if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          const parent = node.parentElement;
          if (!parent) return NodeFilter.FILTER_REJECT;
          if (isSuppressed(parent)) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });

      // Bounded on purpose: a text-node walk over a large storefront can visit
      // tens of thousands of nodes, and the cap below only trims the OUTPUT.
      // This trims the WALK, so a pathological page cannot stall the probe.
      let visited = 0;
      const VISIT_CAP = 20000;

      while (walker.nextNode() && visited < VISIT_CAP) {
        visited += 1;
        const element = walker.currentNode.parentElement;
        if (!element || seen.has(element)) continue;
        seen.add(element);
        if (!isVisible(element)) continue;

        const text = normalize(element.innerText || element.textContent || "");
        if (text.length < 2 || text.length > 240) continue;

        const rect = element.getBoundingClientRect();
        if (rect.width < 8 || rect.height < 8) continue;

        const style = window.getComputedStyle(element);
        const fontSizePx = parsePx(style.fontSize);
        // `salient text at 0px` is a contradiction: sites zero the font size
        // to hide screen-reader labels and icon-font glyphs while keeping a
        // clickable box, so the row passes the rect floor above.
        if (!Number.isFinite(fontSizePx) || fontSizePx < 1) continue;
        const fontWeight = normalizeFontWeight(style.fontWeight);

        const landmarkNode = element.closest(constants.LANDMARK_MATCH);
        const landmarkRole = landmarkNode ? landmarkNode.getAttribute("role") : null;

        candidates.push({
          tag: element.tagName.toLowerCase(),
          className: typeof element.className === "string" ? element.className.slice(0, 160) : "",
          id: element.id || "",
          text: text.slice(0, 140),
          color: toHex(style.color),
          fontFamily: style.fontFamily || null,
          fontWeight,
          fontSize: style.fontSize || null,
          fontSizePx,
          lineHeight: style.lineHeight || null,
          letterSpacing: style.letterSpacing || null,
          textTransform: style.textTransform || null,
          rect: {
            x: Math.round(rect.x * 100) / 100,
            y: Math.round(rect.y * 100) / 100,
            width: Math.round(rect.width * 100) / 100,
            height: Math.round(rect.height * 100) / 100,
          },
          documentY: Math.round((rect.y + scrollY) * 100) / 100,
          areaPx: Math.round(rect.width * rect.height),
          landmark: landmarkNode
            ? {
                tag: landmarkNode.tagName.toLowerCase(),
                role: landmarkRole ? landmarkRole.toLowerCase() : null,
                className:
                  typeof landmarkNode.className === "string"
                    ? landmarkNode.className.slice(0, 120)
                    : "",
              }
            : null,
          // Kept so a downstream rung can tell "this element IS the text" from
          // "this element is a wrapper that happens to contain one string".
          childElementCount: element.childElementCount,
        });
      }

      // COLLAPSE BY SIGNATURE BEFORE RANKING. Without this the cap is worse
      // than useless on the site class this exists for: measured on that
      // storefront, 61 of the 80 slots went to ONE 32px/700 signature — a heading and 60
      // bare price strings — 70 of 80 rows sat inside `form`, and nothing
      // below 15.4px survived. The header, nav and footer strata live at
      // 12-14px, and header-/footer-typography are two of that site's three
      // recorded gaps, so the artifact rescued the heading and none of the
      // other rows it exists to rescue.
      //
      // COLOUR IS IN THE KEY and must stay there: that site's heading and its
      // prices are the same family, size and weight, and differ only by
      // `#1c1c1c` vs `#f71720`. Drop colour and the heading collapses into
      // the price bucket and may vanish behind it.
      //
      // TAG is in the key as the belt to colour's braces. `toHex` comes from
      // the injected probe helpers and falls back to `() => null` when they
      // are absent; with every colour null, colour stops discriminating and
      // the heading merges into the prices — observed, not theorised. Tag
      // still separates them (`div` heading, `span` price there), so the
      // one row this artifact exists to carry survives a helper failure.
      //
      // The representative is the largest-area instance, which is the most
      // visually prominent place that style is used. `occurrences` and a few
      // sample texts are kept so a downstream reader can tell a repeated
      // product-grid style from a one-off headline without re-walking.
      const bySignature = new Map();
      for (const candidate of candidates) {
        const key = [
          candidate.tag,
          candidate.fontFamily,
          candidate.fontSizePx,
          candidate.fontWeight,
          candidate.color,
        ].join("|");
        const existing = bySignature.get(key);
        if (!existing) {
          bySignature.set(key, { ...candidate, occurrences: 1, sampleTexts: [candidate.text] });
          continue;
        }
        existing.occurrences += 1;
        if (existing.sampleTexts.length < 3 && !existing.sampleTexts.includes(candidate.text)) {
          existing.sampleTexts.push(candidate.text);
        }
        if (candidate.areaPx > existing.areaPx) {
          const { occurrences, sampleTexts } = existing;
          bySignature.set(key, { ...candidate, occurrences, sampleTexts });
        }
      }
      const collapsed = [...bySignature.values()];

      // Rank by visual prominence: size dominates, weight breaks ties among
      // same-size rows, area separates a headline from an equally-styled
      // inline label. Deliberately NOT a role decision — this only decides
      // which rows survive the cap.
      collapsed.sort((a, b) => {
        if (b.fontSizePx !== a.fontSizePx) return b.fontSizePx - a.fontSizePx;
        const weightA = a.fontWeight || 400;
        const weightB = b.fontWeight || 400;
        if (weightB !== weightA) return weightB - weightA;
        return b.areaPx - a.areaPx;
      });

      return {
        status: "ok",
        walkTruncated: visited >= VISIT_CAP,
        visitedTextNodes: visited,
        candidateCount: candidates.length,
        distinctSignatures: collapsed.length,
        rows: collapsed.slice(0, constants.SALIENT_ROW_CAP),
      };
    },
    { constants: sharedProbeSource() },
  );
}

// The always-written shape. `productData` and `logoAssets` do the same: the
// artifact exists on every path so a reader never has to distinguish "absent
// because the probe failed" from "absent because nobody wrote it".
export function emptySalientTextArtifact({ status, error = null } = {}) {
  return {
    status: status || "empty",
    ...(error ? { error } : {}),
    walkTruncated: false,
    visitedTextNodes: 0,
    candidateCount: 0,
    distinctSignatures: 0,
    rows: [],
  };
}

// ---------------------------------------------------------------------------
// READING THE ARTIFACT BACK
//
// Everything above WRITES `salient-text.json`; everything below READS one.
// The readers live here, beside the walk, because of the delegation rule in
// `lib/role-evidence.js`: a consumer must ask the PRODUCER what its own rows
// mean rather than re-deriving it. What a recorded row is, and which recorded
// rows are structurally admissible for a region role, are this module's facts.
//
// ADMISSIBLE IS NOT "IS THE HEADING". The walk above says so explicitly —
// ranking here "is deliberately NOT a role decision" — and that does not
// change because someone downstream would like an answer. These predicates
// answer one narrower, purely factual question: does the capture hold a row
// whose RECORDED shape is compatible with this role, such that "the page
// offers nothing for it" would be a false thing to say? Nothing here decides
// which row IS the role, and no caller may read it that way.

// Tolerant read, mirroring `readProbedSelectors`. `null` means UNKNOWN — no
// artifact, or one no reader can use — never "the page had no salient text".
// Every capture written before this artifact existed lands here, and must
// grade exactly as it did then.
export function readSalientRows(artifact) {
  if (!artifact || typeof artifact !== "object") return null;
  if (!Array.isArray(artifact.rows)) return null;
  const rows = artifact.rows.filter((row) => row && typeof row === "object");
  return rows.length ? rows : null;
}

// The lane marker a candidate built from these rows carries.
//
// It exists because a candidate's VALUE cannot say where it came from, and one
// consumer has to know: the region-role value anchor accepts a salient-sourced
// candidate and must refuse a selector-sourced one. Measured across 21 real
// captures, 1 site grades `heading-typography` as `no_evidence` while the
// selector lane still publishes candidates for it -- there, the top publishable
// value was a white 18px/600 bucket of `a` and `button` labels ("cookies",
// "view all", "subscribe") at confidence 0.83. Anchoring on that would ship a
// CTA style as the brand's heading font, which is #131's defect in different
// clothes: the ranker's `weight >= 600 && sizePx >= 18` was never a claim that
// a row IS a heading.
//
// A string rather than a boolean so a future lane names itself instead of
// inheriting "not salient".
export const SALIENT_CANDIDATE_SOURCE = "salient-text";

// The roles a recorded row can be structurally admissible FOR. Any other role
// gets an empty list: `salientRowsForRole` never guesses.
export const SALIENT_ADMISSIBLE_ROLES = Object.freeze([
  "heading-typography",
  "body-typography",
  "header-typography",
  "footer-typography",
  "button-typography",
  "heading-text",
  "body-text",
]);

const HEADER_LANDMARK_TAGS = new Set(["header", "nav"]);
const HEADER_LANDMARK_ROLES = new Set(["banner", "navigation"]);
const FOOTER_LANDMARK_TAGS = new Set(["footer"]);
const FOOTER_LANDMARK_ROLES = new Set(["contentinfo"]);

function lowerString(value) {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

// Is this row the element that IS the text, rather than a wrapper that happens
// to contain one string? `childElementCount` is recorded for exactly this
// question — see the comment on it in the walk. A row that does not answer it
// is not admissible: an unreadable row must never be able to soften a message.
function isLeafRow(row) {
  return Number.isInteger(row?.childElementCount) && row.childElementCount === 0;
}

function landmarkMatches(row, tags, roles) {
  const landmark = row?.landmark;
  if (!landmark || typeof landmark !== "object") return false;
  return tags.has(lowerString(landmark.tag)) || roles.has(lowerString(landmark.role));
}

// The salient twin of the ranker's `isPriceProbeRow`, and it has to be a twin
// rather than the same call: a selector-free row HAS no selector, so "did the price probe
// produce this?" has no answer here. What the artifact records instead is the
// text it measured -- `text` plus up to three `sampleTexts` -- which is exactly
// what those fields are for.
//
// The reasoning is not re-invented. "Does this text read as a price" is
// already answered in `lib/product-data.js` by `parsePriceText` and
// `salvageAnchoredPrice`; both are currency-anchored and both decline a bare
// numeral by contract, so the second arm asks that module's other question --
// `hasLetters`, the test `cleanTitle` uses to reject a name candidate that is
// only digits. That site's ~60 price strings are bare numerals and land there.
//
// ANY recorded text, not every. A signature collapses rows that render
// identically, so a bucket whose samples mix "100" with a headline cannot be
// told apart by anything the walk recorded. Excluding it costs a candidate the
// run never had; admitting it puts the price colour into the one field
// `SKILL.md` tells the agent to copy -- which is the production defect #131
// closed on the selector side.
export function salientRowReadsAsPrice(row) {
  if (!row || typeof row !== "object") return false;
  const texts = [row.text, ...(Array.isArray(row.sampleTexts) ? row.sampleTexts : [])];
  for (const raw of texts) {
    if (typeof raw !== "string") continue;
    const text = raw.trim();
    if (!text) continue;
    if (!hasLetters(text)) return true;
    if (textReadsAsAnchoredPrice(text)) return true;
  }
  return false;
}

// The rows this capture ranks first by its OWN prominence order: the largest
// recorded font size, and among those the heaviest recorded weight. It is the
// only prominence statement this module makes, and it is a measurement — "the
// most prominent text on the page" — not a claim that the text is a heading.
export function salientProminenceLeaders(rows) {
  const usable = (Array.isArray(rows) ? rows : []).filter(
    (row) => row && typeof row === "object" && Number.isFinite(row.fontSizePx),
  );
  if (usable.length === 0) return [];
  const topSize = Math.max(...usable.map((row) => row.fontSizePx));
  const atTopSize = usable.filter((row) => row.fontSizePx === topSize);
  const topWeight = Math.max(
    ...atTopSize.map((row) => (Number.isFinite(row.fontWeight) ? row.fontWeight : 400)),
  );
  return atTopSize.filter(
    (row) => (Number.isFinite(row.fontWeight) ? row.fontWeight : 400) === topWeight,
  );
}

// Which recorded rows are structurally admissible for `role`?
//
// Each arm rests on a field the walk actually records, and on nothing else:
//   heading-*  the capture's own prominence leaders. A heading is the page's
//              most prominent text; which of the leaders it is, is not asked.
//   body-*     the leaf rows BELOW those leaders — the shape of running copy.
//   header-/footer-typography  the recorded `landmark`, which is the region
//              these roles are named after.
//   button-typography          the recorded `tag`.
// Unknown roles, and rows that are not leaves, yield nothing.
export function salientRowsForRole(rows, role) {
  // PRICE-SHAPED ROWS ARE DROPPED FIRST, before any tier is chosen. They used
  // to be filtered by the ranker AFTER `salientProminenceLeaders` had already
  // taken `Math.max` over every row, so a 48px price above a 32px heading
  // selected the price tier and the filter then emptied it -- `[]`, and no
  // fallthrough to the next tier. Reproduced: deleting the price row published
  // the heading at 0.75, and leaving it published nothing at all.
  //
  // It belongs here rather than at the call site because `salientProminenceLeaders`
  // is what reads the tier, and a rule applied on the far side of that call can
  // only ever undo its result. The body arm reads the same exclusion in the
  // other direction: with prices out of the leader set, a 32px heading is no
  // longer "below the leaders" and stops being offered as body copy.
  const usable = (Array.isArray(rows) ? rows : [])
    .filter(isLeafRow)
    .filter((row) => !salientRowReadsAsPrice(row));
  if (usable.length === 0) return [];
  if (role === "heading-typography" || role === "heading-text") {
    return salientProminenceLeaders(usable);
  }
  if (role === "body-typography" || role === "body-text") {
    const leaders = new Set(salientProminenceLeaders(usable));
    return usable.filter((row) => !leaders.has(row));
  }
  if (role === "header-typography") {
    return usable.filter((row) => landmarkMatches(row, HEADER_LANDMARK_TAGS, HEADER_LANDMARK_ROLES));
  }
  if (role === "footer-typography") {
    return usable.filter((row) => landmarkMatches(row, FOOTER_LANDMARK_TAGS, FOOTER_LANDMARK_ROLES));
  }
  if (role === "button-typography") {
    return usable.filter((row) => lowerString(row.tag) === "button");
  }
  return [];
}

// Every recorded row the walk placed inside the FOOTER landmark, whatever its
// shape. The footer-text colour synthesiser reads this; nothing else does.
//
// WHY IT IS NOT `salientRowsForRole(rows, "footer-typography")`, which filters
// the same landmark. That accessor answers a TYPOGRAPHY admissibility question
// and drops two classes on the way: rows that are not leaves (a wrapper that
// happens to contain one string cannot be the element whose font is copied) and
// price-shaped rows. Neither exclusion is true of a COLOUR: `color` is a
// computed style the walk recorded on every row it kept, and a wrapper paints
// its text in exactly the colour its children inherit. Measured on the 50-dir
// corpus, the two sets disagree on 2 dirs, and on both the leaf filter removes
// the dominant grey run and crowns a `#ffffff` minority that the page render
// does not show as the footer's text colour. So this is the landmark, and only
// the landmark -- the one fact the walk recorded about where a row sits.
//
// Landmark membership is the SAME predicate `salientRowsForRole` uses for
// `footer-typography` (`landmarkMatches` over the footer tag/role sets), so the
// two readers cannot drift about what "inside the footer" means.
export function salientFooterLandmarkRows(rows) {
  return (Array.isArray(rows) ? rows : []).filter(
    (row) =>
      row &&
      typeof row === "object" &&
      landmarkMatches(row, FOOTER_LANDMARK_TAGS, FOOTER_LANDMARK_ROLES),
  );
}

// One line naming a recorded row: what was measured, nothing inferred. Used by
// the coverage gates so a gap can say what the capture holds instead of
// asserting the page holds nothing. The row's TEXT is deliberately not here —
// a signature identifies the row without republishing page copy into a
// diagnostic that travels to the report.
export function describeSalientRow(row) {
  if (!row || typeof row !== "object") return "";
  const tag = lowerString(row.tag) || "?";
  const size = Number.isFinite(row.fontSizePx) ? `${row.fontSizePx}px` : "?px";
  const weight = Number.isFinite(row.fontWeight) ? row.fontWeight : "?";
  const colour = lowerString(row.color) || "colour not recorded";
  const landmarkTag = lowerString(row?.landmark?.tag);
  const landmark = landmarkTag ? ` inside <${landmarkTag}>` : "";
  return `<${tag}> ${size}/${weight} ${colour}${landmark}`;
}

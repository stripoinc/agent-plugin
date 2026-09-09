// Count the social-looking controls a page draws WITHOUT an href.
//
// WHY THIS EXISTS. `collectPageSignals` builds `socials` from `a[href]` and
// grades the capture with `unfilteredSocialPlatforms`, which is also
// `a[href]`-only. Both sides therefore answer the same question, and on a site
// whose footer icons are `<a>` elements with no `href` at all — the click is
// wired in JS — both come back EMPTY. An empty kit then reads as an honest
// absence, the run reports "no socials", and the replace-only save CLEARS the
// account's socials. Measured on two live storefronts in one day's fleet: one
// drew 6 such anchors inside a `div` whose class carries `social`, the other 2,
// and both runs reported the site as having no social presence.
//
// WHAT THIS IS NOT. It is not a classifier. Nothing in the captured DOM names
// the platform behind an href-less icon — the class is `…social-icon` on all
// six of them — so any platform this produced would be a guess, and the whole
// point of the `unfilteredSocialPlatforms` grade is to keep "the probe missed
// it" apart from "the site does not have it". This produces the one thing that
// IS a fact: how many such controls there are, and where they sit. COUNTS AND
// SELECTORS ONLY — no URLs, no anchor text, nothing that could carry a person's
// name or address into a public artifact, which is the same discipline the
// unfiltered counts next to it already keep.
//
// The consumer is a WARNING, never a blocker: the finalizer and its JS twin say
// the socials capture is unproven rather than absent when this count is
// positive and the kit carries no social url. Nothing here gates a save.

// The scan is SELF-CONTAINED BY CONTRACT, following the
// `inline-svg-logo-capture.js` precedent: Playwright ships the function to the
// page as source text, so it may not close over anything in this module. Its
// selectors and its cap are therefore spelled INSIDE it and are deliberately
// not re-exported as module constants — the one drift this file could have is
// a constant here disagreeing with the literal the page actually runs, and the
// cheapest way to not have it is to have one spelling.

// Visible controls in a social container that carry no `href`.
//
// Runs in the page (via `page.evaluate`) with `doc` defaulting to the page's
// own `document`; a unit test passes a fake document instead. Everything it
// needs from the environment it reads THROUGH `doc` (`doc.defaultView`), so a
// fake needs only `querySelectorAll`, per-element `closest` /
// `getAttribute` / `getBoundingClientRect`, and — if the test exercises
// visibility — a `defaultView.getComputedStyle`.
//
// TOTAL: a document it cannot read, or a selector this engine refuses, yields
// `{count: 0, containerSelectors: []}` rather than throwing. The caller treats
// a zero count and an absent field alike, so degrading costs the signal and
// never the run.
export function countHrefLessSocialControls(doc = globalThis.document) {
  // A container names ITSELF social. `soc-` catches the abbreviated spelling
  // (`ul.soc-list`), and the `aria-label` arm is case-insensitive because a
  // label is prose ("Social media"), unlike a class value, which CSS attribute
  // matching compares case-SENSITIVELY.
  const CONTAINER_SELECTOR =
    "[class*='social'],[id*='social'],[class*='soc-'],[class*='socials'],[aria-label*='social' i]";
  // `a:not([href])` is the measured shape. `[role='link']` and `button` are
  // here because the same JS wiring is just as often hung on a `<button>` or
  // an ARIA link, and both are then filtered by the href test below — which is
  // what keeps an `<a href>` that also carries `role="link"` out of the count.
  const CONTROL_SELECTOR = "a:not([href]), [role='link'], button";
  // Diagnostics must not become the payload. Three is enough to find the
  // container by hand; a page with 40 social-classed merchant tiles must not
  // write 40 selectors into page-signals.json.
  const MAX_CONTAINER_SELECTORS = 3;

  const empty = { count: 0, containerSelectors: [] };
  if (!doc || typeof doc.querySelectorAll !== "function") return empty;

  const view = doc.defaultView || null;
  const computedStyleFor = view && typeof view.getComputedStyle === "function"
    ? (element) => {
      try {
        return view.getComputedStyle(element);
      } catch {
        return null;
      }
    }
    : () => null;

  // The same three questions `collectPageSignals`'s own `isVisible` asks
  // (display, visibility, opacity, non-zero box) asked of a duck-typed
  // element, because this half may not close over that closure. A document
  // that exposes no computed style at all leaves the style arms unanswered and
  // the box decides — the honest degradation for a fake, and unreachable in
  // the browser, where `defaultView` is `window`.
  const isVisible = (element) => {
    if (!element || typeof element.getBoundingClientRect !== "function") return false;
    const style = computedStyleFor(element);
    if (style) {
      if (style.display === "none") return false;
      if (style.visibility === "hidden") return false;
      if (!(Number(style.opacity ?? "1") > 0)) return false;
    }
    let rect = null;
    try {
      rect = element.getBoundingClientRect();
    } catch {
      return false;
    }
    return Boolean(rect) && Number(rect.width) > 0 && Number(rect.height) > 0;
  };

  const cssEscape = (value) => {
    const stringValue = String(value || "");
    if (!stringValue) return "";
    const css = view && view.CSS;
    if (css && typeof css.escape === "function") return css.escape(stringValue);
    return stringValue.replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`);
  };

  const simpleSelectorFor = (element) => {
    if (!element || typeof element.tagName !== "string") return "";
    if (element.id) return `#${cssEscape(element.id)}`;
    const classNames = typeof element.className === "string"
      ? element.className
        .split(/\s+/)
        .map((value) => value.trim())
        .filter(Boolean)
        .map(cssEscape)
        .slice(0, 3)
      : [];
    const tag = element.tagName.toLowerCase();
    return classNames.length ? `${tag}.${classNames.join(".")}` : tag;
  };

  let controls = [];
  try {
    controls = Array.from(doc.querySelectorAll(CONTROL_SELECTOR) || []);
  } catch {
    return empty;
  }

  let count = 0;
  const containerSelectors = [];
  const seenSelectors = new Set();
  for (const control of controls) {
    if (!control || typeof control.getAttribute !== "function") continue;
    // An href of ANY value disqualifies the control: a control the browser can
    // already follow is not the missed-capture shape, it is a link the
    // `a[href]` collector saw and judged on its own merits.
    if (control.getAttribute("href") != null) continue;
    if (typeof control.closest !== "function") continue;
    let container = null;
    try {
      container = control.closest(CONTAINER_SELECTOR);
    } catch {
      container = null;
    }
    if (!container) continue;
    if (!isVisible(control)) continue;
    count += 1;
    const selector = simpleSelectorFor(container);
    if (!selector || seenSelectors.has(selector)) continue;
    seenSelectors.add(selector);
    if (containerSelectors.length < MAX_CONTAINER_SELECTORS) {
      containerSelectors.push(selector);
    }
  }
  return { count, containerSelectors };
}

// Node-side half. Returns `null` when the page cannot answer, so the caller
// OMITS the field rather than publishing a zero it did not measure — an absent
// field and a zero mean the same thing to the warning, but only one of them is
// a claim.
export async function collectHrefLessSocialControls(page) {
  if (!page || typeof page.evaluate !== "function") return null;
  try {
    const result = await page.evaluate(countHrefLessSocialControls);
    if (!result || typeof result !== "object") return null;
    // `typeof`, not `Number(...)`: the finalizer's own reader refuses a
    // non-number outright, so coercing `"6"` here would publish a field the
    // consumer then ignores — a claim with no reader.
    const count = result.count;
    if (typeof count !== "number" || !Number.isInteger(count) || count < 0) return null;
    const containerSelectors = Array.isArray(result.containerSelectors)
      ? result.containerSelectors.filter((entry) => typeof entry === "string" && entry)
      : [];
    return { count, containerSelectors };
  } catch {
    return null;
  }
}

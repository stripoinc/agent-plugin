// Overlay dismissal for the hover probes (lib.js `collectButtonStyles`,
// `captureProductCardCtaHoverStates`, `hoverLikelyProductCards`).
//
// WHY THIS EXISTS. Playwright's `locator.hover()` performs a hit-target check:
// it refuses when `elementFromPoint` at the action point is not the target or
// one of its descendants, retries until the actionability timeout, then throws
// "… intercepts pointer events" naming the element that took the hit. Nothing
// in the homepage pass closed an overlay, so on a storefront that opens a
// newsletter dialog or a subscribe popup a few seconds after settle EVERY
// budget row paid the full timeout (18/20 and 19/20 timeouts, 40 s of phase 2,
// measured live), every row shipped `hover: null`, the kit carried an empty
// hover colour and the consumer rendered its fallback -- while the pass
// reported itself `completed` and the probe `not degraded`.
//
// HOW IT HOLDS FOR A PAGE NEVER SEEN.
//
//   * DETECTION IS THE PLATFORM'S OWN HIT TEST. `detectInterceptorRoot` asks
//     `elementFromPoint` the same question Playwright asks of the same point,
//     so it sees exactly the class Playwright times out on -- whatever the
//     overlay's markup, class names or language -- and nothing else: a sticky
//     header or a chat launcher that does not cover the target never triggers
//     it. An element that covers the target is, by that fact, an interceptor.
//
//   * DISMISSAL USES CLOSE AFFORDANCES THE PLATFORM DEFINES, not site
//     vocabulary, escalating from the least to the most intrusive: Escape (the
//     `cancel` event of a modal dialog and the universal ESC handler), then
//     `HTMLDialogElement.close()`, then a control whose ACCESSIBLE NAME is a
//     close word or glyph, then a click on a mask that covers the whole
//     viewport. Each step is followed by the SAME re-detection; the first step
//     after which nothing intercepts ends the escalation.
//
//   * IT CAN NEVER NAVIGATE, SUBMIT OR ACCEPT. Three structural exclusions
//     (a real-href anchor, a submit/reset control or a form button, a name that
//     is a consent CHOICE) plus two guards installed for the duration of an
//     attempt (a `beforeunload` prompt that a `dialog` listener dismisses, and
//     a capturing `click` listener that cancels every default action while
//     letting the page's own handlers run) plus a URL check after every step
//     (`goBack` is the belt). A consent choice -- accept / decline / manage --
//     is a decision with a stored consequence, never a dismissal: a site whose
//     only exit is a choice is deliberately left intercepting, recorded, and
//     the probe degrades to today's behaviour.
//
//   * NO NEW NUMBERS. The settle wait and the click timeout are the probe's
//     own constants, passed in by lib.js; the corner inset of the mask probe is
//     a hit-test point, not a decision (`elementFromPoint` decides); an
//     interceptor is attempted ONCE (an escalation that failed cannot succeed
//     by repetition).
//
// NEVER-FAIL. Every entry point swallows its own errors and reports them in
// the attempt record; a dismissal that fails leaves the probe exactly where it
// was (a null hover and a classified timeout), never aborts a pass.
//
// The page functions below run inside the browser through `evaluate` and
// therefore close over NOTHING; the vocabulary they need travels as an
// argument, so this module has one copy of each literal. `lib.js
// buttonProbeBaseEvaluate` repeats two of them (its signature is fixed by its
// callers, so it cannot take them as an argument either) and
// `overlay-dismissal.test.js` asserts the copies are string-equal.

export const OVERLAY_ROOT_SELECTOR =
  "dialog[open], [aria-modal='true'], [role='dialog'], [role='alertdialog']";

// A consent CHOICE -- accept / decline / manage -- matched on the control's
// accessible name, whole-label, in the languages the ranker's chrome
// vocabulary already covers (assemble-candidates.js EXACT_CHROME_TEXTS) plus
// the decline side. Tested against every contiguous word window of a name, so
// "close & accept" is a choice too.
export const CONSENT_CHOICE_PATTERN =
  /^\s*(?:accept(?:\s+all)?(?:\s+cookies)?|allow(?:\s+all)?(?:\s+cookies)?|(?:i\s+)?agree|i\s+accept|got\s+it|ok(?:ay)?|decline|reject(?:\s+all)?|deny|manage(?:\s+(?:preferences|settings|cookies))?|cookie\s+settings|customi[sz]e|прийняти(?:\s+вс[іе])?|принять(?:\s+вс[её])?|погоджуюс[ья]|согласен|відхилити|отклонить|налаштування|настройки|akzeptieren|alle\s+akzeptieren|ablehnen|zustimmen|einverstanden|akceptuj[ęe]?|zaakceptuj|odrzuć|zgadzam\s+się|accetta(?:\s+tutt[oie])?|rifiuta|acconsento|aceptar(?:\s+tod[oa]s?)?|rechazar|de\s+acuerdo|accepter|tout\s+accepter|refuser|j['’]accepte|aceitar(?:\s+tudo)?|recusar|concordo)\s*$/iu;

// A CLOSE affordance: a glyph as the whole name, or a name that STARTS with
// the word "close" (in the languages above) -- "Close", "Close dialog",
// "Закрити вікно". Whatever follows the close word is checked against the
// consent vocabulary by the caller, so "close & accept" is never a close.
export const CLOSE_CONTROL_PATTERN =
  /^\s*(?:[×✕✖⨯x]\s*$|(?:[×✕✖⨯]\s*)?(?:close|dismiss|закрити|закрыть|schließen|schliessen|zamknij|fermer|cerrar|chiudi|fechar|sluiten)(?:\s|$))/iu;

// A close affordance spelled in a class or id when the name is empty or a
// single glyph (an icon button): `modal__close`, `btn-close`, `js-dismiss`.
// Word-bounded so `closed`, `disclosure` and `closet` do not match.
export const CLOSE_CLASS_PATTERN = /(?:^|[-_\s])(?:close|dismiss)(?=[-_\s]|$|[A-Z])/;

const INTERACTIVE_SELECTOR = "a, button, [role='button'], input, select, textarea, label, summary";

// Elements that are CONTENT, never a mask: a click on their corner is a click
// on a third-party frame, a media control or a form.
const NEVER_A_MASK_SELECTOR =
  `${INTERACTIVE_SELECTOR}, iframe, embed, object, video, audio, canvas, form, details`;

// Probe inset for the mask click, in CSS px. A hit-test point, not a decision:
// `elementFromPoint` at that point must be the mask ITSELF for the click to
// happen, so any positive inset inside the rect gives the same outcome.
const MASK_PROBE_INSET_PX = 4;

function patternArg(pattern) {
  return { source: pattern.source, flags: pattern.flags };
}

// ---------------------------------------------------------------------------
// Page functions (run inside the browser; no closure).
// ---------------------------------------------------------------------------

/**
 * The element that would take a pointer aimed at `element`'s centre, resolved
 * to the ROOT of the thing that covers it, or `null` when nothing does.
 *
 * `null` exactly when Playwright's hit-target check would pass: the hit is the
 * target itself or one of its descendants (composed tree, so a target inside
 * an open shadow root is judged in its own root).
 *
 * The root is the OUTERMOST positioned (fixed / absolute / sticky) ancestor of
 * the hit that does not contain the target -- the mask around a modal box, the
 * modal `<dialog>` itself (its computed position is fixed), a sticky bar --
 * falling back to the innermost dialog-role ancestor, then to the hit itself.
 * It can never be an ancestor of the target; when the hit IS such an ancestor
 * (the target has `pointer-events: none`, or is covered by its own ancestor's
 * box) the hit is returned as-is and `describeInterceptor` flags it
 * `ancestorHit`, which the controller does not escalate: there is no overlay
 * to close.
 */
export function detectInterceptorRoot(element, { rootSelector }) {
  if (!(element instanceof Element)) return null;
  const parentOf = (node) =>
    node.parentElement || (node.parentNode instanceof ShadowRoot ? node.parentNode.host : null);
  const reaches = (from, to) => {
    for (let cursor = from; cursor; cursor = parentOf(cursor)) {
      if (cursor === to) return true;
    }
    return false;
  };
  const rect = element.getBoundingClientRect();
  if (!(rect.width > 0) || !(rect.height > 0)) return null;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const x = Math.min(Math.max(rect.left + rect.width / 2, 0), Math.max(viewportWidth - 1, 0));
  const y = Math.min(Math.max(rect.top + rect.height / 2, 0), Math.max(viewportHeight - 1, 0));
  const scope = element.getRootNode();
  const hit = (scope instanceof ShadowRoot ? scope : document).elementFromPoint(x, y);
  if (!hit || hit === element || reaches(hit, element)) return null;
  if (reaches(element, hit)) return hit;
  const isPositioned = (node) => {
    const position = window.getComputedStyle(node).position;
    return position === "fixed" || position === "absolute" || position === "sticky";
  };
  let semantic = null;
  let outermostPositioned = null;
  for (let cursor = hit; cursor && !reaches(element, cursor); cursor = parentOf(cursor)) {
    if (!semantic && cursor.matches(rootSelector)) semantic = cursor;
    if (isPositioned(cursor)) outermostPositioned = cursor;
  }
  return outermostPositioned || semantic || hit;
}

/** JSON description of an interceptor root, for the status record. */
export function describeInterceptor(root, { target, rootSelector }) {
  const parentOf = (node) =>
    node.parentElement || (node.parentNode instanceof ShadowRoot ? node.parentNode.host : null);
  const reaches = (from, to) => {
    for (let cursor = from; cursor; cursor = parentOf(cursor)) {
      if (cursor === to) return true;
    }
    return false;
  };
  const rect = root.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const tag = root.tagName.toLowerCase();
  const id = root.id || "";
  const className = String(root.getAttribute("class") || "").replace(/\s+/g, " ").trim().slice(0, 80);
  let isModal = false;
  try {
    isModal = root.matches(":modal");
  } catch {
    isModal = false;
  }
  const visibleWidth = Math.max(0, Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0));
  const visibleHeight = Math.max(0, Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0));
  const viewportArea = viewportWidth * viewportHeight;
  return {
    tag,
    id,
    className,
    role: root.getAttribute("role") || null,
    ariaModal: root.getAttribute("aria-modal") || null,
    isDialog: root instanceof HTMLDialogElement,
    isModal,
    hasDialogRole: root.matches(rootSelector) || Boolean(root.querySelector(rootSelector)),
    position: window.getComputedStyle(root).position,
    coverage: viewportArea > 0 ? Number(((visibleWidth * visibleHeight) / viewportArea).toFixed(3)) : 0,
    coversViewport:
      rect.left <= 0 && rect.top <= 0 && rect.right >= viewportWidth && rect.bottom >= viewportHeight,
    ancestorHit: target instanceof Element && reaches(target, root),
    signature: `${tag}#${id}.${className}`,
  };
}

/** Close every open `<dialog>` through the DOM API; returns how many. */
export function closeOpenDialogs() {
  let closed = 0;
  for (const dialog of document.querySelectorAll("dialog[open]")) {
    try {
      dialog.close();
      closed += 1;
    } catch {
      // A dialog whose close throws is left to the next step.
    }
  }
  return closed;
}

/**
 * The first visible CLOSE control inside `root`, or `null`.
 *
 * Structural exclusions, checked on the control the click would reach (the
 * candidate's closest interactive ancestor-or-self):
 *   (i)   a real link -- an `<a href>` whose href is not empty, a fragment or
 *         `javascript:` -- and anything inside one;
 *   (ii)  a submit or reset control, any `<input>` that is not `type=button`,
 *         and a `<button>` inside a `<form>` without `type="button"` (the
 *         default type submits);
 *   (iii) a name in which any word window is a consent CHOICE -- checked
 *         BEFORE the close match, so "Accept" with `class="close"` is never a
 *         close control, whatever its class says.
 * Then a match: the accessible name (`aria-label` → `title` → `innerText`)
 * matches the close pattern, or the name is empty / a single glyph and the
 * class or id spells close.
 */
export function findCloseControlIn(root, { closePattern, consentPattern, closeClassPattern }) {
  if (!(root instanceof Element)) return null;
  const CLOSE = new RegExp(closePattern.source, closePattern.flags);
  const CONSENT = new RegExp(consentPattern.source, consentPattern.flags);
  const CLOSE_CLASS = new RegExp(closeClassPattern.source, closeClassPattern.flags);
  const normalize = (text) => String(text || "").replace(/\s+/g, " ").trim();
  const nameOf = (node) =>
    normalize(node.getAttribute("aria-label") || node.getAttribute("title") || node.innerText || "");
  // Every name a control carries, not only the one assistive technology
  // reads first: a button labelled "Close" for a screen reader that says
  // "Accept all" on screen is a choice.
  const namesOf = (node) =>
    [node.getAttribute("aria-label"), node.getAttribute("title"), node.innerText].map(normalize).filter(Boolean);
  const isVisible = (node) => {
    const style = window.getComputedStyle(node);
    const rect = node.getBoundingClientRect();
    return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
  };
  const isRealLink = (node) => {
    if (!node || node.tagName !== "A" || !node.hasAttribute("href")) return false;
    const href = String(node.getAttribute("href") || "").trim();
    return !(href === "" || href.startsWith("#") || /^javascript:/i.test(href));
  };
  const isSubmitLike = (node) => {
    const type = String(node.getAttribute("type") || "").toLowerCase();
    if (type === "submit" || type === "reset") return true;
    if (node.tagName === "INPUT") return type !== "button";
    if (node.tagName === "BUTTON" && node.closest("form") && type !== "button") return true;
    return false;
  };
  // The longest window worth asking about. `CONSENT_CHOICE_PATTERN` is
  // anchored `^...$` and no one of its alternatives contains more than two
  // `\s+` groups (`accept(?:\s+all)?(?:\s+cookies)?` and its `allow` twin),
  // so it can never match more than three space-separated words -- and the
  // names reaching here are whitespace-normalised, so a k-word window is
  // exactly k-1 spaces. Bounding the inner loop therefore removes only
  // questions whose answer is fixed at `false`, and it is what keeps this
  // scan linear: `name` can be a whole overlay region's `innerText`, this
  // runs once per candidate, and `evaluateHandle` puts no timeout on it.
  // Measured on the unbounded form: 2.7 s at 1000 words, 21 s at 2000.
  const CONSENT_MAX_WORDS = 3;
  const isConsentChoice = (name) => {
    const words = name.split(" ").filter(Boolean);
    for (let start = 0; start < words.length; start += 1) {
      const last = Math.min(words.length, start + CONSENT_MAX_WORDS);
      for (let end = start + 1; end <= last; end += 1) {
        if (CONSENT.test(words.slice(start, end).join(" "))) return true;
      }
    }
    return false;
  };
  const candidates = root.querySelectorAll(
    "button, [role='button'], a, input, [aria-label], [class*='close' i], [class*='dismiss' i], [id*='close' i]",
  );
  for (const node of candidates) {
    if (!(node instanceof Element) || !isVisible(node)) continue;
    const control = node.closest("a, button, [role='button'], input") || node;
    if (isRealLink(control) || isRealLink(node.closest("a[href]"))) continue;
    if (isSubmitLike(control) || (control !== node && isSubmitLike(node))) continue;
    const name = nameOf(node);
    const controlName = control === node ? name : nameOf(control);
    if ([...namesOf(node), ...namesOf(control)].some(isConsentChoice)) continue;
    if (CLOSE.test(name) || CLOSE.test(controlName)) return control;
    // The class rule stands in only for a control that has NO spoken name: a
    // control's own accessible name is authoritative, and a decorative
    // descendant's class cannot overrule it. Measured live: a sticky header's
    // menu toggle named "Menu" carries an `icon-close` glyph (the hamburger
    // that turns into a cross), and clicking it OPENS the menu.
    const classAndId = `${node.getAttribute("class") || ""} ${node.id || ""}`;
    const glyphOrEmpty = [...name].length <= 1 && [...controlName].length <= 1;
    if (glyphOrEmpty && CLOSE_CLASS.test(classAndId)) return control;
  }
  return null;
}

/** JSON description of a close control, for the status record. */
export function describeControl(node) {
  const normalize = (text) => String(text || "").replace(/\s+/g, " ").trim();
  return {
    tag: node.tagName.toLowerCase(),
    name: normalize(node.getAttribute("aria-label") || node.getAttribute("title") || node.innerText || "").slice(0, 80),
    className: String(node.getAttribute("class") || "").replace(/\s+/g, " ").trim().slice(0, 80),
  };
}

/**
 * A point on a MASK, or `null`.
 *
 * A mask is an element that covers the whole viewport (that is what blocks
 * interaction with the page beneath; a strip or a box does not) and is not
 * content (`NEVER_A_MASK_SELECTOR`) nor inside a link, form or button. The
 * point is a corner of its box, inset by `inset`, at which `elementFromPoint`
 * returns the mask ITSELF -- not the box it frames, not a control.
 */
export function maskPointFor(root, { inset, neverMaskSelector }) {
  if (!(root instanceof Element)) return null;
  if (root.matches(neverMaskSelector) || root.closest("a[href], form, button, [role='button']")) return null;
  const rect = root.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const coversViewport =
    rect.left <= 0 && rect.top <= 0 && rect.right >= viewportWidth && rect.bottom >= viewportHeight;
  if (!coversViewport) return null;
  const corners = [
    [rect.left + inset, rect.top + inset],
    [rect.right - inset, rect.top + inset],
    [rect.left + inset, rect.bottom - inset],
    [rect.right - inset, rect.bottom - inset],
  ];
  for (const [x, y] of corners) {
    if (x < 0 || y < 0 || x >= viewportWidth || y >= viewportHeight) continue;
    if (document.elementFromPoint(x, y) === root) return { x, y };
  }
  return null;
}

/**
 * The in-page half of the navigation guard. `beforeunload` with
 * `preventDefault` makes a navigation ask first -- and the controller's
 * `dialog` listener answers no; the capturing `click` listener cancels every
 * default action (anchor navigation, form submission) while the page's own
 * handlers still run, because `preventDefault` does not stop propagation.
 */
export function installNavigationGuards() {
  if (window.__brandkitOverlayGuards) return false;
  const guards = {
    beforeunload: (event) => {
      event.preventDefault();
      event.returnValue = "";
    },
    click: (event) => {
      event.preventDefault();
    },
  };
  window.addEventListener("beforeunload", guards.beforeunload);
  window.addEventListener("click", guards.click, true);
  window.__brandkitOverlayGuards = guards;
  return true;
}

export function removeNavigationGuards() {
  const guards = window.__brandkitOverlayGuards;
  if (!guards) return false;
  window.removeEventListener("beforeunload", guards.beforeunload);
  window.removeEventListener("click", guards.click, true);
  delete window.__brandkitOverlayGuards;
  return true;
}

// ---------------------------------------------------------------------------
// Controller (Node side).
// ---------------------------------------------------------------------------

function withoutFragment(url) {
  return String(url || "").split("#")[0];
}

function publicInterceptor(info) {
  if (!info) return null;
  const { signature, ...rest } = info;
  return rest;
}

function errorText(error) {
  return String(error?.message || error).slice(0, 200);
}

/**
 * One controller per page. `settleMs` bounds a close animation between a step
 * and its re-detection (the decision is the re-detection, so its value cannot
 * flip an outcome); `clickTimeoutMs` bounds the close-control click and the
 * locator resolutions. lib.js passes its own hover constants for both.
 */
export function createOverlayController(page, { settleMs = 0, clickTimeoutMs = 2000 } = {}) {
  const attempts = [];
  const exhausted = new Set();
  const counts = { detected: 0, hoverIntercepted: 0, hoverRetried: 0 };
  const detectArgs = { rootSelector: OVERLAY_ROOT_SELECTOR };
  const closeArgs = {
    closePattern: patternArg(CLOSE_CONTROL_PATTERN),
    consentPattern: patternArg(CONSENT_CHOICE_PATTERN),
    closeClassPattern: patternArg(CLOSE_CLASS_PATTERN),
  };
  const maskArgs = { inset: MASK_PROBE_INSET_PX, neverMaskSelector: NEVER_A_MASK_SELECTOR };

  const dispose = (handle) => handle?.dispose?.().catch(() => {});
  const settle = () => (settleMs > 0 ? page.waitForTimeout(settleMs).catch(() => {}) : Promise.resolve());

  // A Locator and an ElementHandle both expose `evaluateHandle` and
  // `scrollIntoViewIfNeeded`; only a Locator needs resolving to a handle
  // before it can travel as an evaluate argument.
  const isElementHandle = (handle) => typeof handle?.asElement === "function";
  const resolveTarget = async (handle) =>
    isElementHandle(handle) ? handle : handle.elementHandle({ timeout: clickTimeoutMs });

  // Playwright's hover scrolls the target into view before its hit test; the
  // same scroll here asks the same question of the same point.
  async function detect(handle) {
    await handle.scrollIntoViewIfNeeded({ timeout: clickTimeoutMs }).catch(() => {});
    const rootJs = await handle.evaluateHandle(detectInterceptorRoot, detectArgs, { timeout: clickTimeoutMs });
    const rootHandle = rootJs.asElement();
    if (!rootHandle) {
      await dispose(rootJs);
      return null;
    }
    let target = null;
    try {
      target = await resolveTarget(handle);
      const info = await rootHandle.evaluate(describeInterceptor, { target, rootSelector: OVERLAY_ROOT_SELECTOR });
      return { rootHandle, info };
    } catch (error) {
      await dispose(rootHandle);
      throw error;
    } finally {
      if (target && target !== handle) await dispose(target);
    }
  }

  async function dismiss(detected, handle, { namedByPlaywright = null } = {}) {
    const { rootHandle, info } = detected;
    const attempt = {
      interceptor: publicInterceptor(info),
      ...(namedByPlaywright ? { namedByPlaywright } : {}),
      steps: [],
      dismissed: false,
      navigated: false,
    };
    attempts.push(attempt);
    exhausted.add(info.signature);
    let remaining = null;
    if (info.ancestorHit) {
      // The hit is an ANCESTOR of the target: the target itself is not
      // hit-testable (pointer-events: none, or its own ancestor's box). There
      // is no overlay to close, so nothing is tried and nothing is retried.
      attempt.reason = "ancestor-hit";
      await dispose(rootHandle);
      return { attempt, remaining };
    }
    const urlBefore = withoutFragment(page.url());
    const onDialog = (dialog) => dialog.dismiss().catch(() => {});
    page.on("dialog", onDialog);
    let guardsInstalled = false;
    let currentRoot = rootHandle;
    // After a step: the URL check (a navigation ends the attempt and is undone),
    // then the re-detection against the SAME target. "dismissed" means this
    // interceptor is gone; a DIFFERENT one now covering the target is left to
    // the caller, which starts its own attempt.
    const check = async (step, extra = {}) => {
      if (withoutFragment(page.url()) !== urlBefore) {
        attempt.navigated = true;
        attempt.steps.push({ step, ...extra, outcome: "navigated" });
        await page.goBack({ waitUntil: "domcontentloaded" }).catch(() => {});
        return "stop";
      }
      const next = await detect(handle);
      if (!next) {
        attempt.steps.push({ step, ...extra, outcome: "dismissed" });
        attempt.dismissed = true;
        return "stop";
      }
      if (next.info.signature !== info.signature) {
        attempt.steps.push({ step, ...extra, outcome: "dismissed", nowIntercepting: publicInterceptor(next.info) });
        attempt.dismissed = true;
        remaining = next;
        return "stop";
      }
      attempt.steps.push({ step, ...extra, outcome: "still-intercepting" });
      await dispose(currentRoot);
      currentRoot = next.rootHandle;
      return "continue";
    };
    try {
      guardsInstalled = await page.evaluate(installNavigationGuards);
      // 1. Escape: the modal dialog's `cancel` event and the universal handler.
      await page.keyboard.press("Escape");
      await settle();
      if ((await check("escape")) === "stop") return { attempt, remaining };
      // 2. The DOM API, for a dialog whose `cancel` handler swallowed Escape.
      const closed = await page.evaluate(closeOpenDialogs);
      if (closed > 0) {
        await settle();
        if ((await check("dialog-close", { closed })) === "stop") return { attempt, remaining };
      }
      // 3. A close control, found by its accessible name inside the root.
      const controlJs = await currentRoot.evaluateHandle(findCloseControlIn, closeArgs);
      const control = controlJs.asElement();
      if (control) {
        const description = await control.evaluate(describeControl);
        let clickError = null;
        try {
          await control.click({ timeout: clickTimeoutMs });
        } catch (error) {
          clickError = errorText(error);
        }
        await dispose(control);
        await settle();
        const extra = { control: description, ...(clickError ? { clickError } : {}) };
        if ((await check("close-control", extra)) === "stop") return { attempt, remaining };
      } else {
        await dispose(controlJs);
      }
      // 4. The mask itself.
      const point = await currentRoot.evaluate(maskPointFor, maskArgs).catch(() => null);
      if (point) {
        await page.mouse.click(point.x, point.y);
        await settle();
        if ((await check("backdrop", { point })) === "stop") return { attempt, remaining };
      }
      return { attempt, remaining };
    } catch (error) {
      attempt.error = errorText(error);
      return { attempt, remaining };
    } finally {
      if (guardsInstalled) await page.evaluate(removeNavigationGuards).catch(() => {});
      page.off("dialog", onDialog);
      await dispose(currentRoot);
    }
  }

  // Escalate against whatever covers `handle` until nothing does or every
  // interceptor seen has had its one attempt.
  async function clear(handle, options = {}) {
    let detected = await detect(handle);
    if (!detected) return { detected: null, dismissed: false };
    counts.detected += 1;
    let dismissedAny = false;
    while (detected) {
      if (exhausted.has(detected.info.signature)) {
        const info = detected.info;
        await dispose(detected.rootHandle);
        return { detected: publicInterceptor(info), dismissed: dismissedAny, exhausted: true };
      }
      const { attempt, remaining } = await dismiss(detected, handle, options);
      if (attempt.dismissed) dismissedAny = true;
      detected = remaining;
    }
    return { detected: null, dismissed: dismissedAny };
  }

  return {
    /** Proactive: before a hover. One evaluate when nothing intercepts. */
    async clearFor(handle) {
      try {
        return await clear(handle);
      } catch (error) {
        attempts.push({ interceptor: null, steps: [], dismissed: false, navigated: false, error: errorText(error) });
        return { detected: null, dismissed: false, error: errorText(error) };
      }
    },
    /**
     * Reactive: after Playwright refused a hover naming `namedByPlaywright`.
     * The name is a record only -- the interceptor is re-detected against the
     * target. `retryable` says whether one retry of the hover is worth its
     * cost: after a dismissal, or when nothing covers the target any more.
     * A name is attempted once, so a page that keeps refusing never pays a
     * second timeout per row.
     */
    async dismissNamed(namedByPlaywright, handle) {
      const key = `playwright:${String(namedByPlaywright || "")}`;
      if (exhausted.has(key)) return { dismissed: false, retryable: false, exhausted: true };
      exhausted.add(key);
      try {
        const detected = await detect(handle);
        if (!detected) {
          attempts.push({
            interceptor: null,
            namedByPlaywright,
            steps: [{ step: "re-detect", outcome: "gone" }],
            dismissed: false,
            navigated: false,
          });
          return { dismissed: false, retryable: true };
        }
        counts.detected += 1;
        let dismissedAny = false;
        let current = detected;
        while (current) {
          if (exhausted.has(current.info.signature)) {
            await dispose(current.rootHandle);
            return { dismissed: dismissedAny, retryable: dismissedAny, exhausted: true };
          }
          const { attempt, remaining } = await dismiss(current, handle, { namedByPlaywright });
          if (attempt.dismissed) dismissedAny = true;
          current = remaining;
        }
        return { dismissed: dismissedAny, retryable: dismissedAny };
      } catch (error) {
        attempts.push({
          interceptor: null,
          namedByPlaywright,
          steps: [],
          dismissed: false,
          navigated: false,
          error: errorText(error),
        });
        return { dismissed: false, retryable: false, error: errorText(error) };
      }
    },
    exhausted(signature) {
      return exhausted.has(signature) || exhausted.has(`playwright:${String(signature || "")}`);
    },
    noteIntercepted() {
      counts.hoverIntercepted += 1;
    },
    noteRetried() {
      counts.hoverRetried += 1;
    },
    summary() {
      return {
        detected: counts.detected,
        dismissed: attempts.filter((attempt) => attempt.dismissed).length,
        stillIntercepting: attempts.filter((attempt) => !attempt.dismissed && attempt.interceptor).length,
        hoverIntercepted: counts.hoverIntercepted,
        hoverRetried: counts.hoverRetried,
        attempts: attempts.map((attempt) => ({ ...attempt, steps: attempt.steps.map((step) => ({ ...step })) })),
      };
    },
  };
}

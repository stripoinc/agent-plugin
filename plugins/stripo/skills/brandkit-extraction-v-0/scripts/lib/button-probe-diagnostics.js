// Per-row instrumentation for `collectButtonStyles` (lib.js).
//
// WHY THIS EXISTS — `buttonStyles` is 62% of the homepage browser pass
// (10-86 s of a 40-134 s pass, measured over nine production runs), but
// nothing in the artifacts says WHERE that time goes or WHY a hover produced
// `hover: null`. Three competing explanations were live at the same time:
//
//   1. the 800 ms transition settle after every successful pointer hover;
//   2. failed `hover()` calls burning their full 2 000 ms actionability
//      timeout (two of the nine sites failed 18/20 and 19/20 hovers);
//   3. phase 1's two remote round trips per matched row (313 matched rows on
//      one site).
//
// None of the three can be told apart from `button-styles.json`, whose rows
// only carry the captured value. This module holds the measurement so the
// optimisation that follows is chosen from data rather than from a guess:
// it records, per emitted row, which hover path ran (CSSOM read vs pointer
// hover), how long each stage took, how a failed hover failed, and — for the
// deferred "skip the settle" idea — the hover value read IMMEDIATELY after
// `hover()` resolved (`preSettle`) alongside the value actually captured
// after the settle (`postSettle`). If those two never differ across a fleet
// canary, the settle is dead weight; if they do, the settle is load-bearing
// and the idea is dead. Either way it is answered by counting, not arguing.
//
// OUTPUT-IDENTICAL BY CONSTRUCTION. Nothing here is read by the assembler:
// the recorder is a passive sink, `collectButtonStyles` returns exactly the
// rows it returned before, and the sidecar
// (`button-styles.diagnostics.json`) is deliberately absent from the
// homepage pass's required and optional artifact lists so a degraded or
// missing sidecar can never flip `readyForAssembly` and send the agent into
// a rerun loop.
//
// Everything in this file is a pure function of its inputs (no browser, no
// filesystem), so the totals and the Playwright-error classification are unit
// testable without launching Chromium.

export const BUTTON_PROBE_DIAGNOSTICS_VERSION = 1;

// The per-row field set, in emission order. Spelled once so a row that
// reaches the sidecar can never carry a field the contract does not name, and
// so every row has the same shape whether or not the stage that fills a field
// ran at all.
const ROW_FIELDS = [
  "selector",
  "matchIndex",
  "elementKey",
  "phase1Ms",
  "hoverPath",
  "cssomNull",
  "hoverOutcome",
  "hoverMs",
  "settleEnd",
  "settleMs",
  "errorClass",
  "interceptor",
  "preSettle",
  "postSettle",
  // True when the row's pointer hover was refused by an overlay, the overlay
  // was dismissed (lib/overlay-dismissal.js) and the hover ran once more. The
  // row keeps its first failure's `errorClass` / `interceptor` beside the
  // retried outcome, so "intercepted, dismissed, then captured" stays legible.
  "hoverRetried",
];

// Longest error text kept per row. The Playwright message carries a full call
// log (hundreds of characters, including the resolved element's markup); the
// classification below is the useful part and the raw tail is noise in an
// artifact that is read by a human tabulating a canary.
const ERROR_CLASS_MAX_CHARS = 120;

// Ordered phrase table for `errorClass`. FIRST match wins, so the more
// specific cause is reported when Playwright's call log mentions several
// (a timeout message routinely contains both "waiting for element to be
// visible, enabled and stable" and the actual blocker). The strings are
// Playwright's own wording, kept verbatim so a reader can grep the upstream
// source for them.
const ERROR_CLASS_PHRASES = [
  "intercepts pointer events",
  "not attached to the DOM",
  "outside of the viewport",
  "not stable",
  "not visible",
  "not enabled",
];

// Playwright reports an actionability timeout as `Timeout <n>ms exceeded`.
// Anything else that throws out of `hover()` (a closed page, a detached
// frame, a protocol error) is a different failure and must not be counted as
// a timeout — the whole point of the split is to size the "failed hovers burn
// their full timeout" hypothesis.
const TIMEOUT_RE = /Timeout\s+\d+\s*ms\s+exceeded/i;

// The element Playwright names as the pointer-event blocker, e.g.
//   <div class="consent">…</div> from <body>…</body> subtree intercepts pointer events
// The LAST such line is used: Playwright retries the action and logs one line
// per attempt, and the final attempt is the state the timeout was declared on.
const INTERCEPTOR_RE = /(<[a-zA-Z][^>\n]*>)[^\n]*?intercepts pointer events/g;

function messageOf(error) {
  if (error == null) return "";
  if (typeof error === "string") return error;
  if (typeof error.message === "string") return error.message;
  return String(error);
}

function firstNonEmptyLine(text) {
  for (const line of String(text).split("\n")) {
    const trimmed = line.trim();
    if (trimmed) return trimmed;
  }
  return "";
}

/**
 * Classify a throw from `locator.hover()`.
 *
 * Returns `{ outcome, errorClass, interceptor }` where `outcome` is
 * `"timeout"` or `"error"`, `errorClass` is the recognised cause phrase (or,
 * when none is recognised, the message's first line truncated to
 * ERROR_CLASS_MAX_CHARS so an unknown failure is still legible), and
 * `interceptor` is the opening tag of the element Playwright blamed for
 * swallowing the pointer, or null.
 */
export function classifyHoverError(error) {
  const message = messageOf(error);
  const outcome = TIMEOUT_RE.test(message) ? "timeout" : "error";

  let errorClass = null;
  for (const phrase of ERROR_CLASS_PHRASES) {
    if (message.includes(phrase)) {
      errorClass = phrase;
      break;
    }
  }
  if (errorClass === null) {
    errorClass = firstNonEmptyLine(message).slice(0, ERROR_CLASS_MAX_CHARS) || null;
  }

  let interceptor = null;
  INTERCEPTOR_RE.lastIndex = 0;
  let match = INTERCEPTOR_RE.exec(message);
  while (match) {
    interceptor = match[1].slice(0, ERROR_CLASS_MAX_CHARS);
    match = INTERCEPTOR_RE.exec(message);
  }

  return { outcome, errorClass, interceptor };
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function numberOrNull(value) {
  return isFiniteNumber(value) ? value : null;
}

// The four fields a hover record carries. Compared field-by-field rather than
// by JSON.stringify so key order can never make two equal reads look
// different (`preSettleDiffersCount` is the deferred settle-skip decision;
// a spurious difference would keep a dead optimisation alive).
const HOVER_RECORD_FIELDS = ["backgroundColor", "fontColor", "borderColor", "borderWidth"];

export function hoverRecordsDiffer(left, right) {
  if (!left || !right) return false;
  return HOVER_RECORD_FIELDS.some((field) => (left[field] ?? null) !== (right[field] ?? null));
}

function normalizeHoverRecord(record) {
  if (!record || typeof record !== "object") return null;
  const normalized = {};
  for (const field of HOVER_RECORD_FIELDS) {
    normalized[field] = record[field] === undefined ? null : record[field];
  }
  return normalized;
}

function normalizeRow(row) {
  const source = row && typeof row === "object" ? row : {};
  const normalized = {};
  for (const field of ROW_FIELDS) {
    normalized[field] = source[field] === undefined ? null : source[field];
  }
  normalized.matchIndex = numberOrNull(source.matchIndex);
  normalized.phase1Ms = numberOrNull(source.phase1Ms);
  normalized.hoverMs = numberOrNull(source.hoverMs);
  normalized.settleMs = numberOrNull(source.settleMs);
  normalized.preSettle = normalizeHoverRecord(source.preSettle);
  normalized.postSettle = normalizeHoverRecord(source.postSettle);
  return normalized;
}

/**
 * Totals over already-normalised rows. Pure, so the counting rules are
 * testable without a browser.
 *
 * `redundantRowsInBudget` and the hover counters are scoped to the rows that
 * were actually inside the hover budget — a row past the budget was never
 * hovered, so counting it would understate how much of the budget is spent
 * re-hovering elements the probe has already seen.
 */
export function summarizeButtonProbeRows(rows, { phase1Ms = null, phase2Ms = null } = {}) {
  const list = Array.isArray(rows) ? rows : [];
  const budgetRows = list.filter((row) => row.hoverOutcome !== "skipped-budget");

  const distinctKeys = new Set();
  let unkeyedRows = 0;
  for (const row of list) {
    if (row.elementKey === null || row.elementKey === undefined) unkeyedRows += 1;
    else distinctKeys.add(row.elementKey);
  }

  const seenInBudget = new Set();
  let redundantRowsInBudget = 0;
  for (const row of budgetRows) {
    if (row.elementKey === null || row.elementKey === undefined) continue;
    if (seenInBudget.has(row.elementKey)) redundantRowsInBudget += 1;
    else seenInBudget.add(row.elementKey);
  }

  return {
    rows: list.length,
    // A row whose element could not be keyed counts as its own element: it is
    // never a proven duplicate of anything.
    distinctElements: distinctKeys.size + unkeyedRows,
    redundantRowsInBudget,
    hoverAttempts: budgetRows.filter((row) => row.hoverPath === "pointer").length,
    hoverTimeouts: budgetRows.filter((row) => row.hoverOutcome === "timeout").length,
    cssomNullCount: budgetRows.filter((row) => row.cssomNull === true).length,
    phase1Ms: numberOrNull(phase1Ms),
    phase2Ms: numberOrNull(phase2Ms),
    settleTimeoutCount: budgetRows.filter((row) => row.settleEnd === "timeout").length,
    preSettleDiffersCount: budgetRows.filter((row) => hoverRecordsDiffer(row.preSettle, row.postSettle))
      .length,
    // Rows whose pointer hover was refused by an element covering the target
    // (the overlay class), and how many of those were retried after a
    // dismissal. Counts, not a threshold: the status file records them beside
    // `buttonProbeDegraded`, which keeps its meaning (the probe THREW).
    hoverIntercepted: budgetRows.filter((row) => row.errorClass === "intercepts pointer events").length,
    hoverRetried: budgetRows.filter((row) => row.hoverRetried === true).length,
  };
}

/**
 * A passive sink handed to `collectButtonStyles(page, selectors, {
 * diagnostics })`. Absent it, the collector runs exactly as before and takes
 * no extra reads.
 */
export function createButtonProbeDiagnostics() {
  const rows = [];
  let phase1Ms = null;
  let phase2Ms = null;

  return {
    recordRow(row) {
      rows.push(normalizeRow(row));
    },
    setPhaseTimings(timings) {
      if (timings && isFiniteNumber(timings.phase1Ms)) phase1Ms = timings.phase1Ms;
      if (timings && isFiniteNumber(timings.phase2Ms)) phase2Ms = timings.phase2Ms;
    },
    totals() {
      return {
        ...summarizeButtonProbeRows(rows, { phase1Ms, phase2Ms }),
      };
    },
    toJSON() {
      return {
        version: BUTTON_PROBE_DIAGNOSTICS_VERSION,
        totals: this.totals(),
        rows: rows.map((row) => ({ ...row })),
      };
    },
    // Mirrors the shape of the collector's existing
    // `below_min_tap_target_dropped` line so an operator can grep one stream
    // for both probe events.
    stderrEvent() {
      return {
        level: "info",
        event: "collectButtonStyles.diagnostics",
        ...this.totals(),
      };
    },
    writeStderrEvent(stream = process.stderr) {
      stream.write(`${JSON.stringify(this.stderrEvent())}\n`);
    },
  };
}

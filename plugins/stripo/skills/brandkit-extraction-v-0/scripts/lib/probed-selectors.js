// What did the probe actually LOOK FOR?
//
// `text-styles.json` records what MATCHED. It cannot, on its own, tell
// "the page has no <h2>" from "nobody asked about <h2>", and the two must
// not be graded the same way: the first is an honest gap, the second is a
// narrowed capture that would mint a false one and, worse, silently
// downgrade a real producer fault to a gap.
//
// The distinction matters because a re-probe OVERWRITES the artifact. The
// skill's own recovery path reruns `text-styles.js` onto the same path, so
// a selector list that drops a family deletes the evidence the gate grades
// against. Sites with no `<h1>` but plenty of `<h2>` are common — a
// storefront in our own corpus is one — so this is not a corner case.
//
// The sidecar records the selector list each probe ran with. A capture
// written before this existed has no sidecar, and the grader treats that
// as "cannot prove the family was probed", which keeps the pre-change
// behaviour (fatal) rather than inventing a gap from an unknown.

import path from "node:path";

import { normalizeSelectorList } from "../lib.js";

export const PROBED_SELECTORS_BASENAME = "text-styles.probed.json";

export function probedSelectorsPathFor(textStylesPath) {
  if (typeof textStylesPath !== "string" || !textStylesPath) return "";
  return path.join(path.dirname(textStylesPath), PROBED_SELECTORS_BASENAME);
}

// Shares `collectTextStyles`'s normaliser, so the recorded list cannot drift
// from the probed one through a second hand-rolled cleaner. One residual
// difference is deliberate: the record DEDUPES and the probe does not, so a
// list naming a selector twice probes it twice and is recorded once. Every
// consumer is set-like (`roleWasProbed` builds a Set), so that is a shape
// choice, not a provenance claim.
export function buildProbedSelectorsRecord(selectors) {
  return { selectors: [...new Set(normalizeSelectorList(selectors))] };
}

// Accepts the parsed sidecar and returns the probed selector list, or null
// when there is no usable record. `null` means "unknown", never "none".
export function readProbedSelectors(record) {
  if (!record || typeof record !== "object") return null;
  if (!Array.isArray(record.selectors)) return null;
  const cleaned = normalizeSelectorList(record.selectors);
  return cleaned.length ? cleaned : null;
}

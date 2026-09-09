// WHICH COLOUR WILL THIS PAGE'S RUNNING TEXT BE PAINTED ON?
//
// One answer, in one place, for the two lanes that must not disagree about it:
// the normalize pass (which hands it to `synthesizeTextColorRoles`, deciding
// what gets published) and the finalize-time re-check in
// `role-coverage-recheck.js` (which re-runs the coverage gate over the artifact
// on disk). If those two resolved the canvas differently, the re-check would
// grade a role the pass produced — or the gap the pass recorded — against a
// different surface, and the two would report different facts about one run.
//
// TWO SOURCES, IN THIS ORDER, AND THE ORDER IS THE POINT:
//   1. the kit's own `canvas-background` hint. It is what the DOWNSTREAM
//      builders read, so it is the surface the text will actually be painted
//      on. It is also what an agent may have corrected against the screenshot.
//   2. the canvas ranker's top candidate. 4 of 44 stored kits carry no
//      `canvas-background` at all (a black `(unspecified)` surface ties the
//      `body` weight and the pre-emit floor is not reached), and on every one
//      of them the ranker's top candidate is the correct page colour. Falling
//      back to it is what keeps the gate from silently switching itself off on
//      exactly those runs.
// `null` — no hint, no ranked candidate, an unusable value — means the caller
// cannot name the surface, and every consumer of this answer treats that as
// "no claim" rather than as white. 50 captured runs carry a dark canvas; a
// hardcoded `#ffffff` would call their light body copy illegible.

import { pickCanvasCandidate, rankCanvasBackgroundCandidates } from "../assemble-candidates.js";
import { normalizeHexForCompare } from "./header-link-strip.js";

export const CANVAS_BACKGROUND_HINT = "canvas-background";

function usableHex(value) {
  const hex = normalizeHexForCompare(value);
  return /^#[0-9a-f]{6}$/.test(hex) ? hex : null;
}

export function resolveTextRoleCanvasHex(payload, backgroundStyles) {
  const rows = payload?.brand?.colors?.backgroundColors;
  for (const row of Array.isArray(rows) ? rows : []) {
    if (!row || typeof row !== "object") continue;
    const hints = Array.isArray(row.usageHints) ? row.usageHints : [];
    if (!hints.includes(CANVAS_BACKGROUND_HINT)) continue;
    const hex = usableHex(row.value);
    // First row carrying the hint wins, which is what every downstream
    // consumer of a colour hint does. A malformed value on it falls through to
    // the ranker rather than ending the search: the hint is a claim about which
    // surface, not a veto on knowing one.
    if (hex) return hex;
  }
  // FIX-93: the same pick as the F1 gate (page-anchored bucket first), read
  // off the ranked list so "no ranked candidate" stays `null`, never white.
  const ranked = rankCanvasBackgroundCandidates(
    Array.isArray(backgroundStyles) ? backgroundStyles : [],
  );
  return usableHex(pickCanvasCandidate(ranked)?.value);
}

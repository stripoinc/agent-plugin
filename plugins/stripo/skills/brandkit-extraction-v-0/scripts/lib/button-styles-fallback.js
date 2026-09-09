// Tier-H Fix 1 — button-styles.json fallback resolver.
//
// Failure mode this closes: `homepage-pass.js` runs the packaged button
// probe under a hard timeout. When the probe hits the timeout it writes
// `button-styles.json = []` and sets `homepage-pass-status.json
// .buttonProbeDegraded = true`. The codex agent has a recovery branch
// that runs a focused button probe (narrower selector list, shorter
// budget) and writes `button-styles.focused.json`. That file can carry
// hundreds of rows — but the orchestrator only reads
// `button-styles.json`. Result: the focused probe's evidence is wasted,
// the scaffold's `brand.components.button[]` ranker has nothing to
// work with, and the agent has to manually re-author button colours
// from scratch.
//
// Fix: when the primary array is empty AND the homepage probe was
// flagged degraded AND the focused file carries rows, route the
// focused rows in as if they were the primary input. Emit a single
// severity:"info" diagnostic so the trail is greppable.
//
// Conservative posture: when the primary array is non-empty, the
// focused file is IGNORED — the primary probe produced its own
// evidence, the focused file is stale-by-definition (an earlier batch
// left it on disk after the current batch's primary probe succeeded).
// When the primary is empty but the probe was NOT flagged degraded,
// the focused file is also IGNORED — empty primary without the
// degraded flag means the probe genuinely found no button-styled
// elements (a brand whose homepage really has no CTA buttons), and
// the focused fallback would re-introduce probe noise the primary
// correctly excluded.
//
// Freshness gate (BACKLOG item 16): when the caller supplies both
// `rawMtimeMs` and `focusedMtimeMs` (file mtimes in milliseconds since
// epoch) and the focused file is OLDER than the raw file, the focused
// fallback is ignored — even if the gate above would normally fire.
// Defends against the case where an earlier batch left a populated
// `button-styles.focused.json` on disk and the current batch's raw
// probe fails for unrelated reasons; without the gate, the stale
// focused rows would feed the ranker.
//
// When either mtime is missing (default), behaviour is preserved —
// the caller can opt into the gate by passing both values.

export function resolveEffectiveButtonStyles(rawRows, focusedRows, homepageStatus, diagnostics = [], mtimes = null) {
  const rawCount = Array.isArray(rawRows) ? rawRows.length : 0;
  const focusedCount = Array.isArray(focusedRows) ? focusedRows.length : 0;
  const degraded = Boolean(homepageStatus?.buttonProbeDegraded);
  if (rawCount > 0) return rawRows;
  if (degraded && focusedCount > 0) {
    // BACKLOG item 16: freshness gate. Both mtimes must be present AND
    // the focused file must NOT be older than the raw file. A tie
    // (mtimes equal) keeps the fallback enabled — only a strictly
    // earlier focused mtime is treated as stale.
    const rawMtimeMs = Number(mtimes?.rawMtimeMs);
    const focusedMtimeMs = Number(mtimes?.focusedMtimeMs);
    const bothMtimesPresent = Number.isFinite(rawMtimeMs) && Number.isFinite(focusedMtimeMs);
    if (bothMtimesPresent && focusedMtimeMs < rawMtimeMs) {
      if (Array.isArray(diagnostics)) {
        diagnostics.push({
          severity: "info",
          path: "$.brand.components.button",
          message: `Skipped button-styles.focused.json fallback: focused mtime (${new Date(focusedMtimeMs).toISOString()}) is older than raw mtime (${new Date(rawMtimeMs).toISOString()}); a previous batch likely left a stale focused.json on disk. Returning rawRows as-is.`,
        });
      }
      return Array.isArray(rawRows) ? rawRows : [];
    }
    if (Array.isArray(diagnostics)) {
      diagnostics.push({
        severity: "info",
        path: "$.brand.components.button",
        message: `Primary button-styles.json is empty AND homepage-pass-status.buttonProbeDegraded=true; using button-styles.focused.json fallback (${focusedCount} rows) as input for the brand-primary ranker and scaffold component[].`,
      });
    }
    return focusedRows;
  }
  return Array.isArray(rawRows) ? rawRows : [];
}

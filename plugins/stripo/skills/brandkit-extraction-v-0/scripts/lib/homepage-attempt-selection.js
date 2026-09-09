export function initialFallbackStatus(blocker, browserbaseSession) {
  const eligible = blocker?.blocked === true
    && blocker?.confidence === "high"
    && blocker?.fallbackEligible === true;
  const available = browserbaseSession?.viaProxy === true
    && browserbaseSession?.proxiesEnabled !== true
    && browserbaseSession?.residentialFallbackAvailable === true;
  let outcome = "not_eligible";
  if (eligible && browserbaseSession?.proxiesEnabled === true) outcome = "already_proxied";
  else if (eligible && !available) outcome = "disabled";
  else if (eligible) outcome = "eligible";
  return {
    eligible,
    attempted: false,
    outcome,
    proxyCountry: null,
    initialBlocker: blocker?.blocked
      ? {
          type: blocker.type || "security_interstitial",
          provider: blocker.provider || "unknown",
          confidence: blocker.confidence || "medium",
        }
      : null,
  };
}

// `status: "blocked"` says the pass is holding a document that is not the
// page. `blockedBySecurityInterstitial` says WHY. While an anti-bot wall was
// the only way to be blocked these were one expression; a final main-frame
// document outside 2xx is a second way, and it is not a security interstitial.
//
// Nothing downstream loses the block by this split: `homepage_status_indicates_blocked`
// (Python), `homepageStatusIndicatesBlocked`, `isHomepageBlocked` and the
// review packet all accept `status === "blocked"` on its own. What the split
// buys is that the artifact stops asserting an anti-bot wall that did not
// happen -- which is what sends an operator to the residential-fallback
// runbook for what is actually a wrong URL.
//
// ABSENT IS NOT FALSE. A blocker object without the key keeps today's answer,
// so every existing caller reads exactly what it read before.
export function blockedBySecurityInterstitialClaim({ status = "", blockedPage = null } = {}) {
  const isBlocked = status === "blocked" || blockedPage?.blocked === true;
  return isBlocked && blockedPage?.securityInterstitial !== false;
}

export function shouldAttemptResidentialFallback(status) {
  return status?.eligible === true && status?.outcome === "eligible";
}

export function selectHomepageAttempt({ standardAttempt, fallbackAttempt = null }) {
  // Once the residential page opens, its evidence is authoritative even when
  // it remains blocked. Before that point the proven standard block is safer
  // than converting a release/mint/open failure into a generic failed run.
  return fallbackAttempt?.opened === true ? fallbackAttempt : standardAttempt;
}

export function captureForCanonicalArtifact(attempt, canonicalScreenshotPath) {
  return {
    ...attempt.capturePayload,
    screenshotPath: canonicalScreenshotPath,
  };
}

// Which browser handle the pass still owns, and therefore must close exactly
// once in its outer `finally`.
//
// Handing the standard attempt's browser to `openPage` as a
// `blockedFallbackSource` SPENDS it: `connectViaBrowserbaseBlockedFallback`
// closes that browser — and lib.js wraps close() so every close also POSTs a
// session release — before it mints anything, and that close is the first
// thing in the call that can fail. Every earlier throw in `openPage` is a
// deterministic env read that the standard attempt survived milliseconds
// earlier with the same env, and both `fallback_unavailable` guards are
// already excluded by `shouldAttemptResidentialFallback`.
//
// So after a FAILED fallback (release_failed, mint_failed, open_failed) the
// pass keeps the standard attempt's EVIDENCE — a proven block beats a generic
// failed run — but its browser is gone. Re-adopting the handle along with the
// evidence would send a second release for an already-released session, which
// the proxy refuses with the uniform 403: a real, alarming line in the proxy
// log for a run that did nothing wrong.
export function browserHandleToRelease({
  selectedAttempt,
  standardAttempt,
  standardBrowserSpent = false,
}) {
  const browser = selectedAttempt?.browser || null;
  if (!standardBrowserSpent) return browser;
  if (selectedAttempt !== standardAttempt) return browser;
  return null;
}

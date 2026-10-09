# Selected logo and hosting

Use this reference when selected artwork is incomplete or a finalizer logo outcome needs explanation. The agent chooses the visible brand mark from current page evidence; the browser preserves the chosen element. A favicon or social preview is not a substitute for a missing primary logo.

Inspect or reveal the exact logo image/SVG reference. Copy the returned `artwork.url` and `artwork.svgPath` unchanged. A normal image uses its current resource URL, never a wrapping link. Inline or embedded SVG can have an empty URL and supported inner markup: that identifies the mark but does not create an email-ready hosted image. Do not reconstruct paths, guess asset URLs or edit browser-produced files.

The browser owns the cumulative `logo-assets.json` manifest and preserved source/derived assets under the current run directory. Multiple selections retain their own evidence. The author selects the logo row in the public kit; the finalizer matches it to that evidence. These same-workflow files are consistency evidence, not an authenticated barrier against deliberate same-UID tampering.

The finalizer owns primary-logo preflight and any authorized hosting. It checks the selected asset and current payload before making a remote call, preserves the existing SVG/raster conversion behavior, and binds the exact successful hosted result in process before promotion. One logo's evidence does not authorize another mark. The native finalizer does not substitute a fallback logo. If selected artwork requires hosting and that hosting fails, the current run is not promoted; report the recorded outcome and reason.

Do not upload the logo separately or edit a finalizer-owned URL. For local-only requests, return preserved artwork with its limitations; no remote conversion is implied. A missing asset, suppressed export or unavailable conversion must remain explicit rather than triggering replacement with unrelated artwork.

Use the returned finalizer outcome; consult `finalize-report.json.logo_hosting` when diagnosis is needed. A nonempty `svgPath`, a captured URL or a locally valid SVG is not proof that an email can render the logo. Follow [Phase 5](phase-5-save.md) for completion and [Report lines](report-lines.md#logo-outcome) for diagnostic meaning; surface a missing usable logo when it prevents the requested branding.

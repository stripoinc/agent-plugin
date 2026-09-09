// The text probe's selector list, in one place.
//
// It lived in `homepage-pass.js`, which is a SCRIPT with top-level side
// effects (it opens a browser on import), so nothing could read the constant
// without running a page capture. `lib/role-evidence.js` needs it to name the
// full set of selectors a region role derives from, which is what lets it
// refuse to call a role absent when the probe only asked about some of them.
export const DEFAULT_TEXT_SELECTORS = [
  "h1",
  "h2",
  "h3",
  "p",
  "a",
  "button",
  "[class*='price']",
  "header a",
  "[role='banner'] a",
  "nav a",
  "[role='navigation'] a",
  "footer a",
  "[role='contentinfo'] a",
];

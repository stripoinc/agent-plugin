// Headless behavioral runner for window.__brandkitProbeHelpers.
// Stubs the minimal DOM surface needed by BROWSER_PROBE_HELPERS_SOURCE so we
// can exercise pure helpers (parseGradient, normalizeFontWeight, pickBorderColor,
// parseLineHeightPx, parseColorWithAlpha) from a Node test.
//
// Usage: node probe-helpers-runner.js < input.json > output.json
// Input shape: [{ "name": "parseGradient", "args": [...] }, ...]
// Output shape: [{ "name": "...", "result": ... }, ...]

import vm from "node:vm";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LIB_TEXT = fs.readFileSync(path.join(__dirname, "lib.js"), "utf8");
// The template literal contains escaped internal backticks (\`); anchor on the
// distinctive IIFE terminator `\n})();\n` followed by the closing backtick.
const SOURCE_MATCH = LIB_TEXT.match(
  /export const BROWSER_PROBE_HELPERS_SOURCE = `([\s\S]*?\n\}\)\(\);\n)`;\n/,
);
if (!SOURCE_MATCH) {
  process.stderr.write("Failed to extract BROWSER_PROBE_HELPERS_SOURCE from lib.js\n");
  process.exit(2);
}
// Unescape sequences that were template-literal escapes: \` → `, \${ → ${, \\ → \.
const BROWSER_PROBE_HELPERS_SOURCE = SOURCE_MATCH[1]
  .replace(/\\`/g, "`")
  .replace(/\\\$/g, "$")
  .replace(/\\\\/g, "\\");

const NAMED_COLORS = {
  black: "#000000",
  white: "#ffffff",
  red: "#ff0000",
  lime: "#00ff00",
  blue: "#0000ff",
  transparent: "rgba(0, 0, 0, 0)",
};

function normalizeColorString(value) {
  if (value === null || value === undefined) return null;
  const raw = String(value).trim().toLowerCase();
  if (!raw) return null;
  if (Object.prototype.hasOwnProperty.call(NAMED_COLORS, raw)) {
    return NAMED_COLORS[raw];
  }
  const hex3 = raw.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/);
  if (hex3) {
    return `#${hex3[1]}${hex3[1]}${hex3[2]}${hex3[2]}${hex3[3]}${hex3[3]}`;
  }
  if (/^#[0-9a-f]{6}$/.test(raw)) return raw;
  const rgb = raw.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/);
  if (rgb) {
    const channels = rgb.slice(1, 4).map((value) => Math.max(0, Math.min(255, Number(value))));
    return `#${channels.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
  }
  const rgba = raw.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/);
  if (rgba) {
    const channels = rgba.slice(1, 4).map((value) => Math.max(0, Math.min(255, Number(value))));
    const alpha = Math.max(0, Math.min(1, Number(rgba[4])));
    if (alpha === 1) {
      return `#${channels.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
    }
    return `rgba(${channels[0]}, ${channels[1]}, ${channels[2]}, ${alpha})`;
  }
  return null;
}

function makeCanvasContext() {
  let current = "#000000";
  return {
    set fillStyle(value) {
      const normalized = normalizeColorString(value);
      if (normalized !== null) current = normalized;
    },
    get fillStyle() { return current; },
    measureText(text) { return { width: String(text || "").length * 6 }; },
    set font(_value) {},
    get font() { return ""; },
  };
}

const sandbox = {};
sandbox.window = sandbox;
sandbox.document = {
  createElement: () => ({ getContext: () => makeCanvasContext() }),
};
sandbox.getComputedStyle = (element) => element?.style || {};
sandbox.Element = class { matches() { return false; } };
sandbox.HTMLInputElement = class extends sandbox.Element {};
sandbox.CSSStyleDeclaration = class {};
sandbox.NodeFilter = { SHOW_TEXT: 4, FILTER_ACCEPT: 1, FILTER_REJECT: 2 };

vm.createContext(sandbox);
vm.runInContext(BROWSER_PROBE_HELPERS_SOURCE, sandbox);
const helpers = sandbox.window.__brandkitProbeHelpers;
if (!helpers) {
  process.stderr.write("Failed to install __brandkitProbeHelpers\n");
  process.exit(2);
}

function rawArchetypeCandidateScoreLite(signals) {
  // Preserves the legacy hasGridSiblings scoring fixture for helper tests.
  const hasGridSiblings = signals.hasGridSiblings === true;
  const knowsGridSiblings = typeof signals.hasGridSiblings === "boolean";
  return (hasGridSiblings ? 4 : 0) - (knowsGridSiblings && !hasGridSiblings ? 15 : 0);
}

function dispatch(call) {
  const name = call.name;
  const args = call.args || [];
  switch (name) {
    case "parseGradient":
      return helpers.parseGradient(args[0]);
    case "normalizeFontWeight":
      return helpers.normalizeFontWeight(args[0]);
    case "pickBorderColor":
      return helpers.pickBorderColor(args[0]);
    case "parseLineHeightPx":
      return helpers.parseLineHeightPx(args[0], args[1]);
    case "parseColorWithAlpha":
      return helpers.parseColorWithAlpha(args[0]);
    case "rawArchetypeCandidateScoreLite":
      return rawArchetypeCandidateScoreLite(args[0] || {});
    default:
      throw new Error(`Unknown helper: ${name}`);
  }
}

let buffer = "";
process.stdin.on("data", (chunk) => { buffer += chunk; });
process.stdin.on("end", () => {
  const calls = JSON.parse(buffer || "[]");
  const results = calls.map((call) => {
    try {
      return { name: call.name, result: dispatch(call) };
    } catch (error) {
      return { name: call.name, error: String(error?.message || error) };
    }
  });
  process.stdout.write(JSON.stringify(results));
});

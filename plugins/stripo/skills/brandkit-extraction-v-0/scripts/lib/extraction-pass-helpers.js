import { selectableProductRows } from "./product-row-filter.js";
// Shared helpers for the extraction-stage orchestrator (BACKLOG item 15).
//
// `assemble-extraction-stage.js` was previously a single 1217-line module
// holding the orchestrator (`main` + `parseArgs`) AND both pass bodies
// (`runScaffold` + `runNormalize`) AND every shared helper they call.
// The size guard was at 1220 with the docstring hinting that the next
// inline addition should refactor first.
//
// This module is the shared-helpers half of that split:
//   - argv contract: `parseArgs`, `technicalDir`
//   - filesystem I/O: `readJson`, `readMtimeMs`, `writeJson`, `writeDiagnostics`
//   - text/number/colour normalisation primitives used by both passes
//   - the high-level `scaffoldPayload` builder and the
//     `normalizeExtraction` post-processing chain
//   - diagnostic builders that read final payloads
//     (`roleGaps`, `productCardMirrorDiagnostics`,
//     `productCardVariantDecisionDiagnostics`, `homepagePassDiagnostics`,
//     `findUnsafePublicStrings`)
//   - schema-loading + AJV validation (`loadAjv`,
//     `readExtractionStageSchema`, `validateExtractionStage`)
//   - constants tightly bound to the argv contract or the public-string
//     scrubber (`SOCIAL_KEYS`, `USAGE_HINT_ALIASES`, `DEBUG_KEYS`,
//     `WORKER_PATH_RE`, `SCRATCH_REF_RE`, `EXCLUSIVE_HINT_GROUPS`)
//
// All bodies are transplanted verbatim from the pre-refactor orchestrator
// so the post-refactor scaffold draft + diagnostics outputs are
// byte-identical to the pre-refactor ones (see the parity test in
// `tests/test_assemble_extraction_stage.py`).
//
// The schema path now resolves relative to THIS file (`lib/`) rather than
// the orchestrator (`scripts/`) — `path.resolve(__dirname, "..", "..",
// "references", ...)`. Caches the parsed schema in a module-private cache
// so both passes pay the read cost once per process.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";
import { colourMeasurementState, productCardCtaFromRow } from "../assemble-product-card-cta.js";
import { writeFileAtomic } from "./atomic-write.js";
import { normalizeProductCardPlaceholderToCanonical } from "./product-card-placeholder.js";
import { demoteIconOnlyFromButtonPrimary } from "./button-primary-icon-only-demotion.js";
import { propagateOldPriceFromProbeRows } from "./old-price-evidence-propagation.js";
import { propagateProductCardCtaHoverFromProbeRows } from "./product-card-cta-hover-propagation.js";
import { backfillButtonDimensionsFromProbe } from "./button-dimension-backfill.js";
import { dropNonEcomProductCards } from "./product-card-non-ecom-filter.js";
import { dropNonPurchaseProductCards } from "./product-card-cta-shape-filter.js";
import {
  dedupeButtonComponents,
  dedupeProductCardComponents,
  dedupeTypographyComponents,
} from "./component-dedup.js";
import {
  appendTypographyRoleMirrors,
  familySpellingKey,
  mergeTypographyByCanonicalFamily,
  stripProductCardCtaFromDescriptionMismatch,
  tagProductCardCtaMirrors,
  typographySpellingSignature,
} from "./product-card-cta-mirrors.js";
import { filterScaffoldProductRows } from "./product-row-filter.js";
import { typographyRoleHintsForSelector } from "./typography-selector-role-hints.js";
import { seedTypographyDescriptions } from "./typography-description-seed.js";
import { applyDerivedOldPricePosition } from "./product-card-old-price-position.js";
import { applyDerivedContentAlign } from "./product-card-content-align.js";
import { applyDerivedVariantIndex } from "./product-card-variant-decision.js";
import { preEmitBrandColours } from "./colour-pre-emit.js";
import { synthesizeRegionBgHints } from "./region-bg-hints.js";
import { synthesizeContentBgHint } from "./region-bg-content-hint.js";
import { synthesizeProductCardSurfaceBgHint } from "./product-card-surface-hint.js";
import { synthesizeProductCardFromEvidence } from "./product-card-synth-from-evidence.js";
import { applyButtonNoiseFilter } from "./button-noise-filter.js";
import { dropEmptyUsageHintRows } from "./empty-usagehints-strip.js";
import { dropLogoDescriptionFields } from "./logo-description-strip.js";
import { dropLongImportantLinkNames } from "./important-link-name-cap.js";
import { contactFactFromRow } from "./contact-facts.js";
import {
  FULL_DIAGNOSTICS_FILENAME,
  SUMMARY_DIAGNOSTICS_FILENAME,
  buildDiagnosticsSummary,
} from "./diagnostics-summary.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const SOCIAL_KEYS = ["facebook", "youtube", "instagram", "tiktok", "twitter", "x", "snapchat", "pinterest", "linkedin", "android", "apple", "rss", "yelp", "threads", "discord", "twitch", "whatsapp", "viber", "telegram", "messenger"];

export const USAGE_HINT_ALIASES = new Map([
  ["page-background", ["canvas-background"]],
  ["surface-background", ["content-background"]],
  ["content-surface-background", ["content-background"]],
  ["navigation-background", ["header-background"]],
  ["overlay-background", ["content-background"]],
  ["button-background", ["button-primary-background"]],
  ["button-text", ["button-primary-text"]],
  ["button-hover-background", ["button-primary-hover-background"]],
  ["primary-cta", ["product-card-cta"]],
  ["primary-cta-background", ["button-primary-background"]],
  ["primary-cta-text", ["button-primary-text"]],
  ["primary-cta-hover-background", ["button-primary-hover-background"]],
  ["primary-cta-border", ["product-card-cta-border"]],
  ["navigation-surface-accent", ["brand-primary-accent"]],
  ["header-surface-accent", ["brand-primary-accent"]],
  ["footer-surface-accent", ["brand-secondary-accent"]],
  ["gradient-background", []],
]);

export const DEBUG_KEYS = new Set(["selector", "selectors", "classList", "matchIndex", "coordinates", "boundingRect", "nodePath", "domPath", "traces", "retryTrace", "recoveryTrace", "debugPaths", "internalNotes", "tag", "productUrl", "rawText", "selectionSignals", "recoverySignals", "selectorDiagnostics", "selectorCandidates", "minedSelectors", "domMinedSelectors", "localPath", "screenshotPath", "scratchPath", "debug"]);
export const WORKER_PATH_RE = /(^|[\s"'(<[{:=>,])(?:file:\/\/)?\/(?:app\/artifacts|etc\/codex|workspace|output|home\/codex)(?:\/[^\s"'`)\]}>:,;]*)?/i;
export const SCRATCH_REF_RE = /(^|[\s"'(<[{:=>,])(?:\.\/)?scratch\/[^\s"'`)\]}>:,;]*/i;
export const EXCLUSIVE_HINT_GROUPS = [["brand-primary-accent", "brand-secondary-accent"], ["button-primary-background", "button-secondary-background"], ["price-current", "price-old"]];

// WP-A2: the `--help` text. It lives HERE and not in the orchestrator so the
// orchestrator stays the thin dispatcher its size guard
// (`tests/test_assemble_extraction_stage.py::test_assembler_size_guard_under_100_lines`)
// exists to keep it. It names BOTH modes and what each one writes, because the
// only question a reader has at this CLI is which mode produces which artifact.
export const USAGE_TEXT = `Usage: node assemble-extraction-stage.js --mode <scaffold|normalize> [options]

Modes:
  scaffold   Build brandkit.extraction.draft.json from the homepage-pass
             artifacts in the technical dir, alongside assembly-diagnostics.json,
             assembly-diagnostics.summary.json, product-card-probe-binding.json
             and review-packet.json. The review packet is also printed to stdout
             as one compact JSON document (the same bytes as the file).
             Requires --slug or --technical-dir.
  normalize  Validate, sanitize and publish brandkit.extraction.json from the
             agent-authored input, refreshing the diagnostics. Prints one
             compact JSON verification block to stdout on every exit path.
             Requires --input.

Options:
  --mode <scaffold|normalize>   Pass to run (required).
  --artifacts-root <path>       Artifacts root; defaults to $BRANDKIT_ARTIFACTS_ROOT.
  --slug <slug>                 Slug under <artifacts-root>/technical/.
  --technical-dir <path>        Technical dir, overriding --artifacts-root/--slug.
  --input <path>                Agent-authored extraction JSON (normalize only).
  --out <path>                  Write the payload here instead of the default name.
  --url <url>                   Homepage URL the capture was taken from.
  --pretty                      Indent the written JSON artifacts by 2 spaces.
  --help, -h                    Print this help and exit 0.

Environment:
  BRANDKIT_ARTIFACTS_ROOT       Default for --artifacts-root.
  BRANDKIT_NORMALIZE_ATTEMPT    Normalize attempt counter (1-3).
`;

export function parseArgs(argv) {
  const args = {
    mode: "",
    help: false,
    artifactsRoot: process.env.BRANDKIT_ARTIFACTS_ROOT || "",
    slug: "",
    technicalDir: "",
    input: "",
    out: "",
    url: "",
    pretty: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--mode") args.mode = argv[++index] || "";
    else if (value === "--artifacts-root") args.artifactsRoot = argv[++index] || "";
    else if (value === "--slug") args.slug = argv[++index] || "";
    else if (value === "--technical-dir") args.technicalDir = argv[++index] || "";
    else if (value === "--input") args.input = argv[++index] || "";
    else if (value === "--out") args.out = argv[++index] || "";
    else if (value === "--url") args.url = argv[++index] || "";
    else if (value === "--pretty") args.pretty = true;
    // Matched BEFORE the unknown-flag throw, and short-circuiting the
    // required-flag checks below, so a bare `--help` exits 0 instead of dying
    // on "Missing or invalid --mode". Every OTHER unknown flag keeps exactly
    // today's behaviour: throw, stack to stderr, exit 1.
    else if (value === "--help" || value === "-h") args.help = true;
    else throw new Error(`Unknown flag: ${value}`);
  }
  if (args.help) return args;
  if (!["scaffold", "normalize"].includes(args.mode)) {
    throw new Error("Missing or invalid --mode: expected scaffold or normalize");
  }
  if (args.mode === "normalize" && !args.input) {
    throw new Error("Missing required flag for normalize mode: --input <path>");
  }
  if (args.mode === "scaffold" && !args.technicalDir && !args.slug) {
    throw new Error("Missing required flag for scaffold mode: --slug <slug> or --technical-dir <path>");
  }
  return args;
}

export function technicalDir(args) {
  if (args.technicalDir) return path.resolve(args.technicalDir);
  return path.resolve(args.artifactsRoot, "technical", args.slug);
}

export async function readJson(filePath, fallback) {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8"));
  } catch (error) {
    if (error && error.code === "ENOENT") return fallback;
    throw error;
  }
}

// BACKLOG item 16: return file mtime in ms, or null when the file is
// missing / unreadable. Used by `resolveEffectiveButtonStyles` to gate
// the focused-fallback on file freshness.
export async function readMtimeMs(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.mtimeMs;
  } catch {
    return null;
  }
}

// Publishes through `writeFileAtomic` (temp sibling + rename) rather than
// writing the destination in place. Every artifact this module and both
// passes emit goes through here -- the extraction artifact, both diagnostics
// files, the scaffold draft, the shrinkage-recovery sidecar -- so a write that
// fails partway can no longer destroy the previous good copy. See
// `lib/atomic-write.js` for the measured failure it closes.
export async function writeJson(filePath, payload, pretty) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await writeFileAtomic(filePath, `${JSON.stringify(payload, null, pretty ? 2 : 0)}\n`);
}

// BACKLOG item 23: write the full diagnostics JSON plus a compact
// summary sibling next to it. Every assembly-diagnostics write site
// goes through this helper so the summary cannot drift from the full
// file. `dir` is the directory that already holds technical artifacts.
export async function writeDiagnostics(dir, payload, pretty) {
  await writeJson(path.join(dir, FULL_DIAGNOSTICS_FILENAME), payload, pretty);
  await writeJson(path.join(dir, SUMMARY_DIAGNOSTICS_FILENAME), buildDiagnosticsSummary(payload), pretty);
}

// The diagnostics file as it stood BEFORE this pass runs, or `null`.
//
// Every pass rewrites `assembly-diagnostics.json` wholesale, so anything the
// agent added to it with the sanctioned `jq` write -- `roleChoiceJustifications`
// is the only such key -- exists only in the file being replaced. The
// text-colour coverage gate reads it, and the two helpers below put it back.
//
// FAILS SOFT ON EVERY ERROR, unlike `readJson`, which rethrows anything that
// is not ENOENT. This is the ONE artifact the agent edits by hand, so a
// half-written or `jq`-mangled file is a shape that will occur -- and a pass
// that threw on it would turn a broken sidecar into a dead run, when the
// correct reading of an unparseable file is "no justification was recorded".
export async function readPriorDiagnostics(dir) {
  try {
    return JSON.parse(await fs.readFile(path.join(dir, FULL_DIAGNOSTICS_FILENAME), "utf8"));
  } catch {
    return null;
  }
}

// Carry the agent's `roleChoiceJustifications` across the rewrite.
//
// Without this the escape it gates is single-use: the agent records a reason,
// the gate accepts it, and the same write that accepts it deletes the record --
// so the finalize CLI, which reads the key for its own empty-array checks,
// would never see it. Absent or malformed leaves the object untouched, so a
// run that never had one produces the byte-identical file it produced before.
//
// IT CARRIES OUT OF WHATEVER FILE IS IN THE DIR, INCLUDING ANOTHER RUN'S. Both
// passes read `priorDiagnostics` with `readPriorDiagnostics(dir)` and neither
// asks which capture wrote it, so seeding a leftover `assembly-diagnostics.json`
// and then scaffolding a FRESH capture into the same dir carries that reason in
// -- reproduced end to end: a reason naming another site's hexes survives both
// scaffold and normalize verbatim. Two things keep it from being an escape, and
// both are properties of other code rather than of this function:
//   - `finalize prepare` deletes `assembly-diagnostics.json` outright
//     (`brandkit_finalize/stale.py`), so the sanctioned way to reuse a dir
//     clears it. Measured: the file is gone after `prepare`.
//   - the colour gate binds a reason to the ROLE, the KEPT hex and the DERIVED
//     hex, so a reason describing another capture's correction admits nothing
//     here. Measured on the leaked reason above: both text roles still refused
//     `value_not_measured` and normalize exited 1.
// Stated rather than fixed because the carry is what makes the escape usable at
// all within one run, and narrowing it to "the same capture" needs an identity
// this file does not hold.
export function carryRoleChoiceJustifications(diagnostics, priorDiagnostics) {
  if (!diagnostics || typeof diagnostics !== "object") return diagnostics;
  const carried = priorDiagnostics && typeof priorDiagnostics === "object"
    ? priorDiagnostics.roleChoiceJustifications
    : null;
  if (carried && typeof carried === "object" && !Array.isArray(carried)) {
    diagnostics.roleChoiceJustifications = carried;
  }
  return diagnostics;
}

export function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

export function numberOrNull(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number.parseFloat(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

export function simplePadding(value) {
  const source = value && typeof value === "object" ? value : {};
  return {
    top: numberOrNull(source.top) ?? 0,
    right: numberOrNull(source.right) ?? 0,
    bottom: numberOrNull(source.bottom) ?? 0,
    left: numberOrNull(source.left) ?? 0,
  };
}

// Normalize a CSS `box-shadow` string from the probe into the value
// downstream consumers expect:
//   - "none" (CSS default → no shadow) → null
//   - empty / non-string → null
//   - any non-default shadow string → trimmed string preserved verbatim
//
// `null` semantically means "no visible chrome via shadow" — the
// customise pipeline uses that to emit `box-shadow: none` on the
// rendered card, overriding the bundled template's tile shadow when
// the brand is bare. Preserving the raw string for non-default values
// lets the customise pipeline render the brand's actual shadow.
export function normalizeBoxShadow(value) {
  const raw = normalizeText(value);
  if (!raw) return null;
  if (raw.toLowerCase() === "none") return null;
  return raw;
}

export function normalizeColor(value) {
  const raw = normalizeText(value);
  if (!raw) return raw;
  const hex = raw.match(/^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i);
  const rgb = raw.match(/^rgba?\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)(?:\s*,\s*([^)]+))?\)$/i);
  if (rgb) {
    if (rgb[4] && Number.parseFloat(rgb[4]) === 0) return "transparent";
    return `#${[rgb[1], rgb[2], rgb[3]].map((part) => Math.max(0, Math.min(255, Math.round(Number.parseFloat(part)))).toString(16).padStart(2, "0")).join("")}`;
  }
  const hsl = raw.match(/^hsla?\((\d+(?:\.\d+)?)\s*,\s*(\d+(?:\.\d+)?)%\s*,\s*(\d+(?:\.\d+)?)%(?:\s*,\s*([^)]+))?\)$/i);
  if (hsl) {
    if (hsl[4] && Number.parseFloat(hsl[4]) === 0) return "transparent";
    const h = (((Number.parseFloat(hsl[1]) % 360) + 360) % 360) / 360;
    const s = Number.parseFloat(hsl[2]) / 100;
    const l = Number.parseFloat(hsl[3]) / 100;
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const f = (t) => {
      let n = t;
      if (n < 0) n += 1;
      if (n > 1) n -= 1;
      return n < 1 / 6 ? p + (q - p) * 6 * n : n < 1 / 2 ? q : n < 2 / 3 ? p + (q - p) * (2 / 3 - n) * 6 : p;
    };
    const channels = s === 0 ? [l, l, l] : [f(h + 1 / 3), f(h), f(h - 1 / 3)];
    return `#${channels.map((part) => Math.round(part * 255).toString(16).padStart(2, "0")).join("")}`;
  }
  if (!hex) return raw.replace(/\s*,\s*/g, ", ").replace(/\s+\)/g, ")").toLowerCase();
  const body = hex[1].toLowerCase();
  if (body.length === 3 || body.length === 4) {
    return `#${[...body].map((char) => char + char).join("")}`;
  }
  return `#${body}`;
}

export function normalizeUsageHints(value) {
  const output = [];
  for (const item of Array.isArray(value) ? value : []) {
    const raw = normalizeText(item);
    if (!raw) continue;
    const mapped = USAGE_HINT_ALIASES.has(raw) ? USAGE_HINT_ALIASES.get(raw) : [raw];
    for (const hint of mapped) {
      if (hint && !output.includes(hint)) output.push(hint);
    }
  }
  return output;
}

export function normalizeLayoutIntent(value, context = {}, diagnostics = [], pathName = "") {
  const raw = normalizeText(value).toLowerCase().replace(/_/g, "-");
  if (!raw) return "";
  if (["full-width", "content-sized", "fixed-width", "icon-only", "unknown"].includes(raw)) return raw;
  if (raw === "content-width" || raw === "inline") return "content-sized";
  if (raw === "compact") {
    if (context.isIconLike === true || context.hasUsableVisibleText === false) return "icon-only";
    if (context.hasUsableVisibleText === true && context.isIconLike !== true) return "content-sized";
    diagnostics.push({ path: pathName, value: raw, message: "ambiguous compact CTA layout normalized to unknown" });
    return "unknown";
  }
  diagnostics.push({ path: pathName, value: raw, message: "unknown CTA layout normalized to unknown" });
  return "unknown";
}

function mergeDescriptions(left, right) {
  const parts = [];
  for (const value of [left, right]) {
    const text = normalizeText(value);
    if (text && !parts.includes(text)) parts.push(text);
  }
  return parts.join("; ");
}

function hasConflictingHints(left, right) {
  return EXCLUSIVE_HINT_GROUPS.some((group) => {
    const a = group.filter((hint) => left.includes(hint));
    const b = group.filter((hint) => right.includes(hint));
    return a.length && b.length && new Set([...a, ...b]).size > 1;
  });
}

function normalizeColorTokenList(tokens, diagnostics, pathName) {
  const byValue = new Map();
  for (const token of Array.isArray(tokens) ? tokens : []) {
    if (!token || typeof token !== "object") continue;
    const value = normalizeColor(token.value);
    if (!value) continue;
    const existing = byValue.get(value);
    const next = {
      ...token,
      value,
      description: normalizeText(token.description),
      usageHints: normalizeUsageHints(token.usageHints),
    };
    if (existing) {
      if (hasConflictingHints(existing.usageHints, next.usageHints)) {
        diagnostics.push({ path: pathName, value, usageHints: [existing.usageHints, next.usageHints], message: "conflicting color role hints kept separate" });
        byValue.set(`${value}#${byValue.size}`, next);
        continue;
      }
      existing.description = mergeDescriptions(existing.description, next.description);
      existing.usageHints = normalizeUsageHints([...existing.usageHints, ...next.usageHints]);
    } else {
      byValue.set(value, next);
    }
  }
  return [...byValue.values()];
}

function normalizeObject(value) {
  if (Array.isArray(value)) return value.map((item) => normalizeObject(item));
  if (!value || typeof value !== "object") return value;
  const output = {};
  for (const [key, child] of Object.entries(value)) {
    if (key === "usageHints") output[key] = normalizeUsageHints(child);
    else if (/color$/i.test(key) && typeof child === "string") output[key] = normalizeColor(child);
    else output[key] = normalizeObject(child);
  }
  return output;
}

export function normalizeLayouts(payload, diagnostics = []) {
  for (const [index, button] of (Array.isArray(payload?.brand?.components?.button) ? payload.brand.components.button : []).entries()) {
    if (button?.layout && typeof button.layout === "object") button.layout.intent = normalizeLayoutIntent(button.layout.intent, {}, diagnostics, `$.brand.components.button[${index}].layout.intent`) || "unknown";
  }
  for (const [index, card] of (Array.isArray(payload?.brand?.components?.productCard) ? payload.brand.components.productCard : []).entries()) {
    if (card?.cta && typeof card.cta === "object") card.cta.layoutIntent = normalizeLayoutIntent(card.cta.layoutIntent, card.cta, diagnostics, `$.brand.components.productCard[${index}].cta.layoutIntent`) || "unknown";
  }
}

export function normalizeExtraction(
  payload,
  colorConflicts = [],
  layoutDiagnostics = [],
  productRows = null,
  buttonStyles = null,
  textStyles = null,
  { technicalProductRowsBound = false } = {},
) {
  productRows = selectableProductRows(productRows);
  const normalized = normalizeObject(payload);
  const colors = normalized?.brand?.colors;
  if (colors && typeof colors === "object") {
    for (const key of ["accentColors", "backgroundColors", "textColors"]) {
      colors[key] = normalizeColorTokenList(colors[key], colorConflicts, `$.brand.colors.${key}`);
    }
  }
  normalizeLayouts(normalized, layoutDiagnostics);
  // Safety-net ordering. See SKILL.md "Role-tagging contract" for the
  // contract; each helper file documents its own gates. Order matters:
  //   1. Dedup canonicalises records before downstream lookups.
  //   2. propagateOldPriceFromProbeRows runs after dedup but before the
  //      placeholder collapse so a restored card isn't mistaken for empty.
  //   3. propagateProductCardCtaHoverFromProbeRows runs immediately after the
  //      old-price propagation and BEFORE tagProductCardCtaMirrors so the
  //      mirror (button[] reflection of CTA evidence) sees the corrected
  //      hover triplet rather than agent-flattened default colors.
  //   4. dropNonEcomProductCards runs after placeholder collapse and
  //      before downstream productCard consumers — marketing-site
  //      mis-classifications get filtered out cleanly.
  //   5. backfillButtonDimensionsFromProbe runs before the demote net so
  //      icon-only detection sees full layout signals even when the agent
  //      stripped them.
  //   6. appendTypographyRoleMirrors runs BEFORE tagProductCardCtaMirrors:
  //      the icon-only branch of `tagProductCardCtaMirrors` filters out
  //      typography records with empty `usageHints` (would-be-orphans
  //      after stripping `product-card-cta`). If the agent stripped a
  //      typography record's hints (or it never had any to begin with),
  //      running the CTA tagger first would delete the record before
  //      `appendTypographyRoleMirrors` could attach `product-name-typography`
  //      / `product-price-typography` / `product-old-price-typography` to
  //      it via signature match — leaving the role-coverage gate firing
  //      on a record we just deleted. Running mirrors first turns those
  //      records into hint-bearing records by signature; the CTA tagger
  //      then operates on the hint-tagged set without dropping anything
  //      that has earned a role.
  //   7. tagProductCardCtaMirrors runs before description-mismatch strip
  //      so an accidental mirror gets cleaned up.
  dedupeButtonComponents(normalized, layoutDiagnostics);
  // Drop empty-bg "buttons" (probe noise) without an outline+role-hint
  // carve-out, and collapse remaining rows that share the relaxed
  // (bg, fg, border, radius) signature — padding intentionally
  // dropped from the key so multiple records that differ only in
  // padding merge to one. See lib/button-noise-filter.js. Runs AFTER
  // strict-signature dedup so we keep its diagnostics, then layer the
  // looser collapse on top.
  applyButtonNoiseFilter(normalized, layoutDiagnostics);
  dedupeTypographyComponents(normalized, layoutDiagnostics);
  // Canonical-family pass — collapses rows whose primary font name + numeric
  // signature match but whose CSS family strings differ (e.g. one row carries
  // `"Inter, sans-serif"` and another carries `"Inter, system-ui,
  // sans-serif"`). Runs AFTER the strict-signature dedup so the cheap
  // case is already collapsed; this pass is a no-op when there are no
  // canonical-family-equivalent rows left. Keeps the productCard mirror
  // tagger from tagging both equivalent rows and tripping the
  // duplicate-hint advisory in `typographyHintDuplicationDiagnostics`.
  // THE PASS THAT RE-MERGES THE MIRRORS THE SCAFFOLDER APPENDED, which is why
  // the capture-spelling index has to reach it. At scaffold time the mirror
  // records do not exist yet when the merge runs; here they do, and without
  // the index this pass hands the longest string in the group — a card's own
  // fallback stack — to whichever region role shares the signature. See
  // `familySpellingIsCaptured`.
  mergeTypographyByCanonicalFamily(normalized, layoutDiagnostics, captureFamilySpellings(textStyles));
  dedupeProductCardComponents(normalized, layoutDiagnostics);
  propagateOldPriceFromProbeRows(normalized, productRows, layoutDiagnostics);
  propagateProductCardCtaHoverFromProbeRows(normalized, productRows, layoutDiagnostics);
  dedupeProductCardComponents(normalized, layoutDiagnostics);
  normalizeProductCardPlaceholderToCanonical(normalized, layoutDiagnostics);
  dropNonEcomProductCards(normalized, layoutDiagnostics);
  dropNonPurchaseProductCards(normalized, layoutDiagnostics, productRows, {
    technicalRowEndorsementVerified: technicalProductRowsBound === true,
  }); synthesizeProductCardFromEvidence(normalized, productRows, layoutDiagnostics); // D4 + Tier-G placeholder.
  backfillButtonDimensionsFromProbe(normalized, buttonStyles, layoutDiagnostics);
  demoteIconOnlyFromButtonPrimary(normalized, layoutDiagnostics);
  appendTypographyRoleMirrors(normalized, productRows);
  tagProductCardCtaMirrors(normalized, productRows);
  stripProductCardCtaFromDescriptionMismatch(normalized, layoutDiagnostics);
  // Final safety net: drop typography / button rows whose `usageHints`
  // array is empty AFTER all role-tagging passes have run. The schema's
  // `usageHintList.minItems: 1` rejects them, and the scaffolder emits
  // such rows by design (typographyFromText / buttonFromRow), expecting
  // either agent-side tagging or one of the synth helpers above to
  // close the gap. Rows that survive to this point are roleless probe
  // residue — the agent saw them and declined to tag, and no
  // deterministic helper matched. See lib/empty-usagehints-strip.js.
  dropEmptyUsageHintRows(normalized, layoutDiagnostics);
  // Seed a usage-prose `description` on any surviving typography row left
  // empty, derived from its now-final `usageHints`. Runs LAST among the
  // typography passes (after dedup, role-mirror tagging, and the empty-hint
  // strip) so the prose reflects the complete hint set — a row that acquires
  // header/footer/product hints via merge or mirror, not its build-time
  // selector, still gets an accurate description. Fill-only: never overwrites
  // an agent- or synth-authored description. This is the typography analogue
  // of the colour builders, which likewise write a description inline wherever
  // a role-bearing row is materialised. See lib/typography-description-seed.js.
  seedTypographyDescriptions(normalized, layoutDiagnostics);
  // EE1 safety net: drop `description` field from logo items. The agent
  // still adds it on some sites despite the Tier DD P5 closed-shape note;
  // dropping deterministically eliminates one AJV retry round per
  // affected site. See lib/logo-description-strip.js.
  dropLogoDescriptionFields(normalized, layoutDiagnostics);
  // HH1 safety net: drop `importantLinks[]` entries whose `name` is
  // longer than the email header column can physically render. The
  // SKILL.md `:302-304` curation contract instructs the agent to emit
  // short header-nav-quality labels, but probe-surfaced promo prose,
  // article-rail headlines, and product titles still leak through on
  // data-heavy sites (four observed in the post-GG batch). The 40-char cap is a physical-display constraint
  // (~1.5x the email header column's character budget), not a
  // fleet-derived curation rule — no legitimate nav label crosses it
  // in any locale we have evidence for. See lib/important-link-name-cap.js.
  dropLongImportantLinkNames(normalized, layoutDiagnostics);
  return normalized;
}

export function publicUrl(value, base = "") {
  try {
    const raw = normalizeText(value);
    if (!raw) return "";
    const url = new URL(raw, base || undefined).toString();
    return /^https?:\/\//i.test(url) ? url : "";
  } catch {
    return "";
  }
}

function httpUrlOrNull(value) {
  try {
    const raw = normalizeText(value);
    if (!raw) return null;
    const url = new URL(raw);
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}

// `organization.website` is the site's IDENTITY, never the page we rendered.
//
// A run launched at `http://acme-example.test/and` landed on a branded 404 at
// `https://acme-example.test/and/`; that path was seeded here, carried into the
// kit, and saved to the account as the brand's website. The page is an accident
// of the URL the operator typed. The site is not.
//
// HOST from the URL the run was LAUNCHED with. `capture.requestedUrl` is
// written by the runtime from argv, so no agent judgement sits between the
// launch and the record, and it survives every redirect that only rewrites the
// path.
//
// SCHEME from the document the server actually SERVED, whatever host it came
// from, because the server -- not the operator -- decides whether the site is
// on TLS. A run typed `http://` that the origin upgraded to `https://` must not
// record the insecure spelling as the brand's website.
//
// A redirect that changed the HOST is a legitimate case that still has to
// work: apex -> www, a ccTLD move, a rebrand. It is also what a parked domain,
// an SSO host and a vendor error page look like, and this field is compared
// against the run's target URL by the site-identity gate. Keeping the requested
// host is what makes the field agree with the run in all of those, and
// `identityHostsMatch` compares registrable domains, so apex -> www still reads
// as one site rather than a mismatch.
//
// The two rules are INDEPENDENT, and that is the whole reason the host-changed
// branch is spelled out rather than returning `requested.origin`: `http://apex
// -> https://www.host` is HSTS plus www-canonicalisation, one of the commonest
// redirects on the web, and it changes the host AND the scheme at once.
// Returning the requested origin there records `http://` for a site that only
// answers over TLS -- the exact spelling the paragraph above forbids.
export function brandWebsiteOrigin({ requestedUrl = "", landedUrl = "" } = {}) {
  const requested = httpUrlOrNull(requestedUrl);
  const landed = httpUrlOrNull(landedUrl);
  if (!requested) return landed ? `${landed.origin}/` : "";
  if (!landed) return `${requested.origin}/`;
  // THE PORT BELONGS TO THE SERVER THAT ANSWERED, so it is read off the same
  // side as the scheme, not off the launch URL. `host` carries the port, and
  // pairing the requested host with the landed scheme paired a port with a
  // scheme that was never served on it: `http://acme-example.test:8080` ->
  // `https://www.acme-example.test/` recorded `https://acme-example.test:8080/`,
  // an origin nothing has ever answered on.
  //
  // Nothing carries when the redirect crossed HOSTS: neither side's port
  // belongs to the other side's host, so the recorded identity is the launched
  // hostname on the served scheme's default port. That is the conservative
  // spelling, and it is the only one that does not invent a pairing.
  //
  // When the hostname did not change, `landed.origin` IS the requested
  // hostname plus the port that answered under the served scheme, so the two
  // branches say the same thing about the host and differ only about the port.
  return requested.hostname === landed.hostname
    ? `${landed.origin}/`
    : `${landed.protocol}//${requested.hostname}/`;
}

export function emptySocials() {
  return Object.fromEntries(SOCIAL_KEYS.map((key) => [key, ""]));
}

export function contactsFromSignals(pageSignals) {
  const contacts = pageSignals?.contacts || {};
  const factList = (items, channel) => {
    const seen = new Set();
    const output = [];
    for (const item of Array.isArray(items) ? items : []) {
      const fact = contactFactFromRow(item, channel);
      if (!fact || seen.has(fact)) continue;
      seen.add(fact);
      output.push(fact);
    }
    return output;
  };
  const textList = (items) =>
    (Array.isArray(items) ? items : []).map((item) => normalizeText(item?.text ?? item)).filter(Boolean);
  return {
    emails: factList(contacts.emails, "email"),
    phones: factList(contacts.phones, "phone"),
    addresses: textList(contacts.addresses),
  };
}

export function socialsFromSignals(pageSignals) {
  const socials = emptySocials();
  const source = pageSignals?.socialsForBrandkit || {};
  for (const key of SOCIAL_KEYS) socials[key] = normalizeText(source[key]);
  return socials;
}

// Scheme detection WITHOUT a URL parser. A scheme is `ALPHA *( ALPHA / DIGIT
// / "+" / "-" / "." ) ":"` (RFC 3986 §3.1), and no relative reference can
// carry one before its first `/`, so this splits "already absolute" from
// "relative" exactly the way `new URL` does for the only question asked here:
// does the result come out http(s)?
const IMPORTANT_LINK_SCHEME_RE = /^[a-z][a-z0-9+.-]*:/i;

// THE writable-important-link predicate. `linksFromSignals` — the mapper that
// decides what `importantLinks` can hold — uses it as its own filter below,
// and the advisory technical-artifact gate imports it to grade probe evidence.
// One spelling, two callers: a row the gate calls carryable is a row this
// mapper carries, and the gate can no longer report the mapper's REQUIRED drop
// (an icon-only link's `name: ""`, a legacy capture's `viber://` url) as data
// loss. Mirrors Python `_is_writable_important_link`.
//
// PARSER-FREE ON PURPOSE, and this is where it differs from `publicUrl`. The
// Python twin cannot call `new URL`, and `importantLinkPath` in the gate
// already documents why the two languages must never each ask their own URL
// parser. So the url half asks only what both languages can answer
// identically: is the normalised url non-empty, and is its scheme — if it has
// one at all — http(s)? A relative `/help` stays carryable because
// `scaffoldPayload` resolves it against the site's own http(s) `website`.
//
// MEASURED, not assumed, and re-measured on every run by
// lib/important-link-writable.test.js: over its 1392-url scheme x authority x
// tail corpus this rule and `Boolean(publicUrl(url, <any http(s) base>))`
// disagree 106 times and ALL 106 go one way — this rule admits what `new URL`
// rejects (`http://`, `http://[`, `:99999`), never the reverse (0 of 1392).
// So it can over-warn, never under-warn. None of the 106 is reachable:
// `lib.js`'s `httpUrl` only emits urls `new URL` accepted AND `^https?://`
// matched, so no capture can carry one.
//
// The same test also measures the fact that lets a base-less gate answer this
// base-bearing mapper's question at all: the http(s)-ness of `publicUrl` is
// invariant across http(s) bases, 0 base-dependent verdicts over that corpus.
export function importantLinkIsPublicUrl(value) {
  const raw = normalizeText(value);
  if (!raw) return false;
  const scheme = IMPORTANT_LINK_SCHEME_RE.exec(raw);
  return scheme ? /^https?:$/i.test(scheme[0]) : true;
}

export function isWritableImportantLink(link) {
  return Boolean(normalizeText(link?.name)) && importantLinkIsPublicUrl(link?.url);
}

export function linksFromSignals(pageSignals, baseUrl) {
  return (Array.isArray(pageSignals?.importantLinksForBrandkit)
    ? pageSignals.importantLinksForBrandkit
    : [])
    .map((link) => ({ name: normalizeText(link?.name), url: publicUrl(link?.url, baseUrl) }))
    // Applied to the MAPPED row, where `name` is already normalised
    // (`normalizeText` is idempotent) and `url` is either "" or an absolute
    // http(s) string — so this is exactly the `name && url` test it replaces,
    // and the mapper's output is byte-identical. Pinned by the differential
    // test in lib/important-link-writable.test.js.
    .filter(isWritableImportantLink);
}

export function languagesFromSignals(pageSignals, languageSubtree) {
  const values = [];
  const push = (value) => {
    const normalized = normalizeText(value).toLowerCase();
    if (normalized && !values.includes(normalized)) values.push(normalized);
  };
  for (const hint of Array.isArray(pageSignals?.documentLanguageHints)
    ? pageSignals.documentLanguageHints
    : []) {
    push(hint?.lang ?? hint);
  }
  for (const hint of Array.isArray(languageSubtree?.languages) ? languageSubtree.languages : []) {
    push(hint?.lang ?? hint);
  }
  return values;
}

export function typographyFromText(row) {
  const record = {
    family: normalizeText(row?.fontFamily ?? row?.family),
    weight: numberOrNull(row?.fontWeight ?? row?.weight),
    sizePx: numberOrNull(row?.fontSizePx ?? row?.sizePx ?? row?.fontSize),
    lineHeightPx: numberOrNull(row?.lineHeightPx ?? row?.lineHeight),
    fontStyle: normalizeText(row?.fontStyle),
    letterSpacingPx: numberOrNull(row?.letterSpacingPx ?? row?.letterSpacing),
    textTransform: normalizeText(row?.textTransform),
    usageHints: normalizeUsageHints(row?.usageHints),
    description: normalizeText(row?.description),
  };
  // Pre-tag role hints deterministically from the probe selector
  // (lib/typography-selector-role-hints.js). The agent then verifies
  // rather than curates from raw evidence. Originally surfaced as a
  // regression where the typography array shipped with the right number
  // of records but a few required role hints went missing on this axis,
  // aborting the downstream customise email build. Dedup unions hints
  // across duplicates so this is safe to run before dedup.
  const selectorHints = typographyRoleHintsForSelector(row?.selector);
  if (selectorHints.length) {
    const existing = Array.isArray(record.usageHints) ? record.usageHints : [];
    record.usageHints = Array.from(new Set([...existing, ...selectorHints]));
  }
  return record;
}

// WHICH FAMILY STRINGS DID THIS CAPTURE ACTUALLY SPELL, AT WHICH SIGNATURE.
//
// `mergeTypographyByCanonicalFamily` collapses records that share a canonical
// font stem but spell their CSS family differently, and it has to hand the
// survivor ONE of those spellings. Two spellings in one group can come from
// two different capture artifacts -- `text-styles.json` for the region roles
// and `product-card-styles.json` for the productCard mirrors -- and handing
// one artifact's spelling to the other's record is what mints a `family` no
// row for that record's role carries. This index is what lets the merge tell
// the two apart, and it is built from `text-styles.json` because that is the
// artifact the region roles are derived from.
//
// THE KEY IS THE GATE'S KEY, deliberately. `typographyValueIsCaptureAnchored`
// asks whether the record's family is spelled by some captured row sharing its
// `(canonical stem, weight, sizePx)` -- not its lineHeight, which the dedup is
// allowed to draw from a sibling. Building this index on any other key would
// let the producer satisfy a question the gate does not ask, or fail one it
// does.
//
// ROWS GO THROUGH `typographyFromText`, the same producer the scaffolder and
// the gate both read them through, so a capture written without the `*Px`
// field spellings is read here exactly as it is read there. A private
// `row.fontFamily` reader is the drift this repo has already paid for once.
export function captureFamilySpellings(textStyles) {
  const index = new Map();
  if (!Array.isArray(textStyles)) return index;
  for (const row of textStyles) {
    if (!row || typeof row !== "object") continue;
    const value = typographyFromText(row);
    const key = typographySpellingSignature(value);
    if (!key) continue;
    if (!index.has(key)) index.set(key, new Set());
    index.get(key).add(familySpellingKey(value.family));
  }
  return index;
}

export function buttonFromRow(row) {
  const source = row?.default || row || {};
  const hover = row?.hover || {};
  const layoutIntent = normalizeText(source.layout?.intent);
  // Carry the probe row's measured dimensions into the assembled button
  // entry. Without these, the `demoteIconOnlyFromButtonPrimary` safety net
  // (lib/button-primary-icon-only-demotion.js) cannot fire on real
  // ecommerce sites: its conjunctive gate requires `intent === "fixed-width"`
  // PLUS `computedHeightPx <= 60` PLUS `widthRatioToParent < 0.4`. Stripping
  // the dimensions here means three of the four signals are missing and
  // the gate never trips. The schema (`buttonLayout` in
  // extraction-stage.schema.json + schema.json) already permits these
  // fields, so this is a pure plumbing change — no schema migration.
  const computedWidthPx = numberOrNull(source.layout?.computedWidthPx);
  const computedHeightPx = numberOrNull(source.layout?.computedHeightPx);
  const widthRatioToParent = numberOrNull(source.layout?.widthRatioToParent);
  let layout;
  if (layoutIntent || computedWidthPx !== null || computedHeightPx !== null || widthRatioToParent !== null) {
    layout = {};
    if (layoutIntent) layout.intent = layoutIntent;
    if (computedWidthPx !== null) layout.computedWidthPx = computedWidthPx;
    if (computedHeightPx !== null) layout.computedHeightPx = computedHeightPx;
    if (widthRatioToParent !== null) layout.widthRatioToParent = widthRatioToParent;
  }
  return {
    backgroundColor: normalizeColor(source.backgroundColor),
    fontColor: normalizeColor(source.fontColor),
    borderColor: normalizeColor(source.borderColor),
    borderWidth: numberOrNull(source.borderWidth) ?? 0,
    borderRadius: numberOrNull(source.borderRadius) ?? 0,
    padding: simplePadding(source.padding),
    hoverBackgroundColor: normalizeColor(hover.backgroundColor),
    hoverFontColor: normalizeColor(hover.fontColor),
    hoverBorderColor: normalizeColor(hover.borderColor),
    hoverBorderWidth: numberOrNull(hover.borderWidth),
    layout,
    usageHints: normalizeUsageHints(source.usageHints ?? row?.usageHints),
    description: normalizeText(source.description ?? row?.description),
  };
}

function neutralTypography(source) {
  if (!source || typeof source !== "object") return null;
  return {
    family: normalizeText(source.fontFamily ?? source.family) || null,
    weight: numberOrNull(source.fontWeight ?? source.weight),
    sizePx: numberOrNull(source.fontSizePx ?? source.sizePx ?? source.fontSize),
    lineHeightPx: numberOrNull(source.lineHeightPx ?? source.lineHeight),
    fontStyle: normalizeText(source.fontStyle) || null,
    letterSpacingPx: numberOrNull(source.letterSpacingPx ?? source.letterSpacing),
    textTransform: normalizeText(source.textTransform) || null,
  };
}

// True only for a border width that is present AND numerically zero. `null`
// (absent / unparseable) is NOT zero: we do not know the width, so we must not
// discard a colour we cannot prove is invisible.
function zeroBorderWidth(rawWidth) {
  return numberOrNull(rawWidth) === 0;
}

export function productCardFromRow(row) {
  const rawQuality = normalizeText(row?.evidenceQuality).toLowerCase();
  const probedConfidence = numberOrNull(row?.confidence);
  const hasExplicitQuality = ["none", "weak", "medium", "strong"].includes(rawQuality);
  const hasExplicitConfidence =
    typeof probedConfidence === "number" && probedConfidence >= 0 && probedConfidence <= 1;

  // EE7: when the probe row carries all four "strong-probe" signals
  // (populated price colour, populated CTA text + backgroundColor, AND
  // signals.ctaHasUsableVisibleText === true), pre-seed evidenceQuality
  // as "medium" + confidence 0.7. The agent can still author "strong"
  // or demote to "weak"/"none" on edge cases. NOTE: probe rows never
  // emit `row.description` or `row.cta.hasUsableVisibleText` directly —
  // the canonical truth lives in `row.price.color`, `row.cta.text`,
  // `row.cta.backgroundColor`, and `row.selectionSignals.ctaHasUsableVisibleText`.
  // Without this promotion, weak/0.3 cascades through compiler gates
  // (e.g. `build_product_card_surface_style` ignores the surface
  // background hint, `product_card_cta_is_reusable_text_cta` falls back
  // to the primary button), causing visual regressions on real ecom sites.
  const priceColorPresent =
    normalizeText(row?.price?.color ?? row?.priceColor) !== "";
  const ctaTextPresent = normalizeText(row?.cta?.text) !== "";
  const ctaBgRaw = normalizeText(row?.cta?.backgroundColor);
  const ctaBgPresent = ctaBgRaw !== "";
  const ctaUsableVisible =
    row?.selectionSignals?.ctaHasUsableVisibleText === true;
  // Outline-style cases (where cta.bg equals card surface bg with a
  // non-zero border) are handled downstream by `build_brand_tokens.py`'s
  // Tier-K Fix 2 — that path treats non-empty probe bg as authoritative
  // direct evidence and skips the outline-to-solid promotion, so the
  // outline stays brand-faithful in the rendered email. We don't need a
  // scaffold-side demote for it.
  const hasStrongProbe =
    priceColorPresent &&
    ctaTextPresent &&
    ctaBgPresent &&
    ctaUsableVisible;

  const evidenceQuality = hasExplicitQuality
    ? rawQuality
    : hasStrongProbe
    ? "medium"
    : "weak";
  const confidence = hasExplicitConfidence
    ? probedConfidence
    : hasStrongProbe
    ? 0.7
    : 0.3;

  return {
    description: normalizeText(row?.description),
    evidenceQuality,
    confidence,
    priceColor: normalizeColor(row?.price?.color ?? row?.priceColor),
    // The colour's measurement state, carried beside it exactly as the CTA
    // colours carry theirs (see `colourMeasurementState`): present when the
    // probe recorded one, absent otherwise, never invented.
    ...colourMeasurementState("priceColorState", row?.price?.colorState ?? row?.priceColorState),
    oldPriceColor: normalizeColor(row?.oldPrice?.color ?? row?.oldPriceColor),
    // A `borderWidth` of exactly 0 means the card draws NO border, so the
    // computed `borderColor` the probe read off the element (browsers report
    // the initial `currentColor`, i.e. the text colour, for a zero-width
    // border) describes nothing that is visible. Carrying it forward made the
    // email compiler paint a real divider in that colour -- black dividers on
    // borderless cards. Only literal numeric zero is treated this way: `null`
    // (unknown width) keeps the colour untouched.
    // The button component is normalized the other way (finalizer fills a zero-width
    // `transparent` borderColor with the background hex): required string, hex-only write.
    borderColor: zeroBorderWidth(row?.card?.borderWidth ?? row?.borderWidth)
      ? null
      : normalizeColor(row?.card?.borderColor ?? row?.borderColor),
    borderWidth: numberOrNull(row?.card?.borderWidth ?? row?.borderWidth),
    ctaPadding: row?.cta?.padding ? simplePadding(row.cta.padding) : null,
    surface: row?.card
      ? {
          backgroundColor: normalizeColor(row.card.backgroundColor),
          ...colourMeasurementState("backgroundColorState", row.card.backgroundColorState),
          borderColor: zeroBorderWidth(row.card.borderWidth)
            ? null
            : normalizeColor(row.card.borderColor),
          borderWidth: numberOrNull(row.card.borderWidth),
          borderStyle: normalizeText(row.card.borderStyle) || null,
          borderRadius: numberOrNull(row.card.borderRadius),
          // boxShadow forwarded from the probe so the downstream
          // email customise can differentiate tile-using brands
          // (visible shadow) from bare brands (no shadow) when both
          // end up on the same product-card variant.
          boxShadow: normalizeBoxShadow(row.card.boxShadow),
        }
      : null,
    titleTypography: neutralTypography(row?.title),
    // Read typography directly from the price/oldPrice probe objects.
    // `neutralTypography` accepts either {fontFamily, fontWeight, fontSizePx}
    // or {family, weight, sizePx} shape; the probe emits the former at
    // row.price.* / row.oldPrice.*. Falling back to row.priceTypography /
    // row.oldPriceTypography for forward-compat with any future probe that
    // emits a separate typography sub-object.
    priceTypography: neutralTypography(row?.priceTypography ?? row?.price),
    oldPriceTypography: neutralTypography(row?.oldPriceTypography ?? row?.oldPrice),
    cta: productCardCtaFromRow(row, { normalizeText, normalizeColor, numberOrNull, simplePadding }),
    missingEvidence: Array.isArray(row?.missingEvidence) ? row.missingEvidence.map(normalizeText) : [],
  };
}

export function scaffoldPayload({ capture, pageSignals, textStyles, buttonStyles, productRows, languageSubtree, baseUrl, backgroundStyles, logoSvgFills = [], diagnostics = [] }) {
  productRows = selectableProductRows(productRows);
  // TWO URLs, deliberately. `linkResolutionBase` is the document a relative
  // `href` has to be resolved against, so it stays the rendered page --
  // resolving `catalog` against an origin and against the page it was read
  // from are different answers, and the page is the correct one. `website` is
  // an identity and must not carry a path; see `brandWebsiteOrigin`.
  const linkResolutionBase = publicUrl(baseUrl || capture?.url || pageSignals?.pageUrl);
  const website = brandWebsiteOrigin({
    requestedUrl: capture?.requestedUrl || baseUrl,
    landedUrl: capture?.url || pageSignals?.pageUrl,
  });
  const payload = {
    brand: {
      organization: { name: "", website },
      logos: [],
      colors: { accentColors: [], backgroundColors: [], textColors: [] },
      typography: (Array.isArray(textStyles) ? textStyles : []).map(typographyFromText),
      components: {
        button: (Array.isArray(buttonStyles) ? buttonStyles : []).map(buttonFromRow),
        // Filter probe rows by their own selectionSignals before mapping, so
        // the draft only carries product-like rows (skip wrappers, header
        // utilities, brand-logo tiles). The probe already sorts by
        // representativeScore so the cap keeps the strongest candidates.
        productCard: filterScaffoldProductRows(productRows).map(productCardFromRow),
      },
    },
    contacts: contactsFromSignals(pageSignals),
    socials: socialsFromSignals(pageSignals),
    importantLinks: linksFromSignals(pageSignals, linkResolutionBase),
    languages: languagesFromSignals(pageSignals, languageSubtree),
  };
  // Pre-emit ranker-selected colour seeds. See lib/colour-pre-emit.js.
  // `logoSvgFills` drives the F3 logo-fill cross-reference; `textStyles`
  // drives the BACKLOG item 30 minority-signal gate for the cross-source
  // CTA-surface override.
  preEmitBrandColours(payload, { buttonStyles, backgroundStyles, logoSvgFills, textStyles, productRows, diagnostics });
  // Synthesise `header-background` / `footer-background` hints from
  // probe roleHint / selector evidence. See lib/region-bg-hints.js —
  // companion to preEmitBrandColours for the region channel. Mirrors
  // the canvas pre-emit posture: confidence-gated, idempotent, and
  // re-run in normalize so a re-emit closes the gap when the agent
  // drops a hint.
  synthesizeRegionBgHints(payload, backgroundStyles, diagnostics);
  synthesizeContentBgHint(payload, backgroundStyles, diagnostics); synthesizeProductCardSurfaceBgHint(payload, productRows, diagnostics); // Tier-G companions to synthesizeRegionBgHints.
  // Deterministic enrichment for productCard[0].oldPricePosition and
  // contentAlign — cross-row majority wins; null vote leaves the field.
  //
  // The aggregators MUST run on `filterScaffoldProductRows`-filtered rows
  // rather than the raw probe output. A typical ecommerce homepage emits
  // hundreds of probe rows including category tiles, banners, and promo
  // strips that are NOT actual product cards (real product cards are
  // usually only on the order of a dozen). Non-product rows often share
  // probe-row shape with product cards but have different
  // typography/layout — e.g. category tiles are commonly centre-aligned
  // banners. Without filtering, those bleed into the vote and flip the
  // answer (raw rows → "center", filtered → null; the real product
  // cards' alignment is mixed / not detectable and the agent rightly
  // stays in charge).
  const filteredProductRows = filterScaffoldProductRows(productRows);
  applyDerivedOldPricePosition(payload, filteredProductRows);
  applyDerivedContentAlign(payload, filteredProductRows);
  // Walks the decision tree from references/product-card-variants.md
  // using the now-deterministic axes (isIconLike, oldPricePosition,
  // hasInlineIcon, contentAlign) to commit `recommendedVariantIndex`
  // + a starter `recommendedVariantReason`. MUST run AFTER the two
  // aggregators above so it reads their freshly-derived values.
  // Conservative: only writes when both fields are blank — an
  // agent-authored value (manual override on edge cases the
  // deterministic tree can't reach) is preserved.
  applyDerivedVariantIndex(payload);
  return payload;
}

export function roleGaps(p) { return [["brand.organization.name", normalizeText(p?.brand?.organization?.name)], ["brand.logos", p?.brand?.logos?.length], ["brand.colors.accentColors", p?.brand?.colors?.accentColors?.length], ["brand.colors.backgroundColors", p?.brand?.colors?.backgroundColors?.length], ["brand.colors.textColors", p?.brand?.colors?.textColors?.length], ["brand.typography", p?.brand?.typography?.some((item) => item.usageHints?.length)], ["brand.components.button", p?.brand?.components?.button?.length], ["brand.components.productCard", p?.brand?.components?.productCard?.length], ["importantLinks", p?.importantLinks?.length]].filter(([, ok]) => !ok).map(([name]) => name); }

export function productCardMirrorDiagnostics(payload) {
  const output = [];
  const cards = payload?.brand?.components?.productCard;
  const topLevel = Array.isArray(payload?.brand?.typography) ? payload.brand.typography : [];
  for (const [index, card] of (Array.isArray(cards) ? cards : []).entries()) {
    for (const [field, hint] of [
      ["priceTypography", "product-price-typography"],
      ["oldPriceTypography", "product-old-price-typography"],
    ]) {
      const typography = card?.[field];
      if (!typography) continue;
      const hasFamily = Boolean(normalizeText(typography.family));
      const hasSize = numberOrNull(typography.sizePx) !== null;
      if (!hasFamily || !hasSize) {
        output.push({ index, field, severity: "weak", message: `weak product-card typography: ${field} is incomplete` });
        continue;
      }
      if (!topLevel.some((record) => normalizeUsageHints(record?.usageHints).includes(hint))) {
        output.push({ index, field, severity: "missing", message: `missing ${hint} mirror` });
      }
    }
  }
  return output;
}

// The `code` on the "no usable index" entry below. Named as a constant, and
// mirrored by `VARIANT_INDEX_ABSENT_CODE` in
// `reteno_agent/brandkit_finalize/validation.py`, which selects that entry by
// this exact string when it builds the finalize report's `gaps` record. A
// reader that matched on the message prose instead would break on the next
// reword, silently and without failing a test.
export const VARIANT_INDEX_ABSENT_CODE = "variant_index_absent";

// "An index a consumer can actually resolve", and nothing softer.
// `build_product_card_bundle.py --variant auto` accepts an integer 0..4 and
// refuses everything else, so null, undefined, 2.5 and the string "2" are one
// fact here, not four. The 0..4 bound is the size of the bundled variant
// repertoire (`references/extraction-stage.schema.json`: minimum 0, maximum
// 4), not a number picked to separate any corpus.
function isConsumableVariantIndex(value) {
  return Number.isInteger(value) && value >= 0 && value <= 4;
}

// Variant-decision diagnostic. The Phase-3 step of the SKILL commits
// `recommendedVariantIndex` + `recommendedVariantReason` into
// productCard[0]. As of `applyDerivedVariantIndex` (see
// `lib/product-card-variant-decision.js`), the scaffolder already
// commits both fields whenever the deterministic decision tree can
// walk to a definite index using the now-deterministic input axes
// (`isIconLike`, `oldPricePosition`, `hasInlineIcon`, `contentAlign`).
// So the COMMON case fires zero diagnostics: scaffolder writes,
// agent confirms.
//
// This diagnostic catches the RESIDUAL cases — productCard exists,
// scaffolder COULDN'T derive (insufficient or ambiguous signal), AND
// the agent didn't author a reason on their own. In that state the
// downstream customise pipeline falls back to its own deterministic
// scorer (so the email still renders), but the agent silently dodged
// the screenshot-confirmation step the SKILL asks for. Originally
// surfaced when the agent ran
// `cp brandkit.extraction.previous.json brandkit.extraction.json` to
// reuse a stale snapshot — bypassing the decision contract entirely.
//
// `recommendedVariantReason` is the canary because this diagnostic
// cannot grade the INDEX: a null index is legal on a card-less page and
// fatal on a page with cards, and nothing here can tell those apart. The
// reason is demanded unconditionally, so an empty one means neither the
// scaffolder nor the agent committed to anything.
//
// This comment used to justify the choice by claiming the skill licensed
// a null index whenever the evidence was ambiguous. The skill no longer
// says that, and it was never safe advice to take: nothing
// downstream absorbs a null index --
// `build_product_card_bundle.py::_resolve_variant` raises `WorkflowError`
// on `--variant auto` unless it is an int 0..4, and the onboarding run
// HALTs there for an operator-supplied `--variant`. So this diagnostic
// staying silent on a null index is a LIMIT of the check, not a licence
// to ship one; SKILL.md's variant-pick section carries the rule.
//
// THE SECOND ENTRY BELOW IS THAT LIMIT, LIFTED. It is keyed on the
// contradiction itself -- cards on the page, no usable index on card[0] --
// and never on the reason string, so an agent who writes a plausible reason
// and leaves the index null can no longer author their way out of the check.
// It is a DIAGNOSTIC, not a blocker: nothing refuses a save over it, and it
// is deliberately absent from the normalize umbrella gate's source list
// (`normalize-pass.js` `buildNormalizeAttemptDiagnostic`), so a run that
// cannot resolve a variant still ships its Brand Kit. Never-fail is absolute
// for a styling field; what changes is that the run now SAYS so, one run
// before `build_product_card_bundle.py --variant auto` raises `WorkflowError`
// and costs an operator a turn.
export function productCardVariantDecisionDiagnostics(payload) {
  const cards = Array.isArray(payload?.brand?.components?.productCard)
    ? payload.brand.components.productCard
    : [];
  const output = [];
  // Only productCard[0] feeds the variant decision the customise pipeline
  // consumes: email_template_sdk (stripo/product_modules.py) and the
  // brand-tokens compiler read productCard[0].* exclusively, and the
  // deterministic seeders (applyDerivedVariantIndex /
  // enforceDeterministicVariantIndex) only ever fill cards[0]. A SECONDARY
  // evidence card therefore can never receive a deterministic reason and is
  // structurally guaranteed to flag here, nagging the agent into a no-op
  // re-author + extra normalize pass over a recommendedVariantReason nothing
  // reads (observed on shop-example.com: the agent authored productCard[1] with an
  // empty reason, this fired severity:high, and the agent re-authored + re-
  // normalized — ~30-50s for inert data). Scope the check to the primary card.
  // If a future task type makes productCard[index>=1] consumer-facing, re-
  // broaden this — see BACKLOG.md.
  const card = cards[0];
  if (card && typeof card === "object") {
    const reason = normalizeText(card.recommendedVariantReason);
    if (!reason) {
      output.push({
        index: 0,
        severity: "high",
        message:
          "missing variant decision: productCard[0].recommendedVariantReason is empty. Re-run the Phase-3 variant decision against references/product-card-variants.md and write recommendedVariantIndex + recommendedVariantReason (and oldPricePosition / contentAlign / cta.hasInlineIcon) freshly. Do NOT reuse brandkit.extraction.previous.json via cp — that snapshot predates these fields.",
        hasIndex: card.recommendedVariantIndex !== undefined && card.recommendedVariantIndex !== null,
        hasOldPricePosition: card.oldPricePosition !== undefined && card.oldPricePosition !== null,
        hasContentAlign: card.contentAlign !== undefined && card.contentAlign !== null,
        hasInlineIconAxis:
          card.cta && typeof card.cta === "object"
            ? card.cta.hasInlineIcon !== undefined && card.cta.hasInlineIcon !== null
            : null,
      });
    }
  }
  // SECOND, INDEPENDENT ENTRY -- keyed on the contradiction, not on a string.
  // The entry above can only ever see an EMPTY REASON; this one sees the state
  // the contract is actually about: this page HAS cards and card[0] carries no
  // index a consumer can use. The two are orthogonal and both may fire on one
  // run (no reason AND no index) -- that reads correctly, because they name two
  // different missing things and each carries its own repair.
  //
  // `0..4` is not a tuned threshold: it is the size of the bundled
  // abandoned-cart variant repertoire, asserted in
  // `references/extraction-stage.schema.json` (`minimum: 0, maximum: 4`) and
  // re-asserted by `build_product_card_bundle.py::_resolve_variant`. Anything
  // outside it -- null, undefined, a float, a string "2" -- is not a value
  // `--variant auto` can resolve, so all of them are the same fact here.
  if (cards.length > 0 && !isConsumableVariantIndex(card?.recommendedVariantIndex)) {
    const cta = card && typeof card === "object" && card.cta && typeof card.cta === "object" ? card.cta : null;
    output.push({
      index: 0,
      severity: "high",
      // Machine-readable discriminator. Readers select on this, never on the
      // message prose: `brandkit_finalize` surfaces this entry in the report's
      // `gaps` channel and a prose match would break on the next reword.
      code: VARIANT_INDEX_ABSENT_CODE,
      message:
        "no usable variant index: productCard has " +
        String(cards.length) +
        " row(s) and productCard[0].recommendedVariantIndex is not an integer 0..4. The deterministic tree abstained on the axes below, so nothing upstream can supply it. Pick the closest variant from references/product-card-variants.md against the saved homepage screenshot and write recommendedVariantIndex + recommendedVariantReason. Shipping this null does not stop the Brand Kit, but it costs the downstream onboarding run an operator-supplied --variant: build_product_card_bundle.py raises WorkflowError on --variant auto.",
      cardCount: cards.length,
      // The raw value, so a reader can tell null from 7 from "2".
      recommendedVariantIndex:
        card && typeof card === "object" && card.recommendedVariantIndex !== undefined
          ? card.recommendedVariantIndex
          : null,
      // THE AXES THE TREE READS, verbatim -- this is what names WHY it could
      // not resolve. `deriveRecommendedVariantIndex` abstains on exactly these
      // five, and an entry that only said "no index" would send the agent
      // hunting for the reason the producer already knows.
      axes: {
        isIconLike: cta && cta.isIconLike !== undefined ? cta.isIconLike : null,
        hasUsableVisibleText: cta && cta.hasUsableVisibleText !== undefined ? cta.hasUsableVisibleText : null,
        hasInlineIcon: cta && cta.hasInlineIcon !== undefined ? cta.hasInlineIcon : null,
        oldPricePosition:
          card && typeof card === "object" && card.oldPricePosition !== undefined ? card.oldPricePosition : null,
        contentAlign:
          card && typeof card === "object" && card.contentAlign !== undefined ? card.contentAlign : null,
      },
    });
  }
  return output;
}


export function homepagePassDiagnostics(homepageStatus) {
  if (!homepageStatus || typeof homepageStatus !== "object") return [];
  const status = normalizeText(homepageStatus.status).toLowerCase();
  const ready = homepageStatus.readyForAssembly;
  const reports = [];
  if (status === "failed" || ready === false) {
    reports.push({
      severity: "warning",
      message: "homepage-pass did not complete readyForAssembly; rerun the packaged homepage pass once, then use focused packaged probes or run-scratch-probe.js for narrow recovery instead of inline browser reconstruction",
      status: status || null,
      readyForAssembly: ready === undefined ? null : ready,
      error: normalizeText(homepageStatus.error) || null,
    });
  } else if (status && !["completed", "blocked"].includes(status)) {
    reports.push({
      severity: "warning",
      message: "homepage-pass status is not completed; wait for the packaged pass or rerun it before final assembly",
      status,
      readyForAssembly: ready === undefined ? null : ready,
    });
  }
  return reports;
}

export function findUnsafePublicStrings(value, currentPath = "$", output = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) => findUnsafePublicStrings(item, `${currentPath}[${index}]`, output));
    return output;
  }
  if (value && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (DEBUG_KEYS.has(key)) output.push({ path: `${currentPath}.${key}`, reason: "debug field" });
      findUnsafePublicStrings(child, `${currentPath}.${key}`, output);
    }
    return output;
  }
  if (typeof value !== "string") return output;
  if (WORKER_PATH_RE.test(value)) output.push({ path: currentPath, reason: "worker-local path token" });
  if (SCRATCH_REF_RE.test(value)) output.push({ path: currentPath, reason: "scratch artifact reference" });
  return output;
}

export function loadAjv() {
  const require = createRequire(import.meta.url);
  try {
    const AjvModule = require("ajv/dist/2020.js");
    return AjvModule.default || AjvModule;
  } catch (error) {
    return null;
  }
}

// Single shared schema reader. Lazily read once per process; the schema
// doesn't change between scaffold and normalize.
//
// Schema path resolves relative to this helpers file (`scripts/lib/`) →
// `scripts/lib/../../references/extraction-stage.schema.json` →
// `references/extraction-stage.schema.json`. The pre-refactor orchestrator
// resolved from `scripts/` so the path traversal was one segment shorter
// (`scripts/../references/...`); both resolve to the same absolute file
// because the SKILL layout keeps `scripts/` and `references/` as
// siblings under `skills/brandkit-extraction-v-0/`.
let _cachedSchema = null;
export async function readExtractionStageSchema() {
  if (_cachedSchema) return _cachedSchema;
  const schemaPath = path.resolve(__dirname, "..", "..", "references", "extraction-stage.schema.json");
  _cachedSchema = JSON.parse(await fs.readFile(schemaPath, "utf8"));
  return _cachedSchema;
}

// The colour-token `value` arrays and the pattern the schema puts on them.
// The pattern is READ FROM THE SCHEMA rather than spelled here, so this note
// cannot claim a shape the validator does not enforce.
// Each array is paired with the `$defs` entry that governs it, so the note
// reads THAT def's own pattern. Reading one def's pattern for all three would
// go silent (or fire on the wrong rows) the moment the three diverge, and the
// three are separate defs precisely because they are allowed to.
const COLOUR_TOKEN_ARRAYS = [
  ["accentColors", "accentColorToken"],
  ["backgroundColors", "backgroundColorToken"],
  ["textColors", "textColorToken"],
];

// The AJV/jsonschema refusal for a colour token is `<pointer> must match
// pattern "^#[0-9a-f]{6}$"`, and for `banana` that pointer IS the repair
// instruction -- the row is named and the required shape is printed. It is NOT
// the repair instruction for every spelling the pattern refuses: a gradient, a
// fully transparent value and an alpha-carrying hex are each a different
// decision, and "must match pattern" tells the reader none of them. This note
// is appended only when a colour-token value is what failed, so the common
// refusals are unchanged.
//
// MEASURED end to end through this assembler (`--mode normalize`, one
// `backgroundColors` row per spelling): `#ABC` `#abc` `#AABBCC` `rgb()`
// `RGB()` `rgba(a>0)` `hsl()` all exit 0 and are written as `#rrggbb`;
// `rgba(r,g,b,0)` `hsla(...,0)` `transparent` `inherit` `var(...)` `banana`
// `#rgba` `#rrggbbaa` `linear-gradient(...)` all exit 1 on this pattern.
// `normalizeColor` maps the two zero-alpha forms onto the literal
// `transparent`, which is why they land here rather than as a colour.
function colourTokenValueRepairNote(schema, payload) {
  const offenders = [];
  const colors = payload?.brand?.colors;
  for (const [arrayName, defName] of COLOUR_TOKEN_ARRAYS) {
    const pattern = schema?.$defs?.[defName]?.properties?.value?.pattern;
    if (typeof pattern !== "string" || !pattern) continue;
    let re;
    try {
      re = new RegExp(pattern);
    } catch {
      continue;
    }
    const rows = colors?.[arrayName];
    if (!Array.isArray(rows)) continue;
    rows.forEach((row, index) => {
      const value = row && typeof row === "object" ? row.value : undefined;
      if (typeof value !== "string" || !re.test(value)) {
        offenders.push(`/brand/colors/${arrayName}/${index}/value`);
      }
    });
  }
  if (offenders.length === 0) return "";
  return (
    ` THE REPAIR, by spelling — every colour token must be a canonical \`#rrggbb\`, and \`normalizeColor\` has already ` +
    "canonicalised `#abc`, `rgb()`, `rgba()` with a non-zero alpha, `hsl()` and uppercase hex before this check, so a " +
    "value that reaches it is one of: a gradient (`linear-gradient(...)`) — a gradient is not a colour, and the " +
    "downstream compiler writes this value into an HTML `bgcolor` attribute and a CSS `background-color`, neither of " +
    "which renders one; pick the single stop colour the surface reads as on the screenshot, or drop the row. A fully " +
    "transparent value (`transparent`, or `rgba(r,g,b,0)` / `hsla(...,0)`, which normalise to it) — an invisible " +
    "surface is not a brand colour; drop the row rather than inventing what shows through. An alpha-carrying hex " +
    "(`#rgba` or `#rrggbbaa`) — keep the six colour digits and drop the alpha. A keyword or `var(...)` — resolve it " +
    "to the colour the page actually paints and write that. Do NOT hand-edit the artifact after normalize to get " +
    `past this; re-run \`--mode normalize\` on the corrected input. Rows: ${offenders.join(", ")}.`
  );
}

export async function validateExtractionStage(payload) {
  const schema = await readExtractionStageSchema();
  const Ajv = loadAjv();
  if (Ajv) {
    const ajv = new Ajv({ allErrors: true, strict: false });
    const validate = ajv.compile(schema);
    if (!validate(payload)) {
      const errors = (validate.errors || [])
        .map((error) => `${error.instancePath || "$"} ${error.message || ""}`.trim())
        .join("; ");
      throw new Error(
        `Extraction-stage normalize failed schema validation: ${errors}` +
          colourTokenValueRepairNote(schema, payload),
      );
    }
    return;
  }
  const python = spawnSync(
    "python3",
    [
      "-c",
      [
        "import json, sys, jsonschema",
        "data=json.load(sys.stdin)",
        "jsonschema.validate(data['payload'], data['schema'])",
      ].join(";"),
    ],
    { input: JSON.stringify({ schema, payload }), encoding: "utf8", maxBuffer: 1024 * 1024 },
  );
  if (python.status !== 0) {
    const detail = normalizeText(python.stderr || python.stdout || "jsonschema validation failed");
    throw new Error(
      `Extraction-stage normalize failed schema validation: ${detail}` +
        colourTokenValueRepairNote(schema, payload),
    );
  }
}

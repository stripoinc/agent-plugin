// Helpers for discovering and reducing logo `*.svgpath.json` sidecars
// produced by the probe stage. Used by:
//   - `synthesizeLogoSvgAccents` (A4) — to mine `brand-secondary-accent`
//     colors from the homepage logo markup at normalize time.
//   - `rankPrimaryButtonCandidates` F3 (Tier E) — to cross-reference
//     button background colors against logo fills at scaffold time.
//
// Both call sites run in the orchestrator (`assemble-extraction-stage.js`)
// and the helpers were extracted here to keep the orchestrator under its
// architectural size guard (see `test_assembler_size_guard_under_1100_lines`).

import { promises as fs } from "node:fs";
import path from "node:path";

import { extractLogoSvgFills } from "./logo-svg-accent-synthesis.js";

// Discover and parse logo `*.svgpath.json` sidecars from the technical
// directory.
//
// File-name conventions observed in real artifact dumps — three
// regex patterns cover the variants the probe stage produces:
//   - `<name>.svgpath.json`
//   - `<name>-svg-path.json`
//   - `<name>.svg-path.json`
//
// Returns parsed entries that look like a valid svgpath payload
// (`svgPath` string OR `shapes` array), each tagged with a `_basename`
// field for downstream diagnostic attribution. Missing directory or no
// matching files → `[]` (the helper is a quiet no-op).
export async function loadLogoSvgPathFiles(dir) {
  // Defensive against the full readdir failure spectrum (ENOENT,
  // EACCES, ENOTDIR, ...). The helper runs in BOTH scaffold and
  // normalize paths; scaffold runs at pre-emit time when the technical
  // dir may not be fully provisioned. Returning `[]` is the safe
  // posture for every error class — never throw out of this helper.
  //
  // BACKLOG item 7: ENOENT is the only error that's part of the
  // normal control flow (dir not yet provisioned). Anything else
  // (EACCES, ENOTDIR, EMFILE, ...) signals a misconfiguration that
  // silently drops logo data — warn to stderr so operators see it,
  // but still return [] so the pipeline does not crash.
  let entries;
  try {
    entries = await fs.readdir(dir);
  } catch (err) {
    if (err?.code !== "ENOENT") {
      console.warn("[load-logo-svg-paths] readdir failed:", dir, err.code, err.message);
    }
    return [];
  }
  const matches = entries.filter((name) =>
    /\.svgpath\.json$/i.test(name)
    || /-svg-path\.json$/i.test(name)
    || /\.svg-path\.json$/i.test(name),
  );
  const parsed = [];
  for (const name of matches) {
    const fullPath = path.join(dir, name);
    try {
      const data = JSON.parse(await fs.readFile(fullPath, "utf8"));
      if (!data || typeof data !== "object") continue;
      const hasSvgPath = typeof data.svgPath === "string" && data.svgPath.length > 0;
      const hasShapes = Array.isArray(data.shapes) && data.shapes.length > 0;
      if (!hasSvgPath && !hasShapes) continue;
      data._basename = path.basename(fullPath);
      parsed.push(data);
    } catch {
      // Skip malformed files quietly — the helper is best-effort.
    }
  }
  return parsed;
}

// Reduce parsed `*.svgpath.json` entries to a flat, deduped list of
// hex fills suitable for the F3 logo-fill cross-reference inside
// `rankPrimaryButtonCandidates`. White / black are dropped (knockout
// fills are not brand-distinctive). Returns `[]` when the input is
// empty or every fill canonicalises away.
export function logoSvgFillsFromPaths(logoSvgPaths) {
  if (!Array.isArray(logoSvgPaths) || logoSvgPaths.length === 0) return [];
  const seen = new Set();
  const out = [];
  for (const entry of logoSvgPaths) {
    let fills;
    try {
      fills = extractLogoSvgFills(entry);
    } catch {
      fills = [];
    }
    for (const hex of fills) {
      if (typeof hex !== "string") continue;
      const lower = hex.toLowerCase();
      if (lower === "#ffffff" || lower === "#000000") continue;
      if (seen.has(lower)) continue;
      seen.add(lower);
      out.push(lower);
    }
  }
  return out;
}

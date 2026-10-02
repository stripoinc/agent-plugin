#!/usr/bin/env node
import {execFileSync} from "node:child_process";
import path from "node:path";
import {pathToFileURL} from "node:url";
import {ROOT, METADATA, loadMetadata, requireVersionIncrease} from "./lib/plugin.mjs";

const RELEASE_PREFIXES = ["plugins/", "host/", "scripts/", ".agents/", ".claude-plugin/"];
const RELEASE_FILES = [METADATA, "bundle-integrity.json", "package.json", "package-lock.json"];

export function checkVersionBump(root = ROOT, base = process.env.PLUGIN_BASE_REF ?? "origin/main") {
  const git = (...args) => execFileSync("git", args, {cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"]}).trim();
  const baseCommit = git("rev-parse", "--verify", "--end-of-options", `${base}^{commit}`);
  const mergeBase = git("merge-base", baseCommit, "HEAD");
  const changed = [
    ...git("diff", "--name-only", "--no-renames", mergeBase, "--").split("\n"),
    ...git("ls-files", "--others", "--exclude-standard").split("\n"),
  ].filter(Boolean);
  if (!changed.some((file) => RELEASE_FILES.includes(file) || RELEASE_PREFIXES.some((prefix) => file.startsWith(prefix)))) {
    return "No distribution or packaging changes; no version bump required.";
  }
  // The fallback supports the first PR introducing plugin-metadata.json.
  const previousFile = [METADATA, "plugins/stripo/.claude-plugin/plugin.json"].find((file) => git("ls-tree", "--name-only", baseCommit, "--", file));
  if (!previousFile) return "First plugin release; no previous version to compare.";
  const previous = JSON.parse(git("show", `${baseCommit}:${previousFile}`)).version;
  const current = loadMetadata(root).version;
  requireVersionIncrease(previous, current);
  return `Plugin version increased: ${previous} -> ${current}.`;
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const args = process.argv.slice(2);
    if (args.length && (args.length !== 2 || args[0] !== "--base")) throw new Error("Usage: node scripts/check-version-bump.mjs [--base <git-ref>]");
    console.log(checkVersionBump(ROOT, args[1]));
  } catch (error) {
    console.error(`check-version-bump: ${error.message}`);
    process.exitCode = 1;
  }
}

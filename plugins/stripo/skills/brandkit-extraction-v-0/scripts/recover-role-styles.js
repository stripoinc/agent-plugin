#!/usr/bin/env node

import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Ajv from "ajv";

import { openPage, runActions, validateActions, writeJson } from "./lib.js";
import {
  AGENT_ROLE_RECOVERY_FILENAME,
  AGENT_ROLE_RECOVERY_REQUEST_FILENAME,
  captureBindingForTechnicalDir,
  recoveryPropertyIsAllowed,
  systemTypographyDefaultForRole,
  validateAgentRoleRecoveryArtifact,
} from "./lib/agent-role-recovery.js";

const REQUEST_SCHEMA_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
  "references",
  "agent-role-recovery.request.schema.json",
);
const validateRecoveryRequest = new Ajv({ allErrors: true, strict: false }).compile(
  JSON.parse(fsSync.readFileSync(REQUEST_SCHEMA_PATH, "utf8")),
);

function parseArgs(argv) {
  const args = { technicalDir: "", request: "", out: "", timeoutMs: 20000, pretty: false };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--technical-dir") {
      args.technicalDir = argv[++index] || "";
    } else if (token === "--request") {
      args.request = argv[++index] || "";
    } else if (token === "--out") {
      args.out = argv[++index] || "";
    } else if (token === "--timeout-ms") {
      args.timeoutMs = Math.min(60000, Math.max(1000, Number.parseInt(argv[++index] || "", 10) || 20000));
    } else if (token === "--pretty") {
      args.pretty = true;
    }
  }
  if (!args.technicalDir) throw new Error("Missing required flag: --technical-dir <path>");
  args.technicalDir = path.resolve(args.technicalDir);
  args.request = path.resolve(args.request || path.join(args.technicalDir, AGENT_ROLE_RECOVERY_REQUEST_FILENAME));
  args.out = path.resolve(args.out || path.join(args.technicalDir, AGENT_ROLE_RECOVERY_FILENAME));
  if (path.dirname(args.request) !== args.technicalDir || path.dirname(args.out) !== args.technicalDir) {
    throw new Error("Recovery request and output must be direct children of --technical-dir");
  }
  return args;
}

function compactText(value, max = 200) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, max);
}

export function validateRequest(request) {
  if (!validateRecoveryRequest(request)) {
    const detail = (validateRecoveryRequest.errors || [])
      .map((error) => `${error.instancePath || "$"} ${error.message || ""}`.trim())
      .join("; ");
    throw new Error(`Recovery request failed schema validation: ${detail}`);
  }
  const roles = new Set();
  for (const [index, entry] of request.recoveries.entries()) {
    if (roles.has(entry.role)) throw new Error(`recoveries[${index}] duplicates role ${entry.role}`);
    roles.add(entry.role);
    if (!recoveryPropertyIsAllowed(entry.role, entry.property)) {
      throw new Error(`recoveries[${index}] property ${entry.property} is incompatible with role ${entry.role}`);
    }
    if (entry.fallback && entry.property === "typography" && entry.fallback.kind !== "typography-default") {
      throw new Error(`recoveries[${index}] typography fallback must be kind typography-default`);
    }
    if (entry.fallback && entry.property !== "typography" && entry.fallback.kind !== "screenshot-color") {
      throw new Error(`recoveries[${index}] color fallback must be kind screenshot-color`);
    }
    if (
      entry.fallback?.kind === "typography-default" &&
      entry.fallback?.source?.kind === "system-default" &&
      !systemTypographyDefaultForRole(entry.role)
    ) {
      throw new Error(`recoveries[${index}] requests a system typography default for unsupported role ${entry.role}`);
    }
  }
  return request;
}

export function materializeRequestFallback(entry) {
  if (!entry?.fallback) return null;
  if (entry.fallback.kind !== "typography-default" || entry.fallback?.source?.kind !== "system-default") {
    return entry.fallback;
  }
  const value = systemTypographyDefaultForRole(entry.role);
  if (!value) throw new Error(`No system typography default exists for role ${entry.role}`);
  return { ...entry.fallback, value };
}

export function boundReplayActions(capture) {
  if (!Array.isArray(capture?.executedActions)) return [];
  const replay = capture.executedActions.map((action, index) => {
    if (!action || typeof action !== "object") {
      throw new Error(`capture.executedActions[${index}] is not an object`);
    }
    if (action.type === "wait_for_timeout" && Number.isInteger(action.ms) && action.ms >= 0) {
      return { type: action.type, ms: action.ms };
    }
    if (
      (action.type === "click" || action.type === "wait_for_selector") &&
      typeof action.matchedSelector === "string" && action.matchedSelector
    ) {
      return {
        type: action.type,
        selectors: [action.matchedSelector],
        timeoutMs: action.timeoutMs,
      };
    }
    throw new Error(`capture.executedActions[${index}] is not replayable`);
  });
  return replay.length > 0 ? validateActions(replay) : [];
}

function failure(entry, code, message) {
  const result = {
    role: entry.role,
    property: entry.property,
    locator: entry.locator,
    status: "reprobe-failed",
    failure: { code, message: compactText(message, 500) },
  };
  if (entry.fallback) result.fallback = materializeRequestFallback(entry);
  return result;
}

export async function measure(page, entry) {
  let locator;
  try {
    locator = page.locator(entry.locator.selector).nth(entry.locator.matchIndex);
    await locator.count();
  } catch (error) {
    return failure(entry, "selector-invalid", error?.message || error);
  }
  if ((await locator.count()) === 0) {
    return failure(entry, "element-missing", "The exact selector and matchIndex resolved no element.");
  }
  if (!(await locator.isVisible().catch(() => false))) {
    return failure(entry, "element-hidden", "The exact locator resolved an element that was not visible.");
  }
  const expectedText = compactText(entry.locator.expectedText || "");
  const actualText = compactText(await locator.innerText().catch(() => ""));
  if (expectedText && actualText !== expectedText) {
    return failure(entry, "text-mismatch", `Expected visible text ${JSON.stringify(expectedText)}, measured ${JSON.stringify(actualText)}.`);
  }
  try {
    if (entry.property === "hover-color" || entry.property === "hover-background-color") {
      await locator.hover();
      const transitionProperty = entry.property === "hover-color" ? "color" : "background-color";
      await locator.evaluate((element, propertyName) => new Promise((resolve) => {
        let done = false;
        const onTransitionEnd = (event) => {
          if (event.target !== element || event.propertyName !== propertyName) return;
          finish();
        };
        const finish = () => {
          if (done) return;
          done = true;
          try { element.removeEventListener("transitionend", onTransitionEnd); } catch {}
          resolve();
        };
        try { element.addEventListener("transitionend", onTransitionEnd); } catch {}
        setTimeout(finish, 800);
      }), transitionProperty).catch(() => {});
    }
    const measurement = await locator.evaluate((element) => {
      const helpers = window.__brandkitProbeHelpers || {};
      const toHex = helpers.toHex || (() => null);
      const numberOrNull = (value) => {
        const parsed = Number.parseFloat(value);
        return Number.isFinite(parsed) ? parsed : null;
      };
      const normalizeWeight = helpers.normalizeFontWeight || ((value) => numberOrNull(value));
      const style = window.getComputedStyle(element);
      return {
        pageUrl: window.location.href,
        tag: element.tagName.toLowerCase(),
        text: String(element.innerText || element.textContent || "").replace(/\s+/g, " ").trim().slice(0, 200),
        style: {
          color: toHex(style.color),
          backgroundColor: toHex(style.backgroundColor),
          borderColor: toHex(style.borderColor),
          fontFamily: style.fontFamily || null,
          fontWeight: normalizeWeight(style.fontWeight),
          fontSizePx: numberOrNull(style.fontSize),
          lineHeightPx: numberOrNull(style.lineHeight),
          letterSpacingPx: numberOrNull(style.letterSpacing),
          fontStyle: style.fontStyle || null,
          textTransform: style.textTransform || null,
        },
      };
    });
    return {
      role: entry.role,
      property: entry.property,
      locator: entry.locator,
      status: "reprobed",
      measurement,
    };
  } catch (error) {
    return failure(entry, "probe-error", error?.message || error);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const request = validateRequest(JSON.parse(await fs.readFile(args.request, "utf8")));
  const captureBinding = await captureBindingForTechnicalDir(args.technicalDir);
  const capture = JSON.parse(await fs.readFile(path.join(args.technicalDir, "capture.json"), "utf8"));
  const url = typeof capture.requestedUrl === "string" && capture.requestedUrl.trim()
    ? capture.requestedUrl.trim()
    : captureBinding.pageUrl;
  const { browser, page } = await openPage({
    url,
    waitUntil: "domcontentloaded",
    timeoutMs: args.timeoutMs,
    actionsFile: "",
  });
  try {
    const replayActions = boundReplayActions(capture);
    if (replayActions.length > 0) {
      await runActions(page, { actions: replayActions });
      await page.waitForLoadState("networkidle", { timeout: args.timeoutMs }).catch(() => {});
    }
    const recoveries = [];
    for (const entry of request.recoveries) recoveries.push(await measure(page, entry));
    const artifact = await validateAgentRoleRecoveryArtifact(
      { version: 1, producer: "recover-role-styles.js", captureBinding, recoveries },
    );
    await writeJson(
      artifact,
      args.out,
      args.pretty,
    );
  } finally {
    await browser.close().catch(() => {});
  }
}

if (path.resolve(process.argv[1] || "") === fileURLToPath(import.meta.url)) {
  await main();
}

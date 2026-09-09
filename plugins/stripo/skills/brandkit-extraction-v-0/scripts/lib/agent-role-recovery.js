import { createHash } from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import Ajv from "ajv";
import { PNG } from "pngjs";
import { productCardCtaButtonCarriersAreAnchored } from "./product-card-cta-mirrors.js";
import { productCardCtaIsReusable } from "./product-card-cta-evidence.js";

export const AGENT_ROLE_RECOVERY_FILENAME = "agent-role-recovery.json";
export const AGENT_ROLE_RECOVERY_REQUEST_FILENAME = "agent-role-recovery.request.json";
export const AGENT_RECOVERED_CONFIDENCE = 0.9;
export const SCREENSHOT_SAMPLED_CONFIDENCE = 0.55;

const ROLE_PROPERTY = new Map([
  ["brand-primary-accent", "background-color"],
  ["brand-secondary-accent", "background-color"],
  ["promo-accent", "background-color"],
  ["promo-surface-accent", "background-color"],
  ["promo-surface-background", "background-color"],
  ["canvas-background", "background-color"],
  ["content-background", "background-color"],
  ["header-background", "background-color"],
  ["footer-background", "background-color"],
  ["product-card-surface-background", "background-color"],
  ["heading-text", "color"],
  ["body-text", "color"],
  ["link", "color"],
  ["link-text", "color"],
  ["link-promo", "color"],
  ["header-link", "color"],
  ["footer-text", "color"],
  ["footer-link", "color"],
  ["button-primary-background", "background-color"],
  ["button-primary-text", "color"],
  ["button-primary-hover-background", "hover-background-color"],
  ["button-secondary-background", "background-color"],
  ["button-secondary-text", "color"],
  ["product-card-cta-background", "background-color"],
  ["product-card-cta-text", "color"],
  ["product-card-cta-hover-background", "hover-background-color"],
  ["product-card-cta-border", "border-color"],
  ["price-current", "color"],
  ["price-old", "color"],
  ["divider", "border-color"],
  ["border-subtle", "border-color"],
  ["body-typography", "typography"],
  ["heading-typography", "typography"],
  ["header-typography", "typography"],
  ["footer-typography", "typography"],
  ["button-typography", "typography"],
  ["product-name-typography", "typography"],
  ["product-price-typography", "typography"],
  ["product-old-price-typography", "typography"],
  ["product-card-cta", "typography"],
]);

// The public token channel recovery fills for each colour role. A component
// row carrying the same hint is corroborating evidence, not a substitute for
// the token consumed by downstream resolvers. The few hints accepted by more
// than one colour array have one explicit target here so application is
// deterministic.
const ROLE_COLOR_ARRAY = new Map([
  ["brand-primary-accent", "accentColors"],
  ["brand-secondary-accent", "accentColors"],
  ["promo-accent", "accentColors"],
  ["promo-surface-accent", "accentColors"],
  ["button-primary-background", "accentColors"],
  ["button-primary-hover-background", "accentColors"],
  ["button-secondary-background", "accentColors"],
  ["product-card-cta-background", "accentColors"],
  ["product-card-cta-hover-background", "accentColors"],
  ["product-card-cta-border", "accentColors"],
  ["divider", "accentColors"],
  ["border-subtle", "accentColors"],
  ["canvas-background", "backgroundColors"],
  ["content-background", "backgroundColors"],
  ["header-background", "backgroundColors"],
  ["footer-background", "backgroundColors"],
  ["product-card-surface-background", "backgroundColors"],
  ["promo-surface-background", "backgroundColors"],
  ["heading-text", "textColors"],
  ["body-text", "textColors"],
  ["link", "textColors"],
  ["link-text", "textColors"],
  ["link-promo", "textColors"],
  ["header-link", "textColors"],
  ["footer-text", "textColors"],
  ["footer-link", "textColors"],
  ["button-primary-text", "textColors"],
  ["button-secondary-text", "textColors"],
  ["product-card-cta-text", "textColors"],
  ["price-current", "textColors"],
  ["price-old", "textColors"],
]);

// Recovery may publish these roles only when productCard[0] passes the same
// reusable-evidence predicate as normalization and downstream consumers.
// LayoutIntent describes geometry and grants no trust on its own.
const PRODUCT_CARD_CTA_RECOVERY_ROLES = new Set([
  "product-card-cta",
  "product-card-cta-background",
  "product-card-cta-text",
  "product-card-cta-hover-background",
  "product-card-cta-border",
]);

function productCardCtaRecoveryIsAllowed(payload, role) {
  if (!PRODUCT_CARD_CTA_RECOVERY_ROLES.has(role)) return true;
  return productCardCtaIsReusable(payload?.brand?.components?.productCard?.[0]);
}

export function recoveryPropertyIsAllowed(role, property) {
  return ROLE_PROPERTY.get(role) === property;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.resolve(__dirname, "..", "..", "references", "agent-role-recovery.schema.json");

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

async function readRequiredBytes(filePath) {
  return fs.readFile(filePath);
}

function pngDimensions(bytes) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  if (!Buffer.isBuffer(bytes) || bytes.length < 24 || !bytes.subarray(0, 8).equals(signature)) {
    throw new Error("home.png is not a valid PNG with an IHDR header");
  }
  const width = bytes.readUInt32BE(16);
  const height = bytes.readUInt32BE(20);
  if (width <= 0 || height <= 0) throw new Error("home.png has invalid dimensions");
  return { width, height };
}

export async function captureBindingForTechnicalDir(technicalDir) {
  const capturePath = path.join(technicalDir, "capture.json");
  const screenshotPath = path.join(technicalDir, "home.png");
  const textStylesPath = path.join(technicalDir, "text-styles.json");
  const [captureBytes, screenshotBytes, textStylesBytes] = await Promise.all([
    readRequiredBytes(capturePath),
    readRequiredBytes(screenshotPath),
    fs.readFile(textStylesPath).catch((error) => {
      if (error?.code === "ENOENT") return null;
      throw error;
    }),
  ]);
  const capture = JSON.parse(captureBytes.toString("utf8"));
  const pageUrl = typeof capture?.url === "string" ? capture.url.trim() : "";
  if (!pageUrl) throw new Error("capture.json has no page URL");
  return {
    pageUrl,
    captureSha256: sha256(captureBytes),
    screenshotSha256: sha256(screenshotBytes),
    textStylesSha256: textStylesBytes ? sha256(textStylesBytes) : null,
  };
}

let validateRecovery = null;

async function schemaValidator() {
  if (validateRecovery) return validateRecovery;
  const schema = JSON.parse(await fs.readFile(SCHEMA_PATH, "utf8"));
  validateRecovery = new Ajv({ allErrors: true, strict: false }).compile(schema);
  return validateRecovery;
}

export async function validateAgentRoleRecoveryArtifact(artifact) {
  const validate = await schemaValidator();
  if (validate(artifact)) return artifact;
  const detail = (validate.errors || [])
    .map((error) => `${error.instancePath || "$"} ${error.message || ""}`.trim())
    .join("; ");
  throw new Error(`${AGENT_ROLE_RECOVERY_FILENAME} failed schema validation: ${detail}`);
}

function sameBinding(left, right) {
  return Boolean(
    left && right &&
      left.pageUrl === right.pageUrl &&
      left.captureSha256 === right.captureSha256 &&
      left.screenshotSha256 === right.screenshotSha256 &&
      left.textStylesSha256 === right.textStylesSha256,
  );
}

function diagnostic(severity, reason, message, extra = {}) {
  return { severity, reason, message, ...extra };
}

function screenshotFallbackIsBound(entry, screenshot) {
  if (entry?.fallback?.kind !== "screenshot-color" || !entry.fallback.screenshotRegion) return false;
  if (!["element-missing", "element-hidden", "probe-error"].includes(entry?.failure?.code)) return false;
  const { x, y, width, height } = entry.fallback.screenshotRegion;
  if (x + width > screenshot.width || y + height > screenshot.height) return false;
  const value = normalizeHex(entry.fallback.value);
  if (!value) return false;
  const target = [1, 3, 5].map((offset) => Number.parseInt(value.slice(offset, offset + 2), 16));
  const tolerance = 8;
  for (let py = y; py < y + height; py += 1) {
    for (let px = x; px < x + width; px += 1) {
      const offset = (py * screenshot.width + px) * 4;
      if (screenshot.data[offset + 3] < 128) continue;
      if (
        Math.abs(screenshot.data[offset] - target[0]) <= tolerance &&
        Math.abs(screenshot.data[offset + 1] - target[1]) <= tolerance &&
        Math.abs(screenshot.data[offset + 2] - target[2]) <= tolerance
      ) return true;
    }
  }
  return false;
}

const TYPOGRAPHY_DEFAULTS = Object.freeze({
  "heading-typography": { family: "Arial, sans-serif", weight: 700, sizePx: 32, lineHeightPx: 40, letterSpacingPx: null, fontStyle: "normal", textTransform: "none" },
  "body-typography": { family: "Arial, sans-serif", weight: 400, sizePx: 16, lineHeightPx: 24, letterSpacingPx: null, fontStyle: "normal", textTransform: "none" },
  "header-typography": { family: "Arial, sans-serif", weight: 400, sizePx: 14, lineHeightPx: 20, letterSpacingPx: null, fontStyle: "normal", textTransform: "none" },
  "footer-typography": { family: "Arial, sans-serif", weight: 400, sizePx: 14, lineHeightPx: 20, letterSpacingPx: null, fontStyle: "normal", textTransform: "none" },
  "button-typography": { family: "Arial, sans-serif", weight: 600, sizePx: 15, lineHeightPx: 20, letterSpacingPx: null, fontStyle: "normal", textTransform: "none" },
  "product-name-typography": { family: "Arial, sans-serif", weight: 400, sizePx: 16, lineHeightPx: 22, letterSpacingPx: null, fontStyle: "normal", textTransform: "none" },
  "product-price-typography": { family: "Arial, sans-serif", weight: 700, sizePx: 18, lineHeightPx: 24, letterSpacingPx: null, fontStyle: "normal", textTransform: "none" },
  "product-old-price-typography": { family: "Arial, sans-serif", weight: 400, sizePx: 14, lineHeightPx: 20, letterSpacingPx: null, fontStyle: "normal", textTransform: "none" },
  "product-card-cta": { family: "Arial, sans-serif", weight: 600, sizePx: 15, lineHeightPx: 20, letterSpacingPx: null, fontStyle: "normal", textTransform: "none" },
});

export function systemTypographyDefaultForRole(role) {
  const value = TYPOGRAPHY_DEFAULTS[role];
  return value ? { ...value } : null;
}

function typographyValueMatches(left, right) {
  return Boolean(
    left && right &&
      left.family === right.family &&
      sameNullable(left.weight, right.weight) &&
      sameNullable(left.sizePx, right.sizePx) &&
      sameNullable(left.lineHeightPx, right.lineHeightPx) &&
      sameNullable(left.letterSpacingPx, right.letterSpacingPx) &&
      sameNullable(left.fontStyle, right.fontStyle) &&
      sameNullable(left.textTransform, right.textTransform),
  );
}

function typographyFromCaptureRow(row) {
  if (!row || typeof row !== "object") return null;
  return {
    family: row.fontFamily,
    weight: row.fontWeight,
    sizePx: row.fontSizePx,
    lineHeightPx: row.lineHeightPx,
    letterSpacingPx: row.letterSpacingPx,
    fontStyle: row.fontStyle,
    textTransform: row.textTransform,
  };
}

function typographyFallbackIsBound(entry, textStyles) {
  if (entry?.property !== "typography" || entry?.fallback?.kind !== "typography-default") return false;
  if (!["element-missing", "element-hidden", "probe-error"].includes(entry?.failure?.code)) return false;
  const source = entry.fallback.source;
  if (source?.kind === "system-default") {
    return typographyValueMatches(entry.fallback.value, systemTypographyDefaultForRole(entry.role));
  }
  if (source?.kind !== "captured-row") return false;
  return (Array.isArray(textStyles) ? textStyles : []).some(
    (row) => row?.selector === source.selector && row?.matchIndex === source.matchIndex &&
      typographyValueMatches(entry.fallback.value, typographyFromCaptureRow(row)),
  );
}

// Recovery evidence is optional and styling-only. Missing evidence is silent;
// malformed, stale, or duplicate evidence warns and earns no authority.
export async function loadAgentRoleRecovery(technicalDir) {
  const artifactPath = path.join(technicalDir, AGENT_ROLE_RECOVERY_FILENAME);
  let artifact;
  try {
    artifact = JSON.parse(await fs.readFile(artifactPath, "utf8"));
  } catch (error) {
    if (error?.code === "ENOENT") return { byRole: new Map(), diagnostics: [] };
    return {
      byRole: new Map(),
      diagnostics: [diagnostic("warn", "recovery-unreadable", `${AGENT_ROLE_RECOVERY_FILENAME} could not be read as JSON: ${error?.message || error}`)],
    };
  }

  try {
    await validateAgentRoleRecoveryArtifact(artifact);
  } catch (error) {
    return {
      byRole: new Map(),
      diagnostics: [diagnostic("warn", "recovery-schema-invalid", error?.message || String(error))],
    };
  }

  let currentBinding;
  let screenshot;
  try {
    currentBinding = await captureBindingForTechnicalDir(technicalDir);
    const screenshotBytes = await fs.readFile(path.join(technicalDir, "home.png"));
    pngDimensions(screenshotBytes);
    screenshot = PNG.sync.read(screenshotBytes);
  } catch (error) {
    return {
      byRole: new Map(),
      diagnostics: [diagnostic("warn", "recovery-capture-unavailable", `Recovery evidence cannot be bound to this run: ${error?.message || error}`)],
    };
  }
  if (!sameBinding(artifact.captureBinding, currentBinding)) {
    return {
      byRole: new Map(),
      diagnostics: [diagnostic("warn", "recovery-capture-mismatch", `${AGENT_ROLE_RECOVERY_FILENAME} was produced for different capture or screenshot bytes and was ignored.`)],
    };
  }

  const byRole = new Map();
  const diagnostics = [];
  let textStyles = [];
  try {
    textStyles = JSON.parse(await fs.readFile(path.join(technicalDir, "text-styles.json"), "utf8"));
  } catch {
    textStyles = [];
  }
  for (const entry of artifact.recoveries) {
    if (!recoveryPropertyIsAllowed(entry.role, entry.property)) {
      diagnostics.push(diagnostic("warn", "recovery-property-incompatible", `Recovery property ${entry.property} is not the styling property for role ${entry.role}.`, { role: entry.role }));
      continue;
    }
    if (entry.status === "reprobed" && entry.measurement.pageUrl !== artifact.captureBinding.pageUrl) {
      diagnostics.push(diagnostic("warn", "recovery-page-mismatch", `Recovery measurement for ${entry.role} came from ${entry.measurement.pageUrl}, not the bound capture page ${artifact.captureBinding.pageUrl}.`, { role: entry.role }));
      continue;
    }
    if (
      entry.status === "reprobe-failed" &&
      entry.fallback &&
      !screenshotFallbackIsBound(entry, screenshot) &&
      !typographyFallbackIsBound(entry, textStyles)
    ) {
      diagnostics.push(diagnostic("warn", "recovery-fallback-unbound", `Screenshot fallback for ${entry.role} has an ineligible failure reason or a region outside home.png and was ignored.`, { role: entry.role }));
      continue;
    }
    if (byRole.has(entry.role)) {
      diagnostics.push(diagnostic("warn", "recovery-role-duplicate", `More than one recovery entry names ${entry.role}; none is authoritative for that role.`, { role: entry.role }));
      byRole.set(entry.role, null);
      continue;
    }
    byRole.set(entry.role, entry);
  }
  for (const [role, entry] of [...byRole]) {
    if (entry === null) byRole.delete(role);
  }
  return { byRole, diagnostics };
}

function normalizeHex(value) {
  const text = typeof value === "string" ? value.trim().toLowerCase() : "";
  return /^#[0-9a-f]{6}$/.test(text) ? text : null;
}

function sameNullable(left, right) {
  if (left === null || typeof left === "undefined") return right === null || typeof right === "undefined";
  return left === right;
}

function typographyMatches(row, style) {
  if (!row || !style) return false;
  const family = typeof row.family === "string" ? row.family : row.fontFamily;
  const sizePx = Number.isFinite(row.sizePx) ? row.sizePx : row.fontSizePx;
  return (
    family === style.fontFamily &&
    sameNullable(row.weight ?? row.fontWeight, style.fontWeight) &&
    sameNullable(sizePx, style.fontSizePx) &&
    sameNullable(row.lineHeightPx, style.lineHeightPx) &&
    sameNullable(row.letterSpacingPx, style.letterSpacingPx) &&
    sameNullable(row.fontStyle, style.fontStyle) &&
    sameNullable(row.textTransform, style.textTransform)
  );
}

function rowsWithHint(rows, role) {
  if (!Array.isArray(rows)) return [];
  return rows.filter((row) => Array.isArray(row?.usageHints) && row.usageHints.includes(role));
}

function colorPropertyValue(entry) {
  const style = entry?.measurement?.style;
  if (!style) return null;
  if (entry.property === "color") return normalizeHex(style.color);
  if (entry.property === "background-color") return normalizeHex(style.backgroundColor);
  if (entry.property === "border-color") return normalizeHex(style.borderColor);
  if (entry.property === "hover-color") return normalizeHex(style.color);
  if (entry.property === "hover-background-color") return normalizeHex(style.backgroundColor);
  return null;
}

const BUTTON_ROLE_FIELD = new Map([
  ["button-primary-background", "backgroundColor"],
  ["button-primary-text", "fontColor"],
  ["button-primary-hover-background", "hoverBackgroundColor"],
  ["button-secondary-background", "backgroundColor"],
  ["button-secondary-text", "fontColor"],
  ["product-card-cta-background", "backgroundColor"],
  ["product-card-cta-text", "fontColor"],
  ["product-card-cta-hover-background", "hoverBackgroundColor"],
  ["product-card-cta-border", "borderColor"],
]);

// Every public carrier must equal the recovered measurement. A matching color
// token cannot license a different component row carrying the same role.
export function recoveryEntrySupportsPublishedRole(payload, role, entry) {
  if (!entry || entry.role !== role) return false;
  if (!recoveryPropertyIsAllowed(role, entry.property)) return false;
  if (!productCardCtaRecoveryIsAllowed(payload, role)) return false;
  const colors = payload?.brand?.colors || {};
  const colorRows = [
    ...rowsWithHint(colors.accentColors, role),
    ...rowsWithHint(colors.backgroundColors, role),
    ...rowsWithHint(colors.textColors, role),
  ];
  const typographyRows = rowsWithHint(payload?.brand?.typography, role);
  const buttonRows = rowsWithHint(payload?.brand?.components?.button, role);
  const targetColorArray = ROLE_COLOR_ARRAY.get(role);
  const targetColorRows = targetColorArray
    ? rowsWithHint(colors[targetColorArray], role)
    : [];

  // Typography recovery owns only the typography carrier. In particular,
  // `product-card-cta` is also a button-component hint, but a DOM font probe
  // cannot prove that component's background, border, padding or layout. The
  // separate CTA contract continues to report a missing button mirror.
  if (entry.property === "typography") {
    if (typographyRows.length === 0) return false;
    if (entry.status === "reprobe-failed") {
      return entry.fallback?.kind === "typography-default" && typographyRows.every((row) =>
        typographyValueMatches(row, entry.fallback.value),
      );
    }
    return entry.status === "reprobed" && typographyRows.every((row) =>
      typographyMatches(row, entry.measurement?.style),
    );
  }

  // A matching component row alone is not enough: recovery must have filled
  // (or matched) the canonical colour-token channel. If duplicate same-role
  // colour/component carriers exist, every one must agree with the recovered
  // value before the role can earn a grade.
  if (targetColorRows.length === 0 || colorRows.length === 0) return false;

  if (entry.status === "reprobe-failed") {
    if (!entry.fallback) return false;
    // Screenshot sampling is deliberately color-only: a bitmap cannot prove a
    // font family/weight tuple. It also needs an actual failed exact probe,
    // enforced by the recovery schema's disjoint status shapes.
    if (entry.fallback.kind !== "screenshot-color" || typographyRows.length > 0) return false;
    const sampled = normalizeHex(entry.fallback.value);
    if (!sampled) return false;
    if (!colorRows.every((row) => normalizeHex(row.value) === sampled)) return false;
    const field = BUTTON_ROLE_FIELD.get(role);
    if (buttonRows.length > 0 && !field) return false;
    return buttonRows.every((row) => normalizeHex(row[field]) === sampled);
  }

  if (entry.status !== "reprobed" || !entry.measurement?.style) return false;
  if (typographyRows.length > 0) return false;
  if (colorRows.length > 0) {
    const measured = colorPropertyValue(entry);
    if (!measured || !colorRows.every((row) => normalizeHex(row.value) === measured)) return false;
  }
  if (buttonRows.length > 0) {
    const field = BUTTON_ROLE_FIELD.get(role);
    if (!field) return false;
    const measured = colorPropertyValue(entry);
    if (!measured || !buttonRows.every((row) => normalizeHex(row[field]) === measured)) return false;
  }
  return true;
}

export function recoveryProvenanceForRole(payload, role, recoveryEvidence) {
  const entry = recoveryEvidence?.byRole instanceof Map ? recoveryEvidence.byRole.get(role) : null;
  if (!recoveryEntrySupportsPublishedRole(payload, role, entry)) return null;
  // `product-card-cta` is the one public role shared by typography and button
  // carriers. The durable map is role-level, so a typography-only recovery
  // cannot claim the whole role while the required component mirror is absent.
  if (
    role === "product-card-cta" &&
    !productCardCtaButtonCarriersAreAnchored(payload)
  ) {
    return null;
  }
  if (entry.status === "reprobed") {
    return { provenance: "agent-recovered", confidence: AGENT_RECOVERED_CONFIDENCE };
  }
  if (entry.status === "reprobe-failed" && entry.fallback) {
    if (entry.fallback.kind === "typography-default") {
      return { provenance: "defaulted", confidence: 0.3 };
    }
    return { provenance: "screenshot-sampled", confidence: SCREENSHOT_SAMPLED_CONFIDENCE };
  }
  return null;
}

function targetCarrierIsPublished(payload, role, property) {
  if (property === "typography") {
    return rowsWithHint(payload?.brand?.typography, role).length > 0;
  }
  const arrayName = ROLE_COLOR_ARRAY.get(role);
  return Boolean(arrayName && rowsWithHint(payload?.brand?.colors?.[arrayName], role).length > 0);
}

function typographyValueFromEntry(entry) {
  if (entry.status === "reprobe-failed") return entry.fallback?.kind === "typography-default" ? entry.fallback.value : null;
  const style = entry.measurement?.style;
  if (!style) return null;
  return {
    family: style.fontFamily,
    weight: style.fontWeight,
    sizePx: style.fontSizePx,
    lineHeightPx: style.lineHeightPx,
    letterSpacingPx: style.letterSpacingPx,
    fontStyle: style.fontStyle,
    textTransform: style.textTransform,
  };
}

function colorValueFromEntry(entry) {
  if (entry.status === "reprobe-failed") return entry.fallback?.kind === "screenshot-color" ? normalizeHex(entry.fallback.value) : null;
  return colorPropertyValue(entry);
}

// Fill only a genuinely absent role. Deterministic producers have already run
// before this helper is called and remain authoritative; recovery never
// overwrites their carrier.
export function applyAgentRoleRecoveries(payload, recoveryEvidence, diagnostics = null) {
  if (!(recoveryEvidence?.byRole instanceof Map)) return payload;
  if (!(recoveryEvidence.filledRoles instanceof Set)) recoveryEvidence.filledRoles = new Set();
  for (const [role, entry] of recoveryEvidence.byRole) {
    if (!productCardCtaRecoveryIsAllowed(payload, role)) {
      recoveryEvidence.filledRoles.delete(role);
      continue;
    }
    if (targetCarrierIsPublished(payload, role, entry.property)) {
      if (recoveryEvidence.filledRoles.has(role)) {
        if (recoveryEntrySupportsPublishedRole(payload, role, entry)) {
          if (Array.isArray(diagnostics)) {
            diagnostics.push(diagnostic(
              "info",
              "recovery-role-filled",
              `Retained recovery ownership of the ${entry.property} carrier for ${role}; the current run-bound evidence still matches it exactly.`,
              { role, property: entry.property },
            ));
          }
        } else {
          // The prior marker is only a pointer to current evidence. Replacing
          // the sidecar with a different valid fallback must not leave the old
          // carrier recovery-owned for this pass (or for finalize's replay).
          recoveryEvidence.filledRoles.delete(role);
        }
      }
      continue;
    }
    if (entry.property === "typography") {
      const value = typographyValueFromEntry(entry);
      if (!value?.family) continue;
      if (!Array.isArray(payload?.brand?.typography)) continue;
      payload.brand.typography.push({
        ...value,
        usageHints: [role],
        description: "Recovered role typography",
      });
      recoveryEvidence.filledRoles.add(role);
      if (Array.isArray(diagnostics)) diagnostics.push(diagnostic("info", "recovery-role-filled", `Filled the absent typography carrier for ${role} from bounded recovery evidence; any component carrier remains a separate contract.`, { role, property: entry.property }));
      continue;
    }
    const value = colorValueFromEntry(entry);
    if (!value || !payload?.brand?.colors) continue;
    const arrayName = ROLE_COLOR_ARRAY.get(role) || "";
    if (!arrayName || !Array.isArray(payload.brand.colors[arrayName])) continue;
    payload.brand.colors[arrayName].push({ value, description: "Recovered role colour", usageHints: [role] });
    recoveryEvidence.filledRoles.add(role);
    if (Array.isArray(diagnostics)) diagnostics.push(diagnostic("info", "recovery-role-filled", `Filled the absent ${arrayName} carrier for ${role} from bounded recovery evidence; any component carrier remains a separate contract.`, { role, property: entry.property }));
  }
  return payload;
}

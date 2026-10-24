#!/usr/bin/env node

// Read-only validation for an already-authored public Brand Kit. Schema and
// intrinsic checks stay owned by brandkit_runtime; this command only combines
// their result with read-only JavaScript role and completion advisories.

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

import { emitHeaderLinkContrastDiagnostic } from "./lib/header-link-contrast-diagnostic.js";

// Compare only common opaque CSS colors. Unresolved formats have no diagnostic.
function opaqueRgb(value) {
  if (typeof value !== "string") return null;
  const hex = value.trim().match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const body = hex[1].length === 3 ? [...hex[1]].map(c => c + c).join("") : hex[1];
    return body.toLowerCase();
  }
  const rgb = value.trim().match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*1(?:\.0+)?)?\s*\)$/i);
  if (!rgb || rgb.slice(1, 4).some(c => Number(c) > 255)) return null;
  return rgb.slice(1, 4).map(c => Number(c).toString(16).padStart(2, "0")).join("");
}

// Compare declared component paint only. Transparent and valid alpha-zero
// declarations share an identity; partial alpha and unresolved paint do not.
function declaredPaintIdentity(value) {
  const opaque = opaqueRgb(value);
  if (opaque) return `opaque:${opaque}`;
  if (typeof value !== 'string') return null;
  const paint = value.trim();
  if (paint.toLowerCase() === 'transparent') return 'transparent';
  const rgba = paint.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(?:0(?:\.0+)?|\.0+)\s*\)$/i);
  if (!rgba || rgba.slice(1, 4).some(channel => Number(channel) > 255)) return null;
  return 'transparent';
}

// A unique declared default is a candidate correspondence, not proof of common
// source/state. Report both values for source review; never resolve variants.
function warnComponentColorMismatch(payload, warnings) {
  const { colors, components } = payload.brand;
  const palette = ['accentColors', 'backgroundColors', 'textColors'].flatMap(category =>
    (colors[category] || []).map((row, index) => ({row, path: `$.brand.colors.${category}[${index}].value`})));
  const compare = (hint, candidates, field) => {
    const tokens = palette.filter(({row}) => row.usageHints?.includes(hint));
    if (candidates.length !== 1 || tokens.length !== 1) return;
    const component = candidates[0];
    const actual = declaredPaintIdentity(component.row?.[field]);
    const declared = declaredPaintIdentity(tokens[0].row.value);
    if (!actual || !declared || actual === declared) return;
    warnings.push({
      severity: 'warn', code: 'component-role-mismatch', role: hint,
      paths: [tokens[0].path, `${component.path}.${field}`],
      values: [tokens[0].row.value, component.row[field]],
      message: `${hint} may disagree with the uniquely declared component's ${field}. Verify that these represent the same intended default and state, then check the source. Legitimate variants may remain; agreement alone does not prove correctness. No value is changed or backdrop inferred. A border value does not establish a visible border.`,
    });
  };
  const cards = (components.productCard || []).map((card, index) =>
    ({row: card.cta, path: `$.brand.components.productCard[${index}].cta`}));
  for (const [suffix, field] of [['background', 'backgroundColor'], ['text', 'fontColor'], ['border', 'borderColor']]) {
    compare(`product-card-cta-${suffix}`, cards, field);
  }
  for (const kind of ['primary', 'secondary']) {
    for (const [suffix, field] of [['background', 'backgroundColor'], ['text', 'fontColor']]) {
      const hint = `button-${kind}-${suffix}`;
      const buttons = (components.button || []).map((row, index) =>
        ({row, path: `$.brand.components.button[${index}]`}))
        .filter(({row}) => row.usageHints?.includes(hint));
      compare(hint, buttons, field);
    }
  }
}

// These are completion questions, not inferred sources, mandatory coverage or repairs.
function completionQuestions(payload, warnings) {
  const brand = payload.brand;
  const roles = new Set((brand.typography || []).flatMap(row => row.usageHints || []));
  const missing = ['body-typography', 'heading-typography', 'header-typography', 'footer-typography'].filter(role => !roles.has(role));
  if (missing.length) warnings.push({severity: 'warn', code: 'coverage-question', path: '$.brand.typography',
    message: `No tuple is assigned to ${missing.join(', ')}. Check applicable roles against already collected evidence; choose a representative owner or report the gap. Absence alone does not establish that this site has that role, and no default is supplied.`});
  const groups = new Map();
  for (const category of ['accentColors', 'backgroundColors', 'textColors']) {
    for (const [index, row] of (brand.colors?.[category] || []).entries()) {
      for (const hint of row.usageHints || []) {
        const key = hint;
        const entries = groups.get(key) || [];entries.push({path: `$.brand.colors.${category}[${index}].value`, value: opaqueRgb(row.value), raw: row.value});groups.set(key, entries);
      }
    }
  }
  for (const [key, entries] of groups) {
    // Preserve unresolved paint as a representation, never composite it onto
    // an invented backdrop. Multiple representations still need a default decision.
    const represented = entries.filter(row => typeof row.raw === 'string' && row.raw.trim());
    const identity = row => row.value ? `opaque:${row.value}` : `unresolved:${row.raw.trim().toLowerCase()}`;
    if (new Set(represented.map(identity)).size < 2) continue;
    warnings.push({severity: 'warn', code: 'role-ambiguity', paths: represented.map(row => row.path),
      message: `${key} has different color representations (${represented.map(row => row.raw).join(', ')}). Unresolved or transparent paint is not composited or treated as opaque. The schema does not identify their state/component correspondence. Check the intended default; valid distinct variants may remain. No color is selected or replaced.`});
  }
  for (const [index, product] of (brand.products || []).entries()) {
    if (product.name && product.url && !product.imageUrl) warnings.push({
      severity: 'warn', code: 'selected-product-image-gap', path: `$.brand.products[${index}].imageUrl`,
      message: 'This selected product has no image URL. Check whether a later same-product observation contains a loaded image; otherwise use a focused current-state observation or report the gap. Do not invent a URL or use an unrelated newer product/variant.',
    });
  }
  if (!['emails', 'phones', 'addresses'].some(key => payload.contacts?.[key]?.length)) warnings.push({
    severity: 'warn', code: 'contact-coverage-question', path: '$.contacts',
    message: 'No contact details are established. If needed for the intended use, verify an existing contact lead with a bounded permitted observation or explicitly defer it. Hidden text is a lead, not verified public contact data; empty arrays do not establish absence.',
  });
  for (const [index, card] of (brand.components?.productCard || []).entries()) {
    if (card.recommendedVariantIndex != null && card.recommendedVariantIndex !== 2 && !(card.cta?.text || '').trim()) {
      warnings.push({severity: 'warn', code: 'consumer-label-gap', path: `$.brand.components.productCard[${index}].cta.text`,
        message: 'The recommended text-bearing module has no encoded label. A reason string does not supply consumer text. Encode an intentional adaptation in the existing CTA fields with its inferred source, or leave the recommendation unresolved; do not copy an unrelated source action.'});
    }
  }
}

const PYTHON_VALIDATOR = String.raw`
import json
from pathlib import Path
import sys

sys.dont_write_bytecode = True
sys.path.insert(0, sys.argv[3])

try:
    from brandkit_runtime.validation import validate_brandkit_file
    warnings = []
    validate_brandkit_file(Path(sys.argv[1]), Path(sys.argv[2]), semantic_warnings_out=warnings)
except Exception as exc:
    error = {"type": exc.__class__.__name__, "message": getattr(exc, "message", str(exc))}
    location = list(getattr(exc, "absolute_path", ()))
    if location:
        error["path"] = "$." + ".".join(map(str, location))
    print(json.dumps({
        "valid": False,
        "error": error,
    }))
    raise SystemExit(1)

print(json.dumps({"valid": True, "warnings": warnings}))
`;

function usage() {
  return "Usage: node validate-brandkit.js --input <brandkit.json> [--python <python>]";
}

function parseArgs(argv) {
  const parsed = { input: null, python: process.env.BRANDKIT_PYTHON || "python3" };
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--help" || arg === "-h") return { help: true };
    if (arg === "--input" || arg === "--python") {
      if (index + 1 >= argv.length) throw new Error(`${arg} requires a value`);
      parsed[arg.slice(2)] = argv[index + 1];
      index += 1;
      continue;
    }
    throw new Error(`unknown argument: ${arg}`);
  }
  if (!parsed.input) throw new Error("--input is required");
  return parsed;
}

function runtimePaths(scriptDir) {
  const installedSkillRoot = path.dirname(scriptDir);
  if (fs.existsSync(path.join(installedSkillRoot, "references", "schema.json"))) {
    return {
      schema: path.join(installedSkillRoot, "references", "schema.json"),
      runtime: path.resolve(scriptDir, "../../../packages/brandkit-runtime"),
    };
  }
  const repositoryRoot = path.resolve(scriptDir, "../../..");
  return {
    schema: path.join(repositoryRoot, "skills", "business-profile", "references", "schema.json"),
    runtime: path.join(repositoryRoot, "src", "skill-scripts", "shared"),
  };
}

function printResult(value, status = 0) {
  process.stdout.write(`${JSON.stringify(value)}\n`);
  process.exitCode = status;
}

let args;
try {
  args = parseArgs(process.argv.slice(2));
} catch (error) {
  printResult({ valid: false, error: { type: "UsageError", message: `${error.message}. ${usage()}` } }, 64);
}

if (args?.help) {
  process.stdout.write(`${usage()}\n`);
} else if (args) {
  const input = path.resolve(args.input);
  let payload;
  try {
    payload = JSON.parse(fs.readFileSync(input, "utf8"));
  } catch (error) {
    printResult({ valid: false, error: { type: error.name, message: error.message } }, 1);
  }

  if (payload !== undefined) {
    const scriptDir = path.dirname(fileURLToPath(import.meta.url));
    const { schema, runtime } = runtimePaths(scriptDir);
    const checked = spawnSync(args.python, ["-c", PYTHON_VALIDATOR, input, schema, runtime], {
      encoding: "utf8",
      maxBuffer: 16 * 1024 * 1024,
    });
    if (checked.error) {
      printResult({ valid: false, error: { type: checked.error.name, message: checked.error.message } }, 1);
    } else {
      let result;
      try {
        result = JSON.parse(checked.stdout);
      } catch {
        const message = checked.stderr.trim() || checked.stdout.trim() || "Python validator returned no JSON";
        result = { valid: false, error: { type: "ValidationRuntimeError", message } };
      }
      if (checked.status !== 0 || result.valid !== true) {
        printResult(result, checked.status || 1);
      } else {
        const warnings = result.warnings.map((message) => ({ severity: "warn", message }));
        emitHeaderLinkContrastDiagnostic(payload, warnings);
        warnComponentColorMismatch(payload, warnings);
        completionQuestions(payload, warnings);
        printResult({ valid: true, warnings });
      }
    }
  }
}

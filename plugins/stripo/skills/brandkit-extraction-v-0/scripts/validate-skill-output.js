#!/usr/bin/env node

// Single-source-of-truth validator for the final brandkit.json. Hosts (this
// repo's runtime, reteno-agent's publisher-runtime, future hosts) call this
// after the agent finishes both extraction and tone-of-voice phases. It
// orchestrates every JS validator module under `lib/` and reports a structured
// result.
//
// Output JSON shape:
//   {
//     "valid": boolean,           // false iff errors.length > 0 || blockers.length > 0
//     "errors":   string[],       // schema + semantic + unsafe-public-strings — fatal
//     "blockers": string[],       // technical-artifact + required-with-evidence
//                                 // + role-coverage provenance re-check — fatal
//     "warnings": string[]        // content + technical-artifact advisories — non-fatal
//   }
//
// Exit codes: 0 if valid; 1 if errors or blockers present.

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

import { findFirstUnsafePublicString } from "./lib/unsafe-public-strings.js";
import { validateBrandkitSemantics } from "./lib/semantic-validators.js";
import { decodeUtf8Strict, detectTechnicalArtifactBlockers } from "./lib/technical-artifact-blockers.js";
import { validateBrandkitAgainstTechnicalArtifacts } from "./lib/technical-artifact-warnings.js";
import {
  detectBrandkitContentBlockers,
  validateBrandkitContent,
} from "./lib/content-validators.js";
import {
  ROLE_COVERAGE_RECHECK_FAILED_PREFIX,
  roleCoverageRecheckFindings,
} from "./lib/role-coverage-recheck.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseArgs(argv) {
  const args = {
    input: null,
    technicalDir: null,
    targetUrl: null,
    observedAssetUrls: null,
    logoEvidencePacket: null,
    runtimeAssetBindings: null,
    pretty: false,
    skipSchema: false,
  };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--input") {
      args.input = argv[index + 1] ?? null;
      index += 1;
    } else if (token === "--technical-dir") {
      args.technicalDir = argv[index + 1] ?? null;
      index += 1;
    } else if (token === "--target-url") {
      args.targetUrl = argv[index + 1] ?? null;
      index += 1;
    } else if (token === "--observed-asset-urls") {
      args.observedAssetUrls = argv[index + 1] ?? null;
      index += 1;
    } else if (token === "--logo-evidence-packet") {
      args.logoEvidencePacket = argv[index + 1] ?? null;
      index += 1;
    } else if (token === "--runtime-asset-bindings") {
      args.runtimeAssetBindings = argv[index + 1] ?? null;
      index += 1;
    } else if (token === "--pretty") {
      args.pretty = true;
    } else if (token === "--skip-schema") {
      args.skipSchema = true;
    }
  }
  if (!args.input) {
    throw new Error("Missing required flag: --input <path-to-brandkit.json>");
  }
  return args;
}

function tryLoadAjv() {
  try {
    const require = createRequire(import.meta.url);
    const AjvModule = require("ajv/dist/2020.js");
    return AjvModule.default || AjvModule;
  } catch {
    return null;
  }
}

async function runSchemaValidation(payload) {
  const Ajv = tryLoadAjv();
  if (Ajv === null) {
    return {
      available: false,
      valid: true,
      errors: [],
      note: "ajv not installed; schema validation skipped",
    };
  }
  const schemaPath = path.resolve(__dirname, "..", "references", "schema.json");
  // Strict decode (see decodeUtf8Strict): a lossily decoded schema would
  // silently validate against a DIFFERENT contract than the one on disk.
  const schemaText = decodeUtf8Strict(await fs.readFile(schemaPath));
  const schema = JSON.parse(schemaText);
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const valid = validate(payload);
  return {
    available: true,
    valid: Boolean(valid),
    errors: (validate.errors || []).map(
      (error) => `Schema violation at ${error.instancePath || "$"}: ${error.message || ""}`,
    ),
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const inputPath = path.resolve(args.input);
  // Strict decode, and the throw is deliberately NOT caught: the brandkit
  // under validation is the gate's primary input, so invalid UTF-8 in it must
  // abort with no result on stdout (routing the CLI to the strict Python
  // gate) rather than validate a U+FFFD-substituted document that differs
  // from the bytes about to be promoted.
  const inputText = decodeUtf8Strict(await fs.readFile(inputPath));
  const brandkit = JSON.parse(inputText);

  const errors = [];
  const blockers = [];
  const warnings = [];

  // 1. Schema (best-effort: skipped if ajv isn't installed).
  if (!args.skipSchema) {
    try {
      const schemaResult = await runSchemaValidation(brandkit);
      if (schemaResult.available && !schemaResult.valid) {
        errors.push(...schemaResult.errors);
      }
    } catch (error) {
      errors.push(`Schema validator failed: ${error.message || String(error)}`);
    }
  }

  // 2. Unsafe public strings — runs first so we surface security issues
  //    before any other semantic check (matches Python order in
  //    validate_brandkit_semantics).
  const unsafe = findFirstUnsafePublicString(brandkit);
  if (unsafe) {
    errors.push(unsafe.message);
  }

  // 3. Semantic validators (mirror contract, layoutIntent coherence,
  //    canonical usage hints, product-card CTA contract advisories).
  try {
    const sem = validateBrandkitSemantics(brandkit);
    errors.push(...sem.errors);
    warnings.push(...sem.warnings);
  } catch (error) {
    // validateBrandkitSemantics throws on unsafe-public-string violation; we
    // already captured that above via findFirstUnsafePublicString, so swallow.
    if (!unsafe) {
      errors.push(`Semantic validator threw: ${error.message || String(error)}`);
    }
  }

  // 4. Content URL safety (target_url + allowed-domain checks).
  let runtimeAssetBindings = null;
  let logoEvidencePacket = null;
  if (args.targetUrl) {
    let observedAssetUrls = null;
    if (args.observedAssetUrls) {
      try {
        observedAssetUrls = new Set(JSON.parse(args.observedAssetUrls));
      } catch {
        observedAssetUrls = null;
      }
    }
    if (args.runtimeAssetBindings) {
      try {
        runtimeAssetBindings = JSON.parse(args.runtimeAssetBindings);
      } catch {
        runtimeAssetBindings = null;
      }
    }
    if (args.logoEvidencePacket) {
      try {
        logoEvidencePacket = JSON.parse(args.logoEvidencePacket);
      } catch {
        logoEvidencePacket = null;
      }
    }
    const contentWarnings = validateBrandkitContent({
      brandkit,
      targetUrl: args.targetUrl,
      observedAssetUrls,
      runtimeAssetBindings,
      logoEvidencePacket,
    });
    warnings.push(...contentWarnings);
  }

  // 5. Technical-artifact blockers + warnings (require a technical_dir).
  if (args.technicalDir) {
    const technicalDir = path.resolve(args.technicalDir);
    // detectTechnicalArtifactBlockers throws TechnicalArtifactUnreadableError
    // when an artifact the GATE decides on is corrupt (readGateJson). That
    // throw MUST propagate — do NOT wrap it into `errors`: the finalize CLI
    // downgrades JS `errors` to warnings during the port transition, so an
    // entry there would exit 0 on unreadable gate input. Aborting with no
    // result on stdout is what makes the CLI fall back to the strict Python
    // gate, which raises and lands on exit 1 with the file named in
    // finalize-report.json. The top-level catch prints that message.
    const techBlockers = detectTechnicalArtifactBlockers(brandkit, technicalDir);
    blockers.push(...techBlockers);
    blockers.push(
      ...detectBrandkitContentBlockers({
        brandkit,
        technicalDir,
        targetUrl: args.targetUrl || "",
        runtimeAssetBindings,
        logoEvidencePacket,
      }),
    );
    const techWarnings = validateBrandkitAgainstTechnicalArtifacts(brandkit, technicalDir);
    warnings.push(...techWarnings);

    // 6. Role-coverage provenance re-check. Judges `brandkit.extraction.json`
    //    AS IT STANDS ON DISK, not as some earlier `--mode normalize` left it —
    //    every other gate here reads the composed brandkit or a past pass's
    //    record. See lib/role-coverage-recheck.js: it is a no-op on any
    //    technical dir without the normalize-written marker, and it never
    //    blocks on a missing role.
    //
    //    IT NOW RETURNS TWO CHANNELS, and only one of them stops the run. Every
    //    provenance finding is a styling finding, so it lands in `warnings`;
    //    the sole blocker is the stale-artifact pair, which is artifact
    //    tampering rather than a styling judgement. The two must be pushed
    //    separately: routing the warnings into `blockers` would restore the
    //    refusal, and routing the blocker into `warnings` would let a
    //    hand-edited diagnostics file promote.
    //
    //    The catch converts a failure into a BLOCKER rather than letting it
    //    propagate. An uncaught throw here would abort with no result on
    //    stdout; `_run_js_skill_validators` reads that as "subprocess failed",
    //    falls back to the Python validators — which have no twin for this
    //    check — and the run promotes. "We could not check" would then be
    //    indistinguishable from "we checked and it was fine", which is the
    //    exact failure this module exists to remove.
    try {
      // Finalization already composed the staged payload before this validator
      // runs. Provenance reconciliation belongs to the explicit pre-compose
      // helper; a mismatch discovered only here cannot be safely repaired
      // without leaving brandkit.json/brandkit.html inconsistent.
      const recheck = await roleCoverageRecheckFindings(technicalDir, { repairProvenance: false });
      blockers.push(...recheck.blockers);
      warnings.push(...recheck.warnings);
    } catch (error) {
      // STILL A BLOCKER, DELIBERATELY, and this is the one place the plan was
      // overruled. It proposed narrowing this to a warning wherever the throw
      // came from an input that only feeds the styling predicates. But the only
      // throw this module raises is the missing/non-object
      // `brandkit.extraction.json` case, and every other throw reaching here is
      // an I/O or parse failure on a gate input. Both are "we could not check",
      // and this catch also swallows the path that would otherwise report
      // `ROLE_COVERAGE_STALE_ARTIFACT_BLOCKER` -- so a warning here would open a
      // hole under the one finding the split keeps fatal.
      blockers.push(`${ROLE_COVERAGE_RECHECK_FAILED_PREFIX}: ${error.message || String(error)}`);
    }
  }

  const valid = errors.length === 0 && blockers.length === 0;
  const result = { valid, errors, blockers, warnings };
  process.stdout.write(`${JSON.stringify(result, null, args.pretty ? 2 : 0)}\n`);
  if (!valid) {
    process.exitCode = 1;
  }
}

main().catch((error) => {
  process.stderr.write(`${error.message || String(error)}\n`);
  process.exitCode = 1;
});

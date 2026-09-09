#!/usr/bin/env node

import path from "node:path";

import { roleCoverageRecheckFindings } from "./lib/role-coverage-recheck.js";

const argv = process.argv.slice(2);
const flagIndex = argv.indexOf("--technical-dir");
const technicalDir = flagIndex >= 0 ? argv[flagIndex + 1] : "";
if (!technicalDir) throw new Error("Missing required flag: --technical-dir <path>");

const result = await roleCoverageRecheckFindings(path.resolve(technicalDir), {
  repairProvenance: true,
});
process.stdout.write(`${JSON.stringify(result)}\n`);
if (result.blockers.length > 0) process.exitCode = 1;

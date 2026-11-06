import {
  collectSocialDocumentIssues
} from "./social-f4a8e0da8c68.js";
import {
  LINE_HEIGHT_HINT,
  resolveJsonPointer
} from "./errors-3ee69a7e1eb0.js";

// convo-email-agent/src/sdk/editor-validator.ts
import {
  validateDocumentState
} from "./editor-validator/index.mjs";
var ROOT_PATH = "<root>";
function dotPath(segments) {
  return segments.length === 0 ? ROOT_PATH : segments.map(String).join(".");
}
function pointerToPath(pointer) {
  const segments = pointer.split("/").slice(1).map((segment) => segment.replace(/~1/gu, "/").replace(/~0/gu, "~"));
  return dotPath(segments);
}
function quoteAll(values) {
  return values.map((value) => JSON.stringify(value)).join(", ");
}
var DISCRIMINATOR_MESSAGE = /^Invalid discriminator value\. Expected (.+)$/u;
var TYPE_MESSAGE = /^Invalid input: expected (.+?), received (.+)$/u;
var LINE_HEIGHT_PATH = /^settings\.(?:stripes|headings\.h[1-6])\.lineHeight(?:\.(?:desktop|mobile))?$/u;
function formatIssue(issue) {
  const formatted = formatNativeIssue(issue);
  const missing = issue.code === "invalid_type" && TYPE_MESSAGE.exec(issue.message)?.[2] === "undefined";
  if (missing || issue.code === "unrecognized_keys" || !LINE_HEIGHT_PATH.test(dotPath(issue.path))) return formatted;
  return formatted.map((entry) => ({ ...entry, message: "".concat(entry.message, " ").concat(LINE_HEIGHT_HINT) }));
}
function formatNativeIssue(issue) {
  const path = dotPath(issue.path);
  if (issue.code === "unrecognized_keys" && issue.keys && issue.keys.length > 0) {
    return issue.keys.map((key) => ({ path, code: issue.code, message: "unsupported property ".concat(JSON.stringify(key)) }));
  }
  if (issue.code === "invalid_type") {
    const match = TYPE_MESSAGE.exec(issue.message);
    if (match?.[2] === "undefined" && issue.path.length > 0) {
      const property = String(issue.path[issue.path.length - 1]);
      return [{
        path: dotPath(issue.path.slice(0, -1)),
        code: issue.code,
        message: "missing required property ".concat(JSON.stringify(property))
      }];
    }
    return [{ path, code: issue.code, message: match ? "expected ".concat(match[1], ", received ").concat(match[2]) : issue.message }];
  }
  if (issue.code === "invalid_union") {
    const discriminator = DISCRIMINATOR_MESSAGE.exec(issue.message);
    if (discriminator) {
      const allowed = discriminator[1].split("|").map((value) => value.trim().replace(/^'(.*)'$/u, "$1"));
      return [{ path, code: issue.code, message: "must be one of ".concat(quoteAll(allowed)) }];
    }
    let candidates = issue.branches ?? [];
    for (const property of ["type", "mode"]) {
      const mismatches = candidates.map((branch) => branch.find((nested) => nested.code === "invalid_value" && nested.path.length === 1 && nested.path[0] === property && nested.values && nested.values.length > 0));
      if (mismatches.length > 0 && mismatches.every(Boolean)) {
        const allowed = [...new Set(mismatches.flatMap((mismatch) => mismatch?.values ?? []))];
        return [{
          path: dotPath([...issue.path, property]),
          code: "invalid_value",
          message: "must be one of ".concat(quoteAll(allowed))
        }];
      }
      candidates = candidates.filter((_, index) => !mismatches[index]);
    }
    const branches = candidates.map((branch) => branch.flatMap((nested) => formatIssue({ ...nested, path: [...issue.path, ...nested.path] })));
    const closest = branches.filter((branch) => branch.length > 0).sort((left, right) => left.length - right.length)[0];
    if (closest) return closest;
    return [{ path, code: issue.code, message: issue.message }];
  }
  if (issue.code === "invalid_value" && issue.values && issue.values.length > 0) {
    return [{ path, code: issue.code, message: "must be one of ".concat(quoteAll(issue.values)) }];
  }
  return [{ path, code: issue.code, message: issue.message }];
}
var LINE_HEIGHT_GROUPS = ["stripes", ...[1, 2, 3, 4, 5, 6].map((level) => "headings/h".concat(level))];
function lineHeightPrecisionIssues(model, current) {
  const issues = [];
  for (const group of LINE_HEIGHT_GROUPS) {
    for (const platform of ["desktop", "mobile"]) {
      const instancePath = "/settings/".concat(group, "/lineHeight/").concat(platform);
      const value = resolveJsonPointer(model, instancePath);
      if (typeof value !== "number" || !Number.isFinite(value) || Math.round(value * 100) / 100 === value) continue;
      if (current !== void 0 && resolveJsonPointer(current, instancePath) === value) continue;
      issues.push({ instancePath, message: "".concat(value, " is stored as a whole percentage and would read back as ").concat(Math.round(value * 100) / 100, ". ").concat(LINE_HEIGHT_HINT) });
    }
  }
  return issues;
}
function validateEmailDocument(model, options = {}) {
  const result = validateDocumentState(model, options.current);
  const issues = result.issues.flatMap(formatIssue);
  const reported = new Set(issues.map((issue) => issue.path));
  for (const rule of [...collectSocialDocumentIssues(model), ...lineHeightPrecisionIssues(model, options.current)]) {
    const path = pointerToPath(rule.instancePath);
    if (reported.has(path)) continue;
    reported.add(path);
    issues.push({ path, code: "editor_rule", message: rule.message });
  }
  return issues;
}

export {
  ROOT_PATH,
  validateEmailDocument
};

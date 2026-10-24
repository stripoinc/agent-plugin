// Mirror of `_raise_on_unsafe_public_strings` and its helpers in
// `reteno_agent/brandkit_finalize/validation.py`. Keep the regex sources, the
// PUBLIC_DEBUG_FIELD_NAMES set, and the recursive scan order in lockstep with
// the Python implementation; both sides share the same parity oracle in
// tests/test_skill_probe_contracts.py.

export const URL_PATTERN = /https?:\/\/[^\s"')]+/gi;

export const WORKER_LOCAL_PUBLIC_PATH_TOKEN_RE =
  /(^|[\s"'(<\[{:=,;>])(?:file:\/\/)?\/(?:app\/artifacts|etc\/codex|workspace|output|home\/codex)(?=$|[\/\\\s"'`)\]}>:,;])/i;

export const SCRATCH_PUBLIC_ARTIFACT_TOKEN_RE =
  /(^|[\s"'(<\[{:=,;>])(?:\.\/)?scratch\/[^\s"'`)\]}>:,;]*/i;

export const PUBLIC_DEBUG_FIELD_NAMES = new Set([
  "selector",
  "selectors",
  "localPath",
  "local_path",
  "path",
  "paths",
  "debug",
  "trace",
  "screenshot",
  "screenshots",
  "scratchPath",
  "scratch_path",
  "domId",
  "dom_id",
  "className",
  "classList",
  "coordinates",
]);

function decodeForPathScan(value) {
  let decoded = String(value).replaceAll("\\", "/");
  for (let i = 0; i < 3; i += 1) {
    let next;
    try {
      next = decodeURIComponent(decoded).replaceAll("\\", "/");
    } catch {
      // Malformed percent-encoding: stop iterating, keep the last clean decode.
      break;
    }
    if (next === decoded) break;
    decoded = next;
  }
  return decoded;
}

export function containsWorkerLocalPublicPath(value) {
  if (typeof value !== "string") return false;
  const decoded = decodeForPathScan(value);
  const scanText = decoded.replace(URL_PATTERN, " ");
  return WORKER_LOCAL_PUBLIC_PATH_TOKEN_RE.test(scanText);
}

export function containsPublicScratchArtifactRef(value) {
  if (typeof value !== "string") return false;
  const decoded = decodeForPathScan(value);
  const scanText = decoded.replace(URL_PATTERN, " ");
  return SCRATCH_PUBLIC_ARTIFACT_TOKEN_RE.test(scanText);
}

// Returns the first violation as `{kind, path, message}`, or `null` if clean.
// Mirrors Python `_raise_on_unsafe_public_strings` semantics: short-circuits on
// the first match; recurses into arrays and objects; rejects keys whose names
// are listed in PUBLIC_DEBUG_FIELD_NAMES.
export function findFirstUnsafePublicString(value, options = {}) {
  const path = options.path ?? "$";
  if (typeof value === "string") {
    if (containsWorkerLocalPublicPath(value)) {
      return { kind: "worker_local_path", path, message: `Unsafe worker-local path at ${path}` };
    }
    if (containsPublicScratchArtifactRef(value)) {
      return { kind: "scratch_artifact_ref", path, message: `Unsafe scratch artifact reference at ${path}` };
    }
    return null;
  }
  if (Array.isArray(value)) {
    for (let index = 0; index < value.length; index += 1) {
      const found = findFirstUnsafePublicString(value[index], { path: `${path}[${index}]` });
      if (found) return found;
    }
    return null;
  }
  if (value !== null && typeof value === "object") {
    for (const [key, child] of Object.entries(value)) {
      if (PUBLIC_DEBUG_FIELD_NAMES.has(key)) {
        return { kind: "debug_field", path: `${path}.${key}`, message: `Unsafe debug field at ${path}.${key}` };
      }
      const found = findFirstUnsafePublicString(child, { path: `${path}.${key}` });
      if (found) return found;
    }
  }
  return null;
}

// Throws an Error if the payload contains any unsafe public string. The thrown
// error carries `code` (the violation kind) and `path` (where it was found) so
// callers can produce structured diagnostics.
export function assertNoUnsafePublicStrings(value, options = {}) {
  const found = findFirstUnsafePublicString(value, options);
  if (found) {
    const error = new Error(found.message);
    error.code = found.kind;
    error.path = found.path;
    throw error;
  }
}

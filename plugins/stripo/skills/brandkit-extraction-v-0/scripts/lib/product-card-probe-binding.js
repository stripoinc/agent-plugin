// Run binding for technical product-card CTA endorsements.
//
// The public extraction deliberately does not expose selectionSignals. A CTA
// can therefore be correlated to a technical row only by its public signature,
// which is insufficient when a stale row has the same signature. Scaffold
// records this digest in a private sidecar and normalize recomputes it from the
// current filtered technical rows before it allows signature endorsement.

import { createHash } from "node:crypto";
import { filterScaffoldProductRows } from "./product-row-filter.js";

export const PRODUCT_CARD_PROBE_BINDING_FILENAME = "product-card-probe-binding.json";
export const PRODUCT_CARD_PROBE_BINDING_VERSION = 1;
const DIGEST_ALGORITHM = "sha256";

function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (!value || typeof value !== "object") return value;
  const output = {};
  for (const key of Object.keys(value).sort()) {
    const child = value[key];
    if (child === undefined || typeof child === "function" || typeof child === "symbol") continue;
    output[key] = canonicalize(child);
  }
  return output;
}

export function canonicalFilteredProductRows(productRows) {
  // Row order is not identity. Sort canonical row encodings so a harmless
  // technical-array reorder has the same digest while multiplicity and every
  // row field remain bound.
  return filterScaffoldProductRows(productRows)
    .map((row) => JSON.stringify(canonicalize(row)))
    .sort();
}

function digestCanonicalRows(serializedRows) {
  return createHash(DIGEST_ALGORITHM)
    .update(JSON.stringify(serializedRows), "utf8")
    .digest("hex");
}

export function buildProductCardProbeBinding(productRows) {
  const rows = canonicalFilteredProductRows(productRows);
  return {
    version: PRODUCT_CARD_PROBE_BINDING_VERSION,
    algorithm: DIGEST_ALGORITHM,
    filteredRowCount: rows.length,
    digest: digestCanonicalRows(rows),
  };
}

export function productCardProbeBindingMatches(binding, productRows) {
  if (!binding || typeof binding !== "object" || Array.isArray(binding)) return false;
  if (binding.version !== PRODUCT_CARD_PROBE_BINDING_VERSION) return false;
  if (binding.algorithm !== DIGEST_ALGORITHM) return false;
  const rows = canonicalFilteredProductRows(productRows);
  if (binding.filteredRowCount !== rows.length) return false;
  return binding.digest === digestCanonicalRows(rows);
}

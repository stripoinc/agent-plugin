// Read the canonical usageHint enum lists straight from the schema. The
// agent SKILL.md prohibits inspecting `references/*.schema.json` with
// `jq`/`cat`/`grep` during normal extraction; this surface lets the
// assembler surface the same enum data inside `assembly-diagnostics.json`
// so the agent can read it without violating the prohibition. The keys
// mirror the schema's $defs names verbatim so changes there flow through
// unchanged.
//
// The schema shape we resolve is:
//   "<list>UsageHintList": {
//     "allOf": [
//       { "$ref": "#/$defs/usageHintList" },     // (shared shape: array, min, unique)
//       { "items": { "$ref": "#/$defs/<list>UsageHint" } }  // (item enum)
//     ]
//   }
// The item enum lives one level deeper in `<list>UsageHint.enum`.

function pickEnum(defs, key, listDef) {
  if (!listDef || typeof listDef !== "object") return [];
  // Some schema authors flatten the shape; handle the direct case first.
  const direct = Array.isArray(listDef.items?.enum) ? listDef.items.enum : null;
  if (direct) {
    if (direct.length === 0) {
      // Empty enum at the direct shape means a regression in the schema
      // shape — a known $defs key reached us with no choices. Surfacing
      // this loudly is preferable to silently shipping an empty enum
      // list to the agent (which would let any typo land in
      // `brand.*.usageHints` without validation).
      throw new Error(
        `usageHintEnumsFromSchema: $defs.${key} resolved to empty enum list; schema shape regression`,
      );
    }
    return [...direct];
  }
  const allOf = Array.isArray(listDef.allOf) ? listDef.allOf : [];
  for (const branch of allOf) {
    const ref = branch?.items?.$ref;
    if (typeof ref === "string" && ref.startsWith("#/$defs/")) {
      const target = defs[ref.slice("#/$defs/".length)];
      if (target && Array.isArray(target.enum)) {
        if (target.enum.length === 0) {
          throw new Error(
            `usageHintEnumsFromSchema: $defs.${key} resolved to empty enum list; schema shape regression`,
          );
        }
        return [...target.enum];
      }
    }
  }
  return [];
}

export function usageHintEnumsFromSchema(schema) {
  const defs = schema && typeof schema === "object" && schema.$defs ? schema.$defs : {};
  return {
    colorUsageHintList: pickEnum(defs, "colorUsageHintList", defs.colorUsageHintList),
    typographyUsageHintList: pickEnum(defs, "typographyUsageHintList", defs.typographyUsageHintList),
    buttonUsageHintList: pickEnum(defs, "buttonUsageHintList", defs.buttonUsageHintList),
  };
}

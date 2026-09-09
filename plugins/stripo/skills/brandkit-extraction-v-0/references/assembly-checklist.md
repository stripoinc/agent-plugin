# Extraction Assembly Checklist

Pointer checklist for `brandkit.extraction.json`. Each item names the canonical SKILL.md section — read that section for the rule itself.

- Homepage batch terminal: `homepage-pass-status.json` exists with a non-negative `phaseTimingsMs.total` (SKILL.md "Default Commands" for the `phaseTimingsMs` shape; "Workflow", Phase 1 for the terminal-state rule).
- Scaffold ran; draft treated as shape-safe candidate, not role authority (SKILL.md "Workflow", Phase 2).
- Role decisions reviewed against saved screenshot → DOM hierarchy → candidate selectors → style probes (SKILL.md "Decision Flows", Color flow).
- Independent probes batched in parallel (SKILL.md "Decision Rules", Preferences).
- Public logo source URLs only (SKILL.md "Logo flow").
- No `brand.brandVoice` (SKILL.md "Extraction-Stage JSON").
- `brand.components.productCard[]` neutral and public-safe; weak evidence marked, not failed (SKILL.md "Product-card specifics").
- Mirror tags verify-only — never author; strip only where a `value_not_measured` entry names an `anchoredCarrier` (SKILL.md "Role-tagging contract").
- `importantLinks` curated per the flow contract (SKILL.md "Important links flow").
- No selectors, DOM ids/classes, local paths, coordinates, screenshots, retry traces, or debug paths in public fields (SKILL.md "Hard rules", Public output discipline).
- Normalize ran on the finished draft; output validates against `references/extraction-stage.schema.json` (SKILL.md "Workflow", Phase 3).

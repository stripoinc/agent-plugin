// Drop `importantLinks[]` entries whose `name` exceeds a physical-fit
// length cap before the assembled payload reaches AJV / the downstream
// compiler.
//
// Why a length cap: the customise pipeline renders the first three
// `importantLinks` entries as the email's header navigation row. The
// header column is ~150–180 px wide; at the typical 14–16 px
// sans-serif body font (~7 px per character) that gives ~21–26
// displayable characters per slot. A cap at 40 characters is ≥1.5x
// the physical display ceiling — a generous backstop that no real
// header navigation label crosses across any locale we have evidence
// for ("Кундерсервіс" / "Sonderangebote" / "Programy lojalnościowe"
// all sit under 25 chars).
//
// The cap is therefore a **physical-shape constraint**, not a curation
// rule. Long entries are content the email header literally cannot
// render — promo banners with date prefixes ("Діє до 27.05.2026 ..."),
// article-rail headlines that wrap to 3+ lines, full product titles,
// or scratch text like "4.6 4.6 140" that the LLM accidentally
// surfaced as a nav label. The compiler's `_link_role_rank` then sees
// a smaller, header-quality candidate set and the `[:3]` slice picks
// short labels naturally.
//
// Scope: ONLY `importantLinks[].name`. URL length is intentionally
// unbounded (deep ecommerce category paths can be long). The agent's
// intent and ordering inside the survivor list are preserved.
//
// Diagnostic posture: append one info-severity entry per dropped link
// with the offending name (truncated to 80 chars in the message for
// readability) and its url. Idempotent — running on a payload whose
// `importantLinks` already satisfies the cap is a no-op.
//
// Non-scope: this helper does NOT enforce role / nav-shape semantics
// (those live in SKILL.md curation guidance and the compiler-side
// `_link_role_rank`). It only enforces the physical-display shape that
// the email header imposes.
//
// Relationship to SKILL.md "Important links flow" (`:302–304`,
// `:358–365`, `:445`): the prose contract instructs the agent to emit
// header-nav-quality labels; this helper is a deterministic safety net
// for an agent slip where the probe surfaced long body anchors and the
// agent passed them through unfiltered.

const DEFAULT_NAME_LENGTH_CAP = 40;

export function dropLongImportantLinkNames(
  payload,
  diagnostics = [],
  { max = DEFAULT_NAME_LENGTH_CAP } = {},
) {
  if (!payload || typeof payload !== "object") return;
  const links = payload.importantLinks;
  if (!Array.isArray(links) || links.length === 0) return;

  const cap = Number.isFinite(max) && max > 0 ? max : DEFAULT_NAME_LENGTH_CAP;
  const kept = [];
  for (const [idx, link] of links.entries()) {
    if (!link || typeof link !== "object") {
      kept.push(link);
      continue;
    }
    const name = typeof link.name === "string" ? link.name : "";
    if (name.length <= cap) {
      kept.push(link);
      continue;
    }
    if (Array.isArray(diagnostics)) {
      const url = typeof link.url === "string" ? link.url : "";
      const truncated = name.length > 80 ? `${name.slice(0, 77)}...` : name;
      diagnostics.push({
        severity: "info",
        path: `$.importantLinks[${idx}].name`,
        message:
          `Dropped importantLinks entry whose name length (${name.length}) ` +
          `exceeds the email header's physical-display cap (${cap}); ` +
          `name="${truncated}" url="${url}". Long entries cannot render ` +
          `in the fixed-width email header column and almost always ` +
          `originate from promo prose, article-rail headlines, product ` +
          `titles, or scratch text the agent surfaced unfiltered.`,
      });
    }
  }

  if (kept.length !== links.length) {
    payload.importantLinks = kept;
  }
}

export const IMPORTANT_LINK_NAME_LENGTH_CAP = DEFAULT_NAME_LENGTH_CAP;

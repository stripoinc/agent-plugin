// Canonical contact facts shared by the page-signals producer and the
// extraction-stage scaffolder. `text` on a contact row is diagnostic display
// copy (often "Email us" / "Call us"), never the contact fact by default.

const MAILBOX_SOURCE = "[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?";
const MAILBOX_SEARCH_RE = new RegExp(MAILBOX_SOURCE, "i");
const MAILBOX_LITERAL_RE = new RegExp(`^${MAILBOX_SOURCE}$`, "i");
const PHONE_LITERAL_RE = /^\+?[\d\s().-]+$/;

function normalizeText(value) {
  return String(value ?? "").trim();
}

function schemeTarget(value, scheme) {
  const text = normalizeText(value);
  return text.toLowerCase().startsWith(scheme) ? text.slice(scheme.length) : null;
}

function decodeTarget(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    // Preserve the probe's existing best-effort behavior for malformed
    // escapes: a mailbox that is already readable in the raw target remains
    // usable, while a recipient-less target still produces no fact.
    return value;
  }
}

export function emailFromMailto(value) {
  const target = schemeTarget(value, "mailto:");
  if (target === null) return "";
  const recipient = decodeTarget(target.split("?", 1)[0]);
  const match = recipient.match(MAILBOX_SEARCH_RE);
  return match ? match[0].toLowerCase() : "";
}

export function phoneFromTel(value) {
  const target = schemeTarget(value, "tel:");
  if (target === null) return "";
  // RFC 3966 parameters describe the number; they are not subscriber digits.
  // Split both before and after decoding so ordinary `;ext=99` and its
  // percent-encoded web equivalent cannot turn into an invented suffix.
  const rawRecipient = target.split(/[;?]/u, 1)[0];
  let decodedRecipient;
  try {
    decodedRecipient = decodeURIComponent(rawRecipient);
  } catch {
    // Unlike a mailbox, raw percent-escape digits are indistinguishable from
    // subscriber digits. A malformed tel target therefore has no safe fact.
    return "";
  }
  if (decodedRecipient.includes("%")) return "";
  const recipient = decodedRecipient.split(/[;?]/u, 1)[0].trim();
  const digits = recipient.replace(/\D/g, "");
  if (!digits) return "";
  return `${recipient.startsWith("+") ? "+" : ""}${digits}`;
}

export function emailFromLiteral(value) {
  const text = normalizeText(value);
  return MAILBOX_LITERAL_RE.test(text) ? text.toLowerCase() : "";
}

export function phoneFromLiteral(value) {
  const text = normalizeText(value);
  if (!PHONE_LITERAL_RE.test(text)) return "";
  const digits = text.replace(/\D/g, "");
  if (!digits) return "";
  return `${text.startsWith("+") ? "+" : ""}${digits}`;
}

export function contactFactFromRow(row, channel) {
  const source = row && typeof row === "object" ? row : { text: row };
  if (channel === "email") {
    return (
      emailFromLiteral(source.email) ||
      emailFromMailto(source.url) ||
      emailFromLiteral(source.text)
    );
  }
  if (channel === "phone") {
    return (
      phoneFromLiteral(source.phone) ||
      phoneFromTel(source.url) ||
      phoneFromLiteral(source.text)
    );
  }
  return "";
}

export function contactRowsWithFacts(rows, channel) {
  const field = channel === "email" ? "email" : channel === "phone" ? "phone" : "";
  if (!field || !Array.isArray(rows)) return [];
  const seen = new Set();
  const output = [];
  for (const row of rows) {
    const fact = contactFactFromRow(row, channel);
    if (!fact || seen.has(fact)) continue;
    seen.add(fact);
    const source = row && typeof row === "object" ? row : { text: normalizeText(row) };
    output.push({ ...source, [field]: fact });
  }
  return output;
}

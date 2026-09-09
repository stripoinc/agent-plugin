<!-- Moved out of the two satellite SKILL.md files by the 0.3.0 contract split.
     The bullets below are verbatim from brandkit-tone-of-voice-v-0/SKILL.md at
     sha256 1ac713c69fe25fed03bbe8d1f83f2aa7625efbbd1b0d8615b1a2009a831841ad; brandkit-business-context-v-0 carried the same three
     byte-identically. -->

# Site match — what `check-site` decides, and what its domain compare covers

`python "${BRANDKIT_SKILL_ROOT}/scripts/finalize.py" check-site --technical-dir <TECH> --url <target>`
is the exact port of the shell block both satellites used to carry: the same
`regdom` tables, the same branch order, the same printed lines. It prints
`target:` / `requested:` / `landed:` / `source:`, an `evidence:` path with its
`stat` timestamp when an artifact exists, and the `verdict:` line that is the
decision. With `--stage tone-of-voice` or `--stage business-context` it writes
that stage's stop file itself on the verdicts that stage stops for. Exit 0 =
PROCEED, 3 = NO ARTIFACTS, 4 = HARD STOP.

Read this file when a verdict surprises you.

- **Compare registrable domains, and compare against the REQUESTED url.** `requested` is the URL the extraction was launched with, recorded verbatim *before* any redirect. `landed` is where the capture ended up (`page.url()`). A site that redirects apex → shop subdomain, ccTLD → `.com`, or old brand → new brand changes `landed` and never `requested`, so `landed` alone cannot decide this. **Read the `verdict:` line — the command decides, not you:**
  - `PROCEED - requested matches target` → the artifacts are for your site. If `landed` differs, that is the site's own redirect, not a mismatch: proceed, and put `landed on: <host>` in your summary.
  - `HARD STOP - artifacts were produced for <other>, not <target>` → **hard stop**: these artifacts were produced for a different company.
  - `PROCEED - nothing recorded the requested URL` → no pre-redirect URL exists anywhere on disk (an old extraction, or one whose `brand.organization.website` is blank or missing), and `landed` is the only tie to your site. It matches, so proceed — but say `no pre-redirect URL recorded; matched on landed host` in your summary, because a redirect could have carried the capture here from somewhere else.
  - `HARD STOP - nothing recorded the requested URL and landed ... is not ...`, or `HARD STOP - artifacts are present but record no URL at all` → **hard stop**: nothing on disk ties these artifacts to the site you were asked about.
  - `NO ARTIFACTS` → `${TECH}` holds no extraction at all. That is not a wrong-site read; see the empty-technical-directory rule below.
  - Every hard stop reports the requested host, the recorded hosts, and `${TECH}`.
- **Where `requested` comes from, and why it is trustworthy.** `capture.json`'s `requestedUrl` is written by the extraction runtime straight from its `--url` argument, so no agent judgement sits between the launch and the record. The fallback — `brandkit.extraction.json`'s `.brand.organization.website` — is different in kind: the extraction skill mandates that the agent write `brand.organization` from scratch, and an agent that records the canonical URL it browsed makes that field a second `landed`. The `source:` line tells you which one answered. When it names the agent-authored fallback, treat a PROCEED as sound and a HARD STOP as worth one sanity check: re-run the extraction rather than concluding the directory belongs to another company.
- **What `regdom` covers, and what it does not.** It compares eTLD+1 after normalising case, scheme, userinfo, port, path, a trailing dot and a leading `www.`, and it treats `<sld>.<ccTLD>` as a suffix only for the `sld`s AND the ccTLDs listed in the command (so `acme.co.uk`, `acme.com.ua`, `acme.in.ua`, `acme.ne.jp`, `acme.com.au`, `acme.co.jp` all resolve correctly, while `evil.co.uk` stays distinct from `acme.co.uk`). IPv4 literals are returned unchanged. There is no Public Suffix List in this runtime, so two classes are approximated: (a) multi-label suffixes outside that table — `github.io`, `web.app`, `s3.eu-central-1.amazonaws.com`, `k12.ma.us` — collapse to the suffix itself, which makes two unrelated sites hosted under one of them compare EQUAL; that errs toward continuing, never toward a false stop; (b) a registrable domain whose own second label is one of the listed `sld`s *and* whose TLD is in the listed ccTLD set — `co.ru`, `co.co` — is read one label too narrow, which can produce a false stop between it and its own subdomains. Flat registries are deliberately NOT in the ccTLD table, so `com.de`, `net.de`, `co.nl`, `org.it`, `info.se`, `me.io` and `co.dev` are treated as the ordinary registrable domains they are and match their `www.` forms; the `www.` strip is a second line of defence for the same class. The command's answer is still the decision — do not override it by eye.

## The shell block this port replaces

Both satellites carried this block byte-identically until the 0.3.0 contract
split. It is kept here verbatim as the source of truth the Python port is
compared against, host for host — it is NOT a command to run: the runtime image
has `jq`, but `check-site` is the supported entry point and writes the stop file
for you.

```bash
TECH="<resolved-technical-dir-from-task-text>"
TARGET_URL="<the URL you were asked about, verbatim>"

# Registrable domain (eTLD+1): drops scheme, userinfo, port, path, a leading
# "www." and EVERY other subdomain, so acme.example and shop.acme.example
# compare equal. The two-label-suffix table is deliberate — see Limits below.
regdom() {
  printf '%s\n' "$1" | tr 'A-Z' 'a-z' \
  | sed -E 's|^[a-z0-9+.-]+://||; s|[/?#].*$||; s|^[^@]*@||; s|:[0-9]+$||; s|\.$||; s|^www\.([^.]+\.[^.]+)|\1|' \
  | awk -F. '
      BEGIN {
        split("ac biz co com edu gob gov in info mil ne net or org pp sch", a, " ")
        for (i in a) sld[a[i]] = 1
        # ccTLDs whose registry really is organised under those second labels.
        # A ccTLD that is ABSENT here is treated as flat, which is the safe
        # direction: com.de / co.nl / org.it / info.se / me.io are ordinary
        # registrable domains and must equal their www. form.
        split("ae ar au bd br cn co eg hk id il in jp ke kr lk mx my ng nz pe ph pk ru sa sg th tr tw ua ug uk uy ve vn za", b, " ")
        for (i in b) cc[b[i]] = 1
      }
      /^[0-9]+(\.[0-9]+)*$/ { print; next }
      NF<=2 { print; next }
      cc[$NF] && sld[$(NF-1)] { printf "%s.%s.%s\n", $(NF-2), $(NF-1), $NF; next }
      { printf "%s.%s\n", $(NF-1), $NF }'
}

# 1. Which site do these artifacts describe? `requested` is the pre-redirect
#    URL. Prefer capture.json's `requestedUrl`, which the runtime writes from
#    the extraction's own --url argv; the extraction artifact's website field
#    is agent-authored, so it is only a fallback.
target=$(regdom "${TARGET_URL}")
landed=$(regdom "$(jq -r '.url // empty' "${TECH}/capture.json" 2>/dev/null)")
requested=$(regdom "$(jq -r '.requestedUrl // empty' "${TECH}/capture.json" 2>/dev/null)")
source="capture.json .requestedUrl (recorded by the runtime)"
if [ -z "${requested}" ]; then
  requested=$(regdom "$(jq -r '.brand.organization.website // empty' "${TECH}/brandkit.extraction.json" 2>/dev/null)")
  source="brandkit.extraction.json .brand.organization.website (agent-authored)"
fi
[ -n "${requested}" ] || source="none recorded"
echo "target:    ${target}"
echo "requested: ${requested}"
echo "landed:    ${landed}"
echo "source:    ${source}"

# 2. How old is that evidence? Stat the artifact you will actually read:
#    capture.json when it exists, otherwise the extraction artifact.
for f in "${TECH}/capture.json" "${TECH}/brandkit.extraction.json"; do
  [ -f "$f" ] || continue
  echo "evidence:  $f"
  stat -c '%y' "$f" 2>/dev/null || stat -f '%Sm' "$f"
  break
done

# 3. The verdict. Printed on EVERY path, including the ones where a label
#    above came back blank — this line is the decision.
if [ ! -f "${TECH}/capture.json" ] && [ ! -f "${TECH}/brandkit.extraction.json" ]; then
  echo "verdict:   NO ARTIFACTS - ${TECH} holds no extraction; apply the empty-technical-directory rule"
elif [ -n "${requested}" ] && [ "${requested}" = "${target}" ]; then
  echo "verdict:   PROCEED - requested matches target"
elif [ -n "${requested}" ]; then
  echo "verdict:   HARD STOP - artifacts were produced for ${requested}, not ${target}"
elif [ -n "${landed}" ] && [ "${landed}" = "${target}" ]; then
  echo "verdict:   PROCEED - nothing recorded the requested URL; landed matches target"
elif [ -n "${landed}" ]; then
  echo "verdict:   HARD STOP - nothing recorded the requested URL and landed (${landed}) is not ${target}"
else
  echo "verdict:   HARD STOP - artifacts are present but record no URL at all"
fi
```

<!-- Moved out of SKILL.md by the 0.3.0 contract split. The text below is
     verbatim from SKILL.md at sha256 6cdd8d5975fa8aca548fbe00d5507260bf6d5ec6522d61ddaa0e4fa512ef9609. -->

# Report lines — stored state, logo and contact outcomes

The read-only `report` command prints a `REPORT_LINE:` for stored-profile state. The finalizer's stdout JSON provides separate `reportLines.logo` and `reportLines.contacts`. These lines and the rules behind them are described below.

The contact line names the removed value with its channel noun — `email address`
for `contacts.emails`, `phone number` for `contacts.phones`, `address` for
`contacts.addresses`.

### Stored-profile comparison after a possible save

Run `finalize.py report --out-dir ${OUT}` only after an acknowledged or uncertain write. It reads the selected account through the host adapter and prints one outcome-neutral `REPORT_LINE:`. The line states whether the current stored profile matches this run's promoted kit in the ten projected fields, differs, or could not be checked. The comparison covers website, name, logo URLs, languages, contacts, socials, important links, colours, typography, and button components. It tolerates the server's known normalization of those fields. It does not compare every field or establish that this particular write caused the current state.

A matching line can support an acknowledged save, or help explain an uncertain call. Keep the direct tool acknowledgement, refusal, or error separate from that line. A different or unavailable state does not authorize another write. Do not run the comparison after a known no-write refusal, failed preparation/upload, or intentional no-save. For those paths, report the actual tool outcome and use the finalizer stdout JSON's `reportLines.logo` and `reportLines.contacts`.

The report stores its fresh read-back under `${OUT}/persist-readback.json` as host-owned evidence. The model never authors that file and never supplies a read-back as a command argument. An unreadable, unpromoted, or hash-mismatched local output cannot be used as a witness for this run; the report says verification is unavailable and does not read the account in those cases.

### Logo outcome — a missing brand logo is said out loud, not footnoted

A brandkit with no usable logo is not a cosmetic gap: the next thing anyone does with it is customize an email, and that run cannot rebrand a header it has no mark for. Discovered at extraction time it costs the reader one sentence; discovered mid-customization it costs them the run. So whenever the FINAL `brand.logos` fails to carry a logo an email can actually use — and equally when the finalizer just made one usable — the final reply carries the matching line **as a named line of its own** — never as a "Limitation" footnote, never folded into a list of minor notes, and never omitted because the rest of the extraction went well.

Read the table top-down and take the FIRST row that applies:

| what `brand.logos` holds | the line |
|---|---|
| empty | `No brand logo was found — provide a logo file or URL before customizing an email.` |
| no `primary` entry (favicon and/or alternative entries only) | `No usable brand logo was found (no primary logo) — provide a logo file or URL before customizing an email.` |
| the `primary` entry whose `url` is the hosted `.png` the finalizer minted this run | `The brand logo was converted to a hosted PNG for email use: <url>.` |
| the `primary` entry, but none with a non-empty `url` | `The brand logo was captured as markup only, with no image URL — provide a logo file or URL before customizing an email.` |
| the `primary` entry with a non-empty `.svg` `url`, finalizer hosting having failed or been skipped | `The brand logo is an SVG the run could not convert to a hosted PNG (<recorded reason>). No hosted PNG exists for this brand; an email built from this kit references the SVG directly. Conversion is still required and has not been verified.` |
| the `primary` entry with a non-empty `url` that is neither `.svg` nor confirmed email-safe `.png` / `.jpg` / `.jpeg` / `.gif` (including WebP, AVIF, extensionless, or unknown formats), the finalizer's raster hosting having failed or been skipped | `The brand logo URL is not confirmed email-safe (WebP, AVIF, extensionless, or unknown format) — provide a PNG, JPG, JPEG, or GIF logo before customizing an email.` |
| the `primary` entry whose `url` is the already-email-safe mark this run substituted after hosting failed (`logo_hosting.fallback_used`) | `The brand logo could not be converted to a hosted PNG (<recorded reason>), so this run stored an already-email-safe capture of the same mark instead: <url> — check it against the site before customizing an email.` |
| the `primary` entry with a non-empty `url` | nothing — say nothing about logos |

**The markup-only row is not a technicality.** An inline-`<svg>` capture whose finalizer mint did not land proves what the mark looks like and gives the downstream flow nothing to fetch: `svgPath` is inner markup, and the conversion that turns a logo into an email image starts from `url` (Logo flow above). A run that reports nothing there hands over a brandkit that *looks* complete and fails at the same 40-minutes-later moment this section exists to prevent. Append the `outcome` / `error_code` / `reason` from `finalize-report.json.logo_hosting` in parentheses after that sentence; the actionable ask stays either way, because an unminted inline capture is still unusable.

**The kept-source SVG row says what shipped; it never promises a conversion downstream.** A `.svg` `url` still points at a real, fetchable mark, and that SVG is what an email built from this kit will reference: the reviewed consumer copies `brand.logos[].url` straight into an image `src` and converts nothing on the way. Say what the run could not do and why (the recorded reason: `skipped-unattended`, a verbatim `logo_rasterize_failed` / `logo_font_unresolved`, an upload failure), and say plainly that no hosted PNG exists for this brand — the conversion, not the mark, is what is missing, so do NOT tell them to provide a logo file or URL — they already did.

**The substituted row is the one line a reader must act on by looking.** The finalizer replaces a primary URL only when a conversion failed and this run measured an already-email-safe capture carrying the same `alt`, the same rendered size and a non-contradicting background band — the substitution is bounded by measurement, not by region or by filename, and `finalize-report.json.logo_hosting.fallback_used` records the identity it matched on. What measurement cannot settle is whether that capture is the variant this brand wants in an email, so the line asks the reader to check it against the site. The replaced URL stays on the kit as an `alternative` row.

**The minted row is a plain statement of what changed.** The finalizer rewrote `brand.logos[].url` to a PNG on the deployment's hosted image CDN; the saved Brand Kit and its dashboard now show that image directly. It is not a warning and does not qualify the run.

These logo lines do not change the save outcome. They are **not triggered by an empty `svgPath`**: a raster primary logo with `svgPath: ""` and a real `url` is a complete, usable logo ([Logo flow](logo-flow.md)) and says nothing here. The trigger is the absence of a usable mark, never the absence of its markup.

Do not invent one to avoid the line. A favicon promoted to `type: "primary"`, an `og:image` marketing banner passed off as the logo, or a guessed `/logo.svg` URL is worse than the honest sentence — it ships a wrong mark into an email under a headline that says the brand was captured.

### Contact outcome — a contact the run could not evidence is named, not silently dropped

The finalizer STRIPS any `contacts` value this run's `page-signals` contact rows do not carry, instead of refusing the whole run over it. `page-signals` is the ONLY contact evidence: a number printed somewhere else on the page is not a second tier, so expect a strip for anything the contact probe did not record — typically a hotline that appears only in a header or footer contact block.

The strip is invisible in the saved kit, so the reader has to hear it: for every `Removed contacts.` line in `finalize-report.json.warnings`, the final reply names the removed value and says this run did not find it in the site's page evidence, so they can add it by hand — e.g. `The phone number 0 800 000 000 was removed: this run did not find it in the site's page evidence — add it by hand if it is correct.`

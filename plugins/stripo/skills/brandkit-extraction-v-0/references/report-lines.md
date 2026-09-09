<!-- Moved out of SKILL.md by the 0.3.0 contract split. The text below is
     verbatim from SKILL.md at sha256 6cdd8d5975fa8aca548fbe00d5507260bf6d5ec6522d61ddaa0e4fa512ef9609. -->

# Report lines — persist, logo and contact outcomes

The tables behind the `REPORT_LINE:` lines `python "${BRANDKIT_SKILL_ROOT}/scripts/finalize.py" report`
prints. `report` renders them for you; this is the text it renders and the reason
each row exists.

The contact line names the removed value with its channel noun — `email address`
for `contacts.emails`, `phone number` for `contacts.phones`, `address` for
`contacts.addresses`.

### Persist outcome — always reported, never implied

Any run whose `finalize-report.json` says `promoted: true` must carry **exactly one** persist line in its final reply. Never omit it, and never let "the extraction succeeded" stand in for it — a saved Brand Kit that silently did not change is this subsystem's signature defect.

| what happened | the line |
|---|---|
| written, `cleared` empty, and confirmed by the 5d read | `persisted and verified` |
| written and confirmed, and `cleared` names one or more sections, or parts of sections | `persisted, cleared from the account: <names>` |
| written, but the 5d read could not confirm it | `persisted but unverified (<reason>)` |
| the 5c call errored, but the 5d read shows the account holding this run's identity sections — website, name, logo URLs, languages, contacts, socials and important links; colours, typography and button components are compared through a projection that survives the server's own normalisation (hex case, rounding, added `size` and font fields) | `persisted despite a failed call (<the error, verbatim>)` |
| approval denied / timed out | `not persisted (approval denied)` / `not persisted (approval timed out)` |
| unattended run | `not persisted (unattended run — Reteno mutations are disabled)` |
| the write was rejected | `not persisted (rejected: <field path>: <message>)` |
| the call failed for any other reason, and the 5d read does not show it landed | `not persisted (<the error, verbatim>)` |

An empty `cleared` is what a run that found everything the account held looks like, and it is reachable: report `persisted and verified` and nothing else — do not append an empty `cleared from the account:` clause, and do not go hunting for something to name. A complete save is reported as one.

`persisted, cleared from the account: <names>` is for a genuinely non-empty list, and it is **not** a failure — but it is not a footnote either. Every name on it is something the account HELD and does not hold any more, because this run did not measure it: an email address someone typed in by hand, a LinkedIn URL, the logo they uploaded. Take `<names>` from the write's own `cleared` — you do not decide which entries are in it — and `report` names each one as the reader will find it in their Brand Kit: the section (`contacts`, `socials`, `logos`), then the part of it that emptied — a field (`socials / android`) or a row (`logos (type=alternative)`) — rather than as a raw path, so they can go and look at what is no longer there and put it back if they want it. **`brand.products` is the one name you cannot place that way** — it is leftover product evidence an older save wrote into something the Brand Kit UI does not show as a section. Say it removed leftover product data and do not send the reader looking for a section that is not there. Never describe these as untouched, unchanged or left alone: the reader has to be able to tell a save that filled in gaps from one that emptied them.

`persisted despite a failed call` is the row 5d's read exists to resolve. A write can land and still return an error — a timeout after the account was already updated — and reporting `not persisted` there sends the reader to re-run a save that has already happened. Both that row and `not persisted (<the error, verbatim>)` describe a call that errored, and the 5d read is the only thing that tells them apart — never pick between them from the call's return value alone.

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

Two things these lines are NOT. They are **not a failure** and they do not change the persist outcome — the extraction still ships, still saves, and still reports its persist line exactly as the table above prescribes. And they are **not triggered by an empty `svgPath`**: a raster primary logo with `svgPath: ""` and a real `url` is a complete, usable logo (Logo flow, [Decision Flows](#decision-flows)) and says nothing here. The trigger is the absence of a usable mark, never the absence of its markup.

Do not invent one to avoid the line. A favicon promoted to `type: "primary"`, an `og:image` marketing banner passed off as the logo, or a guessed `/logo.svg` URL is worse than the honest sentence — it ships a wrong mark into an email under a headline that says the brand was captured.

### Contact outcome — a contact the run could not evidence is named, not silently dropped

The finalizer STRIPS any `contacts` value this run's `page-signals` contact rows do not carry, instead of refusing the whole run over it. `page-signals` is the ONLY contact evidence: a number printed somewhere else on the page is not a second tier, so expect a strip for anything the contact probe did not record — typically a hotline that appears only in a header or footer contact block.

The strip is invisible in the saved kit, so the reader has to hear it: for every `Removed contacts.` line in `finalize-report.json.warnings`, the final reply names the removed value and says this run did not find it in the site's page evidence, so they can add it by hand — e.g. `The phone number 0 800 000 000 was removed: this run did not find it in the site's page evidence — add it by hand if it is correct.`

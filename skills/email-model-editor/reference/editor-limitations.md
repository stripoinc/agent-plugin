# Editor limitations

Behavior of the editor that writes the model and renders the email, which the SDK cannot change.
Each entry says what happens, what the SDK does about it, and what to do. Read the entries for
the current step before building or changing the model; other references link here instead of
restating editor behavior.

Verified against editor revision `1e786dd4` on the merge-service runtime. When the editor
contract is refreshed, re-check every entry against the new revision, rewrite or delete the ones
the editor fixed, then update the revision above.

## Text color

- Inserting a text block or changing its `fontColor` writes that color onto every paragraph,
  heading, list item, and span in the block, replacing their inline colors. Links keep theirs.
  Setting `fontColor` on a copy therefore repaints all of its inline colors on insert, even with
  the source's color.
- Without an inline color, paragraphs, headings, list items, and links take the theme color from
  CSS; the block `fontColor` reaches only other text, such as bare text or a `div`. The editor
  reads `fontColor` back from inline colors, not from the block, so that text's color is not in
  the model and a copy or rebuild can change it. Do: wrap it in a paragraph or give it an inline color.
- A content change that keeps the acquired `fontColor` stores the content as supplied. The editor
  then reads `fontColor` back from the first paragraph (else heading, list item, or span) that has
  an inline color.
- SDK: a new text block whose content has inline colors gets no default `fontColor`, and copies
  made by duplicate, repeat, insert, or insertFrom drop an inherited `fontColor` that would repaint
  their colors unless some text depends on it. `INLINE_COLOR_OVERWRITTEN` rejects inline colors
  newly supplied in the same write as a `fontColor` change, or with an explicit `fontColor` on a
  new block; colors the block or its copied source already had are not reported.
- Do: for uniform text, set `fontColor` and align or remove conflicting inline colors. For
  intentional multicolor text, keep the acquired `fontColor`, or omit it on a new block.

## Line height

- Line height is stored as a whole percentage, so `1.333` reads back as `1.33` and `0.001` as `0`.
- SDK: a changed line height with more than two decimal places is rejected, not rounded.

## Mobile font size

- The generated mobile stylesheet applies each area's `settings.stripes.<area>.fontSize.mobile`
  (16px for header and content, 12px for footer and info area in a new SDK seed) to its paragraphs
  and links with `!important`; list items keep the content area's desktop size.
- An inline `font-size` on the `<p>` can therefore look correct on desktop yet enlarge small
  mobile copy, wrap compact detail rows, and lengthen the email.
- Do: for a source mobile design with smaller text, put the mobile size on a nested span with
  `!important`. A text block has no font-size setting, so no native setting gives one paragraph
  its own mobile-only size. Native alternatives change shared settings: a heading element (`h1` to
  `h6`) uses `settings.headings.<level>.fontSize.mobile` for that whole level, and the area value
  applies to every paragraph in the area. Use one only when that scope and the changed semantics
  fit the request, and report the substitution.
- Do: for aligned label/value rows, use a two-cell presentation table with an explicit font size
  on each cell so wrapped values stay in the value column. Verify the saved mobile PNG, not just
  the JSON or desktop HTML.

## Divider paragraphs

- When a horizontal divider's border sits in a text block, the mobile compiler gives the wrapper
  paragraph the area's mobile size and inserts a full line of space at every divider.
- Do: set that paragraph's `font-size:1px!important` and `line-height:1px!important`.

## Backgrounds

- For a centered photo-backed panel, an image only on the stripe with a transparent body is
  painted outside the body, and the overlay text can disappear. Do not put the only image there.
- A native background with a `cover`/`cover` size pair can pass local schema validation but fail
  the server write. Do: with `sizeX: "cover"`, set `sizeY: "auto"` and compare the saved photo crop.

## Mobile column widths

- A two-column native structure can get equal mobile widths even when its desktop column widths
  differ and `responsiveMobile` is false.
- Do: for compact receipt rows, keep the label and amount together in one presentation table when
  the source needs unequal mobile columns.

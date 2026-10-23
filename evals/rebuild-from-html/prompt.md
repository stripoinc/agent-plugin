---
description: Raw HTML of an old email, without the product name, routes to email-from-reference rather than the editor.
tags: [routing, indirect]
plugins: ["../.."]
max_turns: 6
allowed_tools: [Read, Glob, Grep, Skill]
---

This is the HTML of last year's Black Friday email. Rebuild it as an editable email for this year, with the sale starting on November 27.

```html
<table width="600" align="center" style="font-family:Arial,sans-serif">
  <tr><td style="background:#111;color:#fff;padding:24px;font-size:28px">BLACK FRIDAY</td></tr>
  <tr><td><img src="https://cdn.example.com/bf-hero.jpg" width="600" alt="Up to 40% off"></td></tr>
  <tr><td style="padding:24px">Up to 40% off everything from November 25. Online and in store.</td></tr>
  <tr><td align="center" style="padding:24px"><a href="https://shop.example.com/black-friday" style="background:#e63946;color:#fff;padding:14px 28px;text-decoration:none">Shop the sale</a></td></tr>
</table>
```

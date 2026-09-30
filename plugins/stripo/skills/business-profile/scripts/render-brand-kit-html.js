#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";

function parseArgs(argv) {
  const args = {
    jsonFile: null,
    htmlFile: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === "--json-file") {
      args.jsonFile = argv[index + 1] ?? null;
      index += 1;
      continue;
    }
    if (token === "--html-file") {
      args.htmlFile = argv[index + 1] ?? null;
      index += 1;
    }
  }

  if (!args.jsonFile) throw new Error("Missing required flag: --json-file <path>");
  if (!args.htmlFile) throw new Error("Missing required flag: --html-file <path>");
  return args;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function tokenValue(token) {
  return token && typeof token === "object" && "value" in token ? token.value : "";
}

function tokenDescription(token) {
  return token && typeof token === "object" && "description" in token ? token.description : "";
}

function renderUsageHints(record) {
  const usageHints = Array.isArray(record?.usageHints) ? record.usageHints : [];
  if (!usageHints.length) return "";
  const chips = usageHints
    .map((hint) => `<span class="hint-chip">${escapeHtml(hint)}</span>`)
    .join("");
  return `<div class="hint-row" aria-label="Usage hints">${chips}</div>`;
}

function isProductCardCta(item) {
  return Array.isArray(item?.usageHints) && item.usageHints.includes("product-card-cta");
}

function layoutSummaryRows(layout) {
  if (!layout || typeof layout !== "object") return "";
  const fields = [
    "intent",
    "display",
    "computedWidthPx",
    "computedHeightPx",
    "parentWidthPx",
    "widthRatioToParent",
    "isFullWidth",
  ];
  return fields
    .map((field) => {
      const value = layout[field];
      return `<div><strong>${escapeHtml(field)}:</strong> <span class="mono">${escapeHtml(value ?? "")}</span></div>`;
    })
    .join("");
}

function renderLayoutSummary(item) {
  const layout = item?.layout;
  if (!layout || typeof layout !== "object") {
    return isProductCardCta(item)
      ? `<div class="layout-warning">CTA width not captured</div>`
      : "";
  }
  return `<div class="layout-details">${layoutSummaryRows(layout)}</div>`;
}

function renderColorSection(title, items) {
  const rows = (Array.isArray(items) ? items : [])
    .map((token, index) => {
      const value = tokenValue(token);
      const description = tokenDescription(token);
      return `
        <article class="token-card">
          <div class="token-head">
            <strong>${escapeHtml(`${title.slice(0, -1)} ${index + 1}`)}</strong>
          </div>
          ${renderUsageHints(token)}
          <div class="swatch-bar" style="background:${escapeHtml(value || "transparent")}"></div>
          <div class="token-value">${escapeHtml(value ?? "")}</div>
          <p class="token-description">${escapeHtml(description)}</p>
        </article>
      `;
    })
    .join("");

  return `
    <section class="panel">
      <h2>${escapeHtml(title)}</h2>
      <div class="token-grid">${rows || "<p>No colors captured.</p>"}</div>
    </section>
  `;
}

function renderLinks(title, values) {
  const items = values
    .filter(Boolean)
    .map((value) => `<li>${escapeHtml(value)}</li>`)
    .join("");
  return `
    <section class="panel">
      <h2>${escapeHtml(title)}</h2>
      <ul class="plain-list">${items || "<li>None</li>"}</li></ul>
    </section>
  `;
}

function renderTypographySection(items) {
  const rows = (Array.isArray(items) ? items : [])
    .map((item, index) => `
      <article class="token-card">
        <div class="token-head">
          <strong>${escapeHtml(`Typography ${index + 1}`)}</strong>
        </div>
        <div class="type-preview" style="font-family:${escapeHtml(item.family ?? "inherit")}; font-weight:${escapeHtml(item.weight ?? "400")}">
          Sample Brand Message
        </div>
        ${renderUsageHints(item)}
        <div class="token-meta">
          <span><strong>Family:</strong> ${escapeHtml(item.family ?? "")}</span>
          <span><strong>Weight:</strong> ${escapeHtml(item.weight ?? "")}</span>
        </div>
        <p class="token-description">${escapeHtml(item.description ?? "")}</p>
      </article>
    `)
    .join("");

  return `
    <section class="panel">
      <h2>Typography</h2>
      <div class="token-grid">${rows || "<p>No typography captured.</p>"}</div>
    </section>
  `;
}

function renderStyleList(title, items, options = {}) {
  const rows = (Array.isArray(items) ? items : [])
    .map((item, index) => {
      const pairs = Object.entries(item || {}).filter(
        ([key]) => !["description", "usageHints", "layout"].includes(key)
      );
      const details = pairs
        .map(([key, value]) => {
          const renderedValue = typeof value === "object" && value !== null ? JSON.stringify(value) : String(value ?? "");
          return `<div><strong>${escapeHtml(key)}:</strong> <span class="mono">${escapeHtml(renderedValue)}</span></div>`;
        })
        .join("");
      const preview = title === "Buttons"
        ? renderButtonPreview(item)
        : title === "Product Cards"
          ? renderProductCardPreview(item, options.productCardCtaButton)
          : "";
      return `
        <article class="token-card">
          <div class="token-head">
            <strong>${escapeHtml(`${title} ${index + 1}`)}</strong>
          </div>
          ${preview}
          ${renderUsageHints(item)}
          ${title === "Buttons" ? renderLayoutSummary(item) : ""}
          <div class="style-details">${details}</div>
          <p class="token-description">${escapeHtml(item.description ?? "")}</p>
        </article>
      `;
    })
    .join("");

  return `
    <section class="panel">
      <h2>${escapeHtml(title)}</h2>
      <div class="token-grid">${rows || `<p>No ${escapeHtml(title.toLowerCase())} captured.</p>`}</div>
    </section>
  `;
}

function renderButtonElement(item, label = "button") {
  const backgroundColor = item?.backgroundColor || "transparent";
  const fontColor = item?.fontColor || "#1d1b18";
  const borderColor = item?.borderColor || "transparent";
  const borderWidth = Number(item?.borderWidth ?? 0);
  const borderRadius = Number(item?.borderRadius ?? 0);
  const padding = item?.padding || {};
  const layout = item?.layout || {};
  const widthStyle = layout?.isFullWidth ? "width:100%;" : "";

  return `
      <button
        type="button"
        class="button-preview"
        style="
          background:${escapeHtml(backgroundColor)};
          color:${escapeHtml(fontColor)};
          border:${escapeHtml(`${borderWidth}px solid ${borderColor}`)};
          border-radius:${escapeHtml(`${borderRadius}px`)};
          padding:${escapeHtml(`${Number(padding.top ?? 10)}px ${Number(padding.right ?? 18)}px ${Number(padding.bottom ?? 10)}px ${Number(padding.left ?? 18)}px`)};
          ${widthStyle}
        "
      >
        ${escapeHtml(label)}
      </button>
  `;
}

function renderButtonPreview(item) {
  return `
    <div class="preview-block">
      ${renderButtonElement(item)}
    </div>
  `;
}

function renderProductCardPreview(item, productCardCtaButton) {
  const surface = item?.surface || {};
  const borderColor = item?.borderColor || surface.borderColor || "#d8d0c3";
  const borderWidth = Number(item?.borderWidth ?? surface.borderWidth ?? 1);
  const backgroundColor = surface.backgroundColor || "#ffffff";
  const borderRadius = Number(surface.borderRadius ?? 12);
  const priceColor = item?.priceColor || "#1d1b18";
  const oldPriceColor = item?.oldPriceColor || "#6e665d";
  const hasOldPrice = Boolean(item?.oldPriceColor);
  const fallbackCta = {
    padding: item?.ctaPadding,
  };
  const ctaButton = productCardCtaButton || item?.cta || fallbackCta;
  const titleTypography = item?.titleTypography || {};
  const titleStyle = [
    titleTypography.family ? `font-family:${escapeHtml(titleTypography.family)};` : "",
    titleTypography.weight ? `font-weight:${escapeHtml(titleTypography.weight)};` : "",
    titleTypography.sizePx ? `font-size:${escapeHtml(`${titleTypography.sizePx}px`)};` : "",
    titleTypography.lineHeightPx ? `line-height:${escapeHtml(`${titleTypography.lineHeightPx}px`)};` : "",
    titleTypography.textTransform ? `text-transform:${escapeHtml(titleTypography.textTransform)};` : "",
  ].join(" ");

  return `
    <div class="preview-block">
      <article class="product-card-preview" style="background:${escapeHtml(backgroundColor)};border:${escapeHtml(`${borderWidth}px solid ${borderColor}`)};border-radius:${escapeHtml(`${borderRadius}px`)};">
        <div class="product-image-preview"></div>
        <div class="product-name-preview" style="${titleStyle}">Sample Product</div>
        <div class="product-price-preview" style="color:${escapeHtml(priceColor)};">$199</div>
        ${hasOldPrice ? `<div class="product-old-price-preview" style="color:${escapeHtml(oldPriceColor)};">$249</div>` : ""}
        ${renderButtonElement(ctaButton, ctaButton?.text || "button")}
        <div class="style-details">
          <div><strong>Evidence:</strong> <span class="mono">${escapeHtml(item?.evidenceQuality || "unknown")}</span></div>
          <div><strong>Confidence:</strong> <span class="mono">${escapeHtml(item?.confidence ?? "")}</span></div>
        </div>
      </article>
    </div>
  `;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const jsonPath = path.resolve(args.jsonFile);
  const htmlPath = path.resolve(args.htmlFile);
  const payload = JSON.parse(await fs.readFile(jsonPath, "utf8"));

  const brand = payload.brand || {};
  const organization = brand.organization || {};
  const logos = brand.logos || [];
  const colors = brand.colors || {};
  const typography = Array.isArray(brand.typography) ? brand.typography : [];
  const components = brand.components || {};
  const productCardCtaButton = Array.isArray(components.button)
    ? components.button.find((item) => isProductCardCta(item))
    : null;
  const brandVoice = brand.brandVoice || {};
  const businessContext = brand.businessContext || {};
  const contacts = payload.contacts || {};
  const socials = payload.socials || {};
  const importantLinks = payload.importantLinks || [];
  const languages = Array.isArray(payload.languages) ? payload.languages : [];

  const logoCards = logos
    .map((logo) => {
      const imageSrc = logo.url || "";
      const image = imageSrc
        ? `<img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(logo.type)} logo" class="logo-image">`
        : `<div class="logo-placeholder">No logo URL</div>`;
      return `
        <article class="logo-card">
          <h3>${escapeHtml(logo.type || "")}</h3>
          ${image}
          <dl>
            <dt>Background</dt><dd>${escapeHtml(logo.background || "")}</dd>
            <dt>Logo URL</dt><dd>${escapeHtml(logo.url || "")}</dd>
            <dt>SVG path</dt><dd class="mono">${escapeHtml(logo.svgPath || "")}</dd>
          </dl>
        </article>
      `;
    })
    .join("");

  const socialEntries = Object.entries(socials).map(([key, value]) => `${key}: ${value}`);
  const importantLinkItems = importantLinks
    .map((item) => `<li><strong>${escapeHtml(item.name || "")}</strong> <span>${escapeHtml(item.url || "")}</span></li>`)
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(organization.name || "Brand Kit")}</title>
  <style>
    :root {
      --bg: #f4efe6;
      --panel: #fffdf8;
      --ink: #1d1b18;
      --muted: #6e665d;
      --line: #ddd3c5;
      --accent: #b54b2f;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Georgia, "Times New Roman", serif;
      background: linear-gradient(180deg, #efe5d8 0%, var(--bg) 45%, #f8f2ea 100%);
      color: var(--ink);
    }
    .wrap {
      width: min(1180px, calc(100vw - 40px));
      margin: 0 auto;
      padding: 32px 0 56px;
    }
    .hero {
      display: grid;
      gap: 16px;
      padding: 28px;
      background: radial-gradient(circle at top left, rgba(181,75,47,0.12), transparent 42%), var(--panel);
      border: 1px solid var(--line);
      border-radius: 28px;
    }
    .hero h1 {
      margin: 0;
      font-size: clamp(34px, 5vw, 64px);
      line-height: 0.95;
    }
    .hero p {
      margin: 0;
      color: var(--muted);
      max-width: 760px;
    }
    .grid {
      display: grid;
      gap: 18px;
      margin-top: 22px;
    }
    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 24px;
      padding: 22px;
    }
    .token-grid, .logo-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 280px));
      gap: 14px;
    }
    .token-card, .logo-card {
      border: 1px solid var(--line);
      border-radius: 18px;
      padding: 14px;
      background: #fff;
    }
    .token-head {
      display: flex;
      justify-content: space-between;
      gap: 12px;
      align-items: center;
    }
    .token-value, .mono {
      font-family: "Courier New", monospace;
      font-size: 12px;
      word-break: break-word;
    }
    .token-description {
      color: var(--muted);
      font-size: 14px;
    }
    .swatch-bar {
      width: 240px;
      height: 52px;
      border-radius: 12px;
      border: 1px solid rgba(0,0,0,0.12);
      margin: 12px 0;
      background-image: linear-gradient(135deg, rgba(255,255,255,0.16), rgba(0,0,0,0.06));
    }
    .token-meta, .style-details {
      display: grid;
      gap: 8px;
    }
    .type-preview {
      margin: 12px 0;
      padding: 16px;
      border: 1px solid var(--line);
      border-radius: 12px;
      background: #fcfaf6;
      font-size: 28px;
      line-height: 1.1;
    }
    .preview-block {
      margin: 14px 0;
      padding: 16px;
      border: 1px solid var(--line);
      border-radius: 14px;
      background: #fcfaf6;
    }
    .button-preview {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: auto;
      min-height: 40px;
      font: inherit;
      font-size: 18px;
      line-height: 1.2;
      cursor: default;
      width: auto;
    }
    .hint-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin: 10px 0;
    }
    .hint-chip {
      display: inline-flex;
      align-items: center;
      border: 1px solid rgba(181,75,47,0.28);
      border-radius: 999px;
      padding: 4px 8px;
      background: rgba(181,75,47,0.08);
      color: #6f2d1d;
      font-family: "Courier New", monospace;
      font-size: 11px;
    }
    .layout-details {
      display: grid;
      gap: 6px;
      margin: 10px 0;
      padding: 10px;
      border-radius: 12px;
      background: #f7f1e8;
      border: 1px solid var(--line);
      font-size: 13px;
    }
    .layout-warning {
      margin: 10px 0;
      padding: 10px;
      border-radius: 12px;
      background: #fff4d8;
      border: 1px solid #e4bc5b;
      color: #6b4b00;
      font-size: 13px;
      font-weight: 700;
    }
    .product-card-preview {
      display: grid;
      gap: 10px;
      padding: 14px;
      border-radius: 14px;
      background: #fff;
    }
    .price-flag {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 999px;
      background: rgba(181, 75, 47, 0.12);
      color: #8c3f28;
      font-size: 12px;
      font-weight: 700;
    }
    .price-flag.subtle {
      background: rgba(29, 27, 24, 0.08);
      color: #51493f;
    }
    .product-image-preview {
      height: 120px;
      border-radius: 10px;
      background: linear-gradient(135deg, #e9e0d2, #f7f2ea);
    }
    .product-name-preview {
      font-weight: 600;
    }
    .product-price-preview {
      font-size: 24px;
      font-weight: 700;
    }
    .product-old-price-preview {
      font-size: 14px;
      text-decoration: line-through;
    }
    .logo-image {
      max-width: 100%;
      max-height: 80px;
      object-fit: contain;
      display: block;
      margin: 10px 0 14px;
    }
    .logo-placeholder {
      padding: 18px;
      border: 1px dashed var(--line);
      border-radius: 12px;
      color: var(--muted);
      margin: 10px 0 14px;
    }
    dl {
      margin: 0;
      display: grid;
      grid-template-columns: 96px 1fr;
      gap: 6px 12px;
    }
    dt { color: var(--muted); }
    dd { margin: 0; word-break: break-word; }
    .plain-list {
      margin: 0;
      padding-left: 18px;
    }
    .two-col {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
      gap: 18px;
    }
  </style>
</head>
<body>
  <main class="wrap">
    <section class="hero">
      <div class="eyebrow">Brand Kit Presentation</div>
      <h1>${escapeHtml(organization.name || "Unknown brand")}</h1>
      <p>${escapeHtml(organization.website || "")}</p>
    </section>

    <div class="grid">
      <section class="panel">
        <h2>Logos</h2>
        <div class="logo-grid">${logoCards || "<p>No logos captured.</p>"}</div>
      </section>

      ${renderColorSection("Accent Colors", colors.accentColors)}
      ${renderColorSection("Background Colors", colors.backgroundColors)}
      ${renderColorSection("Text Colors", colors.textColors)}

      ${renderTypographySection(typography)}

      ${renderStyleList("Buttons", components.button)}

      ${renderStyleList("Product Cards", components.productCard, { productCardCtaButton })}

      <div class="two-col">
        ${renderLinks("Contacts", [
          ...(contacts.emails || []),
          ...(contacts.phones || []),
          ...(contacts.addresses || []),
        ])}
        ${renderLinks("Socials", socialEntries)}
      </div>

      <section class="panel">
        <h2>Important Links</h2>
        <ul class="plain-list">${importantLinkItems || "<li>None</li>"}</ul>
      </section>

      ${renderLinks("Languages", languages)}

      <section class="panel">
        <h2>Brand Voice</h2>
        <pre>${escapeHtml(JSON.stringify(brandVoice, null, 2))}</pre>
      </section>

      <section class="panel">
        <h2>Business Context</h2>
        <p>${escapeHtml(businessContext.customerValue || "—")}</p>
        <p>${escapeHtml(businessContext.revenueModel || "—")}</p>
      </section>
    </div>
  </main>
</body>
</html>`;

  await fs.mkdir(path.dirname(htmlPath), { recursive: true });
  await fs.writeFile(htmlPath, html, "utf8");
  process.stdout.write(`${JSON.stringify({ htmlFile: htmlPath }, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});

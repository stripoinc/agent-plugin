# Usage hints by final field

Derived from the public schema. A hint allowed in one field is not automatically allowed in another. Use these exact strings; the schema remains authoritative.

## brand.colors.accentColors[].usageHints

`brand-primary-accent`, `brand-secondary-accent`, `promo-accent`, `promo-surface-accent`, `button-primary-background`, `button-primary-hover-background`, `button-secondary-background`, `product-card-cta-background`, `product-card-cta-hover-background`, `product-card-cta-border`, `price-current`, `price-old`, `divider`, `border-subtle`, `link-text`, `link-promo`.

`button-secondary-background` is the selected secondary button's measured `backgroundColor`, including explicit transparency. Its border color and enclosing surface are separate evidence; do not substitute either or an assumed composited color.

## brand.colors.backgroundColors[].usageHints

`canvas-background`, `content-background`, `header-background`, `footer-background`, `product-card-surface-background`, `promo-surface-background`.

## brand.colors.textColors[].usageHints

`heading-text`, `body-text`, `link`, `link-text`, `link-promo`, `header-link`, `footer-text`, `footer-link`, `button-primary-text`, `button-secondary-text`, `product-card-cta-text`, `price-current`, `price-old`.

`link-promo` is the foreground of text functioning as promotional navigation, supported by its action or destination context. Promotional copy alone does not establish this role; neither does a badge within a clickable product card. The text owner may be inside the navigational control.

## brand.typography[].usageHints

`body-typography`, `heading-typography`, `header-typography`, `footer-typography`, `button-typography`, `product-name-typography`, `product-price-typography`, `product-old-price-typography`, `product-card-cta`.

`header-typography` describes representative visible navigation/link text; `footer-typography` describes ordinary visible footer links/body text. Section headings, promotional copy and newsletter titles belong to their own roles unless they also represent ordinary regional text. Preserve each selected element’s complete measured typography tuple.

## brand.components.button[].usageHints

`button-primary-background`, `button-primary-text`, `button-primary-hover-background`, `button-secondary-background`, `button-secondary-text`, `product-card-cta`.

For `button-secondary-background`, retain the selected button's actual measured `backgroundColor` in the component too, including explicit transparency.

When evidence does not support a role, omit that assignment. Keep only a schema-valid observed row or component; omit an unsupported row if needed. Optional `usageHints` may be omitted, but a present `usageHints` array cannot be empty. Do not invent a replacement role to fill it.

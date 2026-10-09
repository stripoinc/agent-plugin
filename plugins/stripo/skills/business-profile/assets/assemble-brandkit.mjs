// The host stages this ESM file in the run directory; edit authorKit using this run's sources.
// Decisions stay in ordinary code. Helpers copy evidence, never choose roles/actions.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

export function readSelection(file, index = 0) {
  const document = JSON.parse(fs.readFileSync(file, 'utf8'));
  const selected = document.measurement?.selections?.[index];
  if (selected?.status !== 'matched' || !selected.root || !Array.isArray(selected.textOwners)) {
    throw Error(`No matched native inspection at ${file}, selection ${index}`);
  }
  // Preserve the measured selection API while exposing the complete surrounding
  // evidence. Load the saved file, not the tool's clipped context preview.
  return {...selected, ...(index === 0 && document.artwork !== undefined ? {artwork: document.artwork} : {}),
    context: document.context ?? null,
    readiness: document.readiness ?? null, page: document.page ?? null,
    ...(document.incomplete !== undefined ? {incomplete: document.incomplete} : {}),
    ...(document.omissions !== undefined ? {omissions: document.omissions} : {})};
}

function loadCapture(file) {
  const capture = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (capture?.schemaVersion !== 'brandkit-page-capture/v1'
      || !Array.isArray(capture.elements) || !Array.isArray(capture.textOwners)
      || !Array.isArray(capture.styles) || !Array.isArray(capture.links)) {
    throw Error(`No brandkit-page-capture/v1 evidence at ${file}`);
  }
  return capture;
}

function captureOwner(capture, captureId, file) {
  if (typeof captureId !== 'string' || !captureId) throw Error('Choose a physical capture element by captureId');
  const elements = capture.elements.filter(element => element?.captureId === captureId);
  if (elements.length !== 1) {
    throw Error(`${elements.length ? 'Ambiguous' : 'Missing'} capture element ${captureId} at ${file}`);
  }
  const element = elements[0];
  if (typeof element.styleId !== 'string' || !element.styleId) {
    throw Error(`Capture element ${captureId} has no styleId at ${file}`);
  }
  const styles = capture.styles.filter(style => style?.styleId === element.styleId);
  if (styles.length !== 1) {
    throw Error(`${styles.length ? 'Ambiguous' : 'Missing'} capture style ${element.styleId} for element ${captureId} at ${file}`);
  }
  const style = styles[0];
  if (!style.parsed || typeof style.parsed !== 'object' || Array.isArray(style.parsed)) {
    throw Error(`Capture style ${element.styleId} for element ${captureId} has no parsed measurements at ${file}`);
  }
  const textOwners = capture.textOwners.filter(owner => owner?.ownerId === captureId);
  if (textOwners.length > 1) throw Error(`Ambiguous capture text owner ${captureId} at ${file}`);
  if (textOwners[0] && textOwners[0].styleId !== element.styleId) {
    throw Error(`Capture text owner ${captureId} does not use element style ${element.styleId} at ${file}`);
  }
  const links = capture.links.filter(link => link?.ownerId === captureId);
  if (links.length > 1) throw Error(`Ambiguous capture link ${captureId} at ${file}`);
  // Preserve the chosen physical element and its exact style measurements. A
  // same-element text tuple remains projection-facing; link metadata stays intact.
  return {...style, ...style.parsed, ...(textOwners[0] ?? {}), ...element,
    ...(links[0] ? {link: links[0]} : {})};
}

export function readCaptureOwner(file, captureId) {
  return captureOwner(loadCapture(file), captureId, file);
}

// A measured text owner is not proof of an unobscured or corroborated image.
function measuredTextOwner(owner) {
  if (!owner || typeof owner.text !== 'string' || !owner.text.trim()) {
    throw Error('Select a measured text owner; an accessible name alone is not a text tuple');
  }
  return owner;
}

// Exact opaque RGB -> hex only. Preserve alpha/other CSS rather than invent a backdrop.
export function color(value) {
  if (value == null) return null;
  const rgb = value.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*1(?:\.0+)?)?\s*\)$/i);
  return rgb && rgb.slice(1, 4).every(v => Number(v) <= 255)
    ? '#' + rgb.slice(1, 4).map(v => Number(v).toString(16).padStart(2, '0')).join('')
    : value;
}

export function typography(owner, description, usageHints) {
  const t = measuredTextOwner(owner);
  if (!t.fontFamily) throw Error('Selected text owner has no measured family');
  return {
    family: t.fontFamily, weight: t.fontWeightNumber ?? null,
    sizePx: t.fontSizePx ?? null, lineHeightPx: t.lineHeightPx ?? null,
    ...(t.fontStyle != null ? {fontStyle: t.fontStyle} : {}),
    letterSpacingPx: t.letterSpacingPx ?? null,
    ...(t.textTransform != null ? {textTransform: t.textTransform} : {}),
    ...(description !== undefined ? {description} : {}), ...(usageHints ? {usageHints} : {}),
  };
}

export function textColor(owner, description, usageHints) {
  return {value: color(measuredTextOwner(owner).color), description, usageHints};
}

const sides = ['top', 'right', 'bottom', 'left'];
const corners = ['topLeft', 'topRight', 'bottomRight', 'bottomLeft'];
const buttonLayoutIntents = new Set(['full-width', 'content-sized', 'fixed-width', 'icon-only', 'unknown']);
const numericButtonLayoutFields = [
  'computedWidthPx', 'computedHeightPx', 'parentWidthPx', 'widthRatioToParent',
  'marginLeftPx', 'marginRightPx',
];
const stringButtonLayoutFields = [
  'display', 'cssWidth', 'cssMinWidth', 'cssMaxWidth', 'boxSizing', 'alignSelf', 'justifyContent',
];
function uniform(values) {
  return values.every(v => v != null && v === values[0]) ? values[0] : null;
}

export function surface(root) {
  if (!root) throw Error('Missing measured root');
  return {
    backgroundColor: color(root.backgroundColor),
    borderColor: color(uniform(sides.map(s => root.borders?.[s]?.color))),
    borderWidth: uniform(sides.map(s => root.borders?.[s]?.widthPx)),
    borderStyle: uniform(sides.map(s => root.borders?.[s]?.style)),
    borderRadius: uniform(corners.flatMap(c => [root.borderRadii?.[c]?.horizontalPx, root.borderRadii?.[c]?.verticalPx])),
    boxShadow: root.boxShadow ?? null,
  };
}

// Pass null for an icon-only control's label. Choose a fallback control separately;
// these helpers never infer an action from accessibleName, class names or shape.
export function button(root, labelOwner, description, usageHints, layoutChoice, backdropOwner) {
  const paint = surface(root);
  if (paint.borderColor == null || paint.borderStyle == null
      || (paint.borderWidth > 0 && paint.borderStyle !== 'solid')
      || !Number.isFinite(paint.borderWidth) || !Number.isFinite(paint.borderRadius)
      || !sides.every(s => Number.isFinite(root.paddingPx?.[s]))) {
    throw Error('Button schema cannot represent missing/asymmetric geometry or non-solid visible borders; choose another evidenced component or omit it');
  }
  let backdropColor;
  if (backdropOwner !== undefined) {
    // Narrow checks only: the author must corroborate ancestry, coverage and intervening paint.
    for (const owner of [root, backdropOwner]) {
      if (!owner || typeof owner !== 'object' || Array.isArray(owner)) {
        throw Error('Choose a measured control and backdrop owner with known solid background context');
      }
      const images = [owner.backgroundImage, owner.styles?.backgroundImage].filter(v => v !== undefined);
      const opacities = [owner.opacity, owner.styles?.opacity].filter(v => v !== undefined);
      if (!images.length || images.some(v => v !== 'none') || !opacities.length
          || opacities.some(v => v !== 1 && (typeof v !== 'string' || !/^1(?:\.0+)?$/u.test(v)))) {
        throw Error('Backdrop context requires measured backgroundImage none and unit opacity on both owners');
      }
    }
    const paints = [backdropOwner.backgroundColor, backdropOwner.styles?.backgroundColor].filter(v => v !== undefined);
    const colors = paints.map(v => typeof v === 'string' ? color(v) : null);
    if (!colors.length || colors.some(v => typeof v !== 'string' || !/^#[0-9a-f]{6}$/iu.test(v))
        || colors.some(v => v.toLowerCase() !== colors[0].toLowerCase())) {
      throw Error('Choose a measured opaque six-digit hex or RGB backdrop; omit unresolved context');
    }
    backdropColor = colors[0];
  }
  let layout;
  if (layoutChoice !== undefined) {
    if (!layoutChoice || typeof layoutChoice !== 'object' || Array.isArray(layoutChoice)
        || Object.keys(layoutChoice).some(key => !['intent', 'isFullWidth'].includes(key))
        || !buttonLayoutIntents.has(layoutChoice.intent)
        || ('isFullWidth' in layoutChoice && typeof layoutChoice.isFullWidth !== 'boolean')) {
      throw Error('Choose button layout explicitly with a schema-supported intent and optional boolean isFullWidth');
    }
    if (root.layout != null && (typeof root.layout !== 'object' || Array.isArray(root.layout))) {
      throw Error('Selected button root has malformed measured layout evidence');
    }
    layout = {intent: layoutChoice.intent,
      ...('isFullWidth' in layoutChoice ? {isFullWidth: layoutChoice.isFullWidth} : {})};
    for (const key of numericButtonLayoutFields) {
      const value = root.layout?.[key];
      if (value !== undefined) {
        if (value !== null && !Number.isFinite(value)) throw Error(`Selected button layout ${key} is not a measured number or null`);
        layout[key] = value;
      }
    }
    for (const key of stringButtonLayoutFields) {
      const value = root.layout?.[key];
      if (value != null) {
        if (typeof value !== 'string') throw Error(`Selected button layout ${key} is not a measured string`);
        layout[key] = value;
      }
    }
    if (root.lineHeightPx !== undefined) {
      if (root.lineHeightPx !== null && !Number.isFinite(root.lineHeightPx)) {
        throw Error('Selected button lineHeightPx is not a measured number or null');
      }
      layout.lineHeightPx = root.lineHeightPx;
    }
  }
  return {
    backgroundColor: paint.backgroundColor,
    ...(backdropColor !== undefined ? {backdropColor} : {}),
    fontColor: labelOwner == null ? null : color(measuredTextOwner(labelOwner).color),
    borderColor: paint.borderColor, borderWidth: paint.borderWidth,
    borderRadius: paint.borderRadius,
    padding: Object.fromEntries(sides.map(s => [s, root.paddingPx[s]])),
    description, ...(usageHints ? {usageHints} : {}), ...(layout ? {layout} : {}),
  };
}

// Derive the nested CTA from the SAME chosen button treatment. Action meaning,
// text source, visible-state claims and layout intent remain explicit decisions.
// No copied description, role hints, automatic label or visibility inference.
export function productCta(buttonStyle, authored = {}) {
  const fields = ['text', 'textSource', 'hasUsableVisibleText', 'isCompact', 'isIconLike', 'hasInlineIcon'];
  for (const key of Object.keys(authored)) {
    if (!fields.includes(key)) throw Error(`CTA authoring field ${key} is not a semantic label/shape choice; derive styling and layout from the chosen button`);
  }
  const projected = {...authored};
  for (const key of ['backgroundColor', 'backdropColor', 'fontColor', 'borderColor', 'borderWidth', 'borderRadius', 'padding',
    'hoverBackgroundColor', 'hoverFontColor', 'hoverBorderColor']) {
    if (buttonStyle[key] !== undefined) projected[key] = structuredClone(buttonStyle[key]);
  }
  if (buttonStyle.layout?.intent !== undefined) projected.layoutIntent = buttonStyle.layout.intent;
  return projected;
}

export function writeKit(kit, directory) {
  if (kit === null || typeof kit !== 'object' || Array.isArray(kit)) {
    throw Error('Assembly must return a kit object; return it from authorKit() instead of calling writeKit()');
  }
  const bytes = JSON.stringify(kit, null, 2) + '\n';
  const initial = path.join(directory, 'brandkit.initial.json');
  // Re-running a corrected assembly updates only the working kit.
  try { fs.writeFileSync(initial, bytes, {flag: 'wx'}); }
  catch (error) { if (error.code !== 'EEXIST') throw error; }
  fs.writeFileSync(path.join(directory, 'brandkit.json'), bytes);
}

// AUTHORING REGION START
// Replace only the guard inside authorKit; keep this guidance beside the editable body.
// fs and path are already imported above; these helpers are in this module.
// readSelection(file, index = 0) returns {root, textOwners, context, readiness, page, ...}.
// Choose actual rendered text from textOwners; root's inherited font or accessible
// name is not the label's measured tuple. A textless root cannot supply typography.
// readCaptureOwner(captureFile, captureId) joins one exact element/style and its
// same-element text/link. Raw capture JSON instead has separate elements, styles,
// textOwners, links and images arrays; join by styleId or ownerId, not array index.
// Available signatures: color(value); typography(owner, description?, usageHints?);
// textColor(owner, description, usageHints); surface(root);
// button(root, labelOwner, description, usageHints, layoutChoice, backdropOwner?);
// productCta(buttonStyle, authored).
// productCta authored accepts only text, textSource, hasUsableVisibleText,
// isCompact, isIconLike and hasInlineIcon. Pass a chosen button for its styling
// and layout; do not pass styling keys as authored fields.
// Example: const selected = readSelection(chosenControlFile);
// const label = selected.textOwners.find(t => t.text === 'the observed label');
// const chosen = button(selected.root, label, 'Measured control',
//   ['button-primary-background', 'button-primary-text'],
//   {intent: 'content-sized', isFullWidth: false});
// const cardSurface = readCaptureOwner(captureFile, chosenCardCaptureId);
// const destination = readCaptureOwner(captureFile, chosenLinkCaptureId).link.href;
// Keep chosen owners and source identity explicit; inspect raw borders/radii when
// projected scalar geometry is null. surface(cardSurface) and typography(titleOwner)
// serve nested card fields; nested typography has no description or hints.
// Derive oldPricePosition from the observed old/current-price owner geometry;
// choose recommendedVariantIndex separately from the existing email variant map.
// context.images is an array; choose the matching image deliberately.
// Choose button layout intent/isFullWidth from evidence; width ratio does not decide.
// Product action meaning/module index and fallback rationale are your decisions.
// CTA text-color hints use textColor(selectedLabel, ...), including a measured
// fallback label. An icon-only root's inherited color is not label evidence.
// The runner writes the returned object.
// Return a complete kit shaped like this:
// {
//   brand: {
//     organization: {name: '', website: ''}, logos: [],
//     colors: {accentColors: [], backgroundColors: [], textColors: []},
//     typography: [], components: {button: [], productCard: []},
//     brandVoice: {toneOfVoice: [], rulesToFollow: {allowed: [], forbidden: []}, defaultLanguages: [], styles: []},
//     businessContext: {customerValue: '', revenueModel: ''}, products: [],
//   },
//   contacts: {emails: [], phones: [], addresses: []},
//   socials: Object.fromEntries('facebook youtube instagram tiktok twitter x snapchat pinterest linkedin android apple rss yelp threads discord twitch whatsapp viber telegram messenger'.split(' ').map(k => [k, ''])),
//   importantLinks: [], languages: [],
// }
export function authorKit() {
  throw Error('Edit authorKit with this run’s sources and decisions before executing');
}
// AUTHORING REGION END

if (process.argv[1] && process.argv[1] !== '-' && import.meta.url === pathToFileURL(fs.realpathSync(process.argv[1])).href) {
  writeKit(authorKit(), process.argv[2] || path.dirname(path.resolve(process.argv[1])));
}

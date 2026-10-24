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
  const sameRoot = selected.textOwners.filter(owner => owner.isSelectedRoot === true);
  if (sameRoot.length > 1) throw Error('Ambiguous same-element inspection text');
  const textKeys = ['text', 'color', 'fontFamily', 'fontWeightNumber', 'fontSizePx',
    'lineHeightPx', 'fontStyle', 'letterSpacingPx', 'textTransform', 'textAlign', 'textDecorationLine'];
  const root = {...selected.root, ...(sameRoot.length ? Object.fromEntries(
    textKeys.filter(key => sameRoot[0][key] !== undefined).map(key => [key, sameRoot[0][key]])) : {})};
  return {...selected, root, ...(index === 0 && document.artwork !== undefined ? {artwork: document.artwork} : {}),
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

// One capture-scoped read for explicit source choices; no role or product inference.
export function readCaptureEvidence(file, {owners = [], roots = [], find = []} = {}) {
  if (!Array.isArray(owners) || !Array.isArray(roots) || !Array.isArray(find)
      || owners.length > 32 || roots.length > 16 || find.length > 8
      || owners.length + roots.length + find.length === 0) {
    throw Error('Choose up to 32 owners, 16 narrow roots, and 8 literal text lookups');
  }
  const capture = loadCapture(file);
  const byId = new Map();
  for (const element of capture.elements) {
    if (!element || typeof element.captureId !== 'string' || byId.has(element.captureId)) {
      throw Error(`Missing or ambiguous capture element identity at ${file}`);
    }
    byId.set(element.captureId, element);
  }
  const pick = (owner, keys) => Object.fromEntries(
    keys.filter(key => owner[key] !== undefined).map(key => [key, owner[key]]));
  const context = owner => ({
    ...pick(owner, ['captureId', 'ownerId', 'parentId', 'styleId', 'groupId', 'domOrder', 'tag', 'box',
      'classList', 'rendered', 'painted', 'display', 'visibility', 'contentVisibility',
      'position', 'overflowX', 'overflowY']),
    ...(owner.attributes ? {attributes: Object.fromEntries(Object.entries(owner.attributes)
      .filter(([, value]) => value !== null && value !== undefined && value !== ''))} : {}),
  });
  // Retain the assembly helpers' field names and exact values, without repeating
  // parsed/raw CSS copies. A query result can be used directly as a measured owner.
  const selected = owner => ({
    ...context(owner),
    ...pick(owner, ['text', 'color', 'backgroundColor', 'backgroundImage', 'opacity', 'boxShadow',
      'borders', 'borderRadii', 'paddingPx', 'layout', 'lineHeightPx', 'link']),
    ...(owner.text?.trim() ? pick(owner, ['fontFamily', 'fontWeightNumber', 'fontSizePx',
      'lineHeightPx', 'fontStyle', 'letterSpacingPx', 'textTransform', 'textAlign', 'textDecorationLine']) : {}),
    buttonCompatibility: buttonCompatibility(owner),
  });
  const textMeasurement = owner => ({...context(owner), ...pick(owner,
    ['text', 'color', 'backgroundColor', 'backgroundImage', 'opacity', 'fontFamily',
      'fontWeightNumber', 'fontSizePx', 'lineHeightPx', 'fontStyle', 'letterSpacingPx',
      'textTransform', 'textAlign', 'textDecorationLine'])});
  // Ancestry and structural rows preserve exact surface measurements, not text treatments.
  const ancestor = owner => ({
    ...context(owner),
    ...pick(owner, ['backgroundColor', 'backgroundImage', 'opacity', 'boxShadow', 'borders', 'borderRadii']),
  });
  const ownerResult = choice => {
    const {id, parents = 0} = choice ?? {};
    if (!Number.isInteger(parents) || parents < 0 || parents > 8) {
      throw Error('Choose an explicit ancestor depth between 0 and 8');
    }
    let owner = captureOwner(capture, id, file);
    const chosen = selected(owner), ancestry = [], seen = new Set([id]);
    for (let depth = 0; depth < parents && owner.parentId; depth++) {
      if (seen.has(owner.parentId)) throw Error(`Capture parent cycle at ${owner.parentId}`);
      seen.add(owner.parentId);
      owner = captureOwner(capture, owner.parentId, file);
      ancestry.push(ancestor(owner));
    }
    return {id, selected: chosen, ancestry, ancestryComplete: !owner.parentId};
  };
  const selectedOwners = owners.map(ownerResult);
  const found = find.map(({text, parents = 8} = {}) => {
    if (typeof text !== 'string' || !text.trim() || text.length > 500) {
      throw Error('Choose a nonempty literal observed text fragment of at most 500 characters');
    }
    const matches = capture.textOwners.filter(row => typeof row.text === 'string' && row.text.includes(text));
    if (matches.length > 32) throw Error('More than 32 literal text matches; narrow the observed fragment. No partial matches returned.');
    return {text, count: matches.length, matches: matches.map(row => ownerResult({id: row.ownerId, parents}))};
  });
  const children = new Map();
  for (const element of capture.elements) {
    if (!children.has(element.parentId)) children.set(element.parentId, []);
    children.get(element.parentId).push(element.captureId);
  }
  const selectedRoots = roots.map(choice => {
    const {id, measure = false} = typeof choice === 'string' ? {id: choice} : choice ?? {};
    if (typeof measure !== 'boolean') throw Error('Choose an explicit boolean for root measurements');
    const rootOwner = captureOwner(capture, id, file);
    const root = measure ? selected(rootOwner) : context(rootOwner);
    const included = new Set(), pending = [id];
    while (pending.length) {
      const current = pending.pop();
      if (included.has(current)) throw Error(`Capture parent cycle at ${current}`);
      included.add(current);
      pending.push(...(children.get(current) ?? []));
    }
    const controlRows = capture.elements.filter(row => included.has(row.captureId)
      && (['button', 'input', 'select', 'textarea'].includes(row.tag) || row.attributes?.role === 'button'));
    const measuredIds = new Set([id, ...controlRows.map(row => row.captureId),
      ...capture.textOwners.filter(row => included.has(row.ownerId)).map(row => row.ownerId)]);
    const textRows = capture.textOwners.filter(row => included.has(row.ownerId));
    const facts = {root, measure, links: capture.links.filter(row => included.has(row.ownerId)),
      images: (capture.images ?? []).filter(row => included.has(row.ownerId))};
    if (!measure) return {...facts, elements: [], controls: [], textOwners: textRows};
    return {...facts,
      elements: capture.elements.filter(element => included.has(element.captureId)
        && !measuredIds.has(element.captureId)).map(element => ancestor(captureOwner(capture, element.captureId, file))),
      textOwners: textRows.map(row => textMeasurement(captureOwner(capture, row.ownerId, file))),
      controls: controlRows.map(row => selected(captureOwner(capture, row.captureId, file)))};
  });
  const result = {captureFile: file, page: capture.page ?? null,
    identityScope: capture.identityScope ?? null, incomplete: capture.incomplete ?? null,
    counts: capture.counts ?? null,
    ...(capture.limits !== undefined ? {limits: capture.limits} : {}),
    ...(capture.limitations !== undefined ? {limitations: capture.limitations} : {}),
    ...(capture.omissions !== undefined ? {omissions: capture.omissions} : {}),
    owners: selectedOwners, roots: selectedRoots, found};
  const rows = selectedOwners.reduce((n, row) => n + 1 + row.ancestry.length, 0)
    + selectedRoots.reduce((n, row) => n + 1 + row.elements.length + row.textOwners.length
      + row.controls.length + row.links.length + row.images.length, 0)
    + found.reduce((n, group) => n + group.matches.reduce((m, row) => m + 1 + row.ancestry.length, 0), 0);
  const bytes = Buffer.byteLength(JSON.stringify(result));
  if (rows > 1024 || bytes > 128 * 1024) {
    throw Error(`Evidence request has ${rows} rows / ${bytes} bytes; narrow roots/owners (limits: 1024 rows / 131072 bytes). No partial region returned.`);
  }
  return result;
}

// Verify only the author-selected physical paint relationship, never the role.
export function readTextPair(file, textId, backgroundId) {
  const capture = loadCapture(file);
  const text = measuredTextOwner(captureOwner(capture, textId, file));
  const background = captureOwner(capture, backgroundId, file);
  const fill = color(background.backgroundColor);
  if (typeof fill !== 'string' || !/^#[0-9a-f]{6}$/iu.test(fill)) {
    throw Error('Text pair requires an explicitly chosen opaque solid background');
  }
  const transparent = value => value === 'transparent' || /^rgba\(\s*\d+(?:\.\d+)?\s*,\s*\d+(?:\.\d+)?\s*,\s*\d+(?:\.\d+)?\s*,\s*0(?:\.0+)?\s*\)$/u.test(value);
  const seen = new Set();
  let current = text;
  while (true) {
    if (seen.has(current.captureId)) throw Error('Text pair has a capture parent cycle');
    seen.add(current.captureId);
    if (current.backgroundImage !== 'none' || !['1', 1].includes(current.opacity)) {
      throw Error('Text pair has unresolved background-image or opacity');
    }
    if (current.captureId === backgroundId) break;
    if (!transparent(current.backgroundColor)) {
      throw Error('Text pair crosses intervening paint; select the actual text backdrop');
    }
    if (!current.parentId) throw Error('Selected background is not a same-element or ancestor text backdrop');
    current = captureOwner(capture, current.parentId, file);
  }
  const a = text.box, b = background.box;
  if (!a || !b || ![a.x,a.y,a.width,a.height,b.x,b.y,b.width,b.height].every(Number.isFinite)
      || a.width <= 0 || a.height <= 0 || b.width <= 0 || b.height <= 0
      || a.x < b.x - 0.5 || a.y < b.y - 0.5
      || a.x + a.width > b.x + b.width + 0.5 || a.y + a.height > b.y + b.height + 0.5) {
    throw Error('Selected text backdrop does not cover the measured text box');
  }
  return {text, background};
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

function buttonCompatibility(root) {
  const paint = surface(root), reasons = [];
  if (paint.borderColor == null || paint.borderStyle == null || !Number.isFinite(paint.borderWidth))
    reasons.push('missing or asymmetric border');
  if (paint.borderWidth > 0 && paint.borderStyle !== 'solid') reasons.push('non-solid visible border');
  if (!Number.isFinite(paint.borderRadius)) reasons.push('missing or asymmetric corner radii');
  if (!sides.every(side => Number.isFinite(root.paddingPx?.[side]))) reasons.push('missing padding');
  return {supported: reasons.length === 0, reasons};
}

// Pass null for an icon-only control's label. Choose a fallback control separately;
// these helpers never infer an action from accessibleName, class names or shape.
export function button(root, labelOwner, description, usageHints, layoutChoice, backdropOwner) {
  const paint = surface(root);
  const compatibility = buttonCompatibility(root);
  if (!compatibility.supported) {
    throw Error(`Button schema cannot represent missing/asymmetric geometry or non-solid visible borders: ${compatibility.reasons.join('; ')}; choose another evidenced component or omit it`);
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
  // The consumer reads the surface tuple. Legacy duplicate fields cannot repair
  // a contradictory surface, and copying them into it would mix selected owners.
  const cards = kit.brand?.components?.productCard;
  for (const [index, card] of (Array.isArray(cards) ? cards : []).entries()) {
    for (const key of ['borderWidth', 'borderColor']) {
      if (card?.[key] == null) continue;
      const value = v => key === 'borderColor' && typeof v === 'string' ? color(v).toLowerCase() : v;
      if (value(card[key]) !== value(card.surface?.[key])) {
        throw Error(`productCard[${index}].${key} lacks or conflicts with surface.${key}; select the visible card perimeter and derive all border fields from that same complete surface tuple`);
      }
    }
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
// Optional readCaptureEvidence(captureFile, {owners, roots, find}) groups selected
// facts from one capture. Query only needed evidence; no fixed batch count or order.
// found[].matches retains ALL literal matches/counts; choose IDs after reviewing them.
// A measured representative root includes exact text/control styles; other roots
// return only source-owned product facts (text/links/images), without repeated styles.
// selected.buttonCompatibility reports schema geometry limits before assembly.
// Select ordinary header navigation and its surrounding band, not a standalone control.
// Optional readTextPair(captureFile, textId, backgroundId) checks a supported solid
// pair, not semantic roles. Do not add browser work solely to satisfy this helper.
// Use its .text for typography/textColor and .background for header-background.
// Select measured ordinary content paint independently of body typography.
// Emit selected header-background/content-background rows in backgroundColors;
// equal colors retain distinct supported roles. Omit only an unresolved surface,
// recording its gap; do not substitute a button, card fill or brand accent.
// Returns owners[{id,selected,ancestry}]; selected uses the same measured field names
// as readCaptureOwner and works directly with surface/typography/button. Ancestry is
// compact paint/geometry context; roots[{root,elements,textOwners,controls,links,images}]
// preserve nonempty attributes, including accessible labels. Textless owners cannot
// supply typography even when they have inherited fonts or an accessible label.
// It preserves source metadata, rejects oversized requests, and never chooses roles.
// Available signatures: color(value); typography(owner, description?, usageHints?);
// textColor(owner, description, usageHints); surface(root);
// button(root, labelOwner, description, usageHints, layoutChoice, backdropOwner?);
// productCta(buttonStyle, authored).
// productCta authored accepts only text, textSource, hasUsableVisibleText,
// isCompact, isIconLike and hasInlineIcon. Pass a chosen button for its styling
// and layout; do not pass styling keys as authored fields.
// An icon-only cartStyle is an intermediate for productCta, NOT an additional
// components.button entry. Top-level buttons are separately chosen reusable styles.
// Preserve cart.attributes.ariaLabel as text with textSource:'aria-label',
// hasUsableVisibleText:false; null label owner keeps its fontColor:null.
// Example: const selected = readSelection(chosenControlFile);
// const label = selected.textOwners.find(t => t.text === 'the observed label');
// const chosen = button(selected.root, label, 'Measured control',
//   ['button-primary-background', 'button-primary-text'],
//   {intent: 'content-sized', isFullWidth: false});
// const cardSurface = readCaptureOwner(captureFile, chosenPerimeterCaptureId);
// Select the visible card perimeter using its image and exact border/radius evidence.
// Put surface(cardSurface) in productCard.surface, the tuple consumed by the builder.
// Keep this owner's whole tuple, even if transparent; do not replace it with an
// inner fill-only panel. Record separately measured inner paint as a color hint.
// Omit legacy productCard.borderWidth/borderColor, or derive identical duplicates
// from this same surface. Missing or conflicting canonical border fields fail before any kit is written.
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

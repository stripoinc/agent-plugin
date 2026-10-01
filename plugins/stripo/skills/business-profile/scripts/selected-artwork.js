import {createHash} from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import {SaxesParser} from 'saxes';

import {
  collectLogoAssets,
  LOGO_ASSET_MAX_BYTES,
} from './lib/logo-asset-capture.js';

export const INLINE_ARTWORK_EMAIL_CAVEAT =
    'Local SVG preservation only. The public URL is empty; hosting or an approved public image URL is still required before email use.';

export const IMAGE_ARTWORK_EMAIL_CAVEAT =
    'The current image resource URL was observed on the selected image. It was not downloaded, exported, hosted, or tested in an email client.';

export const PRESERVED_IMAGE_ARTWORK_EMAIL_CAVEAT =
    'Exact browser response bytes were preserved as technical evidence. Hosting or an approved email-safe public URL is still required when the selected format is not email-safe.';

export const CSS_BACKGROUND_ARTWORK_EMAIL_CAVEAT =
    'Exact bytes for the selected element\'s CSS background resource were preserved with its computed rendering context. This is a source resource, not a rendered pixel export; reproduce or deliberately adapt that context before email use.';

export const CSS_BACKGROUND_UNPRESERVED_EMAIL_CAVEAT =
    'The selected element\'s CSS background source and rendering context remain diagnostic evidence only. No reusable resource was authorized because exact acceptable bytes were not preserved.';

const LOGO_MANIFEST = 'logo-assets.json';
const MAX_SELECTED_ARTWORK_ENTRIES = 128;
const MAX_OBSERVED_ASSET_URLS = 128;
const MAX_SKIPPED_ROWS = 128;

// Runs in the page realm. It deliberately accepts only the selected node: it
// never searches a wrapper, follows a link, ranks candidates, or fetches data.
export function selectedArtworkProbe(selected,
                                     captureSelectedInlineSvgArtwork) {
  const root = selected?.nodeType === 3 ? selected.parentElement : selected;
  const tag = String(root?.localName || '').toLowerCase();
  if (tag === 'svg') {
    return {
      kind : 'inline-svg',
      capture : captureSelectedInlineSvgArtwork(root, {
        maxChars : 262144,
        maxUsePasses : 4,
        maxDefPasses : 4,
      }),
    };
  }
  if (tag === 'img') {
    const currentSrc = String(root.currentSrc || root.src || '');
    return {
      kind : 'image-resource',
      status : currentSrc ? 'captured' : 'suppressed',
      currentSrc,
      diagnostics :
          currentSrc
              ? []
              : [ {reason : 'selected-image-resource-empty', detail : 0} ],
    };
  }

  if (!root || typeof getComputedStyle !== 'function')
    return null;

  const styleValue = (style, property, fallback = '') => {
    const value = style?.[property];
    return typeof value === 'string' && value.trim() ? value.trim() : fallback;
  };
  const splitLayers = value => {
    const layers = [];
    let start = 0;
    let depth = 0;
    let quote = '';
    let escaped = false;
    for (let index = 0; index < value.length; index += 1) {
      const character = value[index];
      if (escaped) {
        escaped = false;
        continue;
      }
      if (character === '\\') {
        escaped = true;
        continue;
      }
      if (quote) {
        if (character === quote)
          quote = '';
        continue;
      }
      if (character === '"' || character === "'") {
        quote = character;
        continue;
      }
      if (character === '(') {
        depth += 1;
      } else if (character === ')' && depth > 0) {
        depth -= 1;
      } else if (character === ',' && depth === 0) {
        layers.push(value.slice(start, index).trim());
        start = index + 1;
      }
    }
    layers.push(value.slice(start).trim());
    return layers.filter(Boolean);
  };
  const singleUrl = layer => {
    const match = String(layer || '').match(/^url\(\s*([\s\S]*)\s*\)$/iu);
    if (!match)
      return '';
    let value = match[1].trim();
    const quote = value[0];
    if ((quote === '"' || quote === "'") && value.at(-1) === quote) {
      value = value.slice(1, -1).replace(/\\([\\"'])/gu, '$1');
    } else if (/[\s"']/u.test(value)) {
      return '';
    }
    return value;
  };
  const percentagePositionIsContained = value => {
    const parts = String(value || '').trim().split(/\s+/u);
    return parts.length === 2 && parts.every(part => {
      const match = part.match(/^(-?(?:\d+(?:\.\d+)?|\.\d+))%$/u);
      if (!match)
        return false;
      const amount = Number(match[1]);
      return amount >= 0 && amount <= 100;
    });
  };
  const clipContainsOrigin = (origin, clip) => {
    const boxes = {'content-box' : 0, 'padding-box' : 1, 'border-box' : 2};
    return Object.hasOwn(boxes, origin) && Object.hasOwn(boxes, clip) &&
           boxes[clip] >= boxes[origin];
  };
  const zeroRadius = value => {
    const parts = String(value || '').match(/-?(?:\d+(?:\.\d+)?|\.\d+)/gu);
    return Array.isArray(parts) && parts.length > 0 &&
           parts.every(part => Number(part) === 0);
  };
  const backgroundContext = (style, pseudoElement = null) => {
    const rect = typeof root.getBoundingClientRect === 'function'
                     ? root.getBoundingClientRect()
                     : null;
    return {
      pseudoElement,
      backgroundImage : styleValue(style, 'backgroundImage', 'none'),
      backgroundSize : styleValue(style, 'backgroundSize', 'auto'),
      backgroundPosition : styleValue(style, 'backgroundPosition', '0% 0%'),
      backgroundRepeat : styleValue(style, 'backgroundRepeat', 'repeat'),
      backgroundOrigin : styleValue(style, 'backgroundOrigin', 'padding-box'),
      backgroundClip : styleValue(style, 'backgroundClip', 'border-box'),
      backgroundAttachment : styleValue(style, 'backgroundAttachment', 'scroll'),
      backgroundColor : styleValue(style, 'backgroundColor', 'rgba(0, 0, 0, 0)'),
      borderRadius : styleValue(style, 'borderRadius', '0px'),
      clipPath : styleValue(style, 'clipPath', 'none'),
      maskImage : styleValue(style, 'maskImage', 'none'),
      elementWidth : Number.isFinite(rect?.width) ? rect.width : null,
      elementHeight : Number.isFinite(rect?.height) ? rect.height : null,
      representation : 'source-resource',
      renderedPixelExport : false,
    };
  };

  const style = getComputedStyle(root);
  const context = backgroundContext(style);
  const layers = splitLayers(context.backgroundImage);
  const ownUrl = layers.length === 1 ? singleUrl(layers[0]) : '';
  const pseudoSources = [ '::before', '::after' ].map(pseudoElement => {
    const pseudoStyle = getComputedStyle(root, pseudoElement);
    const pseudoContext = backgroundContext(pseudoStyle, pseudoElement);
    const pseudoLayers = splitLayers(pseudoContext.backgroundImage);
    return {
      pseudoElement,
      backgroundImage : pseudoContext.backgroundImage,
      hasImage : pseudoLayers.some(layer => layer.toLowerCase() !== 'none'),
    };
  }).filter(item => item.hasImage);

  if (layers.length === 1 && layers[0].toLowerCase() === 'none' &&
      pseudoSources.length === 0) {
    return null;
  }

  const diagnostics = [];
  if (pseudoSources.length > 0) {
    diagnostics.push({
      reason : ownUrl ? 'selected-background-pseudo-composition-unsupported'
                      : 'selected-background-pseudo-element-unsupported',
      detail : pseudoSources.map(item => item.pseudoElement).join(','),
    });
  }
  if (layers.length !== 1) {
    diagnostics.push({
      reason : 'selected-background-multilayer-unsupported',
      detail : layers.length,
    });
  } else if (!ownUrl && layers[0].toLowerCase() !== 'none') {
    diagnostics.push({
      reason : 'selected-background-non-resource-layer-unsupported',
      detail : layers[0].slice(0, 80),
    });
  }

  const repeat = context.backgroundRepeat.toLowerCase();
  if (repeat !== 'no-repeat' && repeat !== 'no-repeat no-repeat') {
    diagnostics.push({
      reason : 'selected-background-repeat-unsupported',
      detail : context.backgroundRepeat,
    });
  }
  const size = context.backgroundSize.toLowerCase();
  if (size !== 'contain' && !/^100(?:\.0+)?%\s+100(?:\.0+)?%$/u.test(size)) {
    diagnostics.push({
      reason : size === 'auto' || size === 'auto auto'
                   ? 'selected-background-auto-size-unproven'
                   : 'selected-background-size-unsupported',
      detail : context.backgroundSize,
    });
  }
  if (!percentagePositionIsContained(context.backgroundPosition)) {
    diagnostics.push({
      reason : 'selected-background-position-ambiguous',
      detail : context.backgroundPosition,
    });
  }
  if (!clipContainsOrigin(context.backgroundOrigin,
                          context.backgroundClip)) {
    diagnostics.push({
      reason : 'selected-background-box-crop-ambiguous',
      detail : `${context.backgroundOrigin}/${context.backgroundClip}`,
    });
  }
  if (context.backgroundAttachment.toLowerCase() !== 'scroll') {
    diagnostics.push({
      reason : 'selected-background-attachment-unsupported',
      detail : context.backgroundAttachment,
    });
  }
  if (!zeroRadius(context.borderRadius) ||
      context.clipPath.toLowerCase() !== 'none' ||
      context.maskImage.toLowerCase() !== 'none') {
    diagnostics.push({
      reason : 'selected-background-rendering-clip-unsupported',
      detail : `${context.borderRadius}/${context.clipPath}/${context.maskImage}`,
    });
  }

  const captured = Boolean(ownUrl) && diagnostics.length === 0;
  return {
    kind : 'css-background-resource',
    status : captured ? 'captured' : 'suppressed',
    currentSrc : captured ? ownUrl : '',
    renderingContext : {
      ...context,
      resourceUrl : ownUrl,
      pseudoBackgrounds : pseudoSources,
    },
    diagnostics,
  };
}

function publicArtifactPath(localPath, runRoot) {
  if (!localPath)
    return null;
  const relative = path.relative(runRoot, localPath);
  if (!relative || relative.startsWith('..') || path.isAbsolute(relative)) {
    throw Error('Artwork path escaped the run output directory');
  }
  return path.join(runRoot, relative);
}

function safeStem(value) {
  const stem = String(value || 'selected')
                   .replace(/\.json$/i, '')
                   .replace(/[^a-z0-9_-]+/giu, '-');
  return stem || 'selected';
}

function boundedText(value, maxChars = 4096) {
  const text = typeof value === 'string' ? value : '';
  return text.length <= maxChars ? text : text.slice(0, maxChars);
}

function normalizeRenderingContext(value) {
  if (!value || typeof value !== 'object')
    return null;
  const textFields = [
    'backgroundImage', 'backgroundSize', 'backgroundPosition',
    'backgroundRepeat', 'backgroundOrigin', 'backgroundClip',
    'backgroundAttachment', 'backgroundColor', 'borderRadius', 'clipPath',
    'maskImage', 'representation', 'resourceUrl',
  ];
  const normalized = {};
  for (const field of textFields)
    normalized[field] = boundedText(value[field]);
  normalized.pseudoElement = value.pseudoElement === '::before' ||
                                     value.pseudoElement === '::after'
                                 ? value.pseudoElement
                                 : null;
  normalized.elementWidth = Number.isFinite(value.elementWidth)
                                ? value.elementWidth
                                : null;
  normalized.elementHeight = Number.isFinite(value.elementHeight)
                                 ? value.elementHeight
                                 : null;
  normalized.renderedPixelExport = false;
  normalized.pseudoBackgrounds =
      Array.isArray(value.pseudoBackgrounds)
          ? value.pseudoBackgrounds.slice(0, 2).map(item => ({
              pseudoElement : item?.pseudoElement === '::before' ||
                                      item?.pseudoElement === '::after'
                                  ? item.pseudoElement
                                  : null,
              backgroundImage : boundedText(item?.backgroundImage),
              hasImage : Boolean(item?.hasImage),
            }))
          : [];
  return normalized;
}

function embeddedSvgDataUri(value) {
  return /^data:image\/svg\+xml(?:[;,]|$)/iu.test(String(value || ''));
}

function decodedBase64(payload) {
  const compact = String(payload || '');
  if (compact.length > Math.ceil(LOGO_ASSET_MAX_BYTES / 3) * 4)
    return {overCap : true};
  if (!/^(?:[a-z0-9+/]{4})*(?:[a-z0-9+/]{2}(?:==)?|[a-z0-9+/]{3}=?)?$/iu.test(
          compact) ||
      compact.length % 4 === 1) {
    return null;
  }
  const unpadded = compact.replace(/=+$/u, '');
  const estimatedBytes = Math.floor((unpadded.length * 3) / 4);
  if (estimatedBytes > LOGO_ASSET_MAX_BYTES)
    return {overCap : true};
  const decoded = Buffer.from(
      unpadded.padEnd(Math.ceil(unpadded.length / 4) * 4, '='), 'base64');
  if (decoded.toString('base64').replace(/=+$/u, '') !== unpadded)
    return null;
  return {buffer : decoded};
}

function decodedPercentPayload(payload) {
  if (payload.length > LOGO_ASSET_MAX_BYTES * 3)
    return {overCap : true};
  try {
    const buffer = Buffer.from(decodeURIComponent(payload), 'utf8');
    return buffer.length > LOGO_ASSET_MAX_BYTES ? {overCap : true} : {buffer};
  } catch {
    return null;
  }
}

// This is deliberately only a data:image/svg+xml byte decoder. The existing
// collector remains the parser, safety screen, shape reducer, and size
// authority.
function decodeEmbeddedSvgDataUri(value) {
  const uri = String(value || '');
  const comma = uri.indexOf(',');
  if (comma < 0)
    return {reason : 'selected-data-svg-malformed', detail : 'missing-comma'};
  const header = uri.slice(0, comma);
  const payload = uri.slice(comma + 1);
  const headerMatch = header.match(
      /^data:image\/svg\+xml(?:;[!#$%&'*+.^_`|~0-9a-z-]+=(?:[!#$%&'*+.^_`|~0-9a-z-]+|"(?:[^"\\\r\n]|\\.)*"))*(;base64)?$/iu,
  );
  if (!headerMatch)
    return {
      reason : 'selected-data-svg-malformed',
      detail : 'invalid-media-header'
    };

  const decoded =
      headerMatch[1] ? decodedBase64(payload) : decodedPercentPayload(payload);
  if (decoded?.overCap) {
    return {reason : 'body-over-cap', detail : LOGO_ASSET_MAX_BYTES};
  }
  if (!decoded?.buffer)
    return {reason : 'selected-data-svg-malformed', detail : 'invalid-payload'};
  if (decoded.buffer.length > LOGO_ASSET_MAX_BYTES) {
    return {reason : 'body-over-cap', detail : decoded.buffer.length};
  }
  try {
    return {
      markup : new TextDecoder('utf-8', {fatal : true}).decode(decoded.buffer),
      byteLength : decoded.buffer.length,
    };
  } catch {
    return {
      reason : 'selected-data-svg-malformed',
      detail : 'payload-not-utf8'
    };
  }
}

function isStandaloneSvgDocument(markup) {
  let depth = 0;
  let rootCount = 0;
  let valid = true;
  const parser = new SaxesParser({xmlns : true});
  parser.on('error', () => { valid = false; });
  parser.on('opentag', (tag) => {
    if (depth === 0) {
      rootCount += 1;
      if (tag.local.toLowerCase() !== 'svg' ||
          tag.uri !== 'http://www.w3.org/2000/svg')
        valid = false;
    }
    if (tag.uri !== 'http://www.w3.org/2000/svg')
      valid = false;
    depth += 1;
  });
  parser.on('closetag', () => { depth -= 1; });
  try {
    parser.write(markup).close();
  } catch {
    return false;
  }
  return valid && rootCount === 1 && depth === 0;
}

function confinedRelativePath(localPath, root) {
  if (!localPath)
    return '';
  const relative = path.relative(root, localPath);
  if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) ||
      path.isAbsolute(relative)) {
    throw Error('Logo asset path escaped its technical directory');
  }
  return relative;
}

function emptyManifest() {
  return {
    artifact : 'logo-assets',
    version : 1,
    status : 'empty',
    generatedAtMs : Date.now(),
    observedAssetUrls : [],
    entries : [],
    skipped : [],
    counts : {
      retained : 0,
      browserFetches : 0,
      suppressed : 0,
      inline : 0,
      raster : 0,
    },
    error : null,
  };
}

async function readManifest(runRoot) {
  try {
    const parsed = JSON.parse(
        await fs.readFile(path.join(runRoot, LOGO_MANIFEST), 'utf8'));
    if (parsed?.artifact !== 'logo-assets' || parsed?.version !== 1 ||
        !Array.isArray(parsed.entries) || !Array.isArray(parsed.skipped) ||
        !Array.isArray(parsed.observedAssetUrls)) {
      throw Error('Existing logo-assets.json has an unsupported shape');
    }
    return parsed;
  } catch (error) {
    if (error?.code === 'ENOENT')
      return emptyManifest();
    throw error;
  }
}

async function reserveSelectionDirectory(runRoot, selectionFile) {
  const parent = path.join(runRoot, 'logo-assets');
  await fs.mkdir(parent, {recursive : true});
  const stem = safeStem(selectionFile).slice(0, 80);
  for (let suffix = 1; suffix <= MAX_SELECTED_ARTWORK_ENTRIES + 1;
       suffix += 1) {
    const selectionId = `${stem}-${String(suffix).padStart(3, '0')}`;
    const directory = path.join(parent, selectionId);
    try {
      await fs.mkdir(directory);
      return {selectionId, directory};
    } catch (error) {
      if (error?.code !== 'EEXIST')
        throw error;
    }
  }
  throw Error('Selected artwork directory limit reached');
}

async function sha256File(file) {
  if (!file)
    return '';
  return createHash('sha256').update(await fs.readFile(file)).digest('hex');
}

async function normalizeEntry(entry, runRoot, selectionId, sourceKind,
                              renderingContext) {
  let svgPathSha256 =
      typeof entry.svgPath === 'string' && entry.svgPath
          ? createHash('sha256').update(entry.svgPath).digest('hex')
          : '';
  if (entry.sidecarPath) {
    const sidecar = JSON.parse(await fs.readFile(entry.sidecarPath, 'utf8'));
    if (typeof sidecar.svgPathSha256 === 'string' && sidecar.svgPathSha256)
      svgPathSha256 = sidecar.svgPathSha256;
  }
  return {
    ...entry,
    selectionId,
    sourceKind,
    ...(renderingContext ? {renderingContext} : {}),
    sha256 : await sha256File(entry.localPath),
    svgPathSha256,
    localPath : confinedRelativePath(entry.localPath, runRoot),
    sidecarPath : confinedRelativePath(entry.sidecarPath, runRoot),
  };
}

function boundedSkipped(rows) {
  if (rows.length <= MAX_SKIPPED_ROWS)
    return rows;
  const kept = rows.slice(0, MAX_SKIPPED_ROWS - 1);
  kept.push({
    url : '',
    reason : 'skipped-truncated',
    detail : rows.length - kept.length,
  });
  return kept;
}

async function appendManifest(runRoot, {
  artifact,
  observedAssetUrls = [],
  selectionId,
  sourceKind,
  renderingContext = null,
  additionalSkipped = [],
}) {
  const manifest = await readManifest(runRoot);
  const observed = [...manifest.observedAssetUrls ];
  for (const value of observedAssetUrls) {
    if (!observed.includes(value) && observed.length < MAX_OBSERVED_ASSET_URLS)
      observed.push(value);
  }
  const normalized = [];
  for (const entry of Array.isArray(artifact?.entries) ? artifact.entries
                                                       : []) {
    normalized.push(
        await normalizeEntry(
            entry, runRoot, selectionId, sourceKind, renderingContext));
  }
  if (manifest.entries.length + normalized.length >
      MAX_SELECTED_ARTWORK_ENTRIES) {
    throw Error('Selected artwork manifest entry limit reached');
  }
  const newSkipped = [
    ...(Array.isArray(artifact?.skipped) ? artifact.skipped : []),
    ...additionalSkipped,
  ].map(row => ({...row, selectionId, sourceKind}));
  const skipped = [...manifest.skipped, ...newSkipped ];
  const entries = [...manifest.entries, ...normalized ];
  const next = {
    ...manifest,
    status : entries.length ? 'completed' : 'empty',
    generatedAtMs : Date.now(),
    observedAssetUrls : observed,
    entries,
    skipped : boundedSkipped(skipped),
    counts : {
      retained : entries.length,
      browserFetches : 0,
      suppressed : entries.filter(entry => entry.svgPathSuppressed).length,
      inline : entries
                   .filter(entry => entry.sourceKind === 'inline-svg' ||
                                    entry.sourceKind === 'embedded-svg-image')
                   .length,
      raster : entries.filter(entry => entry.kind === 'raster').length,
    },
    error : null,
  };
  const target = path.join(runRoot, LOGO_MANIFEST);
  const temporary = `${target}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(temporary, `${JSON.stringify(next, null, 2)}\n`, 'utf8');
  await fs.rename(temporary, target);
  return normalized[0] || null;
}

export async function preserveSelectedArtwork(probe, {
  runRoot,
  selectionFile = 'selected.json',
  networkResource = null,
} = {}) {
  if (probe == null)
    return null;
  if (!path.isAbsolute(runRoot || ''))
    throw Error('Artwork persistence requires an absolute runRoot');
  const manifest = await readManifest(runRoot);
  if (manifest.entries.length >= MAX_SELECTED_ARTWORK_ENTRIES)
    throw Error('Selected artwork manifest entry limit reached');
  const {selectionId, directory} =
      await reserveSelectionDirectory(runRoot, selectionFile);
  const technicalDirectory = runRoot;
  const selectedKind = probe.kind;
  const renderingContext = selectedKind === 'css-background-resource'
                               ? normalizeRenderingContext(
                                     probe.renderingContext)
                               : null;

  if (selectedKind === 'css-background-resource' &&
      probe.status !== 'captured') {
    const diagnostics =
        Array.isArray(probe.diagnostics) ? [...probe.diagnostics ] : [];
    const skipped = diagnostics.length
                        ? diagnostics.map((row, index) =>
                                              index === 0 && renderingContext
                                                  ? {...row, renderingContext}
                                                  : row)
                        : [ {
                            reason : 'selected-background-resource-suppressed',
                            detail : 0,
                            ...(renderingContext ? {renderingContext} : {}),
                          } ];
    await appendManifest(runRoot, {
      artifact : null,
      selectionId,
      sourceKind : selectedKind,
      additionalSkipped : skipped,
    });
    return {
      status : 'suppressed',
      kind : selectedKind,
      url : '',
      svgPath : '',
      originalSourceFile : null,
      derivedFile : null,
      sidecarFile : null,
      technicalDirectory,
      renderingContext,
      diagnostics,
      emailReadinessCaveat : CSS_BACKGROUND_UNPRESERVED_EMAIL_CAVEAT,
    };
  }

  if (probe.kind === 'image-resource' ||
      probe.kind === 'css-background-resource') {
    const currentSrc =
        typeof probe.currentSrc === 'string' ? probe.currentSrc : '';
    if (selectedKind === 'css-background-resource' &&
        embeddedSvgDataUri(currentSrc)) {
      const diagnostics = [
        ...(Array.isArray(probe.diagnostics) ? probe.diagnostics : []),
        {reason : 'selected-background-data-svg-unsupported', detail : 0},
      ];
      await appendManifest(runRoot, {
        artifact : null,
        selectionId,
        sourceKind : selectedKind,
        additionalSkipped : diagnostics.map((row, index) =>
                                                index === 0 && renderingContext
                                                    ? {...row, renderingContext}
                                                    : row),
      });
      return {
        status : 'suppressed',
        kind : selectedKind,
        url : '',
        svgPath : '',
        originalSourceFile : null,
        derivedFile : null,
        sidecarFile : null,
        technicalDirectory,
        renderingContext,
        diagnostics,
        emailReadinessCaveat : CSS_BACKGROUND_UNPRESERVED_EMAIL_CAVEAT,
      };
    }
    if (embeddedSvgDataUri(currentSrc)) {
      const decoded = decodeEmbeddedSvgDataUri(currentSrc);
      if (typeof decoded.markup === 'string') {
        probe = {
          kind : 'embedded-svg-image',
          capture : {
            status : 'captured',
            originalSourceMarkup : decoded.markup,
            completeSvgMarkup : decoded.markup,
            notes : {decodedDataImage : true, byteLength : decoded.byteLength},
            diagnostics : [],
          },
        };
      } else {
        await appendManifest(runRoot, {
          artifact : null,
          selectionId,
          sourceKind : 'embedded-svg-image',
          additionalSkipped : [ {
            url : '',
            reason : decoded.reason,
            detail : decoded.detail,
          } ],
        });
        return {
          status : 'suppressed',
          kind : 'image-resource',
          url : '',
          svgPath : '',
          originalSourceFile : null,
          derivedFile : null,
          sidecarFile : null,
          technicalDirectory,
          diagnostics : [ {reason : decoded.reason, detail : decoded.detail} ],
          emailReadinessCaveat : INLINE_ARTWORK_EMAIL_CAVEAT,
        };
      }
    } else {
      let url = null;
      try {
        url = new URL(currentSrc);
      } catch {
        // The selected resource is reported honestly below as unsupported.
      }
      const isPublicResource =
          url && (url.protocol === 'http:' || url.protocol === 'https:') &&
          !url.username && !url.password;
      const diagnostics =
          Array.isArray(probe.diagnostics) ? [...probe.diagnostics ] : [];
      let artifact = null;
      if (isPublicResource && networkResource?.status === 'captured' &&
          networkResource.url === currentSrc &&
          Buffer.isBuffer(networkResource.buffer)) {
        const cache = {
          settle : async () => ({
            entries : [ {
              url : currentSrc,
              contentType : networkResource.contentType || '',
              buffer : networkResource.buffer,
            } ],
            skipped : [],
            totalBytes : networkResource.buffer.length,
          }),
        };
        artifact = await collectLogoAssets({
          cache,
          context : null,
          candidateUrls : [ currentSrc ],
          contentTypeByUrl : {
            [currentSrc] : networkResource.contentType || '',
          },
          outDir : directory,
          maxBrowserFetches : 0,
          retainEmailSafeRaster :
              selectedKind === 'css-background-resource',
        });
      } else if (isPublicResource && networkResource?.reason) {
        diagnostics.push({
          reason : 'selected-network-body-unavailable',
          detail : networkResource.reason,
        });
      } else if (!isPublicResource) {
        diagnostics.push({
          reason : 'selected-image-resource-url-unsupported',
          detail : 0,
        });
      }
      const entry = await appendManifest(runRoot, {
        artifact,
        observedAssetUrls :
            isPublicResource &&
                    (selectedKind !== 'css-background-resource' ||
                     (Array.isArray(artifact?.entries) &&
                      artifact.entries.length > 0))
                ? [ currentSrc ]
                : [],
        selectionId,
        sourceKind : selectedKind,
        renderingContext,
        additionalSkipped : diagnostics,
      });
      if (selectedKind === 'css-background-resource' && !entry) {
        for (const row of Array.isArray(artifact?.skipped) ? artifact.skipped
                                                           : []) {
          diagnostics.push({
            reason : row.reason || 'selected-background-resource-unavailable',
            detail : row.detail ?? '',
          });
        }
      }
      return {
        status : probe.status === 'captured' && isPublicResource &&
                         (selectedKind !== 'css-background-resource' || entry)
                     ? 'captured'
                     : 'suppressed',
        kind : selectedKind,
        url : isPublicResource &&
                      (selectedKind !== 'css-background-resource' || entry)
                  ? currentSrc
                  : '',
        svgPath : entry?.svgPathSuppressed ? '' : entry?.svgPath || '',
        originalSourceFile : null,
        derivedFile : publicArtifactPath(
            entry?.localPath && path.join(runRoot, entry.localPath), runRoot),
        sidecarFile : publicArtifactPath(
            entry?.sidecarPath && path.join(runRoot, entry.sidecarPath),
            runRoot),
        technicalDirectory,
        renderingContext,
        diagnostics,
        emailReadinessCaveat :
            selectedKind === 'css-background-resource'
                ? entry ? CSS_BACKGROUND_ARTWORK_EMAIL_CAVEAT
                        : CSS_BACKGROUND_UNPRESERVED_EMAIL_CAVEAT
                : entry ? PRESERVED_IMAGE_ARTWORK_EMAIL_CAVEAT
                        : IMAGE_ARTWORK_EMAIL_CAVEAT,
      };
    }
  }

  if (probe.kind !== 'inline-svg' && probe.kind !== 'embedded-svg-image') {
    const diagnostics = [ {
      reason : 'selected-artwork-kind-unsupported',
      detail : String(probe.kind || '')
    } ];
    await appendManifest(runRoot, {
      artifact : null,
      selectionId,
      sourceKind : 'unknown',
      additionalSkipped : diagnostics,
    });
    return {
      status : 'suppressed',
      kind : 'unknown',
      url : '',
      svgPath : '',
      originalSourceFile : null,
      derivedFile : null,
      sidecarFile : null,
      technicalDirectory,
      diagnostics,
      emailReadinessCaveat : INLINE_ARTWORK_EMAIL_CAVEAT,
    };
  }

  const capture =
      probe.capture && typeof probe.capture === 'object' ? probe.capture : {};
  const sourceMarkup = typeof capture.originalSourceMarkup === 'string'
                           ? capture.originalSourceMarkup
                           : '';
  const diagnostics =
      Array.isArray(capture.diagnostics) ? [...capture.diagnostics ] : [];
  let sourceLocal = null;
  if (sourceMarkup) {
    sourceLocal = path.join(directory, 'artwork-source.svg');
    await fs.writeFile(sourceLocal, sourceMarkup, 'utf8');
  }

  if (probe.kind === 'embedded-svg-image' &&
      !isStandaloneSvgDocument(sourceMarkup)) {
    diagnostics.push(
        {reason : 'selected-data-svg-invalid-document', detail : 0});
    await appendManifest(runRoot, {
      artifact : null,
      selectionId,
      sourceKind : 'embedded-svg-image',
      additionalSkipped : diagnostics,
    });
    return {
      status : 'suppressed',
      kind : 'image-resource',
      url : '',
      svgPath : '',
      originalSourceFile : publicArtifactPath(sourceLocal, runRoot),
      derivedFile : null,
      sidecarFile : null,
      technicalDirectory,
      diagnostics,
      emailReadinessCaveat : INLINE_ARTWORK_EMAIL_CAVEAT,
    };
  }

  if (capture.status !== 'captured' ||
      typeof capture.completeSvgMarkup !== 'string' ||
      !capture.completeSvgMarkup) {
    await appendManifest(runRoot, {
      artifact : null,
      selectionId,
      sourceKind : probe.kind,
      additionalSkipped : diagnostics,
    });
    return {
      status : 'suppressed',
      kind : probe.kind === 'embedded-svg-image' ? 'image-resource'
                                                 : 'inline-svg',
      url : '',
      svgPath : '',
      originalSourceFile : publicArtifactPath(sourceLocal, runRoot),
      derivedFile : null,
      sidecarFile : null,
      technicalDirectory,
      diagnostics,
      emailReadinessCaveat : INLINE_ARTWORK_EMAIL_CAVEAT,
    };
  }

  // A per-selection directory avoids collisions across inspect/reveal calls.
  // Empty URL candidates plus null cache/context make this the existing
  // inline-only reducer and safety path; there is no network or scratch page.
  const artifact = await collectLogoAssets({
    cache : null,
    context : null,
    candidateUrls : [],
    inlineLogos :
        [ {markup : capture.completeSvgMarkup, notes : capture.notes || {}} ],
    outDir : directory,
    maxBrowserFetches : 0,
  });
  const entry = await appendManifest(runRoot, {
    artifact,
    selectionId,
    sourceKind : probe.kind,
  });
  if (!entry) {
    for (const row of Array.isArray(artifact.skipped) ? artifact.skipped : []) {
      diagnostics.push({
        reason : row.reason || 'selected-derived-suppressed',
        detail : row.detail ?? ''
      });
    }
    return {
      status : 'suppressed',
      kind : 'inline-svg',
      url : '',
      svgPath : '',
      originalSourceFile : publicArtifactPath(sourceLocal, runRoot),
      derivedFile : null,
      sidecarFile : null,
      technicalDirectory,
      diagnostics,
      emailReadinessCaveat : INLINE_ARTWORK_EMAIL_CAVEAT,
    };
  }

  if (entry.svgPathSuppressed) {
    diagnostics.push({
      reason : entry.svgPathSuppressedReason || 'selected-derived-suppressed',
      detail : entry.byteLength || 0,
    });
  }
  return {
    status : entry.svgPathSuppressed ? 'suppressed' : 'captured',
    kind : probe.kind === 'embedded-svg-image' ? 'image-resource'
                                               : 'inline-svg',
    url : '',
    svgPath : entry.svgPathSuppressed ? '' : entry.svgPath,
    originalSourceFile : publicArtifactPath(sourceLocal, runRoot),
    derivedFile :
        publicArtifactPath(path.join(runRoot, entry.localPath), runRoot),
    sidecarFile :
        publicArtifactPath(path.join(runRoot, entry.sidecarPath), runRoot),
    technicalDirectory,
    diagnostics,
    emailReadinessCaveat : INLINE_ARTWORK_EMAIL_CAVEAT,
  };
}

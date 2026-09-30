// Reduce only artwork bytes already supplied by the native DevTools bridge.
// This module never opens a page, fetches a URL, or listens for responses.
import {createHash} from 'node:crypto';
import {promises as fs} from 'node:fs';
import path from 'node:path';

import {looksLikeSvgMarkup, svgPathPayloadFromMarkup} from './svg-path-extract.js';
import {canonicalizeSvgForSafetyScan, SVG_DANGEROUS_PATTERNS, svgInnerMarkupIsUnsafe} from './svg-safety.js';
import {findFirstUnsafePublicString} from './unsafe-public-strings.js';

export const LOGO_ASSET_MAX_BYTES = 256 * 1024;
export const LOGO_SVG_PATH_MAX_CHARS = 16 * 1024;
const EMAIL_SAFE = ['.png', '.jpg', '.jpeg', '.gif'];
const NEVER_SNIFF = ['.ico', '.bmp', '.tif', '.tiff', '.svgz'];

export function isRasterHostingCandidate({
  url = '',
  retainEmailSafeRaster = false,
} = {}) {
  let parsed;
  try {
    parsed = new URL(String(url));
  } catch {
    return false;
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) return false;
  const pathname = parsed.pathname.toLowerCase();
  return !NEVER_SNIFF.some(x => pathname.endsWith(x)) &&
      (retainEmailSafeRaster || !EMAIL_SAFE.some(x => pathname.endsWith(x)));
}

export function rasterImageExtension(buffer) {
  if (!Buffer.isBuffer(buffer) || buffer.length < 12) return '';
  if (buffer.subarray(0, 8).equals(
          Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return 'png';
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff)
    return 'jpg';
  const six = buffer.subarray(0, 6).toString('latin1');
  if (six === 'GIF87a' || six === 'GIF89a') return 'gif';
  if (buffer.subarray(0, 4).toString('latin1') === 'RIFF' &&
      buffer.subarray(8, 12).toString('latin1') === 'WEBP')
    return 'webp';
  if (buffer.subarray(4, 8).toString('latin1') === 'ftyp' &&
      ['avif', 'avis'].includes(buffer.subarray(8, 12).toString('latin1')))
    return 'avif';
  return '';
}

export function isSvgAsset({url = '', contentType = ''} = {}) {
  let parsed;
  try {
    parsed = new URL(String(url));
  } catch {
    return false;
  }
  if (!['http:', 'https:'].includes(parsed.protocol)) return false;
  const type = String(contentType).split(';')[0].trim().toLowerCase();
  return ['image/svg+xml', 'image/svg'].includes(type) ||
      parsed.pathname.toLowerCase().endsWith('.svg') ||
      parsed.pathname.toLowerCase().endsWith('.svgz');
}

export function isPubliclySafeSvgPath(svgPath, {enforceCap = true} = {}) {
  if (typeof svgPath !== 'string' || !svgPath ||
      (enforceCap && svgPath.length > LOGO_SVG_PATH_MAX_CHARS))
    return false;
  const canonical = canonicalizeSvgForSafetyScan(svgPath);
  return !SVG_DANGEROUS_PATTERNS.some(x => x.regex.test(canonical)) &&
      !svgInnerMarkupIsUnsafe(svgPath) &&
      findFirstUnsafePublicString(svgPath) === null;
}

export function isPubliclySafeSvgDocument(
    markup, svgPath, {enforceCap = true} = {}) {
  if (!isPubliclySafeSvgPath(svgPath, {enforceCap}) ||
      typeof markup !== 'string' || !markup)
    return false;
  const canonical = canonicalizeSvgForSafetyScan(markup);
  if (SVG_DANGEROUS_PATTERNS.some(x => x.regex.test(canonical))) return false;
  return !svgInnerMarkupIsUnsafe(
      markup.replace(/^\uFEFF?\s*<\?xml(?:\s[^?]*)?\?>/iu, ''));
}

export function svgPathSuppressionReason(markup, svgPath) {
  if (isPubliclySafeSvgDocument(markup, svgPath)) return null;
  return typeof svgPath === 'string' &&
          svgPath.length > LOGO_SVG_PATH_MAX_CHARS &&
          isPubliclySafeSvgDocument(markup, svgPath, {enforceCap: false}) ?
      'over-cap' :
      'unsafe';
}

function emptyArtifact() {
  return {
    artifact: 'logo-assets',
    version: 1,
    status: 'empty',
    generatedAtMs: Date.now(),
    entries: [],
    skipped: [],
    counts:
        {retained: 0, browserFetches: 0, suppressed: 0, inline: 0, raster: 0},
    error: null
  };
}

function basename(url, index) {
  let stem = '';
  try {
    stem = path.basename(new URL(url).pathname).replace(/\.[^.]*$/, '');
  } catch {
  }
  stem = stem.replace(/[^a-z0-9-_]+/gi, '-').replace(/^-+|-+$/g, '');
  return `logo-${index}-${stem || 'asset'}`.slice(0, 80);
}

// `cache.settle()` is deliberately the sole network-byte source. Missing
// bytes remain missing instead of causing a scratch-page or process fetch.
export async function collectLogoAssets({
  cache = null,
  candidateUrls = [],
  contentTypeByUrl = {},
  inlineLogos = [],
  outDir = '',
  retainEmailSafeRaster = false,
} = {}) {
  const artifact = emptyArtifact();
  const settled = cache && typeof cache.settle === 'function' ?
      await cache.settle() :
      {entries: [], skipped: []};
  artifact.skipped = Array.isArray(settled.skipped) ? [...settled.skipped] : [];
  const byUrl = new Map((Array.isArray(settled.entries) ? settled.entries : [])
                            .filter(x => x && typeof x.url === 'string')
                            .map(x => [x.url, x]));
  const assetsDir = outDir ? path.join(outDir, 'logo-assets') : '';
  let madeDir = false;
  let suppressed = 0;
  let inlineRetained = 0;
  let rasterRetained = 0;
  const assetPath = async name => {
    if (!assetsDir) return '';
    if (!madeDir) {
      await fs.mkdir(assetsDir, {recursive: true});
      madeDir = true;
    }
    return path.join(assetsDir, name);
  };

  const urls = [...new Set((Array.isArray(candidateUrls) ? candidateUrls : [])
                               .filter(x => typeof x === 'string' && x))];
  for (const [index, url] of urls.entries()) {
    const cached = byUrl.get(url);
    if (!cached || !Buffer.isBuffer(cached.buffer)) {
      artifact.skipped.push({url, reason: 'selected-response-unavailable'});
      continue;
    }
    if (cached.buffer.length > LOGO_ASSET_MAX_BYTES) {
      artifact.skipped.push(
          {url, reason: 'body-over-cap', detail: cached.buffer.length});
      continue;
    }
    const contentType = cached.contentType || contentTypeByUrl?.[url] || '';
    if (isSvgAsset({url, contentType})) {
      const markup = cached.buffer.toString('utf8');
      if (!looksLikeSvgMarkup(markup)) {
        artifact.skipped.push(
            {url, reason: 'not-svg-markup', detail: cached.buffer.length});
        continue;
      }
      const stem = basename(url, index);
      const localPath = await assetPath(`${stem}.svg`);
      const sidecarPath = await assetPath(`${stem}.svgpath.json`);
      const payload = svgPathPayloadFromMarkup(markup, {svgFile: localPath});
      const reason = svgPathSuppressionReason(markup, payload.svgPath);
      if (reason) suppressed++;
      if (localPath) {
        await fs.writeFile(localPath, cached.buffer);
        await fs.writeFile(
            sidecarPath, `${JSON.stringify(payload, null, 2)}\n`);
      }
      // Unsafe bytes remain private technical evidence. They cannot be an
      // entry because every entry is a candidate for finalizer authorization;
      // recording the diagnostic in skipped also lets a later safe selection
      // in the same cumulative RUN remain usable.
      if (reason === 'unsafe') {
        artifact.skipped.push(
            {url, reason: 'unsafe-svg', detail: cached.buffer.length});
        continue;
      }
      artifact.entries.push({
        url,
        source: 'page-response',
        kind: 'svg',
        contentType,
        byteLength: cached.buffer.length,
        localPath,
        sidecarPath,
        svgPath: reason ? '' : payload.svgPath,
        svgPathSuppressed: Boolean(reason),
        svgPathSuppressedReason: reason,
        pathCount: payload.pathCount,
        shapeCount: payload.shapeCount
      });
      continue;
    }
    if (!isRasterHostingCandidate({url, retainEmailSafeRaster})) {
      artifact.skipped.push({url, reason: 'not-svg'});
      continue;
    }
    const extension = rasterImageExtension(cached.buffer);
    if (!extension) {
      artifact.skipped.push(
          {url, reason: 'not-raster-bytes', detail: cached.buffer.length});
      continue;
    }
    const localPath = await assetPath(`${basename(url, index)}.${extension}`);
    if (localPath) await fs.writeFile(localPath, cached.buffer);
    rasterRetained++;
    artifact.entries.push({
      url,
      source: 'page-response',
      kind: 'raster',
      contentType,
      byteLength: cached.buffer.length,
      sha256: createHash('sha256').update(cached.buffer).digest('hex'),
      localPath,
      sidecarPath: '',
      svgPath: '',
      svgPathSuppressed: false,
      pathCount: 0,
      shapeCount: 0
    });
  }

  const inlineRows = await Promise.resolve(inlineLogos).catch(() => []);
  for (const [index, inline] of (Array.isArray(inlineRows) ? inlineRows : [])
           .entries()) {
    const markup = typeof inline?.markup === 'string' ? inline.markup : '';
    const buffer = Buffer.from(markup);
    if (!looksLikeSvgMarkup(markup)) {
      artifact.skipped.push(
          {url: '', reason: 'inline-not-svg-markup', detail: markup.length});
      continue;
    }
    if (buffer.length > LOGO_ASSET_MAX_BYTES) {
      artifact.skipped.push(
          {url: '', reason: 'body-over-cap', detail: buffer.length});
      continue;
    }
    const localPath = await assetPath(`logo-inline-${index}.svg`);
    const sidecarPath = await assetPath(`logo-inline-${index}.svgpath.json`);
    const payload = svgPathPayloadFromMarkup(markup, {svgFile: localPath});
    if (payload.shapeCount === 0) {
      artifact.skipped.push({
        url: '',
        reason: 'inline-no-shapes',
        detail: inline?.notes?.unresolvedUseRefs || 0
      });
      continue;
    }
    const reason = svgPathSuppressionReason(markup, payload.svgPath);
    if (reason) suppressed++;
    if (localPath) {
      await fs.writeFile(localPath, buffer);
      await fs.writeFile(sidecarPath, `${JSON.stringify(payload, null, 2)}\n`);
    }
    if (reason === 'unsafe') {
      artifact.skipped.push(
          {url: '', reason: 'unsafe-svg', detail: buffer.length});
      continue;
    }
    inlineRetained++;
    artifact.entries.push({
      url: '',
      source: 'inline-svg',
      kind: 'svg',
      contentType: 'image/svg+xml',
      byteLength: buffer.length,
      localPath,
      sidecarPath,
      svgPath: reason ? '' : payload.svgPath,
      svgPathSuppressed: Boolean(reason),
      svgPathSuppressedReason: reason,
      pathCount: payload.pathCount,
      shapeCount: payload.shapeCount,
      notes: inline?.notes && typeof inline.notes === 'object' ? inline.notes :
                                                                 {}
    });
  }
  artifact.counts = {
    retained: artifact.entries.length,
    browserFetches: 0,
    suppressed,
    inline: inlineRetained,
    raster: rasterRetained
  };
  artifact.status = artifact.entries.length ? 'completed' : 'empty';
  return artifact;
}

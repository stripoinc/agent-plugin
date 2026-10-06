import {readFileSync} from 'node:fs';
import path from 'node:path';
import {inflateSync} from 'node:zlib';
import {PLUGIN, readJson, requireCondition, walkFiles} from './plugin.mjs';

export const TEXT_FILE_LIMIT = 256 * 1024;
export const FILE_COUNT_LIMIT = 512;

export function iconDimensions(bytes) {
  if (bytes.subarray(0, 8).equals(Buffer.from('89504e470d0a1a0a', 'hex'))) {
    requireCondition(bytes.length >= 45 && bytes.toString('ascii', 12, 16) === 'IHDR'
      && bytes.subarray(-12).equals(Buffer.from('0000000049454e44ae426082', 'hex')), 'Incomplete PNG icon.');
    const width = bytes.readUInt32BE(16), height = bytes.readUInt32BE(20);
    requireCondition(width > 0 && height > 0 && width <= 2048 && height <= 2048, 'Invalid PNG dimensions.');
    const data = [];
    for (let offset = 8; offset < bytes.length;) {
      requireCondition(offset + 12 <= bytes.length, 'Incomplete PNG chunk.');
      const length = bytes.readUInt32BE(offset);
      requireCondition(offset + length + 12 <= bytes.length, 'Incomplete PNG chunk.');
      if (bytes.toString('ascii', offset + 4, offset + 8) === 'IDAT') data.push(bytes.subarray(offset + 8, offset + 8 + length));
      offset += length + 12;
    }
    requireCondition(data.length > 0, 'PNG icon has no image data.');
    inflateSync(Buffer.concat(data), {maxOutputLength: (width * 8 + 16) * height + 4096});
    return {width, height, format: 'png'};
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) {
    requireCondition(bytes.at(-2) === 0xff && bytes.at(-1) === 0xd9, 'Incomplete JPEG icon.');
    for (let offset = 2; offset + 9 < bytes.length;) {
      requireCondition(bytes[offset] === 0xff, 'Invalid JPEG marker.');
      while (bytes[offset] === 0xff) offset++;
      const marker = bytes[offset++];
      const length = bytes.readUInt16BE(offset);
      requireCondition(length >= 2 && offset + length <= bytes.length, 'Invalid JPEG segment.');
      if ([0xc0, 0xc1, 0xc2].includes(marker)) {
        return {width: bytes.readUInt16BE(offset + 5), height: bytes.readUInt16BE(offset + 3), format: 'jpeg'};
      }
      offset += length;
    }
  }
  throw new Error('Listing icon must be a complete PNG or JPEG.');
}

export function checkPackageLimits(root) {
  const files = walkFiles(root, PLUGIN).filter(file => path.basename(file) !== '.DS_Store');
  requireCondition(files.length <= FILE_COUNT_LIMIT, `Plugin has ${files.length} files; limit is ${FILE_COUNT_LIMIT}.`);
  let largestTextBytes = 0;
  for (const file of files) {
    const bytes = readFileSync(path.join(root, file));
    if (/\.(?:png|jpe?g|gif|webp|woff2?|ttf|otf)$/iu.test(file)) continue;
    requireCondition(bytes.length < TEXT_FILE_LIMIT, `${file}: ${bytes.length} bytes; text files must be smaller than 256 KiB.`);
    requireCondition(!bytes.includes(0), `Unexpected binary file: ${file}`);
    try {new TextDecoder('utf-8', {fatal: true}).decode(bytes);}
    catch {throw new Error(`Non-UTF-8 file: ${file}`);}
    largestTextBytes = Math.max(largestTextBytes, bytes.length);
  }
  return {files: files.length, largestTextBytes};
}

export function checkDirectoryAssets(root, metadata) {
  const readme = readFileSync(path.join(root, PLUGIN, 'README.md'), 'utf8');
  const prose = readme.replace(/^```[^\n]*\n[\s\S]*?^```\s*$/gmu, '');
  requireCondition(prose.split(/\s+/u).filter(Boolean).length >= 40, 'Packaged README must contain at least 40 words outside code blocks.');
  const missing = [];
  if (!metadata.license || !metadata.packageFiles.LICENSE) missing.push('owner-approved LICENSE and manifest license');
  else requireCondition(readFileSync(path.join(root, PLUGIN, 'LICENSE'), 'utf8').trim().length > 0, 'LICENSE is empty.');
  const icon = metadata.claudeDirectory?.icon;
  if (!icon) missing.push('approved Stripo listing icon');
  else {
    const bytes = readFileSync(path.join(root, PLUGIN, icon.slice(2)));
    requireCondition(bytes.length < 2 * 1024 * 1024, 'Listing icon must be smaller than 2 MiB.');
    const {width, height, format} = iconDimensions(bytes);
    requireCondition(width === height && width >= 512 && width <= 2048, 'Listing icon must be square, 512–2048 px.');
    requireCondition(format === 'png' ? /\.png$/iu.test(icon) : /\.jpe?g$/iu.test(icon), 'Listing icon extension does not match its contents.');
  }
  const claude = readJson(root, `${PLUGIN}/.claude-plugin/plugin.json`);
  requireCondition(claude.license === metadata.license && claude.icon === icon, 'Directory metadata differs from plugin-metadata.json.');
  return missing;
}

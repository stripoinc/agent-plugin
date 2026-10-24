import fs from 'node:fs';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const MAX_BYTES = 16 * 1024 * 1024;
const directory = path.dirname(fileURLToPath(import.meta.url));
const script = path.resolve(directory,
  fs.existsSync(path.join(directory, '../references/schema.json'))
    ? '../../../packages/brandkit-runtime/brandkit_runtime/screenshot_encoding.py'
    : '../shared/brandkit_runtime/screenshot_encoding.py');

function requireActive(signal, deadlineAt) {
  if (signal?.aborted) throw signal.reason || Error('Browser operation aborted');
  if (performance.now() >= deadlineAt) {
    const error = Error('Browser operation deadline exceeded');
    error.code = 'browser_operation_deadline';
    throw error;
  }
}

async function encode(bytes, {signal, deadlineAt, python}) {
  const timeoutMs = Math.min(5000, deadlineAt - performance.now() - 1000);
  if (!fs.existsSync(script) || bytes.length > MAX_BYTES || timeoutMs <= 0) return null;
  const encoderDeadline = performance.now() + timeoutMs;
  return new Promise(resolve => {
    let child;
    try { child = spawn(python, ['-I', '-B', script], {stdio: ['pipe', 'pipe', 'pipe']}); }
    catch { resolve(null); return; }
    let failed = false, size = 0, stderrSize = 0;
    const chunks = [];
    const stop = () => { failed = true; chunks.length = 0; child.kill('SIGKILL'); };
    const timer = setTimeout(stop, timeoutMs);
    signal?.addEventListener('abort', stop, {once: true});
    child.on('error', stop);
    child.stdin.on('error', stop);
    child.stdout.on('error', stop);
    child.stderr.on('error', stop);
    child.stdout.on('data', chunk => {
      size += chunk.length;
      if (size >= Math.min(bytes.length, MAX_BYTES)) stop();
      else if (!failed) chunks.push(chunk);
    });
    child.stderr.on('data', chunk => {
      stderrSize += chunk.length;
      if (stderrSize > 8192) stop();
    });
    child.once('close', code => {
      clearTimeout(timer);
      signal?.removeEventListener('abort', stop);
      const candidate = !failed && code === 0 && performance.now() < encoderDeadline
        ? Buffer.concat(chunks) : null;
      resolve(candidate?.length >= 12 && candidate.length < bytes.length &&
        candidate.subarray(0, 4).toString() === 'RIFF' &&
        candidate.subarray(8, 12).toString() === 'WEBP' ? candidate : null);
    });
    if (signal?.aborted) stop();
    else child.stdin.end(bytes);
  });
}

export async function deliverScreenshot(file, {
  signal, deadlineAt = Infinity, python = process.env.BRANDKIT_PYTHON || 'python3',
} = {}) {
  // Capture read failures remain failures; only conversion is optional.
  const bytes = fs.readFileSync(file);
  requireActive(signal, deadlineAt);
  const candidate = await encode(bytes, {signal, deadlineAt, python});
  requireActive(signal, deadlineAt);
  let delivered = bytes, deliveredPath = file, mimeType = 'image/png';
  if (candidate) {
    const sidecar = file.replace(/\.png$/u, '') + '.webp';
    let handle, owned = false;
    try {
      handle = fs.openSync(sidecar, 'wx');
      owned = true;
      fs.writeFileSync(handle, candidate);
      fs.closeSync(handle);
      handle = undefined;
      requireActive(signal, deadlineAt);
      delivered = candidate; deliveredPath = sidecar; mimeType = 'image/webp';
    } catch (error) {
      // Only a successfully opened exclusive file belongs to this attempt.
      if (handle !== undefined) { try { fs.closeSync(handle); } catch {} }
      if (owned) { try { fs.unlinkSync(sidecar); } catch {} }
      requireActive(signal, deadlineAt);
    }
  }
  const result = {path: deliveredPath, block: {type: 'image', mimeType, data: delivered.toString('base64')}};
  try { requireActive(signal, deadlineAt); }
  catch (error) {
    if (deliveredPath !== file) { try { fs.unlinkSync(deliveredPath); } catch {} }
    throw error;
  }
  return result;
}

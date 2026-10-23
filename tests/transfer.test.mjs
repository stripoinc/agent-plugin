import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {EventEmitter} from 'node:events';
import {mkdtemp, readFile, readdir, rm, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {Readable} from 'node:stream';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import {transferFile} from '../scripts/transfer.mjs';

const url = 'https://test-bucket.s3.eu-west-1.amazonaws.com/tmp/model%2fraw.json?X-Amz-Credential=a%2Fb&X-Amz-Signature=synthetic+only';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const script = fileURLToPath(new URL('../scripts/transfer.mjs', import.meta.url));

function transport({chunks = [], status = 200, headers = {}, addresses = [{address: '8.8.8.8', family: 4}], stream} = {}) {
  const calls = [];
  const dependencies = {
    lookup: async () => addresses,
    request(options, respond) {
      const req = new EventEmitter();
      req.end = body => {
        calls.push({options, body});
        const response = stream ?? Readable.from(chunks);
        response.statusCode = status;
        response.headers = headers;
        queueMicrotask(() => respond(response));
      };
      return req;
    },
  };
  return {calls, dependencies};
}

async function directory(t) {
  const path = await mkdtemp(join(tmpdir(), 'stripo-transfer-test-'));
  t.after(() => rm(path, {recursive: true, force: true}));
  return path;
}

test('downloads exact bytes from S3, preserves the signed request path and pins DNS', async t => {
  const root = await directory(t);
  const output = join(root, 'base.json');
  const bytes = Buffer.from('{ "title": "Привіт" }\r\n');
  const {calls, dependencies} = transport({chunks: [bytes], headers: {'content-length': String(bytes.length)}});
  const result = await transferFile({operation: 'download', url, output, sha256: digest(bytes)}, dependencies);
  assert.deepEqual(await readFile(output), bytes);
  assert.deepEqual(result, {downloaded: true, bytes: bytes.length, sha256: digest(bytes)});
  assert.equal(calls.length, 1);
  const {options} = calls[0];
  assert.equal(options.hostname, 'test-bucket.s3.eu-west-1.amazonaws.com');
  assert.equal(options.path, '/tmp/model%2fraw.json?X-Amz-Credential=a%2Fb&X-Amz-Signature=synthetic+only');
  assert.equal(options.method, 'GET');
  assert.equal(options.rejectUnauthorized, true);
  assert.equal(options.agent, false);
  options.lookup(options.hostname, {}, (error, address, family) => {
    assert.equal(error, null); assert.equal(address, '8.8.8.8'); assert.equal(family, 4);
  });
  assert.deepEqual(await readdir(root), ['base.json']);
});

test('upload sends raw bytes with their exact length and accepts an empty S3 response', async t => {
  const root = await directory(t);
  const input = join(root, 'original.png');
  const bytes = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10, 0, 255]);
  await writeFile(input, bytes);
  const {calls, dependencies} = transport({headers: {'content-length': '0'}});
  const result = await transferFile({operation: 'upload', url, input, maxBytes: 1024,
    contentType: 'image/png', headers: {'x-amz-checksum-sha256': 'synthetic'}}, dependencies);
  assert.deepEqual(calls[0].body, bytes);
  assert.equal(calls[0].options.method, 'PUT');
  assert.deepEqual(calls[0].options.headers, {'x-amz-checksum-sha256': 'synthetic', 'content-type': 'image/png', 'content-length': String(bytes.length)});
  assert.deepEqual(result, {transferred: true, bytes: bytes.length, sha256: digest(bytes), persisted: false});
  assert.deepEqual(await readFile(input), bytes);
});

test('all failed downloads preserve the existing base and leave no temporary file', async t => {
  const root = await directory(t);
  const output = join(root, 'base.json');
  const original = Buffer.from('untouched base');
  for (const [name, setup, args, code] of [
    ['checksum', {chunks: [Buffer.from('new')]}, {sha256: '0'.repeat(64)}, 'CHECKSUM_MISMATCH'],
    ['length', {chunks: [Buffer.from('new')], headers: {'content-length': '9'}}, {}, 'INCOMPLETE_RESPONSE'],
    ['length syntax', {headers: {'content-length': '-1'}}, {}, 'INVALID_RESPONSE'],
    ['declared size', {headers: {'content-length': '10'}}, {maxBytes: 3}, 'SIZE_LIMIT'],
    ['streamed size', {chunks: [Buffer.from('123'), Buffer.from('4')]}, {maxBytes: 3}, 'SIZE_LIMIT'],
    ['redirect', {status: 302, headers: {location: 'https://elsewhere.example/?secret=synthetic'}}, {}, 'HTTP_ERROR'],
    ['S3 error', {status: 403, chunks: [Buffer.from('<Error>synthetic-secret</Error>')]}, {}, 'HTTP_ERROR'],
  ]) {
    await t.test(name, async () => {
      await writeFile(output, original);
      const {calls, dependencies} = transport(setup);
      await assert.rejects(transferFile({operation: 'download', url, output, ...args}, dependencies), error => {
        assert.equal(error.code, code);
        assert.doesNotMatch(error.message, /synthetic-secret|elsewhere/);
        return true;
      });
      assert.equal(calls.length, 1);
      assert.deepEqual(await readFile(output), original);
      assert.deepEqual(await readdir(root), ['base.json']);
    });
  }
});

test('a disconnected response cannot replace an existing file', async t => {
  const root = await directory(t);
  const output = join(root, 'base.json');
  await writeFile(output, 'original');
  const stream = Readable.from((async function* () { yield Buffer.from('partial'); throw new Error('connection lost'); })());
  const {dependencies} = transport({stream});
  await assert.rejects(transferFile({operation: 'download', url, output}, dependencies));
  assert.equal(await readFile(output, 'utf8'), 'original');
  assert.deepEqual(await readdir(root), ['base.json']);
});

test('private, local, mapped and mixed DNS answers are rejected before a request', async t => {
  const root = await directory(t);
  for (const address of ['127.0.0.1', '10.0.0.1', '169.254.169.254', '172.16.1.1', '192.168.1.1',
    '100.64.0.1', '0.0.0.0', '224.0.0.1', '::1', '::ffff:127.0.0.1', 'fc00::1', 'fe80::1', '2001:db8::1']) {
    const {calls, dependencies} = transport({addresses: [{address: '8.8.8.8', family: 4}, {address, family: address.includes(':') ? 6 : 4}]});
    await assert.rejects(transferFile({operation: 'download', url, output: join(root, 'file')}, dependencies), {code: 'NON_PUBLIC_HOST'});
    assert.equal(calls.length, 0);
  }
  for (const host of ['127.0.0.1', '2130706433', '[::ffff:127.0.0.1]']) {
    const {calls, dependencies} = transport();
    await assert.rejects(transferFile({operation: 'download', url: `https://${host}/file`, output: join(root, 'file')}, dependencies), {code: 'NON_PUBLIC_HOST'});
    assert.equal(calls.length, 0);
  }
});

test('a public IPv6 endpoint is pinned without disabling certificate validation', async t => {
  const root = await directory(t);
  const {calls, dependencies} = transport({addresses: [{address: '2606:4700:4700::1111', family: 6}]});
  await transferFile({operation: 'download', url, output: join(root, 'file')}, dependencies);
  assert.equal(calls[0].options.family, 6);
  assert.equal(calls[0].options.rejectUnauthorized, true);
});

test('unsafe URLs, unsupported methods and invalid checksums never reach the network', async t => {
  const root = await directory(t);
  for (const options of [
    {url: 'http://example.com/file'}, {url: 'file:///tmp/file'},
    {url: 'https://user:pass@example.com/file'}, {url: 'https://example.com/file#fragment'},
    {url: 'https://example.com/file\n'}, {url: 'https://example.com\\@localhost/file'},
    {method: 'POST'}, {sha256: 'invalid'}, {maxBytes: 0}, {maxBytes: 64 * 1024 * 1024 + 1},
    {headers: {Authorization: 'Bearer synthetic'}}, {headers: {Cookie: 'synthetic'}},
    {headers: {Host: 'different.example'}}, {headers: {'x-test': 'value\r\nInjected: yes'}},
  ]) {
    const {calls, dependencies} = transport();
    await assert.rejects(transferFile({operation: 'download', url, output: join(root, 'file'), ...options}, dependencies));
    assert.equal(calls.length, 0);
  }
});

test('upload requires and enforces the ticket limit before any network request', async t => {
  const root = await directory(t);
  const input = join(root, 'candidate.json');
  await writeFile(input, '{}');
  for (const options of [{}, {maxBytes: 1}, {maxBytes: 64, method: 'POST'},
    {maxBytes: 64, contentType: 'image/png', headers: {'Content-Type': 'application/json'}}]) {
    const {calls, dependencies} = transport();
    await assert.rejects(transferFile({operation: 'upload', url, input, ...options}, dependencies));
    assert.equal(calls.length, 0);
  }
});

test('CLI works outside the plugin directory and never echoes malformed signed URLs', () => {
  const help = spawnSync(process.execPath, [script, '--help'], {cwd: tmpdir(), encoding: 'utf8'});
  assert.equal(help.status, 0);
  assert.match(help.stdout, /download/);
  for (const args of [
    ['download', '--url', 'http://example.com/?token=do-not-print', '--output', '/unused'],
    ['download', '--url', 'https://example.com/?token=do-not-print', '--unknown', 'do-not-print'],
  ]) {
    const result = spawnSync(process.execPath, [script, ...args], {cwd: tmpdir(), encoding: 'utf8'});
    assert.equal(result.status, 1);
    assert.equal(JSON.parse(result.stdout).success, false);
    assert.doesNotMatch(result.stdout + result.stderr, /do-not-print|example\.com/);
  }
});

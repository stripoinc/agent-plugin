// One compact JSON document on stdout, written so `process.exit()` cannot eat it.
//
// WHY NOT `process.stdout.write`. When stdout is a PIPE — which it always is
// when the agent runs these scripts through a tool, and in every subprocess
// test here — Node's stdio stream is asynchronous on POSIX. The orchestrator's
// failure handler ends in `process.exit(1)`, and `process.exit` does not drain
// pending async writes. REPRODUCED on this platform, stdout on a pipe, one
// write then `process.exit(1)`:
//
//     want=65536    process.stdout.write=65536    fs.writeSync=65536
//     want=131072   process.stdout.write=65536    fs.writeSync=131072
//     want=1048576  process.stdout.write=131072   fs.writeSync=1048576
//
// Everything past the pipe buffer is dropped. That lands exactly where the
// normalize verification block is the agent's only record — the failure paths
// — and it lands as a HALF-WRITTEN JSON document rather than as an absent one.
//
// `fs.writeSync` is the fix: the bytes are in the kernel before the call
// returns.

import fs from "node:fs";

// Loop until the whole buffer is gone, because a `write(2)` to a pipe may
// report a SHORT write, and a document that stops mid-object is unparseable.
// The `write` parameter exists so that branch is REACHABLE from a test: on a
// blocking fd `fs.writeSync` never short-writes, so a mutation that drops the
// loop stays green against the real syscall and the loop would be an unpinned
// claim. See `stdout-json.test.js#a short write is retried`.
export function writeAll(fd, buffer, write = fs.writeSync) {
  let offset = 0;
  while (offset < buffer.length) {
    let written;
    try {
      written = write(fd, buffer, offset, buffer.length - offset);
    } catch (error) {
      // A reader that closed early (a `| head`, a killed tool) must not turn a
      // completed extraction pass into a crash. Every OTHER write error is a
      // real fault and is raised.
      if (error && (error.code === "EPIPE" || error.code === "ERR_STREAM_DESTROYED")) return false;
      if (error && error.code === "EAGAIN") continue;
      throw error;
    }
    if (!(written > 0)) return false;
    offset += written;
  }
  return true;
}

export function writeStdoutText(text) {
  return writeAll(1, Buffer.from(text, "utf8"));
}

export function writeStdoutJsonLine(payload) {
  return writeStdoutText(`${JSON.stringify(payload)}\n`);
}

// Publish-by-rename for the artifacts this skill writes.
//
// `fs.writeFile(dest, ...)` opens the destination with O_TRUNC, so the
// previous content is gone BEFORE the first byte of the new content lands.
// Any failure after that open -- a full disk, a size limit, a signal -- leaves
// the destination holding a prefix of the new payload and nothing of the old
// one. MEASURED on this code, not inferred: with `ulimit -f 200` and a good
// 40,041-byte `brandkit.extraction.json` on disk, writing a larger payload
// through `writeJson` threw EFBIG and left the file at 102,400 bytes that do
// not parse as JSON; the previous good artifact was unrecoverable. The
// planner measured the identical shape with ENOSPC on a 2 MB RAM disk
// (50,022 good bytes -> 524,288 unparseable ones).
//
// The fix is the standard one: serialise into a sibling temp file in the same
// directory, then `rename` it over the destination. `rename(2)` within one
// filesystem is atomic, so a reader sees either the whole old file or the
// whole new one, and a failed write leaves the previous artifact untouched.
// The temp file is a SIBLING rather than a `/tmp` entry precisely so the two
// paths share a filesystem -- a cross-device `rename` fails with EXDEV.
//
// KNOWN BEHAVIOUR CHANGE, deliberate, and the one to check before adding a
// caller: if the DESTINATION FILE is a symlink, `rename` replaces the LINK and
// the old target keeps its bytes, where `fs.writeFile` would have followed the
// link and written through. Measured both ways. Nothing in this skill or in
// `brandkit_finalize` creates a symlink at an artifact path -- `stale.py` only
// tolerates one it might find -- so no destination this writer serves is a
// symlinked file today.
//
// A symlinked DIRECTORY on the path is a different case and is FINE: the temp
// sibling resolves into the same real directory, so the rename stays within
// one filesystem. That case is production's: `/app/artifacts` is a symlink to
// `/workspace/artifacts` in the source runtime (see
// `brandkit_finalize/stale.py`). A full scaffold + normalize driven through a
// symlinked run root publishes the artifact at the real path, stamps the
// marker, and leaves no temp behind.
//
// Two smaller consequences, both measured. `rename` needs write permission on
// the destination DIRECTORY, which an in-place `fs.writeFile` over an existing
// file does not -- a read-only technical dir now fails with EACCES instead of
// succeeding. And the published file carries the temp's mode (0644 under the
// usual umask) rather than the mode of the file it replaced; nothing in this
// skill chmods an artifact.
//
// The three fs operations are injectable because that is the only seam a
// partial-write test has: the failure it must reproduce is a `writeFile` that
// lands some bytes and then throws, which cannot be provoked portably against
// the real filesystem.

import fs from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";

// Sibling temp name. `.tmp-` is the substring the leftover assertions match
// on, and pid + random suffix keep two concurrent writers of the same
// destination off each other's temp file.
function tempPathFor(filePath) {
  const suffix = `${process.pid}-${randomBytes(6).toString("hex")}`;
  return path.join(path.dirname(filePath), `.${path.basename(filePath)}.tmp-${suffix}`);
}

// Write `contents` to `filePath` so the destination is never left holding a
// partial payload. Rethrows the original error after removing the temp file,
// so callers see the real `ENOSPC` / `EFBIG` / `EISDIR` and not a cleanup
// failure standing in front of it.
export async function writeFileAtomic(
  filePath,
  contents,
  { writeFile = fs.writeFile, rename = fs.rename, unlink = fs.unlink } = {},
) {
  const tempPath = tempPathFor(filePath);
  try {
    await writeFile(tempPath, contents, "utf8");
    await rename(tempPath, filePath);
  } catch (error) {
    // Best-effort: the temp file may not exist (the `writeFile` never opened
    // it) or may already be gone (the `rename` succeeded and something later
    // threw). Neither is a reason to mask the error the caller must see.
    try {
      await unlink(tempPath);
    } catch {}
    throw error;
  }
}

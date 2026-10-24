"""Optional, in-memory lossless encoding of plain native PNG screenshots."""
import io
import struct
import sys
import zlib

MAX_BYTES = 16 * 1024 * 1024
MAX_PIXELS = 4_194_304
MAX_DIMENSION = 16_383


def _plain_png_size(data):
    if len(data) > MAX_BYTES or data[:8] != b"\x89PNG\r\n\x1a\n":
        return None
    offset, size, idat_seen = 8, None, False
    while offset + 12 <= len(data):
        length = struct.unpack_from(">I", data, offset)[0]
        end = offset + 12 + length
        if end > len(data):
            return None
        kind = data[offset + 4:offset + 8]
        body = data[offset + 8:end - 4]
        crc = struct.unpack_from(">I", data, end - 4)[0]
        if zlib.crc32(kind + body) & 0xffffffff != crc:
            return None
        if kind == b"IHDR" and offset == 8 and length == 13:
            width, height, depth, color, compression, filtering, interlace = struct.unpack(">IIBBBBB", body)
            if (not 0 < width <= MAX_DIMENSION or not 0 < height <= MAX_DIMENSION
                    or width * height > MAX_PIXELS or depth != 8 or color not in (2, 6)
                    or compression or filtering or interlace):
                return None
            size = (width, height)
        elif kind == b"IDAT" and size is not None:
            idat_seen = True
        elif kind == b"IEND" and size is not None and idat_seen and length == 0:
            return size if end == len(data) else None
        else:
            return None
        offset = end
    return None


def encode_screenshot(data):
    """Return verified, strictly smaller WebP bytes, or None to retain PNG."""
    size = _plain_png_size(data)
    if size is None:
        return None
    try:
        from PIL import Image
        with Image.open(io.BytesIO(data)) as source:
            source.load()
            if source.format != "PNG" or source.mode not in ("RGB", "RGBA") or source.size != size:
                return None
            pixels = source.convert("RGBA").tobytes()
            output = io.BytesIO()
            source.save(output, format="WEBP", lossless=True, exact=True, method=4, quality=75)
        candidate = output.getvalue()
        if not candidate or len(candidate) >= len(data):
            return None
        with Image.open(io.BytesIO(candidate)) as decoded:
            decoded.load()
            if (decoded.format != "WEBP" or decoded.size != size
                    or decoded.convert("RGBA").tobytes() != pixels):
                return None
        return candidate
    except Exception:
        # Encoding is optional, including absent Pillow or WebP support.
        return None


if __name__ == "__main__":
    candidate = encode_screenshot(sys.stdin.buffer.read(MAX_BYTES + 1))
    if candidate is not None:
        sys.stdout.buffer.write(candidate)

"""Finalizer-owned hosting for the current run's primary logo.

Three source shapes reach the upload path, and all three exist because the URL
the page published is one an email client cannot render:

* a safe SVG whose reduced markup was publishable - uploaded as-is, rasterized
  server-side by ``upload_image``;
* a safe SVG whose reduction was suppressed as ``over-cap`` - the same upload,
  with the cap on the PUBLISHED string deliberately not applied to the bytes;
* raster bytes the capture kept (webp/avif/extensionless) - converted here to
  an RGBA PNG with Pillow, because the MCP hosts a WebP verbatim and refuses
  AVIF outright, so no server-side step can fix the format.

``png``/``jpg``/``jpeg``/``gif`` primaries are never touched: their own URL
already works, and rewriting it would trade a working asset for a risk.

Same-workflow technical artifacts are cooperative evidence for consistency and
accidental-drift checks, not authenticated provenance. This module derives the
source logo from the current ``logo-assets.json`` sidecar, restores that safe
source on the composed in-memory brandkit, and then performs one fresh upload
through the publisher runtime's existing MCP/proxy routes. Deliberate same-UID
artifact forgery remains out of scope until logo capture/rehosting has an
external trusted boundary.

The upload APIs expose no stable asset lookup, idempotency key, or rollback.
Consequently, a transport loss or a later post-host validation/render/promotion
failure can still leave an orphan on retry. The local preflight prevents
retries from amplifying the deterministic case where a blocker was already
knowable before the upload; it does not claim remote exactly-once semantics
that the API cannot provide.
"""

from __future__ import annotations

import json
import re
import tempfile
from dataclasses import dataclass, replace
from io import BytesIO
from pathlib import Path
from typing import Any
from urllib.parse import urlsplit

from PIL import Image, features

from .host_adapter import load_host_adapter as _host_adapter
from .validation import (
    LOGO_ASSET_MAX_BYTES,
    LOGO_SVG_PATH_MAX_CHARS,
    LogoAssetEvidence,
    SvgSidecarValidationError,
    ValidatedRasterSidecar,
    ValidatedSvgSidecar,
    _exact_public_asset_url,
    _is_sha256_hex,
    _svg_markup_is_safe,
    _svg_markup_sha256,
    load_logo_asset_evidence,
    validate_raster_sidecar_for_upload,
    validate_svg_sidecar_for_upload,
)


UPLOAD_TIMEOUT_SECONDS = 60.0

# Decode ceiling for a logo, and the value `Image.MAX_IMAGE_PIXELS` is pinned
# to for the duration of one conversion. A brand mark is a few hundred pixels
# on a side; 16 MP is ~4000x4000 and already absurd for one. The point is not
# the aesthetic judgement but the DECOMPRESSION BOMB: `LOGO_ASSET_MAX_BYTES`
# bounds the file at 256 KB, and 256 KB of WebP or AVIF can expand to
# gigabytes of RGBA in this process. Pillow's own default is 89 MP, which is
# ~356 MB of RGBA - too high for a finalizer that must not be the thing that
# dies.
MAX_LOGO_IMAGE_PIXELS = 16_000_000

# The extensions whose decoder Pillow ships CONDITIONALLY. A Linux wheel
# without the codec raises deep inside `Image.open`, which is caught anyway;
# checking first turns "some exception" into a named `convert-failed` reason
# the report can carry, and gives the tests one place to simulate a runtime
# whose codec set differs from the developer's.
_PIL_FEATURE_BY_FORMAT = {"webp": "webp", "avif": "avif"}

_UPLOAD_CONTENT_TYPE_SVG = "image/svg+xml"
_UPLOAD_CONTENT_TYPE_PNG = "image/png"
_UPLOAD_TEMP_SUFFIX_BY_CONTENT_TYPE = {
    _UPLOAD_CONTENT_TYPE_SVG: ".svg",
    _UPLOAD_CONTENT_TYPE_PNG: ".png",
}


@dataclass(frozen=True)
class LogoHostingResult:
    """Runtime proof plus the non-authorizing record written to the report."""

    hosted_url: str | None
    attempted: bool
    outcome: str
    error_code: str | None = None
    reason: str | None = None
    source_svg: str | None = None
    source_svg_sha256: str | None = None

    @classmethod
    def not_reached(cls) -> "LogoHostingResult":
        return cls(
            hosted_url=None,
            attempted=False,
            outcome="not-reached",
            reason="finalization ended before logo hosting",
        )

    def report_record(self) -> dict[str, Any]:
        """Return audit-only data; the hosted URL deliberately stays in memory."""

        return {
            "attempted": self.attempted,
            "outcome": self.outcome,
            "error_code": self.error_code,
            "reason": self.reason,
            # Preserve the report shape; native authoring never substitutes a logo.
            "fallback_used": None,
        }

    @property
    def authorization_binding(self) -> tuple[str, str] | None:
        """Return the exact process-local hosted URL/source-SVG hash proof."""

        digest = self.source_svg_sha256
        if digest is None and isinstance(self.source_svg, str) and self.source_svg:
            digest = _svg_markup_sha256(self.source_svg)
        if (
            self.outcome == "minted"
            and isinstance(self.hosted_url, str)
            and _exact_public_asset_url(self.hosted_url)
            and _is_sha256_hex(digest)
        ):
            return (self.hosted_url, digest)
        return None


@dataclass(frozen=True)
class LogoHostingPreflight:
    """Local-only logo decision made before any upload-side mutation."""

    validated_sidecar: ValidatedSvgSidecar | None
    manifest_entry: dict[str, Any] | None
    source_url: str | None
    svg_path: str | None
    source_svg_sha256: str | None
    result: LogoHostingResult | None
    # Set instead of `validated_sidecar` when the source is raster bytes.
    validated_raster: ValidatedRasterSidecar | None = None
    # True on the two source shapes whose own URL is NOT email-safe and whose
    # published `svgPath` is empty (raster bytes, over-cap SVG). Hosting keeps
    # the original URL as an `alternative` row on those - it is real evidence
    # of the mark and the only record of where the bytes came from. The
    # existing publishable-SVG path is deliberately left byte-identical.
    keeps_original_url_as_alternative: bool = False

    @property
    def sidecar_path(self) -> Path | None:
        """Expose the resolved path without weakening the validated-byte proof."""

        return (
            self.validated_sidecar.path
            if self.validated_sidecar is not None
            else None
        )

    @classmethod
    def ready(
        cls,
        *,
        validated_sidecar: ValidatedSvgSidecar,
        manifest_entry: dict[str, Any],
        source_url: str,
        svg_path: str,
        source_svg_sha256: str,
        keeps_original_url_as_alternative: bool = False,
    ) -> "LogoHostingPreflight":
        return cls(
            validated_sidecar,
            dict(manifest_entry),
            source_url,
            svg_path,
            source_svg_sha256,
            None,
            keeps_original_url_as_alternative=keeps_original_url_as_alternative,
        )

    @classmethod
    def ready_raster(
        cls,
        *,
        validated_raster: ValidatedRasterSidecar,
        manifest_entry: dict[str, Any],
        source_url: str,
    ) -> "LogoHostingPreflight":
        return cls(
            None,
            dict(manifest_entry),
            source_url,
            "",
            validated_raster.sha256,
            None,
            validated_raster=validated_raster,
            keeps_original_url_as_alternative=True,
        )

    @classmethod
    def finished(cls, result: LogoHostingResult) -> "LogoHostingPreflight":
        return cls(None, None, None, None, None, result)


class MCPToolError(RuntimeError):
    """A JSON-RPC tool error, retaining its code for refusal handling."""

    def __init__(self, message: str, *, code: Any = None) -> None:
        super().__init__(message)
        self.code = code


def _extract_mcp_tool_payload(response_body: dict[str, Any]) -> dict[str, Any]:
    """Extract an MCP structured result using the publisher runtime contract."""

    if not isinstance(response_body, dict):
        raise ValueError("MCP response body must be an object")
    if "error" in response_body:
        error = response_body["error"]
        code = error.get("code") if isinstance(error, dict) else None
        message = error.get("message") if isinstance(error, dict) else None
        raise MCPToolError(
            message.strip() if isinstance(message, str) and message.strip() else "MCP tool call failed",
            code=code,
        )

    result = response_body.get("result")
    if not isinstance(result, dict):
        raise ValueError("MCP response result is missing")
    if "isError" in result and type(result["isError"]) is not bool:
        raise ValueError("MCP response has a malformed isError flag")
    if result.get("isError") is True:
        detail = ""
        content = result.get("content")
        if isinstance(content, list):
            detail = next((item.get("text", "").strip() for item in content
                           if isinstance(item, dict) and isinstance(item.get("text"), str)
                           and item.get("text", "").strip()), "")
        structured_error = result.get("structuredContent")
        code = structured_error.get("code") if isinstance(structured_error, dict) else None
        raise MCPToolError((detail or "MCP tool returned an error result")[:500], code=code)

    structured = result.get("structuredContent")
    if isinstance(structured, dict):
        return structured

    content = result.get("content")
    if isinstance(content, list):
        for item in content:
            if not isinstance(item, dict):
                continue
            if isinstance(item.get("json"), dict):
                return item["json"]
            text = item.get("text")
            if isinstance(text, str) and text.strip():
                try:
                    parsed = json.loads(text)
                except json.JSONDecodeError:
                    continue
                if isinstance(parsed, dict):
                    return parsed

    if isinstance(result.get("data"), dict):
        return result["data"]
    raise ValueError("Unable to extract structured payload from MCP response")


def _call_mcp_tool(tool_name: str, arguments: dict[str, Any]) -> dict[str, Any]:
    return _extract_mcp_tool_payload(_host_adapter().request_mcp(tool_name, arguments))


def _first_primary_logo(brandkit: dict[str, Any]) -> dict[str, Any] | None:
    brand = brandkit.get("brand")
    logos = brand.get("logos") if isinstance(brand, dict) else None
    if not isinstance(logos, list):
        return None
    return next(
        (
            logo
            for logo in logos
            if isinstance(logo, dict) and logo.get("type") == "primary"
        ),
        None,
    )


def _prepare_upload(asset_name: str) -> tuple[str, str]:
    manifest = _call_mcp_tool("prepare_image_upload", {"name": asset_name})
    upload_session_id = manifest.get("uploadSessionId")
    uploads = manifest.get("uploads")
    if (
        not isinstance(upload_session_id, str)
        or not upload_session_id
        or not isinstance(uploads, list)
    ):
        raise ValueError("prepare_image_upload returned an invalid upload manifest")
    upload_url: str | None = None
    for upload in uploads:
        if not isinstance(upload, dict):
            continue
        candidate = upload.get("uploadUrl")
        if not isinstance(candidate, str) or not candidate.strip():
            continue
        if upload.get("kind") == "image":
            upload_url = candidate.strip()
            break
        if upload_url is None:
            upload_url = candidate.strip()
    if upload_url is None:
        raise ValueError("prepare_image_upload returned no image upload URL")
    return upload_session_id, upload_url


def _put_sidecar(
    *,
    skill_root: Path,
    sidecar_path: Path,
    upload_url: str,
    data: bytes | None = None,
    content_type: str = _UPLOAD_CONTENT_TYPE_SVG,
) -> None:
    """PUT the exact bytes to the signed upload URL.

    ``content_type`` was a hard-coded ``image/svg+xml`` constant, and that
    constant was the ONLY thing standing between a converted PNG and this
    path: the publisher proxy forwards the header verbatim and the MCP already
    accepts ``image/png``. It stays the default so every existing SVG upload
    is byte-identical.
    """

    input_path = sidecar_path
    tmp_file: tempfile.NamedTemporaryFile[bytes] | None = None
    if data is not None:
        tmp_file = tempfile.NamedTemporaryFile(
            prefix="reteno-logo-upload-",
            suffix=_UPLOAD_TEMP_SUFFIX_BY_CONTENT_TYPE.get(content_type, ".svg"),
            delete=False,
        )
        try:
            tmp_file.write(data)
            tmp_file.flush()
            input_path = Path(tmp_file.name)
        finally:
            tmp_file.close()
    try:
        _host_adapter().upload_file(
            skill_root=skill_root, input_path=input_path, upload_url=upload_url,
            content_type=content_type, timeout_seconds=UPLOAD_TIMEOUT_SECONDS,
        )
    finally:
        if data is not None:
            try:
                input_path.unlink()
            except OSError:
                pass


class RasterConversionError(RuntimeError):
    """A raster logo could not be decoded or re-encoded as PNG."""


def _convert_raster_to_png(sidecar: ValidatedRasterSidecar) -> bytes:
    """Re-encode already-validated raster bytes as an RGBA PNG.

    NO FLATTENING. A transparent mark is composited onto a white card as often
    as onto a dark one, the email surface is not known here, and
    ``brand.logos[].background`` already records the band the mark was measured
    against - so baking a background in would be this module inventing a fact
    it cannot know. Alpha is preserved and the downstream template decides.

    An ANIMATED source (GIF, animated WebP) yields its FIRST FRAME, which is
    what every email client shows for a logo anyway.

    Every failure raises, and the caller turns that into a fail-open
    ``convert-failed``: an undecodable logo must never cost the run its kit.
    """

    feature = _PIL_FEATURE_BY_FORMAT.get(sidecar.image_format)
    if feature is not None and not features.check(feature):
        raise RasterConversionError(
            f"this runtime's Pillow has no {sidecar.image_format} decoder"
        )
    previous_limit = Image.MAX_IMAGE_PIXELS
    # Pinned for the duration of ONE conversion and restored in `finally`:
    # this is a process-global in a long-lived finalizer, and leaving it
    # lowered would silently re-price every other Pillow caller.
    Image.MAX_IMAGE_PIXELS = MAX_LOGO_IMAGE_PIXELS
    try:
        with Image.open(BytesIO(sidecar.data)) as probe:
            probe.verify()
        # `verify()` consumes the file, so the decode needs a fresh open.
        with Image.open(BytesIO(sidecar.data)) as image:
            if image.width * image.height > MAX_LOGO_IMAGE_PIXELS:
                raise RasterConversionError(
                    f"logo is {image.width}x{image.height}, over the "
                    f"{MAX_LOGO_IMAGE_PIXELS}-pixel decode ceiling"
                )
            buffer = BytesIO()
            image.convert("RGBA").save(buffer, "PNG", optimize=True)
    except RasterConversionError:
        raise
    except Exception as exc:  # noqa: BLE001 - fail-open boundary
        raise RasterConversionError(str(exc) or exc.__class__.__name__) from exc
    finally:
        Image.MAX_IMAGE_PIXELS = previous_limit
    return buffer.getvalue()


def _append_original_url_as_alternative(
    brandkit: dict[str, Any],
    *,
    primary: dict[str, Any],
    original_url: str,
) -> None:
    """Keep the page's own logo URL on the kit after hosting replaced it.

    The primary row's `url` is the ONLY place the source URL lived, and hosting
    overwrites it. For the two new source shapes that is a loss worth avoiding:
    the original is a real, page-published asset (already in
    ``authorized_urls``, so the factual gate passes) and the only record of
    where the hosted PNG came from. Idempotent by URL, so a re-host cannot
    append a duplicate.
    """

    if not original_url:
        return
    brand = brandkit.get("brand")
    logos = brand.get("logos") if isinstance(brand, dict) else None
    if not isinstance(logos, list):
        return
    if any(
        isinstance(logo, dict) and logo.get("url") == original_url for logo in logos
    ):
        return
    background = primary.get("background")
    logos.append(
        {
            "type": "alternative",
            "url": original_url,
            "background": background
            if background in {"light", "dark", "unknown"}
            else "unknown",
            "svgPath": "",
        }
    )


def _error_code(value: Any) -> str | None:
    if value is None:
        return None
    return str(value)


def _reason(prefix: str, exc: Exception) -> str:
    detail = " ".join(str(exc).split())[:300]
    return f"{prefix}: {detail}" if detail else prefix


# The renderer that refuses an SVG reports a verdict, never the numbers it
# read. `logo_rasterize_failed: ValueError: SVG has an invalid size` arrived on
# a document that carried an explicit width, an explicit height AND a viewBox,
# and the reason as recorded could not say which of the three the renderer
# refused - so the next occurrence starts the same investigation from nothing.
# These are the root's own dimension attributes, parsed from the exact bytes
# this run uploaded. DIAGNOSTIC ONLY: bounded, never parsed as XML, and never
# an input to any decision here.
_SVG_ROOT_TAG = re.compile(rb"<svg\b[^>]{0,4096}", re.IGNORECASE)
_SVG_ROOT_DIMENSION_ATTRIBUTES = ("width", "height", "viewBox")


def _svg_root_dimensions(data: bytes) -> str:
    """``width="..." height="..." viewBox="..."`` from the uploaded root tag."""

    match = _SVG_ROOT_TAG.search(data[:8192])
    if match is None:
        return ""
    tag = match.group(0).decode("utf-8", "replace")
    parts: list[str] = []
    for name in _SVG_ROOT_DIMENSION_ATTRIBUTES:
        found = re.search(
            rf"\b{name}\s*=\s*([\"'])(.*?)\1", tag, re.IGNORECASE | re.DOTALL
        )
        if found is None:
            continue
        value = " ".join(found.group(2).split())[:40]
        parts.append(f'{name}="{value}"')
    return " ".join(parts)


def _url_path(value: str) -> str:
    try:
        return urlsplit(value).path.lower()
    except ValueError:
        return ""


def reconcile_logo_markup(
    brandkit: dict[str, Any],
    *,
    technical_dir: Path,
    logo_evidence: LogoAssetEvidence | None = None,
) -> list[str]:
    """Remove safe but unbound agent-authored SVG markup from every logo.

    Unsafe markup is deliberately not repaired here: the caller must run the
    original payload through schema and SVG-safety validation first, so an
    unsafe value remains a hard blocker rather than disappearing into a
    warning.  Unknown public URLs are also left untouched for the factual gate.
    """

    evidence = logo_evidence or load_logo_asset_evidence(technical_dir)
    brand = brandkit.get("brand")
    logos = brand.get("logos") if isinstance(brand, dict) else None
    if not isinstance(logos, list):
        return []

    warnings: list[str] = []
    retained: list[Any] = []
    for index, logo in enumerate(logos):
        if not isinstance(logo, dict):
            retained.append(logo)
            continue
        url = logo.get("url")
        svg = logo.get("svgPath")
        if not isinstance(svg, str) or not svg:
            retained.append(logo)
            continue
        if not _svg_markup_is_safe(svg):
            retained.append(logo)
            continue
        svg_hash = _svg_markup_sha256(svg)
        if (
            isinstance(url, str)
            and (url, svg_hash) in evidence.authorized_svg_bindings
        ) or (url == "" and svg_hash in evidence.authorized_inline_svg_hashes):
            retained.append(logo)
            continue
        if isinstance(url, str) and url in evidence.authorized_urls:
            logo["svgPath"] = ""
            retained.append(logo)
            warnings.append(
                f"Removed unbound SVG markup from brand.logos[{index}]; retained the "
                f"exact current-run-evidenced public URL {url}."
            )
            continue
        if url == "":
            warnings.append(
                f"Removed brand.logos[{index}] because its URL is empty and its SVG "
                "markup has no exact current-run inline-SVG evidence binding."
            )
            continue
        # An unknown URL is a hard factual error. Keep both fields so the
        # validator reports the invented URL and the unbound markup.
        retained.append(logo)
    brand["logos"] = retained
    return warnings


def _unique_by_bytes(candidates: list[Any], key: Any) -> Any:
    """Return the single candidate when every match carries the same bytes.

    Two manifest rows for the same URL is the ordinary case - a page that
    renders its logo twice - and they carry identical bytes, so hosting is
    unambiguous. Rows that DISAGREE about what the bytes at one URL are is a
    contradiction this module refuses to resolve by picking one.
    """

    if not candidates:
        return None
    first = candidates[0]
    if any(key(candidate) != key(first) for candidate in candidates[1:]):
        return None
    return first


def prepare_primary_logo(
    brandkit: dict[str, Any],
    *,
    technical_dir: Path,
    logo_evidence: LogoAssetEvidence | None = None,
) -> LogoHostingPreflight:
    """Resolve the primary logo's sidecar without remote calls.

    Keep the extraction's public URL until the shared factual validator checks
    it against this run's capture evidence.  A missing sidecar only means the
    finalizer cannot mint a PNG; it does not invalidate a public source URL the
    page actually exposed.  When a matching manifest entry exists, its captured
    source URL still replaces the agent-authored value before validation.  The
    returned object contains only process-local proof and is never serialized
    into an agent-writable artifact.
    """

    primary = _first_primary_logo(brandkit)
    if primary is None:
        return LogoHostingPreflight.finished(
            LogoHostingResult(None, False, "not-applicable", reason="no primary logo")
        )

    raw_svg_path = primary.get("svgPath")
    svg_path = raw_svg_path if isinstance(raw_svg_path, str) else ""
    original_url_value = primary.get("url")
    original_url = original_url_value if isinstance(original_url_value, str) else ""

    # An empty `svgPath` means the row has no publishable markup, which covers
    # both an already-fine raster URL and the two shapes hosting exists for.
    if not svg_path:
        path = _url_path(original_url)
        # ALREADY EMAIL-SAFE. Do not rewrite a URL that works: the page is
        # serving it, an email client renders it, and replacing it with a
        # hosted copy would add a failure mode and remove nothing. `.webp` was
        # in this tuple and is the single-line reason 7 of 44 stored kits ship
        # a logo no email can show.
        if path.endswith((".png", ".jpg", ".jpeg", ".gif")):
            return LogoHostingPreflight.finished(
                LogoHostingResult(
                    None,
                    False,
                    "not-applicable",
                    reason="primary logo is already an email-safe raster asset",
                )
            )
        evidence = logo_evidence or load_logo_asset_evidence(technical_dir)
        # Tier A - raster bytes the capture kept for exactly this. The MCP
        # hosts a WebP verbatim and refuses AVIF, so the conversion has to
        # happen here.
        raster_candidates = [
            asset
            for asset in evidence.verified_raster_assets
            if asset.source_url == original_url
        ]
        unique_raster = _unique_by_bytes(
            raster_candidates, lambda asset: asset.sidecar.data
        )
        if unique_raster is not None:
            return LogoHostingPreflight.ready_raster(
                validated_raster=unique_raster.sidecar,
                manifest_entry={
                    "url": unique_raster.source_url,
                    "source": unique_raster.source,
                    "localPath": str(unique_raster.sidecar.path),
                    "byteLength": unique_raster.sidecar.byte_length,
                    "sha256": unique_raster.sidecar.sha256,
                    "imageFormat": unique_raster.sidecar.image_format,
                },
                source_url=original_url,
            )
        # Tier B - a SAFE SVG whose reduced markup was too long to PUBLISH.
        # The bytes were never the problem; `LOGO_SVG_PATH_MAX_CHARS` caps the
        # string this pipeline writes into `brand.logos[].svgPath`, and the
        # upload sends the original document instead.
        over_cap_candidates = [
            asset
            for asset in evidence.verified_over_cap_svg_assets
            if asset.source_url == original_url
        ]
        unique_over_cap = _unique_by_bytes(
            over_cap_candidates, lambda asset: asset.sidecar.data
        )
        if unique_over_cap is not None:
            return LogoHostingPreflight.ready(
                validated_sidecar=unique_over_cap.sidecar,
                manifest_entry={
                    "url": unique_over_cap.source_url,
                    "source": unique_over_cap.source,
                    "localPath": str(unique_over_cap.sidecar.path),
                    "svgPath": unique_over_cap.sidecar.svg_path,
                    "byteLength": unique_over_cap.sidecar.byte_length,
                    "pathCount": unique_over_cap.sidecar.path_count,
                    "shapeCount": unique_over_cap.sidecar.shape_count,
                },
                source_url=original_url,
                # The ROW's value, which suppression left empty - not the
                # sidecar's. `host_primary_logo` re-checks the row against
                # this, and the row still publishes nothing.
                svg_path="",
                source_svg_sha256=unique_over_cap.sidecar.svg_path_sha256,
                keeps_original_url_as_alternative=True,
            )
        return LogoHostingPreflight.finished(
            LogoHostingResult(
                None,
                False,
                "skipped-no-sidecar",
                reason="primary logo has no exact source SVG binding to host",
            )
        )

    evidence = logo_evidence or load_logo_asset_evidence(technical_dir)
    svg_hash = _svg_markup_sha256(svg_path)
    if original_url:
        if (original_url, svg_hash) not in evidence.authorized_svg_bindings:
            return LogoHostingPreflight.finished(
                LogoHostingResult(
                    None,
                    False,
                    "skipped-no-sidecar",
                    reason="primary logo has no exact current-run URL/SVG evidence binding",
                )
            )
        candidates = [
            asset
            for asset in evidence.verified_svg_assets
            if asset.source_url == original_url and asset.svg_path_sha256 == svg_hash
        ]
    else:
        if svg_hash not in evidence.authorized_inline_svg_hashes:
            return LogoHostingPreflight.finished(
                LogoHostingResult(
                    None,
                    False,
                    "skipped-no-sidecar",
                    reason="primary inline logo has no exact current-run SVG evidence binding",
                )
            )
        candidates = [
            asset
            for asset in evidence.verified_svg_assets
            if asset.source_url == "" and asset.svg_path_sha256 == svg_hash
        ]

    if not candidates or any(
        candidate.sidecar.data != candidates[0].sidecar.data
        for candidate in candidates[1:]
    ):
        return LogoHostingPreflight.finished(
            LogoHostingResult(
                None,
                False,
                "skipped-no-sidecar",
                reason="no unique verified logo sidecar matches the primary logo",
            )
        )
    asset = candidates[0]
    source_url = asset.source_url
    validated_sidecar = asset.sidecar

    return LogoHostingPreflight.ready(
        validated_sidecar=validated_sidecar,
        manifest_entry={
            "url": source_url,
            "source": asset.source,
            "localPath": str(validated_sidecar.path),
            "svgPath": validated_sidecar.svg_path,
            "byteLength": validated_sidecar.byte_length,
            "pathCount": validated_sidecar.path_count,
            "shapeCount": validated_sidecar.shape_count,
        },
        source_url=source_url,
        svg_path=svg_path,
        source_svg_sha256=validated_sidecar.svg_path_sha256,
    )


def host_primary_logo(
    brandkit: dict[str, Any],
    *,
    technical_dir: Path,
    skill_root: Path,
    slug: str,
    preflight: LogoHostingPreflight | None = None,
) -> LogoHostingResult:
    """Host a locally prepared primary SVG and apply only its exact tool URL.

    Direct callers retain the original one-call API: when *preflight* is not
    supplied this function performs the local preparation itself.  The
    finalization pipeline supplies the preparation it already validated, so no
    remote mutation occurs until every independent blocker is known clean.
    """

    if preflight is None:
        preflight = prepare_primary_logo(brandkit, technical_dir=technical_dir)
    if preflight.result is not None:
        return preflight.result

    primary = _first_primary_logo(brandkit)
    validated_sidecar = preflight.validated_sidecar
    validated_raster = preflight.validated_raster
    # The preflight's proof must still describe the row about to be hosted.
    # Exactly one of the two sources is set, and the digest it was resolved
    # under must still be the digest of the bytes on disk.
    source_digest = (
        validated_raster.sha256
        if validated_raster is not None
        else validated_sidecar.svg_path_sha256
        if validated_sidecar is not None
        else None
    )
    if (
        primary is None
        or primary.get("url") != preflight.source_url
        or primary.get("svgPath") != preflight.svg_path
        or (validated_sidecar is None) == (validated_raster is None)
        or preflight.manifest_entry is None
        or source_digest is None
        or preflight.source_svg_sha256 != source_digest
    ):
        return LogoHostingResult(
            None,
            False,
            "skipped-no-sidecar",
            reason="primary logo changed after local hosting preflight",
        )

    upload_content_type = _UPLOAD_CONTENT_TYPE_SVG
    if validated_raster is not None:
        # BEFORE `prepare_image_upload`, deliberately. The upload APIs expose
        # no rollback, so a conversion that cannot succeed must fail while
        # there is still nothing remote to orphan.
        try:
            upload_bytes = _convert_raster_to_png(validated_raster)
        except RasterConversionError as exc:
            return LogoHostingResult(
                None,
                False,
                "convert-failed",
                reason=_reason("raster logo could not be converted to PNG", exc),
            )
        upload_path = validated_raster.path
        upload_content_type = _UPLOAD_CONTENT_TYPE_PNG
    else:
        upload_bytes = validated_sidecar.data
        upload_path = validated_sidecar.path

    # Carried on every renderer verdict below, and on nothing else: the
    # dimensions belong to the SVG document that was refused.
    svg_root_dimensions = (
        _svg_root_dimensions(upload_bytes)
        if upload_content_type == _UPLOAD_CONTENT_TYPE_SVG
        else ""
    )

    def with_svg_root(reason: str) -> str:
        if not svg_root_dimensions:
            return reason
        return f"{reason} [svg root: {svg_root_dimensions}]"

    asset_name = f"{slug}-logo.png"
    try:
        upload_session_id, upload_url = _prepare_upload(asset_name)
    except MCPToolError as exc:
        if str(exc.code) == "-32040":
            return LogoHostingResult(
                None,
                True,
                "skipped-unattended",
                error_code="-32040",
                reason=_reason("prepare_image_upload refused the unattended run", exc),
            )
        return LogoHostingResult(
            None,
            True,
            "upload-failed",
            error_code=_error_code(exc.code),
            reason=_reason("prepare_image_upload failed", exc),
        )
    except Exception as exc:  # noqa: BLE001 - fail-open boundary
        return LogoHostingResult(
            None,
            True,
            "upload-failed",
            reason=_reason("prepare_image_upload failed", exc),
        )

    try:
        _put_sidecar(
            skill_root=skill_root,
            sidecar_path=upload_path,
            data=upload_bytes,
            upload_url=upload_url,
            content_type=upload_content_type,
        )
    except Exception as exc:  # noqa: BLE001 - fail-open boundary
        return LogoHostingResult(
            None,
            True,
            "upload-failed",
            reason=_reason("signed SVG upload failed", exc),
        )

    try:
        upload_result = _call_mcp_tool(
            "upload_image",
            {
                "uploadSessionId": upload_session_id,
                "name": asset_name,
                "purpose": "logo",
            },
        )
    except MCPToolError as exc:
        return LogoHostingResult(
            None,
            True,
            "rasterize-failed",
            error_code=_error_code(exc.code),
            reason=with_svg_root(_reason("upload_image failed", exc)),
        )
    except Exception as exc:  # noqa: BLE001 - fail-open boundary
        return LogoHostingResult(
            None,
            True,
            "rasterize-failed",
            reason=with_svg_root(_reason("upload_image failed", exc)),
        )

    returned_error_code = upload_result.get("error_code")
    if returned_error_code is not None:
        raw_reason = upload_result.get("reason")
        reason = raw_reason if isinstance(raw_reason, str) and raw_reason else "logo rasterization failed"
        return LogoHostingResult(
            None,
            True,
            "rasterize-failed",
            error_code=_error_code(returned_error_code),
            reason=with_svg_root(" ".join(reason.split())[:300]),
        )

    data = upload_result.get("data")
    hosted_url = data.get("url") if isinstance(data, dict) else None
    if not isinstance(hosted_url, str) or not _url_path(hosted_url).endswith(".png"):
        return LogoHostingResult(
            None,
            True,
            "upload-failed",
            reason="upload_image did not return a .png URL",
        )

    # Apply the exact tool result. Do not normalize, strip, or persist it into
    # any technical artifact; the return value is the runtime proof consumed
    # by finalizer validators later in this same process.
    original_url = primary.get("url")
    primary["url"] = hosted_url
    if preflight.keeps_original_url_as_alternative and isinstance(original_url, str):
        _append_original_url_as_alternative(
            brandkit, primary=primary, original_url=original_url
        )
    return LogoHostingResult(
        hosted_url,
        True,
        "minted",
        source_svg_sha256=source_digest,
    )

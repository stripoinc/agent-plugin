"""Adapt the shared finalizer's logical calls to Stripo MCP.

The consuming host supplies authenticated request_mcp and signed-file upload_file
callbacks and the explicitly selected project/gallery target. This module owns
only argument/response adaptation and local logo conversion, never OAuth or a
second MCP connection. Profile persistence still uses the shared Phase 5 flow.
"""
from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass
from datetime import datetime, timezone
from io import BytesIO
import json
import os
from pathlib import Path
import re
import subprocess
import sys
import tempfile
from typing import Any, Callable
from urllib.parse import urlsplit
import xml.etree.ElementTree as ET

from PIL import Image

from ..logo_hosting import MCPToolError, _extract_mcp_tool_payload
from ..validation import LOGO_ASSET_MAX_BYTES, _validate_standalone_svg_document

MAX_PNG_BYTES = 5 * 1024 * 1024
MAX_PNG_DIMENSION = 4000
_WORKER = Path(__file__).with_name("_stripo_svg_worker.py")


def _positive_id(value: Any, name: str) -> int:
    if type(value) is not int or value <= 0:
        raise ValueError(f"{name} must be a positive integer")
    return value


def _https_url(value: Any) -> str:
    if not isinstance(value, str):
        raise ValueError("Stripo returned no HTTPS URL")
    parsed = urlsplit(value)
    if (value != value.strip() or parsed.scheme != "https" or not parsed.hostname
            or parsed.username is not None or parsed.password is not None or parsed.fragment):
        raise ValueError("Stripo returned an invalid HTTPS URL")
    return value


def _response(raw: Any) -> dict[str, Any]:
    if not isinstance(raw, dict):
        raise ValueError("MCP response must be an object")
    if "result" in raw or "error" in raw:
        return raw
    # Native host bridges commonly return CallToolResult without JSON-RPC.
    if "content" in raw or "structuredContent" in raw or "isError" in raw:
        return {"result": raw}
    raise ValueError("Expected a JSON-RPC response or MCP CallToolResult")


def _payload(raw: dict[str, Any]) -> dict[str, Any]:
    payload = _extract_mcp_tool_payload(raw)
    if payload.get("error_code") is not None:
        raise MCPToolError(str(payload.get("reason") or "Stripo tool failed"),
                           code=payload["error_code"])
    return payload


def _with_payload(raw: dict[str, Any], payload: dict[str, Any]) -> dict[str, Any]:
    result = dict(raw["result"])
    result.pop("data", None)
    result.update(structuredContent=payload,
                  content=[{"type": "text", "text": json.dumps(payload, ensure_ascii=False)}])
    return {**raw, "result": result}


def _png_bytes(data: bytes, max_bytes: int) -> bytes:
    if not data or len(data) > min(max_bytes, MAX_PNG_BYTES):
        raise ValueError("Logo PNG exceeds the upload byte limit or is empty")
    with Image.open(BytesIO(data)) as image:
        if (image.format != "PNG" or getattr(image, "n_frames", 1) != 1
                or not (0 < image.width <= MAX_PNG_DIMENSION
                        and 0 < image.height <= MAX_PNG_DIMENSION)):
            raise ValueError("Logo must be a static PNG within 4000x4000 pixels")
        image.verify()
    with Image.open(BytesIO(data)) as image:
        if image.convert("RGBA").getchannel("A").getbbox() is None:
            raise ValueError("Logo PNG is fully transparent")
    return data


def _svg_to_png(data: bytes, *, timeout_seconds: float, max_bytes: int) -> bytes:
    if not data or len(data) > LOGO_ASSET_MAX_BYTES:
        raise ValueError("Logo SVG exceeds the captured-asset byte limit or is empty")
    svg = data.decode("utf-8", errors="strict")
    _validate_standalone_svg_document(svg)
    root = ET.fromstring(svg)
    # Never silently replace brand lettering with a system/fallback font. Path
    # outlines need no fonts. Hosts can provide an exact-font renderer callback.
    if any(node.tag.rsplit("}", 1)[-1] in {"text", "tspan", "textPath"}
           and "".join(node.itertext()).strip() for node in root.iter()):
        raise ValueError("SVG logo contains live text; supply an exact-font renderer or captured PNG")
    with tempfile.TemporaryDirectory(prefix="stripo-logo-render-") as directory:
        source, output = Path(directory) / "logo.svg", Path(directory) / "logo.png"
        source.write_bytes(data)
        # No inherited credentials, proxy settings, PYTHONPATH or injection flags.
        environment = {key: os.environ[key] for key in
                       ("PATH", "SYSTEMROOT", "WINDIR", "TMPDIR", "TEMP", "TMP", "LANG", "LC_ALL")
                       if key in os.environ}
        result = subprocess.run(
            [sys.executable, "-I", "-B", str(_WORKER), str(source), str(output)],
            env=environment, capture_output=True, timeout=min(timeout_seconds, 10.0),
        )
        if result.returncode != 0:
            raise RuntimeError("Local SVG rendering failed; install the pinned Stripo adapter requirements")
        with output.open("rb") as stream:
            return _png_bytes(stream.read(min(max_bytes, MAX_PNG_BYTES) + 1), max_bytes)


@dataclass
class _Ticket:
    session_id: str
    upload_url: str
    name: str
    max_bytes: int
    expires_at: datetime
    state: str = "prepared"


class StripoBusinessProfileAdapter:
    """Bind one finalizer run to an authenticated project and optional gallery.

    Callbacks follow the shared host contract. upload_file must raise on any
    unsuccessful/uncertain transfer. Optional render_svg receives validated SVG
    bytes and returns PNG bytes; its host owns exact fonts and render isolation.
    It is only needed for SVG text or another explicitly selected renderer.
    """

    def __init__(
        self, *, project_id: int, request_mcp: Callable[..., dict[str, Any]],
        upload_file: Callable[..., None], logo_target_id: int | None = None,
        logo_target_type: str = "EMAIL", render_svg: Callable[[bytes], bytes] | None = None,
    ) -> None:
        self._project_id = _positive_id(project_id, "project_id")
        self._target_id = (None if logo_target_id is None
                           else _positive_id(logo_target_id, "logo_target_id"))
        if logo_target_type not in {"EMAIL", "TEMPLATE"}:
            raise ValueError("logo_target_type must be EMAIL or TEMPLATE")
        if not callable(request_mcp) or not callable(upload_file):
            raise ValueError("Authenticated MCP and signed-upload callbacks are required")
        if render_svg is not None and not callable(render_svg):
            raise ValueError("render_svg must be callable")
        self._target_type = logo_target_type
        self._request, self._upload, self._render_svg = request_mcp, upload_file, render_svg
        self._tickets: dict[str, _Ticket] = {}

    def _call(self, name: str, arguments: dict[str, Any]) -> dict[str, Any]:
        return _response(self._request(name, arguments))

    def _verify_gallery(self) -> None:
        if self._target_id is None:
            raise ValueError("Logo hosting requires an explicitly authorized email/template in the selected project")
        payload = _payload(self._call("get_content", {
            "id": self._target_id, "type": self._target_type.lower(), "includeHtml": False,
        }))
        if (payload.get("status") != "OK" or type(payload.get("projectId")) is not int
                or type(payload.get("id")) is not int or payload.get("projectId") != self._project_id
                or payload.get("id") != self._target_id
                or payload.get("type") != self._target_type.lower()):
            raise ValueError("Logo gallery target is unavailable or differs from the selected project/target")

    def request_mcp(self, tool_name: str, arguments: dict[str, Any]) -> dict[str, Any]:
        if tool_name == "get_brandkit":
            if arguments:
                raise ValueError("The profile read uses the adapter's selected project")
            raw = self._call("get_business_profile", {"projectId": self._project_id})
            payload = _payload(raw)
            if "businessProfileId" not in payload or not isinstance(payload.get("businessProfile"), dict):
                raise ValueError("Stripo returned an invalid Business Profile response")
            profile_id = payload["businessProfileId"]
            if profile_id is not None and (not isinstance(profile_id, str) or not profile_id.strip()):
                raise ValueError("Stripo returned an invalid businessProfileId")
            return _with_payload(raw, {"brandkit": deepcopy(payload["businessProfile"])
                                      if profile_id is not None else None,
                                      "businessProfileId": profile_id})
        if tool_name == "prepare_image_upload":
            if set(arguments) != {"name"}:
                raise ValueError("Logo preparation accepts only its file name")
            name = arguments["name"]
            if (not isinstance(name, str) or not name or len(name.encode("utf-16-le")) > 200
                    or re.search(r"[/\\\x00-\x1f]", name) or not name.endswith(".png")):
                raise ValueError("Logo name must be a plain .png filename of at most 100 characters")
            self._verify_gallery()
            raw = self._call(tool_name, {"id": self._target_id, "type": self._target_type, "name": name})
            manifest = _payload(raw)
            session = manifest.get("uploadSessionId")
            uploads = manifest.get("uploads")
            if not isinstance(session, str) or not re.fullmatch(r"[0-9a-fA-F]{32}", session):
                raise ValueError("Stripo returned an invalid image session")
            if not isinstance(uploads, list) or len(uploads) != 1 or not isinstance(uploads[0], dict):
                raise ValueError("Stripo returned an invalid image upload manifest")
            upload = uploads[0]
            if (upload.get("kind") != "image" or upload.get("method") != "PUT"
                    or not isinstance(upload.get("contentTypes"), list)
                    or "image/png" not in upload["contentTypes"]
                    or upload.get("headers")):
                raise ValueError("Stripo image ticket does not support the PNG PUT contract")
            limit = _positive_id(upload.get("maxBytes"), "maxBytes")
            expires = datetime.fromisoformat(str(manifest.get("expiresAt")).replace("Z", "+00:00"))
            if expires.tzinfo is None or expires <= datetime.now(timezone.utc):
                raise ValueError("Stripo image ticket is expired or has no timezone")
            url = _https_url(upload.get("uploadUrl"))
            if session in self._tickets or any(ticket.upload_url == url for ticket in self._tickets.values()):
                raise ValueError("Stripo returned a duplicate image ticket")
            self._tickets[session] = _Ticket(session, url, name, limit, expires)
            return raw
        if tool_name == "upload_image":
            if set(arguments) != {"uploadSessionId", "name", "purpose"} or arguments["purpose"] != "logo":
                raise ValueError("Only the shared finalizer's logo operation is supported")
            ticket = self._tickets.get(arguments["uploadSessionId"])
            if ticket is None or ticket.name != arguments["name"] or ticket.state != "uploaded":
                raise ValueError("Logo finalize requires this run's successfully uploaded ticket and name")
            self._check_expiry(ticket)
            self._verify_gallery()
            # Spent or uncertain attempts must never be replayed automatically.
            ticket.state = "finalize-attempted"
            raw = self._call(tool_name, {"id": self._target_id, "type": self._target_type,
                                       "uploadSessionId": ticket.session_id, "name": ticket.name})
            payload = _payload(raw)
            data = payload.get("data")
            if (not isinstance(data, dict) or data.get("contentType") != "image/png"
                    or type(data.get("bytes")) is not int or data["bytes"] <= 0):
                raise ValueError("Stripo did not confirm a hosted PNG")
            url = _https_url(data.get("url"))
            if not urlsplit(url).path.lower().endswith(".png"):
                raise ValueError("Stripo did not return a permanent .png URL")
            ticket.state = "finalized"
            return raw
        raise ValueError(f"Unsupported finalizer operation: {tool_name}")

    @staticmethod
    def _check_expiry(ticket: _Ticket) -> None:
        if ticket.expires_at <= datetime.now(timezone.utc):
            raise ValueError("Stripo image ticket has expired")

    def upload_file(self, *, skill_root: Path, input_path: Path, upload_url: str,
                    content_type: str, timeout_seconds: float) -> None:
        ticket = next((row for row in self._tickets.values() if row.upload_url == upload_url), None)
        if ticket is None or ticket.state != "prepared":
            raise ValueError("Logo transfer requires this run's unused image upload URL")
        self._check_expiry(ticket)
        if timeout_seconds <= 0:
            raise ValueError("Logo upload timeout must be positive")
        limit = LOGO_ASSET_MAX_BYTES if content_type == "image/svg+xml" else min(ticket.max_bytes, MAX_PNG_BYTES)
        with input_path.open("rb") as stream:
            data = stream.read(limit + 1)
        if not data or len(data) > limit:
            raise ValueError("Logo exceeds the input byte limit or is empty")
        if content_type == "image/svg+xml":
            # Even an exact-font host renderer receives only validated local SVG.
            _validate_standalone_svg_document(data.decode("utf-8", errors="strict"))
            data = (_png_bytes(self._render_svg(data), ticket.max_bytes) if self._render_svg
                    else _svg_to_png(data, timeout_seconds=timeout_seconds, max_bytes=ticket.max_bytes))
        elif content_type == "image/png":
            data = _png_bytes(data, ticket.max_bytes)
        else:
            raise ValueError("Shared logo upload must supply SVG or PNG")
        self._check_expiry(ticket)
        with tempfile.TemporaryDirectory(prefix="stripo-logo-upload-") as directory:
            output = Path(directory) / ticket.name
            output.write_bytes(data)
            ticket.state = "transfer-attempted"
            self._upload(skill_root=skill_root, input_path=output, upload_url=ticket.upload_url,
                         content_type="image/png", timeout_seconds=timeout_seconds)
            ticket.state = "uploaded"

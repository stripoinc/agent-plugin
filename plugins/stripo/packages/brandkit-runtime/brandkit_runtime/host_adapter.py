"""Load the consuming host's two-call transport contract explicitly.

BRANDKIT_HOST_ADAPTER must name an absolute Python file implementing
request_mcp(tool_name, arguments) -> raw JSON-RPC response and
upload_file(*, skill_root, input_path, upload_url, content_type, timeout_seconds).
The host owns authentication, routing, and upload execution. Missing configuration
raises at the transport boundary; existing logo/report failure policies own the
user-visible outcome. No adapter is loaded during offline validation.
"""
from __future__ import annotations

import importlib.util
import os
from pathlib import Path
from types import ModuleType


def load_host_adapter() -> ModuleType:
    raw_path = os.environ.get("BRANDKIT_HOST_ADAPTER", "").strip()
    if not raw_path:
        raise RuntimeError("BRANDKIT_HOST_ADAPTER is not configured")
    path = Path(raw_path)
    if not path.is_absolute() or not path.is_file():
        raise RuntimeError("BRANDKIT_HOST_ADAPTER must name an absolute Python file")
    spec = importlib.util.spec_from_file_location("_brandkit_consumer_host_adapter", path)
    if spec is None or spec.loader is None:
        raise RuntimeError("BRANDKIT_HOST_ADAPTER could not be loaded")
    adapter = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(adapter)
    for name in ("request_mcp", "upload_file"):
        if not callable(getattr(adapter, name, None)):
            raise RuntimeError(f"BRANDKIT_HOST_ADAPTER must implement {name}")
    return adapter

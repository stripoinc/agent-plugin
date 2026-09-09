#!/usr/bin/env python3
"""Run the shared finalizer from a source checkout or installed skill bundle."""
from pathlib import Path
import sys
import os

# Installed runtime packages can be read-only and must stay release-clean.
sys.dont_write_bytecode = True

script_dir = Path(__file__).resolve().parent
for package_root in (
    script_dir.parent / "shared",
    script_dir.parents[2] / "packages" / "brandkit-runtime",
):
    if (package_root / "brandkit_runtime" / "__init__.py").is_file():
        sys.path.insert(0, str(package_root))
        break
else:
    raise SystemExit("Brandkit runtime package is missing; reinstall the complete skill bundle")

host_adapter = script_dir / "host_adapter.py"
if host_adapter.is_file():
    os.environ.setdefault("BRANDKIT_HOST_ADAPTER", str(host_adapter))

from brandkit_runtime.__main__ import main

if __name__ == "__main__":
    raise SystemExit(main())

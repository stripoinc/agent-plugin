"""Isolated, offline PNG renderer for the Stripo provider adapter."""
from pathlib import Path
import sys


def render(source: Path, output: Path) -> None:
    try:
        import resource
        for name, limit in (("RLIMIT_AS", 512 * 1024 * 1024), ("RLIMIT_CPU", 8)):
            try:
                key = getattr(resource, name)
                _, hard = resource.getrlimit(key)
                bound = limit if hard == resource.RLIM_INFINITY else min(limit, hard)
                resource.setrlimit(key, (bound, bound))
            except (AttributeError, OSError, ValueError):
                pass
    except ImportError:
        pass  # The parent wall-clock deadline and bounded render dimensions remain.
    import resvg_py
    if resvg_py.__version__ != "0.3.3":
        raise RuntimeError("The Stripo adapter requires resvg-py==0.3.3")
    png = resvg_py.svg_to_bytes(
        svg_string=source.read_text(encoding="utf-8"), width=600, height=2000,
        dpi=96.0, font_size=16.0, languages=["en"],
        skip_system_fonts=True, font_files=[],
    )
    output.write_bytes(png)


if __name__ == "__main__":
    render(Path(sys.argv[1]), Path(sys.argv[2]))

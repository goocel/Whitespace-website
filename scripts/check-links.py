#!/usr/bin/env python3
"""Fail if any relative href/src in the site's HTML points at a file that does not exist."""
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SKIP_DIRS = {"design-reference", "node_modules", ".git", ".github"}
SKIP_PREFIXES = ("http://", "https://", "//", "mailto:", "tel:", "#", "data:", "javascript:")
ATTR = re.compile(r'(?:href|src)="([^"]*)"')

broken = []
pages = [p for p in ROOT.rglob("*.html") if not SKIP_DIRS & set(p.relative_to(ROOT).parts)]
for page in sorted(pages):
    for ref in ATTR.findall(page.read_text(encoding="utf-8")):
        if not ref or ref.startswith(SKIP_PREFIXES):
            continue
        path = ref.split("#")[0].split("?")[0]
        if not path:
            continue
        base = ROOT if path.startswith("/") else page.parent
        if not (base / path.lstrip("/")).exists():
            broken.append(f"{page.relative_to(ROOT)}: {ref}")

print(f"Checked {len(pages)} pages.")
if broken:
    print("Broken references:\n  " + "\n  ".join(broken))
    sys.exit(1)
print("No broken references.")

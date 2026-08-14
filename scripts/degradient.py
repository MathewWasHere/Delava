#!/usr/bin/env python3
"""
Remove every gradient from the component layer and replace it with a solid
brand colour.

Gradients fall into three buckets here, each needing a different fix:

1. BRAND FILLS  `bg-gradient-to-l from-flame-700 to-flame-500`
   -> a single solid `bg-flame-600` (the action red).

2. PHOTO SCRIMS `bg-gradient-to-t from-black ...` over imagery
   -> a flat translucent wash. A solid rgba layer still guarantees text
      contrast without being a gradient.

3. DECORATIVE TINTS (blurred blobs, mask-image fades)
   -> deleted outright; they exist only to look pretty and the brief says
      every visual element must have a purpose.
"""
import pathlib
import re

SRC = pathlib.Path("/home/user/delava/src")

# --- 1. brand fills -> solid --------------------------------------------
FILL = [
    ("bg-gradient-to-l from-flame-700 to-flame-500", "bg-flame-600"),
    ("bg-gradient-to-l from-flame-700 to-flame-400", "bg-flame-600"),
    ("bg-gradient-to-r from-flame-700 to-flame-500", "bg-flame-600"),
    ("bg-gradient-to-t from-flame-700 to-flame-400", "bg-flame-600"),
    ("bg-gradient-to-br from-flame-600 to-flame-800", "bg-flame-600"),
    ("bg-gradient-to-b from-ink-850 to-ink-900", "bg-ink-900"),
    ("bg-gradient-to-b from-ink-900 to-black", "bg-ink-900"),
    ("bg-gradient-to-l from-flame-600/12 to-transparent", "bg-flame-600/8"),
    ("bg-gradient-to-l from-flame-600/10 to-transparent", "bg-flame-600/8"),
    ("bg-gradient-to-l from-flame-600/12 via-ink-850 to-ink-850", "bg-ink-850"),
    ("bg-gradient-to-l from-flame-600/10 via-ink-850 to-ink-850", "bg-ink-850"),
    ("bg-gradient-to-l from-flame-600/22 via-ink-900 to-ink-900", "bg-ink-900"),
    ("bg-gradient-to-l from-flame-700/25 via-ink-900 to-ink-900", "bg-ink-900"),
    ("bg-gradient-to-l from-flame-600/10 to-ink-900", "bg-ink-900"),
]

# --- 2. photo scrims -> flat wash ---------------------------------------
SCRIM = [
    ("bg-gradient-to-t from-black via-black/45 to-transparent", "bg-black/45"),
    ("bg-gradient-to-t from-black via-black/40 to-transparent", "bg-black/45"),
    ("bg-gradient-to-t from-black via-black/35 to-transparent", "bg-black/40"),
    ("bg-gradient-to-t from-black via-black/30 to-transparent", "bg-black/40"),
    ("bg-gradient-to-t from-ink-950 via-ink-950/85 via-40% to-ink-950/25", "bg-ink-950/70"),
    ("bg-gradient-to-l from-ink-950 via-ink-950/85 to-ink-950/40", "bg-ink-950/55"),
    ("bg-gradient-to-t from-ink-950 to-transparent", "bg-ink-950/60"),
    ("bg-gradient-to-b from-black/70 to-transparent", "bg-black/45"),
    ("bg-gradient-to-t from-black to-transparent", "bg-black/45"),
]

# --- 3. decorative -> removed -------------------------------------------
DROP_PATTERNS = [
    # radial glow blobs
    r'\s*<div className="absolute [^"]*bg-\[radial-gradient\([^"]*\)\][^"]*" />\n?',
    r'\s*<div className="absolute [^"]*rounded-full bg-flame-600/\d+ blur-\[\d+px\][^"]*" />\n?',
    # mask-image fades on decorative imagery
    r'\s*\[mask-image:linear-gradient\([^\]]*\)\]',
]


def main() -> None:
    files = sorted(SRC.rglob("*.tsx"))
    touched = 0
    for f in files:
        s = f.read_text()
        orig = s
        for a, b in FILL + SCRIM:
            s = s.replace(a, b)
        for pat in DROP_PATTERNS:
            s = re.sub(pat, "", s)
        if s != orig:
            f.write_text(s)
            touched += 1

    # report leftovers
    left = []
    for f in files:
        for i, line in enumerate(f.read_text().split("\n"), 1):
            if re.search(r"(linear|radial|conic)-gradient|bg-gradient-to-", line):
                left.append(f"{f.relative_to(SRC)}:{i}: {line.strip()[:110]}")
    print(f"files touched: {touched}")
    print(f"remaining gradients: {len(left)}")
    for l in left:
        print("  ", l)


if __name__ == "__main__":
    main()

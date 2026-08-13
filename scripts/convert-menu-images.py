#!/usr/bin/env python3
"""
Convert the restaurant's real menu photos to web-optimised WebP.

Input : /home/user/uploads/<persian name>.(jpg|jpeg|png)
Output: public/food/<slug>.webp        800x800  (detail / desktop cards)
        public/food/<slug>-sm.webp     400x400  (mobile list rows)

Photos are square-cropped (centre) so every card looks consistent.
"""
from PIL import Image, ImageOps
import os
import pathlib

SRC = pathlib.Path("/home/user/uploads")
OUT = pathlib.Path("/home/user/delava/public/food")

# Persian filename -> slug used by the catalog
MAP = {
    "پیتزا مخصوص آمریکایی": "pizza-makhsoos",
    "پیتزا پپرونی آمریکایی": "pizza-pepperoni",
    "پیتزا میکس آمریکایی": "pizza-mix",
    "پیتزا مکزیکی آمریکایی": "pizza-mexican",
    "پیتزا چیکن آمریکایی": "pizza-chicken",
    "پیتزا گوشت و قارچ آمریکایی": "pizza-beef-mushroom",
    "پیتزا رست بیف آمریکایی": "pizza-roastbeef",
    "پیتزا سبزیجات آمریکایی": "pizza-vegetable",
    "پیتزا چهارفصل آمریکایی": "pizza-four-season",
    "پیتزا دوفصل آمریکایی": "pizza-two-season",
    "پیتزا آمریکن آمریکایی": "pizza-american",
    "پیتزا استاف کراست آمریکایی": "pizza-stuffed-crust",
    "پیتزا استاف کراست اسپشیال آمریکایی": "pizza-stuffed-crust-special",
    "رویال برگر": "burger-royal",
    "قارچ برگر": "burger-mushroom",
    "میکس برگر": "burger-mix",
    "برگر تنوری": "burger-tanoori",
    "هات لاورز برگر": "burger-hot-lovers",
    "رول برگر": "roll-burger",
    "رول هات داگ": "roll-hotdog",
    "پپرونی فرایز": "pepperoni-fries",
    "سیب زمینی سرخ شده با قارچ و پنیر پیتزا": "fries-mushroom-cheese",
    "نوشابه قوطی": "soda-can",
    "نوشابه بطری": "soda-bottle",
    "نوشابه خانواده": "soda-family",
    "دوغ بطری": "doogh-bottle",
    "آب معدنی کوچک": "water-small",
}

EXTS = [".jpg", ".jpeg", ".png"]


def find(name: str):
    for ext in EXTS:
        p = SRC / f"{name}{ext}"
        if p.exists():
            return p
    return None


def convert(path: pathlib.Path, slug: str):
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)

    # Flatten transparency onto white (product shots on white backgrounds)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGBA", im.size, (255, 255, 255, 255))
        im = Image.alpha_composite(bg, im)
    im = im.convert("RGB")

    # Centre square crop
    w, h = im.size
    side = min(w, h)
    im = im.crop(((w - side) // 2, (h - side) // 2, (w + side) // 2, (h + side) // 2))

    results = []
    for size, suffix, quality in ((800, "", 82), (400, "-sm", 78)):
        out = im.resize((size, size), Image.LANCZOS)
        dest = OUT / f"{slug}{suffix}.webp"
        out.save(dest, "WEBP", quality=quality, method=6)
        results.append((dest.name, dest.stat().st_size // 1024))
    return results


def main():
    OUT.mkdir(parents=True, exist_ok=True)

    # Remove the old AI-generated placeholders
    removed = 0
    for old in OUT.glob("*.jpg"):
        old.unlink()
        removed += 1
    print(f"removed {removed} old placeholder images\n")

    total = 0
    missing = []
    for name, slug in MAP.items():
        src = find(name)
        if not src:
            missing.append(name)
            continue
        for fname, kb in convert(src, slug):
            print(f"  {kb:>4} KB  {fname}")
            total += kb

    print(f"\nconverted {len(MAP) - len(missing)}/{len(MAP)} items — {total} KB total")
    if missing:
        print("MISSING:", missing)


if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Prepare Delava brand + hero assets for the web app.

- Hero: produce responsive WebP crops from the official storefront render.
  The round sign (right side) is the hero's focal point, so the mobile crops
  keep it in frame instead of centre-cropping it away.
- PWA icons: regenerate from the official icon assets (no hand-made art).
"""
from PIL import Image
import pathlib

UP = pathlib.Path("/home/user/uploads")
PUB = pathlib.Path("/home/user/delava/public")
HERO_SRC = UP / "ChatGPT Image Aug 13, 2026, 11_50_20 PM.png"

(PUB / "hero").mkdir(parents=True, exist_ok=True)
(PUB / "icons").mkdir(parents=True, exist_ok=True)


def save(im, path, q=82):
    im.save(path, "WEBP", quality=q, method=6)
    return path.stat().st_size // 1024


def crop_focal(im, target_w, target_h, focal_x=0.72):
    """
    Crop to an aspect ratio while keeping `focal_x` (0..1 across the width)
    inside the frame. The sign sits right-of-centre in this artwork.
    """
    src_w, src_h = im.size
    target_ratio = target_w / target_h
    src_ratio = src_w / src_h

    if src_ratio > target_ratio:
        # source is wider -> crop width around the focal point
        new_w = int(src_h * target_ratio)
        centre = int(src_w * focal_x)
        left = max(0, min(src_w - new_w, centre - new_w // 2))
        box = (left, 0, left + new_w, src_h)
    else:
        new_h = int(src_w / target_ratio)
        top = max(0, (src_h - new_h) // 2)
        box = (0, top, src_w, top + new_h)

    return im.crop(box).resize((target_w, target_h), Image.LANCZOS)


def main():
    hero = Image.open(HERO_SRC).convert("RGB")
    print(f"hero source: {hero.size}")

    out = []
    # Desktop / tablet — wide, full composition
    out.append(("hero-desktop.webp", crop_focal(hero, 1600, 900, 0.60), 80))
    # Mobile uses the SAME landscape composition, just fewer pixels.
    out.append(("hero-mobile.webp", crop_focal(hero, 1024, 576, 0.60), 80))
    # Smallest phones — same framing again.
    out.append(("hero-mobile-sm.webp", crop_focal(hero, 768, 432, 0.60), 78))

    for name, im, q in out:
        kb = save(im, PUB / "hero" / name, q)
        print(f"  {kb:>4} KB  hero/{name}  {im.size}")

    # ---- PWA icons straight from the official icon assets ----
    icon_light = Image.open(UP / "delava-icon-light.png").convert("RGBA")
    icon_dark = Image.open(UP / "delava-icon-dark.png").convert("RGBA")

    def flatten(icon, bg):
        canvas = Image.new("RGBA", icon.size, bg)
        return Image.alpha_composite(canvas, icon).convert("RGB")

    # Standard icons use the dark square (brand's night identity)
    for size in (192, 512):
        flatten(icon_dark, (11, 11, 11, 255)).resize((size, size), Image.LANCZOS).save(
            PUB / "icons" / f"icon-{size}.png", optimize=True
        )
    # Maskable: pad so Android's circular crop never clips the wordmark
    for size in (192, 512):
        base = flatten(icon_dark, (11, 11, 11, 255))
        canvas = Image.new("RGB", (size, size), (11, 11, 11))
        inner = int(size * 0.72)
        canvas.paste(base.resize((inner, inner), Image.LANCZOS), ((size - inner) // 2, (size - inner) // 2))
        canvas.save(PUB / "icons" / f"icon-maskable-{size}.png", optimize=True)

    flatten(icon_light, (255, 255, 255, 255)).resize((180, 180), Image.LANCZOS).save(
        PUB / "icons" / "apple-touch-icon.png", optimize=True
    )
    print("icons regenerated from official asset pack")


if __name__ == "__main__":
    main()

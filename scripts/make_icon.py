"""Render the Gomoku app launcher icon.

Produces a 512x512 PNG master plus 6 Android-density variants, all written
to the output directory (default: ``www/images``). Run from the repo root:

    python3 scripts/make_icon.py                # writes www/images/icon*.png
    python3 scripts/make_icon.py /tmp/icons     # custom output directory

Design: 4 alternating Go stones (B/W/W/B) sitting on the 4 intersections
of a "#"-shaped grid, on a wood-floor background. There is no outer board
frame -- only 2 horizontal + 2 vertical grid lines, each running edge-to-
edge of the canvas, forming a hash pattern. This frees up the corners and
lets the stones grow noticeably larger than they could fit inside a closed
board.

         |             |
         |             |
    -----+-------------+-----
         |[B]       [W]|
         |             |
         |[W]       [B]|
    -----+-------------+-----
         |             |
         |             |

Each stone has a radial highlight gradient + dark rim plus a softly
blurred drop shadow for a glossy, lifted look.

Tunable knobs (see constants below):

* ``HASH_LINE_INSET`` -- distance from each canvas edge to the
  corresponding hash line. Smaller value pushes the 4 stones farther apart
  (and lets them grow); larger value brings them closer to centre.
* ``STONE_FILL_RATIO`` -- stone diameter as a fraction of grid spacing.
  Smaller value -> larger gap between stones; ``1.0`` = stones tangent.

Dependencies: Pillow + numpy (``pip install pillow numpy``).
"""

import math
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageOps

SIZE = 512
HASH_LINE_INSET = 152
GRID_LINE_WIDTH = 3
GRID_LINE_RGBA = (0, 0, 0, 220)
WOOD_TEXTURE = "www/style/woodfloor.jpg"
WOOD_DARKEN = 0.18
STONE_FILL_RATIO = 0.76

ANDROID_DENSITIES = {
    "ldpi": 36,
    "mdpi": 48,
    "hdpi": 72,
    "xhdpi": 96,
    "xxhdpi": 144,
    "xxxhdpi": 192,
}


def make_stone(diameter: int, color: str) -> np.ndarray:
    """Render a single Go stone as an RGBA numpy array of shape (d, d, 4)."""
    d = diameter
    r = d / 2.0
    yy, xx = np.mgrid[0:d, 0:d].astype(np.float32)
    dx = xx - r + 0.5
    dy = yy - r + 0.5
    dist_center = np.sqrt(dx * dx + dy * dy)

    if color == "black":
        base = np.array([12, 12, 14], dtype=np.float32)
        highlight = np.array([120, 120, 124], dtype=np.float32)
        rim = np.array([0, 0, 0], dtype=np.float32)
    else:
        base = np.array([240, 232, 214], dtype=np.float32)
        highlight = np.array([255, 255, 255], dtype=np.float32)
        rim = np.array([192, 184, 168], dtype=np.float32)

    hx = r - r * 0.35
    hy = r - r * 0.35
    dist_hl = np.sqrt((xx - hx) ** 2 + (yy - hy) ** 2)
    hl_max = math.sqrt((d - hx) ** 2 + (d - hy) ** 2)
    t = np.clip(dist_hl / hl_max, 0.0, 1.0)
    t_curve = t ** 1.4
    rgb = (1.0 - t_curve)[..., None] * highlight + t_curve[..., None] * base

    rim_blend = np.clip(dist_center / r, 0.0, 1.0) ** 5
    rgb = (1.0 - rim_blend)[..., None] * rgb + rim_blend[..., None] * rim

    edge_softness = 1.2
    alpha = np.clip((r - dist_center) / edge_softness, 0.0, 1.0) * 255.0

    out = np.dstack([np.clip(rgb, 0, 255), alpha]).astype(np.uint8)
    return out


def make_shadow(diameter: int, canvas_size: tuple[int, int], origin: tuple[int, int]) -> Image.Image:
    """Soft drop shadow underneath a stone."""
    layer = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    ox, oy = origin
    pad = 10
    bbox = (ox - pad + 4, oy - pad + 8, ox + diameter + pad + 4, oy + diameter + pad + 8)
    draw.ellipse(bbox, fill=(0, 0, 0, 110))
    return layer.filter(ImageFilter.GaussianBlur(8))


def render_background() -> Image.Image:
    """Wood-floor texture cover-fitted to SIZE x SIZE, slightly darkened."""
    wood = Image.open(WOOD_TEXTURE).convert("RGB")
    bg = ImageOps.fit(wood, (SIZE, SIZE), method=Image.LANCZOS, centering=(0.5, 0.5))
    if WOOD_DARKEN > 0:
        bg = Image.blend(bg, Image.new("RGB", (SIZE, SIZE), (0, 0, 0)), WOOD_DARKEN)
    return bg.convert("RGBA")


def draw_hash(img: Image.Image) -> tuple[list[int], list[int]]:
    """Draw 2 horizontal + 2 vertical grid lines edge-to-edge of the canvas
    (the "#" pattern). Returns (xs, ys): the x/y coordinates of the lines,
    which are also the coordinates of the 4 intersections."""
    xs = [HASH_LINE_INSET, SIZE - HASH_LINE_INSET]
    ys = list(xs)

    grid_layer = Image.new("RGBA", img.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(grid_layer)
    for y in ys:
        draw.line([(0, y), (SIZE, y)], fill=GRID_LINE_RGBA, width=GRID_LINE_WIDTH)
    for x in xs:
        draw.line([(x, 0), (x, SIZE)], fill=GRID_LINE_RGBA, width=GRID_LINE_WIDTH)
    img.alpha_composite(grid_layer)
    return xs, ys


def render_master() -> Image.Image:
    img = render_background()
    xs, ys = draw_hash(img)

    spacing = xs[1] - xs[0]
    stone_d = int(spacing * STONE_FILL_RATIO)
    half = stone_d // 2

    centres = [
        (xs[0], ys[0], "black"),
        (xs[1], ys[0], "white"),
        (xs[0], ys[1], "white"),
        (xs[1], ys[1], "black"),
    ]

    for cx, cy, _ in centres:
        shadow = make_shadow(stone_d, img.size, (cx - half, cy - half))
        img.alpha_composite(shadow)

    for cx, cy, color in centres:
        stone_arr = make_stone(stone_d, color)
        stone_img = Image.fromarray(stone_arr, "RGBA")
        img.alpha_composite(stone_img, (cx - half, cy - half))

    return img


def main(out_dir: str) -> None:
    os.makedirs(out_dir, exist_ok=True)

    master = render_master()
    master_path = os.path.join(out_dir, "icon.png")
    master.save(master_path, "PNG", optimize=True)
    print(f"wrote {master_path} ({SIZE}x{SIZE} RGBA)")

    for name, sz in ANDROID_DENSITIES.items():
        resized = master.resize((sz, sz), Image.LANCZOS)
        path = os.path.join(out_dir, f"icon-{name}.png")
        resized.save(path, "PNG", optimize=True)
        print(f"wrote {path} ({sz}x{sz} RGBA)")


if __name__ == "__main__":
    out_dir = sys.argv[1] if len(sys.argv) > 1 else "www/images"
    main(out_dir)

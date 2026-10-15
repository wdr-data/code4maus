# /// script
# requires-python = ">=3.11"
# dependencies = ["pillow", "numpy"]
# ///
"""Generates img/background.png: horizontal streaks in three blues, clustered in bands.

Run with `uv run maintenance/make-background.py`. Shown scaled up with nearest-neighbour.
"""

from pathlib import Path

import numpy as np
from PIL import Image

WIDTH, HEIGHT = 160, 100
# Light, base and dark tone, taken from src/components/gui/bg_header@1x.png
PALETTE = ["#b8d5e9", "#aed0e5", "#a2c8e2"]
SEED = 7

rng = np.random.default_rng(SEED)
tones = np.ones((HEIGHT, WIDTH), dtype=np.uint8)
band = np.convolve(rng.normal(size=HEIGHT + 20), np.ones(9) / 9, mode="same")[10:-10]
band = (band - band.min()) / (band.max() - band.min())
for y in range(HEIGHT):
    for _ in range(int(2 + band[y] * 7)):
        length = int(rng.integers(6, 50))
        x = int(rng.integers(-length, WIDTH))
        # mostly dark streaks, some light ones
        tones[y, max(x, 0) : x + length] = 0 if rng.random() < 0.3 else 2

img = Image.fromarray(tones, mode="P")
rgb = [int(c[i : i + 2], 16) for c in PALETTE for i in (1, 3, 5)]
img.putpalette(rgb + [0] * (768 - len(rgb)))
img.save(Path(__file__).parent / "img" / "background.png", optimize=True, bits=2)

"""EXAMPLE (tuned on the Zack D Films "railgun" video, 2026-10-07): cover a LOGO PRINTED ON A SHADED SURFACE (here the grey
"ZACK D FILMS" on a silver rod, right of the word TUNGSTEN, which had to survive).
Auto-detecting the letters failed (the mask came back empty on the darker, motion-blurred frames), so the logo's box is tracked
BY HAND: look at gridded crops of every ~3rd frame, write the box (x0, x1, y0, y1) at each, and the script interpolates between.
Inside the box the surface is rebuilt from a robust polynomial fit to the non-letter pixels, so the panel's own light-to-dark
gradient continues across where the letters were, plus a little grain. If the logo runs off the frame edge, the box is flush to it.
usage: python3 fill_logo_on_surface.py <in_dir> <out_dir> <first_frame> <last_frame> <keys.json> [--width 720]
  keys.json = {"513": [700, 720, 612, 732], "515": [684, 720, 612, 734], ...}   (absolute frame number -> [x0, x1, y0, y1])
Frames are f%04d.png with ABSOLUTE frame numbers (from gop.py extract). Check the result frame by frame, especially at the edges.
"""
import sys, os, json
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

src, dst, f0, f1 = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
KEYS = {int(k): tuple(v) for k, v in json.load(open(sys.argv[5])).items()}
FRAME_W = int(sys.argv[sys.argv.index('--width') + 1]) if '--width' in sys.argv else 720
os.makedirs(dst, exist_ok=True)
rng = np.random.default_rng(9)
def box(f):
    ks = sorted(KEYS)
    if f < ks[0] or f > ks[-1]:
        return None
    lo = max(k for k in ks if k <= f); hi = min(k for k in ks if k >= f)
    if lo == hi:
        return KEYS[lo]
    u = (f - lo) / (hi - lo)
    return tuple(int(round(a + (b - a) * u)) for a, b in zip(KEYS[lo], KEYS[hi]))


for f in range(f0, f1 + 1):
    im = np.asarray(Image.open(f'{src}/f{f:04d}.png').convert('RGB')).astype(float)
    b = box(f)
    if b:
        x0, x1, y0, y1 = b
        P = 24                                                    # horizontal padding so the closing sees panel on both sides
        X0, X1 = max(0, x0 - P), min(FRAME_W, x1 + P)
        reg = im[y0:y1, X0:X1]
        close = np.stack([ndi.grey_closing(reg[..., c], size=(31, 31)) for c in range(3)], -1)
        d = close.mean(-1) - reg.mean(-1)
        text = d > np.maximum(5, 0.1 * close.mean(-1))            # strokes (incl. their motion-blurred edges)
        text = ndi.binary_dilation(ndi.binary_opening(text, structure=np.ones((2, 2))), iterations=4)
        # panel = smooth polynomial shading fitted to the NON-letter pixels (robust: refit after dropping outliers),
        # so it continues the panel's gradient even where the logo runs off the frame edge
        hh, ww = text.shape
        yy, xx = np.mgrid[0:hh, 0:ww]; yn, xn = yy / hh - 0.5, xx / ww - 0.5
        A = np.stack([np.ones_like(xn), xn, xn ** 2, yn, yn ** 2, yn ** 3, xn * yn], -1).reshape(-1, 7)
        ok = (~text).reshape(-1)
        surf = np.empty_like(reg)
        for c in range(3):
            v = reg[..., c].reshape(-1); sel = ok.copy()
            for _ in range(3):
                coef, *_ = np.linalg.lstsq(A[sel], v[sel], rcond=None)
                res = v - A @ coef; sd = res[sel].std() + 1e-3
                sel = ok & (np.abs(res) < 2.0 * sd)
            surf[..., c] = (A @ coef).reshape(hh, ww)
        # replace the whole logo box (feathered), plus any letter pixels that poke past it
        bx = np.zeros(text.shape); bx[3:-3, max(0, x0 - X0 + 3): (ww if x1 >= FRAME_W - 4 else x1 - X0 - 3)] = 1   # flush to the frame edge when the logo runs off it
        a = np.maximum(ndi.gaussian_filter(bx, 4, mode='nearest'), np.clip(ndi.gaussian_filter((text & (bx > 0)).astype(float), 1.5) * 1.5, 0, 1))
        a = np.clip(a * 1.15, 0, 1)
        fill = surf + rng.normal(0, 1.4, surf.shape)
        im[y0:y1, X0:X1] = reg * (1 - a[..., None]) + fill * a[..., None]
    Image.fromarray(np.clip(im + 0.5, 0, 255).astype(np.uint8)).save(f'{dst}/f{f:04d}.png')

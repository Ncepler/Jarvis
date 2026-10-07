"""EXAMPLE (tuned on the Zack D Films "railgun" video, 2026-10-07): cover a drifting TITLE floating over deep space.
Keys the title by its blue colour, replaces it with the surrounding dark background plus a streaming star field, protects the
bright teal rings (they must never be painted over), blends the top edge while the title is still sliding in, and covers the
olive chromatic-aberration copy that sits down-right of the letters. Re-tune before reusing on another video:
  * key_mask(): the colour rule is for BLUE text on near-black; change it for other colours.
  * --window / --ymax: when the title is on screen and the lowest line it can reach.   * --star-origin: where stars stream from.
  * ring_mask(): whatever bright thing in the scene must survive.   Always look at a contact sheet of every changed frame.
usage: python3 key_title_to_space.py <in_dir> <out_dir> <first_frame> <last_frame> [--fps 24 --window 5.0 8.75 --ymax 470
                                                             --star-origin 360 700 --top-blend-until 6.4]
Frames are f%04d.png with ABSOLUTE frame numbers (from gop.py extract). Parallelise by running several frame ranges at once.
"""
import sys, os, argparse
import numpy as np
from PIL import Image
from scipy import ndimage as ndi

ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('dst'); ap.add_argument('f0', type=int); ap.add_argument('f1', type=int)
ap.add_argument('--fps', type=float, default=24); ap.add_argument('--window', type=float, nargs=2, default=[5.0, 8.75])
ap.add_argument('--ymax', type=int, default=470); ap.add_argument('--star-origin', type=int, nargs=2, default=[360, 700])
ap.add_argument('--top-blend-until', type=float, default=6.4)
A = ap.parse_args()
src, dst, f0, f1, FPS = A.src, A.dst, A.f0, A.f1, A.fps
os.makedirs(dst, exist_ok=True)
T0, T1 = A.window
YMAX = A.ymax
CX, CY = A.star_origin
TOP_BLEND = A.top_blend_until
rng = np.random.default_rng(3)
NS = 900
STAR = dict(a=rng.uniform(0, 2 * np.pi, NS), d0=rng.uniform(0, 1, NS), sp=rng.uniform(0.25, 0.6, NS),
            b=rng.uniform(55, 150, NS), tint=rng.integers(0, 3, NS))
TINTS = np.array([[1.0, 1.0, 1.0], [1.0, 0.85, 0.6], [0.7, 0.85, 1.0]])


def key_mask(im):
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    m = (b >= 30) & (b > 1.15 * g) & (b - r > 22)
    m[YMAX:] = False
    m = ndi.binary_opening(m, structure=np.ones((3, 3)))          # drop blue star fringes
    m = ndi.binary_closing(m, structure=np.ones((7, 7)))          # fill the letters
    lab, n = ndi.label(m)                                        # keep only big blobs (letters), not specks
    if n:
        sizes = ndi.sum(m, lab, range(1, n + 1))
        band = np.zeros(m.shape); band[:6] = 1
        top = ndi.maximum(band, lab, range(1, n + 1))
        m = np.isin(lab, 1 + np.flatnonzero((sizes >= 120) | ((sizes >= 12) & (np.asarray(top) > 0))))  # letters sliding in at the top edge
    m = m | (ndi.shift(m.astype(float), (5, 6), order=0) > 0.5)   # the olive chromatic-aberration copy sits down-right
    return ndi.binary_dilation(m, iterations=11)                 # cover the soft glow around the letters


def ring_mask(im):
    r, g, b = im[..., 0], im[..., 1], im[..., 2]
    return ndi.binary_dilation((g >= 0.92 * b) & (g > 70) & (g > r + 30), iterations=2)


def stars(t, shape):
    H, W = shape
    layer = np.zeros((H, W, 3))
    d = (STAR['d0'] + t * STAR['sp']) % 1.0
    rr = d * 900
    for k in np.flatnonzero(rr > 30):
        ux, uy = np.cos(STAR['a'][k]), np.sin(STAR['a'][k])
        L = 2 + d[k] * 9                                         # short radial streaks like the scene's
        for s in np.linspace(0, L, int(L) + 1):
            x = int(CX + ux * (rr[k] + s)); y = int(CY + uy * (rr[k] + s))
            if 0 <= x < W and 0 <= y < YMAX + 40:
                layer[y, x] = np.maximum(layer[y, x], STAR['b'][k] * TINTS[STAR['tint'][k]] * (0.6 + 0.4 * s / L))
    return ndi.gaussian_filter(layer, sigma=(0.6, 0.6, 0))


for f in range(f0, f1 + 1):
    t = f / FPS
    im = np.asarray(Image.open(f'{src}/f{f:04d}.png').convert('RGB')).astype(float)
    if T0 <= t < T1:
        m = key_mask(im)
        if m.any() or t < TOP_BLEND:
            keep = ~ndi.binary_dilation(m, iterations=4)
            # background estimate: blur of the frame with the title excluded (normalized convolution)
            w = ndi.gaussian_filter(keep.astype(float), 22)
            bg = np.stack([ndi.gaussian_filter(im[..., c] * keep, 22) for c in range(3)], -1) / np.maximum(w, 1e-3)[..., None]
            bg = np.minimum(bg, np.array([6, 14, 26]))           # keep it deep space, never a blue smear
            fill = np.clip(bg + stars(t, m.shape), 0, 255)
            a = np.clip(ndi.gaussian_filter(m.astype(float), 4.0) * 1.25, 0, 1)
            if t < TOP_BLEND:                                          # title slides in from the top: blend the top edge into space too
                ramp = np.clip((14 - np.arange(a.shape[0])) / 8, 0, 1)[:, None]
                a = np.maximum(a, ramp)
            a[ring_mask(im)] = 0                                 # never paint over the teal gravity rings
            im = im * (1 - a[..., None]) + fill * a[..., None]
    Image.fromarray(np.clip(im + 0.5, 0, 255).astype(np.uint8)).save(f'{dst}/f{f:04d}.png')

"""erase_letters.py <in_dir> <out_dir> <f0> <f1> <keys.json>
Erase printed letters (light-on-dark or dark-on-light) inside a hand-tracked rotated box.
keys.json: {"frame": [cx, cy, w, h, angle_deg, open_px, close_px], ...}; linear interpolation between keys.
Inside the box: grey opening (kills bright strokes < open_px) then closing (kills dark strokes < close_px), then the letter
area (inner 80% x 70%) is blurred to kill remnants, grain added, feathered in. The video's own burned-in caption (pure-white
text + its dark edge) is protected and never modified."""
import sys, os, json, numpy as np
from PIL import Image
from scipy import ndimage as ndi
src, dst, f0, f1 = sys.argv[1], sys.argv[2], int(sys.argv[3]), int(sys.argv[4])
K = {int(k): v for k, v in json.load(open(sys.argv[5])).items()}; ks = sorted(K)
os.makedirs(dst, exist_ok=True); rng = np.random.default_rng(3)
def key(f):
    if f < ks[0] or f > ks[-1]: return None
    lo = max(k for k in ks if k <= f); hi = min(k for k in ks if k >= f)
    if lo == hi: return K[lo]
    u = (f - lo) / (hi - lo); return [a + (b - a) * u for a, b in zip(K[lo], K[hi])]
for f in range(f0, f1 + 1):
    im = np.asarray(Image.open(f'{src}/f{f:04d}.png').convert('RGB')).astype(float)
    k = key(f)
    if k:
        cx, cy, w, h, ang, so, sc = k; H, W = im.shape[:2]
        R = int(max(w, h) / 2 + 30); x0, x1, y0, y1 = max(0, int(cx - R)), min(W, int(cx + R)), max(0, int(cy - R)), min(H, int(cy + R))
        reg = im[y0:y1, x0:x1]
        yy, xx = np.mgrid[y0:y1, x0:x1]; a = np.deg2rad(ang)
        u = (xx - cx) * np.cos(a) + (yy - cy) * np.sin(a); v = -(xx - cx) * np.sin(a) + (yy - cy) * np.cos(a)
        box = ((np.abs(u) <= w / 2) & (np.abs(v) <= h / 2)).astype(float)
        inner = ((np.abs(u) <= w * 0.42) & (np.abs(v) <= h * 0.36)).astype(float)
        so, sc = max(3, int(round(so))), max(1, int(round(sc)))
        g = np.stack([ndi.grey_opening(reg[..., c], size=(so, so)) for c in range(3)], -1)
        if sc > 1: g = np.stack([ndi.grey_closing(g[..., c], size=(sc, sc)) for c in range(3)], -1)
        g = np.stack([ndi.gaussian_filter(g[..., c], 1.2) for c in range(3)], -1)
        gb = np.stack([ndi.gaussian_filter(g[..., c], max(2.0, h / 7)) for c in range(3)], -1)
        mi = np.clip(ndi.gaussian_filter(inner, 2.0), 0, 1)[..., None]
        fill = g * (1 - mi) + gb * mi + rng.normal(0, 1.3, g.shape)
        m = np.clip(ndi.gaussian_filter(box, 2.5), 0, 1)
        # protect the burned-in caption: pure white text plus its dark outline
        cap = (reg.min(2) > 228)
        cap = ndi.binary_dilation(cap, iterations=4) & (yy > 900) & (yy < 1060)
        m = m * (1 - np.clip(ndi.gaussian_filter(cap.astype(float), 1.0) * 2, 0, 1))
        im[y0:y1, x0:x1] = reg * (1 - m[..., None]) + fill * m[..., None]
    Image.fromarray(np.clip(im + 0.5, 0, 255).astype(np.uint8)).save(f'{dst}/f{f:04d}.png')

# compare.py <orig_dir> <new_dir> <keys.json> <f0> <f1> <out> [cw ch scale cols]  -> before|after crops around the tracked box
import sys, json
from PIL import Image, ImageDraw
o, n, kf, f0, f1, out = sys.argv[1], sys.argv[2], sys.argv[3], int(sys.argv[4]), int(sys.argv[5]), sys.argv[6]
cw, ch, sc, cols = (int(sys.argv[7]), int(sys.argv[8]), float(sys.argv[9]), int(sys.argv[10])) if len(sys.argv) > 7 else (240, 110, 1.0, 4)
K = {int(k): v for k, v in json.load(open(kf)).items()}; ks = sorted(K)
def key(f):
    lo = max([k for k in ks if k <= f], default=ks[0]); hi = min([k for k in ks if k >= f], default=ks[-1])
    if lo == hi: return K[lo]
    u = (f - lo) / (hi - lo); return [a + (b - a) * u for a, b in zip(K[lo], K[hi])]
tiles = []
for f in range(f0, f1 + 1):
    cx, cy = key(f)[:2]; b = (int(cx - cw / 2), int(cy - ch / 2), int(cx + cw / 2), int(cy + ch / 2))
    A = Image.open(f'{o}/f{f:04d}.png').convert('RGB').crop(b); B = Image.open(f'{n}/f{f:04d}.png').convert('RGB').crop(b)
    t = Image.new('RGB', (cw * 2 + 4, ch)); t.paste(A, (0, 0)); t.paste(B, (cw + 4, 0))
    t = t.resize((int(t.width * sc), int(t.height * sc))); ImageDraw.Draw(t).text((3, 2), f'f{f}', fill=(255, 255, 0)); tiles.append(t)
W, H = tiles[0].size; rows = (len(tiles) + cols - 1) // cols
S = Image.new('RGB', (W * cols + (cols - 1) * 6, H * rows + (rows - 1) * 6), (255, 0, 255))
for i, t in enumerate(tiles): S.paste(t, ((i % cols) * (W + 6), (i // cols) * (H + 6)))
S.save(out)

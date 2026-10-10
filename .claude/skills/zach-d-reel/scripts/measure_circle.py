#!/usr/bin/env python3
"""Measure the round shape for an IRIS transition on part 1's last frame (in/last.png). Writes DEBUG.png with the circle drawn: LOOK at it.
  python3 -I measure_circle.py in/last.png [--hint cx cy r]     (hint = normalised, from find_transitions.py's candidates.json; optional)
Strategy: (1) segment the most saturated / most different-coloured blob near the middle and take its minimum enclosing circle (works for holes, eyes, coins, lights);
(2) else Hough circle near the hint. Prints "cx cy r" normalised to the frame width/height (r relative to WIDTH) ready for cfg.transition.circle.
Caption text near the bottom is ignored. If the debug circle is visibly off, set the numbers by hand: the iris only needs to be roughly right."""
import sys, cv2, numpy as np
img = cv2.imread(sys.argv[1]); H, W = img.shape[:2]
hint = None
if '--hint' in sys.argv: i = sys.argv.index('--hint'); hint = tuple(float(v) for v in sys.argv[i + 1:i + 4])
hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV); sat = hsv[..., 1].astype(float); val = hsv[..., 2].astype(float)
hue = hsv[..., 0].astype(float); bg = np.median(hue)                                   # the scene's dominant hue (water blue, foliage green...)
dh = np.minimum(np.abs(hue - bg), 180 - np.abs(hue - bg)) / 90.0                      # how far each pixel's hue is from the scene's
score = sat * (0.25 + dh) * (val > 40)                                                  # saturated AND a different colour: a hole, eye, coin, light
score[int(H * 0.80):] = 0
best = None
for pct in (95, 92, 88, 84, 78, 70):                 # strictest threshold first: the TIGHTEST blob that is still round and big enough wins
    thr = np.percentile(score, pct)
    m = (score >= thr).astype(np.uint8); m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8)); m = cv2.morphologyEx(m, cv2.MORPH_OPEN, np.ones((7, 7), np.uint8))
    n, lab, st, cen = cv2.connectedComponentsWithStats(m); cand = None
    for k in range(1, n):
        a = st[k, cv2.CC_STAT_AREA]
        if a < 0.012 * W * H or a > 0.5 * W * H: continue
        cnt = cv2.findContours((lab == k).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)[0][0]
        (cx, cy), r = cv2.minEnclosingCircle(cnt); fill = a / (np.pi * r * r + 1e-9)
        d_mid = np.hypot(cx / W - 0.5, cy / H - 0.5)
        sc = fill - 0.8 * d_mid - (0.5 * np.hypot(cx / W - hint[0], cy / H - hint[1]) if hint else 0)
        if fill >= 0.65 and (cand is None or sc > cand[0]): cand = (sc, cx, cy, r, fill)
    if cand: best = cand; break
if best is None or best[4] < 0.55:
    g = cv2.GaussianBlur(cv2.cvtColor(img, cv2.COLOR_BGR2GRAY), (7, 7), 2)
    c = cv2.HoughCircles(g, cv2.HOUGH_GRADIENT, 1.2, W // 2, param1=110, param2=28, minRadius=int(W * 0.08), maxRadius=int(W * 0.45))
    if c is not None: cx, cy, r = c[0][0]; best = (0, cx, cy, r, 0.0)
if best is None: sys.exit('no round shape found: choose this transition type by eye (zoom or doors work without one)')
_, cx, cy, r, fill = best
dbg = img.copy(); cv2.circle(dbg, (int(cx), int(cy)), int(r), (0, 255, 255), 4); cv2.imwrite('DEBUG.png', dbg)
print(f'"circle": {{"cx": {cx / W:.3f}, "cy": {cy / H:.3f}, "r": {r / W:.3f}}}   (fill {fill:.2f}; look at DEBUG.png)')

#!/usr/bin/env python3
"""Find the best places to CUT a story video into a Vilas ending, and say which transition each place supports.

This is the "does this video even have a good transition?" check. Run it on every candidate BEFORE picking it, and again on the picked video to choose
the cut. It looks for the things a transition can grab (see references/transitions.md): a round shape to iris through, a dark/bright focal point to
zoom into, fast sideways blur to whip out of, a calm frame that survives being held, and, most important, a place where the narrator has finished a sentence.
It also scores how early the Vilas hook would land (viewers leave: the hook should be on screen by ~20 s).

  python3 -I find_transitions.py VIDEO --out DIR [--max-t 24] [--top 8] [--min-t 6]

Writes DIR/candidates.json and DIR/candidates.png (a labelled contact sheet of the top candidates, with the detected circle drawn). LOOK AT THE SHEET:
these are heuristics, you are the judge of "has the story paid off by here?" and "is that really a round hole?". Prints a ranked table.
Known weakness (measured): classical circle detection cannot tell a hole from a round blob (a sloth's nose scores like the whale's bite hole). It GENERATES candidates;
the contact sheet (detected circle drawn in yellow) is where a human-level eye decides. A real iris transition needs a clearly closed rim you could draw with a compass.

Scores (0..1):  gap = narrator sentence boundary at the cut  |  circle = a clean round shape (hole, eye, coin, porthole, lens)  |  focal = dark or bright centre
(tunnel, pupil, light)  |  whip = horizontal motion blur  |  calm = little motion (a held frame looks natural)  |  hook = earliness (<=14 s 1.0, <=20 s .8, <=24 s .5)
            payoff = the story has delivered its value (0 under 25% of the video, 1 from 60%).   total = .60 transition + .20 hook + .20 payoff
"""
import argparse, json, os, subprocess, sys
import numpy as np, cv2

ap = argparse.ArgumentParser()
ap.add_argument('video'); ap.add_argument('--out', required=True)
ap.add_argument('--max-t', type=float, default=24.0, help='latest cut time to consider (the Vilas hook should land by ~20-24 s)')
ap.add_argument('--min-t', type=float, default=6.0, help='earliest cut time (the story must have paid off a little)')
ap.add_argument('--top', type=int, default=8)
a = ap.parse_args()
os.makedirs(a.out, exist_ok=True)

def run(cmd): return subprocess.run(cmd, capture_output=True)
dur = float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', a.video]).stdout)
FPS = 5; GW, GH = 180, 320
# ---- frames at 5 fps (small, color) -------------------------------------------------------------------------------------------------------------
raw = run(['ffmpeg', '-v', 'error', '-i', a.video, '-vf', f'fps={FPS},scale={GW}:{GH}', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-']).stdout
frames = np.frombuffer(raw, np.uint8).reshape(-1, GH, GW, 3)
n = len(frames); gray = np.array([cv2.cvtColor(f, cv2.COLOR_BGR2GRAY) for f in frames])
# ---- narrator sentence boundaries from the audio envelope --------------------------------------------------------------------------------------
SR = 16000
pcm = np.frombuffer(run(['ffmpeg', '-v', 'error', '-i', a.video, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-']).stdout, np.int16).astype(float) / 32768
W = 320; m = len(pcm) // W
rms = np.sqrt((pcm[:m * W].reshape(m, W) ** 2).mean(1))   # 20 ms
speech = rms > max(0.02, 0.25 * np.percentile(rms[rms > 0.01], 60)) if (rms > 0.01).any() else np.zeros(m, bool)
gaps = []   # (start_s, end_s) of silent runs that follow >=0.3 s of speech and last >= 0.12 s
i = 0
while i < m:
    if not speech[i]:
        j = i
        while j < m and not speech[j]: j += 1
        before = speech[max(0, i - 15):i].sum()   # speech in the 0.3 s before
        if before >= 8 and (j - i) * 0.02 >= 0.12: gaps.append((i * 0.02, j * 0.02))
        i = j
    else: i += 1
def gap_score(t):
    best = 0.0
    for s, e in gaps:
        if s - 0.1 <= t <= e + 0.1:
            best = max(best, 1.0 if (e - s) >= 0.25 else 0.6)
    return best
def gap_at(t):
    for s, e in gaps:
        if s - 0.1 <= t <= e + 0.1: return (s, e)
    return None

# ---- per-frame features ----------------------------------------------------------------------------------------------------------------------
def features(i):
    g = gray[i]; col = frames[i]
    gb = cv2.GaussianBlur(g, (5, 5), 1.5)
    # circle: Hough on the blurred frame, big round shapes near the middle. A candidate only counts if its rim is a REAL continuous edge:
    # sample 72 points on the circle and require most of them to sit on a strong edge (a nose or a tree trunk has a round blob but no closed rim).
    gx0 = cv2.Sobel(gb, cv2.CV_32F, 1, 0); gy0 = cv2.Sobel(gb, cv2.CV_32F, 0, 1); mag0 = cv2.magnitude(gx0, gy0)
    best = (0.0, None)
    for p2 in (38, 30, 24):
        c = cv2.HoughCircles(gb, cv2.HOUGH_GRADIENT, dp=1.2, minDist=GW // 2, param1=110, param2=p2, minRadius=int(GW * 0.10), maxRadius=int(GW * 0.46))
        if c is not None:
            for cx, cy, r in c[0][:4]:
                if not (0.2 * GW < cx < 0.8 * GW and 0.2 * GH < cy < 0.8 * GH): continue
                ang = np.linspace(0, 2 * np.pi, 72, endpoint=False); hit = 0; tot = 0
                for t_ in ang:
                    best_m = 0.0
                    for dr in (-2, -1, 0, 1, 2):
                        x_, y_ = int(round(cx + (r + dr) * np.cos(t_))), int(round(cy + (r + dr) * np.sin(t_)))
                        if 0 <= x_ < GW and 0 <= y_ < GH: best_m = max(best_m, float(mag0[y_, x_]))
                        else: best_m = max(best_m, 999.0)      # a rim leaving the frame is not penalised
                    tot += 1; hit += best_m > 60
                support = hit / tot
                mask = np.zeros_like(g); cv2.circle(mask, (int(cx), int(cy)), int(r * 0.8), 255, -1)
                ring = np.zeros_like(g); cv2.circle(ring, (int(cx), int(cy)), int(r * 1.25), 255, -1); cv2.circle(ring, (int(cx), int(cy)), int(r * 1.05), 0, -1)
                contrast = abs(float(g[mask > 0].mean()) - float(g[ring > 0].mean())) / 255 if ring.any() and mask.any() else 0
                sc = min(1.0, (p2 / 38) * 0.55 + contrast * 2.2) * (0.6 + 0.4 * min(1.0, support / 0.7))   # Hough strength + inside/ring contrast, mildly weighted by rim support
                if sc > best[0]: best = (sc, (float(cx) / GW, float(cy) / GH, float(r) / GW))
        if best[0] > 0.8: break
    # focal: centre much darker/brighter than the borders (tunnel, pupil, light)
    cen = g[int(GH * 0.35):int(GH * 0.65), int(GW * 0.3):int(GW * 0.7)].mean()
    bor = np.concatenate([g[:GH // 6].ravel(), g[-GH // 6:].ravel(), g[:, :GW // 6].ravel(), g[:, -GW // 6:].ravel()]).mean()
    focal = min(1.0, abs(float(cen) - float(bor)) / 90)
    gx = cv2.Sobel(gb, cv2.CV_32F, 1, 0); gy = cv2.Sobel(gb, cv2.CV_32F, 0, 1)
    ex, ey = float(np.abs(gx).mean()), float(np.abs(gy).mean())
    prev = gray[max(0, i - 1)].astype(float); nxt = gray[min(n - 1, i + 1)].astype(float)
    motion = float(np.abs(gray[i].astype(float) - prev).mean() + np.abs(nxt - gray[i].astype(float)).mean()) / 2
    whip = min(1.0, max(0.0, (1.0 - ex / (ey + 1e-6)) * 1.6)) * min(1.0, motion / 14) if ey > 0.5 else 0.0
    return dict(circle=round(best[0], 2), circle_xyr=best[1], focal=round(focal, 2), whip=round(float(whip), 2), calm=round(float(max(0.0, 1.0 - motion / 16)), 2),
                luma=round(float(g.mean()), 1), texture=round(float(min(1.0, (ex + ey) / 60)), 2))
hook = lambda t: 1.0 if t <= 14 else 0.8 if t <= 20 else 0.5 if t <= 24 else 0.2
payoff = lambda t: max(0.0, min(1.0, (t / dur - 0.25) / 0.35))   # the viewer must have got the story's value first: 0 below 25% of the video, 1 from 60%

FEAT = [features(i) for i in range(n)]
for i in range(n):          # a round shape persists across frames: take the best circle within +-0.4 s (Hough flickers frame to frame)
    win = range(max(0, i - 2), min(n, i + 3)); j = max(win, key=lambda k: FEAT[k]['circle'])
    FEAT[i]['circle'], FEAT[i]['circle_xyr'] = FEAT[j]['circle'], FEAT[j]['circle_xyr']
cands = []
for i in range(n):
    t = i / FPS
    if t < a.min_t or t > min(a.max_t, dur - 0.5): continue
    f = FEAT[i]; gs = gap_score(t)
    # best transition for this frame. Boundary (a finished sentence) is mandatory in spirit: without it, cap the score.
    s = {
        'iris':    0.55 * f['circle'] + 0.30 * gs + 0.15 * f['calm'] if f['circle'] >= 0.45 else 0.0,
        'zoom':    0.35 * f['focal'] + 0.15 * f['texture'] + 0.30 * gs + 0.20 * f['calm'],
        'whip':    0.50 * f['whip'] + 0.35 * gs + 0.15 * f['calm'] if f['whip'] >= 0.25 else 0.0,
        'shatter': 0.40 * gs + 0.35 * f['calm'] + 0.25 * min(1.0, f['texture'] + 0.2),
        'doors':   0.50 * gs + 0.35 * f['calm'] + 0.15,
        'glitch':  0.45 * gs + 0.25 * f['calm'] + 0.30 * (1.0 if f['luma'] < 60 or f['luma'] > 190 else 0.3),
    }
    kind = max(s, key=s.get); sc = s[kind]
    cands.append(dict(t=round(t, 2), kind=kind, transition_score=round(sc, 3), hook=hook(t), payoff=round(payoff(t), 2), total=round(0.60 * sc + 0.20 * hook(t) + 0.20 * payoff(t), 3), boundary=gs,
                      gap=gap_at(t), alt={k: round(v, 2) for k, v in sorted(s.items(), key=lambda kv: -kv[1])[:3]}, **f))
# keep the best per 1.5 s window, then the top N
cands.sort(key=lambda c: -c['total']); keep = []
for c in cands:
    if all(abs(c['t'] - k['t']) >= 1.5 for k in keep): keep.append(c)
    if len(keep) >= a.top: break
keep.sort(key=lambda c: -c['total'])
json.dump(dict(video=a.video, duration=round(dur, 2), gaps=[(round(s, 2), round(e, 2)) for s, e in gaps][:60], candidates=keep), open(os.path.join(a.out, 'candidates.json'), 'w'), indent=1)

# ---- contact sheet ----------------------------------------------------------------------------------------------------------------------------
tiles = []
for c in keep:
    img = run(['ffmpeg', '-v', 'error', '-ss', f"{c['t']:.2f}", '-i', a.video, '-frames:v', '1', '-vf', 'scale=270:480', '-f', 'rawvideo', '-pix_fmt', 'bgr24', '-']).stdout
    if len(img) != 270 * 480 * 3: continue
    im = np.frombuffer(img, np.uint8).reshape(480, 270, 3).copy()
    if c['circle_xyr'] and c['kind'] == 'iris':
        cx, cy, r = c['circle_xyr']; cv2.circle(im, (int(cx * 270), int(cy * 480)), int(r * 270), (0, 255, 255), 2)
    cv2.rectangle(im, (0, 0), (270, 34), (0, 0, 0), -1)
    cv2.putText(im, f"{c['t']:.1f}s {c['kind']} {c['total']:.2f}", (4, 14), cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1)
    cv2.putText(im, f"gap {c['boundary']:.1f} circ {c['circle']:.2f} foc {c['focal']:.2f} calm {c['calm']:.2f}", (4, 28), cv2.FONT_HERSHEY_SIMPLEX, 0.36, (180, 255, 180), 1)
    tiles.append(im)
if tiles:
    cols = min(4, len(tiles)); rows = (len(tiles) + cols - 1) // cols
    sheet = np.zeros((rows * 480, cols * 270, 3), np.uint8)
    for k, im in enumerate(tiles): sheet[(k // cols) * 480:(k // cols + 1) * 480, (k % cols) * 270:(k % cols + 1) * 270] = im
    cv2.imwrite(os.path.join(a.out, 'candidates.png'), sheet)
print(f"{os.path.basename(a.video)}  duration {dur:.1f}s  narrator sentence gaps found: {len(gaps)}")
print(f"{'cut t':>6} {'kind':8} {'total':>5} {'trans':>5} {'hook':>4} {'pay':>4} {'gap':>3} {'circle':>6} {'focal':>5} {'whip':>4} {'calm':>4}")
for c in keep: print(f"{c['t']:6.1f} {c['kind']:8} {c['total']:5.2f} {c['transition_score']:5.2f} {c['hook']:4.1f} {c['payoff']:4.1f} {c['boundary']:3.1f} {c['circle']:6.2f} {c['focal']:5.2f} {c['whip']:4.2f} {c['calm']:4.2f}")
print('contact sheet:', os.path.join(a.out, 'candidates.png'))
best = keep[0] if keep else None
if not best or best['total'] < 0.45:
    print('VERDICT: weak. No strong transition point before %.0f s: pick a different video, or accept the universal fallback (doors/glitch) and say so.' % a.max_t)
else:
    print(f"VERDICT: best cut {best['t']:.1f}s -> {best['kind']} (score {best['total']:.2f}). Verify on the sheet that the story has paid off by then.")

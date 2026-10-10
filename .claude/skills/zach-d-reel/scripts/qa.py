#!/usr/bin/env python3
"""Final-cut gate for a zach-d-reel. Run it on EVERY final.mp4 before delivering. Prints PASS/FAIL per check and exits 1 on any FAIL.
You cannot hear the video; these are the checks that stand in for ears. Each one exists because a real reel failed it.

usage: python3 -I qa.py final.mp4 --cut SEC [--narrator A B] [--voice-file voice.wav | --voice A B] [--max-part2 SEC] [--no-voice]
  --cut SEC      the second where part 2 begins (the hard cut). Word swap: the audio-cut time. Append: the original's duration.
  --narrator A B window (seconds) of the ORIGINAL narrator talking (default 1 .. min(cut-1, 28))
  --voice-file F the ISOLATED voice take (the voice.wav that audio.py mixes). Preferred: pitch cannot be judged under music.
  --voice A B    window of the final where part 2's voice speaks ALONE (no music under it), e.g. a TTS line. Omit when part 2 has no voice.
  --no-voice     part 2 must contain no voice at all (asserts you did not ship a TTS by accident); checks nothing else extra.

Checks
  hard_cut    the picture changes completely across the cut (mean abs diff of 90x160 gray frames >= 25 of 255; railgun 42, vehicle 101, sloth continuing = 4). A smaller jump means part 2
              starts by continuing the original's footage (caption band over it, freeze, dissolve) and the cut is not a cut.        [sloth: FAIL]
  audio_hit   the cut is HEARD as a hit: in the 30-80 Hz band (boom/kick; speech has none) the loudest 120 ms in the first second after
              the cut is >= -26 dBFS and >= 4 dB over the loudest 120 ms of the 1.5 s before it. (Not plain loudness: every reel is
              mastered to the same LUFS.) Orb opening: frame 0; word-swap reels: the first impact, 0.3-0.7 s in.   [railgun +12 dB, vehicle +6 dB, sloth -7 dB]
  dead_air    part 2 never goes digitally silent (< -60 dBFS) for more than 0.30 s, and its last 1.0 s is alive (> -40 dBFS).      [sloth: FAIL]
  loudness    part 2 integrated loudness within 3 LU of the original's.
  length      part 2 <= --max-part2 (default 15 s) and <= 40% of the whole video (Noah's own number overrides: pass it).
  voice       (only with --voice) median pitch within 30% of the narrator's AND pitch spread (std) >= 50% of the narrator's. A flat
              monotone voice is a robot voice.                                                                                     [sloth: FAIL]
"""
import argparse, re, subprocess, sys
import numpy as np
from scipy.signal import butter, sosfilt

ap = argparse.ArgumentParser()
ap.add_argument('video'); ap.add_argument('--cut', type=float, required=True)
ap.add_argument('--narrator', type=float, nargs=2); ap.add_argument('--voice', type=float, nargs=2); ap.add_argument('--voice-file')
ap.add_argument('--max-part2', type=float, default=15.0); ap.add_argument('--no-voice', action='store_true')
a = ap.parse_args()
V, CUT = a.video, a.cut
SR = 16000
res = []
def rec(name, ok, msg): res.append(ok); print(('PASS' if ok else 'FAIL'), f'{name:10s}', msg)

def sh(cmd): return subprocess.run(cmd, capture_output=True)
dur = float(sh(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', V]).stdout)
fps_s = sh(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=r_frame_rate', '-of', 'csv=p=0', V]).stdout.decode().strip()
fps = eval(fps_s) if '/' in fps_s else float(fps_s)
pcm = np.frombuffer(sh(['ffmpeg', '-v', 'error', '-i', V, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-']).stdout, np.int16).astype(float) / 32768
def db(x): return 20 * np.log10(np.sqrt((x ** 2).mean()) + 1e-9)
def seg(t0, t1): return pcm[max(0, int(t0 * SR)):int(t1 * SR)]

def gray(t):
    d = sh(['ffmpeg', '-v', 'error', '-ss', f'{max(0, t):.4f}', '-i', V, '-frames:v', '1', '-vf', 'scale=90:160,format=gray', '-f', 'rawvideo', '-'])
    return np.frombuffer(d.stdout, np.uint8).astype(float)

# hard_cut: last frame before the cut vs first frame at the cut
fa, fb = gray(CUT - 1.5 / fps), gray(CUT + 0.5 / fps)
d = np.abs(fa - fb).mean() if len(fa) == len(fb) and len(fa) else 0
rec('hard_cut', d >= 25, f'frame jump across the cut = {d:.0f}/255 (need >= 25). '
    + ('' if d >= 25 else 'Part 2 does not start on a whole new screen: it continues the original\'s footage. Cut to the template\'s screen on frame 0.'))

# audio_hit: sub-bass thump (30-80 Hz) right after the cut
sub = sosfilt(butter(4, [30, 80], 'bandpass', fs=SR, output='sos'), pcm)
def sdb(t0, t1): return db(sub[max(0, int(t0 * SR)):int(t1 * SR)])
pre = max(sdb(CUT - 1.5 + 0.12 * k, CUT - 1.5 + 0.12 * (k + 1)) for k in range(12))
posts = [sdb(CUT + 0.02 * k, CUT + 0.02 * k + 0.12) for k in range(44)]
post = max(posts); at = CUT + 0.02 * int(np.argmax(posts))
ok = post >= -26 and post - pre >= 4
rec('audio_hit', ok, f'30-80 Hz thump after the cut = {post:.1f} dBFS (at +{at - CUT:.2f}s), {post - pre:+.1f} dB vs before (need >= -26 dBFS and +4 dB). '
    + ('' if ok else 'The cut is not a hit: put the thump on the first frame (opening:"orb" does) or an impact within 0.7 s.'))

# dead_air: digital-silence runs and the tail
win = 0.02; n = int((dur - CUT) / win); run = 0; worst = 0; worst_at = CUT
for k in range(n):
    if db(seg(CUT + k * win, CUT + (k + 1) * win)) < -60: run += 1
    else:
        if run * win > worst: worst, worst_at = run * win, CUT + (k - run) * win
        run = 0
if run * win > worst: worst, worst_at = run * win, CUT + (n - run) * win
tail = db(seg(dur - 1.0, dur))
ok = worst <= 0.30 and tail > -40
rec('dead_air', ok, f'longest digital silence in part 2 = {worst:.2f}s (at {worst_at:.2f}s), last 1.0 s = {tail:.1f} dBFS. '
    + ('' if ok else 'Dead air: the end card must keep the beat/chord tail to the final frame.'))

# loudness
def lufs(t0, t1):
    r = sh(['ffmpeg', '-hide_banner', '-nostats', '-ss', str(t0), '-t', str(t1 - t0), '-i', V, '-vn', '-af', 'ebur128', '-f', 'null', '-']).stderr.decode()
    m = re.findall(r'\n\s*I:\s*(-?[\d.]+) LUFS', r); return float(m[-1]) if m else float('nan')
lo, lp = lufs(0, CUT), lufs(CUT, dur)
rec('loudness', abs(lp - lo) <= 3, f'original {lo:.1f} LUFS, part 2 {lp:.1f} LUFS (need within 3 LU)')

# length
p2 = dur - CUT
rec('length', p2 <= a.max_part2 and p2 <= 0.4 * dur, f'part 2 = {p2:.1f}s of {dur:.1f}s ({100 * p2 / dur:.0f}%); limit {a.max_part2:.0f}s and 40%')

# voice
def f0s(x):
    out = []; w = 640
    for i in range(0, len(x) - w, 160):
        s = x[i:i + w] - x[i:i + w].mean()
        if np.sqrt((s ** 2).mean()) < 800 / 32768: continue
        c = np.correlate(s, s, 'full')[w - 1:]; lo_, hi_ = SR // 400, SR // 60
        k = lo_ + np.argmax(c[lo_:hi_])
        if c[k] > 0.4 * c[0]: out.append(SR / k)
    return np.array(out)
if a.voice or a.voice_file:
    n0, n1 = a.narrator or (1, min(CUT - 1, 28))
    if a.voice_file:
        vf = np.frombuffer(sh(['ffmpeg', '-v', 'error', '-i', a.voice_file, '-ac', '1', '-ar', str(SR), '-f', 's16le', '-']).stdout, np.int16).astype(float) / 32768
        vwin = (0.0, len(vf) / SR); fvx = vf
    else:
        vwin = tuple(a.voice); fvx = seg(*a.voice)
    fn, fv = f0s(seg(n0, n1)), f0s(fvx)
    if len(fn) < 30 or len(fv) < 8:
        rec('voice', False, f'not enough voiced frames to judge (narrator {len(fn)}, part 2 {len(fv)}): pass --narrator/--voice windows with speech only')
    else:
        mn, mv, sn, sv = np.median(fn), np.median(fv), fn.std(), fv.std()
        long_ = (vwin[1] - vwin[0]) >= 2.0
        ok = abs(mv / mn - 1) <= 0.30 and (sv >= 0.5 * sn or not long_)
        rec('voice', ok, f'narrator median {mn:.0f} Hz (spread {sn:.0f}), part 2 voice median {mv:.0f} Hz (spread {sv:.0f}). '
            + ('' if ok else 'The voice is not the narrator (flat/robotic or wrong register). Drop it: ship part 2 with no voice rather than a robot.'))
elif a.no_voice:
    rec('voice', True, 'part 2 declared voiceless (impacts + beat only)')
print('\nALL QA CHECKS PASSED' if all(res) else '\nQA FAILED: do not deliver; fix the FAIL lines first')
sys.exit(0 if all(res) else 1)

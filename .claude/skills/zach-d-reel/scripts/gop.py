#!/usr/bin/env python3
"""GOP helper for editing an uploaded video with the smallest possible re-encode.

  gop.py keyframes <orig.mp4>                      -> prints the frame number of every keyframe (0-based) and the frame count
  gop.py extract   <orig.mp4> A B <outdir>         -> finds the GOP-aligned range [S, E] that contains frames A..B, prints "S E",
                                                      and writes frames S..E as <outdir>/f%04d.png (ABSOLUTE frame numbers)

Why: every frame you touch (watermark cover, etc.) must be re-encoded, and a frame can only be re-encoded together with its
whole GOP (keyframe to the next keyframe). Everything outside those GOPs stays stream-copied, bit-identical. Edit the PNGs
in place (or into a second dir), then pass the dir to assemble.py as --replace S:E:<dir>.
Read-only on the original.
"""
import subprocess, sys, os, math
from fractions import Fraction


def sh(cmd):
    return subprocess.run(cmd, check=True, capture_output=True, text=True).stdout


def probe(orig):
    import json
    v = json.loads(sh(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=time_base,r_frame_rate',
                       '-of', 'json', orig]))['streams'][0]
    tbs, fps = v['time_base'], v['r_frame_rate']
    pk = sh(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'packet=pts,flags', '-of', 'csv=p=0', orig])
    pkts = []
    for line in pk.strip().splitlines():
        p, fl = line.split(',')[:2]
        pkts.append((int(p), 'K' in fl))
    pkts.sort()                       # presentation order: index = frame number
    return Fraction(tbs), fps, pkts


def keyframes(orig):
    tb, fps, pkts = probe(orig)
    return [i for i, (_, k) in enumerate(pkts) if k], len(pkts), tb, fps, pkts


def main():
    if len(sys.argv) < 3:
        sys.exit(__doc__)
    cmd, orig = sys.argv[1], sys.argv[2]
    K, T, tb, fps, pkts = keyframes(orig)
    if cmd == 'keyframes':
        print('frames', T, 'fps', fps)
        print('keyframes', ' '.join(map(str, K)))
    elif cmd == 'extract':
        a, b, out = int(sys.argv[3]), int(sys.argv[4]), sys.argv[5]
        S = max(k for k in K if k <= a)
        nxt = [k for k in K if k > b]
        E = (nxt[0] - 1) if nxt else T - 1
        os.makedirs(out, exist_ok=True)
        t = math.ceil(float(pkts[S][0] * tb) * 1e6) / 1e6     # seek to the keyframe exactly (ceil to the microsecond)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.6f}', '-i', orig, '-frames:v', str(E - S + 1),
                        '-start_number', str(S), os.path.join(out, 'f%04d.png')], check=True)
        print(S, E)
    else:
        sys.exit(__doc__)


if __name__ == '__main__':
    main()

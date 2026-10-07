#!/usr/bin/env python3
"""envelope.py <video> <t0> <t1> [ms=10]   RMS (and zero-crossings) of the soundtrack every `ms`, for finding the gap between
two spoken words so an audio cut lands in silence, not inside a syllable. Prints "time:rms/zc"; a word is loud with few zero
crossings (voiced), 's'/'t' sounds are quieter with MANY zero crossings. Read-only on the video."""
import subprocess, sys
import numpy as np
v, t0, t1 = sys.argv[1], float(sys.argv[2]), float(sys.argv[3]); ms = float(sys.argv[4]) if len(sys.argv) > 4 else 10
raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', str(t0), '-t', str(t1 - t0), '-i', v, '-map', '0:a:0', '-ac', '1', '-ar', '16000',
                      '-f', 's16le', '-'], capture_output=True).stdout
x = np.frombuffer(raw, dtype=np.int16).astype(float); n = int(16000 * ms / 1000)
out = []
for i in range(0, len(x) - n, n):
    c = x[i:i + n]; out.append(f'{t0 + i / 16000:.2f}:{int(np.sqrt((c ** 2).mean()))}/{int(((c[:-1] < 0) != (c[1:] < 0)).sum())}')
print('  '.join(out))

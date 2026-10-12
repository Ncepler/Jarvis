#!/usr/bin/env python3
"""Offline neural TTS (Kokoro, Apache-2.0 model) as the FALLBACK voice when the narrator can't be cloned. A voice that isn't the narrator weakens the trick, but a silent cut is
a bigger defect (Noah, 2026-10-10), and this is far livelier than the old robot voice (pitch spread ~26 Hz vs the robot's 14; the real narrator is ~73).
  python3 -I tts_kokoro.py "Veelahs Studio." --voice bm_george --speed 1.08 --out voice.wav
Spell the brand "Veelahs" (spoken VEE-lahs; never "Vilas" or a hyphenated form: SKILL.md). Closest male register to a young explainer: bm_george (median ratio .81), then am_michael/am_adam (.70). Gate the result with
qa.py --voice-file voice.wav. First run downloads the 354 MB voice pack from the lemo-opuscar GitHub release (MIT) into ~/.cache/zach-d-reel/kokoro and pip-installs
kokoro-onnx (Python 3.11-3.13). YOU CANNOT HEAR IT: say so in the delivery."""
import argparse, os, subprocess, sys, tarfile, urllib.request
ap = argparse.ArgumentParser(); ap.add_argument('text'); ap.add_argument('--voice', default='bm_george'); ap.add_argument('--speed', type=float, default=1.08); ap.add_argument('--out', required=True)
a = ap.parse_args()
CACHE = os.path.expanduser('~/.cache/zach-d-reel/kokoro'); os.makedirs(CACHE, exist_ok=True)
model, voices = os.path.join(CACHE, 'kokoro-v1.0.onnx'), os.path.join(CACHE, 'voices-v1.0.bin')
if not (os.path.exists(model) and os.path.exists(voices)):
    tar = os.path.join(CACHE, 'voice.tar')
    print('downloading the Kokoro voice pack (354 MB)...', flush=True)
    urllib.request.urlretrieve('https://github.com/lemomo-ai/lemo-opuscar/releases/download/assets/voice.tar', tar)
    with tarfile.open(tar) as t:
        for m in t.getmembers():
            if m.name.endswith(('kokoro-v1.0.onnx', 'voices-v1.0.bin')): m.name = os.path.basename(m.name); t.extract(m, CACHE)
    os.remove(tar)
try: from kokoro_onnx import Kokoro
except ImportError:
    subprocess.run([sys.executable, '-m', 'pip', 'install', '-q', 'kokoro-onnx', 'soundfile'], check=True); from kokoro_onnx import Kokoro
import soundfile as sf
k = Kokoro(model, voices); samples, sr = k.create(a.text, voice=a.voice, speed=a.speed, lang='en-us'); sf.write(a.out, samples, sr)
print(f'wrote {a.out} ({len(samples) / sr:.1f}s, voice {a.voice}). Now: python3 -I qa.py ... --voice-file {a.out}')

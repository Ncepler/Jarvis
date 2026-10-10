"""Hype-ending sound, synthesized (numpy; nothing sampled): falling whistle -> two impacts -> riser/snare roll -> 150 bpm drop with
laser zaps on every slam -> end hit and chord tail. Every time comes from cfg.json (the same file the picture reads).
Needs: numpy scipy pyloudnorm. Input: the cloned/TTS voice as voice.wav next to this file. Output: audio.wav (stereo 48 kHz).
usage: python3 audio.py [target_lufs]     default target -10.5 (the Zack D originals sit at about -10; match YOUR original's tail:
the `loudness_tail.txt` that scripts/watch.sh writes). t=0 is the cut.
"""
import json, os, sys
import numpy as np
from scipy.io import wavfile
from synth import *

HERE = os.path.dirname(os.path.abspath(__file__))
CFG = json.load(open(os.path.join(HERE, 'cfg.json')))
DUR = CFG['duration']
T_IMP1, T_IMP2, T_DROP, BEAT, T_END = CFG['tImp1'], CFG['tImp2'], CFG['tDrop'], CFG['beat'], CFG['tEnd']
SLAMS = [s['t'] for s in CFG['slams']]
LUFS = float(sys.argv[1]) if len(sys.argv) > 1 else -10.5
m = Mix(DUR)
r = np.random.default_rng(5)

def sweep(f0, f1, dur, shape='exp'):
    t = tt(dur); f = f0 * (f1 / f0) ** (t / dur) if shape == 'exp' else f0 + (f1 - f0) * t / dur
    return np.sin(2 * np.pi * np.cumsum(f) / SR), t

def zap(dur=0.2, f0=4200, f1=180):
    """laser 'pew': FM-ish descending sweep"""
    t = tt(dur); f = f1 + (f0 - f1) * np.exp(-t / 0.035)
    mod = np.sin(2 * np.pi * np.cumsum(f * 1.5) / SR) * 2.5
    return np.sin(2 * np.pi * np.cumsum(f) / SR + mod) * np.exp(-t / 0.07)

def boom(dur=1.6, big=1.0):
    t = tt(dur)
    f = 28 + 110 * np.exp(-t / 0.09)
    sub = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / (0.55 * big))
    crack = lp(r.standard_normal(len(t)), 6000) * np.exp(-t / 0.05)
    rumble = lp(r.standard_normal(len(t)), 300) * np.exp(-t / 0.5) * 1.6
    return np.tanh((sub * 1.6 + crack * 0.6 + rumble * 0.5) * 1.8)

def supersaw(m_, dur, cutoff=1800):
    t = tt(dur); s = sum(saw(mtof(m_) * (1 + d), t) for d in (-0.012, -0.004, 0.004, 0.012)) / 4
    return lp(s, cutoff) * env(len(t), a=0.004, r=0.04, hold=dur - 0.04)

T_FINAL = CFG.get('tFinal', DUR)
OPEN = CFG.get('opening', 'pin')
if OPEN == 'orb':
    # the cut itself is an event: thump + click on the very first frame, so the hard cut to the new screen is HEARD (never a silent cut)
    m.add('fx', boom(0.9, 0.5), 0.0, gain=0.8, send=0.2)
    m.add('fx', kick(0.3, 170, 46), 0.0, gain=0.85)
    m.add('fx', zap(0.12, 6200, 900), 0.0, gain=0.3, pan=0.2)
else:
    # --- A: "locate" -> siren yelp + lock-on beeps + the pin dropping, into impact 1
    t = tt(T_IMP1 + 0.05); f = 1050 + 450 * np.sign(np.sin(2 * np.pi * 7.5 * t)) * 0 + 420 * np.sin(2 * np.pi * 7.5 * t)
    yelp = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(len(t), a=0.004, r=0.03)
    m.add('fx', lp(np.tanh(yelp * 2.2), 3500), 0.0, gain=0.22, pan=-0.3, send=0.25)
    for k, t0 in enumerate((0.02, 0.12, 0.2, 0.26)):
        bt = tt(0.05); m.add('fx', np.sin(2 * np.pi * (1900 + 300 * k) * bt) * np.exp(-bt / 0.018), t0, gain=0.22, pan=(-0.5, 0.5)[k % 2], send=0.2)
w, t = sweep(2400, 600, T_IMP1)
m.add('fx', w * np.linspace(0.1, 0.6, len(t)) ** 1.5, 0.0, gain=0.35, send=0.2)
m.add('fx', whoosh(T_IMP1 + 0.04, 250, 8000, peak=0.9), 0.0, gain=1.0, send=0.2)
m.add('fx', boom(1.8, 1.2), T_IMP1, gain=1.0, send=0.35)
m.add('fx', kick(0.5, 180, 40), T_IMP1, gain=0.9)
for k, pan in enumerate((-0.6, 0.6)): m.add('fx', zap(0.25, 5200, 300), T_IMP1 + 0.01 * k, pan=pan, gain=0.35, send=0.1)
if OPEN != 'orb':
    # radar pings from the landed pin
    for k in range(3):
        bt = tt(0.5); m.add('fx', np.sin(2 * np.pi * 1320 * bt) * np.exp(-bt / 0.12), T_IMP1 + 0.22 + 0.22 * k, gain=0.12, pan=(-0.4, 0.4, 0)[k], send=0.5)
# impact 2 on "Studio"
m.add('fx', boom(1.0, 0.6), T_IMP2, gain=0.7, send=0.3)
m.add('fx', kick(0.4, 160, 45), T_IMP2, gain=0.7)
m.add('fx', zap(0.2, 3800, 260), T_IMP2, pan=0.3, gain=0.3, send=0.3)
# riser + accelerating snare roll into the drop
R0 = T_IMP2 + 0.05
w, t = sweep(180, 1600, T_DROP - R0)
m.add('fx', lp(np.sign(w) * 0.5, 2500) * np.linspace(0, 1, len(t)) ** 2, R0, gain=0.25, send=0.2)
m.add('fx', whoosh(0.62, 400, 9000, peak=0.98), T_DROP - 0.62, gain=0.9, send=0.2)
tt_ = R0 + 0.15; step = 0.12
while tt_ < T_DROP - 0.02:
    m.add('drums', clap(0.12) * (0.4 + 0.6 * (tt_ - R0) / (T_DROP - R0)), tt_, gain=0.45, send=0.1)
    step = max(0.035, step * 0.86); tt_ += step

# --- B: the drop (150 bpm), runs through the end card until the final hit
m.add('fx', boom(1.4, 1.0), T_DROP, gain=0.9, send=0.35)
m.add('fx', hp(r.standard_normal(int(1.2 * SR)), 3000) * np.exp(-tt(1.2) / 0.35), T_DROP, gain=0.35, send=0.4)
bass_notes = [40, 40, 43, 38, 40, 40, 47, 45, 40, 40, 43, 38]
b = 0
while T_DROP + b * BEAT < T_FINAL - 0.01:
    t0 = T_DROP + b * BEAT
    m.add('drums', kick(0.42, 160, 44, punch=1.2), t0, gain=0.95)
    if b % 2 == 1: m.add('drums', clap(0.3), t0, gain=0.6, send=0.15)
    for h in range(4):
        m.add('drums', hat(0.05), t0 + h * BEAT / 4, pan=0.3 if h % 2 else -0.3, gain=0.22 if h % 2 else 0.12)
    m.add('bass', supersaw(bass_notes[b % 12] + 12, BEAT / 2 - 0.02, 2600), t0 + BEAT / 2, gain=0.35, send=0.12)
    m.add('bass', sub_bass(bass_notes[b % 12], BEAT * 0.9), t0, gain=0.55)
    b += 1
# pre-final snare fill
tt_ = T_FINAL - BEAT
for k in range(8): m.add('drums', clap(0.1) * (0.5 + 0.5 * k / 7), tt_ + k * BEAT / 8, gain=0.4, send=0.1)
for s_ in CFG['slams']:
    if s_.get('glitch'):
        for k in range(6): m.add('fx', zap(0.06, 7000, 1500), s_['t'] + 0.1 * k, pan=(-1) ** k * 0.5, gain=0.18)
for i, s in enumerate(SLAMS):
    m.add('fx', zap(0.22, 4800, 220), s, pan=(-0.4, 0.4)[i % 2], gain=0.42, send=0.3)
    m.add('fx', zap(0.18, 6400, 400), s + 0.03, pan=(0.4, -0.4)[i % 2], gain=0.25, send=0.3)
# end card hit (the beat keeps going under it)
m.add('fx', whoosh(0.4, 300, 9000, peak=0.98), T_END - 0.38, gain=0.8)
m.add('fx', boom(1.6, 1.2), T_END, gain=0.9, send=0.45)
m.add('fx', hp(r.standard_normal(int(1.6 * SR)), 3500) * np.exp(-tt(1.6) / 0.5), T_END, gain=0.3, send=0.5)
for k in range(3): m.add('fx', zap(0.3, 5000 - k * 900, 200), T_END + 0.05 + 0.09 * k, pan=(-0.6, 0.6, 0)[k], gain=0.3, send=0.4)
# final hit: everything lands, chord tail to the end
TL = DUR - T_FINAL
m.add('fx', boom(1.6, 1.3), T_FINAL, gain=1.0, send=0.45)
m.add('drums', kick(0.6, 170, 40, punch=1.3), T_FINAL, gain=1.0)
m.add('fx', hp(r.standard_normal(int(TL * SR)), 3500) * np.exp(-tt(TL) / 0.5), T_FINAL, gain=0.3, send=0.5)
for k, (n_, pan) in enumerate([(52, -0.5), (59, 0.5), (64, 0.0), (67, -0.2)]):
    m.add('bass', supersaw(n_, TL, 3200) * np.exp(-tt(TL) / 0.9), T_FINAL, pan=pan, gain=0.18, send=0.4)
m.add('bass', sub_bass(40, TL), T_FINAL, gain=0.5)
for k in range(4): m.add('fx', zap(0.3, 5600 - k * 900, 200), T_FINAL + 0.04 + 0.07 * k, pan=(-0.6, 0.6, -0.2, 0.2)[k], gain=0.3, send=0.4)

# --- voice (cloned narrator / TTS). The picture's impact lands on the word's first syllable: set voice.onsetInClip to where the
# word starts inside the (trimmed) clip, and voice.landsOn to the cfg time it must hit.
VC = CFG.get('voice')
if VC and os.path.exists(os.path.join(HERE, VC['file'])):
    sr_v, v = wavfile.read(os.path.join(HERE, VC['file'])); v = v.astype(float) / 32768
    if v.ndim > 1: v = v.mean(1)
    v = hp(v, 80); v = v / np.max(np.abs(v)) * 0.9
    CUT = int(VC.get('trimStart', 0) * SR); v = v[CUT:]; k = min(480, len(v)); v[:k] *= np.linspace(0, 1, k)   # 10 ms fade-in
    V_AT = CFG[VC['landsOn']] - VC.get('onsetInClip', 0)
    m.add('voice', v, V_AT, gain=1.6, send=0.05)
    # Duck effects and drums under the word, but only until just before the drop: the drop's first hit must stay full-size even if
    # the last syllable of the clone is still ringing (the drop wins).
    END = min(V_AT + len(v) / SR, T_DROP - 0.03)
    m.duck('fx', V_AT, END, depth=0.25, ramp=0.05)      # impacts keep their transients, riser/whoosh drop ~12 dB
    m.duck('drums', V_AT, END, depth=0.15, ramp=0.05)   # the riser's snare roll starts under the word's last syllable
    # intelligibility check (you cannot hear it): voice vs everything else, 300-4000 Hz, in thirds of the ducked window. Needs >= 7 dB.
    def band(b, t0, t1):
        seg = bp(b.mean(1)[int(t0 * SR):int(t1 * SR)], 300, 4000)
        return 20 * np.log10(np.sqrt((seg ** 2).mean()) + 1e-9)
    others = sum(b for k, b in m.buses.items() if k != 'voice')
    d = END - V_AT
    margins = [band(m.buses['voice'], V_AT + d * i / 3, V_AT + d * (i + 1) / 3) - band(others, V_AT + d * i / 3, V_AT + d * (i + 1) / 3) for i in range(3)]
    print('VOICE over everything else (300-4000 Hz, thirds of the line): ' + ' / '.join('%.1f dB' % x for x in margins)
          + ('' if min(margins) >= 7 else '   <-- BELOW 7 dB: raise the voice gain or deepen the duck'))

ir = reverb_ir(1.8, 0.015, 5000)
m.master(os.path.join(HERE, 'audio.wav'), ir=ir, wet=0.22, lufs=LUFS, wrap_tail=False, edge=0.003)

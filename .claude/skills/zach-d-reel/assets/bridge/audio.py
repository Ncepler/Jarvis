"""Bridge ending sound. Picture and sound read the SAME cfg.json, so they cannot drift.
Real recorded SFX (Pixabay Content License, via scripts/fetch_sound.py -> ./sfx/) are matched to the transition; anything missing is
synthesised (synth.py), so this always runs. The music bed under the site footage is generated per video from a MOOD + a SEED, so two
videos never sound alike (the old laser template had one fixed riff: the same bed every time).

  python3 audio.py [target_lufs]        default -12 (use the original's tail LUFS from watch.sh's loudness_tail.txt)
  cfg.sound = {"mood": "playful|tense|wonder|epic|calm|dark", "seed": 3, "bpm": null, "root": null, "bed_gain": 0.5}
  cfg.voice = {"file": "voice.wav", "at": 1.3, "trimStart": 0.0, "onsetInClip": 0.03}       (optional; the narrator's clone or nothing)
Writes audio.wav (48 kHz stereo) and sound_ledger.json (every real file used + its licence; synthesised parts listed as 'generated').
"""
import json, os, subprocess, sys
import numpy as np
from scipy.io import wavfile
from synth import *

HERE = os.path.dirname(os.path.abspath(__file__))
CFG = json.load(open(os.path.join(HERE, 'cfg.json')))
DUR, TR, T_END = CFG['duration'], CFG['transition']['dur'], CFG['tEnd']
TYPE = CFG['transition']['type']
SND = CFG.get('sound', {})
MOOD = SND.get('mood', 'playful'); SEED = int(SND.get('seed', 1)); LUFS = float(sys.argv[1]) if len(sys.argv) > 1 else -12.0
R = np.random.default_rng(SEED)
m = Mix(DUR)
ledger = {'real': [], 'generated': []}

# ---------------------------------------------------------------------------------------------------------------- real SFX (or a synth stand-in)
SFX_DIR = os.path.join(HERE, 'sfx')
def real(name, start=0.0, dur=None, gain=1.0, fade=0.01):
    p = os.path.join(SFX_DIR, name)
    if not os.path.exists(p): return None
    cmd = ['ffmpeg', '-v', 'error', '-ss', str(start)] + (['-t', str(dur)] if dur else []) + ['-i', p, '-ac', '1', '-ar', str(SR), '-f', 'f32le', '-']
    x = np.frombuffer(subprocess.run(cmd, capture_output=True).stdout, np.float32).astype(float)
    if len(x) == 0: return None
    ledger['real'].append({'file': name, 'license': 'Pixabay Content License (commercial use OK, no attribution)', 'source': 'hyperframes media-use bundled SFX'})
    return fade_edges(x / (np.max(np.abs(x)) + 1e-9) * gain, fade, 0.02)
def sfx(bus, name, t0, gain=1.0, pan=0.0, send=0.1, start=0.0, dur=None, fallback=None):
    x = real(name, start, dur, 1.0)
    if x is None and fallback is not None:
        x = fallback; ledger['generated'].append(f'{name} -> synth stand-in')
    if x is not None: m.add(bus, x, t0, pan=pan, gain=gain, send=send)

def riser_synth(d):
    t = tt(d); f = 180 * (2200 / 180) ** (t / d); x = np.sin(2 * np.pi * np.cumsum(f) / SR) * (t / d) ** 2
    return lp(x + 0.3 * R.standard_normal(len(t)) * (t / d) ** 3, 5000)

# ---------------------------------------------------------------------------------------------------------------- transition sound design
# t=0 is the cut. The landing (site footage appears) is at TR.
def transition_sound():
    if TYPE == 'zoom':
        sfx('fx', 'riser.mp3', 0.0, 0.8, start=max(0, 10.0 - TR - 0.15), dur=TR + 0.15, fallback=riser_synth(TR))
        sfx('fx', 'whoosh-cinematic.mp3', 0.0, 0.7, start=0.0, dur=TR + 0.5, fallback=whoosh(TR + 0.4, 200, 6000, 0.6))
        sfx('fx', 'impact-bass-1.mp3', TR - 0.02, 0.9, send=0.25, fallback=thud(1.2, 120, 42))
        sfx('fx', 'sparkle.mp3', TR + 0.05, 0.35, send=0.3)
    elif TYPE == 'iris':
        sfx('fx', 'whoosh-short.mp3', 0.0, 0.8, fallback=whoosh(0.5, 300, 5000, 0.5))
        sfx('fx', 'pop.mp3', 0.05, 0.9, fallback=thud(0.3, 420, 160))
        sfx('fx', 'riser.mp3', 0.1, 0.55, start=9.0, dur=TR, fallback=riser_synth(TR))
        sfx('fx', 'impact-bass-2.mp3', TR - 0.05, 0.7, send=0.25, fallback=thud(1.0, 110, 45))
        sfx('fx', 'chime.mp3', TR - 0.02, 0.5, send=0.35, fallback=bell(79, 1.8))
    elif TYPE == 'whip':
        sfx('fx', 'whoosh.mp3', 0.0, 1.0, fallback=whoosh(0.6, 300, 6000, 0.45))
        sfx('fx', 'whoosh-short.mp3', 0.28, 0.7, pan=0.3, fallback=whoosh(0.4, 400, 7000, 0.4))
        sfx('fx', 'impact-bass-2.mp3', TR - 0.05, 0.5, send=0.2, fallback=thud(0.8, 120, 46))
    elif TYPE == 'shatter':
        m.add('fx', glass_crack(0.7), 0.0, gain=0.9, send=0.2); ledger['generated'].append('glass_crack (synth)')
        m.add('fx', shatter(1.6), 0.08, gain=0.8, send=0.25); ledger['generated'].append('shatter (synth)')
        sfx('fx', 'impact-bass-1.mp3', 0.06, 1.0, send=0.3, fallback=thud(1.2, 110, 42))
        sfx('fx', 'whoosh-cinematic.mp3', 0.15, 0.5, start=0.5, dur=1.0)
    elif TYPE == 'doors':
        sfx('fx', 'chime.mp3', 0.0, 0.9, send=0.4, fallback=bell(84, 2.0))                     # the elevator ding
        m.add('fx', lp(whoosh(0.75, 120, 900, 0.5), 1400), 0.14, gain=0.8, send=0.15); ledger['generated'].append('door slide (filtered whoosh, synth)')
        sfx('fx', 'impact-bass-1.mp3', TR - 0.1, 0.45, send=0.2, fallback=thud(0.9, 110, 46))
    elif TYPE == 'glitch':
        for k, (nm, t0) in enumerate((('glitch-1.mp3', 0.0), ('glitch-2.mp3', 0.28), ('glitch-3.mp3', 0.52))):
            sfx('fx', nm, t0, 0.8, pan=(-0.4, 0.4, 0.0)[k], dur=0.7, fallback=whoosh(0.3, 2000, 9000, 0.5))
        sfx('fx', 'impact-bass-2.mp3', TR - 0.05, 0.8, send=0.25, fallback=thud(0.9, 120, 45))

# ---------------------------------------------------------------------------------------------------------------- music bed (mood + seed)
SCALES = {'maj_pent': [0, 2, 4, 7, 9], 'min_pent': [0, 3, 5, 7, 10], 'lydian': [0, 2, 4, 6, 7, 9, 11], 'minor': [0, 2, 3, 5, 7, 8, 10], 'dorian': [0, 2, 3, 5, 7, 9, 10]}
MOODS = {   # bpm range, scale, root range (MIDI), lead instrument, drums style
    'playful': dict(bpm=(108, 120), scale='maj_pent', root=(60, 66), lead='marimba', drums='offbeat'),
    'tense':   dict(bpm=(90, 100), scale='minor', root=(38, 44), lead='bell', drums='pulse'),
    'wonder':  dict(bpm=(78, 90), scale='lydian', root=(60, 65), lead='bell', drums='soft'),
    'epic':    dict(bpm=(116, 126), scale='dorian', root=(45, 50), lead='strings', drums='driving'),
    'calm':    dict(bpm=(74, 84), scale='maj_pent', root=(57, 62), lead='epiano', drums='soft'),
    'dark':    dict(bpm=(84, 94), scale='min_pent', root=(36, 41), lead='bell', drums='pulse'),
}
def bed():
    P = MOODS[MOOD]; bpm = SND.get('bpm') or float(R.uniform(*P['bpm'])); root = SND.get('root') or int(R.integers(*P['root']))
    beat = 60.0 / bpm; sc = SCALES[P['scale']]; t0 = TR; gain = SND.get('bed_gain', 0.5)
    motif = [int(R.integers(0, len(sc))) for _ in range(8)]; rest = R.random(8) < 0.3     # a seeded 8-step motif
    nsteps = int((T_END + 1.4 - t0) / (beat / 2)); drum_style = P['drums']
    ledger['generated'].append(f"bed: mood={MOOD} seed={SEED} bpm={bpm:.0f} root={root} scale={P['scale']} lead={P['lead']} drums={drum_style}")
    for i in range(nsteps):
        t = t0 + i * beat / 2; deg = motif[i % 8]; note = root + sc[deg % len(sc)] + 12 * (deg // len(sc))
        if not rest[i % 8] or i % 4 == 0:
            if P['lead'] == 'marimba': m.add('bed', marimba(note + 12, 0.5), t, gain=0.5 * gain, pan=(-0.3, 0.3)[i % 2], send=0.15)
            elif P['lead'] == 'bell': m.add('bed', bell(note + 12, 1.6, 0.8), t, gain=0.35 * gain, pan=(-0.4, 0.4)[i % 2], send=0.3)
            elif P['lead'] == 'epiano': m.add('bed', epiano(note, 1.0, 0.6), t, gain=0.5 * gain, send=0.2)
            elif P['lead'] == 'strings' and i % 4 == 0: m.add('bed', strings([note, note + sc[2 % len(sc)]], beat * 2, 0.15, 0.4), t, gain=0.4 * gain, send=0.2)
        if i % 4 == 0: m.add('bed', sub_bass(root - 24 + (sc[motif[(i // 4) % 8] % len(sc)] if drum_style != 'soft' else 0), beat * 1.8), t, gain=0.45 * gain)
        if drum_style in ('offbeat', 'driving', 'pulse') and i % 2 == 0: m.add('bed', kick(0.3, 150, 46), t, gain=0.55 * gain)
        if drum_style in ('offbeat', 'driving') and i % 4 == 2: m.add('bed', clap(0.22), t, gain=0.3 * gain, send=0.1)
        if drum_style == 'offbeat' and i % 2 == 1: m.add('bed', shaker(0.1), t, gain=0.3 * gain, pan=0.3)
        if drum_style == 'driving': m.add('bed', hat(0.05), t, gain=0.14 * gain, pan=-0.2)
        if drum_style == 'pulse' and i % 2 == 1: m.add('bed', clock_tick(i % 4 == 1), t, gain=0.35 * gain)
        if drum_style == 'soft' and i % 4 == 2: m.add('bed', shaker(0.14), t, gain=0.22 * gain, pan=0.3)
    if P['lead'] in ('bell', 'epiano', 'strings') or MOOD in ('wonder', 'calm'):
        m.add('bed', pad([root + 12, root + 12 + sc[2 % len(sc)], root + 12 + sc[4 % len(sc)]], T_END + 1.4 - t0, 1300, 0.12, 0.6, 1.0), t0, gain=0.18 * gain, send=0.3)
    # the bed gets out of the way on the end card: the sting owns it
    m.duck('bed', T_END - 0.02, DUR, depth=0.35, ramp=0.06)

def end_sting():
    sfx('fx', 'impact-bass-1.mp3', T_END, 0.9, send=0.3, fallback=thud(1.4, 115, 42))
    sfx('fx', 'chime.mp3', T_END + 0.02, 0.6, send=0.4, fallback=bell(76, 2.4))
    sfx('fx', 'sparkle.mp3', T_END + 0.2, 0.35, send=0.4)

transition_sound(); bed(); end_sting()

# ---------------------------------------------------------------------------------------------------------------- voice (the narrator's clone only; never a stock voice)
VC = CFG.get('voice')
if VC and os.path.exists(os.path.join(HERE, VC['file'])):
    sr_v, v = wavfile.read(os.path.join(HERE, VC['file'])); v = v.astype(float) / 32768
    if v.ndim > 1: v = v.mean(1)
    if sr_v != SR:
        from scipy.signal import resample_poly; from math import gcd; g = gcd(SR, sr_v); v = resample_poly(v, SR // g, sr_v // g)
    v = hp(v, 80); v = v / np.max(np.abs(v)) * 0.9; v = v[int(VC.get('trimStart', 0) * SR):]; k = min(480, len(v)); v[:k] *= np.linspace(0, 1, k)
    V_AT = VC['at'] - VC.get('onsetInClip', 0)
    m.add('voice', v, V_AT, gain=1.6, send=0.05)
    END = min(V_AT + len(v) / SR, T_END - 0.03)
    m.duck('fx', max(V_AT, TR), END, depth=0.22, ramp=0.05); m.duck('bed', V_AT, END, depth=0.14, ramp=0.05)
    def band(b, a, z): seg = bp(b.mean(1)[int(a * SR):int(z * SR)], 300, 4000); return 20 * np.log10(np.sqrt((seg ** 2).mean()) + 1e-9)
    others = sum(b for k, b in m.buses.items() if k != 'voice'); d = END - V_AT
    mg = [band(m.buses['voice'], V_AT + d * i / 3, V_AT + d * (i + 1) / 3) - band(others, V_AT + d * i / 3, V_AT + d * (i + 1) / 3) for i in range(3)]
    print('VOICE over everything else (300-4000 Hz, thirds): ' + ' / '.join('%.1f dB' % q for q in mg) + ('' if min(mg) >= 7 else '   <-- BELOW 7 dB: lower the bed or raise the voice'))
else:
    print('NO VOICE in this build (cfg.voice absent or file missing): the qa gate will fail this unless a reason is recorded')

ir = reverb_ir(1.6, 0.015, 5000)
m.master(os.path.join(HERE, 'audio.wav'), ir=ir, wet=0.2, lufs=LUFS, wrap_tail=False, edge=0.003)
ledger['transition'] = TYPE; ledger['mood'] = MOOD; ledger['seed'] = SEED
json.dump(ledger, open(os.path.join(HERE, 'sound_ledger.json'), 'w'), indent=1)
print('real sounds used:', sorted({r['file'] for r in ledger['real']}) or 'none (all synthesised)')

"""Small numpy synth kit shared by the 2026-09-30 reels. Every sound is synthesized here, nothing sampled.
Usage: from synth import *; mix = Mix(seconds); mix.add('bus', signal, t0, pan, gain); mix.master('audio.wav')"""
import numpy as np
from scipy import signal
from scipy.io import wavfile
import pyloudnorm as pyln

SR = 48000
rng = np.random.default_rng(11)


def mtof(m):
    return 440.0 * 2 ** ((m - 69) / 12)


def tt(d):
    return np.arange(int(d * SR)) / SR


def _sos(kind, f, o=2):
    return signal.butter(o, f, kind, fs=SR, output='sos')


def lp(x, fc, o=2):
    return signal.sosfilt(_sos('low', min(fc, SR / 2 - 100), o), x, axis=0)


def hp(x, fc, o=2):
    return signal.sosfilt(_sos('high', fc, o), x, axis=0)


def bp(x, lo, hi, o=2):
    return signal.sosfilt(_sos('band', [lo, min(hi, SR / 2 - 100)], o), x, axis=0)


def env(n, a=0.002, d=0.0, s=1.0, r=0.05, hold=None):
    """ADSR over n samples. hold = seconds before release (default: to the end)"""
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-5))
    if d > 0:
        e = np.where(t > a, s + (1 - s) * np.exp(-(t - a) / d), e)
    if hold is not None:
        e *= np.clip(1 - (t - hold) / max(r, 1e-5), 0, 1)
    return e


def fade_edges(x, a=0.003, r=0.01):
    n = len(x)
    na, nr = min(n, int(a * SR)), min(n, int(r * SR))
    x = x.copy()
    x[:na] *= np.linspace(0, 1, na)[:, None] if x.ndim > 1 else np.linspace(0, 1, na)
    x[n - nr:] *= np.linspace(1, 0, nr)[:, None] if x.ndim > 1 else np.linspace(1, 0, nr)
    return x


# ---------------------------------------------------------------- instruments (mono unless noted)
def pluck(m, dur=0.9, bright=5000, decay=0.994):
    """Karplus-Strong pizzicato/pluck"""
    Np = max(2, int(round(SR / mtof(m) - 0.5)))
    L = int(dur * SR)
    y = np.zeros(L + Np)
    y[:Np + 1] = bp(rng.standard_normal(Np + 1), 150, bright) * np.hanning(Np + 1)
    for i in range(Np + 1, L + Np):
        y[i] = decay * 0.5 * (y[i - Np] + y[i - Np - 1])
    y = y[Np:]
    return fade_edges(y / (np.max(np.abs(y)) + 1e-9), 0.0005, 0.02)


def marimba(m, dur=1.2, hard=0.5):
    f = mtof(m)
    t = tt(dur)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t / (0.35 + 0.2 * (60 / max(m, 40))))
    s += 0.25 * np.sin(2 * np.pi * f * 3.93 * t) * np.exp(-t / 0.05)
    s += 0.08 * np.sin(2 * np.pi * f * 9.2 * t) * np.exp(-t / 0.012) * hard
    s += 0.2 * hard * bp(rng.standard_normal(len(t)), 800, 4000) * np.exp(-t / 0.004)
    return fade_edges(s * np.minimum(1, t / 0.0008), 0.0005, 0.02)


def bell(m, dur=2.0, bright=1.0):
    f = mtof(m)
    t = tt(dur)
    parts = [(1, 1, 1.4), (2.0, .45, .8), (2.76, .3, .5), (5.4, .18 * bright, .22), (8.9, .08 * bright, .08)]
    s = sum(a * np.sin(2 * np.pi * f * r * t) * np.exp(-t / d) for r, a, d in parts)
    return fade_edges(s * np.minimum(1, t / 0.001), 0.0005, 0.03)


def epiano(m, dur=1.6, vel=0.7):
    f = mtof(m)
    t = tt(dur)
    mod = np.sin(2 * np.pi * f * 1.0 * t) * (1.6 * vel) * np.exp(-t / 0.25)
    s = np.sin(2 * np.pi * f * t + mod) * np.exp(-t / 0.9)
    s += 0.12 * np.sin(2 * np.pi * f * 4 * t) * np.exp(-t / 0.1) * vel
    return fade_edges(s * np.minimum(1, t / 0.002), 0.0005, 0.05)


def piano(m, dur=3.0, vel=0.6):
    """soft felt-ish piano: inharmonic partials, two-stage decay"""
    f = mtof(m)
    t = tt(dur)
    s = np.zeros_like(t)
    for k in range(1, 9):
        fk = f * k * np.sqrt(1 + 0.0004 * k * k)
        a = (1 / k ** 1.4) * (vel ** (0.3 * k))
        s += a * np.sin(2 * np.pi * fk * t + rng.uniform(0, 6)) * (0.7 * np.exp(-t / (0.35 / k ** 0.5)) + 0.3 * np.exp(-t / (2.2 / k ** 0.3)))
    s += 0.05 * bp(rng.standard_normal(len(t)), 300, 2500) * np.exp(-t / 0.006)
    return fade_edges(lp(s, 1500 + 5000 * vel) * np.minimum(1, t / 0.003), 0.0005, 0.06)


def saw(f, t, n=12):
    return sum(np.sin(2 * np.pi * f * k * t) / k for k in range(1, n + 1)) * (2 / np.pi)


def pad(ms, dur, cutoff=1400, detune=0.12, a=0.8, r=1.2, voices=3):
    """warm detuned saw pad for a chord (midi list), stereo"""
    t = tt(dur)
    L = np.zeros_like(t)
    R = np.zeros_like(t)
    for m in ms:
        for v in range(voices):
            d = (v - (voices - 1) / 2) * detune
            f = mtof(m + d)
            ph = rng.uniform(0, 1)
            x = saw(f, t + ph / f, n=int(min(24, 6000 / f)))
            pan = (v / max(voices - 1, 1)) * 2 - 1
            L += x * np.cos(np.pi / 4 * (pan * .6 + 1))
            R += x * np.sin(np.pi / 4 * (pan * .6 + 1))
    e = env(len(t), a=a, hold=dur - r, r=r)
    out = np.stack([lp(L, cutoff), lp(R, cutoff)], 1) * e[:, None]
    return out / (len(ms) * voices) * 1.6


def strings(ms, dur, a=1.2, r=1.5, cutoff=2400):
    """slow ensemble strings: pad with vibrato-ish chorus"""
    t = tt(dur)
    L = np.zeros_like(t)
    R = np.zeros_like(t)
    for m in ms:
        for v in range(4):
            vib = 0.0025 * np.sin(2 * np.pi * (4.8 + v * 0.37) * t + v)
            f = mtof(m + (v - 1.5) * 0.08)
            ph = 2 * np.pi * np.cumsum(f * (1 + vib)) / SR
            x = sum(np.sin(ph * k) / k for k in range(1, int(min(16, 7000 / f)) + 1))
            pan = [-.7, -.25, .25, .7][v]
            L += x * np.cos(np.pi / 4 * (pan + 1))
            R += x * np.sin(np.pi / 4 * (pan + 1))
    e = env(len(t), a=a, hold=dur - r, r=r)
    out = np.stack([lp(L, cutoff, 2), lp(R, cutoff, 2)], 1) * e[:, None]
    return out / (len(ms) * 4) * 1.5


def sub_bass(m, dur, a=0.005, r=0.08):
    t = tt(dur)
    f = mtof(m)
    s = np.sin(2 * np.pi * f * t) + 0.25 * np.sin(4 * np.pi * f * t)
    return s * env(len(t), a=a, hold=dur - r, r=r)


def kick(dur=0.45, f0=150, f1=48, punch=1.0):
    t = tt(dur)
    f = f1 + (f0 - f1) * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    s = np.sin(ph) * np.exp(-t / 0.16)
    s += punch * 0.3 * bp(rng.standard_normal(len(t)), 1000, 5000) * np.exp(-t / 0.003)
    return np.tanh(s * 1.4)


def snare(dur=0.3, tone=190):
    t = tt(dur)
    s = 0.5 * np.sin(2 * np.pi * tone * t) * np.exp(-t / 0.04)
    s += bp(rng.standard_normal(len(t)), 1500, 9000) * np.exp(-t / 0.08)
    return s


def clap(dur=0.35):
    t = tt(dur)
    n = bp(rng.standard_normal(len(t)), 900, 5000)
    e = np.zeros_like(t)
    for d in (0, 0.009, 0.018, 0.027):
        e += (t >= d) * np.exp(-(t - d).clip(0) / (0.006 if d < 0.027 else 0.1))
    return n * e * 0.8


def hat(dur=0.08, open_=False):
    t = tt(0.4 if open_ else dur)
    s = hp(rng.standard_normal(len(t)), 7000, 4) * np.exp(-t / (0.12 if open_ else 0.018))
    return s


def shaker(dur=0.12):
    t = tt(dur)
    return bp(rng.standard_normal(len(t)), 4000, 12000) * np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 2


def woodblock(m=84, dur=0.12):
    f = mtof(m)
    t = tt(dur)
    s = np.sin(2 * np.pi * f * t) * np.exp(-t / 0.025) + 0.4 * np.sin(2 * np.pi * f * 2.7 * t) * np.exp(-t / 0.01)
    return s


def clock_tick(high=True):
    t = tt(0.06)
    f = 3400 if high else 2600
    s = bp(rng.standard_normal(len(t)), f * 0.7, f * 1.4) * np.exp(-t / 0.004)
    s += 0.5 * np.sin(2 * np.pi * f * 0.5 * t) * np.exp(-t / 0.006)
    return s


def click(dur=0.03, f=2500, dec=0.003):
    t = tt(dur)
    return bp(rng.standard_normal(len(t)), f * 0.6, f * 1.6) * np.exp(-t / dec)


def felt_click():
    t = tt(0.08)
    s = lp(rng.standard_normal(len(t)), 1800) * np.exp(-t / 0.006)
    s += 0.6 * np.sin(2 * np.pi * 240 * t) * np.exp(-t / 0.012)
    return s


def buzzer(dur=0.7):
    t = tt(dur)
    s = np.sign(np.sin(2 * np.pi * 98 * t)) * 0.5 + np.sign(np.sin(2 * np.pi * 104 * t)) * 0.5
    s = lp(s, 2200) * env(len(t), a=0.004, hold=dur - 0.06, r=0.06)
    return np.tanh(s * 1.5)


def whoosh(dur=0.6, lo=300, hi=5000, peak=0.55):
    """filtered noise sweep; peak = where in the whoosh it's loudest (0..1)"""
    t = tt(dur)
    n = rng.standard_normal(len(t))
    x = t / dur
    fc = lo * (hi / lo) ** np.sin(np.pi * np.clip(x / (2 * peak), 0, 0.5)) if peak > 0 else np.full_like(t, hi)
    # time-varying lowpass via blocks
    out = np.zeros_like(n)
    B = 512
    zi = None
    for i in range(0, len(n), B):
        sos = _sos('band', [max(60, fc[i] * 0.35), min(SR / 2 - 200, fc[i] * 1.6)], 2)
        if zi is None:
            zi = signal.sosfilt_zi(sos) * 0
        out[i:i + B], zi = signal.sosfilt(sos, n[i:i + B], zi=zi)
    e = np.exp(-((x - peak) / 0.28) ** 2)
    return out * e


def marker_squeak(dur=0.42):
    """felt-tip marker drawn in a loop on glass"""
    t = tt(dur)
    f = 1800 + 700 * np.sin(2 * np.pi * 3.2 * t)
    ph = 2 * np.pi * np.cumsum(f) / SR
    tone = 0.25 * np.sin(ph) * (0.5 + 0.5 * np.sin(2 * np.pi * 37 * t))
    scr = bp(rng.standard_normal(len(t)), 2500, 7000) * (0.6 + 0.4 * np.sin(2 * np.pi * 6.4 * t))
    return (tone + scr) * np.sin(np.pi * np.clip(t / dur, 0, 1)) ** 0.6


def thud(dur=0.5, f0=110, f1=45):
    t = tt(dur)
    f = f1 + (f0 - f1) * np.exp(-t / 0.05)
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t / 0.12)
    s += 0.5 * lp(rng.standard_normal(len(t)), 1200) * np.exp(-t / 0.03)
    s += 0.25 * bp(rng.standard_normal(len(t)), 2000, 6000) * np.exp(-t / 0.01)
    return np.tanh(s * 1.3)


def glass_crack(dur=0.7):
    t = tt(dur)
    s = np.zeros_like(t)
    for _ in range(40):
        d = rng.uniform(0, 0.25) ** 1.6
        f = rng.uniform(2500, 11000)
        i = int(d * SR)
        n = min(len(t) - i, int(0.03 * SR))
        s[i:i + n] += rng.uniform(.2, 1) * np.sin(2 * np.pi * f * t[:n]) * np.exp(-t[:n] / rng.uniform(0.002, 0.01))
    s += hp(rng.standard_normal(len(t)), 3000) * np.exp(-t / 0.05) * 0.6
    s += 0.6 * np.sin(2 * np.pi * np.cumsum(90 * np.exp(-t / 0.1) + 40) / SR) * np.exp(-t / 0.1)
    return s


def shatter(dur=1.6):
    t = tt(dur)
    s = hp(rng.standard_normal(len(t)), 2500) * np.exp(-t / 0.25) * 0.5
    for _ in range(140):
        d = rng.exponential(0.25)
        if d > dur - 0.05:
            continue
        f = rng.uniform(3000, 12000)
        i = int(d * SR)
        n = min(len(t) - i, int(0.05 * SR))
        s[i:i + n] += rng.uniform(.1, .8) * np.exp(-d * 2) * np.sin(2 * np.pi * f * t[:n]) * np.exp(-t[:n] / rng.uniform(0.003, 0.02))
    return s


def phone_ring(dur=1.6):
    """generic electronic dial ring (two-tone, 440+480 Hz cadence), not any brand's ringtone"""
    t = tt(dur)
    s = 0.5 * np.sin(2 * np.pi * 440 * t) + 0.5 * np.sin(2 * np.pi * 480 * t)
    gate = ((t % 0.8) < 0.55).astype(float)
    return lp(s * gate, 3000) * env(len(t), a=0.01, hold=dur - 0.05, r=0.05)


def room_tone(dur, level=1.0):
    t = tt(dur)
    n = lp(rng.standard_normal(len(t)), 500) * 0.5 + lp(rng.standard_normal(len(t)), 3000) * 0.08
    return n * level


def to_stereo(x, pan=0.0):
    if x.ndim == 2:
        return x
    a = np.pi / 4 * (np.clip(pan, -1, 1) + 1)
    return np.stack([x * np.cos(a), x * np.sin(a)], 1) * np.sqrt(2)


def reverb_ir(seconds=2.2, predelay=0.02, damp=4000, stereo_spread=1.0, seed=3):
    r = np.random.default_rng(seed)
    n = int(seconds * SR)
    t = np.arange(n) / SR
    L = r.standard_normal(n) * np.exp(-t / (seconds / 6.9) * 1.0)
    R = r.standard_normal(n) * np.exp(-t / (seconds / 6.9) * 1.0)
    R = stereo_spread * R + (1 - stereo_spread) * L
    ir = np.stack([lp(L, damp), lp(R, damp)], 1)
    pd = np.zeros((int(predelay * SR), 2))
    ir = np.concatenate([pd, ir])
    return ir / np.sqrt(np.sum(ir ** 2) / 2)


class Mix:
    def __init__(self, seconds):
        self.N = int(round(seconds * SR))
        self.buses = {}
        self.send = np.zeros((self.N, 2))

    def add(self, bus, sig, t0, pan=0.0, gain=1.0, send=0.0):
        sig = to_stereo(np.asarray(sig, dtype=float), pan)
        i = int(round(t0 * SR))
        if i < 0:
            sig, i = sig[-i:], 0
        n = min(len(sig), self.N - i)
        if n <= 0:
            return
        b = self.buses.setdefault(bus, np.zeros((self.N, 2)))
        b[i:i + n] += sig[:n] * gain
        if send:
            self.send[i:i + n] += sig[:n] * gain * send

    def bus(self, name):
        return self.buses.setdefault(name, np.zeros((self.N, 2)))

    def duck(self, name, t0, t1, depth=0.0, ramp=0.03):
        """multiply a bus by `depth` between t0 and t1 (with short ramps)"""
        b = self.bus(name)
        g = np.ones(self.N)
        tt_ = np.arange(self.N) / SR
        g = np.where((tt_ >= t0) & (tt_ < t1), depth, 1.0)
        k = int(ramp * SR)
        if k > 1:
            g = np.convolve(g, np.ones(k) / k, mode='same')
        b *= g[:, None]

    def render(self, ir=None, wet=0.18, wrap_tail=True):
        mix = sum(self.buses.values()) if self.buses else np.zeros((self.N, 2))
        if ir is not None and np.any(self.send):
            wetsig = np.stack([signal.fftconvolve(self.send[:, c], ir[:, c]) for c in (0, 1)], 1)
            head, tail = wetsig[:self.N], wetsig[self.N:]
            if wrap_tail:   # loop-friendly: the reverb tail of the last beat rings into the first
                k = min(len(tail), self.N)
                head[:k] += tail[:k]
            mix = mix + head * wet
        return mix

    def master(self, path, ir=None, wet=0.18, lufs=-14.0, hp_hz=30, wrap_tail=True, edge=0.004):
        mix = self.render(ir, wet, wrap_tail)
        mix = hp(mix, hp_hz, 2)
        e = int(edge * SR)
        mix[:e] *= np.linspace(0, 1, e)[:, None]
        mix[-e:] *= np.linspace(1, 0, e)[:, None]
        meter = pyln.Meter(SR)
        mix *= 10 ** ((lufs - meter.integrated_loudness(mix)) / 20)
        mix = np.tanh(mix * 1.2) / 1.2
        mix *= 10 ** ((lufs - meter.integrated_loudness(mix)) / 20)
        pk = np.max(np.abs(mix))
        if pk > 0.89:
            mix *= 0.89 / pk
        print('LUFS', round(meter.integrated_loudness(mix), 2), 'peak dBFS', round(20 * np.log10(np.max(np.abs(mix))), 2))
        wavfile.write(path, SR, (mix * 32767).astype(np.int16))
        return mix

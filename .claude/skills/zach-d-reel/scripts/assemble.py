#!/usr/bin/env python3
"""Build the final reel: ORIGINAL (optionally cut / with covered watermarks) + PART 2.

  assemble.py --orig upload.mp4 --part2 part2.mp4 --out final.mp4
              [--audio2 part2.wav]            part 2's soundtrack (default: the audio inside --part2, else silence)
              [--cut-frame N]                 keep original frames 0..N-1 only (a word cut Noah asked for)
              [--audio-cut SEC]               keep original audio up to SEC, 30 ms fade-out (default: the cut frame's time)
              [--replace S:E:DIR ...]         frames S..E come from DIR/f%04d.png (absolute frame numbers) instead of the
                                              original: edited frames from gop.py + your cover script. S must be a keyframe and
                                              E+1 a keyframe (or the end/cut), i.e. exactly what `gop.py extract` returned.
              [--crf 14]                      quality of part 2's encode (re-encoded original GOPs use crf 12)

What stays untouched: every original frame NOT inside a --replace range (and not in the last partial GOP before a non-keyframe
cut) is stream-copied and verified bit-identical. Re-encoded ranges are checked by PSNR against their source frames, so a
bad decode can't slip through. The original's soundtrack is re-encoded ONCE (TikTok/IG downloads are HE-AACv2 and cannot be
stream-joined); the check prints its SNR against the upload. Exits non-zero on any failed check. Read-only on the inputs.
"""
import argparse, json, math, os, re, shutil, subprocess, sys, tempfile
from fractions import Fraction

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import gop as G


def run(cmd, quiet=True):
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode:
        sys.exit('FAILED: ' + ' '.join(cmd[:6]) + ' ...\n' + r.stderr[-1500:])
    return r


def ff(*a):
    return run(['ffmpeg', '-v', 'error', '-y', *a])


def probe_streams(path):
    j = json.loads(run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', path]).stdout)
    v = next(s for s in j['streams'] if s['codec_type'] == 'video')
    a = next((s for s in j['streams'] if s['codec_type'] == 'audio'), None)
    return v, a, j['format']


def ceil_us(x):
    return math.ceil(x * 1e6) / 1e6


def framemd5(path, n):
    out = run(['ffmpeg', '-v', 'error', '-i', path, '-map', '0:v:0', '-frames:v', str(n), '-f', 'framemd5', '-']).stdout
    return [l.split(',')[-1].strip() for l in out.splitlines() if l and not l.startswith('#')]


def psnr(inputs_filter, *inputs):
    cmd = ['ffmpeg', '-hide_banner', '-v', 'info']
    for i in inputs:
        cmd += i
    cmd += ['-filter_complex', inputs_filter, '-f', 'null', '-']
    r = subprocess.run(cmd, capture_output=True, text=True)
    m = re.findall(r'average:([0-9.]+|inf)', r.stderr)
    return float(m[-1]) if m else None


def frames_psnr(video, S, E, src_dir, tmp, vf=None):
    """Min / mean RGB PSNR of decoded frames S..E of `video` (by decode index, timestamps ignored) against src_dir/f%04d.png
    (absolute numbering). The ffmpeg psnr filter pairs frames by timestamp, which mis-pairs frames on VFR-ish phone uploads."""
    import numpy as np
    from PIL import Image
    d = os.path.join(tmp, f'chk_{S}_{E}'); os.makedirs(d, exist_ok=True)
    run(['ffmpeg', '-v', 'error', '-y', '-i', video, '-vf', f"select='between(n,{S},{E})'", '-fps_mode', 'passthrough',
         '-start_number', str(S), os.path.join(d, 'f%04d.png')])
    vals = []
    for f in range(S, E + 1):
        o, r = os.path.join(d, f'f{f:04d}.png'), os.path.join(src_dir, f'f{f:04d}.png')
        if not (os.path.exists(o) and os.path.exists(r)):
            return None, None
        a = np.asarray(Image.open(o).convert('RGB'), dtype=float); b = np.asarray(Image.open(r).convert('RGB'), dtype=float)
        if a.shape != b.shape:
            return None, None
        vals.append(10 * np.log10(255 ** 2 / max(((a - b) ** 2).mean(), 1e-9)))
    shutil.rmtree(d, ignore_errors=True)
    return min(vals), sum(vals) / len(vals)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('--orig', required=True); ap.add_argument('--part2', required=True); ap.add_argument('--out', required=True)
    ap.add_argument('--audio2'); ap.add_argument('--cut-frame', type=int); ap.add_argument('--audio-cut', type=float)
    ap.add_argument('--replace', action='append', default=[]); ap.add_argument('--crf', type=int, default=14)
    a = ap.parse_args()

    v, au, fmt = probe_streams(a.orig)
    W, H = int(v['width']), int(v['height'])
    FPS = v['r_frame_rate']; PIX = v['pix_fmt']; TB = Fraction(v['time_base']).denominator
    PROF = v.get('profile', 'High').lower().replace('constrained ', '')
    if v['codec_name'] != 'h264':
        sys.exit(f"STOP: the original video is {v['codec_name']}, not h264, so a lossless join isn't possible. Ask Noah before re-encoding all of it.")
    K, T, tb, _, pkts = G.keyframes(a.orig)
    N = a.cut_frame if a.cut_frame is not None else T
    if not 0 < N <= T:
        sys.exit(f'--cut-frame must be 1..{T}')
    kset = set(K)
    # colour: PNGs extracted from a tagged stream are RGB made with ITS matrix (e.g. bt709); re-encode them with the same matrix,
    # range and tags, or the edited GOPs shift colour (~5 levels) against the stream-copied ones. Untagged = ffmpeg's bt601 default.
    MAT = {'bt709': 'bt709', 'bt470bg': 'bt601', 'smpte170m': 'bt601', 'bt2020nc': 'bt2020'}.get(v.get('color_space'), 'bt601')
    RNG = 'pc' if v.get('color_range') == 'pc' else 'tv'
    TAGS = []
    for opt, key in (('-colorspace', 'color_space'), ('-color_primaries', 'color_primaries'), ('-color_trc', 'color_transfer'), ('-color_range', 'color_range')):
        if v.get(key) and v[key] != 'unknown':
            TAGS += [opt, v[key]]
    TO_YUV = f'scale=out_color_matrix={MAT}:out_range={RNG},format={PIX}'
    v2, _, _ = probe_streams(a.part2)
    MAT2 = {'bt709': 'bt709', 'bt470bg': 'bt601', 'smpte170m': 'bt601', 'bt2020nc': 'bt2020'}.get(v2.get('color_space'), 'bt601')
    P2_VF = f'scale={W}:{H}:flags=lanczos:in_color_matrix={MAT2}:out_color_matrix={MAT}:out_range={RNG},fps={FPS},format={PIX}'
    fps_f = float(Fraction(FPS))
    reps = []
    for r in a.replace:
        S, E, d = r.split(':', 2); S, E = int(S), int(E)
        if S not in kset:
            sys.exit(f'--replace {r}: start {S} is not a keyframe. Keyframes: {K}. Use gop.py extract to get a GOP-aligned range.')
        if not ((E + 1) in kset or E + 1 >= N):
            sys.exit(f'--replace {r}: end {E} is not the last frame of a GOP (next keyframe is not {E + 1}). Keyframes: {K}.')
        if E >= N:
            E = N - 1
        miss = [f for f in range(S, E + 1) if not os.path.exists(os.path.join(d, f'f{f:04d}.png'))]
        if miss:
            sys.exit(f'--replace {r}: missing frames {miss[:5]}... in {d}')
        reps.append((S, E, d))
    reps.sort()
    for x, y in zip(reps, reps[1:]):
        if x[1] >= y[0]:
            sys.exit('--replace ranges overlap')

    W_ = tempfile.mkdtemp(prefix='assemble_')
    n_piece = [0]

    def piece():
        n_piece[0] += 1
        return os.path.join(W_, f'p{n_piece[0]:02d}.mp4')

    def enc_pngs(d, start, count, crf=12):
        out = piece()
        ff('-framerate', FPS, '-start_number', str(start), '-i', os.path.join(d, 'f%04d.png'), '-frames:v', str(count),
           '-vf', TO_YUV, '-c:v', 'libx264', '-profile:v', PROF, '-pix_fmt', PIX, '-crf', str(crf), '-preset', 'slow', *TAGS,
           '-video_track_timescale', str(TB), out)
        return out

    def copy_piece(start, count):
        out = piece()
        t = ceil_us(float(pkts[start][0] * tb))          # lands exactly on the keyframe
        ff('-ss', f'{t:.6f}', '-i', a.orig, '-map', '0:v:0', '-c', 'copy', '-frames:v', str(count), out)
        return out

    pieces, plan, recut = [], [], None
    c = 0
    for S, E, d in reps:
        if c < S:
            pieces.append(copy_piece(c, S - c)); plan.append(f'copy   {c}-{S - 1}')
        pieces.append(enc_pngs(d, S, E - S + 1)); plan.append(f'edited {S}-{E}  (re-encoded from {d})')
        c = E + 1
    if c < N:
        if N in kset or N == T:
            pieces.append(copy_piece(c, N - c)); plan.append(f'copy   {c}-{N - 1}')
        else:
            kl = max(k for k in K if k < N)
            if kl > c:
                pieces.append(copy_piece(c, kl - c)); plan.append(f'copy   {c}-{kl - 1}')
            tmp = os.path.join(W_, 'tail'); os.makedirs(tmp)
            t = ceil_us(float(pkts[kl][0] * tb))
            ff('-ss', f'{t:.6f}', '-i', a.orig, '-frames:v', str(N - kl), '-start_number', str(kl), os.path.join(tmp, 'f%04d.png'))
            pieces.append(enc_pngs(tmp, kl, N - kl)); plan.append(f'recut  {kl}-{N - 1}  (cut at {N} is not a keyframe, so the last GOP is re-encoded unedited)')
            recut = (kl, N - 1, tmp)

    # part 2 video, to the original's exact geometry / fps / pix_fmt
    p2 = piece()
    ff('-i', a.part2, '-an', '-vf', P2_VF, '-c:v', 'libx264', '-profile:v', PROF,
       '-pix_fmt', PIX, '-crf', str(a.crf), '-preset', 'slow', *TAGS, '-video_track_timescale', str(TB), p2)
    pieces.append(p2)
    lst = os.path.join(W_, 'list.txt')
    open(lst, 'w').write(''.join(f"file '{p}'\n" for p in pieces))
    vid = os.path.join(W_, 'v.mp4')
    ff('-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', vid)
    D1 = N / fps_f
    P2 = float(run(['ffprobe', '-v', 'error', '-select_streams', 'v:0', '-show_entries', 'stream=duration', '-of', 'csv=p=0', p2]).stdout)

    # audio: original (cut, 30 ms fade) + part 2 audio delayed to the seam
    sr = int(au['sample_rate']) if au else 44100
    cut_audio = a.audio_cut if a.audio_cut is not None else (D1 if N < T else None)
    a1 = '[0:a:0]aresample=48000,aformat=channel_layouts=stereo'
    if cut_audio is not None:
        a1 += f',atrim=0:{cut_audio:.4f},afade=t=out:st={max(0, cut_audio - 0.03):.4f}:d=0.03'
    a1 += ',apad[a1]' if au else ''
    if not au:
        a1 = f'anullsrc=r=48000:cl=stereo,atrim=0:{D1:.4f}[a1]'
    src2 = a.audio2 or a.part2
    has2 = bool(run(['ffprobe', '-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', src2]).stdout.strip())
    a2 = ('[1:a:0]aresample=48000,aformat=channel_layouts=stereo,' if has2 else 'anullsrc=r=48000:cl=stereo,atrim=0:%.4f,' % P2) + \
         f'adelay={int(round(D1 * 1000))}|{int(round(D1 * 1000))}[a2]'
    aud = os.path.join(W_, 'a.m4a')
    ff('-i', a.orig, '-i', src2, '-filter_complex',
       f'{a1};{a2};[a1][a2]amix=inputs=2:duration=longest:normalize=0,atrim=0:{D1 + P2:.4f}[a]',
       '-map', '[a]', '-c:a', 'aac', '-b:a', '320k', '-ar', str(sr), aud)
    ff('-i', vid, '-i', aud, '-map', '0:v', '-map', '1:a', '-c', 'copy', '-movflags', '+faststart', a.out)

    # ---------------- checks
    fails = []
    err = subprocess.run(['ffmpeg', '-v', 'error', '-i', a.out, '-f', 'null', '-'], capture_output=True, text=True).stderr.strip()
    if err:
        fails.append('output does not decode cleanly: ' + err[:200])
    o, n = framemd5(a.orig, N), framemd5(a.out, N)
    changed = [i for i in range(N) if o[i] != n[i]]
    allowed = set()
    for S, E, _ in reps:
        allowed |= set(range(S, E + 1))
    if recut:
        allowed |= set(range(recut[0], recut[1] + 1))
    stray = [i for i in changed if i not in allowed]
    if stray:
        fails.append(f'{len(stray)} frames outside the edited ranges changed (first: {stray[:5]})')
    print(f'ORIGINAL FRAMES: {N - len(allowed)} of {N} stream-copied and bit-identical; {len(allowed)} re-encoded '
          f'({"; ".join(x for x in plan if not x.startswith("copy")) or "none"})')
    for S, E, d in reps + ([recut] if recut else []):
        q, qm = frames_psnr(a.out, S, E, d, W_)
        tag = 'unedited recut' if (S, E, d) == recut else 'edited'
        print(f'  frames {S}-{E} ({tag}) decode vs source: min {q if q is None else round(q, 1)} dB, mean {qm if qm is None else round(qm, 1)} dB (RGB, per frame)')
        if q is None or q < 38:
            fails.append(f'frames {S}-{E} do not match their source (min PSNR {q})')
    # part 2: the render brought to the original's geometry/colour exactly as it was encoded, then compared frame by frame
    p2ref = os.path.join(W_, 'p2ref'); os.makedirs(p2ref, exist_ok=True)
    run(['ffmpeg', '-v', 'error', '-y', '-i', a.part2, '-vf', P2_VF, '-fps_mode', 'passthrough', '-start_number', str(N), os.path.join(p2ref, 'f%04d.png')])
    n2 = len(os.listdir(p2ref))
    q2, q2m = frames_psnr(a.out, N, N + n2 - 1, p2ref, W_)
    print(f'PART 2 as joined vs your render: min {q2 if q2 is None else round(q2, 1)} dB, mean {q2m if q2m is None else round(q2m, 1)} dB ({n2} frames)')
    if q2 is None or q2 < 32:
        fails.append(f'part 2 does not match your render (min PSNR {q2})')
    if au:
        try:
            import numpy as np
            m = min(D1, cut_audio if cut_audio is not None else D1) - 0.15
            def pa(p):
                raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-t', f'{m:.3f}', '-map', '0:a:0', '-ac', '1', '-ar', '16000',
                                      '-f', 's16le', '-'], capture_output=True).stdout
                return np.frombuffer(raw, dtype=np.int16).astype(float)
            x, y = pa(a.orig), pa(a.out)
            L = min(len(x), len(y)) - 200
            best = max(10 * np.log10((x[100:L] ** 2).sum() / max(((x[100:L] - y[100 + k:L + k]) ** 2).sum(), 1)) for k in range(-40, 41, 2))
            print(f'ORIGINAL AUDIO: SNR {best:.1f} dB vs the upload ' + ('(transparent)' if best >= 20 else '(LOW, listen before shipping)'))
            if best < 20:
                fails.append(f'original audio SNR {best:.1f} dB')
        except ImportError:
            print('ORIGINAL AUDIO: numpy missing, SNR check skipped')
    total = float(run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', a.out]).stdout)
    print(f'seam at {D1:.3f}s (frame {N}); part 2 = {P2:.2f}s; total {total:.2f}s')
    shutil.rmtree(W_, ignore_errors=True)
    if fails:
        print('FAIL:\n  ' + '\n  '.join(fails)); sys.exit(4)
    print('ALL CHECKS PASSED')


if __name__ == '__main__':
    main()

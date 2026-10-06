#!/usr/bin/env bash
# join.sh <original.mp4> <part2.mp4> <out.mp4>
# Appends part 2 to the ORIGINAL without touching the original's picture.
#  - VIDEO: part 2 is encoded to the original's exact params, then both are joined by
#    stream copy, so every original frame is bit-identical (verified below).
#  - AUDIO: TikTok/IG downloads use HE-AACv2, which can't be stream-joined to anything
#    ffmpeg can encode. So the whole soundtrack is decoded and re-encoded ONCE as
#    AAC-LC 320k. No volume, timing or EQ change - the original's sound is the same
#    samples, just re-encoded (checked by SNR below).
# Part 2 must be rendered at the original's width x height.
set -euo pipefail
ORIG="$1"; P2="$2"; OUT="$3"
W=$(mktemp -d); trap 'rm -rf "$W"' EXIT
v() { ffprobe -v error -select_streams v:0 -show_entries stream="$1" -of csv=p=0 "$ORIG"; }
VC=$(v codec_name); WID=$(v width); HEI=$(v height); FPS=$(v r_frame_rate); PIX=$(v pix_fmt)
TB=$(v time_base | cut -d/ -f2); PROF=$(v profile | tr 'A-Z' 'a-z' | sed 's/constrained //')
SR=$(ffprobe -v error -select_streams a:0 -show_entries stream=sample_rate -of csv=p=0 "$ORIG" || true); SR=${SR:-44100}
[ "$VC" = "h264" ] || { echo "STOP: original video is $VC, not h264. A lossless join isn't possible; ask Noah before re-encoding the original."; exit 2; }
read P2W P2H < <(ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 "$P2" | tr ',' ' ')
[ "$P2W" = "$WID" ] && [ "$P2H" = "$HEI" ] || { echo "STOP: part 2 is ${P2W}x${P2H}, original is ${WID}x${HEI}. Render part 2 at the original's size."; exit 3; }

# 1. video: original (copied) + part 2 (encoded to match), joined by stream copy
ffmpeg -v error -y -i "$ORIG" -map 0:v:0 -c copy "$W/v1.mp4"
ffmpeg -v error -y -i "$P2" -map 0:v:0 -c:v libx264 -profile:v "${PROF:-high}" -pix_fmt "$PIX" -r "$FPS" \
  -crf 14 -preset slow -video_track_timescale "$TB" "$W/v2.mp4"
printf "file '%s'\nfile '%s'\n" "$W/v1.mp4" "$W/v2.mp4" > "$W/list.txt"
ffmpeg -v error -y -f concat -safe 0 -i "$W/list.txt" -c copy "$W/v.mp4"

# 2. audio: original's audio aligned to its video length + part 2's audio (silence if none)
D1=$(ffprobe -v error -select_streams v:0 -show_entries stream=duration -of csv=p=0 "$W/v1.mp4")
D2=$(ffprobe -v error -select_streams v:0 -show_entries stream=duration -of csv=p=0 "$W/v2.mp4")
has_a() { ffprobe -v error -select_streams a -show_entries stream=index -of csv=p=0 "$1" | grep -q .; }
A1="[0:a:0]aresample=$SR,aformat=channel_layouts=stereo,apad,atrim=0:$D1[a1]"
has_a "$ORIG" || A1="anullsrc=r=$SR:cl=stereo,atrim=0:$D1[a1]"
A2="[1:a:0]aresample=$SR,aformat=channel_layouts=stereo,apad,atrim=0:$D2[a2]"
has_a "$P2" || A2="anullsrc=r=$SR:cl=stereo,atrim=0:$D2[a2]"
ffmpeg -v error -y -i "$ORIG" -i "$P2" -filter_complex "$A1;$A2;[a1][a2]concat=n=2:v=0:a=1[a]" -map "[a]" \
  -c:a aac -b:a 320k -ar "$SR" "$W/a.m4a"

# 3. mux
ffmpeg -v error -y -i "$W/v.mp4" -i "$W/a.m4a" -map 0:v -map 1:a -c copy -shortest -movflags +faststart "$OUT"

# 4. proof
N=$(ffprobe -v error -count_packets -select_streams v:0 -show_entries stream=nb_read_packets -of csv=p=0 "$ORIG")
ffmpeg -v error -i "$ORIG" -map 0:v:0 -f framemd5 - | grep -v '^#' | awk -F, '{print $NF}' > "$W/a.md5"
ffmpeg -v error -i "$OUT" -map 0:v:0 -frames:v "$N" -f framemd5 - | grep -v '^#' | awk -F, '{print $NF}' > "$W/b.md5"
if cmp -s "$W/a.md5" "$W/b.md5"; then echo "VIDEO VERIFIED: all $N original frames bit-identical"
else echo "FAIL: original frames changed - do not ship"; exit 4; fi
if has_a "$ORIG"; then
  ffmpeg -v error -i "$ORIG" -map 0:a:0 -t "$D1" -ac 1 -ar 16000 -f s16le "$W/o.pcm"
  ffmpeg -v error -i "$OUT" -map 0:a:0 -t "$D1" -ac 1 -ar 16000 -f s16le "$W/n.pcm"
  python3 - "$W/o.pcm" "$W/n.pcm" <<'PY'
import sys, struct, math
a=open(sys.argv[1],'rb').read(); b=open(sys.argv[2],'rb').read(); n=min(len(a),len(b))//2
A=struct.unpack('<%dh'%n,a[:n*2]); B=struct.unpack('<%dh'%n,b[:n*2])
best=None
for lag in range(-64,65,1):  # tolerate encoder-delay offset
    s=e=0
    for i in range(2000, n-2000, 7):
        x=A[i]; y=B[i+lag]; s+=x*x; e+=(x-y)**2
    snr=10*math.log10(s/max(e,1)); best=max(best or -99, snr)
print(f"AUDIO CHECK: original section SNR {best:.1f} dB " + ("(transparent)" if best>=20 else "(LOW - listen before shipping)"))
PY
fi
echo "seam at ${D1}s; total $(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT")s"

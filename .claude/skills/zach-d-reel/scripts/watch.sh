#!/usr/bin/env bash
# watch.sh <video> <outdir>
# Everything needed to "watch" a video without playing it: probe, contact sheets,
# hard cuts, a strip of the last 3 seconds, the last frame as a PNG, loudness.
# Read-only on the input. Writes only into <outdir>.
set -euo pipefail
IN="$1"; OUT="$2"; mkdir -p "$OUT"
ffprobe -v error -show_entries format=duration:stream=index,codec_type,codec_name,profile,width,height,pix_fmt,r_frame_rate,sample_rate,channels \
  -of default=nw=1 "$IN" | tee "$OUT/probe.txt"
DUR=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
# 2 fps contact sheets, 40 frames (20 s) per sheet
ffmpeg -v error -y -i "$IN" -vf "fps=2,scale=180:-1,tile=8x5" "$OUT/sheet_%d.png"
# the ending, close up: last 3 s at 6 fps
START=$(python3 -c "print(max(0, $DUR - 3))")
ffmpeg -v error -y -ss "$START" -i "$IN" -vf "fps=6,scale=200:-1,tile=6x3" -frames:v 1 "$OUT/ending.png"
# the very last frame, full size (the hinge is built off this)
ffmpeg -v error -y -sseof -0.1 -i "$IN" -update 1 -frames:v 1 "$OUT/last_frame.png" || \
  ffmpeg -v error -y -sseof -0.5 -i "$IN" -update 1 "$OUT/last_frame.png"
# hard cuts
ffmpeg -i "$IN" -vf "select='gt(scene,0.3)',showinfo" -f null - 2>&1 | grep -o "pts_time:[0-9.]*" | cut -d: -f2 > "$OUT/cuts.txt" || true
# loudness of the whole thing and of the last 5 s (part 2 is mixed to match the tail)
ffmpeg -i "$IN" -af loudnorm=print_format=summary -f null - 2>&1 | grep -E "Input Integrated|Input True Peak" > "$OUT/loudness_full.txt" || true
ffmpeg -sseof -5 -i "$IN" -af loudnorm=print_format=summary -f null - 2>&1 | grep -E "Input Integrated|Input True Peak" > "$OUT/loudness_tail.txt" || true
echo "duration: $DUR"; echo "cuts: $(tr '\n' ' ' < "$OUT/cuts.txt")"
echo "tail loudness: $(tr '\n' ' ' < "$OUT/loudness_tail.txt")"
ls "$OUT"

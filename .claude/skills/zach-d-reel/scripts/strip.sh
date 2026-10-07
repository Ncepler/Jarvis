#!/usr/bin/env bash
# strip.sh <video> <start_sec> <dur_sec> <fps> <out.png> [cols=10] [crop=W:H:X:Y]
# A contact strip with each frame's timestamp burned in. Use it to find the exact frame a caption flips, a title appears,
# or a seam lands (watch.sh is for the overview, this is for pinning a time down). Read-only on the video.
set -euo pipefail
V="$1"; S="$2"; D="$3"; F="$4"; OUT="$5"; C="${6:-10}"; CROP="${7:-}"
N=$(python3 -c "import math; print(math.ceil($D*$F))"); R=$(python3 -c "import math; print(math.ceil($N/$C))")
VF="fps=$F"; [ -n "$CROP" ] && VF="$VF,crop=$CROP"
VF="$VF,scale=180:-1,drawtext=text='%{pts\:flt}':x=4:y=4:fontsize=14:fontcolor=yellow:box=1:boxcolor=black@0.5:fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf,tile=${C}x${R}"
ffmpeg -v error -y -ss "$S" -i "$V" -t "$D" -vf "$VF" -frames:v 1 "$OUT" && echo "$OUT (timestamps are seconds into the strip; add $S for video time)"

#!/usr/bin/env bash
# prep_spectacle.sh <orig.mp4> <cut_frame N> <workdir> [amber|dancers]
# Builds the work folder for the DEFAULT ending (v4): part 1's last kept frame physically moves into the Vilas spectacle (assets/hype-ending,
# opening "bridge"). Writes: a copy of the template (amber lasers, or the purple/blue/red laser-dancers preset), in/last.png = frame N-1
# (frames 0..N-1 are kept), a node_modules link for playwright. Then: edit cfg.json, put the voice in voice.wav, and run
#   python3 audio.py <LUFS of the original's tail> ; node render.mjs stills 0,6,12,18,24,40,80,120 ; node render.mjs video part2_1080.mp4
set -euo pipefail
ORIG="$1"; N="$2"; WD="$3"; STYLE="${4:-amber}"; HERE="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$WD/in"; cp -rn "$HERE/assets/hype-ending/." "$WD/" 2>/dev/null || true
if [ "$STYLE" = "dancers" ]; then
  cp "$WD/presets/locate-dancers/index.html" "$WD/comp/index.html"; cp "$WD/presets/locate-dancers/cfg.json" "$WD/presets/locate-dancers/audio.py" "$WD/"
fi
FPS=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$ORIG"); FPSN=$(python3 -c "print(round(eval('$FPS'),3))")
ffmpeg -v error -y -i "$ORIG" -vf "select=eq(n\,$((N-1))),scale=720:1280" -vframes 1 "$WD/in/last.png"
for d in "$PWD/node_modules" /home/user/Jarvis/node_modules; do [ -d "$d/playwright" ] && ln -sfn "$d" "$WD/node_modules" && break; done
[ -e "$WD/node_modules/playwright" ] || echo "NOTE: no node_modules with playwright found: run 'npm i playwright' in $WD (never 'playwright install')"
echo "prepared $WD ($STYLE): in/last.png = original frame $((N-1)); fps $FPSN"
echo "set cfg.json: \"opening\": \"bridge\", \"bridge\": {type, focus|circle|dir|impact}, fps=$FPSN, tImp1 = the move's length (0.7-1.0 s),"
echo "  caption = the original's last caption chunk + the brand, voice = the narrator's completion words. LOOK at in/last.png first."

#!/usr/bin/env bash
# prep_bridge.sh <orig.mp4> <cut_frame N> <site_clip.mp4> <workdir>
# Builds the work folder for assets/bridge: a copy of the template, in/last.png (part 1's LAST KEPT frame = frame N-1, i.e. frames 0..N-1 are kept),
# in/site/f0001.jpg... (the Vilas site clip at the original's fps), sfx/ (the licensed SFX library), node_modules link. Then edit cfg.json and run
#   python3 audio.py <LUFS> ; node render.mjs stills 0,6,12,20,40 ; node render.mjs video part2_1080.mp4
set -euo pipefail
ORIG="$1"; N="$2"; SITE="$3"; WD="$4"; HERE="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$WD/in/site"; cp -rn "$HERE/assets/bridge/." "$WD/" 2>/dev/null || true
FPS=$(ffprobe -v error -select_streams v:0 -show_entries stream=r_frame_rate -of csv=p=0 "$ORIG"); FPSN=$(python3 -c "print(round(eval('$FPS'),3))")
ffmpeg -v error -y -i "$ORIG" -vf "select=eq(n\,$((N-1))),scale=720:1280" -vframes 1 "$WD/in/last.png"
rm -f "$WD"/in/site/*.jpg; ffmpeg -v error -y -i "$SITE" -vf "fps=$FPSN,scale=720:1280" -q:v 2 "$WD/in/site/f%04d.jpg"
COUNT=$(ls "$WD/in/site" | wc -l)
python3 -I "$HERE/scripts/fetch_sound.py" --dest "$WD/sfx" | tail -1
for d in "$PWD/node_modules" /home/user/Jarvis/node_modules; do [ -d "$d" ] && ln -sfn "$d" "$WD/node_modules" && break; done
echo "prepared $WD: last frame = original frame $((N-1)); $COUNT site frames at $FPSN fps"
echo "set cfg.json: fps=$FPSN, site.count=$COUNT, transition (type/circle/focus), lines, sound.mood/seed, endCard. NEXT: look at in/last.png, measure the circle with scripts/measure_circle.py"

#!/bin/bash
cd /home/user/Jarvis/brag-output/reels
declare -A POSTER=( [autobody]=16.3 [bakery]=9.6 [landscaping]=16.3 [lawncare]=16.3 [powerwash]=16.3 [renovation]=16.3 )
declare -A COPY=(
 [autobody]="One auto body website, two prices. Flip the toggle from \$300 + \$50/mo to \$500 + \$80/mo and the garage door opens on the car. A website that looks expensive. It wasn't. vilas.studio"
 [bakery]="One bakery website, two prices. Flip the toggle from \$300 + \$50/mo to \$500 + \$80/mo and the oven fires up. A website that looks expensive. It wasn't. vilas.studio"
 [landscaping]="One landscaping website, two prices. Flip the toggle from \$300 + \$50/mo to \$500 + \$80/mo and the build site becomes the finished yard. A website that looks expensive. It wasn't. vilas.studio"
 [lawncare]="One lawn care website, two prices. Flip the toggle from \$300 + \$50/mo to \$500 + \$80/mo and the sun rises over the lawn. A website that looks expensive. It wasn't. vilas.studio"
 [powerwash]="One power washing website, two prices. Flip the toggle from \$300 + \$50/mo to \$500 + \$80/mo and the grime washes right off. A website that looks expensive. It wasn't. vilas.studio"
 [renovation]="One renovation website, two prices. Flip the toggle from \$300 + \$50/mo to \$500 + \$80/mo and the front door opens on the finished room. A website that looks expensive. It wasn't. vilas.studio"
)
for s in autobody bakery landscaping lawncare powerwash renovation; do
  echo "== $s"
  (cd $s/composition && rm -rf snapshots && npx -y hyperframes render --quality looks --output ../brag.mp4 2>&1 | tail -3)
  cd $s
  ffmpeg -loglevel error -y -ss ${POSTER[$s]} -i brag.mp4 -frames:v 1 -q:v 2 brag.jpg
  ffmpeg -loglevel error -y -i brag.mp4 -i brag.jpg -filter_complex "[0:v][1:v]overlay=0:0:enable='eq(n,0)'[v]" -map "[v]" -map 0:a? -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -c:a copy -movflags +faststart brag.poster.mp4 && mv brag.poster.mp4 brag.mp4
  echo "${COPY[$s]}" > share-copy.txt
  ffprobe -v error -show_entries format=duration -of csv=p=0 brag.mp4
  cd ..
done
echo ALLDONE

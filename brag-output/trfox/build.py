DUR = 16.3
CH = [2.0, 4.0, 6.0, 8.0, 11.49, 14.49]   # scene/label changes (beat-grid at 120 BPM)
a = []
tr = 2
def aud(id_, st, d, vol, src):
    global tr
    a.append(f'      <audio id="{id_}" data-start="{st:.2f}" data-duration="{d}" data-track-index="{tr}" data-volume="{vol}" src="{src}"></audio>\n'); tr += 1
aud("music", 0, DUR, 0.55, "assets/music/bed.mp3")
aud("open", 0.1, 0.5, 0.5, "assets/sfx/impactSoft_heavy_003.ogg")
aud("riser", 0.5, 1.5, 0.45, "assets/sfx/riser.wav")
for k, t in enumerate(CH):
    if k: aud(f"wh{k}", t - 0.45, 0.7, 0.4, "assets/sfx/whoosh.wav")
    aud(f"hit{k}", t, 0.3, 0.75, "assets/sfx/impactSoft_medium_001.ogg")
aud("sting", 14.49, 0.6, 0.6, "assets/sfx/impactSoft_heavy_003.ogg")
aud("bong", 14.6, 0.3, 0.45, "assets/sfx/bong_001.ogg")
html = f'''<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>T.R. Fox — The room builds itself</title>
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="assets/gsap.min.js"></script>
    <style>
      * {{ margin:0; padding:0; box-sizing:border-box; }}
      html, body {{ width:1080px; height:1920px; overflow:hidden; background:#0a0a0a; }}
      #root {{ position:relative; width:100%; height:100%; overflow:hidden; background:#0a0a0a; }}
      #wA, #wB {{ position:absolute; inset:0; }}
      #wB {{ opacity:0; }}
      video {{ position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }}
      #flash {{ position:absolute; inset:0; background:#fff; opacity:0; }}
      #black {{ position:absolute; inset:0; background:#0a0a0a; opacity:1; }}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="1080" data-height="1920">
      <div id="wA"><video id="vA" class="clip" data-start="0" data-duration="10.4" data-media-start="0" data-track-index="0" src="assets/video/source.mp4" muted playsinline></video></div>
      <div id="wB"><video id="vB" class="clip" data-start="10.2" data-duration="6.1" data-media-start="10.8" data-track-index="1" src="assets/video/source.mp4" muted playsinline></video></div>
      <div id="flash"></div>
      <div id="black"></div>
{''.join(a)}    </div>
    <script>
      const tl = gsap.timeline({{ paused: true }});
      tl.to("#black", {{ opacity: 0, duration: 0.35, ease: "power2.out" }}, 0);
      // hide the mid-scrub jump (src 10.4 -> 10.8) with a short crossfade; beat-grid: 10.2s
      tl.to("#wB", {{ opacity: 1, duration: 0.2, ease: "none" }}, 10.2);
      // soft light pulse on every label change, landing with the impact hit
      const CH = {CH};
      CH.forEach((t) => {{
        tl.to("#flash", {{ opacity: 0.14, duration: 0.06, ease: "power1.out" }}, t - 0.02);
        tl.to("#flash", {{ opacity: 0, duration: 0.3, ease: "power2.out" }}, t + 0.04);
      }});
      tl.to("#black", {{ opacity: 1, duration: 0.5, ease: "power2.in" }}, {DUR - 0.5});
      window.__timelines = window.__timelines || {{}};
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
'''
open('composition/index.html','w').write(html)
print("ok")

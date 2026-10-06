import math
B = 0.4994
def T(n): return round(0.5 + n*B, 3)
DUR = 16.6
COLORS = ["#8a5a2b", "#4a5d43", "#1f1a14", "#6b5a45"]
CX, CY, RX, RY = 540, 1380, 400, 170
DOOR_X, DOOR_Y = 540, 1240   # feet start (door base)
ANG0 = [90, 0, 270, 180]      # starting angle on the circle (deg), 90 = front/bottom
ENTER = [7, 8, 9, 10]         # beat index each figure steps through the door
HOP0, HOPN = 12, 16           # hop phase: 16 beats = one full lap
def pos(theta):
    r = math.radians(theta)
    x = CX + RX*math.cos(r); y = CY + RY*math.sin(r)
    s = 1.25*(0.62 + 0.38*((math.sin(r)+1)/2))
    return round(x,1), round(y,1), round(s,3), int(100 + 50*math.sin(r))

fig_svg = lambda i, col: f'''<svg viewBox="0 0 300 430" width="300" height="430" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="150" cy="422" rx="70" ry="10" fill="#1f1a14" opacity="0.14"/>
  <g id="lL{i}"><line x1="138" y1="270" x2="132" y2="410" stroke="#1f1a14" stroke-width="16" stroke-linecap="round"/><ellipse cx="124" cy="418" rx="24" ry="9" fill="#1f1a14"/></g>
  <g id="lR{i}"><line x1="162" y1="270" x2="168" y2="410" stroke="#1f1a14" stroke-width="16" stroke-linecap="round"/><ellipse cx="176" cy="418" rx="24" ry="9" fill="#1f1a14"/></g>
  <rect x="105" y="150" width="90" height="140" rx="32" fill="{col}" stroke="#1f1a14" stroke-width="8"/>
  <g id="aL{i}"><line x1="112" y1="178" x2="84" y2="272" stroke="#1f1a14" stroke-width="14" stroke-linecap="round"/><circle cx="82" cy="278" r="11" fill="#f6f1e8" stroke="#1f1a14" stroke-width="6"/></g>
  <g id="aR{i}"><line x1="188" y1="178" x2="216" y2="272" stroke="#1f1a14" stroke-width="14" stroke-linecap="round"/><circle cx="218" cy="278" r="11" fill="#f6f1e8" stroke="#1f1a14" stroke-width="6"/></g>
  <circle cx="150" cy="105" r="46" fill="#f6f1e8" stroke="#1f1a14" stroke-width="8"/>
  <circle cx="134" cy="100" r="5.5" fill="#1f1a14"/><circle cx="166" cy="100" r="5.5" fill="#1f1a14"/>
  <path d="M132 124 Q150 140 168 124" fill="none" stroke="#1f1a14" stroke-width="6" stroke-linecap="round"/>
</svg>'''

h=[]; A=h.append
A('''<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><title>toc toc</title><meta name="viewport" content="width=1080, height=1920" />
<script src="assets/gsap.min.js"></script>
<style>
@font-face{font-family:'Syne';font-style:normal;font-weight:700;src:url('assets/fonts/Syne-normal-700.ttf') format('truetype');}
@font-face{font-family:'Space Mono';font-style:normal;font-weight:700;src:url('assets/fonts/SpaceMono-normal-700.ttf') format('truetype');}
*{margin:0;padding:0;box-sizing:border-box;}
html,body{width:1080px;height:1920px;overflow:hidden;background:#efe9dd;}
#root{position:relative;width:100%;height:100%;overflow:hidden;background:#efe9dd;}
.tx{position:absolute;left:0;width:1080px;top:230px;text-align:center;font-family:'Syne',sans-serif;font-weight:700;font-size:170px;letter-spacing:-0.04em;line-height:1;color:#1f1a14;opacity:0;}
.tx em{font-style:normal;color:#8a5a2b;}
#floor{position:absolute;left:0;top:0;width:1080px;height:1920px;}
#doorway{position:absolute;left:330px;top:560px;width:420px;height:680px;border:16px solid #1f1a14;border-bottom:0;border-radius:6px 6px 0 0;background:radial-gradient(ellipse at 50% 100%,#f6e3b8 0%,#8a5a2b 55%,#1f1a14 100%);overflow:hidden;}
#door{position:absolute;inset:0;background:#8a5a2b;transform-origin:left center;border-right:6px solid #6b4520;}
#door::before{content:'';position:absolute;left:36px;top:40px;right:36px;height:210px;border:6px solid #6b4520;border-radius:6px;}
#door::after{content:'';position:absolute;left:36px;top:290px;right:36px;bottom:40px;border:6px solid #6b4520;border-radius:6px;}
#knob{position:absolute;right:30px;top:290px;width:30px;height:30px;border-radius:15px;background:#efe9dd;border:5px solid #1f1a14;z-index:2;}
#sill{position:absolute;left:300px;top:1240px;width:480px;height:16px;background:#1f1a14;border-radius:4px;}
.fig{position:absolute;left:0;top:0;width:300px;height:430px;opacity:0;transform-origin:150px 422px;}
.hp{position:absolute;inset:0;}
</style></head><body>
<div id="root" data-composition-id="main" data-start="0" data-duration="__DUR__" data-width="1080" data-height="1920">
'''.replace("__DUR__", str(DUR)))
A('<div class="tx" id="t1">toc toc</div><div class="tx" id="t2">come <em>in.</em></div><div class="tx" id="t3"><em>hop.</em></div>\n')
A(f'<svg id="floor" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg"><ellipse id="ring" cx="{CX}" cy="{CY}" rx="{RX}" ry="{RY}" fill="none" stroke="#d9d0c1" stroke-width="6" stroke-dasharray="4 18" stroke-linecap="round" opacity="0"/></svg>\n')
A('<div id="doorway"><div id="door"><div id="knob"></div></div></div><div id="sill"></div>\n')
for i,c in enumerate(COLORS):
    A(f'<div class="fig" id="f{i}"><div class="hp" id="h{i}">{fig_svg(i,c)}</div></div>\n')
# audio
aud=[]; tr=[2]
def au(id_, st, d, vol, src):
    aud.append(f'<audio id="{id_}" data-start="{st:.3f}" data-duration="{d}" data-track-index="{tr[0]}" data-volume="{vol}" src="{src}"></audio>\n'); tr[0]+=1
au("music",0,DUR,0.5,"assets/music/bed.mp3")
for k,n in enumerate([0,1,4,5]): au(f"kn{k}",T(n),0.3,0.55,"assets/sfx/knock.wav")
au("creak",T(5)+0.2,0.9,0.5,"assets/sfx/creak.wav")
au("thud",T(6),0.7,0.5,"assets/sfx/doorthud.wav")
for i,n in enumerate(ENTER): au(f"in{i}",T(n),0.3,0.3,"assets/sfx/impactSoft_medium_001.ogg")
steps=["footstep_wood_000","footstep_wood_001","footstep_wood_002","footstep_wood_003"]
for k in range(HOPN): au(f"st{k}",T(HOP0+k+1),0.3,0.55,f"assets/sfx/{steps[k%4]}.ogg")
au("fin",T(HOP0+HOPN+1),0.6,0.6,"assets/sfx/impactSoft_heavy_003.ogg")
A(''.join(aud))
A('</div>\n<script>\nconst tl = gsap.timeline({ paused: true });\nconst E = "expo.out";\n')
# light helpers
A('const pop=(sel,t,y=30)=>tl.fromTo(sel,{opacity:0,y,scale:0.9},{opacity:1,y:0,scale:1,duration:0.35,ease:E},t);\nconst off=(sel,t)=>tl.to(sel,{opacity:0,duration:0.2,ease:"power2.in"},t);\n')
# text
A(f'pop("#t1",{T(0)}); tl.to("#t1",{{scale:1.12,duration:0.08,yoyo:true,repeat:1,ease:"power1.out"}},{T(1)}); tl.to("#t1",{{scale:1.12,duration:0.08,yoyo:true,repeat:1,ease:"power1.out"}},{T(4)}); tl.to("#t1",{{scale:1.12,duration:0.08,yoyo:true,repeat:1,ease:"power1.out"}},{T(5)}); off("#t1",{T(6)});\n')
A(f'pop("#t2",{T(7)}); off("#t2",{T(11)+0.2});\n')
A(f'pop("#t3",{T(HOP0)}); \n')
A(f'tl.to("#ring",{{opacity:1,duration:0.6}},{T(10)});\n')
# door shake + open
for n in (0,1,4,5):
    A(f'tl.to("#doorway",{{x:6,duration:0.05,yoyo:true,repeat:3,ease:"none"}},{T(n)});\n')
A(f'tl.fromTo("#door",{{rotationY:0,transformPerspective:900}},{{rotationY:-100,duration:0.6,ease:"power3.out",transformPerspective:900}},{T(6)});\n')
# figures
for i in range(4):
    t0 = T(ENTER[i])
    x0,y0,s0,z0 = DOOR_X-150, DOOR_Y-422, 0.55, 20
    th = ANG0[i]
    xe,ye,se,ze = pos(th)
    X=lambda x:round(x-150,1); Y=lambda y:round(y-422,1)
    A(f'tl.fromTo("#f{i}",{{opacity:0,x:{x0},y:{y0},scale:{s0},zIndex:{z0}}},{{opacity:1,duration:0.01}},{t0});\n')
    # walk out to ring spot over two beats
    A(f'tl.to("#f{i}",{{x:{X(xe)},y:{Y(ye)},scale:{se},duration:{2*B:.3f},ease:"power1.inOut"}},{t0});\n')
    A(f'tl.set("#f{i}",{{zIndex:{ze}}},{t0+0.01:.3f});\n')
    # walking bob + leg swing
    for w in range(4):
        tw=t0+w*B/2
        A(f'tl.to("#h{i}",{{y:-16,duration:{B/4:.3f},ease:"power1.out"}},{tw:.3f}); tl.to("#h{i}",{{y:0,duration:{B/4:.3f},ease:"power1.in"}},{tw+B/4:.3f});\n')
        sg = 18 if w%2==0 else -18
        A(f'tl.to("#lL{i}",{{rotation:{sg},svgOrigin:"150 270",duration:{B/2:.3f},ease:"sine.inOut"}},{tw:.3f}); tl.to("#lR{i}",{{rotation:{-sg},svgOrigin:"150 270",duration:{B/2:.3f},ease:"sine.inOut"}},{tw:.3f});\n')
    # prepare hop pose: lift right leg
    A(f'tl.to("#lL{i}",{{rotation:0,svgOrigin:"150 270",duration:0.25}},{T(HOP0)-0.3:.3f}); tl.to("#lR{i}",{{rotation:-58,svgOrigin:"150 270",duration:0.25,ease:E}},{T(HOP0)-0.3:.3f});\n')
    # hops around the ring
    for k in range(HOPN):
        tk=T(HOP0+k)
        th0 = th + k*22.5; th1 = th + (k+1)*22.5
        xa,ya,sa,za = pos(th0); xb,yb,sb,zb = pos(th1)
        A(f'tl.to("#f{i}",{{x:{X(xb)},y:{Y(yb)},scale:{sb},duration:{B:.3f},ease:"none"}},{tk:.3f}); tl.set("#f{i}",{{zIndex:{zb}}},{tk+B/2:.3f});\n')
        A(f'tl.to("#h{i}",{{y:-115,duration:0.2,ease:"power2.out"}},{tk:.3f}); tl.to("#h{i}",{{y:0,duration:{B-0.2:.3f},ease:"power2.in"}},{tk+0.2:.3f});\n')
        side = 1 if (k+i)%2==0 else -1
        A(f'tl.to("#aL{i}",{{rotation:{-40*side},svgOrigin:"112 178",duration:0.22,ease:"sine.inOut"}},{tk:.3f}); tl.to("#aR{i}",{{rotation:{40*side},svgOrigin:"188 178",duration:0.22,ease:"sine.inOut"}},{tk:.3f});\n')
    # finish: both feet down, arms up
    tf=T(HOP0+HOPN)
    A(f'tl.to("#lR{i}",{{rotation:0,svgOrigin:"150 270",duration:0.2}},{tf:.3f}); tl.to("#aL{i}",{{rotation:150,svgOrigin:"112 178",duration:0.3,ease:E}},{tf:.3f}); tl.to("#aR{i}",{{rotation:-150,svgOrigin:"188 178",duration:0.3,ease:E}},{tf:.3f});\n')
    A(f'tl.to("#h{i}",{{y:-60,duration:0.2,ease:"power2.out"}},{tf+0.3:.3f}); tl.to("#h{i}",{{y:0,duration:0.25,ease:"power2.in"}},{tf+0.5:.3f});\n')
A('window.__timelines = window.__timelines || {}; window.__timelines["main"] = tl;\n</script></body></html>\n')
open('composition/index.html','w').write(''.join(h))
print("ok", T(0), T(6), T(HOP0), T(HOP0+HOPN))

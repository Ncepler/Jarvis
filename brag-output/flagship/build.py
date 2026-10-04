G = [
 dict(i=0, niche="Florist", brand="Wildstem Florals", still="a_florist.jpg", clip="florist.mp4", cdur=3.8, start=4.10, cvstart=8.22, vo=None),
 dict(i=1, niche="Auto body", brand="Apex Collision", still="a_autobody.jpg", clip="autobody.mp4", cdur=2.5, start=11.47, cvstart=11.47, vo="n1"),
 dict(i=2, niche="Bakery", brand="Golden Hour Bakehouse", still="a_bakery.jpg", clip="bakery.mp4", cdur=2.5, start=13.11, cvstart=13.11, vo="n2"),
 dict(i=3, niche="Landscaping", brand="Stone &amp; Sage Landscapes", still="a_landscaping.jpg", clip="landscaping.mp4", cdur=2.5, start=14.73, cvstart=14.73, vo="n3"),
 dict(i=4, niche="Power washing", brand="Tide Line Power Washing", still="a_powerwash.jpg", clip="power-washing.mp4", cdur=2.5, start=16.38, cvstart=16.38, vo="n4"),
 dict(i=5, niche="Renovation", brand="Maple &amp; Main Renovation Co.", still="a_renovation.jpg", clip="renovation.mp4", cdur=2.5, start=18.01, cvstart=18.01, vo="n5"),
]
THUMBS = ["florist","autobody","bakery","landscaping","powerwash","renovation"]
PREM = ["florist","autobody","bakery","landscaping","power-washing","renovation"]
HOOK_BEATS = [0.82,1.37,1.90,2.46,3.01,3.55]
DUR = 29.4

html = []
A = html.append
A("""<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Vilas Studio — Basic vs Premium</title>
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="assets/gsap.min.js"></script>
    <style>
      @font-face{font-family:'Inter';font-style:normal;font-weight:600;src:url('assets/fonts/Inter-normal-600.ttf') format('truetype');}
      @font-face{font-family:'Space Mono';font-style:normal;font-weight:400;src:url('assets/fonts/SpaceMono-normal-400.ttf') format('truetype');}
      @font-face{font-family:'Space Mono';font-style:normal;font-weight:700;src:url('assets/fonts/SpaceMono-normal-700.ttf') format('truetype');}
      @font-face{font-family:'Syne';font-style:normal;font-weight:700;src:url('assets/fonts/Syne-normal-700.ttf') format('truetype');}
      @font-face{font-family:'Space Grotesk';font-style:normal;font-weight:500;src:url('assets/fonts/SpaceGrotesk-normal-500.ttf') format('truetype');}
      :root { --bg:#efe9dd; --surface:#f6f1e8; --ink:#1f1a14; --muted:#4d4638; --line:#d9d0c1; --accent:#8a5a2b; }
      * { margin:0; padding:0; box-sizing:border-box; }
      html, body { width:1080px; height:1920px; overflow:hidden; background:var(--bg); }
      #root { position:relative; width:100%; height:100%; overflow:hidden; background:var(--bg); font-family:'Inter',sans-serif; color:var(--ink); }

      .syne { font-family:'Syne',sans-serif; font-weight:700; letter-spacing:-0.03em; line-height:1.04; color:var(--ink); }
      .syne em { font-style:normal; color:var(--accent); }
      .mono { font-family:'Space Mono',monospace; }
      .abs { position:absolute; left:60px; width:960px; opacity:0; }

      /* bar */
      #bar { position:absolute; left:40px; top:800px; width:1000px; height:104px; border-radius:52px; background:var(--surface); border:2px solid var(--line);
        box-shadow:0 2px 4px rgba(31,26,20,.05), 0 16px 40px -16px rgba(31,26,20,.18); display:flex; align-items:center; justify-content:space-between; padding:0 40px 0 24px; opacity:0; z-index:50; }
      #bar .brand { display:flex; align-items:center; gap:16px; }
      #bar .brand img { width:56px; height:56px; border-radius:28px; display:block; }
      #bar .brand span { font-family:'Space Grotesk',sans-serif; font-weight:500; font-size:30px; letter-spacing:-0.01em; }
      #tog { display:flex; align-items:center; gap:18px; font-family:'Space Mono',monospace; font-size:25px; }
      #lblA { font-weight:700; color:var(--ink); }
      #lblB { font-weight:400; color:var(--muted); opacity:.5; }
      #sw { position:relative; width:92px; height:50px; border-radius:25px; background:var(--bg); border:2px solid var(--line); }
      #swfill { position:absolute; inset:-2px; border-radius:25px; background:var(--ink); opacity:0; }
      #knob { position:absolute; left:5px; top:5px; width:36px; height:36px; border-radius:18px; background:var(--surface); box-shadow:0 2px 6px rgba(31,26,20,.35); }
      #cursor { position:absolute; left:0; top:0; width:64px; height:64px; border-radius:32px; border:4px solid var(--ink); background:rgba(31,26,20,.12); opacity:0; z-index:60; }

      /* hook / statement thumbs */
      .th { position:absolute; width:316px; height:200px; border-radius:16px; overflow:hidden; border:2px solid var(--line); opacity:0; }
      .th img { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; }
      .th .pi { opacity:0; }
      .th::after { content:''; position:absolute; inset:0; border-radius:14px; box-shadow:inset 0 0 0 3px transparent; }
      #thumbs, #thumbs2 { position:absolute; left:40px; top:1000px; width:1000px; height:430px; }

      /* groups */
      .grp { position:absolute; inset:0; }
      .gt { position:absolute; left:60px; top:196px; font-family:'Space Mono',monospace; font-weight:700; font-size:26px; letter-spacing:.12em; text-transform:uppercase; color:var(--accent); opacity:0; display:flex; align-items:center; gap:16px; }
      .gt i { display:block; width:44px; height:3px; background:var(--accent); }
      .pane { position:absolute; left:40px; width:1000px; height:562px; border-radius:24px; overflow:hidden; background:#14110d; }
      .pa { top:270px; border:2px solid var(--line); }
      .pb { top:984px; box-shadow:0 0 0 4px var(--accent), 0 28px 60px -24px rgba(138,90,43,.55); }
      .pane img.bg { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; display:block; }
      .vw { position:absolute; inset:0; }
      .vw video { position:absolute; inset:0; width:100%; height:100%; object-fit:cover; }
      .ptag { position:absolute; left:24px; top:24px; padding:12px 20px; border-radius:10px; background:rgba(246,241,232,.94); font-family:'Space Mono',monospace; font-weight:700; font-size:23px; letter-spacing:.06em; color:var(--ink); }
      .ptag b { color:var(--accent); font-weight:700; }
      .ph { position:absolute; inset:0; background:var(--surface); border:3px dashed var(--line); border-radius:24px; display:flex; align-items:center; justify-content:center; text-align:center; font-family:'Space Mono',monospace; font-size:30px; line-height:1.6; color:var(--ink); }
      .gcap { position:absolute; left:60px; width:960px; top:1600px; opacity:0; }
      .eyebrow { font-family:'Space Mono',monospace; font-weight:700; font-size:26px; letter-spacing:.12em; text-transform:uppercase; color:var(--accent); display:flex; align-items:center; gap:16px; margin-bottom:18px; }
      .eyebrow i { display:block; width:44px; height:3px; background:var(--accent); }
      .big { font-family:'Syne',sans-serif; font-weight:700; font-size:92px; line-height:1.02; letter-spacing:-0.035em; color:var(--ink); }
      .big em { font-style:normal; color:var(--accent); }

      /* outro */
      #outro { position:absolute; inset:0; background:var(--bg); z-index:70; }
      #outroInner { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; padding:0 60px; }
      #outro .mark { width:170px; height:170px; border-radius:85px; display:block; opacity:0; }
      #outro .word { font-family:'Space Grotesk',sans-serif; font-weight:500; font-size:84px; letter-spacing:-0.02em; margin-top:30px; opacity:0; }
      #outro .dom { font-family:'Space Mono',monospace; font-size:30px; color:var(--muted); margin-top:8px; opacity:0; }
      #outro .tl { font-family:'Syne',sans-serif; font-weight:700; font-size:88px; line-height:1.02; letter-spacing:-0.03em; margin-top:90px; }
      #outro .tl div { opacity:0; }
      #outro .tl .b { color:var(--accent); }
      #outro .prices { margin-top:90px; font-family:'Space Mono',monospace; font-size:30px; line-height:1.7; color:var(--muted); opacity:0; border-top:2px solid var(--line); padding-top:34px; width:900px; }
      #outro .prices b { color:var(--ink); }
    </style>
  </head>
  <body>
""")
A(f'    <div id="root" data-composition-id="main" data-start="0" data-duration="{DUR}" data-width="1080" data-height="1920">\n')

# hook
A('      <div class="abs syne" id="hookT" style="top:250px;font-size:84px;">Every style we build<br />comes in <em>two</em> tiers.</div>\n')
A('      <div class="abs syne" id="stateT" style="top:250px;font-size:80px;">Same build everywhere else.<br />Only the hero <em>changes.</em></div>\n')
A('      <div id="thumbs">\n')
for k,n in enumerate(THUMBS):
    A(f'        <div class="th" id="th{k}" style="left:{(k%3)*342}px;top:{(k//3)*226}px;"><img src="assets/img/t_{n}.jpg" alt="{n} basic hero" /></div>\n')
A('      </div>\n')
A('      <div id="thumbs2">\n')
for k,n in enumerate(THUMBS):
    A(f'        <div class="th" id="sh{k}" style="left:{(k%3)*342}px;top:{(k//3)*226}px;"><img src="assets/img/t_{n}.jpg" alt="{n} basic hero" /><img class="pi" id="pi{k}" src="assets/img/p_{PREM[k]}.jpg" alt="{n} premium hero" /></div>\n')
A('      </div>\n')

# groups
for g in G:
    i=g["i"]
    A(f'      <div class="grp" id="g{i}">\n')
    A(f'        <div class="gt" id="g{i}t"><i></i>{g["niche"]} · {g["brand"]}</div>\n')
    A(f'        <div class="pane pa" id="g{i}a"><img class="bg" src="assets/img/{g["still"]}" alt="{g["niche"]} basic hero still" /><div class="ptag" id="g{i}at">BASIC · <b>$300 + $50/mo</b></div></div>\n')
    A(f'        <div class="pane pb" id="g{i}b">\n')
    if i==0:
        A('          <div class="ph" id="g0ph">$500 + $80/mo<br />tap the toggle</div>\n')
    A(f'          <div class="vw" id="g{i}v"><video id="vid{i}" class="clip" data-start="{g["cvstart"]}" data-duration="{g["cdur"]}" data-track-index="{i+1}" src="assets/clips/{g["clip"]}" muted playsinline></video></div>\n')
    A(f'          <div class="ptag" id="g{i}pt">PREMIUM · <b>$500 + $80/mo</b></div>\n')
    A('        </div>\n')
    if i==0:
        A('        <div class="gcap" id="g0ca"><div class="eyebrow"><i></i>Basic · $300 + $50/mo</div><div class="big">A still hero,<br />done well.</div></div>\n')
        A('        <div class="gcap" id="g0cb"><div class="eyebrow"><i></i>Premium · $500 + $80/mo</div><div class="big">The hero <em>moves.</em></div></div>\n')
    else:
        A(f'        <div class="gcap" id="g{i}c"><div class="eyebrow"><i></i>Premium hero</div><div class="big">{g["niche"]}.</div></div>\n')
    A('      </div>\n')

# bar
A('''      <div id="bar">
        <div class="brand"><img src="assets/img/vilas-mark.png" alt="Vilas mark" /><span>Vilas Studio</span></div>
        <div id="tog"><span id="lblA">$300 + $50/mo</span><div id="sw"><div id="swfill"></div><div id="knob"></div></div><span id="lblB">$500 + $80/mo</span></div>
      </div>
      <div id="cursor"></div>
''')
# outro
A('''      <div id="outro">
        <div id="outroInner">
          <img class="mark" id="omark" src="assets/img/vilas-mark.png" alt="Vilas mark" />
          <div class="word" id="oword">Vilas Studio</div>
          <div class="dom" id="odom">vilas.studio</div>
          <div class="tl"><div id="ot1">A website that looks expensive.</div><div id="ot2" class="b">It wasn't.</div></div>
          <div class="prices" id="oprices"><b>Basic</b> — $300 + $50/month<br /><b>Premium</b> — $500 + $80/month<br /><b>Custom</b> — let's talk</div>
        </div>
      </div>
''')
# audio
aud=[("music",0,DUR,0.15,"assets/music/bed-cut.mp3"),("v1",0.4,2.26,1,"assets/vo/v1.wav"),("v2",4.45,3.69,1,"assets/vo/v2.wav"),("v3",8.45,3.22,1,"assets/vo/v3.wav"),
 ("n1",11.57,1.0,1,"assets/vo/n1.wav"),("n2",13.21,0.83,1,"assets/vo/n2.wav"),("n3",14.83,1.04,1,"assets/vo/n3.wav"),("n4",16.48,1.02,1,"assets/vo/n4.wav"),("n5",18.11,0.94,1,"assets/vo/n5.wav"),
 ("v7",19.9,3.2,1,"assets/vo/v7.wav"),("v8",24.0,3.73,1,"assets/vo/l8.wav")]
tr=2
for id_,st,d,vol,src in aud:
    A(f'      <audio id="{id_}" data-start="{st}" data-duration="{d}" data-track-index="{tr}" data-volume="{vol}" src="{src}"></audio>\n'); tr+=1
for k,t in enumerate([2.46,3.55,8.22,19.64,21.28]):
    A(f'      <audio id="clk{k}" data-start="{t}" data-duration="0.1" data-track-index="{tr}" data-volume="0.7" src="assets/sfx/click2.ogg"></audio>\n'); tr+=1
for k,g in enumerate(G):
    A(f'      <audio id="cut{k}" data-start="{g["start"]}" data-duration="0.1" data-track-index="{tr}" data-volume="0.35" src="assets/sfx/switch18.ogg"></audio>\n'); tr+=1
A(f'      <audio id="rol" data-start="24.01" data-duration="0.1" data-track-index="{tr}" data-volume="0.45" src="assets/sfx/rollover2.ogg"></audio>\n')
A('    </div>\n')

# script
js=[]
J=js.append
J('''      const EASE = "expo.out";
      const tl = gsap.timeline({ paused: true });
      const show = (sel, at, dur = 0.5, y = 24) => tl.fromTo(sel, { opacity: 0, y }, { opacity: 1, y: 0, duration: dur, ease: EASE }, at);
      const hide = (sel, at, dur = 0.3) => tl.to(sel, { opacity: 0, duration: dur, ease: "power2.in" }, at);
      const goPrem = (t) => {
        tl.to("#knob", { scaleX: 1.3, duration: 0.1, ease: "power2.in" }, t - 0.07);
        tl.to("#knob", { x: 42, duration: 0.3, ease: EASE }, t);
        tl.to("#knob", { scaleX: 1, duration: 0.25, ease: EASE }, t + 0.15);
        tl.to("#swfill", { opacity: 1, duration: 0.3 }, t);
        tl.to("#lblA", { opacity: 0.5, fontWeight: 400, color: "#4d4638", duration: 0.25 }, t);
        tl.to("#lblB", { opacity: 1, fontWeight: 700, color: "#1f1a14", duration: 0.25 }, t);
      };
      const goBasic = (t) => {
        tl.to("#knob", { scaleX: 1.3, duration: 0.1, ease: "power2.in" }, t - 0.07);
        tl.to("#knob", { x: 0, duration: 0.3, ease: EASE }, t);
        tl.to("#knob", { scaleX: 1, duration: 0.25, ease: EASE }, t + 0.15);
        tl.to("#swfill", { opacity: 0, duration: 0.3 }, t);
        tl.to("#lblA", { opacity: 1, fontWeight: 700, color: "#1f1a14", duration: 0.25 }, t);
        tl.to("#lblB", { opacity: 0.5, fontWeight: 400, color: "#4d4638", duration: 0.25 }, t);
      };

      // ── hook ──
      show("#hookT", 0.4, 0.7); hide("#hookT", 3.85, 0.3);
      tl.fromTo("#bar", { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.7, ease: EASE }, 0.2);
''')
J('      const HB = %s;\n' % HOOK_BEATS)
J('''      HB.forEach((t, k) => tl.fromTo("#th" + k, { opacity: 0, y: 50, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: EASE }, t)); // beat-grid: 0.82 1.37 1.90 2.46 3.01 3.55
      goPrem(2.46); goBasic(3.55);
      tl.to("#thumbs", { opacity: 0, y: 40, duration: 0.35, ease: "power2.in" }, 3.95);
''')
# groups
for g in G:
    i=g["i"]; s=g["start"]
    nxt = G[i+1]["start"] if i+1<len(G) else 19.64
    J(f'''      // ── group {i} ({g["niche"]}) ──
      tl.fromTo("#g{i}a", {{ x: -1100 }}, {{ x: 0, duration: 0.6, ease: EASE }}, {s});
      tl.fromTo("#g{i}b", {{ x: 1100 }}, {{ x: 0, duration: 0.6, ease: EASE }}, {s+0.07:.2f});
      show("#g{i}t", {s+0.2:.2f}, 0.5, 16);
''')
    if i==0:
        J('''      tl.to("#bar", { y: 60, duration: 0.7, ease: EASE }, 4.1);
      show("#g0ca", 4.4, 0.6); hide("#g0ca", 8.1);
      tl.fromTo("#cursor", { opacity: 0, x: 760, y: 1010 }, { opacity: 1, x: 724, y: 892, duration: 0.5, ease: "power2.out" }, 7.45);
      tl.to("#cursor", { scale: 0.8, duration: 0.12, ease: "power2.in" }, 8.1);
      tl.to("#cursor", { scale: 1, duration: 0.2, ease: EASE }, 8.24);
      tl.to("#cursor", { opacity: 0, x: 790, y: 1000, duration: 0.5, ease: "power2.in" }, 8.55);
      goPrem(8.22); // beat-locked: 8.22s
      tl.to("#g0ph", { opacity: 0, duration: 0.2 }, 8.1);
      tl.fromTo("#g0v", { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" }, 8.22);
      tl.fromTo("#g0pt", { opacity: 0 }, { opacity: 1, duration: 0.4, ease: EASE }, 8.3);
      show("#g0cb", 8.45, 0.6); hide("#g0cb", 11.3);
''')
    else:
        J(f'''      show("#g{i}c", {s+0.15:.2f}, 0.5); hide("#g{i}c", {nxt-0.05:.2f}, 0.25);
''')
    if i>0: pass
    hide_at = nxt+0.65
    J(f'      hide(["#g{i}t", "#g{i}at", "#g{i}pt"], {nxt-0.05:.2f}, 0.2);\n')
    if i == len(G)-1:
        J(f'      tl.to("#g{i}", {{ opacity: 0, duration: 0.3, ease: "power2.in" }}, {nxt:.2f});\n')
    else:
        J(f'      tl.set("#g{i}", {{ opacity: 0 }}, {hide_at:.2f});\n')
J('''      // pane A of first group must not be covered text-wise; florist group hides at next cut
      // ── statement ──
      tl.to("#bar", { y: 0, duration: 0.7, ease: EASE }, 19.64);
      goBasic(19.64);
      show("#stateT", 19.9, 0.7); hide("#stateT", 23.15, 0.3);
      const SB = [19.95, 20.1, 20.25, 20.4, 20.55, 20.7];
      SB.forEach((t, k) => tl.fromTo("#sh" + k, { opacity: 0, y: 50, scale: 0.92 }, { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: EASE }, t));
      goPrem(21.28);
      [0,1,2,3,4,5].forEach((k) => {
        tl.to("#pi" + k, { opacity: 1, duration: 0.35, ease: "power2.out" }, 21.28 + k * 0.1);
        tl.to("#sh" + k, { borderColor: "#8a5a2b", duration: 0.3 }, 21.28 + k * 0.1);
      });
      tl.to(["#thumbs2", "#bar"], { opacity: 0, duration: 0.2 }, 23.3);

      // ── outro ──
      tl.fromTo("#outro", { y: 1920 }, { y: 0, duration: 0.7, ease: "power3.inOut" }, 23.46);
      tl.fromTo("#omark", { opacity: 0, scale: 0.7 }, { opacity: 1, scale: 1, duration: 0.7, ease: EASE }, 23.9); // beat-locked: 24.01s
      tl.fromTo("#oword", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.6, ease: EASE }, 24.01);
      tl.fromTo("#odom", { opacity: 0 }, { opacity: 1, duration: 0.5 }, 24.4);
      tl.fromTo("#ot1", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: EASE }, 25.0);
      tl.fromTo("#ot2", { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.7, ease: EASE }, 26.6);
      tl.fromTo("#oprices", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.7, ease: EASE }, 27.2);
      tl.fromTo("#omark", { boxShadow: "0 0 0 0 rgba(138,90,43,0)" }, { boxShadow: "0 0 90px 20px rgba(138,90,43,.25)", duration: 0.55, ease: "sine.inOut", yoyo: true, repeat: 5, immediateRender: false }, 24.5);
      window.__timelines = window.__timelines || {};
      window.__timelines["main"] = tl;
''')
A('    <script>\n'+''.join(js)+'    </script>\n  </body>\n</html>\n')
open('composition/index.html','w').write(''.join(html))
print("ok")

import os, re, shutil, subprocess, sys, json
ROOT = "/home/user/Jarvis"
OUT = f"{ROOT}/brag-output/reels"
BASE = f"{ROOT}/brag-output/composition/assets"

NICHES = {
 "autobody": dict(label="auto body", name="Apex Collision", still=f"{ROOT}/public/demos/autobody/hero.webp", video="autobody-hero.mp4",
   tag="Collision center · Nassau County", l1="Wrecked.", l2="Like it never happened.", cta="Get a free estimate",
   accent="#2FA8FF", onaccent="#0A0C0F", em="#0b6db3", font="inter",
   vo1="One auto body website. Two prices.", vo4="Scroll, and the garage door opens on the car.", c4="Scroll, and the garage door <em>opens on the car.</em>", cap1="One auto body website.<br /><em>Two</em> prices."),
 "bakery": dict(label="bakery", name="Golden Hour Bakehouse", still=f"{ROOT}/public/previews/firstBakeryImage.webp", video="bakery-hero.mp4",
   tag="Bakery · Sayville", l1="Baked at 4am.", l2="Gone by noon.", cta="Order ahead",
   accent="#C9802F", onaccent="#1f1a14", em="#9a5a14", font="fraunces",
   vo1="One bakery website. Two prices.", vo4="Scroll, and the oven fires up. Then the whole bakehouse comes into view.", c4="Scroll, and the oven fires up. <em>The whole bakehouse</em> comes into view.", cap1="One bakery website.<br /><em>Two</em> prices."),
 "landscaping": dict(label="landscaping", name="Stone & Sage Landscapes", still=f"{ROOT}/public/demos/landscaping/hero-patio.webp", video="landscaping-hero.mp4",
   tag="Landscape design & build · North Shore", l1="Built to be lived in.", l2="Built to stay.", cta="Book a consultation",
   accent="#6E9A5C", onaccent="#0C110B", em="#47693a", font="inter",
   vo1="One landscaping website. Two prices.", vo4="Scroll, and the build site becomes the finished yard.", c4="Scroll, and the build site becomes <em>the finished yard.</em>", cap1="One landscaping website.<br /><em>Two</em> prices."),
 "lawncare": dict(label="lawn care", name="Fresh Cut Lawn Co.", still=f"{ROOT}/public/demos/lawncare/hero-lawn.webp", video="lawncare-hero.mp4",
   tag="Lawn care · Nassau County", l1="Your lawn,", l2="handled.", cta="Get a free quote",
   accent="#4E9A4A", onaccent="#FFFFFF", em="#2f6f2c", font="inter",
   vo1="One lawn care website. Two prices.", vo4="Scroll, and the sun rises over a freshly cut lawn.", c4="Scroll, and the sun rises over <em>a freshly cut lawn.</em>", cap1="One lawn care website.<br /><em>Two</em> prices."),
 "powerwash": dict(label="power washing", name="Tide Line Power Washing", still=f"{ROOT}/public/demos/powerwash/hero.webp", video="power-washing-hero.mp4",
   tag="Power washing · Suffolk County", l1="Like the day", l2="it was built.", cta="Get a free quote",
   accent="#1E86C4", onaccent="#FFFFFF", em="#12689c", font="inter",
   vo1="One power washing website. Two prices.", vo4="Scroll, and the grime washes right off the house.", c4="Scroll, and the grime <em>washes right off.</em>", cap1="One power washing website.<br /><em>Two</em> prices."),
 "renovation": dict(label="renovation", name="Maple & Main Renovation Co.", still=f"{ROOT}/public/previews/firstRenovationImage.webp", video="renovation-hero.mp4",
   tag="Renovation & remodeling · North Shore", l1="Old house.", l2="New everything.", cta="Get a free estimate",
   accent="#C8893F", onaccent="#1f1a14", em="#8f5f1f", font="inter",
   vo1="One renovation website. Two prices.", vo4="Scroll, and the front door opens on the finished room.", c4="Scroll, and the front door opens <em>on the finished room.</em>", cap1="One renovation website.<br /><em>Two</em> prices."),
}

TEMPLATE = open(f"{ROOT}/brag-output/template.html").read()

def run(cmd, **kw):
    return subprocess.run(cmd, check=True, **kw)

def dur(p):
    return float(subprocess.check_output(["ffprobe","-v","error","-show_entries","format=duration","-of","csv=p=0",p]).decode().strip())

def build(slug):
    n = NICHES[slug]
    d = f"{OUT}/{slug}/composition"
    a = f"{d}/assets"
    os.makedirs(f"{a}/vo", exist_ok=True)
    os.makedirs(f"{a}/img", exist_ok=True)
    os.makedirs(f"{a}/music", exist_ok=True)
    os.makedirs(f"{a}/sfx", exist_ok=True)
    for sub in ("fonts",):
        if not os.path.exists(f"{a}/{sub}"): shutil.copytree(f"{BASE}/{sub}", f"{a}/{sub}")
    for f in ("gsap.min.js","vilas-mark-dummy"):
        if os.path.exists(f"{BASE}/{f}"): shutil.copy(f"{BASE}/{f}", a)
    shutil.copy(f"{BASE}/img/vilas-mark.png", f"{a}/img/")
    shutil.copy(f"{BASE}/music/bed-cut.mp3", f"{a}/music/")
    for f in ("click2.ogg","rollover2.ogg"): shutil.copy(f"{BASE}/sfx/{f}", f"{a}/sfx/")
    for i in (2,3,5): shutil.copy(f"{BASE}/vo/l{i}.wav", f"{a}/vo/")
    for i, key in ((1,"vo1"),(4,"vo4")):
        w = f"{a}/vo/l{i}.wav"
        if not os.path.exists(w):
            run(["npx","-y","hyperframes","tts",n[key],"--voice","af_heart","--output",w], stdin=subprocess.DEVNULL, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    run(["ffmpeg","-loglevel","error","-y","-i",n["still"],"-vf","scale=1920:-2","-q:v","3",f"{a}/img/still.jpg"])
    src = f"{ROOT}/public/videos/{n['video']}"
    speed = dur(src)/9.0
    run(["ffmpeg","-loglevel","error","-y","-i",src,"-vf",f"setpts=PTS/{speed:.4f},fps=30,scale=1280:720,tpad=stop_mode=clone:stop_duration=1.6","-an","-c:v","libx264","-crf","20","-pix_fmt","yuv420p","-g","15",f"{a}/hero-fast.mp4"])
    fnt = {"inter":"'Inter Tight', sans-serif","fraunces":"'Fraunces', serif"}[n["font"]]
    hsize = "86px" if n["font"]=="fraunces" else "76px"
    rep = {
      "{{TITLE}}": f"Vilas × {n['name']}", "{{TAG}}": n["tag"], "{{L1}}": n["l1"], "{{L2}}": n["l2"], "{{CTA}}": n["cta"],
      "{{ACCENT}}": n["accent"], "{{ONACCENT}}": n["onaccent"], "{{EM}}": n["em"], "{{HFONT}}": fnt, "{{HSIZE}}": hsize,
      "{{CAP1}}": n["cap1"], "{{C4}}": n["c4"], "{{LABEL}}": n["label"],
      "{{D1}}": f"{dur(a+'/vo/l1.wav'):.2f}", "{{D4}}": f"{dur(a+'/vo/l4.wav'):.2f}",
    }
    html = TEMPLATE
    for k,v in rep.items(): html = html.replace(k, v)
    open(f"{d}/index.html","w").write(html)
    for f in ("hyperframes.json","meta.json","package.json"):
        if os.path.exists(f"{ROOT}/brag-output/composition/{f}"): shutil.copy(f"{ROOT}/brag-output/composition/{f}", d)
    return d

if __name__ == "__main__":
    for slug in sys.argv[1:]:
        d = build(slug)
        print("built", slug, d, flush=True)

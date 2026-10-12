#!/usr/bin/env python3
"""Find, download and LOG real sounds for a reel. Never uses anything without a licence line in sfx/LEDGER.json.

  python3 -I fetch_sound.py --dest work/bridge/sfx                       # 19 recorded SFX (whoosh x3, riser, impact-bass x2, glitch x3, chime, pop, ping, ...)
  python3 -I fetch_sound.py --dest work/bridge/sfx --query "door ding" --provider openverse --name door-ding.mp3
  python3 -I fetch_sound.py --dest work/bridge/sfx --query "whoosh" --provider freesound --name whoosh-x.mp3     # needs FREESOUND_API_KEY

Providers, in order of preference:
  bundled     The `hyperframes` npm package ships 19 real recordings from Pixabay (Pixabay Content License: commercial use, modification and use in videos
              are allowed, no attribution; you may not resell the sounds on their own). Works in the cloud session (npm registry is reachable) and offline once cached.
              THE DEFAULT. A Business Instagram account is safe with these (they are cleared for commercial use).
  openverse   api.openverse.org audio search, filtered to CC0 + public domain only. Needs an open internet (blocked in the cloud session).
  freesound   freesound.org API v2, filtered to the CC0 licence. Needs FREESOUND_API_KEY (free key) and an open internet.
Music beds: do NOT bake a commercial track into the file. Business accounts can only use cleared audio and Meta fingerprints burned-in audio anyway
(see references/sound.md). Optional extra SFX for the hype template; give Noah a music cue sheet to add in the Instagram editor.
"""
import argparse, glob, json, os, shutil, subprocess, sys, tarfile, tempfile, urllib.parse, urllib.request

ap = argparse.ArgumentParser()
ap.add_argument('--dest', required=True); ap.add_argument('--provider', default='bundled', choices=['bundled', 'openverse', 'freesound'])
ap.add_argument('--query'); ap.add_argument('--name')
a = ap.parse_args()
os.makedirs(a.dest, exist_ok=True)
LEDGER = os.path.join(a.dest, 'LEDGER.json')
ledger = json.load(open(LEDGER)) if os.path.exists(LEDGER) else []
def log(**kw): ledger.append(kw); json.dump(ledger, open(LEDGER, 'w'), indent=1)

if a.provider == 'bundled':
    src = None
    for pat in (os.path.expanduser('~/.npm/_npx/*/node_modules/hyperframes/dist/skills/media-use/audio/assets/sfx'),
                '/tmp/**/node_modules/hyperframes/dist/skills/media-use/audio/assets/sfx', os.path.expanduser('~/.agents/skills/media-use/audio/assets/sfx')):
        hits = glob.glob(pat, recursive=True)
        if hits and glob.glob(hits[0] + '/*.mp3'): src = hits[0]; break
    if not src:       # not cached: fetch the package tarball from the npm registry and take the sfx folder out of it
        tmp = tempfile.mkdtemp()
        r = subprocess.run(['npm', 'pack', 'hyperframes@latest', '--pack-destination', tmp, '--silent'], capture_output=True, text=True)
        tgz = glob.glob(os.path.join(tmp, '*.tgz'))
        if r.returncode or not tgz: sys.exit('could not fetch the hyperframes package from npm: ' + r.stderr[-300:])
        with tarfile.open(tgz[0]) as t:
            members = [mm for mm in t.getmembers() if '/skills/media-use/audio/assets/sfx/' in mm.name and mm.isfile()]
            t.extractall(tmp, members=members, filter='data') if hasattr(tarfile, 'data_filter') else t.extractall(tmp, members=members)
        hits = glob.glob(os.path.join(tmp, '**/skills/media-use/audio/assets/sfx'), recursive=True)
        if not hits: sys.exit('sfx folder not found in the hyperframes package')
        src = hits[0]
    n = 0
    for f in sorted(glob.glob(src + '/*.mp3')) + glob.glob(src + '/manifest.json') + glob.glob(src + '/CREDITS.md'):
        shutil.copy2(f, a.dest); n += f.endswith('.mp3')
    for f in glob.glob(src + '/*.mp3'):
        log(file=os.path.basename(f), license='Pixabay Content License', commercial_use=True, attribution_required=False, source='hyperframes npm package (media-use bundled SFX), from pixabay.com/sound-effects')
    print(f'{n} sounds in {a.dest} (Pixabay Content License: commercial OK, no attribution). manifest.json lists duration, energy and recommended use per file.')
    sys.exit(0)

if not a.query or not a.name: sys.exit('--query and --name are required for openverse/freesound')
out = os.path.join(a.dest, a.name)
def get(url, headers=None, binary=False):
    req = urllib.request.Request(url, headers=headers or {'User-Agent': 'zach-d-reel/1'})
    with urllib.request.urlopen(req, timeout=40) as r: return r.read() if binary else json.load(r)
try:
    if a.provider == 'openverse':
        q = urllib.parse.urlencode({'q': a.query, 'license': 'cc0,pdm', 'category': 'sound_effect', 'page_size': 5})
        res = get('https://api.openverse.org/v1/audio/?' + q)['results']
        if not res: sys.exit('no CC0/public-domain result for: ' + a.query)
        r0 = res[0]; open(out, 'wb').write(get(r0['url'], binary=True))
        log(file=a.name, license=r0.get('license', 'cc0'), license_url=r0.get('license_url'), commercial_use=True, attribution_required=False, source='openverse', title=r0.get('title'), creator=r0.get('creator'), landing=r0.get('foreign_landing_url'))
    else:
        key = os.environ.get('FREESOUND_API_KEY') or sys.exit('set FREESOUND_API_KEY (free at freesound.org/apiv2/apply)')
        q = urllib.parse.urlencode({'query': a.query, 'filter': 'license:"Creative Commons 0"', 'fields': 'id,name,previews,license,username,url', 'page_size': 5, 'token': key})
        res = get('https://freesound.org/apiv2/search/text/?' + q)['results']
        if not res: sys.exit('no CC0 result for: ' + a.query)
        r0 = res[0]; open(out, 'wb').write(get(r0['previews']['preview-hq-mp3'], binary=True))
        log(file=a.name, license='CC0', commercial_use=True, attribution_required=False, source='freesound', title=r0['name'], creator=r0['username'], landing=r0['url'])
    print('downloaded', out, '(licence logged in LEDGER.json)')
except Exception as e:
    sys.exit(f'{a.provider} failed: {e}. These hosts are blocked in the cloud session: use the bundled library there, or run this on an open internet.')

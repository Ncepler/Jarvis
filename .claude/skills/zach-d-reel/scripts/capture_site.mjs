// Capture REAL footage of the Vilas demo sites for part 2 (vertical, smooth scroll, frame-exact: every frame is a screenshot at a
// computed scroll position, so there is no jitter and no dropped frames). The demo sites are the product: use them instead of
// lasers or wireframes whenever the ending is not the laser drop.
//
//   cd <Jarvis repo> && npx next start -p 3100 &              # (after `npm run build`)
//   node <skill>/scripts/capture_site.mjs --out <skill>/assets/vilas-site [--slugs demo-barber,demo-bakery] [--seconds 4] [--fps 30] [--base http://localhost:3100]
//
// Output: <out>/<slug>.mp4 (720x1280, H.264, no audio) and <out>/index.json (slug, niche, mean colour for colour-matching a cut frame).
// Needs `playwright` resolvable from the CURRENT directory (run it from the Jarvis repo) + a Chromium + ffmpeg. The demo toolbar is hidden;
// the demo's own "DEMO BUILD" label stays (every demo is fictional and must read as a demo).
import { chromium } from 'playwright';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs'; import path from 'node:path'; import os from 'node:os';
const arg = (k, d) => { const i = process.argv.indexOf('--' + k); return i > 0 ? process.argv[i + 1] : d; };
const BASE = arg('base', 'http://localhost:3100'), OUT = path.resolve(arg('out', './vilas-site'));
const SECONDS = Number(arg('seconds', 4)), FPS = Number(arg('fps', 30)), W = 540, H = 960, DPR = 2;
const NICHE = { 'demo-barber': 'barber', 'demo-bakery': 'bakery', 'demo-florist': 'florist', 'demo-renovation': 'renovation', 'demo-landscaping': 'landscaping',
  'demo-powerwash': 'power washing', 'demo-lawncare': 'lawn care', 'demo-autobody': 'auto body', 'demo-magician': 'magician' };
const SLUGS = arg('slugs', Object.keys(NICHE).join(',')).split(',');
const chrome = process.env.CHROME || [process.env.PLAYWRIGHT_BROWSERS_PATH, '/opt/pw-browsers'].filter(Boolean)
  .flatMap((d) => fs.existsSync(d) ? fs.readdirSync(d).filter((n) => /^chromium-\d+$/.test(n)).map((n) => path.join(d, n, 'chrome-linux/chrome')) : []).find((p) => fs.existsSync(p));
fs.mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch({ ...(chrome ? { executablePath: chrome } : {}),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--autoplay-policy=no-user-gesture-required', '--hide-scrollbars'] });
const index = [];
for (const slug of SLUGS) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: DPR, isMobile: true, hasTouch: true });
  await page.goto(`${BASE}/demos/${slug}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(3500);                                        // hero media + entrance animations settle
  await page.evaluate(() => { const sw = document.getElementById('vilas-tier-switch'); let e = sw; while (e && !(e.className || '').toString().includes('sticky')) e = e.parentElement; if (e) e.style.display = 'none'; });
  const total = await page.evaluate(() => document.documentElement.scrollHeight - innerHeight);
  const travel = Math.min(total, H * 1.7);                                  // about one and a half screens of scroll
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'cap-'));
  const N = Math.round(SECONDS * FPS), hold = Math.round(0.5 * FPS);
  for (let f = 0; f < N; f++) {
    const u = Math.min(1, Math.max(0, (f - hold) / (N - hold - 1)));
    const y = travel * (u < 0.5 ? 4 * u * u * u : 1 - Math.pow(-2 * u + 2, 3) / 2);   // ease-in-out cubic
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(40);
    fs.writeFileSync(path.join(dir, `f${String(f).padStart(4, '0')}.jpg`), await page.screenshot({ type: 'jpeg', quality: 92 }));
  }
  const mp4 = path.join(OUT, `${slug}.mp4`);
  const r = spawnSync('ffmpeg', ['-y', '-v', 'error', '-framerate', String(FPS), '-i', path.join(dir, 'f%04d.jpg'), '-vf', 'scale=720:1280:flags=lanczos',
    '-c:v', 'libx264', '-crf', '22', '-preset', 'slow', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', mp4], { stdio: 'inherit' });
  if (r.status) throw new Error('ffmpeg failed for ' + slug);
  // mean colour of the first frame (for colour-matching a cut frame to a demo)
  const rgb = spawnSync('ffmpeg', ['-v', 'error', '-i', path.join(dir, 'f0000.jpg'), '-vf', 'scale=1:1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], { encoding: 'buffer' }).stdout;
  index.push({ slug, niche: NICHE[slug] || slug, file: `${slug}.mp4`, seconds: SECONDS, fps: FPS, meanRGB: [rgb[0], rgb[1], rgb[2]] });
  fs.rmSync(dir, { recursive: true, force: true }); await page.close();
  console.log('captured', slug, '→', mp4);
}
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(index, null, 1));
await browser.close();

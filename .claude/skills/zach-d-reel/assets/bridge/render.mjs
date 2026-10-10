// Render the composition (comp/index.html + cfg.json) to a video. Every frame is a pure function of its number, so this is deterministic.
//   node render.mjs stills 2,30,60        -> stills/fNNN.jpg  (look at these before rendering everything)
//   node render.mjs video part2_1080.mp4  -> 1080x1920 H.264 at cfg.fps (assemble.py scales it to the original's size)
// Needs: `playwright` resolvable from this folder (npm i playwright), a Chromium, ffmpeg. Serves this folder itself.
// Env: CHROME=/path/to/chrome  FFMPEG=ffmpeg  PORT=8931
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const [mode, arg] = process.argv.slice(2);
const HERE = new URL('.', import.meta.url).pathname, PORT = Number(process.env.PORT || 8931), FFMPEG = process.env.FFMPEG || 'ffmpeg';
const MIME = { '.html': 'text/html', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2', '.js': 'text/javascript' };
const server = http.createServer((q, r) => {
  const f = path.join(HERE, decodeURIComponent(q.url.split('?')[0]));
  if (!f.startsWith(HERE) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); }
  r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(r);
}).listen(PORT);
const chrome = process.env.CHROME || [process.env.PLAYWRIGHT_BROWSERS_PATH, '/opt/pw-browsers'].filter(Boolean)
  .flatMap((d) => fs.existsSync(d) ? fs.readdirSync(d).filter((n) => /^chromium-\d+$/.test(n)).map((n) => path.join(d, n, 'chrome-linux/chrome')) : []).find((p) => fs.existsSync(p));
const browser = await chromium.launch({ ...(chrome ? { executablePath: chrome } : {}),
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--hide-scrollbars', '--force-color-profile=srgb'] });
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('console', (m) => { if (m.type() === 'error' && !/favicon|404/.test(m.text())) console.log('console:', m.text()); });
page.on('pageerror', (e) => console.log('pageerror:', e.message));
await page.goto(`http://localhost:${PORT}/comp/index.html`, { waitUntil: 'networkidle' });
await page.evaluate(() => window.setup());
const NF = await page.evaluate(() => window.NF), FPS = await page.evaluate(() => window.CFG_FPS ?? 24);
const shot = async (f, type = 'png') => { await page.evaluate((f) => window.renderFrame(f), f); return page.screenshot({ type, ...(type === 'jpeg' ? { quality: 95 } : {}) }); };
if (mode === 'stills') {
  fs.mkdirSync(HERE + 'stills', { recursive: true });
  for (const f of arg.split(',').map(Number)) fs.writeFileSync(`${HERE}stills/f${String(f).padStart(3, '0')}.jpg`, await shot(f, 'jpeg'));
} else if (mode === 'video') {
  const ff = spawn(FFMPEG, ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '12', '-pix_fmt', 'yuv420p', '-profile:v', 'high', '-movflags', '+faststart', arg], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let f = 0; f < NF; f++) { const buf = await shot(f, 'jpeg'); if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once('drain', r)); if (f % 30 === 0) console.log('frame', f, '/', NF); }
  ff.stdin.end(); await new Promise((r) => ff.on('close', r));
}
await browser.close(); server.close();

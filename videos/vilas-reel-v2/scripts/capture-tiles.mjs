import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";

const BASE = "http://localhost:3100";
const OUT = new URL("../footage/tiles/", import.meta.url).pathname;
const MEDIA = new URL("../media/", import.meta.url).pathname;
mkdirSync(OUT, { recursive: true });

const VW = 432;
const VH = 768;
const pages = [
  ["florist", "/demos/demo-florist", 4],
  ["barber", "/demos/demo-barber", 4],
  ["bakery", "/demos/demo-bakery", 3],
  ["autobody", "/demos/demo-autobody", 2],
  ["renovation", "/demos/demo-renovation", 4],
  ["landscaping", "/demos/demo-landscaping", 4],
  ["magician", "/demos/demo-magician", 2],
];

const browser = await chromium.launch({
  executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
});
for (const [name, path, tiles] of pages) {
  const ctx = await browser.newContext({
    viewport: { width: VW, height: VH },
    deviceScaleFactor: 2.5,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "no-preference",
  });
  const page = await ctx.newPage();
  await page.goto(BASE + path, { waitUntil: "networkidle", timeout: 90000 });
  await page.evaluate(() => {
    const btn = [...document.querySelectorAll("a,button")].find((el) =>
      /start with this style/i.test(el.textContent || "")
    );
    const bar = btn?.closest(".sticky");
    if (bar) bar.style.display = "none";
  });
  await page.waitForTimeout(600);
  const files = [];
  for (let k = 0; k < tiles; k++) {
    if (k === 1) {
      // sticky header would repeat on every tile; hide it after the first
      await page.evaluate(() => {
        for (const el of document.querySelectorAll("header")) {
          const pos = getComputedStyle(el).position;
          if (pos === "sticky" || pos === "fixed") el.style.visibility = "hidden";
        }
      });
    }
    const target = k * VH;
    // real wheel scroll so Lenis + in-view reveals fire, then settle exactly on the tile
    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, VH / 8);
      await page.waitForTimeout(90);
    }
    await page.evaluate((y) => {
      window.scrollTo(0, y);
      for (const el of document.querySelectorAll("body *")) {
        const cs = getComputedStyle(el);
        if (cs.position === "fixed" && parseFloat(cs.bottom) === 0 && el.getBoundingClientRect().height < 140)
          el.style.visibility = "hidden";
      }
    }, target);
    await page.waitForTimeout(1800);
    const got = await page.evaluate(() => window.scrollY);
    if (Math.abs(got - target) > 1) console.warn(name, k, "scrollY", got, "want", target);
    const f = `${OUT}${name}-${k}.png`;
    await page.screenshot({ path: f });
    files.push(f);
  }
  const args = ["-v", "error", "-y"];
  for (const f of files) args.push("-i", f);
  args.push(
    "-filter_complex",
    files.map((_, i) => `[${i}]`).join("") + `vstack=${files.length}`,
    "-q:v",
    "2",
    `${MEDIA}${name}.jpg`
  );
  execFileSync("ffmpeg", args);
  console.log(name, files.length);
  await ctx.close();
}
await browser.close();

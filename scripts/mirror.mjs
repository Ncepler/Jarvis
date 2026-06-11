// Mirror a site's homepage into public/previews/<slug>.html so the gallery
// can iframe it from our own origin (sidesteps X-Frame-Options entirely).
//
//   node scripts/mirror.mjs <slug> <url>
//   node scripts/mirror.mjs ph-nike https://www.nike.com
//
// Or skip the script: create public/previews/<slug>.html yourself, paste the
// page's full HTML (view-source of the deployed homepage), and add
//   <base href="https://the-site.com/">
// right after <head> so styles/images/scripts still resolve.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const [slug, url] = process.argv.slice(2);
if (!slug || !url) {
  console.error("usage: node scripts/mirror.mjs <slug> <url>");
  process.exit(1);
}

const res = await fetch(url, {
  headers: {
    // some sites serve bot-wall pages to unknown agents — look like a browser
    "user-agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
    accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
    "accept-language": "en-US,en;q=0.9",
  },
  redirect: "follow",
});
if (!res.ok) {
  console.error(`${url} → ${res.status} ${res.statusText}`);
  process.exit(1);
}
let html = await res.text();

// resolve relative asset URLs against the page we actually landed on
const base = new URL(res.url);
const baseTag = `<base href="${base.origin}${base.pathname.endsWith("/") ? base.pathname : "/"}">`;
if (/<head[^>]*>/i.test(html)) {
  html = html.replace(/<head[^>]*>/i, (m) => `${m}\n${baseTag}`);
} else {
  html = `${baseTag}\n${html}`;
}

const out = path.join("public", "previews", `${slug}.html`);
await mkdir(path.dirname(out), { recursive: true });
await writeFile(out, html);
console.log(`${out} (${(html.length / 1024).toFixed(0)} kB) ← ${res.url}`);

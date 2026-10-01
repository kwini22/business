// Mirinae — statik sayt yig‘uvchi (build).
// src/ dagi ilovani har bir sahifa uchun alohida HTML faylga oldindan render qiladi,
// shunda Google har bir brend va mahsulot sahifasini to‘liq matn bilan indekslaydi.
//   node build.mjs            -> dist/
//   SITE_URL=https://mirinae.uz node build.mjs
import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import crypto from "node:crypto";
import vm from "node:vm";
import { chromium } from "playwright";

const ROOT = path.dirname(new URL(import.meta.url).pathname);
const SRC = path.join(ROOT, "src"), OUT = path.join(ROOT, "dist");
const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, "site.config.json"), "utf8"));
const SITE_URL = (process.env.SITE_URL || cfg.siteUrl).replace(/\/$/, "");
const BASE = new URL(SITE_URL).pathname.replace(/\/$/, "");
const VERIFY = process.env.GOOGLE_SITE_VERIFICATION || cfg.googleSiteVerification || "";

// --- 1. fayllarni nusxalash ---
fs.rmSync(OUT, { recursive: true, force: true });
fs.cpSync(SRC, OUT, { recursive: true, filter: s => !s.endsWith("index.html") });
const VER = crypto.createHash("sha1")
  .update(["assets/app.js", "assets/data.js", "assets/style.css"].map(f => fs.readFileSync(path.join(SRC, f))).join(""))
  .digest("hex").slice(0, 8);
let shell = fs.readFileSync(path.join(SRC, "index.html"), "utf8")
  .replaceAll("{{BASE}}", BASE).replaceAll("{{SITE_URL}}", SITE_URL).replaceAll("{{VER}}", VER);
shell = VERIFY ? shell.replaceAll("{{GOOGLE_VERIFICATION}}", VERIFY)
               : shell.replace(/<meta name="google-site-verification"[^>]*>\n/, "");

// --- 2. sahifalar ro‘yxati (data.js dan) ---
const DATA = vm.runInNewContext(fs.readFileSync(path.join(SRC, "assets/data.js"), "utf8") + ";DATA");
const pages = ["", "brendlar", "dorixona", "vitaminlar", "daiso", "hammasi",
  ...DATA.brands.filter(b => b.slug !== "daiso").map(b => "brend/" + b.slug),
  ...DATA.products.map(p => "mahsulot/" + p.slug)];
const url = (p, lang) => (lang === "ru" ? "/ru" : "") + "/" + (p ? p + "/" : "");

// --- 3. vaqtinchalik server: fayl bo‘lsa — fayl, bo‘lmasa — shell (SPA) ---
const TYPES = { ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".json": "application/json" };
const server = http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length);
  const f = path.join(OUT, p);
  if (f.startsWith(OUT) && fs.existsSync(f) && fs.statSync(f).isFile()) {
    res.writeHead(200, { "content-type": TYPES[path.extname(f)] || "application/octet-stream" });
    return res.end(fs.readFileSync(f));
  }
  res.writeHead(200, { "content-type": "text/html; charset=utf-8" }); res.end(shell);
});
await new Promise(r => server.listen(0, "127.0.0.1", r));
const ORIGIN = `http://127.0.0.1:${server.address().port}`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
await ctx.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
const page = await ctx.newPage();
page.on("pageerror", e => { console.error("JS xato:", e.message); process.exitCode = 1; });

async function render(p) {
  await page.goto(ORIGIN + BASE + p, { waitUntil: "load" });
  await page.waitForFunction(() => document.querySelector("#view").children.length > 0);
  return "<!doctype html>\n" + (await page.evaluate(() => document.documentElement.outerHTML)) + "\n";
}
function write(rel, html) {
  const f = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  fs.writeFileSync(f, html);
}

// --- 4. oldindan render ---
let n = 0;
for (const lang of ["uz", "ru"]) for (const p of pages) {
  const u = url(p, lang);
  write(path.join(u, "index.html"), await render(u)); n++;
}
write("404.html", (await render("/404/")));

// --- 5. og:image va ikonlar ---
await ctx.unroute(/fonts\.(googleapis|gstatic)\.com/); // og rasmi asl shriftlar bilan
await page.setViewportSize({ width: 1200, height: 630 });
await page.goto(ORIGIN + BASE + "/", { waitUntil: "load" });
await page.waitForFunction(() => document.querySelector(".hero"));
await page.evaluate(() => document.fonts.ready);
await page.addStyleTag({ content: ".top,.fab{display:none!important}.hero .in{padding-top:70px}" });
await page.screenshot({ path: path.join(OUT, "img/og.jpg"), type: "jpeg", quality: 85 });
const svg = fs.readFileSync(path.join(SRC, "favicon.svg"), "utf8");
for (const s of [48, 180, 192, 512]) {
  await page.setViewportSize({ width: s, height: s });
  await page.setContent(`<style>*{margin:0}svg{display:block;width:${s}px;height:${s}px}</style>${svg}`);
  await page.screenshot({ path: path.join(OUT, `img/icon-${s}.png`), omitBackground: true });
}
await browser.close(); server.close();

// --- 6. sitemap.xml, robots.txt, manifest ---
const abs = (p, lang) => SITE_URL + url(p, lang);
const today = new Date().toISOString().slice(0, 10);
const PR = Object.fromEntries(DATA.products.map(p => [p.slug, p]));
const xml = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
let sm = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n`;
for (const lang of ["uz", "ru"]) for (const p of pages) {
  const pr = p.startsWith("mahsulot/") ? PR[p.slice(9)] : null;
  const img = pr && pr.photo && DATA.photos[pr.photo] ? `\n  <image:image><image:loc>${SITE_URL}/img/${xml(DATA.photos[pr.photo])}</image:loc></image:image>` : "";
  sm += ` <url><loc>${abs(p, lang)}</loc><lastmod>${today}</lastmod>\n  <xhtml:link rel="alternate" hreflang="uz" href="${abs(p, "uz")}"/><xhtml:link rel="alternate" hreflang="ru" href="${abs(p, "ru")}"/><xhtml:link rel="alternate" hreflang="x-default" href="${abs(p, "uz")}"/>${img}</url>\n`;
}
fs.writeFileSync(path.join(OUT, "sitemap.xml"), sm + "</urlset>\n");
fs.writeFileSync(path.join(OUT, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`);
fs.writeFileSync(path.join(OUT, "site.webmanifest"), JSON.stringify({
  name: "Mirinae Beauty", short_name: "Mirinae", start_url: BASE + "/", display: "standalone",
  background_color: "#F6F3FC", theme_color: "#1B1840",
  icons: [192, 512].map(s => ({ src: `${BASE}/img/icon-${s}.png`, sizes: `${s}x${s}`, type: "image/png" }))
}, null, 1));
fs.writeFileSync(path.join(OUT, ".nojekyll"), "");
if (!BASE) fs.writeFileSync(path.join(OUT, "CNAME"), new URL(SITE_URL).hostname + "\n");
console.log(`Tayyor: ${n} sahifa -> dist/  (${SITE_URL})`);

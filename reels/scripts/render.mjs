#!/usr/bin/env node
/**
 * Local renderer: headless Chromium (Playwright) screenshots every frame of
 * src/stage.html?ep=X and pipes the PNGs into ffmpeg (libx264, 30fps, 900 frames).
 *
 *   node scripts/render.mjs --ep A            # full video  -> build/A-video.mp4 (+ frame hashes, sample PNGs)
 *   node scripts/render.mjs --ep A --preview 0,84,300   # only the listed frames -> build/preview/A/
 *   node scripts/render.mjs --cover A         # cover PNG   -> out/A-cover.png
 *   node scripts/render.mjs --inspect A       # DOM text/layout audit for validation -> build/A-inspect.json
 */
import { createRequire } from "node:module";
import { execSync, spawn } from "node:child_process";
import { createServer } from "node:http";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
function loadPlaywright() {
  try { return require("playwright"); } catch {}
  const g = execSync("npm root -g").toString().trim();
  return require(path.join(g, "playwright"));
}
const { chromium } = loadPlaywright();

const args = process.argv.slice(2);
const opt = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null; };
const FPS = 30, N = 900, W = 1080, H = 1920;

// ------------------------------------------------------------ static server
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".json": "application/json",
  ".png": "image/png", ".svg": "image/svg+xml", ".ttf": "font/ttf", ".webp": "image/webp" };
function serve() {
  return new Promise((res) => {
    const srv = createServer((req, rsp) => {
      const p = path.join(ROOT, decodeURIComponent(new URL(req.url, "http://x").pathname));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { rsp.writeHead(404); return rsp.end(); }
      rsp.writeHead(200, { "content-type": MIME[path.extname(p)] || "application/octet-stream" });
      fs.createReadStream(p).pipe(rsp);
    });
    srv.listen(0, "127.0.0.1", () => res(srv));
  });
}

async function openPage(browser, url) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
  page.on("pageerror", (e) => console.error("[pageerror]", e.message));
  await page.goto(url);
  await page.waitForFunction(() => window.__ready === true || window.__error, null, { timeout: 60000 });
  const err = await page.evaluate(() => window.__error);
  if (err) throw new Error(err);
  return page;
}
const shot1 = (page) => page.screenshot({ type: "png", clip: { x: 0, y: 0, width: W, height: H }, animations: "disabled", caret: "hide" });
/** Chrome may re-rasterise a layer a couple of frames after its opacity/geometry stops changing.
 *  Re-shoot until two consecutive captures are byte-identical so every frame is the settled state. */
async function shot(page) {
  let prev = await shot1(page);
  for (let k = 0; k < 6; k++) {
    const cur = await shot1(page);
    if (cur.equals(prev)) return cur;
    prev = cur;
  }
  return prev;
}
const md5 = (b) => createHash("md5").update(b).digest("hex");

/** frames saved as evidence: start / middle / last frame of every cut + named special frames */
function sampleFrames(data) {
  const s = new Set();
  for (const c of data.cuts) {
    s.add(c.start); s.add(c.start + Math.floor((c.end - c.start) / 2)); s.add(c.end - 1);
    for (const h of c.holds || []) { s.add(h.from); s.add(h.to - 1); }
  }
  if (data.id === "A") [257, 258, 323, 324, 329, 330, 404, 405].forEach((f) => s.add(f));
  return [...s].sort((a, b) => a - b);
}

async function renderVideo(browser, base, ep) {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, `src/data/${ep}.json`), "utf8"));
  const page = await openPage(browser, `${base}/src/stage.html?ep=${ep}`);
  const build = path.join(ROOT, "build"); fs.mkdirSync(build, { recursive: true });
  const sampleDir = path.join(ROOT, "validation/frames", ep); fs.mkdirSync(sampleDir, { recursive: true });
  const samples = new Set(sampleFrames(data));
  const outFile = path.join(build, `${ep}-video.mp4`);
  // Every declared still window (data cuts[].holds; the validator proves the source PNGs there are byte-identical)
  // starts on a forced I-frame at high quality; the remaining identical frames are coded at q=51, which x264
  // turns into pure skip copies -> the decoded frames are bit-identical (no encoder "refinement shimmer").
  const holds = data.cuts.flatMap((c) => c.holds || []);
  const zones = holds.map((h) => `${h.from},${h.from},q=6/${h.from + 1},${h.to - 1},q=51`).join("/");
  const keys = holds.map((h) => `eq(n,${h.from})`).join("+");
  const ff = spawn("ffmpeg", ["-y", "-loglevel", "error",
    "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "png", "-i", "-",
    "-frames:v", String(N),
    "-vf", "scale=in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p",
    "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-profile:v", "high", "-r", String(FPS),
    "-force_key_frames", `expr:${keys}`, "-x264-params", `keyint=300:min-keyint=30:bframes=0:zones=${zones}`,
    "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", "-color_range", "tv",
    "-movflags", "+faststart", outFile], { stdio: ["pipe", "inherit", "inherit"] });
  const hashes = [];
  const t0 = Date.now();
  for (let f = 0; f < N; f++) {
    await page.evaluate((fr) => window.renderFrame(fr), f);
    const buf = await shot(page);
    hashes.push(md5(buf));
    if (samples.has(f)) fs.writeFileSync(path.join(sampleDir, `${ep}_${String(f).padStart(3, "0")}.png`), buf);
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if (f % 150 === 0) console.log(`[${ep}] frame ${f}/${N}  ${((Date.now() - t0) / 1000).toFixed(1)}s`);
  }
  ff.stdin.end();
  await new Promise((r, j) => ff.on("close", (c) => (c === 0 ? r() : j(new Error("ffmpeg exit " + c)))));
  fs.writeFileSync(path.join(build, `${ep}-frames.json`), JSON.stringify({ ep, frames: N, md5: hashes }, null, 0));
  console.log(`[${ep}] video done in ${((Date.now() - t0) / 1000).toFixed(1)}s -> ${path.relative(ROOT, outFile)}`);
  await page.close();
}

async function preview(browser, base, ep, frames) {
  const page = await openPage(browser, `${base}/src/stage.html?ep=${ep}`);
  const dir = path.join(ROOT, "build/preview", ep); fs.mkdirSync(dir, { recursive: true });
  for (const f of frames) {
    await page.evaluate((fr) => window.renderFrame(fr), f);
    fs.writeFileSync(path.join(dir, `${ep}_${String(f).padStart(3, "0")}.png`), await shot(page));
  }
  console.log(`[${ep}] preview ${frames.length} frames -> build/preview/${ep}/`);
  await page.close();
}

async function cover(browser, base, ep) {
  const page = await openPage(browser, `${base}/src/cover.html?ep=${ep}`);
  const out = path.join(ROOT, "out"); fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, `${ep}-cover.png`), await shot(page));
  const audit = await page.evaluate(() => window.coverAudit());
  fs.mkdirSync(path.join(ROOT, "build"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, `build/${ep}-cover-audit.json`), JSON.stringify(audit, null, 1));
  console.log(`[${ep}] cover -> out/${ep}-cover.png`);
  await page.close();
}

async function inspect(browser, base, ep) {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, `src/data/${ep}.json`), "utf8"));
  const page = await openPage(browser, `${base}/src/stage.html?ep=${ep}`);
  const frames = sampleFrames(data);
  const res = { ep, layout: await page.evaluate(() => window.copyLayoutReport()), frames: [], copyStates: [] };
  for (const f of frames) res.frames.push(await page.evaluate((fr) => window.inspect(fr), f));
  for (let f = 0; f < N; f++) res.copyStates.push(await page.evaluate((fr) => window.copyStateAt(fr), f));
  res.fontCheck = await page.evaluate(() => ({
    regular: document.fonts.check('500 80px "Noto Sans KR VF"', "가"), bold: document.fonts.check('800 80px "Noto Sans KR VF"', "가"),
    loaded: [...document.fonts].filter((x) => x.status === "loaded").map((x) => x.family + " " + x.weight),
  }));
  fs.mkdirSync(path.join(ROOT, "build"), { recursive: true });
  fs.writeFileSync(path.join(ROOT, `build/${ep}-inspect.json`), JSON.stringify(res, null, 1));
  console.log(`[${ep}] inspect ${frames.length} frames -> build/${ep}-inspect.json`);
  await page.close();
}

const srv = await serve();
const base = `http://127.0.0.1:${srv.address().port}`;
const browser = await chromium.launch({ args: ["--font-render-hinting=none", "--disable-lcd-text", "--force-color-profile=srgb"] });
try {
  if (opt("--cover")) for (const ep of opt("--cover").split(",")) await cover(browser, base, ep);
  else if (opt("--inspect")) for (const ep of opt("--inspect").split(",")) await inspect(browser, base, ep);
  else if (opt("--preview")) {
    const frames = opt("--preview").split(",").map(Number);
    for (const ep of (opt("--ep") || "A").split(",")) await preview(browser, base, ep, frames);
  } else {
    const eps = (opt("--ep") || "A,B,C").split(",");
    await Promise.all(eps.map((ep) => renderVideo(browser, base, ep)));
  }
} finally {
  await browser.close();
  srv.close();
}

#!/usr/bin/env node
/**
 * Procedural audio: every sample is computed here from sine/noise math.
 * No external samples, loops or generated-by-service audio are used.
 * Each episode gets its own BGM (key, tempo, instrument) and its own SFX timbre.
 *
 *   node scripts/audio.mjs            -> build/audio/{A,B,C}-{bgm,bgm_noduck,sfx,mix}.wav + build/audio/cues.json
 *
 * Mix rules taken from data/X.json:
 *   music.duck        [[start, end, dB]]  BGM gain vs. its own reference level (fully ducked AT start, released AT end)
 *   music.rhythmReturn  drums drop out at the first duck and return at this time ("음악 리듬 회복")
 *   music.fade        [29.4, 30.0] BGM fade out (the only change allowed inside the 4s CTA hold)
 *   cuts[].sfx        {t, id}  one-shot effects (id "music" = a BGM event, not an effect)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SR = 48000, DUR = 30, N = SR * DUR;
const OUT = path.join(ROOT, "build/audio");
fs.mkdirSync(OUT, { recursive: true });

// deterministic noise
function rng(seed) { let s = seed >>> 0; return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296 * 2 - 1; }; }
const TAU = Math.PI * 2;
const mtof = (m) => 440 * Math.pow(2, (m - 69) / 12);
const db = (x) => Math.pow(10, x / 20);

class Buf {
  constructor() { this.L = new Float32Array(N); this.R = new Float32Array(N); }
  add(i, v, pan = 0) { if (i < 0 || i >= N) return; this.L[i] += v * Math.cos((pan + 1) * Math.PI / 4); this.R[i] += v * Math.sin((pan + 1) * Math.PI / 4); }
}

// ------------------------------------------------------------------ voices
/** plucked mallet (marimba-ish): fundamental + 4th harmonic, fast decay */
function mallet(b, t, f, amp, pan, decay = 0.35) {
  const i0 = Math.round(t * SR), len = Math.round(decay * 5 * SR);
  for (let k = 0; k < len; k++) {
    const x = k / SR, env = Math.min(1, x / 0.002) * Math.exp(-x / decay);
    b.add(i0 + k, amp * env * (Math.sin(TAU * f * x) + 0.25 * Math.sin(TAU * f * 4 * x) * Math.exp(-x / 0.05)), pan);
  }
}
/** FM bell / e-piano */
function fmBell(b, t, f, amp, pan, decay = 0.9, ratio = 2, index = 1.6) {
  const i0 = Math.round(t * SR), len = Math.round(decay * 5 * SR);
  for (let k = 0; k < len; k++) {
    const x = k / SR, env = Math.min(1, x / 0.004) * Math.exp(-x / decay);
    const mod = index * Math.exp(-x / (decay * 0.5)) * Math.sin(TAU * f * ratio * x);
    b.add(i0 + k, amp * env * Math.sin(TAU * f * x + mod), pan);
  }
}
/** soft pad chord: a few detuned sines with slow attack/release */
function pad(b, t0, t1, freqs, amp, bright = 0.2) {
  const i0 = Math.round(t0 * SR), i1 = Math.round(t1 * SR), att = 0.35, rel = 0.45;
  for (let i = i0; i < Math.min(N, i1 + rel * SR); i++) {
    const x = (i - i0) / SR, tEnd = (i1 - i0) / SR;
    const env = Math.min(1, x / att) * (x > tEnd ? Math.max(0, 1 - (x - tEnd) / rel) : 1);
    let l = 0, r = 0;
    for (const f of freqs) {
      l += Math.sin(TAU * f * 0.998 * x) + bright * Math.sin(TAU * f * 2 * x);
      r += Math.sin(TAU * f * 1.002 * x) + bright * Math.sin(TAU * f * 2.003 * x);
    }
    b.L[i] += amp * env * l / freqs.length; b.R[i] += amp * env * r / freqs.length;
  }
}
function bass(b, t, f, amp, len) {
  const i0 = Math.round(t * SR), n = Math.round(len * SR);
  for (let k = 0; k < n; k++) {
    const x = k / SR, env = Math.min(1, x / 0.01) * Math.min(1, (len - x) / 0.05) * Math.exp(-x / (len * 1.5));
    b.add(i0 + k, amp * env * (Math.sin(TAU * f * x) + 0.15 * Math.sin(TAU * f * 2 * x)), 0);
  }
}
function kick(b, t, amp) {
  const i0 = Math.round(t * SR);
  let ph = 0;
  for (let k = 0; k < 0.25 * SR; k++) {
    const x = k / SR, f = 50 + 70 * Math.exp(-x / 0.03);
    ph += TAU * f / SR;
    b.add(i0 + k, amp * Math.exp(-x / 0.09) * Math.sin(ph), 0);
  }
}
function noiseHit(b, t, amp, len, pan, seed, hp = 0.6) {
  const n = rng(seed), i0 = Math.round(t * SR);
  let prev = 0;
  for (let k = 0; k < len * SR; k++) {
    const x = k / SR, v = n(); const h = v - prev * hp; prev = v;
    b.add(i0 + k, amp * Math.exp(-x / (len / 4)) * h, pan);
  }
}

// ------------------------------------------------------------------ BGM per episode
const STYLE = {
  // A: playful wooden mallets, 100 BPM, F major — "writing desk"
  A: { bpm: 100, chords: [[53, 57, 60, 65], [50, 53, 57, 62], [46, 50, 53, 58], [48, 52, 55, 60]], lead: "mallet", padAmp: 0.05, seed: 11 },
  // B: warm e-piano + pulse bass, 92 BPM, G major — "journey home"
  B: { bpm: 92, chords: [[55, 59, 62, 67], [52, 55, 59, 64], [48, 52, 55, 60], [50, 54, 57, 62]], lead: "epiano", padAmp: 0.09, seed: 23 },
  // C: glassy bells, 84 BPM, D major — "calm check"
  C: { bpm: 84, chords: [[50, 54, 57, 62], [47, 50, 54, 59], [43, 47, 50, 55], [45, 49, 52, 57]], lead: "bell", padAmp: 0.07, seed: 37 },
};

function makeBGM(ep, music) {
  const st = STYLE[ep], b = new Buf();
  const beat = 60 / st.bpm, bar = beat * 4;
  const duckStart = music.duck[0][0];
  const drums = (t) => t < duckStart - 0.01 || t >= music.rhythmReturn - 0.01;
  const r = rng(st.seed);
  for (let barI = 0; barI * bar < DUR; barI++) {
    const t0 = barI * bar, ch = st.chords[barI % 4], root = ch[0];
    pad(b, t0, t0 + bar, ch.map((m) => mtof(m)), st.padAmp, ep === "B" ? 0.35 : 0.15);
    for (let s = 0; s < 8; s++) {                       // eighth-note grid
      const t = t0 + s * beat / 2;
      if (t >= DUR) break;
      // lead arpeggio (different figure per episode)
      if (ep === "A") {
        const pat = [0, 2, 1, 3, 2, 1, 3, 2];
        mallet(b, t, mtof(ch[pat[s]] + 12), 0.11 * (s % 2 ? 0.75 : 1), s % 2 ? 0.35 : -0.35, 0.22);
      } else if (ep === "B") {
        if (s % 2 === 0) fmBell(b, t, mtof(ch[[1, 2, 3, 2][s / 2]] + 12), 0.075, (s / 2 - 1.5) * 0.25, 0.55, 1, 0.9);
      } else {
        if ([0, 3, 6].includes(s)) fmBell(b, t, mtof(ch[[3, 2, 1][[0, 3, 6].indexOf(s)]] + 24), 0.06, [-0.4, 0.4, 0][[0, 3, 6].indexOf(s)], 1.2, 3.5, 1.2);
      }
      // bass
      if (ep === "B" && s % 2 === 0) bass(b, t, mtof(root - 12), 0.16, beat * 0.45);
      if (ep !== "B" && s === 0) bass(b, t, mtof(root - 12), 0.13, bar * 0.9);
      // drums (absent during the duck .. rhythm return section)
      if (drums(t)) {
        if (ep === "A") { if (s % 4 === 0) kick(b, t, 0.22); noiseHit(b, t + 0.004, s % 2 ? 0.02 : 0.035, 0.05, 0.3, 1000 + barI * 8 + s, 0.9); }
        if (ep === "B") { if (s === 0 || s === 5) kick(b, t, 0.24); if (s === 4) noiseHit(b, t, 0.07, 0.16, 0, 2000 + barI, 0.4); noiseHit(b, t, 0.018, 0.04, -0.2, 3000 + barI * 8 + s, 0.95); }
        if (ep === "C") { if (s === 0) kick(b, t, 0.16); if (s === 4) noiseHit(b, t, 0.03, 0.06, 0.25, 4000 + barI, 0.98); }
      }
    }
    void r;
  }
  return b;
}

/** BGM automation: duck windows + end fade (stem gain only) */
function bgmGain(t, music) {
  let g = 1;
  for (const [a, e, d] of music.duck) {
    const ramp = 0.08, full = db(d);
    if (t >= a - ramp && t < a) g *= 1 + (full - 1) * ((t - (a - ramp)) / ramp);
    else if (t >= a && t < e) g *= full;
    else if (t >= e && t < e + ramp) g *= full + (1 - full) * ((t - e) / ramp);
  }
  const [f0, f1] = music.fade;
  if (t >= f0) g *= Math.max(0, 1 - (t - f0) / (f1 - f0));
  return g;
}

// ------------------------------------------------------------------ SFX per episode
// Same cue names, different timbre families: A = wood/pencil/paper, B = air/whoosh/broadcast blips, C = glass/bells/cards.
function sfx(b, ep, id, t) {
  const seed = Math.round(t * 1000) + id.length * 7;
  const W = { A: "wood", B: "air", C: "glass" }[ep];
  const tone = (f, a, d, pan = 0) => (W === "wood" ? mallet(b, t, f, a, pan, d) : W === "air" ? fmBell(b, t, f, a, pan, d, 1, 0.6) : fmBell(b, t, f, a, pan, d, 3.5, 1.4));
  const sweep = (f0, f1, len, a, noisy) => {   // pitch/noise sweep (move/zoom)
    const n = rng(seed), i0 = Math.round(t * SR); let ph = 0, lp = 0;
    for (let k = 0; k < len * SR; k++) {
      const x = k / SR, u = x / len, f = f0 * Math.pow(f1 / f0, u), env = Math.sin(Math.PI * u) ** 2;
      ph += TAU * f / SR;
      lp += (n() - lp) * Math.min(1, f / 6000);
      b.add(i0 + k, a * env * (noisy * lp * 3 + (1 - noisy) * Math.sin(ph)), (u - 0.5) * 0.8);
    }
  };
  const scratch = (len, a, rate = 38) => {      // pencil on paper
    const n = rng(seed), i0 = Math.round(t * SR); let prev = 0;
    for (let k = 0; k < len * SR; k++) {
      const x = k / SR, v = n(), h = v - prev; prev = v;
      const g = 0.55 + 0.45 * Math.sin(TAU * rate * x) * Math.sin(TAU * 3.1 * x);
      b.add(i0 + k, a * h * g * Math.min(1, x / 0.01) * Math.min(1, (len - x) / 0.04), 0.15);
    }
  };
  switch (id) {
    case "tick_low": tone(mtof(57), 0.32, 0.09); break;
    case "tick_double": tone(mtof(55), 0.3, 0.08); fmBell(b, t + 0.16, mtof(55), 0.26, 0, 0.08, 1, 0.6); break;
    case "key_click": noiseHit(b, t, 0.22, 0.03, 0, seed, 0.95); tone(mtof(84), 0.08, 0.02); break;
    case "move_short": sweep(W === "air" ? 300 : 500, W === "air" ? 1400 : 900, 0.38, 0.11, W === "glass" ? 0.3 : 0.8); break;
    case "zoom_short": sweep(220, 1800, 0.42, 0.12, W === "air" ? 0.85 : 0.5); break;
    case "pen_light": scratch(0.42, 0.11); break;
    case "write_small": scratch(0.3, 0.09, 30); break;
    case "pen_check": scratch(0.14, 0.12); fmBell(b, t + 0.15, mtof(81), 0.14, 0.2, 0.22, 2, 0.8); break;
    case "tap": case "tap_small": tone(mtof(id === "tap" ? 76 : 79), id === "tap" ? 0.22 : 0.16, 0.07); noiseHit(b, t, 0.08, 0.02, 0, seed, 0.9); break;
    case "paper_move": sweep(800, 2400, 0.32, 0.09, 1); break;
    case "page_turn": sweep(600, 3200, 0.36, 0.1, 1); noiseHit(b, t + 0.25, 0.06, 0.05, 0.3, seed + 1, 0.7); break;
    case "settle": tone(mtof(50), 0.3, 0.14); kick(b, t, 0.1); break;
    case "live_blip": fmBell(b, t, mtof(88), 0.13, 0, 0.12, 1, 0.3); fmBell(b, t + 0.09, mtof(93), 0.13, 0, 0.18, 1, 0.3); break;
    case "complete_soft": tone(mtof(72), 0.17, 0.5, -0.2); tone(mtof(79), 0.14, 0.6, 0.2); break;
    case "accent_soft": tone(mtof(74), 0.15, 0.5); tone(mtof(81), 0.1, 0.6); break;
    case "confirm": tone(mtof(76), 0.16, 0.35, -0.2); setTimeout0(() => tone(mtof(83), 0.16, 0.5, 0.2)); break;
    case "check_short": fmBell(b, t, mtof(79), 0.16, 0, 0.12, 2, 1); fmBell(b, t + 0.07, mtof(86), 0.15, 0, 0.2, 2, 1); break;
    case "unfold": sweep(400, 1600, 0.5, 0.09, 0.6); break;
    case "focus_low": fmBell(b, t, mtof(45), 0.2, 0, 0.6, 1, 0.4); break;
    default: throw new Error("unknown sfx " + id);
  }
  function setTimeout0(fn) { const t0 = t; t = t0 + 0.13; fn(); t = t0; }
}

// ------------------------------------------------------------------ write
function writeWav(file, L, R) {
  const buf = Buffer.alloc(44 + N * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVE", 8); buf.write("fmt ", 12);
  buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22); buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34); buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) {
    buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(L[i] * 32767))), 44 + i * 4);
    buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(R[i] * 32767))), 46 + i * 4);
  }
  fs.writeFileSync(file, buf);
}

const cues = {};
for (const ep of ["A", "B", "C"]) {
  const data = JSON.parse(fs.readFileSync(path.join(ROOT, `src/data/${ep}.json`), "utf8"));
  const music = data.music;
  const raw = makeBGM(ep, music);
  const bgm = new Buf(), fx = new Buf(), mix = new Buf();
  for (let i = 0; i < N; i++) { const g = bgmGain(i / SR, music); bgm.L[i] = raw.L[i] * g; bgm.R[i] = raw.R[i] * g; }
  // the reference (un-ducked, un-faded) stem, used only to verify the automation
  cues[ep] = { bpm: STYLE[ep].bpm, music, sfx: [] };
  for (const c of data.cuts) for (const s of c.sfx) {
    if (s.id === "music") continue;
    sfx(fx, ep, s.id, s.t);
    cues[ep].sfx.push({ cut: c.id, t: s.t, frame: Math.round(s.t * 30), id: s.id, cue: s.cue });
  }
  // CTA rule: nothing new may start after 26.0s except the 26.0s confirm cue; sfx tails fade with the music
  for (let i = 0; i < N; i++) {
    const t = i / SR, f = t >= music.fade[0] ? Math.max(0, 1 - (t - music.fade[0]) / (music.fade[1] - music.fade[0])) : 1;
    mix.L[i] = Math.tanh((bgm.L[i] + fx.L[i] * f) * 1.0);
    mix.R[i] = Math.tanh((bgm.R[i] + fx.R[i] * f) * 1.0);
  }
  writeWav(path.join(OUT, `${ep}-bgm.wav`), bgm.L, bgm.R);
  writeWav(path.join(OUT, `${ep}-bgm_noduck.wav`), raw.L, raw.R);
  writeWav(path.join(OUT, `${ep}-sfx.wav`), fx.L, fx.R);
  writeWav(path.join(OUT, `${ep}-mix_raw.wav`), mix.L, mix.R);
  console.log(`[${ep}] audio stems written (${cues[ep].sfx.length} sfx)`);
}
fs.writeFileSync(path.join(OUT, "cues.json"), JSON.stringify(cues, null, 1));

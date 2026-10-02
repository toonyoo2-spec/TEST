/* Shared components: tablet frame (with the sanitized real home capture),
 * line icons, 보조 labels and the common CTA master (identical in A/B/C). */
(function () {
  const { mk, svg, place, op, tf, lerp } = window.ENG;
  const SRC_W = 2000, SRC_H = 1245;                 // real home capture size
  const HOME = "../assets/derived/home_sanitized.png";
  const C = { bg: "#0e1013", ink: "#ffffff", ink2: "#9aa3ae", line: "#2b3139", line2: "#5d6672", accent: "#c6f25e", accentInk: "#0e1013", soft: "#252f17", paper: "#191d23" };

  // ----------------------------------------------------------------- tablet
  const bezelOf = (w) => Math.max(5, w * 0.02);
  /** tablet outer rect for a given width (screen keeps the capture's 2000:1245 ratio) */
  function tabletRect(x, y, w) {
    const b = bezelOf(w);
    return { x, y, w, h: (w - 2 * b) * (SRC_H / SRC_W) + 2 * b };
  }
  class Tablet {
    constructor(parent, withHome = true) {
      this.el = mk("div", "tablet", parent);
      this.scr = mk("div", "screen", this.el);
      if (withHome) { this.img = mk("img", "", this.scr); this.img.src = HOME; }
      this.r = { x: 0, y: 0, w: 100, h: 60 };
    }
    set(r, o = 1, imgO = 1) {
      this.r = r;
      const b = bezelOf(r.w);
      place(this.el, r);
      this.el.style.borderRadius = r.w * 0.045 + "px";
      place(this.scr, { x: b, y: b, w: r.w - 2 * b, h: r.h - 2 * b });
      this.scr.style.borderRadius = r.w * 0.028 + "px";
      if (this.img) op(this.img, imgO);
      op(this.el, o);
    }
    /** stage coordinates of a rectangle given in capture pixels */
    map(sx0, sy0, sx1, sy1) {
      const r = this.r, b = bezelOf(r.w);
      const kx = (r.w - 2 * b) / SRC_W, ky = (r.h - 2 * b) / SRC_H;
      return { x: r.x + b + sx0 * kx, y: r.y + b + sy0 * ky, w: (sx1 - sx0) * kx, h: (sy1 - sy0) * ky };
    }
  }
  // capture-pixel boxes of the elements used by the cuts (see scripts/prepare_ui_assets.py)
  const UI = {
    gvWritingTab: [268, 1124, 452, 1245],
    myPageTab: [1772, 1124, 1910, 1245],
    timetableBtn: [1776, 136, 1928, 204],
    liveCard: [1253, 639, 1832, 1067],
  };

  // ------------------------------------------------------------------ icons
  const ICON = {
    pencil: (body = C.accent) => `<svg viewBox="0 0 100 100" width="100%" height="100%"><g transform="rotate(-45 50 50)">
      <rect x="22" y="39" width="58" height="22" rx="3" fill="${body}"/>
      <rect x="80" y="39" width="12" height="22" rx="4" fill="${C.ink}"/>
      <polygon points="22,39 22,61 5,50" fill="#e4e8ed"/>
      <polygon points="11,46.3 11,53.7 5,50" fill="${C.accentInk}"/></g></svg>`,
    bubble: (stroke = C.accent) => `<svg viewBox="0 0 100 100" width="100%" height="100%">
      <path d="M20 16 H80 A12 12 0 0 1 92 28 V58 A12 12 0 0 1 80 70 H46 L28 86 V70 H20 A12 12 0 0 1 8 58 V28 A12 12 0 0 1 20 16 Z"
        fill="${C.soft}" stroke="${stroke}" stroke-width="6" stroke-linejoin="round"/>
      <circle cx="32" cy="43" r="5.5" fill="${stroke}"/><circle cx="50" cy="43" r="5.5" fill="${stroke}"/><circle cx="68" cy="43" r="5.5" fill="${stroke}"/></svg>`,
    doc: (stroke = C.ink) => `<svg viewBox="0 0 100 124" width="100%" height="100%">
      <path d="M12 6 H66 L92 32 V118 H12 Z" fill="${C.paper}" stroke="${stroke}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M66 6 V32 H92" fill="none" stroke="${stroke}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M28 56 H76 M28 74 H76 M28 92 H58" stroke="${C.line2}" stroke-width="7" stroke-linecap="round"/></svg>`,
    pin: (fill = C.accent) => `<svg viewBox="0 0 100 130" width="100%" height="100%">
      <path d="M50 124 C50 124 12 78 12 48 A38 38 0 0 1 88 48 C88 78 50 124 50 124 Z" fill="${fill}"/>
      <circle cx="50" cy="48" r="15" fill="${C.bg}"/></svg>`,
    play: (fill = C.accent) => `<svg viewBox="0 0 100 100" width="100%" height="100%"><path d="M34 22 L80 50 L34 78 Z" fill="${fill}" stroke="${fill}" stroke-width="6" stroke-linejoin="round"/></svg>`,
  };
  function icon(name, parent, arg) {
    const d = mk("div", "abs", parent, ICON[name](arg));
    d.dataset.icon = name;
    return d;
  }
  /** pencil tip position helper (tip of the 100x100 pencil icon sits at 19%,81%) */
  function placePencil(el, tipX, tipY, size) {
    place(el, { x: tipX - 0.19 * size, y: tipY - 0.81 * size, w: size, h: size });
  }

  // ------------------------------------------------------------ text labels
  function sub(text, parent, cls = "sub") {
    const d = mk("div", cls, parent);
    d.textContent = text;
    d.dataset.text = text; d.dataset.role = "sub";
    return d;
  }
  function tag(text, parent, accent = false) {
    const d = sub(text, parent, accent ? "tag accent" : "tag");
    return d;
  }
  /** image crop of a real UI element; the visible UI string is recorded for validation */
  function crop(src, parent, uiText) {
    const box = mk("div", "crop", parent);
    const im = mk("img", "", box);
    im.src = src;
    if (uiText) { box.dataset.text = uiText; box.dataset.role = "sub"; box.dataset.src = "ui-crop"; }
    box.img = im;
    return box;
  }
  function setCrop(box, r, o = 1, inset = 0) {
    place(box, r);
    place(box.img, { x: inset, y: inset, w: r.w - 6 - 2 * inset, h: r.h - 6 - 2 * inset });
    op(box, o);
  }

  // ---------------------------------------------------------------- svg path
  function strokePath(parent, d, color, width, extra = {}) {
    return svg("path", Object.assign({ d, fill: "none", stroke: color, "stroke-width": width,
      "stroke-linecap": "round", "stroke-linejoin": "round", pathLength: 1, "stroke-dasharray": "1 1" }, extra), parent);
  }
  function drawPath(p, t, o = 1) {
    p.setAttribute("stroke-dashoffset", (1 - t).toFixed(4));
    p.style.opacity = o;
    p.style.visibility = o <= 0.001 || t <= 0 ? "hidden" : "visible";
  }
  const bez = (p0, p1, p2, p3, t) => {
    const u = 1 - t;
    return {
      x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
      y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y,
    };
  };

  // ------------------------------------------------------------------ wipes
  // A lime slab sweeps diagonally BEHIND the scene and copy at every cut change (not into the CTA,
  // never inside a hold): only inside each cut's 0.2s entry window [start, start+6). Pure decoration, no text.
  const WIPE = { events: [] };
  function buildWipe(data) {
    WIPE.el = mk("div", "abs");
    WIPE.el.style.cssText += `width:2200px;height:300px;background:${C.accent};z-index:0`;
    const cta = data.cuts[data.cuts.length - 1].start;
    WIPE.events = data.cuts.slice(1).map((c) => c.start).filter((s) => s < cta);
  }
  function frameWipe(f) {
    const s = WIPE.events.find((e) => f >= e && f < e + 6);
    if (s == null) { op(WIPE.el, 0); return; }
    const t = (f - s + 0.5) / 6;                        // 0..1 across 6 frames
    const y = lerp(2250, -700, t);
    place(WIPE.el, { x: -560, y });
    WIPE.el.style.transformOrigin = "50% 50%";
    tf(WIPE.el, "rotate(-14deg)");
    op(WIPE.el, 1);
  }
  /** overshoot ease for scene "pops" */
  const back = (t, k = 1.9) => (t <= 0 ? 0 : t >= 1 ? 1 : 1 + (k + 1) * Math.pow(t - 1, 3) + k * Math.pow(t - 1, 2));

  // -------------------------------------------------------------------- CTA
  // Common CTA master (A11 = B11 = C11): copy from data + one small sanitized home crop.
  // Fully static from its first frame (780) to 899.
  const CTA = { start: 780 };
  function buildCTA(data) {
    const cut = data.cuts[data.cuts.length - 1];
    CTA.start = cut.start;
    CTA.root = mk("div", "layer");
    CTA.tab = new Tablet(CTA.root, true);
    CTA.tab.set(tabletRect(90, 700, 600));
    op(CTA.root, 0);
  }
  function frameCTA(f) { op(CTA.root, f >= CTA.start ? 1 : 0); }

  window.COMMON = { buildWipe, frameWipe, back, C, Tablet, tabletRect, bezelOf, UI, icon, placePencil, sub, tag, crop, setCrop, strokePath, drawPath, bez, buildCTA, frameCTA, HOME };
})();

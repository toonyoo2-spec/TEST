/* Frame-deterministic motion engine.
 * Every visual state is a pure function of the frame number f (0..899, 30fps).
 * No CSS transitions / animations / timers are used, so a screenshot of
 * renderFrame(f) is the exact frame f. */
(function () {
  const FPS = 30, W = 1080, H = 1920;
  const X0 = 80, X1 = 1000;              // kinetic copy measure (wider than the brief's 90~900 suggestion; above the Reels side buttons)
  const COPY_TOP = 340;                  // main copy block top (below the brand mark)
  const TYPE_MAX = 150, TYPE_MIN = 72;   // kinetic type: each line fills the 810px copy width within this range
  const MASK_H = 1.36, LINE_ADV = 1.14;   // mask box height / line advance (x font size)
  const LINE_H = LINE_ADV;

  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const E = {
    lin: (t) => t,
    out: (t) => 1 - Math.pow(1 - t, 3),
    in: (t) => t * t * t,
    inOut: (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  };
  /** eased progress of f inside [a, b] (frames); 0 before a, 1 at/after b */
  function P(f, a, b, ease = E.inOut) {
    if (b <= a) return f >= a ? 1 : 0;
    return ease(clamp((f - a) / (b - a)));
  }
  /** fade in over [a,b], hold, fade out over [c,d] */
  function inOut(f, a, b, c, d) {
    if (f < a || f >= d) return 0;
    if (f < b) return P(f, a, b, E.lin);
    if (f < c) return 1;
    return 1 - P(f, c, d, E.lin);
  }
  const lerpRect = (r0, r1, t) => ({
    x: lerp(r0.x, r1.x, t), y: lerp(r0.y, r1.y, t),
    w: lerp(r0.w, r1.w, t), h: lerp(r0.h, r1.h, t),
  });

  const stage = document.getElementById("stage");

  function mk(tag, cls, parent, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    (parent || stage).appendChild(e);
    return e;
  }
  const SVGNS = "http://www.w3.org/2000/svg";
  function svg(tag, attrs, parent) {
    const e = document.createElementNS(SVGNS, tag);
    for (const k in attrs || {}) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function place(el, r) {
    el.style.left = r.x + "px"; el.style.top = r.y + "px";
    if (r.w != null) el.style.width = r.w + "px";
    if (r.h != null) el.style.height = r.h + "px";
  }
  function op(el, o) {
    el.style.opacity = o;
    el.style.visibility = o <= 0.001 ? "hidden" : "visible";
  }
  function tf(el, s) { el.style.transform = s || "none"; }
  const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  /** wrap every occurrence of each emphasis string in <span class="em"> */
  function emphasize(text, emph) {
    const marks = new Array(text.length).fill(false);
    for (const e of emph || []) {
      let i = text.indexOf(e);
      while (i >= 0) { for (let k = i; k < i + e.length; k++) marks[k] = true; i = text.indexOf(e, i + e.length); }
    }
    let html = "", cur = null, buf = "";
    for (let i = 0; i <= text.length; i++) {
      const m = i < text.length ? marks[i] : null;
      if (m !== cur) {
        if (buf) html += cur ? `<span class="em">${esc(buf)}</span>` : esc(buf);
        buf = ""; cur = m;
      }
      if (i < text.length) buf += text[i];
    }
    return html;
  }

  // ---------------------------------------------------------------- copy layer
  // Kinetic type: every line is sized to fill the copy width (TYPE_MIN..TYPE_MAX px),
  // sits in its own mask and snaps up into place inside the 0.2s entry; it is fixed
  // (position + size) for the whole hold and leaves upward through the mask in 0.1s.
  const copies = [];
  function buildCopy(cut) {
    const wrap = mk("div", "copy");
    wrap.dataset.cut = cut.id;
    const lines = cut.copy.lines.map((t, i) => {
      const d = mk("div", "line", wrap);
      const inner = mk("span", "in", d, emphasize(t, cut.copy.emph));
      d.inner = inner;
      d.dataset.text = t; d.dataset.role = "copy"; d.dataset.cut = cut.id; d.dataset.line = i;
      return d;
    });
    const c = { cut, wrap, lines, sizes: [], size: TYPE_MAX };
    copies.push(c);
    return c;
  }
  function layoutCopy(c) {
    const room = (c.cut.copy.maxWidth || X1 - X0);
    c.sizes = c.lines.map((l) => {
      l.style.fontSize = "100px";
      const w = l.inner.getBoundingClientRect().width;
      let s = Math.max(TYPE_MIN, Math.min(c.cut.copy.maxSize || TYPE_MAX, Math.floor((100 * room) / w)));
      l.style.fontSize = s + "px";
      while (l.inner.getBoundingClientRect().width > room && s > TYPE_MIN) { s -= 1; l.style.fontSize = s + "px"; }
      return s;
    });
    c.size = c.sizes[0];
    c.maxWidth = Math.max(...c.lines.map((l) => l.inner.getBoundingClientRect().width));
    c.lines.forEach((l, i) => { l.style.height = c.sizes[i] * MASK_H + "px"; l.inner.style.lineHeight = c.sizes[i] * MASK_H + "px"; });
    const custom = window.EPISODE && EPISODE.copyLayout && EPISODE.copyLayout(c, c.sizes[0] * MASK_H);
    if (!custom) {
      place(c.wrap, { x: X0, y: COPY_TOP });
      let y = 0;
      c.lines.forEach((l, i) => { l.style.left = "0px"; l.style.top = y + "px"; y += c.sizes[i] * LINE_ADV; });
    }
  }
  function copyState(cut, f) {
    if (!cut.copy || f < cut.start || f >= cut.end) return null;
    const k = f - cut.start, c = cut.copy;
    if (k < c.in) return { k, phase: "in" };
    if (k < c.in + c.hold) return { k, phase: "hold" };
    return { k, j: k - c.in - c.hold, phase: "out" };
  }
  const expoOut = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
  function renderCopy(f) {
    for (const c of copies) {
      const st = copyState(c.cut, f);
      if (!st) { op(c.wrap, 0); continue; }
      op(c.wrap, 1);
      const n = c.lines.length, cp = c.cut.copy;
      c.lines.forEach((l, i) => {
        let y = 0;                                         // % of the mask height
        if (st.phase === "in" && cp.rise === 0 && i === 0) {
          y = 0;                                           // A09: line 1 is the example sentence that already arrived in the slot
        } else if (st.phase === "in") {
          const t = clamp((st.k + 1 - i) / (cp.in + 1 - i)); // 1-frame stagger, all lines land by the first hold frame
          y = 110 * (1 - expoOut(t));
        } else if (st.phase === "out") {
          y = -110 * Math.pow((st.j + 1) / (cp.out + 1), 2);
        }
        tf(l.inner, y ? `translateY(${y.toFixed(2)}%)` : "");
      });
      void n;
    }
  }

  // ---------------------------------------------------------------- boot
  const params = new URLSearchParams(location.search);
  const EP_ID = (params.get("ep") || "A").toUpperCase();
  let DATA = null;
  const cutAt = (f) => DATA.cuts.find((c) => f >= c.start && f < c.end);

  async function boot() {
    DATA = await (await fetch(`data/${EP_ID}.json`)).json();
    window.DATA = DATA;
    // brand mark: same place from frame 0 to 899
    const brand = mk("div", "", stage);
    brand.id = "brand";
    const logo = mk("img", "", brand);
    logo.src = "../assets/logo_real_academy.svg";
    logo.alt = "REAL ACADEMY";
    logo.dataset.role = "brand";

    const ep = window.EPISODES[EP_ID];
    window.EPISODE = ep;
    window.COMMON.buildWipe(DATA);
    ep.build(DATA);
    window.COMMON.buildCTA(DATA);
    for (const cut of DATA.cuts) if (cut.copy) buildCopy(cut);

    await document.fonts.load('500 80px "Noto Sans KR VF"', "가");
    await document.fonts.load('900 80px "Noto Sans KR VF"', "가");
    await document.fonts.ready;
    await Promise.all([...document.images].map((im) => (im.decode ? im.decode().catch(() => {}) : null)));
    copies.forEach(layoutCopy);
    if (ep.afterLayout) ep.afterLayout();
    window.renderFrame(0);
    window.__ready = true;
  }

  window.renderFrame = function (f) {
    window.__f = f;
    renderCopy(f);
    window.COMMON.frameWipe(f);
    window.EPISODE.frame(f);
    window.COMMON.frameCTA(f);
  };

  /** validation helper: every text-bearing element and its on-screen state at frame f */
  window.inspect = function (f) {
    window.renderFrame(f);
    const items = [];
    for (const el of stage.querySelectorAll("[data-text]")) {
      let o = 1, vis = true;
      for (let n = el; n && n !== stage; n = n.parentElement) {
        const cs = getComputedStyle(n);
        o *= parseFloat(cs.opacity);
        if (cs.visibility === "hidden" || cs.display === "none") vis = false;
      }
      const r = el.getBoundingClientRect();
      const cs = getComputedStyle(el);
      const ems = [...el.querySelectorAll(".em")].map((s) => ({
        text: s.textContent, weight: getComputedStyle(s).fontWeight, color: getComputedStyle(s).color,
      }));
      // occlusion: is the element (or a descendant) the topmost thing at sample points across its box?
      let occluded = false;
      if (vis && o > 0.02 && r.width > 0) {
        for (const [fx, fy] of [[0.15, 0.5], [0.5, 0.5], [0.85, 0.5]]) {
          const top = document.elementFromPoint(r.left + r.width * fx, r.top + r.height * fy);
          if (!top || top === el || el.contains(top) || top.contains(el) || top.tagName.toLowerCase() === "svg" || top === stage) continue;
          const host = top.closest && top.closest("[data-text]");
          if (host && host.dataset.text === el.dataset.text) continue;   // identical string cross-fading over it (A08 -> A09 handover)
          let to = 1, tv = true;     // effective opacity / visibility of the covering element
          for (let n = top; n && n !== stage; n = n.parentElement || n.parentNode) {
            if (!(n instanceof Element)) break;
            const t = getComputedStyle(n);
            to *= parseFloat(t.opacity);
            if (t.visibility === "hidden" || t.display === "none") tv = false;
          }
          if (tv && to > 0.02) { occluded = top.tagName + "." + (top.className.baseVal ?? top.className); break; }
        }
      }
      items.push({ occluded,
        text: el.dataset.text, role: el.dataset.role || "sub", src: el.dataset.src || "dom",
        cut: el.dataset.cut || null, opacity: +o.toFixed(3), visible: vis && o > 0.02,
        rect: { x: +r.left.toFixed(1), y: +r.top.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) },
        fontSize: parseFloat(cs.fontSize), fontWeight: cs.fontWeight, ems,
        domText: el.tagName === "IMG" ? null : el.textContent,
      });
    }
    return { f, cut: cutAt(f).id, items };
  };
  window.copyLayoutReport = () => copies.map((c) => ({ cut: c.cut.id, size: c.size, sizes: c.sizes, maxWidth: +c.maxWidth.toFixed(1) }));
  window.copyStateAt = (f) => { const c = cutAt(f); return { cut: c.id, state: copyState(c, f) }; };

  window.ENG = { FPS, W, H, X0, X1, COPY_TOP, LINE_H, MASK_H, LINE_ADV, clamp, lerp, E, P, inOut, lerpRect, mk, svg, place, op, tf, esc, emphasize, stage, cutAt };
  window.EPISODES = window.EPISODES || {};
  window.addEventListener("load", () => boot().catch((e) => { window.__error = String(e && e.stack || e); }));
})();

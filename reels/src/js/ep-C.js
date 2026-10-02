/* C편: 공부 끝, 그다음의 확인 — scene layer (the copy layer comes from data/C.json) */
(function () {
  const { mk, svg, place, op, tf, P, E, lerp, lerpRect } = window.ENG;
  const { C, Tablet, tabletRect, UI, icon, sub, tag, strokePath, drawPath, back } = window.COMMON;

  const BOX = { x: 90, y: 740, w: 120, h: 120 };
  const EMPTY = { x: 90, y: 930, w: 810, h: 480 };          // the empty result card of C01
  const CL = { x: 90, y: 930, w: 390, h: 480 }, CR = { x: 510, y: 930, w: 390, h: 480 };
  const TAB_BIG = tabletRect(90, 740, 810);
  const W6 = { x: 90, y: 830, w: 390, h: 480 }, S6 = { x: 510, y: 830, w: 390, h: 480 };
  const W9 = { x: 130, y: 990, w: 355, h: 380 }, S9 = { x: 515, y: 990, w: 355, h: 380 };
  const TAB10 = tabletRect(90, 730, 470);
  const RES10 = { x: 400, y: 1150, w: 500, h: 290 };
  const TAG6 = { x: 90, y: 720 }, TAG9 = { x: 90, y: 832 }, TAG10 = { x: 400, y: 1056 };

  const checkPts = [[116, 802], [143, 830], [190, 772]];
  const bracket = (r) => [[r.x, r.y + 90], [r.x, r.y], [r.x + 90, r.y]];
  const pl = (pts) => "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L");
  const lp = (a, b, t) => a.map((p, i) => [lerp(p[0], b[i][0], t), lerp(p[1], b[i][1], t)]);
  const rrect = (r, k = 32) => `M${r.x + k} ${r.y} H${r.x + r.w - k} A${k} ${k} 0 0 1 ${r.x + r.w} ${r.y + k} V${r.y + r.h - k} A${k} ${k} 0 0 1 ${r.x + r.w - k} ${r.y + r.h} H${r.x + k} A${k} ${k} 0 0 1 ${r.x} ${r.y + r.h - k} V${r.y + k} A${k} ${k} 0 0 1 ${r.x + k} ${r.y} Z`;
  const rrectFromCorner = (r, k = 32) => `M${r.x} ${r.y + k} A${k} ${k} 0 0 1 ${r.x + k} ${r.y} H${r.x + r.w - k} A${k} ${k} 0 0 1 ${r.x + r.w} ${r.y + k} V${r.y + r.h - k} A${k} ${k} 0 0 1 ${r.x + r.w - k} ${r.y + r.h} H${r.x + k} A${k} ${k} 0 0 1 ${r.x} ${r.y + r.h - k} Z`;

  const R = {};
  /** explanatory result card: icon + optional title (no scores, no items, no graphs) */
  function resultCard(parent, kind, title) {
    const c = mk("div", "card", parent);
    c.ic = icon(kind === "w" ? "pencil" : "bubble", c);
    if (title) { c.t = sub(title, c); c.t.style.color = C.ink; c.t.style.fontWeight = 700; }
    return c;
  }
  function layoutCard(c, r, iconSize, titleGap, o) {
    place(c, r); op(c, o);
    const iw = iconSize;
    const top = c.t ? (r.h - iw - titleGap - 60) / 2 : (r.h - iw) / 2 - 3;
    place(c.ic, { x: (r.w - 6 - iw) / 2, y: top, w: iw, h: iw });
    if (c.t) { c.t.style.left = "0px"; c.t.style.width = r.w - 6 + "px"; c.t.style.textAlign = "center"; c.t.style.top = top + iw + titleGap + "px"; }
  }

  const Cep = {
    build() {
      const root = (R.root = mk("div", "layer"));
      R.svg = svg("svg", { class: "layer", width: 1080, height: 1920, viewBox: "0 0 1080 1920" }, root);
      R.svg.style.zIndex = 5;
      // C01: 공부 끝 check + empty result card
      R.empty = mk("div", "slot", root); R.empty.style.borderRadius = "36px";
      R.box = mk("div", "abs", root);
      R.box.style.cssText += `border:7px solid ${C.ink};border-radius:28px;background:${C.bg}`;
      R.label = sub("공부 끝", root); R.label.style.color = C.ink; R.label.style.fontWeight = 700;
      R.checkA = strokePath(R.svg, pl(checkPts), C.accent, 13);
      R.checkB = svg("path", { d: pl(checkPts), fill: "none", stroke: C.accent, "stroke-width": 13, "stroke-linecap": "round", "stroke-linejoin": "round" }, R.svg);
      // C02: two empty cards drawn from the unfolded check corners
      R.outL = strokePath(R.svg, rrectFromCorner(CL), C.line2, 4);
      R.outR = strokePath(R.svg, rrectFromCorner(CR), C.line2, 4);
      R.cardL = mk("div", "card", root); R.cardR = mk("div", "card", root);
      R.pen = icon("pencil", root); R.bub = icon("bubble", root);
      // C04~C05: tablet (sanitized real home), 마이페이지 position -> 리포트 확인 경로
      R.tab = new Tablet(root, true);
      R.ring = mk("div", "ring", root); R.ring.style.zIndex = 6;
      R.link = strokePath(R.svg, "M0 0", C.accent, 5);
      R.doc = icon("doc", root);
      R.path = sub("리포트 확인 경로", root); R.path.style.color = C.ink;
      // C06~C10: explanatory result cards + 결과 확인 예시
      R.tag = tag("결과 확인 예시", root);
      R.cw = resultCard(root, "w", "라이팅 결과");
      R.cs = resultCard(root, "s", "스피킹 결과");
      R.cw.style.zIndex = 3; R.cs.style.zIndex = 3;
      R.dots = [0, 1, 2, 3, 4, 5, 6].map(() => { const d = mk("div", "abs", root); d.style.cssText += `width:20px;height:20px;border-radius:10px;background:${C.line2}`; return d; });
      R.box9 = mk("div", "abs", root);
      R.box9.style.zIndex = 1;
      R.box9.style.cssText += `border:4px solid ${C.line2};border-radius:36px;background:${C.bg}`;
      R.doc9 = icon("doc", root); R.doc9.style.zIndex = 4;
      // C10
      R.tab10 = new Tablet(root, true);
      R.res10 = mk("div", "abs", root);
      R.res10.style.cssText += `border:4px solid ${C.line2};border-radius:32px;background:${C.bg}`;
      R.mw = resultCard(root, "w", null); R.ms = resultCard(root, "s", null);
      R.doc10 = icon("doc", root); R.doc10.style.zIndex = 4;
    },

    frame(f) {
      const vis = f < 780;
      op(R.root, vis ? 1 : 0);
      if (!vis) return;

      // ---------------- C01: check once at 0.5s, then still
      const out2 = 1 - P(f, 84, 90, E.lin);
      place(R.box, BOX); op(R.box, f < 92 ? 1 - P(f, 84, 92, E.lin) : 0);
      R.box.style.borderColor = f >= 15 ? C.accent : C.ink2;
      place(R.label, { x: 240, y: 770 }); op(R.label, f < 90 ? out2 : 0);
      place(R.empty, EMPTY); op(R.empty, f < 96 ? 1 - P(f, 84, 96, E.lin) : 0);
      // C02: the check unfolds into the corners of two empty cards
      if (f < 84) {
        drawPath(R.checkA, P(f, 15, 21, E.out), 1);
        R.checkB.style.opacity = 0;
      } else if (f < 108) {
        const t = P(f, 84, 96);
        drawPath(R.checkA, 1, 1 - P(f, 100, 108, E.lin));
        R.checkA.setAttribute("d", pl(lp(checkPts, bracket(CL), t)));
        R.checkB.setAttribute("d", pl(lp(checkPts, bracket(CR), t)));
        R.checkB.style.opacity = 1 - P(f, 100, 108, E.lin);
        R.checkA.setAttribute("stroke-width", lerp(13, 5, t)); R.checkB.setAttribute("stroke-width", lerp(13, 5, t));
      } else { drawPath(R.checkA, 0, 0); R.checkB.style.opacity = 0; }
      if (f >= 84 && f < 108) { const t = P(f, 92, 106); drawPath(R.outL, t, 1 - P(f, 102, 108, E.lin)); drawPath(R.outR, t, 1 - P(f, 102, 108, E.lin)); }
      else { drawPath(R.outL, 0, 0); drawPath(R.outR, 0, 0); }

      // two cards: C02 end ... C04 morph into the tablet
      if (f >= 98 && f < 192) {
        const tm = P(f, 174, 190);
        const a = P(f, 98, 107, E.lin) * (1 - P(f, 182, 192, E.lin));
        place(R.cardL, lerpRect(CL, TAB_BIG, tm)); op(R.cardL, a);
        place(R.cardR, lerpRect(CR, TAB_BIG, tm)); op(R.cardR, a);
      } else { op(R.cardL, 0); op(R.cardR, 0); }
      // C03: pencil stroke, then speech bubble, each appears once
      if (f >= 114 && f < 180) {
        const out = 1 - P(f, 174, 180, E.lin);
        const a = back(P(f, 114, 120, E.lin), 2.2), b = back(P(f, 122, 128, E.lin), 2.2);
        place(R.pen, { x: CL.x + (CL.w - 170) / 2, y: CL.y + (CL.h - 170) / 2 + (1 - a) * 16, w: 170, h: 170 }); op(R.pen, a * out);
        place(R.bub, { x: CR.x + (CR.w - 170) / 2, y: CR.y + (CR.h - 170) / 2 + (1 - b) * 16, w: 170, h: 170 }); op(R.bub, b * out);
      } else { op(R.pen, 0); op(R.bub, 0); }

      // ---------------- C04~C05: tablet, 마이페이지 position -> report path
      if (f >= 174 && f < 291) R.tab.set(TAB_BIG, P(f, 182, 190, E.lin) * (1 - P(f, 285, 291, E.lin)), P(f, 186, 197, E.lin));
      else op(R.tab.el, 0);
      if (f >= 198 && f < 291) {
        const out = 1 - P(f, 285, 291, E.lin);
        const rr = R.tab.map(...UI.myPageTab);
        const ring = { x: rr.x - 4, y: rr.y - 4, w: rr.w + 8, h: rr.h + 6 };
        place(R.ring, ring); op(R.ring, P(f, 204, 210, E.lin) * out);
        const cx = ring.x + ring.w / 2;
        const doc = { x: cx - 52, y: 1306, w: 104, h: 129 };
        R.link.setAttribute("d", `M${cx} ${ring.y + ring.h} V${doc.y - 8}`);
        drawPath(R.link, P(f, 208, 214), out);
        const d = P(f, 212, 218, E.out);
        place(R.doc, { x: doc.x, y: doc.y + (1 - d) * 12, w: doc.w, h: doc.h }); op(R.doc, d * out);
        const pw = R.path.offsetWidth;
        place(R.path, { x: doc.x - 28 - pw, y: doc.y + (doc.h - R.path.offsetHeight) / 2 + (1 - d) * 12 }); op(R.path, d * out);
      } else { op(R.ring, 0); op(R.doc, 0); op(R.path, 0); drawPath(R.link, 0, 0); }

      // ---------------- C06~C09: result cards (explanatory) + 결과 확인 예시
      if (f >= 294 && f < 705) {
        const a = back(P(f, 294, 300, E.lin), 1.6), out = 1 - P(f, 699, 705, E.lin), rise = (1 - a) * 60;
        const tg = P(f, 546, 566);
        place(R.tag, { x: lerp(TAG6.x, TAG9.x, tg), y: lerp(TAG6.y, TAG9.y, tg) + rise }); op(R.tag, a * out);
        const w = lerpRect(W6, W9, tg), s = lerpRect(S6, S9, tg);
        w.y += rise; s.y += rise;
        layoutCard(R.cw, w, lerp(150, 130, tg), lerp(44, 34, tg), a * out);
        layoutCard(R.cs, s, lerp(150, 130, tg), lerp(44, 34, tg), a * out);
        // C07: small number-free dots (time / attendance) as a minor aid
        const dA = P(f, 450, 456, E.lin) * (1 - P(f, 546, 552, E.lin));
        R.dots.forEach((d, i) => { place(d, { x: 92 + i * 38, y: 1348 }); op(d, f >= 450 && f < 552 ? dA : 0); });
        // C08: both cards gather into the original empty result card position
        place(R.box9, EMPTY); op(R.box9, P(f, 552, 566, E.lin) * out);
        // C09: report icon joins the same single scene
        place(R.doc9, { x: 790, y: 872, w: 84, h: 104 }); op(R.doc9, P(f, 570, 576, E.lin) * out);
      } else { op(R.tag, 0); op(R.cw, 0); op(R.cs, 0); R.dots.forEach((d) => op(d, 0)); op(R.box9, 0); op(R.doc9, 0); }

      // ---------------- C10: small home + explanatory result card
      if (f >= 702) {
        const a = P(f, 702, 708, E.out), b = P(f, 706, 712, E.out);
        R.tab10.set({ ...TAB10, y: TAB10.y + (1 - a) * 16 }, a, 1);
        place(R.res10, { ...RES10, y: RES10.y + (1 - b) * 16 }); op(R.res10, b);
        const mw = { x: RES10.x + 28, y: RES10.y + 46 + (1 - b) * 16, w: 210, h: 210 };
        const ms = { x: RES10.x + 262, y: mw.y, w: 210, h: 210 };
        layoutCard(R.mw, mw, 110, 0, b); layoutCard(R.ms, ms, 110, 0, b);
        place(R.doc10, { x: RES10.x + RES10.w - 74, y: RES10.y - 54 + (1 - b) * 16, w: 70, h: 87 }); op(R.doc10, b);
        if (f >= 705) { place(R.tag, { x: TAG10.x, y: TAG10.y + (1 - b) * 16 }); op(R.tag, b); }
      } else { op(R.tab10.el, 0); op(R.res10, 0); op(R.mw, 0); op(R.ms, 0); op(R.doc10, 0); }
    },
  };
  window.EPISODES = window.EPISODES || {};
  window.EPISODES.C = Cep;
})();

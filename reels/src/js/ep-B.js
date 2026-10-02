/* B편: 수업이 집으로 오는 순간 — scene layer (the copy layer comes from data/B.json) */
(function () {
  const { mk, svg, place, op, tf, P, E, lerp, lerpRect } = window.ENG;
  const { C, Tablet, tabletRect, UI, icon, sub, tag, strokePath, drawPath, bez } = window.COMMON;

  const LIVE_SRC = "../assets/derived/live_card_masked.png";   // 579 x 428, coins + time condition removed
  const LIVE_AR = 428 / 579;
  const BTN_SRC = "../assets/derived/btn_timetable.png";       // 152 x 68

  const DAECHI = { x: 90, y: 730, w: 400, h: 300 };
  const LESSON = { w: 190, h: 124 };
  // small house (B01~B03)
  const H1 = { apex: [700, 1010], eave: 1170, eL: 500, eR: 900, wL: 525, wR: 875, bottom: 1430 };
  // path of the lesson frame (centre) from 대치동 to the house wall
  const Q = [{ x: 245, y: 902 }, { x: 610, y: 900 }, { x: 250, y: 1352 }, { x: 430, y: 1352 }];
  const LESSON_HOME = { x: 700, y: 1352 };
  const PIN1 = { x: 806, y: 1184, w: 52, h: 68 };
  const TAB_BIG = tabletRect(90, 740, 810);
  const TAB_ANCHOR = tabletRect(90, 720, 420);
  const LIVE_BIG = { x: 300, y: 1010, w: 600, h: 600 * LIVE_AR };
  const BTN_BOX = { x: 470, y: 1030, w: 430, h: 220 };
  const FRAME7 = { x: 90, y: 830, w: 810, h: 470 };
  // big house (B09~B10)
  const H2 = { apex: [495, 720], eave: 960, eL: 100, eR: 890, wL: 130, wR: 860, bottom: 1446 };
  const TAB_HOUSE = tabletRect(175, 1004, 640);
  const LIVE_HOUSE = { x: 215, y: 1010, w: 560, h: 560 * LIVE_AR };
  const PIN2 = { x: 468, y: 812, w: 54, h: 70 };

  const housePts = (h) => [h.apex, [h.eR, h.eave], [h.wR, h.eave], [h.wR, h.bottom], [h.wL, h.bottom], [h.wL, h.eave], [h.eL, h.eave]];
  const rectPts = (r) => [[r.x + r.w / 2, r.y], [r.x + r.w, r.y], [r.x + r.w, r.y + 30], [r.x + r.w, r.y + r.h], [r.x, r.y + r.h], [r.x, r.y + 30], [r.x, r.y]];
  const poly = (pts) => "M" + pts.map((p) => p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" L") + " Z";
  const lerpPts = (a, b, t) => a.map((p, i) => [lerp(p[0], b[i][0], t), lerp(p[1], b[i][1], t)]);
  const houseOutline = (h) => `M${h.eL} ${h.eave} L${h.apex[0]} ${h.apex[1]} L${h.eR} ${h.eave} M${h.wR} ${h.eave - 14} V${h.bottom} H${h.wL} V${h.eave - 14}`;

  const R = {};
  function lessonFrame(parent) {
    const d = mk("div", "abs", parent);
    d.style.cssText += `width:${LESSON.w}px;height:${LESSON.h}px;background:${C.soft};border:6px solid ${C.accent};border-radius:22px;z-index:6`;
    const p = icon("play", d);
    place(p, { x: (LESSON.w - 12 - 64) / 2, y: (LESSON.h - 12 - 64) / 2, w: 64, h: 64 });
    return d;
  }
  function imgEl(src, parent, uiText) {
    const im = mk("img", "abs", parent);
    im.src = src;
    im.style.filter = "drop-shadow(0 18px 30px rgba(21,24,29,0.16))";
    if (uiText) { im.dataset.text = uiText; im.dataset.role = "sub"; im.dataset.src = "ui-crop"; }
    return im;
  }

  const B = {
    build() {
      const root = (R.root = mk("div", "layer"));
      R.svg = svg("svg", { class: "layer", width: 1080, height: 1920, viewBox: "0 0 1080 1920" }, root);
      R.svg.style.zIndex = 2;
      // B01~B03: two places and a route
      R.daechi = mk("div", "abs", root);
      R.daechi.style.cssText += `border:5px solid ${C.ink2};border-radius:32px;background:#fff`;
      R.daechiLabel = sub("대치동", root);
      const defs = svg("defs", {}, R.svg);
      const mask = svg("mask", { id: "routeMask", maskUnits: "userSpaceOnUse", x: 0, y: 0, width: 1080, height: 1920 }, defs);
      const qd = `M${Q[0].x} ${Q[0].y} C ${Q[1].x} ${Q[1].y}, ${Q[2].x} ${Q[2].y}, ${Q[3].x} ${Q[3].y}`;
      R.routeReveal = strokePath(mask, qd, "#fff", 30);
      R.route = svg("path", { d: qd, fill: "none", stroke: C.line2, "stroke-width": 6, "stroke-dasharray": "4 18", "stroke-linecap": "round", mask: "url(#routeMask)" }, R.svg);
      R.house1 = svg("path", { d: houseOutline(H1), fill: "#fff", stroke: C.ink2, "stroke-width": 5, "stroke-linejoin": "round", "stroke-linecap": "round" }, R.svg);
      R.homeLabel = sub("우리 집", root); R.homeLabel.style.zIndex = 6;   // above the house outline svg
      R.pin = icon("pin", root); R.pin.style.zIndex = 6;
      R.lesson = lessonFrame(root);
      // B04: house -> tablet morph outline
      R.morph = svg("path", { d: "M0 0", fill: "none", stroke: C.ink2, "stroke-width": 5, "stroke-linejoin": "round" }, R.svg);
      R.tab = new Tablet(root, true);
      R.tab.el.style.zIndex = 3;
      // B05 / B10: real 오늘의 대치 라이브 card (sanitized crop)
      R.live = imgEl(LIVE_SRC, root, "오늘의 대치 라이브");
      R.live.style.zIndex = 8;
      // B06: real 시간표 button crop
      R.ring = mk("div", "ring", root); R.ring.style.zIndex = 7;
      R.link = strokePath(R.svg, "M0 0", C.accent, 4);
      R.btnBox = mk("div", "crop", root); R.btnBox.style.zIndex = 8;
      R.btn = mk("img", "abs", R.btnBox); R.btn.src = BTN_SRC;
      R.btnBox.dataset.text = "시간표"; R.btnBox.dataset.role = "sub"; R.btnBox.dataset.src = "ui-crop";
      // B07: 커리큘럼 marker + equal-size concept cards, one highlighted (static)
      R.chip = tag("커리큘럼", root, true);
      R.frame7 = mk("div", "abs", root);
      R.frame7.style.cssText += `border:5px solid ${C.line};border-radius:36px;background:#fff`;
      R.cards7 = [0, 1, 2].map((i) => {
        const c = mk("div", "card", root);
        const hi = i === 1;
        if (hi) { c.style.background = C.soft; c.style.borderColor = C.accent; c.style.borderWidth = "6px"; }
        const dot = mk("div", "abs", c);
        dot.style.cssText += `left:50%;top:56px;width:72px;height:72px;margin-left:-36px;border-radius:36px;background:${hi ? C.accent : C.line}`;
        [0, 1].forEach((k) => {
          const bar = mk("div", "abs", c);
          bar.style.cssText += `left:36px;right:${k ? 70 : 36}px;top:${172 + k * 44}px;height:18px;border-radius:9px;background:${hi ? "#b9e2cb" : "#e2e7ec"}`;
        });
        return c;
      });
      // B09~B10: big house frame around the tablet, static location icon instead of a character
      R.house2 = strokePath(R.svg, houseOutline(H2), C.ink2, 6);
      R.pin2 = icon("pin", root);
    },

    frame(f) {
      const vis = f < 780;
      op(R.root, vis ? 1 : 0);
      if (!vis) return;

      // ---------------- B01~B03
      const out3 = 1 - P(f, 102, 108, E.lin);          // 대치동 + route leave at B03
      const out4 = 1 - P(f, 162, 168, E.lin);          // house content leaves at B04
      place(R.daechi, DAECHI); op(R.daechi, f < 108 ? out3 : 0);
      place(R.daechiLabel, { x: DAECHI.x + 34, y: DAECHI.y + 24 }); op(R.daechiLabel, f < 108 ? out3 : 0);
      drawPath(R.routeReveal, P(f, 6, 24, E.inOut), 1);  // route is drawn 0.2s~0.8s, then still
      R.route.style.opacity = f < 108 ? out3 : 0;
      R.house1.style.opacity = f < 162 ? 1 : 0;
      place(R.homeLabel, { x: H1.wL + 28, y: H1.eave + 18 }); op(R.homeLabel, f < 168 ? (f < 162 ? 1 : out4) : 0);
      place(R.pin, PIN1); op(R.pin, f < 168 ? (f < 162 ? 1 : out4) : 0);   // child's home marker never moves
      // lesson frame: B02 travels the route, B03 settles inside the house in 0.3s
      let c;
      if (f < 78) c = Q[0];
      else if (f < 102) c = bez(Q[0], Q[1], Q[2], Q[3], P(f, 78, 102, E.inOut));
      else { const t = P(f, 102, 111, E.out); c = { x: lerp(Q[3].x, LESSON_HOME.x, t), y: lerp(Q[3].y, LESSON_HOME.y, t) }; }
      place(R.lesson, { x: c.x - LESSON.w / 2, y: c.y - LESSON.h / 2 });
      op(R.lesson, f < 168 ? (f < 162 ? 1 : out4) : 0);

      if (f < 162) op(R.tab.el, 0);
      // ---------------- B04: house -> tablet, home appears
      if (f >= 162 && f < 186) {
        const t = P(f, 162, 178);
        R.morph.setAttribute("d", poly(lerpPts(housePts(H1), rectPts(TAB_BIG), t)));
        R.morph.style.opacity = 1 - P(f, 172, 180, E.lin);
        R.tab.set(TAB_BIG, P(f, 172, 180, E.lin), P(f, 176, 185, E.lin));
      } else R.morph.style.opacity = 0;

      // ---------------- B05~B06: home anchor, live card, timetable button
      if (f >= 186 && f < 417) {
        R.tab.set(lerpRect(TAB_BIG, TAB_ANCHOR, P(f, 186, 198)), 1 - P(f, 411, 417, E.lin), 1);
      } else if (f >= 186 && f < 528) op(R.tab.el, 0);

      if (f >= 186 && f < 351) {
        // 6.4~6.8s: the card grows out of its place on the home anchor, then holds 4.7s
        const t = P(f, 192, 204, E.out);
        const from = R.tab.map(...UI.liveCard);
        place(R.live, lerpRect(from, LIVE_BIG, t));
        op(R.live, (f < 192 ? 0 : Math.min(1, t * 2)) * (1 - P(f, 345, 351, E.lin)));
      } else if (f >= 684) {
        place(R.live, LIVE_HOUSE); op(R.live, P(f, 684, 690, E.out));
      } else op(R.live, 0);

      if (f >= 348 && f < 417) {
        const out = 1 - P(f, 411, 417, E.lin), a = P(f, 348, 354, E.out);
        const rr = R.tab.map(...UI.timetableBtn);
        const ring = { x: rr.x - 5, y: rr.y - 5, w: rr.w + 10, h: rr.h + 10 };
        place(R.ring, ring); op(R.ring, a * out);
        const x0 = ring.x + ring.w / 2, y0 = ring.y + ring.h;
        R.link.setAttribute("d", `M${x0} ${y0} C ${x0} ${y0 + 80}, ${BTN_BOX.x + 120} ${BTN_BOX.y - 60}, ${BTN_BOX.x + 120} ${BTN_BOX.y}`);
        drawPath(R.link, a, out);
        // grow by layout (no CSS scale: a scaled image gets re-rasterised by Chrome a few frames later)
        const s = lerp(0.85, 1, a);
        const bx = { w: Math.round(BTN_BOX.w * s), h: Math.round(BTN_BOX.h * s) };
        place(R.btnBox, { x: Math.round(BTN_BOX.x + (BTN_BOX.w - bx.w) / 2), y: BTN_BOX.y, w: bx.w, h: bx.h });
        const bw = Math.round(152 * 2.5 * s), bh = Math.round(68 * 2.5 * s);
        place(R.btn, { x: Math.round((bx.w - 6 - bw) / 2), y: Math.round((bx.h - 6 - bh) / 2), w: bw, h: bh });
        op(R.btnBox, a * out);
      } else { op(R.ring, 0); op(R.btnBox, 0); drawPath(R.link, 0, 0); }

      // ---------------- B07~B08: 커리큘럼 marker + concept cards; frame returns to the tablet outline
      if (f >= 414 && f < 552) {
        const a = P(f, 414, 420, E.out), out = 1 - P(f, 528, 534, E.lin), rise = (1 - a) * 18;
        place(R.chip, { x: 90, y: 720 + rise }); op(R.chip, a * out);
        R.cards7.forEach((c, i) => { place(c, { x: 120 + i * 260, y: 886 + rise, w: 230, h: 360 }); op(c, a * out); });
        const g = lerpRect(FRAME7, TAB_BIG, P(f, 528, 546));
        place(R.frame7, { x: g.x, y: g.y + rise, w: g.w, h: g.h });
        R.frame7.style.borderRadius = lerp(36, TAB_BIG.w * 0.045, P(f, 528, 546)) + "px";
        R.frame7.style.borderColor = f < 528 ? C.line : C.ink2;
        op(R.frame7, a * (1 - P(f, 540, 548, E.lin)));
        if (f >= 528) R.tab.set(TAB_BIG, P(f, 538, 548, E.lin), P(f, 540, 551, E.lin));
      } else { op(R.chip, 0); R.cards7.forEach((c) => op(c, 0)); op(R.frame7, 0); }

      // ---------------- B09~B10: big house around the tablet / the live card
      if (f >= 552) {
        const t = P(f, 552, 564);
        drawPath(R.house2, P(f, 552, 566, E.inOut), 1);
        place(R.pin2, PIN2); op(R.pin2, P(f, 558, 564, E.lin));
        if (f < 690) R.tab.set(lerpRect(TAB_BIG, TAB_HOUSE, t), f < 684 ? 1 : 1 - P(f, 684, 690, E.lin), 1);
        else op(R.tab.el, 0);
      } else { drawPath(R.house2, 0, 0); op(R.pin2, 0); }
    },
  };
  window.EPISODES = window.EPISODES || {};
  window.EPISODES.B = B;
})();

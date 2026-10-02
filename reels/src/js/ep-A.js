/* A편: 단어에서 내 문장으로 — scene layer (the copy layer comes from data/A.json) */
(function () {
  const { mk, svg, place, op, tf, P, E, lerp, lerpRect } = window.ENG;
  const { C, Tablet, tabletRect, UI, icon, placePencil, sub, tag, crop, setCrop, strokePath, drawPath, back } = window.COMMON;

  const SLOT = { x: 90, y: 1080, w: 810, h: 190 };       // the empty sentence slot (A01) = the slot filled in A09
  const BLOCK0 = { x: 90, y: 760, w: 340, h: 156 };
  const BLOCK1 = { x: 90, y: 888, w: 340, h: 156 };     // A02: stops 36px short of the slot
  const TAB_BIG = tabletRect(90, 740, 810);
  const TAB_ANCHOR = tabletRect(90, 720, 420);
  const CROP = { x: 410, y: 1046, w: 490, h: 326 };
  const CARD = { x: 90, y: 880, w: 810, h: 300 };
  const SIL10 = tabletRect(90, 730, 540);
  const SLOT10 = { x: 90, y: 1150, w: 810, h: 180 };
  const TAG9 = { x: 90, y: 984 };
  const SENT = 80;                 // example sentence size (= copy size, so A08 hands over 1:1)
  const SENT_POS = { x: CARD.x + 44, y: CARD.y + 150 };

  const R = {};
  const A = {
    build() {
      const root = (R.root = mk("div", "layer"));
      // A01~A04: apple block + empty sentence slot
      R.slot = mk("div", "slot", root);
      R.cursor = mk("div", "cursor", root);
      R.block = mk("div", "block", root);
      R.blockText = sub("apple", R.block, "");
      R.blockText.style.cssText = "font-size:66px;font-weight:700;color:#0e1013;letter-spacing:-0.01em;line-height:1";
      // A04~A05: tablet holding the sanitized real home capture
      R.tab = new Tablet(root, true);
      R.ring = mk("div", "ring", root);
      R.crop = crop("../assets/derived/tab_gv_writing.png", root, "GV 라이팅");
      // A06~A09: explanatory example (outside any app UI) labelled 학습 방식 예시
      R.card = mk("div", "card", root);
      R.slotFilled = mk("div", "slot filled", root);
      R.tag = tag("학습 방식 예시", root);
      R.sent = mk("div", "sentence", root);
      R.sent.style.fontSize = SENT + "px";
      R.sent.innerHTML = 'I like <span class="u">apple<span class="s">s</span><span class="uline"></span></span>.';
      R.sent.dataset.role = "sub";
      R.sS = R.sent.querySelector(".s");
      R.uline = R.sent.querySelector(".uline");
      // A10: real GV 라이팅 module icon + tablet silhouette + sentence slot
      R.sil10 = mk("div", "silhouette", root);
      R.icon10 = mk("img", "abs", root);
      R.icon10.src = "../assets/derived/icon_gv_writing.png";
      R.slot10 = mk("div", "slot", root);
      R.cursor10 = mk("div", "cursor", root);
      // strokes + pencil above everything else in the scene
      R.svg = svg("svg", { class: "layer", width: 1080, height: 1920, viewBox: "0 0 1080 1920" }, root);
      R.svg.style.zIndex = 20;
      R.stroke3 = strokePath(R.svg, "M134 1336 C 194 1316, 254 1356, 324 1334 S 424 1320, 474 1330", C.ink2, 8);
      R.link = strokePath(R.svg, "M0 0", C.accent, 4);
      R.stroke7 = strokePath(R.svg, "M0 0", C.accent, 8);
      R.trail8 = strokePath(R.svg, "M0 0", C.accent, 6);
      R.pencil = icon("pencil", root);
      R.pencil.style.zIndex = 21;
    },

    /** A09: line 1 of the copy sits inside the original sentence slot (질문 회수) */
    copyLayout(c, lh) {
      if (c.cut.id !== "A09") return false;
      place(c.wrap, { x: 0, y: 0 });
      const l0 = { x: SLOT.x + 44, y: SLOT.y + (SLOT.h - lh) / 2 };
      c.lines[0].style.left = l0.x + "px"; c.lines[0].style.top = l0.y + "px";
      c.lines[1].style.left = SLOT.x + "px"; c.lines[1].style.top = SLOT.y + SLOT.h + 36 + "px";
      R.a09 = { size: c.size, lh, line0: l0 };
      return true;
    },

    afterLayout() {
      R.sS.style.display = "inline";
      const u = R.sent.querySelector(".u");
      R.m = { uWidth: u.offsetWidth - R.sS.offsetWidth, sLeft: R.sS.offsetLeft + u.offsetLeft, sWidth: R.sS.offsetWidth, h: R.sent.offsetHeight };
    },

    frame(f) {
      const vis = f < 780;
      op(R.root, vis ? 1 : 0);
      if (!vis) return;
      const fadeA04 = 1 - P(f, 153, 156, E.lin);   // A01~A03 scene leaves inside A03's 0.1s exit

      // ---------------- A01~A03: apple block, empty slot, cursor, one pencil stroke
      place(R.block, f < 84 ? BLOCK0 : lerpRect(BLOCK0, BLOCK1, P(f, 84, 96)));   // A02: 0.4s move, 0.4s stop
      op(R.block, fadeA04);
      place(R.cursor, { x: SLOT.x + 44, y: SLOT.y + 50, w: 8, h: 90 });
      op(R.cursor, f >= 15 && f < 156 ? fadeA04 : 0);                // lights once at 0.5s, then still
      const t3 = P(f, 116, 132, E.inOut);
      drawPath(R.stroke3, t3, f >= 116 && f < 156 ? fadeA04 : 0);

      // ---------------- A04: slot -> tablet ratio, home appears inside
      if (f < 156) { place(R.slot, SLOT); op(R.slot, 1); }
      else if (f < 186) { place(R.slot, lerpRect(SLOT, TAB_BIG, P(f, 156, 178))); op(R.slot, 1 - P(f, 160, 172, E.lin)); }
      else op(R.slot, 0);
      if (f >= 156 && f < 186) {
        R.tab.set(lerpRect(SLOT, TAB_BIG, P(f, 156, 178)), P(f, 160, 172, E.lin), P(f, 172, 184, E.lin));
      } else if (f >= 186 && f < 255) {
        // A05: home shrinks to a small anchor; only the GV 라이팅 tab is enlarged
        R.tab.set(lerpRect(TAB_BIG, TAB_ANCHOR, P(f, 186, 198)), 1 - P(f, 249, 255, E.lin), 1);
      } else op(R.tab.el, 0);

      // ---------------- A05: ring + connector + enlarged real crop
      if (f >= 186 && f < 255) {
        const out = 1 - P(f, 249, 255, E.lin);
        const rr = R.tab.map(...UI.gvWritingTab);
        const ring = { x: rr.x - 5, y: rr.y - 5, w: rr.w + 10, h: rr.h + 6 };
        place(R.ring, ring); op(R.ring, P(f, 196, 202, E.lin) * out);
        const tz = back(P(f, 196, 206, E.lin), 1.4);
        setCrop(R.crop, lerpRect(ring, CROP, tz), Math.min(1, Math.max(0, tz) * 1.6) * out);
        const x0 = ring.x + ring.w, y0 = ring.y + ring.h / 2;
        R.link.setAttribute("d", `M${x0} ${y0} C ${x0 + 70} ${y0}, ${CROP.x - 70} ${CROP.y + 50}, ${CROP.x} ${CROP.y + 50}`);
        drawPath(R.link, P(f, 198, 206), out);
      } else { op(R.ring, 0); op(R.crop, 0); drawPath(R.link, 0, 0); }

      // ---------------- A06~A08: example card
      const cardIn = P(f, 252, 258, E.out);
      if (f >= 252 && f < 540) {
        const rise = (1 - cardIn) * 18;
        const tm = P(f, 516, 536);                           // A08 match cut: card -> original sentence slot
        const g = lerpRect(CARD, SLOT, tm);
        place(R.card, { x: g.x, y: g.y + rise, w: g.w, h: g.h });
        op(R.card, cardIn * (1 - P(f, 520, 534, E.lin)));
        place(R.slotFilled, g); op(R.slotFilled, P(f, 520, 534, E.lin));
        const tg0 = { x: CARD.x + 40, y: CARD.y + 40 };
        place(R.tag, { x: lerp(tg0.x, TAG9.x, tm), y: lerp(tg0.y, TAG9.y, tm) + rise }); op(R.tag, cardIn);
        const s1 = R.a09 ? R.a09.line0 : SENT_POS, sc = R.a09 ? R.a09.size / SENT : 1;
        place(R.sent, { x: lerp(SENT_POS.x, s1.x, tm), y: lerp(SENT_POS.y, s1.y, tm) + rise });
        R.sent.style.transformOrigin = "0 0";
        tf(R.sent, tm > 0 ? `scale(${lerp(1, sc, tm).toFixed(4)})` : "");
        // 10.8s (frame 324): only an "s" is added to the last word, underlined. Nothing else moves.
        const changed = f >= 324;
        const k = changed ? Math.min(1, (f - 324 + 1) / 7) : 0;   // 324..329 transition (1/7..6/7), 330 = first still frame
        R.sS.style.display = changed ? "inline" : "none";
        op(R.sS, k);
        R.uline.style.width = R.m.uWidth + R.m.sWidth + "px";
        R.uline.style.transform = `scaleX(${k})`;
        op(R.uline, changed ? 1 - P(f, 520, 532, E.lin) : 0);
        op(R.sent, cardIn);
        R.sent.dataset.text = changed ? "I like apples." : "I like apple.";
      } else if (f >= 540 && f < 681) {
        // A09: filled slot + label stay; the travelling sentence hands over to the copy layer
        const out = 1 - P(f, 675, 681, E.lin);
        place(R.slotFilled, SLOT); op(R.slotFilled, out);
        place(R.tag, TAG9); op(R.tag, out);
        op(R.sent, 0);                                     // handed over to the A09 copy line at the same place
        op(R.card, 0); op(R.uline, 0);
      } else { op(R.card, 0); op(R.slotFilled, 0); op(R.tag, 0); op(R.sent, 0); }

      // ---------------- pencil (A03 stroke, A07 short re-write of "s", A08 lead)
      if (f >= 114 && f < 156) {
        const pt = R.stroke3.getPointAtLength(R.stroke3.getTotalLength() * t3);
        placePencil(R.pencil, pt.x, pt.y, 120);
        op(R.pencil, P(f, 114, 117, E.lin) * fadeA04);
      } else if (f >= 414 && f < 540) {
        const sx = SENT_POS.x + R.m.sLeft, sw = R.m.sWidth, by = SENT_POS.y + R.m.h - 2;
        R.stroke7.setAttribute("d", `M${sx - 6} ${by + 12} Q ${sx + sw / 2} ${by + 2}, ${sx + sw + 8} ${by + 14}`);
        const t7 = P(f, 418, 430);
        drawPath(R.stroke7, t7, P(f, 414, 418, E.lin) * (1 - P(f, 516, 524, E.lin)));
        const L7 = R.stroke7.getTotalLength();
        if (f < 516) {
          const pt = R.stroke7.getPointAtLength(L7 * t7);
          placePencil(R.pencil, pt.x, pt.y, 110);
          op(R.pencil, P(f, 414, 418, E.lin));
          drawPath(R.trail8, 0, 0);
        } else {
          const a = R.stroke7.getPointAtLength(L7), b = { x: SLOT.x + 44, y: SLOT.y + SLOT.h - 30 };
          R.trail8.setAttribute("d", `M${a.x} ${a.y} C ${a.x + 90} ${a.y + 60}, ${b.x + 180} ${b.y + 40}, ${b.x} ${b.y}`);
          const t8 = P(f, 516, 534);
          drawPath(R.trail8, t8, 0.5 * (1 - P(f, 530, 540, E.lin)));
          const pt = R.trail8.getPointAtLength(R.trail8.getTotalLength() * t8);
          placePencil(R.pencil, pt.x, pt.y, 110);
          op(R.pencil, 1 - P(f, 532, 540, E.lin));
        }
      } else { op(R.pencil, 0); drawPath(R.stroke7, 0, 0); drawPath(R.trail8, 0, 0); }

      // ---------------- A10: product (module icon in tablet silhouette) -> action (sentence slot)
      if (f >= 678) {
        const a = back(P(f, 678, 684, E.lin)), b = back(P(f, 684, 690, E.lin));
        place(R.sil10, { x: SIL10.x, y: SIL10.y + (1 - a) * 18, w: SIL10.w, h: SIL10.h });
        R.sil10.style.borderRadius = SIL10.w * 0.045 + "px";
        op(R.sil10, a);
        const iw = 88 * 2.6, ih = 76 * 2.6;
        place(R.icon10, { x: SIL10.x + (SIL10.w - iw) / 2, y: SIL10.y + (SIL10.h - ih) / 2 + (1 - a) * 18, w: iw, h: ih });
        op(R.icon10, a);
        place(R.slot10, { x: SLOT10.x, y: SLOT10.y + (1 - b) * 18, w: SLOT10.w, h: SLOT10.h });
        op(R.slot10, b);
        place(R.cursor10, { x: SLOT10.x + 44, y: SLOT10.y + 45 + (1 - b) * 18, w: 8, h: 90 });
        op(R.cursor10, b);
      } else { op(R.sil10, 0); op(R.icon10, 0); op(R.slot10, 0); op(R.cursor10, 0); }
    },
  };
  window.EPISODES = window.EPISODES || {};
  window.EPISODES.A = A;
})();

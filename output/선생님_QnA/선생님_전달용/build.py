"""선생님 전달용 촬영 안내 HTML 생성 → render.js로 PDF 변환."""
from pathlib import Path

ROOT = Path(__file__).parent

SHOOT = {
    "date": "2026년 10월 10일 (토)",
    "place": "1028studio",
    "address": "서울 서초구 강남대로109길 73-21 지하 1층",
    "parking": "선생님 차량은 스튜디오에 주차할 수 있어요.",
}

TEACHERS = {
    "줄리": {
        "file": "줄리_선생님_촬영안내",
        "schedule": [
            ("13:00 – 15:00", "마케팅 촬영", "Julie & David 선생님"),
            ("15:00 – 16:00", "Q&A 촬영", "Julie 선생님"),
        ],
        "viewer": "초3 무렵 영어를 처음 시작하는 아이를 둔 부모님. 대치동 학원에 보내기 어려운 환경에서 ‘우리 아이만 늦은 건 아닐까’ 고민하는 분들이에요.",
        "parts": [
            {
                "label": "본편",
                "title": "초3 영어, 지금 시작해도 늦지 않았을까요?",
                "story": ["늦은 걸까?", "무엇부터?", "잘 가고 있을까?"],
                "flow": [
                    ("인사", "짧은 자기소개와 오늘 다룰 고민 소개"),
                    ("O/X 10문항", "짧은 질문들에 O 또는 X와 한 줄 이유로 답하기"),
                    ("부모님 질문 ①", "시작 시기와 대치동 아이들과의 차이"),
                    ("부모님 질문 ②", "파닉스·단어·원서·문법, 무엇부터 시작할까"),
                    ("부모님 질문 ③", "시작하고 3개월, 잘 가고 있는지 확인하는 법"),
                    ("마무리 한 문장", "흔들리는 초3 부모님께 드리는 한 문장"),
                ],
            },
        ],
        "prepare": [
            ("소개 정보 확인", "자막에 들어갈 경력과 소속은 담당 팀에서 따로 여쭤보고 정리해 드려요."),
            ("가르친 아이들의 사례", "질문마다 “실제로 그런 아이가 있었나요?”를 여쭤봐요. 초3에 시작해 빠르게 따라온 아이, 처음에 영어를 어려워하다 달라진 아이처럼 떠오르는 사례를 2~3개 생각해 와 주세요. 이름 등 개인정보는 빼고 말씀해 주시면 됩니다."),
            ("바로 해볼 수 있는 행동", "질문마다 마지막에 “부모님이 이번 주에 해볼 한 가지”를 여쭤봐요. 구체적인 행동일수록 좋아요."),
            ("짧은 시연", "두 번째 질문에서 ‘첫 책을 읽는 10분’을 부모님 입장에서 실제로 말하듯 보여주시는 장면을 부탁드릴 예정이에요."),
            ("마무리 한 문장", "영상 마지막에 흔들리는 부모님께 드릴 한 문장을 여쭤봐요. 미리 생각해 두시면 편해요."),
        ],
        "restate": "“늦었는지는 나이보다 이걸로 봐요.”",
    },
    "애니": {
        "file": "애니_선생님_촬영안내",
        "schedule": [
            ("16:00 – 17:00", "Q&A 촬영", "Annie 선생님"),
            ("17:00 – 19:00", "마케팅 촬영", "Annie 선생님"),
        ],
        "viewer": "AI가 번역도 요약도 다 해주는 시대에, 아이 영어 공부를 어디까지 어떻게 시켜야 할지 고민하는 초등 부모님들이에요.",
        "parts": [
                        {
                "label": "본편",
                "title": "AI가 다 해주는데, 영어 공부 꼭 해야 하나요?",
                "story": ["AI 시대 원서", "ChatGPT 숙제", "레벨테스트"],
                "flow": [
                    ("인사", "짧은 자기소개와 오늘 다룰 질문 소개"),
                    ("O/X 10문항", "짧은 질문들에 O 또는 X와 한 줄 이유로 답하기"),
                    ("솔직한 질문 ①", "AI가 다 해주는데, 원서 같은 걸 굳이 읽어야 할까"),
                    ("솔직한 질문 ②", "숙제를 ChatGPT로 해오는 아이, 막아야 할까"),
                    ("솔직한 질문 ③", "레벨테스트 점수, 믿어도 될까"),
                    ("선생님의 솔직한 답", "AI가 언젠가 영어 선생님을 대체할까"),
                    ("마무리 한 문장", "AI 시대에도 아이에게 영어가 필요한 이유"),
                ],
            },
        ],
        "prepare": [
            ("소개 정보 확인", "자막에 들어갈 경력과 소속은 담당 팀에서 따로 여쭤보고 정리해 드려요."),
            ("가르친 아이들의 사례", "질문마다 “실제로 그런 아이가 있었나요?”를 여쭤봐요. 원서를 꾸준히 읽은 아이, AI로 숙제를 해오던 아이, 레벨테스트 점수와 실제 실력이 달랐던 아이처럼 떠오르는 사례를 2~3개 생각해 와 주세요. 이름 등 개인정보는 빼고 말씀해 주시면 됩니다."),
            ("AI에 대한 생각", "AI 번역·요약, ChatGPT 숙제·첨삭, AI 영어 대화 앱에 대해 여쭤봐요. 수업에서 본 아이들의 모습과 집에서 AI를 쓸 때 정해 주면 좋은 규칙 한 가지를 생각해 와 주세요."),
            ("바로 해볼 수 있는 행동", "질문마다 마지막에 “부모님이 이번 주에 해볼 한 가지”를 여쭤봐요. 구체적인 행동일수록 좋아요."),
            ("마무리 한 문장", "영상 마지막에 ‘AI 시대에도 아이에게 영어가 필요한 이유’를 한 문장으로 여쭤봐요. 미리 생각해 두시면 편해요."),
        ],
        "restate": "“AI가 대신할 수 없는 건 이거예요.”",
        "honest": "이번 영상은 ‘AI가 다 해주는데 영어 공부를 해야 하나요?’처럼 부모님들이 요즘 가장 궁금해하는 질문들이에요. 질문이 날카롭게 느껴질 수 있지만, 선생님을 곤란하게 하려는 게 아니라 부모님들의 실제 고민을 대신 여쭤보는 거예요.",
    },
}

QUESTION_STEPS = [
    ("부모님 질문", "태블릿에 뜬 사연을 보고 바로 답해요"),
    ("판단 기준", "선생님은 무엇을 보고 판단하시는지"),
    ("실제 경험", "가르치며 만난 아이·부모님 이야기"),
    ("바로 해볼 한 가지", "부모님이 이번 주에 해볼 행동"),
]

CSS = """
@font-face{font-family:P;src:url(assets/Pretendard-Regular.woff2);font-weight:400}
@font-face{font-family:P;src:url(assets/Pretendard-Medium.woff2);font-weight:500}
@font-face{font-family:P;src:url(assets/Pretendard-SemiBold.woff2);font-weight:600}
@font-face{font-family:P;src:url(assets/Pretendard-Bold.woff2);font-weight:700}
@font-face{font-family:P;src:url(assets/Pretendard-ExtraBold.woff2);font-weight:800}
:root{--ink:#191c2b;--sub:#6b7080;--line:#e3e7ec;--paper:#ffffff;--yellow:#e6f9ed;--yellow-soft:#e6f9ed;--orange:#00c170;--orange-soft:#e6f9ed;--blue:#c2eed3;--blue-soft:#f3f5f8;--green-text:#0aa865;--green-deep:#0e955c}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:P,sans-serif;color:var(--ink);background:var(--paper);font-size:10.5pt;line-height:1.55;word-break:keep-all}
.page{width:210mm;height:297mm;padding:16mm 16mm 14mm;position:relative;page-break-after:always;overflow:hidden}
.page:last-child{page-break-after:auto}
.foot{position:absolute;left:16mm;right:16mm;bottom:9mm;font-size:8pt;color:var(--sub);display:flex;justify-content:space-between}
.hero{background:var(--yellow);border-radius:14px;padding:10mm 11mm 8mm;position:relative;overflow:hidden}
.hero:after{content:"";position:absolute;right:-18mm;bottom:-22mm;width:62mm;height:62mm;border-radius:50%;background:#00d37a;opacity:.9}
.hero:before{content:"";position:absolute;right:30mm;top:-14mm;width:30mm;height:30mm;border-radius:50%;background:#91e6b3;opacity:.7}
.eyebrow img{height:7mm;display:block}
.hero h1{font-size:25pt;font-weight:800;line-height:1.25;margin-top:4mm;position:relative;z-index:1}
.hero p{margin-top:4mm;font-size:10.5pt;max-width:120mm;position:relative;z-index:1;color:#3a3f4b}
h2{font-size:14pt;font-weight:800;margin:7mm 0 3mm;display:flex;align-items:center;gap:2.5mm}
h2 .num{display:inline-flex;width:7mm;height:7mm;border-radius:50%;background:var(--orange);color:#fff;font-size:9.5pt;align-items:center;justify-content:center}
.cards{display:grid;grid-template-columns:1fr 1fr;gap:3.5mm}
.card{border:1px solid var(--line);border-radius:10px;padding:4mm 4.5mm;background:#fff}
.card .k{font-size:8.5pt;color:var(--sub);font-weight:600}
.card .v{font-size:11.5pt;font-weight:700;margin-top:1mm}
.card .s{font-size:9pt;color:var(--sub);margin-top:.8mm}
.card.wide{grid-column:span 2}
.sched{margin-top:1.5mm}
.sched div{display:flex;gap:4mm;align-items:baseline;margin-top:1mm}
.sched b{font-size:11pt;min-width:30mm}
.sched span{font-size:10pt}
.tag{display:inline-block;font-size:8pt;font-weight:700;padding:.6mm 2.2mm;border-radius:20px;background:var(--orange-soft);color:var(--green-deep);margin-left:1.5mm}
.lead{font-size:10.5pt;color:#3a3f4b}
.parts{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
.part{border-radius:12px;padding:5mm;background:var(--yellow-soft)}
.part.p2{background:var(--blue-soft)}
.part .lb{font-size:8.5pt;font-weight:800;color:var(--orange)}
.part.p2 .lb{color:var(--green-text)}
.part .tt{font-size:12.5pt;font-weight:800;margin-top:1mm;line-height:1.35}
.story{display:flex;flex-wrap:wrap;gap:1.5mm;margin-top:3mm;align-items:center;font-size:9pt;font-weight:600}
.story span.ch{background:#fff;border-radius:20px;padding:.8mm 2.6mm}
.story i{font-style:normal;color:var(--sub)}
.flow{position:relative;margin-top:2mm}
.step{display:flex;gap:4mm;align-items:flex-start;position:relative;padding-bottom:3.2mm}
.step:not(:last-child):before{content:"";position:absolute;left:3.5mm;top:7mm;bottom:0;width:2px;background:var(--line)}
.dot{flex:0 0 7mm;height:7mm;border-radius:50%;background:#fff;border:2px solid var(--orange);color:var(--orange);font-weight:800;font-size:9pt;display:flex;align-items:center;justify-content:center;position:relative;z-index:1}
.p2f .dot{border-color:var(--green-text);color:var(--green-text)}
.step .t{font-weight:700;font-size:10.5pt}
.step .d{font-size:9.5pt;color:var(--sub)}
.step.q .t:after{content:"꼬리질문 있음";font-size:7.5pt;font-weight:700;color:var(--green-deep);background:var(--orange-soft);border-radius:20px;padding:.3mm 1.8mm;margin-left:2mm;vertical-align:1px}
.flowcols{display:grid;grid-template-columns:1fr 1fr;gap:6mm}
.flowcols.one,.parts.one{grid-template-columns:1fr}
.flowcols h3{font-size:11.5pt;font-weight:800;margin-bottom:3mm}
.flowcols h3 small{display:block;font-size:8.5pt;color:var(--sub);font-weight:600}
.qbox{border:1.5px dashed var(--orange);border-radius:12px;padding:4.5mm 5mm;margin-top:5mm;background:#fff}
.qbox .h{font-weight:800;font-size:11pt}
.qbox .h small{font-weight:500;color:var(--sub);font-size:9pt;margin-left:1.5mm}
.qsteps{display:flex;align-items:stretch;gap:2mm;margin-top:3mm}
.qs{flex:1;background:var(--orange-soft);border-radius:8px;padding:2.5mm 3mm}
.qs b{display:block;font-size:9.5pt}
.qs span{font-size:8.5pt;color:var(--green-deep)}
.arrow{align-self:center;color:var(--orange);font-weight:800}
.ox{display:grid;grid-template-columns:repeat(2,1fr);gap:2.5mm;margin-top:3mm}
.ox div{border-radius:8px;background:#fff;border:1px solid var(--line);padding:2.5mm 3mm;font-size:9pt}
.ox b{font-size:13pt;margin-right:1.5mm}
.prep{counter-reset:p}
.prep li{list-style:none;display:flex;gap:3.5mm;padding:2.6mm 0;border-bottom:1px solid var(--line)}
.prep li:last-child{border-bottom:0}
.chk{flex:0 0 5.5mm;height:5.5mm;border:2px solid var(--orange);border-radius:4px;margin-top:.6mm}
.prep b{display:block;font-size:10.5pt}
.prep span{font-size:9.5pt;color:#3a3f4b}
.note{background:var(--blue-soft);border-radius:12px;padding:4.5mm 5mm;font-size:9.5pt;margin-top:4mm}
.note b{display:block;font-size:10.5pt;margin-bottom:1mm}
.tips{display:flex;gap:2mm;margin-top:2.5mm}
.tips div{flex:1;background:#fff;border-radius:8px;padding:2.2mm 3mm;font-size:9pt}
.tips div b{display:inline;font-size:9pt;color:var(--green-text);margin:0 1mm 0 0}
table{width:100%;border-collapse:collapse;font-size:10pt}
th,td{text-align:left;padding:2.6mm 3mm;border-bottom:1px solid var(--line)}
th{font-size:8.5pt;color:var(--sub);font-weight:700}
td.time{font-weight:800;width:34mm}
.map{margin-top:3mm;border-radius:10px;overflow:hidden;border:1px solid var(--line)}
.map img{width:100%;height:120mm;object-fit:cover;object-position:52% 45%;display:block}
.addr{margin-top:0;display:flex;justify-content:space-between;gap:4mm;font-size:10pt}
.addr b{font-size:11pt}
"""


def esc(s):
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def flow_html(part, cls):
    rows = []
    for i, (t, d) in enumerate(part["flow"], 1):
        q = " q" if ("질문" in t) else ""
        rows.append(f'<div class="step{q}"><div class="dot">{i}</div><div><div class="t">{esc(t)}</div><div class="d">{esc(d)}</div></div></div>')
    return f'<div class="flow {cls}">{"".join(rows)}</div>'


def build(name, t):
    parts = t["parts"]
    one = " one" if len(parts) == 1 else ""
    sched = "".join(f"<div><b>{a}</b><span>{esc(b)}</span><span class='tag'>{esc(c)}</span></div>" for a, b, c in t["schedule"])
    story = lambda p: '<i>→</i>'.join(f'<span class="ch">{esc(x)}</span>' for x in p["story"])
    qsteps = '<span class="arrow">›</span>'.join(f'<div class="qs"><b>{a}</b><span>{b}</span></div>' for a, b in QUESTION_STEPS)
    prep = "".join(f'<li><div class="chk"></div><div><b>{esc(a)}</b><span>{esc(b)}</span></div></li>' for a, b in t["prepare"])
    part_boxes = "".join(f'<div class="part{" p2" if i else ""}"><div class="lb">{p["label"]}</div><div class="tt">{esc(p["title"])}</div><div class="story">{story(p)}</div></div>' for i, p in enumerate(parts))
    flows = "".join(f'<div><h3>{p["label"]} · {esc(p["title"])}</h3>{flow_html(p, "p2f" if i else "")}</div>' for i, p in enumerate(parts))
    ab = f'<p class="lead" style="margin-top:3mm;color:var(--sub)">{esc(t["ab"])}</p>' if t.get("ab") else ""
    honest = f'''<div class="note">
    {esc(t['honest'])}
    <div class="tips">
      <div><b>①</b>“그런 면도 있어요”</div>
      <div><b>②</b>“다만 이건 달라요”</div>
      <div><b>③</b>“그래서 이렇게 해보세요”</div>
    </div>
    <p style="margin-top:2.5mm">이 순서로 답해 주시면 편해요. 부담되는 질문이 있으면 촬영 전에 미리 말씀해 주세요.</p>
  </div>''' if t.get("honest") else ""
    honest_sec = f'<h2 style="margin-top:0"><span class="num">4</span>솔직한 질문에 대해</h2>\n  {honest}' if t.get("honest") else ""
    foot = f'<div class="foot"><span>리얼아카데미 · Q&amp;A 영상 촬영 안내</span><span>{name} 선생님</span></div>'
    return f"""<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>{name} 선생님 촬영 안내</title><style>{CSS}</style></head><body>

<section class="page">
  <div class="hero">
    <div class="eyebrow"><img src="assets/logo_navy.png" alt="REAL ACADEMY"></div>
    <h1>{name} 선생님,<br>Q&amp;A 영상 촬영 안내드려요</h1>
    <p>부모님들께 미리 받은 질문에 선생님이 직접 답해 주시는 영상이에요. 촬영 정보와 촬영 순서, 오시는 길을 정리했어요.</p>
  </div>

  <h2><span class="num">1</span>촬영 정보</h2>
  <div class="cards">
    <div class="card"><div class="k">날짜</div><div class="v">{SHOOT['date']}</div></div>
    <div class="card"><div class="k">장소</div><div class="v">{SHOOT['place']}</div><div class="s">{SHOOT['address']}<br>{SHOOT['parking']}</div></div>
    <div class="card wide"><div class="k">타임테이블 · {name} 선생님 촬영 시간</div><div class="sched">{sched}</div><div class="s" style="margin-top:2mm">※ 이 문서는 Q&amp;A 촬영 안내예요. 마케팅 촬영 내용은 별도로 정리해 전달드릴게요.</div></div>
  </div>

  <h2><span class="num">2</span>어떤 영상인가요?</h2>
  <p class="lead"><b>이 영상을 볼 분들</b> — {esc(t['viewer'])}</p>
  <div class="parts{one}" style="margin-top:4mm">{part_boxes}</div>
  <div class="note" style="margin-top:5mm">
    <b>영상에는 선생님만 나와요</b>
    대본을 외우실 필요는 없어요. O/X 문장과 부모님 질문은 <strong>카메라 바로 아래 태블릿</strong>에 띄워 드리고, 이어지는 질문은 현장에서 말로 여쭤봐요. 질문하는 목소리는 편집에서 빠지고 화면에는 질문 자막이 들어가요. 그래서 <strong>답의 첫 문장은 질문 없이도 뜻이 통하게</strong> 말씀해 주시면 좋아요.
    <div class="tips"><div>예) {esc(t['restate'])}</div></div>
  </div>
  {foot}
</section>

<section class="page">
  <h2 style="margin-top:0"><span class="num">3</span>촬영 흐름</h2>
  <p class="lead">위에서 아래로 이 순서대로 진행돼요. 의자에 앉아 이야기하시는 형식이에요.</p>
  {ab}
  <div class="flowcols{one}" style="margin-top:5mm">{flows}</div>

  <div class="qbox" style="border-color:var(--blue)">
    <div class="h">O/X는 이렇게 답해 주세요<small>정답 맞히기가 아니라 선생님의 생각이에요</small></div>
    <div class="ox">
      <div><b style="color:var(--orange)">O</b>맞다고 생각하실 때</div>
      <div><b style="color:#c8442a">X</b>아니라고 생각하실 때</div>
    </div>
    <p style="font-size:9.5pt;margin-top:2.5mm;color:#3a3f4b">태블릿에 문장이 뜨면 보자마자 O 또는 X로 답하고, <strong>한 줄 이유</strong>만 덧붙여 주세요. 짧고 분명할수록 좋아요.</p>
  </div>

  <p class="lead" style="margin-top:5mm">본편이 끝나면 같은 자리에서 <b>짧은 추가 질문</b>을 몇 개 더 여쭤봐요. 한두 문장으로 편하게 답해 주시면 됩니다.</p>
  {foot}
</section>

<section class="page">

  {honest_sec}

  <h2{' style="margin-top:0"' if not t.get("honest") else ''}><span class="num">{5 if t.get("honest") else 4}</span>오시는 길</h2>
  <div class="addr"><div><b>{SHOOT['place']}</b><br>{SHOOT['address']}</div><div style="text-align:right;color:var(--sub)">선생님 차량 스튜디오 주차 가능</div></div>
  <div class="map"><img src="assets/map.png" alt="1028studio 위치 지도"></div>
  {foot}
</section>
</body></html>"""


if __name__ == "__main__":
    for name, t in TEACHERS.items():
        out = ROOT / f"{t['file']}.html"
        out.write_text(build(name, t), encoding="utf-8")
        print(out)

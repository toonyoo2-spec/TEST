"""선생님 전달용 촬영 안내 HTML 생성 → render.js로 PDF 변환."""
from pathlib import Path

ROOT = Path(__file__).parent

SHOOT = {
    "date": "2026년 10월 10일 (토)",
    "place": "1028studio",
    "address": "서울 서초구 강남대로109길 73-21 지하 1층",
    "near": "3호선·신분당선 신사역 인근",
    "parking": "선생님 차량은 스튜디오에 2대까지 주차할 수 있어요.",
}

TEACHERS = {
    "줄리": {
        "file": "줄리_선생님_촬영안내",
        "schedule": [
            ("13:00 – 15:00", "마케팅 촬영", "Julie & David 선생님"),
            ("15:00 – 16:00", "Q&A 촬영", "Julie & David 선생님"),
        ],
        "viewer": "초3 무렵 영어를 처음 시작하는 아이를 둔 부모님. 대치동 학원에 보내기 어려운 환경에서 ‘우리 아이만 늦은 건 아닐까’ 고민하는 분들이에요.",
        "parts": [
            {
                "label": "1부",
                "title": "초3 영어, 지금 시작해도 늦지 않았을까요?",
                "story": ["늦은 걸까?", "무엇부터?", "잘 가고 있을까?"],
                "flow": [
                    ("인사", "짧은 자기소개와 오늘 다룰 고민 소개"),
                    ("O/X 10문항", "카드 문장을 읽고 O/X/△와 한 줄 이유"),
                    ("부모님 질문 ①", "시작 시기와 대치동 아이들과의 차이"),
                    ("부모님 질문 ②", "파닉스·단어·원서·문법, 무엇부터 시작할까"),
                    ("속마음 한마디", "아이가 영어를 재미있어한다고 느끼는 순간"),
                    ("부모님 질문 ③", "시작하고 3개월, 잘 가고 있는지 확인하는 법"),
                    ("마무리 한 문장", "흔들리는 초3 부모님께 드리는 한 문장"),
                ],
            },
            {
                "label": "2부",
                "title": "조금 더 솔직한 이야기",
                "story": ["원서", "레벨테스트", "대치동 방식"],
                "flow": [
                    ("O/X 10문항", "부모님들이 흔히 믿는 이야기에 대한 판정"),
                    ("솔직한 질문 ①", "원서, 꼭 읽어야 할까? (문제집과 비교)"),
                    ("솔직한 질문 ②", "레벨테스트 점수, 믿어도 될까?"),
                    ("번개 O/X 2문항", "선행과 문법에 대한 빠른 판정"),
                    ("솔직한 질문 ③", "대치동 방식, 꼭 따라가야 할까?"),
                    ("선생님께 되묻기", "선생님이 학부모라면 어떻게 하실지"),
                    ("마무리 한 문장", "대치동 방식에서 딱 하나만 가져간다면"),
                ],
            },
        ],
        "prepare": [
            ("소개 정보 확인", "자막에 들어갈 경력과 소속을 확인해 주세요. 현재 ‘대치동 15년차 · 리얼아카데미 대치 라이브’로 준비하고 있어요."),
            ("가르친 아이들의 사례", "질문마다 “실제로 그런 아이가 있었나요?”를 여쭤봐요. 초3에 시작해 빠르게 따라온 아이, 원서와 문제집에서 차이가 났던 아이처럼 떠오르는 사례를 2~3개 생각해 와 주세요. 이름 등 개인정보는 빼고 말씀해 주시면 됩니다."),
            ("바로 해볼 수 있는 행동", "질문마다 마지막에 “부모님이 이번 주에 해볼 한 가지”를 여쭤봐요. 구체적인 행동일수록 좋아요."),
            ("짧은 시연", "1부 두 번째 질문에서 ‘첫 책을 읽는 10분’을 부모님 입장에서 실제로 말하듯 보여주시는 장면을 부탁드릴 예정이에요."),
            ("마무리 한 문장", "1부·2부 끝에 한 문장씩 여쭤봐요. 미리 생각해 두시면 편해요."),
        ],
        "honest": "2부는 부모님들이 속으로는 궁금하지만 선생님께 대놓고 묻기 어려웠던 질문들이에요. 질문이 날카롭게 느껴질 수 있지만, 선생님을 곤란하게 하려는 게 아니라 부모님들의 실제 고민을 대신 여쭤보는 거예요.",
    },
    "애니": {
        "file": "애니_선생님_촬영안내",
        "schedule": [
            ("16:00 – 17:00", "Q&A 촬영", "Annie 선생님"),
            ("17:00 – 19:00", "마케팅 촬영", "Annie 선생님"),
        ],
        "viewer": "아이 영어를 집에서 어떻게 도와줘야 할지 막막한 초등 부모님. 특히 ‘내가 영어를 못하는데 도와줄 수 있을까’ 부담을 느끼는 분들이에요.",
        "parts": [
            {
                "label": "1부",
                "title": "집에서는 어떻게 도와줄까요?",
                "story": ["부모의 역할", "책 읽기", "단어"],
                "flow": [
                    ("인사", "짧은 자기소개와 오늘 다룰 고민 소개"),
                    ("O/X 10문항", "카드 문장을 읽고 O/X/△와 한 줄 이유"),
                    ("부모님 질문 ①", "부모가 영어를 잘 못해도 도와줄 수 있을까"),
                    ("부모님 질문 ②", "영어책만 펴면 도망가는 아이"),
                    ("번개 O/X 2문항", "책 읽기에 대한 빠른 판정"),
                    ("부모님 질문 ③", "외운 단어를 금방 잊는 아이"),
                    ("속마음 한마디", "부모님께 들었던 말 중 가장 기억에 남는 말"),
                    ("마무리 한 문장", "학부모에게 꼭 전하고 싶은 한 문장"),
                ],
            },
            {
                "label": "2부",
                "title": "AI 시대, 영어 공부 솔직 토크",
                "story": ["AI가 다 해주는데?", "집에서 AI 쓰기"],
                "flow": [
                    ("AI O/X 3문항", "AI 번역·첨삭·요약에 대한 빠른 판정"),
                    ("솔직한 질문 ①", "AI가 다 해주는데, 원서 같은 걸 굳이 읽어야 할까?"),
                    ("솔직한 질문 ②", "숙제를 ChatGPT로 해오는 아이, 막아야 할까?"),
                    ("마무리 한 문장", "공부법과 AI 도구를 고를 때 가장 먼저 볼 기준"),
                ],
            },
        ],
        "prepare": [
            ("소개 정보 확인", "자막에 들어갈 경력 연차, 주로 가르치는 학년, 수업 특징을 미리 알려주세요."),
            ("가르친 아이들·부모님 사례", "질문마다 “실제로 그런 경우가 있었나요?”를 여쭤봐요. 영어에 자신 없던 부모님이 잘 도와주신 사례, 책을 싫어하던 아이가 달라진 계기처럼 떠오르는 사례를 2~3개 생각해 와 주세요. 이름 등 개인정보는 빼고 말씀해 주시면 됩니다."),
            ("오늘 저녁 바로 해볼 행동", "질문마다 마지막에 “오늘 집에서 해볼 한 가지”를 여쭤봐요. 특히 ‘오늘 저녁 10분 함께 읽기’는 시작·중간·끝으로 나눠 말씀해 주시면 좋아요."),
            ("짧은 시연", "부모님이 아이에게 실제로 할 말을 선생님이 직접 말하듯 보여주시는 장면을 부탁드릴 예정이에요."),
            ("AI에 대한 생각", "2부에서는 AI 번역·요약·ChatGPT 숙제·AI 영어 대화 앱에 대해 여쭤봐요. 수업에서 본 아이들의 모습과 집에서 AI를 쓸 때의 규칙 한 가지를 생각해 와 주세요."),
            ("마무리 한 문장", "1부·2부 끝에 한 문장씩 여쭤봐요. 미리 생각해 두시면 편해요."),
        ],
        "honest": "2부는 ‘AI가 다 해주는데 영어 공부를 해야 하나요?’처럼 부모님들이 요즘 가장 궁금해하는 질문들이에요. 질문이 날카롭게 느껴질 수 있지만, 선생님을 곤란하게 하려는 게 아니라 부모님들의 실제 고민을 대신 여쭤보는 거예요.",
    },
}

QUESTION_STEPS = [
    ("부모님 사연", "실제 부모님 질문을 읽어드려요"),
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
:root{--ink:#24211c;--sub:#6b655b;--line:#e6dfd2;--paper:#fffdf8;--yellow:#fbe7a1;--yellow-soft:#fff6d9;--orange:#e8692e;--orange-soft:#fde3d4;--blue:#8fb0d6;--blue-soft:#e6eef8}
@page{size:A4;margin:0}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:P,sans-serif;color:var(--ink);background:var(--paper);font-size:10.5pt;line-height:1.55;word-break:keep-all}
.page{width:210mm;height:297mm;padding:16mm 16mm 14mm;position:relative;page-break-after:always;overflow:hidden}
.page:last-child{page-break-after:auto}
.foot{position:absolute;left:16mm;right:16mm;bottom:9mm;font-size:8pt;color:var(--sub);display:flex;justify-content:space-between}
.hero{background:var(--yellow);border-radius:14px;padding:13mm 11mm 10mm;position:relative;overflow:hidden}
.hero:after{content:"";position:absolute;right:-18mm;bottom:-22mm;width:62mm;height:62mm;border-radius:50%;background:var(--orange);opacity:.9}
.hero:before{content:"";position:absolute;right:30mm;top:-14mm;width:30mm;height:30mm;border-radius:50%;background:var(--blue);opacity:.55}
.eyebrow{font-size:9pt;font-weight:700;letter-spacing:.08em;color:#8a5a12}
.hero h1{font-size:25pt;font-weight:800;line-height:1.25;margin-top:4mm;position:relative;z-index:1}
.hero p{margin-top:4mm;font-size:10.5pt;max-width:120mm;position:relative;z-index:1;color:#4a4336}
h2{font-size:14pt;font-weight:800;margin:9mm 0 3.5mm;display:flex;align-items:center;gap:2.5mm}
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
.tag{display:inline-block;font-size:8pt;font-weight:700;padding:.6mm 2.2mm;border-radius:20px;background:var(--orange-soft);color:#a6461a;margin-left:1.5mm}
.lead{font-size:10.5pt;color:#3d382f}
.parts{display:grid;grid-template-columns:1fr 1fr;gap:4mm}
.part{border-radius:12px;padding:5mm;background:var(--yellow-soft)}
.part.p2{background:var(--blue-soft)}
.part .lb{font-size:8.5pt;font-weight:800;color:var(--orange)}
.part.p2 .lb{color:#3e6a9e}
.part .tt{font-size:12.5pt;font-weight:800;margin-top:1mm;line-height:1.35}
.story{display:flex;flex-wrap:wrap;gap:1.5mm;margin-top:3mm;align-items:center;font-size:9pt;font-weight:600}
.story span.ch{background:#fff;border-radius:20px;padding:.8mm 2.6mm}
.story i{font-style:normal;color:var(--sub)}
.flow{position:relative;margin-top:2mm}
.step{display:flex;gap:4mm;align-items:flex-start;position:relative;padding-bottom:3.2mm}
.step:not(:last-child):before{content:"";position:absolute;left:3.5mm;top:7mm;bottom:0;width:2px;background:var(--line)}
.dot{flex:0 0 7mm;height:7mm;border-radius:50%;background:#fff;border:2px solid var(--orange);color:var(--orange);font-weight:800;font-size:9pt;display:flex;align-items:center;justify-content:center;position:relative;z-index:1}
.p2f .dot{border-color:#5f8bc0;color:#3e6a9e}
.step .t{font-weight:700;font-size:10.5pt}
.step .d{font-size:9.5pt;color:var(--sub)}
.step.q .t:after{content:"4단계";font-size:7.5pt;font-weight:700;color:#a6461a;background:var(--orange-soft);border-radius:20px;padding:.3mm 1.8mm;margin-left:2mm;vertical-align:1px}
.flowcols{display:grid;grid-template-columns:1fr 1fr;gap:6mm}
.flowcols h3{font-size:11.5pt;font-weight:800;margin-bottom:3mm}
.flowcols h3 small{display:block;font-size:8.5pt;color:var(--sub);font-weight:600}
.qbox{border:1.5px dashed var(--orange);border-radius:12px;padding:4.5mm 5mm;margin-top:5mm;background:#fff}
.qbox .h{font-weight:800;font-size:11pt}
.qbox .h small{font-weight:500;color:var(--sub);font-size:9pt;margin-left:1.5mm}
.qsteps{display:flex;align-items:stretch;gap:2mm;margin-top:3mm}
.qs{flex:1;background:var(--orange-soft);border-radius:8px;padding:2.5mm 3mm}
.qs b{display:block;font-size:9.5pt}
.qs span{font-size:8.5pt;color:#6e4a35}
.arrow{align-self:center;color:var(--orange);font-weight:800}
.ox{display:grid;grid-template-columns:repeat(3,1fr);gap:2.5mm;margin-top:3mm}
.ox div{border-radius:8px;background:#fff;border:1px solid var(--line);padding:2.5mm 3mm;font-size:9pt}
.ox b{font-size:13pt;margin-right:1.5mm}
.prep{counter-reset:p}
.prep li{list-style:none;display:flex;gap:3.5mm;padding:2.6mm 0;border-bottom:1px solid var(--line)}
.prep li:last-child{border-bottom:0}
.chk{flex:0 0 5.5mm;height:5.5mm;border:2px solid var(--orange);border-radius:4px;margin-top:.6mm}
.prep b{display:block;font-size:10.5pt}
.prep span{font-size:9.5pt;color:#4a4336}
.note{background:var(--blue-soft);border-radius:12px;padding:4.5mm 5mm;font-size:9.5pt;margin-top:4mm}
.note b{display:block;font-size:10.5pt;margin-bottom:1mm}
.tips{display:flex;gap:2mm;margin-top:2.5mm}
.tips div{flex:1;background:#fff;border-radius:8px;padding:2.2mm 3mm;font-size:9pt}
.tips div b{display:inline;font-size:9pt;color:#3e6a9e;margin:0 1mm 0 0}
table{width:100%;border-collapse:collapse;font-size:10pt}
th,td{text-align:left;padding:2.6mm 3mm;border-bottom:1px solid var(--line)}
th{font-size:8.5pt;color:var(--sub);font-weight:700}
td.time{font-weight:800;width:34mm}
.map{margin-top:3mm;border-radius:10px;overflow:hidden;border:1px solid var(--line)}
.map img{width:100%;height:50mm;object-fit:cover;object-position:52% 45%;display:block}
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
    p1, p2 = t["parts"]
    sched = "".join(f"<div><b>{a}</b><span>{esc(b)}</span><span class='tag'>{esc(c)}</span></div>" for a, b, c in t["schedule"])
    story = lambda p: '<i>→</i>'.join(f'<span class="ch">{esc(x)}</span>' for x in p["story"])
    qsteps = '<span class="arrow">›</span>'.join(f'<div class="qs"><b>{a}</b><span>{b}</span></div>' for a, b in QUESTION_STEPS)
    prep = "".join(f'<li><div class="chk"></div><div><b>{esc(a)}</b><span>{esc(b)}</span></div></li>' for a, b in t["prepare"])
    foot = f'<div class="foot"><span>리얼아카데미 · Q&amp;A 영상 촬영 안내</span><span>{name} 선생님</span></div>'
    return f"""<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>{name} 선생님 촬영 안내</title><style>{CSS}</style></head><body>

<section class="page">
  <div class="hero">
    <div class="eyebrow">REAL ACADEMY · Q&amp;A VIDEO</div>
    <h1>{name} 선생님,<br>Q&amp;A 영상 촬영 안내드려요</h1>
    <p>부모님들께 미리 받은 질문에 선생님이 직접 답해 주시는 영상이에요. 촬영 순서와 미리 준비해 주실 내용을 한 장씩 정리했어요.</p>
  </div>

  <h2><span class="num">1</span>촬영 정보</h2>
  <div class="cards">
    <div class="card"><div class="k">날짜</div><div class="v">{SHOOT['date']}</div></div>
    <div class="card"><div class="k">장소</div><div class="v">{SHOOT['place']}</div><div class="s">{SHOOT['address']}</div></div>
    <div class="card wide"><div class="k">타임테이블 · {name} 선생님 촬영 시간</div><div class="sched">{sched}</div></div>
    <div class="card wide"><div class="k">주차</div><div class="v" style="font-size:10.5pt">{SHOOT['parking']}</div></div>
  </div>

  <h2><span class="num">2</span>어떤 영상인가요?</h2>
  <p class="lead"><b>이 영상을 볼 분들</b> — {esc(t['viewer'])}</p>
  <div class="parts" style="margin-top:4mm">
    <div class="part"><div class="lb">{p1['label']}</div><div class="tt">{esc(p1['title'])}</div><div class="story">{story(p1)}</div></div>
    <div class="part p2"><div class="lb">{p2['label']}</div><div class="tt">{esc(p2['title'])}</div><div class="story">{story(p2)}</div></div>
  </div>
  <p class="lead" style="margin-top:4mm">대본을 외우실 필요는 없어요. 진행자가 순서대로 질문을 드리면, 평소 상담하시듯 편하게 말씀해 주시면 됩니다.</p>
  {foot}
</section>

<section class="page">
  <h2 style="margin-top:0"><span class="num">3</span>촬영 흐름</h2>
  <p class="lead">위에서 아래로 이 순서대로 진행돼요. 의자에 앉아 진행자와 대화하는 형식이에요.</p>
  <div class="flowcols" style="margin-top:5mm">
    <div><h3>{p1['label']} · {esc(p1['title'])}</h3>{flow_html(p1, '')}</div>
    <div><h3>{p2['label']} · {esc(p2['title'])}</h3>{flow_html(p2, 'p2f')}</div>
  </div>

  <div class="qbox">
    <div class="h">‘질문’은 모두 같은 4단계로 진행돼요<small>흐름 안의 <b style="color:#a6461a">4단계</b> 표시</small></div>
    <div class="qsteps">{qsteps}</div>
  </div>

  <div class="qbox" style="border-color:var(--blue)">
    <div class="h">O/X는 이렇게 답해 주세요<small>정답 맞히기가 아니라 선생님의 생각이에요</small></div>
    <div class="ox">
      <div><b style="color:#2f8f5b">O</b>맞다고 생각하실 때</div>
      <div><b style="color:#c8442a">X</b>아니라고 생각하실 때</div>
      <div><b style="color:#3e6a9e">△</b>“경우에 따라 달라요”</div>
    </div>
    <p style="font-size:9.5pt;margin-top:2.5mm;color:#4a4336">판정 뒤에 <b>한 줄 이유</b>만 덧붙여 주세요. 짧고 분명할수록 좋아요.</p>
  </div>

  <p class="lead" style="margin-top:5mm">본편이 끝나면 같은 자리에서 <b>짧은 추가 질문</b>을 몇 개 더 여쭤봐요. 한두 문장으로 편하게 답해 주시면 됩니다.</p>
  {foot}
</section>

<section class="page">
  <h2 style="margin-top:0"><span class="num">4</span>미리 준비해 주세요</h2>
  <ul class="prep">{prep}</ul>

  <div class="note">
    <b>2부 솔직한 질문에 대해</b>
    {esc(t['honest'])}
    <div class="tips">
      <div><b>①</b>“그런 면도 있어요”</div>
      <div><b>②</b>“다만 이건 달라요”</div>
      <div><b>③</b>“그래서 이렇게 해보세요”</div>
    </div>
    <p style="margin-top:2.5mm">이 순서로 답해 주시면 편해요. 부담되는 질문이 있으면 촬영 전에 미리 말씀해 주세요.</p>
  </div>

  <h2><span class="num">5</span>오시는 길</h2>
  <div class="addr"><div><b>{SHOOT['place']}</b><br>{SHOOT['address']}</div><div style="text-align:right;color:var(--sub)">{SHOOT['near']}<br>선생님 차량 2대 주차 가능</div></div>
  <div class="map"><img src="assets/map.png" alt="1028studio 위치 지도"></div>
  {foot}
</section>
</body></html>"""


if __name__ == "__main__":
    for name, t in TEACHERS.items():
        out = ROOT / f"{t['file']}.html"
        out.write_text(build(name, t), encoding="utf-8")
        print(out)

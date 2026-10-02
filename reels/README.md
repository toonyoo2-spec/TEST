# 리얼 아카데미 릴스 A·B·C (30초 × 3편, 텍스트 모션그래픽 검토본)

| 편 | 영상 (오디오 포함) | 무음본 | 표지 |
|---|---|---|---|
| A 단어에서 내 문장으로 | `out/A.mp4` | `out/A-silent.mp4` | `out/A-cover.png` |
| B 수업이 집으로 오는 순간 | `out/B.mp4` | `out/B-silent.mp4` | `out/B-cover.png` |
| C 공부 끝, 그다음의 확인 | `out/C.mp4` | `out/C-silent.mp4` | `out/C-cover.png` |

- 각 파일 독립: 1080×1920, 30fps 고정, 900프레임, 30.000초, H.264 High / yuv420p (bt709), 오디오 AAC 48kHz 스테레오 (`X.mp4`만)
- 검수 결과: `validation/report.md` (자동 검수 실패 0건) · 근거 프레임 `validation/frames/` · 360px 시트 `validation/sheets/`
- 사용 파일·권리·대체·교체 목록: `ASSETS-MANIFEST.md` · 음향: `CUESHEET.md`
- **v2 타이포 중심 디자인** (피드백 반영): 짙은 배경(#0E1013) + 흰 대형 타이포, 강조 단어는 900 굵기 + 라임(#C6F25E) 슬래브. 줄마다 폭 920px(x 80~1000)을 채우도록 72~150px 자동 크기, 마스크 안에서 0.2초 안에 올라오는 등장 / 0.1초 위로 빠지는 퇴장, 컷 전환마다 라임 슬래브 와이프(등장 0.2초 안에서만), 장면 요소 오버슛 팝.
  - 브리프 원안(본문 72~84px, x 90~900)보다 크고 넓게 잡았습니다. 읽는 동안 위치·크기 고정, 정지 구간, CTA 4초 완전 정지는 그대로입니다.
- **임시 스타일**: 브랜드 규정 미제공 → 짙은 배경/흰 글자/강조색 1개, Noto Sans KR(OFL). **음원은 코드 합성 임시 음원**(브랜드 승인 전)

## 구조

```
src/data/{A,B,C}.json   컷 데이터 (33컷: 프레임 범위, 주 카피·줄바꿈·강조, 보조 문자열, 정지 구간, 음향 큐) — 카피 수정은 여기서
src/stage.html          1080×1920 스테이지 (?ep=A|B|C)
src/js/engine.js        프레임 결정적 엔진: renderFrame(f), 키네틱 주 카피 레이어(마스크 등장/정지/퇴장), 줄별 폭 맞춤(72~150px)
src/js/common.js        태블릿·아이콘·보조 라벨·라임 와이프·오버슛 팝·공통 CTA 마스터
src/js/ep-{A,B,C}.js    편별 장면 레이어
src/cover.html          공통 표지 시스템 (?ep=)
src/css/style.css       디자인 토큰 (임시 스타일)
scripts/prepare_ui_assets.py  실제 UI 캡처 정제 (코인·날짜·얼굴 등 블러/마스킹)
scripts/render.mjs      Playwright(Chromium) 프레임 캡처 → ffmpeg(libx264) 인코드 / 표지 / DOM 검수 덤프
scripts/audio.mjs       편별 BGM·효과음 수식 합성 (외부 샘플 없음)
scripts/mux.py          −16 LUFS 정규화 + 리미터, 영상과 결합, 무음본 생성
scripts/validate.py     자가 검수 → validation/report.{md,json}
```

모든 텍스트는 DOM 텍스트(편집 가능)이며 이미지에 한글을 굽지 않았습니다. 화면에 보이는 UI 문자열(GV 라이팅·오늘의 대치 라이브·시간표)은 제공된 실제 캡처의 크롭입니다.

## 설치 · 렌더 (재현 명령)

필요: Node 18+ (검증 22.22), Python 3.10+ (검증 3.11), ffmpeg 6.x (ffmpeg/ffprobe, libx264), Chromium(Playwright).

```bash
cd reels
npm install                          # playwright 1.56.1
npx playwright install chromium      # 브라우저가 이미 있으면 생략 (PLAYWRIGHT_BROWSERS_PATH)
pip install pillow numpy fonttools

npm run all
#  = python3 scripts/prepare_ui_assets.py      # assets/derived/*
#    node scripts/render.mjs --ep A,B,C        # build/X-video.mp4 + build/X-frames.json + validation/frames (약 5분, 4코어)
#    node scripts/render.mjs --cover A,B,C     # out/X-cover.png
#    node scripts/render.mjs --inspect A,B,C   # build/X-inspect.json (DOM 텍스트·위치·카피 상태)
#    node scripts/audio.mjs                    # build/audio/*.wav
#    python3 scripts/mux.py                    # out/X.mp4, out/X-silent.mp4
#    python3 scripts/validate.py               # validation/report.md
```

미리보기: `node scripts/render.mjs --ep B --preview 0,200,800` → `build/preview/B/`.

## 렌더 결정성에 관한 메모

- 모든 상태가 프레임 번호의 순수 함수(CSS 애니메이션·타이머 없음).
- Chromium이 불투명도 애니메이션이 끝난 레이어를 몇 프레임 뒤 다시 래스터화해 정지 구간에 1px 차이가 생기던 문제 → 장면 요소 `will-change: opacity` 고정 + 프레임마다 연속 2회 동일 캡처까지 재촬영.
- 정지 구간(`holds`, CTA 포함)은 시작 프레임을 강제 I-프레임(q=6)으로, 나머지 동일 프레임을 q=51로 인코드 → x264가 skip으로 처리해 디코드 결과가 비트 단위로 동일. B-프레임·psy·AQ·mbtree·weightp 끔(평면 그래픽에서 정지 블록이 다시 코딩되는 것을 방지). 검수기가 원본 동일성(MD5)·디코드 동일성·PSNR(41~51dB)을 확인.

## 미검증

학부모 이해도·시청 유지율·상담 전환은 실측 전 **미검증**. 실제 귀로 듣는 청취 리뷰와 실제 휴대폰 Reels 앱 위 가림 확인은 하지 않았고(라우드니스·덕킹은 WAV 수치로, UI 가림은 근사 오버레이 박스로 확인), 외부 게시·상담 신청은 실행하지 않았습니다.

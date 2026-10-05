# Blender 블록아웃 (프리비즈)

리얼아카데미 스크롤 영상의 공간 배치와 카메라 경로를 회색 3D로 고정한 자료다. Seedance 2.5에 참조 영상으로 넣어 실사화한다. 전체 기획과 프롬프트는 상위 폴더의 `real-academy-scroll-video-prompt.md`(§4-5)에 있다.

## 파일

| 파일 | 설명 |
|---|---|
| `make_blockout.py` | 장면 생성·렌더 스크립트. 모든 수치가 파일 위쪽 상수에 있음 |
| `blockout.blend` | 스크립트가 만든 Blender 파일. Blender 4.2 이상에서 바로 열 수 있음 |
| `render/blockout_previs_8s_24fps.mp4` | 참조 영상. 8초, 24fps, 192프레임, 1280×720, H.264, 모든 프레임 키프레임 |
| `render/frame_000_start.png` 외 | 시작·이동 시작·중간·이동 끝·마지막 정지 이미지 |
| `render/top_view_camera_path.png` | 위에서 본 배치와 카메라 경로(초록 = 시작, 파랑 = 끝) |
| `render/contact_sheet_every16f.jpg` | 16프레임 간격 미리보기 |

## 다시 만들기

```bash
python3.11 -m venv venv
./venv/bin/pip install bpy==4.2.0
./venv/bin/python make_blockout.py                 # 정지 이미지 + 영상
./venv/bin/python make_blockout.py --stills-only   # 정지 이미지만(빠른 확인)
BLOCKOUT_ENGINE=CYCLES ./venv/bin/python make_blockout.py --stills-only   # 조명 포함, 느림
```

- `bpy` 4.2는 Python 3.11 전용이다.
- 화면 없는 Linux 서버에서 기본 엔진(Workbench)을 쓰려면 Mesa EGL이 필요하다: `apt-get install libegl1 libgl1-mesa-dri libegl-mesa0 libgbm1`. 스크립트가 `EGL_PLATFORM=surfaceless`를 자동 설정한다.
- Workbench 그림자는 꺼 두었다. 소프트웨어 렌더에서 세로 띠 결함이 생겼기 때문이다.
- Blender 앱이 있다면 `blockout.blend`를 열어 카메라 `ShotCam`을 직접 수정해도 된다. 단, 스크립트를 다시 실행하면 덮어쓴다.

## 좌표와 주요 값

- 단위 m. 아이는 원점에 앉아 +Y(책상) 방향을 본다. +X가 아이 오른쪽, +Z가 위.
- 카메라 각도 θ: 위에서 볼 때 아이 정면(+Y)에서 오른쪽(+X)으로 도는 시계 방향.

| 항목 | 값 |
|---|---|
| 렌즈 | 50mm 고정(센서 폭 36mm) |
| 시간 | 0–2초 정지, 2–7초 이동(smootherstep 가감속), 7–8초 정지 |
| 시작 카메라 | θ 30°, 피벗(0, 0.25)에서 1.70m, 높이 0.92m, 아이 얼굴과 태블릿 뒷면 사이를 봄 |
| 끝 카메라 | θ 145°, 피벗(0, 0.30)에서 0.43m(오른쪽 귀 옆), 높이 1.18m, 태블릿 화면 중앙을 봄 |
| 책상 | 1.2 × 0.6m, 높이 0.70m, 벽에서 떨어져 방 쪽을 향함 |
| 태블릿 | 211 × 124.7 × 8mm, 화면 189.5 × 113.7mm(8.7인치 5:3), 22° 뒤로 기울어 아이 눈높이를 향함 |
| 마커 | 검은 십자 5개(모서리 안쪽 14mm에 4개, 중앙에 작은 것 1개) |
| 방 | 아이 등 뒤 벽: 그림·책장·문 / 왼쪽 벽: 창문 / 책상 너머: 침대·옷장 |

자주 바꿀 값은 `CAM_START`, `CAM_END`, `LOOK_START`, `LOOK_END`, `LENS_MM`, `MOVE_START_S`, `MOVE_END_S`다.

## 알려진 한계와 다음 단계

- 아이는 단순 도형이라 연기(입 모양, 미소)는 표현하지 않는다. 연기는 Seedance 프롬프트로 지시한다.
- 회전 중간(약 4.5–5.5초)에 카메라가 아이 머리 가까이 지나간다. 실사화했을 때 머리·얼굴이 일그러지면 `CAM_END`의 반경이나 높이를 키운다.
- Higgsfield에서 시작 프레임과 참조 영상을 함께 넣을 수 있는지는 확인되지 않았다.
- 다른 도구(예: Codex)로 이어서 작업할 때는 이 README, `make_blockout.py`, 상위 문서 §4-0·§4-5를 함께 넘기면 된다.

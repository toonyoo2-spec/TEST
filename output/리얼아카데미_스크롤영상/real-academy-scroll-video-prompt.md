# 리얼아카데미 스크롤 영상 — 기획, 영문 프롬프트, 검토 사항

- 작성일: 2026-10-05 (한국 시간)
- 상태: 논의용 제작 초안. 영상 생성 및 크레딧 사용 없음.
- 목적: 아이가 방에서 태블릿을 사용하는 모습에서 출발해, 카메라 이동으로 리얼아카데미 스피킹 화면을 드러내는 웹사이트용 영상.
- 참조: [토스 홈페이지](https://toss.im/)
- 제작 순서: 구도 확정 → 참조 이미지 → 영상 생성 → 실제 앱 화면 합성 → 최종 영상에서 프레임 추출 → 스크롤 연동.
- 품질 목표: 실제 TV 상업광고에 어울리는 고품질 실사 영상. 단순한 AI 데모 수준은 통과시키지 않는다.
- 비용 원칙: 제작 직전까지 반복 수정·검토하여 실패 가능성을 낮춘다. 유료 영상 생성은 최종 브리프와 실행 설정, 회당 비용을 검토하고 사용자가 승인한 뒤 진행한다.

## 0. 검토 수정 이력 (2026-10-05)

초안을 다시 검토해 실제 생성 단계에서 실패로 이어질 수 있는 지시를 수정했다.

| # | 발견한 문제 | 영향 | 수정 |
|---|---|---|---|
| 1 | 마지막 어깨 너머 구도에서 "small, natural smile" 요구 | 뒤에서는 얼굴이 거의 보이지 않으므로, 모델이 미소를 보여주려고 아이 고개를 카메라 쪽으로 돌리거나 얼굴을 화면 앞으로 끌어올 수 있음 → 화면 가림·인물 회전 | 미소 지시 삭제. 고개는 태블릿을 향해 고정, 머리·어깨는 프레임 왼쪽 가장자리에만 두고 화면과 겹치지 않도록 명시 |
| 2 | 마지막 구도에서 머리 위치 미지정 | 오른쪽 어깨 뒤에서 보면 머리가 화면을 가리기 쉬움 | 카메라를 아이 머리보다 약간 높은 위치에서 어깨 너머로 내려다보도록 지정 |
| 3 | 0초부터 발화 시작 | 스크롤 영상의 첫 프레임은 페이지 진입 시 멈춰 보이는 대표 화면인데, 입이 벌어진 프레임이 될 수 있음 | 시작은 입을 다문 상태 → 짧은 발화 → 카메라 이동 전에 입을 다물도록 순서 지정 |
| 4 | "아이 앞쪽에서 시작"과 일반적인 벽붙이 책상 배치의 충돌 | 한국 아이 방 책상은 대개 벽에 붙어 있어 '정면 앞'은 벽 속이 됨. 모델이 책상을 방 한가운데로 옮기거나 카메라가 벽을 통과할 수 있음 | 책상 뒷면은 벽, 오른쪽 끝은 방 쪽으로 열린 배치로 지정하고 시작점을 "책상 오른쪽 앞 모서리"로 명시 |
| 5 | 프롬프트에 "Samsung Galaxy Tab A11" 제품명 기재 | 영상 모델이 특정 저가 모델의 외형을 정확히 알 가능성이 낮고, 제조사명이 오히려 로고 생성을 유도함("로고 제거" 지시와 충돌) | 프롬프트에서는 제품명을 빼고 공식 치수·화면 비율·외형으로 묘사. 제품명은 한국어 브리프에만 유지 |
| 6 | "No … extra fingers, distorted glasses, floating objects" 등 부정어 나열 | 많은 영상 모델이 부정 표현을 잘 따르지 못하고, 언급된 단어가 오히려 결과를 유도할 수 있음 | 본 프롬프트는 긍정 표현으로 바꾸고, 금지 요소는 네거티브 입력란 전용 블록으로 분리 |
| 7 | 프롬프트 약 5,300자(초안 기준) | 일부 모델은 입력 길이 제한이 있어 뒷부분(마지막 구도·화면 조건)이 잘리거나 약해질 수 있음 | 간결 실행본 추가. 2차 검토에서 상세본을 약 610단어(약 3,700자)로 줄이고 간결본(§4-3)·시작/마지막 프레임용(§4-1)으로 재구성 |
| 8 | 책상 스탠드 위치 미지정 | 카메라 경로(오른쪽)에 스탠드가 있으면 이동 경로를 막고 화면 반사를 만듦 | 스탠드를 책상 왼쪽에 배치 |
| 9 | "The footage remains silent"가 발화 직후에 위치 | '무음'이 입 움직임 금지로 해석될 수 있음 | "오디오는 필요 없고 편집에서 제거"로 바꿔 시각적 발화와 출력 무음을 분리 |
| 10 | 화면 비율 미기재 | 합성용 앱 녹화 비율을 정할 수 없음 | 갤럭시 탭 A11 화면 1340×800(5:3)을 확인해 프롬프트와 합성 항목에 반영 |
| 11 | §1의 구조 설명이 실제 프롬프트 순서와 다름 | 문서 내부 불일치 | 실제 블록 순서로 수정 |
| 12 | 비디오 시킹 방식의 인코딩 조건 누락 | 일반 인코딩(긴 키프레임 간격)은 스크롤 시킹 시 끊김·지연 발생 | §6 문제 목록에 키프레임 간격 항목 추가 |

### 2차 검토 — Higgsfield Seedance 2.5 기준

생성 모델이 Higgsfield의 Seedance 2.5로 정해져, 모델 특성에 맞지 않는 지시를 다시 수정했다.

| # | 발견한 문제 | 영향 | 수정 |
|---|---|---|---|
| 13 | 대사 없이 "짧게 대답한다"고만 지시 | Seedance 2.5는 따옴표 안 대사로 립싱크를 만든다. 대사가 없으면 초반 발화 장면에서 입 움직임이 약하거나 불규칙할 수 있음 | 짧은 영어 대사 한 줄(임시 예시)을 따옴표로 넣고 0.5–1.5초 구간에 배치 |
| 14 | 1차 수정에서 미소 지시를 마지막 구도에서만 삭제하고 초반에도 넣지 않음 | 얼굴이 잘 보이는 초반에 감정 표현 지점이 없음 | 대답 직후(1.5–2초) 작은 미소 추가. 마지막 구도에는 계속 넣지 않음 |
| 15 | "Audio is not needed" (1차 #9) | Seedance 2.5는 소리를 영상과 함께 생성하므로 이 지시는 의미가 약하고, 대사 립싱크와도 맞지 않음 | "대사 한 줄과 조용한 실내음만, 음악 없음"으로 변경. 최종 무음은 편집에서 처리 |
| 16 | 자막 금지 지시 없음 | 대사가 있으면 Seedance가 자막을 화면에 새겨 넣는 사례가 알려져 있음. 제거는 별도 생성형 편집이 필요 | 본문에 "No subtitles, captions, or on-screen text" 추가 |
| 17 | 회전 각도 "about 135 degrees" (1차 수정에서 넣은 오류) | 오른쪽 앞 3/4 시점(약 45°)에서 오른쪽 어깨 뒤(약 145°)까지는 약 100°. 135°로 쓰면 등 뒤 깊숙이까지 돌아 머리가 화면을 가릴 수 있음 | "about a 100-degree partial arc"로 수정, 위에서 볼 때 시계 방향임을 명시 |
| 18 | 회전 방향 미기재 | Seedance 가이드는 궤도 촬영에 방향·반경·시간을 명시하라고 권장 | "clockwise arc, as seen from above" 및 초 단위 구간으로 지시 |
| 19 | 시작·마지막 이미지 활용이 "제안" 수준 | Seedance 2.5에 First & Last Frame 방식이 있음. 마커·회색 화면·마지막 구도는 텍스트보다 이미지로 고정하는 것이 훨씬 확실함 | 시작·마지막 프레임용 프롬프트(4-1)를 1순위로 추가하고 이미지 요구 조건을 §7에 정리 |
| 20 | 프레임률·해상도 미정 | Seedance 2.5는 24fps 고정으로 알려져 있음(8초 = 192프레임). 해상도는 자료마다 720p 상한 / 1080p 지원으로 엇갈림 | §2-1에 정리. Higgsfield 화면에서 1080p 옵션 여부 직접 확인 필요 |
| 21 | 실사 얼굴 참조 이미지 필터 미고려 | Seedance 2.0은 실제 인물 얼굴 사진 참조를 차단한 것으로 알려짐. AI로 만든 인물 이미지는 대체로 통과한다는 보고가 있음 | 참조 인물은 AI 생성 이미지로 만들고, 실제 아동 사진은 사용하지 않도록 명시 |

## 1. 어떤 방식으로 작성된 프롬프트인가

이 프롬프트는 **구조화된 자연어 촬영 지시서**다. 특정 영상 모델의 전용 문법이나 API 명세가 아니다. 인물·공간·조명·소품·연기·카메라 이동·시간 구간·합성 조건을 나누어, 모델이 한 장면의 의도를 이해하도록 작성했다.

텍스트 전용 상세본의 구조는 `Subject → Room & Time → Tablet → Screen → Timeline([0-0.5s] 형식) → Performance → Style → Audio·자막`이며, 시각적 금지 요소는 별도의 네거티브 블록으로 분리했다. Seedance 2.5 가이드들은 초 단위 구간 표기를 모델이 읽는다고 설명하지만, 프레임 단위로 정확히 지킨다는 보장은 없다.

특히 **합성 작업을 먼저 고려한 촬영 설계**를 적용했다. 아이와 방은 생성하고, 태블릿의 실제 앱 화면은 후반 작업으로 교체한다. 원본 화면에는 중간 회색 배경과 고정 마커만 둔다. AI가 정확한 브랜드명이나 앱 UI를 그리도록 요구하지 않는다.

생성 모델은 Higgsfield의 Seedance 2.5다. Seedance 2.5에는 시작·마지막 프레임 방식과 다중 참조 이미지 방식이 있는 것으로 확인되어, 시작·마지막 이미지를 먼저 만들고 움직임만 프롬프트로 지시하는 방식(4-1)을 1순위로 둔다. 다만 Higgsfield 화면에서 이 기능이 어떻게 노출되는지는 직접 확인하지 못했다(§2-1).

### 토스 참조의 확인 범위

페이지에서 기기를 내려다보는 여성 중심 시작 구도와, 기기 화면이 크게 드러나는 후속 화면을 직접 확인했다. 중간 회전 구간의 전체 프레임, 렌즈, 카메라 궤적, 속도 곡선은 분석하지 않았다. 따라서 본 프롬프트는 얼굴에서 기기로 관심을 옮기는 흐름을 해석한 제안이며, 토스 영상의 정확한 복제 지시서가 아니다.

또한 토스가 내부적으로 이미지 시퀀스, 비디오 시킹, 또는 다른 방식 중 무엇으로 구현했는지는 확인하지 않았다. 사용자가 설명한 프레임 단위 스크롤 연출을 최종 목표로 삼되, 실제 웹 구현 방식은 별도로 결정한다.

## 2. 확정 사항과 임시 제안

| 항목 | 내용 | 상태 |
|---|---|---|
| 인물 | 9살 전후 한국 남자 초등학생, 짧은 검은 머리, 둥근 얇은 안경, 크림색 맨투맨 | 사용자 승인 |
| 장소 | 한국 초등학생의 자기 방, 책상 앞 | 사용자 지정 |
| 시간 | 저녁 8시 전후 | 사용자 지정 |
| 행동 | 실제 스피킹처럼 짧게 답하고 듣는 자연스러운 연기 | 사용자 의도 반영 |
| 소리 | 최종 영상은 무음. 생성 시에는 립싱크용 대사 한 줄과 실내음이 만들어지며 편집에서 제거 | 무음은 사용자 지정, 생성 방식은 Seedance 특성에 따른 제안 |
| 기기 | 갤럭시 탭 A11로 해석, 가로 배치 | 모델명은 문맥에 따른 해석, 가로 배치는 제안 |
| 로고 | 기기와 소품에 로고·브랜드 표시 없음 | 사용자 지정 |
| 화면 합성 | 추후 실제 리얼아카데미 화면으로 교체 | 사용자 지정 |
| 추적 기준 | 회색 화면, 네 모서리 안쪽 십자 4개와 중앙 십자 1개 | 마커 필요성은 사용자 요청, 배치·색상은 제안 |
| 길이 | 약 8초 | 임시 제안 |
| 카메라 | 아이 오른쪽 앞 → 오른쪽 옆 → 오른쪽 어깨 뒤 | 임시 제안 |
| 기기 색상 | 그레이 | 임시 제안 |
| 생성 모델 | Higgsfield · Seedance 2.5 | 사용자 지정 |
| 프레임률 | 24fps 고정(8초 = 192프레임) | 2차 자료 기준, 생성 화면에서 확인 |
| 비율·해상도 | 비율 미정. 해상도는 가능한 최고 옵션(1080p 있으면 1080p) | 생성 전 결정 필요 |
| 대사 | `"Yes, I like pizza!"` (임시 예시, 실제 수업 문장으로 교체 가능) | 제안 |

삼성 공식 제품에 [갤럭시 탭 A11](https://www.samsung.com/sec/tablets/galaxy-tab-a11-wifi-x135n/SM-X133NZAAKOO/)이 있으며, [8.7인치 모델](https://www.samsung.com/uk/tablets/galaxy-tab-a/galaxy-tab-a11-grey-64gb-lte-sm-x135fzaaeub/)을 기준으로 작성했다. 사용자 표현인 ‘갤럭시 에이11’을 태블릿 문맥에 따라 해석한 것이므로, 실제 보유 기기와 다르면 생성 전에 수정한다.

확인한 사양([GSMArena](https://m.gsmarena.com/samsung_galaxy_tab_a11-14141.php) 기준): 8.7인치 TFT LCD, 1340×800(5:3), 본체 211 × 124.7 × 8mm, 색상 그레이·실버. SM-X133은 Wi-Fi, SM-X135는 LTE 모델이며 외형은 같다. 위 두 삼성 링크는 각각 국내 Wi-Fi(SM-X133N)와 영국 LTE(SM-X135F) 페이지다.

영상 모델은 이 기기의 정확한 외형을 알 가능성이 낮고, 제조사명이 로고 생성을 유도할 수 있다. 따라서 **영문 프롬프트에는 제품명을 쓰지 않고 치수·비율·외형으로 묘사**한다. 실제 외형 일치가 중요하면 참조 이미지(로고 제거본)로 보완한다.

## 2-1. Seedance 2.5 사양 (2차 자료 기준)

Higgsfield 공식 페이지는 이 작업 환경에서 접속이 막혀 직접 확인하지 못했다. 아래는 검색 결과로 확인한 2차 자료이며, 자료끼리 엇갈리는 항목은 그대로 표시했다. **생성 전에 Higgsfield 화면에서 직접 확인해야 한다.**

| 항목 | 확인 내용 | 이 문서에 미치는 영향 |
|---|---|---|
| 길이 | 4–30초(일부 API는 15초 상한), 초 단위 정수 | 8초 지정 가능 |
| 프레임률 | 24fps 고정 | 8초 = 192프레임. 이미지 시퀀스 용량 계산 기준 |
| 해상도 | 자료마다 다름: 480p·720p만 지원 / Higgsfield 1080p 업데이트 / 4K 언급 | 720p뿐이면 마지막 구도에서 태블릿 화면이 작아 마커 식별과 합성 품질이 떨어질 수 있음. 업스케일 시 새 결함 점검 |
| 오디오 | 영상과 함께 소리를 생성. Higgsfield에서는 오디오가 비용에 영향을 주지 않는다는 자료가 있음 | 소리는 편집에서 제거 |
| 대사 | 따옴표 안 대사로 립싱크 생성 | 대사 한 줄 추가(§4) |
| 시작·마지막 프레임 | First & Last Frame 방식 지원 | 4-1을 1순위로 사용 |
| 참조 이미지 | 다중 참조(최대 50개로 소개됨), 참조마다 역할을 지정하라는 권장 | 인물·방·태블릿 일관성 보완용 |
| 네거티브 | 별도 입력란을 소개하는 자료와, 입력란 없이 본문에 써야 한다는 자료가 엇갈림. 시각적 요소의 부정 표현은 효과가 약하고 자막·오디오 금지는 효과가 있다는 권장 | 자막 금지만 본문에, 나머지는 입력란이 있을 때만(4-4) |
| 프롬프트 길이 | 영문 약 1,000단어 이하 권장 | 상세본 약 610단어로 범위 안 |
| 얼굴 필터 | Seedance 2.0은 실제 인물 얼굴 사진 참조를 차단. AI 생성 인물 이미지는 대체로 통과한다는 보고 | 참조 인물은 AI 생성 이미지 사용. 실제 아동 사진 사용 금지 |
| 컨트롤 선택기 | Higgsfield가 렌즈·조명 방향·장르 등을 선택 메뉴로 제공 | 프롬프트와 충돌하지 않게 설정하거나 기본값 유지 |
| 비용 | 자료마다 크게 다름(8초 1080p 72크레딧 등) | 실행 전 화면의 실제 크레딧 확인 후 사용자 승인 |

참고 자료: [Higgsfield Seedance 2.5 소개](https://higgsfield.ai/blog/seedance-2-5-on-higgsfield-2026), [Higgsfield 프롬프트 가이드](https://higgsfield.ai/blog/seedance-2-5-prompting-guide), [Higgsfield 가격 안내](https://higgsfield.ai/blog/seedance-2-5-pricing-2026), [Runware 프롬프트 가이드](https://runware.ai/docs/models/bytedance-seedance-2-5/guides/prompting), [RunComfy First & Last Frame](https://www.runcomfy.com/models/bytedance/seedance-2.5/first-last-frame), [Seedance 네거티브 가이드](https://www.buzzy.now/blog/seedance-2-5-negative-prompts), [Seedance 얼굴 업로드 제한](https://yingtu.ai/en/blog/seedance-2-0-human-face), [자막 제거 안내](https://www.atlascloud.ai/blog/tips/remove-subtitles-from-video).

## 3. 장면 구성

| 구간 | 화면과 연기 | 제작 의도 |
|---|---|---|
| 0–2초 | 책상 오른쪽 앞 모서리에서 얼굴·상체 클로즈업. 태블릿 화면은 가려짐. 0–0.5초 입 다묾 → 0.5–1.5초 짧은 대사 → 1.5–2초 작은 미소 후 들음 | 인물과 감정에 먼저 집중. 발화가 분명히 보이게 하고, 첫 프레임을 스크롤 대표 화면으로 쓸 수 있게 함 |
| 2–7초 | 위에서 볼 때 시계 방향으로 약 100° 회전. 오른쪽 옆을 지나 어깨 뒤로 이동. 아이는 듣는 표정. 태블릿 화면이 드러남 | 같은 공간 안에서 활동의 정체를 공개 |
| 7–8초 | 화면 네 모서리와 마커가 보이는 어깨 너머 구도. 머리·어깨는 왼쪽 가장자리에만. 약 1초 안정화 | 실제 앱 화면 합성과 스크롤 종료 구간 확보 |

짧은 대답은 화면이 보이기 전부터 자연스럽게 수업 중이라는 인상을 준다. 화면 공개 후에도 명확한 발화가 필요하면 두 번째 짧은 대답을 넣을 수 있지만, 현재 초안은 입 움직임과 연기 오류를 줄이기 위해 한 번만 요청한다.

## 4. 통합 영문 프롬프트 (Higgsfield · Seedance 2.5 기준)

아래 프롬프트는 이전의 ‘앱 UI가 보이는 화면’ 지시와 이 문서의 이전 프롬프트 버전을 대체한다. 이전 버전과 함께 사용하지 않는다.

| 블록 | 용도 | 권장 |
|---|---|---|
| 4-1 시작·마지막 프레임용 | Seedance 2.5의 First & Last Frame 방식. 시작 이미지와 마지막 이미지를 넣고, 프롬프트는 움직임·연기만 지시 | **1순위.** 마커·화면·마지막 구도를 이미지로 고정할 수 있음 |
| 4-2 텍스트 전용 상세본 | 참조 이미지 없이 텍스트만으로 생성 | 2순위. 약 610단어로 권장 상한(영문 약 1,000단어) 안이지만, 짧은 지시가 더 잘 지켜지는 경향이 있음 |
| 4-3 텍스트 전용 간결본 | 상세본에서 뒷부분 지시가 무시될 때 | 상세본 대안 |
| 4-4 네거티브 | Higgsfield 화면에 별도 Negative Prompt 입력란이 있을 때만 | 입력란이 없으면 본문에 붙이지 않음 |

**대사 처리:** Seedance 2.5는 따옴표 안의 대사로 입 모양(립싱크)을 만든다. 대사 없이 "짧게 대답한다"고만 쓰면 입 움직임이 거의 없거나 불규칙해질 수 있어서, 짧은 영어 대사 한 줄을 넣었다. 소리는 생성되지만 편집에서 제거하므로 최종 영상은 무음이다. 대사 `"Yes, I like pizza!"`는 임시 예시이며, 실제 리얼아카데미 수업 문장(3~5단어, 약 1초)으로 바꿔도 된다.

**자막 방지:** 대사가 있으면 Seedance가 자막을 화면에 새겨 넣는 사례가 알려져 있다. 자막·글자 금지는 부정 표현이 잘 통하는 영역이라 본문에 직접 넣었다.

### 4-1. 시작·마지막 프레임용 (1순위)

시작 이미지와 마지막 이미지가 인물·방·태블릿·마커를 결정하므로, 프롬프트는 움직임과 연기만 다룬다. 두 이미지의 요구 조건은 §7 체크리스트에 정리했다.

```text
One continuous 8-second shot connecting the first frame to the last frame.

The camera makes a slow, smooth clockwise arc around the boy's right side, as seen from above: from the front-right three-quarter view of his face, past his right profile, to just behind and slightly above his right shoulder. About a 100-degree partial arc, ending with a gentle push-in toward the tablet. Only the camera moves; the boy, desk, and tablet stay in place.

[0-0.5s] Static. The boy looks down at the tablet, mouth closed.
[0.5-1.5s] He says one short line with clear, natural lip movement: "Yes, I like pizza!"
[1.5-2s] He closes his mouth and gives a small, natural smile, then listens attentively.
[2-7s] The camera arcs around his right side. He keeps facing the tablet, head and body still. The gray tablet screen with five black crosses is gradually revealed.
[7-8s] The camera settles and holds still on the over-the-shoulder view of the last frame.

His hands rest on the desk beside the tablet. Level horizon, steady focus, constant focal length, consistent exposure and white balance. Photorealistic, high-end Korean TV commercial look with natural skin texture.

Audio: only his one spoken line and quiet room tone, no music.
No subtitles, captions, or on-screen text.
```

### 4-2. 텍스트 전용 상세본

```text
An 8-second photorealistic live-action commercial shot in one continuous take, with the finish of a high-end Korean television commercial.

SUBJECT
A cute Korean elementary school boy, about 9 years old, with short natural black hair and round, thin-framed glasses, wearing a plain cream sweatshirt. He sits at his study desk doing a speaking practice lesson on a tablet. Relaxed, attentive, subtly cheerful.

ROOM AND TIME
Around 8 PM in his bedroom in a contemporary South Korean apartment. Tidy but lived-in: a light wood study desk, an ergonomic study chair, children's books and school workbooks, a pencil cup, a small bed, a few modest belongings.

The back edge of the desk is against the wall in front of him. The right end of the desk is open to the room, with clear floor space along his right side from the desk's right front corner to behind his chair.

The window is dark, with faint distant apartment lights. Soft warm ceiling light and a desk lamp on the left side of the desk make the room comfortably bright, with natural skin tones. Every object is unbranded and free of readable text.

TABLET
A compact 8.7-inch Android tablet, about 21 cm wide and 12.5 cm tall, thin and flat, with a matte gray metal back, softly rounded corners, and thin, even black bezels around a 5:3 display. It stands horizontally on a plain desk stand, angled toward him. Completely plain, with no logos or markings. It stays rigid and stationary.

SCREEN
The whole display is a flat medium-gray field with exactly five static black crosses: four slightly inset from the display corners and a smaller one in the center. The crosses stay fixed to the screen surface and follow its perspective. This static pattern stays on the screen for the whole shot. Soft, subtle reflections leave the crosses and display edges clear.

TIMELINE
[0-0.5s] Close three-quarter view from beside the right front corner of the desk, on his face and upper torso. He looks down at the tablet, mouth closed. His eyes are clearly visible through his glasses. Only the back or edge of the tablet is visible; the screen is hidden.
[0.5-1.5s] He says one short line with clear, natural lip movement: "Yes, I like pizza!"
[1.5-2s] He closes his mouth, gives a small, natural smile, and listens attentively.
[2-7s] The camera makes a slow, smooth clockwise arc around his right side, as seen from above, through the open floor space: past his right profile to just behind and slightly above his right shoulder, about a 100-degree partial arc, then a gentle push-in. Only the camera moves; he keeps facing the tablet with his head and body still. The screen is gradually revealed. Focus shifts smoothly from his eyes to the screen.
[7-8s] The camera settles and holds still. Over-the-shoulder view looking down at the tablet. Only a small, softly focused part of his right shoulder, ear, and the back of his head appears at the left edge of the frame, beside the screen, never in front of it. All four screen corners and all five crosses are sharp and fully visible, with a margin around the tablet, seen from a mild angle.

PERFORMANCE
His hands rest on the desk beside the tablet the whole time. Subtle blinking and breathing. Restrained, natural acting; his gaze stays on the tablet.

STYLE
Motivated soft evening light, controlled highlights, gentle shadow detail, realistic skin texture, fine hair detail, believable fabric, natural reflections on glasses and tablet. Level horizon, constant focal length, consistent exposure and white balance, restrained commercial color grading.

Audio: only his one spoken line and quiet room tone, no music.
No subtitles, captions, or on-screen text.
```

### 4-3. 텍스트 전용 간결본

```text
8-second photorealistic live-action commercial, one continuous take.

A 9-year-old Korean boy with short black hair, round thin-framed glasses and a plain cream sweatshirt sits at a light wood study desk in his tidy bedroom in a Korean apartment, around 8 PM. Dark window with distant apartment lights; soft warm ceiling light and a desk lamp on the left; natural skin tones. The desk is against the wall in front of him; its right end and the floor along his right side are open.

On the desk, a compact 8.7-inch gray tablet with thin black bezels and a 5:3 screen stands horizontally on a plain stand, facing him. Everything is unbranded. The screen shows only flat medium gray with five fixed black crosses: one near each corner and a smaller one in the center.

[0-0.5s] Close three-quarter view from the right front corner of the desk on his face; the screen is hidden; mouth closed.
[0.5-1.5s] He says, with clear natural lip movement: "Yes, I like pizza!"
[1.5-2s] Small natural smile, then he listens.
[2-7s] The camera slowly arcs clockwise around his right side, past his profile, to just behind and above his right shoulder, revealing the screen, then gently pushes in. Only the camera moves; he stays still, facing the tablet.
[7-8s] Steady over-the-shoulder hold; his shoulder and head stay at the left edge, beside the screen; all four screen corners and five crosses sharp and fully visible.

Hands rest on the desk beside the tablet. Level horizon, steady focus, consistent exposure, high-end Korean TV commercial look, natural skin texture.
Audio: his one line and quiet room tone, no music. No subtitles, captions, or on-screen text.
```

### 4-4. 네거티브 (별도 입력란 전용)

```text
subtitles, captions, text, logo, watermark, app interface, cut, transition, zoom, camera shake, focus hunting, heavy motion blur, morphing, warped tablet, bent screen, moving or extra markers, distorted glasses, extra fingers, floating objects, waxy skin, beauty filter, oversharpening, HDR look, heavy grain, lens flare, orange color cast, looking at camera, turning head, head covering screen, music
```

## 5. 검증 결과와 한계

### 현재 확인한 것

- 사용자 요청과 인물·장소·시간·무음·로고 제거 조건의 일관성.
- 앱 UI 생성 지시와 합성용 마커 지시의 충돌 해소.
- 카메라 방향과 책상 옆 이동 공간 명시. 벽붙이 책상과 시작 위치의 충돌 해소(오른쪽 끝이 열린 배치).
- 마지막 구도에서 미소 지시 삭제, 머리가 화면을 가리지 않는 위치 지정.
- 첫 프레임 입 다문 상태 지정.
- 갤럭시 탭 A11 사양(8.7인치, 1340×800, 5:3, 211×124.7×8mm) 확인 및 프롬프트에서 제품명 제거.
- 화면을 손으로 가리지 않는 연기와 마지막 안정 구간 확보.
- 모델명에 대한 삼성 공식 제품 정보 확인.
- Seedance 2.5의 길이·프레임률·대사 립싱크·시작/마지막 프레임·네거티브·얼굴 필터 특성(2차 자료)과 프롬프트의 정합성.

### 아직 확인하지 않은 것

- Higgsfield 화면의 Seedance 2.5 실제 옵션: 최대 해상도(720p/1080p), 시작·마지막 프레임 메뉴, 네거티브 입력란, 오디오 끄기, 컨트롤 선택기, 회당 크레딧. (공식 페이지 접속이 막혀 2차 자료로만 확인)
- 시작·마지막 프레임 방식에서 참조 이미지를 함께 쓸 수 있는지.
- 대사를 넣었을 때 자막이 생기지 않는지.
- 토스 영상과 카메라 궤적·속도·프레이밍이 실제로 같은지.
- 생성 영상에서 얼굴·안경·손·태블릿·마커가 시간에 따라 유지되는지.
- 생성 영상에 대해 실제 트래킹과 화면 합성이 가능한지.
- 최종 웹사이트의 데스크톱·모바일 비율 및 스크롤 성능.

따라서 현재 상태는 **논리적으로 정리된 제작 초안**이다. ‘영상 생성 검증 완료’, ‘합성 가능 보장’, ‘토스와 완벽히 동일’로 해석하면 안 된다.

## 6. 예상 문제와 대응

아래는 현재 설계에서 예상할 수 있는 주요 문제를 최대한 정리한 목록이다. 실제 모델과 결과물에 따라 추가 문제가 생길 수 있다.

| 문제·염려 | 원인과 영향 | 대응 |
|---|---|---|
| 긴 프롬프트의 일부 무시 | 인물·공간·카메라·시간·마커 지시가 많아 우선순위가 흐려질 수 있음 | 모델 입력 제한 확인. 문제가 생기면 화면 형태 유지, 카메라 경로, 인물 일관성을 우선해 압축 |
| 시간 구간을 정확히 따르지 않음 | 자연어 시간표는 확정된 타임라인 제어가 아님 | 생성 결과 편집 또는 지원되는 제어 기능 활용. 8초 고정 여부도 모델 확인 후 결정 |
| 인물이 돌고 카메라는 고정됨 | orbit 지시가 인물 회전으로 해석될 수 있음 | 인물은 태블릿을 계속 바라본다는 지시 및 참조 이미지 유지 |
| 태블릿 방향과 공개 경로 충돌 | 앞쪽에서는 화면이 가려져야 하고 뒤쪽에서는 보여야 함 | 시작·중간·끝 구도를 함께 확인. 태블릿은 아이를 향하고 카메라는 옆을 지나도록 배치 |
| 방 배치가 순간적으로 변함 | 생성 모델이 이동 중 가려진 공간을 새로 해석함 | 배경 소품을 절제하고 같은 방의 참조 이미지를 사용 |
| 카메라가 책상·아이를 통과함 | 현실적인 공간 이동을 지키지 못함 | 옆 통로 확보, 회전 폭 축소. 필요시 장면을 짧게 하거나 실제 3D·촬영 방식 검토 |
| 작은 A11 화면이 부족함 | 8.7인치 기기는 넓은 구도에서 앱 내용이 잘 안 보일 수 있음 | 마지막에 가까이 접근. 임의로 태블릿을 대형 모델처럼 키우지 않기 |
| 정확한 제품 디자인 재현 실패 | 모델명만으로 치수·카메라·베젤이 정확히 구현되지 않음 | 실제 기기 참조 이미지 활용. 제품 정확도가 필수인지 사전 결정 |
| 로고가 다시 생김 | 제조사 이름이 브랜드 표시 생성으로 연결될 수 있음 | 프롬프트에서 제품명 제외(반영). 참조 이미지에서 로고 제거. 생성 후 뒷면·베젤·옷·소품 점검 및 리터치 |
| 자막이 화면에 새겨짐 | 대사가 있으면 Seedance가 자막을 넣는 사례가 있음 | 본문에 자막 금지 지시(반영). 생기면 재생성 또는 생성형 편집으로 제거 비용 비교 |
| 참조 이미지가 얼굴 필터에 걸림 | 실사 얼굴 사진으로 판단되면 업로드 단계에서 거부 | AI 생성 인물 이미지 사용. 거부되면 같은 이미지를 반복 시도하지 말고 원인 확인 |
| 립싱크가 대사와 어긋나거나 과장됨 | 대사 길이가 1초 구간보다 길거나 말투 지시가 강함 | 3~5단어 대사 유지. 소리는 제거하므로 입 모양만 자연스러우면 됨 |
| 해상도 부족 | Seedance 2.5가 720p까지만이면 태블릿 화면 영역이 작음 | 1080p 옵션 확인. 업스케일은 결함 점검 후 사용 |
| 부정어 나열이 오히려 유도됨 | 'extra fingers' 같은 금지 단어가 본문에 있으면 모델이 해당 요소를 떠올릴 수 있음 | 본문은 긍정 표현, 금지 요소는 네거티브 입력란 전용(반영). 입력란이 없으면 생략 |
| 마지막 구도에서 아이가 고개를 돌림 | 뒤에서 보이지 않는 표정(미소 등)을 요구하면 모델이 얼굴을 보여주려 함 | 마지막 구도에 표정 요구를 넣지 않고 고개 고정 명시(반영) |
| 얼굴·안경·손 변형 | 회전 구간의 가림과 입 움직임이 시간적 일관성을 깨뜨릴 수 있음 | 절제된 연기와 단순한 손 자세. 주요 구간 프레임 점검 |
| 말하는 표정이 과장됨 | 무음 조건이 입 움직임 중단으로, 발화 조건이 과한 움직임으로 해석될 수 있음 | ‘시각적 짧은 발화, 최종 출력 무음’을 구분. 오디오가 생기면 편집에서 제거 |
| 마커 위치·개수가 변함 | AI가 그래픽을 고정된 평면 정보로 유지하지 못함 | 마커를 참조 이미지에 포함. 생성 후 개수·상대 위치 점검. 실패하면 화면 테두리 추적·수동 보정 또는 재생성 판단 |
| 마커가 너무 작거나 번짐 | 원근·해상도·블러로 기준점을 구분할 수 없음 | 최종 출력 크기에서 식별 가능한 마커 크기를 참조 이미지 단계에 결정 |
| 화면이 휘거나 베젤이 흔들림 | 단순 원근 변환으로 설명되지 않는 변형 | 심한 경우 재생성. 가벼운 경우 프레임별 보정이 필요하며 추가 작업량 발생 |
| 화면 공개 직후 모서리가 가려짐 | 옆면 각도나 어깨·머리 때문에 전체 평면이 안 보임 | 공개 초반은 부분 추적·수동 보정 가능성 검토. 모든 마커가 처음부터 보여야 한다는 비현실적 조건은 피함 |
| 최종 화면 일부가 프레임 밖으로 나감 | 클로즈업과 네 모서리 확보가 충돌 | 마지막 구도에 여백 확보. 합성 후 웹 크롭까지 고려 |
| 화면 반사와 스탠드 눈부심 | 마커를 가리거나 화면 위에 반사가 떠다님 | 조명 위치와 각도 조정. 반사는 약하게 유지하고 필요시 후반에 별도 복원 |
| 회색 화면이 실제 UI와 밝기가 다름 | 얼굴·손·안경에 반사된 빛이 최종 UI 색과 불일치 | 실제 앱의 밝기를 기준으로 트래킹 화면 톤 결정. 합성 때 색·밝기 조정 |
| 화면에 손·머리카락이 겹침 | 앱 화면만 덮으면 앞쪽 물체까지 가려짐 | 가림 마스크 작업 필요. 현재는 손을 화면 밖에 둬 작업을 줄임 |
| 합성이 스티커처럼 보임 | 원근만 맞고 밝기·블러·반사·초점이 맞지 않음 | 원본의 노출·초점·움직임에 맞춰 화면 처리. 화면 전체 교체로 마커도 함께 덮기 |
| 태블릿 비율과 앱 녹화 비율 불일치 | 녹화물을 늘리면 UI가 왜곡됨. 갤럭시 탭 A11 화면은 1340×800(5:3)으로 일반 16:9 녹화와 다름 | 실제 기기에서 가로로 녹화하거나 5:3 비율로 앱 자료 준비. 16:9 자료만 있으면 여백 또는 크롭 설계 |
| 스피킹 행동과 앱 반응 불일치 | 입은 움직이는데 UI가 듣기 상태거나 상대가 동시에 말함 | 짧은 발화 타이밍에 맞춰 앱 상태·상대 반응 편집 |
| 조명이 너무 어둡거나 주황색 | ‘저녁’과 ‘따뜻함’을 과하게 해석 | 실내는 밝게, 창밖만 어둡게. 피부색과 안경 너머 눈 확인 |
| 한국 방이 지나치게 일반화됨 | 문화권 표기만으로 현실적인 방을 보장하지 못함 | 실제 한국 아파트 아이 방의 레이아웃·소품 참조. 불필요한 장식 최소화 |
| 스크롤 정지 때 이상한 표정이 보임 | 영상 재생 때 지나가는 입·눈 프레임이 오래 고정됨 | 중간 프레임도 검토. 중요 메시지 구간은 안정된 표정·화면을 선택 |
| 첫 프레임이 어색함 | 스크롤 전 페이지 진입 시 첫 프레임이 대표 화면처럼 멈춰 보임 | 입을 다문 상태로 시작하도록 지정(반영). 필요하면 첫 프레임을 별도 포스터 이미지로 보정 |
| 역스크롤에서 행동이 역재생됨 | 스크롤 진행률과 프레임 번호를 직접 연결하는 구조 | 입 움직임·손동작을 최소화. 자연스러운 왕복 경험은 구현 단계에서 검토 |
| 8초를 긴 스크롤에 늘려 부자연스러움 | 사람의 미세 움직임이 지나치게 느려 보임 | 실제 스크롤 거리와 영상 길이를 함께 조정 |
| 모바일 크롭 문제 | 얼굴 중심 시작과 태블릿 중심 끝을 한 비율로 담기 어려움 | 데스크톱·모바일 주요 영역 설계. 필요시 별도 크롭 또는 별도 영상 |
| 이미지 시퀀스 용량·메모리 증가 | 프레임 수와 해상도가 커질수록 로딩 부담 증가 | 최종 합성 후 추출. 해상도·프레임 수·이미지 압축·선로딩을 실제 기기에서 확인 |
| 스크롤 구현이 매끄럽지 않음 | 프레임 누락, 로딩 지연, 과한 보간, 시킹 지연 | 이미지 시퀀스 또는 비디오 방식의 실제 성능 비교 후 선택 |
| 비디오 시킹이 끊김 | 일반 웹 인코딩은 키프레임 간격이 길어, 임의 시점으로 이동할 때마다 디코딩 지연 발생 | 비디오 방식이면 키프레임 간격을 매우 짧게(전 프레임 키프레임 포함) 인코딩해 시험. 용량 증가와 함께 비교 |
| 생성 비용이 예상보다 커짐 | 카메라·인물·마커 오류로 재시도 누적 | 모델별 실제 비용 확인, 참조 이미지 검토 먼저 수행, 시도 횟수와 비용 상한은 사용자와 결정 |
| 재현성 부족 | 같은 프롬프트라도 매번 결과가 달라질 수 있음 | 모델·설정·지원 시 시드·참조 이미지·버전을 기록 |

트래킹 마커는 보조 기준점이며 성공 보증 장치가 아니다. 표면에 추적할 특징이 있으면 별도 마커가 필요하지 않을 수도 있다는 점은 [Boris FX 공식 설명](https://support.borisfx.com/hc/en-us/articles/11065159321869-What-kind-of-tracking-markers-should-I-use)을 참고한다. 이 문서의 ‘회색 배경과 마커 5개’는 본 장면을 위한 제안이며 보편적인 필수 규격이 아니다.

## 7. 실제 제작 전 확인 사항

- [ ] 실제 기기가 갤럭시 탭 A11인지, 색상과 형태가 맞는지 확인.
- [ ] 최종 데스크톱·모바일 화면 비율과 영상 사용 영역 결정.
- [ ] 8초 길이와 마지막 약 1초 안정 구간 확정.
- [ ] Higgsfield Seedance 2.5 화면에서 최대 해상도, 시작·마지막 프레임 메뉴, 네거티브 입력란, 오디오 옵션, 컨트롤 선택기, 회당 크레딧 확인.
- [ ] 대사 문장 확정(3~5단어, 약 1초). 실제 리얼아카데미 수업 문장 사용 여부 결정.
- [ ] 시작 이미지(4-1용): 책상 오른쪽 앞 모서리에서 본 3/4 얼굴 클로즈업, 입 다문 상태, 태블릿 뒷면만 보임, 로고 없음, AI 생성 인물.
- [ ] 마지막 이미지(4-1용): 오른쪽 어깨 뒤 약간 위에서 본 구도, 머리·어깨는 왼쪽 가장자리, 회색 화면과 십자 5개·네 모서리 모두 선명, 태블릿 주변 여백. 마커는 이미지 편집으로 정확히 그려 넣는 것을 권장.
- [ ] 두 이미지의 인물·옷·방·조명·태블릿이 같은지 확인.
- [ ] 생성 시도 수와 비용 상한을 사용자와 결정. 현재 생성 실행 승인 없음.
- [ ] 시작·중간·마지막 구도를 정지 이미지 또는 스토리보드로 검토.
- [ ] 아이와 방, 태블릿 형태가 참조 이미지 사이에서 일관적인지 확인.
- [ ] 마지막 화면의 마커와 네 모서리가 식별 가능한지 확인.
- [ ] 태블릿 화면 색과 밝기를 최종 앱 화면에 맞춰 조정할 필요가 있는지 확인.
- [ ] 토스와 어느 정도까지 동일하게 맞출 것인지 정하고, 필요시 중간 참조 프레임 분석.

## 8. 생성 결과의 검수 기준

### 통과 기준

- 같은 아이·안경·옷·방·태블릿이 전체 구간에서 유지된다.
- 한 번의 연속적인 카메라 이동으로 얼굴에서 화면으로 이어진다.
- 아이가 자연스럽게 짧게 답하고 듣는 모습이다.
- 기기와 소품에 의도하지 않은 로고가 없다.
- 화면이 드러나는 구간에서 활성 화면과 베젤의 형태가 안정적이다.
- 마지막에 네 모서리와 마커가 선명하고 충분한 화면 크기가 확보된다.
- 최소한 일부 공개 구간에서 실제 시험 합성을 수행해 부착 상태를 확인한다.

### 보정 또는 재생성 판단

얼굴·태블릿의 큰 형태 변화, 불가능한 카메라 이동, 주요 구간의 심한 화면 가림은 재생성 후보로 본다. 작은 로고 잔상, 밝기 차이, 짧은 추적 이탈은 보정 가능성과 비용을 비교한다. 마커가 변해도 화면 테두리가 안정적이면 바로 폐기하지 않고 대체 추적 가능성을 먼저 확인한다.

## 9. 추후 화면 합성에 필요한 자료와 작업

필요한 자료는 원본 해상도의 생성 영상, 실제 앱의 가로 화면 녹화 또는 고해상도 이미지, 합성할 구간, 최종 출력 비율이다. 실제 사용자 화면에는 계정 정보·이름·알림 등이 포함될 수 있으므로, 가능한 경우 데모 계정과 정리된 녹화 화면을 사용한다.

예정 작업은 화면 평면 추적 → 원근 맞춤 → 화면 전체 교체 및 마커 제거 → 가림 처리 → 밝기·색·초점·블러·반사 조정 → 프레임 검수 순서다. 실제 영상과 사용 가능한 도구를 확인하기 전에는 완전 자동 처리나 품질을 확약하지 않는다.

최종 합성을 마친 마스터 영상에서 웹용 프레임을 추출한다. 마커가 남은 원본을 먼저 프레임으로 나누면 나중에 같은 작업을 반복하게 된다.

## 10. TV 상업광고 수준의 품질 기준과 비용 통제

### 사용자 추가 요구

실제 TV 광고에 나올 법한 고품질 영상을 목표로 한다. AI가 만들기 쉬운 오류를 반복 검증하고 수정해, 비싼 Higgsfield 크레딧의 낭비를 최소화한다. 단순히 프롬프트에 ‘cinematic’이나 ‘4K’를 넣는 것으로 품질 기준을 충족했다고 판단하지 않는다.

이는 TV 광고 수준의 시각적 완성도 목표다. 실제 방송 송출을 위한 규격·납품 요구사항까지 확정한 것은 아니며, 방송 송출이 결정되면 별도로 확인한다.

### 사전 검증과 결과 검증의 구분

프롬프트 모순, 잘못된 기기 정보, 불가능한 카메라 경로, 합성에 불리한 구도는 생성 전에 검토하고 수정한다. 얼굴 변화, 마커 이동, 손 변형, 프레임 간 깜빡임처럼 실제 생성 결과에 의존하는 문제는 텍스트 검토만으로 완전히 제거하거나 검증할 수 없다.

따라서 모든 오류의 사전 제거를 보장하는 대신, 알려진 위험을 사전에 줄이고 생성 결과를 검수해 결함이 있는 영상을 최종 결과로 채택하지 않는다. 결과 검수에서 실패하더라도 유료 재생성을 자동 실행하지 않는다.

### 유료 제작 전 단계별 검토

1. **브리프 수정:** 인물, 기기, 시간, 방 분위기, 공개할 앱 경험, 로고 제거 범위를 확정한다. 불필요한 동작과 장식은 줄인다.
2. **카메라 설계:** 위에서 본 간단한 방·책상·아이·태블릿 배치와 시작·중간·마지막 구도를 검토한다. 카메라의 진행 방향, 실제 이동 공간, 화면이 처음 보이는 순간을 확인한다.
3. **참조 이미지 검토:** 같은 인물·공간·기기를 유지하는 참조 이미지를 확인한다. 유료 이미지 도구를 쓰는 경우도 비용을 먼저 확인한다. 영상 크레딧을 쓰지 않는다는 것이 모든 준비 작업이 무료라는 뜻은 아니다.
4. **합성 설계 검토:** 화면 비율, 마커 크기와 위치, 베젤, 반사, 가림, 마지막 화면 크기를 확인한다. 가능하면 준비된 정지 화면에 실제 앱 화면을 시험 배치한다. 정지 이미지 시험은 움직이는 영상의 추적 성공을 보장하지 않는다.
5. **모델 적합성 확인:** 실제 선택한 모델의 참조 이미지·길이·카메라 제어·출력 설정·프롬프트 제한을 확인한다. 지원하지 않는 지시는 수정한다. 현재 특정 Higgsfield 모델과 비용은 미확인이다.
6. **최종 프롬프트 수정:** 실제로 가능한 지시만 남긴다. 길이 때문에 핵심 지시가 약해지는 경우 간결한 실행본을 작성하고, 상세 브리프는 별도로 보존한다.
7. **실행 전 사용자 검토:** 최종 참조 이미지, 프롬프트, 모델, 길이, 비율, 출력 설정, 회당 크레딧, 시도 횟수 및 비용 상한을 함께 제시한다. 사용자 승인 전 유료 영상 생성은 실행하지 않는다.

각 검토에서 해결되지 않은 문제는 숨기지 않고 기록한다. 단순히 여러 번 읽었다는 이유로 통과시키지 않으며, 수정 이유와 예상 효과를 남긴다.

### 상업광고 품질 검수표

| 분야 | 확인 기준 |
|---|---|
| 얼굴과 연기 | 얼굴 비율·나이·눈동자·치아·입술·안경이 유지되고, 발화와 듣는 표정이 자연스럽다. 피부가 플라스틱처럼 보이지 않는다. |
| 인체와 의상 | 손가락과 관절이 자연스럽고, 손·팔이 책상에 안정적으로 놓인다. 옷의 주름과 질감이 이유 없이 바뀌지 않는다. |
| 공간 | 책상·의자·침대·창문·책장이 같은 위치와 형태를 유지한다. 불가능한 관통이나 크기 변화가 없다. |
| 촬영 | 수평, 이동 속도, 프레이밍, 초점 변화가 의도적으로 이어진다. 카메라 떨림·급가속·갑작스러운 줌·초점 탐색이 없다. |
| 조명 | 얼굴·방·창밖의 조명이 일관되고, 노출·색온도가 갑자기 바뀌지 않는다. 안경 반사가 눈을 계속 가리지 않는다. |
| 제품 | 태블릿의 베젤·모서리·화면·거치대가 유지된다. 제품명과 로고가 드러나지 않는다. |
| 합성 | 공개 구간 전체에서 앱 화면이 밀리거나 흔들리지 않고, 마커 잔상과 경계선 누출이 없다. 반사·가림·밝기·초점이 장면과 맞는다. |
| 시간적 일관성 | 머리카락·벽·옷·책·마커에 깜빡임, 텍스처 끓음, 잔상, 갑작스러운 형태 변화가 없다. |
| 웹 사용 | 정지 프레임과 왕복 스크롤에서도 이상한 표정이나 갑작스러운 변화가 두드러지지 않는다. 모바일 크롭에서도 주요 피사체가 보인다. |
| 출력 | 원본 품질을 확인하고, 업스케일이나 프레임 보간이 새 결함을 만드는지 점검한다. 높은 해상도 표시만으로 품질을 판정하지 않는다. |

검수는 정상 속도 재생, 느린 재생, 주요 구간 프레임 단위 확인, 최종 웹 크기 확인을 함께 사용한다. 최종 합성본도 같은 기준으로 다시 점검한다.

### 비용을 줄이기 위한 판단 원칙

- 문제를 발견하면 원인을 먼저 분류하고, 같은 프롬프트를 무작정 반복 실행하지 않는다.
- 로고 제거·색 보정·짧은 추적 이탈은 후반 보정 비용과 재생성 비용을 비교한다.
- 인물이나 기기의 심한 형태 변화는 보정으로 해결 가능한지 판단한 뒤 재생성을 검토한다.
- 낮은 비용의 시험 생성이 가능한지는 실제 모델에서 확인한다. 저품질 시험본은 최종 품질을 보장하지 않으며, 별도 생성 자체가 추가 비용이 될 수도 있다.
- 승인된 비용 상한을 넘거나 추가 유료 시도가 필요하면, 결과와 수정안을 먼저 제시한다.
- 모델·설정·참조 이미지·프롬프트 버전·비용·실패 원인을 기록해 반복 실패를 줄인다.

## 11. 현재 결론

인물·시간·환경·합성 목표는 정리됐다. 다음 작업은 비용을 쓰는 영상 생성이 아니라, 시작과 마지막 구도를 구체화하고 모델별 실행 조건을 확인하는 것이다. 이 문서는 최종 결과 검증 보고서가 아니라, 생성 전에 문제를 줄이기 위한 기획 및 프롬프트 검토 문서다.

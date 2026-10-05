# 리얼아카데미 스크롤 영상 — 기획, 영문 프롬프트, 검토 사항

- 작성일: 2026-10-05 (한국 시간)
- 상태: 논의용 제작 초안. 영상 생성 및 크레딧 사용 없음.
- 목적: 아이가 방에서 태블릿을 사용하는 모습에서 출발해, 카메라 이동으로 리얼아카데미 스피킹 화면을 드러내는 웹사이트용 영상.
- 참조: [토스 홈페이지](https://toss.im/)
- 제작 순서: 구도 확정 → 참조 이미지 → 영상 생성 → 실제 앱 화면 합성 → 최종 영상에서 프레임 추출 → 스크롤 연동.
- 품질 목표: 실제 TV 상업광고에 어울리는 고품질 실사 영상. 단순한 AI 데모 수준은 통과시키지 않는다.
- 비용 원칙: 제작 직전까지 반복 수정·검토하여 실패 가능성을 낮춘다. 유료 영상 생성은 최종 브리프와 실행 설정, 회당 비용을 검토하고 사용자가 승인한 뒤 진행한다.

## 1. 어떤 방식으로 작성된 프롬프트인가

이 프롬프트는 **구조화된 자연어 촬영 지시서**다. 특정 영상 모델의 전용 문법이나 API 명세가 아니다. 인물·공간·조명·소품·연기·카메라 이동·시간 구간·합성 조건을 나누어, 모델이 한 장면의 의도를 이해하도록 작성했다.

기본 구조는 `Subject → Setting → Prop → Screen → Performance → Camera → Final composition → Constraints`다. 여기에 8초의 임시 시간 배분을 붙인 원테이크 구성이다. 소제목과 시간 표기는 설명용이며, 모델이 이를 정확한 타임라인 명령으로 실행한다는 보장은 없다.

특히 **합성 작업을 먼저 고려한 촬영 설계**를 적용했다. 아이와 방은 생성하고, 태블릿의 실제 앱 화면은 후반 작업으로 교체한다. 원본 화면에는 중간 회색 배경과 고정 마커만 둔다. AI가 정확한 브랜드명이나 앱 UI를 그리도록 요구하지 않는다.

현재 문서는 텍스트 기반 제작 브리프다. 비용을 쓰는 실제 생성 단계에서는 같은 설정으로 만든 시작·마지막 참조 이미지를 활용하는 방식을 제안한다. 선택한 모델의 이미지 입력 및 시작/종료 프레임 지원 여부는 아직 확인하지 않았다.

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
| 소리 | 무음 | 사용자 지정 |
| 기기 | 갤럭시 탭 A11로 해석, 가로 배치 | 모델명은 문맥에 따른 해석, 가로 배치는 제안 |
| 로고 | 기기와 소품에 로고·브랜드 표시 없음 | 사용자 지정 |
| 화면 합성 | 추후 실제 리얼아카데미 화면으로 교체 | 사용자 지정 |
| 추적 기준 | 회색 화면, 네 모서리 안쪽 십자 4개와 중앙 십자 1개 | 마커 필요성은 사용자 요청, 배치·색상은 제안 |
| 길이 | 약 8초 | 임시 제안 |
| 카메라 | 아이 오른쪽 앞 → 오른쪽 옆 → 오른쪽 어깨 뒤 | 임시 제안 |
| 기기 색상 | 그레이 | 임시 제안 |
| 비율·해상도·프레임률 | 미정 | 생성 전 결정 필요 |

삼성 공식 제품에 [갤럭시 탭 A11](https://www.samsung.com/sec/tablets/galaxy-tab-a11-wifi-x135n/SM-X133NZAAKOO/)이 있으며, [8.7인치 모델](https://www.samsung.com/uk/tablets/galaxy-tab-a/galaxy-tab-a11-grey-64gb-lte-sm-x135fzaaeub/)을 기준으로 작성했다. 사용자 표현인 ‘갤럭시 에이11’을 태블릿 문맥에 따라 해석한 것이므로, 실제 보유 기기와 다르면 생성 전에 수정한다.

## 3. 장면 구성

| 구간 | 화면과 연기 | 제작 의도 |
|---|---|---|
| 0–2초 | 오른쪽 앞에서 얼굴·상체 클로즈업. 태블릿 화면은 가려짐. 아이가 짧게 답함 | 인물과 감정에 먼저 집중 |
| 2–7초 | 오른쪽 옆을 지나 어깨 뒤로 이동. 아이는 듣는 표정. 태블릿 화면이 드러남 | 같은 공간 안에서 활동의 정체를 공개 |
| 7–8초 | 화면 네 모서리와 마커가 보이는 어깨 너머 구도. 약 1초 안정화 | 실제 앱 화면 합성과 스크롤 종료 구간 확보 |

짧은 대답은 화면이 보이기 전부터 자연스럽게 수업 중이라는 인상을 준다. 화면 공개 후에도 명확한 발화가 필요하면 두 번째 짧은 대답을 넣을 수 있지만, 현재 초안은 입 움직임과 연기 오류를 줄이기 위해 한 번만 요청한다.

## 4. 통합 영문 프롬프트

아래 프롬프트는 이전의 ‘앱 UI가 보이는 화면’ 지시를 대체한다. 두 버전을 함께 사용하지 않는다.

```text
Create an approximately 8-second silent, photorealistic
live-action commercial shot in one continuous take.

SUBJECT
A cute Korean elementary school boy, approximately 9 years old,
with short natural black hair and round, thin-framed glasses.
He wears a plain cream sweatshirt with no logos or lettering.

He sits comfortably at his own study desk, engaged in a speaking
practice activity on a tablet. His expression is relaxed,
attentive, and subtly cheerful.

ROOM AND TIME
It is around 8 PM in the boy's bedroom in a contemporary
South Korean apartment.

The room is tidy but genuinely lived-in: a light wood study desk,
an ergonomic study chair, children's books and school workbooks,
a pencil cup, a small bed, and a few modest personal belongings.

Place the desk and chair so there is clear camera travel space
along the boy's right-hand side. Keep the camera path free of
walls, furniture, and other obstacles.

The window is dark, with faint distant apartment lights outside.
Soft warm overhead lighting and a desk lamp create a comfortably
bright evening atmosphere. Keep skin tones natural and avoid
an excessive orange tint.

No visible brand logos or prominent readable lettering anywhere.

TABLET
Use the physical proportions and exterior design of an
8.7-inch Samsung Galaxy Tab A11, in a plain gray finish,
positioned horizontally on a simple, stable desk stand.

Remove all visible manufacturer logos, product names,
printed markings, and branding from the tablet and stand.

Keep the tablet stationary, with a rigid rectangular shape,
consistent proportions, and straight bezel edges.

SCREEN FOR LATER COMPOSITING
The entire active display shows a uniform medium-gray background
with exactly five static black cross-shaped tracking markers:
four slightly inset from the display corners, and one smaller
cross at the center.

The markers remain fixed to the display surface and follow
its perspective naturally. Their positions relative to the
screen never change.

No application interface, instructor video, text, icons,
logos, buttons, or screen animations in the generated footage.
The speaking application will be added in post-production.

Keep the screen moderately illuminated with subtle reflections.
Avoid glare that obscures the markers or display edges.

OPENING — APPROXIMATELY 0 TO 2 SECONDS
Begin with a close three-quarter view from in front of the boy,
slightly to his right, showing his face and upper torso.

He looks down toward the tablet. His eyes are visible through
his glasses. Only part of the tablet's back or edge is visible;
the display content is hidden from the camera.

He gives one brief, natural spoken response with subtle lip
movement, then settles into an attentive listening expression.
The footage remains silent.

CAMERA TRAVEL — APPROXIMATELY 2 TO 7 SECONDS
Move the camera smoothly along the boy's right-hand side,
from the front-right view, past his right-side profile,
to a position just behind his right shoulder.

The camera physically travels through the clear space beside
the desk. It does not pass through the boy, furniture,
or the tablet.

The boy remains seated and focused on the display.
He does not turn his body to follow the camera.

Gradually reveal the tablet display, then gently move closer.
Use restrained, continuous movement with a level horizon
and minimal motion blur.

This is a partial orbit, not a full 360-degree rotation.

FINAL VIEW — APPROXIMATELY 7 TO 8 SECONDS
Settle into a stable over-the-right-shoulder composition.

Include only a small portion of the boy's shoulder in the
foreground. Make the tablet display the main visual focus.

Keep all four display corners and all five tracking markers
clearly visible. View the screen from a mild angle, avoiding
extreme perspective compression.

Hold this final composition for approximately one second.
The boy remains attentive, with a small, natural smile.

HANDS AND PERFORMANCE
His hands rest comfortably on the desk outside the active
display area. No tapping, swiping, or gestures across the screen.

Use subtle blinking and breathing. Avoid exaggerated acting,
continuous mouth movement, or looking into the camera.

VISUAL STYLE
Photorealistic footage with the visual finish of a high-end
Korean television commercial, captured as a carefully staged
live-action production.

Use motivated, soft evening lighting with controlled highlights,
gentle shadow detail, natural skin tones, and realistic skin
texture. Preserve fine hair detail, believable fabric texture,
and natural reflections on the glasses and tablet.

Use a smooth, precisely controlled camera move and intentional
framing. Keep the boy's eyes clear in the opening shot, then
transition focus smoothly to the tablet display as it is revealed.
Keep the display edges and tracking markers sharp in the final view.

Maintain consistent exposure and white balance throughout.
Use restrained commercial color grading, without waxy skin,
excessive beauty smoothing, artificial HDR, oversharpening,
heavy grain, exaggerated lens effects, or synthetic-looking lighting.

No cuts, transitions, sudden zooms, camera shake,
focus hunting, heavy motion blur, geometry changes,
distorted glasses, extra fingers, changing marker positions,
floating objects, captions, watermarks, or visible branding.
```

## 5. 검증 결과와 한계

### 현재 확인한 것

- 사용자 요청과 인물·장소·시간·무음·로고 제거 조건의 일관성.
- 앱 UI 생성 지시와 합성용 마커 지시의 충돌 해소.
- 카메라 방향과 책상 옆 이동 공간 명시.
- 화면을 손으로 가리지 않는 연기와 마지막 안정 구간 확보.
- 모델명에 대한 삼성 공식 제품 정보 확인.

### 아직 확인하지 않은 것

- Higgsfield에서 사용할 실제 모델, 입력 제한, 지원 길이와 해상도, 크레딧 비용.
- 모델이 시작·종료 참조 이미지, 카메라 제어, 별도 네거티브 프롬프트를 지원하는지.
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
| 로고가 다시 생김 | 제조사 이름이 브랜드 표시 생성으로 연결될 수 있음 | 참조 이미지에서 로고 제거. 생성 후 뒷면·베젤·옷·소품 점검 및 리터치 |
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
| 태블릿 비율과 앱 녹화 비율 불일치 | 녹화물을 늘리면 UI가 왜곡됨 | 활성 화면 비율에 맞는 가로 앱 자료 준비. 필요한 경우 여백 또는 크롭 설계 |
| 스피킹 행동과 앱 반응 불일치 | 입은 움직이는데 UI가 듣기 상태거나 상대가 동시에 말함 | 짧은 발화 타이밍에 맞춰 앱 상태·상대 반응 편집 |
| 조명이 너무 어둡거나 주황색 | ‘저녁’과 ‘따뜻함’을 과하게 해석 | 실내는 밝게, 창밖만 어둡게. 피부색과 안경 너머 눈 확인 |
| 한국 방이 지나치게 일반화됨 | 문화권 표기만으로 현실적인 방을 보장하지 못함 | 실제 한국 아파트 아이 방의 레이아웃·소품 참조. 불필요한 장식 최소화 |
| 스크롤 정지 때 이상한 표정이 보임 | 영상 재생 때 지나가는 입·눈 프레임이 오래 고정됨 | 중간 프레임도 검토. 중요 메시지 구간은 안정된 표정·화면을 선택 |
| 역스크롤에서 행동이 역재생됨 | 스크롤 진행률과 프레임 번호를 직접 연결하는 구조 | 입 움직임·손동작을 최소화. 자연스러운 왕복 경험은 구현 단계에서 검토 |
| 8초를 긴 스크롤에 늘려 부자연스러움 | 사람의 미세 움직임이 지나치게 느려 보임 | 실제 스크롤 거리와 영상 길이를 함께 조정 |
| 모바일 크롭 문제 | 얼굴 중심 시작과 태블릿 중심 끝을 한 비율로 담기 어려움 | 데스크톱·모바일 주요 영역 설계. 필요시 별도 크롭 또는 별도 영상 |
| 이미지 시퀀스 용량·메모리 증가 | 프레임 수와 해상도가 커질수록 로딩 부담 증가 | 최종 합성 후 추출. 해상도·프레임 수·이미지 압축·선로딩을 실제 기기에서 확인 |
| 스크롤 구현이 매끄럽지 않음 | 프레임 누락, 로딩 지연, 과한 보간, 시킹 지연 | 이미지 시퀀스 또는 비디오 방식의 실제 성능 비교 후 선택 |
| 생성 비용이 예상보다 커짐 | 카메라·인물·마커 오류로 재시도 누적 | 모델별 실제 비용 확인, 참조 이미지 검토 먼저 수행, 시도 횟수와 비용 상한은 사용자와 결정 |
| 재현성 부족 | 같은 프롬프트라도 매번 결과가 달라질 수 있음 | 모델·설정·지원 시 시드·참조 이미지·버전을 기록 |

트래킹 마커는 보조 기준점이며 성공 보증 장치가 아니다. 표면에 추적할 특징이 있으면 별도 마커가 필요하지 않을 수도 있다는 점은 [Boris FX 공식 설명](https://support.borisfx.com/hc/en-us/articles/11065159321869-What-kind-of-tracking-markers-should-I-use)을 참고한다. 이 문서의 ‘회색 배경과 마커 5개’는 본 장면을 위한 제안이며 보편적인 필수 규격이 아니다.

## 7. 실제 제작 전 확인 사항

- [ ] 실제 기기가 갤럭시 탭 A11인지, 색상과 형태가 맞는지 확인.
- [ ] 최종 데스크톱·모바일 화면 비율과 영상 사용 영역 결정.
- [ ] 8초 길이와 마지막 약 1초 안정 구간 확정.
- [ ] 실제 사용할 Higgsfield 모델과 지원 기능, 출력 사양, 크레딧 비용 확인.
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

# 김홍지 | 웹 퍼블리셔 인트로 사이트

> 화면을 그리기 전에 의미를 먼저 설계하는 웹 퍼블리셔 김홍지입니다.

- 사이트: https://4r1da7.github.io/intro/
- 프로젝트: [ferm LIVING](https://4r1da7.github.io/fermLIVING/) · [SAINT LAURENT](https://4r1da7.github.io/YSL/)

## 폴더 구조

```
intro/
├─ index.html          페이지 전체 마크업
├─ css/style.css       tokens → reset → module → layout → page → xray → render 순서
├─ js/main.js          기능별 함수 7개 (jQuery 없이 작성)
└─ images/             프로젝트 화면 캡처(WebP), 파비콘, 공유 이미지
```

## 이 페이지에서 확인할 수 있는 것

| 기능 | 어디에 | 설명 |
| --- | --- | --- |
| 렌더링 인트로 | 첫 화면 | 첫 화면을 HTML → 레이아웃 → 디자인 순서로 보여줍니다. `html`의 `data-stage` 값 하나로 단계를 바꾸고, HTML 단계는 `all: revert` 한 줄로 브라우저 기본 스타일을 재현합니다. 단계 사이의 움직임은 View Transitions API가 만들고, 지원하지 않는 브라우저와 움직임 줄이기 사용자는 바로 바뀝니다. 방문당 한 번 자동 재생되고, 단계 버튼과 '다시 보기'로 직접 볼 수 있습니다. |
| 구조 보기 | 헤더, 소개 영역 버튼 | `html`에 `.is_xray` 클래스만 붙이고, 점선과 태그 이름표는 CSS `content`로 그립니다. 켜면 태그 개수를 세어 하단에 보여줍니다. |
| 접근성 탭 | 프로젝트 화면 (메인/목록/상세/결제) | `role="tablist"`, `aria-selected`, `aria-controls`를 쓰고, ← → Home End 키로 이동합니다. 선택된 탭만 `tabindex="0"`입니다. |
| 모바일 메뉴 | 1279px 이하 헤더 | `aria-expanded`로 상태를 알리고, ESC 키로 닫으면 메뉴 버튼으로 포커스를 돌려줍니다. JS가 없으면 메뉴가 펼쳐진 채로 보입니다. |
| 스크롤 위치 표시 | 주 메뉴, 페이지 구조 목차 | `IntersectionObserver`로 화면 가운데의 섹션을 찾아 링크에 `aria-current="true"`를 붙입니다. |
| 반응형 구간 자 | 일하는 방식 4번 | 현재 구간 강조를 JS 없이 미디어쿼리만으로 바꿉니다. |
| 섹션별 색 띠 | 프로젝트(어두운 띠), 연락처(초록색 띠) | 색을 새로 지정하지 않고 CSS 변수(토큰)만 섹션 안에서 다시 정의해, 안에 있는 코드 박스 · 버튼 · 탭이 모두 자동으로 따라 바뀝니다. |
| 이메일 복사 | 연락처 | 클립보드 API를 쓰고, 막혀 있으면 주소를 선택해 둡니다. 결과는 `role="status"`로 스크린리더에 알립니다. |

## 접근성 · 웹 표준 체크

- `lang="ko"`, 본문 바로가기 링크, 랜드마크(`header` `nav` `main` `footer`)
- 제목 순서 h1 → h2 → h3 → h4 (건너뛰는 단계 없음)
- 모든 섹션에 `aria-labelledby`로 제목 연결, 두 개의 `nav`는 `aria-label`로 구분
- 새 창 링크에는 스크린리더용 "(새 창)" 텍스트
- 모든 이미지에 내용을 설명하는 `alt`, `width` · `height` 지정(레이아웃 밀림 방지)
- 키보드 포커스 표시(`:focus-visible`), 글자 대비 WCAG AA 이상(라이트 · 다크 모두)
- `prefers-reduced-motion` 사용자는 부드러운 스크롤과 애니메이션을 끔
- `prefers-color-scheme`에 맞춘 다크 모드

## 반응형 구간

두 프로젝트와 같은 기준을 모바일 우선으로 작성했습니다.

| 구간 | 너비 | CSS |
| --- | --- | --- |
| 모바일 | ~ 767px | 기본 스타일 |
| 태블릿 | 768 ~ 1279px | `@media (min-width: 768px)` |
| PC | 1280px ~ | `@media (min-width: 1280px)` |

## 성장 기록 숫자는 어떻게 셌나요

두 프로젝트 저장소에서 직접 셌습니다.

- HTML 페이지: 루트의 `.html` 파일 수 (YSL 390, ferm LIVING 610)
- CSS 속성 선언: 라이브러리(bxSlider) CSS를 뺀 직접 작성 CSS에서 세미콜론(`;`) 개수 (YSL 10,352, ferm LIVING 2,570)
- 디자인 토큰: `module.css`의 `:root`에 정의한 CSS 변수 (ferm LIVING 98개, `var()` 사용 590번)
- `data-panel`: ferm LIVING 610페이지 전체에서 3,130번 사용

## 색

ferm LIVING에서 직접 만든 디자인 토큰을 이어서 썼습니다.

- 배경 `--CS01 #F5F4EE`
- 포인트 `--SC01 #005B49`

## 사용 글꼴

- IBM Plex Sans KR, IBM Plex Mono (Google Fonts, SIL Open Font License)

---

본 페이지는 AI를 보조 도구로 활용해 문구와 구조를 정리했으며, 최종 구현과 수정은 직접 진행했습니다.

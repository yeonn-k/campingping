![waving](https://capsule-render.vercel.app/api?type=waving&height=200&fontAlignY=40&text=campingping&color=gradient)


# 🧚‍♂️ 개발 기간 및 인원

- 개발 기간 : 2024/12/17 ~ 2025/01/08
- 개발 인원 : 프론트엔드 2명(김지연, 최준영) / 백엔드 2명(김영현, 백기준)

# 🪴 서비스 소개
- 서비스명 : campingping( 캠핑핑 )
  - 캠핑을 즐기는 사람들에게 최적의 캠핑장 정보를 제공하고, 위치를 기반으로 사람들과 연결할 수 있는 플랫폼
 
# ⚡️ 구현 기능
|기능|FE|
|---|:---:|
|회원가입/로그인/로그아웃 (로컬/카카오 API)|김지연|
|Input(React-Hook-Form)/Button 공용 컴포넌트|김지연|
|지역 검색(쿼리스트링 업데이트 및 위도 경도 반환)|김지연|
|지도 뷰(카카오 지도: 마커/커스텀 오버레이)|김지연|
|커뮤니티 게시글(CRUD)|최준영|
|커뮤니티 댓글(CRUD)|최준영|
|채팅 기능(Socket.io)|김지연|
|캠핑 카드 컴포넌트|김지연| 
|날씨 컴포넌트(기상청 API)|최준영|
|현재 위치 조회(geolocation)|최준영|
|위시리스트 추가/삭제/조회||
|스크롤 최상단 이동 컴포넌트|최준영|
|Desktop/Mobile버전 UI|김지연|
|캠핑장 상세 페이지(리팩토링)|김지연|
|카테고리 컴포넌트(리팩토링)|김지연|


# 📚 기술 스택
<div style="display: flex; gap: 12px;">
  <img src="https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white">
  <img src="https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white">
  <img src="https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white">
  <img src="https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black">
  <img src="https://img.shields.io/badge/Zustand-black?style=for-the-badge&logo=zustand&badgeColor=010101">
  <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101">
  <img src="https://img.shields.io/badge/gitlab-%23181717.svg?style=for-the-badge&logo=gitlab&logoColor=white">
  <img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white">
  <img src="https://img.shields.io/badge/Notion-%23000000.svg?style=for-the-badge&logo=notion&logoColor=white">
  <img src="https://img.shields.io/badge/figma-%23F24E1E.svg?style=for-the-badge&logo=figma&logoColor=white">
</div>


<br>
<br>
<br>

---
# ✨ 김지연: 구현 기능
## 🚀 sign up/ sign in/ sign out
### 📍sign up
- 이메일 인증 기능: 유저가 입력한 이메일로 인증 코드 발송, 해당 코드를 입력 받아 이메일 인증</li>
- 입력 폼에 대한 유효성 검사
  - 이메일: 이메일 형식 체크
  - 비밀번호: 최소 8자리, 영문/숫자/특수문자 포함된 형식 검사, 비밀번호 확인과 일치 여부 체크
  - 닉네임: 필수 요소

### 📍sign in
- 로컬 로그인: 유저의 이메일과 비밀번호를 입력받아 API 호출, 성공시 유저의 이메일을 `userStore` 상태 저장, `/list` 페이지로 리다이렉트
  - 카카오 로그인: 카카오 로그인 api 호출, 성공시 유저의 이메일을 `userStore` 상태 저장, `/list` 페이지로 리다이렉트
  - 회원가입 버튼: sign-up 페이지로 리다이렉트

### 📍sign out
- 로그아웃: 로그아웃 API 호출, userStore 상태 초기화

## 🗺️ map
### 지도/마커 생성
- 검색 지역이 선택 되지 않았을 경우 유저의 위치의 위도 경도를 사용하고 검색 지역이 선택된 경우 지역의 위도, 경도를 사용하여 지도 생성하고 해당하는 캠핑장 API 호출

- 위치 기반 캠핑장 검색
  - 사이트 접근 시 geoLocation으로 위치 권한 요청을 받아 `useLocationStore`에 유저의 위치를 저장
  - 위치 권한 요청 시 toast 알림으로 권한을 설정하지 않으면 사용하지 못하는 기능이 있음을 미리 알림
  - 위치 기반 검색의 경우 백엔드에 지정된 반경 내의 캠핑장만 검색되므로 지도를 옮길 수 없도록 설정
  
- 지역 검색: 특정 지역에 해당하는 캠핑장 검색: query 업데이트/ API 호출
  - 지역 검색 시 카테고리 필터링 가능
  - 카테고리 컴포넌트는 지역 검색 시에만 렌더링 되므로 `dynamic`을 사용하여 SSR 에러가 나지 않도록 처리
  - 데이터가 많으므로, 이미 있는 데이터는 추가로 로드하지 않도록 처리하여 렌더링 최적화

### 오버레이 표시
- 지도 위 마커 클릭 시 해당 캠핑장의 정보를 나타내는 커스텀 오버레이 표시
- 마커에 해당하는 캠핑장의 간단한 정보 제공

### 리스트 컴포넌트
- 지도 위에 표시된( 검색된 ) 캠핑장 리스트를 보여주는 컴포넌트
- 무한 스크롤: IntersectionObserver 활용

### 날씨 컴포넌트
- 유저 위치 기반일 경우 유저의 위치에 해당하는 위도와 경도 값을 전달하여 현재 위치의 날씨 제공
- 지역 검색 시 검색한 지역에 해당하는 위도와 경도 값을 전달하여 해당하는 지역의 날씨 제공

## 🔍 search
- `searchBar` 컴포넌트를 통해 `origin`, `category`, `region`을  `query`로 전달받음
- `origin`
  - `map` 이나 `list` 페이지에서 접근 시 `origin` 을 그대로 저장해서 기존 페이지로 기존 카테고리와 지역에 대한 정보를 전달
  - `detail`이나 외부 페이지에서 url을 입력해서 접근했을 경우 `origin`을 기본 값인 `map`으로 대체, `map` 페이지에서 지역 검색의 결과를 보여줌
 
  - query에서는 '서울시', '부산시' 등의 형태로 사용되나 렌더링 시에는 '서울특별시', '부산특별시' 등의 형태로 사용
  - `useRegion` 훅을 통해 새로운 지역이 선택되면 검색을 위해 필요한 형태로 형태를 변환하여 query에 업데이트하고 regionStore에는 선택된 값 비교와 선택된 버튼 색상 관리를 그대로 값 저장
  - 선택된 값이 기존의 `regionStore`에 저장된 값과 같은 경우, 쿼리 및 상태 관리 초기화
  - nav를 통해 페이지 이동 시 `regionStore` 상태 값 초기화
   
## 💬 chat
- 

## 🎨 desktop UI
## 💡components
- input component
- button component
- card component

## ♻️refactoring

## 📍toast 알림</b>으로 사용자에게 실시간 상태 알림을 제공하여 UX 개선

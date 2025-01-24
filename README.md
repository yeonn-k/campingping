![waving](https://capsule-render.vercel.app/api?type=waving&height=200&fontAlignY=40&text=campingping&color=gradient)


## 🧚‍♂️ 개발 기간 및 인원

- 개발 기간 : 2024/12/17 ~ 2025/01/08
- 개발 인원 : 프론트엔드 2명(김지연, 최준영) / 백엔드 2명(김영현, 백기준)

## 🪴 서비스 소개
- 서비스명 : campingping( 캠핑핑 )
  - 캠핑을 즐기는 사람들에게 최적의 캠핑장 정보를 제공하고, 위치를 기반으로 사람들과 연결할 수 있는 플랫폼
 
## ⚡️ 구현 기능
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


## 📚 기술 스택
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

---

<details markdown="1">
  
  <summary><h2>✨ 김지연: 구현 기능</h2></summary>
      <h3>🚀 sign up/ sign in/ sign out</h3>
        <ul>
          <li>📍sign up</li>
            <ul>
              <li>이메일 인증 기능: 유저가 입력한 이메일로 인증 코드 발송, 해당 코드를 입력 받아 이메일 인증</li>
              <li>입력 폼에 대한 유효성 검사</li>
                <ul>
                  <li>이메일: 이메일 형식 체크</li>
                  <li>비밀번호: 최소 8자리, 영문/숫자/특수문자 포함된 형식 검사, 비밀번호 확인과 일치 여부 체크</li>
                  <li>닉네임: 필수 요소</li>
                </ul>
            </ul>
          <li>📍sign in</li>
            <ul>
              <li>로컬 로그인: 유저의 이메일과 비밀번호를 입력받아 api 호출, 성공시 유저의 이메일을 userStore 상태 저장, `/list` 페이지로 리다이렉트</li>
              <li>카카오 로그인: 카카오 로그인 api 호출, 성공시 유저의 이메일을 userStore 상태 저장, `/list` 페이지로 리다이렉트</li>
              <li>회원가입 버튼: sign-up 페이지로 리다이렉트</li>
            </ul>
          <li>📍sign out</li>
            <ul>
              <li>로그아웃: 로그아웃 api 호출, userStore 상태 초기화</li>
            </ul>
          <li>📍`toast` 알림으로 사용자에게 실시간 상태 알림을 제공하여 UX 개선</li>
        </ul>
      <h3>🗺️ map</h3>
      <h3>🔍 search</h3>
      <h3>💬 chat</h3>
      <h3>🎨 desktop UI</h3>
      <h3>💡components</h3>
        <ul>
          <li>input component</li>
          <li>button component</li>
          <li>card component</li>
        </ul>
      <h3>♻️refactoring</h3>

  </div>
</details>

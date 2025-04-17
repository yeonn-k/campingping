![waving](https://capsule-render.vercel.app/api?type=waving&height=200&fontAlignY=40&text=campingping&color=gradient)

# 🧚‍♂️ 개발 기간 및 인원

- 개발 기간 : 2024/12/17 ~ 2025/01/08
- 개발 인원 : 프론트엔드 2명(김지연, 최준영) / 백엔드 2명(김영현, 백기준)

# 🪴 서비스 소개

- 서비스명 : campingping( 캠핑핑 )
  - 캠핑을 즐기는 사용자들이 위치를 기반으로 캠핑장을 탐색하고, 실시간으로 소통할 수 있는 웹 앱 서비스
  - **지도 중심 UX**와 **실시간 채팅**, **PWA 적용**, **클러스터링** 등 구현

# 🌱 기획 및 설계 포인트

- 야외에서 사용할 것을 고려해 모바일 중심으로 **성능, UX, 네트워크 안정성 중심으로 기능을 고려**했습니다.
- 지도 중심 UX 구현에서 **내 위치 기반 근처 탐색**과 **지역 검색**을 통해 사용자에게 직관적으로 서비스 할 수 있도록 고민을 하고 해결했습니다.
- **클러스터링**과 **캐싱 전략**을 통해 **성능 개선**에 대해 고민하고 해결했습니다.
- 채팅에서 **실시간 흐름과 사용자의 의도 간의 UX**에 대해 고민하고 이를 반영하여 자동 스크롤을 구현했습니다.

# 🌿 주요 기능

- **위치 기반 캠핑장 탐색**  
  사용자의 현재 위치를 받아, 인근 캠핑장을 표시합니다.

- **지도 이동 시 자동 재탐색**  
  특정 지역에 캠핑장이 없는 경우를 대비해,  
  사용자가 지도를 움직이면 자동으로 주변 캠핑장을 다시 불러옵니다.  
  → `onMouseUp` 이벤트 기반

- **지역 이름 검색 기능**  
  “경기도”, “강원도” 같은 지역으로 검색하면 해당 지역 중심으로 지도가 검색됩니다.

- **마커 과다 렌더링 문제 해결**  
  경기도처럼 캠핑장이 많은 지역에서 성능 이슈가 생겨,  
  마커를 클러스터링 방식으로 묶어 렌더링 속도와 UX를 개선했습니다.

- **실시간 채팅**  
  socket.io 기반의 실시간 채팅을 구현하고,  
  새 메시지 수신 시 자동 스크롤 / 알림 처리를 추가했습니다.  
  사용자가 직접 채팅창 위치를 조정한 경우엔 알림만 표시됩니다.

- **PWA 적용 + iOS 대응**  
  캠핑이 네트워크 불안정한 환경인 걸 고려해서,  
  서비스 워커 기반 캐싱 및 오프라인 지원 기능을 넣었습니다.  
  → iOS에서는 PWA 설치 UX를 따로 처리 (홈 화면 추가 안내)

- **React Query 기반 상태 유지**  
  뒤로 가기, 새로 고침, 공유 링크 접근 시에도  
  검색 조건이 초기화되지 않도록 상태를 URL과 캐시에 동기화했습니다.

# 🌼 배포 링크

- [캠핑핑 바로가기](https://campingping.com/)

# 🎨 디자인 링크

- [캠핑핑 Figma 바로가기](https://www.figma.com/design/oWWbWQUTCOVxGVJPhaZPCE/campingping)

---

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

## 💡 [기본 기능 상세 설명](https://github.com/yeonn-k/campingping/blob/dev/DETAILS.md)

## 💡 [리팩토링 기록](https://github.com/yeonn-k/campingping/blob/dev/REFACTOR.md)

## ✨ [추가기능 구현](https://github.com/yeonn-k/campingping/blob/dev/FEATURES.md)

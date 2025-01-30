![waving](https://capsule-render.vercel.app/api?type=waving&height=200&fontAlignY=40&text=Refactoring&color=gradient)

# 🛠️ 리팩토링 기록

## 📍 캠핑장 상세페이지

- 변경 전

  - 고캠핑 API 활용 시 많은 값이 `null`로 들어오는 데 해당 값에 대한 분기 처리 없이 백엔드에서는 모든 값을 전달하는 것과 관계 없이 대부분의 값을 렌더링 하지 않음
  - 검색 컴포넌트 미사용
  - 예상 외로 비어 있는 값이 올 경우 제목만 나오고 값은 비어 있게 렌더링

- 변경 후

  - 값이 있는 지 체크하여 조건부 렌더링 처리
  - 가능한 많은 정보를 유저에게 제공할 수 있도록 함
  - 홈페이지를 제공할 경우 링크를 누르면 해당 링크를 새창으로 열어 보여줌
  - 값이 없는 경우 제목도 나오지 않게 하여 어색하게 보이지 않도록 함

  ### 🔧 변경된 파일

  - src/app/list/[contentId]/page.tsx

## 📍 카카오 map Script

- 변경 전
  - 카카오 맵 스크립트 로드를 위해 `useEffect`와 `zustand` 사용
  - Script 컴포넌트에서 onLoad 이벤트를 통해 스크립트 로드 후 상태 업데이트 방식
  - `rootLayout`에 'use client' 사용 필요

- 변경 후
  - `beforeInteractive` 전략 사용: 페이지 렌더링 전에 스크립트를 로드하므로 페이지 로딩 속도를 향상시켜 사용자 경험 향상
  - `autoload=false`: 카카오 맵 SDK가 자동으로 로드되지 않아 스크립트 로드 후 필요 시점에 맵을 초기화할 수 있어 맵 로딩을 제어할 수 있도록 함
  - 불필요한 상태 관리 제거
  - `rootLayout`에서 'use client' 제거

  ### 🔧 변경된 파일

  - src/app/layout.tsx
  - src/stores/globalState.ts
 
## 📍 RootLayout

- 변경 전

  - `RootLayout`에 `useEffect`, `useState` 등 때문에 `Metadata`를 활용하지 못함

- 변경 후

  - `ClientLayout` 컴포넌트를 만들어서 클라이언트 관련 코드를 분리하고 RootLayout에 `Metadata` 작성

  ### 🔧 변경된 파일

  - src/app/layout.tsx
  - src/components/ClientLayout/ClientLayout.tsx

## 📍 Category component / hook

- 변경 전

  - 카테고리 기능이 리스트 페이지와 결합되어 있어 코드가 복잡해지고 재사용성이 떨어짐.
  - 카테고리 '전체' 가 아이콘 색상 변화를 위해 함께 관리되다 보니 카테고리 선택을 하지 않았을 때 'category=전체'검색이 되는 문제
  - list 페이지의 경우 새로고침 시 카테고리가 유지 되지 않음
  - 커스텀 드래그 구현으로 일부 아이콘이 드래그되지 않으나, 다른 아이콘은 드래그 되는 문제 발생

- 변경 후

  - 카테고리 hook 분리 및 재사용( useCategory.tsx ): map/list page
  - useCategory 훅을 통해서 선택된 카테고리가 '전체'로 되어있을 경우 null 을 반환하여 query가 업데이트 되지 않도록 변경( updateQueyString utill 활용 )
  - `searchParams.get()` 하여 카테고리 값을 업데이트 해주어 새로고침 시에도 값 유지
  - 불필요한 커스텀 드래그 코드를 제거하여 가독성 향상

  ### 🔧 변경된 파일

  - src/app/list/page.tsx
  - src/components/Categorry/Category.tsx
  - src/hooks/useCategory.tsx
  - src/utils/updateQueryString.tsx

## 📍 DefaultImg component

- 변경 전

  - 단순한 이미지를 위한 컴포넌트인데 불필요한 props가 지나치게 많음
  - 알 수 없는 type과 있지 않은 경로들...
  - 결과적으로 반환하는 것은 컴포넌트가 아닌 이미지 자체를 반환함

- 변경 후

  - 이미지를 대체할 간단한 컴포넌트 구현

  ### 🔧 변경된 파일

  - src/components/DefaultImg/DefaultImg.tsx

## 📍 not-found.tsx

- 일치하는 경로가 없을 경우 보여줄 페이지 작성



## 📍 컴포넌트 분리 및 재사용

- 일부 페이지 안에 들어 있던 컴포넌트를 분리하여 여러 페이지에서 재사용할 수 있도록 함

### 🔧 변경된 파일

- src/app/community/page.tsx
- src/components/ScrollToTop/ScrollToTop.tsx
- src/components/OpenTheChats/OpenTheChats.tsx

## 📍 createApiUrl.ts

- API 요청시 필요한 파라미터를 동적으로 생성하고 URL에 필요에 따라 쿼리 스트링을 추가/제거

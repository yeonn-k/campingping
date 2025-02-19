![waving](https://capsule-render.vercel.app/api?type=waving&height=200&fontAlignY=40&text=Refactoring&color=gradient)

# 🛠️ 리팩토링 기록

## 📍 Search / SearchBar

- 변경 전

  - zustand로 검색 지역에 대한 상태를 관리하여 검색할 페이지로 넘겨줌
    - 상태 변화 최소화 및 React 훅과 통합하는 방식으로 변경
  - `origin`, `category`, `region` 등 기존의 값을 받지 않음
    - `history.back`을 사용해서 기존 값 유지
    - 외부에서 링크로 접근했을 경우 문제 발생 등 예상하기 힘든 문제 발생
  - 보다 큰 지역으로만 검색 가능

- 변경 후

  - zustand로 상태 관리가 아닌 useRouter를 이용해 URL 변경하는 하는 방식으로 변경
    - `router.push() / `router.back()` 으로 대체
  - `map` 이나 `list` 페이지에서 접근 시 `origin` 을 그대로 저장해서 기존 페이지로 기존 카테고리와 지역에 대한 정보를 전달
    - `searchBar` 컴포넌트를 통해 `origin`, `category`, `region`을 `query`로 전달받음
    - `detail`이나 외부 페이지에서 URL을 입력해서 접근했을 경우 `origin`을 기본 값인 `map`으로 설정, `map` 페이지에서 지역 검색의 결과를 보여줌
  - `query`
    - `type`으로 '지역'과 '시군구'를 구분하여 하나의 함수로 관리
    - `useRegionSearch`를 통해 지역 선택 시 검색을 위한 형태로 변환
    - `createApiUrl`을 통해 쿼리스트링과 함께 api 호출 url 생성

- 관련 util

  - **_updateQueryString_**

    - URL의 쿼리 스트링을 동적으로 업데이트하고 브라우저 히스토리 관리
      - paramsToUpdate 객체: 쿼리 스트링을 업데이트 할 파라미터 객체 배열
      - key(파라미터 이름), value(파라미터 값, `null`일 경우 파라미터 삭제)

    ```typescript
    // 사용 예시
    updateQueryString({
      origin: 'map',
      category: '지역',
      region: '서울시',
    });
    ```

  - **_createApiUrl_**

    - 기본 base URL과 파라미터 목록을 받아 쿼리 스트링을 포함한 API 호출 URL을 생성
      - baseUrl(API 요청 url), ParamsList(파라미터 목록)

    ```typescript
    // 사용 예시
    const url = createApiUrl('https://morecodeplease.com/api/campings/lists', [
      { name: 'region', value: '서울시' },
      { name: 'city', value: '종로구' },
    ]);

    console.log(url);
    // https://morecodeplease.com/api/campings/lists?region=서울시&city=종로구
    ```

  ### 🔧 변경된 파일

  - src/utils/updateQueryString.ts
  - src/utils/createApiUrl.ts
  - src/hooks/useRegionSearch.tsx

  - src/app/search/page.tsx
  - src/components/SearchBar/SearchBar.tsx

  - src/stores/regionState.ts
  - src/app/map/page.tsx
  - src/app/list/page.tsx

## 📍 캠핑장 상세페이지

- 변경 전

  - 고캠핑 API 활용 시 많은 값이 `null`로 들어오는 데 해당 값에 대한 분기 처리 없이 백엔드에서는 모든 값을 전달하는 것과 관계 없이 대부분의 값을 렌더링 하지 않음
  - 검색 컴포넌트 미사용
  - 예상 외로 비어 있는 값이 올 경우 제목만 나오고 값은 비어 있게 렌더링
  - 날씨 컴포넌트는 유저가 보고 있는 캠핑장과 관계 없이 유저의 현재 위치의 날씨를 보여줌
  - 없는 페이지의 경우 계속해서 로딩중이라는 문구만 떠 있는 상태

- 변경 후

  - 값이 있는 지 체크하여 조건부 렌더링 처리
  - 가능한 많은 정보를 유저에게 제공할 수 있도록 함
  - 홈페이지를 제공할 경우 링크를 누르면 해당 링크를 새창으로 열어 보여줌
  - 값이 없는 경우 제목도 나오지 않게 하여 어색하게 보이지 않도록 함
  - 보고 있는 캠핑장의 '주소'에서 지역에 해당하는 부분을 꺼내어 위도 경도를 반환, 캠핑장 위치의 날씨를 보여주는 날씨 컴포넌트
  - 없는 페이지의 경우 `Notfound` 로 이동, 로딩 중에는 `LoadingSpinner`

  ### 🔧 변경된 파일

  - src/app/list/[contentId]/page.tsx
  - src/hooks/useLocation.tsx

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

## 📍 컴포넌트 분리 및 재사용

- 일부 페이지 안에 들어 있던 컴포넌트를 분리하여 여러 페이지에서 재사용할 수 있도록 함

  ### 🔧 변경된 파일

  - src/app/community/page.tsx
  - src/components/ScrollToTop/ScrollToTop.tsx
  - src/components/OpenTheChats/OpenTheChats.tsx

## 📍 card component

- 변경 전

  - 이미지의 크기가 일정치 않은 데, 이미지의 비율로 인해 카드 컴포넌트 UI 깨짐 발생

- 변경 후

  - `fill` 속성을 사용하여 이미지가 부모 요소에 맞게 자동 조정
  - `object-cover` 적용으로 비율 유지하면서 잘리지 않도록 조정

  ```typescript
  <Image
    src={imgSrc}
    alt="캠핑장 이미지"
    fill
    className="rounded object-cover"
    quality={60}
  />
  ```

  ### 🔧 변경된 파일

  - src/components/Card/Card.tsx

## 📍 build error 해결

- **_Suspense_**
  - Next.js 14 에서는 `useSearchParams`가 `Suspense` 없이 사용되면 문제 발생
    - 14 버전은 `useSearchParams` 가 비동기적으로 업데이트 되기 때문
    - `Suspense`로 감싸서 비동기 처리 보장해야 함

## 📍 로그인 후 쿠키 반영 문제 해결

- 변경 전

  - 로그인 후 router.push('/list')로 이동했으나, 새로 고침 하지 않으면 쿠키가 반영되지 않는 문제 발생

- 변경 후

  - `setTimeout(() => window.location.reload(), 100);` 추가하여 쿠키가 반영된 상태로 자동 새로고침되도록 개선

  ```typescript
  if (res.status === 200) {
    setUserState(email);
    setTimeout(() => {
      window.location.reload();
    }, 100);
  } else {
    toast.error('이메일 또는 비밀번호가 잘못되었습니다.');
  }

  useEffect(() => {
    if (userState) {
      router.push('/list');
    }
  }, [userState, router]);
  ```

## 📍 채팅

### 💬 채팅 목록 요청 API 에서 socket으로 수정

- 변경 전

  - 마지막 메시지가 실시간으로 최신화되지 않음
  - 읽지 않은 메시지 개수 처리가 정확하지 않음
  - `isRead` 값이 `boolean`으로 전달되어 읽음/안읽음만 구분 가능

- 변경 후
  - 새로운 메시지가 도착할 때마다 채팅방에서 `Socket` 이벤트 발생
  - 메시지가 올 때마다 마지막 메시지를 자동으로 최신화
  - isRead (boolean) → unReadCount (number)로 변경 -> 읽지 않은 메시지 개수를 정확히 표시

### 💬 채팅방에서 채팅 기록 띄우기

- 변경 전
  - 내가 보낸 메세지를 프론트에서 직접 렌더링에 추가하는 방식
- 변경 후
  - 메세지를 보낸 후 `newMessage` 이벤트 수신 시 기록을 다시 요청하는 방식으로 서버로 부터 채팅 기록 동일하게 데이터 최신화

## 📍 지도 페이지: 무한 스크롤 제거

- 변경 전
  - 렌더링 최적화를 위해 무한 스크롤을 구현
    - 초기 렌더링 시 마커가 일부만 표기되고, 스크롤을 통해 데이터를 추가로 불러와야 추가로 마커 생성
- 변경 후
  - 전체 데이터를 한 번에 로드하여 모든 마커를 한 번에 생성
  - 초기 렌더링 시 마커가 전부 표시되어 사용자 경험 개선

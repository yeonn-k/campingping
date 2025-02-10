![waving](https://capsule-render.vercel.app/api?type=waving&height=200&fontAlignY=40&text=campingping&color=gradient)

# ✨ 김지연: 구현 기능

## 🚀 sign up/ sign in/ sign out

### 📍sign up

- 유저의 가입을 위한 폼 제공
- 이메일 인증 기능: 유저가 입력한 이메일로 인증 코드 발송, 해당 코드를 입력 받아 이메일 인증 완료
  - 이메일: 이메일 형식 체크 후 유효하지 않은 이메일 형식은 에러 메세지 표시
  - 비밀번호: 최소 8자리, 영문/숫자/특수문자 포함된 형식 검사, 비밀번호 확인 후 유효하지 않은 형식이나 불일치 시 에러 메세지 표시
  - 닉네임: 필수 요소, 입력되지 않은 경우 에러 메세지 표시
- 모든 유효성 검사 통과 시 유저의 정보를 서버로 전송하여 회원가입 완료

### 📍sign in

- 로컬 로그인
  - 사용자가 이메일과 비밀번호를 입력하면 해당 정보를 API에 전송하여 로그인 시도
  - 로그인 성공 시, 유저의 이메일을 `userStore` 상태에 저장하고, /list 페이지로 리다이렉트
- 카카오 로그인
  - 카카오 로그인 버튼을 클릭하면, 백엔드에서 카카오 로그인을 처리한 후, 로그인된 이메일 정보를 쿼리 파라미터로 전달
  - 성공 시, 유저의 이메일을 `userStore` 상태에 저장하고, /list 페이지로 리다이렉트
- 회원가입 버튼
  - 회원가입 페이지로 리다이렉트하는 버튼 제공

### 📍sign out

- NAV의 로그아웃 버튼 클릭 시 로그아웃 API 호출, userStore 상태 초기화

## 🗺️ map

### 지도/마커 생성

- 검색 지역이 선택 되지 않았을 경우 유저의 위치의 위도 경도를 사용하고 검색 지역이 선택된 경우 지역의 위도, 경도를 사용하여 지도 생성하고 해당하는 캠핑장 API 호출

- 위치 기반 캠핑장 검색

  - 사이트 접근 시 geoLocation으로 위치 권한 요청을 받아 `useLocationStore`에 유저의 위치를 저장
  - 위치 권한 요청 시 toast 알림으로 권한을 설정하지 않으면 사용하지 못하는 기능이 있음을 미리 알림
  - 위치 기반 검색의 경우 백엔드에 지정된 반경 내의 캠핑장만 검색
  - **_📍 위치 상태 관리_**
    - 최적화를 위해 위치를 한 번 가져오면 `zustand` 전역 상태로 관리
      - `getCurrentLocation`함수는 비동기 함수여서 서버 컴포넌트에서 직접 호출할 수 없음
      - 매번 API 호출 대신 한 번 호출하여 전역 상태로 관리함으로써 불필요한 로딩을 줄임
    - `location.ts` 유틸을 활용해 유저의 `lat`, `lon`을 가져오고 정보가 없을 경우 `null` 반환

- 지역 검색: 특정 지역에 해당하는 캠핑장 검색: query 업데이트/ API 호출
  - 지역 검색 시 카테고리 필터링 가능
  - 카테고리 컴포넌트는 지역 검색 시에만 렌더링 되므로 `dynamic`을 사용하여 SSR 에러가 나지 않도록 처리

### 오버레이 표시

- 지도 위 마커 클릭 시 해당 캠핑장의 정보를 나타내는 커스텀 오버레이 표시
- 마커에 해당하는 캠핑장의 간단한 정보(캠핑장 이름, 대표 사진, 주소 일부) 제공

### 리스트 컴포넌트

- 지도 위에 표시된( 검색된 ) 캠핑장 리스트를 보여주는 컴포넌트

### 날씨 컴포넌트

- 유저 위치 기반일 경우 유저의 위치에 해당하는 위도와 경도 값을 전달하여 현재 위치의 날씨 제공
- 지역 검색 시 검색한 지역에 해당하는 위도와 경도 값을 전달하여 해당하는 지역의 날씨 제공

## 🔍 search

- `search` 페이지 또한 단독의 페이지로 구성 되어 있으므로 다른 페이지의 쿼리로 영향이 받지 않도록 전역 상태관리로 검색 내용 관리
- 지역명 변환: '서울특별시' -> '서울시', '제주특별자치도' -> '제주시' ...
  ```typescript
  if (value.includes('특별자치')) {
    formattedRegion = value.slice(0, 2) + value.slice(-1);
  } else if (value.includes('광역시') || value.includes('특별시')) {
    formattedRegion = value.slice(0, 2) + '시';
  }
  ```
  - 선택 값이 기존 `regionStore` 값과 동일할 경우 쿼리 및 상태 초기화
  - 페이지 이동 시 `regionStore` 상태 값 초기화

## 💬 chat

- Socket.io를 활용한 실시간 채팅 기능 구현
  - 유저의 참여 중 채팅방 리스트 표시( restAPI 요청 )
  - 특정 채팅방 선택 시 ChatRoomId 상태 업데이트를 통해 입장하고 메시지 입력시 `socket.emit`으로 서버로 이벤트 전송
  - 저장된 유저의 이메일을 활용하여 내가 보낸 메세지와 상대방이 보낸 메세지를 구분하여 표시
  - `useRef`를 활용한 자동 스크롤
    - ScrollHeight`: 요소 전체의 스크롤 가능한 높이 = 맨 아래 메세지 까지의 총 높이
    - `top: chatContainerRef.current.scrollHeight` 설정을 통해 스크롤을 가장 아래로 이동시키는 효과
    - 의존성 배열에 chatMsgs를 설정함으로써 채팅이 추가될 때 마다 실행시켜 새 메세지가 도착하면 자동으로 맨 아래로 스크롤

## 🎨 desktop UI

- 모바일 퍼스트 웹으로 `userAgent` 로 유저의 디바이스를 구분하여 모바일이 아닐 경우 추가로 desktop ui를 렌더링

## 💡components

### input component

- `react-hook-form` 사용
- react-hook-form과 함께 사용하여 폼 검증 가능
- `hasError`로 에러 발생시 `true` 설정이 되고 이 경우 설정된 `errorMessage`가 출력
- Tailwind CSS로 스타일 확장 가능

  ```typescript
    <Input
      placeholder="비밀번호를 입력해주세요"
      type="password"
      {...register('password', {
        required: '비밀번호를 입력해주세요',
        pattern: {
          value: /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/,
          message: '영문, 숫자, 특수문자 포함 8자리 이상이어야 합니다.',
        },
      })}
      hasError={!!errors.password}
      errorMessage={errors.password?.message}
    />
  ```

### button component

- 비동기 함수 지원
- 로딩 시 로딩 스피너 표시 가능
- Tailwind CCSS 스타일 확장 가능

### card component

- 캠핑장 정보를 표시하는 카드 공용 컴포넌트
- 이미지 등의 기본적으로 표시되는 내용이 없을 경우 지정 된 '기본값' 표시
- 클릭 시 해당 아이템 상세 페이지로 이동

## 📍**_toast 알림_**으로 사용자에게 실시간 상태 알림을 제공하여 UX 개선

## 🛜 EC2 배포

---

## 💡 [리팩토링 기록](https://github.com/yeonn-k/campingping/blob/dev/REFACTOR.md)

## ✨ [추가기능 구현](https://github.com/yeonn-k/campingping/blob/dev/FEATURES.md)

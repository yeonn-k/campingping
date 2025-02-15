![waving](https://capsule-render.vercel.app/api?type=waving&height=200&fontAlignY=40&text=campingping&color=gradient)

# ✨ 김지연: 추가 구현 기능

## 📲 PWA( Progressive Web App )

- PWA 기능 지원을 통해 웹 애플리케이션을 네이티브 앱처럼 설치, 오프라인에서 사용할 수 있도록 지원
  - 채팅 기능에서 push 알림을 지원할 수 있도록 하기 위함
- `manifest.json` 파일 설정으로 앱 아이콘, 시작 URL, shortcuts, 색상 등 설정
- display: `standalone` 옵션을 통해 브라우저 없이 독립 실행 가능하도록 설정
- 설치 프로세스 구현
  - 유저가 웹 앱을 설치할 수 있도록 `beforeinstallprompt` 이벤트 활용
  - usePwtPrompt 커스텀 훅을 통해 PWA 설치 프롬프트 상태를 전역에서 관리
  - 설치/실패에 대해 toast 알림으로 UX 향상
  ```typescript
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as unknown as BeforeInstallPromptEvent);
    };
    window.addEventListener(
      'beforeinstallprompt',
      handleBeforeInstallPrompt as EventListener
    );
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt as EventListener
      );
    };
  }, []);
  const installPWA = () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((result) => {
      if (result.outcome === 'accepted') {
        toast.success('PWA가 설치되었습니다! 🎉');
      } else {
        toast.error('설치가 취소되었습니다.');
      }
      setDeferredPrompt(null);
    });
  };
  ```
- 일림 권한 설정 프로세스 구현
  - PWA 일 경우에만 알림 권한에 대한 동의 여부 모달 발생

```typescript
const isPWA = () => window.matchMedia('(display-mode: standalone)').matches;
const getPermission = async () => {
  await Notification.requestPermission();
  setIsPwaAlarmOpen(false);
};
const denyPermission = () => {
  setIsPwaAlarmOpen(false);
};
const askPushNotification = () => {
  const askNotificationPermission = async () => {
    if (!isPWA()) {
      return;
    }
    if (Notification.permission === 'default') {
      setIsPwaAlarmOpen(true);
    }
  };
  askNotificationPermission();
};
useEffect(() => {
  askPushNotification();
}, []);
```

- 설치 동의 / 알림 동의 권한 요청 커스텀 모달
- 서비스 워커 및 캐싱을 활용한 성능 최적화
  - `@ducanh2912/next-pwa`
- maskable icon 등록

## 💬 Chat

### 이전 메세지 불러오기( 무한 스크롤 )

- 채팅방 최상단으로 스크롤 시 디바운싱을 통해 이전 채팅 요청
- `scrollTop === 0` 조건을 만족할 경우 서버에 `nextCursor`를 포함해 이전 메세지 요청
- 디바운스 구현을 통한 불필요한 요청 방지, `300ms` 딜레이 설정
- 새로운 메세지 데이터를 받은 뒤 중복 메세지 필터링 후 기존 메세지 리스트 **_앞쪽_**에 추가
- 기존에 보고 있던 메세지 위치로 조정 및 불필요한 추가 요청을 막기 위해 `scrollTo` 메서드로 스크롤 위치 조정

### Enter 입력 채팅 / 한글 입력 중복 방지

- `Enter` 키 입력으로 채팅 전송
- `Shift` + `Enter`로 줄 바꿈 가능
- 한글 입력 조합 중에는 이벤트 실행하지 않음

```typescript
const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    if (inputValue && chatRoomId !== null) {
      // 한글 입력 조합 중 이벤트 중단
      if (e.nativeEvent.isComposing) {
        e.stopPropagation();
        return;
      }
      const messageToSend = inputValue;
      sendChatMsg(messageToSend, chatRoomId);
      resetInput();
    }
  }
};
```

### 읽지 않은 메세지

- 채팅방 안에서 읽지 않은 메세지에는 '읽지 않음' 표시
- socket 이벤트 `updateRead` 수신 시, chatMsgs 의 모든 isRead 상태를 true로 변환

### 채팅 시간 관리( day.js )

- day.js를 활용한 util 함수 `timeFormat.ts`
- utc 시간으로 받아서 사용하고자 하는 형태로 변환

### 채팅방 나가기 기능 구현

- 특정 채팅방에서 나가기 버튼을 클릭하면 API DELETE 요청을 보내도록 구현

## 🗺️ Map

### 지도 클러스터러 적용

- 리팩토링으로 전체 데이터를 한 번에 로드하여 모든 마커를 한 번에 생성
- 렌더링 속도 저하로 지도 클러스터러 추가 -> 렌더링 속도 최적화

```typescript
const markers = positions.map(function (position) {
  return new window.kakao.maps.Marker({
    position: new window.kakao.maps.LatLng(
      position.latlng[1],
      position.latlng[0]
    ),
  });
});
const clusterer = new window.kakao.maps.MarkerClusterer({
  map: kakaoMap,
  averageCenter: true,
  minLevel: 10,
  markers: markers,
});
markers.forEach((marker) => marker.setMap(null));
clusterer.clear();
setTimeout(() => clusterer.redraw(), 100);
```

### 지도의 주변 캠핑장 검색 mouseup 이벤트로 유저의 지도 움직임에 따른 api 호출 기능 추가

- 유저가 지도를 옮기면서 자신의 주변에서 원하는 위치의 캠핑장을 검색할 수 있도록 구현

  - `onMapCenterChanged`: 지도의 center로 부터 `Lat`과 `Lon`을 추출하는 함수
  - `mouseup` 이벤트 발생 시 해당 함수 발생
  - 주변 캠핑장 검색 함수(`getNearByCampings`)에 업데이트된 위도, 경도를 전달하여 지도 움직임에 따른 캠핑장 검색

- '지역 검색'은 특정 목적을 가지므로 해당 기능 지원하지 않음

### 지도 움직임 안내 문구 추가

- 지도 페이지에서 '지도를 움직여보세요' 라는 문구와 아이콘이 나타남으로써 유저의 행동을 유도
- 해당 아이콘과 문구는 일정 시간이 지나면 사라지게 하여 UX를 해치지 않도록 함

```typescript
useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setIsFading(false);
    }, 3000);
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 4000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);
  if (!isVisible) return null;

<div
    className={`absolute top-1/2 left-1/2 -translate-y-[76%] -translate-x-1/2 flex flex-col justify-center items-center z-zMapModal transition-opacity duration-[1500ms] ease-out ${
    isFading ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}
>
    <div className=" w-14 h-14 rounded-full flex justify-center items-center bg-white shadow-shadowCustom  ">
        <Image src={moveIcon} alt="move" width={40} height={40} quality={20} />
    </div>
    <p
    className="relative w-full text-center text-DarkGray p-1 mt-1 font-semibold bg-white rounded-xl shadow-shadowCustom"
    >
        지도를 움직여보세요
    </p>
</div>
```

### 🌠 오버레이에서 상세보기 페이지로 이동

- e.stopPropagation() 및 e.preventDefault() 를 사용해 닫기 버튼 클릭 시 상세 페이지로 이동하지 않도록 구현
- 오버레이 전체를 <Link> 컴포넌트로 감싸서, 오버레이를 클릭하면 상세 페이지로 이동하도록 구현

```typescript
const handleCloseClick = (e: React.MouseEvent<HTMLImageElement>) => {
  e.stopPropagation(); // 이벤트 버블링 방지
  e.preventDefault(); // 링크 동작 방지
  onClick(e);
};
```

## 📍 not-found.tsx

- 일치하는 경로가 없을 경우 보여줄 페이지 작성

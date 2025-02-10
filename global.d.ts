declare global {
  interface Window {
    kakao: any;
  }

  interface KakaoMarkerClusterer extends kakao.maps.MarkerClusterer {
    addMarkers(markers: kakao.maps.Marker[]): void;
  }

  interface BeforeInstallPromptEvent extends Event {
    prompt: () => void;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
  }

  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

export {};

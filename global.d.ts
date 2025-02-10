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

  namespace kakao.maps {
    interface Map {
      getCenter(): LatLng;
      getLevel(): number;
      setLevel(level: number): void;
      addListener(event: string, callback: () => void): void;
      removeListener(event: string, callback: () => void): void;
    }

    interface LatLng {
      getLat(): number;
      getLng(): number;
    }

    interface Marker {
      setPosition(position: LatLng): void;
      getPosition(): LatLng;
      setMap(map: Map): void;
    }
  }
}

export {};

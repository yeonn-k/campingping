declare global {
  interface Window {
    kakao: any;
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

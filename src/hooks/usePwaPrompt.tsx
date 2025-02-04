import { usePwaStore } from '@/stores/pwaState';
import { useEffect } from 'react';
import { toast } from 'react-toastify';

export const usePwaPrompt = () => {
  const { deferredPrompt, setDeferredPrompt, isPwaOpen, setIsPwaOpen } =
    usePwaStore();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsPwaOpen(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const installPWA = () => {
    if (!deferredPrompt) return;
    setIsPwaOpen(true);
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setIsPwaOpen(false); // 모달 닫기

    // prompt() 호출해서 실제 PWA 설치 진행
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((result) => {
      if (result.outcome === 'accepted') {
        toast.success('PWA가 설치되었습니다! 🎉');
      } else {
        toast.error('설치가 취소되었습니다.');
      }
      setDeferredPrompt(null); // prompt 후 deferredPrompt 리셋
    });
  };

  // 모달에서 '취소' 클릭 시 실행되는 함수
  const handleClose = async () => {
    setIsPwaOpen(false); // 모달 닫기
  };

  return {
    deferredPrompt,
    setDeferredPrompt,
    isPwaOpen,
    installPWA,
    handleInstall,
    handleClose,
  };
};

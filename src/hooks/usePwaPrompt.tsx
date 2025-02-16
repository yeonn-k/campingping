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
      setIsPwaOpen(false);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const installPwa = async () => {
    if (!deferredPrompt) {
      setIsPwaOpen(true, 'unsupported');
    } else {
      setIsPwaOpen(true, 'supporteed');
    }
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    setIsPwaOpen(false);

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

  const handleClose = async () => {
    setIsPwaOpen(false);
  };

  return {
    deferredPrompt,
    setDeferredPrompt,
    isPwaOpen,
    installPwa,
    handleInstall,
    handleClose,
  };
};

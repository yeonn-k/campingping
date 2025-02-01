'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import dropIcon from '@images/campingping.png';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);

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

  return (
    <div>
      {deferredPrompt && (
        <button
          className={`w-full h-12 flex justify-center items-center bg-lime-400 text-white `}
          onClick={installPWA}
        >
          <Image src={dropIcon} alt="logo" width={30} height={3} /> PWA 설치하기
        </button>
      )}
    </div>
  );
};

export default InstallPrompt;

'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import logo from '@images/campingping.png';
import { usePathname } from 'next/navigation';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt = () => {
  const pathname = usePathname();

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

  if (pathname === '/sign-in') return;
  return (
    <div>
      {deferredPrompt && (
        <button
          className={`fixed ${pathname === '/community' ? 'bottom-[19rem]' : 'bottom-56'} right-0 translate-x-[-14px] bg-lime-400 p-4 rounded-full shadow-shadowCustom w-14 h-14 z-[18]`}
          onClick={installPWA}
        >
          <Image src={logo} alt="logo" width={70} height={70} quality={20} />
        </button>
      )}
    </div>
  );
};

export default InstallPrompt;

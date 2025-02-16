'use client';

import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

import logo from '@images/campingping.png';

import { usePwaPrompt } from '@/hooks/usePwaPrompt';
import { usePwaStore } from '@/stores/pwaState';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const InstallPrompt = () => {
  const pathname = usePathname();
  const { setDeferredPrompt, installPwa } = usePwaPrompt();

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

  if (pathname === '/sign-in') return;
  return (
    <div
      className={`fixed ${pathname === '/community' ? 'bottom-[19rem]' : 'bottom-56'} right-0 translate-x-[-14px] z-[18] `}
    >
      <button
        className={`relative bg-lime-400 p-2 rounded-full shadow-shadowCustom w-14 h-14 z-[18] flex justify-center`}
        onClick={installPwa}
      >
        <Image
          src={logo}
          alt="logo"
          width={90}
          height={90}
          quality={20}
          className="opacity-50"
        />
        <div className="text-center text-white font-semibold absolute top-1/2 -translate-y-1/2">
          APP
        </div>
      </button>
    </div>
  );
};

export default InstallPrompt;

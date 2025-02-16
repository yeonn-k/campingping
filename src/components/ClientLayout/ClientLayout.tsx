'use client';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DesktopUi from './DesktopUi';

import { useEffect } from 'react';
import { useLocationStore } from '@/stores/locationState';
import useGeoLocationPermission from '@/hooks/useGeoLocation';
import Nav from '../Nav/Nav';
import { usePathname, useRouter } from 'next/navigation';
import OpenTheChats from '../OpenTheChats/OpenTheChats';
import { chattingStore } from '@/stores/chattingState';
import Chat from '../Chat/Chat';
import { userStore } from '@/stores/userState';
import React from 'react';
import { useIsMobile } from '@/hooks/useIsMobile';
import InstallPrompt from '@/components/PWA/InstallPwa/InstallPwa';
import InstallModal from '@/components/PWA/InstallPwaModal/InstallModal';
import { usePwaPrompt } from '@/hooks/usePwaPrompt';
import { usePushNotification } from '@/hooks/usePushNotification';
import PwaAlarmPopUp from '../PWA/PwaAlarmPopUp/PwaAlarmPopUp';
import useRegisterPushNotification from '@/utils/registerPushNotification';
import { isPwa } from '@/utils/isPwa';
import { usePwaStore } from '@/stores/pwaState';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { updateLocation } = useLocationStore();
  const { chatState, setChatState, setChatRoomId } = chattingStore();
  const { userState } = userStore();
  const isGeoLocationGranted = useGeoLocationPermission();

  const { isMobile } = useIsMobile();
  const { handleInstall, handleClose } = usePwaPrompt();
  const { isPwaOpen } = usePwaStore();
  const registerServiceWorker = async () => {
    try {
      const registration =
        await navigator.serviceWorker.register('/service-worker.js');
      console.log('서비스 워커 등록 성공:', registration);
    } catch (error) {
      console.error('서비스 워커 등록 실패:', error);
    }
  };

  const requestPushPermission = async () => {
    askPushNotification();
  };

  const { denyPermission, askPushNotification, checkNotificationPermission } =
    usePushNotification();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isGeoLocationGranted) {
      updateLocation();
    } else if (!isMobile) {
      toast.warn(
        '위치 권한을 설정하지 않으면 사용하지 못하는 기능이 있어요 !',
        {
          autoClose: 7000,
        }
      );
    }
  }, [isGeoLocationGranted, updateLocation]);

  useEffect(() => {
    const setupServiceWorkerAndPushPermission = async () => {
      await registerServiceWorker();
      if (userState) {
        requestPushPermission();
      }
    };

    setupServiceWorkerAndPushPermission();
  }, []);

  useRegisterPushNotification();

  useEffect(() => {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'NOTIFICATION_CLICKED') {
          const roomId = event.data;

          setChatState(true);
          setChatRoomId(roomId);
        }
      });
    }
  }, []);

  return (
    <div className="relative">
      <ToastContainer
        position="top-center"
        draggable
        className="fixed left-1/2 -translate-x-1/2 mt-16 z-50 max-w-[90%] z-[100]"
      />
      <div className="flex h-screen justify-center items-center">
        <DesktopUi />
        <div
          className={`relative w-full md:max-w-[450px] h-full flex justify-center ${chatState ? 'overflow-hidden' : 'overflow-auto'}`}
        >
          {children}
          {pathname !== '/sign-in' && pathname !== '/search' && (
            <OpenTheChats
              onClick={() => {
                if (userState) {
                  setChatState(true);
                } else {
                  router.push('/sign-in');
                  toast.error('로그인이 필요한 기능이에요');
                }
              }}
            />
          )}

          {!isPwa() && <InstallPrompt />}
          {isPwaOpen && (
            <InstallModal onClick={handleInstall} onClose={handleClose} />
          )}
          {isPwaOpen && (
            <PwaAlarmPopUp
              onClick={checkNotificationPermission}
              onClose={denyPermission}
            />
          )}
          {chatState && <Chat />}
          <Nav />
        </div>
      </div>
    </div>
  );
}

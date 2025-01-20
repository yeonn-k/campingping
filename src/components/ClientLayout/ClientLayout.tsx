// app/components/ClientLayout.tsx
'use client';

import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DesktopUi from './DesktopUi';
import Script from 'next/script';
import { useGlobalStore } from '@/stores/globalState';
import { useEffect } from 'react';
import { useLocationStore } from '@/stores/locationState';
import useGeoLocationPermission from '@/hooks/useGeoLocation';
import Nav from '../Nav/Nav';
import { usePathname, useRouter } from 'next/navigation';
import OpenTheChats from '../OpenTheChats/OpenTheChats';
import { chattingStore } from '@/stores/chattingState';
import Chat from '../Chat/Chat';
import { userStore } from '@/stores/userState';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setMapScriptLoaded } = useGlobalStore();
  const { updateLocation } = useLocationStore();
  const { chatState, setChatState } = chattingStore();
  const { userState } = userStore();
  const isGeoLocationGranted = useGeoLocationPermission();

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (isGeoLocationGranted) {
      updateLocation();
    } else {
      toast.warn(
        '위치 권한을 설정하지 않으면 사용하지 못하는 기능이 있어요 !',
        {
          autoClose: 7000,
        }
      );
    }
  }, [isGeoLocationGranted, updateLocation]);

  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`}
        onLoad={() => {
          setMapScriptLoaded(true);
        }}
      />
      <ToastContainer
        position="top-center"
        draggable
        className="fixed left-1/2 -translate-x-1/2 mt-16 z-50 max-w-[90%]"
      />
      <div className="flex h-screen justify-center items-center">
        <DesktopUi />
        <div className="relative w-full md:max-w-[450px] h-full flex justify-center overflow-auto">
          {children}
          {pathname !== '/sign-in' && (
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
          <Nav />

          {chatState && <Chat />}
        </div>
      </div>
    </>
  );
}

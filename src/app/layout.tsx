'use client';
// import type { Metadata } from 'next';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './globals.css';
import DesktopUi from './DesktopUi';
import Script from 'next/script';
import { useGlobalStore } from '@/stores/globalState';
import { useEffect } from 'react';
import { useLocationStore } from '@/stores/locationState';
import useGeoLocationPermission from '@/hooks/useGeoLocation';

// export const metadata: Metadata = {
//   title: 'Campingping',
//   description: 'Generated by create next app',
// };

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setMapScriptLoaded } = useGlobalStore();
  const { updateLocation } = useLocationStore();
  const isGeoLocationGranted = useGeoLocationPermission();

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
    <html lang="en">
      <body>
        <Script
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false`}
          onLoad={() => {
            setMapScriptLoaded(true);
          }}
        />
        <ToastContainer
          position="top-center"
          draggable
          className="fixed top-0 max-w-[90%] left-1/2 -translate-x-1/2 mt-9"
        />
        <div className="flex h-screen justify-center items-center">
          <DesktopUi />
          <div className="w-full md:max-w-[450px] h-full flex justify-center overflow-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}

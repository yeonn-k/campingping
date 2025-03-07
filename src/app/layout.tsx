import type { Metadata, Viewport } from 'next';

import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

import Script from 'next/script';
import dynamic from 'next/dynamic';

import { ToastContainer } from 'react-toastify';

import Nav from '@/components/Nav/Nav';
import Header from '@/components/Header/Header';

const ClientOnly = dynamic(() => import('@/components/ClientOnly/ClientOnly'), {
  ssr: false,
});

const APP_NAME = '캠핑핑';
const APP_DEFAULT_TITLE = '캠핑핑';
const APP_TITLE_TEMPLATE = '%s | 캠핑핑';
const APP_DESCRIPTION =
  '캠핑을 즐기는 사람들에게 최적의 캠핑장 정보를 제공하고, 위치 기반으로 사람들과 연결할 수 있는 플랫폼';

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: APP_DEFAULT_TITLE,
  },
};

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-w-sm max-w-7xl mx-auto overflow-hidden">
        <Script
          strategy="beforeInteractive"
          src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=clusterer`}
        />

        <div className="relative flex flex-col w-full justify-center items-center ">
          <ToastContainer
            position="top-center"
            draggable
            className="fixed left-1/2 -translate-x-1/2 z-50 max-w-[90%] z-[100]"
          />

          <Header />

          <div className="flex flex-col justify-center items-center w-full sm:pt-10 sm:pt-14 pb-16 ">
            {children}
            <ClientOnly />
            <Nav />
          </div>
        </div>
      </body>
    </html>
  );
}

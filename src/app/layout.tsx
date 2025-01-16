import type { Metadata } from 'next';

import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

import ClientLayout from '@/components/ClientLayout/ClientLayout';

export const metadata: Metadata = {
  title: 'Campingping',
  description:
    '캠핑을 즐기는 사람들에게 최적의 캠핑장 정보를 제공하고, 위치 기반으로 사람들과 연결할 수 있는 플랫폼',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}

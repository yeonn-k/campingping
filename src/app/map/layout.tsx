'use client';

import { Suspense, ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <div className="flex flex-col items-center w-full h-screen overflow-hidden">
        {children}
      </div>
    </Suspense>
  );
}

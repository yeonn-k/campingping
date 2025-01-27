'use client';

import { Suspense, ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Suspense>
      <div className="flex h-full w-full">{children}</div>
    </Suspense>
  );
}

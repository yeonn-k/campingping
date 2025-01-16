'use client';

import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return <div className="flex flex-col items-center w-full">{children}</div>;
}

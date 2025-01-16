'use client';

import { ReactNode } from 'react';

import Nav from '@/components/Nav/Nav';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center w-full">
      {children}
      <Nav />
    </div>
  );
}

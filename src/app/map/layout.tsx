'use client';

import Nav from '@/components/Nav/Nav';
import SearchBar from '@/components/SearchBar/SearchBar';

import { ReactNode } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center w-full">
      <SearchBar />
      {children}
      <Nav />
    </div>
  );
}

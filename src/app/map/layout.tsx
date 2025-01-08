'use client';

import { ReactNode } from 'react';

import Nav from '@/components/Nav/Nav';
import SearchBar from '@/components/SearchBar/SearchBar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col items-center w-full">
      <SearchBar />
      {children}
      <Nav />
    </div>
  );
}

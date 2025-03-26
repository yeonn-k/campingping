'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Suspense, ReactNode, useState } from 'react';

export default function Layout({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <Suspense>
      <QueryClientProvider client={queryClient}>
        <div className="flex flex-col items-center w-full h-screen overflow-hidden">
          {children}
        </div>
      </QueryClientProvider>
    </Suspense>
  );
}

'use client';

import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLanding = pathname === '/';

  if (isLanding) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      <main className='page-content'>{children}</main>
      <Footer />
    </>
  );
}

'use client';

import { LOGO } from '@/lib/constants';
import Image from 'next/image';
import type { ReactNode } from 'react';

interface AuthPageLayoutProps {
  title?: string;
  description?: string;
  children: ReactNode;
}

export function AuthPageLayout({ title, description, children }: AuthPageLayoutProps) {
  return (
    <div className='flex min-h-svh w-full items-center justify-center p-6 md:p-10'>
      <div className='w-full max-w-sm'>
        <div className='flex flex-col items-center gap-6'>
          <div className='flex flex-col items-center gap-2'>
            <Image
              {...LOGO}
              alt='Jay N Jay Movers'
              className='h-auto w-32 object-contain'
              priority
            />
            {title && (
              <h1 className='font-heading text-2xl font-semibold shadow-glow'>
                {title}
              </h1>
            )}
            {description && (
              <p className='text-muted-foreground text-center text-sm'>{description}</p>
            )}
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

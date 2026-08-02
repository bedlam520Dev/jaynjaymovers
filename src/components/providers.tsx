'use client';

import { AuthModal } from '@/components/auth-modals/AuthModal';
import { AuthModalProvider } from '@/components/auth-modals/AuthModalProvider';
import { LegalOverlayProvider } from '@/components/legal/LegalOverlayProvider';
import { ThemeProvider } from '@/components/theme-provider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AuthModalProvider>
      <LegalOverlayProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider
            attribute='class'
            defaultTheme='dark'
            enableSystem
          >
            <TooltipProvider>
              {children}
              <AuthModal />
              <Toaster
                position='bottom-right'
                richColors
              />
            </TooltipProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </LegalOverlayProvider>
    </AuthModalProvider>
  );
}

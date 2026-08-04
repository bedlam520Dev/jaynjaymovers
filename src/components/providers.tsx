'use client';

import { LegalOverlayProvider } from '@/components/legal/LegalOverlayProvider';
import { ThemeProvider } from '@/components/theme-provider';
import { LucAnim8Provider } from '@/components/ui/lucide-animated';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <LegalOverlayProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute='class'
          defaultTheme='dark'
          enableSystem
        >
          <TooltipProvider>
            <LucAnim8Provider>
              {children}
              <Toaster
                position='bottom-right'
                richColors
              />
            </LucAnim8Provider>
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </LegalOverlayProvider>
  );
}

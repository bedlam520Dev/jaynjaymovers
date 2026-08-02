'use client';

import { Button } from '@/components/ui/button';
import { useFocusTrap } from '@/hooks/useFocusTrap';
import { X } from 'lucide-react';
import dynamic from 'next/dynamic';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';

const TermsContent = dynamic(() =>
  import('./LegalContent').then((mod) => ({ default: mod.TermsContent }))
);
const PrivacyContent = dynamic(() =>
  import('./LegalContent').then((mod) => ({ default: mod.PrivacyContent }))
);
const DataPolicyContent = dynamic(() =>
  import('./LegalContent').then((mod) => ({ default: mod.DataPolicyContent }))
);
const RefundContent = dynamic(() =>
  import('./LegalContent').then((mod) => ({ default: mod.RefundContent }))
);

type LegalView = 'terms' | 'privacy' | 'data' | 'refund';

type LegalOverlayContextValue = {
  openLegal: (view: LegalView) => void;
  closeLegal: () => void;
};

const LegalOverlayContext = createContext<LegalOverlayContextValue | null>(null);

export function useLegalOverlay(): LegalOverlayContextValue {
  const ctx = useContext(LegalOverlayContext);
  if (!ctx) {
    throw new Error('useLegalOverlay must be used within LegalOverlayProvider');
  }
  return ctx;
}

export function LegalOverlayProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeView, setActiveView] = useState<LegalView>('terms');
  const panelRef = useFocusTrap<HTMLDivElement>(isOpen);

  const openLegal = useCallback((view: LegalView) => {
    setActiveView(view);
    setIsOpen(true);
  }, []);

  const closeLegal = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => ({ openLegal, closeLegal }), [openLegal, closeLegal]);

  const handleBackdropClick: React.MouseEventHandler<HTMLDivElement> = (event) => {
    if (event.target === event.currentTarget) {
      closeLegal();
    }
  };

  return (
    <LegalOverlayContext.Provider value={value}>
      {children}
      {isOpen && (
        <div
          className='fixed inset-0 z-50 flex items-center justify-center border-3 border-primary/70 bg-background/70 p-4 backdrop-blur-sm'
          role='dialog'
          aria-modal='true'
          aria-label='Legal information'
          onClick={handleBackdropClick}
        >
          <div
            ref={panelRef}
            className='relative max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-primary/70 bg-background/70 shadow-2xl'
          >
            <div className='sticky top-0 flex justify-end p-2'>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                aria-label='Close legal information'
                onClick={closeLegal}
              >
                <X className='h-5 w-5' />
              </Button>
            </div>
            {activeView === 'terms' && <TermsContent mode='overlay' />}
            {activeView === 'privacy' && <PrivacyContent mode='overlay' />}
            {activeView === 'data' && <DataPolicyContent mode='overlay' />}
            {activeView === 'refund' && <RefundContent mode='overlay' />}
          </div>
        </div>
      )}
    </LegalOverlayContext.Provider>
  );
}

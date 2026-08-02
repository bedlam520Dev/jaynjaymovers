'use client';

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react';

type AuthStep = 'login' | 'signup' | 'forgot-password';

interface AuthModalContextValue {
  isOpen: boolean;
  step: AuthStep;
  openLogin: () => void;
  openSignup: () => void;
  openForgotPassword: () => void;
  close: () => void;
}

const AuthModalContext = createContext<AuthModalContextValue | null>(null);

export function AuthModalProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<AuthStep>('login');

  const openLogin = useCallback(() => {
    setStep('login');
    setIsOpen(true);
  }, []);

  const openSignup = useCallback(() => {
    setStep('signup');
    setIsOpen(true);
  }, []);

  const openForgotPassword = useCallback(() => {
    setStep('forgot-password');
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
  }, []);

  const value = useMemo(
    () => ({ isOpen, step, openLogin, openSignup, openForgotPassword, close }),
    [isOpen, step, openLogin, openSignup, openForgotPassword, close]
  );

  return (
    <AuthModalContext.Provider value={value}>{children}</AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const ctx = useContext(AuthModalContext);
  if (!ctx) {
    throw new Error('useAuthModal must be used within AuthModalProvider');
  }
  return ctx;
}

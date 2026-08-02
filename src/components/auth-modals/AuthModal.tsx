'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

import { useAuthModal } from './AuthModalProvider';
import { ForgotPasswordForm } from './forgot-password-form';
import { LoginForm } from './login-form';
import { SignupForm } from './signup-form';

export function AuthModal() {
  const { isOpen, step, close } = useAuthModal();

  const titleMap = {
    login: 'Welcome Back',
    signup: 'Create your Account',
    'forgot-password': 'Reset Password',
  } as const;

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && close()}
    >
      <DialogContent
        className={
          step === 'forgot-password'
            ? 'mx-4 w-[calc(100vw-2rem)] sm:max-w-sm'
            : 'mx-4 w-[calc(100vw-2rem)] sm:max-w-[425px]'
        }
      >
        <DialogHeader>
          <DialogTitle>{titleMap[step]}</DialogTitle>
        </DialogHeader>
        {step === 'login' && <LoginForm />}
        {step === 'signup' && <SignupForm />}
        {step === 'forgot-password' && <ForgotPasswordForm />}
      </DialogContent>
    </Dialog>
  );
}

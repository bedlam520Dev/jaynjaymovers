'use client';

import { useAuthModal } from '@/components/auth-modals/AuthModalProvider';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { createClient } from '@/lib/supabase/client';
import { cn, isValidPhone, normalizePhone } from '@/lib/utils';
import type { FormState } from '@/types';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
  User,
  Phone,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export function SignupForm() {
  const router = useRouter();
  const { signUp } = useAuth();
  const { close, openLogin } = useAuthModal();

  const [form, setForm] = useState<FormState>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = (): string | null => {
    if (!form.fullName.trim()) return 'Please enter your full name.';
    if (!form.email.trim()) return 'Please enter your email.';
    if (!form.phone.trim()) return 'Please enter your phone number.';
    if (!isValidPhone(form.phone)) return 'Phone must be a valid 10-digit US number.';
    if (!form.password) return 'Please enter a password.';
    if (form.password.length < 8) return 'Password must be at least 8 characters.';
    if (form.password !== form.confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      toast.error(validationError);
      return;
    }

    setLoading(true);
    try {
      const normalizedPhone = normalizePhone(form.phone);
      await signUp(form.email, form.password, form.fullName, normalizedPhone);
      toast.success('Account created! Redirecting…');
      close();
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Sign up failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      const supabase = createClient();
      const { data, error: googleError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/oauth?popup=true`,
          skipBrowserRedirect: true,
        },
      });
      if (googleError) {
        setError(googleError.message);
        toast.error(googleError.message);
        return;
      }
      if (data?.url) {
        const popup = window.open(data.url, 'google-oauth', 'width=600,height=700');
        if (!popup) {
          setError('Popup blocked. Please allow popups for this site.');
          toast.error('Popup blocked');
          return;
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Google sign in failed.';
      setError(message);
      toast.error(message);
    }
  };

  return (
    <Card className={cn('border-border shadow-lg')}>
      <CardHeader className='space-y-2 text-center'>
        <CardTitle className='text-xl font-bold'>Create your account</CardTitle>
        <CardDescription>Get started in minutes</CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className='mb-4 flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive'>
            <AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
            <span>{error}</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          <div className='space-y-2'>
            <Label htmlFor='fullName'>Full name</Label>
            <div className='relative'>
              <User className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                id='fullName'
                type='text'
                placeholder='Jane Doe'
                value={form.fullName}
                onChange={update('fullName')}
                className='pl-9'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='email'>Email</Label>
            <div className='relative'>
              <Mail className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                id='email'
                type='email'
                placeholder='you@example.com'
                value={form.email}
                onChange={update('email')}
                className='pl-9'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='phone'>Phone</Label>
            <div className='relative'>
              <Phone className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                id='phone'
                type='tel'
                placeholder='(217) 555-0123'
                value={form.phone}
                onChange={update('phone')}
                className='pl-9'
                required
              />
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='password'>Password</Label>
            <div className='relative'>
              <Lock className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                id='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='At least 8 characters'
                value={form.password}
                onChange={update('password')}
                className='pr-9 pl-9'
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword((s) => !s)}
                className='absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </button>
            </div>
          </div>

          <div className='space-y-2'>
            <Label htmlFor='confirmPassword'>Confirm password</Label>
            <div className='relative'>
              <Lock className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                id='confirmPassword'
                type={showConfirm ? 'text' : 'password'}
                placeholder='Re-enter your password'
                value={form.confirmPassword}
                onChange={update('confirmPassword')}
                className='pr-9 pl-9'
                required
              />
              <button
                type='button'
                onClick={() => setShowConfirm((s) => !s)}
                className='absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground'
                aria-label={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? (
                  <EyeOff className='h-4 w-4' />
                ) : (
                  <Eye className='h-4 w-4' />
                )}
              </button>
            </div>
          </div>

          <Button
            type='submit'
            className='w-full'
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Creating account…
              </>
            ) : (
              <>
                Create account
                <ArrowRight className='h-4 w-4' />
              </>
            )}
          </Button>
        </form>

        <div className='my-4 flex items-center gap-2'>
          <span className='h-px flex-1 bg-border' />
          <span className='text-xs text-muted-foreground'>or</span>
          <span className='h-px flex-1 bg-border' />
        </div>

        <Button
          type='button'
          variant='outline'
          onClick={handleGoogle}
          disabled={loading}
          className='w-full'
        >
          Sign up with Google
        </Button>

        <p className='text-center text-sm text-muted-foreground'>
          Already have an account?{' '}
          <button
            type='button'
            onClick={openLogin}
            className='font-semibold text-primary hover:text-primary/90'
          >
            Sign in
          </button>
        </p>
      </CardContent>
    </Card>
  );
}

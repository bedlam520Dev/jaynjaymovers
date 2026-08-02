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
import { cn } from '@/lib/utils';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { signIn } = useAuth();
  const { close } = useAuthModal();
  const supabase = createClient();

  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (
        event.origin !== window.location.origin ||
        event.data?.type !== 'supabase-auth'
      )
        return;

      if (event.data.event === 'SIGNED_IN') {
        close();
        router.push('/dashboard');
        router.refresh();
      } else {
        setError('Google sign in failed. Please try again.');
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [close, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      await signIn(email, password);
      toast.success('Welcome back!');
      close();
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Sign in failed. Please try again.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
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
    <Card className={cn('panel-retro')}>
      <CardHeader className='space-y-2 text-center'>
        <CardTitle className='font-heading text-xl font-bold'>Welcome back</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
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
            <Label htmlFor='email'>Email</Label>
            <div className='relative'>
              <Mail className='pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground' />
              <Input
                id='email'
                type='email'
                placeholder='you@example.com'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder='••••••••'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          <Button
            type='submit'
            className='bg-success/40 border-success/80 text-foreground/80 hover:bg-success/20 border-2 border-inset w-full'
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className='h-4 w-4 animate-spin' />
                Signing in…
              </>
            ) : (
              <>
                Sign in
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
          Sign in with Google
        </Button>
        <p className='text-center text-sm text-muted-foreground'>
          Access is by invitation only.
        </p>
      </CardContent>
    </Card>
  );
}

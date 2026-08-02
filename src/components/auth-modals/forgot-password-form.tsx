'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { createClient } from '@/lib/supabase/client';
import { Mail, ArrowRight, Loader2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email) {
      setError('Please enter your email.');
      return;
    }

    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/update-password`,
      });
      if (authError) {
        setError(authError.message);
        toast.error(authError.message);
        return;
      }
      setSent(true);
      toast.success('Password reset email sent!');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Something went wrong.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className='space-y-4 text-center'>
        <p className='text-muted-foreground text-sm'>
          Check your email for a link to reset your password.
        </p>
        <Button
          type='button'
          variant='outline'
          onClick={() => setSent(false)}
          className='w-full'
        >
          Send another email
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4'
    >
      {error && (
        <div className='flex items-start gap-2 rounded-md border border-destructive/20 bg-destructive/10 p-3 text-sm text-destructive'>
          <AlertCircle className='mt-0.5 h-4 w-4 shrink-0' />
          <span>{error}</span>
        </div>
      )}
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
      <Button
        type='submit'
        className='w-full'
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className='h-4 w-4 animate-spin' />
            Sending…
          </>
        ) : (
          <>
            Send reset link
            <ArrowRight className='h-4 w-4' />
          </>
        )}
      </Button>
    </form>
  );
}

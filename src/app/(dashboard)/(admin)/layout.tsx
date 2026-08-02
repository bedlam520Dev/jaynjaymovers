'use client';

import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !profile?.is_admin)) {
      router.push('/');
    }
  }, [user, profile, loading, router]);

  if (loading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center'>
        <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
      </div>
    );
  }

  if (!user || !profile?.is_admin) {
    return null;
  }

  return (
    <div className='flex min-h-screen flex-col'>
      <main className='flex-1'>{children}</main>
    </div>
  );
}

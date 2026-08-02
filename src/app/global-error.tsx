'use client';

import Link from 'next/link';

export default function GlobalError({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang='en'>
      <body className='flex min-h-screen flex-col items-center justify-center antialiased'>
        <div className='space-y-4 text-center'>
          <h1 className='text-2xl font-bold tracking-tight'>Critical System Error</h1>
          <p className='text-muted-foreground'>
            A global exception occurred at the core runtime level.
          </p>
          <button
            onClick={() => reset()}
            className='bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-md px-4 py-2 text-sm font-medium transition-colors'
          >
            Recover System
          </button>
          <Link
            href='/'
            className='text-muted-foreground hover:text-foreground transition-colors'
          >
            Go back home
          </Link>
        </div>
      </body>
    </html>
  );
}

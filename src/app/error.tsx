'use client';

import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

export default function Error({
  error: _error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className='flex min-h-[50vh] flex-col items-center justify-center gap-4'>
      <h2 className='text-xl font-semibold'>Something went wrong!</h2>

      <div className='flex gap-4'>
        <button
          onClick={() => reset()}
          className={buttonVariants({ variant: 'default', size: 'lg' })}
        >
          Try Again
        </button>

        <Link
          href='/'
          className={buttonVariants({ variant: 'outline', size: 'lg' })}
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

import { Button } from '@/components/ui/button';
import { TruckIcon } from '@/components/ui/truck';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className='container mx-auto flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center'>
      <div className='bg-primary/10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl'>
        <TruckIcon className='text-primary h-10 w-10' />
      </div>
      <h1 className='font-display text-primary mb-2 text-7xl font-bold'>404</h1>
      <h2 className='font-display mb-3 text-2xl font-semibold'>
        This page took a wrong turn
      </h2>
      <p className='text-muted-foreground mb-8 max-w-md'>
        The page you are looking for might have been moved, deleted, or possibly never
        existed.
      </p>
      <div className='flex gap-3'>
        <Button
          size='lg'
          render={<Link href='/' />}
          nativeButton={false}
        >
          Back to Home
        </Button>
        <Button
          variant='outline'
          size='lg'
          render={<Link href='/quote' />}
          nativeButton={false}
        >
          Get a Free Quote
        </Button>
      </div>
    </div>
  );
}

'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

const Checkbox = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    checked?: boolean;
    onCheckedChange?: (c: boolean) => void;
  }
>(({ className, checked: checkedProp, onCheckedChange, ...props }, ref) => {
  const [internalChecked, setInternalChecked] = React.useState(false);
  const checked = checkedProp ?? internalChecked;
  return (
    <button
      ref={ref}
      type='button'
      role='checkbox'
      aria-checked={checked}
      onClick={() => {
        const next = !checked;
        setInternalChecked(next);
        onCheckedChange?.(next);
      }}
      className={cn(
        'peer h-4 w-4 shrink-0 rounded-sm border border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        checked && 'bg-primary text-primary-foreground',
        className
      )}
      {...props}
    >
      {checked && (
        <svg
          className='h-3.5 w-3.5'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 24 24'
          fill='none'
          stroke='currentColor'
          strokeWidth='3'
        >
          <path d='M20 6 9 17l-5-5' />
        </svg>
      )}
    </button>
  );
});
Checkbox.displayName = 'Checkbox';

export { Checkbox };

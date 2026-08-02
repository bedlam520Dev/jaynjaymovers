'use client';

import { cn } from '@/lib/utils';
import * as React from 'react';

interface SelectContextValue {
  value: string;
  setValue: (v: string) => void;
  open: boolean;
  setOpen: (o: boolean) => void;
}

const SelectContext = React.createContext<SelectContextValue>({
  value: '',
  setValue: () => {},
  open: false,
  setOpen: () => {},
});

function Select({
  defaultValue = '',
  value,
  onValueChange,
  children,
}: {
  defaultValue?: string;
  value?: string;
  onValueChange?: (v: string) => void;
  children: React.ReactNode;
}) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;
  const ctxValue = React.useMemo(
    () => ({
      value: currentValue,
      setValue: (v: string) => {
        if (!isControlled) setInternalValue(v);
        onValueChange?.(v);
      },
      open,
      setOpen,
    }),
    [currentValue, open, isControlled, onValueChange]
  );
  return <SelectContext.Provider value={ctxValue}>{children}</SelectContext.Provider>;
}

function SelectTrigger({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(SelectContext);
  return (
    <button
      type='button'
      onClick={() => ctx.setOpen(!ctx.open)}
      className={cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring',
        className
      )}
    >
      {children}
      <svg
        className='h-4 w-4 opacity-50'
        xmlns='http://www.w3.org/2000/svg'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
      >
        <path d='m6 9 6 6 6-6' />
      </svg>
    </button>
  );
}

function SelectValue({ placeholder }: { placeholder?: string }) {
  const ctx = React.useContext(SelectContext);
  return <span className='truncate'>{ctx.value || placeholder}</span>;
}

function SelectContent({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const ctx = React.useContext(SelectContext);
  if (!ctx.open) return null;
  return (
    <>
      <div
        className='fixed inset-0 z-40'
        onClick={() => ctx.setOpen(false)}
      />
      <div
        className={cn(
          'relative z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-scale-in',
          className
        )}
      >
        {children}
      </div>
    </>
  );
}

function SelectItem({
  value,
  children,
  className,
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) {
  const ctx = React.useContext(SelectContext);
  return (
    <button
      type='button'
      onClick={() => {
        ctx.setValue(value);
        ctx.setOpen(false);
      }}
      className={cn(
        'relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent/10 hover:text-accent-foreground',
        ctx.value === value && 'bg-accent/5',
        className
      )}
    >
      {ctx.value === value && (
        <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center'>
          <svg
            className='h-4 w-4'
            xmlns='http://www.w3.org/2000/svg'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
          >
            <path d='M20 6 9 17l-5-5' />
          </svg>
        </span>
      )}
      {children}
    </button>
  );
}

export { Select, SelectTrigger, SelectValue, SelectContent, SelectItem };

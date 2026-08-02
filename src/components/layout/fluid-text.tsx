import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type FluidTextProps<E extends ElementType = 'p'> = {
  readonly as?: E;
  readonly children: ReactNode;
  readonly className?: string;
  readonly size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  readonly weight?: 'normal' | 'medium' | 'semibold' | 'bold';
} & Omit<ComponentPropsWithoutRef<E>, 'as' | 'children' | 'className'>;

const sizeMap: Record<string, { size: string; lineHeight: string }> = {
  xs: { size: 'text-xs', lineHeight: 'leading-snug' },
  sm: { size: 'text-sm', lineHeight: 'leading-snug' },
  base: { size: 'text-base', lineHeight: 'leading-relaxed' },
  lg: { size: 'text-lg', lineHeight: 'leading-relaxed' },
  xl: { size: 'text-xl', lineHeight: 'leading-tight' },
  '2xl': { size: 'text-2xl', lineHeight: 'leading-tight' },
  '3xl': { size: 'text-3xl', lineHeight: 'leading-tight' },
};

const weightMap = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

export function FluidText<E extends ElementType = 'p'>({
  as,
  children,
  className,
  size = 'base',
  weight = 'normal',
  ...props
}: FluidTextProps<E>) {
  const Component = as ?? 'p';

  return (
    <Component
      className={cn(
        sizeMap[size].size,
        sizeMap[size].lineHeight,
        weightMap[weight],
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

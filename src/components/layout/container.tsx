import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
type ContainerProps<E extends ElementType = 'div'> = {
  readonly as?: E;
  readonly children: ReactNode;
  readonly className?: string;
  readonly size?: ContainerSize;
  readonly fluid?: boolean;
} & Omit<ComponentPropsWithoutRef<E>, 'as' | 'children' | 'className'>;

const sizeMap: Record<ContainerSize, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  '2xl': 'max-w-[90rem]',
  full: 'max-w-full',
};

export function Container<E extends ElementType = 'div'>({
  as,
  children,
  className,
  size = 'xl',
  fluid = false,
  ...props
}: ContainerProps<E>) {
  const Component = as ?? 'div';

  return (
    <Component
      className={cn(
        '@container',
        'mx-auto',
        fluid ? 'w-full' : sizeMap[size],
        'px-(--container-padding-x)',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

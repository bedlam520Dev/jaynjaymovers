import { cn } from '@/lib/utils';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type SectionProps<E extends ElementType = 'section'> = {
  readonly as?: E;
  readonly children: ReactNode;
  readonly className?: string;
  readonly padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  readonly background?:
    | 'none'
    | 'muted'
    | 'primary'
    | 'secondary'
    | 'card'
    | 'transparent';
} & Omit<ComponentPropsWithoutRef<E>, 'as' | 'children' | 'className'>;

const paddingMap = {
  none: '',
  sm: 'py-(--section-padding-sm)',
  md: 'py-(--section-padding-md)',
  lg: 'py-(--section-padding-lg)',
  xl: 'py-(--section-padding-xl)',
};

const backgroundMap = {
  none: '',
  muted: 'bg-muted',
  primary: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary',
  card: 'bg-card',
  transparent: 'bg-transparent',
};

export function Section<E extends ElementType = 'section'>({
  as,
  children,
  className,
  padding = 'lg',
  background = 'none',
  ...props
}: SectionProps<E>) {
  const Component = as ?? 'section';

  return (
    <Component
      className={cn(paddingMap[padding], backgroundMap[background], className)}
      {...props}
    >
      {children}
    </Component>
  );
}

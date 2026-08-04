import { cn } from '@/lib/utils';
import { createElement } from 'react';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type StackProps<E extends ElementType = 'div'> = {
  readonly as?: E;
  readonly children: ReactNode;
  readonly className?: string;
  readonly gap?: 'sm' | 'md' | 'lg' | 'xl';
  readonly align?: 'start' | 'center' | 'end' | 'stretch';
  readonly justify?: 'start' | 'center' | 'end' | 'between' | 'around';
  readonly wrap?: boolean;
} & Omit<ComponentPropsWithoutRef<E>, 'as' | 'children' | 'className'>;

const gapMap = {
  sm: 'gap-3',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
};

const alignMap = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
};

const justifyMap = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
};

export function Stack<E extends ElementType = 'div'>({
  as,
  children,
  className,
  gap = 'md',
  align = 'stretch',
  justify = 'start',
  wrap = false,
  ...props
}: StackProps<E>) {
  const Component = (as ?? 'div') as ElementType;

  return createElement(
    Component,
    {
      className: cn(
        'flex flex-col',
        gapMap[gap],
        alignMap[align],
        justifyMap[justify],
        wrap && 'flex-wrap',
        className
      ),
      ...props,
    },
    children
  );
}

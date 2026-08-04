import { cn } from '@/lib/utils';
import { createElement } from 'react';
import type { ComponentPropsWithoutRef, ElementType, ReactNode } from 'react';

type GridBreakpoint = 'base' | 'sm' | 'md' | 'lg' | 'xl';
type GridColsConfig =
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | Partial<Record<GridBreakpoint, 1 | 2 | 3 | 4 | 5 | 6>>;

type GridProps<E extends ElementType = 'div'> = {
  readonly as?: E;
  readonly children: ReactNode;
  readonly className?: string;
  readonly cols?: GridColsConfig;
  readonly gap?: 'sm' | 'md' | 'lg' | 'xl';
  readonly autoFit?: boolean;
  readonly minColWidth?: string;
} & Omit<ComponentPropsWithoutRef<E>, 'as' | 'children' | 'className'>;

const gapMap = {
  sm: 'gap-4',
  md: 'gap-6',
  lg: 'gap-8',
  xl: 'gap-12',
};

const cqColsMap: Record<string, Record<number, string>> = {
  sm: {
    1: '@sm:grid-cols-1',
    2: '@sm:grid-cols-2',
    3: '@sm:grid-cols-3',
    4: '@sm:grid-cols-4',
    5: '@sm:grid-cols-5',
    6: '@sm:grid-cols-6',
  },
  md: {
    1: '@md:grid-cols-1',
    2: '@md:grid-cols-2',
    3: '@md:grid-cols-3',
    4: '@md:grid-cols-4',
    5: '@md:grid-cols-5',
    6: '@md:grid-cols-6',
  },
  lg: {
    1: '@lg:grid-cols-1',
    2: '@lg:grid-cols-2',
    3: '@lg:grid-cols-3',
    4: '@lg:grid-cols-4',
    5: '@lg:grid-cols-5',
    6: '@lg:grid-cols-6',
  },
  xl: {
    1: '@xl:grid-cols-1',
    2: '@xl:grid-cols-2',
    3: '@xl:grid-cols-3',
    4: '@xl:grid-cols-4',
    5: '@xl:grid-cols-5',
    6: '@xl:grid-cols-6',
  },
};

const baseColsMap: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
};

export function Grid<E extends ElementType = 'div'>({
  as,
  children,
  className,
  cols,
  gap = 'md',
  autoFit = false,
  minColWidth = '16rem',
  ...props
}: GridProps<E>) {
  const Component = (as ?? 'div') as ElementType;

  let colsClassName = '';
  if (typeof cols === 'number') {
    colsClassName = baseColsMap[cols] ?? '';
  } else if (cols && typeof cols === 'object') {
    const classes: string[] = [];
    for (const [bp, count] of Object.entries(cols)) {
      if (bp === 'base') {
        classes.push(baseColsMap[count] ?? '');
      } else {
        const map = cqColsMap[bp];
        if (map) {
          classes.push(map[count] ?? '');
        }
      }
    }
    colsClassName = classes.join(' ');
  }

  return createElement(
    Component,
    {
      className: cn('grid', !autoFit && colsClassName, gapMap[gap], className),
      style: autoFit
        ? { gridTemplateColumns: `repeat(auto-fit, minmax(${minColWidth}, 1fr))` }
        : undefined,
      ...props,
    },
    children
  );
}

'use client';

import { Button } from '@/components/ui/button';
import { MoonIcon } from '@/components/ui/moon';
import { SunIcon } from '@/components/ui/sun';
import { useTheme } from 'next-themes';
import * as React from 'react';

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Prevent Hydration mismatch flags by waiting for mounting
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    // Falls back seamlessly whether system defaults or explicit parameters are set
    const currentMode = resolvedTheme || theme;
    setTheme(currentMode === 'dark' ? 'light' : 'dark');
  };

  // Render a clean structural placeholder layout shell during initial load cycles
  if (!mounted) {
    return (
      <Button
        variant='ghost'
        size='icon'
        className='pointer-events-auto h-10 w-10'
      >
        <SunIcon className='text-foreground/80 h-6 w-6 opacity-0' />
      </Button>
    );
  }

  return (
    <Button
      onClick={toggleTheme}
      variant='ghost'
      size='icon'
      className='pointer-events-auto relative h-10 w-10 rounded-full text-neutral-800 transition-colors duration-300 hover:bg-neutral-200/50 dark:text-neutral-200 dark:hover:bg-neutral-800/50'
      aria-label='Toggle theme mode'
    >
      {/* Sun Icon: Hidden when dark mode active */}
      <SunIcon className='text-foreground/80 h-6 w-6 scale-100 rotate-0 transition-all duration-500 ease-in-out dark:scale-0 dark:-rotate-90' />

      {/* MoonIcon Icon: Appears cleanly from rotated state when dark mode active */}
      <MoonIcon className='text-foreground/80 absolute h-6 w-6 scale-0 rotate-90 transition-all duration-500 ease-in-out dark:scale-100 dark:rotate-0' />
    </Button>
  );
}

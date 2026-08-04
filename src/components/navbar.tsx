'use client';

import { ModeToggle } from '@/components/ModeToggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MenuIcon } from '@/components/ui/lucide-animated/menu';
import { ShieldCheckIcon } from '@/components/ui/lucide-animated/shield-check';
import { XIcon } from '@/components/ui/lucide-animated/x';
import { useAuth } from '@/hooks/use-auth';
import { NAV_LINKS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { LayoutDashboard, LogOut } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push('/');
    setMenuOpen(false);
  };

  const initials = profile?.full_name
    ? profile.full_name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U';

  return (
    <header className='navbar'>
      <div className='navbar-inner'>
        <div className='absolute top-3 right-3 z-55'>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label='Toggle menu'
            aria-expanded={menuOpen}
            className={cn(
              'flex items-center justify-center self-center h-[clamp(3rem,6vh,6rem)] w-[clamp(3rem,6vh,6rem)]',
              'z-56 rounded-[1.25rem] border-4 border-primary bg-background/60 p-1.5 text-xl font-bold text-primary transition-all duration-200 ease-out',
              'hover:scale-105 hover:border-primary/60 active:scale-95',
              menuOpen && 'scale-95 border-primary bg-background/60 shadow-md'
            )}
          >
            {menuOpen ? (
              <XIcon className='h-[clamp(1rem,1.75vh,1.75rem)] w-[clamp(1rem,1.75vh,1.75rem)] stroke-5' />
            ) : (
              <MenuIcon className='h-[clamp(1rem,1.75vh,1.75rem)] w-[clamp(1rem,1.75vh,1.75rem)] stroke-5' />
            )}
          </button>

          {menuOpen && (
            <>
              <div
                className='fixed inset-0 z-40 cursor-default'
                aria-hidden
                onClick={() => setMenuOpen(false)}
              />

              <div className='absolute top-full right-0 mt-2 z-50 flex w-72 flex-col gap-1.5 rounded-xl border border-muted bg-background/95 p-2.5 shadow-xl backdrop-blur-2xl duration-200 animate-in fade-in slide-in-from-top-2'>
                <div className='px-2 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase'>
                  Navigation
                </div>

                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      'flex h-10 cursor-pointer items-center rounded-lg border border-transparent bg-background/60 px-3 text-sm font-medium text-foreground transition-all duration-150 hover:translate-x-0.5 hover:border-primary/80 hover:bg-background/80 active:scale-98',
                      pathname === link.href &&
                        'border-primary/60 bg-background/60 text-primary shadow-xs'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}

                <div className='relative my-1.5 flex items-center px-1'>
                  <div className='w-full border-t border-muted-foreground/15' />
                </div>

                {user ? (
                  <>
                    <div className='px-2 py-0.5 text-[10px] font-bold tracking-wider text-muted-foreground/80 uppercase'>
                      Account Panel
                    </div>

                    <Link
                      href='/dashboard'
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        'flex h-10 items-center gap-2.5 rounded-lg border border-transparent bg-background/60 px-3 text-sm font-medium transition-all hover:translate-x-0.5 hover:border-primary/80 hover:bg-background/80 active:scale-98',
                        pathname === '/dashboard' &&
                          'border-primary/60 bg-background/60 text-primary'
                      )}
                    >
                      <LayoutDashboard className='h-4 w-4 stroke-2' /> Dashboard
                    </Link>

                    {profile?.is_admin && (
                      <Link
                        href='/admin-dashboard'
                        onClick={() => setMenuOpen(false)}
                        className={cn(
                          'flex h-10 items-center gap-2.5 rounded-lg border border-transparent bg-background/60 px-3 text-sm font-medium transition-all hover:translate-x-0.5 hover:border-primary/80 hover:bg-background/80 active:scale-98',
                          pathname === '/admin-dashboard' &&
                            'border-primary/80 bg-background/80 text-primary'
                        )}
                      >
                        <ShieldCheckIcon className='h-4 w-4 stroke-2' /> Admin CRM
                      </Link>
                    )}

                    <button
                      onClick={handleSignOut}
                      className='flex h-10 cursor-pointer items-center gap-2.5 rounded-lg border border-transparent bg-destructive/5 px-3 text-left text-sm font-medium text-destructive transition-all hover:translate-x-0.5 hover:border-destructive/40 hover:bg-destructive/20 active:scale-98'
                    >
                      <LogOut className='h-4 w-4 stroke-2' /> Sign Out
                    </button>

                    <div className='my-1 border-t border-muted-foreground/10' />

                    <div className='flex items-center gap-2.5 rounded-lg bg-muted/30 p-1.5'>
                      <Avatar className='h-8 w-8 border border-primary/60'>
                        {profile?.avatar_url && (
                          <AvatarImage src={profile?.avatar_url} />
                        )}
                        <AvatarFallback className='bg-primary/20 text-xs font-bold text-background'>
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className='flex min-w-0 flex-col'>
                        <span className='truncate text-xs font-bold leading-tight text-foreground'>
                          {profile?.full_name ||
                            (profile?.is_admin ? 'Admin Account' : 'User Account')}
                        </span>
                        <span className='mt-0.5 truncate text-[10px] font-medium leading-none text-muted-foreground'>
                          Signed In
                        </span>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className='flex flex-col gap-1.5 pt-0.5'>
                    <Link
                      href='/auth/login'
                      onClick={() => setMenuOpen(false)}
                      className='flex h-9 w-full items-center justify-center rounded-lg border border-muted bg-background/60 text-sm font-medium transition-all hover:scale-[1.01] hover:border-primary/80 hover:bg-background/80 active:scale-98'
                    >
                      Sign In
                    </Link>
                  </div>
                )}

                <div className='my-1 border-t border-muted-foreground/10' />

                <div className='flex items-center justify-between px-2 py-0.5'>
                  <span className='text-[10px] font-bold text-muted-foreground/80 uppercase'>
                    Theme
                  </span>
                  <ModeToggle />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

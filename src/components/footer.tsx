'use client';

import { Container, Grid } from '@/components/layout';
import { useLegalOverlay } from '@/components/legal/LegalOverlayProvider';
import { FacebookIcon } from '@/components/ui/facebook';
import { InstagramIcon } from '@/components/ui/instagram';
import { MailboxIcon } from '@/components/ui/mailbox';
import { MapPinIcon } from '@/components/ui/map-pin';
import { PhoneIcon } from '@/components/ui/phone';
import { ShieldCheckIcon } from '@/components/ui/shield-check';
import { TwitterIcon } from '@/components/ui/twitter';
import { useAuth } from '@/hooks/use-auth';
import { SITE, LOGO } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';

export function Footer() {
  const { user, profile } = useAuth();
  const { openLegal } = useLegalOverlay();
  return (
    <footer className='border-border/40 bg-secondary/30 border-t'>
      <Container
        size='xl'
        className='py-2'
      >
        <Grid
          cols={{ base: 1, sm: 2, lg: 4 }}
          gap='lg'
        >
          <div className='space-y-1'>
            <div className='relative flex flex-row items-center gap-2'>
              <div className='relative bg-primary text-primary-foreground flex flex-col flex-col-1 h-12 w-12 items-center justify-center rounded-lg m-auto'>
                <Image
                  src={LOGO}
                  alt='Jay N Jay Movers Logo'
                  width={30}
                  height={30}
                />
              </div>
            </div>
            <p className='relative flex flex-col flex-col-2 text-foreground/80 max-w-xs text-sm justify-around'>
              Professional moving services for residential and commercial clients. Local
              and long distance. Licensed, bonded, and insured.
            </p>
          </div>

          <div className='space-y-3'>
            <h4 className='font-display text-foreground/80 text-sm font-semibold tracking-wide uppercase'>
              Services
            </h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/services'
                  className='hover:text-primary transition-colors'
                >
                  Residential Moving
                </Link>
              </li>
              <li>
                <Link
                  href='/services'
                  className='hover:text-primary transition-colors'
                >
                  Commercial Moving
                </Link>
              </li>
              <li>
                <Link
                  href='/services'
                  className='hover:text-primary transition-colors'
                >
                  Long Distance
                </Link>
              </li>
              <li>
                <Link
                  href='/services'
                  className='hover:text-primary transition-colors'
                >
                  Packing Services
                </Link>
              </li>
              <li>
                <Link
                  href='/services'
                  className='hover:text-primary transition-colors'
                >
                  Junk Removal
                </Link>
              </li>
            </ul>
          </div>

          <div className='space-y-3'>
            <h4 className='font-display text-foreground/80 text-sm font-semibold tracking-wide uppercase'>
              Company
            </h4>
            <ul className='space-y-2 text-sm'>
              <li>
                <Link
                  href='/about'
                  className='hover:text-primary transition-colors'
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href='/reviews'
                  className='hover:text-primary transition-colors'
                >
                  Reviews
                </Link>
              </li>
              <li>
                <Link
                  href='/quote'
                  className='hover:text-primary transition-colors'
                >
                  Get a Quote
                </Link>
              </li>
              <li>
                <Link
                  href='/schedule'
                  className='hover:text-primary transition-colors'
                >
                  Schedule a Move
                </Link>
              </li>
              {user ? (
                <>
                  <li>
                    <Link
                      href='/dashboard'
                      className='hover:text-primary transition-colors'
                    >
                      Dashboard
                    </Link>
                  </li>
                  {profile?.is_admin && (
                    <li>
                      <Link
                        href='/admin-dashboard'
                        className='hover:text-primary flex items-center gap-2 transition-colors'
                      >
                        <ShieldCheckIcon className='h-4 w-4 shrink-0' />
                        Admin CRM
                      </Link>
                    </li>
                  )}
                </>
              ) : (
                <li>
                  <Link
                    href='/auth/login'
                    className='hover:text-primary transition-colors'
                  >
                    Customer Login
                  </Link>
                </li>
              )}
            </ul>
          </div>

          <div className='space-y-2 w-auto'>
            <h4 className='font-display text-foreground/80 text-sm font-semibold tracking-wide uppercase'>
              Contact
            </h4>
            <ul className='w-full flex-nowrap flex-col text-foreground/80 space-y-1 text-sm'>
              <li className='pt-2 flex items-center gap-2'>
                <PhoneIcon className='text-primary h-4 w-4 shrink-0' />
                <span>{SITE.phone}</span>
              </li>
              <li className='pt-2 flex items-center gap-2'>
                <MailboxIcon className='text-primary h-4 w-4 shrink-0' />
                <span>{SITE.email}</span>
              </li>
              <li className='pt-2 flex items-center gap-2'>
                <MapPinIcon className='text-primary h-4 w-4 shrink-0' />
                <span>{SITE.address}</span>
              </li>
            </ul>
            <div className='mt-3 flex flex-row items-center gap-3'>
              <a
                href={SITE.social.facebook}
                className='text-foreground/80 hover:text-primary transition-colors'
                aria-label='Facebook'
              >
                <FacebookIcon className='h-5 w-5 mt-1' />
              </a>
              <a
                href={SITE.social.instagram}
                className='text-foreground/80 hover:text-primary transition-colors'
                aria-label='Instagram'
              >
                <InstagramIcon className='h-5 w-5 ml-[-3]' />
              </a>
              <a
                href={SITE.social.twitter}
                className='text-foreground/80 hover:text-primary transition-colors'
                aria-label='Twitter'
              >
                <TwitterIcon className='h-5 w-5 ml-2.25' />
              </a>
            </div>
          </div>
        </Grid>

        <div className='border-border/40 flex flex-row items-center justify-between gap-1 border-t pt-4 sm:flex-row'>
          <p className='text-foreground/80 text-xs'>
            &copy; {new Date().getFullYear()} {SITE.name}. All rights reserved. Licensed
            & Insured ({SITE.license})
          </p>
          <div className='text-foreground/80 flex flex-wrap gap-x-4 gap-y-1 text-xs'>
            <button
              onClick={() => openLegal('privacy')}
              className='hover:text-primary transition-colors cursor-pointer'
            >
              Privacy Policy
            </button>
            <button
              onClick={() => openLegal('terms')}
              className='hover:text-primary transition-colors cursor-pointer'
            >
              Terms of Service
            </button>
            <button
              onClick={() => openLegal('data')}
              className='hover:text-primary transition-colors cursor-pointer'
            >
              Data Policy
            </button>
            <button
              onClick={() => openLegal('refund')}
              className='hover:text-primary transition-colors cursor-pointer'
            >
              Refund Policy
            </button>
          </div>
        </div>
      </Container>
    </footer>
  );
}

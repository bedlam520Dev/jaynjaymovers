import { ComingSoonForm } from '@/components/landing/coming-soon-form';
import { LandingSignIn } from '@/components/landing/landing-sign-in';
import { SITE } from '@/lib/constants';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Coming Soon',
  description:
    'Something awesome is building in the studio. Stay tuned for the official launch.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function LandingPage() {
  return (
    <main className='relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#08080b] text-center text-[#fdf7ef]'>
      <div
        aria-hidden
        className='fixed inset-[-8%] scale-105 bg-[url(/bg/bg-hero.webp)] bg-cover bg-center bg-no-repeat'
      >
        <div className='absolute inset-[-5%] bg-black/45 backdrop-blur-[6px] saturate-[0.6]' />
      </div>

      <div className='relative flex w-full max-w-[720px] flex-col items-center justify-center overflow-hidden px-4 py-10 text-center md:px-8 md:pb-12'>
        <div className='flex w-full flex-col items-center justify-center gap-0 md:gap-[clamp(1rem,2.2vh,1.6rem)] md:mb-[clamp(1.4rem,3vh,2rem)]'>
          <Image
            src='/img/logo.svg'
            alt={SITE.name}
            height={400}
            width={460}
            priority
            className='h-auto w-full max-w-[460px] object-contain opacity-96 drop-shadow-[0_18px_38px_rgba(0,0,0,0.45)] md:w-[min(64vw,480px)]'
          />
          <h1 className='font-heading relative -top-6 text-[clamp(2rem,6.5vw,3.5rem)] leading-none font-black tracking-[0.16em] text-[#fef7ed] uppercase whitespace-nowrap [text-shadow:0_0.05em_0.2em_rgba(0,0,0,0.55),0_0.2em_0.7em_rgba(0,0,0,0.45),0_0_1.3em_rgba(255,255,255,0.18)] md:text-[clamp(3rem,5vw,4.6rem)] md:tracking-[0.18em]'>
            Coming Soon
          </h1>
        </div>

        <ComingSoonForm />
      </div>

      <LandingSignIn />
    </main>
  );
}

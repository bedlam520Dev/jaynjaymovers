'use client';

import { HERO_FLOATING_IMAGES } from '@/lib/constants';
import Image from 'next/image';
import { useLayoutEffect, useRef } from 'react';

const SPEED_TIERS = [0.25, 0.5, 0.75, 1.0];

function getPxFromSizeClass(className: string): number {
  const match = className.match(/h-(\d+)/);
  return match ? parseInt(match[1]) * 4 : 256;
}

export function HeroBackground() {
  return (
    <div className='fixed inset-0 pointer-events-none -z-50 overflow-hidden animate-fade-in'>
      {HERO_FLOATING_IMAGES.map((img, i) => (
        <FloatingBubble
          key={img.src}
          img={img}
          index={i}
        />
      ))}
    </div>
  );
}

interface FloatingBubbleProps {
  img: (typeof HERO_FLOATING_IMAGES)[number];
  index: number;
}

function FloatingBubble({ img, index }: FloatingBubbleProps) {
  const ref = useRef<HTMLDivElement>(null);
  const state = useRef({
    x: 0,
    y: 0,
    rot: 0,
    scale: 1,
    vx: 0,
    vy: 0,
    rotSpeed: 0,
    vw: 0,
    vh: 0,
  });

  useLayoutEffect(() => {
    const s = state.current;
    const sizePx = getPxFromSizeClass(img.className);

    s.vw = window.innerWidth - sizePx;
    s.vh = window.innerHeight - sizePx;

    s.x = Math.random() * s.vw;
    s.y = Math.random() * s.vh;
    s.rot = (Math.random() - 0.5) * 6;

    const baseSpeed = SPEED_TIERS[index % SPEED_TIERS.length];
    const angle = Math.random() * Math.PI * 2;
    s.vx = Math.cos(angle) * baseSpeed;
    s.vy = Math.sin(angle) * baseSpeed;
    s.rotSpeed = (Math.random() - 0.5) * 0.2;

    const el = ref.current;
    if (el) {
      el.style.transform = `translate(${s.x}px,${s.y}px) rotate(${s.rot}deg) scale(${s.scale})`;
    }

    let rafId: number;

    const tick = () => {
      s.x += s.vx;
      s.y += s.vy;
      s.rot += s.rotSpeed;

      if (s.x <= 0 || s.x >= s.vw) {
        s.vx = -s.vx + (Math.random() - 0.5) * 0.2;
        s.vx = Math.max(-4, Math.min(4, s.vx));
        s.x = Math.max(0, Math.min(s.vw, s.x));
      }

      if (s.y <= 0 || s.y >= s.vh) {
        s.vy = -s.vy + (Math.random() - 0.5) * 0.2;
        s.vy = Math.max(-4, Math.min(4, s.vy));
        s.y = Math.max(0, Math.min(s.vh, s.y));
      }

      if (el) {
        el.style.transform = `translate(${s.x}px,${s.y}px) rotate(${s.rot}deg) scale(${s.scale})`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    const onResize = () => {
      s.vw = window.innerWidth - sizePx;
      s.vh = window.innerHeight - sizePx;
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${img.className} absolute rounded-3xl`}
    >
      <Image
        src={img.src}
        alt={img.alt}
        height={img.height}
        width={img.width}
        priority={index < 2}
        className='h-full w-full object-cover'
      />
    </div>
  );
}

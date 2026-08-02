'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

import { cn } from './../lib/utils';
import Grainient from './Grainient';

export function DynamicBackground() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className='fixed inset-0 -z-50' />;
  }

  const isDark = resolvedTheme === 'dark';

  // Keep your shader colors rich and vibrant!
  const colors = isDark
    ? { color1: '#12248a', color2: '#0c1020', color3: '#532b2b' }
    : { color1: '#7d9fbe', color2: '#12248a', color3: '#532b2b' };

  return (
    <div className='pointer-events-none fixed inset-0 -z-50 h-screen w-screen overflow-hidden'>
      {/* 1. THE CORE CANVAS LAYER */}
      <div className='absolute inset-0 h-full w-full scale-110'>
        <Grainient
          color1={colors.color1}
          color2={colors.color2}
          color3={colors.color3}
          timeSpeed={0.25}
          colorBalance={0}
          warpStrength={0.8}
          warpFrequency={6}
          warpSpeed={2.1}
          warpAmplitude={30}
          blendAngle={81}
          blendSoftness={0.23}
          rotationAmount={600}
          noiseScale={1}
          grainAmount={0.05}
          grainScale={0.5}
          grainAnimated={false}
          contrast={1.25}
          gamma={0.75}
          saturation={1.5}
          centerX={0}
          centerY={0}
          zoom={0.3}
        />
      </div>

      {/*
        2. THE DYNAMIC DIMMER & DIFFUSION OVERLAY LAYER
        - active transition-all ensures switching modes interpolates smoothly.
        - mix-blend-mode can be added here if you want to experiment with artistic trends!
      */}
      <div
        className={cn(
          'absolute inset-0 transition-all duration-500 ease-in-out',
          // Dark Mode: Heavily dim with a rich midnight tint (mix of black and backdrop blur)
          isDark ? 'bg-black/60 backdrop-blur-[2px]' : 'bg-white/40 backdrop-blur-xs'
          // Light Mode: Frost over the background with a soft white wash for readability
        )}
      />
    </div>
  );
}

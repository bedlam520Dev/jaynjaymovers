'use client';

import { useState } from 'react';

type FormState = 'idle' | 'sending' | 'success' | 'error';

export function ComingSoonForm() {
  const [email, setEmail] = useState('');
  const [state, setState] = useState<FormState>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    setMessage('Sending...');

    try {
      const response = await fetch('/api/coming-soon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        setState('success');
        setMessage(result.message || "You're on the list!");
        setEmail('');
      } else {
        throw new Error(result.error || 'Submission failed.');
      }
    } catch (error) {
      setState('error');
      setMessage(
        error instanceof Error ? error.message : 'Oops! Something went wrong.'
      );
    }
  };

  return (
    <>
      <form
        id='notify-form'
        onSubmit={handleSubmit}
        className='flex w-[min(100%,300px)] flex-col gap-[0.8rem]'
      >
        <input
          type='email'
          name='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email address'
          required
          aria-label='Email address'
          className='w-full rounded-[25px] border border-white/18 bg-[rgba(10,10,14,0.78)] px-4 py-3.5 text-base text-[#fdf7ef] shadow-[0_10px_30px_rgba(0,0,0,0.2)] backdrop-blur-[10px] transition-colors placeholder:text-[#fdf7ef]/70 focus:outline-none focus:ring-2 focus:ring-white/35 focus:ring-offset-2 focus:ring-offset-transparent'
        />
        <button
          type='submit'
          disabled={state === 'sending'}
          className='w-[min(74%,220px)] self-center rounded-[25px] border-none bg-linear-to-br from-[#d93a3a] to-[#a61111] px-3 py-2 text-base font-extrabold text-white shadow-[0_12px_30px_rgba(166,17,17,0.24)] transition-all duration-180 hover:-translate-y-px hover:shadow-[0_16px_36px_rgba(166,17,17,0.32)] focus-visible:-translate-y-px focus-visible:shadow-[0_16px_36px_rgba(166,17,17,0.32)] disabled:opacity-70'
        >
          {state === 'sending' ? 'Sending...' : 'Notify Me'}
        </button>
      </form>

      <p
        aria-live='polite'
        className={cnMessage(state)}
      >
        {message}
      </p>
    </>
  );
}

function cnMessage(state: FormState) {
  const base = 'mt-[0.35rem] min-h-[1.2rem] text-[0.95rem]';
  if (state === 'success') return `${base} text-[#4ade80]`;
  if (state === 'error') return `${base} text-[#f87171]`;
  return `${base} text-[#fdf7ef]/90`;
}

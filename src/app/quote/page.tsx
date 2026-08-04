'use client';

import { TurnstileWidget } from '@/components/turnstile/turnstile-widget';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/use-auth';
import {
  SERVICE_LABELS,
  HOME_SIZE_LABELS,
  STEPS,
  SERVICE_OPTIONS,
  HOME_SIZE_OPTIONS,
} from '@/lib/constants';
import { calculateEstimate } from '@/lib/pricing';
import { cn, formatCurrency } from '@/lib/utils';
import type { ServiceType, HomeSize } from '@/types';
import {
  ArrowRight,
  ArrowLeft,
  Check,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CheckCircle2,
  Clock,
  Users,
  DollarSign,
} from 'lucide-react';
import Link from 'next/link';
// removed unused useRouter import
import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function QuotePage() {
  const { user, profile } = useAuth();
  const [step, setStep] = useState(0);
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [homeSize, setHomeSize] = useState<HomeSize | null>(null);
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [moveDate, setMoveDate] = useState('');
  const [notes, setNotes] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const turnstileRef = useRef<{ reset: () => void }>(null);

  useEffect(() => {
    if (profile?.full_name) {
      setContactName((prev) => prev || profile.full_name);
    }
    if (profile?.phone) {
      setContactPhone((prev) => prev || profile.phone);
    }
    if (user?.email) {
      setContactEmail(user.email);
    }
  }, [user, profile]);

  const estimate = useMemo(() => {
    if (!serviceType || !homeSize) return null;
    return calculateEstimate(serviceType, homeSize);
  }, [serviceType, homeSize]);

  const isStepValid = (s: number): boolean => {
    if (s === 0) return serviceType !== null;
    if (s === 1)
      return (
        homeSize !== null &&
        fromAddress.trim().length > 0 &&
        toAddress.trim().length > 0 &&
        moveDate.trim().length > 0
      );
    if (s === 2)
      return (
        contactName.trim().length > 0 &&
        contactPhone.trim().length > 0 &&
        /\S+@\S+\.\S+/.test(contactEmail)
      );
    return true;
  };

  const handleNext = () => {
    if (!isStepValid(step)) {
      toast.error('Please complete all required fields before continuing.');
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async () => {
    if (!isStepValid(2)) {
      toast.error('Please complete your contact information.');
      return;
    }
    if (!turnstileToken) {
      toast.error('Please complete the security check first.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_type: serviceType,
          home_size: homeSize,
          moving_date: moveDate || null,
          origin_address: fromAddress,
          destination_address: toAddress,
          contact_name: contactName,
          contact_phone: contactPhone,
          contact_email: contactEmail,
          notes: notes || null,
          turnstile_token: turnstileToken,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        toast.error(data.error ?? 'Quote request failed. Please try again.');
        turnstileRef.current?.reset();
        return;
      }

      toast.success("Quote request submitted! We'll be in touch shortly.");
      setSubmitted(true);
    } catch {
      toast.error('Network error. Please try again.');
      turnstileRef.current?.reset();
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className='animate-fade-in mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24'>
        <Card className='panel-retro overflow-hidden'>
          <div className='from-success/10 to-accent/10 bg-linear-to-br px-6 py-10 text-center sm:px-12'>
            <div className='bg-success/15 text-success mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full'>
              <CheckCircle2 className='h-12 w-12' />
            </div>
            <h1 className='font-heading text-foreground text-3xl font-bold tracking-tight shadow-glow sm:text-4xl'>
              Quote request received!
            </h1>
            <p className='text-muted-foreground mt-3 font-sans text-base sm:text-lg'>
              Thanks{contactName ? `, ${contactName.split(' ')[0]}` : ''} — our team
              will review your details and reach out within 24 hours.
            </p>
          </div>
          <CardContent className='space-y-8 p-6 font-sans sm:p-10'>
            {estimate && (
              <div className='panel-retro border-2 p-5'>
                <div className='mb-4 flex items-center justify-between'>
                  <h2 className='font-heading text-lg font-semibold'>Your estimate</h2>
                  <Badge variant='accent'>
                    {serviceType ? SERVICE_LABELS[serviceType] : ''}
                  </Badge>
                </div>
                <div className='flex items-end justify-between border-t pt-4'>
                  <span className='text-muted-foreground text-sm font-medium'>
                    Estimated total
                  </span>
                  <span className='font-display text-primary text-3xl font-bold'>
                    {formatCurrency(estimate.total)}
                  </span>
                </div>
              </div>
            )}
            <div>
              <h2 className='font-heading text-xl font-semibold'>What&apos;s next?</h2>
              <ol className='mt-4 space-y-4 font-sans'>
                {[
                  {
                    icon: Clock,
                    title: 'We review your request',
                    desc: 'Our moving specialists assess your details and confirm availability for your preferred date.',
                  },
                  {
                    icon: Phone,
                    title: 'A coordinator reaches out',
                    desc: "Within 24 hours, we'll contact you to finalize the quote and answer any questions.",
                  },
                  {
                    icon: Calendar,
                    title: 'Schedule your move',
                    desc: "Lock in your date and time window. You can do that right now if you're ready.",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li
                      key={i}
                      className='flex gap-4 font-sans'
                    >
                      <div className='bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-full'>
                        <Icon className='h-5 w-5' />
                      </div>
                      <div>
                        <p className='text-foreground font-medium'>{item.title}</p>
                        <p className='text-muted-foreground text-sm'>{item.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>
            <Separator />
            <div className='flex flex-col gap-3 sm:flex-row'>
              <Button
                size='lg'
                className='font-heading flex-1'
                render={<Link href='/schedule' />}
              >
                Schedule your move
                <ArrowRight className='ml-1' />
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='flex-1 font-sans'
                render={<Link href='/' />}
              >
                Back to home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  return (
    <div className='animate-fade-in'>
      {/* Hero */}
      <section className='font-sans bg-grid hero-gradient relative overflow-hidden'>
        <div className='mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20'>
          <div className='mx-auto max-w-2xl text-center'>
            <Badge
              variant='accent'
              className='font-heading mb-4'
            >
              Free Quote
            </Badge>
            <h1 className='font-heading text-foreground text-4xl font-bold tracking-tight shadow-glow-strong sm:text-5xl'>
              Get your moving estimate
            </h1>
            <p className='text-muted-foreground mt-4 text-lg'>
              Answer a few quick questions and receive an instant, no-obligation
              estimate. It takes less than two minutes.
            </p>
          </div>
        </div>
      </section>
      <section className='py-12 font-sans lg:py-16'>
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='mx-auto max-w-5xl'>
            {/* Step indicator */}
            <div className='mb-10'>
              <div className='flex items-center justify-between'>
                {STEPS.map((label, i) => {
                  const isActive = i === step;
                  const isComplete = i < step;
                  return (
                    <div
                      key={label}
                      className='flex flex-1 flex-col items-center gap-2 sm:flex-row'
                    >
                      <div className='flex items-center gap-3 sm:flex-1'>
                        <div
                          className={cn(
                            'flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all',
                            isComplete &&
                              'border-success bg-success text-success-foreground',
                            isActive &&
                              'border-primary bg-primary text-primary-foreground ring-primary/15 ring-4',
                            !isActive &&
                              !isComplete &&
                              'border-border bg-background text-muted-foreground'
                          )}
                        >
                          {isComplete ? <Check className='h-5 w-5' /> : i + 1}
                        </div>
                        <span
                          className={cn(
                            'hidden text-sm font-medium sm:block',
                            isActive ? 'text-foreground' : 'text-muted-foreground'
                          )}
                        >
                          {label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className={cn(
                            'mx-2 hidden h-0.5 flex-1 rounded-full transition-colors sm:block',
                            isComplete ? 'bg-success' : 'bg-border'
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
            <div className='grid gap-8 lg:grid-cols-[1fr_340px]'>
              <div className='order-2 font-sans lg:order-1'>
                <Card className='panel-retro'>
                  <CardHeader>
                    <CardTitle className='font-heading text-2xl'>
                      {step === 0 && 'What can we move for you?'}
                      {step === 1 && 'Tell us about your move'}
                      {step === 2 && 'How can we reach you?'}
                      {step === 3 && 'Review your estimate'}
                    </CardTitle>
                    <CardDescription>
                      {step === 0 &&
                        'Select the service that best matches your needs. You can change this later.'}
                      {step === 1 &&
                        'A few details about your move so we can prepare an accurate estimate.'}
                      {step === 2 &&
                        "We'll use this to send your quote and follow up with any questions."}
                      {step === 3 &&
                        "Here's your instant estimate. Submit when you're ready to get started."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    {/* ---------- Step 1: Service Type ---------- */}
                    {step === 0 && (
                      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                        {SERVICE_OPTIONS.map((opt) => {
                          const Icon = opt.icon;
                          const selected = serviceType === opt.key;
                          return (
                            <button
                              key={opt.key}
                              type='button'
                              onClick={() => setServiceType(opt.key)}
                              className={cn(
                                'group hover:border-primary/50 hover:bg-primary/5 flex flex-col items-start gap-3 rounded-xl border-2 p-5 text-left transition-all',
                                selected
                                  ? 'border-primary bg-primary/5 ring-primary ring-2'
                                  : 'border-border bg-background'
                              )}
                            >
                              <div
                                className={cn(
                                  'flex h-12 w-12 items-center justify-center rounded-lg transition-colors',
                                  selected
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-primary/10 text-primary'
                                )}
                              >
                                <Icon className='h-6 w-6' />
                              </div>
                              <div>
                                <p className='text-foreground font-semibold'>
                                  {SERVICE_LABELS[opt.key]}
                                </p>
                              </div>
                              {selected && (
                                <div className='text-primary mt-1 flex items-center gap-1 text-sm font-medium'>
                                  <Check className='h-4 w-4' />
                                  Selected
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {step === 1 && (
                      <div className='space-y-6'>
                        <div className='space-y-3'>
                          <Label>Home / space size</Label>
                          <div className='flex flex-wrap gap-2'>
                            {HOME_SIZE_OPTIONS.map((size) => {
                              const selected = homeSize === size;
                              return (
                                <button
                                  key={size}
                                  type='button'
                                  onClick={() => setHomeSize(size)}
                                  className={cn(
                                    'rounded-full border-2 px-4 py-2 text-sm font-medium transition-all',
                                    selected
                                      ? 'border-primary bg-primary text-primary-foreground'
                                      : 'border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground'
                                  )}
                                >
                                  {HOME_SIZE_LABELS[size]}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                        <Separator />
                        <div className='grid gap-4 sm:grid-cols-2'>
                          <div className='space-y-2'>
                            <Label htmlFor='fromAddress'>Moving from</Label>
                            <div className='relative'>
                              <MapPin className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                              <Input
                                id='fromAddress'
                                placeholder='123 Oak St, Springfield, IL'
                                value={fromAddress}
                                onChange={(e) => setFromAddress(e.target.value)}
                                className='pl-9'
                              />
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='toAddress'>Moving to</Label>
                            <div className='relative'>
                              <MapPin className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                              <Input
                                id='toAddress'
                                placeholder='456 Maple Ave, Springfield, IL'
                                value={toAddress}
                                onChange={(e) => setToAddress(e.target.value)}
                                className='pl-9'
                              />
                            </div>
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='moveDate'>Preferred move date</Label>
                          <div className='relative sm:max-w-xs'>
                            <Calendar className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                            <Input
                              id='moveDate'
                              type='date'
                              value={moveDate}
                              onChange={(e) => setMoveDate(e.target.value)}
                              className='pl-9'
                            />
                          </div>
                        </div>
                        <div className='space-y-2'>
                          <Label htmlFor='notes'>
                            Additional notes{' '}
                            <span className='text-muted-foreground font-normal'>
                              (optional)
                            </span>
                          </Label>
                          <Textarea
                            id='notes'
                            placeholder='Stairs, fragile items, parking restrictions, timing needs…'
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>
                    )}
                    {step === 2 && (
                      <div className='space-y-6'>
                        {user && (
                          <div className='bg-primary/5 text-muted-foreground flex items-center gap-2 rounded-lg p-3 text-sm'>
                            <CheckCircle2 className='text-primary h-4 w-4 shrink-0' />
                            <span>
                              Signed in as{' '}
                              <span className='text-foreground font-medium'>
                                {user.email}
                              </span>{' '}
                              — contact info pre-filled from your profile.
                            </span>
                          </div>
                        )}
                        <div className='space-y-2'>
                          <Label htmlFor='contactName'>Full name</Label>
                          <div className='relative'>
                            <User className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                            <Input
                              id='contactName'
                              placeholder='Jane Doe'
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              className='pl-9'
                            />
                          </div>
                        </div>
                        <div className='grid gap-4 sm:grid-cols-2'>
                          <div className='space-y-2'>
                            <Label htmlFor='contactPhone'>Phone</Label>
                            <div className='relative'>
                              <Phone className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                              <Input
                                id='contactPhone'
                                type='tel'
                                placeholder='(217) 555-0100'
                                value={contactPhone}
                                onChange={(e) => setContactPhone(e.target.value)}
                                className='pl-9'
                              />
                            </div>
                          </div>
                          <div className='space-y-2'>
                            <Label htmlFor='contactEmail'>Email</Label>
                            <div className='relative'>
                              <Mail className='text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2' />
                              <Input
                                id='contactEmail'
                                type='email'
                                placeholder='jane@email.com'
                                value={contactEmail}
                                onChange={(e) => setContactEmail(e.target.value)}
                                className='pl-9'
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {step === 3 && (
                      <div className='space-y-6'>
                        {/* Recap chips */}
                        <div className='flex flex-wrap gap-2'>
                          {serviceType && (
                            <Badge variant='accent'>
                              {SERVICE_LABELS[serviceType]}
                            </Badge>
                          )}
                          {homeSize && (
                            <Badge variant='secondary'>
                              {HOME_SIZE_LABELS[homeSize]}
                            </Badge>
                          )}
                          {moveDate && (
                            <Badge variant='outline'>
                              <Calendar className='mr-1 h-3 w-3' />
                              {new Date(moveDate).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </Badge>
                          )}
                        </div>
                        {estimate ? (
                          <div className='panel-retro border-2 p-5 font-mono'>
                            <div className='text-muted-foreground mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide uppercase'>
                              <DollarSign className='h-4 w-4' />
                              Estimate breakdown
                            </div>
                            <div className='space-y-3'>
                              {estimate.lineItems.map((item, i) => (
                                <div
                                  key={i}
                                  className='flex items-center justify-between text-sm'
                                >
                                  <span className='text-muted-foreground'>
                                    {item.label}
                                  </span>
                                  <span className='text-foreground font-medium'>
                                    {formatCurrency(item.amount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <Separator className='my-4' />
                            <div className='flex items-center justify-between'>
                              <span className='text-foreground font-semibold'>
                                Estimated total
                              </span>
                              <span className='font-display text-primary text-2xl font-bold'>
                                {formatCurrency(estimate.total)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className='text-muted-foreground text-sm'>
                            Unable to generate an estimate. Please go back and select a
                            service and home size.
                          </p>
                        )}
                        {estimate && (
                          <div className='grid gap-3 sm:grid-cols-2'>
                            <div className='panel-retro border-2 flex items-center gap-3 p-4'>
                              <div className='bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-lg'>
                                <Users className='h-5 w-5' />
                              </div>
                              <div>
                                <p className='text-muted-foreground text-sm'>
                                  Crew size
                                </p>
                                <p className='font-semibold'>
                                  {estimate.crewSize} movers
                                </p>
                              </div>
                            </div>
                            <div className='panel-retro border-2 flex items-center gap-3 p-4'>
                              <div className='bg-accent/15 text-accent flex h-10 w-10 items-center justify-center rounded-lg'>
                                <Clock className='h-5 w-5' />
                              </div>
                              <div>
                                <p className='text-muted-foreground text-sm'>
                                  Estimated hours
                                </p>
                                <p className='font-semibold'>
                                  {estimate.estimatedHours} hours
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        <div className='panel-retro border-2 p-4'>
                          <p className='text-muted-foreground mb-2 text-xs font-semibold tracking-wide uppercase'>
                            Contact
                          </p>
                          <p className='text-foreground text-sm font-medium'>
                            {contactName}
                          </p>
                          <p className='text-muted-foreground text-sm'>
                            {contactPhone} · {contactEmail}
                          </p>
                        </div>
                        <p className='text-muted-foreground text-center text-xs'>
                          This is an estimate. Final pricing is confirmed when you
                          schedule your move.
                        </p>
                        <TurnstileWidget
                          ref={turnstileRef}
                          action='quote-request'
                          onTokenChange={setTurnstileToken}
                        />
                      </div>
                    )}
                    <div className='flex items-center justify-between gap-4 pt-2'>
                      <Button
                        variant='ghost'
                        onClick={handleBack}
                        disabled={step === 0}
                        className={cn(step === 0 && 'invisible')}
                      >
                        <ArrowLeft className='mr-1' />
                        Back
                      </Button>
                      {step < STEPS.length - 1 ? (
                        <Button
                          onClick={handleNext}
                          size='lg'
                        >
                          Continue
                          <ArrowRight className='ml-1' />
                        </Button>
                      ) : (
                        <Button
                          onClick={handleSubmit}
                          size='lg'
                          disabled={submitting}
                          className='bg-success/40 border-success/80 text-foreground/80 hover:bg-success/20 border-2 border-inset'
                        >
                          <Check className='mr-1' />
                          {submitting ? 'Submitting...' : 'Submit quote request'}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
              {step >= 1 && (
                <div className='order-1 lg:order-2'>
                  <div className='lg:sticky lg:top-8'>
                    <Card className='panel-retro overflow-hidden'>
                      <CardHeader className='bg-primary/5 pb-4'>
                        <div className='flex items-center gap-2'>
                          <div className='bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-lg'>
                            <DollarSign className='h-5 w-5' />
                          </div>
                          <div>
                            <CardTitle className='text-base'>Live estimate</CardTitle>
                            <CardDescription className='text-xs'>
                              Updates as you go
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className='pt-4'>
                        {estimate ? (
                          <div className='space-y-4'>
                            <div>
                              <p className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                                Estimated total
                              </p>
                              <p className='font-display text-primary text-3xl font-bold'>
                                {formatCurrency(estimate.total)}
                              </p>
                            </div>
                            <Separator />
                            <div className='space-y-2'>
                              {estimate.lineItems.map((item, i) => (
                                <div
                                  key={i}
                                  className='flex items-center justify-between text-sm'
                                >
                                  <span className='text-muted-foreground'>
                                    {item.label}
                                  </span>
                                  <span className='font-medium'>
                                    {formatCurrency(item.amount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <Separator />
                            <div className='flex items-center gap-4 font-sans text-sm'>
                              <span className='text-muted-foreground flex items-center gap-1.5'>
                                <Users className='text-primary h-4 w-4' />
                                {estimate.crewSize} crew
                              </span>
                              <span className='text-muted-foreground flex items-center gap-1.5'>
                                <Clock className='text-accent h-4 w-4' />
                                {estimate.estimatedHours}h
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className='space-y-3 py-2 text-center'>
                            <div className='bg-muted text-muted-foreground mx-auto flex h-12 w-12 items-center justify-center rounded-full'>
                              <DollarSign className='h-6 w-6' />
                            </div>
                            <p className='text-muted-foreground text-sm'>
                              {step === 1 && !homeSize
                                ? 'Select a home size to see your estimate.'
                                : 'Your estimate will appear here.'}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

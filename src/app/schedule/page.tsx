'use client';

import { SlotMapModal } from '@/components/schedule/slot-map-modal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { TruckIcon } from '@/components/ui/truck';
import { useAuth } from '@/hooks/use-auth';
import { useSchedule } from '@/hooks/use-schedule';
import {
  SERVICE_LABELS,
  HOME_SIZE_LABELS,
  WEEKDAYS,
  MONTHS,
  TIME_WINDOWS,
} from '@/lib/constants';
import { calculateEstimate } from '@/lib/pricing';
import { cn, formatCurrency, formatDate } from '@/lib/utils';
import type { ServiceType, HomeSize, TimeWindow } from '@/types';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Check,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

function SelectOption({
  value,
  selected,
  onSelect,
  children,
}: {
  value: string;
  selected: boolean;
  onSelect: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type='button'
      onClick={() => onSelect(value)}
      className={cn(
        'hover:bg-accent/10 hover:text-accent-foreground relative flex w-full cursor-pointer items-center rounded-sm py-1.5 pr-2 pl-8 font-sans text-sm outline-none select-none',
        selected && 'bg-accent/5'
      )}
    >
      {selected && (
        <span className='absolute left-2 flex h-3.5 w-3.5 items-center justify-center font-sans'>
          <Check className='h-4 w-4' />
        </span>
      )}
      {children}
    </button>
  );
}

function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isPast(date: Date): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  return target.getTime() < today.getTime();
}
export default function SchedulePage() {
  const { slots, loading } = useSchedule();
  const { user } = useAuth();
  const router = useRouter();
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeWindow | null>(null);
  const [serviceType, setServiceType] = useState<ServiceType>('residential');
  const [homeSize, setHomeSize] = useState<HomeSize>('2br');
  const [fromAddress, setFromAddress] = useState('');
  const [toAddress, setToAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [successOpen, setSuccessOpen] = useState(false);
  const [booking, setBooking] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const slotsByDate = useMemo(() => {
    const map = new Map<string, typeof slots>();
    for (const s of slots) {
      const arr = map.get(s.date) ?? [];
      arr.push(s);
      map.set(s.date, arr);
    }
    return map;
  }, [slots]);
  const selectedDaySlots = selectedDate ? (slotsByDate.get(selectedDate) ?? []) : [];
  const calendarCells = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstOfMonth = new Date(year, month, 1);
    const startWeekday = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const cells: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    return cells;
  }, [currentMonth]);
  const estimate = useMemo(
    () => calculateEstimate(serviceType, homeSize),
    [serviceType, homeSize]
  );
  const canBook =
    !!selectedDate &&
    !!selectedSlot &&
    fromAddress.trim() !== '' &&
    toAddress.trim() !== '';
  async function handleBook() {
    if (!selectedDate || !selectedSlot) return;
    if (!user) {
      setMapOpen(false);
      router.push('/auth/login?redirect=/schedule');
      return;
    }

    setBooking(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_type: serviceType,
          home_size: homeSize,
          moving_date: selectedDate,
          time_window: selectedSlot,
          origin_address: fromAddress,
          destination_address: toAddress,
          notes,
        }),
      });

      if (!res.ok) {
        if (res.status === 409) {
          toast.error('Just missed it!', {
            description: 'That time window filled up. Pick another slot.',
          });
          setMapOpen(false);
          setSelectedSlot(null);
          return;
        }
        const data = await res.json().catch(() => ({}));
        toast.error('Booking failed', {
          description: data.error ?? 'Please try again.',
        });
        return;
      }

      setSuccessOpen(true);
      setMapOpen(false);
      toast.success('Slot booked!', {
        description: `${formatDate(selectedDate)} · ${selectedSlot}`,
      });
    } catch {
      toast.error('Booking failed', {
        description: 'Network error. Please try again.',
      });
    } finally {
      setBooking(false);
    }
  }

  function handleSuccessClose(goDashboard: boolean) {
    setSuccessOpen(false);
    // Reset selection so a returning user starts fresh.
    setSelectedSlot(null);
    if (goDashboard) router.push('/dashboard');
  }

  const prevMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  const goToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  return (
    <div className='animate-fade-in mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8'>
      <div className='font-heading mb-10 text-center'>
        <Badge
          variant='accent'
          className='font-heading mb-3'
        >
          <Calendar className='mr-1 h-3 w-3' /> Live availability
        </Badge>
        <h1 className='font-heading text-foreground text-4xl font-bold tracking-tight shadow-glow-strong sm:text-5xl'>
          Schedule Your Move
        </h1>
        <p className='text-foreground/80 mx-auto mt-3 max-w-2xl font-sans text-base'>
          Pick a date, choose a time window, and lock in your crew. Availability updates
          in real time as slots are booked.
        </p>
      </div>
      <div className='grid grid-cols-1 gap-6 lg:grid-cols-5'>
        <div className='space-y-6 lg:col-span-3'>
          <Card className='panel-retro'>
            <CardHeader className='font-heading flex flex-row items-center justify-between space-y-0 pb-4'>
              <div>
                <CardTitle className='flex items-center gap-2 text-xl'>
                  <Calendar className='text-primary h-5 w-5 font-mono' />
                  {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </CardTitle>
                <p className='text-muted-foreground mt-1 text-sm'>
                  {loading ? 'Loading availability…' : 'Tap a date to see time slots'}
                </p>
              </div>
              <div className='flex items-center gap-1.5 font-sans'>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={goToday}
                  nativeButton={false}
                  className='text-primary hidden sm:inline-flex'
                >
                  Today
                </Button>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={prevMonth}
                  nativeButton={false}
                  aria-label='Previous month'
                >
                  <ChevronLeft className='h-4 w-4' />
                </Button>
                <Button
                  variant='outline'
                  size='icon'
                  onClick={nextMonth}
                  nativeButton={false}
                  aria-label='Next month'
                >
                  <ChevronRight className='h-4 w-4' />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='mb-2 grid grid-cols-7 gap-1 font-sans'>
                {WEEKDAYS.map((d) => (
                  <div
                    key={d}
                    className='text-muted-foreground py-2 text-center text-xs font-semibold tracking-wide uppercase'
                  >
                    {d}
                  </div>
                ))}
              </div>
              {loading ? (
                <div className='flex h-64 items-center justify-center font-mono'>
                  <Loader2 className='text-primary h-6 w-6 animate-spin' />
                </div>
              ) : (
                <div className='grid grid-cols-7 gap-1 font-sans'>
                  {calendarCells.map((date, i) => {
                    if (!date) return <div key={`blank-${i}`} />;

                    const key = toDateKey(date);
                    const past = isPast(date);
                    const daySlots = slotsByDate.get(key) ?? [];
                    const hasSlots = daySlots.length > 0;
                    const allFull =
                      hasSlots &&
                      daySlots.every((s) => s.current_bookings >= s.max_bookings);
                    const isToday = isSameDay(date, new Date());
                    const isSelected = selectedDate === key;
                    const dimmed = past || !hasSlots || allFull;
                    return (
                      <button
                        key={key}
                        type='button'
                        disabled={dimmed}
                        onClick={() => {
                          setSelectedDate(key);
                          setSelectedSlot(null);
                        }}
                        className={cn(
                          'relative flex aspect-square flex-col items-center justify-center rounded-lg border text-sm transition-all',
                          'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                          dimmed
                            ? 'bg-muted/40 text-muted-foreground/40 cursor-not-allowed border-transparent opacity-60'
                            : 'border-border bg-card hover:border-primary cursor-pointer hover:shadow-sm',
                          isSelected &&
                            'border-primary bg-primary text-primary-foreground shadow-md',
                          isToday && !isSelected && 'ring-accent ring-2'
                        )}
                      >
                        <span className={cn('font-medium', isSelected && 'font-bold')}>
                          {date.getDate()}
                        </span>
                        {hasSlots && (
                          <div
                            className={cn(
                              'mt-1 flex gap-0.5',
                              isSelected && 'flex-row-reverse'
                            )}
                          >
                            {TIME_WINDOWS.map(({ key: windowKey }) => {
                              const slot = daySlots.find(
                                (s) => s.time_window === windowKey
                              );
                              const taken =
                                !slot || slot.current_bookings >= slot.max_bookings;
                              return (
                                <span
                                  key={windowKey}
                                  title={taken ? 'Taken' : 'Available'}
                                  className={cn(
                                    'h-1.5 w-1.5 rounded-sm',
                                    isSelected
                                      ? taken
                                        ? 'bg-primary-foreground/30'
                                        : 'bg-primary-foreground'
                                      : taken
                                        ? 'bg-destructive/70'
                                        : 'bg-muted-foreground/20'
                                  )}
                                />
                              );
                            })}
                          </div>
                        )}
                        {isToday && (
                          <span
                            className={cn(
                              'absolute bottom-1 text-[9px] font-semibold uppercase',
                              isSelected ? 'text-primary-foreground/80' : 'text-accent'
                            )}
                          >
                            Today
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
              <div className='text-muted-foreground mt-5 flex flex-wrap items-center gap-4 border-t pt-4 font-sans text-xs'>
                <span className='flex items-center gap-1.5'>
                  <span className='bg-muted-foreground/20 h-2 w-2 rounded-sm' /> Slot
                  open
                </span>
                <span className='flex items-center gap-1.5'>
                  <span className='bg-destructive/70 h-2 w-2 rounded-sm' /> Slot taken
                </span>
                <span className='flex items-center gap-1.5'>
                  <span className='bg-muted-foreground/30 h-2 w-2 rounded-sm' /> No
                  slots
                </span>
                <span className='flex items-center gap-1.5 opacity-60'>
                  <span className='bg-muted-foreground/30 h-2 w-2 rounded-sm' /> Past or
                  full
                </span>
              </div>
            </CardContent>
          </Card>
          {selectedDate && (
            <div className='animate-fade-in'>
              <div className='mb-3 flex items-center gap-2 font-mono'>
                <Clock className='text-primary h-5 w-5' />
                <h2 className='font-display text-lg font-semibold'>
                  Time windows for{' '}
                  {formatDate(selectedDate, {
                    weekday: 'long',
                    month: 'short',
                    day: 'numeric',
                  })}
                </h2>
              </div>
              <div className='grid grid-cols-1 gap-4 font-mono sm:grid-cols-3'>
                {TIME_WINDOWS.map(({ key, label, range, icon: Icon }) => {
                  const slot = selectedDaySlots.find((s) => s.time_window === key);
                  const spotsLeft = slot
                    ? slot.max_bookings - slot.current_bookings
                    : 0;
                  const isFull = !slot || spotsLeft <= 0;
                  const isSelected = selectedSlot === key;
                  return (
                    <button
                      key={key}
                      type='button'
                      disabled={isFull}
                      onClick={() => {
                        setSelectedSlot(key);
                        setMapOpen(true);
                      }}
                      className={cn(
                        'group relative flex flex-col items-start rounded-xl border p-4 text-left transition-all',
                        'focus-visible:ring-ring focus-visible:ring-2 focus-visible:outline-none',
                        isFull
                          ? 'border-border bg-muted/40 cursor-not-allowed opacity-60'
                          : 'border-border bg-card hover:border-primary cursor-pointer hover:shadow-md',
                        isSelected && 'border-primary ring-primary shadow-md ring-2'
                      )}
                    >
                      <div className='flex w-full items-center justify-between font-mono'>
                        <span
                          className={cn(
                            'flex h-9 w-9 items-center justify-center rounded-lg',
                            isSelected
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-primary/10 text-primary'
                          )}
                        >
                          <Icon className='h-4 w-4' />
                        </span>
                        {isSelected && <Check className='text-primary h-5 w-5' />}
                      </div>
                      <h3 className='mt-3 font-sans text-base font-semibold'>
                        {label}
                      </h3>
                      <p className='text-muted-foreground font-mono text-sm'>{range}</p>
                      <div className='mt-3 w-full font-sans'>
                        {slot && (
                          <div className='mb-2 flex gap-1'>
                            {Array.from({ length: slot.max_bookings }).map((_, i) => (
                              <span
                                key={i}
                                className={cn(
                                  'h-1.5 flex-1 rounded-sm',
                                  i < slot.current_bookings
                                    ? 'bg-destructive/80'
                                    : 'bg-success/40'
                                )}
                              />
                            ))}
                          </div>
                        )}
                        {isFull ? (
                          <Badge
                            variant='destructive'
                            className='w-full justify-center'
                          >
                            Fully booked
                          </Badge>
                        ) : (
                          <Badge
                            variant={spotsLeft === 1 ? 'warning' : 'success'}
                            className='w-full justify-center'
                          >
                            {spotsLeft} {spotsLeft === 1 ? 'spot' : 'spots'} left
                          </Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <div className='lg:col-span-2'>
          <Card className='panel-retro lg:sticky lg:top-6'>
            <CardHeader>
              <CardTitle className='font-heading flex items-center gap-2 text-xl'>
                <TruckIcon className='text-primary h-5 w-5' />
                Booking Details
              </CardTitle>
            </CardHeader>
            <CardContent className='space-y-5 font-sans'>
              <div className='border-primary/40 bg-primary/5 rounded-lg border border-dashed p-4'>
                <p className='text-primary text-xs font-semibold tracking-wide uppercase'>
                  Selected slot
                </p>
                {selectedDate && selectedSlot ? (
                  <div className='mt-2 space-y-1'>
                    <p className='flex items-center gap-2 font-medium'>
                      <Calendar className='text-primary h-4 w-4' />
                      {formatDate(selectedDate, {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className='text-muted-foreground flex items-center gap-2 text-sm'>
                      <Clock className='text-primary h-4 w-4' />
                      {selectedSlot}
                    </p>
                  </div>
                ) : (
                  <p className='text-muted-foreground mt-2 text-sm'>
                    {selectedDate
                      ? 'Choose a time window from the cards on the left.'
                      : 'Pick a date on the calendar to begin.'}
                  </p>
                )}
              </div>
              <div className='space-y-2'>
                <Label htmlFor='service-type'>Service type</Label>
                <Select defaultValue={serviceType}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a service' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(SERVICE_LABELS).map(([value, label]) => (
                      <SelectOption
                        key={value}
                        value={value}
                        selected={serviceType === value}
                        onSelect={(v) => setServiceType(v as ServiceType)}
                      >
                        {label}
                      </SelectOption>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label htmlFor='home-size'>Home size</Label>
                <Select defaultValue={homeSize}>
                  <SelectTrigger>
                    <SelectValue placeholder='Select a size' />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(HOME_SIZE_LABELS).map(([value, label]) => (
                      <SelectOption
                        key={value}
                        value={value}
                        selected={homeSize === value}
                        onSelect={(v) => setHomeSize(v as HomeSize)}
                      >
                        {label}
                      </SelectOption>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='from-address'
                  className='flex items-center gap-1.5'
                >
                  <MapPin className='text-primary h-3.5 w-3.5' /> From address
                </Label>
                <Input
                  id='from-address'
                  placeholder='123 Oak St, Springfield, IL'
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label
                  htmlFor='to-address'
                  className='flex items-center gap-1.5'
                >
                  <MapPin className='text-accent h-3.5 w-3.5' /> To address
                </Label>
                <Input
                  id='to-address'
                  placeholder='456 Maple Ave, Springfield, IL'
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='notes'>Notes (optional)</Label>
                <Textarea
                  id='notes'
                  placeholder='3rd floor walk-up, fragile items, piano, etc.'
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
              <div className='panel-retro border-2 rounded-lg p-4'>
                <div className='flex items-center justify-between'>
                  <span className='text-muted-foreground text-sm font-medium'>
                    Estimated cost
                  </span>
                  <span className='font-display text-primary text-2xl font-bold'>
                    {formatCurrency(estimate.total)}
                  </span>
                </div>
                <div className='mt-3 space-y-1 border-t pt-3'>
                  {estimate.lineItems.map((item) => (
                    <div
                      key={item.label}
                      className='text-muted-foreground flex items-center justify-between text-xs'
                    >
                      <span>{item.label}</span>
                      <span className='font-medium'>{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                  <div className='mt-2 flex items-center justify-between border-t pt-2 text-xs'>
                    <span className='text-muted-foreground'>Crew size</span>
                    <span className='font-medium'>{estimate.crewSize} movers</span>
                  </div>
                </div>
                <p className='text-muted-foreground mt-3 text-[11px] italic'>
                  Final price confirmed after in-home assessment.
                </p>
              </div>
              {user ? (
                <Button
                  size='lg'
                  className='bg-success/40 border-success/80 text-foreground/80 hover:bg-success/20 border-2 border-inset w-full'
                  disabled={!canBook || booking}
                  onClick={handleBook}
                  nativeButton={false}
                >
                  {booking ? (
                    <>
                      <Loader2 className='h-4 w-4 animate-spin' />
                      Booking…
                    </>
                  ) : (
                    <>
                      Book This Slot
                      <ArrowRight className='h-4 w-4' />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  size='lg'
                  className='w-full'
                  variant='outline'
                  render={<Link href='/auth/login?redirect=/schedule' />}
                  nativeButton={false}
                >
                  Sign In to Book
                  <ArrowRight className='h-4 w-4' />
                </Button>
              )}
              {!canBook && user && (
                <p className='text-muted-foreground text-center text-xs'>
                  Select a date, time window, and fill in both addresses to book.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Dialog
        open={mapOpen}
        onOpenChange={setMapOpen}
      >
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader>
            <DialogTitle className='flex items-center gap-2'>
              <MapPin className='text-primary h-5 w-5' />
              Where is our crew now?
            </DialogTitle>
            <DialogDescription className='font-sans'>
              Check where we&apos;re working before you book, so you don&apos;t schedule
              a move we can&apos;t reasonably reach.
            </DialogDescription>
          </DialogHeader>
          {selectedDate && selectedSlot && (
            <div className='space-y-4'>
              <SlotMapModal
                date={selectedDate}
                timeWindow={selectedSlot}
                fromAddress={fromAddress}
                isOpen={mapOpen}
                onOpenChange={setMapOpen}
              />
              <div className='text-muted-foreground flex items-center justify-between font-mono text-xs'>
                <span>
                  {formatDate(selectedDate, {
                    weekday: 'short',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  · {selectedSlot}
                </span>
                <span className='flex items-center gap-1.5'>
                  <span className='bg-success/60 h-2 w-2 animate-pulse rounded-full' />
                  Live
                </span>
              </div>
              <Button
                size='lg'
                className='bg-success/40 border-success/80 text-foreground/80 hover:bg-success/20 border-2 border-inset w-full'
                disabled={booking}
                onClick={handleBook}
                nativeButton={false}
              >
                {booking ? (
                  <>
                    <Loader2 className='h-4 w-4 animate-spin' />
                    Booking…
                  </>
                ) : (
                  <>
                    Confirm Booking
                    <ArrowRight className='h-4 w-4' />
                  </>
                )}
              </Button>
              <p className='text-muted-foreground text-center text-xs'>
                Slots are reserved the instant you confirm — double bookings are blocked
                automatically.
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={successOpen}
        onOpenChange={setSuccessOpen}
      >
        <DialogContent>
          <DialogHeader>
            <div className='font-heading bg-success/15 mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full'>
              <Check className='text-success h-7 w-7' />
            </div>
            <DialogTitle className='text-center text-2xl'>
              Booking Confirmed!
            </DialogTitle>
            <DialogDescription className='text-center font-sans'>
              Your move is scheduled. We&apos;ve sent a confirmation to your email with
              all the details below.
            </DialogDescription>
          </DialogHeader>
          <div className='bg-muted/40 space-y-3 rounded-lg border p-4 text-sm'>
            <div className='flex items-center justify-between'>
              <span className='text-muted-foreground flex items-center gap-2 font-sans'>
                <Calendar className='text-primary h-4 w-4' /> Date
              </span>
              <span className='font-medium'>
                {selectedDate
                  ? formatDate(selectedDate, {
                      weekday: 'short',
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '—'}
              </span>
            </div>
            <div className='flex items-center justify-between font-sans'>
              <span className='text-muted-foreground flex items-center gap-2'>
                <Clock className='text-primary h-4 w-4' /> Time
              </span>
              <span className='font-medium'>{selectedSlot ?? '—'}</span>
            </div>
            <div className='flex items-center justify-between font-sans'>
              <span className='text-muted-foreground flex items-center gap-2'>
                <TruckIcon className='text-primary h-4 w-4' /> Service
              </span>
              <span className='font-medium'>{SERVICE_LABELS[serviceType]}</span>
            </div>
            <div className='flex items-center justify-between font-sans'>
              <span className='text-muted-foreground flex items-center gap-2'>
                <MapPin className='text-primary h-4 w-4' /> Size
              </span>
              <span className='font-medium'>{HOME_SIZE_LABELS[homeSize]}</span>
            </div>
            <div className='flex items-center justify-between border-t pt-3 font-sans'>
              <span className='text-muted-foreground'>Estimate</span>
              <span className='font-display text-primary text-lg font-bold'>
                {formatCurrency(estimate.total)}
              </span>
            </div>
          </div>
          <DialogFooter className='gap-2 font-sans sm:gap-0'>
            <Button
              variant='outline'
              onClick={() => handleSuccessClose(false)}
              nativeButton={false}
            >
              Book Another
            </Button>
            <Button onClick={() => handleSuccessClose(true)}>
              Go to Dashboard
              <ArrowRight className='h-4 w-4' />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  Check,
  Truck,
  Sun,
  Sunset,
  Moon,
  ArrowRight,
  Loader2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { SERVICE_LABELS, HOME_SIZE_LABELS } from "@/lib/constants";
import { useSchedule } from "@/hooks/use-schedule";
import { useAuth } from "@/hooks/use-auth";
import { calculateEstimate } from "@/lib/mock-data";
import type { ServiceType, HomeSize, TimeWindow } from "@/types";

/* ------------------------------------------------------------------ */
/*  Static config                                                      */
/* ------------------------------------------------------------------ */

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const TIME_WINDOWS: {
  key: TimeWindow;
  label: string;
  range: string;
  icon: typeof Sun;
}[] = [
  { key: "08:00-12:00", label: "Morning", range: "08:00 – 12:00", icon: Sun },
  { key: "12:00-16:00", label: "Afternoon", range: "12:00 – 16:00", icon: Sunset },
  { key: "16:00-20:00", label: "Evening", range: "16:00 – 20:00", icon: Moon },
];

type Availability = "open" | "partial" | "full" | "none";

/* ------------------------------------------------------------------ */
/*  Controlled select option                                           */
/*  The provided SelectItem only accepts { value, children }, so we    */
/*  render our own option buttons inside SelectContent (matching the   */
/*  SelectItem styling) to keep React state in sync on selection.        */
/* ------------------------------------------------------------------ */

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
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent/10 hover:text-accent-foreground",
        selected && "bg-accent/5",
      )}
    >
      {selected && (
        <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
          <Check className="h-4 w-4" />
        </span>
      )}
      {children}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Local YYYY-MM-DD, avoiding the UTC drift from toISOString(). */
function toDateKey(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
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

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function SchedulePage() {
  const { slots, loading } = useSchedule();
  const { user } = useAuth();
  const router = useRouter();

  /* ---- state ---- */
  const [currentMonth, setCurrentMonth] = useState<Date>(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<TimeWindow | null>(null);
  const [serviceType, setServiceType] = useState<ServiceType>("residential");
  const [homeSize, setHomeSize] = useState<HomeSize>("2br");
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [successOpen, setSuccessOpen] = useState(false);
  const [booking, setBooking] = useState(false);

  /* ---- derived: slots grouped by date ---- */
  const slotsByDate = useMemo(() => {
    const map = new Map<string, typeof slots>();
    for (const s of slots) {
      const arr = map.get(s.date) ?? [];
      arr.push(s);
      map.set(s.date, arr);
    }
    return map;
  }, [slots]);

  /** Per-date availability summary for calendar indicators. */
  const availabilityByDate = useMemo(() => {
    const map = new Map<string, Availability>();
    for (const [date, daySlots] of slotsByDate.entries()) {
      const openCount = daySlots.filter(
        (s) => s.current_bookings < s.max_bookings,
      ).length;
      const total = daySlots.length || 1;
      if (openCount === 0) map.set(date, "full");
      else if (openCount === total) map.set(date, "open");
      else map.set(date, "partial");
    }
    return map;
  }, [slotsByDate]);

  /** Slots for the currently selected date. */
  const selectedDaySlots = selectedDate ? (slotsByDate.get(selectedDate) ?? []) : [];

  /** Calendar grid: leading blanks + days for the viewed month. */
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

  /* ---- derived: estimate ---- */
  const estimate = useMemo(
    () => calculateEstimate(serviceType, homeSize),
    [serviceType, homeSize],
  );

  /* ---- actions ---- */
  const canBook =
    !!selectedDate && !!selectedSlot && fromAddress.trim() !== "" && toAddress.trim() !== "";

  function handleBook() {
    if (!selectedDate || !selectedSlot) return;
    if (!user) return;

    setBooking(true);
    // Simulate a booking request — the real insert would hit Supabase here.
    setTimeout(() => {
      setBooking(false);
      setSuccessOpen(true);
      toast.success("Slot booked!", {
        description: `${formatDate(selectedDate)} · ${selectedSlot}`,
      });
    }, 700);
  }

  function handleSuccessClose(goDashboard: boolean) {
    setSuccessOpen(false);
    // Reset selection so a returning user starts fresh.
    setSelectedSlot(null);
    if (goDashboard) router.push("/dashboard");
  }

  /* ---- month nav ---- */
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  const goToday = () => {
    const now = new Date();
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="animate-fade-in mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Heading */}
      <div className="mb-10 text-center">
        <Badge variant="accent" className="mb-3">
          <Calendar className="mr-1 h-3 w-3" /> Live availability
        </Badge>
        <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Schedule Your Move
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base text-muted-foreground">
          Pick a date, choose a time window, and lock in your crew. Availability
          updates in real time as slots are booked.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        {/* ============================================================ */}
        {/*  LEFT: Calendar + time slots (60% on desktop)               */}
        {/* ============================================================ */}
        <div className="space-y-6 lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <Calendar className="h-5 w-5 text-primary" />
                  {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {loading ? "Loading availability…" : "Tap a date to see time slots"}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={goToday}
                  className="hidden text-primary sm:inline-flex"
                >
                  Today
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevMonth}
                  aria-label="Previous month"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextMonth}
                  aria-label="Next month"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              {/* Weekday header */}
              <div className="mb-2 grid grid-cols-7 gap-1">
                {WEEKDAYS.map((d) => (
                  <div
                    key={d}
                    className="py-2 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* Day grid */}
                {loading ? (
                  <div className="flex h-64 items-center justify-center">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : (
                  <div className="grid grid-cols-7 gap-1">
                    {calendarCells.map((date, i) => {
                      if (!date) return <div key={`blank-${i}`} />;

                      const key = toDateKey(date);
                      const past = isPast(date);
                      const avail = availabilityByDate.get(key) ?? "none";
                      const isToday = isSameDay(date, new Date());
                      const isSelected = selectedDate === key;
                      const hasSlots = avail !== "none";

                      return (
                        <button
                          key={key}
                          type="button"
                          disabled={past || !hasSlots}
                          onClick={() => {
                            setSelectedDate(key);
                            setSelectedSlot(null);
                          }}
                          className={cn(
                            "relative flex aspect-square flex-col items-center justify-center rounded-lg border text-sm transition-all",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            past || !hasSlots
                              ? "cursor-not-allowed border-transparent bg-muted/40 text-muted-foreground/40"
                              : "cursor-pointer border-border bg-card hover:border-primary hover:shadow-sm",
                            isSelected && "border-primary bg-primary text-primary-foreground shadow-md",
                            isToday && !isSelected && "ring-2 ring-accent",
                          )}
                        >
                          <span
                            className={cn(
                              "font-medium",
                              isSelected && "font-bold",
                            )}
                          >
                            {date.getDate()}
                          </span>

                          {/* Availability dot */}
                          {!past && hasSlots && (
                            <span
                              className={cn(
                                "mt-1 h-1.5 w-1.5 rounded-full",
                                isSelected
                                  ? "bg-primary-foreground/80"
                                  : avail === "open"
                                    ? "bg-success"
                                    : avail === "partial"
                                      ? "bg-warning"
                                      : "bg-destructive",
                              )}
                            />
                          )}

                          {isToday && (
                            <span
                              className={cn(
                                "absolute bottom-1 text-[9px] font-semibold uppercase",
                                isSelected ? "text-primary-foreground/80" : "text-accent",
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

              {/* Legend */}
              <div className="mt-5 flex flex-wrap items-center gap-4 border-t pt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-success" /> All open
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-warning" /> Partial
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-destructive" /> Full
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-muted-foreground/30" /> No slots
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Time slots for selected day */}
          {selectedDate && (
            <div className="animate-fade-in">
              <div className="mb-3 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-semibold">
                  Time windows for {formatDate(selectedDate, { weekday: "long", month: "short", day: "numeric" })}
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
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
                      type="button"
                      disabled={isFull}
                      onClick={() => setSelectedSlot(key)}
                      className={cn(
                        "group relative flex flex-col items-start rounded-xl border p-4 text-left transition-all",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                        isFull
                          ? "cursor-not-allowed border-border bg-muted/40 opacity-60"
                          : "cursor-pointer border-border bg-card hover:border-primary hover:shadow-md",
                        isSelected && "border-primary ring-2 ring-primary shadow-md",
                      )}
                    >
                      <div className="flex w-full items-center justify-between">
                        <span
                          className={cn(
                            "flex h-9 w-9 items-center justify-center rounded-lg",
                            isSelected
                              ? "bg-primary text-primary-foreground"
                              : "bg-primary/10 text-primary",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        {isSelected && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>

                      <h3 className="mt-3 font-display text-base font-semibold">
                        {label}
                      </h3>
                      <p className="text-sm text-muted-foreground">{range}</p>

                      <div className="mt-3 w-full">
                        {isFull ? (
                          <Badge variant="destructive" className="w-full justify-center">
                            Fully booked
                          </Badge>
                        ) : (
                          <Badge
                            variant={spotsLeft === 1 ? "warning" : "success"}
                            className="w-full justify-center"
                          >
                            {spotsLeft} {spotsLeft === 1 ? "spot" : "spots"} left
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

        {/* ============================================================ */}
        {/*  RIGHT: Booking form (40% on desktop)                       */}
        {/* ============================================================ */}
        <div className="lg:col-span-2">
          <Card className="lg:sticky lg:top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Truck className="h-5 w-5 text-primary" />
                Booking Details
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              {/* Selection summary */}
              <div className="rounded-lg border border-dashed border-primary/40 bg-primary/5 p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                  Selected slot
                </p>
                {selectedDate && selectedSlot ? (
                  <div className="mt-2 space-y-1">
                    <p className="flex items-center gap-2 font-medium">
                      <Calendar className="h-4 w-4 text-primary" />
                      {formatDate(selectedDate, { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                    </p>
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 text-primary" />
                      {selectedSlot}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {selectedDate
                      ? "Choose a time window from the cards on the left."
                      : "Pick a date on the calendar to begin."}
                  </p>
                )}
              </div>

              {/* Service type */}
              <div className="space-y-2">
                <Label htmlFor="service-type">Service type</Label>
                <Select defaultValue={serviceType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a service" />
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

              {/* Home size */}
              <div className="space-y-2">
                <Label htmlFor="home-size">Home size</Label>
                <Select defaultValue={homeSize}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a size" />
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

              {/* Addresses */}
              <div className="space-y-2">
                <Label htmlFor="from-address" className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-primary" /> From address
                </Label>
                <Input
                  id="from-address"
                  placeholder="123 Oak St, Springfield, IL"
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="to-address" className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-accent" /> To address
                </Label>
                <Input
                  id="to-address"
                  placeholder="456 Maple Ave, Springfield, IL"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="3rd floor walk-up, fragile items, piano, etc."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {/* Estimate */}
              <div className="rounded-lg bg-muted/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Estimated cost
                  </span>
                  <span className="font-display text-2xl font-bold text-primary">
                    {formatCurrency(estimate.total)}
                  </span>
                </div>
                <div className="mt-3 space-y-1 border-t pt-3">
                  {estimate.lineItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between text-xs text-muted-foreground"
                    >
                      <span>{item.label}</span>
                      <span className="font-medium">{formatCurrency(item.amount)}</span>
                    </div>
                  ))}
                  <div className="mt-2 flex items-center justify-between border-t pt-2 text-xs">
                    <span className="text-muted-foreground">Crew size</span>
                    <span className="font-medium">{estimate.crewSize} movers</span>
                  </div>
                </div>
                <p className="mt-3 text-[11px] italic text-muted-foreground">
                  Final price confirmed after in-home assessment.
                </p>
              </div>

              {/* Action */}
              {user ? (
                <Button
                  size="lg"
                  className="w-full"
                  disabled={!canBook || booking}
                  onClick={handleBook}
                >
                  {booking ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Booking…
                    </>
                  ) : (
                    <>
                      Book This Slot
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button asChild size="lg" className="w-full" variant="accent">
                  <Link href="/login?redirect=/schedule">
                    Sign In to Book
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              )}

              {!canBook && user && (
                <p className="text-center text-xs text-muted-foreground">
                  Select a date, time window, and fill in both addresses to book.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ============================================================ */}
      {/*  Success dialog                                              */}
      {/* ============================================================ */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent>
          <DialogHeader>
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-success/15">
              <Check className="h-7 w-7 text-success" />
            </div>
            <DialogTitle className="text-center text-2xl">Booking Confirmed!</DialogTitle>
            <DialogDescription className="text-center">
              Your move is scheduled. We&apos;ve sent a confirmation to your email
              with all the details below.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 rounded-lg border bg-muted/40 p-4 text-sm">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4 text-primary" /> Date
              </span>
              <span className="font-medium">
                {selectedDate ? formatDate(selectedDate, { weekday: "short", month: "long", day: "numeric", year: "numeric" }) : "—"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4 text-primary" /> Time
              </span>
              <span className="font-medium">{selectedSlot ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <Truck className="h-4 w-4 text-primary" /> Service
              </span>
              <span className="font-medium">{SERVICE_LABELS[serviceType]}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" /> Size
              </span>
              <span className="font-medium">{HOME_SIZE_LABELS[homeSize]}</span>
            </div>
            <div className="flex items-center justify-between border-t pt-3">
              <span className="text-muted-foreground">Estimate</span>
              <span className="font-display text-lg font-bold text-primary">
                {formatCurrency(estimate.total)}
              </span>
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => handleSuccessClose(false)}>
              Book Another
            </Button>
            <Button onClick={() => handleSuccessClose(true)}>
              Go to Dashboard
              <ArrowRight className="h-4 w-4" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

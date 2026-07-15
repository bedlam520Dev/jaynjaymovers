"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Home,
  Building,
  Truck,
  Package,
  Warehouse,
  Boxes,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn, formatCurrency } from "@/lib/utils";
import { SERVICE_LABELS, HOME_SIZE_LABELS } from "@/lib/constants";
import { calculateEstimate } from "@/lib/mock-data";
import type { ServiceType, HomeSize } from "@/types";
import { useAuth } from "@/hooks/use-auth";

const STEPS = ["Service", "Details", "Contact", "Estimate"] as const;

const SERVICE_OPTIONS: { key: ServiceType; icon: React.ElementType }[] = [
  { key: "residential", icon: Home },
  { key: "commercial", icon: Building },
  { key: "long_distance", icon: Truck },
  { key: "packing", icon: Package },
  { key: "storage", icon: Warehouse },
  { key: "specialty", icon: Boxes },
];

const HOME_SIZE_OPTIONS: HomeSize[] = [
  "studio",
  "1br",
  "2br",
  "3br",
  "4br_plus",
  "office",
  "custom",
];

export default function QuotePage() {
  const router = useRouter();
  const { user, profile } = useAuth();

  const [step, setStep] = useState(0);
  const [serviceType, setServiceType] = useState<ServiceType | null>(null);
  const [homeSize, setHomeSize] = useState<HomeSize | null>(null);
  const [fromAddress, setFromAddress] = useState("");
  const [toAddress, setToAddress] = useState("");
  const [moveDate, setMoveDate] = useState("");
  const [notes, setNotes] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill contact info from profile/user when logged in
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
      toast.error("Please complete all required fields before continuing.");
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };

  const handleBack = () => {
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = () => {
    if (!isStepValid(2)) {
      toast.error("Please complete your contact information.");
      return;
    }
    toast.success("Quote request submitted! We'll be in touch shortly.");
    setSubmitted(true);
  };

  // ---------- Success state ----------
  if (submitted) {
    return (
      <div className="animate-fade-in mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <Card className="overflow-hidden border-success/30 shadow-lg">
          <div className="bg-gradient-to-br from-success/10 to-accent/10 px-6 py-10 text-center sm:px-12">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-12 w-12" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Quote request received!
            </h1>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg">
              Thanks{contactName ? `, ${contactName.split(" ")[0]}` : ""} — our team
              will review your details and reach out within 24 hours.
            </p>
          </div>

          <CardContent className="space-y-8 p-6 sm:p-10">
            {/* Summary recap */}
            {estimate && (
              <div className="rounded-xl border bg-muted/30 p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold">
                    Your estimate
                  </h2>
                  <Badge variant="accent">
                    {serviceType ? SERVICE_LABELS[serviceType] : ""}
                  </Badge>
                </div>
                <div className="flex items-end justify-between border-t pt-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    Estimated total
                  </span>
                  <span className="font-display text-3xl font-bold text-primary">
                    {formatCurrency(estimate.total)}
                  </span>
                </div>
              </div>
            )}

            {/* What's next */}
            <div>
              <h2 className="font-display text-xl font-semibold">What's next?</h2>
              <ol className="mt-4 space-y-4">
                {[
                  {
                    icon: Clock,
                    title: "We review your request",
                    desc: "Our moving specialists assess your details and confirm availability for your preferred date.",
                  },
                  {
                    icon: Phone,
                    title: "A coordinator reaches out",
                    desc: "Within 24 hours, we'll contact you to finalize the quote and answer any questions.",
                  },
                  {
                    icon: Calendar,
                    title: "Schedule your move",
                    desc: "Lock in your date and time window. You can do that right now if you're ready.",
                  },
                ].map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <li key={i} className="flex gap-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ol>
            </div>

            <Separator />

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="flex-1">
                <Link href="/schedule">
                  Schedule your move
                  <ArrowRight className="ml-1" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="flex-1"
              >
                <Link href="/">Back to home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // ---------- Wizard ----------
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-grid hero-gradient">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="accent" className="mb-4">
              Free Quote
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              Get your moving estimate
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Answer a few quick questions and receive an instant, no-obligation
              estimate. It takes less than two minutes.
            </p>
          </div>
        </div>
      </section>

      {/* Wizard */}
      <section className="py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            {/* Step indicator */}
            <div className="mb-10">
              <div className="flex items-center justify-between">
                {STEPS.map((label, i) => {
                  const isActive = i === step;
                  const isComplete = i < step;
                  return (
                    <div
                      key={label}
                      className="flex flex-1 flex-col items-center gap-2 sm:flex-row"
                    >
                      <div className="flex items-center gap-3 sm:flex-1">
                        <div
                          className={cn(
                            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all",
                            isComplete &&
                              "border-success bg-success text-success-foreground",
                            isActive &&
                              "border-primary bg-primary text-primary-foreground ring-4 ring-primary/15",
                            !isActive &&
                              !isComplete &&
                              "border-border bg-background text-muted-foreground",
                          )}
                        >
                          {isComplete ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            i + 1
                          )}
                        </div>
                        <span
                          className={cn(
                            "hidden text-sm font-medium sm:block",
                            isActive
                              ? "text-foreground"
                              : "text-muted-foreground",
                          )}
                        >
                          {label}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className={cn(
                            "mx-2 hidden h-0.5 flex-1 rounded-full transition-colors sm:block",
                            isComplete ? "bg-success" : "bg-border",
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
              {/* Main step content */}
              <div className="order-2 lg:order-1">
                <Card className="shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-2xl">
                      {step === 0 && "What can we move for you?"}
                      {step === 1 && "Tell us about your move"}
                      {step === 2 && "How can we reach you?"}
                      {step === 3 && "Review your estimate"}
                    </CardTitle>
                    <CardDescription>
                      {step === 0 &&
                        "Select the service that best matches your needs. You can change this later."}
                      {step === 1 &&
                        "A few details about your move so we can prepare an accurate estimate."}
                      {step === 2 &&
                        "We'll use this to send your quote and follow up with any questions."}
                      {step === 3 &&
                        "Here's your instant estimate. Submit when you're ready to get started."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* ---------- Step 1: Service Type ---------- */}
                    {step === 0 && (
                      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {SERVICE_OPTIONS.map((opt) => {
                          const Icon = opt.icon;
                          const selected = serviceType === opt.key;
                          return (
                            <button
                              key={opt.key}
                              type="button"
                              onClick={() => setServiceType(opt.key)}
                              className={cn(
                                "group flex flex-col items-start gap-3 rounded-xl border-2 p-5 text-left transition-all hover:border-primary/50 hover:bg-primary/5",
                                selected
                                  ? "border-primary bg-primary/5 ring-2 ring-primary"
                                  : "border-border bg-background",
                              )}
                            >
                              <div
                                className={cn(
                                  "flex h-12 w-12 items-center justify-center rounded-lg transition-colors",
                                  selected
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-primary/10 text-primary",
                                )}
                              >
                                <Icon className="h-6 w-6" />
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">
                                  {SERVICE_LABELS[opt.key]}
                                </p>
                              </div>
                              {selected && (
                                <div className="mt-1 flex items-center gap-1 text-sm font-medium text-primary">
                                  <Check className="h-4 w-4" />
                                  Selected
                                </div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* ---------- Step 2: Move Details ---------- */}
                    {step === 1 && (
                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label>Home / space size</Label>
                          <div className="flex flex-wrap gap-2">
                            {HOME_SIZE_OPTIONS.map((size) => {
                              const selected = homeSize === size;
                              return (
                                <button
                                  key={size}
                                  type="button"
                                  onClick={() => setHomeSize(size)}
                                  className={cn(
                                    "rounded-full border-2 px-4 py-2 text-sm font-medium transition-all",
                                    selected
                                      ? "border-primary bg-primary text-primary-foreground"
                                      : "border-border bg-background text-muted-foreground hover:border-primary/50 hover:text-foreground",
                                  )}
                                >
                                  {HOME_SIZE_LABELS[size]}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <Separator />

                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="fromAddress">Moving from</Label>
                            <div className="relative">
                              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id="fromAddress"
                                placeholder="123 Oak St, Springfield, IL"
                                value={fromAddress}
                                onChange={(e) => setFromAddress(e.target.value)}
                                className="pl-9"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="toAddress">Moving to</Label>
                            <div className="relative">
                              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id="toAddress"
                                placeholder="456 Maple Ave, Springfield, IL"
                                value={toAddress}
                                onChange={(e) => setToAddress(e.target.value)}
                                className="pl-9"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="moveDate">Preferred move date</Label>
                          <div className="relative sm:max-w-xs">
                            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="moveDate"
                              type="date"
                              value={moveDate}
                              onChange={(e) => setMoveDate(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="notes">
                            Additional notes{" "}
                            <span className="font-normal text-muted-foreground">
                              (optional)
                            </span>
                          </Label>
                          <Textarea
                            id="notes"
                            placeholder="Stairs, fragile items, parking restrictions, timing needs…"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            rows={4}
                          />
                        </div>
                      </div>
                    )}

                    {/* ---------- Step 3: Contact Info ---------- */}
                    {step === 2 && (
                      <div className="space-y-6">
                        {user && (
                          <div className="flex items-center gap-2 rounded-lg bg-primary/5 p-3 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4 w-4 shrink-0 text-primary" />
                            <span>
                              Signed in as{" "}
                              <span className="font-medium text-foreground">
                                {user.email}
                              </span>{" "}
                              — contact info pre-filled from your profile.
                            </span>
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label htmlFor="contactName">Full name</Label>
                          <div className="relative">
                            <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="contactName"
                              placeholder="Jane Doe"
                              value={contactName}
                              onChange={(e) => setContactName(e.target.value)}
                              className="pl-9"
                            />
                          </div>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="contactPhone">Phone</Label>
                            <div className="relative">
                              <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id="contactPhone"
                                type="tel"
                                placeholder="(217) 555-0100"
                                value={contactPhone}
                                onChange={(e) =>
                                  setContactPhone(e.target.value)
                                }
                                className="pl-9"
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="contactEmail">Email</Label>
                            <div className="relative">
                              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                              <Input
                                id="contactEmail"
                                type="email"
                                placeholder="jane@email.com"
                                value={contactEmail}
                                onChange={(e) =>
                                  setContactEmail(e.target.value)
                                }
                                className="pl-9"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* ---------- Step 4: Estimate Summary ---------- */}
                    {step === 3 && (
                      <div className="space-y-6">
                        {/* Recap chips */}
                        <div className="flex flex-wrap gap-2">
                          {serviceType && (
                            <Badge variant="accent">
                              {SERVICE_LABELS[serviceType]}
                            </Badge>
                          )}
                          {homeSize && (
                            <Badge variant="secondary">
                              {HOME_SIZE_LABELS[homeSize]}
                            </Badge>
                          )}
                          {moveDate && (
                            <Badge variant="outline">
                              <Calendar className="mr-1 h-3 w-3" />
                              {new Date(moveDate).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </Badge>
                          )}
                        </div>

                        {/* Receipt-style breakdown */}
                        {estimate ? (
                          <div className="rounded-xl border bg-muted/30 p-5 font-mono">
                            <div className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                              <DollarSign className="h-4 w-4" />
                              Estimate breakdown
                            </div>
                            <div className="space-y-3">
                              {estimate.lineItems.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span className="text-muted-foreground">
                                    {item.label}
                                  </span>
                                  <span className="font-medium text-foreground">
                                    {formatCurrency(item.amount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <Separator className="my-4" />
                            <div className="flex items-center justify-between">
                              <span className="font-semibold text-foreground">
                                Estimated total
                              </span>
                              <span className="font-display text-2xl font-bold text-primary">
                                {formatCurrency(estimate.total)}
                              </span>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            Unable to generate an estimate. Please go back and
                            select a service and home size.
                          </p>
                        )}

                        {/* Crew / hours info */}
                        {estimate && (
                          <div className="grid gap-3 sm:grid-cols-2">
                            <div className="flex items-center gap-3 rounded-lg border p-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                <Users className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Crew size
                                </p>
                                <p className="font-semibold">
                                  {estimate.crewSize} movers
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3 rounded-lg border p-4">
                              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
                                <Clock className="h-5 w-5" />
                              </div>
                              <div>
                                <p className="text-sm text-muted-foreground">
                                  Estimated hours
                                </p>
                                <p className="font-semibold">
                                  {estimate.estimatedHours} hours
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Contact recap */}
                        <div className="rounded-lg border bg-background p-4">
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                            Contact
                          </p>
                          <p className="text-sm font-medium text-foreground">
                            {contactName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {contactPhone} · {contactEmail}
                          </p>
                        </div>

                        <p className="text-center text-xs text-muted-foreground">
                          This is an estimate. Final pricing is confirmed when
                          you schedule your move.
                        </p>
                      </div>
                    )}

                    {/* Navigation */}
                    <div className="flex items-center justify-between gap-4 pt-2">
                      <Button
                        variant="ghost"
                        onClick={handleBack}
                        disabled={step === 0}
                        className={cn(step === 0 && "invisible")}
                      >
                        <ArrowLeft className="mr-1" />
                        Back
                      </Button>
                      {step < STEPS.length - 1 ? (
                        <Button onClick={handleNext} size="lg">
                          Continue
                          <ArrowRight className="ml-1" />
                        </Button>
                      ) : (
                        <Button onClick={handleSubmit} size="lg" variant="accent">
                          <Check className="mr-1" />
                          Submit quote request
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* ---------- Live estimate sidebar ---------- */}
              {step >= 1 && (
                <div className="order-1 lg:order-2">
                  <div className="lg:sticky lg:top-8">
                    <Card className="overflow-hidden border-primary/20 shadow-sm">
                      <CardHeader className="bg-primary/5 pb-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <DollarSign className="h-5 w-5" />
                          </div>
                          <div>
                            <CardTitle className="text-base">
                              Live estimate
                            </CardTitle>
                            <CardDescription className="text-xs">
                              Updates as you go
                            </CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        {estimate ? (
                          <div className="space-y-4">
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Estimated total
                              </p>
                              <p className="font-display text-3xl font-bold text-primary">
                                {formatCurrency(estimate.total)}
                              </p>
                            </div>
                            <Separator />
                            <div className="space-y-2">
                              {estimate.lineItems.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span className="text-muted-foreground">
                                    {item.label}
                                  </span>
                                  <span className="font-medium">
                                    {formatCurrency(item.amount)}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <Separator />
                            <div className="flex items-center gap-4 text-sm">
                              <span className="flex items-center gap-1.5 text-muted-foreground">
                                <Users className="h-4 w-4 text-primary" />
                                {estimate.crewSize} crew
                              </span>
                              <span className="flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="h-4 w-4 text-accent" />
                                {estimate.estimatedHours}h
                              </span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3 py-2 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
                              <DollarSign className="h-6 w-6" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {step === 1 && !homeSize
                                ? "Select a home size to see your estimate."
                                : "Your estimate will appear here."}
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

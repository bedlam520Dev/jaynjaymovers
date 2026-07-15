import Link from "next/link";
import {
  Truck,
  Home as HomeIcon,
  Building,
  Package,
  Boxes,
  Warehouse,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Users,
  CheckCircle2,
  Quote,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/star-rating";
import { SITE, SERVICE_LABELS, PRICING } from "@/lib/constants";
import { MOCK_REVIEWS } from "@/lib/mock-data";
import { formatCurrency, timeAgo } from "@/lib/utils";

const HERO_IMAGE =
  "https://images.pexels.com/photos/2255338/pexels-photo-2255338.jpeg?auto=compress&cs=tinysrgb&w=1600";

const STATS = [
  { icon: Users, value: "2,500+", label: "Happy Customers" },
  { icon: Truck, value: "15", label: "Trucks in Fleet" },
  { icon: Star, value: "4.9/5", label: "Average Rating" },
  { icon: Clock, value: "12 yrs", label: "Experience" },
];

const SERVICES = [
  {
    icon: HomeIcon,
    key: "residential" as const,
    title: SERVICE_LABELS.residential,
    description:
      "Full-service residential moves for apartments, condos, and houses of any size. Careful, efficient, and friendly.",
    price: PRICING.baseHourly,
    features: ["Furniture disassembly & reassembly", "Free wardrobe boxes", "Floor & wall protection"],
  },
  {
    icon: Building,
    key: "commercial" as const,
    title: SERVICE_LABELS.commercial,
    description:
      "Minimize downtime with our office and commercial relocation services. We work nights and weekends to keep you running.",
    price: PRICING.baseHourly,
    features: ["After-hours availability", "IT equipment handling", "Workstation setup"],
  },
  {
    icon: Truck,
    key: "long_distance" as const,
    title: SERVICE_LABELS.long_distance,
    description:
      "Statewide and cross-country moves with GPS-tracked trucks and guaranteed delivery windows.",
    price: PRICING.longDistancePerMile,
    features: ["GPS shipment tracking", "Guaranteed delivery window", "Dedicated move coordinator"],
  },
  {
    icon: Package,
    key: "packing" as const,
    title: SERVICE_LABELS.packing,
    description:
      "Professional packing and unpacking so your valuables arrive safe. Materials and labor included.",
    price: PRICING.packingPerRoom,
    features: ["Pro-grade materials", "Fragile item wrapping", "Room-by-room labeling"],
  },
  {
    icon: Warehouse,
    key: "storage" as const,
    title: SERVICE_LABELS.storage,
    description:
      "Climate-controlled, secure storage for short or long-term needs. Containerized and vault options available.",
    price: PRICING.storagePerMonth,
    features: ["24/7 video surveillance", "Climate-controlled units", "Flexible monthly terms"],
  },
  {
    icon: Boxes,
    key: "specialty" as const,
    title: SERVICE_LABELS.specialty,
    description:
      "Pianos, antiques, art, safes, and oversized items. Our specialty crews have the gear and the training.",
    price: PRICING.specialtyItemFee,
    features: ["Custom crating", "Specialty equipment", "Fully insured handling"],
  },
];

const STEPS = [
  {
    icon: Quote,
    title: "Get a Quote",
    description: "Tell us about your move in under two minutes. Get an instant, transparent estimate—no phone tag required.",
  },
  {
    icon: Calendar,
    title: "Pick a Date",
    description: "Choose a time slot that works for you. Real-time availability means what you see is what you get.",
  },
  {
    icon: Truck,
    title: "We Handle the Rest",
    description: "Our background-checked crew arrives on time, prepped, and equipped. You relax—we do the heavy lifting.",
  },
  {
    icon: CheckCircle2,
    title: "Pay Online",
    description: "Review your final invoice and pay securely online. No cash, no surprises, no hidden fees.",
  },
];

const REVIEW_SOURCE_VARIANT: Record<
  string,
  "default" | "secondary" | "outline" | "accent"
> = {
  google: "default",
  yelp: "accent",
  trustadvisor: "secondary",
  internal: "outline",
};

const REVIEW_SOURCE_LABEL: Record<string, string> = {
  google: "Google",
  yelp: "Yelp",
  trustadvisor: "Trust Advisor",
  internal: "On Our Site",
};

export default function Home() {
  const topReviews = MOCK_REVIEWS.slice(0, 3);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Gradient background */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary via-primary/95 to-primary/80" />
        <div className="absolute inset-0 -z-10 bg-grid opacity-[0.07]" />
        <div className="absolute -top-24 -right-24 -z-10 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />
        <div className="absolute -bottom-32 -left-24 -z-10 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />

        <div className="container mx-auto px-4 py-16 md:py-24 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left: copy */}
            <div className="flex flex-col items-start text-primary-foreground">
              <Badge
                variant="accent"
                className="mb-5 gap-1.5 py-1.5 pl-3 pr-4 text-sm"
              >
                <Shield className="h-3.5 w-3.5" />
                Licensed · Bonded · Insured
              </Badge>

              <h1 className="font-display text-4xl font-extrabold leading-tight tracking-tight text-balance sm:text-5xl lg:text-6xl">
                Moving made simple, stress-free, and seamless
              </h1>

              <p className="mt-5 max-w-xl text-lg text-primary-foreground/80">
                {SITE.name} delivers premium moving services for residential and
                commercial clients across the Midwest. Transparent pricing,
                background-checked crews, and a booking experience that just
                works.
              </p>

              {/* Star rating */}
              <div className="mt-7 flex items-center gap-3">
                <StarRating rating={5} size="lg" />
                <span className="text-sm font-medium text-primary-foreground/90">
                  4.9/5 from 2,500+ moves
                </span>
              </div>

              {/* CTAs */}
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="xl" variant="accent">
                  <Link href="/quote">
                    Get a Free Quote
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="xl"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Link href="/schedule">Schedule a Move</Link>
                </Button>
              </div>

              {/* Trust badge row */}
              <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-primary-foreground/70">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  No hidden fees
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  Free instant quotes
                </span>
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent" />
                  {SITE.license}
                </span>
              </div>
            </div>

            {/* Right: image */}
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl border border-primary-foreground/20 shadow-2xl">
                <img
                  src={HERO_IMAGE}
                  alt="Professional movers loading furniture into a moving truck"
                  className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[520px]"
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
              </div>

              {/* Floating quote card */}
              <div className="absolute -bottom-6 -left-4 hidden sm:block">
                <Card className="w-64 border-none bg-card/95 shadow-xl backdrop-blur">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Starting at
                      </span>
                      <Badge variant="accent" className="text-xs">
                        Hourly
                      </Badge>
                    </div>
                    <p className="mt-1 font-display text-3xl font-bold text-primary">
                      {formatCurrency(PRICING.baseHourly)}
                      <span className="text-base font-normal text-muted-foreground">
                        /hr
                      </span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      2-mover crew · truck included
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 divide-x divide-border lg:grid-cols-4">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 px-4 py-8 text-center md:py-10"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </div>
                <p className="font-display text-2xl font-bold tracking-tight md:text-3xl">
                  {value}
                </p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              What we do
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Moving services for every situation
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              From studio apartments to full office relocations, we have a
              crew, a truck, and a plan for you.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map(({ icon: Icon, key, title, description, price, features }) => (
              <Card
                key={key}
                className="group flex flex-col transition-all hover:-translate-y-1 hover:shadow-lg"
              >
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 text-xl">{title}</CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">{description}</p>
                  <ul className="mt-4 space-y-2">
                    {features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground">
                      {key === "long_distance" ? "Per mile" : key === "storage" ? "Per month" : "Starting at"}
                    </span>
                    <p className="font-display text-lg font-bold text-primary">
                      {formatCurrency(price)}
                    </p>
                  </div>
                  <Button asChild variant="ghost" size="sm" className="text-primary">
                    <Link href={`/services#${key}`}>
                      Learn more
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-secondary/40 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">
              How it works
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
              Four steps from quote to moved-in
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We have refined the moving process down to its simplest form.
              Here is exactly what to expect.
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map(({ icon: Icon, title, description }, index) => (
              <div key={title} className="relative flex flex-col items-start">
                {/* Connector line */}
                {index < STEPS.length - 1 && (
                  <div className="absolute left-7 top-14 hidden h-px w-[calc(100%-2rem)] bg-border lg:block" />
                )}

                <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="mt-4 text-sm font-semibold uppercase tracking-wide text-accent">
                  Step {index + 1}
                </span>
                <h3 className="mt-1 font-display text-xl font-bold">{title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button asChild size="lg">
              <Link href="/quote">
                Start your free quote
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Reviews preview */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
            <div className="max-w-2xl">
              <Badge variant="secondary" className="mb-4">
                Customer stories
              </Badge>
              <h2 className="font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl">
                Loved by 2,500+ happy movers
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Real reviews from real customers across Google, Yelp, and Trust
                Advisor.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href="/reviews">
                Read all reviews
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {topReviews.map((review) => {
              const SourceIcon = review.source === "google" ? Star : Quote;
              return (
                <Card key={review.id} className="flex flex-col">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <Quote className="h-8 w-8 text-accent/40" />
                      <Badge
                        variant={REVIEW_SOURCE_VARIANT[review.source] ?? "outline"}
                        className="gap-1.5"
                      >
                        <SourceIcon className="h-3 w-3" />
                        {REVIEW_SOURCE_LABEL[review.source] ?? review.source}
                      </Badge>
                    </div>
                    <StarRating rating={review.rating} size="md" className="mt-2" />
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      &ldquo;{review.text}&rdquo;
                    </p>
                  </CardContent>
                  <CardFooter>
                    <div className="flex items-center gap-3">
                      <img
                        src={review.author_avatar}
                        alt={review.author_name}
                        className="h-10 w-10 rounded-full object-cover"
                        loading="lazy"
                      />
                      <div>
                        <p className="text-sm font-semibold">{review.author_name}</p>
                        <p className="text-xs text-muted-foreground">
                          {timeAgo(review.created_at)}
                        </p>
                      </div>
                    </div>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-14 md:px-12 md:py-20">
            {/* Decorative accents */}
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
            <div className="absolute inset-0 bg-grid opacity-[0.07]" />

            <div className="relative flex flex-col items-center text-center text-primary-foreground">
              <Badge variant="accent" className="mb-5 gap-1.5">
                <Truck className="h-3.5 w-3.5" />
                Ready when you are
              </Badge>
              <h2 className="max-w-3xl font-display text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl">
                Let&apos;s make your next move your best move
              </h2>
              <p className="mt-5 max-w-xl text-lg text-primary-foreground/80">
                Get a free, no-obligation quote in under two minutes. Transparent
                pricing, guaranteed dates, and a crew you can trust.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="xl" variant="accent">
                  <Link href="/quote">
                    Get a Free Quote
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="xl"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
                >
                  <Link href="/schedule">Schedule a Move</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-primary-foreground/60">
                Or call us at{" "}
                <a
                  href={`tel:${SITE.phone.replace(/[^0-9+]/g, "")}`}
                  className="font-medium text-primary-foreground underline-offset-4 hover:underline"
                >
                  {SITE.phone}
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

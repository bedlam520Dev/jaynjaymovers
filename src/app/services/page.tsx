import type { Metadata } from "next";
import Link from "next/link";
import {
  Home,
  Building,
  Truck,
  Package,
  Warehouse,
  Boxes,
  CheckCircle2,
  ShieldCheck,
  Tag,
  Clock,
  Users,
  ArrowRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PRICING } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Explore Summit Movers' full range of professional moving services — residential, commercial, long distance, packing, storage, and specialty item moves. Licensed, bonded, and insured.",
};

type ServiceCard = {
  key: string;
  label: string;
  icon: React.ElementType;
  description: string;
  features: string[];
  priceFrom: number;
  priceLabel: string;
};

const services: ServiceCard[] = [
  {
    key: "residential",
    label: "Residential Move",
    icon: Home,
    description:
      "Stress-free home moves for apartments, condos, and houses of any size. Our crew handles your belongings with care from door to door.",
    features: [
      "Full-service loading & unloading",
      "Furniture disassembly & reassembly",
      "Floor and wall protection",
      "Free in-home estimates",
    ],
    priceFrom: PRICING.baseHourly,
    priceLabel: "per hour",
  },
  {
    key: "commercial",
    label: "Commercial Move",
    icon: Building,
    description:
      "Minimize downtime with efficient office and business relocations. We work around your schedule to keep operations running.",
    features: [
      "After-hours and weekend moves",
      "Workstation and IT equipment handling",
      "Furniture and cubicle reconfiguration",
      "Project management included",
    ],
    priceFrom: PRICING.baseHourly,
    priceLabel: "per hour",
  },
  {
    key: "long_distance",
    label: "Long Distance Move",
    icon: Truck,
    description:
      "Reliable state-to-state and cross-country moving. Your belongings are tracked and insured every mile of the journey.",
    features: [
      "Dedicated long-haul truck",
      "Real-time shipment tracking",
      "Full value protection included",
      "Guaranteed delivery windows",
    ],
    priceFrom: PRICING.longDistancePerMile,
    priceLabel: "per mile",
  },
  {
    key: "packing",
    label: "Packing Service",
    icon: Package,
    description:
      "Leave the boxes to us. Professional packing and unpacking services with high-quality materials to keep everything safe.",
    features: [
      "Professional-grade materials",
      "Room-by-room packing option",
      "Fragile and specialty wrapping",
      "Labeling and inventory list",
    ],
    priceFrom: PRICING.packingPerRoom,
    priceLabel: "per room",
  },
  {
    key: "storage",
    label: "Storage Solutions",
    icon: Warehouse,
    description:
      "Secure, climate-controlled storage for short or long-term needs. Perfect for staging between moves or decluttering.",
    features: [
      "Climate-controlled units",
      "24/7 security monitoring",
      "Flexible month-to-month terms",
      "Containerized storage options",
    ],
    priceFrom: PRICING.storagePerMonth,
    priceLabel: "per month",
  },
  {
    key: "specialty",
    label: "Specialty Items",
    icon: Boxes,
    description:
      "Pianos, art, antiques, safes, and more. Our trained specialists handle your most valuable and challenging items.",
    features: [
      "Custom crating available",
      "Piano and instrument moving",
      "Fine art and antique handling",
      "Safes and heavy equipment",
    ],
    priceFrom: PRICING.specialtyItemFee,
    priceLabel: "per item",
  },
];

const whyChooseUs = [
  {
    icon: ShieldCheck,
    title: "Licensed & Bonded",
    description:
      "Fully licensed (IL MC# 892341), bonded, and insured for your peace of mind. Every move is covered from start to finish.",
  },
  {
    icon: Tag,
    title: "Transparent Pricing",
    description:
      "No hidden fees, ever. You see your full estimate upfront with a clear breakdown of labor, truck, and any add-ons.",
  },
  {
    icon: Clock,
    title: "On-Time Guarantee",
    description:
      "We respect your schedule. Our crews arrive within the promised window or your truck fee is on us.",
  },
  {
    icon: Users,
    title: "Experienced Crew",
    description:
      "Background-checked, professionally trained movers with an average of 7+ years of experience on every team.",
  },
];

export default function ServicesPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-grid hero-gradient">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="accent" className="mb-4">
              Our Services
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Moving services for every need
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              From a studio apartment to a full corporate relocation, Summit Movers has the crew,
              equipment, and experience to get you there. Explore our services and see exactly what
              goes into a seamless move.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/quote">
                  Get a free quote
                  <ArrowRight className="ml-1" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/schedule">View availability</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              What we move
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Six core service categories covering residential, commercial, and everything in
              between.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.key}
                  className="flex flex-col transition-shadow hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{service.label}</CardTitle>
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                          <span className="text-muted-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className="flex items-center justify-between border-t pt-6">
                    <div>
                      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Starting at
                      </span>
                      <div className="font-display text-2xl font-bold text-primary">
                        {formatCurrency(service.priceFrom)}
                        <span className="ml-1 text-sm font-normal text-muted-foreground">
                          {service.priceLabel}
                        </span>
                      </div>
                    </div>
                    <Button asChild variant="accent" size="sm">
                      <Link href="/quote">
                        Get a quote
                        <ArrowRight className="ml-1" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="bg-primary py-16 text-primary-foreground lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge variant="accent" className="mb-4">
              Why Choose Us
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              The Summit difference
            </h2>
            <p className="mt-4 text-lg text-primary-foreground/80">
              Four promises we make on every single move — big or small, local or long distance.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseUs.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 backdrop-blur-sm"
                >
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm text-primary-foreground/75">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 px-6 py-14 text-center shadow-lg sm:px-12">
            <div className="mx-auto max-w-2xl">
              <div className="mb-4 flex items-center justify-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className="h-5 w-5 fill-accent text-accent" />
                ))}
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to make your move?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Get a free, no-obligation quote in minutes. Our team is standing by to help you plan
                the easiest move of your life.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="xl" variant="accent">
                  <Link href="/quote">
                    Get your free quote
                    <ArrowRight className="ml-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="xl"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link href="/reviews">Read customer reviews</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

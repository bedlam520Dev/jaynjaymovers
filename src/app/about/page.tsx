import type { Metadata } from "next";
import Link from "next/link";
import {
  Award,
  ShieldCheck,
  HeartHandshake,
  Building2,
  TrendingUp,
  ArrowRight,
  Star,
  Users,
  MapPin,
  Calendar,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SITE } from "@/lib/constants";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About",
  description: `Meet ${SITE.name} — a licensed, bonded, and insured moving company building stress-free relocations since 2015. Learn about our story, mission, values, and the crew behind 10,000+ successful moves.`,
};

type Stat = {
  value: string;
  label: string;
  icon: React.ElementType;
};

const stats: Stat[] = [
  { value: "10,000+", label: "Moves completed", icon: Truck },
  { value: "9 years", label: "In business", icon: Calendar },
  { value: "4.9/5", label: "Average rating", icon: Star },
  { value: "48 states", label: "Serviced nationwide", icon: MapPin },
];

type Value = {
  title: string;
  description: string;
  icon: React.ElementType;
};

const values: Value[] = [
  {
    title: "Integrity",
    description:
      "We do what we say. Transparent pricing, honest estimates, and no surprise fees — ever. Every promise we make is a promise we keep.",
    icon: ShieldCheck,
  },
  {
    title: "Care",
    description:
      "Your belongings are treated like our own. From heirlooms to everyday items, our crew is trained to handle everything with respect.",
    icon: HeartHandshake,
  },
  {
    title: "Community",
    description:
      "We're proud to call the Midwest home. We support local businesses, hire locally, and give back to the neighborhoods that raised us.",
    icon: Building2,
  },
  {
    title: "Improvement",
    description:
      "We never stop getting better. Every move is a chance to learn, refine our process, and raise the bar for what a moving company can be.",
    icon: TrendingUp,
  },
];

type TeamMember = {
  name: string;
  role: string;
  bio: string;
  image: string;
};

const team: TeamMember[] = [
  {
    name: "Marcus Reid",
    role: "Founder & CEO",
    bio: "Marcus started Summit Movers with a single box truck and a commitment to honest, careful moving. Nine years later, he still personally oversees every long-distance job.",
    image:
      "https://images.pexels.com/photos/2204573/pexels-photo-2204573.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  },
  {
    name: "Elena Vasquez",
    role: "Operations Director",
    bio: "Elena keeps the trucks rolling and the crews on schedule. With a decade in logistics, she's the reason your move starts and ends exactly when we say it will.",
    image:
      "https://images.pexels.com/photos/4158290/pexels-photo-4158290.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  },
  {
    name: "James Okonkwo",
    role: "Lead Mover & Trainer",
    bio: "James has personally completed over 1,200 moves. He trains every new crew member on safe handling, packing, and the Summit standard of care.",
    image:
      "https://images.pexels.com/photos/3748268/pexels-photo-3748268.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  },
  {
    name: "Priya Sharma",
    role: "Customer Experience Lead",
    bio: "Priya makes sure every customer feels supported from the first quote to the final box. She leads our support team and manages our satisfaction guarantee.",
    image:
      "https://images.pexels.com/photos/3756679/pexels-photo-3756679.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop",
  },
];

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero — company story */}
      <section className="relative overflow-hidden bg-grid hero-gradient">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Badge variant="accent" className="mb-4">
                Est. 2015
              </Badge>
              <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                We move people, not just boxes
              </h1>
              <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
                {SITE.name} began in 2015 with one truck, two movers, and a simple
                belief: moving doesn&apos;t have to be miserable. What started as a
                weekend side hustle in {SITE.address.split("—")[0].trim()} has grown
                into a full-service moving company trusted by thousands of families
                and businesses across the country.
              </p>
              <p className="mt-4 text-base text-muted-foreground">
                Nine years later, we&apos;ve completed over 10,000 moves, expanded to
                48 states, and built a crew that treats every customer like a
                neighbor. But the mission hasn&apos;t changed — make moving simple,
                stress-free, and seamless.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg">
                  <Link href="/quote">
                    Get a free quote
                    <ArrowRight className="ml-1" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/services">Explore our services</Link>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="overflow-hidden rounded-2xl border border-border shadow-xl">
                <img
                  src="https://images.pexels.com/photos/2255338/pexels-photo-2255338.jpeg?auto=compress&cs=tinysrgb&w=800"
                  alt="Summit Movers crew carefully loading a moving truck"
                  className="h-full w-full object-cover"
                  loading="eager"
                />
              </div>
              <div className="absolute -bottom-6 -left-6 hidden rounded-xl border border-border bg-card p-4 shadow-lg sm:block">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">
                      Licensed &amp; Insured
                    </p>
                    <p className="text-xs text-muted-foreground">{SITE.license}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Card className="border-border shadow-sm">
            <CardContent className="p-0">
              <div className="grid grid-cols-2 divide-y divide-border sm:grid-cols-4 sm:divide-y-0 sm:divide-x">
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className="flex flex-col items-center gap-2 p-8 text-center"
                    >
                      <div className="mb-1 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="font-display text-3xl font-bold tracking-tight text-foreground">
                        {stat.value}
                      </div>
                      <div className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Badge variant="accent" className="mb-4">
            Our Mission
          </Badge>
          <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Make moving the easiest part of your next chapter
          </h2>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
            Moving is more than transporting things — it&apos;s a transition between
            chapters of life. Our mission is to handle the heavy lifting, the
            logistics, and the stress so you can focus on what comes next. We hold
            ourselves to a simple standard: treat every customer, every belonging,
            and every move with the care we&apos;d want for our own families.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge variant="accent" className="mb-4">
              Our Values
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              What we stand for
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Four principles that guide every estimate, every crew, and every move
              we make.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card
                  key={value.title}
                  className="flex flex-col transition-shadow hover:shadow-lg"
                >
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{value.title}</CardTitle>
                    <CardDescription className="text-base">
                      {value.description}
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <Badge variant="accent" className="mb-4">
              <Users className="mr-1 h-3 w-3" />
              Meet the Team
            </Badge>
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              The people behind the move
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A dedicated crew of movers, planners, and problem-solvers committed to
              making your move seamless.
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member) => (
              <div key={member.name} className="flex flex-col items-center text-center">
                <div className="mb-4 overflow-hidden rounded-full border-4 border-primary/10 shadow-md">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="h-40 w-40 object-cover"
                    loading="lazy"
                  />
                </div>
                <h3 className="font-display text-lg font-semibold text-foreground">
                  {member.name}
                </h3>
                <p className="text-sm font-medium text-accent">{member.role}</p>
                <p className="mt-3 text-sm text-muted-foreground">{member.bio}</p>
              </div>
            ))}
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
              <div className="mb-4 flex items-center justify-center gap-1">
                <Award className="h-5 w-5 text-accent" />
                <span className="text-sm font-medium uppercase tracking-wide text-accent">
                  Award-winning service
                </span>
              </div>
              <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Ready to experience the Summit difference?
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Join the thousands of families and businesses who&apos;ve trusted us
                with their next chapter. Get a free, no-obligation quote in minutes.
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
                  className={cn(
                    "border-primary-foreground/30 bg-transparent text-primary-foreground",
                    "hover:bg-primary-foreground/10",
                  )}
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

import { HeroBackground } from '@/components/hero-background';
import { Container, Section, Grid, Stack } from '@/components/layout';
import { StarRating } from '@/components/star-rating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { TruckIcon } from '@/components/ui/truck';
import {
  SITE,
  HERO_IMAGE,
  PRICING,
  STATS,
  SERVICES,
  HOME_STEPS,
  REVIEW_SOURCE_VARIANT,
  REVIEW_SOURCE_LABELS,
} from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';
import { formatCurrency, timeAgo } from '@/lib/utils';
import type { Review } from '@/types';
import { ArrowRight, Star, Shield, CheckCircle2, Quote } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';

const QUERY_TIMEOUT = 4000;

async function fetchReviews() {
  const supabase = await createClient();
  const result = await Promise.race([
    supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3),
    new Promise<{ data: null; error: Error }>((resolve) =>
      setTimeout(
        () => resolve({ data: null, error: new Error('timeout') }),
        QUERY_TIMEOUT
      )
    ),
  ]);
  return result;
}

async function ReviewsSection() {
  const { data: reviews } = await fetchReviews();
  const topReviews = (reviews ?? []) as Review[];

  return (
    <Section padding='lg'>
      <Container size='xl'>
        <div className='flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end'>
          <div className='max-w-2xl'>
            <Badge
              variant='accent'
              className='font-heading mb-4'
            >
              Customer stories
            </Badge>
            <h2 className='font-heading text-foreground/80 text-3xl font-bold tracking-tight text-balance sm:text-4xl shadow-glow'>
              Loved by 2,500+ happy movers
            </h2>
            <p className='text-foreground/80 mt-4 font-sans text-lg'>
              Real reviews from real customers across Google, Yelp, and Trust Advisor.
            </p>
          </div>
          <Button
            variant='outline'
            className='font-sans'
            render={<Link href='/reviews' />}
            nativeButton={false}
          >
            Read all reviews
            <ArrowRight className='h-4 w-4' />
          </Button>
        </div>
        <Grid
          cols={{ base: 1, sm: 2, lg: 3 }}
          gap='lg'
          className='mt-12 font-sans'
        >
          {topReviews.map((review) => {
            const SourceIcon = review.source === 'google' ? Star : Quote;
            return (
              <Card
                key={review.id}
                className='panel-retro flex flex-col'
              >
                <CardHeader>
                  <div className='flex items-center justify-between'>
                    <Quote className='text-accent/40 h-8 w-8 font-mono' />
                    <Badge
                      variant={REVIEW_SOURCE_VARIANT[review.source] ?? 'outline'}
                      className='gap-1.5 font-mono'
                    >
                      <SourceIcon className='h-3 w-3' />
                      {REVIEW_SOURCE_LABELS[review.source] ?? review.source}
                    </Badge>
                  </div>
                  <StarRating
                    rating={review.rating}
                    size='md'
                    className='mt-2 font-sans'
                  />
                </CardHeader>
                <CardContent className='flex-1'>
                  <p className='text-muted-foreground font-mono text-sm leading-relaxed'>
                    &ldquo;{review.text}&rdquo;
                  </p>
                </CardContent>
                <CardFooter>
                  <div className='flex items-center gap-3 font-mono'>
                    <Image
                      src={review.author_avatar}
                      alt={review.author_name}
                      height={100}
                      width={100}
                      className='h-10 w-10 rounded-full object-cover'
                      loading='lazy'
                    />
                    <div>
                      <p className='font-mono text-sm font-semibold'>
                        {review.author_name}
                      </p>
                      <p className='text-muted-foreground font-mono text-xs'>
                        {timeAgo(review.created_at)}
                      </p>
                    </div>
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </Grid>
      </Container>
    </Section>
  );
}

function ReviewsFallback() {
  return (
    <Section padding='lg'>
      <Container size='xl'>
        <div className='flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end'>
          <div className='max-w-2xl'>
            <div className='bg-muted h-5 w-28 rounded' />
            <div className='bg-muted mt-4 h-8 w-72 rounded' />
            <div className='bg-muted mt-4 h-5 w-96 rounded' />
          </div>
          <div className='bg-muted h-10 w-36 rounded' />
        </div>
        <Grid
          cols={{ base: 1, sm: 2, lg: 3 }}
          gap='lg'
          className='mt-12 font-sans'
        >
          {[1, 2, 3].map((i) => (
            <Card
              key={i}
              className='flex flex-col animate-pulse'
            >
              <CardHeader>
                <div className='bg-muted h-8 w-8 rounded' />
                <div className='bg-muted mt-2 h-4 w-24 rounded' />
              </CardHeader>
              <CardContent className='flex-1'>
                <div className='bg-muted h-16 w-full rounded' />
              </CardContent>
              <CardFooter>
                <div className='flex items-center gap-3'>
                  <div className='bg-muted h-10 w-10 rounded-full' />
                  <div>
                    <div className='bg-muted h-4 w-20 rounded' />
                    <div className='bg-muted mt-1 h-3 w-16 rounded' />
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </Grid>
      </Container>
    </Section>
  );
}

export default function Home() {
  return (
    <div>
      <HeroBackground />
      <div>
        <section className='relative'>
          <Container
            size='xl'
            className='py-16 md:py-24 lg:py-28'
          >
            <Grid
              cols={{ base: 1, md: 2 }}
              gap='lg'
              className='items-center'
            >
              <Stack gap='lg'>
                <Badge
                  variant='accent'
                  className='shadow-glow gap-3 py-3 pr-4 pl-3 text-md border-primary/40 border-2 border-inset'
                >
                  <Shield className='h-6 w-6' />
                  Licensed · Bonded · Insured
                </Badge>
                <h1 className='font-heading text-fluid-4xl leading-tight font-extrabold tracking-tight text-balance shadow-glow-strong sm:text-fluid-5xl lg:text-fluid-6xl'>
                  Moving made simple and stress-free..
                </h1>
                <p className='text-primary-foreground/80 max-w-xl font-sans text-fluid-lg'>
                  {SITE.name} - Providing reliable moving services since 2019.
                </p>
                <div className='flex items-center gap-3'>
                  <StarRating
                    rating={5}
                    size='lg'
                  />
                  <span className='text-primary-foreground/90 font-mono text-fluid-sm font-medium'>
                    4.9/5 from 2,500+ moves
                  </span>
                </div>
                <Stack
                  gap='sm'
                  className='@md:flex-row'
                >
                  <Button
                    size='lg'
                    className='bg-success/40 border-success/80 text-foreground/80 hover:bg-success/20 border-2 border-inset'
                    render={<Link href='/quote' />}
                    nativeButton={false}
                  >
                    Get a Free Quote
                    <ArrowRight className='h-5 w-5' />
                  </Button>
                  <Button
                    size='lg'
                    className='bg-accent/20 text-foreground/80 border-accent/40 hover:bg-accent/10 border-2 border-inset'
                    render={<Link href='/schedule' />}
                    nativeButton={false}
                  >
                    Schedule a Move
                  </Button>
                </Stack>
                <div className='text-primary-foreground/70 flex flex-wrap items-center gap-x-6 gap-y-3 font-sans text-sm'>
                  <span className='flex items-center gap-2'>
                    <CheckCircle2 className='text-accent h-4 w-4' />
                    No hidden fees
                  </span>
                  <span className='flex items-center gap-2'>
                    <CheckCircle2 className='text-accent h-4 w-4' />
                    Free instant quotes
                  </span>
                  <span className='flex items-center gap-2'>
                    <CheckCircle2 className='text-accent h-4 w-4' />
                    {SITE.license}
                  </span>
                </div>
              </Stack>
              <div className='relative'>
                <div className='border-primary-foreground/20 relative overflow-hidden rounded-2xl border shadow-2xl'>
                  <Image
                    {...HERO_IMAGE}
                    className='h-[320px] w-full object-cover sm:h-140 lg:h-[520px]'
                    priority
                  />
                  <div className='from-primary/60 absolute inset-0 bg-linear-to-t via-transparent to-transparent' />
                </div>
                <div className='absolute -bottom-6 -left-4 hidden sm:block'>
                  <Card className='panel-retro w-64 border-none'>
                    <CardContent className='p-5'>
                      <div className='flex items-center justify-between'>
                        <span className='text-muted-foreground font-sans text-sm font-medium'>
                          Starting at
                        </span>
                        <Badge
                          variant='accent'
                          className='font-mono text-xs'
                        >
                          Hourly
                        </Badge>
                      </div>
                      <p className='text-primary mt-1 font-sans text-3xl font-bold'>
                        {formatCurrency(PRICING.baseHourly)}
                        <span className='text-muted-foreground font-mono text-base font-normal'>
                          /hr
                        </span>
                      </p>
                      <p className='text-muted-foreground mt-1 font-mono text-xs'>
                        2-mover crew · truck included
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </Grid>
          </Container>
        </section>
      </div>
      <section className='border-border bg-card border-y'>
        <Container size='xl'>
          <Grid
            cols={{ base: 2, lg: 4 }}
            className='divide-border divide-x'
          >
            {STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className='flex flex-col items-center gap-2 px-4 py-8 text-center md:py-10'
              >
                <div className='bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full font-mono'>
                  <Icon className='h-6 w-6' />
                </div>
                <p className='font-display text-foreground text-2xl font-bold tracking-tight md:text-3xl'>
                  {value}
                </p>
                <p className='text-muted-foreground font-mono text-sm'>{label}</p>
              </div>
            ))}
          </Grid>
        </Container>
      </section>
      <Section padding='lg'>
        <Container size='xl'>
          <div className='mx-auto max-w-2xl text-center'>
            <Badge
              variant='accent'
              className='font-heading mb-4'
            >
              What we do
            </Badge>
            <h2 className='font-heading text-foreground/80 text-3xl font-bold tracking-tight text-balance sm:text-4xl shadow-glow'>
              Moving services for every situation
            </h2>
            <p className='text-foreground/80 mt-4 font-sans text-lg'>
              From studio apartments to full office relocations, we have a crew, a
              truck, and a plan for you.
            </p>
          </div>
          <Grid
            cols={{ base: 1, sm: 2, lg: 3 }}
            gap='lg'
            className='font-mono'
          >
            {SERVICES.map(
              ({ icon: Icon, key, title, description, price, features }) => (
                <Card
                  key={key}
                  className='panel-retro group flex flex-col transition-all hover:-translate-y-1'
                >
                  <CardHeader>
                    <div className='bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground flex h-12 w-12 items-center justify-center rounded-xl font-sans transition-colors'>
                      <Icon className='h-6 w-6' />
                    </div>
                    <CardTitle className='mt-4 text-xl'>{title}</CardTitle>
                  </CardHeader>
                  <CardContent className='flex-1'>
                    <p className='text-muted-foreground font-sans text-sm'>
                      {description}
                    </p>
                    <ul className='mt-4 space-y-2'>
                      {features.map((feature) => (
                        <li
                          key={feature}
                          className='text-muted-foreground flex items-start gap-2 font-mono text-sm'
                        >
                          <CheckCircle2 className='text-accent mt-0.5 h-4 w-4 shrink-0' />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className='flex items-center justify-between'>
                    <div>
                      <span className='text-muted-foreground font-mono text-xs'>
                        {key === 'long_distance'
                          ? 'Per mile'
                          : key === 'storage'
                            ? 'Per month'
                            : 'Starting at'}
                      </span>
                      <p className='text-primary font-sans text-lg font-bold'>
                        {formatCurrency(price)}
                      </p>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-primary font-sans'
                      render={<Link href={`/services#${key}`} />}
                      nativeButton={false}
                    >
                      Learn more
                      <ArrowRight className='h-4 w-4' />
                    </Button>
                  </CardFooter>
                </Card>
              )
            )}
          </Grid>
        </Container>
      </Section>
      <Section
        padding='lg'
        background='transparent'
      >
        <Container size='xl'>
          <div className='mx-auto max-w-2xl text-center'>
            <Badge
              variant='accent'
              className='font-heading mb-4'
            >
              How it works
            </Badge>
            <h2 className='font-heading text-foreground/80 text-3xl font-bold tracking-tight text-balance sm:text-4xl shadow-glow'>
              Four steps from quote to moved-in
            </h2>
            <p className='text-foreground/80 mt-4 font-sans text-lg'>
              We have refined the moving process down to its simplest form. Here is
              exactly what to expect.
            </p>
          </div>
          <Grid
            cols={{ base: 1, sm: 2, lg: 4 }}
            gap='lg'
            className='mt-12 font-sans'
          >
            {HOME_STEPS.map(({ icon: Icon, title, description }, index) => (
              <div
                key={title}
                className='relative flex flex-col items-start'
              >
                {index < HOME_STEPS.length - 1 && (
                  <div className='bg-border absolute top-14 left-7 hidden h-px w-[calc(100%-2rem)] lg:block' />
                )}
                <div className='bg-primary text-primary-foreground relative z-10 flex h-14 w-14 items-center justify-center rounded-full font-sans shadow-md'>
                  <Icon className='h-6 w-6' />
                </div>
                <span className='text-accent mt-4 font-mono text-sm font-semibold tracking-wide uppercase'>
                  Step {index + 1}
                </span>
                <h3 className='mt-1 font-sans text-xl font-bold'>{title}</h3>
                <p className='text-muted-foreground mt-2 font-mono text-sm'>
                  {description}
                </p>
              </div>
            ))}
          </Grid>
          <div className='font-heading mt-12 text-center'>
            <Button
              size='lg'
              className='bg-success/40 border-success/80 border-2 border-inset text-foreground/80 hover:bg-success/20'
              render={<Link href='/quote' />}
              nativeButton={false}
            >
              Start your free quote
              <ArrowRight className='h-4 w-4' />
            </Button>
          </div>
        </Container>
      </Section>
      <Suspense fallback={<ReviewsFallback />}>
        <ReviewsSection />
      </Suspense>
      <Section padding='lg'>
        <Container size='xl'>
          <div className='panel-retro relative overflow-hidden px-6 py-14 text-center md:px-12 md:py-20'>
            <div className='bg-accent/20 absolute -top-20 -right-20 h-72 w-72 rounded-full blur-3xl' />
            <div className='bg-accent/10 absolute -bottom-24 -left-16 h-72 w-72 rounded-full blur-3xl' />
            <div className='bg-grid absolute inset-0 opacity-[0.07]' />
            <div className='text-foreground/80 relative flex flex-col items-center text-center'>
              <Badge
                variant='accent'
                className='font-heading mb-5 gap-1.5'
              >
                <TruckIcon className='h-3.5 w-3.5' />
                Ready when you are
              </Badge>
              <h2 className='font-heading max-w-3xl text-3xl font-extrabold tracking-tight text-balance sm:text-4xl lg:text-5xl shadow-glow'>
                Let&apos;s make your next move your best move
              </h2>
              <p className='text-foreground/80 mt-5 max-w-xl font-sans text-lg'>
                Get a free, no-obligation quote in under two minutes. Transparent
                pricing, guaranteed dates, and a crew you can trust.
              </p>
              <Stack
                gap='sm'
                className='mt-9 font-sans @md:flex-row'
              >
                <Button
                  size='lg'
                  className='bg-success/40 border-success/80 border-2 border-inset text-foreground/80 hover:bg-success/20'
                  render={<Link href='/quote' />}
                  nativeButton={false}
                >
                  Get a Free Quote
                  <ArrowRight className='h-5 w-5' />
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className='bg-accent/20 text-foreground/80 border-accent/40 hover:bg-accent/10 border-2 border-inset'
                  render={<Link href='/schedule' />}
                  nativeButton={false}
                >
                  Schedule a Move
                </Button>
              </Stack>
              <p className='text-foreground/60 mt-6 font-sans text-sm'>
                Or call us at{' '}
                <a
                  href={`tel:${SITE.phone.replace(/[^0-9+]/g, '')}`}
                  className='text-foreground font-mono font-medium underline-offset-4 hover:underline'
                >
                  {SITE.phone}
                </a>
              </p>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

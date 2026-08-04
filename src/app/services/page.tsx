import { Container, Section, Grid, Stack } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { ArrowRightIcon } from '@/components/ui/lucide-animated/arrow-right';
import { FilePenLineIcon } from '@/components/ui/lucide-animated/file-pen-line';
import { services, whyChooseUs } from '@/lib/constants';
import { formatCurrency } from '@/lib/utils';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Services',
  description:
    "Explore Jay `N Jay Movers' full range of professional moving services — residential, commercial, long distance, packing, storage, and specialty item moves. Licensed, bonded, and insured.",
};

export default function ServicesPage() {
  return (
    <div className='animate-fade-in'>
      <Section
        padding='xl'
        background='transparent'
      >
        <Container size='xl'>
          <div className='font-heading mx-auto max-w-3xl text-center'>
            <Badge
              variant='accent'
              className='font-heading mb-4'
            >
              Our Services
            </Badge>
            <h1 className='font-heading text-foreground text-4xl font-bold tracking-tight shadow-glow-strong sm:text-5xl lg:text-6xl'>
              Moving services for every need
            </h1>
            <p className='text-muted-foreground mt-6 font-sans text-lg sm:text-xl'>
              From a studio apartment to a full corporate relocation, Jay `N Jay Movers
              has the crew, equipment, and experience to get you there. Explore our
              services and see exactly what goes into a seamless move.
            </p>
            <Stack
              gap='sm'
              className='mt-8 @md:flex-row'
            >
              <Button
                size='lg'
                className='bg-success/40 border-success/80 text-foreground/80 hover:bg-success/20 border-2 border-inset'
                render={<Link href='/quote' />}
                nativeButton={false}
              >
                Get a free quote
                <ArrowRightIcon className='ml-1' />
              </Button>
              <Button
                size='lg'
                variant='outline'
                className='bg-accent/20 text-foreground/80 border-accent/40 hover:bg-accent/10 border-2 border-inset'
                render={<Link href='/schedule' />}
                nativeButton={false}
              >
                View availability
              </Button>
            </Stack>
          </div>
        </Container>
      </Section>
      <Section padding='lg'>
        <Container size='xl'>
          <div className='mx-auto mb-14 max-w-2xl text-center'>
            <h2 className='font-heading text-foreground text-3xl font-bold tracking-tight shadow-glow sm:text-4xl'>
              What we move
            </h2>
            <p className='text-muted-foreground mt-4 font-sans text-lg'>
              Six core service categories covering residential, commercial, and
              everything in between.
            </p>
          </div>
          <Grid
            cols={{ base: 1, sm: 2, lg: 3 }}
            gap='lg'
            className='font-mono'
          >
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Card
                  key={service.key}
                  className='panel-retro flex flex-col transition-all hover:-translate-y-1'
                >
                  <CardHeader>
                    <div className='bg-primary/10 text-primary mb-2 flex h-12 w-12 items-center justify-center rounded-lg'>
                      <Icon className='h-6 w-6' />
                    </div>
                    <CardTitle className='text-xl'>{service.label}</CardTitle>
                    <CardDescription className='text-base'>
                      {service.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='flex-1'>
                    <ul className='space-y-2'>
                      {service.features.map((feature) => (
                        <li
                          key={feature}
                          className='flex items-start gap-2 text-sm'
                        >
                          <Icon className='text-accent mt-0.5 h-4 w-4 shrink-0' />
                          <span className='text-muted-foreground'>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter className='flex items-center justify-between border-t pt-6'>
                    <div>
                      <span className='text-muted-foreground text-xs font-medium tracking-wide uppercase'>
                        Starting at
                      </span>
                      <div className='font-display text-primary text-2xl font-bold'>
                        {formatCurrency(service.priceFrom)}
                        <span className='text-muted-foreground ml-1 text-sm font-normal'>
                          {service.priceLabel}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant='outline'
                      size='sm'
                      render={<Link href='/quote' />}
                      nativeButton={false}
                    >
                      Get a quote
                      <Icon className='ml-1' />
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </Grid>
        </Container>
      </Section>
      <Section
        padding='lg'
        background='transparent'
      >
        <Container size='xl'>
          <div className='mx-auto mb-14 max-w-2xl text-center'>
            <Badge
              variant='accent'
              className='font-heading mb-4'
            >
              Why Choose Us
            </Badge>
            <h2 className='font-heading text-foreground text-3xl font-bold tracking-tight shadow-glow'>
              The Jay &apos;N Jay difference
            </h2>
            <p className='text-foreground/80 mt-4 font-sans text-lg'>
              Four promises we make on every single move — big or small, local or long
              distance.
            </p>
          </div>
          <Grid
            cols={{ base: 1, sm: 2, lg: 4 }}
            gap='lg'
            className='font-mono'
          >
            {whyChooseUs.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className='panel-retro p-6 font-sans'
                >
                  <div className='bg-accent text-accent-foreground mb-4 flex h-12 w-12 items-center justify-center rounded-lg'>
                    <Icon className='h-6 w-6' />
                  </div>
                  <h3 className='font-display text-lg font-semibold'>{item.title}</h3>
                  <p className='text-muted-foreground mt-2 text-sm'>
                    {item.description}
                  </p>
                </div>
              );
            })}
          </Grid>
        </Container>
      </Section>
      <Section padding='lg'>
        <Container size='xl'>
          <div className='relative w-300 mx-auto overflow-hidden bg-background/40 border-4 border-inset border-primary/40 rounded-xl shadow-glow px-6 py-14 text-center shadow-lg sm:px-12'>
            <div className='mx-auto max-w-2xl'>
              <FilePenLineIcon className='text-accent mx-auto mb-4 h-10 w-10' />
              <h2 className='font-heading text-accent/80 text-3xl font-bold tracking-tight sm:text-4xl'>
                Share your experience
              </h2>
              <p className='text-foreground/80 mt-4 font-sans text-lg'>
                Moved with us recently? We would love to hear how it went. Sign in to
                leave a review and help other families find a mover they can trust.
              </p>
              <Stack
                gap='sm'
                className='mt-8 @md:flex-row mx-auto align-center justify-center max-w-2xl'
              >
                <Button
                  size='lg'
                  variant='default'
                  className='text-xl border-accent/40 bg-accent/20 text-foreground/80 hover:bg-accent/10 p-3 sm:px-4 sm:py-3'
                  render={<Link href='/auth/login' />}
                  nativeButton={false}
                >
                  Sign in to write a review
                  <ArrowRightIcon className='ml-1' />
                </Button>
                <Button
                  size='lg'
                  variant='default'
                  className='text-xl border-accent/40 bg-accent/20 text-foreground/80 hover:bg-accent/10 p-3 sm:px-4 sm:py-3'
                  render={<Link href='/quote' />}
                  nativeButton={false}
                >
                  Get a quote instead
                </Button>
              </Stack>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

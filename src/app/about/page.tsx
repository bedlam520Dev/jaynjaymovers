import { Container, Section, Grid, Stack } from '@/components/layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import { SITE, LOGO, HERO_IMAGE, stats, values, team } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Award, ShieldCheck, ArrowRight, Star, Users } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About',
  description: `Meet ${SITE.name}`,
};

export default function AboutPage() {
  return (
    <div className='animate-fade-in'>
      <Section
        padding='lg'
        background='transparent'
      >
        <Container size='xl'>
          <Grid
            cols={{ base: 1, md: 2 }}
            gap='lg'
            className='items-center'
          >
            <Stack gap='lg'>
              <div className='relative'>
                <Badge
                  variant='accent'
                  className='-top-10 left-4 relative font-heading text-[1rem]  py-4 px-3 mx-auto w-auto h-auto mb-1 border-4 border-inset border-background/80 drop-shadow-lg text-background/80 sm:text-[1rem] md:text-[2rem] lg:text-[2rem] xl:text-[2rem]'
                >
                  Est. 2019
                </Badge>
              </div>
              <div className='relative'>
                <h1 className='font-heading text-foreground text-[1rem] font-bold tracking-tight sm:text-[1rem] md:text-[2rem] lg:text-[2rem] xl:text-[2rem]'>
                  We move people, not just boxes..
                </h1>
                <p className='text-muted-foreground mt-3 font-sans text-fluid-lg sm:text-fluid-xl'>
                  We are {SITE.name} — a licensed, bonded, and insured moving company
                  building stress-free relocations since 2019. Learn about our story,
                  mission, values, and the crew behind thousands of successful moves.
                </p>
                <p className='text-muted-foreground mt-4 font-sans text-base'>
                  Planning to relocate in the area? Moving can be a real challenge,
                  whether it&apos;s across town or just a few blocks away.
                </p>
                <p className='text-muted-foreground mt-4 font-sans text-base'>
                  We understand how stressful it can be to pack, lift heavy furniture,
                  and get everything from one place to another safely. We are a small,
                  experienced team, that focuses on careful handling, clear
                  communication, and respectful service from start to finish.
                </p>
                <p className='text-muted-foreground mt-4 font-sans text-base'>
                  We offer local moving (under 50 miles), furniture moving and heavy
                  lifting, as well as light junk removal to help simplify your move any
                  way we can. Reach out today and let Jay &apos;N Jay Movers make your
                  relocation smoother and less stressful.
                </p>
                <Stack
                  gap='sm'
                  className='font-heading @md:flex-row'
                >
                  <Button
                    size='lg'
                    render={<Link href='/quote' />}
                    nativeButton={false}
                  >
                    Get a free quote!
                    <ArrowRight className='ml-1' />
                  </Button>
                  <Button
                    size='lg'
                    variant='outline'
                    render={<Link href='/services' />}
                    nativeButton={false}
                  >
                    Explore our services
                  </Button>
                </Stack>
              </div>
            </Stack>
            <div className='relative p-10'>
              <div className='border-border overflow-hidden rounded-2xl border shadow-xl'>
                <Image
                  {...HERO_IMAGE}
                  className='h-full w-full object-cover'
                />
              </div>
              <div className='border-border bg-card absolute -bottom-6 -left-6 hidden rounded-xl border p-4 shadow-lg sm:block'>
                <div className='flex items-center gap-3'>
                  <div className='bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-lg'>
                    <Award className='h-6 w-6' />
                  </div>
                  <div>
                    <p className='text-foreground font-mono text-sm font-semibold'>
                      Licensed &amp; Insured
                    </p>
                    <p className='text-muted-foreground font-mono text-xs'>
                      {SITE.license}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Grid>
        </Container>
      </Section>
      <Section padding='lg'>
        <Container size='xl'>
          <Card className='border-border shadow-sm'>
            <CardContent className='p-0'>
              <Grid
                cols={{ base: 2, sm: 4 }}
                className='divide-border divide-y sm:divide-x sm:divide-y-0'
              >
                {stats.map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <div
                      key={stat.label}
                      className='flex flex-col items-center gap-2 p-8 text-center font-sans'
                    >
                      <div className='bg-primary/10 text-primary mb-1 flex h-12 w-12 items-center justify-center rounded-lg'>
                        <Icon className='h-6 w-6' />
                      </div>
                      <div className='font-display text-foreground text-3xl font-bold tracking-tight'>
                        {stat.value}
                      </div>
                      <div className='text-muted-foreground text-sm font-medium tracking-wide uppercase'>
                        {stat.label}
                      </div>
                    </div>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Container>
      </Section>
      <Section padding='lg'>
        <Container size='xl'>
          <div className='mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8'>
            <Badge
              variant='accent'
              className='font-heading mb-4'
            >
              Our Mission
            </Badge>
            <h2 className='text-foreground font-sans text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl'>
              Make moving the easiest part of your next chapter
            </h2>
            <p className='text-muted-foreground mt-6 font-sans text-lg sm:text-xl'>
              There&apos;s no doubt about it, moving can be a pain. We get how stressful
              it can be to plan a relocation, even over a short distance. We take away
              the worrying you face about belongings becoming lost or damaged. If
              you&apos;d prefer a more efficient, faster, and easier move, it pays to
              hire one. That&apos;s when we come in taking all the weight off your
              shoulders. Our movers can help you with every detail of your move to make
              the transition painless and stress-free. You don&apos;t need to stress
              about making sure there&apos;s enough time to get everything loaded, the
              physical strain of moving all of your belongings, or even recruiting
              everyone you know into pitching in. Our experienced, trained movers will
              show up on time to handle everything in an organized and efficient manner.
            </p>
          </div>
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
              Our Values
            </Badge>
            <h2 className='text-foreground font-sans text-3xl font-bold tracking-tight sm:text-4xl'>
              What we stand for..
            </h2>
            <p className='text-muted-foreground mt-4 font-sans text-lg'>
              Four principles that guide every estimate, every crew, and every move we
              make.
            </p>
          </div>
          <Grid
            cols={{ base: 1, sm: 2, lg: 4 }}
            gap='lg'
            className='font-sans'
          >
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card
                  key={value.title}
                  className='flex flex-col transition-shadow hover:shadow-lg'
                >
                  <CardHeader>
                    <div className='bg-primary/10 text-primary mb-2 flex h-12 w-12 items-center justify-center rounded-lg'>
                      <Icon className='h-6 w-6' />
                    </div>
                    <CardTitle className='text-xl'>{value.title}</CardTitle>
                    <CardDescription className='text-base'>
                      {value.description}.
                    </CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </Grid>
        </Container>
      </Section>
      <Section padding='lg'>
        <Container size='xl'>
          <div className='mx-auto mb-14 max-w-2xl text-center'>
            <Badge
              variant='accent'
              className='mb-4'
            >
              <Users className='font-heading mr-1 h-3 w-3' />
              Meet the Team
            </Badge>
            <h2 className='text-foreground font-sans text-3xl font-bold tracking-tight sm:text-4xl'>
              The people behind the move
            </h2>
            <p className='text-muted-foreground mt-4 font-sans text-lg'>
              A dedicated crew of movers, planners, and problem-solvers committed to
              making your move seamless. Jay &apos;N Jay Movers services have been up
              and running since 2019. We are young strong men starting a business to
              stay busy, and to help our community.
            </p>
          </div>
          <Grid
            cols={{ base: 1, sm: 2, lg: 4 }}
            gap='lg'
            className='font-sans'
          >
            {team.map((member) => (
              <div
                key={member.name}
                className='flex flex-col items-center text-center'
              >
                <div className='border-primary/10 mb-4 overflow-hidden rounded-full border-4 shadow-md'>
                  <Image
                    src={member.image}
                    alt={member.name}
                    className='h-40 w-40 object-cover'
                    loading='eager'
                    height={LOGO.height}
                    width={LOGO.width}
                  />
                  <ShieldCheck className='text-primary mb-2 h-5 w-5' />
                </div>
                <h3 className='font-display text-foreground text-lg font-semibold'>
                  {member.name}
                </h3>
                <p className='text-accent text-sm font-medium'>{member.role}</p>
                <p className='text-muted-foreground mt-3 text-sm'>{member.bio}</p>
              </div>
            ))}
          </Grid>
        </Container>
      </Section>
      <Section padding='lg'>
        <Container size='xl'>
          <div className='from-primary to-primary/80 relative overflow-hidden rounded-2xl bg-linear-to-br px-6 py-14 text-center shadow-lg sm:px-12'>
            <div className='mx-auto max-w-2xl'>
              <div className='mb-4 flex items-center justify-center gap-1'>
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className='fill-accent text-accent h-5 w-5'
                  />
                ))}
              </div>
              <div className='mb-4 flex items-center justify-center gap-1'>
                <Award className='text-accent h-5 w-5' />
                <span className='text-accent font-heading text-sm tracking-wide uppercase'>
                  Award-winning service
                </span>
              </div>
              <h2 className='text-primary-foreground font-sans text-3xl font-bold tracking-tight sm:text-4xl'>
                Ready to experience the Jay &apos;N Jay difference?
              </h2>
              <p className='text-primary-foreground/80 mt-4 font-sans text-lg'>
                Join the thousands of families and businesses who&apos;ve trusted us
                with their next chapter. Get a free, no-obligation quote in minutes.
              </p>
              <Stack
                gap='sm'
                className='mt-8 @md:flex-row'
              >
                <Button
                  size='lg'
                  variant='outline'
                  className='font-heading'
                  render={<Link href='/quote' />}
                  nativeButton={false}
                >
                  Get your free quote!
                  <ArrowRight className='ml-1' />
                </Button>
                <Button
                  size='lg'
                  variant='outline'
                  className={cn(
                    'font-heading border-primary-foreground/30 text-primary-foreground bg-transparent',
                    'hover:bg-primary-foreground/10'
                  )}
                  render={<Link href='/reviews' />}
                  nativeButton={false}
                >
                  Read customer reviews
                </Button>
              </Stack>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}

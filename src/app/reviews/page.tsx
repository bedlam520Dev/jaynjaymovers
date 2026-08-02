import { Container, Section, Grid, Stack } from '@/components/layout';
import { StarRating } from '@/components/star-rating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { REVIEW_SOURCE_LABELS, sourceOrder } from '@/lib/constants';
import { createClient } from '@/lib/supabase/server';
import { timeAgo } from '@/lib/utils';
import type { Review } from '@/types';
import { Star, ExternalLink, ArrowRight, PenLine } from 'lucide-react';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Reviews',
  description:
    'Read authentic customer reviews for Jay `N Jay Movers from Google, Yelp, Trust Advisor, and our own site. See why families and businesses trust us with their moves.',
};

export default async function ReviewsPage() {
  const supabase = await createClient();
  const { data: reviewsData } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });
  const isReview = (value: unknown): value is Review => {
    if (typeof value !== 'object' || value === null) return false;
    const requiredKeys: Array<keyof Review> = ['id', 'rating', 'text', 'author_name'];
    return requiredKeys.every((key) => key in value);
  };
  const reviews: Review[] = (reviewsData ?? []).filter(isReview);

  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;

  const sourceBreakdown = reviews.reduce(
    (acc, review) => {
      acc[review.source] = (acc[review.source] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const sortedSources = Object.entries(sourceBreakdown).sort(
    ([a], [b]) => (sourceOrder[a] ?? 99) - (sourceOrder[b] ?? 99)
  );

  return (
    <div className='animate-fade-in mt-2 mb-10 w-80vw sm:mt-4 sm:mb-12 sm:w-90vw md:mt-6 md:mb-16 lg:mt-8 lg:mb-20 xl:mt-10 xl:mb-24 p-4'>
      <div className='font-heading mx-auto max-w-5xl text-center bg-background/30 border-2 border-background/30 rounded-xl shadow-glow px-3'>
        <Section
          padding='xl'
          background='transparent'
        >
          <Container size='xl'>
            <div>
              <Badge
                variant='accent'
                className='-mt-12 mb-12 text-[1rem] sm:text-[1.5rem] md:text-[2rem] lg:text-[2.5rem] xl:text-[3rem] font-heading font-bold tracking-tight text-background/80 border-4 border-inset border-background/80 drop-shadow-lg py-3 px-4 mx-auto w-auto h-auto'
              >
                Customer Reviews
              </Badge>
              <h1 className='font-heading text-foreground/80 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl'>
                Don&apos;t take our word for it
              </h1>
              <p className='text-foreground/80 mt-6 w-160 mx-auto font-sans text-lg sm:text-xl'>
                Real reviews from real customers across Google, Yelp, Trust Advisor, and
                our own site. We are proud of every star — and we learn from every piece
                of feedback.
              </p>
            </div>
            <div className='mx-auto mt-12 max-w-2xl'>
              <Card className='shadow-md bg-background/40 border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
                <CardContent className='p-6 font-mono sm:p-8'>
                  <div className='flex flex-col items-center gap-6 sm:flex-row sm:items-stretch sm:justify-between'>
                    <div className='flex flex-col items-center justify-center text-center'>
                      <p className='font-display text-primary text-5xl font-bold'>
                        {averageRating.toFixed(1)}
                      </p>
                      <StarRating
                        rating={Math.round(averageRating)}
                        size='lg'
                        className='mt-2'
                      />
                      <p className='text-foreground/80 mt-2 font-sans text-sm'>
                        Based on {totalReviews} reviews
                      </p>
                    </div>
                    <div className='bg-border hidden w-px self-stretch sm:block' />
                    <div className='flex-1 space-y-2'>
                      {sortedSources.map(([source, count]) => (
                        <div
                          key={source}
                          className='flex items-center justify-between gap-4'
                        >
                          <div className='flex items-center gap-2'>
                            <Star className='fill-accent text-accent h-4 w-4' />
                            <span className='text-foreground/80 text-sm font-medium'>
                              {REVIEW_SOURCE_LABELS[source] ?? source}
                            </span>
                          </div>
                          <span className='text-foreground/80 text-sm font-semibold'>
                            {count} {count === 1 ? 'review' : 'reviews'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Container>
        </Section>
        <Section padding='lg'>
          <Container size='xl'>
            <div className='w-200 mb-2 p-6 mx-auto text-center bg-background/40 border-4 border-inset border-primary/40 rounded-xl shadow-glow'>
              <h2 className='font-heading text-foreground/80 text-3xl font-bold tracking-tight sm:text-4xl'>
                What customers are saying
              </h2>
              <p className='text-foreground/80 mt-4 font-sans text-lg'>
                {totalReviews} verified reviews from across the web
              </p>
            </div>
            <Grid
              cols={{ base: 1, sm: 2, lg: 3 }}
              gap='lg'
            >
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className='flex flex-col font-mono transition-shadow hover:shadow-lg bg-background/40 border-4 border-inset border-primary/40 rounded-xl shadow-glow'
                >
                  <CardHeader>
                    <div className='flex items-start gap-3'>
                      <Image
                        src={review.author_avatar}
                        alt={review.author_name}
                        height={100}
                        width={100}
                        className='h-12 w-12 rounded-full object-cover'
                        loading='lazy'
                      />
                      <div className='flex-1'>
                        <div className='flex items-center justify-between gap-2'>
                          <CardTitle className='text-base text-accent/80'>
                            {review.author_name}
                          </CardTitle>
                          <Badge
                            variant='secondary'
                            className='shrink-0'
                          >
                            {REVIEW_SOURCE_LABELS[review.source] ?? review.source}
                          </Badge>
                        </div>
                        <div className='mt-1 flex items-center gap-2'>
                          <StarRating
                            rating={review.rating}
                            size='sm'
                          />
                          <span className='text-foreground/80 text-xs'>
                            {timeAgo(review.created_at)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className='flex-1'>
                    <p className='text-foreground/80 text-sm'>{review.text}</p>
                  </CardContent>
                  {review.external_url && (
                    <div className='border-border flex items-center justify-end border-t px-6 py-3'>
                      <a
                        href={review.external_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary hover:text-primary/80 inline-flex items-center gap-1 text-sm font-medium transition-colors'
                      >
                        View on {REVIEW_SOURCE_LABELS[review.source] ?? 'source'}
                        <ExternalLink className='h-3.5 w-3.5' />
                      </a>
                    </div>
                  )}
                </Card>
              ))}
            </Grid>
          </Container>
        </Section>
        <Section padding='lg'>
          <Container size='xl'>
            <div className='relative w-300 mx-auto overflow-hidden bg-background/40 border-4 border-inset border-primary/40 rounded-xl shadow-glow px-6 py-14 text-center shadow-lg sm:px-12'>
              <div className='mx-auto max-w-2xl'>
                <PenLine className='text-accent mx-auto mb-4 h-10 w-10' />
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
                    <ArrowRight className='ml-1' />
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
    </div>
  );
}

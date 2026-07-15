import type { Metadata } from "next";
import Link from "next/link";
import { Star, ExternalLink, ArrowRight, PenLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/star-rating";
import { MOCK_REVIEWS } from "@/lib/mock-data";
import { REVIEW_SOURCE_LABELS } from "@/lib/constants";
import { timeAgo } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "Read authentic customer reviews for Summit Movers from Google, Yelp, Trust Advisor, and our own site. See why families and businesses trust us with their moves.",
};

const sourceOrder: Record<string, number> = {
  google: 0,
  yelp: 1,
  trustadvisor: 2,
  internal: 3,
};

export default function ReviewsPage() {
  // Compute aggregate stats from mock reviews
  const totalReviews = MOCK_REVIEWS.length;
  const averageRating =
    totalReviews > 0
      ? MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / totalReviews
      : 0;

  // Source breakdown
  const sourceBreakdown = MOCK_REVIEWS.reduce(
    (acc, review) => {
      acc[review.source] = (acc[review.source] ??  0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const sortedSources = Object.entries(sourceBreakdown).sort(
    ([a], [b]) => (sourceOrder[a] ?? 99) - (sourceOrder[b] ?? 99),
  );

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-grid hero-gradient">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="accent" className="mb-4">
              Customer Reviews
            </Badge>
            <h1 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Don&apos;t take our word for it
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl">
              Real reviews from real customers across Google, Yelp, Trust Advisor, and our own site.
              We are proud of every star — and we learn from every piece of feedback.
            </p>
          </div>

          {/* Summary card */}
          <div className="mx-auto mt-12 max-w-2xl">
            <Card className="shadow-md">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-stretch sm:justify-between">
                  {/* Average rating */}
                  <div className="flex flex-col items-center justify-center text-center">
                    <p className="font-display text-5xl font-bold text-primary">
                      {averageRating.toFixed(1)}
                    </p>
                    <StarRating rating={Math.round(averageRating)} size="lg" className="mt-2" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Based on {totalReviews} reviews
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="hidden w-px self-stretch bg-border sm:block" />

                  {/* Source breakdown */}
                  <div className="flex-1 space-y-2">
                    {sortedSources.map(([source, count]) => (
                      <div
                        key={source}
                        className="flex items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-2">
                          <Star className="h-4 w-4 fill-accent text-accent" />
                          <span className="text-sm font-medium text-foreground">
                            {REVIEW_SOURCE_LABELS[source] ?? source}
                          </span>
                        </div>
                        <span className="text-sm font-semibold text-muted-foreground">
                          {count} {count === 1 ? "review" : "reviews"}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Reviews grid */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              What customers are saying
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              {totalReviews} verified reviews from across the web
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {MOCK_REVIEWS.map((review) => (
              <Card key={review.id} className="flex flex-col transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <img
                      src={review.author_avatar}
                      alt={review.author_name}
                      className="h-12 w-12 rounded-full object-cover"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-base">{review.author_name}</CardTitle>
                        <Badge variant="secondary" className="shrink-0">
                          {REVIEW_SOURCE_LABELS[review.source] ?? review.source}
                        </Badge>
                      </div>
                      <div className="mt-1 flex items-center gap-2">
                        <StarRating rating={review.rating} size="sm" />
                        <span className="text-xs text-muted-foreground">
                          {timeAgo(review.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground">{review.text}</p>
                </CardContent>
                {review.external_url && (
                  <div className="flex items-center justify-end border-t border-border px-6 py-3">
                    <a
                      href={review.external_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary/80"
                    >
                      View on {REVIEW_SOURCE_LABELS[review.source] ?? "source"}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Write a Review CTA */}
      <section className="pb-16 lg:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary/80 px-6 py-14 text-center shadow-lg sm:px-12">
            <div className="mx-auto max-w-2xl">
              <PenLine className="mx-auto mb-4 h-10 w-10 text-accent" />
              <h2 className="font-display text-3xl font-bold tracking-tight text-primary-foreground sm:text-4xl">
                Share your experience
              </h2>
              <p className="mt-4 text-lg text-primary-foreground/80">
                Moved with us recently? We would love to hear how it went. Sign in to leave a
                review and help other families find a mover they can trust.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Button asChild size="xl" variant="accent">
                  <Link href="/login">
                    Sign in to write a review
                    <ArrowRight className="ml-1" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="xl"
                  variant="outline"
                  className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link href="/quote">Get a quote instead</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

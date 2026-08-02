import { cn } from '@/lib/utils';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StarRating({ rating, size = 'sm', className }: StarRatingProps) {
  const sizes = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' };
  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={cn(
            sizes[size],
            n <= rating ? 'fill-accent text-accent' : 'fill-muted text-muted'
          )}
        />
      ))}
    </div>
  );
}

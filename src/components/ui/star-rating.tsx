
"use client";

import * as React from 'react'; // Added import for React
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number; // 0-5
  totalStars?: number;
  size?: number;
  className?: string;
  starClassName?: string;
  interactive?: boolean;
  onRate?: (rating: number) => void;
}

export function StarRating({ 
  rating, 
  totalStars = 5, 
  size = 20, 
  className, 
  starClassName,
  interactive = false,
  onRate 
}: StarRatingProps) {
  const [hoverRating, setHoverRating] = React.useState(0);

  const handleMouseEnter = (index: number) => {
    if (!interactive) return;
    setHoverRating(index + 1);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setHoverRating(0);
  };

  const handleClick = (index: number) => {
    if (!interactive || !onRate) return;
    onRate(index + 1);
  };

  return (
    <div className={cn("flex items-center", interactive && "cursor-pointer", className)}>
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        const displayRating = interactive && hoverRating > 0 ? hoverRating : rating;
        return (
          <Star
            key={index}
            size={size}
            className={cn(
              "transition-colors",
              starValue <= Math.round(displayRating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600",
              starClassName
            )}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          />
        );
      })}
    </div>
  );
}

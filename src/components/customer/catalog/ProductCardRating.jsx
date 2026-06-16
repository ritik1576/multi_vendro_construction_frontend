import React from 'react';
import { useReviews } from '../../../features/reviews/hooks/useReviews';
import { RatingStars } from '../../../features/reviews/components/RatingStars';

export default function ProductCardRating({ productId }) {
  const { averageRating, totalReviews, isLoading } = useReviews({ productId });

  if (isLoading) {
    return <div className="h-4 mt-1 bg-slate-100 animate-pulse rounded w-24"></div>;
  }

  if (totalReviews === 0) {
    return <div className="text-[11px] font-medium text-slate-400 mt-1 mb-1 h-4 flex items-center">No reviews yet</div>;
  }

  return (
    <div className="flex items-center gap-1.5 mt-1 mb-1 h-4">
      <RatingStars rating={averageRating} size="sm" />
      <span className="text-[12px] font-bold text-slate-700 ml-1">{averageRating.toFixed(1)}</span>
      <span className="text-[11px] font-medium text-slate-400">({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})</span>
    </div>
  );
}

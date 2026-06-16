import { RatingStars } from './RatingStars';
import { MAX_RATING } from '../constants';

export const ReviewSummary = ({ averageRating, totalReviews }) => {
  return (
    <div className="flex items-center gap-6 mb-6">
      <div className="flex items-baseline gap-2">
        <h3 className="text-[32px] font-extrabold text-[#0F172A] leading-none">{averageRating.toFixed(1)}</h3>
        <p className="text-[14px] font-medium text-slate-500">out of 5</p>
      </div>
      <div className="flex flex-col gap-1 border-l border-slate-200 pl-6">
        <RatingStars rating={averageRating} size="md" />
        <p className="text-[13px] font-medium text-slate-500">Based on {totalReviews} {totalReviews === 1 ? 'review' : 'reviews'}</p>
      </div>
    </div>
  );
};

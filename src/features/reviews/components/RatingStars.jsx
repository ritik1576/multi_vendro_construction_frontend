import { Star } from 'lucide-react';
import { MAX_RATING } from '../constants';

export const RatingStars = ({ rating, size = 'sm', interactive = false, onRatingChange }) => {
  const stars = [];
  const iconSize = size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-5 h-5' : 'w-6 h-6';

  for (let i = 1; i <= MAX_RATING; i++) {
    const isFull = rating >= i;
    const isHalf = !isFull && rating >= i - 0.5;
    
    stars.push(
      <button
        key={i}
        type="button"
        disabled={!interactive}
        onClick={() => interactive && onRatingChange && onRatingChange(i)}
        className={`${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'} focus:outline-none`}
      >
        {isFull ? (
          <Star className={`${iconSize} fill-[#F97316] text-[#F97316]`} />
        ) : isHalf ? (
          <div className="relative">
            <Star className={`${iconSize} text-slate-300`} />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <Star className={`${iconSize} fill-[#F97316] text-[#F97316]`} />
            </div>
          </div>
        ) : (
          <Star className={`${iconSize} text-slate-300 ${interactive ? 'hover:text-[#F97316] hover:fill-[#F97316]' : ''}`} />
        )}
      </button>
    );
  }

  return <div className="flex items-center gap-0.5">{stars}</div>;
};

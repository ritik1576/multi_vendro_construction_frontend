import { useReviews } from '../hooks/useReviews';
import { ReviewSummary } from '../components/ReviewSummary';
import { ReviewList } from '../components/ReviewList';
import { ReviewEmptyState } from '../components/ReviewEmptyState';
import { ReviewSkeleton } from '../components/ReviewSkeleton';
import { useSelector } from 'react-redux';

export const ProductReviews = ({ productId }) => {
  const { reviews, isLoading, averageRating, totalReviews, ratingBreakdown, deleteReview } = useReviews({ productId });
  const { user } = useSelector((state) => state.auth);
  const currentUserId = user?.id || user?.userId || user?._id;

  return (
    <div className="mt-12 bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8" id="reviews">
      <h2 className="text-[20px] font-extrabold text-[#0F172A] mb-6">Customer Reviews</h2>
      
      {!isLoading && totalReviews > 0 && (
        <ReviewSummary 
          averageRating={averageRating} 
          totalReviews={totalReviews} 
          breakdown={ratingBreakdown} 
        />
      )}

      {isLoading ? (
        <div className="space-y-4">
          <ReviewSkeleton />
          <ReviewSkeleton />
        </div>
      ) : reviews.length > 0 ? (
        <div className="mt-6 border-t border-slate-100">
          <ReviewList 
            reviews={reviews} 
            role="customer" 
            onDelete={deleteReview} 
            currentUserId={currentUserId}
          />
        </div>
      ) : (
        <ReviewEmptyState />
      )}
    </div>
  );
};

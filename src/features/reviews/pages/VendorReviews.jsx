import { useSelector } from 'react-redux';
import VendorLayout from '../../../components/vendor/VendorLayout';
import { useReviews } from '../hooks/useReviews';
import { ReviewSummary } from '../components/ReviewSummary';
import { ReviewList } from '../components/ReviewList';
import { ReviewEmptyState } from '../components/ReviewEmptyState';
import { ReviewSkeleton } from '../components/ReviewSkeleton';

const VendorReviews = () => {
  const { user } = useSelector((state) => state.auth);
  const vendorId = user?.vendorId || 'v1';
  
  const { reviews, isLoading, averageRating, totalReviews, ratingBreakdown } = useReviews({ 
    vendorId, 
    role: 'vendor' 
  });

  return (
    <VendorLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <h1 className="text-[24px] font-extrabold text-[#0F172A]">Product Reviews</h1>
          <p className="text-[14px] text-slate-500 mt-1">Monitor feedback and ratings for your products.</p>
        </div>

        <div className="bg-white rounded-[16px] shadow-sm border border-slate-100 p-6 md:p-8">
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
            <ReviewList reviews={reviews} role="vendor" />
          ) : (
            <ReviewEmptyState title="No reviews yet" message="Your products haven't received any reviews yet." />
          )}
        </div>
      </div>
    </VendorLayout>
  );
};

export default VendorReviews;

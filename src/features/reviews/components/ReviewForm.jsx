import { useState } from 'react';
import { RatingStars } from './RatingStars';
import { X } from 'lucide-react';

export const ReviewForm = ({ productId, orderId, vendorId, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (rating === 0) newErrors.rating = 'Please select a rating.';
    if (!reviewText.trim()) newErrors.review = 'Review is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      productId,
      orderId,
      vendorId,
      rating,
      review: reviewText.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-[16px] shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-lg font-extrabold text-[#0F172A]">Write a Review</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1">
          <form id="review-form" onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-2">Overall Rating *</label>
              <RatingStars size="md" interactive rating={rating} onRatingChange={(v) => { setRating(v); setErrors(prev => ({...prev, rating: null})); }} />
              {errors.rating && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.rating}</p>}
            </div>

            <div>
              <label className="block text-[13px] font-bold text-slate-700 mb-2">Review Comment *</label>
              <textarea
                value={reviewText}
                onChange={(e) => { setReviewText(e.target.value); setErrors(prev => ({...prev, review: null})); }}
                placeholder="What did you like or dislike?"
                rows={4}
                className={`w-full px-4 py-2.5 rounded-lg border text-sm focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-colors resize-none ${
                  errors.review ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-[#1E3A8A] focus:ring-[#1E3A8A]'
                }`}
              />
              {errors.review && <p className="text-red-500 text-xs font-medium mt-1.5">{errors.review}</p>}
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-[13px] font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="review-form"
            className="px-6 py-2.5 text-[13px] font-bold text-white bg-[#1E3A8A] hover:bg-[#172554] rounded-lg shadow-sm transition-colors"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

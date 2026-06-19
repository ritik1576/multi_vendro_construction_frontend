import { useState, useEffect, useCallback } from 'react';
import { getAdminReviewsApi, deleteAdminReviewApi, updateAdminReviewStatusApi } from '../services/reviewService';

export const useAdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    fiveStarReviews: 0,
    lowRatingReviews: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReviews = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getAdminReviewsApi();
      if (response && response.success) {
        setReviews(response.reviews || []);
        setStats({
          totalReviews: response.totalReviews || 0,
          averageRating: response.averageRating || 0,
          fiveStarReviews: response.fiveStarReviews || 0,
          lowRatingReviews: response.lowRatingReviews || 0
        });
      } else {
        throw new Error('Failed to fetch admin reviews format');
      }
    } catch (err) {
      console.error('Error fetching admin reviews:', err);
      setError(err.message || 'Failed to fetch reviews');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const deleteReview = async (id) => {
    try {
      await deleteAdminReviewApi(id);
      // Remove optimistically
      setReviews(prev => prev.filter(r => r.id !== id));
      // Re-fetch to update stats accurately
      await fetchReviews();
    } catch (err) {
      console.error('Error deleting review:', err);
      throw err;
    }
  };

  const updateReviewStatus = async (id, status) => {
    try {
      await updateAdminReviewStatusApi(id, status);
      // Update optimistically
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      // Re-fetch in case backend logic affects stats
      await fetchReviews();
    } catch (err) {
      console.error('Error updating review status:', err);
      throw err;
    }
  };

  return {
    reviews,
    stats,
    isLoading,
    error,
    deleteReview,
    updateReviewStatus,
    refreshReviews: fetchReviews
  };
};

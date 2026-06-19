import { useState, useEffect, useCallback, useMemo } from 'react';
import { mockReviews as initialMockReviews } from '../data/mockReviews';
import { calculateAverageRating, getRatingBreakdown } from '../utils/reviewHelpers';
import { getProductReviewsApi, addReviewApi, deleteReviewApi } from '../services/reviewService';

const STORAGE_KEY = 'inframart_mock_reviews';

const getStoredReviews = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Failed to parse stored reviews', e);
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(initialMockReviews));
  return initialMockReviews;
};

const saveStoredReviews = (reviews) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
};

const productReviewsCache = {};
const pendingFetches = {};

export const useReviews = ({ productId, vendorId, role } = {}) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);
    
    if (productId) {
      if (!forceRefresh && productReviewsCache[productId]) {
        setReviews(productReviewsCache[productId]);
        setIsLoading(false);
        return;
      }

      try {
        if (!pendingFetches[productId] || forceRefresh) {
          pendingFetches[productId] = getProductReviewsApi(productId).then(data => {
            let reviewsData = Array.isArray(data) ? data : (data?.data || data?.reviews || []);
            if (!Array.isArray(reviewsData)) {
              reviewsData = [];
            }
            const mappedData = reviewsData.map(r => ({
              ...r,
              customerName: r.userName || r.customerName || 'Customer',
            }));
            productReviewsCache[productId] = mappedData;
            return mappedData;
          });
        }
        
        const mappedData = await pendingFetches[productId];
        setReviews(mappedData);
      } catch (error) {
        console.error('Failed to fetch product reviews', error);
        setReviews([]);
      } finally {
        setIsLoading(false);
      }
      return;
    }

    // Mock logic for vendor/admin
    setTimeout(() => {
      let allReviews = getStoredReviews();
      if (vendorId && role === 'vendor') {
        allReviews = allReviews.filter(r => r.vendorId === vendorId);
      }
      setReviews(allReviews);
      setIsLoading(false);
    }, 400);
  }, [productId, vendorId, role]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const averageRating = useMemo(() => calculateAverageRating(reviews), [reviews]);
  const totalReviews = reviews.length;
  const ratingBreakdown = useMemo(() => getRatingBreakdown(reviews), [reviews]);

  const addReview = useCallback(async (reviewData) => {
    try {
      const apiPayload = {
        productId: reviewData.productId,
        rating: reviewData.rating,
        review: reviewData.review,
      };
      
      const newReview = await addReviewApi(apiPayload);
      
      // Also save to mock storage so it appears in OrderHistory duplicate checks
      const allReviews = getStoredReviews();
      allReviews.unshift({
        id: newReview?.id || `r_${Date.now()}`,
        ...reviewData,
        status: 'pending',
        createdAt: new Date().toISOString(),
      });
      saveStoredReviews(allReviews);
      
      if (reviewData.productId) {
        delete productReviewsCache[reviewData.productId];
        delete pendingFetches[reviewData.productId];
      }
      
      await fetchReviews(true);
      return newReview;
    } catch (error) {
      console.error('Failed to add review', error);
      throw error;
    }
  }, [fetchReviews]);



  const deleteReview = useCallback(async (id) => {
    try {
      if (typeof id === 'number' || !String(id).startsWith('r_')) {
        await deleteReviewApi(id);
      }
    } catch (error) {
      console.error('Failed to delete review via API', error);
    }

    const allReviews = getStoredReviews();
    const filtered = allReviews.filter(r => String(r.id) !== String(id));
    saveStoredReviews(filtered);
    
    if (productId) {
      delete productReviewsCache[productId];
      delete pendingFetches[productId];
    }
    
    await fetchReviews(true);
  }, [fetchReviews]);

  const hasUserReviewedOrder = useCallback((userId, orderId, productId) => {
    const allReviews = getStoredReviews();
    return allReviews.some(r => r.userId === userId && String(r.orderId) === String(orderId) && String(r.productId) === String(productId));
  }, []);

  return {
    reviews,
    isLoading,
    averageRating,
    totalReviews,
    ratingBreakdown,
    addReview,
    deleteReview,
    hasUserReviewedOrder,
    refreshReviews: fetchReviews
  };
};

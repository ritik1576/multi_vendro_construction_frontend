import { MAX_RATING } from '../constants';

export const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;
  const total = reviews.reduce((acc, review) => acc + review.rating, 0);
  return Number((total / reviews.length).toFixed(1));
};

export const getRatingBreakdown = (reviews) => {
  const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  if (!reviews || reviews.length === 0) return breakdown;

  reviews.forEach(review => {
    const rating = Math.floor(review.rating);
    if (breakdown[rating] !== undefined) {
      breakdown[rating]++;
    }
  });

  return breakdown;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }).format(date);
};

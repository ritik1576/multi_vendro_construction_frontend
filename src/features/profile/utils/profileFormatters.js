export const formatFallback = (value) => {
  if (value === null || value === undefined || value === '') {
    return 'Not provided';
  }
  return value;
};

export const formatDate = (dateString) => {
  if (!dateString) return 'Not provided';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Not provided';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    return 'Not provided';
  }
};

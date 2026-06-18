import api from '../../../services/api';

export const getProductReviewsApi = async (productId) => {
  const response = await api.get(`/reviews/product/${productId}`);
  return response.data;
};

export const addReviewApi = async (reviewData) => {
  const response = await api.post('/reviews', reviewData);
  return response.data;
};

export const deleteReviewApi = async (id) => {
  const response = await api.delete(`/reviews/${id}`);
  return response.data;
};

// Admin APIs
export const getAdminReviewsApi = async () => {
  const response = await api.get('/admin/reviews');
  return response.data;
};

export const deleteAdminReviewApi = async (id) => {
  const response = await api.delete(`/admin/reviews/${id}`);
  return response.data;
};

export const updateAdminReviewStatusApi = async (id, status) => {
  const response = await api.put(`/admin/reviews/${id}/status`, { status });
  return response.data;
};

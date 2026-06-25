import { useState, useCallback, useEffect } from 'react';
import { categoryService } from '../services/categoryService';
import { normalizeCategory } from '../utils/categoryIconMap';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryService.getCategoriesApi();
      let dataList = [];
      if (Array.isArray(response)) {
        dataList = response;
      } else if (response?.data && Array.isArray(response.data)) {
        dataList = response.data;
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        dataList = response.data.data;
      }
      
      // Extract string names and normalize
      const mapped = dataList.map(item => {
        const catName = typeof item === 'string' ? item : (item.name || item.categoryName || item.category || '');
        return normalizeCategory(catName);
      }).filter(Boolean);

      // Remove duplicates
      const unique = [...new Set(mapped)];
      setCategories(unique);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};

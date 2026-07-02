import { useState, useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCategoriesRequest } from '../../../redux/categoryActions';
import { normalizeCategory } from '../utils/categoryIconMap';

export const useCategories = () => {
  const dispatch = useDispatch();
  const { categories: rawCategories, loading, error } = useSelector(state => state.category);

  const fetchCategories = useCallback(() => {
    dispatch(getCategoriesRequest());
  }, [dispatch]);

  useEffect(() => {
    if (!rawCategories || rawCategories.length === 0) {
      fetchCategories();
    }
  }, [rawCategories, fetchCategories]);

  const categories = useMemo(() => {
    let dataList = rawCategories || [];
    if (!Array.isArray(dataList)) return [];

    const mapped = dataList.map(item => {
      const catName = typeof item === 'string' ? item : (item.name || item.categoryName || item.category || '');
      return normalizeCategory(catName);
    }).filter(Boolean);

    return [...new Set(mapped)];
  }, [rawCategories]);

  return { categories, loading, error, refetch: fetchCategories };
};

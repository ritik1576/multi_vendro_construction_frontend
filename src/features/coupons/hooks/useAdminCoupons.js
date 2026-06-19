import { useState, useCallback } from 'react';
import { couponService } from '../services/couponService';

export const useAdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await couponService.getCouponsApi();
      setCoupons(response.data || response.coupons || response || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to fetch coupons');
    } finally {
      setLoading(false);
    }
  }, []);

  const createCoupon = async (payload) => {
    try {
      const response = await couponService.createCouponApi(payload);
      await fetchCoupons();
      return response;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to create coupon');
    }
  };

  const updateCoupon = async (id, payload) => {
    try {
      const response = await couponService.updateCouponApi(id, payload);
      await fetchCoupons();
      return response;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to update coupon');
    }
  };

  const updateCouponStatus = async (id, status) => {
    try {
      // Not requested to change this but keeping it just in case
      const response = await couponService.updateCouponStatusApi(id, status);
      await fetchCoupons();
      return response;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to update coupon status');
    }
  };

  const deleteCoupon = async (id) => {
    try {
      const response = await couponService.deleteCouponApi(id);
      setCoupons(prev => prev.filter(c => c.id !== id && c._id !== id));
      return response;
    } catch (err) {
      throw new Error(err.response?.data?.message || err.message || 'Failed to delete coupon');
    }
  };

  return {
    coupons,
    loading,
    error,
    fetchCoupons,
    createCoupon,
    updateCoupon,
    updateCouponStatus,
    deleteCoupon
  };
};

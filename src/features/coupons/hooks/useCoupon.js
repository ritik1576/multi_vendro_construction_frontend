import { useState } from 'react';
import { couponService } from '../services/couponService';

export const useCoupon = () => {
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [finalAmount, setFinalAmount] = useState(null);
  const [couponError, setCouponError] = useState(null);
  const [isApplying, setIsApplying] = useState(false);

  const applyCoupon = async (userId, cartTotal, cartItems) => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code.');
      return false;
    }
    if (!userId) {
      setCouponError('You must be logged in to apply a coupon.');
      return false;
    }

    setIsApplying(true);
    setCouponError(null);

    try {
      const payload = {
        couponCode: couponCode
      };

      const response = await couponService.applyCouponApi(payload);
      
      setAppliedCoupon({
        code: response.couponCode || couponCode,
        message: response.message || 'Coupon applied successfully!',
      });
      setCouponDiscount(response.discountAmount || 0);
      setFinalAmount(response.finalAmount || null);
      localStorage.setItem('appliedCoupon', JSON.stringify({
        code: response.couponCode || couponCode,
        discountAmount: response.discountAmount,
        finalAmount: response.finalAmount
      }));
      return true;
    } catch (error) {
      setCouponError(error.response?.data?.message || error.message || 'Failed to apply coupon.');
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setFinalAmount(null);
      return false;
    } finally {
      setIsApplying(false);
    }
  };

  const removeCoupon = async () => {
    try {
      if (appliedCoupon?.code) {
        await couponService.removeCouponApi();
      }
    } catch (error) {
      console.error("Failed to cleanly remove coupon from backend", error);
    } finally {
      localStorage.removeItem('appliedCoupon');
      setCouponCode('');
      setAppliedCoupon(null);
      setCouponDiscount(0);
      setFinalAmount(null);
      setCouponError(null);
    }
  };

  return {
    couponCode,
    setCouponCode,
    appliedCoupon,
    couponDiscount,
    finalAmount,
    couponError,
    isApplying,
    applyCoupon,
    removeCoupon
  };
};

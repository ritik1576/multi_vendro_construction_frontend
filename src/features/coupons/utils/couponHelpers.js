export const formatCouponDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const calculateDiscount = (totalAmount, discountType, discountValue, maxDiscount) => {
  let discount = 0;
  if (discountType === 'percentage') {
    discount = (totalAmount * discountValue) / 100;
    if (maxDiscount && discount > maxDiscount) {
      discount = maxDiscount;
    }
  } else if (discountType === 'fixed') {
    discount = discountValue;
  }
  
  return Math.min(discount, totalAmount);
};

export const getCouponStatus = (coupon) => {
  const now = new Date();
  
  if (coupon.isActive === false || coupon.status === 'inactive') return 'INACTIVE';
  
  if (coupon.startDate) {
    const startDate = new Date(coupon.startDate);
    if (now < startDate) return 'UPCOMING';
  }
  
  if (coupon.endDate) {
    const endDate = new Date(coupon.endDate);
    if (now > endDate) return 'EXPIRED';
  }
  
  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return 'USED UP';
  }

  return 'ACTIVE';
};

export const formatDiscount = (coupon) => {
  const type = (coupon.discountType || '').toLowerCase();
  const val = coupon.discountValue || coupon.discount || 0;
  
  if (['percentage', 'percent'].includes(type)) {
    return `${val}%`;
  }
  
  // default to fixed/amount/flat
  return `₹${val}`;
};

export const isCouponAvailable = (coupon) => {
  if (!coupon) return false;
  return getCouponStatus(coupon) === 'ACTIVE';
};

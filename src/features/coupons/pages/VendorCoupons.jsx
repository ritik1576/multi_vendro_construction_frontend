import React, { useEffect, useState } from 'react';
import VendorLayout from '../../../components/vendor/VendorLayout';
import { CouponTable } from '../components/CouponTable';
import { couponService } from '../services/couponService';
import { Tag } from 'lucide-react';
import { useSelector } from 'react-redux';

const VendorCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchCoupons = async () => {
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
    };

    fetchCoupons();
  }, [user]);

  return (
    <VendorLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-[#0F172A] flex items-center gap-2 mb-2">
          <Tag className="h-6 w-6 text-[#F97316]" />
          Platform Coupons
        </h1>
        <p className="text-sm text-slate-500">
          View active promotional offers provided by InfraMart.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-lg bg-red-50 p-4 border border-red-200">
          <p className="text-sm text-red-600 font-bold">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="w-8 h-8 border-4 border-[#F97316] border-r-transparent rounded-full animate-spin"></div>
        </div>
      ) : (
        <CouponTable 
          coupons={coupons}
          isReadOnly={true}
        />
      )}
    </VendorLayout>
  );
};

export default VendorCoupons;

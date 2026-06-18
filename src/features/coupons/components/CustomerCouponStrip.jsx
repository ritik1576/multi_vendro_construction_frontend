import React, { useEffect, useState, useRef } from 'react';
import { Tag, Copy, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { couponService } from '../services/couponService';
import { isCouponAvailable, formatDiscount } from '../utils/couponHelpers';

const CustomerCouponStrip = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(null);
  
  const scrollRef = useRef(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchCoupons = async () => {
      try {
        const response = await couponService.getCouponsApi();
        if (!isMounted) return;
        
        const allCoupons = response.data || response.coupons || response || [];
        const activeCoupons = allCoupons.filter(isCouponAvailable);
        
        setCoupons(activeCoupons);
      } catch (error) {
        // Silently fail for customer view
        console.error("Failed to load coupons:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCoupons();
    
    return () => {
      isMounted = false;
    };
  }, []);

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  // Do not show anything if loading or no coupons
  if (loading || coupons.length === 0) return null;

  return (
    <div className="w-full bg-slate-50 border-y border-slate-200 py-4 relative group">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center gap-3 mb-3">
          <Tag className="h-4 w-4 text-[#EA580C]" />
          <h3 className="text-sm font-extrabold text-[#0F172A] tracking-wide uppercase">Available Offers</h3>
        </div>
        
        <div className="relative">
          {/* Scroll Buttons (visible on hover/large screens) */}
          {coupons.length > 2 && (
            <>
              <button 
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 -ml-4 z-10 p-2 rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:text-[#1E3A8A] opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button 
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 -mr-4 z-10 p-2 rounded-full bg-white shadow-md border border-slate-200 text-slate-600 hover:text-[#1E3A8A] opacity-0 group-hover:opacity-100 transition-opacity hidden md:flex"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          <div 
            ref={scrollRef}
            className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {coupons.map(coupon => (
              <div 
                key={coupon.id || coupon._id} 
                className="flex-none snap-start w-[280px] bg-white rounded-xl border border-[#E2E8F0] shadow-sm hover:border-[#1E3A8A]/30 hover:shadow-md transition-all p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <div className="inline-flex items-center px-2 py-1 bg-emerald-50 text-emerald-700 text-[11px] font-extrabold rounded">
                      {formatDiscount(coupon)} OFF
                    </div>
                    <button 
                      onClick={() => handleCopy(coupon.code)}
                      className="text-slate-400 hover:text-[#1E3A8A] transition-colors p-1"
                      title="Copy Code"
                    >
                      {copiedCode === coupon.code ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                  
                  <div className="font-mono font-bold text-lg text-[#0F172A] tracking-tight mb-1">
                    {coupon.code}
                  </div>
                  
                  <div className="text-[12px] text-slate-500 font-medium">
                    {coupon.minimumOrderAmount > 0 
                      ? `On minimum order of ₹${coupon.minimumOrderAmount}` 
                      : 'No minimum order value'
                    }
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerCouponStrip;

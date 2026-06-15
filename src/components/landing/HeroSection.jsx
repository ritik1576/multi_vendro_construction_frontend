import React from 'react';
import { useSelector } from 'react-redux';

const HeroSection = () => {
  const { products = [] } = useSelector(state => state.product);
  
  const productCount = products.length > 0 ? `${products.length}+` : '10,000+';
  
  // Calculate unique vendors/suppliers from products to avoid requiring admin auth
  const uniqueVendors = new Set(products.map(p => p.vendorId || p.vendorName || p.vendor_id || p.shopName).filter(Boolean));
  const supplierCount = uniqueVendors.size > 0 ? `${uniqueVendors.size}+` : '500+';
  return (
    <div className="relative bg-primary-dark text-white overflow-hidden">
      {/* Background pattern placeholder */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 bg-primary-dark/80 mix-blend-multiply" />
        <img 
          src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&q=80" 
          alt="Cables Background" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
            <span className="text-white">Construction Materials,</span><br/>
            <span className="text-blue-200 font-bold">Delivered Fast</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-200 mb-10 max-w-xl font-medium">
            India's trusted B2B marketplace — {productCount} products from {supplierCount} verified sellers at direct wholesale prices.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <button className="px-8 py-3 rounded-md font-medium text-white bg-secondary-main hover:bg-secondary-dark transition-colors text-center shadow-lg">
              Browse Catalog &rarr;
            </button>
            <button className="px-8 py-3 rounded-md font-medium text-white border border-white/30 hover:bg-white/10 transition-colors text-center">
              Create Free Account
            </button>
          </div>

          <div className="grid grid-cols-3 divide-x divide-white/20 border-t border-white/20 pt-8 mt-12 relative">
            <div className="px-6 first:pl-0">
              <div className="text-2xl sm:text-3xl font-bold text-secondary-main mb-1">{productCount}</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium uppercase tracking-wide">Building Products</div>
            </div>
            <div className="px-6">
              <div className="text-2xl sm:text-3xl font-bold text-secondary-main mb-1">{supplierCount}</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium uppercase tracking-wide">Verified Suppliers</div>
            </div>
            <div className="px-6">
              <div className="text-2xl sm:text-3xl font-bold text-secondary-main mb-1">50+</div>
              <div className="text-xs sm:text-sm text-gray-300 font-medium uppercase tracking-wide">Cities Delivered</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

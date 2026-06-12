import React from 'react';
import ProductCardCompact from './ProductCardCompact';

export default function ProductGrid({ products, isLoading, error, viewMode, onResetFilters }) {
  if (isLoading) {
    return (
      <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className={`animate-pulse bg-slate-100 rounded-sm ${viewMode === 'grid' ? 'h-80' : 'h-40'}`}></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-700 p-8 rounded border border-red-200 text-center font-bold text-sm">
        {error}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="bg-white border border-slate-200 p-12 text-center flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-bold text-slate-800 mb-4">No products available in this category</h2>
        {onResetFilters && (
          <button 
            onClick={onResetFilters}
            className="px-6 py-2.5 bg-[#F97316] text-white font-bold text-sm rounded-sm hover:bg-[#EA580C] transition-colors"
          >
            Browse all products
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={`grid gap-4 sm:gap-5 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
      {products.map((product) => (
        <ProductCardCompact key={product.id || product.ProductName || product.name} product={product} viewMode={viewMode} />
      ))}
    </div>
  );
}

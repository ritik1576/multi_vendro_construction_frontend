import React, { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { normalizeProductImage } from '../../utils/productImages';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const FeaturedProducts = () => {
  const { products: apiProducts, loading } = useSelector(state => state.product);
  const [failedImages, setFailedImages] = useState({});
  const navigate = useNavigate();

  const handleImageError = (id) => {
    setFailedImages(prev => ({ ...prev, [id]: true }));
  };

  const displayProducts = apiProducts
    ?.filter(p => p.image || p.thumbnail || (p.images && p.images.length > 0))
    .filter(p => {
      const name = (p.name || p.title || '').toLowerCase();
      if (
        name.includes('ultratech cement opc 53 gra') || 
        name.includes('acc cement 50kg') ||
        name.includes('ambuja')
      ) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      const aName = (a.name || a.title || '').toLowerCase();
      const bName = (b.name || b.title || '').toLowerCase();
      const aMatch = aName.includes('white cement') || aName.includes('plywood') || aName.includes('birla white');
      const bMatch = bName.includes('white cement') || bName.includes('plywood') || bName.includes('birla white');
      if (aMatch && !bMatch) return -1;
      if (!aMatch && bMatch) return 1;
      return 0;
    })
    .slice(0, 4)
    .map((p, idx) => {
      let img = p.image || p.thumbnail;
      if (!img && p.images && p.images.length > 0) img = p.images[0];
      return {
        id: p.id || p._id || idx,
        name: p.name || p.title || 'Product',
        description: p.description || 'Premium construction material',
        price: p.price || p.basePrice || '0.00',
        unit: p.unit || 'Piece',
        rating: p.rating || 4.5,
        reviews: p.reviews || 0,
        image: img,
        tag: '',
        tagColor: '',
        priceTag: 'Wholesale'
      };
    }) || [];

  const renderSkeletons = () => {
    return Array(4).fill(0).map((_, idx) => (
      <div key={`skel-${idx}`} className="bg-white rounded-xl shadow-sm border border-customBorder-light overflow-hidden flex flex-col">
        <div className="h-48 bg-gray-200 animate-pulse"></div>
        <div className="p-5 flex flex-col flex-1">
          <div className="flex space-x-2 mb-2">
            <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-8 h-4 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="w-3/4 h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
          <div className="w-full h-4 bg-gray-200 animate-pulse rounded mb-1"></div>
          <div className="w-2/3 h-4 bg-gray-200 animate-pulse rounded mb-4"></div>
          
          <div className="flex items-end justify-between mb-4">
            <div className="w-20 h-6 bg-gray-200 animate-pulse rounded"></div>
            <div className="w-16 h-4 bg-gray-200 animate-pulse rounded"></div>
          </div>
          <div className="w-full h-10 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
      </div>
    ));
  };

  return (
    <div className="bg-customBackground-default py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <h2 className="text-3xl md:text-4xl font-extrabold text-customText-primary mb-3">Featured Products</h2>
          <div className="w-20 h-1.5 bg-secondary-main rounded-full mb-4"></div>
          <p className="text-customText-secondary text-sm md:text-base max-w-2xl">
            Wholesale prices for high volume requirements
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? renderSkeletons() : displayProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-customBorder-light overflow-hidden flex flex-col group">
              {/* Product Image & Tags */}
              <div className="relative h-48 p-4 flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                {product.tag && (
                  <span className={`absolute top-4 left-4 ${product.tagColor} text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm z-10`}>
                    {product.tag}
                  </span>
                )}
                <img 
                  src={failedImages[product.id] ? normalizeProductImage('') : normalizeProductImage(product.image)} 
                  alt={product.name} 
                  onError={() => handleImageError(product.id)}
                  className="max-h-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              {/* Product Details */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center space-x-1 mb-2">
                  <Star className="h-4 w-4 fill-secondary-main text-secondary-main" />
                  <span className="text-sm font-medium text-customText-primary">{product.rating}</span>
                  <span className="text-xs text-customText-disabled">({product.reviews})</span>
                </div>
                
                <h3 className="text-lg font-bold text-customText-primary mb-1 truncate">{product.name}</h3>
                <p className="text-sm text-customText-secondary mb-4 line-clamp-2 flex-1">{product.description}</p>
                
                <div className="flex items-end justify-between mb-4">
                  <div>
                    <span className="text-xl font-bold text-customText-primary">₹{product.price}</span>
                    <span className="text-xs text-customText-secondary"> /{product.unit}</span>
                  </div>
                  <span className="text-[10px] font-bold text-secondary-main uppercase tracking-wide">{product.priceTag}</span>
                </div>

                <button 
                  onClick={() => navigate('/login')}
                  className="w-full flex items-center justify-center gap-2 bg-primary-dark hover:bg-[#111827] text-white py-2.5 rounded-md font-medium transition-colors"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProducts;

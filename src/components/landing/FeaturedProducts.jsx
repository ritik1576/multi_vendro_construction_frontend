import React, { useState } from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { normalizeProductImage } from '../../utils/productImages';

import { useSelector } from 'react-redux';

const FeaturedProducts = () => {
  const { products: apiProducts, loading } = useSelector(state => state.product);
  const [failedImages, setFailedImages] = useState({});

  const handleImageError = (id) => {
    setFailedImages(prev => ({ ...prev, [id]: true }));
  };

  const staticFallbacks = [
    { tag: "Bestseller", tagColor: "bg-danger-main", priceTag: "Wholesale", unit: "Bag", rating: 4.8, reviews: 120, image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80" },
    { tag: "", tagColor: "", priceTag: "Bulk Deal", unit: "50kg", rating: 4.9, reviews: 540, image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80" },
    { tag: "NEW", tagColor: "bg-primary-dark", priceTag: "Wholesale", unit: "1L", rating: 4.7, reviews: 320, image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80" },
    { tag: "", tagColor: "", priceTag: "Contractor Rate", unit: "Piece", rating: 4.9, reviews: 210, image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80" }
  ];

  const displayProducts = apiProducts?.slice(0, 4).map((p, idx) => ({
    id: p.id || p._id || idx,
    name: p.name || p.title || 'Product',
    description: p.description || 'Premium construction material',
    price: p.price || p.basePrice || '0.00',
    unit: p.unit || staticFallbacks[idx % 4].unit,
    rating: p.rating || staticFallbacks[idx % 4].rating,
    reviews: p.reviews || staticFallbacks[idx % 4].reviews,
    image: p.image || p.thumbnail || staticFallbacks[idx % 4].image,
    tag: staticFallbacks[idx % 4].tag,
    tagColor: staticFallbacks[idx % 4].tagColor,
    priceTag: staticFallbacks[idx % 4].priceTag
  })) || [];

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

                <button className="w-full flex items-center justify-center gap-2 bg-primary-dark hover:bg-[#111827] text-white py-2.5 rounded-md font-medium transition-colors">
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

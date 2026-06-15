import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { normalizeProductImage } from '../../utils/productImages';

const FeaturedProducts = () => {
  const products = [
    {
      id: 1,
      name: "ACC Suraksha Power",
      description: "High-performance cement for durable slabs",
      price: "385",
      unit: "Bag",
      rating: 4.8,
      reviews: 120,
      image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&q=80",
      tag: "Bestseller",
      tagColor: "bg-danger-main",
      priceTag: "Wholesale"
    },
    {
      id: 2,
      name: "Birla White Cement",
      description: "Premium white cement for wall finishes",
      price: "1,150",
      unit: "50kg",
      rating: 4.9,
      reviews: 540,
      image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&q=80",
      tag: "",
      tagColor: "",
      priceTag: "Bulk Deal"
    },
    {
      id: 3,
      name: "Dr. Fixit LW+",
      description: "Integral waterproofing liquid for concrete",
      price: "155",
      unit: "1L",
      rating: 4.7,
      reviews: 320,
      image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&q=80",
      tag: "NEW",
      tagColor: "bg-primary-dark",
      priceTag: "Wholesale"
    },
    {
      id: 4,
      name: "Astral CPVC Pipes",
      description: "High pressure plumbing solutions",
      price: "450",
      unit: "Piece",
      rating: 4.9,
      reviews: 210,
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80",
      tag: "",
      tagColor: "",
      priceTag: "Contractor Rate"
    }
  ];

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
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-sm border border-customBorder-light overflow-hidden flex flex-col group">
              {/* Product Image & Tags */}
              <div className="relative h-48 p-4 flex items-center justify-center bg-gray-50 group-hover:bg-gray-100 transition-colors">
                {product.tag && (
                  <span className={`absolute top-4 left-4 ${product.tagColor} text-white text-[10px] font-bold px-2 py-1 uppercase rounded-sm z-10`}>
                    {product.tag}
                  </span>
                )}
                <img 
                  src={normalizeProductImage(product.image)} 
                  alt={product.name} 
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

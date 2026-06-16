import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToCartRequest,
  updateCartItemRequest,
  removeCartItemRequest,
} from '../../../redux/cartActions';
import { formatCurrency } from '../../../context/cartUtils';
import { Minus, Plus, Image as ImageIcon } from 'lucide-react';
import { getLocalProductImage } from '../../../utils/productImages';
import ProductCardRating from './ProductCardRating';

function ProductImage({ alt, src }) {
  const [failedSrc, setFailedSrc] = useState(null);
  
  if (!src || failedSrc === src) {
    return (
      <div className="flex flex-col items-center justify-center text-slate-300 w-full h-full bg-slate-50">
        <ImageIcon className="w-12 h-12 mb-2 stroke-[1.5]" />
        <span className="text-[9px] font-bold tracking-widest uppercase text-slate-400">Image Unavailable</span>
      </div>
    );
  }

  return (
    <img
      alt={alt || 'Product image'}
      className="h-full w-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
      loading="lazy"
      onError={() => setFailedSrc(src)}
      src={src}
    />
  );
}

export default function ProductCardCompact({ product, viewMode = 'grid' }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const rawCart = useSelector((state) => state.cart?.cart);
  const cart = rawCart || [];
  const cartItems = Array.isArray(cart) ? cart : (cart?.data?.items || cart?.items || []);

  const productName = product?.name || 'Product name not available';
  const category = product?.category;
  const numPrice = Number(product?.price || 0);
  const numDiscountPrice = Number(product?.discountPrice || 0);
  const hasValidDiscount = numDiscountPrice > 0 && numDiscountPrice < numPrice;

  const price = formatCurrency(numPrice);
  const discountedPrice = formatCurrency(hasValidDiscount ? numDiscountPrice : numPrice);
  const status = product?.status || 'In Stock';

  const calculatedDiscountPercent = hasValidDiscount ? Math.round(((numPrice - numDiscountPrice) / numPrice) * 100) : null;
  const displayDiscountPercent = product?.discountPercent || calculatedDiscountPercent;

  const cartItem = cartItems.find((item) => {
    const cartName = (item?.productName || item?.productname || item?.name || '').toLowerCase();
    const prodName = (product?.ProductName || product?.name || '').toLowerCase();
    return cartName === prodName && prodName !== '';
  });
  const quantity = cartItem?.quantity || 1;

  const openProduct = (event) => {
    if (event && event.stopPropagation) {
      event.stopPropagation();
    }
    const idToUse = product?.id || product?._id || product?.productId;
    if (idToUse) {
      navigate(`/product/${idToUse}`);
    }
  };

  const handleAddToCart = (event) => {
    event.stopPropagation();
    if (cartItem && (cartItem.id || cartItem.cartItemId)) {
      dispatch(updateCartItemRequest({
        cartitemID: cartItem.id || cartItem.cartItemId,
        productname: product?.ProductName || product?.name,
        quantity: quantity + 1
      }));
    } else {
      dispatch(addToCartRequest({ productname: product?.ProductName || product?.name, quantity: 1 }));
    }
  };

  const handleDecreaseQuantity = (event) => {
    event.stopPropagation();
    if (cartItem && (cartItem.id || cartItem.cartItemId)) {
      if (quantity > 1) {
        dispatch(updateCartItemRequest({
          cartitemID: cartItem.id || cartItem.cartItemId || cartItem.cartitemID || cartItem._id,
          productname: product?.ProductName || product?.name,
          quantity: quantity - 1
        }));
      } else {
        dispatch(removeCartItemRequest(cartItem.id || cartItem.cartItemId || cartItem.cartitemID || cartItem._id));
      }
    }
  };

  const handleIncreaseQuantity = (event) => {
    event.stopPropagation();
    if (cartItem && (cartItem.id || cartItem.cartItemId)) {
      dispatch(updateCartItemRequest({
        cartitemID: cartItem.id || cartItem.cartItemId,
        productname: product?.ProductName || product?.name,
        quantity: quantity + 1
      }));
    }
  };

  const isListView = viewMode === 'list';

  return (
    <article
      onClick={openProduct}
      className={`group flex overflow-hidden bg-white rounded shadow-[0_1px_4px_rgba(0,0,0,0.05)] border border-slate-100 hover:shadow-md transition-all duration-200 cursor-pointer ${
        isListView ? 'flex-row h-32' : 'flex-col h-full'
      }`}
    >
      {/* Image Container */}
      <div className={`relative flex items-center justify-center overflow-hidden shrink-0 bg-white ${
        isListView ? 'w-32 h-full border-r border-slate-100 p-2' : 'w-full h-48 p-4'
      }`}>
        <ProductImage alt={productName} src={getLocalProductImage(product)} />
      </div>

      {/* Content Container */}
      <div className={`flex flex-col flex-1 p-4 pt-0 ${isListView ? 'justify-center p-4' : ''}`}>
        
        {/* Category */}
        <p className="text-[10px] text-slate-400 mb-1 truncate uppercase tracking-widest font-semibold">
          {category || 'Product'}
        </p>

        {/* Title */}
        <h3 className="text-[14px] font-medium tracking-tight text-slate-800 leading-snug group-hover:text-[#1E3A8A] transition-colors line-clamp-2 h-10">
          {productName}
        </h3>
        
        <ProductCardRating productId={product?.id || product?._id || product?.productId || product?.ProductName || product?.name} />
        
        {/* Price Row */}
        <div className="mt-2 flex items-center gap-2 flex-wrap">
          <span className="text-[18px] font-bold text-[#0F172A] leading-none">{discountedPrice}</span>
          {hasValidDiscount && price !== discountedPrice && (
            <>
              <span className="text-[13px] text-slate-400 line-through">{price}</span>
              {displayDiscountPercent && (
                <span className="text-[13px] font-bold text-[#388e3c]">
                  {displayDiscountPercent}% off
                </span>
              )}
            </>
          )}
        </div>

        {/* Bottom Area: Actions */}
        <div className="mt-auto pt-4">
          <div className="flex items-center w-full" onClick={(e) => e.stopPropagation()}>
            {cartItem ? (
              <div className="flex items-center h-[34px] w-full bg-white border border-slate-200 rounded overflow-hidden">
                <button
                  onClick={handleDecreaseQuantity}
                  className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Minus className="h-4 w-4" strokeWidth={2} />
                </button>
                <span className="flex-1 text-center text-[14px] font-bold text-[#0F172A]">{quantity}</span>
                <button
                  onClick={handleIncreaseQuantity}
                  className="w-10 h-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  <Plus className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleAddToCart}
                className="flex w-full items-center justify-center h-[34px] px-3 rounded bg-[#F97316] text-white hover:bg-[#EA580C] font-bold text-[14px] transition-colors"
                disabled={status === 'Out of Stock'}
              >
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

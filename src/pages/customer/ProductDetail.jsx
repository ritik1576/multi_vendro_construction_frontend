import { useMemo, useState, useEffect } from 'react';
import { BACKEND_URL } from '../../services/apiConstants';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProductDetailsRequest } from '../../redux/productActions';
import { 
  ChevronRight, Minus, Plus, ShoppingCart, Truck, ArrowLeft, 
  Expand, CheckCircle2, Store, RotateCcw, Box, Droplets, Clock, MapPin
} from 'lucide-react';
import ProductListingNavbar from '../../components/customer/catalog/ProductListingNavbar';
import { getCartItemPrice, formatCurrency } from '../../context/cartUtils';
import { addToCartRequest, updateCartItemRequest, removeCartItemRequest } from '../../redux/cartActions';
import { getLocalProductImage, fallbackImage, normalizeProductImage } from '../../utils/productImages';
import { ProductReviews } from '../../features/reviews/pages/ProductReviews';

function ProductDetailImage({ alt, src }) {
  const [failedSrc, setFailedSrc] = useState(null);
  const imageSrc = !src || failedSrc === src ? fallbackImage : src;

  return (
    <img
      alt={alt || 'Product image'}
      className="w-full h-full object-contain mix-blend-multiply"
      onError={() => setFailedSrc(src)}
      src={imageSrc}
    />
  );
}

function ProductSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <ProductListingNavbar />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="aspect-[4/3] animate-pulse rounded-2xl bg-white shadow-sm border border-slate-200" />
          <div className="space-y-4 pt-4">
            <div className="h-6 w-36 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-4/5 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-full animate-pulse rounded bg-slate-200" />
            <div className="h-40 w-full animate-pulse rounded-2xl bg-white shadow-sm border border-slate-200 mt-6" />
          </div>
        </div>
      </main>
    </div>
  );
}

function ProductError() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <ProductListingNavbar />
      <main className="mx-auto max-w-4xl px-4 pb-12 pt-10 text-center sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-10 shadow-sm">
          <h1 className="text-2xl font-extrabold">Product not found</h1>
          <p className="mt-3 text-slate-600">We could not find the product you requested.</p>
          <Link className="mt-6 inline-flex rounded-lg bg-[#1E3A8A] px-5 py-3 text-sm font-bold text-white hover:bg-[#172554]" to="/products">
            Back to products
          </Link>
        </div>
      </main>
    </div>
  );
}

function ProductDetail() {
  const { id: routeId } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  
  const dispatch = useDispatch();
  const { productDetails: product, detailsLoading: isLoading, detailsError: error } = useSelector((state) => state.product);
  
  const productImages =
    Array.isArray(product?.images) && product.images.length > 0
      ? product.images
      : [product?.fullImageUrl || product?.thumbnailUrl || product?.thumbnail].filter(Boolean);

  const [selectedImage, setSelectedImage] = useState("");

  useEffect(() => {
    if (productImages.length > 0) {
      setSelectedImage(productImages[0]);
    }
  }, [product?.id]);

  const cart = useSelector((state) => state.cart.cart);
  const cartItems = Array.isArray(cart) ? cart : (cart?.items || []);

  useEffect(() => {
    if (routeId) {
      dispatch(getProductDetailsRequest(routeId));
    }
  }, [dispatch, routeId]);

  if (isLoading || !routeId) {
    return <ProductSkeleton />;
  }

  if (error || !product) {
    return <ProductError />;
  }

  const name = product.name || 'Product name not available';
  const category = product.category || 'Category not available';
  const vendor = product.vendorName || product.vendor || 'Vendor not available';
  
  const numPrice = Number(product.price || 0);
  const numDiscountPrice = Number(product.discountPrice || 0);
  const hasValidDiscount = numDiscountPrice > 0 && numDiscountPrice < numPrice;

  const price = formatCurrency(numPrice);
  const discountedPrice = formatCurrency(hasValidDiscount ? numDiscountPrice : numPrice);
  const shortDescription = product.shortDescription || 'No short description available';
  const description = product.longDescription || product.description || 'No description available';
  const status = product.status || (product.inStock === false ? 'Out of Stock' : 'In Stock');
  const unit = product.unit || 'Unit';
  
  const discountVal = hasValidDiscount
    ? Math.round(((numPrice - numDiscountPrice) / numPrice) * 100)
    : product.discountPercent;
  
  const cartItem = cartItems.find((item) => {
    const cartName = (item.productName || item.productname || item.name || '').toLowerCase();
    const prodName = (product.ProductName || product.name || '').toLowerCase();
    return cartName === prodName && prodName !== '';
  });
  const isProductInCart = !!cartItem;
  const displayQuantity = isProductInCart ? (cartItem.quantity || 1) : quantity;

  const handleCartAction = () => {
    if (isProductInCart) {
      navigate('/cart');
      return;
    }
    dispatch(addToCartRequest({ productname: product.ProductName || product.name, quantity }));
  };

  const handleDecreaseQuantity = () => {
    if (isProductInCart) {
      if (cartItem && (cartItem.quantity || 1) > 1) {
        dispatch(updateCartItemRequest({
          cartitemID: cartItem.id || cartItem.cartItemId || cartItem.cartitemID || cartItem._id,
          productname: product.ProductName || product.name,
          quantity: (cartItem.quantity || 1) - 1
        }));
      } else if (cartItem) {
        dispatch(removeCartItemRequest(cartItem.id || cartItem.cartItemId || cartItem.cartitemID || cartItem._id));
      }
    } else {
      setQuantity((value) => Math.max(1, value - 1));
    }
  };

  const handleIncreaseQuantity = () => {
    if (isProductInCart) {
      if (cartItem) {
        dispatch(updateCartItemRequest({
          cartitemID: cartItem.id || cartItem.cartItemId || cartItem.cartitemID || cartItem._id,
          productname: product.ProductName || product.name,
          quantity: (cartItem.quantity || 1) + 1
        }));
      }
    } else {
      setQuantity((value) => value + 1);
    }
  };


  const resolveImageUrl = (product) => {
    return getLocalProductImage(product);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <ProductListingNavbar />
      <main className="mx-auto max-w-7xl px-4 pb-8 pt-4 sm:px-6 lg:px-8">
        
        {/* Back Navigation */}
        <Link 
          to="/products" 
          className="inline-flex items-center gap-2 rounded-full bg-slate-100/80 px-4 py-2.5 text-[13px] font-bold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-all mb-6 group w-max"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Products
        </Link>

        {/* Top Layout */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] items-start">
          
          {/* Image Column */}
          <div className="flex flex-col gap-4 w-full h-full max-h-[800px]">
            <div className="relative w-full flex items-center justify-center rounded-[16px] border border-slate-200 bg-[#F8FAFC] p-6 lg:p-10 overflow-hidden shadow-sm min-h-[350px] lg:min-h-[500px] max-h-[600px]">
              <button className="absolute top-3 right-3 p-1.5 rounded-full border border-slate-200 text-slate-500 hover:bg-white transition-colors bg-white/80 backdrop-blur-sm z-10 shadow-sm">
                <Expand className="h-4 w-4" />
              </button>
              <div className="w-full h-full flex items-center justify-center">
                <ProductDetailImage alt={name} src={normalizeProductImage(selectedImage)} />
              </div>
            </div>

            {/* Thumbnails */}
            {productImages.length > 1 && (
              <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden transition-all bg-[#F8FAFC] ${
                      selectedImage === img 
                        ? 'border-[#1E3A8A] shadow-md opacity-100' 
                        : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                    }`}
                  >
                    <img
                      src={normalizeProductImage(img)}
                      alt={`${name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Column (Unified Card) */}
          <div className="flex flex-col rounded-[16px] border border-slate-200 bg-white p-6 md:p-8 shadow-sm h-full justify-between max-h-[600px] overflow-y-auto hide-scrollbar">
            
            <div>
              {/* Title & Short Desc */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2 text-[11px] text-[#EA580C] font-bold uppercase tracking-wider">
                  {category}
                </div>
                <h1 className="text-2xl font-extrabold leading-tight text-[#0F172A] sm:text-[32px] mb-2">
                  {name}
                </h1>
                <p className="text-[14px] leading-relaxed text-slate-500">
                  {shortDescription}
                </p>
              </div>

              <hr className="border-slate-100 mb-5" />

              {/* Price & Stock */}
              <div className="mb-5">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-[32px] font-extrabold text-[#0F172A] leading-none tracking-tight">
                    {discountedPrice}
                  </span>
                  {hasValidDiscount && price !== discountedPrice && (
                    <span className="text-lg font-medium text-slate-400 line-through">
                      {price}
                    </span>
                  )}
                  {discountVal ? (
                    <span className="inline-flex items-center rounded-sm bg-red-50 px-2 py-0.5 text-[12px] font-bold text-red-600 border border-red-100">
                      {discountVal}% OFF
                    </span>
                  ) : null}
                </div>
                <p className="text-[12px] text-slate-500 mb-3">
                  Inclusive of all taxes. Sold per <span className="font-bold text-slate-700">{unit}</span>.
                </p>
                
                <div className="flex items-center gap-2">
                  {status === 'In Stock' ? (
                    <span className="inline-flex items-center gap-1.5 text-[13px] font-bold text-emerald-700">
                      <CheckCircle2 className="h-4 w-4" />
                      In Stock
                    </span>
                  ) : (
                    <span className="text-[13px] font-bold text-red-600">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>

              {/* Vendor Profile */}
              <div className="flex items-center gap-3 py-4 mb-5 border-y border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-500 shrink-0">
                  <Store className="h-4 w-4" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Sold By</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[14px] font-bold text-[#0F172A]">{vendor}</span>
                    <span className="inline-flex items-center gap-1 rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-700 ml-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Verified
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buy Box */}
            <div className="mt-2">
              {/* Shipping info small */}
              <div className="flex flex-col gap-2 text-[12px] text-slate-600 mb-5">
                 <div className="flex items-center gap-2">
                   <RotateCcw className="h-4 w-4 text-slate-400" />
                   <span><strong>7 Day</strong> Return Policy</span>
                 </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 items-center">
                {isProductInCart && (
                  <div className="flex items-center h-12 w-full sm:w-32 bg-white border border-slate-300 rounded-lg overflow-hidden shadow-sm shrink-0">
                    <button onClick={handleDecreaseQuantity} className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="flex-1 text-center text-[14px] font-bold text-[#0F172A] border-x border-slate-200 h-full flex items-center justify-center bg-slate-50/50">{displayQuantity}</span>
                    <button onClick={handleIncreaseQuantity} className="w-10 h-full flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors">
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <button 
                  onClick={handleCartAction} 
                  className="flex-1 w-full flex items-center justify-center h-12 rounded-lg bg-[#1E3A8A] text-white font-bold text-[14px] gap-2 transition-colors hover:bg-[#172554] shadow-sm"
                >
                  <ShoppingCart className="h-4 w-4" />
                  {isProductInCart ? 'Go to Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Details Section */}
        <div className="mt-6 rounded-[16px] border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Product Description */}
              <div>
                <h3 className="text-[15px] font-bold text-[#0F172A] mb-3">Product Description</h3>
                <div className="text-[13px] leading-relaxed text-slate-600 space-y-3">
                  <p>{description}</p>
                  <p>
                    The {unit} packaging is ideal for large-scale procurement, offering significant efficiency 
                    and a long-lasting, high-quality finish for professional use.
                  </p>
                </div>
              </div>

              {/* Tech Specs */}
              <div>
                <h3 className="text-[15px] font-bold text-[#0F172A] mb-3">Technical Specifications</h3>
                {product.technicalSpecifications && Object.keys(product.technicalSpecifications).length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-3">
                    {Object.entries(product.technicalSpecifications).map(([key, value]) => (
                      <div key={key} className="bg-slate-50 rounded-lg p-3 border border-slate-100 flex items-start gap-2.5">
                        <Box className="h-4 w-4 text-[#1E3A8A] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="text-[13px] font-medium text-slate-700 mt-0.5">{value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[13px] italic text-slate-500">No technical specifications available.</p>
                )}
              </div>
            </div>
          </div>
          
          <ProductReviews productId={product.id || product._id || id} />
        </div>

      </main>

      {/* Footer */}
      <footer className="bg-slate-100 border-t border-slate-200 py-4 mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-1">
            <span className="text-[14px] font-bold tracking-tight text-[#1E3A8A]">Infra</span>
            <span className="text-[14px] font-bold tracking-tight text-[#EA580C]">Mart</span>
            <span className="text-[10px] text-slate-500 ml-2">© 2024 InfraMart Industrial Solutions. All rights reserved.</span>
          </div>
          <div className="flex gap-5 text-[11px] font-medium text-slate-500">
            <Link to="#" className="hover:text-slate-800 transition-colors">About Us</Link>
            <Link to="#" className="hover:text-slate-800 transition-colors">Shipping Policy</Link>
            <Link to="#" className="hover:text-slate-800 transition-colors">Terms</Link>
            <Link to="#" className="hover:text-slate-800 transition-colors">Contact Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default ProductDetail;

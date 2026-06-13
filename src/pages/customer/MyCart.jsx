import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Minus, Plus, ShoppingCart, Tag } from 'lucide-react';
import ProductListingNavbar from '../../components/customer/catalog/ProductListingNavbar';
import { useDispatch, useSelector } from 'react-redux';
import { getCartRequest, updateCartItemRequest, removeCartItemRequest } from '../../redux/cartActions';
import { BACKEND_URL } from '../../services/apiConstants';
import { formatCurrency, getCartItemPrice } from '../../context/cartUtils';
import { getProductsRequest } from '../../redux/productActions';
import { getLocalProductImage, fallbackImage } from '../../utils/productImages';

function CartImage({ alt, src }) {
  const [failedSrc, setFailedSrc] = useState(false);

  return (
    <img
      alt={alt || 'Product image'}
      className="max-h-full max-w-full object-contain mix-blend-multiply"
      onError={() => setFailedSrc(true)}
      src={!src || failedSrc ? fallbackImage : src}
    />
  );
}

function EmptyCart() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-orange-50 text-[#F97316]">
        <ShoppingCart className="h-7 w-7" />
      </div>
      <h1 className="mt-5 text-2xl font-extrabold text-[#0F172A]">Your cart is empty</h1>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-600">
        Add cement, steel, tools, and site essentials to prepare your order.
      </p>
      <Link
        className="mt-6 inline-flex min-h-11 items-center justify-center rounded-lg bg-[#1E3A8A] px-5 text-sm font-extrabold text-white hover:bg-[#172554]"
        to="/products"
      >
        Continue Shopping
      </Link>
    </div>
  );
}

function MyCart() {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.cart);
  const { products = [] } = useSelector((state) => state.product);

  useEffect(() => {
    dispatch(getCartRequest());
    dispatch(getProductsRequest());
  }, [dispatch]);

  const cartItems = Array.isArray(cart) ? cart : (cart?.data?.items || cart?.items || []);
  const subtotal = cartItems.reduce((sum, item) => sum + getCartItemPrice(item) * (item.quantity || 1), 0);
  const discount = cart?.data?.discount || cart?.discount || 0;
  const deliveryCharge = cart?.data?.deliveryCharge || cart?.deliveryCharge || 0;
  const grandTotal = subtotal - discount + deliveryCharge;

  const decreaseQuantity = (id) => {
    const item = cartItems.find(i => (i.id || i.cartItemId) === id);
    if (item) {
      if (item.quantity > 1) {
        dispatch(updateCartItemRequest({ 
          cartitemID: id,
          productname: item.name || item.productName,
          quantity: item.quantity - 1 
        }));
      } else {
        dispatch(removeCartItemRequest(id));
      }
    }
  };

  const increaseQuantity = (id) => {
    const item = cartItems.find(i => (i.id || i.cartItemId) === id);
    if (item) {
      dispatch(updateCartItemRequest({ 
        cartitemID: id,
        productname: item.name || item.productName,
        quantity: item.quantity + 1 
      }));
    }
  };

  const removeFromCart = (id) => {
    dispatch(removeCartItemRequest(id));
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <ProductListingNavbar />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        
        {/* New Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-[#1E3A8A]">My Cart</h1>
            <span className="rounded-full bg-slate-200 px-3 py-1 text-xs font-bold text-slate-600">
              {cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'}
            </span>
          </div>
          <Link
            className="flex items-center gap-1.5 text-sm font-bold text-[#1E3A8A] hover:text-[#0F172A] transition-colors"
            to="/products"
          >
            <ArrowLeft className="h-4 w-4" />
            Continue Shopping
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div>
            <EmptyCart />
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] items-start">
            <section className="grid gap-4">
              {cartItems.map((item) => {
                const itemPrice = getCartItemPrice(item);
                const itemSubtotal = itemPrice * item.quantity;
                const matchedProduct = products.find(p => (p.ProductName || p.name || '').toLowerCase() === (item.productName || item.name || '').toLowerCase()) || {};

                const displayCategory = matchedProduct.category || item.category || 'Material';
                const displayName = matchedProduct.ProductName || matchedProduct.name || item.productName || item.name || 'Product name not available';
                const displayVendor = matchedProduct.vendor || item.vendor || 'InfraMart Direct';
                const displayUnit = matchedProduct.unit || item.unit;

                const resolveImageUrl = (item, product) => {
                  return getLocalProductImage(product || item);
                };

                const itemId = item.id || item.cartItemId;

                return (
                  <article className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-6 rounded-lg border border-slate-200 bg-white p-5 shadow-sm" key={itemId}>
                    <div className="flex aspect-square items-center justify-center rounded-lg bg-[#F8FAFC] p-4">
                      <CartImage alt={displayName} src={resolveImageUrl(item, matchedProduct)} />
                    </div>

                    <div className="flex flex-col">
                      <div className="flex-1">
                        <span className="inline-block rounded bg-orange-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-[#EA580C] mb-2">
                          {displayCategory}
                        </span>
                        <h2 className="text-[17px] font-extrabold text-[#0F172A] leading-tight mb-1">{displayName}</h2>
                        <p className="text-[13px] font-medium text-slate-500">Vendor: {displayVendor}</p>
                        {displayUnit && <p className="text-[13px] font-medium text-slate-500">Unit: {displayUnit}</p>}
                      </div>

                      <div className="mt-4 flex flex-wrap sm:flex-nowrap items-center justify-between border-t border-slate-100 pt-4 gap-4">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Unit Price</p>
                          <p className="text-[15px] font-extrabold text-[#0F172A]">{formatCurrency(itemPrice)}</p>
                        </div>

                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1 text-center">Quantity</p>
                          <div className="inline-flex h-8 items-center rounded border border-slate-200 bg-white">
                            <button className="grid h-8 w-8 place-items-center text-slate-600 hover:bg-slate-50" onClick={() => decreaseQuantity(itemId)} type="button">
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="min-w-8 text-center text-[13px] font-extrabold">{item.quantity}</span>
                            <button className="grid h-8 w-8 place-items-center text-slate-600 hover:bg-slate-50" onClick={() => increaseQuantity(itemId)} type="button">
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        <div className="sm:text-right w-full sm:w-auto">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">Subtotal</p>
                          <p className="text-[17px] font-extrabold text-[#1E3A8A]">{formatCurrency(itemSubtotal)}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="grid gap-4">
              {/* Coupon Section */}
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#1E3A8A]">
                  <Tag className="h-4 w-4" /> Apply Coupons
                </h3>
                <div className="flex">
                  <input
                    type="text"
                    placeholder="Enter Coupon Code"
                    className="w-full rounded-l-md border border-slate-200 px-3 py-2 text-sm text-slate-700 outline-none focus:border-[#1E3A8A] focus:ring-1 focus:ring-[#1E3A8A]"
                  />
                  <button className="rounded-r-md bg-blue-50 px-4 py-2 text-xs font-extrabold text-[#1E3A8A] transition hover:bg-blue-100">
                    APPLY
                  </button>
                </div>
                <p className="mt-2 text-[11px] font-semibold text-slate-500">
                  <span className="text-[#1E3A8A] cursor-pointer hover:underline">Login</span> to see available offers
                </p>
              </div>

              {/* Order Summary */}
              <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
                <h2 className="text-lg font-extrabold text-[#0F172A] mb-4">Order Summary <span className="text-sm font-semibold text-slate-500">({cartItems.length} Items)</span></h2>
                
                <div className="grid gap-3 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="font-medium text-slate-600">Total MRP</span>
                    <span className="font-extrabold text-[#0F172A]">{formatCurrency(subtotal + discount)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium text-[#10B981]">Discount on MRP <span className="text-[10px] text-slate-400 font-semibold cursor-pointer hover:underline ml-1">Know More</span></span>
                    <span className="font-extrabold text-[#10B981]">- {formatCurrency(discount)}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium text-slate-600">Coupon Discount</span>
                    <span className="font-extrabold text-[#1E3A8A] cursor-pointer hover:underline">Apply Coupon</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="font-medium text-slate-600">Delivery Charge</span>
                    <span className="font-extrabold text-[#10B981]">{deliveryCharge ? formatCurrency(deliveryCharge) : 'Free'}</span>
                  </div>
                  
                  <div className="mt-2 flex justify-between gap-4 border-t border-slate-200 pt-4 items-center">
                    <span className="text-base font-extrabold text-[#0F172A]">Grand Total</span>
                    <span className="text-2xl font-extrabold text-[#1E3A8A]">{formatCurrency(grandTotal)}</span>
                  </div>
                </div>

                <div className="mt-6 grid gap-3">
                  <Link 
                    className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#EA580C] px-4 text-sm font-extrabold text-white transition hover:bg-[#C2410C] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed" 
                    to={cartItems.length > 0 ? "/checkout" : "#"}
                    onClick={(e) => cartItems.length === 0 && e.preventDefault()}
                  >
                    Proceed to Checkout <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  
                  {cartItems.length > 0 && (
                    <div 
                      className="mt-2 text-xs font-bold text-red-500 hover:text-red-700 hover:underline block text-center cursor-pointer transition-colors"
                      onClick={() => {
                        cartItems.forEach((item) => {
                          dispatch(removeCartItemRequest(item.id || item.cartItemId));
                        });
                      }}
                    >
                      Clear Entire Cart
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default MyCart;



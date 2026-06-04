import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import Navbar from '../../components/landing/Navbar';
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

  const cartItems = Array.isArray(cart) ? cart : (cart?.items || []);
  const subtotal = cart?.subtotal || cartItems.reduce((sum, item) => sum + getCartItemPrice(item) * (item.quantity || 1), 0);
  const discount = cart?.discount || 0;
  const deliveryCharge = cart?.deliveryCharge || 99;
  const grandTotal = cart?.grandTotal || subtotal - discount + deliveryCharge;

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
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
          <Link className="hover:text-[#F97316]" to="/">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">My Cart</span>
        </nav>

        <Link
          className="mt-5 inline-flex min-h-10 w-fit items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-extrabold text-[#1E3A8A] shadow-sm transition hover:bg-slate-50"
          to="/products"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>

        <div className="mt-5 flex flex-col gap-2">
          <p className="text-xs font-extrabold uppercase tracking-widest text-[#F97316]">InfraMart Cart</p>
          <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">My Cart</h1>
          <p className="text-sm text-slate-600">Review materials, update quantities, and confirm your order summary.</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="mt-8">
            <EmptyCart />
          </div>
        ) : (
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
            <section className="grid gap-4">
              {cartItems.map((item) => {
                const itemPrice = getCartItemPrice(item);
                const itemSubtotal = itemPrice * item.quantity;
                const matchedProduct = products.find(p => (p.ProductName || p.name || '').toLowerCase() === (item.productName || item.name || '').toLowerCase()) || {};

                const displayCategory = matchedProduct.category || item.category || 'Material';
                const displayName = matchedProduct.ProductName || matchedProduct.name || item.productName || item.name || 'Product name not available';
                const displayVendor = matchedProduct.vendor || item.vendor || 'InfraMart Direct';
                const displayUnit = matchedProduct.unit || item.unit || 'Unit not available';

                const resolveImageUrl = (item, product) => {
                  return getLocalProductImage(product || item);
                };

                const itemId = item.id || item.cartItemId;

                return (
                  <article className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[130px_1fr] sm:p-5" key={itemId}>
                    <div className="flex aspect-square items-center justify-center rounded-xl bg-slate-50 p-4">
                      <CartImage alt={displayName} src={resolveImageUrl(item, matchedProduct)} />
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div className="min-w-0">
                          <p className="text-xs font-extrabold uppercase tracking-widest text-[#F97316]">{displayCategory}</p>
                          <h2 className="mt-1 text-lg font-extrabold text-[#0F172A]">{displayName}</h2>
                          <p className="mt-2 text-sm font-semibold text-slate-500">Vendor: {displayVendor}</p>
                          <p className="mt-1 text-sm text-slate-500">Unit: {displayUnit}</p>
                        </div>

                        <button
                          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-red-100 bg-red-50 px-3 text-xs font-extrabold text-red-700 transition hover:bg-red-100"
                          onClick={() => removeFromCart(itemId)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4" />
                          Remove
                        </button>
                      </div>

                      <div className="mt-5 grid gap-4 sm:grid-cols-3 sm:items-center">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Unit Price</p>
                          <p className="mt-1 text-lg font-extrabold text-[#1E3A8A]">{formatCurrency(itemPrice)}</p>
                        </div>

                        <div>
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Quantity</p>
                          <div className="mt-1 inline-flex h-10 items-center rounded-lg border border-slate-200 bg-white">
                            <button className="grid h-10 w-10 place-items-center text-slate-700 hover:bg-slate-50" onClick={() => decreaseQuantity(itemId)} type="button">
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="min-w-10 text-center text-sm font-extrabold">{item.quantity}</span>
                            <button className="grid h-10 w-10 place-items-center text-slate-700 hover:bg-slate-50" onClick={() => increaseQuantity(itemId)} type="button">
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="sm:text-right">
                          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">Subtotal</p>
                          <p className="mt-1 text-xl font-extrabold text-[#0F172A]">{formatCurrency(itemSubtotal)}</p>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>

            <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-24">
              <h2 className="text-lg font-extrabold text-[#0F172A]">Order Summary</h2>
              <div className="mt-5 grid gap-3 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-slate-500">Subtotal</span>
                  <span className="font-extrabold text-slate-900">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-slate-500">Discount</span>
                  <span className="font-extrabold text-emerald-700">-{formatCurrency(discount)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-slate-500">Delivery charge</span>
                  <span className="font-extrabold text-slate-900">{deliveryCharge ? formatCurrency(deliveryCharge) : 'Free'}</span>
                </div>
                <div className="mt-2 flex justify-between gap-4 border-t border-slate-200 pt-4">
                  <span className="text-base font-extrabold text-slate-900">Grand total</span>
                  <span className="text-2xl font-extrabold text-[#1E3A8A]">{formatCurrency(grandTotal)}</span>
                </div>
              </div>

              <div className="mt-6 grid gap-3">
                <Link className="inline-flex min-h-11 items-center justify-center rounded-lg border border-slate-200 bg-white px-4 text-sm font-extrabold text-[#1E3A8A] hover:bg-slate-50" to="/products">
                  Continue Shopping
                </Link>
                <Link 
                  className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#F97316] px-4 text-sm font-extrabold text-white hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed" 
                  to={cartItems.length > 0 ? "/checkout" : "#"}
                  onClick={(e) => cartItems.length === 0 && e.preventDefault()}
                >
                  Proceed to Checkout
                </Link>
              </div>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}

export default MyCart;

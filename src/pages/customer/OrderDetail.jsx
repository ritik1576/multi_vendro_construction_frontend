import { useMemo, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetailsRequest } from '../../redux/orderActions';
import { ChevronRight, Clock, MapPin, CreditCard, ArrowLeft, Package } from 'lucide-react';

import Navbar from '../../components/landing/Navbar';
import OrderStatusProgress from '../../components/customer/OrderStatusProgress';
import { formatCurrency, getCartItemPrice } from '../../context/cartUtils';

function DetailBlock({ title, children }) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-sm font-extrabold uppercase tracking-widest text-slate-500">
        {title}
      </h2>
      <div className="mt-4 text-sm leading-6 text-slate-700">{children}</div>
    </section>
  );
}

function OrderDetail() {
  const { id: orderId = 'ORD-1001' } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (orderId) {
      dispatch(getOrderDetailsRequest(orderId));
    }
  }, [dispatch, orderId]);

  useEffect(() => {
    // Hide specific nav links on order detail page
    const hideLinksByText = (text) => {
      const allLinks = document.querySelectorAll('nav a');
      const linkElements = [];
      allLinks.forEach((link) => {
        if (link.textContent.trim() === text) {
          link.style.display = 'none';
          linkElements.push(link);
        }
      });
      return linkElements;
    };
    
    const hiddenLinks = [
      ...hideLinksByText('Categories'),
      ...hideLinksByText('Bulk Orders'),
      ...hideLinksByText('Verified Sellers'),
    ];
    
    return () => {
      hiddenLinks.forEach((link) => {
        link.style.display = '';
      });
    };
  }, []);

  // Use real order data from API
  const displayOrder = currentOrder;
  
  const cartItems = displayOrder?.items || [];
  const deliveryCharge = (cartItems.length > 0) ? (displayOrder?.shippingCharge ?? 99) : 0;
  const subtotal = displayOrder?.subtotal ?? cartItems.reduce((sum, item) => sum + (item.price || getCartItemPrice(item)) * (item.quantity || 1), 0);
  const grandTotal = displayOrder?.totalAmount ?? (subtotal + deliveryCharge);
  const orderStatus = displayOrder?.status || 'Processing';

  const vendors = useMemo(
    () => Array.from(new Set(cartItems.map((item) => item.vendor).filter(Boolean))),
    [cartItems]
  );

  const displayVendorName = displayOrder?.vendorName || vendors[0] || 'Order';

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-[#0F172A]">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 pb-12 pt-8 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-slate-500">
          <Link className="hover:text-[#F97316]" to="/">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link className="hover:text-[#F97316]" to="/orders">
            Orders
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-slate-900">Order Detail</span>
        </nav>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-widest text-[#F97316]">
                Order Detail
              </p>
              <h1 className="mt-2 text-3xl font-extrabold tracking-tight md:text-4xl">
                {displayVendorName}
              </h1>
              <p className="mt-2 text-sm text-slate-600">
                Review order items, delivery information, payment status, and vendor progress.
              </p>
            </div>

            <div className="inline-flex w-fit items-center gap-2 rounded-full bg-yellow-100 px-4 py-2 text-sm font-extrabold text-yellow-800">
              <Clock className="h-4 w-4" />
              {orderStatus}
            </div>
          </div>
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <section className="grid gap-6">
            {loading && <p className="text-center text-slate-500">Loading order details...</p>}
            {error && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-lg font-semibold text-[#0F172A]">Unable to load order details</p>
                <p className="mt-2 text-sm text-slate-600">Please check the order ID or try again later.</p>
              </div>
            )}
            {!loading && !error && !displayOrder && (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
                <p className="text-lg font-semibold text-[#0F172A]">Order not found</p>
                <p className="mt-2 text-sm text-slate-600">This order is not available.</p>
              </div>
            )}
            {!loading && displayOrder && (
              <>
            <DetailBlock title="Ordered Items">
              {cartItems.length === 0 ? (
                <div className="rounded-xl bg-slate-50 p-5 text-center">
                  <p className="font-bold text-slate-700">
                    No items in this order.
                  </p>
                  <Link
                    className="mt-4 inline-flex rounded-lg bg-[#1E3A8A] px-4 py-2 text-sm font-extrabold text-white"
                    to="/products"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="grid gap-4">
                  {cartItems.map((item) => {
                    const itemPrice = item.price || getCartItemPrice(item);

                    return (
                      <div
                        className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-4 sm:grid-cols-[1fr_auto]"
                        key={item.id}
                      >
                        <div>
                          <h3 className="text-base font-extrabold text-[#0F172A]">
                            {item.name || 'Product name not available'}
                          </h3>
                          <p className="mt-1 text-sm font-semibold text-slate-500">
                            Vendor: {item.vendor || 'Vendor not available'}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            Qty {item.quantity} x {formatCurrency(itemPrice)} /{' '}
                            {item.unit || 'unit'}
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                            Total
                          </p>
                          <p className="mt-1 text-lg font-extrabold text-[#1E3A8A]">
                            {formatCurrency(itemPrice * item.quantity)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </DetailBlock>

            <div className="grid gap-6 md:grid-cols-2">
              <DetailBlock title="Delivery Address">
                <div className="flex gap-3">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-[#F97316]" />
                  <div>
                    <p className="font-extrabold text-[#0F172A]">
                      {displayOrder?.deliveryAddress?.name || 'Delivery Address'}
                    </p>
                    <p className="mt-1">
                      {displayOrder?.deliveryAddress?.address || 'Address not available'}
                    </p>
                    <p className="mt-1">
                      {displayOrder?.deliveryAddress?.city}, {displayOrder?.deliveryAddress?.state} {displayOrder?.deliveryAddress?.pincode}
                    </p>
                    {displayOrder?.deliveryAddress?.phone && (
                      <p className="mt-1">Contact: {displayOrder.deliveryAddress.phone}</p>
                    )}
                  </div>
                </div>
              </DetailBlock>

              <DetailBlock title="Payment Method">
                <p className="font-extrabold text-[#0F172A]">
                  {displayOrder?.paymentMethod || 'Payment Method'}
                </p>
                <p className="mt-1">
                  {displayOrder?.paymentMethod === 'COD' 
                    ? 'Pay on delivery' 
                    : displayOrder?.paymentMethod === 'UPI'
                    ? 'Pay via UPI'
                    : displayOrder?.paymentMethod === 'Card'
                    ? 'Pay via Credit/Debit Card'
                    : displayOrder?.paymentMethod === 'Net Banking'
                    ? 'Pay via Net Banking'
                    : 'Payment settlement after vendor confirmation.'}
                </p>
              </DetailBlock>
            </div>

            <DetailBlock title="Vendor Information">
              {vendors.length === 0 ? (
                <p>Vendor details will appear after items are added.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {vendors.map((vendor) => (
                    <span
                      className="rounded-full bg-orange-50 px-3 py-1 text-xs font-extrabold text-[#F97316]"
                      key={vendor}
                    >
                      {vendor}
                    </span>
                  ))}
                </div>
              )}
            </DetailBlock>
            </>
            )}
          </section>

          <aside className="grid h-fit gap-6 lg:sticky lg:top-24">
            {displayOrder && (
              <>
            <DetailBlock title="Total Amount">
              <div className="grid gap-3">
                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-slate-500">
                    Items subtotal
                  </span>
                  <span className="font-extrabold text-slate-900">
                    {formatCurrency(subtotal)}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="font-semibold text-slate-500">Delivery</span>
                  <span className="font-extrabold text-slate-900">
                    {deliveryCharge ? formatCurrency(deliveryCharge) : 'Free'}
                  </span>
                </div>

                <div className="mt-2 flex justify-between gap-4 border-t border-slate-200 pt-4">
                  <span className="font-extrabold text-slate-900">
                    Total amount
                  </span>
                  <span className="text-2xl font-extrabold text-[#1E3A8A]">
                    {formatCurrency(grandTotal)}
                  </span>
                </div>
              </div>
            </DetailBlock>

            <OrderStatusProgress currentStep={2} />
            </>
            )}

            <div className="grid gap-3">
              <Link
                to="/orders"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-extrabold text-[#1E3A8A] hover:bg-slate-50"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Orders
              </Link>
              <Link
                to="/products"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 text-sm font-extrabold text-[#1E3A8A] hover:bg-slate-50"
              >
                <Package className="h-4 w-4" />
                Browse Products
              </Link>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

export default OrderDetail;